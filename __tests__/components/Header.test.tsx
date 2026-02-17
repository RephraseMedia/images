import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from '@/components/layout/Header';

describe('Header', () => {
  it('renders logo text', () => {
    render(<Header />);
    expect(screen.getByText('AI Image Editor')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Header />);
    expect(screen.getByText('Editor')).toBeInTheDocument();
    expect(screen.getByText('Generator')).toBeInTheDocument();
    expect(screen.getByText('Converter')).toBeInTheDocument();
  });

  it('links to correct pages', () => {
    render(<Header />);
    const editorLink = screen.getByText('Editor').closest('a');
    expect(editorLink).toHaveAttribute('href', '/');
    const generatorLink = screen.getByText('Generator').closest('a');
    expect(generatorLink).toHaveAttribute('href', '/generator');
    const converterLink = screen.getByText('Converter').closest('a');
    expect(converterLink).toHaveAttribute('href', '/converter');
  });

  it('renders New Image button in editor mode', () => {
    render(<Header showEditor onNewImage={jest.fn()} />);
    expect(screen.getByText('New Image')).toBeInTheDocument();
  });

  it('does not render New Image button on landing page', () => {
    render(<Header />);
    expect(screen.queryByText('New Image')).not.toBeInTheDocument();
  });

  it('calls onNewImage when clicked', async () => {
    const user = userEvent.setup();
    const handleNew = jest.fn();
    render(<Header showEditor onNewImage={handleNew} />);
    await user.click(screen.getByText('New Image'));
    expect(handleNew).toHaveBeenCalled();
  });

  it('renders children', () => {
    render(
      <Header>
        <span>Child</span>
      </Header>
    );
    expect(screen.getByText('Child')).toBeInTheDocument();
  });
});
