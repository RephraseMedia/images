import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BackgroundRemoverFAQ from '@/components/background-remover/BackgroundRemoverFAQ';

describe('BackgroundRemoverFAQ', () => {
  it('renders all 8 questions', () => {
    render(<BackgroundRemoverFAQ />);
    expect(screen.getByText('What is a background remover?')).toBeInTheDocument();
    expect(screen.getByText('How does it work?')).toBeInTheDocument();
    expect(screen.getByText('What image formats are supported?')).toBeInTheDocument();
    expect(screen.getByText('Is it free to use?')).toBeInTheDocument();
    expect(screen.getByText('Is there a file size limit?')).toBeInTheDocument();
    expect(screen.getByText('How does it handle complex edges?')).toBeInTheDocument();
    expect(screen.getByText('Can I replace the background color?')).toBeInTheDocument();
    expect(screen.getByText('What format is the output?')).toBeInTheDocument();
  });

  it('expands answer on click', async () => {
    const user = userEvent.setup();
    render(<BackgroundRemoverFAQ />);
    await user.click(screen.getByText('What is a background remover?'));
    expect(screen.getByText(/uses AI to automatically detect/)).toBeInTheDocument();
  });

  it('collapses answer on second click', async () => {
    const user = userEvent.setup();
    render(<BackgroundRemoverFAQ />);
    await user.click(screen.getByText('What is a background remover?'));
    expect(screen.getByText(/uses AI to automatically detect/)).toBeInTheDocument();
    await user.click(screen.getByText('What is a background remover?'));
    expect(screen.queryByText(/uses AI to automatically detect/)).not.toBeInTheDocument();
  });
});
