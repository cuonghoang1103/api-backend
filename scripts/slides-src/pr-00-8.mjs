/**
 * pr-00-8 — Prisma ORM · Section 0 · Start here (1/2) "What Prisma is, what you will be able to do, and the road ahead" (deck video, 11/11/2026).
 * Bài web: pr-0-8-bat-dau-tai-day (prisma-orm/s00/bat-dau-1.mjs — thêm 11/11, chờ deploy). Tập prisma-0-8.
 * Output THẬT: demo/out/p0-1/*.txt (lược đồ 18 dòng, generate, log SQL — Node 26.8.1 · Prisma 6.19.3 · PostgreSQL 16.14)
 *              demo/out/p0-8/*.txt (npm view @prisma/client time; đếm model/migration CuongThai @27318b94b).
 */
/* Output chạy THẬT, đóng băng từ thư mục demo của khoá video Prisma (12/11/2026) — deck tự chứa, không đọc tệp ngoài repo. */
const DU_LIEU = {
 "demo/lab/prisma/schema.prisma": "generator client {\n  provider = \"prisma-client-js\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n  url      = env(\"DATABASE_URL\")\n}\n\nmodel User {\n  id        Int       @id @default(autoincrement())\n  fullName  String?   @map(\"full_name\")\n  email     String    @unique\n  createdAt DateTime  @default(now()) @map(\"created_at\") @db.Timestamptz\n  deletedAt DateTime? @map(\"deleted_at\") @db.Timestamptz\n\n  @@map(\"users\")\n}\n",
 "demo/out/p0-1/generate.txt": "$ npx prisma generate\nEnvironment variables loaded from .env\nPrisma schema loaded from prisma/schema.prisma\n\n✔ Generated Prisma Client (v6.19.3) to ./node_modules/@prisma/client in 37ms\n\nStart by importing your Prisma Client (See: https://pris.ly/d/importing-client)\n\nTip: Need your database queries to be 1000x faster? Accelerate offers you that and more: https://pris.ly/tip-2-accelerate\n\n",
 "demo/out/p0-1/dts-lines.txt": "$ wc -l node_modules/.prisma/client/index.d.ts\n    2491 node_modules/.prisma/client/index.d.ts\n$ wc -l prisma/schema.prisma\n      18 prisma/schema.prisma\n",
 "demo/out/p0-1/log-sql.txt": "$ npx tsx log-sql.ts\nprisma:query SELECT \"public\".\"users\".\"id\", \"public\".\"users\".\"full_name\", \"public\".\"users\".\"email\", \"public\".\"users\".\"created_at\" FROM \"public\".\"users\" WHERE (\"public\".\"users\".\"email\" = $1 AND 1=1) LIMIT $2 OFFSET $3\n{\n  id: 42,\n  fullName: 'Nguyen Van An',\n  email: 'an@example.com',\n  createdAt: 2026-03-14T09:12:44.318Z\n}\n",
 "demo/out/p0-8/npm-time.txt": "$ npm view @prisma/client time --json | grep -E '\"(2\\.0\\.0|2\\.19\\.0|3\\.0\\.1|4\\.0\\.0|5\\.0\\.0|6\\.0\\.0|6\\.19\\.3|7\\.0\\.0)\":'\n  \"2.0.0\": \"2020-06-09T08:16:55.982Z\",\n  \"2.19.0\": \"2021-03-16T15:24:35.968Z\",\n  \"3.0.1\": \"2021-09-07T15:02:19.196Z\",\n  \"4.0.0\": \"2022-06-28T13:07:31.760Z\",\n  \"5.0.0\": \"2023-07-11T16:25:53.061Z\",\n  \"6.0.0\": \"2024-11-28T18:29:13.892Z\",\n  \"7.0.0\": \"2025-11-19T12:05:45.941Z\",\n  \"6.19.3\": \"2026-04-01T11:20:07.235Z\",\n",
 "demo/out/p0-8/cuongthai.txt": "$ grep -c '^model ' ~/Downloads/api-backend/prisma/schema.prisma\n611\n$ ls ~/Downloads/api-backend/prisma/migrations | grep -c '^[0-9]'\n246\n"
};
const fs = { readFileSync: (p) => { const k = String(p); if (!(k in DU_LIEU)) throw new Error('thiếu dữ liệu đóng băng: ' + k); return DU_LIEU[k]; } };
import { lamDeck, ts, prs, tp, two, box, cards, c, tbl, steps, flow } from './_pr-chung.mjs';

export const deck = { key: 'pr-00-8', code: 'PR 0.S1', title: 'What Prisma is', sub: 'Start here (1/2)' };

const DEMO = 'demo';
const OUT = (tap, t) => fs.readFileSync(`${DEMO}/out/${tap}/${t}.txt`, 'utf8').replace(/\n+$/, '');
const SRC = (t) => fs.readFileSync(`${DEMO}/lab/${t}`, 'utf8').replace(/\n+$/, '');
const gon = (s) => s.split('\n').filter((l) => l.trim() && !/^(Tip:|Start by importing|Environment variables)/.test(l)).join('\n');

