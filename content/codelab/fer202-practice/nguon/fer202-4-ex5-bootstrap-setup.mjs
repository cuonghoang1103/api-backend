/**
 * FER202 · Exercise 5 — Getting started with Bootstrap (bài cài đặt ⇒ sắp xếp bước + trắc nghiệm).
 */
import { doiDau, KHOA, lc, tinh } from './_chung.mjs';

const o = (ma, de, muc, dapAn, giaiThich) => ({ ma, de, muc: lc(...muc), dapAn, giaiThich });
const q = (ma, de, luaChon, dapAn, giaiThich, nhieu) => ({ ma, de, luaChon: lc(...luaChon), dapAn, giaiThich, ...(nhieu ? { nhieu: true } : {}) });

export default doiDau({
  slug: 'fer202-4-ex5-bootstrap-setup',
  ten: '4.4 Exercise 5 — Getting started with Bootstrap',
  khoa: KHOA,
  baiHoc: 'fer202-4-ex5-bootstrap-setup',
  de: [
    tinh({
      loai: 'order',
      tieuDe: 'Put the Bootstrap setup steps in order',
      doKho: 'EASY', phut: 6,
      khaiNiem: ['npm', 'Vite', 'bootstrap', 'react-bootstrap'], the: ['bootstrap', 'setup'],
      moTa: {
        en: '<p>Drag (or use ↑/↓) to put the steps in the correct order. These are the exact steps you type in the lab room at the start of a PE.</p>',
        vi: '<p>Kéo (hoặc dùng ↑/↓) để xếp các bước đúng thứ tự. Đây đúng là các bước bạn gõ trong phòng thi lúc bắt đầu PE.</p>',
      },
      goiY: ['Không thể cài gói vào thư mục chưa tồn tại — tạo dự án trước.', 'CSS phải được import TRƯỚC khi component được vẽ — đặt ở điểm vào (main.jsx/index.js).'],
      loiHayGap: ['Cài <code>react-bootstrap</code> mà quên <code>bootstrap</code> ⇒ component đúng nhưng không có CSS.', 'Import CSS trong từng component thay vì một lần ở điểm vào.'],
      giaiThich: '<p>Tạo dự án → vào thư mục + cài phụ thuộc → cài bootstrap + react-bootstrap → import CSS một lần ở điểm vào → dùng component → chạy dev server.</p>',
      thuatNgu: [{ en: 'entry point', vi: 'tệp điểm vào (main.jsx / index.js)' }, { en: 'dependency', vi: 'gói phụ thuộc' }],
      cauHoi: [
        o('s1', 'Order the steps to start a React + Bootstrap project with Vite.', [
          ['e', "Use <code>import { Button } from 'react-bootstrap'</code> in a component"],
          ['b', '<code>cd my-app</code> then <code>npm install</code>'],
          ['f', '<code>npm run dev</code> and open the local URL'],
          ['a', '<code>npm create vite@latest my-app -- --template react</code>'],
          ['d', "<code>import 'bootstrap/dist/css/bootstrap.min.css'</code> in <code>main.jsx</code>"],
          ['c', '<code>npm install bootstrap react-bootstrap</code>'],
        ], ['a', 'b', 'c', 'd', 'e', 'f'], 'Create → install → add Bootstrap → import CSS once → use components → run.|||Tạo → cài → thêm Bootstrap → import CSS một lần → dùng component → chạy.'),
        o('s2', 'Order the Bootstrap 5 breakpoints from the smallest screen to the largest.', [
          ['c', '<code>lg</code> (≥ 992px)'], ['a', '<code>xs</code> (&lt; 576px)'], ['e', '<code>xl</code> (≥ 1200px)'],
          ['b', '<code>sm</code> (≥ 576px)'], ['f', '<code>xxl</code> (≥ 1400px)'], ['d', '<code>md</code> (≥ 768px)'],
        ], ['a', 'b', 'd', 'c', 'e', 'f'], 'xs < sm 576 < md 768 < lg 992 < xl 1200 < xxl 1400.|||xs < sm 576 < md 768 < lg 992 < xl 1200 < xxl 1400.'),
      ],
    }),
    tinh({
      tieuDe: 'Bootstrap setup check',
      doKho: 'EASY', phut: 6,
      khaiNiem: ['CDN vs npm', 'react-bootstrap'], the: ['bootstrap', 'quiz'],
      moTa: {
        en: '<p>Four questions about adding Bootstrap correctly to a React project.</p>',
        vi: '<p>Bốn câu về cách thêm Bootstrap đúng vào dự án React.</p>',
      },
      goiY: ['react-bootstrap KHÔNG kèm CSS.', 'Bootstrap JS (bundle) chỉ cần khi dùng class thuần có hành vi (dropdown, collapse) mà không dùng react-bootstrap.'],
      loiHayGap: ['Thêm cả bootstrap.bundle.js lẫn react-bootstrap ⇒ hai bên cùng điều khiển một dropdown, chạy lỗi.', 'Dùng CDN trong phòng thi không có mạng.'],
      giaiThich: '<p>Xem giải thích từng câu sau khi nộp.</p>',
      thuatNgu: [{ en: 'CDN', vi: 'mạng phân phối nội dung (tải thư viện qua link)' }],
      cauHoi: [
        q('c1', 'You installed <code>react-bootstrap</code> but buttons look plain. Why?', [['a', 'React 18 is not supported.'], ['b', 'The Bootstrap CSS file was never imported.'], ['c', 'You must restart the computer.'], ['d', 'Buttons need <code>className="btn"</code> too.']], ['b'], 'react-bootstrap renders the markup; the styling comes from bootstrap.min.css which you import once.|||react-bootstrap chỉ sinh markup; giao diện đến từ bootstrap.min.css bạn phải import một lần.'),
        q('c2', 'Where is the best place for <code>import \'bootstrap/dist/css/bootstrap.min.css\'</code>?', [['a', 'In every component file.'], ['b', 'Once, in the entry file (main.jsx / index.js) before your own CSS.'], ['c', 'In index.html as a script tag.'], ['d', 'In package.json.']], ['b'], 'Import global CSS once at the entry point, before your own styles so you can override Bootstrap.|||Import CSS toàn cục một lần ở điểm vào, trước CSS của bạn để bạn ghi đè được Bootstrap.'),
        q('c3', 'Which are TRUE about react-bootstrap? (choose all)', [['a', 'It replaces Bootstrap’s jQuery/JS with React components.'], ['b', 'It includes its own CSS.'], ['c', 'Props like <code>variant</code> become Bootstrap classes.'], ['d', 'You can still use plain Bootstrap classes in <code>className</code>.']], [['a', 'c', 'd']], 'react-bootstrap re-implements the behaviour in React and maps props to classes; it does not ship CSS.|||react-bootstrap viết lại hành vi bằng React và đổi prop thành class; nó không kèm CSS.', true),
        q('c4', 'The exam room has no internet. Which way of adding Bootstrap still works?', [['a', 'CDN link in index.html'], ['b', 'npm package already in node_modules of the given project'], ['c', 'Google Fonts'], ['d', 'Copy CSS from a website during the exam']], ['b'], 'A CDN needs the network. The project template sent before the exam already contains the packages in node_modules.|||CDN cần mạng. Dự án mẫu gửi trước kỳ thi đã có sẵn gói trong node_modules.'),
      ],
    }),
  ],
});
