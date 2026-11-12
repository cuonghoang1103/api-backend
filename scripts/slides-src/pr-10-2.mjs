/**
 * pr-10-2 — Prisma ORM · Chapter 10 · Lesson 10.2 "The type parameter on $queryRaw is a promise nobody checks" (deck video, 12/11/2026). Bài web: pr-10-2-kieu-la-loi-hua.
 * Output THẬT (`chay.sh p10-2`, prisma-pg PostgreSQL 16.14, CSDL c102; Prisma 6.19.3; zod 3): $queryRaw<User[]> chỉ lấy id ⇒ email undefined ⇒ TypeError · count(*) ⇒ 50n,
 * JSON.stringify ném "Do not know how to serialize a BigInt"; ::int ⇒ 50 · numeric ⇒ Decimal: price + 100 = "249000100", plus(100) = 249100, 0.10 + 0.20 chính xác ·
 * "User" không tồn tại (42P01), "avatarUrl" không tồn tại (42703), avatar_url AS "avatarUrl" giữ chữ hoa, không ngoặc kép ⇒ avatarurl · zod bắt bigint · LOCK TABLE thô và
 * builder trong cùng một $transaction.
 */
/* Output chạy THẬT, đóng băng từ thư mục demo của khoá video Prisma (12/11/2026) — deck tự chứa, không đọc tệp ngoài repo. */
const DU_LIEU = {
 "demo/out/p10-2/loi-hua.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c102 npx tsx p10/102/kieu.mts loi-hua\nusers[0] = { id: 1 }\nusers[0].email.toLowerCase() → TypeError: Cannot read properties of undefined (reading 'toLowerCase')\n",
 "demo/out/p10-2/bigint.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c102 npx tsx p10/102/kieu.mts bigint\n{ author_id: 1, post_count: 50n }\nJSON.stringify(rows) → TypeError: Do not know how to serialize a BigInt\nvoi ::int → { author_id: 1, post_count: 50 }\n",
 "demo/out/p10-2/decimal.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c102 npx tsx p10/102/kieu.mts decimal\n249000 object i\nprice + 100 = 249000100\nprice.plus(100).toString() = 249100\n0.10 + 0.20 bang Decimal = 0.3 · bang number = 0.30000000000000004\n",
 "demo/out/p10-2/ten-cot.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c102 npx tsx p10/102/kieu.mts ten-cot\nSELECT \"avatarUrl\" FROM \"User\" → PrismaClientKnownRequestError: P2010 Raw query failed. Code: `42P01`. Message: `relation \"User\" does not exist`\nSELECT \"avatarUrl\" FROM users → PrismaClientKnownRequestError: P2010 Raw query failed. Code: `42703`. Message: `column \"avatarUrl\" does not exist`\nSELECT id, avatar_url FROM users → [ { id: 1, avatar_url: 'https://cdn.vd/a/1.png' } ]\n… AS \"avatarUrl\" → [ { id: 1, avatarUrl: 'https://cdn.vd/a/1.png' } ]\n… AS avatarUrl (khong ngoac kep) → [ { id: 1, avatarurl: 'https://cdn.vd/a/1.png' } ]\n",
 "demo/out/p10-2/zod.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c102 npx tsx p10/102/kieu.mts zod\nparse khong ep kieu → ZodError: {\"code\":\"invalid_type\",\"expected\":\"number\",\"received\":\"bigint\",\"path\":[0,\"post_count\"],\"message\":\"Expected number, received bigint\"}\nparse voi ::int → [\n  { author_id: 1, post_count: 50, gan_nhat: 2026-03-11T10:40:00.000Z },\n  { author_id: 2, post_count: 50, gan_nhat: 2026-03-11T05:19:00.000Z }\n]\n",
 "demo/out/p10-2/tx.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c102 npx tsx p10/102/kieu.mts tx\ntrong cung giao dich: khoa ShareRowExclusiveLock · gia moi 249001\n"
};
const fs = { readFileSync: (p) => { const k = String(p); if (!(k in DU_LIEU)) throw new Error('thiếu dữ liệu đóng băng: ' + k); return DU_LIEU[k]; } };
import { lamDeck, tp, ts, sql, prs, two, box, cards, c, tbl, steps , icards, cmp, bars, hub, tiers, flow } from './_pr-chung.mjs';

