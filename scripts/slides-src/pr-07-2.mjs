/**
 * pr-07-2 — Prisma ORM · Chapter 7 · Lesson 7.2 "Isolation levels, demonstrated" (deck video, 12/11/2026). Bài web: pr-7-2-muc-co-lap.
 * Output THẬT (`chay.sh p7-2`, demo/lab/p7/72, CSDL c72, Prisma 6.19.3 · PostgreSQL 16.14): log = BEGIN rồi SET TRANSACTION ISOLATION LEVEL … (web: BEGIN ISOLATION LEVEL) ·
 * mảng MỘT câu KHÔNG có giao dịch ⇒ isolationLevel bị bỏ qua (read committed) · RC: đọc lại 1000 → 2000, đếm 0 → 1; RR giữ nguyên · 2 admin: RC 3, RR 3,
 * Serializable 2 (một P2034, meta rỗng — web in meta 40001) · retry ⇒ lần thử lại gặp "Da du 2 admin" · ràng buộc ô 1/2 + unique một phần ⇒ 2 admin, ghi thẳng bị CHECK chặn.
 */
/* Output chạy THẬT, đóng băng từ thư mục demo của khoá video Prisma (12/11/2026) — deck tự chứa, không đọc tệp ngoài repo. */
const DU_LIEU = {
 "demo/out/p7-2/muc.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c72 npx tsx p7/72/muc.mts\nprisma:query BEGIN\nprisma:query SET TRANSACTION ISOLATION LEVEL SERIALIZABLE\nprisma:query SELECT COUNT(*) AS \"_count$_all\" FROM (SELECT \"id\" FROM \"users\" WHERE 1=1 OFFSET $1) AS \"sub\"\nprisma:query COMMIT\nprisma:query BEGIN\nprisma:query SET TRANSACTION ISOLATION LEVEL REPEATABLE READ\nprisma:query SELECT COUNT(*) AS \"_count$_all\" FROM (SELECT \"id\" FROM \"users\" WHERE 1=1 OFFSET $1) AS \"sub\"\nprisma:query SELECT COUNT(*) AS \"_count$_all\" FROM (SELECT \"id\" FROM \"posts\" WHERE 1=1 OFFSET $1) AS \"sub\"\nprisma:query COMMIT\n$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c72 npx tsx p7/72/muc2.mts\nSerializable     mảng 1 câu: read committed   · mảng 2 câu: serializable     · tương tác: serializable\nRepeatableRead   mảng 1 câu: read committed   · mảng 2 câu: repeatable read  · tương tác: repeatable read\nReadUncommitted  mảng 1 câu: read committed   · mảng 2 câu: read uncommitted · tương tác: read uncommitted\n",
 "demo/out/p7-2/hai-phien.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c72 npx tsx p7/72/hai-phien.mts\nReadCommitted   lần đọc 1: 1000 · lần đọc 2: 2000   ← non-repeatable read\nRepeatableRead  lần đọc 1: 1000 · lần đọc 2: 1000\nReadCommitted   đếm MOI lần 1: 0 · lần 2: 1   ← phantom read\nRepeatableRead  đếm MOI lần 1: 0 · lần 2: 0\n",
 "demo/out/p7-2/admin.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c72 npx tsx p7/72/admin.mts\n== mac dinh (ReadCommitted): fulfilled, fulfilled · admin: 3\n== RepeatableRead: fulfilled, fulfilled · admin: 3\n== Serializable: fulfilled, rejected · admin: 2\n   PrismaClientKnownRequestError P2034: Transaction failed due to a write conflict or a deadlock. Please retry your transaction\n   meta: {}\n   thu lai lan 1 (P2034)\n== Serializable + retry: rejected: Da du 2 admin, fulfilled · admin: 2\n",
 "demo/out/p7-b/retry-deadlock.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c7b npx tsx p7/7b/retry-deadlock.mts\n== retry chi bat P2034: rejected P2010, fulfilled · da thu lai: P2010 0, P2034 0\n== retry bat P2034 + P2010/40P01: fulfilled, fulfilled · da thu lai: P2010 1, P2034 0\n",
 "demo/lab/p7/72/rang-buoc.sql": "UPDATE users SET role = 'USER', admin_slot = NULL WHERE id > 1;\n-- \"At most 2 admins\", kept by the DATABASE: each admin takes slot 1 or 2, never the same slot\nALTER TABLE users ADD CONSTRAINT admin_slot_1_2 CHECK (admin_slot IN (1, 2));\nALTER TABLE users ADD CONSTRAINT admin_co_slot CHECK ((role = 'ADMIN') = (admin_slot IS NOT NULL));\nCREATE UNIQUE INDEX chi_hai_admin ON users (admin_slot) WHERE role = 'ADMIN';\n",
 "demo/out/p7-2/rang-buoc.txt": "$ docker exec -i prisma-pg psql -U student -d c72 < p7/72/rang-buoc.sql\nUPDATE 19\nALTER TABLE\nALTER TABLE\nCREATE INDEX\n$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c72 npx tsx p7/72/admin-rang-buoc.mts\nfulfilled | rejected: Da du 2 admin | rejected: Da du 2 admin\nadmin: 2\npsql-style ghi thang: PrismaClientKnownRequestError P2010: Raw query failed. Code: `23514`. Message: `ERROR: new row for relation \"users\" violates check constraint \"admin_slot_1_2\" DETAIL: Failing row contains (13, u13@vd.vn, ADMIN, 3).`\n"
};
const fs = { readFileSync: (p) => { const k = String(p); if (!(k in DU_LIEU)) throw new Error('thiếu dữ liệu đóng băng: ' + k); return DU_LIEU[k]; } };
import { lamDeck, tp, ts, sql, two, box, cards, c, tbl, steps } from './_pr-chung.mjs';

