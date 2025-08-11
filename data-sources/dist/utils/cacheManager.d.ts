/**
 * Cache manager utility
 * Provides in-memory and persistent caching for API responses
 */
export interface CacheEntry<T = any> {
    data: T;
    timestamp: number;
    ttl: number;
    accessCount: number;
    lastAccessed: number;
}
export interface CacheOptions {
    ttl?: number;
    maxSize?: number;
    persistent?: boolean;
}
export declare class CacheManager {
    private cache;
    private static readonly DEFAULT_TTL;
    private static readonly DEFAULT_MAX_SIZE;
    private static readonly CLEANUP_INTERVAL;
    constructor();
    /**
     * Set a value in cache
     */
    set<T>(key: string, data: T, options?: CacheOptions): void;
    /**
     * Get a value from cache
     */
    get<T>(key: string): T | null;
    /**
     * Check if a key exists and is valid
     */
    has(key: string): boolean;
    /**
     * Delete a specific key
     */
    delete(key: string): boolean;
    /**
     * Clear all cache
     */
    clear(): void;
    /**
     * Get cache statistics
     */
    getStats(): {
        size: number;
        hitRate: number;
        totalHits: number;
        totalMisses: number;
        averageAge: number;
        oldestEntry: string | null;
        newestEntry: string | null;
    };
    /**
     * Get cache keys
     */
    getKeys(): string[];
    /**
     * Get cache entries with metadata
     */
    getEntries(): Array<{
        key: string;
        entry: CacheEntry;
    }>;
    /**
     * Preload data into cache
     */
    preload<T>(key: string, loader: () => Promise<T>, options?: CacheOptions): Promise<T>;
    /**
     * Refresh cache entry
     */
    refresh<T>(key: string, loader: () => Promise<T>, options?: CacheOptions): Promise<T>;
    /**
     * Get or set with automatic loading
     */
    getOrSet<T>(key: string, loader: () => Promise<T>, options?: CacheOptions): Promise<T>;
    /**
     * Clean up expired entries
     */
    private cleanup;
    /**
     * Evict oldest entries when cache is full
     */
    private evictOldest;
    /**
     * Persist entry to storage
     */
    private persistToStorage;
    /**
     * Remove entry from storage
     */
    private removeFromStorage;
    /**
     * Clear storage
     */
    private clearStorage;
    /**
     * Get miss count (approximate)
     */
    private getMissCount;
    /**
     * Export cache for debugging
     */
    exportCache(): Record<string, any>;
}
//# sourceMappingURL=cacheManager.d.ts.map