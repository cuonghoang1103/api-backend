# Code Lab MODULE LESSON authoring spec (read fully before writing)

You write **one module lesson** — a complete textbook chapter that a learner reads *before* doing the
module's exercises. The reader may be starting from zero on this topic and must finish able to use it
in real code. This replaces the existing lesson, so it must stand alone. **Everything in English.**

## Output

Write exactly one file: `<OUT_DIR>/lesson__<trackSlug>__<moduleSlug>.json`

```json
{ "moduleId": 249, "trackSlug": "java-core", "moduleSlug": "...", "blocks": [ /* DocBlocks */ ] }
```

Write it with the Write tool, verify it `JSON.parse`s, then reply with ONLY:
`OK <path> <n> blocks <k> code`. Never print the lesson in your reply.

## DocBlock types (the ONLY allowed shapes)

```json
{"type":"heading","text":"Encapsulation"}
{"type":"prose","html":"<p>…</p>"}
{"type":"code","title":"Defining a class","language":"java","code":"public class Dog {\n …\n}"}
{"type":"mermaid","code":"classDiagram\n  class Point\n  Point : +getX() int"}
{"type":"links","items":[{"label":"Java Language Spec — Classes","url":"https://…"}]}
```

- `prose.html` may use `<p> <ul> <ol> <li> <code> <strong> <em> <table> <tr> <th> <td> <pre>`.
  No `<script>`, no `<style>`, no markdown fences, no headings inside prose (use a heading block).
- `code.code` is raw source — real newlines become `\n` in JSON. Never truncate with `...`.
- **Mermaid labels must be plain text**: no parentheses, quotes, braces, colons or HTML inside a node
  label, or the diagram fails to render. Prefer `flowchart TD`, `sequenceDiagram`, `classDiagram`,
  `stateDiagram-v2`, `erDiagram`.

## Required size and shape

**60–90 blocks. At least 20 `code` blocks. 3–6 `mermaid`. Exactly one `links` block, last.**
Aim for 35,000+ characters of real content. Depth comes from *explaining more*, never from padding.

Structure, in order:

1. **Introduction** — what this topic is, the concrete problem it solves, and what the reader will be
   able to do by the end. Motivate with a situation from real code, not a definition.
2. **Prerequisites recap** — one short section re-teaching what earlier modules assumed, so a reader
   who forgot is not stuck.
3. **The core sections** (the bulk — 6 to 12 headings). For EACH concept:
   - `prose` explaining the idea in plain words **before** any code,
   - a `code` block that is small, complete and runnable,
   - a `prose` block walking through *what it prints and why*,
   - where the concept has structure or flow, a `mermaid` diagram,
   - a **"Common mistake"** paragraph: the wrong version, the exact error message or wrong output it
     produces, and the fix. Every core section needs one — this is where real learning happens.
4. **Progression** — order sections from the simplest usable form to the advanced form. Explicitly say
   when a simple version is fine and when you must reach for the advanced one.
5. **Comparison table** — at least one `prose` table contrasting the options a learner must choose
   between (e.g. `==` vs `equals`, `ArrayList` vs `LinkedList`, checked vs unchecked exceptions).
6. **Best practices** — a numbered list of rules with a one-line *reason* for each. Never a bare list.
7. **Worked end-to-end example** — one realistic ~60–120 line program combining the module's concepts,
   split across 2–4 code blocks with prose between them, plus its exact console output.
8. **Recap + what to do next** — what was learned, and what the exercises will drill.
9. **`links`** — 4–8 authoritative references (official docs/spec/JEP/RFC). Real URLs only; if you are
   not certain a URL exists, use the documentation root you are certain of.

## Quality bar

- Explain **why**, not only how. Every rule gets a reason.
- Every code block must compile/run as written, with correct imports and a `main`/entry point where
  the reader would run it. State the exact output.
- Prefer showing the failure first, then the fix — learners remember contrast.
- Define each term on first use; never assume a word the reader has not met.
- Do not write "as we know", "simply", "just", "obviously", "In this lesson we will".
- No invented APIs, no invented benchmark numbers, no claims about versions you are unsure of.
