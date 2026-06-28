import Link from 'next/link';
import type { Tool } from '@/lib/types';
import { SaliencyBadge } from './SaliencyBadge';

/** A compact row in the "What Just Dropped" momentum feed. */
export function DropRow({ tool }: { tool: Tool }) {
  return (
    <Link
      href={`/tool/${tool.slug}`}
      className="flex items-center gap-4 rounded-xl border border-zinc-800 bg-[#16161c] px-4 py-3 transition-colors hover:border-zinc-700"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate font-semibold text-white">{tool.title}</span>
          <span className="shrink-0 rounded-full border border-zinc-700 px-2 py-0.5 text-[10px] text-zinc-400">
            {tool.category}
          </span>
        </div>
        <p className="mt-0.5 truncate text-sm text-zinc-400">{tool.whyItMatters}</p>
      </div>
      <SaliencyBadge score={tool.saliency} />
    </Link>
  );
}
