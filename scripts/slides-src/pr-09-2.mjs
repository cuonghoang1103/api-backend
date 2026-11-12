/**
 * pr-09-2 — Prisma ORM · Chapter 9 · Lesson 9.2 "N+1 in all its forms" (deck video, 12/11/2026). Bài web: pr-9-2-n-cong-1.
 * Output THẬT (`chay.sh p9-2`, prisma-pg9 PostgreSQL 16.14 4 CPU, CSDL c92 = mẫu c9 + chỉ mục khoá ngoại; Prisma 6.19.3; trung vị 5 lần sau 1 lần làm nóng):
 * vòng findUnique 41 truy vấn 23 ms vs include 2 truy vấn 2,4 ms · bật relationJoins ⇒ include mặc định 1 truy vấn LATERAL · Promise.all(count) 41 truy vấn 5 ms,
 * tuần tự 20 ms, `_count` KHÔNG relationJoins = LEFT JOIN (GROUP BY trên CẢ bảng comments) 71 ms · include 3 tầng 4 truy vấn 1.420 hàng 725 KB 56 ms, select gọn 6 KB
 * nhưng 64 ms (lại do _count) · Promise.all(getById) được Prisma GOM thành 2 truy vấn · join vs query: hẹp 2 tầng 3,9/3,6 ms, 3 tầng 7,2/5,5 ms, cha rộng 6 KB 8,3/6,7 ms
 * (join gom con thành JSON nên KHÔNG lặp body) · LATERAL thô 4,4 ms vs include take 3 11,7 ms.
 */
