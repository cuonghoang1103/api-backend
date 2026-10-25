/**
 * FER202 · Ôn thi PE — làm đề thật từng câu (mục video tự thêm, ngoài slide trường).
 * Đề 4 = PE4-SP26B3PE (content/exams/FER202-PE4.mjs): Câu 1 (4đ) danh sách nhân viên bằng React Bootstrap,
 * Câu 2 (6đ) Plant Shop — JSON Server + React Router + CRUD + validation.
 * Đề 1 = PE1-SP26B5PE (Company Management: phòng ban · Accordion nhân viên + lương · người phụ thuộc PUT),
 * Đề 3 = PE3 (SP26 B5 Paper 2, cùng ngày thi với Đề 1: Accordion + người phụ thuộc · Work Hours POST + chặn trùng),
 * Đề 7 = PE7 (SU25 Block 1: rạp phim — Movie List sort/lọc · đặt vé POST + PATCH), Đề 10 = PE10 (SP25 Đề số 1: Shopping System —
 * bảng sản phẩm Rate · giỏ hàng Context · lịch sử đơn).
 * Mỗi bài là loại VIDEO; video gắn qua content/course-videos/front-end-web-development-with-react.mjs (track VI/R2).
 * Đề 17 = PE17-SU26PE20060701 (Sneaker Collection, mockapi) — MỘT bài/đề (luật 25/10: mỗi đề PE = một video dài ghép 6 phần fer-pe17-0…5).
 * Đề 18 = PE18-SP26AttendancePE (Attendance System, json-server) — MỘT bài/đề, ghép 4 phần fer-pe18-0…3.
 * Thứ tự trong mục: Đề 4 (đã có trước) rồi Đề 17 → 18 → 1 → 3 → 7 → 10 (đề mới nhất trước). Chữa đề FE ở mục riêng (onThiFe.mjs).
 */

const KHOA = '/courses/front-end-web-development-with-react/learn?lessonSlug=';

