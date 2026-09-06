// @vitest-environment jsdom
import { cleanup, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { useLatest } from '../src/lib/use-latest';

describe('useLatest', () => {
  afterEach(cleanup);

  it('holds the new value after a rerender', () => {
    const { result, rerender } = renderHook(({ value }: { value: number }) => useLatest(value), {
      initialProps: { value: 1 },
    });
    expect(result.current.current).toBe(1);

    rerender({ value: 2 });
    expect(result.current.current).toBe(2);
  });

  it('lets a callback captured on first render read the latest value after a rerender', () => {
    const { result, rerender } = renderHook(({ value }: { value: string }) => useLatest(value), {
      initialProps: { value: 'first' },
    });
    const ref = result.current;
    // Captured once, as chessground would capture a handler at creation time.
    const readNow = () => ref.current;

    rerender({ value: 'second' });
    expect(readNow()).toBe('second');
  });
});
