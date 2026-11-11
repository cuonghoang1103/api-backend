/**
 * pr-04-5 — Prisma ORM · Chapter 4 · Lesson 4.5 "Deleting, and soft delete done properly" (deck video, 12/11/2026). Bài web: pr-4-5-xoa-mem.
 * Output THẬT (`chay.sh p4-5`, demo/lab/p4/45, CSDL c45, Prisma 6.19.3 · PostgreSQL 16.14): delete thiếu hàng ⇒ P2025 · deleteMany ⇒ {count:11} ·
 * bộ lọc từ request rỗng ⇒ {} ⇒ DELETE … WHERE 1=1 xoá 200/200 (chạy trong giao dịch rồi ROLLBACK) · xoá 1 user ⇒ dây chuyền 200 bài + 4.000 bình luận +
 * 40.000 reaction, 44 ms · extension xoá mềm: findMany thêm deleted_at IS NULL, include KHÔNG lọc, $queryRaw KHÔNG lọc · extension đúng nguyên văn bài web
 * ⇒ PrismaClientValidationError "Unknown argument `data`" (không xoá, không xoá mềm) · email đã xoá mềm ⇒ P2002; partial unique index ⇒ đăng ký lại được,
 * bản sống thứ hai ⇒ P2002 · xoá thật theo lô 1000/1000/412.
 */
