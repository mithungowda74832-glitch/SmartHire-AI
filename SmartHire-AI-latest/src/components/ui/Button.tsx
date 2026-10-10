import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      disabled,
      className = '',
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-colors duration-150 ' +
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ' +
      'disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shrink-0 select-none';

    const sizeStyles = {
      sm: 'text-xs py-1.5 px-3 rounded-md gap-1.5 h-8',
      md: 'text-sm py-2 px-4 rounded-lg gap-2 h-10',
      lg: 'text-base py-2.5 px-5 rounded-lg gap-2.5 h-12',
    }[size];

    const variantStyles = {
      primary:
        'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-xs border border-blue-600 ' +
        'dark:bg-blue-600 dark:hover:bg-blue-500 dark:border-blue-500',
      secondary:
        'bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 text-neutral-800 border border-neutral-200 ' +
        'dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-100 dark:border-neutral-700',
      outline:
        'bg-transparent hover:bg-neutral-100 active:bg-neutral-200 text-neutral-800 border border-neutral-300 ' +
        'dark:text-neutral-200 dark:border-neutral-700 dark:hover:bg-neutral-800/60',
      ghost:
        'bg-transparent hover:bg-neutral-100 active:bg-neutral-200 text-neutral-700 ' +
        'dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-100',
      danger:
        'bg-rose-600 hover:bg-rose-700 text-white border border-rose-600 ' +
        'dark:bg-rose-600 dark:hover:bg-rose-500 dark:border-rose-500',
    }[variant];

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
        {...props}
      >
        {loading ? (
          <svg
            className="animate-spin h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          icon
        )}
        <span>{children}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';
