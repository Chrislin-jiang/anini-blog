export interface Skill {
  name: string;
  icon: string;
  level: number;
  color: string;
}

export const skills: Skill[] = [
  { name: 'React', icon: '⚛️', level: 92, color: '#61DAFB' },
  { name: 'TypeScript', icon: '🔷', level: 90, color: '#3178C6' },
  { name: 'Vue', icon: '💚', level: 85, color: '#42B883' },
  { name: 'Next.js', icon: '▲', level: 82, color: '#000000' },
  { name: 'CSS/Tailwind', icon: '🎨', level: 94, color: '#06B6D4' },
  { name: 'Node.js', icon: '🟢', level: 78, color: '#68A063' },
  { name: 'Vite', icon: '⚡', level: 85, color: '#646CFF' },
  { name: 'Git', icon: '🔀', level: 88, color: '#F05032' },
];
