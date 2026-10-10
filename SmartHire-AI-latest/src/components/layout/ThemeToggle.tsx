import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export const ThemeToggle: React.FC = () => {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:text-cyan-300 dark:hover:bg-slate-800/70 border border-slate-200/80 dark:border-slate-800 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-cyan-500 cursor-pointer shadow-xs"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      data-active-theme={theme}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-180 duration-300" />
      ) : (
        <Moon className="w-4 h-4 text-cyan-600 animate-in spin-in-180 duration-300" />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
};
