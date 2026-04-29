import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

export function useSmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      autoRaf: true,
    });

    lenisRef.current = lenis;

    return () => {
      lenis.destroy();
    };
  }, []);

  return lenisRef;
}
