import { renderHook, act } from '@testing-library/react';
import { showToast } from '@/components/ui/Toast';

jest.mock('@/components/ui/Toast', () => ({
  showToast: jest.fn(),
}));

const mockShowToast = jest.mocked(showToast);

const mockFetch = jest.fn();
Object.defineProperty(window, 'fetch', { value: mockFetch, writable: true });

// Mock URL.createObjectURL / revokeObjectURL
const mockCreateObjectURL = jest.fn(() => 'blob:mock-url');
const mockRevokeObjectURL = jest.fn();
Object.defineProperty(URL, 'createObjectURL', { value: mockCreateObjectURL, writable: true });
Object.defineProperty(URL, 'revokeObjectURL', { value: mockRevokeObjectURL, writable: true });

// Mock FileReader
const mockFileReaderResult = 'data:image/png;base64,dGVzdA==';
class MockFileReader {
  result: string | null = null;
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  readAsDataURL() {
    this.result = mockFileReaderResult;
    setTimeout(() => this.onload?.(), 0);
  }
}
Object.defineProperty(window, 'FileReader', { value: MockFileReader, writable: true });

import { useBackgroundRemover } from '@/hooks/useBackgroundRemover';

describe('useBackgroundRemover', () => {
  const testFile = new File(['test'], 'photo.png', { type: 'image/png' });

  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockReset();
  });

  it('initializes with default state', () => {
    const { result } = renderHook(() => useBackgroundRemover());
    expect(result.current.sourceFile).toBeNull();
    expect(result.current.sourcePreview).toBeNull();
    expect(result.current.status).toBe('idle');
    expect(result.current.resultImage).toBeNull();
    expect(result.current.backgroundColor).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('sets file and creates preview', () => {
    const { result } = renderHook(() => useBackgroundRemover());
    act(() => result.current.setFile(testFile));
    expect(result.current.sourceFile).toBe(testFile);
    expect(result.current.sourcePreview).toBe('blob:mock-url');
    expect(mockCreateObjectURL).toHaveBeenCalledWith(testFile);
  });

  it('removes background successfully', async () => {

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ image: 'data:image/png;base64,result' }),
    });

    const { result } = renderHook(() => useBackgroundRemover());
    act(() => result.current.setFile(testFile));

    await act(async () => { await result.current.removeBackground(); });

    expect(result.current.status).toBe('done');
    expect(result.current.resultImage).toBe('data:image/png;base64,result');
    expect(mockShowToast).toHaveBeenCalledWith('success', 'Background removed!');
  });

  it('sends correct API request', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ image: 'data:image/png;base64,result' }),
    });

    const { result } = renderHook(() => useBackgroundRemover());
    act(() => result.current.setFile(testFile));

    await act(async () => { await result.current.removeBackground(); });

    expect(mockFetch).toHaveBeenCalledWith('/api/remove-background', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: mockFileReaderResult }),
    });
  });

  it('handles API error response', async () => {

    mockFetch.mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Rate limited' }),
    });

    const { result } = renderHook(() => useBackgroundRemover());
    act(() => result.current.setFile(testFile));

    await act(async () => { await result.current.removeBackground(); });

    expect(result.current.status).toBe('error');
    expect(result.current.error).toBe('Rate limited');
    expect(mockShowToast).toHaveBeenCalledWith('error', 'Rate limited');
  });

  it('handles network error', async () => {

    mockFetch.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useBackgroundRemover());
    act(() => result.current.setFile(testFile));

    await act(async () => { await result.current.removeBackground(); });

    expect(result.current.status).toBe('error');
    expect(result.current.error).toBe('Network error');
    expect(mockShowToast).toHaveBeenCalledWith('error', 'Network error');
  });

  it('sets background color', () => {
    const { result } = renderHook(() => useBackgroundRemover());
    act(() => result.current.setBackgroundColor('#ff0000'));
    expect(result.current.backgroundColor).toBe('#ff0000');
  });

  it('sets background color to null for transparent', () => {
    const { result } = renderHook(() => useBackgroundRemover());
    act(() => result.current.setBackgroundColor('#ff0000'));
    act(() => result.current.setBackgroundColor(null));
    expect(result.current.backgroundColor).toBeNull();
  });

  it('downloads result directly when transparent', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ image: 'data:image/png;base64,result' }),
    });

    const mockClick = jest.fn();
    const originalCreateElement = document.createElement.bind(document);
    jest.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      if (tag === 'a') {
        return { href: '', download: '', click: mockClick } as unknown as HTMLAnchorElement;
      }
      return originalCreateElement(tag);
    });

    const { result } = renderHook(() => useBackgroundRemover());
    act(() => result.current.setFile(testFile));
    await act(async () => { await result.current.removeBackground(); });
    await act(async () => { await result.current.downloadResult(); });

    expect(mockClick).toHaveBeenCalled();

    jest.restoreAllMocks();
  });

  it('resets state', async () => {
    const { result } = renderHook(() => useBackgroundRemover());
    act(() => result.current.setFile(testFile));
    act(() => result.current.reset());
    expect(result.current.sourceFile).toBeNull();
    expect(result.current.sourcePreview).toBeNull();
    expect(result.current.status).toBe('idle');
    expect(result.current.resultImage).toBeNull();
    expect(mockRevokeObjectURL).toHaveBeenCalled();
  });

  it('revokes old preview URL when setting new file', () => {
    const { result } = renderHook(() => useBackgroundRemover());
    act(() => result.current.setFile(testFile));
    const firstPreview = result.current.sourcePreview;
    act(() => result.current.setFile(new File(['test2'], 'photo2.png', { type: 'image/png' })));
    expect(mockRevokeObjectURL).toHaveBeenCalledWith(firstPreview);
  });
});
