import { Apple, Globe, Monitor } from 'lucide-react';
import type { App } from '../data/apps';
import { DownloadButton } from './DownloadButton';

interface AppCardProps {
  app: App;
}

const platformIcons = {
  macos: Apple,
  ios: Apple,
  web: Globe,
  windows: Monitor,
  linux: Monitor,
};

const platformLabels = {
  macos: 'macOS',
  ios: 'iOS',
  web: 'Web',
  windows: 'Windows',
  linux: 'Linux',
};

export function AppCard({ app }: AppCardProps) {
  const isAvailable = app.status === 'available';
  const isCurTask = app.id === 'curtask';

  // Both Sajda (available) and CurTask (featured coming-soon) get the lit-up effect
  const isLitUp = isAvailable || isCurTask;

  return (
    <div
      className={`
        relative p-6 rounded-xl border transition-all duration-300
        ${isLitUp
          ? isCurTask
            ? 'bg-surface border-orange-500/30 hover:border-orange-500/50 glow-orange'
            : 'bg-surface border-border hover:border-accent/50 glow'
          : 'bg-surface/50 border-border/50 opacity-75'
        }
      `}
    >
      {/* Coming Soon Badge */}
      {!isAvailable && (
        <div className={`absolute top-4 right-4 px-2 py-1 rounded text-xs font-medium ${
          isCurTask
            ? 'bg-orange-500/20 border border-orange-500/30 text-orange-400'
            : 'bg-amber-500/20 border border-amber-500/30 text-amber-400'
        }`}>
          Coming Soon
        </div>
      )}

      {/* App Icon & Info */}
      <div className="flex items-start gap-4 mb-4">
        <div className={`w-16 h-16 rounded-xl bg-background overflow-hidden flex-shrink-0 border ${
          isCurTask ? 'border-orange-500/30' : 'border-border'
        }`}>
          {app.icon ? (
            <img
              src={app.icon}
              alt={`${app.name} icon`}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to placeholder on error
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted text-2xl font-bold">
              {app.name[0]}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-semibold text-white mb-1">{app.name}</h2>
          <p className="text-muted text-sm">{app.tagline}</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-400 text-sm leading-relaxed mb-4">
        {app.description}
      </p>

      {/* Platforms */}
      <div className="flex items-center gap-2 mb-5">
        {app.platforms.map((platform) => {
          const Icon = platformIcons[platform];
          return (
            <div
              key={platform}
              className={`flex items-center gap-1.5 px-2 py-1 bg-background/50 rounded text-xs ${
                isCurTask
                  ? 'border border-orange-500/20 text-orange-400/70'
                  : 'border border-border/50 text-muted'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{platformLabels[platform]}</span>
            </div>
          );
        })}
      </div>

      {/* Download / Coming Soon */}
      {isAvailable && app.github ? (
        <div className="space-y-3">
          <DownloadButton owner={app.github.owner} repo={app.github.repo} appId={app.id} />
          {/* Product Hunt badge for Sajda */}
          {app.id === 'sajda' && (
            <div className="flex justify-center pt-2">
              <a
                href="https://www.producthunt.com/products/sajda-macos?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-sajda-macos"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1068663&theme=dark&t=1769501895059"
                  alt="Sajda (macOS) - An Islamic prayer times macos menubar app for Muslims! | Product Hunt"
                  width="250"
                  height="54"
                  className="hover:opacity-80 transition-opacity"
                />
              </a>
            </div>
          )}
        </div>
      ) : (
        <a
          href={app.id === 'curtask' ? 'https://www.curtask.com/' : '#'}
          target="_blank"
          rel="noopener noreferrer"
          className={`
            w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors
            ${app.id === 'curtask'
              ? 'bg-orange-500/20 border border-orange-500/30 text-orange-400 hover:bg-orange-500/30'
              : 'bg-surface border border-border text-muted'
            }
          `}
        >
          <span>Coming soon – join waitlist</span>
        </a>
      )}
    </div>
  );
}
