'use client';

import { useEditorStore } from '@/stores/editorStore';
import { MIN_ZOOM, MAX_ZOOM, ZOOM_STEP } from '@/lib/constants';

export default function ZoomControls() {
  const { zoomPan, setZoomPan } = useEditorStore();

  const zoomIn = () => {
    setZoomPan({ scale: Math.min(zoomPan.scale + ZOOM_STEP, MAX_ZOOM) });
  };

  const zoomOut = () => {
    setZoomPan({ scale: Math.max(zoomPan.scale - ZOOM_STEP, MIN_ZOOM) });
  };

  const resetZoom = () => {
    setZoomPan({ scale: 1, offsetX: 0, offsetY: 0 });
  };

  return (
    <div className="flex items-center gap-1 bg-background border border-border rounded-lg p-1">
      <button
        onClick={zoomOut}
        className="w-7 h-7 flex items-center justify-center rounded hover:bg-secondary text-sm"
        title="Zoom out (-)"
      >
        -
      </button>
      <button
        onClick={resetZoom}
        className="px-2 h-7 flex items-center justify-center rounded hover:bg-secondary text-xs min-w-[48px]"
        title="Reset zoom"
      >
        {Math.round(zoomPan.scale * 100)}%
      </button>
      <button
        onClick={zoomIn}
        className="w-7 h-7 flex items-center justify-center rounded hover:bg-secondary text-sm"
        title="Zoom in (+)"
      >
        +
      </button>
    </div>
  );
}
