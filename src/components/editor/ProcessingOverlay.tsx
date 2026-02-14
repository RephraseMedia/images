'use client';

import { useEditorStore } from '@/stores/editorStore';
import Spinner from '@/components/ui/Spinner';

export default function ProcessingOverlay() {
  const { isProcessing, processingMessage } = useEditorStore();

  if (!isProcessing) return null;

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-background rounded-xl p-8 flex flex-col items-center gap-4 shadow-xl">
        <Spinner size="lg" />
        <p className="text-sm font-medium">{processingMessage || 'Processing...'}</p>
        <p className="text-xs text-muted">This may take a few seconds</p>
      </div>
    </div>
  );
}
