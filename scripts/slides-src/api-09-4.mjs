/**
 * api-09-4 — API Design · Chapter 9 · Lesson 9.4 "Sharding-safe APIs" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: content/courses/api-design/s09-du-lieu.mjs › api-9-3-sharding. Output = chạy thật ids.sql (PostgreSQL 18) + perf/shards.mjs.
 */
import { lamDeck, sql, http, two, three, box, cards, flow } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 9 — Data at scale', bai: '9.4' };

export const deck = { key: 'api-09-4', code: 'API 9.4', title: 'Sharding-safe APIs', sub: 'IDs, pagination and filters' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'IDs, pagination and filters<br>that survive sharding', sub: 'Three API decisions made years<br>before the database is split.' },

  { t: 'bigint, UUIDv4 or UUIDv7?', giua: true, body: two(http(`$ psql … -f ids.sql          # 1,000,000 inserts each
INSERT 0 1000000   Time: 2822.625 ms   (bigint identity)
INSERT 0 1000000   Time: 3639.584 ms   (gen_random_uuid = v4)
INSERT 0 1000000   Time: 3363.353 ms   (uuidv7)
    index    | size
 id_seq_pkey | 21 MB
 id_v4_pkey  | 37 MB
 id_v7_pkey  | 30 MB
SELECT id, uuid_extract_timestamp(id) FROM id_v7 …
 01a19477-6093-7923-… | 2026-11-01 07:16:53.907+07`, { sm: true, wrap: 'any' }), box('Index locality', 'v7 starts with a timestamp: new keys land at the right edge like a counter. v4 is random: 23% bigger index.', 'lam') + box('Times are close on a warm laptop', 'v4 3.6 s vs v7 3.4 s (4.7 vs 3.3 s on another run). The size gap is stable and turns into I/O when the index outgrows RAM.', 'lam') + box('IDs are contract', '<b>bk_10234</b> leaks counts and invites guessing (BOLA). UUIDv7 leaks its <b>creation time</b>.', 'do2')) },

  { t: 'Two shards, split by lab', to: true, giua: true, body: sql(`CREATE TABLE shard0.bookings AS SELECT * FROM bookings WHERE abs(hashtext(lab_id)) % 2 = 0;   -- 540,000
CREATE TABLE shard1.bookings AS SELECT * FROM bookings WHERE abs(hashtext(lab_id)) % 2 = 1;   -- 460,000`, { lang: 'sql', sm: true }) + flow([
    { t: 'request', s: 'names the shard key?' },
    { t: 'yes', s: 'ONE shard', mau: '#2e7d32' },
    { t: 'no', s: 'EVERY shard + merge', mau: '#c0392b' },
  ]) + box('Scatter-gather', 'Cost × number of shards, and the slowest shard decides the response time (the tail, 8.1).', 'lam') },

  { t: 'Page 1000 across two shards', giua: true, body: http(`$ node perf/shards.mjs
offset SAI: mỗi mảnh OFFSET 19980 LIMIT 20       40 dòng ·  6.2 ms
  ⇒ khớp bảng gốc? SAI
offset ĐÚNG: mỗi mảnh LIMIT 20000, gộp, cắt   40000 dòng · 52.4 ms
  ⇒ khớp bảng gốc? ĐÚNG
cursor: mỗi mảnh WHERE (…) < cursor LIMIT 20     40 dòng ·  1.9 ms
  ⇒ khớp bảng gốc? ĐÚNG
có khoá phân mảnh: lab lab_7 ⇒ chỉ shard1       252 dòng ·  0.6 ms
không có khoá: user usr_4536 ⇒ hỏi MỌI mảnh     200 dòng ·  0.8 ms`, { sm: true, wrap: 'any' }) + two(box('Offset across shards', 'Naive: <b>wrong page</b>. Correct: offset + limit from every shard — 40,000 rows to keep 20.', 'do2'), box('Cursor', '20 per shard, merge, keep 20: 1.9 ms on any page, and correct.', 'xanh')) },

  { t: 'API rules that keep sharding possible', to: true, giua: true, body: cards([
    ['1 · IDs generated anywhere', 'UUIDv7 (v4 if time is sensitive); no global counter in the contract.'],
    ['2 · Cursor pagination only', 'Opaque cursor, stable order (time, id); no page numbers.'],
    ['3 · Shard key in the path', '/labs/{labId}/bookings is one shard; global search is a separate endpoint.'],
    ['4 · No exact totals', '“total” means counting every shard on every page (3.1).'],
  ], 2) },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>1M rows: PK index <b>21 / 30 / 37 MB</b> for bigint / UUIDv7 / UUIDv4</li>
<li>Sequential IDs leak counts; UUIDv7 leaks creation time</li>
<li>Page 1000: naive offset <b>wrong</b>, correct offset <b>40,000 rows</b>, cursor <b>40 rows</b> and right</li>
<li>Put the shard key in the path; without it every shard is asked</li>
</ul>
${box('Next', 'Lesson 9.5 — documents or tables, decided by the API’s access patterns.', 'xanh')}` },
]);
