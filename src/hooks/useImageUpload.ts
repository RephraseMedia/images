'use client';

import { useState, useCallback } from 'react';
import { validateFileSize, validateFileFormat, validateDimensions } from '@/lib/validation';
import { SUPPORTED_FORMATS } from '@/lib/constants';
import { showToast } from '@/components/ui/Toast';
import { useEditorStore } from '@/stores/editorStore';

export function useImageUpload() {
  const [isLoading, setIsLoading] = useState(false);
  const setImage = useEditorStore((state) => state.setImage);

  const processFile = useCallback(
    async (file: File): Promise<boolean> => {
      setIsLoading(true);

      try {
        // Validate size
        const sizeResult = validateFileSize(file.size);
        if (!sizeResult.valid) {
          showToast('error', sizeResult.error!);
          return false;
        }

        // Check format
        let fileToProcess = file;
        const isHeic =
          file.type === 'image/heic' ||
          file.type === 'image/heif' ||
          file.name.toLowerCase().endsWith('.heic') ||
          file.name.toLowerCase().endsWith('.heif');

        if (isHeic) {
          try {
            const heic2any = (await import('heic2any')).default;
            const converted = await heic2any({
              blob: file,
              toType: 'image/png',
            });
            const blob = Array.isArray(converted) ? converted[0] : converted;
            fileToProcess = new File([blob], file.name.replace(/\.heic$/i, '.png'), {
              type: 'image/png',
            });
          } catch {
            showToast('error', 'Failed to convert HEIC image. Please try a different format.');
            return false;
          }
        } else {
          const formatResult = validateFileFormat(file.type);
          if (!formatResult.valid) {
            showToast('error', formatResult.error!);
            return false;
          }
        }

        // Read as data URI
        const dataUri = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsDataURL(fileToProcess);
        });

        // Get dimensions
        const { width, height } = await new Promise<{ width: number; height: number }>(
          (resolve, reject) => {
            const img = new window.Image();
            img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = dataUri;
          }
        );

        // Validate dimensions
        const dimResult = validateDimensions(width, height);
        if (!dimResult.valid) {
          showToast('error', dimResult.error!);
          return false;
        }

        // Store image
        setImage(dataUri, width, height);
        return true;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to process image';
        showToast('error', message);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [setImage]
  );

  const handleFiles = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return false;
      return processFile(files[0]);
    },
    [processFile]
  );

  const acceptedFormats = SUPPORTED_FORMATS.join(',');

  return { handleFiles, isLoading, acceptedFormats };
}
