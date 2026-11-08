export type ProjectStatus =
  | 'open-beta'
  | 'closed-beta'
  | 'available'
  | 'coming-soon'
  | 'in-development'
  | 'live'
  | 'open-source';

export const statusLabels: Record<ProjectStatus, string> = {
  'open-beta': 'Open for beta testing',
  'closed-beta': 'Closed beta testing',
  available: 'Available',
  'coming-soon': 'Coming soon',
  'in-development': 'In active development',
  live: 'Live',
  'open-source': 'Open source',
};

export type AudienceId = 'researchers' | 'teachers' | 'muslims' | 'developers';

export const audiences: { id: AudienceId; title: string }[] = [
  { id: 'researchers', title: 'For researchers' },
  { id: 'teachers', title: 'For teachers and students' },
  { id: 'muslims', title: 'For Muslims' },
  { id: 'developers', title: 'For developers' },
];

export interface ProjectIconSource {
  src?: string;
  // Shown when a project has no icon of its own yet.
  monogram?: string;
  // Draws a tile behind icons that have no background of their own.
  framed?: boolean;
  pixelated?: boolean;
}

export interface ProjectAction {
  label: string;
  href: string;
}

export interface ProjectFeature {
  title: string;
  detail: string;
}

export interface ProjectFact {
  label: string;
  value: string;
}

export interface ProjectScreen {
  src: string;
  caption: string;
}

export interface Project {
  slug: string;
  name: string;
  kind: 'app' | 'open-source';
  audience: AudienceId;
  status: ProjectStatus;
  icon: ProjectIconSource;
  platforms: string[];
  tagline: string;
  note?: string;
  notice?: string;
  about: string[];
  features: ProjectFeature[];
  facts: ProjectFact[];
  actions: ProjectAction[];
  download?: { owner: string; repo: string };
  github?: { owner: string; repo: string };
  npmPackage?: string;
  install?: string;
  screens?: ProjectScreen[];
  // How search engines should read this project. Left out: web apps become WebApplication,
  // other apps SoftwareApplication in EducationalApplication, libraries SoftwareSourceCode.
  schema?: { type?: 'Blog'; category?: string };
}

