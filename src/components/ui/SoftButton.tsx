import { type ReactNode } from 'react';

interface SoftButtonProps {
  children: ReactNode;
  variant?: 'filled' | 'outline';
  href?: string;
  onClick?: () => void;
  className?: string;
}

export default function SoftButton({
  children,
  variant = 'filled',
  href,
  onClick,
  className = '',
}: SoftButtonProps) {
  const baseClass = variant === 'filled' ? 'soft-btn' : 'soft-btn-outline';

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
