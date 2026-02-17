import { render, screen } from '@testing-library/react';
import ConverterHowItWorks from '@/components/converter/ConverterHowItWorks';

describe('ConverterHowItWorks', () => {
  it('renders section heading', () => {
    render(<ConverterHowItWorks />);
    expect(screen.getByText('How It Works')).toBeInTheDocument();
  });

  it('renders all 3 step titles', () => {
    render(<ConverterHowItWorks />);
    expect(screen.getByText('Upload')).toBeInTheDocument();
    expect(screen.getByText('Choose Format')).toBeInTheDocument();
    expect(screen.getByText('Download')).toBeInTheDocument();
  });

  it('renders step numbers', () => {
    render(<ConverterHowItWorks />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});
