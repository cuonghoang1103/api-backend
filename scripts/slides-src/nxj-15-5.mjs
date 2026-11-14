/*DU_LIEU*/
const DU_LIEU = {
 "n15-5:file:src/lib/refresh.ts": "// lib/refresh.ts — refresh tokens kept on the server: rotated on every use, reuse revokes the whole family\nimport { randomUUID } from 'node:crypto';\n\ntype Rt = { userId: number; family: string; used: boolean };\nconst g = globalThis as unknown as { __rt?: Map<string, Rt> };\nconst store = (g.__rt ??= new Map<string, Rt>());\n\nexport function issueRefresh(userId: number, family: string = randomUUID()) {\n  const rt = randomUUID();\n  store.set(rt, { userId, family, used: false });\n  return rt;\n}\n\nexport function rotateRefresh(rt?: string): { ok: true; userId: number; next: string } | { ok: false; why: string } {\n  const r = rt ? store.get(rt) : undefined;\n  if (!r) return { ok: false, why: 'unknown refresh token' };\n  if (r.used) {                                   // an old one came back: someone has a copy\n    for (const x of store.values()) if (x.family === r.family) x.used = true;\n    return { ok: false, why: 'reuse detected, family revoked' };\n  }\n  r.used = true;                                  // rotate: this one is spent\n  return { ok: true, userId: r.userId, next: issueRefresh(r.userId, r.family) };\n}\n",
 "n15-5:file:src/app/api/login2/route.ts": "// app/api/login2/route.ts — access token (short) + refresh token (long), both httpOnly\nimport { NextResponse } from 'next/server';\nimport { USERS, signJwt } from '@/lib/auth';\nimport { issueRefresh } from '@/lib/refresh';\n\nexport async function POST(req: Request) {\n  const { name = 'An', exp = '5s' } = await req.json().catch(() => ({}));\n  const user = USERS.find((u) => u.name === name);\n  if (!user) return NextResponse.json({ error: 'unknown user' }, { status: 401 });\n  const res = NextResponse.json({ ok: true, name: user.name });\n  res.cookies.set('token', await signJwt(user, exp), { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7 });\n  res.cookies.set('rt', issueRefresh(user.id), { httpOnly: true, sameSite: 'lax', path: '/api/refresh', maxAge: 60 * 60 * 24 * 30 });\n  return res;\n}\n",
 "n15-5:file:src/app/api/refresh/route.ts": "// app/api/refresh/route.ts — trade a refresh token for a new access token (and a new refresh token)\nimport { NextResponse } from 'next/server';\nimport { cookies } from 'next/headers';\nimport { signJwt, userById } from '@/lib/auth';\nimport { rotateRefresh } from '@/lib/refresh';\nimport { dem } from '@/lib/kho';\n\nexport async function POST() {\n  dem('POST /api/refresh');\n  const r = rotateRefresh((await cookies()).get('rt')?.value);\n  const user = r.ok ? userById(r.userId) : null;\n  if (!r.ok || !user) {\n    console.log(`[refresh] 401 — ${r.ok ? 'user gone' : r.why}`);\n    return NextResponse.json({ error: r.ok ? 'user gone' : r.why }, { status: 401 });\n  }\n  console.log(`[refresh] 200 — new access token for ${user.name}, refresh token rotated`);\n  const res = NextResponse.json({ ok: true });\n  res.cookies.set('token', await signJwt(user, '5s'), { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7 });\n  res.cookies.set('rt', r.next, { httpOnly: true, sameSite: 'lax', path: '/api/refresh', maxAge: 60 * 60 * 24 * 30 });\n  return res;\n}\n",
 "n15-5:file:src/app/api/auth/refresh/route.ts": "// app/api/auth/refresh/route.ts — the INCIDENT shape: a frontend proxy to a backend route that does not exist\nimport { NextResponse } from 'next/server';\nimport { dem } from '@/lib/kho';\n\nexport async function POST(req: Request) {\n  dem('POST /api/auth/refresh');\n  const up = await fetch(new URL('/api/v1/auth/refresh', req.url), { method: 'POST' });\n  console.log(`[auth/refresh] upstream POST /api/v1/auth/refresh → ${up.status}`);\n  return NextResponse.json({ error: 'refresh failed' }, { status: up.status });\n}\n",
 "n15-5:file:src/app/phien/page.tsx": "'use client';\n// app/phien/page.tsx — three API calls at once, through an axios instance (?m= khong | loi | mot | sf)\nimport axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';\nimport { useState } from 'react';\n\ntype Mode = 'khong' | 'loi' | 'mot' | 'sf';\ntype Cfg = InternalAxiosRequestConfig & { _retried?: boolean };\n\nfunction makeApi(mode: Mode) {\n  const api = axios.create();\n  if (mode === 'khong') return api;                       // no refresh at all\n  const url = mode === 'loi' ? '/api/auth/refresh' : '/api/refresh';\n  const refresh = () => axios.post(url).then(() => true, () => false);\n  let inFlight: Promise<boolean> | null = null;\n  api.interceptors.response.use(undefined, async (error: AxiosError) => {\n    const original = error.config as Cfg | undefined;\n    if (error.response?.status !== 401 || !original || original._retried) throw error;\n    original._retried = true;                             // exactly once\n    const ok = mode === 'sf'\n      ? await (inFlight ??= refresh().finally(() => { inFlight = null; }))   // single-flight\n      : await refresh();                                  // every 401 refreshes on its own\n    if (!ok) throw error;\n    return api(original);                                 // replay the original request\n  });\n  return api;\n}\n\nexport default function Phien() {\n  const [kq, setKq] = useState('');\n  async function goi() {\n    const mode = (new URLSearchParams(location.search).get('m') ?? 'khong') as Mode;\n    const api = makeApi(mode);\n    const r = await Promise.allSettled([1, 2, 3].map((i) => api.get(`/api/me?i=${i}`)));\n    setKq(r.map((x, i) => `#${i + 1} ${x.status === 'fulfilled' ? x.value.status : (x.reason as AxiosError).response?.status}`).join(' · '));\n  }\n  return <main className=\"p-4 text-lg\"><button id=\"b\" onClick={goi} className=\"rounded border px-3 py-1\">Call 3 APIs</button><p id=\"kq\">{kq}</p></main>;\n}\n",
 "n15-5:lab": "$ npx next typegen >/dev/null 2>&1; npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npm run build 2>&1 | grep -E 'Compiled|/phien|/api/refresh|/api/auth|rror'\n✓ Compiled successfully in 2.2s\n├ ƒ /api/auth/refresh\n├ ƒ /api/refresh\n└ ○ /phien",
 "n15-5:het": "# the incident in miniature: a 5-second access token inside a 7-day cookie\n$ curl -si -c jar -X POST localhost:3000/api/login2 -d '{\"name\":\"An\",\"exp\":\"5s\"}' | grep -i '^set-cookie: token'\nset-cookie: token=eyJ…; Path=/; Expires=Sat, 21 Nov 2026 05:37:33 GMT; Max-Age=604800; HttpOnly; SameSite=lax\n$ curl -s -b jar localhost:3000/api/me\n{\"via\":\"cookie\",\"user\":{\"id\":1,\"name\":\"An\",\"role\":\"admin\"}}\n$ sleep 6\n$ curl -si -b jar localhost:3000/api/me | grep -E '^HTTP|error'\nHTTP/1.1 401 Unauthorized\n{\"error\":\"unauthorized\"}\n$ grep -c token jar   # the cookie is still there\n1\n[api] GET /api/me #1\n[api] GET /api/me #2\n[auth] verify failed: ERR_JWT_EXPIRED",
 "n15-5:xoay": "# rotation + reuse detection, by hand\n$ curl -s -b jar -c jar -X POST localhost:3000/api/refresh            # refresh token #1\n{\"ok\":true}\n$ curl -s -b jar-copy -X POST localhost:3000/api/refresh              # a copy of #1 comes back\n{\"error\":\"reuse detected, family revoked\"}\n$ curl -s -b jar -X POST localhost:3000/api/refresh                   # the real owner, with #2\n{\"error\":\"reuse detected, family revoked\"}\n[refresh] 200 — new access token for Binh, refresh token rotated\n[api] POST /api/refresh #13\n[refresh] 401 — reuse detected, family revoked\n[api] POST /api/refresh #14\n[refresh] 401 — reuse detected, family revoked",
 "n15-5:kho": "$ grep -n 'JWT_EXPIRES_IN' .env.example\n33:JWT_EXPIRES_IN=\"24h\"\n$ git log --format='%h %ad %s' --date=short --diff-filter=A -- frontend/src/app/api/auth/refresh/route.ts | tail -1\n7690cdc76 2026-06-09 fix: resolve critical bugs across all flows for 100% operation\n$ git show 4448f4d14 --format='%h %ad %s' --date=short --stat | grep -E '^4448|auth.routes|api.ts'\n4448f4d14 2026-07-02 fix(media+auth): stop blob: URLs hitting R2 (400) + silent session refresh\n frontend/src/lib/api.ts      | 47 ++++++++++++++++++++++++++++++++++++--------\n src/routes/auth.routes.ts    | 27 +++++++++++++++++++++++++\n$ grep -n \"ignoreExpiration: true\" src/services/auth.service.ts\n997:        ignoreExpiration: true,\n$ grep -n 'SESSION_TOO_OLD' src/services/auth.service.ts | head -1\n1007:      throw new AppError('Session too old — please sign in again', 401, 'SESSION_TOO_OLD');\n$ grep -n \"original._retried = true\" frontend/src/lib/api.ts\n221:      original._retried = true;\n$ grep -n \"if (!dangLamMoi)\" -A1 frontend/src/lib/hetPhien.ts\n67:  if (!dangLamMoi) {\n68-    dangLamMoi = fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' })\n$ grep -n \"maxAge: 60 \\* 60 \\* 24 \\* 30\" frontend/src/app/api/auth/refresh/route.ts\n65:      maxAge: 60 * 60 * 24 * 30, // 30 ngày (08/11/2026), gia hạn trượt: lib/hetPhien.ts",
 "n15-5:nhatky": "[api] POST /api/refresh #1\n[refresh] 200 — new access token for Binh, refresh token rotated\n[api] POST /api/refresh #2\n[refresh] 401 — reuse detected, family revoked\n[api] POST /api/refresh #3\n[refresh] 401 — reuse detected, family revoked\n[api] GET /api/me #3\n[api] GET /api/me #4\n[api] GET /api/me #5\n[api] GET /api/me #6\n[auth] verify failed: ERR_JWT_EXPIRED\n[api] GET /api/me #7\n[api] GET /api/me #8\n[auth] verify failed: ERR_JWT_EXPIRED\n[auth] verify failed: ERR_JWT_EXPIRED\n[api] GET /api/me #9\n[api] GET /api/me #10\n[api] GET /api/me #11\n[auth] verify failed: ERR_JWT_EXPIRED\n[auth] verify failed: ERR_JWT_EXPIRED\n[auth] verify failed: ERR_JWT_EXPIRED\n[api] POST /api/auth/refresh #1\n[api] POST /api/auth/refresh #2\n[api] POST /api/auth/refresh #3\n[auth/refresh] upstream POST /api/v1/auth/refresh → 404\n[auth/refresh] upstream POST /api/v1/auth/refresh → 404\n[auth/refresh] upstream POST /api/v1/auth/refresh → 404\n[api] GET /api/me #12\n[api] GET /api/me #13\n[api] GET /api/me #14\n[auth] verify failed: ERR_JWT_EXPIRED\n[auth] verify failed: ERR_JWT_EXPIRED\n[auth] verify failed: ERR_JWT_EXPIRED\n[api] POST /api/refresh #4\n[refresh] 200 — new access token for An, refresh token rotated\n[api] POST /api/refresh #5\n[refresh] 401 — reuse detected, family revoked\n[api] POST /api/refresh #6\n[refresh] 401 — reuse detected, family revoked\n[api] GET /api/me #15\n[api] GET /api/me #16\n[auth] verify failed: ERR_JWT_EXPIRED\n[api] GET /api/me #17\n[auth] verify failed: ERR_JWT_EXPIRED\n[api] GET /api/me #18\n[auth] verify failed: ERR_JWT_EXPIRED\n[api] POST /api/refresh #7\n[refresh] 401 — reuse detected, family revoked\n[api] POST /api/refresh #8\n[refresh] 401 — reuse detected, family revoked\n[api] POST /api/refresh #9\n[refresh] 401 — reuse detected, family revoked\n[api] GET /api/me #19\n[api] GET /api/me #20\n[api] GET /api/me #21\n[auth] verify failed: ERR_JWT_EXPIRED\n[auth] verify failed: ERR_JWT_EXPIRED\n[auth] verify failed: ERR_JWT_EXPIRED\n[api] POST /api/refresh #10\n[refresh] 200 — new access token for An, refresh token rotated\n[api] GET /api/me #22\n[api] GET /api/me #23\n[api] GET /api/me #24\n[api] GET /api/me #25\n[api] GET /api/me #26\n[auth] verify failed: ERR_JWT_EXPIRED\n[api] GET /api/me #27\n[auth] verify failed: ERR_JWT_EXPIRED\n[auth] verify failed: ERR_JWT_EXPIRED\n[api] POST /api/refresh #11\n[refresh] 200 — new access token for An, refresh token rotated\n[api] GET /api/me #28\n[api] GET /api/me #29\n[api] GET /api/me #30\n[api] POST /api/refresh #12\n[refresh] 200 — new access token for Binh, refresh token rotated\n[api] POST /api/refresh #13\n[refresh] 401 — reuse detected, family revoked\n[api] POST /api/refresh #14\n[refresh] 401 — reuse detected, family revoked",
 "n15-5:dung": "",
 "anh-nxj-15-5:khong": {
  "url": "http://localhost:19315/api/dem",
  "vp": [
   640,
   120
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://localhost:19315/api/dem",
    "ma": 200,
    "loai": "document",
    "kt": 39
   },
   {
    "url": "http://localhost:19315/api/login2",
    "ma": 200,
    "loai": "fetch",
    "kt": 0,
    "pt": "POST",
    "ctq": "application/json",
    "ct": "application/json",
    "than": "{\"name\":\"An\"}",
    "ms": 537,
    "ve": 547
   },
   {
    "url": "http://localhost:19315/phien?m=khong",
    "ma": 200,
    "loai": "document",
    "kt": 7324
   },
   {
    "url": "http://localhost:19315/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://localhost:19315/_next/static/chunks/1g4u_-dood-_4.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14721
   },
   {
    "url": "http://localhost:19315/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://localhost:19315/_next/static/chunks/0kqziy-7_gy73.js",
    "ma": 200,
    "loai": "script",
    "kt": 22335
   },
   {
    "url": "http://localhost:19315/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://localhost:19315/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://localhost:19315/_next/static/chunks/3iyb4ng08f76q.js",
    "ma": 200,
    "loai": "script",
    "kt": 57985
   },
   {
    "url": "http://localhost:19315/_next/static/chunks/395glp5--7qza.js",
    "ma": 200,
    "loai": "script",
    "kt": 181715
   },
   {
    "url": "http://localhost:19315/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://localhost:19315/api/me?i=1",
    "ma": 200,
    "loai": "xhr",
    "kt": 59
   },
   {
    "url": "http://localhost:19315/api/me?i=2",
    "ma": 200,
    "loai": "xhr",
    "kt": 59
   },
   {
    "url": "http://localhost:19315/api/me?i=3",
    "ma": 200,
    "loai": "xhr",
    "kt": 59
   },
   {
    "url": "http://localhost:19315/api/me?i=1",
    "ma": 401,
    "loai": "xhr",
    "kt": 24
   },
   {
    "url": "http://localhost:19315/api/me?i=2",
    "ma": 401,
    "loai": "xhr",
    "kt": 24
   },
   {
    "url": "http://localhost:19315/api/me?i=3",
    "ma": 401,
    "loai": "xhr",
    "kt": 24
   }
  ],
  "console": [
   {
    "kieu": "error",
    "chu": "Failed to load resource: the server responded with a status of 401 (Unauthorized)"
   },
   {
    "kieu": "error",
    "chu": "Failed to load resource: the server responded with a status of 401 (Unauthorized)"
   },
   {
    "kieu": "error",
    "chu": "Failed to load resource: the server responded with a status of 401 (Unauthorized)"
   }
  ],
  "ketQua": {
   "ngay sau đăng nhập ⇒": "#1 200 · #2 200 · #3 200",
   "6 giây sau, không refresh ⇒": "#1 401 · #2 401 · #3 401"
  }
 },
 "anh-nxj-15-5:loi": {
  "url": "http://localhost:19315/api/dem",
  "vp": [
   640,
   120
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://localhost:19315/api/dem",
    "ma": 200,
    "loai": "document",
    "kt": 39
   },
   {
    "url": "http://localhost:19315/api/login2",
    "ma": 200,
    "loai": "fetch",
    "kt": 23,
    "pt": "POST",
    "ctq": "application/json",
    "ct": "application/json",
    "than": "{\"name\":\"An\"}",
    "ms": 513,
    "ve": 517
   },
   {
    "url": "http://localhost:19315/phien?m=loi",
    "ma": 200,
    "loai": "document",
    "kt": 7324
   },
   {
    "url": "http://localhost:19315/_next/static/chunks/1g4u_-dood-_4.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14721
   },
   {
    "url": "http://localhost:19315/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://localhost:19315/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://localhost:19315/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://localhost:19315/_next/static/chunks/0kqziy-7_gy73.js",
    "ma": 200,
    "loai": "script",
    "kt": 22335
   },
   {
    "url": "http://localhost:19315/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://localhost:19315/_next/static/chunks/3iyb4ng08f76q.js",
    "ma": 200,
    "loai": "script",
    "kt": 57985
   },
   {
    "url": "http://localhost:19315/_next/static/chunks/395glp5--7qza.js",
    "ma": 200,
    "loai": "script",
    "kt": 181715
   },
   {
    "url": "http://localhost:19315/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://localhost:19315/api/me?i=1",
    "ma": 401,
    "loai": "xhr",
    "kt": 24
   },
   {
    "url": "http://localhost:19315/api/me?i=2",
    "ma": 401,
    "loai": "xhr",
    "kt": 24
   },
   {
    "url": "http://localhost:19315/api/me?i=3",
    "ma": 401,
    "loai": "xhr",
    "kt": 24
   },
   {
    "url": "http://localhost:19315/api/auth/refresh",
    "ma": 404,
    "loai": "xhr",
    "kt": 26,
    "pt": "POST",
    "ct": "application/json",
    "than": "",
    "ms": 7086,
    "ve": 7115
   },
   {
    "url": "http://localhost:19315/api/auth/refresh",
    "ma": 404,
    "loai": "xhr",
    "kt": 26,
    "pt": "POST",
    "ct": "application/json",
    "than": "",
    "ms": 7086,
    "ve": 7117
   },
   {
    "url": "http://localhost:19315/api/auth/refresh",
    "ma": 404,
    "loai": "xhr",
    "kt": 26,
    "pt": "POST",
    "ct": "application/json",
    "than": "",
    "ms": 7086,
    "ve": 7117
   }
  ],
  "console": [
   {
    "kieu": "error",
    "chu": "Failed to load resource: the server responded with a status of 401 (Unauthorized)"
   },
   {
    "kieu": "error",
    "chu": "Failed to load resource: the server responded with a status of 401 (Unauthorized)"
   },
   {
    "kieu": "error",
    "chu": "Failed to load resource: the server responded with a status of 401 (Unauthorized)"
   },
   {
    "kieu": "error",
    "chu": "Failed to load resource: the server responded with a status of 404 (Not Found)"
   },
   {
    "kieu": "error",
    "chu": "Failed to load resource: the server responded with a status of 404 (Not Found)"
   },
   {
    "kieu": "error",
    "chu": "Failed to load resource: the server responded with a status of 404 (Not Found)"
   }
  ],
  "ketQua": {
   "refresh trỏ route không tồn tại ⇒": "#1 401 · #2 401 · #3 401"
  }
 },
 "anh-nxj-15-5:mot": {
  "url": "http://localhost:19315/api/dem",
  "vp": [
   640,
   120
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://localhost:19315/api/dem",
    "ma": 200,
    "loai": "document",
    "kt": 67
   },
   {
    "url": "http://localhost:19315/api/login2",
    "ma": 200,
    "loai": "fetch",
    "kt": 23,
    "pt": "POST",
    "ctq": "application/json",
    "ct": "application/json",
    "than": "{\"name\":\"An\"}",
    "ms": 512,
    "ve": 516
   },
   {
    "url": "http://localhost:19315/phien?m=mot",
    "ma": 200,
    "loai": "document",
    "kt": 7324
   },
   {
    "url": "http://localhost:19315/_next/static/chunks/1g4u_-dood-_4.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14721
   },
   {
    "url": "http://localhost:19315/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://localhost:19315/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://localhost:19315/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://localhost:19315/_next/static/chunks/0kqziy-7_gy73.js",
    "ma": 200,
    "loai": "script",
    "kt": 22335
   },
   {
    "url": "http://localhost:19315/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://localhost:19315/_next/static/chunks/3iyb4ng08f76q.js",
    "ma": 200,
    "loai": "script",
    "kt": 57985
   },
   {
    "url": "http://localhost:19315/_next/static/chunks/395glp5--7qza.js",
    "ma": 200,
    "loai": "script",
    "kt": 181715
   },
   {
    "url": "http://localhost:19315/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://localhost:19315/api/me?i=1",
    "ma": 401,
    "loai": "xhr",
    "kt": 24
   },
   {
    "url": "http://localhost:19315/api/me?i=2",
    "ma": 401,
    "loai": "xhr",
    "kt": 24
   },
   {
    "url": "http://localhost:19315/api/me?i=3",
    "ma": 401,
    "loai": "xhr",
    "kt": 24
   },
   {
    "url": "http://localhost:19315/api/refresh",
    "ma": 401,
    "loai": "xhr",
    "kt": 42,
    "pt": "POST",
    "ct": "application/json",
    "than": "",
    "ms": 7086,
    "ve": 7088
   },
   {
    "url": "http://localhost:19315/api/refresh",
    "ma": 401,
    "loai": "xhr",
    "kt": 42,
    "pt": "POST",
    "ct": "application/json",
    "than": "",
    "ms": 7086,
    "ve": 7090
   },
   {
    "url": "http://localhost:19315/api/refresh",
    "ma": 200,
    "loai": "xhr",
    "kt": 11,
    "pt": "POST",
    "ct": "application/json",
    "than": "",
    "ms": 7085,
    "ve": 7090
   },
   {
    "url": "http://localhost:19315/api/me?i=1",
    "ma": 200,
    "loai": "xhr",
    "kt": 59
   },
   {
    "url": "http://localhost:19315/api/me?i=2",
    "ma": 401,
    "loai": "xhr",
    "kt": 24
   },
   {
    "url": "http://localhost:19315/api/me?i=1",
    "ma": 401,
    "loai": "xhr",
    "kt": 24
   },
   {
    "url": "http://localhost:19315/api/me?i=3",
    "ma": 401,
    "loai": "xhr",
    "kt": 24
   },
   {
    "url": "http://localhost:19315/api/refresh",
    "ma": 401,
    "loai": "xhr",
    "kt": 42,
    "pt": "POST",
    "ct": "application/json",
    "than": "",
    "ms": 14642,
    "ve": 14644
   },
   {
    "url": "http://localhost:19315/api/refresh",
    "ma": 401,
    "loai": "xhr",
    "kt": 42,
    "pt": "POST",
    "ct": "application/json",
    "than": "",
    "ms": 14642,
    "ve": 14645
   },
   {
    "url": "http://localhost:19315/api/refresh",
    "ma": 401,
    "loai": "xhr",
    "kt": 42,
    "pt": "POST",
    "ct": "application/json",
    "than": "",
    "ms": 14642,
    "ve": 14646
   }
  ],
  "console": [
   {
    "kieu": "error",
    "chu": "Failed to load resource: the server responded with a status of 401 (Unauthorized)"
   },
   {
    "kieu": "error",
    "chu": "Failed to load resource: the server responded with a status of 401 (Unauthorized)"
   },
   {
    "kieu": "error",
    "chu": "Failed to load resource: the server responded with a status of 401 (Unauthorized)"
   },
   {
    "kieu": "error",
    "chu": "Failed to load resource: the server responded with a status of 401 (Unauthorized)"
   },
   {
    "kieu": "error",
    "chu": "Failed to load resource: the server responded with a status of 401 (Unauthorized)"
   },
   {
    "kieu": "error",
    "chu": "Failed to load resource: the server responded with a status of 401 (Unauthorized)"
   },
   {
    "kieu": "error",
    "chu": "Failed to load resource: the server responded with a status of 401 (Unauthorized)"
   },
   {
    "kieu": "error",
    "chu": "Failed to load resource: the server responded with a status of 401 (Unauthorized)"
   },
   {
    "kieu": "error",
    "chu": "Failed to load resource: the server responded with a status of 401 (Unauthorized)"
   },
   {
    "kieu": "error",
    "chu": "Failed to load resource: the server responded with a status of 401 (Unauthorized)"
   },
   {
    "kieu": "error",
    "chu": "Failed to load resource: the server responded with a status of 401 (Unauthorized)"
   }
  ],
  "ketQua": {
   "mỗi 401 tự refresh (xoay vòng) ⇒": "#1 200 · #2 401 · #3 401",
   "6 giây sau, lần nữa ⇒": "#1 401 · #2 401 · #3 401"
  }
 },
 "anh-nxj-15-5:sf": {
  "url": "http://localhost:19315/api/dem",
  "vp": [
   640,
   120
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://localhost:19315/api/dem",
    "ma": 200,
    "loai": "document",
    "kt": 67
   },
   {
    "url": "http://localhost:19315/api/login2",
    "ma": 200,
    "loai": "fetch",
    "kt": 23,
    "pt": "POST",
    "ctq": "application/json",
    "ct": "application/json",
    "than": "{\"name\":\"An\"}",
    "ms": 513,
    "ve": 516
   },
   {
    "url": "http://localhost:19315/phien?m=sf",
    "ma": 200,
    "loai": "document",
    "kt": 7324
   },
   {
    "url": "http://localhost:19315/_next/static/chunks/1g4u_-dood-_4.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14721
   },
   {
    "url": "http://localhost:19315/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://localhost:19315/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://localhost:19315/_next/static/chunks/0kqziy-7_gy73.js",
    "ma": 200,
    "loai": "script",
    "kt": 22335
   },
   {
    "url": "http://localhost:19315/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://localhost:19315/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://localhost:19315/_next/static/chunks/3iyb4ng08f76q.js",
    "ma": 200,
    "loai": "script",
    "kt": 57985
   },
   {
    "url": "http://localhost:19315/_next/static/chunks/395glp5--7qza.js",
    "ma": 200,
    "loai": "script",
    "kt": 181715
   },
   {
    "url": "http://localhost:19315/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://localhost:19315/api/me?i=1",
    "ma": 401,
    "loai": "xhr",
    "kt": 24
   },
   {
    "url": "http://localhost:19315/api/me?i=2",
    "ma": 401,
    "loai": "xhr",
    "kt": 24
   },
   {
    "url": "http://localhost:19315/api/me?i=3",
    "ma": 401,
    "loai": "xhr",
    "kt": 24
   },
   {
    "url": "http://localhost:19315/api/refresh",
    "ma": 200,
    "loai": "xhr",
    "kt": 11,
    "pt": "POST",
    "ct": "application/json",
    "than": "",
    "ms": 7090,
    "ve": 7093
   },
   {
    "url": "http://localhost:19315/api/me?i=1",
    "ma": 200,
    "loai": "xhr",
    "kt": 59
   },
   {
    "url": "http://localhost:19315/api/me?i=3",
    "ma": 200,
    "loai": "xhr",
    "kt": 59
   },
   {
    "url": "http://localhost:19315/api/me?i=2",
    "ma": 200,
    "loai": "xhr",
    "kt": 59
   },
   {
    "url": "http://localhost:19315/api/me?i=1",
    "ma": 401,
    "loai": "xhr",
    "kt": 24
   },
   {
    "url": "http://localhost:19315/api/me?i=2",
    "ma": 401,
    "loai": "xhr",
    "kt": 24
   },
   {
    "url": "http://localhost:19315/api/me?i=3",
    "ma": 401,
    "loai": "xhr",
    "kt": 24
   },
   {
    "url": "http://localhost:19315/api/refresh",
    "ma": 200,
    "loai": "xhr",
    "kt": 11,
    "pt": "POST",
    "ct": "application/json",
    "than": "",
    "ms": 14648,
    "ve": 14650
   },
   {
    "url": "http://localhost:19315/api/me?i=1",
    "ma": 200,
    "loai": "xhr",
    "kt": 59
   },
   {
    "url": "http://localhost:19315/api/me?i=3",
    "ma": 200,
    "loai": "xhr",
    "kt": 59
   },
   {
    "url": "http://localhost:19315/api/me?i=2",
    "ma": 200,
    "loai": "xhr",
    "kt": 59
   }
  ],
  "console": [
   {
    "kieu": "error",
    "chu": "Failed to load resource: the server responded with a status of 401 (Unauthorized)"
   },
   {
    "kieu": "error",
    "chu": "Failed to load resource: the server responded with a status of 401 (Unauthorized)"
   },
   {
    "kieu": "error",
    "chu": "Failed to load resource: the server responded with a status of 401 (Unauthorized)"
   },
   {
    "kieu": "error",
    "chu": "Failed to load resource: the server responded with a status of 401 (Unauthorized)"
   },
   {
    "kieu": "error",
    "chu": "Failed to load resource: the server responded with a status of 401 (Unauthorized)"
   },
   {
    "kieu": "error",
    "chu": "Failed to load resource: the server responded with a status of 401 (Unauthorized)"
   }
  ],
  "ketQua": {
   "single-flight ⇒": "#1 200 · #2 200 · #3 200",
   "6 giây sau, lần nữa ⇒": "#1 200 · #2 200 · #3 200"
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, br, box, two, steps, kw, c, cmp, icards, path, seq, thucTe4 } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-15-5', code: 'NXJ 15.5', title: 'Token expiry and refresh (a real incident)', sub: 'Chapter 15 · Lesson 15.5' };
const O = (k) => { const v = DU_LIEU[`n15-5:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const A = (k) => { const v = DU_LIEU[`anh-nxj-15-5:${k}`]; if (!v) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const F = (p) => O(`file:${p}`).trim();
const doan = (k, dau) => { const ls = O(k).split('\n'); const i = ls.findIndex((l) => l.startsWith('$ ') && l.includes(dau)); if (i < 0) throw new Error('không thấy ' + dau + ' trong ' + k); const r = []; for (let j = i + 1; j < ls.length && !ls[j].startsWith('$ ') && !ls[j].startsWith('# '); j++) if (ls[j].trim() && !/^(\[|✓ Running)/.test(ls[j].trim())) r.push(ls[j]); return r; };
const B = (ten, o) => br('nxj-15-5', ten, { vp: 640, ...o });
const KQ = (k) => Object.values(A(k).ketQua);
const RF = (k, duong) => A(k).mang.filter((m) => m.url.endsWith(duong) && m.pt === 'POST').map((m) => m.ma);

// ── số đo (n15-5 · lab c15 · Next.js 16.4.6 · next start 19315 · Chromium)
const SETC = doan('het', 'login2')[0], ME1 = doan('het', 'curl -s -b jar')[0], ME2 = doan('het', "grep -E '^HTTP"), JAR = doan('het', 'grep -c token')[0];
const LOG_HET = O('het').split('\n').find((l) => /ERR_JWT_EXPIRED/.test(l));
const XO = ['refresh token #1', 'a copy of #1', 'the real owner'].map((d) => doan('xoay', d)[0]);
const NK = O('nhatky').split('\n').filter((l) => /^\[(refresh|auth\/refresh)\]/.test(l));
const iA = NK.findIndex((l) => l.startsWith('[auth/refresh]'));
const LOI_LOG = NK.slice(iA, iA + 3), MOT_LOG = NK.slice(iA + 3, iA + 9), SF_LOG = NK.slice(iA + 9, iA + 11);
const K0 = KQ('khong'), KL = KQ('loi'), KM = KQ('mot'), KS = KQ('sf');
const RL = RF('loi', '/api/auth/refresh'), RM = RF('mot', '/api/refresh'), RS = RF('sf', '/api/refresh');
const KHO = O('kho');
if (!/Max-Age=604800/.test(SETC) || !/"via":"cookie"/.test(ME1) || !/401/.test(ME2[0]) || JAR !== '1' || !LOG_HET) throw new Error('het đổi');
if (!/"ok":true/.test(XO[0]) || !/reuse detected/.test(XO[1]) || !/reuse detected/.test(XO[2])) throw new Error('xoay đổi');
if (K0.join() !== '#1 200 · #2 200 · #3 200,#1 401 · #2 401 · #3 401' || KL[0] !== '#1 401 · #2 401 · #3 401' || RL.join() !== '404,404,404') throw new Error('khong/loi đổi');
if (KM.join() !== '#1 200 · #2 401 · #3 401,#1 401 · #2 401 · #3 401' || RM.length !== 6 || RM.filter((x) => x === 200).length !== 1) throw new Error('mot đổi');
if (KS.join() !== '#1 200 · #2 200 · #3 200,#1 200 · #2 200 · #3 200' || RS.join() !== '200,200') throw new Error('sf đổi');
if (!LOI_LOG.every((l) => /→ 404/.test(l)) || !/200/.test(MOT_LOG[0]) || MOT_LOG.filter((l) => /reuse/.test(l)).length !== 5 || !SF_LOG.every((l) => /200/.test(l))) throw new Error('log đổi');

const PAGE = F('src/app/phien/page.tsx');
const INTER = PAGE.slice(PAGE.indexOf('function makeApi'), PAGE.indexOf('export default')).trim()
  .replace("  if (mode === 'khong') return api;                       // no refresh at all\n", '')
  .replace("  const url = mode === 'loi' ? '/api/auth/refresh' : '/api/refresh';\n  const refresh = () => axios.post(url).then(() => true, () => false);", "  const refresh = () => axios.post('/api/refresh').then(() => true, () => false);")
  .replace("  let inFlight: Promise<boolean> | null = null;\n", '')
  .replace(/    const ok = mode === 'sf'\n.*\n.*\n/, "    const ok = await refresh();                           // (single-flight: slide 10)\n");
if (!/original\._retried = true/.test(INTER) || !/inFlight \?\?= refresh\(\)/.test(PAGE) || /inFlight/.test(INTER)) throw new Error('interceptor đổi');
const REFRESH = F('src/app/api/refresh/route.ts')
  .replace(/res\.cookies\.set\('(token|rt)', (.*?), \{ (.*) \}\);/g, (_, k, v, o) => `res.cookies.set('${k}', ${v}, {\n    ${o},\n  });`)
  .replace("return NextResponse.json({ error: r.ok ? 'user gone' : r.why }, { status: 401 });", "return NextResponse.json(\n      { error: r.ok ? 'user gone' : r.why }, { status: 401 });").replace("import { dem } from '@/lib/kho';\n", '').replace("  dem('POST /api/refresh');\n", '').replace(/^\/\/ app\/api\/refresh\/route\.ts — .*\n/, '// app/api/refresh/route.ts\n').replace(/^ *console\.log\(.*\n/gm, '');
const ROT = F('src/lib/refresh.ts').split('\n').slice(F('src/lib/refresh.ts').split('\n').findIndex((l) => l.startsWith('export function rotateRefresh'))).join('\n')
  .replace('export function rotateRefresh(rt?: string): { ok: true; userId: number; next: string } | { ok: false; why: string } {', 'export function rotateRefresh(rt?: string):\n  | { ok: true; userId: number; next: string }\n  | { ok: false; why: string } {')
  .replace(/ +\/\/ .*$/gm, '').replace('  return { ok: true, userId: r.userId, next: issueRefresh(r.userId, r.family) };', '  return { ok: true, userId: r.userId,\n    next: issueRefresh(r.userId, r.family) };');
if (!/x\.used = true/.test(ROT)) throw new Error('rot đổi');

export const S = [
  { cover: true, nhan: 'Chapter 15 · Lesson 15.5', t: 'Token expiry<br>and refresh<br>(a real incident)', sub: 'Two clocks that disagree, a refresh route that never existed — measured: refresh-once-and-retry, rotation, and three 401s at once',
    en: 'Lesson fifteen point five: token expiry and refresh, with a real incident from this site. Two clocks that disagree, a refresh route that never existed. We measure refresh once and retry, rotation, and three 401s arriving at once.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Cookie lifetime and token expiry are <b>two different clocks</b></li>
    <li>The cuongthai.com incident: a refresh proxy to a route that did not exist</li>
    <li>The fix: a refresh endpoint + an interceptor that refreshes <b>once</b> and retries</li>
    <li>Rotation: a reused refresh token revokes the whole family</li>
    <li>Three 401s at once: ${RM.length / 2} refreshes log you out, <b>single-flight</b> keeps you in</li></ul>`,
    en: 'Five takeaways: cookie lifetime and token expiry are two different clocks; the cuongthai.com incident, a refresh proxy to a route that did not exist; the fix, a refresh endpoint plus an interceptor that refreshes once and retries; rotation, where a reused token revokes the family; and three 401s at once, where single-flight keeps you signed in.' },
  { t: 'Two clocks: the cookie and the token inside it', body: two(D(tn(["$ curl -si -c jar -X POST localhost:3000/api/login2 -d '{\"name\":\"An\",\"exp\":\"5s\"}'", SETC, '$ curl -s -b jar localhost:3000/api/me', ME1, '$ sleep 6', '$ curl -si -b jar localhost:3000/api/me', ...ME2, '$ grep -c token jar        # still there', JAR, '# server log', LOG_HET].join('\n'), { fs: 13, wrap: 60, title: 'curl (real)' })),
    D(cmp(['', 'Cookie', 'JWT inside it'], [['Lab', '<code>Max-Age=604800</code> (7 days)', '<code>exp</code> 5 s'], ['cuongthai.com (July)', '7 days', '<code>JWT_EXPIRES_IN="24h"</code>']]),
      box('Present, but worthless', 'The browser keeps sending a cookie whose token expired: the app looks signed in, every API call answers <b>401</b>. Users report "the site is broken", not "log me in again".', 'do2'),
      box('Test by moving the clock', 'A 5-second token reproduces a one-day bug in six seconds.', 'lam')), 'r56'),
    en: 'Two clocks: the cookie and the token inside it. Measured: the cookie lives seven days, the token five seconds. Six seconds later the cookie is still in the jar, and the API answers 401: JWT expired. On cuongthai.com it was a twenty-four hour token in a seven-day cookie.' },
  { t: 'The cuongthai.com incident (2 July 2026)', body: seq(['Browser', 'Next.js /api/auth/refresh', 'backend /api/v1/auth/refresh'], [
      [0, 1, 'POST (cookie: expired token)'], [1, 2, 'POST'], [2, 1, '404 — route not there', '#dc2626'], [1, 0, 'refresh failed', '#dc2626'],
    ], { rh: 36, top: 50 }) + two(D(tn(KHO.split('\n').slice(0, 8).join('\n'), { fs: 12, wrap: 70, title: 'git log (real)' })),
      D(box('Half of the fix existed for weeks', 'The frontend proxy route was added on 9 June; the backend route it called arrived on 2 July, with the 401 interceptor. In between, every refresh was a 404 — and every session died after a day.', 'do2')), 'r56'),
    en: 'The cuongthai.com incident. The frontend had a refresh proxy route since the ninth of June, but the backend route it called did not exist. Every refresh was a 404, so after twenty-four hours every authenticated call failed. The second of July commit added the backend route and the interceptor.' },
  { t: 'Measured: refreshing against a missing route', body: two(D(B('loi', { url: 'localhost:3000/phien?m=loi · 6 s after login', h: 60, w: 520 }),
      tn(['# Chromium · three API calls at once', `result: ${KL[0]}`, `POST /api/auth/refresh: ${RL.join(', ')}`, '# server log', ...LOI_LOG].join('\n'), { fs: 13, wrap: 60, title: 'Chromium + next start (real)' })),
    D(box('The interceptor did its job', 'Each 401 triggered a refresh and would have retried — but the refresh itself returned <b>404</b>, so the original 401 stands. A refresh path that has never been called successfully is not a refresh path.', 'do2'),
      box('Symptom to remember', '"I am clearly signed in, and everything is 401." Suspect an expired token inside a live cookie, plus a missing or broken refresh route.', 'lam')), 'r50'),
    en: 'Measured: refreshing against a missing route. Six seconds after login, three API calls: three 401s, three refresh calls answered 404, and the server log shows the upstream route was not found. The interceptor did its job; the refresh path was the hole.' },
  { t: 'Fix, part 1: a refresh endpoint', body: two(D(tsx(REFRESH, { sm: true, hl: [8, 15, 18] })),
    D(box('What it checks', 'A refresh token it issued, not spent, from a user who still exists. Then a new access token and a new refresh token — both <code>httpOnly</code>.', 'xanh'),
      box('Two tokens, two jobs', 'Access token: minutes, sent on every request — a leak expires fast. Refresh token: days, sent <b>only</b> to <code>/api/refresh</code> (cookie <code>path</code>).', 'lam')), 'r56'),
    en: 'Fix, part one: a refresh endpoint. It accepts a refresh token it issued, not yet spent, for a user who still exists, and answers with a new access token and a new refresh token, both httpOnly. The refresh cookie is only sent to the refresh path.' },
  { t: 'Fix, part 2: refresh once, then retry', body: two(D(tsx(INTER, { sm: true, hl: [6, 7, 10] })),
    D(box('Exactly once', '<code>_retried</code> marks the request. If the retry is 401 again, give up and go to login — a loop here hammers the server and logs everyone out.', 'do2'),
      box('Skip the auth routes', 'cuongthai.com also skips <code>/auth/*</code>, so a failing login or refresh never triggers another refresh.', 'lam')), 'r56'),
    en: 'Fix, part two: an interceptor that refreshes once, then retries the original request. The retried flag makes it exactly once: if the retry fails again, go to login. A loop here hammers the server and logs everyone out.' },
  { t: 'Rotation: a reused refresh token revokes the family', body: two(D(tsx(ROT, { sm: true, hl: [6, 7, 10] })),
    D(tn(['$ curl -b jar -c jar -X POST …/api/refresh          # #1', XO[0], '$ curl -b jar-copy -X POST …/api/refresh         # a copy of #1', XO[1], '$ curl -b jar -X POST …/api/refresh               # owner, with #2', XO[2]].join('\n'), { fs: 13, wrap: 44, title: 'curl (real)' }),
      box('Why revoke everything', 'A spent token coming back means two parties hold it. The server cannot tell thief from owner, so it ends the whole family; the owner signs in again.', 'lam')), 'r56'),
    en: 'Rotation: every refresh spends the old token and issues a new one in the same family. When a copy of a spent token comes back, the server cannot tell thief from owner, so it revokes the whole family. Measured: even the real owner is refused afterwards.' },
  { t: 'Measured: three 401s at once, each refreshing on its own', body: two(D(tn(['# Chromium · token expired · three API calls at once', `result:      ${KM[0]}`, `POST /api/refresh: ${RM.slice(0, 3).join(', ')}`, '# 6 s later, again', `result:      ${KM[1]}`, `POST /api/refresh: ${RM.slice(3).join(', ')}`, '# server log', ...MOT_LOG].join('\n'), { fs: 13, wrap: 60, title: 'Chromium + next start (real)' })),
    D(box('The refresh race', 'All three requests carry refresh token #1. The first wins and rotates it; the other two present a spent token — reuse detected, family revoked.', 'do2'),
      box('A false positive that logs users out', 'No thief, just three tabs of work at once — and six seconds later every call is 401 for good. Rotation without single-flight punishes ordinary users.', 'do2')), 'r50'),
    en: 'Measured: three 401s at once, each refreshing on its own, with rotation. Three refresh calls: one 200, two 401 for reuse. The page shows one success and two failures, and six seconds later everything is 401: the family was revoked. No thief, just a race.' },
  { t: 'Single-flight: one refresh, shared by every 401', body: two(D(tsx("let inFlight: Promise<boolean> | null = null;\n\n// inside the interceptor\nconst ok = await (inFlight ??= refresh()\n  .finally(() => { inFlight = null; }));", { sm: true, hl: [4] }),
      cmp(['Three 401s at once', 'each refreshes', 'single-flight'], [['refresh calls', String(RM.length / 2), String(RS.length / 2)], ['result', KM[0], KS[0]], ['6 s later', KM[1], KS[1]]])),
    D(tn(['# server log (single-flight, two rounds)', ...SF_LOG].join('\n'), { fs: 13, wrap: 56, title: 'next start (real)' }),
      box('Share the promise, not the result', 'The first 401 starts the refresh; the others await the same promise, then all three retry with the new token. Clear it in <code>finally</code> so the next expiry starts a fresh one.', 'xanh')), 'r56'),
    en: 'Single-flight: the first 401 starts one refresh, the others await the same promise, then all three retry. Measured: one refresh call, three 200s, and the same again six seconds later. Clear the promise in finally so the next expiry starts a new refresh.' },
  { t: 'cuongthai.com today', body: two(D(tn(KHO.split('\n').slice(8).join('\n'), { fs: 13, wrap: 64, title: 'repo (real)' })),
    D(box('What it does', 'One refresh in flight (<code>dangLamMoi</code>), retry once (<code>_retried</code>), cookie 30 days renewed on visits.', 'xanh'),
      box('What it does not do', 'There is no separate refresh token: the backend re-signs the same JWT with <code>ignoreExpiration</code>, capped at 30 days since <code>iat</code>. No rotation, so no reuse detection — a trade-off, not a bug.', 'lam')), 'r56'),
    en: 'cuongthai.com today: one refresh in flight, retry once, and a thirty-day cookie renewed on visits. There is no separate refresh token: the backend re-signs the same JWT ignoring expiry, capped at thirty days since it was issued. No rotation, so no reuse detection.' },
  { t: "Not learning in a vacuum: real life, what if, the attacker", to: true, body: thucTe4({ doi: ["🏦", "A bank app vs a social network", ["bank: signed out after a few idle minutes", "social network: refresh keeps you in for a month"]], neu: ["💻", "A refresh token leaks (internet-café PC)?", ["the thief uses it until it expires", "with rotation: reuse is detected, the whole family revoked"]], xau: ["🕵️", "XSS reads tokens · CSRF borrows cookies", ["localStorage: any script can read it", "another site sends requests with your cookie"]], phong: ["🛡️", "httpOnly · sameSite · a narrow path", ["rotation + reuse detection (+ single-flight)", "a 'sign out of all devices' button"]] }),
    en: "Real life: a banking app signs you out after a few idle minutes; a social network keeps you in for a month. Two ways of setting the clocks. What if a refresh token leaks — on an internet-café PC, or through a malicious browser extension? The thief can use it until it expires — unless it rotates. Attackers read tokens with injected script if they live in localStorage, or make your browser send cookies from another site (CSRF). Prevent it: httpOnly tokens, sameSite, a refresh cookie scoped to one path, rotation with reuse detection, and a 'sign out everywhere' button." },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Access token', 'minutes, every request'), kw('Refresh token', 'days, one path'), kw('401 Unauthorized', 'missing or expired'), kw('Interceptor', 'refresh once, retry'),
      kw('_retried', 'exactly once'), kw('Rotation', 'spend + reissue'), kw('Reuse detection', 'revoke the family'), kw('Single-flight', 'one shared refresh'),
      kw('Silent session death', 'cookie present, token dead'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: access token; refresh token; 401 unauthorized; interceptor; the retried flag; rotation; reuse detection; single-flight; and silent session death.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Give the access token ${c("exp: '5s'")} and watch protected calls turn 401`,
      `Point the refresh at a route that does not exist — reproduce the incident`,
      `Add ${c('/api/refresh')} + an interceptor: refresh once, retry`,
      `Fire three calls at once — with and without single-flight`,
    ]), box('Keep these', `<ul><li>Two clocks: keep them in one place</li><li>Refresh once, retry once, then login</li><li>Rotation needs single-flight</li><li>Test by moving the clock</li></ul>`, 'lam'), ''),
    en: 'Your turn: give the access token five seconds and watch calls turn 401; point the refresh at a missing route; add a refresh endpoint and an interceptor; then fire three calls at once, with and without single-flight.' },
];
export const slides = lamDeck({ chuong: 'Chapter 15 — Authentication, middleware, and cookies', bai: '15.5' }, S);
