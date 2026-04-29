import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { posts } from '../data/posts';

// Individual blog item with scroll-linked opacity/position
function BlogItem({
  post,
  index,
  isInView,
  catColor,
}: {
  post: (typeof posts)[0];
  index: number;
  isInView: boolean;
  catColor: string;
}) {
  const itemRef = useRef(null);
  const { scrollYProgress: itemProgress } = useScroll({
    target: itemRef,
    offset: ['start end', 'end start'],
  });

  // Items in the center of viewport are brightest, edges fade
  const itemOpacity = useTransform(itemProgress, [0, 0.3, 0.5, 0.7, 1], [0.5, 1, 1, 1, 0.5]);
  const itemY = useTransform(itemProgress, [0, 0.3, 0.7, 1], [10, 0, 0, -10]);

  return (
    <motion.a
      ref={itemRef}
      key={post.title}
      href={post.link}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.12, duration: 0.5 }}
      whileHover={{
        z: 20,
        scale: 1.01,
        transition: { duration: 0.25 },
      }}
      style={{
        transformStyle: 'preserve-3d',
        opacity: itemOpacity,
        y: itemY,
      }}
      className="glow-card p-5 md:p-6 flex items-start gap-4 group block"
    >
      {/* Pulse line - water drop decoration */}
      <div
        className="shrink-0 w-1.5 h-12 rounded-full transition-all duration-300 group-hover:h-16"
        style={{
          background: `linear-gradient(180deg, ${catColor}, ${catColor}30)`,
          boxShadow: `0 0 12px ${catColor}35`,
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
          className="font-semibold mb-1 truncate"
          style={{ color: '#2C3E2D' }}
        >
          <span className="group-hover:text-[#5BA3D9] transition-colors duration-300">
            {post.title}
          </span>
        </h3>
        <p className="text-sm line-clamp-1 group-hover:line-clamp-2 transition-all duration-300" style={{ color: '#4A6B4A' }}>
          {post.summary}
        </p>
      </div>

      {/* Arrow */}
      <div
        className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1"
        style={{
          background: 'rgba(109, 179, 63, 0.2)',
          border: '1px solid rgba(109, 179, 63, 0.4)',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6DB33F" strokeWidth="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
    </motion.a>
  );
}

export default function BlogList() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const categoryColors: Record<string, string> = {
    面试: '#F4D03F',
    CSS: '#5BA3D9',
    React: '#6DB33F',
    技术: '#5BA3D9',
    设计: '#B8D4E3',
    随笔: '#F5C542',
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
              background: 'rgba(255, 217, 61, 0.12)',
              color: '#4A6B4A',
              border: '1px solid rgba(255, 217, 61, 0.3)',
            }}
          >
            博客
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#2C3E2D]">
            最近的想法
          </h2>
        </motion.div>

        {/* Tilted list - Stream Flow Effect */}
        <motion.div
          style={{
            perspective: 1200,
            rotateX: useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [3, 0, 0, -3]),
          }}
          className="space-y-4"
        >
          {posts.map((post, i) => {
            const catColor = categoryColors[post.category] || '#8A8A9A';
            return (
              <BlogItem
                key={post.title}
                post={post}
                index={i}
                isInView={isInView}
                catColor={catColor}
              />
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
