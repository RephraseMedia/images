import { render, screen } from '@testing-library/react';
import PresentationMakerHowItWorks from '@/components/presentation-maker/PresentationMakerHowItWorks';

describe('PresentationMakerHowItWorks', () => {
  it('renders heading', () => {
    render(<PresentationMakerHowItWorks />);
    expect(screen.getByText('How It Works')).toBeInTheDocument();
  });

  it('renders 3 step titles', () => {
    render(<PresentationMakerHowItWorks />);
    expect(screen.getByText('Describe')).toBeInTheDocument();
    expect(screen.getByText('Customize')).toBeInTheDocument();
    expect(screen.getByText('Download')).toBeInTheDocument();
  });

  it('renders step numbers', () => {
    render(<PresentationMakerHowItWorks />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});
