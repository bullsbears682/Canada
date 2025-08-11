import { DataSourceManager } from '../core/DataSourceManager';
import { HealthStatus, PerformanceMetrics, DataQualityMetrics } from '../types';
import { DataSynchronizationService } from './DataSynchronizationService';
/**
 * 🇨🇦 Data Monitoring Service
 *
 * Provides comprehensive monitoring, health checks, and performance tracking
 * for all Canadian data sources in the Cost of Living Analyzer.
 */
export declare class DataMonitoringService {
    private dataSourceManager;
    private syncService;
    private healthCheckInterval;
    private performanceMetrics;
    private healthHistory;
    private errorHistory;
    private alertThresholds;
    private isMonitoring;
    constructor(dataSourceManager: DataSourceManager, syncService: DataSynchronizationService);
    /**
     * Initialize alert thresholds for different metrics
     */
    private initializeAlertThresholds;
    /**
     * Start the monitoring service
     */
    start(): Promise<void>;
    /**
     * Stop the monitoring service
     */
    stop(): Promise<void>;
    /**
     * Perform initial health check for all data sources
     */
    private performInitialHealthCheck;
    /**
     * Perform periodic health check for all data sources
     */
    private performPeriodicHealthCheck;
    /**
     * Check health status of a specific data source
     */
    checkDataSourceHealth(sourceName: string): Promise<HealthStatus>;
    /**
     * Store health status in history
     */
    private storeHealthHistory;
    /**
     * Store error in history
     */
    private storeError;
    /**
     * Check if health status has changed significantly
     */
    private checkHealthStatusChange;
    /**
     * Check alert conditions and send alerts if needed
     */
    private checkAlertConditions;
    /**
     * Send alert for monitoring events
     */
    private sendAlert;
    /**
     * Get data quality metrics for a data source
     */
    private getDataQualityMetrics;
    /**
     * Get overall system health status
     */
    getSystemHealthStatus(): SystemHealthStatus;
    /**
     * Get detailed health status for all sources
     */
    getAllSourcesHealthStatus(): Record<string, DetailedHealthStatus>;
    /**
     * Calculate average response time from health history
     */
    private calculateAverageResponseTime;
    /**
     * Get performance metrics for a data source
     */
    getPerformanceMetrics(sourceName: string, timeRange?: '1h' | '24h' | '7d' | '30d'): PerformanceMetrics[];
    /**
     * Get error summary for all sources
     */
    getErrorSummary(): ErrorSummary;
    /**
     * Reset monitoring data for a specific source
     */
    resetMonitoringData(sourceName: string): void;
    /**
     * Reset all monitoring data
     */
    resetAllMonitoringData(): void;
}
/**
 * System health status interface
 */
interface SystemHealthStatus {
    overallStatus: 'healthy' | 'warning' | 'critical';
    totalSources: number;
    healthySources: number;
    warningSources: number;
    criticalSources: number;
    averageResponseTime: number;
    totalErrors: number;
    lastUpdated: Date;
    uptime: number;
}
/**
 * Detailed health status interface
 */
interface DetailedHealthStatus {
    name: string;
    currentStatus: string;
    lastChecked: Date;
    responseTime: number | null;
    averageResponseTime: number;
    uptime: number;
    errorCount: number;
    recentErrors: any[];
    dataQuality: DataQualityMetrics;
    lastSync: Date | null;
    nextSync: Date | null;
    consecutiveFailures: number;
}
/**
 * Error summary interface
 */
interface ErrorSummary {
    totalErrors: number;
    criticalErrors: number;
    sourcesWithErrors: number;
    totalSources: number;
    errorTypes: Record<string, number>;
    lastUpdated: Date;
}
export {};
//# sourceMappingURL=DataMonitoringService.d.ts.map