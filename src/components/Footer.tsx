export default function Footer() {
  return (
    <footer
      className="py-12 px-6 border-t"
      style={{
        borderColor: 'rgba(0, 240, 255, 0.08)',
        background: 'linear-gradient(180deg, transparent, rgba(0, 240, 255, 0.02))',
      }}
    >
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <span className="text-lg font-bold text-gradient-cyan-purple">Anini</span>
          <p className="text-sm mt-1" style={{ color: '#5A5A6A' }}>
            前端工程师 · 热爱创造
          </p>
        </div>

        <div className="flex items-center gap-6">
          {[
            { label: 'GitHub', href: 'https://github.com/Chrislin-jiang' },
            { label: '掘金', href: 'https://juejin.cn/user/1908407919207006' },
            { label: '博客园', href: 'https://www.cnblogs.com/chrislinlin/' },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm transition-colors hover:text-[#00F0FF]"
              style={{ color: '#8A8A9A' }}
            >
              {link.label}
            </a>
          ))}
        </div>

        <p className="text-xs" style={{ color: '#5A5A6A' }}>
          © {new Date().getFullYear()} Anini. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
