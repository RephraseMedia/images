import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ZoomControls from '@/components/editor/ZoomControls';

const mockSetZoomPan = jest.fn();

const mockState = {
  zoomPan: { scale: 1, offsetX: 0, offsetY: 0 },
  setZoomPan: mockSetZoomPan,
};

jest.mock('@/stores/editorStore', () => ({
  useEditorStore: (selector?: (state: Record<string, unknown>) => unknown) => {
    if (typeof selector === 'function') {
      return selector(mockState);
    }
    return mockState;
  },
}));

describe('ZoomControls', () => {
  beforeEach(() => {
    mockSetZoomPan.mockClear();
    mockState.zoomPan = { scale: 1, offsetX: 0, offsetY: 0 };
  });

  it('displays current zoom percentage', () => {
    render(<ZoomControls />);
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('has zoom in and zoom out buttons', () => {
    render(<ZoomControls />);
    expect(screen.getByTitle('Zoom in (+)')).toBeInTheDocument();
    expect(screen.getByTitle('Zoom out (-)')).toBeInTheDocument();
  });

  it('calls setZoomPan when zoom in is clicked', async () => {
    const user = userEvent.setup();
    render(<ZoomControls />);
    await user.click(screen.getByTitle('Zoom in (+)'));
    expect(mockSetZoomPan).toHaveBeenCalled();
  });
});
