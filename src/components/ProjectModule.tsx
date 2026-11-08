import { Link } from 'react-router-dom';
import type { Project } from '../data/projects';
import { ProjectIcon } from './ProjectIcon';
import { StatusTag } from './StatusTag';

// One project as a module in a rack: index number and status light, its first screen, then name and tagline.
export function ProjectModule({ project, code }: { project: Project; code: string }) {
  const screen = project.screens?.[0];

  return (
    <Link to={`/${project.slug}`} className="group flex flex-col min-w-0 bg-surface hover:bg-surface-2 transition-colors">
      <div className="flex items-center justify-between gap-3 px-3.5 py-2.5 text-muted-foreground">
        <span className="label">{code}</span>
        <StatusTag status={project.status} />
      </div>
      <div className="relative mx-3.5 aspect-[16/10] overflow-hidden border border-border bg-surface-2 flex items-center justify-center">
        {screen ? (
          <img src={screen.src} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover object-top" />
        ) : project.icon.src ? (
          <img src={project.icon.src} alt="" loading="lazy" className="w-1/4 max-w-24 h-auto object-contain" />
        ) : null}
      </div>
      <div className="flex flex-col gap-1 flex-grow px-3.5 pt-3 pb-4">
        <div className="flex items-center gap-2.5">
          <ProjectIcon project={project} size="sm" />
          <span className="text-xl font-extrabold tracking-tight group-hover:underline underline-offset-4 decoration-2">
            {project.name}
          </span>
        </div>
        <p className="text-[15px] leading-relaxed text-body">{project.tagline}</p>
        {project.note && <p className="text-[15px] leading-relaxed font-semibold text-pending">{project.note}</p>}
        <p className="label mt-auto pt-2 text-muted-foreground">{project.platforms.join(', ')}</p>
      </div>
    </Link>
  );
}
