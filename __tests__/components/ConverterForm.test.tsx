import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConverterForm from '@/components/converter/ConverterForm';
import type { OutputFormat, ConversionFile, FormatOption } from '@/types/converter';

const mockAddFiles = jest.fn();
const mockRemoveFile = jest.fn();
const mockClearFiles = jest.fn();
const mockSetOutputFormat = jest.fn();
const mockSetQuality = jest.fn();
const mockConvertAll = jest.fn();

interface HookReturn {
  files: ConversionFile[];
  outputFormat: OutputFormat;
  quality: number;
  isConverting: boolean;
  formatOption: FormatOption;
  addFiles: jest.Mock;
  removeFile: jest.Mock;
  clearFiles: jest.Mock;
  setOutputFormat: jest.Mock;
  setQuality: jest.Mock;
  convertAll: jest.Mock;
  reset: jest.Mock;
}

const defaultHookReturn: HookReturn = {
  files: [],
  outputFormat: 'jpeg',
  quality: 85,
  isConverting: false,
  formatOption: { id: 'jpeg', label: 'JPG', extension: 'jpg', mimeType: 'image/jpeg', supportsQuality: true },
  addFiles: mockAddFiles,
  removeFile: mockRemoveFile,
  clearFiles: mockClearFiles,
  setOutputFormat: mockSetOutputFormat,
  setQuality: mockSetQuality,
  convertAll: mockConvertAll,
  reset: jest.fn(),
};

let hookReturn: HookReturn = { ...defaultHookReturn };

jest.mock('@/hooks/useImageConverter', () => ({
  useImageConverter: () => hookReturn,
}));

describe('ConverterForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    hookReturn = { ...defaultHookReturn };
  });

  it('renders upload area', () => {
    render(<ConverterForm />);
    expect(screen.getByText('Drop images here or click to upload')).toBeInTheDocument();
  });

  it('renders format buttons', () => {
    render(<ConverterForm />);
    expect(screen.getByText('JPG')).toBeInTheDocument();
    expect(screen.getByText('PNG')).toBeInTheDocument();
    expect(screen.getByText('WebP')).toBeInTheDocument();
  });

  it('renders quality slider for JPG', () => {
    render(<ConverterForm />);
    expect(screen.getByText('Quality: 85%')).toBeInTheDocument();
    expect(screen.getByRole('slider')).toBeInTheDocument();
  });

  it('hides quality slider for PNG', () => {
    hookReturn = { ...defaultHookReturn, outputFormat: 'png' };
    render(<ConverterForm />);
    expect(screen.queryByRole('slider')).not.toBeInTheDocument();
  });

  it('calls setOutputFormat when format button clicked', async () => {
    const user = userEvent.setup();
    render(<ConverterForm />);
    await user.click(screen.getByText('WebP'));
    expect(mockSetOutputFormat).toHaveBeenCalledWith('webp');
  });

  it('disables convert button when no pending files', () => {
    render(<ConverterForm />);
    expect(screen.getByText('Convert All').closest('button')).toBeDisabled();
  });

  it('renders file list when files are present', () => {
    hookReturn = {
      ...defaultHookReturn,
      files: [
        {
          id: 'file-1',
          originalFile: new File(['data'], 'photo.png', { type: 'image/png' }),
          originalName: 'photo.png',
          originalSize: 1024,
          previewUrl: 'blob:preview',
          status: 'pending' as const,
          convertedBlob: null,
          convertedSize: null,
          convertedUrl: null,
          error: null,
        },
      ],
    };
    render(<ConverterForm />);
    expect(screen.getByText('photo.png')).toBeInTheDocument();
    expect(screen.getByText('1 file')).toBeInTheDocument();
  });

  it('renders download link for converted files', () => {
    hookReturn = {
      ...defaultHookReturn,
      files: [
        {
          id: 'file-1',
          originalFile: new File(['data'], 'photo.png', { type: 'image/png' }),
          originalName: 'photo.png',
          originalSize: 1024,
          previewUrl: 'blob:preview',
          status: 'done' as const,
          convertedBlob: new Blob(['converted']),
          convertedSize: 512,
          convertedUrl: 'blob:converted',
          error: null,
        },
      ],
    };
    render(<ConverterForm />);
    expect(screen.getByText('Download')).toBeInTheDocument();
  });
});
