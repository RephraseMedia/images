'use client';

import { useState, useCallback } from 'react';
import type { OutputFormat, ConversionFile, ConverterState } from '@/types/converter';
import { DEFAULT_QUALITY, MAX_CONVERTER_FILES, FORMAT_OPTIONS } from '@/types/converter';
import { convertFile } from '@/lib/converterUtils';

const initialState: ConverterState = {
  files: [],
  outputFormat: 'jpeg',
  quality: DEFAULT_QUALITY,
  isConverting: false,
};

let fileIdCounter = 0;

export function useImageConverter() {
  const [state, setState] = useState<ConverterState>(initialState);

  const addFiles = useCallback((newFiles: File[]) => {
    setState((prev) => {
      const remaining = MAX_CONVERTER_FILES - prev.files.length;
      const filesToAdd = newFiles.slice(0, remaining);
      const entries: ConversionFile[] = filesToAdd.map((file) => ({
        id: `file-${++fileIdCounter}`,
        originalFile: file,
        originalName: file.name,
        originalSize: file.size,
        previewUrl: URL.createObjectURL(file),
        status: 'pending' as const,
        convertedBlob: null,
        convertedSize: null,
        convertedUrl: null,
        error: null,
      }));
      return { ...prev, files: [...prev.files, ...entries] };
    });
  }, []);

  const removeFile = useCallback((id: string) => {
    setState((prev) => {
      const file = prev.files.find((f) => f.id === id);
      if (file) {
        URL.revokeObjectURL(file.previewUrl);
        if (file.convertedUrl) URL.revokeObjectURL(file.convertedUrl);
      }
      return { ...prev, files: prev.files.filter((f) => f.id !== id) };
    });
  }, []);

  const clearFiles = useCallback(() => {
    setState((prev) => {
      prev.files.forEach((file) => {
        URL.revokeObjectURL(file.previewUrl);
        if (file.convertedUrl) URL.revokeObjectURL(file.convertedUrl);
      });
      return { ...prev, files: [] };
    });
  }, []);

  const setOutputFormat = useCallback((outputFormat: OutputFormat) => {
    setState((prev) => ({ ...prev, outputFormat }));
  }, []);

  const setQuality = useCallback((quality: number) => {
    setState((prev) => ({ ...prev, quality }));
  }, []);

  const convertAll = useCallback(async () => {
    setState((prev) => ({ ...prev, isConverting: true }));

    const currentState = state;
    const format = currentState.outputFormat;
    const quality = currentState.quality;
    const formatOption = FORMAT_OPTIONS.find((f) => f.id === format)!;

    for (const file of currentState.files) {
      if (file.status !== 'pending' && file.status !== 'error') continue;

      setState((prev) => ({
        ...prev,
        files: prev.files.map((f) =>
          f.id === file.id ? { ...f, status: 'converting' as const, error: null } : f
        ),
      }));

      try {
        const blob = await convertFile(file.originalFile, format, quality);
        const url = URL.createObjectURL(blob);
        setState((prev) => ({
          ...prev,
          files: prev.files.map((f) =>
            f.id === file.id
              ? {
                  ...f,
                  status: 'done' as const,
                  convertedBlob: blob,
                  convertedSize: blob.size,
                  convertedUrl: url,
                }
              : f
          ),
        }));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Conversion failed';
        setState((prev) => ({
          ...prev,
          files: prev.files.map((f) =>
            f.id === file.id ? { ...f, status: 'error' as const, error: message } : f
          ),
        }));
      }
    }

    setState((prev) => ({ ...prev, isConverting: false }));
  }, [state]);

  const reset = useCallback(() => {
    setState((prev) => {
      prev.files.forEach((file) => {
        URL.revokeObjectURL(file.previewUrl);
        if (file.convertedUrl) URL.revokeObjectURL(file.convertedUrl);
      });
      return { ...initialState };
    });
  }, []);

  const formatOption = FORMAT_OPTIONS.find((f) => f.id === state.outputFormat)!;

  return {
    ...state,
    formatOption,
    addFiles,
    removeFile,
    clearFiles,
    setOutputFormat,
    setQuality,
    convertAll,
    reset,
  };
}
