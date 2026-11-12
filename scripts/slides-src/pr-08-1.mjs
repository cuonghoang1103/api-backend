/**
 * pr-08-1 — Prisma ORM · Chapter 8 · Lesson 8.1 "The types you should be importing" (deck video, 12/11/2026). Bài web: pr-8-1-kieu-nen-import.
 * Output THẬT (`chay.sh p8-1`, CSDL c81, Prisma 6.19.3 · tsc 5.9.3 · PostgreSQL 16.14; lược đồ lab 4 model + 2 enum): kieu.ts cố ý 3 lỗi ⇒ TS2366 (switch thiếu DA_HUY) ·
 * TS2561 publisshed → "Did you mean published?" · TS2345 number ≠ Decimal · index.d.ts 284.711 byte, 177 kiểu *Input, 42 kiểu Post*Input · DbNull ⇒ cột SQL NULL,
 * JsonNull ⇒ cột chứa JSON null (jsonb_typeof 'null'), $queryRaw trả null cho CẢ HAI (không phải chuỗi 'null'), Prisma đọc ra null cả hai · lỗi: P2002 meta.target ["email"],
 * P2003 meta.constraint posts_author_id_fkey, P2025 meta.cause, trường lạ / enum sai ⇒ PrismaClientValidationError (không có code) · DbClient (Omit) nhận cả client lẫn tx;
 * client đã $extends KHÔNG gán được vào Prisma.TransactionClient (TS2345).
 */
/* Output chạy THẬT, đóng băng từ thư mục demo của khoá video Prisma (12/11/2026) — deck tự chứa, không đọc tệp ngoài repo. */
const DU_LIEU = {
 "demo/out/p8-1/kieu.txt": "$ npx tsc --noEmit --target es2022 --module nodenext --moduleResolution nodenext --strict --skipLibCheck p8/81/kieu.ts\np8/81/kieu.ts(8,32): error TS2366: Function lacks ending return statement and return type does not include 'undefined'.\np8/81/kieu.ts(21,18): error TS2561: Object literal may only specify known properties, but 'publisshed' does not exist in type 'PostWhereInput'. Did you mean to write 'published'?\np8/81/kieu.ts(24,10): error TS2345: Argument of type 'number' is not assignable to parameter of type 'Decimal'.\n[exit 2]\n",
 "demo/out/p8-1/dem-kieu.txt": "$ grep -c '^  export type .*Input = ' p8/gen/index.d.ts\n177\n$ grep -o 'export type Post[A-Za-z]*Input\\b' p8/gen/index.d.ts | sort -u | wc -l\n      42\n$ wc -c p8/gen/index.d.ts\n  284711 p8/gen/index.d.ts\n",
 "demo/out/p8-1/json-null.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c81 npx tsx p8/81/json-null.mts\n[\n  { id: 1, cai_dat: null, la_sql_null: true, kieu_json: null },\n  { id: 2, cai_dat: null, la_sql_null: false, kieu_json: 'null' }\n]\nPrisma doc ra: [ { id: 1, settings: null }, { id: 2, settings: null } ]\n",
 "demo/out/p8-1/loi.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c81 npx tsx p8/81/loi.mts\nemail trung → PrismaClientKnownRequestError P2002 meta={\"modelName\":\"User\",\"target\":[\"email\"]}\nkhoa ngoai khong ton tai → PrismaClientKnownRequestError P2003 meta={\"modelName\":\"Post\",\"constraint\":\"posts_author_id_fkey\"}\nupdate id khong ton tai → PrismaClientKnownRequestError P2025 meta={\"modelName\":\"User\",\"cause\":\"No record was found for an update.\"}\ntruong khong ton tai (qua any) → PrismaClientValidationError: Unknown argument `tuoi`. Did you mean `bio`? Available options are marked with ?.\nenum sai (qua any) → PrismaClientValidationError: Invalid value for argument `status`. Expected OrderStatus.\n",
 "demo/out/p8-1/dbclient.txt": "$ npx tsc --noEmit --target es2022 --module nodenext --moduleResolution nodenext --strict --skipLibCheck p8/81/dbclient.ts 2>&1 | cut -c1-200 | head -3\np8/81/dbclient.ts(11,18): error TS2345: Argument of type 'DynamicClientExtensionThis<TypeMap<InternalArgs & { result: {}; model: {}; query: {}; client: {}; }, {}>, TypeMapCb<PrismaClientOptions>, { re\n  The types of 'user.findUnique' are incompatible between these types.\n    Type '<A extends UserFindUniqueArgs<InternalArgs & { result: {}; model: {}; query: {}; client: {}; }>>(args: Exact<A, UserFindUniqueArgs<InternalArgs & { result: {}; model: {}; query: {}; client: \n"
};
const fs = { readFileSync: (p) => { const k = String(p); if (!(k in DU_LIEU)) throw new Error('thiếu dữ liệu đóng băng: ' + k); return DU_LIEU[k]; } };
import { lamDeck, tp, ts, two, box, cards, c, tbl, steps } from './_pr-chung.mjs';

