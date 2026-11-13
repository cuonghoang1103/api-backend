/*DU_LIEU*/
const DU_LIEU = {
 "n3-4:file:src/app/o-dau/page.tsx": "'use client';\nimport { useState } from 'react';\n\nfunction GioThua() {\n  const [items, setItems] = useState(['táo', 'cam']);\n  const [count, setCount] = useState(2);              // ✗ state thừa\n  return (\n    <div className=\"rounded border p-2\">\n      <p id=\"thua\">items: {items.length} · count (state thừa): {count}</p>\n      <button id=\"them1\" className=\"mr-2 rounded border px-2\" onClick={() => { setItems([...items, 'lê']); setCount(count + 1); }}>thêm</button>\n      <button id=\"xoa1\" className=\"rounded border px-2\" onClick={() => setItems(items.slice(1))}>xoá (quên setCount)</button>\n    </div>\n  );\n}\n\nfunction GioSuyRa() {\n  const [items, setItems] = useState(['táo', 'cam']);\n  const count = items.length;                         // ✓ suy ra lúc render\n  return (\n    <div className=\"rounded border p-2\">\n      <p id=\"suy\">items: {items.length} · count (suy ra): {count}</p>\n      <button id=\"them2\" className=\"mr-2 rounded border px-2\" onClick={() => setItems([...items, 'lê'])}>thêm</button>\n      <button id=\"xoa2\" className=\"rounded border px-2\" onClick={() => setItems(items.slice(1))}>xoá</button>\n    </div>\n  );\n}\n\nfunction OTen({ name }: { name: string }) {\n  const [ten, setTen] = useState(name);               // ✗ chép prop vào state\n  return <input id=\"o\" className=\"rounded border px-2\" value={ten} onChange={(e) => setTen(e.target.value)} />;\n}\n\nexport default function ODau() {\n  const [nguoi, setNguoi] = useState({ id: 1, name: 'An' });\n  const doi = () => setNguoi(nguoi.id === 1 ? { id: 2, name: 'Bình' } : { id: 1, name: 'An' });\n  return (\n    <div className=\"space-y-2 p-6 font-sans text-lg\">\n      <GioThua />\n      <GioSuyRa />\n      <p id=\"dang\">đang chọn: {nguoi.name}</p>\n      <button id=\"doi\" className=\"rounded border px-2\" onClick={doi}>đổi người</button>\n      <p>không key: <OTen name={nguoi.name} /></p>\n      <p>key=id: <OTen key={nguoi.id} name={nguoi.name} /></p>\n    </div>\n  );\n}\n",
 "n3-4:trang": "$ npx tsc --noEmit | grep anh-em\nsrc/app/nang/anh-em.tsx(9,24): error TS2304: Cannot find name 'query'.\n$ npx tsc --noEmit && echo 'tsc: 0 lỗi'\ntsc: 0 lỗi\n$ npm run build 2>&1 | grep -E 'Compiled|o-dau|nang|cuc-bo'\n✓ Compiled successfully in 885ms\n├ ○ /cuc-bo\n├ ○ /nang\n├ ○ /o-dau\n$ curl -s -o /dev/null -w 'GET /o-dau → %{http_code}\\n' localhost:19330/o-dau\nGET /o-dau → 200\n$ curl -s -o /dev/null -w 'GET /nang → %{http_code}\\n' localhost:19330/nang\nGET /nang → 200\n$ curl -s -o /dev/null -w 'GET /cuc-bo → %{http_code}\\n' localhost:19330/cuc-bo\nGET /cuc-bo → 200",
 "n3-4:dung": "",
 "n3-4:file:src/app/nang/page.tsx": "'use client';\nimport { useState } from 'react';\n\nconst TEN = ['An', 'Bình', 'Lan', 'Minh'];\n\n// ✗ query nằm trong ô tìm — anh em không thấy được\nfunction OTimRieng() {\n  const [query, setQuery] = useState('');\n  return <input id=\"tim1\" className=\"rounded border px-2\" placeholder=\"tìm…\" value={query} onChange={(e) => setQuery(e.target.value)} />;\n}\nfunction KetQuaMu() {\n  return <p id=\"kq1\">kết quả: {TEN.join(', ')} ({TEN.length})</p>;   // không có query để lọc\n}\n\n// ✓ nâng query lên cha chung gần nhất\nfunction SearchInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {\n  return <input id=\"tim2\" className=\"rounded border px-2\" placeholder=\"tìm…\" value={value} onChange={(e) => onChange(e.target.value)} />;\n}\nfunction Results({ query }: { query: string }) {\n  const loc = TEN.filter((t) => t.toLowerCase().includes(query.toLowerCase()));   // suy ra, không lưu\n  return <p id=\"kq2\">kết quả: {loc.join(', ')} ({loc.length})</p>;\n}\nfunction FilterablePage() {\n  const [query, setQuery] = useState('');            // state chung nằm ở đây\n  return (\n    <div id=\"ok\" className=\"rounded border p-2\">\n      <p className=\"text-sm text-gray-500\">✓ query ở cha FilterablePage</p>\n      <SearchInput value={query} onChange={setQuery} />\n      <Results query={query} />\n    </div>\n  );\n}\n\nexport default function Nang() {\n  return (\n    <div className=\"space-y-2 p-6 font-sans text-lg\">\n      <div id=\"sai\" className=\"rounded border p-2\">\n        <p className=\"text-sm text-gray-500\">✗ query nằm trong ô tìm</p>\n        <OTimRieng />\n        <KetQuaMu />\n      </div>\n      <FilterablePage />\n    </div>\n  );\n}\n",
 "n3-4:file:src/app/cuc-bo/page.tsx": "'use client';\nimport { useState } from 'react';\n\nconst lan = { nang: 0, cucBo: 0 };\n\nfunction BangA() {\n  lan.nang++;\n  return <p id=\"bang1\">Bảng (anh em) đã render: {lan.nang} lần</p>;\n}\nfunction BangB() {\n  lan.cucBo++;\n  return <p id=\"bang2\">Bảng (anh em) đã render: {lan.cucBo} lần</p>;\n}\n\nfunction Menu({ mo, onDoi, id }: { mo: boolean; onDoi: () => void; id: string }) {\n  return (\n    <p>\n      <button id={id} className=\"rounded border px-2\" onClick={onDoi}>menu {mo ? '▲' : '▼'}</button>\n      {mo && <span> Hồ sơ · Đăng xuất</span>}\n    </p>\n  );\n}\n\n// ✗ cờ mở/đóng của menu đặt ở khối cha\nfunction KhoiNang() {\n  const [mo, setMo] = useState(false);\n  return (\n    <div className=\"rounded border p-2\">\n      <p className=\"text-sm text-gray-500\">✗ state mo ở khối cha</p>\n      <Menu id=\"mo1\" mo={mo} onDoi={() => setMo(!mo)} />\n      <BangA />\n    </div>\n  );\n}\n\n// ✓ cờ nằm ngay trong menu\nfunction MenuTuGiu() {\n  const [mo, setMo] = useState(false);\n  return <Menu id=\"mo2\" mo={mo} onDoi={() => setMo(!mo)} />;\n}\nfunction KhoiCucBo() {\n  return (\n    <div className=\"rounded border p-2\">\n      <p className=\"text-sm text-gray-500\">✓ state mo nằm trong menu</p>\n      <MenuTuGiu />\n      <BangB />\n    </div>\n  );\n}\n\nexport default function CucBo() {\n  return (\n    <div className=\"space-y-2 p-6 font-sans text-lg\">\n      <KhoiNang />\n      <KhoiCucBo />\n    </div>\n  );\n}\n",
 "n3-4:file:src/app/nang/anh-em.tsx": "'use client';\nimport { useState } from 'react';\n\nexport function OTim() {\n  const [query, setQuery] = useState('');\n  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;\n}\nexport function KetQua() {\n  return <p>đang tìm: {query}</p>;   // ✗ đọc state của anh em\n}\n"
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, br, box, two, steps, kw, c, icards, cmp, seq, path, tiers, vsd } from './_nxj-chung.mjs';

