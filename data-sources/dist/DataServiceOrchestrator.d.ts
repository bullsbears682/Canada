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
}
//# sourceMappingURL=DataServiceOrchestrator.d.ts.map