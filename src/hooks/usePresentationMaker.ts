'use client';

import { useState, useCallback } from 'react';
import type { PresentationStyle, PresentationMakerState, GeneratePresentationResponse } from '@/types/presentation';
import { showToast } from '@/components/ui/Toast';

const initialState: PresentationMakerState = {
  topic: '',
  slideCount: 8,
  style: 'professional',
  isGenerating: false,
  presentation: null,
  error: null,
};

export function usePresentationMaker() {
  const [state, setState] = useState<PresentationMakerState>(initialState);

  const setTopic = useCallback((topic: string) => {
    setState((prev) => ({ ...prev, topic }));
  }, []);

  const setSlideCount = useCallback((slideCount: number) => {
    setState((prev) => ({ ...prev, slideCount }));
  }, []);

  const setStyle = useCallback((style: PresentationStyle) => {
    setState((prev) => ({ ...prev, style }));
  }, []);

  const generate = useCallback(async () => {
    if (!state.topic.trim()) {
      showToast('error', 'Please enter a topic');
      return;
    }

    setState((prev) => ({
      ...prev,
      isGenerating: true,
      error: null,
      presentation: null,
    }));

    try {
      const response = await fetch('/api/generate-presentation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: state.topic,
          slideCount: state.slideCount,
          style: state.style,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Generation failed: ${response.status}`);
      }

      const data: GeneratePresentationResponse = await response.json();
      setState((prev) => ({
        ...prev,
        presentation: data.presentation,
        isGenerating: false,
      }));
      showToast('success', 'Presentation generated successfully!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Generation failed';
      setState((prev) => ({
        ...prev,
        isGenerating: false,
        error: message,
      }));
      showToast('error', message);
    }
  }, [state.topic, state.slideCount, state.style]);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    ...state,
    setTopic,
    setSlideCount,
    setStyle,
    generate,
    reset,
  };
}
