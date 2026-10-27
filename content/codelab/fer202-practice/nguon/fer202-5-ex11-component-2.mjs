/**
 * FER202 · Exercise 11 — React Component 2: to-do, calculator, search filter (+ hai bài nâng cao).
 */
import { doiDau, KHOA, reactNho } from './_chung.mjs';

const click = (selector, lan = 1) => ({ hanhDong: 'click', selector, lan });
const nhap = (selector, giaTri) => ({ hanhDong: 'nhap', selector, giaTri });
const doi = (selector, giaTri) => ({ hanhDong: 'doi', selector, giaTri });

export default doiDau({
  slug: 'fer202-5-ex11-component-2',
  ten: '5.5 Exercise 11 — To-do, calculator, search filter',
  khoa: KHOA,
  baiHoc: 'fer202-5-ex11-component-2',
  de: [
    reactNho({
      tieuDe: 'To-do list: add and delete by id',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['array state', 'spread to add', 'filter to delete', 'key'], the: ['state', 'lists', 'exercise-11'],
      moTa: {
        en: '<p>The first app of Exercise 11. Keep the to-dos in an array state; add with spread, delete with <code>filter</code> by a stable <b>id</b> — never by index.</p>',
        vi: '<p>Ứng dụng đầu của Exercise 11. Giữ to-do trong state mảng; thêm bằng spread, xoá bằng <code>filter</code> theo <b>id</b> ổn định — không theo index.</p>',
      },
      yeuCau: [
        { en: '<code>form#todo-form</code> with <code>#todo-input</code> (submit adds; trimmed; empty ignored; input cleared; page never reloads).', vi: '<code>form#todo-form</code> có <code>#todo-input</code> (gửi để thêm; bỏ khoảng trắng; rỗng thì bỏ qua; xoá ô; trang không tải lại).' },
        { en: '<code>ul#todos</code> → <code>li.todo</code> with text and a <code>.btn-delete</code>; <code>#remaining</code> "N tasks".', vi: '<code>ul#todos</code> → <code>li.todo</code> có chữ và nút <code>.btn-delete</code>; <code>#remaining</code> "N tasks".' },
      ],
      viDu: [{ input: 'add "Read chapter 5", add "Exercise 11", delete the first', output: 'Exercise 11 · 1 tasks', explanation: 'setTodos(todos.filter((t) => t.id !== id))|||setTodos(todos.filter((t) => t.id !== id))' }],
      goiY: ['setTodos((list) => [...list, { id: Date.now(), text }]) — hoặc bộ đếm id tăng dần.', 'onSubmit={(e) => { e.preventDefault(); … }} để Enter cũng thêm được.'],
      loiHayGap: ['Xoá theo index (<code>splice(i, 1)</code>) ⇒ sửa mảng state và sai khi danh sách đổi thứ tự.', 'Thiếu <code>preventDefault</code> ⇒ trang tải lại, mất hết to-do.'],
      thuatNgu: [{ en: 'to-do', vi: 'việc cần làm' }],
      giaiThich: '<p>Thêm: tạo mảng mới có phần tử cuối mới. Xoá: tạo mảng mới không có phần tử đó. Id ổn định giúp key đúng và xoá đúng phần tử dù danh sách thay đổi.</p>',
      dau: `// src/App.js — STARTER
import { useState } from 'react';

export default function App() {
  const [todos, setTodos] = useState([]);
  return (
    <form id="todo-form">
      <input id="todo-input" />
      <button>Add</button>
      <ul id="todos">{todos.map((t, i) => <li key={i} className="todo">{t}</li>)}</ul>
    </form>
  );
}
`,
      giai: `// src/App.js — thêm bằng spread, xoá bằng filter theo id; form không tải lại trang
import { useState } from 'react';

let nextId = 1;

export default function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');

  const add = (e) => {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    setTodos((list) => [...list, { id: nextId++, text: value }]);
    setText('');
  };
  const remove = (id) => setTodos((list) => list.filter((t) => t.id !== id));

  return (
    <div>
      <form id="todo-form" onSubmit={add}>
        <input id="todo-input" value={text} onChange={(e) => setText(e.target.value)} placeholder="What needs to be done?" />
        <button type="submit">Add</button>
      </form>
      <ul id="todos">
        {todos.map((t) => (
          <li key={t.id} className="todo">
            <span className="todo-text">{t.text}</span>
            <button type="button" className="btn-delete" onClick={() => remove(t.id)}>✕</button>
          </li>
        ))}
      </ul>
      <p id="remaining">{todos.length} tasks</p>
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Adding two to-dos', kiem: 'danh-sach-text', selector: '.todo-text', mongDoi: ['Read chapter 5', 'Exercise 11'], truoc: [nhap('#todo-input', 'Read chapter 5'), { hanhDong: 'gui', selector: '#todo-form' }, nhap('#todo-input', '  Exercise 11 '), { hanhDong: 'gui', selector: '#todo-form' }] },
        { moTa: 'Delete removes exactly that one', kiem: 'danh-sach-text', selector: '.todo-text', mongDoi: ['Exercise 11'], truoc: [nhap('#todo-input', 'Read chapter 5'), { hanhDong: 'gui', selector: '#todo-form' }, nhap('#todo-input', 'Exercise 11'), { hanhDong: 'gui', selector: '#todo-form' }, click('.todo:first-child .btn-delete')] },
        { moTa: 'Submitting does not reload; input cleared', kiem: 'thuoc-tinh-js', selector: '#todo-input', thuocTinh: 'value', giaTri: '', truoc: [nhap('#todo-input', 'X'), { hanhDong: 'gui', selector: '#todo-form' }] },
        { an: true, moTa: 'Empty text ignored', kiem: 'text', selector: '#remaining', giaTri: '0 tasks', truoc: [nhap('#todo-input', '   '), { hanhDong: 'gui', selector: '#todo-form' }] },
        { an: true, moTa: 'No reload on submit', kiem: 'khong-tai-lai', truoc: [nhap('#todo-input', 'X'), { hanhDong: 'gui', selector: '#todo-form' }] },
      ],
    }),
    reactNho({
      tieuDe: 'Calculator with a division-by-zero guard',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['controlled inputs', 'Number()', 'switch', 'error state'], the: ['state', 'forms', 'exercise-11'],
      moTa: {
        en: '<p>Second app of Exercise 11: two number inputs, an operator select (+, −, ×, ÷) and a "Calculate" button. Show the result, or an error for empty inputs and division by zero.</p>',
        vi: '<p>Ứng dụng thứ hai của Exercise 11: hai ô số, select phép tính (+, −, ×, ÷) và nút "Calculate". Hiện kết quả, hoặc báo lỗi khi ô trống và khi chia cho 0.</p>',
      },
      yeuCau: [
        { en: '<code>#a</code>, <code>#b</code> (type number), <code>#op</code> (values <code>+ - * /</code>), <code>#calc</code>; result in <code>#result</code> "Result: 7.5".', vi: '<code>#a</code>, <code>#b</code> (type number), <code>#op</code> (giá trị <code>+ - * /</code>), <code>#calc</code>; kết quả trong <code>#result</code> "Result: 7.5".' },
        { en: 'Errors in <code>#error</code>: "Please enter two numbers" / "Cannot divide by zero". Results rounded to 4 decimals.', vi: 'Lỗi trong <code>#error</code>: "Please enter two numbers" / "Cannot divide by zero". Kết quả làm tròn 4 chữ số thập phân.' },
      ],
      viDu: [{ input: '10 / 4', output: 'Result: 2.5', explanation: 'Input values are strings — convert with Number().|||Giá trị ô nhập là chuỗi — đổi bằng Number().' }],
      goiY: ['Giữ a, b là chuỗi trong state; khi bấm mới Number(a), Number(b).', 'Làm tròn: Math.round(x * 10000) / 10000.'],
      loiHayGap: ['<code>a + b</code> với chuỗi ⇒ "2" + "3" = "23".', 'Kiểm chia 0 sau khi đã chia ⇒ hiện Infinity.'],
      thuatNgu: [{ en: 'operand / operator', vi: 'toán hạng / toán tử' }],
      giaiThich: '<p>Ô nhập luôn trả chuỗi; đổi sang số đúng lúc tính. Kiểm điều kiện lỗi TRƯỚC khi tính, và giữ kết quả/lỗi trong state để giao diện chỉ hiện một trong hai.</p>',
      dau: `// src/App.js — STARTER
import { useState } from 'react';

export default function App() {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [result, setResult] = useState('');
  return (
    <div>
      <input id="a" type="number" value={a} onChange={(e) => setA(e.target.value)} />
      <select id="op"><option value="+">+</option><option value="-">−</option><option value="*">×</option><option value="/">÷</option></select>
      <input id="b" type="number" value={b} onChange={(e) => setB(e.target.value)} />
      <button id="calc" onClick={() => setResult(a + b)}>Calculate</button>
      <p id="result">Result: {result}</p>
    </div>
  );
}
`,
      giai: `// src/App.js — đổi chuỗi → số đúng lúc tính; kiểm lỗi TRƯỚC khi tính
import { useState } from 'react';

function compute(x, op, y) {
  switch (op) {
    case '+': return x + y;
    case '-': return x - y;
    case '*': return x * y;
    case '/': return x / y;
    default: return NaN;
  }
}

export default function App() {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [op, setOp] = useState('+');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const calculate = () => {
    if (a.trim() === '' || b.trim() === '') return (setError('Please enter two numbers'), setResult(null));
    if (op === '/' && Number(b) === 0) return (setError('Cannot divide by zero'), setResult(null));
    setError('');
    setResult(Math.round(compute(Number(a), op, Number(b)) * 10000) / 10000);
  };

  return (
    <div>
      <input id="a" type="number" value={a} onChange={(e) => setA(e.target.value)} />
      <select id="op" value={op} onChange={(e) => setOp(e.target.value)}>
        <option value="+">+</option>
        <option value="-">−</option>
        <option value="*">×</option>
        <option value="/">÷</option>
      </select>
      <input id="b" type="number" value={b} onChange={(e) => setB(e.target.value)} />
      <button id="calc" type="button" onClick={calculate}>Calculate</button>
      {error && <p id="error">{error}</p>}
      {result !== null && <p id="result">Result: {result}</p>}
    </div>
  );
}
`,
      kiem: [
        { moTa: '2.5 × 3 = 7.5', kiem: 'text', selector: '#result', giaTri: 'Result: 7.5', truoc: [nhap('#a', '2.5'), doi('#op', '*'), nhap('#b', '3'), click('#calc')] },
        { moTa: '10 / 0 ⇒ error', kiem: 'text', selector: '#error', giaTri: 'Cannot divide by zero', truoc: [nhap('#a', '10'), doi('#op', '/'), nhap('#b', '0'), click('#calc')] },
        { moTa: 'Numbers are added, not concatenated', kiem: 'text', selector: '#result', giaTri: 'Result: 5', truoc: [nhap('#a', '2'), nhap('#b', '3'), click('#calc')] },
        { an: true, moTa: 'Empty input ⇒ error, no result', kiem: 'so-luong', selector: '#error, #result', giaTri: 1, truoc: [nhap('#a', '4'), click('#calc')] },
        { an: true, moTa: '1 / 3 rounded to 4 decimals', kiem: 'text', selector: '#result', giaTri: 'Result: 0.3333', truoc: [nhap('#a', '1'), doi('#op', '/'), nhap('#b', '3'), click('#calc')] },
      ],
    }),
    reactNho({
      tieuDe: 'Search filter: derive the shown list',
      doKho: 'MEDIUM', phut: 10,
      khaiNiem: ['derived list', 'controlled input', 'case-insensitive'], the: ['state', 'derived', 'exercise-11'],
      moTa: {
        en: '<p>Third app of Exercise 11: a search box filters a list of students live. Store only the query; the visible list is <b>computed</b> during render from the items prop and the query — never stored in its own state.</p>',
        vi: '<p>Ứng dụng thứ ba của Exercise 11: ô tìm lọc danh sách sinh viên ngay khi gõ. Chỉ lưu từ khoá; danh sách hiển thị được <b>tính</b> khi render từ prop items và từ khoá — không lưu thành state riêng.</p>',
      },
      yeuCau: [
        { en: '<code>SearchList({ items })</code>: <code>#q</code> input; <code>ul#results li</code>; match name OR student code, case-insensitive, ignoring surrounding spaces.', vi: '<code>SearchList({ items })</code>: ô <code>#q</code>; <code>ul#results li</code>; khớp tên HOẶC mã SV, không phân biệt hoa/thường, bỏ khoảng trắng hai đầu.' },
        { en: 'No match ⇒ <code>#no-match</code> "No student matches “…”".', vi: 'Không khớp ⇒ <code>#no-match</code> "No student matches “…”".' },
      ],
      viDu: [{ input: 'q = "  se17 "', output: 'students whose code contains SE17', explanation: 'Trim + lower-case both sides before comparing.|||Trim + chữ thường cả hai vế trước khi so.' }],
      goiY: ['const q = query.trim().toLowerCase(); const shown = items.filter((s) => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q));', 'Đừng tạo useState(shown).'],
      loiHayGap: ['Lưu <code>shown</code> trong state và cập nhật trong onChange ⇒ khi items đổi thì danh sách cũ (stale).', 'Quên trim ⇒ gõ thừa dấu cách là không ra kết quả.'],
      thuatNgu: [{ en: 'stale state', vi: 'state cũ không còn khớp dữ liệu' }],
      giaiThich: '<p>Danh sách lọc phụ thuộc hoàn toàn vào <code>items</code> + <code>query</code>, nên tính khi render là đủ — luôn đúng, không bao giờ "cũ". Nếu danh sách rất lớn mới cần <code>useMemo</code>.</p>',
      dau: `// src/App.js — STARTER
import { useState } from 'react';

const STUDENTS = [
  { id: 1, code: 'SE170001', name: 'Nguyen Van An' },
  { id: 2, code: 'SE170245', name: 'Tran Thi Binh' },
  { id: 3, code: 'SS180010', name: 'Le Hoang Cuong' },
  { id: 4, code: 'SE180777', name: 'Pham Ngoc Anh' },
];

function SearchList({ items }) {
  const [shown, setShown] = useState(items);
  return (
    <div>
      <input id="q" onChange={(e) => setShown(items.filter((s) => s.name.includes(e.target.value)))} />
      <ul id="results">{shown.map((s) => <li key={s.id}>{s.code} — {s.name}</li>)}</ul>
    </div>
  );
}

export default function App() {
  return <SearchList items={STUDENTS} />;
}
`,
      giai: `// src/App.js — chỉ lưu từ khoá; danh sách hiển thị TÍNH khi render
import { useState } from 'react';

const STUDENTS = [
  { id: 1, code: 'SE170001', name: 'Nguyen Van An' },
  { id: 2, code: 'SE170245', name: 'Tran Thi Binh' },
  { id: 3, code: 'SS180010', name: 'Le Hoang Cuong' },
  { id: 4, code: 'SE180777', name: 'Pham Ngoc Anh' },
];

function SearchList({ items }) {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const shown = items.filter((s) => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q));
  return (
    <div>
      <input id="q" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name or code..." />
      {shown.length === 0 ? (
        <p id="no-match">No student matches “{query.trim()}”</p>
      ) : (
        <ul id="results">{shown.map((s) => <li key={s.id}>{s.code} — {s.name}</li>)}</ul>
      )}
    </div>
  );
}

export default function App() {
  return <SearchList items={STUDENTS} />;
}
`,
      kiem: [
        { moTa: 'All four at first', kiem: 'so-luong', selector: '#results li', giaTri: 4 },
        { moTa: '"anh" matches by name (case-insensitive)', kiem: 'danh-sach-text', selector: '#results li', mongDoi: ['SE180777 — Pham Ngoc Anh'], truoc: [nhap('#q', 'ANH')] },
        { moTa: '"  se17 " matches by code with spaces', kiem: 'so-luong', selector: '#results li', giaTri: 2, truoc: [nhap('#q', '  se17 ')] },
        { moTa: 'No match message', kiem: 'text', selector: '#no-match', giaTri: 'No student matches “xyz”', truoc: [nhap('#q', 'xyz')] },
        { an: true, moTa: 'The shown list is not stored in state', kiem: 'ma-nguon', khop: 'useState\\(\\s*items\\s*\\)', phuDinh: true },
      ],
    }),
    reactNho({
      tieuDe: 'To-do pro: toggle, filter tabs and counters',
      doKho: 'HARD', phut: 18,
      khaiNiem: ['map toggle', 'filter view', 'derived counts', 'conditional class'], the: ['state', 'lists', 'exercise-11'],
      moTa: {
        en: '<p>Extend the to-do list like a real app: mark items done, switch between <b>All / Active / Done</b>, see counters, and "Clear done". Only the items array and the current filter are state.</p>',
        vi: '<p>Mở rộng to-do như ứng dụng thật: đánh dấu xong, chuyển giữa <b>All / Active / Done</b>, xem bộ đếm và "Clear done". Chỉ mảng to-do và bộ lọc hiện tại là state.</p>',
      },
      yeuCau: [
        { en: 'Starts with 4 given to-dos. <code>.todo</code> has a checkbox <code>.toggle</code>; done items get class <code>done</code>.', vi: 'Bắt đầu với 4 to-do cho sẵn. <code>.todo</code> có checkbox <code>.toggle</code>; việc xong có class <code>done</code>.' },
        { en: 'Filter buttons <code>#f-all</code>, <code>#f-active</code>, <code>#f-done</code> (selected has class <code>selected</code>); <code>#counts</code> "2 active · 2 done"; <code>#clear-done</code>.', vi: 'Nút lọc <code>#f-all</code>, <code>#f-active</code>, <code>#f-done</code> (nút đang chọn có class <code>selected</code>); <code>#counts</code> "2 active · 2 done"; <code>#clear-done</code>.' },
      ],
      viDu: [{ input: 'tick "Buy milk", choose Active', output: 'only the not-done items', explanation: 'const visible = todos.filter(FILTERS[filter])|||const visible = todos.filter(FILTERS[filter])' }],
      goiY: ["const FILTERS = { all: () => true, active: (t) => !t.done, done: (t) => t.done };", 'Toggle: setTodos(ts => ts.map(t => t.id === id ? { ...t, done: !t.done } : t)).'],
      loiHayGap: ['Lọc bằng cách xoá phần tử khỏi state ⇒ chuyển về All là mất việc.', 'Lưu các số đếm trong state ⇒ lệch sau khi toggle/clear.'],
      thuatNgu: [{ en: 'view filter', vi: 'bộ lọc hiển thị (không đổi dữ liệu)' }],
      giaiThich: '<p>Bộ lọc chỉ đổi CÁCH NHÌN, không đổi dữ liệu: <code>visible = todos.filter(FILTERS[filter])</code>. Số đếm, trạng thái nút "Clear done" đều suy ra từ <code>todos</code>.</p>',
      dau: `// src/App.js — STARTER
import { useState } from 'react';

export default function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Buy milk', done: false },
    { id: 2, text: 'Read chapter 5', done: true },
    { id: 3, text: 'Exercise 11', done: false },
    { id: 4, text: 'Push to GitHub', done: true },
  ]);
  // TODO: toggle, bộ lọc All/Active/Done, #counts, #clear-done
  return <ul>{todos.map((t) => <li key={t.id} className="todo">{t.text}</li>)}</ul>;
}
`,
      giai: `// src/App.js — state: todos + filter; danh sách hiển thị và số đếm đều SUY RA
import { useState } from 'react';

const FILTERS = { all: () => true, active: (t) => !t.done, done: (t) => t.done };

export default function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Buy milk', done: false },
    { id: 2, text: 'Read chapter 5', done: true },
    { id: 3, text: 'Exercise 11', done: false },
    { id: 4, text: 'Push to GitHub', done: true },
  ]);
  const [filter, setFilter] = useState('all');

  const toggle = (id) => setTodos((ts) => ts.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const clearDone = () => setTodos((ts) => ts.filter((t) => !t.done));

  const visible = todos.filter(FILTERS[filter]);
  const doneCount = todos.filter((t) => t.done).length;

  return (
    <div>
      <div className="filters">
        {['all', 'active', 'done'].map((f) => (
          <button key={f} id={´f-@{f}´} type="button" className={filter === f ? 'selected' : ''} onClick={() => setFilter(f)}>
            {f[0].toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
      <ul id="todos">
        {visible.map((t) => (
          <li key={t.id} className={t.done ? 'todo done' : 'todo'}>
            <label><input type="checkbox" className="toggle" checked={t.done} onChange={() => toggle(t.id)} /> {t.text}</label>
          </li>
        ))}
      </ul>
      <p id="counts">{todos.length - doneCount} active · {doneCount} done</p>
      <button id="clear-done" type="button" disabled={doneCount === 0} onClick={clearDone}>Clear done</button>
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Initial counts', kiem: 'text', selector: '#counts', giaTri: '2 active · 2 done' },
        { moTa: 'Active filter after ticking "Buy milk"', kiem: 'danh-sach-text', selector: '.todo', mongDoi: ['Exercise 11'], truoc: [{ hanhDong: 'chon-o', selector: '.todo:first-child .toggle' }, click('#f-active')] },
        { moTa: 'Selected filter button is marked', kiem: 'ton-tai', selector: '#f-done.selected', truoc: [click('#f-done')] },
        { moTa: 'Clear done keeps active items', kiem: 'danh-sach-text', selector: '.todo', mongDoi: ['Buy milk', 'Exercise 11'], truoc: [click('#clear-done')] },
        { an: true, moTa: 'Back to All shows everything again', kiem: 'so-luong', selector: '.todo', giaTri: 4, truoc: [click('#f-done'), click('#f-all')] },
        { an: true, moTa: 'Done items have class done', kiem: 'so-luong', selector: '.todo.done', giaTri: 2 },
      ],
    }),
    reactNho({
      tieuDe: 'Search with highlighted matches',
      doKho: 'HARD', phut: 15,
      khaiNiem: ['string split', 'mark element', 'escaping RegExp', 'keys for fragments'], the: ['state', 'strings', 'exercise-11'],
      moTa: {
        en: '<p>Make the search filter friendlier: matched parts of each name are wrapped in <code>&lt;mark&gt;</code>. Build the parts safely — the query can contain special characters like <code>(</code> or <code>+</code>.</p>',
        vi: '<p>Làm ô tìm thân thiện hơn: phần khớp trong mỗi tên được bọc <code>&lt;mark&gt;</code>. Dựng các phần một cách an toàn — từ khoá có thể chứa ký tự đặc biệt như <code>(</code> hay <code>+</code>.</p>',
      },
      yeuCau: [
        { en: '<code>Highlight({ text, query })</code> returns the text with every case-insensitive match in <code>mark</code>; empty query ⇒ plain text.', vi: '<code>Highlight({ text, query })</code> trả chữ với mọi đoạn khớp (không phân biệt hoa/thường) bọc trong <code>mark</code>; từ khoá rỗng ⇒ chữ thường.' },
        { en: 'List <code>li.course</code> shows only matching courses; query <code>c++</code> must not crash.', vi: 'Danh sách <code>li.course</code> chỉ hiện khoá khớp; từ khoá <code>c++</code> không được làm lỗi.' },
      ],
      viDu: [{ input: 'query "re" on "React Redux"', output: '<mark>Re</mark>act <mark>Re</mark>dux', explanation: 'Keep the original letter case inside the mark.|||Giữ nguyên chữ hoa/thường gốc bên trong mark.' }],
      goiY: ["Escape: const safe = query.replace(/[.*+?^@{}()|[\\]\\\\]/g, '\\\\$&'); rồi text.split(new RegExp(´(@{safe})´, 'gi')).", 'split với nhóm ( ) giữ lại phần khớp; phần lẻ là khớp: parts.map((p, i) => i % 2 ? <mark key={i}>{p}</mark> : p).'],
      loiHayGap: ['<code>new RegExp(query)</code> không escape ⇒ "c++" ném SyntaxError: Nothing to repeat.', 'Dựng HTML bằng chuỗi rồi <code>dangerouslySetInnerHTML</code> ⇒ lỗ XSS.'],
      thuatNgu: [{ en: 'escape (regex)', vi: 'thoát ký tự đặc biệt của biểu thức chính quy' }, { en: 'highlight', vi: 'tô sáng' }],
      giaiThich: '<p><code>split</code> với một nhóm bắt giữ trả về [không khớp, khớp, không khớp, …] — phần tử ở vị trí lẻ là đoạn khớp. Escape từ khoá trước khi tạo RegExp để ký tự như <code>+</code> được hiểu là chữ thường.</p>',
      dau: `// src/App.js — STARTER
import { useState } from 'react';

const COURSES = ['React Redux', 'Advanced React', 'C++ Basics', 'Node.js API', 'Redis for Beginners'];

export default function App() {
  const [query, setQuery] = useState('');
  const shown = COURSES.filter((c) => new RegExp(query, 'i').test(c)); // ⚠ c++ làm lỗi
  return (
    <div>
      <input id="q" value={query} onChange={(e) => setQuery(e.target.value)} />
      <ul>{shown.map((c) => <li key={c} className="course">{c}</li>)}</ul>
    </div>
  );
}
`,
      giai: `// src/App.js — escape từ khoá rồi split theo nhóm bắt giữ; phần tử lẻ là đoạn khớp
import { useState } from 'react';

const COURSES = ['React Redux', 'Advanced React', 'C++ Basics', 'Node.js API', 'Redis for Beginners'];
const escapeRegExp = (s) => s.replace(/[.*+?^@{}()|[\\]\\\\]/g, '\\\\$&');

function Highlight({ text, query }) {
  const q = query.trim();
  if (!q) return text;
  const parts = text.split(new RegExp(´(@{escapeRegExp(q)})´, 'gi'));
  return parts.map((part, i) => (i % 2 === 1 ? <mark key={i}>{part}</mark> : part));
}

export default function App() {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const shown = COURSES.filter((c) => c.toLowerCase().includes(q));
  return (
    <div>
      <input id="q" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search courses..." />
      <ul>
        {shown.map((c) => (
          <li key={c} className="course"><Highlight text={c} query={query} /></li>
        ))}
      </ul>
    </div>
  );
}
`,
      kiem: [
        { moTa: '"re" highlights every match', kiem: 'danh-sach-text', selector: '.course mark', mongDoi: ['Re', 'Re', 'Re', 'Re'], truoc: [nhap('#q', 're')] },
        { moTa: 'Only matching courses are listed', kiem: 'danh-sach-text', selector: '.course', mongDoi: ['React Redux', 'Advanced React', 'Redis for Beginners'], truoc: [nhap('#q', 're')] },
        { moTa: '"c++" does not crash and finds C++', kiem: 'danh-sach-text', selector: '.course mark', mongDoi: ['C++'], truoc: [nhap('#q', 'c++')] },
        { an: true, moTa: 'No JS error with special characters', kiem: 'khong-loi-js', truoc: [nhap('#q', '(node')] },
        { an: true, moTa: 'Empty query ⇒ no marks', kiem: 'so-luong', selector: 'mark', giaTri: 0 },
      ],
    }),
  ],
});
