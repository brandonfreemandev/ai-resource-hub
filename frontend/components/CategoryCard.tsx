import Link from 'next/link';
import { AudioLines, Cpu, Palette, Zap, type LucideIcon } from 'lucide-react';
import type { Category } from '@/lib/categories';

const ICONS: Record<Category['icon'], LucideIcon> = {
  Cpu,
  Palette,
  AudioLines,
  Zap,
};

/**
 * A category tile in the "Browse by Function" map. Shows a live "N new" badge so returning users see
 * momentum within their area of interest (Leo's blended Map + Momentum idea).
 */
export function CategoryCard({ category, count }: { category: Category; count: number }) {
  const Icon = ICONS[category.icon];
  return (
    <Link
      href={`/category/${category.slug}`}
      className="group flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-[#16161c] p-5 transition-colors hover:border-[#00ffcc]/50"
    >
      <div className="flex items-center justify-between">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#00ffcc]/10 text-[#00ffcc]">
          <Icon className="h-5 w-5" />
        </span>
        <span className="rounded-full border border-zinc-700 px-2 py-0.5 text-xs text-zinc-400">
          {count} {count === 1 ? 'tool' : 'tools'}
        </span>
      </div>
      <div>
        <h3 className="font-semibold text-white group-hover:text-[#00ffcc]">{category.name}</h3>
        <p className="mt-1 text-sm leading-relaxed text-zinc-400">{category.description}</p>
      </div>
    </Link>
  );
}
