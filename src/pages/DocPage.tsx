import { ArrowLeft, Download } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { ProjectIcon } from '../components/ProjectIcon';
import { SectionBar } from '../components/SectionBar';
import { secondaryButtonClass } from '../components/buttonStyles';
import { inlineSegments } from '../data/inline';
import { projects, type DocBlock, type Project, type ProjectDoc } from '../data/projects';
import { usePageMeta } from '../hooks/usePageMeta';
import { NotFoundPage } from './NotFoundPage';

const linkClass = 'text-foreground font-semibold underline underline-offset-4 decoration-border-bright hover:decoration-foreground';

// Text with its [label](href) links: site paths stay in the app, others open as ordinary links.
function RichText({ text }: { text: string }) {
  return (
    <>
      {inlineSegments(text).map((segment, index) => {
        if (!segment.href) return <span key={index}>{segment.text}</span>;
        const isPage = segment.href.startsWith('/') && !/\.[a-z0-9]+$/i.test(segment.href);
        return isPage ? (
          <Link key={index} to={segment.href} className={linkClass}>
            {segment.text}
          </Link>
        ) : (
          <a key={index} href={segment.href} className={linkClass}>
            {segment.text}
          </a>
        );
      })}
    </>
  );
}

function Block({ block }: { block: DocBlock }) {
  if (typeof block === 'string') {
    return (
      <p className="max-w-[68ch]">
        <RichText text={block} />
      </p>
    );
  }
  if (block.kind === 'downloads') {
    return (
      <ul className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
        {block.items.map((item) => {
          const [segment] = inlineSegments(item);
          return (
            <li key={item}>
              <a href={segment.href} download className={secondaryButtonClass}>
                <Download className="w-4 h-4" aria-hidden="true" />
                {segment.text}
              </a>
            </li>
          );
        })}
      </ul>
    );
  }
  return (
    <ul className="max-w-[68ch] list-disc pl-6 space-y-2 marker:text-muted-foreground">
      {block.items.map((item) => (
        <li key={item}>
          <RichText text={item} />
        </li>
      ))}
    </ul>
  );
}

export function DocPage() {
  const { slug, doc: docSlug } = useParams();
  const project = projects.find((p) => p.slug === slug);
  const doc = project?.docs?.find((d) => d.slug === docSlug);
  return project && doc ? <DocView key={`${project.slug}/${doc.slug}`} project={project} doc={doc} /> : <NotFoundPage />;
}

function DocView({ project, doc }: { project: Project; doc: ProjectDoc }) {
  usePageMeta(`${doc.title} | ${project.name}`, doc.description);
  const others = (project.docs ?? []).filter((d) => d.slug !== doc.slug);

  return (
    <main className="wrap pb-16">
      <Link
        to={`/${project.slug}`}
        className="label inline-flex items-center gap-2 min-h-11 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        {project.name}
      </Link>

      <div className="rack mt-1 grid-cols-1">
        <header className="bg-surface px-4 sm:px-8 py-6 sm:py-8 flex items-center gap-4 sm:gap-6">
          <ProjectIcon project={project} size="md" />
          <div className="min-w-0">
            <p className="label text-muted-foreground">{project.name}</p>
            <h1 className="mt-1 text-[clamp(2rem,5vw,3.5rem)] font-black leading-[0.95] tracking-[-0.03em] break-words">{doc.title}</h1>
            {doc.dated && <p className="label mt-2 text-muted-foreground">{doc.dated}</p>}
          </div>
        </header>
        {doc.intro && (
          <p className="bg-surface px-4 sm:px-8 py-5 text-body text-base sm:text-lg leading-relaxed">
            <span className="block max-w-[68ch]">
              <RichText text={doc.intro} />
            </span>
          </p>
        )}
        {doc.sections.map((section) => (
          <section key={section.heading} className="bg-surface px-4 sm:px-8 py-5" aria-label={section.heading}>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">{section.heading}</h2>
            <div className="mt-3 space-y-3 text-body leading-relaxed">
              {section.blocks.map((block, index) => (
                <Block key={index} block={block} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {others.length > 0 && (
        <nav aria-labelledby="more-docs" className="mt-7">
          <SectionBar id="more-docs">More about {project.name}</SectionBar>
          <div className="rack rounded-t-none border-t-0 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <Link to={`/${project.slug}`} className="bg-surface hover:bg-surface-2 px-4 py-4 font-bold transition-colors">
              {project.name} home
            </Link>
            {others.map((other) => (
              <Link key={other.slug} to={`/${project.slug}/${other.slug}`} className="bg-surface hover:bg-surface-2 px-4 py-4 font-bold transition-colors">
                {other.title}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </main>
  );
}
