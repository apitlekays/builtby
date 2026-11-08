import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { DownloadButton } from '../components/DownloadButton';
import { OpenSourceStats } from '../components/OpenSourceStats';
import { ProjectIcon } from '../components/ProjectIcon';
import { ProjectRack } from '../components/ProjectRack';
import { LeadScreen, MoreScreens, ScreenViewer } from '../components/ScreenGallery';
import { SectionBar } from '../components/SectionBar';
import { StatusTag } from '../components/StatusTag';
import { StickyAction } from '../components/StickyAction';
import { audiences, projects, type Project } from '../data/projects';
import { usePageMeta } from '../hooks/usePageMeta';
import { NotFoundPage } from './NotFoundPage';
import { primaryButtonClass, secondaryButtonClass } from '../components/buttonStyles';

export function ProjectPage() {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);

  // The key resets the sticky bar and viewer when a next-step link opens another project.
  return project ? <ProjectView key={project.slug} project={project} /> : <NotFoundPage />;
}

function useScrolledPast() {
  const ref = useRef<HTMLDivElement>(null);
  const [past, setPast] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      setPast(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, past };
}

function ProjectView({ project }: { project: Project }) {
  usePageMeta(`${project.name} | builtby.`, project.about[0]);

  // A download button is the main action when there is one.
  const primaryAction = project.download ? undefined : project.actions[0];
  const otherActions = project.download ? project.actions : project.actions.slice(1);
  const hasAction = Boolean(project.download) || project.actions.length > 0;

  const screens = project.screens ?? [];
  const [viewing, setViewing] = useState<number | null>(null);
  const { ref: actionsRef, past } = useScrolledPast();

  const audienceIndex = audiences.findIndex((a) => a.id === project.audience);
  const audience = audiences[audienceIndex];
  const number = String(audienceIndex + 1).padStart(2, '0');
  const related = projects.filter((p) => p.audience === project.audience && p.slug !== project.slug);

  return (
    <main className={`wrap ${hasAction ? 'pb-28 md:pb-16' : 'pb-16'}`}>
      <Link
        to={`/#${project.audience}`}
        className="label inline-flex items-center gap-2 min-h-11 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        All projects
      </Link>

      <div className="rack mt-1 grid-cols-1">
        <header className="bg-surface min-w-0">
          <div className="label flex flex-wrap items-center justify-between gap-x-3 gap-y-1 px-3.5 py-2.5 text-muted-foreground">
            <span>
              {number} &middot; {audience?.title}
            </span>
            <StatusTag status={project.status} />
          </div>
          <div className="px-4 sm:px-8 pt-6 sm:pt-10 pb-6 sm:pb-8 flex flex-col sm:flex-row sm:items-end gap-5 sm:gap-7">
            <ProjectIcon project={project} size="lg" />
            <div className="min-w-0">
              <h1 className="text-[clamp(2.75rem,7vw,5.5rem)] font-black leading-[0.9] tracking-[-0.04em] break-words">
                {project.name}
              </h1>
              <p className="mt-3 sm:mt-4 text-lg sm:text-xl leading-snug text-body max-w-2xl">{project.tagline}</p>
              <p className="label mt-3 text-muted-foreground">{project.platforms.join(', ')}</p>
            </div>
          </div>
        </header>

        {project.notice && (
          <p className="bg-surface px-4 sm:px-8 py-3.5 flex gap-3 items-start font-semibold leading-relaxed">
            <span aria-hidden="true" className="mt-1.5 w-2.5 h-2.5 flex-shrink-0 rounded-sm bg-accent-solid ring-1 ring-on-accent/40" />
            {project.notice}
          </p>
        )}

        <div ref={actionsRef} className="bg-surface px-4 sm:px-8 py-4 flex flex-col sm:flex-row sm:flex-wrap sm:items-start gap-3">
          {project.download && (
            <div className="w-full sm:w-72">
              <DownloadButton
                owner={project.download.owner}
                repo={project.download.repo}
                projectName={project.name}
                platforms={project.platforms}
              />
            </div>
          )}
          {primaryAction && (
            <a href={primaryAction.href} target="_blank" rel="noopener noreferrer" className={primaryButtonClass}>
              {primaryAction.label}
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </a>
          )}
          {otherActions.map((action) => (
            <a key={action.href} href={action.href} target="_blank" rel="noopener noreferrer" className={secondaryButtonClass}>
              {action.label}
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </a>
          ))}
        </div>

        {screens.length > 0 && (
          <div className="bg-surface p-3.5 sm:p-5">
            <LeadScreen screens={screens} onOpen={setViewing} />
          </div>
        )}
      </div>

      <div className="mt-7 grid gap-3 lg:grid-cols-[minmax(0,1fr)_18rem] items-start">
        <section aria-labelledby="about-project" className="min-w-0">
          <SectionBar id="about-project">About {project.name}</SectionBar>
          <div className="rack rounded-t-none border-t-0 grid-cols-1">
            <div className="bg-surface px-4 sm:px-6 py-5 space-y-4 text-body text-base sm:text-lg leading-relaxed">
              {project.about.map((paragraph) => (
                <p key={paragraph} className="max-w-[65ch]">
                  {paragraph}
                </p>
              ))}
            </div>
            <dl className="grid gap-px bg-border sm:grid-cols-2">
              {project.features.map((feature, index) => (
                <div key={feature.title} className="bg-surface px-4 sm:px-6 py-4">
                  <dt className="font-extrabold text-lg tracking-tight flex items-baseline gap-2.5">
                    <span aria-hidden="true" className="label text-muted-foreground">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {feature.title}
                  </dt>
                  <dd className="mt-1 text-body leading-relaxed">{feature.detail}</dd>
                </div>
              ))}
              {project.features.length % 2 === 1 && <div aria-hidden="true" className="hidden sm:block bg-surface" />}
            </dl>
          </div>
        </section>

        <aside aria-labelledby="details-title" className="min-w-0">
          <SectionBar id="details-title">Details</SectionBar>
          <div className="rack rounded-t-none border-t-0 grid-cols-1">
            <dl className="grid gap-px bg-border">
              {project.facts.map((fact) => (
                <div key={fact.label} className="bg-surface px-4 py-3">
                  <dt className="label text-muted-foreground">{fact.label}</dt>
                  <dd className="mt-1 text-foreground leading-relaxed">{fact.value}</dd>
                </div>
              ))}
              <OpenSourceStats project={project} />
            </dl>
            {project.install && (
              <div className="bg-surface px-4 py-3">
                <h3 className="label text-muted-foreground">Install</h3>
                <code
                  tabIndex={0}
                  className="mt-1.5 block overflow-x-auto whitespace-nowrap rounded border border-border-bright bg-background px-3 py-2 text-sm text-foreground font-mono"
                >
                  {project.install}
                </code>
              </div>
            )}
          </div>
        </aside>
      </div>

      <MoreScreens screens={screens} onOpen={setViewing} />

      <section aria-labelledby="related-title" className="mt-7">
        {related.length > 0 && audience && (
          <>
            <SectionBar id="related-title" number={number}>
              Also {audience.title.toLowerCase()}
            </SectionBar>
            <ProjectRack items={related} />
          </>
        )}
        <Link to="/#projects" className={`${secondaryButtonClass} mt-4`}>
          See all projects
        </Link>
      </section>

      {viewing !== null && (
        <ScreenViewer screens={screens} index={viewing} onChange={setViewing} onClose={() => setViewing(null)} />
      )}
      {past && hasAction && <StickyAction project={project} />}
    </main>
  );
}
