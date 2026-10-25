/**
 * pg-00-2 — PostgreSQL · Section 0 · Lesson 0.2 "How to study this course" + HAI ĐƯỜNG HỌC (slide EN, kiểu FU, 25/10/2026).
 * Nguồn: content/courses/postgresql/s00-intro.mjs › postgresql-0-2-cach-hoc. Output psql = chạy thật trên PostgreSQL 17.11 (pgcourse17),
 * lưu ở video-bai-giang/src/khung/pg/that/pg-00-2.{sql,out.txt}.
 * Bổ sung so với bài web: sơ đồ hai đường học, bảng chương nào lướt / học kỹ, 9 lab CT Shop, Ch17 mới, thi PE+FE, link DBI202.
 */
import { lamDeck, sql, psql, run, two, box, cards as cards0, steps, kw, flow, tbl, vsd, c } from './_pg-chung.mjs';

/* <b> trong .card bị khung render phóng to thành khối riêng ⇒ đổi sang span đậm. */
const cards = (items, cot) => cards0(items.map(([h, p]) => [h, p.replace(/<b>/g, '<span style="font-weight:800;color:#262626">').replace(/<\/b>/g, '</span>')]), cot);

export const deck = { key: 'pg-00-2', code: 'PG 0.2', title: 'How to study this course', sub: 'Type it, run it, read the plan — and pick your path' };

const NAU = '#b85a2b', PG = '#336791', CAM = '#e08a1e', LA = '#2f7d4f';

/* Vòng học 4 bước (SVG) — Predict → Run → Compare → Break. Chữ đặt theo 0,602 × cỡ chữ. */
const vong = () => {
  const it = [['1', 'Predict', ['say what it', 'will return'], CAM], ['2', 'Run', ['in psql, on', 'the real data'], PG], ['3', 'Compare', ['rows? speed?', 'if not — why?'], LA], ['4', 'Break it', ['swap the JOIN,', 'drop the WHERE'], NAU]];
  const bw = 235, gap = 56, h = 150, W = 4 * bw + 3 * gap;
  let s = `<svg viewBox="0 0 ${W} ${h + 70}" width="${W}" height="${h + 70}" font-family="Arial"><defs><marker id="vm" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${NAU}"/></marker></defs>`;
  it.forEach(([n, t, d, m], i) => {
    const x = i * (bw + gap);
    s += `<rect data-k="loop" x="${x}" y="6" width="${bw}" height="${h - 14}" rx="14" fill="${m}14" stroke="${m}" stroke-width="3"/>`;
    s += `<circle cx="${x + 34}" cy="44" r="20" fill="${m}"/><text x="${x + 34}" y="52" text-anchor="middle" font-size="24" font-weight="800" fill="#fff">${n}</text>`;
    s += `<text x="${x + 66}" y="52" font-size="28" font-weight="800" fill="${m}">${t}</text>`;
    s += `<text x="${x + 18}" y="92" font-size="21" fill="#444">${d[0]}</text><text x="${x + 18}" y="118" font-size="21" fill="#444">${d[1]}</text>`;
    if (i < 3) s += `<line x1="${x + bw + 3}" y1="${h / 2 - 4}" x2="${x + bw + gap - 5}" y2="${h / 2 - 4}" stroke="${NAU}" stroke-width="3.5" marker-end="url(#vm)"/>`;
  });
  s += `<path d="M${W - 118},${h - 4} C${W - 118},${h + 30} 118,${h + 30} 118,${h - 4}" fill="none" stroke="${NAU}" stroke-width="3" stroke-dasharray="7 6" marker-end="url(#vm)"/>`;
  s += `<text x="${W / 2}" y="${h + 62}" text-anchor="middle" font-size="22" font-weight="700" fill="${NAU}">the gap between 1 and 3 is where learning happens</text>`;
  return s + '</svg>';
};

