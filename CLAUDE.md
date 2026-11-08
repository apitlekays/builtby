# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

**builtby** is a personal portfolio website showcasing applications built by Hafiz Hanif, PhD. It lists every project on the home page, gives each one its own page at `/<slug>`, and offers downloads from the latest GitHub releases.

**Live site**: https://builtby.drhafizhanif.net

## Tech Stack

- **Framework**: React 19 + TypeScript 5.9
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS, light and dark themes ("Instrument Panel" look, Chivo and Chivo Mono)
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
├── components/     # React components (ProjectRack, ProjectModule, SectionBar, DownloadButton, ScreenGallery, StickyAction)
├── hooks/          # Custom hooks (useGitHubRelease, useDownloadOptions, usePageMeta)
├── data/           # All project content (projects.ts) and site text (site.ts)
├── pages/          # HomePage, ProjectPage, NotFoundPage
├── App.tsx         # Routes
└── main.tsx        # Entry point

public/             # Static files (icons, screens, screengrabs, og-image)
scripts/            # fetch-releases.js, run during deploy
```

## Key Patterns

### Adding a Project
1. Add an entry to `src/data/projects.ts`, with its `audience`. The home page group and row, the `/<slug>` page, the related links, the sitemap and the structured data all come from it.
2. Put its icon in `public/icons/`, and any screenshots in `public/screens/`.
3. If it has downloads, set `download` and add the repo to `scripts/fetch-releases.js`.

Only write what the project's own repo, docs or public site says. Do not link to private repos.

### Project Pages
`vite.config.ts` writes `dist/<slug>/index.html` and `dist/sitemap.xml` at build time, so each page returns a 200 with its own title and description on GitHub Pages.

### GitHub Release Integration
- `scripts/fetch-releases.js` writes `public/github-releases.json` during deploy to avoid API rate limits. `useGitHubRelease` reads that file and falls back to the GitHub API.
- `deploy.yml` rebuilds daily so new releases appear. GitHub pauses scheduled runs after 60 days without repo activity.

### Styling Conventions
- All colors are CSS variable tokens set in `src/index.css`, one set per theme, and named in `tailwind.config.js`. Use token classes (`text-body`, `bg-surface`, `text-accent`, `text-pending`), never raw colors, so a new look only changes the tokens.
- `accent` (green) marks what a visitor can use today, `pending` (amber) marks what is not open yet. `StatusTag` pairs each with a light so color is never the only cue.
- `accent-solid` is the signal yellow. Text on it is always `text-on-accent`. Use it for the one main action on a page (`primaryButtonClass` in `components/buttonStyles.ts`), the audience index and index numbers, nothing else.
- Layout is built from racks: `.rack` in `src/index.css` is a grid of modules separated by hairlines, opened by a `SectionBar`. Small uppercase captions use `.label`. Page width comes from `.wrap`.
- Project index codes (01.1, 02.2) come from the audience order and the project's place in `projects.ts`, so reordering there renumbers them everywhere.
- `index.html` sets `data-theme` before first paint from the saved choice or the device setting. `ThemeToggle` changes and saves it.

## Code Style

- TypeScript strict mode enabled
- ESLint with React and TypeScript rules
- Functional components with hooks
- Descriptive variable and function names
