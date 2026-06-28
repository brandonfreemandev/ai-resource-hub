import { Flame } from 'lucide-react';

/**
 * The editorial signal — the Council's "Saliency Score" (1–5). Higher = more of a game-changer for a
 * newbie. Color shifts from muted → hot as the score climbs so the eye lands on what matters.
 */
export function SaliencyBadge({ score }: { score: number }) {
  const hot = score >= 4.5;
  const warm = score >= 4 && score < 4.5;
  const color = hot
    ? 'text-[#00ffcc] border-[#00ffcc]/40 bg-[#00ffcc]/10'
    : warm
      ? 'text-amber-300 border-amber-400/40 bg-amber-400/10'
      : 'text-zinc-400 border-zinc-600/50 bg-zinc-700/20';
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${color}`}
      title={`Saliency ${score.toFixed(1)} / 5 — the Engine's editorial impact score`}
    >
      <Flame className="h-3 w-3" />
      {score.toFixed(1)}
    </span>
  );
}
