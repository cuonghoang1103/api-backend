/**
 * pr-04-2 — Prisma ORM · Chapter 4 · Lesson 4.2 "select, include, and shaping the result" (deck video, 12/11/2026). Bài web: pr-4-2-select-include.
 * Output THẬT (`chay.sh p4-2`, demo/lab/p4/42, CSDL c42, Prisma 6.19.3 · PostgreSQL 16.14): không gì / include đều kéo cột password · select chỉ 2 cột ·
 * select+include ⇒ PrismaClientValidationError lúc chạy · omit + omit toàn cục, mở lại bằng omit:{password:false} · trang bài viết lồng sâu = 4 câu (web nói 5) ·
 * _count = LEFT JOIN … GROUP BY (web nói truy vấn con tương quan) · take lồng tính theo từng cha · include lọc con không lọc cha ·
 * include posts (4000) 79 ms / 3,6 MB so với _count 6 ms / 0,2 KB · fluent = 2 câu · bỏ title khỏi selection ⇒ TS2339 ở render().
 */
/* Output chạy THẬT, đóng băng từ thư mục demo của khoá video Prisma (12/11/2026) — deck tự chứa, không đọc tệp ngoài repo. */
const DU_LIEU = {
 "demo/out/p4-2/hinh.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c42 npx tsx p4/42/hinh.mts\n[1 nothing] SELECT \"id\", \"email\", \"username\", \"full_name\", \"password\", \"avatar_url\", \"created_at\" FROM \"users\" WHERE (\"id\" = $1 AND 1=1) LIMIT $2 OFFSET $3\n  keys: id, email, username, fullName, password, avatarUrl, createdAt\n[2 include] SELECT \"id\", \"email\", \"username\", \"full_name\", \"password\", \"avatar_url\", \"created_at\" FROM \"users\" WHERE (\"id\" = $1 AND 1=1) LIMIT $2 OFFSET $3\n[2 include] SELECT \"id\", \"title\", \"body\", \"published\", \"views\", \"created_at\", \"author_id\" FROM \"posts\" WHERE \"author_id\" IN ($1) OFFSET $2\n  keys: id, email, username, fullName, password, avatarUrl, createdAt, posts\n[3 select] SELECT \"id\", \"email\" FROM \"users\" WHERE (\"id\" = $1 AND 1=1) LIMIT $2 OFFSET $3\n[3 select] SELECT \"id\", \"title\", \"author_id\" FROM \"posts\" WHERE \"author_id\" IN ($1) OFFSET $2\n  value: {\"id\":3,\"email\":\"chi@example.com\",\"posts\":[{\"title\":\"Chi 1\"},{\"title\":\"Chi 2\"},{\"title\":\"Chi 3\"}]}\n[select+include] PrismaClientValidationError: Please either use `include` or `select`, but not both at the same time.\n[omit] SELECT \"id\", \"email\", \"username\", \"full_name\", \"avatar_url\", \"created_at\" FROM \"users\" WHERE (\"id\" = $1 AND 1=1) LIMIT $2 OFFSET $3\n  keys: id, email, username, fullName, avatarUrl, createdAt\nglobal omit → keys: id, email, username, fullName, avatarUrl, createdAt | opt back in → has password: true\n",
 "demo/lab/p4/42/long.mts": "import { PrismaClient } from './gen/index.js';\nconst prisma = new PrismaClient({ log: [{ emit: 'event', level: 'query' }] });\nlet nhan = '', dem = 0;\nconst gon = (q: string) => q.replace(/\"public\"\\./g, '').replace(/\"(users|posts|comments|likes)\"\\.\"(\\w+)\"/g, '\"$2\"');\nprisma.$on('query', (e) => { if (nhan) { dem++; console.log(`[${nhan}]`, gon(e.query).slice(0, 260)); } });\nnhan = 'post page';\nconst post = await prisma.post.findUniqueOrThrow({\n  where: { id: 1 },\n  select: {\n    id: true, title: true,\n    author: { select: { id: true, username: true, avatarUrl: true } },\n    comments: {\n      where: { deletedAt: null }, orderBy: { createdAt: 'asc' }, take: 20,\n      select: { id: true, body: true, author: { select: { username: true } }, _count: { select: { replies: true } } },\n    },\n    _count: { select: { comments: true, likes: true } },\n  },\n});\nnhan = '';\nconsole.log(`statements: ${dem} · comments returned: ${post.comments.length} · _count: ${JSON.stringify(post._count)}`);\n// take inside include is per parent\nconst users = await prisma.user.findMany({ take: 3, orderBy: { id: 'asc' }, include: { posts: { take: 2, select: { id: true } } } });\nconsole.log('include posts take 2, users take 3 →', JSON.stringify(users.map((u) => [u.username, u.posts.length])));\n// filtering the children does not filter the parents\nconst ds = await prisma.user.findMany({ orderBy: { id: 'asc' }, select: { username: true, posts: { where: { published: true }, take: 1, select: { id: true } } } });\nconsole.log('include where published →', JSON.stringify(ds.map((u) => [u.username, u.posts.length])));\nconst only = await prisma.user.findMany({ where: { posts: { some: { published: true } } }, orderBy: { id: 'asc' }, select: { username: true } });\nconsole.log('where posts some published →', JSON.stringify(only.map((u) => u.username)));\nawait prisma.$disconnect();\n",
 "demo/out/p4-2/long.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c42 npx tsx p4/42/long.mts\n[post page] SELECT \"id\", \"title\", \"author_id\", COALESCE(\"aggr_selection_0_Comment\".\"_aggr_count_comments\", 0) AS \"_aggr_count_comments\", COALESCE(\"aggr_selection_1_Like\".\"_aggr_count_likes\", 0) AS \"_aggr_count_likes\" FROM \"posts\" LEFT JOIN (SELECT \"post_id\", COUNT(*) AS \"\n[post page] SELECT \"id\", \"username\", \"avatar_url\" FROM \"users\" WHERE \"id\" IN ($1) OFFSET $2\n[post page] SELECT \"id\", \"body\", \"author_id\", \"post_id\", COALESCE(\"aggr_selection_0_Comment\".\"_aggr_count_replies\", 0) AS \"_aggr_count_replies\" FROM \"comments\" LEFT JOIN (SELECT \"parent_id\", COUNT(*) AS \"_aggr_count_replies\" FROM \"comments\" WHERE 1=1 GROUP BY \"parent_id\")\n[post page] SELECT \"id\", \"username\" FROM \"users\" WHERE \"id\" IN ($1,$2,$3) OFFSET $4\nstatements: 4 · comments returned: 20 · _count: {\"comments\":28,\"likes\":3}\ninclude posts take 2, users take 3 → [[\"an\",2],[\"binh\",1],[\"chi\",2]]\ninclude where published → [[\"an\",1],[\"binh\",0],[\"chi\",1]]\nwhere posts some published → [\"an\",\"chi\"]\n",
 "demo/out/p4-2/dem.txt": "$ DATABASE_URL=postgresql://student:matkhau@127.0.0.1:55491/c42 npx tsx p4/42/dem.mts\n[bad] SELECT \"id\", \"email\", \"username\", \"full_name\", \"password\", \"avatar_url\", \"created_at\" FROM \"users\" WHERE (\"id\" = $1 AND 1=1) LIMIT $2 OFFSET $3\n[bad] SELECT \"id\", \"title\", \"body\", \"published\", \"views\", \"created_at\", \"author_id\" FROM \"posts\" WHERE \"author_id\" IN ($1) OFFSET $2\nbad: posts.length = 4000 · 79 ms · result 3632.8 KB\n[good] SELECT \"id\", \"email\", \"username\", \"full_name\", \"password\", \"avatar_url\", \"created_at\", COALESCE(\"aggr_selection_0_Post\".\"_aggr_count_posts\", 0) AS \"_aggr_count_posts\" FROM \"users\" LEFT JOIN (SELECT \"author_id\", COUNT(*) AS \"_aggr_count_post\ngood: _count.posts = 4000 · 6 ms · result 0.2 KB\n[fluent] SELECT \"id\" FROM \"users\" WHERE (\"email\" = $1 AND 1=1) LIMIT $2 OFFSET $3\n[fluent] SELECT \"id\", \"title\", \"author_id\" FROM \"posts\" WHERE (\"published\" = $1 AND \"author_id\" IN ($2)) ORDER BY \"id\" ASC LIMIT $3 OFFSET $4\nfluent → [{\"title\":\"Chi 1\"},{\"title\":\"Chi 2\"}]\n",
 "demo/out/p4-2/kieu.txt": "$ cd p4/42 && npx tsc -p tsconfig.json\nkieu.ts(6,54): error TS2339: Property 'title' does not exist on type '{ id: number; author: { username: string; }; }'.\n[exit 2]\n"
};
const fs = { readFileSync: (p) => { const k = String(p); if (!(k in DU_LIEU)) throw new Error('thiếu dữ liệu đóng băng: ' + k); return DU_LIEU[k]; } };
import { lamDeck, prs, ts, tp, sql, two, box, cards, c, tbl, steps } from './_pr-chung.mjs';

