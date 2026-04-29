import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { label: '首页', href: '#' },
  { label: '关于', href: '#about' },
  { label: '技能', href: '#skills' },
  { label: '项目', href: '#projects' },
  { label: '博客', href: '#blog' },
  { label: '联系', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(247, 249, 244, 0.9)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(168, 230, 207, 0.25)' : '1px solid transparent',
        }}
      >
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="text-xl font-bold text-gradient-cyan-purple">
            Anini
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="relative px-4 py-2 text-sm font-medium transition-colors group"
                style={{ color: '#5A6B6B' }}
              >
                <span className="group-hover:text-[#2D3A3A] transition-colors">
                  {item.label}
                </span>
                <span
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] group-hover:w-4/5 transition-all duration-300 rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, #8BC48A, #7EC8E3)',
                    boxShadow: '0 0 8px rgba(126, 200, 227, 0.25)',
                  }}
                />
              </a>
            ))}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
          >
            <span
              className="w-6 h-[2px] transition-all duration-300"
              style={{
                background: '#8BC48A',
                transform: mobileOpen ? 'rotate(45deg) translateY(4px)' : 'none',
              }}
            />
            <span
              className="w-6 h-[2px] transition-all duration-300"
              style={{
                background: '#8BC48A',
                opacity: mobileOpen ? 0 : 1,
              }}
            />
            <span
              className="w-6 h-[2px] transition-all duration-300"
              style={{
                background: '#8BC48A',
                transform: mobileOpen ? 'rotate(-45deg) translateY(-4px)' : 'none',
              }}
            />
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 md:hidden flex flex-col items-center justify-center gap-6"
            style={{
              background: 'rgba(247, 249, 244, 0.98)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {navItems.map((item, i) => (
              <motion.a
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="text-2xl font-bold"
                style={{ color: '#2D3A3A' }}
              >
                {item.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
