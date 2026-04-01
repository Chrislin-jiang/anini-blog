import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden section-padding pt-32">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating shapes - Toss style */}
        <div className="absolute top-20 left-[10%] w-16 h-16 rounded-full bg-gradient-to-br from-[#4A6CF7]/20 to-[#7B61FF]/20 animate-float" />
        <div className="absolute top-40 right-[15%] w-12 h-12 rounded-2xl bg-gradient-to-br from-[#A8E6CF]/30 to-[#74B9FF]/30 animate-float-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-40 left-[20%] w-10 h-10 rounded-full bg-gradient-to-br from-[#FFB3BA]/30 to-[#FFEAA7]/30 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-60 left-[5%] w-8 h-8 rounded-xl bg-gradient-to-br from-[#FFEAA7]/30 to-[#FFB3BA]/30 animate-float-slow" style={{ animationDelay: '3s' }} />
        <div className="absolute bottom-60 right-[10%] w-14 h-14 rounded-full bg-gradient-to-br from-[#74B9FF]/20 to-[#A8E6CF]/20 animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-32 right-[35%] w-6 h-6 rounded-full bg-[#4A6CF7]/15 animate-float-slow" style={{ animationDelay: '0.5s' }} />

        {/* Large gradient orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#4A6CF7]/5 to-[#7B61FF]/5 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
        {/* 3D Avatar placeholder - large circle with gradient */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
          className="relative mb-10"
        >
          <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden animate-float shadow-[0_0_60px_rgba(74,108,247,0.3)]">
            <img src="/images/avatar.png" alt="Lin's avatar" className="w-full h-full object-cover" />
          </div>
          {/* Orbit ring */}
          <div className="absolute inset-[-12px] rounded-full border-2 border-dashed border-[#4A6CF7]/20 animate-spin-slow" />
          {/* Small floating icons */}
          <div className="absolute -top-2 -right-2 w-12 h-12 rounded-2xl bg-white shadow-lg flex items-center justify-center text-xl animate-float-slow">
            ⚛️
          </div>
          <div className="absolute -bottom-1 -left-3 w-10 h-10 rounded-xl bg-white shadow-lg flex items-center justify-center text-lg animate-float" style={{ animationDelay: '1s' }}>
            🎨
          </div>
        </motion.div>

        {/* Greeting */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-3"
        >
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/60 backdrop-blur-sm text-sm font-medium text-[#4A6CF7] shadow-sm border border-white/40">
            <span className="animate-wave inline-block">👋</span>
            你好，欢迎来到我的空间
          </span>
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-5xl md:text-7xl font-extrabold mb-5 bg-gradient-to-r from-[#1A1A2E] via-[#4A6CF7] to-[#7B61FF] bg-clip-text text-transparent"
        >
          我是 Lin
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-lg md:text-xl text-[#6B7280] mb-10 leading-relaxed max-w-lg"
        >
          一个热爱创造的<span className="text-[#4A6CF7] font-semibold">前端工程师</span>
          <br />
          用代码构建美好的用户体验
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <a href="#projects" className="gradient-btn">
            查看作品
          </a>
          <a href="#contact" className="gradient-btn-outline">
            联系我
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 rounded-full border-2 border-[#4A6CF7]/30 flex items-start justify-center p-1.5">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1.5 h-1.5 rounded-full bg-[#4A6CF7]/50"
          />
        </div>
      </motion.div>
    </section>
  );
}
