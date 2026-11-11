/**
 * pr-04-3 — Prisma ORM · Chapter 4 · Lesson 4.3 "Creating rows" (deck video, 12/11/2026). Bài web: pr-4-3-tao-hang.
 * Output THẬT (`chay.sh p4-3`, demo/lab/p4/43, CSDL c43, Prisma 6.19.3 · PostgreSQL 16.14): create lồng = BEGIN + 4 bảng + COMMIT, hai bài gộp một INSERT,
 * connect role = SELECT rồi INSERT · connectOrCreate = SELECT/INSERT TỪNG tag (web nói gộp IN) · 10 connectOrCreate song song một tag mới ⇒ 1 ok, 9 P2002 ·
 * createMany 10.000: 315 ms so với vòng lặp create 14,7 s · đồ thị 1.000×3: 91 ms so với 5,4 s · createMany không skipDuplicates ⇒ P2002, 0 hàng vào ·
 * mặc định: Prisma GỬI published/views/created_at trong INSERT (web nói CSDL tự điền).
 */
/* Output chạy THẬT, đóng băng từ thư mục demo của khoá video Prisma (12/11/2026) — deck tự chứa, không đọc tệp ngoài repo. */
const DU_LIEU = {
 "demo/out/p4-3/tao.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c43 npx tsx p4/43/tao.mts\n[nested create] BEGIN\n[nested create] INSERT INTO \"users\" (\"email\",\"full_name\") VALUES ($1,$2) RETURNING \"id\"\n[nested create] INSERT INTO \"profiles\" (\"bio\",\"user_id\") VALUES ($1,$2) RETURNING \"id\"\n[nested create] INSERT INTO \"posts\" (\"title\",\"published\",\"views\",\"created_at\",\"updated_at\",\"author_id\") VALUES ($1,$2,$3,$4,$5,$6), ($7,$8,$9,$10,$11,$12)\n[nested create] SELECT \"id\" FROM \"roles\" WHERE (\"name\" = $1 AND 1=1) OFFSET $2\n[nested create] INSERT INTO \"_RoleToUser\" (\"B\",\"A\") VALUES ($1,$2) ON CONFLICT DO NOTHING\n[nested create] SELECT \"id\", \"email\", COALESCE(\"aggr_selection_0_Post\".\"_aggr_count_posts\", 0) AS \"_aggr_count_posts\" FROM \"users\" LEFT JOIN (SELECT \"author_id\", COUNT(*) AS \"_aggr_count_posts\" FROM \"posts\" WHERE 1=1\n[nested create] COMMIT\n{\"id\":1,\"email\":\"an@example.com\",\"_count\":{\"posts\":2}}\n[connectOrCreate] BEGIN\n[connectOrCreate] INSERT INTO \"posts\" (\"title\",\"published\",\"views\",\"created_at\",\"updated_at\") VALUES ($1,$2,$3,$4,$5) RETURNING \"id\"\n[connectOrCreate] SELECT \"id\" FROM \"tags\" WHERE (\"name\" = $1 AND 1=1) LIMIT $2 OFFSET $3\n[connectOrCreate] INSERT INTO \"_PostToTag\" (\"A\",\"B\") VALUES ($1,$2) ON CONFLICT DO NOTHING\n[connectOrCreate] SELECT \"id\" FROM \"tags\" WHERE (\"name\" = $1 AND 1=1) LIMIT $2 OFFSET $3\n[connectOrCreate] INSERT INTO \"tags\" (\"name\") VALUES ($1) RETURNING \"id\"\n[connectOrCreate] INSERT INTO \"_PostToTag\" (\"A\",\"B\") VALUES ($1,$2) ON CONFLICT DO NOTHING\n[connectOrCreate] SELECT \"id\" FROM \"tags\" WHERE (\"name\" = $1 AND 1=1) LIMIT $2 OFFSET $3\n[connectOrCreate] INSERT INTO \"tags\" (\"name\") VALUES ($1) RETURNING \"id\"\n[connectOrCreate] INSERT INTO \"_PostToTag\" (\"A\",\"B\") VALUES ($1,$2) ON CONFLICT DO NOTHING\n[connectOrCreate] SELECT \"id\", \"title\", \"slug\", \"published\", \"views\", \"created_at\", \"updated_at\", \"author_id\" FROM \"posts\" WHERE \"id\" = $1 LIMIT $2 OFFSET $3\n[connectOrCreate] COMMIT\n[createManyAndReturn] BEGIN\n[createManyAndReturn] INSERT INTO \"posts\" (\"title\",\"published\",\"views\",\"created_at\",\"updated_at\",\"author_id\") VALUES ($1,$2,$3,$4,$5,$6), ($7,$8,$9,$10,$11,$12) RETURNING \"id\", \"title\"\n[createManyAndReturn] COMMIT\n[{\"id\":4,\"title\":\"A\"},{\"id\":5,\"title\":\"B\"}]\n[createMany skipDuplicates] BEGIN\n[createMany skipDuplicates] INSERT INTO \"posts\" (\"title\",\"slug\",\"published\",\"views\",\"created_at\",\"updated_at\") VALUES ($1,$2,$3,$4,$5,$6), ($7,$8,$9,$10,$11,$12) ON CONFLICT DO NOTHING\n[createMany skipDuplicates] COMMIT\nskipDuplicates → {\"count\":1}\ncreateMany without skipDuplicates → P2002 [\"slug\"] · rows with slug z: 0\nP2002 meta.target → [\"email\"]\n[defaults] INSERT INTO \"posts\" (\"title\",\"slug\",\"published\",\"views\",\"created_at\",\"updated_at\",\"author_id\") VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING \"id\", \"title\", \"slug\", \"published\", \"views\", \"created_at\", \"updat\n2 concurrent connectOrCreate → ok, ok\n",
 "demo/out/p4-3/dua.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c43 npx tsx p4/43/dua.mts\nround 1: 10 concurrent connectOrCreate of one new tag → 1 ok, 9 failed [\"P2002\"]\nround 2: 10 concurrent connectOrCreate of one new tag → 1 ok, 9 failed [\"P2002\"]\nround 3: 10 concurrent connectOrCreate of one new tag → 1 ok, 9 failed [\"P2002\"]\nround 4: 10 concurrent connectOrCreate of one new tag → 1 ok, 9 failed [\"P2002\"]\nround 5: 10 concurrent connectOrCreate of one new tag → 1 ok, 9 failed [\"P2002\"]\n",
 "demo/out/p4-3/nhanh.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c43 npx tsx p4/43/nhanh.mts\ncreate loop ×10000: 14.7 s\ncreateMany ×10000: 315 ms · {\"count\":10000}\nnested loop 1000 users × 3 posts: 5.4 s\ntwo statements 1000 users × 3 posts: 91 ms\n"
};
const fs = { readFileSync: (p) => { const k = String(p); if (!(k in DU_LIEU)) throw new Error('thiếu dữ liệu đóng băng: ' + k); return DU_LIEU[k]; } };
import { lamDeck, prs, ts, tp, sql, two, box, cards, c, tbl, steps } from './_pr-chung.mjs';

