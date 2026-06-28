# ai-resource-hub

An always-on, AI-curated **Resource Hub** for developers new to freely accessible AI tools — the latest
releases, *why they matter*, and *how to start*. Built to the Council's spec (see
`docs/council-transcript.md`): a "Live Map" of tools, not a chronological blog.

## What's built (V1)

**The Hub (frontend — Next.js App Router + Tailwind)** — renders **Tool Cards** from Markdown in
`/content`. The filesystem is the database; "publishing" is just a committed file.

- **Landing page** with the blended layout the Council settled on:
  - ⭐ **This Week's Top 3 Picks** — highest saliency, any category
  - 🚀 **What Just Dropped** — newest additions
  - 🧭 **Browse by Function** — Local LLMs · Creative Coding · Audio/Video Tools · Productivity AI (live counts)
- **Tool Card** — title + NEW RELEASE badge, "Why it matters", copy-able "Quick Start", Download/Docs/Community links, saliency score.
- **Category pages** (`/category/[slug]`) — Top 3 + full timeline.
- **Tool detail pages** (`/tool/[slug]`) — full how-to.
- **Heartbeat footer** — shows the last ingest cycle (the General's "stale site" guardrail).

**The Engine (backend — Node.js)** — one runnable cycle of the content pipeline:

- `src/sources.js` — the high-signal source list (GitHub Releases, Show HN, Awesome Lists, changelogs, newsletters).
- `src/saliency.js` — the 1–5 **Saliency Filter** (accessibility / impact / community); only ≥ 4 publishes.
- `src/ingest.js` — orchestrates ingest → score → verify → write → heartbeat.
- `src/writeToolCard.js` / `src/heartbeat.js` — write Markdown cards + the heartbeat.

## Run it

```bash
# Frontend (the Hub) — http://localhost:3000
cd frontend && npm install && npm run dev

# Engine — run one ingest cycle (writes cards + heartbeat into /content)
cd backend && npm install && npm run ingest

# Engine API server (optional) — /api/heartbeat, /api/status
cd backend && npm run dev
```

## Honest status — what's stubbed

The orchestration, **saliency scoring, Markdown publishing, and heartbeat are real**. Two steps are
stubbed with clear `TODO(slice)` markers, because they need live network + a local model:

1. **Live fetchers** (`ingestCandidates` in `ingest.js`) — wire each source to its real API/RSS.
2. **Triangulation verify** (`verify` in `ingest.js`) — compare GitHub notes vs. Show HN vs. docs via a
   **local LLM (Ollama)**; on a conflicting install/how-to step, flag the card `status: review_needed`
   instead of `published`.

Current `/content/tools/*.md` are **seed cards** (real tools, illustrating the format). Wiring the two
stubs above turns this from a demo into the self-sustaining engine the Council designed.

## Docs

- `docs/VISION.md` — scope
- `docs/council-transcript.md` — the full ideation + green-light
- `docs/builder-transcript.md` — build chat
