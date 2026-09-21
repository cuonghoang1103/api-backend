# cuongthai.com

The monorepo behind **[cuongthai.com](https://cuongthai.com)** — a bilingual
(Vietnamese / English) learning platform: courses, an AI tutor that reads
lecture transcripts, a code lab, an exam room, plus companion iOS and desktop
apps.

It runs in production on a VPS I administer myself. Everything here — schema,
services, UI, deploy tooling — was designed and is operated by one person.
Much of the code is written by an AI coding agent (Claude Code) working from
my task breakdown; I review it, verify the real behaviour, deploy it and keep
it running.

> **On scale:** the interesting numbers here are about the system, not the
> audience. This is a personal platform with a small user base (about 70
> users). What it demonstrates is engineering, not traction.

---

## At a glance

| | |
|---|---|
| **API** | Node.js · Express · TypeScript |
| **Data** | PostgreSQL + Prisma — **319 tables**, 150 applied migrations, pgvector |
| **Web** | Next.js (App Router) · React · Tailwind |
| **Desktop** | Electron — macOS, Windows and Linux builds with auto-update ([130+ releases](https://github.com/cuonghoang1103/cuongthai-desktop/releases)) |
| **iOS** | SwiftUI, shipped to TestFlight (source in a private repo) |
| **Infra** | Docker · GHCR · nginx · Cloudflare R2 · self-hosted VPS |
| **AI** | Multi-provider LLM gateway — per-feature model routing, per-user token quotas, daily spend limits · a self-hosted Qwen model on a home GPU behind a priority queue |

**Running content:** 592 published courses · 12,100 lessons · 1,058 videos with
bilingual subtitles (330,936 aligned sentences, 4.8M words).

## Layout

```
src/            Express API — routes → services → Prisma
frontend/       Next.js web app
desktop/        Electron shell + release tooling
prisma/         schema + hand-written migrations
content/        seeded course material (data, not code)
scripts/        seeders and maintenance tooling
deploy-nha.sh   build at home → GHCR → swap on the VPS
```

## Things worth a look

**`deploy-nha.sh` — the deploy path.** Images are built locally and pushed to
GHCR; the VPS only pulls and swaps. Two reasons: parallel cold builds used to
get OOM-killed on the 6 GB VPS, and the build cache once grew to 7.6 GB on the
same disk Postgres lives on — a deploy died mid-flight with *no space left on
device*. The script also verifies libc ↔ Prisma engine compatibility **before**
pushing, after a mismatched base image produced a green build, a green push, a
green swap, and then seven minutes of 502s.

**`src/services/llm/gateway.ts` — the LLM gateway.** One place decides which
model each *feature* uses (`PURPOSE_MODEL`), overridable by env without a
deploy. It carries two API keys because a gateway token belongs to exactly one
model group; calling across groups returns a `503` that reads like transient
load but is permanent. Missing keys degrade to an equivalent model with a
warning rather than failing, because the model map ships with the code while
keys live on the server — and those two drift apart eventually.

**`src/services/courseTutor.service.ts` — the AI tutor.** In video-room mode it
loads the lesson's subtitles into context (a ±100 s focus window plus the full
transcript, capped) and requires the model to cite `[mm:ss]` timestamps taken
from the transcript. The app turns each one into a button that seeks the video,
so an approximate timestamp sends the learner to the wrong place.

**`CLAUDE.md`** — the operations log: every production incident, what actually
caused it, and the check that now prevents it. Migration failures, a disk-full
outage, a deploy race between two workflows, an nginx bind-mount that read the
old file by inode. It is the most honest document in this repo.

## Running it locally

See **[docs/SETUP.md](docs/SETUP.md)**.

## Licence

No licence granted — published as a portfolio, not for reuse.
