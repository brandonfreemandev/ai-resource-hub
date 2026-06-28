/**
 * The Ingestion Engine — one cycle of the Council's content pipeline:
 *
 *   1. INGEST    pull candidates from the high-signal sources (sources.js)
 *   2. SCORE     apply the Saliency Filter (saliency.js); only >= 4 proceeds
 *   3. VERIFY    triangulate GitHub release notes vs. Show HN vs. docs via a LOCAL LLM (Ollama);
 *                conflicting install steps -> status: review_needed instead of published
 *   4. WRITE     the AI Writer turns structured data into a Tool Card Markdown file (writeToolCard.js)
 *   5. HEARTBEAT record the cycle so the frontend footer shows freshness (heartbeat.js)
 *
 * The orchestration + scoring + publishing (steps 2, 4, 5) are REAL. The live network fetch (step 1)
 * and the local-LLM triangulation (step 3) are stubbed with clear TODOs — wiring those to real feeds is
 * the next slice. Run a demo cycle with `npm run ingest` (writes seed-quality cards + heartbeat).
 */

const { SOURCES } = require('./sources');
const { scoreSaliency } = require('./saliency');
const { writeToolCard } = require('./writeToolCard');
const { writeHeartbeat } = require('./heartbeat');

// TODO(slice): replace with live fetchers per source.kind (GitHub API, HN API, RSS).
async function ingestCandidates() {
  // Shape mirrors what the real scrapers should normalize each item into.
  return [
    {
      title: 'Hermes Desktop v2.1',
      slug: 'hermes-desktop-v2-1',
      category: 'Local LLMs',
      source: 'GitHub',
      badge: 'NEW RELEASE',
      date: '2026-06-27',
      lowersBarrier: true,
      releaseType: 'minor',
      communityPoints: 87,
      whyItMatters:
        'Enables local LLM execution with 40% less RAM. Perfect for laptop users who want private, offline AI without a beefy GPU.',
      quickStart: 'brew install hermes-desktop --stable',
      links: { download: 'https://github.com/', docs: 'https://github.com/', community: 'https://github.com/' },
      // For the verification step (stubbed): the sources we'd triangulate.
      _triangulate: { github: true, showHN: true, docs: true },
    },
  ];
}

// TODO(slice): real triangulation via Ollama — compare release notes vs. HN vs. docs; on conflict in a
// key install/how-to step, return false so the card is flagged `review_needed`.
async function verify(item) {
  const sources = item._triangulate || {};
  const agree = [sources.github, sources.showHN, sources.docs].filter(Boolean).length;
  return agree >= 2; // placeholder: needs >= 2 corroborating sources
}

async function runCycle() {
  console.log(`[ingest] sources configured: ${SOURCES.map((s) => s.id).join(', ')}`);
  const candidates = await ingestCandidates();

  let published = 0;
  let flagged = 0;

  for (const item of candidates) {
    const { score, publish, reasons } = scoreSaliency(item);
    if (!publish) {
      console.log(`[ingest] archived (saliency ${score}): ${item.title} — ${reasons.join('; ')}`);
      continue;
    }

    const verified = await verify(item);
    const status = verified ? 'published' : 'review_needed';
    if (!verified) flagged += 1;

    const file = writeToolCard({
      ...item,
      saliency: score,
      status,
      body: buildBody(item),
    });
    if (verified) published += 1;
    console.log(`[ingest] ${status} (saliency ${score}): ${item.title} -> ${file}`);
  }

  const beat = writeHeartbeat({
    itemsScanned: candidates.length,
    itemsPublished: published,
    itemsFlagged: flagged,
    ok: true,
  });
  console.log(`[ingest] cycle complete @ ${beat.lastRun} — ${published} published, ${flagged} flagged.`);
}

function buildBody(item) {
  return [
    `### What's new`,
    ``,
    item.whyItMatters,
    ``,
    `### Quick start`,
    ``,
    '```',
    item.quickStart,
    '```',
  ].join('\n');
}

runCycle().catch((err) => {
  console.error('[ingest] cycle failed:', err);
  writeHeartbeat({ itemsScanned: 0, itemsPublished: 0, itemsFlagged: 0, ok: false });
  process.exit(1);
});
