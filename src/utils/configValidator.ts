import { getDataSourceConfig } from '../config/dataSourceConfig';

export class ConfigValidator {
  private static readonly REQUIRED_SOURCES = [
    'stats-can',
    'cmhc',
    'bank-of-canada'
  ];

  private static readonly OPTIONAL_SOURCES = [
    'ontario-energy-board',
    'toronto-open-data',
    'cra',
    'esdc'
  ];

  static validateConfiguration(): { isValid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    for (const source of this.REQUIRED_SOURCES) {
      const config = getDataSourceConfig(source);
      if (!config || !config.apiKey) {
        errors.push(`Missing required API key for ${source}`);
      }
    }

    for (const source of this.OPTIONAL_SOURCES) {
      const config = getDataSourceConfig(source);
      if (!config || !config.apiKey) {
        warnings.push(`Optional API key not configured for ${source} - some features will be limited`);
      }
    }

    if (!process.env['NODE_ENV']) {
      warnings.push('NODE_ENV not set - defaulting to development mode');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  static getConfigurationSummary(): {
    required: string[];
    optional: string[];
    missing: string[];
    configured: string[];
  } {
    const required: string[] = [];
    const optional: string[] = [];
    const missing: string[] = [];
    const configured: string[] = [];

    for (const source of this.REQUIRED_SOURCES) {
      const config = getDataSourceConfig(source);
      if (config && config.apiKey) {
        required.push(source);
        configured.push(source);
      } else {
        missing.push(source);
      }
    }

    for (const source of this.OPTIONAL_SOURCES) {
      const config = getDataSourceConfig(source);
      if (config && config.apiKey) {
        optional.push(source);
        configured.push(source);
      }
    }

    return { required, optional, missing, configured };
  }

  static validateDataSourceConfig(sourceName: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const config = getDataSourceConfig(sourceName);

    if (!config) {
      errors.push(`Configuration not found for ${sourceName}`);
      return { isValid: false, errors };
    }

    if (!config.apiKey) {
      errors.push(`API key missing for ${sourceName}`);
    }

    if (config.baseUrl && !config.baseUrl.startsWith('http')) {
      errors.push(`Invalid base URL for ${sourceName}: ${config.baseUrl}`);
    }

    if (config.rateLimit && config.rateLimit['requestsPerMinute'] <= 0) {
      errors.push(`Invalid rate limit for ${sourceName}: requests per minute must be positive`);
    }

    if (config.timeout && config.timeout <= 0) {
      errors.push(`Invalid timeout for ${sourceName}: timeout must be positive`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static getHealthCheckConfig(): {
    enabled: boolean;
    interval: number;
    timeout: number;
  } {
    return {
      enabled: process.env['HEALTH_CHECK_ENABLED'] !== 'false',
      interval: parseInt(process.env['HEALTH_CHECK_INTERVAL'] || '300000'), // 5 minutes default
      timeout: parseInt(process.env['HEALTH_CHECK_TIMEOUT'] || '30000')   // 30 seconds default
    };
  }
}