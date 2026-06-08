import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationError } from 'express-validator';

export function validate(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e: ValidationError) => {
      if ('path' in e) return `${e.path}: ${e.msg}`;
      return e.msg;
    });
    return next({
      message: messages.join(', '),
      statusCode: 422,
      code: 'VALIDATION_ERROR',
    });
  }
  next();
}
