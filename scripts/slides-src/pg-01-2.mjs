/**
 * pg-01-2 — PostgreSQL · Chapter 1 · Lesson 1.2 "ACID: the four guarantees, proven" (slide EN, kiểu FU, 25/10/2026).
 * Nguồn: content/courses/postgresql/s01-vi-sao.mjs › postgresql-1-2-acid. Output = chạy thật PostgreSQL 17.11
 * (video-bai-giang/src/khung/pg/that/pg-01-2.out.txt, iso-*.txt, lost-*.txt, fu-*.txt, cond.txt, dur-*.txt).
 * Bổ sung so với bài web: ví dụ chuyển tiền bằng sổ giấy, sơ đồ BEGIN/COMMIT/ROLLBACK, snapshot MVCC, WAL, thí nghiệm kill -9 THẬT trong container,
 * thí nghiệm lost update + FOR UPDATE + UPDATE có điều kiện, ví dụ production (redeemProCode).
 */
import { lamDeck, sql, psql, sh, run, tbl, two, box, steps, cards, kw, flow, vsd, hai_phien } from './_pg-chung.mjs';

export const deck = { key: 'pg-01-2', code: 'PG 1.2', title: 'ACID: the four guarantees, proven', sub: 'Atomicity · Consistency · Isolation · Durability' };
const zm = (h, z = 1.3) => `<div style="zoom:${z}">${h}</div>`;

/* Chuyển tiền trên giấy: mất điện giữa hai bước. */
const paper = () => `<svg viewBox="0 0 1110 330" width="1110" height="330" font-family="Arial">
  <g data-k="p-start"><rect x="20" y="40" width="250" height="140" rx="12" fill="#fffaf0" stroke="#b85a2b" stroke-width="3"/>
  <text x="145" y="78" text-anchor="middle" font-size="24" font-weight="800" fill="#b85a2b">Cuong</text><text x="145" y="135" text-anchor="middle" font-size="46" font-weight="800" fill="#333">100</text>
  <rect x="300" y="40" width="250" height="140" rx="12" fill="#fffaf0" stroke="#b85a2b" stroke-width="3"/>
  <text x="425" y="78" text-anchor="middle" font-size="24" font-weight="800" fill="#b85a2b">Mai</text><text x="425" y="135" text-anchor="middle" font-size="46" font-weight="800" fill="#333">0</text></g>
  <text x="285" y="30" text-anchor="middle" font-size="21" font-weight="700" fill="#666">before: Cuong sends 100 to Mai</text>
  <path d="M560,110 L620,110" stroke="#e08a1e" stroke-width="5"/><path d="M620,96 L648,110 L620,124 z" fill="#e08a1e"/>
  <g data-k="p-end"><rect x="670" y="40" width="190" height="140" rx="12" fill="#fdf0ee" stroke="#c0392b" stroke-width="3"/>
  <text x="765" y="78" text-anchor="middle" font-size="24" font-weight="800" fill="#a52a1d">Cuong</text><text x="765" y="135" text-anchor="middle" font-size="46" font-weight="800" fill="#a52a1d">0</text>
  <rect x="890" y="40" width="190" height="140" rx="12" fill="#fdf0ee" stroke="#c0392b" stroke-width="3"/>
  <text x="985" y="78" text-anchor="middle" font-size="24" font-weight="800" fill="#a52a1d">Mai</text><text x="985" y="135" text-anchor="middle" font-size="46" font-weight="800" fill="#a52a1d">0</text></g>
  <text x="875" y="30" text-anchor="middle" font-size="21" font-weight="700" fill="#a52a1d">after a power cut</text>
  <rect x="30" y="215" width="610" height="90" rx="10" fill="#fff" stroke="#2f7d4f" stroke-width="2.5"/><text x="50" y="250" font-size="23" font-weight="700" fill="#1f6b40">① subtract 100 from Cuong  ✓ written</text><text x="50" y="286" font-size="23" font-weight="700" fill="#a52a1d">② add 100 to Mai  ⚡ power cut — never happens</text>
  <text x="875" y="270" text-anchor="middle" font-size="26" font-weight="800" fill="#a52a1d">100 disappeared</text>
</svg>`;