export const projects: Project[] = [
  {
    slug: 'curtask',
    name: 'CurTask',
    kind: 'app',
    audience: 'researchers',
    status: 'open-beta',
    icon: { src: '/icons/curtask.svg', framed: true },
    platforms: ['Web'],
    tagline: 'One research workspace for your sources, analysis and writing.',
    notice: 'CurTask is open for beta testing, and anyone can sign up.',
    about: [
      'CurTask brings your sources, analysis and writing into one research workspace, so a folder of PDFs can become a literature matrix, a set of themes and a cited chapter.',
      'The AI takes the slow, mechanical parts: it imports papers, skips duplicates, reads scanned pages and pulls out sample, method and findings. Every value it gives links to the page and quote it came from. You check the evidence, make the argument and write every sentence.',
      'I built it as a senior lecturer at UPSI, for the research I do and the students I teach.',
    ],
    features: [
      {
        title: 'Library',
        detail: 'Import your PDFs, including scanned ones. Duplicates are skipped.',
      },
      {
        title: 'Literature matrix',
        detail: 'Compare papers side by side. Each cell links to the exact page and quote behind it.',
      },
      {
        title: 'Qualitative coding',
        detail: 'The AI suggests codes and themes across your papers. You accept, change or reject them.',
      },
      {
        title: 'Writing',
        detail: 'Write with your sources beside you. CurTask flags uncited sentences, checks whether a citation fits and formats your references.',
      },
      {
        title: 'Your data',
        detail: 'Papers are kept on servers in Malaysia, and you can download everything in one file at any time.',
      },
    ],
    facts: [
      { label: 'Runs in', value: 'Your web browser' },
      { label: 'Made for', value: "Master's and PhD students, researchers and academics" },
      { label: 'Languages', value: 'English and Bahasa Malaysia' },
      { label: 'Price', value: 'Free plan, no card needed' },
    ],
    actions: [
      { label: 'Join the beta', href: 'https://app.curtask.com/signup' },
      { label: 'Visit curtask.com', href: 'https://www.curtask.com' },
    ],
    screens: [
      { src: '/screens/curtask-evidence.jpg', caption: 'The literature matrix, with the page and quote behind a value. Sample data.' },
      { src: '/screens/curtask-writing.jpg', caption: 'Writing with sources. Sample data.' },
      { src: '/screens/curtask-coding.jpg', caption: 'Qualitative coding. Sample data.' },
      { src: '/screens/curtask-synthesis.jpg', caption: 'The synthesis map. Sample data.' },
    ],
  },
  {
    slug: 'sajda',
    schema: { category: 'LifestyleApplication' },
    name: 'Sajda',
    kind: 'app',
    audience: 'muslims',
    status: 'available',
    icon: { src: '/icons/sajda.png' },
    platforms: ['macOS', 'Windows'],
    tagline: 'Islamic prayer times in your menu bar or system tray.',
    note: 'A new multi-platform successor, Serambi Iman, is coming.',
    notice: 'A new multi-platform successor, Serambi Iman, is coming. Sajda stays available to download in the meantime.',
    about: [
      'Sajda sits in your macOS menu bar or Windows system tray and counts down to the next prayer.',
      'In Malaysia it takes prayer times directly from JAKIM. Elsewhere it calculates them on your computer, using methods such as MUIS, MWL, ISNA and Umm Al-Qura.',
    ],
    features: [
      {
        title: 'Next prayer at a glance',
        detail: 'A countdown in the menu bar, with Malay prayer names and Friday labelled as Jumaat.',
      },
      {
        title: 'Your choice of alert',
        detail: 'Set Adhan, chime or mute for each prayer. Click the menu bar icon to stop a playing Adhan.',
      },
      {
        title: 'Hijri calendar',
        detail: 'The Hijri date in the header, with countdowns to Ramadhan and Eid al-Fitr and alerts on key dates.',
      },
      {
        title: 'Daily reminders',
        detail: "Hadith and dua notifications on your own schedule or at random times, and a reminder to read Surah Al-Kahf on Fridays.",
      },
      {
        title: 'Location',
        detail: 'Uses your computer’s location service, and falls back to your IP address if that is off or denied.',
      },
    ],
    facts: [
      { label: 'Runs on', value: 'macOS 13 or later (Apple Silicon and Intel), Windows 10 or 11 (64-bit)' },
      { label: 'Price', value: 'Free' },
      { label: 'Built with', value: 'Tauri, Rust and React' },
    ],
    actions: [{ label: 'Source on GitHub', href: 'https://github.com/apitlekays/Sajda' }],
    download: { owner: 'apitlekays', repo: 'Sajda' },
    screens: [
      { src: '/screengrabs/Main Page.png', caption: 'Prayer times and the countdown.' },
      { src: '/screengrabs/Main Countdown & Hijri Dates Reminder.png', caption: 'Hijri dates and reminders.' },
      { src: '/screengrabs/Athan Options.png', caption: 'Adhan options.' },
      { src: '/screengrabs/Location & Analytics Settings.png', caption: 'Location settings.' },
      { src: '/screengrabs/Option Athan, Chime, Mute & Prayer Tracker.png', caption: 'Alerts for each prayer and the prayer tracker.' },
      { src: '/screengrabs/Settings Page.png', caption: 'Settings.' },
    ],
  },
  {
    slug: 'kelasruum',
    name: 'Kelasruum',
    kind: 'app',
    audience: 'teachers',
    status: 'closed-beta',
    icon: { src: '/icons/kelasruum.png' },
    platforms: ['Web', 'Installable on phones'],
    tagline: 'Classroom assessment (PBD) for Malaysian teachers, straight from the DSKP.',
    notice: 'Kelasruum is in closed beta testing. For now, only invited teachers can sign up or log in.',
    about: [
      'Pentaksiran Bilik Darjah asks teachers to record a Tahap Penguasaan (TP 1-6) for every learning standard and every student, across several classes. That work usually lives on paper, in Excel sheets and in phone galleries.',
      'Kelasruum puts the official DSKP inside the app, so a teacher picks a standard instead of typing it. Assessments and classroom evidence then build up into one profile for each student, ready to show or send to parents.',
    ],
    features: [
      {
        title: 'Curriculum built in',
        detail: 'KSSR and KSSM standards are stored per subject and grade. A subject opens to teachers once its DSKP has been imported and checked.',
      },
      {
        title: 'Tap to assess',
        detail: 'Tap a student, pick a learning standard, read the rubric and record a level. It is designed to take under 15 seconds, one-handed, on a phone.',
      },
      {
        title: 'Classroom feed',
        detail: 'Post photos and notes to a class feed and tag the students involved. Each post becomes evidence on their profiles.',
      },
      {
        title: 'Student profile and report',
        detail: 'Scores and evidence roll up into a profile that teachers can share with parents as a PDF or a link.',
      },
    ],
    facts: [
      { label: 'Runs in', value: 'Your web browser, and installs on phones' },
      { label: 'Made for', value: 'Teachers in Malaysia' },
      { label: 'Languages', value: 'Bahasa Malaysia and English' },
      { label: 'Price', value: 'Free for teachers' },
    ],
    actions: [{ label: 'Visit kelasruum.com', href: 'https://kelasruum.com' }],
    screens: [{ src: '/screens/kelasruum.jpg', caption: 'The kelasruum.com home page.' }],
  },
  {
    slug: 'magicmeeting',
    schema: { category: 'BusinessApplication' },
    name: 'MagicMeeting',
    kind: 'app',
    audience: 'researchers',
    status: 'available',
    icon: { src: '/icons/magicmeeting.png' },
    platforms: ['macOS'],
    tagline: 'Meeting and interview transcripts that never leave your Mac.',
    about: [
      'MagicMeeting records a meeting or interview and gives you a transcript split by speaker, structured minutes and qualitative coding linked to the audio.',
      'Everything runs on your Mac. The speech models download once, and after that it works with no network. There is no account, no cloud service and no telemetry.',
    ],
    features: [
      {
        title: 'Live transcript',
        detail: 'Capture your microphone and system audio together and watch the transcript appear as people speak. You can also open a recording you already have.',
      },
      {
        title: 'Speaker labels',
        detail: 'Voices are separated automatically. Rename a speaker once and it updates in the transcript, notes and minutes.',
      },
      {
        title: 'Corrections',
        detail: 'Fix any line, merge fragments into one turn or split a segment where two people overlapped.',
      },
      {
        title: 'Minutes and action items',
        detail: 'Turn decisions into action items with an owner, priority and status, gathered into one table.',
      },
      {
        title: 'Qualitative coding',
        detail: 'Tag excerpts with codes, group them into categories and themes, add memos and jump back to that moment in the audio.',
      },
      {
        title: 'About 99 languages',
        detail: 'Choose a language or let it detect one, including Bahasa Malaysia, Arabic and English. Export to PDF or Word.',
      },
    ],
    facts: [
      { label: 'Runs on', value: 'macOS 12.3 or later (Apple Silicon and Intel)' },
      { label: 'System audio', value: 'Needs macOS 13 or later' },
      { label: 'Price', value: 'Free, no account' },
    ],
    actions: [{ label: 'All releases', href: 'https://github.com/apitlekays/magicmeeting-releases/releases' }],
    download: { owner: 'apitlekays', repo: 'magicmeeting-releases' },
  },
  {
    slug: 'suluhdiff',
    name: 'SuluhDiff',
    kind: 'app',
    audience: 'researchers',
    status: 'coming-soon',
    icon: { src: '/icons/suluhdiff.png' },
    platforms: ['Mac', 'iPad'],
    tagline: 'See what changed between drafts, and whether your feedback was addressed.',
    notice: 'SuluhDiff is coming soon to the App Store for Mac and iPad.',
    about: [
      'SuluhDiff is for academics who read many versions of the same piece of writing: students’ theses and assignments, colleagues’ papers and your own manuscripts. It compares drafts paragraph by paragraph and word by word.',
      'Suluh is Malay for a torch, something that lights the way.',
    ],
    features: [
      {
        title: 'Projects by role',
        detail: 'Organise work under Supervising, My Writing, Reviewing for colleagues or Examining, with optional folders for a course or semester.',
      },
      {
        title: 'Imports your drafts',
        detail: 'Word files with tracked changes and comments, PDF with annotations, LaTeX, Markdown and plain text.',
      },
      {
        title: 'Two ways to compare',
        detail: 'Ribbon View joins two drafts side by side and flags moved paragraphs. Inline View marks changes in one column.',
      },
      {
        title: 'Feedback that follows the text',
        detail: 'Comment on a passage. When the next draft arrives, each comment is checked: unchanged, revised, removed or moved.',
      },
      {
        title: 'Academic analysis',
        detail: 'See how much changed per chapter, which citations were added or removed, and which are missing from the reference list.',
      },
      {
        title: 'Reports',
        detail: 'Produce an A4 PDF or HTML report of changes and feedback, in English or Bahasa Malaysia, labelled for your role.',
      },
    ],
    facts: [
      { label: 'Runs on', value: 'macOS 26 or later, iPadOS 26 or later' },
      { label: 'Your data', value: 'Drafts and comments stay on your device and in your own iCloud' },
      { label: 'Languages', value: 'English and Bahasa Malaysia' },
    ],
    actions: [],
  },
  {
    slug: 'hackedu',
    schema: { type: 'Blog' },
    name: 'Hack(edu).tech',
    kind: 'app',
    audience: 'researchers',
    status: 'live',
    icon: { src: '/icons/hackedu.png', framed: true },
    platforms: ['Web'],
    tagline: 'My scholarly blog on education and technology.',
    about: [
      'Hack(edu).tech is where I write about education, technology and everything in between. The essays are written to be read and to be cited.',
      'I built and host the site myself, so that each article carries the details Google Scholar looks for, along with a citation and a PDF.',
    ],
    features: [
      {
        title: 'Made for Google Scholar',
        detail: 'Articles carry Highwire Press metadata, so Google Scholar can index them directly.',
      },
      {
        title: 'Ready to cite',
        detail: 'Each article shows a citation to copy, with its DOI where one has been issued.',
      },
      {
        title: 'Citation PDF',
        detail: 'A PDF of each article is produced when it is published.',
      },
      {
        title: 'Working paper series',
        detail: 'New articles are numbered as a working paper series.',
      },
    ],
    facts: [
      { label: 'Address', value: 'hackedu.tech' },
      { label: 'Built with', value: 'Astro and PostgreSQL, self-hosted' },
    ],
    actions: [{ label: 'Read the essays', href: 'https://hackedu.tech' }],
    screens: [{ src: '/screens/hackedu.jpg', caption: 'The Hack(edu).tech home page.' }],
  },
  {
    slug: 'suluh',
    schema: { category: 'GameApplication' },
    name: 'SULUH',
    kind: 'app',
    audience: 'teachers',
    status: 'in-development',
    icon: { src: '/icons/suluh.webp', framed: true, pixelated: true },
    platforms: ['Web', 'Phone and laptop'],
    tagline: 'A multiplayer 3D campus game for a course on Malaysian education.',
    notice: 'SULUH is in active development. New parts of the game open as they are ready.',
    about: [
      'SULUH is a game-based learning platform set in a stylised recreation of UPSI’s Sultan Abdul Jalil Shah campus in Tanjong Malim.',
      'I am building it for KPF3013, the first-year course I teach on the philosophy, policy and curriculum of Malaysian education. Students create a character, explore the campus together and enter lairs where the course content becomes interactive tasks.',
    ],
    features: [
      {
        title: 'Shared campus',
        detail: 'Students walk the same 3D campus together, on a phone or a laptop.',
      },
      {
        title: 'Character creator',
        detail: 'Each student makes a character and picks a nickname.',
      },
      {
        title: 'Proximity chat',
        detail: 'Chat reaches the students standing near you, with moderation tools for the lecturer.',
      },
      {
        title: 'Lairs, in progress',
        detail: 'Course content becomes tasks inside each lair, and completing a lair’s tasks earns a relic.',
      },
    ],
    facts: [
      { label: 'Made for', value: 'Students enrolled in KPF3013 at UPSI' },
      { label: 'Languages', value: 'Bahasa Malaysia and English' },
      { label: 'Access', value: 'Sign-in with a UPSI student email' },
    ],
    actions: [{ label: 'Student sign-in', href: 'https://suluh.upsi.dev' }],
    screens: [{ src: '/screens/suluh.jpg', caption: 'The SULUH sign-in screen.' }],
  },
  {
    slug: 'suluhalms',
    name: 'SuluhALMS',
    kind: 'app',
    audience: 'teachers',
    status: 'in-development',
    icon: { src: '/icons/suluhalms.png' },
    platforms: ['macOS'],
    tagline: 'Turns a PDF, Word file, web page or YouTube lecture into a self-paced mastery course.',
    notice: 'SuluhALMS is in a pilot at UPSI and still in active development. Builds for Apple silicon Macs are public.',
    about: [
      'SuluhALMS turns your teaching material into a self-paced course: objectives, units, unit videos, questions and spaced review.',
      'Learners move unit by unit. A unit opens once the one before is mastered at 80 percent, and anyone who falls short gets corrective lessons and a fresh retest. Every explanation and question cites the page or section it came from.',
      'Answers and progress stay on the Mac, and there is no account. Only the course text goes to the AI provider you choose, and with Ollama nothing leaves the Mac at all.',
    ],
    features: [
      {
        title: 'Any source',
        detail: 'Start from a PDF, including scanned pages, a Word file, a web page or a YouTube lecture. Long books are split into chapters so you choose what to cover.',
      },
      {
        title: 'Mastery path',
        detail: 'Every learner starts at the first unit. The level you pick sets the depth, from plain language for beginners to critique and transfer for experts.',
      },
      {
        title: 'Unit videos',
        detail: 'Each unit gets a narrated video with drawn diagrams. Questions pause the video, and a wrong answer offers to rewind to the part that explains it.',
      },
      {
        title: 'Spaced review',
        detail: 'Questions come back on a schedule, so learners revisit what they are about to forget.',
      },
      {
        title: 'Report a problem',
        detail: 'A learner can flag a question that seems wrong. It stops counting toward the score and a replacement is written.',
      },
      {
        title: 'Share a course',
        detail: 'Build a course once and export it as one file. It opens on another Mac with its videos ready, with nothing rebuilt or paid for again.',
      },
      {
        title: 'Analytics',
        detail: 'See mastery per objective, time on task, video engagement and common misconceptions, and export a PDF report in English or Bahasa Malaysia.',
      },
    ],
    facts: [
      { label: 'Runs on', value: 'macOS 14 or later, Apple silicon' },
      { label: 'AI provider', value: 'Your own Claude or OpenAI key, or Ollama running on the Mac' },
      { label: 'Languages', value: 'English and Bahasa Malaysia' },
      { label: 'Stage', value: 'Pilot at UPSI' },
    ],
    actions: [{ label: 'All releases', href: 'https://github.com/apitlekays/alms-releases/releases' }],
    download: { owner: 'apitlekays', repo: 'alms-releases' },
  },
  {
    slug: 'spectre-ui',
    name: 'Spectre UI',
    kind: 'open-source',
    audience: 'developers',
    status: 'open-source',
    icon: { src: '/icons/spectre-ui.svg', framed: true },
    platforms: ['React'],
    tagline: 'A React component framework with a dark, HUD-style look.',
    about: [
      'Spectre UI is a set of more than 35 React components for building interfaces that look like a heads-up display: sharp edges, HUD corners and monospace type.',
      'It builds on Radix UI for keyboard and screen reader support, and on Framer Motion for animation.',
    ],
    features: [
      {
        title: 'Components',
        detail: 'Layout, data display, forms, feedback and navigation, from buttons to command palettes.',
      },
      {
        title: 'Themes',
        detail: 'Cyber Dark and Cyber Light presets, themed with CSS variables.',
      },
      {
        title: 'Tailwind plugin',
        detail: 'A plugin and preset bring the design tokens and utilities into Tailwind CSS.',
      },
      {
        title: 'TypeScript',
        detail: 'Types are exported with the components, and you import only what you use.',
      },
    ],
    facts: [
      { label: 'Language', value: 'TypeScript' },
      { label: 'Licence', value: 'MIT' },
    ],
    actions: [
      { label: 'Read the docs', href: 'https://spectreui.dev' },
      { label: 'Source on GitHub', href: 'https://github.com/apitlekays/spectre-ui' },
    ],
    github: { owner: 'apitlekays', repo: 'spectre-ui' },
    install: 'pnpm add @spectre-ui/core framer-motion',
    screens: [{ src: '/screens/spectre.jpg', caption: 'The spectreui.dev home page.' }],
  },
  {
    slug: 'myschoollist',
    name: 'MySchoolList',
    kind: 'open-source',
    audience: 'developers',
    status: 'open-source',
    icon: { monogram: 'MS', framed: true },
    platforms: ['JavaScript'],
    tagline: 'A JavaScript library listing Malaysia’s schools by state and district.',
    about: [
      'MySchoolList gives your app the list of 10,230 schools in Malaysia, organised by state and district. The data comes from the Ministry of Education Malaysia (June 2022 release).',
      'Use it to fill a school picker without keeping your own copy of the list.',
    ],
    features: [
      {
        title: 'Look up states',
        detail: 'Find a state by id or short name, such as JHR for Johor.',
      },
      {
        title: 'Look up districts and schools',
        detail: 'Go from a state to its districts, and from a district to its schools.',
      },
      {
        title: 'Go version',
        detail: 'A Go port by @svicknesh is also available.',
      },
    ],
    facts: [
      { label: 'Language', value: 'JavaScript' },
      { label: 'Licence', value: 'ISC' },
      { label: 'Data', value: 'Ministry of Education Malaysia, June 2022' },
    ],
    actions: [
      { label: 'Read the docs', href: 'https://apitlekays.github.io/MySchoolList/' },
      { label: 'View on npm', href: 'https://www.npmjs.com/package/my-school-list' },
      { label: 'Source on GitHub', href: 'https://github.com/apitlekays/MySchoolList' },
    ],
    github: { owner: 'apitlekays', repo: 'MySchoolList' },
    npmPackage: 'my-school-list',
    install: 'npm i my-school-list',
    screens: [{ src: '/screens/myschoollist.jpg', caption: 'The MySchoolList documentation page.' }],
  },
];
