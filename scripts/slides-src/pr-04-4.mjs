/**
 * pr-04-4 — Prisma ORM · Chapter 4 · Lesson 4.4 "Updating, and the atomic operators" (deck video, 12/11/2026). Bài web: pr-4-4-cap-nhat.
 * Output THẬT (`chay.sh p4-4`, demo/lab/p4/44, CSDL c44, Prisma 6.19.3 · PostgreSQL 16.14): update thiếu hàng ⇒ P2025 · updateMany ⇒ BEGIN/UPDATE/COMMIT,
 * {count:7}, không khớp ⇒ {count:0} · updateManyAndReturn · increment ⇒ SET "views" = ("views" + $1) · push ⇒ "tags" || $1 · upsert ⇒ ON CONFLICT … DO UPDATE ·
 * 100 lần đọc-rồi-ghi song song ⇒ 1/100 (ba vòng), increment ⇒ 100/100 · 10 upsert song song ⇒ 10 ok · update lồng: đọc id con theo author_id IN rồi
 * mới ghi theo id · updateMany có điều kiện ⇒ lần 1 {count:1}, lần 2 {count:0}, tồn kho 0.
 */
/* Output chạy THẬT, đóng băng từ thư mục demo của khoá video Prisma (12/11/2026) — deck tự chứa, không đọc tệp ngoài repo. */
const DU_LIEU = {
 "demo/out/p4-4/sua.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c44 npx tsx p4/44/sua.mts\n[update] UPDATE \"posts\" SET \"title\" = $1, \"published\" = $2, \"updated_at\" = $3 WHERE (\"id\" = $4 AND 1=1) RETURNING …\n[update missing] UPDATE \"posts\" SET \"title\" = $1, \"updated_at\" = $2 WHERE (\"id\" = $3 AND 1=1) RETURNING …\n[update missing] P2025 {\"modelName\":\"Post\",\"cause\":\"No record was found for an update.\"}\n[updateMany] BEGIN\n[updateMany] UPDATE \"posts\" SET \"published\" = $1, \"updated_at\" = $2 WHERE (\"author_id\" = $3 AND \"published\" = $4)\n[updateMany] COMMIT\nupdateMany → {\"count\":7}\nupdateMany no match → {\"count\":0}\n[updateManyAndReturn] BEGIN\n[updateManyAndReturn] UPDATE \"posts\" SET \"views\" = $1, \"updated_at\" = $2 WHERE \"id\" IN ($3,$4) RETURNING …\n[updateManyAndReturn] COMMIT\nupdateManyAndReturn → [{\"id\":2,\"title\":\"Bai 2\"},{\"id\":3,\"title\":\"Bai 3\"}]\n[increment] UPDATE \"posts\" SET \"views\" = (\"views\" + $1), \"updated_at\" = $2 WHERE (\"id\" = $3 AND 1=1) RETURNING …\n[push] UPDATE \"posts\" SET \"tags\" = \"tags\" || $1, \"updated_at\" = $2 WHERE (\"id\" = $3 AND 1=1) RETURNING …\n[upsert] INSERT INTO \"settings\" (\"key\",\"value\") VALUES ($1,$2) ON CONFLICT (\"key\") DO UPDATE SET \"value\" = $3 WHERE (\"key\" = $4 AND 1=1) RETURNING …\n[upsert counter] INSERT INTO \"page_views\" (\"path\",\"day\",\"count\") VALUES ($1,$2,$3) ON CONFLICT (\"path\",\"day\") DO UPDATE SET \"count\" = (\"count\" + $4) WHERE ((\"path\" = $5 AND \"day\" = $6) AND 1=1) RETURNING …\n[upsert counter] INSERT INTO \"page_views\" (\"path\",\"day\",\"count\") VALUES ($1,$2,$3) ON CONFLICT (\"path\",\"day\") DO UPDATE SET \"count\" = (\"count\" + $4) WHERE ((\"path\" = $5 AND \"day\" = $6) AND 1=1) RETURNING …\npage_views → [{\"path\":\"/courses\",\"count\":2}]\n[nested update] BEGIN\n[nested update] UPDATE \"users\" SET \"full_name\" = $1 WHERE (\"id\" = $2 AND 1=1) RETURNING …\n[nested update] SELECT \"id\", \"user_id\" FROM \"profiles\" WHERE (1=1 AND \"user_id\" IN ($1)) OFFSET $2\n[nested update] UPDATE \"profiles\" SET \"bio\" = $1 WHERE (\"id\" = $2 AND 1=1) RETURNING …\n[nested update] SELECT \"id\", \"author_id\" FROM \"posts\" WHERE (\"published\" = $1 AND \"author_id\" IN ($2)) OFFSET $3\n[nested update] SELECT \"id\", \"author_id\" FROM \"posts\" WHERE ((\"id\" = $1 AND 1=1) AND \"author_id\" IN ($2)) OFFSET $3\n[nested update] UPDATE \"posts\" SET \"title\" = $1, \"updated_at\" = $2 WHERE (\"id\" = $3 AND (\"id\" = $4 AND 1=1)) RETURNING …\n[nested update] INSERT INTO \"posts\" (\"title\",\"published\",\"views\",\"updated_at\",\"author_id\") VALUES ($1,$2,$3,$4,$5) RETURNING …\n[nested update] SELECT \"id\", \"author_id\" FROM \"posts\" WHERE (\"views\" = $1 AND \"author_id\" IN ($2)) OFFSET $3\n[nested update] DELETE FROM \"posts\" WHERE (\"id\" IN ($1,$2,$3) AND 1=1)\n[nested update] SELECT \"id\", \"email\", \"full_name\" FROM \"users\" WHERE \"id\" = $1 LIMIT $2 OFFSET $3\n[nested update] COMMIT\n[guarded] BEGIN\n[guarded] UPDATE \"products\" SET \"stock\" = (\"stock\" - $1) WHERE (\"id\" = $2 AND \"stock\" > $3)\n[guarded] COMMIT\nguarded decrement → first {\"count\":1} · second {\"count\":0} · stock 0\n",
 "demo/out/p4-4/dua.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c44 npx tsx p4/44/dua.mts\nround 1: read-then-write 1/100 · increment 100/100\nround 2: read-then-write 1/100 · increment 100/100\nround 3: read-then-write 1/100 · increment 100/100\n10 concurrent upsert (native ON CONFLICT) → 10 ok\n10 concurrent upsert counter → 10 ok · count 10\n"
};
const fs = { readFileSync: (p) => { const k = String(p); if (!(k in DU_LIEU)) throw new Error('thiếu dữ liệu đóng băng: ' + k); return DU_LIEU[k]; } };
import { lamDeck, prs, ts, tp, sql, two, box, cards, c, tbl, steps } from './_pr-chung.mjs';

