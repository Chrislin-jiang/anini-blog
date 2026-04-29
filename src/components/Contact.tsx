import { motion, useInView } from 'framer-motion';
import { useRef, useState, useCallback, useEffect, type ReactNode } from 'react';
import {
  Code2,
  Globe,
  BookOpen,
  FileText,
  GitBranch,
  Trophy,
  Frown,
  Equal,
  Sparkles,
  TreePine,
  Leaf,
} from 'lucide-react';

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
  { label: 'GitHub', icon: <Code2 size={24} />, href: 'https://github.com/Chrislin-jiang', color: '#5BA3D9' },
  { label: '古早站点', icon: <Globe size={24} />, href: 'https://chrislin-jiang.github.io/code-girl/', color: '#B8D4E3' },
  { label: '掘金', icon: <BookOpen size={24} />, href: 'https://juejin.cn/user/1908407919207006', color: '#F4D03F' },
  { label: '博客园', icon: <FileText size={24} />, href: 'https://www.cnblogs.com/chrislinlin/', color: '#6DB33F' },
  { label: 'Gitee', icon: <GitBranch size={24} />, href: 'https://gitee.com/chrislinlin', color: '#F5C542' },
];

const resultText = {
  win: '你赢了！🌸',
  lose: '你输了，再来！🍃',
  draw: '平局，再试试？🌿',
};

const resultIcons: Record<Exclude<Result, null>, ReactNode> = {
  win: <Trophy size={18} />,
  lose: <Frown size={18} />,
  draw: <Equal size={18} />,
};

// Typewriter chat bubble component
function ChatBubble({ text, side, delay }: { text: string; side: 'system' | 'player'; delay: number }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1));
          i++;
        } else {
          setDone(true);
          clearInterval(interval);
        }
      }, 30);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [text, delay]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: delay / 1000 }}
      className={`flex ${side === 'player' ? 'justify-end' : 'justify-start'} mb-2`}
    >
      <div
        className="max-w-[260px] px-4 py-2.5 text-sm leading-relaxed"
        style={{
          background: side === 'player'
            ? 'linear-gradient(135deg, rgba(109, 179, 63, 0.2), rgba(91, 163, 217, 0.15))'
            : 'rgba(255, 255, 255, 0.85)',
          borderRadius: side === 'player' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
          border: `1px solid ${side === 'player' ? 'rgba(109, 179, 63, 0.35)' : 'rgba(109, 179, 63, 0.25)'}`,
          color: '#2C3E2D',
          boxShadow: '0 2px 12px rgba(109, 179, 63, 0.08)',
        }}
      >
        {displayed}
        {!done && <span className="animate-pulse ml-0.5">|</span>}
      </div>
    </motion.div>
  );
}

