/*DU_LIEU*/
const DU_LIEU = {
 "n3-2:file:src/app/anh-chup/page.tsx": "'use client';\nimport { useState } from 'react';\n\nlet lanVe = 0;\n\nexport default function AnhChup() {\n  lanVe++;\n  const [count, setCount] = useState(0);\n  const [c2, setC2] = useState(0);\n  const [nhat, setNhat] = useState<string[]>([]);\n  const ghi = (s: string) => setNhat((cu) => [...cu, s]);\n\n  return (\n    <div className=\"space-y-2 p-6 font-sans text-lg\">\n      <p id=\"ve\">AnhChup đã render: {lanVe} lần</p>\n      <button id=\"ba\" className=\"block rounded border px-3\" onClick={() => {\n        setCount(count + 1);\n        setCount(count + 1);\n        setCount(count + 1);\n      }}>setCount(count + 1) ×3 → count = {count}</button>\n      <button id=\"ham\" className=\"block rounded border px-3\" onClick={() => {\n        setC2((c) => c + 1);\n        setC2((c) => c + 1);\n        setC2((c) => c + 1);\n      }}>setC2(c =&gt; c + 1) ×3 → c2 = {c2}</button>\n      <button id=\"doc\" className=\"block rounded border px-3\" onClick={() => {\n        setCount(count + 10);\n        ghi(`ngay sau setCount(count + 10): count = ${count}`);\n      }}>đọc ngay sau khi đặt</button>\n      <button id=\"hen\" className=\"block rounded border px-3\" onClick={() => {\n        setTimeout(() => ghi(`setTimeout 2 s bắt được count = ${count}`), 2000);\n      }}>hẹn 2 giây rồi đọc count</button>\n      <button id=\"lo\" className=\"block rounded border px-3\" onClick={() => {\n        setTimeout(() => { setCount((c) => c + 1); setC2((c) => c + 1); }, 0);\n      }}>2 setter trong setTimeout</button>\n      <ol id=\"nhat\" className=\"list-decimal pl-6 text-base\">{nhat.map((s, i) => <li key={i}>{s}</li>)}</ol>\n    </div>\n  );\n}\n",
 "n3-2:file:src/app/dong-ho/page.tsx": "'use client';\nimport { useEffect, useState } from 'react';\n\nexport default function DongHo() {\n  const [cu, setCu] = useState(0);\n  const [moi, setMoi] = useState(0);\n\n  useEffect(() => {\n    const id = setInterval(() => {\n      setCu(cu + 1);            // ✗ đọc ảnh chụp của lần render đầu: cu = 0\n      setMoi((m) => m + 1);     // ✓ dạng hàm\n    }, 500);\n    return () => clearInterval(id);\n  }, []);\n\n  return (\n    <div className=\"space-y-2 p-6 font-sans text-xl\">\n      <p id=\"cu\">setCu(cu + 1) mỗi 0,5 s: {cu}</p>\n      <p id=\"moi\">setMoi(m =&gt; m + 1) mỗi 0,5 s: {moi}</p>\n    </div>\n  );\n}\n",
 "n3-2:trang": "$ npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npx eslint src/app/dong-ho/page.tsx 2>&1 | sed 's#.*/my-app/##'\n\nsrc/app/dong-ho/page.tsx\n  14:6  warning  React Hook useEffect has a missing dependency: 'cu'. Either include it or remove the dependency array. You can also do a functional update 'setCu(c => ...)' if you only need 'cu' in the 'setCu' call  react-hooks/exhaustive-deps\n\n✖ 1 problem (0 errors, 1 warning)\n$ npm run build 2>&1 | grep -E 'Compiled|anh-chup|dong-ho'\n✓ Compiled successfully in 153ms\n├ ○ /anh-chup\n├ ○ /dong-ho\n$ curl -s -o /dev/null -w 'GET /anh-chup → %{http_code}\\n' localhost:19328/anh-chup\nGET /anh-chup → 200",
 "n3-2:dung": ""
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, br, box, two, steps, kw, c, icards, meter } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-03-2', code: 'NXJ 3.2', title: 'State is a snapshot', sub: 'Chapter 3 · Lesson 3.2' };
const O = (k) => { const v = DU_LIEU[`n3-2:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const B = (ten, o) => br('nxj-03-2', ten, o);
const lenh = (k, re) => { const ds = O(k).split('\n$ '); const i = ds.findIndex((x) => re.test(x)); return (i ? '$ ' : '') + ds[i]; };
const AC = O('file:src/app/anh-chup/page.tsx').split('\n');
const DH = O('file:src/app/dong-ho/page.tsx').split('\n');
const khoi = (bat) => { const i = AC.findIndex((l) => l.includes(bat)); let j = i; while (!AC[j].includes('}}>')) j++; return AC.slice(i, j + 1).map((l) => l.replace(/^ {6}/, '')).map((l) => l.replace(/ className="[^"]*"/, '')).join('\n'); };

export const S = [
  { cover: true, nhan: 'Chapter 3 · Lesson 3.2', t: 'State is<br>a snapshot', sub: 'One idea that explains every "stale value" bug: within a render, state is a constant — and handlers and timers remember the render that made them',
    en: 'Lesson three point two: state is a snapshot. One idea explains every stale value bug: within one render, state is a constant, and the handlers and timers created in that render remember it.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The puzzle: three <code>setCount(count + 1)</code> calls add <b>one</b> — measured</li>
    <li>Why: every call reads the same frozen <code>count</code></li>
    <li>The updater form <code>setX(prev =&gt; …)</code> escapes the snapshot</li>
    <li>Reading state right after setting it gives the old value</li>
    <li>Timers remember their render — the interval stuck at 1</li>
    <li>Batching also happens inside <code>setTimeout</code> (React 18+)</li></ul>`,
    en: 'Six takeaways: the puzzle — three set count calls add one, measured; why — every call reads the same frozen count; the updater form escapes the snapshot; reading state right after setting it gives the old value; timers remember their render, as in the interval stuck at one; and batching also happens inside setTimeout since React eighteen.' },
  { t: 'The puzzle: what does one click do?', body: two(tsx(khoi('id="ba"') + '\n\n' + khoi('id="ham"'), { sm: true, hl: [2, 3, 4, 8, 9, 10] }),
      `<div><div class="cap" style="font-weight:700">One click on each (real browser, next start)</div>${B('anh-chup-ba', { vp: 640, h: 140, w: 420, url: 'localhost:3000/anh-chup', mark: [[24, 60, 320, 30, ''], [24, 98, 263, 30, '']] })}</div>` +
      box('Almost everyone says 3', 'Measured: <b>count = 1</b>. The updater form gives <b>c2 = 3</b>. And each click re-rendered the page <b>once</b> (1 → 2 → 3).', 'cam'), 'r64'),
    en: 'The puzzle. Starting from zero, one click calls set count of count plus one three times. Almost everyone says three. Measured in a real browser: count is one. The second button uses the updater form three times: c2 is three. And each click re-rendered the page exactly once.' },
  { t: 'Why: every call reads the same snapshot', body: two(tsx(`// render #1: count is a const = 0
onClick={() => {
  setCount(count + 1);  // set to 0+1
  setCount(count + 1);  // set to 0+1
  setCount(count + 1);  // set to 0+1
}}
// React applies the queue ⇒ 1
// render #2: a NEW count = 1`, { hl: [3, 4, 5] }),
      '<div>' + box('count is not a live pointer', 'It is the value state had when this render started — a <code>const</code> created when the function ran. Calling the setter does not reach back and change it.', 'lam') +
      box('One render, one frozen set', 'State, props and the handlers built from them are all fixed for that render. That consistency is what makes React predictable.', 'xanh') + '</div>'),
    en: 'Why. Within render one, count is a constant equal to zero. Each call reads that same zero and queues: set to one. React applies the queue and the next render gets a new count equal to one. count is not a live pointer to the current state; it is the value this render started with.' },
  { t: 'The updater form escapes the snapshot', body: two(tsx(`setC2((c) => c + 1);   // 0 → 1
setC2((c) => c + 1);   // 1 → 2
setC2((c) => c + 1);   // 2 → 3`, { hl: [1, 2, 3] }) +
      box('React passes each call the latest pending value', 'The function never reads the frozen <code>c2</code>, so it works the same in loops, timeouts and async code. Measured: <b>c2 = 3</b>.', 'xanh'),
      box('The rule worth memorising', 'If the next state is <b>computed from</b> the previous one ⇒ <code>setX(prev =&gt; …)</code>.<br>If it is <b>unrelated</b> to the old value (<code>setName(input)</code>) ⇒ the plain form is fine.', 'cam')),
    en: 'The updater form escapes the snapshot. React passes each call the latest pending value: zero to one, one to two, two to three. Measured: c2 is three. The rule: if the next state is computed from the previous one, use the updater form; if it is unrelated to the old value, the plain form is fine.' },
  { t: 'Measured: reading state right after setting it', body: tsx(khoi('id="doc"'), { sm: true, hl: [2, 3] }) + two(
      `<div>${B('anh-chup-sau', { vp: 640, h: 300, w: 540, url: 'localhost:3000/anh-chup · after all clicks', mark: [[24, 136, 197, 30, ''], [24, 250, 592, 24, '']] })}</div>`,
      '<div>' + box('The log said <b>count = 1</b>', 'The screen went to 11 on the next render — but inside this handler <code>count</code> is still this render\'s 1. Same with <code>setItems([...items, x]); items.length</code>.', 'do2') +
      box('Need the new value now?', 'You already have it: use the expression you passed to the setter (<code>count + 10</code>). Work that must happen <b>after</b> the render belongs in an effect.', 'xanh') + '</div>'),
    en: 'Measured: reading state right after setting it. The handler sets count plus ten and logs count on the next line: it logged one, while the screen went to eleven on the next render. If you need the new value now, you already have it — it is the expression you passed to the setter.' },
  { t: 'Measured: timers remember the render that made them', body: tsx(khoi('id="hen"'), { sm: true, hl: [2] }) + two(
      tn('click "hẹn 2 giây"        (count = 11)\nclick setCount ×3, twice  (count = 13)\n… 2 s later the timeout logs:\nsetTimeout 2 s bắt được count = 11', { fs: 16, title: 'what happened, in order' }),
      box('A closure keeps its snapshot', 'The timeout was created in the render where count was 11. Two re-renders later the screen says 13 — the callback still sees <b>11</b>. Handlers, promises and intervals all behave the same.', 'cam')),
    en: 'Timers remember the render that made them. The button schedules a log in two seconds, created in the render where count was eleven. Then two more clicks push the screen to thirteen. Two seconds later the timeout logs eleven. A closure keeps its snapshot — handlers, promises and intervals all behave the same.' },
  { t: 'The classic stale interval', body: two(tsx(DH.slice(7, 14).map((l) => l.replace(/\s+\/\/ ✗.*$/, '   // ✗ cu is 0 forever').replace(/\s+\/\/ ✓.*$/, '   // ✓ updater')).join('\n'), { sm: true, hl: [3, 4] }) +
      tn(lenh('trang', /eslint/).split('\n').filter((l) => /warning|problem|\$/.test(l)).join('\n'), { fs: 13, wrap: 64 }),
      `<div>${B('dong-ho-3s', { vp: 640, h: 120, w: 520, url: 'localhost:3000/dong-ho · after 3 s' })}</div>` +
      meter([['setCu(cu + 1)', 1, '#c0392b'], ['setMoi(m => m + 1)', 6, '#16a34a']], { w: 520, don: '', nhan: 210, fs: 16, rh: 42 }) +
      box('Stuck at 1, forever', 'The interval captured <code>cu = 0</code> from the first render and sets <code>0 + 1</code> every tick. The updater never reads the snapshot. ESLint even suggests the fix.', 'do2'), 'r46'),
    en: 'The classic stale interval. An interval created once in an effect calls set cu of cu plus one every half second. After three seconds in a real browser: stuck at one, forever, because it captured cu equal to zero from the first render. The updater version reached six. ESLint warns about the missing dependency and even suggests the functional update.' },
  { t: 'Batching is not only for click handlers', body: tsx(khoi('id="lo"'), { hl: [2] }) +
      meter([['before', 7, '#64748b'], ['after 2 setters in setTimeout', 8, '#0070f3']], { w: 560, don: 'renders', nhan: 260, fs: 16, rh: 44 }) +
    two(box('Measured: one render', 'Two setters inside a <code>setTimeout</code> re-rendered the page <b>once</b> (7 → 8). Since React 18, updates are batched everywhere — timeouts, promises, native events — not only inside React event handlers.', 'xanh'),
      box('Why it matters here', 'Batching is the reason a value cannot change mid-handler: React waits until your code finishes, then renders once with everything applied.', 'lam')),
    en: 'Batching is not only for click handlers. Two setters inside a setTimeout re-rendered the page once, from seven to eight renders. Since React eighteen, updates are batched everywhere: timeouts, promises and native events. That is also why a value cannot change in the middle of your handler.' },
  { t: 'One render is one snapshot', body: icards([
      ['lock', '1 · Variables are frozen for this render', '<code>count</code> is a <code>const</code> from when the function ran; a later setter call creates a new one in a new call.'],
      ['plug', '2 · Event handlers capture the snapshot', 'A handler defined in render 3 sees render 3\'s values forever, even if it fires after render 7.'],
      ['clock', '3 · So does anything you schedule', '<code>setTimeout</code>, promise callbacks, intervals — all remember the render that created them.'],
      ['loop', '4 · The updater form escapes', '<code>setX(prev =&gt; …)</code> asks React for the current value when the update is applied.'],
    ], 2),
    en: 'One render is one snapshot: variables are frozen for that render; event handlers capture it; so does anything you schedule — timeouts, promises, intervals; and the updater form escapes by asking React for the current value when the update is applied.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Snapshot', 'state is fixed for one render — it never changes mid-function'), kw('Stale value', 'reading state after a setter still gives this render\'s value'),
      kw('Updater function', 'setX(prev => next) — computed from the latest value'), kw('Batching', 'many setters, one re-render — everywhere since React 18'),
      kw('Scheduled re-render', 'a setter queues an update; the new value appears next render'), kw('Closure capture', 'a handler or timer holds the state of the render that made it'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: snapshot; stale value; updater function; batching; scheduled re-render; and closure capture.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Call ${c('setCount(count + 1)')} three times in one handler — explain the 1 with the snapshot idea`,
      `Switch to ${c('setCount(c => c + 1)')} and confirm it adds 3`,
      `Log ${c('count')} right after the setter; then schedule a ${c('setTimeout')} and click again before it fires`,
      `Build the interval counter; watch it stick at 1, read the ESLint hint, fix it with the updater`,
    ]), box('Keep these', `<ul><li>State is a constant within one render</li><li>Setters schedule; the new value arrives next render</li><li>Next from previous ⇒ <code>setX(prev =&gt; …)</code></li><li>Handlers and timers remember their render</li></ul>`, 'lam'), ''),
    en: 'Your turn: call the setter three times and explain the one; switch to the updater and get three; log count right after setting it, then schedule a timeout and click again before it fires; and build the interval counter, watch it stick, and fix it with the updater. Keep: state is a constant within one render, and handlers and timers remember their render.' },
];
export const slides = lamDeck({ chuong: 'Chapter 3 — State & the re-render model', bai: '3.2' }, S);
