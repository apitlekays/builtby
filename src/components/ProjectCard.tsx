import { Github, GitFork, Star, Download } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Project } from '../data/projects';

interface ProjectCardProps {
  project: Project;
}

interface RepoStats {
  stars: number;
  forks: number;
}

const languageColors: Record<string, string> = {
  TypeScript: '#3178c6',
  Python: '#3572A5',
  JavaScript: '#f1e05a',
  Rust: '#dea584',
  Go: '#00ADD8',
};

export function ProjectCard({ project }: ProjectCardProps) {
  const [stats, setStats] = useState<RepoStats | null>(null);
  const [dockerPulls, setDockerPulls] = useState<number | null>(null);
  const repoUrl = `https://github.com/${project.github.owner}/${project.github.repo}`;

  useEffect(() => {
    const cacheKey = `gh-stats-${project.github.owner}-${project.github.repo}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < 5 * 60 * 1000) {
        setStats(data);
        return;
      }
    }

    fetch(`https://api.github.com/repos/${project.github.owner}/${project.github.repo}`)
      .then((res) => res.json())
      .then((data) => {
        const repoStats = { stars: data.stargazers_count, forks: data.forks_count };
        setStats(repoStats);
        sessionStorage.setItem(cacheKey, JSON.stringify({ data: repoStats, timestamp: Date.now() }));
      })
      .catch(() => {});
  }, [project.github.owner, project.github.repo]);

  useEffect(() => {
    if (!project.docker) return;

    const cacheKey = `docker-pulls-${project.docker.namespace}-${project.docker.repo}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < 5 * 60 * 1000) {
        setDockerPulls(data);
        return;
      }
    }

    fetch(`https://hub.docker.com/v2/repositories/${project.docker.namespace}/${project.docker.repo}/`)
      .then((res) => res.json())
      .then((data) => {
        setDockerPulls(data.pull_count);
        sessionStorage.setItem(cacheKey, JSON.stringify({ data: data.pull_count, timestamp: Date.now() }));
      })
      .catch(() => {});
  }, [project.docker]);

  const langColor = languageColors[project.language] ?? '#6b6b6b';

  return (
    <a
      href={repoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative p-6 rounded-xl border bg-surface border-border hover:border-accent/50 transition-all duration-300 glow-subtle"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-white group-hover:text-violet-400 transition-colors">
          {project.name}
        </h3>
        <Github className="w-5 h-5 text-muted-foreground group-hover:text-white transition-colors flex-shrink-0 mt-0.5" />
      </div>

      {/* Description */}
      <p className="text-gray-300 text-sm leading-relaxed mb-5">
        {project.description}
      </p>

      {/* Footer: Language, Stars, Forks, Docker Pulls, License */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: langColor }} />
          {project.language}
        </span>
        {stats && (
          <>
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5" />
              {stats.stars}
            </span>
            <span className="flex items-center gap-1">
              <GitFork className="w-3.5 h-3.5" />
              {stats.forks}
            </span>
          </>
        )}
        {dockerPulls != null && (
          <span className="flex items-center gap-1" title="Docker Hub pulls">
            <Download className="w-3.5 h-3.5" />
            {dockerPulls}
          </span>
        )}
        {project.license && (
          <span className="ml-auto text-muted">{project.license}</span>
        )}
      </div>
    </a>
  );
}
