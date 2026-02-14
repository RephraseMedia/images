'use client';

import { useCallback } from 'react';
import { useEditorStore } from '@/stores/editorStore';
import { showToast } from '@/components/ui/Toast';
import type { ApiResponse, ApiError } from '@/types/api';

interface AiOperationOptions {
  endpoint: string;
  body: Record<string, unknown>;
  label: string;
  processingMessage?: string;
}

export function useAiOperation() {
  const { setCurrentImage, setProcessing } = useEditorStore();

  const execute = useCallback(
    async ({ endpoint, body, label, processingMessage }: AiOperationOptions): Promise<boolean> => {
      setProcessing(true, processingMessage || 'Processing...');

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          const errorData: ApiError = await response.json();
          throw new Error(errorData.error || `Request failed: ${response.status}`);
        }

        const data: ApiResponse = await response.json();
        setCurrentImage(data.image, label);
        showToast('success', `${label} complete!`);
        return true;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Operation failed';
        showToast('error', message);
        return false;
      } finally {
        setProcessing(false);
      }
    },
    [setCurrentImage, setProcessing]
  );

  return { execute };
}
