import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PresentationMakerFAQ from '@/components/presentation-maker/PresentationMakerFAQ';

describe('PresentationMakerFAQ', () => {
  it('renders all 8 questions', () => {
    render(<PresentationMakerFAQ />);
    expect(screen.getByText('What is the AI Presentation Maker?')).toBeInTheDocument();
    expect(screen.getByText('How does it work?')).toBeInTheDocument();
    expect(screen.getByText('What styles are available?')).toBeInTheDocument();
    expect(screen.getByText('Can I download as PowerPoint (PPTX)?')).toBeInTheDocument();
    expect(screen.getByText('Can I download as PDF?')).toBeInTheDocument();
    expect(screen.getByText('How many slides can I generate?')).toBeInTheDocument();
    expect(screen.getByText('Is it free to use?')).toBeInTheDocument();
    expect(screen.getByText('Can I edit the slides after downloading?')).toBeInTheDocument();
  });

  it('expands and collapses on click', async () => {
    const user = userEvent.setup();
    render(<PresentationMakerFAQ />);

    // Answer should not be visible initially
    expect(screen.queryByText(/uses artificial intelligence/)).not.toBeInTheDocument();

    // Click to expand
    await user.click(screen.getByText('What is the AI Presentation Maker?'));
    expect(screen.getByText(/uses artificial intelligence/)).toBeInTheDocument();

    // Click to collapse
    await user.click(screen.getByText('What is the AI Presentation Maker?'));
    expect(screen.queryByText(/uses artificial intelligence/)).not.toBeInTheDocument();
  });
});
