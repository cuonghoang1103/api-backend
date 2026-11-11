/**
 * pr-05-3 — Prisma ORM · Chapter 5 · Lesson 5.3 "Ordering, and pagination that survives" (deck video, 12/11/2026). Bài web: pr-5-3-sap-xep-phan-trang.
 * Output THẬT (`chay.sh p5-3`, demo/lab/p5/53, CSDL c53: 1.000.000 post, chỉ mục (published_at DESC, id DESC), Prisma 6.19.3 · PostgreSQL 16.14):
 * OFFSET 0/10k/100k/900k ⇒ 0,055 / 5,6 / 20,5 / 85,5 ms (Index Scan đọc 20 / 10.020 / 100.020 / 900.020 hàng) · con trỏ id < … ⇒ ~0,02 ms mọi độ sâu ·
 * cursor của Prisma ⇒ "id" <= (SELECT "id" … WHERE id = $2) · 3 hàng chèn giữa hai trang: offset lặp 3 hàng, cursor 0, cursor quên skip:1 lặp 1 ·
 * DESC không nulls ⇒ hàng NULL lên đầu · _count ⇒ LEFT JOIN … GROUP BY · take size+1 ⇒ hasMore.
 */
/* Output chạy THẬT, đóng băng từ thư mục demo của khoá video Prisma (12/11/2026) — deck tự chứa, không đọc tệp ngoài repo. */
const DU_LIEU = {
 "demo/out/p5-3/offset.txt": "$ docker exec -i prisma-pg psql -U student -d c53 < p5/53/offset.sql | grep -E 'rows|^ +[0-9]+$|Execution|Index|Limit|Sort'\n  rows   \n 1000000\n Limit (actual rows=20 loops=1)\n   ->  Index Scan using posts_pub_id on posts (actual rows=20 loops=1)\n Execution Time: 0.055 ms\n(4 rows)\n Limit (actual rows=20 loops=1)\n   ->  Index Scan using posts_pub_id on posts (actual rows=10020 loops=1)\n Execution Time: 5.622 ms\n(4 rows)\n Limit (actual rows=20 loops=1)\n   ->  Index Scan using posts_pub_id on posts (actual rows=100020 loops=1)\n Execution Time: 20.511 ms\n(4 rows)\n Limit (actual rows=20 loops=1)\n   ->  Index Scan using posts_pub_id on posts (actual rows=900020 loops=1)\n Execution Time: 85.453 ms\n(4 rows)\n Limit (actual rows=20 loops=1)\n   ->  Index Scan Backward using posts_pkey on posts (actual rows=20 loops=1)\n         Index Cond: (id < 1000000)\n Execution Time: 0.446 ms\n(5 rows)\n Limit (actual rows=20 loops=1)\n   ->  Index Scan Backward using posts_pkey on posts (actual rows=20 loops=1)\n         Index Cond: (id < 990000)\n Execution Time: 0.017 ms\n(5 rows)\n Limit (actual rows=20 loops=1)\n   ->  Index Scan Backward using posts_pkey on posts (actual rows=20 loops=1)\n         Index Cond: (id < 900000)\n Execution Time: 0.032 ms\n(5 rows)\n Limit (actual rows=20 loops=1)\n   ->  Index Scan Backward using posts_pkey on posts (actual rows=20 loops=1)\n         Index Cond: (id < 100000)\n Execution Time: 0.015 ms\n(5 rows)\n",
 "demo/out/p5-3/trang.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c53 npx tsx p5/53/trang.mts\n[orderBy nulls last] SELECT … FROM \"posts\" WHERE 1=1 ORDER BY \"featured\" DESC, \"published_at\"DESC NULLS LAST, \"id\" DESC LIMIT $1 OFFSET $2 \"[1,0]\"\n[orderBy relation] SELECT … FROM \"posts\" LEFT JOIN \"users\" AS \"orderby_1\" ON (\"orderby_1\".\"id\") = (\"author_id\") WHERE 1=1 ORDER BY \"orderby_1\".\"username\" ASC LIMIT $1 OFFSET $2 \"[1,0]\"\n[orderBy _count] SELECT … FROM \"posts\" LEFT JOIN (SELECT \"post_id\", COUNT(*) AS \"orderby_aggregator\" FROM \"comments\" WHERE 1=1 GROUP BY \"post_id\") AS \"orderby_1_Comment\" ON (\"id\" = \"orderby_1_Comment\".\"post_id\") WHERE 1=1 ORDER BY COALESCE(\"orderby_1_Comment\".\"orderby_aggregator\", $1) DESC LIMIT $2 OFFSET $3 \"[0,1,0]\"\norderBy publishedAt desc, first row → {\"id\":1000000,\"publishedAt\":null} (NULLs come first in DESC)\noffset skip 0:         9.1 ms\noffset skip 10000:     8.2 ms\noffset skip 100000:    19.0 ms\noffset skip 900000:    74.2 ms\ncursor id 1000000:     2.8 ms\ncursor id 990000:      5.4 ms\ncursor id 900000:      3.9 ms\ncursor id 100000:      2.5 ms\n[cursor] SELECT … FROM \"posts\" WHERE (\"published\" = $1 AND \"id\" <= (SELECT \"id\" FROM \"posts\" WHERE (\"id\") = ($2))) ORDER BY \"id\" DESC LIMIT $3 OFFSET $4 \"[true,900000,20,1]\"\n3 rows inserted between page 1 and page 2:\n  offset page 2 repeats [999983,999982,999981] · cursor page 2 repeats [] · cursor without skip:1 repeats [999981]\ntake: size + 1 → 21 rows ⇒ hasMore = true\n"
};
const fs = { readFileSync: (p) => { const k = String(p); if (!(k in DU_LIEU)) throw new Error('thiếu dữ liệu đóng băng: ' + k); return DU_LIEU[k]; } };
import { lamDeck, prs, ts, tp, sql, two, box, cards, c, tbl, steps } from './_pr-chung.mjs';

