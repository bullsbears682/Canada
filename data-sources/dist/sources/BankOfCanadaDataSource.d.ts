import { DataSource, HealthStatus, EconomicIndicators } from '../types';
/**
 * 🇨🇦 Bank of Canada Data Source
 *
 * Integrates with the Bank of Canada API to provide:
 * - Interest rates (policy rate, prime rate)
 * - Exchange rates (CAD vs major currencies)
 * - Monetary policy announcements
 * - Economic indicators
 *
 * API Documentation: https://www.bankofcanada.ca/valet/docs
 */
export declare class BankOfCanadaDataSource implements DataSource {
    readonly name = "Bank of Canada";
    readonly baseUrl = "https://www.bankofcanada.ca/valet";
    readonly apiKey: string;
    private lastUpdate;
    constructor(apiKey: string);
    /**
     * Get the last update time for this data source
     */
    getLastUpdate(): Promise<Date>;
    /**
     * Perform health check on the Bank of Canada API
     */
    healthCheck(): Promise<HealthStatus>;
    /**
     * Get current policy interest rate
     */
    getPolicyRate(): Promise<number>;
    /**
     * Get policy rate history
     */
    getPolicyRateHistory(startDate?: string, endDate?: string): Promise<any[]>;
    /**
     * Get current exchange rates
     */
    getExchangeRates(): Promise<any>;
    /**
     * Get exchange rate for a specific currency
     */
    getExchangeRate(currency: string): Promise<number>;
    /**
     * Get exchange rate history
     */
    getExchangeRateHistory(currency: string, startDate?: string, endDate?: string): Promise<any[]>;
    /**
     * Get prime rate
     */
    getPrimeRate(): Promise<number>;
    /**
     * Get monetary policy announcements
     */
    getMonetaryPolicyAnnouncements(): Promise<any[]>;
    /**
     * Get economic indicators
     */
    getEconomicIndicators(): Promise<EconomicIndicators>;
    /**
     * Get available data series
     */
    getAvailableSeries(): Promise<string[]>;
    /**
     * Get series metadata
     */
    getSeriesMetadata(seriesId: string): Promise<any>;
    /**
     * Make HTTP request to Bank of Canada API
     */
    makeRequest(endpoint: string, params: Record<string, any>): Promise<any>;
    /**
     * Extract policy rate from response
     */
    private extractPolicyRate;
    /**
     * Extract exchange rate from response
     */
    private extractExchangeRate;
    /**
     * Transform policy rate history response
     */
    private transformPolicyRateHistory;
    /**
     * Transform exchange rate history response
     */
    private transformExchangeRateHistory;
    /**
     * Transform announcements response
     */
    private transformAnnouncements;
    /**
     * Calculate data quality metrics
     */
    private calculateDataQuality;
    /**
     * Get interest rate forecasts
     */
    getInterestRateForecasts(): Promise<any>;
    /**
     * Transform forecast response
     */
    private transformForecastResponse;
    /**
     * Get economic outlook reports
     */
    getEconomicOutlook(): Promise<any[]>;
    /**
     * Get financial system review
     */
    getFinancialSystemReview(): Promise<any>;
    /**
     * Transform financial system review response
     */
    private transformFinancialSystemReview;
}
//# sourceMappingURL=BankOfCanadaDataSource.d.ts.map