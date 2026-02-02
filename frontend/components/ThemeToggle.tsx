"use client"

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg border border-border bg-surface hover:bg-muted transition-all duration-200"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-foreground transition-transform duration-200 hover:rotate-12" />
      ) : (
        <Sun className="w-5 h-5 text-foreground transition-transform duration-200 hover:rotate-12" />
      )}
    </button>
  );
}
