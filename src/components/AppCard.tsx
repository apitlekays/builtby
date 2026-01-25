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

  return (
    <div
      className={`
        relative p-6 rounded-xl border transition-all duration-300
        ${isAvailable
          ? 'bg-surface border-border hover:border-accent/50 glow'
          : 'bg-surface/50 border-border/50 opacity-75'
        }
      `}
    >
      {/* Coming Soon Badge */}
      {!isAvailable && (
        <div className="absolute top-4 right-4 px-2 py-1 bg-amber-500/20 border border-amber-500/30 rounded text-amber-400 text-xs font-medium">
          Coming Soon
        </div>
      )}

      {/* App Icon & Info */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 rounded-xl bg-background border border-border overflow-hidden flex-shrink-0">
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
              className="flex items-center gap-1.5 px-2 py-1 bg-background/50 border border-border/50 rounded text-xs text-muted"
            >
              <Icon className="w-3 h-3" />
              <span>{platformLabels[platform]}</span>
            </div>
          );
        })}
      </div>

      {/* Download / Coming Soon */}
      {isAvailable && app.github ? (
        <DownloadButton owner={app.github.owner} repo={app.github.repo} />
      ) : (
        <button
          disabled
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-surface border border-border rounded-lg text-muted cursor-not-allowed"
        >
          <span>Coming Soon</span>
        </button>
      )}
    </div>
  );
}
