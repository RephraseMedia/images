'use client';

import { useImageConverter } from '@/hooks/useImageConverter';
import DropZone from '@/components/ui/DropZone';
import Button from '@/components/ui/Button';
import { FORMAT_OPTIONS } from '@/types/converter';
import { formatFileSize, getOutputFilename } from '@/lib/converterUtils';

export default function ConverterForm() {
  const {
    files,
    outputFormat,
    quality,
    isConverting,
    formatOption,
    addFiles,
    removeFile,
    clearFiles,
    setOutputFormat,
    setQuality,
    convertAll,
  } = useImageConverter();

  const hasFiles = files.length > 0;
  const hasDone = files.some((f) => f.status === 'done');
  const hasPending = files.some((f) => f.status === 'pending' || f.status === 'error');
  const supportsQuality = FORMAT_OPTIONS.find((f) => f.id === outputFormat)?.supportsQuality ?? false;

  const handleDownloadAll = () => {
    files.forEach((file) => {
      if (file.convertedUrl && file.convertedBlob) {
        const a = document.createElement('a');
        a.href = file.convertedUrl;
        a.download = getOutputFilename(file.originalName, formatOption.extension);
        a.click();
      }
    });
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Upload Area */}
      <DropZone
        onFiles={addFiles}
        accept="image/*"
        multiple
        className="border-2 border-dashed rounded-2xl p-10"
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <svg className="w-10 h-10 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <p className="text-sm font-medium">Drop images here or click to upload</p>
          <p className="text-xs text-muted">JPG, PNG, WebP — up to 20 files</p>
        </div>
      </DropZone>

      {/* Format Selector */}
      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium">Output Format</label>
        <div className="flex gap-2">
          {FORMAT_OPTIONS.map((fmt) => (
            <button
              key={fmt.id}
              type="button"
              onClick={() => setOutputFormat(fmt.id)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                outputFormat === fmt.id
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:border-primary/30 text-foreground'
              }`}
            >
              {fmt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quality Slider */}
      {supportsQuality && (
        <div className="flex flex-col gap-3">
          <label htmlFor="quality-slider" className="text-sm font-medium">
            Quality: {quality}%
          </label>
          <input
            id="quality-slider"
            type="range"
            min={1}
            max={100}
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-xs text-muted">
            <span>Smaller file</span>
            <span>Higher quality</span>
          </div>
        </div>
      )}

      {/* File List */}
      {hasFiles && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{files.length} file{files.length !== 1 ? 's' : ''}</span>
            <button
              type="button"
              onClick={clearFiles}
              className="text-xs text-muted hover:text-foreground transition-colors"
            >
              Clear all
            </button>
          </div>
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-3 p-3 rounded-xl border border-border"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={file.previewUrl}
                  alt={file.originalName}
                  className="w-10 h-10 rounded object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.originalName}</p>
                  <p className="text-xs text-muted">
                    {formatFileSize(file.originalSize)}
                    {file.status === 'done' && file.convertedSize != null && (
                      <> → {formatFileSize(file.convertedSize)}</>
                    )}
                    {file.status === 'error' && (
                      <span className="text-error"> — {file.error}</span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {file.status === 'converting' && (
                    <span className="text-xs text-muted">Converting...</span>
                  )}
                  {file.status === 'done' && file.convertedUrl && (
                    <a
                      href={file.convertedUrl}
                      download={getOutputFilename(file.originalName, formatOption.extension)}
                      className="text-xs text-primary hover:underline"
                    >
                      Download
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => removeFile(file.id)}
                    className="text-muted hover:text-foreground transition-colors"
                    aria-label={`Remove ${file.originalName}`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={convertAll}
          size="lg"
          loading={isConverting}
          disabled={!hasPending || isConverting}
          className="flex-1"
        >
          {isConverting ? 'Converting...' : 'Convert All'}
        </Button>
        {hasDone && (
          <Button
            onClick={handleDownloadAll}
            variant="secondary"
            size="lg"
          >
            Download All
          </Button>
        )}
      </div>
    </div>
  );
}
