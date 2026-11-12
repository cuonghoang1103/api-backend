/**
 * pr-09-5 — Prisma ORM · Chapter 9 · Lesson 9.5 "The query you should not send at all" (deck video, 12/11/2026). Bài web: pr-9-5-truy-van-khong-gui.
 * Output THẬT (`chay.sh p9-5`, prisma-pg9 PostgreSQL 16.14 4 CPU, CSDL c95 = mẫu c9 + chỉ mục (created_at DESC, id DESC) + author_id; Redis 7 trong prisma-redis9;
 * Prisma 6.19.3): include author 32,8 KB JSON (có passwordHash) vs select 3,2 KB · omit toàn cục ẩn trường, mở lại từng truy vấn · skip 0 → 1.000.000 tăng tuyến tính;
 * cursor của Prisma với orderBy HAI cột cũng tăng y như skip (SQL dạng OR ⇒ Index Only Scan + Rows Removed by Filter 1.000.000) · keyset (created_at, id) < (…) và
 * cursor orderBy chỉ id: hằng số ~0,5 ms · count() vs reltuples · 500 create / $transaction(500 upsert) / createMany · createMany 20.000 & 30.000 hàng: Prisma TỰ chia lô
 * · cache Redis hit/miss + quên del ⇒ đọc giá trị cũ. Số ms trên slide ĐỌC TỪ output.
 */
