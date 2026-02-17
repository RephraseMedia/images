'use client';

import { PRESENTATION_STYLE_OPTIONS } from '@/types/presentation';
import type { PresentationStyle } from '@/types/presentation';

interface StyleSelectorProps {
  value: PresentationStyle;
  onChange: (style: PresentationStyle) => void;
}

export default function StyleSelector({ value, onChange }: StyleSelectorProps) {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium">Template Style</label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {PRESENTATION_STYLE_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            title={option.description}
            onClick={() => onChange(option.id)}
            className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
              value === option.id
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border hover:border-primary/30 text-foreground'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
