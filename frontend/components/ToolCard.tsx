import Link from 'next/link';
import { ArrowUpRight, BookOpen, Download, Users } from 'lucide-react';
import type { Tool } from '@/lib/types';
import { SaliencyBadge } from './SaliencyBadge';

/**
 * The "Tool Card" — the atomic unit of the Hub, designed by The General. Prioritizes "Why it matters"
 * and a copy-pasteable "Quick Start" over a wall of text, so a beginner gets actionable value at a
 * glance. Pure presentational Server Component.
 */
export function ToolCard({ tool }: { tool: Tool }) {
  const links: { href?: string; label: string; icon: typeof Download; primary?: boolean }[] = [
    { href: tool.links.download, label: 'Download', icon: Download, primary: true },
    { href: tool.links.docs, label: 'Full Docs', icon: BookOpen },
    { href: tool.links.community, label: 'Community', icon: Users },
  ];

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-[#16161c] shadow-lg transition-colors hover:border-zinc-700">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-zinc-800/80 bg-zinc-800/20 px-5 py-4">
        <div className="min-w-0">
          <Link
            href={`/tool/${tool.slug}`}
            className="block truncate text-lg font-bold text-white hover:text-[#00ffcc]"
          >
            {tool.title}
          </Link>
          <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
            <Link href={`/category/${tool.categorySlug}`} className="hover:text-zinc-300">
              {tool.category}
            </Link>
            <span aria-hidden>·</span>
            <span>{tool.source}</span>
          </div>
        </div>
        {tool.badge ? (
          <span className="shrink-0 rounded-full bg-[#00ffcc]/15 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#00ffcc]">
            {tool.badge}
          </span>
        ) : null}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-4 px-5 py-4">
        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Why it matters</h3>
          <p className="mt-1 text-sm leading-relaxed text-zinc-200">{tool.whyItMatters}</p>
        </div>

        {tool.quickStart ? (
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Quick start</h3>
            <pre className="mt-1 overflow-x-auto rounded-lg border border-zinc-700/70 bg-[#0d0d11] px-3 py-2 font-mono text-[13px] text-zinc-300">
              <code>{tool.quickStart}</code>
            </pre>
          </div>
        ) : null}

        {/* Footer */}
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
          {links.map(({ href, label, icon: Icon, primary }) =>
            href ? (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={
                  primary
                    ? 'inline-flex items-center gap-1 rounded-full bg-[#00ffcc] px-3 py-1.5 text-xs font-bold text-black transition-opacity hover:opacity-90'
                    : 'inline-flex items-center gap-1 rounded-full border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white'
                }
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
                <ArrowUpRight className="h-3 w-3 opacity-60" />
              </a>
            ) : null,
          )}
          <span className="ml-auto">
            <SaliencyBadge score={tool.saliency} />
          </span>
        </div>
      </div>
    </article>
  );
}
