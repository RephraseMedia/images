import { render, screen } from '@testing-library/react';
import BackgroundRemoverFeatures from '@/components/background-remover/BackgroundRemoverFeatures';

describe('BackgroundRemoverFeatures', () => {
  it('renders section heading', () => {
    render(<BackgroundRemoverFeatures />);
    expect(screen.getByText('Features')).toBeInTheDocument();
  });

  it('renders all 6 feature titles', () => {
    render(<BackgroundRemoverFeatures />);
    expect(screen.getByText('AI-Powered Precision')).toBeInTheDocument();
    expect(screen.getByText('Instant Results')).toBeInTheDocument();
    expect(screen.getByText('Background Options')).toBeInTheDocument();
    expect(screen.getByText('High-Resolution Output')).toBeInTheDocument();
    expect(screen.getByText('No Software Required')).toBeInTheDocument();
    expect(screen.getByText('Free to Use')).toBeInTheDocument();
  });
});
