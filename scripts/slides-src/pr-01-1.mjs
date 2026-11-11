/**
 * pr-01-1 — Prisma ORM · Chapter 1 · Lesson 1.1 "The impedance mismatch" (deck video, 12/11/2026). Bài web: pr-1-1-lech-tro-khang. Tập prisma-1-1.
 * Output THẬT: `bash scratchpad/prisma/demo/chay.sh p1-1` (dự án demo/p02/hoc-prisma, 47 tác giả · 200 bài; Prisma 6.19.3 · PostgreSQL 16.14 cùng máy):
 * a === b ⇒ false · N+1 201 câu ≈ 137–226 ms vs include 2 câu ≈ 4–5 ms (máy cục bộ, không có độ trễ mạng; bài web đo qua mạng 4,8 s vs 61 ms —
 * ghi "số đo của khoá") · post.author ⇒ undefined · 4 lược đồ (trải phẳng / bảng riêng / JSON / kế thừa một bảng) đều `prisma validate` hợp lệ.
 */
/* Output chạy THẬT, đóng băng từ thư mục demo của khoá video Prisma (12/11/2026) — deck tự chứa, không đọc tệp ngoài repo. */
const DU_LIEU = {
 "demo/p1/ban-sac.mts": "import { PrismaClient } from '@prisma/client';\nconst prisma = new PrismaClient();\nconst id = (await prisma.user.findFirst({ orderBy: { id: 'asc' } }))!.id;\nconst a = await prisma.user.findUnique({ where: { id } });\nconst b = await prisma.user.findUnique({ where: { id } });\nconsole.log(a === b);\nconsole.log(a!.email === b!.email);\nb!.fullName = 'Doi ten';\nconsole.log(a!.fullName);\nawait prisma.$disconnect();\n",
 "demo/out/p1-1/ban-sac.txt": "$ cd ../p02/hoc-prisma && env -u DATABASE_URL npx tsx src/ban-sac.mts\nfalse\ntrue\nTac Gia 1\n",
 "demo/out/p1-1/undefined.txt": "$ cd ../p02/hoc-prisma && env -u DATABASE_URL npx tsx src/undefined.mts\nundefined\n",
 "demo/p1/n-cong-1.mts": "import { PrismaClient } from '@prisma/client';\nconst prisma = new PrismaClient({ log: [{ emit: 'event', level: 'query' }] });\nlet dem = 0; prisma.$on('query', () => { dem++; });\nawait prisma.user.count(); dem = 0;            // làm nóng kết nối, không tính\n// Bản ngây thơ — 1 câu cho bài viết, rồi mỗi bài 1 câu cho tác giả\nlet t = performance.now();\nconst posts = await prisma.post.findMany({ take: 200 });\nfor (const p of posts) {\n  const author = await prisma.user.findUnique({ where: { id: p.authorId } });\n  void author?.email;\n}\nconsole.log('ngay tho :', dem, 'cau truy van,', Math.round(performance.now() - t), 'ms');\n// Bản Prisma — quan hệ là một phần của yêu cầu\ndem = 0; t = performance.now();\nconst posts2 = await prisma.post.findMany({ take: 200, include: { author: true } });\nfor (const p of posts2) void p.author.email;\nconsole.log('include  :', dem, 'cau truy van,', Math.round(performance.now() - t), 'ms');\nawait prisma.$disconnect();\n",
 "demo/out/p1-1/n-cong-1.txt": "$ cd ../p02/hoc-prisma && env -u DATABASE_URL npx tsx src/n-cong-1.mts\nngay tho : 201 cau truy van, 179 ms\ninclude  : 2 cau truy van, 4 ms\n$ cd ../p02/hoc-prisma && env -u DATABASE_URL npx tsx src/n-cong-1.mts\nngay tho : 201 cau truy van, 137 ms\ninclude  : 2 cau truy van, 4 ms\n",
 "demo/p1/n-cong-1-log.mts": "import { PrismaClient } from '@prisma/client';\nconst prisma = new PrismaClient({ log: ['query'] });\nconst posts = await prisma.post.findMany({ take: 200, include: { author: true } });\nconsole.log(posts.length, 'bai,', new Set(posts.map((p) => p.authorId)).size, 'tac gia');\nawait prisma.$disconnect();\n",
 "demo/out/p1-1/n-cong-1-log.txt": "$ cd ../p02/hoc-prisma && env -u DATABASE_URL npx tsx src/n-cong-1-log.mts\nprisma:query SELECT \"public\".\"posts\".\"id\", \"public\".\"posts\".\"title\", \"public\".\"posts\".\"body\", \"public\".\"posts\".\"published\", \"public\".\"posts\".\"views\", \"public\".\"posts\".\"created_at\", \"public\".\"posts\".\"author_id\" FROM \"public\".\"posts\" WHERE 1=1 ORDER BY \"public\".\"posts\".\"id\" ASC LIMIT $1 OFFSET $2\nprisma:query SELECT \"public\".\"users\".\"id\", \"public\".\"users\".\"email\", \"public\".\"users\".\"full_name\", \"public\".\"users\".\"created_at\" FROM \"public\".\"users\" WHERE \"public\".\"users\".\"id\" IN ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,$35,$36,$37,$38,$39,$40,$41,$42,$43,$44,$45,$46,$47) OFFSET $48\n200 bai, 47 tac gia\n",
 "demo/lab/p11/a-trai-phang.prisma": "datasource db {\n  provider = \"postgresql\"\n  url      = env(\"DATABASE_URL\")\n}\n\n// Cách A — trải phẳng\nmodel User {\n  id            Int     @id @default(autoincrement())\n  email         String  @unique\n  addressStreet String? @map(\"address_street\")\n  addressCity   String? @map(\"address_city\")\n  addressZip    String? @map(\"address_zip\")\n}\n",
 "demo/lab/p11/c-json.prisma": "datasource db {\n  provider = \"postgresql\"\n  url      = env(\"DATABASE_URL\")\n}\n\n// Cách C — JSON\nmodel User {\n  id      Int    @id @default(autoincrement())\n  email   String @unique\n  address Json?\n}\n",
 "demo/lab/p11/b-bang-rieng.prisma": "datasource db {\n  provider = \"postgresql\"\n  url      = env(\"DATABASE_URL\")\n}\n\n// Cách B — bảng riêng\nmodel User {\n  id      Int      @id @default(autoincrement())\n  email   String   @unique\n  address Address?\n}\n\nmodel Address {\n  id     Int    @id @default(autoincrement())\n  street String\n  city   String\n  userId Int    @unique @map(\"user_id\")\n  user   User   @relation(fields: [userId], references: [id])\n}\n",
 "demo/out/p1-1/validate-11.txt": "$ for f in p11/a-trai-phang p11/b-bang-rieng p11/c-json p11/ke-thua; do npx prisma validate --schema $f.prisma 2>&1 | grep -E \"valid|Error\"; done\nThe schema at p11/a-trai-phang.prisma is valid 🚀\nThe schema at p11/b-bang-rieng.prisma is valid 🚀\nThe schema at p11/c-json.prisma is valid 🚀\nThe schema at p11/ke-thua.prisma is valid 🚀\n",
 "demo/lab/p11/ke-thua.prisma": "datasource db {\n  provider = \"postgresql\"\n  url      = env(\"DATABASE_URL\")\n}\n\n// Kế thừa một bảng: một bảng, một enum phân biệt, các trường riêng cho phép null\nenum ContentType {\n  VLOG\n  ARTICLE\n  CODE_REVIEW\n}\n\nmodel Content {\n  id       Int         @id @default(autoincrement())\n  type     ContentType\n  title    String\n  // chỉ có nghĩa khi type = VLOG\n  videoUrl String?     @map(\"video_url\")\n  duration Int?\n  // chỉ có nghĩa khi type = ARTICLE\n  body     String?\n\n  @@map(\"contents\")\n}\n"
};
const fs = { readFileSync: (p) => { const k = String(p); if (!(k in DU_LIEU)) throw new Error('thiếu dữ liệu đóng băng: ' + k); return DU_LIEU[k]; } };
import { lamDeck, ts, prs, tp, two, box, cards, c, tbl, steps } from './_pr-chung.mjs';

