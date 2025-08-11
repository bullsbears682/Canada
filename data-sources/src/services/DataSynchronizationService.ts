import { 
  DataSourceManager
} from '../core/DataSourceManager';
import { 
  DataSourceConfig,
  UpdateFrequency,
  DataSourceSchedule
} from '../types';
import { getDataSourceConfig, getEnvironmentConfig, DATA_SOURCE_CONFIGS } from '../config/dataSourceConfig';

/**
 * 🇨🇦 Data Synchronization Service
 * 
 * Manages automated data synchronization from all Canadian data sources
 * according to their configured update frequencies and priorities.
 */
export class DataSynchronizationService {
  private dataSourceManager: DataSourceManager;
  private syncSchedules: Map<string, DataSourceSchedule> = new Map();
  private isRunning: boolean = false;
  private syncInterval: NodeJS.Timeout | null = null;
  private errorCounts: Map<string, number> = new Map();
  private lastSyncTimes: Map<string, Date> = new Map();
  private syncStats: Map<string, any> = new Map();

  constructor(dataSourceManager: DataSourceManager) {
    this.dataSourceManager = dataSourceManager;
    this.initializeSyncSchedules();
  }

  /**
   * Initialize synchronization schedules for all data sources
   */
  private initializeSyncSchedules(): void {
    Object.entries(DATA_SOURCE_CONFIGS).forEach(([sourceName, config]: [string, DataSourceConfig]) => {
      const schedule: DataSourceSchedule = {
        source: sourceName,
        frequency: config.updateFrequency,
        lastUpdate: new Date(0),
        nextUpdate: this.calculateNextUpdate(config.updateFrequency),
        priority: config.priority,
        retryOnFailure: config.retryOnFailure,
        lastSyncAttempt: new Date(0),
        consecutiveFailures: 0,
        averageSyncTime: 0,
        totalSyncs: 0,
        successfulSyncs: 0
      };

      this.syncSchedules.set(sourceName, schedule);
      this.errorCounts.set(sourceName, 0);
      this.lastSyncTimes.set(sourceName, new Date(0));
      this.syncStats.set(sourceName, {
        totalSyncs: 0,
        successfulSyncs: 0,
        failedSyncs: 0,
        averageSyncTime: 0,
        lastSyncTime: null,
        lastError: null
      });
    });
  }

  /**
   * Start the synchronization service
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      console.log('🔄 Data synchronization service is already running');
      return;
    }

    console.log('🚀 Starting data synchronization service...');
    this.isRunning = true;

    // Perform initial sync for high-priority sources
    await this.performInitialSync();

    // Start periodic synchronization
    const envConfig = getEnvironmentConfig();
    this.syncInterval = setInterval(
      () => this.performPeriodicSync(),
      (envConfig as any).monitoring.healthCheckInterval
    );

    console.log('✅ Data synchronization service started successfully');
  }

  /**
   * Stop the synchronization service
   */
  async stop(): Promise<void> {
    if (!this.isRunning) {
      console.log('🔄 Data synchronization service is not running');
      return;
    }

    console.log('🛑 Stopping data synchronization service...');
    this.isRunning = false;

    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }

