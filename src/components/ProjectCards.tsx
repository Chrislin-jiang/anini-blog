import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import { projects } from '../data/projects';

export default function ProjectCards() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="projects" className="section-padding relative" ref={sectionRef}>
      {/* Background accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(255, 0, 128, 0.06) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto">
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
              background: 'rgba(255, 0, 128, 0.1)',
              color: '#FF0080',
              border: '1px solid rgba(255, 0, 128, 0.2)',
            }}
          >
            精选项目
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#F0F0F5]">
            我做过的一些东西
          </h2>
        </motion.div>

        {/* 3D Carousel */}
        <div
          className="relative h-[420px] md:h-[480px]"
          style={{ perspective: '1200px' }}
        >
          <AnimatePresence mode="popLayout" custom={direction}>
            {projects.map((project, i) => {
              const offset = i - activeIndex;
              const absOffset = Math.abs(offset);
              const isActive = i === activeIndex;

              // Wrap around for infinite loop feel
              let displayOffset = offset;
              if (offset > projects.length / 2) displayOffset -= projects.length;
              if (offset < -projects.length / 2) displayOffset += projects.length;

              if (absOffset > 2 && absOffset < projects.length - 2) return null;

              return (
                <motion.div
                  key={project.title}
                  custom={direction}
                  initial={{ opacity: 0, rotateY: direction > 0 ? 60 : -60 }}
                  animate={{
                    opacity: isActive ? 1 : 0.5 - absOffset * 0.15,
                    rotateY: displayOffset * 35,
                    x: displayOffset * 80,
                    z: -absOffset * 120,
                    scale: isActive ? 1 : 0.85 - absOffset * 0.05,
                  }}
                  exit={{ opacity: 0, rotateY: direction > 0 ? -60 : 60 }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                  }}
                  className="absolute top-0 left-1/2 w-full max-w-md"
                  style={{
                    transformStyle: 'preserve-3d',
                    marginLeft: '-50%',
                  }}
                >
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                  >
                    <div
                      className="glow-card overflow-hidden"
                      style={{
                        borderColor: isActive
                          ? 'rgba(0, 240, 255, 0.3)'
                          : 'rgba(255, 255, 255, 0.05)',
                      }}
                    >
                      {/* Image header */}
                      <div
                        className={`h-48 relative overflow-hidden bg-gradient-to-br ${project.color}`}
                      >
                        {project.image && (
                          <img
                            src={project.image}
                            alt={project.title}
                            className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0A0A12]/90" />
                        {!project.image && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-6xl font-bold text-white/20">
                              {project.title.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3
                          className="text-lg font-bold mb-2 transition-colors"
                          style={{ color: '#F0F0F5' }}
                        >
                          {project.title}
                        </h3>
                        <p className="text-sm mb-4 leading-relaxed line-clamp-2" style={{ color: '#8A8A9A' }}>
                          {project.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1 rounded-full text-xs font-medium"
                              style={{
                                background: 'rgba(0, 240, 255, 0.08)',
                                color: '#00F0FF',
                                border: '1px solid rgba(0, 240, 255, 0.15)',
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </a>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Navigation arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{
              background: 'rgba(10, 10, 18, 0.8)',
              border: '1px solid rgba(0, 240, 255, 0.2)',
              boxShadow: '0 0 15px rgba(0, 240, 255, 0.1)',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00F0FF" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{
              background: 'rgba(10, 10, 18, 0.8)',
              border: '1px solid rgba(0, 240, 255, 0.2)',
              boxShadow: '0 0 15px rgba(0, 240, 255, 0.1)',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00F0FF" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > activeIndex ? 1 : -1);
                setActiveIndex(i);
              }}
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{
                background: i === activeIndex ? '#00F0FF' : 'rgba(255,255,255,0.15)',
                boxShadow: i === activeIndex ? '0 0 10px rgba(0, 240, 255, 0.5)' : 'none',
                width: i === activeIndex ? 24 : 8,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
