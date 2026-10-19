/**
 * PRJ301 · Dự án Nhà trọ SV — hai mục video tự thêm (ngoài slide trường):
 *   - khoiDong: 4 bài "hiểu dự án + môi trường" (NT 0.1–0.4)
 *   - nhapVai: 8 bài "làm trọn — nhập vai từng thẻ CT Work" (NT-21 → NT-41)
 * Video gắn qua content/course-videos/java-web-application-development.mjs (track VI/R2).
 * Mỗi bài là loại VIDEO; nội dung ngắn vì video là phần chính.
 */

// helper: một bài video với nội dung song ngữ gọn
const v = (slug, title, lead_en, lead_vi, hoc) => ({
  title,
  slug,
  type: 'VIDEO',
  description: lead_vi,
  content: `
<div class="ml-en">
<span class="eyebrow">Student Hostel project · added by this site</span>
<h2>${title.split('|||')[0]}</h2>
<p class="lead">${lead_en}</p>
<h3>In this video</h3>
<ul>${hoc.map((h) => `<li>${h.split('|||')[0]}</li>`).join('')}</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Dự án Nhà trọ SV · phần web tự thêm</span>
<h2>${title.split('|||')[1]}</h2>
<p class="lead">${lead_vi}</p>
<h3>Trong video này</h3>
<ul>${hoc.map((h) => `<li>${h.split('|||')[1]}</li>`).join('')}</ul>
</div>`,
});

/* ───────── Mục A — Khởi động: hiểu dự án Nhà trọ & môi trường ───────── */
const khoiDong = [
  v('prj301-nt-0-1',
    'NT 0.1 — The brief: actors, 15 use cases & 10 requirements|||NT 0.1 — Đề bài: tác nhân, 15 use case & 10 yêu cầu',
    'Read the Student-Hostel assignment the way a developer reads a spec: who uses the system (actors), what they do (use cases), and the 10 graded requirements — before writing a single line of code.',
    'Đọc đề "Quản lý nhà trọ sinh viên" như một lập trình viên đọc đặc tả: ai dùng hệ thống (tác nhân), họ làm gì (use case), và 10 yêu cầu được chấm — trước khi gõ một dòng code.',
    ['Actors: guest, tenant, manager, admin|||Tác nhân: khách, người thuê, quản lý, admin',
     'The 15 use cases mapped to the 10 requirements|||15 use case ánh xạ vào 10 yêu cầu',
     'How the project is split among the team on CT Work|||Cách chia việc nhóm trên CT Work']),
  v('prj301-nt-0-2',
    'NT 0.2 — Where does a request go? The whole-project map|||NT 0.2 — Một request đi đâu? Bản đồ cả dự án',
    'Follow one HTTP request from the browser through Servlet → Service → DAO → database and back as a JSP page. One picture that makes the whole MVC project make sense.',
    'Theo chân một request HTTP từ trình duyệt đi qua Servlet → Service → DAO → cơ sở dữ liệu rồi về thành trang JSP. Một bức tranh giúp hiểu cả dự án MVC.',
    ['The request/response round trip|||Vòng đi-về của request/response',
     'Which folder holds which layer|||Thư mục nào chứa tầng nào',
     'Where your code plugs in|||Code của bạn cắm vào đâu']),
  v('prj301-nt-0-3',
    'NT 0.3 — Reading errors like a pro: Tomcat logs, 404 & 500|||NT 0.3 — Đọc lỗi như người đi làm: log Tomcat, 404 & 500',
    'Errors are not scary once you can read them. Real Tomcat stack traces, what a 404 vs a 500 really means, and how to find the one line that matters.',
    'Lỗi không đáng sợ khi bạn đọc được nó. Stack trace Tomcat thật, 404 vs 500 thực ra là gì, và cách tìm đúng một dòng quan trọng.',
    ['404 (not mounted) vs 500 (code threw)|||404 (chưa mount) vs 500 (code ném lỗi)',
     'Reading a Java stack trace top-down|||Đọc stack trace Java từ trên xuống',
     'Common beginner errors and their fix|||Lỗi người mới hay gặp và cách sửa']),
  v('prj301-nt-0-4',
    'NT 0.4 — Git for the team: one card = one branch = one Pull Request|||NT 0.4 — Git cho nhóm: một thẻ = một nhánh = một Pull Request',
    'The working rule that keeps a 3-4 person project from chaos: each CT Work card becomes a branch, merged into main only through a reviewed Pull Request.',
    'Luật làm việc giữ cho dự án 3-4 người khỏi loạn: mỗi thẻ CT Work thành một nhánh, chỉ vào main qua Pull Request có review.',
    ['Branch naming by card: NT-xx-ten-ngan|||Đặt tên nhánh theo thẻ: NT-xx-ten-ngan',
     'The one-card loop: branch → code → push → PR → merge|||Vòng một thẻ: nhánh → code → push → PR → merge',
     'Never push straight to main|||Không bao giờ push thẳng main']),
];

