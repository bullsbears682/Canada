import { DataQualityMetrics, HousingData, EconomicIndicators, UtilityRates, GovernmentBenefit, TaxRates } from '../types';
/**
 * 🇨🇦 Data Validation Service
 *
 * Ensures data quality and integrity across all Canadian data sources
 * by validating incoming data against defined schemas and business rules.
 */
export declare class DataValidationService {
    private validationRules;
    private dataQualityThresholds;
    private validationErrors;
    constructor();
    /**
     * Initialize validation rules for different data types
     */
    private initializeValidationRules;
    /**
     * Initialize quality thresholds for different data types
     */
    private initializeQualityThresholds;
    /**
     * Validate housing data
     */
    validateHousingData(data: HousingData): ValidationResult;
    /**
     * Validate economic indicators
     */
    validateEconomicIndicators(data: EconomicIndicators): ValidationResult;
    /**
     * Validate utility rates
     */
    validateUtilityRates(data: UtilityRates): ValidationResult;
    /**
     * Validate government benefits
     */
    validateGovernmentBenefits(data: GovernmentBenefit[]): ValidationResult;
    /**
     * Validate tax information
     */
    validateTaxInformation(data: TaxRates): ValidationResult;
    /**
     * Apply a single validation rule to data
     */
    private applyValidationRule;
    /**
     * Get nested value from object using dot notation
     */
    private getNestedValue;
    /**
     * Validate housing business logic
     */
    private validateHousingBusinessLogic;
    /**
     * Validate economic business logic
     */
    private validateEconomicBusinessLogic;
    /**
     * Calculate housing data quality score
     */
    private calculateHousingDataQuality;
    /**
     * Calculate economic data quality score
     */
    private calculateEconomicDataQuality;
    /**
     * Calculate utility data quality score
     */
    private calculateUtilityDataQuality;
    /**
     * Calculate benefits data quality score
     */
    private calculateBenefitsDataQuality;
    /**
     * Calculate tax data quality score
     */
    private calculateTaxDataQuality;
    /**
     * Get validation errors for a specific data source
     */
    getValidationErrors(sourceName: string): ValidationError[];
    /**
     * Clear validation errors for a data source
     */
    clearValidationErrors(sourceName: string): void;
    /**
     * Get overall data quality metrics
     */
    getOverallDataQuality(): DataQualityMetrics;
}
/**
 * Validation result interface
 */
interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
    warnings: ValidationWarning[];
    qualityScore: number;
    timestamp: Date;
}
/**
 * Validation error interface
 */
interface ValidationError {
    field: string;
    message: string;
    severity: 'error' | 'critical';
    rule: string;
    details?: any;
}
/**
 * Validation warning interface
 */
interface ValidationWarning {
    field: string;
    message: string;
    severity: 'warning';
    details?: any;
}
export {};
//# sourceMappingURL=DataValidationService.d.ts.map