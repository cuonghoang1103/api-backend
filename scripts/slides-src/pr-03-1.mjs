/**
 * pr-03-1 — Prisma ORM · Chapter 3 · Lesson 3.1 "Two sides, one foreign key" (deck video, 12/11/2026). Bài web: pr-3-1-hai-phia.
 * Output THẬT (`chay.sh p3-1`, demo/lab/p3/31, CSDL c31, Prisma 6.19.3 · PostgreSQL 16.14): migrate diff ⇒ một cột author_id + FOREIGN KEY
 * "fk_post_author" ON DELETE RESTRICT ON UPDATE CASCADE · thiếu quan hệ ngược ⇒ P1012 "missing an opposite relation field" · prisma format tự thêm
 * `posts Post[]` · references không unique ⇒ P1012 · some ⇒ EXISTS, none ⇒ NOT EXISTS, _count ⇒ LEFT JOIN … GROUP BY · gán quan hệ: scalar = 1
 * INSERT; connect (kể cả theo id) = BEGIN + SELECT kiểm tồn tại + INSERT + SELECT + COMMIT (web nói "một câu" — SAI); create lồng = giao dịch;
 * author_id sai ⇒ P2003 constraint fk_post_author · \d posts có Foreign-key constraints.
 */
/* Output chạy THẬT, đóng băng từ thư mục demo của khoá video Prisma (12/11/2026) — deck tự chứa, không đọc tệp ngoài repo. */
const DU_LIEU = {
 "demo/out/p3-1/truyvan.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c31 npx tsx p3/31/truyvan.mts\n[] DELETE FROM \"posts\" WHERE 1=1 []\n[] DELETE FROM \"users\" WHERE 1=1 []\n[] INSERT INTO \"users\" (\"email\") VALUES ($1) RETURNING \"users\".\"id\", \"users\".\"email\" [\"an@x.com\"]\n[A scalar] INSERT INTO \"posts\" (\"title\",\"published\",\"author_id\") VALUES ($1,$2,$3) RETURNING \"posts\".\"id\", \"posts\".\"title\", \"posts\".\"published\", \"posts\".\"author_id\" [\"A\",false,1]\n[B connect id] BEGIN []\n[B connect id] SELECT \"users\".\"id\" FROM \"users\" WHERE (\"users\".\"id\" = $1 AND 1=1) LIMIT $2 OFFSET $3 [1,1,0]\n[B connect id] INSERT INTO \"posts\" (\"title\",\"published\",\"author_id\") VALUES ($1,$2,$3) RETURNING \"posts\".\"id\" [\"B\",false,1]\n[B connect id] SELECT \"posts\".\"id\", \"posts\".\"title\", \"posts\".\"published\", \"posts\".\"author_id\" FROM \"posts\" WHERE \"posts\".\"id\" = $1 LIMIT $2 OFFSET $3 [2,1,0]\n[B connect id] COMMIT []\n[B2 connect email] BEGIN []\n[B2 connect email] SELECT \"users\".\"id\" FROM \"users\" WHERE (\"users\".\"email\" = $1 AND 1=1) LIMIT $2 OFFSET $3 [\"an@x.com\",1,0]\n[B2 connect email] INSERT INTO \"posts\" (\"title\",\"published\",\"author_id\") VALUES ($1,$2,$3) RETURNING \"posts\".\"id\" [\"B2\",false,1]\n[B2 connect email] SELECT \"posts\".\"id\", \"posts\".\"title\", \"posts\".\"published\", \"posts\".\"author_id\" FROM \"posts\" WHERE \"posts\".\"id\" = $1 LIMIT $2 OFFSET $3 [3,1,0]\n[B2 connect email] COMMIT []\n[C nested] BEGIN []\n[C nested] INSERT INTO \"users\" (\"email\") VALUES ($1) RETURNING \"users\".\"id\" [\"moi@x.com\"]\n[C nested] INSERT INTO \"posts\" (\"title\",\"published\",\"author_id\") VALUES ($1,$2,$3) RETURNING \"posts\".\"id\" [\"C\",false,2]\n[C nested] SELECT \"posts\".\"id\", \"posts\".\"title\", \"posts\".\"published\", \"posts\".\"author_id\" FROM \"posts\" WHERE \"posts\".\"id\" = $1 LIMIT $2 OFFSET $3 [4,1,0]\n[C nested] COMMIT []\n[some] SELECT \"users\".\"id\", \"users\".\"email\" FROM \"users\" WHERE EXISTS(SELECT \"t0\".\"author_id\" FROM \"posts\" AS \"t0\" WHERE (\"t0\".\"published\" = $1 AND (\"users\".\"id\") = (\"t0\".\"author_id\") AND \"t0\".\"author_id\" IS NOT NULL)) OFFSET $2 [true,0]\n[none] SELECT \"users\".\"id\", \"users\".\"email\" FROM \"users\" WHERE NOT EXISTS(SELECT \"t0\".\"author_id\" FROM \"posts\" AS \"t0\" WHERE (1=1 AND (\"users\".\"id\") = (\"t0\".\"author_id\") AND \"t0\".\"author_id\" IS NOT NULL)) OFFSET $1 [0]\n[_count] SELECT \"users\".\"id\", \"users\".\"email\", COALESCE(\"aggr_selection_0_Post\".\"_aggr_count_posts\", 0) AS \"_aggr_count_posts\" FROM \"users\" LEFT JOIN (SELECT \"posts\".\"author_id\", COUNT(*) AS \"_aggr_count_posts\" FROM \"posts\" WHERE 1=1 GROUP [0]\n[{\"email\":\"an@x.com\",\"_count\":{\"posts\":3}},{\"email\":\"moi@x.com\",\"_count\":{\"posts\":1}}]\n[] INSERT INTO \"posts\" (\"title\",\"published\",\"author_id\") VALUES ($1,$2,$3) RETURNING \"posts\".\"id\", \"posts\".\"title\", \"posts\".\"published\", \"posts\".\"author_id\" [\"X\",false,9999]\nP2003? P2003 { modelName: 'Post', constraint: 'fk_post_author' }\n",
 "demo/lab/p3/31/schema.prisma": "generator client {\n  provider = \"prisma-client-js\"\n  output   = \"./gen\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n  url      = env(\"DATABASE_URL\")\n}\n\nmodel User {\n  id    Int    @id @default(autoincrement())\n  email String @unique\n  posts Post[] // ③ back-relation — NO column exists for this\n\n  @@map(\"users\")\n}\n\nmodel Post {\n  id        Int     @id @default(autoincrement())\n  title     String\n  published Boolean @default(false)\n  authorId  Int     @map(\"author_id\") // ① the scalar — THIS is the real column\n  author    User    @relation(fields: [authorId], references: [id], map: \"fk_post_author\") // ② the link\n\n  @@index([authorId])\n  @@map(\"posts\")\n}\n",
 "demo/out/p3-1/sql.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c31 npx prisma migrate diff --from-empty --to-schema-datamodel p3/31/schema.prisma --script | grep -v '^$'\n-- CreateSchema\nCREATE SCHEMA IF NOT EXISTS \"public\";\n-- CreateTable\nCREATE TABLE \"users\" (\n    \"id\" SERIAL NOT NULL,\n    \"email\" TEXT NOT NULL,\n    CONSTRAINT \"users_pkey\" PRIMARY KEY (\"id\")\n);\n-- CreateTable\nCREATE TABLE \"posts\" (\n    \"id\" SERIAL NOT NULL,\n    \"title\" TEXT NOT NULL,\n    \"published\" BOOLEAN NOT NULL DEFAULT false,\n    \"author_id\" INTEGER NOT NULL,\n    CONSTRAINT \"posts_pkey\" PRIMARY KEY (\"id\")\n);\n-- CreateIndex\nCREATE UNIQUE INDEX \"users_email_key\" ON \"users\"(\"email\");\n-- CreateIndex\nCREATE INDEX \"posts_author_id_idx\" ON \"posts\"(\"author_id\");\n-- AddForeignKey\nALTER TABLE \"posts\" ADD CONSTRAINT \"fk_post_author\" FOREIGN KEY (\"author_id\") REFERENCES \"users\"(\"id\") ON DELETE RESTRICT ON UPDATE CASCADE;\n",
 "demo/out/p3-1/bang.txt": "$ docker exec prisma-pg psql -U student -d c31 -c '\\d posts' | sed -n '/Indexes/,$p'\nIndexes:\n    \"posts_pkey\" PRIMARY KEY, btree (id)\n    \"posts_author_id_idx\" btree (author_id)\nForeign-key constraints:\n    \"fk_post_author\" FOREIGN KEY (author_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE RESTRICT\n\n",
 "demo/lab/p3/31/thieu.prisma": "datasource db {\n  provider = \"postgresql\"\n  url      = env(\"DATABASE_URL\")\n}\n\n// Post declares the relation; User says nothing back\nmodel User {\n  id Int @id @default(autoincrement())\n}\n\nmodel Post {\n  id       Int  @id @default(autoincrement())\n  authorId Int\n  author   User @relation(fields: [authorId], references: [id])\n}\n",
 "demo/out/p3-1/thieu.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c31 npx prisma validate --schema p3/31/thieu.prisma 2>&1 | grep -vE '^\\s*$|Environment|schema loaded|Context|CLI Version'\nError: Prisma schema validation - (validate wasm)\nError code: P1012\nerror: Error validating field `author` in model `Post`: The relation field `author` on model `Post` is missing an opposite relation field on the model `User`. Either run `prisma format` or add it manually.\n  -->  p3/31/thieu.prisma:14\n   | \n13 |   authorId Int\n14 |   author   User @relation(fields: [authorId], references: [id])\n15 | }\n   | \nValidation Error Count: 1\n",
 "demo/out/p3-1/format.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c31 npx prisma format --schema /tmp/pr31-format.prisma 2>&1 | grep -E 'Formatted|rror'; sed -n '/^model User/,/^}/p' /tmp/pr31-format.prisma\nFormatted ../../../../../../../../tmp/pr31-format.prisma in 52ms 🚀\nmodel User {\n  id    Int    @id @default(autoincrement())\n  posts Post[]\n}\n",
 "demo/lab/p3/31/khongduynhat.prisma": "datasource db {\n  provider = \"postgresql\"\n  url      = env(\"DATABASE_URL\")\n}\n\nmodel User {\n  id    Int    @id @default(autoincrement())\n  email String\n  posts Post[]\n}\n\nmodel Post {\n  id          Int    @id @default(autoincrement())\n  authorEmail String\n  author      User   @relation(fields: [authorEmail], references: [email])\n}\n",
 "demo/out/p3-1/khongduynhat.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c31 npx prisma validate --schema p3/31/khongduynhat.prisma 2>&1 | grep -vE '^\\s*$|Environment|schema loaded|Context|CLI Version'\nError: Prisma schema validation - (validate wasm)\nError code: P1012\nerror: Error parsing attribute \"@relation\": The argument `references` must refer to a unique criterion in the related model. Consider adding an `@unique` attribute to the field `email` in the model `User`.\n  -->  p3/31/khongduynhat.prisma:15\n   | \n14 |   authorEmail String\n15 |   author      User   @relation(fields: [authorEmail], references: [email])\n16 | }\n   | \nValidation Error Count: 1\n"
};
const fs = { readFileSync: (p) => { const k = String(p); if (!(k in DU_LIEU)) throw new Error('thiếu dữ liệu đóng băng: ' + k); return DU_LIEU[k]; } };
import { lamDeck, prs, ts, tp, sql, two, box, cards, c, tbl, steps } from './_pr-chung.mjs';

