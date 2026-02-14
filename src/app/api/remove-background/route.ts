import { NextRequest } from 'next/server';
import { validateBase64Image } from '@/lib/validation';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import {
  errorResponse,
  successResponse,
  ValidationError,
  RateLimitError,
} from '@/lib/errors';
import { removeBackground } from '@/lib/replicate';
import { urlToBase64, toDataUri } from '@/lib/imageUtils';

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateLimitResult = checkRateLimit(ip);
    if (!rateLimitResult.allowed) {
      throw new RateLimitError(rateLimitResult.retryAfterMs);
    }

    const body = await request.json();
    const { image } = body;

    const imageValidation = validateBase64Image(image);
    if (!imageValidation.valid) {
      throw new ValidationError(imageValidation.error!);
    }

    const imageUri = image.startsWith('data:') ? image : toDataUri(image);
    const resultUrl = await removeBackground(imageUri);
    const resultBase64 = await urlToBase64(resultUrl);

    return successResponse({ image: resultBase64 });
  } catch (error) {
    return errorResponse(error);
  }
}
