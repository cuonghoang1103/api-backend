/**
 * pr-08-4 — Prisma ORM · Chapter 8 · Lesson 8.4 "Client extensions: four kinds" (deck video, 12/11/2026). Bài web: pr-8-4-extension.
 * Output THẬT (`chay.sh p8-4`, CSDL c84, Prisma 6.19.3 · PostgreSQL 16.14): result + needs ⇒ select chỉ xin id, tenHienThi mà SQL lấy "id","full_name","username" ·
 * trường tính toán có cả trong include · where theo trường tính toán ⇒ TS2353 · quên gọi query(args) ⇒ undefined, KHÔNG có câu SQL nào chạy · $allOperations mức trên
 * đếm 3 lần cho user.count + $queryRaw + $executeRaw (raw CÓ đi qua) · lọc tenant bằng $allModels: findMany đúng tenant 1, include lọt 15 bài tenant 2, $queryRaw đếm 30 ·
 * chồng A rồi B: A (thêm trước) vào trước, ra sau — extension thêm TRƯỚC là lớp NGOÀI · $use không còn trên client 6.19.3 (undefined).
 */
/* Output chạy THẬT, đóng băng từ thư mục demo của khoá video Prisma (12/11/2026) — deck tự chứa, không đọc tệp ngoài repo. */
const DU_LIEU = {
 "demo/out/p8-4/ext.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c84 npx tsx p8/84/ext.mts\n== result: select chi xin id va tenHienThi\nprisma:query SELECT \"id\", \"full_name\", \"username\" FROM \"users\" WHERE (\"id\" = $1 AND 1=1) LIMIT $2 OFFSET $3\n{ id: 3, tenHienThi: 'user3' }\n== query: quen goi query(args) → undefined\nprisma:query SELECT COUNT(*) AS \"_count$_all\" FROM (SELECT \"id\" FROM \"users\" WHERE 1=1 OFFSET $1) AS \"sub\"\nprisma:query SELECT 1\nprisma:query SELECT 1\n== query: $allOperations dem duoc 3 lan cho: user.count + $queryRaw + $executeRaw\nprisma:query SELECT COUNT(*) AS \"_count$_all\" FROM (SELECT \"id\" FROM \"users\" WHERE 1=1 OFFSET $1) AS \"sub\"\n== chong A roi B: A (them truoc) vao → B (them sau) vao → B (them sau) ra → A (them truoc) ra\n",
 "demo/out/p8-4/them.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c84 npx tsx p8/84/them.mts\ntrong include: author.tenHienThi = \"Nguoi dung 2\"\n$use con ton tai tren client 6.19.3? undefined\n",
 "demo/out/p8-4/ten-loc.txt": "$ npx tsc --noEmit --target es2022 --module nodenext --moduleResolution nodenext --strict --skipLibCheck p8/84/ten-loc.ts\np8/84/ten-loc.ts(4,39): error TS2353: Object literal may only specify known properties, and 'tenHienThi' does not exist in type 'UserWhereInput | { AND?: Exact<UserWhereInput | UserWhereInput[] | undefined, UserWhereInput | UserWhereInput[] | undefined>; ... 14 more ...; orders?: Exact<...>; }'.\n[exit 2]\n",
 "demo/out/p8-4/mc.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c84 npx tsx p8/84/mc.mts\npublishPost lan 1: { count: 1 } · lan 2: { count: 0 }\nhealthy(): true\n",
 "demo/out/p8-4/tenant.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c84 npx tsx p8/84/tenant.mts\nfindMany posts: tenant cua cac bai = [ 1 ]\nfindMany users + include posts: 5 user tenant 1, nhung 15 bai cua tenant 2 lot vao qua include\n$queryRaw dem posts: 30 (ca hai tenant)\n"
};
const fs = { readFileSync: (p) => { const k = String(p); if (!(k in DU_LIEU)) throw new Error('thiếu dữ liệu đóng băng: ' + k); return DU_LIEU[k]; } };
import { lamDeck, tp, ts, two, box, cards, c, tbl, steps } from './_pr-chung.mjs';

export const deck = { key: 'pr-08-4', code: 'PR 8.4', title: 'Client extensions: four kinds', sub: 'Chapter 8 · Lesson 8.4' };

