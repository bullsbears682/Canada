import { DataSource, HealthStatus, HousingData, EconomicIndicators, PostalCodeData } from '../types';
/**
 * 🇨🇦 Statistics Canada Data Source
 *
 * Integrates with the official Statistics Canada API to provide:
 * - Housing market data
 * - Economic indicators (CPI, employment)
 * - Demographic information
 * - Postal code data
 *
 * API Documentation: https://www.statcan.gc.ca/eng/developers
 */
export declare class StatsCanDataSource implements DataSource {
    readonly name = "Statistics Canada";
    readonly baseUrl = "https://api.statcan.gc.ca";
    readonly apiKey: string;
    private lastUpdate;
    constructor(apiKey: string);
    /**
     * Get the last update time for this data source
     */
    getLastUpdate(): Promise<Date>;
    /**
     * Perform health check on the StatsCan API
     */
    healthCheck(): Promise<HealthStatus>;
    /**
     * Get housing data for a specific postal code
     */
    getHousingData(postalCode: string): Promise<HousingData>;
    /**
     * Get housing market data for a region
     */
    getHousingMarketData(region: string): Promise<HousingData[]>;
    /**
     * Get Consumer Price Index (CPI) data
     */
    getCPIData(): Promise<EconomicIndicators>;
    /**
     * Get employment data
     */
    getEmploymentData(): Promise<EconomicIndicators>;
    /**
     * Get postal code data including demographics
     */
    getPostalCodeData(postalCode: string): Promise<PostalCodeData>;
    /**
     * Get demographic data for a region
     */
    getDemographicData(region: string): Promise<any>;
    /**
     * Get income data for a region
     */
    getIncomeData(region: string): Promise<any>;
    /**
     * Make HTTP request to StatsCan API
     */
    makeRequest(endpoint: string, params: Record<string, any>): Promise<any>;
    /**
     * Transform housing API response to our data model
     */
    private transformHousingResponse;
    /**
     * Transform market data response
     */
    private transformMarketResponse;
    /**
     * Transform CPI response to economic indicators
     */
    private transformCPIResponse;
    /**
     * Transform employment response to economic indicators
     */
    private transformEmploymentResponse;
    /**
     * Transform postal code response
     */
    private transformPostalCodeResponse;
    /**
     * Transform demographic response
     */
    private transformDemographicResponse;
    /**
     * Transform income response
     */
    private transformIncomeResponse;
    /**
     * Parse location from postal code
     */
    private parseLocation;
    /**
     * Calculate data quality metrics
     */
    private calculateDataQuality;
    /**
     * Get available datasets from StatsCan
     */
    getAvailableDatasets(): Promise<string[]>;
    /**
     * Get dataset metadata
     */
    getDatasetMetadata(datasetId: string): Promise<any>;
    /**
     * Search for data by keywords
     */
    searchData(query: string, filters?: Record<string, any>): Promise<any[]>;
}
//# sourceMappingURL=StatsCanDataSource.d.ts.map