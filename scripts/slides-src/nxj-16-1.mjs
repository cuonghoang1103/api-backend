/*DU_LIEU*/
const DU_LIEU = {
 "n16-1:file:src/lib/signups.ts": "// lib/signups.ts — the \"database\" of sign-ups (globalThis: one copy per server process)\nexport type Signup = { name: string; email: string; via: string };\nconst g = globalThis as unknown as { __su?: Signup[] };\nexport const signups = () => (g.__su ??= []);\nexport function addSignup(s: Signup) { signups().push(s); console.log(`[signup] #${signups().length} ${s.email} via ${s.via}`); }\n// the server-side rule, the only one that protects you\nexport function checkSignup(name: unknown, email: unknown): string | null {\n  if (typeof name !== 'string' || name.trim().length < 2) return 'name: at least 2 characters';\n  if (typeof email !== 'string' || !/^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(email)) return 'email: not an email address';\n  return null;\n}\n",
 "n16-1:file:src/app/dk/actions.ts": "'use server';\n// app/dk/actions.ts — way A: a Server Action receives FormData\nimport { redirect } from 'next/navigation';\nimport { addSignup, checkSignup } from '@/lib/signups';\n\nexport async function signUp(formData: FormData) {\n  const name = formData.get('name'), email = formData.get('email');\n  const err = checkSignup(name, email);\n  if (err) redirect(`/dk/a?err=${encodeURIComponent(err)}`);\n  addSignup({ name: String(name), email: String(email), via: 'server action' });\n  redirect('/dk/ok');\n}\n",
 "n16-1:file:src/app/dk/a/page.tsx": "// app/dk/a/page.tsx — way A: <form action={serverAction}>, no client JavaScript of its own\nimport { signUp } from '../actions';\n\nexport default async function A({ searchParams }: { searchParams: Promise<{ err?: string }> }) {\n  const { err } = await searchParams;\n  return (\n    <main className=\"p-4 text-lg\">\n      <form action={signUp} className=\"flex gap-2\">\n        <input name=\"name\" placeholder=\"name\" className=\"border px-2\" />\n        <input name=\"email\" placeholder=\"email\" className=\"border px-2\" />\n        <button id=\"gui\" className=\"rounded border px-3\">Sign up</button>\n      </form>\n      {err && <p id=\"loi\" className=\"text-red-600\">{err}</p>}\n    </main>\n  );\n}\n",
 "n16-1:file:src/app/dk/b/page.tsx": "'use client';\n// app/dk/b/page.tsx — way B: a controlled client form, onSubmit + fetch\nimport { useState } from 'react';\nimport { useRouter } from 'next/navigation';\n\nexport default function B() {\n  const [name, setName] = useState('');\n  const [email, setEmail] = useState('');\n  const [err, setErr] = useState('');\n  const router = useRouter();\n  async function onSubmit(e: React.FormEvent) {\n    e.preventDefault();\n    if (!email.includes('@')) return setErr('email: not an email address');   // instant, in the browser\n    const r = await fetch('/api/dk', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name, email }) });\n    if (!r.ok) return setErr((await r.json()).error);\n    router.push('/dk/ok');\n  }\n  return (\n    <main className=\"p-4 text-lg\">\n      <form onSubmit={onSubmit} className=\"flex gap-2\">\n        <input name=\"name\" value={name} onChange={(e) => setName(e.target.value)} placeholder=\"name\" className=\"border px-2\" />\n        <input name=\"email\" value={email} onChange={(e) => { setEmail(e.target.value); setErr(''); }} placeholder=\"email\" className=\"border px-2\" />\n        <button id=\"gui\" className=\"rounded border px-3\">Sign up</button>\n      </form>\n      {err && <p id=\"loi\" className=\"text-red-600\">{err}</p>}\n    </main>\n  );\n}\n",
 "n16-1:file:src/app/api/dk/route.ts": "// app/api/dk/route.ts — the endpoint behind way B (it must check again)\nimport { addSignup, checkSignup } from '@/lib/signups';\nexport async function POST(req: Request) {\n  const { name, email } = await req.json().catch(() => ({}));\n  const err = checkSignup(name, email);\n  if (err) return Response.json({ error: err }, { status: 400 });\n  addSignup({ name, email, via: 'client fetch' });\n  return Response.json({ ok: true }, { status: 201 });\n}\n",
 "n16-1:file:src/app/dk/ok/page.tsx": "// app/dk/ok/page.tsx — who signed up so far\nimport { signups } from '@/lib/signups';\nexport const dynamic = 'force-dynamic';\nexport default function Ok() {\n  return <main className=\"p-4 text-lg\"><p id=\"n\">signed up: {signups().length}</p><ul>{signups().map((s, i) => <li key={i}>{s.email} · {s.via}</li>)}</ul></main>;\n}\n",
 "n16-1:lab": "$ npx next typegen >/dev/null 2>&1; npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npm run build 2>&1 | grep -E 'Compiled|/dk|/api/dk|rror'\n✓ Compiled successfully in 3.8s\n├ ƒ /api/dk\n├ ƒ /dk/a\n├ ○ /dk/b\n└ ƒ /dk/ok",
 "n16-1:may": "# the browser's check is only for honest users — talk to the endpoint directly\n$ curl -si -X POST localhost:3000/api/dk -d '{\"name\":\"x\",\"email\":\"no-at-sign\"}' | grep -E '^HTTP|error'\nHTTP/1.1 400 Bad Request\n{\"error\":\"name: at least 2 characters\"}\n$ curl -si -X POST localhost:3000/api/dk -d '{\"name\":\"An\",\"email\":\"an@lab.test\"}' | head -1\nHTTP/1.1 201 Created\n$ curl -s -X POST localhost:3000/api/dk -d '{\"name\":\"An\",\"email\":\"an@lab.test\",\"role\":\"admin\"}'   # extra fields?\n{\"ok\":true}",
 "n16-1:kho": "$ grep -nE '\"react-hook-form\"|\"zod\"|\"@hookform/resolvers\"' package.json\n35:    \"@hookform/resolvers\": \"^3.9.0\",\n87:    \"react-hook-form\": \"^7.53.0\",\n111:    \"zod\": \"^3.23.8\",\n$ grep -rlE \"useForm[<(]\" src | wc -l | sed 's/^ */tệp dùng useForm: /'\ntệp dùng useForm: 6\n$ grep -rl \"onSubmit\" src | wc -l | sed 's/^ */tệp có onSubmit: /'\ntệp có onSubmit: 133\n$ grep -rlE \"'use server'|\\\"use server\\\"\" src | wc -l | sed 's/^ */tệp có use server: /'\ntệp có use server: 0\n$ grep -rnE \"<form[^>]*action=\\{\" src | sed 's/^\\([^:]*:[0-9]*\\):.*\\(<form[^>]*\\)$/\\1: \\2/' | cut -c1-120\nsrc/components/admin/GithubAppAdmin.tsx:61:        <form ref={formRef} method=\"post\" action={form.action} className=\"hid",
 "n16-1:nhatky": "▲ Next.js 16.4.6\n- Local:         http://127.0.0.1:19316\n- Network:       http://127.0.0.1:19316\n✓ Ready in 91ms\n\n✓ Running next.config.ts took 21ms\n[signup] #1 an@lab.test via client fetch\n[signup] #2 an@lab.test via client fetch\n[signup] #3 lan@lab.test via server action\n[signup] #4 hoa@lab.test via server action\n[signup] #5 nam@lab.test via client fetch",
 "n16-1:dung": "",
 "anh-nxj-16-1:a-nojs-truoc": {
  "url": "http://localhost:19316/dk/a",
  "vp": [
   640,
   160
  ],
  "rect": {},
  "console": []
 },
 "anh-nxj-16-1:a-nojs": {
  "url": "http://localhost:19316/dk/a",
  "vp": [
   640,
   160
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://localhost:19316/dk/a",
    "ma": 200,
    "loai": "document",
    "kt": 7908
   },
   {
    "url": "http://localhost:19316/_next/static/chunks/0odaub_p-0fss.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14843
   },
   {
    "url": "http://localhost:19316/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://localhost:19316/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://localhost:19316/dk/a",
    "ma": 303,
    "loai": "document",
    "kt": 0,
    "pt": "POST",
    "ctq": "multipart/form-data; boundary=----WebKitFormBoundaryRjdmaUERDIaLv8Kc",
    "than": "------WebKitFormBoundaryRjdmaUERDIaLv8Kc\r\nContent-Disposition: form-data; name=\"$ACTION_ID_40c80e945f7f95403b5f7756a81aa71a0f629bca47\"\r\n\r\n\r\n------WebKitFormBoundaryRjdmaUERDIaLv8Kc\r\nContent-Disposition: form-data; name=\"name\"\r\n\r\nLan\r\n------WebKitFormBoundaryRjdmaUERDIaLv8Kc\r\nContent-Disposition: for",
    "ms": 682,
    "ve": 693
   },
   {
    "url": "http://localhost:19316/dk/ok",
    "ma": 200,
    "loai": "document",
    "kt": 7614
   },
   {
    "url": "http://localhost:19316/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 0
   },
   {
    "url": "http://localhost:19316/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 0
   },
   {
    "url": "http://localhost:19316/_next/static/chunks/0odaub_p-0fss.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14843
   }
  ],
  "console": [],
  "ketQua": {
   "JS tắt, form A ⇒": "/dk/ok · signed up: 3"
  }
 },
 "anh-nxj-16-1:b-nojs": {
  "url": "http://localhost:19316/dk/b",
  "vp": [
   640,
   160
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://localhost:19316/dk/b",
    "ma": 200,
    "loai": "document",
    "kt": 8058
   },
   {
    "url": "http://localhost:19316/_next/static/chunks/0odaub_p-0fss.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14843
   },
   {
    "url": "http://localhost:19316/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://localhost:19316/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://localhost:19316/dk/b?name=Minh&email=minh%40lab.test",
    "ma": 200,
    "loai": "document",
    "kt": 8058
   },
   {
    "url": "http://localhost:19316/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 0
   },
   {
    "url": "http://localhost:19316/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 0
   },
   {
    "url": "http://localhost:19316/_next/static/chunks/0odaub_p-0fss.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14843
   }
  ],
  "console": [],
  "ketQua": {
   "JS tắt, form B ⇒": "/dk/b?name=Minh&email=minh%40lab.test"
  }
 },
 "anh-nxj-16-1:a-cham": {
  "url": "http://localhost:19316/api/dem",
  "vp": [
   640,
   160
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://localhost:19316/api/dem",
    "ma": 200,
    "loai": "document",
    "kt": 2
   },
   {
    "url": "http://localhost:19316/dk/a",
    "ma": 200,
    "loai": "document",
    "kt": 7908
   },
   {
    "url": "http://localhost:19316/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://localhost:19316/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://localhost:19316/_next/static/chunks/0odaub_p-0fss.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14843
   },
   {
    "url": "http://localhost:19316/_next/static/chunks/1pcw6gskne7pf.js",
    "ma": 200,
    "loai": "script",
    "kt": 5600
   },
   {
    "url": "http://localhost:19316/_next/static/chunks/40wec9cq5kuxs.js",
    "ma": 200,
    "loai": "script",
    "kt": 31694
   },
   {
    "url": "http://localhost:19316/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://localhost:19316/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://localhost:19316/_next/static/chunks/2ijzw_0284lma.js",
    "ma": 200,
    "loai": "script",
    "kt": 166870
   },
   {
    "url": "http://localhost:19316/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://localhost:19316/dk/a",
    "ma": 303,
    "loai": "document",
    "kt": 0,
    "pt": "POST",
    "ctq": "multipart/form-data; boundary=----WebKitFormBoundaryjZhaKHpkLBcAIFB1",
    "than": "------WebKitFormBoundaryjZhaKHpkLBcAIFB1\r\nContent-Disposition: form-data; name=\"$ACTION_ID_40c80e945f7f95403b5f7756a81aa71a0f629bca47\"\r\n\r\n\r\n------WebKitFormBoundaryjZhaKHpkLBcAIFB1\r\nContent-Disposition: form-data; name=\"name\"\r\n\r\nHoa\r\n------WebKitFormBoundaryjZhaKHpkLBcAIFB1\r\nContent-Disposition: for",
    "ms": 4559,
    "ve": 4564
   },
   {
    "url": "http://localhost:19316/dk/ok",
    "ma": 200,
    "loai": "document",
    "kt": 7750
   },
   {
    "url": "http://localhost:19316/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://localhost:19316/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://localhost:19316/_next/static/chunks/0odaub_p-0fss.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14843
   },
   {
    "url": "http://localhost:19316/_next/static/chunks/1pcw6gskne7pf.js",
    "ma": 200,
    "loai": "script",
    "kt": 5600
   },
   {
    "url": "http://localhost:19316/_next/static/chunks/40wec9cq5kuxs.js",
    "ma": 200,
    "loai": "script",
    "kt": 31694
   },
   {
    "url": "http://localhost:19316/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://localhost:19316/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://localhost:19316/_next/static/chunks/2ijzw_0284lma.js",
    "ma": 200,
    "loai": "script",
    "kt": 166870
   },
   {
    "url": "http://localhost:19316/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   }
  ],
  "console": [],
  "ketQua": {
   "JS chậm 4 s, bấm ngay, form A ⇒": "/dk/ok · signed up: 4"
  }
 },
 "anh-nxj-16-1:b-cham": {
  "url": "http://localhost:19316/api/dem",
  "vp": [
   640,
   160
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://localhost:19316/api/dem",
    "ma": 200,
    "loai": "document",
    "kt": 2
   },
   {
    "url": "http://localhost:19316/dk/b",
    "ma": 200,
    "loai": "document",
    "kt": 8058
   },
   {
    "url": "http://localhost:19316/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://localhost:19316/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://localhost:19316/_next/static/chunks/0odaub_p-0fss.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14843
   },
   {
    "url": "http://localhost:19316/_next/static/chunks/1pcw6gskne7pf.js",
    "ma": 200,
    "loai": "script",
    "kt": 5600
   },
   {
    "url": "http://localhost:19316/_next/static/chunks/40wec9cq5kuxs.js",
    "ma": 200,
    "loai": "script",
    "kt": 31694
   },
   {
    "url": "http://localhost:19316/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://localhost:19316/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://localhost:19316/_next/static/chunks/0ejhg2wbcthbs.js",
    "ma": 200,
    "loai": "script",
    "kt": 1146
   },
   {
    "url": "http://localhost:19316/_next/static/chunks/2ijzw_0284lma.js",
    "ma": 200,
    "loai": "script",
    "kt": 166870
   },
   {
    "url": "http://localhost:19316/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 0
   },
   {
    "url": "http://localhost:19316/dk/b?name=Tuan&email=tuan%40lab.test",
    "ma": 200,
    "loai": "document",
    "kt": 8058
   },
   {
    "url": "http://localhost:19316/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://localhost:19316/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://localhost:19316/_next/static/chunks/0odaub_p-0fss.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14843
   },
   {
    "url": "http://localhost:19316/_next/static/chunks/1pcw6gskne7pf.js",
    "ma": 200,
    "loai": "script",
    "kt": 5600
   },
   {
    "url": "http://localhost:19316/_next/static/chunks/40wec9cq5kuxs.js",
    "ma": 200,
    "loai": "script",
    "kt": 31694
   },
   {
    "url": "http://localhost:19316/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://localhost:19316/_next/static/chunks/0ejhg2wbcthbs.js",
    "ma": 200,
    "loai": "script",
    "kt": 1146
   },
   {
    "url": "http://localhost:19316/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://localhost:19316/_next/static/chunks/2ijzw_0284lma.js",
    "ma": 200,
    "loai": "script",
    "kt": 166870
   },
   {
    "url": "http://localhost:19316/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   }
  ],
  "console": [],
  "ketQua": {
   "JS chậm 4 s, bấm ngay, form B ⇒": "/dk/b?name=Tuan&email=tuan%40lab.test"
  }
 },
 "anh-nxj-16-1:b-js-loi": {
  "url": "http://localhost:19316/dk/b",
  "vp": [
   640,
   160
  ],
  "rect": {},
  "console": []
 },
 "anh-nxj-16-1:b-js": {
  "url": "http://localhost:19316/dk/b",
  "vp": [
   640,
   160
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://localhost:19316/dk/b",
    "ma": 200,
    "loai": "document",
    "kt": 8058
   },
   {
    "url": "http://localhost:19316/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://localhost:19316/_next/static/chunks/0odaub_p-0fss.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14843
   },
   {
    "url": "http://localhost:19316/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://localhost:19316/_next/static/chunks/1pcw6gskne7pf.js",
    "ma": 200,
    "loai": "script",
    "kt": 5600
   },
   {
    "url": "http://localhost:19316/_next/static/chunks/40wec9cq5kuxs.js",
    "ma": 200,
    "loai": "script",
    "kt": 31694
   },
   {
    "url": "http://localhost:19316/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://localhost:19316/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://localhost:19316/_next/static/chunks/0ejhg2wbcthbs.js",
    "ma": 200,
    "loai": "script",
    "kt": 1146
   },
   {
    "url": "http://localhost:19316/_next/static/chunks/2ijzw_0284lma.js",
    "ma": 200,
    "loai": "script",
    "kt": 166870
   },
   {
    "url": "http://localhost:19316/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://localhost:19316/api/dk",
    "ma": 201,
    "loai": "fetch",
    "kt": 11,
    "pt": "POST",
    "ctq": "application/json",
    "ct": "application/json",
    "than": "{\"name\":\"Nam\",\"email\":\"nam@lab.test\"}",
    "ms": 1129,
    "ve": 1139
   },
   {
    "url": "http://localhost:19316/dk/ok?_rsc=DEh4Fs0QciCAo-XY",
    "ma": 200,
    "loai": "fetch",
    "kt": 2290
   }
  ],
  "console": [],
  "ketQua": {
   "JS bật, email sai ⇒": "email: not an email address",
   "JS bật, sửa email ⇒": "/dk/ok · signed up: 5"
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, br, box, two, steps, kw, c, cmp, icards, thucTe4 } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-16-1', code: 'NXJ 16.1', title: 'Two ways to build a form', sub: 'Chapter 16 · Lesson 16.1' };
const O = (k) => { const v = DU_LIEU[`n16-1:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const A = (k) => { const v = DU_LIEU[`anh-nxj-16-1:${k}`]; if (!v) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const F = (p) => O(`file:${p}`).trim();
const doan = (k, dau) => { const ls = O(k).split('\n'); const i = ls.findIndex((l) => l.startsWith('$ ') && l.includes(dau)); if (i < 0) throw new Error('không thấy ' + dau + ' trong ' + k); const r = []; for (let j = i + 1; j < ls.length && !ls[j].startsWith('$ ') && !ls[j].startsWith('# '); j++) if (ls[j].trim() && !/^(\[|✓ Running)/.test(ls[j].trim())) r.push(ls[j]); return r; };
const B = (ten, o) => br('nxj-16-1', ten, { vp: 640, ...o });
const KQ = (k) => Object.values(A(k).ketQua);
const MANG = (k) => A(k).mang.filter((m) => !/\/_next\/|\/api\/dem/.test(m.url)).map((m) => `${m.pt || 'GET'} ${m.url.replace(/^http:\/\/localhost:19316/, '')} → ${m.ma}`);

// ── số đo (n16-1 · lab c16 · Next.js 16.4.6 · next start 19316 · Chromium)
const BUILD = O('lab').split('\n').filter((l) => /\/dk/.test(l));
const MAY0 = doan('may', 'no-at-sign'), MAY1 = doan('may', 'an@lab.test"}\' | head');
const LOG = O('nhatky').split('\n').filter((l) => /^\[signup\]/.test(l));
const KHO = O('kho');
const ANJ = KQ('a-nojs')[0], BNJ = KQ('b-nojs')[0], ACH = KQ('a-cham')[0], BCH = KQ('b-cham')[0], BJS = KQ('b-js');
if (!/^\/dk\/ok · signed up/.test(ANJ) || !/^\/dk\/b\?name=Minh&email=minh%40lab\.test$/.test(BNJ) || !/^\/dk\/ok/.test(ACH) || !/^\/dk\/b\?name=Tuan/.test(BCH)) throw new Error('kết quả JS tắt/chậm đổi');
if (BJS[0] !== 'email: not an email address' || !/^\/dk\/ok/.test(BJS[1])) throw new Error('b-js đổi');
if (!/400/.test(MAY0[0]) || !/201/.test(MAY1[0]) || LOG.length !== 5) throw new Error('may/log đổi');
if (!BUILD.some((l) => /○ \/dk\/b/.test(l)) || !BUILD.some((l) => /ƒ \/dk\/a/.test(l))) throw new Error('build đổi');
if (MANG('b-js').filter((m) => /POST/.test(m)).length !== 1) throw new Error('b-js mạng đổi');

const FA = F('src/app/dk/a/page.tsx').split('\n').filter((l) => !/^\/\/ app/.test(l)).join('\n').replace(/ className="[^"]*"/g, '');
const ACT = F('src/app/dk/actions.ts').split('\n').filter((l) => !/^\/\/ app/.test(l)).join('\n').replace("addSignup({ name: String(name), email: String(email), via: 'server action' });", "addSignup({ name: String(name), email: String(email),\n             via: 'server action' });");
if (!/via: 'server action'/.test(ACT)) throw new Error('ACT đổi');
const FB = F('src/app/dk/b/page.tsx').split('\n').filter((l) => !/^\/\/ app/.test(l)).join('\n').replace(/ className="[^"]*"/g, '')
  .replace("    if (!email.includes('@')) return setErr('email: not an email address');   // instant, in the browser", "    if (!email.includes('@'))                       // instant, in the browser\n      return setErr('email: not an email address');")
  .replace("    const r = await fetch('/api/dk', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name, email }) });", "    const r = await fetch('/api/dk', {\n      method: 'POST', body: JSON.stringify({ name, email }), … });")
  .replace(/<input name="name" value=\{name\} onChange=\{[^}]*\}\} /, '<input name="name" value={name} onChange={…} ')
  .replace(/<input name="email" value=\{email\} onChange=\{[^}]*\}\} /, '<input name="email" value={email} onChange={…} ');
const ex = (src, a, b) => { const ls = src.split('\n'); const i = ls.findIndex((l) => l.includes(a)), j = ls.findIndex((l, k) => k > i && l.includes(b)); if (i < 0 || j < 0) throw new Error('không cắt được ' + a); const sp = ls[i].match(/^ */)[0].length; return ls.slice(i, j + 1).map((l) => l.slice(sp)).join('\n'); };
const FA_HIEN = ex(FA, '<form action={signUp}>', '</form>');
const FB_HIEN = ("'use client';\n// … useState for name, email, err; useRouter\n" + ex(FB, 'async function onSubmit', 'router.push') + '\n}\n// <form onSubmit={onSubmit}> + controlled inputs').replace(/ {3,}\/\/ /g, '   // ');
if (!/e\.preventDefault\(\)/.test(FB_HIEN)) throw new Error('FB đổi');

export const S = [
  { cover: true, nhan: 'Chapter 16 · Lesson 16.1', t: 'Two ways<br>to build a form', sub: 'A Server Action form and a client form — measured with JavaScript on, off, and slow',
    en: 'Chapter sixteen, lesson one: two ways to build a form. A Server Action form and a client form, measured with JavaScript on, off, and slow.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li><b>A</b>: <code>&lt;form action={serverAction}&gt;</code> — FormData straight to the server</li>
    <li><b>B</b>: a controlled client form — <code>onSubmit</code> + <code>fetch</code>, instant feedback</li>
    <li>JavaScript off or slow: A still signs you up; B sends a <b>GET</b> with the data in the URL</li>
    <li>The server check is mandatory: <code>curl</code> skips the browser's check</li>
    <li>They combine: a client form that submits to a Server Action</li></ul>`,
    en: 'Five takeaways: way A, a form whose action is a Server Action; way B, a controlled client form with onSubmit and fetch; with JavaScript off or slow, A still works while B sends a GET with the data in the URL; the server check is mandatory; and the two combine.' },
  { t: 'Two forms, the same sign-up', body: cmp(['', 'A · Server Action form', 'B · client form'], [
      ['How it submits', 'the browser POSTs FormData; React upgrades it when ready', '<code>onSubmit</code> → <code>preventDefault()</code> → <code>fetch</code>'],
      ['Client JavaScript of its own', 'none — the page builds as <code>ƒ /dk/a</code>', 'a Client Component — <code>○ /dk/b</code>'],
      ['Feedback while typing', 'after the round trip', '<b>instant</b>, per field'],
      ['Before hydration / no JS', 'works (measured)', 'native <b>GET</b> to the same URL (measured)'],
      ['Best for', '"send this data": create, edit, delete', 'the form is a small app: live checks, dependent fields, wizards'],
    ]) + box('The question to ask', 'What must happen <b>while the user types</b>? Nothing special ⇒ A. Live checks, fields that depend on each other, several steps ⇒ B.', 'lam'),
    en: 'Two forms for the same sign-up. A: the browser posts FormData, and React upgrades it when ready; no client JavaScript of its own. B: onSubmit, preventDefault, fetch; instant feedback per field. Ask what must happen while the user types.' },
  { t: 'Way A: a Server Action receives FormData', body: two(D(tsx(ACT, { sm: true, hl: [5, 7, 8] }), tsx('// app/dk/a/page.tsx — no \'use client\'\n' + FA_HIEN, { sm: true, hl: [2] })),
    D(B('a-nojs-truoc', { url: 'localhost:3000/dk/a · JS OFF', h: 70, w: 420 }),
      tn(['# Chromium, JavaScript disabled', ...MANG('a-nojs'), `⇒ ${ANJ}`].join('\n'), { fs: 13, wrap: 44, title: 'Chromium (real)' }),
      box('It works with no JavaScript at all', 'The browser POSTs the form natively; the action runs, redirects with <b>303</b>, and the sign-up is stored.', 'xanh')), 'r64'),
    en: 'Way A: the Server Action receives FormData, checks it on the server, stores it and redirects. Measured in Chromium with JavaScript disabled: a native POST, a 303 redirect, and the sign-up is stored.' },
  { t: 'Way B: a controlled client form', body: two(D(tsx(FB_HIEN, { sm: true, hl: [4, 5, 6] })),
    D(B('b-js-loi', { url: 'localhost:3000/dk/b · bad email', h: 70, w: 420 }),
      tn([`# JS on, email "nam-at-lab": ${BJS[0]}`, '# network during that click: nothing', '# fixed email, click again:', ...MANG('b-js').slice(1), `⇒ ${BJS[1]}`].join('\n'), { fs: 13, wrap: 44, title: 'Chromium (real)' }),
      box('Instant feedback', 'The wrong email is caught in the browser with <b>no request</b>; the fixed one goes to <code>/api/dk</code> (201).', 'xanh')), 'r64'),
    en: 'Way B: a controlled client form. Every keystroke is state, onSubmit prevents the default, checks the email in the browser and fetches. Measured: a wrong email is caught with no request at all; the fixed one is created, 201.' },
  { t: 'Measured: JavaScript off', body: two(D(tn(['# form A, JavaScript disabled', ...MANG('a-nojs'), `⇒ ${ANJ}`, '', '# form B, JavaScript disabled', ...MANG('b-nojs'), `⇒ ${BNJ}`].join('\n'), { fs: 14, wrap: 60, title: 'Chromium (real)' })),
    D(box('A: signed up', 'A native POST to the action, then the redirect.', 'xanh'),
      box('B: a GET, with the data in the URL', `With no handler attached, the browser submits the form its own way: <b>GET</b> to the same page, fields in the query string. Nothing is stored — and a password field would sit in the address bar, the history and the server logs.`, 'do2')), 'r56'),
    en: 'Measured with JavaScript off. Form A: a native POST and a redirect, signed up. Form B: no handler is attached, so the browser submits the form its own way, a GET to the same page with the fields in the URL. Nothing is stored, and a password would sit in the address bar.' },
  { t: 'Measured: JavaScript slow (4 s), click at once', body: two(D(tn(['# every JS chunk delayed 4 s; fill and click right away', '# form A', ...MANG('a-cham'), `⇒ ${ACH}`, '', '# form B', ...MANG('b-cham'), `⇒ ${BCH}`].join('\n'), { fs: 14, wrap: 60, title: 'Chromium (real)' })),
    D(box('Not a rare case', 'A slow phone, a slow network, a big bundle: the page is visible seconds before <code>onSubmit</code> exists. Users fill and click in that gap.', 'lam'),
      box('A has no gap', 'Before hydration the browser posts natively; after hydration React does it. Either way the action runs once.', 'xanh'),
      box('B leaks during the gap', 'The click lands before the handler: a GET with the name and email in the URL, nothing stored.', 'do2')), 'r56'),
    en: 'Measured with JavaScript slowed down four seconds, clicking at once. Form A: a native POST, signed up. Form B: the click lands before the handler exists, so again a GET with the data in the URL. A slow phone is not a rare case.' },
  { t: "The server check is mandatory", body: two(D(tn([`$ curl -si -X POST localhost:3000/api/dk -d '{"name":"x","email":"no-at-sign"}'`, ...MAY0, `$ curl -si -X POST localhost:3000/api/dk -d '{"name":"An","email":"an@lab.test"}'`, ...MAY1, '# server log', ...LOG].join('\n'), { fs: 14, wrap: 60, title: 'curl + next start (real)' })),
    D(box('The browser check is a courtesy', 'It helps honest users. <code>curl</code>, a script, DevTools — anything that reaches the endpoint skips it.', 'lam'),
      box('So check again on the server', 'The same rules in the action and in the route handler. Lesson 16.3 makes it one Zod schema used on both sides.', 'xanh')), 'r56'),
    en: 'The server check is mandatory. curl talks to the endpoint directly and skips the browser: a bad body gets 400 only because the route handler checks again. The browser check is a courtesy for honest users.' },
  { t: 'They combine: a rule of thumb', body: steps([
      `Simple submit or mutation, must work without JS → ${c('<form action={serverAction}>')}`,
      `Rich, interactive form → a client library (react-hook-form, 16.2) that submits to an action or a route handler`,
      `Either way → validate on the server, ideally with one shared schema (Zod, 16.3)`,
    ]) + icards([
      ['check', 'Client check', 'fast feedback, never trusted'],
      ['lock', 'Server check', 'the one that protects you'],
      ['bolt', 'Hybrid', 'client UX + Server Action write'],
    ], 3),
    en: 'A rule of thumb. A simple submit that must work without JavaScript: a Server Action form. A rich, interactive form: a client library that submits to an action or a route handler. Either way: validate on the server, ideally with one shared schema.' },
  { t: 'cuongthai.com: 133 client forms, 0 Server Actions', body: two(D(tn(KHO, { fs: 13, wrap: 66, title: 'frontend/ (real)' })),
    D(box('All client forms', 'The Next.js app has no <code>\'use server\'</code> at all: every form is a client form that calls the Express backend — which checks everything again.', 'lam'),
      box('react-hook-form + Zod are installed', 'Used by six forms: login, register, password reset and change, and a game editor. The one <code>&lt;form action&gt;</code> found posts to GitHub, not to an action.', 'xanh')), 'r56'),
    en: 'cuongthai.com: about one hundred thirty client forms and no Server Action at all; every form calls the Express backend, which checks again. react-hook-form and Zod are installed and used by six forms, such as login and register.' },
  { t: "Not learning in a vacuum: real life, what if, the attacker", to: true, body: thucTe4({ doi: ["📶", "Flaky dorm Wi-Fi", ["the page shows, its JavaScript has not arrived", "you press Submit right then"]], neu: ["🔑", "A client-style sign-in form, submitted early?", ["<code>?password=…</code> lands in the URL", "shared-PC history · campus network logs"]], xau: ["🛠️", "DevTools / curl skip the browser", ["send straight to the endpoint", "client-side checks stop nothing"]], phong: ["🛡️", "<code>method=\"post\"</code> + check on the server", ["client forms still declare method/action", "the real rules live on the server"]] }),
    en: "Real life: you fill a sign-up form on your phone in the dorm, the network flickers, and you press submit before the page has finished loading. What if that is a sign-in form built the client way? The password lands in the address bar, in a shared computer's history and in the campus network logs. An attacker needs no browser: DevTools or curl skips every check that runs in the browser. Prevent it: give client forms method=\"post\", and always check again on the server." },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Server Action form', '&lt;form action={fn}&gt;'), kw('FormData', 'what the browser posts'), kw('Client form', 'onSubmit + fetch'), kw('Controlled input', 'value + onChange'),
      kw('Progressive enhancement', 'works before JS'), kw('Hydration gap', 'visible, not yet interactive'), kw('Native GET', 'a form with no handler'), kw('Server check', 'the one that protects you'),
      kw('Hybrid', 'client UX, server write'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: Server Action form; FormData; client form; controlled input; progressive enhancement; the hydration gap; the native GET of a form with no handler; the server check; and the hybrid.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Build the same sign-up twice: ${c('<form action>')} and ${c('onSubmit + fetch')}`,
      `Disable JavaScript (DevTools ⌘⇧P → "Disable JavaScript") and submit both`,
      `Throttle to "Slow 3G", click before the page is interactive — read the URL`,
      `${c('curl')} a bad body at the endpoint: does the server refuse it?`,
    ]), box('Keep these', `<ul><li>A works before and without JS</li><li>B: give the form a method/action, or a password ends in the URL</li><li>Client check = courtesy, server check = protection</li><li>Combine them freely</li></ul>`, 'lam'), ''),
    en: 'Your turn: build the same sign-up both ways; disable JavaScript and submit both; throttle the network and click before the page is interactive; then curl a bad body at the endpoint and check that the server refuses it.' },
];
export const slides = lamDeck({ chuong: 'Chapter 16 — Forms, validation, and file uploads', bai: '16.1' }, S);
