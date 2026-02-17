'use client';

import { useState, useCallback } from 'react';
import type { BackgroundRemoverState } from '@/types/backgroundRemover';
import { showToast } from '@/components/ui/Toast';

const initialState: BackgroundRemoverState = {
  sourceFile: null,
  sourcePreview: null,
  status: 'idle',
  resultImage: null,
  backgroundColor: null,
  error: null,
};

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

function compositeOnColor(dataUri: string, color: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => reject(new Error('Failed to composite image'));
    img.src = dataUri;
  });
}

export function useBackgroundRemover() {
  const [state, setState] = useState<BackgroundRemoverState>(initialState);

  const setFile = useCallback((file: File) => {
    setState((prev) => {
      if (prev.sourcePreview) URL.revokeObjectURL(prev.sourcePreview);
      return {
        ...initialState,
        sourceFile: file,
        sourcePreview: URL.createObjectURL(file),
      };
    });
  }, []);

  const removeBackground = useCallback(async () => {
    const file = state.sourceFile;
    if (!file) return;

    setState((prev) => ({ ...prev, status: 'uploading', error: null }));

    try {
      const base64 = await fileToBase64(file);
      setState((prev) => ({ ...prev, status: 'processing' }));

      const response = await fetch('/api/remove-background', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64 }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed: ${response.status}`);
      }

      const data = await response.json();
      setState((prev) => ({
        ...prev,
        status: 'done',
        resultImage: data.image,
      }));
      showToast('success', 'Background removed!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Background removal failed';
      setState((prev) => ({
        ...prev,
        status: 'error',
        error: message,
      }));
      showToast('error', message);
    }
  }, [state.sourceFile]);

  const setBackgroundColor = useCallback((color: string | null) => {
    setState((prev) => ({ ...prev, backgroundColor: color }));
  }, []);

  const downloadResult = useCallback(async () => {
    if (!state.resultImage) return;

    let downloadUri = state.resultImage;
    if (state.backgroundColor) {
      downloadUri = await compositeOnColor(state.resultImage, state.backgroundColor);
    }

    const a = document.createElement('a');
    a.href = downloadUri;
    a.download = 'background-removed.png';
    a.click();
  }, [state.resultImage, state.backgroundColor]);

  const reset = useCallback(() => {
    setState((prev) => {
      if (prev.sourcePreview) URL.revokeObjectURL(prev.sourcePreview);
      return { ...initialState };
    });
  }, []);

  return {
    ...state,
    setFile,
    removeBackground,
    setBackgroundColor,
    downloadResult,
    reset,
  };
}
