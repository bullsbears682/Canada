import { CanadianLocation } from '../types';
/**
 * 🇨🇦 Comprehensive Data Analysis Example
 *
 * Demonstrates the enhanced capabilities of the Canadian Data Sources system
 * with all new data sources integrated and working together.
 */
export declare class ComprehensiveDataAnalysis {
    private orchestrator;
    constructor();
    /**
     * Run a comprehensive analysis for a specific location
     */
    runComprehensiveAnalysis(location: CanadianLocation): Promise<void>;
    /**
     * Analyze housing and real estate data
     */
    private analyzeHousingAndRealEstate;
    /**
     * Analyze economic indicators
     */
    private analyzeEconomicIndicators;
    /**
     * Analyze utility rates
     */
    private analyzeUtilityRates;
    /**
     * Analyze tax and benefits
     */
    private analyzeTaxAndBenefits;
    /**
     * Analyze municipal services
     */
    private analyzeMunicipalServices;
    /**
     * Analyze employment data
     */
    private analyzeEmploymentData;
    /**
     * Generate comprehensive cost of living analysis
     */
    private generateCostOfLivingAnalysis;
    /**
     * Generate a detailed report for a specific income level
     */
    generateDetailedReport(location: CanadianLocation, income: number, householdSize?: number): Promise<void>;
    /**
     * Get system health and performance metrics
     */
    getSystemStatus(): Promise<void>;
}
/**
 * Example usage and demonstration
 */
export declare function runExample(): Promise<void>;
export default ComprehensiveDataAnalysis;
//# sourceMappingURL=ComprehensiveDataAnalysis.d.ts.map