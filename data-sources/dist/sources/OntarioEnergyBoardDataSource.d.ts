import { DataSource, HealthStatus, UtilityRates, ProvincialUtilityRates, UtilityProvider, CanadianLocation } from '../types';
/**
 * 🇨🇦 Ontario Energy Board Data Source
 *
 * Integrates with the Ontario Energy Board API to provide:
 * - Electricity rates and providers
 * - Natural gas rates and providers
 * - Water and sewer rates
 * - Utility provider information
 *
 * API Documentation: https://www.oeb.ca/
 */
export declare class OntarioEnergyBoardDataSource implements DataSource {
    readonly name = "Ontario Energy Board";
    readonly baseUrl = "https://api.oeb.ca";
    readonly apiKey: string;
    private lastUpdate;
    constructor(apiKey: string);
    /**
     * Get the last update time for this data source
     */
    getLastUpdate(): Promise<Date>;
    /**
     * Perform health check on the OEB API
     */
    healthCheck(): Promise<HealthStatus>;
    /**
     * Get utility rates for a specific location
     */
    getUtilityRates(location: CanadianLocation): Promise<UtilityRates>;
    /**
     * Get provincial utility rates overview
     */
    getProvincialUtilityRates(): Promise<ProvincialUtilityRates>;
    /**
     * Get electricity rates for a specific rate class
     */
    getElectricityRates(rateClass?: string): Promise<any>;
    /**
     * Get natural gas rates for a specific rate class
     */
    getNaturalGasRates(rateClass?: string): Promise<any>;
    /**
     * Get utility providers in a region
     */
    getUtilityProviders(region: string): Promise<UtilityProvider[]>;
    /**
     * Get rate comparison data
     */
    getRateComparison(utilityType: 'electricity' | 'naturalGas' | 'water'): Promise<any>;
    /**
     * Make HTTP request to the OEB API
     */
    private makeRequest;
    /**
     * Transform utility rates response
     */
    private transformUtilityRatesResponse;
    /**
     * Transform provincial rates response
     */
    private transformProvincialRatesResponse;
    /**
     * Transform electricity rates response
     */
    private transformElectricityRatesResponse;
    /**
     * Transform natural gas rates response
     */
    private transformNaturalGasRatesResponse;
    /**
     * Transform providers response
     */
    private transformProvidersResponse;
    /**
     * Transform provider rates
     */
    private transformProviderRates;
    /**
     * Transform providers list
     */
    private transformProvidersList;
    /**
     * Transform comparison response
     */
    private transformComparisonResponse;
    /**
     * Calculate data quality metrics
     */
    private calculateDataQuality;
}
//# sourceMappingURL=OntarioEnergyBoardDataSource.d.ts.map