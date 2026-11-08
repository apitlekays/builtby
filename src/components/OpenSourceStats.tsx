import { useEffect, useState } from 'react';
import type { Project } from '../data/projects';

type StatsState =
  | { state: 'loading' }
  | { state: 'failed' }
  | { state: 'ready'; stars: number; forks: number; monthlyDownloads: number | null };

function Stat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface px-4 py-3">
      <dt className="label text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-foreground leading-relaxed">{children}</dd>
    </div>
  );
}

// Renders rows for the Details list, so it must sit inside a <dl>.
export function OpenSourceStats({ project }: { project: Project }) {
  const [stats, setStats] = useState<StatsState>({ state: 'loading' });
  const { github, npmPackage } = project;

  useEffect(() => {
    if (!github) return;
    let cancelled = false;

    const load = async () => {
      try {
        const repo = await fetch(`https://api.github.com/repos/${github.owner}/${github.repo}`);
        if (!repo.ok) throw new Error(`GitHub responded with ${repo.status}`);
        const { stargazers_count: stars, forks_count: forks } = await repo.json();

        let monthlyDownloads: number | null = null;
        if (npmPackage) {
          const npm = await fetch(`https://api.npmjs.org/downloads/point/last-month/${npmPackage}`);
          if (npm.ok) monthlyDownloads = (await npm.json()).downloads ?? null;
        }

        if (!cancelled) setStats({ state: 'ready', stars, forks, monthlyDownloads });
      } catch {
        if (!cancelled) setStats({ state: 'failed' });
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [github, npmPackage]);

  if (!github) return null;

  if (stats.state === 'loading') {
    return <Stat label="GitHub">Loading stats...</Stat>;
  }

  if (stats.state === 'failed') {
    return <Stat label="GitHub">Stats are unavailable right now. The repository link above still works.</Stat>;
  }

  return (
    <>
      <Stat label="GitHub">
        {stats.stars} {stats.stars === 1 ? 'star' : 'stars'}, {stats.forks} {stats.forks === 1 ? 'fork' : 'forks'}
      </Stat>
      {stats.monthlyDownloads !== null && (
        <Stat label="npm downloads">{stats.monthlyDownloads.toLocaleString()} last month</Stat>
      )}
    </>
  );
}
