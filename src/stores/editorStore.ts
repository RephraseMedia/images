import { create } from 'zustand';
import {
  Tool,
  BackgroundMode,
  type EditorState,
  type EditorActions,
  type BrushSettings,
  type DownloadOptions,
  type ZoomPan,
  type HistoryEntry,
} from '@/types/editor';
import {
  DEFAULT_BRUSH_SIZE,
  DEFAULT_ZOOM,
  MAX_HISTORY_SIZE,
} from '@/lib/constants';

const initialState: EditorState = {
  originalImage: null,
  currentImage: null,
  imageWidth: 0,
  imageHeight: 0,
  activeTool: null,
  maskData: null,
  prompt: '',
  backgroundMode: 'prompt' as BackgroundMode,
  backgroundColor: '#ffffff',
  backgroundImage: null,
  brushSettings: {
    size: DEFAULT_BRUSH_SIZE,
    opacity: 1,
  },
  zoomPan: {
    scale: DEFAULT_ZOOM,
    offsetX: 0,
    offsetY: 0,
  },
  history: [],
  historyIndex: -1,
  isProcessing: false,
  processingMessage: '',
  downloadOptions: {
    format: 'png',
    quality: 90,
    scale: 1,
  },
};

export const useEditorStore = create<EditorState & EditorActions>((set, get) => ({
  ...initialState,

  setImage: (image: string, width: number, height: number) => {
    const entry: HistoryEntry = { image, label: 'Original' };
    set({
      originalImage: image,
      currentImage: image,
      imageWidth: width,
      imageHeight: height,
      history: [entry],
      historyIndex: 0,
      maskData: null,
      prompt: '',
    });
  },

  setCurrentImage: (image: string, label: string) => {
    const state = get();
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    const entry: HistoryEntry = { image, label };

    // Cap history size
    if (newHistory.length >= MAX_HISTORY_SIZE) {
      newHistory.shift();
    }
    newHistory.push(entry);

    set({
      currentImage: image,
      history: newHistory,
      historyIndex: newHistory.length - 1,
      maskData: null,
    });
  },

  setActiveTool: (tool: Tool | null) => {
    set({ activeTool: tool, maskData: null, prompt: '' });
  },

  setMaskData: (mask: string | null) => {
    set({ maskData: mask });
  },

  setPrompt: (prompt: string) => {
    set({ prompt });
  },

  setBackgroundMode: (mode: BackgroundMode) => {
    set({ backgroundMode: mode });
  },

  setBackgroundColor: (color: string) => {
    set({ backgroundColor: color });
  },

  setBackgroundImage: (image: string | null) => {
    set({ backgroundImage: image });
  },

  setBrushSettings: (settings: Partial<BrushSettings>) => {
    set((state) => ({
      brushSettings: { ...state.brushSettings, ...settings },
    }));
  },

  setZoomPan: (zoomPan: Partial<ZoomPan>) => {
    set((state) => ({
      zoomPan: { ...state.zoomPan, ...zoomPan },
    }));
  },

  setProcessing: (isProcessing: boolean, message?: string) => {
    set({ isProcessing, processingMessage: message || '' });
  },

  setDownloadOptions: (options: Partial<DownloadOptions>) => {
    set((state) => ({
      downloadOptions: { ...state.downloadOptions, ...options },
    }));
  },

  undo: () => {
    const state = get();
    if (state.historyIndex > 0) {
      const newIndex = state.historyIndex - 1;
      set({
        historyIndex: newIndex,
        currentImage: state.history[newIndex].image,
        maskData: null,
      });
    }
  },

  redo: () => {
    const state = get();
    if (state.historyIndex < state.history.length - 1) {
      const newIndex = state.historyIndex + 1;
      set({
        historyIndex: newIndex,
        currentImage: state.history[newIndex].image,
        maskData: null,
      });
    }
  },

  canUndo: () => {
    return get().historyIndex > 0;
  },

  canRedo: () => {
    const state = get();
    return state.historyIndex < state.history.length - 1;
  },

  reset: () => {
    set(initialState);
  },
}));
