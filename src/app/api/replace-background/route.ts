import { NextRequest } from 'next/server';
import { validateBase64Image, validatePrompt } from '@/lib/validation';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import {
  errorResponse,
  successResponse,
  ValidationError,
  RateLimitError,
} from '@/lib/errors';
import { removeBackground, inpaint } from '@/lib/replicate';
import { urlToBase64, toDataUri, base64ToBuffer, bufferToDataUri } from '@/lib/imageUtils';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateLimitResult = checkRateLimit(ip);
    if (!rateLimitResult.allowed) {
      throw new RateLimitError(rateLimitResult.retryAfterMs);
    }

    const body = await request.json();
    const { image, mode, prompt, color, backgroundImage } = body;

    // Validate image
    const imageValidation = validateBase64Image(image);
    if (!imageValidation.valid) {
      throw new ValidationError(imageValidation.error!);
    }

    if (!['prompt', 'color', 'upload'].includes(mode)) {
      throw new ValidationError('Invalid mode. Must be prompt, color, or upload.');
    }

    // Step 1: Remove background to get subject with alpha
    const imageUri = image.startsWith('data:') ? image : toDataUri(image);
    const removedBgUrl = await removeBackground(imageUri);
    const subjectBase64 = await urlToBase64(removedBgUrl);

    if (mode === 'prompt') {
      // Step 2a: Use inpainting to replace background via prompt
      const promptValidation = validatePrompt(prompt);
      if (!promptValidation.valid) {
        throw new ValidationError(promptValidation.error!);
      }

      // Create a mask from the alpha channel (background = white in mask)
      const subjectBuffer = base64ToBuffer(subjectBase64);
      const { data, info } = await sharp(subjectBuffer)
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

      // Create mask: where alpha is low (background), set white; where alpha is high (subject), set black
      const maskBuffer = Buffer.alloc(info.width * info.height);
      for (let i = 0; i < info.width * info.height; i++) {
        const alpha = data[i * 4 + 3];
        maskBuffer[i] = alpha < 128 ? 255 : 0;
      }

      const maskPng = await sharp(maskBuffer, {
        raw: { width: info.width, height: info.height, channels: 1 },
      })
        .png()
        .toBuffer();

      const maskUri = bufferToDataUri(maskPng, 'image/png');

      const resultUrl = await inpaint(imageUri, maskUri, prompt);
      const resultBase64 = await urlToBase64(resultUrl);

      return successResponse({ image: resultBase64 });
    }

    if (mode === 'color') {
      // Step 2b: Composite subject over solid color
      if (!color) throw new ValidationError('Color is required for color mode');

      const subjectBuffer = base64ToBuffer(subjectBase64);
      const metadata = await sharp(subjectBuffer).metadata();
      const width = metadata.width!;
      const height = metadata.height!;

      // Create solid color background
      const bgBuffer = await sharp({
        create: {
          width,
          height,
          channels: 4,
          background: hexToRgba(color),
        },
      })
        .png()
        .toBuffer();

      // Composite subject over background
      const result = await sharp(bgBuffer)
        .composite([{ input: subjectBuffer, blend: 'over' }])
        .png()
        .toBuffer();

      return successResponse({ image: bufferToDataUri(result, 'image/png') });
    }

    if (mode === 'upload') {
      // Step 2c: Composite subject over uploaded background
      if (!backgroundImage) throw new ValidationError('Background image is required for upload mode');

      const bgValidation = validateBase64Image(backgroundImage);
      if (!bgValidation.valid) {
        throw new ValidationError(bgValidation.error!);
      }

      const subjectBuffer = base64ToBuffer(subjectBase64);
      const bgBuffer = base64ToBuffer(backgroundImage);
      const metadata = await sharp(subjectBuffer).metadata();
      const width = metadata.width!;
      const height = metadata.height!;

      // Resize background to match subject dimensions
      const resizedBg = await sharp(bgBuffer)
        .resize(width, height, { fit: 'cover' })
        .png()
        .toBuffer();

      // Composite subject over background
      const result = await sharp(resizedBg)
        .composite([{ input: subjectBuffer, blend: 'over' }])
        .png()
        .toBuffer();

      return successResponse({ image: bufferToDataUri(result, 'image/png') });
    }

    throw new ValidationError('Invalid mode');
  } catch (error) {
    return errorResponse(error);
  }
}

function hexToRgba(hex: string): { r: number; g: number; b: number; alpha: number } {
  const cleaned = hex.replace('#', '');
  const r = parseInt(cleaned.substring(0, 2), 16);
  const g = parseInt(cleaned.substring(2, 4), 16);
  const b = parseInt(cleaned.substring(4, 6), 16);
  return { r, g, b, alpha: 1 };
}
