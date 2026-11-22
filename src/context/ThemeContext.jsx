import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('ecoruta_theme');
      if (stored) return stored;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });
  const [resolvedTheme, setResolvedTheme] = useState(theme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('ecoruta_theme');
    if (stored) {
      setTheme(stored);
      setResolvedTheme(stored);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
      setResolvedTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('ecoruta_theme', resolvedTheme);
  }, [resolvedTheme, mounted]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      const stored = localStorage.getItem('ecoruta_theme');
      if (!stored) {
        const newTheme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
        setResolvedTheme(newTheme);
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const setLightTheme = useCallback(() => {
    setTheme('light');
  }, []);

  const setDarkTheme = useCallback(() => {
    setTheme('dark');
  }, []);

  useEffect(() => {
    if (mounted) {
      setResolvedTheme(theme);
    }
  }, [theme, mounted]);

  return (
    <ThemeContext.Provider value={{
      theme: resolvedTheme,
      setTheme: setResolvedTheme,
      toggleTheme,
      setLightTheme,
      setDarkTheme,
      mounted,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}