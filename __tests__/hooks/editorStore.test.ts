import { useEditorStore } from '@/stores/editorStore';
import { Tool } from '@/types/editor';
import { MAX_HISTORY_SIZE } from '@/lib/constants';

describe('editorStore', () => {
  beforeEach(() => {
    useEditorStore.getState().reset();
  });

  it('initializes with default state', () => {
    const state = useEditorStore.getState();
    expect(state.currentImage).toBeNull();
    expect(state.activeTool).toBeNull();
    expect(state.isProcessing).toBe(false);
    expect(state.history).toEqual([]);
    expect(state.historyIndex).toBe(-1);
  });

  it('sets image and initializes history', () => {
    const store = useEditorStore.getState();
    store.setImage('base64image', 800, 600);

    const state = useEditorStore.getState();
    expect(state.currentImage).toBe('base64image');
    expect(state.originalImage).toBe('base64image');
    expect(state.imageWidth).toBe(800);
    expect(state.imageHeight).toBe(600);
    expect(state.history).toHaveLength(1);
    expect(state.historyIndex).toBe(0);
  });

  it('sets current image and updates history', () => {
    const store = useEditorStore.getState();
    store.setImage('original', 100, 100);
    store.setCurrentImage('enhanced', 'Enhanced');

    const state = useEditorStore.getState();
    expect(state.currentImage).toBe('enhanced');
    expect(state.history).toHaveLength(2);
    expect(state.historyIndex).toBe(1);
    expect(state.history[1].label).toBe('Enhanced');
  });

  it('handles undo and redo', () => {
    const store = useEditorStore.getState();
    store.setImage('original', 100, 100);
    store.setCurrentImage('enhanced', 'Enhanced');

    store.undo();
    expect(useEditorStore.getState().currentImage).toBe('original');
    expect(useEditorStore.getState().historyIndex).toBe(0);

    store.redo();
    expect(useEditorStore.getState().currentImage).toBe('enhanced');
    expect(useEditorStore.getState().historyIndex).toBe(1);
  });

  it('canUndo and canRedo work correctly', () => {
    const store = useEditorStore.getState();
    expect(store.canUndo()).toBe(false);
    expect(store.canRedo()).toBe(false);

    store.setImage('original', 100, 100);
    expect(store.canUndo()).toBe(false);

    store.setCurrentImage('enhanced', 'Enhanced');
    expect(useEditorStore.getState().canUndo()).toBe(true);
    expect(useEditorStore.getState().canRedo()).toBe(false);

    useEditorStore.getState().undo();
    expect(useEditorStore.getState().canRedo()).toBe(true);
  });

  it('caps history at MAX_HISTORY_SIZE', () => {
    const store = useEditorStore.getState();
    store.setImage('original', 100, 100);

    for (let i = 0; i < MAX_HISTORY_SIZE + 5; i++) {
      useEditorStore.getState().setCurrentImage(`image-${i}`, `Step ${i}`);
    }

    expect(useEditorStore.getState().history.length).toBeLessThanOrEqual(MAX_HISTORY_SIZE);
  });

  it('truncates future history on new edit after undo', () => {
    const store = useEditorStore.getState();
    store.setImage('original', 100, 100);
    store.setCurrentImage('v1', 'V1');
    store.setCurrentImage('v2', 'V2');

    useEditorStore.getState().undo();
    useEditorStore.getState().setCurrentImage('v3', 'V3');

    const state = useEditorStore.getState();
    expect(state.history).toHaveLength(3); // original, v1, v3
    expect(state.currentImage).toBe('v3');
  });

  it('sets active tool and clears mask/prompt', () => {
    const store = useEditorStore.getState();
    store.setMaskData('somemask');
    store.setPrompt('some prompt');
    store.setActiveTool(Tool.Enhance);

    const state = useEditorStore.getState();
    expect(state.activeTool).toBe(Tool.Enhance);
    expect(state.maskData).toBeNull();
    expect(state.prompt).toBe('');
  });

  it('sets processing state', () => {
    const store = useEditorStore.getState();
    store.setProcessing(true, 'Working...');

    expect(useEditorStore.getState().isProcessing).toBe(true);
    expect(useEditorStore.getState().processingMessage).toBe('Working...');

    store.setProcessing(false);
    expect(useEditorStore.getState().isProcessing).toBe(false);
  });

  it('resets to initial state', () => {
    const store = useEditorStore.getState();
    store.setImage('img', 100, 100);
    store.setActiveTool(Tool.Enhance);
    store.setProcessing(true);

    store.reset();

    const state = useEditorStore.getState();
    expect(state.currentImage).toBeNull();
    expect(state.activeTool).toBeNull();
    expect(state.isProcessing).toBe(false);
  });

  it('sets download options', () => {
    const store = useEditorStore.getState();
    store.setDownloadOptions({ format: 'jpeg', quality: 80 });

    const state = useEditorStore.getState();
    expect(state.downloadOptions.format).toBe('jpeg');
    expect(state.downloadOptions.quality).toBe(80);
    expect(state.downloadOptions.scale).toBe(1); // unchanged
  });

  it('sets brush settings', () => {
    const store = useEditorStore.getState();
    store.setBrushSettings({ size: 50 });

    const state = useEditorStore.getState();
    expect(state.brushSettings.size).toBe(50);
    expect(state.brushSettings.opacity).toBe(1); // unchanged
  });
});
