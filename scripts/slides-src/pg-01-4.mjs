/**
 * pg-01-4 — PostgreSQL · Chapter 1 · Lesson 1.4 "How a query flows through Postgres" (slide EN, kiểu FU, 25/10/2026).
 * Nguồn: content/courses/postgresql/s01-vi-sao.mjs › postgresql-1-4-dong-chay-truy-van. Output = chạy thật PostgreSQL 17.11 (pgcourse17):
 * video-bai-giang/src/khung/pg/that/pg-01-4b.out.txt (+ pg-01-4c.out.txt). Số cost/time có thể lệch bản web (15.4) — chỉ khác số đo, không khác kết quả.
 */
import { lamDeck, sql, psql, run, tbl, two, box, steps, cards, kw, flow, vsd } from './_pg-chung.mjs';

export const deck = { key: 'pg-01-4', code: 'PG 1.4', title: 'How a query flows through Postgres', sub: 'Parser → rewriter → planner → executor' };
const zm = (h, z = 1.3) => `<div style="zoom:${z}">${h}</div>`;

/* Bếp nhà hàng. */
const kitchen = () => `<svg viewBox="0 0 1110 300" width="1110" height="300" font-family="Arial">
  <defs><marker id="mk" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#b85a2b"/></marker></defs>
  ${[
    ['🧾', 'Your order', 'what you want', '#e08a1e', 'k-order'],
    ['🧐', 'Waiter checks', 'readable? on the menu?', '#336791', 'k-waiter'],
    ['📖', 'House rules', '“today’s set” = 3 dishes', '#7c3aed', 'k-rules'],
    ['👨‍🍳', 'Head chef plans', 'cheapest order of work', '#c0392b', 'k-chef'],
    ['🍳', 'Cooks do it', 'chop · fry · plate', '#2f7d4f', 'k-cook'],
  ].map(([e, t, s, m, k], i) => { const x = 8 + i * 220; return `<g data-k="${k}"><rect x="${x}" y="40" width="200" height="190" rx="14" fill="#fff" stroke="${m}" stroke-width="3.5"/>
  <text x="${x + 100}" y="110" text-anchor="middle" font-size="64">${e}</text><text x="${x + 100}" y="152" text-anchor="middle" font-size="20" font-weight="800" fill="${m}">${t}</text><text x="${x + 100}" y="182" text-anchor="middle" font-size="15" fill="#555">${s}</text></g>${i < 4 ? `<path d="M${x + 202},135 L${x + 216},135" stroke="#b85a2b" stroke-width="3" marker-end="url(#mk)"/>` : ''}`; }).join('')}
  <text x="555" y="270" text-anchor="middle" font-size="21" font-weight="700" fill="#555">…and the dish comes back to your table 🍽️</text>
</svg>`;

/* Cây phân tích cú pháp (đơn giản hoá). */
const parseTree = () => `<svg viewBox="0 0 1110 260" style="width:760px;height:178px" font-family="Arial">
  <g stroke="#b85a2b" stroke-width="2.5" fill="none"><path d="M555,52 L240,120"/><path d="M555,52 L555,120"/><path d="M555,52 L870,120"/><path d="M240,160 L240,196"/><path d="M555,160 L555,196"/><path d="M870,160 L870,196"/></g>
  ${[[555, 30, 'SelectStmt', '#336791', 'p-root'], [240, 140, 'targetList', '#2f7d4f', 'p-target'], [555, 140, 'fromClause', '#e08a1e', 'p-from'], [870, 140, 'whereClause', '#c0392b', 'p-where']].map(([x, y, t, m, k]) => `<g data-k="${k}"><rect x="${x - 110}" y="${y - 22}" width="220" height="44" rx="10" fill="#fff" stroke="${m}" stroke-width="3"/><text x="${x}" y="${y + 8}" text-anchor="middle" font-size="22" font-weight="800" fill="${m}" font-family="Menlo,monospace">${t}</text></g>`).join('')}
  ${[[240, 'title', 'column'], [555, 'notes', 'table'], [870, 'pinned', 'column = true']].map(([x, t, d]) => `<rect x="${x - 100}" y="196" width="200" height="50" rx="10" fill="#fffaf0" stroke="#999" stroke-width="2"/><text x="${x}" y="226" text-anchor="middle" font-size="22" font-weight="700" fill="#333" font-family="Menlo,monospace">${t}</text><text x="${x}" y="258" text-anchor="middle" font-size="15" fill="#777">${d}</text>`).join('')}
</svg>`;

