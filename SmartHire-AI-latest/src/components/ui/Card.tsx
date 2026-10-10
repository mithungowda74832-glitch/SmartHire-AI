import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'subtle' | 'elevated' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  ...props
}) => {
  const base = 'rounded-xl transition-colors duration-150';

  const variantStyles = {
    default:
      'bg-white border border-neutral-200 shadow-xs dark:bg-neutral-900 dark:border-neutral-800',
    subtle:
      'bg-neutral-50/80 border border-neutral-200/80 dark:bg-neutral-900/50 dark:border-neutral-800/80',
    elevated:
      'bg-white border border-neutral-200 shadow-sm dark:bg-neutral-900 dark:border-neutral-800',
    interactive:
      'bg-white border border-neutral-200 hover:border-neutral-300 dark:bg-neutral-900 dark:border-neutral-800 dark:hover:border-neutral-700 cursor-pointer shadow-xs',
  }[variant];

  const paddingStyles = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }[padding];

  return (
    <div className={`${base} ${variantStyles} ${paddingStyles} ${className}`} {...props}>
      {children}
    </div>
  );
};
