/**
 * The high-signal "Source Truth" list the Council locked in (Leo's five categories). The Ingestion
 * Agent pulls ONLY from these to avoid the "regurgitating other AI blogs" feedback loop The General
 * warned about. Each entry declares how it should be fetched so the live scrapers (TODO) stay honest.
 */

module.exports.SOURCES = [
  {
    id: 'github-releases',
    name: 'GitHub Releases',
    kind: 'github-api',
    // Non-negotiable: official release notes are structured + technically accurate.
    note: 'Pull release notes via the GitHub API for tracked AI/ML repos.',
    repos: [
      'ollama/ollama',
      'ggerganov/whisper.cpp',
      'comfyanonymous/ComfyUI',
      'open-webui/open-webui',
    ],
  },
  {
    id: 'show-hn',
    name: 'Hacker News — Show HN',
    kind: 'hn-api',
    note: 'Show HN posts with >= 10 points; parse comments for early-adopter context.',
    minPoints: 10,
  },
  {
    id: 'awesome-lists',
    name: 'Awesome Lists (GitHub)',
    kind: 'github-api',
    note: 'Curated lists for evergreen directory entries, not just what is new.',
    repos: ['e.g. awesome-ai (configure)'],
  },
  {
    id: 'changelogs',
    name: 'Major Tool Documentation Changelogs',
    kind: 'rss-or-html',
    note: 'Vendor changelogs for depth in the How-to sections.',
    feeds: [],
  },
  {
    id: 'newsletters',
    name: 'AI/ML Newsletter Aggregators',
    kind: 'rss',
    note: 'Beginner-friendly summarized context to reduce from-scratch writing.',
    feeds: [],
  },
];
