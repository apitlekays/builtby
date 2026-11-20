export type ProjectStatus =
  | 'open-beta'
  | 'closed-beta'
  | 'available'
  | 'coming-soon'
  | 'in-development'
  | 'live'
  | 'open-source'
  | 'retired';

export const statusLabels: Record<ProjectStatus, string> = {
  'open-beta': 'Open for beta testing',
  'closed-beta': 'Closed beta testing',
  available: 'Available',
  'coming-soon': 'Coming soon',
  'in-development': 'In active development',
  live: 'Live',
  'open-source': 'Open source',
  retired: 'No longer live',
};

export type AudienceId = 'researchers' | 'teachers' | 'muslims' | 'developers' | 'humanitarians';

export const audiences: { id: AudienceId; title: string }[] = [
  { id: 'researchers', title: 'For researchers' },
  { id: 'teachers', title: 'For teachers and students' },
  { id: 'muslims', title: 'For Muslims' },
  { id: 'developers', title: 'For developers' },
  { id: 'humanitarians', title: 'For humanitarian activists' },
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

// A list in a document: bullets, or downloads (each item a [label](href) link to a file).
export interface DocList {
  kind: 'bullets' | 'downloads';
  items: string[];
}

// A paragraph is a string; [label](href) inside it becomes a link.
export type DocBlock = string | DocList;

export interface DocSection {
  heading: string;
  blocks: DocBlock[];
}

// A page that belongs to a project, at /<project>/<slug>: a privacy policy, terms, support, samples.
export interface ProjectDoc {
  slug: string;
  title: string;
  description: string;
  // Shown under the title, for example 'Effective 16 November 2026'.
  dated?: string;
  intro?: string;
  sections: DocSection[];
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
  docs?: ProjectDoc[];
  // How search engines should read this project. Left out: web apps become WebApplication,
  // other apps SoftwareApplication in EducationalApplication, libraries SoftwareSourceCode.
  // `free` adds a price-0 offer; `publisher` names who releases it, when that isn't me.
  schema?: { type?: 'Blog'; category?: string; free?: boolean; publisher?: string };
  // The page title and description in search results, when the name and first paragraph
  // don't say what people search for. Keep the title under 60 characters and the description under 155.
  search?: { title: string; description: string };
}

export const pageTitle = (project: Project) => project.search?.title ?? `${project.name} | builtby.`;
export const pageDescription = (project: Project) => project.search?.description ?? project.about[0];

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
    schema: { category: 'ProductivityApplication', free: true, publisher: 'HackEduTech Labs' },
    search: {
      title: 'SuluhDiff: compare two drafts on Mac and iPad | builtby.',
      description:
        'Compare two drafts of a thesis, article or novel on Mac and iPad. See every word added, cut, rewritten or moved, and whether your feedback was taken.',
    },
    name: 'SuluhDiff',
    kind: 'app',
    audience: 'researchers',
    status: 'available',
    icon: { src: '/icons/suluhdiff.png' },
    platforms: ['Mac', 'iPad'],
    tagline: 'The missing diff tool for writers: see every change between two drafts, and whether your feedback was taken.',
    notice: 'SuluhDiff is on the App Store now for Mac and iPad. Comparing drafts is free; one purchase unlocks the rest on both.',
    about: [
      'SuluhDiff puts two drafts of a thesis, article or novel side by side and shows every word that was added, cut, rewritten or moved, joined by ribbons so you can follow each paragraph from one draft to the next.',
      'Programmers have always been able to see exactly what changed between two versions of their work. Writers have had to read both drafts and hope they spot the differences. SuluhDiff is for supervisors and lecturers checking a student’s revised chapter, students and researchers revising their own work, and novelists and professional writers reviewing an editor’s pass.',
      'Suluh is Malay for a torch, something that lights the way.',
    ],
    features: [
      {
        title: 'Every edit, marked in place',
        detail: 'Ribbon View joins two drafts side by side. Inline View shows cuts struck through and new text highlighted in one clean read.',
      },
      {
        title: 'Moves are moves',
        detail: 'A paragraph that moved is recognised as a move, not as a deletion and an addition.',
      },
      {
        title: 'Feedback that follows the text',
        detail: 'Comment on any passage. When the next draft arrives, each comment is checked against it: revised, unchanged, removed or moved.',
      },
      {
        title: 'Every citation, accounted for',
        detail: 'See citations added and removed, and catch citations missing from the reference list before your examiner does.',
      },
      {
        title: 'Find across both drafts',
        detail: 'Follow a key term through a revision: only the changes, only one draft, whole words, or with accents and Arabic harakat ignored.',
      },
      {
        title: 'Reports and revisions',
        detail: 'Export a change and feedback report as PDF or HTML, in English or Bahasa Malaysia. Fork any draft and edit your own revision beside it.',
      },
      {
        title: 'The files you already have',
        detail: 'Word with tracked changes and comments, PDF with annotations, LaTeX, Markdown and plain text, including Arabic and Hebrew.',
      },
      {
        title: 'Private by design',
        detail: 'No account, no tracking, no analytics. Optional sync between your Mac and iPad is end-to-end encrypted in your own iCloud.',
      },
    ],
    facts: [
      { label: 'Runs on', value: 'macOS 26 or later, iPadOS 26 or later' },
      { label: 'Price', value: 'Free to compare drafts. One purchase unlocks comments, reports, Find, revisions and sync on your Mac and iPad, with no subscription.' },
      { label: 'Languages', value: 'More than 40 interface languages. Reports in English or Bahasa Malaysia.' },
      { label: 'Your data', value: 'Stays on your device, or end-to-end encrypted in your own iCloud' },
      { label: 'By', value: 'HackEduTech Labs' },
    ],
    actions: [
      { label: 'Download on the App Store', href: 'https://apps.apple.com/app/suluhdiff/id6831143497' },
      { label: 'Try the sample drafts', href: '/suluhdiff/samples' },
    ],
    screens: [
      { src: '/screens/suluhdiff-mac-1-novelRibbon.jpg', caption: 'SuluhDiff on the Mac: two drafts of a novel chapter side by side.' },
      { src: '/screens/suluhdiff-ipad-1-novelRibbon.jpg', caption: 'On the iPad: the missing diff tool for writers.' },
      { src: '/screens/suluhdiff-ipad-2-novel.jpg', caption: 'For novelists and professional writers: every edit, marked in place.' },
      { src: '/screens/suluhdiff-ipad-3-feedback.jpg', caption: 'For supervisors and lecturers: know if your feedback was taken.' },
      { src: '/screens/suluhdiff-ipad-4-citations.jpg', caption: 'For students and researchers: every citation, accounted for.' },
      { src: '/screens/suluhdiff-ipad-5-find.jpg', caption: 'Find across both drafts: follow a key term through every revision.' },
      { src: '/screens/suluhdiff-ipad-6-thesis.jpg', caption: 'Chapter by chapter: see where a draft really changed.' },
      { src: '/screens/suluhdiff-mac-3-feedback.jpg', caption: 'On the Mac: comments checked against the next draft.' },
      { src: '/screens/suluhdiff-mac-4-citations.jpg', caption: 'On the Mac: citations added, removed and missing.' },
      { src: '/screens/suluhdiff-mac-5-find.jpg', caption: 'On the Mac: Find in both drafts.' },
      { src: '/screens/suluhdiff-mac-6-thesis.jpg', caption: 'On the Mac: how much each section changed.' },
    ],
    docs: [
      {
        slug: 'privacy',
        title: 'Privacy Policy',
        description: 'SuluhDiff collects no data: no account, no tracking, no analytics. Your drafts stay on your device, and optional sync is end-to-end encrypted.',
        dated: 'Effective 16 November 2026',
        intro: 'SuluhDiff compares drafts of your writing. Your drafts, comments and reports are yours: SuluhDiff does not collect them, and neither does its developer, Mohd Hafiz bin Md Hanif, trading as HackEduTech Labs.',
        sections: [
          {
            heading: 'What SuluhDiff does not collect',
            blocks: [
              {
                kind: 'bullets',
                items: [
                  'No account is needed, and SuluhDiff does not ask for your name, email or contacts.',
                  'No analytics, advertising or tracking of any kind, and no third-party software that does these things.',
                  'The developer runs no servers for SuluhDiff, so your documents are never sent to the developer.',
                ],
              },
            ],
          },
          {
            heading: 'Where your library is kept',
            blocks: [
              'Your projects, drafts, comments and settings are stored on your device. The name you enter as the reviewer appears only in your own comments and reports.',
            ],
          },
          {
            heading: 'Sync between your devices',
            blocks: [
              'Sync is off until you turn it on in Settings › Sync. When it is on, SuluhDiff encrypts your library on your device with a key that only your devices hold, shown to you as a 24-word recovery phrase. The encrypted files are stored in your own iCloud account.',
              'Apple stores only encrypted data for SuluhDiff. The developer cannot read it and does not have your key.',
            ],
          },
          {
            heading: 'Purchases',
            blocks: [
              'Buying the unlock is handled by Apple through the App Store. The developer does not receive your payment details. [Apple’s privacy policy](https://www.apple.com/legal/privacy/) applies to purchases.',
            ],
          },
          {
            heading: 'Crash reports',
            blocks: [
              'If you choose to share analytics with app developers in your device’s settings, Apple may send the developer anonymous crash reports. These contain technical details about the crash, not your documents.',
            ],
          },
          {
            heading: 'Children',
            blocks: ['SuluhDiff collects no personal information from anyone, including children.'],
          },
          {
            heading: 'Changes to this policy',
            blocks: ['If this policy changes, the new version will be posted on this page with a new effective date.'],
          },
          {
            heading: 'Contact',
            blocks: ['Questions about privacy: [hello@hackedu.tech](mailto:hello@hackedu.tech).'],
          },
        ],
      },
      {
        slug: 'terms',
        title: 'Terms of Use',
        description: 'The terms for using SuluhDiff: Apple’s standard licence, the free comparison and the one-time unlock, your content, and who to contact.',
        dated: 'Effective 16 November 2026',
        intro: 'SuluhDiff is provided by Mohd Hafiz bin Md Hanif, trading as HackEduTech Labs, in Malaysia (“we”). By downloading or using SuluhDiff you agree to these terms.',
        sections: [
          {
            heading: 'Apple’s licence',
            blocks: [
              'SuluhDiff is licensed to you under Apple’s [Licensed Application End User License Agreement](https://www.apple.com/legal/internet-services/itunes/dev/stdeula/) (the Apple Standard EULA). These terms add to it. Where the two differ, the Apple Standard EULA applies.',
            ],
          },
          {
            heading: 'The free comparison and the unlock',
            blocks: [
              'Comparing drafts is free. An optional one-time in-app purchase, Unlock SuluhDiff, adds comments, reports, Find, revisions and sync. It is not a subscription and does not renew.',
              'The purchase is made through the App Store and belongs to your Apple Account, so it unlocks SuluhDiff on your Mac and iPad. To unlock another device, choose Restore Purchase in Settings › General. The price is shown in the App Store before you buy and may change for future buyers; a change never affects a purchase already made.',
            ],
          },
          {
            heading: 'Refunds',
            blocks: [
              'Purchases are processed by Apple, so refunds are handled by Apple under its own rules. You can ask for one at [reportaproblem.apple.com](https://reportaproblem.apple.com).',
            ],
          },
          {
            heading: 'Your content',
            blocks: [
              'Your drafts, comments and reports remain yours, and we receive none of them. You are responsible for having the right to import and keep the documents you compare, including students’ and colleagues’ work, under your institution’s rules.',
              'SuluhDiff shows differences between texts. It is a tool for reading drafts, not a judgement of their quality or originality, and it is not a plagiarism checker. Check anything important against the documents themselves.',
            ],
          },
          {
            heading: 'Sync and your recovery phrase',
            blocks: [
              'Optional sync stores your encrypted library in your own iCloud account. Only your devices hold the key. Keep your 24-word recovery phrase safe: if it is lost and no device is still syncing, nobody can open the encrypted copy, including us.',
            ],
          },
          {
            heading: 'Using SuluhDiff fairly',
            blocks: [
              'Use SuluhDiff lawfully and in line with the Apple Standard EULA. Do not copy, resell or redistribute the app, or try to get around the unlock.',
            ],
          },
          {
            heading: 'No warranty, and limits on liability',
            blocks: [
              'SuluhDiff is provided as is. To the extent the law allows, we are not liable for lost data or for decisions made on the basis of a comparison. Keep your own copies of important documents.',
              'Nothing in these terms takes away rights you have under consumer law that cannot be excluded.',
            ],
          },
          {
            heading: 'Changes and the law that applies',
            blocks: [
              'If these terms change, the new version will be posted on this page with a new effective date. These terms are governed by the laws of Malaysia, without limiting the consumer protections of the country where you live.',
            ],
          },
          {
            heading: 'Contact',
            blocks: ['Write to [hello@hackedu.tech](mailto:hello@hackedu.tech). See also the [privacy policy](/suluhdiff/privacy).'],
          },
        ],
      },
      {
        slug: 'support',
        title: 'Support',
        description: 'Help with SuluhDiff on Mac and iPad: the free comparison, the one-time unlock, file types, sync and how to contact the developer.',
        intro: 'Help with SuluhDiff, the diff tool for writers on Mac and iPad.',
        sections: [
          {
            heading: 'Contact',
            blocks: [
              'Write to [hello@hackedu.tech](mailto:hello@hackedu.tech). Please say whether you use a Mac or an iPad, and which version of SuluhDiff. You will usually hear back within two working days.',
            ],
          },
          {
            heading: 'What can I do for free?',
            blocks: [
              'Comparing drafts is always free: import any drafts and see what changed, side by side or inline. One purchase unlocks comments, reports, Find, revisions and sync.',
            ],
          },
          {
            heading: 'I bought SuluhDiff on my Mac. Do I pay again on my iPad?',
            blocks: [
              'No. Sign in to the App Store with the same Apple Account, open SuluhDiff on the iPad, and choose Settings › General › Restore Purchase.',
            ],
          },
          {
            heading: 'Which files can I compare?',
            blocks: [
              'Word (.docx, with tracked changes and comments), PDF (with annotations), LaTeX, Markdown and plain text. To try it out, use the [sample drafts](/suluhdiff/samples).',
            ],
          },
          {
            heading: 'How do I sync my library between my Mac and iPad?',
            blocks: [
              'On the device that has your library, open Settings › Sync and choose Turn On Sync, then write down the 24-word recovery phrase. On your other device, choose Add This Device to a Synced Library and enter the phrase or scan the code. Your library is encrypted before it leaves your device.',
            ],
          },
          {
            heading: 'I lost my recovery phrase.',
            blocks: [
              'On a device that is still syncing, open Settings › Sync and choose Add Another Device, which shows the phrase. If no device is syncing any more, nobody can open the encrypted copy, including the developer, but the library on each device is still there.',
            ],
          },
          {
            heading: 'Is my writing sent anywhere?',
            blocks: [
              'No. Your library stays on your device unless you turn on sync, and then only in encrypted form. See the [privacy policy](/suluhdiff/privacy) and the [terms of use](/suluhdiff/terms).',
            ],
          },
        ],
      },
      {
        slug: 'samples',
        title: 'Sample drafts',
        description: 'Two pairs of sample Word drafts to try SuluhDiff with: a novel chapter after an editing pass, and a thesis chapter after a supervisor’s feedback.',
        intro: 'Two pairs of Word files for trying SuluhDiff. Download both drafts of a pair, then import them into one project: the second draft opens compared with the first.',
        sections: [
          {
            heading: 'A novel chapter after an editing pass',
            blocks: [
              'Chapter Four of The Salt Road, a short piece of fiction written for this example. The second draft tightens sentences, moves one paragraph and adds a closing line.',
              {
                kind: 'downloads',
                items: [
                  '[Draft 1 (salt-road-draft-1.docx)](/suluhdiff/samples/salt-road-draft-1.docx)',
                  '[Draft 2 (salt-road-draft-2.docx)](/suluhdiff/samples/salt-road-draft-2.docx)',
                ],
              },
            ],
          },
          {
            heading: 'A thesis chapter after a supervisor’s feedback',
            blocks: [
              'Chapter 2 of a sample thesis on the digital readiness of rural teachers, written for this example. The second draft adds a definition, fixes a citation year, moves the sampling paragraph out and adds new references.',
              {
                kind: 'downloads',
                items: [
                  '[Draft 1 (thesis-chapter-2-draft-1.docx)](/suluhdiff/samples/thesis-chapter-2-draft-1.docx)',
                  '[Draft 2 (thesis-chapter-2-draft-2.docx)](/suluhdiff/samples/thesis-chapter-2-draft-2.docx)',
                ],
              },
            ],
          },
          {
            heading: 'How to try them',
            blocks: [
              'On an iPad, tap each file and save it to Files. In SuluhDiff, tap New Project, then Import Draft and pick Draft 1, then import Draft 2.',
              'On a Mac, choose File › New Project, then File › Import Draft, or drag both files into the window.',
            ],
          },
        ],
      },
    ],
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
    tagline: 'A study companion that turns a PDF, Word file, web page or YouTube lecture into a self-paced mastery course.',
    notice: 'SuluhALMS is in public beta, with a pilot at UPSI, and still in active development. Builds for Apple silicon Macs are public; testers can read the beta tester guide under Details.',
    about: [
      'SuluhALMS is a study companion for anyone learning something in a structured way: a student working through a textbook, a teacher taking on a new topic, or anyone who wants to really understand a long lecture. Give it your material and it builds a self-paced course with objectives, units, narrated unit videos, questions and spaced review, then takes you through it one step at a time.',
      'Behind it is a team of AI agents led by an Orchestrator. A Source Analyst reads your material, a Curriculum Architect plans the units, an Instructional Designer writes the lessons, an Assessment Designer writes the questions and a Media Producer makes the videos. A Quality Auditor checks their work against the source before you see it. While you learn, a Learning Analyst reads your wrong answers and a Tutor answers your questions. The agent log shows which agent did what, and whether a rule or the AI model made each decision.',
      'A unit opens once the one before is mastered at 80 percent, and every explanation and question cites the page or section it came from.',
      'Answers and progress stay on the Mac, and there is no account. Only the course text goes to Claude, with your own key, and the narration goes to HeyGen if you add a HeyGen key.',
    ],
    features: [
      {
        title: 'Any source',
        detail: 'Start from a PDF, including scanned pages, a Word file, a web page or a YouTube lecture. Long books are split into chapters so you choose what to cover.',
      },
      {
        title: 'One step at a time',
        detail: 'Each unit is a short path: your task, watch, read, practise, unit test. A quick check closes each section, and a daily goal and streak keep you going. The level you pick sets the depth, from plain language to critique and transfer.',
      },
      {
        title: 'A Tutor beside every unit',
        detail: 'Ask about a section, a passage you select or a moment in the video. The Tutor answers from the unit’s own pages, names them, says when it goes beyond the course, and gives hints before answers.',
      },
      {
        title: 'Help when you are stuck',
        detail: 'Fall short of 80 percent and each missed objective is taught a different way, followed by a retest with new questions. Miss it again and the Orchestrator picks the next step, such as smaller steps, a recap of an earlier unit or a moment in the video, and tells you why.',
      },
      {
        title: 'Nine agents, one Orchestrator',
        detail: 'Rules handle scheduling, retries and the spending limit. The AI model is asked only where judgement helps: spotting a misconception in your wrong answers, re-planning for a stuck learner, or deciding what to do with work the Quality Auditor keeps rejecting.',
      },
      {
        title: 'Checked before you see it',
        detail: 'Every lesson, question and video script is checked against the source. A wrong answer key goes back to the agent that wrote it, and a question still wrong after two rewrites is left out. You can still report a question; it stops counting and a replacement is written.',
      },
      {
        title: 'Unit videos',
        detail: 'Each unit gets a narrated video with designed scenes such as timelines, cycles, comparisons and charts, drawn only from numbers in your source. Questions pause the video, and a wrong answer offers to rewind to the part that explains it.',
      },
      {
        title: 'Spaced review',
        detail: 'Questions come back on a schedule, so you revisit what you are about to forget.',
      },
      {
        title: 'Share a course',
        detail: 'Build a course once and export it as one file. It opens on another Mac with its videos ready, with nothing rebuilt or paid for again.',
      },
      {
        title: 'Analytics and cost',
        detail: 'See mastery per objective, time on task, video engagement and misconceptions, and export a PDF report in English or Bahasa Malaysia. Each course shows what its AI has cost so far, and you can set a limit.',
      },
    ],
    facts: [
      { label: 'Runs on', value: 'macOS 14 or later, Apple silicon' },
      { label: 'AI provider', value: 'Your own Claude key; the agents choose Sonnet or Haiku for each job. OpenAI and Ollama will come back in a later update.' },
      { label: 'Narration', value: 'With a HeyGen key, Bahasa Malaysia in your own voice recorded in the app or in the SuluhALMS voice, and English in a native English voice; otherwise a macOS voice' },
      { label: 'Languages', value: 'English and Bahasa Malaysia' },
      { label: 'Stage', value: 'Public beta, and a pilot at UPSI' },
    ],
    actions: [{ label: 'All releases', href: 'https://github.com/apitlekays/alms-releases/releases' }],
    download: { owner: 'apitlekays', repo: 'alms-releases' },
    screens: [
      { src: '/screens/suluhalms-1-home.jpg', caption: 'A course home: your path, today’s streak and the agent log, where the Orchestrator re-plans for two missed objectives.' },
      { src: '/screens/suluhalms-2-tutor.jpg', caption: 'Reading with the Tutor beside you. The section was rewritten for this learner, and the Tutor cites the source and says when it goes beyond it.' },
      { src: '/screens/suluhalms-3-corrective.jpg', caption: 'A corrective plan: each missed objective taught a different way before a retest.' },
      { src: '/screens/suluhalms-4-why.jpg', caption: 'Why this plan: the reason for each choice, with a next step you can take.' },
      { src: '/screens/suluhalms-5-video.jpg', caption: 'A scene from a unit video: a process, then a worked case, each step appearing as it is spoken. Bahasa Malaysia course.' },
      { src: '/screens/suluhalms-6-analytics.jpg', caption: 'Analytics: mastery for every objective against the 80 percent line.' },
      { src: '/screens/suluhalms-7-task-ms.jpg', caption: 'A Bahasa Malaysia course in the English interface: the unit’s task comes first.' },
    ],
    docs: [
      {
        slug: 'beta',
        title: 'Beta tester guide',
        description: 'How to install and test the SuluhALMS beta on an Apple silicon Mac: what you need, what to try, what leaves your Mac, and how to report a problem.',
        dated: 'Updated 20 November 2026',
        intro: 'Thank you for testing the SuluhALMS beta. It turns a PDF, document, web page or YouTube video into a course with lessons, videos, practice and a Tutor, built by AI agents on your Mac. This is an early test build, so expect rough edges and tell us about them.',
        sections: [
          {
            heading: 'Before you start',
            blocks: [
              'You need a Mac with an Apple chip and your own Claude API key. A HeyGen key is optional.',
              {
                kind: 'bullets',
                items: [
                  'A Mac with an Apple chip (M1 or newer). Intel Macs are not supported.',
                  'macOS 14 Sonoma or later. Check in Apple menu, About This Mac.',
                  'A Claude API key, from [console.anthropic.com](https://console.anthropic.com). The app shows you how to get one, step by step. Building a course costs about RM 0.35 to RM 0.50 per unit, billed by Anthropic to your account.',
                  'A HeyGen API key, if you want it. It gives videos a natural voice instead of your Mac’s robotic one, billed by HeyGen to your account.',
                  'At least 2 GB of free space. The app takes about 450 MB once installed, the video renderer downloads about 200 MB before your first video, and unit videos add more as you build courses.',
                ],
              },
              'If you were only given a course file to open, you can do that without a Claude key.',
            ],
          },
          {
            heading: 'Install',
            blocks: [
              {
                kind: 'bullets',
                items: [
                  'Download the .dmg file of the [latest release](https://github.com/apitlekays/alms-releases/releases/latest) (about 200 MB). No GitHub account is needed.',
                  'Open the downloaded file and drag SuluhALMS into the Applications folder.',
                  'Open SuluhALMS from Applications. The app is signed and checked by Apple, so macOS opens it without warnings.',
                  'Follow the welcome: three short slides, connecting Claude, then choosing a voice.',
                ],
              },
              'Later versions arrive by themselves: a bar at the bottom of the window says when an update is ready.',
            ],
          },
          {
            heading: 'What to try',
            blocks: [
              'Work through these in order and note anything that is unclear, slow or broken. Start with a short source (a few pages or a 10 minute video) to keep your Claude costs low.',
              {
                kind: 'bullets',
                items: [
                  'The welcome. Did the slides and the Claude key steps make sense? Did you get stuck anywhere?',
                  'Choosing a voice. Try at least one: your Mac’s voice (free), recording your own voice, or the SuluhALMS voice (both need a HeyGen key).',
                  'Recording your own voice. Allow the microphone when macOS asks, read the passage aloud, watch the level meter, listen back, and record again once.',
                  'A first course. Build one from a PDF, a document, a web page or a YouTube link. Note roughly how long it took.',
                  'A unit from start to finish: your task, the video, reading, practice and the unit test.',
                  'The Tutor. Ask it something about the unit. Press ⌘J to open or fold it.',
                  'Both languages. If you can, try a course in Bahasa Malaysia and one in English.',
                ],
              },
              'If a video says your Mac is missing its Malay or English voice, follow the steps it shows to install it.',
            ],
          },
          {
            heading: 'Privacy',
            blocks: [
              'SuluhALMS has no account and sends nothing to us. It talks only to the services you connect, using your own keys.',
              {
                kind: 'bullets',
                items: [
                  'Anthropic (Claude) receives the text and page images of your source when you build a course, and your questions when you ask the Tutor.',
                  'HeyGen receives the narration text of each video, only if you add a HeyGen key.',
                  'HeyGen receives your voice recording only if you record your own voice, to make it in your HeyGen account.',
                  'YouTube or the web page you link to is downloaded normally when you build a course from a link.',
                  'GitHub is checked for updates when the app starts, and supplies the SuluhALMS voice sample if you choose it.',
                  'Before your first video, the app downloads a headless Chrome to draw videos with, once you agree.',
                ],
              },
              'Your courses, answers, progress and videos stay on your Mac. Videos are drawn on your Mac, not online. Your keys are kept in the macOS Keychain. Don’t use confidential material for this test.',
            ],
          },
          {
            heading: 'Reporting a problem',
            blocks: [
              'Send what you found to [hello@hackedu.tech](mailto:hello@hackedu.tech). A short message with a screenshot is enough.',
              {
                kind: 'bullets',
                items: [
                  'What you were doing, and what you expected to happen.',
                  'What happened instead, with a screenshot (press ⇧⌘4 to capture part of the screen).',
                  'The version, shown in SuluhALMS under Settings, About.',
                  'Your Mac’s chip and macOS version, from Apple menu, About This Mac.',
                ],
              },
              'Never send your Claude or HeyGen key to anyone, including us.',
            ],
          },
        ],
      },
    ],
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
  {
    slug: 'siagax-bencana',
    schema: { category: 'UtilitiesApplication' },
    name: 'SiagaX Bencana',
    kind: 'app',
    audience: 'humanitarians',
    status: 'live',
    icon: { src: '/icons/siagax-bencana.png' },
    platforms: ['Web', 'Installable on phones'],
    tagline: 'Live flood alerts, river levels and relief centres across Malaysia, on one map.',
    about: [
      'SiagaX Bencana puts Malaysia’s flood and disaster warnings on one live map: rivers at alert level, heavy rain, open relief centres, and earthquake and tsunami bulletins.',
      'Its data comes from official sources. River levels and rainfall come from Public Infobanjir, relief centres (PPS) from JKM, and weather warnings and earthquake bulletins from MET Malaysia.',
      'I built it and keep it running for MAPIM Strategic Centre.',
    ],
    features: [
      {
        title: 'River alerts',
        detail: 'Stations at Alert, Warning or Danger level, with the water level, whether it is rising, and the last hour’s rainfall.',
      },
      {
        title: 'Station history',
        detail: 'Open a station to see its water level over the past 7 days and its rainfall over the past 3 days.',
      },
      {
        title: 'Relief centres',
        detail: 'Open JKM relief centres on the map, with each one’s capacity and how many families, adults, children and babies are sheltering there.',
      },
      {
        title: 'Earthquakes and tsunamis',
        detail: 'MET Malaysia earthquake bulletins from the past 7 days, with the magnitude and any tsunami watch or warning.',
      },
      {
        title: 'Weather warnings',
        detail: 'MET Malaysia warnings scroll across the top of the map.',
      },
      {
        title: 'Find a place',
        detail: 'Search for a place in Malaysia and pin it on the map in a colour you choose.',
      },
    ],
    facts: [
      { label: 'Runs in', value: 'Your web browser, and installs on phones' },
      { label: 'On phones', value: 'The map only. The alerts and details need a larger screen.' },
      { label: 'Data from', value: 'Public Infobanjir, JKM and MET Malaysia' },
      { label: 'Run by', value: 'MAPIM Strategic Centre' },
      { label: 'Price', value: 'Free' },
      { label: 'Built with', value: 'Next.js and MapLibre, with OpenFreeMap maps' },
    ],
    actions: [{ label: 'Open the live map', href: 'https://bencana.mapim.dev' }],
    screens: [
      {
        src: '/screens/siagax-bencana.jpg',
        caption: 'The live map, with river alerts on the left and relief centres and earthquake reports on the right.',
      },
    ],
  },
  {
    slug: 'sntracker',
    schema: { category: 'UtilitiesApplication' },
    name: 'Sumud Nusantara Tracker',
    kind: 'app',
    audience: 'humanitarians',
    status: 'retired',
    icon: { src: '/icons/sntracker.png', framed: true },
    platforms: ['Web', 'Phone and laptop'],
    tagline: 'A live map that followed the Sumud Nusantara boats sailing to Gaza with the Global Sumud Flotilla.',
    notice: 'The tracker is no longer online. The screenshots and photos below show it in use.',
    about: [
      'The Sumud Nusantara Tracker followed the Sumud Nusantara boats as they sailed across the Mediterranean toward Gaza with the Global Sumud Flotilla in 2026.',
      'Anyone who signed in with a Google account could follow each boat’s track, replay the voyage, and see events as they were reported, from the flotilla’s own events to attacks and interceptions.',
      'I built it for MAPIM Strategic Centre.',
    ],
    features: [
      {
        title: 'Fleet map',
        detail: 'Every boat’s position and track across the Mediterranean, with the Gaza Strip marked on the map.',
      },
      {
        title: 'Fleet status',
        detail: 'How many boats were active, attacked or intercepted, the day of the mission, and clocks for local, Europe, Gaza and Türkiye or Saudi time.',
      },
      {
        title: 'Replay',
        detail: 'Play the voyage back at a chosen speed, and record the replay as a video.',
      },
      {
        title: 'Events timeline',
        detail: 'A zoomable timeline of flotilla events, missions, attacks and surveillance. Each event has its time, place, photos and source.',
      },
      {
        title: 'Boats and their names',
        detail: 'Each boat’s details, with the Palestinian place its name commemorates.',
      },
      {
        title: 'News, SOS and live video',
        detail: 'News updates, SOS videos behind the SOS button, and YouTube channels covering the fleet, shown when they went live.',
      },
      {
        title: 'Command Center',
        detail: 'A big-screen view with a globe, the mission clock, a countdown and the fleet status.',
      },
    ],
    facts: [
      { label: 'Ran in', value: 'Your web browser, on phones and laptops' },
      { label: 'Sign-in', value: 'A Google account' },
      { label: 'Data', value: 'Forensic Architecture, as credited on the map' },
      { label: 'Made for', value: 'MAPIM Strategic Centre' },
      { label: 'Built with', value: 'Meteor, React and MapLibre' },
    ],
    actions: [],
    screens: [
      {
        src: '/screens/sntracker-1-map.jpg',
        caption: 'Day 70 of the mission: the fleet’s tracks across the Mediterranean, with world clocks, fleet counts and the replay controls.',
      },
      {
        src: '/screens/sntracker-2-command-center.jpg',
        caption: 'The Command Center on a laptop: the mission clock, a countdown and the fleet status.',
      },
      {
        src: '/screens/sntracker-3-phone.jpg',
        caption: 'The tracker on a phone: an event with its time, place and photos, above the events timeline.',
      },
      {
        src: '/screens/sntracker-4-desk.jpg',
        caption: 'The desk where I built the tracker, with the fleet map on the main screen.',
      },
    ],
  },
];
