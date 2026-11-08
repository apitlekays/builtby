import { ArrowUpRight } from 'lucide-react';
import { SectionBar } from './SectionBar';

const credentials = [
  {
    area: 'Education',
    title: 'PhD in Education',
    subtitle: 'University of Warwick, UK',
    description: 'Research in online learning communities and digital pedagogy',
  },
  {
    area: 'Teaching',
    title: 'Senior Lecturer',
    subtitle: 'Universiti Pendidikan Sultan Idris',
    description: "Malaysia's premier teacher education institution",
  },
  {
    area: 'Industry',
    title: 'Chief Technology Officer',
    subtitle: 'UmmahPrima Networks',
    description: 'Since 2025. Previously CTO at SiagaX Industries, 2021 to 2025',
  },
  {
    area: 'Supervision',
    title: '28 Graduated',
    subtitle: "6 PhD and 22 Master's students",
    description: 'International scholars from China, Oman, and Arab nations',
  },
];

const badges = ['Google Certified Trainer', 'Apple Teacher', 'Silver Medal, Seoul 2020'];

const expertise = [
  'AI in Education',
  'Educational Technology',
  'Digital Learning',
  'Learning Analytics',
  'React & TypeScript',
  'Rust & Tauri',
];

const links = [
  { label: 'Personal website', href: 'https://drhafizhanif.net' },
  { label: 'Google Scholar', href: 'https://scholar.google.com/citations?user=4fmr9rIAAAAJ' },
];

function TagList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="bg-surface px-4 py-4 min-w-0">
      <h3 className="label text-muted-foreground">{title}</h3>
      <ul className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item} className="px-2.5 py-1 rounded border border-border-bright text-sm text-body">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AboutSection() {
  return (
    <section id="about" aria-labelledby="about-title" className="wrap scroll-mt-4 mt-7 pb-12">
      <SectionBar id="about-title">About</SectionBar>
      <div className="rack rounded-t-none border-t-0 grid-cols-1">
        <p className="bg-surface px-4 sm:px-6 py-5 sm:py-6 text-lg sm:text-xl leading-snug text-body max-w-none">
          I have spent more than 15 years working on educational technology, as a researcher and as a developer.
        </p>
        <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
          {credentials.map((credential, index) => (
            <div key={credential.title} className="bg-surface px-4 py-4 min-w-0">
              <p className="label flex justify-between gap-3 text-muted-foreground">
                <span>{credential.area}</span>
                <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              </p>
              <h3 className="mt-3 text-xl font-extrabold tracking-tight">{credential.title}</h3>
              <p className="mt-0.5 font-semibold text-foreground">{credential.subtitle}</p>
              <p className="mt-2 text-[15px] leading-relaxed text-body">{credential.description}</p>
            </div>
          ))}
        </div>
        <div className="grid gap-px bg-border md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
          <TagList title="Certifications and awards" items={badges} />
          <TagList title="Expertise" items={expertise} />
          <div className="bg-surface px-4 py-4 flex flex-col gap-2 justify-center">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-between gap-3 min-h-11 px-3.5 rounded border border-border-bright bg-background font-semibold hover:bg-surface-2 transition-colors"
              >
                {link.label}
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
