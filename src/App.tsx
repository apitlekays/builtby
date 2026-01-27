import { Github, Linkedin, Mail, GraduationCap } from 'lucide-react';
import { apps } from './data/apps';
import { AppCard } from './components/AppCard';
import { LightStreaks } from './components/LightStreaks';
import { SajdaFeatures } from './components/SajdaFeatures';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';

function App() {
  return (
    <div className="min-h-screen bg-background bg-grid relative">
      {/* Animated light streaks */}
      <LightStreaks />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 group">
            <span className="font-display font-bold text-lg group-hover:text-violet-400 transition-colors">
              builtby<span className="text-violet-500">.</span>
            </span>
          </a>
          <nav className="flex items-center gap-6">
            <a
              href="#apps"
              className="text-sm text-muted-foreground hover:text-white transition-colors hidden sm:block"
            >
              Apps
            </a>
            <a
              href="#about"
              className="text-sm text-muted-foreground hover:text-white transition-colors hidden sm:block"
            >
              About
            </a>
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

      {/* Hero Section */}
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
            Native macOS applications and web tools crafted with care and attention to detail.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {apps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      </main>

      {/* Sajda Features Showcase */}
      <div className="border-t border-border bg-surface/50">
        <SajdaFeatures />
      </div>

      {/* About Section */}
      <div id="about" className="border-t border-border">
        <AboutSection />
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-surface">
        <div className="max-w-5xl mx-auto px-6 py-12">
          {/* Top section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8">
            <div>
              <p className="font-display font-bold text-xl mb-2">
                builtby<span className="text-violet-500">.</span>
              </p>
              <p className="text-muted text-sm max-w-xs">
                Crafting software that empowers educators and learners worldwide.
              </p>
            </div>

            {/* Social Links */}
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
                href="mailto:hafiz@upsi.edu.my"
                className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-white hover:border-border-bright transition-all"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Bottom section */}
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

export default App;
