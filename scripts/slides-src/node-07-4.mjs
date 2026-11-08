/**
 * node-07-4 — Node.js · Chapter 7 · Lesson 7.4 "Relations, and the N+1 problem measured" (slide EN, kiểu FU, đợt 6 — 01/11/2026). MỘT deck, MỘT tập (node-7-4).
 *   Ba hình dạng quan hệ · API quan hệ (thật: tạo lồng, some/none, _count) · include thật sự gửi gì (thật: 2 câu SQL, IN) · vì sao hai truy vấn thay vì JOIN ·
 *   thí nghiệm năm cách đếm truy vấn bằng sự kiện query (thật: 51 / 2 / 2 / 1 / 2 truy vấn) · thêm 1 ms mạng thì sao (phép tính trên số đo) · nhận ra N+1 khi review ·
 *   sửa không cần include · đừng tải thứ chỉ để đếm · cột là băng thông (thật: 457,6 / 174,4 / 37,7 KB) · log truy vấn chậm (thật) · biến thành test (thật: đỏ ở 51) ·
 *   website · bài tập · tự kiểm · tóm tắt
 * Nguồn: s07-prisma.mjs › nodejs-7-4-quan-he-va-n-plus-1. Output THẬT: that/c7/{rel-api,include-sql,n-plus-one,bytes,slow-log,query-budget.test}.
 * Số khác web (máy khác): A 38,2 / B 6,1 / C 6,9 / D 1,1 / E 3,2 ms (web 79 / 14 / 12 / 5 / 3) · 457,6 / 37,7 KB (web 322,1 / 50,1 — thân ghi chú dài hơn).
 * Câu SQL của include ở 7.10 KHÔNG có ORDER BY (web chép bản có ORDER BY "Note"."id").
 */
import { lamDeck, two, three, box, kw, bang, cards, flow, cot, tep, gay, P, Q, J, JW, T } from './_c7-chung.mjs';
import { ra, ma } from './_node-chung.mjs';

export const deck = { key: 'node-07-4', code: 'NODE 7.4', title: 'Relations, and the N+1 problem measured', sub: 'Node.js — from zero to production' };
const CAM = '#e08a1e', NODE = '#15803d', LAM = '#336791', DO = '#b0281a', TIM = '#7c3aed';
const G = (ten, a, b, n = 104) => gay(ra(ten, a, b), n).replace(/\n+$/, '');
const TT = (ten, a, b, title, o = {}) => T(G(ten, a, b, o.n), title, o);
const so = (re) => { const l = ra('c7/n-plus-one').split('\n').find((x) => re.test(x)); return { ms: Number(l.match(/([\d.]+)ms/)[1]), q: Number(l.match(/(\d+) SQL/)[1]) }; };

/** Thanh: thời gian (ms) + số truy vấn của năm cách (THẬT). */
function namCach() {
  const rows = [['A · loop (N+1)', so(/^A\./), DO], ['B · include', so(/^B\./), LAM], ['C · 2 queries + Map', so(/^C\./), LAM], ['D · groupBy', so(/^D\./), NODE], ['E · include + select', so(/^E\./), NODE]];
  const w = 1110, h = 320, x0 = 290, wMax = 560, max = rows[0][1].ms;
  let s = `<svg data-k="nam" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial">`;
  rows.forEach(([n, v, m], i) => {
    const y = 8 + i * 58, bw = Math.max(8, (v.ms / max) * wMax);
    s += `<text x="${x0 - 14}" y="${y + 30}" text-anchor="end" font-size="20" font-weight="700" fill="#333" font-family="monospace">${n}</text>`;
    s += `<rect x="${x0}" y="${y + 8}" width="${bw}" height="32" rx="6" fill="${m}"/>`;
    s += `<text x="${x0 + bw + 12}" y="${y + 32}" font-size="21" font-weight="800" fill="#333">${v.ms} ms · ${v.q} ${v.q === 1 ? 'query' : 'queries'}</text>`;
  });
  return s + `<text x="${x0}" y="${h - 6}" font-size="15" fill="#777">50 users · 1,000 notes · median of 7 · database on the same laptop · real</text></svg>`;
}

