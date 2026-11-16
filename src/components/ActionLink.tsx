import type { ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ProjectAction } from '../data/projects';

// A project's action: a page on this site opens in place, anywhere else opens in a new tab.
export function ActionLink({ action, className, children }: { action: ProjectAction; className: string; children?: ReactNode }) {
  const label = children ?? action.label;
  if (action.href.startsWith('/')) {
    return (
      <Link to={action.href} className={className}>
        {label}
      </Link>
    );
  }
  return (
    <a href={action.href} target="_blank" rel="noopener noreferrer" className={className}>
      {label}
      {!children && <ArrowUpRight className="w-4 h-4" aria-hidden="true" />}
    </a>
  );
}
