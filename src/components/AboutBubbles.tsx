import { motion, useInView } from 'framer-motion';
import { useRef, type ReactNode } from 'react';
import { Smile, Rocket, Sparkles, Target, FileText, Bot, Lightbulb } from 'lucide-react';
import SkillPlanet from './3d/SkillPlanet';

interface BubbleProps {
  text: string;
  side: 'left' | 'right';
  delay: number;
  icon?: ReactNode;
}

function Bubble({ text, side, delay, icon }: BubbleProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.8 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay, duration: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
      className={`flex ${side === 'right' ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className="max-w-[320px] relative px-5 py-4 text-[15px] leading-relaxed"
        style={{
          background:
            side === 'right'
              ? 'linear-gradient(135deg, rgba(168, 230, 207, 0.2), rgba(255, 183, 197, 0.15))'
              : 'rgba(255, 255, 255, 0.8)',
          borderRadius: side === 'right' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
          border: `1px solid ${
            side === 'right'
              ? 'rgba(168, 230, 207, 0.3)'
              : 'rgba(168, 230, 207, 0.25)'
          }`,
          color: side === 'right' ? '#2D3A3A' : '#5A6B6B',
          boxShadow:
            side === 'right'
              ? '0 4px 20px rgba(168, 230, 207, 0.15)'
              : '0 4px 16px rgba(139, 196, 138, 0.1)',
        }}
      >
        <p>
          {icon && <span className="mr-1 inline-flex align-middle">{icon}</span>}
          {text}
        </p>
      </div>
    </motion.div>
  );
}

export default function AboutBubbles() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const bubbles = [
    { text: '跨专业自学前端，目前在滴滴做前端开发', side: 'left' as const, delay: 0.1, icon: <Smile size={16} /> },
    { text: '主要技术栈 React + TypeScript，也熟悉 Vue / Webpack', side: 'right' as const, delay: 0.3, icon: <Rocket size={16} /> },
    { text: '掘金写了 52 篇文章，15 万+ 阅读，2024 年度人气作者', side: 'left' as const, delay: 0.5, icon: <Sparkles size={16} /> },
    { text: '做过可视化搭建平台、富文本编辑器、组件库等项目', side: 'right' as const, delay: 0.7, icon: <Target size={16} /> },
    { text: '喜欢建立知识体系，用输出倒逼输入', side: 'left' as const, delay: 0.9, icon: <FileText size={16} /> },
    { text: '最近在AI探索中...', side: 'right' as const, delay: 1.1, icon: <Bot size={16} /> },
    { text: '路阻且长，行则将至。坚定方向，坚持学习', side: 'left' as const, delay: 1.3, icon: <Lightbulb size={16} /> },
  ];

  return (
    <section id="about" className="section-padding relative" ref={sectionRef}>
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 30%, rgba(168, 230, 207, 0.12) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Section title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4"
            style={{
              background: 'rgba(168, 230, 207, 0.15)',
              color: '#5A6B6B',
              border: '1px solid rgba(168, 230, 207, 0.35)',
            }}
          >
            关于我
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#2D3A3A]">
            用对话了解我
          </h2>
        </motion.div>

        {/* 3D Skill Planet */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-16"
        >
          <SkillPlanet />
        </motion.div>

        {/* Orbiting text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-sm tracking-widest" style={{ color: '#5A5A6A' }}>
            跨专业自学前端 · 滴滴前端工程师 · 掘金人气作者 · 可视化爱好者
          </p>
        </motion.div>

        {/* Chat bubbles */}
        <div className="space-y-5 max-w-2xl mx-auto">
          {bubbles.map((bubble, i) => (
            <Bubble key={i} {...bubble} />
          ))}
        </div>
      </div>
    </section>
  );
}
