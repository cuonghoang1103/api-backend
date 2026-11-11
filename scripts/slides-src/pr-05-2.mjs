/**
 * pr-05-2 — Prisma ORM · Chapter 5 · Lesson 5.2 "Filtering by relations" (deck video, 12/11/2026). Bài web: pr-5-2-loc-quan-he.
 * Output THẬT (`chay.sh p5-2`, demo/lab/p5/52, CSDL c52: 340 user, Prisma 6.19.3 · PostgreSQL 16.14): some = EXISTS, none = NOT EXISTS,
 * every = NOT EXISTS (… NOT …) · every published ⇒ an, binh, chi (binh, chi không có bài) · some {} AND every ⇒ an · A 12 user kèm 21 nháp / B 340 user,
 * 328 mảng rỗng / C 12 user · hai tầng ⇒ EXISTS + LEFT JOIN users · some name in [..] ⇒ bất kỳ thẻ (3 bài), mỗi thẻ một some ⇒ 1 bài ·
 * profile is null ⇒ LEFT JOIN … IS NULL · isNot ⇒ (NOT slug = $1) OR id IS NULL: Prisma 6.19.3 GIỮ bài không có category (web nói loại).
 */
/* Output chạy THẬT, đóng băng từ thư mục demo của khoá video Prisma (12/11/2026) — deck tự chứa, không đọc tệp ngoài repo. */
const DU_LIEU = {
 "demo/out/p5-2/quanhe.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c52 npx tsx p5/52/quanhe.mts\n[some] SELECT … FROM \"users\" WHERE EXISTS(SELECT \"t0\".\"author_id\" FROM \"posts\" AS \"t0\" WHERE (\"t0\".\"published\" = $1 AND (\"id\") = (\"t0\".\"author_id\") AND \"t0\".\"author_id\" IS NOT NULL)) ORDER BY \"id\" ASC OFFSET $2\nsome published → 12 users\n[none] SELECT … FROM \"users\" WHERE NOT EXISTS(SELECT \"t0\".\"author_id\" FROM \"posts\" AS \"t0\" WHERE (\"t0\".\"published\" = $1 AND (\"id\") = (\"t0\".\"author_id\") AND \"t0\".\"author_id\" IS NOT NULL)) ORDER BY \"id\" ASC OFFSET $2\nnone published → 328 users\n[every] SELECT … FROM \"users\" WHERE NOT EXISTS(SELECT \"t0\".\"author_id\" FROM \"posts\" AS \"t0\" WHERE ((NOT \"t0\".\"published\" = $1) AND (\"id\") = (\"t0\".\"author_id\") AND \"t0\".\"author_id\" IS NOT NULL)) ORDER BY \"id\" ASC OFFSET $2\nevery published → [\"an\",\"binh\",\"chi\"]\n[some {} AND every] SELECT … FROM \"users\" WHERE (EXISTS(SELECT \"t0\".\"author_id\" FROM \"posts\" AS \"t0\" WHERE (1=1 AND (\"id\") = (\"t0\".\"author_id\") AND \"t0\".\"author_id\" IS NOT NULL)) AND NOT EXISTS(SELECT \"t1\".\"author_id\" FROM \"posts\" AS \"t1\" WHERE ((NOT \"t1\".\"published\" = $1) AND (\"id\") = (\"t1\".\"author_id\") AND \"t1\".\"author_id\" IS NOT NULL))) ORDER BY \"id\" ASC OFFSET $2\nsome {} AND every published → [\"an\"]\nA: 12 users, 21 drafts included\nB: 340 users, 328 with posts: []\nC: 12 users, each with only published posts (14 posts)\n[two levels] SELECT … FROM \"posts\" WHERE EXISTS(SELECT \"t0\".\"post_id\" FROM \"comments\" AS \"t0\" LEFT JOIN \"users\" AS \"j1\" ON (\"j1\".\"id\") = (\"t0\".\"author_id\") WHERE (\"j1\".\"role\" = CAST($1::text AS \"Role\") AND (\"j1\".\"id\" IS NOT NULL) AND (\"id\") = (\"t0\".\"post_id\") AND \"t0\".\"post_id\" IS NOT NULL)) OFFSET $2\nposts with a comment by an admin → [\"An 1\"]\n[all tags] SELECT … FROM \"posts\" WHERE (EXISTS(SELECT \"t0\".\"A\" FROM \"_PostToTag\" AS \"t0\" INNER JOIN \"tags\" AS \"j0\" ON (\"j0\".\"id\") = (\"t0\".\"B\") WHERE (\"j0\".\"name\" = $1 AND (\"id\") = (\"t0\".\"A\") AND \"t0\".\"A\" IS NOT NULL)) AND EXISTS(SELECT \"t1\".\"A\" FROM \"_PostToTag\" AS \"t1\" INNER JOIN \"tags\" AS \"j1\" ON (\"j1\".\"id\") = (\"t1\".\"B\") WHERE (\"j1\".\"name\" = $2 AND (\"id\") = (\"t1\".\"A\") AND \"t1\".\"A\" IS NOT NULL))) OFFSET $3\nsome name in [nodejs, prisma] → [\"U5 dang\",\"U6 dang\",\"U7 dang\"] · one some per tag → [\"U5 dang\"]\n[is null] SELECT … FROM \"users\" LEFT JOIN \"profiles\" AS \"j0\" ON (\"j0\".\"user_id\") = (\"id\") WHERE (\"j0\".\"user_id\" IS NULL) ORDER BY \"id\" ASC OFFSET $1\nprofile is null → 338 users\nprofile has a bio → [\"an\"]\n[isNot] SELECT … FROM (SELECT \"id\" FROM \"posts\" LEFT JOIN \"categories\" AS \"j0\" ON (\"j0\".\"id\") = (\"category_id\") WHERE ((NOT \"j0\".\"slug\" = $1) OR (\"j0\".\"id\" IS NULL)) OFFSET $2) AS \"sub\"\ncategory isNot archive → 685 posts · with categoryId null added → 685 · posts with no category: 684\n"
};
const fs = { readFileSync: (p) => { const k = String(p); if (!(k in DU_LIEU)) throw new Error('thiếu dữ liệu đóng băng: ' + k); return DU_LIEU[k]; } };
import { lamDeck, prs, ts, tp, sql, two, box, cards, c, tbl, steps } from './_pr-chung.mjs';

