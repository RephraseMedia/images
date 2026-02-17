import { NextRequest } from 'next/server';
import { validatePresentationTopic, validateSlideCount, validatePresentationStyle } from '@/lib/validation';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import {
  errorResponse,
  successResponse,
  ValidationError,
  RateLimitError,
} from '@/lib/errors';
import { generatePresentationContent } from '@/lib/anthropic';
import type { PresentationStyle } from '@/types/presentation';

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateLimitResult = checkRateLimit(ip);
    if (!rateLimitResult.allowed) {
      throw new RateLimitError(rateLimitResult.retryAfterMs);
    }

    const body = await request.json();
    const { topic, slideCount = 8, style = 'professional' } = body;

    // Validate topic
    const topicValidation = validatePresentationTopic(topic);
    if (!topicValidation.valid) {
      throw new ValidationError(topicValidation.error!);
    }

    // Validate slide count
    const slideCountValidation = validateSlideCount(slideCount);
    if (!slideCountValidation.valid) {
      throw new ValidationError(slideCountValidation.error!);
    }

    // Validate style
    const styleValidation = validatePresentationStyle(style);
    if (!styleValidation.valid) {
      throw new ValidationError(styleValidation.error!);
    }

    const presentation = await generatePresentationContent(
      topic.trim(),
      slideCount,
      style as PresentationStyle
    );

    return successResponse({ presentation });
  } catch (error) {
    return errorResponse(error);
  }
}
