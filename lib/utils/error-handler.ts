import { toast } from 'react-hot-toast';

// Error types
export enum ErrorType {
  NETWORK = 'NETWORK',
  AUTH = 'AUTH',
  VALIDATION = 'VALIDATION',
  API = 'API',
  DATABASE = 'DATABASE',
  UNKNOWN = 'UNKNOWN',
}

// Error interface
export interface AppError {
  type: ErrorType;
  message: string;
  code?: string;
  details?: any;
  timestamp: Date;
}

// Error handler class
export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorLog: AppError[] = [];

  private constructor() {}

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  // Handle error
  public handleError(error: any): AppError {
    const appError = this.normalizeError(error);
    this.logError(appError);
    this.showErrorNotification(appError);
    return appError;
  }

  // Normalize error
  private normalizeError(error: any): AppError {
    const appError: AppError = {
      type: ErrorType.UNKNOWN,
      message: 'An unexpected error occurred',
      timestamp: new Date(),
    };

    if (error instanceof Error) {
      appError.message = error.message;

      // Determine error type
      if (error.message.includes('network') || error.message.includes('connection')) {
        appError.type = ErrorType.NETWORK;
      } else if (error.message.includes('auth') || error.message.includes('unauthorized')) {
        appError.type = ErrorType.AUTH;
      } else if (error.message.includes('validation') || error.message.includes('invalid')) {
        appError.type = ErrorType.VALIDATION;
      } else if (error.message.includes('api') || error.message.includes('endpoint')) {
        appError.type = ErrorType.API;
      } else if (error.message.includes('database') || error.message.includes('db')) {
        appError.type = ErrorType.DATABASE;
      }
    }

    // Add additional details if available
    if (error.details) {
      appError.details = error.details;
    }
    if (error.code) {
      appError.code = error.code;
    }

    return appError;
  }

  // Log error
  private logError(error: AppError): void {
    this.errorLog.push(error);
    console.error('Error:', {
      type: error.type,
      message: error.message,
      code: error.code,
      details: error.details,
      timestamp: error.timestamp,
    });
  }

  // Show error notification
  private showErrorNotification(error: AppError): void {
    const errorMessage = this.getErrorMessage(error);
    toast.error(errorMessage);
  }

  // Get user-friendly error message
  private getErrorMessage(error: AppError): string {
    switch (error.type) {
      case ErrorType.NETWORK:
        return 'Network error. Please check your connection and try again.';
      case ErrorType.AUTH:
        return 'Authentication error. Please log in again.';
      case ErrorType.VALIDATION:
        return 'Validation error. Please check your input.';
      case ErrorType.API:
        return 'API error. Please try again later.';
      case ErrorType.DATABASE:
        return 'Database error. Please try again later.';
      default:
        return error.message || 'An unexpected error occurred.';
    }
  }

  // Get error log
  public getErrorLog(): AppError[] {
    return this.errorLog;
  }

  // Clear error log
  public clearErrorLog(): void {
    this.errorLog = [];
  }
}

// Export singleton instance
export const errorHandler = ErrorHandler.getInstance();
