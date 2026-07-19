# Code Lab exercise authoring spec (read this fully before writing)

You author **10 exercises for ONE module** of a Code Lab track and write them as a single JSON
payload file. This is real published courseware for a live site — a learner opens the exercise,
reads the problem, writes code in an editor, and can reveal an official solution. Quality bar:
NTU-style university lab sheet. **Everything in English.**

## Output

Write exactly one file: `<OUT_DIR>/<trackSlug>__<moduleSlug>.json`

```json
{
  "trackSlug": "...",
  "moduleSlug": "...",
  "exercises": [ /* exactly 10 objects, in the order below */ ]
}
```

Write the file with the Write tool. Then reply with ONLY: `OK <path> <n> exercises`.
Do not print the JSON in your reply.

## Difficulty ramp (exact)

Slots 1–2 `EASY`, slots 3–8 `MEDIUM`, slots 9–10 `HARD`. Each slot must be strictly harder /
build on earlier ones. Slot 10 should be a substantial capstone-style task for the module.

## Exercise object — every field required unless marked optional

| field | type | rules |
|---|---|---|
| `title` | string | Specific and unique across the whole track. NOT "Exercise 1" / "Practice X". No two exercises in the module may restate the same task. |
| `difficulty` | `EASY`\|`MEDIUM`\|`HARD` | per the ramp |
| `estimatedMinutes` | int | 15–90, rising with difficulty |
| `points` | int | 10 / 15 / 20 / 25 / 30 rising with difficulty |
| `concepts` | string[] | 3–6 concepts the learner applies |
| `prerequisites` | string[] | 1–4 concepts assumed already known |
| `tags` | string[] | 3–6 lowercase tags |
| `problemHtml` | HTML string | **≥ 900 characters.** The real teaching surface: 1–2 `<p>` of motivating context (why this matters in real code), then a precise `<ul>` of numbered requirements the solution must satisfy, then a note about the provided scaffold. Allowed tags: `<p> <ul> <ol> <li> <code> <strong> <em> <pre>`. No `<script>`, no markdown fences. |
| `inputSpec` | string | What the program/component receives. For UI/DB/config tracks, describe the given props / seed data / files instead of stdin. |
| `outputSpec` | string | Exactly what must be produced — observable and checkable. |
| `constraints` | string | Limits + explicit bans, e.g. "Do not use a third-party state library", "n ≤ 10^5". |
| `examplesJson` | array | 2–3 `{ "input", "output", "explanation" }`. Concrete literal values, never placeholders. |
| `hintsJson` | string[] | 4 progressive hints: nudge → the key idea → the concrete API/approach → near-solution. |
| `starterCodeJson` | array | 1–3 `{ "name", "language", "code" }`. A runnable scaffold with `// TODO:` markers where the learner works. Imports, harness, and any given data already written. |
| `solutionCodeJson` | array | 1–3 `{ "name", "language", "code" }`. **Complete, correct, runnable code.** No TODO, no `...`, no "rest omitted". Same file names as the starter. |
| `solutionExplanationHtml` | HTML string | **≥ 500 characters.** Why the solution works, the key decision, the trap most learners hit, and complexity or a performance note where relevant. |
| `diagramMermaid` | string, optional | Include on ~3 of the 10 where structure/flow genuinely helps. **Labels must be plain text** — no parentheses, quotes, braces, or HTML inside node labels, or rendering breaks. Prefer `flowchart TD`, `sequenceDiagram`, `classDiagram`, `erDiagram`. |

JSON rules: real newlines inside code become `\n` in the JSON string. Valid strict JSON only
(no trailing commas, no comments). The file must `JSON.parse` cleanly — verify before finishing.

## Code rules per track language

- Use the module's own stack idiomatically and **current** APIs (React function components +
  hooks, never class components or legacy lifecycle; Vue 3 `<script setup>` Composition API;
  Angular standalone components + signals where natural; Express/Nest with async-await;
  FastAPI with type-annotated Pydantic v2; Mongo with the modern driver; Prisma v5+ client).
- Code must actually run as written. Mentally execute it. If a value is printed, the printed
  text must match `outputSpec` and the examples **exactly**, character for character.
- Prefer self-contained tasks: one entry file plus at most two support files.
- For tracks without a stdin story (React, Vue, Angular, Tailwind, Redis, GraphQL, Mongo),
  the "input" is the given props / seed documents / schema / commands, and the "output" is the
  rendered markup, returned JSON, query result, or command output. Keep it concrete and checkable.

## Anti-slop rules (these get the batch rejected)

- No filler prose. Every sentence carries information a learner needs.
- No two exercises in the module solving the same problem with different words.
- Never reference a figure, dataset, or file you did not provide.
- Do not use the phrases "In this exercise, you will" or "Let's dive in".
- The solution must satisfy **every** bullet in the requirements list — re-read and check.
