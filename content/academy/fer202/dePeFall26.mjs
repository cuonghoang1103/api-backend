/**
 * FER202 · Đề PE Fall26 (FA26 PE NO2 — Lecturer Workload & Subject Curriculum) — chữa trọn đề, từng dòng code.
 * 10 video (V0–V9) do agent `ftd` soạn 19/11/2026 theo KICH-BAN-VIDEO.md; video gắn qua
 * content/course-videos/front-end-web-development-with-react.mjs (track VI). V10 (hỏi–đáp riêng) KHÔNG đưa lên.
 */

const KHOA = '/courses/front-end-web-development-with-react/learn?lessonSlug=';
const ON = {
  es6: ['fer202-2-1-es6-basics', 'FER202 2.1 — ES6 basics|||FER202 2.1 — ES6 cơ bản'],
  jsx: ['fer202-3-1-jsx-basics', 'FER202 3.1 — JSX basics|||FER202 3.1 — JSX cơ bản'],
  bs: ['fer202-4-1-bootstrap', 'FER202 4.1 — Bootstrap grid & React-Bootstrap|||FER202 4.1 — Lưới Bootstrap & React-Bootstrap'],
  cp: ['fer202-5-1-components-props', 'FER202 5.1 — Components & props|||FER202 5.1 — Component & props'],
  ev: ['fer202-6-1-events-forms', 'FER202 6.1 — Event handlers & forms|||FER202 6.1 — Xử lý sự kiện & form'],
  hk: ['fer202-8-1-usestate-useeffect', 'FER202 8.1 — useState & useEffect|||FER202 8.1 — useState & useEffect'],
  rt: ['fer202-9-1-router', 'FER202 9.1 — Routes, params & links|||FER202 9.1 — Route, tham số & link'],
  as: ['fer202-11-1-fetch-async', 'FER202 11.1 — fetch, promises & async/await|||FER202 11.1 — fetch, promise & async/await'],
  ax: ['fer202-11-2-axios-json-server', 'FER202 11.2 — Axios & json-server|||FER202 11.2 — Axios & json-server'],
};

const v = (slug, title, lead_en, lead_vi, hoc, onLai) => ({
  title,
  slug,
  type: 'VIDEO',
  description: lead_vi,
  content: `
<div class="ml-en">
<span class="eyebrow">PE Fall26 · real exam, solved line by line</span>
<h2>${title.split('|||')[0]}</h2>
<p class="lead">${lead_en}</p>
<h3>In this video</h3>
<ul>${hoc.map((h) => `<li>${h.split('|||')[0]}</li>`).join('')}</ul>
<h3>Review these lessons if you get stuck</h3>
<ul>${onLai.map(([s, t]) => `<li><a href="${KHOA}${s}">${t.split('|||')[0]}</a></li>`).join('')}</ul>
<div class="callout">Practise the same exam shape afterwards: <a href="/code-lab/fer202-practice">Code Lab → FER202 Practice</a> (PE projects, auto-graded) and the <a href="/exam">Exam room</a> → FER202 (17 real PE papers with Given files).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Đề PE Fall26 · đề thật, chữa từng dòng</span>
<h2>${title.split('|||')[1]}</h2>
<p class="lead">${lead_vi}</p>
<h3>Trong video này</h3>
<ul>${hoc.map((h) => `<li>${h.split('|||')[1]}</li>`).join('')}</ul>
<h3>Vướng chỗ nào thì ôn lại bài</h3>
<ul>${onLai.map(([s, t]) => `<li><a href="${KHOA}${s}">${t.split('|||')[1]}</a></li>`).join('')}</ul>
<div class="callout">Xem xong thì luyện đúng dạng đề này: <a href="/code-lab/fer202-practice">Code Lab → FER202 Practice</a> (đề PE dạng dự án, chấm tự động) và <a href="/exam">Phòng thi</a> → FER202 (17 đề PE thật có file Given).</div>
</div>`,
});

