/**
 * pr-05-1 — Prisma ORM · Chapter 5 · Lesson 5.1 "Every filter operator" (deck video, 12/11/2026). Bài web: pr-5-1-toan-tu-loc.
 * Output THẬT (`chay.sh p5-1`, demo/lab/p5 + p5/51, CSDL c51: 400 user + 400.000 post, Prisma 6.19.3 · PostgreSQL 16.14): published true/false/null =
 * 171.429/171.429/57.142, { not: true } = 171.429 (mất hàng NULL) · contains = "title"::text LIKE, insensitive = ILIKE; contains 'prisma' phân biệt hoa thường ⇒ 0,
 * insensitive ⇒ 80 · ILIKE '%prisma%': Parallel Seq Scan 75,9 ms ⇒ GIN trigram 0,19 ms · LIKE 'Huong%': B-tree thường (en_US.utf8) ⇒ Seq Scan;
 * text_pattern_ops ⇒ Index Scan · in [] ⇒ WHERE 1=0 · notIn [1] loại 133.333 hàng NULL · has/hasEvery ⇒ @>, hasSome ⇒ &&, isEmpty ⇒ = '{}' ·
 * JSON path ⇒ #> · findUnique({ id: undefined }) ⇒ PrismaClientValidationError.
 */
/* Output chạy THẬT, đóng băng từ thư mục demo của khoá video Prisma (12/11/2026) — deck tự chứa, không đọc tệp ngoài repo. */
const DU_LIEU = {
 "demo/out/p5-1/loc.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c51 npx tsx p5/51/loc.mts\npublished true / false / null: 171429 / 171429 / 57142\n[not: true] SELECT … FROM (SELECT \"id\" FROM \"posts\" WHERE \"published\" <> $1 OFFSET $2) AS \"sub\" [true,0]\n{ not: true } → 171429 rows (the null ones are gone)\n{ OR: [false, null] } → 228571\n[gte/lte] SELECT … FROM \"posts\" WHERE (\"views\" >= $1 AND \"views\" <= $2) ORDER BY \"id\" ASC LIMIT $3 OFFSET $4 [100,500,1,0]\n[contains] SELECT … FROM \"posts\" WHERE \"title\"::text LIKE $1 ORDER BY \"id\" ASC LIMIT $2 OFFSET $3 [\"%prisma%\",1,0]\n[startsWith] SELECT … FROM \"posts\" WHERE \"title\"::text LIKE $1 ORDER BY \"id\" ASC LIMIT $2 OFFSET $3 [\"Huong%\",1,0]\n[endsWith] SELECT … FROM \"posts\" WHERE \"title\"::text LIKE $1 ORDER BY \"id\" ASC LIMIT $2 OFFSET $3 [\"%.md\",1,0]\n[insensitive] SELECT … FROM \"posts\" WHERE \"title\" ILIKE $1 ORDER BY \"id\" ASC LIMIT $2 OFFSET $3 [\"%prisma%\",1,0]\ncontains \"prisma\" (case-sensitive) → 0 · insensitive → 80\n[in] SELECT … FROM \"posts\" WHERE \"id\" IN ($1,$2,$3) OFFSET $4 [1,2,3,0]\n[in []] SELECT … FROM \"posts\" WHERE 1=0 OFFSET $1 [0]\nin [] → 0 rows\ncategoryId notIn [1] → 266667 · categoryId null → 133333 · total 400000\n[has] SELECT … FROM \"posts\" WHERE \"labels\" @> $1 ORDER BY \"id\" ASC LIMIT $2 OFFSET $3 [[\"prisma\"],1,0]\n[hasEvery] SELECT … FROM \"posts\" WHERE \"labels\" @> $1 ORDER BY \"id\" ASC LIMIT $2 OFFSET $3 [[\"a\",\"b\"],1,0]\n[hasSome] SELECT … FROM \"posts\" WHERE \"labels\" && $1 ORDER BY \"id\" ASC LIMIT $2 OFFSET $3 [[\"a\",\"b\"],1,0]\n[isEmpty] SELECT … FROM \"posts\" WHERE \"labels\" = '{}' ORDER BY \"id\" ASC LIMIT $1 OFFSET $2 [1,0]\n[json path] SELECT … FROM \"users\" WHERE (\"settings\"#>ARRAY[$1]::text[])::jsonb::jsonb = $2 ORDER BY \"id\" ASC LIMIT $3 OFFSET $4 [\"theme\",\"toi\",1,0]\nusers with theme \"toi\" → 100\n[AND/OR/NOT] SELECT … FROM \"posts\" WHERE (\"published\" = $1 AND (\"views\" > $2 OR \"featured\" = $3) AND (NOT \"author_id\" IN ($4,$5))) ORDER BY \"id\" ASC LIMIT $6 OFFSET $7 [true,1000,true,7,9,1,0]\n[undefined in findMany] SELECT … FROM \"posts\" WHERE 1=1 ORDER BY \"id\" ASC LIMIT $1 OFFSET $2 [1,0]\n[findUnique id undefined] PrismaClientValidationError: Argument `where` of type PostWhereUniqueInput needs at least one of `id` arguments. Available options are marked with ?.\n",
 "demo/out/p5-1/trgm.txt": "$ docker exec -i prisma-pg psql -U student -d c51 < p5/51/trgm.sql\nTiming is off.\n  rows  \n--------\n 400000\n(1 row)\n\n                                  QUERY PLAN                                  \n------------------------------------------------------------------------------\n Gather (actual time=0.136..75.901 rows=80 loops=1)\n   Workers Planned: 2\n   Workers Launched: 2\n   ->  Parallel Seq Scan on posts (actual time=1.259..71.748 rows=27 loops=3)\n         Filter: (title ~~* '%prisma%'::text)\n         Rows Removed by Filter: 133307\n Planning Time: 0.216 ms\n Execution Time: 75.930 ms\n(8 rows)\n\nCREATE EXTENSION\nTiming is on.\nCREATE INDEX\nTime: 1934.727 ms (00:01.935)\nTiming is off.\nANALYZE\n                                         QUERY PLAN                                         \n--------------------------------------------------------------------------------------------\n Bitmap Heap Scan on posts (actual time=0.051..0.172 rows=80 loops=1)\n   Recheck Cond: (title ~~* '%prisma%'::text)\n   Heap Blocks: exact=51\n   ->  Bitmap Index Scan on posts_title_trgm_idx (actual time=0.041..0.041 rows=80 loops=1)\n         Index Cond: (title ~~* '%prisma%'::text)\n Planning Time: 0.173 ms\n Execution Time: 0.188 ms\n(7 rows)\n\n",
 "demo/out/p5-1/tiento.txt": "$ docker exec -i prisma-pg psql -U student -d c51 < p5/51/tiento.sql\nDROP INDEX\nDROP INDEX\nDROP INDEX\n datcollate \n------------\n en_US.utf8\n(1 row)\n\nCREATE INDEX\nANALYZE\n                QUERY PLAN                 \n-------------------------------------------\n Gather\n   Workers Planned: 2\n   ->  Parallel Seq Scan on posts\n         Filter: (title ~~ 'Huong%'::text)\n(4 rows)\n\nCREATE INDEX\nANALYZE\n                                QUERY PLAN                                \n--------------------------------------------------------------------------\n Index Scan using posts_title_pattern on posts\n   Index Cond: ((title ~>=~ 'Huong'::text) AND (title ~<~ 'Huonh'::text))\n   Filter: (title ~~ 'Huong%'::text)\n(3 rows)\n\n"
};
const fs = { readFileSync: (p) => { const k = String(p); if (!(k in DU_LIEU)) throw new Error('thiếu dữ liệu đóng băng: ' + k); return DU_LIEU[k]; } };
import { lamDeck, prs, ts, tp, sql, two, box, cards, c, tbl, steps } from './_pr-chung.mjs';

