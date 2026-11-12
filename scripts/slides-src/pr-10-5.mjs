/**
 * pr-10-5 — Prisma ORM · Chapter 10 · Lesson 10.5 "$extends: soft delete, and what it actually covers" (deck video, 12/11/2026). Bài web: pr-10-5-extends.
 * Output THẬT (`chay.sh p10-5`, prisma-pg PostgreSQL 16.14, CSDL c105; Prisma 6.19.3) — extension xoá mềm đúng mẫu bài web: delete ⇒ UPDATE … SET deleted_at;
 * findMany / findFirst / count ẩn bài đã xoá; findUnique, findUniqueOrThrow, groupBy, include từ user, $queryRaw vẫn THẤY · email unique giữ chỗ ⇒ P2002; chỉ mục unique
 * một phần WHERE deleted_at IS NULL ⇒ đăng ký lại được · typeof prisma.$use = 'undefined'. Bổ sung từ bài 8.4 (out/p8-4): needs, include, thứ tự chồng.
 */
/* Output chạy THẬT, đóng băng từ thư mục demo của khoá video Prisma (12/11/2026) — deck tự chứa, không đọc tệp ngoài repo. */
const DU_LIEU = {
 "demo/out/p10-5/xoa-mem.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c105 npx tsx p10/105/xoa-mem.mts\ndelete → UPDATE \"posts\" SET \"deleted_at\" = $1 WHERE (\"posts\".\"id\" = $2 AND 1=1) RETURNING …\nfindMany (where authorId)      → an               ✓\nfindFirst                      → an               ✓\ncount                          → an               ✓\nfindUnique                     → THAY bai da xoa  ✗\nfindUniqueOrThrow              → THAY bai da xoa  ✗\ngroupBy                        → THAY bai da xoa  ✗\nuser.findMany include posts    → THAY bai da xoa  ✗\n$queryRaw                      → THAY bai da xoa  ✗\ndang ky lai email da xoa mem → P2002 {\"modelName\":\"User\",\"target\":[\"email\"]}\nsau chi muc unique mot phan (WHERE deleted_at IS NULL) → tao duoc user 2002\ntypeof prisma.$use = undefined\n",
 "demo/out/p10-5/them.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c105 npx tsx p10/105/them.mts\nfindUnique({ where: { id: 1001, deletedAt: null } }) → null\nprisma.$use(...) → TypeError: prisma.$use is not a function\n",
 "demo/out/p8-4/ext.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c84 npx tsx p8/84/ext.mts\n== result: select chi xin id va tenHienThi\nprisma:query SELECT \"id\", \"full_name\", \"username\" FROM \"users\" WHERE (\"id\" = $1 AND 1=1) LIMIT $2 OFFSET $3\n{ id: 3, tenHienThi: 'user3' }\n== query: quen goi query(args) → undefined\nprisma:query SELECT COUNT(*) AS \"_count$_all\" FROM (SELECT \"id\" FROM \"users\" WHERE 1=1 OFFSET $1) AS \"sub\"\nprisma:query SELECT 1\nprisma:query SELECT 1\n== query: $allOperations dem duoc 3 lan cho: user.count + $queryRaw + $executeRaw\nprisma:query SELECT COUNT(*) AS \"_count$_all\" FROM (SELECT \"id\" FROM \"users\" WHERE 1=1 OFFSET $1) AS \"sub\"\n== chong A roi B: A (them truoc) vao → B (them sau) vao → B (them sau) ra → A (them truoc) ra\n",
 "demo/out/p8-4/them.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c84 npx tsx p8/84/them.mts\ntrong include: author.tenHienThi = \"Nguoi dung 2\"\n$use con ton tai tren client 6.19.3? undefined\n"
};
const fs = { readFileSync: (p) => { const k = String(p); if (!(k in DU_LIEU)) throw new Error('thiếu dữ liệu đóng băng: ' + k); return DU_LIEU[k]; } };
import { lamDeck, tp, ts, sql, two, box, cards, c, tbl, steps , icards, cmp, bars, hub, tiers, flow } from './_pr-chung.mjs';

