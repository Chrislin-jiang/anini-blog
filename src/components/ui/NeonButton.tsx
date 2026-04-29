import { type ReactNode } from 'react';

interface NeonButtonProps {
  children: ReactNode;
  variant?: 'filled' | 'outline';
  href?: string;
  onClick?: () => void;
  className?: string;
}

export default function NeonButton({
  children,
  variant = 'filled',
  href,
  onClick,
  className = '',
}: NeonButtonProps) {
  const baseClass = variant === 'filled' ? 'neon-btn' : 'neon-btn-outline';

  if (href) {
    return (
      <a href={href} className={`${baseClass} inline-block text-center no-underline ${className}`}>
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={`${baseClass} ${className}`}>
      {children}
    </button>
  );
}
