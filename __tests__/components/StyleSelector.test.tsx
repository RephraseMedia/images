import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StyleSelector from '@/components/generator/StyleSelector';
import { STYLE_OPTIONS } from '@/types/generator';

describe('StyleSelector', () => {
  it('renders all style options', () => {
    render(<StyleSelector value="none" onChange={jest.fn()} />);
    for (const style of STYLE_OPTIONS) {
      expect(screen.getByText(style.label)).toBeInTheDocument();
    }
  });

  it('renders label', () => {
    render(<StyleSelector value="none" onChange={jest.fn()} />);
    expect(screen.getByText('Style')).toBeInTheDocument();
  });

  it('highlights the selected style', () => {
    render(<StyleSelector value="anime" onChange={jest.fn()} />);
    const animeButton = screen.getByText('Anime');
    expect(animeButton.className).toContain('border-primary');
  });

  it('does not highlight unselected styles', () => {
    render(<StyleSelector value="anime" onChange={jest.fn()} />);
    const noneButton = screen.getByText('None');
    expect(noneButton.className).not.toContain('bg-primary/10');
  });

  it('calls onChange when a style is clicked', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<StyleSelector value="none" onChange={handleChange} />);
    await user.click(screen.getByText('Watercolor'));
    expect(handleChange).toHaveBeenCalledWith('watercolor');
  });

  it('calls onChange with correct id for each style', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<StyleSelector value="none" onChange={handleChange} />);
    await user.click(screen.getByText('3D Render'));
    expect(handleChange).toHaveBeenCalledWith('3d-render');
  });

  it('renders all buttons as type="button"', () => {
    render(<StyleSelector value="none" onChange={jest.fn()} />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => {
      expect(btn).toHaveAttribute('type', 'button');
    });
  });
});