export const deck = { key: 'pr-07-2', code: 'PR 7.2', title: 'Isolation levels, demonstrated', sub: 'Chapter 7 · Lesson 7.2' };

const DEMO = 'demo';
const OUT = (t) => fs.readFileSync(`${DEMO}/out/p7-2/${t}.txt`, 'utf8').replace(/\n+$/, '');
const SRC = (t) => fs.readFileSync(`${DEMO}/lab/p7/72/${t}`, 'utf8').replace(/\n+$/, '');
const gon = (s) => s.replace(/^\$ DATABASE_URL=\S+ /gm, '$ ').replace(/p7\/72\//g, '').replace(/ AS "_count\$_all"/g, '')
  .replace(/docker exec -i prisma-pg psql -U student -d (\w+)/g, 'psql $1').split('\n').filter((l) => !/^\s*$/.test(l)).join('\n');
const cat = (t, i) => gon(OUT(t)).split(/\n(?=\$ )/)[i];

export const slides = lamDeck({ chuong: 'Chapter 7 — Transactions and concurrency', bai: '7.2' }, [
  /* 1 */ { cover: true, nhan: 'Chapter 7 · Lesson 7.2', t: 'Isolation levels, demonstrated', sub: 'What one transaction can see while another runs — reproduced, not described' },
  /* 2 */ { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Setting a level — and the case where Prisma silently ignores it</li>
    <li>Non-repeatable and phantom reads, in two sessions</li>
    <li>Write skew: two admins become three</li>
    <li>Serializable: one fails with P2034, and the retry</li>
    <li>The cheaper fix: let a constraint enforce the rule</li></ul>` },
  /* 3 */ { t: 'Setting it — what Prisma actually sends', body: ts(`await prisma.$transaction(async (tx) => tx.user.count(),
  { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
await prisma.$transaction([prisma.user.count(), prisma.post.count()],
  { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead });`, { sm: true }) + tp(cat('muc', 0), { wrap: 130, fs: 13 }) +
      box('BEGIN, then SET TRANSACTION ISOLATION LEVEL', 'Omit the option and you get the database default — <code>read committed</code> on PostgreSQL.', 'lam') },
  /* 4 */ { t: 'The trap: an array of ONE query has no transaction', body: ts(`const show = () => prisma.$queryRaw\`SHOW transaction_isolation\`;
await prisma.$transaction([show()], { isolationLevel });                      // array, 1 query
await prisma.$transaction([show(), prisma.user.count()], { isolationLevel }); // array, 2 queries
await prisma.$transaction(async (tx) => tx.$queryRaw\`SHOW …\`, { isolationLevel });`, { sm: true }) + tp(cat('muc', 1), { wrap: 140, fs: 13 }) +
      box('Silently ignored', 'A one-element array runs as a plain query — no BEGIN, so no isolation level. Two elements or the callback form, and the level is real. ReadUncommitted is accepted and behaves as read committed on PostgreSQL.', 'do2') },
  /* 5 */ { t: 'Two sessions: what each level lets through', body: ts(`const [lan1, lan2] = await A.$transaction(async (tx) => {
  const a = (await tx.account.findUniqueOrThrow({ where: { id: 5 } })).balance;
  await B.account.update({ where: { id: 5 }, data: { balance: 2000 } });   // session B commits
  const b = (await tx.account.findUniqueOrThrow({ where: { id: 5 } })).balance;
  return [a, b];
}, { isolationLevel });`, { sm: true }) + tp(gon(OUT('hai-phien')), { wrap: 120, fs: 15 }) +
      cards([
        ['Non-repeatable read', 'Same row, two values in one transaction. READ COMMITTED allows it.'],
        ['Phantom read', 'Same query, a new row appears. READ COMMITTED allows it.'],
        ['Dirty read', 'Never, at any level, on PostgreSQL.'],
      ], 3) },
  /* 6 */ { t: 'Write skew: "at most 2 admins"', body: ts(`async function levelUp(userId: number, isolationLevel?) {
  return prisma.$transaction(async (tx) => {
    const adminCount = await tx.user.count({ where: { role: 'ADMIN' } });
    if (adminCount >= 2) throw new Error('Da du 2 admin');
    return tx.user.update({ where: { id: userId }, data: { role: 'ADMIN' } });
  }, { isolationLevel });
}
await Promise.allSettled([levelUp(10), levelUp(11)]);   // 1 admin to start with`, { sm: true }) +
      tp(gon(OUT('admin')).split('\n').filter((l) => /^== (mac|Repeat)/.test(l)).join('\n'), { wrap: 120, fs: 15 }) +
      box('Both counted 1, both wrote', 'Neither transaction did anything wrong alone; the rule was broken by the pair. REPEATABLE READ does not prevent it either.', 'do2') },
  /* 7 */ { t: 'Serializable: one of them fails', body: ts(`await Promise.allSettled([
  levelUp(10, Prisma.TransactionIsolationLevel.Serializable),
  levelUp(11, Prisma.TransactionIsolationLevel.Serializable),
]);`, { sm: true }) + tp(gon(OUT('admin')).split('\n').filter((l) => /^== Serializable:|P2034|meta/.test(l)).join('\n'), { wrap: 130, fs: 14 }) +
      cards([
        ['The rule holds', 'Two admins, not three. PostgreSQL aborted the transaction whose result could not come from running them one after another.'],
        ['The price is an error', 'P2034, "write conflict or a deadlock — please retry". Here <code>meta</code> was empty: catch on the code.'],
        ['So you need a retry', 'Serializable without a retry wrapper just turns a silent bug into a visible failure.'],
      ], 3) },
  /* 8 */ { t: 'The retry wrapper — catch raw-query deadlocks too', body: two(ts(`const K = Prisma.PrismaClientKnownRequestError;
function isConflict(e) {
  if (!(e instanceof K)) return false;
  if (e.code === 'P2034') return true;
  const pg = e.meta?.code; // raw query
  return e.code === 'P2010'
    && (pg === '40P01' || pg === '40001');
}
async function retry(fn, max = 5) {
  for (let i = 1; ; i++) {
    try { return await fn(); } catch (e) {
      if (!isConflict(e) || i >= max) throw e;
      const ms = Math.min(50 * 2 ** i, 1000);
      await ngu(ms * (0.5 + Math.random()));
    }
  }
}`, { sm: true }), tp(gon(OUT('admin')).split('\n').filter((l) => /thu lai|retry/.test(l)).join('\n').replace(/^== Serializable \+ retry: /m, '== Serializable + retry:\n   ') + '\n\n# Lesson 7.3 deadlock, two opposite transfers:\n' + gon(fs.readFileSync(`${DEMO}/out/p7-b/retry-deadlock.txt`, 'utf8')).split('\n').filter((l) => /^==/.test(l)).join('\n').replace(/: (rejected|fulfilled)/g, ':\n   $1').replace(/ · da thu lai/g, '\n   da thu lai'), { wrap: 52, fs: 12 }), '') +
      box('Only P2034? A raw-query deadlock slips through', 'Catching only P2034, the deadlocked transfer failed. Also catching P2010 with meta.code 40P01: one retry, both transfers done.', 'lam') },
  /* 9 */ { t: 'The cheaper fix: let the database enforce it', body: sql(SRC('rang-buoc.sql').split('\n').slice(1).join('\n'), { sm: true }) +
      tp(cat('rang-buoc', 1), { wrap: 140, fs: 12 }) +
      box('No isolation level, no retry — and it holds against psql too', 'Each admin takes slot 1 or 2; the partial unique index allows each slot once. Three concurrent promotions: one succeeds (with the existing admin, two in total), and a direct write of slot 3 is refused by the CHECK.', 'xanh') },
  /* 10 */ { t: 'Choosing, in order', body: tbl(['Reach for', 'When'], [
      ['a constraint', 'the rule can be written as UNIQUE / CHECK / FK — strongest, cheapest'],
      ['a precondition in ' + c('where'), 'the check and the write are on the same row (Lesson 4.4)'],
      ['a lock — ' + c('FOR UPDATE'), 'specific rows are contended (Lesson 7.3)'],
      [c('Serializable') + ' + retry', 'complex rules across tables that nothing above can express'],
      [c('RepeatableRead'), 'reports that must be internally consistent — reads only'],
    ]) },
  /* 11 */ { t: 'Your turn — and what to keep', body: two(steps([
      `Check ${c('SHOW transaction_isolation')} in a one-query array`,
      `Reproduce the non-repeatable read in two sessions`,
      `Promote two users at once at each level; count the admins`,
      `Add the slot constraint and promote three at once`,
    ]), box('Keep these', `<ul><li>Default is READ COMMITTED</li><li>One-query array: no transaction</li><li>Write skew survives RR</li><li>Serializable ⇒ P2034 ⇒ retry</li><li>Constraint first</li></ul>`, 'lam'), '') },
]);
