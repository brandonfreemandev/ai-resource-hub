/**
 * The "Saliency Filter" — Gemini's mathematical scoring rubric that turns the AI from a summarizer into
 * an editor. Each candidate is scored 1–5; only >= 4 gets passed to the writer and published. Everything
 * else is silently archived. This is the guardrail against The General's "Content Bloat → noisy landfill"
 * failure mode.
 *
 * Criteria (each contributes to the 1–5 score):
 *  - Accessibility: does it lower the barrier to entry for a newbie?
 *  - Impact:        major version bump (game-changer) vs. niche bug fix?
 *  - Community:     did it cross the Show HN >= 10 upvote threshold / strong signal?
 */

const PUBLISH_THRESHOLD = 4;

/**
 * @param {object} item
 * @param {boolean} item.lowersBarrier   - clear accessibility win (e.g. "40% less RAM")
 * @param {('major'|'minor'|'patch')} item.releaseType
 * @param {number} item.communityPoints  - upvotes / stars delta / signal count
 * @returns {{ score: number, publish: boolean, reasons: string[] }}
 */
function scoreSaliency(item) {
  let score = 1;
  const reasons = [];

  if (item.lowersBarrier) {
    score += 1.5;
    reasons.push('lowers the barrier to entry (accessibility)');
  }

  if (item.releaseType === 'major') {
    score += 1.5;
    reasons.push('major version / game-changer (impact)');
  } else if (item.releaseType === 'minor') {
    score += 0.75;
    reasons.push('meaningful feature release (impact)');
  } else {
    reasons.push('patch / niche fix (low impact)');
  }

  if ((item.communityPoints || 0) >= 10) {
    score += 1;
    reasons.push('strong community signal');
  }

  score = Math.max(1, Math.min(5, Math.round(score * 10) / 10));
  return { score, publish: score >= PUBLISH_THRESHOLD, reasons };
}

module.exports = { scoreSaliency, PUBLISH_THRESHOLD };
