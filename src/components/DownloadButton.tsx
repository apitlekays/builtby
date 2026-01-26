import { Download, ExternalLink, Loader2 } from 'lucide-react';
import { useGitHubRelease } from '../hooks/useGitHubRelease';

interface DownloadButtonProps {
  owner: string;
  repo: string;
  appId?: string;
}

function getArchFromFilename(filename: string): 'arm64' | 'x64' | 'unknown' {
  if (filename.includes('aarch64') || filename.includes('arm64')) {
    return 'arm64';
  }
  if (filename.includes('x86_64') || filename.includes('x64') || filename.includes('intel')) {
    return 'x64';
  }
  return 'unknown';
}

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export function DownloadButton({ owner, repo, appId }: DownloadButtonProps) {
  // Color scheme based on app
  const isSajda = appId === 'sajda';
  const buttonClass = isSajda
    ? 'bg-violet-500 hover:bg-violet-600'
    : 'bg-accent hover:bg-blue-600';
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

  // Get .dmg assets
  const dmgAssets = release.assets.filter((a) => a.name.endsWith('.dmg'));

  // Find Apple Silicon and Intel versions
  const armAsset = dmgAssets.find((a) => getArchFromFilename(a.name) === 'arm64');
  const intelAsset = dmgAssets.find((a) => getArchFromFilename(a.name) === 'x64');

  // Primary asset: Apple Silicon if available, otherwise first .dmg
  const primaryAsset = armAsset || dmgAssets[0];

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
      {/* Primary Download Button - Apple Silicon */}
      <a
        href={primaryAsset.downloadUrl}
        className={`flex items-center justify-center gap-2 px-4 py-3 ${buttonClass} rounded-lg text-white font-medium transition-colors`}
      >
        <Download className="w-4 h-4" />
        <span>Download for {armAsset ? 'Apple Silicon' : 'macOS'}</span>
      </a>

      {/* Version info and Intel link */}
      <div className="flex flex-col items-center gap-1 text-xs text-muted">
        <div className="flex items-center gap-2">
          <span className="font-mono">{release.version}</span>
          <span>•</span>
          <span>{formatBytes(primaryAsset.size)}</span>
        </div>

        {/* Intel download link (if both versions exist) */}
        {armAsset && intelAsset && (
          <a
            href={intelAsset.downloadUrl}
            className="hover:text-white transition-colors underline underline-offset-2"
          >
            Download for Intel Mac
          </a>
        )}
      </div>
    </div>
  );
}
