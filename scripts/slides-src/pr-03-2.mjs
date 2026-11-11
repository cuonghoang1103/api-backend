/**
 * pr-03-2 — Prisma ORM · Chapter 3 · Lesson 3.2 "One-to-many, and the five onDelete behaviours" (deck video, 12/11/2026). Bài web: pr-3-2-mot-nhieu.
 * Output THẬT (`chay.sh p3-2`, demo/lab/p3/32, CSDL c32, Prisma 6.19.3 · PostgreSQL 16.14): năm cặp model, mỗi cặp một onDelete; một tác giả + 3 bài,
 * xoá tác giả: Restrict ⇒ P2003 · Cascade ⇒ 0 bài · SetNull ⇒ author_id NULL · SetDefault ⇒ về tác giả 1 ("unknown") · NoAction ⇒ P2003 ·
 * SetNull trên quan hệ BẮT BUỘC ⇒ chỉ là CẢNH BÁO, lược đồ vẫn "valid" (web nói Prisma từ chối — SAI) · migrate diff ⇒ ON DELETE … ON UPDATE CASCADE.
 */
/* Output chạy THẬT, đóng băng từ thư mục demo của khoá video Prisma (12/11/2026) — deck tự chứa, không đọc tệp ngoài repo. */
const DU_LIEU = {
 "demo/lab/p3/32/schema.prisma": "generator client {\n  provider = \"prisma-client-js\"\n  output   = \"./gen\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n  url      = env(\"DATABASE_URL\")\n}\n\nmodel AuthorRestrict {\n  id    Int      @id @default(autoincrement())\n  email String   @unique\n  posts PostRestrict[]\n}\n\nmodel PostRestrict {\n  id       Int     @id @default(autoincrement())\n  title    String\n  authorId Int\n  author   AuthorRestrict @relation(fields: [authorId], references: [id], onDelete: Restrict)\n\n  @@index([authorId])\n}\n\nmodel AuthorCascade {\n  id    Int      @id @default(autoincrement())\n  email String   @unique\n  posts PostCascade[]\n}\n\nmodel PostCascade {\n  id       Int     @id @default(autoincrement())\n  title    String\n  authorId Int\n  author   AuthorCascade @relation(fields: [authorId], references: [id], onDelete: Cascade)\n\n  @@index([authorId])\n}\n\nmodel AuthorSetNull {\n  id    Int      @id @default(autoincrement())\n  email String   @unique\n  posts PostSetNull[]\n}\n\nmodel PostSetNull {\n  id       Int     @id @default(autoincrement())\n  title    String\n  authorId Int?\n  author   AuthorSetNull? @relation(fields: [authorId], references: [id], onDelete: SetNull)\n\n  @@index([authorId])\n}\n\nmodel AuthorSetDefault {\n  id    Int      @id @default(autoincrement())\n  email String   @unique\n  posts PostSetDefault[]\n}\n\nmodel PostSetDefault {\n  id       Int     @id @default(autoincrement())\n  title    String\n  authorId Int @default(1)\n  author   AuthorSetDefault @relation(fields: [authorId], references: [id], onDelete: SetDefault)\n\n  @@index([authorId])\n}\n\nmodel AuthorNoAction {\n  id    Int      @id @default(autoincrement())\n  email String   @unique\n  posts PostNoAction[]\n}\n\nmodel PostNoAction {\n  id       Int     @id @default(autoincrement())\n  title    String\n  authorId Int\n  author   AuthorNoAction @relation(fields: [authorId], references: [id], onDelete: NoAction)\n\n  @@index([authorId])\n}\n",
 "demo/out/p3-2/xoa.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c32 npx tsx p3/32/xoa.mts\nRestrict   │ P2003 FK violated: `PostRestrict_authorId_fkey`      │ posts: A→1 B→1 C→1\nCascade    │ deleted                                              │ posts: (none)\nSetNull    │ deleted                                              │ posts: A→null B→null C→null\nSetDefault │ deleted                                              │ posts: A→1 B→1 C→1\nNoAction   │ P2003 FK violated: `PostNoAction_authorId_fkey`      │ posts: A→1 B→1 C→1\n",
 "demo/out/p3-2/sql.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c32 npx prisma migrate diff --from-empty --to-schema-datamodel p3/32/schema.prisma --script | grep 'ADD CONSTRAINT'\nALTER TABLE \"PostRestrict\" ADD CONSTRAINT \"PostRestrict_authorId_fkey\" FOREIGN KEY (\"authorId\") REFERENCES \"AuthorRestrict\"(\"id\") ON DELETE RESTRICT ON UPDATE CASCADE;\nALTER TABLE \"PostCascade\" ADD CONSTRAINT \"PostCascade_authorId_fkey\" FOREIGN KEY (\"authorId\") REFERENCES \"AuthorCascade\"(\"id\") ON DELETE CASCADE ON UPDATE CASCADE;\nALTER TABLE \"PostSetNull\" ADD CONSTRAINT \"PostSetNull_authorId_fkey\" FOREIGN KEY (\"authorId\") REFERENCES \"AuthorSetNull\"(\"id\") ON DELETE SET NULL ON UPDATE CASCADE;\nALTER TABLE \"PostSetDefault\" ADD CONSTRAINT \"PostSetDefault_authorId_fkey\" FOREIGN KEY (\"authorId\") REFERENCES \"AuthorSetDefault\"(\"id\") ON DELETE SET DEFAULT ON UPDATE CASCADE;\nALTER TABLE \"PostNoAction\" ADD CONSTRAINT \"PostNoAction_authorId_fkey\" FOREIGN KEY (\"authorId\") REFERENCES \"AuthorNoAction\"(\"id\") ON DELETE NO ACTION ON UPDATE CASCADE;\n",
 "demo/lab/p3/32/setnull-sai.prisma": "datasource db {\n  provider = \"postgresql\"\n  url      = env(\"DATABASE_URL\")\n}\n\nmodel User {\n  id    Int    @id @default(autoincrement())\n  posts Post[]\n}\n\nmodel Post {\n  id       Int  @id @default(autoincrement())\n  authorId Int\n  author   User @relation(fields: [authorId], references: [id], onDelete: SetNull)\n}\n",
 "demo/out/p3-2/setnull-sai.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c32 npx prisma validate --schema p3/32/setnull-sai.prisma 2>&1 | grep -vE '^\\s*$|Environment|schema loaded|Context|CLI Version'\nPrisma schema warning:\n- The `onDelete` referential action of a relation should not be set to `SetNull` when a referenced field is required. We recommend either to choose another referential action, or to make the referenced fields optional. Read more at https://pris.ly/d/postgres-set-null \nThe schema at p3/32/setnull-sai.prisma is valid 🚀\n"
};
const fs = { readFileSync: (p) => { const k = String(p); if (!(k in DU_LIEU)) throw new Error('thiếu dữ liệu đóng băng: ' + k); return DU_LIEU[k]; } };
import { lamDeck, prs, ts, tp, sql, two, box, cards, c, tbl, steps } from './_pr-chung.mjs';

