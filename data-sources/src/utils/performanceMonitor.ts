/**
 * Performance monitoring utility
 * Tracks API response times, success rates, and system performance metrics
 */
export class PerformanceMonitor {
  private static metrics: Map<string, {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    totalResponseTime: number;
    minResponseTime: number;
    maxResponseTime: number;
    lastRequestTime: Date;
    errors: Array<{ timestamp: Date; error: string }>;
  }> = new Map();

  private static readonly MAX_ERRORS_STORED = 100;

  /**
   * Start timing an operation
   */
  static startTimer(operationName: string): string {
    const timerId = `${operationName}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    if (!this.metrics.has(operationName)) {
      this.metrics.set(operationName, {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        totalResponseTime: 0,
        minResponseTime: Infinity,
        maxResponseTime: 0,
        lastRequestTime: new Date(),
        errors: []
      });
    }

    return timerId;
  }

  /**
   * End timing an operation and record metrics
   */
  static endTimer(operationName: string, timerId: string, success: boolean, error?: string): void {
    const startTime = parseInt(timerId.split('_')[1] || '0');
    const responseTime = Date.now() - startTime;
    
    const metric = this.metrics.get(operationName);
    if (!metric) return;

    metric.totalRequests++;
    metric.totalResponseTime += responseTime;
    metric.minResponseTime = Math.min(metric.minResponseTime, responseTime);
    metric.maxResponseTime = Math.max(metric.maxResponseTime, responseTime);
    metric.lastRequestTime = new Date();

    if (success) {
      metric.successfulRequests++;
    } else {
      metric.failedRequests++;
      if (error) {
        metric.errors.push({
          timestamp: new Date(),
          error
        });
        
        // Keep only the last N errors
        if (metric.errors.length > this.MAX_ERRORS_STORED) {
          metric.errors = metric.errors.slice(-this.MAX_ERRORS_STORED);
        }
      }
    }
  }

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
    recentErrors: Array<{ timestamp: Date; error: string }>;
  } | null {
    const metric = this.metrics.get(operationName);
    if (!metric) return null;

    return {
      totalRequests: metric.totalRequests,
      successfulRequests: metric.successfulRequests,
      failedRequests: metric.failedRequests,
      successRate: metric.totalRequests > 0 ? (metric.successfulRequests / metric.totalRequests) * 100 : 0,
      averageResponseTime: metric.totalRequests > 0 ? metric.totalResponseTime / metric.totalRequests : 0,
      minResponseTime: metric.minResponseTime === Infinity ? 0 : metric.minResponseTime,
      maxResponseTime: metric.maxResponseTime,
      lastRequestTime: metric.lastRequestTime,
      recentErrors: [...metric.errors].reverse().slice(0, 10) // Last 10 errors
    };
  }

  /**
   * Get all performance metrics
   */
  static getAllMetrics(): Map<string, ReturnType<typeof PerformanceMonitor.getMetrics>> {
    const allMetrics = new Map();
    
    for (const [operationName] of this.metrics) {
      const metrics = this.getMetrics(operationName);
      if (metrics) {
        allMetrics.set(operationName, metrics);
      }
    }
    
    return allMetrics;
  }

  /**
   * Get system health summary
   */
  static getSystemHealthSummary(): {
    totalOperations: number;
    overallSuccessRate: number;
    averageResponseTime: number;
    criticalOperations: string[];
    performanceIssues: string[];
  } {
    let totalOperations = 0;
    let totalSuccessful = 0;
    let totalResponseTime = 0;
    const criticalOperations: string[] = [];
    const performanceIssues: string[] = [];

    for (const [operationName, metric] of this.metrics) {
      totalOperations += metric.totalRequests;
      totalSuccessful += metric.successfulRequests;
      totalResponseTime += metric.totalResponseTime;

      // Check for critical issues
      if (metric.totalRequests > 10) {
        const successRate = (metric.successfulRequests / metric.totalRequests) * 100;
        if (successRate < 80) {
          criticalOperations.push(`${operationName} (${successRate.toFixed(1)}% success)`);
        }

        const avgResponseTime = metric.totalResponseTime / metric.totalRequests;
        if (avgResponseTime > 5000) { // 5 seconds
          performanceIssues.push(`${operationName} (${avgResponseTime.toFixed(0)}ms avg)`);
        }
      }
    }

    return {
      totalOperations,
      overallSuccessRate: totalOperations > 0 ? (totalSuccessful / totalOperations) * 100 : 0,
      averageResponseTime: totalOperations > 0 ? totalResponseTime / totalOperations : 0,
      criticalOperations,
      performanceIssues
    };
  }

  /**
   * Reset metrics for a specific operation
   */
  static resetMetrics(operationName: string): void {
    this.metrics.delete(operationName);
  }

  /**
   * Reset all metrics
   */
  static resetAllMetrics(): void {
    this.metrics.clear();
  }

  /**
   * Export metrics for external monitoring
   */
  static exportMetrics(): Record<string, any> {
    const exportData: Record<string, any> = {};
    
    for (const [operationName, metric] of this.metrics) {
      exportData[operationName] = {
        ...metric,
        successRate: metric.totalRequests > 0 ? (metric.successfulRequests / metric.totalRequests) * 100 : 0,
        averageResponseTime: metric.totalRequests > 0 ? metric.totalResponseTime / metric.totalRequests : 0,
        minResponseTime: metric.minResponseTime === Infinity ? 0 : metric.minResponseTime
      };
    }
    
    return exportData;
  }

  /**
   * Check if an operation is performing poorly
   */
  static isOperationPerformingPoorly(operationName: string, threshold: number = 80): boolean {
    const metrics = this.getMetrics(operationName);
    if (!metrics || metrics.totalRequests < 5) return false;
    
    return metrics.successRate < threshold;
  }

  /**
   * Get performance recommendations
   */
  static getPerformanceRecommendations(): string[] {
    const recommendations: string[] = [];
    const healthSummary = this.getSystemHealthSummary();

    if (healthSummary.overallSuccessRate < 90) {
      recommendations.push('System success rate is below 90%. Review error logs and API configurations.');
    }

    if (healthSummary.averageResponseTime > 3000) {
      recommendations.push('Average response time is above 3 seconds. Consider optimizing API calls or implementing caching.');
    }

    if (healthSummary.criticalOperations.length > 0) {
      recommendations.push(`Critical operations with low success rates: ${healthSummary.criticalOperations.join(', ')}`);
    }

    if (healthSummary.performanceIssues.length > 0) {
      recommendations.push(`Operations with performance issues: ${healthSummary.performanceIssues.join(', ')}`);
    }

    return recommendations;
  }
}