export const deck = { key: 'pr-04-2', code: 'PR 4.2', title: 'select, include, and shaping the result', sub: 'Chapter 4 · Lesson 4.2' };

const DEMO = 'demo';
const OUT = (t) => fs.readFileSync(`${DEMO}/out/p4-2/${t}.txt`, 'utf8').replace(/\n+$/, '');
const SRC = (t) => fs.readFileSync(`${DEMO}/lab/p4/42/${t}`, 'utf8').replace(/\n+$/, '');
const gon = (s) => s.replace(/^\$ DATABASE_URL=\S+ /gm, '$ ').replace(/^\$ cd p4\/42 && /gm, '$ ').split('\n').filter((l) => !/^\s*$/.test(l)).join('\n');
const dong = (t) => OUT(t).split('\n');
const lay = (t, ...nhan) => dong(t).filter((l) => nhan.some((n) => l.startsWith(`[${n}]`) || l.startsWith(n))).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 4 — Reading and writing', bai: '4.2' }, [
  /* 1 */ { cover: true, nhan: 'Chapter 4 · Lesson 4.2', t: 'select, include,<br>and shaping the result', sub: 'You get exactly the shape you asked for — and the type follows it' },
  /* 2 */ { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Three ways to shape a row — and the column you did not mean to send</li>
    <li><code>omit</code>, and making the safe default global</li>
    <li>Nesting: how many statements a full page really costs</li>
    <li><code>_count</code> instead of <code>.length</code> — measured</li>
    <li>Naming a selection once, so its type cannot drift</li></ul>` },
  /* 3 */ { t: 'Three ways to shape a row', body: ts(`await prisma.user.findUniqueOrThrow({ where: { id: 1 } });                          // 1 — nothing
await prisma.user.findUniqueOrThrow({ where: { id: 3 }, include: { posts: true } });  // 2 — include
await prisma.user.findUniqueOrThrow({ where: { id: 3 },                              // 3 — select
  select: { id: true, email: true, posts: { select: { title: true } } } });`, { sm: true }) +
    tp(lay('hinh', '1 nothing', '2 include', '3 select', '  keys', '  value'), { wrap: 130, fs: 12, title: 'query log + what came back' }) },
  /* 4 */ { t: 'The rules of select and include', body: cards([
      ['Not both at one level', `${c('{ select, include }')} together fails at <b>runtime</b>: ${c('Please either use `include` or `select`, but not both at the same time.')}`],
      ['But they nest freely', '<code>include: { posts: { select: { title: true } } }</code> — every level chooses on its own.'],
      ['select on a relation includes it', 'Naming a relation inside <code>select</code> both fetches it and shapes it. No separate step.'],
      ['The type is computed', 'Hover the result: exactly <code>{ id; email; posts: { title }[] }</code>. No interface written, nothing to drift.'],
    ], 2) + tp(lay('hinh', 'select+include'), { wrap: 130, fs: 13 }) },
  /* 5 */ { t: 'The password column, and omit', body: ts(`await prisma.user.findUniqueOrThrow({ where: { id: 1 }, omit: { password: true } });

const prisma = new PrismaClient({ omit: { user: { password: true } } });   // global
await prisma.user.findUniqueOrThrow({ where: { email } });                       // safe by default
await prisma.user.findUniqueOrThrow({ where: { email }, omit: { password: false } });  // opt back in`, { sm: true }) +
    tp(lay('hinh', 'omit', '  keys: id, email, username, fullName, avatarUrl', 'global omit'), { wrap: 130, fs: 13 }) +
    box('The safe default, and one visible exception', 'With a global <code>omit</code>, a handler that returns the whole user can no longer leak the hash. The one place that needs it — the login compare — says so on its own line.', 'xanh') },
  /* 6 */ { t: 'Nesting: a full post page', body: ts(SRC('long.mts').split('\n').slice(6, 18).join('\n'), { sm: true }) +
      tp(lay('long', 'post page', 'statements').replace(/ COALESCE.*$/gm, ' …'), { wrap: 130, fs: 13 }) +
    box('Four statements, batched with IN', 'Each level batched, never looped. Chapter 9 shows <code>relationLoadStrategy: "join"</code>.', 'lam') },
  /* 7 */ { t: 'Filtering the children is not filtering the parents', body: tp(lay('long', 'include posts take 2', 'include where published', 'where posts some'), { wrap: 120, fs: 16 }) +
    cards([
      ['take inside is per parent', 'Three users × <code>take: 2</code> came back as 2 + 1 + 2 posts. A large outer <code>take</code> multiplies.'],
      ['where inside filters children', '<code>binh</code> has no published post and still appears, with an empty list.'],
      ['Filter the parent to drop it', '<code>where: { posts: { some: { published: true } } }</code> returns only <code>an</code> and <code>chi</code>.'],
    ], 3) },
  /* 8 */ { t: '_count: the number without the rows', body: ts(`const bad  = await prisma.user.findUniqueOrThrow({ where: { id: 1 }, include: { posts: true } });\nconsole.log(bad.posts.length);\nconst good = await prisma.user.findUniqueOrThrow({ where: { id: 1 },
  include: { _count: { select: { posts: true } } } });\nconsole.log(good._count.posts);`, { sm: true }) +
    tp(lay('dem', 'bad', 'good').replace(/ COALESCE.*$/gm, ' …'), { wrap: 104, fs: 15, title: 'a user with 4,000 posts' }) +
    box('posts.length loads every post', '<code>include: { posts: true }</code> pulled 4,000 rows — 3.6 MB of JSON — to print one number. <code>_count</code> is a grouped subquery that returns the number itself: 0.2 KB.', 'do2') },
  /* 9 */ { t: 'The fluent API: traversing instead of including', body: ts(`await prisma.user.findUnique({ where: { email: 'chi@example.com' } })
  .posts({ where: { published: true }, take: 10, select: { title: true } });`, { sm: true }) +
    tp(lay('dem', 'fluent'), { wrap: 104, fs: 16 }) +
    cards([
      ['When it wins', 'You want only the relation. Only the user\'s id is read, not the whole row.'],
      ['When it loses', 'You need both: two round trips where one <code>include</code> would do. A long chain is one query per link.'],
      ['The null ambiguity', '<code>null</code> both when the parent is missing and when the relation is empty.'],
    ], 3) },
  /* 10 */ { t: 'Naming the shape you selected', body: ts(`const postSummary = { id: true, author: { select: { username: true } } } satisfies Prisma.PostSelect;  // title removed
type PostSummary = Prisma.PostGetPayload<{ select: typeof postSummary }>;
async function getList(): Promise<PostSummary[]> { return prisma.post.findMany({ select: postSummary, take: 20 }); }
function render(b: PostSummary) { return \`\${b.title} — \${b.author.username}\`; }`, { sm: true }) +
    tp(gon(OUT('kieu')).replace(/\n\[exit 2\]$/, ''), { wrap: 96, fs: 17 }) +
    cards([
      ['satisfies', 'Checks the object against <code>Prisma.PostSelect</code> without widening it — the literal type survives.'],
      ['GetPayload', 'Computes the result type of that exact selection, nested relations included.'],
      ['No drift', 'One source: the selection. The query and every function that uses its result agree by construction.'],
    ], 3) +
    box('The selection and its type travel together', 'Remove <code>title</code> from the selection and the render function turns red at once. A hand-written interface would have kept compiling and printed <code>undefined</code>. Chapter 8 covers <code>GetPayload</code> in full.', 'xanh') },
  /* 11 */ { t: 'Choosing per call', body: tbl(['You want', 'Use', 'Why'], [
      ['every column except a secret', c('omit') + ' (global for passwords)', 'new columns arrive automatically; the secret never does'],
      ['a row plus some relations', c('include'), 'additive — the row, widened'],
      ['exactly the fields a screen shows', c('select'), 'subtractive — the SQL and the type shrink together'],
      ['a number about a relation', c('_count'), 'no rows transferred'],
      ['only the relation of one row', 'fluent API', 'skips the parent row'],
    ]) },
  /* 12 */ { t: 'Your turn — and what to keep', body: two(steps([
      `Fetch a user three ways; find ${c('password')} in the SQL`,
      `Add a global ${c('omit')}; opt back in at the login`,
      `Compare ${c('posts.length')} with ${c('_count')} on a busy user`,
      `Name a selection with ${c('GetPayload')}; remove a field`,
    ]), box('Keep these', `<ul><li>Default fetches every column</li><li>Global ${c('omit')} for secrets</li><li>Inner where/take act per parent</li><li>${c('_count')}, not ${c('.length')}</li></ul>`, 'lam'), '') },
]);
