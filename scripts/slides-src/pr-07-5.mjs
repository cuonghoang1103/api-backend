/**
 * pr-07-5 — Prisma ORM · Chapter 7 · Lesson 7.5 "Six concurrency problems, six answers" (deck video, 12/11/2026). Bài web: pr-7-5-sach-cong-thuc.
 * Output THẬT (`chay.sh p7-5` + p7-3 skip-locked, CSDL c75/c73, Prisma 6.19.3 · PostgreSQL 16.14, pool 20): lượt xem 100 yêu cầu: đọc-rồi-ghi 1, increment 100 ·
 * slug 5 yêu cầu: kiểm-rồi-chèn 1 thành công + 4 P2002, chèn-rồi-bắt 5 slug · ghế 10 người: đọc-rồi-trừ 10 người, con_lai −9; updateMany 1 · rate limit CTE của web:
 * đếm KHÔNG thấy hàng vừa chèn (0,1,2), 20 yêu cầu ⇒ 17 lọt (giới hạn 10) · 200 lệnh chuyển: ngây thơ tổng 2.000.000 → 2.360.000; đúng ⇒ giữ nguyên, 200 giao dịch.
 */
/* Output chạy THẬT, đóng băng từ thư mục demo của khoá video Prisma (12/11/2026) — deck tự chứa, không đọc tệp ngoài repo. */
const DU_LIEU = {
 "demo/out/p7-5/sau-bai.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c75 npx tsx p7/75/sau-bai.mts\n1 · luot xem, 100 yeu cau: doc roi ghi → 1 · increment → 100\n2 · slug, 5 yeu cau cung tieu de, kiem roi chen: hoc-prisma-a · loi: P2002, P2002, P2002, P2002\n2 · slug, 5 yeu cau cung tieu de, chen roi bat P2002: hoc-prisma-b-3, hoc-prisma-b, hoc-prisma-b-1, hoc-prisma-b-4, hoc-prisma-b-2\n3 · ghe cuoi, 10 nguoi, doc roi tru: 10 nguoi dat duoc · con_lai = -9\n3 · ghe cuoi, 10 nguoi, updateMany co dieu kien: 1 nguoi dat duoc · con_lai = 0\n",
 "demo/out/p7-5/rate.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c75 npx tsx p7/75/rate.mts\ngoi lan luot 3 lan, cnt tra ve: 0, 1, 2 (bang that dang co 3 hang)\n20 yeu cau cung luc, gioi han 10: 17 yeu cau duoc cho qua · cnt tra ve: 0,1,1,1,1,5,5,5,8,8,8,9,9,9,9,10,10,17,17,19\n",
 "demo/out/p7-b/rate-dung.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c7b npx tsx p7/7b/rate-dung.mts\ngoi lan luot 3 lan: true, true, true\n20 yeu cau cung luc, gioi han 10: 10 yeu cau duoc cho qua\n",
 "demo/out/p7-5/chuyen.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c75 npx tsx p7/75/chuyen.mts\n== ngay tho: tong so du truoc 2000000 · sau 2360000 · thanh cong 200/200 · giao dich ghi lai 0 · lan thu lai 0\n== khoa sap xep + dieu kien + khoa idempotent + retry: tong so du truoc 2000000 · sau 2000000 · thanh cong 200/200 · giao dich ghi lai 200 · lan thu lai 0\n",
 "demo/out/p7-3/skip-locked.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c73 npx tsx p7/73/skip-locked.mts\n== findFirst roi update: 4 worker nhan 149 lan cho 40 viec · 109 lan nhan TRUNG · 37 viec bi danh dau 2 lan tro len\n== FOR UPDATE SKIP LOCKED: 4 worker nhan 40 lan cho 40 viec · 0 lan nhan TRUNG · 0 viec bi danh dau 2 lan tro len\n"
};
const fs = { readFileSync: (p) => { const k = String(p); if (!(k in DU_LIEU)) throw new Error('thiếu dữ liệu đóng băng: ' + k); return DU_LIEU[k]; } };
import { lamDeck, tp, ts, sql, two, box, cards, c, tbl, steps } from './_pr-chung.mjs';

export const deck = { key: 'pr-07-5', code: 'PR 7.5', title: 'Six concurrency problems, six answers', sub: 'Chapter 7 · Lesson 7.5' };

