import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext({ theme: 'system', setTheme: () => {} });

export function ThemeProvider({ children, defaultTheme = 'system', storageKey = 'theme' }) {
  const [theme, setTheme] = useState(() => localStorage.getItem(storageKey) || defaultTheme);

  useEffect(() => {
    const root = document.documentElement;

    const apply = (t) => {
      root.classList.remove('light', 'dark');
      if (t === 'system') {
        const mql = window.matchMedia('(prefers-color-scheme: dark)');
        root.classList.add(mql.matches ? 'dark' : 'light');
      } else {
        root.classList.add(t);
      }
    };

    apply(theme);

    if (theme !== 'system') return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => apply('system');
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [theme]);

  const value = useMemo(() => ({
    theme,
    setTheme: (t) => {
      localStorage.setItem(storageKey, t);
      setTheme(t);
    }
  }), [theme, storageKey]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);

