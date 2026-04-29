import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import ParticleField from './3d/ParticleField';
import NeonButton from './ui/NeonButton';

export default function Hero() {
  const [glitchActive, setGlitchActive] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setGlitchActive(false), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.02;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.02;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden section-padding pt-32"
    >
      {/* Particle Background */}
      <ParticleField />

      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050508]" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
        {/* 3D Avatar with Halo Rings */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
          className="relative mb-10"
          style={{
            transform: `perspective(800px) rotateX(${-mousePos.y}deg) rotateY(${mousePos.x}deg)`,
            transition: 'transform 0.1s ease-out',
          }}
        >
          {/* Halo Ring 3 - outermost */}
          <div
            className="absolute halo-ring halo-ring-3"
            style={{
              width: 220,
              height: 220,
              top: '50%',
              left: '50%',
              marginLeft: -110,
              marginTop: -110,
              transform: `rotateX(60deg) rotateZ(${Date.now() * 0.005}deg)`,
            }}
          />
          {/* Halo Ring 2 */}
          <div
            className="absolute halo-ring halo-ring-2"
            style={{
              width: 190,
              height: 190,
              top: '50%',
              left: '50%',
              marginLeft: -95,
              marginTop: -95,
              transform: `rotateX(45deg) rotateZ(${-Date.now() * 0.008}deg)`,
            }}
          />
          {/* Halo Ring 1 - innermost */}
          <div
            className="absolute halo-ring halo-ring-1"
            style={{
              width: 160,
              height: 160,
              top: '50%',
              left: '50%',
              marginLeft: -80,
              marginTop: -80,
              transform: `rotateX(30deg) rotateZ(${Date.now() * 0.012}deg)`,
            }}
          />

          {/* Avatar */}
          <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden animate-float">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'linear-gradient(135deg, #00F0FF, #B829F7, #FF0080)',
                padding: 3,
              }}
            >
              <div className="w-full h-full rounded-full overflow-hidden bg-[#0A0A12]">
                <img
                  src="/images/avatar.png"
                  alt="Anini's avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Floating tech icons */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-2 -right-4 w-12 h-12 rounded-xl flex items-center justify-center text-xl"
            style={{
              background: 'rgba(0, 240, 255, 0.1)',
              border: '1px solid rgba(0, 240, 255, 0.3)',
              boxShadow: '0 0 15px rgba(0, 240, 255, 0.2)',
            }}
          >
            ⚛️
          </motion.div>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute -bottom-1 -left-5 w-10 h-10 rounded-lg flex items-center justify-center text-lg"
            style={{
              background: 'rgba(184, 41, 247, 0.1)',
              border: '1px solid rgba(184, 41, 247, 0.3)',
              boxShadow: '0 0 15px rgba(184, 41, 247, 0.2)',
            }}
          >
            🎨
          </motion.div>
        </motion.div>

        {/* Greeting */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-3"
        >
          <span
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium backdrop-blur-sm border"
            style={{
              background: 'rgba(0, 240, 255, 0.08)',
              borderColor: 'rgba(0, 240, 255, 0.2)',
              color: '#00F0FF',
              boxShadow: '0 0 20px rgba(0, 240, 255, 0.1)',
            }}
          >
            <span className="animate-wave inline-block">👋</span>
            你好，欢迎来到我的空间
          </span>
        </motion.div>

        {/* Name with Glitch */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-5xl md:text-7xl font-extrabold mb-5"
        >
          <span
            className={`glitch-text text-gradient-cyber ${glitchActive ? 'active' : ''}`}
            data-text="我是 Anini"
          >
            我是 Anini
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-lg md:text-xl mb-10 leading-relaxed max-w-lg"
          style={{ color: '#8A8A9A' }}
        >
          <span className="font-semibold" style={{ color: '#00F0FF' }}>
            前端工程师
          </span>{' '}
          · 掘金 2024 人气作者
          <br />
          路阻且长，行则将至
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <NeonButton href="#projects">查看作品</NeonButton>
          <NeonButton href="#contact" variant="outline">
            联系我
          </NeonButton>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div
          className="w-6 h-10 rounded-full flex items-start justify-center p-1.5"
          style={{
            border: '2px solid rgba(0, 240, 255, 0.3)',
          }}
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: 'rgba(0, 240, 255, 0.6)' }}
          />
        </div>
      </motion.div>
    </section>
  );
}
