import { renderHook, act } from '@testing-library/react';
import { showToast } from '@/components/ui/Toast';

jest.mock('@/components/ui/Toast', () => ({
  showToast: jest.fn(),
}));

const mockShowToast = jest.mocked(showToast);

const mockFetch = jest.fn();
Object.defineProperty(window, 'fetch', { value: mockFetch, writable: true });

import { usePresentationMaker } from '@/hooks/usePresentationMaker';

const mockPresentation = {
  title: 'Test Presentation',
  subtitle: 'A test',
  slides: [
    {
      slideNumber: 1,
      title: 'Title Slide',
      bullets: ['Subtitle'],
      speakerNotes: 'Welcome everyone',
      layout: 'title' as const,
    },
    {
      slideNumber: 2,
      title: 'Content',
      bullets: ['Point 1', 'Point 2'],
      speakerNotes: 'Discuss points',
      layout: 'content' as const,
    },
  ],
};

describe('usePresentationMaker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockReset();
  });

  it('initializes with default state', () => {
    const { result } = renderHook(() => usePresentationMaker());
    expect(result.current.topic).toBe('');
    expect(result.current.slideCount).toBe(8);
    expect(result.current.style).toBe('professional');
    expect(result.current.isGenerating).toBe(false);
    expect(result.current.presentation).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('sets topic', () => {
    const { result } = renderHook(() => usePresentationMaker());
    act(() => result.current.setTopic('Machine Learning'));
    expect(result.current.topic).toBe('Machine Learning');
  });

  it('sets slide count', () => {
    const { result } = renderHook(() => usePresentationMaker());
    act(() => result.current.setSlideCount(10));
    expect(result.current.slideCount).toBe(10);
  });

  it('sets style', () => {
    const { result } = renderHook(() => usePresentationMaker());
    act(() => result.current.setStyle('creative'));
    expect(result.current.style).toBe('creative');
  });

  it('resets state', () => {
    const { result } = renderHook(() => usePresentationMaker());
    act(() => {
      result.current.setTopic('Test');
      result.current.setSlideCount(12);
      result.current.setStyle('bold');
    });
    act(() => result.current.reset());
    expect(result.current.topic).toBe('');
    expect(result.current.slideCount).toBe(8);
    expect(result.current.style).toBe('professional');
  });

  it('shows error toast for empty topic', async () => {
    const { result } = renderHook(() => usePresentationMaker());
    await act(async () => { await result.current.generate(); });
    expect(mockShowToast).toHaveBeenCalledWith('error', 'Please enter a topic');
    expect(result.current.isGenerating).toBe(false);
  });

  it('generates presentation successfully', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ presentation: mockPresentation }),
    });

    const { result } = renderHook(() => usePresentationMaker());
    act(() => result.current.setTopic('Machine Learning'));

    await act(async () => { await result.current.generate(); });

    expect(result.current.isGenerating).toBe(false);
    expect(result.current.presentation).toEqual(mockPresentation);
    expect(mockShowToast).toHaveBeenCalledWith('success', 'Presentation generated successfully!');
  });

  it('sends correct request body', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ presentation: mockPresentation }),
    });

    const { result } = renderHook(() => usePresentationMaker());
    act(() => {
      result.current.setTopic('AI Ethics');
      result.current.setSlideCount(10);
      result.current.setStyle('academic');
    });

    await act(async () => { await result.current.generate(); });

    expect(mockFetch).toHaveBeenCalledWith('/api/generate-presentation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic: 'AI Ethics',
        slideCount: 10,
        style: 'academic',
      }),
    });
  });

  it('handles API error response', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Rate limited' }),
    });

    const { result } = renderHook(() => usePresentationMaker());
    act(() => result.current.setTopic('Test'));
    await act(async () => { await result.current.generate(); });

    expect(result.current.isGenerating).toBe(false);
    expect(result.current.error).toBe('Rate limited');
    expect(mockShowToast).toHaveBeenCalledWith('error', 'Rate limited');
  });

  it('handles network error', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => usePresentationMaker());
    act(() => result.current.setTopic('Test'));
    await act(async () => { await result.current.generate(); });

    expect(result.current.isGenerating).toBe(false);
    expect(result.current.error).toBe('Network error');
    expect(mockShowToast).toHaveBeenCalledWith('error', 'Network error');
  });

  it('clears previous presentation when generating', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ presentation: mockPresentation }),
    });

    const { result } = renderHook(() => usePresentationMaker());
    act(() => result.current.setTopic('First'));
    await act(async () => { await result.current.generate(); });
    expect(result.current.presentation).toEqual(mockPresentation);

    const newPresentation = { ...mockPresentation, title: 'New' };
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ presentation: newPresentation }),
    });
    act(() => result.current.setTopic('Second'));
    await act(async () => { await result.current.generate(); });
    expect(result.current.presentation).toEqual(newPresentation);
  });
});
