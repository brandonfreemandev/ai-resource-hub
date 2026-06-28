/**
 * Fetches recent releases from tracked GitHub repos via the public API.
 * Uses GITHUB_TOKEN if set (higher rate limits: 5000/hr vs 60/hr).
 */

const TRACKED_REPOS = [
  'ollama/ollama',
  'ggerganov/whisper.cpp',
  'comfyanonymous/ComfyUI',
  'open-webui/open-webui',
  'mudler/LocalAI',
  'langchain-ai/langchain',
  'nomic-ai/gpt4all',
  'lm-sys/FastChat',
];

const LOOKBACK_DAYS = 7;

function headers() {
  const h = { 'User-Agent': 'ai-resource-hub-bot', Accept: 'application/vnd.github+json' };
  if (process.env.GITHUB_TOKEN) h['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
}

function isRecent(dateStr) {
  const cutoff = Date.now() - LOOKBACK_DAYS * 24 * 60 * 60 * 1000;
  return new Date(dateStr).getTime() > cutoff;
}

function releaseType(tagName) {
  const parts = tagName.replace(/^v/, '').split('.');
  if (parts[0] && parseInt(parts[0]) > 0 && parts[1] === '0' && (parts[2] === '0' || !parts[2])) return 'major';
  if (parts[1] && parseInt(parts[1]) > 0) return 'minor';
  return 'patch';
}

async function fetchRepoReleases(repo) {
  const url = `https://api.github.com/repos/${repo}/releases?per_page=5`;
  const res = await fetch(url, { headers: headers() });
  if (!res.ok) {
    console.warn(`[github] ${repo} → ${res.status}`);
    return [];
  }
  const releases = await res.json();
  return releases
    .filter((r) => !r.draft && !r.prerelease && isRecent(r.published_at))
    .map((r) => ({
      title: `${repo.split('/')[1]} ${r.tag_name}`,
      slug: `${repo.split('/')[1].toLowerCase()}-${r.tag_name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`,
      source: 'GitHub',
      date: r.published_at.split('T')[0],
      releaseType: releaseType(r.tag_name),
      communityPoints: 0,
      _raw: {
        repo,
        tagName: r.tag_name,
        body: (r.body || '').slice(0, 3000),
        url: r.html_url,
        repoUrl: `https://github.com/${repo}`,
      },
    }));
}

async function fetchGitHubCandidates() {
  const results = await Promise.allSettled(TRACKED_REPOS.map(fetchRepoReleases));
  return results.flatMap((r) => (r.status === 'fulfilled' ? r.value : []));
}

module.exports = { fetchGitHubCandidates };