/* Output chạy THẬT, đóng băng từ thư mục demo của khoá video Prisma (12/11/2026) — deck tự chứa, không đọc tệp ngoài repo. */
const DU_LIEU = {
 "demo/out/p9-5/trang.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55492/c95 npx tsx p9/95/do.mts trang 2>&1 | grep -v deprecated\nskip       0 →      0.9 ms\nskip     200 →      0.8 ms\nskip   10000 →      1.2 ms\nskip  200000 →      9.8 ms\nskip 1000000 →     43.8 ms\ncursor o hang       0 →      0.7 ms\ncursor o hang   10000 →      1.3 ms\ncursor o hang  200000 →      9.6 ms\ncursor o hang 1000000 →     47.6 ms\no hang       0: keyset tho (created_at, id) < (...) →   0.8 ms · cursor Prisma, orderBy chi id →   0.8 ms\no hang 1000000: keyset tho (created_at, id) < (...) →   0.6 ms · cursor Prisma, orderBy chi id →   0.7 ms\nSQL cua cursor: SELECT \"id\" FROM \"posts\" WHERE ((\"created_at\" = (SELECT \"created_at\" FROM \"posts\" WHERE (\"id\") = ($1)) AND \"id\" <= (SELECT \"id\" FROM \"posts\" WHERE (\"id\") = ($2))) OR (\"created_at\" < (SELECT \"created_at\" FROM \"posts\" WHERE (\"id\") = ($3)))) ORDER BY \"created_at\" DESC, \"id\" DESC LIMIT $4 OFFSET $5\n",
 "demo/out/p9-5/chon.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55492/c95 npx tsx p9/95/do.mts chon 2>&1 | grep -v deprecated\ninclude: { author: true } → 20 hang ·   32.8 KB JSON · 1.7 ms · co passwordHash? true\nselect: { ... }           → 20 hang ·    3.2 KB JSON · 1.8 ms · co passwordHash? false\nomit toan cuc { user: { passwordHash, email } } → cac khoa cua user: id, username, fullName, avatarUrl, bio, metadata, createdAt\nmo lai tung truy van omit: { passwordHash: false } → co passwordHash? true\n",
 "demo/out/p9-5/cursor-explain.txt": "$ docker exec -i prisma-pg9 psql -U student -d c95 -c 'EXPLAIN (ANALYZE) SELECT id FROM posts WHERE ((created_at = (SELECT created_at FROM posts WHERE id = 200000) AND id <= (SELECT id FROM posts WHERE id = 200000)) OR (created_at < (SELECT created_at FROM posts WHERE id = 200000))) ORDER BY created_at DESC, id DESC LIMIT 20 OFFSET 1;'\n                                                                 QUERY PLAN                                                                 \n--------------------------------------------------------------------------------------------------------------------------------------------\n Limit  (cost=25.88..28.33 rows=20 width=12) (actual time=53.714..53.718 rows=20 loops=1)\n   InitPlan 1 (returns $0)\n     ->  Index Scan using posts_pkey on posts posts_1  (cost=0.43..8.45 rows=1 width=8) (actual time=0.016..0.017 rows=1 loops=1)\n           Index Cond: (id = 200000)\n   InitPlan 2 (returns $1)\n     ->  Index Only Scan using posts_pkey on posts posts_2  (cost=0.43..8.45 rows=1 width=4) (actual time=0.041..0.042 rows=1 loops=1)\n           Index Cond: (id = 200000)\n           Heap Fetches: 0\n   InitPlan 3 (returns $2)\n     ->  Index Scan using posts_pkey on posts posts_3  (cost=0.43..8.45 rows=1 width=8) (actual time=0.003..0.004 rows=1 loops=1)\n           Index Cond: (id = 200000)\n   ->  Index Only Scan using posts_tao_id on posts  (cost=0.43..48927.00 rows=399950 width=12) (actual time=53.711..53.714 rows=21 loops=1)\n         Filter: (((created_at = $0) AND (id <= $1)) OR (created_at < $2))\n         Rows Removed by Filter: 1000000\n         Heap Fetches: 11245\n Planning Time: 0.354 ms\n Execution Time: 53.774 ms\n(17 rows)\n\n$ docker exec -i prisma-pg9 psql -U student -d c95 -c 'EXPLAIN (ANALYZE) SELECT id FROM posts WHERE (created_at, id) < ((SELECT created_at FROM posts WHERE id = 200000), 200000) ORDER BY created_at DESC, id DESC LIMIT 20;'\n                                                                QUERY PLAN                                                                \n------------------------------------------------------------------------------------------------------------------------------------------\n Limit  (cost=8.87..9.68 rows=20 width=12) (actual time=0.052..0.055 rows=20 loops=1)\n   InitPlan 1 (returns $0)\n     ->  Index Scan using posts_pkey on posts posts_1  (cost=0.43..8.45 rows=1 width=8) (actual time=0.018..0.019 rows=1 loops=1)\n           Index Cond: (id = 200000)\n   ->  Index Only Scan using posts_tao_id on posts  (cost=0.43..16065.98 rows=399949 width=12) (actual time=0.051..0.053 rows=20 loops=1)\n         Index Cond: (ROW(created_at, id) < ROW($0, 200000))\n         Heap Fetches: 5\n Planning Time: 0.261 ms\n Execution Time: 0.093 ms\n(9 rows)\n\n",
 "demo/out/p9-5/dem.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55492/c95 npx tsx p9/95/do.mts dem 2>&1 | grep -v deprecated\npost.count()            → 1200000 · 59.1 ms\nreltuples (uoc luong)   → 1199848 · 0.5 ms · lech 0.01 %\ntake: 21 (con trang sau?) → co · 1.0 ms\n",
 "demo/out/p9-5/lo.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55492/c95 npx tsx p9/95/do.mts lo 2>&1 | grep -v deprecated\n500 x await create      →   417 ms (500 truy van)\n$transaction([...500])  →   245 ms (502 truy van, gom BEGIN/COMMIT)\ncreateMany(500)         →    13 ms (3 truy van)\ncreateMany(20.000 hang x 3 cot = 60.000 tham so) → 20000 hang · 3 cau INSERT · 359 ms\ncreateMany(30.000 hang x 3 cot = 90.000 tham so) → 30000 hang · 4 cau INSERT\n",
 "demo/out/p9-5/cache.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55492/c95 npx tsx p9/95/do.mts cache 2>&1 | grep -v deprecated\nlan dau (miss): 19.58 ms · 1 truy van  ·  20 lan sau (hit): trung vi 0.57 ms · 0 truy van\nghi bio MOI nhung quen redis.del → doc lai: bio bio bio  …(cu)\nsau redis.del → doc lai: bio MOI\n"
};
const fs = { readFileSync: (p) => { const k = String(p); if (!(k in DU_LIEU)) throw new Error('thiếu dữ liệu đóng băng: ' + k); return DU_LIEU[k]; } };
import { lamDeck, tp, ts, sql, two, box, cards, c, tbl, steps , icards, cmp, bars, hub, tiers, flow } from './_pr-chung.mjs';

export const deck = { key: 'pr-09-5', code: 'PR 9.5', title: 'The query you should not send at all', sub: 'Chapter 9 · Lesson 9.5' };

