# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

**builtby** is a personal portfolio website showcasing applications built by Hafiz Hanif, PhD. It displays custom macOS applications with dynamic GitHub release integration for downloads.

**Live site**: https://builtby.drhafizhanif.net

## Tech Stack

- **Framework**: React 19 + TypeScript 5.9
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS (dark theme)
- **Icons**: Lucide React

## Common Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Project Structure

```
src/
├── components/     # React components (AppCard, DownloadButton)
├── hooks/          # Custom hooks (useGitHubRelease)
├── data/           # App configuration (apps.ts)
├── assets/         # Static assets
├── App.tsx         # Main app component
└── main.tsx        # Entry point

public/             # Static files (icons, og-image, sitemap)
```

## Key Patterns

### Adding a New App
1. Add app configuration in `src/data/apps.ts`
2. Include: name, description, icon, GitHub repo, download patterns
3. Use `useGitHubRelease` hook for dynamic release fetching

### GitHub Release Integration
- The `useGitHubRelease` hook fetches latest releases from GitHub API
- Automatic architecture detection (Apple Silicon vs Intel)
- 5-minute caching to minimize API calls

### Styling Conventions
- Dark theme using custom Tailwind colors defined in `tailwind.config.js`
- Primary color: `primary-500` (#6366f1 - indigo)
- Background: `dark-800`, `dark-900` (gray tones)

## Code Style

- TypeScript strict mode enabled
- ESLint with React and TypeScript rules
- Functional components with hooks
- Descriptive variable and function names
