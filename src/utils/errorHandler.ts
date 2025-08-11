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

  static standardizeError(error: unknown, context?: string): {
    type: string;
    message: string;
    context?: string;
    timestamp: Date;
    originalError?: unknown;
  } {
    const errorObj = {
      type: this.ERROR_TYPES.UNKNOWN,
      message: 'An unknown error occurred',
      context: context,
      timestamp: new Date(),
      originalError: error
    };

    if (error instanceof Error) {
      errorObj.message = error.message;
      // Categorize error types based on message content
      if (error.message.includes('fetch') || error.message.includes('network')) {
        errorObj.type = this.ERROR_TYPES.NETWORK;
      } else if (error.message.includes('validation') || error.message.includes('invalid')) {
        errorObj.type = this.ERROR_TYPES.VALIDATION;
      } else if (error.message.includes('auth') || error.message.includes('unauthorized')) {
        errorObj.type = this.ERROR_TYPES.AUTHENTICATION;
      } else if (error.message.includes('rate limit') || error.message.includes('too many requests')) {
        errorObj.type = this.ERROR_TYPES.RATE_LIMIT;
      } else if (error.message.includes('data source') || error.message.includes('API')) {
        errorObj.type = this.ERROR_TYPES.DATA_SOURCE;
      } else if (error.message.includes('transform') || error.message.includes('parse')) {
        errorObj.type = this.ERROR_TYPES.TRANSFORMATION;
      }
    } else if (typeof error === 'string') {
      errorObj.message = error;
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorObj.message = (error as any).message;
    }

    return errorObj;
  }
}