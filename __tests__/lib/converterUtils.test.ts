import { formatFileSize, getOutputFilename, loadImageFromFile, imageToBlob } from '@/lib/converterUtils';

describe('formatFileSize', () => {
  it('returns 0 B for zero bytes', () => {
    expect(formatFileSize(0)).toBe('0 B');
  });

  it('returns bytes for small values', () => {
    expect(formatFileSize(500)).toBe('500 B');
  });

  it('returns KB for kilobyte range', () => {
    expect(formatFileSize(2048)).toBe('2.0 KB');
  });

  it('returns MB for megabyte range', () => {
    expect(formatFileSize(1048576)).toBe('1.0 MB');
    expect(formatFileSize(5242880)).toBe('5.0 MB');
  });
});

describe('getOutputFilename', () => {
  it('swaps extension for normal filename', () => {
    expect(getOutputFilename('photo.png', 'jpg')).toBe('photo.jpg');
  });

  it('adds extension when there is none', () => {
    expect(getOutputFilename('photo', 'webp')).toBe('photo.webp');
  });

  it('handles multiple dots in filename', () => {
    expect(getOutputFilename('my.photo.v2.png', 'jpg')).toBe('my.photo.v2.jpg');
  });
});

describe('loadImageFromFile', () => {
  let mockCreateObjectURL: jest.Mock;
  let mockRevokeObjectURL: jest.Mock;

  beforeEach(() => {
    mockCreateObjectURL = jest.fn(() => 'blob:mock-url');
    mockRevokeObjectURL = jest.fn();
    Object.defineProperty(URL, 'createObjectURL', { value: mockCreateObjectURL, writable: true });
    Object.defineProperty(URL, 'revokeObjectURL', { value: mockRevokeObjectURL, writable: true });
  });

  it('resolves with an image element on success', async () => {
    const file = new File(['data'], 'test.png', { type: 'image/png' });

    // Mock Image constructor
    const mockImg: Partial<HTMLImageElement> = {
      naturalWidth: 100,
      naturalHeight: 100,
    };
    let onloadCallback: (() => void) | null = null;
    Object.defineProperty(mockImg, 'onload', { set: (fn) => { onloadCallback = fn; }, get: () => onloadCallback });
    Object.defineProperty(mockImg, 'onerror', { set: jest.fn(), get: () => null });
    Object.defineProperty(mockImg, 'src', { set: () => { if (onloadCallback) onloadCallback(); }, get: () => '' });

    jest.spyOn(globalThis, 'Image').mockImplementation(() => mockImg as HTMLImageElement);

    const result = await loadImageFromFile(file);
    expect(result).toBe(mockImg);
    expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  });

  it('rejects when image fails to load', async () => {
    const file = new File(['data'], 'test.png', { type: 'image/png' });

    const mockImg: Partial<HTMLImageElement> = {};
    let onerrorCallback: (() => void) | null = null;
    Object.defineProperty(mockImg, 'onload', { set: jest.fn(), get: () => null });
    Object.defineProperty(mockImg, 'onerror', { set: (fn) => { onerrorCallback = fn; }, get: () => onerrorCallback });
    Object.defineProperty(mockImg, 'src', { set: () => { if (onerrorCallback) onerrorCallback(); }, get: () => '' });

    jest.spyOn(globalThis, 'Image').mockImplementation(() => mockImg as HTMLImageElement);

    await expect(loadImageFromFile(file)).rejects.toThrow('Failed to load image');
  });
});

describe('imageToBlob', () => {
  let mockToBlob: jest.Mock;
  let mockFillRect: jest.Mock;
  let mockDrawImage: jest.Mock;
  let mockGetContext: jest.Mock;

  beforeEach(() => {
    mockToBlob = jest.fn();
    mockFillRect = jest.fn();
    mockDrawImage = jest.fn();
    mockGetContext = jest.fn(() => ({
      fillStyle: '',
      fillRect: mockFillRect,
      drawImage: mockDrawImage,
    }));

    jest.spyOn(document, 'createElement').mockReturnValue({
      width: 0,
      height: 0,
      getContext: mockGetContext,
      toBlob: mockToBlob,
    } as unknown as HTMLCanvasElement);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const mockImg = {
    naturalWidth: 200,
    naturalHeight: 150,
  } as HTMLImageElement;

  it('converts to the correct MIME type', async () => {
    const blob = new Blob(['data'], { type: 'image/webp' });
    mockToBlob.mockImplementation((cb: (b: Blob) => void) => cb(blob));

    const result = await imageToBlob(mockImg, 'webp', 85);
    expect(result).toBe(blob);
    expect(mockToBlob).toHaveBeenCalledWith(expect.any(Function), 'image/webp', 0.85);
  });

  it('fills white background for JPEG', async () => {
    const blob = new Blob(['data'], { type: 'image/jpeg' });
    mockToBlob.mockImplementation((cb: (b: Blob) => void) => cb(blob));

    await imageToBlob(mockImg, 'jpeg', 90);
    expect(mockFillRect).toHaveBeenCalledWith(0, 0, 200, 150);
  });

  it('does not fill background for PNG', async () => {
    const blob = new Blob(['data'], { type: 'image/png' });
    mockToBlob.mockImplementation((cb: (b: Blob) => void) => cb(blob));

    await imageToBlob(mockImg, 'png', 85);
    expect(mockFillRect).not.toHaveBeenCalled();
  });

  it('passes undefined quality for PNG', async () => {
    const blob = new Blob(['data'], { type: 'image/png' });
    mockToBlob.mockImplementation((cb: (b: Blob) => void) => cb(blob));

    await imageToBlob(mockImg, 'png', 85);
    expect(mockToBlob).toHaveBeenCalledWith(expect.any(Function), 'image/png', undefined);
  });

  it('rejects when toBlob returns null', async () => {
    mockToBlob.mockImplementation((cb: (b: Blob | null) => void) => cb(null));

    await expect(imageToBlob(mockImg, 'jpeg', 85)).rejects.toThrow('Canvas conversion failed');
  });
});
