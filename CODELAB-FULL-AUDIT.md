# Code Lab — full-track content audit & completion handoff

**Branch:** `feat/code-lab`. **Date:** 2026-07-19. **Author:** parallel audit session. **You:** finish the content.
**Read `CODELAB-JAVA-CORE-AUDIT.md` first** — this extends it from java-core to all 38 tracks.

## TL;DR
The generator FIXES you shipped in `a1afea5` (exercise diversity + difficulty ramp + lesson depth gate) are
**correct and working** — verified in code and on prod. The problem now is **content coverage**: the roadmap
(modules) exists for every track, but exercises and lessons are largely **unfilled or half-filled**. This is a
data-generation job (run the bulk scripts on the VPS), **not** a code change. Do NOT re-touch the generator
code — it's done.

Prod scan (live, 2026-07-19) of all 38 tracks:
- **Roadmap: complete.** All 38 tracks have 16 modules (except `prisma-orm` = 9). Skeleton is done everywhere.
- **Exercises: mostly missing.** 28 of 38 tracks have **0 exercises**. 8 Languages tracks are partially filled
  but most modules are under the 10/module target. Only `javascript` is near-complete.
- **Lessons: mostly missing.** Only **5** tracks have lessons; **33** have none — including `c/go/rust/kotlin`
  which *have* exercises but *no* lessons.

## What is already GOOD (do NOT redo)
- `a1afea5` implemented all of A/B/C/D/E correctly: `generateExerciseBlueprint`, `avoidTitles` anti-repeat,
  per-slot difficulty ramp (`rampDifficulty`), `codelab-dedupe.mjs`, and the lesson depth gate. `tsc` green.
- java-core lessons already prove the fix: all 9 advanced lessons were regenerated (e.g. module 253
  Multithreading went 8.7k→18.5k chars, 15 code blocks, 3 diagrams). Good.
- java-core exercise duplicates were removed by the dedupe pass (the old "BankAccount ×10" is gone).

## Full prod state (38 tracks)

`mods` = modules · `ex` = exercises · `under10` = modules with <10 exercises · `less✓/✗` = lessons present/missing
· difficulty = E(asy)/M(edium)/H(ard) counts.

| Group | Track | mods | ex | under10 | less✓ | less✗ | difficulty | Needs |
|---|---|---|---|---|---|---|---|---|
| Languages | java-core | 16 | 119 | 13 | 16 | 0 | E4 M95 H20 | top-up exercises |
| Languages | python | 16 | 124 | 11 | 16 | 0 | M104 H14 E6 | top-up exercises |
| Languages | javascript | 16 | 124 | 4 | 16 | 0 | M89 H24 E11 | ~ok, minor top-up |
| Languages | typescript | 16 | 58 | 13 | 16 | 0 | M50 H8 (no Easy) | top-up + **dedup (high)** |
| Languages | c | 16 | 70 | 13 | 0 | 16 | M59 E1 H10 | **lessons** + top-up |
| Languages | go | 16 | 57 | 16 | 0 | 16 | M55 E1 H1 | **lessons** + top-up + ramp |
| Languages | rust | 16 | 68 | 12 | 0 | 16 | M59 H9 | **lessons** + top-up |
| Languages | kotlin | 16 | 47 | 14 | 0 | 16 | M37 H10 | **lessons** + top-up |
| Backend | nodejs-express | 16 | 11 | 15 | 16 | 0 | E3 M6 H2 | fill exercises |
| Backend | django | 16 | 10 | 15 | 0 | 16 | E2 M6 H2 | **lessons** + fill exercises |
| Backend | spring-boot, nestjs, fastapi, aspnet-core, laravel | 16 | 0 | 16 | 0 | 16 | — | **exercises + lessons (empty)** |
| Frontend | html-css, react, nextjs, vue, angular, tailwind-css | 16 | 0 | 16 | 0 | 16 | — | **exercises + lessons (empty)** |
| Database | sql, mongodb, redis | 16 | 0 | 16 | 0 | 16 | — | **exercises + lessons (empty)** |
| Database | prisma-orm | 9 | 0 | 9 | 0 | 9 | — | **exercises + lessons (empty)**; only 9 modules |
| Mobile | android-kotlin, flutter, react-native, swiftui-ios | 16 | 0 | 16 | 0 | 16 | — | **exercises + lessons (empty)** |
| DevOps | git, linux-bash, docker, kubernetes | 16 | 0 | 16 | 0 | 16 | — | **exercises + lessons (empty)** |
| Algorithms | data-structures-algorithms | 16 | 0 | 16 | 0 | 16 | — | **exercises + lessons (empty)** |
| Game | opengl, unity-c | 16 | 0 | 16 | 0 | 16 | — | **exercises + lessons (empty)** |
| Web/Net | rest-apis, graphql | 16 | 0 | 16 | 0 | 16 | — | **exercises + lessons (empty)** |

