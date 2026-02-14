import { render, screen } from '@testing-library/react';
import HowItWorks from '@/components/landing/HowItWorks';

describe('HowItWorks', () => {
  it('renders all 3 steps', () => {
    render(<HowItWorks />);
    expect(screen.getByText('Upload')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Download')).toBeInTheDocument();
  });

  it('renders section heading', () => {
    render(<HowItWorks />);
    expect(screen.getByText('How It Works')).toBeInTheDocument();
  });

  it('renders step numbers', () => {
    render(<HowItWorks />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});
