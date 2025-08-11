"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsCanDataSource = void 0;
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
class StatsCanDataSource {
    constructor(apiKey) {
        this.name = 'Statistics Canada';
        this.baseUrl = 'https://api.statcan.gc.ca';
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
     * Perform health check on the StatsCan API
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
     * Get housing data for a specific postal code
     */
    async getHousingData(postalCode) {
        const endpoint = '/v1/housing/prices';
        const params = {
            postalCode,
            format: 'json',
            period: 'latest'
        };
        const response = await this.makeRequest(endpoint, params);
        const housingData = this.transformHousingResponse(response, postalCode);
        this.lastUpdate = new Date();
        return housingData;
    }
    /**
     * Get housing market data for a region
     */
    async getHousingMarketData(region) {
        const endpoint = '/v1/housing/market-data';
        const params = {
            region,
            format: 'json',
            period: 'latest'
        };
        const response = await this.makeRequest(endpoint, params);
        return this.transformMarketResponse(response, region);
    }
    /**
     * Get Consumer Price Index (CPI) data
     */
    async getCPIData() {
        const endpoint = '/v1/economy/cpi';
        const params = {
            format: 'json',
            period: 'latest'
        };
        const response = await this.makeRequest(endpoint, params);
        return this.transformCPIResponse(response);
    }
    /**
     * Get employment data
     */
    async getEmploymentData() {
        const endpoint = '/v1/economy/employment';
        const params = {
            format: 'json',
            period: 'latest'
        };
        const response = await this.makeRequest(endpoint, params);
        return this.transformEmploymentResponse(response);
    }
    /**
     * Get postal code data including demographics
     */
    async getPostalCodeData(postalCode) {
        const endpoint = '/v1/geography/postal-code';
        const params = {
            postalCode,
            format: 'json',
            include: 'demographics,income,employment'
        };
        const response = await this.makeRequest(endpoint, params);
        return this.transformPostalCodeResponse(response);
    }
    /**
     * Get demographic data for a region
     */
    async getDemographicData(region) {
        const endpoint = '/v1/geography/demographics';
        const params = {
            region,
            format: 'json',
            period: 'latest'
        };
        const response = await this.makeRequest(endpoint, params);
        return this.transformDemographicResponse(response);
    }
    /**
     * Get income data for a region
     */
    async getIncomeData(region) {
        const endpoint = '/v1/economy/income';
        const params = {
            region,
            format: 'json',
            period: 'latest'
        };
        const response = await this.makeRequest(endpoint, params);
        return this.transformIncomeResponse(response);
    }
    /**
     * Make HTTP request to StatsCan API
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
            throw new Error(`StatsCan API error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        // Check for API errors in response
        if (data.error) {
            throw new Error(`StatsCan API error: ${data.error.message || data.error}`);
        }
        return data;
    }
    /**
     * Transform housing API response to our data model
     */
    transformHousingResponse(response, postalCode) {
        // This is a mock transformation - actual implementation would depend on StatsCan API response format
        const data = response.data || response;
        return {
            location: this.parseLocation(postalCode),
            prices: {
                averagePrice: data.averagePrice || 0,
                medianPrice: data.medianPrice || 0,
                pricePerSqFt: data.pricePerSqFt || 0,
                lastUpdated: new Date(data.lastUpdated || Date.now()),
                priceChange1Year: data.priceChange1Year || 0,
                priceChange5Year: data.priceChange5Year || 0
            },
            rental: {
                averageRent: data.averageRent || 0,
                medianRent: data.medianRent || 0,
                vacancyRate: data.vacancyRate || 0,
                lastUpdated: new Date(data.rentLastUpdated || Date.now()),
                rentChange1Year: data.rentChange1Year || 0,
                rentChange5Year: data.rentChange5Year || 0
            },
            market: {
                daysOnMarket: data.daysOnMarket || 0,
                inventoryLevel: data.inventoryLevel || 0,
                priceTrend: data.priceTrend || 'stable',
                lastUpdated: new Date(data.marketLastUpdated || Date.now()),
                salesVolume: data.salesVolume || 0,
                newListings: data.newListings || 0
            },
            source: {
                name: this.name,
                reliability: 0.95, // StatsCan is highly reliable
                lastVerified: new Date()
            }
        };
    }
    /**
     * Transform market data response
     */
    transformMarketResponse(response, region) {
        const data = response.data || response;
        if (Array.isArray(data)) {
            return data.map(item => this.transformHousingResponse({ data: item }, item.postalCode));
        }
        return [this.transformHousingResponse(response, region)];
    }
    /**
     * Transform CPI response to economic indicators
     */
    transformCPIResponse(response) {
        const data = response.data || response;
        return {
            date: new Date(data.date || Date.now()),
            interestRates: {
                policyRate: 0, // Not provided by CPI data
                primeRate: 0,
                mortgageRate: {
                    fixed5Year: 0,
                    variable: 0,
                    fixed3Year: 0,
                    fixed10Year: 0
                },
                lastUpdated: new Date()
            },
            inflation: {
                cpi: data.cpi || 0,
                cpiChange: data.cpiChange || 0,
                coreCpi: data.coreCpi || 0,
                lastUpdated: new Date(data.lastUpdated || Date.now())
            },
            exchangeRates: {
                usd: 0, // Not provided by CPI data
                eur: 0,
                gbp: 0,
                lastUpdated: new Date()
            },
            employment: {
                unemploymentRate: 0, // Not provided by CPI data
                employmentRate: 0,
                participationRate: 0,
                lastUpdated: new Date()
            },
            source: {
                name: this.name,
                reliability: 0.95,
                lastVerified: new Date()
            }
        };
    }
    /**
     * Transform employment response to economic indicators
     */
    transformEmploymentResponse(response) {
        const data = response.data || response;
        return {
            date: new Date(data.date || Date.now()),
            interestRates: {
                policyRate: 0,
                primeRate: 0,
                mortgageRate: {
                    fixed5Year: 0,
                    variable: 0,
                    fixed3Year: 0,
                    fixed10Year: 0
                },
                lastUpdated: new Date()
            },
            inflation: {
                cpi: 0,
                cpiChange: 0,
                coreCpi: 0,
                lastUpdated: new Date()
            },
            exchangeRates: {
                usd: 0,
                eur: 0,
                gbp: 0,
                lastUpdated: new Date()
            },
            employment: {
                unemploymentRate: data.unemploymentRate || 0,
                employmentRate: data.employmentRate || 0,
                participationRate: data.participationRate || 0,
                lastUpdated: new Date(data.lastUpdated || Date.now())
            },
            source: {
                name: this.name,
                reliability: 0.95,
                lastVerified: new Date()
            }
        };
    }
    /**
     * Transform postal code response
     */
    transformPostalCodeResponse(response) {
        const data = response.data || response;
        return {
            postalCode: data.postalCode,
            location: this.parseLocation(data.postalCode),
            population: data.population || 0,
            medianIncome: data.medianIncome || 0,
            unemploymentRate: data.unemploymentRate || 0,
            lastUpdated: new Date(data.lastUpdated || Date.now())
        };
    }
    /**
     * Transform demographic response
     */
    transformDemographicResponse(response) {
        const data = response.data || response;
        return {
            region: data.region,
            population: data.population || 0,
            ageDistribution: data.ageDistribution || {},
            householdSize: data.householdSize || 0,
            lastUpdated: new Date(data.lastUpdated || Date.now())
        };
    }
    /**
     * Transform income response
     */
    transformIncomeResponse(response) {
        const data = response.data || response;
        return {
            region: data.region,
            medianIncome: data.medianIncome || 0,
            averageIncome: data.averageIncome || 0,
            incomeDistribution: data.incomeDistribution || {},
            lastUpdated: new Date(data.lastUpdated || Date.now())
        };
    }
    /**
     * Parse location from postal code
     */
    parseLocation(postalCode) {
        // This is a simplified parser - in production, you'd use a proper postal code database
        const provinceMap = {
            'A': 'NL', 'B': 'NS', 'C': 'PE', 'E': 'NB',
            'G': 'QC', 'H': 'QC', 'J': 'QC',
            'K': 'ON', 'L': 'ON', 'M': 'ON', 'N': 'ON', 'P': 'ON',
            'R': 'MB', 'S': 'SK', 'T': 'AB', 'V': 'BC',
            'X': 'NT', 'Y': 'YT'
        };
        const firstLetter = postalCode.charAt(0).toUpperCase();
        const province = provinceMap[firstLetter] || 'ON';
        return {
            postalCode,
            province,
            city: 'Unknown', // Would be populated from actual API response
            latitude: 0,
            longitude: 0
        };
    }
    /**
     * Calculate data quality metrics
     */
    async calculateDataQuality() {
        // In a real implementation, this would analyze actual data quality
        // For now, return high quality metrics for StatsCan
        return {
            completeness: 0.95,
            accuracy: 0.98,
            freshness: 0.90,
            consistency: 0.92,
            reliability: 0.95
        };
    }
    /**
     * Get available datasets from StatsCan
     */
    async getAvailableDatasets() {
        try {
            const response = await this.makeRequest('/v1/datasets', { format: 'json' });
            const datasets = response.datasets || [];
            return datasets.map((dataset) => dataset.name);
        }
        catch (error) {
            console.warn('Could not fetch available datasets:', error.message || 'Unknown error');
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
     * Search for data by keywords
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
}
exports.StatsCanDataSource = StatsCanDataSource;
//# sourceMappingURL=StatsCanDataSource.js.map