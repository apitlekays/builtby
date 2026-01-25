/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        background: '#0a0a0a',
        surface: '#141414',
        border: '#262626',
        muted: '#737373',
        accent: '#3b82f6',
      },
    },
  },
  plugins: [],
}
