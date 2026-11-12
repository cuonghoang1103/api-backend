/**
 * pr-08-2 — Prisma ORM · Chapter 8 · Lesson 8.2 "Naming the shape a query returns" (deck video, 12/11/2026). Bài web: pr-8-2-getpayload.
 * Output THẬT (`chay.sh p8-2`, Prisma 6.19.3 · tsc 5.9.3): truyền kết quả select vào hàm nhận Post ⇒ TS2345 "missing … body, published, publishedAt, views, and 3 more" ·
 * satisfies + GetPayload, validator, ReturnType ⇒ tsc không lỗi · bỏ title khỏi selection ⇒ TS2339 đúng dòng the() · khai `: Prisma.PostSelect` thay vì satisfies ⇒
 * GetPayload ra kiểu MỌI trường + author + comments + _count (dù truy vấn chỉ lấy id, title).
 */
/* Output chạy THẬT, đóng băng từ thư mục demo của khoá video Prisma (12/11/2026) — deck tự chứa, không đọc tệp ngoài repo. */
const DU_LIEU = {
 "demo/out/p8-2/van-de.txt": "$ npx tsc --noEmit --target es2022 --module nodenext --moduleResolution nodenext --strict --skipLibCheck p8/82/van-de.ts\np8/82/van-de.ts(7,5): error TS2345: Argument of type '{ id: number; title: string; author: { username: string; avatarUrl: string | null; }; _count: { comments: number; }; }' is not assignable to parameter of type '{ id: number; title: string; body: string | null; published: boolean; publishedAt: Date | null; views: number; createdAt: Date; authorId: number; tenantId: number; }'.\n  Type '{ id: number; title: string; author: { username: string; avatarUrl: string | null; }; _count: { comments: number; }; }' is missing the following properties from type '{ id: number; title: string; body: string | null; published: boolean; publishedAt: Date | null; views: number; createdAt: Date; authorId: number; tenantId: number; }': body, published, publishedAt, views, and 3 more.\n[exit 2]\n",
 "demo/out/p8-2/ten-hinh.txt": "$ npx tsc --noEmit --target es2022 --module nodenext --moduleResolution nodenext --strict --skipLibCheck p8/82/ten-hinh.ts && echo 'tsc: khong loi'\ntsc: khong loi\n",
 "demo/out/p8-2/bo-title.txt": "$ npx tsc --noEmit --target es2022 --module nodenext --moduleResolution nodenext --strict --skipLibCheck p8/82/bo-title.ts\np8/82/bo-title.ts(13,37): error TS2339: Property 'title' does not exist on type '{ id: number; author: { username: string; avatarUrl: string | null; }; _count: { comments: number; }; }'.\n[exit 2]\n",
 "demo/out/p8-2/rong.txt": "$ npx tsc --noEmit --target es2022 --module nodenext --moduleResolution nodenext --strict --skipLibCheck p8/82/rong.ts\np8/82/rong.ts(5,7): error TS2322: Type '{ id: number; title: string; body: string | null; published: boolean; publishedAt: Date | null; views: number; createdAt: Date; authorId: number; tenantId: number; author: { id: number; ... 8 more ...; settings: JsonValue; }; comments: { ...; }[]; _count: { ...; }; }' is not assignable to type 'number'.\n[exit 2]\n",
 "demo/out/p8-2/ho-so.txt": "$ npx tsc --noEmit --target es2022 --module nodenext --moduleResolution nodenext --strict --skipLibCheck p8/82/ho-so.ts\np8/82/ho-so.ts(11,20): error TS2339: Property 'password' does not exist on type '{ id: number; username: string; fullName: string | null; avatarUrl: string | null; bio: string | null; _count: { posts: number; }; }'.\n[exit 2]\n"
};
const fs = { readFileSync: (p) => { const k = String(p); if (!(k in DU_LIEU)) throw new Error('thiếu dữ liệu đóng băng: ' + k); return DU_LIEU[k]; } };
import { lamDeck, tp, ts, two, box, cards, c, tbl, steps } from './_pr-chung.mjs';

