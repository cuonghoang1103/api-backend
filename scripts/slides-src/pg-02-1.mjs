/**
 * pg-02-1 — PostgreSQL · Chapter 2 · Lesson 2.1 "Numbers: integers, numeric & the money trap" (slide EN, kiểu FU, 25/10/2026).
 * Nguồn: content/courses/postgresql/s02-kieu-du-lieu.mjs › postgresql-2-1-so. Output psql = chạy thật PostgreSQL 17.11
 * (video-bai-giang/src/khung/pg/that/pg-02-1.out.txt). Bổ sung: ba cốc dung tích, thước byte, bảng "bao lâu thì int cạn", 1/3 thập phân vs 0.1 nhị phân,
 * lỗi cộng dồn 1 triệu lần 0.1, lỗi xu floor(0.57*100)=56, làm tròn float vs numeric, đối chiếu SQL Server.
 */
import { lamDeck, sql, psql, run, tbl, two, box, steps, cards, kw, vsd, c } from './_pg-chung.mjs';

const zm = (h, z = 1.3) => `<div style="zoom:${z}">${h}</div>`;
const ss = (t) => box('🔁 Coming from SQL Server?', t, 'lam');
export const deck = { key: 'pg-02-1', code: 'PG 2.1', title: 'Numbers: integers, numeric & the money trap', sub: 'smallint · int · bigint · identity · numeric vs float' };

/* Ba cốc: dung tích khác nhau. */
const cups = () => `<svg viewBox="0 0 1110 330" width="1110" height="330" font-family="Arial">
  <g data-k="cup-s"><path d="M110,200 L110,250 Q110,262 122,262 L238,262 Q250,262 250,250 L250,200" fill="#eef4fa" stroke="#336791" stroke-width="4"/>
  <rect x="113" y="218" width="134" height="42" fill="#336791" opacity=".55"/>
  <text x="180" y="190" text-anchor="middle" font-size="20" font-weight="700" fill="#336791">smallint</text>
  <text x="180" y="292" text-anchor="middle" font-size="19" fill="#555">2 bytes · ±32,767</text></g>
  <g data-k="cup-i"><path d="M440,140 L440,250 Q440,262 452,262 L608,262 Q620,262 620,250 L620,140" fill="#fff7ef" stroke="#e08a1e" stroke-width="4"/>
  <rect x="443" y="170" width="174" height="90" fill="#e08a1e" opacity=".55"/>
  <text x="530" y="130" text-anchor="middle" font-size="22" font-weight="700" fill="#b85a2b">integer</text>
  <text x="530" y="292" text-anchor="middle" font-size="19" fill="#555">4 bytes · ±2.1 billion</text></g>
  <g data-k="cup-b"><path d="M770,40 L770,250 Q770,262 782,262 L988,262 Q1000,262 1000,250 L1000,40" fill="#f1f9f4" stroke="#2f7d4f" stroke-width="4"/>
  <rect x="773" y="110" width="224" height="150" fill="#2f7d4f" opacity=".55"/>
  <text x="885" y="30" text-anchor="middle" font-size="22" font-weight="700" fill="#1f6b40">bigint</text>
  <text x="885" y="292" text-anchor="middle" font-size="19" fill="#555">8 bytes · ±9.2 quintillion</text></g>
  <path d="M180,60 L180,150" stroke="#c0392b" stroke-width="5"/><path d="M164,138 L180,162 L196,138 z" fill="#c0392b"/>
  <text x="180" y="45" text-anchor="middle" font-size="20" font-weight="800" fill="#c0392b" data-k="over">pour 32,768 →</text>
  <text x="270" y="78" font-size="21" font-weight="800" fill="#c0392b">ERROR: out of range</text>
  <text x="270" y="102" font-size="18" fill="#666">the cup never “wraps around” silently</text>
</svg>`;