export const deck = { key: 'pr-10-2', code: 'PR 10.2', title: 'The type on $queryRaw is a promise nobody checks', sub: 'Chapter 10 · Lesson 10.2' };

const DEMO = 'demo';
const OUT = (t, ch = 'p10-2') => fs.readFileSync(`${DEMO}/out/${ch}/${t}.txt`, 'utf8').replace(/\n+$/, '');
const gon = (s) => s.replace(/^\$ DATABASE_URL=\S+ /gm, '$ ').replace(/p10\/10\d\//g, '').split('\n').filter((l) => !/^\s*$/.test(l)).join('\n');
const MOI = 'terminal — PostgreSQL 16.14 · Prisma 6.19.3';
const bo$ = (t) => gon(OUT(t)).split('\n').filter((l) => !/^\$ /.test(l)).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 10 — Escape hatches: raw SQL and client extensions', bai: '10.2' }, [
  /* 1 */ { cover: true, nhan: 'Chapter 10 · Lesson 10.2', t: 'The type on $queryRaw is a promise nobody checks', sub: 'BigInt, Decimal, column names — and putting a real check back' },
  /* 2 */ { t: 'What you will take away from this lesson', body: icards([
      ['type', 'What the generic on $queryRaw really is', ''],
      ['count', 'count(*) is a BigInt — and res.json throws', ''],
      ['db', 'numeric is a Decimal — and + concatenates', ''],
      ['map', 'Raw SQL speaks column names, not field names', ''],
      ['shield', 'zod at the boundary, and raw inside a transaction', ''],
    ], 2) },
  /* 3 */ { t: 'The generic is an assertion, not a check', body: two(ts(`const users = await prisma.$queryRaw<User[]>\`
  SELECT id FROM users LIMIT 3\`;
console.log(users[0]);
users[0].email.toLowerCase();   // tsc: fine`, { sm: true }), tp(bo$('loi-hua'), { wrap: 60, fs: 13, title: MOI }), '') +
      cards([
        ['Builder: types derived', 'findMany({ select: { id: true } }) returns { id }[] — ask for .email and tsc stops you.'],
        ['Raw: types asserted', '$queryRaw<User[]> is you telling the compiler what to believe. Nothing verifies it.'],
        ['The drift', 'Rename a column: builder queries break at compile time, raw queries break in production.'],
      ], 3) + box('The generic is a cast', '$queryRaw&lt;T = unknown&gt; returns PrismaPromise&lt;T&gt;: T is whatever you write. The compiler cannot read the SQL string.', 'lam') },
  /* 4 */ { t: '1 · count(*) is a BigInt', body: sql(`SELECT author_id, count(*) AS post_count FROM posts GROUP BY author_id;        -- 50n
SELECT author_id, count(*)::int AS post_count FROM posts GROUP BY author_id;   -- 50`, { sm: true }) +
      tp(bo$('bigint'), { wrap: 116, fs: 15, title: MOI }) +
      box('Cast in SQL, not in JavaScript', 'count() is bigint in PostgreSQL, so the driver hands you 50n and JSON.stringify — res.json — throws. ::int fixes it once, in the query, instead of at every call site.', 'lam') },
  /* 5 */ { t: '2 · numeric is a Decimal object', body: two(ts(`const rows = await prisma.$queryRaw<any[]>\`
  SELECT id, price FROM orders ORDER BY id\`;
console.log(rows[0].price, typeof rows[0].price);
console.log(rows[0].price + 100);
console.log(rows[0].price.plus(100).toString());
rows[2].price.plus('0.20').toString();   // 0.10 + 0.20
rows[2].price.toNumber() + 0.2;`, { sm: true }), tp(bo$('decimal'), { wrap: 60, fs: 13, title: MOI }), '') +
      box('Decimal + number is string concatenation', 'JavaScript&#39;s + falls back to strings for an object: 249000 + 100 became "249000100". Use plus(), or convert deliberately — toNumber() brings back 0.30000000000000004.', 'do2') +
      cards([
        ['Money', 'Keep it Decimal end to end; send it to the client as a string.'],
        ['Same through the builder', 'A Decimal field read with findMany is the same Decimal object (Lesson 2.1).'],
      ], 2) },
  /* 6 */ { t: '3 · Raw SQL speaks column names', body: prs(`model User {
  avatarUrl String? @map("avatar_url")
  @@map("users")
}`, { sm: true }) + tp(bo$('ten-cot'), { wrap: 116, fs: 13, title: MOI }) +
      cards([
        ['The error is the good case', '"User" and "avatarUrl" do not exist in PostgreSQL — @map and @@map do not apply to raw SQL.'],
        ['Alias back, with quotes', 'avatar_url AS "avatarUrl" keeps one vocabulary in your code.'],
        ['Without quotes it is folded', 'AS avatarUrl came back as avatarurl — lower-cased by PostgreSQL.'],
      ], 3) },
  /* 7 */ { t: '4 · Putting a real check back', body: two(ts(`import { z } from 'zod';
const StatsRow = z.object({
  author_id: z.number().int(),
  post_count: z.number().int(),
  gan_nhat: z.date(),
});
const rows = StatsRow.array().parse(
  await prisma.$queryRaw\`
    SELECT author_id, count(*)::int AS post_count,
           max(created_at) AS gan_nhat
    FROM posts GROUP BY author_id\`);`, { sm: true }), tp(bo$('zod'), { wrap: 62, fs: 12, title: MOI }), '') +
      box('Inferred and verified', 'The type comes from the schema and the check runs on every call. Forget ::int and zod says exactly where: expected number, received bigint.', 'xanh') },
  /* 8 */ { t: 'Raw and builder share a transaction', body: ts(`await prisma.$transaction(async (tx) => {
  await tx.$executeRaw\`LOCK TABLE orders IN SHARE ROW EXCLUSIVE MODE\`;
  const o = await tx.order.findUniqueOrThrow({ where: { id: 1 } });
  await tx.order.update({ where: { id: 1 }, data: { price: o.price.plus(1) } });
});`, { sm: true }) + tp(bo$('tx'), { wrap: 116, fs: 15, title: MOI }) +
      tbl(['What raw SQL bypasses', 'Consequence'], [
        ['client extensions (10.5)', 'a soft-delete filter does not apply'],
        [c('@default(uuid())') + ', ' + c('@updatedAt'), 'filled by Prisma, not the database — unless the migration added a default'],
        ['field names, enums as TS types', 'column names; enums come back as strings'],
        ['transactions', 'nothing — tx.$queryRaw runs inside the transaction'],
      ]) },
  /* 9 */ { t: 'The rule', body: cmp(['Do', 'Why'], [
      ['Cast counts with ' + c('::int'), 'BigInt breaks JSON'],
      ['Do arithmetic with Decimal methods', c('+') + ' concatenates'],
      ['Write column names; alias with quotes', 'mappings do not apply'],
      ['Parse at the boundary with zod', 'the generic is only an assertion'],
      ['Or let the database type it', 'TypedSQL — Lesson 10.4'],
    ]) + box('One rule underneath', 'Raw SQL hands you what PostgreSQL returned, converted by the driver — never what you wrote in the angle brackets.', 'lam') },
  /* 10 */ { t: 'Your turn — and what to keep', body: two(steps([
      `Cast a raw result to ${c('User[]')}; read a missing field`,
      `${c('JSON.stringify')} a ${c('count(*)')}; then add ${c('::int')}`,
      `Add 100 to a Decimal with ${c('+')} and with ${c('plus')}`,
      `Parse a raw result with zod`,
      `Select ${c('avatarUrl')} by its field name in raw SQL`,
    ]), box('Keep these', `<ul><li>$queryRaw&lt;T&gt; checks nothing</li><li>count is BigInt — cast it</li><li>Decimal: plus, not +</li><li>Column names, quoted aliases</li></ul>`, 'lam'), '') },
]);
