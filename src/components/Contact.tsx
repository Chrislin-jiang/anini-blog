import { motion, useInView } from 'framer-motion';
import { useRef, useState, useCallback } from 'react';

type Choice = 'rock' | 'paper' | 'scissors';
type Result = 'win' | 'lose' | 'draw' | null;

const choices: { id: Choice; emoji: string; label: string }[] = [
  { id: 'rock', emoji: '✊', label: '石头' },
  { id: 'paper', emoji: '✋', label: '布' },
  { id: 'scissors', emoji: '✌️', label: '剪刀' },
];

const resultMap: Record<Choice, Choice> = {
  rock: 'scissors',
  scissors: 'paper',
  paper: 'rock',
};

const contactLinks = [
  { label: 'GitHub', icon: '🐙', href: 'https://github.com', color: 'from-gray-700 to-gray-900' },
  { label: '邮箱', icon: '📧', href: 'mailto:hello@lin.dev', color: 'from-[#4A6CF7] to-[#7B61FF]' },
  { label: '微信', icon: '💬', href: '#', color: 'from-emerald-500 to-green-600' },
  { label: '掘金', icon: '📘', href: 'https://juejin.cn', color: 'from-blue-500 to-blue-700' },
];

export default function Contact() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [aiChoice, setAiChoice] = useState<Choice | null>(null);
  const [result, setResult] = useState<Result>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [wins, setWins] = useState(0);

  const play = useCallback((choice: Choice) => {
    if (isPlaying) return;
    setIsPlaying(true);
    setPlayerChoice(choice);
    setResult(null);
    setAiChoice(null);

    // Animate delay
    setTimeout(() => {
      const aiPick = choices[Math.floor(Math.random() * 3)].id;
      setAiChoice(aiPick);

      if (choice === aiPick) {
        setResult('draw');
      } else if (resultMap[choice] === aiPick) {
        setResult('win');
        setWins((w) => w + 1);
      } else {
        setResult('lose');
      }
      setIsPlaying(false);
    }, 800);
  }, [isPlaying]);

  const resultText = {
    win: '🎉 你赢了！',
    lose: '😅 你输了，再来！',
    draw: '🤝 平局，再试试？',
  };

  return (
    <section id="contact" className="section-padding relative" ref={sectionRef}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#E8F0FE]/60 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Section title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#FFB3BA]/30 text-pink-700 text-sm font-medium mb-4">
            联系我
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E]">
            找到我
          </h2>
        </motion.div>

        {/* Contact links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-4 mb-14"
        >
          {contactLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card px-6 py-4 flex flex-col items-center gap-2 min-w-[100px] group"
            >
              <span className="text-2xl group-hover:scale-125 transition-transform">{link.icon}</span>
              <span className="text-sm font-medium text-[#6B7280] group-hover:text-[#4A6CF7] transition-colors">
                {link.label}
              </span>
            </a>
          ))}
        </motion.div>

        {/* Rock Paper Scissors game */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="glass-card p-8 text-center"
        >
          <h3 className="text-lg font-bold text-[#1A1A2E] mb-2">
            🎮 来一局猜拳？
          </h3>
          <p className="text-sm text-[#9CA3AF] mb-6">
            赢 3 局解锁隐藏彩蛋
          </p>

          {/* Choices */}
          <div className="flex justify-center gap-5 mb-6">
            {choices.map((c) => (
              <button
                key={c.id}
                onClick={() => play(c.id)}
                disabled={isPlaying}
                className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-3xl md:text-4xl transition-all duration-200 ${
                  playerChoice === c.id
                    ? 'bg-gradient-to-br from-[#4A6CF7] to-[#7B61FF] scale-110 shadow-lg'
                    : 'bg-[#F0F4FF] hover:bg-[#E8F0FE] hover:scale-105'
                } ${isPlaying ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {c.emoji}
              </button>
            ))}
          </div>

          {/* Result display */}
          <div className="h-20 flex flex-col items-center justify-center">
            {isPlaying && (
              <div className="text-3xl animate-bounce">🤜🤛</div>
            )}
            {result && aiChoice && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="space-y-1"
              >
                <p className="text-sm text-[#9CA3AF]">
                  对手出了 {choices.find((c) => c.id === aiChoice)?.emoji}
                </p>
                <p className="text-lg font-bold">{resultText[result]}</p>
              </motion.div>
            )}
          </div>

          {/* Win counter & Easter egg */}
          <div className="mt-4">
            <div className="flex justify-center gap-2 mb-3">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    wins >= n ? 'bg-[#4A6CF7]' : 'bg-[#E8F0FE]'
                  }`}
                />
              ))}
            </div>
            {wins >= 3 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-gradient-to-r from-[#4A6CF7]/10 to-[#7B61FF]/10 border border-[#4A6CF7]/20"
              >
                <p className="text-sm font-medium text-[#4A6CF7]">
                  🎊 恭喜解锁！这是我的座右铭：
                </p>
                <p className="text-lg font-bold text-[#1A1A2E] mt-1">
                  "Stay curious, keep building."
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
