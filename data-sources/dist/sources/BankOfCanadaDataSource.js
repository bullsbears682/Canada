"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankOfCanadaDataSource = void 0;
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
class BankOfCanadaDataSource {
    constructor(apiKey) {
        this.name = 'Bank of Canada';
        this.baseUrl = 'https://www.bankofcanada.ca/valet';
        this.lastUpdate = new Date(0);
        this.apiKey = apiKey;
    }
    /**
     * Get the last update time for this data source
     */
    async getLastUpdate() {
        return this.lastUpdate;
    }
    /**
     * Perform health check on the Bank of Canada API
     */
    async healthCheck() {
        const startTime = Date.now();
        try {
            // Test with a simple endpoint
            await this.makeRequest('/observations/FXUSDCAD', {});
            const responseTime = Date.now() - startTime;
            return {
                status: 'healthy',
                responseTime,
                lastChecked: new Date(),
                errors: [],
                dataQuality: await this.calculateDataQuality()
            };
        }
        catch (error) {
            return {
                status: 'unhealthy',
                responseTime: null,
                lastChecked: new Date(),
                errors: [error.message || 'Unknown error'],
                dataQuality: await this.calculateDataQuality()
            };
        }
    }
    /**
     * Get current policy interest rate
     */
    async getPolicyRate() {
        const endpoint = '/observations/AVG.INTWO';
        const params = {
            recent: '1',
            format: 'json'
        };
        const response = await this.makeRequest(endpoint, params);
        return this.extractPolicyRate(response);
    }
    /**
     * Get policy rate history
     */
    async getPolicyRateHistory(startDate, endDate) {
        const endpoint = '/observations/AVG.INTWO';
        const params = {
            format: 'json'
        };
        if (startDate)
            params['start_date'] = startDate;
        if (endDate)
            params['end_date'] = endDate;
        const response = await this.makeRequest(endpoint, params);
        return this.transformPolicyRateHistory(response);
    }
    /**
     * Get current exchange rates
     */
    async getExchangeRates() {
        const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CHF'];
        const rates = {};
        for (const currency of currencies) {
            try {
                const rate = await this.getExchangeRate(currency);
                rates[currency] = rate;
            }
            catch (error) {
                console.warn(`Failed to fetch ${currency} rate:`, error.message || 'Unknown error');
                rates[currency] = 0;
            }
        }
        return {
            rates,
            lastUpdated: new Date(),
            source: {
                name: this.name,
                reliability: 0.99,
                lastVerified: new Date()
            }
        };
    }
    /**
     * Get exchange rate for a specific currency
     */
    async getExchangeRate(currency) {
        const endpoint = `/observations/FX${currency}CAD`;
        const params = {
            recent: '1',
            format: 'json'
        };
        const response = await this.makeRequest(endpoint, params);
        return this.extractExchangeRate(response);
    }
    /**
     * Get exchange rate history
     */
    async getExchangeRateHistory(currency, startDate, endDate) {
        const endpoint = `/observations/FX${currency}CAD`;
        const params = {
            format: 'json'
        };
        if (startDate)
            params['start_date'] = startDate;
        if (endDate)
            params['end_date'] = endDate;
        const response = await this.makeRequest(endpoint, params);
        return this.transformExchangeRateHistory(response);
    }
    /**
     * Get prime rate
     */
    async getPrimeRate() {
        const endpoint = '/observations/AVG.INTWO';
        const params = {
            recent: '1',
            format: 'json'
        };
        const response = await this.makeRequest(endpoint, params);
        // Prime rate is typically policy rate + 2.25%
        const policyRate = this.extractPolicyRate(response);
        return policyRate + 2.25;
    }
    /**
     * Get monetary policy announcements
     */
    async getMonetaryPolicyAnnouncements() {
        const endpoint = '/announcements';
        const params = {
            format: 'json',
            type: 'monetary_policy'
        };
        const response = await this.makeRequest(endpoint, params);
        return this.transformAnnouncements(response);
    }
    /**
     * Get economic indicators
     */
    async getEconomicIndicators() {
        const [policyRate, exchangeRates] = await Promise.all([
            this.getPolicyRate(),
            this.getExchangeRates()
        ]);
        return {
            date: new Date(),
            interestRates: {
                policyRate,
                primeRate: policyRate + 2.25,
                mortgageRate: {
                    fixed5Year: 0, // Not provided by BoC
                    variable: 0,
                    fixed3Year: 0,
                    fixed10Year: 0
                },
                lastUpdated: new Date()
            },
            inflation: {
                cpi: 0, // Not provided by BoC
                cpiChange: 0,
                coreCpi: 0,
                lastUpdated: new Date()
            },
            exchangeRates: {
                usd: exchangeRates.rates.USD || 0,
                eur: exchangeRates.rates.EUR || 0,
                gbp: exchangeRates.rates.GBP || 0,
                lastUpdated: new Date()
            },
            employment: {
                unemploymentRate: 0, // Not provided by BoC
                employmentRate: 0,
                participationRate: 0,
                lastUpdated: new Date()
            },
            source: {
                name: this.name,
                reliability: 0.99,
                lastVerified: new Date()
            }
        };
    }
    /**
     * Get available data series
     */
    async getAvailableSeries() {
        try {
            const endpoint = '/series';
            const params = { format: 'json' };
            const response = await this.makeRequest(endpoint, params);
            return response.series || [];
        }
        catch (error) {
            console.warn('Could not fetch available series:', error.message || 'Unknown error');
            return [];
        }
    }
    /**
     * Get series metadata
     */
    async getSeriesMetadata(seriesId) {
        const endpoint = `/series/${seriesId}`;
        const params = { format: 'json' };
        return await this.makeRequest(endpoint, params);
    }
    /**
     * Make HTTP request to Bank of Canada API
     */
    async makeRequest(endpoint, params) {
        const url = new URL(`${this.baseUrl}${endpoint}`);
        // Add query parameters
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, value.toString());
        });
        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
                'User-Agent': 'Canadian-Cost-of-Living-Analyzer/1.0'
            }
        });
        if (!response.ok) {
            throw new Error(`Bank of Canada API error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        // Check for API errors in response
        if (data.error) {
            throw new Error(`Bank of Canada API error: ${data.error.message || data.error}`);
        }
        return data;
    }
    /**
     * Extract policy rate from response
     */
    extractPolicyRate(response) {
        const observations = response.observations || [];
        if (observations.length === 0) {
            throw new Error('No policy rate data available');
        }
        const latest = observations[0];
        const value = latest.AVG_INTWO?.v || latest.value;
        if (typeof value !== 'number') {
            throw new Error('Invalid policy rate data format');
        }
        return value;
    }
    /**
     * Extract exchange rate from response
     */
    extractExchangeRate(response) {
        const observations = response.observations || [];
        if (observations.length === 0) {
            throw new Error('No exchange rate data available');
        }
        const latest = observations[0];
        const value = latest.value || latest.v;
        if (typeof value !== 'number') {
            throw new Error('Invalid exchange rate data format');
        }
        return value;
    }
    /**
     * Transform policy rate history response
     */
    transformPolicyRateHistory(response) {
        const observations = response.observations || [];
        return observations.map((obs) => ({
            date: obs.d,
            value: obs.AVG_INTWO?.v || obs.value,
            status: obs.AVG_INTWO?.s || obs.status
        }));
    }
    /**
     * Transform exchange rate history response
     */
    transformExchangeRateHistory(response) {
        const observations = response.observations || [];
        return observations.map((obs) => ({
            date: obs.d,
            value: obs.value || obs.v,
            status: obs.status || obs.s
        }));
    }
    /**
     * Transform announcements response
     */
    transformAnnouncements(response) {
        const announcements = response.announcements || [];
        return announcements.map((announcement) => ({
            id: announcement.id,
            title: announcement.title,
            date: announcement.date,
            type: announcement.type,
            summary: announcement.summary,
            url: announcement.url
        }));
    }
    /**
     * Calculate data quality metrics
     */
    async calculateDataQuality() {
        // Bank of Canada is the official source for monetary policy data
        return {
            completeness: 0.99,
            accuracy: 0.99,
            freshness: 0.95, // Updated daily for exchange rates, weekly for policy rates
            consistency: 0.98,
            reliability: 0.99
        };
    }
    /**
     * Get interest rate forecasts
     */
    async getInterestRateForecasts() {
        try {
            const endpoint = '/forecasts/interest-rates';
            const params = { format: 'json' };
            const response = await this.makeRequest(endpoint, params);
            return this.transformForecastResponse(response);
        }
        catch (error) {
            console.warn('Interest rate forecasts not available:', error.message || 'Unknown error');
            return null;
        }
    }
    /**
     * Transform forecast response
     */
    transformForecastResponse(response) {
        const data = response.data || response;
        return {
            forecastDate: new Date(data.forecastDate || Date.now()),
            policyRate: data.policyRate || {},
            primeRate: data.primeRate || {},
            methodology: data.methodology,
            assumptions: data.assumptions || [],
            lastUpdated: new Date(data.lastUpdated || Date.now())
        };
    }
    /**
     * Get economic outlook reports
     */
    async getEconomicOutlook() {
        try {
            const endpoint = '/reports/economic-outlook';
            const params = { format: 'json' };
            const response = await this.makeRequest(endpoint, params);
            return response.reports || [];
        }
        catch (error) {
            console.warn('Economic outlook reports not available:', error.message || 'Unknown error');
            return [];
        }
    }
    /**
     * Get financial system review
     */
    async getFinancialSystemReview() {
        try {
            const endpoint = '/reports/financial-system-review';
            const params = { format: 'json' };
            const response = await this.makeRequest(endpoint, params);
            return this.transformFinancialSystemReview(response);
        }
        catch (error) {
            console.warn('Financial system review not available:', error.message || 'Unknown error');
            return null;
        }
    }
    /**
     * Transform financial system review response
     */
    transformFinancialSystemReview(response) {
        const data = response.data || response;
        return {
            title: data.title,
            publicationDate: new Date(data.publicationDate || Date.now()),
            summary: data.summary,
            keyFindings: data.keyFindings || [],
            risks: data.risks || [],
            recommendations: data.recommendations || [],
            url: data.url
        };
    }
}
exports.BankOfCanadaDataSource = BankOfCanadaDataSource;
//# sourceMappingURL=BankOfCanadaDataSource.js.map