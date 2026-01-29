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

export function useGitHubRelease(owner: string, repo: string): UseGitHubReleaseResult {
  const [release, setRelease] = useState<Release | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cacheKey = `${CACHE_KEY_PREFIX}${owner}_${repo}`;

    // Check cache first
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

    // Fetch from GitHub API
    const fetchRelease = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/releases/latest`
        );

        if (!response.ok) {
          if (response.status === 404) {
            setError('No releases found');
          } else {
            setError('Failed to fetch release');
          }
          setLoading(false);
          return;
        }

        const data = await response.json();

        const releaseData: Release = {
          version: data.tag_name,
          publishedAt: data.published_at,
          htmlUrl: data.html_url,
          assets: data.assets
            .filter((asset: { name: string }) =>
              asset.name.endsWith('.dmg') ||
              asset.name.endsWith('.app.tar.gz') ||
              asset.name.endsWith('.zip') ||
              asset.name.endsWith('.exe') ||
              asset.name.endsWith('.msi')
            )
            .map((asset: { name: string; browser_download_url: string; size: number }) => ({
              name: asset.name,
              downloadUrl: asset.browser_download_url,
              size: asset.size,
            })),
        };

        // Cache the result
        localStorage.setItem(cacheKey, JSON.stringify({
          release: releaseData,
          timestamp: Date.now(),
        }));

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
