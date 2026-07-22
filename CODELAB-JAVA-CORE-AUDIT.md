# Code Lab — Java Core audit & fix handoff

**Branch:** `feat/code-lab` · **Scope:** the `java-core` track of the Code Lab module (`https://cuongthai.com/code-lab/java-core`).
**Author:** parallel Claude session (audit only). **You:** implement the fixes below.
**Date context:** 2026-07-19.

This is a HANDOFF. I audited the Java Core track (16 modules, 160 exercises, 16 lessons) against the goal
"complete curriculum from basics to professional, good enough for a learner to study AND practice." The
curriculum *breadth* is excellent. Two real defects need fixing: (1) the 10 exercises inside each module are
near-duplicates of a single canonical problem, and (2) the ADVANCED-module lessons are far too shallow.
Everything below is verified against live prod data and the actual source — not guesses.

---

## What is already GOOD (do not touch)

- **Roadmap breadth is complete & professional.** 16 modules, environment setup → OOP → collections →
  concurrency → JVM internals → NIO.2 → JDBC → testing → CI/CD → reflection → Fork/Join → enterprise
  security/observability. Ordering and levels are sound.
- **Per-exercise structure is high quality.** Each exercise has problem HTML, input/output spec, 2–3 worked
  examples with explanations, constraints, "knowledge to learn", 4–6 progressive hints, starter code (TODO),
  an official solution + solution explanation, and a mermaid diagram. The *shape* of an exercise is great.
- **Every module has a lesson** (`lessonBlocks` populated for all 16 — none missing).

---

## DEFECT 1 — Exercises within a module are near-duplicates

### Evidence (live)
Every module's 10 exercises collapse to ~1 canonical problem repeated with tiny title changes:

| Module | The one repeated problem |
|---|---|
| 4 OOP Fundamentals | 9/10 = "Implement a Bank Account Class with Encapsulation" |
| 5 Inheritance/Poly | mostly "Payment Processing System with Strategy Pattern" |
| 6 Collections | mostly "Word Frequency Analyzer using Collections" |
| 7 Exception/IO/Generics | mostly "Generic File/CSV parser with custom exceptions" |
| 8 Multithreading | mostly "Thread-Safe … Observer Pattern" |
| 9 JVM Internals | 10/10 = "Object Pool" variants |
| 10 NIO.2 | "Directory Watcher / NIO chat server" repeated |
| 11 JDBC | 10/10 = "Transactional Batch Processing" |
| 12 Testing | 10/10 = "Test Suite for Order Processing Service" |
| 13 CI/CD | 10/10 = "Custom Maven/Gradle Plugin" |
| 14 Reflection | 10/10 = "Runtime Validation Framework with Annotations" |
| 15 Concurrency | 10/10 = "Parallel Document Indexer Fork/Join" |
| 16 Enterprise | 10/10 = "Secure Audit Logger" |

Net effect: "160 exercises" is really ~16 distinct problems × 10 variants. Also difficulty is almost
uniformly **Medium** — advanced modules barely ramp to Hard, and there is almost no Easy on-ramp.

### Root cause (verified in code)
`scripts/codelab-bulk-gen.mjs` → `exercisePhase()` tops up each module by repeatedly calling:

```js
// scripts/codelab-bulk-gen.mjs  ~line 159
const gen = await generateExercises(ADMIN, { moduleId: mod.id, count: take }); // take = BATCH (default 4)
```

in a `while (need > 0)` loop until the module has `PER_MODULE` (10). The problem:

1. **No `titles` passed** → `generateExercises` tells the LLM to *invent* titles
   (`src/services/codeLab.ai.service.ts:191` — the `titlesNote` "Invent N distinct… titles" branch).
2. **The module's already-existing exercises are NEVER passed into the prompt.** Each batch call is
   context-blind — it only knows the module *name + description*
   (`src/services/codeLab.ai.service.ts:236` user message).
3. **Each batch is independent** with identical context, so the model re-converges on the single most
   "canonical" exercise for that theme every call → BankAccount ×10, ObjectPool ×10, etc.
4. **Flat difficulty:** when no `difficulty` is passed, the prompt only says *"Vary difficulty across
   EASY/MEDIUM/HARD as appropriate"* (`src/services/codeLab.ai.service.ts:192`), and the model defaults to
   Medium.

`generateExercises` already supports a `topic` param (`src/services/codeLab.ai.service.ts:187,193`) and a
`difficulty` param — they are just never used by the bulk script. That is the lever for the fix.

---

## DEFECT 2 — Advanced-module lessons are too shallow

