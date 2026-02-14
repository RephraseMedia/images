/**
 * Convert a base64 data URI to a raw base64 string.
 */
export function stripDataUri(dataUri: string): string {
  if (dataUri.includes(',')) {
    return dataUri.split(',')[1];
  }
  return dataUri;
}

/**
 * Convert a raw base64 string to a data URI.
 */
export function toDataUri(base64: string, mimeType: string = 'image/png'): string {
  if (base64.startsWith('data:')) {
    return base64;
  }
  return `data:${mimeType};base64,${base64}`;
}

/**
 * Convert a base64 string to a Buffer.
 */
export function base64ToBuffer(base64: string): Buffer {
  const raw = stripDataUri(base64);
  return Buffer.from(raw, 'base64');
}

/**
 * Convert a Buffer to a base64 data URI.
 */
export function bufferToDataUri(buffer: Buffer, mimeType: string = 'image/png'): string {
  return `data:${mimeType};base64,${buffer.toString('base64')}`;
}

/**
 * Detect MIME type from a base64 data URI.
 */
export function detectMimeType(dataUri: string): string | null {
  const match = dataUri.match(/^data:(image\/[a-z+]+);base64,/);
  return match ? match[1] : null;
}

/**
 * Fetch an image URL and return base64 data URI.
 */
export async function urlToBase64(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.status}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const contentType = response.headers.get('content-type') || 'image/png';
  return bufferToDataUri(buffer, contentType);
}

/**
 * Get image dimensions from a base64 string (client-side).
 */
export function getImageDimensions(
  dataUri: string
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    img.src = dataUri;
  });
}

/**
 * Check if a string looks like a HEIC/HEIF file by magic bytes (first few bytes base64-encoded).
 */
export function isHeicBase64(base64: string): boolean {
  const raw = stripDataUri(base64);
  // HEIC files have 'ftyp' at bytes 4-7
  // In base64, bytes 4-7 start at character position ~5
  try {
    const bytes = atob(raw.substring(0, 20));
    return bytes.substring(4, 8) === 'ftyp';
  } catch {
    return false;
  }
}