/* HAI ĐƯỜNG HỌC (SVG): làn trên = đường đầy đủ, làn dưới = đường tắt rẽ ở 0.4 → 0.5 → lướt Ch1–7 → nhập lại ở Ch8. */
const haiDuong = () => {
  const W = 1110, H = 372, yA = 128, yB = 258;
  const st = [[70, 'Section 0', '0.1 – 0.4'], [250, 'Ch 1', 'why PG'], [430, 'Ch 2 – 7', 'SQL basics'], [650, 'Ch 8 – 16', 'deep + production'], [850, 'Ch 17', '4 databases'], [1010, 'Exam', 'PE + FE']];
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Arial"><defs>` +
    `<marker id="hd" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${CAM}"/></marker></defs>`;
  s += `<text data-k="lane" x="8" y="26" font-size="23" font-weight="800" fill="${PG}">FULL PATH — new to databases: every station, in order</text>`;
  s += `<line x1="70" y1="${yA}" x2="1010" y2="${yA}" stroke="${PG}" stroke-width="9" stroke-linecap="round"/>`;
  st.forEach(([x, t, d]) => {
    s += `<text x="${x}" y="${yA - 54}" text-anchor="middle" font-size="22" font-weight="800" fill="#333">${t}</text>`;
    s += `<text x="${x}" y="${yA - 31}" text-anchor="middle" font-size="16" fill="#666">${d}</text>`;
    s += `<circle cx="${x}" cy="${yA}" r="17" fill="#fff" stroke="${PG}" stroke-width="6"/>`;
  });
  /* rẽ xuống sau 0.4 */
  s += `<path d="M130,${yA + 14} C175,${yA + 60} 170,${yB} 225,${yB}" fill="none" stroke="${CAM}" stroke-width="7" stroke-linecap="round"/>`;
  s += `<rect data-k="pg05" x="225" y="${yB - 25}" width="215" height="50" rx="10" fill="#fff3c4" stroke="${CAM}" stroke-width="3"/>`;
  s += `<text x="332" y="${yB + 7}" text-anchor="middle" font-size="21" font-weight="800" fill="#7a3d12">Lesson 0.5 ★ new</text>`;
  s += `<line x1="440" y1="${yB}" x2="560" y2="${yB}" stroke="${CAM}" stroke-width="7" stroke-dasharray="14 10" stroke-linecap="round"/>`;
  s += `<text x="500" y="${yB + 38}" text-anchor="middle" font-size="20" font-weight="800" fill="${CAM}">skim Ch 1 – 7</text>`;
  s += `<text x="500" y="${yB + 62}" text-anchor="middle" font-size="16" fill="#666">slides + traps only</text>`;
  /* nhập lại ở Ch8 */
  s += `<path d="M560,${yB} C625,${yB} 640,${yA + 70} 648,${yA + 22}" fill="none" stroke="${CAM}" stroke-width="7" stroke-linecap="round" marker-end="url(#hd)"/>`;
  s += `<text x="690" y="${yA + 66}" font-size="21" font-weight="800" fill="${CAM}">rejoin at Ch 8</text>`;
  s += `<text x="690" y="${yA + 90}" font-size="17" fill="#666">then study carefully to the end</text>`;
  s += `<text x="1010" y="${yB + 12}" text-anchor="middle" font-size="46">🏁</text><text x="1010" y="${yB + 46}" text-anchor="middle" font-size="17" fill="#666">all 9 labs + exam</text>`;
  s += `<text data-k="lane" x="8" y="${H - 8}" font-size="23" font-weight="800" fill="${CAM}">SHORTCUT — already know SQL Server / MySQL</text>`;
  return s + '</svg>';
};

