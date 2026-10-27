/**
 * FER202 · 1.1 — Full-stack & React: front-end/back-end, SPA, React giải quyết gì. Bảng + trắc nghiệm.
 */
import { doiDau, KHOA, lc, tinh } from './_chung.mjs';

const q = (ma, de, luaChon, dapAn, giaiThich, nhieu) => ({ ma, de, luaChon: lc(...luaChon), dapAn, giaiThich, ...(nhieu ? { nhieu: true } : {}) });
const LOP = ['front-end', 'back-end', 'database'];
const v = (...ds) => ds;

export default doiDau({
  slug: 'fer202-1-1-fullstack-react',
  ten: '1.1 Full-stack & React',
  khoa: KHOA,
  baiHoc: 'fer202-1-1-fullstack-react',
  de: [
    tinh({
      loai: 'table',
      tieuDe: 'Which layer does it belong to?',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['front-end', 'back-end', 'database', 'full-stack'], the: ['fullstack', 'table'],
      moTa: {
        en: '<p>A full-stack web app has three layers: the <b>front-end</b> (runs in the browser, draws the UI), the <b>back-end</b> (runs on a server, business rules and APIs) and the <b>database</b> (stores data). Write <code>front-end</code>, <code>back-end</code> or <code>database</code> for each item.</p>',
        vi: '<p>Ứng dụng web full-stack có ba tầng: <b>front-end</b> (chạy trong trình duyệt, vẽ giao diện), <b>back-end</b> (chạy trên server, luật nghiệp vụ và API) và <b>database</b> (lưu dữ liệu). Ghi <code>front-end</code>, <code>back-end</code> hoặc <code>database</code> cho mỗi mục.</p>',
      },
      bang: [{
        ma: 't', de: 'Layer of each technology or task',
        cot: [{ ma: 'x', ten: 'Technology / task' }, { ma: 'lop', ten: 'Layer (' + LOP.join(' / ') + ')' }],
        hang: [
          { ma: 'react', o: { x: 'React components rendering a product list' } },
          { ma: 'css', o: { x: 'Bootstrap classes for a responsive grid' } },
          { ma: 'express', o: { x: 'Express route POST /api/orders' } },
          { ma: 'pg', o: { x: 'PostgreSQL table "orders"' } },
          { ma: 'validate', o: { x: 'Checking on the server that an order total is not negative' } },
          { ma: 'spring', o: { x: 'Spring Boot REST controller' } },
          { ma: 'mongo', o: { x: 'MongoDB collection "users"' } },
          { ma: 'router', o: { x: 'React Router switching pages without reload' } },
        ],
        dapAn: {
          'react.lop': 'front-end', 'css.lop': 'front-end', 'express.lop': 'back-end', 'pg.lop': 'database',
          'validate.lop': 'back-end', 'spring.lop': 'back-end', 'mongo.lop': 'database', 'router.lop': v('front-end', 'frontend'),
        },
        giaiThich: 'Anything that runs in the browser is front-end; validation must ALSO run on the server because the browser can be bypassed.|||Mọi thứ chạy trong trình duyệt là front-end; kiểm hợp lệ phải chạy CẢ ở server vì trình duyệt có thể bị vượt qua.',
      }],
      goiY: ['Hỏi: đoạn mã này chạy ở đâu — trình duyệt, server, hay là nơi lưu trữ?', 'React Router vẫn là front-end: đổi trang ngay trong trình duyệt.'],
      loiHayGap: ['Nghĩ kiểm hợp lệ ở form React là đủ — người dùng có thể gọi API trực tiếp.', 'Nhầm Node.js chỉ là front-end vì "cũng là JavaScript".'],
      giaiThich: '<p>FER202 tập trung front-end (React). Các môn sau (PRJ301, SWD392…) đi vào back-end và database; hiểu ranh giới giúp biết lỗi nằm ở tầng nào.</p>',
      thuatNgu: [{ en: 'full-stack', vi: 'làm cả front-end lẫn back-end' }, { en: 'API', vi: 'giao diện để chương trình gọi nhau (thường qua HTTP)' }],
    }),
    tinh({
      tieuDe: 'SPA and what React solves',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['SPA vs MPA', 'declarative UI', 'components', 'Virtual DOM'], the: ['fullstack', 'react', 'quiz'],
      moTa: {
        en: '<p>Eight questions on single-page applications and the problems React was created to solve: keeping a complex UI in sync with changing data, reusing pieces of UI, and updating the DOM efficiently.</p>',
        vi: '<p>Tám câu về ứng dụng một trang và các vấn đề React ra đời để giải quyết: giữ giao diện phức tạp khớp với dữ liệu thay đổi, dùng lại các mảnh giao diện, và cập nhật DOM hiệu quả.</p>',
      },
      goiY: ['Declarative: mô tả giao diện TRÔNG RA SAO với state hiện tại, React lo phần cập nhật.', 'SPA tải một lần, sau đó chỉ trao đổi dữ liệu (JSON).'],
      loiHayGap: ['Nghĩ React là framework đầy đủ như Angular — React là thư viện cho tầng view.', 'Nghĩ SPA không cần server — vẫn cần API cho dữ liệu.'],
      giaiThich: '<p>Xem giải thích từng câu sau khi nộp.</p>',
      thuatNgu: [{ en: 'declarative', vi: 'khai báo kết quả mong muốn thay vì từng bước làm' }],
      cauHoi: [
        q('q1', 'In a single-page application, after the first load…', [['a', 'every click downloads a new HTML page'], ['b', 'the page stays loaded; JavaScript updates the view and fetches data (JSON)'], ['c', 'the server renders every button'], ['d', 'no network is used ever again']], ['b'], 'That is why navigation feels instant.|||Vì vậy chuyển trang có cảm giác tức thì.'),
        q('q2', 'React is best described as…', [['a', 'a full framework with router, HTTP and forms built in'], ['b', 'a JavaScript library for building user interfaces (the view layer)'], ['c', 'a database'], ['d', 'a CSS framework']], ['b'], 'Routing, data fetching and state libraries are added separately.|||Router, gọi dữ liệu, quản lý state được thêm riêng.'),
        q('q3', '"Declarative UI" means…', [['a', 'you write each DOM change step by step'], ['b', 'you describe what the UI should look like for the current state and React updates the DOM'], ['c', 'UI without JavaScript'], ['d', 'UI written in XML only']], ['b'], 'Compare with jQuery-style imperative updates.|||So với cách cập nhật mệnh lệnh kiểu jQuery.'),
        q('q4', 'Why components? (choose all)', [['a', 'Reuse UI pieces'], ['b', 'Split a complex page into small, testable parts'], ['c', 'Each component owns its markup, logic and state'], ['d', 'They make the bundle disappear']], [['a', 'b', 'c']], 'Components are functions that return UI.|||Component là hàm trả về giao diện.', true),
        q('q5', 'The Virtual DOM is…', [['a', 'a second browser'], ['b', 'a lightweight JS description of the UI that React compares (diffs) to apply minimal real DOM changes'], ['c', 'a CSS feature'], ['d', 'the server HTML']], ['b'], 'Diffing avoids rebuilding the whole page.|||So sánh để không phải dựng lại cả trang.'),
        q('q6', 'Which company created and maintains React?', [['a', 'Google'], ['b', 'Meta (Facebook)'], ['c', 'Microsoft'], ['d', 'Apple']], ['b'], 'Open-sourced in 2013.|||Mở mã nguồn năm 2013.'),
        q('q7', 'A disadvantage of a pure client-side SPA:', [['a', 'Navigation is slow'], ['b', 'First load can be heavier and SEO needs extra care (SSR/SSG frameworks such as Next.js help)'], ['c', 'It cannot call APIs'], ['d', 'It cannot use CSS']], ['b'], 'Covered in the advanced chapter.|||Có trong chương nâng cao.'),
        q('q8', 'In FER202 you build mainly…', [['a', 'the back-end API'], ['b', 'the front-end with React, talking to a (mock) REST API'], ['c', 'database schemas'], ['d', 'mobile apps']], ['b'], 'json-server plays the back-end in labs.|||json-server đóng vai back-end trong lab.'),
      ],
    }),
  ],
});
