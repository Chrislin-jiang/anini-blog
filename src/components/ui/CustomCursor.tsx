import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const posRef = useRef({ x: 0, y: 0 });
  const trailPosRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const cursor = cursorRef.current;
    const trail = trailRef.current;
    if (!cursor || !trail) return;

    const handleMouseMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      setIsHidden(false);
    };

    const handleMouseEnter = () => setIsHidden(false);
    const handleMouseLeave = () => setIsHidden(true);

    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable =
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[role="button"]') ||
        target.closest('input') ||
        target.closest('textarea') ||
        target.closest('select');
      setIsHovering(!!isClickable);
    };

    const animate = () => {
      trailPosRef.current.x += (posRef.current.x - trailPosRef.current.x) * 0.12;
      trailPosRef.current.y += (posRef.current.y - trailPosRef.current.y) * 0.12;

      cursor.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px) translate(-50%, -50%)`;
      trail.style.transform = `translate(${trailPosRef.current.x}px, ${trailPosRef.current.y}px) translate(-50%, -50%)`;

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleElementHover);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleElementHover);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      {/* Main cursor */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[99999]"
        style={{
          width: isHovering ? 10 : 24,
          height: isHovering ? 10 : 24,
          borderRadius: '50%',
          border: isHovering ? 'none' : '2px solid #00F0FF',
          background: isHovering ? '#FF0080' : 'transparent',
          boxShadow: isHovering
            ? '0 0 15px rgba(255, 0, 128, 0.6)'
            : '0 0 15px rgba(0, 240, 255, 0.4)',
          transition: 'width 0.2s, height 0.2s, background 0.2s, border 0.2s',
          opacity: isHidden ? 0 : 1,
        }}
      />
      {/* Trail */}
      <div
        ref={trailRef}
        className="fixed top-0 left-0 pointer-events-none z-[99998]"
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '1px solid rgba(0, 240, 255, 0.15)',
          opacity: isHidden ? 0 : 0.5,
          transition: 'opacity 0.3s',
        }}
      />
    </>
  );
}
