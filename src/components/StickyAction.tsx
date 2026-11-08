import type { Project } from '../data/projects';
import { useDownloadOptions } from '../hooks/useDownloadOptions';
import { primaryButtonClass } from './buttonStyles';
import { CopyPageLink } from './CopyPageLink';
import { ProjectIcon } from './ProjectIcon';

const buttonClass = `${primaryButtonClass} whitespace-nowrap`;

function DownloadAction({ owner, repo }: { owner: string; repo: string }) {
  const { device, main, release } = useDownloadOptions(owner, repo);

  if (device === 'phone') return <CopyPageLink className={buttonClass} label="Copy link" />;
  if (main) {
    return (
      <a href={main.asset.downloadUrl} className={buttonClass}>
        Download
      </a>
    );
  }
  if (release) {
    return (
      <a href={release.htmlUrl} target="_blank" rel="noopener noreferrer" className={buttonClass}>
        Downloads
      </a>
    );
  }
  return null;
}

export function StickyAction({ project }: { project: Project }) {
  const action = project.actions[0];

  return (
    <div className="fixed z-40 left-0 right-0 bottom-0 md:bottom-auto md:top-0 bg-surface border-t md:border-t-0 md:border-b border-border-bright pb-[env(safe-area-inset-bottom)]">
      <div className="wrap py-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <ProjectIcon project={project} size="sm" />
          <span className="font-extrabold text-lg tracking-tight truncate">{project.name}</span>
        </div>
        {project.download ? (
          <DownloadAction owner={project.download.owner} repo={project.download.repo} />
        ) : (
          action && (
            <a href={action.href} target="_blank" rel="noopener noreferrer" className={buttonClass}>
              {action.label}
            </a>
          )
        )}
      </div>
    </div>
  );
}
