/**
 * pr-08-3 — Prisma ORM · Chapter 8 · Lesson 8.3 "The type that broke production" (deck video, 12/11/2026). Bài web: pr-8-3-su-co-enum.
 * Dựng lại sự cố 08/08/2026 (`chay.sh p8-3`, CSDL c83, Prisma 6.19.3 · tsc 5.9.3 · PostgreSQL 16.14): đổi CODE → CODE_REVIEW ⇒ ALTER TYPE RENAME VALUE ·
 * prisma validate · generate · tsc (tsconfig rootDir ./src, exclude prisma) · migrate diff RỖNG — 5 phép kiểm xanh · seed ⇒ PrismaClientValidationError
 * "Invalid value for argument `type`. Expected ContentType." (KHÔNG có mã P2009), exit 1 · tsc --listFiles chỉ đọc src/index.ts, prisma/seed.ts nằm ngoài ·
 * tsconfig.seed.json một mình đã bắt TS2322 ngay ở lời gọi create (union chép tay vẫn còn) · sửa 1 (import kiểu) ⇒ lỗi dời về đúng dòng dữ liệu 'CODE' ·
 * ADD VALUE + UPDATE trong CÙNG giao dịch ⇒ "unsafe use of new value", tách hai giao dịch ⇒ UPDATE 2.
 * Repo CuongThai thật (đọc, 12/11/2026): tsconfig chính đọc 0 tệp prisma/*.ts; 19 tệp prisma/*.ts + 41 tệp scripts/*.ts nằm ngoài; tsconfig.seed.json phủ cả 19.
 */
/* Output chạy THẬT, đóng băng từ thư mục demo của khoá video Prisma (12/11/2026) — deck tự chứa, không đọc tệp ngoài repo. */
const DU_LIEU = {
 "demo/out/p8-3/doi-ten.txt": "$ docker exec -i prisma-pg psql -U student -d c83 -c \"ALTER TYPE \\\"ContentType\\\" RENAME VALUE 'CODE' TO 'CODE_REVIEW'\"\nALTER TYPE\n$ npx prisma validate --schema p8/83/schema.prisma\nEnvironment variables loaded from .env\nPrisma schema loaded from p8/83/schema.prisma\nThe schema at p8/83/schema.prisma is valid 🚀\n$ npx prisma generate --schema p8/83/schema.prisma | grep Generated\nEnvironment variables loaded from .env\n✔ Generated Prisma Client (v6.19.3) to ./p8/83/gen in 69ms\n$ npx tsc -p p8/83/tsconfig.json && echo 'tsc --noEmit: no errors'\ntsc --noEmit: no errors\n$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c83 npx prisma migrate diff --from-schema-datasource p8/83/schema.prisma --to-schema-datamodel p8/83/schema.prisma --script\n-- This is an empty migration.\n\n",
 "demo/out/p8-3/seed-hong.txt": "$ docker exec -i prisma-pg psql -q -U student -d c83 -c 'DELETE FROM contents'\n$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c83 npx tsx p8/83/prisma/seed.ts 2>&1 | awk 'length < 300' | grep -v '^    at \\|^\\^\\|library.js:33\\|^Node.js'; echo \"[exit ${PIPESTATUS[0]}]\"\n\nPrismaClientValidationError: \nInvalid `prisma.content.create()` invocation in\np8/83/prisma/seed.ts:9:47\n\n  6   { title: 'Review code nguon Prisma', type: 'CODE' },\n  7   { title: 'Vlog ngay dau', type: 'VLOG' },\n  8 ];\n→ 9 for (const d of payload) await prisma.content.create({\n      data: {\n        title: \"Review code nguon Prisma\",\n        type: \"CODE\"\n              ~~~~~~\n      }\n    })\n\nInvalid value for argument `type`. Expected ContentType.\n  clientVersion: '6.19.3'\n}\n\n[exit 1]\n",
 "demo/out/p8-3/khong-doc.txt": "$ npx tsc -p p8/83/tsconfig.json --listFiles | grep -v node_modules | grep -v /gen/\np8/83/src/index.ts\n$ find p8/83 -name '*.ts' -not -path '*/gen/*' | sort\np8/83/prisma/seed.ts\np8/83/src/index.ts\n",
 "demo/out/p8-3/sua.txt": "$ npx tsc -p p8/83/tsconfig.seed.json; echo \"[tsconfig.seed.json, seed.ts van con union chep tay: exit $?]\"\np8/83/prisma/seed.ts(9,56): error TS2322: Type '{ title: string; type: ContentType; }' is not assignable to type '(Without<ContentCreateInput, ContentUncheckedCreateInput> & ContentUncheckedCreateInput) | (Without<...> & ContentCreateInput)'.\n  Type '{ title: string; type: ContentType; }' is not assignable to type 'Without<ContentUncheckedCreateInput, ContentCreateInput> & ContentCreateInput'.\n    Type '{ title: string; type: ContentType; }' is not assignable to type 'ContentCreateInput'.\n      Types of property 'type' are incompatible.\n        Type 'ContentType' is not assignable to type 'import(\"p8/83/gen/index\").$Enums.ContentType'.\n          Type '\"CODE\"' is not assignable to type 'ContentType'.\n[tsconfig.seed.json, seed.ts van con union chep tay: exit 2]\n$ cp p8/83/prisma/seed.ts /tmp/p83-seed-cu.ts && cp p8/83/seed-sua.txt p8/83/prisma/seed.ts && npx tsc -p p8/83/tsconfig.seed.json; echo \"[sau sua 1 — import kieu sinh ra: exit $?]\"; cp /tmp/p83-seed-cu.ts p8/83/prisma/seed.ts\np8/83/prisma/seed.ts(6,40): error TS2322: Type '\"CODE\"' is not assignable to type 'ContentType'.\n[sau sua 1 — import kieu sinh ra: exit 2]\n",
 "demo/out/p8-3/them-gia-tri.txt": "$ docker exec -i prisma-pg psql -q -U student -d c83 -c \"INSERT INTO contents (title, type) VALUES ('Review 1','CODE_REVIEW'),('Review 2','CODE_REVIEW'),('Vlog','VLOG')\"\n$ docker exec -i prisma-pg psql -U student -d c83 < p8/83/them-gia-tri.sql\nBEGIN\nALTER TYPE\nERROR:  unsafe use of new value \"CODE_REVIEW2\" of enum type \"ContentType\"\nLINE 1: UPDATE contents SET type = 'CODE_REVIEW2' WHERE type = 'CODE...\n                                   ^\nHINT:  New enum values must be committed before they can be used.\nROLLBACK\n$ docker exec -i prisma-pg psql -U student -d c83 < p8/83/them-gia-tri-2.sql\nBEGIN\nALTER TYPE\nCOMMIT\nBEGIN\nUPDATE 2\nCOMMIT\n     type     | count \n--------------+-------\n VLOG         |     1\n CODE_REVIEW2 |     2\n(2 rows)\n\n"
};
const fs = { readFileSync: (p) => { const k = String(p); if (!(k in DU_LIEU)) throw new Error('thiếu dữ liệu đóng băng: ' + k); return DU_LIEU[k]; } };
import { lamDeck, tp, ts, sql, prs, two, box, cards, c, tbl, steps } from './_pr-chung.mjs';

