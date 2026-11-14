/*DU_LIEU*/
const DU_LIEU = {
 "n15-2:file:src/app/c/bai/actions.ts": "'use server';\n// app/c/bai/actions.ts — the lesson's code, pasted as-is into a Server Action file\nimport { cookies } from 'next/headers';\n\nexport async function login() {\n  // SET — only in a Server Action or Route Handler\n  (await cookies()).set('token', jwt, {\n    httpOnly: true,\n    secure: true,\n    sameSite: 'lax',\n    maxAge: 60 * 60 * 24 * 7,   // 7 days, in seconds\n    path: '/',\n  });\n}\n",
 "n15-2:file:src/app/c/cu/page.tsx": "// app/c/cu/page.tsx — the Next.js 14 way: cookies() used synchronously\nimport { cookies } from 'next/headers';\n\nexport const dynamic = 'force-dynamic';\nexport default function Cu() {\n  // @ts-expect-error — Next.js 16 types say Promise\n  const token = cookies().get('token')?.value;\n  return <p>{token ? 'logged in' : 'guest'}</p>;\n}\n",
 "n15-2:bai": "$ npx next typegen >/dev/null 2>&1; npx tsc --noEmit\nsrc/app/c/bai/actions.ts(7,34): error TS2304: Cannot find name 'jwt'.\nsrc/app/c/cu/page.tsx(5,27): error TS2339: Property 'get' does not exist on type 'Promise<ReadonlyRequestCookies>'.",
 "n15-2:file:src/app/c/doc/page.tsx": "// app/c/doc/page.tsx — READ in a Server Component\nimport { cookies } from 'next/headers';\n\nexport default async function Doc() {\n  const jar = await cookies();\n  const token = jar.get('token')?.value;\n  return (\n    <main className=\"p-4 text-lg\">\n      <p id=\"kq\">token: {token ? `${token.slice(0, 12)}…` : 'none'}</p>\n      <p id=\"ten\">cookies the server received: {jar.getAll().map((c) => c.name).join(', ') || '—'}</p>\n    </main>\n  );\n}\n",
 "n15-2:file:src/app/c/ghi/actions.ts": "'use server';\n// app/c/ghi/actions.ts — SET in a Server Action: the response carries Set-Cookie\nimport { cookies } from 'next/headers';\nimport { USERS, signJwt } from '@/lib/auth';\n\nexport async function dangNhap() {\n  const jwt = await signJwt(USERS[0]!);\n  (await cookies()).set('token', jwt, {\n    httpOnly: true,\n    secure: true,\n    sameSite: 'lax',\n    maxAge: 60 * 60 * 24 * 7,   // 7 days, in seconds\n    path: '/',\n  });\n}\nexport async function dangXuat() {\n  (await cookies()).delete('token');\n}\n",
 "n15-2:file:src/app/c/ghi/page.tsx": "// app/c/ghi/page.tsx — two buttons, each a form posting to a Server Action\nimport { dangNhap, dangXuat } from './actions';\nexport default function Ghi() {\n  return (\n    <main className=\"p-4 text-lg space-x-2\">\n      <form action={dangNhap} className=\"inline\"><button id=\"vao\" className=\"border px-2\">Log in (Server Action)</button></form>\n      <form action={dangXuat} className=\"inline\"><button id=\"ra\" className=\"border px-2\">Log out</button></form>\n      <a href=\"/c/doc\" className=\"underline\">/c/doc</a>\n    </main>\n  );\n}\n",
 "n15-2:file:src/app/c/sai/page.tsx": "// app/c/sai/page.tsx — the mistake: SET while rendering a Server Component\nimport { cookies } from 'next/headers';\nexport default async function Sai() {\n  (await cookies()).set('theme', 'dark');\n  return <p>theme set?</p>;\n}\n",
 "n15-2:file:src/app/api/c/route.ts": "// app/api/c/route.ts — SET in a Route Handler: four SameSite variants + one Secure + one too big\nimport { NextResponse } from 'next/server';\nexport async function GET() {\n  const res = NextResponse.json({ ok: true });\n  res.cookies.set('c_lax', '1', { sameSite: 'lax', path: '/' });\n  res.cookies.set('c_strict', '1', { sameSite: 'strict', path: '/' });\n  res.cookies.set('c_none', '1', { sameSite: 'none', secure: true, path: '/' });\n  res.cookies.set('c_default', '1', { path: '/' });            // no SameSite attribute at all\n  res.cookies.set('c_secure', '1', { secure: true, path: '/' });\n  res.cookies.set('c_big', 'x'.repeat(4100), { path: '/' });   // name + value > 4096 bytes\n  return res;\n}\n",
 "n15-2:file:src/app/api/c/echo/route.ts": "// app/api/c/echo/route.ts — which cookies arrived with this request?\nimport { NextResponse } from 'next/server';\nimport { cookies } from 'next/headers';\nconst nhan = async (method: string) => {\n  const ten = (await cookies()).getAll().map((c) => c.name).filter((n) => n.startsWith('c_')).sort();\n  return new NextResponse(`<p id=\"kq\">${method} · received: ${ten.join(', ') || '—'}</p>`, { headers: { 'content-type': 'text/html; charset=utf-8' } });\n};\nexport const GET = () => nhan('GET');\nexport const POST = () => nhan('POST');\n",
 "n15-2:file:src/app/tinh/layout.tsx": "// app/tinh/layout.tsx — the layout reads a theme cookie\nimport { cookies } from 'next/headers';\nexport default async function L({ children }: { children: React.ReactNode }) {\n  const theme = (await cookies()).get('theme')?.value ?? 'light';\n  return <section className={theme === 'dark' ? 'p-4 bg-black text-white' : 'p-4'}>{children}</section>;\n}\n",
 "n15-2:file:src/app/tinh/page.tsx": "// app/tinh/page.tsx — a marketing page with nothing per-user\nexport default function Tinh() {\n  return <h1 className=\"text-2xl font-bold\">Pricing</h1>;\n}\n",
 "n15-2:chay": "$ npx next typegen >/dev/null 2>&1; npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npm run build 2>&1 | grep -E 'Compiled|/c/|/api/c|/tinh'\n✓ Compiled successfully in 2.2s\n├ ƒ /api/c\n├ ƒ /api/c/echo\n├ ƒ /c/doc\n├ ○ /c/ghi\n├ ƒ /c/sai\n└ ○ /tinh\n$ curl -si localhost:3000/api/c | grep -i set-cookie\nset-cookie: c_lax=1; Path=/; SameSite=lax\nset-cookie: c_strict=1; Path=/; SameSite=strict\nset-cookie: c_none=1; Path=/; Secure; SameSite=none\nset-cookie: c_default=1; Path=/\nset-cookie: c_secure=1; Path=/; Secure\nset-cookie: c_big=xxxx…(4100 x); Path=/\n$ curl -si localhost:3000/c/sai | head -1      # SET while rendering\nHTTP/1.1 500 Internal Server Error\n\n✓ Running next.config.ts took 24ms\n⨯ Error: Cookies can only be modified in a Server Action or Route Handler. Read more: https://nextjs.org/docs/app/api-reference/functions/cookies#options\n    at d (.next/server/chunks/ssr/[root-of-the-server]__0ni9l9ouwjm_m._.js:1:2949) {\n  digest: '1336940917'\n}",
 "n15-2:tinh": "# same page, now the layout reads one cookie (a theme)\n$ npm run build 2>&1 | grep -E '/tinh'\n└ ƒ /tinh",
 "n15-2:cu": "# Next.js 14 style, forced through the type check, to see what Next.js 16 does at runtime\n$ npm run build 2>&1 | grep -E 'Compiled|/c/cu|rror'\n✓ Compiled successfully in 2.6s\n└ ƒ /c/cu\n$ curl -si localhost:3000/c/cu | head -1\nHTTP/1.1 500 Internal Server Error\n⨯ TypeError: (0 , c.cookies)(...).get is not a function\n    at <unknown> (.next/server/chunks/ssr/_1l_yp0lycieef._.js:52:8802) {\n  digest: '1090295137'\n}",
 "n15-2:kho": "$ grep -rlE \"from 'next/headers'\" src | xargs grep -lE \"cookies\\(\\)\" | wc -l | sed 's/^ */tệp gọi cookies(): /'\ntệp gọi cookies(): 5\n$ grep -rnE \"cookies\\(\\)\\.(get|getAll|set|has)\" src | wc -l | sed 's/^ */cookies().get… (kiểu đồng bộ của Next 14): /'\ncookies().get… (kiểu đồng bộ của Next 14): 3\n$ grep -rnE \"cookies\\(\\)\\.(get|getAll|set|has)\" src | cut -d: -f1,2,3 | sed -E 's/ +/ /g'\nsrc/app/exam/[examId]/page.tsx:10: const token = cookies().get('backend_token')?.value;\nsrc/app/exam/attempt/[attemptId]/page.tsx:8: const token = cookies().get('backend_token')?.value;\nsrc/app/phong-video/[lessonId]/page.tsx:35: const token = cookies().get('backend_token')?.value;",
 "n15-2:dung": "",
 "anh-nxj-15-2:doc-vao": {
  "url": "http://localhost:19310/c/doc",
  "vp": [
   640,
   120
  ],
  "rect": {},
  "console": []
 },
 "anh-nxj-15-2:ghi": {
  "url": "http://localhost:19310/c/ghi",
  "vp": [
   640,
   120
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://localhost:19310/c/ghi",
    "ma": 200,
    "loai": "document",
    "kt": 8386
   },
   {
    "url": "http://localhost:19310/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://localhost:19310/_next/static/chunks/29ht0a0csc-83.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 15314
   },
   {
    "url": "http://localhost:19310/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://localhost:19310/_next/static/chunks/0kqziy-7_gy73.js",
    "ma": 200,
    "loai": "script",
    "kt": 22335
   },
   {
    "url": "http://localhost:19310/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://localhost:19310/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://localhost:19310/_next/static/chunks/1-qg95z29caht.js",
    "ma": 200,
    "loai": "script",
    "kt": 181717
   },
   {
    "url": "http://localhost:19310/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://localhost:19310/c/ghi",
    "ma": 200,
    "loai": "fetch",
    "kt": 4622,
    "pt": "POST",
    "na": "00b33a4e3e4fcea8d5e10efff389677c3bcd0332bc",
    "ctq": "text/plain;charset=UTF-8",
    "ct": "text/x-component",
    "than": "[]",
    "ms": 605,
    "ve": 611
   },
   {
    "url": "http://localhost:19310/c/doc",
    "ma": 200,
    "loai": "document",
    "kt": 7257
   },
   {
    "url": "http://localhost:19310/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 0
   },
   {
    "url": "http://localhost:19310/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 0
   },
   {
    "url": "http://localhost:19310/_next/static/chunks/29ht0a0csc-83.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 15314
   },
   {
    "url": "http://localhost:19310/_next/static/chunks/0kqziy-7_gy73.js",
    "ma": 200,
    "loai": "script",
    "kt": 22335
   },
   {
    "url": "http://localhost:19310/_next/static/chunks/1-qg95z29caht.js",
    "ma": 200,
    "loai": "script",
    "kt": 181717
   },
   {
    "url": "http://localhost:19310/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://localhost:19310/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://localhost:19310/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://localhost:19310/c/ghi",
    "ma": 200,
    "loai": "document",
    "kt": 8386
   },
   {
    "url": "http://localhost:19310/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 0
   },
   {
    "url": "http://localhost:19310/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 0
   },
   {
    "url": "http://localhost:19310/_next/static/chunks/29ht0a0csc-83.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 15314
   },
   {
    "url": "http://localhost:19310/_next/static/chunks/0kqziy-7_gy73.js",
    "ma": 200,
    "loai": "script",
    "kt": 22335
   },
   {
    "url": "http://localhost:19310/_next/static/chunks/1-qg95z29caht.js",
    "ma": 200,
    "loai": "script",
    "kt": 181717
   },
   {
    "url": "http://localhost:19310/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://localhost:19310/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://localhost:19310/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://localhost:19310/c/ghi",
    "ma": 200,
    "loai": "fetch",
    "kt": 4622,
    "pt": "POST",
    "na": "00d99ff4f8eeb5cfb25459eba7cda8b2b5954ae7b1",
    "ctq": "text/plain;charset=UTF-8",
    "ct": "text/x-component",
    "than": "[]",
    "ms": 2396,
    "ve": 2403
   },
   {
    "url": "http://localhost:19310/c/doc",
    "ma": 200,
    "loai": "document",
    "kt": 7231
   },
   {
    "url": "http://localhost:19310/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 0
   },
   {
    "url": "http://localhost:19310/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 0
   },
   {
    "url": "http://localhost:19310/_next/static/chunks/29ht0a0csc-83.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 15314
   },
   {
    "url": "http://localhost:19310/_next/static/chunks/0kqziy-7_gy73.js",
    "ma": 200,
    "loai": "script",
    "kt": 22335
   },
   {
    "url": "http://localhost:19310/_next/static/chunks/1-qg95z29caht.js",
    "ma": 200,
    "loai": "script",
    "kt": 181717
   },
   {
    "url": "http://localhost:19310/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://localhost:19310/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://localhost:19310/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   }
  ],
  "console": [],
  "ketQua": {
   "0 document.cookie trước": "\"\"",
   "1 document.cookie sau đăng nhập": "\"\"",
   "2 /c/doc": "token: eyJhbGciOiJI…",
   "3 /c/doc sau đăng xuất": "token: none"
  }
 },
 "anh-nxj-15-2:sec-localhost": {
  "url": "http://localhost:19310/api/c",
  "vp": [
   640,
   110
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "localhost": "cookies the server received: c_lax, c_strict, c_none, c_default, c_secure",
   "document.cookie": "c_lax, c_strict, c_none, c_default, c_secure"
  }
 },
 "anh-nxj-15-2:sec-127": {
  "url": "http://127.0.0.1:19310/api/c",
  "vp": [
   640,
   110
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "127.0.0.1": "cookies the server received: c_lax, c_strict, c_none, c_default, c_secure"
  }
 },
 "anh-nxj-15-2:cung": {
  "url": "http://localhost:19310/api/c",
  "vp": [
   640,
   110
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "cùng site, gõ URL": "GET · received: c_default, c_lax, c_none, c_secure, c_strict"
  }
 },
 "anh-nxj-15-2:site-b": {
  "url": "http://localhost:19310/api/c",
  "vp": [
   640,
   130
  ],
  "rect": {},
  "console": []
 },
 "anh-nxj-15-2:cheo-get": {
  "url": "http://localhost:19310/api/c",
  "vp": [
   640,
   110
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "site khác, bấm liên kết (GET)": "localhost:19310 · GET · received: c_default, c_lax, c_none, c_secure"
  }
 },
 "anh-nxj-15-2:cheo-post": {
  "url": "http://localhost:19310/api/c",
  "vp": [
   640,
   110
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "site khác, gửi form (POST)": "localhost:19310 · POST · received: c_default, c_none, c_secure"
  }
 },
 "anh-nxj-15-2:cheo-post-2p": {
  "url": "http://localhost:19310/api/c",
  "vp": [
   640,
   110
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "site khác, POST sau 125 giây": "localhost:19310 · POST · received: c_none"
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, br, box, two, steps, kw, c, cmp, icards } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-15-2', code: 'NXJ 15.2', title: 'Cookies in the App Router', sub: 'Chapter 15 · Lesson 15.2' };
const O = (k) => { const v = DU_LIEU[`n15-2:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const A = (k) => { const v = DU_LIEU[`anh-nxj-15-2:${k}`]; if (!v) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const F = (p) => O(`file:${p}`).trim();
const bo = (s) => s.split('\n').filter((l) => !/^\/\/ (app|lib)\//.test(l)).join('\n');
const doan = (k, dau) => { const ls = O(k).split('\n'); const i = ls.findIndex((l) => l.startsWith('$ ') && l.includes(dau)); if (i < 0) throw new Error('không thấy ' + dau + ' trong ' + k); const r = []; for (let j = i + 1; j < ls.length && !ls[j].startsWith('$ ') && !ls[j].startsWith('# '); j++) if (ls[j].trim()) r.push(ls[j]); return r; };
const B = (ten, o) => br('nxj-15-2', ten, { vp: 640, ...o });

// ── số đo (n15-2 · lab c15 · Next.js 16.4.6 · next start · Chromium)
const TSC = doan('bai', 'tsc --noEmit');
const BUILD = doan('chay', 'npm run build'), SC = doan('chay', 'grep -i set-cookie'), SAI = doan('chay', '/c/sai');
const LOI = O('chay').split('\n').find((l) => l.includes('Cookies can only be modified'));
const TINH = doan('tinh', 'npm run build'), CU = doan('cu', '/c/cu |');
const CULOI = O('cu').split('\n').find((l) => l.includes('is not a function'));
const KHO = O('kho');
const G = A('ghi').ketQua, KQ = (k) => Object.values(A(k).ketQua)[0];
const CUNG = KQ('cung'), CGET = KQ('cheo-get'), CPOST = KQ('cheo-post'), CPOST2 = KQ('cheo-post-2p'), SL = KQ('sec-localhost'), S127 = KQ('sec-127');
if (!/TS2304: Cannot find name 'jwt'/.test(TSC.join('')) || !/TS2339: Property 'get' does not exist on type 'Promise<ReadonlyRequestCookies>'/.test(TSC.join(''))) throw new Error('tsc đổi');
if (!/○ \/tinh/.test(BUILD.join('\n')) || !/ƒ \/tinh/.test(TINH.join('\n')) || !/500/.test(SAI[0]) || !LOI || !/500/.test(CU[0]) || !CULOI) throw new Error('build/500 đổi');
if (G['1 document.cookie sau đăng nhập'] !== '""' || !/eyJ/.test(G['2 /c/doc']) || !/none/.test(G['3 /c/doc sau đăng xuất'])) throw new Error('ghi đổi');
if (/c_big/.test(SL + S127) || !/c_secure/.test(S127)) throw new Error('secure/big đổi');
const nhan = (s) => s.split('received: ')[1].split(', ');
const BIEN = ['c_lax', 'c_strict', 'c_none', 'c_default'];
const COT = [['same site', CUNG], ['other site · GET link', CGET], ['other site · POST form', CPOST], ['POST, 125 s later', CPOST2]];
const coKhong = (s, b) => (nhan(s).includes(b) ? '<b style="color:#1f8a3b">sent</b>' : '<b style="color:#c0392b">—</b>');
if (nhan(CPOST).includes('c_lax') || !nhan(CPOST).includes('c_default') || nhan(CPOST2).includes('c_default') || nhan(CGET).includes('c_strict')) throw new Error('sameSite đổi');
const ROUTE = bo(F('src/app/api/c/route.ts')).split('\n').map((l) => l.replace(/\s+\/\/ .*$/, '')).filter((l) => !/^import|^\s*$/.test(l)).join('\n')
  .replace(/res\.cookies\.set\(/g, 'set(').replace("const res = NextResponse.json({ ok: true });", "const res = NextResponse.json({ ok: true });\n  const set = res.cookies.set.bind(res.cookies);");
const LAYOUT = bo(F('src/app/tinh/layout.tsx')).replace("return <section className={theme === 'dark' ? 'p-4 bg-black text-white' : 'p-4'}>{children}</section>;", "return <section data-theme={theme}>{children}</section>;")
  .replace('export default async function L({ children }: { children: React.ReactNode }) {', 'export default async function L(\n  { children }: { children: React.ReactNode }) {');
if (!LAYOUT.includes('data-theme') || !ROUTE.includes("set('c_big'")) throw new Error('rút mã đổi');
const CU_MA = bo(F('src/app/c/cu/page.tsx')).split('\n').filter((l) => !/@ts-expect-error|export const dynamic/.test(l)).join('\n').replace(/\n\n\n/g, '\n\n');

export const S = [
  { cover: true, nhan: 'Chapter 15 · Lesson 15.2', t: 'Cookies<br>in the App Router', sub: 'cookies() read and written where Next.js allows it, every Set-Cookie flag on the wire, and SameSite measured from a second site',
    en: 'Lesson fifteen point two: cookies in the App Router. We read and write them with cookies, in the places Next.js allows, look at every Set-Cookie flag on the wire, and measure SameSite from a second site.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li><code>cookies()</code> from <code>next/headers</code> — <b>await</b> it (Next.js 15+)</li>
    <li><b>Read</b> almost anywhere on the server; <b>write</b> only where a response exists</li>
    <li>Every flag on the wire: <code>httpOnly</code>, <code>secure</code>, <code>sameSite</code>, <code>maxAge</code></li>
    <li>SameSite measured from another site — including the 2-minute exception</li>
    <li>The cost: one <code>cookies()</code> call turns a static page dynamic</li></ul>`,
    en: 'Five takeaways: cookies from next headers, which you await since Next.js fifteen; read almost anywhere on the server, write only where a response exists; every flag on the wire; SameSite measured from another site, including a two-minute exception; and the cost: one cookies call turns a static page dynamic.' },
  { t: 'Where cookies() may read, and where it may write', body: cmp(['Where', 'Read', 'Write / delete', 'Why'], [
      ['Server Component', '<b>yes</b> — <code>(await cookies()).get()</code>', '<b style="color:#c0392b">no</b> — 500', 'it renders output; there is no response to attach <code>Set-Cookie</code> to'],
      ['Server Action', 'yes', '<b>yes</b>', 'the POST has its own response'],
      ['Route Handler', 'yes', '<b>yes</b> (or <code>res.cookies.set</code>)', 'you build the response'],
      ['Middleware / proxy', 'yes (<code>request.cookies</code>)', 'yes (<code>NextResponse</code>)', 'runs before the route (15.3)'],
      ['Client Component', '<code>document.cookie</code> — not httpOnly ones', 'not httpOnly ones', 'JavaScript in the browser'],
    ]) + box('One rule', 'Reading needs a <b>request</b>; writing needs a <b>response</b>. Render has a request but no response of its own.', 'xanh'),
    en: 'Where cookies may read and where it may write. A Server Component can read but not write: it renders output and has no response to attach a Set-Cookie to. A Server Action and a Route Handler can do both. Middleware works on the request and the response. A Client Component only sees cookies that are not httpOnly.' },
  { t: "The lesson's code — and the Next.js 14 call", body: two(D(tsx(bo(F('src/app/c/bai/actions.ts')), { sm: true, hl: [5] }), tsx(CU_MA, { sm: true, hl: [4] })),
    D(tn(['$ npx tsc --noEmit', ...TSC].join('\n'), { fs: 13, wrap: 60, title: 'tsc (real)' }),
      tn(['# forced past tsc · next start', '$ curl -si localhost:3000/c/cu | head -1', CU[0], '# server log', CULOI.trim()].join('\n'), { fs: 13, wrap: 60, title: 'runtime (real)' }),
      box('Read it', '<code>jwt</code> is not defined in the snippet — sign it first. And since Next.js 15 <code>cookies()</code> returns a <b>Promise</b>: the old sync call is a type error, and in 16 a crash.', 'do2')), 'r50'),
    en: 'The lesson\'s code, pasted into a tsx file: jwt is not defined, so sign the token first. And the Next.js fourteen style, cookies dot get without await, is a type error in sixteen: cookies returns a Promise. Forced past the type check, the page answers 500: get is not a function.' },
  { t: 'Measured: a Server Action sets the cookie', body: two(D(tsx(bo(F('src/app/c/ghi/actions.ts')).split('\n').slice(0, 16).join('\n'), { sm: true, hl: [7, 8, 9, 10, 11, 12, 13] })),
    D(B('doc-vao', { url: 'localhost:3000/c/doc · after "Log in"', h: 80, w: 540 }),
      cmp(['Step', 'Measured'], [['before', 'document.cookie = ' + G['0 document.cookie trước']], ['after Log in (POST)', 'document.cookie = ' + G['1 document.cookie sau đăng nhập']], ['/c/doc (server)', G['2 /c/doc']], ['after Log out', G['3 /c/doc sau đăng xuất']]]),
      box('Read it', 'The POST\'s response carried <code>Set-Cookie</code>; the next request sent it back. JavaScript in the page still sees <b>""</b> — httpOnly.', 'xanh')), 'r56'),
    en: 'Measured: a Server Action sets the cookie. Before logging in, document dot cookie is empty. After the POST, it is still empty, because the cookie is httpOnly; but the next page, read on the server, sees the token. Log out deletes it, and the server sees none.' },
  { t: 'Every Set-Cookie on the wire', body: two(D(tsx(ROUTE, { sm: true })),
    D(tn(['$ curl -si localhost:3000/api/c | grep -i set-cookie', ...SC].join('\n'), { fs: 13, wrap: 52, title: 'curl (real)' }),
      box('What Chromium kept', `Server received back: <b>${nhan(SL).join(', ')}</b>. <code>c_big</code> (4,100 bytes) is <b>dropped silently</b> — the limit is ~4 KB per cookie.`, 'do2'),
      box('maxAge', 'becomes both <code>Max-Age</code> and <code>Expires</code> on the wire (15.1: <code>Max-Age=604800</code>).', 'lam')), 'r50'),
    en: 'Every Set-Cookie on the wire. A route handler sets six cookies; curl shows each flag exactly as written: SameSite lax, strict, none with Secure, one with no SameSite at all, one Secure, and one of four thousand one hundred bytes. Chromium sends back five: the big one is dropped silently.' },
  { t: 'Measured: setting a cookie while rendering', body: two(D(tsx(bo(F('src/app/c/sai/page.tsx')), { sm: true, hl: [3] }),
      box('The mistake', 'A Server Component tries to remember a choice by setting a cookie during render.', 'do2')),
    D(tn(['$ curl -si localhost:3000/c/sai | head -1', SAI[0], '# server log', LOI.trim()].join('\n'), { fs: 14, wrap: 60, title: 'next start (real)' }),
      box('Do it in an action', 'Move the <code>set</code> into the Server Action (or Route Handler) that handles the user\'s choice — the login, the theme toggle — then <code>redirect</code> or <code>revalidatePath</code>.', 'xanh')), 'r50'),
    en: 'Measured: setting a cookie while rendering a Server Component. The page answers 500, and the server log says: cookies can only be modified in a Server Action or Route Handler. Move the set into the action that handles the user\'s choice.' },
  { t: 'The four flags — and what each one measurably does', body: icards([
      ['lock', 'httpOnly', `<code>document.cookie</code> after login: <b>${G['1 document.cookie sau đăng nhập']}</b> — the token is invisible to JavaScript.`],
      ['shield', 'secure', `HTTPS only — but Chromium treats <code>http://localhost</code> and <code>127.0.0.1</code> as secure: <code>c_secure</code> arrived on both.`],
      ['link', 'sameSite', '<code>lax</code> / <code>strict</code> / <code>none</code> — measured on the next slide, from a second site.'],
      ['clock', 'maxAge / expires', 'The <b>cookie</b>\'s lifetime, in seconds — not the token\'s <code>exp</code> (15.5).'],
    ], 2) + box('So in development', '<code>secure: true</code> works on localhost; you do not need <code>secure: process.env.NODE_ENV === \'production\'</code> for Chromium — but other browsers and a LAN IP still need HTTPS.', 'lam'),
    en: 'The four flags, and what each measurably does. httpOnly: document dot cookie stays empty after login. secure: HTTPS only, but Chromium treats localhost and one two seven dot zero dot zero dot one as secure, so the secure cookie arrived on both. sameSite: next slide. maxAge: the cookie\'s lifetime, not the token\'s.' },
  { t: 'Measured: SameSite, from a second site', body: cmp(['Cookie', ...COT.map((x) => x[0])], BIEN.map((b) => [b === 'c_default' ? 'no SameSite' : b.replace('c_', 'SameSite='), ...COT.map((x) => coKhong(x[1], b))]))
    + two(box('Read it', 'Site B (<code>127.0.0.1:19313</code>) links and posts to <code>localhost:19310</code>. <b>strict</b> never leaves its site; <b>lax</b> rides a top-level link but not a cross-site POST — that is the CSRF defence.', 'xanh'),
      box('The 2-minute exception', 'A cookie with <b>no</b> SameSite is treated as lax — but Chromium still sends it on a cross-site POST for <b>2 minutes</b> after it is set (sent at once, gone at 125 s). Always set <code>sameSite</code> explicitly.', 'do2')),
    en: 'Measured: SameSite, from a second site. A link from site B carries lax but not strict. A form POST from site B carries neither lax nor strict: that is the CSRF defence. A cookie with no SameSite is treated as lax, but Chromium still sent it on a cross-site POST right after it was set; a hundred twenty-five seconds later, it did not. Set sameSite explicitly.' },
  { t: 'Trap: one cookie read turns a static page dynamic', body: two(D(tn(['$ npm run build   # layout without cookies()', ...BUILD.filter((l) => /tinh/.test(l)), '# the layout now reads a theme cookie', '$ npm run build', ...TINH].join('\n'), { fs: 19, wrap: 38, title: 'next build (real)' }),
      box('Nothing in the page changed', '<code>/tinh</code> ("Pricing") has nothing per user. One <code>cookies()</code> call in its <b>layout</b> moved it from ○ (built once) to ƒ (rendered on every request).', 'do2')),
    D(tsx(LAYOUT, { hl: [4, 5], sm: true }), box('Correct, but invisible', 'A cached page cannot vary per visitor, so Next.js must render it each time. Check the ○ / ƒ column after any change to a shared layout; if only the browser needs the value, read it in a small Client Component.', 'lam')), 'r50'),
    en: 'The trap: one cookie read turns a static page dynamic. The pricing page has nothing per user and builds as static. Add one cookies call in its layout to read a theme, and the build marks it dynamic: rendered on every request. Check the static and dynamic column after any change to a shared layout.' },
  { t: 'cuongthai.com: three pages on the Next.js 14 call', body: two(D(tn(KHO, { fs: 13, wrap: 70, title: 'frontend/ (real)' })),
    D(box('Today: Next.js 14', '5 files call <code>cookies()</code>; 3 use the synchronous <code>cookies().get(…)</code> — correct on 14.2.', 'lam'),
      box('On an upgrade', 'On Next.js 16 the same line is <code>TS2339</code> at build time, and if forced through, <b>500 "get is not a function"</b> (measured on slide 4). The fix is one word: <code>(await cookies()).get(…)</code>.', 'do2'),
      box('The token itself', '<code>backend_token</code>: httpOnly, secure in production, <code>sameSite: "lax"</code>, 30 days (15.1).', 'xanh')), 'r56'),
    en: 'cuongthai.com runs Next.js fourteen: five files call cookies, and three use the synchronous cookies dot get, correct on fourteen. On an upgrade to sixteen the same line is a type error, and forced through, a five hundred: get is not a function. The fix is one word: await.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('cookies()', 'next/headers, awaited'), kw('Set-Cookie', 'the response header'), kw('httpOnly', 'hidden from JS'), kw('secure', 'HTTPS only (localhost OK)'),
      kw('sameSite', 'lax · strict · none'), kw('CSRF', 'another site posting as you'), kw('maxAge / expires', 'cookie lifetime'), kw('Dynamic route (ƒ)', 'rendered per request'),
      kw('~4 KB', 'per cookie, else dropped'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: cookies, from next headers, awaited; Set-Cookie, the response header; httpOnly; secure; sameSite, lax, strict or none; CSRF, another site posting as you; maxAge and expires; dynamic route; and the four kilobyte limit per cookie.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Read a cookie in a Server Component with ${c('(await cookies()).get()')}`,
      `Set it in a Server Action; check ${c('document.cookie')} and the next request`,
      `Try ${c('set')} during render — read the 500 in the server log`,
      `Serve a page from ${c('127.0.0.1')}: link and POST to ${c('localhost')}; compare lax, strict and no SameSite`,
    ]), box('Keep these', `<ul><li>Await cookies() (Next.js 15+)</li><li>Write only where a response exists</li><li>Always set sameSite explicitly</li><li>A cookie in a layout makes the route ƒ</li><li>Over ~4 KB is dropped</li></ul>`, 'lam'), ''),
    en: 'Your turn: read a cookie in a Server Component; set it in a Server Action; try setting it during render and read the error; and serve a page from a second site to compare lax, strict and no SameSite. Keep: await cookies; write only where a response exists; set sameSite explicitly.' },
];
export const slides = lamDeck({ chuong: 'Chapter 15 — Authentication, middleware, and cookies', bai: '15.2' }, S);
