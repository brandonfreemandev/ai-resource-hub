# AI Resource Hub — Project Notes

## Live URLs

| What | URL |
|---|---|
| Live site | https://airesourcehub.vercel.app |
| GitHub repo | https://github.com/brandonfreemandev/ai-resource-hub |
| Vercel dashboard | https://vercel.com/dashboard |
| GitHub Actions | https://github.com/brandonfreemandev/ai-resource-hub/actions |
| Daily Ingest workflow | https://github.com/brandonfreemandev/ai-resource-hub/actions/workflows/ingest.yml |

---

## Git Cheatsheet

These are the only commands you'll normally need for this project.

### Check what's changed
```bash
git status
```

### See recent commits
```bash
git log --oneline -10
```

### Add a new tool card manually
Drop a `.md` file into `content/tools/`, then:
```bash
git add content/tools/your-tool.md
git commit -m "add: Your Tool Name"
git push origin main
```
Vercel picks up the push and redeploys in ~60 seconds.

### Push any code change to GitHub (triggers Vercel redeploy)
```bash
git add .
git commit -m "your message here"
git push origin main
```

### Pull the latest changes (e.g. after the bot commits new tools)
```bash
git pull origin main
```

### See what the ingest bot committed
```bash
git log --oneline --author="AI Resource Hub Bot"
```

---

## Daily Ingest — How It Works

**File:** `.github/workflows/ingest.yml`
**Runs:** Every day at 8am UTC automatically. You can also trigger it manually.

### To trigger manually
1. Go to the [Daily Ingest action](https://github.com/brandonfreemandev/ai-resource-hub/actions/workflows/ingest.yml)
2. Click **Run workflow** → **Run workflow**

### What happens each run
1. Fetches recent releases from tracked GitHub repos
2. Fetches recent Show HN posts about AI tools
3. Scores each candidate through the Saliency Filter (must score ≥ 4 out of 5)
4. Skips anything that already has a card in `content/tools/`
5. Writes new Tool Card `.md` files to `content/tools/`
6. Commits the new files to GitHub
7. Vercel detects the commit → site redeploys automatically

---

## Customising the Ingest Pipeline

### Change the schedule
Edit `.github/workflows/ingest.yml`, line:
```yaml
- cron: '0 8 * * *'
```
Format is `minute hour day month weekday` (UTC).
Examples:
- `0 8 * * *` — every day at 8am UTC
- `0 6 * * 1` — every Monday at 6am UTC
- `0 */12 * * *` — twice a day (midnight and noon UTC)

Use [crontab.guru](https://crontab.guru) to build a schedule visually.

### Change which GitHub repos are tracked
Edit `backend/src/fetchers/github.js`, top of file:
```js
const TRACKED_REPOS = [
  'ollama/ollama',
  'ggerganov/whisper.cpp',
  'comfyanonymous/ComfyUI',
  'open-webui/open-webui',
  'mudler/LocalAI',
  'langchain-ai/langchain',
  'nomic-ai/gpt4all',
  'lm-sys/FastChat',
];
```
Add or remove any public GitHub repo in `owner/repo` format.

### Change how far back the fetchers look
Both fetcher files have this at the top:
```js
const LOOKBACK_DAYS = 7;
```
Change `7` to however many days back you want to search.

### Change the minimum HN upvotes required
Edit `backend/src/fetchers/hn.js`:
```js
const MIN_POINTS = 10;
```
Raise this number to only pick up more popular posts.

### Change which HN posts are considered AI-related
Edit `backend/src/fetchers/hn.js`:
```js
const AI_KEYWORDS = ['ai', 'llm', 'model', 'ml', 'gpt', 'whisper', 'stable diffusion', 'local', 'open source', 'cli', 'inference'];
```
Add any keyword (lowercase) and the fetcher will include posts containing it.

### Change the saliency threshold
Edit `backend/src/saliency.js`:
```js
const PUBLISH_THRESHOLD = 4;
```
Lower it (e.g. `3`) to publish more tools. Raise it (e.g. `4.5`) to be more selective.

---

## Adding a Tool Card Manually

If you want to add a tool without waiting for the bot, create a file at
`content/tools/tool-slug.md` with this format:

```markdown
---
title: Tool Name
slug: tool-slug
category: Local LLMs
saliency: 4.2
source: GitHub
status: published
date: 2026-06-28
badge: NEW RELEASE
whyItMatters: One sentence about why a developer newcomer should care.
quickStart: npm install tool-name
links:
  download: https://github.com/owner/repo
  docs: https://docs.example.com
  community: https://discord.gg/example
---

### What it is

Your description here.

### Quick start

```bash
npm install tool-name
```
```

Valid categories: `Local LLMs`, `Creative Coding`, `Audio/Video Tools`, `Productivity AI`

Valid badges: `NEW RELEASE`, `HOT`, `JUST DROPPED` (or leave the badge line out entirely)

---

## Project Structure

```
ai-resource-hub/
├── frontend/          # Next.js site — this is what's live on Vercel
│   ├── app/           # Pages and routes
│   ├── components/    # UI components
│   └── lib/           # Content reader, types, categories
├── content/           # The "database" — plain Markdown files
│   ├── tools/         # One .md file per tool card
│   └── heartbeat.json # Last ingest cycle status (shown in site footer)
├── backend/           # The ingest pipeline (runs via GitHub Actions)
│   └── src/
│       ├── fetchers/  # github.js and hn.js — pull raw candidates
│       ├── saliency.js  # Scores candidates 1–5, filters below 4
│       ├── verify.js    # Enriches candidates (category, body text)
│       ├── writeToolCard.js  # Writes the .md file
│       └── ingest.js    # Orchestrates the full cycle
└── .github/
    └── workflows/
        └── ingest.yml  # Daily cron job
```

---

## How Content Updates Get to the Live Site

```
GitHub Action runs ingest
       ↓
New .md files committed to content/tools/
       ↓
Vercel detects the commit
       ↓
Site rebuilds (~60 seconds)
       ↓
New tool cards appear on airesourcehub.vercel.app
```

No manual steps needed after the initial setup.