export const deck = { key: 'pr-08-2', code: 'PR 8.2', title: 'Naming the shape a query returns', sub: 'Chapter 8 · Lesson 8.2' };

const DEMO = 'demo';
const OUT = (t, ch = 'p8-2') => fs.readFileSync(`${DEMO}/out/${ch}/${t}.txt`, 'utf8').replace(/\n+$/, '');
const TSC = 'npx tsc --noEmit --target es2022 --module nodenext --moduleResolution nodenext --strict --skipLibCheck';
const gon = (s) => s.split(TSC).join('npx tsc --noEmit --strict …').replace(/p8\/8\d\//g, '').split('\n').filter((l) => !/^\s*$/.test(l)).join('\n');

export const slides = lamDeck({ chuong: 'Chapter 8 — The generated type system', bai: '8.2' }, [
  /* 1 */ { cover: true, nhan: 'Chapter 8 · Lesson 8.2', t: 'Naming the shape a query returns', sub: 'satisfies + GetPayload, validator, ReturnType — and the one-character mistake that empties them' },
  /* 2 */ { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Why a <code>select</code> result is not a <code>Post</code></li>
    <li>Answer 1: <code>satisfies</code> plus <code>GetPayload</code></li>
    <li>Why <code>: Prisma.PostSelect</code> silently ruins it</li>
    <li>Answers 2 and 3: <code>validator</code>, <code>ReturnType</code></li>
    <li>When you should still hand-write a type</li></ul>` },
  /* 3 */ { t: 'The problem: a select result is not a Post', body: ts(`const posts = await prisma.post.findMany({
  select: { id: true, title: true,
            author: { select: { username: true, avatarUrl: true } },
            _count: { select: { comments: true } } },
});
function the(b: Post) { return b.title; }
the(posts[0]);`, { sm: true }) + tp(gon(OUT('van-de')), { wrap: 120, fs: 12 }) +
      cards([
        [c('b: any'), 'Compiles, and throws away every check.'],
        [c('interface Card { … }'), 'Compiles — and drifts the day the select changes.'],
        ['Derive it', 'The generator can compute this exact shape. Three ways follow.'],
      ], 3) },
  /* 4 */ { t: 'Answer 1 — satisfies plus GetPayload', body: two(ts(`const pickCard = {
  id: true,
  title: true,
  author: {
    select: { username: true, avatarUrl: true } },
  _count: { select: { comments: true } },
} satisfies Prisma.PostSelect;
type Card =
  Prisma.PostGetPayload<{ select: typeof pickCard }>;
async function getCard(): Promise<Card[]> {
  return prisma.post.findMany({
    select: pickCard, take: 20 });
}
function the(b: Card) {
  return \`\${b.title} — \${b.author.username}\`
    + \` (\${b._count.comments})\`;
}`, { sm: true }), tp(gon(OUT('ten-hinh')), { wrap: 56, fs: 13 }), '') +
      box('One value, one type — the query and the type cannot disagree', '<code>satisfies</code> checks the object against PostSelect but keeps its literal shape; GetPayload turns that shape into the exact result type.', 'xanh') },
  /* 5 */ { t: 'Delete a field from the selection: its users turn red', body: ts(`const pickCard = {
  id: true,
  // title: true,     ← removed
  author: { select: { username: true, avatarUrl: true } },
  _count: { select: { comments: true } },
} satisfies Prisma.PostSelect;`, { sm: true }) + tp(gon(OUT('bo-title')), { wrap: 120, fs: 13 }) +
      box('The error points at the line that reads b.title', 'With a hand-written interface this compiles and prints undefined at runtime. Here the compiler names the one function that depended on the field.', 'lam') },
  /* 6 */ { t: 'A colon instead of satisfies — and the type lies', body: ts(`// annotated with a colon, not satisfies
const pickRong: Prisma.PostSelect = { id: true, title: true };
type CardRong = Prisma.PostGetPayload<{ select: typeof pickRong }>;
const x: CardRong = null!;
const y: number = x;   // a deliberate error, so tsc prints the type`, { sm: true }) +
      tp(gon(OUT('rong')), { wrap: 120, fs: 13 }) +
      cards([
        [c('satisfies PostSelect'), 'checks the value and keeps its literal type — GetPayload sees exactly id and title'],
        [c(': PostSelect'), 'replaces the value&#39;s type with all of PostSelect — GetPayload sees "anything may be selected"'],
      ], 2) +
      box('The query fetches id and title; the type promises everything', 'The annotation widens the value to the whole PostSelect, so GetPayload sees "any field may be selected" — every column, author, comments and _count. Reading b.author compiles and crashes. Always satisfies.', 'do2') },
  /* 7 */ { t: 'Answers 2 and 3', body: two(ts(`// 2 · Prisma.validator — wraps the whole args object
const pick2 =
  Prisma.validator<Prisma.PostDefaultArgs>()({
  select: { id: true, title: true,
            author: { select: { username: true } } },
});
type Card2 = Prisma.PostGetPayload<typeof pick2>;
await prisma.post.findMany({ ...pick2, take: 20 });`, { sm: true }), ts(`// 3 · derive from the function itself
async function getCard3() {
  return prisma.post.findMany({
    select: { id: true, title: true,
              author: { select: { username: true } } },
    take: 20,
  });
}
type Card3 =
  Awaited<ReturnType<typeof getCard3>>[number];`, { sm: true }), '') +
      cards([
        ['validator', 'Same guarantee as satisfies, with the odd double call. Keep it when where/orderBy travel with the selection.'],
        ['ReturnType', 'The lightest: no constant, no GetPayload. The selection cannot be reused by a second query.'],
        ['All three compiled', 'In the same file as Answer 1: tsc reported no errors.'],
      ], 3) },
  /* 8 */ { t: 'Applying it: a public profile that cannot leak', body: ts(`export const selectPublicProfile = {
  id: true, username: true, fullName: true, avatarUrl: true, bio: true,
  _count: { select: { posts: true } },
} satisfies Prisma.UserSelect;
export type HoSoCongKhai = Prisma.UserGetPayload<{ select: typeof selectPublicProfile }>;

app.get('/api/v1/users/:username', async (req, res) => {
  const u = await prisma.user.findUnique({ where: { username: req.params.username }, select: selectPublicProfile });
  if (!u) return res.status(404).end();
  res.json(u satisfies HoSoCongKhai);
});`, { sm: true }) + tp(gon(OUT('ho-so')), { wrap: 120, fs: 12 }) +
      cards([
        ['Secure by construction', 'password is not selected, so reading it is TS2339 (terminal) — and a second secret column stays out too.'],
        ['The frontend can import it', '<code>import type { HoSoCongKhai }</code> in a monorepo: the exact response shape, checked against the query.'],
      ], 2) },
  /* 9 */ { t: 'When you should still hand-write a type', body: tbl(['Case', 'Why'], [
      ['The request body', 'what a client may send is its own contract and needs runtime validation — a Zod schema'],
      ['A response that reshapes data', 'renamed or computed fields: write it, and map explicitly'],
      ['A domain type that is not a row', 'a cart from three tables, a permission set from roles'],
      ['Everything else', 'derive it'],
    ]) + box('Next lesson: a hand-written type in production', 'It was correct when written and for months after. Then one rename made it wrong, and nothing was checking it.', 'lam') },
  /* 10 */ { t: 'Your turn — and what to keep', body: two(steps([
      `Pass a ${c('select')} result to a function taking ${c('Post')}`,
      `Name it with ${c('satisfies')} + ${c('GetPayload')}`,
      `Remove one field; see which lines turn red`,
      `Swap ${c('satisfies')} for a colon; print the type`,
    ]), box('Keep these', `<ul><li>select ⇒ a new shape, not the model</li><li>satisfies, never a colon</li><li>Removing a field should break its users</li><li>Hand-write only the boundary</li></ul>`, 'lam'), '') },
]);
