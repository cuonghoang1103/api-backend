/**
 * pr-11-4 — Prisma ORM · Chapter 11 · Lesson 11.4 "Seeds, data migrations and backfills are three different things" (deck video, 12/11/2026). Bài web: pr-11-4-seed-va-nap-bu.
 * Output THẬT (`chay.sh p11-4` → out/p11-4/ba-thu.txt; prisma-pg PostgreSQL 16.14, CSDL c114; Prisma 6.19.3, tsc 5.9.3, tsx; Mac arm64):
 * seed create chạy lần hai ⇒ P2002 · upsert hai lần ⇒ hội tụ; update: {} ⇒ tên KHÔNG đổi; update có tên ⇒ đổi · tsconfig exclude prisma ⇒ tsc exit=0; tsconfig.seed ⇒ TS2322 exit=2; chạy ⇒ PrismaClientValidationError ·
 * data migration (ADD + UPDATE + UNIQUE) trên 200.001 hàng có trùng ⇒ P3018 / 23505, cột KHÔNG còn (cả file lùi), _prisma_migrations xong=f; sạch dữ liệu + resolve (CSDL tạm) ⇒ áp được, 2 s ·
 * nạp bù 200.000 hàng: chạy thử không ghi; giết sau 6 s còn 190.000; chạy lại tiếp từ chỗ dừng, 190.000 hàng, mốc log 180.000 ở 107 s (lô 1000, $transaction update từng hàng).
 */
