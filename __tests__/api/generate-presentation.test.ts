/**
 * @jest-environment node
 */
import { POST } from '@/app/api/generate-presentation/route';
import { NextRequest } from 'next/server';
import { resetRateLimit } from '@/lib/rateLimit';

jest.mock('@/lib/anthropic', () => ({
  generatePresentationContent: jest.fn().mockResolvedValue({
    title: 'Test Presentation',
    subtitle: 'A test subtitle',
    slides: [
      {
        slideNumber: 1,
        title: 'Welcome',
        bullets: ['Introduction'],
        speakerNotes: 'Welcome notes',
        layout: 'title',
      },
    ],
  }),
}));

import { generatePresentationContent } from '@/lib/anthropic';
const mockGeneratePresentation = jest.mocked(generatePresentationContent);

function createRequest(body: object): NextRequest {
  return new NextRequest('http://localhost:3000/api/generate-presentation', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('POST /api/generate-presentation', () => {
  beforeEach(() => {
    resetRateLimit();
    mockGeneratePresentation.mockResolvedValue({
      title: 'Test Presentation',
      subtitle: 'A test subtitle',
      slides: [
        {
          slideNumber: 1,
          title: 'Welcome',
          bullets: ['Introduction'],
          speakerNotes: 'Welcome notes',
          layout: 'title',
        },
      ],
    });
  });

  it('returns presentation on success', async () => {
    const response = await POST(createRequest({
      topic: 'Machine Learning basics',
      slideCount: 8,
      style: 'professional',
    }));
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.presentation).toBeDefined();
    expect(body.presentation.title).toBe('Test Presentation');
  });

  it('uses default values for optional fields', async () => {
    const response = await POST(createRequest({
      topic: 'AI Ethics',
    }));
    expect(response.status).toBe(200);
    expect(mockGeneratePresentation).toHaveBeenCalledWith('AI Ethics', 8, 'professional');
  });

  it('returns 400 for missing topic', async () => {
    const response = await POST(createRequest({}));
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toContain('required');
  });

  it('returns 400 for empty topic', async () => {
    const response = await POST(createRequest({ topic: '   ' }));
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toContain('empty');
  });

  it('returns 400 for topic exceeding max length', async () => {
    const response = await POST(createRequest({ topic: 'a'.repeat(501) }));
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toContain('500');
  });

  it('returns 400 for invalid style', async () => {
    const response = await POST(createRequest({
      topic: 'Test topic',
      style: 'invalid-style',
    }));
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toContain('Invalid style');
  });

  it('returns 400 for invalid slide count', async () => {
    const response = await POST(createRequest({
      topic: 'Test topic',
      slideCount: 20,
    }));
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toContain('between');
  });

  it('returns 429 when rate limited', async () => {
    for (let i = 0; i < 10; i++) {
      await POST(createRequest({ topic: 'Test topic' }));
    }
    const response = await POST(createRequest({ topic: 'Test topic' }));
    expect(response.status).toBe(429);
  });

  it('includes security headers', async () => {
    const response = await POST(createRequest({
      topic: 'Test topic',
    }));
    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(response.headers.get('X-Frame-Options')).toBe('DENY');
  });

  it('returns 502 when Anthropic fails', async () => {
    const { AnthropicError } = await import('@/lib/errors');
    mockGeneratePresentation.mockRejectedValue(new AnthropicError('API error'));

    const response = await POST(createRequest({ topic: 'Test topic' }));
    expect(response.status).toBe(502);
  });
});
