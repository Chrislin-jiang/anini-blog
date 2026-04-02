import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { projects } from '../data/projects';

export default function ProjectCards() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section id="projects" className="section-padding relative" ref={sectionRef}>
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#F0EDFF]/30 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Section title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#A8E6CF]/30 text-emerald-700 text-sm font-medium mb-4">
            精选项目
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E]">
            我做过的一些东西
          </h2>
        </motion.div>

        {/* Project grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <motion.a
              key={project.title}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="glass-card overflow-hidden group block"
            >
              {/* Gradient header bar with project image */}
              <div className={`h-36 bg-gradient-to-br ${project.color} flex items-center justify-center relative overflow-hidden`}>
                {/* Project image as background */}
                {project.image && (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                {/* Gradient overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40" />
                {/* Abstract pattern - only show when no image */}
                {!project.image && (
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-4 right-4 w-20 h-20 rounded-full border-4 border-white/30" />
                    <div className="absolute bottom-4 left-4 w-12 h-12 rounded-2xl border-4 border-white/20 rotate-12" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-4 border-white/10" />
                  </div>
                )}
                {/* First letter fallback when no image */}
                {!project.image && (
                  <span className="text-white/90 text-5xl font-bold relative z-10 group-hover:scale-110 transition-transform duration-300">
                    {project.title.charAt(0)}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-[#1A1A2E] mb-2 group-hover:text-[#4A6CF7] transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-[#6B7280] mb-4 leading-relaxed line-clamp-2">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-[#4A6CF7]/8 text-[#4A6CF7] text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
