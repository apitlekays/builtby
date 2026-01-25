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
}

const base = import.meta.env.BASE_URL;

export const apps: App[] = [
  {
    id: 'sajda',
    name: 'Sajda',
    tagline: 'Islamic Prayer Times for macOS',
    description: 'A beautiful menu bar app for accurate prayer times, Adhan reminders, and daily Islamic content. Features JAKIM integration for Malaysia and global calculation methods.',
    icon: `${base}icons/sajda.png`,
    platforms: ['macos'],
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
  },
];
