/**
 * Error handling utilities for production
 */

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string,
    public isOperational: boolean = true
  ) {
    super(message);
    this.name = "AppError";
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public fields?: Record<string, string>) {
    super(message, 400, "VALIDATION_ERROR");
    this.name = "ValidationError";
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = "Resource") {
    super(`${resource} not found`, 404, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(message, 401, "UNAUTHORIZED");
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden") {
    super(message, 403, "FORBIDDEN");
    this.name = "ForbiddenError";
  }
}

/**
 * Sanitize error message for production
 * Removes sensitive information and provides user-friendly messages
 */
export function sanitizeError(error: unknown): {
  message: string;
  statusCode: number;
  code?: string;
} {
  // Handle known error types
  if (error instanceof AppError) {
    return {
      message: error.message,
      statusCode: error.statusCode,
      code: error.code,
    };
  }

  // Handle Prisma errors
  if (error && typeof error === "object" && "code" in error) {
    const prismaError = error as { code: string; meta?: any };
    switch (prismaError.code) {
      case "P2002":
        return {
          message: "This record already exists",
          statusCode: 409,
          code: "DUPLICATE_ENTRY",
        };
      case "P2025":
        return {
          message: "Record not found",
          statusCode: 404,
          code: "NOT_FOUND",
        };
      case "P2003":
        return {
          message: "Invalid reference",
          statusCode: 400,
          code: "INVALID_REFERENCE",
        };
      default:
        return {
          message: "Database operation failed",
          statusCode: 500,
          code: "DATABASE_ERROR",
        };
    }
  }

  // Handle network/connection errors
  if (
    error instanceof Error &&
    (error.message.includes("ECONNREFUSED") ||
      error.message.includes("ETIMEDOUT") ||
      error.message.includes("ENOTFOUND"))
  ) {
    return {
      message: "Service temporarily unavailable. Please try again later.",
      statusCode: 503,
      code: "SERVICE_UNAVAILABLE",
    };
  }

  // Handle generic errors
  if (error instanceof Error) {
    // In production, don't expose internal error messages
    if (process.env.NODE_ENV === "production") {
      return {
        message: "An unexpected error occurred. Please try again later.",
        statusCode: 500,
        code: "INTERNAL_ERROR",
      };
    }
    // In development, show the actual error
    return {
      message: error.message,
      statusCode: 500,
      code: "INTERNAL_ERROR",
    };
  }

  // Unknown error type
  return {
    message: "An unexpected error occurred. Please try again later.",
    statusCode: 500,
    code: "UNKNOWN_ERROR",
  };
}

/**
 * Log error for monitoring (in production, send to error tracking service)
 */
export function logError(error: unknown, context?: Record<string, any>) {
  const sanitized = sanitizeError(error);
  
  const errorLog = {
    message: sanitized.message,
    code: sanitized.code,
    statusCode: sanitized.statusCode,
    context,
    timestamp: new Date().toISOString(),
    // Include original error in development
    ...(process.env.NODE_ENV === "development" && {
      originalError: error instanceof Error ? error.stack : String(error),
    }),
  };

  console.error("Application error:", errorLog);

  // TODO: In production, send to error tracking service
  // Example: Sentry.captureException(error, { extra: context });
}

