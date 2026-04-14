import { useState, useEffect, useRef } from 'react';

/**
 * Ensures a loading state is shown for at least `minMs` milliseconds.
 * Even if the page is ready immediately, the skeleton stays visible for the
 * minimum duration before revealing real content.
 *
 * @param minMs   Minimum display time in milliseconds (default 2000ms)
 * @returns       `true` while the skeleton should be shown
 */
export function useMinimumLoading(minMs = 2000): boolean {
  const [loading, setLoading] = useState(true);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    const elapsed = Date.now() - startTimeRef.current;
    const remaining = Math.max(0, minMs - elapsed);

    const timer = setTimeout(() => {
      setLoading(false);
    }, remaining);

    return () => clearTimeout(timer);
  }, [minMs]);

  return loading;
}
