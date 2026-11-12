/**
 * pr-07-3 — Prisma ORM · Chapter 7 · Lesson 7.3 "Locking: pessimistic, optimistic, advisory" (deck video, 12/11/2026). Bài web: pr-7-3-khoa.
 * Output THẬT (`chay.sh p7-3`, demo/lab/p7/73, CSDL c73, Prisma 6.19.3 · PostgreSQL 16.14): 1 vé, 2 người: đọc-rồi-ghi ⇒ cả hai mua, stock −1; FOR UPDATE ⇒ một người ·
 * SELECT thường không bị chặn, UPDATE cùng hàng đợi · 4 worker 40 việc: findFirst ⇒ 109 lần nhận trùng; SKIP LOCKED ⇒ 0 · version: A count 1, B count 0 ·
 * advisory phiên qua pool: unlock trả false, khoá còn (rò) · dạng xact: server 2 bỏ qua, 0 khoá sau COMMIT · deadlock qua $queryRaw = P2010 + meta 40P01 (web: P2034).
 */
/* Output chạy THẬT, đóng băng từ thư mục demo của khoá video Prisma (12/11/2026) — deck tự chứa, không đọc tệp ngoài repo. */
const DU_LIEU = {
 "demo/out/p7-3/for-update.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c73 npx tsx p7/73/for-update.mts\n== doc roi ghi, khong khoa: An: mua duoc | Binh: mua duoc · stock con: -1\n== SELECT … FOR UPDATE: An: Khong du hang | Binh: mua duoc · stock con: 0\nSELECT thuong trong luc hang bi khoa: 7 ms\nUPDATE cung hang do: doi 1.7 s\n",
 "demo/out/p7-3/skip-locked.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c73 npx tsx p7/73/skip-locked.mts\n== findFirst roi update: 4 worker nhan 149 lan cho 40 viec · 109 lan nhan TRUNG · 37 viec bi danh dau 2 lan tro len\n== FOR UPDATE SKIP LOCKED: 4 worker nhan 40 lan cho 40 viec · 0 lan nhan TRUNG · 0 viec bi danh dau 2 lan tro len\n",
 "demo/out/p7-3/lac-quan.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c73 npx tsx p7/73/lac-quan.mts\nprisma:query UPDATE \"documents\" SET \"version\" = $1 WHERE (\"id\" = $2 AND 1=1) RETURNING \"id\", \"body\", \"version\"\nprisma:query BEGIN\nprisma:query UPDATE \"documents\" SET \"body\" = $1, \"version\" = (\"version\" + $2) WHERE (\"id\" = $3 AND \"version\" = $4)\nprisma:query COMMIT\nA luu (dang thay version 3): 1\nprisma:query BEGIN\nprisma:query UPDATE \"documents\" SET \"body\" = $1, \"version\" = (\"version\" + $2) WHERE (\"id\" = $3 AND \"version\" = $4)\nprisma:query COMMIT\nB luu (van dang thay version 3): 0\nprisma:query SELECT \"id\", \"body\", \"version\" FROM \"documents\" WHERE (\"id\" = $1 AND 1=1) LIMIT $2 OFFSET $3\n{ id: 1, body: 'Ban cua A', version: 4 }\n",
 "demo/out/p7-3/advisory.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c73 npx tsx p7/73/advisory.mts\npg_try_advisory_lock: true\npg_advisory_unlock: false\nkhoa advisory con ton tai sau khi \"nha\": 1\n",
 "demo/out/p7-3/advisory-xact.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c73 npx tsx p7/73/advisory-xact.mts\nserver 1: nhap xong\nserver 2: mot ban khac dang chay. Bo qua.\nkhoa advisory con lai sau COMMIT: 0\n",
 "demo/out/p7-3/deadlock.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c73 npx tsx p7/73/deadlock.mts\n== khoa theo chieu chuyen: fulfilled, rejected · 1.3 s\n   PrismaClientKnownRequestError P2010: Process 682 waits for ShareLock on transaction 1324; blocked by process 681. HINT: See server log for query details.`\n   meta: {\"code\":\"40P01\",\"message\":\"ERROR: deadlock detected\\nDETAIL: Process 681 waits for ShareLock on transaction 1325; blocked by process 682.\\nProcess 682 waits for ShareLock on transaction 1324; blocked by process 681.\\nHINT: See server log for query details.\"}\n== khoa theo id tang dan: fulfilled, fulfilled · 0.4 s\n$ docker logs prisma-pg 2>&1 | grep -A3 'deadlock detected' | tail -4\n2026-11-12 01:18:24.292 UTC [681] ERROR:  deadlock detected\n2026-11-12 01:18:24.292 UTC [681] DETAIL:  Process 681 waits for ShareLock on transaction 1325; blocked by process 682.\n\tProcess 682 waits for ShareLock on transaction 1324; blocked by process 681.\n\tProcess 681: SELECT id FROM tai_khoan WHERE id = $1 FOR UPDATE\n"
};
const fs = { readFileSync: (p) => { const k = String(p); if (!(k in DU_LIEU)) throw new Error('thiếu dữ liệu đóng băng: ' + k); return DU_LIEU[k]; } };
import { lamDeck, tp, ts, sql, two, box, cards, c, tbl, steps } from './_pr-chung.mjs';

