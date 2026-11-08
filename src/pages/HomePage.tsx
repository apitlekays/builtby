import { AboutSection } from '../components/AboutSection';
import { HeroSection } from '../components/HeroSection';
import { ProjectRack } from '../components/ProjectRack';
import { SectionBar } from '../components/SectionBar';
import { audiences, projects, type AudienceId } from '../data/projects';
import { siteDescription, siteTitle } from '../data/site';
import { usePageMeta } from '../hooks/usePageMeta';

// How wide each group sits on large screens, out of three columns. Muslims and developers share a row.
const groupWidth: Record<AudienceId, string> = {
  researchers: 'lg:col-span-3',
  teachers: 'lg:col-span-3',
  muslims: 'lg:col-span-1',
  developers: 'lg:col-span-2',
};

export function HomePage() {
  usePageMeta(siteTitle, siteDescription);

  return (
    <>
      <HeroSection />

      <main id="projects" className="wrap scroll-mt-4">
        <h2 className="sr-only">Projects</h2>
        <div className="grid gap-x-3 lg:grid-cols-3">
          {audiences.map((audience, index) => {
            const number = String(index + 1).padStart(2, '0');
            return (
              <section
                key={audience.id}
                id={audience.id}
                aria-labelledby={`${audience.id}-title`}
                className={`mt-7 min-w-0 scroll-mt-4 ${groupWidth[audience.id]}`}
              >
                <SectionBar id={`${audience.id}-title`} number={number}>
                  {audience.title}
                </SectionBar>
                <ProjectRack items={projects.filter((project) => project.audience === audience.id)} />
              </section>
            );
          })}
        </div>
      </main>

      <AboutSection />
    </>
  );
}