/** Dòng thời gian (chép dáng từ deck ts-00-8). items [[ngày, phiên bản, dòng phụ]]. */
const timeline = (items, { w = 1110, h = 250, mau = '#0d9488' } = {}) => {
  const n = items.length, gap = (w - 300) / (n - 1), y = 125;
  let s = `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial">`;
  s += `<line x1="30" y1="${y}" x2="${w - 30}" y2="${y}" stroke="#bfbfbf" stroke-width="5" stroke-linecap="round"/>`;
  items.forEach(([ngay, t, sub], i) => {
    const x = 150 + i * gap, up = i % 2 === 0;
    s += `<circle cx="${x}" cy="${y}" r="12" fill="${mau}" stroke="#fff" stroke-width="4"/>`;
    s += `<text x="${x}" y="${up ? y - 28 : y + 48}" text-anchor="middle" font-size="24" font-weight="800" fill="#b85a2b">${t}</text>`;
    const ty = up ? y - 90 : y + 80;
    s += `<text x="${x}" y="${ty}" text-anchor="middle" font-size="18" font-weight="700" fill="#262626">${ngay}</text>`;
    if (sub) s += `<text x="${x}" y="${ty + 24}" text-anchor="middle" font-size="16" fill="#666">${sub}</text>`;
  });
  return s + '</svg>';
};

const q = `const prisma = new PrismaClient({ log: ['query'] });
const user = await prisma.user.findUnique({
  where: { email: 'an@example.com' },
  select: { id: true, fullName: true, email: true, createdAt: true },
});
console.log(user);`;

