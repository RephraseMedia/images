'use client';

import { useBackgroundRemover } from '@/hooks/useBackgroundRemover';
import DropZone from '@/components/ui/DropZone';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import ColorPicker from '@/components/ui/ColorPicker';

const BG_PRESETS = [
  { label: 'Transparent', value: null },
  { label: 'White', value: '#ffffff' },
  { label: 'Black', value: '#000000' },
] as const;

export default function BackgroundRemoverForm() {
  const {
    sourceFile,
    sourcePreview,
    status,
    resultImage,
    backgroundColor,
    error,
    setFile,
    removeBackground,
    setBackgroundColor,
    downloadResult,
    reset,
  } = useBackgroundRemover();

  const isProcessing = status === 'uploading' || status === 'processing';
  const showCustomPicker = backgroundColor !== null && !BG_PRESETS.some((p) => p.value === backgroundColor);

  const handleFiles = (files: File[]) => {
    if (files[0]) setFile(files[0]);
  };

  // Idle state — show drop zone
  if (status === 'idle' && !sourceFile) {
    return (
      <DropZone
        onFiles={handleFiles}
        accept="image/*"
        className="border-2 border-dashed rounded-2xl p-10"
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <svg className="w-10 h-10 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <p className="text-sm font-medium">Drop an image here or click to upload</p>
          <p className="text-xs text-muted">PNG, JPG, WebP — any image format</p>
        </div>
      </DropZone>
    );
  }

  // Processing state
  if (isProcessing) {
    return (
      <div className="flex flex-col items-center gap-4 py-12">
        <Spinner size="lg" />
        <p className="text-sm text-muted">
          {status === 'uploading' ? 'Uploading image...' : 'Removing background...'}
        </p>
      </div>
    );
  }

  // Done state — show result
  if (status === 'done' && resultImage) {
    return (
      <div className="flex flex-col gap-6">
        {/* Result image */}
        <div className={`rounded-xl overflow-hidden border border-border ${backgroundColor ? '' : 'checkerboard'}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={resultImage}
            alt="Background removed result"
            className="w-full h-auto max-h-[500px] object-contain"
            style={backgroundColor ? { backgroundColor } : undefined}
          />
        </div>

        {/* Background color options */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium">Background Color</label>
          <div className="flex gap-2 flex-wrap">
            {BG_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => setBackgroundColor(preset.value)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  backgroundColor === preset.value
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/30 text-foreground'
                }`}
              >
                {preset.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setBackgroundColor('#ef4444')}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                showCustomPicker
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:border-primary/30 text-foreground'
              }`}
            >
              Custom
            </button>
          </div>
          {showCustomPicker && (
            <ColorPicker
              value={backgroundColor!}
              onChange={(color) => setBackgroundColor(color)}
            />
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <Button onClick={downloadResult} size="lg" className="flex-1">
            Download PNG
          </Button>
          <Button onClick={reset} variant="secondary" size="lg">
            Remove Another
          </Button>
        </div>
      </div>
    );
  }

  // Error state
  if (status === 'error') {
    return (
      <div className="flex flex-col items-center gap-4 py-8">
        <p className="text-sm text-error">{error}</p>
        <Button onClick={removeBackground} variant="secondary">
          Try Again
        </Button>
        <button
          type="button"
          onClick={reset}
          className="text-sm text-muted hover:text-foreground transition-colors"
        >
          Choose a different image
        </button>
      </div>
    );
  }

  // File selected — show preview + remove button
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4 p-4 rounded-xl border border-border">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={sourcePreview!}
          alt={sourceFile!.name}
          className="w-16 h-16 rounded-lg object-cover"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{sourceFile!.name}</p>
          <button
            type="button"
            onClick={reset}
            className="text-xs text-muted hover:text-foreground transition-colors"
          >
            Change image
          </button>
        </div>
      </div>
      <Button onClick={removeBackground} size="lg">
        Remove Background
      </Button>
    </div>
  );
}
