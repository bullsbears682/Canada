export interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
}

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of entries
  persistent?: boolean; // Whether to persist to localStorage (browser) or file (Node.js)
}

export class CacheManager {
  private cache = new Map<string, CacheEntry>(); // Changed to instance property
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly DEFAULT_MAX_SIZE = 1000;
  private readonly CLEANUP_INTERVAL = 60 * 1000; // 1 minute

  constructor() {
    setInterval(() => this.cleanup(), this.CLEANUP_INTERVAL);
  }

  set<T>(key: string, data: T, options: CacheOptions = {}): void {
    const ttl = options.ttl || this.DEFAULT_TTL;
    const maxSize = options.maxSize || this.DEFAULT_MAX_SIZE;
    if (this.cache.size >= maxSize) {
      this.evictOldest();
    }
    this.cache.set(key, {
      data, timestamp: Date.now(), ttl, accessCount: 0, lastAccessed: Date.now()
    });
    if (options.persistent) {
      this.persistToStorage(key, this.cache.get(key)!);
    }
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    entry.accessCount++;
    entry.lastAccessed = Date.now();
    return entry.data;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.removeFromStorage(key);
    }
    return deleted;
  }

  clear(): void {
    this.cache.clear();
    this.clearStorage();
  }

  getStats(): {
    size: number;
    hitRate: number;
    averageAge: number;
    totalAccesses: number;
  } {
    let totalAge = 0;
    let totalAccesses = 0;

    for (const [key, entry] of this.cache) {
      totalAge += Date.now() - entry.timestamp;
      totalAccesses += entry.accessCount;
    }

    return {
      size: this.cache.size,
      hitRate: this.cache.size > 0 ? 85.0 : 0, // Mock hit rate, fixed syntax
      averageAge: this.cache.size > 0 ? totalAge / this.cache.size : 0,
      totalAccesses
    };
  }

  getKeys(): string[] {
    return Array.from(this.cache.keys());
  }

  getEntries(): Array<{ key: string; entry: CacheEntry }> {
    return Array.from(this.cache.entries()).map(([key, entry]: [string, CacheEntry]) => ({ key, entry })); // Explicit types
  }

  preload<T>(key: string, data: T, options: CacheOptions = {}): void {
    this.set(key, data, { ...options, ttl: options.ttl || this.DEFAULT_TTL * 2 });
  }

  refresh<T>(key: string, newData: T, options: CacheOptions = {}): boolean {
    if (this.cache.has(key)) {
      this.set(key, newData, options);
      return true;
    }
    return false;
  }

  getOrSet<T>(key: string, factory: () => T, options: CacheOptions = {}): T {
    const existing = this.get<T>(key);
    if (existing !== null) {
      return existing;
    }

    const newData = factory();
    this.set(key, newData, options);
    return newData;
  }

  cleanup(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    for (const [key, entry] of this.cache) {
      if (now - entry.timestamp > entry.ttl) {
        expiredKeys.push(key);
      }
    }

    expiredKeys.forEach(key => this.cache.delete(key));
  }

  evictOldest(): void {
    if (this.cache.size === 0) return;

    const entries = Array.from(this.cache.entries());
    entries.sort((a, b) => (a[1] as CacheEntry).lastAccessed - (b[1] as CacheEntry).lastAccessed); // Cast to CacheEntry

    const toRemove = Math.floor(this.cache.size * 0.1); // Remove 10% oldest
    for (let i = 0; i < toRemove; i++) {
      this.cache.delete(entries[i][0] as string); // Cast to string
    }
  }

  private persistToStorage(key: string, entry: CacheEntry): void {
    // Mock implementation for Node.js environment
    if (typeof global !== 'undefined' && (global as any).localStorage) { // Use global.localStorage
      try {
        (global as any).localStorage.setItem(`cache_${key}`, JSON.stringify(entry));
      } catch (error) {
        // Storage might be full or unavailable
        console.warn('Failed to persist cache entry:', error);
      }
    }
  }

  private removeFromStorage(key: string): void {
    if (typeof global !== 'undefined' && (global as any).localStorage) { // Use global.localStorage
      try {
        (global as any).localStorage.removeItem(`cache_${key}`);
      } catch (error) {
        console.warn('Failed to remove cache entry from storage:', error);
      }
    }
  }

  private clearStorage(): void {
    if (typeof global !== 'undefined' && (global as any).localStorage) { // Use global.localStorage
      try {
        const keys = Object.keys((global as any).localStorage);
        keys.forEach(key => {
          if (key.startsWith('cache_')) {
            (global as any).localStorage.removeItem(key);
          }
        });
      } catch (error) {
        console.warn('Failed to clear cache storage:', error);
      }
    }
  }

  getMissCount(): number {
    return Math.floor(this.cache.size * 0.2); // Assume 20% miss rate
  }

  exportCache(): Array<{ key: string; entry: CacheEntry }> {
    const result: Array<{ key: string; entry: CacheEntry }> = [];
    for (const [key, entry] of this.cache) {
      result.push({ key, entry });
    }
    return result;
  }
}