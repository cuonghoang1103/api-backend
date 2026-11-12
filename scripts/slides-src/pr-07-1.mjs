/**
 * pr-07-1 — Prisma ORM · Chapter 7 · Lesson 7.1 "Two kinds of $transaction" (deck video, 12/11/2026). Bài web: pr-7-1-hai-dang.
 * Output THẬT (`chay.sh p7-1`, demo/lab/p7/71, CSDL c71, Prisma 6.19.3 · PostgreSQL 16.14): mảng = BEGIN … COMMIT · tương tác: đọc, quyết bằng JS, ghi, ném ⇒ ROLLBACK ·
 * gọi `prisma` trong callback đọc giá trị CŨ; pool 1 kết nối ⇒ P2024 sau pool_timeout · ghi lồng = một giao dịch, hai bài trong MỘT INSERT nhiều VALUES ·
 * 20 đơn, pool 10, "HTTP" 2 s trong giao dịch ⇒ 10/20 hỏng P2028 "Unable to start a transaction in the given time" (web: P2024); HTTP ra ngoài ⇒ 20/20.
 */
/* Output chạy THẬT, đóng băng từ thư mục demo của khoá video Prisma (12/11/2026) — deck tự chứa, không đọc tệp ngoài repo. */
const DU_LIEU = {
 "demo/out/p7-1/mang.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c71 npx tsx p7/71/mang.mts\nprisma:query BEGIN\nprisma:query SELECT COUNT(*) AS \"_count$_all\" FROM (SELECT \"id\" FROM \"users\" WHERE 1=1 OFFSET $1) AS \"sub\"\nprisma:query SELECT COUNT(*) AS \"_count$_all\" FROM (SELECT \"id\" FROM \"posts\" WHERE \"views\" >= $1 OFFSET $2) AS \"sub\"\nprisma:query SELECT COUNT(*) AS \"_count$_all\", \"status\" FROM \"orders\" WHERE 1=1 GROUP BY \"status\" OFFSET $1\nprisma:query COMMIT\n{\n  users: 20,\n  posts: 50,\n  orders: [\n    { _count: [Object], status: 'DA_HUY' },\n    { _count: [Object], status: 'DA_GIAO' }\n  ]\n}\n",
 "demo/out/p7-1/tuongtac.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c71 npx tsx p7/71/tuongtac.mts\nprisma:query BEGIN\nprisma:query SELECT \"id\", \"so_du\" FROM \"tai_khoan\" WHERE (\"id\" = $1 AND 1=1) LIMIT $2 OFFSET $3\nprisma:query UPDATE \"tai_khoan\" SET \"so_du\" = (\"so_du\" - $1) WHERE (\"id\" = $2 AND 1=1) RETURNING \"id\", \"so_du\"\nprisma:query UPDATE \"tai_khoan\" SET \"so_du\" = (\"so_du\" + $1) WHERE (\"id\" = $2 AND 1=1) RETURNING \"id\", \"so_du\"\nprisma:query INSERT INTO \"giao_dich\" (\"khoa_idempotent\",\"tu_id\",\"den_id\",\"so_tien\",\"tao_luc\") VALUES ($1,$2,$3,$4,$5) RETURNING \"id\", \"khoa_idempotent\", \"tu_id\", \"den_id\", \"so_tien\", \"tao_luc\"\nprisma:query COMMIT\ngiao dich: 1 30000\nprisma:query BEGIN\nprisma:query UPDATE \"tai_khoan\" SET \"so_du\" = (\"so_du\" - $1) WHERE (\"id\" = $2 AND 1=1) RETURNING \"id\", \"so_du\"\nprisma:query ROLLBACK\nloi: nem loi giua chung\nprisma:query SELECT \"id\", \"so_du\" FROM \"tai_khoan\" WHERE (\"id\" = $1 AND 1=1) LIMIT $2 OFFSET $3\nso du tk1 sau khi nem loi: 70000\n",
 "demo/out/p7-1/tx-sai.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c71 npx tsx p7/71/tx-sai.mts\nprisma: cu@x.com | tx: moi@x.com\nconnection_limit=1, sau 3.0 s: PrismaClientKnownRequestError P2024: → 18     await p1.user.findUniqueOrThrow( Timed out fetching a new connection from the connection pool. More info: http://pris.ly/d/connection-pool (Current connection pool timeout: 3, connection limit: 1)\n",
 "demo/out/p7-1/long.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c71 npx tsx p7/71/long.mts\nprisma:query BEGIN\nprisma:query INSERT INTO \"users\" (\"email\",\"role\") VALUES ($1,CAST($2::text AS \"Role\")) RETURNING \"id\"\nprisma:query INSERT INTO \"posts\" (\"slug\",\"title\",\"views\",\"author_id\") VALUES ($1,$2,$3,$4), ($5,$6,$7,$8)\nprisma:query SELECT \"id\", \"email\", \"role\"::text, \"admin_slot\" FROM \"users\" WHERE \"id\" = $1 LIMIT $2 OFFSET $3\nprisma:query COMMIT\n",
 "demo/out/p7-1/can-pool.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c71 npx tsx p7/71/can-pool.mts\n== HTTP trong giao dich: 10/20 thanh cong, 2.1 s\n   10 × PrismaClientKnownRequestError P2028: Transaction API error: Unable to start a transaction in the given time.\n== HTTP ngoai giao dich: 20/20 thanh cong, 2.0 s\n"
};
const fs = { readFileSync: (p) => { const k = String(p); if (!(k in DU_LIEU)) throw new Error('thiếu dữ liệu đóng băng: ' + k); return DU_LIEU[k]; } };
import { lamDeck, tp, ts, two, box, cards, c, tbl, steps } from './_pr-chung.mjs';

