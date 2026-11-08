/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Chivo', 'system-ui', 'sans-serif'],
        mono: ['Chivo Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        background: 'rgb(var(--c-background) / <alpha-value>)',
        surface: 'rgb(var(--c-surface) / <alpha-value>)',
        'surface-2': 'rgb(var(--c-surface-2) / <alpha-value>)',
        border: 'rgb(var(--c-border) / <alpha-value>)',
        'border-bright': 'rgb(var(--c-border-bright) / <alpha-value>)',
        foreground: 'rgb(var(--c-foreground) / <alpha-value>)',
        body: 'rgb(var(--c-body) / <alpha-value>)',
        'muted-foreground': 'rgb(var(--c-muted) / <alpha-value>)',
        accent: 'rgb(var(--c-accent) / <alpha-value>)',
        'accent-solid': 'rgb(var(--c-accent-solid) / <alpha-value>)',
        'accent-solid-hover': 'rgb(var(--c-accent-solid-hover) / <alpha-value>)',
        'on-accent': 'rgb(var(--c-on-accent) / <alpha-value>)',
        pending: 'rgb(var(--c-pending) / <alpha-value>)',
        bar: 'rgb(var(--c-bar) / <alpha-value>)',
        'on-bar': 'rgb(var(--c-on-bar) / <alpha-value>)',
      },
    },
  },
  plugins: [],
}
