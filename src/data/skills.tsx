import { type ReactNode } from 'react';
import { Atom, FileCode, Code, Palette, Package, Image, Server } from 'lucide-react';

export interface Skill {
  name: string;
  icon: ReactNode;
  level: number;
  color: string;
}

export const skills: Skill[] = [
  { name: 'React', icon: <Atom size={20} />, level: 92, color: '#61DAFB' },
  { name: 'JavaScript', icon: <Code size={20} />, level: 90, color: '#F7DF1E' },
  { name: 'TypeScript', icon: <FileCode size={20} />, level: 85, color: '#3178C6' },
  { name: 'CSS', icon: <Palette size={20} />, level: 88, color: '#264DE4' },
  { name: 'Vue', icon: <Code size={20} />, level: 82, color: '#42B883' },
  { name: 'Webpack', icon: <Package size={20} />, level: 85, color: '#8DD6F9' },
  { name: 'SVG', icon: <Image size={20} />, level: 80, color: '#FFB13B' },
  { name: 'Node.js', icon: <Server size={20} />, level: 75, color: '#68A063' },
];
