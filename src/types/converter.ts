export type OutputFormat = 'jpeg' | 'png' | 'webp';

export interface FormatOption {
  id: OutputFormat;
  label: string;
  extension: string;
  mimeType: string;
  supportsQuality: boolean;
}

export type ConversionStatus = 'pending' | 'converting' | 'done' | 'error';

export interface ConversionFile {
  id: string;
  originalFile: File;
  originalName: string;
  originalSize: number;
  previewUrl: string;
  status: ConversionStatus;
  convertedBlob: Blob | null;
  convertedSize: number | null;
  convertedUrl: string | null;
  error: string | null;
}

export interface ConverterState {
  files: ConversionFile[];
  outputFormat: OutputFormat;
  quality: number;
  isConverting: boolean;
}

export const FORMAT_OPTIONS: FormatOption[] = [
  { id: 'jpeg', label: 'JPG', extension: 'jpg', mimeType: 'image/jpeg', supportsQuality: true },
  { id: 'png', label: 'PNG', extension: 'png', mimeType: 'image/png', supportsQuality: false },
  { id: 'webp', label: 'WebP', extension: 'webp', mimeType: 'image/webp', supportsQuality: true },
];

export const DEFAULT_QUALITY = 85;
export const MAX_CONVERTER_FILES = 20;
