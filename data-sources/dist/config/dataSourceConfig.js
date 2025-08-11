"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DATA_SOURCE_CONFIGS = void 0;
exports.getDataSourceConfig = getDataSourceConfig;
exports.getAllDataSourceNames = getAllDataSourceNames;
exports.getHighPriorityDataSources = getHighPriorityDataSources;
exports.getDataSourcesByFrequency = getDataSourcesByFrequency;
exports.validateDataSourceConfig = validateDataSourceConfig;
exports.getEnvironmentConfig = getEnvironmentConfig;
const types_1 = require("../types");
/**
 * 🇨🇦 Data Source Configuration
 *
 * Centralized configuration for all Canadian data sources used in the
 * Cost of Living Analyzer application.
 */
exports.DATA_SOURCE_CONFIGS = {
    // Statistics Canada - Official government statistics
    'stats-can': {
        name: 'Statistics Canada',
        baseUrl: 'https://api.statcan.gc.ca',
        apiKey: process.env['STATSCAN_API_KEY'] || '',
        rateLimit: {
            requests: 1000,
            window: 3600 // 1000 requests per hour
        },
        endpoints: {
            housing: {
                path: '/v1/housing',
                method: 'GET',
                params: ['postalCode', 'region', 'period'],
                headers: {}
            },
            economy: {
                path: '/v1/economy',
                method: 'GET',
                params: ['indicator', 'period'],
                headers: {}
            },
            demographics: {
                path: '/v1/geography',
                method: 'GET',
                params: ['postalCode', 'region'],
                headers: {}
            }
        },
        retryConfig: {
            maxRetries: 3,
            backoffMultiplier: 2,
            initialDelay: 1000
        },
        updateFrequency: types_1.UpdateFrequency.DAILY,
        priority: 'high',
        retryOnFailure: true,
        dataQualityThreshold: 0.9
    },
    // CMHC - Housing and mortgage data
    'cmhc': {
        name: 'CMHC',
        baseUrl: 'https://api.cmhc-schl.gc.ca',
        apiKey: process.env['CMHC_API_KEY'] || '',
        rateLimit: {
            requests: 500,
            window: 3600 // 500 requests per hour
        },
        endpoints: {
            mortgage: {
                path: '/v1/mortgage',
                method: 'GET',
                params: ['type', 'period'],
                headers: {}
            },
            rental: {
                path: '/v1/rental',
                method: 'GET',
                params: ['region', 'propertyType', 'period'],
                headers: {}
            },
            housing: {
                path: '/v1/housing',
                method: 'GET',
                params: ['region', 'type', 'period'],
                headers: {}
            }
        },
        retryConfig: {
            maxRetries: 3,
            backoffMultiplier: 2,
            initialDelay: 1000
        },
        updateFrequency: types_1.UpdateFrequency.WEEKLY,
        priority: 'high',
        retryOnFailure: true,
        dataQualityThreshold: 0.95
    },
    // Bank of Canada - Interest rates and exchange rates
    'bank-of-canada': {
        name: 'Bank of Canada',
        baseUrl: 'https://www.bankofcanada.ca/valet',
        apiKey: process.env['BANK_OF_CANADA_API_KEY'] || '',
        rateLimit: {
            requests: 2000,
            window: 3600 // 2000 requests per hour
        },
        endpoints: {
            observations: {
                path: '/observations',
                method: 'GET',
                params: ['series', 'recent', 'start_date', 'end_date'],
                headers: {}
            },
            series: {
                path: '/series',
                method: 'GET',
                params: [],
                headers: {}
            }
        },
        retryConfig: {
            maxRetries: 3,
            backoffMultiplier: 2,
            initialDelay: 1000
        },
        updateFrequency: types_1.UpdateFrequency.HOURLY,
        priority: 'critical',
        retryOnFailure: true,
        dataQualityThreshold: 0.98
    },
    // Provincial Utility Regulators (example: Ontario Energy Board)
    'ontario-energy-board': {
        name: 'Ontario Energy Board',
        baseUrl: 'https://api.oeb.ca',
        apiKey: process.env['OEB_API_KEY'] || '',
        rateLimit: {
            requests: 200,
            window: 3600 // 200 requests per hour
        },
        endpoints: {
            rates: {
                path: '/v1/rates',
                method: 'GET',
                params: ['utility', 'rateClass', 'effectiveDate'],
                headers: {}
            },
            utilities: {
                path: '/v1/utilities',
                method: 'GET',
                params: ['type', 'region'],
                headers: {}
            }
        },
        retryConfig: {
            maxRetries: 3,
            backoffMultiplier: 2,
            initialDelay: 1000
        },
        updateFrequency: types_1.UpdateFrequency.MONTHLY,
        priority: 'medium',
        retryOnFailure: true,
        dataQualityThreshold: 0.85
    },
    // Municipal Government APIs (example: Toronto Open Data)
    'toronto-open-data': {
        name: 'Toronto Open Data',
        baseUrl: 'https://ckan0.cf.opendata.inter.prod-toronto.ca',
        apiKey: process.env['TORONTO_OPEN_DATA_API_KEY'] || '',
        rateLimit: {
            requests: 1000,
            window: 3600 // 1000 requests per hour
        },
        endpoints: {
            datasets: {
                path: '/api/3/action',
                method: 'GET',
                params: ['action', 'id'],
                headers: {}
            },
            search: {
                path: '/api/3/action',
                method: 'GET',
                params: ['action', 'q', 'rows'],
                headers: {}
            }
        },
        retryConfig: {
            maxRetries: 3,
            backoffMultiplier: 2,
            initialDelay: 1000
        },
        updateFrequency: types_1.UpdateFrequency.WEEKLY,
        priority: 'medium',
        retryOnFailure: true,
        dataQualityThreshold: 0.8
    },
    // Canada Revenue Agency (tax information)
    'cra': {
        name: 'Canada Revenue Agency',
        baseUrl: 'https://api.cra-arc.gc.ca',
        apiKey: process.env['CRA_API_KEY'] || '',
        rateLimit: {
            requests: 100,
            window: 3600 // 100 requests per hour
        },
        endpoints: {
            taxRates: {
                path: '/v1/tax-rates',
                method: 'GET',
                params: ['year', 'province'],
                headers: {}
            },
            benefits: {
                path: '/v1/benefits',
                method: 'GET',
                params: ['type', 'eligibility'],
                headers: {}
            }
        },
        retryConfig: {
            maxRetries: 3,
            backoffMultiplier: 2,
            initialDelay: 1000
        },
        updateFrequency: types_1.UpdateFrequency.ANNUALLY,
        priority: 'high',
        retryOnFailure: true,
        dataQualityThreshold: 0.99
    },
    // Employment and Social Development Canada
    'esdc': {
        name: 'ESDC',
        baseUrl: 'https://api.esdc.gc.ca',
        apiKey: process.env['ESDC_API_KEY'] || '',
        rateLimit: {
            requests: 300,
            window: 3600 // 300 requests per hour
        },
        endpoints: {
            benefits: {
                path: '/v1/benefits',
                method: 'GET',
                params: ['type', 'province', 'eligibility'],
                headers: {}
            },
            employment: {
                path: '/v1/employment',
                method: 'GET',
                params: ['region', 'sector', 'period'],
                headers: {}
            }
        },
        retryConfig: {
            maxRetries: 3,
            backoffMultiplier: 2,
            initialDelay: 1000
        },
        updateFrequency: types_1.UpdateFrequency.MONTHLY,
        priority: 'high',
        retryOnFailure: true,
        dataQualityThreshold: 0.9
    }
};
/**
 * Get configuration for a specific data source
 */
