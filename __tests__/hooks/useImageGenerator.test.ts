import { renderHook, act } from '@testing-library/react';

// Must mock before importing the hook
jest.mock('@/components/ui/Toast', () => ({
  showToast: jest.fn(),
}));

// Mock fetch globally
const mockFetch = jest.fn();
Object.defineProperty(window, 'fetch', { value: mockFetch, writable: true });

import { useImageGenerator } from '@/hooks/useImageGenerator';

describe('useImageGenerator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockReset();
  });

  it('initializes with default state', () => {
    const { result } = renderHook(() => useImageGenerator());
    expect(result.current.prompt).toBe('');
    expect(result.current.style).toBe('none');
    expect(result.current.aspectRatio).toBe('1:1');
    expect(result.current.numberOfImages).toBe(1);
    expect(result.current.isGenerating).toBe(false);
    expect(result.current.generatedImages).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('sets prompt', () => {
    const { result } = renderHook(() => useImageGenerator());
    act(() => result.current.setPrompt('a sunset'));
    expect(result.current.prompt).toBe('a sunset');
  });

  it('sets style', () => {
    const { result } = renderHook(() => useImageGenerator());
    act(() => result.current.setStyle('anime'));
    expect(result.current.style).toBe('anime');
  });

  it('sets aspect ratio', () => {
    const { result } = renderHook(() => useImageGenerator());
    act(() => result.current.setAspectRatio('16:9'));
    expect(result.current.aspectRatio).toBe('16:9');
  });

  it('sets number of images', () => {
    const { result } = renderHook(() => useImageGenerator());
    act(() => result.current.setNumberOfImages(3));
    expect(result.current.numberOfImages).toBe(3);
  });

  it('resets state', () => {
    const { result } = renderHook(() => useImageGenerator());
    act(() => {
      result.current.setPrompt('test');
      result.current.setStyle('anime');
      result.current.setNumberOfImages(4);
    });
    act(() => result.current.reset());
    expect(result.current.prompt).toBe('');
    expect(result.current.style).toBe('none');
    expect(result.current.numberOfImages).toBe(1);
  });

  it('shows error toast for empty prompt', async () => {
    const { showToast } = require('@/components/ui/Toast');
    const { result } = renderHook(() => useImageGenerator());
    await act(async () => { await result.current.generate(); });
    expect(showToast).toHaveBeenCalledWith('error', 'Please enter a prompt');
    expect(result.current.isGenerating).toBe(false);
  });

  it('generates images successfully', async () => {
    const { showToast } = require('@/components/ui/Toast');
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ images: ['data:image/png;base64,result1'] }),
    });

    const { result } = renderHook(() => useImageGenerator());
    act(() => result.current.setPrompt('a beautiful cat'));

    await act(async () => { await result.current.generate(); });

    expect(result.current.isGenerating).toBe(false);
    expect(result.current.generatedImages).toEqual(['data:image/png;base64,result1']);
    expect(showToast).toHaveBeenCalledWith('success', 'Generated 1 image!');
  });

  it('sends correct request body', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ images: [] }),
    });

    const { result } = renderHook(() => useImageGenerator());
    act(() => {
      result.current.setPrompt('a cat');
      result.current.setStyle('watercolor');
      result.current.setAspectRatio('4:3');
      result.current.setNumberOfImages(2);
    });

    await act(async () => { await result.current.generate(); });

    expect(mockFetch).toHaveBeenCalledWith('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'a cat',
        style: 'watercolor',
        aspectRatio: '4:3',
        numberOfImages: 2,
      }),
    });
  });

  it('handles API error response', async () => {
    const { showToast } = require('@/components/ui/Toast');
    mockFetch.mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Rate limited' }),
    });

    const { result } = renderHook(() => useImageGenerator());
    act(() => result.current.setPrompt('a cat'));
    await act(async () => { await result.current.generate(); });

    expect(result.current.isGenerating).toBe(false);
    expect(result.current.error).toBe('Rate limited');
    expect(showToast).toHaveBeenCalledWith('error', 'Rate limited');
  });

  it('handles network error', async () => {
    const { showToast } = require('@/components/ui/Toast');
    mockFetch.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useImageGenerator());
    act(() => result.current.setPrompt('a cat'));
    await act(async () => { await result.current.generate(); });

    expect(result.current.isGenerating).toBe(false);
    expect(result.current.error).toBe('Network error');
    expect(showToast).toHaveBeenCalledWith('error', 'Network error');
  });

  it('pluralizes success message for multiple images', async () => {
    const { showToast } = require('@/components/ui/Toast');
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ images: ['img1', 'img2', 'img3'] }),
    });

    const { result } = renderHook(() => useImageGenerator());
    act(() => result.current.setPrompt('cats'));
    await act(async () => { await result.current.generate(); });

    expect(showToast).toHaveBeenCalledWith('success', 'Generated 3 images!');
  });

  it('clears previous images when generating', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ images: ['img1'] }),
    });

    const { result } = renderHook(() => useImageGenerator());
    act(() => result.current.setPrompt('first'));
    await act(async () => { await result.current.generate(); });
    expect(result.current.generatedImages).toEqual(['img1']);

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ images: ['img2'] }),
    });
    act(() => result.current.setPrompt('second'));
    await act(async () => { await result.current.generate(); });
    expect(result.current.generatedImages).toEqual(['img2']);
  });
});
