import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Star } from 'lucide-react';
import { CATEGORIES, categoryBySlug } from '@/lib/categories';
import { getHeartbeat, getToolsByCategory, getTopPicks } from '@/lib/content';
import { ToolCard } from '@/components/ToolCard';
import { DropRow } from '@/components/DropRow';
import { SiteHeader } from '@/components/SiteHeader';
import { Heartbeat } from '@/components/Heartbeat';

/** Pre-render a page per known category. */
export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categoryBySlug(slug);
  if (!category) notFound();

  const tools = getToolsByCategory(slug);
  const top = getTopPicks(3, tools);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 pt-10">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          All categories
        </Link>

        <div className="mt-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">{category.name}</h1>
          <p className="mt-2 max-w-2xl text-zinc-400">{category.description}</p>
        </div>

        {tools.length === 0 ? (
          <p className="mt-10 rounded-2xl border border-dashed border-zinc-700 bg-[#16161c] p-8 text-center text-zinc-400">
            No tools in this category yet — the Engine hasn&apos;t published any here.
          </p>
        ) : (
          <>
            {top.length > 0 ? (
              <section className="mt-10">
                <h2 className="flex items-center gap-2 text-lg font-bold text-white">
                  <Star className="h-5 w-5 text-[#00ffcc]" />
                  Top {top.length} in {category.name}
                </h2>
                <div className="mt-4 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {top.map((t) => (
                    <ToolCard key={t.slug} tool={t} />
                  ))}
                </div>
              </section>
            ) : null}

            <section className="mt-10">
              <h2 className="text-lg font-bold text-white">Timeline</h2>
              <p className="mt-1 text-sm text-zinc-400">Everything in {category.name}, newest first.</p>
              <div className="mt-4 flex flex-col gap-3">
                {tools.map((t) => (
                  <DropRow key={t.slug} tool={t} />
                ))}
              </div>
            </section>
          </>
        )}
      </main>
      <Heartbeat data={getHeartbeat()} />
    </>
  );
}
