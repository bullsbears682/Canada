/**
 * Performance monitoring utility
 * Tracks API response times, success rates, and system performance metrics
 */
export declare class PerformanceMonitor {
    private static metrics;
    private static readonly MAX_ERRORS_STORED;
    /**
     * Start timing an operation
     */
    static startTimer(operationName: string): string;
    /**
     * End timing an operation and record metrics
     */
    static endTimer(operationName: string, timerId: string, success: boolean, error?: string): void;
    /**
     * Get performance metrics for a specific operation
     */
    static getMetrics(operationName: string): {
        totalRequests: number;
        successfulRequests: number;
        failedRequests: number;
        successRate: number;
        averageResponseTime: number;
        minResponseTime: number;
        maxResponseTime: number;
        lastRequestTime: Date;
        recentErrors: Array<{
            timestamp: Date;
            error: string;
        }>;
    } | null;
    /**
     * Get all performance metrics
     */
    static getAllMetrics(): Map<string, ReturnType<typeof PerformanceMonitor.getMetrics>>;
    /**
     * Get system health summary
     */
    static getSystemHealthSummary(): {
        totalOperations: number;
        overallSuccessRate: number;
        averageResponseTime: number;
        criticalOperations: string[];
        performanceIssues: string[];
    };
    /**
     * Reset metrics for a specific operation
     */
    static resetMetrics(operationName: string): void;
    /**
     * Reset all metrics
     */
    static resetAllMetrics(): void;
    /**
     * Export metrics for external monitoring
     */
    static exportMetrics(): Record<string, any>;
    /**
     * Check if an operation is performing poorly
     */
    static isOperationPerformingPoorly(operationName: string, threshold?: number): boolean;
    /**
     * Get performance recommendations
     */
    static getPerformanceRecommendations(): string[];
}
//# sourceMappingURL=performanceMonitor.d.ts.map