Every module has a lesson, but depth collapses on the advanced modules (which are the hardest topics and
most need depth). Measured live via `GET /api/v1/code-lab/modules/:id/lesson`:

| # | Module | id | blocks | chars | code blocks | verdict |
|---|--------|----|--------|-------|-------------|---------|
| 1 | Fundamentals | 246 | 60 | 23K | 16 | rich |
| 2 | Variables/Operators | 247 | 44 | 31K | 17 | rich |
| 3 | Control Flow | 248 | 58 | 32K | 19 | rich |
| 4 | OOP | 249 | 48 | 29K | 13 | rich |
| 5 | Inheritance/Poly | 250 | 55 | 47K | 11 | richest |
| 6 | Collections | 251 | 36 | 39K | 11 | rich |
| 7 | Exception/IO/Generics | 252 | 34 | 28K | 11 | ok |
| 8 | Multithreading | 253 | 27 | **8.7K** | 8 | thin |
| 9 | JVM Internals | 542 | 22 | **6.4K** | 3 | too thin |
| 10 | NIO.2/Network | 543 | 20 | 6.4K | 6 | too thin |
| 11 | JDBC | 544 | 22 | 6.5K | 5 | too thin |
| 12 | Testing | 545 | 22 | 5.5K | 6 | too thin |
| 13 | CI/CD | 546 | 19 | 5.0K | 5 | too thin |
| 14 | Reflection | 547 | 16 | 5.0K | 3 | too thin |
| 15 | Concurrency/ForkJoin | 548 | 19 | 5.5K | 3 | too thin |
| 16 | Enterprise/Security | 549 | 18 | 5.7K | 3 | too thin |

Beginner/intermediate lessons are ~28–47K chars with 11–19 annotated code blocks. The 9 advanced lessons
(ids **253, 542–549**) are ~5–9K chars with 3–8 code blocks and usually 1 diagram — 5–6× thinner. Note the
id jump 253→542: modules 9–16 are the later "extend-mode" additions, and their lesson pass produced much
shorter output. The lesson prompt itself (`src/services/codeLab.lesson.service.ts:77-112`) is good — it asks
for 16–26 blocks, thorough intro, 2–4 diagrams — but there is no *minimum-depth enforcement*, so short
generations were accepted. `maxTokens` is 12000 (`:126`), which is fine; the shortfall is prompt pressure +
no re-gen gate, not a hard token cap.

---

## FIX PLAN (implement on `feat/code-lab`)

Order by impact: **A + C → B → E → D**. A and C are small and fix the biggest problem.

### A. Anti-repeat context (highest impact, smallest change)
Give the generator the titles/concepts already present so it must produce DISTINCT problems.

1. `src/services/codeLab.ai.service.ts` → `generateExercises` body: add optional
   `avoidTitles?: string[]` (and optionally `avoidConcepts?: string[]`). Inject into the `system` prompt
   (near the `titlesNote`/`diffNote`/`topicNote` block, ~line 189-200):
   ```
   The module ALREADY has these exercises — your new ones MUST be DISTINCT problems exploring DIFFERENT
   sub-topics, NOT variations, rewordings, or re-skins of these. Do not reuse the same domain scenario:
   <one per line>. If a listed problem is "Bank Account with encapsulation", do NOT produce another
   account/wallet CRUD task — pick a genuinely different facet of the module.
   ```
   Cap the list (e.g. slice to 40) to control token cost.

2. `scripts/codelab-bulk-gen.mjs` → `exercisePhase`: before the `while` loop, load existing titles for the
   module; accumulate titles generated during this run and pass the union as `avoidTitles` on every
   `generateExercises` call. (Query: `prisma.codeExercise.findMany({ where:{moduleId}, select:{title:true} })`,
   then push new `gen.exercises[].title` into the set after each batch.)

### C. Enforce a difficulty ramp (small change, do together with A)
In `scripts/codelab-bulk-gen.mjs`, instead of one blind `count: take`, drive difficulty by slot. Simple rule
for a 10-exercise module (scale proportionally if `PER_MODULE` differs):
- slots 1–2 → `difficulty: 'EASY'`
- slots 3–8 → `difficulty: 'MEDIUM'`
- slots 9–10 → `difficulty: 'HARD'` (top module / capstone may use `EXPERT`)

`generateExercises` already accepts `difficulty` and applies it as `diffNote` (`codeLab.ai.service.ts:192`).
So call it per-slice with the target difficulty rather than a single blind batch. Keep batching, but batch
*within a difficulty band* so titles + difficulty stay coherent.

