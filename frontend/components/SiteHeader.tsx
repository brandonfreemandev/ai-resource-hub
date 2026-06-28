import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-zinc-800/80 bg-[#0b0b0f]/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold text-white">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#00ffcc]/15 text-[#00ffcc]">
            <Sparkles className="h-4 w-4" />
          </span>
          AI Resource Hub
        </Link>
        <span className="hidden text-xs text-zinc-500 sm:block">
          AI-curated · updated automatically
        </span>
      </div>
    </header>
  );
}
