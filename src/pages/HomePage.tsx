import { apps } from '../data/apps';
import { projects } from '../data/projects';
import { AppCard } from '../components/AppCard';
import { ProjectCard } from '../components/ProjectCard';
import { HeroSection } from '../components/HeroSection';
import { AboutSection } from '../components/AboutSection';

export function HomePage() {
  return (
    <>
      <HeroSection />

      {/* Apps Grid */}
      <main id="apps" className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-muted-foreground text-sm font-medium tracking-wider uppercase mb-3">
            My Creations
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            Apps that <span className="gradient-text">solve problems</span>
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            Native desktop applications for macOS and Windows, crafted with care and attention to detail.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {apps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      </main>

      {/* Open Source Section */}
      <section id="open-source" className="border-t border-border">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <p className="text-muted-foreground text-sm font-medium tracking-wider uppercase mb-3">
              Open Source
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Projects I <span className="gradient-text">maintain</span>
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              Tools and libraries I build and share with the developer community.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <div id="about" className="border-t border-border">
        <AboutSection />
      </div>
    </>
  );
}
