/**
 * pr-03-4 — Prisma ORM · Chapter 3 · Lesson 3.4 "Many-to-many: implicit versus explicit" (deck video, 12/11/2026). Bài web: pr-3-4-nhieu-nhieu.
 * Output THẬT (`chay.sh p3-4`, demo/lab/p3/34, CSDL c34, Prisma 6.19.3 · PostgreSQL 16.14): bảng _CategoryToPost cột A/B, PK ("A","B"), FK ON UPDATE
 * CASCADE ON DELETE CASCADE · connect = INSERT … ON CONFLICT DO NOTHING · disconnect = SELECT + DELETE · set = SELECT + DELETE mọi liên kết hiện có +
 * INSERT danh sách mới · migrate diff ẩn → tường minh = DROP TABLE "_CategoryToPost" (mất liên kết) · SQL viết tay chép "B","A" ⇒ giữ 4/4 liên kết,
 * diff sau "empty migration" · tạo qua bảng nối tường minh (isPrimary) · xoá category còn liên kết ⇒ P2003 (Restrict).
 */
/* Output chạy THẬT, đóng băng từ thư mục demo của khoá video Prisma (12/11/2026) — deck tự chứa, không đọc tệp ngoài repo. */
const DU_LIEU = {
 "demo/out/p3-4/api.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c34 npx tsx p3/34/api.mts\n[create+connect] INSERT INTO \"_CategoryToPost\" (\"B\",\"A\") VALUES ($1,$2), ($3,$4) ON CONFLICT DO NOTHING [1,1,1,2]\n[connect+disconnect] INSERT INTO \"_CategoryToPost\" (\"B\",\"A\") VALUES ($1,$2) ON CONFLICT DO NOTHING [1,3]\n[connect+disconnect] SELECT \"_CategoryToPost\".\"B\", \"_CategoryToPost\".\"A\" FROM \"_CategoryToPost\" WHERE \"_CategoryToPost\".\"B\" IN ($1) [1]\n[connect+disconnect] DELETE FROM \"_CategoryToPost\" WHERE (\"_CategoryToPost\".\"B\" = ($1) AND \"_CategoryToPost\".\"A\" IN ($2)) [1,1]\n[set] SELECT \"_CategoryToPost\".\"B\", \"_CategoryToPost\".\"A\" FROM \"_CategoryToPost\" WHERE \"_CategoryToPost\".\"B\" IN ($1) [1]\n[set] DELETE FROM \"_CategoryToPost\" WHERE (\"_CategoryToPost\".\"B\" = ($1) AND \"_CategoryToPost\".\"A\" IN ($2,$3)) [1,2,3]\n[set] INSERT INTO \"_CategoryToPost\" (\"B\",\"A\") VALUES ($1,$2), ($3,$4) ON CONFLICT DO NOTHING [1,2,1,4]\nnodejs:1 postgres:1 prisma:0 docker:2\n",
 "demo/lab/p3/34/an.prisma": "generator client {\n  provider = \"prisma-client-js\"\n  output   = \"./gen\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n  url      = env(\"DATABASE_URL\")\n}\n\nmodel Post {\n  id         Int        @id @default(autoincrement())\n  title      String\n  categories Category[] // that is all\n}\n\nmodel Category {\n  id    Int    @id @default(autoincrement())\n  name  String @unique\n  posts Post[] // and that\n}\n",
 "demo/out/p3-4/bang-an.txt": "$ docker exec prisma-pg psql -U student -d c34 -c '\\d \"_CategoryToPost\"'\n          Table \"public._CategoryToPost\"\n Column |  Type   | Collation | Nullable | Default \n--------+---------+-----------+----------+---------\n A      | integer |           | not null | \n B      | integer |           | not null | \nIndexes:\n    \"_CategoryToPost_AB_pkey\" PRIMARY KEY, btree (\"A\", \"B\")\n    \"_CategoryToPost_B_index\" btree (\"B\")\nForeign-key constraints:\n    \"_CategoryToPost_A_fkey\" FOREIGN KEY (\"A\") REFERENCES \"Category\"(id) ON UPDATE CASCADE ON DELETE CASCADE\n    \"_CategoryToPost_B_fkey\" FOREIGN KEY (\"B\") REFERENCES \"Post\"(id) ON UPDATE CASCADE ON DELETE CASCADE\n\n",
 "demo/lab/p3/34/ro.prisma": "generator client {\n  provider = \"prisma-client-js\"\n  output   = \"./gen-ro\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n  url      = env(\"DATABASE_URL\")\n}\n\nmodel Post {\n  id         Int            @id @default(autoincrement())\n  title      String\n  categories PostCategory[]\n}\n\nmodel Category {\n  id    Int            @id @default(autoincrement())\n  name  String         @unique\n  posts PostCategory[]\n}\n\nmodel PostCategory {\n  postId     Int      @map(\"post_id\")\n  categoryId Int      @map(\"category_id\")\n  // The reason to do this at all: the join carries data\n  attachedAt DateTime @default(now()) @map(\"attached_at\")\n  isPrimary  Boolean  @default(false) @map(\"is_primary\")\n  post       Post     @relation(fields: [postId], references: [id], onDelete: Cascade)\n  category   Category @relation(fields: [categoryId], references: [id], onDelete: Restrict)\n\n  @@id([postId, categoryId])\n  @@index([categoryId])\n  @@map(\"post_category\")\n}\n",
 "demo/out/p3-4/diff-nguy.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c34 npx prisma migrate diff --from-schema-datasource p3/34/an.prisma --to-schema-datamodel p3/34/ro.prisma --script | grep -E 'Drop|DROP|Create|CREATE TABLE'\n-- DropForeignKey\nALTER TABLE \"_CategoryToPost\" DROP CONSTRAINT \"_CategoryToPost_A_fkey\";\n-- DropForeignKey\nALTER TABLE \"_CategoryToPost\" DROP CONSTRAINT \"_CategoryToPost_B_fkey\";\n-- DropTable\nDROP TABLE \"_CategoryToPost\";\n-- CreateTable\nCREATE TABLE \"post_category\" (\n-- CreateIndex\n",
 "demo/lab/p3/34/chuyen.sql": "-- Implicit → explicit, keeping every link. Hand-written (migrate diff would DROP the old table).\nCREATE TABLE \"post_category\" (\n    \"post_id\" INTEGER NOT NULL,\n    \"category_id\" INTEGER NOT NULL,\n    \"attached_at\" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,\n    \"is_primary\" BOOLEAN NOT NULL DEFAULT false,\n    CONSTRAINT \"post_category_pkey\" PRIMARY KEY (\"post_id\",\"category_id\")\n);\n-- In _CategoryToPost, \"A\" is Category (alphabetically first) and \"B\" is Post\nINSERT INTO \"post_category\" (\"post_id\", \"category_id\") SELECT \"B\", \"A\" FROM \"_CategoryToPost\";\nCREATE INDEX \"post_category_category_id_idx\" ON \"post_category\"(\"category_id\");\nALTER TABLE \"post_category\" ADD CONSTRAINT \"post_category_post_id_fkey\"\n  FOREIGN KEY (\"post_id\") REFERENCES \"Post\"(\"id\") ON DELETE CASCADE ON UPDATE CASCADE;\nALTER TABLE \"post_category\" ADD CONSTRAINT \"post_category_category_id_fkey\"\n  FOREIGN KEY (\"category_id\") REFERENCES \"Category\"(\"id\") ON DELETE RESTRICT ON UPDATE CASCADE;\nDROP TABLE \"_CategoryToPost\";\n",
 "demo/out/p3-4/chuyen.txt": "$ docker exec -i prisma-pg psql -U student -d c34 < p3/34/chuyen.sql\nCREATE TABLE\nINSERT 0 4\nCREATE INDEX\nALTER TABLE\nALTER TABLE\nDROP TABLE\n",
 "demo/out/p3-4/diff-sau.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c34 npx prisma migrate diff --from-schema-datasource p3/34/ro.prisma --to-schema-datamodel p3/34/ro.prisma --script\n-- This is an empty migration.\n\n",
 "demo/out/p3-4/ro.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c34 npx tsx p3/34/ro.mts\nlinks kept: 4\n1-2 1-4 2-1 2-4 3-3*\ndelete category 3: P2003\n"
};
const fs = { readFileSync: (p) => { const k = String(p); if (!(k in DU_LIEU)) throw new Error('thiếu dữ liệu đóng băng: ' + k); return DU_LIEU[k]; } };
import { lamDeck, prs, ts, tp, sql, two, box, cards, c, tbl, steps } from './_pr-chung.mjs';

