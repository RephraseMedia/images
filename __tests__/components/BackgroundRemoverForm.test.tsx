import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BackgroundRemoverForm from '@/components/background-remover/BackgroundRemoverForm';
import type { BackgroundRemoverState } from '@/types/backgroundRemover';

const mockSetFile = jest.fn();
const mockRemoveBackground = jest.fn();
const mockSetBackgroundColor = jest.fn();
const mockDownloadResult = jest.fn();
const mockReset = jest.fn();

interface HookReturn extends BackgroundRemoverState {
  setFile: jest.Mock;
  removeBackground: jest.Mock;
  setBackgroundColor: jest.Mock;
  downloadResult: jest.Mock;
  reset: jest.Mock;
}

const defaultHookReturn: HookReturn = {
  sourceFile: null,
  sourcePreview: null,
  status: 'idle',
  resultImage: null,
  backgroundColor: null,
  error: null,
  setFile: mockSetFile,
  removeBackground: mockRemoveBackground,
  setBackgroundColor: mockSetBackgroundColor,
  downloadResult: mockDownloadResult,
  reset: mockReset,
};

let hookReturn: HookReturn = { ...defaultHookReturn };

jest.mock('@/hooks/useBackgroundRemover', () => ({
  useBackgroundRemover: () => hookReturn,
}));

describe('BackgroundRemoverForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    hookReturn = { ...defaultHookReturn };
  });

  it('renders upload area in idle state', () => {
    render(<BackgroundRemoverForm />);
    expect(screen.getByText('Drop an image here or click to upload')).toBeInTheDocument();
  });

  it('renders remove button when file is selected', () => {
    hookReturn = {
      ...defaultHookReturn,
      sourceFile: new File(['data'], 'photo.png', { type: 'image/png' }),
      sourcePreview: 'blob:preview',
    };
    render(<BackgroundRemoverForm />);
    expect(screen.getByText('photo.png')).toBeInTheDocument();
    expect(screen.getByText('Remove Background')).toBeInTheDocument();
  });

  it('renders spinner during processing', () => {
    hookReturn = {
      ...defaultHookReturn,
      sourceFile: new File(['data'], 'photo.png', { type: 'image/png' }),
      sourcePreview: 'blob:preview',
      status: 'processing',
    };
    render(<BackgroundRemoverForm />);
    expect(screen.getByText('Removing background...')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders uploading message during upload', () => {
    hookReturn = {
      ...defaultHookReturn,
      sourceFile: new File(['data'], 'photo.png', { type: 'image/png' }),
      sourcePreview: 'blob:preview',
      status: 'uploading',
    };
    render(<BackgroundRemoverForm />);
    expect(screen.getByText('Uploading image...')).toBeInTheDocument();
  });

  it('renders result image with checkerboard when done', () => {
    hookReturn = {
      ...defaultHookReturn,
      sourceFile: new File(['data'], 'photo.png', { type: 'image/png' }),
      sourcePreview: 'blob:preview',
      status: 'done',
      resultImage: 'data:image/png;base64,result',
    };
    render(<BackgroundRemoverForm />);
    const img = screen.getByAltText('Background removed result');
    expect(img).toBeInTheDocument();
    expect(img.closest('div')).toHaveClass('checkerboard');
  });

  it('renders background color options when done', () => {
    hookReturn = {
      ...defaultHookReturn,
      sourceFile: new File(['data'], 'photo.png', { type: 'image/png' }),
      sourcePreview: 'blob:preview',
      status: 'done',
      resultImage: 'data:image/png;base64,result',
    };
    render(<BackgroundRemoverForm />);
    expect(screen.getByText('Transparent')).toBeInTheDocument();
    expect(screen.getByText('White')).toBeInTheDocument();
    expect(screen.getByText('Black')).toBeInTheDocument();
    expect(screen.getByText('Custom')).toBeInTheDocument();
  });

  it('renders download button when done', () => {
    hookReturn = {
      ...defaultHookReturn,
      sourceFile: new File(['data'], 'photo.png', { type: 'image/png' }),
      sourcePreview: 'blob:preview',
      status: 'done',
      resultImage: 'data:image/png;base64,result',
    };
    render(<BackgroundRemoverForm />);
    expect(screen.getByText('Download PNG')).toBeInTheDocument();
  });

  it('renders error state with try again button', () => {
    hookReturn = {
      ...defaultHookReturn,
      sourceFile: new File(['data'], 'photo.png', { type: 'image/png' }),
      sourcePreview: 'blob:preview',
      status: 'error',
      error: 'Something went wrong',
    };
    render(<BackgroundRemoverForm />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('calls removeBackground when remove button clicked', async () => {
    const user = userEvent.setup();
    hookReturn = {
      ...defaultHookReturn,
      sourceFile: new File(['data'], 'photo.png', { type: 'image/png' }),
      sourcePreview: 'blob:preview',
    };
    render(<BackgroundRemoverForm />);
    await user.click(screen.getByText('Remove Background'));
    expect(mockRemoveBackground).toHaveBeenCalled();
  });

  it('calls downloadResult when download button clicked', async () => {
    const user = userEvent.setup();
    hookReturn = {
      ...defaultHookReturn,
      sourceFile: new File(['data'], 'photo.png', { type: 'image/png' }),
      sourcePreview: 'blob:preview',
      status: 'done',
      resultImage: 'data:image/png;base64,result',
    };
    render(<BackgroundRemoverForm />);
    await user.click(screen.getByText('Download PNG'));
    expect(mockDownloadResult).toHaveBeenCalled();
  });

  it('calls reset when remove another button clicked', async () => {
    const user = userEvent.setup();
    hookReturn = {
      ...defaultHookReturn,
      sourceFile: new File(['data'], 'photo.png', { type: 'image/png' }),
      sourcePreview: 'blob:preview',
      status: 'done',
      resultImage: 'data:image/png;base64,result',
    };
    render(<BackgroundRemoverForm />);
    await user.click(screen.getByText('Remove Another'));
    expect(mockReset).toHaveBeenCalled();
  });

  it('calls setBackgroundColor when color option clicked', async () => {
    const user = userEvent.setup();
    hookReturn = {
      ...defaultHookReturn,
      sourceFile: new File(['data'], 'photo.png', { type: 'image/png' }),
      sourcePreview: 'blob:preview',
      status: 'done',
      resultImage: 'data:image/png;base64,result',
    };
    render(<BackgroundRemoverForm />);
    await user.click(screen.getByText('White'));
    expect(mockSetBackgroundColor).toHaveBeenCalledWith('#ffffff');
  });
});
