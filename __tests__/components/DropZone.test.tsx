import { render, screen, fireEvent } from '@testing-library/react';
import DropZone from '@/components/ui/DropZone';

describe('DropZone', () => {
  it('renders children', () => {
    render(
      <DropZone onFiles={jest.fn()}>
        <p>Drop files here</p>
      </DropZone>
    );
    expect(screen.getByText('Drop files here')).toBeInTheDocument();
  });

  it('has upload button role', () => {
    render(
      <DropZone onFiles={jest.fn()}>
        <p>Upload</p>
      </DropZone>
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('has accessible label', () => {
    render(
      <DropZone onFiles={jest.fn()}>
        <p>Upload</p>
      </DropZone>
    );
    expect(screen.getByLabelText('Upload image')).toBeInTheDocument();
  });

  it('calls onFiles when files are dropped', () => {
    const handleFiles = jest.fn();
    render(
      <DropZone onFiles={handleFiles}>
        <p>Upload</p>
      </DropZone>
    );

    const dropZone = screen.getByRole('button');
    const file = new File(['test'], 'test.png', { type: 'image/png' });

    fireEvent.drop(dropZone, {
      dataTransfer: { files: [file] },
    });

    expect(handleFiles).toHaveBeenCalledWith([file]);
  });

  it('applies drag-over styles', () => {
    render(
      <DropZone onFiles={jest.fn()}>
        <p>Upload</p>
      </DropZone>
    );

    const dropZone = screen.getByRole('button');
    fireEvent.dragOver(dropZone, { dataTransfer: { files: [] } });
    expect(dropZone.className).toContain('border-primary');
  });
});
