/**
 * api-lab-9 — API Design · Chapter 9 · Lab 9 "Notes feed" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: content/courses/api-design/s09-du-lieu.mjs › api-9-6-lab. Output = chạy thật 200.000 ghi chú, replica + token.
 */
import { lamDeck, sql, http, two, box, cards } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 9 — Data at scale', bai: 'Lab 9' };

export const deck = { key: 'api-lab-9', code: 'API Lab 9', title: 'Lab 9 — Notes feed', sub: 'Cacheable, consistent, ready to shard' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'Lab 9: a notes feed<br>ready for scale', sub: 'Change the contract, measure every step.' },

  { t: 'Starting point and six tasks', to: true, giua: true, body: http(`# lab_1 has 200,000 notes; starter: ?page=N with OFFSET, ids note_N
Server-Timing: db;dur=7.10, total;dur=9.97      (page 1)
Server-Timing: db;dur=10.37, total;dur=11.16    (page 5000)
["note_200003","note_200002"]                   ← announces ~200,000 notes`, { sm: true, wrap: 'any' }) + cards([
    ['1 · Measure (1)', 'timings + what the ids reveal'],
    ['2 · Public IDs (2)', 'public_id uuid DEFAULT uuidv7()'],
    ['3 · Cursor (2)', '?cursor= + Link rel=next; 400 if malformed'],
    ['4 · Revalidation (2)', 'cheap ETag ⇒ 304 before the page query'],
    ['5 · Consistency (1)', 'keep the token; Vary: LabFlow-Consistency'],
    ['6 · Contract (2)', 'OpenAPI + an SLO line'],
  ]) },

  { t: 'The reference solution', body: sql(`await primary.query(\`ALTER TABLE lab_notes
  ADD COLUMN IF NOT EXISTS public_id uuid NOT NULL DEFAULT uuidv7()\`);
await primary.query(\`CREATE INDEX IF NOT EXISTS lab_notes_lab_public ON lab_notes (lab_id, public_id DESC)\`);

const { rows: [top = {}] } = await db.query(          // ETag: newest note of the lab (one index lookup)
  'SELECT public_id::text AS newest FROM lab_notes WHERE lab_id = $1
   ORDER BY public_id DESC LIMIT 1', [lab]);
const tag = \`"notes-\${lab}-\${top.newest ?? 'none'}-\${cursor ?? 'first'}"\`;
res.set('ETag', tag).set('Cache-Control', 'public, max-age=5').vary('LabFlow-Consistency');
if (inm && inm.split(',').map((x) => x.trim()).includes(tag)) return res.status(304).end();
const { rows } = await (cursor
  ? db.query('SELECT * FROM lab_notes WHERE lab_id = $1 AND public_id < $2
      ORDER BY public_id DESC LIMIT 21', [lab, cursor])
  : db.query('SELECT * FROM lab_notes WHERE lab_id = $1 ORDER BY public_id DESC LIMIT 21', [lab]));`, { lang: 'javascript', sm: true, hl: [5, 9, 10] }) + two(box('✗ max(public_id)', 'PostgreSQL has no max() for uuid — use ORDER BY … DESC LIMIT 1.', 'do2'), box('✗ res.set(\'Vary\', …)', 'Replaces Vary: Origin from CORS. res.vary() appends.', 'do2')) },

  { t: 'Measured', giua: true, body: two(http(`# first page
ETag: "notes-lab_1-01a19479-e24a-7763-…-first"
Cache-Control: public, max-age=5
Vary: Origin, LabFlow-Consistency, Accept-Encoding
Link: </v2/labs/lab_1/notes?cursor=01a19479-…>; rel="next"
Server-Timing: etag;dur=0.55, db;dur=0.72, total;dur=2.08
# 100,000 notes deep
Server-Timing: etag;dur=0.67, db;dur=0.62, total;dur=1.80
# If-None-Match
HTTP/1.1 304 Not Modified
Server-Timing: etag;dur=0.52, total;dur=0.86`, { sm: true, wrap: 'any' }), box('Deep = first', 'The cursor is an index position: 1.8 ms 100,000 notes in.', 'xanh') + box('Polling is cheap', 'A 304 costs one index lookup — no db step.', 'xanh') + box('Finding', 'The first note’s UUIDv7 says 07:19:38 — the ALTER TABLE time. Backfilled v7 ids carry the migration time; use uuidv7(created_at - now()).', 'lam')) },

  { t: 'Rubric (10 points)', to: true, giua: true, body: cards([
    ['Measure — 1', 'Both timings with the command; the count leak named.'],
    ['Public IDs — 2', 'uuidv7 + unique index; no note_N in responses; old ids ⇒ 404.'],
    ['Cursor — 2', 'Order, Link + page.next, 400 on bad cursor, deep page fast.'],
    ['Revalidation — 2', '304 without db; a new note changes the ETag.'],
    ['Consistency — 1', 'Token reads work; Vary explained.'],
    ['Contract — 2', 'OpenAPI lints; SLO line matches measurements.'],
  ]) + box('Download', 'labflow-api-ch9.zip — chapter code = this lab’s solution, plus lab/notes-starter.js.', 'lam') },
]);
