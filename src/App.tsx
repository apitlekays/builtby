import { Github, Code2 } from 'lucide-react';
import { apps } from './data/apps';
import { AppCard } from './components/AppCard';

function App() {
  return (
    <div className="min-h-screen bg-background bg-grid">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Code2 className="w-6 h-6 text-accent" />
            <span className="font-semibold text-lg">builtby</span>
            <span className="text-muted text-sm font-mono">/drhafizhanif</span>
          </div>
          <a
            href="https://github.com/apitlekays"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted hover:text-white transition-colors"
          >
            <Github className="w-5 h-5" />
            <span className="hidden sm:inline text-sm">GitHub</span>
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          Apps that solve real problems
        </h1>
        <p className="text-muted text-lg max-w-2xl mx-auto">
          Software crafted with care. Open source where possible, always built with the user in mind.
        </p>
      </section>

      {/* Apps Grid */}
      <main className="max-w-4xl mx-auto px-6 pb-20">
        <div className="grid gap-6 md:grid-cols-2">
          {apps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-4xl mx-auto px-6 py-8 text-center text-muted text-sm">
          <p>
            Made by{' '}
            <a
              href="https://drhafizhanif.net"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-accent transition-colors"
            >
              Dr Hafiz Hanif
            </a>
          </p>
          <p className="mt-2 font-mono text-xs opacity-50">
            {new Date().getFullYear()} • Kuala Lumpur
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
