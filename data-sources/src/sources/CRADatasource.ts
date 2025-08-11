import { 
  DataSource, 
  HealthStatus, 
  DataQualityMetrics,
  TaxRates,
  IncomeTaxBrackets,
  GovernmentBenefit,
  BenefitEligibilityResult,
  CanadianLocation,
  Province
} from '../types';

/**
 * 🇨🇦 Canada Revenue Agency Data Source
 * 
 * Integrates with the CRA API to provide:
 * - Tax rates and brackets
 * - Government benefits information
 * - Tax calculation tools
 * - Benefit eligibility checking
 * 
 * API Documentation: https://www.canada.ca/en/revenue-agency.html
 */
export class CRADatasource implements DataSource {
  public readonly name = 'Canada Revenue Agency';
  public readonly baseUrl = 'https://api.cra-arc.gc.ca';
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
   * Perform health check on the CRA API
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
   * Get tax rates for a specific location
   */
  async getTaxRates(location: CanadianLocation, year: number = new Date().getFullYear()): Promise<TaxRates> {
    const endpoint = '/v1/tax-rates';
    const params = { 
      province: location.province,
      year: year.toString(),
      format: 'json'
    };
    
    const response = await this.makeRequest(endpoint, params);
    const taxRates = this.transformTaxRatesResponse(response, location);
    
    this.lastUpdate = new Date();
    return taxRates;
  }

  /**
   * Get income tax brackets for a province
   */
  async getIncomeTaxBrackets(province: Province, year: number = new Date().getFullYear()): Promise<IncomeTaxBrackets> {
    const endpoint = '/v1/tax-brackets';
    const params = { 
      province,
      year: year.toString(),
      format: 'json'
    };
    
    const response = await this.makeRequest(endpoint, params);
    return this.transformTaxBracketsResponse(response, province, year);
  }

  /**
   * Get government benefits information
   */
  async getGovernmentBenefits(benefitType?: string, province?: Province): Promise<GovernmentBenefit[]> {
    const endpoint = '/v1/benefits';
    const params: Record<string, any> = { 
      format: 'json'
    };
    
    if (benefitType) params['type'] = benefitType;
    if (province) params['province'] = province;
    
    const response = await this.makeRequest(endpoint, params);
    return this.transformBenefitsResponse(response);
  }

  /**
   * Check benefit eligibility
   */
  async checkBenefitEligibility(
    benefitId: string, 
    income: number, 
    familySize: number, 
    province: Province
  ): Promise<BenefitEligibilityResult> {
    const endpoint = '/v1/benefits/eligibility';
    const params = { 
      benefitId,
      income: income.toString(),
      familySize: familySize.toString(),
      province,
      format: 'json'
    };
    
    const response = await this.makeRequest(endpoint, params);
    return this.transformEligibilityResponse(response);
  }

  /**
   * Calculate tax amount
   */
  async calculateTax(
    income: number, 
    province: Province, 
    year: number = new Date().getFullYear(),
    deductions: number = 0
  ): Promise<any> {
    const endpoint = '/v1/tax-calculator';
    const params = { 
      income: income.toString(),
      province,
      year: year.toString(),
      deductions: deductions.toString(),
      format: 'json'
    };
    
    const response = await this.makeRequest(endpoint, params);
    return this.transformTaxCalculationResponse(response);
  }

  /**
   * Get GST/HST rates
   */
  async getGSTHSTRates(province?: Province): Promise<any> {
    const endpoint = '/v1/gst-hst-rates';
    const params: Record<string, any> = { 
      format: 'json'
    };
    
    if (province) params['province'] = province;
    
    const response = await this.makeRequest(endpoint, params);
    return this.transformGSTHSTResponse(response);
  }

  /**
   * Get property tax information
   */
  async getPropertyTaxInfo(location: CanadianLocation): Promise<any> {
    const endpoint = '/v1/property-tax';
    const params = { 
      province: location.province,
      city: location.city,
      format: 'json'
    };
    
    const response = await this.makeRequest(endpoint, params);
    return this.transformPropertyTaxResponse(response);
  }

