import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { skills, type Skill } from '../data/skills.tsx';

interface CircleCellProps {
  skill: Skill;
  index: number;
  isInView: boolean;
}

function CircleCell({ skill, index, isInView }: CircleCellProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{
        delay: index * 0.1,
        duration: 0.6,
        type: 'spring',
        stiffness: 150,
        damping: 18,
      }}
      className="relative"
      style={{ perspective: '600px' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="flex flex-col items-center justify-center transition-all duration-400 cursor-none"
        style={{
          width: 120,
          height: 120,
          borderRadius: 24,
          background: isHovered
            ? `linear-gradient(135deg, rgba(255,255,255,0.9), ${skill.color}18)`
            : 'rgba(255, 255, 255, 0.75)',
          border: `1.5px solid ${isHovered ? skill.color : 'rgba(168, 230, 207, 0.4)'}`,
          boxShadow: isHovered
            ? `0 8px 32px ${skill.color}25, 0 2px 8px rgba(0,0,0,0.06)`
            : '0 4px 20px rgba(139, 196, 138, 0.12), 0 1px 4px rgba(0, 0, 0, 0.04)',
          transform: isHovered ? 'translateZ(15px) scale(1.05)' : 'translateZ(0)',
          backdropFilter: 'blur(10px)',
        }}
        whileHover={{ y: -4 }}
      >
        <div
          className="mb-1.5 transition-transform duration-300"
          style={{
            color: isHovered ? skill.color : '#8FA0A0',
            transform: isHovered ? 'scale(1.15)' : 'scale(1)',
          }}
        >
          {skill.icon}
        </div>
        <div
          className="text-xs font-semibold transition-colors duration-300"
          style={{ color: isHovered ? '#2D3A3A' : '#5A6B6B' }}
        >
          {skill.name}
        </div>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="text-[11px] font-medium mt-0.5"
            style={{ color: skill.color }}
          >
            {skill.level}%
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

interface FloatingLeafProps {
  delay: number;
  left: string;
  color: string;
  size: number;
  duration: number;
}

function FloatingLeaf({ delay, left, color, size, duration }: FloatingLeafProps) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left,
        top: '-10%',
        width: size,
        height: size * 0.6,
        background: color,
        opacity: 0.15,
        borderRadius: '50% 0 50% 0',
      }}
      animate={{
        y: ['0%', '120vh'],
        rotate: [0, 360],
        x: [0, 20, -20, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
}

export default function TechStack() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  // Arrange skills in circular/organic pattern rows
  const rows: Skill[][] = [];
  const rowSizes = [3, 3, 2];
  let idx = 0;
  for (const size of rowSizes) {
    rows.push(skills.slice(idx, idx + size));
    idx += size;
  }

  return (
    <section id="skills" className="section-padding relative overflow-hidden" ref={sectionRef}>
      {/* Background floating leaves */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <FloatingLeaf delay={0} left="10%" color="#8BC48A" size={12} duration={14} />
        <FloatingLeaf delay={3} left="25%" color="#FFB7C5" size={10} duration={18} />
        <FloatingLeaf delay={6} left="60%" color="#8BC48A" size={14} duration={16} />
        <FloatingLeaf delay={9} left="80%" color="#FFB7C5" size={11} duration={20} />
        <FloatingLeaf delay={12} left="45%" color="#8BC48A" size={13} duration={15} />
      </div>

      {/* Soft background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(168, 230, 207, 0.08) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Section title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4"
            style={{
              background: 'rgba(126, 200, 227, 0.12)',
              color: '#5A6B6B',
              border: '1px solid rgba(126, 200, 227, 0.3)',
            }}
          >
            技术栈
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#2D3A3A]">
            我的工具箱
          </h2>
        </motion.div>

        {/* Circular card grid */}
        <div className="flex flex-col items-center gap-4">
          {rows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="flex gap-4 justify-center flex-wrap"
            >
              {row.map((skill, cellIndex) => (
                <CircleCell
                  key={skill.name}
                  skill={skill}
                  index={rowIndex * 4 + cellIndex}
                  isInView={isInView}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
