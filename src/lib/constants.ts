export const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
export const MAX_BODY_SIZE = 30 * 1024 * 1024; // 30MB
export const MAX_DIMENSION = 4096;
export const MIN_DIMENSION = 64;

export const SUPPORTED_FORMATS = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
] as const;

export const SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif'] as const;

export const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
export const RATE_LIMIT_MAX_REQUESTS = 10;

export const API_TIMEOUT_MS = 60 * 1000; // 60s for Replicate calls

export const MAX_HISTORY_SIZE = 20;

export const DEFAULT_BRUSH_SIZE = 30;
export const MIN_BRUSH_SIZE = 5;
export const MAX_BRUSH_SIZE = 100;

export const DEFAULT_ZOOM = 1;
export const MIN_ZOOM = 0.1;
export const MAX_ZOOM = 5;
export const ZOOM_STEP = 0.1;

export const MAX_GENERATE_PROMPT_LENGTH = 1000;
export const DEFAULT_NEGATIVE_PROMPT = 'blurry, low quality, distorted, deformed, ugly, bad anatomy, watermark, text, signature';

export const REPLICATE_MODELS = {
  enhance: 'nightmareai/real-esrgan:f121d640bd286e1fdc67f9799164c1d5be36ff74576ee11c803ae5b665dd46aa',
  removeBackground: 'cjwbw/rembg:fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003',
  inpainting: 'lucataco/sdxl-inpainting:a]67ed49dd3a650a3cabe45b6a7ec016db04e3f0842298f212e5dbecb1db50fa2',
  generate: 'stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc',
} as const;
