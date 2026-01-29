import { GraduationCap, Briefcase, Award, Users, Globe, Sparkles } from 'lucide-react';

const credentials = [
  {
    icon: GraduationCap,
    title: 'PhD in Education',
    subtitle: 'University of Warwick, UK',
    description: 'Research in online learning communities and digital pedagogy',
  },
  {
    icon: Briefcase,
    title: 'Senior Lecturer',
    subtitle: 'Universiti Pendidikan Sultan Idris',
    description: "Malaysia's premier teacher education institution",
  },
  {
    icon: Sparkles,
    title: 'Chief Technology Officer',
    subtitle: 'SiagaX Industries',
    description: 'Leading educational technology development',
  },
  {
    icon: Users,
    title: '27+ Supervised',
    subtitle: 'PhD & Masters Students',
    description: 'International scholars from China, Oman, and Arab nations',
  },
];

const badges = [
  { label: 'Google Certified Trainer', color: 'text-blue-400 border-blue-500/30 bg-blue-500/10' },
  { label: 'Apple Teacher', color: 'text-gray-300 border-gray-500/30 bg-gray-500/10' },
  { label: 'Silver Medal, Seoul 2020', color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
];

const expertise = [
  'AI in Education',
  'Educational Technology',
  'Digital Learning',
  'Learning Analytics',
  'React & TypeScript',
  'Rust & Tauri',
];

export function AboutSection() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-24">
      {/* Section Header */}
      <div className="text-center mb-16">
        <p className="text-muted-foreground text-sm font-medium tracking-wider uppercase mb-3">
          About the Developer
        </p>
        <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
          Scholar meets Developer
        </h2>
        <p className="text-muted max-w-2xl mx-auto text-lg leading-relaxed">
          Bridging academic research with real-world software development.
          15+ years crafting educational technology that makes a difference.
        </p>
      </div>

      {/* Credentials Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-16">
        {credentials.map((cred, index) => {
          const Icon = cred.icon;
          return (
            <div
              key={cred.title}
              className="group p-5 rounded-xl bg-surface border border-border hover:border-border-bright transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Icon className="w-5 h-5 text-violet-400" />
              </div>
              <h3 className="font-semibold text-white mb-1">{cred.title}</h3>
              <p className="text-violet-400 text-sm font-medium mb-2">{cred.subtitle}</p>
              <p className="text-muted text-sm leading-relaxed">{cred.description}</p>
            </div>
          );
        })}
      </div>

      {/* Badges & Expertise */}
      <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between p-6 rounded-2xl bg-surface border border-border">
        {/* Certifications */}
        <div className="flex-1">
          <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase mb-3">
            Certifications
          </p>
          <div className="flex flex-wrap gap-2">
            {badges.map((badge) => (
              <span
                key={badge.label}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border ${badge.color}`}
              >
                {badge.label}
              </span>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-px h-16 bg-border" />

        {/* Expertise */}
        <div className="flex-1">
          <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase mb-3">
            Expertise
          </p>
          <div className="flex flex-wrap gap-2">
            {expertise.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1.5 rounded-full text-xs font-medium text-muted-foreground border border-border bg-background"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="mt-8 flex flex-wrap gap-4 justify-center">
        <a
          href="https://drhafizhanif.net"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-violet-500/10 border border-violet-500/20 hover:bg-violet-500/20 transition-colors"
        >
          <Globe className="w-4 h-4" />
          Personal Website
        </a>
        <a
          href="https://scholar.google.com/citations?user=wBgWc-IAAAAJ"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground border border-border hover:border-border-bright hover:text-white transition-colors"
        >
          <Award className="w-4 h-4" />
          Google Scholar
        </a>
      </div>
    </section>
  );
}
