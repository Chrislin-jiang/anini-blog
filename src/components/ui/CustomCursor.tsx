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
      {/* Main cursor - Nature Style */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[99999]"
        style={{
          width: isHovering ? 6 : 16,
          height: isHovering ? 6 : 16,
          borderRadius: '50%',
          border: isHovering ? 'none' : '2px solid #5BA3D9',
          background: isHovering ? '#8CC63F' : 'transparent',
          boxShadow: isHovering
            ? '0 0 8px rgba(109, 179, 63, 0.4)'
            : '0 0 8px rgba(91, 163, 217, 0.2)',
          transition: 'width 0.15s, height 0.15s, background 0.15s, border 0.15s',
          opacity: isHidden ? 0 : 1,
        }}
      />
      {/* Ripple Effect */}
      <div
        ref={trailRef}
        className="fixed top-0 left-0 pointer-events-none z-[99998]"
        style={{
          width: isHovering ? 24 : 32,
          height: isHovering ? 24 : 32,
          borderRadius: '50%',
          border: isHovering ? '1px solid rgba(109, 179, 63, 0.3)' : '1px solid rgba(109, 179, 63, 0.15)',
          opacity: isHidden ? 0 : (isHovering ? 0.6 : 0.3),
          transition: 'width 0.3s, height 0.3s, opacity 0.3s, border-color 0.3s',
          animation: isHovering ? 'ripple 1.5s ease-out infinite' : 'none',
        }}
      />
    </>
  );
}
