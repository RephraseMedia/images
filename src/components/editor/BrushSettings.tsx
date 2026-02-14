'use client';

import { useEditorStore } from '@/stores/editorStore';
import { MIN_BRUSH_SIZE, MAX_BRUSH_SIZE } from '@/lib/constants';

export default function BrushSettings() {
  const { brushSettings, setBrushSettings } = useEditorStore();

  return (
    <div className="flex flex-col gap-3">
      <label className="text-xs font-medium text-muted uppercase tracking-wide">
        Brush Size
      </label>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={MIN_BRUSH_SIZE}
          max={MAX_BRUSH_SIZE}
          value={brushSettings.size}
          onChange={(e) => setBrushSettings({ size: Number(e.target.value) })}
          className="flex-1"
        />
        <span className="text-sm w-8 text-right">{brushSettings.size}</span>
      </div>
      <p className="text-xs text-muted">
        Paint over the area you want to modify. Press Esc to clear.
      </p>
    </div>
  );
}
