/**
 * pg-09-2 — PostgreSQL · Chapter 9 · Lesson 9.2 "Which columns, composite indexes & covering" (slide EN, kiểu FU, 25/10/2026, agent c9).
 * Nguồn: content/courses/postgresql/s09-chi-muc.mjs › postgresql-9-2-to-hop-covering. Output = chạy thật PostgreSQL 17.11
 * (video-bai-giang/src/khung/pg/that/pg-09-2*.sql/.out.txt; bản COSTS OFF 2b/2c dựng lại trạng thái bài 9.2 bằng DROP tạm trong BEGIN … ROLLBACK;
 * CT Shop: pg-09-ctshop — chỉ đọc + BEGIN … ROLLBACK). Đọc từ pg-09-out.mjs (sinh tự động).
 * Bổ sung so với bài web: chỉ mục một cột vẫn phải Sort; PG17 hỏi riêng cột thứ hai vẫn có thể "đi" chỉ mục nhưng ĐỌC HẾT 1.921 trang (không nhảy);
 * chỉ mục (user_id) thừa khi đã có (user_id, created_at); bằng trước – khoảng sau đo 1.081 vs 15 trang; INCLUDE không tìm được;
 * visibility map + VACUUM (Heap Fetches 500 → 0); BitmapAnd; CT Shop thiếu chỉ mục ở 7 cột khoá ngoại; Prisma @@index thật của CuongThai.
 */
import { lamDeck, sql, psql, two, box, cards, steps, kw, vsd, c } from './_pg-chung.mjs';
import { O } from './pg-09-out.mjs';
import { phoneBook, compLeaf, eqRange, vmPic, barsPages } from './pg-09-hinh.mjs';

export const deck = { key: 'pg-09-2', code: 'PG 9.2', title: 'Which columns, composite indexes & covering', sub: 'Column order is everything' };

const dai = (t) => Math.max(...String(t).split('\n').map((l) => l.length));
const P = (t, o = {}) => { const z = Math.min(o.max ?? 1.25, (o.w ?? 1100) / (dai(t) * 0.602 * 14 + 32)); return `<div style="zoom:${z.toFixed(3)}">${psql(t, { sm: true, ...o })}</div>`; };
/** psql xuống dòng (dòng EXPLAIN quá dài): giữ chữ to, gói dòng thay vì thu nhỏ. */
const PW = (t, o = {}) => `<div class="c9w" style="zoom:${o.z ?? 1}">${psql(t, { sm: true, ...o })}</div>`;
const S = (src, o = {}) => { const z = Math.min(o.max ?? 1.3, (o.w ?? 1100) / (dai(src) * 0.602 * 15 + 30)); return `<div style="zoom:${z.toFixed(3)}">${sql(src, { sm: true, ...o })}</div>`; };
const p = (t, fs = 22) => `<p style="font-size:${fs}px;margin:0">${t}</p>`;
const WRAP = `<style>.c9w .term pre{white-space:pre-wrap;word-break:break-all}</style>`;
const Q5 = `SELECT id, created_at, amount FROM event
WHERE user_id = 42 ORDER BY created_at DESC LIMIT 5;`;

