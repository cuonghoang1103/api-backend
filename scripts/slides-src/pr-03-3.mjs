/**
 * pr-03-3 — Prisma ORM · Chapter 3 · Lesson 3.3 "One-to-one, and where to put the key" (deck video, 12/11/2026). Bài web: pr-3-3-mot-mot.
 * Output THẬT (`chay.sh p3-3`, demo/lab/p3/33, CSDL c33, Prisma 6.19.3 · PostgreSQL 16.14): một–một = cột user_id + UNIQUE INDEX profiles_user_id_key
 * + FK ON DELETE CASCADE · bỏ @unique ⇒ migrate diff chỉ còn DROP INDEX · khoá đặt sai phía ⇒ tsc TS2322 "Property 'profile' is missing … required in
 * type 'UserCreateInput'" · bắt buộc cả hai phía ⇒ P1012 · hồ sơ thứ hai cho cùng user ⇒ P2002 target user_id · user không hồ sơ ⇒ profile: null ·
 * model User của CuongThai: 489 dòng, 43 cột vô hướng.
 */
/* Output chạy THẬT, đóng băng từ thư mục demo của khoá video Prisma (12/11/2026) — deck tự chứa, không đọc tệp ngoài repo. */
const DU_LIEU = {
 "demo/lab/p3/33/dung.prisma": "generator client {\n  provider = \"prisma-client-js\"\n  output   = \"./gen\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n  url      = env(\"DATABASE_URL\")\n}\n\nmodel User {\n  id      Int      @id @default(autoincrement())\n  email   String   @unique\n  profile Profile? // back-relation, always optional\n\n  @@map(\"users\")\n}\n\nmodel Profile {\n  id     Int     @id @default(autoincrement())\n  bio    String?\n  userId Int     @unique @map(\"user_id\") // @unique is what makes it one-to-one\n  user   User    @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@map(\"profiles\")\n}\n",
 "demo/out/p3-3/sql.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c33 npx prisma migrate diff --from-empty --to-schema-datamodel p3/33/dung.prisma --script | sed -n '/CREATE TABLE \"profiles\"/,$p' | grep -v '^$'\nCREATE TABLE \"profiles\" (\n    \"id\" SERIAL NOT NULL,\n    \"bio\" TEXT,\n    \"user_id\" INTEGER NOT NULL,\n    CONSTRAINT \"profiles_pkey\" PRIMARY KEY (\"id\")\n);\n-- CreateIndex\nCREATE UNIQUE INDEX \"users_email_key\" ON \"users\"(\"email\");\n-- CreateIndex\nCREATE UNIQUE INDEX \"profiles_user_id_key\" ON \"profiles\"(\"user_id\");\n-- AddForeignKey\nALTER TABLE \"profiles\" ADD CONSTRAINT \"profiles_user_id_fkey\" FOREIGN KEY (\"user_id\") REFERENCES \"users\"(\"id\") ON DELETE CASCADE ON UPDATE CASCADE;\n",
 "demo/out/p3-3/bo-unique.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c33 npx prisma migrate diff --from-schema-datamodel p3/33/dung.prisma --to-schema-datamodel p3/33/motnhieu.prisma --script | grep -v '^$'\n-- DropIndex\nDROP INDEX \"profiles_user_id_key\";\n",
 "demo/lab/p3/33/sai.prisma": "generator client {\n  provider = \"prisma-client-js\"\n  output   = \"./gen-sai\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n  url      = env(\"DATABASE_URL\")\n}\n\n// WRONG WAY ROUND — User holds the key to Profile\nmodel User {\n  id        Int     @id @default(autoincrement())\n  email     String  @unique\n  profileId Int     @unique @map(\"profile_id\")\n  profile   Profile @relation(fields: [profileId], references: [id])\n}\n\nmodel Profile {\n  id   Int     @id @default(autoincrement())\n  bio  String?\n  user User?\n}\n",
 "demo/out/p3-3/sai-tsc.txt": "$ cd p3/33 && npx tsc -p tsconfig.json\nsai.ts(4,28): error TS2322: Type '{ email: string; }' is not assignable to type '(Without<UserCreateInput, UserUncheckedCreateInput> & UserUncheckedCreateInput) | (Without<...> & UserCreateInput)'.\n  Type '{ email: string; }' is not assignable to type 'Without<UserUncheckedCreateInput, UserCreateInput> & UserCreateInput'.\n    Property 'profile' is missing in type '{ email: string; }' but required in type 'UserCreateInput'.\n[exit 2]\n",
 "demo/lab/p3/33/cahai.prisma": "datasource db {\n  provider = \"postgresql\"\n  url      = env(\"DATABASE_URL\")\n}\n\n// Required on BOTH sides — a user must have a profile AND vice versa\nmodel User {\n  id      Int     @id @default(autoincrement())\n  profile Profile\n}\n\nmodel Profile {\n  id     Int  @id @default(autoincrement())\n  userId Int  @unique\n  user   User @relation(fields: [userId], references: [id])\n}\n",
 "demo/out/p3-3/cahai.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c33 npx prisma validate --schema p3/33/cahai.prisma 2>&1 | grep -vE '^\\s*$|Environment|schema loaded|Context|CLI Version'\nError: Prisma schema validation - (validate wasm)\nError code: P1012\nerror: Error parsing attribute \"@relation\": The relation field `profile` on Model `User` is required. This is not valid because it's not possible to enforce this constraint on the database level. Please change the field type from `Profile` to `Profile?` to fix this.\n  -->  p3/33/cahai.prisma:9\n   | \n 8 |   id      Int     @id @default(autoincrement())\n 9 |   profile Profile\n10 | }\n   | \nValidation Error Count: 1\n",
 "demo/lab/p3/33/hai.mts": "import { PrismaClient } from './gen/index.js';\nconst prisma = new PrismaClient();\nconst u = await prisma.user.create({\n  data: { email: 'an@example.com', profile: { create: { bio: 'first' } } },\n  include: { profile: true },\n});\nconsole.log('user + profile:', JSON.stringify(u));\ntry { await prisma.profile.create({ data: { bio: 'second', userId: u.id } }); }\ncatch (e: any) { console.log('second profile:', e.code, JSON.stringify(e.meta)); }\nconst lone = await prisma.user.create({ data: { email: 'lone@example.com' }, include: { profile: true } });\nconsole.log('user without profile:', JSON.stringify(lone));\nawait prisma.$disconnect();\n",
 "demo/out/p3-3/hai.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c33 npx tsx p3/33/hai.mts\nuser + profile: {\"id\":1,\"email\":\"an@example.com\",\"profile\":{\"id\":1,\"bio\":\"first\",\"userId\":1}}\nsecond profile: P2002 {\"modelName\":\"Profile\",\"target\":[\"user_id\"]}\nuser without profile: {\"id\":2,\"email\":\"lone@example.com\",\"profile\":null}\n",
 "demo/out/p3-3/ct-user.txt": "$ awk '/^model User \\{/,/^}/' ~/Downloads/api-backend/prisma/schema.prisma | wc -l; awk '/^model User \\{/,/^}/' ~/Downloads/api-backend/prisma/schema.prisma | grep -cE '^  [a-z][A-Za-z]+ +(String|Int|DateTime|Boolean)'\n     489\n43\n"
};
const fs = { readFileSync: (p) => { const k = String(p); if (!(k in DU_LIEU)) throw new Error('thiếu dữ liệu đóng băng: ' + k); return DU_LIEU[k]; } };
import { lamDeck, prs, ts, tp, sql, two, box, cards, c, tbl, steps } from './_pr-chung.mjs';