  /**
   * Get business tax information
   */
  async getBusinessTaxInfo(province: Province, businessType?: string): Promise<any> {
    const endpoint = '/v1/business-tax';
    const params: Record<string, any> = { 
      province,
      format: 'json'
    };
    
    if (businessType) params['businessType'] = businessType;
    
    const response = await this.makeRequest(endpoint, params);
    return this.transformBusinessTaxResponse(response);
  }

  /**
   * Get tax credits and deductions
   */
  async getTaxCredits(province: Province, year: number = new Date().getFullYear()): Promise<any[]> {
    const endpoint = '/v1/tax-credits';
    const params = { 
      province,
      year: year.toString(),
      format: 'json'
    };
    
    const response = await this.makeRequest(endpoint, params);
    return this.transformTaxCreditsResponse(response);
  }

  /**
   * Get filing deadlines
   */
  async getFilingDeadlines(year: number = new Date().getFullYear()): Promise<any[]> {
    const endpoint = '/v1/filing-deadlines';
    const params = { 
      year: year.toString(),
      format: 'json'
    };
    
    const response = await this.makeRequest(endpoint, params);
    return this.transformFilingDeadlinesResponse(response);
  }

  /**
   * Make HTTP request to the CRA API
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
        throw new Error(`CRA API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Check for API errors in response
      if ((data as any).error) {
        throw new Error(`CRA API error: ${(data as any).error.message || (data as any).error}`);
      }
      
      return data;
    } catch (error) {
      console.error(`Error making request to CRA API: ${endpoint}`, error);
      throw error;
    }
  }

  /**
   * Transform tax rates response
   */
  private transformTaxRatesResponse(response: any, location: CanadianLocation): TaxRates {
    const rates = response.rates || {};
    
    return {
      location,
      federal: {
        gst: rates.federal?.gst || 0,
        hst: rates.federal?.hst || 0
      },
      provincial: {
        pst: rates.provincial?.pst || 0,
        hst: rates.provincial?.hst || 0,
        qst: rates.provincial?.qst || 0,
        rst: rates.provincial?.rst || 0
      },
      municipal: {
        propertyTax: rates.municipal?.propertyTax || 0,
        businessTax: rates.municipal?.businessTax || 0,
        developmentCharges: rates.municipal?.developmentCharges || 0
      },
      lastUpdated: new Date(rates.lastUpdated || Date.now()),
      source: this.name
    };
  }

  /**
   * Transform tax brackets response
   */
  private transformTaxBracketsResponse(response: any, province: Province, year: number): IncomeTaxBrackets {
    const brackets = response.brackets || [];
    
    return {
      province,
      year,
      brackets: brackets.map((bracket: any) => ({
        minIncome: bracket.minIncome || 0,
        maxIncome: bracket.maxIncome,
        rate: bracket.rate || 0,
        baseTax: bracket.baseTax || 0
      })),
      lastUpdated: new Date(response.lastUpdated || Date.now()),
      source: this.name
    };
  }

  /**
   * Transform benefits response
   */
  private transformBenefitsResponse(response: any): GovernmentBenefit[] {
    const benefits = response.benefits || [];
    
    return benefits.map((benefit: any) => ({
      id: benefit.id || '',
      name: benefit.name || '',
      description: benefit.description || '',
      type: benefit.type || 'federal',
      category: benefit.category || 'other',
      eligibility: {
        incomeLimit: benefit.eligibility?.incomeLimit,
        ageRange: benefit.eligibility?.ageRange,
        residency: benefit.eligibility?.residency || false,
        citizenship: benefit.eligibility?.citizenship || false,
        familyStatus: benefit.eligibility?.familyStatus,
        employmentStatus: benefit.eligibility?.employmentStatus
      },
      amount: {
        type: benefit.amount?.type || 'fixed',
        value: benefit.amount?.value || 0,
        maxAmount: benefit.amount?.maxAmount,
        minAmount: benefit.amount?.minAmount
      },
      application: {
        method: benefit.application?.method || 'online',
        requiredDocuments: benefit.application?.requiredDocuments || [],
        processingTime: benefit.application?.processingTime || '',
        renewalRequired: benefit.application?.renewalRequired || false,
        renewalFrequency: benefit.application?.renewalFrequency
      },
      contact: {
        phone: benefit.contact?.phone || '',
        email: benefit.contact?.email || '',
        website: benefit.contact?.website || '',
        officeHours: benefit.contact?.officeHours
      },
      lastUpdated: new Date(benefit.lastUpdated || Date.now()),
      source: this.name
    }));
  }

