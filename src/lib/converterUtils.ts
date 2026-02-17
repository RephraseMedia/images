import type { OutputFormat } from '@/types/converter';

/**
 * Load a File into an HTMLImageElement.
 */
export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    img.src = url;
  });
}

/**
 * Convert an HTMLImageElement to a Blob using canvas.
 * Fills with white background for JPEG (no transparency support).
 */
export function imageToBlob(
  img: HTMLImageElement,
  format: OutputFormat,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d')!;

    // JPEG doesn't support transparency — fill white background
    if (format === 'jpeg') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.drawImage(img, 0, 0);

    const mimeType = `image/${format}`;
    const q = format === 'png' ? undefined : quality / 100;

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Canvas conversion failed'));
          return;
        }
        resolve(blob);
      },
      mimeType,
      q
    );
  });
}

/**
 * High-level: convert a File to a Blob in the target format.
 */
export async function convertFile(
  file: File,
  format: OutputFormat,
  quality: number
): Promise<Blob> {
  const img = await loadImageFromFile(file);
  return imageToBlob(img, format, quality);
}

/**
 * Format bytes to a human-readable string.
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Swap the file extension to match the output format.
 */
export function getOutputFilename(name: string, extension: string): string {
  const dotIndex = name.lastIndexOf('.');
  if (dotIndex === -1) return `${name}.${extension}`;
  return `${name.substring(0, dotIndex)}.${extension}`;
}