/* Output chạy THẬT, đóng băng từ thư mục demo của khoá video Prisma (12/11/2026) — deck tự chứa, không đọc tệp ngoài repo. */
const DU_LIEU = {
 "demo/out/p11-4/ba-thu.txt": "$ bash p11/114/chay.sh\nThe following migration(s) have been applied:\n== 1. Seed bằng create, chạy hai lần\n$ npx tsx prisma/seed-create.ts\nseed xong: 1 danh mục\n$ npx tsx prisma/seed-create.ts\nP2002: Unique constraint failed on the fields: (`slug`)\n== 2. Seed bằng upsert, chạy hai lần, rồi sửa tên trong seed\n$ npx tsx prisma/seed.ts\nseed xong: 1 danh mục · databases = \"Cơ sở dữ liệu\"\n$ npx tsx prisma/seed.ts\nseed xong: 1 danh mục · databases = \"Cơ sở dữ liệu\"\n$ UPDATE_RONG=1 TEN=\"CSDL & SQL\" npx tsx prisma/seed.ts   # update: {}\nseed xong: 1 danh mục · databases = \"Cơ sở dữ liệu\"\n$ TEN=\"CSDL & SQL\" npx tsx prisma/seed.ts                 # update có tên\nseed xong: 1 danh mục · databases = \"CSDL & SQL\"\n== 3. tsc --noEmit không nhìn seed\n$ grep exclude tsconfig.json\n\"exclude\": [\"node_modules\", \"prisma\"]\n$ npx tsc --noEmit; echo \"exit=$?\"\nexit=0\n$ npx tsc -p tsconfig.seed.json; echo \"exit=$?\"   # include prisma/**/*.ts\nprisma/seed-loai.ts(7,38): error TS2322: Type '\"CODE\"' is not assignable to type 'ContentType'.\nexit=2\n$ npx tsx prisma/seed-loai.ts   # chạy thật\nPrismaClientValidationError: Invalid `prisma.post.create()` invocation in | Invalid value for argument `type`. Expected ContentType.\n== 4. Data migration: cột + UPDATE + chỉ mục unique trong MỘT file\n$ psql -c \"SELECT count(*) FROM users\"\n200001\n-- prisma/migrations/1_chuan_hoa_email/migration.sql\n   SET lock_timeout = '3s';\n   ALTER TABLE \"users\" ADD COLUMN \"email_chuan_hoa\" TEXT;\n   UPDATE \"users\" SET \"email_chuan_hoa\" = lower(trim(\"email\"));\n   CREATE UNIQUE INDEX \"users_email_chuan_hoa_key\" ON \"users\" (\"email_chuan_hoa\");\n$ npx prisma migrate deploy\n2 migrations found in prisma/migrations\nApplying migration `1_chuan_hoa_email`\nError: P3018\nA migration failed to apply. New migrations cannot be applied before the error is recovered from. Read more about how to resolve migration issues in a production database: https://pris.ly/d/migrate-resolve\nMigration name: 1_chuan_hoa_email\nDatabase error code: 23505\nDatabase error:\nERROR: could not create unique index \"users_email_chuan_hoa_key\"\nDETAIL: Key (email_chuan_hoa)=(u1@x.vn) is duplicated.\n   (2 s)\n$ psql -c \"\\d users\" | grep email_chuan_hoa   # cột có còn sau khi migration hỏng?\n   số dòng khớp: 0\n$ psql -c \"SELECT migration_name, finished_at IS NOT NULL AS xong, rolled_back_at FROM _prisma_migrations\"\n     migration_name   | xong | rolled_back_at \n   -------------------+------+----------------\n    0_init            | t    | \n    1_chuan_hoa_email | f    | \n   (2 rows)\n   \n-- (dọn trong CSDL tạm: xoá hàng trùng, đánh dấu rolled-back — CHỈ ở CSDL demo này)\n$ npx prisma migrate deploy   # lần hai, dữ liệu đã sạch\nApplying migration `1_chuan_hoa_email`\nThe following migration(s) have been applied:\nAll migrations have been successfully applied.\n   (2 s, 200.000 hàng)\n== 5. Nạp bù ho_ten (200.000 hàng)\n$ npx tsx scripts/nap-bu-ho-ten.ts           # mặc định: chạy thử\n[thử] sẽ cập nhật 1000 hàng, ví dụ: { id: 1, fullName: 'Người 1' }\nxong: 0 hàng lần này · còn null: 200000\n$ psql -c \"SELECT count(*) FROM users WHERE ho_ten IS NULL\"\n200000\n$ timeout 6 npx tsx scripts/nap-bu-ho-ten.ts --that   # giết giữa chừng sau 6 giây\n[exit 124]\n$ psql -c \"SELECT count(*) FROM users WHERE ho_ten IS NULL\"\n190000\n$ npx tsx scripts/nap-bu-ho-ten.ts --that     # chạy lại: tiếp từ chỗ dừng\n20000 hàng · 12 s\n40000 hàng · 23 s\n60000 hàng · 36 s\n80000 hàng · 53 s\n100000 hàng · 64 s\n120000 hàng · 75 s\n140000 hàng · 85 s\n160000 hàng · 96 s\n180000 hàng · 107 s\nxong: 190000 hàng lần này · còn null: 0\n"
};
const fs = { readFileSync: (p) => { const k = String(p); if (!(k in DU_LIEU)) throw new Error('thiếu dữ liệu đóng băng: ' + k); return DU_LIEU[k]; } };
import { lamDeck, two, box, cards, c, tbl, steps, icards, cmp, bars, tiers, flow, sql, ts, tc, vsd } from './_pr-chung.mjs';

export const deck = { key: 'pr-11-4', code: 'PR 11.4', title: 'Seeds, data migrations and backfills are three different things', sub: 'Chapter 11 · Lesson 11.4' };

const DEMO = 'demo';
const L = fs.readFileSync(`${DEMO}/out/p11-4/ba-thu.txt`, 'utf8').replace(/\n+$/, '').split('\n').filter((l) => !/^\$ bash /.test(l));
const khoi = (tu, den) => { const a = L.findIndex((l) => l.startsWith(tu)); const b = den ? L.findIndex((l, i) => i > a && l.startsWith(den)) : L.length; return L.slice(a, b < 0 ? L.length : b).filter((l) => l.trim() !== ''); };
const MOI = 'terminal — PostgreSQL 16.14 · Prisma 6.19.3 · tsc 5.9.3';
const T = (s, o = {}) => tc(s, { title: MOI, ...o });

