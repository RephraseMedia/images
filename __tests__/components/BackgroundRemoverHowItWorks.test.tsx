import { render, screen } from '@testing-library/react';
import BackgroundRemoverHowItWorks from '@/components/background-remover/BackgroundRemoverHowItWorks';

describe('BackgroundRemoverHowItWorks', () => {
  it('renders section heading', () => {
    render(<BackgroundRemoverHowItWorks />);
    expect(screen.getByText('How It Works')).toBeInTheDocument();
  });

  it('renders all 3 step titles', () => {
    render(<BackgroundRemoverHowItWorks />);
    expect(screen.getByText('Upload')).toBeInTheDocument();
    expect(screen.getByText('Remove Background')).toBeInTheDocument();
    expect(screen.getByText('Download')).toBeInTheDocument();
  });

  it('renders step numbers', () => {
    render(<BackgroundRemoverHowItWorks />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});
