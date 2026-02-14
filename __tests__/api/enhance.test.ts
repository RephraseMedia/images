/**
 * @jest-environment node
 */
import { POST } from '@/app/api/enhance/route';
import { NextRequest } from 'next/server';
import { resetRateLimit } from '@/lib/rateLimit';

jest.mock('@/lib/replicate', () => ({
  enhance: jest.fn().mockResolvedValue('https://replicate.com/output.png'),
  MODELS: { enhance: 'test-model' },
}));

jest.mock('@/lib/imageUtils', () => ({
  ...jest.requireActual('@/lib/imageUtils'),
  urlToBase64: jest.fn().mockResolvedValue('data:image/png;base64,resultimage'),
}));

function createRequest(body: object): NextRequest {
  return new NextRequest('http://localhost:3000/api/enhance', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('POST /api/enhance', () => {
  beforeEach(() => {
    resetRateLimit();
  });

  it('returns enhanced image on success', async () => {
    const response = await POST(createRequest({
      image: 'data:image/png;base64,iVBORw0KGgo=',
    }));
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.image).toBe('data:image/png;base64,resultimage');
  });

  it('returns 400 for missing image', async () => {
    const response = await POST(createRequest({}));
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toContain('required');
  });

  it('returns 400 for invalid base64', async () => {
    const response = await POST(createRequest({ image: 'data:image/png;base64,!!!invalid' }));
    expect(response.status).toBe(400);
  });

  it('returns 429 when rate limited', async () => {
    for (let i = 0; i < 10; i++) {
      await POST(createRequest({ image: 'data:image/png;base64,iVBORw0KGgo=' }));
    }
    const response = await POST(createRequest({ image: 'data:image/png;base64,iVBORw0KGgo=' }));
    expect(response.status).toBe(429);
  });

  it('includes security headers', async () => {
    const response = await POST(createRequest({
      image: 'data:image/png;base64,iVBORw0KGgo=',
    }));
    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(response.headers.get('X-Frame-Options')).toBe('DENY');
  });
});
