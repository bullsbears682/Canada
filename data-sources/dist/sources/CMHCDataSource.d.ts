import { DataSource, HealthStatus, Province, MortgageRates, RentalMarketData } from '../types';
/**
 * 🇨🇦 CMHC (Canada Mortgage and Housing Corporation) Data Source
 *
 * Integrates with CMHC APIs to provide:
 * - Mortgage rates and lending data
 * - Rental market statistics
 * - Housing affordability metrics
 * - Market analysis reports
 *
 * API Documentation: https://www.cmhc-schl.gc.ca/en/data-and-research
 */
export declare class CMHCDataSource implements DataSource {
    readonly name = "CMHC";
    readonly baseUrl = "https://api.cmhc-schl.gc.ca";
    readonly apiKey: string;
    private lastUpdate;
    constructor(apiKey: string);
    /**
     * Get the last update time for this data source
     */
    getLastUpdate(): Promise<Date>;
    /**
     * Perform health check on the CMHC API
     */
    healthCheck(): Promise<HealthStatus>;
    /**
     * Get current mortgage rates
     */
    getMortgageRates(): Promise<MortgageRates>;
    /**
     * Get mortgage rate trends
     */
    getMortgageRateTrends(period?: string): Promise<MortgageRates[]>;
    /**
     * Get rental market data for a region
     */
    getRentalMarketData(region: string): Promise<RentalMarketData>;
    /**
     * Get housing affordability data
     */
    getHousingAffordability(postalCode: string): Promise<any>;
    /**
     * Get market analysis reports
     */
    getMarketAnalysis(region: string, reportType?: string): Promise<any>;
    /**
     * Get housing starts and completions data
     */
    getHousingStarts(region: string): Promise<any>;
    /**
     * Get vacancy rates by property type
     */
    getVacancyRates(region: string, propertyType?: string): Promise<any>;
    /**
     * Get housing price indices
     */
    getHousingPriceIndices(region: string): Promise<any>;
    /**
     * Make HTTP request to CMHC API
     */
    makeRequest(endpoint: string, params: Record<string, any>): Promise<any>;
    /**
     * Transform mortgage rates response
     */
    private transformMortgageRatesResponse;
    /**
     * Transform mortgage rate trends response
     */
    private transformMortgageTrendsResponse;
    /**
     * Transform rental market response
     */
    private transformRentalMarketResponse;
    /**
     * Transform affordability response
     */
    private transformAffordabilityResponse;
    /**
     * Transform market analysis response
     */
    private transformMarketAnalysisResponse;
    /**
     * Transform housing starts response
     */
    private transformHousingStartsResponse;
    /**
     * Transform vacancy rates response
     */
    private transformVacancyRatesResponse;
    /**
     * Transform price indices response
     */
    private transformPriceIndicesResponse;
    /**
     * Calculate data quality metrics
     */
    private calculateDataQuality;
    /**
     * Get available CMHC datasets
     */
    getAvailableDatasets(): Promise<string[]>;
    /**
     * Get dataset metadata
     */
    getDatasetMetadata(datasetId: string): Promise<any>;
    /**
     * Search CMHC data by keywords
     */
    searchData(query: string, filters?: Record<string, any>): Promise<any[]>;
    /**
     * Get regional housing market reports
     */
    getRegionalReports(province?: Province): Promise<any[]>;
    /**
     * Get housing market forecasts
     */
    getMarketForecasts(region: string, timeframe?: string): Promise<any>;
    /**
     * Transform forecast response
     */
    private transformForecastResponse;
}
//# sourceMappingURL=CMHCDataSource.d.ts.map