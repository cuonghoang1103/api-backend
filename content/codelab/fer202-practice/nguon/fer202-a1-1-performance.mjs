/**
 * FER202 · Nâng cao A1 — Hiệu năng React: React.memo + useCallback (đếm số lần render), useMemo cho tính toán nặng,
 * key ổn định (lỗi key = index), và trắc nghiệm "đo trước, tối ưu sau".
 */
import { doiDau, KHOA, lc, reactNho, tinh } from './_chung.mjs';

const click = (selector, lan = 1) => ({ hanhDong: 'click', selector, lan });
const nhap = (selector, giaTri) => ({ hanhDong: 'nhap', selector, giaTri });
const q = (ma, de, luaChon, dapAn, giaiThich, nhieu) => ({ ma, de, luaChon: lc(...luaChon), dapAn, giaiThich, ...(nhieu ? { nhieu: true } : {}) });

export default doiDau({
  slug: 'fer202-a1-1-performance',
  ten: '14.1 Performance (advanced)',
  khoa: KHOA,
  baiHoc: 'fer202-a1-1-performance',
  de: [
    reactNho({
      tieuDe: 'React.memo only works with stable props (useCallback)',
      doKho: 'MEDIUM', phut: 14,
      khaiNiem: ['React.memo', 'useCallback', 'referential equality', 'render count'], the: ['performance', 'memo'],
      moTa: {
        en: '<p>A parent has a clock-like counter that changes often and a big <code>ProductList</code> child that does not depend on it. Each component shows how many times it has rendered. Make <code>ProductList</code> skip re-renders caused by the counter: wrap it in <code>React.memo</code> AND pass a stable <code>onSelect</code> created with <code>useCallback</code> — a new function each render would defeat <code>memo</code>.</p>',
        vi: '<p>Component cha có một bộ đếm đổi liên tục và một con <code>ProductList</code> lớn không phụ thuộc vào nó. Mỗi component hiện số lần đã render. Làm cho <code>ProductList</code> bỏ qua các lần render do bộ đếm gây ra: bọc bằng <code>React.memo</code> VÀ truyền <code>onSelect</code> ổn định tạo bằng <code>useCallback</code> — hàm mới mỗi lần render sẽ làm <code>memo</code> vô dụng.</p>',
      },
      yeuCau: [
        { en: 'Parent: <code>#tick</code> button (+1), <code>#ticks</code>; selected product in <code>#selected</code> (<code>Selected: Mouse</code>).', vi: 'Cha: nút <code>#tick</code> (+1), <code>#ticks</code>; sản phẩm được chọn ở <code>#selected</code> (<code>Selected: Mouse</code>).' },
        { en: '<code>ProductList</code>: buttons <code>.product</code> (Keyboard, Mouse, Monitor) calling <code>onSelect(name)</code>; <code>#list-renders</code> shows <code>List rendered 1 times</code> (count with <code>useRef</code>).', vi: '<code>ProductList</code>: nút <code>.product</code> (Keyboard, Mouse, Monitor) gọi <code>onSelect(name)</code>; <code>#list-renders</code> hiện <code>List rendered 1 times</code> (đếm bằng <code>useRef</code>).' },
      ],
      viDu: [{ input: 'click tick 3 times', output: 'List rendered 1 times', explanation: 'Props are shallow-equal, so memo skips the render.|||Props bằng nhau (so nông) nên memo bỏ qua render.' }],
      goiY: ['const ProductList = memo(function ProductList({ onSelect }) { const renders = useRef(0); renders.current += 1; … });', 'const handleSelect = useCallback((name) => setSelected(name), []);'],
      loiHayGap: ['Chỉ bọc memo mà truyền <code>onSelect={(n) =&gt; setSelected(n)}</code> ⇒ hàm mới mỗi lần ⇒ vẫn render lại.', 'Bọc memo mọi component "cho chắc" ⇒ thêm chi phí so sánh mà không lợi gì.'],
      thuatNgu: [{ en: 'memoization', vi: 'ghi nhớ kết quả để khỏi tính/vẽ lại' }, { en: 'shallow comparison', vi: 'so nông từng prop bằng Object.is' }],
      giaiThich: '<p><code>memo</code> so từng prop bằng <code>Object.is</code>. Số và chuỗi giống nhau thì bằng; hàm/object tạo mới mỗi render thì luôn khác. <code>useCallback</code> giữ CÙNG một hàm giữa các lần render (khi phụ thuộc không đổi).</p>',
      dau: `// src/App.js — STARTER
import { useRef, useState } from 'react';

function ProductList({ onSelect }) {
  const renders = useRef(0);
  renders.current += 1;
  return (
    <div>
      {['Keyboard', 'Mouse', 'Monitor'].map((p) => <button key={p} className="product" onClick={() => onSelect(p)}>{p}</button>)}
      <p id="list-renders">List rendered {renders.current} times</p>
    </div>
  );
}

export default function App() {
  const [ticks, setTicks] = useState(0);
  const [selected, setSelected] = useState(null);
  return (
    <div>
      <button id="tick" onClick={() => setTicks(ticks + 1)}>Tick</button>
      <p id="ticks">{ticks}</p>
      <p id="selected">Selected: {selected ?? 'none'}</p>
      <ProductList onSelect={(name) => setSelected(name)} />
    </div>
  );
}
`,
      giai: `// src/App.js — memo cho con + useCallback cho hàm truyền xuống
import { memo, useCallback, useRef, useState } from 'react';

const PRODUCTS = ['Keyboard', 'Mouse', 'Monitor'];

const ProductList = memo(function ProductList({ onSelect }) {
  const renders = useRef(0);
  renders.current += 1;
  return (
    <div>
      {PRODUCTS.map((p) => (
        <button key={p} type="button" className="product" onClick={() => onSelect(p)}>{p}</button>
      ))}
      <p id="list-renders">List rendered {renders.current} times</p>
    </div>
  );
});

export default function App() {
  const [ticks, setTicks] = useState(0);
  const [selected, setSelected] = useState(null);
  const handleSelect = useCallback((name) => setSelected(name), []); // cùng một hàm mọi lần render

  return (
    <div>
      <button id="tick" type="button" onClick={() => setTicks((t) => t + 1)}>Tick</button>
      <p id="ticks">{ticks}</p>
      <p id="selected">Selected: {selected ?? 'none'}</p>
      <ProductList onSelect={handleSelect} />
    </div>
  );
}
`,
      kiem: [
        { moTa: 'List does not re-render on ticks', kiem: 'text', selector: '#list-renders', giaTri: 'List rendered 1 times', truoc: [click('#tick', 3)] },
        { moTa: 'Ticks still update', kiem: 'text', selector: '#ticks', giaTri: '3', truoc: [click('#tick', 3)] },
        { moTa: 'Selecting still works', kiem: 'text', selector: '#selected', giaTri: 'Selected: Mouse', truoc: [click('.product:nth-child(2)')] },
        { an: true, moTa: 'Selecting does not re-render the list either', kiem: 'text', selector: '#list-renders', giaTri: 'List rendered 1 times', truoc: [click('.product:nth-child(2)'), click('#tick')] },
        { an: true, moTa: 'Uses memo and useCallback', kiem: 'ma-nguon', khop: '^(?=[\\s\\S]*memo\\()(?=[\\s\\S]*useCallback\\()' },
      ],
    }),
    reactNho({
      tieuDe: 'useMemo for an expensive filter',
      doKho: 'MEDIUM', phut: 14,
      khaiNiem: ['useMemo', 'dependency array', 'derived data'], the: ['performance', 'useMemo'],
      moTa: {
        en: '<p>Filtering 5,000 products is slow, and the page also has an unrelated "note" input. Typing in the note re-renders the page and — without <code>useMemo</code> — re-runs the filter on every keystroke. Wrap the filter in <code>useMemo</code> with <code>[query, minPrice]</code>. The given <code>filterProducts</code> counts its calls in <code>stats.calls</code>.</p>',
        vi: '<p>Lọc 5.000 sản phẩm thì chậm, và trang còn ô "ghi chú" không liên quan. Gõ ghi chú làm trang render lại và — nếu không có <code>useMemo</code> — chạy lại bộ lọc mỗi phím. Bọc bộ lọc trong <code>useMemo</code> với <code>[query, minPrice]</code>. Hàm <code>filterProducts</code> có sẵn đếm số lần gọi trong <code>stats.calls</code>.</p>',
      },
      yeuCau: [
        { en: '<code>#query</code>, <code>#min-price</code> (number), <code>#note</code>; <code>#result-count</code> <code>12 products</code>; <code>#calls</code> <code>Filter ran 1 times</code> (read <code>stats.calls</code> during render).', vi: '<code>#query</code>, <code>#min-price</code> (số), <code>#note</code>; <code>#result-count</code> <code>12 products</code>; <code>#calls</code> <code>Filter ran 1 times</code> (đọc <code>stats.calls</code> lúc render).' },
        { en: 'Typing in <code>#note</code> must not run the filter again.', vi: 'Gõ vào <code>#note</code> không được chạy lại bộ lọc.' },
      ],
      viDu: [{ input: 'type 5 characters in note', output: 'Filter ran 1 times', explanation: 'useMemo returns the cached array while query/minPrice are unchanged.|||useMemo trả mảng đã nhớ khi query/minPrice không đổi.' }],
      goiY: ['const results = useMemo(() => filterProducts(PRODUCTS, query, minPrice), [query, minPrice]);', 'Đặt useMemo TRƯỚC dòng đọc stats.calls để số hiển thị đúng.'],
      loiHayGap: ['Lưu kết quả lọc vào state + useEffect ⇒ thêm một lần render và dễ lệch.', 'Thiếu minPrice trong mảng phụ thuộc ⇒ đổi giá không lọc lại.'],
      thuatNgu: [{ en: 'cache', vi: 'bộ nhớ đệm kết quả' }],
      giaiThich: '<p>useMemo chỉ đáng dùng khi phép tính thật sự tốn (lọc/sắp mảng lớn) hoặc khi cần giữ tham chiếu ổn định cho memo/useEffect. Với phép tính rẻ, cứ tính thẳng.</p>',
      them: {
        'src/products.js': `// src/products.js (cho sẵn) — 5.000 sản phẩm giả + bộ lọc có đếm số lần gọi
export const PRODUCTS = Array.from({ length: 5000 }, (_, i) => ({
  id: i + 1,
  name: (i % 2 ? 'Pro ' : 'Basic ') + ['Keyboard', 'Mouse', 'Monitor', 'Laptop', 'Headset'][i % 5] + ' ' + (i + 1),
  price: ((i * 37) % 2000) * 1000,
}));

export const stats = { calls: 0 };

export function filterProducts(list, query, minPrice) {
  stats.calls += 1;
  const q = query.trim().toLowerCase();
  return list.filter((p) => p.price >= minPrice && p.name.toLowerCase().includes(q));
}
`,
      },
      dau: `// src/App.js — STARTER
import { useState } from 'react';
import { PRODUCTS, filterProducts, stats } from './products';

export default function App() {
  const [query, setQuery] = useState('laptop 1');
  const [minPrice, setMinPrice] = useState(1500000);
  const [note, setNote] = useState('');
  const results = filterProducts(PRODUCTS, query, minPrice);
  return (
    <div>
      <input id="query" value={query} onChange={(e) => setQuery(e.target.value)} />
      <input id="min-price" type="number" value={minPrice} onChange={(e) => setMinPrice(Number(e.target.value))} />
      <input id="note" value={note} onChange={(e) => setNote(e.target.value)} />
      <p id="result-count">{results.length} products</p>
      <p id="calls">Filter ran {stats.calls} times</p>
    </div>
  );
}
`,
      giai: `// src/App.js — useMemo: chỉ lọc lại khi query hoặc minPrice đổi
import { useMemo, useState } from 'react';
import { PRODUCTS, filterProducts, stats } from './products';

export default function App() {
  const [query, setQuery] = useState('laptop 1');
  const [minPrice, setMinPrice] = useState(1500000);
  const [note, setNote] = useState('');

  const results = useMemo(() => filterProducts(PRODUCTS, query, minPrice), [query, minPrice]);

  return (
    <div>
      <input id="query" value={query} onChange={(e) => setQuery(e.target.value)} />
      <input id="min-price" type="number" value={minPrice} onChange={(e) => setMinPrice(Number(e.target.value))} />
      <input id="note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note" />
      <p id="result-count">{results.length} products</p>
      <p id="calls">Filter ran {stats.calls} times</p>
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Typing a note does not re-filter', kiem: 'text', selector: '#calls', giaTri: 'Filter ran 1 times', truoc: [nhap('#note', 'a'), nhap('#note', 'ab'), nhap('#note', 'abc')] },
        { moTa: 'Changing the query re-filters', kiem: 'text', selector: '#calls', giaTri: 'Filter ran 2 times', truoc: [nhap('#query', 'mouse')] },
        { moTa: 'Changing min price re-filters', kiem: 'text', selector: '#calls', giaTri: 'Filter ran 2 times', truoc: [nhap('#min-price', '0')] },
        { an: true, moTa: 'Result count is correct', kiem: 'text', selector: '#result-count', khop: '^\\d+ products$' },
        { an: true, moTa: 'useMemo with both dependencies', kiem: 'ma-nguon', khop: 'useMemo\\([\\s\\S]*\\[\\s*(query\\s*,\\s*minPrice|minPrice\\s*,\\s*query)\\s*\\]' },
      ],
    }),
    reactNho({
      tieuDe: 'The index-as-key bug',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['keys and identity', 'component state in lists', 'stable ids'], the: ['performance', 'keys'],
      moTa: {
        en: '<p>Each row of a task list has its own uncontrolled note input. With <code>key={index}</code>, deleting the first row makes the second task show the FIRST task\'s note — React reused the component by position. Fix it with a stable id key so state stays with the right task.</p>',
        vi: '<p>Mỗi dòng của danh sách việc có ô ghi chú riêng (không điều khiển). Với <code>key={index}</code>, xoá dòng đầu làm việc thứ hai hiện ghi chú của việc THỨ NHẤT — React dùng lại component theo vị trí. Sửa bằng key là id ổn định để state đi đúng với việc của nó.</p>',
      },
      yeuCau: [
        { en: 'Rows <code>li.task</code> with <code>.title</code>, <code>input.note</code> and <code>.btn-delete</code>; tasks: Design, Code, Test.', vi: 'Dòng <code>li.task</code> có <code>.title</code>, <code>input.note</code> và <code>.btn-delete</code>; việc: Design, Code, Test.' },
        { en: 'After typing a note on "Code" and deleting "Design", the note stays with "Code".', vi: 'Gõ ghi chú ở "Code" rồi xoá "Design", ghi chú vẫn ở với "Code".' },
      ],
      viDu: [{ input: 'note "review PR" on Code, delete Design', output: 'Code · review PR', explanation: 'With index keys the first row (now Code) would keep Design\'s empty note.|||Với key là index, dòng đầu (giờ là Code) sẽ giữ ghi chú rỗng của Design.' }],
      goiY: ['key={task.id}', 'State của component con (kể cả giá trị ô không điều khiển trong DOM) gắn với key, không gắn với dữ liệu.'],
      loiHayGap: ['Dùng <code>Math.random()</code> làm key ⇒ mỗi render tạo component mới, mất focus và state.', 'Nghĩ key chỉ để tắt cảnh báo.'],
      thuatNgu: [{ en: 'reconciliation', vi: 'quá trình React ghép cây cũ với cây mới' }],
      giaiThich: '<p>Key cho React biết "đây có phải CÙNG một phần tử như lần trước không". Key theo vị trí đúng chỉ khi danh sách không bao giờ thêm/xoá/sắp lại.</p>',
      dau: `// src/App.js — STARTER
import { useState } from 'react';

export default function App() {
  const [tasks, setTasks] = useState([{ id: 1, title: 'Design' }, { id: 2, title: 'Code' }, { id: 3, title: 'Test' }]);
  return (
    <ul>
      {tasks.map((t, index) => (
        <li key={index} className="task">
          <span className="title">{t.title}</span>
          <input className="note" placeholder="note" />
          <button className="btn-delete" onClick={() => setTasks(tasks.filter((x) => x.id !== t.id))}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
`,
      giai: `// src/App.js — key ổn định (id) giữ state đúng với từng việc
import { useState } from 'react';

export default function App() {
  const [tasks, setTasks] = useState([{ id: 1, title: 'Design' }, { id: 2, title: 'Code' }, { id: 3, title: 'Test' }]);
  return (
    <ul>
      {tasks.map((t) => (
        <li key={t.id} className="task">
          <span className="title">{t.title}</span>
          <input className="note" placeholder="note" />
          <button type="button" className="btn-delete" onClick={() => setTasks((list) => list.filter((x) => x.id !== t.id))}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
`,
      kiem: [
        { moTa: 'Note stays with its task after deleting above', kiem: 'thuoc-tinh-js', selector: 'li.task:nth-child(1) .note', thuocTinh: 'value', giaTri: 'review PR', truoc: [nhap('li.task:nth-child(2) .note', 'review PR'), click('li.task:nth-child(1) .btn-delete')] },
        { moTa: 'Remaining titles', kiem: 'danh-sach-text', selector: 'li.task .title', mongDoi: ['Code', 'Test'], truoc: [click('li.task:nth-child(1) .btn-delete')] },
        { moTa: 'Uses a stable key', kiem: 'ma-nguon', khop: 'key=\\{\\s*t\\.id\\s*\\}' },
        { an: true, moTa: 'Last task note untouched', kiem: 'thuoc-tinh-js', selector: 'li.task:nth-child(2) .note', thuocTinh: 'value', giaTri: 'write tests', truoc: [nhap('li.task:nth-child(3) .note', 'write tests'), click('li.task:nth-child(1) .btn-delete')] },
      ],
    }),
    tinh({
      tieuDe: 'Measure first: performance decisions',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['React Profiler', 'premature optimisation', 'memo costs'], the: ['performance', 'quiz'],
      moTa: {
        en: '<p>Five decisions about React performance. The guiding rule: measure with the React DevTools Profiler or the browser Performance panel before optimising, and fix the biggest cost first.</p>',
        vi: '<p>Năm quyết định về hiệu năng React. Nguyên tắc: đo bằng Profiler của React DevTools hoặc tab Performance của trình duyệt trước khi tối ưu, và sửa chỗ tốn nhất trước.</p>',
      },
      goiY: ['memo/useMemo/useCallback cũng có chi phí.', 'Danh sách rất dài ⇒ ảo hoá (chỉ vẽ phần nhìn thấy).'],
      loiHayGap: ['Bọc useCallback mọi hàm "cho chắc".', 'Tối ưu trước khi biết chỗ chậm.'],
      giaiThich: '<p>Đo → tìm nút thắt → sửa đúng chỗ → đo lại.</p>',
      thuatNgu: [{ en: 'profiler', vi: 'công cụ đo thời gian render' }, { en: 'virtualization', vi: 'chỉ vẽ các dòng đang hiện trên màn hình' }],
      cauHoi: [
        q('p1', 'The app "feels slow". First step?', [['a', 'Wrap every component in memo'], ['b', 'Record with the React Profiler to see which components render often or slowly'], ['c', 'Rewrite in another framework'], ['d', 'Add useMemo everywhere']], ['b'], 'Optimise what the measurement shows.|||Tối ưu đúng chỗ phép đo chỉ ra.'),
        q('p2', 'A table renders 10,000 rows and scrolling lags. Best fix?', [['a', 'useCallback on the scroll handler'], ['b', 'Virtualize the list (render only visible rows, e.g. react-window) or paginate'], ['c', 'Use inline styles'], ['d', 'Disable StrictMode']], ['b'], 'The DOM size itself is the cost.|||Chính số nút DOM là chi phí.'),
        q('p3', 'When is useCallback useful? (choose all)', [['a', 'Passing a callback to a memo child'], ['b', 'Using a function in a useEffect dependency array'], ['c', 'Every event handler on a button'], ['d', 'Returning a function from a custom hook used in effects']], [['a', 'b', 'd']], 'For a plain button it adds work without benefit.|||Với nút bình thường nó chỉ thêm việc.', true),
        q('p4', 'Which change reduces the initial bundle the most?', [['a', 'useMemo'], ['b', 'Route-based code splitting with React.lazy'], ['c', 'React.memo'], ['d', 'Renaming components']], ['b'], 'memo/useMemo affect rendering, not download size.|||memo/useMemo ảnh hưởng render, không phải dung lượng tải.'),
        q('p5', 'State that changes on every keystroke is high in the tree and re-renders a big page. Good fix?', [['a', 'Move the state down into the component that uses it (colocation)'], ['b', 'Use a global variable'], ['c', 'Use setTimeout'], ['d', 'Nothing can be done']], ['a'], 'Keeping state close to where it is used limits re-renders.|||Giữ state gần nơi dùng sẽ giới hạn phạm vi render lại.'),
      ],
    }),
  ],
});
