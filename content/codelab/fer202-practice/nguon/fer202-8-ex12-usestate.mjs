/**
 * FER202 · Exercise 12 — useState (bảy component nhỏ của handout, viết lại thành 5 đề có máy chấm).
 * Counter + Echo + Toggle → Todo List → Color Switcher → Search Filter → sắp xếp lại danh sách (Drag and Drop).
 */
import { doiDau, KHOA, reactNho } from './_chung.mjs';

const click = (selector, lan = 1) => ({ hanhDong: 'click', selector, lan });
const nhap = (selector, giaTri) => ({ hanhDong: 'nhap', selector, giaTri });

export default doiDau({
  slug: 'fer202-8-ex12-usestate',
  ten: 'Exercise 12 — useState',
  khoa: KHOA,
  baiHoc: 'fer202-8-ex12-usestate',
  de: [
    reactNho({
      tieuDe: 'Counter, Echo and Toggle',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['useState', 'controlled input', 'boolean toggle'], the: ['hooks', 'useState', 'exercise-12'],
      moTa: {
        en: '<p>The first three components of the handout, on one page: a <b>Counter</b> (+1), an <b>Echo</b> input that shows what you type in real time, and a <b>Toggle</b> button that shows/hides a paragraph.</p>',
        vi: '<p>Ba component đầu của handout, trên một trang: <b>Counter</b> (+1), ô <b>Echo</b> hiện ngay điều bạn gõ, và nút <b>Toggle</b> ẩn/hiện một đoạn văn.</p>',
      },
      yeuCau: [
        { en: 'Counter: <code>#count</code> starts at 0, <code>#btn-count</code> adds 1.', vi: 'Counter: <code>#count</code> bắt đầu 0, <code>#btn-count</code> cộng 1.' },
        { en: 'Echo: <code>#echo-input</code> (controlled) and <code>#echo</code> = <code>You typed: …</code>.', vi: 'Echo: <code>#echo-input</code> (controlled) và <code>#echo</code> = <code>You typed: …</code>.' },
        { en: 'Toggle: <code>#btn-toggle</code> reads <code>Show</code>/<code>Hide</code>; <code>#secret</code> visible only when shown.', vi: 'Toggle: <code>#btn-toggle</code> ghi <code>Show</code>/<code>Hide</code>; <code>#secret</code> chỉ có khi đang hiện.' },
      ],
      viDu: [{ input: 'type "abc"', output: 'You typed: abc', explanation: 'value + onChange = controlled input.|||value + onChange = ô nhập được điều khiển.' }],
      goiY: ['Mỗi component một useState riêng.', 'Toggle: setShow((s) => !s); nhãn {show ? "Hide" : "Show"}'],
      loiHayGap: ['Có <code>value</code> mà thiếu <code>onChange</code> ⇒ ô không gõ được.', 'Dùng biến thường <code>let n = 0</code> ⇒ không vẽ lại.'],
      thuatNgu: [{ en: 'controlled input', vi: 'ô nhập mà giá trị do state React quyết định' }],
      giaiThich: '<p>Vòng bốn bước của useState: state → JSX hiển thị → sự kiện gọi setter → React vẽ lại. Ba component dùng đúng vòng đó với kiểu dữ liệu khác nhau (số, chuỗi, boolean).</p>',
      dau: `// src/App.js — STARTER
export default function App() {
  let count = 0;
  return (
    <div>
      <p id="count">{count}</p>
      <button id="btn-count" onClick={() => { count++; }}>+1</button>
      <input id="echo-input" />
      <p id="echo">You typed: </p>
      <button id="btn-toggle">Show</button>
    </div>
  );
}
`,
      giai: `// src/App.js — ba component, mỗi cái một mẩu state
import { useState } from 'react';

function Counter() {
  const [n, setN] = useState(0);
  return (
    <div>
      <p id="count">{n}</p>
      <button id="btn-count" type="button" onClick={() => setN((x) => x + 1)}>+1</button>
    </div>
  );
}

function Echo() {
  const [text, setText] = useState('');
  return (
    <div>
      <input id="echo-input" value={text} onChange={(e) => setText(e.target.value)} />
      <p id="echo">You typed: {text}</p>
    </div>
  );
}

function Toggle() {
  const [show, setShow] = useState(false);
  return (
    <div>
      <button id="btn-toggle" type="button" onClick={() => setShow((s) => !s)}>{show ? 'Hide' : 'Show'}</button>
      {show && <p id="secret">React re-renders when state changes.</p>}
    </div>
  );
}

export default function App() {
  return (
    <div>
      <Counter />
      <Echo />
      <Toggle />
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Counter +3', kiem: 'text', selector: '#count', giaTri: '3', truoc: [click('#btn-count', 3)] },
        { moTa: 'Echo shows the text', kiem: 'text', selector: '#echo', giaTri: 'You typed: abc', truoc: [nhap('#echo-input', 'abc')] },
        { moTa: 'Toggle shows the paragraph and relabels', kiem: 'danh-sach-text', selector: '#btn-toggle', mongDoi: ['Hide'], truoc: [click('#btn-toggle')] },
        { an: true, moTa: 'Hidden by default', kiem: 'khong-ton-tai', selector: '#secret' },
        { an: true, moTa: 'Toggle twice hides again', kiem: 'khong-ton-tai', selector: '#secret', truoc: [click('#btn-toggle', 2)] },
      ],
    }),
    reactNho({
      tieuDe: 'Todo List: add and delete',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['array state', 'spread', 'filter', 'key'], the: ['hooks', 'useState', 'exercise-12'],
      moTa: {
        en: '<p>Handout task 4. Add todos from an input (button or Enter), delete them individually, and show a counter. Never mutate the array: use spread to add, <code>filter</code> to delete, and stable <code>id</code>s for <code>key</code>.</p>',
        vi: '<p>Bài 4 của handout. Thêm việc từ ô nhập (nút hoặc Enter), xoá từng việc, và hiện bộ đếm. Không đột biến mảng: spread để thêm, <code>filter</code> để xoá, <code>id</code> ổn định làm <code>key</code>.</p>',
      },
      yeuCau: [
        { en: 'Form <code>#todo-form</code> with <code>#todo-input</code>; blank (after trim) is ignored; the input clears after adding.', vi: 'Form <code>#todo-form</code> có <code>#todo-input</code>; chuỗi rỗng (sau trim) bị bỏ qua; ô nhập xoá trắng sau khi thêm.' },
        { en: 'Items <code>li.todo</code> with text in <code>span</code> and a <code>.btn-delete</code>; <code>#todo-count</code> = <code>2 todos</code> / <code>1 todo</code> / <code>No todos</code>.', vi: 'Dòng <code>li.todo</code> chữ trong <code>span</code> và nút <code>.btn-delete</code>; <code>#todo-count</code> = <code>2 todos</code> / <code>1 todo</code> / <code>No todos</code>.' },
      ],
      viDu: [{ input: 'add A, B, C; delete B', output: 'A, C · 2 todos', explanation: 'filter returns a new array without B.|||filter trả về mảng mới không có B.' }],
      goiY: ['setTodos((t) => [...t, { id: Date.now() + Math.random(), title: text.trim() }])', 'Xoá: setTodos((t) => t.filter((x) => x.id !== id))'],
      loiHayGap: ['<code>key={index}</code> ⇒ xoá dòng giữa làm React gắn nhầm state các dòng sau.', 'Quên <code>e.preventDefault()</code> ⇒ form tải lại trang.'],
      thuatNgu: [{ en: 'immutable update', vi: 'cập nhật bằng cách tạo bản mới, không sửa bản cũ' }],
      giaiThich: '<p>React chỉ vẽ lại khi setter nhận một mảng MỚI. Spread và filter đều trả mảng mới; <code>push</code>/<code>splice</code> sửa mảng cũ nên không đáng tin.</p>',
      dau: `// src/App.js — STARTER
import { useState } from 'react';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const add = () => { todos.push(text); setTodos(todos); };
  return (
    <form id="todo-form">
      <input id="todo-input" value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={add}>Add</button>
      <ul>{todos.map((t, i) => <li key={i} className="todo"><span>{t}</span></li>)}</ul>
    </form>
  );
}
`,
      giai: `// src/App.js — thêm bằng spread, xoá bằng filter, key = id
import { useState } from 'react';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');

  const add = (e) => {
    e.preventDefault();
    const title = text.trim();
    if (!title) return;
    setTodos((t) => [...t, { id: Date.now() + Math.random(), title }]);
    setText('');
  };
  const remove = (id) => setTodos((t) => t.filter((x) => x.id !== id));

  const label = todos.length === 0 ? 'No todos' : ´@{todos.length} @{todos.length === 1 ? 'todo' : 'todos'}´;

  return (
    <form id="todo-form" onSubmit={add}>
      <input id="todo-input" value={text} onChange={(e) => setText(e.target.value)} placeholder="What to do?" />
      <button type="submit">Add</button>
      <p id="todo-count">{label}</p>
      <ul>
        {todos.map((t) => (
          <li key={t.id} className="todo">
            <span>{t.title}</span>
            <button type="button" className="btn-delete" onClick={() => remove(t.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </form>
  );
}
`,
      kiem: [
        { moTa: 'Adds todos', kiem: 'danh-sach-text', selector: 'li.todo span', mongDoi: ['A', 'B'], truoc: [nhap('#todo-input', 'A'), { hanhDong: 'gui', selector: '#todo-form' }, nhap('#todo-input', 'B'), { hanhDong: 'gui', selector: '#todo-form' }] },
        { moTa: 'Deletes the right one', kiem: 'danh-sach-text', selector: 'li.todo span', mongDoi: ['A', 'C'], truoc: [nhap('#todo-input', 'A'), { hanhDong: 'gui', selector: '#todo-form' }, nhap('#todo-input', 'B'), { hanhDong: 'gui', selector: '#todo-form' }, nhap('#todo-input', 'C'), { hanhDong: 'gui', selector: '#todo-form' }, click('li.todo:nth-child(2) .btn-delete')] },
        { moTa: 'Counter wording', kiem: 'text', selector: '#todo-count', giaTri: '1 todo', truoc: [nhap('#todo-input', 'A'), { hanhDong: 'gui', selector: '#todo-form' }] },
        { an: true, moTa: 'Blank ignored, "No todos"', kiem: 'danh-sach-text', selector: '#todo-count', mongDoi: ['No todos'], truoc: [nhap('#todo-input', '   '), { hanhDong: 'gui', selector: '#todo-form' }] },
        { an: true, moTa: 'Input cleared after adding', kiem: 'thuoc-tinh-js', selector: '#todo-input', thuocTinh: 'value', giaTri: '', truoc: [nhap('#todo-input', 'A'), { hanhDong: 'gui', selector: '#todo-form' }] },
        { an: true, moTa: 'No reload on submit', kiem: 'khong-tai-lai', truoc: [nhap('#todo-input', 'A'), { hanhDong: 'gui', selector: '#todo-form' }] },
      ],
    }),
    reactNho({
      tieuDe: 'Color Switcher',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['state drives style', 'select', 'inline style'], the: ['hooks', 'useState', 'exercise-12'],
      moTa: {
        en: '<p>Handout task 5. A select changes the background colour of a preview box; a "Random" button picks the next colour in the list (cycling). The chosen colour name is shown in the box.</p>',
        vi: '<p>Bài 5 của handout. Select đổi màu nền hộp xem trước; nút "Random" chọn màu kế tiếp trong danh sách (quay vòng). Tên màu đang chọn hiện trong hộp.</p>',
      },
      yeuCau: [
        { en: 'Colours: <code>white, lightblue, lightgreen, pink</code>. <code>#color</code> (select, controlled), <code>#box</code> with inline <code>backgroundColor</code> and its text = colour name.', vi: 'Màu: <code>white, lightblue, lightgreen, pink</code>. <code>#color</code> (select, controlled), <code>#box</code> có <code>backgroundColor</code> inline và chữ = tên màu.' },
        { en: '<code>#btn-next</code> moves to the next colour (after pink comes white) and the select follows.', vi: '<code>#btn-next</code> sang màu kế (sau pink là white) và select cũng đổi theo.' },
      ],
      viDu: [{ input: 'select pink → Next', output: 'white', explanation: '(i + 1) % colors.length|||(i + 1) % colors.length' }],
      goiY: ['style={{ backgroundColor: color }}', 'Next: const i = COLORS.indexOf(color); setColor(COLORS[(i + 1) % COLORS.length]);'],
      loiHayGap: ['Viết <code>style="background: red"</code> (chuỗi) ⇒ React báo lỗi; style là object camelCase.', 'Select không có <code>value</code> ⇒ không theo kịp khi bấm Next.'],
      thuatNgu: [{ en: 'inline style', vi: 'style viết trực tiếp trên thẻ (object trong JSX)' }],
      giaiThich: '<p>Một mẩu state (<code>color</code>) quyết định cả giá trị select, màu hộp và chữ — mọi nơi luôn khớp nhau vì cùng đọc một nguồn.</p>',
      dau: `// src/App.js — STARTER
const COLORS = ['white', 'lightblue', 'lightgreen', 'pink'];

export default function App() {
  return (
    <div>
      <select id="color">{COLORS.map((c) => <option key={c}>{c}</option>)}</select>
      <button id="btn-next">Next</button>
      <div id="box" style="background: white">white</div>
    </div>
  );
}
`,
      giai: `// src/App.js — một state color điều khiển select, hộp và chữ
import { useState } from 'react';

const COLORS = ['white', 'lightblue', 'lightgreen', 'pink'];

export default function App() {
  const [color, setColor] = useState(COLORS[0]);
  const next = () => setColor((c) => COLORS[(COLORS.indexOf(c) + 1) % COLORS.length]);
  return (
    <div>
      <select id="color" value={color} onChange={(e) => setColor(e.target.value)}>
        {COLORS.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      <button id="btn-next" type="button" onClick={next}>Next</button>
      <div id="box" style={{ backgroundColor: color, padding: 24, border: '1px solid #ccc' }}>{color}</div>
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Select changes the box', kiem: 'css', selector: '#box', thuocTinh: 'background-color', giaTri: 'rgb(255, 192, 203)', truoc: [{ hanhDong: 'doi', selector: '#color', giaTri: 'pink' }] },
        { moTa: 'Box text = colour name', kiem: 'text', selector: '#box', giaTri: 'lightblue', truoc: [{ hanhDong: 'doi', selector: '#color', giaTri: 'lightblue' }] },
        { moTa: 'Next cycles back to white', kiem: 'text', selector: '#box', giaTri: 'white', truoc: [{ hanhDong: 'doi', selector: '#color', giaTri: 'pink' }, click('#btn-next')] },
        { an: true, moTa: 'Select follows Next', kiem: 'thuoc-tinh-js', selector: '#color', thuocTinh: 'value', giaTri: 'lightgreen', truoc: [click('#btn-next', 2)] },
      ],
    }),
    reactNho({
      tieuDe: 'Search Filter',
      doKho: 'MEDIUM', phut: 10,
      khaiNiem: ['derived list', 'case-insensitive search', 'empty state'], the: ['hooks', 'useState', 'exercise-12'],
      moTa: {
        en: '<p>Handout task 6. Filter a list of students while typing. Store only the <b>query</b> in state; the filtered list is <b>derived</b> during render (no second state). Matching is case-insensitive on name OR student code.</p>',
        vi: '<p>Bài 6 của handout. Lọc danh sách sinh viên khi gõ. Chỉ lưu <b>chuỗi tìm</b> trong state; danh sách đã lọc được <b>tính ra</b> lúc render (không có state thứ hai). So khớp không phân biệt hoa thường, theo tên HOẶC mã SV.</p>',
      },
      yeuCau: [
        { en: 'Students: <code>Nguyen Van An (HE170001)</code>, <code>Tran Thi Binh (HE170002)</code>, <code>Le Van Cuong (SE160003)</code>, <code>Pham Thi Dung (SE160004)</code>.', vi: 'Sinh viên: <code>Nguyen Van An (HE170001)</code>, <code>Tran Thi Binh (HE170002)</code>, <code>Le Van Cuong (SE160003)</code>, <code>Pham Thi Dung (SE160004)</code>.' },
        { en: '<code>#search</code>; rows <code>li.student</code> text <code>Name (CODE)</code>; <code>#result-count</code> <code>2 result(s)</code>; nothing ⇒ <code>#no-result</code> <code>No students found</code>. Leading/trailing spaces ignored.', vi: '<code>#search</code>; dòng <code>li.student</code> chữ <code>Tên (MÃ)</code>; <code>#result-count</code> <code>2 result(s)</code>; không có ⇒ <code>#no-result</code> <code>No students found</code>. Bỏ khoảng trắng đầu/cuối.' },
      ],
      viDu: [{ input: '"se16"', output: 'Le Van Cuong, Pham Thi Dung', explanation: 'Code matched case-insensitively.|||Khớp mã không phân biệt hoa thường.' }],
      goiY: ['const q = query.trim().toLowerCase(); const shown = STUDENTS.filter(s => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q));', 'Không cần useEffect hay state thứ hai cho shown.'],
      loiHayGap: ['Lưu <code>filtered</code> vào state rồi lọc tiếp trên nó ⇒ xoá bớt chữ không hiện lại kết quả cũ.', 'Quên toLowerCase một phía ⇒ "an" không khớp "An".'],
      thuatNgu: [{ en: 'derived data', vi: 'dữ liệu tính từ state, không lưu riêng' }],
      giaiThich: '<p>Nguyên tắc "state tối thiểu": chỉ lưu thứ không tính ra được (chuỗi tìm). Danh sách lọc tính lại mỗi lần render — luôn đúng, không bao giờ lệch.</p>',
      dau: `// src/App.js — STARTER
import { useState } from 'react';

const STUDENTS = [
  { code: 'HE170001', name: 'Nguyen Van An' },
  { code: 'HE170002', name: 'Tran Thi Binh' },
  { code: 'SE160003', name: 'Le Van Cuong' },
  { code: 'SE160004', name: 'Pham Thi Dung' },
];

export default function App() {
  const [list, setList] = useState(STUDENTS);
  return (
    <div>
      <input id="search" onChange={(e) => setList(list.filter((s) => s.name.includes(e.target.value)))} />
      <ul>{list.map((s) => <li key={s.code} className="student">{s.name}</li>)}</ul>
    </div>
  );
}
`,
      giai: `// src/App.js — state chỉ là chuỗi tìm; danh sách lọc TÍNH RA lúc render
import { useState } from 'react';

const STUDENTS = [
  { code: 'HE170001', name: 'Nguyen Van An' },
  { code: 'HE170002', name: 'Tran Thi Binh' },
  { code: 'SE160003', name: 'Le Van Cuong' },
  { code: 'SE160004', name: 'Pham Thi Dung' },
];

export default function App() {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const shown = STUDENTS.filter((s) => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q));

  return (
    <div>
      <input id="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Name or code" />
      <p id="result-count">{shown.length} result(s)</p>
      {shown.length === 0 ? (
        <p id="no-result">No students found</p>
      ) : (
        <ul>
          {shown.map((s) => <li key={s.code} className="student">{s.name} ({s.code})</li>)}
        </ul>
      )}
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Filters by code, case-insensitive', kiem: 'danh-sach-text', selector: 'li.student', mongDoi: ['Le Van Cuong (SE160003)', 'Pham Thi Dung (SE160004)'], truoc: [nhap('#search', 'se16')] },
        { moTa: 'Filters by name', kiem: 'danh-sach-text', selector: 'li.student', mongDoi: ['Tran Thi Binh (HE170002)'], truoc: [nhap('#search', 'BINH')] },
        { moTa: 'Count text', kiem: 'text', selector: '#result-count', giaTri: '4 result(s)' },
        { moTa: 'No result message', kiem: 'text', selector: '#no-result', giaTri: 'No students found', truoc: [nhap('#search', 'zzz')] },
        { an: true, moTa: 'Deleting characters brings results back', kiem: 'so-luong', selector: 'li.student', giaTri: 2, truoc: [nhap('#search', 'thi d'), nhap('#search', 'thi')] },
        { an: true, moTa: 'Spaces trimmed', kiem: 'so-luong', selector: 'li.student', giaTri: 1, truoc: [nhap('#search', '  dung  ')] },
      ],
    }),
    reactNho({
      tieuDe: 'Reorderable list (Drag and Drop task)',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['reorder array immutably', 'HTML5 drag events', 'accessible alternative'], the: ['hooks', 'useState', 'exercise-12'],
      moTa: {
        en: '<p>Handout task 7 asks for a drag-and-drop list. The core is a pure function <code>move(list, from, to)</code> that returns a NEW array. Wire it to HTML5 drag events (<code>draggable</code>, <code>onDragStart</code>, <code>onDragOver</code>, <code>onDrop</code>) <b>and</b> to ▲/▼ buttons — the keyboard-accessible alternative the grader uses.</p>',
        vi: '<p>Bài 7 của handout là danh sách kéo-thả. Lõi là hàm thuần <code>move(list, from, to)</code> trả về mảng MỚI. Nối nó vào sự kiện kéo-thả HTML5 (<code>draggable</code>, <code>onDragStart</code>, <code>onDragOver</code>, <code>onDrop</code>) <b>và</b> vào nút ▲/▼ — phương án dùng được bằng bàn phím mà máy chấm dùng.</p>',
      },
      yeuCau: [
        { en: 'Items <code>li.item</code> (text in <code>.label</code>): <code>HTML, CSS, JavaScript, React</code>. Each has <code>.btn-up</code> and <code>.btn-down</code>; disabled at the ends.', vi: 'Dòng <code>li.item</code> (chữ trong <code>.label</code>): <code>HTML, CSS, JavaScript, React</code>. Mỗi dòng có <code>.btn-up</code>, <code>.btn-down</code>; vô hiệu ở hai đầu.' },
        { en: 'Items are <code>draggable</code>; dropping item i onto item j calls <code>move(list, i, j)</code>. <code>#order</code> shows the order joined by <code> → </code>.', vi: 'Dòng có <code>draggable</code>; thả dòng i lên dòng j gọi <code>move(list, i, j)</code>. <code>#order</code> hiện thứ tự nối bằng <code> → </code>.' },
      ],
      viDu: [{ input: 'React ▲ twice', output: 'HTML → React → CSS → JavaScript', explanation: 'move(list, 3, 2) then move(list, 2, 1).|||move(list, 3, 2) rồi move(list, 2, 1).' }],
      goiY: ['function move(list, from, to) { const copy = [...list]; const [item] = copy.splice(from, 1); copy.splice(to, 0, item); return copy; }', 'Kéo: onDragStart={() => setDragIndex(i)} onDragOver={(e) => e.preventDefault()} onDrop={() => setItems((l) => move(l, dragIndex, i))}'],
      loiHayGap: ['splice trực tiếp trên state ⇒ đột biến, React có thể không vẽ lại.', 'Quên <code>e.preventDefault()</code> trong onDragOver ⇒ trình duyệt không cho thả (onDrop không chạy).'],
      thuatNgu: [{ en: 'drop target', vi: 'phần tử nhận thả' }, { en: 'accessible', vi: 'dùng được bằng bàn phím / trình đọc màn hình' }],
      giaiThich: '<p>Kéo-thả và nút ▲/▼ chỉ là hai cách "gọi" cùng một phép biến đổi thuần trên mảng. Viết phép biến đổi riêng giúp test được và dùng lại cho mọi kiểu tương tác.</p>',
      dau: `// src/App.js — STARTER
import { useState } from 'react';

export default function App() {
  const [items, setItems] = useState(['HTML', 'CSS', 'JavaScript', 'React']);
  const up = (i) => { const t = items[i]; items[i] = items[i - 1]; items[i - 1] = t; setItems(items); };
  return (
    <ul>
      {items.map((it, i) => (
        <li key={it} className="item"><span className="label">{it}</span><button className="btn-up" onClick={() => up(i)}>▲</button></li>
      ))}
    </ul>
  );
}
`,
      giai: `// src/App.js — một hàm move thuần; kéo-thả và nút ▲/▼ đều gọi nó
import { useState } from 'react';

export function move(list, from, to) {
  if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length) return list;
  const copy = [...list];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
}

export default function App() {
  const [items, setItems] = useState(['HTML', 'CSS', 'JavaScript', 'React']);
  const [dragIndex, setDragIndex] = useState(null);

  return (
    <div>
      <ul>
        {items.map((it, i) => (
          <li
            key={it}
            className="item"
            draggable
            onDragStart={() => setDragIndex(i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => { setItems((l) => move(l, dragIndex, i)); setDragIndex(null); }}
          >
            <span className="label">{it}</span>
            <button type="button" className="btn-up" disabled={i === 0} onClick={() => setItems((l) => move(l, i, i - 1))}>▲</button>
            <button type="button" className="btn-down" disabled={i === items.length - 1} onClick={() => setItems((l) => move(l, i, i + 1))}>▼</button>
          </li>
        ))}
      </ul>
      <p id="order">{items.join(' → ')}</p>
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Up twice moves React to position 2', kiem: 'text', selector: '#order', giaTri: 'HTML → React → CSS → JavaScript', truoc: [click('li.item:nth-child(4) .btn-up'), click('li.item:nth-child(3) .btn-up')] },
        { moTa: 'Down moves HTML after CSS', kiem: 'danh-sach-text', selector: 'li.item .label', mongDoi: ['CSS', 'HTML', 'JavaScript', 'React'], truoc: [click('li.item:nth-child(1) .btn-down')] },
        { moTa: 'First ▲ is disabled', kiem: 'thuoc-tinh-js', selector: 'li.item:nth-child(1) .btn-up', thuocTinh: 'disabled', giaTri: true },
        { an: true, moTa: 'Last ▼ is disabled', kiem: 'thuoc-tinh-js', selector: 'li.item:nth-child(4) .btn-down', thuocTinh: 'disabled', giaTri: true },
        { an: true, moTa: 'Items are draggable with drop handlers', kiem: 'ma-nguon', khop: 'draggable[\\s\\S]*onDragOver=\\{\\s*\\(e\\)\\s*=>\\s*e\\.preventDefault\\(\\)[\\s\\S]*onDrop' },
      ],
    }),
  ],
});
