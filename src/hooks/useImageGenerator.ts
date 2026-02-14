'use client';

import { useState, useCallback } from 'react';
import type { ImageStyle, AspectRatio, GeneratorState } from '@/types/generator';
import type { GenerateResponse } from '@/types/api';
import { showToast } from '@/components/ui/Toast';

const initialState: GeneratorState = {
  prompt: '',
  style: 'none',
  aspectRatio: '1:1',
  numberOfImages: 1,
  isGenerating: false,
  generatedImages: [],
  error: null,
};

export function useImageGenerator() {
  const [state, setState] = useState<GeneratorState>(initialState);

  const setPrompt = useCallback((prompt: string) => {
    setState((prev) => ({ ...prev, prompt }));
  }, []);

  const setStyle = useCallback((style: ImageStyle) => {
    setState((prev) => ({ ...prev, style }));
  }, []);

  const setAspectRatio = useCallback((aspectRatio: AspectRatio) => {
    setState((prev) => ({ ...prev, aspectRatio }));
  }, []);

  const setNumberOfImages = useCallback((numberOfImages: number) => {
    setState((prev) => ({ ...prev, numberOfImages }));
  }, []);

  const generate = useCallback(async () => {
    if (!state.prompt.trim()) {
      showToast('error', 'Please enter a prompt');
      return;
    }

    setState((prev) => ({
      ...prev,
      isGenerating: true,
      error: null,
      generatedImages: [],
    }));

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: state.prompt,
          style: state.style,
          aspectRatio: state.aspectRatio,
          numberOfImages: state.numberOfImages,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Generation failed: ${response.status}`);
      }

      const data: GenerateResponse = await response.json();
      setState((prev) => ({
        ...prev,
        generatedImages: data.images,
        isGenerating: false,
      }));
      showToast('success', `Generated ${data.images.length} image${data.images.length > 1 ? 's' : ''}!`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Generation failed';
      setState((prev) => ({
        ...prev,
        isGenerating: false,
        error: message,
      }));
      showToast('error', message);
    }
  }, [state.prompt, state.style, state.aspectRatio, state.numberOfImages]);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    ...state,
    setPrompt,
    setStyle,
    setAspectRatio,
    setNumberOfImages,
    generate,
    reset,
  };
}
