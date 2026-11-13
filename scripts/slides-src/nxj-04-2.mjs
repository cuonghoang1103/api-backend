/*DU_LIEU*/
const DU_LIEU = {
 "n4-2:file:input-html.cjs": "const React = require('react');\nconst { renderToStaticMarkup } = require('react-dom/server');\nconst h = React.createElement;\nconsole.log(renderToStaticMarkup(h('input', { value: 'hello', onChange: () => {} })));\nconsole.log(renderToStaticMarkup(h('input', { defaultValue: 'hello' })));\nconsole.log(renderToStaticMarkup(h('input', { value: 'hello', readOnly: true })));\n",
 "n4-2:html": "$ node input-html.cjs\n<input value=\"hello\"/>\n<input value=\"hello\"/>\n<input readOnly=\"\" value=\"hello\"/>",
 "n4-2:file:src/app/kiem-soat/page.tsx": "'use client';\nimport { useState } from 'react';\n\nfunction NameField() {\n  const [name, setName] = useState('');\n  const tooShort = name.length < 3;                      // suy ra, không lưu\n  return (\n    <div id=\"a\" className=\"rounded border p-2\">\n      <input id=\"ten\" className=\"rounded border px-2\" value={name} onChange={(e) => setName(e.target.value)} />\n      <button id=\"gui\" className=\"ml-2 rounded border px-2 disabled:opacity-40\" disabled={name.trim() === ''}>gửi</button>\n      <button id=\"xoa\" className=\"ml-2 rounded border px-2\" onClick={() => setName('')}>xoá</button>\n      <p id=\"xem\">xem trước: “{name}” · {tooShort ? 'quá ngắn (< 3)' : 'ổn'}</p>\n    </div>\n  );\n}\n\nfunction ChiDoc() {\n  const [text] = useState('Bình');\n  return <input id=\"chet\" className=\"rounded border px-2\" value={text} />;   // ✗ value mà không onChange\n}\n\nfunction VietHoa() {\n  const [s, setS] = useState('');\n  return <input id=\"hoa\" className=\"rounded border px-2\" value={s} onChange={(e) => setS(e.target.value.toUpperCase())} />;\n}\n\nfunction SoDienThoai() {\n  const [so, setSo] = useState('');\n  const dep = so.replace(/^(\\d{4})(\\d{0,3})(\\d{0,3}).*/, (_, a, b, c) => [a, b, c].filter(Boolean).join(' '));\n  return <input id=\"sdt\" className=\"rounded border px-2\" value={dep} onChange={(e) => setSo(e.target.value.replace(/\\D/g, '').slice(0, 10))} />;\n}\n\nfunction BatDauNull() {\n  const [v, setV] = useState<string | null>(null);         // ✗ khởi tạo null\n  return <input id=\"null\" className=\"rounded border px-2\" value={v as string} onChange={(e) => setV(e.target.value)} />;\n}\n\nexport default function KiemSoat() {\n  return (\n    <div className=\"space-y-2 p-6 font-sans text-lg\">\n      <NameField />\n      <p>chỉ value: <ChiDoc /></p>\n      <p>viết hoa: <VietHoa /></p>\n      <p>số điện thoại: <SoDienThoai /></p>\n      <p>bắt đầu null: <BatDauNull /></p>\n    </div>\n  );\n}\n",
 "n4-2:trang": "$ npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ curl -s -o /dev/null -w 'GET /kiem-soat → %{http_code}\\n' localhost:19333/kiem-soat\nGET /kiem-soat → 200",
 "n4-2:dung": "",
 "n4-2:prod": "$ npm run build 2>&1 | grep -E 'Compiled|kiem-soat'\n✓ Compiled successfully in 781ms\n├ ○ /kiem-soat\n$ curl -s -o /dev/null -w 'GET /kiem-soat → %{http_code}\\n' localhost:19334/kiem-soat\nGET /kiem-soat → 200",
 "n4-2:dungp": "",
 "anh-nxj-4-2:ks-ngan": {
  "url": "http://127.0.0.1:19333/kiem-soat",
  "vp": [
   640,
   330
  ],
  "rect": {
   "#a": [
    24,
    24,
    592,
    76
   ],
   "#ten": [
    33,
    33,
    245,
    30
   ],
   "#gui": [
    286,
    33,
    44,
    30
   ],
   "#xoa": [
    338,
    33,
    48,
    30
   ],
   "#xem": [
    33,
    63,
    574,
    28
   ],
   "#chet": [
    107,
    108,
    245,
    30
   ],
   "#hoa": [
    100,
    146,
    245,
    30
   ],
   "#sdt": [
    140,
    184,
    245,
    30
   ],
   "#null": [
    131,
    222,
    245,
    30
   ]
  },
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
    "chu": "You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`."
   },
   {
    "kieu": "error",
    "chu": "`value` prop on `%s` should not be null. Consider using an empty string to clear the component or `undefined` for uncontrolled components. input"
   }
  ]
 },
 "anh-nxj-4-2:ks-sau": {
  "url": "http://127.0.0.1:19333/kiem-soat",
  "vp": [
   640,
   330
  ],
  "rect": {
   "#a": [
    24,
    24,
    592,
    76
   ],
   "#ten": [
    33,
    33,
    245,
    30
   ],
   "#gui": [
    286,
    33,
    44,
    30
   ],
   "#xoa": [
    338,
    33,
    48,
    30
   ],
   "#xem": [
    33,
    63,
    574,
    28
   ],
   "#chet": [
    107,
    108,
    245,
    30
   ],
   "#hoa": [
    100,
    146,
    245,
    30
   ],
   "#sdt": [
    140,
    184,
    245,
    30
   ],
   "#null": [
    131,
    222,
    245,
    30
   ]
  },
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
    "chu": "You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`."
   },
   {
    "kieu": "error",
    "chu": "`value` prop on `%s` should not be null. Consider using an empty string to clear the component or `undefined` for uncontrolled components. input"
   },
   {
    "kieu": "error",
    "chu": "A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://react.dev/link/controlled-components"
   }
  ]
 },
 "anh-nxj-4-2:ks-xoa": {
  "url": "http://127.0.0.1:19333/kiem-soat",
  "vp": [
   640,
   330
  ],
  "rect": {
   "#a": [
    24,
    24,
    592,
    76
   ],
   "#ten": [
    33,
    33,
    245,
    30
   ],
   "#gui": [
    286,
    33,
    44,
    30
   ],
   "#xoa": [
    338,
    33,
    48,
    30
   ],
   "#xem": [
    33,
    63,
    574,
    28
   ],
   "#chet": [
    107,
    108,
    245,
    30
   ],
   "#hoa": [
    100,
    146,
    245,
    30
   ],
   "#sdt": [
    140,
    184,
    245,
    30
   ],
   "#null": [
    131,
    222,
    245,
    30
   ]
  },
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
    "chu": "You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`."
   },
   {
    "kieu": "error",
    "chu": "`value` prop on `%s` should not be null. Consider using an empty string to clear the component or `undefined` for uncontrolled components. input"
   },
   {
    "kieu": "error",
    "chu": "A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://react.dev/link/controlled-components"
   }
  ],
  "ketQua": {
   "an": [
    "xem trước: “An” · quá ngắn (< 3)",
    false
   ],
   "anh": [
    "xem trước: “Anh” · ổn",
    false
   ],
   "chiDoc": "Bình",
   "hoa": [
    "AXB",
    3
   ],
   "sdt": "0901 234 567",
   "xoa": [
    "",
    "xem trước: “” · quá ngắn (< 3)",
    true
   ]
  }
 },
 "anh-nxj-4-2:ks-loi1": {
  "url": "http://127.0.0.1:19333/kiem-soat",
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
    "kieu": "error",
    "chu": "You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`."
   },
   {
    "kieu": "error",
    "chu": "`value` prop on `%s` should not be null. Consider using an empty string to clear the component or `undefined` for uncontrolled components. input"
   },
   {
    "kieu": "error",
    "chu": "A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://react.dev/link/controlled-components"
   }
  ]
 },
 "anh-nxj-4-2:ks-loi2": {
  "url": "http://127.0.0.1:19333/kiem-soat",
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
    "kieu": "error",
    "chu": "You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`."
   },
   {
    "kieu": "error",
    "chu": "`value` prop on `%s` should not be null. Consider using an empty string to clear the component or `undefined` for uncontrolled components. input"
   },
   {
    "kieu": "error",
    "chu": "A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://react.dev/link/controlled-components"
   }
  ]
 },
 "anh-nxj-4-2:ks-loi3": {
  "url": "http://127.0.0.1:19333/kiem-soat",
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
    "kieu": "error",
    "chu": "You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`."
   },
   {
    "kieu": "error",
    "chu": "`value` prop on `%s` should not be null. Consider using an empty string to clear the component or `undefined` for uncontrolled components. input"
   },
   {
    "kieu": "error",
    "chu": "A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://react.dev/link/controlled-components"
   }
  ]
 },
 "anh-nxj-4-2:ks-prod": {
  "url": "http://127.0.0.1:19334/kiem-soat",
  "vp": [
   640,
   330
  ],
  "rect": {},
  "console": [],
  "ketQua": {
   "prod": [
    "Bình",
    "AXB",
    3
   ]
  }
 }
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, br, box, two, steps, kw, c, icards, cmp, seq, vsd } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-04-2', code: 'NXJ 4.2', title: 'Controlled inputs', sub: 'Chapter 4 · Lesson 4.2' };
const O = (k) => { const v = DU_LIEU[`n4-2:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const AN = (k) => { const v = DU_LIEU[`anh-nxj-4-2:${k}`]; if (v === undefined) throw new Error('thiếu ảnh ' + k); return v; };
const B = (ten, o) => br('nxj-04-2', ten, o);
const D = (...a) => `<div>${a.join('')}</div>`;
const KQ = AN('ks-xoa').ketQua, PROD = AN('ks-prod').ketQua.prod;
const LOI = AN('ks-xoa').console.filter((x) => x.kieu === 'error').map((x) => x.chu.replace('%s', 'input').replace(/ input$/, ''));
const PAGE = O('file:src/app/kiem-soat/page.tsx');
if (!PAGE.includes("onChange={(e) => setS(e.target.value.toUpperCase())}") || KQ.hoa[1] !== 3 || PROD[2] !== 3 || LOI.length !== 3) throw new Error('số đo 4.2 đổi — xem lại slide');

export const S = [
  { cover: true, nhan: 'Chapter 4 · Lesson 4.2', t: 'Controlled<br>inputs', sub: 'React state holds the value, the input displays it, every keystroke updates state. The DOM stops being the source of truth — your state is',
    en: 'Lesson four point two: controlled inputs. React state holds the value, the input displays it, and every keystroke updates state, which re-renders the input. The DOM stops being the source of truth — your state is.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The "two-way" wire that is really one way</li>
    <li>What state lets you do: validate, transform, disable, clear — <b>measured</b></li>
    <li>The caret jump when you transform — <b>measured</b></li>
    <li><code>value</code> without <code>onChange</code>: the frozen field, dev vs production</li>
    <li>Never start from <code>null</code>: the controlled ↔ uncontrolled flip</li></ul>`,
    en: 'Five takeaways: the two-way wire that is really one way; what state lets you do — validate, transform, disable, clear — measured; the caret jump when you transform, measured; value without onChange, the frozen field, in dev versus production; and never starting from null.' },
  { t: 'The "two-way" wire is really one way', body: two(tsx(`function NameField() {
  const [name, setName] = useState('');
  return (
    <input
      value={name}           // state → input
      onChange={(e) =>       // input → state
        setName(e.target.value)}
    />
  );
}`, { sm: true, hl: [5, 6, 7] }), seq(['keyboard', 'React state', '<input>'], [
      [0, 2, 'keystroke "a"', '#475569'],
      [2, 1, 'onChange(e) — a REQUEST', '#b85a2b'],
      [1, 1, "setName('a') ⇒ re-render", '#0070f3'],
      [1, 2, "value = 'a'   (state → input)", '#15803d'],
    ], { w: 560, rh: 62, fs: 17 })) +
    box('Read it as a loop', 'The input always shows <code>name</code>. A keystroke does not change the input by itself — it fires an event that <i>asks</i> state to change; the re-render then writes the new value back. Data only ever flows state → input.', 'xanh'),
    en: 'The two-way wire is really one way. Read it as a loop. The input’s value is always whatever name is. When the user types, onChange fires, you read e dot target dot value, and call setName. That re-renders the component, name is the new text, and the input shows it. It looks two-way, but data only flows from state to input; the keystroke is just an event asking state to change.' },
  { t: 'In the HTML, controlled and uncontrolled look the same', body: tn(['$ node input-html.cjs   # renderToStaticMarkup', ...O('html').split('\n').filter((l) => !l.startsWith('$'))].join('\n'), { fs: 18, title: 'terminal — react-dom/server 19.3.0' }) +
    cmp(['React element', 'Server HTML', 'Who owns the value in the browser'], [
      ["<code>&lt;input value=\"hello\" onChange={…} /&gt;</code>", '<code>&lt;input value="hello"/&gt;</code>', '<b>React state</b> — controlled'],
      ["<code>&lt;input defaultValue=\"hello\" /&gt;</code>", '<code>&lt;input value="hello"/&gt;</code> — identical', 'the <b>DOM</b> — uncontrolled (Lesson 4.4)'],
      ["<code>&lt;input value=\"hello\" readOnly /&gt;</code>", '<code>&lt;input readOnly="" value="hello"/&gt;</code>', 'nobody types — read-only on purpose'],
    ], { hl: [0] }) + box('The difference lives in React, not in the markup', 'The server HTML carries the value either way. What makes an input controlled is that React re-asserts <code>value</code> on every render.', 'lam'),
    en: 'In the HTML, controlled and uncontrolled look the same. Rendered on the server, an input with value and onChange and an input with defaultValue both become input value hello — identical markup. The difference lives in React: a controlled input has its value re-asserted from state on every render; an uncontrolled one leaves it to the DOM, which is Lesson four point four.' },
  { t: 'Why bother? Now state can do things — measured', body: two(D(tsx(`const tooShort = name.length < 3;           // derived
<button disabled={name.trim() === ''}>gửi</button>
<button onClick={() => setName('')}>xoá</button>
<p>xem trước: “{name}” · {tooShort ? 'quá ngắn' : 'ổn'}</p>`, { sm: true }),
      tn([`type "An"   → ${KQ.an[0]} · gửi disabled = ${KQ.an[1]}`, `type "h"    → ${KQ.anh[0]} · gửi disabled = ${KQ.anh[1]}`, `click xoá   → input = "${KQ.xoa[0]}" · gửi disabled = ${KQ.xoa[2]}`].join('\n'), { fs: 14, wrap: 70, title: 'Chromium — the same page, measured' })),
      D(B('ks-ngan', { vp: 640, h: 110, w: 440, url: 'localhost:3000/kiem-soat · typed "An"', mark: [[33, 63, 330, 28, '']] }))) +
    icards([
      ['check', 'Validate as you type', `${c('name.length < 3')} — a derived value, re-evaluated every keystroke`],
      ['wrench', 'Transform the input', 'uppercase, strip spaces, format a phone number'],
      ['lock', 'Disable the submit', `${c("disabled={name.trim() === ''}")}`],
      ['trash', 'Clear the form', `${c("setName('')")} — the input empties itself`],
    ], 4),
    en: 'Why bother? Because once the value lives in state, everything else is just data you already have. Measured on the same page: typing A n shows the live preview with “too short”, because tooShort is derived from name on every keystroke; typing h makes it OK; the submit button is disabled exactly while the trimmed name is empty; and clicking clear calls setName with an empty string — the input empties itself and the button disables again.' },
  { t: 'Transform on the way in — measured', body: two(tsx(`// uppercase every character that comes in
onChange={(e) => setS(e.target.value.toUpperCase())}

// digits only, max 10, shown as "0901 234 567"
onChange={(e) => setSo(
  e.target.value.replace(/\\D/g, '').slice(0, 10))}
const dep = so.replace(
  /^(\\d{4})(\\d{0,3})(\\d{0,3}).*/,
  (_, a, b, c) => [a, b, c].filter(Boolean).join(' '));`, { sm: true, hl: [2, 5, 6] }),
      D(B('ks-sau', { vp: 640, h: 250, w: 430, url: 'localhost:3000/kiem-soat', mark: [[100, 146, 245, 30, ''], [140, 184, 245, 30, '']] }),
        tn([`uppercase: a, b, ←, x → "${KQ.hoa[0]}"`, `phone: 0901a234567 → "${KQ.sdt}"`].join('\n'), { fs: 14, wrap: 44, title: 'measured' })), 'r64') +
    box('Every character passes through your code', 'The letter <b>a</b> in <code>0901a234567</code> never reached the screen: <code>replace(/\\D/g, \'\')</code> dropped it before <code>setSo</code>. That is only possible because the input shows state, not its own DOM value.', 'xanh'),
    en: 'Transform on the way in, measured. Because every character passes through your onChange, you can change it before it reaches state. The uppercase field turned a, b, x into capital A X B. The phone field keeps digits only, at most ten, and displays them grouped: typing zero nine zero one, then a letter a, then two three four five six seven, gives zero nine zero one, two three four, five six seven — the letter never reached the screen.' },
  { t: 'The caret jump — measured', body: cmp(['Step (uppercase field)', 'DOM value', 'Caret (selectionStart)'], [
      ['type "a", "b"', '<code>AB</code>', '2'],
      ['press ← (caret between A and B)', '<code>AB</code>', '1'],
      ['type "x" — the browser inserts it', '<code>AxB</code>', '2 — where you expect'],
      ['React re-renders with <code>toUpperCase()</code>', `<code>${KQ.hoa[0]}</code> — a <b>different</b> string`, `<b>${KQ.hoa[1]}</b> — jumped to the end (dev and production)`],
    ], { hl: [3] }) + two(
      box('Why', 'React writes <code>value</code> back into the DOM only when it differs from what the DOM holds. <code>AXB</code> ≠ <code>AxB</code>, so it assigns a new string — and assigning <code>.value</code> puts the caret at the end. Typing in the middle of a transformed field becomes miserable.', 'do2'),
      box('Fixes', `Uppercase only for looks? CSS ${c('text-transform: uppercase')}. Need the data uppercase? Transform on ${c('onBlur')} or on submit. Must transform live? Save and restore ${c('selectionStart')} with a ref (Chapter 6).`, 'xanh')),
    en: 'The caret jump, measured. In the uppercase field, type a and b, press left arrow so the caret sits between them, and type x. The browser inserts a lower-case x at position two. Then React re-renders with the uppercase string — a different string from what the DOM holds — so it assigns a new value, and assigning value moves the caret to the end: selectionStart three, in dev and in production. Fixes: CSS text-transform if it is only for looks, transform on blur or submit, or restore the selection with a ref.' },
  { t: 'value without onChange: the frozen field', body: two(D(tsx(`function ChiDoc() {
  const [text] = useState('Bình');
  return <input value={text} />;   // ✗ no onChange
}`, { sm: true, hl: [3] }),
      tn([`next dev   : typed "X" → value stays "${KQ.chiDoc}"`, `next start : typed "X" → value stays "${PROD[0]}" · console: (nothing)`].join('\n'), { fs: 13, wrap: 66, title: 'measured in Chromium' }),
      box('The warning exists only in development', 'Production says nothing: the field just refuses input. Fix it by intent: add <code>onChange</code>; add <code>readOnly</code> if it is meant to be read-only; or use <code>defaultValue</code> for an uncontrolled field with a starting value.', 'cam')),
      D(B('ks-loi1', { vp: 900, h: 330, w: 500, url: 'next dev · Console Error 1/3' }), tn(LOI[0], { fs: 13, wrap: 64, title: 'the exact text (React 19.3)' }))),
    en: 'value without onChange gives a frozen field. React binds the input to text, text never changes, so every keystroke is immediately overwritten with the old value. Measured: typing X leaves Bình, in dev and in production. In dev, Next shows a Console Error with React’s exact message: you provided a value prop to a form field without an onChange handler; this will render a read-only field. Production says nothing at all. Fix by intent: add onChange, add readOnly, or use defaultValue.' },
  { t: 'Never start from null', body: two(D(tsx(`const [v, setV] =
  useState<string | null>(null);       // ✗
return <input value={v as string}
  onChange={(e) => setV(e.target.value)} />;

// ✓ start from an empty string
const [v, setV] = useState('');`, { sm: true, hl: [2, 7] }),
      tn([`1. on first render:\n   ${LOI[1]}`, `2. after typing "z":\n   ${LOI[2]}`].join('\n'), { fs: 13, wrap: 64, title: 'next dev · console' })),
      D(B('ks-loi3', { vp: 900, h: 330, w: 500, url: 'next dev · Console Error 3/3' }),
        box('What happened', '<code>value={null}</code> means "uncontrolled" to React. The first keystroke sets a string, so the input <b>switches</b> to controlled mid-life — React warns, because an input should be one or the other for its whole lifetime.', 'do2'))),
    en: 'Never start from null. value null means uncontrolled to React, and it warns on the first render that value should not be null. The first keystroke sets a string, so the input switches to controlled in the middle of its life, and React warns again: a component is changing an uncontrolled input to be controlled. Note that TypeScript stayed quiet because of the cast. Start from an empty string.' },
  { t: 'A controlled input, in one loop', body: steps([
      `<b>value comes from state</b> — ${c('value={text}')}. The input shows exactly what state says; there is no second copy of the truth in the DOM`,
      `<b>onChange writes back</b> — ${c('onChange={e => setText(e.target.value)}')}. Each keystroke is a state update, which is a re-render, which re-sets the value`,
      '<b>So you can transform on the way</b> — uppercase, strip spaces, cap the length, reject non-digits — every character passes through your code (mind the caret)',
      '<b>And read it anywhere</b> — validation, a live preview, a disabled submit button all read the same variable, so nothing can disagree',
    ]) + box('One source of truth', 'State is the only place the input\'s value lives — the same rule as Lesson 3.4, applied to a form field.', 'lam'),
    en: 'A controlled input, in one loop. The value comes from state, so the input shows exactly what state says. onChange writes back: each keystroke is a state update, a re-render, and a re-set value. So you can transform on the way in, minding the caret. And you can read it anywhere — validation, a live preview, a disabled button — all reading the same variable. One source of truth, the same rule as Lesson three point four.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Controlled input', 'its value comes from state; React owns what is shown'), kw('value + onChange', 'the pair that makes an input controlled'),
      kw('Single source of truth', 'state is the only place the value lives'), kw('Read-only warning', 'value without onChange freezes the field (dev warns)'),
      kw('Derived input', 'transform what is typed before storing it'), kw('Caret jump', 'a transformed value written back moves the caret to the end'),
      kw('Uncontrolled → controlled', 'value switching from null/undefined to a string'), kw('defaultValue / readOnly', 'the two intentional alternatives to onChange'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: controlled input; value plus onChange; single source of truth; the read-only warning; derived input; the caret jump; the uncontrolled-to-controlled switch; and defaultValue and readOnly.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Build a controlled text input: ${c('value={text}')} + ${c('onChange={e => setText(e.target.value)}')}`,
      `Set ${c('value')} without ${c('onChange')} and read React's warning — then check that production stays silent`,
      'Transform as the user types (uppercase, strip spaces) — then type in the middle and watch the caret',
      `Start a field from ${c('null')}, read both warnings, fix it with ${c("''")}`,
    ]), box('Keep these', `<ul><li><code>value</code> and <code>onChange</code> always come as a pair</li><li>State is the single source of truth</li><li>Transform on the way in — mind the caret</li><li>Start from <code>''</code>, never <code>null</code></li></ul>`, 'lam'), ''),
    en: 'Your turn: build a controlled input; set value without onChange and read the warning, then check production stays silent; transform as the user types and watch the caret; and start from null, read both warnings, and fix it with an empty string. Keep: value and onChange come as a pair, state is the single source of truth, transform on the way in but mind the caret, and start from an empty string.' },
];
export const slides = lamDeck({ chuong: 'Chapter 4 — Events & controlled forms', bai: '4.2' }, S);
