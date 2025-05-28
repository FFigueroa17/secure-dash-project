import { act, renderHook } from '@testing-library/react';

import { useDebouncedCallback } from '@/hooks/use-debounced-callback';

// Mock timers
jest.useFakeTimers();

describe('useDebouncedCallback', () => {
  beforeEach(() => {
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.useFakeTimers();
  });

  it('should debounce callback execution', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, 500));

    // Call the debounced function multiple times
    act(() => {
      result.current('test1');
      result.current('test2');
      result.current('test3');
    });

    // Callback should not be called yet
    expect(callback).not.toHaveBeenCalled();

    // Fast-forward time by 500ms
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Callback should be called once with the last arguments
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('test3');
  });

  it('should delay execution by the specified delay', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, 1000));

    act(() => {
      result.current('test');
    });

    // Should not be called before delay
    act(() => {
      jest.advanceTimersByTime(999);
    });
    expect(callback).not.toHaveBeenCalled();

    // Should be called after delay
    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('test');
  });

  it('should reset timer on subsequent calls', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, 500));

    // First call
    act(() => {
      result.current('test1');
    });

    // Advance time, but not enough to trigger
    act(() => {
      jest.advanceTimersByTime(400);
    });

    // Second call should reset the timer
    act(() => {
      result.current('test2');
    });

    // Advance time again
    act(() => {
      jest.advanceTimersByTime(400);
    });

    // Should still not be called
    expect(callback).not.toHaveBeenCalled();

    // Advance remaining time
    act(() => {
      jest.advanceTimersByTime(100);
    });

    // Should be called with the last arguments
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('test2');
  });

  it('should handle multiple arguments correctly', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, 500));

    act(() => {
      result.current('arg1', 'arg2', { key: 'value' }, [1, 2, 3]);
    });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(callback).toHaveBeenCalledWith(
      'arg1',
      'arg2',
      { key: 'value' },
      [1, 2, 3],
    );
  });

  it('should work with no arguments', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, 500));

    act(() => {
      result.current();
    });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith();
  });

  it('should update when callback changes', () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    const { result, rerender } = renderHook(
      ({ callback, delay }) => useDebouncedCallback(callback, delay),
      {
        initialProps: { callback: callback1, delay: 500 },
      },
    );

    // Call with first callback
    act(() => {
      result.current('test1');
    });

    // Update callback
    rerender({ callback: callback2, delay: 500 });

    // Complete the debounce
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Should call the new callback
    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).toHaveBeenCalledWith('test1');
  });

  it('should update when delay changes', () => {
    const callback = jest.fn();

    const { result, rerender } = renderHook(
      ({ delay }) => useDebouncedCallback(callback, delay),
      {
        initialProps: { delay: 500 },
      },
    );

    act(() => {
      result.current('test');
    });

    // Change delay - this creates a new debounced function
    rerender({ delay: 1000 });

    // Call again with the new debounced function
    act(() => {
      result.current('test2');
    });

    // Original timeout should still complete, but with new delay
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(callback).toHaveBeenCalledWith('test2');
  });

  it('should clear timeout on unmount', () => {
    const callback = jest.fn();
    const { result, unmount } = renderHook(() =>
      useDebouncedCallback(callback, 500),
    );

    act(() => {
      result.current('test');
    });

    unmount();

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Callback should not be called
    expect(callback).not.toHaveBeenCalled();
  });

  it('should handle rapid successive calls correctly', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, 100));

    // Make many rapid calls
    act(() => {
      for (let i = 0; i < 10; i++) {
        result.current(`call-${i}`);
      }
    });

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(100);
    });

    // Should only be called once with the last value
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('call-9');
  });

  it('should work with zero delay', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, 0));

    act(() => {
      result.current('test');
    });

    act(() => {
      jest.advanceTimersByTime(0);
    });

    expect(callback).toHaveBeenCalledWith('test');
  });
});
