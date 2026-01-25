import { Download, ExternalLink, Loader2 } from 'lucide-react';
import { useGitHubRelease } from '../hooks/useGitHubRelease';

interface DownloadButtonProps {
  owner: string;
  repo: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export function DownloadButton({ owner, repo }: DownloadButtonProps) {
  const { release, loading, error } = useGitHubRelease(owner, repo);

  if (loading) {
    return (
      <button
        disabled
        className="flex items-center gap-2 px-4 py-2.5 bg-surface border border-border rounded-lg text-muted cursor-wait"
      >
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Loading...</span>
      </button>
    );
  }

  if (error || !release) {
    return (
      <a
        href={`https://github.com/${owner}/${repo}/releases`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2.5 bg-surface border border-border rounded-lg text-white hover:border-accent transition-colors"
      >
        <ExternalLink className="w-4 h-4" />
        <span>View Releases</span>
      </a>
    );
  }

  // Find the best asset (prefer .dmg for macOS)
  const dmgAsset = release.assets.find((a) => a.name.endsWith('.dmg'));
  const primaryAsset = dmgAsset || release.assets[0];

  if (!primaryAsset) {
    return (
      <a
        href={release.htmlUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2.5 bg-surface border border-border rounded-lg text-white hover:border-accent transition-colors"
      >
        <ExternalLink className="w-4 h-4" />
        <span>View Release {release.version}</span>
      </a>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <a
        href={primaryAsset.downloadUrl}
        className="flex items-center gap-2 px-4 py-2.5 bg-accent hover:bg-blue-600 rounded-lg text-white font-medium transition-colors"
      >
        <Download className="w-4 h-4" />
        <span>Download for macOS</span>
      </a>
      <div className="flex items-center justify-center gap-2 text-xs text-muted">
        <span className="font-mono">{release.version}</span>
        <span>•</span>
        <span>{formatBytes(primaryAsset.size)}</span>
      </div>
    </div>
  );
}
