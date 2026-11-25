/**
 * 0.2 — Dự án xuyên suốt khoá nestjs (soạn 24/11/2026). Theo luật "dự án xuyên suốt khoá" 21/11 (≥5 đề tài + tự chọn,
 * mốc mỗi chương, bảo vệ cuối khoá) và đề cuối khoá = Dự án 1 lộ trình Node (API đặt lịch phòng lab, cùng LabFlow).
 * Bài không có mã chạy; mốc từng chương trỏ tới slug bài mốc trong khung (nst-N-M-moc-du-an).
 */
import { lienKet } from '../_chung.mjs';

const THE = [
  lienKet({ khoa: 'nodejs', bai: 'nodejs-0-4-du-an', title: 'Node.js 0.4 — Dự án xuyên suốt cả khoá', sub: 'Đã làm dự án bằng Express ở khoá Node.js? Bạn được phép viết lại chính đề tài đó bằng Nest — so sánh hai bản là bài học rất đáng giá.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-12-1-de-bai', title: 'Debug có phương pháp 12.1 — Ứng dụng đặt lịch phòng lab có 10 lỗi', sub: 'Cùng miền nghiệp vụ đặt lịch phòng lab — học xong khoá này, sang đó săn lỗi trên chính kiểu hệ thống bạn đã dựng.', cta: 'Mở bài →' }),
].join('\n');

const DE_TAI_EN = `<table>
<thead><tr><th>#</th><th>Topic</th><th>The hard part that makes it worth doing</th><th>Difficulty</th></tr></thead>
<tbody>
<tr><td>1</td><td><strong>Clinic appointment API</strong> — doctors, specialties, free slots, booking</td><td>Two patients must never hold the same slot</td><td>★★</td></tr>
<tr><td>2</td><td><strong>Club event ticketing</strong> — events, seat limits, check-in by QR code</td><td>Selling the last seat exactly once under load; idempotent check-in</td><td>★★</td></tr>
<tr><td>3</td><td><strong>Equipment lending for a faculty</strong> — cameras, laptops, borrow/return, fines</td><td>Overdue jobs on a schedule; ownership rules (only the borrower sees their loans)</td><td>★★</td></tr>
<tr><td>4</td><td><strong>Internship job board</strong> — companies post, students apply, mentors review CVs</td><td>Three roles with different permissions; file upload; status workflow</td><td>★★★</td></tr>
<tr><td>5</td><td><strong>Group-project task tracker</strong> — projects, tasks, comments, live updates</td><td>Real-time board over WebSocket; row-level permissions per project</td><td>★★★</td></tr>
<tr><td>✍️</td><td><strong>Your own topic</strong></td><td>Must have: ≥ 2 roles, ≥ 1 rule that can be broken by concurrent requests, ≥ 1 background job</td><td>—</td></tr>
</tbody>
</table>`;

const DE_TAI_VI = `<table>
<thead><tr><th>#</th><th>Đề tài</th><th>Phần khó làm nên giá trị</th><th>Độ khó</th></tr></thead>
<tbody>
<tr><td>1</td><td><strong>API đặt lịch phòng khám</strong> — bác sĩ, chuyên khoa, khung giờ trống, đặt lịch</td><td>Hai bệnh nhân không bao giờ giữ cùng một khung giờ</td><td>★★</td></tr>
<tr><td>2</td><td><strong>Bán vé sự kiện câu lạc bộ</strong> — sự kiện, giới hạn chỗ, điểm danh bằng mã QR</td><td>Bán chỗ cuối cùng đúng một lần khi đông người; điểm danh idempotent</td><td>★★</td></tr>
<tr><td>3</td><td><strong>Mượn thiết bị của khoa</strong> — máy ảnh, laptop, mượn/trả, phạt trễ hạn</td><td>Job quét quá hạn theo lịch; luật sở hữu (chỉ người mượn xem lượt mượn của mình)</td><td>★★</td></tr>
<tr><td>4</td><td><strong>Sàn việc thực tập</strong> — công ty đăng tin, sinh viên ứng tuyển, mentor duyệt CV</td><td>Ba vai trò quyền khác nhau; tải tệp lên; luồng trạng thái</td><td>★★★</td></tr>
<tr><td>5</td><td><strong>Theo dõi việc nhóm đồ án</strong> — dự án, task, bình luận, cập nhật trực tiếp</td><td>Bảng thời gian thực qua WebSocket; quyền theo từng dự án</td><td>★★★</td></tr>
<tr><td>✍️</td><td><strong>Đề tài tự chọn</strong></td><td>Bắt buộc có: ≥ 2 vai trò, ≥ 1 quy tắc có thể bị phá khi nhiều request đồng thời, ≥ 1 tác vụ nền</td><td>—</td></tr>
</tbody>
</table>`;

