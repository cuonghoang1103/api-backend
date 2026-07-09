import { Request, Response, NextFunction } from 'express';
import { captureException } from '../services/sentry.service.js';
import { logger } from '../utils/logger.js';

/**
 * Wrap an async route handler so a rejected promise is forwarded to the
 * Express error handler via next(err) instead of becoming a process-level
 * `unhandledRejection`. Adopt incrementally on new/edited handlers:
 *   router.get('/x', asyncHandler(async (req, res) => { ... }))
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
  });
}

export function errorHandler(
  err: Error & { statusCode?: number; code?: string; name?: string; data?: Record<string, unknown> },
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  logger.error('Express error handler', {
 error: err.message,
 stack: err.stack,
 name: err.name,
 code: err.code,
 path: req.path,
 method: req.method,
 });

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Map well-known Prisma errors (code `Pxxxx`) to a proper 4xx with a
  // safe message, so an uncaught Prisma error surfaces as e.g. 409/404
  // instead of a raw 500 that leaks table/column/query internals.
  if (!err.statusCode && typeof err.code === 'string' && /^P\d{4}$/.test(err.code)) {
    if (err.code === 'P2002') { statusCode = 409; message = 'Giá trị đã tồn tại'; }
    else if (err.code === 'P2025') { statusCode = 404; message = 'Không tìm thấy dữ liệu'; }
    else { statusCode = 400; message = 'Yêu cầu không hợp lệ'; }
  }

  // SECURITY: never leak internal error details to clients on 5xx.
  // Return a generic message; the real one is logged above + captured
  // by Sentry below. 4xx (AppError) messages are intentional & safe.
  if (statusCode >= 500) {
    message = 'Internal Server Error';
  }

  // Report to Sentry — but only for 5xx errors. Client errors (4xx)
  // are not bugs and would just spam the dashboard.
  if (statusCode >= 500) {
    captureException(err, {
      url: req.originalUrl,
      method: req.method,
      statusCode,
      code: err.code,
    });
  }

  res.status(statusCode).json({
    success: false,
    message,
    // Always include `code` so the frontend can branch on well-known
    // application errors (e.g. EMAIL_NOT_VERIFIED → redirect to
    // /verify-otp). In dev we also surface the stack for debugging.
    code: err.code,
    // Optional structured payload (e.g. { email } for unverified
    // users so the client can prefill the OTP page).
    ...(err.data ? { data: err.data } : {}),
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
    }),
  });
}

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string,
    public data?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string, code?: string) {
    super(message, 400, code);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Access denied') {
    super(message, 403, 'FORBIDDEN');
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource already exists') {
    super(message, 409, 'CONFLICT');
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed') {
    super(message, 422, 'VALIDATION_ERROR');
  }
}
