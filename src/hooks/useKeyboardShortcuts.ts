'use client';

import { useEffect } from 'react';
import { useEditorStore } from '@/stores/editorStore';
import { MIN_ZOOM, MAX_ZOOM, ZOOM_STEP } from '@/lib/constants';

export function useKeyboardShortcuts() {
  const { zoomPan, setZoomPan, setActiveTool } = useEditorStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case '=':
        case '+':
          e.preventDefault();
          setZoomPan({ scale: Math.min(zoomPan.scale + ZOOM_STEP, MAX_ZOOM) });
          break;
        case '-':
          e.preventDefault();
          setZoomPan({ scale: Math.max(zoomPan.scale - ZOOM_STEP, MIN_ZOOM) });
          break;
        case '0':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            setZoomPan({ scale: 1, offsetX: 0, offsetY: 0 });
          }
          break;
        case 'Escape':
          setActiveTool(null);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoomPan.scale, setZoomPan, setActiveTool]);
}