const DEMO = 'demo';
const OUT = (t, ch = 'p7-5') => fs.readFileSync(`${DEMO}/out/${ch}/${t}.txt`, 'utf8').replace(/\n+$/, '');
const gon = (s) => s.replace(/^\$ DATABASE_URL=\S+ /gm, '$ ').replace(/p7\/7\d\//g, '').split('\n').filter((l) => !/^\s*$/.test(l)).join('\n');
const dong = (t, re, ch) => gon(OUT(t, ch)).split('\n').filter((l) => re.test(l)).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 7 — Transactions and concurrency', bai: '7.5' }, [
  /* 1 */ { cover: true, nhan: 'Chapter 7 · Lesson 7.5', t: 'Six concurrency problems, six answers', sub: 'Each naive version run against its fix, concurrently — the test is what tells them apart' },
  /* 2 */ { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>A view counter and a unique slug</li>
    <li>The last seat</li>
    <li>A rate limit — and why one SQL statement did not save it</li>
    <li>A balance transfer, 200 at once</li>
    <li>A job queue, and the pattern across all six</li></ul>` },
  /* 3 */ { t: '1 · A view counter', body: ts(`// naive
const p = await prisma.post.findUniqueOrThrow({ where: { id } });
await prisma.post.update({ where: { id }, data: { views: p.views + 1 } });
// correct — computed by the database
await prisma.post.update({ where: { id }, data: { views: { increment: 1 } } });`, { sm: true }) +
      tp(dong('sau-bai', /^1 ·/), { wrap: 120, fs: 16 }) +
      box('99 of 100 views lost', 'All hundred read 0 at nearly the same moment and wrote 1. <code>increment</code> is one statement under a row lock: no transaction, no retry. Tool: atomic operator.', 'do2') +
      cards([
        ['At very high volume', 'Every increment on one row waits for that row. A viral post becomes a hot row.'],
        ['Then', 'Count in Redis and flush periodically, or insert a row per view and aggregate.'],
      ], 2) },
  /* 4 */ { t: '2 · A unique slug', body: ts(`// naive — check, then insert
if (await prisma.post.findUnique({ where: { slug } })) throw new Error('Trung slug');
await prisma.post.create({ data: { slug, title } });
// correct — insert, catch the collision
for (let i = 0; i < 5; i++) {
  const slug = i === 0 ? base : \`\${base}-\${i}\`;
  try { return await prisma.post.create({ data: { slug, title } }); }
  catch (e) { if (e.code === 'P2002') continue; throw e; }
}`, { sm: true }) + tp(dong('sau-bai', /^2 ·/).replace(/, 5 yeu cau cung tieu de, /g, ', 5 yeu cau, '), { wrap: 120, fs: 13 }) +
      box('The check raced; the constraint did not', 'All five checks said "free", then the unique index refused four of the inserts. Insert-and-catch gave five distinct slugs. Tool: a constraint.', 'lam') },
  /* 5 */ { t: '3 · The last seat', body: ts(`// naive
const g = await prisma.seat.findUniqueOrThrow({ where: { id } });
if (g.remaining < 1) throw new Error('Het ghe');
await prisma.seat.update({ where: { id }, data: { remaining: { decrement: 1 } } });
// correct — the precondition IS the where
const r = await prisma.seat.updateMany({ where: { id, remaining: { gt: 0 } }, data: { remaining: { decrement: 1 } } });
if (r.count === 0) throw new Error('Het ghe');`, { sm: true }) + tp(dong('sau-bai', /^3 ·/), { wrap: 130, fs: 15 }) +
      sql(`-- and the line that makes -9 impossible from any writer, psql included
ALTER TABLE "seat" ADD CONSTRAINT "ghe_con_lai_khong_am" CHECK ("con_lai" >= 0);`, { sm: true }) +
      cards([
        ['Tool: precondition + constraint', 'The where makes check and write one statement; the CHECK guards against every other writer.'],
        ['Booking spans two tables?', 'Seat count AND a ticket row AND a charge: then a transaction with FOR UPDATE on the seat row.'],
      ], 2) },
  /* 6 */ { t: '4 · A rate limit: one statement is not enough', body: two(sql(`-- WRONG: insert and count in one statement
WITH them AS (INSERT INTO api_calls (user_id, tao_luc)
  VALUES (\${userId}, now()) RETURNING id)
SELECT count(*)::int AS cnt FROM api_calls
WHERE user_id = \${userId}
  AND tao_luc >= now() - interval '1 minute';`, { sm: true }) + tp(gon(OUT('rate')).replace(/, gioi han 10:/, ',\ngioi han 10:').replace(/ · cnt tra ve:/, '\ncnt tra ve:'), { wrap: 60, fs: 12 }),
      sql(`-- RIGHT: one counter row per user per minute
INSERT INTO rate_window (user_id, window_start, n)
VALUES (\${userId}, date_trunc('minute', now()), 1)
ON CONFLICT (user_id, window_start)
  DO UPDATE SET n = rate_window.n + 1
RETURNING n;          -- reject if n > 10`, { sm: true }) + tp(gon(OUT('rate-dung', 'p7-b')), { wrap: 60, fs: 12 }), '') +
      box('One snapshot per statement — so lock one row instead', 'The CTE cannot see its own insert or anyone else&#39;s: 17 of 20 got through. The upsert queues every request on one counter row: exactly 10. Redis remains the natural home for rate limits.', 'lam') },
  /* 7 */ { t: '5 · A balance transfer, 200 at once', body: ts(`async function transfer(fromId, toId, money, key) {
  const [a, b] = [fromId, toId].sort((x, y) => x - y);              // ordered locks (7.3)
  return retry(() => prisma.$transaction(async (tx) => {
    await tx.$queryRaw\`SELECT id FROM tai_khoan WHERE id IN (\${a}, \${b}) ORDER BY id FOR UPDATE\`;
    const r = await tx.account.updateMany({                            // precondition (4.4)
      where: { id: fromId, balance: { gte: money } }, data: { balance: { decrement: money } } });
    if (r.count === 0) throw new Error('So du khong du');
    await tx.account.update({ where: { id: toId }, data: { balance: { increment: money } } });
    return tx.transaction.create({ data: { key, fromId, toId, amount: money } });   // idempotency (7.4)
  }));
}`, { sm: true }) + tp(gon(OUT('chuyen')), { wrap: 140, fs: 12 }) +
      box('The test is conservation', 'The naive version created 360,000 out of nothing — lost updates on read-then-write balances. The correct one kept the total at 2,000,000 and recorded all 200 transfers.', 'xanh') },
  /* 8 */ { t: '6 · A job queue', body: tp(gon(OUT('skip-locked', 'p7-3')), { wrap: 140, fs: 13, title: 'Lesson 7.3’s run: 40 jobs, 4 workers' }) + ts(`// the part people forget: jobs whose worker died
await prisma.job.updateMany({
  where: { status: 'DANG_CHAY', receivedAt: { lt: new Date(Date.now() - 5 * 60_000) }, attempts: { lt: 3 } },
  data:  { status: 'CHO' },
});`, { sm: true }) +
      box('A queue is finished only when it recovers', 'SKIP LOCKED hands out jobs correctly; nothing hands them back when a worker is killed. The reclaim query, on a timer, does.', 'lam') },
  /* 9 */ { t: 'The pattern across all six', body: tbl(['Reach for', 'Problems'], [
      ['a constraint — unique, CHECK, foreign key', '2 · 3'],
      ['one statement — atomic operator or precondition in ' + c('where'), '1 · 3'],
      ['a targeted lock — ' + c('FOR UPDATE') + ' in key order, ' + c('SKIP LOCKED'), '5 · 6'],
      ['an idempotency key whenever a retry could repeat a side effect', '5'],
      [c('Serializable') + ' + retry — invariants nothing above can express', '—'],
      ['a different system — Redis for rate limits and hot counters', '4'],
    ]) + box('The habit worth building is the test', 'Every naive version above looked correct when written. Running it a hundred times at once is what told them apart.', 'lam') },
  /* 10 */ { t: 'Your turn — and what to keep', body: two(steps([
      `Fire 100 naive view updates; count what is left`,
      `Sell one seat to ten buyers, both ways`,
      `Run the rate-limit CTE alone, then twenty at once`,
      `Run 200 transfers; compare the total before and after`,
    ]), box('Keep these', `<ul><li>Constraint first, one statement second</li><li>Locks in key order</li><li>Keys for retries</li><li>Test concurrently; check conservation</li></ul>`, 'lam'), '') },
]);
