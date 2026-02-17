export type PresentationStyle = 'professional' | 'creative' | 'minimal' | 'bold' | 'academic';

export interface PresentationStyleOption {
  id: PresentationStyle;
  label: string;
  description: string;
}

export const PRESENTATION_STYLE_OPTIONS: PresentationStyleOption[] = [
  { id: 'professional', label: 'Professional', description: 'Clean and corporate with a polished look' },
  { id: 'creative', label: 'Creative', description: 'Vibrant and artistic with bold visuals' },
  { id: 'minimal', label: 'Minimal', description: 'Simple and elegant with plenty of white space' },
  { id: 'bold', label: 'Bold', description: 'High contrast with strong typography' },
  { id: 'academic', label: 'Academic', description: 'Structured and formal for research and education' },
];

export interface SlideData {
  slideNumber: number;
  title: string;
  bullets: string[];
  speakerNotes: string;
  layout: 'title' | 'content' | 'section' | 'conclusion';
}

export interface PresentationData {
  title: string;
  subtitle: string;
  slides: SlideData[];
}

export interface PresentationMakerState {
  topic: string;
  slideCount: number;
  style: PresentationStyle;
  isGenerating: boolean;
  presentation: PresentationData | null;
  error: string | null;
}

export interface GeneratePresentationRequest {
  topic: string;
  slideCount: number;
  style: PresentationStyle;
}

export interface GeneratePresentationResponse {
  presentation: PresentationData;
}

export const MIN_SLIDES = 5;
export const MAX_SLIDES = 15;
export const SLIDE_COUNT_OPTIONS = Array.from(
  { length: MAX_SLIDES - MIN_SLIDES + 1 },
  (_, i) => i + MIN_SLIDES
);

export interface StyleTheme {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  fontFamily: string;
  titleFontSize: number;
  bodyFontSize: number;
  bulletFontSize: number;
}

export const STYLE_THEMES: Record<PresentationStyle, StyleTheme> = {
  professional: {
    primaryColor: '#1a365d',
    secondaryColor: '#2b6cb0',
    backgroundColor: '#ffffff',
    textColor: '#1a202c',
    accentColor: '#3182ce',
    fontFamily: 'Arial',
    titleFontSize: 36,
    bodyFontSize: 18,
    bulletFontSize: 16,
  },
  creative: {
    primaryColor: '#6b21a8',
    secondaryColor: '#9333ea',
    backgroundColor: '#faf5ff',
    textColor: '#1c1917',
    accentColor: '#a855f7',
    fontFamily: 'Georgia',
    titleFontSize: 40,
    bodyFontSize: 18,
    bulletFontSize: 16,
  },
  minimal: {
    primaryColor: '#18181b',
    secondaryColor: '#71717a',
    backgroundColor: '#ffffff',
    textColor: '#27272a',
    accentColor: '#a1a1aa',
    fontFamily: 'Helvetica',
    titleFontSize: 34,
    bodyFontSize: 18,
    bulletFontSize: 16,
  },
  bold: {
    primaryColor: '#dc2626',
    secondaryColor: '#f59e0b',
    backgroundColor: '#0f172a',
    textColor: '#f8fafc',
    accentColor: '#ef4444',
    fontFamily: 'Arial Black',
    titleFontSize: 42,
    bodyFontSize: 20,
    bulletFontSize: 18,
  },
  academic: {
    primaryColor: '#1e3a5f',
    secondaryColor: '#2563eb',
    backgroundColor: '#f8fafc',
    textColor: '#0f172a',
    accentColor: '#3b82f6',
    fontFamily: 'Times New Roman',
    titleFontSize: 32,
    bodyFontSize: 18,
    bulletFontSize: 16,
  },
};
