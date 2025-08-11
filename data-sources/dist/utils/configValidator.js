"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigValidator = void 0;
const dataSourceConfig_1 = require("../config/dataSourceConfig");
/**
 * Configuration validation utility
 * Ensures all required configuration is present before system initialization
 */
class ConfigValidator {
    /**
     * Validate all required configuration is present
     */
    static validateConfiguration() {
        const errors = [];
        const warnings = [];
        // Check required sources
        for (const source of this.REQUIRED_SOURCES) {
            const config = (0, dataSourceConfig_1.getDataSourceConfig)(source);
            if (!config || !config.apiKey) {
                errors.push(`Missing required API key for ${source}`);
            }
        }
        // Check optional sources
        for (const source of this.OPTIONAL_SOURCES) {
            const config = (0, dataSourceConfig_1.getDataSourceConfig)(source);
            if (!config || !config.apiKey) {
                warnings.push(`Optional API key not configured for ${source} - some features will be limited`);
            }
        }
        // Validate environment variables
        if (!process.env["NODE_ENV"]) {
            warnings.push('NODE_ENV not set - defaulting to development mode');
        }
        return {
            isValid: errors.length === 0,
            errors,
            warnings
        };
    }
    /**
     * Get configuration summary
     */
    static getConfigurationSummary() {
        const required = [];
        const optional = [];
        const missing = [];
        // Check required sources
        for (const source of this.REQUIRED_SOURCES) {
            const config = (0, dataSourceConfig_1.getDataSourceConfig)(source);
            if (config && config.apiKey) {
                required.push(source);
            }
            else {
                missing.push(source);
            }
        }
        // Check optional sources
        for (const source of this.OPTIONAL_SOURCES) {
            const config = (0, dataSourceConfig_1.getDataSourceConfig)(source);
            if (config && config.apiKey) {
                optional.push(source);
            }
        }
        return { required, optional, missing };
    }
    /**
     * Validate specific data source configuration
     */
    static validateDataSourceConfig(sourceName) {
        const errors = [];
        const config = (0, dataSourceConfig_1.getDataSourceConfig)(sourceName);
        if (!config) {
            errors.push(`Configuration not found for ${sourceName}`);
            return { isValid: false, errors };
        }
        if (!config.apiKey) {
            errors.push(`API key not configured for ${sourceName}`);
        }
        if (!config.baseUrl && sourceName !== 'stats-can') {
            errors.push(`Base URL not configured for ${sourceName}`);
        }
        if (config.rateLimit && config.rateLimit.requests <= 0) {
            errors.push(`Invalid rate limit configuration for ${sourceName}`);
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    /**
     * Get health check configuration
     */
    static getHealthCheckConfig() {
        return {
            enabled: process.env["HEALTH_CHECK_ENABLED"] !== 'false',
            interval: parseInt(process.env["HEALTH_CHECK_INTERVAL"] || '300000'), // 5 minutes default
            timeout: parseInt(process.env["HEALTH_CHECK_TIMEOUT"] || '30000') // 30 seconds default
        };
    }
}
exports.ConfigValidator = ConfigValidator;
ConfigValidator.REQUIRED_SOURCES = [
    'stats-can',
    'cmhc',
    'bank-of-canada'
];
ConfigValidator.OPTIONAL_SOURCES = [
    'ontario-energy-board',
    'toronto-open-data',
    'cra',
    'esdc'
];
//# sourceMappingURL=configValidator.js.map