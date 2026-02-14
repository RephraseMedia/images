import { render, screen } from '@testing-library/react';
import Spinner from '@/components/ui/Spinner';

describe('Spinner', () => {
  it('renders with default size', () => {
    render(<Spinner />);
    const svg = screen.getByRole('status');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('w-8', 'h-8');
  });

  it('renders with small size', () => {
    render(<Spinner size="sm" />);
    const svg = screen.getByRole('status');
    expect(svg).toHaveClass('w-4', 'h-4');
  });

  it('renders with large size', () => {
    render(<Spinner size="lg" />);
    const svg = screen.getByRole('status');
    expect(svg).toHaveClass('w-12', 'h-12');
  });

  it('applies custom className', () => {
    render(<Spinner className="text-red-500" />);
    expect(screen.getByRole('status')).toHaveClass('text-red-500');
  });

  it('has accessible label', () => {
    render(<Spinner />);
    expect(screen.getByLabelText('Loading')).toBeInTheDocument();
  });
});
