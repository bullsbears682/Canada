/**
 * Enhanced error handling utility
 * Provides standardized error handling, logging, and error transformation
 */
export declare class ErrorHandler {
    private static readonly ERROR_TYPES;
    /**
     * Standardize error objects
     */
    static standardizeError(error: unknown, context?: string): {
        type: string;
        message: string;
        context?: string;
        timestamp: Date;
        originalError?: unknown;
    };
    /**
     * Handle errors with appropriate logging and transformation
     */
    static handleError(error: unknown, context?: string, severity?: 'low' | 'medium' | 'high'): never;
    /**
     * Handle errors gracefully without throwing
     */
    static handleErrorGracefully(error: unknown, context?: string): {
        success: false;
        error: ReturnType<typeof ErrorHandler.standardizeError>;
    };
    /**
     * Retry operation with exponential backoff
     */
    static retryWithBackoff<T>(operation: () => Promise<T>, maxRetries?: number, baseDelay?: number): Promise<T>;
    /**
     * Validate error response from API
     */
    static validateApiErrorResponse(response: Response): boolean;
    /**
     * Get user-friendly error message
     */
    static getUserFriendlyMessage(error: unknown): string;
    /**
     * Log error with structured format
     */
    static logError(error: unknown, context?: string, additionalData?: Record<string, any>): void;
}
//# sourceMappingURL=errorHandler.d.ts.map