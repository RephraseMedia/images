import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ImageResults from '@/components/generator/ImageResults';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockSetImage = jest.fn();
jest.mock('@/stores/editorStore', () => ({
  useEditorStore: (selector?: (state: Record<string, unknown>) => unknown) => {
    const state = { setImage: mockSetImage };
    if (typeof selector === 'function') return selector(state);
    return state;
  },
}));

jest.mock('@/components/ui/Toast', () => ({
  showToast: jest.fn(),
}));

describe('ImageResults', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when no images', () => {
    const { container } = render(<ImageResults images={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders heading when images are present', () => {
    render(<ImageResults images={['data:image/png;base64,abc']} />);
    expect(screen.getByText('Generated Images')).toBeInTheDocument();
  });

  it('renders all images', () => {
    const images = [
      'data:image/png;base64,img1',
      'data:image/png;base64,img2',
      'data:image/png;base64,img3',
    ];
    render(<ImageResults images={images} />);
    const imgElements = screen.getAllByRole('img');
    expect(imgElements).toHaveLength(3);
  });

  it('sets correct alt text on images', () => {
    render(<ImageResults images={['data:image/png;base64,abc']} />);
    expect(screen.getByAltText('Generated image 1')).toBeInTheDocument();
  });

  it('renders download buttons for each image', () => {
    render(<ImageResults images={['data:image/png;base64,abc', 'data:image/png;base64,def']} />);
    const downloadButtons = screen.getAllByText('Download');
    expect(downloadButtons).toHaveLength(2);
  });

  it('renders edit buttons for each image', () => {
    render(<ImageResults images={['data:image/png;base64,abc', 'data:image/png;base64,def']} />);
    const editButtons = screen.getAllByText('Edit');
    expect(editButtons).toHaveLength(2);
  });

  it('triggers download on click', async () => {
    const user = userEvent.setup();

    const mockClick = jest.fn();
    const originalCreateElement = document.createElement.bind(document);
    jest.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'a') {
        const link = originalCreateElement('a');
        link.click = mockClick;
        return link;
      }
      return originalCreateElement(tagName);
    });

    render(<ImageResults images={['data:image/png;base64,abc']} />);
    await user.click(screen.getByText('Download'));
    expect(mockClick).toHaveBeenCalled();

    jest.restoreAllMocks();
  });

  it('uses single-column layout for one image', () => {
    const { container } = render(<ImageResults images={['data:image/png;base64,abc']} />);
    const grid = container.querySelector('.grid');
    expect(grid?.className).toContain('grid-cols-1');
    expect(grid?.className).toContain('max-w-lg');
  });

  it('uses two-column layout for multiple images', () => {
    const { container } = render(
      <ImageResults images={['data:image/png;base64,a', 'data:image/png;base64,b']} />
    );
    const grid = container.querySelector('.grid');
    expect(grid?.className).toContain('sm:grid-cols-2');
  });
});