export const slides = lamDeck({ chuong: 'Chapter 11 — Shipping to production', bai: '11.4' }, [
  /* 1 */ { cover: true, nhan: 'Chapter 11 · Lesson 11.4', t: 'Seeds, data migrations and backfills are three different things', sub: 'Three scripts that write data — and what happens when each runs twice' },
  /* 2 */ { t: 'What you will take away from this lesson', body: icards([
      ['seed', 'A seed that can run any number of times', 'upsert, and the update: {} trap'],
      ['type', 'Why tsc did not check the seed', 'And the config that does'],
      ['layers', 'A data migration is all or nothing', 'Measured on 200,000 rows'],
      ['loop', 'A backfill you can kill and resume', 'The filter is the cursor'],
    ], 2) },
  /* 3 */ { t: 'Three scripts, three contracts', body: cmp(['', 'Seed', 'Data migration', 'Backfill'], [
      ['Runs', 'many times — every fresh DB, every CI run', 'exactly once, recorded', 'once, for hours, out of band'],
      ['Run twice', 'must converge to the same state', 'never runs twice — _prisma_migrations', 'continues where it stopped'],
      ['Duration', 'seconds', 'seconds — it blocks the deploy', 'as long as it takes'],
      ['Written as', 'upsert on a natural key', 'SQL in a migration file', 'chunks + a filter + a dry run'],
    ]) + flow([
      { t: 'seed', s: 'reference data', mau: '#2f7d32' },
      { t: 'data migration', s: 'with a schema change', mau: '#336791' },
      { t: 'backfill', s: 'big tables, later', mau: '#b85a2b' },
    ], { h: 120 }) },
  /* 4 */ { t: 'The seed: create runs once, upsert runs forever', body: ts(`// ❌ second run: P2002
await prisma.category.create({ data: { slug: 'databases', name: TEN, sortOrder: 3 } });
// ✅ converges on the same state
await prisma.category.upsert({ where: { slug: 'databases' },
  update: { name: TEN, sortOrder: 3 }, create: { slug: 'databases', name: TEN, sortOrder: 3 } });`, { sm: true }) +
      T(khoi('$ npx tsx prisma/seed-create.ts', '$ UPDATE_RONG').filter((l) => !/^== /.test(l)).join('\n'), { wrap: 112, fs: 14 }) +
      box('A stable natural key', 'slug, code, email — something the seed itself decides. An id generated per run makes upsert insert every time.', 'lam') },
  /* 5 */ { t: 'update: {} — the seed that never updates', body: T(khoi('$ UPDATE_RONG', '== 3.').join('\n'), { wrap: 112, fs: 14 }) +
      vsd(ts(`update: {},   // existing rows keep the old name`, { sm: true }) + '<p>Editing a name in the seed never reaches an environment that already ran it.</p>',
        ts(`update: { name: TEN, sortOrder: 3 },`, { sm: true }) + '<p>The seed file is the source of truth for reference data — every run applies it.</p>', '✗ update: {}', '✓ update with the fields') },
  /* 6 */ { t: 'Why tsc --noEmit did not check the seed', body: T(khoi('$ grep exclude', '== 4.').join('\n'), { wrap: 112, fs: 13 }) +
      flow([
        { t: 'tsconfig excludes prisma/', s: 'tsc: exit 0', mau: '#c62828' },
        { t: 'tsconfig.seed.json', s: 'TS2322: "CODE"', mau: '#2f7d32' },
        { t: 'run the seed', s: 'the only full proof', mau: '#336791' },
      ], { h: 120 }) +
      box('CuongThai, 08/08/2026', 'An enum value renamed CODE → CODE_REVIEW passed the whole checklist and broke the seed on production: the seed lived in an excluded folder and kept its own copy of the union. Now: typecheck:seed + actually run the seed.', 'do2') },
  /* 7 */ { t: 'A data migration is all or nothing', body: two(sql(`SET lock_timeout = '3s';
ALTER TABLE "users" ADD COLUMN "email_chuan_hoa" TEXT;
UPDATE "users" SET "email_chuan_hoa" = lower(trim("email"));
CREATE UNIQUE INDEX "users_email_chuan_hoa_key"
  ON "users" ("email_chuan_hoa");`.replace('ADD COLUMN "email_chuan_hoa" TEXT', 'ADD COLUMN\n  "email_chuan_hoa" TEXT').replace('SET "email_chuan_hoa" = lower(trim("email"))', 'SET\n  "email_chuan_hoa" = lower(trim("email"))'), { sm: true }), T(khoi('$ npx prisma migrate deploy', '$ psql -c "\\d users"').filter((l) => !/^Read more|^A migration failed|^2 migrations|^Database error:$/.test(l)).join('\n'), { wrap: 60, fs: 12 }), '') +
      T(khoi('$ psql -c "\\d users"', '-- (dọn').join('\n'), { wrap: 112, fs: 13 }) +
      box('One duplicate, nothing applied', 'u1@x.vn and U1@X.VN collide after lower(). The index failed — and the column is gone too: the whole file ran as one transaction. The history row stays "not finished", blocking every later deploy.', 'do2') },
  /* 8 */ { t: 'Recovering — in a throwaway database', body: T(khoi('-- (dọn', '== 5.').join('\n'), { wrap: 112, fs: 14 }) +
      steps([
        `Find what the migration tripped on (here: one duplicate email)`,
        `Fix the data — never rewrite the migration to dodge it`,
        `${c('migrate resolve --rolled-back')} — only because the file applied nothing`,
        `${c('migrate deploy')} again: 200,000 rows, about 2 s on this machine`,
      ]) + box('On production, stop first', 'Read the failed migration, check which statements ran, then decide with the team. Lesson 12.2 walks through P3018 and P3009 step by step.', 'lam') },
  /* 9 */ { t: 'The backfill: chunked, resumable, dry by default', body: two(ts(`const THAT = process.argv.includes('--that');
for (;;) {
  // rows not yet backfilled ARE the queue
  const todo = await prisma.user.findMany({
    where: { hoTen: null }, take: LO,
    select: { id: true, fullName: true },
    orderBy: { id: 'asc' } });
  if (todo.length === 0) break;
  if (!THAT) { console.log('[thử]', todo[0]); break; }
  await prisma.$transaction(todo.map((u) =>
    prisma.user.update({
      where: { id: u.id },
      data: { hoTen: u.fullName } })));
}`, { sm: true }), T(khoi('$ npx tsx scripts/nap-bu-ho-ten.ts').filter((l) => !/^(4|8|12|16)0000 /.test(l)).join('\n'), { wrap: 60, fs: 12 }), '') },
  /* 10 */ { t: 'What makes a backfill safe to run for hours', body: bars([['killed after 6 s', 10000, '#b85a2b', 'rows done'], ['resumed run', 190000, '#336791', '180,000 logged at 107 s, this Mac']], { don: 'rows', nhan: 220, fs: 18, rh: 48 }) +
      flow([
        { t: 'find 1,000 null rows' },
        { t: 'update them', s: 'one transaction' },
        { t: 'log progress' },
        { t: 'pause', s: 'then repeat', mau: '#2f7d32' },
      ], { h: 110, fs: 18 }) +
      icards([
        ['filter', 'The filter is the cursor', 'where: { hoTen: null } — finished rows leave the queue; nothing to store'],
        ['shield', 'Dry run by default', 'A forgotten flag writes nothing; --that is required to write'],
        ['clock', 'Breathe between chunks', 'A pause per chunk leaves headroom for the app&#39;s pool (Lesson 9.4)'],
        ['pulse', 'Print progress', 'Two lines give a rate; a rate gives an end time'],
      ], 2) },
  /* 11 */ { t: 'Your turn — and what to keep', body: two(steps([
      `Run a create-seed twice; switch to upsert`,
      `Try ${c('update: {}')}, then change a name`,
      `Exclude prisma/ from tsc; add tsconfig.seed.json`,
      `Make a data migration hit a duplicate; inspect the table`,
      `Kill a backfill halfway; run it again`,
    ]), box('Keep these', `<ul><li>Seed = upsert on a natural key</li><li>Type-check and run the seed</li><li>A migration file is one transaction</li><li>Backfill: filter, chunks, dry run</li></ul>`, 'lam'), '') },
]);