// helper: một bài video với nội dung song ngữ gọn + danh sách bài cần ôn lại
const v = (slug, title, lead_en, lead_vi, hoc, onLai, de = 4) => ({
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
<div class="callout">Try it yourself first: the full exam (English prompt, rubric and model answer) is in the <a href="/exam">Exam room</a> → FER202 → Practical Exam ${de}.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Ôn thi PE · đề thật, phần web tự thêm</span>
<h2>${title.split('|||')[1]}</h2>
<p class="lead">${lead_vi}</p>
<h3>Trong video này</h3>
<ul>${hoc.map((h) => `<li>${h.split('|||')[1]}</li>`).join('')}</ul>
<h3>Vướng chỗ nào thì ôn lại bài</h3>
<ul>${onLai.map(([s, t]) => `<li><a href="${KHOA}${s}">${t.split('|||')[1]}</a></li>`).join('')}</ul>
<div class="callout">Tự làm trước đã: đề đầy đủ (đề tiếng Anh, rubric, đáp án mẫu) có ở <a href="/exam">Phòng thi</a> → FER202 → Đề thực hành số ${de}.</div>
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
const B21 = ['fer202-2-1-es6-basics', 'FER202 2.1 — let/const, arrow functions, template literals|||FER202 2.1 — let/const, arrow function, template literal'];
const B22 = ['fer202-2-2-destructuring-spread-modules', 'FER202 2.2 — Destructuring, spread & modules|||FER202 2.2 — Destructuring, spread & module'];
const B31 = ['fer202-3-1-jsx-basics', 'FER202 3.1 — JSX basics|||FER202 3.1 — JSX cơ bản'];
const B51 = ['fer202-5-1-components-props', 'FER202 5.1 — Components & props|||FER202 5.1 — Component & props'];
const B52 = ['fer202-5-2-state-class-vs-function', 'FER202 5.2 — State: class vs function components|||FER202 5.2 — State: component class vs function'];
const B71 = ['fer202-7-1-context', 'FER202 7.1 — Prop drilling & the Context API|||FER202 7.1 — Prop drilling & Context API'];
const EX7 = ['fer202-4-ex7-cards', 'Exercise 7 — Cards column|||Exercise 7 — Cột thẻ (Cards)'];
const EX8 = ['fer202-4-ex8-form-controls', 'Exercise 8 — Form controls|||Exercise 8 — Form controls'];
const EX10 = ['fer202-4-ex10-react-bootstrap', 'Exercise 10 — React-Bootstrap|||Exercise 10 — React-Bootstrap'];
const EX14 = ['fer202-8-ex14-usecontext', 'Exercise 14 — useContext|||Exercise 14 — useContext'];
const EX17 = ['fer202-6-ex17-render-commit', 'Exercise 17 — Render and Commit|||Exercise 17 — Render và Commit'];
const PE_KHUNG = ['fer202-final-exam-pe', 'PE — Practical Exam: format & how it is graded|||PE — Thi thực hành: cấu trúc & cách chấm'];
const PE4_0 = ['fer202-pe4-0-mo-dau', 'PE review · Exam 4 — reading the exam & setup|||Ôn thi PE · Đề 4 — đọc đề & dựng môi trường'];
const PE1_0 = ['fer202-pe1-0-mo-dau', 'PE review · Exam 1 — reading the exam|||Ôn thi PE · Đề 1 — đọc & phân tích đề'];
const PE1_1 = ['fer202-pe1-1-cau-1', 'PE review · Exam 1 — Question 1: Department List|||Ôn thi PE · Đề 1 — Câu 1: Department List'];
const PE1_2 = ['fer202-pe1-2-cau-2', 'PE review · Exam 1 — Question 2: Accordion & salaries|||Ôn thi PE · Đề 1 — Câu 2: Accordion & bảng lương'];
const PE10_2 = ['fer202-pe10-2-cau-2', 'PE review · Exam 10 — Question 2: cart with Context|||Ôn thi PE · Đề 10 — Câu 2: giỏ hàng bằng Context'];

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

  // ───────── Đề 1 (SP26 · Block 5 · PE) — Company Management, 3 câu 2 + 4 + 4 điểm, 90 phút ─────────
  v(
    'fer202-pe17-su26-chua-tron-de',
    'PE review · Exam 17 (SU26 · 20060701) — Sneaker Collection, full walkthrough in one video|||Ôn thi PE · Đề 17 (SU26 · 20060701) — Sneaker Collection, chữa trọn đề một video',
    'The newest FER202 practical paper (Summer 2026, paper FER202_PE_20060701, 85 minutes, 10 marks): a mockapi.io resource named after your roll number, a Sneaker Collection card grid and a Sneaker Management page with add / edit / delete and validation. One long video in six parts — every part opens on the original exam image, translated and explained, and all code is a real Vite project built and run (the API is a local mockapi stand-in, labelled on screen).',
    'Đề thực hành FER202 mới nhất (Summer 2026, mã FER202_PE_20060701, 85 phút, 10 điểm): resource mockapi.io đặt tên theo mã số SV, trang Sneaker Collection dạng lưới thẻ và trang Sneaker Management có thêm / sửa / xoá kèm kiểm tra dữ liệu. Một video dài sáu phần — mỗi phần mở đầu bằng ảnh đề gốc, dịch và giải thích; code là dự án Vite thật đã build và chạy (API là bản giả lập mockapi cục bộ, có ghi rõ trên hình).',
    [
      'Part 1 — Reading the paper on the original images: the three "0 points" rules (.env, Bootstrap, unrelated code), the schema, Tasks 1–3, rubric and an 85-minute plan|||Phần 1 — Đọc đề trên ảnh gốc: ba luật "0 điểm" (.env, Bootstrap, code thừa), schema, Task 1–3, rubric và chia 85 phút',
      'Part 2 — Task 1 (0.5): the mockapi resource and schema, the API URL in .env (VITE_API_URL), Router with the roll-number prefix and the Navbar|||Phần 2 — Task 1 (0,5đ): resource + schema trên mockapi, URL API trong .env (VITE_API_URL), Router có tiền tố mã SV và Navbar',
      'Part 3 — Task 2 (4): card grid sorted Z→A with localeCompare, price as 189,000 VND (toLocaleString en-US), the Limited Edition badge|||Phần 3 — Task 2 (4đ): lưới thẻ sắp Z→A bằng localeCompare, giá dạng 189,000 VND (toLocaleString en-US), nhãn Limited Edition',
      'Part 4 — Task 3 (1): management table sorted by id as NUMBERS (mockapi ids are strings: 1, 10, 2 ✗), 70×70 thumbnails, delete with confirm → notify → reload|||Phần 4 — Task 3 (1): bảng quản lý sắp id KIỂU SỐ (id mockapi là chuỗi: 1, 10, 2 ✗), ảnh 70×70, xoá có confirm → báo → tải lại',
      'Part 5 — Task 3 (2): the Add Sneaker form — seven validation rules (brand ≥ 2 WORDS, price 1…999), switch default false, empty select, POST with Number/Boolean types|||Phần 5 — Task 3 (2): form Add Sneaker — bảy luật kiểm tra (hãng ≥ 2 TỪ, giá 1…999), switch mặc định false, select trống, POST đúng kiểu Number/Boolean',
      'Part 6 — Task 3 (3): Edit pre-filled with useParams + useEffect, same rules, PUT; 10/10 recap and a pre-submit checklist|||Phần 6 — Task 3 (3): Edit điền sẵn bằng useParams + useEffect, cùng luật, PUT; tổng kết 10/10 và checklist trước khi nộp',
      'Every common mistake is tried for real: missing VITE_ prefix, no Bootstrap CSS, route without the roll number, string id sort, no reload after delete, price saved as a string, edit form not pre-filled|||Mọi lỗi hay gặp đều thử thật: thiếu tiền tố VITE_, quên CSS Bootstrap, route thiếu mã SV, sắp id như chuỗi, xoá xong không tải lại, giá lưu thành chuỗi, form sửa không điền sẵn',
    ],
    [B91, B112, B21, EX8],
    17,
  ),
  v(
    'fer202-pe18-sp26-chua-tron-de',
    'PE review · Exam 18 (SP26) — Attendance System, full walkthrough in one video|||Ôn thi PE · Đề 18 (SP26) — Attendance System, chữa trọn đề một video',
    'A Spring 2026 FER202 practical paper (85 minutes, 10 marks) on json-server: a Subject List page with search and filters, and a bulk attendance page where a lecturer records PRESENT / ABSENT for a whole class under three business rules. One long video in four parts — every part opens on the original exam image, translated and explained; the code is a real Vite project run against the given database.json, placed next to each figure of the paper.',
    'Đề thực hành FER202 kỳ Spring 2026 (85 phút, 10 điểm) chạy json-server: trang Subject List có tìm kiếm và lọc, và trang điểm danh cả lớp — giảng viên chọn PRESENT / ABSENT cho từng sinh viên theo ba luật nghiệp vụ. Một video dài bốn phần — mỗi phần mở đầu bằng ảnh đề gốc, dịch và giải thích; code là dự án Vite thật chạy với database.json của đề, đặt cạnh từng hình trong đề.',
    [
      'Part 1 — Reading the paper on the original images: the three "0 points" rules (json-server :9999, app at localhost:3000 via npm start, exact routes), the data (enrollments with dropped students), both questions, rubric and an 85-minute plan|||Phần 1 — Đọc đề trên ảnh gốc: ba luật "0 điểm" (json-server :9999, app ở localhost:3000 bằng npm start, đúng route), dữ liệu (enrollments có sinh viên đã rút), hai câu, rubric và chia 85 phút',
      'Part 2 — Question 1 (5): 4-per-row grid (Col md={3}), green/grey badges, case-insensitive startsWith search on the client, status dropdown built with new Set, ?status= kept in the URL with useSearchParams, View Attendance|||Phần 2 — Câu 1 (5đ): lưới 4 thẻ/hàng (Col md={3}), badge xanh/xám, tìm startsWith không phân biệt hoa thường phía client, dropdown trạng thái bằng new Set, ?status= giữ trên URL bằng useSearchParams, nút View Attendance',
      'Part 3 — Question 2 (1): /subjects/:subjectId/attendance?classId=, class picker, only "enrolled" students, PRESENT/ABSENT radios, today\'s date in LOCAL time (toISOString gives yesterday before 7 am in Vietnam)|||Phần 3 — Câu 2 (1): /subjects/:subjectId/attendance?classId=, chọn lớp, chỉ sinh viên "enrolled", radio PRESENT/ABSENT, ngày hôm nay theo GIỜ MÁY (toISOString ra hôm qua trước 7 giờ sáng ở Việt Nam)',
      'Part 4 — Question 2 (2): future date, missing status (codes listed, row highlighted), duplicate date (date.slice(0, 10)), one POST per student; 10/10 recap and a pre-submit checklist|||Phần 4 — Câu 2 (2): ngày tương lai, thiếu trạng thái (liệt kê mã, tô dòng), trùng ngày (date.slice(0, 10)), mỗi sinh viên một POST; tổng kết 10/10 và checklist trước khi nộp',
      'Mistakes tried for real: includes instead of startsWith, status kept only in useState, md={4}, dropped students shown, comparing the full ISO date (duplicates get saved)|||Lỗi thử thật: includes thay startsWith, status chỉ để trong useState, md={4}, hiện cả sinh viên đã rút, so cả chuỗi ISO (bị lưu trùng)',
    ],
    [B91, B112, B22, EX8],
    18,
  ),
  v(
    'fer202-pe1-0-mo-dau',
    'PE review · Exam 1 (SP26 B5) — reading & analysing the exam|||Ôn thi PE · Đề 1 (SP26 B5) — mở đầu: đọc & phân tích đề',
    'The newest practical exam in the Exam room. Before any code: the English prompt, the four tables in database.json, what each of the three questions asks, where the rubric puts the marks, and how to split 90 minutes.',
    'Đề thực hành mới nhất trong Phòng thi. Chưa gõ code: đọc đề tiếng Anh, bốn bảng trong database.json, ba câu hỏi gì, rubric để điểm ở đâu, và chia 90 phút thế nào.',
    [
      'Big picture: JSON Server on port 9999 + React on port 3000; three questions (2 + 4 + 4 marks) build ONE Company Management page|||Bức tranh lớn: JSON Server cổng 9999 + React cổng 3000; ba câu (2 + 4 + 4 điểm) cùng dựng MỘT trang Company Management',
      'The data: departments (managerId), employees (depId, supervisorId = null means Manager, nested dependents), projects, works|||Dữ liệu: departments (managerId), employees (depId, supervisorId = null là Manager, mảng dependents bên trong), projects, works',
      'Question by question: manager name looked up via managerId; Accordion + salary = floor(empSalary / 176 × workHours); dependents form, birthdate must be BEFORE today, PUT the whole employee|||Từng câu: tên trưởng phòng tra qua managerId; Accordion + lương = floor(empSalary / 176 × workHours); form người phụ thuộc, ngày sinh phải TRƯỚC hôm nay, PUT cả nhân viên',
      'Two ambiguities in the paper and the safe reading; the Vite trap (default port 5173 — set port 3000 + strictPort)|||Hai chỗ đề mơ hồ và cách hiểu an toàn; bẫy Vite (cổng mặc định 5173 — đặt port 3000 + strictPort)',
      'Architecture App → DepartmentList / EmployeeList / Dependents and a 90-minute plan|||Kiến trúc App → DepartmentList / EmployeeList / Dependents và kế hoạch 90 phút',
    ],
    [PE_KHUNG, B112, PE4_0, B81],
    1,
  ),
  v(
    'fer202-pe1-1-cau-1',
    'PE review · Exam 1 — Question 1: Department List (fetch, manager name, View)|||Ôn thi PE · Đề 1 — Câu 1: Department List (fetch, tra tên Manager, nút View)',
    'Question 1 (2 marks): fetch departments and employees in useEffect, show the manager full name looked up through managerId, and a View button that lifts the selected depId up to App.',
    'Câu 1 (2 điểm): lấy departments và employees trong useEffect, hiện họ tên trưởng phòng tra qua managerId, và nút View đẩy depId đang chọn lên App.',
    [
      'App keeps the selected depId; DepartmentList receives selectedId and onView|||App giữ state depId; DepartmentList nhận selectedId và onView',
      'Two fetch calls in useEffect with an empty dependency array; managerName with find|||Hai lệnh fetch trong useEffect với mảng phụ thuộc rỗng; hàm managerName dùng find',
      'Run it for real: exactly two GET requests in the JSON Server log|||Chạy thật: đúng hai request GET trong log của JSON Server',
      'Three mistakes tried for real: missing [] (1,500+ requests in 3 s), JSON Server not started, comparing ids of different types|||Ba lỗi thử thật: thiếu [] (hơn 1.500 request trong 3 giây), quên bật JSON Server, so id khác kiểu',
      'Checked against the rubric: 1 + 1 = 2 marks|||Đối chiếu rubric: 1 + 1 = 2 điểm',
    ],
    [B81, B111, B31, B41, B51],
    1,
  ),
  v(
    'fer202-pe1-2-cau-2',
    'PE review · Exam 1 — Question 2: employee Accordion & salary table|||Ôn thi PE · Đề 1 — Câu 2: Accordion nhân viên & bảng lương',
    'Question 2 (4 marks): employees of the selected department in an Accordion with a Manager label, their projects joined from works + projects, and a salary column that matches the paper digit for digit.',
    'Câu 2 (4 điểm): nhân viên của phòng đang chọn trong Accordion có nhãn Manager, dự án nối từ works + projects, và cột lương khớp từng chữ số với hình đề.',
    [
      'Filter employees by depId; Accordion with defaultActiveKey and key = depId|||Lọc nhân viên theo depId; Accordion có defaultActiveKey và key = depId',
      'Join works → projects to get project names; salary = Math.floor(empSalary / 176 × workHours); total with reduce|||Nối works → projects lấy tên dự án; lương = Math.floor(empSalary / 176 × workHours); tổng bằng reduce',
      'Vietnamese number format with toLocaleString("vi-VN") and the Projects Salary … VND row|||Định dạng số kiểu Việt Nam bằng toLocaleString("vi-VN") và dòng Projects Salary … VND',
      'Two ways to lose the 1.5-mark salary criterion (no floor, no vi-VN), tried for real|||Hai cách mất tiêu chí lương 1,5 điểm (quên floor, quên vi-VN), thử thật',
      'Checked against the rubric: 1 + 1 + 1.5 + 0.5 = 4 marks|||Đối chiếu rubric: 1 + 1 + 1,5 + 0,5 = 4 điểm',
    ],
    [B21, EX10, B41, B111],
    1,
  ),
  v(
    'fer202-pe1-3-cau-3',
    'PE review · Exam 1 — Question 3: dependents form, validation & PUT|||Ôn thi PE · Đề 1 — Câu 3: Dependents (form, kiểm tra, PUT)',
    'Question 3 (4 marks): the dependents table (or "No dependents"), a controlled form with the seven relationship options, three validation rules, and a PUT of the whole employee that updates the page immediately.',
    'Câu 3 (4 điểm): bảng người phụ thuộc (hoặc "No dependents"), form có điều khiển với bảy lựa chọn quan hệ, ba luật kiểm tra, và PUT cả nhân viên rồi cập nhật trang ngay.',
    [
      'viewId in EmployeeList, a Dependents component with key = employee id|||viewId ở EmployeeList, component Dependents có key = id nhân viên',
      'One form state, validate() returns an array of errors; "before today" compared as yyyy-mm-dd strings (today is rejected too)|||Một state form, validate() trả mảng lỗi; "trước hôm nay" so bằng chuỗi yyyy-mm-dd (chọn đúng hôm nay cũng bị chặn)',
      'PUT /employees/:id with the WHOLE employee, then report back to the parent and reset the form|||PUT /employees/:id với CẢ đối tượng nhân viên, rồi báo lên cha và xoá trắng form',
      'Three traps tried for real: PUT with only dependents wipes the record, useState copying a prop without key (a bug in the bank model answer), comparing dates with new Date|||Ba bẫy thử thật: PUT chỉ có dependents làm mất bản ghi, useState chép prop mà không có key (lỗi có trong đáp án mẫu), so ngày bằng new Date',
      'Checked against the rubric: 4 marks — the whole exam adds up to 10|||Đối chiếu rubric: 4 điểm — cả đề đủ 10 điểm',
    ],
    [B61, EX8, EX17, B112, B22],
    1,
  ),

  // ───────── Đề 3 (SP26 · Block 5 · Paper 2) — cùng ngày thi với Đề 1 ─────────
  v(
    'fer202-pe3-0-mo-dau',
    'PE review · Exam 3 (SP26 B5 Paper 2) — reading the exam, vs Exam 1 & Question 1|||Ôn thi PE · Đề 3 (SP26 B5 · Paper 2) — đọc đề, so với Đề 1 & Câu 1',
    'Paper 2 of the same exam day as Exam 1, same company context. This video reads the paper, compares every question with Exam 1 and solves Question 1, which is identical.',
    'Paper 2 cùng ngày thi với Đề 1, cùng bối cảnh công ty. Video đọc đề, so từng câu với Đề 1 và làm luôn Câu 1 vì nó giống hệt.',
    [
      'Same structure (2 + 4 + 4 marks, port 9999) but Questions 2 and 3 swap topics: dependents in the Accordion, then work hours with POST|||Cùng cấu trúc (2 + 4 + 4 điểm, cổng 9999) nhưng Câu 2 và 3 đổi nội dung: người phụ thuộc trong Accordion, rồi giờ làm với POST',
      'Different data: dependents and workons are separate tables; the paper mixes field names — copy the real names from database.json|||Dữ liệu khác: dependents và workons là bảng riêng; đề ghi tên trường lẫn lộn — chép đúng tên thật từ database.json',
      'Question 1 reused from Exam 1 (two fetches, find by managerId, View button)|||Câu 1 dùng lại nguyên của Đề 1 (hai fetch, find theo managerId, nút View)',
      'The rounding subtlety: each row is floored but the total is rounded from the raw sum (…273, not …272)|||Chỗ làm tròn tinh tế: từng dòng cắt phần lẻ nhưng tổng làm tròn từ tổng thô (…273 chứ không phải …272)',
      'Rubric of Exam 3 and the page architecture for the next two videos|||Rubric của Đề 3 và kiến trúc trang cho hai tập sau',
    ],
    [PE1_1, PE1_0, PE_KHUNG],
    3,
  ),
  v(
    'fer202-pe3-1-cau-2',
    'PE review · Exam 3 — Question 2: Accordion, Manager badge & dependents table|||Ôn thi PE · Đề 3 — Câu 2: Accordion, nhãn Manager & bảng người phụ thuộc',
    'Question 2 (4 marks): employees of the department fetched with a query string, a Manager Badge when supervisorId is null, and a dependents table inside every Accordion item — empty table, not "No dependents".',
    'Câu 2 (4 điểm): nhân viên của phòng lấy bằng tham số trên URL, Badge Manager khi supervisorId là null, và bảng người phụ thuộc trong từng ô Accordion — bảng rỗng, không in "No dependents".',
    [
      'Let JSON Server filter: GET /employees?depId=… with depId in the dependency array|||Để JSON Server lọc: GET /employees?depId=… và depId nằm trong mảng phụ thuộc',
      'React-Bootstrap Badge for Manager; depsOf(id) filters the dependents table by employeeId|||Badge của React-Bootstrap cho Manager; depsOf(id) lọc bảng dependents theo employeeId',
      'Run it for real against the pictures in the paper|||Chạy thật, đối chiếu hình trong đề',
      'Two mistakes: copying [] from Question 1 (the list never changes), printing "No dependents" like Exam 1|||Hai lỗi: chép [] từ Câu 1 (danh sách không đổi khi đổi phòng), in "No dependents" như Đề 1',
      'Checked against the rubric: 1.5 + 1 + 1.5 = 4 marks|||Đối chiếu rubric: 1,5 + 1 + 1,5 = 4 điểm',
    ],
    [EX26, B81, EX10, PE1_2],
    3,
  ),
  v(
    'fer202-pe3-2-cau-3',
    'PE review · Exam 3 — Question 3: work hours, validation, duplicate rule & POST|||Ôn thi PE · Đề 3 — Câu 3: Work Hours (lương, form, chặn trùng, POST)',
    'Question 3 (4 marks), the longest of the paper: the work-hours table with salaries and total (or "No work hours"), a form with a project select loaded from the API, three checks including the duplicate-project rule, and a POST that updates the table at once.',
    'Câu 3 (4 điểm), dài nhất đề: bảng giờ làm có lương và tổng (hoặc "No work hours"), form có ô chọn dự án lấy từ API, ba bước kiểm tra kể cả luật chặn trùng dự án, và POST rồi cập nhật bảng ngay.',
    [
      'GET /workons?employeeId=…, salary per row with Math.floor, total from the raw sum|||GET /workons?employeeId=…, lương từng dòng bằng Math.floor, tổng từ tổng thô',
      'Select + number input; the select value is ALWAYS a string — Number() before comparing|||Ô chọn + ô số; value của ô chọn LUÔN là chuỗi — đổi Number() trước khi so',
      'Validation order and the exact message "This project already exists"; POST /workons and append the returned record|||Thứ tự kiểm tra và đúng câu "This project already exists"; POST /workons rồi thêm bản ghi trả về vào state',
      'Two traps tried for real: duplicate rule never fires (number vs string), POST succeeds but the table does not change|||Hai bẫy thử thật: luật trùng không bao giờ bắt (số so với chuỗi), POST thành công mà bảng đứng im',
      'Checked against the rubric: 1.5 + 1 + 0.5 + 1 = 4 marks|||Đối chiếu rubric: 1,5 + 1 + 0,5 + 1 = 4 điểm',
    ],
    [EX8, B61, EX27, B52],
    3,
  ),

  // ───────── Đề 7 (SU25 · Block 1) — rạp phim, 2 câu 6 + 4 điểm, hai route ─────────
  v(
    'fer202-pe7-0-mo-dau',
    'PE review · Exam 7 (SU25 B1) — reading, ambiguities & routing|||Ôn thi PE · Đề 7 (SU25 B1) — đọc đề, chỗ mơ hồ & routing',
    'A cinema app with two real routes: /movies (Question 1, 6 marks) and /booking/create (Question 2, 4 marks). This video reads the paper, flags the places where it contradicts itself and sets up routing first.',
    'App rạp phim có hai route thật: /movies (Câu 1, 6 điểm) và /booking/create (Câu 2, 4 điểm). Video đọc đề, chỉ ra các chỗ đề tự mâu thuẫn và dựng routing trước tiên.',
    [
      'Data: movies (seven fields to show), users, bookings (empty at first)|||Dữ liệu: movies (bảy trường phải hiện), users, bookings (ban đầu rỗng)',
      'Question 1: sort by rating descending, search with startsWith, unique genre/year filters (years descending) combined|||Câu 1: sắp rating giảm dần, tìm bằng startsWith, lọc thể loại/năm giá trị duy nhất (năm giảm dần), lọc kết hợp',
      'Three places the paper is wrong (dropdowns vs buttons, "the books", the "Incp" example) and how much to add to booked (+1 or + seats — the rubric accepts both)|||Ba chỗ đề viết sai ("dropdowns" mà hình là nút, "the books", ví dụ "Incp") và booked cộng bao nhiêu (+1 hay + số ghế — rubric chấp nhận cả hai)',
      'Question 2: four-field form, exact error message, POST bookings + increase booked, alert, redirect|||Câu 2: form bốn ô, đúng câu báo lỗi, POST bookings + tăng booked, thông báo, chuyển trang',
      'BrowserRouter with the two routes before writing any page; the rubric and a 90-minute plan|||BrowserRouter với hai route trước khi viết trang nào; rubric và kế hoạch 90 phút',
    ],
    [B91, PE1_0, PE_KHUNG],
    7,
  ),
  v(
    'fer202-pe7-1-cau-1',
    'PE review · Exam 7 — Question 1: movie list, sort, search & combined filters|||Ôn thi PE · Đề 7 — Câu 1: Movie List (sort, startsWith, lọc kết hợp)',
    'Question 1 (6 marks, the heaviest): one source array from the API, three pieces of state for what the user picked, and the visible list recomputed on every render with three filters and one sort.',
    'Câu 1 (6 điểm, nặng nhất): một mảng gốc từ API, ba state cho lựa chọn của người dùng, và danh sách hiển thị tính lại mỗi lần vẽ bằng ba filter và một sort.',
    [
      'Source data vs displayed data — why visible is NOT stored in state|||Dữ liệu gốc và dữ liệu hiển thị — vì sao visible KHÔNG cất vào state',
      'Unique values with [...new Set()], years sorted b − a|||Giá trị duy nhất bằng [...new Set()], năm sắp b − a',
      'Case-insensitive startsWith search, ButtonGroup filters, Card grid with all seven fields, Book Ticket → navigate|||Tìm startsWith không phân biệt hoa thường, bộ lọc ButtonGroup, lưới Card đủ bảy trường, Book Ticket → navigate',
      'The common mistake with Form.Select: its value is a string, releaseYear is a number|||Lỗi hay gặp với Form.Select: value là chuỗi, releaseYear là số',
      'Checked against the rubric: 2 + 2 + 2 = 6 marks|||Đối chiếu rubric: 2 + 2 + 2 = 6 điểm',
    ],
    [B22, B21, EX7, B91],
    7,
  ),
  v(
    'fer202-pe7-2-cau-2',
    'PE review · Exam 7 — Question 2: booking form, validation, POST + PATCH, redirect|||Ôn thi PE · Đề 7 — Câu 2: Đặt vé (form, kiểm tra, POST + PATCH, chuyển trang)',
    'Question 2 (4 marks): a booking form with two selects loaded from the API, a datetime-local and a seats input, the exact error message, then POST the booking, PATCH the movie booked count, alert and go back to /movies.',
    'Câu 2 (4 điểm): form đặt vé có hai ô chọn lấy từ API, ô datetime-local và ô số ghế, đúng câu báo lỗi, rồi POST booking, PATCH số booked của phim, thông báo và quay về /movies.',
    [
      'One form state for four fields; users and movies fetched once for the selects|||Một state form cho bốn ô; users và movies lấy một lần cho hai ô chọn',
      'Five validation conditions — Number(seats) must be greater than 0|||Năm điều kiện kiểm tra — Number(seats) phải lớn hơn 0',
      'POST /bookings, then PATCH /movies/:id sending only the new booked value, alert, navigate("/movies"). The video adds +1 per booking; the Exam room model answer adds the number of seats (in the original data Parasite has booked 2 from one 2-seat booking) — the rubric accepts both|||POST /bookings, rồi PATCH /movies/:id chỉ gửi giá trị booked mới, alert, navigate("/movies"). Video cộng +1 mỗi lượt đặt; đáp án mẫu trong Phòng thi cộng theo số ghế (dữ liệu gốc: Parasite booked 2 = một lượt đặt 2 ghế) — rubric chấp nhận cả hai',
      'Traps tried for real: seats = 0 slips through, PUT instead of PATCH wipes the movie, forgetting await|||Bẫy thử thật: số ghế 0 lọt qua, dùng PUT thay PATCH làm mất dữ liệu phim, quên await',
      'Checked against the rubric: 2 + 1 + 1 = 4 marks — the whole exam adds up to 10|||Đối chiếu rubric: 2 + 1 + 1 = 4 điểm — cả đề đủ 10 điểm',
    ],
    [B61, EX8, EX27, B91],
    7,
  ),

  // ───────── Đề 10 (SP25 · Đề số 1) — Shopping System, 3 câu 4 + 4 + 2 điểm ─────────
  v(
    'fer202-pe10-0-mo-dau',
    'PE review · Exam 10 (SP25 Paper 1) — reading the Shopping System paper, traps & routing|||Ôn thi PE · Đề 10 (SP25 Đề 1) — đọc đề Shopping System, chỗ cần hiểu đúng & routing',
    'A small shop: product table, cart, place order and order history on two pages. This video reads all three questions, points out five places that are easy to misread, and builds App with two routes and a CartProvider.',
    'Một cửa hàng nhỏ: bảng sản phẩm, giỏ hàng, đặt hàng và lịch sử đơn trên hai trang. Video đọc cả ba câu, chỉ ra năm chỗ dễ hiểu lệch, và dựng App với hai route cùng CartProvider.',
    [
      'Data: products with a reviews array (Rate is NOT in the data — it is the average you compute), orders with products|||Dữ liệu: products có mảng reviews (Rate KHÔNG có sẵn — là trung bình bạn tự tính), orders kèm products',
      'Question 1 (4): table at the root URL, Rate with two decimals, category select from the API|||Câu 1 (4 điểm): bảng ở đường dẫn gốc, Rate hai chữ số thập phân, ô chọn loại lấy từ API',
      'Question 2 (4): Add To Cart increases quantity, Remove, Place Order POST with the ship address|||Câu 2 (4 điểm): Add To Cart tăng số lượng, Remove, Place Order POST kèm địa chỉ',
      'Question 3 (2): /orders history, dates as dd/MM/yyyy, total price computed from the products|||Câu 3 (2 điểm): lịch sử /orders, ngày dạng dd/MM/yyyy, tổng tiền tự tính từ sản phẩm',
      'Five things to read correctly, the rubric and a 90-minute plan|||Năm chỗ cần hiểu đúng, rubric và kế hoạch 90 phút',
    ],
    [B91, B71, PE1_0, PE_KHUNG],
    10,
  ),
  v(
    'fer202-pe10-1-cau-1',
    'PE review · Exam 10 — Question 1: product table, average rate & category filter|||Ôn thi PE · Đề 10 — Câu 1: Bảng sản phẩm (Rate trung bình, lọc category từ API)',
    'Question 1 (4 marks): one source array, one selected category, the shown list recomputed on every render; the Rate column as the average review rating with toFixed(2); a two-column layout with an empty Cart already in place.',
    'Câu 1 (4 điểm): một mảng gốc, một state loại đang chọn, danh sách shown tính lại mỗi lần vẽ; cột Rate là trung bình rating với toFixed(2); bố cục hai cột có sẵn khung Cart rỗng.',
    [
      'Categories from the data with new Set (no hard-coded options)|||Danh sách loại lấy từ dữ liệu bằng new Set (không gõ cứng option)',
      'rate(reviews): guard for an empty array, reduce, divide, toFixed(2)|||rate(reviews): chặn mảng rỗng, reduce, chia, toFixed(2)',
      'Row md=8 / md=4 layout, Form.Select with an empty-value first option, Add To Cart column|||Bố cục Row md=8 / md=4, Form.Select có option đầu value rỗng, cột Add To Cart',
      'Two mistakes tried for real: forgetting toFixed (16 digits), hard-coding the categories|||Hai lỗi thử thật: quên toFixed (16 chữ số), gõ cứng danh sách loại',
      'Checked against the rubric: 1 + 2 + 1 = 4 marks|||Đối chiếu rubric: 1 + 2 + 1 = 4 điểm',
    ],
    [B22, B21, EX8, B112],
    10,
  ),
  v(
    'fer202-pe10-2-cau-2',
    'PE review · Exam 10 — Question 2: cart with Context, quantity, remove & POST order|||Ôn thi PE · Đề 10 — Câu 2: Giỏ hàng bằng Context (tăng số lượng, Remove, Place Order POST)',
    'Question 2 (4 marks): a cart shared by the product table and the Cart box through Context, Add To Cart that increases quantity instead of adding a row, Remove, and Place Order that POSTs to /orders, thanks the user and clears the cart.',
    'Câu 2 (4 điểm): giỏ hàng dùng chung giữa bảng sản phẩm và khung Cart qua Context, Add To Cart tăng số lượng thay vì thêm dòng, Remove, và Place Order gửi POST /orders, cảm ơn rồi xoá giỏ.',
    [
      'Why Context (the cart must survive going to /orders and back); CartProvider + useCart|||Vì sao dùng Context (giỏ phải còn khi sang /orders rồi quay lại); CartProvider + useCart',
      'addToCart with setCart(prev => …): find, then map to a NEW object with quantity + 1|||addToCart với setCart(prev => …): find, rồi map ra object MỚI với quantity + 1',
      'Cart table, "Your cart is empty", ship address input, POST with Content-Type JSON|||Bảng giỏ, "Your cart is empty", ô địa chỉ, POST có header Content-Type JSON',
      'Three mistakes tried for real, starting with mutating found.quantity (the screen does not update)|||Ba lỗi thử thật, đầu tiên là sửa thẳng found.quantity (màn hình không cập nhật)',
      'Checked against the rubric: 4 × 1 = 4 marks|||Đối chiếu rubric: 4 × 1 = 4 điểm',
    ],
    [B71, EX14, B22, B111],
    10,
  ),
  v(
    'fer202-pe10-3-cau-3',
    'PE review · Exam 10 — Question 3: order history, dd/MM/yyyy dates, computed totals & wrap-up|||Ôn thi PE · Đề 10 — Câu 3: Lịch sử đơn (dd/MM/yyyy, tự tính TotalPrice) & tổng kết đề',
    'Question 3 (2 marks): the /orders page with five columns, ISO dates printed as dd/MM/yyyy, and a total price computed from each order products — then a recap of the whole exam.',
    'Câu 3 (2 điểm): trang /orders năm cột, ngày ISO in thành dd/MM/yyyy, và tổng tiền tự tính từ sản phẩm của từng đơn — rồi tổng kết cả đề.',
    [
      'Where each of the five columns comes from|||Năm cột lấy từ đâu',
      'formatDate: getDate, getMonth() + 1, padStart(2, "0"), getFullYear|||formatDate: getDate, getMonth() + 1, padStart(2, "0"), getFullYear',
      'totalPrice with reduce(price × quantity) and toFixed(2), checked against the picture in the paper|||totalPrice bằng reduce(price × quantity) và toFixed(2), đối chiếu hình trong đề',
      'Mistakes tried for real: forgetting +1 / padStart, toLocaleDateString printing month first|||Lỗi thử thật: quên +1 / padStart, toLocaleDateString in tháng trước ngày',
      'Checked against the rubric: 1 + 1 = 2 marks — the whole exam adds up to 10|||Đối chiếu rubric: 1 + 1 = 2 điểm — cả đề đủ 10 điểm',
    ],
    [PE_KHUNG, B21, B111, PE10_2],
    10,
  ),
];
