/*DU_LIEU*/
const DU_LIEU = {
 "n3-3:file:src/app/bat-bien/page.tsx": "'use client';\nimport { useState } from 'react';\n\nlet lanVe = 0;\n\nexport default function BatBien() {\n  lanVe++;\n  const [user, setUser] = useState({ name: 'An', age: 20 });\n  const [list, setList] = useState(['c', 'a', 'b']);\n  const [dem, setDem] = useState(0);\n\n  return (\n    <div className=\"space-y-2 p-6 font-sans text-lg\">\n      <p id=\"ve\">BatBien đã render: {lanVe} lần</p>\n      <p id=\"user\">user: {user.name}, {user.age} tuổi</p>\n      <button id=\"mutate\" className=\"block rounded border px-3\" onClick={() => {\n        user.age++;                          // ✗ sửa thẳng object đang có\n        setUser(user);                       // ✗ cùng một tham chiếu\n        console.log('dữ liệu thật: age =', user.age);\n      }}>user.age++ rồi setUser(user)</button>\n      <button id=\"khac\" className=\"block rounded border px-3\" onClick={() => setDem(dem + 1)}>đổi state khác (dem = {dem})</button>\n      <button id=\"spread\" className=\"block rounded border px-3\" onClick={() => setUser({ ...user, age: user.age + 1 })}>setUser({'{ ...user, age: user.age + 1 }'})</button>\n      <p id=\"list\">list: [{list.join(', ')}]</p>\n      <button id=\"push\" className=\"block rounded border px-3\" onClick={() => { list.push('x'); setList(list); }}>list.push('x') rồi setList(list)</button>\n      <button id=\"them\" className=\"block rounded border px-3\" onClick={() => setList([...list, 'y'])}>setList([...list, 'y'])</button>\n      <button id=\"sort\" className=\"block rounded border px-3\" onClick={() => setList(list.toSorted())}>setList(list.toSorted())</button>\n    </div>\n  );\n}\n",
 "n3-3:file:sapxep.cjs": "const goc = ['c', 'a', 'b'];\nconst banSao = [...goc].sort();\nconsole.log('[...goc].sort():', banSao, '· goc vẫn là:', goc);\nconst moi = goc.toSorted();\nconsole.log('goc.toSorted(): ', moi, '· goc vẫn là:', goc);\nconst tra = goc.sort();\nconsole.log('goc.sort():     ', tra, '· goc GIỜ là:', goc, '· cùng một mảng?', tra === goc);\nconst u = { name: 'An', age: 20 };\nconst u2 = { ...u, age: 21 };\nconsole.log('Object.is(u, u) =', Object.is(u, u), '· Object.is(u, { ...u, age: 21 }) =', Object.is(u, u2));\n",
 "n3-3:trang": "$ node sapxep.cjs\n[...goc].sort(): [ 'a', 'b', 'c' ] · goc vẫn là: [ 'c', 'a', 'b' ]\ngoc.toSorted():  [ 'a', 'b', 'c' ] · goc vẫn là: [ 'c', 'a', 'b' ]\ngoc.sort():      [ 'a', 'b', 'c' ] · goc GIỜ là: [ 'a', 'b', 'c' ] · cùng một mảng? true\nObject.is(u, u) = true · Object.is(u, { ...u, age: 21 }) = false\n$ npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npm run build 2>&1 | grep -E 'Compiled|bat-bien'\n✓ Compiled successfully in 1005ms\n├ ○ /bat-bien\n$ curl -s -o /dev/null -w 'GET /bat-bien → %{http_code}\\n' localhost:19329/bat-bien\nGET /bat-bien → 200",
 "n3-3:dung": ""
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, br, box, two, steps, kw, c, icards, cmp } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-03-3', code: 'NXJ 3.3', title: 'Updating objects and arrays without mutating', sub: 'Chapter 3 · Lesson 3.3' };
const O = (k) => { const v = DU_LIEU[`n3-3:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const B = (ten, o) => br('nxj-03-3', ten, o);
const lenh = (k, re) => { const ds = O(k).split('\n$ '); const i = ds.findIndex((x) => re.test(x)); return (i ? '$ ' : '') + ds[i]; };
const BB = O('file:src/app/bat-bien/page.tsx').split('\n');
const gon = (t) => t.replace(/\s+\/\/ ✗ sửa thẳng.*$/m, '   // ✗ in place').replace(/\s+\/\/ ✗ cùng một.*$/m, '   // ✗ same reference');
const nut = (id) => { const i = BB.findIndex((l) => l.includes(`id="${id}"`)); let j = i; while (!BB[j].includes('</button>')) j++; return BB.slice(i, j + 1).map((l) => l.replace(/^ {6}/, '').replace(/ className="[^"]*"/, '')).join('\n'); };

export const S = [
  { cover: true, nhan: 'Chapter 3 · Lesson 3.3', t: 'Updating objects and<br>arrays without mutating', sub: 'React compares references, not contents — so a changed object handed back by the same reference is invisible, until something else re-renders',
    en: 'Lesson three point three: updating objects and arrays without mutating. React compares references, not contents, so an object you changed in place and handed back is invisible to it — until something else re-renders.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Why mutating state fails <b>silently</b> — measured</li>
    <li>The delayed surprise: the change appears on an <i>unrelated</i> render</li>
    <li>The fix: a new object with spread, copying every level you touch</li>
    <li>Arrays: the non-mutating methods, and the ones that bite (<code>push</code>, <code>sort</code>)</li>
    <li><code>toSorted()</code> and friends — copy-then-change built in</li>
    <li>Why <code>map</code> keeps unchanged items' identity (Chapter 7)</li></ul>`,
    en: 'Six takeaways: why mutating state fails silently, measured; the delayed surprise where the change appears on an unrelated render; the fix — a new object with spread, copying every level you touch; arrays — the non-mutating methods and the ones that bite; toSorted and friends; and why map keeps unchanged items’ identity.' },
  { t: 'Mutating fails silently — measured', body: two(tsx(gon(nut('mutate')), { sm: true, hl: [2, 3] }),
      `<div>${B('bat-bien-mutate', { vp: 640, h: 140, w: 520, url: 'localhost:3000/bat-bien · clicked twice', mark: [[24, 24, 230, 28, ''], [24, 60, 200, 28, '']] })}</div>` +
      tn('console:\ndữ liệu thật: age = 21\ndữ liệu thật: age = 22', { fs: 15, title: 'browser console' })) +
    box('Same reference ⇒ "nothing changed"', 'React compares old and new state with <code>Object.is</code>. You handed back the <b>same</b> object, so <code>Object.is(user, user)</code> is <code>true</code> and React skips the render. Data: 22. Screen: <b>20</b>. Renders: <b>1</b>.', 'do2'),
    en: 'Mutating fails silently, measured. The button increments user dot age in place and hands the same object back to setUser. Clicked twice: the console shows the real data reached twenty two, but the screen still says twenty and the page rendered once. React compared old and new with Object is, saw the same reference, and skipped the render.' },
  { t: 'The delayed surprise', body: two(`<div>${B('bat-bien-mutate', { vp: 640, h: 170, w: 520, url: 'before: after 2 × mutate' })}</div>`,
      `<div>${B('bat-bien-khac', { vp: 640, h: 170, w: 520, url: 'after: click an UNRELATED button', mark: [[24, 60, 200, 28, ''], [24, 134, 218, 30, '']] })}</div>`) +
    two(box('The screen jumps 20 → 22', 'Changing <code>dem</code> re-rendered the component, which read the already-mutated <code>user</code>. The age "updates" from a button that has nothing to do with it.', 'do2'),
      box('Why this is the worst kind of bug', 'It appears on someone else\'s render, far from the line that caused it. Treat state as <b>immutable</b>: never change it, always replace it.', 'cam')) +
    tn('click "user.age++" ×2      → screen: An, 20 · data: 22 · renders: 1\nclick "đổi state khác" ×1 → screen: An, 22 · renders: 2', { fs: 16, title: 'what happened, in order (real browser)' }),
    en: 'The delayed surprise. After the two mutations the screen said twenty. Then clicking an unrelated button that changes dem re-rendered the component, and the age jumped to twenty two. The change shows up on someone else’s render, far from the line that caused it. Treat state as immutable: never change it, always replace it.' },
  { t: 'The fix: build a new object', body: two(tsx(`// ✅ new object ⇒ new reference
setUser({ ...user, age: user.age + 1 });

// nested: copy every level you touch
setUser({
  ...user,
  address: { ...user.address, city: 'Hanoi' },
});`, { hl: [2, 7] }) + tn(lenh('trang', /sapxep/).split('\n').filter((l) => /Object\.is|\$/.test(l)).join('\n'), { fs: 13, wrap: 64 }),
      box('Measured', 'The spread button: <b>An, 23 tuổi</b>, and the page rendered once more. <code>Object.is(u, { ...u, age: 21 })</code> is <code>false</code> — a new reference, so React sees a change.', 'xanh') +
      box('Spread is shallow', '<code>{ ...user }</code> copies only the top level. A nested object is still shared — copy it too, or you are mutating it.', 'lam')),
    en: 'The fix: build a new object. Spread copies all of user’s fields into a brand-new object and overrides age. New reference, React sees a change and re-renders — measured, twenty three. Object is between u and a spread copy is false. Spread is shallow: for nested objects, copy every level you touch.' },
  { t: 'Arrays: non-mutating vs mutating', body: two(cmp(['Goal', '✅ Returns a new array', '✗ Mutates in place'], [
      ['Add', '<code>[...list, item]</code>', '<code>list.push(item)</code>'],
      ['Remove', '<code>list.filter(x =&gt; x.id !== id)</code>', '<code>list.splice(i, 1)</code>'],
      ['Change one', '<code>list.map(x =&gt; x.id === id ? { ...x, done: true } : x)</code>', '<code>list[i].done = true</code>'],
      ['Sort / reverse', '<code>list.toSorted()</code> · <code>[...list].sort()</code>', '<code>list.sort()</code> · <code>list.reverse()</code>'],
    ]), tn(lenh('trang', /sapxep/).split('\n').filter((l) => !/Object\.is/.test(l)).join('\n'), { fs: 13, wrap: 44 }) +
      box('sort() returns the SAME array', 'Measured: <code>goc.sort()</code> reordered <code>goc</code> itself, and <code>tra === goc</code> is <code>true</code>. <code>toSorted()</code> (ES2023) and <code>[...goc].sort()</code> left it alone.', 'do2'), 'r64'),
    en: 'Arrays split into two camps. To add, spread into a new array instead of push; to remove, filter instead of splice; to change one item, map and copy that item; to sort, use toSorted or copy first. Measured in Node: goc dot sort reordered goc itself and returned the same array, while toSorted and a copied sort left the original alone.' },
  { t: 'Measured: push hides, the next render reveals', body: tsx("// button #push\nonClick={() => { list.push('x'); setList(list); }}\n// button #them\nonClick={() => setList([...list, 'y'])}", { hl: [2] }) + two(
      `<div>${B('bat-bien-sau', { vp: 640, h: 360, w: 460, url: 'localhost:3000/bat-bien · after all clicks', mark: [[24, 210, 200, 28, '']] })}</div>`,
    '<div>' + box('push + setList(list)', 'Screen stayed <b>[c, a, b]</b> — same reference. The hidden <code>x</code> appeared only when the next real update ran: <b>[c, a, b, x, y]</b>.', 'do2') +
      box('Renders 3 → 5, not 4', 'React may call your component once more before bailing out of a same-value update (documented behaviour) — never count on renders, count on references.', 'lam') + '</div>', 'r46'),
    en: 'Measured with an array. Push then set list with the same array: the screen stayed c, a, b. The hidden x appeared only on the next real update, which added y. And the render counter went from three to five, not four: React may call your component once more before bailing out of a same-value update. Count on references, not on renders.' },
  { t: 'Why map keeps unchanged items', body: two(tsx(`setTodos(todos.map((t) =>
  t.id === id ? { ...t, done: true } : t
));
// new array · ONE new object · the others are
// the SAME objects as before`, { hl: [2] }),
      box('Identity is information', 'Only the changed item gets a new reference. The rest keep theirs, so a <code>React.memo</code> child can skip them — Chapter 7 measures it.', 'xanh') +
      box('Immutable updates are cheap', 'You copy the path you change, not the whole tree. Libraries like Immer let you "write mutations" that produce copies — optional, not required.', 'lam')) +
    cmp(['todos[i]', 'before → after toggling todo 2', 'React.memo child'], [['todo 1', 'same object', 'skips'], ['todo 2', '<b>new</b> object { ...t, done: true }', 're-renders'], ['todo 3', 'same object', 'skips']], { hl: [1] }),
    en: 'Why map keeps unchanged items. It returns a new array with one new object for the item that changed; all the others are the same objects as before. That identity is information: memo children can skip them, as Chapter seven measures. Immutable updates are cheap, because you only copy the path you change.' },
  { t: 'The checklist', body: icards([
      ['lock', '1 · Never change state in place', 'No <code>obj.x = …</code>, no <code>push</code>, <code>splice</code>, <code>sort</code> on state.'],
      ['layers', '2 · Copy, then change', '<code>{ ...obj, x }</code>, <code>[...list, item]</code>, <code>filter</code>, <code>map</code>, <code>toSorted</code>.'],
      ['tree', '3 · Copy every level you touch', 'Nested object ⇒ nested spread. Spread is shallow.'],
      ['eye', '4 · Suspect mutation when…', 'the screen lags the data, or updates on an unrelated click.'],
    ], 2),
    en: 'The checklist: never change state in place; copy, then change; copy every level you touch because spread is shallow; and suspect mutation whenever the screen lags the data or updates on an unrelated click.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Immutable update', 'replace state with a new value instead of changing it'), kw('Reference equality', 'Object.is — same object, not same contents'),
      kw('Spread', '{ ...obj } / [...arr] — a shallow copy'), kw('Mutating method', 'push, splice, sort, reverse — change the array in place'),
      kw('toSorted / toReversed', 'ES2023 copies that return a new array'), kw('Structural sharing', 'unchanged parts keep their identity'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: immutable update; reference equality; spread; mutating method; toSorted and toReversed; and structural sharing.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Mutate ${c('user.age++')} and call ${c('setUser(user)')}; log the data, watch the screen stay put`,
      'Click an unrelated button — see the stale value suddenly appear',
      `Fix it with ${c('setUser({ ...user, age: user.age + 1 })')}; then update a nested field correctly`,
      `Build add / remove / toggle / sort for a todo list using only ${c('[...]')}, ${c('filter')}, ${c('map')}, ${c('toSorted')}`,
    ]), box('Keep these', `<ul><li>React compares references, not contents</li><li>Never change state in place — replace it</li><li>Copy every level you touch</li><li><code>sort</code> mutates; <code>toSorted</code> does not</li></ul>`, 'lam'), ''),
    en: 'Your turn: mutate user and watch the screen stay put; click an unrelated button to see the stale value appear; fix it with spread, including a nested field; and build add, remove, toggle and sort for a todo list without a single mutating method. Keep: React compares references, never change state in place, copy every level you touch, and sort mutates while toSorted does not.' },
];
export const slides = lamDeck({ chuong: 'Chapter 3 — State & the re-render model', bai: '3.3' }, S);