const DEMO = 'demo';
const OUT = (t, ch = 'p8-4') => fs.readFileSync(`${DEMO}/out/${ch}/${t}.txt`, 'utf8').replace(/\n+$/, '');
const TSC = 'npx tsc --noEmit --target es2022 --module nodenext --moduleResolution nodenext --strict --skipLibCheck';
const gon = (s) => s.replace(/^\$ DATABASE_URL=\S+ /gm, '$ ').split(TSC).join('npx tsc --noEmit --strict …').replace(/p8\/8\d\//g, '').split('\n').filter((l) => !/^\s*$/.test(l)).join('\n');
const khuc = (t, tu, den) => { const L = gon(OUT(t)).split('\n'); const a = L.findIndex((l) => l.startsWith(tu)); const b = den ? L.findIndex((l, i) => i > a && l.startsWith(den)) : L.length; return L.slice(a, b < 0 ? L.length : b).join('\n'); };

export const slides = lamDeck({ chuong: 'Chapter 8 — The generated type system', bai: '8.4' }, [
  /* 1 */ { cover: true, nhan: 'Chapter 8 · Lesson 8.4', t: 'Client extensions: four kinds', sub: 'result · model · query · client — run, logged, and stacked' },
  /* 2 */ { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li><code>result</code>: computed fields, and what <code>needs</code> does to the SQL</li>
    <li><code>model</code> and <code>client</code>: methods, typed</li>
    <li><code>query</code>: intercepting — and forgetting <code>query(args)</code></li>
    <li>A tenant filter, and the two places it leaks</li>
    <li>Stacking: which extension runs first</li></ul>` },
  /* 3 */ { t: '1 · result — a computed field', body: two(ts(`const prisma = base.$extends({
  result: { user: { tenHienThi: {
    needs: { fullName: true, username: true },
    compute(u) { return u.fullName ?? u.username; },
  } } },
});
const u = await prisma.user.findUniqueOrThrow({
  where: { id: 3 },
  select: { id: true, tenHienThi: true },
});
const bai = await prisma.post.findFirstOrThrow({
  where: { id: 1 }, include: { author: true } });`, { sm: true }),
      tp(khuc('ext', '== result', '== query') + '\n' + gon(OUT('them')).split('\n').slice(1, 2).join('\n'), { wrap: 58, fs: 12 }), '') +
      cards([
        ['needs rewrites the SELECT', 'We asked for id and tenHienThi; the SQL fetched full_name and username for compute().'],
        ['Typed everywhere', 'tenHienThi is a string on every query — inside an include too.'],
        ['Computed in JavaScript', 'After the rows return, so the database cannot filter or sort by it.'],
      ], 3) },
  /* 4 */ { t: 'A computed field is not a column', body: ts(`const prisma = new PrismaClient().$extends({ result: { user: { tenHienThi: { … } } } });
const a: string = (await prisma.user.findFirstOrThrow()).tenHienThi;   // typed: string
await prisma.user.findMany({ where: { tenHienThi: 'An' } });            // filter on it`, { sm: true }) + tp(gon(OUT('ten-loc')), { wrap: 110, fs: 13 }) +
      cards([
        ['Typed like a column', 'The result type has tenHienThi: string on every query.'],
        ['Absent from every input type', 'Not in WhereInput, OrderByInput or select of other models: SQL never sees it.'],
      ], 2) +
      box('Need to filter on it? It belongs in the database', 'A generated column or a view. Use result for presentation — a display name, a URL, a formatted price — not for logic other systems also read.', 'lam') },
  /* 5 */ { t: '2 · model and 4 · client — methods, typed', body: two(ts(`const prisma = base.$extends({
  model: {
    post: {
      async publishPost(id: number) {
        return base.post.updateMany({
          where: { id, published: false },
          data: { published: true,
                  publishedAt: new Date() },
        });
      },
    },
  },
});
await prisma.post.publishPost(id);   // run twice`, { sm: true }), ts(`const prisma = base.$extends({
  client: {
    async healthy() {
      const ctx = Prisma.getExtensionContext(this);
      try { await ctx.$queryRaw\`SELECT 1\`; }
      catch { return false; }
      return true;
    },
  },
});
app.get('/health', async (_, res) =>
  res.sendStatus(await prisma.healthy() ? 200 : 503));`, { sm: true }), '') +
      tp(gon(OUT('mc')), { wrap: 140, fs: 13 }) +
      box('A repository without the layer — data operations only', 'Typed methods on the model; the where precondition made the second publish a no-op.', 'lam') },
  /* 6 */ { t: '3 · query — intercepting every call', body: two(ts(`// forgot to return query(args)
const quen = base.$extends({ query: { user: {
  async findMany({ args, query }) { /* … */ },
} } });
await quen.user.findMany();

// top-level $allOperations: count every call
let dem = 0;
const demQ = base.$extends({ query: {
  $allOperations({ args, query }) {
    dem++; return query(args);
  },
} });
await demQ.user.count();
await demQ.$queryRaw\`SELECT 1\`;
await demQ.$executeRaw\`SELECT 1\`;`, { sm: true }), tp(khuc('ext', '== query: quen', '== chong'), { wrap: 58, fs: 12 }), '') +
      box('No query(args), no SQL — and no error', 'The forgotten call resolved to undefined and nothing reached the database. And in 6.19.3 a top-level $allOperations does see $queryRaw and $executeRaw — it just cannot rewrite their SQL.', 'do2') },
  /* 7 */ { t: 'A tenant filter — and where it leaks', body: ts(`function tenantClient(tenantId: number) {
  return base.$extends({ query: { $allModels: { async $allOperations({ operation, args, query }) {
    if (['findFirst', 'findMany', 'findUnique', 'count', 'aggregate'].includes(operation))
      args.where = { ...args.where, tenantId };
    return query(args);
  } } } });
}
const db = tenantClient(1);
await db.post.findMany();
await db.user.findMany({ include: { posts: true } });
await db.$queryRaw\`SELECT count(*)::int AS n FROM posts\`;`, { sm: true }) + tp(gon(OUT('tenant')), { wrap: 150, fs: 13 }) +
      box('A safety net, not a security boundary', 'The top-level query was scoped. The include on another model and the raw query were not: 15 rows of tenant 2 leaked. Real isolation is the database&#39;s job — row-level security.', 'do2') },
  /* 8 */ { t: 'Stacking: the first extension added is the outermost', body: two(ts(`const ext = (ten: string) => Prisma.defineExtension({
  query: { $allOperations: async ({ args, query }) => {
    thuTu.push(ten + ' vao');
    const r = await query(args);
    thuTu.push(ten + ' ra');
    return r;
  } },
});
const chong = base
  .$extends(ext('A (them truoc)'))
  .$extends(ext('B (them sau)'));
await chong.user.count();`, { sm: true }), tp(khuc('ext', '== chong').replace(/: /, ':\n').replace(/ → /g, '\n→ '), { wrap: 58, fs: 14 }), '') +
      box('A sees the arguments first and the result last', 'When two extensions both change args.where, the one added first gets the last word on the way back, and the one added later is closer to the database. Measure your own stack; do not guess.', 'lam') },
  /* 9 */ { t: 'What extensions cannot do — and what changed', body: tbl(['Fact', 'Measured here'], [
      ['A computed field cannot be filtered', 'TS2353 on ' + c('where: { tenHienThi }')],
      ['Raw SQL is not rewritten', c('$queryRaw') + ' counted both tenants (30 rows)'],
      ['An extended client is a new type', 'not assignable to ' + c('Prisma.TransactionClient') + ' (Lesson 8.1)'],
      [c('$use') + ' middleware is gone', c('typeof prisma.$use') + ' is ' + c("'undefined'") + ' on 6.19.3'],
    ]) + box('Export one extended client, import it everywhere', 'Each $extends returns a wider type. Stack them once, in one file, in a deliberate order.', 'xanh') },
  /* 10 */ { t: 'Your turn — and what to keep', body: two(steps([
      `Add a computed field; log the SQL with a ${c('select')}`,
      `Delete ${c('return query(args)')} and call the method`,
      `Build the tenant client; try an ${c('include')} and ${c('$queryRaw')}`,
      `Stack two logging extensions; print the order`,
    ]), box('Keep these', `<ul><li>needs adds columns to the SELECT</li><li>Always return query(args)</li><li>Tenant filters leak through include and raw SQL</li><li>First added = outermost</li></ul>`, 'lam'), '') },
]);