/* Executor kéo từng dòng. */
const pull = () => `<svg viewBox="0 0 1110 230" width="1110" height="230" font-family="Arial">
  <defs><marker id="mp" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#b85a2b"/></marker></defs>
  ${[[20, '👤 Client', 'wants rows', '#e08a1e', 'x-client'], [290, 'Filter', 'keep pinned', '#c0392b', 'x-filter'], [560, 'Seq Scan', 'read table pages', '#336791', 'x-scan'], [830, '💾 Table', 'data pages on disk', '#2f7d4f', 'x-disk']].map(([x, t, s, m, k]) => `<g data-k="${k}"><rect x="${x}" y="60" width="240" height="110" rx="14" fill="#fff" stroke="${m}" stroke-width="3.5"/><text x="${x + 120}" y="108" text-anchor="middle" font-size="25" font-weight="800" fill="${m}">${t}</text><text x="${x + 120}" y="142" text-anchor="middle" font-size="17" fill="#555">${s}</text></g>`).join('')}
  <g stroke="#b85a2b" stroke-width="3" fill="none" marker-end="url(#mp)"><path d="M262,95 L288,95" marker-end="url(#mp)"/><path d="M532,95 L558,95" marker-end="url(#mp)"/><path d="M802,95 L828,95" marker-end="url(#mp)"/></g>
  <text x="275" y="50" text-anchor="middle" font-size="16" font-weight="800" fill="#b85a2b">“next row?”</text><text x="545" y="50" text-anchor="middle" font-size="16" font-weight="800" fill="#b85a2b">“next row?”</text><text x="815" y="50" text-anchor="middle" font-size="16" font-weight="800" fill="#b85a2b">“next page?”</text>
  <g stroke="#2f7d4f" stroke-width="3" fill="none" stroke-dasharray="8 5"><path d="M816,145 L802,145" marker-end="url(#mp)"/><path d="M546,145 L532,145" marker-end="url(#mp)"/><path d="M276,145 L262,145" marker-end="url(#mp)"/></g>
  <text x="555" y="212" text-anchor="middle" font-size="19" font-weight="700" fill="#2f7d4f">rows flow back up one at a time — the client can start reading before the scan ends</text>
</svg>`;

/* Hai cột thời gian. */
const bars = () => `<svg viewBox="0 0 1110 240" width="1110" height="240" font-family="Arial">
  <text x="20" y="50" font-size="22" font-weight="800" fill="#c0392b">Seq Scan</text><rect x="190" y="26" width="800" height="40" rx="8" fill="#c0392b"/><text x="1000" y="54" font-size="24" font-weight="800" fill="#c0392b">7.015 ms</text>
  <text x="20" y="130" font-size="22" font-weight="800" fill="#2f7d4f">Index Scan</text><rect x="190" y="106" width="24.6" height="40" rx="6" fill="#2f7d4f"/><text x="232" y="134" font-size="24" font-weight="800" fill="#2f7d4f">0.216 ms</text>
  <text x="555" y="205" text-anchor="middle" font-size="22" font-weight="700" fill="#555">same query · 200,000 rows · 202 pinned rows · ≈ 32× faster</text>
</svg>`;

