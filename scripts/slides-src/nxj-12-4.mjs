/*DU_LIEU*/
const DU_LIEU = {
 "n12-4:file:src/app/dang-ky/actions.ts": "'use server';\n// app/dang-ky/actions.ts — action nhận state TRƯỚC làm đối số đầu, trả state MỚI\nexport async function signup(prev: { error: string | null }, formData: FormData) {\n  const email = formData.get('email');\n  console.log('[signup] email =', JSON.stringify(email), '· prev =', JSON.stringify(prev));\n  await new Promise((r) => setTimeout(r, 1200));   // giả lập máy chủ chậm 1,2 s\n  if (typeof email !== 'string' || !email.includes('@')) return { error: 'Email is required' };\n  return { error: null };\n}\n",
 "n12-4:file:src/app/dang-ky/SignupForm.tsx": "'use client';\n// app/dang-ky/SignupForm.tsx — mã của bài + khai kiểu state (null | string)\nimport { useActionState } from 'react';\nimport { signup } from './actions';\n\ntype TrangThai = { error: string | null };\n\nexport function SignupForm() {\n  const [state, formAction, pending] = useActionState(signup, { error: null } as TrangThai);\n  return (\n    <form action={formAction} className=\"flex flex-col gap-2\">\n      <input name=\"email\" className=\"border px-2\" placeholder=\"email\" />\n      {state.error && <p className=\"err text-red-600\">{state.error}</p>}\n      <button disabled={pending} className=\"border px-3 disabled:opacity-50\">{pending ? 'Sending…' : 'Sign up'}</button>\n    </form>\n  );\n}\n",
 "n12-4:file:src/app/dang-ky/page.tsx": "import { SignupForm } from './SignupForm';\nexport default function Trang() { return <main className=\"p-4 text-xl\"><SignupForm /></main>; }\n",
 "n12-4:bai": "$ npx tsc --noEmit      # SignupForm của bài, chép nguyên\ntsc: 0 lỗi — state suy ra từ kiểu đối số prev của signup",
 "n12-4:file:src/app/nut/actions.ts": "'use server';\n// app/nut/actions.ts — action chậm 1 s, đếm số lần chạy\nlet dem = 0;\nexport async function luu(formData: FormData) {\n  dem++;\n  console.log(`[luu] lần ${dem} · ${formData.get('nguon')}`);\n  await new Promise((r) => setTimeout(r, 1000));\n}\n",
 "n12-4:file:src/app/nut/NutCha.tsx": "'use client';\n// app/nut/NutCha.tsx — BẪY: useFormStatus gọi trong CHÍNH component vẽ <form>\nimport { useFormStatus } from 'react-dom';\nimport { luu } from './actions';\n\nexport function FormCha() {\n  const { pending } = useFormStatus();   // không có <form> nào BÊN TRÊN component này\n  return (\n    <form id=\"cha\" action={luu} className=\"flex gap-2\">\n      <input type=\"hidden\" name=\"nguon\" value=\"useFormStatus ở cha\" />\n      <button disabled={pending} className=\"border px-3\">{pending ? 'Saving…' : 'Save (cha)'}</button>\n    </form>\n  );\n}\n",
 "n12-4:file:src/app/nut/NutCon.tsx": "'use client';\n// app/nut/NutCon.tsx — ĐÚNG: nút là component CON, nằm bên trong <form>\nimport { useFormStatus } from 'react-dom';\nimport { luu } from './actions';\n\nfunction SubmitButton() {\n  const { pending } = useFormStatus();          // đọc form BAO NGOÀI nó\n  return <button disabled={pending} className=\"border px-3\">{pending ? 'Saving…' : 'Save (con)'}</button>;\n}\n\nexport function FormCon() {\n  return (\n    <form id=\"con\" action={luu} className=\"flex gap-2\">\n      <input type=\"hidden\" name=\"nguon\" value=\"useFormStatus ở con\" />\n      <SubmitButton />\n    </form>\n  );\n}\n",
 "n12-4:file:src/app/nut/page.tsx": "import { FormCha } from './NutCha';\nimport { FormCon } from './NutCon';\nexport default function Trang() { return <main className=\"flex flex-col gap-3 p-4 text-xl\"><FormCha /><FormCon /></main>; }\n",
 "n12-4:file:src/app/nem/actions.ts": "'use server';\n// app/nem/actions.ts — action NÉM lỗi thay vì trả lỗi\nexport async function nem(formData: FormData) {\n  const t = formData.get('title');\n  if (!t) throw new Error('Title is required (thông điệp thật từ action)');\n}\n",
 "n12-4:file:src/app/nem/page.tsx": "import { nem } from './actions';\nexport default function Trang() {\n  return <main className=\"p-4 text-xl\"><form action={nem} className=\"flex gap-2\"><input name=\"title\" className=\"border px-2\" /><button className=\"border px-3\">Gửi trống</button></form></main>;\n}\n",
 "n12-4:file:src/app/nem/error.tsx": "'use client';\n// app/nem/error.tsx — ranh giới lỗi của đoạn /nem\nexport default function Loi({ error }: { error: Error & { digest?: string } }) {\n  return <div className=\"p-4 text-xl text-red-700\"><b>error.tsx bắt được:</b> {error.message}<br />digest: {error.digest ?? '—'}</div>;\n}\n",
 "n12-4:file:src/app/dang-ky2/actions.ts": "'use server';\n// app/dang-ky2/actions.ts — trả lại cả giá trị người dùng đã gõ trong state\nexport type TrangThai2 = { error: string | null; email: string };\nexport async function signup2(prev: TrangThai2, formData: FormData): Promise<TrangThai2> {\n  const email = String(formData.get('email') ?? '');\n  await new Promise((r) => setTimeout(r, 600));\n  if (!email.includes('@')) return { error: 'Email is required', email };\n  return { error: null, email: '' };\n}\n",
 "n12-4:file:src/app/dang-ky2/Form2.tsx": "'use client';\n// app/dang-ky2/Form2.tsx — defaultValue lấy từ state ⇒ sau khi React reset form, ô hiện lại giá trị cũ\nimport { useActionState } from 'react';\nimport { signup2 } from './actions';\n\nexport function Form2() {\n  const [state, formAction, pending] = useActionState(signup2, { error: null, email: '' });\n  return (\n    <form action={formAction} className=\"flex flex-col gap-2\">\n      <input name=\"email\" defaultValue={state.email} className=\"border px-2\" placeholder=\"email\" />\n      {state.error && <p className=\"err text-red-600\">{state.error}</p>}\n      <button disabled={pending} className=\"border px-3\">{pending ? 'Sending…' : 'Sign up'}</button>\n    </form>\n  );\n}\n",
 "n12-4:file:src/app/dang-ky2/page.tsx": "import { Form2 } from './Form2';\nexport default function Trang() { return <main className=\"p-4 text-xl\"><Form2 /></main>; }\n",
 "n12-4:sua": "$ npx next typegen >/dev/null 2>&1; npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npm run build 2>&1 | grep -E 'Compiled|/dang-ky|/nut|/nem|Static|Dynamic'\n✓ Compiled successfully in 4.7s\n├ ○ /dang-ky\n├ ○ /dang-ky2\n├ ○ /nem\n└ ○ /nut\n○  (Static)  prerendered as static content",
 "n12-4:trinh-duyet": "$ Chromium: /dang-ky gửi \"abc\" · /nut bấm đúp từng form · /nem gửi trống — kết quả đo\ndang-ky  · {\"giua\":\"{\\\"nut\\\":\\\"Sending…\\\",\\\"tat\\\":true}\",\"sau\":\"{\\\"loi\\\":\\\"Email is required\\\",\\\"o\\\":\\\"\\\"}\"}\ndang-ky2 · {\"sau\":\"{\\\"loi\\\":\\\"Email is required\\\",\\\"o\\\":\\\"abc\\\"}\"}\nnut-cha  · {\"giua\":\"{\\\"chu\\\":\\\"Save (cha)\\\",\\\"tat\\\":false}\"}\nnut-con  · {\"giua\":\"{\\\"chu\\\":\\\"Saving…\\\",\\\"tat\\\":true}\"}\nnem      · {\"sau\":\"{\\\"chu\\\":\\\"error.tsx bắt được: Minified React error #441; visit https://react.dev/errors/441 for the full message or use the non-minified dev environment for full errors a\\\"}\"}\n$ grep -aE '^\\[(signup|luu)\\]' ~/.rtq-nxj/nen-c12s.log | tail -6\n[signup] email = \"abc\" · prev = {\"error\":null}\n[luu] lần 1 · useFormStatus ở cha\n[luu] lần 2 · useFormStatus ở cha\n[luu] lần 3 · useFormStatus ở con\n$ grep -aE 'Title is required' ~/.rtq-nxj/nen-c12s.log | sed 's/^ *//' | head -1\n⨯ Error: Title is required (thông điệp thật từ action)",
 "n12-4:file:src/app/ten-cu/Cu.tsx": "'use client';\n// tên CŨ của hook (React 18 canary / Next 14): useFormState từ react-dom\nimport { useFormState } from 'react-dom';\nimport { signup } from '../dang-ky/actions';\n\nexport function Cu() {\n  const [state, formAction] = useFormState(signup, { error: null as string | null });\n  return <form action={formAction}><input name=\"email\" />{state.error}<button>Gửi</button></form>;\n}\n",
 "n12-4:file:src/app/ten-cu/page.tsx": "import { Cu } from './Cu';\nexport default function Trang() { return <main className=\"p-4 text-xl\"><Cu /></main>; }\n",
 "n12-4:ten-cu": "$ npx tsc --noEmit      # import { useFormState } from 'react-dom' trên React 19.3\ntsc: 0 lỗi (tên cũ vẫn có trong kiểu, đánh dấu deprecated)\n$ Chromium + next dev: mở /ten-cu — console trình duyệt\ninfo · %cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold\nlog · [HMR] connected\nerror · ReactDOM.useFormState has been renamed to React.useActionState. Please update %s to use React.useActionState. Cu",
 "anh-nxj-12-4:dang-ky-truoc": {
  "url": "http://127.0.0.1:19392/dang-ky",
  "vp": [
   640,
   220
  ],
  "rect": {},
  "console": []
 },
 "anh-nxj-12-4:dang-ky-giua": {
  "url": "http://127.0.0.1:19392/dang-ky",
  "vp": [
   640,
   220
  ],
  "rect": {},
  "console": []
 },
 "anh-nxj-12-4:dang-ky": {
  "url": "http://127.0.0.1:19392/dang-ky",
  "vp": [
   640,
   220
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "giua": "{\"nut\":\"Sending…\",\"tat\":true}",
   "sau": "{\"loi\":\"Email is required\",\"o\":\"\"}"
  }
 },
 "anh-nxj-12-4:nut-cha-giua": {
  "url": "http://127.0.0.1:19392/nut",
  "vp": [
   640,
   200
  ],
  "rect": {},
  "console": []
 },
 "anh-nxj-12-4:nut-cha": {
  "url": "http://127.0.0.1:19392/nut",
  "vp": [
   640,
   200
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "giua": "{\"chu\":\"Save (cha)\",\"tat\":false}"
  }
 },
 "anh-nxj-12-4:nut-con-giua": {
  "url": "http://127.0.0.1:19392/nut",
  "vp": [
   640,
   200
  ],
  "rect": {},
  "console": []
 },
 "anh-nxj-12-4:nut-con": {
  "url": "http://127.0.0.1:19392/nut",
  "vp": [
   640,
   200
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "giua": "{\"chu\":\"Saving…\",\"tat\":true}"
  }
 },
 "anh-nxj-12-4:nem": {
  "url": "http://127.0.0.1:19392/nem",
  "vp": [
   640,
   200
  ],
  "rect": {},
  "console": [
   {
    "kieu": "error",
    "chu": "Failed to load resource: the server responded with a status of 500 (Internal Server Error)"
   },
   {
    "kieu": "error",
    "chu": "Error: Minified React error #441; visit https://react.dev/errors/441 for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
   }
  ],
  "ketQua": {
   "sau": "{\"chu\":\"error.tsx bắt được: Minified React error #441; visit https://react.dev/errors/441 for the full message or use the non-minified dev environment for full errors a\"}"
  }
 },
 "anh-nxj-12-4:ten-cu": {
  "url": "http://127.0.0.1:19394/ten-cu",
  "vp": [
   640,
   160
  ],
  "rect": {},
  "console": [
   {
    "kieu": "info",
    "chu": "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold"
   },
   {
    "kieu": "log",
    "chu": "[HMR] connected"
   },
   {
    "kieu": "error",
    "chu": "ReactDOM.useFormState has been renamed to React.useActionState. Please update %s to use React.useActionState. Cu"
   }
  ]
 },
 "anh-nxj-12-4:dang-ky2": {
  "url": "http://127.0.0.1:19392/dang-ky2",
  "vp": [
   640,
   220
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "sau": "{\"loi\":\"Email is required\",\"o\":\"abc\"}"
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, box, two, steps, kw, c, cmp, br, icards } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-12-4', code: 'NXJ 12.4', title: 'Pending & errors: useActionState and useFormStatus', sub: 'Chapter 12 · Lesson 12.4' };
const AN = (k) => { const v = DU_LIEU[`anh-nxj-12-4:${k}`]; if (v === undefined) throw new Error('thiếu ảnh ' + k); return v; };
const O = (k) => { const v = DU_LIEU[`n12-4:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const B = (ten, o) => br('nxj-12-4', ten, { vp: 640, ...o });
const F = (p) => O(`file:${p}`).trim();
const bo = (s) => s.split('\n').filter((l) => !/^\/\/ /.test(l)).join('\n');
const goc = (s) => s.replace(/\s+\/\/ .*$/gm, '');
const dongs = (k, re) => { const l = O(k).split('\n').filter((x) => !x.startsWith('$ ') && re.test(x)); if (!l.length) throw new Error('không thấy dòng trong ' + k + ' ' + re); return l; };
const kq = (k) => { const v = AN(k).ketQua; if (!v) throw new Error('thiếu ketQua ' + k); return Object.fromEntries(Object.entries(v).map(([a, b]) => [a, JSON.parse(b)])); };

// ── số đo
const TSC_BAI = dongs('bai', /^tsc: 0 lỗi/)[0];
const TSC_CU = dongs('ten-cu', /^tsc: 0 lỗi/)[0];
const CON_CU = dongs('ten-cu', /^error · ReactDOM\.useFormState/)[0].replace(/^error · /, '');
const DK = kq('dang-ky'), DK2 = kq('dang-ky2'), CHA = kq('nut-cha'), CON = kq('nut-con'), NEM = kq('nem');
const LOG = dongs('trinh-duyet', /^\[(signup|luu)\]/);
const LOI = dongs('trinh-duyet', /Title is required/)[0].replace(/^⨯ /, '');
const BUILD = dongs('sua', /^[├└┌] [○ƒ] \//);
if (!/0 lỗi/.test(TSC_BAI) || !/0 lỗi/.test(TSC_CU) || !/renamed to React\.useActionState/.test(CON_CU)) throw new Error('tên cũ / tsc đổi');
if (DK.giua.nut !== 'Sending…' || DK.giua.tat !== true || DK.sau.loi !== 'Email is required' || DK.sau.o !== '') throw new Error('dang-ky đổi');
if (DK2.sau.o !== 'abc' || DK2.sau.loi !== 'Email is required') throw new Error('dang-ky2 đổi');
if (CHA.giua.tat !== false || CON.giua.tat !== true || LOG.filter((l) => /ở cha/.test(l)).length !== 2 || LOG.filter((l) => /ở con/.test(l)).length !== 1) throw new Error('useFormStatus đổi');
if (!/#441/.test(NEM.sau.chu)) throw new Error('nem đổi');

const BAI_FORM = `'use client';
import { useActionState } from 'react';

function SignupForm() {
  const [state, formAction, pending] = useActionState(signup, { error: null });
  return (
    <form action={formAction}>
      <input name="email" />
      {state.error && <p className="err">{state.error}</p>}
      <button disabled={pending}>{pending ? 'Sending…' : 'Sign up'}</button>
    </form>
  );
}`;
const SIGNUP = goc(bo(F('src/app/dang-ky/actions.ts'))).split('\n').filter((l) => !/console\.log/.test(l)).join('\n');
const SIGNUP_GON = SIGNUP.replace('(prev: { error: string | null }, formData: FormData) {', '(\n  prev: { error: string | null },\n  formData: FormData,\n) {')
  .replace("if (typeof email !== 'string' || !email.includes('@')) return { error: 'Email is required' };", "if (typeof email !== 'string'\n      || !email.includes('@'))\n    return { error: 'Email is required' };")
  .replace('await new Promise((r) => setTimeout(r, 1200));', 'await new Promise((r) =>\n    setTimeout(r, 1200));');
const FORM2 = goc(bo(F('src/app/dang-ky2/Form2.tsx'))).replace(/ className="[^"]*"/g, '').split('\n').filter((l) => /useActionState\(signup2|defaultValue|return \{ error: 'Email/.test(l)).map((l) => l.trim()).join('\n');
const ACT2 = goc(bo(F('src/app/dang-ky2/actions.ts'))).split('\n').filter((l) => /return \{/.test(l)).map((l) => l.trim()).join('\n');
const CHA_SRC = goc(bo(F('src/app/nut/NutCha.tsx'))).replace(/ className="[^"]*"/g, '').split('\n').filter((l) => !/^import|^'use client'|^\s*$/.test(l)).join('\n');
const CON_SRC = goc(bo(F('src/app/nut/NutCon.tsx'))).replace(/ className="[^"]*"/g, '').split('\n').filter((l) => /function SubmitButton|useFormStatus\(\)|return <button|^}/.test(l)).join('\n');
const NEM_SRC = goc(bo(F('src/app/nem/actions.ts'))).split('\n').filter((l) => !/^'use server'/.test(l)).join('\n');

export const S = [
  { cover: true, nhan: 'Chapter 12 · Lesson 12.4', t: 'Pending & errors:<br>useActionState and useFormStatus', sub: 'Show "Sending…" and a validation message without hand-written state. Measured: the old name, pending mid-flight, the form reset React 19 does for you, the parent/child rule, and a thrown error in production',
    en: 'Lesson twelve point four: pending and errors, with useActionState and useFormStatus. We measure the old hook name, pending in the middle of a request, the form reset React nineteen does for you, the parent-child rule of useFormStatus, and what a thrown error looks like in production.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li><code>useFormState</code> → <code>useActionState</code>: what the old name still does</li>
    <li><code>useActionState</code>: the action's result as state, plus <code>pending</code> — measured mid-flight</li>
    <li>React 19 <b>resets the form</b> after the action — the typed value is gone unless you return it</li>
    <li><code>useFormStatus</code> in the parent: always <code>false</code>, a double click sends twice</li>
    <li>Return errors, do not throw: a thrown message never reaches the user in production</li></ul>`,
    en: 'Five takeaways: useFormState became useActionState, and what the old name still does; useActionState gives the action\'s result as state plus a pending flag, measured mid-flight; React nineteen resets the form after the action, so the typed value is gone unless you return it; useFormStatus in the parent is always false, and a double click sends twice; and return errors instead of throwing, because a thrown message never reaches the user in production.' },
  { t: 'The rename: useFormState → useActionState (measured)', body: two(D(tn(['$ npx tsc --noEmit   # import { useFormState } from \'react-dom\' on React 19.3', TSC_CU, '# next dev, Chromium console', CON_CU].join('\n'), { fs: 14, wrap: 60, title: 'tsc + next dev (real)' }),
      B('ten-cu', { url: 'localhost:3000/ten-cu (next dev)', h: 160, w: 500 })),
    D(cmp(['', 'old (React 18 canary · Next 14)', 'now (React 19 · Next 15+)'], [
        ['Hook', '<code>useFormState</code>', '<code>useActionState</code>'],
        ['Import from', "<code>'react-dom'</code>", "<code>'react'</code>"],
        ['Returns', '<code>[state, action]</code>', '<code>[state, action, pending]</code>'],
      ]),
      box('Read it', 'The old import still type-checks and still runs, but React logs an error in dev: <em>"ReactDOM.useFormState has been renamed to React.useActionState"</em>. Tutorials showing <code>useFormState</code> are older — switch the name and the import.', 'lam')), ''),
    en: 'The rename, measured. The old useFormState from react-dom still type-checks on React nineteen and still runs, but in development React logs an error: useFormState has been renamed to useActionState. The new hook comes from react, not react-dom, and returns a third value, pending. Tutorials that show useFormState are simply older.' },
  { t: "useActionState: the lesson's form, run in Chromium", body: two(D(tsx(BAI_FORM.replace('= useActionState(signup, { error: null });', '=\n    useActionState(signup, { error: null });').replace("<button disabled={pending}>{pending ? 'Sending…' : 'Sign up'}</button>", "<button disabled={pending}>\n        {pending ? 'Sending…' : 'Sign up'}\n      </button>"), { sm: true, hl: [5, 6, 11, 12] }), tn(['$ npx tsc --noEmit', TSC_BAI].join('\n'), { fs: 13, wrap: 60, title: 'tsc (real)' })),
    D(tsx(SIGNUP_GON, { sm: true, hl: [3, 11] }),
      box('Read it', 'The action gets the <b>previous state</b> first and <b>returns</b> the next one. The state type comes from <code>prev</code>, so the lesson\'s code compiles as is.', 'xanh')), 'r64'),
    en: 'useActionState with the lesson\'s form. The action receives the previous state first and returns the next state — an object with an error message instead of a thrown error. Because the state type comes from the prev parameter, the lesson\'s code compiles as it is: tsc reports zero errors.' },
  { t: 'pending, measured mid-flight (1.2 s action)', body: two(D(B('dang-ky-truoc', { url: 'before: email = "abc"', h: 140, w: 540 }), B('dang-ky-giua', { url: '300 ms after the click', h: 140, w: 540 }), B('dang-ky', { url: 'after the action answered', h: 140, w: 540 })),
    D(cmp(['Moment', 'measured'], [
        ['300 ms in', `button "${DK.giua.nut}" · disabled = <b>${DK.giua.tat}</b>`],
        ['after', `"${DK.sau.loi}" shown`],
        ['server log', LOG.find((l) => /\[signup\]/.test(l))],
      ]),
      box('Read it', '<code>pending</code> is <code>true</code> for exactly as long as the action runs: the button says "Sending…" and cannot be clicked again. No <code>useState</code>, no <code>try/finally</code>.', 'xanh')), ''),
    en: 'pending, measured mid-flight. The action takes one point two seconds. Three hundred milliseconds after the click the button reads Sending and is disabled; when the action answers, the returned message Email is required appears. No useState, no try-finally.' },
  { t: 'React 19 resets the form after the action', body: two(B('dang-ky', { url: `/dang-ky after the error · input "${DK.sau.o}"`, h: 140, w: 520 }), B('dang-ky2', { url: `/dang-ky2 after the error · input "${DK2.sau.o}"`, h: 140, w: 520 }), '') +
    tsx(ACT2 + '\n// Form2.tsx\n' + FORM2, { sm: true, hl: [1, 5] }) +
    box('Read it', `A <code>&lt;form action={…}&gt;</code> is <b>reset</b> after the action finishes — success or not. The lesson's form came back with an empty input (<code>"${DK.sau.o}"</code>) next to "Email is required", so the user types it again. Return the value in the state and use it as <code>defaultValue</code>: the second form kept <code>"${DK2.sau.o}"</code>.`, 'do2'),
    en: 'React nineteen resets the form after the action finishes, success or not. Measured: after the error, the lesson\'s email input was empty — the user would have to type it again. Return the submitted value in the state and use it as defaultValue: on the second page the input still held abc after the error.' },
  { t: 'useFormStatus: the parent vs a child button', body: tsx(CHA_SRC.split('\n').filter((l) => /export function|useFormStatus\(\)|<form|<button|<\/form>|^}/.test(l)).join('\n'), { sm: true, hl: [2] }) + tsx(CON_SRC, { sm: true, hl: [2] }) +
    two(B('nut-cha-giua', { url: '120 ms after clicking Save (cha)', h: 100, w: 520 }), B('nut-con-giua', { url: '120 ms after clicking Save (con)', h: 100, w: 520 }), '') +
    tn(['# two clicks on each form, 120 ms apart', ...LOG.filter((l) => /\[luu\]/.test(l))].join('\n'), { fs: 14, wrap: 100, title: 'next start log (real)' }),
    en: 'useFormStatus: the parent versus a child. Called in the component that renders the form, it has no form above it, so pending stayed false: the button still said Save and the second click ran the action again — two runs. Moved into a small child component inside the form, the button said Saving, was disabled, and the second click did nothing — one run.' },
  { t: 'Return errors — do not throw them', body: two(D(tsx(NEM_SRC, { sm: true, hl: [3] }), B('nem', { url: 'localhost:3000/nem · production', h: 130, w: 500 })),
    D(tn([`# next start log`, LOI].join('\n'), { fs: 14, wrap: 42, title: 'server log (real)' }),
      box('Read it', 'A thrown error goes to the nearest <code>error.tsx</code>, which replaces the form. In production its <code>message</code> is hidden — the user saw "Minified React error #441", the real text stayed in the server log. A <b>returned</b> <code>{ error }</code> stays in the form, readable.', 'do2')), 'r64') + box('Optimistic UI', 'For instant feedback, <code>useOptimistic</code> shows the expected result right away and reconciles when the action answers — the next step once these basics feel natural.', 'lam'),
    en: 'Return errors, do not throw them. A thrown error goes to the nearest error dot tsx, which replaces the whole form, and in production its message is hidden: the user saw minified React error four forty-one while the real text stayed in the server log. A returned error stays inside the form, readable. For instant feedback, useOptimistic is the next step.' },
  { t: 'Two hooks, two questions', body: icards([
      ['list', 'useActionState(action, initial)', '"What did the action return?" — the result as <code>state</code>, a wrapped <code>formAction</code>, and <code>pending</code>. Where validation errors come back.'],
      ['clock', 'useFormStatus()', '"Is the form <b>around me</b> submitting?" — for a reusable submit button. Must be <b>inside</b> the <code>&lt;form&gt;</code>.'],
      ['warn', 'The form resets', 'After every action. Keep values by returning them and using <code>defaultValue</code>.'],
      ['check', 'Return, not throw', 'Thrown ⇒ <code>error.tsx</code> + hidden message. Returned ⇒ shown in place.'],
    ], 2) + `<div style="margin-top:12px">${tn(['$ npm run build', ...BUILD].join('\n'), { fs: 13, wrap: 100, title: 'next build (real) — all three forms are static pages' })}</div>`,
    en: 'Two hooks, two questions. useActionState answers what the action returned, plus pending; that is where validation errors come back. useFormStatus answers whether the form around me is submitting, and must be inside the form. The form resets after every action, so return values you want to keep. And return errors rather than throwing them.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('useActionState', 'state + formAction + pending (from react)'), kw('useFormState', 'the old name, react-dom — logs an error in dev'),
      kw('pending', 'true while the action runs'), kw('prev state', 'the action\'s first argument'),
      kw('useFormStatus', 'pending of the form around the component'), kw('Form reset', 'React 19 clears the form after an action'),
      kw('Returned error', 'shown in place, readable in production'), kw('useOptimistic', 'show the result before the server answers'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: useActionState; useFormState, the old name; pending; the previous state as first argument; useFormStatus; the form reset; a returned error; and useOptimistic.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Wrap a slow action with ${c('useActionState')}; screenshot the button while ${c('pending')} is true`,
      `Return ${c("{ error: '…' }")}; type a bad value — is it still in the input afterwards?`,
      `Return the value too and use it as ${c('defaultValue')}`,
      `Put ${c('useFormStatus')} in the parent, double-click, count the runs; move it to a child button`,
    ]), box('Keep these', `<ul><li><code>useActionState</code> from <code>'react'</code></li><li><code>pending</code> disables the button</li><li>The form resets — return what to keep</li><li><code>useFormStatus</code> only inside the form</li><li>Return errors; thrown ones are hidden</li></ul>`, 'lam'), ''),
    en: 'Your turn: wrap a slow action with useActionState and capture the button while pending is true; return an error and check whether the bad value is still in the input; return the value too and use it as defaultValue; and put useFormStatus in the parent, double-click and count the runs, then move it into a child button. Keep: useActionState from react; pending disables the button; the form resets, so return what to keep; useFormStatus only inside the form; and return errors.' },
];
export const slides = lamDeck({ chuong: 'Chapter 12 — Server Actions', bai: '12.4' }, S);