export const deck = { key: 'pr-04-4', code: 'PR 4.4', title: 'Updating, and the atomic operators', sub: 'Chapter 4 · Lesson 4.4' };

const DEMO = 'demo';
const OUT = (t) => fs.readFileSync(`${DEMO}/out/p4-4/${t}.txt`, 'utf8').replace(/\n+$/, '');
const gon = (s) => s.replace(/^\$ DATABASE_URL=\S+ /gm, '$ ').split('\n').filter((l) => !/^\s*$/.test(l)).join('\n');
const lay = (t, ...nhan) => OUT(t).split('\n').filter((l) => nhan.some((n) => l.startsWith(`[${n}]`) || l.startsWith(n))).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 4 — Reading and writing', bai: '4.4' }, [
  /* 1 */ { cover: true, nhan: 'Chapter 4 · Lesson 4.4', t: 'Updating, and<br>the atomic operators', sub: 'views: n + 1 against views: { increment: 1 } — one of them loses writes' },
  /* 2 */ { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li><code>update</code>, <code>updateMany</code>, <code>updateManyAndReturn</code> — and the silent zero</li>
    <li>The lost-update race, reproduced: 100 increments, both ways</li>
    <li>The atomic operators, and the SQL they become</li>
    <li><code>upsert</code> as one statement — and the daily counter in one call</li>
    <li>Nested updates, and conditional updates with no read first</li></ul>` },
  /* 3 */ { t: 'Three methods (and a fourth)', body: cards([
      ['update', 'One row by a unique field; returns it. Missing ⇒ <code>P2025</code> — there is no updateOrThrow because throwing is the behaviour.'],
      ['updateMany', 'Any filter; returns <code>{ count }</code>, not rows. Nothing matched ⇒ <code>{ count: 0 }</code>, no error.'],
      ['updateManyAndReturn', 'Prisma 6: <code>updateMany</code> with <code>RETURNING</code> — no follow-up <code>findMany</code>.'],
      ['upsert', 'Update if the unique key exists, create otherwise. One <code>ON CONFLICT</code> statement on PostgreSQL.'],
    ], 2) },
  /* 4 */ { t: 'What each one sends', body: tp(lay('sua', 'update', 'update missing', 'updateMany', 'updateManyAndReturn').replace(/^\[update missing\] UPDATE.*\n/m, ''), { wrap: 130, fs: 13, title: 'query log' }) +
    box('Trap — updateMany matching nothing is silent', '<code>{ count: 0 }</code> looks exactly like success. A handler that reports success must check it: <code>if (r.count === 0) return res.status(404)</code>. People reach for updateMany to "avoid the exception" and never notice the update stopped working.', 'do2') },
  /* 5 */ { t: 'The lost update, reproduced', body: ts(`// 100 concurrent requests, each adding one view
await Promise.all(Array.from({ length: 100 }, async () => {
  const p = await prisma.post.findUniqueOrThrow({ where: { id } });                // read
  await prisma.post.update({ where: { id }, data: { views: p.views + 1 } });       // write
}));
await Promise.all(Array.from({ length: 100 }, () =>
  prisma.post.update({ where: { id }, data: { views: { increment: 1 } } })));      // atomic`, { sm: true }) +
    tp(gon(OUT('dua')).split('\n').slice(0, 4).join('\n'), { wrap: 120, fs: 18 }) +
    box('Ninety-nine views gone, three times in a row', 'Every request read 0 before any write landed, every one wrote 1. No error, no warning — and on a development machine with one user it looks perfect.', 'do2') },
  /* 6 */ { t: 'Why increment cannot lose', body: two(tbl(['t', 'Request A', 'Request B', 'views'], [
      ['1', 'SELECT → 120', '', '120'], ['2', '', 'SELECT → 120', '120'], ['3', 'UPDATE SET 121', '', '121'], ['4', '', 'UPDATE SET 121', '<b>121</b>'],
    ], { cap: 'read-then-write', bo: [3] }), tbl(['t', 'Request A', 'Request B', 'views'], [
      ['1', 'SET views = views + 1', '', '121'], ['2', '', 'SET views = views + 1 (waits for A\'s row lock)', '<b>122</b>'],
    ], { cap: 'atomic' }), '') +
    tp(lay('sua', 'increment', 'push'), { wrap: 130, fs: 13, title: 'the SQL — arithmetic inside PostgreSQL' }) },
  /* 7 */ { t: 'The atomic operators', body: ts(`data: { views: { increment: 1 } }      data: { stock: { decrement: 1 } }
data: { score: { multiply: 2 } }       data: { ratio: { divide: 2 } }
data: { views: { set: 0 } }
data: { tags:  { push: 'prisma' } }    data: { tags: { push: ['a', 'b'] } }   // String[] columns`, { sm: true }) +
    cards([
      ['Numbers', '<code>increment</code> · <code>decrement</code> · <code>multiply</code> · <code>divide</code> · <code>set</code> — each becomes <code>"col" = ("col" op $1)</code>.'],
      ['Arrays', '<code>push</code> becomes <code>"tags" || $1</code>; <code>set</code> replaces the list.'],
      ['Not atomic', '<code>{ views: p.views + 1 }</code> — a plain value computed in JavaScript from a read that is already stale.'],
    ], 3) +
    box('The rule', 'Any field derived from its own previous value — a counter, a balance, a stock level, a retry count — uses an atomic operator or a transaction (Chapter 7). Never read it, add in JavaScript, and write it back.', 'xanh') },
  /* 8 */ { t: 'upsert — one statement, and the daily counter', body: ts(`await prisma.pageView.upsert({
  where:  { path_day: { path: '/courses', day: homNay } },
  update: { count: { increment: 1 } },
  create: { path: '/courses', day: homNay, count: 1 },
});`, { sm: true }) + tp(lay('sua', 'upsert', 'upsert counter', 'page_views').replace(/(\[upsert counter\].*\n)\1/, '$1'), { wrap: 130, fs: 12 }) +
    tp(gon(OUT('dua')).split('\n').slice(4).join('\n'), { wrap: 120, fs: 15, title: '10 at once, on a row that did not exist' }) },
  /* 9 */ { t: 'Nested updates: editing the children', body: ts(`await prisma.user.update({ where: { id: an.id }, data: {
  fullName: 'Nguyen Van An',
  profile: { upsert: { create: { bio: 'Lan dau' }, update: { bio: 'Cap nhat' } } },
  posts: { updateMany: { where: { published: false }, data: { published: true } },
           update:     { where: { id: 3 }, data: { title: 'Sua rieng bai nay' } },
           create:     [{ title: 'Bai moi' }],
           deleteMany: { views: 0 } } } });`, { sm: true }) +
    tp(lay('sua', 'nested update').replace(/RETURNING …/g, '…'), { wrap: 130, fs: 11, title: 'query log — one transaction' }) },
  /* 10 */ { t: 'Nested writes stay inside the parent', body: box('Every child is looked up with author_id IN (…) first', 'Before touching a post, Prisma reads the ids of <em>this user\'s</em> posts that match, then writes by id. <code>update: { where: { id: 3 } }</code> cannot reach someone else\'s post 3 — the lookup would return nothing.', 'xanh') +
    cards([
      ['profile upsert', 'Read the profile by <code>user_id</code>, then update it by id.'],
      ['updateMany', 'Read matching ids. Here none were unpublished, so no <code>UPDATE</code> was sent at all.'],
      ['create', 'One <code>INSERT</code> with <code>author_id</code> filled in.'],
      ['deleteMany', 'Read ids with <code>views = 0</code>, then <code>DELETE … WHERE id IN (…)</code>.'],
    ], 2) },
  /* 11 */ { t: 'Conditional updates, without reading first', body: ts(`// take one from stock — never below zero
const r = await prisma.product.updateMany({
  where: { id: 1, stock: { gt: 0 } },
  data:  { stock: { decrement: 1 } },
});
if (r.count === 0) throw new Error('Het hang');`, { sm: true }) + tp(lay('sua', 'guarded'), { wrap: 120, fs: 15, title: 'stock was 1 — the same call twice' }) +
    box('The check and the write are one statement', 'Nothing can change between them. <code>count === 0</code> then means "the precondition was false" — out of stock, already published. Chapter 7 covers preconditions that span two tables.', 'xanh') },
  /* 12 */ { t: 'Your turn — and what to keep', body: two(steps([
      `Run ${c('updateMany')} with a wrong filter; read ${c('{ count: 0 }')}`,
      `Fire 100 read-then-write increments; then 100 ${c('increment')}s`,
      `Build the daily counter with ${c('upsert')} + ${c('increment')}`,
      `Decrement stock with a guard in the ${c('where')}`,
    ]), box('Keep these', `<ul><li>${c('updateMany')} ⇒ check the count</li><li>Derived from itself ⇒ atomic operator</li><li>${c('upsert')} = one ON CONFLICT</li><li>Precondition in the ${c('where')}</li></ul>`, 'lam'), '') },
]);
