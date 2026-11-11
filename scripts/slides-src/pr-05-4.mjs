/**
 * pr-05-4 — Prisma ORM · Chapter 5 · Lesson 5.4 "Aggregation and groupBy" (deck video, 12/11/2026). Bài web: pr-5-4-tong-hop.
 * Output THẬT (`chay.sh p5-4`, demo/lab/p5/54, CSDL c54: 200.000 post + 4.548 đơn tháng 8/2026, ngày 2/8 trống, Prisma 6.19.3 · PostgreSQL 16.14):
 * aggregate = MỘT câu (COUNT/SUM/AVG/MIN/MAX trên truy vấn con) · không hàng ⇒ _sum/_avg null · groupBy status + having · distinct trên PostgreSQL
 * KHÔNG phải DISTINCT ON: Prisma đọc hết rồi lọc trong bộ máy (web nói DISTINCT ON) · biểu đồ ngày bằng generate_series lấp ngày trống, COUNT/SUM ⇒ bigint ⇒
 * JSON.stringify ném TypeError · sáu await so với $transaction mảng: ngang nhau trên localhost (web nói nhanh ~5 lần).
 */
/* Output chạy THẬT, đóng băng từ thư mục demo của khoá video Prisma (12/11/2026) — deck tự chứa, không đọc tệp ngoài repo. */
const DU_LIEU = {
 "demo/out/p5-4/tonghop.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c54 npx tsx p5/54/tonghop.mts\n[aggregate] SELECT COUNT(\"body\") AS \"_count$body\", COUNT(*) AS \"_count$_all\", SUM(\"views\") AS \"_sum$views\", AVG(\"views\") AS \"_avg$views\", MIN(\"published_at\") AS \"_min$published_at\", MAX(\"views\") AS \"_max$views\", MAX(\"published_at\") AS \"_max$published_at\" FROM (SELECT \"body\", \"views\", \"published_at\" FROM \"posts\" WHERE \"published\" = $1 OFFSET $2) AS \"sub\"\n{\"_count\":{\"_all\":85715,\"body\":77143},\"_sum\":{\"views\":85630910},\"_avg\":{\"views\":999.0189581753485},\"_min\":{\"publishedAt\":\"2025-01-01T00:02:00.000Z\"},\"_max\":{\"views\":1998,\"publishedAt\":\"2025-05-19T21:20:00.000Z\"}}\non no rows → {\"_sum\":{\"views\":null},\"_avg\":{\"views\":null},\"_count\":{\"_all\":0}}\n[groupBy status] SELECT COUNT(*) AS \"_count$_all\", SUM(\"total\") AS \"_sum$total\", AVG(\"total\") AS \"_avg$total\", \"status\" FROM \"orders\" WHERE \"created_at\" >= $1 GROUP BY \"status\" ORDER BY SUM(\"total\") DESC OFFSET $2\n  {\"_count\":{\"_all\":3867},\"_sum\":{\"total\":773629922},\"_avg\":{\"total\":200059.45746056375},\"status\":\"DA_GIAO\"}\n  {\"_count\":{\"_all\":454},\"_sum\":{\"total\":90934276},\"_avg\":{\"total\":200295.76211453744},\"status\":\"DANG_XU_LY\"}\n  {\"_count\":{\"_all\":227},\"_sum\":{\"total\":45365000},\"_avg\":{\"total\":199845.81497797355},\"status\":\"DA_HUY\"}\n[groupBy having] SELECT COUNT(*) AS \"_count$_all\", AVG(\"views\") AS \"_avg$views\", \"author_id\", \"published\" FROM \"posts\" WHERE \"author_id\" <= $1 GROUP BY \"author_id\", \"published\" HAVING AVG(\"views\") > $2 ORDER BY \"author_id\" ASC OFFSET $3\n  [{\"_count\":{\"_all\":72},\"_avg\":{\"views\":1001.6666666666666},\"authorId\":6,\"published\":null}]\n[distinct] SELECT \"id\", \"author_id\" FROM \"posts\" WHERE 1=1 ORDER BY \"author_id\" ASC, \"published_at\" DESC OFFSET $1\n  [{\"authorId\":1,\"id\":200000},{\"authorId\":2,\"id\":14001},{\"authorId\":3,\"id\":199602}]\n",
 "demo/lab/p5/54/bieudo.mts": "import { PrismaClient } from '../gen/index.js';\nconst prisma = new PrismaClient();\ntype Day = { day: Date; orderCount: bigint; revenue: bigint };\nconst from = '2026-08-01', to = '2026-08-04';\nconst rows = await prisma.$queryRaw<Day[]>`\n  SELECT d.day::date AS day, COUNT(o.id) AS \"orderCount\", COALESCE(SUM(o.total), 0) AS \"revenue\"\n  FROM generate_series(${from}::date, ${to}::date, '1 day') AS d(day)\n  LEFT JOIN orders o ON o.created_at >= d.day AND o.created_at < d.day + INTERVAL '1 day' AND o.status = 'DA_GIAO'\n  GROUP BY d.day ORDER BY d.day`;\nfor (const r of rows) console.log(`  ${r.day.toISOString().slice(0, 10)}  orderCount: ${r.orderCount}n  revenue: ${r.revenue}n`);\ntry { JSON.stringify(rows); } catch (e: any) { console.log('JSON.stringify(rows) →', e.constructor.name + ':', e.message); }\nconst g = await prisma.order.groupBy({ by: ['status'], _count: { _all: true } });\nconsole.log('groupBy by status (no date): ', g.length, 'groups — a gap day never appears in groupBy output');\nawait prisma.$disconnect();\n",
 "demo/out/p5-4/bieudo.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c54 npx tsx p5/54/bieudo.mts\n  2026-08-01  orderCount: 128n  revenue: 25443300n\n  2026-08-02  orderCount: 0n  revenue: 0n\n  2026-08-03  orderCount: 130n  revenue: 25749245n\n  2026-08-04  orderCount: 129n  revenue: 25553063n\nJSON.stringify(rows) → TypeError: Do not know how to serialize a BigInt\ngroupBy by status (no date):  3 groups — a gap day never appears in groupBy output\n",
 "demo/out/p5-4/motlan.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c54 npx tsx p5/54/mot-lan.mts\nround 1: six separate awaits 106 ms · one $transaction array 83 ms\nround 2: six separate awaits 58 ms · one $transaction array 59 ms\nround 3: six separate awaits 86 ms · one $transaction array 78 ms\n"
};
const fs = { readFileSync: (p) => { const k = String(p); if (!(k in DU_LIEU)) throw new Error('thiếu dữ liệu đóng băng: ' + k); return DU_LIEU[k]; } };
import { lamDeck, prs, ts, tp, sql, two, box, cards, c, tbl, steps } from './_pr-chung.mjs';

