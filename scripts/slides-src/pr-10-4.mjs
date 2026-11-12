/**
 * pr-10-4 — Prisma ORM · Chapter 10 · Lesson 10.4 "TypedSQL: raw queries the compiler can check" (deck video, 12/11/2026). Bài web: pr-10-4-typedsql.
 * Output THẬT (`chay.sh p10-4`, prisma-pg PostgreSQL 16.14, CSDL c104 / c104b; Prisma 6.19.3, previewFeatures typedSql, output tuỳ chỉnh ⇒ import từ '<output>/sql'):
 * generate --sql in "Generated Prisma Client" (không có dòng đếm câu SQL) · kiểu sinh ra: comment_count là `number | null` (biểu thức ⇒ có thể null), tham số `?` ⇒ `| null` ·
 * tsc: TS2322 (number | null → number), TS2339 trường không có, TS2345 '42' vào Int · chạy đúng ba cách gọi timBai · cột content đổi tên ⇒ generate --sql báo lỗi từng tệp ·
 * không với tới CSDL ⇒ P1001.
 */
/* Output chạy THẬT, đóng băng từ thư mục demo của khoá video Prisma (12/11/2026) — deck tự chứa, không đọc tệp ngoài repo. */
const DU_LIEU = {
 "demo/lab/p10/prisma/sql/thongKeTacGia.sql": "-- @param {Int} $1:tacGiaId  ID cua tac gia\n-- @param {Int} $2:gioiHan   So hang toi da\nSELECT p.id, p.content, p.created_at, count(c.id)::int AS comment_count\nFROM posts p\nLEFT JOIN comments c ON c.post_id = p.id\nWHERE p.author_id = $1 AND p.deleted_at IS NULL\nGROUP BY p.id\nORDER BY p.created_at DESC\nLIMIT $2;\n",
 "demo/out/p10-4/generate.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c104 npx prisma generate --sql --schema p10/prisma/schema.prisma 2>&1 | grep -E 'loaded|Generated|Error'\nEnvironment variables loaded from .env\nPrisma schema loaded from p10/prisma/schema.prisma\n✔ Generated Prisma Client (v6.19.3) to ./p10/gen in 53ms\n",
 "demo/out/p10-4/kieu.txt": "$ sed -n '/namespace thongKeTacGia/,/^}/p' p10/gen/sql/thongKeTacGia.d.ts\nexport namespace thongKeTacGia {\n  export type Parameters = [tacGiaId: number, gioiHan: number]\n  export type Result = {\n    id: number\n    content: string\n    created_at: Date\n    comment_count: number | null\n  }\n}\n$ sed -n '/namespace timBai/,/^}/p' p10/gen/sql/timBai.d.ts\nexport namespace timBai {\n  export type Parameters = [tuKhoa: string | null, tuNgay: Date | null]\n  export type Result = {\n    id: number\n    content: string\n    created_at: Date\n  }\n}\n",
 "demo/out/p10-4/tsc.txt": "$ npx tsc --noEmit --target es2022 --module nodenext --moduleResolution nodenext --strict --skipLibCheck p10/104/dung.ts\np10/104/dung.ts(6,7): error TS2322: Type 'number | null' is not assignable to type 'number'.\n  Type 'null' is not assignable to type 'number'.\np10/104/dung.ts(8,21): error TS2339: Property 'khong_co_that' does not exist on type 'Result'.\np10/104/dung.ts(9,43): error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.\n[exit 2]\n",
 "demo/lab/p10/prisma/sql/timBai.sql": "-- @param {String}   $1:tuKhoa?  Tu khoa, bo trong de lay tat ca\n-- @param {DateTime} $2:tuNgay?  Chi lay bai tu ngay nay tro di\nSELECT id, content, created_at\nFROM posts\nWHERE deleted_at IS NULL\n  AND ($1::text IS NULL OR content ILIKE '%' || $1 || '%')\n  AND ($2::timestamptz IS NULL OR created_at >= $2)\nORDER BY created_at DESC\nLIMIT 3;\n",
 "demo/out/p10-4/chay.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c104 npx tsx p10/104/chay.mts\n[\n  {\n    id: 98839,\n    content: 'typescript cho nguoi moi — ghi chu so 98839',\n    created_at: 2026-03-10T15:19:00.000Z,\n    comment_count: 0\n  },\n  {\n    id: 96839,\n    content: 'nhat ky hoc tap — ghi chu so 96839',\n    created_at: 2026-03-09T05:59:00.000Z,\n    comment_count: 0\n  },\n  {\n    id: 94839,\n    content: 'prisma migration tren production — ghi chu so 94839',\n    created_at: 2026-03-07T20:39:00.000Z,\n    comment_count: 0\n  }\n]\ntimBai(prisma, null): [ 99999, 99996, 99993 ]\ntimBai(null, 2026-03-01): [ 100000, 99999, 99998 ]\ntimBai(null, null): [ 100000, 99999, 99998 ]\n",
 "demo/out/p10-4/troi-dat.txt": "$ docker exec prisma-pg psql -q -U student -d c104b -c 'ALTER TABLE posts RENAME COLUMN content TO body;' 2>&1 | grep -v 'does not exist' ; echo '-- (CSDL c104b: cot content da doi ten thanh body)'\n-- (CSDL c104b: cot content da doi ten thanh body)\n$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c104b npx prisma generate --sql --schema p10/prisma/schema.prisma 2>&1 | grep -v '^Environment'\nPrisma schema loaded from p10/prisma/schema.prisma\nError: Errors while reading sql files:\n\nIn p10/prisma/sql/thongKeTacGia.sql:\nError: column p.content does not exist\n\n\n\nIn p10/prisma/sql/timBai.sql:\nError: column \"content\" does not exist\n\n\n\n",
 "demo/out/p10-4/khong-db.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:59999/c104 npx prisma generate --sql --schema p10/prisma/schema.prisma 2>&1 | grep -v '^Environment'\nPrisma schema loaded from p10/prisma/schema.prisma\nError: Errors while reading sql files:\n\nIn p10/prisma/sql/thongKeTacGia.sql:\nError: P1001\n\nCan't reach database server at `127.0.0.1:59999`\n\nPlease make sure your database server is running at `127.0.0.1:59999`.\n\n\nIn p10/prisma/sql/timBai.sql:\nError: P1001\n\nCan't reach database server at `127.0.0.1:59999`\n\nPlease make sure your database server is running at `127.0.0.1:59999`.\n\n\n"
};
const fs = { readFileSync: (p) => { const k = String(p); if (!(k in DU_LIEU)) throw new Error('thiếu dữ liệu đóng băng: ' + k); return DU_LIEU[k]; } };
import { lamDeck, tp, ts, sql, prs, two, box, cards, c, tbl, steps , icards, cmp, bars, hub, tiers, flow } from './_pr-chung.mjs';

