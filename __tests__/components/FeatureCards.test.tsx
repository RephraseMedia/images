import { render, screen } from '@testing-library/react';
import FeatureCards from '@/components/landing/FeatureCards';

describe('FeatureCards', () => {
  it('renders all 8 feature cards', () => {
    render(<FeatureCards />);
    expect(screen.getByText('AI Image Generator')).toBeInTheDocument();
    expect(screen.getByText('AI Enhance')).toBeInTheDocument();
    expect(screen.getByText('Remove Background')).toBeInTheDocument();
    expect(screen.getByText('Generative Fill')).toBeInTheDocument();
    expect(screen.getByText('Replace Background')).toBeInTheDocument();
    expect(screen.getByText('Remove Objects')).toBeInTheDocument();
    expect(screen.getByText('Image Converter')).toBeInTheDocument();
    expect(screen.getByText('Download')).toBeInTheDocument();
  });

  it('renders section heading', () => {
    render(<FeatureCards />);
    expect(screen.getByText('Everything You Need')).toBeInTheDocument();
  });

  it('renders AI Image Generator as a link to /generator', () => {
    render(<FeatureCards />);
    const generatorCard = screen.getByText('AI Image Generator').closest('a');
    expect(generatorCard).toHaveAttribute('href', '/generator');
  });

  it('renders Image Converter as a link to /converter', () => {
    render(<FeatureCards />);
    const converterCard = screen.getByText('Image Converter').closest('a');
    expect(converterCard).toHaveAttribute('href', '/converter');
  });

  it('renders non-linked features as divs', () => {
    render(<FeatureCards />);
    const enhanceCard = screen.getByText('AI Enhance').closest('div');
    expect(enhanceCard).toBeInTheDocument();
    // Should not be inside a link
    const enhanceLink = screen.getByText('AI Enhance').closest('a');
    expect(enhanceLink).toBeNull();
  });

  it('renders feature descriptions', () => {
    render(<FeatureCards />);
    expect(screen.getByText(/Generate images from text descriptions/)).toBeInTheDocument();
    expect(screen.getByText(/Upscale and sharpen images/)).toBeInTheDocument();
  });
});
