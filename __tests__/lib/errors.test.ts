/**
 * @jest-environment node
 */
import {
  ValidationError,
  RateLimitError,
  ReplicateError,
  errorResponse,
  successResponse,
} from '@/lib/errors';

describe('Error classes', () => {
  it('creates ValidationError with 400 status', () => {
    const err = new ValidationError('bad input');
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe('VALIDATION_ERROR');
    expect(err.message).toBe('bad input');
  });

  it('creates RateLimitError with 429 status', () => {
    const err = new RateLimitError(5000);
    expect(err.statusCode).toBe(429);
    expect(err.code).toBe('RATE_LIMIT_EXCEEDED');
    expect(err.message).toContain('5 seconds');
  });

  it('creates ReplicateError with 502 status', () => {
    const err = new ReplicateError('model failed');
    expect(err.statusCode).toBe(502);
    expect(err.code).toBe('REPLICATE_ERROR');
  });
});

describe('errorResponse', () => {
  it('handles AppError instances', async () => {
    const res = errorResponse(new ValidationError('test'));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('test');
    expect(body.code).toBe('VALIDATION_ERROR');
  });

  it('handles unknown errors', async () => {
    const res = errorResponse(new Error('unexpected'));
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe('Internal server error');
  });

  it('includes security headers', () => {
    const res = errorResponse(new ValidationError('test'));
    expect(res.headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(res.headers.get('X-Frame-Options')).toBe('DENY');
  });
});

describe('successResponse', () => {
  it('returns JSON with security headers', async () => {
    const res = successResponse({ data: 'ok' });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data).toBe('ok');
    expect(res.headers.get('X-Content-Type-Options')).toBe('nosniff');
  });

  it('accepts custom status codes', () => {
    const res = successResponse({ data: 'created' }, 201);
    expect(res.status).toBe(201);
  });
});
