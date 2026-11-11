/**
 * pr-02-1 — Prisma ORM · Chapter 2 · Lesson 2.1 "Models, fields and the nine scalar types" (deck video, 12/11/2026). Bài web: pr-2-1-model-va-kieu.
 * Output THẬT (`chay.sh p2-1`, demo/lab/p2/21, CSDL c21 trên prisma-pg, Prisma 6.19.3 · PostgreSQL 16.14):
 * migrate diff --from-empty ⇒ SQL 9 kiểu · \d "SampleType" · kiểu TS trong $SampleTypePayload · Float ×10 = 0.9999999999999999, Decimal ×10 = "1"
 * · price + 1 = "0.11" · JSON.stringify(Decimal) = "0.1" (web nói ra cấu trúc nội bộ — SAI ở 6.19) · BigInt ném lỗi · validate 3 lỗi đặt tên
 * (model một dòng `{ id Int @id }` KHÔNG hợp lệ ở PSL — web viết vậy) · /// thành JSDoc trong index.d.ts.
 */
/* Output chạy THẬT, đóng băng từ thư mục demo của khoá video Prisma (12/11/2026) — deck tự chứa, không đọc tệp ngoài repo. */
const DU_LIEU = {
 "demo/lab/p2/21/schema.prisma": "generator client {\n  provider = \"prisma-client-js\"\n  output   = \"./gen\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n  url      = env(\"DATABASE_URL\")\n}\n\n// One model touching all nine, so you can read the generated types\nmodel SampleType {\n  id          Int      @id @default(autoincrement())\n  name        String\n  description String?\n  quantity    Int\n  views       BigInt   @default(0)\n  score       Float\n  price       Decimal  @db.Decimal(12, 2)\n  visible     Boolean  @default(true)\n  createdAt   DateTime @default(now())\n  settings    Json     @default(\"{}\")\n  signature   Bytes?\n  tags        String[]\n}\n\nmodel User {\n  // This is a normal comment. It does not appear anywhere else.\n  id    Int    @id @default(autoincrement())\n  /// This is a DOC comment — triple slash. It survives into the generated\n  /// client as JSDoc, and into the DMMF that other generators read.\n  email String @unique\n}\n",
 "demo/out/p2-1/sql.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c21 npx prisma migrate diff --from-empty --to-schema-datamodel p2/21/schema.prisma --script | grep -v '^$'\n-- CreateSchema\nCREATE SCHEMA IF NOT EXISTS \"public\";\n-- CreateTable\nCREATE TABLE \"SampleType\" (\n    \"id\" SERIAL NOT NULL,\n    \"name\" TEXT NOT NULL,\n    \"description\" TEXT,\n    \"quantity\" INTEGER NOT NULL,\n    \"views\" BIGINT NOT NULL DEFAULT 0,\n    \"score\" DOUBLE PRECISION NOT NULL,\n    \"price\" DECIMAL(12,2) NOT NULL,\n    \"visible\" BOOLEAN NOT NULL DEFAULT true,\n    \"createdAt\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,\n    \"settings\" JSONB NOT NULL DEFAULT '{}',\n    \"signature\" BYTEA,\n    \"tags\" TEXT[],\n    CONSTRAINT \"SampleType_pkey\" PRIMARY KEY (\"id\")\n);\n-- CreateTable\nCREATE TABLE \"User\" (\n    \"id\" SERIAL NOT NULL,\n    \"email\" TEXT NOT NULL,\n    CONSTRAINT \"User_pkey\" PRIMARY KEY (\"id\")\n);\n-- CreateIndex\nCREATE UNIQUE INDEX \"User_email_key\" ON \"User\"(\"email\");\n",
 "demo/out/p2-1/bang.txt": "$ docker exec prisma-pg psql -U student -d c21 -c '\\d \"SampleType\"'\n                                           Table \"public.SampleType\"\n   Column    |              Type              | Collation | Nullable |                 Default                  \n-------------+--------------------------------+-----------+----------+------------------------------------------\n id          | integer                        |           | not null | nextval('\"SampleType_id_seq\"'::regclass)\n name        | text                           |           | not null | \n description | text                           |           |          | \n quantity    | integer                        |           | not null | \n views       | bigint                         |           | not null | 0\n score       | double precision               |           | not null | \n price       | numeric(12,2)                  |           | not null | \n visible     | boolean                        |           | not null | true\n createdAt   | timestamp(3) without time zone |           | not null | CURRENT_TIMESTAMP\n settings    | jsonb                          |           | not null | '{}'::jsonb\n signature   | bytea                          |           |          | \n tags        | text[]                         |           |          | \nIndexes:\n    \"SampleType_pkey\" PRIMARY KEY, btree (id)\n\n",
 "demo/out/p2-1/kieu.txt": "$ sed -n '/export type [$]SampleTypePayload/,/composites/p' p2/21/gen/index.d.ts | grep -E '^      [a-zA-Z]+:'\n      id: number\n      name: string\n      description: string | null\n      quantity: number\n      views: bigint\n      score: number\n      price: Prisma.Decimal\n      visible: boolean\n      createdAt: Date\n      settings: Prisma.JsonValue\n      signature: Prisma.Bytes | null\n      tags: string[]\n",
 "demo/lab/p2/21/tien.mts": "import { PrismaClient, Prisma } from './gen/index.js';\nconst prisma = new PrismaClient();\nawait prisma.sampleType.deleteMany();\n// Float: binary floating point cannot represent 0.1 exactly\nawait prisma.sampleType.create({ data: { name: 'A', quantity: 1, score: 0.1, price: '0.1' } });\nconst rows = await prisma.sampleType.findMany();\nlet totalFloat = 0;\nfor (let i = 0; i < 10; i++) totalFloat += rows[0].score;\nconsole.log('Float  x10 :', totalFloat, totalFloat === 1);\nconsole.log('Decimal x10:', rows[0].price.times(10).toString());\n// Decimal in practice: it is an object, not a number\nconst price = rows[0].price;\nconsole.log(typeof price, price instanceof Prisma.Decimal);\nconsole.log(price + 1);                     // string concat: a real bug\nconsole.log(price.plus(1).toFixed(2));      // correct\nconsole.log(price.toNumber());              // lossy, on purpose only\nconsole.log(JSON.stringify({ price }));     // what an API sends\nconsole.log(JSON.stringify({ views: rows[0].views.toString() }));\ntry { JSON.stringify({ views: rows[0].views }); } catch (e) { console.log('BigInt:', (e as Error).message); }\nawait prisma.$disconnect();\n",
 "demo/out/p2-1/tien.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c21 npx tsx p2/21/tien.mts 2>&1 | tail -12\nFloat  x10 : 0.9999999999999999 false\nDecimal x10: 1\nobject true\n0.11\n1.10\n0.1\n{\"price\":\"0.1\"}\n{\"views\":\"0\"}\nBigInt: Do not know how to serialize a BigInt\n",
 "demo/out/p2-1/sai.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c21 npx prisma validate --schema p2/21/sai.prisma 2>&1 | grep -vE '^\\s*$'\nEnvironment variables loaded from .env\nPrisma schema loaded from p2/21/sai.prisma\nError: Prisma schema validation - (validate wasm)\nError code: P1012\nerror: Error validating: This line is not a valid field or attribute definition.\n  -->  p2/21/sai.prisma:22\n   | \n21 |   id    Int       @id\n22 |   names String?[]\n23 | }\n   | \nerror: Error validating: The name of a Model must not start with a number.\n  -->  p2/21/sai.prisma:11\n   | \n10 | // All three of these fail — try them, the messages are excellent\n11 | model 2Post {\n   | \nerror: Error validating model \"Post\": At most one field must be marked as the id field with the `@id` attribute.\n  -->  p2/21/sai.prisma:15\n   | \n14 | \n15 | model Post {\n16 |   id  Int @id\n17 |   id2 Int @id\n18 | }\n   | \nValidation Error Count: 3\n[Context: validate]\nPrisma CLI Version : 6.19.3\n",
 "demo/out/p2-1/jsdoc.txt": "$ grep -n -B 4 '^      email: string' p2/21/gen/index.d.ts | head -6\n2281-      /**\n2282-       * This is a DOC comment — triple slash. It survives into the generated\n2283-       * client as JSDoc, and into the DMMF that other generators read.\n2284-       */\n2285:      email: string\n"
};
const fs = { readFileSync: (p) => { const k = String(p); if (!(k in DU_LIEU)) throw new Error('thiếu dữ liệu đóng băng: ' + k); return DU_LIEU[k]; } };
import { lamDeck, prs, ts, tp, sql, two, box, cards, c, tbl, steps } from './_pr-chung.mjs';

