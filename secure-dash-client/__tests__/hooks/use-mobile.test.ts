import { act, renderHook } from '@testing-library/react';

import { useIsMobile } from '@/hooks/use-mobile';

// Mock functions for event listeners
const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();

// Helper to set up window mock with specific width
const setupWindowMock = (width: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });

  // Since matchMedia is already mocked in jest.setup.ts, we just need to configure the return value
  (window.matchMedia as jest.Mock).mockReturnValue({
    matches: width < 768,
    addEventListener: mockAddEventListener,
    removeEventListener: mockRemoveEventListener,
  });
};

describe('useIsMobile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initially return false when window width is >= 768px', () => {
    setupWindowMock(1024);

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);
  });

  it('should initially return true when window width is < 768px', () => {
    setupWindowMock(500);

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(true);
  });

  it('should set up matchMedia listener with correct breakpoint', () => {
    setupWindowMock(1024);

    renderHook(() => useIsMobile());

    expect(window.matchMedia).toHaveBeenCalledWith('(max-width: 767px)');
    expect(mockAddEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function),
    );
  });

  it('should update isMobile when window is resized', () => {
    setupWindowMock(1024);

    const { result } = renderHook(() => useIsMobile());

    // Initially should be false (desktop)
    expect(result.current).toBe(false);

    // Simulate window resize to mobile width
    act(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500,
      });

      // Get the change listener that was registered
      const changeListener = mockAddEventListener.mock.calls[0][1];
      changeListener();
    });

    expect(result.current).toBe(true);
  });

  it('should update isMobile when window is resized from mobile to desktop', () => {
    setupWindowMock(500);

    const { result } = renderHook(() => useIsMobile());

    // Initially should be true (mobile)
    expect(result.current).toBe(true);

    // Simulate window resize to desktop width
    act(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });

      // Get the change listener that was registered
      const changeListener = mockAddEventListener.mock.calls[0][1];
      changeListener();
    });

    expect(result.current).toBe(false);
  });

  it('should handle edge case at exactly 768px (should be false)', () => {
    setupWindowMock(768);

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);
  });

  it('should handle edge case at 767px (should be true)', () => {
    setupWindowMock(767);

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(true);
  });

  it('should clean up event listener on unmount', () => {
    setupWindowMock(1024);

    const { unmount } = renderHook(() => useIsMobile());

    unmount();

    expect(mockRemoveEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function),
    );
  });

  it('should handle multiple resize events correctly', () => {
    setupWindowMock(1024);

    const { result } = renderHook(() => useIsMobile());
    const changeListener = mockAddEventListener.mock.calls[0][1];

    // Desktop -> Mobile -> Desktop
    expect(result.current).toBe(false);

    act(() => {
      Object.defineProperty(window, 'innerWidth', { value: 400 });
      changeListener();
    });
    expect(result.current).toBe(true);

    act(() => {
      Object.defineProperty(window, 'innerWidth', { value: 1200 });
      changeListener();
    });
    expect(result.current).toBe(false);
  });
});
