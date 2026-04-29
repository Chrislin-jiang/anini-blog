import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  glowColor?: 'cyan' | 'purple' | 'pink';
}

export default function GlowCard({
  children,
  className = '',
  delay = 0,
  glowColor = 'cyan',
}: GlowCardProps) {
  const glowColors = {
    cyan: 'rgba(0, 240, 255, 0.12)',
    purple: 'rgba(184, 41, 247, 0.12)',
    pink: 'rgba(255, 0, 128, 0.12)',
  };

  const borderColors = {
    cyan: 'rgba(0, 240, 255, 0.25)',
    purple: 'rgba(184, 41, 247, 0.25)',
    pink: 'rgba(255, 0, 128, 0.25)',
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
        background: 'rgba(10, 10, 18, 0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${borderColors[glowColor]}`,
        borderRadius: 16,
        boxShadow: `0 0 20px ${glowColors[glowColor]}, inset 0 0 20px ${glowColors[glowColor]}`,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {children}
    </motion.div>
  );
}
