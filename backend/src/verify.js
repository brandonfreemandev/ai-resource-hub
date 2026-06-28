/**
 * Rule-based enricher — no LLM required.
 * Derives card content from the raw GitHub/HN data and assigns a category by keyword.
 * Returns null if the candidate looks like a non-tool (article, tutorial, etc.).
 */

const CATEGORY_RULES = [
  { category: 'Local LLMs',        keywords: ['llm', 'ollama', 'llama', 'model', 'inference', 'gguf', 'quantiz', 'localai', 'gpt4all', 'mistral', 'gemma', 'qwen', 'phi'] },
  { category: 'Audio/Video Tools', keywords: ['whisper', 'audio', 'speech', 'transcri', 'tts', 'voice', 'video', 'subtitle', 'sound'] },
  { category: 'Creative Coding',   keywords: ['comfyui', 'diffusion', 'image gen', 'art', 'shader', 'generative', 'flux', 'sdxl', 'lora'] },
  { category: 'Productivity AI',   keywords: ['agent', 'assistant', 'workflow', 'automat', 'copilot', 'chat', 'open-webui', 'langchain', 'coding'] },
];

const SKIP_PATTERNS = [
  /\btutorial\b/i, /\bhow.?to\b/i, /\bblog\b/i, /\barticle\b/i,
  /\bnews\b/i, /\bpaper\b/i, /\bresearch\b/i, /\bsurvey\b/i,
];

function classifyCategory(text) {
  const lower = text.toLowerCase();
  for (const { category, keywords } of CATEGORY_RULES) {
    if (keywords.some((kw) => lower.includes(kw))) return category;
  }
  return 'Productivity AI';
}

function truncate(str, max) {
  if (!str) return '';
  const s = str.replace(/\s+/g, ' ').trim();
  return s.length <= max ? s : s.slice(0, max - 1) + '…';
}

function buildWhyItMatters(candidate) {
  const raw = candidate._raw;
  if (raw?.text) return truncate(raw.text.split('\n').find((l) => l.trim().length > 40) || raw.text, 200);
  if (raw?.body) return truncate(raw.body.split('\n').find((l) => l.trim().length > 40) || raw.body, 200);
  return `${candidate.title} — a newly released AI tool for developers.`;
}

function buildQuickStart(candidate) {
  const raw = candidate._raw;
  const body = raw?.body || raw?.text || '';
  // Look for a code block or install command
  const codeMatch = body.match(/`{1,3}([^`\n]{5,80})`{0,3}/);
  if (codeMatch) return codeMatch[1].trim();
  if (raw?.repoUrl) return `git clone ${raw.repoUrl}`;
  if (raw?.url) return `# See ${raw.url}`;
  return `# Visit the project page for install instructions`;
}

function buildBody(candidate, enriched) {
  const raw = candidate._raw || {};
  const lines = [
    `### What it is`,
    ``,
    enriched.whyItMatters,
    ``,
    `### Quick start`,
    ``,
    '```',
    enriched.quickStart,
    '```',
  ];
  if (raw.url || raw.repoUrl) {
    lines.push('', `### Links`, ``, `- [Project page](${raw.repoUrl || raw.url})`);
    if (raw.hnUrl) lines.push(`- [HN discussion](${raw.hnUrl})`);
  }
  return lines.join('\n');
}

function verifyAndEnrich(candidate) {
  const fullText = `${candidate.title} ${candidate._raw?.body || ''} ${candidate._raw?.text || ''}`;

  // Skip obvious non-tools
  if (SKIP_PATTERNS.some((p) => p.test(candidate.title))) {
    console.log(`[verify] skipped (looks like content, not a tool): ${candidate.title}`);
    return null;
  }

  const category = classifyCategory(fullText);
  const whyItMatters = buildWhyItMatters(candidate);
  const quickStart = buildQuickStart(candidate);

  const raw = candidate._raw || {};
  return {
    category,
    releaseType: candidate.releaseType,
    lowersBarrier: category === 'Local LLMs', // local tools inherently lower the barrier
    whyItMatters,
    quickStart,
    badge: candidate.releaseType === 'major' ? 'NEW RELEASE' : candidate.communityPoints >= 50 ? 'HOT' : undefined,
    links: {
      download: raw.repoUrl || raw.url || '',
      docs: raw.url || '',
      community: raw.hnUrl || '',
    },
    body: '', // filled in below
  };
}

// Exported wrapper matches the async signature the rest of the pipeline expects
async function verifyAndEnrichAsync(candidate) {
  const result = verifyAndEnrich(candidate);
  if (!result) return null;
  result.body = buildBody(candidate, result);
  return result;
}

module.exports = { verifyAndEnrich: verifyAndEnrichAsync };