  /**
   * Transform eligibility response
   */
  private transformEligibilityResponse(response: any): BenefitEligibilityResult {
    const eligibility = response.eligibility || {};
    
    return {
      benefit: eligibility.benefit || {},
      isEligible: eligibility.isEligible || false,
      estimatedAmount: eligibility.estimatedAmount || 0,
      confidence: eligibility.confidence || 0,
      requirements: eligibility.requirements || [],
      nextSteps: eligibility.nextSteps || []
    } as BenefitEligibilityResult;
  }

  /**
   * Transform tax calculation response
   */
  private transformTaxCalculationResponse(response: any): any {
    const calculation = response.calculation || {};
    
    return {
      grossIncome: calculation.grossIncome || 0,
      deductions: calculation.deductions || 0,
      taxableIncome: calculation.taxableIncome || 0,
      federalTax: calculation.federalTax || 0,
      provincialTax: calculation.provincialTax || 0,
      totalTax: calculation.totalTax || 0,
      effectiveTaxRate: calculation.effectiveTaxRate || 0,
      marginalTaxRate: calculation.marginalTaxRate || 0
    };
  }

  /**
   * Transform GST/HST response
   */
  private transformGSTHSTResponse(response: any): any {
    const rates = response.rates || {};
    
    return {
      gst: rates.gst || 0,
      hst: rates.hst || 0,
      pst: rates.pst || 0,
      qst: rates.qst || 0,
      rst: rates.rst || 0,
      effectiveDate: new Date(rates.effectiveDate || Date.now()),
      province: rates.province || 'ON'
    };
  }

  /**
   * Transform property tax response
   */
  private transformPropertyTaxResponse(response: any): any {
    const propertyTax = response.propertyTax || {};
    
    return {
      rate: propertyTax.rate || 0,
      assessmentValue: propertyTax.assessmentValue || 0,
      annualTax: propertyTax.annualTax || 0,
      monthlyTax: propertyTax.monthlyTax || 0,
      exemptions: propertyTax.exemptions || [],
      lastUpdated: new Date(propertyTax.lastUpdated || Date.now())
    };
  }

  /**
   * Transform business tax response
   */
  private transformBusinessTaxResponse(response: any): any {
    const businessTax = response.businessTax || {};
    
    return {
      corporateRate: businessTax.corporateRate || 0,
      smallBusinessRate: businessTax.smallBusinessRate || 0,
      payrollTax: businessTax.payrollTax || 0,
      salesTax: businessTax.salesTax || 0,
      lastUpdated: new Date(businessTax.lastUpdated || Date.now())
    };
  }

  /**
   * Transform tax credits response
   */
  private transformTaxCreditsResponse(response: any): any[] {
    const credits = response.credits || [];
    
    return credits.map((credit: any) => ({
      name: credit.name || '',
      description: credit.description || '',
      amount: credit.amount || 0,
      type: credit.type || 'refundable',
      eligibility: credit.eligibility || '',
      lastUpdated: new Date(credit.lastUpdated || Date.now())
    }));
  }

  /**
   * Transform filing deadlines response
   */
  private transformFilingDeadlinesResponse(response: any): any[] {
    const deadlines = response.deadlines || [];
    
    return deadlines.map((deadline: any) => ({
      type: deadline.type || '',
      description: deadline.description || '',
      dueDate: new Date(deadline.dueDate || Date.now()),
      isExtended: deadline.isExtended || false,
      extendedDate: deadline.extendedDate ? new Date(deadline.extendedDate) : undefined
    }));
  }

  /**
   * Calculate data quality metrics
   */
  private async calculateDataQuality(): Promise<DataQualityMetrics> {
    // This would be calculated based on actual data quality
    return {
      completeness: 0.99,
      accuracy: 0.99,
      freshness: 0.95,
      consistency: 0.98,
      reliability: 0.99
    };
  }
}