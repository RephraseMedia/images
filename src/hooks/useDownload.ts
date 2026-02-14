'use client';

import { useCallback } from 'react';
import { useEditorStore } from '@/stores/editorStore';
import { showToast } from '@/components/ui/Toast';

export function useDownload() {
  const { currentImage, downloadOptions, imageWidth, imageHeight } = useEditorStore();

  const download = useCallback(() => {
    if (!currentImage) {
      showToast('error', 'No image to download');
      return;
    }

    const { format, quality, scale } = downloadOptions;

    const canvas = document.createElement('canvas');
    const targetWidth = Math.round(imageWidth * scale);
    const targetHeight = Math.round(imageHeight * scale);
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
      const qualityValue = format === 'jpeg' ? quality / 100 : undefined;

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            showToast('error', 'Failed to generate image');
            return;
          }
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `edited-image.${format === 'jpeg' ? 'jpg' : 'png'}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          showToast('success', 'Image downloaded!');
        },
        mimeType,
        qualityValue
      );
    };
    img.src = currentImage;
  }, [currentImage, downloadOptions, imageWidth, imageHeight]);

  return { download };
}
