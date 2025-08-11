import { DataSourceManager } from '../core/DataSourceManager';
/**
 * 🇨🇦 Data Synchronization Service
 *
 * Manages automated data synchronization from all Canadian data sources
 * according to their configured update frequencies and priorities.
 */
export declare class DataSynchronizationService {
    private dataSourceManager;
    private syncSchedules;
    private isRunning;
    private syncInterval;
    private errorCounts;
    private lastSyncTimes;
    private syncStats;
    constructor(dataSourceManager: DataSourceManager);
    /**
     * Initialize synchronization schedules for all data sources
     */
    private initializeSyncSchedules;
    /**
     * Start the synchronization service
     */
    start(): Promise<void>;
    /**
     * Stop the synchronization service
     */
    stop(): Promise<void>;
    /**
     * Perform initial synchronization for high-priority data sources
     */
    private performInitialSync;
    /**
     * Perform periodic synchronization based on schedules
     */
    private performPeriodicSync;
    /**
     * Synchronize a specific data source
     */
    syncDataSource(sourceName: string, isInitialSync?: boolean): Promise<void>;
    /**
     * Perform the actual data synchronization for a source
     */
    private performDataSourceSync;
    /**
     * Simulate data fetching for demonstration purposes
     */
    private simulateDataFetch;
    /**
     * Handle retry logic for failed synchronizations
     */
    private handleSyncRetry;
    /**
     * Update synchronization success metrics
     */
    private updateSyncSuccess;
    /**
     * Update synchronization failure metrics
     */
    private updateSyncFailure;
    /**
     * Calculate next update time based on frequency
     */
    private calculateNextUpdate;
    /**
     * Get synchronization status for all sources
     */
    getSyncStatus(): Record<string, any>;
    /**
     * Get synchronization statistics
     */
    getSyncStatistics(): any;
    /**
     * Force synchronization of a specific data source
     */
    forceSync(sourceName: string): Promise<void>;
    /**
     * Force synchronization of all data sources
     */
    forceSyncAll(): Promise<void>;
    /**
     * Get data sources that need immediate synchronization
     */
    getSourcesNeedingSync(): string[];
    /**
     * Get data sources with errors
     */
    getSourcesWithErrors(): string[];
    /**
     * Reset error counts for a data source
     */
    resetErrorCount(sourceName: string): void;
    /**
     * Reset error counts for all data sources
     */
    resetAllErrorCounts(): void;
}
//# sourceMappingURL=DataSynchronizationService.d.ts.map