export const slides = lamDeck({ chuong: 'Section 0 — Start here', bai: 'Start here 1/2' }, [
  /* 1 */ { cover: true, nhan: 'Section 0 · Start here (1/2)', t: 'What Prisma is,<br>and what you will be able to do', sub: 'One schema file → a typed client, SQL migrations and a window on your data — and the road through thirteen sections' },
  /* 2 */ { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>What Prisma is — in three everyday pictures, then one sentence</li>
    <li>One 18-line schema, run for real: what <code>generate</code> writes and the SQL it sends</li>
    <li>The words people mix up: Prisma, Client, CLI, engine, Migrate, Studio</li>
    <li>Where it came from: 2020 → 2025, dates you can check on npm</li>
    <li>Why it exists — and what it gives <b>you</b></li>
    <li>The road ahead: thirteen sections, four stages, your first ten minutes</li></ul>` },
  /* 3 */ { t: 'Three everyday pictures first', body: cards([
      ['🧑‍💼 The interpreter', 'The database speaks in <b>rows</b>; your program thinks in <b>objects</b>. Somebody always translates. Prisma is a translator <b>generated by a machine</b>, not one you write by hand and forget to update.'],
      ['📐 The blueprint', 'An architect draws once; from that drawing come the building, the materials list and every change order. <code>schema.prisma</code> is the drawing: tables, TypeScript types and migrations all come from it.'],
      ['🧾 The itemised receipt', 'A good shop gives you a receipt you can read line by line. Prisma sends <b>plain SQL</b> and prints every statement when you ask — no black box to trust.'],
    ], 3) },
  /* 4 */ { t: 'Now the definition', to: true, giua: true, body: box('Prisma, in one sentence', 'A toolkit that turns <b>one schema file</b> into a <b>typed database client</b>, the <b>SQL for your migrations</b>, and a <b>window on your data</b>. PostgreSQL stays the source of truth.', 'lam') +
    flow([{ t: 'schema.prisma', s: 'you write it once', mau: '#2d3748' }, { t: 'prisma generate', s: 'Prisma Client + types', mau: '#0d9488' }, { t: 'prisma migrate', s: 'SQL migration files', mau: '#0d9488' }, { t: 'prisma studio', s: 'browse the rows', mau: '#336791' }], { h: 190, fs: 22 }) +
    box('What stays the same', 'Your database still runs plain SQL, still enforces its constraints, and you can still open it with <code>psql</code>.', 'xanh') },
  /* 5 */ { t: 'One schema, run for real', body: two(
      prs(SRC('prisma/schema.prisma'), { sm: true }),
      tp(gon(OUT('p0-1', 'generate')) + '\n' + OUT('p0-1', 'dts-lines'), { wrap: 26 }), 'r73') +
    box('18 lines in → 2,491 lines out', `${c('prisma generate')} wrote 2,491 lines of TypeScript types into ${c('node_modules/.prisma/client')}, for <b>your</b> schema: a misspelled field is a compile error.`, 'xanh') },
  /* 6 */ { t: 'One query, one receipt you can read', body: ts(q, { sm: true, hl: [1] }) + tp(OUT('p0-1', 'log-sql'), { wrap: 104 }) +
    box('Read the receipt', `An ordinary ${c('SELECT')}, exactly the four columns asked for; the column ${c('full_name')} comes back as the field ${c('fullName')}.`, 'lam') },
  /* 7 */ { t: 'Words people mix up', body: tbl(['Word', 'What it really is', 'Course'], [
      ['Prisma (Prisma ORM)', 'the whole open-source toolkit', 'all'],
      ['Prisma schema', '<code>schema.prisma</code>, a small language of its own', 'Ch 2–3'],
      ['Prisma CLI <code>prisma</code>', 'the commands: init, generate, migrate, studio', '0.2, 1.5'],
      ['Prisma Client', '<code>@prisma/client</code>, <b>generated</b> for your schema', '1.2, Ch 4–5'],
      ['Query engine', 'turns calls into SQL: Rust binary (4–6), WASM default (7)', '1.3, 11.1'],
      ['Prisma Migrate', 'schema changes → SQL migration files', 'Ch 6'],
      ['Prisma Studio', 'local browser to see and edit rows', '0.3'],
      ['Accelerate, Prisma Postgres', 'paid cloud products — not used here', '—'],
    ], { cap: 'Keep this table next to you for the first week' }) },
  /* 8 */ { t: 'Where it came from — dates you can check', body: timeline([
      ['9 Jun 2020', '2.0.0', 'schema + generated client'], ['16 Mar 2021', '2.19.0', 'Migrate ready for production'],
      ['7 Sep 2021', '3.0.1', ''], ['28 Jun 2022', '4.0.0', ''], ['11 Jul 2023', '5.0.0', ''],
      ['28 Nov 2024', '6.0.0', 'this course: 6.19.3'], ['19 Nov 2025', '7.0.0', 'prisma.config.ts, WASM engine'],
    ]) + tp(OUT('p0-8', 'npm-time'), { wrap: 110, fs: 13, title: 'terminal — npm registry, read 11 Nov 2026' }) },
  /* 9 */ { t: 'Why it exists', body: cards([
      ['🐘 What the database has', 'the real tables, columns and constraints'],
      ['🧠 What your code believes', 'interfaces and column names written by hand, in strings nobody checks'],
      ['📜 How you got here', '<code>ALTER TABLE</code> scripts that get lost between laptops'],
    ], 3) + box('Prisma’s answer', 'One file drives all three, and the client’s types are <b>regenerated</b> every time that file changes. Writing SQL was never the hard part — keeping these three in agreement is.', 'lam') },
  /* 10 */ { t: 'What it gives you', body: cards([
      ['🧑‍🎓 Group projects', 'The schema is a document the whole team reviews. A renamed column turns old queries red on the next build — not on demo day.'],
      ['🧑‍💻 Your first job', 'A common data layer in Node.js and Next.js. You will be asked: “what SQL does this query send?” — Chapters 4, 5, 9.'],
      ['🏗️ This website', 'CuongThai runs on Prisma: <b>611 models, 246 migrations</b>. Every incident in the next lesson happened here.'],
    ], 3) + tp(OUT('p0-8', 'cuongthai'), { title: 'terminal — CuongThai repository @27318b94b, 11 Nov 2026' }) },
  /* 11 */ { t: 'The road ahead: thirteen sections, four stages', body: tbl(['Stage', 'Sections', 'You will be able to'], [
      ['1 · Foundations', '0 Setup · 1 What an ORM is · 2 Schema language · 3 Relations', 'write any schema; know what <code>generate</code> writes'],
      ['2 · Using the client', '4 Read &amp; write · 5 Querying deeply', 'read, write, filter, paginate — and read the SQL'],
      ['3 · Keeping data safe', '6 Migrations · 7 Transactions', 'change a live database; avoid races'],
      ['4 · Production', '8 Types · 9 Performance · 10 Raw SQL · 11 Shipping · 12 Diagnosis', 'ship it, measure it, fix it by error code'],
    ], { cap: 'Next lesson: real incidents, and how to study without giving up' }) },
  /* 12 */ { t: 'Your first ten minutes — and what to keep', body: two(steps([
      `Start a throwaway PostgreSQL 16 in Docker (Lesson 0.2)`,
      `${c('npx prisma init')}, paste the 18-line schema, ${c('migrate dev --name init')}`,
      `${c('npx prisma generate')} — count the lines of ${c('index.d.ts')}`,
      `Run the query with ${c("log: ['query']")} and read the SELECT`,
      `Misspell ${c('email')} as ${c('emial')} — watch the compiler refuse`,
    ]), box('Keep these', `<ul><li>Prisma = one schema → client, migrations, studio</li><li>The client is <b>generated</b>, not downloaded</li><li>It sends plain SQL you can read</li><li>Course runs Prisma 6; Prisma 7 mostly moves config</li></ul>`, 'lam'), '') },
]);
