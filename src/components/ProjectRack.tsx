import { audiences, projects, type Project } from '../data/projects';
import { ProjectModule } from './ProjectModule';

// Columns grow with the number of projects, up to four on wide screens.
const columns = (count: number) => {
  if (count >= 4) return 'sm:grid-cols-2 lg:grid-cols-4';
  if (count === 3) return 'sm:grid-cols-2 lg:grid-cols-3';
  if (count === 2) return 'sm:grid-cols-2';
  return '';
};

// A project keeps the same index everywhere: its group's number, then its place in that group.
function codeFor(project: Project) {
  const group = audiences.findIndex((audience) => audience.id === project.audience) + 1;
  const place = projects.filter((p) => p.audience === project.audience).indexOf(project) + 1;
  return `${String(group).padStart(2, '0')}.${place}`;
}

export function ProjectRack({ items }: { items: Project[] }) {
  return (
    <div className={`rack rounded-t-none border-t-0 grid-cols-1 ${columns(items.length)}`}>
      {items.map((project) => (
        <ProjectModule key={project.slug} project={project} code={codeFor(project)} />
      ))}
    </div>
  );
}
