/**
 * FER202 · Ôn thi PE — làm đề thật từng câu (mục video tự thêm, ngoài slide trường).
 * Đề 4 = PE4-SP26B3PE (content/exams/FER202-PE4.mjs): Câu 1 (4đ) danh sách nhân viên bằng React Bootstrap,
 * Câu 2 (6đ) Plant Shop — JSON Server + React Router + CRUD + validation.
 * Mỗi bài là loại VIDEO; video gắn qua content/course-videos/front-end-web-development-with-react.mjs (track VI/R2).
 * Đề sau (PE1, PE3, …) thêm bài vào cùng mục này.
 */

const KHOA = '/courses/front-end-web-development-with-react/learn?lessonSlug=';

// helper: một bài video với nội dung song ngữ gọn + danh sách bài cần ôn lại
const v = (slug, title, lead_en, lead_vi, hoc, onLai) => ({
  title,
  slug,
  type: 'VIDEO',
  description: lead_vi,
  content: `
<div class="ml-en">
<span class="eyebrow">PE review · real exam, added by this site</span>
<h2>${title.split('|||')[0]}</h2>
<p class="lead">${lead_en}</p>
<h3>In this video</h3>
<ul>${hoc.map((h) => `<li>${h.split('|||')[0]}</li>`).join('')}</ul>
<h3>Review these lessons if you get stuck</h3>
<ul>${onLai.map(([s, t]) => `<li><a href="${KHOA}${s}">${t.split('|||')[0]}</a></li>`).join('')}</ul>
<div class="callout">Try it yourself first: the full exam (English prompt, rubric and model answer) is in the <a href="/exam">Exam room</a> → FER202 → Practical Exam 4.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Ôn thi PE · đề thật, phần web tự thêm</span>
<h2>${title.split('|||')[1]}</h2>
<p class="lead">${lead_vi}</p>
<h3>Trong video này</h3>
<ul>${hoc.map((h) => `<li>${h.split('|||')[1]}</li>`).join('')}</ul>
<h3>Vướng chỗ nào thì ôn lại bài</h3>
<ul>${onLai.map(([s, t]) => `<li><a href="${KHOA}${s}">${t.split('|||')[1]}</a></li>`).join('')}</ul>
<div class="callout">Tự làm trước đã: đề đầy đủ (đề tiếng Anh, rubric, đáp án mẫu) có ở <a href="/exam">Phòng thi</a> → FER202 → Đề thực hành số 4.</div>
</div>`,
});

const B41 = ['fer202-4-1-bootstrap', 'FER202 4.1 — Bootstrap grid & React-Bootstrap|||FER202 4.1 — Bootstrap grid & React-Bootstrap'];
const B81 = ['fer202-8-1-usestate-useeffect', 'FER202 8.1 — useState & useEffect|||FER202 8.1 — useState & useEffect'];
const B61 = ['fer202-6-1-events-forms', 'FER202 6.1 — Event handlers & forms|||FER202 6.1 — Xử lý sự kiện & form'];
const B91 = ['fer202-9-1-router', 'FER202 9.1 — Routes, params & links|||FER202 9.1 — Route, tham số & link'];
const B111 = ['fer202-11-1-fetch-async', 'FER202 11.1 — fetch, promises & async/await|||FER202 11.1 — fetch, promise & async/await'];
const B112 = ['fer202-11-2-axios-json-server', 'FER202 11.2 — Axios & json-server|||FER202 11.2 — Axios & json-server'];
const EX26 = ['fer202-11-ex26-json-server', 'Exercise 26 — json-server|||Exercise 26 — json-server'];
const EX27 = ['fer202-11-ex27-axios', 'Exercise 27 — axios|||Exercise 27 — axios'];

