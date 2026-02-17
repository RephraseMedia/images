import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConverterFAQ from '@/components/converter/ConverterFAQ';

describe('ConverterFAQ', () => {
  it('renders all questions', () => {
    render(<ConverterFAQ />);
    expect(screen.getByText('What is an image converter?')).toBeInTheDocument();
    expect(screen.getByText('What formats can I convert from?')).toBeInTheDocument();
    expect(screen.getByText('What formats can I convert to?')).toBeInTheDocument();
    expect(screen.getByText('Is my data private?')).toBeInTheDocument();
    expect(screen.getByText('Is there a file size limit?')).toBeInTheDocument();
    expect(screen.getByText('Can I convert multiple images at once?')).toBeInTheDocument();
    expect(screen.getByText('What does the quality slider do?')).toBeInTheDocument();
    expect(screen.getByText('Is it free to use?')).toBeInTheDocument();
  });

  it('expands answer on click', async () => {
    const user = userEvent.setup();
    render(<ConverterFAQ />);
    await user.click(screen.getByText('What is an image converter?'));
    expect(screen.getByText(/changes images from one file format/)).toBeInTheDocument();
  });

  it('collapses answer on second click', async () => {
    const user = userEvent.setup();
    render(<ConverterFAQ />);
    await user.click(screen.getByText('What is an image converter?'));
    expect(screen.getByText(/changes images from one file format/)).toBeInTheDocument();
    await user.click(screen.getByText('What is an image converter?'));
    expect(screen.queryByText(/changes images from one file format/)).not.toBeInTheDocument();
  });
});
