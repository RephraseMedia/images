import { render, screen } from '@testing-library/react';
import ConverterFeatures from '@/components/converter/ConverterFeatures';

describe('ConverterFeatures', () => {
  it('renders section heading', () => {
    render(<ConverterFeatures />);
    expect(screen.getByText('Converter Features')).toBeInTheDocument();
  });

  it('renders all 6 feature titles', () => {
    render(<ConverterFeatures />);
    expect(screen.getByText('Multiple Formats')).toBeInTheDocument();
    expect(screen.getByText('Batch Conversion')).toBeInTheDocument();
    expect(screen.getByText('Quality Control')).toBeInTheDocument();
    expect(screen.getByText('Instant Preview')).toBeInTheDocument();
    expect(screen.getByText('100% Private')).toBeInTheDocument();
    expect(screen.getByText('Completely Free')).toBeInTheDocument();
  });
});
