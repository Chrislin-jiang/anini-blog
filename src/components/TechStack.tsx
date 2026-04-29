import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { skills, type Skill } from '../data/skills.tsx';

interface HexCellProps {
  skill: (typeof skills)[0];
  index: number;
  isInView: boolean;
}

function HexCell({ skill, index, isInView }: HexCellProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, rotateY: 90 }}
      animate={isInView ? { opacity: 1, rotateY: 0 } : {}}
      transition={{
        delay: index * 0.08,
        duration: 0.5,
        type: 'spring',
        stiffness: 200,
        damping: 20,
      }}
      className="relative"
      style={{ perspective: '600px' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="flex items-center justify-center transition-all duration-500"
        style={{
          width: 110,
          height: 126,
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          background: isHovered
            ? `${skill.color}18`
            : 'rgba(10, 10, 18, 0.8)',
          border: `2px solid ${isHovered ? skill.color : `${skill.color}30`}`,
          boxShadow: isHovered
            ? `0 0 25px ${skill.color}40, inset 0 0 20px ${skill.color}15`
            : 'none',
          transform: isHovered ? 'translateZ(20px) scale(1.05)' : 'translateZ(0)',
          cursor: 'none',
        }}
      >
        <div className="text-center">
          <div className="mb-1" style={{ color: skill.color }}>{skill.icon}</div>
          <div
            className="text-xs font-semibold"
            style={{ color: isHovered ? skill.color : '#8A8A9A' }}
          >
            {skill.name}
          </div>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-[10px] mt-0.5"
              style={{ color: skill.color }}
            >
              {skill.level}%
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function TechStack() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  // Arrange skills in honeycomb pattern
  const rows: Skill[][] = [];
  const rowSizes = [3, 3, 2];
  let idx = 0;
  for (const size of rowSizes) {
    rows.push(skills.slice(idx, idx + size));
    idx += size;
  }

  return (
    <section id="skills" className="section-padding relative" ref={sectionRef}>
      {/* Background code rain effect - simplified as gradient */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background:
            'linear-gradient(180deg, transparent 0%, rgba(0, 240, 255, 0.03) 50%, transparent 100%)',
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
              background: 'rgba(184, 41, 247, 0.1)',
              color: '#B829F7',
              border: '1px solid rgba(184, 41, 247, 0.2)',
            }}
          >
            技术栈
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#F0F0F5]">
            我的工具箱
          </h2>
        </motion.div>

        {/* Hexagon grid */}
        <div className="flex flex-col items-center gap-2">
          {rows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="flex gap-2"
              style={{
                marginLeft: rowIndex % 2 === 1 ? 0 : 57,
              }}
            >
              {row.map((skill, cellIndex) => (
                <HexCell
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