export const deck = { key: 'pr-10-4', code: 'PR 10.4', title: 'TypedSQL: raw queries the compiler can check', sub: 'Chapter 10 · Lesson 10.4' };

const DEMO = 'demo';
const OUT = (t, ch = 'p10-4') => fs.readFileSync(`${DEMO}/out/${ch}/${t}.txt`, 'utf8').replace(/\n+$/, '');
const TSC = 'npx tsc --noEmit --target es2022 --module nodenext --moduleResolution nodenext --strict --skipLibCheck';
const gon = (s) => s.replace(/^\$ DATABASE_URL=\S+ /gm, '$ ').split(TSC).join('npx tsc --noEmit --strict …').replace(/p10\/10\d\//g, '').replace(/ 2>&1 \| grep .*$/gm, '').split('\n').filter((l) => !/^\s*$/.test(l)).join('\n');
const MOI = 'terminal — PostgreSQL 16.14 · Prisma 6.19.3 (typedSql preview)';
const SQLF = (t) => fs.readFileSync(`${DEMO}/lab/p10/prisma/sql/${t}.sql`, 'utf8').replace(/\n+$/, '');
const bo$ = (t) => gon(OUT(t)).split('\n').filter((l) => !/^\$ /.test(l)).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 10 — Escape hatches: raw SQL and client extensions', bai: '10.4' }, [
  /* 1 */ { cover: true, nhan: 'Chapter 10 · Lesson 10.4', t: 'TypedSQL: raw queries the compiler can check', sub: 'A .sql file, a live database at generate time, and types derived from both' },
  /* 2 */ { t: 'What you will take away from this lesson', body: icards([
      ['wrench', 'The setup: preview flag, prisma/sql, generate --sql', ''],
      ['type', 'What the generated types say — including null', ''],
      ['filter', 'Optional parameters without dynamic SQL', ''],
      ['warn', 'The rename from 10.2, caught at generate time', ''],
      ['server', 'The price: a live database in CI', ''],
    ], 2) },
  /* 3 */ { t: 'The setup', body: sql('-- prisma/sql/thongKeTacGia.sql\n' + SQLF('thongKeTacGia'), { sm: true }) + two(prs(`generator client {
  provider        = "prisma-client-js"
  output          = "../gen"
  previewFeatures = ["typedSql"]
}`, { sm: true }), tp(gon(OUT('generate')), { wrap: 62, fs: 12, title: MOI }), '') +
      cards([
        ['prisma/sql/*.sql', 'One file per query, next to schema.prisma. The file name becomes the function name.'],
        ['generate --sql', 'Plain generate skips the .sql files; with --sql Prisma prepares each against the database.'],
        ['Custom output', 'Import from &lt;output&gt;/sql — here ../gen/sql — not @prisma/client/sql.'],
      ], 3) },
  /* 4 */ { t: 'What the database said the types are', body: tp(bo$('kieu'), { wrap: 116, fs: 14, title: 'generated: gen/sql/*.d.ts' }) +
      box('count(c.id)::int came back as number | null', 'PostgreSQL reports an expression as possibly null, so TypedSQL does too — even when a count cannot be. Handle the null, or use COALESCE in the SQL. Optional parameters (?) become | null arguments.', 'lam') },
  /* 5 */ { t: 'The compiler now checks both ends', body: two(ts(`import { thongKeTacGia, timBai }
  from '../gen/sql/index.js';
const rows = await prisma.$queryRawTyped(
  thongKeTacGia(42, 3));
const n: number = rows[0].comment_count;
const d: Date = rows[0].created_at;
console.log(rows[0].khong_co_that);
await prisma.$queryRawTyped(
  thongKeTacGia('42', 3));
await prisma.$queryRawTyped(timBai('prisma', null));`, { sm: true }), tp(gon(OUT('tsc')), { wrap: 62, fs: 12, title: MOI }), '') +
      box('Three mistakes, three compile errors', 'The nullable count, a field that does not exist, a string where an Int goes. Through $queryRaw&lt;any[]&gt; all three would compile.', 'xanh') },
  /* 6 */ { t: 'Optional parameters, no dynamic SQL', body: sql('-- prisma/sql/timBai.sql\n' + SQLF('timBai'), { sm: true }) + tp(bo$('chay').split('\n').slice(-3).join('\n'), { wrap: 116, fs: 14, title: MOI }) +
      box('$1::text IS NULL OR …', 'One prepared statement covers every combination of filters. Cast the parameter so PostgreSQL knows its type when it is null.', 'lam') },
  /* 7 */ { t: 'The rename from 10.2, caught at generate', body: tp(gon(OUT('troi-dat')).split('\n').filter((l) => !/^\$ docker/.test(l)).join('\n'), { wrap: 116, fs: 14, title: MOI }) +
      box('This error in CI is the whole value', 'Column content renamed to body: every .sql file that used it fails to generate, naming the file and the column. The same rename with $queryRaw compiles and returns undefined in production.', 'xanh') },
  /* 8 */ { t: 'The price: a live database at generate time', body: tp(gon(OUT('khong-db')), { wrap: 116, fs: 13, title: MOI }) +
      cards([
        ['CI needs a database', 'With the migrations applied — generate --sql prepares every statement against it.'],
        ['One static statement per file', 'No Prisma.sql composition; optional filters use the IS NULL pattern.'],
        ['Still a preview feature', 'In 6.19.3 typedSql sits behind previewFeatures.'],
      ], 3) },
  /* 9 */ { t: 'Choosing among the escape hatches', body: cmp(['Need', 'Use'], [
      ['a fixed query, typed, checked in CI', 'TypedSQL'],
      ['clauses that appear or disappear', c('$queryRaw') + ' + ' + c('Prisma.sql') + ' — and zod (10.2)'],
      ['an identifier chosen at runtime', c('Prisma.raw') + ' from an allow-list (10.1)'],
      ['everything the builder can say', 'the builder'],
    ]) + box('Typed, checked, still SQL', 'TypedSQL removes the type promise of 10.2; it does not remove 10.1&#39;s rules — parameters stay parameters, and identifiers still cannot be one.', 'lam') },
  /* 10 */ { t: 'Your turn — and what to keep', body: two(steps([
      `Write one ${c('prisma/sql')} file; ${c('generate --sql')}`,
      `Read the generated ${c('.d.ts')}: find the ${c('| null')}`,
      `Rename a column; run generate again`,
      `Run generate with the database stopped`,
    ]), box('Keep these', `<ul><li>generate --sql needs the database</li><li>Expressions come back nullable</li><li>Renames fail at generate, not in prod</li><li>Import from &lt;output&gt;/sql</li></ul>`, 'lam'), '') },
]);
