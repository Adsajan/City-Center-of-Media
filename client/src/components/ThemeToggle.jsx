import React from 'react';
import { useTheme } from '../context/ThemeContext.jsx';

export default function ThemeToggle({ className = '' }) {
  const { theme, setTheme } = useTheme();

  const nextTheme = () => {
    if (theme === 'light') return 'dark';
    if (theme === 'dark') return 'system';
    return 'light';
  };

  const label = theme === 'light' ? 'Light' : theme === 'dark' ? 'Dark' : 'System';
  const icon = theme === 'light' ? (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M12 18a6 6 0 100-12 6 6 0 000 12zM12 1a1 1 0 00-1 1v1h2V2a1 1 0 00-1-1zM1 12a1 1 0 001-1H1v2zm21 0a1 1 0 001-1h-2a1 1 0 001 1z"/></svg>
  ) : theme === 'dark' ? (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M21.64 13a9 9 0 11-10.63-10.6 1 1 0 00.9 1.45A7 7 0 1020.19 12a1 1 0 001.45.9z"/></svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 2a8 8 0 110 16 8 8 0 010-16z"/></svg>
  );

  return (
    <button
      type="button"
      onClick={() => setTheme(nextTheme())}
      className={`btn btn-outline ${className}`}
      title={`Theme: ${label}`}
      aria-label="Toggle theme"
    >
      <span className="inline-flex items-center gap-2">{icon}<span className="hidden sm:inline">{label}</span></span>
    </button>
  );
}
