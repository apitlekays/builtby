import { Download, ExternalLink, Loader2, Monitor } from 'lucide-react';
import { useGitHubRelease } from '../hooks/useGitHubRelease';

interface DownloadButtonProps {
  owner: string;
  repo: string;
}

function detectArch(): 'arm64' | 'x64' | 'unknown' {
  // Check if running on Apple Silicon
  // navigator.userAgentData is available in modern browsers
  const ua = navigator.userAgent.toLowerCase();

  // macOS ARM64 detection
  if (ua.includes('mac')) {
    // Modern detection via userAgentData
    if ('userAgentData' in navigator) {
      const uaData = navigator.userAgentData as { platform?: string };
      if (uaData.platform === 'macOS') {
        // Check for ARM architecture indicators
        if (ua.includes('arm64') || ua.includes('aarch64')) {
          return 'arm64';
        }
      }
    }

    // Fallback: Check screen dimensions and other heuristics
    // Apple Silicon Macs typically have certain characteristics
    // But this is not reliable, so we'll show both options

    // For now, detect based on common patterns
    // Safari on Apple Silicon often has specific markers
    if (ua.includes('version/') && !ua.includes('intel')) {
      // Could be Apple Silicon, but not certain
      return 'arm64'; // Default to ARM64 for newer Macs
    }

    return 'x64'; // Default to Intel for older detection
  }

  return 'unknown';
}

function getArchLabel(filename: string): string {
  if (filename.includes('aarch64') || filename.includes('arm64')) {
    return 'Apple Silicon';
  }
  if (filename.includes('x86_64') || filename.includes('x64') || filename.includes('intel')) {
    return 'Intel';
  }
  return 'macOS';
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

export function DownloadButton({ owner, repo }: DownloadButtonProps) {
  const { release, loading, error } = useGitHubRelease(owner, repo);
  const userArch = detectArch();

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

  // Filter to only .dmg files and sort by architecture match
  const dmgAssets = release.assets
    .filter((a) => a.name.endsWith('.dmg'))
    .sort((a, b) => {
      const aArch = getArchFromFilename(a.name);
      const bArch = getArchFromFilename(b.name);
      // Put user's architecture first
      if (aArch === userArch && bArch !== userArch) return -1;
      if (bArch === userArch && aArch !== userArch) return 1;
      // Then ARM64, then x64
      if (aArch === 'arm64' && bArch !== 'arm64') return -1;
      if (bArch === 'arm64' && aArch !== 'arm64') return 1;
      return 0;
    });

  if (dmgAssets.length === 0) {
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

  // Show all available downloads
  return (
    <div className="flex flex-col gap-2">
      {dmgAssets.map((asset, index) => {
        const archLabel = getArchLabel(asset.name);
        const assetArch = getArchFromFilename(asset.name);
        const isRecommended = assetArch === userArch || (index === 0 && userArch === 'unknown');

        return (
          <a
            key={asset.name}
            href={asset.downloadUrl}
            className={`flex items-center justify-between gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors ${
              isRecommended
                ? 'bg-accent hover:bg-blue-600 text-white'
                : 'bg-surface border border-border text-white hover:border-accent'
            }`}
          >
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span>Download for {archLabel}</span>
            </div>
            {isRecommended && (
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded">
                Recommended
              </span>
            )}
          </a>
        );
      })}

      <div className="flex items-center justify-center gap-3 text-xs text-muted mt-1">
        <span className="font-mono">{release.version}</span>
        <span>•</span>
        <a
          href={release.htmlUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition-colors flex items-center gap-1"
        >
          <Monitor className="w-3 h-3" />
          All downloads
        </a>
      </div>
    </div>
  );
}