export const deck = { key: 'pr-04-3', code: 'PR 4.3', title: 'Creating rows', sub: 'Chapter 4 · Lesson 4.3' };

const DEMO = 'demo';
const OUT = (t) => fs.readFileSync(`${DEMO}/out/p4-3/${t}.txt`, 'utf8').replace(/\n+$/, '');
const gon = (s) => s.replace(/^\$ DATABASE_URL=\S+ /gm, '$ ').split('\n').filter((l) => !/^\s*$/.test(l)).join('\n');
const lay = (t, ...nhan) => OUT(t).split('\n').filter((l) => nhan.some((n) => l.startsWith(`[${n}]`) || l.startsWith(n))).map((l) => l.replace(/^\[[^\]]+\] /, '')).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 4 — Reading and writing', bai: '4.3' }, [
  /* 1 */ { cover: true, nhan: 'Chapter 4 · Lesson 4.3', t: 'Creating rows', sub: 'create can do anything, one round trip at a time — createMany does thousands, and no relations' },
  /* 2 */ { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>A nested <code>create</code>: four tables, one transaction — the real statements</li>
    <li><code>connectOrCreate</code>, and the race it loses under concurrency</li>
    <li><code>createMany</code> against a loop, measured</li>
    <li>Importing a graph in two statements</li>
    <li><code>P2002</code>, and why you never check before you insert</li></ul>` },
  /* 3 */ { t: 'Three methods, one trade-off', body: cards([
      ['create', 'One row, any shape. Nested writes across tables in one transaction; returns the row with its ids. One round trip per call.'],
      ['createMany', 'Thousands of rows in one multi-row <code>INSERT</code>. No nesting, no connect — returns only <code>{ count }</code>. Has <code>skipDuplicates</code>.'],
      ['createManyAndReturn', 'Batched speed plus <code>RETURNING</code>: the ids come back, which is what lets you batch the children too.'],
    ], 3) + box('The rule', 'More than about twenty rows of one shape: stop looping <code>create</code>. Batch the parents, map their ids, batch the children.', 'lam') },
  /* 4 */ { t: 'create — one row, any shape', body: ts(`await prisma.user.create({
  data: {
    email: 'an@example.com', fullName: 'Nguyen Van An',
    profile: { create: { bio: 'Xin chao' } },
    posts: { create: [{ title: 'Bai 1' }, { title: 'Bai 2' }] },
    roles: { connect: [{ name: 'USER' }] },
  },
  select: { id: true, email: true,
            _count: { select: { posts: true } } },
});`, { sm: true }) + tp(lay('tao', 'nested create', '{"id":1'), { wrap: 130, fs: 12, title: 'query log — four tables, one transaction' }) },
  /* 5 */ { t: 'connectOrCreate — the tag problem', body: ts(`await prisma.post.create({ data: { title: 'Bai moi', tags: {
  connectOrCreate: ['nodejs', 'prisma', 'postgres'].map((name) => ({ where: { name }, create: { name } })),
} } });`, { sm: true }) + tp(lay('tao', 'connectOrCreate'), { wrap: 130, fs: 12, title: 'query log — "nodejs" existed, the other two did not' }) +
    box('One tag at a time', 'For each tag: <code>SELECT</code> it, <code>INSERT</code> it if missing, link it. Read, decide, write — inside one transaction, but not one statement.', 'lam') },
  /* 6 */ { t: 'Trap: connectOrCreate under concurrency', body: tp(gon(OUT('dua')), { wrap: 120, fs: 18 }) +
    box('Nine requests out of ten failed', 'All ten read "missing" before any committed, all ten tried to insert, and the unique index let exactly one through — the rest got <code>P2002</code>. Your data is safe; your requests are not. Catch <code>P2002</code> and retry once, or create the vocabulary up front. Chapter 7 has the general pattern.', 'do2') },
  /* 7 */ { t: 'createMany — thousands in one statement', body: tp(gon(OUT('nhanh')).split('\n').slice(0, 3).join('\n'), { wrap: 120, fs: 20, title: '10,000 rows — same machine, same table' }) +
    cards([
      ['No relations', 'Only scalar foreign keys. For a graph: parents first, read the ids back, then the children.'],
      ['A count, not rows', '<code>{ count: 10000 }</code> — no ids. Use <code>createManyAndReturn</code> when you need them.'],
      ['One statement, atomic', 'One bad row rolls back the whole batch — unless <code>skipDuplicates</code> turns collisions into <code>ON CONFLICT DO NOTHING</code>.'],
    ], 3) },
  /* 8 */ { t: 'skipDuplicates, and the batch that is all or nothing', body: ts(`await prisma.post.createMany({
  data: [{ title: 'X', slug: 'trung' }, { title: 'Y', slug: 'trung' }], skipDuplicates: true });
await prisma.post.createMany({
  data: [{ title: 'Z', slug: 'z' }, { title: 'Z2', slug: 'trung' }] });`, { sm: true }) +
    tp(lay('tao', 'createMany skipDuplicates', 'skipDuplicates', 'createMany without'), { wrap: 92, fs: 17 }) +
    box('Same slug twice', 'With <code>skipDuplicates</code> the second row is skipped: <code>{ count: 1 }</code>. Without it the batch fails with <code>P2002</code> on <code>slug</code> — and the other row, <code>z</code>, was not inserted either.', 'lam') },
  /* 9 */ { t: 'Importing a graph, at speed', body: ts(`const made = await prisma.user.createManyAndReturn({
  data: users.map((u) => ({ email: u.email, fullName: u.fullName })), select: { id: true, email: true } });
const byEmail = new Map(made.map((u) => [u.email, u.id]));
await prisma.post.createMany({ data: users.flatMap((u) =>
  u.posts.map((p) => ({ title: p.title, authorId: byEmail.get(u.email)! }))) });`, { sm: true }) +
    tp(gon(OUT('nhanh')).split('\n').filter((l) => /1000 users/.test(l)).join('\n'), { wrap: 120, fs: 20, title: '1,000 users × 3 posts' }) +
    box('Parents in one batch, an id map, children in one batch', 'The nested loop is a thousand transactions; this is two statements. Wrap both in <code>$transaction</code> if the import must be all-or-nothing — Chapter 7.', 'xanh') },
  /* 10 */ { t: 'When the unique constraint fires', body: ts(`try {
  await prisma.user.create({ data: { email: 'an@example.com' } });
} catch (e) {
  if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
    return res.status(409).json({ error: 'Email da duoc dung', field: e.meta?.target });
  }
  throw e;
}`, { sm: true }) + tp(lay('tao', 'P2002 meta.target'), { wrap: 120, fs: 18 }) +
    cards([
      ['P2002', 'Unique violation — <code>meta.target</code> names the field to highlight.'],
      ['P2003', 'Foreign key — a parent that does not exist. Usually a bug: 400, not 500.'],
      ['Never check-then-insert', '<code>findUnique</code> then <code>create</code> is two queries and still races. Insert, catch P2002.'],
    ], 3) },
  /* 11 */ { t: 'Defaults the caller cannot forget', body: two(prs(`model Post {
  id        Int      @id @default(autoincrement())
  title     String
  slug      String?  @unique
  published Boolean  @default(false)
  views     Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  // … authorId, author, tags
}`, { sm: true, hl: [5, 6, 7] }), tp(lay('tao', 'defaults').replace(/RETURNING .*$/, 'RETURNING …') + '\n-- call: create({ data: { title, slug, authorId } })', { wrap: 60, fs: 13, title: 'what Prisma actually sends' }), '') +
    box('Prisma fills them in and sends them', 'The <code>INSERT</code> carries <code>published</code>, <code>views</code>, <code>created_at</code> and <code>updated_at</code> — values Prisma computed, not database defaults. Either way the caller cannot get them wrong; but a row inserted from psql only gets the defaults that live in the database (Lesson 2.2).', 'lam') },
  /* 12 */ { t: 'Your turn — and what to keep', body: two(steps([
      `Write a nested ${c('create')}; count the statements in the log`,
      `Fire ten ${c('connectOrCreate')} at one new tag at once`,
      `Time 10,000 ${c('create')} calls against one ${c('createMany')}`,
      `Insert a duplicate email; return 409 with ${c('meta.target')}`,
    ]), box('Keep these', `<ul><li>Nested create = one transaction</li><li>${c('connectOrCreate')} races ⇒ catch P2002</li><li>&gt; 20 rows ⇒ ${c('createMany')}</li><li>Insert, then catch — never check first</li></ul>`, 'lam'), '') },
]);
