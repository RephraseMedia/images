/**
 * @jest-environment node
 */
import { POST } from '@/app/api/generate/route';
import { NextRequest } from 'next/server';
import { resetRateLimit } from '@/lib/rateLimit';

jest.mock('@/lib/replicate', () => ({
  generateImage: jest.fn().mockResolvedValue(['https://replicate.com/output1.png']),
  MODELS: { generate: 'test-model' },
}));

jest.mock('@/lib/imageUtils', () => ({
  ...jest.requireActual('@/lib/imageUtils'),
  urlToBase64: jest.fn().mockResolvedValue('data:image/png;base64,generatedimage'),
}));

function createRequest(body: object): NextRequest {
  return new NextRequest('http://localhost:3000/api/generate', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('POST /api/generate', () => {
  beforeEach(() => {
    resetRateLimit();
    const { generateImage } = require('@/lib/replicate');
    generateImage.mockResolvedValue(['https://replicate.com/output1.png']);
  });

  it('returns generated images on success', async () => {
    const response = await POST(createRequest({
      prompt: 'a beautiful sunset',
      style: 'none',
      aspectRatio: '1:1',
      numberOfImages: 1,
    }));
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.images).toEqual(['data:image/png;base64,generatedimage']);
  });

  it('uses default values for optional fields', async () => {
    const response = await POST(createRequest({
      prompt: 'a mountain landscape',
    }));
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.images).toBeDefined();
  });

  it('appends style suffix to prompt', async () => {
    const { generateImage } = require('@/lib/replicate');
    await POST(createRequest({
      prompt: 'a cat',
      style: 'anime',
    }));
    expect(generateImage).toHaveBeenCalledWith(
      expect.stringContaining('anime style'),
      expect.any(String),
      expect.any(Number),
      expect.any(Number),
      expect.any(Number),
    );
  });

  it('uses correct dimensions for aspect ratio', async () => {
    const { generateImage } = require('@/lib/replicate');
    await POST(createRequest({
      prompt: 'a landscape',
      aspectRatio: '16:9',
    }));
    expect(generateImage).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      1344,
      768,
      expect.any(Number),
    );
  });

  it('handles multiple images', async () => {
    const { generateImage } = require('@/lib/replicate');
    const { urlToBase64 } = require('@/lib/imageUtils');
    generateImage.mockResolvedValue([
      'https://replicate.com/out1.png',
      'https://replicate.com/out2.png',
      'https://replicate.com/out3.png',
    ]);
    urlToBase64.mockResolvedValue('data:image/png;base64,img');

    const response = await POST(createRequest({
      prompt: 'cats playing',
      numberOfImages: 3,
    }));
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.images).toHaveLength(3);
  });

  it('returns 400 for missing prompt', async () => {
    const response = await POST(createRequest({}));
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toContain('required');
  });

  it('returns 400 for empty prompt', async () => {
    const response = await POST(createRequest({ prompt: '   ' }));
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toContain('empty');
  });

  it('returns 400 for prompt exceeding max length', async () => {
    const response = await POST(createRequest({ prompt: 'a'.repeat(1001) }));
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toContain('1000');
  });

  it('returns 400 for invalid style', async () => {
    const response = await POST(createRequest({
      prompt: 'a cat',
      style: 'invalid-style',
    }));
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toContain('style');
  });

  it('returns 400 for invalid aspect ratio', async () => {
    const response = await POST(createRequest({
      prompt: 'a cat',
      aspectRatio: '7:3',
    }));
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toContain('aspect ratio');
  });

  it('returns 400 for invalid number of images', async () => {
    const response = await POST(createRequest({
      prompt: 'a cat',
      numberOfImages: 5,
    }));
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toContain('between 1 and 4');
  });

  it('returns 400 for zero images', async () => {
    const response = await POST(createRequest({
      prompt: 'a cat',
      numberOfImages: 0,
    }));
    expect(response.status).toBe(400);
  });

  it('returns 400 for non-integer image count', async () => {
    const response = await POST(createRequest({
      prompt: 'a cat',
      numberOfImages: 2.5,
    }));
    expect(response.status).toBe(400);
  });

  it('returns 429 when rate limited', async () => {
    for (let i = 0; i < 10; i++) {
      await POST(createRequest({ prompt: 'a cat' }));
    }
    const response = await POST(createRequest({ prompt: 'a cat' }));
    expect(response.status).toBe(429);
  });

  it('includes security headers', async () => {
    const response = await POST(createRequest({
      prompt: 'a sunset',
    }));
    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(response.headers.get('X-Frame-Options')).toBe('DENY');
  });

  it('returns 502 when replicate fails', async () => {
    const { generateImage } = require('@/lib/replicate');
    generateImage.mockRejectedValue(new Error('Replicate API error'));

    const response = await POST(createRequest({ prompt: 'a cat' }));
    expect(response.status).toBe(500);
  });
});
