import { render, screen } from '@testing-library/react';
import Footer from '@/components/layout/Footer';

describe('Footer', () => {
  it('renders footer text', () => {
    render(<Footer />);
    expect(screen.getByText(/Rephrasely/)).toBeInTheDocument();
  });

  it('mentions images are never stored', () => {
    render(<Footer />);
    expect(screen.getByText(/never stored/)).toBeInTheDocument();
  });
});
