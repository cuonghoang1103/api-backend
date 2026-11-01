/**
 * api-09-3 — API Design · Chapter 9 · Lesson 9.3 "Read-after-write" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: content/courses/api-design/s09-du-lieu.mjs › api-9-2-db-doc. Output = chạy thật PostgreSQL 18 primary :55432 + replica :55433 (trễ 2s).
 */
import { lamDeck, sql, http, two, box, cards, flow } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 9 — Data at scale', bai: '9.3' };

export const deck = { key: 'api-09-3', code: 'API 9.3', title: 'Read-after-write', sub: 'Replicas and stale reads in the contract' };

export const slides = lamDeck(meta, [
  { cover: true, t: '“I saved it<br>and it vanished”', sub: 'A real read replica, measured —<br>and a fix in the contract.' },

  { t: 'A real primary and a real replica', giua: true, body: http(`$ pg_basebackup -h localhost -p 55432 -U labflow -D pgreplica -R -X stream
$ echo "recovery_min_apply_delay = '2s'" >> pgreplica/postgresql.auto.conf   # learning only
$ pg_ctl -D pgreplica -l pgreplica.log -o "-p 55433 -c unix_socket_directories=''" start`, { sm: true, wrap: 'any' }) + flow([
    { t: 'POST note', s: 'primary :55432 · commit' },
    { t: 'WAL stream', s: 'applied after the delay', mau: '#7a5195' },
    { t: 'GET note', s: 'replica :55433 · not yet', mau: '#c0392b' },
  ]) + box('Production', 'Lag is usually milliseconds — and seconds under load or during long queries. 2 s makes it visible on a laptop.', 'lam') },

  { t: 'Write to the primary, read from the replica', giua: true, body: two(http(`$ curl … POST /v2/labs/lab_2/notes --json '{"body":"…"}'
{"id":"note_2","labId":"lab_2","author":"Cô Lan",…}
HTTP/1.1 201 Created
Location: /v2/notes/note_2
LabFlow-Consistency: 0/12025328

$ curl -i /v2/notes/note_2          # immediately
HTTP/1.1 404 Not Found
LabFlow-Read-From: replica
  "code": "NOTE_NOT_FOUND"
$ curl /v2/labs/lab_2/notes | jq '[.data[].id]'
[]
$ sleep 2.5; curl … /v2/notes/note_2
200`, { sm: true, wrap: 'any' }), box('Nothing is broken', 'The copy is 2 s behind. For Lan the app looks broken: “I saved it and it vanished.”', 'do2') + box('Migrations lag too', 'Reading the brand-new lab_notes table from the replica too early gave <b>500</b> “relation does not exist”. Migrate, wait for replicas, then ship readers.', 'do2')) },

  { t: 'Three fixes, in order of cost', to: true, giua: true, body: cards([
    ['1 · Return the result of the write', '201 + the full note: the screen that wrote needs no second read.'],
    ['2 · Read your own writes', 'For a few seconds after a write, THIS user reads the primary (session flag, cookie).'],
    ['3 · A consistency token', 'Write returns its WAL position; reads send it back; the replica is used only once it has caught up.'],
  ]) + box('LabFlow’s header', '<code class="i">LabFlow-Consistency: 0/12025438</code> = pg_current_wal_lsn() after the INSERT.', 'lam') },

  { t: 'The token, measured', giua: true, body: two(sql(`async function readPool(req, res) {
  const token = req.get('LabFlow-Consistency');
  if (MODE !== 'token' || !token) return replica;
  const t0 = performance.now();
  while (performance.now() - t0 < 300) {          // budget 300 ms
    const { rows: [r] } = await replica.query(
      'SELECT pg_last_wal_replay_lsn() >= $1::pg_lsn AS ok', [token]);
    if (r.ok) return replica;                       // caught up
    await sleep(20);
  }
  return primary;                                   // still behind
}`, { lang: 'javascript', sm: true, hl: [7, 11] }), http(`# right after the write (replica 2 s behind)
HTTP/1.1 200 OK
LabFlow-Read-From: primary
Server-Timing: wait;dur=318.29, total;dur=320.23

# 2.5 s later, same token
HTTP/1.1 200 OK
LabFlow-Read-From: replica
Server-Timing: wait;dur=0.43, total;dur=1.60`, { sm: true, wrap: 'any' }) + box('Contract', 'Reads are eventually consistent. Send LabFlow-Consistency to see your own write: up to 300 ms slower, never older.', 'xanh'), 'r64') },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Real streaming replica, 2 s apply delay: a just-written note was <b>404</b>, then 200 after 2.5 s</li>
<li>Schema changes lag too: reading a new table too early gave <b>500</b></li>
<li>Fixes: return the written resource · read-your-writes · a consistency token (LSN)</li>
<li>Token reads went to the primary while lagging, back to the replica (0.4 ms check) once caught up</li>
</ul>
${box('Next', 'Lesson 9.4 — IDs and pagination that survive sharding.', 'xanh')}` },
]);
