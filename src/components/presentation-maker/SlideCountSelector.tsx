'use client';

import { SLIDE_COUNT_OPTIONS } from '@/types/presentation';

interface SlideCountSelectorProps {
  value: number;
  onChange: (count: number) => void;
}

export default function SlideCountSelector({ value, onChange }: SlideCountSelectorProps) {
  return (
    <div className="flex flex-col gap-3">
      <label htmlFor="slide-count" className="text-sm font-medium">
        Number of Slides
      </label>
      <select
        id="slide-count"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full px-4 py-2.5 text-sm border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {SLIDE_COUNT_OPTIONS.map((count) => (
          <option key={count} value={count}>
            {count} slides
          </option>
        ))}
      </select>
    </div>
  );
}
