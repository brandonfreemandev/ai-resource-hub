import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, BookOpen, Download, Users } from 'lucide-react';
import { getAllTools, getHeartbeat, getToolBySlug } from '@/lib/content';
import { SaliencyBadge } from '@/components/SaliencyBadge';
import { SiteHeader } from '@/components/SiteHeader';
import { Heartbeat } from '@/components/Heartbeat';

export function generateStaticParams() {
  return getAllTools().map((t) => ({ slug: t.slug }));
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const links: { href?: string; label: string; icon: typeof Download; primary?: boolean }[] = [
    { href: tool.links.download, label: 'Download', icon: Download, primary: true },
    { href: tool.links.docs, label: 'Full Docs', icon: BookOpen },
    { href: tool.links.community, label: 'Community', icon: Users },
  ];

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 pt-10">
        <Link
          href={`/category/${tool.categorySlug}`}
          className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          {tool.category}
        </Link>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">{tool.title}</h1>
          {tool.badge ? (
            <span className="rounded-full bg-[#00ffcc]/15 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#00ffcc]">
              {tool.badge}
            </span>
          ) : null}
          <SaliencyBadge score={tool.saliency} />
        </div>
        <p className="mt-1 text-sm text-zinc-500">
          {tool.source} ·{' '}
          {new Date(tool.date).toLocaleDateString('en-US', { dateStyle: 'medium', timeZone: 'UTC' })}
        </p>

        <div className="mt-6 rounded-2xl border border-zinc-800 bg-[#16161c] p-5">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Why it matters</h2>
          <p className="mt-1 text-zinc-200">{tool.whyItMatters}</p>
          {tool.quickStart ? (
            <>
              <h2 className="mt-4 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                Quick start
              </h2>
              <pre className="mt-1 overflow-x-auto rounded-lg border border-zinc-700/70 bg-[#0d0d11] px-3 py-2 font-mono text-[13px] text-zinc-300">
                <code>{tool.quickStart}</code>
              </pre>
            </>
          ) : null}
        </div>

        {tool.body ? (
          <div className="mt-6 whitespace-pre-wrap text-[15px] leading-relaxed text-zinc-300">
            {tool.body}
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-2">
          {links.map(({ href, label, icon: Icon, primary }) =>
            href ? (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={
                  primary
                    ? 'inline-flex items-center gap-1 rounded-full bg-[#00ffcc] px-4 py-2 text-sm font-bold text-black hover:opacity-90'
                    : 'inline-flex items-center gap-1 rounded-full border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 hover:border-zinc-500 hover:text-white'
                }
              >
                <Icon className="h-4 w-4" />
                {label}
                <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
              </a>
            ) : null,
          )}
        </div>
      </main>
      <Heartbeat data={getHeartbeat()} />
    </>
  );
}
