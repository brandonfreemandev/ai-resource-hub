const fs = require('node:fs');
const path = require('node:path');

const TOOLS_DIR = path.join(__dirname, '..', '..', 'content', 'tools');

function yamlEscape(value) {
  const s = String(value ?? '');
  // Quote when the value could be misread as YAML (colons, leading specials, etc.).
  return /[:#\-?{}\[\],&*!|>'"%@`]/.test(s) || s.trim() !== s ? JSON.stringify(s) : s;
}

/**
 * "Publishing == a file commit." Serialize a structured Tool into a Markdown card (frontmatter + body)
 * under /content/tools. The frontend reads these at request time — the filesystem is the database.
 *
 * @param {object} tool
 * @returns {string} the absolute path written
 */
function writeToolCard(tool) {
  const links = tool.links || {};
  const fm = [
    '---',
    `title: ${yamlEscape(tool.title)}`,
    `slug: ${yamlEscape(tool.slug)}`,
    `category: ${yamlEscape(tool.category)}`,
    `saliency: ${Number(tool.saliency).toFixed(1)}`,
    `source: ${yamlEscape(tool.source)}`,
    `status: ${tool.status || 'published'}`,
    `date: ${yamlEscape(tool.date || new Date().toISOString())}`,
    tool.badge ? `badge: ${yamlEscape(tool.badge)}` : null,
    `whyItMatters: ${yamlEscape(tool.whyItMatters)}`,
    `quickStart: ${yamlEscape(tool.quickStart)}`,
    'links:',
    `  download: ${yamlEscape(links.download || '')}`,
    `  docs: ${yamlEscape(links.docs || '')}`,
    `  community: ${yamlEscape(links.community || '')}`,
    '---',
    '',
    (tool.body || '').trim(),
    '',
  ]
    .filter((line) => line !== null)
    .join('\n');

  fs.mkdirSync(TOOLS_DIR, { recursive: true });
  const file = path.join(TOOLS_DIR, `${tool.slug}.md`);
  fs.writeFileSync(file, fm);
  return file;
}

module.exports = { writeToolCard };
