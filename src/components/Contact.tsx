import { motion, useInView } from 'framer-motion';
import { useRef, useState, useCallback, type ReactNode } from 'react';
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
  { label: 'GitHub', icon: <Code2 size={24} />, href: 'https://github.com/Chrislin-jiang', color: '#00F0FF' },
  { label: '古早站点', icon: <Globe size={24} />, href: 'https://chrislin-jiang.github.io/code-girl/', color: '#B829F7' },
  { label: '掘金', icon: <BookOpen size={24} />, href: 'https://juejin.cn/user/1908407919207006', color: '#FF0080' },
  { label: '博客园', icon: <FileText size={24} />, href: 'https://www.cnblogs.com/chrislinlin/', color: '#00F0FF' },
  { label: 'Gitee', icon: <GitBranch size={24} />, href: 'https://gitee.com/chrislinlin', color: '#B829F7' },
];

const resultText = {
  win: '你赢了！',
  lose: '你输了，再来！',
  draw: '平局，再试试？',
};

const resultIcons: Record<Exclude<Result, null>, ReactNode> = {
  win: <Trophy size={18} />,
  lose: <Frown size={18} />,
  draw: <Equal size={18} />,
};

export default function Contact() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [aiChoice, setAiChoice] = useState<Choice | null>(null);
  const [result, setResult] = useState<Result>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [wins, setWins] = useState(0);
  const [logs, setLogs] = useState<string[]>([
    'anini@portfolio:~$ 欢迎来到终端控制台',
    'anini@portfolio:~$ 输入命令开始游戏...',
  ]);

  const addLog = useCallback((msg: string) => {
    setLogs((prev) => [...prev.slice(-6), `anini@portfolio:~$ ${msg}`]);
  }, []);

  const play = useCallback(
    (choice: Choice) => {
      if (isPlaying) return;
      setIsPlaying(true);
      setPlayerChoice(choice);
      setResult(null);
      setAiChoice(null);

      addLog(`玩家选择: ${choices.find((c) => c.id === choice)?.label}`);

      setTimeout(() => {
        const aiPick = choices[Math.floor(Math.random() * 3)].id;
        setAiChoice(aiPick);
        addLog(`系统选择: ${choices.find((c) => c.id === aiPick)?.label}`);

        if (choice === aiPick) {
          setResult('draw');
          addLog('结果: 平局');
        } else if (resultMap[choice] === aiPick) {
          setResult('win');
          setWins((w) => w + 1);
          addLog('结果: 胜利! +1');
        } else {
          setResult('lose');
          addLog('结果: 失败');
        }
        setIsPlaying(false);
      }, 800);
    },
    [isPlaying, addLog]
  );

  return (
    <section id="contact" className="section-padding relative" ref={sectionRef}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 70%, rgba(0, 240, 255, 0.05) 0%, transparent 60%)',
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
              background: 'rgba(255, 0, 128, 0.1)',
              color: '#FF0080',
              border: '1px solid rgba(255, 0, 128, 0.2)',
            }}
          >
            联系我
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#F0F0F5]">
            找到我
          </h2>
        </motion.div>

        {/* Cube links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-6 mb-14"
        >
          {contactLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
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
            </a>
          ))}
        </motion.div>

        {/* Terminal game */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="terminal"
        >
          {/* Terminal header */}
          <div className="terminal-header">
            <div className="terminal-dot" style={{ background: '#FF5F56' }} />
            <div className="terminal-dot" style={{ background: '#FFBD2E' }} />
            <div className="terminal-dot" style={{ background: '#27C93F' }} />
            <span className="text-xs ml-2" style={{ color: '#5A5A6A' }}>
              game.terminal
            </span>
          </div>

          {/* Terminal body */}
          <div className="terminal-body">
            {/* Logs */}
            <div className="mb-6 space-y-1">
              {logs.map((log, i) => (
                <div key={i} className="text-sm">
                  <span className="terminal-prompt">{log.split(':~$')[0]}:~$</span>
                  <span className="text-[#8A8A9A]"> {log.split(':~$')[1]}</span>
                </div>
              ))}
            </div>

            {/* Game controls */}
            <div className="flex justify-center gap-4 mb-4">
              {choices.map((c) => (
                <button
                  key={c.id}
                  onClick={() => play(c.id)}
                  disabled={isPlaying}
                  className={`w-16 h-16 md:w-20 md:h-20 rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-300 ${
                    playerChoice === c.id
                      ? 'scale-110'
                      : 'hover:scale-105'
                  } ${isPlaying ? 'opacity-50' : ''}`}
                  style={{
                    background:
                      playerChoice === c.id
                        ? 'linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(184, 41, 247, 0.2))'
                        : 'rgba(255, 255, 255, 0.03)',
                    border: `2px solid ${
                      playerChoice === c.id ? '#00F0FF' : 'rgba(255,255,255,0.1)'
                    }`,
                    boxShadow:
                      playerChoice === c.id
                        ? '0 0 20px rgba(0, 240, 255, 0.3)'
                        : 'none',
                  }}
                >
                  <span className="text-2xl">{c.emoji}</span>
                  <span className="text-[10px]" style={{ color: '#8A8A9A' }}>
                    {c.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Result */}
            <div className="h-12 flex flex-col items-center justify-center">
              {isPlaying && (
                <div className="text-lg animate-pulse" style={{ color: '#00F0FF' }}>
                  系统思考中...
                </div>
              )}
              {result && aiChoice && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="space-y-1 text-center"
                >
                  <p className="text-sm" style={{ color: '#8A8A9A' }}>
                    对手出了 {choices.find((c) => c.id === aiChoice)?.emoji}
                  </p>
                  <p
                    className="text-lg font-bold flex items-center justify-center gap-1"
                    style={{
                      color:
                        result === 'win'
                          ? '#00F0FF'
                          : result === 'lose'
                          ? '#FF0080'
                          : '#FFE600',
                    }}
                  >
                    {resultIcons[result]}
                    {resultText[result]}
                  </p>
                </motion.div>
              )}
            </div>

            {/* Win counter & Easter egg */}
            <div className="mt-4">
              <div className="flex justify-center gap-2 mb-3">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="w-3 h-3 rounded-full transition-all duration-500"
                    style={{
                      background: wins >= n ? '#00F0FF' : 'rgba(255,255,255,0.1)',
                      boxShadow: wins >= n ? '0 0 10px rgba(0, 240, 255, 0.5)' : 'none',
                    }}
                  />
                ))}
              </div>
              {wins >= 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl text-center"
                  style={{
                    background: 'rgba(0, 240, 255, 0.05)',
                    border: '1px solid rgba(0, 240, 255, 0.2)',
                  }}
                >
                  <pre
                    className="text-xs mb-2"
                    style={{ color: '#00F0FF', lineHeight: 1.4 }}
                  >
                    {`
  ╔═══════════════════════════╗
  ║  恭喜解锁隐藏彩蛋！       ║
  ╚═══════════════════════════╝
                    `}
                  </pre>
                  <p className="text-sm font-medium flex items-center justify-center gap-1" style={{ color: '#00F0FF' }}>
                    <Sparkles size={14} />
                    "路阻且长，行则将至。"
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
