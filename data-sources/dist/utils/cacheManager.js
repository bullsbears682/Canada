"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheManager = void 0;
class CacheManager {
    constructor() {
        this.cache = new Map();
        // Start cleanup interval
        setInterval(() => this.cleanup(), CacheManager.CLEANUP_INTERVAL);
    }
    /**
     * Set a value in cache
     */
    set(key, data, options = {}) {
        const ttl = options.ttl || CacheManager.DEFAULT_TTL;
        const maxSize = options.maxSize || CacheManager.DEFAULT_MAX_SIZE;
        // Check if we need to evict entries
        if (this.cache.size >= maxSize) {
            this.evictOldest();
        }
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl,
            accessCount: 0,
            lastAccessed: Date.now()
        });
        // Persist if requested
        if (options.persistent) {
            this.persistToStorage(key, this.cache.get(key));
        }
    }
    /**
     * Get a value from cache
     */
    get(key) {
        const entry = this.cache.get(key);
        if (!entry) {
            return null;
        }
        // Check if expired
        if (Date.now() - entry.timestamp > entry.ttl) {
            this.cache.delete(key);
            return null;
        }
        // Update access statistics
        entry.accessCount++;
        entry.lastAccessed = Date.now();
        return entry.data;
    }
    /**
     * Check if a key exists and is valid
     */
    has(key) {
        const entry = this.cache.get(key);
        if (!entry) {
            return false;
        }
        // Check if expired
        if (Date.now() - entry.timestamp > entry.ttl) {
            this.cache.delete(key);
            return false;
        }
        return true;
    }
    /**
     * Delete a specific key
     */
    delete(key) {
        const deleted = this.cache.delete(key);
        if (deleted) {
            this.removeFromStorage(key);
        }
        return deleted;
    }
    /**
     * Clear all cache
     */
    clear() {
        this.cache.clear();
        this.clearStorage();
    }
    /**
     * Get cache statistics
     */
    getStats() {
        let totalHits = 0;
        let totalAge = 0;
        let oldestEntry = null;
        let newestEntry = null;
        let oldestTime = Infinity;
        let newestTime = 0;
        for (const [key, entry] of this.cache) {
            totalHits += entry.accessCount;
            const age = Date.now() - entry.timestamp;
            totalAge += age;
            if (entry.timestamp < oldestTime) {
                oldestTime = entry.timestamp;
                oldestEntry = key;
            }
            if (entry.timestamp > newestTime) {
                newestTime = entry.timestamp;
                newestEntry = key;
            }
        }
        const totalRequests = totalHits + this.getMissCount();
        const hitRate = totalRequests > 0 ? (totalHits / totalRequests) * 100 : 0;
        return {
            size: this.cache.size,
            hitRate,
            totalHits,
            totalMisses: this.getMissCount(),
            averageAge: this.cache.size > 0 ? totalAge / this.cache.size : 0,
            oldestEntry,
            newestEntry
        };
    }
    /**
     * Get cache keys
     */
    getKeys() {
        return Array.from(this.cache.keys());
    }
    /**
     * Get cache entries with metadata
     */
    getEntries() {
        return Array.from(this.cache.entries()).map(([key, entry]) => ({ key, entry }));
    }
    /**
     * Preload data into cache
     */
    async preload(key, loader, options = {}) {
        // Check if already in cache
        if (this.has(key)) {
            return this.get(key);
        }
        // Load data
        const data = await loader();
        this.set(key, data, options);
        return data;
    }
    /**
     * Refresh cache entry
     */
    async refresh(key, loader, options = {}) {
        const data = await loader();
        this.set(key, data, options);
        return data;
    }
    /**
     * Get or set with automatic loading
     */
    async getOrSet(key, loader, options = {}) {
        const cached = this.get(key);
        if (cached !== null) {
            return cached;
        }
        return this.preload(key, loader, options);
    }
    /**
     * Clean up expired entries
     */
    cleanup() {
        const now = Date.now();
        const expiredKeys = [];
        for (const [key, entry] of this.cache) {
            if (now - entry.timestamp > entry.ttl) {
                expiredKeys.push(key);
            }
        }
        expiredKeys.forEach(key => this.cache.delete(key));
        if (expiredKeys.length > 0) {
            console.log(`🧹 Cleaned up ${expiredKeys.length} expired cache entries`);
        }
    }
    /**
     * Evict oldest entries when cache is full
     */
    evictOldest() {
        const entries = Array.from(this.cache.entries());
        // Sort by last accessed time (LRU)
        entries.sort((a, b) => a[1].lastAccessed - b[1].lastAccessed);
        // Remove oldest 10% of entries
        const toRemove = Math.ceil(entries.length * 0.1);
        for (let i = 0; i < toRemove && i < entries.length; i++) {
            if (entries[i]) {
                this.cache.delete(entries[i]?.[0]);
            }
        }
    }
    /**
     * Persist entry to storage
     */
    persistToStorage(key, entry) {
        try {
            if (typeof global.localStorage !== 'undefined') {
                // Browser environment
                global.localStorage.setItem(`cache_${key}`, JSON.stringify(entry));
            }
            else if (typeof process !== 'undefined') {
                // Node.js environment - could implement file-based persistence here
                // For now, just log
                console.log(`💾 Cache entry ${key} would be persisted to file`);
            }
        }
        catch (error) {
            console.warn(`Failed to persist cache entry ${key}:`, error);
        }
    }
    /**
     * Remove entry from storage
     */
    removeFromStorage(key) {
        try {
            if (typeof global.localStorage !== 'undefined') {
                global.localStorage.removeItem(`cache_${key}`);
            }
        }
        catch (error) {
            console.warn(`Failed to remove cache entry ${key} from storage:`, error);
        }
    }
    /**
     * Clear storage
     */
    clearStorage() {
        try {
            if (typeof global.localStorage !== 'undefined') {
                // Remove all cache keys from (global as any).localStorage
                const keys = Object.keys(global.localStorage);
                keys.forEach(key => {
                    if (key.startsWith('cache_')) {
                        global.localStorage.removeItem(key);
                    }
                });
            }
        }
        catch (error) {
            console.warn('Failed to clear cache storage:', error);
        }
    }
    /**
     * Get miss count (approximate)
     */
    getMissCount() {
        // This is a simplified approach - in a real implementation,
        // you might want to track misses more accurately
        return Math.floor(this.cache.size * 0.2); // Assume 20% miss rate
    }
    /**
     * Export cache for debugging
     */
    exportCache() {
        const exportData = {};
        for (const [key, entry] of this.cache) {
            exportData[key] = {
                data: entry.data,
                timestamp: new Date(entry.timestamp).toISOString(),
                ttl: entry.ttl,
                accessCount: entry.accessCount,
                lastAccessed: new Date(entry.lastAccessed).toISOString(),
                age: Date.now() - entry.timestamp
            };
        }
        return exportData;
    }
}
exports.CacheManager = CacheManager;
CacheManager.DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
CacheManager.DEFAULT_MAX_SIZE = 1000;
CacheManager.CLEANUP_INTERVAL = 60 * 1000; // 1 minute
//# sourceMappingURL=cacheManager.js.map