export const deck = { key: 'nxj-03-4', code: 'NXJ 3.4', title: 'Where state should live', sub: 'Chapter 3 · Lesson 3.4' };
const O = (k) => { const v = DU_LIEU[`n3-4:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const B = (ten, o) => br('nxj-03-4', ten, o);
const D = (...a) => `<div>${a.join('')}</div>`;   // một ô lưới của two() — ghép nhiều khối
const lenh = (re) => { const ds = O('trang').split('\n$ '); const i = ds.findIndex((x) => re.test(x)); if (i < 0) throw new Error('thiếu lệnh ' + re); return (i ? '$ ' : '') + ds[i]; };
const AE = O('file:src/app/nang/anh-em.tsx').trimEnd();
// kiểm chữ của đoạn mã rút gọn có thật trong tệp chạy thật (không bịa)
const CO = (tep, ...ds) => { const s = O(`file:${tep}`); for (const d of ds) if (!s.includes(d)) throw new Error(`${tep} không có: ${d}`); };
CO('src/app/o-dau/page.tsx', "const [count, setCount] = useState(2);", 'const count = items.length;', "setItems([...items, 'lê']); setCount(count + 1);", 'setItems(items.slice(1))', 'const [ten, setTen] = useState(name);', '<OTen key={nguoi.id} name={nguoi.name} />');
CO('src/app/nang/page.tsx', "const [query, setQuery] = useState('');", '<SearchInput value={query} onChange={setQuery} />', '<Results query={query} />', 'TEN.filter((t) => t.toLowerCase().includes(query.toLowerCase()))');
CO('src/app/cuc-bo/page.tsx', 'lan.nang++;', '<Menu id="mo1" mo={mo} onDoi={() => setMo(!mo)} />', 'function MenuTuGiu()');

export const S = [
  { cover: true, nhan: 'Chapter 3 · Lesson 3.4', t: 'Where state<br>should live', sub: 'Three questions place almost every piece of state: does it need to be state at all, who needs it, and who is their closest common parent?',
    en: 'Lesson three point four: where state should live. Many React bugs are really state-in-the-wrong-place bugs, and three questions settle almost every case: does it need to be state at all, how many components need it, and who is their closest common parent.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Three questions that place a piece of state</li>
    <li>Don't store what you can derive — the drift, <b>measured</b></li>
    <li>Keep state local — fewer components re-render, <b>measured</b></li>
    <li>Siblings can't see each other's state ⇒ <b>lift it up</b> to the closest common parent</li>
    <li>Data flows down, changes flow up — and when lifting turns into prop drilling</li>
    <li>The trap: copying a prop into state (and the <code>key</code> escape hatch)</li></ul>`,
    en: 'Six takeaways: three questions that place a piece of state; why you should not store what you can derive, with the drift measured; keeping state local so fewer components re-render, also measured; lifting state up when siblings must share it; data down, changes up, and when lifting turns into prop drilling; and the trap of copying a prop into state.' },
  { t: 'Three questions decide where state lives', body: path([
      { t: '1 · Must it be state?', s: 'can it be computed instead?' },
      { t: '2 · Who needs it?', s: 'one component, or several?' },
      { t: '3 · Common parent?', s: 'the closest one is its home', on: true },
    ], { h: 150, nhan: ['yes', 'several'] }) +
    cmp(['Symptom you see', 'Usual cause', 'Fix (this lesson)'], [
      ['Two numbers on screen disagree', 'Redundant state — the same fact stored twice', 'Derive it during render'],
      ['A sibling can\'t see the value', 'State lives too low', 'Lift it to the closest common parent'],
      ['Half the page re-renders on a tiny toggle', 'State lives too high', 'Push it down into the component that owns it'],
      ['An input ignores a new prop', 'A prop copied into state', 'Let the parent own it, or reset with <code>key</code>'],
    ]),
    en: 'Three questions decide where state lives. First: must it be state at all, or can it be computed? Second: who needs it, one component or several? Third: who is their closest common parent, because that is its home. The table maps the symptoms you will see to their usual cause: numbers that disagree mean redundant state; a sibling that cannot see a value means state too low; a page that re-renders on a tiny toggle means state too high; and an input that ignores a new prop means a prop copied into state.' },
  { t: "Don't store what you can derive — measured", body: two(tsx(`// ✗ GioThua — count stored as a SECOND state
const [items, setItems] = useState(['táo', 'cam']);
const [count, setCount] = useState(2);
// "thêm": setItems(…) and setCount(count + 1)
// "xoá":  setItems(items.slice(1)) — no setCount!

// ✓ GioSuyRa — count derived during render
const [items, setItems] = useState(['táo', 'cam']);
const count = items.length;`, { sm: true, hl: [3, 5, 9] }),
      D(B('o-dau-gio', { vp: 640, h: 175, w: 520, url: 'localhost:3000/o-dau · thêm, xoá, xoá', mark: [[33, 33, 330, 28, ''], [33, 117, 300, 28, '']] }),
      box('Measured: 1 item, count 3', 'Same clicks on both boxes — add, remove, remove. The stored <code>count</code> drifted to <b>3</b> while <code>items</code> holds <b>1</b>. The derived one says <b>1</b>, always.', 'do2'))) +
    box('Every redundant state is a chance for two sources of truth to disagree', 'You now have to remember to update <b>both</b> in every handler — forget once and the screen lies. <code>items.length</code> cannot drift: it is recomputed on every render, for free.', 'cam'),
    en: 'Don’t store what you can derive, measured. The left box keeps count as a second piece of state; the right box computes count from items during render. Same clicks on both: add, remove, remove. The stored count drifted to three while items holds one, because the remove handler forgot setCount. The derived count says one, always. Every redundant state is a chance for two sources of truth to disagree.' },
  { t: 'Derived, not stored: the everyday cases', body: cmp(['Value', '✗ Stored as state', '✓ Computed during render'], [
      ['Count', '<code>const [count, setCount] = useState(0)</code>', '<code>items.length</code>'],
      ['Full name', '<code>const [fullName, setFullName] = …</code>', '<code>first + \' \' + last</code>'],
      ['Filtered list', '<code>[filtered, setFiltered]</code> + an effect to sync', '<code>items.filter((i) =&gt; i.includes(q))</code>'],
      ['Order total', '<code>[total, setTotal]</code> updated in every handler', '<code>lines.reduce((s, l) =&gt; s + l.price * l.qty, 0)</code>'],
      ['"Form is valid"', '<code>[isValid, setIsValid]</code>', '<code>email.includes(\'@\') &amp;&amp; pw.length &gt;= 8</code>'],
    ], { hl: [2] }) + two(
      box('The rule', 'If you can compute it from the state or props you already have <b>during render</b>, compute it. Don\'t store it.', 'xanh'),
      box('"But it is expensive"', 'Then cache the computation with <code>useMemo</code> (Chapter 6) — still a derived value, still not state. Measure first (Chapter 7).', 'lam')),
    en: 'Derived, not stored: the everyday cases. A count is items dot length. A full name is first plus last. A filtered list is items dot filter with the keyword — never a second list kept in sync by an effect. An order total is a reduce over the lines. A form-is-valid flag is a boolean expression. The rule: if you can compute it during render from what you already have, compute it. If it is expensive, cache the computation with useMemo in Chapter six; it is still derived, still not state.' },
  { t: 'Keep state local — measured', body: two(tsx(`// ✗ the flag lives in the parent block
function KhoiNang() {
  const [mo, setMo] = useState(false);
  return (<>
    <Menu mo={mo} onDoi={() => setMo(!mo)} />
    <BangA />   {/* sibling */}
  </>);
}
// ✓ the flag lives inside the menu
function MenuTuGiu() {
  const [mo, setMo] = useState(false);
  return <Menu mo={mo} onDoi={() => setMo(!mo)} />;
}`, { sm: true, hl: [3, 11] }),
      D(B('cuc-bo-sau', { vp: 640, h: 230, w: 520, url: 'localhost:3000/cuc-bo · menu ×3 each', mark: [[33, 83, 330, 28, ''], [33, 187, 330, 28, '']] }),
      box('Measured under next start', 'Each menu toggled <b>3</b> times. Flag in the parent ⇒ the sibling table rendered <b>4</b> times (1 + 3). Flag in the menu ⇒ <b>1</b> time.', 'do2'),
      box('No higher than needed', 'Local state limits <b>what re-renders</b>. Start local; lift only when a second component truly needs it.', 'xanh'))),
    en: 'Keep state local, measured. On the left the menu’s open flag lives in the parent block, so every toggle re-renders the parent and the sibling table with it. In the version below, the flag lives inside the menu that uses it. Each menu toggled three times under next start: with the flag in the parent the sibling table rendered four times, one plus three; with the flag in the menu it rendered once. Start local, and lift only when a second component truly needs it.' },
  { t: "Siblings can't see each other's state", body: tsx(AE.split('\n').slice(3).join('\n'), { sm: true, hl: [7] }) +
    two(tn(lenh(/anh-em/), { fs: 14, wrap: 58, title: 'terminal — tsc' }),
      box('The input knows, the list does not', '<code>query</code> lives inside <code>OTim</code>. Its sibling <code>KetQua</code> cannot read it — TypeScript refuses with <b>TS2304</b>.', 'do2')) +
    two(`<div>${B('nang-sau', { vp: 640, h: 122, w: 540, url: 'localhost:3000/nang · typed "an"', mark: [[33, 53, 245, 30, ''], [33, 83, 400, 28, '']] })}</div>`,
      box('At runtime: nothing filters', 'With <code>query</code> kept inside the input, typing <b>an</b> leaves the list at <b>An, Bình, Lan, Minh (4)</b>. State is private to its component.', 'lam')),
    en: 'Siblings can’t see each other’s state. The query lives inside the search input; the result list is its sibling and has no way to read it. TypeScript refuses with error TS two three zero four, cannot find name query. And in the browser, typing a n into the box changes nothing: the list stays An, Bình, Lan, Minh, four names. State is private to its component; data only travels down the tree as props.' },
  { t: 'Lift state up to the closest common parent', body: two(tsx(`function FilterablePage() {
  const [query, setQuery] = useState('');  // lives HERE
  return (<>
    <SearchInput value={query} onChange={setQuery} />
    <Results query={query} />
  </>);
}

function Results({ query }: { query: string }) {
  const loc = TEN.filter((t) =>
    t.toLowerCase().includes(query.toLowerCase()));
  return <p>kết quả: {loc.join(', ')} ({loc.length})</p>;
}`, { sm: true, hl: [2, 4, 5] }),
      D(B('nang-sau', { vp: 640, h: 230, w: 430, url: 'localhost:3000/nang · "an" in both', mark: [[33, 157, 245, 30, ''], [33, 187, 300, 28, '']] }),
      box('Measured: An, Lan (2)', 'Same keystrokes. With <code>query</code> in the parent, the list filters as you type. The version above still shows all <b>4</b>.', 'xanh') +
      box('Notice', '<code>Results</code> <b>derives</b> the filtered list — lifting and deriving work together.', 'lam')), 'r64'),
    en: 'Lift state up to the closest common parent. Move query into FilterablePage, then pass it down: the value as a prop to Results, and the setter as onChange to SearchInput. Measured with the same keystrokes: the list now filters as you type, An and Lan, two names, while the first version still shows all four. Notice that Results derives the filtered list instead of storing it: lifting and deriving work together.' },
  { t: 'Data flows down, changes flow up', body: seq(['Results', 'FilterablePage', 'SearchInput'], [
      [2, 1, "onChange('an') ↑ reports a change", '#b85a2b'],
      [1, 1, "setQuery('an') ⇒ re-render", '#0070f3'],
      [1, 2, "value = 'an'   ↓ prop", '#15803d'],
      [1, 0, "query = 'an'   ↓ prop", '#15803d'],
      [0, 0, 'filter ⇒ An, Lan (2)', '#15803d'],
    ], { rh: 56, fs: 20 }) + two(
      box('One source of truth', 'The parent <b>owns</b> <code>query</code>. There is exactly one copy, so the input and the list can never disagree.', 'xanh'),
      box('Controlled children', '<code>SearchInput</code> shows what it is given and reports changes upward; <code>Results</code> reads downward. Neither owns the data — the parent controls both.', 'lam')),
    en: 'Data flows down, changes flow up. When you type, SearchInput does not change anything itself: it reports the change upward through onChange. The parent calls setQuery and re-renders. Then the new value flows down twice: as value to the input and as query to the list, which filters to An and Lan. One source of truth, owned by the parent; both children are controlled by it.' },
  { t: 'When lifting goes too far: prop drilling', body: path([
      { t: 'App', s: 'owns user', mau: '#0070f3', on: true },
      { t: 'Layout', s: 'only passes it on', mau: '#94a3b8' },
      { t: 'Sidebar', s: 'only passes it on', mau: '#94a3b8' },
      { t: 'Avatar', s: 'actually uses it', mau: '#15803d', on: true },
    ], { h: 180, fs: 23, nhan: ['user', 'user', 'user'] }) + two(
      box('A signal, not a crime', 'Shared state that must travel through many components that don\'t use it — just forwarding it, layer after layer — is <b>prop drilling</b>. Every middle layer now has a prop it doesn\'t care about.', 'cam'),
      box('What comes later', '<b>Chapter 6</b>: <code>useContext</code> for state many distant components need (theme, current user). <b>Chapter 14</b>: dedicated stores for app-wide state.', 'lam')) +
    box('Lifting is the correct first move', 'Lift first. Reach for context or a store only when lifting starts to hurt — not before.', 'xanh'),
    en: 'When lifting goes too far: prop drilling. If shared state must travel through many components that don’t use it, just forwarding it layer after layer, that is prop drilling, and it is a signal. Layout and Sidebar here carry user only to hand it to Avatar. Chapter six introduces useContext for state that many distant components need, like the theme or the current user, and Chapter fourteen covers dedicated stores. Lifting is still the correct first move; reach for those only when lifting starts to hurt.' },
  { t: 'Deciding where a piece of state belongs', body: tiers([
      ['count', '1 · Can you compute it?', 'derive it during render — don\'t store it', '#b85a2b'],
      ['box', '2 · Only one component uses it?', 'keep it there — local state', '#0070f3'],
      ['merge', '3 · Two siblings need it?', 'lift it to the closest common parent', '#15803d'],
      ['tree', '4 · Half the app needs it?', 'context or a store (Ch 6, Ch 14)', '#7c3aed'],
      ['server', '… is it really server data?', 'that belongs in a cache, not component state (Ch 10, Ch 14)', '#475569'],
    ], { th: 62, gap: 20 }) + box('The right level', 'The right level for a piece of state is the <b>smallest subtree</b> that needs it.', 'xanh'),
    en: 'Deciding where a piece of state belongs, top to bottom. Can you compute it? Then derive it during render. Only one component uses it? Keep it there. Two siblings need it? Lift it to the closest common parent. Half the app needs it? Context or a store. And before that, check whether it is really server data: that belongs in a cache, not in component state. The right level is the smallest subtree that needs it.' },
  { t: 'The trap: copying a prop into state — measured', body: two(D(tsx(`function OTen({ name }: { name: string }) {
  const [ten, setTen] = useState(name); // ✗ read ONCE
  return <input value={ten}
    onChange={(e) => setTen(e.target.value)} />;
}
// parent switches An → Bình:
<OTen name={nguoi.name} />                // "An"
<OTen key={nguoi.id} name={nguoi.name} /> // "Bình"`, { sm: true, hl: [2, 8] }) +
      box('Why', 'The argument of <code>useState</code> is an <b>initial</b> value, not a binding: read on the first render, ignored after.', 'do2')),
      `<div>${B('o-dau-sau', { vp: 640, h: 345, w: 400, url: 'localhost:3000/o-dau · "đổi người"', mark: [[24, 192, 200, 28, ''], [118, 266, 245, 30, ''], [88, 304, 245, 30, '']] })}</div>`, 'r64') +
    vsd('The parent says <b>Bình</b>, the box still shows <b>An</b> — two sources of truth for one fact. Looks like a cache bug; it is a design bug.',
      'Let the parent own the value and pass a handler down — or, for a deliberate editable copy per record, give it a <code>key</code>.', '✗ Copied prop', '✓ Two ways out'),
    en: 'The trap: copying a prop into state to make it editable. useState of name reads the prop exactly once, on the first render, then ignores it forever, because its argument is an initial value, not a binding. Measured: after switching from An to Bình, the parent says Bình but the box without a key still shows An. Give it a key equal to the record id and React rebuilds it: Bình. Either let the parent own the value, or use a key for a deliberate per-record copy.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Derived value', 'computed during render from state/props — never stored'), kw('Redundant state', 'the same fact stored twice; it drifts'),
      kw('Single source of truth', 'exactly one owner for each fact'), kw('Lifting state up', 'move shared state to the closest common parent'),
      kw('Closest common parent', 'the lowest component above everyone who needs it'), kw('Controlled component', 'shows a value it is given, reports changes up'),
      kw('Prop drilling', 'forwarding props through layers that don\'t use them'), kw('Initial value', 'useState(x) reads x on the first render only'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: derived value; redundant state; single source of truth; lifting state up; closest common parent; controlled component; prop drilling; and initial value — useState reads its argument on the first render only.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'Find two components that need the same value and lift that state to their closest common parent',
      `Spot one derived value you keep in state (a count, a filtered list, a total) and replace it with a value computed during render`,
      'For one widget, decide: local or lifted? Justify it in one sentence',
      `Break it on purpose: copy a prop into state, switch records, then fix it with a parent-owned value or ${c('key')}`,
    ]), box('Keep these', `<ul><li>Keep state as local as possible</li><li>Lift shared state to the closest common parent — one source of truth</li><li>Never store what you can derive</li><li>The right level is the smallest subtree that needs it</li></ul>`, 'lam'), ''),
    en: 'Your turn: lift a shared value to the closest common parent; replace one derived value you store in state with a value computed during render; decide for one widget whether its state is local or lifted, and justify it in one sentence; and break it on purpose by copying a prop into state, then fix it. Keep: state as local as possible, shared state at the closest common parent, never store what you can derive, and the right level is the smallest subtree that needs it.' },
];
export const slides = lamDeck({ chuong: 'Chapter 3 — State & the re-render model', bai: '3.4' }, S);
