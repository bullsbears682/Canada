/**
 * Configuration validation utility
 * Ensures all required configuration is present before system initialization
 */
export declare class ConfigValidator {
    private static readonly REQUIRED_SOURCES;
    private static readonly OPTIONAL_SOURCES;
    /**
     * Validate all required configuration is present
     */
    static validateConfiguration(): {
        isValid: boolean;
        errors: string[];
        warnings: string[];
    };
    /**
     * Get configuration summary
     */
    static getConfigurationSummary(): {
        required: string[];
        optional: string[];
        missing: string[];
    };
    /**
     * Validate specific data source configuration
     */
    static validateDataSourceConfig(sourceName: string): {
        isValid: boolean;
        errors: string[];
    };
    /**
     * Get health check configuration
     */
    static getHealthCheckConfig(): {
        enabled: boolean;
        interval: number;
        timeout: number;
    };
}
//# sourceMappingURL=configValidator.d.ts.map