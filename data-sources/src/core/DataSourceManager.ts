import { 
  DataSource, 
  DataSourceConfig, 
  CachedData, 
  DataSourceError, 
  PerformanceMetrics,
  UpdateFrequency,
  DataSourceSchedule
} from '../types';

/**
 * 🇨🇦 Core Data Source Manager
 * 
 * Manages all Canadian data sources, handles caching, rate limiting,
 * and data synchronization for the Cost of Living Analyzer.
 */
export class DataSourceManager {
  private dataSources: Map<string, DataSource> = new Map();
  private cache: Map<string, CachedData> = new Map();
  private rateLimiters: Map<string, RateLimiter> = new Map();
  private performanceMetrics: Map<string, PerformanceMetrics[]> = new Map();
  private schedules: Map<string, DataSourceSchedule> = new Map();
  private isRunning: boolean = false;

  constructor() {
    this.initializeRateLimiters();
  }

  /**
   * Register a new data source
   */
  registerDataSource(name: string, dataSource: DataSource, config: DataSourceConfig): void {
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
  async fetchData<T>(
    source: string,
    endpoint: string,
    params?: Record<string, any>,
    forceRefresh: boolean = false
  ): Promise<T> {
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
      const data = await this.makeRequest<T>(dataSource, endpoint, params);
      
      // Cache the result
      this.cacheData(cacheKey, data, source, endpoint, params);
      
      // Record performance metrics
      this.recordPerformance(source, Date.now() - startTime, true, false);
      
      return data;
    } catch (error) {
      this.recordPerformance(source, Date.now() - startTime, false, false);
      throw this.createDataSourceError(source, endpoint, error, params);
    }
  }

  /**
   * Get cached data if available and not expired
   */
  private getCachedData(cacheKey: string): CachedData | null {
    const cached = this.cache.get(cacheKey);
    if (!cached) return null;
    
    if (this.isExpired(cached)) {
      this.cache.delete(cacheKey);
      return null;
    }
    
    return cached;
  }

  /**
   * Check if cached data has expired
   */
  private isExpired(cached: CachedData): boolean {
    return new Date() > cached.expiresAt;
  }

