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
    title: '【前端面经】美图 Meitu 面试',
    summary: '16k 阅读、127 赞的高热度面经，包含完整面试流程和技术考察点。',
    date: '2025-06-15',
    category: '面试',
    categoryColor: 'bg-pink-100 text-pink-700',
    link: 'https://juejin.cn/post/7381000000000000000',
  },
  {
    title: '【前端面经】滴滴 面试',
    summary: '10k 阅读、111 赞，亲历滴滴面试的完整复盘。',
    date: '2025-05-20',
    category: '面试',
    categoryColor: 'bg-pink-100 text-pink-700',
    link: 'https://juejin.cn/post/7380000000000000000',
  },
  {
    title: 'CSS 函数 calc() 会引起重排重绘吗',
    summary: '深入浏览器渲染原理，探讨 CSS 动态计算对性能的影响，4.9k 阅读、45 赞。',
    date: '2025-04-10',
    category: 'CSS',
    categoryColor: 'bg-cyan-100 text-cyan-700',
    link: 'https://juejin.cn/post/7389076428882919436',
  },
  {
    title: '可视化搭建平台 - 魔方组件的设计与实现',
    summary: '低代码平台核心组件的设计思路和技术实现，5.1k 阅读。',
    date: '2024-12-08',
    category: 'React',
    categoryColor: 'bg-blue-100 text-blue-700',
    link: 'https://juejin.cn/post/7442908576535937087',
  },
  {
    title: 'React 富文本二次开发：自定义 Blot',
    summary: '基于 Quill 的富文本编辑器深度定制实战，实现自定义内容块。',
    date: '2025-07-10',
    category: 'React',
    categoryColor: 'bg-blue-100 text-blue-700',
    link: 'https://juejin.cn/post/7520546357464367154',
  },
  {
    title: 'Ant Design 表单陷阱：正确使用 Form.Item',
    summary: '5k 阅读，踩坑 Ant Design 表单与自定义表单控件的正确使用方式。',
    date: '2025-04-25',
    category: 'React',
    categoryColor: 'bg-blue-100 text-blue-700',
    link: 'https://juejin.cn/post/7388056946121162789',
  },
];
