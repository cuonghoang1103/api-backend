# Handoff — finish Code Lab + Exp Hub content ("làm full")

From: the audit/authoring session. To: the session working on `feat/code-lab`.
This is the single index. Two detailed reports sit next to it — read them for the data + exact commands:
`CODELAB-FULL-AUDIT.md` (all 38 Code Lab tracks) and `CODELAB-JAVA-CORE-AUDIT.md` (the generator-fix plan).

---

## 1. What is already DONE — do NOT redo

- **Generator fixes are correct** (your commit `a1afea5`: `avoidTitles` + `generateExerciseBlueprint`,
  per-slot difficulty ramp, `codelab-dedupe.mjs`, lesson depth gate). Verified in code and on prod. **Do not
  modify the generator code** — the remaining work is *running* it, not changing it.
- **java-core advanced lessons already regenerated deep** (e.g. module 253 = 18.5k chars, 15 code, 3 diagrams).
- **Two ready branches (pushed, PRs open), based on clean `origin/main`, independent of `feat/code-lab`:**
  - **PR #7 `feat/exp-hub-doc-depth`** — Exp Hub doc depth-gate + `--regen-thin` + prune-empty-groups script.
  - **PR #8 `feat/codelab-oop-seed`** — hand-authored, JDK-verified complete OOP Fundamentals module
    (`scripts/codelab-seed-oop.mjs`, pure-DB seed, 10/10 solutions compiled + passed).

## 2. What "full" still needs (prioritized) — Code Lab

Ground truth (prod scan): roadmap/modules exist for all 38 tracks, but **28/38 tracks have 0 exercises**, most
Languages tracks are under-filled, and **33/38 tracks have no lessons**. Full table + commands in
`CODELAB-FULL-AUDIT.md`. Order:

- **P0 — finish java-core exercises.** Mid-regen: dedupe ran (160→~119) but the top-up to 10/module never
  finished (OOP has 2, Inheritance 4, Reflection 4, Testing/Concurrency 5). Top it up first.
- **P1 — fill the 28 empty tracks with exercises.** Run the exercise phase ONLY — modules already exist, so
  **never pass `--roadmap`/`--fresh-roadmap`** (that would regenerate/delete the roadmap).
  ```bash
  docker exec -d -e LLM_MODEL_GENERATION=claude-opus-4-8 cuonghoangdev_backend \
    sh -c "node scripts/codelab-bulk-gen.mjs --per-module 10 --budget 3000000 > /tmp/codelab-ex.log 2>&1"
  ```
- **P2 — generate the 33 missing lessons** (priority: `c`, `go`, `rust`, `kotlin`, `django` — they have
  exercises but no lesson).
  ```bash
  docker exec -d cuonghoangdev_backend \
    sh -c "node scripts/codelab-lesson-bulk-gen.mjs --budget 8000000 > /tmp/codelab-lessons.log 2>&1"
  ```
- **P3 — dedup `typescript`** (high near-dup signal), then refill:
  ```bash
  docker exec cuonghoangdev_backend node scripts/codelab-dedupe.mjs --track typescript          # preview
  docker exec cuonghoangdev_backend node scripts/codelab-dedupe.mjs --track typescript --apply
  ```
- **OOP module (from PR #8):** after merging PR #8 and deploying, run it — it OVERWRITES java-core's OOP
  module with the curated content, so run it AFTER any java-core regen and do NOT let bulk-gen top it up again:
  ```bash
  docker exec cuonghoangdev_backend node scripts/codelab-seed-oop.mjs --dry     # preview
  docker exec cuonghoangdev_backend node scripts/codelab-seed-oop.mjs --apply   # write
  ```

## 3. What "full" still needs — Exp Hub (from PR #7)

Details in `EXPHUB-DEEPEN-RUNBOOK.md` (on the `feat/exp-hub-doc-depth` branch). After merging PR #7 + deploy:
- **Regenerate the ~148 thin docs** (of 157) with the depth gate:
  ```bash
  docker exec -e LLM_MODEL_GENERATION=claude-opus-4-8 cuonghoangdev_backend \
    node scripts/exphub-doc-bulk-gen.mjs --regen-thin --budget 3000000
  ```
- **Unblock the missing Next.js / Node.js** leaves (empty root groups collide on slug) — prune then re-seed:
  ```bash
  docker exec cuonghoangdev_backend node scripts/exphub-prune-empty-groups.mjs --apply
  docker exec cuonghoangdev_backend node scripts/exp-hub-seed-taxonomy.mjs --apply
  docker exec -e LLM_MODEL_GENERATION=claude-opus-4-8 cuonghoangdev_backend \
    node scripts/exphub-doc-bulk-gen.mjs --only nodejs,nextjs --budget 3000000
  ```

## 4. Constraints (must respect)

- **One AI job at a time.** Exercises, lessons, and Exp Hub docs all share the SAME 5-hour token window — run
  ONE flat-out to completion (or a throttled pause), never two racing.
- **Don't deploy while an AI job is running** — a deploy restarts the backend and kills the in-flight job.
- **Never `--roadmap`/`--fresh-roadmap`** in Code Lab bulk-gen — the 16-module skeletons must be preserved.
- **Don't let bulk-gen top-up the OOP module** after the seed runs (it is the source of truth at 10 exercises).
- **Scripts import compiled `dist/`** — deploy (container rebuild) must precede the first run of any new script.
- Merging PR #7 or #8 to `main` triggers a production deploy — merge when AI jobs are idle.

## 5. Verify (after runs)
```bash
# Code Lab per-track fill + lessons:
node -e 'const B="https://cuongthai.com/api/v1/code-lab";(async()=>{for(const s of ["java-core","spring-boot","react","sql","c"]){const t=(await (await fetch(B+"/tracks/"+s)).json()).data;const m=t.modules||[];let ex=0,less=0;for(const x of m){ex+=(x.exercises||[]).length;if(x.lessonGeneratedAt)less++;}console.log(s,"ex",ex,"lessons",less+"/"+m.length);}})()'
```
Targets: each Code Lab track ~160 exercises (16×10) with an E/M/H spread + 16/16 lessons; Exp Hub docs deeper
(≥6 code, ≥1 diagram) and Next.js/Node.js present.
