import { DataSource, DataSourceConfig, PerformanceMetrics } from '../types';
/**
 * 🇨🇦 Core Data Source Manager
 *
 * Manages all Canadian data sources, handles caching, rate limiting,
 * and data synchronization for the Cost of Living Analyzer.
 */
export declare class DataSourceManager {
    private dataSources;
    private cache;
    private rateLimiters;
    private performanceMetrics;
    private schedules;
    private isRunning;
    constructor();
    /**
     * Register a new data source
     */
    registerDataSource(name: string, dataSource: DataSource, config: DataSourceConfig): void;
    /**
     * Fetch data from a specific source and endpoint
     */
    fetchData<T>(source: string, endpoint: string, params?: Record<string, any>, forceRefresh?: boolean): Promise<T>;
    /**
     * Get cached data if available and not expired
     */
    private getCachedData;
    /**
     * Check if cached data has expired
     */
    private isExpired;
    /**
     * Cache data with TTL
     */
    private cacheData;
    /**
     * Generate cache key for request
     */
    private generateCacheKey;
    /**
     * Get TTL for different endpoint types
     */
    private getTTLForEndpoint;
    /**
     * Make HTTP request to data source
     */
    private makeRequest;
    /**
     * Wait for rate limit to reset
     */
    private waitForRateLimit;
    /**
     * Record performance metrics
     */
    private recordPerformance;
    /**
     * Create standardized error object
     */
    private createDataSourceError;
    /**
     * Determine if error is retryable
     */
    private isRetryableError;
    /**
     * Calculate next update time based on frequency
     */
    private calculateNextUpdate;
    /**
     * Initialize rate limiters for all data sources
     */
    private initializeRateLimiters;
    /**
     * Get performance metrics for a source
     */
    getPerformanceMetrics(source: string): PerformanceMetrics[];
    /**
     * Get cache statistics
     */
    getCacheStats(): {
        total: number;
        expired: number;
        valid: number;
    };
    /**
     * Clear expired cache entries
     */
    clearExpiredCache(): void;
    /**
     * Get all registered data sources
     */
    getDataSources(): string[];
    /**
     * Get a specific data source by name
     */
    getDataSource(name: string): DataSource | undefined;
    /**
     * Check health of all data sources
     */
    checkAllHealth(): Promise<Map<string, any>>;
    /**
     * Start data synchronization service
     */
    startSynchronization(): Promise<void>;
    /**
     * Stop data synchronization service
     */
    stopSynchronization(): void;
    /**
     * Run one synchronization cycle
     */
    private runSynchronizationCycle;
    /**
     * Sync a specific data source
     */
    private syncDataSource;
    /**
     * Update synchronization schedule
     */
    private updateSchedule;
    /**
     * Schedule a retry for failed sync
     */
    private scheduleRetry;
    /**
     * Utility function for sleeping
     */
    private sleep;
}
//# sourceMappingURL=DataSourceManager.d.ts.map