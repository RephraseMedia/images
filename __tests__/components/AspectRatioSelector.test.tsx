import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AspectRatioSelector from '@/components/generator/AspectRatioSelector';
import { ASPECT_RATIO_OPTIONS } from '@/types/generator';

describe('AspectRatioSelector', () => {
  it('renders all aspect ratio options', () => {
    render(<AspectRatioSelector value="1:1" onChange={jest.fn()} />);
    for (const option of ASPECT_RATIO_OPTIONS) {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    }
  });

  it('renders label', () => {
    render(<AspectRatioSelector value="1:1" onChange={jest.fn()} />);
    expect(screen.getByText('Aspect Ratio')).toBeInTheDocument();
  });

  it('highlights the selected ratio', () => {
    render(<AspectRatioSelector value="16:9" onChange={jest.fn()} />);
    const button = screen.getByText('16:9').closest('button');
    expect(button?.className).toContain('border-primary');
  });

  it('calls onChange when a ratio is clicked', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<AspectRatioSelector value="1:1" onChange={handleChange} />);
    await user.click(screen.getByText('9:16'));
    expect(handleChange).toHaveBeenCalledWith('9:16');
  });

  it('shows dimension title on buttons', () => {
    render(<AspectRatioSelector value="1:1" onChange={jest.fn()} />);
    const button = screen.getByTitle('1024 x 1024px');
    expect(button).toBeInTheDocument();
  });

  it('shows dimension title for widescreen', () => {
    render(<AspectRatioSelector value="16:9" onChange={jest.fn()} />);
    const button = screen.getByTitle('1344 x 768px');
    expect(button).toBeInTheDocument();
  });

  it('renders all buttons as type="button"', () => {
    render(<AspectRatioSelector value="1:1" onChange={jest.fn()} />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => {
      expect(btn).toHaveAttribute('type', 'button');
    });
  });
});
