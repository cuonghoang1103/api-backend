/**
 * pg-00-5 — PostgreSQL · Section 0 · Lesson 0.5 "From SQL Server / MySQL to PostgreSQL" (slide EN, kiểu FU, agent c17, 25/10/2026).
 * Nguồn: content/courses/postgresql/s00-intro.mjs › postgresql-0-5-tu-sql-server-mysql (bài MỚI).
 * Output = chạy THẬT cùng một CSDL `ctmini` trên 3 hệ: SQL Server 2022 16.0.4305 (container pgcourse-mssql, amd64/Rosetta, sqlcmd -y 30 -Y 30),
 * MySQL 8.4.13 (pgcourse-mysql, mysql -t), PostgreSQL 17.11 (pgcourse17, psql). Lưu ở video-bai-giang/src/khung/pg/that/pg-00-5{,.mssql,.mysql}.{sql,out.txt}.
 * Dấu nhắc trong transcript là dấu nhắc thật của từng client; chỉ bỏ khoảng trắng cuối dòng.
 */
import { lamDeck, sql, psql, two, three, box, cards as cards0, steps, kw, flow, tbl, vsd, c } from './_pg-chung.mjs';
import { T, HE, nhanHe, bang3 } from './pg-17-hinh.mjs';

const cards = (items, cot) => cards0(items.map(([h, p]) => [h, p.replace(/<b>/g, '<span style="font-weight:800;color:#262626">').replace(/<\/b>/g, '</span>')]), cot);

export const deck = { key: 'pg-00-5', code: 'PG 0.5', title: 'From SQL Server / MySQL to PostgreSQL', sub: 'What carries over, what is renamed, and the traps that change the answer' };

const NAU = '#b85a2b', PG = '#336791', CAM = '#e08a1e', LA = '#2f7d4f', DO = '#c0392b';
const col = (...a) => `<div style="display:flex;flex-direction:column;gap:10px;min-width:0">${a.join('')}</div>`;
const t13 = (s) => s.replace('class="term sm"', 'class="term sm" style="font-size:13px"').replace('<pre>', '<pre style="font-size:13px;line-height:1.36">');

/* Đường tắt (SVG): 0.4 → 0.5 → lướt Ch1–7 → học kỹ Ch8–17. */
const duongTat = () => {
  const o = [
    ['0.1–0.4', 'everyone', '#7a7a7a', 10], ['0.5', 'THIS LESSON', CAM, 230], ['Ch 1–7', 'skim (⏩ on Ch 2–7)', '#9aa8b8', 450], ['Ch 8–17', 'study carefully', PG, 670], ['Labs + exam', 'all of them', LA, 890],
  ];
  return `<svg viewBox="0 0 1110 150" width="1110" height="150" font-family="Arial">
  <defs><marker id="dt" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${NAU}"/></marker></defs>
  ${o.map(([a, b, m, x], i) => `<rect data-k="tram" x="${x}" y="20" width="200" height="96" rx="14" fill="${m}18" stroke="${m}" stroke-width="${i === 1 ? 5 : 3}"/>
  <text x="${x + 100}" y="62" text-anchor="middle" font-size="26" font-weight="800" fill="${m}">${a}</text>
  <text x="${x + 100}" y="94" text-anchor="middle" font-size="17" fill="#555">${b}</text>
  ${i < o.length - 1 ? `<line x1="${x + 202}" y1="68" x2="${x + 226}" y2="68" stroke="${NAU}" stroke-width="3" marker-end="url(#dt)"/>` : ''}`).join('')}
  <text x="555" y="142" text-anchor="middle" font-size="17" fill="#777">the shortcut path for people who already know SQL Server (DBI202) or MySQL</text>
</svg>`;
};

/* Ba hộp lồng nhau: server → database → schema → table, theo từng hệ. */
const longNhau = () => {
  const col = (x, he, l1, l2, l3, note) => `
  <rect x="${x}" y="10" width="350" height="300" rx="14" fill="${HE[he].nen}" stroke="${HE[he].mau}" stroke-width="3"/>
  <text x="${x + 175}" y="40" text-anchor="middle" font-size="21" font-weight="800" fill="${HE[he].mau}">${HE[he].icon} ${HE[he].ten} server</text>
  <rect x="${x + 22}" y="56" width="306" height="236" rx="12" fill="#fff" stroke="${HE[he].mau}" stroke-width="2.5"/>
  <text data-k="lop" x="${x + 175}" y="84" text-anchor="middle" font-size="20" font-weight="700" fill="#333">${l1}</text>
  <rect x="${x + 44}" y="98" width="262" height="176" rx="10" fill="${HE[he].nen}" stroke="${HE[he].mau}" stroke-width="2" stroke-dasharray="${l2 ? '0' : '6 5'}"/>
  <text data-k="lop" x="${x + 175}" y="126" text-anchor="middle" font-size="20" font-weight="700" fill="#333">${l2 || '(no separate level)'}</text>
  <rect x="${x + 70}" y="146" width="210" height="44" rx="8" fill="#fff" stroke="#999"/><text x="${x + 175}" y="175" text-anchor="middle" font-size="19" font-family="Menlo,monospace" fill="#333">${l3}.product</text>
  <rect x="${x + 70}" y="200" width="210" height="44" rx="8" fill="#fff" stroke="#999"/><text x="${x + 175}" y="229" text-anchor="middle" font-size="19" font-family="Menlo,monospace" fill="#333">${l3}.customer</text>
  <text x="${x + 175}" y="268" text-anchor="middle" font-size="16" fill="#666">${note}</text>`;
  return `<svg viewBox="0 0 1110 320" width="1110" height="320" font-family="Arial">
  ${col(0, 'ss', 'database ctmini', 'schema dbo (default)', 'dbo', 'ctmini.dbo.product')}
  ${col(380, 'my', 'database = schema ctmini', '', 'ctmini', 'ctmini.product')}
  ${col(760, 'pg', 'database ctmini', 'schema public (default)', 'public', 'ctmini.public.product')}
</svg>`;
};

