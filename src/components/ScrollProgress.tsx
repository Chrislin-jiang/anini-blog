import { useEffect, useState } from 'react';

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(0);

  const sections = [
    { color: '#8BC48A', id: 'hero' },
    { color: '#7EC8E3', id: 'about' },
    { color: '#A8E6CF', id: 'skills' },
    { color: '#FFB7C5', id: 'projects' },
    { color: '#FFD93D', id: 'blog' },
    { color: '#C9B1FF', id: 'contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(scrollPercent);

      // Determine active section
      let currentSection = 0;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el && el.offsetTop <= scrollTop + window.innerHeight / 2) {
          currentSection = i;
          break;
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Right side vertical progress */}
      <div className="scroll-progress-track hidden md:block">
        <div
          className="scroll-progress-fill"
          style={{ height: `${progress}%` }}
        />
        {/* Section markers */}
        {sections.map((section, i) => {
          const markerPos = (i / (sections.length - 1)) * 100;
          return (
            <div
              key={section.id}
              className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full transition-all duration-300"
              style={{
                top: `${markerPos}%`,
                background: activeSection === i ? section.color : 'rgba(139,196,138,0.15)',
                boxShadow:
                  activeSection === i
                    ? `0 0 8px ${section.color}80`
                    : 'none',
                transform: `translateX(-50%) scale(${activeSection === i ? 1.5 : 1})`,
              }}
            />
          );
        })}
      </div>

      {/* Top horizontal progress (mobile) */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-[9999] md:hidden">
        <div
          className="h-full transition-all duration-100"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #8BC48A, #7EC8E3, #FFB7C5)',
            boxShadow: '0 0 10px rgba(126, 200, 227, 0.25)',
          }}
        />
      </div>
    </>
  );
}
