/**
 * node-18-5 — Node.js · Chapter 18 · Lesson 18.5 "Decisions you cannot take back" (slide EN, đợt 12 — 08/11/2026). MỘT deck, MỘT tập node-18-5.
 * Nguồn: nodejs-18-5-quyet-dinh-kho-dao-nguoc. Output THẬT: that/c18/decisions (git show 9076fb918: embedQueue.service.ts + CLAUDE.md; chỉ đọc).
 * Khác web: chú thích "Why no BullMQ?" THẬT trong mã ghi "BullMQ adds 50MB deps + Redis-only state" và KHÔNG có dòng "khi nào nghĩ lại" — web dựng một bản
 *   diễn giải (22 gói + 13 MB, có dòng "Change your mind when") ⇒ slide đặt cạnh nhau, nói rõ cái nào thật · CLAUDE.md: 21 dòng Known Error Patterns, 9 luật NEVER ·
 *   số đo khác cập nhật theo 18.1/18.3: 50 route bỏ tầng (web 28), 243 migration (web 95).
 */
import { lamDeck, two, box, cards, flow, bang, TT, steps, sql } from './_c9-chung.mjs';

export const deck = { key: 'node-18-5', code: 'NODE 18.5', title: 'Decisions you cannot take back', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', LAM = '#336791', DO = '#b0281a', CAM = '#e08a1e', TIM = '#7c3aed';
const JS = (src, o = {}) => sql(src, { lang: 'javascript', sm: o.sm ?? true, hl: o.hl });
const MD = (src, o = {}) => sql(src, { lang: 'markdown', sm: o.sm ?? true, hl: o.hl });

export const slides = lamDeck({ chuong: 'Chapter 18 — Architecture', bai: '18.5' }, [
  { cover: true, t: 'Decisions you<br>cannot take back', sub: 'Most technical decisions are cheap to reverse and get argued for hours. A few are permanent and get made in five minutes by whoever was typing. This lesson is about telling them apart.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>Two kinds of door — and the five one-way doors in a backend</li>
<li>Writing down WHY, not what: a real comment, and what it is missing</li>
<li>A lightweight ADR in four headings</li>
<li>What technical debt really is — and what it is not</li>
<li>Three debts this project paid, with receipts</li>
</ul>` + two(box('Why it matters to you', 'The person who inherits your code is usually you, eighteen months later, with the reasons gone.', 'lam'), box('The habit this lesson builds', 'Before any decision, ask one question: "if this is wrong, what does undoing it cost?"', 'xanh')) },

  { t: 'Two kinds of door', to: true, giua: true, body: two(box('A two-way door', 'Reversible in an afternoon: the logging library, folder names, the compression level, the pool size. DECIDE FAST, and fix it if you were wrong.', 'xanh'), box('A one-way door', 'Reversing it costs months: the database schema, a public API contract, the language, the auth model. DECIDE SLOWLY, and write down why.', 'do2')) +
    flow([{ t: 'weeks on the ORM debate', s: 'a two-way door', mau: CAM }, { t: 'five minutes on the URL id', s: 'a one-way door', mau: DO }, { t: 'the usual failure', s: 'treating both the same', mau: DO }], { h: 130 }) +
    box('Like a haircut and a tattoo', 'Both change how you look. One grows back in a month.', 'lam') },

  { t: 'The one-way doors in a backend', to: true, giua: true, body: bang(['door', 'why it does not swing back', 'met in'], [
    ['the DB schema', 'data outlives code; a failed migration then BLOCKS every deploy (P3009)', 'chapter 7'],
    ['a public API', 'once clients use it you cannot change it — only add a version', 'chapter 6'],
    ['the auth model', 'changing how tokens are made logs every user out', 'chapter 8'],
    ['ids in URLs', 'sequential ids leak volumes and invite IDOR; switching kills old links', 'chapter 8'],
    ['time types', 'timestamp instead of timestamptz corrupts data you cannot un-corrupt', 'this project'],
  ], { co: 21, hl: [0] }) + box('Data outlives code', 'Code can be rolled back in seconds (17.6). Data written with the wrong shape stays written.', 'cam') +
    box('This backend: 243 migrations, 608 models (18.3)', 'Every one of those migrations is a door that was walked through. Most were two-way; the ones that dropped or retyped a column were not.', 'lam') },

  { t: 'Write down WHY, not what', to: true, giua: true, body: TT('c18/decisions', 1, 11, 'the real comment at the top of embedQueue.service.ts · git show 9076fb918 · real', { n: 104, hl: [2, 4, 7, 8], sm: false }) +
    two(box('What it gets right', 'The decision, the cost accepted ("in-flight jobs are lost"), and the mitigation (idempotent jobs + a recovery scan).', 'xanh'), box('What it is missing', 'The condition to revisit it. Without that line, a deliberate trade-off looks exactly like an oversight.', 'cam')) },

  { t: 'The line that makes a trade-off readable', to: true, giua: true, body: JS(`// Why NOT BullMQ here?
// One process, one job at a time. BullMQ adds 50MB of dependencies
// and Redis-only state for something an array already handles.
// Trade-off: if the process dies mid-job, that job is LOST.
// Mitigation: jobs are idempotent + embeddingStatus + a recovery scan at startup.
// Revisit when: a second process appears, or losing a job stops being acceptable.`, { sm: false, hl: [6] }) +
    two(box('The last line is the one that matters', 'It tells the next person when the decision expires — so they neither keep it out of superstition nor delete it without knowing what it protected.', 'xanh'), box('And 18.4 already named the trigger', 'A second process breaks exactly this queue and the cron flag. The comment and the architecture agree.', 'lam')) },

  { t: 'A lightweight ADR: four headings', to: true, giua: true, body: MD(`# ADR 7: In-process queue for document embedding

## Context        what forced a choice
## Options        what was considered
## Decision       what was chosen
## Consequences   what we now CANNOT do`, { sm: false, hl: [6] }) +
    two(box('Ten minutes each', 'For decisions bigger than a comment. Keep them in the repository, next to the code they explain.', 'lam'), box('The point is not the document', 'It is that writing "what we now cannot do" makes people notice a one-way door before walking through it.', 'xanh')) +
    flow([{ t: 'a choice appears', s: 'one-way door?', mau: CAM }, { t: 'write the ADR', s: '10 minutes', mau: LAM }, { t: '"Consequences"', s: 'what we can no longer do', mau: DO }, { t: 'decide', s: 'eyes open', mau: NODE }], { h: 110 }) },

  { t: 'What technical debt actually is', to: true, giua: true, body: cards([['DELIBERATE', '"Ship it to make the date, knowing we must fix it." Fine — if it is written down and someone remembers.'], ['ACCIDENTAL', '"Only now do I see how it should have been done." Unavoidable: this is how you learn.'], ['ROT', 'A decision that was right, in circumstances that changed: flags, compatibility code, a workaround for a bug since fixed.'], ['NOT debt', 'Ugly code that nobody touches and that blocks nothing. Leave it alone.']], 2) +
    box('The useful question', 'Never "is this good code?" — always "what does this make EXPENSIVE?"', 'cam') },

  { t: 'Debt is measured in future cost', to: true, giua: true, body: two(box('The 50 route files that skip the service (18.1)', 'ARE debt: they make one specific change — applying a rule everywhere — cost up to fifty edits instead of one.', 'do2'), box('The 6,113-line seed file (18.2)', 'is NOT debt: it makes nothing expensive. Searching it costs the same at any length.', 'xanh')) +
    flow([{ t: 'ugly, never changes', s: 'costs nothing', mau: NODE }, { t: 'clean, wrong boundary', s: 'costs every week', mau: DO }], { h: 120 }) +
    box('Debt is a cost deferred', 'to a moment when it will be someone else\'s problem — frequently your own.', 'lam') },

  { t: 'Three debts this project paid, with receipts', to: true, giua: true, body: steps([
    '<b>A GIPHY key in the client bundle</b> — fast at first; then a revoked key, 403s in production and a proxy to write. Now a rule: a third-party key is NEVER NEXT_PUBLIC_ (17.4)',
    '<b>Class "dark" for the global theme</b> — right with one theming system; then it switched on every Tailwind dark: style inside Notes and broke its own 3-theme switcher. The global class is now theme-dark',
    '<b>Schema drifting from the migration history</b> — one manual fix on production; then P3009 BLOCKED every later deploy until migrations were resolved by hand',
  ]) + box('Every one was a reasonable local decision', 'that became expensive at a distance. That is what debt is — not carelessness.', 'cam') },

  { t: 'A real trap: the debt that works', to: true, giua: true, body: two(box('Ugly code announces itself', 'Everyone sees it, complains about it, and knows where it is.', 'lam'), box('Wrong structure stays silent', 'A subtly wrong schema serves requests correctly for a year while every feature built on top inherits the flaw.', 'do2')) +
    flow([{ t: 'year 1', s: 'works fine', mau: NODE }, { t: 'year 2', s: 'hundreds of migrations on top', mau: CAM }, { t: 'the day it hurts', s: 'a rewrite, not a fix', mau: DO }], { h: 130 }) +
    box('By the time it hurts', 'there are hundreds of migrations and millions of rows resting on it. Spend your slow thinking on the schema.', 'cam') },

  { t: 'How cuongthai.com does it', to: true, giua: true, body: TT('c18/decisions', 12, 19, 'the project\'s own CLAUDE.md at commit 9076fb918 · real', { n: 104, hl: [2, 4, 6, 8], sm: false }) +
    two(box('Scars written as rules', '21 "Known Error Patterns" rows and 9 NEVER rules ("never run migrate reset", "never auto-resolve a failed migration").', 'xanh'), box('Read before every change', 'It lives next to the code and is read before each change — a record is only useful where the decision is made.', 'lam')) },

  { t: 'Exercise', to: true, giua: true, body: box('Exercise', 'Your Notes API is about to launch. (1) Sort these into one-way and two-way doors: the logging library · note ids in public URLs · the pool size · storing created_at as timestamp (no time zone) · the API response shape for /notes. (2) Write the "Revisit when:" line for: "We cache /notes in process memory, not Redis." (3) Is a 2,000-line, never-edited admin export script debt?', '') +
    box('Hint', 'Slides 3, 6 and 9.', 'lam') +
    `<div data-k="dapan">${box('Answer', '(1) One-way: ids in public URLs, timestamp without time zone, the public response shape. Two-way: the logging library, the pool size. (2) "Revisit when: a second process or container appears (copies diverge, 16.4), or stale reads become unacceptable." (3) Not by itself: if it makes no future change expensive, it is not debt — leave it alone.', 'xanh')}</div>` },

  { t: 'Lesson 18.5 in one table', to: true, giua: true, body: bang(['', 'seen here', 'the rule'], [
    ['two-way doors', 'library, folders, pool size', 'decide fast'],
    ['one-way doors', 'schema, public API, auth, ids, time types', 'decide slowly, write down why'],
    ['a good comment', 'decision · cost · mitigation · REVISIT WHEN', 'the last line makes it readable'],
    ['debt', '50 routes skipping the service; not the seed file', '"what does this make expensive?"'],
    ['records', '21 known errors · 9 NEVER rules, next to the code', 'record where decisions are made'],
  ], { co: 22 }) + box('Next: 18.6 — eighteen chapters, one system', 'The whole course as one map, the five ideas that keep recurring, and a checklist for your first production deploy.', 'lam') },
]);
