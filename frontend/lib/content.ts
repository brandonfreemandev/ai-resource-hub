import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import type { Heartbeat, Tool } from './types';
import { slugForCategoryName } from './categories';

/**
 * The filesystem IS the database (the Council's decision): the Node.js Engine writes Markdown files into
 * /content, and the Next.js Hub reads them here at request time. These helpers run only on the server
 * (they touch `fs`), which is fine inside App Router Server Components.
 *
 * Layout (repo root, one level up from /frontend):
 *   content/tools/*.md      — one Tool Card per file (frontmatter + optional body)
 *   content/heartbeat.json  — last ingestion-cycle status
 */

const CONTENT_DIR = path.join(process.cwd(), '..', 'content');
const TOOLS_DIR = path.join(CONTENT_DIR, 'tools');

function safeNumber(v: unknown, fallback = 0): number {
  const n = typeof v === 'string' ? parseFloat(v) : (v as number);
  return Number.isFinite(n) ? (n as number) : fallback;
}

function parseTool(fileName: string, raw: string): Tool {
  const { data, content } = matter(raw);
  const category = (data.category ?? 'Uncategorized').toString();
  const links = (data.links ?? {}) as Tool['links'];
  return {
    slug: (data.slug ?? fileName.replace(/\.md$/, '')).toString(),
    title: (data.title ?? 'Untitled').toString(),
    category,
    categorySlug: slugForCategoryName(category),
    saliency: safeNumber(data.saliency, 0),
    source: (data.source ?? 'Unknown').toString(),
    status: data.status === 'review_needed' ? 'review_needed' : 'published',
    date: (data.date ? new Date(data.date).toISOString() : new Date(0).toISOString()),
    badge: data.badge ? data.badge.toString() : undefined,
    whyItMatters: (data.whyItMatters ?? '').toString(),
    quickStart: (data.quickStart ?? '').toString(),
    links: {
      download: links.download,
      docs: links.docs,
      community: links.community,
    },
    body: content.trim(),
  };
}

/** All published tools, newest first. Returns [] gracefully if the Engine hasn't written anything yet. */
export function getAllTools(): Tool[] {
  let files: string[] = [];
  try {
    files = fs.readdirSync(TOOLS_DIR).filter((f) => f.endsWith('.md'));
  } catch {
    return []; // /content/tools doesn't exist yet — empty hub, not an error
  }
  const tools = files
    .map((f) => parseTool(f, fs.readFileSync(path.join(TOOLS_DIR, f), 'utf8')))
    .filter((t) => t.status === 'published');
  return tools.sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export function getToolBySlug(slug: string): Tool | undefined {
  return getAllTools().find((t) => t.slug === slug);
}

export function getToolsByCategory(categorySlug: string): Tool[] {
  return getAllTools().filter((t) => t.categorySlug === categorySlug);
}

/** "This Week's Top 3 Picks" — the highest-saliency winners, regardless of category. */
export function getTopPicks(limit = 3, pool?: Tool[]): Tool[] {
  return [...(pool ?? getAllTools())]
    .sort((a, b) => b.saliency - a.saliency || +new Date(b.date) - +new Date(a.date))
    .slice(0, limit);
}

/** "What Just Dropped" — the most recent additions. */
export function getRecent(limit = 5): Tool[] {
  return getAllTools().slice(0, limit);
}

/** Per-category counts for the Browse-by-Function map. */
export function getCategoryCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const t of getAllTools()) counts[t.categorySlug] = (counts[t.categorySlug] ?? 0) + 1;
  return counts;
}

export function getHeartbeat(): Heartbeat {
  try {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, 'heartbeat.json'), 'utf8');
    return JSON.parse(raw) as Heartbeat;
  } catch {
    return { lastRun: null, itemsScanned: 0, itemsPublished: 0, itemsFlagged: 0, ok: false };
  }
}