export const deck = { key: 'pr-05-3', code: 'PR 5.3', title: 'Ordering, and pagination that survives', sub: 'Chapter 5 · Lesson 5.3' };

const DEMO = 'demo';
const OUT = (t) => fs.readFileSync(`${DEMO}/out/p5-3/${t}.txt`, 'utf8').replace(/\n+$/, '');
const lay = (...nhan) => OUT('trang').split('\n').filter((l) => nhan.some((n) => l.startsWith(`[${n}]`) || l.startsWith(n))).map((l) => l.replace(/ "\[.*\]"$/, '')).join('\n');
// bảng gọn từ 8 EXPLAIN: 4 offset + 4 con trỏ
const EX = OUT('offset').split('\n');
const thoiGian = EX.filter((l) => /Execution Time/.test(l)).map((l) => l.match(/([\d.]+) ms/)[1]);
const docHang = EX.filter((l) => /Index Scan/.test(l)).map((l) => l.match(/actual rows=(\d+)/)[1]);

export const slides = lamDeck({ chuong: 'Chapter 5 — Querying in depth', bai: '5.3' }, [
  /* 1 */ { cover: true, nhan: 'Chapter 5 · Lesson 5.3', t: 'Ordering, and<br>pagination that survives', sub: 'skip walks past every row it skips — a cursor jumps straight there' },
  /* 2 */ { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li><code>orderBy</code> in full: arrays, relations, counts, NULLs</li>
    <li>Offset pagination on a million rows — measured</li>
    <li>Cursor pagination, and why it does not slow down</li>
    <li>Drift: rows that repeat or vanish between pages</li>
    <li>The response shape, and <code>take: size + 1</code></li></ul>` },
  /* 3 */ { t: 'orderBy, in full', body: ts(`orderBy: [{ featured: 'desc' }, { publishedAt: { sort: 'desc', nulls: 'last' } }, { id: 'desc' }]
orderBy: { author: { username: 'asc' } }        // through a to-one relation
orderBy: { comments: { _count: 'desc' } }       // by the size of a to-many`, { sm: true }) +
    tp(lay('orderBy nulls last', 'orderBy relation', 'orderBy _count').replace(/ORDER BY COALESCE.*$/m, 'ORDER BY COALESCE(…"orderby_aggregator", 0) DESC …'), { wrap: 130, fs: 12, title: 'query log' }) +
    cards([
      ['An array for several keys', 'Object key order is not part of the API contract.'],
      ['End with a unique tiebreaker', 'Equal timestamps have no defined order without <code>id</code>.'],
      ['_count ordering = join + group', 'No plain index helps. A hot path wants a counter column.'],
    ], 3) },
  /* 4 */ { t: 'NULLs come first in a DESC sort', body: ts(`await prisma.post.findMany({ orderBy: { publishedAt: 'desc' }, take: 1 });                          // NULLs first
await prisma.post.findMany({ orderBy: [{ publishedAt: { sort: 'desc', nulls: 'last' } }, { id: 'desc' }], take: 1 });`, { sm: true }) +
    tp(lay('orderBy publishedAt desc'), { wrap: 76, fs: 20 }) +
    cards([
      ['ASC', 'NULLs last by default.'],
      ['DESC', 'NULLs first by default — the surprise.'],
      ['Explicit', '<code>{ sort, nulls }</code> — and an index declared the same way.'],
    ], 3) +
    box('PostgreSQL puts NULLs first for DESC, last for ASC', '"Newest first" without <code>nulls: \'last\'</code> shows the undated drafts on top of page one. Say what you mean: <code>{ sort: \'desc\', nulls: \'last\' }</code>.', 'lam') },
  /* 5 */ { t: 'Offset pagination', body: ts(`await prisma.post.findMany({
  orderBy: [{ publishedAt: 'desc' }, { id: 'desc' }],
  skip: (page - 1) * 20, take: 20,
});   // ORDER BY … LIMIT $ OFFSET $`, { sm: true }) +
    tbl(['OFFSET', 'rows the index scan reads', 'Execution Time'], [0, 10000, 100000, 900000].map((o, i) => [o.toLocaleString('en-US'), Number(docHang[i]).toLocaleString('en-US'), thoiGian[i] + ' ms']), { cap: 'EXPLAIN ANALYZE on 1,000,000 posts, index on (published_at DESC, id DESC)' }) +
    box('Linear, and no index fixes it', 'The index is used perfectly. It is the algorithm: <code>OFFSET 900000</code> means walking 900,020 index entries and discarding all but twenty.', 'do2') },
  /* 6 */ { t: 'Cursor pagination', body: ts(`const page = await prisma.post.findMany({
  orderBy: { id: 'desc' }, take: 20,
  ...(cursor && { cursor: { id: cursor }, skip: 1 }),   // skip the cursor row itself
});`, { sm: true }) + tp(lay('cursor'), { wrap: 130, fs: 13, title: 'what Prisma sends' }) +
    tbl(['after id', 'rows read', 'Execution Time'], [1000000, 990000, 900000, 100000].map((o, i) => [o.toLocaleString('en-US'), docHang[4 + i], thoiGian[4 + i] + ' ms']), { cap: 'the same seek, at any depth (EXPLAIN ANALYZE, WHERE id < … ORDER BY id DESC LIMIT 20)' }) },
  /* 7 */ { t: 'Measured through Prisma', body: tp(lay('offset skip', 'cursor id'), { wrap: 100, fs: 18, title: 'one findMany each, wall-clock in Node' }) +
    box('Flat for the cursor, climbing for the offset', 'Including Node and the driver, page 45,000 by offset costs many times page one; by cursor it costs the same as page one.', 'xanh') },
  /* 8 */ { t: 'The other failure: drift', body: ts(`const p1 = await prisma.post.findMany({ orderBy: { id: 'desc' }, take: 20 });
// … three new posts are inserted at the top …
await prisma.post.findMany({ orderBy: { id: 'desc' }, skip: 20, take: 20 });                        // offset
await prisma.post.findMany({ orderBy: { id: 'desc' }, cursor: { id: p1[19].id }, skip: 1, take: 20 }); // cursor`, { sm: true }) +
    tp(lay('3 rows inserted', '  offset page 2'), { wrap: 96, fs: 15 }) +
    cards([
      ['Offset repeats rows', 'Three new posts pushed everything down: page 2 started with three rows the user had already seen.'],
      ['A cursor names a row', 'Page 2 continued exactly after the last row of page 1 — nothing repeated, nothing skipped.'],
      ['skip: 1 is required', 'Without it the cursor row itself comes back: one duplicate at every page boundary.'],
    ], 3) },
  /* 9 */ { t: 'Choosing the cursor key', body: ts(`// WRONG — publishedAt is not unique; rows sharing a timestamp are lost or repeated
orderBy: { publishedAt: 'desc' }
// RIGHT — order by (timestamp, id); cursor on the unique id
orderBy: [{ publishedAt: 'desc' }, { id: 'desc' }], cursor: { id: lastSeenId }, skip: 1
// Compound condition by hand, when you page by timestamp
where: { OR: [{ publishedAt: { lt: lastAt } }, { publishedAt: lastAt, id: { lt: lastId } }] }`, { sm: true }) +
    cards([
      ['Timestamp only', 'Two posts share 10:00:00; the cursor lands on one and the other is skipped or repeated.'],
      ['(timestamp, id)', 'The ordering is total, the cursor names exactly one row, and nothing is lost.'],
    ], 2) +
    box('The cursor field must be unique, and the ordering must end with it', 'Prisma\'s <code>cursor</code> only accepts a unique field. In this table published_at repeats in pairs — exactly the data where a timestamp-only cursor loses rows.', 'do2') },
  /* 10 */ { t: 'Choosing — and what to send the client', body: tbl(['Use', 'For', 'Why'], [
      ['cursor', 'infinite scroll, feed, chat, log', 'constant time; no drift; no page numbers needed'],
      ['offset', 'admin table, report, export', '"page 40" is a real action; the row count is bounded'],
      ['both', 'one API, two screens', 'they are query strategies, not architecture'],
    ]) + ts(`const rows = await prisma.post.findMany({ take: size + 1, /* … */ });
const hasMore = rows.length > size;  if (hasMore) rows.pop();
res.json({ rows, nextCursor: hasMore ? rows.at(-1).id : null, hasMore });`, { sm: true }) +
    tp(lay('take: size + 1'), { wrap: 100, fs: 16 }) },
  /* 11 */ { t: 'Do not send a total with a cursor', body: cards([
      ['A COUNT is a scan', 'Counting a million rows on every page load throws away the constant time you just bought.'],
      ['If the UI wants a number', 'Read the planner estimate from <code>pg_class.reltuples</code> — free, and close enough for "about a million".'],
      ['hasMore needs no count', 'Ask for one row more than you show. The extra row, if it exists, is the answer.'],
    ], 3) },
  /* 12 */ { t: 'Your turn — and what to keep', body: two(steps([
      `EXPLAIN ${c('OFFSET')} 0, 10,000 and 900,000 on a big table`,
      `Rewrite the endpoint with ${c('cursor')} + ${c('skip: 1')}`,
      `Insert three rows between two pages; compare both strategies`,
      `Return ${c('nextCursor')} and ${c('hasMore')} with ${c('take: size + 1')}`,
    ]), box('Keep these', `<ul><li>Order by an array, end with ${c('id')}</li><li>DESC puts NULLs first — say ${c("nulls: 'last'")}</li><li>Offset grows linearly; cursor is flat</li><li>Cursor ⇒ ${c('skip: 1')}, no total</li></ul>`, 'lam'), '') },
]);
