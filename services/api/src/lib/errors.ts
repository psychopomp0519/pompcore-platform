/**
 * @file errors.ts
 * @description Typed API error classes with HTTP status codes.
 * @module @pompcore/api/lib/errors
 */

export class ApiError extends Error {
  readonly statusCode: number;
  readonly code?: string;

  constructor(statusCode: number, message: string, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = '인증이 필요합니다.') {
    super(401, message, 'UNAUTHORIZED');
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = '접근 권한이 없습니다.') {
    super(403, message, 'FORBIDDEN');
  }
}

export class NotFoundError extends ApiError {
  constructor(message = '요청한 리소스를 찾을 수 없습니다.') {
    super(404, message, 'NOT_FOUND');
  }
}

export class ValidationError extends ApiError {
  constructor(message: string) {
    super(400, message, 'VALIDATION_ERROR');
  }
}

export class RateLimitError extends ApiError {
  constructor(message = '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.') {
    super(429, message, 'RATE_LIMIT_EXCEEDED');
  }
}

export class ConflictError extends ApiError {
  constructor(message = '이미 존재하는 데이터입니다.') {
    super(409, message, 'CONFLICT');
  }
}
