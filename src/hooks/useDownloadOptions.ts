import { useGitHubRelease, type ReleaseAsset } from './useGitHubRelease';

export type VisitorDevice = 'phone' | 'mac' | 'windows' | 'other';

export interface DownloadOption {
  label: string;
  system: 'mac' | 'windows';
  asset: ReleaseAsset;
}

function detectDevice(): VisitorDevice {
  const agent = navigator.userAgent;
  // iPadOS reports itself as a Mac, so touch support tells them apart.
  const isIpad = /Macintosh/.test(agent) && navigator.maxTouchPoints > 1;
  if (isIpad || /Android|iPhone|iPad|iPod|Mobile/.test(agent)) return 'phone';
  if (/Windows/.test(agent)) return 'windows';
  if (/Macintosh/.test(agent)) return 'mac';
  return 'other';
}

function buildOptions(assets: ReleaseAsset[]): DownloadOption[] {
  const macAssets = assets.filter((a) => a.name.endsWith('.dmg'));
  const appleSilicon = macAssets.find((a) => /aarch64|arm64/.test(a.name));
  const intel = macAssets.find((a) => /x86_64|x64|intel/.test(a.name));
  const windows = assets.find((a) => a.name.endsWith('.exe') || a.name.endsWith('.msi'));

  const options: DownloadOption[] = [];
  if (appleSilicon) options.push({ label: 'Download for Apple Silicon', system: 'mac', asset: appleSilicon });
  if (intel) options.push({ label: 'Download for Intel Mac', system: 'mac', asset: intel });
  if (!appleSilicon && !intel && macAssets[0]) {
    options.push({ label: 'Download for macOS', system: 'mac', asset: macAssets[0] });
  }
  if (windows) options.push({ label: 'Download for Windows', system: 'windows', asset: windows });
  return options;
}

export function useDownloadOptions(owner: string, repo: string) {
  const { release, loading, error } = useGitHubRelease(owner, repo);
  const device = detectDevice();
  const options = release ? buildOptions(release.assets) : [];
  // Browsers cannot always tell Apple Silicon from Intel, so Macs default to Apple Silicon, which is listed first.
  const main = options.find((option) => option.system === device);
  const others = options.filter((option) => option !== main);

  return { release, loading, error, device, options, main, others };
}
