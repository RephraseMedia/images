import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GeneratorForm from '@/components/generator/GeneratorForm';

const mockGenerate = jest.fn();
const mockSetPrompt = jest.fn();
const mockSetStyle = jest.fn();
const mockSetAspectRatio = jest.fn();
const mockSetNumberOfImages = jest.fn();

jest.mock('@/hooks/useImageGenerator', () => ({
  useImageGenerator: () => ({
    prompt: '',
    style: 'none',
    aspectRatio: '1:1',
    numberOfImages: 1,
    isGenerating: false,
    generatedImages: [],
    setPrompt: mockSetPrompt,
    setStyle: mockSetStyle,
    setAspectRatio: mockSetAspectRatio,
    setNumberOfImages: mockSetNumberOfImages,
    generate: mockGenerate,
  }),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('@/stores/editorStore', () => ({
  useEditorStore: (selector?: (state: Record<string, unknown>) => unknown) => {
    const state = { setImage: jest.fn() };
    if (typeof selector === 'function') return selector(state);
    return state;
  },
}));

jest.mock('@/components/ui/Toast', () => ({
  showToast: jest.fn(),
}));

describe('GeneratorForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders prompt textarea', () => {
    render(<GeneratorForm />);
    expect(screen.getByLabelText('Describe your image')).toBeInTheDocument();
  });

  it('renders style selector', () => {
    render(<GeneratorForm />);
    expect(screen.getByText('Style')).toBeInTheDocument();
  });

  it('renders aspect ratio selector', () => {
    render(<GeneratorForm />);
    expect(screen.getByText('Aspect Ratio')).toBeInTheDocument();
  });

  it('renders number of images selector', () => {
    render(<GeneratorForm />);
    expect(screen.getByText('Number of Images')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('renders generate button', () => {
    render(<GeneratorForm />);
    expect(screen.getByText('Generate Image')).toBeInTheDocument();
  });

  it('disables generate button when prompt is empty', () => {
    render(<GeneratorForm />);
    expect(screen.getByText('Generate Image').closest('button')).toBeDisabled();
  });

  it('calls setPrompt on textarea input', async () => {
    const user = userEvent.setup();
    render(<GeneratorForm />);
    const textarea = screen.getByLabelText('Describe your image');
    await user.type(textarea, 'hello');
    expect(mockSetPrompt).toHaveBeenCalled();
  });

  it('calls setNumberOfImages when number button clicked', async () => {
    const user = userEvent.setup();
    render(<GeneratorForm />);
    await user.click(screen.getByText('3'));
    expect(mockSetNumberOfImages).toHaveBeenCalledWith(3);
  });

  it('shows character count', () => {
    render(<GeneratorForm />);
    expect(screen.getByText('0/1000')).toBeInTheDocument();
  });

  it('shows placeholder text', () => {
    render(<GeneratorForm />);
    const textarea = screen.getByPlaceholderText(/serene mountain/);
    expect(textarea).toBeInTheDocument();
  });
});
