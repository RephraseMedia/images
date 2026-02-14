import { NextRequest } from 'next/server';
import { validateBase64Image } from '@/lib/validation';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import {
  errorResponse,
  successResponse,
  ValidationError,
  RateLimitError,
} from '@/lib/errors';
import { enhance } from '@/lib/replicate';
import { urlToBase64, toDataUri } from '@/lib/imageUtils';

export async function POST(request: NextRequest) {
  try {
    // Rate limit
    const ip = getClientIp(request);
    const rateLimitResult = checkRateLimit(ip);
    if (!rateLimitResult.allowed) {
      throw new RateLimitError(rateLimitResult.retryAfterMs);
    }

    // Parse body
    const body = await request.json();
    const { image, faceEnhance } = body;

    // Validate
    const imageValidation = validateBase64Image(image);
    if (!imageValidation.valid) {
      throw new ValidationError(imageValidation.error!);
    }

    // Prepare data URI for Replicate
    const imageUri = image.startsWith('data:') ? image : toDataUri(image);

    // Call Replicate
    const resultUrl = await enhance(imageUri, faceEnhance ?? false);

    // Fetch result and convert to base64
    const resultBase64 = await urlToBase64(resultUrl);

    return successResponse({ image: resultBase64 });
  } catch (error) {
    return errorResponse(error);
  }
}
