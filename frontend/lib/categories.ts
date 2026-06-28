/**
 * The four functional categories the Council settled on for the "Browse by Function" map.
 * Slugs are URL-safe and used for /category/[slug] routing.
 */
export interface Category {
  slug: string;
  name: string;
  description: string;
  /** lucide-react icon name (resolved in the UI). */
  icon: 'Cpu' | 'Palette' | 'AudioLines' | 'Zap';
}

export const CATEGORIES: Category[] = [
  {
    slug: 'local-llms',
    name: 'Local LLMs',
    description: 'Run models on your own machine — privacy, no API bills, offline-friendly.',
    icon: 'Cpu',
  },
  {
    slug: 'creative-coding',
    name: 'Creative Coding',
    description: 'Generative art, shaders, and AI-assisted tools for makers and tinkerers.',
    icon: 'Palette',
  },
  {
    slug: 'audio-video',
    name: 'Audio/Video Tools',
    description: 'Transcription, generation, and editing for sound and motion.',
    icon: 'AudioLines',
  },
  {
    slug: 'productivity-ai',
    name: 'Productivity AI',
    description: 'Assistants, agents, and workflow boosters that save you real time.',
    icon: 'Zap',
  },
];

export function categoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

/** Map a free-text category name (from Markdown frontmatter) to a known slug. */
export function slugForCategoryName(name: string): string {
  const found = CATEGORIES.find((c) => c.name.toLowerCase() === name.trim().toLowerCase());
  return found ? found.slug : name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
}