export const deck = { key: 'pr-03-1', code: 'PR 3.1', title: 'Two sides, one foreign key', sub: 'Chapter 3 · Lesson 3.1' };

const DEMO = 'demo';
const OUT = (t) => fs.readFileSync(`${DEMO}/out/p3-1/${t}.txt`, 'utf8').replace(/\n+$/, '');
const SRC = (t) => fs.readFileSync(`${DEMO}/lab/p3/31/${t}`, 'utf8').replace(/\n+$/, '');
const model = (f, ten) => SRC(f).match(new RegExp(`model ${ten} \\{[\\s\\S]*?\\n\\}`))[0];
const gon = (s) => s.replace(/^\$ DATABASE_URL=\S+ /gm, '$ ').replace(/^\$ docker exec prisma-pg psql -U student -d c31 /gm, '$ psql ')
  .split('\n').filter((l) => !/^\s*\|?\s*$/.test(l)).join('\n');
const LOG = OUT('truyvan').split('\n');
const postsSql = () => { const t = OUT('sql'); return [t.match(/CREATE TABLE "posts" \([\s\S]*?\n\);/)[0], t.match(/CREATE INDEX "posts_author_id_idx".*/)[0], t.match(/ALTER TABLE "posts" ADD CONSTRAINT.*/)[0].replace(' FOREIGN KEY', '\n  FOREIGN KEY').replace(' REFERENCES', '\n  REFERENCES').replace(' ON DELETE', '\n  ON DELETE')].join('\n'); };
const nhom = (...k) => LOG.filter((l) => k.some((x) => l.startsWith(`[${x}]`))).map((l) => l.replace(/ RETURNING [^[]*/, ' RETURNING …').replace(/ \[[^\]]*\]$/, '')).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 3 — Relations', bai: '3.1' }, [
  /* 1 */ { cover: true, nhan: 'Chapter 3 · Lesson 3.1', t: 'Two sides,<br>one foreign key', sub: 'A relation is one column in the database — and three fields in your schema' },
  /* 2 */ { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Three fields in the schema, one column in the database — labelled</li>
    <li>The error every first relation meets, and the command that fixes it</li>
    <li>The arguments of <code>@relation</code>, and which side owns the key</li>
    <li>What each side of a relation gives the client — with the SQL</li>
    <li>Three ways to set a relation, and what each one really sends</li></ul>` },
  /* 3 */ { t: 'The anatomy, labelled', body: prs(SRC('schema.prisma').split('\n').slice(10).join('\n').replace(/\n\n  @@/g, '\n  @@'), { sm: true, hl: [4, 12, 13] }) +
    tbl(['', 'Field', 'Exists in'], [['①', '<code>authorId Int @map("author_id")</code> — the scalar', '<b>the database</b>: a real column'], ['②', '<code>author User @relation(…)</code> — the link', 'the generated client only'], ['③', '<code>posts Post[]</code> — the back-relation', 'the generated client only']]) },
  /* 4 */ { t: 'In the database: one column, one constraint', body: two(sql(postsSql(), { sm: true }),
      tp(gon(OUT('bang')).replace(/^\$ .*$/m, "$ psql -c '\\d posts'"), { wrap: 44, fs: 13 }), 'r64') +
    box('Only ① is real', '<code>author_id INTEGER NOT NULL</code> plus a FOREIGN KEY named by <code>map:</code>. A required relation gets <code>ON DELETE RESTRICT ON UPDATE CASCADE</code> by default. ② and ③ exist only so your code can traverse the relation.', 'lam') },
  /* 5 */ { t: 'The error every first relation meets', body: two(prs(SRC('thieu.prisma').split('\n').slice(6).join('\n'), { sm: true, hl: [8] }),
      tp(gon(OUT('thieu')).replace(/^\$ .*$/m, '$ npx prisma validate'), { wrap: 40, fs: 12 }), 'r64') +
    box('Post declares the relation; User says nothing back', 'Without the opposite field Prisma cannot express the relation in both directions, so validate (and generate) refuse to run — P1012.', 'do2') },
  /* 6 */ { t: 'The fix is in the message: prisma format', body: tp(gon(OUT('format')).replace(/^\$ .*$/m, '$ npx prisma format ; sed -n "/^model User/,/^}/p" schema.prisma').replace(/Formatted .*prisma in/, 'Formatted schema.prisma in'), { wrap: 110, fs: 16 }) +
    box('From the CuongThai codebase — 2026-06-29', 'This exact error blocked a <code>prisma generate</code>: NoteSubjectShare and NoteSubjectShareRecipient declared relations whose opposite fields did not exist. The rule written into the repository: every relation needs its opposite field. Bind <code>prisma format</code> to save.', 'xanh') },
  /* 7 */ { t: 'The arguments of @relation', body: prs(`author User @relation(
  name:       "PostsByAuthor",   // disambiguates multiple relations — Lesson 3.5
  fields:     [authorId],        // which local scalar(s) hold the value
  references: [id],              // which column(s) on the other model
  onDelete:   Cascade,           // when the referenced row is deleted — Lesson 3.2
  onUpdate:   Cascade,           // when the referenced key changes
  map:        "fk_post_author"   // the constraint name in the database
)`, { sm: true }) + `<div class="cap">every argument at once (illustration)</div>` + cards([
      ['fields + references', 'Always together, always the same length, on one side only. That side owns the foreign key.'],
      ['name ≠ map', '<code>name</code> tells two relations apart in Prisma; <code>map</code> names the SQL constraint — the same trap as <code>@@unique</code> in 2.3.'],
      ['composite keys', '<code>fields: [tenantId, userId]</code> → a two-column foreign key; the target needs a matching <code>@@id</code> or <code>@@unique</code>.'],
    ], 3) },
  /* 8 */ { t: 'references must point at something unique', body: two(prs(SRC('khongduynhat.prisma').split('\n').slice(5).join('\n').replace(/(\S) {2,}/g, '$1 '), { sm: true, hl: [3, 10] }),
      tp(gon(OUT('khongduynhat')).replace(/^\$ .*$/m, '$ npx prisma validate'), { wrap: 46, fs: 12 }), 'r64') +
    box('SQL requires it — and so does Prisma', 'A foreign key must reference a primary key, a <code>@unique</code> field or a <code>@@unique</code> combination — rejected before anything runs.', 'lam') },
  /* 9 */ { t: 'Which side owns the key? The rule is mechanical', body: cards([
      ['1 → many', 'The "many" side owns it: many posts, one author → <code>Post.authorId</code>. A list of ids does not fit in one column.'],
      ['1 → 1', 'You choose, and it matters: put it on the optional side that is created later — Lesson 3.3.'],
      ['many ↔ many', 'Neither: a third table owns both keys, implicit or explicit — Lesson 3.4.'],
      ['self', 'Same model on both sides — a comment replying to a comment. Needs a relation name — Lesson 3.5.'],
    ], 2) },
  /* 10 */ { t: 'What the client gains from each side', body: ts(`await prisma.user.findMany({ where: { posts: { some: { published: true } } } });
await prisma.user.findMany({ where: { posts: { none: {} } } });           // users with no posts
await prisma.user.findMany({ select: { email: true, _count: { select: { posts: true } } } });`, { sm: true }) +
    tp(nhom('some', 'none', '_count').replace(/\[(some|none|_count)\] /g, ''), { wrap: 120, fs: 12, title: 'query log — Prisma 6.19.3' }) +
    box('some → EXISTS · none → NOT EXISTS · _count → LEFT JOIN … GROUP BY', 'Exactly what you would write by hand, and what the planner likes. The back-relation has no column, yet it is what makes these filters possible.', 'xanh') },
  /* 11 */ { t: 'Setting a relation: three ways, one column', body: tp(nhom('A scalar', 'B connect id', 'C nested').replace(/^\[(A scalar|B connect id|C nested)\] /gm, (m, k) => `${k.padEnd(13)}│ `), { wrap: 130, fs: 12, title: 'query log — authorId directly · connect: { id } · create nested' }) +
    two(box('connect is not free', 'Even by primary key, <code>connect</code> opens a transaction and SELECTs the author first — five statements against one. Writing the scalar skips the check and lets PostgreSQL reject a bad id: <code>P2003</code> on <code>fk_post_author</code>.', 'do2'),
      box('Nested create', 'Parent first, then child, in one transaction — the new user’s id flows straight into <code>author_id</code>.', 'lam'), '') },
  /* 12 */ { t: 'Your turn — and what to keep', body: two(steps([
      `Write User/Post without ${c('posts Post[]')}; run ${c('validate')}, then ${c('format')}`,
      `Point ${c('references')} at a non-unique column; read the error`,
      `Turn on the query log; compare ${c('authorId: 1')} with ${c('connect: { id: 1 }')}`,
      `Filter users by ${c('some')}, ${c('none')}; count with ${c('_count')}`,
    ]), box('Keep these', `<ul><li>One column, three fields</li><li>Every relation needs its opposite — ${c('prisma format')} adds it</li><li>The side with ${c('fields')} owns the key</li><li>${c('connect')} checks first; the scalar does not</li></ul>`, 'lam'), '') },
]);