/* Ống đổi tên: chữ hoa → chữ thường khi không có dấu ngoặc kép. */
const gapChu = () => `<svg viewBox="0 0 1110 120" width="1110" height="120" font-family="Menlo,monospace">
  <defs><marker id="gc" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${PG}"/></marker></defs>
  <text data-k="gap" x="20" y="45" font-size="24" fill="#333">FROM Customer</text>
  <line x1="240" y1="38" x2="390" y2="38" stroke="${PG}" stroke-width="3" marker-end="url(#gc)"/>
  <text x="250" y="24" font-family="Arial" font-size="16" fill="${PG}">folded to lower case</text>
  <text data-k="gap" x="405" y="45" font-size="24" font-weight="700" fill="${PG}">customer</text>
  <text data-k="gap" x="20" y="100" font-size="24" fill="#333">FROM "Customer"</text>
  <line x1="270" y1="93" x2="390" y2="93" stroke="${DO}" stroke-width="3" marker-end="url(#gc)"/>
  <text x="280" y="79" font-family="Arial" font-size="16" fill="${DO}">kept exactly</text>
  <text data-k="gap" x="405" y="100" font-size="24" font-weight="700" fill="${DO}">Customer</text>
  <text x="640" y="45" font-family="Arial" font-size="20" fill="#555">→ two DIFFERENT tables can exist:</text>
  <text x="640" y="80" font-family="Arial" font-size="20" fill="#555"><tspan font-weight="700" fill="${PG}">customer</tspan> and <tspan font-weight="700" fill="${DO}">"Customer"</tspan></text>
</svg>`;

