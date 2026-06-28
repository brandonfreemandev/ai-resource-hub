/** The atomic unit of the Hub — the Council's "Tool Card." Parsed from a Markdown file's frontmatter. */
export interface Tool {
  slug: string;
  title: string;
  /** Human category name, e.g. "Local LLMs". */
  category: string;
  /** URL-safe category slug, derived from the name. */
  categorySlug: string;
  /** Saliency score 1–5 (the editorial filter). Only >= 4 is meant to be published. */
  saliency: number;
  /** Where the agent sourced it: GitHub / Show HN / Docs / Newsletter. */
  source: string;
  /** Triage state from the verification (triangulation) loop. */
  status: 'published' | 'review_needed';
  /** ISO date the item dropped / was published. */
  date: string;
  /** Short badge, e.g. "NEW RELEASE". */
  badge?: string;
  /** The "Why it matters" one-liner — impact for a newbie. */
  whyItMatters: string;
  /** The "Quick Start" install/usage command shown in a mono block. */
  quickStart: string;
  /** Footer links. */
  links: {
    download?: string;
    docs?: string;
    community?: string;
  };
  /** Optional long-form Markdown body (full how-to). */
  body: string;
}

/** Last-cycle status the Engine writes — the General's mandated "Heartbeat Log." */
export interface Heartbeat {
  lastRun: string | null;
  itemsScanned: number;
  itemsPublished: number;
  itemsFlagged: number;
  ok: boolean;
}