function getDataSourceConfig(sourceName) {
    return exports.DATA_SOURCE_CONFIGS[sourceName] || null;
}
/**
 * Get all data source names
 */
function getAllDataSourceNames() {
    return Object.keys(exports.DATA_SOURCE_CONFIGS);
}
/**
 * Get high priority data sources
 */
function getHighPriorityDataSources() {
    return Object.entries(exports.DATA_SOURCE_CONFIGS)
        .filter(([_, config]) => config.priority === 'high' || config.priority === 'critical')
        .map(([name, _]) => name);
}
/**
 * Get data sources by update frequency
 */
function getDataSourcesByFrequency(frequency) {
    return Object.entries(exports.DATA_SOURCE_CONFIGS)
        .filter(([_, config]) => config.updateFrequency === frequency)
        .map(([name, _]) => name);
}
/**
 * Validate data source configuration
 */
function validateDataSourceConfig(config) {
    const errors = [];
    if (!config.name) {
        errors.push('Data source name is required');
    }
    if (!config.baseUrl) {
        errors.push('Base URL is required');
    }
    if (!config.apiKey) {
        errors.push('API key is required');
    }
    if (!config.rateLimit || !config.rateLimit.requests || !config.rateLimit.window) {
        errors.push('Rate limit configuration is required');
    }
    if (!config.endpoints || Object.keys(config.endpoints).length === 0) {
        errors.push('At least one endpoint must be configured');
    }
    if (!config.retryConfig) {
        errors.push('Retry configuration is required');
    }
    return errors;
}
/**
 * Get environment-specific configuration
 */
function getEnvironmentConfig() {
    const env = process.env['NODE_ENV'] || 'development';
    const baseConfig = {
        cacheTTL: {
            realTime: 5 * 60 * 1000, // 5 minutes
            hourly: 60 * 60 * 1000, // 1 hour
            daily: 24 * 60 * 60 * 1000, // 1 day
            weekly: 7 * 24 * 60 * 60 * 1000, // 1 week
            monthly: 30 * 24 * 60 * 60 * 1000 // 1 month
        },
        monitoring: {
            healthCheckInterval: 5 * 60 * 1000, // 5 minutes
            performanceMetricsRetention: 30 * 24 * 60 * 60 * 1000, // 30 days
            errorAlertThreshold: 5 // Alert after 5 consecutive errors
        }
    };
    if (env === 'production') {
        return {
            ...baseConfig,
            cacheTTL: {
                ...baseConfig.cacheTTL,
                realTime: 2 * 60 * 1000, // 2 minutes in production
                hourly: 30 * 60 * 1000 // 30 minutes in production
            },
            monitoring: {
                ...baseConfig.monitoring,
                healthCheckInterval: 2 * 60 * 1000, // 2 minutes in production
                errorAlertThreshold: 3 // Alert after 3 consecutive errors in production
            }
        };
    }
    if (env === 'testing') {
        return {
            ...baseConfig,
            cacheTTL: {
                ...baseConfig.cacheTTL,
                realTime: 1 * 60 * 1000, // 1 minute in testing
                hourly: 5 * 60 * 1000 // 5 minutes in testing
            },
            monitoring: {
                ...baseConfig.monitoring,
                healthCheckInterval: 1 * 60 * 1000, // 1 minute in testing
                performanceMetricsRetention: 24 * 60 * 60 * 1000 // 1 day in testing
            }
        };
    }
    return baseConfig;
}
//# sourceMappingURL=dataSourceConfig.js.map