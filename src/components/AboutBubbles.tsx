import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

interface BubbleProps {
  text: string;
  side: 'left' | 'right';
  delay: number;
  emoji?: string;
}

function Bubble({ text, side, delay, emoji }: BubbleProps) {
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
      <div className={side === 'right' ? 'chat-bubble chat-bubble-right' : 'chat-bubble'}>
        <p className="text-[15px] leading-relaxed">
          {emoji && <span className="mr-1">{emoji}</span>}
          {text}
        </p>
      </div>
    </motion.div>
  );
}

export default function AboutBubbles() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const bubbles: BubbleProps[] = [
    { text: '跨专业自学前端，目前在滴滴做前端开发', side: 'left', delay: 0.1, emoji: '😊' },
    { text: '主要技术栈 React + TypeScript，也熟悉 Vue / Webpack', side: 'right', delay: 0.3, emoji: '🚀' },
    { text: '掘金写了 52 篇文章，15 万+ 阅读，2024 年度人气作者', side: 'left', delay: 0.5, emoji: '✨' },
    { text: '做过可视化搭建平台、富文本编辑器、组件库等项目', side: 'right', delay: 0.7, emoji: '🎯' },
    { text: '喜欢建立知识体系，用输出倒逼输入', side: 'left', delay: 0.9, emoji: '📝' },
    { text: '最近在AI探索中...', side: 'right', delay: 1.1, emoji: '🤖' },
    { text: '路阻且长，行则将至。坚定方向，坚持学习', side: 'left', delay: 1.1, emoji: '💡' },
  ];

  return (
    <section id="about" className="section-padding relative" ref={sectionRef}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#E8F4FD]/50 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Section title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#4A6CF7]/10 text-[#4A6CF7] text-sm font-medium mb-4">
            关于我
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E]">
            用对话了解我
          </h2>
        </motion.div>

        {/* Avatar in center */}
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="flex justify-center mb-10"
        >
          <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-lg animate-float-slow">
            <img src="/images/avatar.png" alt="Anini's avatar" className="w-full h-full object-cover" />
          </div>
        </motion.div>

        {/* Chat bubbles */}
        <div className="space-y-5">
          {bubbles.map((bubble, i) => (
            <Bubble key={i} {...bubble} />
          ))}
        </div>
      </div>
    </section>
  );
}
