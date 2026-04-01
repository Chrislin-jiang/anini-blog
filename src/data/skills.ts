export interface Skill {
  name: string;
  icon: string;
  level: number;
  color: string;
}

export const skills: Skill[] = [
  { name: 'React', icon: '⚛️', level: 92, color: '#61DAFB' },
  { name: 'JavaScript', icon: '🟡', level: 90, color: '#F7DF1E' },
  { name: 'TypeScript', icon: '🔷', level: 85, color: '#3178C6' },
  { name: 'CSS', icon: '🎨', level: 88, color: '#264DE4' },
  { name: 'Vue', icon: '💚', level: 82, color: '#42B883' },
  { name: 'Webpack', icon: '📦', level: 85, color: '#8DD6F9' },
  { name: 'SVG', icon: '🎭', level: 80, color: '#FFB13B' },
  { name: 'Node.js', icon: '🟢', level: 75, color: '#68A063' },
];