const MOC = [
  [1, 'nst-1-6-moc-du-an', 'Skeleton + first in-memory resource', 'Khung + tài nguyên đầu tiên lưu trong bộ nhớ'],
  [2, 'nst-2-8-moc-du-an', 'Feature modules, dependency diagram', 'Tách module tính năng, sơ đồ phụ thuộc'],
  [3, 'nst-3-8-moc-du-an', 'Unified errors, timing interceptor, first guard', 'Lỗi thống nhất, interceptor đo thời gian, guard đầu tiên'],
  [4, 'nst-4-6-moc-du-an', 'DTOs, global whitelist, response DTOs, /docs', 'DTO, whitelist toàn cục, DTO trả về, /docs'],
  [5, 'nst-5-6-moc-du-an', 'Validated config, .env.example, JSON logs', 'Cấu hình có kiểm, .env.example, log JSON'],
  [6, 'nst-6-7-moc-du-an', 'PostgreSQL + migrations, DB errors → HTTP codes', 'PostgreSQL + migration, lỗi DB → mã HTTP'],
  [7, 'nst-7-7-moc-du-an', 'Accounts, default-deny guard, roles + ownership', 'Tài khoản, guard mặc định đóng, vai trò + sở hữu'],
  [8, 'nst-8-6-moc-du-an', 'Unit + e2e tests that catch real bugs', 'Test đơn vị + e2e bắt được lỗi thật'],
  [9, 'nst-9-5-moc-du-an', 'One retried job, one cron', 'Một job có thử lại, một cron'],
  [10, 'nst-10-6-moc-du-an', 'One authenticated real-time feature', 'Một tính năng thời gian thực có xác thực'],
  [11, 'nst-11-6-moc-du-an', 'Dockerfile, compose, CI badge', 'Dockerfile, compose, badge CI'],
];

const bangMoc = (vi) => `<table>
<thead><tr><th>${vi ? 'Chương' : 'Chapter'}</th><th>${vi ? 'Mốc' : 'Milestone'}</th><th>${vi ? 'Bài' : 'Lesson'}</th></tr></thead>
<tbody>
${MOC.map(([n, slug, en, viT]) => `<tr><td>${n}</td><td>${vi ? viT : en}</td><td><a href="/courses/nestjs/learn?lessonSlug=${slug}">${slug}</a></td></tr>`).join('\n')}
</tbody>
</table>`;

const RUBRIC_EN = `<table>
<thead><tr><th>Criterion</th><th>Points</th><th>What the panel checks</th></tr></thead>
<tbody>
<tr><td>Correctness of the core rule (no double booking / no overselling)</td><td>20</td><td>A script sends 50 concurrent requests live; exactly one wins</td></tr>
<tr><td>Security: default-deny auth, roles, ownership, validation</td><td>20</td><td>Panel tries mass assignment, another user's id, a missing token</td></tr>
<tr><td>Nest structure: modules, providers, right layer for each concern</td><td>15</td><td>"Why is this a guard and not middleware?"</td></tr>
<tr><td>Tests: unit + e2e, run in CI</td><td>15</td><td>CI green; one test is broken on purpose — does it go red?</td></tr>
<tr><td>Async + real time: queue job with retry, live update</td><td>10</td><td>Kill the worker mid-job; no duplicate notification</td></tr>
<tr><td>Operations: Docker, health check, config, logs</td><td>10</td><td><code>docker compose up</code> on a clean machine</td></tr>
<tr><td>Docs and defence: OpenAPI, README in English, answers</td><td>10</td><td>7-minute demo + questions</td></tr>
</tbody>
</table>`;