export const deck = { key: 'pr-07-3', code: 'PR 7.3', title: 'Locking: pessimistic, optimistic, advisory', sub: 'Chapter 7 · Lesson 7.3' };

const DEMO = 'demo';
const OUT = (t) => fs.readFileSync(`${DEMO}/out/p7-3/${t}.txt`, 'utf8').replace(/\n+$/, '');
const gon = (s) => s.replace(/^\$ DATABASE_URL=\S+ /gm, '$ ').replace(/p7\/73\//g, '').replace(/docker logs prisma-pg 2>&1 \| grep -A3 'deadlock detected' \| tail -4/, 'docker logs prisma-pg | grep -A3 "deadlock detected"')
  .replace(/ WHERE \("id" = \$(\d) AND 1=1\)/g, ' WHERE "id" = $$$1').split('\n').filter((l) => !/^\s*$/.test(l)).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 7 — Transactions and concurrency', bai: '7.3' }, [
  /* 1 */ { cover: true, nhan: 'Chapter 7 · Lesson 7.3', t: 'Locking: pessimistic, optimistic, advisory', sub: 'Make others wait, detect the collision afterwards, or lock something that is not a row' },
  /* 2 */ { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li><code>SELECT … FOR UPDATE</code> — the last ticket, two buyers</li>
    <li><code>SKIP LOCKED</code> — a job queue four workers can share</li>
    <li>Optimistic locking with a version column</li>
    <li>Advisory locks — and the session form that leaks through a pool</li>
    <li>A real deadlock, and the ordering that prevents it</li></ul>` },
  /* 3 */ { t: 'Pessimistic: SELECT … FOR UPDATE', body: ts(`await prisma.$transaction(async (tx) => {
  const [sp] = await tx.$queryRaw\`
    SELECT id, stock FROM products WHERE id = 1 FOR UPDATE\`;
  if (sp.stock < 1) throw new Error('Khong du hang');
  await tx.product.update({ where: { id: 1 },
    data: { stock: { decrement: 1 } } });
});`, { sm: true }) + tp(gon(OUT('for-update')).split('\n').filter((l) => /^==/.test(l)).join('\n'), { wrap: 130, fs: 15, title: 'one ticket left, two buyers at once' }) +
      box('Without the lock both bought it — stock −1', 'Both read stock 1 before either wrote. <code>FOR UPDATE</code> makes the second buyer wait for the first to commit, then read 0. Prisma Client has no FOR UPDATE option, so the locking read is <code>tx.$queryRaw</code>.', 'do2') },
  /* 4 */ { t: 'Who waits for a row lock', body: tp(gon(OUT('for-update')).split('\n').filter((l) => /SELECT thuong|UPDATE cung/.test(l)).join('\n').replace(/^/, '# one transaction holds FOR UPDATE on product 1 for 2 seconds\n'), { wrap: 120, fs: 16 }) +
      cards([
        ['Plain readers: never', 'MVCC — a normal SELECT read the row in a few milliseconds.'],
        ['Writers and lockers: until COMMIT', 'An UPDATE of the same row waited for the lock holder to finish.'],
        ['So keep it short', 'Every other buyer of that product waits for the whole callback.'],
      ], 3) +
      sql(`SELECT … FOR UPDATE;              -- wait for the lock
SELECT … FOR UPDATE NOWAIT;       -- fail at once if locked (55P03)
SELECT … FOR UPDATE SKIP LOCKED;  -- skip locked rows: the job queue
SELECT … FOR SHARE;               -- others may share-lock, not write`, { sm: true }) },
  /* 5 */ { t: 'SKIP LOCKED: a queue four workers can share', body: ts(`const [v] = await tx.$queryRaw\`
  SELECT id FROM jobs WHERE status = 'CHO'
  ORDER BY id FOR UPDATE SKIP LOCKED LIMIT 1\`;
if (!v) return null;
await tx.job.update({ where: { id: v.id },
  data: { status: 'DANG_CHAY', attempts: { increment: 1 } } });
// naive version: findFirst({ where: { status: 'CHO' } }) then update — every worker can grab the same job`, { sm: true }) +
      tp(gon(OUT('skip-locked')), { wrap: 140, fs: 13 }) +
      box('109 duplicate pickups versus none', 'Each SKIP LOCKED worker got the first row nobody else had locked — no Redis, no broker, no coordination.', 'xanh') },
  /* 6 */ { t: 'Optimistic: a version column', body: ts(`const r = await prisma.document.updateMany({
  where: { id, version: knownVersion },          // only if nobody else wrote
  data:  { body, version: { increment: 1 } },
});
if (r.count === 0) throw new Error('Tai lieu da bi nguoi khac sua. Tai lai va thu lai.');`, { sm: true }) +
      tp(gon(OUT('lac-quan')).split('\n').filter((l) => !/SET "version" = \$1 WHERE|^prisma:query SELECT/.test(l)).join('\n'), { wrap: 130, fs: 12 }) +
      box('No lock, nobody waits — the loser is told', 'A saved first (count 1, version 4); B, still on version 3, got count 0 instead of silently overwriting A. Right for long human edits where collisions are rare.', 'lam') },
  /* 7 */ { t: 'Advisory locks through a pool: the leak', body: ts(`const [{ ok }] = await prisma.$queryRaw\`SELECT pg_try_advisory_lock(\${KHOA}) AS ok\`;
await Promise.all(/* … other queries run meanwhile … */);
const [{ unlock }] = await prisma.$queryRaw\`SELECT pg_advisory_unlock(\${KHOA}) AS unlock\`;`, { sm: true }) +
      tp(gon(OUT('advisory')), { wrap: 120, fs: 15, title: 'connection_limit = 5' }) +
      box('The unlock ran on another connection', 'A session advisory lock belongs to the connection that took it. Through a pool, the unlock can land elsewhere: it returns false and the lock stays held until that connection closes — the next run of the job is locked out.', 'do2') },
  /* 8 */ { t: 'The form that cannot leak: pg_try_advisory_xact_lock', body: ts(`return prisma.$transaction(async (tx) => {
  const [{ ok }] = await tx.$queryRaw\`SELECT pg_try_advisory_xact_lock(\${KHOA}) AS ok\`;
  if (!ok) return 'mot ban khac dang chay. Bo qua.';
  await nhapDuLieu();                               // the exclusive work
  return 'nhap xong';
}, { timeout: 10000 });`, { sm: true }) + tp(gon(OUT('advisory-xact')), { wrap: 120, fs: 15 }) +
      box('Released at COMMIT, on the right connection', 'Server 2 skipped while server 1 ran; afterwards no advisory lock remained. A distributed lock you already have — for a cron job, an import, an index rebuild.', 'xanh') },
  /* 9 */ { t: 'A real deadlock', body: ts(`// transfer(1 → 2) and transfer(2 → 1) at the same moment
await tx.$queryRaw\`SELECT id FROM tai_khoan WHERE id = \${from} FOR UPDATE\`;
await tx.$queryRaw\`SELECT id FROM tai_khoan WHERE id = \${to}   FOR UPDATE\`;`, { sm: true }) +
      tp(gon(OUT('deadlock')).split(/\n(?=\$ )/)[0].split('\n').filter((l) => /^==|meta/.test(l)).join('\n').replace(/\\n/g, '\n        '), { wrap: 130, fs: 12 }) +
      box('P2010, not P2034', 'The deadlock happened in a raw query, so Prisma reported it as P2010 with <code>meta.code = "40P01"</code>. A retry wrapper that only checks P2034 would not retry it. PostgreSQL detected it in about a second and killed one transaction.', 'do2') },
  /* 10 */ { t: 'The fix: always lock in the same order', body: ts(`const [dau, sau] = [from, to].sort((a, b) => a - b);      // ascending id, always
await tx.$queryRaw\`SELECT id FROM tai_khoan WHERE id IN (\${dau}, \${sau}) ORDER BY id FOR UPDATE\`;`, { sm: true }) +
      tp(gon(OUT('deadlock')).split(/\n(?=\$ )/)[0].split('\n').filter((l) => /^== khoa theo id/.test(l)).join('\n') + '\n' + gon(OUT('deadlock')).split(/\n(?=\$ )/)[1], { wrap: 130, fs: 13 }) +
      box('A deadlock is a design smell, not bad luck', 'It means two code paths take the same locks in different orders — and it will keep happening until they agree on one order.', 'lam') },
  /* 11 */ { t: 'Choosing', body: tbl(['Tool', 'For'], [
      ['atomic operator / precondition in ' + c('where'), 'counters, stock, guarded transitions — try first'],
      ['optimistic: a version column', 'long human edits; the loser must be told'],
      ['pessimistic: ' + c('FOR UPDATE'), 'short machine transactions with frequent collisions; ' + c('SKIP LOCKED') + ' for queues'],
      ['advisory: ' + c('pg_try_advisory_xact_lock'), 'protecting a process, not a row'],
    ]) + box('In that order', 'Each step down costs more: waiting, retries, or a second system. Most code never needs to go past the first row.', 'lam') },
  /* 12 */ { t: 'Your turn — and what to keep', body: two(steps([
      `Sell the last ticket twice, with and without ${c('FOR UPDATE')}`,
      `Run four workers on 40 jobs with ${c('SKIP LOCKED')}`,
      `Take a session advisory lock through a pool; try to unlock it`,
      `Deadlock two transfers; fix by ordering`,
    ]), box('Keep these', `<ul><li>Locks are held to COMMIT</li><li>Readers never wait</li><li>SKIP LOCKED = queue</li><li>Use the _xact_ advisory lock</li><li>Raw-query deadlock = P2010</li></ul>`, 'lam'), '') },
]);
