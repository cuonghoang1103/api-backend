/*DU_LIEU*/
const DU_LIEU = {
 "n15-3:file:src/app/dashboard/page.tsx": "export const dynamic = 'force-dynamic';\nexport default function Dashboard() {\n  return <main className=\"p-4 text-lg\"><h1 className=\"font-bold\">Dashboard</h1></main>;\n}\n",
 "n15-3:file:src/app/login/page.tsx": "export default function Login() {\n  return <main className=\"p-4 text-lg\"><h1 id=\"t\" className=\"font-bold\">Log in</h1></main>;\n}\n",
 "n15-3:file:middleware.ts": "// middleware.ts (project root)\nimport { NextResponse } from 'next/server';\nexport function middleware(request) {\n  const token = request.cookies.get('token')?.value;\n  if (!token) {\n    return NextResponse.redirect(new URL('/login', request.url));\n  }\n  return NextResponse.next();   // allow through\n}\nexport const config = { matcher: ['/dashboard/:path*', '/settings/:path*'] };\n",
 "n15-3:bai": "# 1 · the lesson's file, exactly as written, at the project root\n$ npx next typegen >/dev/null 2>&1; npx tsc --noEmit\nmiddleware.ts(3,28): error TS7006: Parameter 'request' implicitly has an 'any' type.\n$ npm run build 2>&1 | grep -E 'Compiled|deprecat|Proxy|Middleware|/dashboard'\n✓ Compiled successfully in 2.2s\n├ ƒ /dashboard\nƒ Proxy (Middleware)\n$ curl -si localhost:3000/dashboard | head -1      # middleware.ts at the root, but the app lives in src/\nHTTP/1.1 307 Temporary Redirect\n# 2 · the same file moved into src/\n$ npm run build 2>&1 | grep -E 'Compiled|deprecat|Proxy|Middleware|/dashboard'\n⚠ The \"middleware\" file convention is deprecated. Please use \"proxy\" instead.\n✓ Compiled successfully in 1711ms\n├ ƒ /dashboard\nƒ Proxy (Middleware)\n$ curl -si localhost:3000/dashboard | grep -iE '^HTTP|^location'\nHTTP/1.1 307 Temporary Redirect\nlocation: /login",
 "n15-3:file:src/proxy.ts": "// src/proxy.ts — no matcher: every request goes through here\nimport { NextResponse, type NextRequest } from 'next/server';\n\nconst g = globalThis as unknown as { __n?: number };\n\nexport function proxy(request: NextRequest) {\n  g.__n = (g.__n ?? 0) + 1;\n  console.log(`[proxy] #${g.__n} ${request.method} ${request.nextUrl.pathname}`);\n  const guarded = /^\\/(dashboard|settings)(\\/|$)/.test(request.nextUrl.pathname);\n  if (guarded && !request.cookies.get('token')) {\n    return NextResponse.redirect(new URL('/login', request.url));\n  }\n  return NextResponse.next();\n}\n",
 "n15-3:file:src/app/settings2/page.tsx": "// app/settings2/page.tsx — a new admin page added later; nobody updated the matcher\nexport const dynamic = 'force-dynamic';\nexport default function Settings2() {\n  return <main className=\"p-4 text-lg\"><h1 className=\"font-bold\">Settings 2</h1><p id=\"s\">API key: sk-live-4f9a…</p></main>;\n}\n",
 "n15-3:file:src/app/pub/page.tsx": "// app/pub/page.tsx — a public page (logo, CSS, fonts, JS chunks)\nimport Image from 'next/image';\nexport default function Pub() {\n  return <main className=\"p-4 text-lg\"><Image src=\"/next.svg\" alt=\"\" width={90} height={20} /><p id=\"t\">public page</p></main>;\n}\n",
 "n15-3:proxy": "$ npx next typegen >/dev/null 2>&1; npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npm run build 2>&1 | grep -E 'Compiled|deprecat|Proxy|Middleware|/dashboard|/settings2|/pub'\n✓ Compiled successfully in 2.6s\n├ ƒ /dashboard\n├ ○ /pub\n└ ƒ /settings2\nƒ Proxy (Middleware)\n$ curl -si localhost:3000/dashboard                       # no cookie\nHTTP/1.1 307 Temporary Redirect\nlocation: /login\n$ curl -si localhost:3000/dashboard -H 'Cookie: token=abc'   # any value passes a presence check\nHTTP/1.1 307 Temporary Redirect\nx-runtime: nodejs 22.23.3\nlocation: /login?from=page\n$ curl -si localhost:3000/dashboard -H \"Cookie: token=$AN\"     # a real token\nHTTP/1.1 200\nx-runtime: nodejs 22.23.3\n$ curl -si localhost:3000/settings2                       # not in the matcher\nHTTP/1.1 200\nAPI key: sk-live-4f9a…\n✓ Running next.config.ts took 27ms\n[api] POST /api/login #1\n[proxy] #1 GET /dashboard\n[proxy] #2 GET /dashboard\n[auth] verify failed: ERR_JWS_INVALID\n[proxy] #3 GET /dashboard",
 "n15-3:dem1": "# Chromium loads /pub once (matcher: /dashboard, /settings) — proxy calls during that load:\n$ echo \"$(( $(cat /tmp/c15-sau) - $(cat /tmp/c15-truoc) )) lần proxy chạy\"; grep '\\[proxy\\]' ~/.rtq-nxj/nen-c15s.log | tail -n +$(( $(cat /tmp/c15-truoc) + 1 )) | sed -E 's/^.*\\[proxy\\] #[0-9]+ //' | sort | uniq -c | head\n0 lần proxy chạy",
 "n15-3:dem": "# same proxy WITHOUT a matcher: it now runs on every request (it still redirects only /dashboard and /settings)\n$ npm run build 2>&1 | grep -E 'Compiled|Proxy|rror'\n✓ Compiled successfully in 2.7s\nƒ Proxy (Middleware)",
 "n15-3:dem2": "# Chromium loads /pub once (NO matcher) — proxy calls during that load:\n$ echo \"$(( $(cat /tmp/c15-sau) - $(cat /tmp/c15-truoc) )) lần proxy chạy\"; grep '\\[proxy\\]' ~/.rtq-nxj/nen-c15s.log | tail -n +$(( $(cat /tmp/c15-truoc) + 1 )) | sed -E 's/^.*\\[proxy\\] #[0-9]+ //' | sort | uniq -c | head\n11 lần proxy chạy\n   1 GET /_next/static/chunks/092r-mewpaf3q.js\n   1 GET /_next/static/chunks/0i9bfanyibmja.js\n   1 GET /_next/static/chunks/0kqziy-7_gy73.js\n   1 GET /_next/static/chunks/395glp5--7qza.js\n   1 GET /_next/static/chunks/3qfy96eoyh-ek.js\n   1 GET /_next/static/chunks/3xofzmxl8husx.css\n   1 GET /_next/static/chunks/turbopack-2u1d16houkiyo.js\n   1 GET /_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2\n   1 GET /_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2\n   1 GET /next.svg",
 "n15-3:dung": "",
 "n15-3:kho": "$ ls src/middleware.ts src/proxy.ts 2>&1 | sed 's/^ls: //'\nsrc/proxy.ts: No such file or directory\nsrc/middleware.ts\n$ grep -n \"We can't verify the JWT signature\\|no \\`jsonwebtoken\\`/\\`jose\\`\" src/middleware.ts\n9: *   cookie during login. We can't verify the JWT signature in Edge\n10: *   runtime (no `jsonwebtoken`/`jose` available without a custom build),\n$ grep -n '\"jose\"' package.json\n71:    \"jose\": \"^6.2.3\",\n$ grep -n \"if (adminRole === '1')\" -A2 src/middleware.ts\n131:  if (adminRole === '1') {\n132-    return NextResponse.next();\n133-  }\n$ sed -n '/^export const config/,/^};/p' src/middleware.ts | grep -oE \"'/[^']*'\" | wc -l | sed 's/^ */mục trong matcher: /'\nmục trong matcher: 17",
 "n15-3:file:src/middleware.ts": "// src/middleware.ts — Next.js 14/15 file name; verifies the signature with jose\nimport { NextResponse, type NextRequest } from 'next/server';\nimport { jwtVerify } from 'jose';\n\nconst KEY = new TextEncoder().encode(process.env.AUTH_SECRET ?? 'lab-ch15-secret-at-least-32-bytes!!');\n\nexport async function middleware(request: NextRequest) {\n  const runtime = typeof (globalThis as { EdgeRuntime?: string }).EdgeRuntime === 'string' ? 'edge' : 'nodejs';\n  try {\n    const { payload } = await jwtVerify(request.cookies.get('token')?.value ?? '', KEY);\n    const res = NextResponse.next();\n    res.headers.set('x-check', `${runtime} | verified sub=${payload.sub}`);\n    return res;\n  } catch (e) {\n    const res = NextResponse.redirect(new URL('/login', request.url));\n    res.headers.set('x-check', `${runtime} | ${(e as { code?: string }).code}`);\n    return res;\n  }\n}\nexport const config = { matcher: ['/dashboard/:path*'] };\n",
 "n15-3:edge": "# the old file name (middleware.ts, Edge runtime) verifying the JWT with jose\n$ npm run build 2>&1 | grep -E 'Compiled|deprecat|Proxy|rror'\n⚠ The \"middleware\" file convention is deprecated. Please use \"proxy\" instead.\n✓ Compiled successfully in 2.5s\nƒ Proxy (Middleware)\n$ curl -si localhost:3000/dashboard -H \"Cookie: token=$AN\" | grep -iE '^HTTP|^x-check'\nHTTP/1.1 200 OK\nx-check: edge | verified sub=1\n$ curl -si localhost:3000/dashboard -H 'Cookie: token=abc' | grep -iE '^HTTP|^x-check'\nHTTP/1.1 307 Temporary Redirect\nx-check: edge | ERR_JWS_INVALID",
 "anh-nxj-15-3:dash-khach": {
  "url": "http://localhost:19310/dashboard",
  "vp": [
   640,
   120
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://localhost:19310/dashboard",
    "ma": 307,
    "loai": "document",
    "kt": 0
   },
   {
    "url": "http://localhost:19310/login",
    "ma": 200,
    "loai": "document",
    "kt": 6898
   },
   {
    "url": "http://localhost:19310/_next/static/chunks/3xofzmxl8husx.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14730
   },
   {
    "url": "http://localhost:19310/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://localhost:19310/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://localhost:19310/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
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
    "url": "http://localhost:19310/_next/static/chunks/395glp5--7qza.js",
    "ma": 200,
    "loai": "script",
    "kt": 181715
   },
   {
    "url": "http://localhost:19310/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   }
  ],
  "console": [],
  "ketQua": {
   "khách mở /dashboard ⇒": "/login"
  }
 },
 "anh-nxj-15-3:dash-gia": {
  "url": "http://localhost:19310/pub",
  "vp": [
   640,
   120
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://localhost:19310/pub",
    "ma": 200,
    "loai": "document",
    "kt": 7343
   },
   {
    "url": "http://localhost:19310/_next/static/chunks/3xofzmxl8husx.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14730
   },
   {
    "url": "http://localhost:19310/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://localhost:19310/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://localhost:19310/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://localhost:19310/_next/static/chunks/0kqziy-7_gy73.js",
    "ma": 200,
    "loai": "script",
    "kt": 22335
   },
   {
    "url": "http://localhost:19310/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://localhost:19310/_next/static/chunks/0i9bfanyibmja.js",
    "ma": 200,
    "loai": "script",
    "kt": 15725
   },
   {
    "url": "http://localhost:19310/next.svg",
    "ma": 200,
    "loai": "image",
    "kt": 1375
   },
   {
    "url": "http://localhost:19310/_next/static/chunks/395glp5--7qza.js",
    "ma": 200,
    "loai": "script",
    "kt": 181715
   },
   {
    "url": "http://localhost:19310/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://localhost:19310/dashboard",
    "ma": 307,
    "loai": "document",
    "kt": 0
   },
   {
    "url": "http://localhost:19310/login?from=page",
    "ma": 200,
    "loai": "document",
    "kt": 6898
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
    "url": "http://localhost:19310/_next/static/chunks/3xofzmxl8husx.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14730
   },
   {
    "url": "http://localhost:19310/_next/static/chunks/0kqziy-7_gy73.js",
    "ma": 200,
    "loai": "script",
    "kt": 22335
   },
   {
    "url": "http://localhost:19310/_next/static/chunks/395glp5--7qza.js",
    "ma": 200,
    "loai": "script",
    "kt": 181715
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
   "cookie token=abc ⇒": "/login?from=page"
  }
 },
 "anh-nxj-15-3:dash-an": {
  "url": "http://localhost:19310/pub",
  "vp": [
   640,
   120
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://localhost:19310/pub",
    "ma": 200,
    "loai": "document",
    "kt": 7343
   },
   {
    "url": "http://localhost:19310/_next/static/chunks/3xofzmxl8husx.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14730
   },
   {
    "url": "http://localhost:19310/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
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
    "url": "http://localhost:19310/_next/static/chunks/0i9bfanyibmja.js",
    "ma": 200,
    "loai": "script",
    "kt": 15725
   },
   {
    "url": "http://localhost:19310/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://localhost:19310/_next/static/chunks/395glp5--7qza.js",
    "ma": 200,
    "loai": "script",
    "kt": 181715
   },
   {
    "url": "http://localhost:19310/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://localhost:19310/next.svg",
    "ma": 200,
    "loai": "image",
    "kt": 1375
   },
   {
    "url": "http://localhost:19310/api/login",
    "ma": 200,
    "loai": "fetch",
    "kt": 0,
    "pt": "POST",
    "ctq": "application/json",
    "ct": "application/json",
    "than": "{\"name\":\"An\"}",
    "ms": 540,
    "ve": 545
   },
   {
    "url": "http://localhost:19310/dashboard",
    "ma": 200,
    "loai": "document",
    "kt": 6748
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
    "url": "http://localhost:19310/_next/static/chunks/3xofzmxl8husx.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14730
   },
   {
    "url": "http://localhost:19310/_next/static/chunks/0kqziy-7_gy73.js",
    "ma": 200,
    "loai": "script",
    "kt": 22335
   },
   {
    "url": "http://localhost:19310/_next/static/chunks/395glp5--7qza.js",
    "ma": 200,
    "loai": "script",
    "kt": 181715
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
   "token thật của An ⇒": "/dashboard · Dashboard · An"
  }
 },
 "anh-nxj-15-3:pub-matcher": {
  "url": "http://localhost:19310/api/me",
  "vp": [
   640,
   120
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://localhost:19310/api/me",
    "ma": 401,
    "loai": "document",
    "kt": 24
   },
   {
    "url": "http://localhost:19310/pub",
    "ma": 200,
    "loai": "document",
    "kt": 7343
   },
   {
    "url": "http://localhost:19310/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://localhost:19310/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://localhost:19310/_next/static/chunks/3xofzmxl8husx.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14730
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
    "url": "http://localhost:19310/next.svg",
    "ma": 200,
    "loai": "image",
    "kt": 1375
   },
   {
    "url": "http://localhost:19310/_next/static/chunks/0i9bfanyibmja.js",
    "ma": 200,
    "loai": "script",
    "kt": 15725
   },
   {
    "url": "http://localhost:19310/_next/static/chunks/395glp5--7qza.js",
    "ma": 200,
    "loai": "script",
    "kt": 181715
   },
   {
    "url": "http://localhost:19310/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   }
  ],
  "console": [
   {
    "kieu": "error",
    "chu": "Failed to load resource: the server responded with a status of 401 (Unauthorized)"
   }
  ]
 },
 "anh-nxj-15-3:pub-nomatcher": {
  "url": "http://localhost:19310/api/me",
  "vp": [
   640,
   120
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://localhost:19310/api/me",
    "ma": 401,
    "loai": "document",
    "kt": 24
   },
   {
    "url": "http://localhost:19310/pub",
    "ma": 200,
    "loai": "document",
    "kt": 7343
   },
   {
    "url": "http://localhost:19310/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://localhost:19310/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://localhost:19310/_next/static/chunks/3xofzmxl8husx.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14730
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
    "url": "http://localhost:19310/_next/static/chunks/0i9bfanyibmja.js",
    "ma": 200,
    "loai": "script",
    "kt": 15725
   },
   {
    "url": "http://localhost:19310/next.svg",
    "ma": 200,
    "loai": "image",
    "kt": 1375
   },
   {
    "url": "http://localhost:19310/_next/static/chunks/395glp5--7qza.js",
    "ma": 200,
    "loai": "script",
    "kt": 181715
   },
   {
    "url": "http://localhost:19310/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   }
  ],
  "console": [
   {
    "kieu": "error",
    "chu": "Failed to load resource: the server responded with a status of 401 (Unauthorized)"
   }
  ]
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, br, box, two, steps, kw, c, cmp, icards, path } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-15-3', code: 'NXJ 15.3', title: 'Middleware: gate requests before they reach a page', sub: 'Chapter 15 · Lesson 15.3' };
const O = (k) => { const v = DU_LIEU[`n15-3:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const A = (k) => { const v = DU_LIEU[`anh-nxj-15-3:${k}`]; if (!v) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const F = (p) => O(`file:${p}`).trim();
const bo = (s) => s.split('\n').filter((l) => !/^\/\/ (app|lib|src)\//.test(l)).join('\n');
const doan = (k, dau) => { const ls = O(k).split('\n'); const i = ls.findIndex((l) => l.startsWith('$ ') && l.includes(dau)); if (i < 0) throw new Error('không thấy ' + dau + ' trong ' + k); const r = []; for (let j = i + 1; j < ls.length && !ls[j].startsWith('$ ') && !ls[j].startsWith('# '); j++) if (ls[j].trim() && !/^(\[|✓ Running)/.test(ls[j].trim())) r.push(ls[j]); return r; };
const B = (ten, o) => br('nxj-15-3', ten, { vp: 640, ...o });

// ── số đo (n15-3 · lab c15 · Next.js 16.4.6 · next start · Chromium)
const BAI = O('bai').split('\n');
const TSC = BAI.filter((l) => /TS7006/.test(l));
const WARN = BAI.find((l) => /deprecated/.test(l));
const KHONG = doan('proxy', 'no cookie'), GIA = doan('proxy', 'presence check'), THAT = doan('proxy', 'a real token'), HO = doan('proxy', 'not in the matcher');
const E1 = doan('edge', 'token=$AN'), E2 = doan('edge', 'token=abc');
const dem = (k) => { const ls = O(k).split('\n'); return { n: Number((ls.find((l) => /^\d+ lần proxy chạy/.test(l)) || '').split(' ')[0]), ds: ls.filter((l) => /^\s+\d+ GET /.test(l)).map((l) => l.trim().replace(/^1 GET /, '')) }; };
const D1 = dem('dem1'), D2 = dem('dem2');
const KHO = O('kho');
const KQ = (k) => Object.values(A(k).ketQua)[0];
if (!TSC.length || !WARN || !/307/.test(KHONG[0]) || !/location: \/login$/.test(KHONG[1])) throw new Error('bai/proxy đổi');
if (!/x-runtime: nodejs 22/.test(GIA.join('\n')) || !/location: \/login\?from=page/.test(GIA.join('\n')) || !/200/.test(THAT[0]) || !/200/.test(HO[0]) || !/API key/.test(HO[1])) throw new Error('proxy đổi');
if (!/x-check: edge \| verified sub=1/.test(E1.join('\n')) || !/x-check: edge \| ERR_JWS_INVALID/.test(E2.join('\n'))) throw new Error('edge đổi');
if (D1.n !== 0 || D2.n < 8) throw new Error('đếm proxy đổi');
const PROXY = `import { NextResponse, type NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();   // allow through
}

export const config = {
  matcher: ['/dashboard/:path*', '/settings/:path*'],
};`;
const LESSON = `// middleware.ts (project root)
import { NextResponse } from 'next/server';
export function middleware(request) {
  const token = request.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();   // allow through
}
export const config = {
  matcher: ['/dashboard/:path*', '/settings/:path*'],
};`;

export const S = [
  { cover: true, nhan: 'Chapter 15 · Lesson 15.3', t: 'Middleware:<br>gate requests before<br>they reach a page', sub: 'Renamed proxy in Next.js 16 — measured: what it lets through, how often it runs, and what a matcher gap costs',
    en: 'Lesson fifteen point three: middleware, the code that gates requests before they reach a page. In Next.js sixteen it is renamed proxy. We measure what it lets through, how often it runs, and what a gap in the matcher costs.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>One file before every matching route: <code>middleware.ts</code> → <b><code>proxy.ts</code></b> in Next.js 16</li>
    <li>Three answers: <code>next()</code>, <code>redirect()</code>, <code>rewrite()</code></li>
    <li>The <b>matcher</b>: 0 vs 11 runs for one page load, measured</li>
    <li>A presence check lets <code>token=abc</code> through — the page must verify</li>
    <li>Runtime in 16: <b>Node.js</b>, not Edge — and jose verifies on Edge too</li></ul>`,
    en: 'Five takeaways: one file runs before every matching route, renamed proxy in Next.js sixteen; it answers next, redirect or rewrite; the matcher, zero versus eleven runs for one page load; a presence check lets a fake token through, so the page must verify; and the runtime in sixteen is Node.js.' },
  { t: 'Where it sits on a request', body: path([
      { t: 'Browser', s: 'GET /dashboard' }, { t: 'proxy.ts', s: 'matcher? cookie?', on: true }, { t: 'page / handler', s: 'the real check' }, { t: 'data', s: 'DB, API' },
    ], { nhan: ['request', 'next()', 'query'] }) + icards([
      ['check', 'NextResponse.next()', 'let it through (optionally with headers)'],
      ['link', 'NextResponse.redirect()', '307 + <code>Location</code> — the browser goes elsewhere'],
      ['loop', 'NextResponse.rewrite()', 'serve a different path, URL unchanged'],
    ], 3) + box('Before rendering, on every match', 'It sees only the request — path, headers, cookies — and returns a response or lets it continue. Cheap gates belong here; decisions about data do not.', 'lam'),
    en: 'Where it sits: between the browser and the route. It runs on every matching request before any rendering, sees only the request, and answers one of three ways: next, let it through; redirect, a 307 to another URL; or rewrite, serve a different path while the URL stays the same.' },
  { t: "The lesson's file in Next.js 16.4.6", body: two(D(tsx(LESSON, { sm: true, hl: [3] }), tn(['$ npx tsc --noEmit', ...TSC, '$ npm run build   # typed, moved into src/', WARN.trim()].join('\n'), { fs: 13, wrap: 54, title: 'tsc + next build (real)' })),
    D(cmp(['', 'Next.js 14 / 15', 'Next.js 16'], [['File', '<code>middleware.ts</code>', '<code>proxy.ts</code> (old name: deprecated, still runs)'], ['Function', '<code>export function middleware</code>', '<code>export function proxy</code>'], ['Runtime', 'Edge', '<b>Node.js</b> (measured: <code>nodejs 22.23.3</code>)']]),
      box('Two fixes for the snippet', '<code>request</code> needs a type (<code>NextRequest</code>) — <code>TS7006</code> otherwise. And on 16 rename the file and the function; the build warns until you do.', 'do2')), 'r50'),
    en: 'The lesson\'s file in Next.js sixteen point four point six. Pasted as is, request has no type: TS seven zero zero six. Typed and built, it still runs, but the build warns: the middleware file convention is deprecated, use proxy instead. In sixteen the file is proxy dot ts, the function is proxy, and it runs on Node.js.' },
  { t: 'Measured: what a presence check lets through', body: two(D(tsx(PROXY, { sm: true, hl: [5, 6, 7] })),
    D(tn(['$ curl -si localhost:3000/dashboard            # no cookie', ...KHONG, "$ curl -si localhost:3000/dashboard -H 'Cookie: token=abc'", ...GIA, '$ curl -si localhost:3000/dashboard -H "Cookie: token=$AN"', ...THAT].join('\n'), { fs: 13, wrap: 54, title: 'curl (real)' }),
      box('Read it', '<code>token=abc</code> sails <b>through</b> the proxy (it only asks "is there a cookie?"). The page\'s own <code>verifyJwt</code> stops it: <code>/login?from=page</code>. Without that second check, <code>abc</code> would have seen the dashboard.', 'do2')), 'r50'),
    en: 'Measured: what a presence check lets through. No cookie: the proxy answers 307 to login. A cookie saying token equals abc passes the proxy, because it only asks whether a cookie exists; the page\'s own verify catches it and redirects with from equals page. A real token: 200.' },
  { t: 'The same three visits in Chromium', body: `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px">${[['dash-khach', 'no cookie'], ['dash-gia', 'token=abc'], ['dash-an', "An's real token"]].map(([k, n]) => D(B(k, { url: `localhost:3000/dashboard · ${n}`, h: 120, w: 360 }), box(n, `ends at <code>${KQ(k).replace('/dashboard · ', '/dashboard</code> — <code>')}</code>`, k === 'dash-an' ? 'xanh' : 'do2'))).join('')}</div>`
    + cmp(['Gate', 'Asks', 'Cost of a mistake'], [['proxy (optimistic)', 'is there a cookie? does the signature match?', 'a confusing redirect'], ['page / action (authoritative)', 'who is this, and may they read THIS row?', 'a data leak']])
    + box('Two gates, two jobs', 'The proxy is the <b>optimistic</b> gate — it keeps honest visitors off pages they cannot use, early and cheaply. The page is the <b>authoritative</b> gate — it verifies the signature before reading any data.', 'lam'),
    en: 'The same three visits in Chromium. With no cookie, the browser ends at login. With token abc, it ends at login with from equals page: the page caught it. With An\'s real token, the dashboard. Two gates, two jobs: the proxy is optimistic, the page is authoritative.' },
  { t: 'Measured: the matcher decides how often it runs', body: two(D(tn(['# Chromium loads /pub once (a public page)', '# with  matcher: [\'/dashboard/:path*\', \'/settings/:path*\']', `${D1.n} proxy runs`, '# without a matcher', `${D2.n} proxy runs:`, ...D2.ds].join('\n'), { fs: 13, wrap: 64, title: 'proxy log (real)' })),
    D(box('Every asset goes through', `Without a matcher the proxy ran <b>${D2.n}</b> times for one public page: the HTML, the JS chunks, the CSS, two fonts, the logo. Each run is latency, and any redirect logic there can break assets.`, 'do2'),
      box('Keep it tight', 'List only the paths you gate. The docs pattern for "everything except assets" is a negative lookahead on <code>_next/static|_next/image|favicon.ico</code>.', 'xanh')), 'r56'),
    en: 'Measured: the matcher decides how often it runs. Loading one public page with the matcher: zero proxy runs. Without a matcher: eleven, for the HTML, every JavaScript chunk, the CSS, two fonts and the logo. Keep the matcher to the paths you gate.' },
  { t: 'Trap: a gap in the matcher is a public page', body: two(D(tn(['# added later: /settings2 — nobody updated the matcher', '$ curl -si localhost:3000/settings2', ...HO].join('\n'), { fs: 15, wrap: 56, title: 'curl (real)' }), tsx("export const config = {\n  matcher: ['/dashboard/:path*', '/settings/:path*'],\n};\n// '/settings/:path*' does NOT match '/settings2'", { sm: true, hl: [2] })),
    D(box('Quiet failure', 'No error, no warning: a new admin page that the matcher does not name is served to anyone — here, with an API key in the HTML.', 'do2'),
      box('So repeat the check where data is read', 'The layout that owns the segment, the page, every Server Action, every Route Handler (15.4). Duplication is the point: each check protects its own entry point.', 'xanh')), 'r50'),
    en: 'The trap: a gap in the matcher is a public page. A settings two page added later is not named by the matcher, so curl gets 200 with the API key in the HTML. No error, no warning. Repeat the real check where the data is read: in the layout, the page, every action.' },
  { t: '"It runs on the edge, so it cannot verify" — measured', body: two(D(tn(['# proxy.ts (Next.js 16)', ...GIA.filter((l) => /x-runtime/.test(l)), '# middleware.ts (old name, Edge runtime) + jose jwtVerify', '$ curl … -H "Cookie: token=$AN"', ...E1, "$ curl … -H 'Cookie: token=abc'", ...E2].join('\n'), { fs: 14, wrap: 58, title: 'curl (real)' })),
    D(box('Verifying a signature works everywhere', '<code>jose</code> runs on the Edge runtime: a real token ⇒ <code>verified sub=1</code>, a fake one ⇒ <code>ERR_JWS_INVALID</code>. A <b>signature</b> check is fine in a proxy.', 'xanh'),
      box('Looking things up is still the page\'s job', 'In 16 the proxy runs on Node.js and <i>could</i> query a database — but it runs on every matched request, before rendering. Session lookups, roles, ownership: near the data.', 'lam')), 'r50'),
    en: 'The lesson says middleware runs on the edge, so it cannot verify. Measured: in sixteen, proxy runs on Node.js twenty-two. And even the old middleware on the Edge runtime verifies a JWT with jose: a real token is verified, a fake one is rejected. A signature check is fine there; lookups still belong near the data.' },
  { t: 'cuongthai.com: an Edge middleware that trusts a role cookie', body: two(D(tn(KHO, { fs: 13, wrap: 66, title: 'frontend/ (real)' })),
    D(box('What the comment says', 'The middleware cannot verify the JWT on Edge "no jose available" — so <code>/admin</code> passes when <code>admin_role=1</code>.', 'lam'),
      box('What was measured', '<code>jose ^6.2.3</code> is already a dependency, and <code>jose</code> verifies on the Edge runtime (previous slide). A signature check here is possible.', 'do2'),
      box('Why it is still safe', 'The middleware is the optimistic gate; the admin data comes from the backend, which verifies <code>backend_token</code> on every call. Exactly the two-gate design of this lesson.', 'xanh')), 'r56'),
    en: 'cuongthai.com runs a Next.js fourteen Edge middleware with seventeen matcher entries. Its comment says the JWT cannot be verified on Edge because jose is not available, so admin passes on an admin role cookie. Measured: jose is already a dependency and verifies on Edge. It is still safe, because the backend verifies the token on every call.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('proxy.ts', 'Next.js 16 name'), kw('middleware.ts', 'old name, deprecated'), kw('matcher', 'which paths run it'), kw('next()', 'let through'),
      kw('redirect()', '307 + Location'), kw('rewrite()', 'other path, same URL'), kw('Optimistic check', 'cheap, early'), kw('Authoritative check', 'near the data'),
      kw('Runtime', 'Node.js (16) · Edge (old)'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: proxy dot ts, the Next.js sixteen name; middleware dot ts, the old one; matcher; next; redirect; rewrite; the optimistic check, cheap and early; the authoritative check, near the data; and runtime.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Write ${c('src/proxy.ts')} that redirects ${c('/dashboard')} without a cookie`,
      `Call it with ${c("Cookie: token=abc")} — then make the page verify`,
      `Remove the matcher; count proxy runs for one page load`,
      `Add ${c('/settings2')} and check whether anything protects it`,
    ]), box('Keep these', `<ul><li>Next.js 16: proxy.ts, function proxy</li><li>Presence ≠ validity</li><li>A tight matcher; a gap is public</li><li>Verify a signature anywhere; look up data near the data</li></ul>`, 'lam'), ''),
    en: 'Your turn: write a proxy that redirects the dashboard without a cookie; call it with a fake cookie and make the page verify; remove the matcher and count runs; add a page outside the matcher and see that nothing protects it. Keep: presence is not validity, and a gap in the matcher is public.' },
];
export const slides = lamDeck({ chuong: 'Chapter 15 — Authentication, middleware, and cookies', bai: '15.3' }, S);