const RUBRIC_VI = `<table>
<thead><tr><th>Tiêu chí</th><th>Điểm</th><th>Hội đồng kiểm gì</th></tr></thead>
<tbody>
<tr><td>Đúng quy tắc lõi (không đặt trùng / không bán quá chỗ)</td><td>20</td><td>Chạy trực tiếp script gửi 50 request đồng thời; đúng một cái thắng</td></tr>
<tr><td>Bảo mật: mặc định đóng, vai trò, sở hữu, kiểm dữ liệu</td><td>20</td><td>Hội đồng thử mass assignment, id của người khác, thiếu token</td></tr>
<tr><td>Cấu trúc Nest: module, provider, mỗi việc đúng lớp</td><td>15</td><td>"Vì sao chỗ này là guard mà không phải middleware?"</td></tr>
<tr><td>Test: đơn vị + e2e, chạy trong CI</td><td>15</td><td>CI xanh; cố ý làm hỏng một chỗ — test có đỏ không?</td></tr>
<tr><td>Bất đồng bộ + thời gian thực: job có thử lại, cập nhật trực tiếp</td><td>10</td><td>Giết worker giữa chừng; không gửi thông báo trùng</td></tr>
<tr><td>Vận hành: Docker, health check, cấu hình, log</td><td>10</td><td><code>docker compose up</code> trên máy sạch</td></tr>
<tr><td>Tài liệu và bảo vệ: OpenAPI, README tiếng Anh, trả lời câu hỏi</td><td>10</td><td>Demo 7 phút + hỏi đáp</td></tr>
</tbody>
</table>`;

