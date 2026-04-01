export interface Project {
  title: string;
  description: string;
  tags: string[];
  color: string;
  link: string;
  image?: string;
}

export const projects: Project[] = [
  {
    title: 'Design System',
    description: '一套基于 Toss 设计语言的组件库，包含 30+ 精心设计的可复用组件，支持主题切换和暗色模式。',
    tags: ['React', 'TypeScript', 'Storybook'],
    color: 'from-blue-400 to-purple-500',
    link: '#',
  },
  {
    title: 'AI Chat App',
    description: '基于大语言模型的智能对话应用，支持多轮对话、上下文记忆和流式输出，界面参考 Toss 聊天风格。',
    tags: ['Next.js', 'OpenAI', 'Tailwind'],
    color: 'from-emerald-400 to-cyan-500',
    link: '#',
  },
  {
    title: 'Motion Gallery',
    description: '一个交互动效展示平台，收录了 50+ 前端动画案例，每个都有完整的源码和实现思路。',
    tags: ['Framer Motion', 'GSAP', 'CSS'],
    color: 'from-orange-400 to-pink-500',
    link: '#',
  },
  {
    title: 'Dev Dashboard',
    description: '开发者日常效率面板，集成 GitHub 数据、代办事项、阅读列表和每日学习追踪。',
    tags: ['Vue 3', 'D3.js', 'Supabase'],
    color: 'from-violet-400 to-indigo-500',
    link: '#',
  },
];
