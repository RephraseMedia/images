/**
 * @jest-environment node
 */
import { POST } from '@/app/api/remove-object/route';
import { NextRequest } from 'next/server';
import { resetRateLimit } from '@/lib/rateLimit';

jest.mock('@/lib/replicate', () => ({
  inpaint: jest.fn().mockResolvedValue('https://replicate.com/output.png'),
  MODELS: { inpainting: 'test-model' },
}));

jest.mock('@/lib/imageUtils', () => ({
  ...jest.requireActual('@/lib/imageUtils'),
  urlToBase64: jest.fn().mockResolvedValue('data:image/png;base64,removed'),
}));

function createRequest(body: object): NextRequest {
  return new NextRequest('http://localhost:3000/api/remove-object', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('POST /api/remove-object', () => {
  beforeEach(() => {
    resetRateLimit();
  });

  it('returns image with object removed', async () => {
    const response = await POST(createRequest({
      image: 'data:image/png;base64,iVBORw0KGgo=',
      mask: 'data:image/png;base64,iVBORw0KGgo=',
    }));
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.image).toBe('data:image/png;base64,removed');
  });

  it('returns 400 for missing mask', async () => {
    const response = await POST(createRequest({
      image: 'data:image/png;base64,iVBORw0KGgo=',
    }));
    expect(response.status).toBe(400);
  });

  it('returns 400 for missing image', async () => {
    const response = await POST(createRequest({
      mask: 'data:image/png;base64,iVBORw0KGgo=',
    }));
    expect(response.status).toBe(400);
  });
});
