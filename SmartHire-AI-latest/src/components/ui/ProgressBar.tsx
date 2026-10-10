import React from 'react';

export interface ProgressBarProps {
  value: number; // 0 - 100
  max?: number;
  label?: string;
  showValueText?: boolean;
  size?: 'sm' | 'md';
  tone?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showValueText = true,
  size = 'md',
  tone = 'default',
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const heightClass = size === 'sm' ? 'h-1.5' : 'h-2.5';

  const toneFill = {
    default: 'bg-blue-600 dark:bg-blue-500',
    success: 'bg-emerald-600 dark:bg-emerald-500',
    warning: 'bg-amber-500 dark:bg-amber-400',
    danger: 'bg-rose-600 dark:bg-rose-500',
  }[tone];

  return (
    <div className={`w-full ${className}`}>
      {(label || showValueText) && (
        <div className="flex items-center justify-between text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
          {label && <span>{label}</span>}
          {showValueText && (
            <span className="font-mono tabular-nums text-neutral-500 dark:text-neutral-400">
              {value} / {max}
            </span>
          )}
        </div>
      )}
      <div
        className={`w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden ${heightClass}`}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ease-out ${toneFill}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
