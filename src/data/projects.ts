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
    title: '小众点评-街头巷尾-Hiland',
    description: `这个应用想给大家带来的旅行体验不是打卡景点，而是像本地人一样走街串巷。
功能一：对话式路线生成（核心功能）：用户用自然语言描述偏好，AI 生成一条定制路线
功能二：动态宝藏点位库：不是静态分数，而是随推荐量、访问量实时调整。
功能三：实时 AI 导览：走到某个点位时，手动点击"我到了"触发 AI 讲解
功能四：探索成就系统：生成精美的探索日记卡片，可分享到社交平台。`,
    tags: ['React', 'AI', '旅游推荐'],
    color: 'from-blue-400 to-purple-500',
    link: 'http://47.93.204.110/',
    image: '/images/hiland.webp'
  },
  {
    title: 'app-showcase-iphone-skill',
    description: `为 vibecoding 开发了一个应用预览快速生成的skill：app-showcase-iphone-skill
主要功能：生成移动端应用页面预览页面（带 iPhone 框架展示）。当用户需要生成 app 预览页面、手机页面展示、iPhone 模拟器展示时使用。`,
    tags: ['AI', 'skills'],
    color: 'from-blue-400 to-purple-500',
    link: 'http://47.93.204.110/',
    image: '/images/app-showcase-iphone-skill.webp'
  },
  {
    title: '出戏-OffStage',
    description: `我做了一个小工具叫「出戏」🎭，输入你的念头，AI 帮你识别是哪个角色在说话，然后你可以选择：看见它🫧、给它贴标签🏷️、改写台词✏️、用滑稽腔念出来🎵、缩小🔍、吹走💨、融化🫠……，8种方式帮你「出戏」，而不是和念头硬刚。`,
    tags: ['React', 'AI', '认知解离'],
    color: 'from-blue-400 to-purple-500',
    link: 'https://thought-unhook.vercel.app/',
    image: '/images/offstage.webp'
  },
  {
    title: '价值选择器-ValueSelector',
    description: '每天选择你想成为的人，而不是被情绪带着走',
    tags: ['React', 'AI', '价值选择'],
    color: 'from-emerald-400 to-cyan-500',
    link: 'https://value-selector-delta.vercel.app/',
    image: '/images/value-selector.webp'
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
    description: '掘金 52 篇文章，VuePress 文档站 150+ 篇，总阅读 15w+，2024 年度人气作者。',
    tags: ['掘金', '博客', '写作'],
    color: 'from-violet-400 to-indigo-500',
    link: 'https://juejin.cn/user/1908407919207006',
    image: '/images/juejin3.jpg'
  },
];
