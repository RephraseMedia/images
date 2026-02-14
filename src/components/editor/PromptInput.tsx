'use client';

import { useEditorStore } from '@/stores/editorStore';

interface PromptInputProps {
  placeholder?: string;
}

export default function PromptInput({ placeholder = 'Describe what to generate...' }: PromptInputProps) {
  const { prompt, setPrompt } = useEditorStore();

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium text-muted uppercase tracking-wide">
        Prompt
      </label>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder={placeholder}
        rows={3}
        maxLength={500}
        className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <span className="text-xs text-muted text-right">{prompt.length}/500</span>
    </div>
  );
}
