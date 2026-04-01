export interface Post {
  title: string;
  summary: string;
  date: string;
  category: string;
  categoryColor: string;
  link: string;
}

export const posts: Post[] = [
  {
    title: '如何用 CSS 实现 Toss 风格的毛玻璃卡片',
    summary: '深入探讨 backdrop-filter、渐变边框和柔和阴影的组合技巧，打造高级感 UI。',
    date: '2026-03-28',
    category: 'CSS',
    categoryColor: 'bg-cyan-100 text-cyan-700',
    link: '#',
  },
  {
    title: 'React 状态管理的 2026 年最佳实践',
    summary: '从 useState 到 Zustand，再到 Server State，一文理清前端状态管理的演进脉络。',
    date: '2026-03-15',
    category: 'React',
    categoryColor: 'bg-blue-100 text-blue-700',
    link: '#',
  },
  {
    title: '用 Framer Motion 打造丝滑滚动动画',
    summary: '手把手教你实现视差滚动、元素渐显和交互动效，让网站活起来。',
    date: '2026-02-28',
    category: 'Animation',
    categoryColor: 'bg-purple-100 text-purple-700',
    link: '#',
  },
  {
    title: 'Astro Islands 架构：性能与交互的完美平衡',
    summary: '为什么我把博客从 Next.js 迁到了 Astro，以及 Islands 架构如何做到按需 hydrate。',
    date: '2026-02-10',
    category: 'Architecture',
    categoryColor: 'bg-amber-100 text-amber-700',
    link: '#',
  },
];