export const deck = { key: 'pr-05-2', code: 'PR 5.2', title: 'Filtering by relations', sub: 'Chapter 5 · Lesson 5.2' };

const DEMO = 'demo';
const OUT = (t) => fs.readFileSync(`${DEMO}/out/p5-2/${t}.txt`, 'utf8').replace(/\n+$/, '');
const lay = (...nhan) => OUT('quanhe').split('\n').filter((l) => nhan.some((n) => l.startsWith(`[${n}]`) || l.startsWith(n))).map((l) => l.replace(/ ORDER BY "id" ASC OFFSET \$\d+$/, '').replace(/ OFFSET \$\d+$/, '')).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 5 — Querying in depth', bai: '5.2' }, [
  /* 1 */ { cover: true, nhan: 'Chapter 5 · Lesson 5.2', t: 'Filtering by relations', sub: 'some, none, every — and the one that is true for an empty basket' },
  /* 2 */ { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The operators for to-many and to-one relations, and their SQL</li>
    <li>The <code>every</code> trap — and the two-line fix</li>
    <li>Filtering the parents versus filtering the children</li>
    <li>Several levels deep, and "all of these tags"</li>
    <li>Negative filters on an optional relation</li></ul>` },
  /* 3 */ { t: 'The operators', body: ts(`where: { posts: { some:  { published: true } } }    // at least one
where: { posts: { none:  { published: true } } }    // not a single one
where: { posts: { every: { published: true } } }    // all of them — read the next slides
where: { profile: { is: null } }                    // to-one: absent
where: { category: { isNot: { slug: 'archive' } } } // to-one: not that one`, { sm: true }) +
    tp(lay('some', 'none', 'every'), { wrap: 130, fs: 12, title: 'query log — 340 users' }) },
  /* 4 */ { t: 'What each one asks the database', body: cards([
      ['some', '<code>EXISTS (… matching …)</code>. "At least one." The one you want nine times out of ten.'],
      ['none', '<code>NOT EXISTS (… matching …)</code>. <code>none: {}</code> means "has no related rows at all".'],
      ['every', '<code>NOT EXISTS (… NOT matching …)</code>. "None of them violate it" — which is true when there are none.'],
      ['is / isNot', 'A <code>LEFT JOIN</code> on the single related row. <code>is: null</code> means the relation is absent.'],
    ], 2) },
  /* 5 */ { t: 'The every trap', body: ts(`await prisma.user.findMany({ where: { posts: { every: { published: true } } } });`, { sm: true }) +
    tp(lay('every published', 'some published', 'none published'), { wrap: 120, fs: 18 }) +
    box('every is true for an empty collection', '<code>binh</code> and <code>chi</code> have no posts at all, so no post violates the condition, and <code>NOT EXISTS</code> is true. Vacuous truth: correct logic, almost never what the product meant.', 'do2') },
  /* 6 */ { t: 'What you meant: has posts, and all are published', body: ts(`await prisma.user.findMany({ where: { AND: [
  { posts: { some: {} } },                    // at least one post exists
  { posts: { every: { published: true } } },  // and none is a draft
] } });`, { sm: true }) + tp(lay('some {} AND every'), { wrap: 100, fs: 16 }) +
    box('EXISTS (any post) AND NOT EXISTS (an unpublished post)', 'The empty <code>some: {}</code> rules out the empty baskets; <code>every</code> rules out the drafts. Only <code>an</code> is left.', 'xanh') },
  /* 7 */ { t: 'Filtering the parents versus the children', body: ts(`// A — filter the parents (and ALL their posts come along)
findMany({ where: { posts: { some: { published: true } } }, include: { posts: true } })
// B — filter the children: EVERY user, each with only published posts
findMany({ include: { posts: { where: { published: true } } } })
// C — both
findMany({ where: { posts: { some: { published: true } } },
           include: { posts: { where: { published: true } } } })`, { sm: true }) +
    tp(lay('A:', 'B:', 'C:'), { wrap: 120, fs: 18 }) +
    box('B is what people write when they meant C', 'It looks right in development, where every test user has a published post. In production it returns all 340 users, 328 of them with an empty list.', 'do2') },
  /* 8 */ { t: 'Several levels deep', body: ts(`// posts that have a comment written by an admin
await prisma.post.findMany({ where: { comments: { some: { author: { role: 'ADMIN' } } } } });`, { sm: true }) +
    tp(lay('two levels', 'posts with a comment'), { wrap: 130, fs: 13 }) +
    cards([
      ['Each level is another join or EXISTS', 'Readable SQL — the shape a careful hand-writer would produce.'],
      ['Index every hop', 'Each level joins on a foreign key: <code>comments.post_id</code>, <code>comments.author_id</code>.'],
      ['Filtering ≠ fetching', 'Nothing related is loaded. Add <code>include</code> if you also want the data.'],
    ], 3) },
  /* 9 */ { t: 'The "all of these tags" problem', body: ts(`// means ANY of the tags
where: { tags: { some: { name: { in: ['nodejs', 'prisma'] } } } }
// ALL of them: one some per tag, ANDed
where: { AND: ['nodejs', 'prisma'].map((name) => ({ tags: { some: { name } } })) }`, { sm: true }) +
    tp(lay('all tags', 'some name in').replace(/(EXISTS\(SELECT "t1".*)$/m, '$1'), { wrap: 130, fs: 12 }) +
    box('One EXISTS per required tag', '“U5 dang” has both tags; “U6 dang” and “U7 dang” have one each. <code>in</code> returns all three; one <code>some</code> per tag returns only the post that has both.', 'xanh') },
  /* 10 */ { t: 'Optional to-one relations', body: ts(`where: { profile: { is: null } }                                     // no profile at all
where: { category: { isNot: { slug: 'archive' } } }                  // posts NOT in "archive"`, { sm: true }) +
    tp(lay('is null', 'profile is null', 'profile has', 'isNot', 'category isNot'), { wrap: 130, fs: 13, title: 'Prisma 6.19.3' }) +
    box('isNot keeps the posts with no category', 'The SQL is <code>(NOT slug = $1) OR "j0"."id" IS NULL</code>: the 684 posts with no category are included, and adding <code>categoryId: null</code> changes nothing. Older write-ups say <code>isNot</code> drops them — read the SQL of the version you run.', 'lam') },
  /* 11 */ { t: 'Relation counts as a filter', body: sql(`-- Prisma cannot filter on _count directly. Two real options:
SELECT u.id FROM users u JOIN posts p ON p.author_id = u.id
GROUP BY u.id HAVING COUNT(p.id) > 10;                 -- A: raw SQL ($queryRaw)`, { sm: true }) + prs(`model User {
  id        Int @id @default(autoincrement())
  postCount Int @default(0) @map("post_count")        // B: a maintained counter
  @@index([postCount])
}`, { sm: true }) +
    box('The counter column is not a hack', '<code>HAVING COUNT(*) &gt; 10</code> must aggregate every group before it can filter. A plain integer column is an index range scan — kept right by incrementing it in the same transaction that creates the post (Chapter 7).', 'lam') },
  /* 12 */ { t: 'Your turn — and what to keep', body: two(steps([
      `Run ${c('every')} on users with no posts; then add ${c('some: {}')}`,
      `Write A, B and C; compare the user counts`,
      `Ask for posts with ALL of two tags — one ${c('some')} per tag`,
      `Read the SQL of ${c('isNot')} on an optional relation`,
    ]), box('Keep these', `<ul><li>${c('some')} = EXISTS, the safe one</li><li>${c('every')} is true for empty ⇒ add ${c('some: {}')}</li><li>Filter the parent, not only the child</li><li>Negative filters: decide what absence means</li></ul>`, 'lam'), '') },
]);
