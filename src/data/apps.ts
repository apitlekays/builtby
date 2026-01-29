export interface App {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  platforms: ('macos' | 'ios' | 'web' | 'windows' | 'linux')[];
  github?: {
    owner: string;
    repo: string;
  };
  status: 'available' | 'coming-soon';
  features?: string[];
  launchDate?: Date;
}

const base = import.meta.env.BASE_URL;

export const apps: App[] = [
  {
    id: 'sajda',
    name: 'Sajda',
    tagline: 'Islamic Prayer Times for macOS & Windows',
    description: 'A beautiful menu bar app for accurate prayer times, Adhan reminders, and daily Islamic content. Features JAKIM integration for Malaysia and global calculation methods.',
    icon: `${base}icons/sajda.png`,
    platforms: ['macos', 'windows'],
    github: {
      owner: 'apitlekays',
      repo: 'Sajda',
    },
    status: 'available',
  },
  {
    id: 'curtask',
    name: 'CurTask',
    tagline: 'Craft Better Papers, Beautifully',
    description: 'An AI-powered PDF research workspace for researchers and academics. Manage your paper collections with an infinite canvas, automatic metadata extraction, and powerful search.',
    icon: `${base}icons/curtask.png`,
    platforms: ['macos', 'windows', 'linux'],
    status: 'coming-soon',
    features: [
      'Infinite canvas for visual paper organization',
      'AI-powered metadata extraction with Ollama',
      'Full-text search with FTS5',
      'Multi-window architecture',
    ],
    launchDate: new Date('2026-04-30T00:00:00'),
  },
];
