import { renderHook } from '@testing-library/react';

import { useCallbackRef } from '@/hooks/use-callback-ref';

describe('useCallbackRef', () => {
  it('should return a function when callback is provided', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useCallbackRef(callback));

    expect(typeof result.current).toBe('function');
  });

  it('should call the original callback when the returned function is invoked', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useCallbackRef(callback));

    result.current('test', 123);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('test', 123);
  });

  it('should handle undefined callback gracefully', () => {
    const { result } = renderHook(() => useCallbackRef(undefined));

    expect(() => result.current()).not.toThrow();
  });

  it('should update to use new callback when callback changes', () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    const { result, rerender } = renderHook(
      ({ callback }) => useCallbackRef(callback),
      {
        initialProps: { callback: callback1 },
      },
    );

    // Call with first callback
    result.current('test1');
    expect(callback1).toHaveBeenCalledWith('test1');
    expect(callback2).not.toHaveBeenCalled();

    // Update to second callback
    rerender({ callback: callback2 });

    // Call with second callback
    result.current('test2');
    expect(callback2).toHaveBeenCalledWith('test2');
    expect(callback1).toHaveBeenCalledTimes(1); // Still only called once
  });

  it('should maintain referential equality across renders when callback does not change', () => {
    const callback = jest.fn();
    const { result, rerender } = renderHook(() => useCallbackRef(callback));

    const firstRef = result.current;
    rerender();
    const secondRef = result.current;

    expect(firstRef).toBe(secondRef);
  });

  it('should work with different function signatures', () => {
    // Test with no arguments
    const noArgsCallback = jest.fn();
    const { result: noArgsResult } = renderHook(() =>
      useCallbackRef(noArgsCallback),
    );
    noArgsResult.current();
    expect(noArgsCallback).toHaveBeenCalledTimes(1);

    // Test with multiple arguments
    const multiArgsCallback = jest.fn();
    const { result: multiArgsResult } = renderHook(() =>
      useCallbackRef(multiArgsCallback),
    );
    multiArgsResult.current(1, 'test', { key: 'value' }, [1, 2, 3]);
    expect(multiArgsCallback).toHaveBeenCalledWith(
      1,
      'test',
      { key: 'value' },
      [1, 2, 3],
    );
  });

  it('should handle return values correctly', () => {
    const callbackWithReturn = jest.fn().mockReturnValue('return value');
    const { result } = renderHook(() => useCallbackRef(callbackWithReturn));

    const returnValue = result.current('input');

    expect(returnValue).toBe('return value');
    expect(callbackWithReturn).toHaveBeenCalledWith('input');
  });
});
