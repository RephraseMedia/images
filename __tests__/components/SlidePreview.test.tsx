import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SlidePreview from '@/components/presentation-maker/SlidePreview';
import type { PresentationData } from '@/types/presentation';

const mockPresentation: PresentationData = {
  title: 'Test Presentation',
  subtitle: 'Test subtitle',
  slides: [
    {
      slideNumber: 1,
      title: 'Welcome',
      bullets: ['Introduction point'],
      speakerNotes: 'Welcome everyone to this talk.',
      layout: 'title',
    },
    {
      slideNumber: 2,
      title: 'Main Content',
      bullets: ['Point A', 'Point B', 'Point C'],
      speakerNotes: 'Discuss main points.',
      layout: 'content',
    },
    {
      slideNumber: 3,
      title: 'Conclusion',
      bullets: ['Summary', 'Thank you'],
      speakerNotes: 'Wrap up the talk.',
      layout: 'conclusion',
    },
  ],
};

describe('SlidePreview', () => {
  it('renders first slide', () => {
    render(<SlidePreview presentation={mockPresentation} style="professional" />);
    // Title appears in both main slide and thumbnail
    expect(screen.getAllByText('Welcome').length).toBeGreaterThanOrEqual(1);
  });

  it('shows slide counter', () => {
    render(<SlidePreview presentation={mockPresentation} style="professional" />);
    expect(screen.getByText('Slide 1 of 3')).toBeInTheDocument();
  });

  it('navigates to next slide', async () => {
    const user = userEvent.setup();
    render(<SlidePreview presentation={mockPresentation} style="professional" />);

    await user.click(screen.getByText('Next'));
    expect(screen.getByText('Slide 2 of 3')).toBeInTheDocument();
    // "Main Content" appears in both main slide and thumbnail
    expect(screen.getAllByText('Main Content').length).toBeGreaterThanOrEqual(1);
  });

  it('navigates to previous slide', async () => {
    const user = userEvent.setup();
    render(<SlidePreview presentation={mockPresentation} style="professional" />);

    await user.click(screen.getByText('Next'));
    await user.click(screen.getByText('Previous'));
    expect(screen.getByText('Slide 1 of 3')).toBeInTheDocument();
  });

  it('disables previous button on first slide', () => {
    render(<SlidePreview presentation={mockPresentation} style="professional" />);
    expect(screen.getByText('Previous')).toBeDisabled();
  });

  it('disables next button on last slide', async () => {
    const user = userEvent.setup();
    render(<SlidePreview presentation={mockPresentation} style="professional" />);

    await user.click(screen.getByText('Next'));
    await user.click(screen.getByText('Next'));
    expect(screen.getByText('Next')).toBeDisabled();
  });

  it('shows speaker notes', () => {
    render(<SlidePreview presentation={mockPresentation} style="professional" />);
    expect(screen.getByText('Welcome everyone to this talk.')).toBeInTheDocument();
  });

  it('renders thumbnail strip', () => {
    render(<SlidePreview presentation={mockPresentation} style="professional" />);
    // There should be 3 thumbnail buttons (one for each slide)
    const thumbnails = screen.getAllByRole('button').filter(
      (btn) => !['Previous', 'Next'].includes(btn.textContent || '')
    );
    expect(thumbnails.length).toBe(3);
  });
});
