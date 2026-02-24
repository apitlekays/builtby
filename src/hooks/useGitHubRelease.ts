import { useState, useEffect } from 'react';

export interface ReleaseAsset {
  name: string;
  downloadUrl: string;
  size: number;
}

export interface Release {
  version: string;
  publishedAt: string;
  htmlUrl: string;
  assets: ReleaseAsset[];
}

interface UseGitHubReleaseResult {
  release: Release | null;
  loading: boolean;
  error: string | null;
}

const CACHE_KEY_PREFIX = 'gh_release_';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CachedData {
  release: Release;
  timestamp: number;
}

const ASSET_EXTENSIONS = ['.dmg', '.app.tar.gz', '.zip', '.exe', '.msi'];

function parseReleaseAssets(assets: { name: string; browser_download_url: string; size: number }[]): ReleaseAsset[] {
  return assets
    .filter((a) => ASSET_EXTENSIONS.some((ext) => a.name.endsWith(ext)))
    .map((a) => ({
      name: a.name,
      downloadUrl: a.browser_download_url,
      size: a.size,
    }));
}

export function useGitHubRelease(owner: string, repo: string): UseGitHubReleaseResult {
  const [release, setRelease] = useState<Release | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cacheKey = `${CACHE_KEY_PREFIX}${owner}_${repo}`;

    // Check localStorage cache first
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const data: CachedData = JSON.parse(cached);
        if (Date.now() - data.timestamp < CACHE_DURATION) {
          setRelease(data.release);
          setLoading(false);
          return;
        }
      } catch {
        localStorage.removeItem(cacheKey);
      }
    }

    const fetchRelease = async () => {
      // Try build-time static JSON first (avoids API rate limits)
      try {
        const staticRes = await fetch(`${import.meta.env.BASE_URL}github-releases.json`);
        if (staticRes.ok) {
          const staticData = await staticRes.json();
          const key = `${owner}/${repo}`;
          if (staticData[key]) {
            const releaseData: Release = staticData[key];
            localStorage.setItem(cacheKey, JSON.stringify({ release: releaseData, timestamp: Date.now() }));
            setRelease(releaseData);
            setLoading(false);
            return;
          }
        }
      } catch {
        // Static JSON unavailable, fall through to live API
      }

      // Fall back to live GitHub API
      try {
        const response = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/releases/latest`
        );

        if (!response.ok) {
          setError(response.status === 404 ? 'No releases found' : 'Failed to fetch release');
          setLoading(false);
          return;
        }

        const data = await response.json();
        const releaseData: Release = {
          version: data.tag_name,
          publishedAt: data.published_at,
          htmlUrl: data.html_url,
          assets: parseReleaseAssets(data.assets),
        };

        localStorage.setItem(cacheKey, JSON.stringify({ release: releaseData, timestamp: Date.now() }));
        setRelease(releaseData);
        setError(null);
      } catch {
        setError('Failed to fetch release');
      } finally {
        setLoading(false);
      }
    };

    fetchRelease();
  }, [owner, repo]);

  return { release, loading, error };
}