/* Output chạy THẬT, đóng băng từ thư mục demo của khoá video Prisma (12/11/2026) — deck tự chứa, không đọc tệp ngoài repo. */
const DU_LIEU = {
 "demo/out/p9-2/dang1.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55492/c92 npx tsx p9/92/do.mts dang1\nvong lap findUnique (40 bai)        41 truy van ·    25.1 ms ·    80 hang ·    66 KB\ninclude: { author: true }            2 truy van ·     2.3 ms ·    80 hang ·    66 KB\nprisma:query SELECT … FROM \"posts\" WHERE 1=1 ORDER BY \"id\" DESC LIMIT $1 OFFSET $2\nprisma:query SELECT … FROM \"users\" WHERE \"id\" IN ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$3\n",
 "demo/out/p9-2/dang2.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55492/c92 npx tsx p9/92/do.mts dang2\ntuan tu: for + await count          41 truy van ·    21.1 ms ·    40 hang ·    35 KB\nPromise.all(map count)              41 truy van ·     5.5 ms ·    40 hang ·    35 KB\ninclude: { _count: comments }        1 truy van ·    71.1 ms ·    40 hang ·    35 KB\nprisma:query SELECT … FROM \"posts\" LEFT JOIN (SELECT \"post_id\", COUNT(*) AS \"_aggr_count_comments\" FROM \"comments\" WHERE 1=1 GROUP BY \"post_id\") AS \"aggr_selection\n",
 "demo/out/p9-2/mac-dinh-join.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55492/c92 npx tsx p9/92/do.mts mac-dinh-join\ninclude author (co relationJoins)    1 truy van ·     2.7 ms ·    80 hang ·    66 KB\nprisma:query SELECT … FROM \"posts\" AS \"t0\" LEFT JOIN LATERAL (SELECT JSONB_BUILD_OBJECT('id', \"id\", 'email', \"email\", 'username', \"username\", 'fullName', \"full_nam\n_count comments (co relationJoins)   1 truy van ·     1.5 ms ·    40 hang ·    35 KB\nprisma:query SELECT … FROM \"posts\" AS \"t0\" LEFT JOIN LATERAL (SELECT COUNT(*) AS \"_aggr_count_comments\" FROM \"comments\" AS \"t2\" WHERE \"id\" = \"post_id\") AS \"t1\" ON \n",
 "demo/out/p9-2/dang3.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55492/c92 npx tsx p9/92/do.mts dang3\ninclude long 3 tang                  4 truy van ·    45.3 ms ·  1420 hang ·   725 KB\nprisma:query SELECT … FROM \"users\" WHERE 1=1 ORDER BY \"id\" ASC LIMIT $1 OFFSET $2\nprisma:query SELECT … FROM \"posts\" WHERE \"author_id\" IN ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20) ORDER BY \"id\" DESC OFFSET $21\nprisma:query SELECT … FROM \"comments\" WHERE \"post_id\" IN ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$2\nprisma:query SELECT … FROM \"users\" WHERE \"id\" IN ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20) OFFSET $21\nselect dung thu the hien             2 truy van ·    61.4 ms ·    80 hang ·     6 KB\n",
 "demo/out/p9-2/dang4.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55492/c92 npx tsx p9/92/do.mts dang4\nPromise.all(ids.map(getById))        2 truy van ·     4.6 ms ·    80 hang ·    66 KB\nprisma:query SELECT … FROM \"users\" WHERE \"id\" IN ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$3\nprisma:query SELECT … FROM \"posts\" WHERE \"id\" IN ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$3\nprisma:query SELECT … FROM \"users\" WHERE \"id\" IN ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$3\ngetByIds(ids)                        2 truy van ·     2.6 ms ·    80 hang ·    66 KB\n",
 "demo/out/p9-2/join.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55492/c92 npx tsx p9/92/do.mts join\nhep · 2 tang · query                 3 truy van ·     4.0 ms ·   200 hang ·    79 KB\nhep · 2 tang · join                  1 truy van ·     3.9 ms ·   200 hang ·    79 KB\nhep · 3 tang · query                 4 truy van ·     6.5 ms ·   320 hang ·   173 KB\nprisma:query SELECT … FROM \"posts\" WHERE 1=1 ORDER BY \"id\" DESC LIMIT $1 OFFSET $2\nprisma:query SELECT … FROM \"users\" WHERE \"id\" IN ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$3\nprisma:query SELECT … FROM \"comments\" WHERE \"post_id\" IN ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$2\nprisma:query SELECT … FROM \"users\" WHERE \"id\" IN ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$3\nhep · 3 tang · join                  1 truy van ·     7.0 ms ·   320 hang ·   173 KB\nprisma:query SELECT … FROM \"posts\" AS \"t0\" LEFT JOIN LATERAL (SELECT JSONB_BUILD_OBJECT('id', \"id\", 'email', \"email\", 'username', \"username\", 'fullName', \"full_nam\n",
 "demo/out/p9-2/rong.txt": "$ docker exec -i prisma-pg9 psql -q -U student -d c92 -c \"UPDATE posts SET body = repeat('Noi dung dai. ', 440) WHERE id > 1199960;\"\n$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55492/c92 npx tsx p9/92/do.mts rong\nrong (body 6 KB) · 3 tang · query    4 truy van ·     7.7 ms ·   320 hang ·   403 KB\nrong (body 6 KB) · 3 tang · join     1 truy van ·     8.2 ms ·   320 hang ·   403 KB\n",
 "demo/out/p9-2/lateral.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55492/c92 npx tsx p9/92/do.mts lateral\ninclude posts take 3 (20 user)       2 truy van ·    12.9 ms ·    74 hang ·     5 KB\n$queryRaw LATERAL                    1 truy van ·     6.5 ms ·    56 hang ·     6 KB\n"
};
const fs = { readFileSync: (p) => { const k = String(p); if (!(k in DU_LIEU)) throw new Error('thiếu dữ liệu đóng băng: ' + k); return DU_LIEU[k]; } };
import { lamDeck, tp, ts, prs, two, box, cards, c, tbl, steps , icards, cmp, bars, hub, tiers, flow } from './_pr-chung.mjs';

export const deck = { key: 'pr-09-2', code: 'PR 9.2', title: 'N+1 in all its forms', sub: 'Chapter 9 · Lesson 9.2' };

