---
title: whisper.cpp
slug: whisper-cpp
category: Audio/Video Tools
saliency: 4.5
source: GitHub
status: published
date: 2026-06-23
whyItMatters: Fast, local speech-to-text that runs on a CPU. Transcribe meetings, videos, and voice notes privately — no upload, no subscription.
quickStart: git clone https://github.com/ggerganov/whisper.cpp && make
links:
  download: https://github.com/ggerganov/whisper.cpp
  docs: https://github.com/ggerganov/whisper.cpp#readme
  community: https://github.com/ggerganov/whisper.cpp/discussions
---

### Why it matters

whisper.cpp is a lean C/C++ port of OpenAI's Whisper that runs entirely offline, even on modest
hardware — a privacy-friendly transcription workhorse.

### Quick start

1. Clone and build: `git clone https://github.com/ggerganov/whisper.cpp && make`
2. Download a model with the included script.
3. Transcribe: `./main -m models/ggml-base.en.bin -f your-audio.wav`
