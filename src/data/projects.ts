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
    title: '出戏-OffStage',
    description: `我做了一个小工具叫「出戏」🎭，输入你的念头，AI 帮你识别是哪个角色在说话，然后你可以选择：看见它🫧、给它贴标签🏷️、改写台词✏️、用滑稽腔念出来🎵、缩小🔍、吹走💨、融化🫠……，8种方式帮你「出戏」，而不是和念头硬刚。`,
    tags: ['React', '认知解离', '自信的陷阱'],
    color: 'from-blue-400 to-purple-500',
    link: 'https://thought-unhook-1j8o.vercel.app/',
    image: '/images/offstage.png'
  },
  {
    title: '价值选择器-ValueSelector',
    description: '每天选择你想成为的人，而不是被情绪带着走',
    tags: ['React', 'Next.js', '价值选择'],
    color: 'from-emerald-400 to-cyan-500',
    link: 'https://value-selector-delta.vercel.app/',
    image: '/images/value-selector.png'
  },
  {
    title: '古早个人网站',
    description: '一个简单的古早个人网站，使用 VuePress 构建。',
    tags: ['VuePress', '个人网站', '静态站点生成'],
    color: 'from-orange-400 to-pink-500',
    link: 'https://chrislin-jiang.github.io/code-girl/',
    image: '/images/anini3.png'
  },
  {
    title: '技术博客',
    description: '掘金 52 篇文章 + VuePress 文档站 150+ 篇，总阅读 15w+，2024 年度人气作者。',
    tags: ['掘金', '博客', '写作'],
    color: 'from-violet-400 to-indigo-500',
    link: 'https://juejin.cn/user/1908407919207006',
    image: '/images/juejin3.jpg'
  },
];
