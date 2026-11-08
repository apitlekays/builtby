import { audiences, projects } from '../data/projects';

const audienceLinkLabels: Record<string, string> = {
  researchers: 'Researchers',
  teachers: 'Teachers and students',
  muslims: 'Muslims',
  developers: 'Developers',
};

export function HeroSection() {
  return (
    <section className="wrap">
      <div className="rack md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="flex flex-col bg-surface min-w-0">
          <div className="label flex items-center justify-between gap-3 px-3.5 py-2.5 text-muted-foreground">
            <span>Educational technology</span>
            <span>UPSI, Malaysia</span>
          </div>
          <div className="mt-auto px-4 sm:px-8 lg:px-9 pt-8 sm:pt-14 pb-7 sm:pb-10">
            <h1 className="text-[clamp(3.25rem,8.4vw,7.4rem)] font-black leading-[0.88] tracking-[-0.045em]">
              Hafiz
              <br />
              Hanif, PhD
            </h1>
            <p className="mt-5 sm:mt-6 max-w-[30em] text-lg sm:text-xl leading-snug text-body">
              I teach and research educational technology at Universiti Pendidikan Sultan Idris, and I build software for
              teachers, researchers and Muslims.
            </p>
          </div>
        </div>

        <div className="grid grid-rows-[auto_1fr] gap-px bg-border min-w-0">
          <div className="relative aspect-[16/10] md:aspect-[5/4] bg-surface">
            <img
              src="/drHafiz.jpg"
              alt="Dr. Hafiz Hanif"
              className="absolute inset-0 w-full h-full object-cover object-[50%_20%]"
            />
          </div>
          <nav aria-label="Projects by audience" className="flex flex-col justify-center bg-accent-solid text-on-accent">
            {audiences.map((audience, index) => (
              <a
                key={audience.id}
                href={`#${audience.id}`}
                className="flex items-center gap-3 min-h-[52px] px-4 font-bold text-[17px] border-t border-on-accent/25 first:border-t-0 hover:bg-white/35 transition-colors"
              >
                <span className="font-mono font-semibold text-sm w-6">{String(index + 1).padStart(2, '0')}</span>
                {audienceLinkLabels[audience.id]}
                <span className="ml-auto font-mono text-sm">
                  {projects.filter((project) => project.audience === audience.id).length}
                  <span className="sr-only"> projects</span>
                </span>
              </a>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}
