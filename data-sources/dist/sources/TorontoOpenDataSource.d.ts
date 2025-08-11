import { DataSource, HealthStatus } from '../types';
/**
 * 🇨🇦 Toronto Open Data Source
 *
 * Integrates with the Toronto Open Data API to provide:
 * - Municipal services data
 * - City infrastructure information
 * - Local government data
 * - Community statistics
 *
 * API Documentation: https://ckan0.cf.opendata.inter.prod-toronto.ca/
 */
export declare class TorontoOpenDataSource implements DataSource {
    readonly name = "Toronto Open Data";
    readonly baseUrl = "https://ckan0.cf.opendata.inter.prod-toronto.ca";
    readonly apiKey: string;
    private lastUpdate;
    constructor(apiKey: string);
    /**
     * Get the last update time for this data source
     */
    getLastUpdate(): Promise<Date>;
    /**
     * Perform health check on the Toronto Open Data API
     */
    healthCheck(): Promise<HealthStatus>;
    /**
     * Get list of available datasets
     */
    getAvailableDatasets(): Promise<string[]>;
    /**
     * Get dataset metadata
     */
    getDatasetMetadata(datasetId: string): Promise<any>;
    /**
     * Search datasets
     */
    searchDatasets(query: string, filters?: Record<string, any>): Promise<any[]>;
    /**
     * Get resource data from a dataset
     */
    getResourceData(resourceId: string): Promise<any>;
    /**
     * Get city infrastructure data
     */
    getInfrastructureData(category?: string): Promise<any[]>;
    /**
     * Get municipal services data
     */
    getMunicipalServices(serviceType?: string): Promise<any[]>;
    /**
     * Get community statistics
     */
    getCommunityStatistics(neighborhood?: string): Promise<any[]>;
    /**
     * Get transportation data
     */
    getTransportationData(transportType?: string): Promise<any[]>;
    /**
     * Get environmental data
     */
    getEnvironmentalData(category?: string): Promise<any[]>;
    /**
     * Get public safety data
     */
    getPublicSafetyData(incidentType?: string): Promise<any[]>;
    /**
     * Get economic development data
     */
    getEconomicDevelopmentData(sector?: string): Promise<any[]>;
    /**
     * Get health and social services data
     */
    getHealthAndSocialData(serviceType?: string): Promise<any[]>;
    /**
     * Get recreation and culture data
     */
    getRecreationAndCultureData(category?: string): Promise<any[]>;
    /**
     * Make HTTP request to the Toronto Open Data API
     */
    private makeRequest;
    /**
     * Calculate data quality metrics
     */
    private calculateDataQuality;
}
//# sourceMappingURL=TorontoOpenDataSource.d.ts.map