export const slides = lamDeck({ chuong: 'Section 0 — Introduction & How to Study', bai: '0.5' }, [
  { cover: true, t: 'From SQL Server / MySQL<br>to PostgreSQL', sub: 'What carries over, what is renamed,<br>and the traps that change the answer.' },

  { t: 'Who this lesson is for', giua: true, body: `
<ul>
<li>You learned SQL on <b>SQL Server</b> (DBI202, SSMS, T-SQL) or on <b>MySQL</b> (XAMPP, Workbench)</li>
<li>Goal: in one lesson, map everything you know onto PostgreSQL — <b>same data, same question, three servers</b>, all run for real</li>
<li>Three kinds of difference: <span class="xanh">same</span> (most of SQL), <span class="lam">renamed</span> (syntax), <span class="do">trap</span> (same text, different answer)</li>
</ul>
${duongTat()}
${box('New to SQL?', 'Skip this lesson and go straight to Chapter 1 — every chapter teaches PostgreSQL from zero. Come back here later if you ever meet SQL Server or MySQL at work.', 'lam')}` },

  { t: 'An everyday picture: moving house', body: two(col(`<ul>
<li>Your furniture comes with you: <b>tables, keys, SELECT, JOIN, GROUP BY</b> — the SQL standard</li>
<li>Some sockets have a new shape: <b>TOP → LIMIT</b>, <b>ISNULL → COALESCE</b> — learn them once</li>
<li>A few switches look the same but are <b>off when down</b> — same text, different answer. Those are the dangerous ones</li>
</ul>`,
    tbl(['sku', 'name', 'price', 'stock', 'is_active'], [
      ['BUT-01', 'Bút bi Thiên Long', '5000.00', 120, 'true'],
      ['VO-02', 'Vở kẻ ngang 200 trang', '18000.00', 40, 'true'],
      ['THUOC-03', 'Thước kẻ 30cm', '7000.00', 0, 'false'],
      ['BALO-04', 'Balo chống gù', '450000.00', 8, 'true'],
      ['MAY-05', 'Máy tính Casio fx-580', '690000.00', 15, 'true'],
    ], { cap: 'product — the same 5 rows on all three servers (id 1–5)' })),
    col(box('The lab for this lesson', 'One tiny database <code class="i">ctmini</code>, created identically on SQL Server 2022, MySQL 8.4 and PostgreSQL 17 — scripts and Docker commands on the web page. Every output in this lesson is real.', 'lam'),
    tbl(['id', 'full_name', 'phone'], [[1, 'Nguyễn Văn An', '0901000001'], [2, 'Trần Thị Bình', null], [3, 'Lê Minh Chi', "'' (empty)"]], { cap: 'customer (+ email) — one NULL, one empty' })), 'r64') },

  { t: 'Same question, three terminals, same answer', body: `
<p style="font-size:21px;margin:0">“Stock value of every active product, biggest first” — only the <b>is_active</b> test differs:</p>
<div style="display:grid;grid-template-columns:400fr 340fr 340fr;gap:16px">${[
    t13(T('ss', `1> SELECT sku,
2>   price * stock AS stock_value
3> FROM product
4> WHERE is_active = 1
5> ORDER BY stock_value DESC;
6> GO
sku                  stock_value
-------------------- -------------------------
MAY-05                             10350000.00
BALO-04                             3600000.00
VO-02                                720000.00
BUT-01                               600000.00

(4 rows affected)`, { title: 'sqlcmd — SQL Server 2022' })),
    t13(T('my', `mysql> SELECT sku,
    ->   price * stock AS stock_value
    -> FROM product
    -> WHERE is_active = 1
    -> ORDER BY stock_value DESC;
+---------+-------------+
| sku     | stock_value |
+---------+-------------+
| MAY-05  | 10350000.00 |
| BALO-04 |  3600000.00 |
| VO-02   |   720000.00 |
| BUT-01  |   600000.00 |
+---------+-------------+
4 rows in set (0.00 sec)`, { title: 'mysql — MySQL 8.4.13' })),
    t13(T('pg', `ctmini=# SELECT sku,
ctmini-#   price * stock AS stock_value
ctmini-# FROM product
ctmini-# WHERE is_active
ctmini-# ORDER BY stock_value DESC;
   sku   | stock_value
---------+-------------
 MAY-05  | 10350000.00
 BALO-04 |  3600000.00
 VO-02   |   720000.00
 BUT-01  |   600000.00
(4 rows)`, { title: 'psql (17.11) — ctmini' }))].join('')}</div>
${box('Most of what you know transfers', 'SELECT · WHERE · JOIN · GROUP BY · HAVING · ORDER BY · subqueries · CTEs · window functions · PRIMARY/FOREIGN KEY · CHECK · transactions — the same words, the same meaning.', 'ok')}` },

  { t: 'Cheat sheet 1 — the renamed syntax', body: bang3([
    ['First N rows', 'SELECT <b>TOP 3</b> …', '… <b>LIMIT 3</b>', '… <b>LIMIT 3</b> / FETCH FIRST 3 ROWS ONLY'],
    ['Auto number', 'INT <b>IDENTITY(1,1)</b>', 'INT <b>AUTO_INCREMENT</b>', 'int <b>GENERATED ALWAYS AS IDENTITY</b>'],
    ['Unicode text', '<b>NVARCHAR</b>(n) + N\'…\'', 'VARCHAR(n) (utf8mb4)', '<b>text</b> (UTF-8 everywhere)'],
    ['Current time', '<b>GETDATE()</b>, SYSDATETIME()', '<b>NOW()</b>', '<b>now()</b>, current_timestamp'],
    ['NULL fallback', '<b>ISNULL</b>(a, b)', '<b>IFNULL</b>(a, b)', '<b>COALESCE</b>(a, b) (all three have it)'],
    ['Join strings', "a <b>+</b> ' ' + b", '<b>CONCAT</b>(a, \' \', b)', "a <b>||</b> ' ' || b"],
    ['True / false', '<b>BIT</b> (0/1)', '<b>TINYINT(1)</b> (0/1)', '<b>boolean</b> (true/false)'],
    ['Date + time', '<b>DATETIME2</b> / DATETIMEOFFSET', '<b>DATETIME</b> / TIMESTAMP', '<b>timestamptz</b> / timestamp'],
  ], { fs: 19, w1: 160 }) + box('How to use this sheet', 'Left: what your hands already type. Right: the PostgreSQL way. Each row gets its own slide next, with real output.', 'lam') },

  { t: 'Cheat sheet 2 — behaviour, procedures, tools', body: bang3([
    ['Return written rows', '<b>OUTPUT</b> inserted.id', '(none) → LAST_INSERT_ID()', '<b>RETURNING</b> id'],
    ['Upsert', '<b>MERGE</b> … WHEN MATCHED', '<b>ON DUPLICATE KEY UPDATE</b>', '<b>ON CONFLICT</b> (…) DO UPDATE'],
    ['Server code', '<b>T-SQL</b> procedure, @vars', 'stored procedure + DELIMITER', '<b>PL/pgSQL</b> function'],
    ['Namespace', 'database → schema <b>dbo</b>', 'database = schema', 'database → schema <b>public</b>'],
    ['Quoting names', '[Order Note]', '`Order Note`', '"Order Note" (and folds case!)'],
    ["'abc' = 'ABC' ?", '<span class="xanh">yes</span> (CI collation)', '<span class="xanh">yes</span> (ai_ci: even accents)', '<span class="do">no</span> → use <b>ILIKE</b> / lower()'],
    ['7 / 2', '3', '<span class="do">3.5000</span>', '3'],
    ["<code class=\"i\">''</code> = <code class=\"i\">' '</code> ?", '<span class="do">yes</span> (pads spaces)', 'no', 'no'],
    ['UPDATE only 1 row', 'UPDATE <b>TOP (1)</b>', '… ORDER BY … <b>LIMIT 1</b>', '<span class="do">no LIMIT</span> → WHERE id = (subquery)'],
    ['GUI tool', 'SSMS', 'MySQL Workbench', 'psql + pgAdmin / DBeaver'],
  ], { fs: 18, w1: 160 }) },

  { t: 'TOP → LIMIT (and the standard FETCH FIRST)', body: two(
    T('ss', `1> SELECT TOP 3 sku, price FROM product
2> ORDER BY price DESC;
3> GO
sku                  price
-------------------- --------------
MAY-05                    690000.00
BALO-04                   450000.00
VO-02                      18000.00

(3 rows affected)
1> SELECT sku, price FROM product ORDER BY price DESC
2> OFFSET 1 ROWS FETCH NEXT 2 ROWS ONLY;
3> GO
sku                  price
-------------------- --------------
BALO-04                   450000.00
VO-02                      18000.00`, { title: 'sqlcmd — SQL Server 2022' }),
    T('pg', `ctmini=# SELECT sku, price FROM product
ctmini-# ORDER BY price DESC LIMIT 3;
   sku   |   price
---------+-----------
 MAY-05  | 690000.00
 BALO-04 | 450000.00
 VO-02   |  18000.00
(3 rows)

ctmini=# SELECT sku, price FROM product ORDER BY price DESC
ctmini-# OFFSET 1 FETCH FIRST 2 ROWS ONLY;
   sku   |   price
---------+-----------
 BALO-04 | 450000.00
 VO-02   |  18000.00
(2 rows)

ctmini=# SELECT TOP 3 sku FROM product;
ERROR:  syntax error at or near "3"`, { title: 'psql (17.11) — ctmini', hl: [18, 19] })) +
    box('Remember', 'MySQL and PostgreSQL both write <b>LIMIT 3</b> at the end. <b>OFFSET … FETCH FIRST … ROWS ONLY</b> is the SQL standard — it works on SQL Server and PostgreSQL alike. <b>TOP</b> exists only in SQL Server.', 'lam') },

  { t: 'IDENTITY → GENERATED ALWAYS AS IDENTITY', body: `${three(
    sql(`-- SQL Server
id INT IDENTITY(1,1)
   PRIMARY KEY`, { sm: true }),
    sql(`-- MySQL
id INT AUTO_INCREMENT
   PRIMARY KEY`, { sm: true }),
    sql(`-- PostgreSQL (SQL standard)
id int GENERATED ALWAYS
   AS IDENTITY PRIMARY KEY`, { sm: true, hl: [2, 3] }))}
${two(
    T('my', `mysql> INSERT INTO product (id, sku, name, price)
    -> VALUES (99, 'X-99', 'Thử', 1);
Query OK, 1 row affected (0.00 sec)

mysql> SELECT id, sku FROM product WHERE id > 5;
+----+--------+
| id | sku    |
+----+--------+
|  6 | KEO-06 |
| 99 | X-99   |
+----+--------+`, { title: 'mysql — MySQL 8.4.13', hl: [3] }),
    T('pg', `ctmini=# INSERT INTO product (id, sku, name, price)
ctmini-# VALUES (99, 'X-99', 'Thử', 1);
ERROR:  cannot insert a non-DEFAULT value into column "id"
DETAIL:  Column "id" is an identity column defined as
         GENERATED ALWAYS.
HINT:  Use OVERRIDING SYSTEM VALUE to override.`, { title: 'psql (17.11) — ctmini' }))}
<p style="font-size:21px;margin:0">SQL Server refuses too (<code class="i">Msg 544 … IDENTITY_INSERT is set to OFF</code>). MySQL silently accepts 99 — and the next automatic id jumps to <b>100</b>. Old PostgreSQL code uses <code class="i">serial</code>; new code uses IDENTITY (Chapter 3.1).</p>` },

  { t: 'NVARCHAR → text: Vietnamese just works', body: `${T('ss', `1> CREATE TABLE t_text (a VARCHAR(50), b NVARCHAR(50));
2> INSERT INTO t_text VALUES ('Vở kẻ ngang', 'Vở kẻ ngang');
3> INSERT INTO t_text VALUES (N'Vở kẻ ngang', N'Vở kẻ ngang');
4> SELECT a, b, LEN(b) AS len_b, DATALENGTH(b) AS bytes_b FROM t_text;
5> GO
a                              b                              len_b       bytes_b
------------------------------ ------------------------------ ----------- -----------
V? k? ngang                    V? k? ngang                             11          22
V? k? ngang                    Vở kẻ ngang                             11          22`, { title: 'sqlcmd — SQL Server 2022 · collation SQL_Latin1_General_CP1_CI_AS', hl: [8, 9] })}
${two(T('my', `mysql> SELECT a, CHAR_LENGTH(a) AS chars,
    ->        LENGTH(a) AS bytes FROM t_text;
+-----------------+-------+-------+
| a               | chars | bytes |
+-----------------+-------+-------+
| Vở kẻ ngang     |    11 |    15 |
+-----------------+-------+-------+`, { title: 'mysql — MySQL 8.4 (utf8mb4 by default)' }),
    T('pg', `ctmini=# SELECT 'Vở kẻ ngang'::text AS a,
ctmini-#   length('Vở kẻ ngang') AS chars,
ctmini-#   octet_length('Vở kẻ ngang') AS bytes;
      a      | chars | bytes
-------------+-------+-------
 Vở kẻ ngang |    11 |    15`, { title: 'psql (17.11) — ctmini (UTF8)' }))}
<p style="font-size:21px;margin:0">In SQL Server <b>both</b> the column (NVARCHAR) and the literal (<b>N'…'</b>) must be Unicode, or “ở/ẻ” become <b>?</b>. In PostgreSQL there is no N prefix and no NVARCHAR: <b>text</b> is UTF-8.</p>` },

  { t: 'GETDATE() → now(), DATETIME2 → timestamptz', body: `${T('ss', `1> CREATE TABLE t_ts (a DATETIME2, b DATETIMEOFFSET);
2> INSERT INTO t_ts VALUES ('2026-10-25 09:00:00 +07:00', '2026-10-25 09:00:00 +07:00');
3> SELECT a, b, SWITCHOFFSET(b, '+00:00') AS b_utc FROM t_ts;
4> GO
a                           b                                  b_utc
--------------------------- ---------------------------------- ----------------------------------
2026-10-25 09:00:00.0000000 2026-10-25 09:00:00.0000000 +07:00 2026-10-25 02:00:00.0000000 +00:00`, { title: 'sqlcmd — SQL Server 2022 (spacing trimmed)', hl: [7] })}
${two(T('my', `mysql> -- inserted '09:00' while time_zone = '+07:00'
mysql> SET time_zone = '+00:00';
mysql> SELECT a, b FROM t_ts;   -- a DATETIME, b TIMESTAMP
+---------------------+---------------------+
| a                   | b                   |
+---------------------+---------------------+
| 2026-10-25 09:00:00 | 2026-10-25 02:00:00 |
+---------------------+---------------------+`, { title: 'mysql — MySQL 8.4.13' }),
    T('pg', `ctmini=# -- inserted '09:00' in Asia/Ho_Chi_Minh
ctmini=# SET TIME ZONE 'UTC';
ctmini=# SELECT a, b FROM t_ts;  -- timestamp, timestamptz
          a          |           b
---------------------+------------------------
 2026-10-25 09:00:00 | 2026-10-25 02:00:00+00`, { title: 'psql (17.11) — ctmini' }))}
<p style="font-size:21px;margin:0">DATETIME2 silently <b>dropped</b> the +07:00. The zone-aware types (DATETIMEOFFSET · TIMESTAMP · <b>timestamptz</b>) store one instant and show it in your zone. Today: <code class="i">GETDATE()</code> · <code class="i">NOW()</code> · <code class="i">now()</code> — PostgreSQL has no GETDATE (<i>function getdate() does not exist</i>).</p>` },

  { t: 'ISNULL / IFNULL → COALESCE, + / CONCAT → ||', body: two(col(
    T('ss', `1> SELECT 'Phone: ' + phone AS plus_null,
2>   CONCAT('Phone: ', phone) AS concat_null
3> FROM customer WHERE id = 2;
4> GO
plus_null      concat_null
-------------- --------------
NULL           Phone:`, { title: 'sqlcmd — SQL Server 2022 (phone is NULL)', hl: [7] }),
    T('my', `mysql> SELECT CONCAT('Phone: ', phone) AS concat_null
    -> FROM customer WHERE id = 2;
+-------------+
| concat_null |
+-------------+
| NULL        |
+-------------+
mysql> SELECT 'BUT' || '-01' AS pipes;
+-------+
| pipes |
+-------+
|     1 |
+-------+
1 row in set, 2 warnings (0.00 sec)`, { title: 'mysql — MySQL 8.4.13', hl: [12] })),
    col(T('pg', `ctmini=# SELECT full_name, COALESCE(phone, 'n/a')
ctmini-# FROM customer;
   full_name   |  coalesce
---------------+------------
 Nguyễn Văn An | 0901000001
 Trần Thị Bình | n/a
 Lê Minh Chi   |
(3 rows)
ctmini=# SELECT ISNULL(phone, 'n/a') FROM customer;
ERROR:  function isnull(text, unknown) does not exist
ctmini=# \\pset null NULL
ctmini=# SELECT 'Phone: ' || phone AS pipes_null,
ctmini-#   concat('Phone: ', phone) AS concat_null
ctmini-# FROM customer WHERE id = 2;
 pipes_null | concat_null
------------+-------------
 NULL       | Phone:`, { title: 'psql (17.11) — ctmini' }),
    box('Two habits', '<b>COALESCE</b> on all three. <b>||</b>: OR in MySQL, join in PostgreSQL (NULL in ⇒ NULL out); <b>concat()</b> skips NULL.', ''))) },

  { t: 'BIT / TINYINT(1) → a real boolean', body: two(col(
    T('ss', `1> SELECT sku, is_active FROM product
2> WHERE is_active = 1;
3> GO
sku                  is_active
-------------------- ---------
BUT-01                       1
VO-02                        1
BALO-04                      1
MAY-05                       1
1> SELECT sku FROM product WHERE is_active;
2> GO
Msg 4145, Level 15, State 1, Server c2538cdfdc92, Line 1
An expression of non-boolean type specified in a
context where a condition is expected, near ';'.`, { title: 'sqlcmd — SQL Server 2022 (BIT)' }),
    T('my', `mysql> SELECT TRUE, FALSE, TRUE + TRUE AS two;
+------+-------+-----+
| TRUE | FALSE | two |
+------+-------+-----+
|    1 |     0 |   2 |
+------+-------+-----+`, { title: 'mysql — TRUE is just the number 1' })),
    col(T('pg', `ctmini=# SELECT sku, is_active FROM product
ctmini-# WHERE is_active;
   sku   | is_active
---------+-----------
 BUT-01  | t
 VO-02   | t
 BALO-04 | t
 MAY-05  | t
(4 rows)
ctmini=# SELECT sku FROM product WHERE is_active = 1;
ERROR:  operator does not exist: boolean = integer
HINT:  No operator matches the given name and argument
types. You might need to add explicit type casts.
ctmini=# SELECT sku FROM product WHERE NOT is_active;
   sku
----------
 THUOC-03`, { title: 'psql (17.11) — ctmini (boolean)', hl: [11] }),
    box('Rule', 'Write <b>WHERE is_active</b> / <b>WHERE NOT is_active</b>. psql shows <b>t</b> / <b>f</b>. boolean = 1 is a type error.', 'lam'))) },

  { t: 'OUTPUT → RETURNING: get back what you wrote', body: `${two(
    T('ss', `1> INSERT INTO product (sku, name, price)
2> OUTPUT inserted.id, inserted.sku
3> VALUES ('GOM-07', N'Gôm tẩy', 3000);
4> GO
id          sku
----------- --------------------
          6 GOM-07

1> UPDATE product SET price = price * 1.1
2> OUTPUT deleted.price AS old_price,
3>        inserted.price AS new_price
4> WHERE sku = 'GOM-07';
5> GO
old_price      new_price
-------------- --------------
       3000.00        3300.00`, { title: 'sqlcmd — SQL Server 2022' }),
    T('pg', `ctmini=# INSERT INTO product (sku, name, price)
ctmini-# VALUES ('GOM-07', 'Gôm tẩy', 3000)
ctmini-# RETURNING id, sku;
 id |  sku
----+--------
  6 | GOM-07
(1 row)

INSERT 0 1
ctmini=# UPDATE product SET price = price * 1.1
ctmini-# WHERE sku = 'GOM-07'
ctmini-# RETURNING price AS new_price;
 new_price
-----------
   3300.00
(1 row)`, { title: 'psql (17.11) — ctmini' }))}
${T('my', `mysql> INSERT INTO product (sku, name, price) VALUES ('GOM-08', 'Gôm tẩy 2', 3000) RETURNING id;
ERROR 1064 (42000): You have an error in your SQL syntax; ... near 'RETURNING id' at line 1`, { title: 'mysql — MySQL 8.4.13: no RETURNING ⇒ a second query SELECT LAST_INSERT_ID()' })}` },

  { t: 'Upsert: MERGE / ON DUPLICATE KEY → ON CONFLICT', body: `
<p style="font-size:21px;margin:0">Task: 30 more pens arrive. If <b>BUT-01</b> exists add to its stock, otherwise insert it. Result on all three: <b>stock 120 → 150</b>.</p>
${three(
    sql(`-- SQL Server
MERGE product AS t
USING (VALUES ('BUT-01',
  N'Bút bi Thiên Long', 5000, 30))
  AS s(sku, name, price, stock)
  ON t.sku = s.sku
WHEN MATCHED THEN UPDATE
  SET stock = t.stock + s.stock
WHEN NOT MATCHED THEN INSERT
  (sku, name, price, stock)
  VALUES (s.sku, s.name,
          s.price, s.stock);`, { sm: true }),
    sql(`-- MySQL 8
INSERT INTO product
  (sku, name, price, stock)
VALUES ('BUT-01',
  'Bút bi Thiên Long', 5000, 30)
  AS s
ON DUPLICATE KEY UPDATE
  stock = product.stock
        + s.stock;
-- Query OK, 2 rows affected
-- (2 = "updated")`, { sm: true }),
    sql(`-- PostgreSQL
INSERT INTO product
  (sku, name, price, stock)
VALUES ('BUT-01',
  'Bút bi Thiên Long', 5000, 30)
ON CONFLICT (sku) DO UPDATE
  SET stock = product.stock
            + EXCLUDED.stock
RETURNING sku, stock;
--   sku   | stock
--  BUT-01 |   150`, { sm: true, hl: [6, 8] }))}
${box('Remember', 'PostgreSQL names the conflict target <b>(sku)</b> — it needs a UNIQUE index there — and calls the rejected row <b>EXCLUDED</b>. PostgreSQL 15+ also has <b>MERGE</b>; ON CONFLICT stays the everyday upsert (Chapter 4.1).', 'lam')}` },

  { t: 'T-SQL / MySQL procedures → PL/pgSQL functions', body: `${three(
    sql(`-- SQL Server (T-SQL)
CREATE OR ALTER PROCEDURE
  stock_value
  @min_price DECIMAL(12,2) AS
BEGIN
  SET NOCOUNT ON;
  DECLARE @total DECIMAL(14,2);
  SELECT @total =
    SUM(price * stock)
  FROM product
  WHERE price >= @min_price;
  SELECT @total AS total;
END;`, { sm: true }),
    sql(`-- MySQL
DELIMITER //
CREATE PROCEDURE stock_value(
  IN min_price DECIMAL(12,2))
BEGIN
  DECLARE total DECIMAL(14,2);
  SELECT SUM(price * stock)
    INTO total
  FROM product
  WHERE price >= min_price;
  SELECT total;
END //
DELIMITER ;`, { sm: true }),
    sql(`-- PostgreSQL (PL/pgSQL)
CREATE OR REPLACE FUNCTION
  stock_value(min_price numeric)
RETURNS numeric
LANGUAGE plpgsql AS $$
DECLARE
  total numeric;
BEGIN
  SELECT sum(price * stock)
    INTO total
  FROM product
  WHERE price >= min_price;
  RETURN total;
END; $$;`, { sm: true, hl: [4, 5, 13] }))}
${three(
    T('ss', `1> EXEC stock_value @min_price = 10000;
total
----------------
     14670000.00`, { title: 'sqlcmd' }),
    T('my', `mysql> CALL stock_value(10000);
+-------------+
| total       |
+-------------+
| 14670000.00 |
+-------------+`, { title: 'mysql' }),
    T('pg', `ctmini=# SELECT stock_value(10000)
ctmini-#   AS total;
    total
-------------
 14670000.00`, { title: 'psql' }))}
<p style="font-size:19px;margin:0">No <b>@</b>, no DELIMITER: the body is a string between <b>$$ … $$</b>, called inside SELECT (Chapter 12).</p>` },

  { t: 'dbo / database / public — where a table lives', body: `${longNhau()}
${three(
    T('ss', `1> SELECT DB_NAME() AS db,
2>   SCHEMA_NAME() AS default_schema;
3> GO
db             default_schema
-------------- --------------
ctmini         dbo`, { title: 'sqlcmd -y 14' }),
    T('my', `mysql> SELECT DATABASE() AS db,
    ->   SCHEMA() AS same_thing;
+--------+------------+
| db     | same_thing |
+--------+------------+
| ctmini | ctmini     |
+--------+------------+`, { title: 'mysql' }),
    T('pg', `ctmini=# SELECT current_schema();
 current_schema
----------------
 public
ctmini=# SHOW search_path;
   search_path
-----------------
 "$user", public`, { title: 'psql' }))}` },

  { t: 'Quoting names: [ ] vs ` ` vs " " — and case folding', body: `${gapChu()}
${two(T('pg', `ctmini=# CREATE TABLE "Customer" (id int);
CREATE TABLE
ctmini=# SELECT * FROM Customer;
 id |     email      |   full_name   |   phone
----+----------------+---------------+------------
  1 | an@ctshop.vn   | Nguyễn Văn An | 0901000001
  2 | binh@ctshop.vn | Trần Thị Bình |
  3 | chi@ctshop.vn  | Lê Minh Chi   |
(3 rows)

ctmini=# SELECT * FROM "Order note";
ERROR:  relation "Order note" does not exist`, { title: 'psql (17.11) — ctmini', hl: [3] }),
    T('my', `mysql> SELECT sku FROM product WHERE SKU = 'BUT-01';
+--------+
| sku    |
+--------+
| BUT-01 |
+--------+
mysql> SELECT * FROM PRODUCT;
ERROR 1146 (42S02): Table 'ctmini.PRODUCT'
doesn't exist`, { title: 'mysql — on Linux, TABLE names are case-sensitive' }))}
<p style="font-size:20px;margin:0">SQL Server: <code class="i">SELECT * FROM PRODUCT</code> works (case-insensitive by collation). PostgreSQL rule: <b>always lower_snake_case, never quotes</b> — then every spelling works. A quoted <code class="i">"Customer"</code> must be quoted forever.</p>` },

  { t: 'Trap 1 — comparing text: collation and ILIKE', body: `${bang3([
    ["name = 'BÚT BI THIÊN LONG'", '<span class="xanh">1 row</span>', '<span class="xanh">1 row</span>', '<span class="do">0 rows</span>'],
    ["name LIKE 'balo%'", '<span class="xanh">1 row</span>', '<span class="xanh">1 row</span>', '<span class="do">0 rows</span>'],
    ["name = 'But bi Thien Long' (no accents)", '0 rows', '<span class="do">1 row (!)</span>', '0 rows'],
    ['default collation', 'SQL_Latin1_General_CP1_<b>CI_AS</b><br>case-insensitive, accent-sensitive', 'utf8mb4_0900_<b>ai_ci</b><br>accent- AND case-insensitive', 'en_US.utf8 (deterministic)<br>case- and accent-sensitive'],
  ], { fs: 18, w1: 270, dau: 'query on product.name' })}
${two(T('pg', `ctmini=# SELECT sku, name FROM product
ctmini-# WHERE name ILIKE 'balo%';
   sku   |     name
---------+---------------
 BALO-04 | Balo chống gù
(1 row)`, { title: 'psql — ILIKE = case-insensitive LIKE' }),
    T('pg', `ctmini=# SELECT sku, name FROM product
ctmini-# WHERE lower(name) = lower('BÚT BI THIÊN LONG');
  sku   |       name
--------+-------------------
 BUT-01 | Bút bi Thiên Long
(1 row)`, { title: 'psql — or compare lower(…) on both sides' }))}` },

  { t: 'Trap 2 — dividing integers', body: two(col(
    t13(T('ss', `1> SELECT 7 / 2 AS int_div, 7 / 2.0 AS dec_div;
int_div     dec_div
----------- ----------
          3   3.500000
1> SELECT SUM(stock) / COUNT(*) AS avg_int,
2>   AVG(stock) AS avg_fn, AVG(stock * 1.0) AS avg_dec
3> FROM product;
avg_int     avg_fn      avg_dec
----------- ----------- ----------------------------------------
         36          36                                36.600000`, { title: 'sqlcmd — SQL Server 2022', hl: [10] })),
    t13(T('my', `mysql> SELECT 7 / 2 AS slash, 7 DIV 2 AS int_div;
+--------+---------+
| slash  | int_div |
+--------+---------+
| 3.5000 |       3 |
+--------+---------+
mysql> SELECT SUM(stock) / COUNT(*) AS avg_slash,
    ->   AVG(stock) AS avg_fn FROM product;
+-----------+---------+
| avg_slash | avg_fn  |
+-----------+---------+
|   36.6000 | 36.6000 |
+-----------+---------+`, { title: 'mysql — MySQL 8.4.13', hl: [5, 12] }))),
    col(t13(T('pg', `ctmini=# SELECT 7 / 2 AS int_div, 7 / 2.0 AS dec_div;
 int_div |      dec_div
---------+--------------------
       3 | 3.5000000000000000
ctmini=# SELECT sum(stock) / count(*) AS avg_int,
ctmini-#   avg(stock) AS avg_fn FROM product;
 avg_int |       avg_fn
---------+---------------------
      36 | 36.6000000000000000`, { title: 'psql (17.11) — ctmini', hl: [9] })),
    box('✗ Same text, different answer', 'MySQL report <code class="i">SUM(stock) / COUNT(*)</code> = <b>36.6</b>; on PostgreSQL silently <b>36</b>. No error. (SQL Server truncates even AVG of an int.)', 'do2'),
    box('✓ Say what you mean', '<b>avg()</b>, or one side numeric: <code class="i">sum(stock)::numeric / count(*)</code> · <code class="i">round(avg(stock), 1)</code> ⇒ 36.6', 'xanh'))) },

  { t: "Trap 3 — empty string, spaces and NULL", body: `${bang3([
    ["phone = '' OR phone IS NULL", '2 rows (Bình NULL, Chi \'\')', '2 rows', '2 rows'],
    ["'' = ' '", '<span class="do">equal</span>', 'different', 'different'],
    ["'abc' = 'abc   '", '<span class="do">equal</span>', 'different', 'different'],
    ["length of 'abc   '", 'LEN ⇒ <span class="do">3</span>', 'CHAR_LENGTH ⇒ 6', 'length ⇒ 6'],
    ['COUNT(*) · COUNT(phone) · COUNT(NULLIF(phone, \'\'))', '3 · 2 · 1', '3 · 2 · 1', '3 · 2 · 1'],
  ], { fs: 19, w1: 330, dau: 'real result on ctmini' })}
${two(box('What is the same everywhere', "An empty string <b>''</b> is a real value, not NULL, on all three (unlike Oracle). <b>COUNT(phone)</b> counts Chi's empty phone. To treat '' as “no value”: <b>NULLIF(phone, '')</b>.", 'ok'),
    box('What bites when you move', "SQL Server pads with spaces before comparing (ANSI rule), so <b>'abc' = 'abc   '</b> is true and LEN ignores trailing spaces. PostgreSQL text compares every character — trim input with <b>trim()</b> or a CHECK.", 'do2'))}` },

  { t: 'UPDATE … LIMIT? Not in PostgreSQL', body: `${two(col(
    T('ss', `1> UPDATE TOP (1) product
2> SET stock = stock - 1 WHERE stock > 0;
3> GO
(1 rows affected)
1> SELECT TOP 2 sku, stock FROM product ORDER BY id;
2> GO
sku                  stock
-------------------- -----------
BUT-01                       119
VO-02                         40`, { title: 'sqlcmd — TOP in UPDATE takes ANY row (no ORDER BY)', hl: [9] }),
    T('my', `mysql> UPDATE product SET stock = stock - 1
    -> WHERE stock > 0 ORDER BY price DESC LIMIT 1;
Query OK, 1 row affected (0.00 sec)
Rows matched: 1  Changed: 1  Warnings: 0`, { title: 'mysql — ORDER BY … LIMIT 1 is allowed' })),
    T('pg', `ctmini=# UPDATE product SET stock = stock - 1
ctmini-# WHERE stock > 0 ORDER BY price DESC LIMIT 1;
ERROR:  syntax error at or near "ORDER"

ctmini=# UPDATE product SET stock = stock - 1
ctmini-# WHERE id = (SELECT id FROM product
ctmini(#   WHERE stock > 0
ctmini(#   ORDER BY price DESC LIMIT 1)
ctmini-# RETURNING sku, stock;
  sku   | stock
--------+-------
 MAY-05 |    14
(1 row)`, { title: 'psql — pick the row in a subquery, then update it', hl: [12] }))}
${box('Why PostgreSQL refuses', 'UPDATE has no row order of its own. Choosing the row with <b>ORDER BY … LIMIT</b> inside a subquery makes the choice explicit — SQL Server’s UPDATE TOP (1) above changed BUT-01, not the most expensive product.', 'lam')}` },

  { t: 'Your tools on the other side', body: cards([
    ['🟥 SQL Server', '<b>SSMS</b> (Windows) or VS Code + mssql extension · CLI <b>sqlcmd</b> · run a batch with <b>GO</b> · Object Explorer.'],
    ['🐬 MySQL', '<b>MySQL Workbench</b>, phpMyAdmin in XAMPP · CLI <b>mysql</b> · statements end with ; · <b>DELIMITER</b> for procedures.'],
    ['🐘 PostgreSQL', '<b>psql</b> (this course) · <b>pgAdmin</b> (official GUI) · <b>DBeaver</b> (one free GUI for all three) · VS Code extensions.'],
  ], 3) + bang3([
    ['List databases', 'SELECT name FROM sys.databases', 'SHOW DATABASES;', '\\l'],
    ['Switch database', 'USE ctmini;', 'USE ctmini;', '\\c ctmini'],
    ['List tables', 'SELECT * FROM INFORMATION_SCHEMA.TABLES', 'SHOW TABLES;', '\\dt'],
    ['Describe a table', 'EXEC sp_help \'product\'', 'DESCRIBE product;', '\\d product'],
    ['Run the batch', 'GO', ';', ';'],
  ], { fs: 20, w1: 200 }) + box('Tip', '<b>DBeaver Community</b> (free) opens SQL Server, MySQL and PostgreSQL side by side — handy for Chapter 17 (MongoDB has its own GUI, <b>Compass</b>). In this course we stay in <b>psql</b>: it shows exactly what the server says.', 'lam') },

  { t: 'In a real project: Prisma hides some of it, not all', body: two(`
<ul>
<li>This site (cuongthai.com) runs <b>PostgreSQL + Prisma</b>. Prisma writes most SQL for you — but the database rules underneath are PostgreSQL's</li>
<li><code class="i">mode: 'insensitive'</code> appears in <b>195</b> places in our backend code: on PostgreSQL Prisma turns it into <b>ILIKE</b> (Trap 1). On MySQL you would not need it</li>
<li><code class="i">@default(autoincrement())</code> becomes <b>SERIAL</b>; <code class="i">Boolean</code> → <b>boolean</b>; <code class="i">String</code> → <b>text</b></li>
<li><code class="i">DateTime</code> → <b>timestamp(3)</b> <i>without</i> time zone — the DATETIME2 problem again (Chapter 2.3)</li>
</ul>`, sql(`// backend code (TypeScript, Prisma)
await prisma.user.findFirst({
  where: { email: { equals: raw,
           mode: 'insensitive' } },
});

-- the SQL Prisma really sent (query log)
SELECT "public"."users"."id"
FROM "public"."users"
WHERE "public"."users"."email" ILIKE $1
LIMIT $2 OFFSET $3`, { sm: true, lang: 'typescript', hl: [4, 10] }) + box('Takeaway', 'An ORM translates the syntax. It does not change collation, division or time-zone rules — you still need this lesson.', 'lam'), 'r64') },

  { t: 'Exercise — translate to PostgreSQL', body: two(col(steps([
    'T-SQL: <code class="i">SELECT TOP 2 sku, name + \' (\' + CAST(stock AS VARCHAR(10)) + \')\' AS label FROM product WHERE is_active = 1 ORDER BY stock DESC;</code>',
    'T-SQL: <code class="i">SELECT full_name, ISNULL(NULLIF(phone, \'\'), \'no phone\') FROM customer;</code>',
    'MySQL: <code class="i">SELECT sku, name FROM product WHERE name LIKE \'balo%\';</code> (returns 1 row there)',
    'MySQL report: <code class="i">SUM(stock) / COUNT(*)</code> showed 36.6 — make PostgreSQL show 36.6 too',
  ]), '<p class="nho" style="margin:0">Pause the video, write all four in psql, then compare with the real answers on the right.</p>'), T('pg', `ctmini=# SELECT sku, name || ' (' || stock || ')' AS label
ctmini-# FROM product WHERE is_active
ctmini-# ORDER BY stock DESC LIMIT 2;
  sku   |           label
--------+----------------------------
 BUT-01 | Bút bi Thiên Long (120)
 VO-02  | Vở kẻ ngang 200 trang (40)
ctmini=# SELECT full_name,
ctmini-#   COALESCE(NULLIF(phone, ''), 'no phone') AS phone
ctmini-# FROM customer;
   full_name   |   phone
---------------+------------
 Nguyễn Văn An | 0901000001
 Trần Thị Bình | no phone
 Lê Minh Chi   | no phone
ctmini=# SELECT sku, name FROM product
ctmini-# WHERE name ILIKE 'balo%';
   sku   |     name
---------+---------------
 BALO-04 | Balo chống gù
ctmini=# SELECT sum(stock) / count(*) AS wrong,
ctmini-#   round(avg(stock), 1) AS right_avg FROM product;
 wrong | right_avg
-------+-----------
    36 |      36.6`, { title: 'psql (17.11) — answers (real output)', k: 'dapan' }).replace('<pre>', '<pre style="font-size:13px;line-height:1.34">'), 'r46') },

  { t: 'Check yourself', to: true, body: `
${steps([
    'A MySQL query <code class="i">WHERE name = \'BALO CHỐNG GÙ\'</code> found a row. In PostgreSQL it finds none. Why, and two ways to fix it?',
    'Why does <code class="i">WHERE is_active = 1</code> fail in PostgreSQL, and what do you write instead?',
    'You need the new id right after an INSERT. What does each system offer?',
  ])}
<div data-k="dapan3" class="o ok" style="font-size:22px"><div class="h">Answers</div>
1 · PostgreSQL compares text exactly (case + accents); MySQL’s ai_ci collation ignores both ⇒ use <b>ILIKE</b> or <b>lower()</b> on both sides.<br>
2 · <b>boolean</b> is not an integer ⇒ <b>WHERE is_active</b> (or = true).<br>
3 · SQL Server <b>OUTPUT inserted.id</b> / SCOPE_IDENTITY() · MySQL <b>LAST_INSERT_ID()</b> · PostgreSQL <b>RETURNING id</b>.</div>` },

  { t: 'Summary — and your shortcut route', body: `${duongTat()}
${two(`<ul>
<li><b>Same:</b> the core of SQL — you already know most of PostgreSQL</li>
<li><b>Renamed:</b> TOP→LIMIT · IDENTITY→GENERATED AS IDENTITY · NVARCHAR→text · GETDATE→now() · ISNULL→COALESCE · +→|| · BIT→boolean · OUTPUT→RETURNING · MERGE→ON CONFLICT · T-SQL→PL/pgSQL · dbo→public</li>
<li><b>Traps:</b> text comparison (collation) · integer division · '' vs ' ' · quoted names · no UPDATE … LIMIT</li>
</ul>`, col(box('Next', 'Skim Chapters 1–7 (look for the ⏩ tag: slides + traps + run the examples), then study <b>Chapters 8–17</b> carefully and do every lab. Chapter 17 compares SQL Server, MySQL, PostgreSQL and MongoDB in depth.', 'ok'),
    box('Practice', 'All scripts of this lesson are on the web page — run them on the three servers yourself.', 'lam')), 'r64')}` },
]);
