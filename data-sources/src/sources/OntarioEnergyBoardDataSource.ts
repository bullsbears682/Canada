import { 
  DataSource, 
  HealthStatus, 
  DataQualityMetrics,
  UtilityRates,
  ProvincialUtilityRates,
  UtilityProvider,
  CanadianLocation
} from '../types';

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
export class OntarioEnergyBoardDataSource implements DataSource {
  public readonly name = 'Ontario Energy Board';
  public readonly baseUrl = 'https://api.oeb.ca';
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
   * Perform health check on the OEB API
   */
  async healthCheck(): Promise<HealthStatus> {
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
   * Get utility rates for a specific location
   */
  async getUtilityRates(location: CanadianLocation): Promise<UtilityRates> {
    const endpoint = '/v1/rates';
    const params = { 
      region: location.province,
      postalCode: location.postalCode,
      format: 'json'
    };
    
    const response = await this.makeRequest(endpoint, params);
    const utilityRates = this.transformUtilityRatesResponse(response, location);
    
    this.lastUpdate = new Date();
    return utilityRates;
  }

  /**
   * Get provincial utility rates overview
   */
  async getProvincialUtilityRates(): Promise<ProvincialUtilityRates> {
    const endpoint = '/v1/utilities';
    const params = { 
      province: 'ON',
      format: 'json'
    };
    
    const response = await this.makeRequest(endpoint, params);
    return this.transformProvincialRatesResponse(response);
  }

  /**
   * Get electricity rates for a specific rate class
   */
  async getElectricityRates(rateClass: string = 'residential'): Promise<any> {
    const endpoint = '/v1/rates/electricity';
    const params = { 
      rateClass,
      format: 'json',
      effectiveDate: new Date().toISOString().split('T')[0]
    };
    
    const response = await this.makeRequest(endpoint, params);
    return this.transformElectricityRatesResponse(response);
  }

  /**
   * Get natural gas rates for a specific rate class
   */
  async getNaturalGasRates(rateClass: string = 'residential'): Promise<any> {
    const endpoint = '/v1/rates/natural-gas';
    const params = { 
      rateClass,
      format: 'json',
      effectiveDate: new Date().toISOString().split('T')[0]
    };
    
    const response = await this.makeRequest(endpoint, params);
    return this.transformNaturalGasRatesResponse(response);
  }

  /**
   * Get utility providers in a region
   */
  async getUtilityProviders(region: string): Promise<UtilityProvider[]> {
    const endpoint = '/v1/utilities/providers';
    const params = { 
      region,
      format: 'json'
    };
    
    const response = await this.makeRequest(endpoint, params);
    return this.transformProvidersResponse(response);
  }

  /**
   * Get rate comparison data
   */
  async getRateComparison(utilityType: 'electricity' | 'naturalGas' | 'water'): Promise<any> {
    const endpoint = '/v1/rates/comparison';
    const params = { 
      utilityType,
      format: 'json'
    };
    
    const response = await this.makeRequest(endpoint, params);
    return this.transformComparisonResponse(response);
  }

  /**
   * Make HTTP request to the OEB API
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
        throw new Error(`OEB API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Check for API errors in response
      if ((data as any).error) {
        throw new Error(`OEB API error: ${(data as any).error.message || (data as any).error}`);
      }
      
      return data;
    } catch (error) {
      console.error(`Error making request to OEB API: ${endpoint}`, error);
      throw error;
    }
  }

  /**
   * Transform utility rates response
   */
  private transformUtilityRatesResponse(response: any, location: CanadianLocation): UtilityRates {
    const rates = response.rates || {};
    
    return {
      location,
      electricity: {
        residentialRate: rates.electricity?.residential || 0,
        commercialRate: rates.electricity?.commercial || 0,
        deliveryCharge: rates.electricity?.delivery || 0,
        serviceCharge: rates.electricity?.service || 0,
        lastUpdated: new Date(rates.electricity?.lastUpdated || Date.now()),
        provider: rates.electricity?.provider || 'Unknown'
      },
      naturalGas: {
        residentialRate: rates.naturalGas?.residential || 0,
        commercialRate: rates.naturalGas?.commercial || 0,
        deliveryCharge: rates.naturalGas?.delivery || 0,
        serviceCharge: rates.naturalGas?.service || 0,
        lastUpdated: new Date(rates.naturalGas?.lastUpdated || Date.now()),
        provider: rates.naturalGas?.provider || 'Unknown'
      },
      water: {
        residentialRate: rates.water?.residential || 0,
        commercialRate: rates.water?.commercial || 0,
        connectionFee: rates.water?.connection || 0,
        serviceCharge: rates.water?.service || 0,
        lastUpdated: new Date(rates.water?.lastUpdated || Date.now()),
        provider: rates.water?.provider || 'Unknown'
      },
      sewer: {
        residentialRate: rates.sewer?.residential || 0,
        commercialRate: rates.sewer?.commercial || 0,
        serviceCharge: rates.sewer?.service || 0,
        lastUpdated: new Date(rates.sewer?.lastUpdated || Date.now()),
        provider: rates.sewer?.provider || 'Unknown'
      },
      source: {
        name: this.name,
        reliability: 0.85,
        lastVerified: new Date()
      }
    };
  }

  /**
   * Transform provincial rates response
   */
  private transformProvincialRatesResponse(response: any): ProvincialUtilityRates {
    const utilities = response.utilities || {};
    
    return {
      province: 'ON',
      electricityProviders: this.transformProvidersList(utilities.electricity || []),
      naturalGasProviders: this.transformProvidersList(utilities.naturalGas || []),
      waterProviders: this.transformProvidersList(utilities.water || []),
      lastUpdated: new Date(response.lastUpdated || Date.now())
    };
  }

  /**
   * Transform electricity rates response
   */
  private transformElectricityRatesResponse(response: any): any {
    const rates = response.rates || {};
    
    return {
      residential: {
        rate: rates.residential?.rate || 0,
        delivery: rates.residential?.delivery || 0,
        service: rates.residential?.service || 0,
        total: rates.residential?.total || 0
      },
      commercial: {
        rate: rates.commercial?.rate || 0,
        delivery: rates.commercial?.delivery || 0,
        service: rates.commercial?.service || 0,
        total: rates.commercial?.total || 0
      },
      lastUpdated: new Date(rates.lastUpdated || Date.now())
    };
  }

  /**
   * Transform natural gas rates response
   */
  private transformNaturalGasRatesResponse(response: any): any {
    const rates = response.rates || {};
    
    return {
      residential: {
        rate: rates.residential?.rate || 0,
        delivery: rates.residential?.delivery || 0,
        service: rates.residential?.service || 0,
        total: rates.residential?.total || 0
      },
      commercial: {
        rate: rates.commercial?.rate || 0,
        delivery: rates.commercial?.delivery || 0,
        service: rates.commercial?.service || 0,
        total: rates.commercial?.total || 0
      },
      lastUpdated: new Date(rates.lastUpdated || Date.now())
    };
  }

  /**
   * Transform providers response
   */
  private transformProvidersResponse(response: any): UtilityProvider[] {
    const providers = response.providers || [];
    
    return providers.map((provider: any) => ({
      name: provider.name || 'Unknown',
      type: provider.type || 'public',
      rates: this.transformProviderRates(provider.rates),
      serviceArea: provider.serviceArea || [],
      contactInfo: {
        phone: provider.contact?.phone || '',
        email: provider.contact?.email || '',
        website: provider.contact?.website || ''
      }
    }));
  }

  /**
   * Transform provider rates
   */
  private transformProviderRates(rates: any): UtilityRates {
    // This would need a proper location object
    const dummyLocation: CanadianLocation = {
      postalCode: 'M5H2N2',
      province: 'ON',
      city: 'Toronto',
      latitude: 43.6532,
      longitude: -79.3832
    };

    return {
      location: dummyLocation,
      electricity: {
        residentialRate: rates.electricity?.residential || 0,
        commercialRate: rates.electricity?.commercial || 0,
        deliveryCharge: rates.electricity?.delivery || 0,
        serviceCharge: rates.electricity?.service || 0,
        lastUpdated: new Date(rates.electricity?.lastUpdated || Date.now()),
        provider: rates.electricity?.provider || 'Unknown'
      },
      naturalGas: {
        residentialRate: rates.naturalGas?.residential || 0,
        commercialRate: rates.naturalGas?.commercial || 0,
        deliveryCharge: rates.naturalGas?.delivery || 0,
        serviceCharge: rates.naturalGas?.service || 0,
        lastUpdated: new Date(rates.naturalGas?.lastUpdated || Date.now()),
        provider: rates.naturalGas?.provider || 'Unknown'
      },
      water: {
        residentialRate: rates.water?.residential || 0,
        commercialRate: rates.water?.commercial || 0,
        connectionFee: rates.water?.connection || 0,
        serviceCharge: rates.water?.service || 0,
        lastUpdated: new Date(rates.water?.lastUpdated || Date.now()),
        provider: rates.water?.provider || 'Unknown'
      },
      sewer: {
        residentialRate: rates.sewer?.residential || 0,
        commercialRate: rates.sewer?.commercial || 0,
        serviceCharge: rates.sewer?.service || 0,
        lastUpdated: new Date(rates.sewer?.lastUpdated || Date.now()),
        provider: rates.sewer?.provider || 'Unknown'
      },
      source: {
        name: this.name,
        reliability: 0.85,
        lastVerified: new Date()
      }
    };
  }

  /**
   * Transform providers list
   */
  private transformProvidersList(providers: any[]): UtilityProvider[] {
    return providers.map((provider: any) => ({
      name: provider.name || 'Unknown',
      type: provider.type || 'public',
      rates: this.transformProviderRates(provider.rates || {}),
      serviceArea: provider.serviceArea || [],
      contactInfo: {
        phone: provider.contact?.phone || '',
        email: provider.contact?.email || '',
        website: provider.contact?.website || ''
      }
    }));
  }

  /**
   * Transform comparison response
   */
  private transformComparisonResponse(response: any): any {
    const comparison = response.comparison || {};
    
    return {
      utilityType: comparison.utilityType || 'unknown',
      rates: comparison.rates || [],
      average: comparison.average || 0,
      median: comparison.median || 0,
      lastUpdated: new Date(comparison.lastUpdated || Date.now())
    };
  }

  /**
   * Calculate data quality metrics
   */
  private async calculateDataQuality(): Promise<DataQualityMetrics> {
    // This would be calculated based on actual data quality
    return {
      completeness: 0.85,
      accuracy: 0.90,
      freshness: 0.95,
      consistency: 0.88,
      reliability: 0.87
    };
  }
}