export default [
  v(
    'fer202-pe4-0-mo-dau',
    'PE review · Exam 4 (SP26 B3) — read & understand the exam|||Ôn thi PE · Đề 4 (SP26 B3) — đọc & hiểu đề',
    'Before writing a line of code: read the English prompt, see what each question asks, how the rubric awards points, and how to split 85 minutes.',
    'Trước khi gõ dòng code nào: đọc đề tiếng Anh, hiểu mỗi câu yêu cầu gì, rubric cho điểm ra sao và chia 85 phút thế nào.',
    [
      'Exam structure: Question 1 (4 marks) employee list, Question 2 (6 marks) Plant Shop with JSON Server|||Cấu trúc đề: Câu 1 (4 điểm) danh sách nhân viên, Câu 2 (6 điểm) Plant Shop với JSON Server',
      'Vocabulary in the prompt and the four survival rules (a project that does not run scores 0)|||Từ vựng trong đề và bốn luật sống còn (dự án không chạy được là 0 điểm)',
      'Setup: unzip, npm install, npm start + npm run server (real output)|||Chuẩn bị: giải nén, npm install, npm start + npm run server (output thật)',
      'Time plan and a map of which chapter to review for each part|||Chia thời gian và bản đồ học lại chương nào cho từng phần',
    ],
    [B41, B81, B61, B91],
  ),
  v(
    'fer202-pe4-1-cau-1',
    'PE review · Exam 4 — Question 1: employee list with React Bootstrap|||Ôn thi PE · Đề 4 — Câu 1: danh sách nhân viên với React Bootstrap',
    'Question 1 line by line: render employees from src/data/employees.js in a React-Bootstrap Table, then show the selected employee in a Card (master–detail).',
    'Câu 1 từng dòng: vẽ nhân viên từ src/data/employees.js bằng Table của React-Bootstrap, rồi hiện nhân viên được chọn trong Card (master–detail).',
    [
      'Break the question into three pieces and match each to the rubric (2 + 1.5 + 0.5)|||Tách câu hỏi thành ba mảnh ghép, khớp từng mảnh với rubric (2 + 1,5 + 0,5)',
      'Component + state, the Table, clicking a row or the View Detail button|||Component + state, bảng Table, bấm dòng hoặc nút View Detail',
      'Load the Bootstrap CSS and run it for real — plus the two most common mistakes|||Nạp CSS Bootstrap rồi chạy thật — và hai lỗi hay gặp nhất',
    ],
    [B41, ['fer202-4-ex10-react-bootstrap', 'Exercise 10 — React-Bootstrap|||Exercise 10 — React-Bootstrap'], B81],
  ),
  v(
    'fer202-pe4-2a-cau-2a',
    'PE review · Exam 4 — Question 2 (1/2): JSON Server, Router, plant CRUD|||Ôn thi PE · Đề 4 — Câu 2 (1/2): JSON Server, Router, CRUD cây',
    'The first half of Question 2: two pages with React Router, the plant list from GET /plants, then add / edit / delete with POST, PUT and DELETE.',
    'Nửa đầu Câu 2: chia hai trang bằng React Router, danh sách cây từ GET /plants, rồi thêm / sửa / xoá bằng POST, PUT, DELETE.',
    [
      'The big picture: React ⇄ JSON Server, and the db.json the exam gives you|||Bức tranh lớn: React ⇄ JSON Server, và tệp db.json đề cho sẵn',
      'Plant Management and Order Management pages with a navbar|||Trang Plant Management và Order Management có navbar',
      'Full plant CRUD, the "Plant deleted successfully." message, and the server log for each request|||CRUD cây đầy đủ, thông báo "Plant deleted successfully." và log máy chủ của từng request',
      'The classic mistake: forgetting to start the server|||Lỗi kinh điển: quên bật máy chủ',
    ],
    [B91, B112, EX26, EX27],
  ),
  v(
    'fer202-pe4-2b-cau-2b',
    'PE review · Exam 4 — Question 2 (2/2): orders & validation|||Ôn thi PE · Đề 4 — Câu 2 (2/2): đơn hàng & kiểm tra dữ liệu',
    'The second half of Question 2: the order list with plant names mapped from plantId, the Add Order form, and every validation message the exam asks for.',
    'Nửa sau Câu 2: danh sách đơn hàng có tên cây ánh xạ từ plantId, form thêm đơn, và đủ mọi thông báo kiểm tra dữ liệu đề yêu cầu.',
    [
      'Promise.all + find to show plant names in the order list|||Promise.all + find để hiện tên cây trong danh sách đơn',
      'Validation rules for plants and orders, run for real message by message|||Luật kiểm tra cho cây và đơn hàng, chạy thật từng thông báo',
      'A trap found in the model answer: disabling the submit button hides the messages; bonus points|||Một bẫy có thật trong đáp án mẫu: vô hiệu nút gửi làm mất thông báo; điểm thưởng',
      'Checking the whole Question 2 against the rubric|||Đối chiếu cả Câu 2 với rubric',
    ],
    [B111, B112, B61],
  ),
];
