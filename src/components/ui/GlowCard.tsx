import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  glowColor?: 'mint' | 'sky' | 'petal';
}

export default function GlowCard({
  children,
  className = '',
  delay = 0,
  glowColor = 'mint',
}: GlowCardProps) {
  const glowColors = {
    mint: 'rgba(109, 179, 63, 0.2)',
    sky: 'rgba(91, 163, 217, 0.2)',
    petal: 'rgba(244, 208, 63, 0.2)',
  };

  const borderColors = {
    mint: 'rgba(109, 179, 63, 0.5)',
    sky: 'rgba(91, 163, 217, 0.5)',
    petal: 'rgba(244, 208, 63, 0.5)',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{
        y: -4,
        transition: { duration: 0.3 },
      }}
      className={`${className}`}
      style={{
        background: 'rgba(255, 255, 255, 0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${borderColors[glowColor]}`,
        borderRadius: 20,
        boxShadow: `0 4px 20px ${glowColors[glowColor]}, 0 1px 4px rgba(0,0,0,0.04)`,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {children}
    </motion.div>
  );
}
