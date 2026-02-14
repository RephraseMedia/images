import { NextRequest } from 'next/server';
import { validateBase64Image, validatePrompt, validateMask } from '@/lib/validation';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import {
  errorResponse,
  successResponse,
  ValidationError,
  RateLimitError,
} from '@/lib/errors';
import { inpaint } from '@/lib/replicate';
import { urlToBase64, toDataUri } from '@/lib/imageUtils';

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateLimitResult = checkRateLimit(ip);
    if (!rateLimitResult.allowed) {
      throw new RateLimitError(rateLimitResult.retryAfterMs);
    }

    const body = await request.json();
    const { image, mask, prompt } = body;

    // Validate all fields
    const imageValidation = validateBase64Image(image);
    if (!imageValidation.valid) {
      throw new ValidationError(imageValidation.error!);
    }

    const maskValidation = validateMask(mask);
    if (!maskValidation.valid) {
      throw new ValidationError(maskValidation.error!);
    }

    const promptValidation = validatePrompt(prompt);
    if (!promptValidation.valid) {
      throw new ValidationError(promptValidation.error!);
    }

    const imageUri = image.startsWith('data:') ? image : toDataUri(image);
    const maskUri = mask.startsWith('data:') ? mask : toDataUri(mask);

    const resultUrl = await inpaint(imageUri, maskUri, prompt);
    const resultBase64 = await urlToBase64(resultUrl);

    return successResponse({ image: resultBase64 });
  } catch (error) {
    return errorResponse(error);
  }
}
