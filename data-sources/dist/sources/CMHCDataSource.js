"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CMHCDataSource = void 0;
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
class CMHCDataSource {
    constructor(apiKey) {
        this.name = 'CMHC';
        this.baseUrl = 'https://api.cmhc-schl.gc.ca';
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
     * Perform health check on the CMHC API
     */
    async healthCheck() {
        const startTime = Date.now();
        try {
            // Test with a simple endpoint
            await this.makeRequest('/v1/health', {});
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
     * Get current mortgage rates
     */
    async getMortgageRates() {
        const endpoint = '/v1/mortgage/rates';
        const params = {
            format: 'json',
            type: 'current'
        };
        const response = await this.makeRequest(endpoint, params);
        return this.transformMortgageRatesResponse(response);
    }
    /**
     * Get mortgage rate trends
     */
    async getMortgageRateTrends(period = '1year') {
        const endpoint = '/v1/mortgage/rates/trends';
        const params = {
            format: 'json',
            period,
            type: 'historical'
        };
        const response = await this.makeRequest(endpoint, params);
        return this.transformMortgageTrendsResponse(response);
    }
    /**
     * Get rental market data for a region
     */
    async getRentalMarketData(region) {
        const endpoint = '/v1/rental/market-data';
        const params = {
            region,
            format: 'json',
            period: 'latest'
        };
        const response = await this.makeRequest(endpoint, params);
        return this.transformRentalMarketResponse(response);
    }
    /**
     * Get housing affordability data
     */
    async getHousingAffordability(postalCode) {
        const endpoint = '/v1/housing/affordability';
        const params = {
            postalCode,
            format: 'json',
            include: 'income,expenses,ratios'
        };
        const response = await this.makeRequest(endpoint, params);
        return this.transformAffordabilityResponse(response);
    }
    /**
     * Get market analysis reports
     */
    async getMarketAnalysis(region, reportType = 'quarterly') {
        const endpoint = '/v1/market/analysis';
        const params = {
            region,
            format: 'json',
            type: reportType,
            period: 'latest'
        };
        const response = await this.makeRequest(endpoint, params);
        return this.transformMarketAnalysisResponse(response);
    }
    /**
     * Get housing starts and completions data
     */
    async getHousingStarts(region) {
        const endpoint = '/v1/housing/starts';
        const params = {
            region,
            format: 'json',
            period: 'latest'
        };
        const response = await this.makeRequest(endpoint, params);
        return this.transformHousingStartsResponse(response);
    }
    /**
     * Get vacancy rates by property type
     */
    async getVacancyRates(region, propertyType = 'all') {
        const endpoint = '/v1/rental/vacancy-rates';
        const params = {
            region,
            format: 'json',
            propertyType,
            period: 'latest'
        };
        const response = await this.makeRequest(endpoint, params);
        return this.transformVacancyRatesResponse(response);
    }
    /**
     * Get housing price indices
     */
    async getHousingPriceIndices(region) {
        const endpoint = '/v1/housing/price-indices';
        const params = {
            region,
            format: 'json',
            period: 'latest'
        };
        const response = await this.makeRequest(endpoint, params);
        return this.transformPriceIndicesResponse(response);
    }
    /**
     * Make HTTP request to CMHC API
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
            throw new Error(`CMHC API error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        // Check for API errors in response
        if (data.error) {
            throw new Error(`CMHC API error: ${data.error.message || data.error}`);
        }
        return data;
    }
    /**
     * Transform mortgage rates response
     */
    transformMortgageRatesResponse(response) {
        const data = response.data || response;
        return {
            date: new Date(data.date || Date.now()),
            fixedRates: {
                '1Year': data.fixedRates?.['1Year'] || 0,
                '2Year': data.fixedRates?.['2Year'] || 0,
                '3Year': data.fixedRates?.['3Year'] || 0,
                '4Year': data.fixedRates?.['4Year'] || 0,
                '5Year': data.fixedRates?.['5Year'] || 0,
                '7Year': data.fixedRates?.['7Year'] || 0,
                '10Year': data.fixedRates?.['10Year'] || 0
            },
            variableRates: {
                primeMinus: data.variableRates?.primeMinus || 0,
                primePlus: data.variableRates?.primePlus || 0
            },
            lastUpdated: new Date(data.lastUpdated || Date.now()),
            source: this.name
        };
    }
    /**
     * Transform mortgage rate trends response
     */
    transformMortgageTrendsResponse(response) {
        const data = response.data || response;
        if (Array.isArray(data)) {
            return data.map(item => this.transformMortgageRatesResponse({ data: item }));
        }
        return [this.transformMortgageRatesResponse(response)];
    }
    /**
     * Transform rental market response
     */
    transformRentalMarketResponse(response) {
        const data = response.data || response;
        return {
            region: data.region,
            period: data.period || 'current',
            averageRent: {
                studio: data.averageRent?.studio || 0,
                oneBedroom: data.averageRent?.oneBedroom || 0,
                twoBedroom: data.averageRent?.twoBedroom || 0,
                threeBedroom: data.averageRent?.threeBedroom || 0
            },
            vacancyRate: data.vacancyRate || 0,
            rentChange: data.rentChange || 0,
            lastUpdated: new Date(data.lastUpdated || Date.now()),
        };
    }
    /**
     * Transform affordability response
     */
    transformAffordabilityResponse(response) {
        const data = response.data || response;
        return {
            postalCode: data.postalCode,
            affordabilityScore: data.affordabilityScore || 0,
            incomeRequired: data.incomeRequired || 0,
            downPaymentRequired: data.downPaymentRequired || 0,
            monthlyPayment: data.monthlyPayment || 0,
            debtToIncomeRatio: data.debtToIncomeRatio || 0,
            lastUpdated: new Date(data.lastUpdated || Date.now())
        };
    }
    /**
     * Transform market analysis response
     */
    transformMarketAnalysisResponse(response) {
        const data = response.data || response;
        return {
            region: data.region,
            reportType: data.reportType,
            period: data.period,
            summary: data.summary,
            keyFindings: data.keyFindings || [],
            recommendations: data.recommendations || [],
            lastUpdated: new Date(data.lastUpdated || Date.now())
        };
    }
    /**
     * Transform housing starts response
     */
    transformHousingStartsResponse(response) {
        const data = response.data || response;
        return {
            region: data.region,
            period: data.period,
            starts: data.starts || 0,
            completions: data.completions || 0,
            underConstruction: data.underConstruction || 0,
            lastUpdated: new Date(data.lastUpdated || Date.now())
        };
    }
    /**
     * Transform vacancy rates response
     */
    transformVacancyRatesResponse(response) {
        const data = response.data || response;
        return {
            region: data.region,
            propertyType: data.propertyType,
            vacancyRate: data.vacancyRate || 0,
            totalUnits: data.totalUnits || 0,
            vacantUnits: data.vacantUnits || 0,
            lastUpdated: new Date(data.lastUpdated || Date.now())
        };
    }
    /**
     * Transform price indices response
     */
    transformPriceIndicesResponse(response) {
        const data = response.data || response;
        return {
            region: data.region,
            period: data.period,
            index: data.index || 0,
            change1Year: data.change1Year || 0,
            change5Year: data.change5Year || 0,
            lastUpdated: new Date(data.lastUpdated || Date.now())
        };
    }
    /**
     * Calculate data quality metrics
     */
    async calculateDataQuality() {
        // CMHC is the official government source for housing data
        return {
            completeness: 0.98,
            accuracy: 0.99,
            freshness: 0.85, // Some data is updated monthly/quarterly
            consistency: 0.95,
            reliability: 0.99
        };
    }
    /**
     * Get available CMHC datasets
     */
    async getAvailableDatasets() {
        try {
            const response = await this.makeRequest('/v1/datasets', { format: 'json' });
            const datasets = response.datasets || [];
            return datasets.map((dataset) => dataset.name);
        }
        catch (error) {
            console.warn('Could not fetch available CMHC datasets:', error.message || 'Unknown error');
            return [];
        }
    }
    /**
     * Get dataset metadata
     */
    async getDatasetMetadata(datasetId) {
        const endpoint = `/v1/datasets/${datasetId}/metadata`;
        const params = { format: 'json' };
        return await this.makeRequest(endpoint, params);
    }
    /**
     * Search CMHC data by keywords
     */
    async searchData(query, filters) {
        const endpoint = '/v1/search';
        const params = {
            q: query,
            format: 'json',
            ...filters
        };
        const response = await this.makeRequest(endpoint, params);
        return response.results || [];
    }
    /**
     * Get regional housing market reports
     */
    async getRegionalReports(province) {
        const endpoint = '/v1/reports/regional';
        const params = {
            format: 'json',
            period: 'latest'
        };
        if (province) {
            params['province'] = province;
        }
        const response = await this.makeRequest(endpoint, params);
        return response.reports || [];
    }
    /**
     * Get housing market forecasts
     */
    async getMarketForecasts(region, timeframe = '1year') {
        const endpoint = '/v1/market/forecasts';
        const params = {
            region,
            format: 'json',
            timeframe
        };
        const response = await this.makeRequest(endpoint, params);
        return this.transformForecastResponse(response);
    }
    /**
     * Transform forecast response
     */
    transformForecastResponse(response) {
        const data = response.data || response;
        return {
            region: data.region,
            timeframe: data.timeframe,
            forecastDate: new Date(data.forecastDate || Date.now()),
            predictions: data.predictions || {},
            confidence: data.confidence || 0,
            methodology: data.methodology,
            lastUpdated: new Date(data.lastUpdated || Date.now())
        };
    }
}
exports.CMHCDataSource = CMHCDataSource;
//# sourceMappingURL=CMHCDataSource.js.map