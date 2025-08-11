import { HousingData, EconomicIndicators, UtilityRates, GovernmentBenefit, TaxRates, CostOfLivingData, SalaryRequirement, CanadianLocation, Province } from './types';
/**
 * 🇨🇦 Data Service Orchestrator
 *
 * Main orchestrator that coordinates all data services for the Canadian
 * Cost of Living Analyzer. Provides a unified interface for data access,
 * validation, synchronization, and monitoring.
 */
export declare class DataServiceOrchestrator {
    private dataSourceManager;
    private validationService;
    private syncService;
    private monitoringService;
    private cacheManager;
    private isInitialized;
    constructor();
    /**
     * Initialize the data service orchestrator
     */
    initialize(): Promise<void>;
    /**
     * Initialize all data sources
     */
    private initializeDataSources;
    /**
     * Start all data services
     */
    private startServices;
    /**
     * Stop all data services
     */
    shutdown(): Promise<void>;
    /**
     * Get housing data for a specific location
     */
    getHousingData(location: CanadianLocation): Promise<HousingData>;
    /**
     * Get economic indicators
     */
    getEconomicIndicators(): Promise<EconomicIndicators>;
    /**
     * Get utility rates for a specific location
     */
    getUtilityRates(location: CanadianLocation): Promise<UtilityRates>;
    /**
     * Get government benefits information
     */
    getGovernmentBenefits(province: Province): Promise<GovernmentBenefit[]>;
    /**
     * Get tax information for a specific location
     */
    getTaxInformation(location: CanadianLocation): Promise<TaxRates>;
    /**
     * Calculate cost of living for a specific location
     */
    calculateCostOfLiving(location: CanadianLocation, householdSize?: number): Promise<CostOfLivingData>;
    /**
     * Calculate required salary for a specific location and lifestyle
     */
    calculateRequiredSalary(location: CanadianLocation, lifestyle?: 'basic' | 'comfortable' | 'luxury', householdSize?: number): Promise<SalaryRequirement>;
    /**
     * Get system health status
     */
    getSystemHealth(): any;
    /**
     * Get detailed health status for all data sources
     */
    getAllSourcesHealth(): any;
    /**
     * Get synchronization status
     */
    getSyncStatus(): any;
    /**
     * Force synchronization of all data sources
     */
    forceSyncAll(): Promise<void>;
    /**
     * Get data quality metrics
     */
    getDataQuality(): any;
    /**
     * Ensure the orchestrator is initialized
     */
    private ensureInitialized;
    /**
     * Calculate cost breakdown from various data sources
     */
    private calculateCostBreakdown;
    /**
     * Calculate monthly housing costs
     */
    private calculateMonthlyHousingCost;
    /**
     * Calculate monthly utility costs
     */
    private calculateMonthlyUtilityCost;
    /**
     * Calculate monthly tax burden
     */
    private calculateMonthlyTaxBurden;
    /**
     * Calculate other living costs
     */
    private calculateOtherLivingCosts;
    /**
     * Calculate salary requirements based on cost of living and lifestyle
     */
    private calculateSalaryRequirements;
    getComprehensiveUtilityRates(location: CanadianLocation): Promise<any>;
    getMunicipalData(location: CanadianLocation): Promise<any>;
    getEmploymentData(location: CanadianLocation): Promise<any>;
    getTaxAndBenefitsAnalysis(location: CanadianLocation, householdSize: number): Promise<any>;
    private generateTaxAndBenefitsRecommendations;
    getConfigurationStatus(): any;
    getPerformanceMetrics(): any;
    /**
     * Get detailed performance analytics and insights
     */
    getPerformanceAnalytics(): any;
    /**
     * Calculate performance trend for a specific operation
     */
    private calculatePerformanceTrend;
    getCacheInfo(): any;
    getCachedData<T>(key: string): Promise<T | null>;
    setCachedData<T>(key: string, data: T, ttl?: number): Promise<void>;
    clearCache(): Promise<void>;
    /**
     * Reset performance metrics for a specific operation or all operations
     */
    resetPerformanceMetrics(operation?: string): void;
    /**
     * Export performance metrics for external analysis
     */
    exportPerformanceMetrics(): Record<string, any>;
    /**
     * Get system recommendations based on current performance
     */
    getSystemRecommendations(): string[];
    /**
     * Perform batch data retrieval with performance tracking
     */
    batchDataRetrieval(operations: Array<{
        type: 'housing' | 'economic' | 'utility' | 'tax' | 'benefits';
        location?: CanadianLocation;
        province?: Province;
        householdSize?: number;
    }>): Promise<{
        results: Array<{
            type: string;
            data: any;
            success: boolean;
            error?: string;
            responseTime: number;
        }>;
        summary: {
            total: number;
            successful: number;
            failed: number;
            totalTime: number;
            averageTime: number;
        };
    }>;
    /**
     * Benchmark system performance with synthetic load
     */
    runPerformanceBenchmark(iterations?: number): Promise<{
        benchmarkResults: Array<{
            iteration: number;
            responseTime: number;
            success: boolean;
        }>;
        summary: {
            totalTime: number;
            averageTime: number;
            successRate: number;
            recommendations: string[];
        };
    }>;
    /**
     * Get comprehensive system diagnostics
     */
    getSystemDiagnostics(): {
        performance: any;
        cache: any;
        health: any;
        recommendations: string[];
        timestamp: Date;
    };
    /**
     * Get predictive analytics and capacity planning insights
     */
    getPredictiveAnalytics(): {
        trends: Array<{
            metric: string;
            trend: 'increasing' | 'decreasing' | 'stable';
            confidence: number;
        }>;
        capacityPlanning: Array<{
            resource: string;
            current: number;
            projected: number;
            recommendation: string;
        }>;
        riskAssessment: Array<{
            risk: string;
            probability: 'low' | 'medium' | 'high';
            impact: string;
            mitigation: string;
        }>;
        timestamp: Date;
    };
    /**
     * Generate a comprehensive system report
     */
    generateSystemReport(): {
        executive: {
            summary: string;
            status: 'healthy' | 'warning' | 'critical';
            keyMetrics: Array<{
                name: string;
                value: string;
                trend: string;
            }>;
        };
        technical: {
            performance: any;
            diagnostics: any;
            predictive: any;
        };
        recommendations: {
            immediate: string[];
            shortTerm: string[];
            longTerm: string[];
        };
        timestamp: Date;
    };
}
//# sourceMappingURL=DataServiceOrchestrator.d.ts.map