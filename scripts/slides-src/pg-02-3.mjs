/**
 * pg-02-3 — PostgreSQL · Chapter 2 · Lesson 2.3 "Booleans, dates & time zones" (slide EN, kiểu FU, 25/10/2026).
 * Nguồn: content/courses/postgresql/s02-kieu-du-lieu.mjs › postgresql-2-3-ngay-gio. Output psql = chạy thật PostgreSQL 17.11
 * (video-bai-giang/src/khung/pg/that/pg-02-3.out.txt). Bổ sung: ba đồng hồ một khoảnh khắc, boolean 3 trị (NULL), ống chuyển múi giờ, cùng một cột ba phiên,
 * AT TIME ZONE, cộng tháng (31/1 + 1 tháng), giờ mùa hè (+1 giờ ≠ +1 ngày), now() vs clock_timestamp(), đối chiếu SQL Server, và Prisma DateTime = timestamp(3) KHÔNG múi giờ.
 */
import { lamDeck, sql, psql, run, tbl, two, box, steps, cards, kw, vsd, c, flow } from './_pg-chung.mjs';

const zm = (h, z = 1.3) => `<div style="zoom:${z}">${h}</div>`;
const ss = (t) => box('🔁 Coming from SQL Server?', t, 'lam');
export const deck = { key: 'pg-02-3', code: 'PG 2.3', title: 'Booleans, dates & time zones', sub: 'boolean · date · time · timestamp · timestamptz · interval' };

/* Ba đồng hồ: một khoảnh khắc. */
const clocks = () => {
  const ck = (x, city, time, off, mau, bg, k) => `<g data-k="${k}"><circle cx="${x}" cy="168" r="108" fill="${bg}" stroke="${mau}" stroke-width="6"/>
  <text x="${x}" y="150" text-anchor="middle" font-size="25" font-weight="800" fill="${mau}">${city}</text>
  <text x="${x}" y="200" text-anchor="middle" font-size="46" font-weight="900" fill="#262626" font-family="Menlo,monospace">${time}</text>
  <text x="${x}" y="232" text-anchor="middle" font-size="20" fill="#555">${off}</text></g>`;
  return `<svg viewBox="0 0 1110 330" width="1110" height="330" font-family="Arial">
  <rect x="330" y="8" width="450" height="46" rx="23" fill="#fff3c4" stroke="#e08a1e" stroke-width="3" data-k="moment"/>
  <text x="555" y="39" text-anchor="middle" font-size="23" font-weight="800" fill="#7a3d12">ONE real moment on Earth ⚡</text>
  <path d="M555,54 L555,68" stroke="#e08a1e" stroke-width="3"/>
  <path d="M555,68 L210,95 M555,68 L555,95 M555,68 L900,95" stroke="#e08a1e" stroke-width="3" fill="none"/>
  ${ck(210, 'Hanoi', '09:00', 'UTC+7 · 10 Aug', '#336791', '#eef4fa', 'ck-hn')}
  ${ck(555, 'UTC', '02:00', 'UTC+0 · 10 Aug', '#2f7d4f', '#f1f9f4', 'ck-utc')}
  ${ck(900, 'New York', '22:00', 'UTC−4 · 9 Aug!', '#b85a2b', '#fdf5ee', 'ck-ny')}
  <text x="555" y="318" text-anchor="middle" font-size="21" fill="#555">same instant — three different numbers on the wall</text>
</svg>`;
};

/* Ống múi giờ. */
const pipe = () => flow([
  { t: 'You type', s: '09:00 +07 (Hanoi)', mau: '#336791' },
  { t: 'Convert to UTC', s: '02:00 UTC', mau: '#2f7d4f' },
  { t: 'Stored', s: '8 bytes · one instant', mau: '#b85a2b' },
  { t: 'Read back', s: 'in the SESSION time zone', mau: '#7c3aed' },
], { w: 1110, h: 150, fs: 21 });

