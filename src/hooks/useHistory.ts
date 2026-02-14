'use client';

import { useCallback, useEffect } from 'react';
import { useEditorStore } from '@/stores/editorStore';

export function useHistory() {
  const { undo, redo, canUndo, canRedo, history, historyIndex } = useEditorStore();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          if (canRedo()) redo();
        } else {
          if (canUndo()) undo();
        }
      }
    },
    [undo, redo, canUndo, canRedo]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return {
    undo,
    redo,
    canUndo: canUndo(),
    canRedo: canRedo(),
    historyLength: history.length,
    currentIndex: historyIndex,
  };
}