  /**
   * Cache data with TTL
   */
  private cacheData<T>(
    key: string, 
    data: T, 
    source: string, 
    endpoint: string, 
    params?: Record<string, any>
  ): void {
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
  private generateCacheKey(source: string, endpoint: string, params?: Record<string, any>): string {
    const paramString = params ? JSON.stringify(params) : '';
    return `${source}:${endpoint}:${paramString}`;
  }

  /**
   * Get TTL for different endpoint types
   */
  private getTTLForEndpoint(endpoint: string): number {
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
  private async makeRequest<T>(
    dataSource: DataSource, 
    endpoint: string, 
    params?: Record<string, any>
  ): Promise<T> {
    // This is a simplified version - actual implementation would depend
    // on the specific data source interface
    if (typeof (dataSource as any).makeRequest === 'function') {
      return (dataSource as any).makeRequest(endpoint, params);
    }
    
    throw new Error(`Data source does not support makeRequest method`);
  }

  /**
   * Wait for rate limit to reset
   */
  private async waitForRateLimit(source: string): Promise<void> {
    const limiter = this.rateLimiters.get(source);
    if (limiter) {
      await limiter.waitForToken();
    }
  }

  /**
   * Record performance metrics
   */
  private recordPerformance(
    source: string, 
    duration: number, 
    success: boolean, 
    cacheHit: boolean
  ): void {
    if (!this.performanceMetrics.has(source)) {
      this.performanceMetrics.set(source, []);
    }
    
    this.performanceMetrics.get(source)!.push({
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
  private createDataSourceError(
    source: string, 
    endpoint: string, 
    error: any, 
    params?: Record<string, any>
  ): DataSourceError {
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
  private isRetryableError(error: any): boolean {
    const retryableStatuses = [408, 429, 500, 502, 503, 504];
    return retryableStatuses.includes(error.statusCode || error.status);
  }

  /**
   * Calculate next update time based on frequency
   */
  private calculateNextUpdate(frequency: UpdateFrequency): Date {
    const now = new Date();
    
    switch (frequency) {
      case UpdateFrequency.REAL_TIME:
        return new Date(now.getTime() + 60000); // 1 minute
      case UpdateFrequency.HOURLY:
        return new Date(now.getTime() + 60 * 60 * 1000);
      case UpdateFrequency.DAILY:
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
      case UpdateFrequency.WEEKLY:
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      case UpdateFrequency.MONTHLY:
        return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      case UpdateFrequency.QUARTERLY:
        return new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
      case UpdateFrequency.ANNUALLY:
        return new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
      default:
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    }
  }

  /**
   * Initialize rate limiters for all data sources
   */
  private initializeRateLimiters(): void {
    // This would be populated when data sources are registered
  }

  /**
   * Get performance metrics for a source
   */
  getPerformanceMetrics(source: string): PerformanceMetrics[] {
    return this.performanceMetrics.get(source) || [];
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { total: number; expired: number; valid: number } {
    let total = 0;
    let expired = 0;
    let valid = 0;
    
    for (const [, cached] of this.cache) {
      total++;
      if (this.isExpired(cached)) {
        expired++;
      } else {
        valid++;
      }
    }
    
    return { total, expired, valid };
  }

  /**
   * Clear expired cache entries
   */
  clearExpiredCache(): void {
    for (const [key, cached] of this.cache) {
      if (this.isExpired(cached)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get all registered data sources
   */
  getDataSources(): string[] {
    return Array.from(this.dataSources.keys());
  }

  /**
   * Get a specific data source by name
   */
  getDataSource(name: string): DataSource | undefined {
    return this.dataSources.get(name);
  }

  /**
   * Check health of all data sources
   */
  async checkAllHealth(): Promise<Map<string, any>> {
    const healthResults = new Map();
    
    for (const [name, dataSource] of this.dataSources) {
      try {
        const health = await dataSource.healthCheck();
        healthResults.set(name, health);
      } catch (error) {
        healthResults.set(name, {
          status: 'unhealthy',
          error: (error as any).message || 'Unknown error',
          lastChecked: new Date()
        });
      }
    }
    
    return healthResults;
  }

  /**
   * Start data synchronization service
   */
  async startSynchronization(): Promise<void> {
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
      } catch (error) {
        console.error('Synchronization cycle failed:', error);
        await this.sleep(300000); // Wait 5 minutes on error
      }
    }
  }

  /**
   * Stop data synchronization service
   */
  stopSynchronization(): void {
    this.isRunning = false;
    console.log('🛑 Stopping data synchronization service...');
  }

  /**
   * Run one synchronization cycle
   */
  private async runSynchronizationCycle(): Promise<void> {
    const now = new Date();
    
    for (const [source, schedule] of this.schedules) {
      if (now >= schedule.nextUpdate) {
        try {
          await this.syncDataSource(source);
          this.updateSchedule(source, now);
        } catch (error) {
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
  private async syncDataSource(source: string): Promise<void> {
    const dataSource = this.dataSources.get(source);
    if (!dataSource) return;
    
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
  private updateSchedule(source: string, lastUpdate: Date): void {
    const schedule = this.schedules.get(source);
    if (schedule) {
      schedule.lastUpdate = lastUpdate;
      schedule.nextUpdate = this.calculateNextUpdate(schedule.frequency);
    }
  }

  /**
   * Schedule a retry for failed sync
   */
  private scheduleRetry(source: string, schedule: DataSourceSchedule): void {
    const retryDelay = 15 * 60 * 1000; // 15 minutes
    schedule.nextUpdate = new Date(Date.now() + retryDelay);
    console.log(`🔄 Scheduled retry for ${source} in 15 minutes`);
  }

  /**
   * Utility function for sleeping
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Rate limiter for API requests
 */
class RateLimiter {
  private tokens: number;
  private lastRefill: number;
  private readonly maxTokens: number;
  private readonly refillRate: number; // tokens per second

  constructor(config: { requests: number; window: number }) {
    this.maxTokens = config.requests;
    this.tokens = config.requests;
    this.refillRate = config.requests / config.window;
    this.lastRefill = Date.now();
  }

  async waitForToken(): Promise<void> {
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

  private refillTokens(): void {
    const now = Date.now();
    const timePassed = (now - this.lastRefill) / 1000;
    const tokensToAdd = timePassed * this.refillRate;
    
    this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }
}