/* Thước byte tỉ lệ. */
const bars = () => `<svg viewBox="0 0 1110 130" width="1110" height="130" font-family="Arial">
  <g font-size="20" font-weight="700">
  <text x="0" y="28" fill="#336791">smallint</text><rect data-k="bar-s" x="130" y="10" width="140" height="26" rx="5" fill="#336791"/><text x="282" y="30" font-size="18" fill="#555" font-weight="400">2 bytes</text>
  <text x="0" y="68" fill="#b85a2b">integer</text><rect data-k="bar-i" x="130" y="50" width="280" height="26" rx="5" fill="#e08a1e"/><text x="422" y="70" font-size="18" fill="#555" font-weight="400">4 bytes</text>
  <text x="0" y="108" fill="#1f6b40">bigint</text><rect data-k="bar-b" x="130" y="90" width="560" height="26" rx="5" fill="#2f7d4f"/><text x="702" y="110" font-size="18" fill="#555" font-weight="400">8 bytes — twice the size, 4 billion × the range</text>
  </g></svg>`;

/* 1/3 thập phân vs 0.1 nhị phân. */
const whyFloat = () => `<svg viewBox="0 0 1110 300" width="1110" height="300" font-family="Arial">
  <g data-k="dec"><rect x="20" y="10" width="520" height="280" rx="12" fill="#fff7ef" stroke="#e08a1e" stroke-width="3"/>
  <text x="280" y="46" text-anchor="middle" font-size="23" font-weight="800" fill="#b85a2b">In DECIMAL (base 10)</text>
  <text x="280" y="100" text-anchor="middle" font-size="40" font-weight="800" fill="#333" font-family="Menlo,monospace">1/3 = 0.3333…</text>
  <text x="280" y="140" text-anchor="middle" font-size="21" fill="#555">never ends — write it on paper and you must STOP</text>
  <text x="280" y="190" text-anchor="middle" font-size="30" font-weight="700" fill="#c0392b" font-family="Menlo,monospace">0.333 × 3 = 0.999</text>
  <text x="280" y="228" text-anchor="middle" font-size="21" fill="#555">…so 3 × (1/3) is “not quite” 1</text>
  <text x="280" y="268" text-anchor="middle" font-size="19" fill="#777">1/10 is easy in decimal: 0.1</text></g>
  <path d="M556,150 L586,150" stroke="#404040" stroke-width="4"/><path d="M582,140 L600,150 L582,160 z" fill="#404040"/>
  <g data-k="bin"><rect x="610" y="10" width="480" height="280" rx="12" fill="#eef4fa" stroke="#336791" stroke-width="3"/>
  <text x="850" y="46" text-anchor="middle" font-size="23" font-weight="800" fill="#245077">In BINARY (base 2) — float</text>
  <text x="850" y="96" text-anchor="middle" font-size="31" font-weight="800" fill="#333" font-family="Menlo,monospace">0.1 = 0.000110011…</text>
  <text x="850" y="130" text-anchor="middle" font-size="21" fill="#555">the pattern 0011 repeats forever</text>
  <text x="850" y="176" text-anchor="middle" font-size="19" fill="#555">a double keeps only 53 bits, so it stores</text>
  <text x="850" y="212" text-anchor="middle" font-size="22" font-weight="700" fill="#c0392b" font-family="Menlo,monospace">0.1000000000000000055511…</text>
  <text x="850" y="262" text-anchor="middle" font-size="19" fill="#777">close to 0.1 — but never exactly 0.1</text></g>
</svg>`;