export const deck = { key: 'pr-07-1', code: 'PR 7.1', title: 'Two kinds of $transaction', sub: 'Chapter 7 · Lesson 7.1' };

const DEMO = 'demo';
const OUT = (t) => fs.readFileSync(`${DEMO}/out/p7-1/${t}.txt`, 'utf8').replace(/\n+$/, '');
const gon = (s) => s.replace(/^\$ DATABASE_URL=\S+ /gm, '$ ').replace(/p7\/71\//g, '').replace(/ → \d+\s+await p1\.user\.findUniqueOrThrow\(/, '')
  .replace(/ AS "_count\$_all"/g, '').replace(/ WHERE \("id" = \$\d+ AND 1=1\)/g, (m) => m.replace(' AND 1=1', ''))
  .split('\n').filter((l) => !/^\s*$/.test(l)).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 7 — Transactions and concurrency', bai: '7.1' }, [
  /* 1 */ { cover: true, nhan: 'Chapter 7 · Lesson 7.1', t: 'Two kinds of $transaction', sub: 'The array form, the callback form, and the connection the callback holds while your code runs' },
  /* 2 */ { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The array form — and what it does not give you</li>
    <li>The interactive form: read, decide, write, throw to roll back</li>
    <li>The <code>tx</code> mistake, and the self-deadlock it can cause</li>
    <li>Nested writes are already a transaction</li>
    <li>An HTTP call inside a transaction, measured on a pool of ten</li></ul>` },
  /* 3 */ { t: 'The array form — several statements, one BEGIN', body: ts(`await prisma.$transaction([
  prisma.user.count(),
  prisma.post.count({ where: { views: { gte: 0 } } }),
  prisma.order.groupBy({ by: ['status'], _count: { _all: true } }),
]);`, { sm: true }) + tp(gon(OUT('mang')).split('\n').filter((l) => /^prisma:query|^\$/.test(l)).join('\n'), { wrap: 130, fs: 13 }) +
      cards([
        ['All or nothing', 'One BEGIN, one COMMIT; any failure rolls back everything.'],
        ['Not one snapshot', 'Under READ COMMITTED each statement sees new commits (Lesson 5.4 measured it).'],
        ['Not faster here', 'Statements still run one after another on one connection (Lesson 5.4).'],
        ['No logic between', 'All queries are built before any runs. A decision needs the other form.'],
      ], 4) },
  /* 4 */ { t: 'The interactive form — read, decide, write', body: ts(`await prisma.$transaction(async (tx) => {
  const tk = await tx.account.findUniqueOrThrow({ where: { id: fromId } });
  if (tk.balance < amount) throw new Error('So du khong du');
  await tx.account.update({ where: { id: fromId },
    data: { balance: { decrement: amount } } });
  await tx.account.update({ where: { id: toId },
    data: { balance: { increment: amount } } });
  return tx.transaction.create({ data: { key, fromId, toId, amount } });
});`, { sm: true }) + tp(gon(OUT('tuongtac')).replace(/ RETURNING .*$/gm, ' RETURNING …').replace(/"khoa_idempotent","tu_id","den_id","so_tien","tao_luc"/, '…').replace(/ LIMIT \$2 OFFSET \$3/g, ' LIMIT …').split('\n').filter((l) => !/^prisma:query SELECT "id", "so_du" FROM "tai_khoan" WHERE \("id" = \$1\) LIMIT …$/.test(l) || !/^so du/.test(l)).filter((l, k, a) => !(k === a.length - 2 && /^prisma:query SELECT/.test(l))).join('\n'), { wrap: 150, fs: 10 }) +
      box('Throw to roll back', 'The second run threw after its UPDATE: ROLLBACK, balance still 70000. There is no <code>rollback()</code> to call.', 'lam') },
  /* 5 */ { t: 'The tx mistake, shown', body: ts(`await prisma.$transaction(async (tx) => {
  await tx.user.update({ where: { id: 3 }, data: { email: 'moi@x.com' } });
  const u1 = await prisma.user.findUniqueOrThrow({ where: { id: 3 } });  // WRONG: another connection
  const u2 = await tx.user.findUniqueOrThrow({ where: { id: 3 } });      // RIGHT
  console.log('prisma:', u1.email, '| tx:', u2.email);
});`, { sm: true }) + tp(gon(OUT('tx-sai')).split('\n').slice(0, 2).join('\n'), { wrap: 130, fs: 15 }) +
      box('No warning, just the old value', 'A call on <code>prisma</code> inside the callback runs on a different connection, outside the transaction: it cannot see the uncommitted write and it is not rolled back with it.', 'do2') },
  /* 6 */ { t: 'With a pool of one: the self-deadlock', body: ts(`// DATABASE_URL="…?connection_limit=1&pool_timeout=3"
await p1.$transaction(async (tx) => {
  await tx.user.update({ where: { id: 3 }, data: { email: 'moi2@x.com' } });   // holds the only connection
  await p1.user.findUniqueOrThrow({ where: { id: 3 } });                       // waits for a connection
});`, { sm: true }) + tp(gon(OUT('tx-sai')).split('\n').slice(2).join('\n').replace(/^connection_limit=1/, '$ DATABASE_URL="…?connection_limit=1&pool_timeout=3"\nconnection_limit=1'), { wrap: 120, fs: 15 }) +
      cards([
        ['The transaction holds the only connection', 'Until it commits.'],
        ['The inner prisma call waits for a connection', 'Which the transaction will not release until that call returns.'],
        ['Nothing moves until pool_timeout', 'Then P2024. On a busy server, the same thing happens whenever the pool is full.'],
      ], 3) },
  /* 7 */ { t: 'Nested writes are already a transaction', body: ts(`await prisma.user.create({
  data: { email, posts: { create: [{ slug: 'a', title: 'A' }, { slug: 'b', title: 'B' }] } },
});`, { sm: true }) + tp(gon(OUT('long')), { wrap: 130, fs: 13 }) +
      box('No $transaction needed', 'Prisma wrapped the user and both posts in one BEGIN … COMMIT, and inserted the two posts in a single statement. A nested write, an <code>updateMany</code>, an atomic <code>increment</code> — each is already atomic.', 'xanh') },
  /* 8 */ { t: 'Choosing, in one table', body: tbl(['You need', 'Use'], [
      ['one create/update, nested writes, an increment, a guarded updateMany', 'nothing — a single call is atomic'],
      ['several independent writes that must all succeed', c('$transaction([...])')],
      ['a read, a decision in JavaScript, then writes', c('$transaction(async (tx) => …)')],
      ['FOR UPDATE, advisory locks', c('tx.$queryRaw') + ' inside the callback (Lesson 7.3)'],
    ]) },
  /* 9 */ { t: 'An HTTP call inside the transaction', body: two(ts(`// inside the transaction
await prisma.$transaction(async (tx) => {
  const o = await tx.order.create(
    { data: { status: 'MOI' } });
  const kq = await congThanhToan(); // 2 s
  return tx.order.update({ where: { id: o.id },
    data: { txCode: kq.id } });
});`, { sm: true }), ts(`// the fix: between two short writes
const o = await prisma.order.create(
  { data: { status: 'CHO_THANH_TOAN' } });
const kq = await congThanhToan(); // no tx
await prisma.order.update({ where: { id: o.id },
  data: { txCode: kq.id,
          status: 'DA_THANH_TOAN' } });`, { sm: true }), '') +
      tp(gon(OUT('can-pool')), { wrap: 130, fs: 14 }) +
      box('Half the orders failed — with P2028, not P2024', 'Ten transactions took all ten connections for two seconds; the other ten waited for <code>maxWait</code> (2 s by default) and were refused: "Unable to start a transaction in the given time". Outside the transaction, all twenty succeeded in the same two seconds.', 'do2') },
  /* 10 */ { t: 'Three ways to exhaust the pool', body: cards([
      ['1 · An HTTP call inside', 'Measured above: half the requests refused while the gateway thinks.'],
      ['2 · A loop inside', 'A thousand <code>tx.post.update</code> calls hold one connection for a thousand round trips. Use <code>updateMany</code> or batches.'],
      ['3 · Promise.all of transactions', 'Fifty interactive transactions on a pool of ten: forty queue, and those past <code>maxWait</code> fail. Chunk to the pool size.'],
      ['The rule', 'Database work only. No HTTP, no file I/O, no <code>await</code> on anything that is not a query.'],
    ], 2) },
  /* 11 */ { t: 'Order the steps so failure is recoverable', body: steps([
      `Create the order as ${c('CHO_THANH_TOAN')} — committed, visible`,
      `Call the payment gateway — no connection held`,
      `Mark it ${c('DA_THANH_TOAN')} with the transaction code`,
      `A scheduled job reconciles orders stuck in ${c('CHO_THANH_TOAN')}`,
    ]) + cards([
        ['Dies after step 1', 'An order sits in CHO_THANH_TOAN — visible, and the reconcile job can ask the gateway.'],
        ['Dies after step 2', 'Charged but not marked — the same job finds it by the pending status.'],
      ], 2) + box('Never charge first and record second', 'If the process dies between the two, money was taken and nothing says so.', 'do2') },
  /* 12 */ { t: 'Your turn — and what to keep', body: two(steps([
      `Log an array ${c('$transaction')}; find BEGIN and COMMIT`,
      `Throw inside a callback; check the balance did not move`,
      `Call ${c('prisma')} inside a callback with ${c('connection_limit=1')}`,
      `Put a 2-second wait inside a transaction; fire 20 at a pool of 10`,
    ]), box('Keep these', `<ul><li>Array = all-or-nothing, nothing more</li><li>Inside the callback: ${c('tx')}, never ${c('prisma')}</li><li>Nested writes need no ${c('$transaction')}</li><li>No HTTP inside a transaction</li></ul>`, 'lam'), '') },
]);
