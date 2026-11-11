/**
 * pr-00-9 — Prisma ORM · Section 0 · Start here (2/2) "What goes wrong without it, and how to study this course" (deck video, 11/11/2026).
 * Bài web: pr-0-9-bat-dau-tai-day-2 (prisma-orm/s00/bat-dau-2.mjs — thêm 11/11, chờ deploy). Tập prisma-0-9.
 * Sự cố: CHỈ những sự cố CuongThai mà chính khoá đã kể (2.3, 3.1, 6.2–6.3, 8.3, 11.1, 12.4). Tình huống SV ghi rõ "illustration".
 * Output THẬT (demo/out/p0-9): prisma validate thiếu quan hệ ngược ⇒ P1012; enum chép tay trong seed ⇒ tsc xanh, seed chết
 * "Invalid value for argument `type`. Expected ContentType." (Prisma 6.19.3 · PostgreSQL 16.14).
 */
/* Output chạy THẬT, đóng băng từ thư mục demo của khoá video Prisma (12/11/2026) — deck tự chứa, không đọc tệp ngoài repo. */
const DU_LIEU = {
 "demo/lab/p09/thieu-quan-he.prisma": "datasource db {\n  provider = \"postgresql\"\n  url      = env(\"DATABASE_URL\")\n}\n\nmodel User {\n  id    Int    @id @default(autoincrement())\n  email String @unique\n  // thiếu: posts Post[]\n}\n\nmodel Post {\n  id       Int  @id @default(autoincrement())\n  authorId Int\n  author   User @relation(fields: [authorId], references: [id])\n}\n",
 "demo/out/p0-9/validate-thieu.txt": "$ npx prisma validate --schema p09/thieu-quan-he.prisma\nEnvironment variables loaded from .env\nPrisma schema loaded from p09/thieu-quan-he.prisma\n\nError: Prisma schema validation - (validate wasm)\nError code: P1012\nerror: Error validating field `author` in model `Post`: The relation field `author` on model `Post` is missing an opposite relation field on the model `User`. Either run `prisma format` or add it manually.\n  -->  p09/thieu-quan-he.prisma:15\n   | \n14 |   authorId Int\n15 |   author   User @relation(fields: [authorId], references: [id])\n16 | }\n   | \n\nValidation Error Count: 1\n[Context: validate]\n\nPrisma CLI Version : 6.19.3\n[exit 1]\n",
 "demo/lab/p09/enum.prisma": "generator client {\n  provider = \"prisma-client-js\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n  url      = env(\"DATABASE_URL\")\n}\n\nenum ContentType {\n  VLOG\n  CODE_REVIEW // đổi tên từ CODE (08/08/2026)\n}\n\nmodel Lesson {\n  id   Int         @id @default(autoincrement())\n  type ContentType\n}\n",
 "demo/lab/p09/prisma/seed.ts": "// seed.ts — bản CHÉP TAY giá trị enum (lỗi 08/08/2026)\nimport { PrismaClient } from '@prisma/client';\ntype ContentType = 'VLOG' | 'CODE';   // chép tay\nconst prisma = new PrismaClient();\nconst t: ContentType = 'CODE';\nawait prisma.lesson.create({ data: { type: t as any } });\nconsole.log('seed ok');\nawait prisma.$disconnect();\n",
 "demo/out/p0-9/enum-tsc.txt": "$ cd p09 && npx tsc -p . && echo \"tsc: no errors (src only — prisma/seed.ts is not included)\"\ntsc: no errors (src only — prisma/seed.ts is not included)\n",
 "demo/out/p0-9/enum-seed.txt": "$ cd p09 && npx tsx prisma/seed.ts\nnode_modules/@prisma/client/src/runtime/core/errorRendering/throwValidationException.ts:45\n  throw new PrismaClientValidationError(messageWithContext, { clientVersion })\n        ^\n\nPrismaClientValidationError: \nInvalid `prisma.lesson.create()` invocation in\np09/prisma/seed.ts:6:21\n\n  3 type ContentType = 'VLOG' | 'CODE';   // chép tay\n  4 const prisma = new PrismaClient();\n  5 const t: ContentType = 'CODE';\n→ 6 await prisma.lesson.create({\n      data: {\n        type: \"CODE\"\n              ~~~~~~\n      }\n    })\n\nInvalid value for argument `type`. Expected ContentType.\n    at throwValidationException (node_modules/@prisma/client/src/runtime/core/errorRendering/throwValidationException.ts:45:9)\n    at ei.handleRequestError (node_modules/@prisma/client/src/runtime/RequestHandler.ts:202:7)\n    at ei.handleAndLogRequestError (node_modules/@prisma/client/src/runtime/RequestHandler.ts:174:12)\n    at ei.request (node_modules/@prisma/client/src/runtime/RequestHandler.ts:143:12)\n    at async a (node_modules/@prisma/client/src/runtime/getPrismaClient.ts:833:24)\n    at async <anonymous> (p09/prisma/seed.ts:6:1) {\n  clientVersion: '6.19.3'\n}\n\nNode.js v26.8.1\n[exit 1]\n"
};
const fs = { readFileSync: (p) => { const k = String(p); if (!(k in DU_LIEU)) throw new Error('thiếu dữ liệu đóng băng: ' + k); return DU_LIEU[k]; } };
import { lamDeck, prs, ts, tp, two, box, cards, c, tbl, steps } from './_pr-chung.mjs';

