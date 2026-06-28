import { Star, Rocket, Compass } from 'lucide-react';
import { CATEGORIES } from '@/lib/categories';
import {
  getAllTools,
  getCategoryCounts,
  getHeartbeat,
  getRecent,
  getTopPicks,
} from '@/lib/content';
import { ToolCard } from '@/components/ToolCard';
import { CategoryCard } from '@/components/CategoryCard';
import { DropRow } from '@/components/DropRow';
import { SiteHeader } from '@/components/SiteHeader';
import { Heartbeat } from '@/components/Heartbeat';

export default function HomePage() {
  const all = getAllTools();
  const topPicks = getTopPicks(3, all);
  const recent = getRecent(5);
  const counts = getCategoryCounts();
  const heartbeat = getHeartbeat();

  return (
    <>
      <SiteHeader />

      {/* Hero */}
      <section className="hub-glow">
        <div className="mx-auto max-w-5xl px-4 pb-10 pt-16 text-center">
          <h1 className="text-balance text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            The latest AI tools for developers, <span className="text-[#00ffcc]">curated by AI.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-zinc-400">
            New releases, why they matter, and how to start — a living map of freely accessible AI tools
            for newcomers. Researched, scored, and published automatically.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-4">
        {all.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-700 bg-[#16161c] p-10 text-center text-zinc-400">
            <p className="text-lg font-semibold text-zinc-200">The hub is warming up.</p>
            <p className="mt-2 text-sm">
              No tool cards yet. Run the ingestion engine (<code className="text-[#00ffcc]">npm run ingest</code>{' '}
              in <code>/backend</code>) to publish the first batch into <code>/content/tools</code>.
            </p>
          </div>
        ) : (
          <>
            {/* This Week's Top 3 Picks */}
            <section className="mb-12">
              <SectionTitle icon={<Star className="h-5 w-5 text-[#00ffcc]" />} title="This Week's Top 3 Picks">
                The biggest news, regardless of category — the Engine's highest saliency scores.
              </SectionTitle>
              <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {topPicks.map((t) => (
                  <ToolCard key={t.slug} tool={t} />
                ))}
              </div>
            </section>

            {/* What Just Dropped */}
            <section className="mb-12">
              <SectionTitle icon={<Rocket className="h-5 w-5 text-[#00ffcc]" />} title="What Just Dropped">
                The latest additions, newest first.
              </SectionTitle>
              <div className="mt-5 flex flex-col gap-3">
                {recent.map((t) => (
                  <DropRow key={t.slug} tool={t} />
                ))}
              </div>
            </section>
          </>
        )}

        {/* Browse by Function */}
        <section className="mb-4">
          <SectionTitle icon={<Compass className="h-5 w-5 text-[#00ffcc]" />} title="Browse by Function">
            Find tools for what you actually do.
          </SectionTitle>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.map((c) => (
              <CategoryCard key={c.slug} category={c} count={counts[c.slug] ?? 0} />
            ))}
          </div>
        </section>
      </main>

      <Heartbeat data={heartbeat} />
    </>
  );
}

function SectionTitle({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="flex items-center gap-2 text-xl font-bold text-white">
        {icon}
        {title}
      </h2>
      {children ? <p className="mt-1 text-sm text-zinc-400">{children}</p> : null}
    </div>
  );
}
