import { writeFileSync } from 'fs';

// Add new apps with GitHub releases here
const REPOS = [
  { owner: 'apitlekays', repo: 'Sajda' },
];

const ASSET_EXTENSIONS = ['.dmg', '.app.tar.gz', '.zip', '.exe', '.msi'];

async function fetchRelease(owner, repo) {
  const url = `https://api.github.com/repos/${owner}/${repo}/releases/latest`;
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'builtby-site',
  };
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

  const data = await res.json();
  return {
    version: data.tag_name,
    publishedAt: data.published_at,
    htmlUrl: data.html_url,
    assets: data.assets
      .filter((a) => ASSET_EXTENSIONS.some((ext) => a.name.endsWith(ext)))
      .map((a) => ({
        name: a.name,
        downloadUrl: a.browser_download_url,
        size: a.size,
      })),
  };
}

const result = {};

for (const { owner, repo } of REPOS) {
  try {
    result[`${owner}/${repo}`] = await fetchRelease(owner, repo);
    console.log(`✓ Fetched ${owner}/${repo}`);
  } catch (err) {
    console.error(`✗ Failed ${owner}/${repo}: ${err.message}`);
  }
}

writeFileSync('public/github-releases.json', JSON.stringify(result, null, 2));
console.log('Written to public/github-releases.json');
