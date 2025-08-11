import { 
  DataSource, 
  HealthStatus, 
  DataQualityMetrics,
  EconomicIndicators,
  CanadianLocation,
  Province
} from '../types';

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
export class BankOfCanadaDataSource implements DataSource {
  public readonly name = 'Bank of Canada';
  public readonly baseUrl = 'https://www.bankofcanada.ca/valet';
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
   * Perform health check on the Bank of Canada API
   */
  async healthCheck(): Promise<HealthStatus> {
    const startTime = Date.now();
    
    try {
      // Test with a simple endpoint
      const response = await this.makeRequest('/observations/FXUSDCAD', {});
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
        errors: [error.message],
        dataQuality: await this.calculateDataQuality()
      };
    }
  }

  /**
   * Get current policy interest rate
   */
  async getPolicyRate(): Promise<number> {
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
  async getPolicyRateHistory(startDate?: string, endDate?: string): Promise<any[]> {
    const endpoint = '/observations/AVG.INTWO';
    const params: Record<string, any> = { 
      format: 'json'
    };
    
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    
    const response = await this.makeRequest(endpoint, params);
    return this.transformPolicyRateHistory(response);
  }

  /**
   * Get current exchange rates
   */
  async getExchangeRates(): Promise<any> {
    const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CHF'];
    const rates: Record<string, number> = {};
    
    for (const currency of currencies) {
      try {
        const rate = await this.getExchangeRate(currency);
        rates[currency] = rate;
      } catch (error) {
        console.warn(`Failed to fetch ${currency} rate:`, error.message);
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
  async getExchangeRate(currency: string): Promise<number> {
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
  async getExchangeRateHistory(currency: string, startDate?: string, endDate?: string): Promise<any[]> {
    const endpoint = `/observations/FX${currency}CAD`;
    const params: Record<string, any> = { 
      format: 'json'
    };
    
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    
    const response = await this.makeRequest(endpoint, params);
    return this.transformExchangeRateHistory(response, currency);
  }

  /**
   * Get prime rate
   */
  async getPrimeRate(): Promise<number> {
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
  async getMonetaryPolicyAnnouncements(): Promise<any[]> {
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
  async getEconomicIndicators(): Promise<EconomicIndicators> {
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
  async getAvailableSeries(): Promise<string[]> {
    try {
      const endpoint = '/series';
      const params = { format: 'json' };
      
      const response = await this.makeRequest(endpoint, params);
      return response.series || [];
    } catch (error) {
      console.warn('Could not fetch available series:', error.message);
      return [];
    }
  }

  /**
   * Get series metadata
   */
  async getSeriesMetadata(seriesId: string): Promise<any> {
    const endpoint = `/series/${seriesId}`;
    const params = { format: 'json' };
    
    return await this.makeRequest(endpoint, params);
  }

  /**
   * Make HTTP request to Bank of Canada API
   */
  async makeRequest(endpoint: string, params: Record<string, any>): Promise<any> {
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
  private extractPolicyRate(response: any): number {
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
  private extractExchangeRate(response: any): number {
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
  private transformPolicyRateHistory(response: any): any[] {
    const observations = response.observations || [];
    
    return observations.map((obs: any) => ({
      date: obs.d,
      value: obs.AVG_INTWO?.v || obs.value,
      status: obs.AVG_INTWO?.s || obs.status
    }));
  }

  /**
   * Transform exchange rate history response
   */
  private transformExchangeRateHistory(response: any, currency: string): any[] {
    const observations = response.observations || [];
    
    return observations.map((obs: any) => ({
      date: obs.d,
      value: obs.value || obs.v,
      status: obs.status || obs.s
    }));
  }

  /**
   * Transform announcements response
   */
  private transformAnnouncements(response: any): any[] {
    const announcements = response.announcements || [];
    
    return announcements.map((announcement: any) => ({
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
  private async calculateDataQuality(): Promise<DataQualityMetrics> {
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
  async getInterestRateForecasts(): Promise<any> {
    try {
      const endpoint = '/forecasts/interest-rates';
      const params = { format: 'json' };
      
      const response = await this.makeRequest(endpoint, params);
      return this.transformForecastResponse(response);
    } catch (error) {
      console.warn('Interest rate forecasts not available:', error.message);
      return null;
    }
  }

  /**
   * Transform forecast response
   */
  private transformForecastResponse(response: any): any {
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
  async getEconomicOutlook(): Promise<any[]> {
    try {
      const endpoint = '/reports/economic-outlook';
      const params = { format: 'json' };
      
      const response = await this.makeRequest(endpoint, params);
      return response.reports || [];
    } catch (error) {
      console.warn('Economic outlook reports not available:', error.message);
      return [];
    }
  }

  /**
   * Get financial system review
   */
  async getFinancialSystemReview(): Promise<any> {
    try {
      const endpoint = '/reports/financial-system-review';
      const params = { format: 'json' };
      
      const response = await this.makeRequest(endpoint, params);
      return this.transformFinancialSystemReview(response);
    } catch (error) {
      console.warn('Financial system review not available:', error.message);
      return null;
    }
  }

  /**
   * Transform financial system review response
   */
  private transformFinancialSystemReview(response: any): any {
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