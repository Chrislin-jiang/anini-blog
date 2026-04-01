import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { skills } from '../data/skills';

interface ProgressRingProps {
  percentage: number;
  color: string;
  size?: number;
  strokeWidth?: number;
  animate: boolean;
}

function ProgressRing({ percentage, color, size = 80, strokeWidth = 6, animate }: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (animate ? (percentage / 100) * circumference : 0);

  return (
    <svg width={size} height={size} className="block">
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#E8F0FE"
        strokeWidth={strokeWidth}
      />
      {/* Progress circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        className="progress-ring-circle"
        style={{
          strokeDasharray: circumference,
          strokeDashoffset: offset,
        }}
      />
    </svg>
  );
}

export default function TechStack() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [animateRings, setAnimateRings] = useState(false);

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setAnimateRings(true), 300);
      return () => clearTimeout(timer);
    }
  }, [isInView]);

  return (
    <section id="skills" className="section-padding relative" ref={sectionRef}>
      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Section title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#7B61FF]/10 text-[#7B61FF] text-sm font-medium mb-4">
            技术栈
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E]">
            我的工具箱
          </h2>
        </motion.div>

        {/* Skills grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
          {skills.map((skill, i) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="glass-card p-6 flex flex-col items-center text-center group cursor-default"
            >
              {/* Progress ring with icon */}
              <div className="relative mb-4">
                <ProgressRing
                  percentage={skill.level}
                  color={skill.color}
                  size={80}
                  strokeWidth={5}
                  animate={animateRings}
                />
                <span className="absolute inset-0 flex items-center justify-center text-2xl">
                  {skill.icon}
                </span>
              </div>

              {/* Name */}
              <h3 className="font-semibold text-[#1A1A2E] text-sm mb-1">
                {skill.name}
              </h3>

              {/* Percentage */}
              <span className="text-xs text-[#9CA3AF] group-hover:text-[#4A6CF7] transition-colors">
                {skill.level}%
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
