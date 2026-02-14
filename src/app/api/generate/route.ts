import { NextRequest } from 'next/server';
import { validateGeneratePrompt, validateNumberOfImages } from '@/lib/validation';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import {
  errorResponse,
  successResponse,
  ValidationError,
  RateLimitError,
} from '@/lib/errors';
import { generateImage } from '@/lib/replicate';
import { urlToBase64 } from '@/lib/imageUtils';
import { DEFAULT_NEGATIVE_PROMPT } from '@/lib/constants';
import {
  STYLE_OPTIONS,
  ASPECT_RATIO_OPTIONS,
  type ImageStyle,
  type AspectRatio,
} from '@/types/generator';

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateLimitResult = checkRateLimit(ip);
    if (!rateLimitResult.allowed) {
      throw new RateLimitError(rateLimitResult.retryAfterMs);
    }

    const body = await request.json();
    const {
      prompt,
      style = 'none',
      aspectRatio = '1:1',
      numberOfImages = 1,
    } = body;

    // Validate prompt
    const promptValidation = validateGeneratePrompt(prompt);
    if (!promptValidation.valid) {
      throw new ValidationError(promptValidation.error!);
    }

    // Validate number of images
    const numValidation = validateNumberOfImages(numberOfImages);
    if (!numValidation.valid) {
      throw new ValidationError(numValidation.error!);
    }

    // Validate style
    const styleOption = STYLE_OPTIONS.find((s) => s.id === (style as ImageStyle));
    if (!styleOption) {
      throw new ValidationError('Invalid style selection');
    }

    // Validate aspect ratio
    const ratioOption = ASPECT_RATIO_OPTIONS.find((r) => r.id === (aspectRatio as AspectRatio));
    if (!ratioOption) {
      throw new ValidationError('Invalid aspect ratio');
    }

    // Build final prompt with style suffix
    const finalPrompt = prompt.trim() + styleOption.promptSuffix;

    // Call Replicate
    const resultUrls = await generateImage(
      finalPrompt,
      DEFAULT_NEGATIVE_PROMPT,
      ratioOption.width,
      ratioOption.height,
      numberOfImages
    );

    // Convert all result URLs to base64
    const images = await Promise.all(
      resultUrls.map((url) => urlToBase64(url))
    );

    return successResponse({ images });
  } catch (error) {
    return errorResponse(error);
  }
}