export const slides = lamDeck({ chuong: 'Chapter 1 — Why PostgreSQL exists', bai: '1.4' }, [
  { cover: true, t: 'How a query flows<br>through Postgres', sub: 'Parse · rewrite · plan · execute —<br>and how to watch it happen with EXPLAIN.' },

  { t: 'What you will get from this lesson', to: true, body: `
<ul>
<li>The <b>four stations</b> every SQL statement passes through</li>
<li>Where a <b>typo</b> is caught — and where a <b>view</b> disappears</li>
<li>How the <b>planner</b> chooses between several ways to get the same rows</li>
<li>How to <b>watch</b> it: <code class="i">EXPLAIN</code> and <code class="i">EXPLAIN ANALYZE</code> (only an introduction — Chapter 10 goes deep)</li>
<li>The first big win: the same query, <b>32× faster</b> with an index</li>
</ul>
${box('Where we are', 'Lesson 0.4: SQL is <b>declarative</b> — you say what you want, the server decides how. Today we open the box and see <b>how</b>.', 'lam')}` },

  { t: 'Everyday example first: a restaurant kitchen', body: `
${kitchen()}
<p style="font-size:23px;margin:0">You never tell the kitchen <i>how</i> to cook; you place an order. Someone checks it is readable, applies house rules, a chef plans the cheapest sequence of work, cooks do it, and the dish returns. A database query takes the same journey.</p>` },

  { t: 'Five stations of a query', body: `
${flow([
  { t: '1 · Parse', s: 'syntax → tree', mau: '#336791' },
  { t: '2 · Rewrite', s: 'expand views', mau: '#7c3aed' },
  { t: '3 · Plan', s: 'pick the cheapest', mau: '#c0392b' },
  { t: '4 · Execute', s: 'run the plan', mau: '#2f7d4f' },
  { t: '5 · Return', s: 'rows to client', mau: '#e08a1e' },
], { h: 150, fs: 21 })}
<table class="t" style="font-size:20px">
<tr><th style="width:120px">Station</th><th>What it does</th><th style="width:330px">How it can fail</th></tr>
<tr><td><b>Parse</b></td><td>reads the SQL text, checks grammar, resolves names</td><td>syntax error · unknown column</td></tr>
<tr><td><b>Rewrite</b></td><td>applies rules — e.g. replaces a view by its definition</td><td>(rarely visible)</td></tr>
<tr><td><b>Plan</b></td><td>considers strategies, picks the lowest estimated cost</td><td>a bad plan = a slow query</td></tr>
<tr><td><b>Execute</b></td><td>runs the chosen plan on data pages</td><td>constraint violation · divide by zero</td></tr>
</table>` },

  { t: 'Station 1 — Parse: is it valid SQL?', body: `
${zm(two(`<div><div class="tcap">Typo in a keyword</div>` + psql(`SELEC title FROM notes;
ERROR:  syntax error at or near "SELEC"
LINE 1: SELEC title FROM notes;
        ^`, { sm: true }) + `</div>`, `<div><div class="tcap">Unknown column</div>` + psql(`SELECT titel FROM notes;
ERROR:  column "titel" does not exist
LINE 1: SELECT titel FROM notes;
               ^
HINT:  Perhaps you meant to reference
       the column "notes.title".`, { sm: true }) + `</div>`), 1.0)}
<div style="text-align:center"><div class="tcap">After parsing, the text is a tree (simplified)</div>${parseTree()}</div>
<p style="font-size:21px;margin:0">Errors here happen <b>before</b> any data is touched — the caret <code class="i">^</code> points at the exact spot, and even the <b>HINT</b> comes from this station.</p>` },

  { t: 'Station 2 — Rewrite: a view melts away', body: `
${zm(sql(`CREATE VIEW pinned_notes AS
  SELECT id, title FROM notes WHERE pinned;`, { sm: true }), 1.2)}
${zm(two(`<div><div class="tcap">EXPLAIN SELECT title FROM <b>pinned_notes</b>;</div>` + psql(` Seq Scan on notes  (cost=0.00..1.03 rows=2 width=13)
   Filter: pinned`, { sm: true, title: 'the view' }) + `</div>`,
`<div><div class="tcap">EXPLAIN SELECT title FROM <b>notes</b> WHERE pinned = true;</div>` + psql(` Seq Scan on notes  (cost=0.00..1.03 rows=2 width=13)
   Filter: pinned`, { sm: true, title: 'the table directly' }) + `</div>`), 1.1)}
${box('Same plan, to the letter', 'The rewriter replaced <code class="i">pinned_notes</code> by its definition <b>before</b> planning, so the planner never saw a view. (Views — Chapter 12.)', 'lam')}
${cards([['Why it matters', 'A view adds <b>no extra cost</b> at run time: it is a saved name for a query, expanded in place.'], ['Also here', 'Rules and row-level security policies are applied at this station too.']], 2)}` },

  { t: 'Station 3 — Plan: several ways, one winner', body: `
<p style="font-size:23px;margin:0">200,000 notes, 202 of them pinned. To find the pinned ones PostgreSQL could read <b>every row</b>, or jump through an <b>index</b>. The planner puts a <b>cost</b> on each way and picks the lowest:</p>
${zm(two(`<div style="border:3px solid #c0392b;border-radius:12px;padding:8px 12px"><div class="tcap" style="color:#c0392b">Way A — read the whole table</div>` + psql(` Seq Scan on notes
   (cost=0.00..3471.03 rows=240 width=11)`, { sm: true, title: 'forced: indexes off' }) + `</div>`,
`<div style="border:3px solid #2f7d4f;border-radius:12px;padding:8px 12px"><div class="tcap" style="color:#1f6b40">Way B — use the index ✓ chosen</div>` + psql(` Index Scan using notes_pinned_idx on notes
   (cost=0.29..18.65 rows=240 width=11)`, { sm: true, title: 'the planner’s choice' }) + `</div>`), 1.2)}
${box('18.65 &lt; 3471.03', 'The planner estimates Way B is <b>~190× cheaper</b> and chooses it automatically. You wrote the same SQL both times.', 'xanh')}` },

  { t: 'How does it estimate? Statistics', body: `
${zm(run(`SELECT attname, n_distinct, most_common_vals,
       most_common_freqs
FROM pg_stats
WHERE tablename = 'notes' AND attname = 'pinned';`, ` attname | n_distinct | most_common_vals |    most_common_freqs
---------+------------+------------------+--------------------------
 pinned  |          2 | {f,t}            | {0.9989667,0.0010333334}
(1 row)`, {}), 1.1)}
<ul style="font-size:22px">
<li><code class="i">ANALYZE</code> samples the table and stores a summary: <b>0.1 %</b> of rows are <code class="i">t</code></li>
<li>0.001 × 200,000 ≈ 207 rows → that is where <code class="i">rows=207</code> in the plan comes from</li>
<li>Stale statistics ⇒ wrong estimates ⇒ bad plans (Chapter 10)</li>
</ul>` },

  { t: 'Seeing the plan: EXPLAIN', body: `
${run(`EXPLAIN SELECT title FROM notes WHERE pinned = true;`, `                      QUERY PLAN
------------------------------------------------------
 Seq Scan on notes  (cost=0.00..1.03 rows=2 width=13)
   Filter: pinned`, {})}
${two(`<ul style="font-size:21px;margin:0"><li><b>Seq Scan on notes</b> — read every row, top to bottom</li><li><b>Filter: pinned</b> — the WHERE test on each row</li><li>Read plans <b>from the inside out</b> (inner lines run first)</li></ul>`,
`<ul style="font-size:21px;margin:0"><li><b>cost=0.00..1.03</b> — estimated cost of the first row and of the last row (abstract units)</li><li><b>rows=2</b> — estimated matching rows</li><li><b>width=13</b> — average bytes per row</li></ul>`)}
<p class="nho">Plain EXPLAIN never runs the query — it is always safe.</p>` },

  { t: 'EXPLAIN ANALYZE: estimate vs reality', body: `
${zm(run(`EXPLAIN ANALYZE SELECT title FROM notes WHERE pinned = true;`, ` Seq Scan on notes  (cost=0.00..1.03 rows=2 width=13)
   (actual time=0.005..0.006 rows=2 loops=1)
   Filter: pinned
   Rows Removed by Filter: 1
 Planning Time: 0.008 ms
 Execution Time: 0.011 ms`, { hlOut: [2, 4] }), 1.15)}
<ul style="font-size:22px">
<li><b>actual time / rows</b> next to the estimate — here <code class="i">rows=2</code> = <code class="i">rows=2</code>: good statistics</li>
<li><b>Rows Removed by Filter</b> — rows read and thrown away; on a big table this is the smell of a missing index</li>
<li><b>Planning Time</b> vs <b>Execution Time</b> are reported separately</li>
</ul>` },

  { t: 'Danger: EXPLAIN ANALYZE really executes', body: `
${zm(run(`BEGIN;
EXPLAIN ANALYZE DELETE FROM notes WHERE pinned;
SELECT count(*) FROM notes;
ROLLBACK;
SELECT count(*) FROM notes;`, ` Delete on notes  (… actual time=0.007..0.007 rows=0 loops=1)
   ->  Seq Scan on notes  (… rows=2 …)
 Planning Time: 0.014 ms
 Execution Time: 0.054 ms

 count            ← inside the transaction
-------
     1

ROLLBACK
 count            ← after ROLLBACK
-------
     3`, { hlOut: [6, 7, 13, 14] }), 0.93)}
${box('Wrap writes in a transaction you roll back', '<code class="i">EXPLAIN ANALYZE DELETE …</code> <b>deleted the rows</b> (count 3 → 1). Measure writes inside <code class="i">BEGIN; … ROLLBACK;</code> (lesson 1.2!). Plain <code class="i">EXPLAIN</code> without ANALYZE never executes.', 'do2')}` },

  { t: 'A bigger table: the Seq Scan hurts', body: `
${zm(run(`EXPLAIN ANALYZE SELECT title FROM notes WHERE pinned = true;`, ` Seq Scan on notes  (cost=0.00..3471.03 rows=207 width=11)
   (actual time=0.006..6.988 rows=202 loops=1)
   Filter: pinned
   Rows Removed by Filter: 199801
 Planning Time: 0.007 ms
 Execution Time: 7.015 ms`, { hlOut: [3, 5] }), 1.15)}
<ul style="font-size:23px">
<li>200,000 rows: PostgreSQL read <b>all</b> of them and threw <b>199,801</b> away to return 202</li>
<li>On a small table that is fine; as the table grows, this is the line that makes pages slow</li>
</ul>` },

  { t: 'Give the planner a better option: an index', body: `
${sql(`CREATE INDEX notes_pinned_idx ON notes (pinned);
ANALYZE notes;`, { sm: true })}
${zm(run(`EXPLAIN ANALYZE SELECT title FROM notes WHERE pinned = true;`, ` Index Scan using notes_pinned_idx on notes
   (cost=0.29..18.65 rows=240 width=11)
   (actual time=0.021..0.207 rows=202 loops=1)
   Index Cond: (pinned = true)
 Execution Time: 0.216 ms`, { hlOut: [0, 4] }), 1.1)}
${bars()}` },

  { t: 'Station 4 — Execute: rows are pulled one at a time', body: `
${pull()}
<ul style="font-size:24px">
<li>The top node asks the node below for “the next row”, and so on down to the data pages</li>
<li>Each row travels back up, is tested by <b>Filter</b>, and — if it passes — is sent to the client (station 5)</li>
<li>That is why <code class="i">LIMIT 10</code> can finish early: nobody asks for row 11</li>
</ul>` },

  { t: 'In production: the 222× feed query', body: zm(two(
    `<ul style="font-size:23px;margin:0"><li>A page on cuongthai.com was slow</li><li><code class="i">EXPLAIN ANALYZE</code> showed <b>Rows Removed by Filter</b> on a table of <b>751,000</b> rows</li><li>The right index turned a <b>28 ms</b> sequential scan into a <b>0.129 ms</b> index scan</li></ul>`,
    `<div style="text-align:center;border:3px solid #2f7d4f;border-radius:16px;padding:18px;background:#f1f9f4"><div style="font-size:70px;font-weight:900;color:#1f6b40">222×</div><div style="font-size:22px;color:#444">faster — same query, same data,<br>one index</div></div>`, 'r64'), 1.15) +
    box('Habit', 'When a page is slow, <b>EXPLAIN ANALYZE comes first</b> — then guess. (Measured in the Node.js course; the slide above on 200,000 rows is the same pattern in miniature.)', 'lam') },

  { t: 'Trap: cost is not milliseconds', body: zm(vsd(
    `<p style="font-size:21px;margin:0">“cost=3471.03 — that is 3.4 seconds!”</p><ul style="font-size:20px"><li>Cost is in <b>abstract units</b> the planner uses to <i>compare</i> plans</li><li>The same query ran in <b>7 ms</b></li></ul>`,
    `<p style="font-size:21px;margin:0">Use cost to compare plans <b>of the same query</b>.</p><ul style="font-size:20px"><li>Real time lives in <code class="i">actual time</code> / <code class="i">Execution Time</code> (EXPLAIN ANALYZE)</li><li>Compare estimated <code class="i">rows</code> with actual <code class="i">rows</code> — a big gap means bad statistics</li></ul>`), 1.2) +
    box('Also remember', 'Timings are machine- and cache-dependent: run twice, compare shapes, not single numbers.', 'xanh') },

  { t: 'Exercise: predict the plan', to: true, body: `
<p style="margin:0">On the 200,000-row <code class="i">notes</code> table (primary key on <code class="i">id</code>, <b>no</b> index on <code class="i">user_id</code>), what node would you expect for:</p>
<ol>
<li><code class="i">WHERE id = 5</code> ?</li>
<li><code class="i">WHERE user_id = 1</code> ? (half the rows match)</li>
</ol>
${box('Answer — real EXPLAIN output', '1) <b>Index Scan using notes_pkey</b> (cost 0.42..8.44, rows=1). 2) <b>Seq Scan</b> with <code class="i">Filter: (user_id = 1)</code>, rows=99953 — no index, <i>and</i> half the table matches: reading everything is the cheapest plan anyway.', 'xanh')}` },

  { t: 'Check yourself', to: true, body: `
<ol>
<li>Name the stations a query passes through, in order. Which one reports <code class="i">column "titel" does not exist</code>?</li>
<li>What did the planner compare to choose the index scan, and where do its estimates come from?</li>
<li>Why must you wrap <code class="i">EXPLAIN ANALYZE DELETE</code> in <code class="i">BEGIN … ROLLBACK</code>?</li>
</ol>
${box('Answers', '1) parse → rewrite → plan → execute → return; the <b>parser</b>. 2) estimated <b>costs</b> (18.65 vs 3471.03) based on <b>statistics</b> gathered by ANALYZE. 3) ANALYZE actually runs the statement, so the rows really get deleted.', 'xanh')}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>A query passes <b>parse → rewrite → plan → execute → return</b></li>
<li>The <b>planner</b> picks the cheapest of several plans using <b>statistics</b></li>
<li><code class="i">EXPLAIN</code> shows the plan; <code class="i">EXPLAIN ANALYZE</code> runs it and shows reality (and executes writes!)</li>
<li>A missing index shows up as <b>Seq Scan + big “Rows Removed”</b> — the fix is Chapters 9–10</li>
<li>Next: <b>Chapter 2 — Data types</b>, the ground everything stands on</li>
</ul>
${box('Practice', 'Run EXPLAIN on your own queries in the PostgreSQL track — <b>cuongthai.com/code-lab</b>', 'lam')}` },
]);