export const deck = { key: 'pr-10-5', code: 'PR 10.5', title: '$extends: soft delete, and what it actually covers', sub: 'Chapter 10 · Lesson 10.5' };

const DEMO = 'demo';
const OUT = (t, ch = 'p10-5') => fs.readFileSync(`${DEMO}/out/${ch}/${t}.txt`, 'utf8').replace(/\n+$/, '');
const gon = (s) => s.replace(/^\$ DATABASE_URL=\S+ /gm, '$ ').replace(/p\d+\/\d+\//g, '').split('\n').filter((l) => !/^\s*$/.test(l)).join('\n');
const MOI = 'terminal — PostgreSQL 16.14 · Prisma 6.19.3';
const X = gon(OUT('xoa-mem')).split('\n').filter((l) => !/^\$ /.test(l));

export const slides = lamDeck({ chuong: 'Chapter 10 — Escape hatches: raw SQL and client extensions', bai: '10.5' }, [
  /* 1 */ { cover: true, nhan: 'Chapter 10 · Lesson 10.5', t: '$extends: soft delete, and what it actually covers', sub: 'The pattern everyone writes — measured operation by operation' },
  /* 2 */ { t: 'What you will take away from this lesson', body: icards([
      ['trash', 'A soft-delete extension, exactly as usually written', ''],
      ['filter', 'Which operations it hides deleted rows from', ''],
      ['warn', 'The five it misses', ''],
      ['key', 'Unique constraints and deleted rows', ''],
      ['plug', '$use is gone — what replaces it', ''],
    ], 2) },
  /* 3 */ { t: 'The usual soft-delete extension', body: ts(`const softDelete = Prisma.defineExtension({ name: 'soft-delete', query: { post: {
  async delete({ args })     { return base.post.update({ ...args, data: { deletedAt: new Date() } }); },
  async deleteMany({ args }) { return base.post.updateMany({ ...args, data: { deletedAt: new Date() } }); },
  async $allOperations({ operation, args, query }) {
    if (['findMany', 'findFirst', 'count', 'aggregate'].includes(operation))
      args.where = { ...args.where, deletedAt: null };
    return query(args);
  },
} } });
const prisma = base.$extends(softDelete);
await prisma.post.delete({ where: { id: 1001 } });`, { sm: true }) + tp(X[0], { wrap: 116, fs: 14, title: MOI }) +
      box('delete became an UPDATE', 'The row stays; deleted_at is set. Now ask every kind of read whether it can still see post 1001.', 'lam') },
  /* 4 */ { t: 'What it hides — and what it does not', body: tp(X.slice(1, 9).join('\n'), { fs: 15, title: MOI + ' · post 1001 was soft-deleted' }) +
      cards([
        ['Three of eight hidden', 'findMany, findFirst, count — exactly the operations in the list.'],
        ['findUnique is not in the list', 'Nor findUniqueOrThrow, nor groupBy. The pattern most tutorials show leaves them out.'],
        ['Other models, raw SQL', 'An include from User and $queryRaw never pass through post&#39;s hooks.'],
      ], 3) },
  /* 5 */ { t: 'Why "almost covered" is worse than nothing', body: tbl(['Path', 'Seen by the post hook?', 'Fix'], [
      [c('findUnique') + ' / ' + c('…OrThrow'), 'only if listed', 'list it — Prisma accepts extra non-unique filters in findUnique'],
      [c('groupBy') + ', ' + c('aggregate'), 'only if listed', 'list every read you use'],
      [c('user.findMany({ include: { posts } })'), 'no — it is a User query', 'a where on the relation, or a view'],
      [c('$queryRaw'), 'no', 'write the filter in the SQL'],
      ['a database cascade', 'no', 'cascades and soft delete do not mix'],
    ]) + box('With no extension, everybody filters; with a partial one, nobody does', 'A team that trusts the extension stops writing deletedAt: null — and every path the table lists leaks deleted rows. Test the paths, not the hook.', 'do2') },
  /* 6 */ { t: 'Unique constraints keep counting deleted rows', body: two(sql(`-- schema: email String @unique  ⇒  users_email_key
ALTER TABLE users DROP CONSTRAINT users_email_key;
CREATE UNIQUE INDEX users_email_con_song
  ON users (email) WHERE deleted_at IS NULL;`, { sm: true }), tp(X.slice(9, 11).join('\n'), { wrap: 62, fs: 13, title: MOI }), '') +
      box('A soft-deleted user still owns the email', 'Re-registering failed with P2002 until the unique index became partial. Prisma&#39;s schema cannot express the WHERE — it lives in a hand-written migration (Lesson 6.3), and @unique must come off the field.', 'lam') +
      cards([
        ['Before', 'users_email_key covers every row, deleted or not: the address is taken forever.'],
        ['After', 'users_email_con_song covers live rows only: one live owner per address, any number of deleted ones.'],
      ], 2) },
  /* 7 */ { t: '$use is gone', body: tp(X.slice(11).join('\n') + '\n' + gon(OUT('them')).split('\n').filter((l) => !/^\$ /.test(l)).join('\n'), { wrap: 116, fs: 14, title: MOI }) + ts(`// old tutorials — no longer exists in Prisma 6.19.3
prisma.$use(async (params, next) => { /* … */ return next(params); });   // TypeError: prisma.$use is not a function
// replacement: a query extension, typed per model and operation
const prisma = base.$extends({ query: { post: { async delete({ args, query }) { /* … */ } } } });`, { sm: true }) +
      cards([
        ['Typed', 'args has the real type for that model and operation.'],
        ['Scoped', 'Only the models and operations you name.'],
        ['A new client', '$extends returns one; the base client stays available — and unfiltered.'],
      ], 3) + box('Migrating old middleware', 'Rewrite each $use branch as a query extension for that model and operation, then delete the $use call — on 6.19.3 there is nothing to keep running alongside.', 'lam') },
  /* 8 */ { t: 'The other three components, from Lesson 8.4', body: tp(gon(OUT('ext', 'p8-4')).split('\n').filter((l) => /^== (result|chong)|prisma:query SELECT "id", "full_name"|tenHienThi/.test(l)).join('\n') + '\n' + gon(OUT('them', 'p8-4')).split('\n').filter((l) => /include/.test(l)).join('\n'), { wrap: 116, fs: 13, title: MOI }) +
      tbl(['Component', 'Measured'], [
        [c('result') + ' + ' + c('needs'), 'adds the needed columns to the SELECT; present inside include'],
        [c('model') + ' / ' + c('client'), 'typed methods on the delegate and on prisma'],
        [c('query'), 'first extension added is the outermost'],
      ]) + box('Same machinery, different job', 'Lesson 8.4 measured the components one by one; soft delete is the case where a query extension is asked to enforce a rule — which is why its gaps matter.', 'lam') },
  /* 9 */ { t: 'Checklist for any query extension', body: steps([
      `List every operation you use — then test each one, not just the hook`,
      `Test reads through relations from other models`,
      `grep for ${c('$queryRaw')}: each one repeats the rule by hand`,
      `Make unique indexes partial when rows can be soft-deleted`,
      `Keep the base client private, or it bypasses everything`,
    ]) + box('Test the paths, not the hook', 'The eight-way read above is the test worth keeping: delete a row, then assert every read path your code uses.', 'xanh') },
  /* 10 */ { t: 'Your turn — and what to keep', body: two(steps([
      `Write the usual soft-delete extension`,
      `Delete one row; read it eight ways`,
      `Re-register a soft-deleted email; fix the index`,
      `Call ${c('prisma.$use')} on 6.19.3`,
      `Add ${c('findUnique')} to the list; read again`,
    ]), box('Keep these', `<ul><li>Hooks cover only what you list</li><li>include and raw SQL bypass them</li><li>Partial unique indexes</li><li>$use is gone — use $extends</li></ul>`, 'lam'), '') },
]);
