'use client';

import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    // Async initial check to prevent synchronous state update in effect body
    const timeoutId = setTimeout(() => {
      setMatches(media.matches);
    }, 0);

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', handler);
    
    return () => {
      clearTimeout(timeoutId);
      media.removeEventListener('change', handler);
    };
  }, [query]);

  return matches;
}
