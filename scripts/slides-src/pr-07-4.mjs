/**
 * pr-07-4 — Prisma ORM · Chapter 7 · Lesson 7.4 "Timeouts, retries and idempotency" (deck video, 12/11/2026). Bài web: pr-7-4-timeout.
 * Output THẬT (`chay.sh p7-4`, demo/lab/p7/74, CSDL c74, Prisma 6.19.3 · PostgreSQL 16.14): nhập 10.000 hàng trong giao dịch ⇒ P2028 sau 5,0 s, 0 hàng vào bảng ·
 * createMany theo lô 500 = 20 lô, nhanh, skipDuplicates chạy lại an toàn · pool 1: giao dịch thứ hai P2028 "Unable to start…" sau 2,0 s (maxWait) ·
 * khoá idempotent: 3 lần gọi = 1 giao dịch, trừ đúng 100; khoá mới mỗi lần ⇒ trừ 3 lần.
 */
/* Output chạy THẬT, đóng băng từ thư mục demo của khoá video Prisma (12/11/2026) — deck tự chứa, không đọc tệp ngoài repo. */
const DU_LIEU = {
 "demo/out/p7-4/maxwait.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c74 npx tsx p7/74/maxwait.mts\ngiao dich thu hai, sau 2.0 s: PrismaClientKnownRequestError P2028: Transaction API error: Unable to start a transaction in the given time.\n",
 "demo/out/p7-4/nhap.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c74 npx tsx p7/74/nhap.mts\nsau 5.0 s: P2028 → 7   await prisma.$transaction(async (tx) => { for (const d of dong) await tx.product.create( Transaction API error: Transaction already closed: A query cannot be executed on an expired transaction. The timeout for this transaction was 5000 ms, however 5000 ms passed since the start of the transaction. Consider increasing the interactive transaction timeout or doing less work in the transaction.\nso hang da vao bang: 0\nda nhap 500\nda nhap 1000\nda nhap 10000\ncreateMany theo lo 500: 20 lo, 0.14 s · so hang: 10000\nchay lai 7000 hang dau (skipDuplicates): 0.07 s · so hang van: 10000\n",
 "demo/out/p7-4/idempotent.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c74 npx tsx p7/74/idempotent.mts\nlan 1: giao dich #1, 100\n   P2002 → da lam roi, tra ve ket qua cu\nlan 2: giao dich #1, 100\n   P2002 → da lam roi, tra ve ket qua cu\nlan 3: giao dich #1, 100\nso du: 99900 (truoc: 100000)\nso du sau 3 lan thu lai voi khoa MOI moi lan: 99600\n"
};
const fs = { readFileSync: (p) => { const k = String(p); if (!(k in DU_LIEU)) throw new Error('thiếu dữ liệu đóng băng: ' + k); return DU_LIEU[k]; } };
import { lamDeck, tp, ts, prs, two, box, cards, c, tbl, steps } from './_pr-chung.mjs';

export const deck = { key: 'pr-07-4', code: 'PR 7.4', title: 'Timeouts, retries and idempotency', sub: 'Chapter 7 · Lesson 7.4' };

