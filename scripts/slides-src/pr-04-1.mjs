/**
 * pr-04-1 — Prisma ORM · Chapter 4 · Lesson 4.1 "The six ways to read" (deck video, 12/11/2026). Bài web: pr-4-1-sau-cach-doc.
 * Output THẬT (`chay.sh p4-1`, demo/lab/p4/41, CSDL c41: 3 user + 200.000 post ~1,5 KB, Prisma 6.19.3 · PostgreSQL 16.14):
 * findUnique theo title ⇒ tsc TS2322 (không phải "may only specify known properties") · PostWhereUniqueInput = Prisma.AtLeast<{id?, slug?, authorId_slug?, …}> ·
 * findUnique { id, authorId } ⇒ một câu, người khác ⇒ null · findUniqueOrThrow ⇒ P2025 · findFirst không orderBy trả id 2, sửa hàng 2 xong trả id 4 ·
 * findMany() trần: 200.000 hàng, 3,5 s, heap +660 MB, rss +1,8 GB; take 20: 45 ms · count = SELECT COUNT(*) FROM (subquery) · _count = LEFT JOIN … GROUP BY.
 */
/* Output chạy THẬT, đóng băng từ thư mục demo của khoá video Prisma (12/11/2026) — deck tự chứa, không đọc tệp ngoài repo. */
const DU_LIEU = {
 "demo/out/p4-1/doc.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c41 npx tsx p4/41/doc.mts\n[findUnique+authorId] SELECT \"id\" FROM \"posts\" WHERE (\"id\" = $1 AND \"author_id\" = $2) LIMIT $3 OFFSET $4 \"[42,1,1,0]\"\n[findUnique+authorId other] SELECT \"id\" FROM \"posts\" WHERE (\"id\" = $1 AND \"author_id\" = $2) LIMIT $3 OFFSET $4 \"[42,3,1,0]\"\nowner 1 → {\"id\":42} · owner 3 → null\n[findUniqueOrThrow] SELECT \"settings\".\"key\", \"settings\".\"value\" FROM \"settings\" WHERE (\"settings\".\"key\" = $1 AND 1=1) LIMIT $2 OFFSET $3 \"[\\\"site_name\\\",1,0]\"\n[findUniqueOrThrow] PrismaClientKnownRequestError P2025 {\"modelName\":\"Setting\",\"cause\":\"No record was found for a query.\"}\nAn operation failed because it depends on one or more records that were required but not found. No record was found for a query.\n[findUnique missing] SELECT \"id\", \"email\", \"full_name\" FROM \"users\" WHERE (\"email\" = $1 AND 1=1) LIMIT $2 OFFSET $3 \"[\\\"nobody@example.com\\\",1,0]\"\nfindUnique missing → null\n[findFirst no orderBy] SELECT \"id\" FROM \"posts\" WHERE \"published\" = $1 LIMIT $2 OFFSET $3 \"[true,1,0]\"\nfindFirst before update: id 2 · after updating row 2: id 4\n[findFirst orderBy] SELECT \"id\" FROM \"posts\" WHERE \"published\" = $1 ORDER BY \"published_at\" DESC, \"id\" DESC LIMIT $2 OFFSET $3 \"[true,1,0]\"\nwith orderBy → {\"id\":200000}\n[count] SELECT COUNT(*) AS \"_count$_all\" FROM (SELECT \"id\" FROM \"posts\" WHERE \"published\" = $1 OFFSET $2) AS \"sub\" \"[true,0]\"\n[count per field] SELECT COUNT(\"body\") AS \"_count$body\", COUNT(\"published_at\") AS \"_count$published_at\", COUNT(*) AS \"_count$_all\" FROM (SELECT \"body\", \"published_at\" FROM \"posts\" WHERE 1=1 OFFSET $1) AS \"sub\" \"[0]\"\ncount published → 100000 · per field → {\"_all\":200000,\"body\":190000,\"publishedAt\":100000}\n[_count] SELECT \"id\", \"email\", \"full_name\", COALESCE(\"aggr_selection_0_Post\".\"_aggr_count_posts\", 0) AS \"_aggr_count_posts\" FROM \"users\" LEFT JOIN (SELECT \"author_id\", COUNT(*) AS \"_aggr_count_posts\" FROM \"posts\" WHERE \"published\" = $1 GROUP BY \"author_id\") AS \"aggr_selection_0_Post\" ON (\"id\" = \"aggr_selection_0_Post\".\"author_id\") WHERE 1=1 ORDER BY \"id\" ASC OFFSET $2 \"[true,0]\"\n[[\"an@example.com\",80000],[\"binh@example.com\",0],[\"chi@example.com\",20000]]\n[exists A count] SELECT COUNT(*) AS \"_count$_all\" FROM (SELECT \"id\" FROM \"users\" WHERE \"email\" = $1 OFFSET $2) AS \"sub\" \"[\\\"an@example.com\\\",0]\"\n[exists B findFirst] SELECT \"id\" FROM \"users\" WHERE \"email\" = $1 LIMIT $2 OFFSET $3 \"[\\\"an@example.com\\\",1,0]\"\n[exists C findUnique] SELECT \"id\" FROM \"users\" WHERE (\"email\" = $1 AND 1=1) LIMIT $2 OFFSET $3 \"[\\\"an@example.com\\\",1,0]\"\n",
 "demo/out/p4-1/sai.txt": "$ cd p4/41 && npx tsc -p tsconfig.json\nsai.ts(4,32): error TS2322: Type '{ title: string; }' is not assignable to type 'PostWhereUniqueInput'.\n  Type '{ title: string; }' is not assignable to type '{ id: number; slug: string; authorId_slug: PostAuthorIdSlugCompoundUniqueInput; } & { id?: number | undefined; slug?: string | undefined; authorId_slug?: PostAuthorIdSlugCompoundUniqueInput | undefined; ... 8 more ...; author?: (Without<...> & UserWhereInput) | ... 1 more ... | undefined; }'.\n    Type '{ title: string; }' is missing the following properties from type '{ id: number; slug: string; authorId_slug: PostAuthorIdSlugCompoundUniqueInput; }': id, slug, authorId_slug\n[exit 2]\n",
 "demo/out/p4-1/kieu.txt": "$ grep -n -A6 '^  export type PostWhereUniqueInput' p4/41/gen/index.d.ts | head -12\n4443:  export type PostWhereUniqueInput = Prisma.AtLeast<{\n4444-    id?: number\n4445-    slug?: string\n4446-    authorId_slug?: PostAuthorIdSlugCompoundUniqueInput\n4447-    AND?: PostWhereInput | PostWhereInput[]\n4448-    OR?: PostWhereInput[]\n4449-    NOT?: PostWhereInput | PostWhereInput[]\n",
 "demo/out/p4-1/tai.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c41 NODE_OPTIONS=--max-old-space-size=8192 npx tsx p4/41/tai.mts\n[findMany()] SELECT … FROM \"posts\" WHERE 1=1 OFFSET $1\nrows: 200000 · 3.5 s · heap +660 MB · rss +1841 MB\n[findMany()] SELECT … FROM \"posts\" WHERE \"posts\".\"published\" = $1 ORDER BY \"posts\".\"published_at\" DESC LIMIT $2 OFFSET $3\ntake 20: 20 rows · 45 ms\n"
};
const fs = { readFileSync: (p) => { const k = String(p); if (!(k in DU_LIEU)) throw new Error('thiếu dữ liệu đóng băng: ' + k); return DU_LIEU[k]; } };
import { lamDeck, prs, ts, tp, sql, two, box, cards, c, tbl, steps } from './_pr-chung.mjs';