const DEMO = 'demo';
const OUT = (t, ch = 'p9-2') => fs.readFileSync(`${DEMO}/out/${ch}/${t}.txt`, 'utf8').replace(/\n+$/, '');
const gon = (s) => s.replace(/^\$ DATABASE_URL=\S+ /gm, '$ ').replace(/p9\/9\d\//g, '').replace(/\(\$1,\$2,\$3,\$4,[^)]*\)/g, '($1 … $n)').split('\n').filter((l) => !/^\s*$/.test(l)).join('\n');
const MOI = 'terminal — PostgreSQL 16.14 (Docker, 4 CPU) · Prisma 6.19.3 · median of 5';
const ms = (t, nhan) => OUT(t).split('\n').find((l) => l.startsWith(nhan)).match(/([\d.]+) ms/)[1];
const bo$ = (t) => gon(OUT(t)).split('\n').filter((l) => !l.startsWith('$ ')).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 9 — Performance', bai: '9.2' }, [
  /* 1 */ { cover: true, nhan: 'Chapter 9 · Lesson 9.2', t: 'N+1 in all its forms', sub: 'Five shapes of too many queries — each measured, and two "fixes" that turned out slower' },
  /* 2 */ { t: 'What you will take away from this lesson', body: icards([
      ['loop', 'The explicit loop, and the loop hidden by Promise.all', ''],
      ['count', '_count: one query that can still be the slow one', ''],
      ['tree', 'The nested include that fans out', ''],
      ['link', 'The loop in the caller — which Prisma batches for you', ''],
      ['merge', 'relationLoadStrategy: join vs query, measured', ''],
    ], 2) },
  /* 3 */ { t: 'Form 1 — the explicit loop', body: two(ts(`const posts = await prisma.post.findMany({ take: 40 });
for (const b of posts) {
  const author = await prisma.user.findUnique({
    where: { id: b.authorId } });
}
// fix: ask for the relation with the parent
await prisma.post.findMany({
  take: 40, include: { author: true } });`, { sm: true }), tp(bo$('dang1'), { wrap: 62, fs: 12, title: MOI }), '') +
      box(`41 queries → 2, and ${ms('dang1', 'vong lap')} ms → ${ms('dang1', 'include')} ms`, 'Same 80 objects, same 66 KB. The default loads the relation with a second query using IN (…) — the batch is the fix.', 'xanh') +
      cards([
        ['Each lookup is fast', 'Under a millisecond in the database; the cost is 41 round trips.'],
        ['On a real network', 'Add the latency to every one of them — this was localhost.'],
      ], 2) },
  /* 4 */ { t: 'Form 2 — Promise.all hides it; _count can be slower', body: ts(`const countComments = (postId: number) => prisma.comment.count({ where: { postId } });
for (const b of posts) await countComments(b.id);                          // sequential
await Promise.all(posts.map((b) => countComments(b.id)));                  // concurrent
await prisma.post.findMany({ take: 40, include: { _count: { select: { comments: true } } } });`, { sm: true }) +
      tp(bo$('dang2'), { wrap: 116, fs: 13, title: MOI }) +
      cards([
        [`Promise.all: ${ms('dang2', 'Promise.all')} ms, still 41 queries`, 'The wall clock looks fine; the database did 41 statements and held many connections.'],
        ['_count without relationJoins', `A LEFT JOIN on a GROUP BY over the whole comments table — 600,000 rows aggregated for 40 posts: ${ms('dang2', 'include: { _count')} ms.`],
        ['Measure the fix too', `One query is not automatically the cheaper one. With relationJoins on, _count became a LATERAL subquery: ${ms('mac-dinh-join', '_count')} ms.`],
      ], 3) },
  /* 5 */ { t: 'Form 3 — the nested include that fans out', body: ts(`await prisma.user.findMany({ take: 20,
  include: { posts: { take: 10, include: { comments: { include: { author: true } } } } } });
await prisma.user.findMany({ take: 20,
  select: { id: true, username: true, avatarUrl: true, _count: { select: { posts: true } },
    posts: { take: 3, orderBy: { publishedAt: 'desc' },
      select: { id: true, title: true, _count: { select: { comments: true } } } } } });`, { sm: true }) +
      tp(bo$('dang3'), { wrap: 116, fs: 12, title: MOI }) +
      box('Four batched queries, 1,420 objects, 725 KB — for 20 cards', 'Not an N+1, and still the problem: every level multiplies rows. The narrow select sends 6 KB — yet takes longer here, because its two _count fields aggregate whole tables. Bytes and time are separate measurements.', 'lam') },
  /* 6 */ { t: 'Form 4 — the loop in the caller', body: two(ts(`class PostService {
  getById(id: number) {
    return prisma.post.findUniqueOrThrow({
      where: { id },
      include: { author: true } });
  }
  getByIds(ids: number[]) {
    return prisma.post.findMany({
      where: { id: { in: ids } },
      include: { author: true } });
  }
}
await Promise.all(ids.map((id) =>
  svc.getById(id)));
await svc.getByIds(ids);`, { sm: true }), tp(bo$('dang4'), { wrap: 62, fs: 12, title: MOI }), '') +
      box('Prisma batched the 40 findUnique calls into 2 queries', 'findUnique calls made in the same tick are merged into one IN query by the client. A for … await loop, or findFirst, gets no such help — so still give every getById a plural sibling.', 'xanh') },
  /* 7 */ { t: 'relationLoadStrategy — join vs query', body: two(prs(`generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["relationJoins"]
}`, { sm: true }) + ts(`await prisma.post.findMany({ take: 40,
  include: { author: true, comments: { take: 5 } },
  relationLoadStrategy: 'join' });   // or 'query'`, { sm: true }),
      tp([bo$('mac-dinh-join'), bo$('join'), bo$('rong')].join('\n').split('\n').filter((l) => !/^prisma:query/.test(l)).map((l) => l.replace(/ ·\s+\d+ hang ·\s+\d+ KB/, '')).join('\n'), { wrap: 62, fs: 12, title: MOI }), '') +
      box('With the flag on, join is the default — and the differences were small', `A plain include became one LATERAL query. Three levels: join ${ms('join', 'hep · 3 tang · join')} vs query ${ms('join', 'hep · 3 tang · query')} ms. A 6 KB parent did not blow up: Prisma&#39;s join aggregates children into JSON (${ms('rong', 'rong (body 6 KB) · 3 tang · join')} vs ${ms('rong', 'rong (body 6 KB) · 3 tang · query')} ms).`, 'lam') },
  /* 8 */ { t: 'When include is the wrong tool', body: two(ts(`// newest 3 posts of each of 20 users
await prisma.user.findMany({
  where: { id: { in: ids } },
  select: { id: true, username: true,
    posts: { where: { published: true },
      orderBy: { publishedAt: 'desc' }, take: 3,
      select: { id: true, title: true,
                publishedAt: true } } } });

await prisma.$queryRaw\`
  SELECT u.id, u.username, b.*
  FROM users u
  LEFT JOIN LATERAL (
    SELECT id AS post_id, title, published_at
    FROM posts
    WHERE author_id = u.id AND published
    ORDER BY published_at DESC LIMIT 3) b ON true
  WHERE u.id = ANY(\${ids}::int[])\`;`, { sm: true }), tp(bo$('lateral').replace(/ ·\s+\d+ hang ·\s+\d+ KB/g, ''), { wrap: 62, fs: 13, title: MOI }), '') +
      box('Top-N per group: one pass in SQL', `The raw LATERAL query did it in ${ms('lateral', '$queryRaw')} ms against ${ms('lateral', 'include')} ms. Chapter 10 makes such queries typed and safe; the denormalised counter column is the other escape when a count is sorted or filtered on.`, 'lam') },
  /* 9 */ { t: 'The rule', body: cmp(['Step', 'Why'], [
      ['Count queries per request, in a test', 'the only reliable detector of N+1'],
      ['Then count rows and bytes', '1,420 objects for 20 cards hides behind "4 queries"'],
      ['Then time the fix', c('_count') + ' and narrow selects were slower here — measure, do not assume'],
      ['Try ' + c('relationLoadStrategy') + ' per query', 'differences were a few ms both ways on this data'],
      ['Leave Prisma deliberately', 'LATERAL in raw SQL, or a stored counter'],
    ]) },
  /* 10 */ { t: 'Your turn — and what to keep', body: two(steps([
      `Write the explicit loop; count its queries`,
      `Swap it for ${c('include')}; then for ${c('_count')} — time each`,
      `Map ${c('getById')} with Promise.all; read the SQL log`,
      `Run one query with ${c("'join'")} and ${c("'query'")}`,
    ]), box('Keep these', `<ul><li>Count, then rows, then time</li><li>Promise.all hides N+1</li><li>One query can still be slow</li><li>findUnique in one tick is batched</li></ul>`, 'lam'), '') },
]);
