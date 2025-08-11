import { DataSource, HealthStatus, TaxRates, IncomeTaxBrackets, GovernmentBenefit, BenefitEligibilityResult, CanadianLocation, Province } from '../types';
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
export declare class CRADatasource implements DataSource {
    readonly name = "Canada Revenue Agency";
    readonly baseUrl = "https://api.cra-arc.gc.ca";
    readonly apiKey: string;
    private lastUpdate;
    constructor(apiKey: string);
    /**
     * Get the last update time for this data source
     */
    getLastUpdate(): Promise<Date>;
    /**
     * Perform health check on the CRA API
     */
    healthCheck(): Promise<HealthStatus>;
    /**
     * Get tax rates for a specific location
     */
    getTaxRates(location: CanadianLocation, year?: number): Promise<TaxRates>;
    /**
     * Get income tax brackets for a province
     */
    getIncomeTaxBrackets(province: Province, year?: number): Promise<IncomeTaxBrackets>;
    /**
     * Get government benefits information
     */
    getGovernmentBenefits(benefitType?: string, province?: Province): Promise<GovernmentBenefit[]>;
    /**
     * Check benefit eligibility
     */
    checkBenefitEligibility(benefitId: string, income: number, familySize: number, province: Province): Promise<BenefitEligibilityResult>;
    /**
     * Calculate tax amount
     */
    calculateTax(income: number, province: Province, year?: number, deductions?: number): Promise<any>;
    /**
     * Get GST/HST rates
     */
    getGSTHSTRates(province?: Province): Promise<any>;
    /**
     * Get property tax information
     */
    getPropertyTaxInfo(location: CanadianLocation): Promise<any>;
    /**
     * Get business tax information
     */
    getBusinessTaxInfo(province: Province, businessType?: string): Promise<any>;
    /**
     * Get tax credits and deductions
     */
    getTaxCredits(province: Province, year?: number): Promise<any[]>;
    /**
     * Get filing deadlines
     */
    getFilingDeadlines(year?: number): Promise<any[]>;
    /**
     * Make HTTP request to the CRA API
     */
    private makeRequest;
    /**
     * Transform tax rates response
     */
    private transformTaxRatesResponse;
    /**
     * Transform tax brackets response
     */
    private transformTaxBracketsResponse;
    /**
     * Transform benefits response
     */
    private transformBenefitsResponse;
    /**
     * Transform eligibility response
     */
    private transformEligibilityResponse;
    /**
     * Transform tax calculation response
     */
    private transformTaxCalculationResponse;
    /**
     * Transform GST/HST response
     */
    private transformGSTHSTResponse;
    /**
     * Transform property tax response
     */
    private transformPropertyTaxResponse;
    /**
     * Transform business tax response
     */
    private transformBusinessTaxResponse;
    /**
     * Transform tax credits response
     */
    private transformTaxCreditsResponse;
    /**
     * Transform filing deadlines response
     */
    private transformFilingDeadlinesResponse;
    /**
     * Calculate data quality metrics
     */
    private calculateDataQuality;
}
//# sourceMappingURL=CRADatasource.d.ts.map