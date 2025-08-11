"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataSourceManager = void 0;
const types_1 = require("../types");
/**
 * 🇨🇦 Core Data Source Manager
 *
 * Manages all Canadian data sources, handles caching, rate limiting,
 * and data synchronization for the Cost of Living Analyzer.
 */
class DataSourceManager {
    constructor() {
        this.dataSources = new Map();
        this.cache = new Map();
        this.rateLimiters = new Map();
        this.performanceMetrics = new Map();
        this.schedules = new Map();
        this.isRunning = false;
        this.initializeRateLimiters();
    }
    /**
     * Register a new data source
     */
    registerDataSource(name, dataSource, config) {
        this.dataSources.set(name, dataSource);
        this.rateLimiters.set(name, new RateLimiter(config.rateLimit));
        // Set up synchronization schedule
        this.schedules.set(name, {
            source: name,
            frequency: config.updateFrequency,
            lastUpdate: new Date(),
            nextUpdate: this.calculateNextUpdate(config.updateFrequency),
            priority: config.priority,
            retryOnFailure: config.retryOnFailure,
            lastSyncAttempt: new Date(0),
            consecutiveFailures: 0,
            totalSyncs: 0,
            successfulSyncs: 0,
            averageSyncTime: 0
        });
        console.log(`✅ Registered data source: ${name}`);
    }
    /**
     * Fetch data from a specific source and endpoint
     */
    async fetchData(source, endpoint, params, forceRefresh = false) {
        const startTime = Date.now();
        const cacheKey = this.generateCacheKey(source, endpoint, params);
        try {
            // Check cache first (unless force refresh)
            if (!forceRefresh) {
                const cached = this.getCachedData(cacheKey);
                if (cached && !this.isExpired(cached)) {
                    this.recordPerformance(source, Date.now() - startTime, true, true);
                    return cached.data;
                }
            }
            // Check if data source exists
            const dataSource = this.dataSources.get(source);
            if (!dataSource) {
                throw new Error(`Data source '${source}' not found`);
            }
            // Respect rate limits
            await this.waitForRateLimit(source);
            // Fetch fresh data
            const data = await this.makeRequest(dataSource, endpoint, params);
            // Cache the result
            this.cacheData(cacheKey, data, source, endpoint, params);
            // Record performance metrics
            this.recordPerformance(source, Date.now() - startTime, true, false);
            return data;
        }
        catch (error) {
            this.recordPerformance(source, Date.now() - startTime, false, false);
            throw this.createDataSourceError(source, endpoint, error, params);
        }
    }
    /**
     * Get cached data if available and not expired
     */
    getCachedData(cacheKey) {
        const cached = this.cache.get(cacheKey);
        if (!cached)
            return null;
        if (this.isExpired(cached)) {
            this.cache.delete(cacheKey);
            return null;
        }
        return cached;
    }
    /**
     * Check if cached data has expired
     */
    isExpired(cached) {
        return new Date() > cached.expiresAt;
    }
    /**
     * Cache data with TTL
     */
    cacheData(key, data, source, endpoint, params) {
        const ttl = this.getTTLForEndpoint(endpoint);
        const expiresAt = new Date(Date.now() + ttl);
        this.cache.set(key, {
            data,
            timestamp: new Date(),
            expiresAt,
            source,
            endpoint,
            params: params || {}
        });
    }
    /**
     * Generate cache key for request
     */
    generateCacheKey(source, endpoint, params) {
        const paramString = params ? JSON.stringify(params) : '';
        return `${source}:${endpoint}:${paramString}`;
    }
    /**
     * Get TTL for different endpoint types
     */
    getTTLForEndpoint(endpoint) {
        if (endpoint.includes('real-time') || endpoint.includes('rates')) {
            return 5 * 60 * 1000; // 5 minutes
        }
        if (endpoint.includes('daily') || endpoint.includes('market')) {
            return 60 * 60 * 1000; // 1 hour
        }
        if (endpoint.includes('weekly')) {
            return 24 * 60 * 60 * 1000; // 1 day
        }
        if (endpoint.includes('monthly')) {
            return 7 * 24 * 60 * 60 * 1000; // 1 week
        }
        return 24 * 60 * 60 * 1000; // Default: 1 day
    }
    /**
     * Make HTTP request to data source
     */
    async makeRequest(dataSource, endpoint, params) {
        // This is a simplified version - actual implementation would depend
        // on the specific data source interface
        if (typeof dataSource.makeRequest === 'function') {
            return dataSource.makeRequest(endpoint, params);
        }
        throw new Error(`Data source does not support makeRequest method`);
    }
    /**
     * Wait for rate limit to reset
     */
    async waitForRateLimit(source) {
        const limiter = this.rateLimiters.get(source);
        if (limiter) {
            await limiter.waitForToken();
        }
    }
    /**
     * Record performance metrics
     */
    recordPerformance(source, duration, success, cacheHit) {
        if (!this.performanceMetrics.has(source)) {
            this.performanceMetrics.set(source, []);
        }
        this.performanceMetrics.get(source).push({
            timestamp: new Date(),
            duration,
            success,
            source,
            endpoint: 'unknown',
            cacheHit
        });
    }
    /**
     * Create standardized error object
     */
    createDataSourceError(source, endpoint, error, params) {
        return {
            source,
            endpoint,
            message: error.message || 'Unknown error',
            statusCode: error.statusCode || error.status,
            timestamp: new Date(),
            retryable: this.isRetryableError(error),
            params: params || {}
        };
    }
    /**
     * Determine if error is retryable
     */
    isRetryableError(error) {
        const retryableStatuses = [408, 429, 500, 502, 503, 504];
        return retryableStatuses.includes(error.statusCode || error.status);
    }
    /**
     * Calculate next update time based on frequency
     */
    calculateNextUpdate(frequency) {
        const now = new Date();
        switch (frequency) {
            case types_1.UpdateFrequency.REAL_TIME:
                return new Date(now.getTime() + 60000); // 1 minute
            case types_1.UpdateFrequency.HOURLY:
                return new Date(now.getTime() + 60 * 60 * 1000);
            case types_1.UpdateFrequency.DAILY:
                return new Date(now.getTime() + 24 * 60 * 60 * 1000);
            case types_1.UpdateFrequency.WEEKLY:
                return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            case types_1.UpdateFrequency.MONTHLY:
                return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
            case types_1.UpdateFrequency.QUARTERLY:
                return new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
            case types_1.UpdateFrequency.ANNUALLY:
                return new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
            default:
                return new Date(now.getTime() + 24 * 60 * 60 * 1000);
        }
    }
    /**
     * Initialize rate limiters for all data sources
     */
    initializeRateLimiters() {
        // This would be populated when data sources are registered
    }
    /**
     * Get performance metrics for a source
     */
    getPerformanceMetrics(source) {
        return this.performanceMetrics.get(source) || [];
    }
    /**
     * Get cache statistics
     */
    getCacheStats() {
        let total = 0;
        let expired = 0;
        let valid = 0;
        for (const [, cached] of this.cache) {
            total++;
            if (this.isExpired(cached)) {
                expired++;
            }
            else {
                valid++;
            }
        }
        return { total, expired, valid };
    }
    /**
     * Clear expired cache entries
     */
    clearExpiredCache() {
        for (const [key, cached] of this.cache) {
            if (this.isExpired(cached)) {
                this.cache.delete(key);
            }
        }
    }
    /**
     * Get all registered data sources
     */
    getDataSources() {
        return Array.from(this.dataSources.keys());
    }
    /**
     * Get a specific data source by name
     */
    getDataSource(name) {
        return this.dataSources.get(name);
    }
    /**
     * Check health of all data sources
     */
    async checkAllHealth() {
        const healthResults = new Map();
        for (const [name, dataSource] of this.dataSources) {
            try {
                const health = await dataSource.healthCheck();
                healthResults.set(name, health);
            }
            catch (error) {
                healthResults.set(name, {
                    status: 'unhealthy',
                    error: error.message || 'Unknown error',
                    lastChecked: new Date()
                });
            }
        }
        return healthResults;
    }
    /**
     * Start data synchronization service
     */
    async startSynchronization() {
        if (this.isRunning) {
            console.log('Synchronization service already running');
            return;
        }
        this.isRunning = true;
        console.log('🚀 Starting data synchronization service...');
        while (this.isRunning) {
            try {
                await this.runSynchronizationCycle();
                await this.sleep(60000); // Wait 1 minute between cycles
            }
            catch (error) {
                console.error('Synchronization cycle failed:', error);
                await this.sleep(300000); // Wait 5 minutes on error
            }
        }
    }
    /**
     * Stop data synchronization service
     */
    stopSynchronization() {
        this.isRunning = false;
        console.log('🛑 Stopping data synchronization service...');
    }
    /**
     * Run one synchronization cycle
     */
    async runSynchronizationCycle() {
        const now = new Date();
        for (const [source, schedule] of this.schedules) {
            if (now >= schedule.nextUpdate) {
                try {
                    await this.syncDataSource(source);
                    this.updateSchedule(source, now);
                }
                catch (error) {
                    console.error(`Failed to sync ${source}:`, error);
                    if (schedule.retryOnFailure) {
                        this.scheduleRetry(source, schedule);
                    }
                }
            }
        }
    }
    /**
     * Sync a specific data source
     */
    async syncDataSource(source) {
        const dataSource = this.dataSources.get(source);
        if (!dataSource)
            return;
        console.log(`🔄 Syncing data source: ${source}`);
        // This would implement the actual sync logic based on the data source
        // For now, we'll just update the last update time
        const schedule = this.schedules.get(source);
        if (schedule) {
            schedule.lastUpdate = new Date();
        }
    }
    /**
     * Update synchronization schedule
     */
    updateSchedule(source, lastUpdate) {
        const schedule = this.schedules.get(source);
        if (schedule) {
            schedule.lastUpdate = lastUpdate;
            schedule.nextUpdate = this.calculateNextUpdate(schedule.frequency);
        }
    }
    /**
     * Schedule a retry for failed sync
     */
    scheduleRetry(source, schedule) {
        const retryDelay = 15 * 60 * 1000; // 15 minutes
        schedule.nextUpdate = new Date(Date.now() + retryDelay);
        console.log(`🔄 Scheduled retry for ${source} in 15 minutes`);
    }
    /**
     * Utility function for sleeping
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
exports.DataSourceManager = DataSourceManager;
/**
 * Rate limiter for API requests
 */
class RateLimiter {
    constructor(config) {
        this.maxTokens = config.requests;
        this.tokens = config.requests;
        this.refillRate = config.requests / config.window;
        this.lastRefill = Date.now();
    }
    async waitForToken() {
        this.refillTokens();
        if (this.tokens > 0) {
            this.tokens--;
            return;
        }
        // Wait for next token
        const waitTime = (1 / this.refillRate) * 1000;
        await new Promise(resolve => setTimeout(resolve, waitTime));
        return this.waitForToken();
    }
    refillTokens() {
        const now = Date.now();
        const timePassed = (now - this.lastRefill) / 1000;
        const tokensToAdd = timePassed * this.refillRate;
        this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd);
        this.lastRefill = now;
    }
}
//# sourceMappingURL=DataSourceManager.js.map