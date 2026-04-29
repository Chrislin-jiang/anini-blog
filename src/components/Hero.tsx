import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import { Atom, Palette, Hand, Flower2, Leaf } from 'lucide-react';
import BubbleField from './3d/BubbleField';
import SoftButton from './ui/SoftButton';

export default function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.015;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.015;
    setMousePos({ x, y });
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden section-padding pt-32"
    >
      {/* Bubble Background */}
      <BubbleField />

      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#F5F7F0]" />
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
            className="absolute"
            style={{
              width: 220,
              height: 220,
              top: '50%',
              left: '50%',
              marginLeft: -110,
              marginTop: -110,
              transform: 'rotateX(60deg)',
            }}
          >
            <div className="w-full h-full halo-ring halo-ring-3" />
          </div>
          {/* Halo Ring 2 */}
          <div
            className="absolute"
            style={{
              width: 190,
              height: 190,
              top: '50%',
              left: '50%',
              marginLeft: -95,
              marginTop: -95,
              transform: 'rotateX(45deg)',
            }}
          >
            <div className="w-full h-full halo-ring halo-ring-2" />
          </div>
          {/* Halo Ring 1 - innermost */}
          <div
            className="absolute"
            style={{
              width: 160,
              height: 160,
              top: '50%',
              left: '50%',
              marginLeft: -80,
              marginTop: -80,
              transform: 'rotateX(30deg)',
            }}
          >
            <div className="w-full h-full halo-ring halo-ring-1" />
          </div>

          {/* Petal decorations */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-3 -right-3"
            style={{ color: 'rgba(109, 179, 63, 0.5)' }}
          >
            <Leaf size={18} />
          </motion.div>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="absolute -bottom-2 -left-2"
            style={{ color: 'rgba(244, 208, 63, 0.5)' }}
          >
            <Flower2 size={16} />
          </motion.div>

          {/* Avatar */}
          <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden animate-float">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'linear-gradient(135deg, #6DB33F, #5BA3D9, #F4D03F)',
                padding: 3,
              }}
            >
              <div className="w-full h-full rounded-full overflow-hidden bg-[#FFFFFF]">
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
            className="absolute -top-2 -right-4 w-12 h-12 rounded-xl flex items-center justify-center"
            style={{
              background: 'rgba(109, 179, 63, 0.15)',
              border: '1px solid rgba(109, 179, 63, 0.3)',
              boxShadow: '0 0 15px rgba(109, 179, 63, 0.1)',
              color: '#4A6B4A',
            }}
          >
            <Atom size={20} />
          </motion.div>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute -bottom-1 -left-5 w-10 h-10 rounded-lg flex items-center justify-center"
            style={{
              background: 'rgba(244, 208, 63, 0.15)',
              border: '1px solid rgba(244, 208, 63, 0.3)',
              boxShadow: '0 0 15px rgba(244, 208, 63, 0.1)',
              color: '#4A6B4A',
            }}
          >
            <Palette size={18} />
          </motion.div>
        </motion.div>

        {/* Greeting */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
          className="mb-3"
        >
          <span
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium backdrop-blur-sm border"
            style={{
              background: 'rgba(109, 179, 63, 0.12)',
              borderColor: 'rgba(109, 179, 63, 0.25)',
              color: '#4A6B4A',
              boxShadow: '0 0 20px rgba(109, 179, 63, 0.08)',
            }}
          >
            <span className="animate-wave inline-block"><Hand size={16} /></span>
            你好，欢迎来到我的空间
          </span>
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8, ease: 'easeOut' }}
          className="text-5xl md:text-7xl font-bold mb-5"
        >
          <span className="text-gradient-spring">
            我是 Anini
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8, ease: 'easeOut' }}
          className="text-lg md:text-xl mb-10 leading-relaxed max-w-lg"
          style={{ color: '#4A6B4A' }}
        >
          <span className="font-semibold" style={{ color: '#6DB33F' }}>
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
          transition={{ delay: 1.1, duration: 0.8, ease: 'easeOut' }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <SoftButton href="#projects">查看作品</SoftButton>
          <SoftButton href="#contact" variant="outline">
            联系我
          </SoftButton>
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
            border: '2px solid rgba(109, 179, 63, 0.4)',
          }}
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: 'rgba(109, 179, 63, 0.5)' }}
          />
        </div>
      </motion.div>
    </section>
  );
}
