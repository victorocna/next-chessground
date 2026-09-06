import { useEffect, useLayoutEffect, useRef } from 'react';
import type { RefObject } from 'react';

// useLayoutEffect warns during SSR on React 18; the server never reads these refs anyway.
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/** A ref that always holds the latest value, for callbacks handed to non-React code. */
export const useLatest = <T>(value: T): RefObject<T> => {
  const ref = useRef(value);
  useIsomorphicLayoutEffect(() => {
    ref.current = value;
  });
  return ref;
};
