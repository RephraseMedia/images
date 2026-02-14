/**
 * @jest-environment node
 */
import { POST } from '@/app/api/remove-background/route';
import { NextRequest } from 'next/server';
import { resetRateLimit } from '@/lib/rateLimit';

jest.mock('@/lib/replicate', () => ({
  removeBackground: jest.fn().mockResolvedValue('https://replicate.com/output.png'),
  MODELS: { removeBackground: 'test-model' },
}));

jest.mock('@/lib/imageUtils', () => ({
  ...jest.requireActual('@/lib/imageUtils'),
  urlToBase64: jest.fn().mockResolvedValue('data:image/png;base64,nobg'),
}));

function createRequest(body: object): NextRequest {
  return new NextRequest('http://localhost:3000/api/remove-background', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('POST /api/remove-background', () => {
  beforeEach(() => {
    resetRateLimit();
  });

  it('returns image with background removed', async () => {
    const response = await POST(createRequest({
      image: 'data:image/png;base64,iVBORw0KGgo=',
    }));
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.image).toBe('data:image/png;base64,nobg');
  });

  it('returns 400 for missing image', async () => {
    const response = await POST(createRequest({}));
    expect(response.status).toBe(400);
  });
});