export const slides = lamDeck({ chuong: 'Chapter 9 — Indexes', bai: '9.2' }, [
  { cover: true, t: 'Which columns,<br>composite indexes & covering', sub: 'One index can filter, sort and even answer the query —<br>if the columns are in the right order.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Which columns deserve an index — and why foreign keys are the forgotten ones</li>
<li>A <b>composite</b> (multi-column) index that serves the filter <b>and</b> the sort at once</li>
<li>The <b>leftmost-prefix rule</b> and “<b>equality first, range last</b>” — measured in pages</li>
<li><b>Covering</b> indexes with <code class="i">INCLUDE</code>, the <b>Index Only Scan</b>, and the visibility map</li>
<li>Real cases: CT Shop’s missing indexes, CuongThai’s Prisma <code class="i">@@index</code></li>
</ul>` },

  { t: 'Which columns deserve an index?', to: true, giua: true, body: `
${cards([['WHERE', 'Columns you <b>filter</b> on, when the filter keeps few rows: <code class="i">email = …</code>, <code class="i">user_id = …</code>'],
['JOIN … ON', 'Columns you <b>join</b> on — above all the <b>foreign-key column</b> of the child table'],
['ORDER BY', 'Columns you <b>sort</b> by with a <code class="i">LIMIT</code> — the index hands rows over already sorted']], 3)}
${box('Not every column', 'Each index costs disk and slows <b>every</b> INSERT/UPDATE/DELETE (lesson 9.3 measures it). Index what your real queries use — check with EXPLAIN.', 'do2')}
${box('PostgreSQL indexes the PK for you — not the FK', '<code class="i">PRIMARY KEY</code>/<code class="i">UNIQUE</code> ⇒ automatic index. <code class="i">REFERENCES</code> ⇒ <b>no</b> index on the child column. You add it.', 'lam')}` },

  { t: 'Everyday example first: a phone book', giua: true, body: `${phoneBook()}
${box('Our index', '<code class="i">(user_id, created_at)</code> is this phone book: <b>user</b> = surname, <b>time</b> = given name. “User 42, newest first” = one block, already in order.', 'lam')}` },

  { t: '“The 5 latest events of user 42” — no helpful index', body: `
${P(`pgcourse=# EXPLAIN (ANALYZE, BUFFERS, COSTS OFF) ${Q5.replace('\n', ' ')}\n${O.c2_seq}`, { hl: [6, 10, 11, 12], max: 0.95 })}
${p('Two costs: a <b>Seq Scan</b> over all ~7,940 pages throws away 499,500 rows, then a <b>Sort</b> (top-N heapsort) orders the 500 survivors to keep 5.', 21)}` },

  { t: 'An index on user_id alone: no Seq Scan, still a Sort', body: `
${P(`pgcourse=# CREATE INDEX idx_event_user ON event(user_id);   -- one column\nCREATE INDEX\npgcourse=# EXPLAIN (ANALYZE, BUFFERS, COSTS OFF) …same query…\n${O.c2_single}`, { hl: [8, 12, 14], max: 0.9 })}
${p('Better — the index finds user 42’s rows (490 pages instead of ~7,940). But they come out in <b>table order</b>, not time order, so PostgreSQL still fetches all 500 and <b>sorts</b> them to keep 5.', 21)}` },

  { t: 'A composite index: filter and sort in one', body: `
${P(`pgcourse=# CREATE INDEX idx_event_user_created ON event(user_id, created_at);\nCREATE INDEX\npgcourse=# EXPLAIN (ANALYZE, BUFFERS, COSTS OFF) …same query…\n${O.c2_comp}`, { hl: [6, 7, 8], max: 0.92 })}
${two(P(O.rows42, { w: 470, max: 0.9, title: 'result (same query, no EXPLAIN)' }), box('No Sort node · 8 pages · 0.044 ms', 'Index Scan <b>Backward</b>: walks from the <b>newest</b> entry of user 42 towards older ones and stops at 5.', 'xanh'), 'r46')}
` },

  { t: 'Why the Sort disappeared', giua: true, body: `
${compLeaf()}
${box('Order of the columns = order of the leaves', 'Sorted by <code class="i">user_id</code> first, then by <code class="i">created_at</code> <b>inside</b> each user. “Newest 5 of user 42” is one contiguous run — read it from its end.', 'xanh')}` },

  { t: 'The leftmost-prefix rule: asking for column 2 alone', body: `
${two(`<div>${S(`-- only the SECOND column of (user_id, created_at)
EXPLAIN (ANALYZE, BUFFERS, COSTS OFF)
SELECT id, user_id FROM event
WHERE created_at = '2024-06-22 14:40:00+00';`, { w: 560 })}${PW(O.c2_second, { hl: [3, 5] })}</div>`,
`<div>${p('<b>PostgreSQL 17 picked the index — but read 1,921 of its pages</b>: the whole thing. With <code class="i">user_id</code> missing, there is no place to <b>jump</b> to; it can only walk every leaf and test each entry.', 20)}
${barsPages({ rows: [['Seq Scan', 7937, '#c0392b'], ['whole index', 1921, '#e08a1e'], ['real seek', 4, '#2f7d4f']], max: 7937, w: 530, lw: 190, fs: 18 })}
${box('Rule', 'An index on <code class="i">(a, b)</code> can <b>seek</b> on <code class="i">a</code>, or on <code class="i">a</code> and <code class="i">b</code> — never on <code class="i">b</code> alone.', 'do2')}</div>`)}
${WRAP}` },

  { t: 'What (a, b, c) can and cannot serve', body: `
<table class="t" style="font-size:19px"><tr><th>WHERE …</th><th>index (a, b, c)</th><th>why</th></tr>
<tr><td><code class="i">a = 1</code></td><td class="xanh">✓ seek</td><td>left prefix</td></tr>
<tr><td><code class="i">a = 1 AND b = 2</code></td><td class="xanh">✓ seek</td><td>left prefix</td></tr>
<tr><td><code class="i">a = 1 AND c = 3</code></td><td>◐ seek on a, then test c</td><td>c is checked inside a’s block, cannot narrow the jump</td></tr>
<tr><td><code class="i">b = 2</code> or <code class="i">c = 3</code></td><td class="do">✗ no seek</td><td>missing the leading column</td></tr></table>
${P(`pgcourse=# EXPLAIN ANALYZE SELECT count(*) FROM event WHERE user_id = 42;   -- after DROP INDEX idx_event_user\n${O.count42}`, { hl: [5, 7], max: 0.85 })}
${box('So drop the single-column index', '<code class="i">(user_id, created_at)</code> already serves <code class="i">WHERE user_id = 42</code> (Index Only Scan): a separate <code class="i">(user_id)</code> index is <b>redundant</b> and only slows writes.', 'xanh')}` },

  { t: 'Equality first, range last', giua: true, body: `
${eqRange()}
${p('Same rows, same two columns, opposite order: <b>1,081 pages vs 15 pages</b>. Once the index meets a <b>range</b> column, the columns after it can no longer narrow the jump.', 21)}` },

  { t: 'Measured: (created_at, status) vs (status, created_at)', body: `
${PW(`-- index (created_at, status)\n${O.c2_eq1.split('\n').slice(0, 8).join('\n')}\n …`, { hl: [5, 6, 7], z: 0.92 })}
${PW(`-- index (status, created_at)\n${O.c2_eq2.split('\n').slice(0, 8).join('\n')}\n …`, { hl: [5, 6, 7], z: 0.92 })}
${p('Same answer (2,812 rows), <b>1,081 pages vs 15 pages</b>, 14.6 ms vs 0.46 ms. Look at the order inside <code class="i">Index Cond</code>: it follows the index columns.', 20)}
${WRAP}` },

  { t: 'Covering index: INCLUDE ⇒ Index Only Scan', body: `
${PW(`pgcourse=# EXPLAIN (ANALYZE, BUFFERS) SELECT user_id, sum(amount) FROM event WHERE user_id = 42 GROUP BY user_id;\n-- before (amount lives only in the table) — excerpt\n${O.cov1.split('\n').slice(0, 7).join('\n')}`, { hl: [6, 7, 9], z: 0.9 })}
${PW(`pgcourse=# CREATE INDEX idx_event_user_incl ON event(user_id) INCLUDE (amount);\n-- after, same SELECT — excerpt\n${O.cov2.split('\n').slice(0, 7).join('\n')}`, { hl: [6, 7, 9], z: 0.9 })}
${p('<b>505 pages → 6 pages.</b> The Bitmap Heap Scan had to open 500 table pages to read <code class="i">amount</code>; now <code class="i">amount</code> sits in the index leaf: <code class="i">Heap Fetches: 0</code>.', 20)}
${WRAP}` },

  { t: 'What INCLUDE does — and does not do', body: `
${two(`<ul style="font-size:21px">
<li>Key columns (<code class="i">user_id</code>) are <b>searched and sorted</b>; INCLUDE columns (<code class="i">amount</code>) are just <b>carried</b> in the leaf</li>
<li>So a query needing only <code class="i">user_id</code> + <code class="i">amount</code> is answered from the index: <b>505 → 6 pages</b>, <code class="i">Heap Fetches: 0</code></li>
<li>You <b>cannot search</b> by an INCLUDE column (right) — it is not part of the sorted key</li>
<li>Use it for a <b>hot query</b> that reads 1–2 extra small columns. Not for wide columns: every copy costs disk</li>
</ul>`, `<div>${P(O.incl_search, { w: 520, hl: [3, 4] })}
${P(`\\d event   -- indexes part\n${O.dEvent2.split('\n').slice(-5).join('\n')}`, { w: 520, hl: [6] })}</div>`, 'r64')}` },

  { t: '“Heap Fetches”: the visibility map', body: `
${vmPic()}
${PW(`UPDATE event SET amount = amount + 1 WHERE user_id = 42 AND id < 250000;\n${O.upd}\n-- same SELECT user_id, sum(amount) … again:\n${O.vm1.split('\n').slice(0, 7).join('\n')}\n …`, { hl: [7, 10], z: 0.92 })}
${p('An Index Only Scan may skip the table <b>only on pages marked all-visible</b>. Right after an UPDATE, those pages lose the mark: <code class="i">Heap Fetches: 500</code>, 262 pages read.', 20)}
${WRAP}` },

  { t: 'VACUUM sets the marks again', body: `
${vmPic({ sau: true })}
${PW(`VACUUM event;\n-- same SELECT again:\n${O.vm2.split('\n').slice(0, 7).join('\n')}\n …`, { hl: [6, 9], z: 0.92 })}
${p('After <code class="i">VACUUM</code>: <b>Heap Fetches: 0</b>, 7 pages. <b>autovacuum</b> does this for you in the background; on a table updated non-stop, Index Only Scans quietly turn into “index + heap” scans. Chapter 14 covers vacuum.', 20)}
${WRAP}` },

  { t: 'Trap: one index per column ≠ one composite index', body: `
${two(`<div>${S(`CREATE INDEX idx_e_user   ON event(user_id);
CREATE INDEX idx_e_status ON event(status);
EXPLAIN (ANALYZE, COSTS OFF) SELECT id FROM event
WHERE user_id = 42 AND status = 'pending';`, { w: 560 })}${PW(O.c2_band, { hl: [5, 6, 8] })}</div>`,
`<div>${p('PostgreSQL <b>can</b> combine two indexes: two Bitmap Index Scans (500 rows and 5,000 rows) merged with <b>BitmapAnd</b>, then the table is re-checked. (User 42 happens to have no pending rows.)', 20)}
${box('But', 'It reads both indexes in full for those values, builds two bitmaps, often decides not to bother — and <b>three single indexes slow every write</b>. Build the one composite index the query needs: <code class="i">(user_id, status)</code>.', 'do2')}</div>`)}
${WRAP}` },

  { t: 'CT Shop: which foreign keys have no index?', body: `
${two(S(`SELECT c.conrelid::regclass AS child_table,
       a.attname AS fk_column,
       c.confrelid::regclass AS parent
FROM pg_constraint c
JOIN pg_attribute a ON a.attrelid = c.conrelid
                   AND a.attnum = c.conkey[1]
WHERE c.contype = 'f'
  AND c.connamespace = 'shop'::regnamespace
  AND NOT EXISTS (SELECT 1 FROM pg_index i
        WHERE i.indrelid = c.conrelid
          AND i.indkey[0] = c.conkey[1])
ORDER BY 1, 2;`, { w: 560 }), P(O.sh_fk, { w: 500, hl: [5] }))}
${p('CT Shop has 13 indexes — <b>all</b> created by PRIMARY KEY/UNIQUE. <b>7 foreign-key columns</b> have none, so “orders of customer 7” and every “delete a customer” check scan the child table. Keep this query: run it on any schema you inherit.', 20)}` },

  { t: 'CT Shop: adding one (inside BEGIN … ROLLBACK)', body: `
${P(`ctshop=# EXPLAIN (ANALYZE, BUFFERS, COSTS OFF, SUMMARY OFF) SELECT id, status, created_at FROM orders WHERE customer_id = 7 ORDER BY created_at DESC LIMIT 5;\n${O.sh_o1b.split('\n').slice(0, 10).join('\n')}\n …`, { hl: [5, 9, 10], max: 0.8, title: 'psql (17.11) — ctshop' })}
${P(`ctshop=# BEGIN; CREATE INDEX idx_orders_customer_created ON orders(customer_id, created_at);\nctshop=*# EXPLAIN … same query …\n${O.sh_o2b.split('\n').slice(0, 9).join('\n')}\n …\nctshop=*# ROLLBACK;`, { hl: [6, 11], max: 0.8, title: 'psql (17.11) — ctshop' })}
${p('<code class="i">orders</code> has only 2,000 rows (15 pages): <b>18 → 10 pages</b>, a tiny gain. Lab 5 grows it to <b>1 million</b> orders — then this index matters.', 19)}
${WRAP}` },

  { t: 'In practice: composite indexes in Prisma (CuongThai)', body: `
${two(S(`model SocialPost {
  // … fields …
  @@index([authorId], name: "idx_social_posts_author")
  @@index([type, createdAt(sort: Desc)],
          name: "idx_social_posts_type_created")
  @@index([authorId, createdAt(sort: Desc)],
          name: "idx_social_posts_author_created")
  @@index([visibility, status, createdAt(sort: Desc)],
          name: "idx_social_posts_vis_status_created")
  @@map("social_posts")
}`, { lang: 'typescript', w: 640 }), `<ul style="font-size:20px">
<li>Every feed tab is “<b>filter = …, newest first</b>”: equality columns, then <code class="i">createdAt DESC</code> last</li>
<li><code class="i">(authorId)</code> next to <code class="i">(authorId, createdAt)</code> is the <b>redundant pair</b> from this lesson — a candidate to drop after checking <code class="i">pg_stat_user_indexes</code> (9.3)</li>
<li>Prisma has no <code class="i">INCLUDE</code> syntax: a covering index is written in the migration SQL by hand</li>
</ul>`, 'r64')}
${box('Habit', 'For every <code class="i">@relation(fields: [xId] …)</code> add <code class="i">@@index([xId])</code> — unless a composite index that <b>starts</b> with <code class="i">xId</code> already exists.', 'xanh')}` },

  { t: 'Exercise', to: true, giua: true, body: `
<ol>
<li>Show user 42’s events in <b>June 2024</b>, newest first. Which index from this lesson serves it, and is there a Sort?</li>
<li>Now only the <b>total amount</b> of those June events. Design an index that answers it <b>without touching the table</b>.</li>
</ol>
${box('Hint', 'Equality first, range last. Then: which column is missing for an Index Only Scan?', '')}` },

  { t: 'Solution (1): the June list', body: `
${P(`pgcourse=# -- user 42, June 2024, newest first — served by the existing (user_id, created_at)\n${O.ex2a_w}`, { hl: [7, 13, 14], max: 1.0 })}
${p('One <b>seek</b> to user 42 + the June range (<code class="i">Index Cond</code> holds both columns), then a tiny Sort of 44 rows — a Bitmap Heap Scan returns them in page order. 52 pages instead of ~7,940.', 20)}` },

  { t: 'Solution (2): a covering index for the June total', body: `
${P(`pgcourse=# -- before: the sum must open the table pages\n${O.ex2b_w.split('\n').slice(0, 5).join('\n')}\n …`, { hl: [5, 6], max: 0.95 })}
${P(`pgcourse=# CREATE INDEX idx_event_user_created_incl ON event(user_id, created_at) INCLUDE (amount);\npgcourse=# -- after, same query\n${O.ex2c_w.split('\n').slice(0, 9).join('\n')}`, { hl: [6, 7, 10], max: 0.95 })}
${p('<b>49 pages → 4 pages</b>, Index Only Scan, <code class="i">Heap Fetches: 0</code>. Equality first, range last, and the one extra column carried with <code class="i">INCLUDE</code>.', 20)}` },

  { t: 'Check yourself', to: true, giua: true, body: `
<ol>
<li>An index on <code class="i">(country, city)</code>. Can it seek <code class="i">WHERE city = 'Hue'</code>?</li>
<li>Filter on <code class="i">status =</code> and <code class="i">created_at &gt;=</code>: which column goes first?</li>
<li>Why can an Index Only Scan still report <code class="i">Heap Fetches</code> &gt; 0?</li>
</ol>
${box('Answers', '1 · No — city is not a left prefix; it must walk the whole index. &nbsp;2 · status (equality) first, created_at (range) last. &nbsp;3 · Pages changed since the last VACUUM are not all-visible, so it must check the table.', 'xanh')}` },

  { t: 'Summary & next', to: true, body: `
<ul>
<li>Index what you <b>filter, join and sort</b> on — and add the foreign-key indexes PostgreSQL does not</li>
<li>Composite <code class="i">(a, b)</code>: seeks on <code class="i">a</code> or <code class="i">a + b</code>, never <code class="i">b</code> alone; it also hands rows over <b>sorted</b></li>
<li><b>Equality first, range/sort last</b> (1,081 → 15 pages)</li>
<li><code class="i">INCLUDE</code> ⇒ Index Only Scan; it relies on the visibility map that VACUUM maintains</li>
</ul>
${box('Next — 9.3', 'When an index is <b>not</b> used: functions on the column, selectivity, partial indexes — and what every index costs on writes.', 'lam')}` },
]);
