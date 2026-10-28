/**
 * os-06-4 — khoá "Operating Systems for Developers", bài 6.4 "Detection and avoidance: Banker's algorithm" (28/10/2026).
 * Khuôn _pg-chung.mjs. Output đọc THẲNG từ lab/out/c64-bank.out.txt (ảnh os-lab: banker.py + Node) và c64-db.out.txt
 * (container postgres:17 vứt đi) qua grab(). Nhúng vào bài bằng giang/os-06-4.mjs.
 */
import { lamDeck, sql, psql, sh, two as two0, box, cards, tbl, vsd } from './_pg-chung.mjs';
import { grab } from '../../content/courses/operating-systems-for-developers/_ui.mjs';

export const deck = { key: 'os-06-4', code: 'OS 6.4', title: "Detection and avoidance: Banker's algorithm", sub: 'Operating Systems · Chapter 6' };

/* Dòng quá dài cho khung ⇒ cắt hiển thị bằng “…” (phần còn lại giữ nguyên văn). */
const cut = (t, n) => t.split('\n').map((l) => (l.length > n ? l.slice(0, n - 1) + '…' : l)).join('\n');
const b = (pre, n = 1, opt) => grab('c64-bank', pre, n, opt);
const db = (pre, n = 1, w = 112, o = {}) => psql(cut(grab('c64-db', pre, n, { drop: /Timing is (on|off)/ }), w), { title: 'psql 17 — two sessions in parallel', sm: true, ...o });
const term = (t, o = {}) => sh(t, { sm: true, ...o });
const big = (t, o = {}) => sh(t, { ...o });
const col = (h) => `<div style="display:flex;flex-direction:column;gap:10px;min-width:0">${h}</div>`;
const two = (a, b2, ti = '') => two0(col(a), col(b2), ti);
const lines = (t, from, to) => t.split('\n').slice(from, to).join('\n');

