import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { posts } from '../data/posts';

export default function BlogList() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const tilt = useTransform(scrollYProgress, [0, 0.5, 1], [8, 0, -8]);

  const categoryColors: Record<string, string> = {
    面试: '#FF0080',
    CSS: '#00F0FF',
    React: '#B829F7',
    技术: '#00F0FF',
    设计: '#B829F7',
    随笔: '#FF0080',
  };

  return (
    <section id="blog" className="section-padding relative" ref={sectionRef}>
      <div className="relative z-10 max-w-3xl mx-auto">
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
              background: 'rgba(255, 234, 0, 0.1)',
              color: '#FFE600',
              border: '1px solid rgba(255, 234, 0, 0.2)',
            }}
          >
            博客
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#F0F0F5]">
            最近的想法
          </h2>
        </motion.div>

        {/* Tilted list */}
        <motion.div
          style={{
            perspective: 1000,
            rotateX: tilt,
          }}
          className="space-y-4"
        >
          {posts.map((post, i) => {
            const catColor = categoryColors[post.category] || '#8A8A9A';

            return (
              <motion.a
                key={post.title}
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                whileHover={{
                  z: 30,
                  transition: { duration: 0.3 },
                }}
                className="glow-card p-5 md:p-6 flex items-start gap-4 group block"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Pulse line */}
                <div
                  className="shrink-0 w-1 h-12 rounded-full transition-all duration-300 group-hover:h-16"
                  style={{
                    background: `linear-gradient(180deg, ${catColor}, ${catColor}40)`,
                    boxShadow: `0 0 10px ${catColor}40`,
                  }}
                />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span
                      className="px-3 py-0.5 rounded-full text-xs font-medium"
                      style={{
                        background: `${catColor}15`,
                        color: catColor,
                        border: `1px solid ${catColor}30`,
                      }}
                    >
                      {post.category}
                    </span>
                    <span className="text-xs" style={{ color: '#5A5A6A' }}>
                      {post.date}
                    </span>
                  </div>
                  <h3
                    className="font-semibold group-hover:transition-colors mb-1 truncate"
                    style={{ color: '#F0F0F5' }}
                  >
                    <span className="group-hover:text-[#00F0FF] transition-colors">
                      {post.title}
                    </span>
                  </h3>
                  <p className="text-sm line-clamp-1" style={{ color: '#8A8A9A' }}>
                    {post.summary}
                  </p>
                </div>

                {/* Arrow */}
                <div
                  className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1"
                  style={{
                    background: 'rgba(0, 240, 255, 0.1)',
                    border: '1px solid rgba(0, 240, 255, 0.2)',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00F0FF" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </motion.a>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