export const deck = { key: 'pr-08-3', code: 'PR 8.3', title: 'The type that broke production', sub: 'Chapter 8 · Lesson 8.3' };

const DEMO = 'demo';
const OUT = (t, ch = 'p8-3') => fs.readFileSync(`${DEMO}/out/${ch}/${t}.txt`, 'utf8').replace(/\n+$/, '');
const gon = (s) => s.replace(/^\$ DATABASE_URL=\S+ /gm, '$ ').replace(/p8\/83\//g, '').replace(/^Environment variables loaded from \.env\n/gm, '').split('\n').filter((l) => !/^\s*$/.test(l)).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 8 — The generated type system', bai: '8.3' }, [
  /* 1 */ { cover: true, nhan: 'Chapter 8 · Lesson 8.3', t: 'The type that broke production', sub: 'A one-word enum rename, five green checks, a red seed — rebuilt and run' },
  /* 2 */ { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The change, and the five checks that passed</li>
    <li>What broke, and the real error</li>
    <li>Why it was invisible: a file nothing type-checks</li>
    <li>The two fixes — and which one alone was enough</li>
    <li>The rename you should have written instead</li></ul>` },
  /* 3 */ { t: 'The change — and five checks, all green', body: two(prs(`enum ContentType {
  VLOG
  ARTICLE
  CODE_REVIEW   // was CODE
  TUTORIAL
}`, { sm: true, hl: [4] }) + box('A correct change', 'The frontend always said CODE_REVIEW. Bringing the enum in line was the right fix.', 'xanh'),
      tp(gon(OUT('doi-ten')).replace(/^Prisma schema loaded from .*\n/m, ''), { wrap: 64, fs: 12 }), '') },
  /* 4 */ { t: 'What broke: the seed, on deploy', body: two(ts(`// prisma/seed.ts — unchanged for months
type ContentType =
  'VLOG' | 'ARTICLE' | 'CODE' | 'TUTORIAL';

const payload: { title: string; type: ContentType }[] = [
  { title: 'Review code nguon Prisma', type: 'CODE' },
  { title: 'Vlog ngay dau', type: 'VLOG' },
];
for (const d of payload)
  await prisma.content.create({ data: d });`, { sm: true }),
      tp(gon(OUT('seed-hong')).split('\n').filter((l) => !/^\$ docker|^\s+(\d|→|data|title|type|~|}|\))/.test(l) || /→ 9/.test(l)).join('\n').replace(/ 2>&1 \| awk .*$/m, ''), { wrap: 54, fs: 14 }), '') +
      cards([
        ['A validation error, not P2009', 'The client refused &#39;CODE&#39; before any SQL was sent: PrismaClientValidationError, no code, no meta.'],
        ['Found on deploy', 'The seed is not in the test suite. Its first run after the change was the production deploy — exit 1.'],
      ], 2) },
  /* 5 */ { t: 'Why it was invisible: tsc never opened the file', body: two(ts(`// tsconfig.json
{
  "compilerOptions": { "rootDir": "./src", … },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "prisma"]
}`, { sm: true }) + cards([
        ['rootDir: "./src"', 'Emitting to dist/ needs every input under src — so prisma/ was excluded.'],
        ['Silence', 'tsc never warns about a .ts file it does not read.'],
      ], 2), tp(gon(OUT('khong-doc')), { wrap: 64, fs: 13, title: 'terminal — the lab' }), '') +
      tp(`$ npx tsc -p tsconfig.json --listFilesOnly | grep -c '^prisma/'      # CuongThai repo, 12 Nov 2026
0
# .ts files in git that this tsconfig never reads:
prisma/   19   (seed.ts and 18 other seed / data files)
scripts/  41`, { fs: 13, title: 'terminal — the real repository, read-only' }) },
  /* 6 */ { t: 'The two fixes — and the one that was enough', body: two(ts(`// Fix 2 — tsconfig.seed.json
{
  "extends": "./tsconfig.json",
  "compilerOptions": { "rootDir": ".", "noEmit": true },
  "include": ["prisma/**/*.ts", "src/**/*.ts"]
}
// package.json
"typecheck:seed": "tsc -p tsconfig.seed.json"

// Fix 1 — one line in seed.ts
- type ContentType = 'VLOG' | … | 'CODE' | …;
+ import type { ContentType } from '@prisma/client';`, { sm: true }),
      tp(gon(OUT('sua')).replace(/cp \S+ \/tmp\/\S+ && cp \S+ (\S+) && /, '# with fix 1: ').replace(/; cp \/tmp\/\S+ \S+$/m, ''), { wrap: 62, fs: 11 }), '') +
      box('Checking the file was enough — even with the hand copy still there', 'Once tsc reads seed.ts, the hand union meets create()&#39;s real input type and TS2322 fires. Fix 1 then moves the error onto the data line itself. Do both.', 'xanh') },
  /* 7 */ { t: 'Ask any codebase: what is NOT type-checked?', body: sql(`comm -13 \\
  <(npx tsc -p tsconfig.json --listFilesOnly | grep -v node_modules | sed "s|^$PWD/||" | sort) \\
  <(git ls-files '*.ts' | grep -v '\\.d\\.ts$' | sort)`, { lang: 'bash', sm: true }) +
      cards([
        ['--listFilesOnly', 'Lists what tsc would read without checking anything: seconds, not the 45 of a full check.'],
        ['Read the list', 'Seeds, backfills, one-off scripts: the files that touch production data and get the least review.'],
        ['Give each a tsconfig', 'noEmit, rootDir ".", its own npm script, and a line in the checklist that says why.'],
      ], 3) +
      box('And run the seed itself when the schema changes', 'tsc proves the types agree. Only running the seed proves the data agrees — CuongThai&#39;s checklist now has both.', 'lam') },
  /* 8 */ { t: 'The rename you should have written: expand, then contract', body: two(sql(`-- migration 1 (expand)
ALTER TYPE "ContentType"
  ADD VALUE 'CODE_REVIEW';
-- deploy 1: read both, write the new
-- migration 2: a SEPARATE file
UPDATE contents SET type = 'CODE_REVIEW'
  WHERE type = 'CODE';
-- deploy 2, then days later:
-- migration 3 removes CODE (2.5)`, { sm: true }),
      tp(gon(OUT('them-gia-tri')).split('\n').filter((l) => !/^\$ docker exec -i prisma-pg psql -q|^(BEGIN|COMMIT|ALTER TYPE|-+\+-+|\(\d+ rows\))$/.test(l)).join('\n').replace(/docker exec -i prisma-pg /g, ''), { wrap: 62, fs: 11 }), '') +
      box('ADD VALUE and the UPDATE cannot share a migration', 'One migration file is one transaction; a new enum value is unusable until committed. Split, the UPDATE moved both rows.', 'do2') },
  /* 9 */ { t: 'Four other places a hand copy hides', body: tbl(['Where', 'Why tsc cannot help'], [
      ['Enum values inside raw SQL', c("$queryRaw`… WHERE type = 'CODE'`") + ' is a string — typedSql in Chapter 10'],
      ['The frontend', 'its own copy of the union; import or generate it, never type it twice'],
      ['JSON columns', c('{ "type": "CODE" }') + ' is not migrated by a rename'],
      ['External contracts', 'webhooks, partner APIs, stored configs — a rename breaks them silently'],
    ]) + box('A rename is never one step', 'Importing the type turns this outage into a compile error. Expand–contract would have survived even the hand copy.', 'lam') },
  /* 10 */ { t: 'Your turn — and what to keep', body: two(steps([
      `Rename an enum value; run all five checks`,
      `Run the seed and read the error class`,
      `List the ${c('.ts')} files your tsconfig never reads`,
      `Add ${c('tsconfig.seed.json')}; split ADD VALUE from UPDATE`,
    ]), box('Keep these', `<ul><li>Green checks cover only what they read</li><li>Give every script a tsconfig</li><li>Run the seed after a schema change</li><li>Rename = expand, migrate, contract</li></ul>`, 'lam'), '') },
]);
