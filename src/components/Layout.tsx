import { Github, Linkedin, Mail, GraduationCap } from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LightStreaks } from './LightStreaks';

export function Layout() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  return (
    <div className="min-h-screen bg-background bg-grid relative">
      <LightStreaks />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="font-display font-bold text-lg group-hover:text-violet-400 transition-colors">
              builtby<span className="text-violet-500">.</span>
            </span>
          </Link>
          <nav className="flex items-center gap-6">
            {isHome ? (
              <>
                <a
                  href="#apps"
                  className="text-sm text-muted-foreground hover:text-white transition-colors hidden sm:block"
                >
                  Apps
                </a>
                <a
                  href="#open-source"
                  className="text-sm text-muted-foreground hover:text-white transition-colors hidden sm:block"
                >
                  Open Source
                </a>
                <a
                  href="#about"
                  className="text-sm text-muted-foreground hover:text-white transition-colors hidden sm:block"
                >
                  About
                </a>
              </>
            ) : (
              <Link
                to="/"
                className="text-sm text-muted-foreground hover:text-white transition-colors hidden sm:block"
              >
                Home
              </Link>
            )}
            <a
              href="https://github.com/apitlekays"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
          </nav>
        </div>
      </header>

      <Outlet />

      {/* Footer */}
      <footer className="border-t border-border bg-surface">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8">
            <div>
              <p className="font-display font-bold text-xl mb-2">
                builtby<span className="text-violet-500">.</span>
              </p>
              <p className="text-muted text-sm max-w-xs">
                Crafting desktop apps for macOS and Windows that empower educators and learners worldwide.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="https://github.com/apitlekays"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-white hover:border-border-bright transition-all"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/hafizhanif"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-white hover:border-border-bright transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://scholar.google.com/citations?user=wBgWc-IAAAAJ"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-white hover:border-border-bright transition-all"
                aria-label="Google Scholar"
              >
                <GraduationCap className="w-5 h-5" />
              </a>
              <a
                href="mailto:salam@mapim.org"
                className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-white hover:border-border-bright transition-all"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-muted text-sm">
              © {new Date().getFullYear()} Hafiz Hanif, PhD. All rights reserved.
            </p>
            <p className="text-muted text-xs font-mono">
              Muallim, Perak · Malaysia
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