const DEMO = 'demo';
const OUT = (t) => fs.readFileSync(`${DEMO}/out/p7-4/${t}.txt`, 'utf8').replace(/\n+$/, '');
const gon = (s) => s.replace(/^\$ DATABASE_URL=\S+ /gm, '$ ').replace(/p7\/74\//g, '').replace(/ → \d+\s+await prisma\.\$transaction\(async \(tx\) => \{ for \(const d of dong\) await tx\.product\.create\(/, '')
  .replace(/ Consider increasing/, '\nConsider increasing').split('\n').filter((l) => !/^\s*$/.test(l)).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 7 — Transactions and concurrency', bai: '7.4' }, [
  /* 1 */ { cover: true, nhan: 'Chapter 7 · Lesson 7.4', t: 'Timeouts, retries and idempotency', sub: 'Why the five-second limit is usually right, and how to make a retry happen exactly once' },
  /* 2 */ { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The three timeouts: <code>pool_timeout</code>, <code>maxWait</code>, <code>timeout</code></li>
    <li>An import inside a transaction — and the batched version</li>
    <li>When raising the timeout is right</li>
    <li>Retries that charge twice, and the idempotency key</li>
    <li>Side effects after the commit: the outbox</li></ul>` },
  /* 3 */ { t: 'Three timeouts, stacked', body: ts(`await prisma.$transaction(async (tx) => { /* … */ }, {
  maxWait: 2000,   // ms to wait for a connection before BEGIN (default 2 s)
  timeout: 5000,   // ms the callback may run after BEGIN       (default 5 s)
});
// and in DATABASE_URL: ?connection_limit=10&pool_timeout=10      (default 10 s)`, { sm: true }) +
      cards([
        ['pool_timeout → P2024', 'Any query waiting for a free connection. Lesson 7.1 hit it with a pool of one.'],
        ['maxWait → P2028', '"Unable to start a transaction in the given time". Nothing began, nothing to roll back.'],
        ['timeout → P2028', 'The callback ran too long after BEGIN. Rolled back.'],
      ], 3) },
  /* 4 */ { t: 'maxWait, measured', body: ts(`// DATABASE_URL="…?connection_limit=1"
const dai = prisma.$transaction(async (tx) => { await tx.user.count(); await ngu(3000); },
  { timeout: 10000 });                                     // holds the only connection
await prisma.$transaction(async (tx) => tx.user.count());  // default maxWait: 2 s`, { sm: true }) + tp(gon(OUT('maxwait')), { wrap: 100, fs: 15, title: 'connection_limit = 1, one transaction holds it for 3 s' }) +
      box('Same code as Lesson 7.1’s pool exhaustion', 'Exactly two seconds, then refused before BEGIN. Raising maxWait helps only if the connections will really come back soon.', 'lam') },
  /* 5 */ { t: 'The classic: an import inside a transaction', body: ts(`await prisma.$transaction(async (tx) => {
  for (const d of dong) await tx.product.create({ data: d });   // 10,000 rows
});`, { sm: true }) + tp(gon(OUT('nhap')).split('\n').slice(0, 3).join('\n'), { wrap: 120, fs: 14 }) +
      box('Five seconds, then everything rolled back', 'Not one of the rows stayed. The tempting fix — <code>timeout: 600000</code> — makes it a ten-minute transaction: a connection held, locks piling up, and a long rollback when it fails anyway.', 'do2') },
  /* 6 */ { t: 'The right fix: batch, no long transaction', body: ts(`const KICH_THUOC = 500;
for (let i = 0; i < dong.length; i += KICH_THUOC) {
  await prisma.product.createMany({ data: dong.slice(i, i + KICH_THUOC), skipDuplicates: true });
}`, { sm: true }) + tp(gon(OUT('nhap')).split('\n').slice(3).join('\n'), { wrap: 120, fs: 14 }) +
      box('Fast, resumable, and safe to re-run', 'Twenty batches, no transaction held open. Re-running the first 7,000 rows changed nothing: <code>skipDuplicates</code> makes a crash at batch fourteen harmless.', 'xanh') },
  /* 7 */ { t: 'When raising it is right', body: ts(`await prisma.$transaction(async (tx) => {
  await tx.$executeRaw\`SET LOCAL statement_timeout = '25s'\`;
  await tx.ledger.createMany({ data: butToan });
  await tx.accountingPeriod.update({ where: { id: kyId }, data: { daChot: true } });
}, { maxWait: 5000, timeout: 30000 });`, { sm: true }) +
      cards([
        ['Only when half-done is worse than not-done', 'A month-end close, a related-records migration.'],
        ['Bound each statement too', '<code>SET LOCAL statement_timeout</code> lasts for this transaction only.'],
        ['Never globally', 'Pass the options on the one call that needs them.'],
      ], 3) },
  /* 8 */ { t: 'The retry problem', body: ts(`await retry(async () => {
  await prisma.$transaction(async (tx) => {
    await tx.account.update({ where: { id: 7 }, data: { balance: { decrement: 100 } } });
    await tx.transaction.create({ data: { key: crypto.randomUUID(), fromId: 7, amount: 100 } });
  });
});`, { sm: true }) +
      box('Committed, then the acknowledgement was lost', 'The client sees a failure and retries — and debits again. Nothing in the transaction knows it already happened.', 'do2') +
      tp(gon(OUT('idempotent')).split('\n').filter((l) => /khoa MOI/.test(l)).join('\n').replace(/^/, '$ # three "retries", each with a NEW key\n'), { wrap: 120, fs: 15 }) },
  /* 9 */ { t: 'The idempotency key', body: two(prs(`model Transaction {
  id     Int    @id @default(autoincrement())
  key    String @unique @map("khoa_idempotent")
  fromId Int    @map("tu_id")
  amount Int    @map("so_tien")
}`, { sm: true }), tp(gon(OUT('idempotent')).split('\n').filter((l) => !/khoa MOI/.test(l)).join('\n'), { wrap: 56, fs: 12, title: 'same key, three calls' }), '') + ts(`try {
  return await prisma.$transaction(async (tx) => {
    const gd = await tx.transaction.create({ data: { key, fromId, amount } });   // the unique key is the guard
    await tx.account.update({ where: { id: fromId }, data: { balance: { decrement: amount } } });
    return gd;
  });
} catch (e) {
  if (e.code === 'P2002') return prisma.transaction.findUniqueOrThrow({ where: { key } });   // already done
  throw e;
}`, { sm: true }) },
  /* 10 */ { t: 'What makes it work', body: cards([
      ['The caller makes the key', 'Once, before the first attempt, reused on every retry. A server-made key changes each time.'],
      ['The constraint enforces it', 'A <code>@unique</code> column rejects the second insert however simultaneous. A findUnique check first would race.'],
      ['Return the original result', 'It already happened; say so. The endpoint becomes safe to retry by anyone.'],
      ['Expire old keys', 'A cleanup job keeps the table small — keys only matter for the retry window.'],
    ], 2) },
  /* 11 */ { t: 'Side effects after the commit: the outbox', body: two(ts(`// inside the transaction: record the intent
await prisma.$transaction(async (tx) => {
  const order = await tx.order.create({ data: { … } });
  await tx.outbox.create({ data: {
    kind: 'DON_HANG_MOI', payload: { orderId: order.id } } });
});`, { sm: true }), cards([
        ['Never inside', 'An email sent inside cannot be rolled back if a later statement fails.'],
        ['Intent commits with the data', 'Both rows or neither.'],
        ['A worker acts later', 'SKIP LOCKED (Lesson 7.3) — and marks the row done only AFTER acting, so a crash repeats rather than loses it: at-least-once.'],
      ], 1), 'r64') },
  /* 12 */ { t: 'Your turn — and what to keep', body: two(steps([
      `Import 10,000 rows inside a transaction; read the P2028`,
      `Batch it with ${c('createMany')} + ${c('skipDuplicates')}; run it twice`,
      `Hold the only connection; watch ${c('maxWait')} refuse the next`,
      `Call a withdrawal three times with one key, then with three keys`,
    ]), box('Keep these', `<ul><li>5 s is a feature</li><li>Batch instead of raising it</li><li>maxWait and timeout both say P2028</li><li>Retries need an idempotency key</li></ul>`, 'lam'), '') },
]);
