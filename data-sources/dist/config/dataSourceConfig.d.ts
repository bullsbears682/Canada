import { DataSourceConfig, UpdateFrequency } from '../types';
/**
 * 🇨🇦 Data Source Configuration
 *
 * Centralized configuration for all Canadian data sources used in the
 * Cost of Living Analyzer application.
 */
export declare const DATA_SOURCE_CONFIGS: Record<string, DataSourceConfig>;
/**
 * Get configuration for a specific data source
 */
export declare function getDataSourceConfig(sourceName: string): DataSourceConfig | null;
/**
 * Get all data source names
 */
export declare function getAllDataSourceNames(): string[];
/**
 * Get high priority data sources
 */
export declare function getHighPriorityDataSources(): string[];
/**
 * Get data sources by update frequency
 */
export declare function getDataSourcesByFrequency(frequency: UpdateFrequency): string[];
/**
 * Validate data source configuration
 */
export declare function validateDataSourceConfig(config: DataSourceConfig): string[];
/**
 * Get environment-specific configuration
 */
export declare function getEnvironmentConfig(): Record<string, any>;
//# sourceMappingURL=dataSourceConfig.d.ts.map