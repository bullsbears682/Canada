/**
 * Enhanced error handling utility
 * Provides standardized error handling, logging, and error transformation
 */
export class ErrorHandler {
  private static readonly ERROR_TYPES = {
    NETWORK: 'NETWORK_ERROR',
    VALIDATION: 'VALIDATION_ERROR',
    AUTHENTICATION: 'AUTHENTICATION_ERROR',
    RATE_LIMIT: 'RATE_LIMIT_ERROR',
    DATA_SOURCE: 'DATA_SOURCE_ERROR',
    TRANSFORMATION: 'TRANSFORMATION_ERROR',
    UNKNOWN: 'UNKNOWN_ERROR'
  } as const;

  /**
   * Standardize error objects
   */
  static standardizeError(error: unknown, context?: string): {
    type: typeof ErrorHandler.ERROR_TYPES[keyof typeof ErrorHandler.ERROR_TYPES];
    message: string;
    context: string | undefined;
    timestamp: Date;
    originalError?: unknown;
  } {
    const errorObj: { type: typeof ErrorHandler.ERROR_TYPES[keyof typeof ErrorHandler.ERROR_TYPES]; message: string; context: string | undefined; timestamp: Date; originalError?: unknown; } = {
      type: this.ERROR_TYPES.UNKNOWN,
      message: 'An unknown error occurred',
      context,
      timestamp: new Date(),
      originalError: error
    };

    if (error instanceof Error) {
      errorObj.message = error.message;
      
      // Categorize error types
      if (error.message.includes('fetch') || error.message.includes('network')) {
        errorObj.type = "NETWORK_ERROR";
      } else if (error.message.includes('validation') || error.message.includes('invalid')) {
        errorObj.type = "VALIDATION_ERROR";
      } else if (error.message.includes('unauthorized') || error.message.includes('forbidden')) {
        errorObj.type = "AUTHENTICATION_ERROR";
      } else if (error.message.includes('rate limit') || error.message.includes('too many requests')) {
        errorObj.type = "RATE_LIMIT_ERROR";
      } else if (error.message.includes('data source') || error.message.includes('API')) {
        errorObj.type = "DATA_SOURCE_ERROR";
      }
    } else if (typeof error === 'string') {
      errorObj.message = error;
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorObj.message = (error as any).message;
    }

    return errorObj;
  }

  /**
   * Handle errors with appropriate logging and transformation
   */
  static handleError(error: unknown, context?: string, severity: 'low' | 'medium' | 'high' = 'medium'): never {
    const standardizedError = this.standardizeError(error, context);
    
    // Log based on severity
    switch (severity) {
      case 'high':
        console.error(`🚨 CRITICAL ERROR [${standardizedError.type}]:`, standardizedError.message);
        if (context) console.error(`Context: ${context}`);
        break;
      case 'medium':
        console.warn(`⚠️  ERROR [${standardizedError.type}]:`, standardizedError.message);
        if (context) console.warn(`Context: ${context}`);
        break;
      case 'low':
        console.log(`ℹ️  INFO [${standardizedError.type}]:`, standardizedError.message);
        if (context) console.log(`Context: ${context}`);
        break;
    }

    // Throw standardized error
    throw new Error(JSON.stringify(standardizedError));
  }

  /**
   * Handle errors gracefully without throwing
   */
  static handleErrorGracefully(error: unknown, context?: string): {
    success: false;
    error: ReturnType<typeof ErrorHandler.standardizeError>;
  } {
    const standardizedError = this.standardizeError(error, context);
    
    console.warn(`⚠️  Graceful error handling [${standardizedError.type}]:`, standardizedError.message);
    if (context) console.warn(`Context: ${context}`);

    return {
      success: false,
      error: standardizedError
    };
  }

  /**
   * Retry operation with exponential backoff
   */
  static async retryWithBackoff<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: unknown;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        if (attempt === maxRetries) {
          break;
        }

        const delay = baseDelay * Math.pow(2, attempt - 1);
        console.log(`🔄 Retry attempt ${attempt}/${maxRetries} in ${delay}ms...`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }

  /**
   * Validate error response from API
   */
  static validateApiErrorResponse(response: Response): boolean {
    if (!response.ok) {
      const errorMessage = `API request failed: ${response.status} ${response.statusText}`;
      
      if (response.status === 401) {
        throw new Error(`Authentication failed: ${errorMessage}`);
      } else if (response.status === 403) {
        throw new Error(`Access forbidden: ${errorMessage}`);
      } else if (response.status === 429) {
        throw new Error(`Rate limit exceeded: ${errorMessage}`);
      } else if (response.status >= 500) {
        throw new Error(`Server error: ${errorMessage}`);
      } else {
        throw new Error(errorMessage);
      }
    }
    
    return true;
  }

  /**
   * Get user-friendly error message
   */
  static getUserFriendlyMessage(error: unknown): string {
    const standardizedError = this.standardizeError(error);
    
    switch (standardizedError.type) {
      case this.ERROR_TYPES.NETWORK:
        return 'Unable to connect to the service. Please check your internet connection and try again.';
      case this.ERROR_TYPES.AUTHENTICATION:
        return 'Authentication failed. Please check your API keys and try again.';
      case this.ERROR_TYPES.RATE_LIMIT:
        return 'Too many requests. Please wait a moment and try again.';
      case this.ERROR_TYPES.VALIDATION:
        return 'Invalid data provided. Please check your input and try again.';
      case this.ERROR_TYPES.DATA_SOURCE:
        return 'The data service is currently unavailable. Please try again later.';
      default:
        return 'An unexpected error occurred. Please try again or contact support if the problem persists.';
    }
  }

  /**
   * Log error with structured format
   */
  static logError(error: unknown, context?: string, additionalData?: Record<string, any>): void {
    const standardizedError = this.standardizeError(error, context);
    
    const logData = {
      ...standardizedError,
      ...additionalData,
      stack: error instanceof Error ? error.stack : undefined
    };

    console.error('📝 Error Log:', JSON.stringify(logData, null, 2));
  }
}