export const slides = lamDeck({ chuong: 'Chapter 7 — PostgreSQL & Prisma', bai: '7.4' }, [
  { cover: true, t: 'Relations,<br>and the N+1 problem measured', sub: 'Invisible in code review: the loop looks harmless, every query is fast, and the endpoint is slow.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>Three shapes of relations, and the relation API (include, select, some/none, nested create, _count)</li>
<li>What <code class="i">include</code> really sends to PostgreSQL</li>
<li>The experiment: 50 users, 1,000 notes, five ways, every SQL statement counted</li>
<li>Fixes: include, a Map, groupBy, select — and why columns are bandwidth</li>
<li>Turning "count the queries" into a test that fails</li>
</ul>` + box('N+1 (bẫy N+1)', 'one query for the list, then one more query for each of the N items in it: N+1 round trips where 2 would do.', 'lam') },

  { t: 'Three shapes of relations', to: true, giua: true, body: cards([
    ['1 → many', 'User → Note. The foreign key lives on the "many" side: <code class="i">Note.authorId</code>.'],
    ['many ↔ many', 'Note ↔ Tag through <b>NoteTag</b>: two foreign keys, a composite primary key (lesson 7.2).'],
    ['1 → 1', 'User → Profile: like one-to-many, plus <code class="i">@unique</code> on the foreign key.'],
  ], 3) + P(tep('c7/schema-final.prisma', 19, 33)) },

  { t: 'The relation API, run for real', to: true, giua: true, body: JW(ma('c7/rel-api', 6, 17), 100) + TT('c7/rel-api', 2, 5, 'node rel-api.mjs · 50 users, 1,000 notes · real') },

  { t: 'include, select, and friends', to: true, giua: true, body: bang(['you write', 'it means'], [
    ['<code class="i">include: { notes: true }</code>', '"the whole row, plus this relation"'],
    ['<code class="i">select: { id: true, notes: { select: … } }</code>', '"exactly these fields" — not both at the same level'],
    ['<code class="i">where: { notes: { some | every | none: … } }</code>', 'filter parents by their children (an EXISTS subquery in SQL)'],
    ['<code class="i">notes: { create: [...] }</code> / <code class="i">connect</code>', 'write children with the parent, in one implicit transaction'],
    ['<code class="i">_count: { select: { notes: true } }</code>', '"how many", without sending the rows'],
  ], { co: 24 }) + box('One rule at each level', 'include or select, never both side by side at the same level: select already says everything you want.', 'cam') },

  { t: 'What include really sends', to: true, giua: true, body: J("await prisma.user.findMany({ where: { id: { lte: 2 } }, include: { notes: true } });", { sm: false }) +
    TT('c7/include-sql', 2, 4, 'query log of node include-sql.mjs · real', { n: 112, hl: [1, 3] }) +
    box('$on(\'query\') = a listener', 'The client was created with <code class="i">log: [{ emit: \'event\', level: \'query\' }]</code>, so every statement fires an event we can print or count.', 'lam') +
    box('Two statements, not a JOIN', 'First the users, then <b>all</b> their notes in one query with <code class="i">IN ($1,$2)</code>. That IN is the whole trick: 2 round trips instead of 51.', 'xanh') },

  { t: 'Why two queries instead of one JOIN?', to: true, giua: true, body: two(
    box('A JOIN repeats the parent', 'One user with 20 notes travels 20 times on the wire: name, email, createdAt on every row.', 'cam'),
    box('Two queries send each row once', 'For deep or wide relations, the two-query strategy often moves far less data.', 'xanh')) +
    box('If you took PostgreSQL lesson 5.1 or DBI202 lesson 6.2', 'You wrote that JOIN by hand and saw the duplicated parent columns in the result. Prisma\'s include is the other trade-off.', 'lam') +
    box('Either way, the enemy is not the JOIN', 'It is sending one query per item. Next: the experiment.', 'do2') +
    box('Prisma 7.10, measured', 'The second statement had no ORDER BY: Prisma sorts nothing unless you ask with orderBy.', 'cam') },

  { t: 'The experiment: count every SQL statement', to: true, giua: true, body: J(ma('c7/n-plus-one', 7, 12), { sm: false, hl: [3, 6] }) + J(ma('c7/n-plus-one', 16, 21), { sm: false, hl: [4] }) +
    box('Counted, not estimated', 'Prisma emits a <b>query</b> event for every statement it sends. We reset the counter before each run, and take the median of 7 runs.', 'lam') },

  { t: 'Five ways, measured', to: true, giua: true, body: namCach() + TT('c7/n-plus-one', 2, 6, 'node n-plus-one.mjs · real', { hl: [1] }) },

  { t: 'On a real network, the gap grows', to: true, giua: true, body: bang(['', 'SQL statements', 'measured here', '+ 1 ms per round trip'], [
    ['A · loop', `${so(/^A\./).q}`, `${so(/^A\./).ms} ms`, `≈ ${(so(/^A\./).ms + so(/^A\./).q).toFixed(0)} ms`],
    ['B · include', `${so(/^B\./).q}`, `${so(/^B\./).ms} ms`, `≈ ${(so(/^B\./).ms + so(/^B\./).q).toFixed(0)} ms`],
  ], { co: 24, hl: [0] }) + two(
    box('Measured on one laptop', 'The database sits next to the API, so a round trip costs almost nothing. Production databases live on another machine.', 'lam'),
    box('Simple arithmetic, not a measurement', 'Add 1 ms per round trip (a modest real network): A pays about 51 ms more, B about 2 ms. Every extra user widens the gap.', 'cam')) +
    box('That is why N+1 shows up after launch', 'With 10 users in development, everything feels fine.', 'do2') },

  { t: 'How to spot N+1 in code review', to: true, giua: true, body: two(
    J("const users = await prisma.user.findMany();\nfor (const u of users) {\n  u.notes = await prisma.note.findMany({\n    where: { authorId: u.id },\n  });\n}", { sm: false, hl: [2, 3] }),
    J("for (const note of notes) {\n  await enrich(note);   // looks harmless…\n}\n\nasync function enrich(note) {\n  note.author = await prisma.user.findUnique(…);\n}", { sm: false, hl: [2, 6] })) +
    box('The whole signature', 'An <b>await</b> that calls the database, inside a <b>for</b>, <b>map</b> or <b>forEach</b> over rows you just loaded. It also hides inside helper functions.', 'cam') +
    box('Why reviewers miss it', 'Each query alone is fast and correct. Only the count is wrong — and the count grows with your data.', 'lam') },

  { t: 'Fix without include: two queries and a Map', to: true, giua: true, body: J(ma('c7/n-plus-one', 24, 30), { sm: false, hl: [3, 4, 5] }) + two(
    box('The "dataloader" pattern, simplest form', 'Collect the ids, fetch once with <code class="i">in</code>, index by key. Way C above: 2 queries.', 'xanh'),
    box('When to use it', 'When the shape you need does not map onto include — merging data from two sources, or post-processing.', 'lam')) +
    box('Same cost as include', `C · ${so(/^C\./).ms} ms, ${so(/^C\./).q} queries vs B · ${so(/^B\./).ms} ms, ${so(/^B\./).q} queries.`, '') },

  { t: 'Do not download what you only count', to: true, giua: true, body: J("// wrong: 1,000 rows over the wire to call .length\nconst users = await prisma.user.findMany({ include: { notes: true } });\nusers.map((u) => u.notes.length);", { sm: false }) +
    J("// right: the database counts and sends back 50 numbers\nawait prisma.note.groupBy({ by: ['authorId'], _count: { _all: true } });\n// or, if you still need the parent rows\nawait prisma.user.findMany({ select: { name: true, _count: { select: { notes: true } } } });", { sm: false }) +
    two(box(`D · groupBy: ${so(/^D\./).ms} ms, ${so(/^D\./).q} query`, `vs B · include: ${so(/^B\./).ms} ms, ${so(/^B\./).q} queries carrying 1,000 rows.`, 'xanh'),
      box('Real output of _count', '<code class="i">{"name":"User 2","_count":{"notes":20}}</code> — a number, not 20 rows.', 'lam')) },

  { t: 'Columns are bandwidth', to: true, giua: true, body: JW(ma('c7/bytes', 4, 6), 100) + TT('c7/bytes', 2, 4, 'node bytes.mjs · the same 50 users + 1,000 notes as JSON · real', { hl: [1, 3], sm: false }) +
    two(box('body is the expensive field', 'A list endpoint almost never needs it; a phone on 4G definitely does not.', 'cam'),
      box('select vs omit', 'select: you must remember to add new fields. omit: you must remember to exclude new heavy ones. Choose per endpoint.', 'lam')) },

  { t: 'Read the query log while you develop', to: true, giua: true, body: J(ma('c7/slow-log', 6, 12), { sm: false, hl: [3, 6] }) + TT('c7/slow-log', 1, 2, 'NODE_ENV=development node slow-log.mjs · real', { sm: false }) +
    box('Never log every query in production', 'A flood, real CPU, and parameters can contain personal data. Log slow queries only.', 'do2') },

  { t: 'Turn it into a test', to: true, giua: true, body: J(ma('c7/query-budget.test', 19, 25), { hl: [5] }) + TT('c7/query-budget.test', 2, 3, 'node --test query-budget.test.mjs · real') + TT('c7/query-budget.test', 17, 18, 'the failure message · real') +
    box('"This endpoint may send at most 3 statements"', 'An assertion that turns red the day someone adds a loop — the only way to catch N+1 early.', 'xanh') },

  { t: 'This website, and an exercise', to: true, giua: true, body: box('This website\'s feed', 'Author, media, reaction counts per post: naively one query per post per relation (40 ms ⇒ 900 ms). The real page uses one <code class="i">in</code> query per relation plus <code class="i">_count</code>: shapes C and D.', 'lam') +
    box('Exercise', 'GET /notes?with=tags returns 20 notes with their tag names (Note → NoteTag → Tag). Make the number of queries fixed, whatever the page size. How many?', '') +
    `<div data-k="dapan">${box('Answer', 'One findMany with <code class="i">select: { tags: { select: { tag: { select: { name: true } } } } }</code>: one query per level (Note, NoteTag, Tag).', 'xanh')}${TT('c7/tags-include', 2, 3, 'node tags-include.mjs · real', { n: 118 })}</div>` },

  { t: 'Self-check', to: true, giua: true, body: `<ol>
<li>How many SQL statements does include send for users + notes, and how?</li>
<li>What is the code-review signature of N+1?</li>
<li>You only need "how many notes per user". Which query?</li>
<li>How do you stop N+1 from coming back?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. Two: users, then notes WHERE authorId IN (…). &nbsp;2. A database await inside a loop over rows you just loaded. &nbsp;3. groupBy with _count (1 statement). &nbsp;4. A test that counts queries and fails above a budget.', 'xanh')}</div>` },

  { t: 'Summary', to: true, giua: true, body: `<ul>
<li>include sends one query per level, joined in JS with <code class="i">IN (…)</code>: 2 statements, not 51</li>
<li>Measured: loop 51 statements · include 2 · Map 2 · groupBy 1 · select 2 (fastest with rows)</li>
<li>On a real network every extra round trip adds up: N+1 appears after launch</li>
<li>Count in the database (groupBy, _count); send only the columns you need (select / omit)</li>
<li>Log slow queries in development; make the query count a test</li>
</ul>` + box('Next: lesson 7.5', 'Indexes, and reading EXPLAIN ANALYZE on a million rows.', 'lam') },
]);
