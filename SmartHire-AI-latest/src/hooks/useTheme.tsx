import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'smarthire_theme';

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
    // Default to dark for the cinematic intelligence engine aesthetic, or check media query
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
  } catch (e) {
    console.warn('Failed to read theme from localStorage:', e);
  }
  return 'dark';
}

function applyThemeToDOM(theme: Theme) {
  const root = document.documentElement;
  const body = document.body;

  // Set data-theme attribute
  root.setAttribute('data-theme', theme);
  root.setAttribute('data-color-scheme', theme);

  // Synchronize CSS class for Tailwind .dark variant
  if (theme === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
    if (body) {
      body.classList.add('dark');
      body.classList.remove('light');
    }
  } else {
    root.classList.remove('dark');
    root.classList.add('light');
    if (body) {
      body.classList.remove('dark');
      body.classList.add('light');
    }
  }

  // Update browser status bar / theme-color meta tag
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', theme === 'dark' ? '#090d16' : '#f8fafc');
  }
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    applyThemeToDOM(theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      console.warn('Failed to save theme to localStorage:', e);
    }
  }, [theme]);

  // Listen to system theme changes if user has not explicitly persisted a preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        setThemeState(e.matches ? 'dark' : 'light');
      }
    };
    mediaQuery.addEventListener?.('change', handleChange);
    return () => mediaQuery.removeEventListener?.('change', handleChange);
  }, []);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark: theme === 'dark', toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    // Fallback if rendered outside ThemeProvider
    const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
    return {
      theme: isDark ? 'dark' : 'light',
      isDark,
      toggleTheme: () => {},
      setTheme: () => {},
    };
  }
  return context;
}