export const deck = { key: 'pr-04-1', code: 'PR 4.1', title: 'The six ways to read', sub: 'Chapter 4 · Lesson 4.1' };

const DEMO = 'demo';
const OUT = (t) => fs.readFileSync(`${DEMO}/out/p4-1/${t}.txt`, 'utf8').replace(/\n+$/, '');
const gon = (s) => s.replace(/^\$ DATABASE_URL=\S+ /gm, '$ ').replace(/^\$ cd p4\/41 && /gm, '$ ').split('\n').filter((l) => !/^\s*$/.test(l)).join('\n');
const DOC = OUT('doc').split('\n');
const lay = (...nhan) => DOC.filter((l) => nhan.some((n) => l.startsWith(`[${n}]`) || l.startsWith(n))).map((l) => l.replace(/ "\[.*\]"$/, '')).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 4 — Reading and writing', bai: '4.1' }, [
  /* 1 */ { cover: true, nhan: 'Chapter 4 · Lesson 4.1', t: 'The six ways<br>to read', sub: 'How many rows can come back — and what should happen when there are none' },
  /* 2 */ { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The six read methods, along two axes: how many rows, what happens on none</li>
    <li>Why <code>findUnique</code> refuses a non-unique filter — at compile time</li>
    <li>Null or throw: <code>P2025</code> and the <code>!</code> you should never write</li>
    <li><code>findFirst</code> without <code>orderBy</code>, and <code>findMany</code> without <code>take</code> — measured</li>
    <li>Three forms of <code>count</code>, and the "does it exist" question</li></ul>` },
  /* 3 */ { t: 'The six, side by side', body: tbl(['Method', 'Returns', 'When nothing matches', 'SQL shape'], [
      [c('findUnique'), c('T | null'), 'null', 'WHERE unique … LIMIT 1'],
      [c('findUniqueOrThrow'), c('T'), 'throws P2025', 'same query'],
      [c('findFirst'), c('T | null'), 'null', 'any WHERE … LIMIT 1'],
      [c('findFirstOrThrow'), c('T'), 'throws P2025', 'same query'],
      [c('findMany'), c('T[]'), c('[]') + ' — never null', 'no LIMIT unless you pass take'],
      [c('count'), c('number'), '0', 'SELECT COUNT(*) FROM (subquery)'],
    ]) + box('Two questions before every read', '<b>How many rows can this return?</b> picks findUnique, findFirst or findMany. <b>What should happen if there are none?</b> picks the <code>OrThrow</code> suffix.', 'lam') },
  /* 4 */ { t: 'Choosing, as a decision tree', body: cards([
      ['At most one, by a unique field', '<code>findUnique</code> when absence is normal (a lookup by email). <code>findUniqueOrThrow</code> when absence is a bug (a setting the app needs).'],
      ['At most one, by any filter', '<code>findFirst</code> / <code>findFirstOrThrow</code> — <b>always with an <code>orderBy</code></b>, or "first" means whatever comes back today.'],
      ['A list', '<code>findMany</code>, always with <code>take</code>. It returns <code>[]</code>, never null, so there is no OrThrow variant to want.'],
      ['Only a number — or only yes/no', '<code>count</code> for "how many". For "is there any", select one tiny column with findUnique/findFirst: it stops at the first hit.'],
    ], 2) },
  /* 5 */ { t: 'Why findUnique refuses your filter', body: ts(`// title is not unique
await prisma.post.findUnique({ where: { title: 'Bai 1' } });`, { sm: true }) +
    tp(gon(OUT('sai')).replace(/\n\[exit 2\]$/, ''), { wrap: 120, fs: 13 }) +
    two(tp(gon(OUT('kieu')).replace(/^\$ .*$/m, '$ grep -A6 "export type PostWhereUniqueInput" gen/index.d.ts'), { wrap: 64, fs: 13 }),
      box('A compile-time guarantee', 'The where type is built from the model\'s unique constraints: <code>id</code>, <code>slug</code>, and <code>authorId_slug</code> from <code>@@unique</code>. At least one must be present, so the query can never return two rows.', 'xanh'), 'r64') },
  /* 6 */ { t: 'findUnique plus a filter: the ownership check', body: ts(`await prisma.post.findUnique({ where: { id: 42, authorId: 1 } });   // the owner
await prisma.post.findUnique({ where: { id: 42, authorId: 3 } });   // someone else`, { sm: true }) +
    tp(lay('findUnique+authorId', 'owner'), { wrap: 92, fs: 17, title: 'query log — Prisma 6.19.3' }) +
    ts(`// the old way: two steps, and the second one is the step you forget
const post = await prisma.post.findUnique({ where: { id: 42 } });
if (!post || post.authorId !== me) return res.status(404).end();`, { sm: true }) +
    box('One query instead of fetch-then-check', 'Since Prisma 5, <code>findUnique</code> accepts extra non-unique filters next to the unique one. Someone else\'s post simply comes back <code>null</code> — no second round trip, no branch where you forgot the check.', 'xanh') },
  /* 7 */ { t: 'Null or throw — choose per call site', body: tp(lay('findUnique missing', 'findUniqueOrThrow', 'An operation'), { wrap: 120, fs: 13, title: 'query log + error — a missing user, a missing setting' }) +
    cards([
      ['OrThrow ⇒ P2025', 'One catchable code. Your error handler maps <code>P2025</code> to a 404 in one place, instead of a null check in forty handlers.'],
      ['Non-throwing ⇒ a union', '<code>T | null</code> forces the check. If every call site throws immediately anyway, you wrote <code>OrThrow</code> by hand.'],
      ['Never <code>!</code> a result', 'The non-null assertion moves the failure to a random later line as a <code>TypeError</code>. If you are sure, say so with <code>OrThrow</code>.'],
    ], 3) },
  /* 8 */ { t: 'findFirst without orderBy', body: tp(lay('findFirst no orderBy', 'findFirst before', 'findFirst orderBy', 'with orderBy'), { wrap: 86, fs: 18, title: 'same query, before and after one UPDATE — 200,000 rows' }) +
    ts(`await prisma.post.findFirst({ where: { published: true } });          // undefined order
await prisma.post.findFirst({ where: { published: true },               // defined
  orderBy: [{ publishedAt: 'desc' }, { id: 'desc' }] });`, { sm: true }) +
    box('No ORDER BY means no defined order', 'The first match was row 2. After an update rewrote row 2 at the end of the table, the same query returned row 4 — no error, a different post. It works in development and drifts in production. Every <code>findFirst</code> needs an <code>orderBy</code>, with a tiebreaker (<code>id</code>).', 'do2') },
  /* 9 */ { t: 'findMany without take', body: ts(`const all  = await prisma.post.findMany();                         // no take
const page = await prisma.post.findMany({ where: { published: true },
  orderBy: { publishedAt: 'desc' }, take: 20 });`, { sm: true }) +
    tp(gon(OUT('tai')).replace(/^\$ NODE_OPTIONS=\S+ /m, '$ ').replace(/"posts"\./g, ''), { wrap: 86, fs: 17, title: 'one findMany() on 200,000 posts — Node 26, PostgreSQL 16' }) +
    box('A bare findMany() is an unbounded read', 'Two hundred thousand rows took 3.5 seconds and grew the process by 1.8 GB of RSS. Twenty rows with <code>take</code> took 45 ms. Pass <code>take</code> always — "the result is small" is a fact about today\'s data. Chapter 5 covers cursor pagination.', 'do2') },
  /* 10 */ { t: 'count, and its two other forms', body: tp(lay('count', 'count per field', 'count published', '_count', '[["an'), { wrap: 130, fs: 12, title: 'query log — the three forms' }) +
    cards([
      ['Per-field counts', 'One scan answers three questions: all rows, non-null <code>body</code>, non-null <code>publishedAt</code>.'],
      ['<code>_count</code> on a relation', 'A <code>LEFT JOIN</code> on a grouped subquery — the posts themselves are never loaded.'],
      ['Counting is a scan', '<code>COUNT(*)</code> has no stored total in PostgreSQL. A total on every page load wants a cache. Chapter 9 measures it.'],
    ], 3) },
  /* 11 */ { t: 'The "does it exist" question', body: ts(`const a = (await prisma.user.count({ where: { email } })) > 0;                                  // A
const b = (await prisma.user.findFirst({ where: { email }, select: { id: true } })) !== null;   // B
const c = (await prisma.user.findUnique({ where: { email }, select: { id: true } })) !== null;  // C`, { sm: true }) +
    tp(lay('exists A count', 'exists B findFirst', 'exists C findUnique'), { wrap: 100, fs: 15, title: 'Prisma has no exists() — three real options' }) +
    box('Use C on a unique field, B otherwise — drop A', 'B and C are <code>LIMIT 1</code> and stop at the first hit; C also lets the compiler confirm the field is unique. A counts every match to answer yes or no — on ten thousand matches it counts ten thousand.', 'lam') },
  /* 12 */ { t: 'Your turn — and what to keep', body: two(steps([
      `Call ${c('findUnique')} with a non-unique field; read the TS2322`,
      `Run ${c('findFirst')} without orderBy, update that row, run it again`,
      `Time a bare ${c('findMany()')} on a big table, then with ${c('take: 20')}`,
      `Ask "does it exist" three ways; read the SQL`,
    ]), box('Keep these', `<ul><li>How many rows · what on none</li><li>${c('OrThrow')} ⇒ P2025, never ${c('!')}</li><li>findFirst ⇒ orderBy + tiebreaker</li><li>findMany ⇒ take, always</li></ul>`, 'lam'), '') },
]);
