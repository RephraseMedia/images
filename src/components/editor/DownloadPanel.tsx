'use client';

import { useEditorStore } from '@/stores/editorStore';
import { useDownload } from '@/hooks/useDownload';
import Button from '@/components/ui/Button';
import type { DownloadFormat } from '@/types/editor';

const scales = [
  { label: '0.25x', value: 0.25 },
  { label: '0.5x', value: 0.5 },
  { label: '1x', value: 1 },
  { label: '2x', value: 2 },
];

export default function DownloadPanel() {
  const { downloadOptions, setDownloadOptions, imageWidth, imageHeight } = useEditorStore();
  const { download } = useDownload();

  const outputWidth = Math.round(imageWidth * downloadOptions.scale);
  const outputHeight = Math.round(imageHeight * downloadOptions.scale);

  return (
    <div className="flex flex-col gap-4">
      {/* Format */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-muted uppercase tracking-wide">Format</label>
        <div className="flex gap-2">
          {(['png', 'jpeg'] as DownloadFormat[]).map((fmt) => (
            <button
              key={fmt}
              onClick={() => setDownloadOptions({ format: fmt })}
              className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${
                downloadOptions.format === fmt
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:border-primary/30'
              }`}
            >
              {fmt.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Quality (JPEG only) */}
      {downloadOptions.format === 'jpeg' && (
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-muted uppercase tracking-wide">
            Quality: {downloadOptions.quality}%
          </label>
          <input
            type="range"
            min={10}
            max={100}
            step={5}
            value={downloadOptions.quality}
            onChange={(e) => setDownloadOptions({ quality: Number(e.target.value) })}
          />
        </div>
      )}

      {/* Scale */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-muted uppercase tracking-wide">Resolution</label>
        <div className="flex gap-2">
          {scales.map((s) => (
            <button
              key={s.value}
              onClick={() => setDownloadOptions({ scale: s.value })}
              className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${
                downloadOptions.scale === s.value
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:border-primary/30'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted">
          Output: {outputWidth} x {outputHeight}px
        </p>
      </div>

      <Button onClick={download} size="lg" className="w-full mt-2">
        Download Image
      </Button>
    </div>
  );
}
