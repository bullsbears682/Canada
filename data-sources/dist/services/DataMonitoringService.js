"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataMonitoringService = void 0;
const dataSourceConfig_1 = require("../config/dataSourceConfig");
/**
 * 🇨🇦 Data Monitoring Service
 *
 * Provides comprehensive monitoring, health checks, and performance tracking
 * for all Canadian data sources in the Cost of Living Analyzer.
 */
class DataMonitoringService {
    constructor(dataSourceManager, syncService) {
        this.healthCheckInterval = null;
        this.performanceMetrics = new Map();
        this.healthHistory = new Map();
        this.errorHistory = new Map();
        this.alertThresholds = new Map();
        this.isMonitoring = false;
        this.dataSourceManager = dataSourceManager;
        this.syncService = syncService;
        this.initializeAlertThresholds();
    }
    /**
     * Initialize alert thresholds for different metrics
     */
    initializeAlertThresholds() {
        Object.entries(dataSourceConfig_1.DATA_SOURCE_CONFIGS).forEach(([sourceName, _]) => {
            this.alertThresholds.set(sourceName, {
                responseTime: {
                    warning: 2000, // 2 seconds
                    critical: 5000 // 5 seconds
                },
                errorRate: {
                    warning: 0.05, // 5%
                    critical: 0.15 // 15%
                },
                dataQuality: {
                    warning: 0.8, // 80%
                    critical: 0.6 // 60%
                },
                uptime: {
                    warning: 0.95, // 95%
                    critical: 0.85 // 85%
                }
            });
        });
    }
    /**
     * Start the monitoring service
     */
    async start() {
        if (this.isMonitoring) {
            console.log('🔍 Data monitoring service is already running');
            return;
        }
        console.log('🚀 Starting data monitoring service...');
        this.isMonitoring = true;
        // Perform initial health check
        await this.performInitialHealthCheck();
        // Start periodic monitoring
        this.healthCheckInterval = setInterval(() => this.performPeriodicHealthCheck(), 60000 // Check every minute
        );
        console.log('✅ Data monitoring service started successfully');
    }
    /**
     * Stop the monitoring service
     */
    async stop() {
        if (!this.isMonitoring) {
            console.log('🔍 Data monitoring service is not running');
            return;
        }
        console.log('🛑 Stopping data monitoring service...');
        this.isMonitoring = false;
        if (this.healthCheckInterval) {
            clearInterval(this.healthCheckInterval);
            this.healthCheckInterval = null;
        }
        console.log('✅ Data monitoring service stopped successfully');
    }
    /**
     * Perform initial health check for all data sources
     */
    async performInitialHealthCheck() {
        console.log('🔍 Performing initial health check for all data sources...');
        const healthCheckPromises = Object.keys(dataSourceConfig_1.DATA_SOURCE_CONFIGS).map(sourceName => this.checkDataSourceHealth(sourceName));
        try {
            await Promise.allSettled(healthCheckPromises);
            console.log('✅ Initial health check completed');
        }
        catch (error) {
            console.error('❌ Initial health check failed:', error);
        }
    }
    /**
     * Perform periodic health check for all data sources
     */
    async performPeriodicHealthCheck() {
        if (!this.isMonitoring)
            return;
        console.log('🔍 Performing periodic health check...');
        for (const sourceName of Object.keys(dataSourceConfig_1.DATA_SOURCE_CONFIGS)) {
            try {
                await this.checkDataSourceHealth(sourceName);
            }
            catch (error) {
                console.error(`❌ Health check failed for ${sourceName}:`, error);
            }
        }
        // Check for alerts
        this.checkAlertConditions();
        console.log('✅ Periodic health check completed');
    }
    /**
     * Check health status of a specific data source
     */
    async checkDataSourceHealth(sourceName) {
        const dataSource = this.dataSourceManager.getDataSource(sourceName);
        if (!dataSource) {
            throw new Error(`Data source ${sourceName} not found`);
        }
        const startTime = Date.now();
        let healthStatus;
        try {
            // Perform health check
            healthStatus = await dataSource.healthCheck();
            const responseTime = Date.now() - startTime;
            // Update response time
            healthStatus.responseTime = responseTime;
            healthStatus.lastChecked = new Date();
            // Store health history
            this.storeHealthHistory(sourceName, healthStatus);
            // Check if health status has changed
            this.checkHealthStatusChange(sourceName, healthStatus);
            return healthStatus;
        }
        catch (error) {
            // Create error health status
            healthStatus = {
                status: 'unhealthy',
                responseTime: Date.now() - startTime,
                lastChecked: new Date(),
                errors: [error.message || 'Unknown error'],
                dataQuality: await this.getDataQualityMetrics(sourceName)
            };
            // Store error
            this.storeError(sourceName, error);
            // Store health history
            this.storeHealthHistory(sourceName, healthStatus);
            return healthStatus;
        }
    }
    /**
     * Store health status in history
     */
    storeHealthHistory(sourceName, healthStatus) {
        if (!this.healthHistory.has(sourceName)) {
            this.healthHistory.set(sourceName, []);
        }
        const history = this.healthHistory.get(sourceName);
        history.push(healthStatus);
        // Keep only last 100 health checks
        if (history.length > 100) {
            history.shift();
        }
    }
    /**
     * Store error in history
     */
    storeError(sourceName, error) {
        if (!this.errorHistory.has(sourceName)) {
            this.errorHistory.set(sourceName, []);
        }
        const errorHistory = this.errorHistory.get(sourceName);
        const dataSourceError = {
            source: sourceName,
            timestamp: new Date(),
            message: error.message || 'Unknown error',
            endpoint: 'unknown',
            retryable: false
        };
        errorHistory.push(dataSourceError);
        // Keep only last 50 errors
        if (errorHistory.length > 50) {
            errorHistory.shift();
        }
    }
    /**
     * Check if health status has changed significantly
     */
    checkHealthStatusChange(sourceName, currentHealth) {
        const history = this.healthHistory.get(sourceName);
        if (!history || history.length < 2)
            return;
        const previousHealth = history[history.length - 2];
        // Check for status change
        if (previousHealth && previousHealth.status !== currentHealth.status) {
            console.log(`⚠️  Health status changed for ${sourceName}: ${previousHealth.status} → ${currentHealth.status}`);
            // Send alert for critical status changes
            if (currentHealth.status === 'unhealthy') {
                this.sendAlert(sourceName, 'critical', `Data source ${sourceName} is now unhealthy`);
            }
            else if (previousHealth.status === 'unhealthy' && currentHealth.status === 'healthy') {
                this.sendAlert(sourceName, 'info', `Data source ${sourceName} has recovered`);
            }
        }
        // Check for significant response time changes
        if (previousHealth && previousHealth.responseTime && currentHealth.responseTime) {
            const responseTimeChange = Math.abs(currentHealth.responseTime - previousHealth.responseTime);
            const changePercentage = (responseTimeChange / previousHealth.responseTime) * 100;
            if (changePercentage > 50) {
                console.log(`⚠️  Significant response time change for ${sourceName}: ${changePercentage.toFixed(1)}%`);
            }
        }
    }
    /**
     * Check alert conditions and send alerts if needed
     */
    checkAlertConditions() {
        for (const sourceName of Object.keys(dataSourceConfig_1.DATA_SOURCE_CONFIGS)) {
            const thresholds = this.alertThresholds.get(sourceName);
            if (!thresholds)
                continue;
            const healthHistory = this.healthHistory.get(sourceName);
            if (!healthHistory || healthHistory.length === 0)
                continue;
            const latestHealth = healthHistory[healthHistory.length - 1];
            const recentHealth = healthHistory.slice(-10); // Last 10 checks
            // Check response time
            if (latestHealth && latestHealth.responseTime) {
                if (latestHealth.responseTime > thresholds.responseTime.critical) {
                    this.sendAlert(sourceName, 'critical', `Response time critical: ${latestHealth.responseTime}ms`);
                }
                else if (latestHealth.responseTime > thresholds.responseTime.warning) {
                    this.sendAlert(sourceName, 'warning', `Response time high: ${latestHealth.responseTime}ms`);
                }
            }
            // Check error rate
            const errorCount = recentHealth.filter(h => h.status === 'unhealthy').length;
            const errorRate = errorCount / recentHealth.length;
            if (errorRate > thresholds.errorRate.critical) {
                this.sendAlert(sourceName, 'critical', `Error rate critical: ${(errorRate * 100).toFixed(1)}%`);
            }
            else if (errorRate > thresholds.errorRate.warning) {
                this.sendAlert(sourceName, 'warning', `Error rate high: ${(errorRate * 100).toFixed(1)}%`);
            }
            // Check uptime
            const uptime = (recentHealth.filter(h => h.status === 'healthy').length / recentHealth.length);
            if (uptime < thresholds.uptime.critical) {
                this.sendAlert(sourceName, 'critical', `Uptime critical: ${(uptime * 100).toFixed(1)}%`);
            }
            else if (uptime < thresholds.uptime.warning) {
                this.sendAlert(sourceName, 'warning', `Uptime low: ${(uptime * 100).toFixed(1)}%`);
            }
        }
    }
    /**
     * Send alert for monitoring events
     */
    sendAlert(sourceName, level, message) {
        // Log alert
        console.log(`🚨 [${level.toUpperCase()}] ${sourceName}: ${message}`);
        // In a real application, this would send to monitoring systems like:
        // - Slack/Teams notifications
        // - Email alerts
        // - PagerDuty
        // - DataDog/New Relic
        // - Custom alerting system
    }
    /**
     * Get data quality metrics for a data source
     */
    async getDataQualityMetrics(sourceName) {
        try {
            // This would integrate with the validation service to get actual metrics
            // For now, return default metrics
            return {
                completeness: 0.9,
                accuracy: 0.95,
                freshness: 0.85,
                consistency: 0.9,
                reliability: 0.88
            };
        }
        catch (error) {
            console.error(`Failed to get data quality metrics for ${sourceName}:`, error);
            return {
                completeness: 0,
                accuracy: 0,
                freshness: 0,
                consistency: 0,
                reliability: 0
            };
        }
    }
    /**
     * Get overall system health status
     */
    getSystemHealthStatus() {
        const totalSources = Object.keys(dataSourceConfig_1.DATA_SOURCE_CONFIGS).length;
        let healthySources = 0;
        let warningSources = 0;
        let criticalSources = 0;
        let totalResponseTime = 0;
        let totalErrors = 0;
        for (const sourceName of Object.keys(dataSourceConfig_1.DATA_SOURCE_CONFIGS)) {
            const healthHistory = this.healthHistory.get(sourceName);
            if (!healthHistory || healthHistory.length === 0)
                continue;
            const latestHealth = healthHistory[healthHistory.length - 1];
            if (latestHealth && latestHealth.status === 'healthy') {
                healthySources++;
            }
            else if (latestHealth && latestHealth.status === 'degraded') {
                warningSources++;
            }
            else if (latestHealth) {
                criticalSources++;
            }
            if (latestHealth && latestHealth.responseTime) {
                totalResponseTime += latestHealth.responseTime;
            }
            const errorHistory = this.errorHistory.get(sourceName);
            if (errorHistory) {
                totalErrors += errorHistory.length;
            }
        }
        const averageResponseTime = totalSources > 0 ? totalResponseTime / totalSources : 0;
        const overallStatus = criticalSources > 0 ? 'critical' :
            warningSources > 0 ? 'warning' : 'healthy';
        return {
            overallStatus,
            totalSources,
            healthySources,
            warningSources,
            criticalSources,
            averageResponseTime,
            totalErrors,
            lastUpdated: new Date(),
            uptime: (healthySources / totalSources) * 100
        };
    }
    /**
     * Get detailed health status for all sources
     */
    getAllSourcesHealthStatus() {
        const status = {};
        for (const sourceName of Object.keys(dataSourceConfig_1.DATA_SOURCE_CONFIGS)) {
            const healthHistory = this.healthHistory.get(sourceName);
            const errorHistory = this.errorHistory.get(sourceName);
            const syncStatus = this.syncService.getSyncStatus()[sourceName];
            if (healthHistory && healthHistory.length > 0) {
                const latestHealth = healthHistory[healthHistory.length - 1];
                const recentHealth = healthHistory.slice(-10);
                if (latestHealth) {
                    status[sourceName] = {
                        name: sourceName,
                        currentStatus: latestHealth.status,
                        lastChecked: latestHealth.lastChecked,
                        responseTime: latestHealth.responseTime,
                        averageResponseTime: this.calculateAverageResponseTime(recentHealth),
                        uptime: (recentHealth.filter(h => h.status === 'healthy').length / recentHealth.length) * 100,
                        errorCount: errorHistory?.length || 0,
                        recentErrors: errorHistory?.slice(-5) || [],
                        dataQuality: latestHealth.dataQuality,
                        lastSync: syncStatus?.lastUpdate,
                        nextSync: syncStatus?.nextUpdate,
                        consecutiveFailures: syncStatus?.consecutiveFailures || 0
                    };
                }
            }
        }
        return status;
    }
    /**
     * Calculate average response time from health history
     */
    calculateAverageResponseTime(healthHistory) {
        const validResponseTimes = healthHistory
            .filter(h => h.responseTime !== null)
            .map(h => h.responseTime);
        if (validResponseTimes.length === 0)
            return 0;
        return validResponseTimes.reduce((sum, time) => sum + time, 0) / validResponseTimes.length;
    }
    /**
     * Get performance metrics for a data source
     */
    getPerformanceMetrics(sourceName, timeRange = '24h') {
        const metrics = this.performanceMetrics.get(sourceName) || [];
        const now = Date.now();
        let cutoffTime;
        switch (timeRange) {
            case '1h':
                cutoffTime = now - (60 * 60 * 1000);
                break;
            case '24h':
                cutoffTime = now - (24 * 60 * 60 * 1000);
                break;
            case '7d':
                cutoffTime = now - (7 * 24 * 60 * 60 * 1000);
                break;
            case '30d':
                cutoffTime = now - (30 * 24 * 60 * 60 * 1000);
                break;
            default:
                cutoffTime = now - (24 * 60 * 60 * 1000);
        }
        return metrics.filter(m => m.timestamp.getTime() > cutoffTime);
    }
    /**
     * Get error summary for all sources
     */
    getErrorSummary() {
        let totalErrors = 0;
        let criticalErrors = 0;
        let sourcesWithErrors = 0;
        const errorTypes = {};
        for (const sourceName of Object.keys(dataSourceConfig_1.DATA_SOURCE_CONFIGS)) {
            const errorHistory = this.errorHistory.get(sourceName);
            if (errorHistory && errorHistory.length > 0) {
                sourcesWithErrors++;
                totalErrors += errorHistory.length;
                errorHistory.forEach(() => {
                    const errorType = 'unknown'; // DataSourceError doesn't have context.type
                    errorTypes[errorType] = (errorTypes[errorType] || 0) + 1;
                    // DataSourceError doesn't have context.severity, so we'll count all as non-critical
                    // In a real implementation, you might want to add severity to DataSourceError
                });
            }
        }
        return {
            totalErrors,
            criticalErrors,
            sourcesWithErrors,
            totalSources: Object.keys(dataSourceConfig_1.DATA_SOURCE_CONFIGS).length,
            errorTypes,
            lastUpdated: new Date()
        };
    }
    /**
     * Reset monitoring data for a specific source
     */
    resetMonitoringData(sourceName) {
        this.healthHistory.delete(sourceName);
        this.errorHistory.delete(sourceName);
        this.performanceMetrics.delete(sourceName);
        console.log(`🔄 Reset monitoring data for ${sourceName}`);
    }
    /**
     * Reset all monitoring data
     */
    resetAllMonitoringData() {
        this.healthHistory.clear();
        this.errorHistory.clear();
        this.performanceMetrics.clear();
        console.log('🔄 Reset all monitoring data');
    }
}
exports.DataMonitoringService = DataMonitoringService;
//# sourceMappingURL=DataMonitoringService.js.map