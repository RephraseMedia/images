import {
  validateFileSize,
  validateFileFormat,
  validateDimensions,
  validateBase64Image,
  validatePrompt,
  validateMask,
} from '@/lib/validation';
import { MAX_FILE_SIZE } from '@/lib/constants';

describe('validateFileSize', () => {
  it('rejects zero-byte files', () => {
    const result = validateFileSize(0);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('empty');
  });

  it('accepts files within limit', () => {
    expect(validateFileSize(1024).valid).toBe(true);
    expect(validateFileSize(MAX_FILE_SIZE).valid).toBe(true);
  });

  it('rejects files exceeding limit', () => {
    const result = validateFileSize(MAX_FILE_SIZE + 1);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('20MB');
  });
});

describe('validateFileFormat', () => {
  it('accepts supported formats', () => {
    expect(validateFileFormat('image/jpeg').valid).toBe(true);
    expect(validateFileFormat('image/png').valid).toBe(true);
    expect(validateFileFormat('image/webp').valid).toBe(true);
    expect(validateFileFormat('image/heic').valid).toBe(true);
  });

  it('rejects unsupported formats', () => {
    const result = validateFileFormat('image/gif');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Unsupported');
  });

  it('rejects non-image formats', () => {
    expect(validateFileFormat('application/pdf').valid).toBe(false);
    expect(validateFileFormat('text/plain').valid).toBe(false);
  });
});

describe('validateDimensions', () => {
  it('accepts valid dimensions', () => {
    expect(validateDimensions(800, 600).valid).toBe(true);
    expect(validateDimensions(64, 64).valid).toBe(true);
    expect(validateDimensions(4096, 4096).valid).toBe(true);
  });

  it('rejects too-small dimensions', () => {
    const result = validateDimensions(32, 100);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('too small');
  });

  it('rejects too-large dimensions', () => {
    const result = validateDimensions(5000, 100);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('too large');
  });
});

describe('validateBase64Image', () => {
  it('rejects empty input', () => {
    expect(validateBase64Image('').valid).toBe(false);
    expect(validateBase64Image(null as unknown as string).valid).toBe(false);
  });

  it('accepts valid base64', () => {
    const validBase64 = 'data:image/png;base64,iVBORw0KGgo=';
    expect(validateBase64Image(validBase64).valid).toBe(true);
  });

  it('accepts raw base64', () => {
    expect(validateBase64Image('iVBORw0KGgo=').valid).toBe(true);
  });

  it('rejects invalid base64 characters', () => {
    const result = validateBase64Image('data:image/png;base64,!!!invalid!!!');
    expect(result.valid).toBe(false);
  });
});

describe('validatePrompt', () => {
  it('rejects empty prompt', () => {
    expect(validatePrompt('').valid).toBe(false);
    expect(validatePrompt('   ').valid).toBe(false);
  });

  it('accepts valid prompts', () => {
    expect(validatePrompt('a beautiful sunset').valid).toBe(true);
  });

  it('rejects prompts exceeding 500 chars', () => {
    const longPrompt = 'a'.repeat(501);
    expect(validatePrompt(longPrompt).valid).toBe(false);
  });
});

describe('validateMask', () => {
  it('rejects empty mask', () => {
    expect(validateMask('').valid).toBe(false);
    expect(validateMask(null as unknown as string).valid).toBe(false);
  });

  it('accepts valid base64 mask', () => {
    expect(validateMask('data:image/png;base64,iVBORw0KGgo=').valid).toBe(true);
  });
});
