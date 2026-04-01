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
    title: '可视化搭建平台',
    description: '低代码可视化搭建平台，包含魔方组件设计与实现、店铺装修等功能，掘金文章 5.1k 阅读。',
    tags: ['React', '低代码', '可视化'],
    color: 'from-blue-400 to-purple-500',
    link: 'https://juejin.cn/post/7442908576535937087',
  },
  {
    title: 'React 富文本编辑器',
    description: '基于 Quill 的富文本二次开发，实现自定义 Blot、智能目录组件等功能。',
    tags: ['React', 'Quill', '富文本'],
    color: 'from-emerald-400 to-cyan-500',
    link: 'https://juejin.cn/post/7520546357464367154',
  },
  {
    title: 'Web 端截屏/录屏',
    description: 'Web 端截屏和录屏的技术方案调研与实现，截屏方案文章 1k+ 阅读。',
    tags: ['JavaScript', 'WebRTC', 'Canvas'],
    color: 'from-orange-400 to-pink-500',
    link: 'https://juejin.cn/post/7507204325577277455',
  },
  {
    title: '技术博客',
    description: '掘金 242 篇文章 + VuePress 文档站 150+ 篇，总阅读 15w+，2024 年度人气作者。',
    tags: ['掘金', 'VuePress', '写作'],
    color: 'from-violet-400 to-indigo-500',
    link: 'https://juejin.cn/user/1908407919207006',
  },
];
