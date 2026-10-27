/**
 * FER202 · Exercise 2 — App React đầu tiên: dọn App.js về tối giản, hiển thị dữ liệu, danh sách và ảnh.
 */
import { doiDau, KHOA, lc, reactNho, tinh } from './_chung.mjs';

const o = (ma, de, muc, dapAn, giaiThich) => ({ ma, de, muc: lc(...muc), dapAn, giaiThich });

export default doiDau({
  slug: 'fer202-1-ex2-first-app',
  ten: 'Exercise 2 — Your first React app',
  khoa: KHOA,
  baiHoc: 'fer202-1-ex2-first-app',
  de: [
    tinh({
      loai: 'order',
      tieuDe: 'Create and start a React app',
      doKho: 'EASY', phut: 5,
      khaiNiem: ['create-react-app / Vite', 'dev server', 'hot reload'], the: ['react', 'order', 'exercise-2'],
      moTa: {
        en: '<p>Order the steps from an empty folder to seeing your own text in the browser. The handout uses Create React App (<code>npx create-react-app my-app</code>); with Vite the commands are <code>npm create vite@latest</code> and <code>npm run dev</code>, but the steps are the same.</p>',
        vi: '<p>Xếp các bước từ thư mục trống tới khi thấy chữ của bạn trên trình duyệt. Handout dùng Create React App (<code>npx create-react-app my-app</code>); với Vite lệnh là <code>npm create vite@latest</code> và <code>npm run dev</code>, nhưng các bước giống nhau.</p>',
      },
      goiY: ['Phải cd vào thư mục dự án trước khi chạy npm start.', 'Dev server tự tải lại khi lưu tệp.'],
      loiHayGap: ['Chạy npm start ở thư mục cha ⇒ "Could not read package.json".', 'Sửa tệp trong build/ thay vì src/.'],
      giaiThich: '<p>Tạo dự án → vào thư mục → chạy dev server → mở localhost → sửa src/App.js và lưu.</p>',
      thuatNgu: [{ en: 'dev server', vi: 'máy chủ phát triển chạy trên máy, tự tải lại khi lưu' }],
      cauHoi: [
        o('a1', 'Order the steps', [
          ['d', 'Open <code>http://localhost:3000</code>'],
          ['b', '<code>cd my-app</code>'],
          ['e', 'Edit <code>src/App.js</code>, save, and watch the page update'],
          ['a', '<code>npx create-react-app my-app</code>'],
          ['c', '<code>npm start</code>'],
        ], ['a', 'b', 'c', 'd', 'e'], 'Create → enter → start → open → edit.|||Tạo → vào → chạy → mở → sửa.'),
      ],
    }),
    reactNho({
      tieuDe: 'Clean up App.js: a minimal profile card',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['function component', 'JSX expressions', 'className'], the: ['react', 'jsx', 'exercise-2'],
      moTa: {
        en: '<p>The generated <code>App.js</code> shows a spinning logo. Replace it with a minimal component that displays data from JavaScript constants: your name, student code and the current year computed with <code>new Date().getFullYear()</code>.</p>',
        vi: '<p><code>App.js</code> được sinh ra hiện logo quay. Thay bằng component tối giản hiển thị dữ liệu từ hằng JavaScript: tên, mã sinh viên và năm hiện tại tính bằng <code>new Date().getFullYear()</code>.</p>',
      },
      yeuCau: [
        { en: 'Constants <code>name = "Nguyen Van An"</code>, <code>code = "HE180001"</code>. Card <code>div.card</code> with <code>h1#name</code>, <code>p#code</code> <code>Student code: HE180001</code>, <code>p#year</code> <code>FER202 · 2026</code> (real current year).', vi: 'Hằng <code>name = "Nguyen Van An"</code>, <code>code = "HE180001"</code>. Thẻ <code>div.card</code> có <code>h1#name</code>, <code>p#code</code> <code>Student code: HE180001</code>, <code>p#year</code> <code>FER202 · 2026</code> (năm thật hiện tại).' },
        { en: 'No logo, no <code>App.css</code> import, no leftover CRA markup.', vi: 'Không còn logo, không import <code>App.css</code>, không sót markup mẫu của CRA.' },
      ],
      viDu: [{ input: 'render', output: 'Nguyen Van An · Student code: HE180001 · FER202 · <year>', explanation: '{expression} inside JSX inserts a JavaScript value.|||{biểu thức} trong JSX chèn giá trị JavaScript.' }],
      goiY: ['const name = "Nguyen Van An"; … <h1 id="name">{name}</h1>', 'JSX dùng className, không phải class.'],
      loiHayGap: ['Viết <code>class="card"</code> ⇒ React cảnh báo; dùng <code>className</code>.', 'Gõ cứng năm 2026 ⇒ sang năm sai.'],
      thuatNgu: [{ en: 'JSX expression', vi: 'biểu thức JS trong cặp ngoặc nhọn của JSX' }],
      giaiThich: '<p>Component là hàm trả về JSX. Dữ liệu nằm trong biến JavaScript và được chèn bằng <code>{}</code> — đó là ý tưởng nền của mọi bài React sau.</p>',
      dau: `// src/App.js — STARTER (bản sinh sẵn của Create React App)
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Edit <code>src/App.js</code> and save to reload.</p>
      </header>
    </div>
  );
}

export default App;
`,
      them: { 'src/logo.svg': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><circle cx="5" cy="5" r="4"/></svg>\n', 'src/App.css': '.App { text-align: center; }\n' },
      giai: `// src/App.js — component tối giản hiển thị dữ liệu từ hằng JS
const name = 'Nguyen Van An';
const code = 'HE180001';

export default function App() {
  const year = new Date().getFullYear();
  return (
    <div className="card">
      <h1 id="name">{name}</h1>
      <p id="code">Student code: {code}</p>
      <p id="year">FER202 · {year}</p>
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Name and code', kiem: 'danh-sach-text', selector: '#name, #code', mongDoi: ['Nguyen Van An', 'Student code: HE180001'] },
        { moTa: 'Current year computed', kiem: 'text', selector: '#year', khop: '^FER202 · 20\\d\\d$' },
        { moTa: 'Card uses className', kiem: 'ton-tai', selector: 'div.card' },
        { an: true, moTa: 'No CRA leftovers', kiem: 'khong-ton-tai', selector: '.App-logo, .App-header' },
        { an: true, moTa: 'Year not hard-coded', kiem: 'ma-nguon', khop: 'getFullYear\\(\\)' },
      ],
    }),
    reactNho({
      tieuDe: 'Render a list from an array',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['map', 'key', 'conditional text'], the: ['react', 'jsx', 'exercise-2'],
      moTa: {
        en: '<p>Your second step: turn an array into UI. Render this semester\'s subjects as a list with <code>map</code>, each with a stable <code>key</code>, mark the ones you already passed, and show a summary line.</p>',
        vi: '<p>Bước thứ hai: biến mảng thành giao diện. Hiển thị các môn kỳ này thành danh sách bằng <code>map</code>, mỗi dòng có <code>key</code> ổn định, đánh dấu môn đã qua, và hiện dòng tóm tắt.</p>',
      },
      yeuCau: [
        { en: 'Data: FER202 (passed: false), SWT301 (true), SWR302 (true), PRO192 (false). Rows <code>li.subject</code> text <code>FER202</code> or <code>SWT301 ✓</code>; passed rows have class <code>passed</code>.', vi: 'Dữ liệu: FER202 (passed: false), SWT301 (true), SWR302 (true), PRO192 (false). Dòng <code>li.subject</code> chữ <code>FER202</code> hoặc <code>SWT301 ✓</code>; dòng đã qua có class <code>passed</code>.' },
        { en: '<code>#summary</code>: <code>2 of 4 passed</code>.', vi: '<code>#summary</code>: <code>2 of 4 passed</code>.' },
      ],
      viDu: [{ input: 'render', output: 'FER202 · SWT301 ✓ · SWR302 ✓ · PRO192 · 2 of 4 passed', explanation: 'subjects.filter(s => s.passed).length|||subjects.filter(s => s.passed).length' }],
      goiY: ['{SUBJECTS.map((s) => <li key={s.code} className={s.passed ? "subject passed" : "subject"}>…</li>)}', 'Dấu tick: {s.passed && " ✓"}'],
      loiHayGap: ['Thiếu <code>key</code> ⇒ cảnh báo "Each child in a list should have a unique key".', 'Dùng for/forEach trong JSX ⇒ không trả về phần tử nào.'],
      thuatNgu: [{ en: 'key', vi: 'định danh giúp React nhận ra từng phần tử danh sách' }],
      giaiThich: '<p>map trả mảng phần tử JSX; key (mã môn) giúp React cập nhật đúng dòng khi danh sách đổi.</p>',
      dau: `// src/App.js — STARTER
const SUBJECTS = [
  { code: 'FER202', passed: false },
  { code: 'SWT301', passed: true },
  { code: 'SWR302', passed: true },
  { code: 'PRO192', passed: false },
];

export default function App() {
  return (
    <ul>
      <li className="subject">{SUBJECTS[0].code}</li>
    </ul>
  );
}
`,
      giai: `// src/App.js — map mảng thành <li>, key = mã môn, tóm tắt bằng filter
const SUBJECTS = [
  { code: 'FER202', passed: false },
  { code: 'SWT301', passed: true },
  { code: 'SWR302', passed: true },
  { code: 'PRO192', passed: false },
];

export default function App() {
  const passed = SUBJECTS.filter((s) => s.passed).length;
  return (
    <div>
      <ul>
        {SUBJECTS.map((s) => (
          <li key={s.code} className={s.passed ? 'subject passed' : 'subject'}>
            {s.code}{s.passed && ' ✓'}
          </li>
        ))}
      </ul>
      <p id="summary">{passed} of {SUBJECTS.length} passed</p>
    </div>
  );
}
`,
      kiem: [
        { moTa: 'All subjects rendered', kiem: 'danh-sach-text', selector: 'li.subject', mongDoi: ['FER202', 'SWT301 ✓', 'SWR302 ✓', 'PRO192'] },
        { moTa: 'Passed class', kiem: 'so-luong', selector: 'li.subject.passed', giaTri: 2 },
        { moTa: 'Summary', kiem: 'text', selector: '#summary', giaTri: '2 of 4 passed' },
        { an: true, moTa: 'Uses map with a key', kiem: 'ma-nguon', khop: '\\.map\\([\\s\\S]*key=\\{' },
      ],
    }),
  ],
});