export const deck = { key: 'pr-00-9', code: 'PR 0.S2', title: 'What goes wrong without it', sub: 'Start here (2/2)' };

const DEMO = 'demo';
const OUT = (t) => fs.readFileSync(`${DEMO}/out/p0-9/${t}.txt`, 'utf8').replace(/\n+$/, '');
const SRC = (t) => fs.readFileSync(`${DEMO}/lab/p09/${t}`, 'utf8').replace(/\n+$/, '');
const bo = (s, re) => s.split('\n').filter((l) => l.trim() && !re.test(l)).join('\n');

export const slides = lamDeck({ chuong: 'Section 0 — Start here', bai: 'Start here 2/2' }, [
  /* 1 */ { cover: true, nhan: 'Section 0 · Start here (2/2)', t: 'What goes wrong without it,<br>and how to study this course', sub: 'Six real incidents from this website — every check was green — and a study plan that gets you to the end' },
  /* 2 */ { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Six real incidents from the CuongThai codebase, each taught later in the course</li>
    <li>Two of them reproduced for real, so you see the exact error</li>
    <li>What all six share: <b>every check was green</b></li>
    <li>Three situations you may meet as a student (illustrations)</li>
    <li>How to study: minimum path, full path, one session, five safety rules</li></ul>` },
  /* 3 */ { t: 'Six real incidents — all from this website', body: tbl(['Date', 'What happened', 'Lesson'], [
      ['29 Jun 2026', 'A relation without its opposite field — <code>prisma generate</code> refused to run', '3.1'],
      ['29 Jun 2026', 'Compound key queried by its default name; the schema had a custom one', '2.3'],
      ['6 Jul 2026', 'Migration <code>…_add_music_and_profile</code> can never replay on a shadow DB ⇒ P3006', '6.2, 6.3'],
      ['8 Aug 2026', 'Enum value <code>CODE</code> → <code>CODE_REVIEW</code>: checklist green, seed broke on production', '2.5, 8.3, 11.4'],
      ['18 Aug 2026', 'glibc engine inside a musl image ⇒ API 502 for seven minutes', '11.1'],
      ['18 Aug 2026', 'Docker build cache 7.6 GB on the PostgreSQL disk ⇒ no space left on device', '12.4'],
    ], { cap: 'Recorded in the CuongThai repository; dissected in the lessons on the right' }) },
  /* 4 */ { t: 'Reproduced: a relation without its other half', body: two(
      prs(SRC('thieu-quan-he.prisma'), { sm: true, hl: [9, 15] }),
      tp(OUT('validate-thieu').split('\n').filter((l) => /^\$|Error code|^error:|-->|^15 \||Validation Error Count|^\[exit/.test(l)).join('\n'), { wrap: 36 }), 'r64') +
    box('The rule written into the repository afterwards', 'Every relation needs its opposite field — <code>posts Post[]</code> on <code>User</code>. Lesson 3.1 explains why the database has one column but Prisma needs two fields.', 'xanh') },
  /* 5 */ { t: 'Reproduced: one renamed enum value', body: two(
      prs(SRC('enum.prisma').split('\n').slice(9, 13).join('\n'), { sm: true, hl: [3] }),
      ts(SRC('prisma/seed.ts').split('\n').slice(1).join('\n'), { sm: true, hl: [2, 4] }), '') + two(
      tp(OUT('enum-tsc'), { wrap: 52 }),
      tp(OUT('enum-seed').split('\n').filter((l) => /^\$|PrismaClientValidationError|^Invalid|→ 6|type: "CODE"/.test(l)).join('\n'), { wrap: 52 }), '') +
    box('Green check, broken seed', '<code>tsconfig.json</code> only includes <code>src</code>; the seed keeps its own copy of the enum. Lesson 8.3: import the type from <code>@prisma/client</code>, and type-check the seed too.', 'do2') },
  /* 6 */ { t: 'What all six share: every check was green', body: cards([
      ['✅ The type check passed', 'but the seed file lived outside <code>tsc</code>, and it had its own hand-written copy of the enum.'],
      ['✅ The build passed', 'but the engine inside the image was built for a different libc.'],
      ['✅ The deploy said success', 'but the disk, the shadow database and the restart loop were not part of any check.'],
    ], 3) + box('So this course keeps asking you to look at the real state', 'The SQL that was sent. The migration table. The file inside the container. The free space on the disk. <b>“It compiled” is where the questions start.</b>', 'do2') },
  /* 7 */ { t: 'Three situations you may meet as a student (illustrations)', body: cards([
      ['🌙 The night before the defence', 'A migration fails, a teammate runs <code>prisma migrate reset</code> on the shared database “to clean it up”. Every demo row is gone. → Lesson 1.5, Chapter 6: which commands drop data.'],
      ['🐢 The page that was fast yesterday', 'Posts with comments: instant with 10 posts, seconds with 2,000 — one query per post in a loop. → Lesson 0.3 (query log), Chapter 9.'],
      ['🔑 The password on GitHub', 'A <code>.env</code> with <code>DATABASE_URL</code> committed to a public repository. → Lesson 0.2 checks <code>.gitignore</code> on day one.'],
    ], 3) + box('Illustrations, not real events', 'These three are made up to show common student mistakes. The six incidents before them are real.', 'lam') },
  /* 8 */ { t: 'How to study: two paths', body: tbl(['Path', 'What to take', 'Good for'], [
      ['Minimum', 'Section 0 → 1.5 → Chapters 2–3 → Chapter 4 → 5.1–5.3 → 6.1–6.3 → 7.1', 'a group project · ~3 weeks, one session a day'],
      ['Full', 'All thirteen sections in order, with every quiz', 'a job — Chapters 6, 7, 9, 11 are where interviews and incidents come from'],
    ], { hl: [1] }) + box('Either way', 'One lesson per session, typed by you, against your own throwaway PostgreSQL. Do the Code Lab module after each section.', 'xanh') },
  /* 9 */ { t: 'One study session: 45–60 minutes', to: true, body: steps([
      '<b>Read or watch — 10 min.</b> One lesson, not three.',
      '<b>Type it yourself — 25 min.</b> Every command, every query. Copy-paste teaches your clipboard.',
      '<b>Break it on purpose — 10 min.</b> Misspell a field, drop a relation — read the error to the end.',
      '<b>Write it down — 5 min.</b> One line: the command, the SQL it sent, the trap.',
    ]) },
  /* 10 */ { t: 'Five safety rules from day one', body: steps([
      `A <b>throwaway PostgreSQL in Docker</b> for this course — never a database anyone else uses`,
      `${c("log: ['query']")} on in development, until Chapter 9`,
      `${c('migrate reset')}, ${c('db push --force-reset')}, ${c('DROP')} only on your throwaway database`,
      `Never commit ${c('.env')} — look at ${c('git status')} before every commit`,
      `Something fails? Read the code first (${c('P1001')}, ${c('P2002')}, ${c('P3009')}), then Lesson 12.2 — never guess-fix a failed migration`,
    ]) },
  /* 11 */ { t: 'Your turn — and what to keep', body: two(steps([
      `Write the two-model schema from slide 4 and run ${c('npx prisma validate')}`,
      `Read the P1012 message to the end; add ${c('posts Post[]')}; validate again`,
      `Pick your path (minimum or full) and put the sessions in your calendar`,
      `Start the throwaway PostgreSQL now — Lesson 0.2 is next`,
    ]), box('Keep these', `<ul><li>Six real incidents — every check was green</li><li>The failure lived where no check looked</li><li>Look at the real state: SQL, migration table, container, disk</li><li>One lesson a session, typed by you</li></ul>`, 'lam'), '') },
]);