export const deck = { key: 'pr-01-1', code: 'PR 1.1', title: 'The impedance mismatch', sub: 'Chapter 1 · Lesson 1.1' };

const DEMO = 'demo';
const OUT = (t) => fs.readFileSync(`${DEMO}/out/p1-1/${t}.txt`, 'utf8').replace(/\n+$/, '');
const SRC = (t) => fs.readFileSync(`${DEMO}/${t}`, 'utf8').replace(/\n+$/, '');
const gon = (s) => s.replace(/^\$ cd \.\.\/p02\/hoc-prisma && env -u DATABASE_URL /gm, '$ ');
const than = (f) => SRC(`lab/p11/${f}.prisma`).split('\n').slice(5).join('\n');   // bỏ khối datasource
const cat = (s, n) => s.split('\n').map((l) => (l.length > n ? l.slice(0, n) + ' …' : l)).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 1 — What an ORM actually is', bai: '1.1' }, [
  /* 1 */ { cover: true, nhan: 'Chapter 1 · Lesson 1.1', t: 'The impedance mismatch', sub: 'Tables and objects have different shapes — an ORM is a set of decisions about that, not a solution' },
  /* 2 */ { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The four places where rows and objects really disagree</li>
    <li>Identity, run for real — and the decision Prisma made about it</li>
    <li>N+1: 201 queries vs 2, counted by the client itself</li>
    <li>Granularity: flatten, separate table, or JSON — when each is right</li>
    <li>Inheritance: the problem Prisma refuses to solve for you</li></ul>` },
  /* 3 */ { t: 'Four places where it really hurts', body: tbl(['Mismatch', 'In the database', 'In your code'], [
      ['<b>Identity</b>', 'two rows with the same key are one row', 'two objects with the same id are two objects'],
      ['<b>Granularity</b>', 'columns are flat', 'an <code>Address</code> nests inside a <code>User</code>'],
      ['<b>Associations</b>', 'only <code>posts.author_id</code> exists — one side owns it', '<code>user.posts</code> and <code>post.author</code> look symmetric'],
      ['<b>Inheritance</b>', 'no subclasses at all', '<code>Video</code> and <code>Article</code> are both <code>Content</code>'],
    ]) + box('Not a solution — a set of decisions', 'No tool makes tables and objects the same shape. What matters is knowing what Prisma decided, and what it deliberately left to you.', 'lam') },
  /* 4 */ { t: 'Identity, in code', to: true, body: two(ts(SRC('p1/ban-sac.mts').split('\n').slice(3, 9).join('\n'), { sm: true, hl: [4, 6, 7] }), tp(gon(OUT('ban-sac')), { wrap: 40 }), 'r64') +
    box('Two queries, two plain objects', `${c('a === b')} is ${c('false')}; changing ${c('b')} does not touch ${c('a')}. Hibernate or Entity Framework keep an <b>identity map</b> and a <b>unit of work</b> — Prisma deliberately has neither.`, 'lam') +
    box('Why this matters', 'Changing an object never touches the database, and reading twice never gives you “the same” object. Every surprise in Prisma follows from this.', 'xanh') },
  /* 5 */ { t: 'What Prisma chose: no hidden queries', body: cards([
      ['➖ What you lose', 'You cannot edit an object and expect it to save. <code>post.author</code> is <b>undefined</b> unless you asked for it — not a proxy that fetches when touched.'],
      ['➕ What you gain', 'No query you did not write. Nothing happens between two of your statements. The SQL in the log is exactly the SQL you asked for.'],
      ['✅ Why it matters', 'Lazy loading is how N+1 gets written by accident. In Prisma that loop dies with <code>undefined</code> — a much better way to fail.'],
    ], 3) + tp(gon(OUT('undefined')), { title: 'console.log(post.author) — no include' }) },
  /* 6 */ { t: 'N+1: the naive loop, counted', body: ts(SRC('p1/n-cong-1.mts').split('\n').slice(5, 12).join('\n'), { sm: true, hl: [3, 4] }) + tp(gon(OUT('n-cong-1')), { wrap: 100 }) +
    box('201 queries vs 2', 'The client itself counted every statement (a <code>query</code> event listener). One query for the posts, then one per post for its author — 200 more.', 'do2') },
  /* 7 */ { t: 'The Prisma version: the relation is part of the request', body: ts(SRC('p1/n-cong-1-log.mts').split('\n').slice(2, 4).join('\n'), { sm: true }) +
    tp(cat(gon(OUT('n-cong-1-log')).replace(/"public"\./g, ''), 150), { wrap: 120, fs: 13 }) +
    box('Built-in batching', 'Prisma collects every distinct <code>authorId</code>, sends <b>one</b> <code>IN (…)</code> query, and stitches the 200 posts and 47 authors together in memory — the classic dataloader pattern.', 'xanh') },
  /* 8 */ { t: 'How much does it cost?', body: tbl(['Where measured', 'N+1 (201 queries)', 'include (2 queries)'], [
      ['this video — app and PostgreSQL on the <b>same machine</b>', '137–226 ms', '4–5 ms'],
      ['the course lesson — database over a <b>network</b> (course measurement)', '4.8 s', '61 ms'],
    ]) + box('The gap grows with distance', 'Every extra query is one more round trip. On one machine it is cheap; across a network each one costs milliseconds — ×201.', 'lam') +
    box('Trap: include is not always one query', 'Two levels of nesting means three statements — one per level. Prisma 5.7 added <code>relationLoadStrategy: "join"</code>; Chapter 9 measures which wins when.', 'do2') },
  /* 9 */ { t: 'Granularity: where does the address go?', body: two(prs(than('a-trai-phang'), { sm: true }), prs(than('c-json'), { sm: true }), '') + prs(than('b-bang-rieng'), { sm: true }) },
  /* 10 */ { t: 'Granularity: which one, when', body: tbl(['Option', 'Right when', 'Wrong when'], [['A · flatten', 'one instance, and you filter by it — <code>WHERE address_city = …</code> can use an index', 'the prefixed fields pass about six'], ['B · own table', 'it has a life of its own: created, versioned or shared separately', 'you mind a join on every read'], ['C · JSON', 'truly schemaless data: settings, a webhook payload, a snapshot', 'anything you filter or join — and Prisma gives no types inside (Chapter 2)']]) +
    tp(OUT('validate-11').split('\n').slice(1).join('\n'), { title: 'npx prisma validate — every schema on these slides' }) },
  /* 11 */ { t: 'Inheritance: the problem Prisma refuses to solve', body: two(prs(than('ke-thua').split('\n').slice(1).filter((l) => l.trim()).join('\n'), { sm: true, hl: [5, 8, 9, 10, 11, 12] }), 
      box('The price', 'Subtype columns must be <b>nullable</b> ⇒ “a VLOG has a videoUrl” moves from the database into your code.', 'lam') +
      box('The other way', 'One table per type keeps constraints, but a unified timeline becomes a <code>UNION</code>. You choose, and write down why.', ''), 'r64') },
  /* 12 */ { t: 'So what is the ORM actually doing?', body: two(steps([
      '<b>Map names and types</b> — <code>full_name TEXT NULL</code> ↔ <code>fullName: string | null</code>',
      '<b>Generate SQL from a description</b> — no string-built WHERE, so no injection hole',
      '<b>Reassemble relations into shape</b> — flat rows → nested objects, batched',
      '<b>Keep schema and code in step</b> — one file for types and migrations',
    ]), box('What it does NOT do', '<ul><li>choose your indexes</li><li>decide your inheritance strategy</li><li>stop you loading a million rows</li><li>make your JOIN fast</li></ul>Those are database problems, solved with database knowledge.', 'do2'), 'r64') },
  /* 13 */ { t: 'Your turn — and what to keep', body: two(steps([
      `Seed 47 users and 200 posts; run the naive loop with a query counter`,
      `Rewrite it with ${c('include')}; compare the count and the log`,
      `Print ${c('post.author')} without include — read ${c('undefined')}`,
      `Write the three address schemas; ${c('prisma validate')} each`,
    ]), box('Keep these', `<ul><li>Four mismatches: identity, granularity, associations, inheritance</li><li>Prisma: no identity map, no lazy loading — no hidden queries</li><li>N+1 = one query per row; ${c('include')} batches it</li><li>Inheritance and granularity are <b>your</b> decisions</li></ul>`, 'lam'), '') },
]);
