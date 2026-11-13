/*DU_LIEU*/
const DU_LIEU = {
 "n4-4:file:src/app/khong-kiem-soat/page.tsx": "'use client';\nimport { useEffect, useRef, useState } from 'react';\n\nconst lan = { coKS: 0, khongKS: 0 };\n\nfunction CoKiemSoat() {\n  lan.coKS++;\n  const [q, setQ] = useState('');\n  return <p>có kiểm soát: <input id=\"ks\" className=\"rounded border px-2\" value={q} onChange={(e) => setQ(e.target.value)} /> <span id=\"ks-lan\">render {lan.coKS}</span></p>;\n}\n\nfunction SearchForm() {\n  lan.khongKS++;\n  const inputRef = useRef<HTMLInputElement>(null);\n  const [doc, setDoc] = useState('');\n  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {\n    e.preventDefault();\n    const fd = Object.fromEntries(new FormData(e.currentTarget));   // cách 2: FormData\n    setDoc(`ref: \"${inputRef.current!.value}\" · FormData: ${JSON.stringify(fd)}`);\n  }\n  return (\n    <form onSubmit={handleSubmit}>\n      không kiểm soát: <input id=\"kks\" name=\"q\" ref={inputRef} defaultValue=\"\" className=\"rounded border px-2\" />\n      <button id=\"tim\" className=\"ml-2 rounded border px-2\">Tìm</button> <span id=\"kks-lan\">render {lan.khongKS}</span>\n      <span id=\"kks-doc\" className=\"block text-sm\">{doc}</span>\n    </form>\n  );\n}\n\nfunction FocusVaHop() {\n  const oRef = useRef<HTMLInputElement>(null);\n  const demRef = useRef(0);\n  const [, setLai] = useState(0);\n  return (\n    <p>\n      <input id=\"o-focus\" ref={oRef} className=\"rounded border px-2\" />\n      <button id=\"focus\" className=\"ml-2 rounded border px-2\" onClick={() => oRef.current!.focus()}>focus ô</button>\n      <button id=\"ref1\" className=\"ml-2 rounded border px-2\" onClick={() => { demRef.current++; }}>ref +1</button>\n      <button id=\"ve\" className=\"ml-2 rounded border px-2\" onClick={() => setLai((x) => x + 1)}>render lại</button>\n      <span id=\"ref-kq\" className=\"ml-2\">ref.current = {demRef.current}</span>\n    </p>\n  );\n}\n\nfunction TepTin() {\n  const fRef = useRef<HTMLInputElement>(null);\n  const [ten, setTen] = useState('');\n  return <p>tệp: <input id=\"tep\" type=\"file\" ref={fRef} onChange={() => setTen(fRef.current!.files![0]!.name)} /> <span id=\"tep-kq\">{ten}</span></p>;\n}\n\nfunction DuLieuCham() {\n  const [user, setUser] = useState<{ name: string } | null>(null);\n  useEffect(() => { const t = setTimeout(() => setUser({ name: 'An' }), 1500); return () => clearTimeout(t); }, []);\n  return <p>hồ sơ (tải 1,5 s): <input id=\"cham\" className=\"rounded border px-2\" value={user?.name} onChange={(e) => setUser({ name: e.target.value })} /></p>;   // ✗ undefined lúc đầu\n}\n\nexport default function KhongKiemSoat() {\n  return (\n    <div className=\"space-y-2 p-6 font-sans text-lg\">\n      <CoKiemSoat />\n      <SearchForm />\n      <FocusVaHop />\n      <TepTin />\n      <DuLieuCham />\n    </div>\n  );\n}\n",
 "n4-4:file:src/app/khong-kiem-soat/tep-gia-tri.tsx": "'use client';\nexport function TepCoValue() {\n  return <input type=\"file\" value=\"C:\\\\a.txt\" onChange={() => {}} />;\n}\n",
 "n4-4:file:tep-thu.txt": "xin chào\n",
 "n4-4:trang": "$ npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npm run build 2>&1 | grep -E 'Compiled|khong-kiem-soat'\n✓ Compiled successfully in 809ms\n├ ○ /khong-kiem-soat\n$ curl -s -o /dev/null -w 'GET /khong-kiem-soat → %{http_code}\\n' localhost:19337/khong-kiem-soat\nGET /khong-kiem-soat → 200",
 "n4-4:dung": "",
 "n4-4:file:src/app/tep-value/page.tsx": "import { TepCoValue } from '../khong-kiem-soat/tep-gia-tri';\n\nexport default function Page() {\n  return <div className=\"p-6 font-sans text-lg\">tệp có value: <TepCoValue /></div>;\n}\n",
 "n4-4:dev": "$ curl -s -o /dev/null -w 'GET /tep-value → %{http_code}\\n' localhost:19336/tep-value\nGET /tep-value → 200",
 "n4-4:dungdev": "",
 "anh-nxj-4-4:kks-ref": {
  "url": "http://127.0.0.1:19337/khong-kiem-soat",
  "vp": [
   640,
   330
  ],
  "rect": {
   "#ks": [
    138,
    24,
    245,
    30
   ],
   "#ks-lan": [
    388,
    27,
    69,
    23
   ],
   "#kks": [
    170,
    62,
    245,
    30
   ],
   "#tim": [
    423,
    62,
    48,
    30
   ],
   "#kks-lan": [
    475,
    65,
    69,
    23
   ],
   "#kks-doc": [
    24,
    92,
    592,
    20
   ],
   "#o-focus": [
    24,
    120,
    245,
    30
   ],
   "#focus": [
    277,
    120,
    78,
    30
   ],
   "#ref1": [
    363,
    120,
    62,
    30
   ],
   "#ve": [
    434,
    120,
    95,
    30
   ],
   "#ref-kq": [
    32,
    152,
    115,
    23
   ],
   "#tep": [
    62,
    186,
    406,
    28
   ],
   "#tep-kq": [
    468,
    188,
    0,
    23
   ],
   "#cham": [
    155,
    222,
    245,
    30
   ]
  },
  "console": []
 },
 "anh-nxj-4-4:kks-sau": {
  "url": "http://127.0.0.1:19337/khong-kiem-soat",
  "vp": [
   640,
   330
  ],
  "rect": {
   "#ks": [
    138,
    24,
    245,
    30
   ],
   "#ks-lan": [
    388,
    27,
    69,
    23
   ],
   "#kks": [
    170,
    62,
    245,
    30
   ],
   "#tim": [
    423,
    62,
    48,
    30
   ],
   "#kks-lan": [
    475,
    65,
    69,
    23
   ],
   "#kks-doc": [
    24,
    92,
    592,
    20
   ],
   "#o-focus": [
    24,
    120,
    245,
    30
   ],
   "#focus": [
    277,
    120,
    78,
    30
   ],
   "#ref1": [
    363,
    120,
    62,
    30
   ],
   "#ve": [
    434,
    120,
    95,
    30
   ],
   "#ref-kq": [
    32,
    152,
    114,
    23
   ],
   "#tep": [
    62,
    186,
    406,
    28
   ],
   "#tep-kq": [
    472,
    188,
    89,
    23
   ],
   "#cham": [
    155,
    222,
    245,
    30
   ]
  },
  "console": [],
  "ketQua": {
   "chamTruoc": "xyz",
   "chamSau": "An",
   "ksLan": "render 6",
   "kksLan": "render 1",
   "kksDoc": [
    "ref: \"abcde\" · FormData: {\"q\":\"abcde\"}",
    "render 2"
   ],
   "focus": "o-focus",
   "refTruoc": "ref.current = 0",
   "refSau": "ref.current = 3",
   "tep": "tep-thu.txt"
  }
 },
 "anh-nxj-4-4:tep-loi": {
  "url": "http://127.0.0.1:19336/tep-value",
  "vp": [
   900,
   560
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
   }
  ],
  "ketQua": {
   "tep": [
    "",
    "C:\\\\a.txt",
    "<input type=\"file\" value=\"C:\\\\a.txt\">"
   ]
  }
 },
 "anh-nxj-4-4:cham-dev": {
  "url": "http://127.0.0.1:19336/khong-kiem-soat",
  "vp": [
   900,
   560
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
    "kieu": "pageerror",
    "chu": "Hydration failed because the server rendered text didn't match the client. As a result this tree will be regenerated on the client. This can happen if a SSR-ed Client Component used:\n\n- A server/client branch `if (typeof window !== 'undefined')`.\n- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.\n- Date formatting in a user's locale which doesn't match the server.\n- External changing data without sending a snapshot of it along with the HTML.\n- Invalid HTML tag nesting.\n\nIt can also happen if the client has a browser extension installed which messes with the HTML before React loaded.\n\nhttps://react.dev/link/hydration-mismatch\n\n  ...\n    <ErrorBoundary errorComponent={undefined} errorStyles={undefined} errorScripts={undefined}>\n      <LoadingBoundary name=\"khong-kiem...\" loading={null}>\n        <HTTPAccessFallbackBoundary notFound={undefined} forbidden={undefined} unauthorized={undefined}>\n          <RedirectBoundary>\n            <RedirectErrorBoundary router={{...}}>\n              <InnerLayoutRouter url=\"/khong-kie...\" tree={[...]} params={{}} renderTree={{...}} segmentPath={[...]} ...>\n                <SegmentViewNode type=\"page\" pagePath=\"khong-kiem...\">\n                  <SegmentTrieNode>\n                  <ClientPageRoot Component={function KhongKiemSoat} serverProvidedParams={{...}}>\n                    <KhongKiemSoat params={Promise} searchParams={Promise}>\n                      <div className=\"space-y-2 ...\">\n                        <CoKiemSoat>\n                          <p>\n                            <input>\n                            <span id=\"ks-lan\">\n+                             2\n-                             1\n                        ...\n                ...\n              ...\n"
   },
   {
    "kieu": "error",
    "chu": "A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://react.dev/link/controlled-components"
   }
  ],
  "ketQua": {
   "chamSau": "An"
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, br, box, two, steps, kw, c, icards, cmp, meter, vsd } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-04-4', code: 'NXJ 4.4', title: 'Controlled vs uncontrolled, and refs', sub: 'Chapter 4 · Lesson 4.4' };
const O = (k) => { const v = DU_LIEU[`n4-4:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const AN = (k) => { const v = DU_LIEU[`anh-nxj-4-4:${k}`]; if (v === undefined) throw new Error('thiếu ảnh ' + k); return v; };
const B = (ten, o) => br('nxj-04-4', ten, o);
const D = (...a) => `<div>${a.join('')}</div>`;
const KQ = AN('kks-sau').ketQua, TEP = AN('tep-loi').ketQua.tep;
const CANH = AN('cham-dev').console.find((x) => x.kieu === 'error' && /uncontrolled input to be controlled/.test(x.chu)).chu;
const P = O('file:src/app/khong-kiem-soat/page.tsx');
for (const s of ['<input id="kks" name="q" ref={inputRef} defaultValue=""', 'Object.fromEntries(new FormData(e.currentTarget))', 'onClick={() => { demRef.current++; }}', 'value={user?.name}', "setTimeout(() => setUser({ name: 'An' }), 1500)"])
  if (!P.includes(s)) throw new Error('page.tsx không có: ' + s);
const so = (t) => +t.replace(/\D+/g, '');
if (so(KQ.ksLan) !== 6 || so(KQ.kksLan) !== 1 || KQ.chamSau !== 'An' || KQ.chamTruoc !== 'xyz' || TEP[0] !== '') throw new Error('số đo 4.4 đổi — xem lại slide');

export const S = [
  { cover: true, nhan: 'Chapter 4 · Lesson 4.4', t: 'Controlled vs<br>uncontrolled, and refs', sub: 'The other kind of input — the DOM holds the value — and useRef, the escape hatch to the real DOM node',
    en: 'Lesson four point four: controlled versus uncontrolled, and refs. Controlled inputs are the default and almost always right, but there is a second kind — uncontrolled — where the DOM holds the value and you read it when you need it. Knowing both, plus useRef, rounds off forms.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Uncontrolled: <code>defaultValue</code> + a ref, or <code>FormData</code>, read on submit</li>
    <li>Renders per keystroke, controlled vs uncontrolled — <b>measured</b></li>
    <li>File inputs: always uncontrolled — <b>measured</b></li>
    <li>useRef's two jobs: reach a DOM node · remember without re-rendering</li>
    <li>The trap: a controlled input fed by data that has not loaded yet — <b>measured</b></li></ul>`,
    en: 'Five takeaways: uncontrolled inputs read on submit with a ref or FormData; renders per keystroke measured; file inputs, always uncontrolled; useRef’s two jobs; and the trap of a controlled input fed by data that has not loaded yet, measured.' },
  { t: 'Uncontrolled: let the DOM hold the value', body: two(tsx(`function SearchForm() {
  const inputRef = useRef(null);
  function handleSubmit(e) {
    e.preventDefault();
    inputRef.current.value;          // 1 · a ref
    Object.fromEntries(              // 2 · FormData
      new FormData(e.currentTarget));
  }
  return (
    <form onSubmit={handleSubmit}>
      <input name="q" ref={inputRef} defaultValue="" />
      <button>Tìm</button>
    </form>
  );
}`, { sm: true, hl: [5, 6, 11] }),
      D(B('kks-sau', { vp: 640, h: 115, w: 470, url: 'localhost:3000/khong-kiem-soat · typed "abcde", Tìm', mark: [[170, 62, 245, 30, ''], [24, 92, 592, 20, '']] }),
        tn(KQ.kksDoc[0], { fs: 15, wrap: 48, title: 'what submit read — measured' }))) +
    box('No value, no onChange', '<code>defaultValue</code> sets the starting text without locking it; the DOM manages every keystroke. You read the value once, when you need it — through a ref or <code>FormData</code>.', 'lam'),
    en: 'An uncontrolled input has no value prop and no onChange. It manages its own text, just like a plain HTML input. defaultValue sets the starting text without locking it, and you read the value when you need it: through a ref, inputRef dot current dot value, or with FormData on the form. Measured: typing a b c d e and pressing search, both ways read abcde.' },
  { t: 'Renders per keystroke — measured', body: meter([
      ['controlled — after typing "abcde"', so(KQ.ksLan), '#0070f3', ''],
      ['uncontrolled — after typing "abcde"', so(KQ.kksLan), '#15803d', 'no state'],
      ['uncontrolled — after submit', so(KQ.kksDoc[1]), '#15803d', 'setDoc()'],
    ], { don: 'renders', nhan: 420, rh: 84, fs: 24 }) + two(
      box('Why: 1 + 5 keys', 'A controlled input is a state update per key — each one re-renders the component. The uncontrolled one never asks React: the browser edits the DOM directly.', 'lam'),
      box('Does it matter?', 'For one search box, no. On a long form with expensive children it can be measurable — but measure first (Chapter 7) before trading away live validation.', 'cam')),
    en: 'Renders per keystroke, measured under next start with a render counter. After typing five characters, the controlled field’s component had rendered six times: once initially and once per key. The uncontrolled one rendered once, and a second time only when submit displayed the result. For one search box it does not matter; on a long form with expensive children it can — measure first.' },
  { t: 'Which one, when', body: cmp(['', 'Controlled', 'Uncontrolled'], [
      ['Who holds the value', 'React state', 'the DOM'],
      ['You read it', 'any time — it is a variable', 'on demand: a ref or FormData'],
      ['Re-render per keystroke', 'yes', 'no'],
      ['Live validation, formatting, dependent fields', '✓ natural', '✗ awkward'],
      ['Good for', 'almost every form', 'a simple read-on-submit form · a non-React widget · <b>file inputs</b>'],
    ], { hl: [4] }) + box('When in doubt, controlled', 'The few extra lines buy every "react to the input" feature for free, and consistency across a codebase matters more than saving three lines in one form.', 'xanh'),
    en: 'Which one, when. Controlled: React state holds the value, you can read it any time, it re-renders per keystroke, and live validation, formatting and dependent fields come naturally — almost every form. Uncontrolled: the DOM holds the value, you read it on demand, no re-render per key — good for a simple read-on-submit form, a non-React widget, and file inputs. When in doubt, choose controlled.' },
  { t: 'File inputs are always uncontrolled — measured', body: two(tsx(`function TepTin() {
  const fRef = useRef(null);
  const [ten, setTen] = useState('');
  return <input type="file" ref={fRef}
    onChange={() =>
      setTen(fRef.current.files[0].name)} />;
}`, { hl: [6] }), D(tn(`picked a file → ten = "${KQ.tep}"`, { fs: 16, title: 'measured — reading through a ref' }),
      tn([`server HTML : ${TEP[2]}`, `input.value : "${TEP[0]}"  ← ignored`].join('\n'), { fs: 14, wrap: 50, title: 'next dev — trying value="C:\\\\a.txt"' }))) +
    tsx(`<input type="file" value="C:\\\\a.txt" onChange={…} />   // ✗ trying to control a file input`, { hl: [1] }) +
    box('You cannot set a file by code', 'Browsers only let the user pick a file; a script may only clear it. So a file input is uncontrolled by nature: read <code>.files</code> through a ref (or <code>FormData</code>) — Chapter 16 uploads it.', 'cam'),
    en: 'File inputs are always uncontrolled, measured. You read the chosen file through a ref: picking a file gave its name, tep-thu dot txt. And if you try to control it with a value, React puts the attribute in the server HTML, but the browser ignores it: input dot value stays empty. Browsers only let the user pick a file; a script may only clear it. Chapter sixteen uploads it.' },
  { t: 'useRef, job 1: reach a DOM node', body: two(tsx(`const oRef = useRef(null);

<input ref={oRef} />
<button onClick={() => oRef.current.focus()}>
  focus ô
</button>`, { hl: [4] }), D(tn(`click "focus ô" → document.activeElement.id = "${KQ.focus}"`, { fs: 15, wrap: 52, title: 'measured' }),
      icards([
        ['eye', 'Focus', `${c('ref.current.focus()')} — the first field of a form`],
        ['layers', 'Scroll & measure', `${c('scrollIntoView()')}, ${c('getBoundingClientRect()')}`],
        ['power', 'Media', `${c('videoRef.current.play()')}`],
      ], 1))),
    en: 'useRef’s first job: reach a DOM node. React hands you the real node through the ref prop, so you can call DOM methods on it. Measured: clicking the focus button moved focus to the input. The same pattern scrolls an element into view, measures its size, or plays a video.' },
  { t: 'useRef, job 2: remember, don\'t re-render', body: two(tsx(`const demRef = useRef(0);
const [, setLai] = useState(0);

<button onClick={() => { demRef.current++; }}>
  ref +1</button>
<button onClick={() => setLai((x) => x + 1)}>
  render lại</button>
<span>ref.current = {demRef.current}</span>`, { sm: true, hl: [4] }),
      D(B('kks-ref', { vp: 640, h: 180, w: 470, url: 'after 3 × "ref +1"', mark: [[32, 152, 114, 23, '']] }),
        tn([`3 × ref +1   → ${KQ.refTruoc}`, `render lại   → ${KQ.refSau}`].join('\n'), { fs: 15, title: 'measured' }))) +
    box('A box React does not watch', 'Writing <code>ref.current</code> changes the value but schedules no render — the screen showed 0 until something else re-rendered. Unlike a local variable, the ref survives renders: it was still 3.', 'lam'),
    en: 'useRef’s second job: remember a value across renders without re-rendering. Clicking ref plus one three times changed demRef dot current to three, but the screen still said zero — writing a ref schedules no render. Clicking the re-render button revealed three. Unlike a local variable, the ref survived those renders.' },
  { t: 'State or ref? One question', body: cmp(['Value', 'Should changing it update the screen?', 'So it is'], [
      ['a visible counter', 'yes', '<b>state</b>'],
      ['the text of a live-validated input', 'yes', '<b>state</b>'],
      ['an interval / timer id you will clear later', 'no', '<b>ref</b>'],
      ['the previous value of a prop', 'no', '<b>ref</b>'],
      ['a WebSocket instance, a DOM node', 'no', '<b>ref</b>'],
    ], { hl: [2] }) + box('The one-line rule', 'If changing it should update the screen, it is state; if not, it is a ref. Chapter 6 goes deeper into useRef.', 'xanh'),
    en: 'State or ref? One question: should changing it update the screen? A visible counter — yes, state. The text of a live-validated input — state. An interval id you will clear later — no, a ref. The previous value of a prop, a WebSocket instance, a DOM node — refs. Chapter six goes deeper.' },
  { t: 'The trap: data that has not loaded yet — measured', body: two(D(tsx(`const [user, setUser] = useState(null);
useEffect(() => { /* loads after 1.5 s */ }, []);

<input value={user?.name}            // ✗ undefined first
  onChange={(e) => setUser({ name: e.target.value })} />

<input value={user?.name ?? ''} … />  // ✓ always a string`, { sm: true, hl: [4, 7] }),
      tn([`typed "xyz" while loading → "${KQ.chamTruoc}"`, `1.5 s later, data arrives  → "${KQ.chamSau}"   (typing lost)`].join('\n'), { fs: 14, wrap: 54, title: 'measured — next start (no warning)' })),
      D(tn(CANH, { fs: 13, wrap: 58, title: 'next dev · console.error' }),
        box('What happened', '<code>undefined</code> made the input uncontrolled, so the user could type. When the data arrived it flipped to controlled and React wrote <b>An</b> over the typed text. Fix: <code>?? \'\'</code>, or do not render the form until the data is there.', 'do2'))),
    en: 'The trap: a controlled input fed by data that has not loaded yet. value equals user question-dot name is undefined on the first render, so React treats the input as uncontrolled and the user can type. Measured: typing x y z while loading, then the data arrived after one and a half seconds — the input flipped to controlled and showed An; the typing was thrown away. Dev logs the uncontrolled-to-controlled warning; production says nothing. Fix with a fallback empty string, or render the form only when the data is there.' },
  { t: 'Choose by what you need WHILE the user types', body: steps([
      '<b>Controlled</b> — React state holds the value. Pick it for live validation, a character counter, a dependent field, or a preview that updates as they type',
      '<b>Uncontrolled</b> — the DOM holds the value; read it on submit with a ref or <code>FormData</code>. Pick it for a simple form where nothing reacts until submit',
      '<b>Uncontrolled renders less</b> — no re-render per keystroke (measured: 6 vs 1). On a long form that is measurable — measure before you assume it matters',
      `<b>Don't switch mid-life</b> — going from ${c('undefined')} to a value flips an input to controlled and React warns. Start with ${c("''")}`,
    ]) + box('Stage 1 complete', 'JSX, components, props and children, state, events and controlled forms — the whole React foundation. Progress test 1 in the Exam Room covers Chapters 1–4; Stage 2 goes deeper into hooks, starting with useEffect.', 'lam'),
    en: 'Choose by what you need while the user types. Controlled for live validation, a character counter, a dependent field or a live preview. Uncontrolled for a simple form where nothing reacts until submit. Uncontrolled renders less — six versus one, measured — but measure before you assume it matters. And never switch mid-life: start with an empty string. That completes Stage one; progress test one covers Chapters one to four.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Controlled', 'React state drives the value (value + onChange)'), kw('Uncontrolled', 'the DOM holds the value; you read it when needed'),
      kw('defaultValue', 'the starting value of an uncontrolled input'), kw('useRef', 'a box whose .current survives renders without causing one'),
      kw('ref prop', 'React hands you the real DOM node'), kw('FormData', 'read a whole uncontrolled form on submit'),
      kw('File input', 'always uncontrolled — its value cannot be set by code'), kw('?? \'\'', 'keep a controlled input controlled before data loads'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: controlled; uncontrolled; defaultValue; useRef; the ref prop; FormData; file input; and the empty-string fallback.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'Build the same input twice: controlled (value/onChange) and uncontrolled (defaultValue + a ref read on submit)',
      `Read the uncontrolled value with ${c('inputRef.current.value')} and with ${c('FormData')} — only on submit`,
      'Count renders while typing in each; then add a file input and read its name through a ref',
      `Feed a controlled input from data that loads later — see the typing vanish — fix it with ${c("?? ''")}`,
    ]), box('Keep these', `<ul><li>Controlled is the default; uncontrolled reads on submit</li><li><code>defaultValue</code> for uncontrolled; file inputs are always uncontrolled</li><li>Screen should change ⇒ state; otherwise ⇒ ref</li><li>Never let <code>value</code> start as <code>undefined</code></li></ul>`, 'lam'), ''),
    en: 'Your turn: build the same input controlled and uncontrolled; read the uncontrolled one with a ref and with FormData on submit; count renders while typing, then read a file input’s name; and feed a controlled input from late data, watch the typing vanish, and fix it. Keep: controlled is the default; defaultValue for uncontrolled and file inputs are always uncontrolled; screen should change means state, otherwise a ref; never let value start as undefined.' },
];
export const slides = lamDeck({ chuong: 'Chapter 4 — Events & controlled forms', bai: '4.4' }, S);