export const deck = { key: 'pr-05-4', code: 'PR 5.4', title: 'Aggregation and groupBy', sub: 'Chapter 5 · Lesson 5.4' };

const DEMO = 'demo';
const OUT = (t) => fs.readFileSync(`${DEMO}/out/p5-4/${t}.txt`, 'utf8').replace(/\n+$/, '');
const SRC = (t) => fs.readFileSync(`${DEMO}/lab/p5/54/${t}`, 'utf8').replace(/\n+$/, '');
const gon = (s) => s.replace(/^\$ DATABASE_URL=\S+ /gm, '$ ').split('\n').filter((l) => !/^\s*$/.test(l)).join('\n');
const lay = (t, ...nhan) => OUT(t).split('\n').filter((l) => nhan.some((n) => l.startsWith(`[${n}]`) || l.startsWith(n))).join('\n');
const sau = (t, nhan) => { const L = OUT(t).split('\n'); const i = L.findIndex((l) => l.startsWith(`[${nhan}]`)); return L.slice(i + 1).filter((l) => /^ {2}[\[{]/.test(l)).join('\n'); };

export const slides = lamDeck({ chuong: 'Chapter 5 — Querying in depth', bai: '5.4' }, [
  /* 1 */ { cover: true, nhan: 'Chapter 5 · Lesson 5.4', t: 'Aggregation and groupBy', sub: 'Most dashboard numbers without leaving the client — and the four places the wall stands' },
  /* 2 */ { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li><code>aggregate</code>: five functions, one statement</li>
    <li><code>groupBy</code>, and <code>where</code> versus <code>having</code></li>
    <li>The four things groupBy cannot do — and the raw query that does them</li>
    <li><code>distinct</code>, and where it really runs</li>
    <li>Several numbers in one round trip — measured</li></ul>` },
  /* 3 */ { t: 'aggregate — five functions, one query', body: ts(`await prisma.post.aggregate({
  where: { published: true },
  _count: { _all: true, body: true }, _sum: { views: true }, _avg: { views: true },
  _min: { publishedAt: true }, _max: { views: true, publishedAt: true },
});`, { sm: true }) + tp(lay('tonghop', 'aggregate', '{"_count"', 'on no rows').replace(/FROM \(SELECT .*$/m, 'FROM (SELECT … WHERE "published" = $1 …) AS "sub"'), { wrap: 130, fs: 12 }) +
    cards([
      ['One scan', 'Seven aggregates in one statement — not seven queries.'],
      ['_count: { field }', 'Counts non-NULL values: <code>body</code> 77,143 of 85,715.'],
      ['Empty set ⇒ null', '<code>_sum</code> and <code>_avg</code> are <code>null</code>, not 0. Every consumer needs <code>?? 0</code>.'],
    ], 3) },
  /* 4 */ { t: 'groupBy — the dashboard query', body: ts(`await prisma.order.groupBy({
  by: ['status'], where: { createdAt: { gte: dauThang } },
  _count: { _all: true }, _sum: { total: true }, _avg: { total: true },
  orderBy: { _sum: { total: 'desc' } },
});`, { sm: true }) + tp(lay('tonghop', 'groupBy status') + '\n' + sau('tonghop', 'groupBy status'), { wrap: 112, fs: 14 }) },
  /* 5 */ { t: 'where filters rows, having filters groups', body: ts(`await prisma.post.groupBy({
  by: ['authorId', 'published'], where: { authorId: { lte: 6 } },
  _count: { _all: true }, _avg: { views: true },
  having: { views: { _avg: { gt: 1000 } } },        // HAVING AVG(views) > 1000
  orderBy: [{ authorId: 'asc' }],
});`, { sm: true }) + tp(lay('tonghop', 'groupBy having') + '\n' + sau('tonghop', 'groupBy having'), { wrap: 130, fs: 13 }) +
    box('Two different questions', '<code>where: { views: { gt: 1000 } }</code>: average only the popular posts. <code>having</code>: average all posts, keep only the groups whose average is above 1000 — here one group of 72.', 'lam') },
  /* 6 */ { t: 'The four things groupBy cannot do', body: cards([
      ['1 · Group by an expression', '"Orders per day" needs <code>GROUP BY date_trunc(…)</code>. groupBy takes columns only.'],
      ['2 · Group across a relation', '"Revenue per customer city" spans two models. groupBy works on one.'],
      ['3 · Window functions', 'Running totals, rank within group: <code>ROW_NUMBER() OVER (…)</code> has no Prisma form.'],
      ['4 · Fill gaps in a series', 'A day with no orders produces no row — a 31-day chart silently has 30 bars.'],
    ], 2) },
  /* 7 */ { t: 'The raw query a dashboard really needs', body: sql(SRC('bieudo.mts').split('\n').slice(5, 9).join('\n').replace(/^\s+/gm, (m) => m.slice(2)).replace(/\$\{from\}/, "'2026-08-01'").replace(/\$\{to\}/, "'2026-08-04'").replace(/`;$/, ''), { sm: true }) +
      tp(gon(OUT('bieudo')).replace(/^\$ .*$/m, '$ npx tsx bieudo.mts').split('\n').filter((l) => !/^groupBy/.test(l)).join('\n'), { wrap: 110, fs: 15 }) +
    box('generate_series fills the gap — and COUNT comes back as bigint', 'August 2 had no orders and still gets a row. But <code>COUNT</code> and <code>SUM</code> return <code>bigint</code>, and <code>JSON.stringify</code> throws. Cast in SQL (<code>::int</code>) or convert before <code>res.json</code>.', 'do2') },
  /* 8 */ { t: 'distinct, and where it actually runs', body: ts(`await prisma.post.findMany({
  distinct: ['authorId'],
  orderBy: [{ authorId: 'asc' }, { publishedAt: 'desc' }],
  take: 3,
});`, { sm: true }) + tp(lay('tonghop', 'distinct') + '\n' + sau('tonghop', 'distinct'), { wrap: 130, fs: 14, title: 'query log — Prisma 6.19.3 on PostgreSQL' }) +
    box('No DISTINCT ON, and no LIMIT', 'The SQL reads every row in that order — 200,000 here — and the query engine keeps the first per author, then applies <code>take: 3</code>. Correct, and as expensive as reading the whole table. For a real <code>DISTINCT ON</code>, write it in <code>$queryRaw</code>.', 'do2') },
  /* 9 */ { t: 'Several numbers in one round trip?', body: ts(`await prisma.$transaction([
  prisma.user.count(), prisma.user.count({ where: { createdAt: { gte: homNay } } }),
  prisma.post.count({ where: { published: true } }), prisma.post.count({ where: { publishedAt: { gte: homNay } } }),
  prisma.order.groupBy({ by: ['status'], _count: { _all: true } }),
  prisma.post.groupBy({ by: ['authorId'], _count: { _all: true }, orderBy: { _count: { authorId: 'desc' } }, take: 5 }),
]);`, { sm: true }) + tp(gon(OUT('motlan')).replace(/^\$ .*$/m, '$ npx tsx mot-lan.mts'), { wrap: 120, fs: 17, title: 'six awaits vs one $transaction — three rounds, PostgreSQL on the same machine' }) +
    box('Consistency, not speed', 'Locally the two are the same speed: the array still sends six statements, one after another, inside one transaction. What you do get is six numbers from one snapshot — totals that cannot disagree.', 'lam') },
  /* 10 */ { t: 'When to stop using groupBy', body: cards([
      ['Over a second? Change the shape', 'Aggregating a million rows on every page load is the wrong shape whatever the tool.'],
      ['Pre-aggregate', 'A daily summary table, a maintained counter, or a materialised view refreshed on a schedule.'],
      ['Raw SQL is not failure', '<code>date_trunc</code>, <code>generate_series</code>, window functions — Chapter 10 makes them type-safe.'],
    ], 3) + sql(`-- pre-aggregate once a night instead of on every page load
CREATE MATERIALIZED VIEW daily_revenue AS
  SELECT date_trunc('day', created_at) AS day, status, COUNT(*) AS orders, SUM(total) AS revenue
  FROM orders GROUP BY 1, 2;
REFRESH MATERIALIZED VIEW daily_revenue;`, { sm: true }) },
  /* 11 */ { t: 'Choosing per question', body: tbl(['You want', 'Use'], [
      ['one number or a handful over one model', c('count') + ' / ' + c('aggregate')],
      ['numbers per category of one column', c('groupBy') + ' (+ ' + c('having') + ')'],
      ['per day, per month, across models, ranked', c('$queryRaw') + ' with generate_series / window functions'],
      ['one row per author, the newest', c('$queryRaw') + ' with DISTINCT ON — not ' + c('distinct') + ' on a big table'],
      ['several numbers that must agree', c('$transaction([...])')],
    ]) },
  /* 12 */ { t: 'Your turn — and what to keep', body: two(steps([
      `Write one ${c('aggregate')} with five functions; read the single SQL`,
      `Group orders by status; add ${c('having')}`,
      `Build a 31-day chart with ${c('generate_series')}; JSON it`,
      `Read the SQL of ${c('distinct')} on a big table`,
    ]), box('Keep these', `<ul><li>${c('aggregate')} = one statement</li><li>Empty ⇒ null, use ${c('?? 0')}</li><li>Gaps, dates, ranks ⇒ raw SQL</li><li>${c('distinct')} runs in the engine</li></ul>`, 'lam'), '') },
]);
