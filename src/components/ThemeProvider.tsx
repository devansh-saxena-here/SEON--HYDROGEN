import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'dark' | 'light';

interface ThemeContextValue {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  reduceMotion: boolean;
  setReduceMotion: (value: boolean) => void;
  compactDensity: boolean;
  setCompactDensity: (value: boolean) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = 'seon-theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {
      // Ignore storage failures
    }
    return 'dark';
  });

  const [reduceMotion, setReduceMotion] = useState(false);
  const [compactDensity, setCompactDensity] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Ignore storage failures
    }
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-reduce-motion', reduceMotion ? 'true' : 'false');
  }, [reduceMotion]);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-density', compactDensity ? 'compact' : 'comfortable');
  }, [compactDensity]);

  const setTheme = (next: ThemeMode) => setThemeState(next);
  const toggleTheme = () => setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        reduceMotion,
        setReduceMotion,
        compactDensity,
        setCompactDensity,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