export default [
  v('fer202-pefa26-0-chay-project', 'PE Fall26 · V0 — Running the PE project: ports 3000/9999, folder structure|||Đề PE Fall26 · V0 — Chạy project PE: 2 cổng 3000/9999, cấu trúc thư mục',
    'The big picture before any code: two terminals (React on 3000, json-server on 9999), what each folder holds, which libraries the exam uses and why node_modules is deleted before submitting.',
    'Bức tranh tổng trước khi code: 2 terminal (React cổng 3000, json-server cổng 9999), mỗi thư mục chứa gì, đề dùng thư viện nào và vì sao phải xoá node_modules trước khi nộp.',
    ['Two servers, two ports — who talks to whom|||Hai server, hai cổng — ai gọi ai', 'Folder structure of the submitted project|||Cấu trúc thư mục của bài nộp', 'npm i, npx json-server, npm start|||npm i, npx json-server, npm start', 'Why node_modules is removed before submitting|||Vì sao xoá node_modules trước khi nộp'],
    [ON.ax, ON.cp]),
  v('fer202-pefa26-1-doc-de', 'PE Fall26 · V1 — Reading the exam + database.json + 3 traps|||Đề PE Fall26 · V1 — Đọc hiểu đề + database.json + 3 bẫy',
    'The original exam paper translated requirement by requirement, the data in database.json (4 subjects, 4 classes), the expected result of every card and the three traps that cost points.',
    'Tờ đề gốc dịch từng yêu cầu, dữ liệu trong database.json (4 môn, 4 lớp), kết quả đúng của từng thẻ và 3 cái bẫy hay mất điểm.',
    ['Question 1 and Question 2, requirement by requirement|||Câu 1 và Câu 2, từng yêu cầu', 'Tables of subjects, classes, students|||Bảng môn, lớp, sinh viên', 'Expected numbers for each lecturer card|||Số đúng của từng thẻ giảng viên', 'The 3 traps (dropped students, startsWith, CLOSED classes)|||3 bẫy (sinh viên dropped, startsWith, lớp CLOSED)'],
    [ON.ax, ON.rt]),
  v('fer202-pefa26-2-mang', 'PE Fall26 · V2 — Array methods used in the exam: map, filter, find, reduce, sort, Set|||Đề PE Fall26 · V2 — Hàm mảng dùng trong bài: map, filter, find, reduce, sort, Set',
    'Every array method the solution relies on, run step by step on the real data — including the reduce that totals a lecturer card.',
    'Mọi hàm mảng bài giải dùng, chạy từng bước trên dữ liệu thật — kể cả reduce cộng số cho một thẻ giảng viên.',
    ['map / filter / find|||map / filter / find', 'reduce step by step|||reduce chạy từng bước', 'sort, includes, startsWith|||sort, includes, startsWith', 'Set for unique values|||Set để bỏ trùng'],
    [ON.es6, ON.jsx]),
  v('fer202-pefa26-3-api', 'PE Fall26 · V3 — Calling the API: REST, json-server, axios, async/await, PATCH|||Đề PE Fall26 · V3 — Gọi API: REST, json-server, axios, async/await, PATCH',
    'How the app talks to json-server: REST verbs, axios, async/await with try/catch, Promise.all, and why the exam uses PATCH instead of PUT.',
    'App nói chuyện với json-server thế nào: các động từ REST, axios, async/await + try/catch, Promise.all, và vì sao đề dùng PATCH chứ không PUT.',
    ['REST and json-server|||REST và json-server', 'axios + async/await + try/catch|||axios + async/await + try/catch', 'Promise.all for several requests|||Promise.all khi gọi nhiều yêu cầu', 'PATCH vs PUT|||PATCH khác PUT'],
    [ON.as, ON.ax]),
  v('fer202-pefa26-4-react', 'PE Fall26 · V4 — React foundations: components, JSX, props, useState, useEffect|||Đề PE Fall26 · V4 — Nền React: component, JSX, props, useState, useEffect',
    'Each React concept with a tiny example, then the exact line in the exam solution that uses it: components, props, state, effects, conditional rendering, key and controlled inputs.',
    'Mỗi khái niệm React một ví dụ nhỏ rồi chỉ đúng dòng trong bài dùng nó: component, props, state, effect, render điều kiện, key, controlled input.',
    ['Components, JSX and props|||Component, JSX và props', 'useState and re-rendering|||useState và render lại', 'useEffect and the dependency array|||useEffect và mảng phụ thuộc', 'Conditional rendering, key, controlled input|||Render điều kiện, key, controlled input'],
    [ON.cp, ON.ev, ON.hk]),
  v('fer202-pefa26-5-router', 'PE Fall26 · V5 — React Router v6: Routes, :id, useParams, useSearchParams|||Đề PE Fall26 · V5 — React Router v6: Route, :id, useParams, useSearchParams',
    'Everything routing in the exam: BrowserRouter, Routes/Route, path params vs query strings, Navigate replace, the * route, Link, useParams, useSearchParams and useLocation.',
    'Mọi thứ về điều hướng trong bài: BrowserRouter, Routes/Route, tham số đường dẫn và query, Navigate replace, route *, Link, useParams, useSearchParams, useLocation.',
    ['Routes, Route and the * fallback|||Routes, Route và route *', ':id with useParams|||:id với useParams', '?subject= with useSearchParams|||?subject= với useSearchParams', 'Param vs query — when to use which|||Param và query — dùng khi nào'],
    [ON.rt]),
  v('fer202-pefa26-6-bootstrap', 'PE Fall26 · V6 — Bootstrap used in the exam|||Đề PE Fall26 · V6 — Bootstrap dùng trong bài',
    'The Bootstrap classes and React-Bootstrap pieces the solution uses: grid, row-cols, gutters, cards, buttons, forms, tables, badges, alerts and the navbar.',
    'Các lớp Bootstrap và thành phần React-Bootstrap bài giải dùng: lưới, row-cols, khoảng cách, card, nút, form, bảng, badge, alert và navbar.',
    ['Grid and row-cols|||Lưới và row-cols', 'Card, button, form, table|||Card, nút, form, bảng', 'Badge and alert|||Badge và alert', 'Navbar|||Navbar'],
    [ON.bs]),
  v('fer202-pefa26-7-cau-1', 'PE Fall26 · V7 — Question 1 line by line: Lecturer Workload|||Đề PE Fall26 · V7 — Giải Câu 1 từng dòng: Lecturer Workload',
    'App.js, Navbar.js and Lecturers.js read in line order, with the running app: search "Dr.", "tuan", " msc ", pick PRJ301, open ?subject=SWP391 and click View Curriculum.',
    'Đọc App.js, Navbar.js, Lecturers.js đúng thứ tự dòng, kèm app chạy thật: tìm "Dr.", "tuan", " msc ", chọn PRJ301, mở ?subject=SWP391, bấm View Curriculum.',
    ['Routing in App.js|||Định tuyến trong App.js', 'Building lecturer cards from classes|||Dựng thẻ giảng viên từ classes', 'Search + subject filter + query param|||Tìm kiếm + lọc môn + query param', 'View Curriculum navigation|||Điều hướng View Curriculum'],
    [ON.rt, ON.hk, ON.ax]),
  v('fer202-pefa26-8-cau-2', 'PE Fall26 · V8 — Question 2 line by line: Subject Curriculum & bulk close|||Đề PE Fall26 · V8 — Giải Câu 2 từng dòng: Subject Curriculum + đóng lớp hàng loạt',
    'SubjectCurriculum.js line by line: badges, disabled CLOSED rows, the two business rules, one PATCH per selected class and the reload — watched in the browser Network tab.',
    'SubjectCurriculum.js từng dòng: badge, dòng CLOSED bị khoá, 2 luật nghiệp vụ, mỗi lớp được chọn một PATCH rồi tải lại — xem tận mắt trong tab Network.',
    ['useParams + loading the subject and its classes|||useParams + tải môn và các lớp', 'Checkbox selection, CLOSED rows disabled|||Chọn checkbox, lớp CLOSED bị khoá', 'Rules: INACTIVE subject, nothing selected|||Luật: môn INACTIVE, chưa chọn lớp', 'PATCH {status:"CLOSED"} and reload|||PATCH {status:"CLOSED"} rồi tải lại'],
    [ON.ev, ON.hk, ON.as]),
  v('fer202-pefa26-9-sua-code', 'PE Fall26 · V9 — Live code changes: 8 practice edits|||Đề PE Fall26 · V9 — Luyện sửa code tại chỗ (8 bài)',
    'Eight small change requests of the kind examiners ask on the spot — for each: the request, which line to change, and the result in the app.',
    '8 yêu cầu sửa nhỏ kiểu giám khảo hay bắt sửa tại chỗ — mỗi bài: yêu cầu, sửa dòng nào, kết quả trên app.',
    ['Search "contains" instead of "starts with" (startsWith → includes)|||Tìm "có chứa" thay vì "bắt đầu bằng" (startsWith → includes)', 'Add a "Total Dropped Students" line to each card|||Thêm dòng "Total Dropped Students" vào thẻ', '3 cards per row instead of 4; sort lecturers A→Z|||Lưới 3 thẻ/hàng thay vì 4; sắp giảng viên theo tên A→Z', 'Send the PATCHes in parallel with Promise.all; add a Back button|||Gửi PATCH song song bằng Promise.all; thêm nút Back', 'Move json-server to port 9000 via one API constant|||Đổi json-server sang cổng 9000 bằng một hằng API', 'Rewrite from an empty file: useState + useEffect + axios.get + table|||Viết lại từ file trống: useState + useEffect + axios.get + bảng'],
    [ON.hk, ON.rt, ON.ax]),
];
