import { useState } from 'react';

type Theme = 'light' | 'dark';

const readTheme = (): Theme => (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(readTheme);
  const next: Theme = theme === 'light' ? 'dark' : 'light';

  const toggle = () => {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem('builtby-theme', next);
    } catch {
      // The choice still applies to this visit when storage is blocked.
    }
    setTheme(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${next} theme`}
      className="label min-h-11 px-3 rounded-md border border-border-bright bg-surface text-foreground hover:bg-surface-2 transition-colors"
    >
      {next === 'dark' ? 'Dark' : 'Light'}
    </button>
  );
}
