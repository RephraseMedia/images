'use client';

import { useEditorStore } from '@/stores/editorStore';
import type { BackgroundMode } from '@/types/editor';
import ColorPicker from '@/components/ui/ColorPicker';
import PromptInput from './PromptInput';
import DropZone from '@/components/ui/DropZone';

const modes: { id: BackgroundMode; label: string }[] = [
  { id: 'prompt', label: 'AI Prompt' },
  { id: 'color', label: 'Solid Color' },
  { id: 'upload', label: 'Upload Image' },
];

export default function BackgroundOptions() {
  const {
    backgroundMode,
    setBackgroundMode,
    backgroundColor,
    setBackgroundColor,
    setBackgroundImage,
  } = useEditorStore();

  const handleBgUpload = async (files: File[]) => {
    if (files.length === 0) return;
    const reader = new FileReader();
    reader.onload = () => {
      setBackgroundImage(reader.result as string);
    };
    reader.readAsDataURL(files[0]);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-1 p-1 bg-secondary rounded-lg">
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => setBackgroundMode(mode.id)}
            className={`flex-1 px-2 py-1.5 text-xs rounded-md transition-colors ${
              backgroundMode === mode.id
                ? 'bg-background shadow-sm font-medium'
                : 'text-muted hover:text-foreground'
            }`}
          >
            {mode.label}
          </button>
        ))}
      </div>

      {backgroundMode === 'prompt' && (
        <PromptInput placeholder="Describe the new background..." />
      )}

      {backgroundMode === 'color' && (
        <ColorPicker value={backgroundColor} onChange={setBackgroundColor} />
      )}

      {backgroundMode === 'upload' && (
        <DropZone
          onFiles={handleBgUpload}
          accept="image/*"
          className="border-2 border-dashed rounded-lg p-6 text-center"
        >
          <p className="text-sm text-muted">Drop background image or click to browse</p>
        </DropZone>
      )}
    </div>
  );
}