const DEMO = 'demo';
const OUT = (t, ch = 'p9-5') => fs.readFileSync(`${DEMO}/out/${ch}/${t}.txt`, 'utf8').replace(/\n+$/, '');
const gon = (s) => s.replace(/^\$ DATABASE_URL=\S+ /gm, '$ ').replace(/docker exec -i prisma-pg9 psql -U student -d c95/g, 'psql').replace(/p9\/9\d\//g, '').replace(/ 2>&1 \| grep -v deprecated/g, '').split('\n').filter((l) => !/^\s*$/.test(l)).join('\n');
const MOI = 'terminal — PostgreSQL 16.14 (Docker, 4 CPU) · Prisma 6.19.3 · 1.2M posts';
const bo$ = (t) => gon(OUT(t)).split('\n').filter((l) => !/^\$ (DATABASE_URL|npx|psql|docker)/.test(l)).join('\n');
const TR = bo$('trang').split('\n');

export const slides = lamDeck({ chuong: 'Chapter 9 — Performance', bai: '9.5' }, [
  /* 1 */ { cover: true, nhan: 'Chapter 9 · Lesson 9.5', t: 'The query you should not send at all', sub: 'Fewer columns, keyset pages, estimated counts, batched writes, a cache — each measured' },
  /* 2 */ { t: 'What you will take away from this lesson', body: icards([
      ['cut', 'Select what the page renders — and omit', ''],
      ['page', 'Offset pages, and a Prisma cursor that is no faster', ''],
      ['count', "count() versus the planner's estimate", ''],
      ['bolt', 'Batched writes, and the bind-parameter limit', ''],
      ['db', 'A cache, and the one honest invalidation rule', ''],
    ], 2) },
  /* 3 */ { t: '1 · Select less, because rows travel', body: ts(`await prisma.post.findMany({ where: { deletedAt: null }, include: { author: true }, take: 20 });
await prisma.post.findMany({ where: { deletedAt: null }, take: 20, select: { id: true, title: true,
  createdAt: true, author: { select: { id: true, username: true, avatarUrl: true } } } });
const db = new PrismaClient({ omit: { user: { passwordHash: true, email: true } } });  // global
await db.user.findFirstOrThrow({ omit: { passwordHash: false } });                   // opt back in`, { sm: true }) +
      tp(bo$('chon'), { wrap: 116, fs: 13, title: MOI }) +
      box('Ten times less JSON — and no password hash', 'include: { author: true } pulled passwordHash into the process, one res.json() away from the browser. select is the habit for lists; omit removes a secret from every query unless one asks for it.', 'xanh') },
  /* 4 */ { t: '2 · Offset pages read what they skip', body: two(ts(`await prisma.post.findMany({
  orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
  skip: n, take: 20, select: { id: true } });

await prisma.post.findMany({
  orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
  cursor: { id: lastId }, skip: 1, take: 20,
  select: { id: true } });`, { sm: true }), tp(TR.slice(0, 9).join('\n'), { wrap: 60, fs: 13, title: MOI + ' · index (created_at DESC, id DESC)' }), '') +
      box('The Prisma cursor got slower exactly like OFFSET', 'With a two-column orderBy, the cursor is no faster than skip at row 1,000,000. The index exists — the next slide shows why it does not help.', 'do2') },
  /* 5 */ { t: 'Why: the SQL behind a compound cursor', body: tp(TR.slice(-1).join('\n'), { wrap: 116, fs: 12, title: MOI }) +
      two(tp(gon(OUT('cursor-explain')).split('\n').filter((l) => /posts_tao_id|Filter:|Rows Removed|Index Cond: \(ROW|Execution/.test(l)).slice(0, 4).map((l) => l.replace(/\(cost=[^)]*\) /, '').trim()).join('\n'), { wrap: 64, fs: 12, title: 'Prisma cursor at row 200,000' }),
        tp(gon(OUT('cursor-explain')).split('\n').filter((l) => /posts_tao_id|Filter:|Rows Removed|Index Cond: \(ROW|Execution/.test(l)).slice(4).map((l) => l.replace(/\(cost=[^)]*\) /, '').trim()).join('\n'), { wrap: 64, fs: 12, title: 'keyset: WHERE (created_at, id) < (…)' }), '') +
      tp(TR.filter((l) => /keyset/.test(l)).join('\n'), { wrap: 116, fs: 13, title: MOI }) +
      box('An OR the index cannot seek on', 'Prisma expresses "after this row" as (created_at = x AND id ≤ y) OR created_at < x: the index is read from the top and a million rows are filtered out. A row comparison in raw SQL, or a cursor ordered by the unique id alone, stays constant.', 'lam') },
  /* 6 */ { t: '3 · count() is a scan; the estimate is free', body: sql(`SELECT reltuples::bigint AS uoc_luong FROM pg_class WHERE oid = 'posts'::regclass;`, { sm: true }) +
      tp(bo$('dem'), { wrap: 116, fs: 15, title: MOI }) +
      bars(bo$('dem').split('\n').map((l) => [l.split('→')[0].trim(), Number(l.match(/([\d.]+) ms/)[1]), /count/.test(l) ? '#c92a2a' : '#2f9e44']), { nhan: 360, log: true }) +
      box('"Is there a next page?" needs no count', 'take: 21, show 20 — if 21 came back, there is. reltuples is kept by ANALYZE and autovacuum and lags after a bulk load.', 'lam') },
  /* 7 */ { t: '4 · Batch the writes', body: ts(`for (const d of data) await prisma.notification.create({ data: d });          // 500 round trips
await prisma.$transaction(data.map((d) => prisma.notification.upsert({
  where: { uk_thong_bao: { userId: d.userId, key: d.key } }, create: d, update: { seenAt: null } })));
await prisma.notification.createMany({ data, skipDuplicates: true });         // one INSERT … VALUES`, { sm: true }) +
      tp(bo$('lo'), { wrap: 116, fs: 13, title: MOI }) +
      box('createMany chunks for you', 'PostgreSQL caps a statement at 65,535 bind parameters; Prisma split 60,000 parameters into 3 INSERTs and 90,000 into 4 on its own. $transaction([...]) still sends one statement per operation — it saves the 500 separate commits, not the round trips.', 'xanh') },
  /* 8 */ { t: '5 · A cache, and the one honest invalidation rule', body: two(ts(`async function getProfile(userId: number) {
  const key = \`ho-so:\${userId}\`;
  const daCo = await redis.get(key);
  if (daCo) return JSON.parse(daCo);
  const hoSo = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, username: true,
              avatarUrl: true, bio: true } });
  if (hoSo) await redis.set(key,
    JSON.stringify(hoSo), 'EX', 300);
  return hoSo;
}
// every write path: update, then
await redis.del(\`ho-so:\${userId}\`);`, { sm: true }), tp(bo$('cache'), { wrap: 60, fs: 13, title: 'terminal — Redis 7 + PostgreSQL 16.14' }), '') +
      box('Delete on every write, or serve stale data until the TTL', 'A hit needed no query and no connection. One write path that forgot redis.del served the old bio — the bug is invisible until a user notices.', 'do2') },
  /* 9 */ { t: 'The five, in order of how often they matter', body: cmp(['Technique', 'Measured here'], [
      ['select / omit', bo$('chon').split('\n')[0].replace(/ · co passwordHash\? true/, '').replace(/^include: \{ author: true \} → /, 'include: ') + ' vs ' + bo$('chon').split('\n')[1].replace(/ · co passwordHash\? false/, '').replace(/^select: \{ \.\.\. \}\s+→ /, '')],
      ['keyset pagination', 'constant ~0.5 ms; Prisma two-column cursor grew like OFFSET'],
      ['estimate, not count', bo$('dem').split('\n')[1].replace(/\s+/g, ' ')],
      ['createMany', bo$('lo').split('\n')[2].replace(/\s+/g, ' ')],
      ['cache', bo$('cache').split('\n')[0].replace(/\s+/g, ' ')],
    ]) },
  /* 10 */ { t: 'Your turn — and what to keep', body: two(steps([
      `Compare ${c('include')} and ${c('select')} bytes on one list`,
      `Page to row 1,000,000 with skip, cursor and keyset`,
      `Count a big table; read ${c('reltuples')}`,
      `Insert 500 rows three ways; cache one read`,
    ]), box('Keep these', `<ul><li>Select what the page renders</li><li>Keyset on the index order</li><li>Estimate big counts</li><li>Delete the cache key on every write</li></ul>`, 'lam'), '') },
]);