/* Bốn thẻ ACID. */
const acidCards = () => {
  const c = [['A', 'Atomicity', 'all or nothing', '#336791'], ['C', 'Consistency', 'the rules always hold', '#2f7d4f'], ['I', 'Isolation', 'concurrent work stays apart', '#e08a1e'], ['D', 'Durability', 'committed = permanent', '#b85a2b']];
  return `<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">` + c.map(([l, n, d, m]) => `<div data-k="acid" style="display:flex;gap:16px;align-items:center;border:3px solid ${m};border-radius:14px;padding:12px 16px;background:#fff"><div style="flex:0 0 78px;height:78px;border-radius:14px;background:${m};color:#fff;font-weight:900;font-size:56px;display:flex;align-items:center;justify-content:center">${l}</div><div><div style="font-weight:800;font-size:28px;color:${m}">${n}</div><div style="font-size:23px;color:#555">${d}</div></div></div>`).join('') + `</div>`;
};

/* Ranh giới giao dịch. */
const txFlow = () => `<svg viewBox="0 0 1110 300" width="1110" height="300" font-family="Arial">
  <defs><marker id="ma" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#b85a2b"/></marker></defs>
  <rect x="150" y="60" width="800" height="150" rx="16" fill="#eef4fa" stroke="#336791" stroke-width="3" stroke-dasharray="10 6" data-k="tx"/>
  <text x="550" y="50" text-anchor="middle" font-size="22" font-weight="800" fill="#245077">ONE transaction = one indivisible block</text>
  <rect x="20" y="105" width="110" height="60" rx="10" fill="#fff" stroke="#336791" stroke-width="2.5"/><text x="75" y="143" text-anchor="middle" font-size="24" font-weight="800" fill="#336791" font-family="Menlo,monospace">BEGIN</text>
  <rect x="180" y="95" width="300" height="80" rx="10" fill="#fff" stroke="#e08a1e" stroke-width="2.5"/><text x="330" y="128" text-anchor="middle" font-size="21" font-weight="700" fill="#333">① UPDATE: A − 60</text><text x="330" y="156" text-anchor="middle" font-size="17" fill="#777">pending — nobody else sees it</text>
  <rect x="520" y="95" width="300" height="80" rx="10" fill="#fff" stroke="#e08a1e" stroke-width="2.5"/><text x="670" y="128" text-anchor="middle" font-size="21" font-weight="700" fill="#333">② UPDATE: B + 60</text><text x="670" y="156" text-anchor="middle" font-size="17" fill="#777">pending</text>
  <rect x="960" y="105" width="130" height="60" rx="10" fill="#f1f9f4" stroke="#2f7d4f" stroke-width="3"/><text x="1025" y="143" text-anchor="middle" font-size="24" font-weight="800" fill="#1f6b40" font-family="Menlo,monospace">COMMIT</text>
  <path d="M130,135 L178,135" stroke="#b85a2b" stroke-width="3" marker-end="url(#ma)"/><path d="M480,135 L518,135" stroke="#b85a2b" stroke-width="3" marker-end="url(#ma)"/><path d="M820,135 L958,135" stroke="#b85a2b" stroke-width="3" marker-end="url(#ma)"/>
  <path d="M330,180 C330,250 700,260 850,236" fill="none" stroke="#c0392b" stroke-width="3" stroke-dasharray="8 5" marker-end="url(#ma)"/>
  <rect x="780" y="226" width="230" height="56" rx="10" fill="#fdf0ee" stroke="#c0392b" stroke-width="3"/><text x="895" y="262" text-anchor="middle" font-size="22" font-weight="800" fill="#a52a1d" font-family="Menlo,monospace">ROLLBACK</text>
  <text x="440" y="270" font-size="19" fill="#a52a1d" font-weight="700">any step fails →</text>
</svg>`;