export default {
  title: '0.2 — The course project: pick a topic, and the lab-booking capstone|||0.2 — Dự án xuyên suốt: chọn đề tài, và đề cuối khoá đặt lịch phòng lab',
  slug: 'nst-0-2-du-an',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Năm đề tài gợi ý + đề tự chọn cho dự án xuyên suốt, mốc dự án sau mỗi chương, đề cuối khoá API đặt lịch phòng lab (cùng đề Dự án 1 lộ trình Node), rubric 100 điểm và cách đăng ký đề tài.',
  content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>0.2 — Learn by building: your topic, one milestone per chapter, and a capstone you can defend</h2>
<p class="lead">Reading about guards teaches you the word "guard". Writing the guard that stops a classmate from cancelling your booking teaches you Nest. This course therefore runs two projects side by side: <strong>your own topic</strong>, grown one milestone at the end of every chapter, and the <strong>capstone</strong> in Chapter 12, a lab-booking API that every learner builds to the same brief, so it can be graded with one rubric.</p>

<h3>Choose your topic</h3>
${DE_TAI_EN}
<p>Already built a project with Express in the Node.js course? You may <strong>rewrite that same topic in Nest</strong>. Comparing the two versions (line counts, where each check lives, how tests look) is one of the best interview stories you can have.</p>

<h3>One milestone per chapter</h3>
${bangMoc(false)}
<p>Each milestone lesson lists concrete "done when" checks. Commit at every milestone with a message like <code>milestone 4: DTOs + global whitelist</code> — by the end your git history tells the story of how the project grew, which is exactly what reviewers look at.</p>

<h3>The capstone (Chapter 12): a lab-booking API</h3>
<p>Same brief as "Project 1" of the Node learning path, and the same domain as LabFlow and the Debugging course's capstone — so what you build here becomes the system you later debug and extend.</p>
<ul>
<li><strong>Actors:</strong> students book lab rooms; lecturers approve or reject bookings for their labs; admins manage rooms and opening hours.</li>
<li><strong>Core rule:</strong> two approved bookings of the same room can never overlap — enforced by the database, proven by a concurrency test.</li>
<li><strong>Flow:</strong> PENDING → APPROVED / REJECTED; the owner may CANCEL before the start time; reminders go out the day before.</li>
<li><strong>Non-functional:</strong> OpenAPI docs, unit + e2e tests in CI, Docker Compose up in one command, JSON logs, health check.</li>
</ul>

<h3>How it is graded (100 points)</h3>
${RUBRIC_EN}
<p>There is also a timed version (like the PE exam at school): 3 hours, starter repo given, implement booking + approval + the overlap rule + three e2e tests.</p>

<h3>🧪 Do it now (10 min) — register your topic</h3>
<div class="callout ok">
<ol>
<li>Pick a topic from the table or write your own in three lines: who uses it, what they do, which rule must never break.</li>
<li>Create an empty git repository named after it and a <code>README.md</code> containing those three lines.</li>
<li>Write your topic in the registration box below this lesson — the reviewer checks it has the three required ingredients (two roles, a concurrency-sensitive rule, a background job).</li>
</ol>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Two projects: your own topic (one milestone per chapter) and the shared lab-booking capstone.</li>
<li>Every topic needs ≥ 2 roles, a rule that concurrency can break, and a background job — that is where Nest's features matter.</li>
<li>The capstone is graded on correctness under concurrency, security, structure, tests, async, operations and defence.</li>
</ul>
${THE}
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>0.2 — Học bằng cách làm: đề tài của bạn, mỗi chương một mốc, và một dự án cuối khoá bảo vệ được</h2>
<p class="lead">Đọc về guard thì bạn biết chữ "guard". Tự viết cái guard chặn bạn cùng lớp huỷ lịch đặt của bạn thì bạn mới biết Nest. Vì thế khoá này chạy song song hai dự án: <strong>đề tài của riêng bạn</strong>, lớn dần qua một mốc ở cuối mỗi chương, và <strong>dự án cuối khoá</strong> ở chương 12 — API đặt lịch phòng lab, mọi người học làm cùng một đề để chấm chung một rubric.</p>

<h3>Chọn đề tài</h3>
${DE_TAI_VI}
<p>Đã làm dự án bằng Express ở khoá Node.js? Bạn được phép <strong>viết lại chính đề tài đó bằng Nest</strong>. So hai bản (số dòng, mỗi phép kiểm nằm ở đâu, test trông thế nào) là một trong những câu chuyện phỏng vấn hay nhất bạn có thể kể.</p>

<h3>Mỗi chương một mốc</h3>
${bangMoc(true)}
<p>Mỗi bài mốc có danh sách "đạt khi" cụ thể. Commit ở mỗi mốc với thông điệp kiểu <code>milestone 4: DTOs + global whitelist</code> — cuối khoá, lịch sử git kể lại dự án đã lớn lên thế nào, và đó đúng là thứ người duyệt hồ sơ hay xem.</p>

<h3>Dự án cuối khoá (chương 12): API đặt lịch phòng lab</h3>
<p>Cùng đề với "Dự án 1" của lộ trình Node, cùng miền nghiệp vụ với LabFlow và dự án cuối khoá Debug có phương pháp — thứ bạn dựng ở đây sẽ là hệ thống bạn gỡ lỗi và mở rộng về sau.</p>
<ul>
<li><strong>Người dùng:</strong> sinh viên đặt phòng lab; giảng viên duyệt hoặc từ chối lịch của phòng mình phụ trách; admin quản lý phòng và giờ mở cửa.</li>
<li><strong>Quy tắc lõi:</strong> hai lịch đã duyệt của cùng một phòng không bao giờ chồng giờ nhau — do cơ sở dữ liệu bảo đảm, có test đồng thời chứng minh.</li>
<li><strong>Luồng:</strong> CHỜ DUYỆT → ĐÃ DUYỆT / TỪ CHỐI; người đặt được HUỶ trước giờ bắt đầu; nhắc lịch gửi trước một ngày.</li>
<li><strong>Phi chức năng:</strong> tài liệu OpenAPI, test đơn vị + e2e chạy trong CI, Docker Compose bật bằng một lệnh, log JSON, health check.</li>
</ul>

<h3>Chấm thế nào (100 điểm)</h3>
${RUBRIC_VI}
<p>Có thêm bản thi có giờ (giống đề PE ở trường): 3 giờ, cho sẵn repo khởi đầu, làm chức năng đặt + duyệt + quy tắc không chồng giờ + ba test e2e.</p>

<h3>🧪 Làm ngay (10 phút) — đăng ký đề tài</h3>
<div class="callout ok">
<ol>
<li>Chọn một đề trong bảng hoặc tự viết đề của bạn trong ba dòng: ai dùng, họ làm gì, quy tắc nào không bao giờ được phá.</li>
<li>Tạo một kho git trống đặt theo tên đề tài và một tệp <code>README.md</code> chứa ba dòng đó.</li>
<li>Hãy đăng ký đề tài dự án cuối khoá của bạn ở ô bên dưới bài này — người duyệt kiểm đề có đủ ba thành phần bắt buộc (hai vai trò, một quy tắc nhạy với đồng thời, một tác vụ nền).</li>
</ol>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Hai dự án: đề tài của bạn (mỗi chương một mốc) và dự án chung đặt lịch phòng lab.</li>
<li>Đề tài nào cũng cần ≥ 2 vai trò, một quy tắc có thể bị phá khi đồng thời, và một tác vụ nền — đó là chỗ tính năng của Nest phát huy.</li>
<li>Dự án cuối được chấm theo: đúng khi đồng thời, bảo mật, cấu trúc, test, bất đồng bộ, vận hành và phần bảo vệ.</li>
</ul>
${THE}
</div>
`,
};
