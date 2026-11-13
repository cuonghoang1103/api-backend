/*DU_LIEU*/
const DU_LIEU = {
 "n4-3:file:select-html.cjs": "const React = require('react');\nconst { renderToStaticMarkup } = require('react-dom/server');\nconst h = React.createElement;\nconst noop = () => {};\nconsole.log(renderToStaticMarkup(h('select', { value: 'vi', onChange: noop }, h('option', { value: 'en' }, 'English'), h('option', { value: 'vi' }, 'Tiếng Việt'))));\nconsole.log(renderToStaticMarkup(h('textarea', { value: 'note', onChange: noop })));\nconsole.log(renderToStaticMarkup(h('input', { type: 'checkbox', checked: true, onChange: noop })));\n",
 "n4-3:html": "$ node select-html.cjs\n<select><option value=\"en\">English</option><option value=\"vi\" selected=\"\">Tiếng Việt</option></select>\n<textarea>note</textarea>\n<input type=\"checkbox\" checked=\"\"/>",
 "n4-3:file:src/app/dang-ky/page.tsx": "'use client';\nimport { useState } from 'react';\n\ntype Truong = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;\nconst cho = (ms: number) => new Promise((r) => setTimeout(r, ms));\n\nfunction SignupForm() {\n  const [form, setForm] = useState({ email: '', password: '', lang: 'vi', note: '', agree: false });\n  const [loi, setLoi] = useState('');\n  const [gui, setGui] = useState('');\n\n  function handleChange(e: React.ChangeEvent<Truong>) {\n    const { name, value } = e.target;\n    setForm((prev) => ({ ...prev, [name]: value }));        // một khoá theo name\n  }\n  function handleCheck(e: React.ChangeEvent<HTMLInputElement>) {\n    const { name, checked } = e.target;\n    setForm((prev) => ({ ...prev, [name]: checked }));      // checkbox: checked, không phải value\n  }\n  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {\n    e.preventDefault();\n    if (form.password.length < 8) { setLoi('Mật khẩu tối thiểu 8 ký tự'); return; }\n    setLoi('');\n    setGui(JSON.stringify(form));\n  }\n\n  return (\n    <form id=\"f\" onSubmit={handleSubmit} className=\"space-y-1 rounded border p-2\">\n      <input id=\"email\" name=\"email\" placeholder=\"email\" value={form.email} onChange={handleChange} className=\"rounded border px-2\" />\n      <input id=\"pw\" name=\"password\" type=\"password\" placeholder=\"mật khẩu\" value={form.password} onChange={handleChange} className=\"ml-2 rounded border px-2\" />\n      <span id=\"loi\" className=\"ml-2 text-red-600\">{loi}</span>\n      <div>\n        <select id=\"lang\" name=\"lang\" value={form.lang} onChange={handleChange} className=\"rounded border\">\n          <option value=\"en\">English</option>\n          <option value=\"vi\">Tiếng Việt</option>\n        </select>\n        <textarea id=\"note\" name=\"note\" rows={1} value={form.note} onChange={handleChange} className=\"ml-2 rounded border px-2 align-middle\" />\n        <label className=\"ml-2\"><input id=\"agree\" name=\"agree\" type=\"checkbox\" checked={form.agree} onChange={handleCheck} /> đồng ý</label>\n        <button id=\"dk\" disabled={!form.email} className=\"ml-2 rounded border px-2 disabled:opacity-40\">Đăng ký</button>\n      </div>\n      <p id=\"kq\" className=\"text-sm\">{gui}</p>\n    </form>\n  );\n}\n\nfunction CheckSai() {\n  const [v, setV] = useState<Record<string, string | boolean>>({ agree: false });\n  return (\n    <label className=\"block\">\n      <input id=\"cb-sai\" name=\"agree\" type=\"checkbox\"\n        onChange={(e) => setV((p) => ({ ...p, [e.target.name]: e.target.value }))} />   {/* ✗ đọc value */}\n      {' '}checkbox đọc e.target.value ⇒ <span id=\"cb-sai-kq\">{JSON.stringify(v)}</span>\n    </label>\n  );\n}\n\nfunction DienMau() {\n  const [f, setF] = useState({ ten: '', email: '' });\n  return (\n    <div>\n      <button id=\"mau1\" type=\"button\" className=\"rounded border px-2\" onClick={() => { setF({ ...f, ten: 'An' }); setF({ ...f, email: 'an@vd.vn' }); }}>điền mẫu (…f)</button>\n      <button id=\"mau2\" type=\"button\" className=\"ml-2 rounded border px-2\" onClick={() => { setF((p) => ({ ...p, ten: 'An' })); setF((p) => ({ ...p, email: 'an@vd.vn' })); }}>điền mẫu (prev =&gt;)</button>\n      <button id=\"mau0\" type=\"button\" className=\"ml-2 rounded border px-2\" onClick={() => setF({ ten: '', email: '' })}>xoá</button>\n      <span id=\"mau-kq\" className=\"ml-2\">{JSON.stringify(f)}</span>\n    </div>\n  );\n}\n\nfunction GuiMuon() {\n  const [n, setN] = useState(0);\n  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {\n    await cho(300);\n    e.preventDefault();                                     // ✗ sau await: quá muộn\n    setN((x) => x + 1);\n  }\n  return <form id=\"fm\" onSubmit={onSubmit}>async + preventDefault sau await: <input id=\"qm\" name=\"q\" className=\"rounded border px-2\" /> <span id=\"nm\">đã xử lý {n}</span></form>;\n}\n\nlet soDon = 0;\nfunction GuiHaiLan() {\n  const [dang, setDang] = useState(false);\n  const [log, setLog] = useState<string[]>([]);\n  async function datHang(khoa: boolean) {\n    if (khoa) setDang(true);\n    const so = ++soDon;\n    await cho(500);                                         // giả lập gọi API\n    setLog((l) => [...l, `đơn #${so}${khoa ? ' (khoá)' : ''}`]);\n    if (khoa) setDang(false);\n  }\n  return (\n    <div>\n      <button id=\"h1\" className=\"rounded border px-2\" onClick={() => datHang(false)}>đặt hàng (không khoá)</button>\n      <button id=\"h2\" className=\"ml-2 rounded border px-2 disabled:opacity-40\" disabled={dang} onClick={() => datHang(true)}>{dang ? 'đang gửi…' : 'đặt hàng (khoá)'}</button>\n      <span id=\"hkq\" className=\"ml-2\">{log.join(', ')}</span>\n    </div>\n  );\n}\n\nexport default function DangKy() {\n  return (\n    <div className=\"space-y-2 p-6 font-sans text-lg\">\n      <SignupForm />\n      <CheckSai />\n      <DienMau />\n      <GuiMuon />\n      <GuiHaiLan />\n    </div>\n  );\n}\n",
 "n4-3:trang": "$ npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npm run build 2>&1 | grep -E 'Compiled|dang-ky'\n✓ Compiled successfully in 909ms\n├ ○ /dang-ky\n$ curl -s -o /dev/null -w 'GET /dang-ky → %{http_code}\\n' localhost:19335/dang-ky\nGET /dang-ky → 200",
 "n4-3:dung": "",
 "anh-nxj-4-3:dk-loi": {
  "url": "http://127.0.0.1:19335/dang-ky",
  "vp": [
   640,
   380
  ],
  "rect": {
   "#f": [
    24,
    24,
    592,
    115
   ],
   "#email": [
    33,
    33,
    245,
    30
   ],
   "#pw": [
    286,
    33,
    245,
    30
   ],
   "#loi": [
    33,
    36,
    539,
    56
   ],
   "#lang": [
    33,
    96,
    105,
    27
   ],
   "#note": [
    146,
    96,
    254,
    30
   ],
   "#agree": [
    408,
    103,
    13,
    13
   ],
   "#dk": [
    490,
    95,
    85,
    30
   ],
   "#kq": [
    33,
    130,
    574,
    0
   ],
   "#cb-sai": [
    24,
    154,
    13,
    13
   ],
   "#mau1": [
    24,
    183,
    125,
    30
   ],
   "#mau2": [
    157,
    183,
    169,
    30
   ],
   "#mau-kq": [
    390,
    186,
    149,
    23
   ],
   "#fm": [
    24,
    221,
    592,
    58
   ],
   "#h1": [
    24,
    287,
    201,
    30
   ],
   "#h2": [
    233,
    287,
    146,
    30
   ],
   "#hkq": [
    387,
    290,
    0,
    23
   ]
  },
  "console": []
 },
 "anh-nxj-4-3:dk-sau": {
  "url": "http://127.0.0.1:19335/dang-ky",
  "vp": [
   640,
   380
  ],
  "rect": {
   "#f": [
    24,
    24,
    592,
    107
   ],
   "#email": [
    33,
    33,
    245,
    30
   ],
   "#pw": [
    286,
    33,
    245,
    30
   ],
   "#loi": [
    539,
    36,
    0,
    23
   ],
   "#lang": [
    33,
    68,
    105,
    27
   ],
   "#note": [
    146,
    68,
    254,
    30
   ],
   "#agree": [
    408,
    75,
    13,
    13
   ],
   "#dk": [
    490,
    67,
    85,
    30
   ],
   "#kq": [
    33,
    102,
    574,
    20
   ],
   "#cb-sai": [
    24,
    146,
    13,
    13
   ],
   "#mau1": [
    24,
    175,
    125,
    30
   ],
   "#mau2": [
    157,
    175,
    169,
    30
   ],
   "#mau-kq": [
    32,
    207,
    250,
    23
   ],
   "#fm": [
    24,
    241,
    592,
    58
   ],
   "#h1": [
    24,
    307,
    201,
    30
   ],
   "#h2": [
    233,
    307,
    146,
    30
   ],
   "#hkq": [
    24,
    310,
    542,
    52
   ]
  },
  "console": [],
  "ketQua": {
   "dkTruoc": true,
   "lan1": [
    "Mật khẩu tối thiểu 8 ký tự",
    "",
    "vi"
   ],
   "lan2": [
    "",
    "{\"email\":\"an@vd.vn\",\"password\":\"12345678\",\"lang\":\"vi\",\"note\":\"hi\",\"agree\":true}"
   ],
   "cb1": "{\"agree\":\"on\"}",
   "cb2": "{\"agree\":\"on\"}",
   "mau1": "{\"ten\":\"\",\"email\":\"an@vd.vn\"}",
   "mau2": "{\"ten\":\"An\",\"email\":\"an@vd.vn\"}",
   "hai": "đơn #1, đơn #2, đơn #3 (khoá)"
  }
 },
 "anh-nxj-4-3:muon": {
  "url": "http://127.0.0.1:19335/dang-ky",
  "vp": [
   640,
   360
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "muon": [
    "http://127.0.0.1:19335/dang-ky?q=x",
    "đã xử lý 0",
    "navigate"
   ]
  }
 },
 "anh-nxj-4-3:dk-mau1": {
  "url": "http://127.0.0.1:19335/dang-ky",
  "vp": [
   640,
   380
  ],
  "rect": {
   "#f": [
    24,
    24,
    592,
    107
   ],
   "#email": [
    33,
    33,
    245,
    30
   ],
   "#pw": [
    286,
    33,
    245,
    30
   ],
   "#loi": [
    539,
    36,
    0,
    23
   ],
   "#lang": [
    33,
    68,
    105,
    27
   ],
   "#note": [
    146,
    68,
    254,
    30
   ],
   "#agree": [
    408,
    75,
    13,
    13
   ],
   "#dk": [
    490,
    67,
    85,
    30
   ],
   "#kq": [
    33,
    102,
    574,
    20
   ],
   "#cb-sai": [
    24,
    146,
    13,
    13
   ],
   "#mau1": [
    24,
    175,
    125,
    30
   ],
   "#mau2": [
    157,
    175,
    169,
    30
   ],
   "#mau-kq": [
    32,
    207,
    229,
    23
   ],
   "#fm": [
    24,
    241,
    592,
    58
   ],
   "#h1": [
    24,
    307,
    201,
    30
   ],
   "#h2": [
    233,
    307,
    146,
    30
   ],
   "#hkq": [
    387,
    310,
    0,
    23
   ]
  },
  "console": []
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, br, box, two, steps, kw, c, icards, cmp, tiers, vsd, path } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-04-3', code: 'NXJ 4.3', title: 'A real form: many fields, one submit', sub: 'Chapter 4 · Lesson 4.3' };
const O = (k) => { const v = DU_LIEU[`n4-3:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const AN = (k) => { const v = DU_LIEU[`anh-nxj-4-3:${k}`]; if (v === undefined) throw new Error('thiếu ảnh ' + k); return v; };
const B = (ten, o) => br('nxj-04-3', ten, o);
const D = (...a) => `<div>${a.join('')}</div>`;
const KQ = AN('dk-sau').ketQua, MUON = AN('muon').ketQua.muon;
const P = O('file:src/app/dang-ky/page.tsx');
for (const s of ['setForm((prev) => ({ ...prev, [name]: value }));', 'setForm((prev) => ({ ...prev, [name]: checked }));', "setF({ ...f, ten: 'An' }); setF({ ...f, email: 'an@vd.vn' });",
  "setF((p) => ({ ...p, ten: 'An' })); setF((p) => ({ ...p, email: 'an@vd.vn' }));", 'await cho(300);\n    e.preventDefault();', '[e.target.name]: e.target.value', 'disabled={dang}'])
  if (!P.includes(s)) throw new Error('dang-ky/page.tsx không có: ' + s);
if (KQ.cb1 !== '{"agree":"on"}' || KQ.cb2 !== KQ.cb1 || !/đơn #1, đơn #2, đơn #3 \(khoá\)$/.test(KQ.hai) || !MUON[0].endsWith('?q=x')) throw new Error('số đo 4.3 đổi — xem lại slide');
const host = (u) => u.replace(/^http:\/\/127\.0\.0\.1:\d+/, 'localhost:3000');

export const S = [
  { cover: true, nhan: 'Chapter 4 · Lesson 4.3', t: 'A real form:<br>many fields, one submit', sub: 'One object in state, one change handler keyed by name, one submit — the pattern you will type hundreds of times',
    en: 'Lesson four point three: a real form, many fields, one submit. Instead of one useState per field, most forms keep one object in state and one handler that updates the right key by the input’s name — the pattern you will type hundreds of times.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>One object, one <code>handleChange</code> keyed by <code>name</code>, one <code>onSubmit</code></li>
    <li>Why the updater <code>prev =&gt;</code> form — the lost field, <b>measured</b></li>
    <li><code>select</code>, <code>textarea</code> and the checkbox exception — <b>measured</b></li>
    <li>Submitting without a reload — and the <code>await</code> trap, <b>measured</b></li>
    <li>Disable the button while submitting — the duplicate order, <b>measured</b></li></ul>`,
    en: 'Five takeaways: one object, one change handler keyed by name, one submit; why the updater form, with the lost field measured; select, textarea and the checkbox exception, measured; submitting without a reload and the await trap, measured; and disabling the button while submitting, with the duplicate order measured.' },
  { t: 'The many-field pattern', body: two(tsx(`const [form, setForm] = useState({
  email: '', password: '', lang: 'vi', note: '', agree: false });

function handleChange(e) {
  const { name, value } = e.target;
  setForm((prev) => ({ ...prev, [name]: value }));
}
function handleCheck(e) {
  const { name, checked } = e.target;
  setForm((prev) => ({ ...prev, [name]: checked }));
}

<input name="email" value={form.email} onChange={handleChange} />
<select name="lang" value={form.lang} onChange={handleChange}>…`, { sm: true, hl: [6, 10, 13] }),
      icards([
        ['key', '1 · name = the key', `Each input has a ${c('name')} matching a key of the state object.`],
        ['code', '2 · One computed key', `${c('[name]: value')} updates exactly the field that fired.`],
        ['layers', '3 · The updater form', `${c('setForm(prev => …)')} — the new state is built from the old one (Chapter 3).`],
      ], 1), 'r64') +
    vsd('5 fields ⇒ 5 <code>useState</code> + 5 handlers, and a submit that has to gather them all', 'one object + one handler keyed by <code>name</code> — adding a field is one key and one input', '✗ One state per field', '✓ One object'),
    en: 'The many-field pattern. Three things make it work. Each input has a name that matches a key in the state object. A single handleChange uses a computed key, square brackets name, colon value, to update exactly the field that fired. And the updater form, setForm of prev arrow, is used because the new state is built from the old one. The checkbox gets its own handler, which reads checked — more on that in a moment.' },
  { t: 'Measured: one object, validated, one submit', body: two(D(B('dk-loi', { vp: 640, h: 135, w: 560, url: 'localhost:3000/dang-ky · password "1234" → Đăng ký', mark: [[286, 33, 245, 30, ''], [460, 36, 150, 23, '']] }),
      B('dk-sau', { vp: 640, h: 135, w: 560, url: 'password "12345678" → Đăng ký', mark: [[33, 102, 574, 20, '']] })),
      D(tn([`Đăng ký disabled before typing: ${KQ.dkTruoc}`, `password "1234":  ${KQ.lan1[0]}`, 'password "12345678":', `  ${KQ.lan2[1]}`].join('\n'), { fs: 14, wrap: 48, title: 'Chromium, next start' }),
        box('The whole form is one object', 'On submit you already hold <code>{ email, password, lang, note, agree }</code> — ready to send to an API. Validation reads the same object and shows the error next to the field.', 'xanh'))),
    en: 'Measured in a real browser. The submit button starts disabled because email is empty. With the password one two three four, submitting shows the error next to the field: at least eight characters. With eight digits, submitting logs the whole form as one object — email, password, language, note, and agree true — ready to send to an API.' },
  { t: 'Why the updater form — measured', body: two(tsx(`// ✗ both calls read the SAME snapshot f
setF({ ...f, ten: 'An' });
setF({ ...f, email: 'an@vd.vn' });

// ✓ each call receives the previous result
setF((p) => ({ ...p, ten: 'An' }));
setF((p) => ({ ...p, email: 'an@vd.vn' }));`, { hl: [2, 3, 6, 7] }),
      D(B('dk-mau1', { vp: 640, h: 240, w: 520, url: 'localhost:3000/dang-ky · "điền mẫu (…f)"', mark: [[32, 207, 250, 23, '']] }),
        tn([`…f      → ${KQ.mau1}`, `prev =>  → ${KQ.mau2}`].join('\n'), { fs: 15, title: 'measured' }))) +
    box('The second write erased the first', 'Inside one event, <code>f</code> is a snapshot. Both spreads start from <code>{ ten: \'\', email: \'\' }</code>, so the second call puts the empty <code>ten</code> back. The updater form chains the writes: nothing is lost. Autofill, "fill sample data" buttons and multi-field resets hit exactly this.', 'do2'),
    en: 'Why the updater form, measured. A fill-sample button sets two fields in one click. Written with spread of f twice, both calls read the same snapshot, so the second one puts the empty name back: only the email survives. Written with the updater form, each call receives the previous result and both fields arrive. Autofill and multi-field resets hit exactly this.' },
  { t: 'select and textarea are controlled the same way', body: tn(['$ node select-html.cjs   # renderToStaticMarkup', ...O('html').split('\n').filter((l) => !l.startsWith('$'))].join('\n'), { fs: 16, title: 'terminal — react-dom/server 19.3.0' }) +
    cmp(['Control', 'In HTML you write', 'In React you write', 'React renders'], [
      ['<code>&lt;select&gt;</code>', '<code>selected</code> on an <code>&lt;option&gt;</code>', '<code>value</code> on the <code>&lt;select&gt;</code>', '<code>selected=""</code> on the matching option'],
      ['<code>&lt;textarea&gt;</code>', 'text between the tags', '<code>value</code> prop', 'the value as its content'],
      ['checkbox', '<code>checked</code> attribute', '<code>checked</code> (boolean) + read <code>e.target.checked</code>', '<code>checked=""</code>'],
    ], { hl: [2] }),
    en: 'select and textarea are controlled the same way. In React — unlike HTML — a select is controlled with value on the select itself, not selected on an option; a textarea uses the value prop, not text between the tags. Rendered for real, React puts selected on the matching option and writes the textarea’s value as its content — but you never write those yourself. The checkbox is the exception: it uses checked, a boolean, and onChange reads e dot target dot checked.' },
  { t: 'The checkbox exception — measured', body: two(D(tsx(`// ✗ the generic handler reads value
onChange={(e) => setV((p) => ({ ...p,
  [e.target.name]: e.target.value }))}

// ✓ a checkbox reports checked
onChange={(e) => setForm((prev) => ({ ...prev,
  [e.target.name]: e.target.checked }))}`, { sm: true, hl: [3, 7] })),
      D(tn([`click 1 → ${KQ.cb1}`, `click 2 → ${KQ.cb2}`].join('\n'), { fs: 16, title: 'measured — clicked twice' }),
        box('"on", forever', 'A checkbox without a <code>value</code> attribute reports <code>e.target.value === "on"</code> whether it is ticked or not. The state never becomes <code>false</code> — "I agree" is always on. Read <code>e.target.checked</code>.', 'do2'))),
    en: 'The checkbox exception, measured. Plugging a checkbox into the generic handler that reads value: click once, the state says agree equals on; click again to untick, it still says on. A checkbox without a value attribute reports the string on whether it is ticked or not, so “I agree” is always on. Read e dot target dot checked instead.' },
  { t: 'Submitting a form without a reload', body: steps([
      '<b>Handle onSubmit on the form</b> — not onClick on the button. It catches Enter and the button, and screen readers announce it as a form (Lesson 4.1 measured implicit submission)',
      `<b>Call ${c('e.preventDefault()')} first</b> — the very first line, before any ${c('await')}. Otherwise the browser does a full navigation and your handler's work is thrown away`,
      '<b>Disable the button while submitting</b> — a second submit creates a second order. The cheapest fix for the most expensive bug in this lesson',
      '<b>Then show the outcome</b> — success, or the server\'s error message. A form that seems to do nothing is indistinguishable from a broken one',
    ]) + box('Later in this course', 'Chapter 16 replaces the hand-written version with react-hook-form + zod; Chapter 12 with Server Actions. All of them stand on this: inputs whose values live in state.', 'lam'),
    en: 'Submitting a form without a reload, in four steps. Handle onSubmit on the form, not onClick on the button. Call e dot preventDefault first — the very first line, before any await. Disable the button while submitting, because a second submit creates a second order. And then show the outcome, success or the server’s error. Chapter sixteen replaces the hand-written version with react-hook-form and zod, Chapter twelve with Server Actions.' },
  { t: 'The await trap: preventDefault too late — measured', body: two(tsx(`async function onSubmit(e) {
  await cho(300);
  e.preventDefault();      // ✗ too late
  setN((x) => x + 1);
}

// ✓ preventDefault on the FIRST line
async function onSubmit(e) {
  e.preventDefault();
  await check();
}`, { sm: true, hl: [3, 9] }),
      D(tn([`type "x", Enter →`, `URL:        ${host(MUON[0])}`, `screen:     ${MUON[1]}`, `navigation: ${MUON[2]}`].join('\n'), { fs: 15, wrap: 50, title: 'measured — next start' }),
        box('Why', 'React dispatches the event synchronously. By the time the promise resolves, the browser has already decided to navigate: the page reloads, the counter never moves, and on a slow network the request is cancelled mid-flight.', 'do2'))) +
    path([{ t: 'Enter', s: 'submit event' }, { t: 'onSubmit runs', s: 'hits await, returns' }, { t: 'browser', s: 'default ⇒ navigate', mau: '#c0392b', on: true }, { t: '+300 ms', s: 'preventDefault: too late', mau: '#94a3b8' }], { h: 130, fs: 19 }),
    en: 'The await trap, measured. An async submit handler that awaits first and calls preventDefault afterwards is too late. Typing x and pressing Enter: the URL becomes question mark q equals x, the counter still says zero, and the navigation type is navigate — the page reloaded. React dispatches the event synchronously; by the time the promise resolves, the browser has already navigated. preventDefault goes on the first line, before any await, every time.' },
  { t: 'Disable while submitting — measured', body: two(tsx(`async function datHang(khoa) {
  if (khoa) setDang(true);
  const so = ++soDon;
  await cho(500);              // fake API call
  setLog((l) => [...l, \`đơn #\${so}\`]);
  if (khoa) setDang(false);
}
<button disabled={dang} onClick={() => datHang(true)}>`, { sm: true, hl: [2, 8] }),
      D(tn(['two clicks 80 ms apart on each button:', `→ ${KQ.hai}`].join('\n'), { fs: 15, wrap: 46, title: 'measured — Chromium' }),
        cmp(['Button', 'Two quick clicks ⇒'], [['no lock', '<b>2 orders</b> (#1, #2)'], ['<code>disabled={dang}</code>', '<b>1 order</b> (#3) — the 2nd click hit a disabled button']], { hl: [1] }))) +
    path([{ t: 'click 1', s: 'datHang(true)' }, { t: 'setDang(true)', s: 're-render' }, { t: 'disabled', s: 'button greyed out', on: true }, { t: 'click 2 (80 ms)', s: 'ignored — no order', mau: '#15803d' }], { h: 130, fs: 19 }) +
    box('Cheapest fix, most expensive bug', 'A double click is two real events. Without the lock both reach the API; with it, the re-render between them disables the button. (Server-side, still make the operation idempotent — Chapter 12.)', 'xanh'),
    en: 'Disable while submitting, measured. Each button sends a fake order that takes half a second. Clicking each button twice, eighty milliseconds apart: the unlocked button produced two orders, number one and number two; the locked one produced a single order, because the re-render between the clicks disabled it. The cheapest fix for the most expensive bug — and on the server, still make the operation idempotent.' },
  { t: 'How cuongthai.com does it — and what comes next', body: tiers([
      ['search', 'Small: search box, rename dialog', 'one or two useState right there (Lesson 4.2)', '#0070f3'],
      ['layers', 'Bigger: sign-up, profile, CV builder', 'react-hook-form + a zod schema (Ch 16)', '#15803d'],
      ['server', 'Mutations on the server', 'Server Actions, same form (Ch 12)', '#7c3aed'],
    ], { th: 70, gap: 26 }) + box('Same mental model', 'Libraries remove the repetition once a form has more than a few fields — the idea underneath is still "the input\'s value lives in state, one submit handles it".', 'lam'),
    en: 'How cuongthai.com does it. Small forms — a search box, a rename dialog — use one or two useState right there, like Lesson four point two. Bigger forms — sign-up, profile, the CV builder — use react-hook-form so fields are registered instead of wired by hand, with a zod schema checked on submit. The mental model is identical; the library just removes the repetition.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Form state', 'one object holding every field\'s value'), kw('Shared onChange', 'one handler keyed by e.target.name'),
      kw('Computed key', '{ ...prev, [name]: value }'), kw('Updater form', 'setForm(prev => …) — never lose a field'),
      kw('checked', 'the checkbox\'s boolean — value is just "on"'), kw('onSubmit', 'form-level event; preventDefault() on the first line'),
      kw('Validation', 'check values before accepting the submit'), kw('Double submit', 'two orders from two clicks — disable while pending'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: form state; shared onChange; computed key; updater form; checked; onSubmit; validation; and double submit.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Build name + email + message with ONE state object and one ${c('onChange')} keyed by ${c('name')}`,
      `Submit with ${c('onSubmit')} + ${c('e.preventDefault()')} and log the whole object`,
      'Add a required-field check and show the error next to the empty field',
      `Add a checkbox — read ${c('checked')}; add a fake slow submit and disable the button while it runs`,
    ]), box('Keep these', `<ul><li>One object, one handler keyed by <code>name</code></li><li>Updater form when the new state builds on the old</li><li>Checkbox ⇒ <code>checked</code>, not <code>value</code></li><li><code>preventDefault()</code> first; disable while submitting</li></ul>`, 'lam'), ''),
    en: 'Your turn: build name, email and message with one state object and one onChange keyed by name; submit with onSubmit and preventDefault and log the object; add a required-field check with the error next to the field; and add a checkbox reading checked, plus a slow submit with the button disabled while it runs. Keep: one object, one handler keyed by name; the updater form; checked for checkboxes; preventDefault first and disable while submitting.' },
];
export const slides = lamDeck({ chuong: 'Chapter 4 — Events & controlled forms', bai: '4.3' }, S);
