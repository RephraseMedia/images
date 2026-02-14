import { render, screen } from '@testing-library/react';
import FeatureCards from '@/components/landing/FeatureCards';

describe('FeatureCards', () => {
  it('renders all 6 feature cards', () => {
    render(<FeatureCards />);
    expect(screen.getByText('AI Enhance')).toBeInTheDocument();
    expect(screen.getByText('Remove Background')).toBeInTheDocument();
    expect(screen.getByText('Generative Fill')).toBeInTheDocument();
    expect(screen.getByText('Replace Background')).toBeInTheDocument();
    expect(screen.getByText('Remove Objects')).toBeInTheDocument();
    expect(screen.getByText('Download')).toBeInTheDocument();
  });

  it('renders section heading', () => {
    render(<FeatureCards />);
    expect(screen.getByText('Everything You Need')).toBeInTheDocument();
  });
});