    console.log('✅ Data synchronization service stopped successfully');
  }

  /**
   * Perform initial synchronization for high-priority data sources
   */
  private async performInitialSync(): Promise<void> {
    console.log('🔄 Performing initial synchronization for high-priority sources...');
    
    const highPrioritySources = Array.from(this.syncSchedules.entries())
      .filter(([_, schedule]) => schedule.priority === 'high' || schedule.priority === 'critical')
      .map(([sourceName, _]) => sourceName);

    const syncPromises = highPrioritySources.map(sourceName => 
      this.syncDataSource(sourceName, true)
    );

    try {
      await Promise.allSettled(syncPromises);
      console.log('✅ Initial synchronization completed');
    } catch (error) {
      console.error('❌ Initial synchronization failed:', error);
    }
  }

  /**
   * Perform periodic synchronization based on schedules
   */
  private async performPeriodicSync(): Promise<void> {
    if (!this.isRunning) return;

    const now = new Date();
    const sourcesToSync: string[] = [];

    // Check which sources need synchronization
    for (const [sourceName, schedule] of this.syncSchedules) {
      if (now >= schedule.nextUpdate) {
        sourcesToSync.push(sourceName);
      }
    }

    if (sourcesToSync.length === 0) {
      return;
    }

    console.log(`🔄 Synchronizing ${sourcesToSync.length} data sources...`);

    // Sort by priority (critical first, then high, then medium, then low)
    const priorityOrder: Record<'critical' | 'high' | 'medium' | 'low', number> = { 
      critical: 0, 
      high: 1, 
      medium: 2, 
      low: 3 
    };
    sourcesToSync.sort((a, b) => {
      const scheduleA = this.syncSchedules.get(a)!;
      const scheduleB = this.syncSchedules.get(b)!;
      return priorityOrder[scheduleA.priority] - priorityOrder[scheduleB.priority];
    });

    // Sync sources sequentially to avoid overwhelming APIs
    for (const sourceName of sourcesToSync) {
      try {
        await this.syncDataSource(sourceName, false);
      } catch (error) {
        console.error(`❌ Failed to sync ${sourceName}:`, error);
      }
    }
  }

  /**
   * Synchronize a specific data source
   */
  async syncDataSource(sourceName: string, isInitialSync: boolean = false): Promise<void> {
    const schedule = this.syncSchedules.get(sourceName);
    if (!schedule) {
      throw new Error(`No schedule found for data source: ${sourceName}`);
    }

    const startTime = Date.now();
    const config = getDataSourceConfig(sourceName);
    if (!config) {
      throw new Error(`No configuration found for data source: ${sourceName}`);
    }

    try {
      console.log(`🔄 Syncing ${sourceName}...`);
      
      // Update schedule
      schedule.lastSyncAttempt = new Date();
      
      // Perform the actual data synchronization
      await this.performDataSourceSync(sourceName);
      
      // Update success metrics
      const syncTime = Date.now() - startTime;
      this.updateSyncSuccess(sourceName, syncTime);
      
      // Update schedule
      schedule.lastUpdate = new Date();
      schedule.nextUpdate = this.calculateNextUpdate(config.updateFrequency);
      schedule.consecutiveFailures = 0;
      
      console.log(`✅ Successfully synced ${sourceName} in ${syncTime}ms`);
      
    } catch (error) {
      // Update failure metrics
      this.updateSyncFailure(sourceName, error);
      
      // Handle retry logic
      if (config.retryOnFailure && !isInitialSync) {
        await this.handleSyncRetry(sourceName, config);
      }
      
      throw error;
    }
  }

  /**
   * Perform the actual data synchronization for a source
   */
  private async performDataSourceSync(sourceName: string): Promise<void> {
    // This would contain the specific logic for each data source
    // For now, we'll simulate the sync process
    
    const dataSource = this.dataSourceManager.getDataSource(sourceName);
    if (!dataSource) {
      throw new Error(`Data source ${sourceName} not found in manager`);
    }

    // Perform health check
    const healthStatus = await dataSource.healthCheck();
    if (healthStatus.status !== 'healthy') {
      throw new Error(`Data source ${sourceName} is unhealthy: ${healthStatus.status}`);
    }

    // Simulate data fetching (replace with actual implementation)
    await this.simulateDataFetch(sourceName);
  }

  /**
   * Simulate data fetching for demonstration purposes
   */
  private async simulateDataFetch(sourceName: string): Promise<void> {
    // Simulate API call delay
    const delay = Math.random() * 2000 + 500; // 500ms to 2.5s
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Simulate occasional failures
    if (Math.random() < 0.05) { // 5% failure rate
      throw new Error(`Simulated API failure for ${sourceName}`);
    }
  }

  /**
   * Handle retry logic for failed synchronizations
   */
  private async handleSyncRetry(sourceName: string, config: DataSourceConfig): Promise<void> {
    const schedule = this.syncSchedules.get(sourceName)!;
    const retryCount = schedule.consecutiveFailures;
    
    if (retryCount >= config.retryConfig.maxRetries) {
      console.error(`❌ Max retries exceeded for ${sourceName}`);
      return;
    }

    const delay = config.retryConfig.initialDelay * Math.pow(config.retryConfig.backoffMultiplier, retryCount);
    console.log(`⏳ Retrying ${sourceName} in ${delay}ms (attempt ${retryCount + 1})`);
    
    setTimeout(async () => {
      try {
        await this.syncDataSource(sourceName, false);
      } catch (error) {
        console.error(`❌ Retry failed for ${sourceName}:`, error);
      }
    }, delay);
  }

  /**
   * Update synchronization success metrics
   */
  private updateSyncSuccess(sourceName: string, syncTime: number): void {
    const stats = this.syncStats.get(sourceName)!;
    const schedule = this.syncSchedules.get(sourceName)!;
    
    stats.totalSyncs++;
    stats.successfulSyncs++;
    stats.lastSyncTime = new Date();
    stats.averageSyncTime = (stats.averageSyncTime * (stats.totalSyncs - 1) + syncTime) / stats.totalSyncs;
    
    schedule.totalSyncs++;
    schedule.successfulSyncs++;
    schedule.averageSyncTime = stats.averageSyncTime;
    
    this.lastSyncTimes.set(sourceName, new Date());
    this.errorCounts.set(sourceName, 0);
  }

  /**
   * Update synchronization failure metrics
   */
  private updateSyncFailure(sourceName: string, error: any): void {
    const stats = this.syncStats.get(sourceName)!;
    const schedule = this.syncSchedules.get(sourceName)!;
    
    stats.totalSyncs++;
    stats.failedSyncs++;
    stats.lastError = error.message;
    
    schedule.consecutiveFailures++;
    
    const errorCount = this.errorCounts.get(sourceName)!;
    this.errorCounts.set(sourceName, errorCount + 1);
  }

  /**
   * Calculate next update time based on frequency
   */
  private calculateNextUpdate(frequency: UpdateFrequency): Date {
    const now = new Date();
    
    switch (frequency) {
      case UpdateFrequency.REAL_TIME:
        return new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes
      case UpdateFrequency.HOURLY:
        return new Date(now.getTime() + 60 * 60 * 1000); // 1 hour
      case UpdateFrequency.DAILY:
        return new Date(now.getTime() + 24 * 60 * 60 * 1000); // 1 day
      case UpdateFrequency.WEEKLY:
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 1 week
      case UpdateFrequency.MONTHLY:
        return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 1 month
      case UpdateFrequency.ANNUALLY:
        return new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 year
      default:
        return new Date(now.getTime() + 24 * 60 * 60 * 1000); // Default to daily
    }
  }

  /**
   * Get synchronization status for all sources
   */
  getSyncStatus(): Record<string, any> {
    const status: Record<string, any> = {};
    
    for (const [sourceName, schedule] of this.syncSchedules) {
      const stats = this.syncStats.get(sourceName)!;
      const lastSync = this.lastSyncTimes.get(sourceName);
      const errorCount = this.errorCounts.get(sourceName)!;
      
      status[sourceName] = {
        name: schedule.source,
        frequency: schedule.frequency,
        priority: schedule.priority,
        lastUpdate: schedule.lastUpdate,
        nextUpdate: schedule.nextUpdate,
        lastSyncAttempt: schedule.lastSyncAttempt,
        consecutiveFailures: schedule.consecutiveFailures,
        totalSyncs: stats.totalSyncs,
        successfulSyncs: stats.successfulSyncs,
        failedSyncs: stats.failedSyncs,
        successRate: stats.totalSyncs > 0 ? (stats.successfulSyncs / stats.totalSyncs) * 100 : 0,
        averageSyncTime: stats.averageSyncTime,
        lastSyncTime: lastSync,
        errorCount: errorCount,
        isHealthy: errorCount < 5, // Consider unhealthy after 5 consecutive errors
        lastError: stats.lastError
      };
    }
    
    return status;
  }

  /**
   * Get synchronization statistics
   */
  getSyncStatistics(): any {
    const totalSources = this.syncSchedules.size;
    let totalSyncs = 0;
    let totalSuccessfulSyncs = 0;
    let totalFailedSyncs = 0;
    let sourcesWithErrors = 0;
    
    for (const stats of this.syncStats.values()) {
      totalSyncs += stats.totalSyncs;
      totalSuccessfulSyncs += stats.successfulSyncs;
      totalFailedSyncs += stats.failedSyncs;
      
      if (stats.failedSyncs > 0) {
        sourcesWithErrors++;
      }
    }
    
    return {
      totalSources,
      totalSyncs,
      totalSuccessfulSyncs,
      totalFailedSyncs,
      overallSuccessRate: totalSyncs > 0 ? (totalSuccessfulSyncs / totalSyncs) * 100 : 0,
      sourcesWithErrors,
      sourcesWithoutErrors: totalSources - sourcesWithErrors,
      isRunning: this.isRunning,
      lastSyncCheck: new Date()
    };
  }

  /**
   * Force synchronization of a specific data source
   */
  async forceSync(sourceName: string): Promise<void> {
    console.log(`🔄 Force syncing ${sourceName}...`);
    await this.syncDataSource(sourceName, false);
  }

  /**
   * Force synchronization of all data sources
   */
  async forceSyncAll(): Promise<void> {
    console.log('🔄 Force syncing all data sources...');
    
    const sourceNames = Array.from(this.syncSchedules.keys());
    const syncPromises = sourceNames.map(sourceName => 
      this.syncDataSource(sourceName, false)
    );
    
    await Promise.allSettled(syncPromises);
    console.log('✅ Force sync completed for all sources');
  }

  /**
   * Get data sources that need immediate synchronization
   */
  getSourcesNeedingSync(): string[] {
    const now = new Date();
    const sourcesNeedingSync: string[] = [];
    
    for (const [sourceName, schedule] of this.syncSchedules) {
      if (now >= schedule.nextUpdate) {
        sourcesNeedingSync.push(sourceName);
      }
    }
    
    return sourcesNeedingSync;
  }

  /**
   * Get data sources with errors
   */
  getSourcesWithErrors(): string[] {
    const sourcesWithErrors: string[] = [];
    
    for (const [sourceName, errorCount] of this.errorCounts) {
      if (errorCount > 0) {
        sourcesWithErrors.push(sourceName);
      }
    }
    
    return sourcesWithErrors;
  }

  /**
   * Reset error counts for a data source
   */
  resetErrorCount(sourceName: string): void {
    this.errorCounts.set(sourceName, 0);
    
    const schedule = this.syncSchedules.get(sourceName);
    if (schedule) {
      schedule.consecutiveFailures = 0;
    }
    
    console.log(`🔄 Reset error count for ${sourceName}`);
  }

  /**
   * Reset error counts for all data sources
   */
  resetAllErrorCounts(): void {
    for (const sourceName of this.errorCounts.keys()) {
      this.resetErrorCount(sourceName);
    }
    
    console.log('🔄 Reset error counts for all data sources');
  }
}