### B. Per-module sub-topic blueprint (best diversity, medium effort)
Before generating exercises, generate a blueprint of N DISTINCT sub-topics for the module, then generate
ONE exercise per sub-topic using the existing `topic` param (`codeLab.ai.service.ts:187,193`).
- Add a small `generateExerciseBlueprint(userId, {moduleId, count})` in `codeLab.ai.service.ts` (or reuse the
  roadmap generator shape) that returns `["constructor overloading","static vs instance","equals/hashCode/
  toString","immutability","composition over inheritance","enum","record","nested classes",...]`.
- In bulk-gen, loop the blueprint: `generateExercises({ moduleId, count:1, topic: subTopic, difficulty: <ramp> ,
  avoidTitles })`.
This maps 10 exercises → 10 real facets instead of 1 theme × 10.

### E. Clean up the EXISTING duplicates in java-core (data fix — required)
A/B/C only fix *future* generation. The current java-core is already polluted, so it needs a cleanup + regen:
- Write `scripts/codelab-dedupe.mjs` (mirror the style of `scripts/codelab-*.mjs`): for a given track, within
  each module, detect near-duplicate exercises (normalize title, compare Jaccard on title tokens + `concepts`
  overlap; flag pairs above a threshold). `--dry` prints, otherwise delete extras via
  `codeLab.deleteExercise` keeping the best 1–2 per cluster.
- Then re-run the improved bulk-gen (A+B+C) to top each module back up to 10 with diverse, ramped exercises.
- **Do not run the destructive step without `--dry` review first.** This edits prod data (see constraints).

### D. Deepen the 9 thin advanced lessons (ids 253, 542–549)
- In `src/services/codeLab.lesson.service.ts`, add a minimum-depth gate: after `normalizeBlocks`, if the
  lesson is below a threshold (e.g. `< 12` code+prose blocks OR total chars `< 12000`) treat it as
  insufficient. For ADVANCED modules strengthen the prompt: require "at least 8 annotated code examples and
  at least 3 diagrams, and explicitly cover: <module sub-topics>".
- Add a `scripts/codelab-lesson-regen.mjs` (or reuse `scripts/codelab-lesson-bulk-gen.mjs` with a
  `--min-chars`/`--force` filter) that re-generates only lessons under the threshold. Target ids for
  java-core: **253, 542, 543, 544, 545, 546, 547, 548, 549**.

---

## CONSTRAINTS (read before running anything)

- **Do NOT deploy / push / run the AI bulk jobs yourself.** Per `CLAUDE.md` and project memory, running the
  bulk generators is a heavy job on the VPS, and a deploy **kills any AI job currently running on the VPS**.
  There are AI jobs running on prod right now. Limit yourself to: edit code → `npx tsc --noEmit` (and
  `cd frontend && npm run build` only if you touch frontend) → hand back. The user triggers the actual
  generation runs when the VPS is idle.
- Work on branch **`feat/code-lab`**. Do not merge to `main`.
- The bulk scripts import the COMPILED `dist/` (`scripts/codelab-bulk-gen.mjs:36-37`), so after editing the
  `.ts` services the scripts only see changes after `npm run build`. Mention this in your handback.
- Deleting exercises (step E) mutates prod data — gate behind `--dry` and get user sign-off before the real run.
- Keep everything ENGLISH-only (the generators are English-only by design).

## VERIFICATION after your edits
- `npx tsc --noEmit` must be green.
- Prove the anti-repeat/topic/difficulty params thread through: a `--dry` run of `codelab-bulk-gen.mjs`
  (after `npm run build`) should print *distinct* proposed titles per batch and the difficulty ramp — no need
  to actually write to prod.
- Do NOT judge success by "it builds"; the point is title/topic diversity in the dry-run output.

## Key files
- `src/services/codeLab.ai.service.ts` — exercise + roadmap generators (edit A, B, C).
- `src/services/codeLab.lesson.service.ts` — lesson generator (edit D).
- `scripts/codelab-bulk-gen.mjs` — mass exercise/roadmap driver (edit A, B, C).
- `scripts/codelab-lesson-bulk-gen.mjs` / `scripts/codelab-lesson-write.mjs` — lesson drivers (edit D).
- New: `scripts/codelab-dedupe.mjs` (E), optional `scripts/codelab-lesson-regen.mjs` (D).
- `src/services/codeLab.service.ts` — `createExercise` / `deleteExercise` / `createModule` / `deleteModule`.
- Public API used for the audit: `GET /api/v1/code-lab/tracks/java-core`,
  `GET /api/v1/code-lab/modules/:id/lesson`.