/* Hai người sửa một tờ: cô lập. */
const twoViews = () => `<svg viewBox="0 0 1110 280" width="1110" height="280" font-family="Arial">
  <g data-k="iso-a"><rect x="20" y="30" width="470" height="220" rx="14" fill="#fff7ef" stroke="#e08a1e" stroke-width="3"/>
  <text x="255" y="68" text-anchor="middle" font-size="25" font-weight="800" fill="#9a4a12">Session A — editing</text>
  <rect x="120" y="92" width="270" height="110" rx="10" fill="#fff3c4" stroke="#e08a1e" stroke-width="2" stroke-dasharray="6 4"/><text x="255" y="140" text-anchor="middle" font-size="22" fill="#555">draft (not committed)</text><text x="255" y="180" text-anchor="middle" font-size="42" font-weight="800" fill="#9a4a12">A = 30</text></g>
  <g data-k="iso-b"><rect x="620" y="30" width="470" height="220" rx="14" fill="#eef4fa" stroke="#336791" stroke-width="3"/>
  <text x="855" y="68" text-anchor="middle" font-size="25" font-weight="800" fill="#245077">Session B — reading</text>
  <rect x="720" y="92" width="270" height="110" rx="10" fill="#fff" stroke="#336791" stroke-width="2"/><text x="855" y="140" text-anchor="middle" font-size="22" fill="#555">last committed page</text><text x="855" y="180" text-anchor="middle" font-size="42" font-weight="800" fill="#245077">A = 40</text></g>
  <path d="M495,140 L615,140" stroke="#b85a2b" stroke-width="4" stroke-dasharray="8 6"/><text x="555" y="125" text-anchor="middle" font-size="40">🚫</text>
</svg>`;

/* MVCC: hai phiên bản của một dòng. */
const versions = () => `<svg viewBox="0 0 1110 260" width="1110" height="260" font-family="Arial">
  <text x="20" y="34" font-size="23" font-weight="800" fill="#404040">Row <tspan font-family="Menlo,monospace">accounts.id = 'A'</tspan> on disk — two versions at the same time</text>
  <g data-k="ver-old"><rect x="40" y="60" width="440" height="110" rx="12" fill="#eef4fa" stroke="#336791" stroke-width="3"/>
  <text x="260" y="98" text-anchor="middle" font-size="22" font-weight="800" fill="#245077">old version</text><text x="260" y="140" text-anchor="middle" font-size="38" font-weight="800" fill="#333" font-family="Menlo,monospace">balance = 40.00</text></g>
  <g data-k="ver-new"><rect x="630" y="60" width="440" height="110" rx="12" fill="#fff7ef" stroke="#e08a1e" stroke-width="3" stroke-dasharray="10 6"/>
  <text x="850" y="98" text-anchor="middle" font-size="22" font-weight="800" fill="#9a4a12">new version (uncommitted)</text><text x="850" y="140" text-anchor="middle" font-size="38" font-weight="800" fill="#333" font-family="Menlo,monospace">balance = 30.00</text></g>
  <path d="M485,115 L625,115" stroke="#b85a2b" stroke-width="4"/><path d="M613,105 L631,115 L613,125 z" fill="#b85a2b"/>
  <text x="260" y="205" text-anchor="middle" font-size="22" font-weight="700" fill="#245077">👁 everyone else reads this</text>
  <text x="850" y="205" text-anchor="middle" font-size="22" font-weight="700" fill="#9a4a12">✏️ only session A sees this</text>
  <text x="555" y="248" text-anchor="middle" font-size="20" fill="#666">COMMIT makes the new version visible; ROLLBACK throws it away — readers never wait for writers (MVCC, Chapter 11)</text>
</svg>`;

