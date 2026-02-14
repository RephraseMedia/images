export enum Tool {
  Enhance = 'enhance',
  RemoveBackground = 'remove-background',
  ReplaceBackground = 'replace-background',
  GenerativeFill = 'generative-fill',
  RemoveObject = 'remove-object',
  Download = 'download',
}

export interface HistoryEntry {
  image: string; // base64
  label: string;
}

export interface BrushSettings {
  size: number;
  opacity: number;
}

export interface ZoomPan {
  scale: number;
  offsetX: number;
  offsetY: number;
}

export type DownloadFormat = 'png' | 'jpeg';

export interface DownloadOptions {
  format: DownloadFormat;
  quality: number; // 0-100
  scale: number; // 0.25, 0.5, 1, 2
}

export type BackgroundMode = 'prompt' | 'color' | 'upload';

export interface EditorState {
  // Image
  originalImage: string | null;
  currentImage: string | null;
  imageWidth: number;
  imageHeight: number;

  // Tool
  activeTool: Tool | null;

  // Mask
  maskData: string | null; // base64 PNG mask

  // Prompt
  prompt: string;

  // Background replacement
  backgroundMode: BackgroundMode;
  backgroundColor: string;
  backgroundImage: string | null;

  // Brush
  brushSettings: BrushSettings;

  // Zoom/Pan
  zoomPan: ZoomPan;

  // History
  history: HistoryEntry[];
  historyIndex: number;

  // Processing
  isProcessing: boolean;
  processingMessage: string;

  // Download
  downloadOptions: DownloadOptions;
}

export interface EditorActions {
  setImage: (image: string, width: number, height: number) => void;
  setCurrentImage: (image: string, label: string) => void;
  setActiveTool: (tool: Tool | null) => void;
  setMaskData: (mask: string | null) => void;
  setPrompt: (prompt: string) => void;
  setBackgroundMode: (mode: BackgroundMode) => void;
  setBackgroundColor: (color: string) => void;
  setBackgroundImage: (image: string | null) => void;
  setBrushSettings: (settings: Partial<BrushSettings>) => void;
  setZoomPan: (zoomPan: Partial<ZoomPan>) => void;
  setProcessing: (isProcessing: boolean, message?: string) => void;
  setDownloadOptions: (options: Partial<DownloadOptions>) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  reset: () => void;
}
