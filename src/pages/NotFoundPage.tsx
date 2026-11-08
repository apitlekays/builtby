import { Link } from 'react-router-dom';
import { primaryButtonClass } from '../components/buttonStyles';
import { usePageMeta } from '../hooks/usePageMeta';

export function NotFoundPage() {
  usePageMeta('Page not found | builtby.', 'This page does not exist on builtby.');

  return (
    <main className="wrap pb-16">
      <div className="rack grid-cols-1">
        <div className="bg-surface">
          <p className="label px-3.5 py-2.5 text-muted-foreground">Error 404</p>
          <div className="px-4 sm:px-8 pt-8 sm:pt-12 pb-8">
            <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-black leading-[0.92] tracking-[-0.04em]">
              This page does not exist
            </h1>
            <p className="mt-4 text-lg text-body">The address may be mistyped, or the page may have moved.</p>
            <Link to="/#projects" className={`${primaryButtonClass} mt-6`}>
              See all projects
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