export const slides = lamDeck({ chuong: 'Section 0 — Introduction & How to Study', bai: '0.2' }, [
  { cover: true, t: 'How to study<br>this course', sub: 'Type it. Run it. Read the plan.<br>And choose the path that fits you.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>Why <b>reading</b> SQL is not the same as <b>learning</b> SQL</li>
<li>One rule — <b>type it and run it</b> — and the 4-step loop behind it</li>
<li>Five habits of people who are good at SQL</li>
<li>What “real output” means in this course</li>
<li>The <b>two ways to study</b>: the full path and the shortcut</li>
</ul>
${box('Promise of this lesson', 'After it you will know exactly <b>how</b> to work through every chapter — and which chapters you may skim.', 'lam')}` },

  { t: 'SQL is easy to read — and hard to predict', body: `
<p>Both queries below are <b>valid</b>, return rows, and look harmless. Only <b>running</b> them shows the difference.</p>
${sql(`SELECT count(*) AS orders FROM orders;

SELECT count(*) AS rows_after_join
FROM orders o
JOIN order_items i ON i.order_id = o.id;`, { sm: true })}
${two(psql(`pgcourse=# SELECT count(*) AS orders FROM orders;
 orders
--------
      2
(1 row)`, { sm: true }), psql(`pgcourse=# …JOIN order_items i ON i.order_id = o.id;
 rows_after_join
-----------------
               4
(1 row)`, { sm: true, hl: [4] }))}
${box('Why?', 'The JOIN produced <b>one row per item</b>, not per order. Reading the SQL never tells you that — counting the rows does. (Chapter 5 explains fan-out.)', 'do2')}` },

  { t: 'One rule: type it and run it', body: `
<p>Do not read this course like a novel. Keep a terminal with <code class="i">psql</code> open next to the lesson.</p>
${vong()}
${box('', 'Type the query yourself — <b>do not copy-paste</b>. Typing forces you to read every token.', 'lam')}
${cards([['Example · predict', '“<code class=\"i\">WHERE body = NULL</code> on 3 rows, one NULL — how many rows?”'], ['Example · compare', 'You said 1, PostgreSQL said 0. <b>Why?</b> NULL is “unknown”, not a value.'], ['Example · break it', 'Change it to <code class=\"i\">IS NULL</code>, then to <code class=\"i\">IS NOT NULL</code>. See the counts move.']], 3)}` },

  { t: 'Prediction vs reality — a real example', body: `
<p>Before you scroll down: <b>how many rows</b> does each query return from the table <code class="i">notes</code> (3 rows, one has <code class="i">body</code> = NULL)?</p>
${run(`SELECT count(*) AS with_eq FROM notes WHERE body = NULL;
SELECT count(*) AS with_is FROM notes WHERE body IS NULL;`,
`pgcourse=# SELECT count(*) AS with_eq FROM notes WHERE body = NULL;
 with_eq
---------
       0
(1 row)

pgcourse=# SELECT count(*) AS with_is FROM notes WHERE body IS NULL;
 with_is
---------
       1
(1 row)`)}
<p style="font-size:21px">Most beginners predict <b>1</b> for both. <code class="i">NULL</code> means “unknown”, and “unknown = unknown” is not true — it is unknown. <b>The surprise is the lesson.</b></p>` },

  { t: 'Reference, do not memorise', to: true, giua: true, body: two(`
<ul>
<li>Nobody memorises SQL syntax. Professionals keep <b>postgresql.org/docs</b> open all day</li>
<li>What you build here is a <b>mental model</b>:<br>how rows are stored · what an index really is · why a JOIN can explode · what a transaction locks</li>
<li>With the right model, syntax is a <b>5-second lookup</b></li>
</ul>`, cards([
    ['🧠 Memory', 'Syntax of CREATE TABLE, window frames, JSONB operators — look it up.'],
    ['🗺️ Model', 'Pages, indexes, plans, MVCC, locks — this is what the course teaches.'],
  ], 1)) },

  { t: 'The most valuable skill: reading EXPLAIN ANALYZE', body: `
${run(`EXPLAIN ANALYZE SELECT * FROM notes WHERE id = 2;`,
`pgcourse=# EXPLAIN ANALYZE SELECT * FROM notes WHERE id = 2;
 Index Scan using notes_pkey on notes  (cost=0.14..8.16 rows=1 width=467) (actual time=0.013..0.013 rows=1 loops=1)
   Index Cond: (id = 2)
 Planning Time: 0.060 ms
 Execution Time: 0.024 ms`, { hlOut: [2, 3] })}
${two(`<ul style="font-size:22px">
<li>Chapters 1–8 teach you to write a <b>correct</b> query</li>
<li><b>Chapter 10</b> teaches you why a query is <b>slow</b> — by reading this plan</li>
</ul>`, box('Do not skip it', 'A query that is 1,000× too slow looks exactly like a fast one in the editor. The plan tells you which.', 'xanh'))}
${cards([['Index Scan', 'the planner used an index — it did not read the whole table'], ['actual time / rows', 'what really happened, measured, not guessed'], ['Execution Time', 'the number to compare before and after a fix']], 3)}` },

  { t: 'Five habits of people who are good at SQL (1/2)', body: `
${cards([
    ['1 · Always LIMIT when exploring', 'A bare SELECT * on a big table can return millions of rows and freeze your terminal. Add LIMIT 20 until you know the shape of the data.'],
    ['2 · Read the plan before blaming the query', 'Slow? Run EXPLAIN ANALYZE first. It says: missing index, bad join, or simply too much data. Do not guess.'],
    ['3 · Let the database do the work', 'Filter, sort, aggregate and join in SQL — not by pulling rows into your app and looping.'],
  ], 3)}
${run(`SELECT * FROM generate_series(1, 1000000) AS g(n) LIMIT 3;`,
`pgcourse=# SELECT * FROM generate_series(1, 1000000) AS g(n) LIMIT 3;
 n
---
 1
 2
 3
(3 rows)`, { ngang: true })}
${box('Habit 3 in one line', 'Wrong: fetch 1,000,000 rows, loop in JavaScript, count. Right: <code class="i">SELECT count(*) … GROUP BY …</code> — the server returns a handful of rows.', 'xanh')}` },

  { t: 'Five habits of people who are good at SQL (2/2)', body: `
${two(box('4 · Never trust data pasted into a query string', `Always use <b>parameters</b>; never concatenate values into SQL. That is how <b>SQL injection</b> happens (Chapter 4 and the Node.js course show it live).`, 'do2'),
    box('5 · Wrap multi-step changes in a transaction', 'If step 2 fails, step 1 must roll back. <code class="i">BEGIN; … COMMIT;</code> — Chapter 11.', 'xanh'))}
${psql(`pgcourse=# BEGIN;
pgcourse=*# UPDATE notes SET pinned = false;
UPDATE 3
pgcourse=*# SELECT count(*) FILTER (WHERE pinned) AS pinned_in_tx FROM notes;
 pinned_in_tx
--------------
            0
pgcourse=*# ROLLBACK;
pgcourse=# SELECT count(*) FILTER (WHERE pinned) AS pinned_after FROM notes;
 pinned_after
--------------
            2`, { hl: [8, 12] })}` },

  { t: 'What “real output” means in this course', body: two(`
<ul style="font-size:23px">
<li>Every block of output is the <b>real result</b> of running the query on a real <b>PostgreSQL 17</b> server, copied verbatim</li>
<li>Slow queries show the <b>real time</b> from <code class="i">EXPLAIN ANALYZE</code></li>
<li>Errors show the <b>exact message and code</b></li>
<li>Nothing here is “probably right”</li>
</ul>`, psql(`pgcourse=# INSERT INTO orders VALUES (1, 'Dup');
ERROR:  23505: duplicate key value violates
        unique constraint "orders_pkey"
DETAIL:  Key (id)=(1) already exists.`, { sm: true, hl: [2, 3, 4] }), 'r46') + box('Trap — READING SQL instead of RUNNING it', 'SQL is unusually easy to read and unusually hard to <i>predict</i>. A JOIN can multiply rows; a LEFT JOIN can silently become an inner join. Run it, <b>count the rows</b>, compare with what you expected — <b>before</b> reading the explanation.', 'do2') },

  { t: 'The course at a glance', to: true, giua: true, body: cards([
    ['📚 17 chapters', 'Section 0 + Chapters 1–17: basics → queries → performance → production → compare 4 databases.'],
    ['🧪 9 labs', 'One growing project called CT Shop — ERD → tables → data → reports → indexes → transactions → search → backup → Node + Prisma.'],
    ['❓ Quizzes', 'A quiz at the end of every chapter — find the gaps while they are small.'],
    ['🎓 Final exam', 'Practical (PE, with a database given) + multiple choice (FE), like a real exam.'],
  ], 2) + flow([{ t: 'Foundations', s: 'Section 0 – Ch 4', mau: PG }, { t: 'Deeper queries', s: 'Ch 5 – 8', mau: CAM }, { t: 'Performance', s: 'Ch 9 – 12', mau: LA }, { t: 'Production', s: 'Ch 13 – 17', mau: NAU }], { h: 130, fs: 22 }) },

  { t: 'Two ways to study this course', body: `
${haiDuong()}
<p style="font-size:21px">Same destination, same <b>labs</b> and <b>exam</b>. The shortcut only skips the <i>slow reading</i> of material you already know from SQL Server / MySQL.</p>` },

  { t: 'The full path — if you are new to databases', to: true, body: two(
    steps([
      'Section 0 → Chapter 17, <b>strictly in order</b>',
      'Type and run <b>every</b> query yourself',
      'Do all <b>9 labs</b> on CT Shop',
      'Do every chapter <b>quiz</b>',
      'Finish with the final exam (PE + FE)',
    ]),
    cards([
      ['⏱ Time', '≈ 2–3 hours per chapter if you type everything → about 45–55 hours.'],
      ['🧱 Why in order', 'Chapter 10 (plans) needs Chapter 5 (JOIN); Chapter 9 (indexes) needs Chapter 2 (types). Skipping ahead leaves holes.'],
    ], 1)) + flow([{ t: 'Read the lesson', s: 'slides + text', mau: PG }, { t: 'Type & run', s: 'every query', mau: CAM }, { t: 'Chapter quiz', s: 'find the gaps', mau: LA }, { t: 'Lab on CT Shop', s: 'build the skill', mau: NAU }], { h: 130, fs: 22 }) },

  { t: 'The shortcut — if you know SQL Server or MySQL', to: true, body: two(
    steps([
      'Lesson <b>0.5</b> “From SQL Server / MySQL to PostgreSQL” — the next lesson after 0.4',
      '<b>Skim</b> Chapters 2–7 (lessons tagged <i>“Know SQL Server? You can skim”</i>)',
      '<b>Study carefully</b> Chapters 8–17',
      'Still do <b>every lab</b> + the exam',
    ]),
    box('Why only skim 2–7?', 'JOIN, GROUP BY, subqueries and CTEs are 90% the same in every SQL database. The differences (types, identity, quoting, string functions) are exactly what 0.5 and the “traps” sections cover.', 'lam')) + flow([{ t: 'Lesson 0.5', s: 'T-SQL / MySQL → PG', mau: CAM }, { t: 'Skim Ch 1 – 7', s: 'slides + traps', mau: '#9a8a70' }, { t: 'Study Ch 8 – 17', s: 'type every query', mau: PG }, { t: '9 labs + exam', s: 'no shortcuts here', mau: NAU }], { h: 130, fs: 22 }) },

  { t: 'Which chapters to skim — and which to study', body: `
<table class="t" style="font-size:19px">
<tr><th style="width:150px">Chapters</th><th>Topic</th><th style="width:210px">Full path</th><th style="width:210px">Shortcut</th></tr>
<tr><td><b>0 – 1</b></td><td>Intro, psql, why PostgreSQL, ACID</td><td>read all</td><td><b>read</b> (short; PG process model is new)</td></tr>
<tr><td><b>2 – 7</b></td><td>Types, tables, INSERT/SELECT, JOIN, GROUP BY, CTE</td><td>read all + type</td><td style="background:#fff7ef"><b>skim</b> · slides + traps</td></tr>
<tr><td><b>8</b></td><td>Window functions</td><td>read all + type</td><td style="background:#eef4fa"><b>study</b></td></tr>
<tr><td><b>9 – 10</b></td><td>Indexes, EXPLAIN, planner</td><td>read all + type</td><td style="background:#eef4fa"><b>study</b></td></tr>
<tr><td><b>11 – 12</b></td><td>MVCC, locks, functions, triggers, views</td><td>read all + type</td><td style="background:#eef4fa"><b>study</b></td></tr>
<tr><td><b>13 – 16</b></td><td>JSONB, search, pools, backup, replication, Prisma</td><td>read all + type</td><td style="background:#eef4fa"><b>study</b></td></tr>
<tr><td><b>17</b></td><td>SQL Server · MySQL · PostgreSQL · MongoDB</td><td>read all</td><td style="background:#eef4fa"><b>study</b></td></tr>
<tr><td><b>Labs 1–9</b></td><td>CT Shop</td><td colspan="2" style="text-align:center"><b>everyone does all 9 labs</b></td></tr>
</table>` },

  { t: 'Shared theory: short here, deeper in DBI202', to: true, giua: true, body: two(`
<ul>
<li>ERD, normalization, primary and foreign keys are the <b>same in every database</b></li>
<li>This course explains each in a few minutes — just enough to build CT Shop</li>
<li>Want the full theory? Each such lesson has a <b>“go deeper”</b> link</li>
</ul>`, box('Go deeper', `<p style="font-size:24px;margin:0"><b>DBI202</b> — Introduction to Databases<br><span class="lam">cuongthai.com/courses/introduction-to-databases</span></p>`, 'lam')) },

  { t: 'Which path am I? — and a trap', to: true, body: two(
    box('Pick the shortcut if you can answer yes to all', `<ul style="font-size:22px;margin:4px 0 0 0">
<li>I can write a JOIN and a GROUP BY without looking</li>
<li>I know PK / FK / UNIQUE</li>
<li>I have used SQL Server, MySQL or a DBI202-level course</li>
</ul>`, 'lam'),
    box('Not sure? Take the full path', 'Skimming too early hides the holes. You can always switch: lesson 0.5 works for anyone.', 'xanh')) +
    box('Trap — skipping the labs', 'Reading the shortcut chapters is optional. <b>The labs are not.</b> Lab 5 (1 million orders, indexes) and Lab 6 (transactions) are where the course becomes a skill.', 'do2') },

  { t: 'Check yourself', to: true, giua: true, body: `
<ol>
<li>Why can a <i>correct-looking</i> query still be wrong or 1,000× too slow? What do you do about it?</li>
<li>Name the four steps of the study loop. Which gap matters most?</li>
<li>You already know SQL Server. Which lesson do you read next, which chapters do you skim, and what must you still do?</li>
</ol>
${box('Answers', '1) valid syntax says nothing about row count or speed — run it, count rows, read EXPLAIN ANALYZE. 2) Predict · Run · Compare · Break it — the gap between prediction and result. 3) Lesson 0.5; skim Chapters 2–7; study Chapters 8–17 and still do all labs + the exam.', 'xanh')}` },

  { t: 'Summary', body: `
<ul>
<li>Reading SQL ≠ learning SQL: <b>type it, run it, compare, break it</b></li>
<li>Build a <b>mental model</b>; look syntax up</li>
<li>The most valuable skill: <b>EXPLAIN ANALYZE</b> (Chapter 10)</li>
<li>Five habits: LIMIT · plan first · let the database work · parameters · transactions</li>
<li>Two paths: <b>full</b> (0 → 17 in order) or <b>shortcut</b> (0.5 → skim 2–7 → study 8–17) — <b>all labs</b> either way</li>
<li>Next: <b>0.3 — Installing PostgreSQL &amp; meeting psql</b> (shortcut path: then 0.5)</li>
</ul>
${box('Practice', 'PostgreSQL track on Code Lab — <b>cuongthai.com/code-lab/postgresql</b>', 'lam')}` },
]);