/* Output chạy THẬT, đóng băng từ thư mục demo của khoá video Prisma (12/11/2026) — deck tự chứa, không đọc tệp ngoài repo. */
const DU_LIEU = {
 "demo/out/p4-5/xoa.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c45 npx tsx p4/45/xoa.mts\n[delete] DELETE FROM \"posts\" WHERE (\"id\" = $1 AND 1=1) RETURNING …\n[delete missing] DELETE FROM \"posts\" WHERE (\"id\" = $1 AND 1=1) RETURNING …\n[delete missing] P2025 {\"modelName\":\"Post\",\"cause\":\"No record was found for a delete.\"}\n[deleteMany] DELETE FROM \"posts\" WHERE (\"author_id\" = $1 AND \"published\" = $2)\ndeleteMany → {\"count\":11}\nfilter from empty request → {}\n[deleteMany(undefined filter) — inside a rolled-back transaction] BEGIN\n[deleteMany(undefined filter) — inside a rolled-back transaction] DELETE FROM \"posts\" WHERE 1=1\n   would delete 200 of 200 rows\n[deleteMany(undefined filter) — inside a rolled-back transaction] ROLLBACK\nrows after rollback: 200\n",
 "demo/lab/p4/45/day.sql": "SELECT\n  (SELECT count(*) FROM posts     WHERE author_id = 1) AS posts,\n  (SELECT count(*) FROM comments  WHERE post_id IN (SELECT id FROM posts WHERE author_id = 1)) AS comments,\n  (SELECT count(*) FROM reactions WHERE comment_id IN\n     (SELECT id FROM comments WHERE post_id IN (SELECT id FROM posts WHERE author_id = 1))) AS reactions;\n\\timing on\nBEGIN;\nDELETE FROM users WHERE id = 1;\nSELECT count(*) AS posts_left FROM posts WHERE author_id = 1;\nROLLBACK;\n",
 "demo/out/p4-5/day.txt": "$ docker exec -i prisma-pg psql -U student -d c45 < p4/45/day.sql\n posts | comments | reactions \n-------+----------+-----------\n   200 |     4000 |     40000\n(1 row)\n\nTiming is on.\nBEGIN\nTime: 0.174 ms\nDELETE 1\nTime: 42.850 ms\n posts_left \n------------\n          0\n(1 row)\n\nTime: 0.261 ms\nROLLBACK\nTime: 0.184 ms\n",
 "demo/lab/p4/45/mem.mts": "import { PrismaClient } from './gen/index.js';\nconst base = new PrismaClient({ log: [{ emit: 'event', level: 'query' }] });\nlet nhan = '';\nbase.$on('query', (e) => { if (nhan) console.log(`[${nhan}]`, e.query.replace(/\"public\"\\./g, '').replace(/\"(users|posts)\"\\.\"(\\w+)\"/g, '\"$2\"').replace(/SELECT (\"\\w+\", ){3,}(\"\\w+\")/, 'SELECT …').replace(/RETURNING .*/, 'RETURNING …')); });\nconst prisma = base.$extends({\n  name: 'xoaMem',\n  query: {\n    post: {\n      async $allOperations({ operation, args, query }) {\n        const a = args as any;\n        if (['findFirst', 'findMany', 'findUnique', 'count', 'aggregate'].includes(operation))\n          a.where = { ...a.where, deletedAt: null };                     // every read\n        if (operation === 'delete')                                       // delete ⇒ update\n          return base.post.update({ where: a.where, data: { deletedAt: new Date() } });\n        return query(args);\n      },\n    },\n  },\n});\nnhan = 'soft delete'; await prisma.post.delete({ where: { id: 1 } });\nnhan = 'findMany'; const a = await prisma.post.findMany({ where: { authorId: 1 }, select: { id: true } });\nnhan = 'include (gap)'; const u = await prisma.user.findUniqueOrThrow({ where: { id: 1 }, select: { posts: { select: { id: true } } } });\nnhan = '';\nconsole.log(`extended findMany: ${a.length} posts (post 1 hidden: ${!a.some((p) => p.id === 1)}) · user.posts via include: ${u.posts.length} (post 1 present: ${u.posts.some((p) => p.id === 1)})`);\nconst raw = await base.$queryRaw<{ n: bigint }[]>`SELECT count(*) AS n FROM posts WHERE author_id = 1`;\nconsole.log('$queryRaw count:', Number(raw[0]!.n), '(includes the soft-deleted row)');\nawait base.$disconnect();\n",
 "demo/out/p4-5/mem.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c45 npx tsx p4/45/mem.mts\n[soft delete] UPDATE \"posts\" SET \"deleted_at\" = $1 WHERE (\"id\" = $2 AND 1=1) RETURNING …\n[findMany] SELECT \"id\" FROM \"posts\" WHERE (\"author_id\" = $1 AND \"deleted_at\" IS NULL) OFFSET $2\n[include (gap)] SELECT \"id\" FROM \"users\" WHERE (\"id\" = $1 AND 1=1) LIMIT $2 OFFSET $3\n[include (gap)] SELECT \"id\", \"author_id\" FROM \"posts\" WHERE \"author_id\" IN ($1) OFFSET $2\nextended findMany: 199 posts (post 1 hidden: true) · user.posts via include: 200 (post 1 present: true)\n$queryRaw count: 200 (includes the soft-deleted row)\n",
 "demo/out/p4-5/mem-web.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c45 npx tsx p4/45/mem-web.mts\n[web extension: delete] PrismaClientValidationError:      }) Unknown argument `data`. Available options are marked with ?.\npost 2 afterwards: {\"id\":2,\"deletedAt\":null}\n",
 "demo/out/p4-5/trung.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c45 npx tsx p4/45/trung.mts\nsign up again → P2002 [\"email\"]\nafter partial unique index → new account id 5 · rows with that email: 2\na second LIVE binh → P2002\n",
 "demo/lab/p4/45/lo.mts": "import { PrismaClient } from './gen/index.js';\nconst base = new PrismaClient();\nawait base.$executeRawUnsafe(`INSERT INTO users (email) VALUES ('lo@x.com')`);\nconst uid = (await base.user.findUniqueOrThrow({ where: { email: 'lo@x.com' } })).id;\nawait base.$executeRawUnsafe(`INSERT INTO posts (title, author_id, deleted_at) SELECT 'cu ' || g, ${uid}, now() - interval '40 days' FROM generate_series(1, 2412) g`);\nconst cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);\nfor (;;) {\n  const batch = await base.post.findMany({ where: { deletedAt: { lt: cutoff } }, select: { id: true }, take: 1000 });\n  if (batch.length === 0) break;\n  const r = await base.post.deleteMany({ where: { id: { in: batch.map((b) => b.id) } } });\n  console.log('deleted for real:', r.count);\n}\nawait base.$disconnect();\n",
 "demo/out/p4-5/lo.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c45 npx tsx p4/45/lo.mts\ndeleted for real: 1000\ndeleted for real: 1000\ndeleted for real: 412\n"
};
const fs = { readFileSync: (p) => { const k = String(p); if (!(k in DU_LIEU)) throw new Error('thiếu dữ liệu đóng băng: ' + k); return DU_LIEU[k]; } };
import { lamDeck, prs, ts, tp, sql, two, box, cards, c, tbl, steps } from './_pr-chung.mjs';

export const deck = { key: 'pr-04-5', code: 'PR 4.5', title: 'Deleting, and soft delete done properly', sub: 'Chapter 4 · Lesson 4.5' };

