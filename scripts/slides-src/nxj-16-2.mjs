/*DU_LIEU*/
const DU_LIEU = {
 "n16-2:file:src/app/f/bai/SignupForm.tsx": "'use client';\nimport { useForm } from 'react-hook-form';\n\ntype Signup = { email: string; password: string };\n\nexport function SignupForm() {\n  const { register, handleSubmit, formState: { errors } } = useForm<Signup>();\n  const onSubmit = (data: Signup) => console.log(data);   // { email, password }\n  return (\n    <form onSubmit={handleSubmit(onSubmit)}>\n      <input {...register('email', { required: 'Email is required' })} />\n      {errors.email && <p>{errors.email.message}</p>}\n      <input type=\"password\" {...register('password')} />\n      <button>Sign up</button>\n    </form>\n  );\n}\n",
 "n16-2:bai": "# 1 · the lesson's form, exactly as written, in a .tsx file\n$ npx next typegen >/dev/null 2>&1; npx tsc --noEmit\nsrc/app/f/bai/SignupForm.tsx(5,21): error TS7006: Parameter 'data' implicitly has an 'any' type.\nsrc/app/f/bai/SignupForm.tsx(9,27): error TS2322: Type 'string | FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined' is not assignable to type 'ReactNode'.\n  Type 'FieldError' is not assignable to type 'ReactNode'.\n    Type 'FieldError' is missing the following properties from type 'ReactPortal': children, props, key\n# 2 · give the form a type\n$ npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi",
 "n16-2:file:src/app/f/KiemSoat.tsx": "'use client';\n// app/f/KiemSoat.tsx — 20 controlled inputs: every keystroke is React state\nimport { useRef, useState } from 'react';\n\nconst FIELDS = Array.from({ length: 20 }, (_, i) => `field${i + 1}`);\n\nexport function KiemSoat() {\n  const renders = useRef(0);\n  renders.current += 1;\n  const [values, setValues] = useState<Record<string, string>>({});\n  return (\n    <form id=\"form\" className=\"grid grid-cols-4 gap-1 p-2\">\n      <p id=\"n\" className=\"col-span-4\">renders: {renders.current}</p>\n      {FIELDS.map((f, i) => (\n        <input key={f} id={`f${i}`} name={f} value={values[f] ?? ''} onChange={(e) => setValues((v) => ({ ...v, [f]: e.target.value }))} className=\"border px-1\" placeholder={f} />\n      ))}\n    </form>\n  );\n}\n",
 "n16-2:file:src/app/f/Rhf.tsx": "'use client';\n// app/f/Rhf.tsx — the same 20 inputs, registered with react-hook-form (uncontrolled)\nimport { useRef } from 'react';\nimport { useForm } from 'react-hook-form';\n\nconst FIELDS = Array.from({ length: 20 }, (_, i) => `field${i + 1}`);\n\nexport function Rhf() {\n  const renders = useRef(0);\n  renders.current += 1;\n  const { register, handleSubmit } = useForm<Record<string, string>>();\n  return (\n    <form id=\"form\" onSubmit={handleSubmit((data) => { document.getElementById('out')!.textContent = JSON.stringify(data).slice(0, 80); })} className=\"grid grid-cols-4 gap-1 p-2\">\n      <p id=\"n\" className=\"col-span-4\">renders: {renders.current}</p>\n      {FIELDS.map((f, i) => <input key={f} id={`f${i}`} {...register(f)} className=\"border px-1\" placeholder={f} />)}\n      <button id=\"gui\" className=\"col-span-4 border\">Submit</button>\n      <p id=\"out\" className=\"col-span-4\" />\n    </form>\n  );\n}\n",
 "n16-2:file:src/app/f/Thieu.tsx": "'use client';\n// app/f/Thieu.tsx — the trap: a field with a name but no register\nimport { useForm } from 'react-hook-form';\n\ntype Post = { title: string; body: string };\n\nfunction TitleField() {\n  return <input id=\"title\" name=\"title\" placeholder=\"title\" className=\"border px-1\" />;   // the spread got lost here\n}\n\nexport function Thieu() {\n  const { register, handleSubmit, formState: { errors } } = useForm<Post>();\n  return (\n    <form onSubmit={handleSubmit((data) => { document.getElementById('out')!.textContent = JSON.stringify(data); })} className=\"flex flex-col gap-1 p-2\">\n      <TitleField />\n      <input id=\"body\" {...register('body', { required: 'body is required' })} placeholder=\"body\" className=\"border px-1\" />\n      <button id=\"gui\" className=\"border\">Publish</button>\n      <p id=\"out\" />\n      {errors.body && <p>{errors.body.message}</p>}\n    </form>\n  );\n}\n",
 "n16-2:file:src/app/f/kiem-soat/page.tsx": "import { KiemSoat } from '../KiemSoat';\nexport default function Page() { return <KiemSoat />; }\n",
 "n16-2:file:src/app/f/rhf/page.tsx": "import { Rhf } from '../Rhf';\nexport default function Page() { return <Rhf />; }\n",
 "n16-2:file:src/app/f/thieu/page.tsx": "import { Thieu } from '../Thieu';\nexport default function Page() { return <Thieu />; }\n",
 "n16-2:lab": "$ npx next typegen >/dev/null 2>&1; npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npm run build 2>&1 | grep -E 'Compiled|/f/|rror'\n✓ Compiled successfully in 5.8s\n├ ○ /f/kiem-soat\n├ ○ /f/rhf\n└ ○ /f/thieu\n$ node -e \"…route-bundle-stats.json: first-load JS of /f/kiem-soat and /f/rhf\"\n/f/rhf            492879 B\n/f/thieu          492860 B\n/f/kiem-soat      457706 B",
 "n16-2:kho": "$ grep -rlE \"useForm[<(]\" src | sort\nsrc/app/(auth)/login/page.tsx\nsrc/app/(auth)/register/page.tsx\nsrc/app/forgot-password/ForgotPasswordForm.tsx\nsrc/app/reset-password/page.tsx\nsrc/components/auth/ChangePasswordModal.tsx\nsrc/components/games/admin/GameForm.tsx\n$ grep -n \"useForm<\\|zodResolver(\" 'src/app/(auth)/login/page.tsx' | head -3\n93:  } = useForm<LoginFormValues>({\n94:    resolver: zodResolver(loginSchema),\n$ grep -rn \"<Controller\" src | wc -l | sed 's/^ */chỗ dùng Controller: /'\nchỗ dùng Controller: 1",
 "n16-2:dung": "",
 "anh-nxj-16-2:ks": {
  "url": "http://localhost:19317/f/kiem-soat",
  "vp": [
   640,
   200
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "lúc mở trang ⇒": "renders: 1",
   "gõ 11 ký tự (kiểm soát) ⇒": "renders: 12"
  }
 },
 "anh-nxj-16-2:rhf": {
  "url": "http://localhost:19317/f/rhf",
  "vp": [
   640,
   200
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "lúc mở trang ⇒": "renders: 2",
   "gõ 11 ký tự (react-hook-form) ⇒": "renders: 2",
   "bấm Submit ⇒": "renders: 2 · {\"field1\":\"hello world\",\"field2\":\"\",\"field3\":\"\",\"field4\":\"\",\"field5\":\"\",\"field6\""
  }
 },
 "anh-nxj-16-2:thieu": {
  "url": "http://localhost:19317/f/thieu",
  "vp": [
   640,
   160
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "ô title có chữ, dữ liệu gửi đi ⇒": "My first post ⇒ data = {\"body\":\"hello\"}"
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, br, box, two, steps, kw, c, cmp, icards, meter } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-16-2', code: 'NXJ 16.2', title: 'react-hook-form: fast client forms', sub: 'Chapter 16 · Lesson 16.2' };
const O = (k) => { const v = DU_LIEU[`n16-2:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const A = (k) => { const v = DU_LIEU[`anh-nxj-16-2:${k}`]; if (!v) throw new Error('thiếu ảnh ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const F = (p) => O(`file:${p}`).trim();
const B = (ten, o) => br('nxj-16-2', ten, { vp: 640, ...o });
const KQ = (k) => Object.values(A(k).ketQua);
const so = (s) => Number(String(s).match(/renders: (\d+)/)[1]);

// ── số đo (n16-2 · lab c16 · react-hook-form 7.92.0 · Next.js 16.4.6 · next start 19317 · Chromium)
const BAI = O('bai').split('\n');
const E1 = BAI.filter((l) => /TS7006/.test(l)), E2 = BAI.filter((l) => /TS2322/.test(l));
const STATS = O('lab').split('\n').filter((l) => /^\/f\//.test(l)).map((l) => l.trim().split(/\s+/));
const JS = Object.fromEntries(STATS.map(([r, b]) => [r, Number(b)]));
const KS = KQ('ks'), RH = KQ('rhf'), TH = KQ('thieu')[0];
const KHO = O('kho');
if (E1.length !== 1 || E2.length !== 1 || !/tsc: 0 lỗi/.test(O('bai'))) throw new Error('bai đổi');
if (so(KS[0]) !== 1 || so(KS[1]) !== 12 || so(RH[0]) !== 2 || so(RH[1]) !== 2 || !/"field1":"hello world"/.test(RH[2])) throw new Error('render đổi');
if (TH !== 'My first post ⇒ data = {"body":"hello"}') throw new Error('thieu đổi');
if (!(JS['/f/rhf'] > JS['/f/kiem-soat'])) throw new Error('bundle đổi');
const THEM = JS['/f/rhf'] - JS['/f/kiem-soat'];

const LESSON = `'use client';
import { useForm } from 'react-hook-form';
function SignupForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = (data) => console.log(data);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email',
        { required: 'Email is required' })} />
      {errors.email && <p>{errors.email.message}</p>}
      <input type="password" {...register('password')} />
      <button>Sign up</button>
    </form>
  );
}`;
const FIX = `type Signup = {
  email: string;
  password: string;
};
const { register, handleSubmit,
  formState: { errors },
} = useForm<Signup>();
const onSubmit = (data: Signup) =>
  console.log(data);`;
const KS_SRC = `const [values, setValues] = useState({});
// every keystroke:
<input value={values[f] ?? ''}
  onChange={(e) => setValues((v) =>
    ({ ...v, [f]: e.target.value }))} />`;
const RH_SRC = `const { register, handleSubmit } = useForm();
// the DOM keeps the value; read at submit:
<input {...register(f)} />`;
const THIEU = F('src/app/f/Thieu.tsx').split('\n').filter((l) => /function TitleField|return <input id="title"|<TitleField|register\('body'/.test(l)).map((l) => l.trim().replace(/ className="[^"]*"/, '').replace(/ placeholder="[^"]*"/, '').replace(/; +\/\/ /, ';  // ').replace("{...register('body', { required: 'body is required' })}", "{...register('body', {\n  required: 'body is required' })}")).join('\n');
if (!/spread got lost/.test(THIEU)) throw new Error('thieu src đổi');

export const S = [
  { cover: true, nhan: 'Chapter 16 · Lesson 16.2', t: 'react-hook-form:<br>fast client forms', sub: 'Uncontrolled inputs, typed with TypeScript — measured: renders per keystroke, the bytes it costs, and a field that silently disappears',
    en: 'Lesson sixteen point two: react-hook-form, fast client forms. We measure renders per keystroke, the bytes it costs, and a field that silently disappears from the data.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Controlled: every keystroke is state — <b>${so(KS[1])}</b> renders for 11 characters</li>
    <li>react-hook-form: the DOM keeps the value — <b>${so(RH[1])}</b> renders, before and after typing</li>
    <li>On 16.4.6 the lesson's code needs a type: <code>useForm&lt;Signup&gt;()</code></li>
    <li>It costs about <b>${Math.round(THEM / 1000)} KB</b> of JavaScript on the page</li>
    <li>A field without <code>register</code> is silently missing from the data</li></ul>`,
    en: `Five takeaways: a controlled form renders on every keystroke, ${so(KS[1])} renders for eleven characters; react-hook-form keeps the value in the DOM, ${so(RH[1])} renders; the lesson's code needs a type; it costs about ${Math.round(THEM / 1000)} kilobytes of JavaScript; and a field without register silently disappears.` },
  { t: 'Controlled vs uncontrolled', body: two(D(box('Controlled (Chapter 4 of React)', '', 'do2'), tsx(KS_SRC, { sm: true, hl: [4, 5] }), box('', 'React owns the value. Each keystroke ⇒ <code>setValues</code> ⇒ the whole form renders again.', 'lam')),
    D(box('Uncontrolled (react-hook-form)', '', 'xanh'), tsx(RH_SRC, { sm: true, hl: [3] }), box('', 'The input owns the value; <code>register</code> attaches a ref and listeners. Typing does not touch React state.', 'lam')))
    + cmp(['', 'Controlled', 'react-hook-form'], [['Who holds the value', 'React state', 'the input element (DOM)'], ['Render per keystroke', `yes — ${so(KS[1])} for 11 keys (measured)`, `no — ${so(RH[1])} in total (measured)`], ['You read values', 'from state, any time', 'in <code>handleSubmit</code> (or <code>watch</code>)']]),
    en: 'Controlled versus uncontrolled. Controlled: React owns the value, every keystroke sets state and the whole form renders again. Uncontrolled, the react-hook-form way: the input keeps its value, register attaches a ref, and typing does not touch React state.' },
  { t: "The lesson's code on Next.js 16.4.6", body: two(D(tsx(LESSON, { sm: true, hl: [5, 10] }), box('Why the type fixes both', 'Untyped, <code>useForm()</code> knows no field names: <code>data</code> is <code>any</code> and <code>errors.email</code> could be a nested object. Typed, <code>errors.email.message</code> is a string.', 'lam')),
    D(tn(['$ npx tsc --noEmit', ...E1, ...E2.map((l) => l.replace(/ is not assignable to type 'ReactNode'\./, '\n  is not assignable to ReactNode')), '# after adding the type:', 'tsc: 0 lỗi'].join('\n'), { fs: 12, wrap: 46, title: 'tsc (real)' }),
      tsx(FIX, { sm: true, hl: [1, 7, 8] })), 'r64'),
    en: 'The lesson\'s code on Next.js sixteen. Two errors: data has an implicit any, and errors dot email dot message might be an object, not something React can render. Give the form a type, useForm of Signup, and tsc reports zero errors.' },
  { t: 'Measured: renders while typing 11 characters', body: two(D(`<div style="margin-bottom:14px">${B('ks', { url: 'localhost:3000/f/kiem-soat · controlled', h: 110, w: 500 })}</div>`, `<div style="margin-bottom:14px">${B('rhf', { url: 'localhost:3000/f/rhf · react-hook-form', h: 110, w: 500 })}</div>`),
    D(meter([['controlled · on load', so(KS[0]), '#64748b'], ['controlled · after "hello world"', so(KS[1]), '#dc2626'], ['react-hook-form · on load', so(RH[0]), '#64748b'], ['react-hook-form · after typing', so(RH[1]), '#16a34a']], { don: 'renders', w: 540, nhan: 290, fs: 16 }),
      box('One render per keystroke', `Controlled: 1 + 11 = <b>${so(KS[1])}</b>. react-hook-form: <b>${so(RH[0])}</b> on load (its own setup), still <b>${so(RH[1])}</b> after typing — and after Submit.`, 'xanh'),
      box('Where it matters', 'Twenty fields, a heavy component per field, a slow phone. With two fields you will not feel it.', 'lam')), ''),
    en: `Measured: renders while typing eleven characters into the first of twenty fields. Controlled: one plus eleven, ${so(KS[1])} renders. react-hook-form: ${so(RH[0])} on load for its own setup, and still ${so(RH[1])} after typing and after submit.` },
  { t: 'The pieces you use', body: icards([
      ['link', 'register(name, rules)', 'connects an input: ref + onChange + onBlur + name'],
      ['check', 'handleSubmit(fn)', 'reads every value, validates, calls <code>fn</code> only with clean data'],
      ['alert', 'formState.errors', 'a message per field — subscribe only to what you render'],
      ['layers', 'Controller', 'a bridge for controlled components: date pickers, custom selects'],
    ], 2) + tn(`# submit after typing (real):\n${RH[2]}…`, { fs: 14, wrap: 90, title: 'Chromium (real)' }),
    en: 'The pieces you use: register connects an input; handleSubmit reads every value, validates, and calls your function only with clean data; formState errors gives one message per field; and Controller bridges components that must be controlled, like date pickers.' },
  { t: 'What it costs: JavaScript on the page', body: two(D(meter([['/f/kiem-soat (useState)', JS['/f/kiem-soat'], '#64748b'], ['/f/rhf (react-hook-form)', JS['/f/rhf'], '#0070f3']], { don: 'B', w: 600, nhan: 260, fs: 16 }),
      tn(['$ node -e "…route-bundle-stats.json"', ...STATS.map((x) => `${x[0].padEnd(14)} ${x[1].padStart(9)} B`)].join('\n'), { fs: 14, title: 'next build (real)' })),
    D(box('About ' + Math.round(THEM / 1000) + ' KB, uncompressed', `First-load JavaScript of the same 20-field page: <b>+${THEM.toLocaleString('en-US')} B</b> with the library.`, 'lam'),
      box('A trade, not a rule', 'A big form gains far more in renders than it pays in bytes. A two-field contact form is better as a Server Action form (16.1) with no client JS at all.', 'xanh')), 'r46'),
    en: `What it costs. The same twenty-field page: ${JS['/f/kiem-soat'].toLocaleString('en-US')} bytes of first-load JavaScript with useState, ${JS['/f/rhf'].toLocaleString('en-US')} with react-hook-form, about ${Math.round(THEM / 1000)} kilobytes more. A trade, not a rule.` },
  { t: 'Trap: a field without register is silently missing', body: two(D(tsx(THIEU, { sm: true, hl: [2] }), B('thieu', { url: 'localhost:3000/f/thieu', h: 80, w: 500 })),
    D(tn(['# title typed on screen, then Publish (real):', TH].join('\n'), { fs: 15, wrap: 50, title: 'Chromium (real)' }),
      box('A name attribute is not a registration', '<code>&lt;input name="title"&gt;</code> looks registered; react-hook-form never sees it. The data has no <code>title</code>, while the field on screen clearly has text.', 'do2'),
      box('Check the spread first', 'It happens after moving a field into a child component and losing <code>{...register(\'title\')}</code>. Pass <code>register</code> down, or use <code>Controller</code> for a component input.', 'xanh')), ''),
    en: 'The trap: a field without register is silently missing. The title field was moved into a child component and lost the spread. On screen it has text; the submitted data is only the body. A name attribute is not a registration: check the spread first.' },
  { t: 'It still needs the server', body: steps([
      `The library checks <b>shape</b> in the browser — a courtesy (16.1: ${c('curl')} skips it)`,
      `The same rules must run again in the Server Action or route handler`,
      `One schema for both sides: ${c('zodResolver(schema)')} in the browser, ${c('schema.safeParse')} on the server — next lesson`,
    ]) + box('Watch out for watch()', '<code>watch()</code> at the top of the form subscribes to every keystroke and brings the re-renders back. Watch one field, or use <code>useWatch</code> in a small child.', 'lam'),
    en: 'It still needs the server. The library checks shape in the browser, a courtesy. The same rules must run again in the action. One schema for both sides is the next lesson. And watch out for watch at the top of the form: it brings the re-renders back.' },
  { t: 'cuongthai.com: react-hook-form + Zod in six forms', body: two(D(tn(KHO, { fs: 14, wrap: 64, title: 'frontend/ (real)' })),
    D(box('Login, register, passwords, games', 'Six files use <code>useForm</code>, typed (<code>useForm&lt;LoginFormValues&gt;</code>) with <code>zodResolver</code> — the pattern of this lesson and the next.', 'xanh'),
      box('The other ~127 client forms', 'Plain <code>useState</code> + <code>onSubmit</code>. Fine for small forms; the library earns its bytes on the big ones.', 'lam')), 'r56'),
    en: 'cuongthai.com: six files use react-hook-form, typed and with zodResolver, for login, register, passwords and the game editor; Controller appears once. The other client forms use plain useState, which is fine for small forms.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Controlled input', 'React owns the value'), kw('Uncontrolled input', 'the DOM owns the value'), kw('useForm&lt;T&gt;()', 'typed form'), kw('register()', 'ref + listeners'),
      kw('handleSubmit()', 'validate, then call'), kw('formState.errors', 'per-field messages'), kw('Controller', 'bridge for controlled widgets'), kw('watch()', 'brings re-renders back'),
      kw('First-load JS', 'what the page downloads'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: controlled input; uncontrolled input; useForm of T; register; handleSubmit; formState errors; Controller; watch; and first-load JavaScript.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Build a 20-field form twice — ${c('useState')} and ${c('useForm')} — and count renders`,
      `Paste the lesson's form into a ${c('.tsx')} file; fix it with ${c('useForm<Signup>()')}`,
      `Move one field into a child component and drop the spread — what does ${c('handleSubmit')} get?`,
      `Compare first-load JS of both pages in ${c('route-bundle-stats.json')}`,
    ]), box('Keep these', `<ul><li>register, not the name attribute</li><li>Type the form</li><li>Re-renders saved, bytes paid</li><li>The server checks again</li></ul>`, 'lam'), ''),
    en: 'Your turn: build a twenty-field form both ways and count renders; fix the lesson\'s form with a type; move a field into a child and drop the spread; and compare first-load JavaScript of both pages.' },
];
export const slides = lamDeck({ chuong: 'Chapter 16 — Forms, validation, and file uploads', bai: '16.2' }, S);
