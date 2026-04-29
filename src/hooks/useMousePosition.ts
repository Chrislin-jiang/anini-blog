import { useState, useEffect, useCallback, useRef } from 'react';

interface MousePosition {
  x: number;
  y: number;
  normalizedX: number;
  normalizedY: number;
}

export function useMousePosition() {
  const [position, setPosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
  });

  const rafRef = useRef<number>(0);
  const lastUpdateRef = useRef<number>(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const now = Date.now();
    if (now - lastUpdateRef.current < 16) return;
    lastUpdateRef.current = now;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      setPosition({
        x: e.clientX,
        y: e.clientY,
        normalizedX: (e.clientX / window.innerWidth) * 2 - 1,
        normalizedY: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleMouseMove]);

  return position;
}

export function useSmoothMousePosition(lerp: number = 0.15) {
  const [smoothPos, setSmoothPos] = useState({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      setSmoothPos((prev) => ({
        x: prev.x + (targetRef.current.x - prev.x) * lerp,
        y: prev.y + (targetRef.current.y - prev.y) * lerp,
      }));
      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [lerp]);

  return smoothPos;
}
