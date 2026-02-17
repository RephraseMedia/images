export type BackgroundRemoverStatus = 'idle' | 'uploading' | 'processing' | 'done' | 'error';

export interface BackgroundRemoverState {
  sourceFile: File | null;
  sourcePreview: string | null;
  status: BackgroundRemoverStatus;
  resultImage: string | null; // base64 data URI
  backgroundColor: string | null; // null = transparent, or hex string
  error: string | null;
}
