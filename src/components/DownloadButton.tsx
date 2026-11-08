import { Apple, ExternalLink, Loader2, Monitor } from 'lucide-react';
import { useDownloadOptions, type DownloadOption } from '../hooks/useDownloadOptions';
import { primaryButtonClass, secondaryButtonClass } from './buttonStyles';
import { CopyPageLink } from './CopyPageLink';

interface DownloadButtonProps {
  owner: string;
  repo: string;
  projectName: string;
  platforms: string[];
}

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

const mainClass = `${primaryButtonClass} w-full`;
const secondaryClass = `${secondaryButtonClass} w-full`;

function SystemIcon({ option }: { option: DownloadOption }) {
  const Icon = option.system === 'mac' ? Apple : Monitor;
  return <Icon className="w-4 h-4" aria-hidden="true" />;
}

function ReleaseLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={secondaryClass}>
      <ExternalLink className="w-4 h-4" aria-hidden="true" />
      {label}
    </a>
  );
}

export function DownloadButton({ owner, repo, projectName, platforms }: DownloadButtonProps) {
  const { release, loading, error, device, options, main, others } = useDownloadOptions(owner, repo);

  if (loading) {
    return (
      <p className="flex items-center justify-center gap-2 min-h-11 px-4 py-2.5 rounded-md border border-border-bright text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
        Checking the latest version...
      </p>
    );
  }

  if (error || !release) {
    return <ReleaseLink href={`https://github.com/${owner}/${repo}/releases`} label="View Releases" />;
  }

  if (options.length === 0) {
    return <ReleaseLink href={release.htmlUrl} label={`View Release ${release.version}`} />;
  }

  if (device === 'phone') {
    return (
      <div className="grid gap-3 p-4 rounded-md bg-surface-2 border border-border-bright">
        <p className="text-foreground leading-relaxed">
          <span className="font-semibold">{projectName} runs on {platforms.join(' and ')}.</span> Open this page on your
          computer to download it.
        </p>
        <CopyPageLink className={mainClass} />
      </div>
    );
  }

  if (!main) {
    return (
      <div className="grid gap-3">
        <p className="text-sm text-body leading-relaxed">
          {device === 'other'
            ? 'Choose the download for your computer.'
            : `${projectName} has no download for your computer yet. It runs on ${platforms.join(' and ')}.`}
        </p>
        {options.map((option) => (
          <a key={option.asset.name} href={option.asset.downloadUrl} className={secondaryClass}>
            <SystemIcon option={option} />
            {option.label}
          </a>
        ))}
        <p className="label text-muted-foreground text-center">{release.version}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-2">
      <a href={main.asset.downloadUrl} className={mainClass}>
        <SystemIcon option={main} />
        {main.label}
      </a>
      <p className="label text-muted-foreground text-center">
        {release.version}, {formatBytes(main.asset.size)}
      </p>
      {others.length > 0 && (
        <details className="text-sm">
          <summary className="flex items-center justify-center min-h-11 cursor-pointer text-body hover:text-foreground">
            Other downloads
          </summary>
          <div className="grid gap-2 pt-1">
            {others.map((option) => (
              <a key={option.asset.name} href={option.asset.downloadUrl} className={secondaryClass}>
                <SystemIcon option={option} />
                {option.label}
              </a>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