export const slides = lamDeck({
  khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers', bieuTuong: '🧠',
  khau: 'from zero to real backend work', chuong: 'Chapter 6 — Deadlock', bai: '6.4',
}, [
  { cover: true, t: 'Detection and avoidance:<br>the Banker’s algorithm', sub: 'Step-by-step tables for the exam —<br>and what PostgreSQL and a Node pool actually do' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `
<ul>
<li>The four strategies: <b>ignore</b>, <b>prevent</b>, <b>avoid</b>, <b>detect &amp; recover</b></li>
<li>Run the <b>Banker’s algorithm</b> step by step — safe sequence, grant, wait, deny</li>
<li>Run the <b>detection</b> algorithm and find the deadlocked set</li>
<li>Watch <b>PostgreSQL</b> detect a deadlock in 1 s and kill a victim; fix it by lock order</li>
<li>Hang a <b>Node</b> service with a connection pool — no threads, no locks</li>
</ul>` },

  { t: 'Four ways to deal with deadlock', giua: true, body: `
${cards([
    ['Ignore (ostrich)', 'Assume it is rare; reboot when it happens. What most OSes do for <b>application</b> locks.'],
    ['Prevent', 'Break a Coffman condition by design: lock order, try-lock, all-at-once (6.1).'],
    ['Avoid', 'Know each process’s <b>maximum</b> need; grant a request only if the system stays <b>safe</b> — Banker’s.'],
    ['Detect &amp; recover', 'Let it happen, look for a <b>cycle</b> now and then, kill or roll back a victim — databases.'],
  ], 2)}` },

  { t: 'The Banker’s idea (Dijkstra)', giua: true, body: two(
    `<ul style="font-size:23px">
<li>A bank lends to customers who each declared a <b>credit limit</b> (Max)</li>
<li>It never lends so much that it could not satisfy <b>some</b> customer’s worst case, let them finish and repay, then the next…</li>
<li>Such an order is a <b>safe sequence</b>; a state that has one is <b>safe</b></li>
<li>Before every grant: pretend, check safety, keep or roll back</li>
</ul>`,
    `${box('Three numbers per process and resource', '<b>Allocation</b> — held now<br><b>Max</b> — declared worst case<br><b>Need = Max − Allocation</b> — may still ask<br><b>Available</b> — free in the system', 'lam')}
${box('Safe ≠ no deadlock yet', 'Unsafe means a deadlock is <b>possible</b> if everyone asks for their maximum — not that one exists now.', 'do2')}`) },

  { t: 'The textbook state: 5 processes, A B C = 10 5 7', giua: true, body: two(
    tbl(['', 'Allocation', 'Max', 'Need'], [
      ['P0', '0 1 0', '7 5 3', '7 4 3'], ['P1', '2 0 0', '3 2 2', '1 2 2'], ['P2', '3 0 2', '9 0 2', '6 0 0'],
      ['P3', '2 1 1', '2 2 2', '0 1 1'], ['P4', '0 0 2', '4 3 3', '4 3 1'],
    ], { cap: 'Need = Max − Allocation (A B C)', w: 540 }),
    `<ul style="font-size:23px">
<li>Total A B C = <b>10 5 7</b></li>
<li>Allocated = 7 2 5</li>
<li><b>Available = 3 3 2</b></li>
<li>Question: is this state safe?</li>
</ul>`) },

  { t: 'Safety algorithm, step by step', giua: true, body: `
${term((() => { const t = b('python3 banker.py safety').split('\n'); return [t[0], ...t.slice(7)].join('\n'); })())}
<p style="margin:0;font-size:21px">Work starts at Available. Scan P0…P4: anyone whose <b>Need ≤ Work</b> can run to the end and give back its Allocation. Repeat until nobody fits. Everyone finished ⇒ <b>safe</b>, and the order is a safe sequence (others may exist; any one is enough).</p>` },

  { t: 'P1 requests (1,0,2): pretend, check, grant', giua: true, body: `
${term(lines(b('python3 banker.py request'), 0, 10))}
<p style="margin:0;font-size:21px">Two checks first: Request ≤ Need (it declared this much) and Request ≤ Available (it exists now). Then <b>pretend</b> to grant and run the safety algorithm on the new state. Safe ⇒ grant for real.</p>` },

  { t: 'P4 must wait; P0 is denied although it fits', giua: true, body: `
${term(lines(b('python3 banker.py request'), 10, 17))}
${cards([
    ['P4 asks (3,3,0)', 'Available is (2,3,0): not enough <b>right now</b> ⇒ wait. No safety check needed.'],
    ['P0 asks (0,2,0)', 'It <b>fits</b> in Available — but afterwards Work = (2,1,0) satisfies nobody’s Need ⇒ unsafe ⇒ <b>deny</b>.'],
    ['The point', 'Avoidance refuses requests that <b>could</b> lead to deadlock, even when resources are free.'],
  ])}` },

  { t: 'Detection: no Max, only current Requests', giua: true, body: two(
    term(cut(lines(b('python3 banker.py detect'), 0, 14), 60)),
    term(cut(lines(b('python3 banker.py detect P2 0,0,1'), 0, 10), 60)),
  ) + `<p style="margin:0;font-size:21px">Same loop with <b>Request</b> instead of Need, started from what is free now. Left: everyone can finish. Right: P2 asks for one more C ⇒ only P0 can finish; <b>P1–P4 are deadlocked</b>.</p>` },

  { t: 'Recovery: somebody has to lose', giua: true, body: `
<table class="t" style="font-size:22px">
<tr><th style="width:28%">Option</th><th>How</th><th style="width:30%">Cost</th></tr>
<tr><td>Abort all deadlocked</td><td>kill every process in the cycle</td><td>lots of lost work</td></tr>
<tr><td>Abort one victim at a time</td><td>re-run detection after each</td><td>pick the cheapest: least work done, fewest locks, lowest priority</td></tr>
<tr><td>Preempt + roll back</td><td>take its resources, roll it back to a checkpoint</td><td>needs transactions / checkpoints</td></tr>
</table>
${box('This is exactly a database', 'A transaction is the unit you can roll back. PostgreSQL detects the cycle, aborts one transaction (the victim) with error 40P01, and expects the application to <b>retry</b>.', 'lam')}` },

  { t: 'PostgreSQL: two transfers, opposite order', giua: true, body: `
${sql(`BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = :from;   -- lock row "from"
SELECT pg_sleep(0.5);                                            -- call a fraud check while holding it
UPDATE accounts SET balance = balance + 100 WHERE id = :to;     -- lock row "to"
COMMIT;
-- session T1: from=1 to=2      session T2: from=2 to=1`, { sm: true })}
${db('psql -X -v from=1 -v to=2 -f transfer.sql', 1, 112)}` },

  { t: 'Detected after deadlock_timeout = 1 s', giua: true, body: two(
    `${db('grep -h -A4', 1, 60, { title: 'server log' })}
${db('psql -X -c "SELECT * FROM accounts', 1, 80, { title: 'psql 17' })}`,
    `<ul style="font-size:21px">
<li>A waiting backend sleeps for <code class="i">deadlock_timeout</code> (1 s), then builds the wait-for graph</li>
<li>Cycle found ⇒ <b>it aborts itself</b>: T1 waited first, so T1’s timer fired first</li>
<li>Error <b>40P01</b>, raised in <code class="i">DeadLockReport</code> (deadlock.c)</li>
<li>T2 committed; T1 rolled back — the money moved once, correctly</li>
<li>The app must catch 40P01 and <b>retry</b> the whole transaction</li>
</ul>`) },

  { t: 'Look at the cycle before the detector runs', giua: true, body: `
${db('psql -qX -v from=1 -v to=2 -f transfer.sql >', 1, 112)}
<p style="margin:0;font-size:22px">With <code class="i">deadlock_timeout = 10s</code> the two sessions just wait. <code class="i">pg_blocking_pids()</code> gives the wait-for graph directly: <b>130 is blocked by 133, 133 by 130</b> — the same cycle as gdb in 6.1.</p>` },

  { t: 'The fix: lock both rows in one order', giua: true, body: two(
    `${sql(`BEGIN;
SELECT id FROM accounts
 WHERE id IN (:from, :to)
 ORDER BY id
   FOR UPDATE;          -- always 1 before 2
SELECT pg_sleep(0.5);
UPDATE … -100 WHERE id = :from;
UPDATE … +100 WHERE id = :to;
COMMIT;`, { sm: true })}
${psql((() => { const t = grab('c64-db', 'psql -X -v from=1 -v to=2 -f transfer-ordered.sql', 2).split('\n'); return t.slice(t.findIndex((l) => l.startsWith('$ psql -X -c'))).join('\n'); })(), { title: 'psql 17 — after both', sm: true })}`,
    `${psql(cut(grab('c64-db', 'psql -X -v from=1 -v to=2 -f transfer-ordered.sql', 1, { drop: /^\[T[12]\] *( id|----| +[12]|\(2 rows\))?$/ }), 56), { title: 'psql 17 — two sessions (SELECT result rows omitted)', sm: true })}
<p style="margin:0;font-size:20px">Same two opposite transfers, same 0.5 s sleep: T2’s <code class="i">FOR UPDATE</code> simply <b>waits</b> for T1, then runs. Both commit, no error, balances back to 1000 / 1000.</p>`,
  ) },

  { t: 'Node: a pool of 2 hangs two requests forever', giua: true, body: `
${sql(`async function placeOrder(id) {
  const tx = await pool.connect();          // connection #1, held for the transaction
  try { await tx.query(/* INSERT */); await getPrice();  /* helper does pool.query → connection #2 */ }
  finally { tx.release(); }
}`, { lang: 'javascript', sm: true })}
${two(term(b('node pool-deadlock.js 2;')), term(cut(b('node pool-deadlock.js 2 timeout'), 58)))}
<p style="margin:0;font-size:20px">Two requests each hold 1 of 2 connections and wait for a second: a cycle through a <b>counting</b> resource. node-postgres’ default <code class="i">connectionTimeoutMillis = 0</code> waits forever; with a timeout one request is the victim.</p>` },

  { t: 'Banker’s view of the pool — and the real fix', giua: true, body: two(
    term(cut(b('python3 banker.py pool 2 2'), 58)),
    `${term(b('node pool-deadlock.js 2 pass-client'))}
<ul style="font-size:20px">
<li>Banker: with 2 requests each holding 1, the state is <b>unsafe</b></li>
<li>Rule of thumb: <b>pool size &gt; concurrency × (max per request − 1)</b>, or…</li>
<li>…never hold two: pass the transaction’s client down (<code class="i">getPrice(tx)</code>)</li>
</ul>`) },

  { t: 'An await cycle: no threads, no locks, still stuck', giua: true, body: two(
    sql(`const deps = { config: ['secrets'], secrets: ['config'] };
function load(name) {      // build each once
  if (!cache.has(name)) cache.set(name, build(name));
  return cache.get(name);
}
async function build(name) {
  await readFile(…);
  for (const d of deps[name]) await load(d);
  return { name };
}
await load('config');   // config → secrets → config`, { lang: 'javascript', sm: true }),
    `${term(cut(b('node await-cycle.mjs', 1, { drop: /^$/ }), 58))}
${term(cut(b('node await-cycle.mjs server', 2), 58))}
<p style="margin:0;font-size:19px">Script: Node sees an empty event loop and exits <b>13</b>. Server: the socket keeps it alive, every request hangs silently (<code class="i">curl</code> exit 28), CPU ≈ 2%.</p>`) },

  { t: 'Pool starvation: /health behind slow reports', giua: true, body: two(
    term(b('node pool-starve.js shared')),
    term(b('node pool-starve.js bulkhead')),
  ) + `${box('Not a deadlock — starvation', 'Shared pool of 2: four 1-second reports queue first, so a 5 ms health check waits <b>1.9 s</b> and the load balancer may mark the instance dead. Bulkhead (1 + 1): /health waits 6 ms, reports take 4 s instead of 2 — you choose who waits.', 'do2')}` },

  { t: 'Why real systems rarely run the Banker’s algorithm', giua: true, body: vsd(
    `<ul style="font-size:21px"><li>Needs every process’s <b>maximum</b> up front — a web request does not know it</li><li>Fixed set of processes and resources; real ones come and go</li><li>Safety check on <b>every</b> request: O(m·n²)</li><li>Refuses requests that would have been fine</li></ul>`,
    `<ul style="font-size:21px"><li><b>Prevent</b> in code: lock order, short critical sections, never two pool connections</li><li><b>Detect</b> in databases: deadlock_timeout + victim + app retry on 40P01</li><li><b>Time out</b> everything that waits: locks, pool acquire, HTTP</li><li>Banker’s survives in exams — and in the pool-size reasoning above</li></ul>`,
    '✗ Banker’s in production', '✓ What we do instead') },

  { t: 'Cheat sheet — avoidance and detection', giua: true, body: `
<table class="t" style="font-size:21px">
<tr><th style="width:40%">You want to…</th><th>Do</th></tr>
<tr><td>Check a Banker’s state by hand</td><td>Need = Max − Allocation; Work = Available; finish anyone with Need ≤ Work, add its Allocation</td></tr>
<tr><td>Decide a request</td><td>≤ Need? ≤ Available? pretend → safe? grant : wait</td></tr>
<tr><td>See a DB lock cycle live</td><td><code class="i">SELECT pid, pg_blocking_pids(pid) FROM pg_stat_activity</code></td></tr>
<tr><td>Find past deadlocks</td><td>server log “detected deadlock”; app logs SQLSTATE 40P01</td></tr>
<tr><td>Stop a pool deadlock</td><td>pass the client down; <code class="i">connectionTimeoutMillis</code>; separate pools</td></tr>
</table>
${box('Next', 'The Chapter 6 check — ten questions built on these measurements.', 'lam')}` },
]);
