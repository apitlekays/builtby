import { useEffect } from 'react';
import { Github } from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';

const navLinkClass = 'inline-flex items-center justify-center min-h-11 px-2.5 font-medium hover:underline underline-offset-4 decoration-2';

const footerLinks = [
  { label: 'GitHub', href: 'https://github.com/apitlekays' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/hafizhanif' },
  { label: 'Google Scholar', href: 'https://scholar.google.com/citations?user=4fmr9rIAAAAJ' },
  { label: 'Email', href: 'mailto:salam@mapim.org' },
];

export function Layout() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView();
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [pathname, hash]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:z-[60] focus:top-2 focus:left-2 focus:px-4 focus:py-3 focus:rounded-md focus:bg-accent-solid focus:text-on-accent focus:font-bold"
      >
        Skip to content
      </a>

      <header className="wrap w-full flex items-center justify-between gap-2 py-2">
        <Link to="/" className="inline-flex items-center min-h-11 text-lg font-black tracking-tight">
          builtby
        </Link>
        <nav className="flex items-center gap-0.5 sm:gap-1 text-[15px]">
          <Link to="/#projects" className={navLinkClass}>
            Projects
          </Link>
          <Link to="/#about" className={navLinkClass}>
            About
          </Link>
          <a
            href="https://github.com/apitlekays"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="w-11 h-11 flex items-center justify-center hover:text-muted-foreground transition-colors"
          >
            <Github className="w-5 h-5" aria-hidden="true" />
          </a>
          <ThemeToggle />
        </nav>
      </header>

      <div id="content" className="flex-grow">
        <Outlet />
      </div>

      <footer className="wrap w-full pb-6">
        <div className="rack grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto]">
          <div className="bg-surface px-4 py-4">
            <p className="text-lg font-black tracking-tight">builtby</p>
            <p className="mt-1 text-sm text-body max-w-xs">Apps, sites and libraries for teachers, researchers and Muslims.</p>
          </div>
          <ul className="bg-surface px-4 py-4 flex flex-wrap items-center gap-2">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  {...(link.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="label inline-flex items-center min-h-11 px-3 rounded border border-border-bright hover:bg-surface-2 transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="label md:col-span-2 bg-surface px-4 py-3 flex flex-col sm:flex-row sm:justify-between gap-1 text-muted-foreground">
            <span>© {new Date().getFullYear()} Hafiz Hanif, PhD</span>
            <span>Muallim, Perak, Malaysia</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
