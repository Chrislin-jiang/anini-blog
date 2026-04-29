import { useEffect, useRef } from 'react';

interface Bubble {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  color: string;
  alpha: number;
  pulse: number;
  pulseSpeed: number;
}

export default function BubbleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bubblesRef = useRef<Bubble[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const rafRef = useRef<number>(0);
  const isVisibleRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const COLORS = ['#7EC8E3', '#A8E6CF', '#FFB7C5', '#FFD93D'];
    const BUBBLE_COUNT = 800;
    const CONNECTION_DISTANCE = 100;
    const MOUSE_RADIUS = 180;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const initBubbles = () => {
      const bubbles: Bubble[] = [];
      for (let i = 0; i < BUBBLE_COUNT; i++) {
        const radius = Math.random() * 3 + 1;
        bubbles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.15,
          vy: -(Math.random() * 0.2 + 0.1), // float upward
          radius,
          baseRadius: radius,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          alpha: Math.random() * 0.35 + 0.15,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.015 + 0.005,
        });
      }
      bubblesRef.current = bubbles;
    };
    initBubbles();

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleVisibilityChange = () => {
      isVisibleRef.current = document.visibilityState === 'visible';
    };

    const drawDawnGlow = () => {
      const gradient = ctx.createRadialGradient(
        canvas.width * 0.15,
        canvas.height * 0.1,
        0,
        canvas.width * 0.15,
        canvas.height * 0.1,
        canvas.width * 0.5
      );
      gradient.addColorStop(0, 'rgba(255, 217, 61, 0.06)');
      gradient.addColorStop(0.5, 'rgba(255, 183, 197, 0.03)');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const animate = () => {
      if (!isVisibleRef.current) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawDawnGlow();

      const bubbles = bubblesRef.current;

      for (let i = 0; i < bubbles.length; i++) {
        const b = bubbles[i];

        // Pulse radius like breathing
        b.pulse += b.pulseSpeed;
        const currentRadius = b.baseRadius + Math.sin(b.pulse) * b.baseRadius * 0.3;

        // Mouse gentle repulsion
        const dx = b.x - mouseRef.current.x;
        const dy = b.y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
          b.vx += (dx / dist) * force * 0.3;
          b.vy += (dy / dist) * force * 0.3;
        }

        // Apply velocity with damping
        b.x += b.vx;
        b.y += b.vy;
        b.vx *= 0.99;
        b.vy *= 0.99;

        // Restore upward drift
        b.vy -= 0.002;
        if (b.vy > -0.05) b.vy = -0.05;
        if (b.vy < -0.4) b.vy = -0.4;

        // Gentle horizontal drift
        b.x += (Math.random() - 0.5) * 0.05;

        // Wrap around
        if (b.x < -10) b.x = canvas.width + 10;
        if (b.x > canvas.width + 10) b.x = -10;
        if (b.y < -10) b.y = canvas.height + 10;
        if (b.y > canvas.height + 10) b.y = -10;

        // Draw bubble with soft glow
        ctx.beginPath();
        ctx.arc(b.x, b.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.globalAlpha = Math.max(0.08, Math.min(0.6, b.alpha + Math.sin(b.pulse) * 0.1));
        ctx.fill();

        // Soft outer glow
        ctx.beginPath();
        ctx.arc(b.x, b.y, currentRadius * 2, 0, Math.PI * 2);
        const glowGradient = ctx.createRadialGradient(b.x, b.y, currentRadius * 0.5, b.x, b.y, currentRadius * 2);
        glowGradient.addColorStop(0, b.color);
        glowGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGradient;
        ctx.globalAlpha = b.alpha * 0.15;
        ctx.fill();

        // Draw connections
        for (let j = i + 1; j < bubbles.length; j++) {
          const b2 = bubbles[j];
          const cdx = b.x - b2.x;
          const cdy = b.y - b2.y;
          const cdist = Math.sqrt(cdx * cdx + cdy * cdy);

          if (cdist < CONNECTION_DISTANCE) {
            const opacity = (1 - cdist / CONNECTION_DISTANCE) * 0.08;
            ctx.beginPath();
            ctx.moveTo(b.x, b.y);
            ctx.lineTo(b2.x, b2.y);
            ctx.strokeStyle = b.color;
            ctx.globalAlpha = opacity;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
}