export const slides = lamDeck({ chuong: 'Chapter 1 — Why PostgreSQL exists', bai: '1.2' }, [
  { cover: true, t: 'ACID: the four guarantees,<br>proven', sub: 'Atomicity · Consistency · Isolation · Durability —<br>each one tested on a real PostgreSQL 17 server.' },

  { t: 'What you will get from this lesson', to: true, body: `
<ul>
<li>Why “just saving data” is not enough — the <b>money-transfer problem</b></li>
<li>The four letters of <b>ACID</b>, in plain words</li>
<li>Four <b>experiments</b> you can repeat: a failing transfer, a rule violation, two sessions at once, and a crashed server</li>
<li>The production switches behind Durability (<code class="i">fsync</code>, WAL)</li>
<li>The classic <b>trap</b>: the default isolation level does not stop every race</li>
</ul>
${box('Where we are', 'Lesson 1.1: data lives in related tables and the database enforces the links. Now: what makes the database <b>trustworthy</b> when things go wrong?', 'lam')}` },

  { t: 'Everyday example first: a transfer on paper', body: `
${paper()}
<p style="font-size:24px;margin:0">Two paper steps — subtract here, add there. If the power dies between them, money has <b>vanished</b>. No bank can accept that, so databases promise something stronger than “write it down”.</p>` },

  { t: 'ACID — four promises', to: true, giua: true, body: `
${acidCards()}
<p>The initials of four guarantees. This is why a bank can trust a relational database with money — and why you can trust it with orders and identities.</p>` },

  { t: 'Our test bench: two accounts', body: `
${zm(run(`CREATE TABLE accounts (
  id      text PRIMARY KEY,
  owner   text NOT NULL,
  balance numeric(12,2) NOT NULL CHECK (balance >= 0)
);
INSERT INTO accounts VALUES ('A','Cuong', 100.00), ('B','Mai', 0.00);`, ` id | owner | balance
----+-------+---------
 A  | Cuong |  100.00
 B  | Mai   |    0.00
(2 rows)`, {}), 1.2)}
<ul style="font-size:24px">
<li><code class="i">numeric(12,2)</code> — exact money (never <code class="i">float</code>)</li>
<li><code class="i">CHECK (balance &gt;= 0)</code> — a rule the database enforces: <b>no negative balance, ever</b></li>
</ul>` },

  { t: 'A — Atomicity: one indivisible block', to: true, body: `
${txFlow()}
<ul>
<li><code class="i">BEGIN … COMMIT</code> wraps several steps into <b>one</b> unit</li>
<li>If any step fails, <code class="i">ROLLBACK</code> undoes <b>all</b> of them — no half-done state is ever left behind</li>
</ul>
${box('Back to the paper example', 'With a transaction, “subtract from Cuong” and “add to Mai” <b>commit together</b> or <b>vanish together</b> — a power cut in the middle simply rolls back on restart.', 'xanh')}` },

  { t: 'Experiment A1: a transfer that must fail', body: `
${zm(run(`BEGIN;
UPDATE accounts SET balance = balance - 150 WHERE id = 'A';  -- A would be -50
UPDATE accounts SET balance = balance + 150 WHERE id = 'B';
COMMIT;`, `BEGIN
ERROR:  new row for relation "accounts" violates check constraint "accounts_balance_check"
DETAIL:  Failing row contains (A, Cuong, -50.00).
ERROR:  current transaction is aborted, commands ignored until end of transaction block
ROLLBACK`, { hlOut: [2, 3, 5] }), 1.12)}
<ul style="font-size:21px;margin:0">
<li>Step ① fails on the <code class="i">CHECK</code> → <b>aborted</b>; step ② is ignored; the final <code class="i">COMMIT</code> becomes <code class="i">ROLLBACK</code></li>
</ul>
${two(tbl(['id', 'owner', 'balance'], [['A', 'Cuong', '100.00'], ['B', 'Mai', '0.00']], { cap: 'BEFORE' }),
tbl(['id', 'owner', 'balance'], [['A', 'Cuong', '100.00'], ['B', 'Mai', '0.00']], { cap: 'AFTER — identical, not one cent lost', hl: [0, 1] }))}` },

  { t: 'A valid transfer commits both steps together', body: `
${zm(run(`BEGIN;
UPDATE accounts SET balance = balance - 60 WHERE id = 'A';
UPDATE accounts SET balance = balance + 60 WHERE id = 'B';
COMMIT;
SELECT * FROM accounts ORDER BY id;`, `BEGIN
UPDATE 1
UPDATE 1
COMMIT
 id | owner | balance
----+-------+---------
 A  | Cuong |   40.00
 B  | Mai   |   60.00
(2 rows)`, {}), 1.15)}
<p style="font-size:23px;margin:0">Two <code class="i">UPDATE 1</code> (one row each), then <code class="i">COMMIT</code>: 100 → 40 and 0 → 60. Total money unchanged: <b>100</b>.</p>` },

  { t: 'C — Consistency: the rules always hold', to: true, giua: true, body: two(
    box('What you already saw', 'The <code class="i">CHECK (balance &gt;= 0)</code> made a negative account <b>impossible</b>. Consistency = every transaction moves the database from one <b>valid</b> state to another.', 'lam'),
    `<ul style="font-size:25px;margin:0"><li><b>PRIMARY KEY</b> — no duplicate ids</li><li><b>FOREIGN KEY</b> — no orphan links (lesson 1.1)</li><li><b>CHECK</b> — your own business rule</li><li><b>NOT NULL</b> — required facts</li><li><b>UNIQUE</b> — no duplicates</li></ul>`) +
    box('Same moment, same guard', 'These rules are checked at the moment of the change. A violating transaction is <b>aborted</b> — exactly what happened in experiment A1.', 'xanh') },

  { t: 'I — Isolation: concurrent work stays apart', body: `
${twoViews()}
<p style="font-size:25px;margin:0">Many people use the database at once. <b>Isolation</b>: the unfinished work of one transaction is <b>invisible</b> to everyone else until it commits. Session B never sees a “dirty” half-done value.</p>
${box('Think of it as…', 'a document you are still typing (a <b>draft</b>) versus the page everybody else can open (the <b>published</b> version). Only <code class="i">COMMIT</code> publishes.', 'lam')}` },

  { t: 'Experiment I: two sessions at the same time', body: `
${hai_phien([
  ['1', "BEGIN;\nUPDATE accounts SET balance = balance - 10 WHERE id = 'A';", '', 'A changes 40 → 30 (inside its own transaction)', '#fff7ef'],
  ['2', '', "SELECT id, balance FROM accounts;", 'B reads while A is still open'],
  ['', '', 'A | 40.00\nB | 60.00', 'B still sees 40 — A’s draft is invisible', '#fff3c4'],
  ['3', 'COMMIT;', '', 'A commits: the draft becomes real', '#f1f9f4'],
  ['4', '', "SELECT id, balance FROM accounts;", 'B reads again'],
  ['', '', 'A | 30.00\nB | 60.00', 'now B sees 30', '#f1f9f4'],
], { fs: 18 })}
<p class="nho">Real run on PostgreSQL 17.11 with two psql sessions (A held its transaction open with <code class="i">pg_sleep(4)</code>).</p>` },

  { t: 'How? MVCC — two versions of the same row', body: `
${versions()}
${zm(box('Result', 'Readers never block writers and writers never block readers: each side looks at a consistent <b>snapshot</b>. This is <b>MVCC</b> (Multi-Version Concurrency Control) — Chapter 11 is entirely about it.', 'lam'), 1.25)}` },

  { t: 'D — Durability: committed means permanent', to: true, body: `
${flow([
  { t: 'COMMIT', s: 'client asks', mau: '#336791' },
  { t: 'Write the log', s: 'WAL, appended + fsync', mau: '#b85a2b' },
  { t: 'Reply “OK”', s: 'now it is durable', mau: '#2f7d4f' },
  { t: 'Data files', s: 'updated later', mau: '#e08a1e' },
], { h: 160, fs: 21 })}
<ul>
<li><b>Write-Ahead Log (WAL)</b>: before touching the real data files, PostgreSQL writes the change into an <b>append-only log</b> and forces it to disk</li>
<li>Crash? On restart it <b>replays the WAL</b> — no committed transaction is lost</li>
</ul>
${box('The key order', 'PostgreSQL says “OK” to <code class="i">COMMIT</code> only <b>after</b> the log record is safely on disk. Data files can be updated lazily later — the log is enough to rebuild them.', 'xanh')}` },

  { t: 'Experiment D: kill the server with signal 9', body: `
${zm(sh(`$ docker exec pg psql -U postgres -c "INSERT INTO don VALUES (1,'don hang #1')"
INSERT 0 1
$ docker kill -s KILL pg && docker start pg      # hard crash, no clean shutdown
LOG:  database system was not properly shut down; automatic recovery in progress
LOG:  redo starts at 0/14EF878
LOG:  redo done at 0/1518518
$ docker exec pg psql -U postgres -c "SELECT * FROM don"
 id |     ten
----+-------------
  1 | don hang #1
(1 row)`, { sm: true, hl: [4, 5, 6] }), 1.2)}
<p style="font-size:22px;margin:0">The server was killed without any chance to shut down — yet after the automatic <b>redo</b> the committed row is still there. That is Durability.</p>` },

  { t: 'The settings behind Durability', body: `
${zm(run(`SHOW wal_level;
SHOW fsync;
SHOW synchronous_commit;`, ` wal_level
-----------
 replica
(1 row)

 fsync
-------
 on
(1 row)

 synchronous_commit
--------------------
 on
(1 row)`, { ngang: true }), 1.2)}
${box('Never turn fsync off in production', '<code class="i">fsync = on</code> forces the operating system to write to the <b>physical disk</b> (not just a cache) before a commit is reported. Off = faster, but a crash can <b>lose committed data</b>.', 'do2')}` },

  { t: 'ACID in one table', body: `
${zm(`<table class="t">
<tr><th style="width:190px">Letter</th><th>The promise</th><th>What it costs</th></tr>
<tr><td><b>A</b>tomicity</td><td>all steps or none; no half-done state</td><td>a bit of undo bookkeeping</td></tr>
<tr><td><b>C</b>onsistency</td><td>every rule holds at commit</td><td>checks on every write</td></tr>
<tr><td><b>I</b>solation</td><td>concurrent work does not leak</td><td>versions of rows (MVCC) + vacuuming</td></tr>
<tr><td><b>D</b>urability</td><td>committed survives power loss</td><td>a disk flush on commit — why a commit costs more than a plain write</td></tr>
</table>`, 1.2)}
${zm(box('Together', 'This is why you can put money, orders and identities in a relational database and sleep well.', 'xanh'), 1.25)}` },

  { t: 'In production: redeeming a Pro code', body: `
${zm(two(sql(`await prisma.$transaction(async (tx) => {
  await tx.proRedemption.create({
    data: { proCodeId, userId,
            grantedDays },
  });
  await tx.proCode.update({
    where: { id: proCodeId },
    data: { usedCount: { increment: 1 } },
  });
});`, { sm: true, lang: 'typescript', hl: [2, 6] }),
`<ul style="font-size:22px;margin:0"><li>Two writes: <b>record the redemption</b> and <b>count the use</b></li>
<li>Inside one <code class="i">$transaction</code> = one PostgreSQL <code class="i">BEGIN … COMMIT</code></li>
<li>If the second write fails, the first is <b>rolled back</b> — a code can never be “used” without a record, nor recorded without being counted</li></ul>`, 'r46'), 1.1)}
${flow([
  { t: 'BEGIN', s: 'open transaction', mau: '#336791' },
  { t: 'INSERT redemption', s: 'record who used the code', mau: '#e08a1e' },
  { t: 'UPDATE usedCount + 1', s: 'count the use', mau: '#e08a1e' },
  { t: 'COMMIT', s: 'both saved — or ROLLBACK', mau: '#2f7d4f' },
], { h: 150, fs: 20 })}
<p style="font-size:22px;margin:0">Simplified from cuongthai.com’s <code class="i">pro.service.ts</code> — Atomicity doing its job on production.</p>` },

  { t: 'Trap: the default isolation does not stop every race', body: `
${zm(hai_phien([
  ['1', "SELECT balance …  → 100", "SELECT balance …  → 100", 'both read 100'],
  ['2', "UPDATE … SET balance = 70", '', 'A computed 100 − 30 in the app', '#fff7ef'],
  ['3', 'COMMIT', "UPDATE … SET balance = 70", 'B also computed 100 − 30', '#fdf0ee'],
  ['4', '', 'COMMIT', 'final balance 70, not 40 — no error!', '#fdf0ee'],
], { fs: 15 }), 1.3)}
<p style="font-size:23px;margin:4px 0 0">Default level = <b>READ COMMITTED</b>. The fix: make the <b>write</b> conditional, lock the row, or raise the isolation level and retry:</p>
${zm(sql(`UPDATE accounts SET balance = balance - 30 WHERE id = 'A' AND balance >= 30;
SELECT balance FROM accounts WHERE id = 'A' FOR UPDATE;       -- 2nd session waits`, { sm: true }), 1.2)}` },

  { t: 'Both fixes, run for real', body: `
${zm(two(tbl(['session', 'step', 'balance'], [['A', 'SELECT', '100.00'], ['B', 'SELECT', '100.00'], ['A', 'UPDATE … = 70', ''], ['B', 'UPDATE … = 70', ''], ['—', 'final', '70.00']], { cap: '✗ read-then-write (two real sessions)', bo: [4] }),
tbl(['session', 'step', 'balance'], [['A', 'SELECT … FOR UPDATE', '100.00'], ['B', 'SELECT … FOR UPDATE', '(waits…)'], ['A', 'balance − 30; COMMIT', ''], ['B', 'then reads', '70.00'], ['—', 'final', '40.00']], { cap: '✓ FOR UPDATE (two real sessions)', hl: [4] })), 1.1)}
${zm(run(`UPDATE accounts SET balance = balance - 30 WHERE id='A' AND balance >= 30;
UPDATE accounts SET balance = balance - 90 WHERE id='A' AND balance >= 90;`, `UPDATE 1
UPDATE 0`, {}), 1.15)}
<p style="font-size:21px;margin:0">Conditional UPDATE: the second statement matches <b>0 rows</b> — the invalid withdrawal simply does not happen. Chapter 11 covers all isolation levels.</p>` },

  { t: 'Exercise: prove Atomicity yourself', to: true, body: `
<p style="margin:0">Using the <code class="i">accounts</code> table (A = 100, B = 0):</p>
<ol>
<li>Run a transfer of <b>40</b> from A to B in a transaction, but type <code class="i">ROLLBACK</code> instead of <code class="i">COMMIT</code>. What are the balances?</li>
<li>Now transfer <b>150</b> in one transaction. Which line fails, and what does the final <code class="i">COMMIT</code> print?</li>
</ol>
${box('Answer', '1) Still A = 100, B = 0 — ROLLBACK discards both updates. 2) The <b>first</b> UPDATE fails on <code class="i">accounts_balance_check</code>; the rest is ignored and <code class="i">COMMIT</code> prints <code class="i">ROLLBACK</code>.', 'xanh')}` },

  { t: 'Check yourself', to: true, body: `
<ol>
<li>Which letter of ACID is “survives a power cut”, and which mechanism provides it?</li>
<li>Session A updated a row but has not committed. Does session B see the new value? Why?</li>
<li>Two transactions both read balance 100 and both write 100 − 30. What is the final balance, and name one fix.</li>
</ol>
${box('Answers', '1) D — Durability, via the write-ahead log (WAL) flushed with fsync. 2) No: isolation + MVCC show B the last committed version. 3) 70 (a lost update); fix with a conditional UPDATE, <code class="i">SELECT … FOR UPDATE</code>, or a higher isolation level with retry.', 'xanh')}` },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li><b>A</b> — a transaction is all-or-nothing (<code class="i">BEGIN … COMMIT / ROLLBACK</code>)</li>
<li><b>C</b> — constraints always hold; a violating transaction is aborted</li>
<li><b>I</b> — unfinished work is invisible to others (MVCC); default level has limits</li>
<li><b>D</b> — committed survives crashes: WAL + <code class="i">fsync = on</code></li>
<li>Next: <b>1.3 — PostgreSQL vs MySQL, SQLite &amp; NoSQL</b></li>
</ul>
${box('Practice', 'Build a transfer and break it on purpose — PostgreSQL track on Code Lab: <b>cuongthai.com/code-lab</b>', 'lam')}` },
]);