export const slides = lamDeck({ chuong: 'Chapter 2 — Data types', bai: '2.3' }, [
  { cover: true, t: 'Booleans, dates<br>& time zones', sub: 'The hardest type to get right —<br>one decision decides whether “9 a.m.” means 9 a.m.' },

  { t: 'What you will get from this lesson', to: true, body: `
<ul>
<li><b>boolean</b> — true, false and the third value, <b>NULL</b></li>
<li>The date/time family: <code class="i">date</code> · <code class="i">time</code> · <code class="i">timestamp</code> · <code class="i">timestamptz</code> · <code class="i">interval</code></li>
<li>The decision that bites: <b>timestamp vs timestamptz</b> — shown with three time zones</li>
<li>Date arithmetic: adding months, daylight saving time, <code class="i">now()</code> vs <code class="i">clock_timestamp()</code></li>
</ul>
${ss('<code class="i">BIT</code> → <code class="i">boolean</code> (true/false, not 1/0) · <code class="i">DATETIME2</code> → <code class="i">timestamp</code> · <code class="i">DATETIMEOFFSET</code> → <code class="i">timestamptz</code> (but it stores <b>one UTC instant</b>, not an offset) · <code class="i">GETDATE()</code> → <code class="i">now()</code> · <code class="i">DATEADD</code> → <code class="i">+ interval</code>.')}` },

  { t: 'Everyday example first: one moment, three clocks', body: `
${clocks()}
<p style="font-size:23px;margin:0">A meeting at 09:00 in Hanoi is <b>one</b> moment. A colleague in New York sees <b>22:00 the day before</b>. A good database stores the moment <i>once</i> and lets each viewer see it on their own clock.</p>` },

  { t: 'boolean: true, false — and NULL', body: `
${zm(run(`CREATE TABLE task (id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title text, pinned boolean, done boolean);
INSERT INTO task (title, pinned, done) VALUES
  ('write notes', true, false), ('buy coffee', false, NULL), ('read docs', 't', 'yes');
SELECT * FROM task;`, `CREATE TABLE
INSERT 0 3

 id |    title    | pinned | done
----+-------------+--------+------
  1 | write notes | t      | f
  2 | buy coffee  | f      |
  3 | read docs   | t      | t
(3 rows)`, { hlOut: [7] }), 0.95)}
<ul style="font-size:22px">
<li>Input accepts <code class="i">true / 't' / 'yes' / 'on' / '1'</code>; output is always <code class="i">t</code> or <code class="i">f</code>. An empty cell is <b>NULL</b> = “unknown”.</li>
<li>A boolean needs no comparison: <code class="i">WHERE pinned</code> means <code class="i">WHERE pinned = true</code>.</li>
</ul>` },

  { t: 'The third value: NULL and three-valued logic', body: `
${zm(`<div class="ba"><div>${run(`SELECT title FROM task
WHERE done = false;`, ` title
-------------
 write notes
(1 row)`, {})}</div><div>${run(`SELECT title FROM task
WHERE NOT done;`, ` title
-------------
 write notes
(1 row)`, {})}</div><div>${run(`SELECT title FROM task
WHERE done IS NOT TRUE;`, ` title
-------------
 write notes
 buy coffee
(2 rows)`, { hlOut: [4] })}</div></div>`, 0.98)}
${zm(tbl(['expression', 'result', 'why'], [
  ['true AND NULL', 'NULL', 'unknown could be false'],
  ['false AND NULL', 'false', 'false wins whatever the unknown is'],
  ['true OR NULL', 'true', 'true wins whatever the unknown is'],
  ['NOT NULL', 'NULL', 'the opposite of unknown is unknown'],
], { cap: 'real results from PostgreSQL 17' }), 1.0)}
${box('The trap', '“buy coffee” has <code class="i">done = NULL</code>: it is neither <code class="i">= false</code> nor <code class="i">NOT done</code>. To include unknowns use <code class="i">IS NOT TRUE</code>. And <code class="i">NULL = NULL</code> is NULL — use <code class="i">IS NULL</code>.', 'do2')}` },

  { t: 'The date/time family', body: `
${zm(`<table class="t"><tr><th>Type</th><th>Holds</th><th>Example</th></tr>
<tr><td><code class="i">date</code></td><td>a calendar day, no time</td><td>2026-08-10</td></tr>
<tr><td><code class="i">time</code></td><td>a time of day, no date</td><td>09:30:00</td></tr>
<tr><td><code class="i">timestamp</code></td><td>date + time, <b>no</b> time zone</td><td>2026-08-10 09:00:00</td></tr>
<tr><td><code class="i">timestamptz</code></td><td>date + time as a <b>real moment</b></td><td>2026-08-10 09:00:00+07</td></tr>
<tr><td><code class="i">interval</code></td><td>a duration, not a point</td><td>90 minutes · 3 days</td></tr></table>`, 1.15)}
${ss('<code class="i">DATETIME2</code> = <code class="i">timestamp</code> · <code class="i">DATETIMEOFFSET</code> ≈ <code class="i">timestamptz</code> · <code class="i">DATEDIFF(day, a, b)</code> → <code class="i">b - a</code> · <code class="i">DATEADD(day, 30, d)</code> → <code class="i">d + 30</code>.')}` },

  { t: 'The one that matters: timestamp vs timestamptz', body: `
${zm(run(`SET timezone = 'Asia/Ho_Chi_Minh';
SELECT '2026-08-10 09:00:00'::timestamp      AS ts_no_zone,
       '2026-08-10 09:00:00+00'::timestamptz AS tstz;`, `SET

     ts_no_zone      |          tstz
---------------------+------------------------
 2026-08-10 09:00:00 | 2026-08-10 16:00:00+07
(1 row)`, { hlOut: [5] }), 1.15)}
<ul style="font-size:23px">
<li>Both were given “09:00”. <b>timestamp</b> keeps <code class="i">09:00</code> verbatim — meaningless without knowing whose clock.</li>
<li><b>timestamptz</b> understood “09:00 <b>UTC</b>” and shows it correctly as <code class="i">16:00 +07</code> in a Vietnam session — same moment, local clock.</li>
</ul>` },

  { t: 'What timestamptz really does', body: `
${pipe()}
<ul style="font-size:23px">
<li>It <b>never stores a time zone</b>. On the way in it converts to UTC; on the way out it converts to the <b>session’s</b> <code class="i">timezone</code> setting.</li>
<li>So it is “a moment”, not “a label with a zone”. If you also need the user’s zone later, store it in a <b>separate column</b>.</li>
</ul>
${ss('<code class="i">DATETIMEOFFSET</code> keeps the <i>offset you inserted</i>; PostgreSQL does <b>not</b>. It keeps only the instant.')}` },

  { t: 'Same column, three sessions', body: `
${zm(sql(`INSERT INTO ev (happened_ts, happened_tz)         -- session zone: Hanoi
VALUES ('2026-08-10 09:00:00', '2026-08-10 09:00:00');

SET timezone = 'UTC';              SELECT happened_ts, happened_tz FROM ev;
SET timezone = 'America/New_York'; SELECT happened_ts, happened_tz FROM ev;`, { sm: true, hl: [4, 5] }), 1.0)}
${zm(tbl(['session zone', 'timestamp (no tz)', 'timestamptz'], [
  ['Asia/Ho_Chi_Minh', '2026-08-10 09:00:00', '2026-08-10 09:00:00+07'],
  ['UTC', '2026-08-10 09:00:00', '2026-08-10 02:00:00+00'],
  ['America/New_York', '2026-08-10 09:00:00', '2026-08-09 22:00:00-04'],
], { cap: 'real output of the three SELECTs', o: [[1, 2], [2, 2]] }), 1.15)}
${box('Read it', 'The plain <code class="i">timestamp</code> never changes — 09:00 in every session. The <code class="i">timestamptz</code> column is the <b>same moment</b>, shown on each session’s own clock.', 'xanh')}` },

  { t: 'AT TIME ZONE: read another clock', body: `
${zm(sql(`SELECT '2026-08-10 09:00:00+07'::timestamptz AT TIME ZONE 'UTC';
SELECT '2026-08-10 09:00:00+07'::timestamptz AT TIME ZONE 'America/New_York';
SELECT '2026-08-10 09:00:00'::timestamp      AT TIME ZONE 'Asia/Ho_Chi_Minh';`, { sm: true }), 1.05)}
${zm(tbl(['query', 'result', 'type of result'], [
  ['timestamptz AT TIME ZONE \'UTC\'', '2026-08-10 02:00:00', 'timestamp'],
  ['timestamptz AT TIME ZONE \'America/New_York\'', '2026-08-09 22:00:00', 'timestamp'],
  ['timestamp AT TIME ZONE \'Asia/Ho_Chi_Minh\'', '2026-08-10 09:00:00+07', 'timestamptz'],
], { cap: 'real results from PostgreSQL 17', o: [[0, 1], [1, 1], [2, 1]] }), 1.0)}
${two(box('timestamptz  →  timestamp', 'Gives the <b>wall-clock</b> reading in that zone (no zone attached).', 'info'), box('timestamp  →  timestamptz', 'Says “this wall-clock reading <b>belongs to</b> that zone” and pins a moment.', 'xanh'))}` },

  { t: 'Same moment, different notation', body: `
${zm(run(`SELECT '2026-08-10 02:00:00+00'::timestamptz = '2026-08-10 09:00:00+07'::timestamptz AS same_moment,
       '2026-08-10 09:00:00'::timestamp = '2026-08-10 02:00:00'::timestamp AS naive_same;`, ` same_moment | naive_same
-------------+------------
 t           | f
(1 row)`, { hlOut: [3] }), 1.2)}
${two(box('timestamptz compares MOMENTS', '02:00 UTC and 09:00 +07 are <b>equal</b> — it does not matter how you wrote them.', 'xanh'), box('timestamp compares NUMBERS', '09:00 and 02:00 are different clock readings — it has no idea they might be the same moment.', 'do2'))}
<p style="font-size:22px;margin:0">This is why a log merged from servers in two countries is only trustworthy if every timestamp is a <code class="i">timestamptz</code>.</p>` },

  { t: 'date, time, interval — the basics', body: `
${zm(run(`SELECT '2026-08-10'::date AS d, '09:30:00'::time AS t, '90 minutes'::interval AS i,
       '1 year 2 months 3 days'::interval AS i2;`, `     d      |    t     |    i     |          i2
------------+----------+----------+----------------------
 2026-08-10 | 09:30:00 | 01:30:00 | 1 year 2 mons 3 days
(1 row)`, {}), 1.15)}
${zm(run(`SELECT '2026-08-10'::date + 30                      AS plus_30_days,
       '2026-08-10'::date - '2026-07-01'::date  AS days_between;`, ` plus_30_days | days_between
--------------+--------------
 2026-09-09   |           40
(1 row)`, { hlOut: [3] }), 1.15)}
<p style="font-size:22px;margin:0"><code class="i">date + integer</code> adds days; <code class="i">date − date</code> is a plain integer count of days; <code class="i">timestamp − timestamp</code> is an <code class="i">interval</code>.</p>` },

  { t: 'Months are not a fixed length', body: `
${zm(run(`SELECT '2026-01-31'::date + interval '1 month' AS jan31_plus_month,
       '2026-03-31'::date - interval '1 month' AS mar31_minus_month;`, `  jan31_plus_month   |  mar31_minus_month
---------------------+---------------------
 2026-02-28 00:00:00 | 2026-02-28 00:00:00
(1 row)`, { hlOut: [3] }), 1.2)}
<ul style="font-size:23px">
<li>There is no 31 February, so PostgreSQL <b>clamps</b> to the end of the month: Jan 31 + 1 month = <b>Feb 28</b>.</li>
<li>Adding one month, then subtracting one month, does <b>not</b> always return you to the start. Add to the <i>original</i> date instead of chaining.</li>
<li>Note the result became a <code class="i">timestamp</code> (00:00:00) because an interval carries time.</li>
</ul>` },

  { t: 'Daylight saving: 1 hour is not 1 day', body: `
${zm(run(`SET timezone = 'America/New_York';
SELECT '2026-03-08 01:30:00-05'::timestamptz                        AS before_gap,
       '2026-03-08 01:30:00-05'::timestamptz + interval '1 hour'   AS plus_1h,
       '2026-03-08 01:30:00-05'::timestamptz + interval '1 day'    AS plus_1d;`, `       before_gap       |        plus_1h         |        plus_1d
------------------------+------------------------+------------------------
 2026-03-08 01:30:00-05 | 2026-03-08 03:30:00-04 | 2026-03-09 01:30:00-04
(1 row)`, { hlOut: [3] }), 1.0)}
<ul style="font-size:22px">
<li>On 8 March 2026 New York clocks jump from 02:00 to 03:00. <code class="i">+ 1 hour</code> lands on <b>03:30</b> (the 02:xx hour never existed).</li>
<li><code class="i">+ 1 day</code> means “same wall-clock time tomorrow” → <b>01:30</b> next day, only 23 real hours later. PostgreSQL does the calendar work for you.</li>
</ul>` },

  { t: 'age(), extract(), date_trunc(), to_char()', body: `
${zm(sql(`SELECT age('2026-08-10'::date, '2000-01-01'::date);
SELECT '2026-08-10 17:45:00+07'::timestamptz - '2026-08-10 09:00:00+07'::timestamptz;
SELECT extract(year FROM '2026-08-10 09:00:00+07'::timestamptz), extract(dow FROM '2026-08-10'::date);
SELECT date_trunc('month', '2026-08-10 09:00:00+07'::timestamptz);
SELECT to_char('2026-08-10 09:00:00+07'::timestamptz, 'DD/MM/YYYY HH24:MI');`, { sm: true }), 1.0)}
${zm(tbl(['function', 'real result', 'meaning'], [
  ['age(date, date)', '26 years 7 mons 9 days', 'human-readable gap'],
  ['timestamptz − timestamptz', '08:45:00', 'an interval: hours worked'],
  ['extract(year / dow …)', '2026 · 1', 'dow: Sunday = 0, so Monday = 1'],
  ['date_trunc(\'month\', …)', '2026-08-01 00:00:00+07', 'round down to the month'],
  ['to_char(…, \'DD/MM/YYYY HH24:MI\')', '10/08/2026 09:00', 'format for display'],
], { cap: 'real results from PostgreSQL 17' }), 1.0)}` },

  { t: 'now() vs clock_timestamp()', body: `
${zm(sql(`BEGIN;
SELECT now() = now()             AS same_inside_tx;     -- true
SELECT pg_sleep(0.01);
SELECT now() = clock_timestamp() AS now_vs_clock;       -- false
COMMIT;`, { sm: true, hl: [2, 4] }), 1.1)}
${zm(tbl(['query', 'real result'], [
  ['now() = now()', 't — same transaction, same timestamp'],
  ['now() = clock_timestamp()  (after pg_sleep)', 'f — the real clock has moved on'],
], { hl: [0] }), 1.1)}
<ul style="font-size:23px">
<li><code class="i">now()</code> returns the <b>start of the transaction</b> — every row inserted in one statement/transaction shares the same timestamp.</li>
<li><code class="i">clock_timestamp()</code> reads the real clock each call — use it only when you truly need elapsed time <i>inside</i> a transaction.</li>
</ul>` },

  { t: 'Choosing — and the trap that appears in October', body: `
${zm(vsd(
  `<p style="font-size:20px;margin:0">column <code class="i">created_at timestamp</code></p><ul style="font-size:18px;margin:6px 0 0;padding-left:22px"><li>Works while everyone shares one time zone</li><li>Then: a daylight-saving change, a server in another region, a user abroad…</li><li>Rows from Hanoi and London <b>look identical</b> — nothing records which is which</li><li>You cannot repair it afterwards: the information was never stored</li></ul>`,
  `<p style="font-size:20px;margin:0">column <code class="i">created_at timestamptz</code></p><ul style="font-size:18px;margin:6px 0 0;padding-left:22px"><li><b>Default for every event</b>: created_at, updated_at, published_at</li><li><code class="i">date</code> for a calendar fact (birthday, invoice day)</li><li><code class="i">interval</code> for durations</li><li>Store the user’s zone in a <b>separate</b> column if you need local time later</li></ul>`), 1.25)}` },

  { t: 'In production: CT Shop and cuongthai.com', body: `
${zm(two(sql(`-- CT Shop (Lab 1)
CREATE TABLE customer (
  ...
  created_at timestamptz NOT NULL
             DEFAULT now(),
  ...
);`, { sm: true, hl: [5, 6] }), sql(`// cuongthai.com — prisma/schema.prisma
createdAt DateTime @default(now())
          @map("created_at")
// the ONE exception:
updatedAt DateTime @default(now())
          @db.Timestamptz(6)`, { sm: true, lang: 'typescript', hl: [2, 6] }), ''), 1.05)}
<ul style="font-size:21px">
<li>CT Shop does it right: <code class="i">timestamptz DEFAULT now()</code>.</li>
<li><b>Honest note:</b> Prisma’s <code class="i">DateTime</code> becomes <code class="i">timestamp(3)</code> <b>without</b> time zone unless you add <code class="i">@db.Timestamptz(6)</code>. The cuongthai.com migrations create <code class="i">created_at TIMESTAMP(3)</code> almost everywhere — the app relies on a <b>convention that every value is UTC</b>.</li>
<li>It works, but the database cannot protect you; for a new project add <code class="i">@db.Timestamptz(6)</code>.</li>
</ul>` },

  { t: 'Exercise: the New York colleague', to: true, body: `
<p style="margin:0">A meeting is fixed for <b>2026-08-10 09:00 in Hanoi (+07)</b>.</p>
<ol>
<li>What local time and date does a colleague in <b>New York</b> see? Predict, then run it.</li>
<li>Which type would you use for the meeting’s start, and for its length?</li>
</ol>
${zm(run(`SELECT '2026-08-10 09:00:00+07'::timestamptz AT TIME ZONE 'America/New_York' AS ny_clock;`, `      ny_clock
---------------------
 2026-08-09 22:00:00
(1 row)`, { hlOut: [3] }), 1.1)}
${box('Answer', '22:00 on <b>9 August</b> (the previous day!). Start = <code class="i">timestamptz</code>, length = <code class="i">interval</code>.', 'xanh')}` },

  { t: 'Check yourself', to: true, giua: true, body: `
<ol>
<li>Why does <code class="i">WHERE NOT done</code> miss rows where <code class="i">done</code> is NULL?</li>
<li>What exactly does <code class="i">timestamptz</code> store — and what does it <b>not</b> store?</li>
<li>Why is <code class="i">'2026-01-31' + interval '1 month'</code> not 3 March?</li>
</ol>
${box('Answers', '1) NOT NULL is NULL, and WHERE keeps only true — use IS NOT TRUE. 2) One UTC instant; it does <b>not</b> store a zone — values are converted to the session zone on output. 3) PostgreSQL clamps to the last day of the month: 28 February.', 'xanh')}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li><b>boolean</b> has three values — remember NULL; use <code class="i">IS NOT TRUE</code></li>
<li><b>timestamptz</b> for every real moment; <code class="i">timestamp</code> almost never</li>
<li><code class="i">AT TIME ZONE</code> switches clock readings; <code class="i">interval</code> math follows the calendar (months, DST)</li>
<li><code class="i">now()</code> = transaction start; <code class="i">clock_timestamp()</code> = real clock</li>
<li>Next: <b>2.4 — UUID, enum, array & jsonb</b></li>
</ul>
${box('Practice', 'See one moment on two clocks in the PostgreSQL track on Code Lab — <b>cuongthai.com/code-lab</b>', 'lam')}` },
]);
