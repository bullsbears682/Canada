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

  static startTimer(operationName: string): string {
    const timerId = `${operationName}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    if (!this.metrics.has(operationName)) {
      this.metrics.set(operationName, {
        totalRequests: 0, successfulRequests: 0, failedRequests: 0,
        totalResponseTime: 0, minResponseTime: Infinity, maxResponseTime: 0,
        lastRequestTime: new Date(), errors: []
      });
    }
    return timerId;
  }

  static endTimer(operationName: string, timerId: string, success: boolean, error?: string): void {
    const startTime = parseInt(timerId.split('_')[1] || '0');
    const responseTime = Date.now() - startTime;
    const metric = this.metrics.get(operationName);
    if (!metric) return;

    metric.totalRequests++;
    if (success) {
      metric.successfulRequests++;
    } else {
      metric.failedRequests++;
      if (error) {
        metric.errors.push({ timestamp: new Date(), error });
        if (metric.errors.length > this.MAX_ERRORS_STORED) {
          metric.errors.shift();
        }
      }
    }

    metric.totalResponseTime += responseTime;
    metric.minResponseTime = Math.min(metric.minResponseTime, responseTime);
    metric.maxResponseTime = Math.max(metric.maxResponseTime, responseTime);
    metric.lastRequestTime = new Date();
  }

  static getMetrics(operationName: string): {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    successRate: number;
    averageResponseTime: number;
    minResponseTime: number;
    maxResponseTime: number;
    lastRequestTime: Date;
    errorCount: number;
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
      errorCount: metric.errors.length
    };
  }

  static getAllMetrics(): Map<string, ReturnType<typeof PerformanceMonitor.getMetrics>> {
    const result = new Map();
    for (const [operationName] of this.metrics) {
      result.set(operationName, this.getMetrics(operationName));
    }
    return result;
  }

  static getSystemHealthSummary(): {
    overallSuccessRate: number;
    averageResponseTime: number;
    totalOperations: number;
    operationsWithErrors: number;
  } {
    let totalRequests = 0;
    let totalSuccessful = 0;
    let totalResponseTime = 0;
    let operationsWithErrors = 0;

    for (const metric of this.metrics.values()) {
      totalRequests += metric.totalRequests;
      totalSuccessful += metric.successfulRequests;
      totalResponseTime += metric.totalResponseTime;
      if (metric.errors.length > 0) {
        operationsWithErrors++;
      }
    }

    return {
      overallSuccessRate: totalRequests > 0 ? (totalSuccessful / totalRequests) * 100 : 0,
      averageResponseTime: totalRequests > 0 ? totalResponseTime / totalRequests : 0,
      totalOperations: totalRequests,
      operationsWithErrors
    };
  }

  static resetMetrics(operationName: string): void {
    this.metrics.delete(operationName);
  }

  static resetAllMetrics(): void {
    this.metrics.clear();
  }

  static exportMetrics(): any {
    const result: any = {};
    for (const [operationName, metric] of this.metrics) {
      result[operationName] = this.getMetrics(operationName);
    }
    return result;
  }

  static isOperationPerformingPoorly(operationName: string, threshold: number = 0.8): boolean {
    const metric = this.getMetrics(operationName);
    if (!metric) return false;

    return metric.successRate < threshold * 100;
  }

  static getPerformanceRecommendations(): string[] {
    const recommendations: string[] = [];
    const summary = this.getSystemHealthSummary();

    if (summary.overallSuccessRate < 90) {
      recommendations.push('Overall success rate is below 90%. Consider investigating error patterns.');
    }

    if (summary.averageResponseTime > 5000) {
      recommendations.push('Average response time is high (>5s). Consider optimizing API calls or implementing caching.');
    }

    for (const [operationName, metric] of this.metrics) {
      if (metric && metric.successRate < 80) {
        recommendations.push(`Operation '${operationName}' has low success rate (${metric.successRate.toFixed(1)}%). Investigate errors.`);
      }
      if (metric && metric.averageResponseTime > 10000) {
        recommendations.push(`Operation '${operationName}' has high response time (${metric.averageResponseTime.toFixed(0)}ms). Consider optimization.`);
      }
    }

    return recommendations;
  }
}