/* Cây quyết định chọn kiểu số. */
const pick = () => `<svg viewBox="0 0 1110 300" width="1110" height="300" font-family="Arial">
  <defs><marker id="a2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#b85a2b"/></marker></defs>
  <rect data-k="q" x="10" y="100" width="250" height="90" rx="12" fill="#fffaf5" stroke="#b85a2b" stroke-width="3"/>
  <text x="135" y="138" text-anchor="middle" font-size="21" font-weight="800" fill="#b85a2b">What are you</text><text x="135" y="166" text-anchor="middle" font-size="21" font-weight="800" fill="#b85a2b">storing?</text>
  <path d="M260,125 L330,45" stroke="#b85a2b" stroke-width="3" marker-end="url(#a2)"/><path d="M260,145 L330,145" stroke="#b85a2b" stroke-width="3" marker-end="url(#a2)"/><path d="M260,165 L330,250" stroke="#b85a2b" stroke-width="3" marker-end="url(#a2)"/>
    <g data-k="r-int"><rect x="335" y="10" width="360" height="72" rx="10" fill="#eef4fa" stroke="#336791" stroke-width="3"/>
  <text x="515" y="40" text-anchor="middle" font-size="22" font-weight="800" fill="#245077">integer / bigint</text><text x="515" y="66" text-anchor="middle" font-size="17" fill="#555">ids and counts — exact whole numbers</text></g>
  <g data-k="r-num"><rect x="335" y="110" width="360" height="72" rx="10" fill="#f1f9f4" stroke="#2f7d4f" stroke-width="3"/>
  <text x="515" y="140" text-anchor="middle" font-size="22" font-weight="800" fill="#1f6b40">numeric(12,2)</text><text x="515" y="166" text-anchor="middle" font-size="17" fill="#555">exact decimal — for money</text></g>
  <g data-k="r-flt"><rect x="335" y="214" width="360" height="72" rx="10" fill="#fff7ef" stroke="#e08a1e" stroke-width="3"/>
  <text x="515" y="244" text-anchor="middle" font-size="22" font-weight="800" fill="#b85a2b">double precision</text><text x="515" y="270" text-anchor="middle" font-size="17" fill="#555">approximate BY DESIGN</text></g>
  <g font-size="19" fill="#333"><text x="725" y="36" font-weight="800" fill="#245077">id, likes, stock</text><text x="725" y="62" fill="#555">exact, fastest, 4 or 8 bytes</text>
  <text x="725" y="136" font-weight="800" fill="#1f6b40">price, balance, VAT</text><text x="725" y="162" fill="#555">slower than float — worth every tick</text>
  <text x="725" y="240" font-weight="800" fill="#b85a2b">temperature, ML score</text><text x="725" y="266" fill="#555">tiny error is fine here</text></g>
</svg>`;