export const deck = { key: 'pr-02-1', code: 'PR 2.1', title: 'Models, fields and the nine scalar types', sub: 'Chapter 2 · Lesson 2.1' };

const DEMO = 'demo';
const OUT = (t) => fs.readFileSync(`${DEMO}/out/p2-1/${t}.txt`, 'utf8').replace(/\n+$/, '');
const SRC = (t) => fs.readFileSync(`${DEMO}/${t}`, 'utf8').replace(/\n+$/, '');
const bo$ = (s) => s.split('\n').filter((l) => !/^\$ /.test(l)).join('\n');
const gon = (s) => s.replace(/^\$ DATABASE_URL=\S+ /gm, '$ ').split('\n').filter((l) => !/Environment variables loaded|Prisma schema loaded/.test(l)).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 2 — The schema language', bai: '2.1' }, [
  /* 1 */ { cover: true, nhan: 'Chapter 2 · Lesson 2.1', t: 'Models, fields and<br>the nine scalar types', sub: 'Every column you will ever declare: its type, the SQL it becomes, and the TypeScript you get back' },
  /* 2 */ { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The anatomy of a model: name · type · modifier · attributes</li>
    <li>The nine scalar types and the exact SQL each one generates — run for real</li>
    <li>Why <code>Float</code> is wrong for money, measured, and how <code>Decimal</code> behaves</li>
    <li>The two modifiers <code>?</code> and <code>[]</code> — and the combination that does not exist</li>
    <li>What the validator rejects, and the comment that is not a comment</li></ul>` },
  /* 3 */ { t: 'The anatomy of a model', body: prs(`model Post {
  // name    type      modifier   attributes
  id          Int       @id @default(autoincrement())
  title       String    @db.VarChar(200)
  body        String?
  tags        String[]
  price       Decimal?  @db.Decimal(12, 2)
  publishedAt DateTime? @map("published_at") @db.Timestamptz(3)
  authorId    Int       @map("author_id")
  author      User      @relation(fields: [authorId], references: [id])

  @@index([authorId, publishedAt])
  @@map("posts")
}`, { sm: true, hl: [2] }) + tbl(['Part', 'Rule'], [['Name', 'starts with a letter; camelCase fields, PascalCase models by convention'], ['Type', 'a scalar or an enum = a column · another model = a relation (Chapter 3)'], ['Modifier', '<code>?</code> optional or <code>[]</code> list — at most one'], ['Attributes', '<code>@…</code> on a field, <code>@@…</code> on the model (Lessons 2.2, 2.3)']]) },
  /* 4 */ { t: 'Nine types, one model, the SQL they become', body: two(prs(SRC('lab/p2/21/schema.prisma').split('\n').slice(11, 25).join('\n'), { sm: true }),
      sql(bo$(OUT('sql')).split('\n').slice(3, 18).join('\n').replace(' DEFAULT CURRENT_TIMESTAMP', '\n        DEFAULT CURRENT_TIMESTAMP'), { sm: true }), '') + `<div class="cap">npx prisma migrate diff --from-empty --to-schema-datamodel … --script</div>` +
    box('Read the SQL, not a table in the docs', '<code>Int</code> → INTEGER (32-bit, ±2.1 billion) · <code>BigInt</code> → BIGINT · <code>Float</code> → DOUBLE PRECISION · <code>String</code> → TEXT, which in PostgreSQL is exactly as fast as VARCHAR — a length limit is a constraint, not a speed-up.', 'lam') },
  /* 5 */ { t: 'What PostgreSQL actually created', body: tp(OUT('bang').split('\n').slice(0, 16).join('\n'), { wrap: 120, fs: 14 }) +
    box('Two defaults worth seeing', '<code>DateTime</code> → <code>timestamp(3) without time zone</code> (Lesson 2.4 explains why that bites) · <code>Decimal @db.Decimal(12, 2)</code> → <code>numeric(12,2)</code>; without <code>@db</code> it would be <code>DECIMAL(65,30)</code>.', 'lam') },
  /* 6 */ { t: 'And the TypeScript you get back', body: two(tp(OUT('kieu').replace(/^\$ .*$/m, '$ sed -n \'/\\$SampleTypePayload/,/composites/p\' gen/index.d.ts'), { wrap: 70, title: 'generated client — $SampleTypePayload scalars' }),
      tbl(['Prisma', 'TypeScript', 'Watch out'], [['BigInt', '<code>bigint</code>', 'JSON.stringify throws'], ['Decimal', '<code>Prisma.Decimal</code>', 'an object, not a number'], ['Json', '<code>JsonValue</code>', 'effectively untyped (2.5)'], ['Bytes', '<code>Prisma.Bytes</code>', 'Uint8Array — not for uploads'], ['DateTime', '<code>Date</code>', 'time zone (2.4)']]), '') +
    box('Only four of the nine surprise you', 'String, Int, Float and Boolean map to the TypeScript you expect. BigInt, Decimal, Json and Bytes each come back as something that is not a plain JSON value — every one of them needs a decision at your API boundary.', 'xanh') },
  /* 7 */ { t: 'The money trap, measured', body: ts(SRC('lab/p2/21/tien.mts').split('\n').slice(3, 10).join('\n'), { sm: true, hl: [5, 6, 7] }) +
    tp(gon(OUT('tien')).split('\n').slice(0, 3).join('\n'), { wrap: 100 }) +
    box('Ten cents, ten times, is not one dollar', 'In binary floating point 0.1 has no exact form. One row: a curiosity. A hundred thousand invoice lines: a reconciliation report that never balances. <code>Decimal</code> does base-10 arithmetic exactly.', 'do2') },
  /* 8 */ { t: 'Decimal is an object — and BigInt is not JSON', body: ts(SRC('lab/p2/21/tien.mts').split('\n').slice(10, 19).join('\n'), { sm: true, hl: [4, 7] }) +
    two(tp(gon(OUT('tien')).split('\n').slice(3).join('\n'), { wrap: 60 }),
      box('Measured on 6.19.3', '<code>price + 1</code> is string concatenation ("0.11"). <code>JSON.stringify</code> sends a Decimal as the string <code>"0.1"</code> — exact, but a string. A <code>bigint</code> makes it throw. Convert at the API boundary on purpose (Chapter 8).', 'lam'), '') },
  /* 9 */ { t: 'The two modifiers', body: prs(`model Example {
  id       Int      @id
  required String   // NOT NULL  → string
  optional String?  // NULL      → string | null
  list     String[] // TEXT[]    → string[]  (PostgreSQL, CockroachDB)
}`, { sm: true }) + cards([
      ['<code>?</code> optional', 'Nullable in the database <b>and</b> optional in create — two things in one mark. A required field with a <code>@default</code> is optional in create but still NOT NULL.'],
      ['<code>[]</code> list', 'A native array column. Filter with <code>has</code>, <code>hasSome</code>, <code>hasEvery</code>, <code>isEmpty</code>; fast only with <code>@@index([tags], type: Gin)</code>.'],
      ['<code>?[]</code>', 'Does not exist. A list of nullable values cannot be declared — the validator rejects the line (next slide).'],
    ], 3) },
  /* 10 */ { t: 'What the validator rejects', body: tp(gon(OUT('sai')).split('\n').filter((l) => !/^\[Context|^Prisma CLI Version|^\s*\|\s*$|^\s*\d+ \|\s*$|-->/.test(l)).join('\n'), { wrap: 110, fs: 13 }) +
    box('Run prisma format constantly', 'It aligns, orders attributes, adds back-relations it can infer — and validates, faster than generate. This run found one more rule: a model body cannot sit on one line.', 'xanh') },
  /* 11 */ { t: 'The comment that is not a comment', body: prs(SRC('lab/p2/21/schema.prisma').split('\n').slice(26).join('\n'), { sm: true, hl: [4, 5] }) +
    tp(OUT('jsdoc').replace(/^\$ .*$/m, '$ grep -n -B 4 "email: string" gen/index.d.ts'), { wrap: 110 }) +
    box('Triple slash travels with the field', '<code>//</code> stays in the schema. <code>///</code> becomes JSDoc in the generated client — the tooltip on <code>user.email</code> — and every other generator can read it through the DMMF.', 'lam') },
  /* 12 */ { t: 'Your turn — and what to keep', body: two(steps([
      `Write ${c('SampleType')}; run ${c('migrate diff --from-empty')} and read every column type`,
      `Add ten ${c('Float')} cents and ten ${c('Decimal')} cents; compare`,
      `Return a Decimal and a BigInt from an API; fix what breaks`,
      `Break the validator three ways; add a ${c('///')} comment and hover it`,
    ]), box('Keep these', `<ul><li>Nine scalars; each has one SQL type — read it, don't guess</li><li>Money is ${c('Decimal')}, never ${c('Float')}</li><li>${c('?')} or ${c('[]')}, never both</li><li>${c('///')} documents the field everywhere</li></ul>`, 'lam'), '') },
]);
