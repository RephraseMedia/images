import { render, screen } from '@testing-library/react';
import PresentationMakerFeatures from '@/components/presentation-maker/PresentationMakerFeatures';

describe('PresentationMakerFeatures', () => {
  it('renders heading', () => {
    render(<PresentationMakerFeatures />);
    expect(screen.getByText('Features')).toBeInTheDocument();
  });

  it('renders all 6 feature titles', () => {
    render(<PresentationMakerFeatures />);
    expect(screen.getByText('5 Template Styles')).toBeInTheDocument();
    expect(screen.getByText('PPTX & PDF Export')).toBeInTheDocument();
    expect(screen.getByText('Slide Preview')).toBeInTheDocument();
    expect(screen.getByText('Speaker Notes')).toBeInTheDocument();
    expect(screen.getByText('Smart Structure')).toBeInTheDocument();
    expect(screen.getByText('Free & Private')).toBeInTheDocument();
  });
});
