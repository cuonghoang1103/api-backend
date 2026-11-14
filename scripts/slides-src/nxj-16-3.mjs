/*DU_LIEU*/
const DU_LIEU = {
 "n16-3:file:src/lib/signup-schema.ts": "// lib/signup-schema.ts — ONE schema, imported by the client form and the server action\nimport { z } from 'zod';\nexport const signupSchema = z.object({\n  email: z.email('Invalid email'),\n  password: z.string().min(8, 'At least 8 characters'),\n});\nexport type Signup = z.infer<typeof signupSchema>;\n",
 "n16-3:file:src/app/z/bai-server.ts": "import { signupSchema } from '@/lib/signup-schema';\nasync function signup(formData) {\n  'use server';\n  const parsed = signupSchema.safeParse({\n    email: formData.get('email'),\n    password: formData.get('password'),\n  });\n  if (!parsed.success) return { errors: parsed.error.flatten() };   // reject bad input\n  await createUser(parsed.data);                                     // parsed.data is typed & clean\n}\n",
 "n16-3:file:thu.ts": "import { z } from 'zod';\nimport { signupSchema } from './src/lib/signup-schema';\n\nconst bad = signupSchema.safeParse({ email: 'an-at-lab', password: '123', age: -1 });\nif (!bad.success) console.log('fieldErrors:', JSON.stringify(z.flattenError(bad.error).fieldErrors, null, 1));\nconst ok = signupSchema.safeParse({ email: 'an@lab.test', password: 'correct-horse' });\nconsole.log('ok:', JSON.stringify(ok));\nconst extra = signupSchema.safeParse({ email: 'an@lab.test', password: 'correct-horse', role: 'admin' });\nconsole.log('extra field \"role\":', JSON.stringify(extra.success && extra.data));\n",
 "n16-3:bai": "# 1 · the lesson's schema, exactly as written (Zod 4.6.7)\n# 2 · the lesson's server half, exactly as written, in a .ts file\n$ npx next typegen >/dev/null 2>&1; npx tsc --noEmit\nsrc/app/z/bai-server.ts(2,23): error TS7006: Parameter 'formData' implicitly has an 'any' type.\nsrc/app/z/bai-server.ts(9,9): error TS2304: Cannot find name 'createUser'.\n# 3 · run the schema\n$ npx tsx thu.ts\nfieldErrors: {\n \"email\": [\n  \"Invalid email\"\n ],\n \"password\": [\n  \"At least 8 characters\"\n ],\n \"age\": [\n  \"Too small: expected number to be >0\"\n ]\n}\nok: {\"success\":true,\"data\":{\"email\":\"an@lab.test\",\"password\":\"correct-horse\"}}\nextra field \"role\": {\"email\":\"an@lab.test\",\"password\":\"correct-horse\"}",
 "n16-3:file:thu2.ts": "import { z } from 'zod';\n\nconst fd = new FormData();\nfd.set('count', '3');\nfd.set('agree', 'on');\nconst raw = Object.fromEntries(fd);\nconsole.log('FormData →', JSON.stringify(raw));\n\nconst show = (label: string, r: { success: boolean; data?: unknown; error?: { issues: { message: string }[] } }) =>\n  console.log(label.padEnd(30), r.success ? 'OK   ' + JSON.stringify(r.data) : 'FAIL ' + r.error!.issues[0]!.message);\n\nshow('z.number()', z.object({ count: z.number() }).safeParse(raw));\nshow('z.coerce.number()', z.object({ count: z.coerce.number() }).safeParse(raw));\nshow('z.coerce.number() · \"\"', z.object({ count: z.coerce.number() }).safeParse({ count: '' }));\nshow('z.boolean() · \"on\"', z.object({ agree: z.boolean() }).safeParse(raw));\nshow('z.coerce.boolean() · \"false\"', z.object({ agree: z.coerce.boolean() }).safeParse({ agree: 'false' }));\nshow('z.stringbool() · \"on\"', z.object({ agree: z.stringbool() }).safeParse(raw));\nshow('z.stringbool() · \"false\"', z.object({ agree: z.stringbool() }).safeParse({ agree: 'false' }));\nshow('z.stringbool() · missing', z.object({ agree: z.stringbool() }).safeParse({}));\n",
 "n16-3:file:thu3.ts": "import { z } from 'zod';\nconst Order = z.object({ count: z.coerce.number() });\nconst check: [z.input<typeof Order>, z.infer<typeof Order>] = 0;\n",
 "n16-3:bay": "# the trap: FormData values are strings\n$ npx tsx thu2.ts\nFormData → {\"count\":\"3\",\"agree\":\"on\"}\nz.number()                     FAIL Invalid input: expected number, received string\nz.coerce.number()              OK   {\"count\":3}\nz.coerce.number() · \"\"         OK   {\"count\":0}\nz.boolean() · \"on\"             FAIL Invalid input: expected boolean, received string\nz.coerce.boolean() · \"false\"   OK   {\"agree\":true}\nz.stringbool() · \"on\"          OK   {\"agree\":true}\nz.stringbool() · \"false\"       OK   {\"agree\":false}\nz.stringbool() · missing       FAIL Invalid input: expected string, received undefined\n# input type vs output type of a coerced schema\n$ npx tsc --noEmit thu3.ts --strict --skipLibCheck --module esnext --moduleResolution bundler 2>&1 | sed 's/^thu3.ts([0-9,]*): //'\nerror TS2322: Type 'number' is not assignable to type '[{ count: unknown; }, { count: number; }]'.",
 "n16-3:file:src/app/z/actions.ts": "'use server';\n// app/z/actions.ts — the server half: the same schema, safeParse\nimport { z } from 'zod';\nimport { signupSchema } from '@/lib/signup-schema';\nimport { addSignup } from '@/lib/signups';\n\nexport async function signupAction(input: unknown) {\n  const parsed = signupSchema.safeParse(input);\n  if (!parsed.success) {\n    console.log('[action] rejected:', JSON.stringify(input));\n    return { ok: false as const, errors: z.flattenError(parsed.error).fieldErrors };\n  }\n  addSignup({ name: '-', email: parsed.data.email, via: 'zod action' });\n  return { ok: true as const };\n}\n",
 "n16-3:file:src/lib/signups.ts": "// lib/signups.ts — the \"database\" of sign-ups (globalThis: one copy per server process)\nexport type Signup = { name: string; email: string; via: string };\nconst g = globalThis as unknown as { __su?: Signup[] };\nexport const signups = () => (g.__su ??= []);\nexport function addSignup(s: Signup) { signups().push(s); console.log(`[signup] #${signups().length} ${s.email} via ${s.via}`); }\n",
 "n16-3:file:src/app/z/Form.tsx": "'use client';\n// app/z/Form.tsx — the client half: the same schema through zodResolver\nimport { useState } from 'react';\nimport { useForm } from 'react-hook-form';\nimport { zodResolver } from '@hookform/resolvers/zod';\nimport { signupSchema, type Signup } from '@/lib/signup-schema';\nimport { signupAction } from './actions';\n\nexport function Form() {\n  const { register, handleSubmit, formState: { errors } } = useForm<Signup>({ resolver: zodResolver(signupSchema) });\n  const [kq, setKq] = useState('');\n  const send = async (v: unknown) => setKq(JSON.stringify(await signupAction(v)));\n  return (\n    <form onSubmit={handleSubmit(send)} className=\"flex flex-col gap-1 p-2 text-lg\">\n      <input id=\"email\" {...register('email')} placeholder=\"email\" className=\"border px-1\" />\n      {errors.email && <p id=\"e-email\" className=\"text-red-600\">{errors.email.message}</p>}\n      <input id=\"password\" type=\"password\" {...register('password')} placeholder=\"password\" className=\"border px-1\" />\n      {errors.password && <p id=\"e-password\" className=\"text-red-600\">{errors.password.message}</p>}\n      <div className=\"flex gap-2\"><button id=\"gui\" className=\"border px-2\">Sign up</button>\n        <button id=\"vuot\" type=\"button\" onClick={() => send({ email: 'x', password: '1' })} className=\"border px-2\">Call the action directly</button></div>\n      <p id=\"kq\">{kq}</p>\n    </form>\n  );\n}\n",
 "n16-3:file:src/app/z/page.tsx": "import { Form } from './Form';\nexport default function Page() { return <Form />; }\n",
 "n16-3:lab": "$ npx next typegen >/dev/null 2>&1; npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npm run build 2>&1 | grep -E 'Compiled|/z|rror'\n✓ Compiled successfully in 7.2s\n└ ○ /z",
 "n16-3:kho": "$ grep -n '\"zod\"' frontend/package.json package.json\nfrontend/package.json:111:    \"zod\": \"^3.23.8\",\npackage.json:148:    \"zod\": \"^3.23.8\"\n$ sed -n '/const registerSchema = z/,/^  })/p' 'frontend/src/app/(auth)/register/page.tsx' | grep -nE \"min\\(12|regex\\(/\\[A-Z\\]\"\n12:      .min(12, 'Password must be at least 12 characters')\n14:      .regex(/[A-Z]/, 'Password must contain at least 1 uppercase letter')\n$ grep -n \"'/register'\" -A20 src/routes/auth.routes.ts | grep -E \"isLength\\(\\{ min: 12|matches\\(/\\[A-Z\\]/\\)\"\n72-      .isLength({ min: 12, max: 100 })\n74-      .matches(/[A-Z]/)",
 "n16-3:nhatky": "- Network:       http://127.0.0.1:19318\n✓ Ready in 91ms\n\n✓ Running next.config.ts took 23ms\n[signup] #1 an@lab.test via zod action\n[action] rejected: {\"email\":\"x\",\"password\":\"1\"}",
 "n16-3:dung": "",
 "anh-nxj-16-3:z-client": {
  "url": "http://localhost:19318/z",
  "vp": [
   640,
   220
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://localhost:19318/z",
    "ma": 200,
    "loai": "document",
    "kt": 7472
   },
   {
    "url": "http://localhost:19318/_next/static/chunks/3ms0oilcj2gm3.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14859
   },
   {
    "url": "http://localhost:19318/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://localhost:19318/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://localhost:19318/_next/static/chunks/0kqziy-7_gy73.js",
    "ma": 200,
    "loai": "script",
    "kt": 22335
   },
   {
    "url": "http://localhost:19318/_next/static/chunks/3t6i_3lvi_934.js",
    "ma": 200,
    "loai": "script",
    "kt": 27913
   },
   {
    "url": "http://localhost:19318/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://localhost:19318/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://localhost:19318/_next/static/chunks/0ojdkacen8ax-.js",
    "ma": 200,
    "loai": "script",
    "kt": 153916
   },
   {
    "url": "http://localhost:19318/_next/static/chunks/3b3bjcqncussl.js",
    "ma": 200,
    "loai": "script",
    "kt": 145008
   },
   {
    "url": "http://localhost:19318/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   }
  ],
  "console": [],
  "ketQua": {
   "client (zodResolver) ⇒": "Invalid email | At least 8 characters"
  }
 },
 "anh-nxj-16-3:z-ok": {
  "url": "http://localhost:19318/z",
  "vp": [
   640,
   220
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://localhost:19318/z",
    "ma": 200,
    "loai": "document",
    "kt": 7472
   },
   {
    "url": "http://localhost:19318/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://localhost:19318/_next/static/chunks/3ms0oilcj2gm3.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14859
   },
   {
    "url": "http://localhost:19318/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://localhost:19318/_next/static/chunks/0kqziy-7_gy73.js",
    "ma": 200,
    "loai": "script",
    "kt": 22335
   },
   {
    "url": "http://localhost:19318/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://localhost:19318/_next/static/chunks/3t6i_3lvi_934.js",
    "ma": 200,
    "loai": "script",
    "kt": 27913
   },
   {
    "url": "http://localhost:19318/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://localhost:19318/_next/static/chunks/0ojdkacen8ax-.js",
    "ma": 200,
    "loai": "script",
    "kt": 153916
   },
   {
    "url": "http://localhost:19318/_next/static/chunks/3b3bjcqncussl.js",
    "ma": 200,
    "loai": "script",
    "kt": 145008
   },
   {
    "url": "http://localhost:19318/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://localhost:19318/z",
    "ma": 200,
    "loai": "fetch",
    "kt": 73,
    "pt": "POST",
    "na": "40c368cb9813a040031291f98f4d5390d546e1570c",
    "ctq": "text/plain;charset=UTF-8",
    "ct": "text/x-component",
    "than": "[{\"email\":\"an@lab.test\",\"password\":\"correct-horse\"}]",
    "ms": 613,
    "ve": 629
   }
  ],
  "console": [],
  "ketQua": {
   "dữ liệu đúng ⇒ action trả": "{\"ok\":true}"
  }
 },
 "anh-nxj-16-3:z-vuot": {
  "url": "http://localhost:19318/z",
  "vp": [
   640,
   220
  ],
  "rect": {},
  "mang": [
   {
    "url": "http://localhost:19318/z",
    "ma": 200,
    "loai": "document",
    "kt": 7472
   },
   {
    "url": "http://localhost:19318/_next/static/chunks/3ms0oilcj2gm3.css",
    "ma": 200,
    "loai": "stylesheet",
    "kt": 14859
   },
   {
    "url": "http://localhost:19318/_next/static/media/07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 23108
   },
   {
    "url": "http://localhost:19318/_next/static/media/605ce01b664af129-s.p.0wgildi0cnwt9.woff2",
    "ma": 200,
    "loai": "font",
    "kt": 29288
   },
   {
    "url": "http://localhost:19318/_next/static/chunks/0kqziy-7_gy73.js",
    "ma": 200,
    "loai": "script",
    "kt": 22335
   },
   {
    "url": "http://localhost:19318/_next/static/chunks/3t6i_3lvi_934.js",
    "ma": 200,
    "loai": "script",
    "kt": 27913
   },
   {
    "url": "http://localhost:19318/_next/static/chunks/turbopack-2u1d16houkiyo.js",
    "ma": 200,
    "loai": "script",
    "kt": 9974
   },
   {
    "url": "http://localhost:19318/_next/static/chunks/3qfy96eoyh-ek.js",
    "ma": 200,
    "loai": "script",
    "kt": 13994
   },
   {
    "url": "http://localhost:19318/_next/static/chunks/0ojdkacen8ax-.js",
    "ma": 200,
    "loai": "script",
    "kt": 153916
   },
   {
    "url": "http://localhost:19318/_next/static/chunks/3b3bjcqncussl.js",
    "ma": 200,
    "loai": "script",
    "kt": 145008
   },
   {
    "url": "http://localhost:19318/_next/static/chunks/092r-mewpaf3q.js",
    "ma": 200,
    "loai": "script",
    "kt": 229052
   },
   {
    "url": "http://localhost:19318/z",
    "ma": 200,
    "loai": "fetch",
    "kt": 148,
    "pt": "POST",
    "na": "40c368cb9813a040031291f98f4d5390d546e1570c",
    "ctq": "text/plain;charset=UTF-8",
    "ct": "text/x-component",
    "than": "[{\"email\":\"x\",\"password\":\"1\"}]",
    "ms": 563,
    "ve": 568
   }
  ],
  "console": [],
  "ketQua": {
   "gọi thẳng action với {email:'x',password:'1'} ⇒": "{\"ok\":false,\"errors\":{\"email\":[\"Invalid email\"],\"password\":[\"At least 8 characters\"]}}"
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, br, box, two, steps, kw, c, cmp, icards, path, thucTe4 } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-16-3', code: 'NXJ 16.3', title: 'Validation with Zod: one schema, both sides', sub: 'Chapter 16 · Lesson 16.3' };
const O = (k) => { const v = DU_LIEU[`n16-3:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const A = (k) => { const v = DU_LIEU[`anh-nxj-16-3:${k}`]; if (!v) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const F = (p) => O(`file:${p}`).trim();
const B = (ten, o) => br('nxj-16-3', ten, { vp: 640, ...o });
const KQ = (k) => Object.values(A(k).ketQua)[0];
const POST = (k) => A(k).mang.filter((m) => m.pt === 'POST').map((m) => `POST /z  body ${m.than}`);

// ── số đo (n16-3 · lab c16 · Zod 4.6.7 · react-hook-form 7.92.0 · @hookform/resolvers 7.0.6 · Next.js 16.4.6 · Chromium)
const BAI = O('bai').split('\n');
const TSE = BAI.filter((l) => /error TS/.test(l));
const THU = BAI.slice(BAI.findIndex((l) => l.startsWith('$ npx tsx thu.ts')) + 1).join('\n');
const BAY = O('bay').split('\n');
const BAYR = BAY.filter((l) => /^(z\.|FormData)/.test(l));
const TYP = BAY.find((l) => /TS2322/.test(l));
const LOG = O('nhatky').split('\n').filter((l) => /^\[(action|signup)\]/.test(l));
const KHO = O('kho');
const ZC = KQ('z-client'), ZO = KQ('z-ok'), ZV = KQ('z-vuot');
if (TSE.length !== 2 || !/"Invalid email"/.test(THU) || !/Too small: expected number to be >0/.test(THU) || !/extra field "role": \{"email"/.test(THU)) throw new Error('bai đổi');
if (!BAYR.some((l) => /^z\.number\(\) +FAIL Invalid input: expected number, received string/.test(l)) || !BAYR.some((l) => /coerce\.number\(\) · "" +OK +\{"count":0\}/.test(l)) || !BAYR.some((l) => /coerce\.boolean\(\) · "false" +OK +\{"agree":true\}/.test(l))) throw new Error('bay đổi');
if (!/count: unknown; \}, \{ count: number;/.test(TYP)) throw new Error('kiểu đổi');
if (ZC !== 'Invalid email | At least 8 characters' || ZO !== '{"ok":true}' || !/"ok":false,"errors":\{"email":\["Invalid email"\]/.test(ZV) || POST('z-client').length !== 0) throw new Error('form đổi');

const LESSON = `import { z } from 'zod';
export const signupSchema = z.object({
  email:    z.string().email('Invalid email'),
  password: z.string().min(8, 'At least 8 characters'),
  age:      z.number().int().positive().optional(),
});
export type Signup = z.infer<typeof signupSchema>;`;
const SCHEMA = F('src/lib/signup-schema.ts').replace(/^\/\/ lib\/signup-schema\.ts — .*$/m, '// lib/signup-schema.ts');
const ACTION = F('src/app/z/actions.ts').split('\n').filter((l) => !/^\/\/ app|console\.log|addSignup/.test(l)).join('\n').replace("import { addSignup } from '@/lib/signups';\n", '').replace(/\n\n\n/g, '\n\n').replace('return { ok: false as const, errors: z.flattenError(parsed.error).fieldErrors };', 'return { ok: false as const,\n      errors: z.flattenError(parsed.error).fieldErrors };');
if (!/z\.flattenError\(parsed\.error\)/.test(ACTION)) throw new Error('ACTION đổi');
const FORMC = `const { register, handleSubmit, formState: { errors } } =
  useForm<Signup>({
    resolver: zodResolver(signupSchema),
  });`;
if (!/zodResolver\(signupSchema\)/.test(F('src/app/z/Form.tsx'))) throw new Error('Form đổi');

export const S = [
  { cover: true, nhan: 'Chapter 16 · Lesson 16.3', t: 'Validation with Zod:<br>one schema,<br>both sides', sub: 'Measured on Zod 4.6.7: the same rules in the browser and in the action, and the string that FormData always sends',
    en: 'Lesson sixteen point three: validation with Zod, one schema for both sides. Measured on Zod four: the same rules in the browser and in the action, and the string that FormData always sends.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>A schema is a runtime value; <code>z.infer</code> derives the TypeScript type from it</li>
    <li>Client: <code>zodResolver(schema)</code> — errors before any request</li>
    <li>Server: <code>schema.safeParse()</code> — the action rejects what the browser let through</li>
    <li>FormData sends <b>strings</b>: <code>z.number()</code> fails on "3", <code>coerce</code> has its own surprises</li>
    <li>Zod 4 names: <code>z.email()</code>, <code>z.flattenError()</code></li></ul>`,
    en: 'Five takeaways: a schema is a runtime value and z infer derives the type; on the client, zodResolver shows errors before any request; on the server, safeParse rejects what the browser let through; FormData sends strings; and the Zod four names, z email and z flattenError.' },
  { t: 'One schema, imported twice', body: path([
      { t: 'signup-schema.ts', s: 'z.object({ … })', on: true }, { t: 'Form.tsx (client)', s: 'zodResolver(schema)' }, { t: 'actions.ts (server)', s: 'schema.safeParse(input)' }, { t: 'type Signup', s: 'z.infer<typeof schema>' },
    ], { nhan: ['import', 'import', 'derive'] }) + two(tsx(SCHEMA, { sm: true, hl: [4, 5, 7] }), D(box('A value, not just a type', 'A TypeScript type disappears at build time; a schema survives into the running code, so it can check bytes that come from outside.', 'lam'),
      box('No drift', 'Change <code>min(8)</code> once and both sides change. The type follows, because it is derived.', 'xanh'))),
    en: 'One schema, imported twice: by the client form through zodResolver, and by the server action with safeParse. The TypeScript type is derived with z infer. A schema is a value, not just a type, so it survives into the running code.' },
  { t: "The lesson's code on Zod 4.6.7", body: two(D(tsx(LESSON, { sm: true, hl: [3] }), tn(['$ npx tsx thu.ts   # bad input', THU.split('\nok:')[0]].join('\n'), { fs: 13, wrap: 56, title: 'tsx (real)' })),
    D(tn(['# the server half, pasted into a .ts file', '$ npx tsc --noEmit', ...TSE].join('\n'), { fs: 13, wrap: 54, title: 'tsc (real)' }),
      box('Runs, with Zod 4 spellings', '<code>z.string().email()</code> and <code>error.flatten()</code> still work but are deprecated in Zod 4: write <code>z.email()</code> and <code>z.flattenError(error)</code>.', 'lam'),
      box('The server snippet needs types', '<code>formData</code> has no type (TS7006) and <code>createUser</code> does not exist (TS2304). The version on the next slides types the input as <code>unknown</code> — safeParse is what narrows it.', 'do2')), ''),
    en: 'The lesson\'s code on Zod four point six. The schema runs: bad input gives one message per field. The server half pasted into a TypeScript file needs a type for formData, and createUser does not exist. And Zod four spells it z email and z flattenError.' },
  { t: 'Client: zodResolver — errors before any request', body: two(D(tsx(FORMC, { sm: true, hl: [3] }), B('z-client', { url: 'localhost:3000/z · email "an-at-lab", password "123"', h: 200, w: 540 })),
    D(tn([`# Chromium (real), click "Sign up"`, `messages: ${ZC}`, `POST requests sent: ${POST('z-client').length}`, '', '# valid data', ...POST('z-ok'), `action returned: ${ZO}`].join('\n'), { fs: 14, wrap: 52, title: 'Chromium (real)' }),
      box('The messages come from the schema', 'No <code>required</code> rule on any field: the resolver turns the schema into per-field errors, and nothing is sent until they are gone.', 'xanh')), ''),
    en: 'Client: zodResolver. The form takes the schema, and a bad email with a short password shows both messages from the schema, with zero requests sent. Valid data goes to the action, which answers ok true.' },
  { t: 'Server: safeParse — the check that protects you', body: two(D(tsx(ACTION, { sm: true, hl: [6, 7, 8] })),
    D(tn(['# a script calls the action directly, skipping the form', `body: ${POST('z-vuot')[0].replace(/^POST \/z +body /, '')}`, `returned: ${ZV}`, '# server log', ...LOG].join('\n'), { fs: 13, wrap: 54, title: 'Chromium + next start (real)' }),
      box('Narrow, then use', '<code>input: unknown</code> — never <code>as Signup</code>. <code>safeParse</code> returns <code>{ success, data }</code> or <code>{ success: false, error }</code>; send field errors back instead of throwing.', 'xanh')), ''),
    en: 'Server: safeParse, the check that protects you. A script calls the action directly with a bad body, skipping the form. The action parses its unknown input with the same schema and returns field errors; the server log shows the rejection.' },
  { t: 'Trap: FormData sends strings', body: two(D(tn(['$ npx tsx thu2.ts', ...BAYR].join('\n'), { fs: 13, wrap: 64, title: 'Zod 4.6.7 (real)' })),
    D(box('"3" is not a number', '<code>z.number()</code> fails on every form submit: "Invalid input: expected number, received string" — on a field that plainly shows 3.', 'do2'),
      box('coerce has its own surprises', 'An empty field becomes <b>0</b>. <code>z.coerce.boolean()</code> turns "false" into <b>true</b> (any non-empty string is truthy).', 'do2'),
      box('For checkboxes: z.stringbool()', '"on" → true, "false" → false. A missing checkbox is <code>undefined</code>: add <code>.default(false)</code>.', 'xanh')), 'r64'),
    en: 'The trap: FormData sends strings. z number fails on "3". z coerce number fixes it, but an empty field becomes zero. z coerce boolean turns the string false into true. For checkboxes use z stringbool, and give a missing one a default.' },
  { t: 'Input type ≠ output type', body: two(D(tsx("const Order = z.object({ count: z.coerce.number() });\n\nconst check: [z.input<typeof Order>, z.infer<typeof Order>] = 0;", { sm: true, hl: [3] }),
      tn(['$ npx tsc --noEmit thu3.ts', TYP].join('\n'), { fs: 14, wrap: 60, title: 'tsc (real)' })),
    D(box('z.infer is the OUTPUT', 'After coercion <code>count</code> is a <code>number</code>; what goes in is <code>unknown</code>. Type a function parameter with <code>z.infer</code> and you claim the data is already clean.', 'lam'),
      box('Use the right one', '<code>z.input&lt;typeof S&gt;</code> for raw form values, <code>z.infer</code> (= <code>z.output</code>) after <code>parse</code>.', 'xanh')), ''),
    en: 'Input type is not output type. A trick with tsc prints both: the input of a coerced count is unknown, the output is number. z infer is the output, so use it only after parse.' },
  { t: 'Unknown keys are dropped', body: two(D(tn(['$ npx tsx thu.ts', ...THU.split('\n').filter((l) => /^(ok|extra)/.test(l))].join('\n'), { fs: 14, wrap: 60, title: 'tsx (real)' })),
    D(box('A free mass-assignment guard', '<code>z.object</code> strips keys it does not know: <code>role: "admin"</code> never reaches <code>createUser</code>. Pass <code>parsed.data</code> on, never the raw input.', 'xanh'),
      box('Want an error instead?', '<code>z.strictObject({ … })</code> rejects unknown keys.', 'lam')), ''),
    en: 'Unknown keys are dropped. Adding role admin to the input: parse returns only email and password. A free guard against mass assignment, as long as you pass parsed data on, never the raw input.' },
  { t: 'cuongthai.com: the same rule, written twice', body: two(D(tn(KHO, { fs: 13, wrap: 64, title: 'repo (real)' })),
    D(box('Two copies, in sync today', 'The register form says <code>min(12)</code> + an uppercase letter in a Zod schema; the Express route says <code>isLength({ min: 12 })</code> + <code>matches(/[A-Z]/)</code> with express-validator.', 'lam'),
      box('Why not one schema?', 'The frontend and the backend are separate apps. Sharing means a small package both import — until then, every rule change is two edits and a chance to drift.', 'do2')), ''),
    en: 'cuongthai.com: the register password rule exists twice, a Zod schema in the frontend and express-validator in the backend. In sync today, but every change is two edits. The fix is a small shared package that both import.' },
  { t: "Not learning in a vacuum: real life, what if, the attacker", to: true, body: thucTe4({ doi: ["🛒", "Cart quantity, checkbox, date of birth", ["FormData sends everything as strings", "\"3\" ≠ 3 · \"on\" ≠ true"]], neu: ["📧", "A 'promotions' box with coerce.boolean?", ["client sends \"false\" ⇒ true", "someone who opted out still gets email"]], xau: ["👑", "Mass assignment: role=admin", ["extra keys that are not on the form", "hoping the server copies them into the DB"]], phong: ["🛡️", "Drop unknown keys · use parsed.data only", ["measured: role dropped from data", "test empty fields, \"false\", extra keys"]] }),
    en: "Real life: the quantity box in a cart, the 'I agree' checkbox, a date of birth — all reach the server as strings. What if a 'send me promotions' checkbox uses z.coerce.boolean() and a client sends the string 'false'? Someone who opted out still gets email. An attacker adds keys you did not expect, like role: 'admin', hoping the server copies them into the database — mass assignment. Prevent it: z.object drops unknown keys; use parsed.data only; test empty fields and the string 'false'." },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Schema', 'a runtime description'), kw('z.infer', 'the output type'), kw('z.input', 'the raw input type'), kw('zodResolver', 'schema → form errors'),
      kw('safeParse', '{ success, data | error }'), kw('z.flattenError', 'per-field messages'), kw('z.coerce', 'string → number…'), kw('z.stringbool', '"on" → true'),
      kw('Unknown keys', 'stripped by z.object'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: schema; z infer, the output type; z input, the raw input type; zodResolver; safeParse; z flattenError; z coerce; z stringbool; and unknown keys, stripped by z object.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `One ${c('signup-schema.ts')}: import it in the form (${c('zodResolver')}) and the action (${c('safeParse')})`,
      `Call the action directly with bad data — get field errors, not an exception`,
      `Add a number and a checkbox to a FormData form; try ${c('z.number()')}, ${c('z.coerce')}, ${c('z.stringbool()')}`,
      `Send an extra ${c('role')} field and print ${c('parsed.data')}`,
    ]), box('Keep these', `<ul><li>One schema, two imports</li><li>Client = UX, server = protection</li><li>FormData is strings</li><li>Use parsed.data, never the raw input</li></ul>`, 'lam'), ''),
    en: 'Your turn: one schema imported by the form and the action; call the action directly with bad data; add a number and a checkbox and try the coercions; and send an extra role field to see it dropped.' },
];
export const slides = lamDeck({ chuong: 'Chapter 16 — Forms, validation, and file uploads', bai: '16.3' }, S);
