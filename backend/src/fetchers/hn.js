/**
 * Fetches Show HN posts about AI developer tools via the HN Algolia API (free, no key needed).
 */

const LOOKBACK_DAYS = 7;
const MIN_POINTS = 10;
const AI_KEYWORDS = ['ai', 'llm', 'model', 'ml', 'gpt', 'whisper', 'stable diffusion', 'local', 'open source', 'cli', 'inference'];

function isRecent(unixTs) {
  const cutoff = Date.now() - LOOKBACK_DAYS * 24 * 60 * 60 * 1000;
  return unixTs * 1000 > cutoff;
}

function isAiTool(hit) {
  const text = `${hit.title} ${hit.story_text || ''}`.toLowerCase();
  return AI_KEYWORDS.some((kw) => text.includes(kw));
}

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
}

async function fetchHNCandidates() {
  // search_by_date returns most recent first; we filter points client-side since
  // the Algolia numericFilters param causes 400s on this endpoint.
  const url = `https://hn.algolia.com/api/v1/search_by_date?tags=show_hn&hitsPerPage=100`;

  const res = await fetch(url, { headers: { 'User-Agent': 'ai-resource-hub-bot' } });
  if (!res.ok) {
    console.warn(`[hn] algolia → ${res.status}`);
    return [];
  }
  const { hits } = await res.json();

  return hits
    .filter((hit) => isRecent(hit.created_at_i) && (hit.points || 0) >= MIN_POINTS && isAiTool(hit))
    .map((hit) => ({
      title: hit.title.replace(/^Show HN:\s*/i, '').trim(),
      slug: slugify(hit.title.replace(/^Show HN:\s*/i, '')),
      source: 'Hacker News',
      date: new Date(hit.created_at).toISOString().split('T')[0],
      releaseType: 'minor',
      communityPoints: hit.points,
      _raw: {
        url: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
        hnUrl: `https://news.ycombinator.com/item?id=${hit.objectID}`,
        text: (hit.story_text || hit.title).slice(0, 2000),
        points: hit.points,
        numComments: hit.num_comments,
      },
    }));
}

module.exports = { fetchHNCandidates };
