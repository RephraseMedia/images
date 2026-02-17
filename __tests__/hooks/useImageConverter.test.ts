import { renderHook, act } from '@testing-library/react';

// Mock converterUtils
const mockConvertFile = jest.fn();
jest.mock('@/lib/converterUtils', () => ({
  convertFile: (...args: unknown[]) => mockConvertFile(...args),
  formatFileSize: jest.fn((n: number) => `${n} B`),
  getOutputFilename: jest.fn((name: string, ext: string) => `${name}.${ext}`),
}));

// Mock URL methods
const mockCreateObjectURL = jest.fn(() => 'blob:preview-url');
const mockRevokeObjectURL = jest.fn();
Object.defineProperty(URL, 'createObjectURL', { value: mockCreateObjectURL, writable: true });
Object.defineProperty(URL, 'revokeObjectURL', { value: mockRevokeObjectURL, writable: true });

import { useImageConverter } from '@/hooks/useImageConverter';

function createMockFile(name: string): File {
  return new File(['data'], name, { type: 'image/png' });
}

describe('useImageConverter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockConvertFile.mockReset();
    mockCreateObjectURL.mockReturnValue('blob:preview-url');
  });

  it('initializes with default state', () => {
    const { result } = renderHook(() => useImageConverter());
    expect(result.current.files).toEqual([]);
    expect(result.current.outputFormat).toBe('jpeg');
    expect(result.current.quality).toBe(85);
    expect(result.current.isConverting).toBe(false);
  });

  it('adds files', () => {
    const { result } = renderHook(() => useImageConverter());
    act(() => result.current.addFiles([createMockFile('a.png')]));
    expect(result.current.files).toHaveLength(1);
    expect(result.current.files[0].originalName).toBe('a.png');
    expect(result.current.files[0].status).toBe('pending');
  });

  it('enforces max file cap', () => {
    const { result } = renderHook(() => useImageConverter());
    const files = Array.from({ length: 25 }, (_, i) => createMockFile(`file${i}.png`));
    act(() => result.current.addFiles(files));
    expect(result.current.files).toHaveLength(20);
  });

  it('removes a file and revokes URLs', () => {
    const { result } = renderHook(() => useImageConverter());
    act(() => result.current.addFiles([createMockFile('a.png')]));
    const id = result.current.files[0].id;
    act(() => result.current.removeFile(id));
    expect(result.current.files).toHaveLength(0);
    expect(mockRevokeObjectURL).toHaveBeenCalled();
  });

  it('clears all files', () => {
    const { result } = renderHook(() => useImageConverter());
    act(() => result.current.addFiles([createMockFile('a.png'), createMockFile('b.png')]));
    act(() => result.current.clearFiles());
    expect(result.current.files).toHaveLength(0);
  });

  it('sets output format', () => {
    const { result } = renderHook(() => useImageConverter());
    act(() => result.current.setOutputFormat('webp'));
    expect(result.current.outputFormat).toBe('webp');
  });

  it('sets quality', () => {
    const { result } = renderHook(() => useImageConverter());
    act(() => result.current.setQuality(50));
    expect(result.current.quality).toBe(50);
  });

  it('converts all files successfully', async () => {
    const blob = new Blob(['converted'], { type: 'image/jpeg' });
    mockConvertFile.mockResolvedValue(blob);
    mockCreateObjectURL.mockReturnValue('blob:converted-url');

    const { result } = renderHook(() => useImageConverter());
    act(() => result.current.addFiles([createMockFile('a.png')]));

    await act(async () => { await result.current.convertAll(); });

    expect(result.current.files[0].status).toBe('done');
    expect(result.current.files[0].convertedBlob).toBe(blob);
    expect(result.current.isConverting).toBe(false);
  });

  it('handles conversion error', async () => {
    mockConvertFile.mockRejectedValue(new Error('Conversion failed'));

    const { result } = renderHook(() => useImageConverter());
    act(() => result.current.addFiles([createMockFile('a.png')]));

    await act(async () => { await result.current.convertAll(); });

    expect(result.current.files[0].status).toBe('error');
    expect(result.current.files[0].error).toBe('Conversion failed');
    expect(result.current.isConverting).toBe(false);
  });

  it('resets state', () => {
    const { result } = renderHook(() => useImageConverter());
    act(() => {
      result.current.addFiles([createMockFile('a.png')]);
      result.current.setOutputFormat('webp');
      result.current.setQuality(50);
    });
    act(() => result.current.reset());
    expect(result.current.files).toEqual([]);
    expect(result.current.outputFormat).toBe('jpeg');
    expect(result.current.quality).toBe(85);
  });
});
