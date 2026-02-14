'use client';

import { Tool } from '@/types/editor';
import { useEditorStore } from '@/stores/editorStore';
import { useAiOperation } from '@/hooks/useAiOperation';
import Button from '@/components/ui/Button';
import BrushSettings from './BrushSettings';
import PromptInput from './PromptInput';
import BackgroundOptions from './BackgroundOptions';
import DownloadPanel from './DownloadPanel';
import { showToast } from '@/components/ui/Toast';

export default function ToolPanel() {
  const {
    activeTool,
    currentImage,
    maskData,
    prompt,
    backgroundMode,
    backgroundColor,
    backgroundImage,
    isProcessing,
  } = useEditorStore();

  const { execute } = useAiOperation();

  if (!activeTool) {
    return (
      <div className="w-72 border-l border-border p-4 flex items-center justify-center text-sm text-muted">
        Select a tool to get started
      </div>
    );
  }

  const handleEnhance = () => {
    if (!currentImage) return;
    execute({
      endpoint: '/api/enhance',
      body: { image: currentImage },
      label: 'Enhanced',
      processingMessage: 'Enhancing image...',
    });
  };

  const handleRemoveBackground = () => {
    if (!currentImage) return;
    execute({
      endpoint: '/api/remove-background',
      body: { image: currentImage },
      label: 'Background Removed',
      processingMessage: 'Removing background...',
    });
  };

  const handleGenerativeFill = () => {
    if (!currentImage || !maskData) {
      showToast('error', 'Please paint the area you want to fill');
      return;
    }
    if (!prompt.trim()) {
      showToast('error', 'Please enter a prompt describing what to generate');
      return;
    }
    execute({
      endpoint: '/api/generative-fill',
      body: { image: currentImage, mask: maskData, prompt },
      label: 'Generative Fill',
      processingMessage: 'Generating fill...',
    });
  };

  const handleRemoveObject = () => {
    if (!currentImage || !maskData) {
      showToast('error', 'Please paint over the object to remove');
      return;
    }
    execute({
      endpoint: '/api/remove-object',
      body: { image: currentImage, mask: maskData },
      label: 'Object Removed',
      processingMessage: 'Removing object...',
    });
  };

  const handleReplaceBackground = () => {
    if (!currentImage) return;

    const body: Record<string, unknown> = {
      image: currentImage,
      mode: backgroundMode,
    };

    if (backgroundMode === 'prompt') {
      if (!prompt.trim()) {
        showToast('error', 'Please enter a prompt for the new background');
        return;
      }
      body.prompt = prompt;
    } else if (backgroundMode === 'color') {
      body.color = backgroundColor;
    } else if (backgroundMode === 'upload') {
      if (!backgroundImage) {
        showToast('error', 'Please upload a background image');
        return;
      }
      body.backgroundImage = backgroundImage;
    }

    execute({
      endpoint: '/api/replace-background',
      body,
      label: 'Background Replaced',
      processingMessage: 'Replacing background...',
    });
  };

  const panelContent: Record<string, React.ReactNode> = {
    [Tool.Enhance]: (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted">
          Upscale and enhance your image using AI. Works great for improving clarity and sharpening details.
        </p>
        <Button onClick={handleEnhance} loading={isProcessing} className="w-full">
          Enhance Image
        </Button>
      </div>
    ),
    [Tool.RemoveBackground]: (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted">
          Remove the background from your image with one click. The result will have a transparent background.
        </p>
        <Button onClick={handleRemoveBackground} loading={isProcessing} className="w-full">
          Remove Background
        </Button>
      </div>
    ),
    [Tool.ReplaceBackground]: (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted">
          Replace the background with an AI-generated scene, solid color, or your own image.
        </p>
        <BackgroundOptions />
        <Button onClick={handleReplaceBackground} loading={isProcessing} className="w-full">
          Replace Background
        </Button>
      </div>
    ),
    [Tool.GenerativeFill]: (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted">
          Paint over an area, describe what you want, and AI will fill it in.
        </p>
        <BrushSettings />
        <PromptInput placeholder="Describe what to fill in..." />
        <Button onClick={handleGenerativeFill} loading={isProcessing} className="w-full">
          Generate Fill
        </Button>
      </div>
    ),
    [Tool.RemoveObject]: (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted">
          Paint over any unwanted object and AI will remove it, filling in the background naturally.
        </p>
        <BrushSettings />
        <Button onClick={handleRemoveObject} loading={isProcessing} className="w-full">
          Remove Object
        </Button>
      </div>
    ),
    [Tool.Download]: (
      <div className="flex flex-col gap-4">
        <DownloadPanel />
      </div>
    ),
  };

  const titles: Record<string, string> = {
    [Tool.Enhance]: 'AI Enhance',
    [Tool.RemoveBackground]: 'Remove Background',
    [Tool.ReplaceBackground]: 'Replace Background',
    [Tool.GenerativeFill]: 'Generative Fill',
    [Tool.RemoveObject]: 'Remove Object',
    [Tool.Download]: 'Download',
  };

  return (
    <div className="w-72 border-l border-border p-4 overflow-y-auto">
      <h3 className="font-semibold mb-4">{titles[activeTool]}</h3>
      {panelContent[activeTool]}
    </div>
  );
}
