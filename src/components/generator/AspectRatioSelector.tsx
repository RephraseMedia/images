'use client';

import { ASPECT_RATIO_OPTIONS, type AspectRatio } from '@/types/generator';

interface AspectRatioSelectorProps {
  value: AspectRatio;
  onChange: (ratio: AspectRatio) => void;
}

const ratioIcons: Record<AspectRatio, { w: number; h: number }> = {
  '1:1': { w: 20, h: 20 },
  '16:9': { w: 24, h: 14 },
  '9:16': { w: 14, h: 24 },
  '4:3': { w: 22, h: 17 },
  '3:4': { w: 17, h: 22 },
};

export default function AspectRatioSelector({ value, onChange }: AspectRatioSelectorProps) {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium">Aspect Ratio</label>
      <div className="flex gap-2">
        {ASPECT_RATIO_OPTIONS.map((option) => {
          const icon = ratioIcons[option.id];
          return (
            <button
              key={option.id}
              onClick={() => onChange(option.id)}
              className={`flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-lg border transition-colors ${
                value === option.id
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:border-primary/30 text-muted'
              }`}
              type="button"
              title={`${option.width} x ${option.height}px`}
            >
              <div
                className={`border-2 rounded-sm ${
                  value === option.id ? 'border-primary' : 'border-current'
                }`}
                style={{ width: icon.w, height: icon.h }}
              />
              <span className="text-xs font-medium">{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
