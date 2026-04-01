import { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: '关于', href: '#about' },
    { label: '技能', href: '#skills' },
    { label: '项目', href: '#projects' },
    { label: '博客', href: '#blog' },
    { label: '联系', href: '#contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-[0_2px_20px_rgba(74,108,247,0.08)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="text-xl font-bold bg-gradient-to-r from-[#4A6CF7] to-[#7B61FF] bg-clip-text text-transparent">
          Anini.dev
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-[#6B7280] hover:text-[#4A6CF7] transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.5"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`w-5 h-0.5 bg-[#4A6CF7] rounded transition-all ${menuOpen ? 'rotate-45 translate-y-1' : ''}`} />
          <span className={`w-5 h-0.5 bg-[#4A6CF7] rounded transition-all ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`w-5 h-0.5 bg-[#4A6CF7] rounded transition-all ${menuOpen ? '-rotate-45 -translate-y-1' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-white/40 px-6 py-4 space-y-3">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="block text-sm font-medium text-[#6B7280] hover:text-[#4A6CF7] transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
