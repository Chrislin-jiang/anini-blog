import { useSmoothScroll } from '../hooks/useSmoothScroll';
import { type ReactNode } from 'react';

export default function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useSmoothScroll();
  return <>{children}</>;
}