/* ───────── Mục B — Làm trọn: nhập vai từng thẻ (NT-21 → NT-41) ───────── */
const nhapVai = [
  v('prj301-nt-l-1',
    'NT-21 — Team lead day one: create the repo from the Ant skeleton|||NT-21 — Ngày đầu nhóm trưởng: tạo repo từ khung Java with Ant',
    'Role-play as the team lead: take the minimal NetBeans "Java with Ant" skeleton (DBContext, layout, filter, home page) and make it the first commit on main.',
    'Nhập vai nhóm trưởng: lấy khung tối thiểu NetBeans "Java with Ant" (DBContext, layout, filter, trang chủ) và biến nó thành commit đầu tiên trên main.',
    ['The Ant project layout & relative jar refs|||Bố cục project Ant & tham chiếu jar tương đối',
     '.gitignore: never commit db.properties/build/|||.gitignore: không commit db.properties/build/',
     'First push & inviting the team|||Push đầu tiên & mời thành viên']),
  v('prj301-nt-l-2',
    'NT-22 — setup.sql into the repo & the first Pull Request|||NT-22 — setup.sql vào repo & Pull Request đầu tiên',
    'Add the database (setup.sql: 11 tables, filtered unique indexes, seed data) and merge it through the first reviewed PR so the skeleton shows 5 real rooms.',
    'Thêm cơ sở dữ liệu (setup.sql: 11 bảng, chỉ mục UNIQUE có lọc, dữ liệu mẫu) và gộp qua PR có review đầu tiên để khung hiện 5 phòng thật.',
    ['A re-runnable setup.sql|||setup.sql chạy lại được',
     'Reviewing & merging PR #1|||Review & merge PR #1',
     'The home page reads real data|||Trang chủ đọc dữ liệu thật']),
  v('prj301-nt-k-1',
    'NT-24 — Shared layout: role-based navbar, flash, error pages|||NT-24 — Layout chung: navbar theo vai trò, thông báo một lần, trang lỗi',
    'Build the shared UI everyone reuses: a navbar that changes by role, a one-time flash message after redirect, and a friendly 403 page.',
    'Dựng giao diện dùng chung cho cả nhóm: navbar đổi theo vai trò, thông báo một lần sau redirect, và trang 403 thân thiện.',
    ['Role-based navbar with JSTL|||Navbar theo vai trò bằng JSTL',
     'Flash: show a message once|||Flash: hiện thông báo một lần',
     '403/404 pages that help the user|||Trang 403/404 giúp người dùng']),
  v('prj301-nt-k-2',
    'NT-30 — Register 1/2: PasswordHasher & two INSERTs in one transaction|||NT-30 — Đăng ký 1/2: PasswordHasher & hai INSERT trong một transaction',
    'Hash passwords properly (pbkdf2) and write account + profile atomically — both succeed or neither does. The foundation login depends on.',
    'Băm mật khẩu đúng cách (pbkdf2) và ghi account + hồ sơ một cách nguyên tử — thành công cả hai hoặc không cái nào. Nền mà đăng nhập cần tới.',
    ['pbkdf2 hashing & verify|||Băm & kiểm pbkdf2',
     'A transaction: commit/rollback|||Transaction: commit/rollback',
     'Why login reuses this|||Vì sao đăng nhập dùng lại cái này']),
  v('prj301-nt-k-3',
    'NT-30 — Register 2/2: server-side checks, sticky form, PRG, PR #3|||NT-30 — Đăng ký 2/2: kiểm ở server, form giữ dữ liệu, PRG, PR #3',
    'Validate on the server (never trust the browser), keep the form filled on error, and use Post-Redirect-Get so refresh does not double-submit.',
    'Kiểm ở server (không tin trình duyệt), giữ form đã điền khi lỗi, và dùng Post-Redirect-Get để refresh không gửi trùng.',
    ['Server-side validation|||Kiểm dữ liệu ở server',
     'Sticky form + error messages|||Form giữ dữ liệu + báo lỗi',
     'The PRG pattern|||Mẫu PRG (Post-Redirect-Get)']),
  v('prj301-nt-t-1',
    'NT-31 — Login 1/2: one error message, constant time, locked accounts|||NT-31 — Đăng nhập 1/2: một câu báo lỗi, thời gian như nhau, tài khoản bị khoá',
    'Authenticate safely: a single "wrong username or password" message (never reveal which), equal timing, and handling an account locked mid-session.',
    'Xác thực an toàn: một câu "sai tài khoản hoặc mật khẩu" (không lộ sai cái nào), thời gian như nhau, và xử lý tài khoản bị khoá giữa chừng.',
    ['Reuse PasswordHasher.verify|||Dùng lại PasswordHasher.verify',
     'Why a single error message|||Vì sao chỉ một câu báo lỗi',
     'Locked-account handling|||Xử lý tài khoản bị khoá']),
  v('prj301-nt-t-2',
    'NT-31 — Login 2/2: a fresh session, safe return URL, POST-only logout|||NT-31 — Đăng nhập 2/2: session mới, đường quay lại an toàn, đăng xuất chỉ POST',
    'After login: create a new session (fight fixation), send the user back to where they came from safely, and make logout a POST so a link cannot trigger it.',
    'Sau đăng nhập: tạo session mới (chống fixation), đưa người dùng về đúng chỗ an toàn, và đăng xuất bằng POST để một đường link không kích hoạt được.',
    ['changeSessionId against fixation|||changeSessionId chống fixation',
     'A safe ?next= return url|||Đường ?next= quay lại an toàn',
     'Logout only via POST|||Đăng xuất chỉ qua POST']),
  v('prj301-nt-t-3',
    'NT-41 — Authorization filter: who can open which area|||NT-41 — Filter phân quyền: ai được mở khu nào',
    'One filter guards every protected page: not logged in → login; wrong role → 403. Written once, every /tenant/*, /manager/*, /admin/* page is covered.',
    'Một filter gác mọi trang cần quyền: chưa đăng nhập → về đăng nhập; sai vai trò → 403. Viết một lần, mọi trang /tenant/*, /manager/*, /admin/* đều có cửa.',
    ['Mapping a Filter in web.xml|||Khai Filter trong web.xml',
     'Role check & 403|||Kiểm vai trò & 403',
     'Cache-Control so Back after logout is safe|||Cache-Control để Back sau đăng xuất an toàn']),
];

export default { khoiDong, nhapVai };
