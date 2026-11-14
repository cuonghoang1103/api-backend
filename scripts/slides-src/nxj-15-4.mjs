/*DU_LIEU*/
const DU_LIEU = {
 "n15-4:file:src/lib/current-user.ts": "// lib/current-user.ts — ONE helper: read the cookie, verify it, load the user\nimport 'server-only';\nimport { cache } from 'react';\nimport { cookies } from 'next/headers';\nimport { verifyJwt } from '@/lib/auth';\nimport { db } from '@/lib/db';\nimport { dem } from '@/lib/kho';\n\nexport async function readUser() {\n  const token = (await cookies()).get('token')?.value;\n  if (!token) return null;\n  dem('verifyJwt');\n  const payload = await verifyJwt(token);    // signature + expiry\n  if (!payload) return null;\n  return db.user.findUnique({ where: { id: Number(payload.sub) } });\n}\n\n// cache(): one call per request, however many components ask\nexport const getCurrentUser = cache(readUser);\n",
 "n15-4:file:src/lib/db.ts": "// lib/db.ts — a fake database for the lab: the FULL user record, as a real table would have it\nimport { dem } from './kho';\n\nexport type UserRow = { id: number; name: string; email: string; role: 'admin' | 'user'; passwordHash: string; phone: string };\nconst ROWS: UserRow[] = [\n  { id: 1, name: 'An', email: 'an@lab.test', role: 'admin', passwordHash: '$2b$10$lab.An.hash.not.real', phone: '0901 000 001' },\n  { id: 2, name: 'Binh', email: 'binh@lab.test', role: 'user', passwordHash: '$2b$10$lab.Binh.hash.not.real', phone: '0901 000 002' },\n];\nexport const db = {\n  user: {\n    async findUnique({ where }: { where: { id: number } }) {\n      dem('db.user.findUnique');\n      return ROWS.find((r) => r.id === where.id) ?? null;\n    },\n  },\n};\n",
 "n15-4:bai": "# 1 · the lesson's helper, exactly as written\n$ npx next typegen >/dev/null 2>&1; npx tsc --noEmit\nsrc/lib/current-user.ts(7,19): error TS2304: Cannot find name 'verifyJwt'.\nsrc/lib/current-user.ts(9,10): error TS2304: Cannot find name 'db'.\n# 2 · import verifyJwt (async, jose) and a db whose ids are numbers\n$ npx tsc --noEmit\nsrc/lib/current-user.ts(11,52): error TS2339: Property 'sub' does not exist on type 'Promise<JWTPayload | null>'.\n# 3 · add await\n$ npx tsc --noEmit\nsrc/lib/current-user.ts(11,40): error TS2322: Type 'string | undefined' is not assignable to type 'number'.\n  Type 'undefined' is not assignable to type 'number'.\n# 4 · the id in a JWT is a string: convert it\n$ npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi",
 "n15-4:file:src/app/nam/parts.tsx": "// app/nam/parts.tsx — five server components on one page, each asks \"who is this?\"\nimport type { UserRow } from '@/lib/db';\ntype Get = () => Promise<UserRow | null>;\nexport async function Header({ get }: { get: Get }) { const u = await get(); return <header>Header · {u?.name}</header>; }\nexport async function Sidebar({ get }: { get: Get }) { const u = await get(); return <aside>Sidebar · {u?.role}</aside>; }\nexport async function Avatar({ get }: { get: Get }) { const u = await get(); return <p>Avatar · {u?.name?.[0]}</p>; }\nexport async function Feed({ get }: { get: Get }) { const u = await get(); return <section>Feed for {u?.name}</section>; }\nexport async function Footer({ get }: { get: Get }) { const u = await get(); return <footer>Footer · {u?.email}</footer>; }\n",
 "n15-4:file:src/app/nam/khong-cache/page.tsx": "// app/nam/khong-cache/page.tsx — every component calls the plain helper\nimport { readUser } from '@/lib/current-user';\nimport { Header, Sidebar, Avatar, Feed, Footer } from '../parts';\nexport default function Page() {\n  return <main className=\"p-4\"><Header get={readUser} /><Sidebar get={readUser} /><Avatar get={readUser} /><Feed get={readUser} /><Footer get={readUser} /></main>;\n}\n",
 "n15-4:file:src/app/nam/co-cache/page.tsx": "// app/nam/co-cache/page.tsx — the same five components, through cache()\nimport { getCurrentUser } from '@/lib/current-user';\nimport { Header, Sidebar, Avatar, Feed, Footer } from '../parts';\nexport default function Page() {\n  return <main className=\"p-4\"><Header get={getCurrentUser} /><Sidebar get={getCurrentUser} /><Avatar get={getCurrentUser} /><Feed get={getCurrentUser} /><Footer get={getCurrentUser} /></main>;\n}\n",
 "n15-4:file:src/app/trang/page.tsx": "// app/trang/page.tsx — a protected page: the page itself enforces access\nimport { redirect } from 'next/navigation';\nimport { getCurrentUser } from '@/lib/current-user';\nexport default async function Trang() {\n  const user = await getCurrentUser();\n  if (!user) redirect('/login?from=trang');\n  return <main className=\"p-4 text-lg\"><h1 id=\"t\" className=\"font-bold\">Hello, {user.name}</h1></main>;\n}\n",
 "n15-4:file:src/app/login/page.tsx": "export default function Login() {\n  return <main className=\"p-4 text-lg\"><h1 id=\"t\" className=\"font-bold\">Log in</h1></main>;\n}\n",
 "n15-4:cache": "$ npx next typegen >/dev/null 2>&1; npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npm run build 2>&1 | grep -E 'Compiled|/nam|/trang|rror'\n✓ Compiled successfully in 3.3s\n├ ƒ /nam/co-cache\n├ ƒ /nam/khong-cache\n└ ƒ /trang\n$ curl -si localhost:3000/trang | grep -iE '^HTTP|^location'          # no cookie\nHTTP/1.1 307 Temporary Redirect\nlocation: /login?from=trang\n$ curl -s localhost:3000/trang -H \"Cookie: token=$AN\" | grep -o 'Hello, <!-- -->[A-Za-z]*'\nHello, <!-- -->An\n# one request to a page with 5 components — no cache()\n$ curl -s localhost:3000/nam/khong-cache -H \"Cookie: token=$AN\" >/dev/null; curl -s localhost:3000/api/dem\n{\"verifyJwt\":5,\"db.user.findUnique\":5}\n# one request — the same 5 components through cache()\n$ curl -s localhost:3000/nam/co-cache -H \"Cookie: token=$AN\" >/dev/null; curl -s localhost:3000/api/dem\n{\"verifyJwt\":1,\"db.user.findUnique\":1}\n# three requests in a row (An, Binh, An) through cache() — does it leak between requests?\n$ for u in $AN $BINH $AN; do curl -s localhost:3000/nam/co-cache -H \"Cookie: token=$u\" | grep -o 'Feed for <!-- -->[A-Za-z]*'; done; curl -s localhost:3000/api/dem\nFeed for <!-- -->An\nFeed for <!-- -->Binh\nFeed for <!-- -->An\n{\"verifyJwt\":3,\"db.user.findUnique\":3}",
 "n15-4:file:src/lib/user-cache.ts": "// lib/user-cache.ts — \"load the user once and reuse it\" (module scope = the whole server process)\nimport { readUser } from '@/lib/current-user';\n\nlet currentUser: Awaited<ReturnType<typeof readUser>> | undefined;\n\nexport async function getUserOnce() {\n  if (currentUser === undefined) currentUser = await readUser();\n  return currentUser;\n}\n",
 "n15-4:file:src/app/ho-so/page.tsx": "// app/ho-so/page.tsx — \"my profile\"\nimport { getUserOnce } from '@/lib/user-cache';\nexport default async function HoSo() {\n  const u = await getUserOnce();\n  return <main className=\"p-4 text-lg\"><h1 id=\"t\" className=\"font-bold\">Profile · {u?.name ?? 'guest'}</h1><p id=\"e\">{u?.email} · {u?.phone}</p></main>;\n}\n",
 "n15-4:module": "# the trap: a user object kept at MODULE scope\n$ npm run build 2>&1 | grep -E 'Compiled|/ho-so|rror'\n✓ Compiled successfully in 2.0s\n├ ƒ /ho-so\n$ curl -s localhost:3000/ho-so -H \"Cookie: token=$AN\"   | grep -oE 'Profile · [^<]*|[a-z]+@lab.test · [0-9 ]+' | head -2\nProfile · An\nan@lab.test · 0901 000 001\n$ curl -s localhost:3000/ho-so -H \"Cookie: token=$BINH\" | grep -oE 'Profile · [^<]*|[a-z]+@lab.test · [0-9 ]+' | head -2\nProfile · An\nan@lab.test · 0901 000 001\n$ curl -s localhost:3000/ho-so                           | grep -oE 'Profile · [^<]*|[a-z]+@lab.test · [0-9 ]+'   # no cookie at all\nProfile · An\nan@lab.test · 0901 000 001",
 "n15-4:module2": "# the lesson's exact line: `const currentUser = await getUser()` at the top of a module\n$ npm run build 2>&1 | grep -E 'Compiled|/ho-so|rror|outside|cookies' | head -8\n✓ Compiled successfully in 2.4s\nError: Failed to collect configuration for /ho-so\n  [cause]: Error: `cookies` was called outside a request scope. Read more: https://nextjs.org/docs/messages/next-dynamic-api-wrong-context\n      at <unknown> (src/app/ho-so/page.tsx:4:27)\n      at module evaluation (src/app/ho-so/page.tsx:8:1)\n  > 10 |   const token = (await cookies()).get('token')?.value;\n> Build error occurred",
 "n15-4:file:src/lib/posts.ts": "// lib/posts.ts — posts with an owner (globalThis: one copy per server process)\nexport type Post = { id: number; title: string; ownerId: number };\nconst g = globalThis as unknown as { __bv?: Post[] };\nexport const posts = () => (g.__bv ??= [{ id: 1, title: \"An's Q4 plan\", ownerId: 1 }, { id: 2, title: \"Binh's notes\", ownerId: 2 }]);\nexport const removePost = (id: number) => { g.__bv = posts().filter((p) => p.id !== id); };\nexport const resetPosts = () => { g.__bv = undefined; };\n",
 "n15-4:file:src/app/xoa/actions.ts": "'use server';\n// app/xoa/actions.ts — two ways to know WHO is deleting\nimport { revalidatePath } from 'next/cache';\nimport { getCurrentUser } from '@/lib/current-user';\nimport { posts, removePost } from '@/lib/posts';\n\n// ✗ A: trusts the userId the form sends\nexport async function deletePostA(formData: FormData) {\n  const userId = Number(formData.get('userId'));\n  const post = posts().find((p) => p.id === Number(formData.get('postId')));\n  if (!post || post.ownerId !== userId) return;\n  removePost(post.id);\n  console.log(`[action A] deleted post ${post.id} (owner ${post.ownerId}) — userId from the form: ${userId}`);\n  revalidatePath('/xoa');\n}\n\n// ✓ B: reads the session itself\nexport async function deletePostB(formData: FormData) {\n  const user = await getCurrentUser();\n  const post = posts().find((p) => p.id === Number(formData.get('postId')));\n  if (!user || !post || post.ownerId !== user.id) {\n    console.log(`[action B] refused post ${post?.id} (owner ${post?.ownerId}) — session user: ${user?.id ?? 'none'}`);\n    return;\n  }\n  removePost(post.id);\n  revalidatePath('/xoa');\n}\n",
 "n15-4:file:src/app/xoa/page.tsx": "// app/xoa/page.tsx — ?v=a: form carries userId · ?v=b: form carries only postId\nimport { getCurrentUser } from '@/lib/current-user';\nimport { posts } from '@/lib/posts';\nimport { deletePostA, deletePostB } from './actions';\n\nexport default async function Xoa({ searchParams }: { searchParams: Promise<{ v?: string }> }) {\n  const { v = 'a' } = await searchParams;\n  const user = await getCurrentUser();\n  return (\n    <main className=\"p-4 text-lg\">\n      <p id=\"ai\">signed in: {user?.name}</p>\n      <ul id=\"ds\">{posts().map((p) => <li key={p.id}>{p.title}</li>)}</ul>\n      {posts().filter((p) => p.ownerId === user?.id).map((p) => (\n        <form key={p.id} action={v === 'a' ? deletePostA : deletePostB}>\n          {v === 'a' && <input type=\"hidden\" name=\"userId\" value={user!.id} />}\n          <input type=\"hidden\" name=\"postId\" value={p.id} />\n          <button type=\"submit\">Delete “{p.title}”</button>\n        </form>\n      ))}\n    </main>\n  );\n}\n",
 "n15-4:file:src/app/api/bv/route.ts": "import { resetPosts } from '@/lib/posts';\nexport async function DELETE() { resetPosts(); return Response.json({ ok: true }); }\n",
 "n15-4:action": "$ npx next typegen >/dev/null 2>&1; npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npm run build 2>&1 | grep -E 'Compiled|/xoa|rror'\n✓ Compiled successfully in 1896ms\n└ ƒ /xoa",
 "n15-4:actionlog": "[api] verifyJwt #1\n[api] db.user.findUnique #1\n[action A] deleted post 1 (owner 1) — userId from the form: 1\n[api] verifyJwt #2\n[api] db.user.findUnique #2\n[api] GET /api/me #2\n[api] POST /api/login #2\n[api] verifyJwt #3\n[api] db.user.findUnique #3\n[api] verifyJwt #4\n[api] db.user.findUnique #4\n[action B] refused post 1 (owner 1) — session user: 2",
 "n15-4:file:src/app/ten/Badge.tsx": "'use client';\n// app/ten/Badge.tsx — a client component that shows a name\nexport function Badge({ user }: { user: { name: string } }) {\n  return <button onClick={() => alert(user.name)}>👤 {user.name}</button>;\n}\n",
 "n15-4:file:src/app/ten/a/page.tsx": "// app/ten/a/page.tsx — passes the whole database row\nimport { getCurrentUser } from '@/lib/current-user';\nimport { Badge } from '../Badge';\nexport default async function A() {\n  const user = await getCurrentUser();\n  return <main className=\"p-4\">{user && <Badge user={user} />}</main>;\n}\n",
 "n15-4:file:src/app/ten/b/page.tsx": "// app/ten/b/page.tsx — passes only what the badge shows\nimport { getCurrentUser } from '@/lib/current-user';\nimport { Badge } from '../Badge';\nexport default async function B() {\n  const user = await getCurrentUser();\n  return <main className=\"p-4\">{user && <Badge user={{ name: user.name }} />}</main>;\n}\n",
 "n15-4:client": "# what crosses to the browser: the whole row vs only what is shown\n$ npx next typegen >/dev/null 2>&1; npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npm run build 2>&1 | grep -E 'Compiled|/ten|rror'\n✓ Compiled successfully in 2.2s\n├ ƒ /ten/a\n├ ƒ /ten/b\n$ curl -s localhost:3000/ten/a -H \"Cookie: token=$AN\" | grep -oE 'passwordHash[^,]*|phone[^,}]*|email[^,]*'\nemail\":\"an@lab.test\"\npasswordHash\":\"$$2b$10$lab.An.hash.not.real\"\nphone\":\"0901 000 001\"\n$ curl -s localhost:3000/ten/b -H \"Cookie: token=$AN\" | grep -cE 'passwordHash|phone|email'\n0",
 "n15-4:kho": "$ grep -rln \"getCurrentUser\\|getSession()\" src | wc -l | sed 's/^ */tệp có hàm getCurrentUser: /'\ntệp có hàm getCurrentUser: 0\n$ grep -rl \"cookies()\" src/app | sort\nsrc/app/courses/[slug]/learn/page.tsx\nsrc/app/exam/[examId]/page.tsx\nsrc/app/exam/attempt/[attemptId]/page.tsx\nsrc/app/phong-video/[lessonId]/page.tsx\n$ grep -n \"cookieStore.get('backend_token')\" -A5 'src/app/courses/[slug]/learn/page.tsx'\n28:  const token = cookieStore.get('backend_token')?.value;\n29-  if (!token) {\n30-    const callback = encodeURIComponent(`/courses/${params.slug}/learn`);\n31-    redirect(`/login?callbackUrl=${callback}`);\n32-  }\n33-  return (\n$ grep -rn \"= cache(\" src/app | sed 's/: Promise.*//'\nsrc/app/blog/[slug]/page.tsx:41:const getPost = cache(async (slug: string)\nsrc/app/blog/[slug]/page.tsx:80:const coBenTechTrends = cache(async (slug: string)\nsrc/app/voice/[slug]/page.tsx:39:const getPost = cache(async (slug: string)\nsrc/app/tech-trends/[slug]/page.tsx:40:const getArticle = cache(async (slug: string)\nsrc/app/exp-hub/[slug]/page.tsx:22:const getSnippet = cache(async (slug: string)\nsrc/app/games/[slug]/page.tsx:28:const getGame = cache(async (slug: string, cookie: string)\n$ grep -n \"jwt.verify(token, config.jwtSecret)\" src/middleware/auth.ts | head -1\n40:    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;\n$ sed -n '/Re-verify account status/,/accountNonLocked: true/p' src/middleware/auth.ts\n    // Re-verify account status from DB on every authenticated request so that\n    // locking or disabling a user takes effect immediately across all devices —\n    // the JWT alone is not enough because it has a long TTL.\n    const dbUser = await prisma.user.findUnique({\n      where: { id: decoded.userId },\n      select: { enabled: true, accountNonLocked: true, kind: true },",
 "n15-4:dung": "",
 "anh-nxj-15-4:xoa-a-truoc": {
  "url": "http://localhost:19314/xoa?v=a",
  "vp": [
   640,
   200
  ],
  "rect": {},
  "console": [
   {
    "kieu": "error",
    "chu": "Failed to load resource: the server responded with a status of 401 (Unauthorized)"
   }
  ]
 },
 "anh-nxj-15-4:xoa-a": {
  "url": "http://localhost:19314/api/me",
  "vp": [
   640,
   200
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://localhost:19314/api/me",
    "ma": 401,
    "loai": "document",
    "kt": 24
   },
   {
    "url": "http://localhost:19314/api/bv",
    "ma": 200,
    "loai": "fetch",
    "kt": 0,
    "pt": "DELETE",
    "ct": "application/json",
    "than": "",
    "ms": 552,
    "ve": 559
   },
   {
    "url": "http://localhost:19314/api/login",
    "ma": 200,
    "loai": "fetch",
    "kt": 0,
    "pt": "POST",
    "ctq": "application/json",
    "ct": "application/json",
    "than": "{\"name\":\"Binh\"}",
    "ms": 559,
    "ve": 568
   },
   {
    "url": "http://localhost:19314/xoa?v=a",
    "ma": 200,
    "loai": "document",
    "kt": 7556
   },
   {
    "url": "http://localhost:19314/_next/static/chunks/1t21bq9exsz2s.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14772
   },
   {
    "url": "http://localhost:19314/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://localhost:19314/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://localhost:19314/_next/static/chunks/0kqziy-7_gy73.js",
    "ma": 200,
    "loai": "script",
    "kt": 22335
   },
   {
    "url": "http://localhost:19314/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://localhost:19314/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://localhost:19314/_next/static/chunks/395glp5--7qza.js",
    "ma": 200,
    "loai": "script",
    "kt": 181715
   },
   {
    "url": "http://localhost:19314/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://localhost:19314/xoa?v=a",
    "ma": 200,
    "loai": "fetch",
    "kt": 4165,
    "pt": "POST",
    "na": "40af0025b350472e7b4bf6bd0b4265b4af936d1483",
    "ctq": "multipart/form-data; boundary=----WebKitFormBoundaryjOrf3lHSN5eH5KYM",
    "ct": "text/x-component",
    "than": "------WebKitFormBoundaryjOrf3lHSN5eH5KYM\r\nContent-Disposition: form-data; name=\"_1_$ACTION_ID_40af0025b350472e7b4bf6bd0b4265b4af936d1483\"\r\n\r\n\r\n------WebKitFormBoundaryjOrf3lHSN5eH5KYM\r\nContent-Disposition: form-data; name=\"_1_userId\"\r\n\r\n1\r\n------WebKitFormBoundaryjOrf3lHSN5eH5KYM\r\nContent-Dispositio",
    "ms": 1275,
    "ve": 1275
   }
  ],
  "console": [
   {
    "kieu": "error",
    "chu": "Failed to load resource: the server responded with a status of 401 (Unauthorized)"
   }
  ],
  "ketQua": {
   "Binh sửa form trong DevTools ⇒": "$ACTION_ID_40af0025b350472e7b4bf6bd0b4265b4af936d1483= & userId=1 & postId=1",
   "danh sách sau khi bấm Delete ⇒": "Binh's notes"
  }
 },
 "anh-nxj-15-4:xoa-b-truoc": {
  "url": "http://localhost:19314/xoa?v=b",
  "vp": [
   640,
   200
  ],
  "rect": {},
  "console": [
   {
    "kieu": "error",
    "chu": "Failed to load resource: the server responded with a status of 401 (Unauthorized)"
   }
  ]
 },
 "anh-nxj-15-4:xoa-b": {
  "url": "http://localhost:19314/api/me",
  "vp": [
   640,
   200
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://localhost:19314/api/me",
    "ma": 401,
    "loai": "document",
    "kt": 24
   },
   {
    "url": "http://localhost:19314/api/bv",
    "ma": 200,
    "loai": "fetch",
    "kt": 0,
    "pt": "DELETE",
    "ct": "application/json",
    "than": "",
    "ms": 513,
    "ve": 518
   },
   {
    "url": "http://localhost:19314/api/login",
    "ma": 200,
    "loai": "fetch",
    "kt": 0,
    "pt": "POST",
    "ctq": "application/json",
    "ct": "application/json",
    "than": "{\"name\":\"Binh\"}",
    "ms": 519,
    "ve": 523
   },
   {
    "url": "http://localhost:19314/xoa?v=b",
    "ma": 200,
    "loai": "document",
    "kt": 7439
   },
   {
    "url": "http://localhost:19314/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://localhost:19314/_next/static/chunks/1t21bq9exsz2s.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14772
   },
   {
    "url": "http://localhost:19314/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://localhost:19314/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://localhost:19314/_next/static/chunks/0kqziy-7_gy73.js",
    "ma": 200,
    "loai": "script",
    "kt": 22335
   },
   {
    "url": "http://localhost:19314/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://localhost:19314/_next/static/chunks/395glp5--7qza.js",
    "ma": 200,
    "loai": "script",
    "kt": 181715
   },
   {
    "url": "http://localhost:19314/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://localhost:19314/xoa?v=b",
    "ma": 200,
    "loai": "fetch",
    "kt": 78,
    "pt": "POST",
    "na": "407829656d2d2debb9312146a9db1b3fb32a9c406b",
    "ctq": "multipart/form-data; boundary=----WebKitFormBoundaryn4Z3AzkUTYODEAqa",
    "ct": "text/x-component",
    "than": "------WebKitFormBoundaryn4Z3AzkUTYODEAqa\r\nContent-Disposition: form-data; name=\"_1_$ACTION_ID_407829656d2d2debb9312146a9db1b3fb32a9c406b\"\r\n\r\n\r\n------WebKitFormBoundaryn4Z3AzkUTYODEAqa\r\nContent-Disposition: form-data; name=\"_1_postId\"\r\n\r\n1\r\n------WebKitFormBoundaryn4Z3AzkUTYODEAqa\r\nContent-Dispositio",
    "ms": 1126,
    "ve": 1131
   }
  ],
  "console": [
   {
    "kieu": "error",
    "chu": "Failed to load resource: the server responded with a status of 401 (Unauthorized)"
   }
  ],
  "ketQua": {
   "Binh sửa form trong DevTools ⇒": "$ACTION_ID_407829656d2d2debb9312146a9db1b3fb32a9c406b= & postId=1",
   "danh sách sau khi bấm Delete ⇒": "An's Q4 plan | Binh's notes"
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, br, box, two, steps, kw, c, cmp, icards, path, meter, thucTe4 } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-15-4', code: 'NXJ 15.4', title: 'Reading the current user on the server', sub: 'Chapter 15 · Lesson 15.4' };
const O = (k) => { const v = DU_LIEU[`n15-4:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const A = (k) => { const v = DU_LIEU[`anh-nxj-15-4:${k}`]; if (!v) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const F = (p) => O(`file:${p}`).trim();
const doan = (k, dau) => { const ls = O(k).split('\n'); const i = ls.findIndex((l) => l.startsWith('$ ') && l.includes(dau)); if (i < 0) throw new Error('không thấy ' + dau + ' trong ' + k); const r = []; for (let j = i + 1; j < ls.length && !ls[j].startsWith('$ ') && !ls[j].startsWith('# '); j++) if (ls[j].trim() && !/^(\[|✓ Running)/.test(ls[j].trim())) r.push(ls[j]); return r; };
const B = (ten, o) => br('nxj-15-4', ten, { vp: 640, ...o });
const sach = (s) => s.replace(/<!-- -->/g, '');

// ── số đo (n15-4 · lab c15 · Next.js 16.4.6 · next start 19314 · Chromium)
const BAI = O('bai').split('\n');
const E1 = BAI.filter((l) => /TS2304/.test(l)), E2 = BAI.filter((l) => /TS2339/.test(l)), E3 = BAI.filter((l) => /TS2322/.test(l));
const T_KHONG = doan('cache', '/trang | grep'), T_AN = doan('cache', 'token=$AN" | grep -o \'Hello').map(sach);
const dem = (dau) => JSON.parse(doan('cache', dau).find((l) => l.startsWith('{')));
const KC = dem('nam/khong-cache'), CC = dem('nam/co-cache -H'), BA = doan('cache', 'for u in').map(sach);
const BA_DEM = JSON.parse(BA.find((l) => l.startsWith('{'))), BA_TEN = BA.filter((l) => /^Feed for/.test(l));
const M_AN = doan('module', 'token=$AN'), M_BINH = doan('module', 'token=$BINH'), M_KHONG = doan('module', 'no cookie at all');
const M2 = O('module2').split('\n').filter((l) => /Failed to collect|outside a request scope/.test(l)).map((l) => l.trim().replace(/ Read more:.*$/, ''));
const LOG = O('actionlog').split('\n').filter((l) => /^\[action/.test(l));
const XA = A('xoa-a').ketQua, XB = A('xoa-b').ketQua;
const CL_A = doan('client', '/ten/a'), CL_B = doan('client', '/ten/b');
const KHO = O('kho');
const VC = KC.verifyJwt, DC = KC['db.user.findUnique'], V1 = CC.verifyJwt, D1 = CC['db.user.findUnique'];
if (E1.length !== 2 || E2.length !== 1 || E3.length !== 1) throw new Error('bai đổi');
if (!/307/.test(T_KHONG[0]) || !/from=trang/.test(T_KHONG[1]) || !/Hello, An/.test(T_AN[0])) throw new Error('trang đổi');
if (VC !== 5 || DC !== 5 || V1 !== 1 || D1 !== 1 || BA_DEM.verifyJwt !== 3 || BA_TEN.join() !== 'Feed for An,Feed for Binh,Feed for An') throw new Error('cache đổi');
if (!/Profile · An/.test(M_BINH[0]) || !/Profile · An/.test(M_KHONG[0]) || M2.length < 2) throw new Error('module đổi');
if (!/\[action A\] deleted post 1/.test(LOG.join()) || !/\[action B\] refused post 1/.test(LOG.join())) throw new Error('action đổi');
if (XA['danh sách sau khi bấm Delete ⇒'] !== "Binh's notes" || !/An's Q4 plan/.test(XB['danh sách sau khi bấm Delete ⇒'])) throw new Error('ảnh action đổi');
if (CL_A.length !== 3 || CL_B[0] !== '0') throw new Error('client đổi');

const HELPER = F('src/lib/current-user.ts').replace(/^\/\/ lib\/current-user\.ts — .*\n/, '// lib/current-user.ts\n').replace("import { dem } from '@/lib/kho';\n", '').replace("  dem('verifyJwt');\n", '')
  .replace('  return db.user.findUnique({ where: { id: Number(payload.sub) } });', '  return db.user.findUnique({\n    where: { id: Number(payload.sub) },\n  });').replace('    // signature + expiry', '').replace('// cache(): one call per request, however many components ask', '// cache(): once per request');
if (!/where: \{ id: Number\(payload\.sub\) \}/.test(HELPER)) throw new Error('helper đổi');
const LESSON = `// lib/auth.ts — the lesson's helper
import { cookies } from 'next/headers';

export async function getCurrentUser() {
  const token = (await cookies()).get('token')?.value;
  if (!token) return null;
  const payload = verifyJwt(token);    // verify signature + expiry
  if (!payload) return null;
  return db.user.findUnique({ where: { id: payload.sub } });
}`;
const TRANG = F('src/app/trang/page.tsx').split('\n').slice(1).join('\n').replace(/return <main[^\n]*/, 'return <main …><h1>Hello, {user.name}</h1></main>;');
if (!/redirect\('\/login\?from=trang'\)/.test(TRANG)) throw new Error('trang đổi');
const MODULE = F('src/lib/user-cache.ts').replace(/^\/\/ lib\/user-cache\.ts — .*\n/, '// lib/user-cache.ts — "load the user once"\n').replace('let currentUser: Awaited', 'let currentUser:\n  Awaited').replace('if (currentUser === undefined) currentUser = await readUser();', 'if (currentUser === undefined)\n    currentUser = await readUser();');
const PARTS = F('src/app/nam/parts.tsx'); if (!/export async function Header\(\{ get \}: \{ get: Get \}\) \{ const u = await get\(\); return <header>Header · \{u\?\.name\}<\/header>; \}/.test(PARTS)) throw new Error('parts đổi');
const PARTS_HIEN = `// app/nam/parts.tsx — five server components\nexport async function Header({ get }: { get: Get }) {\n  const u = await get();          // "who is this?"\n  return <header>Header · {u?.name}</header>;\n}\n// Sidebar, Avatar, Feed, Footer: the same shape\n\n// app/nam/khong-cache/page.tsx  → get={readUser}\n// app/nam/co-cache/page.tsx     → get={getCurrentUser}`;
const K = O('kho').split('\n');
const KHO_HIEN = [K[0], K[1], K[2], ...K.slice(3, 7), K[7], ...K.slice(8, 13).filter((l) => /28:|29-|31-/.test(l)), '$ grep -rn "= cache(" src/app | wc -l', String(K.filter((l) => / = cache\(/.test(l) && !l.startsWith('$')).length), ...K.slice(K.findIndex((l) => l.includes('jwt.verify(token'))).filter((l) => /^\$ grep|^40:|^\$ sed|Re-verify|findUnique|where:|select:/.test(l.trim()) || /^\$/.test(l)), ].join('\n');
const ACT_A = `// ✗ A: trusts the userId the form sends
export async function deletePostA(formData: FormData) {
  const userId = Number(formData.get('userId'));
  const post = findPost(formData.get('postId'));
  if (!post || post.ownerId !== userId) return;
  removePost(post.id);
}`;
const ACT_B = `// ✓ B: reads the session itself
export async function deletePostB(formData: FormData) {
  const user = await getCurrentUser();
  const post = findPost(formData.get('postId'));
  if (!user || !post || post.ownerId !== user.id) return;
  removePost(post.id);
}`;

export const S = [
  { cover: true, nhan: 'Chapter 15 · Lesson 15.4', t: 'Reading the<br>current user<br>on the server', sub: 'One helper, verified, once per request — measured: cache(), a module-scope leak, a tampered form, and what crosses to the browser',
    en: 'Lesson fifteen point four: reading the current user on the server. One helper, verified, once per request. We measure cache, a module-scope leak, a tampered form, and what crosses to the browser.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>One helper <code>getCurrentUser()</code>: cookie → <b>verify</b> → database → user</li>
    <li>The page enforces access itself: <code>redirect('/login')</code> when it is <code>null</code></li>
    <li><code>cache()</code>: ${VC} verifications become ${V1} per request — and nothing leaks between requests</li>
    <li>Module scope is the whole server: Binh saw <b>An's</b> email</li>
    <li>Never take the user id from the client; send the client only what it shows</li></ul>`,
    en: `Five takeaways: one helper reads the cookie, verifies it, loads the user; the page enforces access with a redirect; cache turns ${VC} verifications into ${V1} per request without leaking between requests; module scope is the whole server, so Binh saw An's email; and never take the user id from the client.` },
  { t: 'One helper, used everywhere on the server', body: path([
      { t: 'cookie', s: "token=eyJ…" }, { t: 'verify', s: 'signature + expiry', on: true }, { t: 'database', s: 'findUnique(id)' }, { t: 'user | null', s: 'one source of truth' },
    ], { nhan: ['read', 'sub', 'row'] }) + icards([
      ['layers', 'Server Component', 'render per user — or <code>redirect(\'/login\')</code>'],
      ['bolt', 'Server Action', '<code>if (!user) throw</code>, then check ownership'],
      ['link', 'Route Handler', 'gate the endpoint before doing anything'],
    ], 3) + box('Verify, do not just read', 'A cookie can be forged. Only a token your server signed passes the signature check — the step a presence-only proxy skips (15.3).', 'lam'),
    en: 'One helper, used everywhere on the server: read the cookie, verify the signature and expiry, load the row, return the user or null. Call it from a Server Component, a Server Action or a Route Handler. Verify, do not just read: a cookie can be forged.' },
  { t: "The lesson's helper on Next.js 16.4.6", body: two(D(tsx(LESSON, { sm: true, hl: [7, 9] })),
    D(tn(['# pasted as written', ...E1, '# + import verifyJwt (async) and db', ...E2, '# + await', ...E3.slice(0, 1), '# + Number(payload.sub)', 'tsc: 0 lỗi'].join('\n'), { fs: 13, wrap: 54, title: 'npx tsc --noEmit (real)' }),
      box('Two real bugs the compiler caught', `Without <code>await</code>, <code>payload</code> is a Promise — always truthy, so <code>if (!payload)</code> never fires. And <code>sub</code> in a JWT is a <b>string</b>; the database id is a number.`, 'do2')), 'r50'),
    en: 'The lesson\'s helper on Next.js sixteen. Pasted as is: verifyJwt and db are not defined. With the imports: payload is a Promise, because verify is async. With await: sub is a string, the database id is a number. Convert it, and tsc reports zero errors.' },
  { t: 'The helper, and a page that enforces access', body: two(D(tsx(HELPER, { sm: true, hl: [11, 13, 19] })),
    D(tsx(TRANG, { sm: true, hl: [4] }), tn(['$ curl -si localhost:3000/trang            # no cookie', ...T_KHONG, '$ curl -s localhost:3000/trang -H "Cookie: token=$AN"', ...T_AN].join('\n'), { fs: 13, wrap: 56, title: 'curl (real)' })), 'r50'),
    en: 'The finished helper: server only, verify, then load the user by a numeric id, wrapped in cache. The page calls it and redirects to login when it is null. Measured: no cookie, a 307 to login with from equals trang; An\'s token, Hello, An.' },
  { t: 'Measured: five components, one request', body: two(D(tsx(PARTS_HIEN, { sm: true, hl: [3] }),
      meter([['no cache() · verifyJwt', VC, '#dc2626'], ['no cache() · db.findUnique', DC, '#dc2626'], ['cache() · verifyJwt', V1, '#16a34a'], ['cache() · db.findUnique', D1, '#16a34a']], { don: 'call(s)', w: 540, nhan: 250, fs: 16 })),
    D(tn([`$ curl -s localhost:3000/nam/khong-cache -H "Cookie: token=$AN"; curl -s localhost:3000/api/dem`, JSON.stringify(KC), `$ curl -s localhost:3000/nam/co-cache -H "Cookie: token=$AN"; curl -s localhost:3000/api/dem`, JSON.stringify(CC)].join('\n'), { fs: 13, wrap: 56, title: 'counters (real)' }),
      box('cache() deduplicates within one render', `Header, Sidebar, Avatar, Feed and Footer each ask "who is this?". Plain helper: <b>${VC}</b> verifications + <b>${DC}</b> queries. Through <code>cache()</code>: <b>${V1}</b> + <b>${D1}</b>.`, 'xanh')), 'r50'),
    en: `Measured: five server components on one page, each asking who the user is. With the plain helper: ${VC} verifications and ${DC} database queries for a single request. Through cache: one and one.` },
  { t: 'cache() is per request — it does not leak', body: two(D(tn([`$ for u in $AN $BINH $AN; do curl -s …/nam/co-cache -H "Cookie: token=$u"; done`, ...BA_TEN, JSON.stringify(BA_DEM)].join('\n'), { fs: 15, wrap: 56, title: 'three requests (real)' })),
    D(box('Each request gets its own answer', `Three requests — An, Binh, An — each saw its own name, and the counter shows <b>${BA_DEM.verifyJwt}</b> verifications: one per request. React clears the <code>cache()</code> store after every server request.`, 'xanh'),
      box('Not a data cache', '<code>cache()</code> only shares a result <i>inside</i> one render. It is not <code>fetch</code> caching and not <code>unstable_cache</code>; nothing survives to the next visitor.', 'lam')), 'r50'),
    en: 'cache is per request. Three requests in a row, An, Binh, An: each saw its own name, and the counter shows three verifications, one per request. It only shares a result inside one render; nothing survives to the next visitor.' },
  { t: 'Trap: a user kept at module scope', body: two(D(tsx(MODULE, { sm: true, hl: [4, 7] })),
    D(tn(['$ curl -s localhost:3000/ho-so -H "Cookie: token=$AN"', ...M_AN, '$ curl -s localhost:3000/ho-so -H "Cookie: token=$BINH"', ...M_BINH, '$ curl -s localhost:3000/ho-so            # no cookie', ...M_KHONG].join('\n'), { fs: 14, wrap: 56, title: 'curl (real)' }),
      box('Module scope = the whole server process', 'The first visitor filled <code>currentUser</code>. Binh — and a visitor with <b>no cookie at all</b> — got An\'s name, email and phone. No error, it type-checks, it builds.', 'do2')), 'r50'),
    en: 'The trap: a user kept at module scope. An visits first and fills the variable. Then Binh, and even a visitor with no cookie, get An\'s profile: name, email, phone. No error. Module scope on a server is the whole process, not one request.' },
  { t: "The lesson's exact line — and the same shape elsewhere", body: two(D(tsx("// app/ho-so/page.tsx\nimport { readUser } from '@/lib/current-user';\n\nconst currentUser = await readUser();   // top of the module\n\nexport default function HoSo() { /* … */ }", { sm: true, hl: [4] }),
      tn(['$ npm run build', ...M2].join('\n'), { fs: 13, wrap: 60, title: 'next build (real)' })),
    D(box('Here the framework stops you', '<code>cookies()</code> outside a request fails the build. The quiet version is the lazy one on the previous slide: it builds and leaks.', 'lam'),
      box('Same lifetime bug, other costumes', `<ul><li>a Zustand store created at module scope on the server</li><li>a shared Axios instance with a user's <code>Authorization</code> header</li><li>a <code>let</code> used as a cache</li></ul>Anything per user is read <b>inside</b> the request, every time.`, 'do2')), 'r50'),
    en: 'The lesson\'s exact line, await at the top of a module, does not even build: cookies was called outside a request scope. The dangerous version is the lazy one, which builds and leaks. The same bug hides in a module-level store, a shared Axios instance with a user header, or a let used as a cache.' },
  { t: "Don't pass the user id to an action", body: two(D(`<div style="margin-bottom:12px">${B('xoa-a-truoc', { url: 'localhost:3000/xoa · signed in as Binh', h: 120, w: 520 })}</div>`, tsx(ACT_A, { sm: true, hl: [3] }), tsx(ACT_B, { sm: true, hl: [3] })),
    D(tn(['# Binh edits the hidden inputs in DevTools', `A: ${XA['Binh sửa form trong DevTools ⇒'].replace(/\$ACTION_ID_\w+= & /, '')}`, `   list after Delete: ${XA['danh sách sau khi bấm Delete ⇒']}`, `B: ${XB['Binh sửa form trong DevTools ⇒'].replace(/\$ACTION_ID_\w+= & /, '')}`, `   list after Delete: ${XB['danh sách sau khi bấm Delete ⇒']}`, '# server log', ...LOG].join('\n'), { fs: 13, wrap: 60, title: 'Chromium + next start (real)' }),
      box('A prop is controlled by the caller', 'A hidden input, a prop, an argument — the browser can change all of them. With A, Binh deleted <b>An\'s</b> post. With B the action reads the session itself and refuses.', 'do2')), 'r48'),
    en: 'Do not pass the user id to an action. Signed in as Binh, we edit the hidden inputs in DevTools. Version A trusts the user id from the form, and An\'s post is deleted. Version B reads the session itself: refused, both posts remain.' },
  { t: 'Send the client only what it shows', body: two(D(tsx("// app/ten/a/page.tsx — the whole row\n<Badge user={user} />\n\n// app/ten/b/page.tsx — only what the badge shows\n<Badge user={{ name: user.name }} />", { sm: true, hl: [2] }),
      tn(['$ curl -s localhost:3000/ten/a -H "Cookie: token=$AN" | grep -oE \'passwordHash|phone|email…\'', ...CL_A, '$ curl -s localhost:3000/ten/b -H "Cookie: token=$AN" | grep -cE \'passwordHash|phone|email\'', ...CL_B].join('\n'), { fs: 13, wrap: 60, title: 'page HTML (real)' })),
    D(box('Props of a Client Component are serialised', 'The badge shows a name. Passing the whole row put the <b>email, phone and password hash</b> into the HTML — anyone can read it with View Source.', 'do2'),
      box('Pick fields at the boundary', 'Build a small object for the client: <code>{ name, avatarUrl }</code>. Everything crossing to the browser is visible to the user.', 'xanh')), 'r50'),
    en: 'Send the client only what it shows. A client badge that displays a name received the whole user row: the email, the phone and the password hash all ended up in the page HTML. Passing only the name: zero matches.' },
  { t: 'cuongthai.com: who checks the user?', body: two(D(tn(KHO_HIEN, { fs: 12, wrap: 66, title: 'frontend/ + backend (real)' })),
    D(box('Frontend: presence only', 'No <code>getCurrentUser</code> helper. Four server pages call <code>cookies()</code> and only check that <code>backend_token</code> exists — the optimistic gate.', 'lam'),
      box('Backend: the one helper', 'Every API call goes through <code>authenticate</code>: <code>jwt.verify</code>, then a database re-check that <code>select</code>s three fields — locked or disabled accounts stop at once.', 'xanh'),
      box('cache() in the repo', 'Used six times to share <code>getPost</code> between <code>generateMetadata</code> and the page — the same per-request dedup.', 'lam')), 'r56'),
    en: 'cuongthai.com: there is no getCurrentUser helper in the frontend; four server pages only check that the token cookie exists. The real helper lives in the backend: authenticate verifies the JWT and re-checks the account in the database on every call. cache is used six times to share a post between metadata and the page.' },
  { t: "Not learning in a vacuum: real life, what if, the attacker", to: true, body: thucTe4({ doi: ["🏫", "A lab PC where you forgot to sign out", ["the next person opens your profile", "a module-level user leaks to EVERYONE, on any PC"]], neu: ["🗄️", "A cache stores pages by URL, ignoring the cookie?", ["the next visitor gets the previous visitor's page", "the same leak as <code>let currentUser</code>"]], xau: ["🔢", "Edit an id in the form or URL (IDOR)", ["userId=1, postId=1 ⇒ delete someone else's post", "measured: version A deleted An's post"]], phong: ["🛡️", "Read the session + check the owner", ["log when session user ≠ data owner", "<code>getCurrentUser()</code> in the action · <code>post.ownerId === user.id</code>"]] }),
    en: "Real life: in a university computer lab you sign in to the portal and forget to sign out; the next person opens your profile. A module-level user is worse: no shared machine needed. What if a cache in front of the page stores the profile by URL and ignores the cookie? The next visitor gets the previous visitor's page — the same leak. The attacker changes a number in the form or the URL — a user id, a post id — to touch someone else's data. This bug has a name: IDOR. Detect it by logging whenever the session user differs from the data owner. Prevent it: the action reads the session itself and checks ownership every time." },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('getCurrentUser()', 'cookie → verify → user'), kw('Verify', 'signature + expiry'), kw('redirect()', 'page enforces access'), kw('cache()', 'once per request'),
      kw('Module scope', 'whole server process'), kw('Request scope', 'one visitor'), kw('server-only', 'never bundled for the browser'), kw('Serialisation boundary', 'props to the client are visible'),
      kw('Ownership check', 'post.ownerId === user.id'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: getCurrentUser; verify; redirect; cache, once per request; module scope, the whole server process; request scope, one visitor; server-only; the serialisation boundary; and the ownership check.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Write ${c('getCurrentUser()')}: cookie → ${c('verifyJwt')} → user, wrapped in ${c('cache()')}`,
      `Protect a page with ${c("redirect('/login')")}; call it from five components and count verifications`,
      `Put the user in a module-level ${c('let')}; visit as two people`,
      `Write a delete action that reads the session, then tamper with the form`,
    ]), box('Keep these', `<ul><li>Verify, not just read</li><li>cache(): once per request, never across</li><li>Per-user data never at module scope</li><li>The action reads the user; the client gets only what it shows</li></ul>`, 'lam'), ''),
    en: 'Your turn: write getCurrentUser wrapped in cache; protect a page and count verifications from five components; put the user in a module-level let and visit as two people; write a delete action that reads the session, then tamper with the form.' },
];
export const slides = lamDeck({ chuong: 'Chapter 15 — Authentication, middleware, and cookies', bai: '15.4' }, S);