export const slides = lamDeck({ chuong: 'Chapter 2 — Data types', bai: '2.1' }, [
  { cover: true, t: 'Numbers: integers,<br>numeric & the money trap', sub: 'Which number type for which job —<br>and why money never goes in a float.' },

  { t: 'What you will get from this lesson', to: true, body: `
<ul>
<li>The <b>three integer sizes</b> — and what happens when a value does not fit</li>
<li><b>Identity columns</b>: automatic ids, and why <code class="i">GENERATED ALWAYS</code> beats the old <code class="i">serial</code></li>
<li>Why <b>0.1 + 0.2 ≠ 0.3</b> in a float — shown on a real server</li>
<li><b>numeric(p,s)</b>: exact decimals for money, and how rounding works</li>
<li>A <b>decision rule</b> you can apply to any column in 5 seconds</li>
</ul>
${ss('<code class="i">INT IDENTITY(1,1)</code> → <code class="i">int GENERATED ALWAYS AS IDENTITY</code> · <code class="i">DECIMAL(12,2)</code> = <code class="i">numeric(12,2)</code> · <code class="i">FLOAT</code> = <code class="i">double precision</code> · <code class="i">REAL</code> = <code class="i">real</code>. There is no <code class="i">TINYINT</code> — use <code class="i">smallint</code>.')}` },

  { t: 'Everyday example first: a type is a cup', body: `
${cups()}
<p style="font-size:24px;margin:0">Every column has a <b>type</b>, and a type is a <b>promise about what fits</b>. A small cup holds a little, a big tank holds a lot — and pouring too much is refused with an error, never a silent spill.</p>
${two(box('Why it helps', 'A wrong value is caught <b>the moment it is inserted</b>, not three months later in a report.', 'xanh'), box('Why it costs', 'A bigger cup uses more disk and memory on <b>every row</b> — so do not pick the biggest by habit.', ''))}` },

  { t: 'The integer family', body: `
${zm(`<table class="t"><tr><th>Type</th><th>Size</th><th>Range</th><th>Use it for</th></tr>
<tr><td><code class="i">smallint</code></td><td>2 bytes</td><td>−32,768 … 32,767</td><td>small counters, ages, a rating 1–5</td></tr>
<tr><td><code class="i">integer</code> (<code class="i">int</code>)</td><td>4 bytes</td><td>±2,147,483,647</td><td>the default whole number</td></tr>
<tr><td><code class="i">bigint</code></td><td>8 bytes</td><td>±9.2 × 10<sup>18</sup></td><td>primary keys, anything that can explode</td></tr></table>`, 1.15)}
${bars()}
${box('Rule', 'Pick the <b>smallest type that still fits comfortably</b> — it saves space and documents your intent.', 'xanh')}` },

  { t: 'Out of range is an ERROR, never a wrap-around', body: `
${zm(run(`SELECT 32767::smallint + 1::smallint;`, `ERROR:  smallint out of range`, { hlOut: [1] }), 0.95)}
${zm(run(`SELECT 2147483647::int + 1;`, `ERROR:  integer out of range`, { hlOut: [1] }), 0.95)}
${zm(run(`SELECT 2147483647::bigint + 1;`, ` ?column?
------------
 2147483648
(1 row)`, {}), 0.95)}
${box('A feature, not a bug', 'C and many languages silently wrap past the maximum to a wrong number. PostgreSQL refuses — corrupt data never gets in. The <b>bigint</b> version of the same sum simply works.', 'xanh')}` },

  { t: 'Number literals have types too', body: `
${zm(run(`SELECT pg_typeof(1)          AS small_lit,
       pg_typeof(3000000000) AS big_lit,
       pg_typeof(1.5)        AS dec_lit;`, ` small_lit | big_lit | dec_lit
-----------+---------+---------
 integer   | bigint  | numeric
(1 row)`, {}), 0.95)}
${zm(run(`SELECT 10 / 4   AS int_div,
       10 / 4.0 AS dec_div;`, ` int_div |      dec_div
---------+--------------------
       2 | 2.5000000000000000
(1 row)`, { hlOut: [2] }), 0.95)}
${two(box('Integer ÷ integer = integer', '<code class="i">10 / 4</code> is <b>2</b> — the fraction is dropped, no warning. Same as in SQL Server.', 'do2'), box('Make one side decimal', '<code class="i">10 / 4.0</code> or <code class="i">10::numeric / 4</code> gives <b>2.5</b>. A plain <code class="i">1.5</code> literal is <b>numeric</b>, not float.', 'xanh'))}` },

  { t: 'Why ids should be bigint', body: `
${zm(`<table class="t"><tr><th>New rows per second</th><th>Days until <code class="i">integer</code> runs out</th><th><code class="i">bigint</code> lasts</th></tr>
<tr><td>10</td><td>2,485 days (6.8 years)</td><td rowspan="4" style="vertical-align:middle;text-align:center;font-weight:800;color:#1f6b40;font-size:19px">29 million<br>years<br>even at 10,000/s</td></tr>
<tr><td>100</td><td>248 days</td></tr>
<tr><td>1,000</td><td class="do">24.9 days</td></tr>
<tr><td>10,000</td><td class="do">2.5 days</td></tr></table>`, 1.2)}
${two(box('The expensive surprise', 'Changing a key from <code class="i">int</code> to <code class="i">bigint</code> later means <b>rewriting every row</b> of a live table (and every table that references it).', 'do2'),
box('Cheap insurance', 'For a table that may grow large — events, logs, orders, messages — start with <b>bigint</b>. The extra 4 bytes per row cost almost nothing.', 'xanh'))}` },

  { t: 'Automatic ids: IDENTITY', body: `
${zm(run(`CREATE TABLE t_id (
  id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  x  text
);
INSERT INTO t_id (x) VALUES ('a'), ('b');   -- id filled: 1, 2
INSERT INTO t_id (id, x) VALUES (99, 'c');  -- we force an id`, `INSERT 0 2

ERROR:  cannot insert a non-DEFAULT value into column "id"
DETAIL:  Column "id" is an identity column defined as
         GENERATED ALWAYS.
HINT:  Use OVERRIDING SYSTEM VALUE to override.`, { hl: [5, 6], hlOut: [3, 4] }), 1.12)}
<ul style="font-size:23px">
<li><code class="i">GENERATED ALWAYS</code> = the <b>database owns</b> this column — even you cannot slip a value in by accident</li>
<li>The error names the escape hatch: <code class="i">OVERRIDING SYSTEM VALUE</code>, for the rare deliberate import</li>
</ul>` },

  { t: 'ALWAYS, BY DEFAULT, serial — and gaps', body: `
${zm(`<table class="t"><tr><th>Style</th><th>You may set id yourself?</th><th>Verdict</th></tr>
<tr><td><code class="i">GENERATED ALWAYS AS IDENTITY</code></td><td>No (unless OVERRIDING)</td><td class="xanh">default choice</td></tr>
<tr><td><code class="i">GENERATED BY DEFAULT AS IDENTITY</code></td><td>Yes</td><td>for data imports</td></tr>
<tr><td><code class="i">serial</code> / <code class="i">bigserial</code></td><td>Yes</td><td class="do">old style — you will still meet it</td></tr></table>`, 0.92)}
${zm(run(`BEGIN;
INSERT INTO t_id (x) VALUES ('rolled back');
ROLLBACK;
INSERT INTO t_id (x) VALUES ('c');
SELECT * FROM t_id ORDER BY id;`, ` id | x
----+---
  1 | a
  2 | b
  4 | c
(3 rows)`, { hlOut: [5] }), 0.92)}
${box('Gaps are normal', 'The rolled-back insert still <b>used up id 3</b>: ids are unique, not consecutive.', 'lam')}` },

  { t: 'The money trap: 0.1 + 0.2', body: `
${zm(run(`SELECT 0.1::float8 + 0.2::float8          AS float_sum,
       0.1::numeric + 0.2::numeric        AS numeric_sum,
       (0.1::float8 + 0.2::float8 = 0.3)  AS float_eq_03;`, `      float_sum      | numeric_sum | float_eq_03
---------------------+-------------+-------------
 0.30000000000000004 |         0.3 | f
(1 row)`, { hlOut: [3] }), 1.2)}
<ul style="font-size:24px">
<li><b>float8</b> (<code class="i">double precision</code>): 0.1 + 0.2 = <span class="do">0.30000000000000004</span>, and comparing it to 0.3 is <b>false</b></li>
<li><b>numeric</b>: exactly <span class="xanh">0.3</span> — decimal arithmetic, like on paper</li>
</ul>
${box('Not a PostgreSQL bug', 'Every language using standard floats (JavaScript, Python, Java, C#, SQL Server <code class="i">FLOAT</code>) prints the same thing. The type is simply the wrong tool for money.', 'lam')}` },

  { t: 'Why a float cannot hold 0.1', body: `
${whyFloat()}
<p style="font-size:23px;margin:0">Computers count in <b>binary</b>. Some fractions that look short in base 10 (0.1, 0.2, 0.3) repeat forever in base 2 — so a float stores the <b>nearest</b> value it can, and tiny errors appear.</p>
${two(box('numeric works like paper', 'It stores decimal digits as decimal digits: 0.1 is exactly <b>0.1</b>, and 0.1 + 0.2 is exactly <b>0.3</b>.', 'xanh'), box('The price', 'Exactness costs speed: numeric math is slower than float math — a good trade for money, a bad one for 3-D graphics.', ''))}` },

  { t: 'Tiny errors add up', body: `
${zm(run(`SELECT sum(0.1::float8)  AS float_total,
       sum(0.1::numeric) AS numeric_total
FROM generate_series(1, 10);`, `    float_total     | numeric_total
--------------------+---------------
 0.9999999999999999 |           1.0
(1 row)`, { hlOut: [3] }), 0.9)}
${zm(run(`SELECT sum(0.1::float8)  AS float_total,
       sum(0.1::numeric) AS numeric_total
FROM generate_series(1, 1000000);`, `    float_total     | numeric_total
--------------------+---------------
 100000.00000133288 |      100000.0
(1 row)`, { hlOut: [3] }), 0.9)}
${box('One million additions', 'Float is off by <b>0.0000013</b> — invisible in one row, a failed audit across a million. numeric: <b>exactly</b> 100000.0.', 'do2')}` },

  { t: 'The cents bug', body: `
${zm(run(`SELECT 19.99::float8 * 100         AS f_cents,
       floor(0.57::float8 * 100)     AS floor_float,
       floor(0.57::numeric * 100)    AS floor_numeric;`, `      f_cents       | floor_float | floor_numeric
--------------------+-------------+---------------
 1998.9999999999998 |          56 |            57
(1 row)`, { hlOut: [3] }), 1.2)}
${zm(vsd(`<p style="font-size:20px;margin:0">price <code class="i">double precision</code></p><p style="font-size:19px;margin:6px 0 0"><code class="i">19.99 × 100</code> → 1998.9999999999998<br><code class="i">floor(0.57 × 100)</code> → <b>56</b> cents</p><p style="font-size:19px;margin:6px 0 0">A cent vanishes — and <code class="i">WHERE price = 19.99</code> may match nothing.</p>`,
`<p style="font-size:20px;margin:0">price <code class="i">numeric(12,2)</code></p><p style="font-size:19px;margin:6px 0 0"><code class="i">19.99 × 100</code> → 1999.00<br><code class="i">floor(0.57 × 100)</code> → <b>57</b> cents</p><p style="font-size:19px;margin:6px 0 0">Exact — same answer as on paper, every time.</p>`), 1.25)}` },

  { t: 'numeric(precision, scale)', body: `
${zm(run(`SELECT 123.456::numeric(12,2) AS money;
SELECT 99999999999.999::numeric(12,2) AS too_big;`, ` money
--------
 123.46
(1 row)

ERROR:  numeric field overflow
DETAIL:  A field with precision 12, scale 2 must round to an
         absolute value less than 10^10.`, { hlOut: [2, 6] }), 1.15)}
<svg viewBox="0 0 1110 110" width="1110" height="110" font-family="Menlo,monospace" data-k="digits">
  <g font-size="30" font-weight="800">
  <rect x="120" y="22" width="40" height="46" fill="#eef4fa" stroke="#336791" stroke-width="2"/><rect x="160" y="22" width="40" height="46" fill="#eef4fa" stroke="#336791" stroke-width="2"/><rect x="200" y="22" width="40" height="46" fill="#eef4fa" stroke="#336791" stroke-width="2"/><rect x="240" y="22" width="40" height="46" fill="#eef4fa" stroke="#336791" stroke-width="2"/><rect x="280" y="22" width="40" height="46" fill="#eef4fa" stroke="#336791" stroke-width="2"/><rect x="320" y="22" width="40" height="46" fill="#eef4fa" stroke="#336791" stroke-width="2"/><rect x="360" y="22" width="40" height="46" fill="#eef4fa" stroke="#336791" stroke-width="2"/><rect x="400" y="22" width="40" height="46" fill="#eef4fa" stroke="#336791" stroke-width="2"/><rect x="440" y="22" width="40" height="46" fill="#eef4fa" stroke="#336791" stroke-width="2"/><rect x="480" y="22" width="40" height="46" fill="#eef4fa" stroke="#336791" stroke-width="2"/>
  <text x="545" y="62" fill="#333">.</text>
  <rect x="570" y="22" width="40" height="46" fill="#fff3c4" stroke="#e08a1e" stroke-width="2"/><rect x="610" y="22" width="40" height="46" fill="#fff3c4" stroke="#e08a1e" stroke-width="2"/></g>
  <text x="300" y="98" text-anchor="middle" font-size="19" fill="#245077" font-family="Arial" font-weight="700">10 digits before the point</text>
  <text x="610" y="98" text-anchor="middle" font-size="19" fill="#b85a2b" font-family="Arial" font-weight="700">2 after (scale)</text>
  <text x="700" y="56" font-size="22" fill="#555" font-family="Arial">= precision 12 in total</text>
</svg>
<p style="font-size:22px;margin:4px 0 0"><b>(12,2)</b> = 12 digits in total, 2 of them after the point. It <b>rounds</b> extra decimals and <b>refuses</b> numbers too big for the 10 leading digits.</p>` },

  { t: 'Rounding: numeric and float disagree', body: `
${zm(run(`SELECT 1.005::numeric(12,2) AS numeric_cents,
       2.5::numeric(12,0)  AS num_2_5,
       3.5::numeric(12,0)  AS num_3_5,
       round(2.5::float8)  AS float_2_5,
       round(3.5::float8)  AS float_3_5;`, ` numeric_cents | num_2_5 | num_3_5 | float_2_5 | float_3_5
---------------+---------+---------+-----------+-----------
          1.01 |       3 |       4 |         2 |         4
(1 row)`, { hlOut: [3] }), 1.1)}
${two(box('numeric: round half up', '2.5 → <b>3</b>, 1.005 → <b>1.01</b>. This is the rule accountants and shoppers expect.', 'xanh'),
box('float: round half to even', '2.5 → <b>2</b>, 3.5 → 4. A different rule on top of the representation error — more surprises.', 'do2'))}
<p style="font-size:22px">Other facts: <code class="i">numeric</code> also has <code class="i">NaN</code>; a column <code class="i">numeric</code> with no (p,s) accepts any size, but for money state your limits.</p>` },

  { t: 'Choosing a number type', body: `
${pick()}
${box('Rule of thumb', 'If a human <b>counts</b> it or is <b>billed</b> for it → <code class="i">numeric</code> or an integer. If a sensor <b>measures</b> it → <code class="i">double precision</code>.', 'xanh')}
${ss('The <code class="i">money</code> type exists in PostgreSQL <i>and</i> in SQL Server — avoid it in both: its format depends on locale and it keeps only 2 decimals. Use <code class="i">numeric(12,2)</code>.')}` },

  { t: 'In production: CT Shop and cuongthai.com', body: `
${zm(two(sql(`-- CT Shop (Lab 1)
CREATE TABLE product (
  id     bigint GENERATED ALWAYS AS IDENTITY
         PRIMARY KEY,
  price  numeric(12,2) NOT NULL
         CHECK (price > 0),
  ...
);`, { sm: true, hl: [3, 5] }), sql(`// cuongthai.com — prisma/schema.prisma
model Course {
  id    Int     @id @default(autoincrement())
  price Decimal @default(0) @db.Decimal(10, 2)
  ...
}`, { sm: true, lang: 'typescript', hl: [3, 4] }), ''), 1.2)}
<ul style="font-size:22px">
<li>Both store prices as <b>exact decimals</b>. <code class="i">Decimal(10,2)</code> tops out at 99,999,999.99 — plenty for a course price.</li>
<li>Prisma’s <code class="i">autoincrement()</code> creates a <b>serial</b> column — the older style; CT Shop uses modern <b>IDENTITY</b>.</li>
<li>Prisma’s <code class="i">Decimal</code> without <code class="i">@db.Decimal(p,s)</code> becomes <code class="i">numeric(65,30)</code> — state your limits.</li>
</ul>
${box('Why show you this?', 'A schema file is a <b>contract</b>: every type above was a deliberate decision about range, exactness and size — the three questions of this lesson.', 'lam')}` },

  { t: 'Exercise: design a wallet table', to: true, body: `
<p style="margin:0">A wallet table stores a <b>balance</b> in VND with 2 decimals, an <b>owner id</b> (millions of users), and a <b>level</b> from 1 to 5.</p>
<ol>
<li>Choose a type for each column.</li>
<li>Predict, then run: is <code class="i">0.1 × 3 = 0.3</code> true for numeric? for float8?</li>
</ol>
${zm(run(`SELECT 0.1::numeric * 3 = 0.3 AS numeric_ok,
       0.1::float8  * 3 = 0.3 AS float_ok;`, ` numeric_ok | float_ok
------------+----------
 t          | f
(1 row)`, { hlOut: [3] }), 0.95)}
${box('Answer', '<code class="i">balance numeric(14,2)</code> · <code class="i">owner_id bigint</code> (or int if truly under 2 billion) · <code class="i">level smallint CHECK (level BETWEEN 1 AND 5)</code>. The float gives 0.30000000000000004, so the comparison is <b>f</b>.', 'xanh')}` },

  { t: 'Check yourself', to: true, giua: true, body: `
<ol>
<li>What happens when <code class="i">2147483647::int + 1</code> is evaluated — and why is that good?</li>
<li>Why is <code class="i">GENERATED ALWAYS AS IDENTITY</code> preferred over <code class="i">serial</code>?</li>
<li>Which type for a shop price, and why not <code class="i">double precision</code>?</li>
</ol>
${box('Answers', '1) ERROR: integer out of range — corrupt values never enter the table. 2) The database owns the id, so nobody can insert one by accident; it is also the SQL standard. 3) <code class="i">numeric(12,2)</code> — exact decimal arithmetic; floats cannot represent 0.1 and errors accumulate.', 'xanh')}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Integers: <b>smallint · int · bigint</b> — out of range is an error; <b>ids → bigint</b></li>
<li><b>IDENTITY</b> (<code class="i">ALWAYS</code>) for automatic keys; gaps are normal</li>
<li><b>Never money in a float</b>: <code class="i">0.1 + 0.2 = 0.30000000000000004</code></li>
<li><b>numeric(p,s)</b> = exact, rounds half up, refuses overflow</li>
<li>Next: <b>2.2 — Text</b>: text, varchar and the char(n) trap</li>
</ul>
${box('Practice', 'See the float drift, then fix it with numeric, in the PostgreSQL track on Code Lab — <b>cuongthai.com/code-lab</b>', 'lam')}` },
]);