export const deck = { key: 'pr-08-1', code: 'PR 8.1', title: 'The types you should be importing', sub: 'Chapter 8 · Lesson 8.1' };

const DEMO = 'demo';
const OUT = (t, ch = 'p8-1') => fs.readFileSync(`${DEMO}/out/${ch}/${t}.txt`, 'utf8').replace(/\n+$/, '');
const TSC = 'npx tsc --noEmit --target es2022 --module nodenext --moduleResolution nodenext --strict --skipLibCheck';
const gon = (s) => s.replace(/^\$ DATABASE_URL=\S+ /gm, '$ ').split(TSC).join('npx tsc --noEmit --strict …').replace(/p8\/8\d\//g, '').split('\n').filter((l) => !/^\s*$/.test(l)).join('\n');
const dong = (t, re, ch) => gon(OUT(t, ch)).split('\n').filter((l) => re.test(l)).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 8 — The generated type system', bai: '8.1' }, [
  /* 1 */ { cover: true, nhan: 'Chapter 8 · Lesson 8.1', t: 'The types you should be importing', sub: 'prisma generate already wrote them — six groups, and where each one belongs' },
  /* 2 */ { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Model types and enums — and the switch that turns red</li>
    <li>Args types for functions that take a filter</li>
    <li>Decimal and the Json family: DbNull is not JsonNull</li>
    <li>Error classes, and what is really inside <code>meta</code></li>
    <li>The client type, and the golden rule</li></ul>` },
  /* 3 */ { t: 'Model types and enums', body: two(ts(`import { OrderStatus, type User } from '@prisma/client';

// scalars only — exactly the columns
function visible(u: User) {
  return \`\${u.fullName ?? u.email} (\${u.id})\`;
}

// a value at runtime AND a type
function nhan(t: OrderStatus): string {
  switch (t) {
    case 'MOI':        return 'Moi tao';
    case 'DANG_XU_LY': return 'Dang xu ly';
    case 'DA_GIAO':    return 'Da giao';
    // 'DA_HUY' was just added to the enum
  }
}`, { sm: true }), tp(dong('kieu', /^\$|TS2366/), { wrap: 56, fs: 13 }), '') +
      box('Add an enum value, regenerate — every switch on it turns red', 'TS2366: the function no longer returns a string on every path. A hand-written union would have stayed green.', 'xanh') },
  /* 4 */ { t: 'Args types: a filter the caller cannot get wrong', body: ts(`async function findPost(
  where: Prisma.PostWhereInput,
  orderBy: Prisma.PostOrderByWithRelationInput = { createdAt: 'desc' },
  take = 20,
) { return prisma.post.findMany({ where, orderBy, take }); }

await findPost({ published: true, author: { role: 'ADMIN' } });
await findPost({ publisshed: true });     // typo`, { sm: true }) +
      tp(dong('kieu', /TS2561/) + '\n\n' + gon(OUT('dem-kieu')).replace(/p8\/gen\//g, 'gen/'), { wrap: 140, fs: 13 }) +
      cards([
        ['The typo is caught at the call', 'With <code>where: any</code> it would reach the database as an unknown argument — at runtime.'],
        ['There are many — import the namespace', 'Four models: a 285 KB <code>index.d.ts</code>, 177 <code>*Input</code> types. <code>import { Prisma }</code> once.'],
      ], 2) },
  /* 5 */ { t: 'Decimal, and the Json family', body: two(ts(`function dinhDang(price: Prisma.Decimal) {
  return price.toFixed(2);
}
dinhDang(12.5);          // a number is not a Decimal

await prisma.user.update({ where: { id: 1 },
  data: { settings: Prisma.DbNull } });
await prisma.user.update({ where: { id: 2 },
  data: { settings: Prisma.JsonNull } });
// then $queryRaw: cai_dat IS NULL,
//                 jsonb_typeof(cai_dat)`, { sm: true }), tp(dong('kieu', /TS2345/) + '\n\n' + gon(OUT('json-null')), { wrap: 60, fs: 12 }), '') +
      box('Two different rows — that Prisma reads back the same way', 'DbNull makes the column SQL NULL; JsonNull stores the JSON value null (jsonb_typeof says &#39;null&#39;). The driver returns null for both, and so does Prisma. To tell them apart, ask SQL: IS NULL.', 'lam') },
  /* 6 */ { t: 'Error classes: catch by class, then by code', body: two(ts(`const K = Prisma.PrismaClientKnownRequestError;
const V = Prisma.PrismaClientValidationError;
try {
  await prisma.user.create({ data });
} catch (e) {
  if (e instanceof K) {
    if (e.code === 'P2002')
      return res.status(409).json(e.meta?.target);
    if (e.code === 'P2003') return res.sendStatus(400);
    if (e.code === 'P2025') return res.sendStatus(404);
  }
  if (e instanceof V) return res.sendStatus(500);
  throw e;
}`, { sm: true }), tp(gon(OUT('loi')).replace(/ → /g, '\n  → ').replace(/ meta=/g, '\n    meta='), { wrap: 64, fs: 12 }), '') +
      box('The validation error has no code', 'An unknown field or a wrong enum value is a PrismaClientValidationError — no code, no meta. It is your query that is wrong, so a 500, not a 400.', 'do2') },
  /* 7 */ { t: 'The client type: one parameter for both', body: two(ts(`type DbClient = Omit<PrismaClient,
  '$connect' | '$disconnect' | '$on'
  | '$transaction' | '$extends'>;

async function ghiNhatKy(db: DbClient, id: number) {
  return db.post.update({ where: { id },
    data: { views: { increment: 1 } } });
}
await ghiNhatKy(prisma, 1);                // ✓
await prisma.$transaction((tx) =>
  ghiNhatKy(tx, 1));                       // ✓

type Tx = Prisma.TransactionClient;
async function ghiNhatKy2(db: Tx, id: number) { … }
await ghiNhatKy2(prisma.$extends({}), 1);  // ✗`, { sm: true }), tp(gon(OUT('dbclient')).replace(/ 2>&1 \| cut -c1-200 \| head -3/, ''), { wrap: 58, fs: 12 }), '') +
      cards([
        ['Plain client and tx: both fit', 'The Omit alias (or <code>Prisma.TransactionClient</code>) accepts the client and a transaction client.'],
        ['An extended client does not', 'After <code>$extends</code> it is a different type. Lesson 8.4 comes back to this.'],
      ], 2) },
  /* 8 */ { t: 'The golden rule', body: tbl(['Rule', 'Means', 'Example'], [
      ['Never hand-write', 'a type the generator produces', 'model interface, enum union, filter shape'],
      ['Derive, do not duplicate', c('Pick') + ', ' + c('Omit') + ', ' + c('GetPayload'), c("Omit<User, 'password'>") + ' breaks correctly on rename'],
      ['Hand-write the boundary', 'request and response contracts', 'a Zod schema for the request body'],
      ['The test', 'rename a column and rebuild', 'whatever still compiles uses a hand-written type'],
    ]) + box('If you can point at the schema field, import its type', 'Hand-written copies agree with themselves, so the compiler has nothing to compare. Lesson 8.3 is a production outage caused by exactly that.', 'lam') },
  /* 9 */ { t: 'Your turn — and what to keep', body: two(steps([
      `Add a value to an enum, regenerate, run ${c('tsc')}`,
      `Write a typo inside a ${c('PostWhereInput')}`,
      `Write DbNull and JsonNull; look with ${c('jsonb_typeof')}`,
      `Trigger P2002, P2003, P2025; print ${c('meta')}`,
    ]), box('Keep these', `<ul><li>Import, never copy</li><li>Exhaustive switches catch new enum values</li><li>DbNull ≠ JsonNull in the table</li><li>Catch by class, then by code</li></ul>`, 'lam'), '') },
]);
