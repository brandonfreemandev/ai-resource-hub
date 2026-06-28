import { Activity } from 'lucide-react';
import type { Heartbeat as HeartbeatData } from '@/lib/types';

/**
 * The General's mandated "Heartbeat Log" — a visible footer indicator of the last successful ingest
 * cycle, so a stale site (failed cron / rate-limited scraper) is obvious rather than silent.
 */
export function Heartbeat({ data }: { data: HeartbeatData }) {
  // Fixed locale + UTC so server and client render identically (no hydration mismatch).
  const when = data.lastRun
    ? new Date(data.lastRun).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'UTC',
      }) + ' UTC'
    : 'never';
  return (
    <footer className="mt-16 border-t border-zinc-800/80">
      <div className="mx-auto flex max-w-5xl flex-col gap-1 px-4 py-6 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
        <span className="inline-flex items-center gap-2">
          <Activity className={`h-3.5 w-3.5 ${data.ok ? 'text-[#00ffcc]' : 'text-amber-400'}`} />
          Last ingest cycle: <span className="text-zinc-300">{when}</span>
        </span>
        <span>
          {data.itemsScanned} scanned · {data.itemsPublished} published · {data.itemsFlagged} flagged for
          review
        </span>
      </div>
    </footer>
  );
}
