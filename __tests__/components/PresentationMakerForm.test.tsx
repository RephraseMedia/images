import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PresentationMakerForm from '@/components/presentation-maker/PresentationMakerForm';

const mockGenerate = jest.fn();
const mockSetTopic = jest.fn();
const mockSetSlideCount = jest.fn();
const mockSetStyle = jest.fn();
const mockReset = jest.fn();

jest.mock('@/hooks/usePresentationMaker', () => ({
  usePresentationMaker: () => ({
    topic: '',
    slideCount: 8,
    style: 'professional',
    isGenerating: false,
    presentation: null,
    error: null,
    setTopic: mockSetTopic,
    setSlideCount: mockSetSlideCount,
    setStyle: mockSetStyle,
    generate: mockGenerate,
    reset: mockReset,
  }),
}));

jest.mock('@/lib/presentationUtils', () => ({
  generatePPTX: jest.fn(),
  generatePDF: jest.fn(),
}));

describe('PresentationMakerForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders topic textarea', () => {
    render(<PresentationMakerForm />);
    expect(screen.getByLabelText('Presentation Topic')).toBeInTheDocument();
  });

  it('renders style selector with 5 options', () => {
    render(<PresentationMakerForm />);
    expect(screen.getByText('Professional')).toBeInTheDocument();
    expect(screen.getByText('Creative')).toBeInTheDocument();
    expect(screen.getByText('Minimal')).toBeInTheDocument();
    expect(screen.getByText('Bold')).toBeInTheDocument();
    expect(screen.getByText('Academic')).toBeInTheDocument();
  });

  it('renders slide count dropdown', () => {
    render(<PresentationMakerForm />);
    expect(screen.getByLabelText('Number of Slides')).toBeInTheDocument();
  });

  it('renders generate button', () => {
    render(<PresentationMakerForm />);
    expect(screen.getByRole('button', { name: /generate presentation/i })).toBeInTheDocument();
  });

  it('disables generate button when topic is empty', () => {
    render(<PresentationMakerForm />);
    expect(screen.getByRole('button', { name: /generate presentation/i })).toBeDisabled();
  });

  it('calls setTopic when typing', async () => {
    const user = userEvent.setup();
    render(<PresentationMakerForm />);
    const textarea = screen.getByLabelText('Presentation Topic');
    await user.type(textarea, 'A');
    expect(mockSetTopic).toHaveBeenCalled();
  });

  it('shows character count', () => {
    render(<PresentationMakerForm />);
    expect(screen.getByText('0/500')).toBeInTheDocument();
  });

  it('renders placeholder text', () => {
    render(<PresentationMakerForm />);
    expect(screen.getByPlaceholderText(/e\.g\./)).toBeInTheDocument();
  });
});