export const deck = { key: 'pr-03-3', code: 'PR 3.3', title: 'One-to-one, and where to put the key', sub: 'Chapter 3 · Lesson 3.3' };

const DEMO = 'demo';
const OUT = (t) => fs.readFileSync(`${DEMO}/out/p3-3/${t}.txt`, 'utf8').replace(/\n+$/, '');
const SRC = (t) => fs.readFileSync(`${DEMO}/lab/p3/33/${t}`, 'utf8').replace(/\n+$/, '');
const than = (f) => SRC(f).split('\n').filter((l) => !/^(generator|datasource|  provider|  output|  url)|^}$/.test(l) || false).join('\n');
const models = (f) => (SRC(f).match(/(\/\/[^\n]*\n)?model [\s\S]*?\n\}/g) || []).join('\n\n');
const gonM = (f) => models(f).replace(/ +\/\/.*$/gm, '').replace(/^\/\/.*\n/gm, '').split('\n').filter((l) => l.trim()).join('\n');
const gon = (s) => s.replace(/^\$ DATABASE_URL=\S+ /gm, '$ ').replace(/^\$ cd p3\/33 && /gm, '$ ').split('\n').filter((l) => !/^\s*\|?\s*$/.test(l)).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 3 — Relations', bai: '3.3' }, [
  /* 1 */ { cover: true, nhan: 'Chapter 3 · Lesson 3.3', t: 'One-to-one, and<br>where to put the key', sub: 'A one-to-one is a one-to-many with @unique — and the side that holds the key decides your code' },
  /* 2 */ { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The whole mechanism: one-to-many plus <code>@unique</code></li>
    <li>Which side holds the key — and the error when you choose wrong</li>
    <li>The relation you cannot express: required on both sides</li>
    <li>What the unique index does at runtime</li>
    <li>When to split a table, and when to keep the columns together</li></ul>` },
  /* 3 */ { t: 'The declaration', body: prs(gonM('dung.prisma'), { sm: true, hl: [4, 10] }) +
    sql(OUT('sql').split('\n').filter((l) => /profiles_user_id_key|ALTER TABLE/.test(l)).join('\n').replace(' FOREIGN KEY', '\n  FOREIGN KEY').replace(' ON DELETE', '\n  ON DELETE'), { sm: true }) },
  /* 4 */ { t: 'Remove @unique, and it is a one-to-many', body: tp(gon(OUT('bo-unique')).replace(/^\$ .*$/m, '$ npx prisma migrate diff --from-schema-datamodel dung.prisma --to-schema-datamodel motnhieu.prisma --script'), { wrap: 78, fs: 20 }) +
    box('The unique index is the whole difference', 'Same column, same foreign key, same cascade. Drop <code>@unique</code> (and turn <code>profile Profile?</code> into <code>profiles Profile[]</code>) and migrate diff writes exactly one line: <code>DROP INDEX "profiles_user_id_key"</code>.', 'xanh') +
    box('Which also makes it the fastest one-to-one lookup', '<code>user.profile</code> is an index lookup on <code>profiles_user_id_key</code> — no extra index needed.', 'lam') },
  /* 5 */ { t: 'Wrong way round: User holds the key', body: two(prs(gonM('sai.prisma'), { sm: true, hl: [4, 5] }), ts(`await prisma.user.create({
  data: {
    email: 'moi@example.com',
  },
});`, { sm: true }), 'r73') +
    tp(gon(OUT('sai-tsc')).replace(/^\$ .*$/m, '$ npx tsc'), { wrap: 120, fs: 13 }) },
  /* 6 */ { t: 'Where the key goes — the rule', body: cards([
      ['On the optional side', 'A user exists without a profile; a profile makes no sense without a user. So Profile holds <code>userId</code>, and <code>User.profile</code> is <code>Profile?</code>.'],
      ['On the side created later', 'The row that comes into existence second can reference the first. Reverse it and you must invent an empty profile to register a user.'],
      ['On the rarer side', 'Ten million users, forty thousand subscriptions → <code>Subscription.userId</code>, not a mostly-NULL column on the big table.'],
      ['Fixing it later', 'A real migration: add the column on the other side, copy the pairs, drop the old one. Five minutes now saves that.'],
    ], 2) },
  /* 7 */ { t: 'The relation you cannot express', body: two(prs(gonM('cahai.prisma'), { sm: true, hl: [3] }), tp(gon(OUT('cahai')).replace(/^\$ .*$/m, '$ npx prisma validate'), { wrap: 40, fs: 13 }), 'r64') +
    box('Prisma is right to refuse', 'To create either row the other must already exist — a chicken-and-egg the database cannot resolve with ordinary constraints. One side is always optional.', 'do2') },
  /* 8 */ { t: 'What the unique index does at runtime', body: ts(SRC('hai.mts').split('\n').slice(2, 9).join('\n'), { sm: true }) + tp(gon(OUT('hai')).replace(/^\$ .*$/m, '$ npx tsx hai.mts'), { wrap: 120, fs: 14 }) +
    box('P2002 on user_id', 'A second profile for the same user is rejected by the unique index — the database enforces "one". A user without a profile simply reads <code>profile: null</code>.', 'lam') },
  /* 9 */ { t: 'When to split a table', body: tbl(['Situation', 'Decision', 'Why'], [
      ['Extra data is rare', 'split', '40,000 subscriptions on 10M users: a small side table instead of 10M mostly-NULL values'],
      ['Extra data is large', 'split', 'a long biography or settings blob makes every <code>SELECT id, email</code> read bigger pages'],
      ['Lifecycles differ', 'split', 'a session written on every request does not belong with a user written once a month'],
      ['Three fields you always read', 'keep', 'bio, avatar, website on every profile view: a join per request buys nothing'],
      ['To keep the model "tidy"', 'keep', 'a table is a storage decision — tidy code with modules, not tables'],
    ]) },
  /* 10 */ { t: 'From CuongThai: the profile lives on the user', body: tp(gon(OUT('ct-user')).replace(/^\$ .*$/m, "$ awk '/^model User {/,/^}/' prisma/schema.prisma | wc -l ; … | grep -c scalar-columns"), { wrap: 64, fs: 24, title: 'CuongThai schema.prisma — 12 Nov 2026' }) +
    box('489 lines, 43 scalar columns on one model', 'Bio, avatar URL, full name and the other profile fields are columns on <code>users</code>, because every profile view loads them with the user. Splitting would add a join and buy nothing — the "keep" row of the previous slide, at production scale.', 'lam') },
  /* 11 */ { t: 'Your turn — and what to keep', body: two(steps([
      `Declare User/Profile; read the ${c('UNIQUE INDEX')} in migrate diff`,
      `Remove ${c('@unique')}; diff again — one line`,
      `Put the key on User; try ${c('user.create({ email })')}`,
      `Create a second profile for one user; read P2002`,
    ]), box('Keep these', `<ul><li>One-to-one = one-to-many + ${c('@unique')}</li><li>Key on the optional, later, rarer side</li><li>Never required on both sides</li><li>Split for rare, large or different-lifecycle data</li></ul>`, 'lam'), '') },
]);
