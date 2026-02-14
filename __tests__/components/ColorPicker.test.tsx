import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ColorPicker from '@/components/ui/ColorPicker';

describe('ColorPicker', () => {
  it('renders preset colors', () => {
    render(<ColorPicker value="#ffffff" onChange={jest.fn()} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(10);
  });

  it('calls onChange when preset color is clicked', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<ColorPicker value="#ffffff" onChange={handleChange} />);

    const blackButton = screen.getByLabelText('Select color #000000');
    await user.click(blackButton);
    expect(handleChange).toHaveBeenCalledWith('#000000');
  });

  it('highlights selected color', () => {
    render(<ColorPicker value="#000000" onChange={jest.fn()} />);
    const selected = screen.getByLabelText('Select color #000000');
    expect(selected.className).toContain('border-primary');
  });

  it('displays hex value in text input', () => {
    render(<ColorPicker value="#ff0000" onChange={jest.fn()} />);
    const input = screen.getByPlaceholderText('#000000');
    expect(input).toHaveValue('#ff0000');
  });
});