export const deck = { key: 'pr-03-2', code: 'PR 3.2', title: 'One-to-many, and the five onDelete behaviours', sub: 'Chapter 3 · Lesson 3.2' };

const DEMO = 'demo';
const OUT = (t) => fs.readFileSync(`${DEMO}/out/p3-2/${t}.txt`, 'utf8').replace(/\n+$/, '');
const SRC = (t) => fs.readFileSync(`${DEMO}/lab/p3/32/${t}`, 'utf8').replace(/\n+$/, '');
const model = (f, ten) => SRC(f).match(new RegExp(`model ${ten} \\{[\\s\\S]*?\\n\\}`))[0];
const gon = (s) => s.replace(/^\$ DATABASE_URL=\S+ /gm, '$ ').split('\n').filter((l) => !/^\s*\|?\s*$/.test(l)).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 3 — Relations', bai: '3.2' }, [
  /* 1 */ { cover: true, nhan: 'Chapter 3 · Lesson 3.2', t: 'One-to-many, and<br>the five onDelete behaviours', sub: 'Nine relations out of ten — and five different answers to "what happens when the parent is deleted?"' },
  /* 2 */ { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Required versus optional — the choice that shapes your code</li>
    <li>All five <code>onDelete</code> behaviours, run on the same three rows</li>
    <li>The SQL each one becomes, and Prisma's defaults</li>
    <li>The SetNull warning that is only a warning</li>
    <li>Cascade depth — the question to ask before you ship it</li></ul>` },
  /* 3 */ { t: 'Required or optional — the choice that shapes your code', body: prs(`model Post {
  id         Int       @id @default(autoincrement())
  // REQUIRED: every post must have an author
  authorId   Int       @map("author_id")
  author     User      @relation(fields: [authorId], references: [id])
  // OPTIONAL: a post may or may not be in a category
  categoryId Int?      @map("category_id")
  category   Category? @relation(fields: [categoryId], references: [id])

  @@index([authorId])
  @@index([categoryId])
}`, { sm: true, hl: [4, 5, 7, 8] }) + `<div class="cap">from the lesson (illustration)</div>` + cards([
      ['Required: Int + User', 'NOT NULL. <code>create</code> does not compile without an author, and after an include <code>post.author</code> is never null.'],
      ['Optional: Int? + Category?', 'Nullable. Every read must handle null — and only this form can use <code>onDelete: SetNull</code>.'],
      ['Index it. Always.', 'Neither PostgreSQL nor Prisma indexes the referencing column (Lesson 2.3).'],
    ], 3) },
  /* 4 */ { t: 'One experiment, five schemas', body: prs(model('schema.prisma', 'AuthorRestrict') + '\n\n' + model('schema.prisma', 'PostRestrict'), { sm: true, hl: [10] }) +
    box('Same setup five times', 'Five model pairs that differ only in <code>onDelete</code>: Restrict, Cascade, SetNull, SetDefault, NoAction (SetNull uses <code>Int?</code>; SetDefault has <code>@default(1)</code>, an "unknown" author). Each gets one author with three posts — then the author is deleted.', 'lam') },
  /* 5 */ { t: 'The five behaviours, run against real rows', body: tp(gon(OUT('xoa')), { wrap: 120, fs: 16, title: 'delete the author — what is left of posts A, B, C' }) +
    tbl(['onDelete', 'What happened'], [['Restrict', 'refused (P2003) — nothing removed'], ['Cascade', 'author and all three posts gone'], ['SetNull', 'posts survive with author_id = NULL'], ['SetDefault', 'posts moved to the default author (id 1, "unknown")'], ['NoAction', 'refused (P2003) — on PostgreSQL, like Restrict but deferrable']]) },
  /* 6 */ { t: 'The SQL each one becomes', body: sql(gon(OUT('sql')).split('\n').filter((l) => !/^\$/.test(l)).map((l) => l.replace(/ FOREIGN KEY \("authorId"\) REFERENCES "Author\w+"\("id"\)/, ' …')).join('\n').replace(/ ON DELETE/g, '\n  ON DELETE'), { sm: true }) +
    box('Plain SQL, executed by PostgreSQL', 'Prisma does not run the cascade itself — it writes <code>ON DELETE …</code> into the constraint and the database does the work, for every writer, not only Prisma. Every relation also gets <code>ON UPDATE CASCADE</code>.', 'xanh') +
    box('RESTRICT versus NO ACTION', 'Both refused the delete here. RESTRICT checks immediately; NO ACTION checks at the end of the statement and can be declared DEFERRABLE — the one case where the difference matters.', 'lam') },
  /* 7 */ { t: 'Prisma’s defaults', body: cards([
      ['Required → Restrict', 'Deleting a parent that still has children fails. Deliberately conservative: the tool refuses to guess that you meant to delete data.'],
      ['Optional → SetNull', 'The child survives with NULL — the only sensible behaviour when the link was already allowed to be absent.'],
      ['Both → onUpdate: Cascade', 'If the referenced key changes, children follow. Plain SQL’s default is NO ACTION.'],
      ['Write it down anyway', 'Defaults are invisible in review. An explicit <code>onDelete</code> shows a reviewer that you thought about deletion.'],
    ], 2) },
  /* 8 */ { t: 'SetNull on a required relation: only a warning', body: prs(model('setnull-sai.prisma', 'Post'), { sm: true, hl: [4] }) +
    tp(gon(OUT('setnull-sai')).replace(/^\$ .*$/m, '$ npx prisma validate'), { wrap: 110, fs: 14 }) +
    box('Valid — and wrong', 'Prisma 6.19.3 prints a warning and still reports the schema as valid. The column is NOT NULL, so the first delete of an author with posts fails at runtime instead. Read warnings, not only errors.', 'do2') },
  /* 9 */ { t: 'Cascade depth: ask before you ship it', body: prs(`model User     { … posts     Post[] }
model Post     { … onDelete: Cascade → User;    comments  Comment[] }
model Comment  { … onDelete: Cascade → Post;    reactions Reaction[] }
model Reaction { … onDelete: Cascade → Comment }`) + `<div class="cap">a four-level cascade chain (sketch)</div>` +
    sql(`-- Before deleting one user, count what goes with them
SELECT (SELECT count(*) FROM posts WHERE author_id = 1) AS posts,
       (SELECT count(*) FROM comments WHERE post_id IN (SELECT id FROM posts WHERE author_id = 1)) AS comments;`, { sm: true }) +
    box('One delete can remove tens of thousands of rows', 'It locks every table on the way and cannot be undone. Two habits: cascade only genuinely owned data, and for big parents prefer a soft delete or a batched job.', 'do2') },
  /* 10 */ { t: 'Choosing per relation', body: tbl(['Child', 'Parent', 'onDelete', 'Why'], [
      ['Comment', 'Post', '<code>Cascade</code>', 'a comment has no meaning without its post'],
      ['OrderLine', 'Order', '<code>Cascade</code>', 'line items are part of the order'],
      ['Post', 'Category', '<code>SetNull</code>', 'the post outlives the category'],
      ['Post', 'User', '<code>Restrict</code>', 'decide on purpose: reassign, archive, or delete posts first'],
      ['Invoice', 'Customer', '<code>Restrict</code>', 'financial records must never vanish as a side effect'],
    ]) + box('The rule of thumb', 'Cascade what the parent <b>owns</b>, SetNull what merely <b>refers</b> to it, Restrict anything you would be sorry to lose.', 'xanh') },
  /* 11 */ { t: 'Your turn — and what to keep', body: two(steps([
      `Build the five model pairs; delete an author in each`,
      `Read the ${c('ON DELETE …')} line ${c('migrate diff')} writes for each`,
      `Put ${c('SetNull')} on a required relation; read the warning, then delete`,
      `Count a cascade chain before deleting`,
    ]), box('Keep these', `<ul><li>Required → Restrict, optional → SetNull by default</li><li>PostgreSQL runs the cascade, for every writer</li><li>A warning is not a pass</li><li>Count before you cascade</li></ul>`, 'lam'), '') },
]);