export const deck = { key: 'pr-05-1', code: 'PR 5.1', title: 'Every filter operator', sub: 'Chapter 5 · Lesson 5.1' };

const DEMO = 'demo';
const OUT = (t) => fs.readFileSync(`${DEMO}/out/p5-1/${t}.txt`, 'utf8').replace(/\n+$/, '');
const gon = (s) => s.replace(/^\$ DATABASE_URL=\S+ /gm, '$ ').replace(/^\$ docker exec -i prisma-pg psql -U student -d c51 /gm, '$ psql ').split('\n').filter((l) => !/^\s*$/.test(l)).join('\n');
const lay = (...nhan) => OUT('loc').split('\n').filter((l) => nhan.some((n) => l.startsWith(`[${n}]`) || l.startsWith(n))).map((l) => l.replace(/ ORDER BY "id" ASC LIMIT \$\d+ OFFSET \$\d+/, '')).join('\n');
const ke = (t, re) => gon(OUT(t)).split('\n').filter((l) => re.test(l)).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 5 — Querying in depth', bai: '5.1' }, [
  /* 1 */ { cover: true, nhan: 'Chapter 5 · Lesson 5.1', t: 'Every filter operator', sub: 'Each one with the SQL it becomes — and whether an index can help' },
  /* 2 */ { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Equality, and the NULL that <code>not</code> silently drops</li>
    <li>String operators: which become <code>LIKE</code>, which <code>ILIKE</code>, and which an index can serve</li>
    <li>A trigram index, measured on 400,000 rows</li>
    <li>Lists, arrays and JSON paths — the SQL of each</li>
    <li>Combining conditions, and building a filter from optional parameters</li></ul>` },
  /* 3 */ { t: 'Equality, and the null that is not null', body: ts(`where: { published: true }               // = $1
where: { published: { not: true } }      // <> $1
where: { published: null }               // IS NULL
where: { OR: [{ published: false }, { published: null }] }`, { sm: true }) +
    tp(lay('published true', 'not: true', '{ not: true }', '{ OR:'), { wrap: 120, fs: 16, title: '400,000 posts — published is nullable' }) +
    box('Trap — { not: true } drops every NULL', 'In SQL, <code>NULL &lt;&gt; true</code> is NULL, not TRUE, so those 57,142 rows vanish. If you mean "false or unset", say so with an <code>OR</code>.', 'do2') },
  /* 4 */ { t: 'Comparison — numbers, dates, strings', body: ts(`where: { views: { gte: 100, lte: 500 } }
where: { createdAt: { gte: new Date('2026-01-01') } }`, { sm: true }) + tp(lay('gte/lte'), { wrap: 120, fs: 16 }) +
    cards([
      ['A B-tree serves ranges', '<code>@@index([views])</code> turns <code>views &gt; 100</code> into an index range scan — when the range is selective.'],
      ['Composite order matters', '<code>@@index([published, views])</code>: equality first, range last (Lesson 2.3).'],
      ['Dates are ordered values', 'A date range is a range scan like any other. Watch the time zone (Lesson 2.4).'],
    ], 3) },
  /* 5 */ { t: 'Strings — the SQL of each operator', body: ts(`where: { title: { contains: 'prisma' } }
where: { title: { startsWith: 'Huong' } }
where: { title: { endsWith: '.md' } }
where: { title: { contains: 'prisma', mode: 'insensitive' } }`, { sm: true }) +
    tp(lay('contains', 'startsWith', 'endsWith', 'insensitive', 'contains "prisma"'), { wrap: 120, fs: 15 }) +
    box('contains is case-sensitive', 'Every title says <b>P</b>risma, so <code>contains: \'prisma\'</code> found 0 rows. <code>mode: \'insensitive\'</code> found 80 — it becomes <code>ILIKE</code>.', 'lam') },
  /* 6 */ { t: 'Which of them can use an index?', body: tbl(['Operator', 'SQL', 'Plain B-tree?', 'What helps'], [
      [c('equals / gt / lte / in'), '= &gt; &lt;= IN', '✅ yes', 'an ordinary @@index'],
      [c('startsWith'), "LIKE 'x%'", '⚠️ only with C collation', 'an index with text_pattern_ops'],
      [c('contains / endsWith'), "LIKE '%x%'", '❌ never', 'GIN trigram (pg_trgm)'],
      [c("mode: 'insensitive'"), 'ILIKE', '❌ never', 'GIN trigram, or citext'],
      [c('has / hasEvery / hasSome'), '@&gt; &amp;&amp;', '❌ never', '@@index(..., type: Gin)'],
      [c('JSON path'), '#&gt;', '❌ never', 'a hand-written expression index'],
    ]) },
  /* 7 */ { t: 'The trigram index, measured', body: tp(ke('trgm', /rows|^\s+\d+$|Gather|Seq Scan|Filter|Bitmap|Index Cond|Execution|CREATE INDEX|^Time/), { wrap: 120, fs: 14, title: "ILIKE '%prisma%' on 400,000 rows — before and after" }) +
    box('From a full scan to an index lookup', 'Before: a parallel sequential scan of every row. After two SQL lines — <code>CREATE EXTENSION pg_trgm</code> and a GIN index with <code>gin_trgm_ops</code> — a bitmap index scan. The Prisma query did not change at all.', 'xanh') },
  /* 8 */ { t: 'startsWith, and the collation catch', body: tp(gon(OUT('tiento')).replace(/^\$ .*$/m, '$ psql < tiento.sql').split('\n').filter((l) => !/^DROP|^ANALYZE|^CREATE|^\(|^-+$|QUERY PLAN|Workers/.test(l)).join('\n'), { wrap: 110, fs: 15 }) +
    box("LIKE 'Huong%' needs the right index", 'The database collation is <code>en_US.utf8</code>, so an ordinary B-tree cannot serve a prefix match: sequential scan. An index with <code>text_pattern_ops</code> turns it into an index range scan.', 'lam') },
  /* 9 */ { t: 'Lists and arrays', body: tp(lay('in', 'in []', 'in [] →', 'categoryId notIn', 'has', 'hasEvery', 'hasSome', 'isEmpty'), { wrap: 120, fs: 13, title: 'query log — Prisma 6.19.3' }) +
    cards([
      ['in: [] matches nothing', '<code>WHERE 1=0</code>. Correct — and a classic "zero rows" bug when the list came from an empty <code>.map()</code>.'],
      ['notIn drops NULLs too', '133,333 posts have no category; <code>notIn: [1]</code> left them out. Add the NULL case explicitly.'],
      ['Arrays need GIN', '<code>@&gt;</code> and <code>&amp;&amp;</code> cannot use a B-tree: <code>@@index([labels], type: Gin)</code>.'],
    ], 3) },
  /* 10 */ { t: 'JSON columns', body: ts(`where: { settings: { path: ['theme'], equals: 'toi' } }`, { sm: true }) + tp(lay('json path', 'users with theme'), { wrap: 96, fs: 18 }) +
    sql(`-- Prisma cannot declare an index on a JSON path: write it by hand
CREATE INDEX "users_theme_idx" ON "users" ((settings->>'theme'));
CREATE INDEX "users_settings_gin" ON "users" USING gin (settings jsonb_path_ops);`, { sm: true }) +
    cards([
      ['One path, one B-tree', 'An expression index on <code>settings-&gt;&gt;\'theme\'</code> serves exactly that path.'],
      ['Containment, one GIN', '<code>jsonb_path_ops</code> serves <code>@&gt;</code> queries over the whole document.'],
      ['Three paths?', 'Three indexed JSON paths are three columns in disguise — promote them.'],
    ], 3) },
  /* 11 */ { t: 'Combining conditions — and undefined', body: ts(`where: { AND: [
  { published: true },
  { OR: [{ views: { gt: 1000 } }, { featured: true }] },
  { NOT: { authorId: { in: [7, 9] } } },
] }
where: { authorId: q.author ? Number(q.author) : undefined }      // q.author missing
await prisma.post.findUnique({ where: { id: undefined } })`, { sm: true }) +
    tp(lay('AND/OR/NOT', 'undefined in findMany', 'findUnique id undefined'), { wrap: 104, fs: 15 }) +
    box('undefined means "no filter" — except where it throws', 'In <code>findMany</code> an <code>undefined</code> value is dropped, so the filter silently widens to <code>WHERE 1=1</code>. In <code>findUnique</code> it is a validation error. Build dynamic filters with spread-if and type them as <code>Prisma.PostWhereInput</code>.', 'do2') },
  /* 12 */ { t: 'Your turn — and what to keep', body: two(steps([
      `Count ${c('{ not: true }')} on a nullable column; then the ${c('OR')} version`,
      `EXPLAIN an ${c('ILIKE')} search; add a trigram index; EXPLAIN again`,
      `Filter ${c('notIn')} on a nullable column; count the NULLs`,
      `Pass an undefined filter to findMany and to findUnique`,
    ]), box('Keep these', `<ul><li>${c('not')} / ${c('notIn')} drop NULLs</li><li>${c('contains')} and ILIKE ⇒ trigram index</li><li>${c('startsWith')} ⇒ text_pattern_ops</li><li>undefined widens the filter</li></ul>`, 'lam'), '') },
]);
