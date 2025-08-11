"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataValidationService = void 0;
/**
 * 🇨🇦 Data Validation Service
 *
 * Ensures data quality and integrity across all Canadian data sources
 * by validating incoming data against defined schemas and business rules.
 */
class DataValidationService {
    constructor() {
        this.validationRules = new Map();
        this.dataQualityThresholds = new Map();
        this.validationErrors = new Map();
        this.initializeValidationRules();
        this.initializeQualityThresholds();
    }
    /**
     * Initialize validation rules for different data types
     */
    initializeValidationRules() {
        // Housing data validation rules
        this.validationRules.set('housing', [
            {
                field: 'location.postalCode',
                rule: 'required',
                message: 'Postal code is required for housing data'
            },
            {
                field: 'location.province',
                rule: 'enum',
                values: ['AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'],
                message: 'Province must be a valid Canadian province'
            },
            {
                field: 'prices.averagePrice',
                rule: 'range',
                min: 0,
                max: 10000000,
                message: 'Average price must be between 0 and 10,000,000'
            },
            {
                field: 'prices.medianPrice',
                rule: 'range',
                min: 0,
                max: 10000000,
                message: 'Median price must be between 0 and 10,000,000'
            },
            {
                field: 'rental.averageRent',
                rule: 'range',
                min: 0,
                max: 10000,
                message: 'Average rent must be between 0 and 10,000'
            },
            {
                field: 'market.daysOnMarket',
                rule: 'range',
                min: 0,
                max: 1000,
                message: 'Days on market must be between 0 and 1000'
            }
        ]);
        // Economic indicators validation rules
        this.validationRules.set('economic', [
            {
                field: 'interestRates.policyRate',
                rule: 'range',
                min: 0,
                max: 20,
                message: 'Policy rate must be between 0% and 20%'
            },
            {
                field: 'interestRates.primeRate',
                rule: 'range',
                min: 0,
                max: 25,
                message: 'Prime rate must be between 0% and 25%'
            },
            {
                field: 'inflation.cpi',
                rule: 'range',
                min: 0,
                max: 1000,
                message: 'CPI must be between 0 and 1000'
            },
            {
                field: 'exchangeRates.usd',
                rule: 'range',
                min: 0.5,
                max: 2.0,
                message: 'USD exchange rate must be between 0.5 and 2.0'
            }
        ]);
        // Utility rates validation rules
        this.validationRules.set('utilities', [
            {
                field: 'electricity.ratePerKwh',
                rule: 'range',
                min: 0,
                max: 1,
                message: 'Electricity rate must be between 0 and 1 per kWh'
            },
            {
                field: 'naturalGas.ratePerM3',
                rule: 'range',
                min: 0,
                max: 1,
                message: 'Natural gas rate must be between 0 and 1 per m³'
            },
            {
                field: 'water.ratePerM3',
                rule: 'range',
                min: 0,
                max: 10,
                message: 'Water rate must be between 0 and 10 per m³'
            }
        ]);
        // Government benefits validation rules
        this.validationRules.set('benefits', [
            {
                field: 'amount',
                rule: 'range',
                min: 0,
                max: 100000,
                message: 'Benefit amount must be between 0 and 100,000'
            },
            {
                field: 'eligibility.age',
                rule: 'range',
                min: 0,
                max: 120,
                message: 'Age must be between 0 and 120'
            },
            {
                field: 'eligibility.income',
                rule: 'range',
                min: 0,
                max: 1000000,
                message: 'Income must be between 0 and 1,000,000'
            }
        ]);
        // Tax information validation rules
        this.validationRules.set('tax', [
            {
                field: 'rates.federal',
                rule: 'range',
                min: 0,
                max: 100,
                message: 'Federal tax rate must be between 0% and 100%'
            },
            {
                field: 'rates.provincial',
                rule: 'range',
                min: 0,
                max: 100,
                message: 'Provincial tax rate must be between 0% and 100%'
            },
            {
                field: 'brackets',
                rule: 'array',
                minLength: 1,
                message: 'Tax brackets must be defined'
            }
        ]);
    }
    /**
     * Initialize quality thresholds for different data types
     */
    initializeQualityThresholds() {
        this.dataQualityThresholds.set('housing', 0.9);
        this.dataQualityThresholds.set('economic', 0.95);
        this.dataQualityThresholds.set('utilities', 0.85);
        this.dataQualityThresholds.set('benefits', 0.9);
        this.dataQualityThresholds.set('tax', 0.95);
        this.dataQualityThresholds.set('costOfLiving', 0.85);
        this.dataQualityThresholds.set('salary', 0.8);
    }
    /**
     * Validate housing data
     */
    validateHousingData(data) {
        const errors = [];
        const warnings = [];
        // Apply housing validation rules
        const rules = this.validationRules.get('housing') || [];
        for (const rule of rules) {
            const result = this.applyValidationRule(data, rule);
            if (result.error) {
                errors.push(result.error);
            }
            if (result.warning) {
                warnings.push(result.warning);
            }
        }
        // Additional business logic validations
        const businessValidation = this.validateHousingBusinessLogic(data);
        errors.push(...businessValidation.errors);
        warnings.push(...businessValidation.warnings);
        // Calculate data quality score
        const qualityScore = this.calculateHousingDataQuality(data, errors);
        return {
            isValid: errors.length === 0,
            errors,
            warnings,
            qualityScore,
            timestamp: new Date()
        };
    }
    /**
     * Validate economic indicators
     */
    validateEconomicIndicators(data) {
        const errors = [];
        const warnings = [];
        // Apply economic validation rules
        const rules = this.validationRules.get('economic') || [];
        for (const rule of rules) {
            const result = this.applyValidationRule(data, rule);
            if (result.error) {
                errors.push(result.error);
            }
            if (result.warning) {
                warnings.push(result.warning);
            }
        }
        // Additional business logic validations
        const businessValidation = this.validateEconomicBusinessLogic(data);
        errors.push(...businessValidation.errors);
        warnings.push(...businessValidation.warnings);
        // Calculate data quality score
        const qualityScore = this.calculateEconomicDataQuality(data, errors);
        return {
            isValid: errors.length === 0,
            errors,
            warnings,
            qualityScore,
            timestamp: new Date()
        };
    }
    /**
     * Validate utility rates
     */
    validateUtilityRates(data) {
        const errors = [];
        const warnings = [];
        // Apply utility validation rules
        const rules = this.validationRules.get('utilities') || [];
        for (const rule of rules) {
            const result = this.applyValidationRule(data, rule);
            if (result.error) {
                errors.push(result.error);
            }
            if (result.warning) {
                warnings.push(result.warning);
            }
        }
        // Calculate data quality score
        const qualityScore = this.calculateUtilityDataQuality(data, errors);
        return {
            isValid: errors.length === 0,
            errors,
            warnings,
            qualityScore,
            timestamp: new Date()
        };
    }
    /**
     * Validate government benefits
     */
    validateGovernmentBenefits(data) {
        const errors = [];
        const warnings = [];
        // Apply benefits validation rules
        const rules = this.validationRules.get('benefits') || [];
        for (const rule of rules) {
            const result = this.applyValidationRule(data, rule);
            if (result.error) {
                errors.push(result.error);
            }
            if (result.warning) {
                warnings.push(result.warning);
            }
        }
        // Calculate data quality score
        const qualityScore = this.calculateBenefitsDataQuality(data, errors);
        return {
            isValid: errors.length === 0,
            errors,
            warnings,
            qualityScore,
            timestamp: new Date()
        };
    }
    /**
     * Validate tax information
     */
    validateTaxInformation(data) {
        const errors = [];
        const warnings = [];
        // Apply tax validation rules
        const rules = this.validationRules.get('tax') || [];
        for (const rule of rules) {
            const result = this.applyValidationRule(data, rule);
            if (result.error) {
                errors.push(result.error);
            }
            if (result.warning) {
                warnings.push(result.warning);
            }
        }
        // Calculate data quality score
        const qualityScore = this.calculateTaxDataQuality(data, errors);
        return {
            isValid: errors.length === 0,
            errors,
            warnings,
            qualityScore,
            timestamp: new Date()
        };
    }
    /**
     * Apply a single validation rule to data
     */
    applyValidationRule(data, rule) {
        const value = this.getNestedValue(data, rule.field);
        switch (rule.rule) {
            case 'required':
                if (value === undefined || value === null || value === '') {
                    return {
                        error: {
                            field: rule.field,
                            message: rule.message,
                            severity: 'error',
                            rule: rule.rule
                        }
                    };
                }
                break;
            case 'range':
                if (typeof value === 'number') {
                    if (rule.min !== undefined && rule.max !== undefined && (value < rule.min || value > rule.max)) {
                        return {
                            error: {
                                field: rule.field,
                                message: rule.message,
                                severity: 'error',
                                rule: rule.rule,
                                details: { value, min: rule.min, max: rule.max }
                            }
                        };
                    }
                }
                break;
            case 'enum':
                if (rule.values && !rule.values.includes(value)) {
                    return {
                        error: {
                            field: rule.field,
                            message: rule.message,
                            severity: 'error',
                            rule: rule.rule,
                            details: { value, allowedValues: rule.values }
                        }
                    };
                }
                break;
            case 'array':
                if (!Array.isArray(value) || (rule.minLength !== undefined && value.length < rule.minLength)) {
                    return {
                        error: {
                            field: rule.field,
                            message: rule.message,
                            severity: 'error',
                            rule: rule.rule,
                            details: { actualLength: Array.isArray(value) ? value.length : 0, minLength: rule.minLength }
                        }
                    };
                }
                break;
            case 'format':
                if (rule.pattern && !rule.pattern.test(value)) {
                    return {
                        error: {
                            field: rule.field,
                            message: rule.message,
                            severity: 'error',
                            rule: rule.rule,
                            details: { value, pattern: rule.pattern.toString() }
                        }
                    };
                }
                break;
        }
        return {};
    }
    /**
     * Get nested value from object using dot notation
     */
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    }
    /**
     * Validate housing business logic
     */
    validateHousingBusinessLogic(data) {
        const errors = [];
        const warnings = [];
        // Check if median price is reasonable compared to average price
        if (data.prices.medianPrice && data.prices.averagePrice) {
            const ratio = data.prices.medianPrice / data.prices.averagePrice;
            if (ratio < 0.5 || ratio > 2.0) {
                warnings.push({
                    field: 'prices',
                    message: 'Median price seems unusually different from average price',
                    severity: 'warning',
                    details: { median: data.prices.medianPrice, average: data.prices.averagePrice, ratio }
                });
            }
        }
        // Check if rental rates are reasonable for the area
        if (data.rental.averageRent && data.prices.averagePrice) {
            const annualRent = data.rental.averageRent * 12;
            const rentToPriceRatio = annualRent / data.prices.averagePrice;
            if (rentToPriceRatio < 0.02 || rentToPriceRatio > 0.15) {
                warnings.push({
                    field: 'rental',
                    message: 'Rental rates seem unusually high or low compared to property prices',
                    severity: 'warning',
                    details: { annualRent, averagePrice: data.prices.averagePrice, ratio: rentToPriceRatio }
                });
            }
        }
        return { errors, warnings };
    }
    /**
     * Validate economic business logic
     */
    validateEconomicBusinessLogic(data) {
        const errors = [];
        const warnings = [];
        // Check if prime rate is reasonable compared to policy rate
        if (data.interestRates.primeRate && data.interestRates.policyRate) {
            const spread = data.interestRates.primeRate - data.interestRates.policyRate;
            if (spread < 1.5 || spread > 4.0) {
                warnings.push({
                    field: 'interestRates',
                    message: 'Prime rate spread seems unusual compared to policy rate',
                    severity: 'warning',
                    details: { primeRate: data.interestRates.primeRate, policyRate: data.interestRates.policyRate, spread }
                });
            }
        }
        return { errors, warnings };
    }
    /**
     * Calculate housing data quality score
     */
    calculateHousingDataQuality(data, errors) {
        let score = 1.0;
        // Deduct points for validation errors
        score -= errors.length * 0.1;
        // Deduct points for missing data
        if (!data.prices.averagePrice)
            score -= 0.2;
        if (!data.prices.medianPrice)
            score -= 0.2;
        if (!data.rental.averageRent)
            score -= 0.15;
        if (!data.market.daysOnMarket)
            score -= 0.1;
        // Deduct points for stale data
        const daysSinceUpdate = (Date.now() - data.prices.lastUpdated.getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceUpdate > 30)
            score -= 0.2;
        if (daysSinceUpdate > 90)
            score -= 0.3;
        return Math.max(0, score);
    }
    /**
     * Calculate economic data quality score
     */
    calculateEconomicDataQuality(data, errors) {
        let score = 1.0;
        // Deduct points for validation errors
        score -= errors.length * 0.1;
        // Deduct points for missing data
        if (!data.interestRates.policyRate)
            score -= 0.3;
        if (!data.interestRates.primeRate)
            score -= 0.2;
        if (!data.exchangeRates.usd)
            score -= 0.2;
        // Deduct points for stale data
        const daysSinceUpdate = (Date.now() - data.date.getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceUpdate > 7)
            score -= 0.2;
        if (daysSinceUpdate > 30)
            score -= 0.4;
        return Math.max(0, score);
    }
    /**
     * Calculate utility data quality score
     */
    calculateUtilityDataQuality(data, errors) {
        let score = 1.0;
        // Deduct points for validation errors
        score -= errors.length * 0.1;
        // Deduct points for missing data
        if (!data.electricity.residentialRate)
            score -= 0.3;
        if (!data.naturalGas.residentialRate)
            score -= 0.2;
        if (!data.water.residentialRate)
            score -= 0.2;
        return Math.max(0, score);
    }
    /**
     * Calculate benefits data quality score
     */
    calculateBenefitsDataQuality(data, errors) {
        let score = 1.0;
        // Deduct points for validation errors
        score -= errors.length * 0.1;
        // Deduct points for missing data
        if (data.length === 0)
            score -= 0.5;
        if (data.some(benefit => !benefit.amount))
            score -= 0.3;
        if (data.some(benefit => !benefit.eligibility))
            score -= 0.3;
        return Math.max(0, score);
    }
    /**
     * Calculate tax data quality score
     */
    calculateTaxDataQuality(data, errors) {
        let score = 1.0;
        // Deduct points for validation errors
        score -= errors.length * 0.1;
        // Deduct points for missing data
        if (!data.federal)
            score -= 0.3;
        if (!data.provincial)
            score -= 0.2;
        if (!data.municipal)
            score -= 0.2;
        return Math.max(0, score);
    }
    /**
     * Get validation errors for a specific data source
     */
    getValidationErrors(sourceName) {
        return this.validationErrors.get(sourceName) || [];
    }
    /**
     * Clear validation errors for a data source
     */
    clearValidationErrors(sourceName) {
        this.validationErrors.delete(sourceName);
    }
    /**
     * Get overall data quality metrics
     */
    getOverallDataQuality() {
        const allErrors = Array.from(this.validationErrors.values()).flat();
        const totalErrors = allErrors.length;
        const criticalErrors = allErrors.filter(e => e.severity === 'critical').length;
        return {
            completeness: Math.max(0, 1 - (totalErrors * 0.1)),
            accuracy: Math.max(0, 1 - (criticalErrors * 0.2)),
            freshness: 0.9, // This would be calculated based on actual data timestamps
            consistency: Math.max(0, 1 - (totalErrors * 0.05)),
            reliability: Math.max(0, 1 - (criticalErrors * 0.15))
        };
    }
}
exports.DataValidationService = DataValidationService;
//# sourceMappingURL=DataValidationService.js.map