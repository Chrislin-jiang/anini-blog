import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { posts } from '../data/posts';

export default function BlogList() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

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
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#FFEAA7]/40 text-amber-700 text-sm font-medium mb-4">
            博客
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E]">
            最近的想法
          </h2>
        </motion.div>

        {/* Post list */}
        <div className="space-y-4">
          {posts.map((post, i) => (
            <motion.a
              key={post.title}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="glass-card p-5 md:p-6 flex items-start gap-4 group block"
            >
              {/* Category badge */}
              <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium ${post.categoryColor}`}>
                {post.category}
              </span>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[#1A1A2E] group-hover:text-[#4A6CF7] transition-colors mb-1 truncate">
                  {post.title}
                </h3>
                <p className="text-sm text-[#9CA3AF] line-clamp-1">
                  {post.summary}
                </p>
              </div>

              {/* Date */}
              <span className="shrink-0 text-xs text-[#9CA3AF] hidden md:block">
                {post.date}
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
