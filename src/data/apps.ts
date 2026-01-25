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

export const apps: App[] = [
  {
    id: 'sajda',
    name: 'Sajda',
    tagline: 'Islamic Prayer Times for macOS',
    description: 'A beautiful menu bar app for accurate prayer times, Adhan reminders, and daily Islamic content. Features JAKIM integration for Malaysia and global calculation methods.',
    icon: '/icons/sajda.png',
    platforms: ['macos'],
    github: {
      owner: 'apitlekays',
      repo: 'Sajda',
    },
    status: 'available',
  },
  {
    id: 'curtask',
    name: 'Curtask',
    tagline: 'Focus on what matters',
    description: 'Task management reimagined. A minimal, distraction-free app to help you focus on your current task. Desktop, web, and mobile.',
    icon: '/icons/curtask.png',
    platforms: ['macos', 'web', 'ios'],
    status: 'coming-soon',
  },
];