export default function Contact() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [aiChoice, setAiChoice] = useState<Choice | null>(null);
  const [result, setResult] = useState<Result>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [wins, setWins] = useState(0);
  const [chatMessages, setChatMessages] = useState<
    { text: string; side: 'system' | 'player' }[]
  >([
    { text: '🌿 欢迎来到林间小亭，来玩一局猜拳吧！', side: 'system' },
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const addMessage = useCallback((text: string, side: 'system' | 'player') => {
    setChatMessages((prev) => [...prev.slice(-8), { text, side }]);
  }, []);

  const play = useCallback(
    (choice: Choice) => {
      if (isPlaying) return;
      setIsPlaying(true);
      setPlayerChoice(choice);
      setResult(null);
      setAiChoice(null);

      const choiceLabel = choices.find((c) => c.id === choice)?.label;
      addMessage(`我出 ${choiceLabel}！`, 'player');

      setTimeout(() => {
        const aiPick = choices[Math.floor(Math.random() * 3)].id;
        setAiChoice(aiPick);
        const aiLabel = choices.find((c) => c.id === aiPick)?.label;

        if (choice === aiPick) {
          setResult('draw');
          addMessage(`我也出了 ${aiLabel}，平局啦～ 再来一次？`, 'system');
        } else if (resultMap[choice] === aiPick) {
          setResult('win');
          setWins((w) => w + 1);
          addMessage(`我出了 ${aiLabel}，你赢了！好厉害 🌸`, 'system');
        } else {
          setResult('lose');
          addMessage(`我出了 ${aiLabel}，这次我赢啦～ 再试试？`, 'system');
        }
        setIsPlaying(false);
      }, 800);
    },
    [isPlaying, addMessage]
  );

  return (
    <section id="contact" className="section-padding relative" ref={sectionRef}>
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 70%, rgba(109, 179, 63, 0.08) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Section title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4"
            style={{
              background: 'rgba(244, 208, 63, 0.2)',
              color: '#4A6B4A',
              border: '1px solid rgba(244, 208, 63, 0.35)',
            }}
          >
            联系我
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#2C3E2D]">
            找到我
          </h2>
        </motion.div>

        {/* Pebble-style contact links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-6 mb-14"
        >
          {contactLinks.map((link, i) => (
            <motion.a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.08, duration: 0.5 }}
            >
              <div className="cube-link">
                <div
                  className="cube-face cube-front"
                  style={{
                    borderColor: `${link.color}40`,
                    boxShadow: `0 0 15px ${link.color}20`,
                  }}
                >
                  <span className="flex items-center justify-center" style={{ color: link.color }}>{link.icon}</span>
                </div>
                <div
                  className="cube-face cube-back"
                  style={{
                    borderColor: `${link.color}50`,
                  }}
                >
                  <span className="text-xs font-semibold" style={{ color: link.color }}>
                    {link.label}
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* Forest Pavilion Game Area */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="rounded-3xl overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.85), rgba(238,245,236,0.9))',
            border: '1px solid rgba(109, 179, 63, 0.4)',
            boxShadow: '0 8px 40px rgba(109, 179, 63, 0.12), 0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          {/* Pavilion header */}
          <div
            className="px-6 py-4 flex items-center gap-3"
            style={{
              background: 'linear-gradient(135deg, rgba(109, 179, 63, 0.2), rgba(253, 248, 243, 0.6))',
              borderBottom: '1px solid rgba(109, 179, 63, 0.25)',
            }}
          >
            <TreePine size={18} style={{ color: '#6DB33F' }} />
            <span className="text-sm font-semibold" style={{ color: '#2C3E2D' }}>
              林间小亭
            </span>
            <Leaf size={14} style={{ color: '#8CC63F' }} className="ml-auto" />
            <span className="text-xs" style={{ color: '#7A9A7A' }}>
              猜拳小游戏
            </span>
          </div>

          {/* Chat area */}
          <div
            className="px-6 py-5 max-h-[240px] overflow-y-auto"
            style={{ scrollbarWidth: 'thin' }}
          >
            {chatMessages.map((msg, i) => (
              <ChatBubble
                key={`${i}-${msg.text}`}
                text={msg.text}
                side={msg.side}
                delay={i === chatMessages.length - 1 ? 100 : 0}
              />
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Game controls */}
          <div
            className="px-6 py-5"
            style={{
              borderTop: '1px solid rgba(109, 179, 63, 0.2)',
              background: 'rgba(255, 255, 255, 0.5)',
            }}
          >
            <div className="flex justify-center gap-4 mb-4">
              {choices.map((c) => (
                <button
                  key={c.id}
                  onClick={() => play(c.id)}
                  disabled={isPlaying}
                  className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-300 ${
                    playerChoice === c.id ? 'scale-110' : 'hover:scale-105'
                  } ${isPlaying ? 'opacity-50' : ''}`}
                  style={{
                    background:
                      playerChoice === c.id
                        ? 'linear-gradient(135deg, rgba(109, 179, 63, 0.3), rgba(91, 163, 217, 0.2))'
                        : 'rgba(255, 255, 255, 0.8)',
                    border: `2px solid ${
                      playerChoice === c.id ? '#8CC63F' : 'rgba(109,179,63,0.3)'
                    }`,
                    boxShadow:
                      playerChoice === c.id
                        ? '0 4px 20px rgba(109, 179, 63, 0.3)'
                        : '0 2px 8px rgba(109, 179, 63, 0.08)',
                    borderRadius: 20,
                  }}
                >
                  <span className="text-2xl">{c.emoji}</span>
                  <span className="text-[10px] font-medium" style={{ color: '#4A6B4A' }}>
                    {c.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Result display */}
            <div className="h-12 flex flex-col items-center justify-center">
              {isPlaying && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-base flex items-center gap-2"
                  style={{ color: '#6DB33F' }}
                >
                  <Leaf size={14} className="animate-spin" style={{ animationDuration: '2s' }} />
                  思考中...
                </motion.div>
              )}
              {result && aiChoice && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="space-y-0.5 text-center"
                >
                  <p
                    className="text-lg font-bold flex items-center justify-center gap-1.5"
                    style={{
                      color:
                        result === 'win'
                          ? '#6DB33F'
                          : result === 'lose'
                          ? '#F4D03F'
                          : '#F5C542',
                    }}
                  >
                    {resultIcons[result]}
                    {resultText[result]}
                  </p>
                </motion.div>
              )}
            </div>

            {/* Win counter */}
            <div className="mt-3">
              <div className="flex justify-center gap-2 mb-3">
                {[1, 2, 3].map((n) => (
                  <motion.div
                    key={n}
                    animate={{
                      scale: wins >= n ? [1, 1.3, 1] : 1,
                    }}
                    transition={{ duration: 0.4 }}
                    className="w-3 h-3 rounded-full transition-all duration-500"
                    style={{
                      background: wins >= n
                        ? 'linear-gradient(135deg, #6DB33F, #8CC63F)'
                        : 'rgba(109,179,63,0.2)',
                      boxShadow: wins >= n ? '0 0 10px rgba(109, 179, 63, 0.4)' : 'none',
                    }}
                  />
                ))}
              </div>

              {/* Easter egg - Nature themed */}
              {wins >= 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 rounded-2xl text-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(109, 179, 63, 0.12), rgba(253, 248, 243, 0.5))',
                    border: '1px solid rgba(109, 179, 63, 0.3)',
                  }}
                >
                  <pre
                    className="text-xs mb-3 leading-relaxed"
                    style={{ color: '#6DB33F' }}
                  >
{`       🌸
      🌿🌿
     🌿🌿🌿
    🌿🌿🌿🌿
   🌿🌿🌿🌿🌿
       ||
    ~~~||~~~`}
                  </pre>
                  <p className="text-sm font-medium flex items-center justify-center gap-1.5" style={{ color: '#6DB33F' }}>
                    <Sparkles size={14} />
                    恭喜解锁彩蛋！"路阻且长，行则将至。"
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
