# ai-resource-hub — Vision

One stop resource hub for the latest on AI for Developers. A "Live Map" of freely accessible AI tools
for newcomers — researched, scored, and published automatically by AI agents.

## Scope guardrails

- Single-player V1 — ship one thing that works
- Local models for bulk work; cloud only when escalated
- Filesystem-as-database (Markdown in `/content`); publishing = a committed file
- Saliency filter (≥ 4 of 5) so the hub stays high-signal, not a landfill

## Built (V1)

- The Hub frontend (Next.js + Tailwind): Tool Cards, blended Top-3 / What-Just-Dropped / Browse-by-Function layout, category + tool pages, heartbeat footer
- The Engine scaffold (Node.js): source list, saliency scoring, Markdown writer, heartbeat — one runnable cycle (`npm run ingest`)

## Not in V1 (next slices)

- **Live ingestion** — real fetchers for GitHub Releases / Show HN / RSS (currently stubbed)
- **Triangulation verify** via a local LLM (Ollama) — cross-check release notes vs. HN vs. docs; flag conflicts as `review_needed`
- **Cron loop** — schedule the ingest cycle (the heartbeat already reports freshness)
- Markdown body rendering with full formatting (currently shown as clean preformatted text)