export const deck = { key: 'pr-03-4', code: 'PR 3.4', title: 'Many-to-many: implicit versus explicit', sub: 'Chapter 3 · Lesson 3.4' };

const DEMO = 'demo';
const OUT = (t) => fs.readFileSync(`${DEMO}/out/p3-4/${t}.txt`, 'utf8').replace(/\n+$/, '');
const SRC = (t) => fs.readFileSync(`${DEMO}/lab/p3/34/${t}`, 'utf8').replace(/\n+$/, '');
const model = (f, ten) => (SRC(f).match(new RegExp(`model ${ten} \\{[\\s\\S]*?\\n\\}`)) || [''])[0].replace(/ +\/\/.*$/gm, '').replace(/^ *\/\/.*\n/gm, '').split('\n').filter((l) => l.trim()).join('\n');
const models = (f) => (SRC(f).match(/model [\s\S]*?\n\}/g) || []).join('\n\n');
const gon = (s) => s.replace(/^\$ DATABASE_URL=\S+ /gm, '$ ').replace(/^\$ docker exec (-i )?prisma-pg psql -U student -d c34 /gm, '$ psql ').split('\n').filter((l) => !/^\s*\|?\s*$/.test(l)).join('\n');
const API = OUT('api').split('\n').filter((l) => /^\[/.test(l)).map((l) => l.replace(/ \[[^\]]*\]$/, '').replace(/"_CategoryToPost"\./g, ''));