Rough remaining work: **28 empty tracks × ~160 exercises ≈ 4,500 exercises**, plus top-ups for the 10 partial
tracks, plus **~530 missing lessons** (33 tracks × 16). This is large — it spans multiple 5-hour token windows.

## Prioritized plan

**P0 — Finish java-core exercises (the one you already started).** It's mid-regen: dedupe removed dups
(160→119) but the top-up to 10/module never completed — 13 modules are still under 10 (OOP has only 2,
Inheritance 4, Reflection 4, Testing/Concurrency 5). Run the exercise bulk to top it up first (fast feedback).

**P1 — Fill the 28 empty tracks with exercises.** Modules already exist, so run the exercise phase ONLY
(never `--roadmap`/`--fresh-roadmap` — that would regenerate/delete the existing modules). The new
blueprint+ramp+avoidTitles generator makes each module's 10 exercises distinct and difficulty-ramped.

**P2 — Generate the 33 missing lessons.** Highest value where exercises already exist but lessons don't:
`c`, `go`, `rust`, `kotlin`, `django`. Then the empty tracks once they have exercises.

**P3 — Dedup `typescript`** (near-dup signal 16 on only 58 exercises — real clustering). Run
`codelab-dedupe.mjs --track typescript` (dry → apply), then re-fill.

**P4 — (optional) Difficulty ramp on old tracks.** `c/go/rust/kotlin` were built by the OLD generator
(Medium-heavy, ~0 Easy/Hard). Lower priority than filling empties; only regenerate if you want the ramp there.

## Commands (run on the VPS, ONLY when other AI jobs are idle)

Prereq: deploy `feat/code-lab` first so the container `dist/` has the `a1afea5` generator. Deploy restarts the
backend and would kill any in-flight AI job — do it between jobs.

```bash
# EXERCISES — all tracks, top each module up to 10 (idempotent: skips full modules,
# NEVER pass --roadmap; modules already exist). One flat-out job, throttled.
docker exec -d -e LLM_MODEL_GENERATION=claude-opus-4-8 cuonghoangdev_backend \
  sh -c "node scripts/codelab-bulk-gen.mjs --per-module 10 --budget 3000000 > /tmp/codelab-ex.log 2>&1"
#   • one track first for a smoke test:  ... --tracks java-core --dry   (dry still calls the LLM)
#   • resumable — re-run to continue after a token-window pause.

# LESSONS — every module missing a lesson (resumable, skips ones that have one).
docker exec -d cuonghoangdev_backend \
  sh -c "node scripts/codelab-lesson-bulk-gen.mjs --budget 8000000 > /tmp/codelab-lessons.log 2>&1"

# DEDUP typescript, then refill:
docker exec cuonghoangdev_backend node scripts/codelab-dedupe.mjs --track typescript          # preview
docker exec cuonghoangdev_backend node scripts/codelab-dedupe.mjs --track typescript --apply   # delete
```

Do NOT run the exercises job and the lessons job at the same time — they share the same 5-hour token window and
would starve each other. Run one to (a paused) completion, then the other.

## Verify (spot-check after runs)
```bash
# per-track fill + lessons:
node -e 'const B="https://cuongthai.com/api/v1/code-lab";(async()=>{for(const s of ["spring-boot","react","sql","c","go"]){const t=(await (await fetch(B+"/tracks/"+s)).json()).data;const m=t.modules||[];let ex=0,less=0;for(const x of m){ex+=(x.exercises||[]).length;if(x.lessonGeneratedAt)less++;}console.log(s,"ex",ex,"lessons",less+"/"+m.length);}})()'
```
Target per track: ~160 exercises (16×10) with an E/M/H spread, and 16/16 lessons.

## Constraints (respected throughout)
- Generator code (`a1afea5`) is correct — do not modify it; this is a *run the job* task.
- Never `--roadmap`/`--fresh-roadmap` here — the 16-module skeletons already exist and must be preserved.
- Don't deploy or start a bulk job while another AI job is running on the VPS (deploy restart kills it; jobs
  share the token window). Work branch `feat/code-lab`, do not merge to `main` mid-generation.
- Scripts import compiled `dist/`, so a deploy (container rebuild) must precede the first run of new behavior.
