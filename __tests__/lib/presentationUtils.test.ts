import type { PresentationData } from '@/types/presentation';

const mockWriteFile = jest.fn().mockResolvedValue(undefined);
const mockAddSlide = jest.fn().mockReturnValue({
  background: {},
  addText: jest.fn(),
  addNotes: jest.fn(),
});

jest.mock('pptxgenjs', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      layout: '',
      addSlide: mockAddSlide,
      writeFile: mockWriteFile,
    })),
  };
});

const mockSave = jest.fn();
const mockAddPage = jest.fn();

jest.mock('jspdf', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      setFillColor: jest.fn(),
      rect: jest.fn(),
      setFont: jest.fn(),
      setFontSize: jest.fn(),
      setTextColor: jest.fn(),
      text: jest.fn(),
      addPage: mockAddPage,
      save: mockSave,
    })),
  };
});

import { generatePPTX, generatePDF, sanitizeFilename } from '@/lib/presentationUtils';

const mockPresentation: PresentationData = {
  title: 'Test Presentation',
  subtitle: 'A subtitle',
  slides: [
    {
      slideNumber: 1,
      title: 'Title',
      bullets: ['Subtitle text'],
      speakerNotes: 'Welcome',
      layout: 'title',
    },
    {
      slideNumber: 2,
      title: 'Content Slide',
      bullets: ['Point 1', 'Point 2'],
      speakerNotes: 'Talk about points',
      layout: 'content',
    },
    {
      slideNumber: 3,
      title: 'Conclusion',
      bullets: ['Summary'],
      speakerNotes: 'Wrap up',
      layout: 'conclusion',
    },
  ],
};

describe('presentationUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generatePPTX', () => {
    it('calls writeFile with correct filename', async () => {
      await generatePPTX(mockPresentation, 'professional');
      expect(mockWriteFile).toHaveBeenCalledWith({ fileName: 'Test_Presentation.pptx' });
    });

    it('creates slides for each slide in presentation', async () => {
      await generatePPTX(mockPresentation, 'professional');
      expect(mockAddSlide).toHaveBeenCalledTimes(3);
    });
  });

  describe('generatePDF', () => {
    it('calls save with correct filename', async () => {
      await generatePDF(mockPresentation, 'professional');
      expect(mockSave).toHaveBeenCalledWith('Test_Presentation.pdf');
    });

    it('adds pages for each slide after the first', async () => {
      await generatePDF(mockPresentation, 'professional');
      expect(mockAddPage).toHaveBeenCalledTimes(2);
    });
  });

  describe('sanitizeFilename', () => {
    it('replaces spaces with underscores', () => {
      expect(sanitizeFilename('My Presentation')).toBe('My_Presentation');
    });

    it('removes special characters', () => {
      expect(sanitizeFilename('Test: A/B!')).toBe('Test_AB');
    });

    it('returns default for empty string', () => {
      expect(sanitizeFilename('')).toBe('presentation');
    });
  });
});
