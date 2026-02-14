'use client';

import { STYLE_OPTIONS, type ImageStyle } from '@/types/generator';

interface StyleSelectorProps {
  value: ImageStyle;
  onChange: (style: ImageStyle) => void;
}

export default function StyleSelector({ value, onChange }: StyleSelectorProps) {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium">Style</label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {STYLE_OPTIONS.map((style) => (
          <button
            key={style.id}
            onClick={() => onChange(style.id)}
            className={`px-3 py-2 text-sm rounded-lg border transition-colors text-center ${
              value === style.id
                ? 'border-primary bg-primary/10 text-primary font-medium'
                : 'border-border hover:border-primary/30 text-foreground'
            }`}
            type="button"
          >
            {style.label}
          </button>
        ))}
      </div>
    </div>
  );
}
