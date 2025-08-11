import { 
  DataSource, 
  HealthStatus, 
  DataQualityMetrics
} from '../types';

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
export class TorontoOpenDataSource implements DataSource {
  public readonly name = 'Toronto Open Data';
  public readonly baseUrl = 'https://ckan0.cf.opendata.inter.prod-toronto.ca';
  public readonly apiKey: string;
  private lastUpdate: Date = new Date(0);

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Get the last update time for this data source
   */
  async getLastUpdate(): Promise<Date> {
    return this.lastUpdate;
  }

  /**
   * Perform health check on the Toronto Open Data API
   */
  async healthCheck(): Promise<HealthStatus> {
    const startTime = Date.now();
    
    try {
      // Test with a simple endpoint
      await this.makeRequest('/api/3/action/package_list', {});
      const responseTime = Date.now() - startTime;
      
      return {
        status: 'healthy',
        responseTime,
        lastChecked: new Date(),
        errors: [],
        dataQuality: await this.calculateDataQuality()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        responseTime: null,
        lastChecked: new Date(),
        errors: [(error as any).message || 'Unknown error'],
        dataQuality: await this.calculateDataQuality()
      };
    }
  }

  /**
   * Get list of available datasets
   */
  async getAvailableDatasets(): Promise<string[]> {
    const endpoint = '/api/3/action/package_list';
    const response = await this.makeRequest(endpoint, {});
    return response.result || [];
  }

  /**
   * Get dataset metadata
   */
  async getDatasetMetadata(datasetId: string): Promise<any> {
    const endpoint = '/api/3/action/package_show';
    const params = { id: datasetId };
    
    const response = await this.makeRequest(endpoint, params);
    return response.result || {};
  }

  /**
   * Search datasets
   */
  async searchDatasets(query: string, filters?: Record<string, any>): Promise<any[]> {
    const endpoint = '/api/3/action/package_search';
    const params = { 
      q: query,
      rows: filters?.['rows'] || 100,
      start: filters?.['start'] || 0
    };
    
    const response = await this.makeRequest(endpoint, params);
    return response.result?.results || [];
  }

  /**
   * Get resource data from a dataset
   */
  async getResourceData(resourceId: string): Promise<any> {
    const endpoint = '/api/3/action/resource_show';
    const params = { id: resourceId };
    
    const response = await this.makeRequest(endpoint, params);
    return response.result || {};
  }

  /**
   * Get city infrastructure data
   */
  async getInfrastructureData(category?: string): Promise<any[]> {
    const endpoint = '/api/3/action/package_search';
    const params = { 
      q: `infrastructure ${category || ''}`.trim(),
      rows: 50
    };
    
    const response = await this.makeRequest(endpoint, params);
    return response.result?.results || [];
  }

  /**
   * Get municipal services data
   */
  async getMunicipalServices(serviceType?: string): Promise<any[]> {
    const endpoint = '/api/3/action/package_search';
    const params = { 
      q: `municipal services ${serviceType || ''}`.trim(),
      rows: 50
    };
    
    const response = await this.makeRequest(endpoint, params);
    return response.result?.results || [];
  }

  /**
   * Get community statistics
   */
  async getCommunityStatistics(neighborhood?: string): Promise<any[]> {
    const endpoint = '/api/3/action/package_search';
    const params = { 
      q: `community statistics ${neighborhood || ''}`.trim(),
      rows: 50
    };
    
    const response = await this.makeRequest(endpoint, params);
    return response.result?.results || [];
  }

  /**
   * Get transportation data
   */
  async getTransportationData(transportType?: string): Promise<any[]> {
    const endpoint = '/api/3/action/package_search';
    const params = { 
      q: `transportation ${transportType || ''}`.trim(),
      rows: 50
    };
    
    const response = await this.makeRequest(endpoint, params);
    return response.result?.results || [];
  }

  /**
   * Get environmental data
   */
  async getEnvironmentalData(category?: string): Promise<any[]> {
    const endpoint = '/api/3/action/package_search';
    const params = { 
      q: `environmental ${category || ''}`.trim(),
      rows: 50
    };
    
    const response = await this.makeRequest(endpoint, params);
    return response.result?.results || [];
  }

  /**
   * Get public safety data
   */
  async getPublicSafetyData(incidentType?: string): Promise<any[]> {
    const endpoint = '/api/3/action/package_search';
    const params = { 
      q: `public safety ${incidentType || ''}`.trim(),
      rows: 50
    };
    
    const response = await this.makeRequest(endpoint, params);
    return response.result?.results || [];
  }

  /**
   * Get economic development data
   */
  async getEconomicDevelopmentData(sector?: string): Promise<any[]> {
    const endpoint = '/api/3/action/package_search';
    const params = { 
      q: `economic development ${sector || ''}`.trim(),
      rows: 50
    };
    
    const response = await this.makeRequest(endpoint, params);
    return response.result?.results || [];
  }

  /**
   * Get health and social services data
   */
  async getHealthAndSocialData(serviceType?: string): Promise<any[]> {
    const endpoint = '/api/3/action/package_search';
    const params = { 
      q: `health social services ${serviceType || ''}`.trim(),
      rows: 50
    };
    
    const response = await this.makeRequest(endpoint, params);
    return response.result?.results || [];
  }

  /**
   * Get recreation and culture data
   */
  async getRecreationAndCultureData(category?: string): Promise<any[]> {
    const endpoint = '/api/3/action/package_search';
    const params = { 
      q: `recreation culture ${category || ''}`.trim(),
      rows: 50
    };
    
    const response = await this.makeRequest(endpoint, params);
    return response.result?.results || [];
  }

  /**
   * Make HTTP request to the Toronto Open Data API
   */
  private async makeRequest(endpoint: string, params: Record<string, any>): Promise<any> {
    const url = new URL(endpoint, this.baseUrl);
    
    // Add query parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString());
      }
    });

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'User-Agent': 'Canadian-Data-Sources/1.0'
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    try {
      const response = await fetch(url.toString(), { headers });
      
      if (!response.ok) {
        throw new Error(`Toronto Open Data API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Check for API errors in response
      if ((data as any).error) {
        throw new Error(`Toronto Open Data API error: ${(data as any).error.message || (data as any).error}`);
      }
      
      return data;
    } catch (error) {
      console.error(`Error making request to Toronto Open Data API: ${endpoint}`, error);
      throw error;
    }
  }



  /**
   * Calculate data quality metrics
   */
  private async calculateDataQuality(): Promise<DataQualityMetrics> {
    // This would be calculated based on actual data quality
    return {
      completeness: 0.80,
      accuracy: 0.85,
      freshness: 0.90,
      consistency: 0.82,
      reliability: 0.80
    };
  }
}