/**
 * The Ingestion Engine — one cycle of the content pipeline:
 *
 *   1. FETCH     pull candidates from GitHub Releases + Show HN
 *   2. DEDUPE    skip tools that already have a card in content/tools/
 *   3. SCORE     apply the Saliency Filter; only >= 4 proceeds
 *   4. VERIFY    Claude reviews the candidate and generates card content
 *   5. WRITE     structured data becomes a Tool Card Markdown file
 *   6. HEARTBEAT record the cycle so the frontend footer shows freshness
 *
 * Run manually:  npm run ingest  (from backend/)
 * Run on a schedule via .github/workflows/ingest.yml
 */

const fs = require('node:fs');
const path = require('node:path');

const { fetchGitHubCandidates } = require('./fetchers/github');
const { fetchHNCandidates } = require('./fetchers/hn');
const { scoreSaliency } = require('./saliency');
const { verifyAndEnrich } = require('./verify');
const { writeToolCard } = require('./writeToolCard');
const { writeHeartbeat } = require('./heartbeat');

const TOOLS_DIR = path.join(__dirname, '..', '..', 'content', 'tools');

function existingSlugs() {
  try {
    return new Set(
      fs.readdirSync(TOOLS_DIR)
        .filter((f) => f.endsWith('.md'))
        .map((f) => f.replace(/\.md$/, ''))
    );
  } catch {
    return new Set();
  }
}

async function runCycle() {
  console.log('[ingest] fetching candidates...');
  const [githubItems, hnItems] = await Promise.all([fetchGitHubCandidates(), fetchHNCandidates()]);
  const candidates = [...githubItems, ...hnItems];
  console.log(`[ingest] ${candidates.length} candidates (${githubItems.length} GitHub, ${hnItems.length} HN)`);

  const known = existingSlugs();
  let published = 0;
  let flagged = 0;

  for (const item of candidates) {
    // Skip if we already have a card for this slug
    if (known.has(item.slug)) {
      console.log(`[ingest] skip (exists): ${item.title}`);
      continue;
    }

    // Saliency pre-filter (uses fields Claude will fill in, so use candidate defaults here)
    const { score, publish: passesFilter, reasons } = scoreSaliency(item);
    if (!passesFilter) {
      console.log(`[ingest] low saliency (${score}): ${item.title} — ${reasons.join('; ')}`);
      continue;
    }

    // Claude verification + content generation
    console.log(`[ingest] verifying: ${item.title}`);
    const enriched = await verifyAndEnrich(item);
    if (!enriched) {
      flagged++;
      continue;
    }

    // Re-score with Claude's enriched fields (lowersBarrier + releaseType may differ)
    const { score: finalScore } = scoreSaliency({ ...item, ...enriched });

    const file = writeToolCard({
      title: item.title,
      slug: item.slug,
      category: enriched.category,
      saliency: finalScore,
      source: item.source,
      status: 'published',
      date: item.date,
      badge: enriched.badge,
      whyItMatters: enriched.whyItMatters,
      quickStart: enriched.quickStart,
      links: enriched.links,
      body: enriched.body,
    });

    published++;
    known.add(item.slug);
    console.log(`[ingest] published (saliency ${finalScore}): ${item.title} → ${path.basename(file)}`);
  }

  const beat = writeHeartbeat({
    itemsScanned: candidates.length,
    itemsPublished: published,
    itemsFlagged: flagged,
    ok: true,
  });
  console.log(`[ingest] done @ ${beat.lastRun} — ${published} published, ${flagged} skipped by Claude.`);
}

runCycle().catch((err) => {
  console.error('[ingest] cycle failed:', err);
  writeHeartbeat({ itemsScanned: 0, itemsPublished: 0, itemsFlagged: 0, ok: false });
  process.exit(1);
});
