import { render, screen } from '@testing-library/react';
import ProcessingOverlay from '@/components/editor/ProcessingOverlay';

// Mock the zustand store properly
const mockState = {
  isProcessing: false,
  processingMessage: '',
};

jest.mock('@/stores/editorStore', () => ({
  useEditorStore: (selector?: (state: Record<string, unknown>) => unknown) => {
    if (typeof selector === 'function') {
      return selector(mockState);
    }
    return mockState;
  },
}));

describe('ProcessingOverlay', () => {
  beforeEach(() => {
    mockState.isProcessing = false;
    mockState.processingMessage = '';
  });

  it('renders nothing when not processing', () => {
    const { container } = render(<ProcessingOverlay />);
    expect(container.firstChild).toBeNull();
  });

  it('renders overlay when processing', () => {
    mockState.isProcessing = true;
    mockState.processingMessage = 'Enhancing...';

    render(<ProcessingOverlay />);
    expect(screen.getByText('Enhancing...')).toBeInTheDocument();
  });

  it('shows default message when no custom message', () => {
    mockState.isProcessing = true;
    mockState.processingMessage = '';

    render(<ProcessingOverlay />);
    expect(screen.getByText('Processing...')).toBeInTheDocument();
  });
});
