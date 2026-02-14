'use client';

import { useCallback } from 'react';
import { useEditorStore } from '@/stores/editorStore';
import { MIN_BRUSH_SIZE, MAX_BRUSH_SIZE } from '@/lib/constants';

export function useBrush() {
  const { brushSettings, setBrushSettings } = useEditorStore();

  const increaseBrushSize = useCallback(() => {
    setBrushSettings({
      size: Math.min(brushSettings.size + 5, MAX_BRUSH_SIZE),
    });
  }, [brushSettings.size, setBrushSettings]);

  const decreaseBrushSize = useCallback(() => {
    setBrushSettings({
      size: Math.max(brushSettings.size - 5, MIN_BRUSH_SIZE),
    });
  }, [brushSettings.size, setBrushSettings]);

  return {
    brushSettings,
    setBrushSettings,
    increaseBrushSize,
    decreaseBrushSize,
  };
}
