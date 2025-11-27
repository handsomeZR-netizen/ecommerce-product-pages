import React, { useRef } from 'react';
import { cn } from '@/lib/utils';
import styles from '@/styles/glow-button.module.css';

interface GlowButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary';
}

export const GlowButton: React.FC<GlowButtonProps> = ({
  children,
  onClick,
  className,
  variant = 'primary',
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    buttonRef.current.style.setProperty('--mouse-x', `${x}px`);
    buttonRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    // 支持 Enter 和 Space 键触发按钮（浏览器默认行为，但显式处理以确保一致性）
    if ((e.key === 'Enter' || e.key === ' ') && onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onKeyDown={handleKeyDown}
      className={cn(
        styles['glow-button'],
        'relative overflow-hidden',
        'px-8 py-4 rounded-lg',
        'font-semibold text-lg',
        'transition-all duration-300',
        'flex items-center gap-3',
        'group',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        {
          'bg-gradient-to-r from-blue-600 to-purple-600 text-white focus:ring-blue-500':
            variant === 'primary',
          'bg-white text-gray-900 border-2 border-gray-300 focus:ring-gray-400':
            variant === 'secondary',
        },
        className
      )}
    >
      <span className="relative z-10">{children}</span>
      <svg
        className="relative z-10 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 7l5 5m0 0l-5 5m5-5H6"
        />
      </svg>
      <span className={styles['glow-effect']} />
    </button>
  );
};
