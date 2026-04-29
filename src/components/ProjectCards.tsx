import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState, useCallback, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import { projects } from '../data/projects.tsx';

// Slide animation variants
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 600 : -600,
    opacity: 0,
    scale: 0.92,
    filter: 'blur(8px)',
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    zIndex: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -600 : 600,
    opacity: 0,
    scale: 0.92,
    filter: 'blur(8px)',
    zIndex: 0,
  }),
};

export default function ProjectCards() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const dragStartX = useRef(0);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const project = projects[activeIndex];

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setActiveIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setDirection(1);
    setActiveIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
  }, []);

  const goTo = useCallback((index: number) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  }, [activeIndex]);

  // Touch swipe support
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    dragStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const diff = dragStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
  }, [handleNext, handlePrev]);

  // Auto-play every 5s, pause on hover
  const startAutoPlay = useCallback(() => {
    autoPlayRef.current = setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
    }, 5000);
  }, []);

  const stopAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
  }, []);

  useEffect(() => {
    startAutoPlay();
    return stopAutoPlay;
  }, [startAutoPlay, stopAutoPlay]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handlePrev, handleNext]);

  return (
    <section id="projects" className="section-padding relative" ref={sectionRef}>
      {/* Background accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(244, 208, 63, 0.08) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Section title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4"
            style={{
              background: 'rgba(244, 208, 63, 0.15)',
              color: '#4A6B4A',
              border: '1px solid rgba(244, 208, 63, 0.3)',
            }}
          >
            精选项目
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#2C3E2D]">
            我做过的一些东西
          </h2>
        </motion.div>

        {/* Main showcase area */}
        <div
          className="relative"
          onMouseEnter={stopAutoPlay}
          onMouseLeave={startAutoPlay}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Card container */}
          <div className="relative overflow-hidden rounded-3xl" style={{ minHeight: 280 }}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={activeIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 35 },
                  opacity: { duration: 0.3 },
                  scale: { duration: 0.4 },
                  filter: { duration: 0.3 },
                }}
              >
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <div
                    className="rounded-3xl overflow-hidden"
                    style={{
                      background: 'rgba(255, 255, 255, 0.8)',
                      border: '1px solid rgba(109, 179, 63, 0.4)',
                      boxShadow: '0 8px 40px rgba(109, 179, 63, 0.12), 0 2px 8px rgba(0,0,0,0.04)',
                      backdropFilter: 'blur(20px)',
                    }}
                  >
                    {/* Two-column layout on desktop */}
                    <div className="flex flex-col md:flex-row">
                      {/* Image section with parallax hover */}
                      <div
                        className={`relative h-48 md:h-[280px] md:w-[45%] overflow-hidden bg-gradient-to-br ${project.color}`}
                      >
                        {project.image ? (
                          <motion.img
                            src={project.image}
                            alt={project.title}
                            className="absolute inset-0 w-full h-full object-cover"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.6 }}
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-8xl font-bold text-white/10">
                              {project.title.charAt(0)}
                            </span>
                          </div>
                        )}
                        {/* Gradient overlay */}
                        <div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background: 'linear-gradient(135deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.15) 100%)',
                          }}
                        />

                        {/* Project number badge */}
                        <div
                          className="absolute top-4 left-4 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                          style={{
                            background: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(10px)',
                            color: '#2C3E2D',
                            boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
                          }}
                        >
                          {String(activeIndex + 1).padStart(2, '0')}
                        </div>

                        {/* External link icon */}
                        <div
                          className="absolute top-4 right-4 w-10 h-10 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-y-0 translate-y-2"
                          style={{
                            background: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(10px)',
                            boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
                          }}
                        >
                          <ExternalLink size={16} style={{ color: '#4A6B4A' }} />
                        </div>
                      </div>

                      {/* Content section */}
                      <div className="flex-1 p-5 md:p-6 flex flex-col justify-center">
                        <h3
                          className="text-lg md:text-xl font-bold mb-2 group-hover:text-[#5BA3D9] transition-colors duration-300"
                          style={{ color: '#2C3E2D' }}
                        >
                          {project.title}
                        </h3>

                        <div
                          className="text-sm mb-4 leading-relaxed line-clamp-3 md:line-clamp-4"
                          style={{ color: '#4A6B4A' }}
                        >
                          {project.description}
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1 rounded-full text-xs font-medium"
                              style={{
                                background: 'rgba(109, 179, 63, 0.15)',
                                color: '#4A6B4A',
                                border: '1px solid rgba(109, 179, 63, 0.3)',
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* View project link */}
                        <div className="flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all duration-300" style={{ color: '#5BA3D9' }}>
                          <span>查看项目</span>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation arrows - positioned outside the card */}
          <button
            onClick={handlePrev}
            className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid rgba(109, 179, 63, 0.4)',
              boxShadow: '0 4px 20px rgba(109, 179, 63, 0.15)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4A6B4A" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            onClick={handleNext}
            className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid rgba(109, 179, 63, 0.4)',
              boxShadow: '0 4px 20px rgba(109, 179, 63, 0.15)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4A6B4A" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Bottom navigation: progress bar + thumbnails */}
        <div className="mt-8 flex flex-col items-center gap-4">
          {/* Thumbnail strip */}
          <div className="flex gap-3 justify-center">
            {projects.map((p, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="relative rounded-xl overflow-hidden transition-all duration-400"
                style={{
                  width: i === activeIndex ? 72 : 48,
                  height: i === activeIndex ? 48 : 36,
                  opacity: i === activeIndex ? 1 : 0.5,
                  border: i === activeIndex
                    ? '2px solid rgba(91, 163, 217, 0.6)'
                    : '1.5px solid rgba(109, 179, 63, 0.3)',
                  boxShadow: i === activeIndex
                    ? '0 4px 16px rgba(91, 163, 217, 0.25)'
                    : 'none',
                }}
              >
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className={`w-full h-full bg-gradient-to-br ${p.color} flex items-center justify-center`}
                  >
                    <span className="text-white/40 text-xs font-bold">
                      {p.title.charAt(0)}
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Progress bar */}
          <div
            className="w-48 h-1 rounded-full overflow-hidden"
            style={{ background: 'rgba(109, 179, 63, 0.15)' }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, #6DB33F, #5BA3D9)',
              }}
              animate={{
                width: `${((activeIndex + 1) / projects.length) * 100}%`,
              }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>

          {/* Counter */}
          <div className="text-xs font-medium" style={{ color: '#7A9A7A' }}>
            <span style={{ color: '#5BA3D9', fontWeight: 700 }}>
              {String(activeIndex + 1).padStart(2, '0')}
            </span>
            {' / '}
            {String(projects.length).padStart(2, '0')}
          </div>
        </div>
      </div>
    </section>
  );
}