export const slides = lamDeck({ chuong: 'Chapter 3 — Relations', bai: '3.4' }, [
  /* 1 */ { cover: true, nhan: 'Chapter 3 · Lesson 3.4', t: 'Many-to-many:<br>implicit versus explicit', sub: 'A third table either way — the question is whether you own it' },
  /* 2 */ { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Implicit: two lines in the schema, and the table Prisma makes for you</li>
    <li>connect, disconnect, set — and the SQL each one sends</li>
    <li>Explicit: the join table as a model you own</li>
    <li>Moving from implicit to explicit without losing a single link</li>
    <li>How to choose</li></ul>` },
  /* 3 */ { t: 'Implicit: two lines, no join model', body: two(prs(models('an.prisma').replace(/ +\/\/.*$/gm, ''), { sm: true, hl: [4, 10] }), tp(gon(OUT('bang-an')), { wrap: 50, fs: 14 }), '') },
  /* 4 */ { t: 'What that table is', body: cards([
      ['Name', '<code>_</code> + both models, alphabetically: <code>_CategoryToPost</code>. Alphabetical order also decides who is <code>A</code> (Category) and who is <code>B</code> (Post).'],
      ['Columns', 'Exactly <code>A</code> and <code>B</code>. No id, no timestamps, no extra fields. The primary key is the pair — a duplicate link is impossible.'],
      ['Cascades', 'Always ON DELETE CASCADE on both sides, not configurable.'],
      ['Visibility', 'Absent from the client: there is no <code>prisma.categoryToPost</code>. Only connect, disconnect and set.'],
    ], 2) },
  /* 5 */ { t: 'connect, disconnect, set — the SQL', body: ts(`await prisma.post.create({ data: { title: 'A', categories: { connect: [{ id: 1 }, { id: 2 }] } } });
await prisma.post.update({ where: { id: 1 }, data: { categories: { connect: [{ id: 3 }], disconnect: [{ id: 1 }] } } });
await prisma.post.update({ where: { id: 1 }, data: { categories: { set: [{ id: 2 }, { id: 4 }] } } });`, { sm: true }) +
    tp(API.join('\n'), { wrap: 120, fs: 13, title: 'query log — statements on _CategoryToPost' }) +
    cards([
      ['connect', 'One <code>INSERT … ON CONFLICT DO NOTHING</code> — no read first.'],
      ['disconnect', 'A <code>SELECT</code> of the current links, then a <code>DELETE</code>.'],
      ['set', '<code>SELECT</code>, <code>DELETE</code>, <code>INSERT</code> — three statements.'],
    ], 3) },
  /* 6 */ { t: 'Trap: set replaces the whole list', body: tp(API.filter((l) => l.startsWith('[set]')).join('\n'), { wrap: 120, fs: 15, title: 'set: [{ id: 2 }, { id: 4 }] — current links were 2 and 3' }) +
    box('A replace, not a merge', 'Every current link is deleted — even link 2, which is in the new list — and the new list is inserted. <code>set: []</code> clears the relation. To add or remove one item, use connect or disconnect.', 'do2') +
    box('connect is idempotent', '<code>INSERT … ON CONFLICT DO NOTHING</code>: connecting a link that already exists is not an error.', 'lam') },
  /* 7 */ { t: 'Explicit: the join table as a model you own', body: two(prs(model('ro.prisma', 'Post'), { sm: true }), prs(model('ro.prisma', 'Category'), { sm: true }), '') + prs(model('ro.prisma', 'PostCategory'), { sm: true, hl: [4, 5, 6, 7] }) },
  /* 8 */ { t: 'What you get for the extra code', body: cards([
      ['A delegate', '<code>prisma.postCategory</code> with findMany, createMany, deleteMany, groupBy — the join is an ordinary model.'],
      ['Extra columns', 'When the link was made, who made it, whether it is the primary category, a sort order.'],
      ['Per-side cascades', 'Delete a post → its links go (Cascade). Delete a category still in use → refused (Restrict).'],
      ['More verbosity', 'connect becomes a nested create through the join model; every query gains one level.'],
    ], 2) },
  /* 9 */ { t: 'Moving to explicit: what migrate diff would do', body: tp(gon(OUT('diff-nguy')).replace(/^\$ .*$/m, '$ npx prisma migrate diff --from-schema-datasource an.prisma --to-schema-datamodel ro.prisma --script | grep …'), { wrap: 120, fs: 15 }) +
    box('DROP TABLE "_CategoryToPost"', 'Prisma sees one table disappear and another appear — it cannot know they hold the same links. Apply this as generated and every link is gone. The migration must be written by hand.', 'do2') },
  /* 10 */ { t: 'The hand-written migration', body: sql(SRC('chuyen.sql'), { sm: true, hl: [9, 10] }) +
    box('"A" is Category, "B" is Post', 'Alphabetical order again: the copy selects <code>"B", "A"</code> into <code>(post_id, category_id)</code>. Copy first, drop last — the reverse of what migrate diff generated.', 'xanh') },
  /* 11 */ { t: 'The proof: every link survived', body: tp(gon(OUT('chuyen')).replace(/^\$ .*$/m, '$ psql < chuyen.sql') + '\n' + gon(OUT('diff-sau')).replace(/^\$ .*$/m, '$ npx prisma migrate diff --from-schema-datasource ro.prisma --to-schema-datamodel ro.prisma --script') + '\n' + gon(OUT('ro')).replace(/^\$ .*$/m, '$ npx tsx ro.mts'), { wrap: 120, fs: 17 }) +
    box('4 rows copied, no drift, rules in force', '<code>INSERT 0 4</code>; migrate diff finds nothing to do; <code>count()</code> on the new model is 4; a new link carries <code>isPrimary</code> (<code>3-3*</code>); deleting a category still in use is refused (P2003, Restrict).', 'lam') },
  /* 12 */ { t: 'How to choose', body: tbl(['Choose', 'When'], [
      ['implicit', 'the link is just a link — tags on a post, members of a group — and you will never need to know when or by whom it was made'],
      ['explicit', 'the link carries data, needs its own cascade rules, or must be queried and counted on its own'],
      ['explicit from the start', 'when you are not sure: converting later is the hand-written migration you just saw'],
    ]) + box('Most real projects end up explicit', 'Implicit is delightful for the first months. The day someone asks "when was this tag added?" you need the migration on slide 10.', 'lam') },
  /* 13 */ { t: 'Your turn — and what to keep', body: two(steps([
      `Declare an implicit many-to-many; read ${c('\\d "_CategoryToPost"')}`,
      `Turn on the query log; run connect, disconnect and ${c('set')}`,
      `Read what ${c('migrate diff')} would do when you go explicit`,
      `Write the copy-then-drop migration; check the link count`,
    ]), box('Keep these', `<ul><li>Implicit = ${c('_AToB')}, columns A/B, cascades only</li><li>${c('set')} replaces the whole list</li><li>Explicit = a model you own: data, cascades, a delegate</li><li>Never let a generated DROP eat your links</li></ul>`, 'lam'), '') },
]);
