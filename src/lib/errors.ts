import { NextResponse } from 'next/server';

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class RateLimitError extends AppError {
  constructor(retryAfterMs?: number) {
    const message = retryAfterMs
      ? `Rate limit exceeded. Try again in ${Math.ceil(retryAfterMs / 1000)} seconds.`
      : 'Rate limit exceeded. Please try again later.';
    super(message, 429, 'RATE_LIMIT_EXCEEDED');
    this.name = 'RateLimitError';
  }
}

export class ReplicateError extends AppError {
  constructor(message: string) {
    super(message, 502, 'REPLICATE_ERROR');
    this.name = 'ReplicateError';
  }
}

export function errorResponse(error: unknown): NextResponse {
  if (error instanceof AppError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      {
        status: error.statusCode,
        headers: securityHeaders(),
      }
    );
  }

  console.error('Unexpected error:', error);
  return NextResponse.json(
    { error: 'Internal server error', code: 'INTERNAL_ERROR' },
    {
      status: 500,
      headers: securityHeaders(),
    }
  );
}

export function successResponse(data: object, status: number = 200): NextResponse {
  return NextResponse.json(data, {
    status,
    headers: securityHeaders(),
  });
}

function securityHeaders(): Record<string, string> {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  };
}
