import { checkRateLimit, resetRateLimit } from '@/lib/rateLimit';
import { RATE_LIMIT_MAX_REQUESTS } from '@/lib/constants';

describe('rateLimit', () => {
  beforeEach(() => {
    resetRateLimit();
  });

  it('allows requests within the limit', () => {
    for (let i = 0; i < RATE_LIMIT_MAX_REQUESTS; i++) {
      const result = checkRateLimit('test-ip');
      expect(result.allowed).toBe(true);
    }
  });

  it('blocks requests exceeding the limit', () => {
    for (let i = 0; i < RATE_LIMIT_MAX_REQUESTS; i++) {
      checkRateLimit('test-ip');
    }
    const result = checkRateLimit('test-ip');
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
    expect(result.retryAfterMs).toBeDefined();
  });

  it('tracks different keys separately', () => {
    for (let i = 0; i < RATE_LIMIT_MAX_REQUESTS; i++) {
      checkRateLimit('ip-1');
    }
    const result = checkRateLimit('ip-2');
    expect(result.allowed).toBe(true);
  });

  it('reports remaining requests', () => {
    const result = checkRateLimit('test-ip');
    expect(result.remaining).toBe(RATE_LIMIT_MAX_REQUESTS - 1);
  });

  it('resets rate limit for a specific key', () => {
    for (let i = 0; i < RATE_LIMIT_MAX_REQUESTS; i++) {
      checkRateLimit('test-ip');
    }
    resetRateLimit('test-ip');
    const result = checkRateLimit('test-ip');
    expect(result.allowed).toBe(true);
  });
});
