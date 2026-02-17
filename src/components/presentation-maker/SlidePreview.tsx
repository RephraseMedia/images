'use client';

import { useState } from 'react';
import type { PresentationData, PresentationStyle, SlideData } from '@/types/presentation';
import { STYLE_THEMES } from '@/types/presentation';

interface SlidePreviewProps {
  presentation: PresentationData;
  style: PresentationStyle;
}

function TitleSlidePreview({ slide, style }: { slide: SlideData; style: PresentationStyle }) {
  const theme = STYLE_THEMES[style];
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center p-8"
      style={{ backgroundColor: theme.primaryColor }}
    >
      <h2
        className="font-bold text-center mb-4"
        style={{ color: '#ffffff', fontSize: `${theme.titleFontSize * 0.6}px`, fontFamily: theme.fontFamily }}
      >
        {slide.title}
      </h2>
      {slide.bullets.length > 0 && (
        <p
          className="text-center"
          style={{ color: '#ffffffcc', fontSize: `${theme.bodyFontSize * 0.6}px`, fontFamily: theme.fontFamily }}
        >
          {slide.bullets[0]}
        </p>
      )}
    </div>
  );
}

function ContentSlidePreview({ slide, style }: { slide: SlideData; style: PresentationStyle }) {
  const theme = STYLE_THEMES[style];
  return (
    <div
      className="w-full h-full flex flex-col p-6"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <h3
        className="font-bold mb-4"
        style={{ color: theme.primaryColor, fontSize: `${theme.titleFontSize * 0.45}px`, fontFamily: theme.fontFamily }}
      >
        {slide.title}
      </h3>
      <ul className="space-y-2 flex-1">
        {slide.bullets.map((bullet, i) => (
          <li
            key={i}
            className="flex gap-2"
            style={{ color: theme.textColor, fontSize: `${theme.bulletFontSize * 0.55}px`, fontFamily: theme.fontFamily }}
          >
            <span style={{ color: theme.accentColor }}>&#8226;</span>
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SectionSlidePreview({ slide, style }: { slide: SlideData; style: PresentationStyle }) {
  const theme = STYLE_THEMES[style];
  return (
    <div
      className="w-full h-full flex items-center justify-center p-8"
      style={{ backgroundColor: theme.secondaryColor }}
    >
      <h2
        className="font-bold text-center"
        style={{ color: '#ffffff', fontSize: `${theme.titleFontSize * 0.55}px`, fontFamily: theme.fontFamily }}
      >
        {slide.title}
      </h2>
    </div>
  );
}

function SlideRenderer({ slide, style }: { slide: SlideData; style: PresentationStyle }) {
  switch (slide.layout) {
    case 'title':
      return <TitleSlidePreview slide={slide} style={style} />;
    case 'section':
      return <SectionSlidePreview slide={slide} style={style} />;
    case 'conclusion':
      return <TitleSlidePreview slide={slide} style={style} />;
    default:
      return <ContentSlidePreview slide={slide} style={style} />;
  }
}

export default function SlidePreview({ presentation, style }: SlidePreviewProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slide = presentation.slides[currentSlide];

  return (
    <div className="flex flex-col gap-4">
      {/* Main slide preview */}
      <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
        <div className="absolute inset-0 rounded-xl overflow-hidden border border-border shadow-lg">
          <SlideRenderer slide={slide} style={style} />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentSlide((prev) => prev - 1)}
          disabled={currentSlide === 0}
          className="px-3 py-1.5 text-sm rounded-lg border border-border hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        <span className="text-sm text-muted">
          Slide {currentSlide + 1} of {presentation.slides.length}
        </span>
        <button
          onClick={() => setCurrentSlide((prev) => prev + 1)}
          disabled={currentSlide === presentation.slides.length - 1}
          className="px-3 py-1.5 text-sm rounded-lg border border-border hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>

      {/* Thumbnail strip */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {presentation.slides.map((s, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`shrink-0 w-24 rounded-md overflow-hidden border-2 transition-colors ${
              index === currentSlide ? 'border-primary' : 'border-border hover:border-primary/30'
            }`}
            style={{ aspectRatio: '16/9' }}
          >
            <div className="w-full h-full transform scale-100 origin-top-left" style={{ fontSize: '4px' }}>
              <SlideRenderer slide={s} style={style} />
            </div>
          </button>
        ))}
      </div>

      {/* Speaker notes */}
      {slide.speakerNotes && (
        <div className="p-4 rounded-xl border border-border bg-secondary/30">
          <h4 className="text-xs font-medium text-muted mb-1">Speaker Notes</h4>
          <p className="text-sm">{slide.speakerNotes}</p>
        </div>
      )}
    </div>
  );
}
