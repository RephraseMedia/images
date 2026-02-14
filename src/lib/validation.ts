import {
  MAX_FILE_SIZE,
  MAX_DIMENSION,
  MIN_DIMENSION,
  SUPPORTED_FORMATS,
  MAX_GENERATE_PROMPT_LENGTH,
} from './constants';

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateFileSize(size: number): ValidationResult {
  if (size === 0) {
    return { valid: false, error: 'File is empty' };
  }
  if (size > MAX_FILE_SIZE) {
    const maxMB = Math.round(MAX_FILE_SIZE / (1024 * 1024));
    return { valid: false, error: `File exceeds ${maxMB}MB limit` };
  }
  return { valid: true };
}

export function validateFileFormat(mimeType: string): ValidationResult {
  if (!SUPPORTED_FORMATS.includes(mimeType as typeof SUPPORTED_FORMATS[number])) {
    return {
      valid: false,
      error: `Unsupported format: ${mimeType}. Supported: JPEG, PNG, WebP, HEIC`,
    };
  }
  return { valid: true };
}

export function validateDimensions(width: number, height: number): ValidationResult {
  if (width < MIN_DIMENSION || height < MIN_DIMENSION) {
    return {
      valid: false,
      error: `Image too small. Minimum dimension is ${MIN_DIMENSION}px`,
    };
  }
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    return {
      valid: false,
      error: `Image too large. Maximum dimension is ${MAX_DIMENSION}px`,
    };
  }
  return { valid: true };
}

export function validateBase64Image(base64: string): ValidationResult {
  if (!base64 || typeof base64 !== 'string') {
    return { valid: false, error: 'Image data is required' };
  }

  // Check for data URI prefix or raw base64
  const raw = base64.includes(',') ? base64.split(',')[1] : base64;

  if (!raw || raw.length === 0) {
    return { valid: false, error: 'Image data is empty' };
  }

  // Basic base64 validation
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  if (!base64Regex.test(raw)) {
    return { valid: false, error: 'Invalid base64 encoding' };
  }

  // Check decoded size
  const estimatedSize = (raw.length * 3) / 4;
  if (estimatedSize > MAX_FILE_SIZE) {
    return { valid: false, error: 'Image data exceeds size limit' };
  }

  return { valid: true };
}

export function validatePrompt(prompt: string): ValidationResult {
  if (!prompt || typeof prompt !== 'string') {
    return { valid: false, error: 'Prompt is required' };
  }
  const trimmed = prompt.trim();
  if (trimmed.length === 0) {
    return { valid: false, error: 'Prompt cannot be empty' };
  }
  if (trimmed.length > 500) {
    return { valid: false, error: 'Prompt must be 500 characters or less' };
  }
  return { valid: true };
}

export function validateGeneratePrompt(prompt: string): ValidationResult {
  if (!prompt || typeof prompt !== 'string') {
    return { valid: false, error: 'Prompt is required' };
  }
  const trimmed = prompt.trim();
  if (trimmed.length === 0) {
    return { valid: false, error: 'Prompt cannot be empty' };
  }
  if (trimmed.length > MAX_GENERATE_PROMPT_LENGTH) {
    return { valid: false, error: `Prompt must be ${MAX_GENERATE_PROMPT_LENGTH} characters or less` };
  }
  return { valid: true };
}

export function validateNumberOfImages(num: number): ValidationResult {
  if (!Number.isInteger(num) || num < 1 || num > 4) {
    return { valid: false, error: 'Number of images must be between 1 and 4' };
  }
  return { valid: true };
}

export function validateMask(mask: string): ValidationResult {
  if (!mask || typeof mask !== 'string') {
    return { valid: false, error: 'Mask data is required' };
  }
  return validateBase64Image(mask);
}