const DEMO = 'demo';
const OUT = (t) => fs.readFileSync(`${DEMO}/out/p4-5/${t}.txt`, 'utf8').replace(/\n+$/, '');
const SRC = (t) => fs.readFileSync(`${DEMO}/lab/p4/45/${t}`, 'utf8').replace(/\n+$/, '');
const gon = (s) => s.replace(/^\$ DATABASE_URL=\S+ /gm, '$ ').replace(/^\$ docker exec -i prisma-pg psql -U student -d c45 /gm, '$ psql ').split('\n').filter((l) => !/^\s*$/.test(l)).join('\n');
const lay = (t, ...nhan) => OUT(t).split('\n').filter((l) => nhan.some((n) => l.startsWith(`[${n}]`) || l.startsWith(n))).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 4 — Reading and writing', bai: '4.5' }, [
  /* 1 */ { cover: true, nhan: 'Chapter 4 · Lesson 4.5', t: 'Deleting, and<br>soft delete done properly', sub: 'The only operation with no undo' },
  /* 2 */ { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li><code>delete</code> and <code>deleteMany</code> — and the filter that came back empty</li>
    <li>What one cascading delete really removes</li>
    <li>Soft delete as a client extension — and the three places it does not reach</li>
    <li>The unique-constraint trap, fixed with a partial index</li>
    <li>Real deletion, on purpose, in batches</li></ul>` },
  /* 3 */ { t: 'The two methods', body: ts(`await prisma.post.delete({ where: { id: 211 } });                                 // one row, by unique field
await prisma.post.deleteMany({ where: { authorId: 3, published: false } });       // any filter → { count }
await prisma.post.deleteMany({});                                                  // empty filter → EVERY row`, { sm: true }) +
    tp(lay('xoa', 'delete', 'delete missing', 'deleteMany').replace(/^\[delete missing\] DELETE.*\n/m, ''), { wrap: 90, fs: 20, title: 'query log' }) +
    cards([
      ['delete', 'Returns the row it removed. Missing ⇒ <code>P2025</code>.'],
      ['deleteMany', 'Returns <code>{ count }</code>. Zero matches is not an error.'],
      ['deleteMany({})', 'Every row in the table. No confirmation, no undo.'],
    ], 3) },
  /* 4 */ { t: 'Trap: the filter that came back empty', body: ts(`// GET /posts/delete-drafts?author=&status=   — both parameters missing
const where = {
  authorId:  query.author ? Number(query.author) : undefined,
  published: query.status ? query.status === 'pub' : undefined,
};
await prisma.post.deleteMany({ where });`, { sm: true }) +
    tp(lay('xoa', 'filter from empty', 'deleteMany(undefined', '   would delete', 'rows after'), { wrap: 120, fs: 14, title: 'run inside a transaction that we then rolled back' }) +
    box('undefined fields vanish — and so does the filter', 'Every value was <code>undefined</code>, so the filter became <code>{}</code> and the SQL became <code>WHERE 1=1</code>: all 200 rows. Build the filter, check that it is non-empty, and refuse if it is not.', 'do2') },
  /* 5 */ { t: 'What a cascade actually removes', body: sql(SRC('day.sql').split('\n').slice(0, 5).join('\n'), { sm: true }) +
    two(tp(gon(OUT('day')).replace(/^\$ .*$/m, '$ psql < day.sql').split('\n').filter((l) => !/^\(1 row\)|^Timing|^Time: 0/.test(l)).join('\n'), { wrap: 50, fs: 14 }),
      box('One row in, 44,201 out', 'Deleting one user took 200 posts, 4,000 comments and 40,000 reactions with it — in one transaction holding locks on four tables. Afterwards only a backup brings it back. "Delete my account" usually means "hide my data"; an erasure request means exactly this. You need both.', 'do2'), 'r46') },
  /* 6 */ { t: 'Soft delete: the column and the discipline', body: two(prs(`model Post {
  id        Int       @id @default(autoincrement())
  title     String
  authorId  Int       @map("author_id")
  deletedAt DateTime? @map("deleted_at") @db.Timestamptz(3)
  // …
}`, { sm: true, hl: [5] }), sql(`-- Prisma cannot declare a partial index:
-- add it by hand in the migration
CREATE INDEX "posts_author_active_idx"
  ON "posts"("author_id")
  WHERE "deleted_at" IS NULL;`, { sm: true }), 'r64') +
    ts(`await prisma.post.update({ where: { id: 1 }, data: { deletedAt: new Date() } });   // deleting is an update
await prisma.post.findMany({ where: { authorId: 1, deletedAt: null } });          // and every read must remember`, { sm: true }) +
    cards([
      ['Delete = update', 'Set <code>deletedAt</code>; the row stays and can be restored.'],
      ['Partial index', 'Holds only live rows, so "not deleted" stays cheap.'],
      ['Every read filters', '<code>deletedAt: null</code> on every query — by hand, for now.'],
    ], 3) +
    box('"Every read must remember" is not a plan', 'It works for a week. Then a new endpoint forgets the filter and deleted posts show up in search — or in an export sent to a customer.', 'do2') },
  /* 7 */ { t: 'A client extension: the filter nobody can forget', body: ts(SRC('mem.mts').split('\n').slice(4, 19).join('\n'), { sm: true }) +
      tp(lay('mem', 'soft delete', 'findMany'), { wrap: 120, fs: 14 }) +
    box('', 'One place: a new endpoint still gets <code>deleted_at IS NULL</code>. Keep the plain <code>base</code> client for the admin path.', 'xanh') },
  /* 8 */ { t: 'Where the extension does not reach', body: tp(lay('mem', 'include (gap)', 'extended findMany', '$queryRaw'), { wrap: 96, fs: 18 }) +
    cards([
      ['Relations', 'An extension on <code>post</code> does not filter <code>user.posts</code> inside an include: the deleted post came back.'],
      ['Raw SQL', '<code>$queryRaw</code> goes straight to the database. Every hand-written query needs its own <code>deleted_at IS NULL</code>.'],
      ['Verify, do not assume', 'Read the query log for each path. Chapter 10 says this again for raw queries.'],
    ], 3) },
  /* 9 */ { t: 'Check the extension you copy', body: ts(`// as often written: forward the delete with a data field
if (operation === 'delete') return (query as any)({ ...args, data: { deletedAt: new Date() } });`, { sm: true }) +
    tp(gon(OUT('mem-web')).replace(/^\$ .*$/m, '$ npx tsx mem-web.mts'), { wrap: 90, fs: 18 }) +
    box('query() runs the original operation', '<code>query(args)</code> can change the arguments, not the operation: a <code>delete</code> with a <code>data</code> field is rejected — nothing deleted, nothing soft-deleted. To turn a delete into an update, call the base client\'s <code>update</code>, as on slide 7.', 'do2') },
  /* 10 */ { t: 'The trap: unique constraints and soft delete', body: ts(`await prisma.user.update({ where: { email: 'binh@x.com' }, data: { deletedAt: new Date() } });
await prisma.user.create({ data: { email: 'binh@x.com' } });                     // sign up again`, { sm: true }) +
    two(sql(`DROP INDEX "users_email_key";
CREATE UNIQUE INDEX "users_email_active_key"
  ON "users"("email") WHERE "deleted_at" IS NULL;`, { sm: true }), tp(gon(OUT('trung')).replace(/^\$ .*$/m, '$ npx tsx trung.mts'), { wrap: 52, fs: 13 }), '') +
    box('The soft-deleted row still owns the email', 'A partial unique index applies only to live rows: the old row stays, the new account gets in, and a second <em>live</em> account is still refused. Other options — <code>@@unique([email, deletedAt])</code>, or renaming the email on delete — are weaker.', 'lam') },
  /* 11 */ { t: 'Real deletion, on purpose', body: ts(SRC('lo.mts').split('\n').slice(5, 12).join('\n'), { sm: true }) +
    tp(gon(OUT('lo')).replace(/^\$ .*$/m, '$ npx tsx lo.mts'), { wrap: 120, fs: 16 }) +
    box('Batching is the part that matters', 'One <code>deleteMany</code> over hundreds of thousands of rows is one huge transaction: locks, write-ahead log, a blocked autovacuum. A thousand at a time keeps the database usable throughout.', 'xanh') },
  /* 12 */ { t: 'Your turn — and what to keep', body: two(steps([
      `Build a filter from an empty request; ${c('deleteMany')} it inside a rolled-back transaction`,
      `Count a cascade before you run it`,
      `Add the soft-delete extension; check include and ${c('$queryRaw')}`,
      `Soft-delete a user, sign up again; add the partial unique index`,
    ]), box('Keep these', `<ul><li>Empty filter ⇒ every row</li><li>Count the cascade first</li><li>Extension: not relations, not raw SQL</li><li>Soft delete ⇒ partial unique index</li></ul>`, 'lam'), '') },
]);
