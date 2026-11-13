/*DU_LIEU*/
const DU_LIEU = {
 "n2-4:file:src/app/binh-luan/page.tsx": "type BinhLuan = { id: number; tacGia: string; luc: string; noiDung: string };\n\nconst DS: BinhLuan[] = [\n  { id: 1, tacGia: 'An', luc: '2 phút trước', noiDung: 'Bài này dễ hiểu quá!' },\n  { id: 2, tacGia: 'Bình', luc: '5 phút trước', noiDung: 'Cho mình hỏi children có phải mảng không?' },\n  { id: 3, tacGia: 'Chi', luc: '9 phút trước', noiDung: 'Không phải lúc nào cũng là mảng nhé.' },\n];\n\nfunction AuthorLine({ tacGia, luc }: { tacGia: string; luc: string }) {\n  return (\n    <div data-c=\"AuthorLine\" className=\"text-sm text-slate-500\">\n      <b className=\"text-slate-900\">{tacGia}</b> · {luc}\n    </div>\n  );\n}\n\nfunction Comment({ bl }: { bl: BinhLuan }) {\n  return (\n    <li data-c=\"Comment\" className=\"rounded-lg bg-white p-3 shadow-sm\">\n      <AuthorLine tacGia={bl.tacGia} luc={bl.luc} />\n      <p>{bl.noiDung}</p>\n    </li>\n  );\n}\n\nfunction CommentList({ ds }: { ds: BinhLuan[] }) {\n  return (\n    <ul data-c=\"CommentList\" className=\"space-y-2\">\n      {ds.map((bl) => <Comment key={bl.id} bl={bl} />)}\n    </ul>\n  );\n}\n\nfunction ReplyBox() {\n  return (\n    <form data-c=\"ReplyBox\" className=\"flex gap-2\">\n      <input className=\"flex-1 rounded border px-2\" placeholder=\"Viết trả lời…\" />\n      <button className=\"rounded bg-sky-500 px-3 text-white\">Gửi</button>\n    </form>\n  );\n}\n\nexport default function Thread() {\n  return (\n    <section data-c=\"Thread\" className=\"space-y-3 bg-slate-100 p-5 font-sans\">\n      <h2 className=\"text-lg font-bold\">Bình luận (3)</h2>\n      <CommentList ds={DS} />\n      <ReplyBox />\n    </section>\n  );\n}\n",
 "n2-4:cay": "",
 "n2-4:file:src/app/thuan/page.tsx": "'use client';\nimport { useState } from 'react';\n\nlet lanVe = 0;                        // biến NGOÀI component\nconst daXem: string[] = [];\n\nfunction KhongThuan() {\n  lanVe++;                            // ✗ đổi biến bên ngoài trong lúc render\n  daXem.push('x');                    // ✗ mảng dài thêm mỗi lần render\n  return <p id=\"kt\">KhongThuan: lanVe = {lanVe} · daXem dài {daXem.length}</p>;\n}\n\nfunction Thuan({ n }: { n: number }) {\n  return <p id=\"t\">Thuan: n × 2 = {n * 2}</p>;\n}\n\nexport default function Trang() {\n  const [n, setN] = useState(0);\n  return (\n    <div className=\"space-y-2 p-6 font-sans text-lg\">\n      <button className=\"rounded border px-3\" onClick={() => setN(n + 1)}>Cha render lại: {n}</button>\n      <KhongThuan />\n      <Thuan n={n} />\n    </div>\n  );\n}\n",
 "n2-4:file:src/app/ngau-nhien/page.tsx": "'use client';\n\nexport default function NgauNhien() {\n  const so = Math.random().toFixed(4);   // ✗ đọc thứ bên ngoài: mỗi lần render một số khác\n  return <p id=\"so\" className=\"p-6 font-sans text-xl\">Số may mắn: {so}</p>;\n}\n",
 "n2-4:thuan": "$ npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npm run build 2>&1 | grep -A22 'Route (app)'\nRoute (app)\n┌ ○ /\n├ ○ /_not-found\n├ ○ /bien\n├ ○ /binh-luan\n├ ○ /dem\n├ ○ /ghep\n├ ○ /gio\n├ ○ /hien\n├ ○ /key\n├ ○ /khoang\n├ ○ /memo\n├ ○ /ngau-nhien\n├ ○ /tay\n├ ○ /the\n├ ○ /thuan\n├ ○ /thuoc\n├ ○ /tim\n└ ○ /vo\n\n\n○  (Static)  prerendered as static content\n$ curl -s -o /dev/null -w 'GET /binh-luan → %{http_code}\\n' localhost:19324/binh-luan\nGET /binh-luan → 200\n$ curl -s -o /dev/null -w 'GET /thuan (dev) → %{http_code}\\n' localhost:19325/thuan\nGET /thuan (dev) → 200\n$ curl -s localhost:19324/ngau-nhien | grep -o 'Số may mắn: <!-- -->[0-9.]*'\nSố may mắn: <!-- -->0.8469\n$ curl -s localhost:19324/ngau-nhien | grep -o 'Số may mắn: <!-- -->[0-9.]*'\nSố may mắn: <!-- -->0.8469",
 "n2-4:dung": ""
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, br, box, two, three, steps, kw, c, icards, cay, meter, cmp } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-02-4', code: 'NXJ 2.4', title: 'Thinking in components', sub: 'Chapter 2 · Lesson 2.4' };
const O = (k) => { const v = DU_LIEU[`n2-4:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const B = (ten, o) => br('nxj-02-4', ten, o);
const BL = O('file:src/app/binh-luan/page.tsx').split('\n');
const TH = O('file:src/app/thuan/page.tsx').split('\n');
const NN = O('file:src/app/ngau-nhien/page.tsx').split('\n');
const SO = (O('thuan').match(/Số may mắn: <!-- -->([0-9.]+)/) || [])[1];
const curl = O('thuan').split('\n').filter((l) => l.startsWith('$ curl -s localhost:19324/ngau') || l.startsWith('Số may mắn'));

export const S = [
  { cover: true, nhan: 'Chapter 2 · Lesson 2.4', t: 'Thinking in<br>components', sub: 'Where to draw the boundaries, one job per component, and why a render must be pure — with what React and Next.js do when it is not',
    en: 'Lesson two point four: thinking in components. The hard part of React is not syntax, it is deciding where the boundaries go. A repeatable method, one guiding rule — one job per component — and why a render must be pure, with what React and Next.js actually do when it is not.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>A method: find the nouns, draw boxes, nest them into a tree</li>
    <li>Name components by what they <b>are</b>, decide their props</li>
    <li>One job per component — and when <b>not</b> to split</li>
    <li>Pure renders: what you must never do while rendering</li>
    <li>Measured: React renders twice in dev to catch impurity</li>
    <li>Measured: an impure value breaks hydration in Next.js</li></ul>`,
    en: 'Six takeaways: a method — find the nouns, draw boxes, nest them; naming by what a component is; one job per component, and when not to split; pure renders; measured — React renders twice in development to catch impurity; and measured — an impure value breaks hydration in Next.js.' },
  { t: 'The method: find the nouns, draw boxes', body: two(`<div>${B('binh-luan-hop', { vp: 640, h: 340, w: 640, url: 'localhost:3000/binh-luan · boxes drawn on the real page' })}</div>`,
      steps(['Draw a box around each distinct piece of UI. A box that <b>repeats</b> (a comment, a row, a card) is almost certainly a component',
        'Nest the boxes — a box inside a box is a child. That gives you the tree',
        'Name each by what it <b>is</b>: <code>CommentList</code>, <code>Comment</code>, <code>AuthorLine</code> — never <code>BlueBox</code>',
        'Decide what props each box needs from its parent to render itself']), 'r64'),
    en: 'The method: look at a design and draw a box around each distinct piece. Here, boxes drawn on the real page: the thread, the comment list, each comment, the author line inside a comment, and the reply box. A box that repeats is almost certainly a component. Nest the boxes to get the tree, name each by what it is, and decide the props each one needs.' },
  { t: 'From boxes to a tree — and its props', body: two('<div>' + cay({ t: 'Thread', s: 'owns the data: DS' }, [{ t: 'CommentList', s: 'ds: BinhLuan[]', mau: '#0070f3' }, { t: 'ReplyBox', s: 'no props (yet)', mau: '#db2777' }], { w: 520, h: 200 }) +
      cay({ t: 'Comment ×3', s: 'bl: BinhLuan', mau: '#e0590b' }, [{ t: 'AuthorLine', s: 'tacGia, luc', mau: '#16a34a' }, { t: '<p>', s: 'bl.noiDung' }], { w: 520, h: 190 }) + '</div>',
      tsx(BL.slice(16, 24).join('\n').replace(/ className="[^"]*"/g, '').replace(/ data-c="\w+"/g, '') + '\n\n// inside CommentList:\n' + BL[28].trim(), { sm: true, hl: [1, 4, 11] }), 'r46'),
    en: 'From boxes to a tree. Thread owns the data and passes it to CommentList; CommentList maps it to three Comments, each receiving one comment; Comment hands the author and time down to AuthorLine. Each name says what the thing is, and each prop is exactly what that box needs to draw itself.' },
  { t: 'One job per component — and the balance', body: two(
      box('Smells of a component doing too much', '<ul><li>You struggle to name it, or the name has an "And": <code>UserProfileAndSettings</code></li><li>It fetches, formats, lays out <b>and</b> handles three kinds of click</li><li>Describing it needs the word "and"</li></ul>', 'do2') +
      box('Why small, single-purpose wins', 'Easier to name, test, reuse and reason about — and they re-render independently, which matters for performance in Chapter 7.', 'xanh'),
      box('But don\'t shred a paragraph into five components', 'A component earns its place when it is <b>reused</b>, has <b>one clear responsibility</b>, or <b>isolates complexity</b>. If none applies, it is just indirection.', 'cam') +
      cmp(['', 'Split', 'Keep together'], [['Repeats (3rd time)', '✓', ''], ['Own state', '✓', ''], ['Testable alone', '✓', ''], ['Only long', '', '✓'], ['Static text', '', '✓']])),
    en: 'One job per component. If you struggle to name it, or the name contains And, it is two components. Small single-purpose pieces are easier to name, test and reuse, and they re-render independently. But do not shred a static paragraph into five components: a component earns its place when it is reused, owns one clear responsibility, or isolates complexity.' },
  { t: 'Keep components pure', body: tsx(TH.slice(3, 15).filter((l) => l.trim()).join('\n'), { sm: true, hl: [4, 5, 9] }) + three(
      box('A pure render', 'Same props (and state) in ⇒ same UI out, and rendering changes nothing outside.', 'xanh'),
      box('While rendering, never', 'mutate props or outer variables · touch the DOM, fetch, set timers · read changing values like <code>Math.random()</code> or <code>Date.now()</code>.', 'do2'),
      box('Side effects live in…', 'event handlers, and <code>useEffect</code> (Chapter 5).', 'lam')),
    en: 'Keep components pure: same props in, same UI out, and rendering changes nothing outside. While rendering, never mutate props or variables that existed before the call, never touch the DOM, start a request or set a timer, and never read something that changes, like Math random or Date now. Side effects belong in event handlers and in useEffect.' },
  { t: 'Measured: dev renders twice to catch impurity', body: two(`<div>${B('thuan-dev', { vp: 640, h: 200, w: 520, url: 'localhost:3000/thuan · next dev' })}<div style="height:10px"></div>${B('thuan-prod', { vp: 640, h: 200, w: 520, url: 'localhost:3000/thuan · next start' })}</div>`,
      '<div>' + meter([['dev — page load', 2, '#e0590b'], ['dev — after 2 clicks', 6, '#e0590b'], ['prod — page load', 1, '#16a34a'], ['prod — after 2 clicks', 3, '#16a34a']], { w: 560, don: 'renders', nhan: 230, fs: 16, rh: 38 }) +
      box('React Strict Mode (on by default in the App Router)', 'In development React calls your component <b>twice</b> per render. A pure component cannot tell; <code>KhongThuan</code> counted 2 → 6 instead of 1 → 3. <code>Thuan</code> showed <b>n × 2 = 4</b> in both.', 'cam') + '</div>'),
    en: 'Measured in a real browser. KhongThuan increments an outside counter while rendering. Under next dev it showed two on load and six after two clicks; under next start, one and three. In development, React Strict Mode calls your component twice per render on purpose: a pure component cannot tell the difference — Thuan showed four in both — but an impure one is exposed immediately.' },
  { t: 'Impure in Next.js: hydration breaks', body: tsx(NN.join('\n'), { sm: true, hl: [4] }) + two(
      '<div>' + tn(curl.join('\n'), { fs: 13, wrap: 60, title: 'curl × 2 — next start' }) +
      box('Baked at build', `The page is static (○), so the server HTML froze one random number at <code>next build</code>: <b>${SO}</b> on every request.`, 'lam') + '</div>',
      `<div>${B('ngau-dev', { vp: 960, h: 300, w: 540, url: 'localhost:3000/ngau-nhien · next dev' })}` +
      box('Then the browser computes another', 'Server HTML ≠ client render ⇒ <b>Hydration failed</b> in dev; in production the console logs <b>Minified React error #418</b> and React re-renders that tree on the client.', 'do2') + '</div>'),
    en: 'Impurity in Next.js breaks hydration. This client component calls Math random while rendering. The page is static, so next build froze one number into the HTML — the same number on every request. Then the browser renders again, gets a different number, and the two disagree: Hydration failed in development, and Minified React error four eighteen in production.' },
  { t: 'Deciding where a component should end', body: icards([
      ['page', '1 · Start from the design, not the code', 'Box what repeats, or what a designer would give a name. Those names are your components.'],
      ['check', '2 · One component, one job', 'If you cannot describe it in one sentence without "and", it is two.'],
      ['loop', '3 · Split when it repeats, not before', 'Two similar blocks may really differ. Extract at the third appearance, when the shared shape is clear.'],
      ['stack', '4 · Keep state as low as it can live', 'Put it in the component that needs it; lift only when a second one needs the same value (Chapter 3).'],
    ], 2) + box('Trap — splitting by file length', 'Cutting a 200-line component into eight files looks tidy but adds eight interfaces: every new boundary needs props threaded through. One long component that does one job beats eight short ones you must reassemble in your head.', 'do2'),
    en: 'Deciding where a component ends: start from the design, not the code; one component, one job; split when it repeats, not before — extract at the third appearance; and keep state as low as it can live. The trap: splitting by file length. Eight short files add eight interfaces to thread props through.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Component tree', 'the nested boxes of a screen, as components'), kw('Single responsibility', 'one component, one job'),
      kw('Pure render', 'same inputs ⇒ same UI, no side effects'), kw('Strict Mode', 'dev-only double render that exposes impure components'),
      kw('Hydration mismatch', 'server HTML differs from the client\'s first render'), kw('Side effect', 'work outside rendering: events or useEffect'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: component tree; single responsibility; pure render; Strict Mode; hydration mismatch; and side effect.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'Screenshot any page, draw boxes, name each box by what it is — that is your tree',
      `For each piece of data, decide: prop (passed in) or state (owned here) — and where it lives`,
      `Add ${c('let n = 0; n++')} inside a component; compare ${c('next dev')} and ${c('next start')}`,
      `Render ${c('Math.random()')} in a client component; read the hydration error, then move it into an event handler`,
    ]), box('Keep these', `<ul><li>Find the nouns, draw boxes, nest them</li><li>One job per component — split on the 3rd repeat</li><li>Render is pure: no outside writes, no changing reads</li><li>Dev renders twice on purpose; impurity breaks hydration</li></ul>`, 'lam'), ''),
    en: 'Your turn: screenshot a page and draw boxes to get its tree; decide prop or state for each piece of data; add an outside counter to a component and compare dev and start; and render Math random in a client component, read the hydration error, then move it into an event handler. Keep: find the nouns and draw boxes; one job per component; render is pure; dev renders twice on purpose.' },
];
export const slides = lamDeck({ chuong: 'Chapter 2 — Components, props & composition', bai: '2.4' }, S);
