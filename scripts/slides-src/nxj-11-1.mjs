/*DU_LIEU*/
const DU_LIEU = {
 "n11-1:file:prisma/schema.prisma": "// prisma/schema.prisma — CSDL SQLite nhỏ cho phòng thí nghiệm (Prisma 6.19.3, như khoá Prisma ORM)\ngenerator client {\n  provider = \"prisma-client-js\"\n}\n\ndatasource db {\n  provider = \"sqlite\"\n  url      = \"file:./dev.db\"\n}\n\nmodel Note {\n  id    Int    @id\n  title String\n}\n",
 "n11-1:file:prisma/seed.mjs": "import { PrismaClient } from '@prisma/client';\nconst db = new PrismaClient();\nawait db.note.deleteMany();\nawait db.note.createMany({ data: [{ id: 12, title: 'Ghi chú số 12' }, { id: 13, title: 'Ghi chú số 13' }] });\nconsole.log(await db.note.findMany());\n",
 "n11-1:db": "$ npx prisma db push 2>&1 | grep -E 'in sync|Generated' | sed 's/ in [0-9]*ms//'\n🚀  Your database is now in sync with your Prisma schema. Done\n✔ Generated Prisma Client (v6.19.3) to ./node_modules/@prisma/client\n$ node prisma/seed.mjs\n[\n  { id: 12, title: 'Ghi chú số 12' },\n  { id: 13, title: 'Ghi chú số 13' }\n]",
 "n11-1:file:src/app/docs/[...slug]/page.tsx": "export default async function Docs({ params }) {\n  const { slug } = await params;   // slug is an ARRAY: ['a','b','c']\n  return <p>{slug.join(' / ')}</p>;\n}\n",
 "n11-1:file:src/app/shop/[[...slug]]/page.tsx": "export default async function Shop({ params }) {\n  const { slug } = await params;   // undefined at /shop, else an array\n  // ...\n}\n",
 "n11-1:bai": "$ npx tsc --noEmit      # đúng hai đoạn mã của bài, chép nguyên vào page.tsx\ndocs/[...slug]/page.tsx(1,38): error TS7031: Binding element 'params' implicitly has an 'any' type.\nshop/[[...slug]]/page.tsx(1,38): error TS7031: Binding element 'params' implicitly has an 'any' type.\n$ npm run build\nsrc/app/docs/[...slug]/page.tsx(1,38): error TS7031: Binding element 'params' implicitly has an 'any' type.\nsrc/app/shop/[[...slug]]/page.tsx(1,38): error TS7031: Binding element 'params' implicitly has an 'any' type.\nFailed to type check.",
 "n11-1:file:ban/docs.tsx": "// app/docs/[...slug]/page.tsx — catch-all: khớp /docs/a, /docs/a/b, /docs/a/b/c …\nexport default async function Docs({ params }: { params: Promise<{ slug: string[] }> }) {\n  const { slug } = await params;              // slug là MỘT MẢNG chuỗi\n  console.log('[docs] slug =', JSON.stringify(slug));\n  return <p id=\"kq\" className=\"p-4 text-2xl\">{slug.join(' / ')} · {slug.length} đoạn</p>;\n}\n",
 "n11-1:file:ban/shop.tsx": "// app/shop/[[...slug]]/page.tsx — optional catch-all: khớp CẢ /shop\nexport default async function Shop({ params }: { params: Promise<{ slug?: string[] }> }) {\n  const { slug } = await params;              // undefined ở /shop, còn lại là mảng\n  console.log('[shop] slug =', JSON.stringify(slug));\n  return <p id=\"kq\" className=\"p-4 text-2xl\">{slug === undefined ? 'trang gốc /shop (slug = undefined)' : 'danh mục: ' + slug.join(' › ')}</p>;\n}\n",
 "n11-1:file:ban/blog.tsx": "// app/blog/[slug]/page.tsx — segment động thường (chương 8): đúng MỘT đoạn\nexport default async function Blog({ params }: { params: Promise<{ slug: string }> }) {\n  const { slug } = await params;              // một CHUỖI\n  return <p id=\"kq\" className=\"p-4 text-2xl\">blog: {JSON.stringify(slug)}</p>;\n}\n",
 "n11-1:trang": "$ npx next typegen >/dev/null 2>&1; npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npm run build\n✓ Compiled successfully in 471ms\n├ ƒ /blog/[slug]\n├ ƒ /docs/[...slug]\n└ ƒ /shop/[[...slug]]\nƒ  (Dynamic)  server-rendered on demand",
 "n11-1:khop": "$ for u in …; do curl -s -o /dev/null -w \"%{http_code}\" localhost:3000$u; …; done   # mã trạng thái + chữ trên trang\n/blog         404  (trang 404 của Next)\n/blog/a       200  blog: &quot;a&quot;\n/blog/a/b     404  (trang 404 của Next)\n/docs         404  (trang 404 của Next)\n/docs/a       200  a · 1 đoạn\n/docs/a/b/c   200  a / b / c · 3 đoạn\n/shop         200  trang gốc /shop (slug = undefined)\n/shop/a       200  danh mục: a\n/shop/a/b     200  danh mục: a › b\n# log máy chủ (next start):\n[docs] slug = [\"a\",\"b\",\"c\"]\n[shop] slug = undefined\n[shop] slug = [\"a\"]\n[shop] slug = [\"a\",\"b\"]",
 "n11-1:chuoi": "$ for u in …; do curl … ; done   # đoạn có dấu, khoảng trắng, %2F, dấu chấm\n/docs/xin-chào/bài-1 200  xin-ch%C3%A0o / b%C3%A0i-1 · 2 đoạn\n/docs/a%20b            200  a%20b · 1 đoạn\n/docs/a%2Fb/c          200  a%2Fb / c · 2 đoạn\n/docs/12/0x0C          200  12 / 0x0C · 2 đoạn\n[docs] slug = [\"xin-ch%C3%A0o\",\"b%C3%A0i-1\"]\n[docs] slug = [\"a%20b\"]\n[docs] slug = [\"a%2Fb\",\"c\"]\n[docs] slug = [\"12\",\"0x0C\"]\n$ node -e \"for (const s of ['xin-ch%C3%A0o', 'a%20b', 'a%2Fb']) console.log(s.padEnd(14), '→ decodeURIComponent →', JSON.stringify(decodeURIComponent(s)))\"\nxin-ch%C3%A0o  → decodeURIComponent → \"xin-chào\"\na%20b          → decodeURIComponent → \"a b\"\na%2Fb          → decodeURIComponent → \"a/b\"",
 "n11-1:file:src/app/shop/[id]/page.tsx": "// app/shop/[id]/page.tsx — đặt CẠNH [[...slug]]: route một đoạn, cụ thể hơn\nexport default async function SanPham({ params }: { params: Promise<{ id: string }> }) {\n  const { id } = await params;\n  return <p id=\"kq\" className=\"p-4 text-2xl\">[id] thắng · id = {JSON.stringify(id)} ({typeof id})</p>;\n}\n",
 "n11-1:uutien": "$ npm run build\n✓ Compiled successfully in 638ms\n├ ƒ /shop/[[...slug]]\n└ ƒ /shop/[id]\n$ for u in /shop /shop/42 /shop/42/xanh; do c=$(curl -s -o $TMPDIR/kq11 -w '%{http_code}' localhost:19390$u); k=$(sed 's/<!-- -->//g' $TMPDIR/kq11 | grep -o '<p id=\"kq\"[^>]*>[^<]*' | sed 's/<p id=\"kq\"[^>]*>//'); printf '%-15s %s  %s\\n' \"$u\" \"$c\" \"$k\"; done\n/shop           200  trang gốc /shop (slug = undefined)\n/shop/42        200  [id] thắng · id = &quot;42&quot; (string)\n/shop/42/xanh   200  danh mục: 42 › xanh",
 "n11-1:file:src/app/kho/page.tsx": "export default function Kho() { return <p id=\"kq\" className=\"p-4 text-2xl\">app/kho/page.tsx</p>; }\n",
 "n11-1:file:src/app/kho/[[...slug]]/page.tsx": "export default function KhoMoi() { return <p id=\"kq\" className=\"p-4 text-2xl\">app/kho/[[...slug]]</p>; }\n",
 "n11-1:file:src/app/kho/[...slug]/page.tsx": "export default function KhoCon() { return <p id=\"kq\" className=\"p-4 text-2xl\">app/kho/[...slug]</p>; }\n",
 "n11-1:xungdot": "$ npm run build      # có CẢ app/kho/page.tsx LẪN app/kho/[[...slug]]/page.tsx\n> Build error occurred\nError: You cannot define a route with the same specificity as an optional catch-all route (\"/kho\" and \"/kho/[[...slug]]\").\n$ npm run build      # cách sửa: page.tsx riêng + [...slug] (KHÔNG optional)\n├ ○ /kho\n├ ƒ /kho/[...slug]",
 "n11-1:file:src/app/notes/[id]/page.tsx": "// app/notes/[id]/page.tsx — BẪY: truyền thẳng param vào truy vấn dưới dạng số\nimport { PrismaClient } from '@prisma/client';\nconst db = new PrismaClient();\n\nexport default async function Note({ params }: { params: Promise<{ id: string }> }) {\n  const { id } = await params;                                    // luôn là CHUỖI: '12', 'abc'\n  const note = await db.note.findUnique({ where: { id: Number(id) } });\n  return <p id=\"kq\" className=\"p-4 text-2xl\">{note ? note.title : 'không có ghi chú này'}</p>;\n}\n",
 "n11-1:file:src/app/notes2/[id]/page.tsx": "// app/notes2/[id]/page.tsx — chốt chặn hai dòng: kiểm tham số TRƯỚC, sai thì notFound()\nimport { notFound } from 'next/navigation';\nimport { PrismaClient } from '@prisma/client';\nconst db = new PrismaClient();\n\nexport default async function Note({ params }: { params: Promise<{ id: string }> }) {\n  const { id } = await params;\n  if (!/^[1-9]\\d*$/.test(id)) notFound();                         // chỉ nhận số nguyên dương viết chuẩn\n  const note = await db.note.findUnique({ where: { id: Number(id) } });\n  if (!note) notFound();\n  return <p id=\"kq\" className=\"p-4 text-2xl\">{note.title}</p>;\n}\n",
 "n11-1:file:ban/notes3.tsx": "// biến thể \"kiểm bằng Number()\" — trông đúng, nhưng chấp nhận '0x0C', '1e1', ' 12'\nconst n = Number(id);\nif (!Number.isInteger(n)) notFound();\n",
 "n11-1:nan": "$ npm run build 2>&1 | grep -E 'Compiled|/notes'\n✓ Compiled successfully in 303ms\n├ ƒ /notes/[id]\n├ ƒ /notes2/[id]\n$ for u in /notes/12 /notes/abc /notes/99 /notes/0x0C /notes2/12 /notes2/abc /notes2/99 /notes2/0x0C; do c=$(curl -s -o $TMPDIR/kq11 -w '%{http_code}' localhost:19390$u); k=$(sed 's/<!-- -->//g' $TMPDIR/kq11 | grep -o '<p id=\"kq\"[^>]*>[^<]*' | sed 's/<p id=\"kq\"[^>]*>//'); printf '%-14s %s  %s\\n' \"$u\" \"$c\" \"${k:-—}\"; done\n/notes/12      200  Ghi chú số 12\n/notes/abc     500  —\n/notes/99      200  không có ghi chú này\n/notes/0x0C    200  Ghi chú số 12\n/notes2/12     200  Ghi chú số 12\n/notes2/abc    404  —\n/notes2/99     404  —\n/notes2/0x0C   404  —\n# log máy chủ khi gọi /notes/abc:\n$ grep -A12 'Invalid' ~/.rtq-nxj/nen-c11s.log | grep -vE '^\\s*$' | head -14\nInvalid `prisma.note.findUnique()` invocation:\n{\n  where: {\n+   id: Int\n  }\n}\nArgument `id` is missing.\n    at async d (.next/server/chunks/ssr/[root-of-the-server]__1jss6vwu2iept._.js:1:3286) {\n  clientVersion: '6.19.3',\n  digest: '1372189925'\n}\n$ node -e \"for (const s of ['12','abc','0x0C','1e1',' 12','12.0','']) console.log(JSON.stringify(s).padEnd(7), '→ Number:', String(Number(s)).padEnd(4), '· isInteger:', String(Number.isInteger(Number(s))).padEnd(5), '· /^[1-9]\\\\\\\\d*$/:', /^[1-9]\\d*$/.test(s))\"\n\"12\"    → Number: 12   · isInteger: true  · /^[1-9]\\d*$/: true\n\"abc\"   → Number: NaN  · isInteger: false · /^[1-9]\\d*$/: false\n\"0x0C\"  → Number: 12   · isInteger: true  · /^[1-9]\\d*$/: false\n\"1e1\"   → Number: 10   · isInteger: true  · /^[1-9]\\d*$/: false\n\" 12\"   → Number: 12   · isInteger: true  · /^[1-9]\\d*$/: false\n\"12.0\"  → Number: 12   · isInteger: true  · /^[1-9]\\d*$/: false\n\"\"      → Number: 0    · isInteger: true  · /^[1-9]\\d*$/: false",
 "n11-1:kho": "$ find frontend/src/app -type d -name '*...*'      # kho cuongthai.com (Next.js 14.2)\napi/auth/[...nextauth]\napi/v1/[[...path]]\nuploads/[...path]\n$ grep -n 'export async function\\|pathname.replace' 'app/api/v1/[[...path]]/route.ts' | head -4\n166:export async function GET(request: NextRequest) {\n167:  const path = request.nextUrl.pathname.replace(\"/api/v1\", \"\");\n173:export async function POST(request: NextRequest) {\n174:  const path = request.nextUrl.pathname.replace(\"/api/v1\", \"\");\n$ grep -n 'params' 'app/uploads/[...path]/route.ts'\n45:  { params }: { params: { path: string[] } },\n47:  const filePath = (params.path || []).join('/');"
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, box, two, steps, kw, c, cmp, br, tree, icards } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-11-1', code: 'NXJ 11.1', title: 'Catch-all and optional catch-all segments', sub: 'Chapter 11 · Lesson 11.1' };
const O = (k) => { const v = DU_LIEU[`n11-1:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const B = (ten, o) => br('nxj-11-1', ten, { vp: 640, ...o });
const F = (p) => O(`file:${p}`).trim();
const goc = (s) => s.replace(/\s+\/\/ .*$/gm, '');                                   // bỏ chú thích cuối dòng (tiếng Việt)
const bo = (s) => s.split('\n').filter((l) => !/^\/\/ /.test(l)).join('\n');        // bỏ dòng chú thích đầu tệp
const sach = (s) => s.replace(/&quot;/g, '"');
const dongs = (k, re) => { const l = O(k).split('\n').filter((x) => !x.startsWith('$ ') && re.test(x)); if (!l.length) throw new Error('không thấy dòng trong ' + k + ' ' + re); return l; };
const doan = (k, dau) => { const ls = O(k).split('\n'); const i = ls.findIndex((l) => l.startsWith('$ ') && l.includes(dau)); if (i < 0) throw new Error('không thấy ' + dau); const r = []; for (let j = i + 1; j < ls.length && !ls[j].startsWith('$ ') && !ls[j].startsWith('# '); j++) r.push(ls[j]); return r; };

// ── số đo (chặn: dữ liệu đổi ⇒ deck không dựng)
const TSC = doan('bai', 'npx tsc').filter((l) => /error TS7031/.test(l));
const BUILD_BAI = doan('bai', 'npm run build');
const KHOP = dongs('khop', /^\/(blog|docs|shop)/).map(sach);
const LOG = dongs('khop', /^\[(docs|shop)\]/);
const CHUOI = dongs('chuoi', /^\/docs/);
const GIAI = dongs('chuoi', /decodeURIComponent →/);
const UU = dongs('uutien', /^\/shop/).map(sach);
const XUNG = dongs('xungdot', /cannot define a route/);
const SUA = dongs('xungdot', /^[├└┌].*\/kho/);
const NAN = dongs('nan', /^\/notes/);
const PRISMA = doan('nan', 'Invalid').filter((l) => !/^\s+at |chunks/.test(l));
const SO = dongs('nan', /→ Number:/);
const KHO = doan('kho', 'find frontend');
const k = (re) => KHOP.find((l) => re.test(l)) ?? (() => { throw new Error('thiếu ' + re); })();
if (TSC.length !== 2 || !BUILD_BAI.some((l) => /Failed to type check/.test(l))) throw new Error('lỗi mã của bài đổi');
if (!/^\/docs +404/.test(k(/^\/docs /)) || !/a \/ b \/ c · 3/.test(k(/^\/docs\/a\/b\/c/)) || !/undefined/.test(k(/^\/shop /)) || !/^\/blog\/a\/b +404/.test(k(/^\/blog\/a\/b/))) throw new Error('bảng khớp đổi');
if (!/\[id\] thắng/.test(UU.find((l) => l.startsWith('/shop/42 '))) || !/42 › xanh/.test(UU.at(-1))) throw new Error('ưu tiên đổi');
if (!/^\/notes\/abc +500/.test(NAN[1]) || !/^\/notes\/0x0C +200/.test(NAN[3]) || !/^\/notes2\/abc +404/.test(NAN[5])) throw new Error('bẫy NaN đổi');
if (!PRISMA.some((l) => /Argument `id` is missing/.test(l))) throw new Error('log Prisma đổi');
if (!CHUOI.some((l) => /xin-ch%C3%A0o/.test(l))) throw new Error('mã hoá đổi');

const gon = (x) => goc(bo(x)).replace(/ id="kq" className="p-4 text-2xl"/g, '');
const DOCS = gon(F('ban/docs.tsx'));
const SHOP = gon(F('ban/shop.tsx'));
const NOTES = gon(F('src/app/notes/[id]/page.tsx'));
const NOTES2 = gon(F('src/app/notes2/[id]/page.tsx'));

export const S = [
  { cover: true, nhan: 'Chapter 11 · Lesson 11.1', t: 'Catch-all and<br>optional catch-all segments', sub: 'One folder for a URL of any depth. Measured on Next.js 16.4.6: which URLs match, what params really hold, and a 500 that should have been a 404',
    en: 'Lesson eleven point one: catch-all and optional catch-all segments — one folder that serves a URL of any depth. We measure which URLs match, what params really holds, and a five hundred that should have been a four oh four.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li><code>[slug]</code> vs <code>[...slug]</code> vs <code>[[...slug]]</code> — a measured matrix of URLs</li>
    <li>The lesson's code as written does not build in a TypeScript project — and the one-line fix</li>
    <li>Precedence: a more specific <code>[id]</code> beats a catch-all; one combination is a build error</li>
    <li>Params are <b>strings</b> — and in Next.js 16 they arrive still <b>percent-encoded</b></li>
    <li>The <code>Number(params.id)</code> trap: a 500 for what should be a 404, and the two-line guard</li></ul>`,
    en: 'Five takeaways: the three bracket shapes, with a measured matrix of URLs; why the lesson\'s code as written does not build in a TypeScript project; precedence, and one combination that is a build error; params are strings, still percent-encoded in Next.js sixteen; and the Number of params dot id trap, with its two-line guard.' },
  { t: 'One segment vs any depth', body: two(D(tree(['src/app/', '  blog/', '    [slug]/page.tsx        // /blog/hello — exactly 1', '  docs/', '*    [...slug]/page.tsx     // /docs/a/b/c — 1 or more', '  shop/', '*    [[...slug]]/page.tsx   // /shop too — 0 or more'], { fs: 19 }),
      box('Where depth varies', 'Documentation <code>/docs/a/b/c</code> · a file browser · category trees · a proxy that forwards <i>every</i> path to a backend. One page, any depth.', 'lam')),
    icards([['page', 'Three dots', '<code>[...slug]</code>: the rest of the URL, as an <b>array</b>'], ['layers', 'Double brackets', '<code>[[...slug]]</code>: same, but also the bare parent'], ['type', 'Always strings', '<code>["a","b","c"]</code> — never numbers']], 1), 'r64'),
    en: 'A bracket folder from chapter eight matches exactly one segment. Some routes have a variable depth — documentation, a file browser, category trees, a proxy. Three dots make the folder catch the rest of the URL as an array; double brackets also match the bare parent. And every value is a string.' },
  { t: 'The lesson\'s code, as written: TS7031', body: two(D(tsx(goc(F('src/app/docs/[...slug]/page.tsx')), { sm: true, hl: [1] }),
      tn(['$ npx tsc --noEmit', ...TSC, '$ npm run build', ...BUILD_BAI.map((l) => l.replace(/^src\/app\//, ''))].join('\n'), { fs: 14, wrap: 64, title: 'tsc + next build (real)' })),
    D(tsx(`export default async function Docs(
  { params }: { params: Promise<{ slug: string[] }> }
) { … }`, { sm: true, hl: [2] }),
      box('Why', 'create-next-app turns on <code>strict</code>, so an untyped <code>{ params }</code> is an implicit <code>any</code> — and <code>next build</code> type-checks before it builds. Give <code>params</code> its type: a <b>Promise</b> of <code>{ slug: string[] }</code> (optional catch-all: <code>slug?: string[]</code>).', 'do2'),
      box('Also generated', 'Next 16 writes a global helper: <code>PageProps&lt;\'/docs/[...slug]\'&gt;</code> (<code>next typegen</code>).', 'lam')), 'r64'),
    en: 'The lesson\'s code, copied exactly into page dot tsx: tsc reports TS seven oh three one, binding element params implicitly has an any type — twice — and next build stops with failed to type check. create-next-app turns on strict mode. The fix is one line: type params as a promise of an object with slug, an array of strings. Next sixteen also generates a PageProps helper.' },
  { t: 'Catch-all [...slug]: measured', body: tsx(DOCS, { hl: [3] }) + two(D(
      tn(['$ curl … (status · text on the page)', ...KHOP.filter((l) => l.startsWith('/docs'))].join('\n'), { fs: 18, title: 'next start + curl (real)' }),
      tn(LOG.filter((l) => l.startsWith('[docs]')).join('\n'), { fs: 18, title: 'server log (real)' })),
    D(B('docs-abc', { url: 'localhost:3000/docs/a/b/c', h: 70, w: 520 }),
      box('Read it', '<code>/docs/a/b/c</code> ⇒ <code>["a","b","c"]</code>. The bare <code>/docs</code> is <b>404</b>: zero segments do not count as "one or more".', 'xanh')), 'r64'),
    en: 'The catch-all, measured. slash docs slash a slash b slash c renders with slug equal to the array a, b, c — the server log prints it. slash docs slash a gives an array of one. The bare slash docs is a four oh four: zero segments are not one or more.' },
  { t: 'Optional catch-all [[...slug]]: measured', body: tsx(SHOP.replace(" ? 'trang gốc /shop (slug = undefined)' : ", "\n    ? 'trang gốc /shop (slug = undefined)'\n    : "), { sm: true, hl: [3] }) + two(D(
      tn(['$ curl … (status · text on the page)', ...KHOP.filter((l) => l.startsWith('/shop'))].join('\n'), { fs: 16, wrap: 50, title: 'next start + curl (real)' })),
    D(B('shop-goc', { url: 'localhost:3000/shop', h: 70, w: 520 }), B('shop-ab', { url: 'localhost:3000/shop/a/b', h: 70, w: 520 }),
      box('Read it', 'Double brackets: the <b>same page</b> also serves <code>/shop</code>, where <code>slug</code> is <code>undefined</code> — so type it <code>slug?: string[]</code> and handle both cases.', 'xanh')), 'r64'),
    en: 'The optional catch-all, measured. The same page now serves slash shop itself, where slug is undefined, and slash shop slash a slash b, where it is an array of two. So type it as optional and handle both cases: the index and every depth below it.' },
  { t: 'The matrix: three shapes, the same URLs', body: cmp(['Folder', 'bare parent', 'one segment', 'two or more', 'value'], [
      ['<code>blog/[slug]</code>', ...['/blog ', '/blog/a ', '/blog/a/b'].map((u) => { const l = k(new RegExp('^' + u.trim().replace(/\//g, '\\/') + ' ')); return /404/.test(l.split(/\s+/)[1]) ? '<b style="color:#b91c1c">404</b>' : `200 · <code>${l.replace(/^.*blog: /, '')}</code>`; }), 'one string'],
      ['<code>docs/[...slug]</code>', '<b style="color:#b91c1c">404</b>', '200 · <code>["a"]</code>', '200 · <code>["a","b","c"]</code>', 'string[]'],
      ['<code>shop/[[...slug]]</code>', '200 · <code>undefined</code>', '200 · <code>["a"]</code>', '200 · <code>["a","b"]</code>', 'string[] | undefined'],
    ], { hl: [2] }) + two(box('Pick by the URLs you need', 'Exactly one level ⇒ <code>[slug]</code>. Any depth <i>below</i> a page you already have ⇒ <code>[...slug]</code>. The index <i>and</i> every depth in one file ⇒ <code>[[...slug]]</code>.', 'lam'),
      box('Every cell was requested', 'Real <code>next start</code> + <code>curl</code>, Next.js 16.4.6. A 404 here is Next\'s own "This page could not be found".', ''), ''),
    en: 'The matrix — three shapes, the same URLs, every cell actually requested. A plain slug: the bare parent and two segments are four oh four, one segment is a string. Three dots: the bare parent is four oh four, one or more segments give an array. Double brackets: the bare parent works too, with undefined.' },
  { t: 'More specific wins: [id] next to [[...slug]]', body: two(D(tree(['src/app/shop/', '*  [id]/page.tsx           // one segment', '   [[...slug]]/page.tsx   // 0 or more'], { fs: 19 }),
      tn(['$ npm run build', ...dongs('uutien', /\/shop/).filter((l) => /[├└]/.test(l)), '$ curl … (status · text on the page)', ...UU].join('\n'), { fs: 15, wrap: 60, title: 'next build + curl (real)' })),
    D(B('shop-42', { url: 'localhost:3000/shop/42', h: 70, w: 520 }),
      box('Measured', `<code>/shop/42</code> ⇒ <code>[id]</code>, and <code>id</code> is the <b>string</b> <code>"42"</code>. <code>/shop</code> and <code>/shop/42/xanh</code> still fall to the catch-all.`, 'xanh'),
      box('Watch the overlap', 'Mixing shapes in one folder is legal, but every one-segment URL now goes to <code>[id]</code> — including <code>/shop/sale</code>, if that was meant to be a category.', '')), 'r64'),
    en: 'Precedence, measured. Put a one-segment id folder next to the optional catch-all: it builds. slash shop slash forty-two goes to the more specific id page, and id is the string forty-two. slash shop and slash shop slash forty-two slash xanh still fall to the catch-all. Watch the overlap: every one-segment URL now goes to id.' },
  { t: 'Build error: page.tsx + [[...slug]] in one folder', body: two(D(tree(['src/app/kho/', '*  page.tsx                 // /kho', '*  [[...slug]]/page.tsx    // /kho too!'], { fs: 19 }),
      tn(['$ npm run build', '> Build error occurred', ...XUNG].join('\n'), { fs: 15, wrap: 58, title: 'next build (real)' }),
      box('The rule', 'A bare path may have exactly <b>one</b> owner. <code>next build</code> refuses and names both routes — nothing is deployed.', 'do2')),
    D(tree(['src/app/kho/', '   page.tsx                // /kho', '   [...slug]/page.tsx      // /kho/a …'], { fs: 19 }),
      tn(['$ npm run build', ...SUA].join('\n'), { fs: 16, title: 'the fix builds (real)' }),
      box('Why', 'Both files claim the bare <code>/kho</code> with the same specificity. Keep one owner: either <code>[[...slug]]</code> alone, or <code>page.tsx</code> + <code>[...slug]</code>.', 'lam')), 'r64'),
    en: 'One combination is a build error. A page dot tsx next to an optional catch-all: both claim the bare path with the same specificity, and next build stops — you cannot define a route with the same specificity as an optional catch-all route. Keep one owner: the optional catch-all alone, or page dot tsx plus a plain catch-all.' },
  { t: 'Strings — and still percent-encoded (Next.js 16)', body: two(D(tn(['$ curl … (status · text on the page)', ...CHUOI].join('\n'), { fs: 14, wrap: 62, title: 'next start + curl (real)' }),
      tn(['$ node -e "… decodeURIComponent(s) …"', ...GIAI].join('\n'), { fs: 15, title: 'node (real)' })),
    D(B('chao', { url: 'localhost:3000/docs/xin-chào/bài-1', h: 70, w: 520 }),
      box('Measured', '<code>/docs/xin-chào</code> ⇒ <code>"xin-ch%C3%A0o"</code>. A space stays <code>%20</code>, an encoded slash stays <code>%2F</code> inside <b>one</b> segment. Decode with <code>decodeURIComponent</code> when you need the text.', 'do2'),
      box('Careful', 'Decoding <code>a%2Fb</code> gives <code>"a/b"</code> — a slash inside one segment. Never <code>join(\'/\')</code> params into a file path without checking for <code>..</code>.', '')), 'r64'),
    en: 'Every value is a string — and in Next.js sixteen, still percent-encoded. xin-chào arrives as xin-ch percent C3 percent A0 o; a space stays percent twenty; an encoded slash stays percent two F inside one segment. Decode with decodeURIComponent when you need the text — and note that decoding can produce a slash, so never join params into a file path without checking.' },
  { t: 'Trap: Number(params.id) — a 500 that should be a 404', body: tsx(NOTES, { sm: true, hl: [6] }) + two(D(
      tn(['$ curl … (status · text on the page)', ...NAN.filter((l) => l.startsWith('/notes/'))].join('\n'), { fs: 14, title: 'next start + curl (real) — Prisma 6.19.3, SQLite' }),
      tn(PRISMA.filter((l) => /Invalid|is missing|digest/.test(l)).join('\n'), { fs: 13, title: 'server log for /notes/abc (real, 3 of 10 lines)' })),
    D(B('notes-abc', { url: 'localhost:3000/notes/abc', h: 185, w: 520 }),
      box('Three bugs in one page', '<code>abc</code> ⇒ <b>500</b> · <code>99</code> ⇒ <b>200</b>, not 404 · <code>0x0C</code> ⇒ note 12 again.', 'do2')), 'r64'),
    en: 'The trap, measured with Prisma and SQLite. Number of the string abc is NaN; Prisma rejects the query — argument id is missing — the page throws, and the visitor gets a five hundred with an error code that only the server log explains. Two more surprises: a missing note gives two hundred with an apology instead of four oh four, and slash notes slash 0x0C shows note twelve.' },
  { t: 'The two-line guard — and why Number() is not one', body: tsx(NOTES2, { sm: true, hl: [7, 9] }) + two(D(
      tn(['$ curl … (status · text on the page)', ...NAN.filter((l) => l.startsWith('/notes2/'))].join('\n'), { fs: 14, title: 'next start + curl (real)' }),
      box('Read it', 'Test the <b>string</b> first, then <code>notFound()</code> for a missing row too.', 'xanh')),
    tn(SO.join('\n').replace(/\/\^\[1-9\]\\d\*\$\/:/g, 'regex:'), { fs: 13, title: 'node (real) — what each check accepts' }), ''),
    en: 'The two-line guard: test the string with a regular expression for a canonical positive integer, and call notFound when it fails — and again when the row is missing. Measured: abc, ninety-nine and 0x0C are now four oh four. Why not Number dot isInteger? Because it accepts 0x0C, one e one, a leading space, and the empty string as zero.' },
  { t: 'In a real app: cuongthai.com (Next.js 14.2)', body: two(D(tn(['$ find frontend/src/app -type d -name \'*...*\'', ...KHO].join('\n'), { fs: 16, title: 'the course\'s own repo (real)' }),
      tn(doan('kho', 'pathname.replace').join('\n') + '\n' + doan('kho', "grep -n 'params'").join('\n'), { fs: 13, wrap: 66, title: 'grep (real)' })),
    D(box('api/v1/[[...path]] — a proxy', 'One optional catch-all forwards <b>every</b> <code>/api/v1/…</code> request — any depth, any method — to the Express backend, adding the auth cookie. Five handlers, one folder.', 'lam'),
      box('uploads/[...path] — a file server', 'Joins the segments into a path, and blocks <code>..</code> before reading a file. It reads <code>params.path</code> synchronously: fine on 14.2; on 15+ <code>params</code> is a Promise and must be awaited (Chapter 8).', '')), 'r64'),
    en: 'In a real app: this course\'s own site, on Next.js fourteen point two, has three catch-alls. api slash v1 with double brackets is a proxy: every API request, any depth and any method, is forwarded to the Express backend. uploads with three dots joins the segments into a file path and blocks dot dot first. It reads params synchronously — fine on fourteen; on fifteen and later params must be awaited.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Dynamic segment [slug]', 'exactly one path part, a string'), kw('Catch-all [...slug]', 'one or more parts, as an array'),
      kw('Optional catch-all [[...slug]]', 'zero or more — also the bare parent (undefined)'), kw('params (Promise)', 'await it; type it in .tsx'),
      kw('Routing precedence', 'more specific wins over a catch-all'), kw('Percent-encoding', 'params arrive encoded: decodeURIComponent'),
      kw('notFound()', 'render the 404 from inside a page'), kw('Input validation', 'check the string before converting it'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: dynamic segment; catch-all; optional catch-all; params as a promise you await and type; routing precedence; percent-encoding; notFound; and input validation — check the string before you convert it.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Create ${c('app/docs/[...slug]/page.tsx')} (typed!); request ${c('/docs')}, ${c('/docs/a')}, ${c('/docs/a/b/c')} and log ${c('slug')}`,
      `Switch to ${c('[[...slug]]')}: ${c('/docs')} now matches — what is ${c('slug')}?`,
      `Request ${c('/docs/xin-chào')}: read the raw value, then decode it`,
      `Add ${c('[id]')} next to it; predict which page ${c('/docs/42')} hits, then check`,
      `Guard a numeric id with a regex + ${c('notFound()')}; try ${c('abc')} and ${c('0x0C')}`,
    ]), box('Keep these', `<ul><li><code>[...x]</code> 1+ parts · <code>[[...x]]</code> 0+ parts · both arrays</li><li>Type <code>params</code> as a Promise in .tsx</li><li>More specific wins; <code>page.tsx</code> + <code>[[...x]]</code> = build error</li><li>Strings, still encoded</li><li>Validate, then <code>notFound()</code></li></ul>`, 'lam'), ''),
    en: 'Your turn: build a typed catch-all and request three depths; switch to the optional form and read slug at the bare path; request a Vietnamese path and decode it; add an id folder and predict which page wins; and guard a numeric id with a regular expression and notFound. Keep: three dots for one or more, double brackets for zero or more; type params; more specific wins; strings, still encoded; validate, then notFound.' },
];
export const slides = lamDeck({ chuong: 'Chapter 11 — Advanced routing', bai: '11.1' }, S);
