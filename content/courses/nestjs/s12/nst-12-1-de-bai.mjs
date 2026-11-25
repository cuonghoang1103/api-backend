/**
 * 12.1 — Đề bài dự án cuối khoá: user story, ràng buộc, thời hạn, rubric và BỘ CHẤM TỰ ĐỘNG (khoá nestjs, soạn 24/11/2026).
 * Output THẬT (máy nhà, Node 22.22, Nest 12.6.0, Prisma 7.10.1, PostgreSQL 16 nst-pg, Redis 7.4 nst-redis): bộ chấm
 * scratchpad/nst/lab/c12/moc12/cham/cham.mjs chạy trên bản mốc 11 (lab/c12/moc11-goc) bằng ../chay-cham.sh ⇒ lab/c12/o/121-*.txt.
 * Ghép: web-tool/c12/gen.mjs rồi ghep.sh 121 nst-12-1-de-bai.
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'nestjs', bai: 'nst-0-2-du-an', title: 'NestJS 0.2 — Đề và rubric gốc', sub: 'Nơi đề lab-booking và thang 100 điểm được công bố lần đầu.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nestjs', bai: 'nst-11-6-moc-du-an', title: 'NestJS 11.6 — Mốc dự án 11', sub: 'Điểm xuất phát của chương này: 52 test, Docker, CI ba job.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-12-1-de-bai', title: 'Debug có phương pháp 12.1 — App đặt lịch phòng lab có 10 lỗi', sub: 'Cùng miền nghiệp vụ — học xong khoá này, sang đó săn lỗi.', cta: 'Mở bài →' }),
].join('\n');
const NGUON = [
  nguon('📘', 'Atlassian — User stories with examples and a template', 'Cách viết user story và tiêu chí chấp nhận.', 'https://www.atlassian.com/agile/project-management/user-stories'),
].join('\n');
const MA_CHAM = "// cham.mjs — bộ chấm tự động của hội đồng (dự án cuối khoá NestJS, bài 12.1). Chỉ dùng HTTP + Socket.IO + (tuỳ chọn) Redis hộp thư dev.\n// Chạy:  npm ci --prefix cham && CHAM_URL=http://127.0.0.1:42150 CHAM_MK=<mật khẩu seed> [CHAM_REDIS=redis://… | CHAM_HOP_THU=\"lệnh in hộp thư\"] node cham/cham.mjs\n// Cần trước: migrate + seed (admin@fpt.edu.vn, gv.lan@fpt.edu.vn quản lý AL-201; BE-105 không ai quản lý).\n// Mỗi lần chạy dùng một NGÀY khác (theo phút hiện tại) ⇒ chạy lại trên cùng DB không vướng dữ liệu lần trước.\nimport { io } from 'socket.io-client';\n// …\n// ── Quy tắc lõi (20) ──\nconst ma50 = (await Promise.all(Array.from({ length: 50 }, (_, i) => dat(sv[7 + (i % 5)], BE, 13)))).map((x) => x.s);\nghi('L1', 'Lõi', '50 request đồng thời cùng khung ⇒ đúng một 201', dem(ma50)[201] === 1, JSON.stringify(dem(ma50)));\n// … (đủ 15 mục: B1–B5, L1–L7, T1–T3)";
const OUT_LOI = "cham.mjs — http://127.0.0.1:42201 — ngày thử 2027-07-30 — 12 tài khoản SV mới\n✓ B1 [Bảo mật] đặt lịch không token ⇒ 401 — nhận 401\n✓ B2 [Bảo mật] mass assignment (status, userId trong body) ⇒ 400 — nhận 400\n✗ B3 [Bảo mật] Bình xem lịch của An ⇒ 404 — nhận 400\n✗ B4 [Bảo mật] Bình huỷ lịch của An ⇒ 404 — nhận 400\n✗ B5 [Bảo mật] sinh viên tự duyệt lịch mình ⇒ 403 — nhận 400\n✗ L1 [Lõi] 50 request đồng thời cùng khung ⇒ đúng một 201 — {\"400\":50}\n✗ L2 [Lõi] giảng viên duyệt lịch phòng KHÔNG phụ trách ⇒ 404 — nhận 400\n✗ L3 [Lõi] duyệt ⇒ APPROVED; duyệt lần hai ⇒ 403 — nhận 400 400, rồi 400\n…\nKẾT QUẢ: 4/15 đạt — trượt: B3 B4 B5 L1 L2 L3 L5 L6 L7 T2 T3";
const OUT_MOC11 = "cham.mjs — http://127.0.0.1:42201 — ngày thử 2027-07-31 — 12 tài khoản SV mới\n✓ B1 [Bảo mật] đặt lịch không token ⇒ 401 — nhận 401\n✓ B2 [Bảo mật] mass assignment (status, userId trong body) ⇒ 400 — nhận 400\n✓ B3 [Bảo mật] Bình xem lịch của An ⇒ 404 — nhận 404\n✓ B4 [Bảo mật] Bình huỷ lịch của An ⇒ 404 — nhận 404\n✓ B5 [Bảo mật] sinh viên tự duyệt lịch mình ⇒ 403 — nhận 403\n✓ L1 [Lõi] 50 request đồng thời cùng khung ⇒ đúng một 201 — {\"201\":1,\"409\":49}\n✓ L2 [Lõi] giảng viên duyệt lịch phòng KHÔNG phụ trách ⇒ 404 — nhận 404\n✓ L3 [Lõi] duyệt ⇒ APPROVED; duyệt lần hai ⇒ 403 — nhận 200 APPROVED, rồi 403\n✗ L4 [Lõi] đặt 02:00 (ngoài giờ mở cửa 07:00–21:00) ⇒ 400 — nhận 201\n✗ L5 [Lõi] đặt giờ mở cửa: SV ⇒ 403, admin ⇒ 200 — nhận 404, 404\n✗ L6 [Lõi] một SV giữ 6 khung chờ duyệt liên tiếp ⇒ chỉ 3 được nhận — 201 201 201 201 201 201\n✗ L7 [Lõi] một SV bắn 10 khung khác nhau CÙNG LÚC ⇒ chỉ 3 được nhận — {\"201\":10}\n✓ T1 [Thời gian thực] socket không token ⇒ bị từ chối — từ chối (unauthorized)\n✓ T2 [Thời gian thực] người xem phòng thấy lịch mới qua socket ≤ 3 s — nhận slot #70 PENDING sau 11 ms\n✓ T3 [Bất đồng bộ] duyệt ⇒ đúng MỘT email \"đã được duyệt\" trong 10 s — 1 email sau 13 ms\nKẾT QUẢ: 11/15 đạt — trượt: L4 L5 L6 L7";

const US = [
  ['US-01', 'Student registers and signs in with an @fpt.edu.vn email', 'Sinh viên đăng ký, đăng nhập bằng email @fpt.edu.vn', 'Wrong email or password ⇒ the same 401 message; role cannot be chosen in the body', 'Sai email hay sai mật khẩu ⇒ cùng một thông báo 401; không tự chọn vai trò trong body', '7'],
  ['US-02', 'Anyone sees rooms, capacity and opening hours; a signed-in user sees busy slots of a room', 'Ai cũng xem được phòng, sức chứa, giờ mở cửa; người đã đăng nhập xem được khung bận của một phòng', 'Busy slots show no owner and no note', 'Khung bận không lộ người đặt, không lộ ghi chú', '1, 10'],
  ['US-03', 'Student requests a slot; it starts as PENDING', 'Sinh viên xin một khung giờ; lịch bắt đầu ở CHỜ DUYỆT', 'Overlap with an active booking ⇒ 409, even with 50 concurrent requests', 'Chồng lên lịch đang hiệu lực ⇒ 409, kể cả 50 request đồng thời', '6'],
  ['US-04', 'Lecturer approves or rejects bookings of rooms they manage', 'Giảng viên duyệt / từ chối lịch của phòng mình phụ trách', 'Other rooms ⇒ 404; already decided ⇒ 403', 'Phòng khác ⇒ 404; lịch đã quyết ⇒ 403', '7'],
  ['US-05', 'Admin manages rooms and their opening hours (Vietnam time)', 'Admin quản lý phòng và giờ mở cửa (giờ Việt Nam)', 'Request outside opening hours ⇒ 400; narrowing hours lists affected bookings', 'Xin ngoài giờ mở cửa ⇒ 400; thu hẹp giờ thì liệt kê lịch bị ảnh hưởng', '<strong>12 (new)</strong>'],
  ['US-06', 'A user holds at most 3 pending requests', 'Mỗi người giữ tối đa 3 lịch chờ duyệt', 'The 4th ⇒ 409, also when 10 requests arrive at the same time', 'Cái thứ 4 ⇒ 409, kể cả khi 10 request đến cùng lúc', '<strong>12 (new)</strong>'],
  ['US-07', 'Owner cancels before the start time', 'Người đặt huỷ trước giờ bắt đầu', 'After start ⇒ 403 "Lịch đã bắt đầu"; admin may still cancel', 'Sau giờ bắt đầu ⇒ 403 "Lịch đã bắt đầu"; admin vẫn huỷ được', '8'],
  ['US-08', 'Owner gets one email on approval and a reminder one day before', 'Người đặt nhận một email khi được duyệt và một email nhắc trước một ngày', 'Worker killed mid-job ⇒ still exactly one email', 'Giết worker giữa chừng ⇒ vẫn đúng một email', '9 (12: 30 min → 1 day)'],
  ['US-09', 'A board shows a room\'s slots live', 'Bảng hiển thị khung giờ của phòng cập nhật trực tiếp', 'Socket without token or from a foreign Origin ⇒ rejected', 'Socket không token hoặc khác Origin ⇒ bị từ chối', '10'],
  ['US-10', 'The panel starts the system with one command and sees CI green', 'Hội đồng bật hệ thống bằng một lệnh và thấy CI xanh', 'docker compose up on a clean machine; health, logs, OpenAPI', 'docker compose up trên máy sạch; health, log, OpenAPI', '11'],
];
const bangUs = (vi) => `<table>
<thead><tr><th>ID</th><th>${vi ? 'Câu chuyện' : 'Story'}</th><th>${vi ? 'Chấp nhận khi' : 'Accepted when'}</th><th>${vi ? 'Có từ mốc' : 'Since milestone'}</th></tr></thead>
<tbody>
${US.map(([id, en, viS, acEn, acVi, moc]) => `<tr><td>${id}</td><td>${vi ? viS : en}</td><td>${vi ? acVi : acEn}</td><td>${moc}</td></tr>`).join('\n')}
</tbody>
</table>`;

export default {
  title: '12.1 — The brief: user stories, constraints, deadline and rubric|||12.1 — Đề bài: user story, ràng buộc, thời hạn và rubric',
  slug: 'nst-12-1-de-bai',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Đề dự án cuối khoá viết lại cho chấm được: 10 user story có tiêu chí chấp nhận, ràng buộc, lịch 2 tuần, bản thi 3 giờ kiểu PE, rubric 100 điểm. Rồi biến rubric thành một bộ chấm tự động 15 mục (cham.mjs) — lần chạy đầu chính bộ chấm sai, sửa xong chạy trên bản mốc 11: 11/15, lộ đúng 4 khoảng trống mà chương này sẽ lấp.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 1</span>
<h2>12.1 — A brief the panel can check by running a script</h2>
<p class="lead">Since lesson 0.2 you have known the capstone: a lab-booking API, scored out of 100. Eleven milestones later most of it exists. This lesson turns the brief into something precise enough to grade automatically, runs that grader against milestone 11, and lets the failures decide what the rest of the chapter builds.</p>

<h3>Everyday analogy: the paper on the lab door</h3>
<p>Before any system, booking a lab meant writing your name on a sheet taped to the door. It fails in exactly the ways our rules prevent: two groups write in the same hour (US-03), someone books 06:00 when the building is locked (US-05), one club fills the whole week "just in case" (US-06), and the lecturer never sees the sheet (US-04). Every story below is one of those failures written as a rule.</p>

<h3>1. User stories with acceptance criteria</h3>
<p>A user story says who wants what; the acceptance criterion says how a tester decides it is done. Without the second half, "students can book rooms" passes any demo.</p>
${bangUs(false)}
<p>Eight stories already have tests from earlier milestones. US-05 and US-06 are new; US-08 had a wrong number — milestone 9 used a 30-minute reminder while the brief says one day.</p>

<h3>2. Constraints</h3>
<ul>
<li><strong>Stack:</strong> Nest 12 + TypeScript, PostgreSQL, Redis; Prisma or TypeORM. Node 22.</li>
<li><strong>Correctness lives in the database</strong> wherever concurrency can break a rule (EXCLUDE, CHECK, locks) — not in an <code>if</code> before an insert.</li>
<li><strong>Closed by default:</strong> every route needs a token unless marked <code>@Public()</code>.</li>
<li><strong>Time:</strong> the API accepts ISO 8601 with an offset; opening hours are Vietnam local time.</li>
<li><strong>Operations:</strong> one <code>docker compose up</code>, health checks, JSON logs, no secrets in the repository.</li>
</ul>

<h3>3. Deadline: two weeks, or three hours</h3>
<p><strong>Project version</strong> — about 10 evenings of 2 hours: days 1–2 architecture and contract (12.2), days 3–5 core rules (12.3), days 6–7 queue and real time (12.4), days 8–9 tests, Docker, CI (12.5), day 10 rehearse the defence (12.6).</p>
<p><strong>Timed version</strong> (like a PE exam): 3 hours, a starter repository with auth and rooms already working. You must deliver: create + approve booking, the no-overlap rule enforced by the database, and three e2e tests (overlap ⇒ 409, other user's booking ⇒ 404, approve by a non-manager ⇒ 404). Suggested split: 30 min reading and migration, 90 min service + controller, 45 min tests, 15 min README.</p>

<h3>4. The rubric becomes a script</h3>
<p>The rubric from 0.2 says, for example, "the panel runs a script that sends 50 concurrent requests; exactly one wins". So write that script — <code>cham/cham.mjs</code>, plain Node 22 with <code>fetch</code> and <code>socket.io-client</code>, no access to the code under test:</p>
<pre><code class="language-js">${esc(MA_CHAM)}</code></pre>
<table>
<thead><tr><th>Rubric line</th><th>Points</th><th>Checks</th></tr></thead>
<tbody>
<tr><td>Security: closed by default, roles, ownership, validation</td><td>20</td><td>B1–B5</td></tr>
<tr><td>Core rule under concurrency</td><td>20</td><td>L1–L7</td></tr>
<tr><td>Async + real time</td><td>10</td><td>T1–T3</td></tr>
<tr><td>Structure, tests, operations, defence</td><td>50</td><td>read by people: 12.2, 12.5, 12.6</td></tr>
</tbody>
</table>

<h3>5. First run: the grader was wrong</h3>
<pre><code class="language-text">${esc(OUT_LOI)}</code></pre>
<p>Every booking got 400 — including the ones that should obviously succeed. The API was fine; the grader built <code>end</code> with <code>toISOString()</code>, which produces <code>…T03:00:00.000Z</code>, and the DTO from 4.1 only accepts ISO without milliseconds. Note also that L4 "passed": a check that expects 400 is satisfied by a request that is broken for an unrelated reason. Lesson: <strong>a test tool is code too</strong> — sanity-check it on cases that must succeed before trusting its failures. A second grader bug followed (two checks used overlapping slots, so a correct API looked wrong); each quota check now uses its own day.</p>

<h3>6. Milestone 11 against the grader</h3>
<pre><code class="language-text">${esc(OUT_MOC11)}</code></pre>
<p>Eleven of fifteen. Security, the overlap rule under 50 concurrent requests, approval, sockets and the email all hold. The four failures are precisely the new stories: no opening hours (a booking at 02:00 is accepted; the endpoint to set hours does not exist ⇒ 404), and no pending limit — six sequential requests all succeed, ten concurrent ones too. These four lines are the work plan for 12.3; 12.4 fixes US-08's number.</p>

<h3>🧪 Exercise (45 min)</h3>
<ol>
<li>Write the acceptance criteria for your own project in the same table form — at least 8 stories, each with a criterion a script can check.</li>
<li>Write a grader with at least 8 checks, including one concurrency check. Before trusting it, run it once against a case that must pass.</li>
<li>Run it against your milestone 11 and list the failures — that is your plan for this chapter.</li>
</ol>
<details><summary>Show a sample (topic 2: event tickets)</summary>
<pre><code class="language-text">B1  buy without token ⇒ 401
B2  body with "price": 0 ⇒ 400 (whitelist)
B3  another user's ticket ⇒ 404
L1  100 concurrent buys for the last 1 seat ⇒ exactly one 201
L2  check-in the same QR twice ⇒ second is 200 with "already checked in", count stays 1
L3  buy after the event started ⇒ 400
T1  organiser sees the seat count drop live (socket) ≤ 3 s
T2  buying sends exactly one email even if the worker restarts</code></pre>
<p>Sanity check first: one normal purchase must return 201 — if it returns 400, fix the grader before reading anything else.</p>
</details>

<h3>🎤 Interviewers will ask</h3>
<ol>
<li><strong>"Tell me about your capstone."</strong> — One sentence of problem, then the hardest rule and how you proved it: "two bookings never overlap; the database enforces it with an exclusion constraint, and a script with 50 concurrent requests shows exactly one 201."</li>
<li><strong>"How did you know you were done?"</strong> — Acceptance criteria written first, an automated acceptance script, CI running it on a fresh stack.</li>
<li><strong>"What did you leave out?"</strong> — Name it and why: no recurring bookings, no waiting list; the scope fits two weeks.</li>
<li><strong>"Your test passed — how do you know it tests the right thing?"</strong> — Run it where it must fail and where it must pass; the L4 story above.</li>
</ol>

<h3>💼 On the job</h3>
<p>At an outsourcing company the "brief" is usually a client email: "students should be able to book labs, lecturers approve". Before estimating, a good developer (or the BA) sends back the table above and asks the questions it raises: whose time zone? may a pending request block a slot? what happens to bookings when opening hours change? The answers become acceptance criteria in the ticket, and the client signs them. Many of the "bugs" reported after delivery are really disagreements about criteria nobody wrote down.</p>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">User story</span><span class="v">"As a ⟨role⟩ I want ⟨goal⟩" — who needs what, not how to build it.</span></div>
  <div class="kv"><span class="k">Acceptance criterion</span><span class="v">A checkable condition that decides whether a story is done.</span></div>
  <div class="kv"><span class="k">Acceptance test</span><span class="v">A test written from the user's side, through the public interface only.</span></div>
  <div class="kv"><span class="k">Definition of Done</span><span class="v">Team-wide checklist every story must meet (tests, docs, review, CI green).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>10 user stories with checkable criteria; US-05 (opening hours) and US-06 (pending limit) are new.</li>
<li>Two-week plan and a three-hour timed variant.</li>
<li>The rubric's checkable half is a 15-check script; it was wrong twice before it was right.</li>
<li>Milestone 11 scores 11/15; the four failures are the chapter's plan.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 1</span>
<h2>12.1 — Một đề bài mà hội đồng kiểm được bằng cách chạy một script</h2>
<p class="lead">Từ bài 0.2 bạn đã biết dự án cuối: API đặt lịch phòng lab, chấm trên 100 điểm. Qua mười một mốc, phần lớn đã có. Bài này viết lại đề cho đủ chính xác để chấm tự động, chạy bộ chấm đó trên bản mốc 11, và để chính các chỗ trượt quyết định phần còn lại của chương làm gì.</p>

<h3>Liên hệ đời thường: tờ giấy dán cửa phòng lab</h3>
<p>Trước khi có hệ thống, đặt phòng lab là ghi tên vào tờ giấy dán ở cửa. Tờ giấy hỏng đúng theo những cách mà luật của ta chặn: hai nhóm cùng ghi một giờ (US-03), có người ghi 06:00 trong khi toà nhà còn khoá (US-05), một câu lạc bộ ghi kín cả tuần "cho chắc" (US-06), còn thầy cô phụ trách không bao giờ thấy tờ giấy (US-04). Mỗi câu chuyện bên dưới là một kiểu hỏng đó, viết thành luật.</p>

<h3>1. User story kèm tiêu chí chấp nhận</h3>
<p>User story nói ai cần gì; tiêu chí chấp nhận nói người kiểm quyết định "xong" bằng cách nào. Thiếu nửa sau, câu "sinh viên đặt được phòng" qua được mọi buổi demo.</p>
${bangUs(true)}
<p>Tám câu đã có test từ các mốc trước. US-05 và US-06 là mới; US-08 sai một con số — mốc 9 nhắc trước 30 phút trong khi đề ghi một ngày.</p>

<h3>2. Ràng buộc</h3>
<ul>
<li><strong>Công nghệ:</strong> Nest 12 + TypeScript, PostgreSQL, Redis; Prisma hoặc TypeORM. Node 22.</li>
<li><strong>Sự đúng đắn nằm trong cơ sở dữ liệu</strong> ở mọi chỗ mà đồng thời có thể phá luật (EXCLUDE, CHECK, khoá) — không phải một câu <code>if</code> trước lệnh ghi.</li>
<li><strong>Mặc định đóng:</strong> route nào cũng cần token, trừ khi gắn <code>@Public()</code>.</li>
<li><strong>Thời gian:</strong> API nhận ISO 8601 có múi giờ; giờ mở cửa tính theo giờ Việt Nam.</li>
<li><strong>Vận hành:</strong> một lệnh <code>docker compose up</code>, health check, log JSON, không có bí mật trong repo.</li>
</ul>

<h3>3. Thời hạn: hai tuần, hoặc ba giờ</h3>
<p><strong>Bản dự án</strong> — khoảng 10 buổi tối, mỗi buổi 2 giờ: buổi 1–2 kiến trúc và hợp đồng API (12.2), buổi 3–5 luật lõi (12.3), buổi 6–7 hàng đợi và thời gian thực (12.4), buổi 8–9 test, Docker, CI (12.5), buổi 10 tập bảo vệ (12.6).</p>
<p><strong>Bản thi có giờ</strong> (giống đề PE ở trường): 3 giờ, cho sẵn repo khởi đầu đã có đăng nhập và phòng. Phải nộp: tạo + duyệt lịch, luật không chồng giờ do cơ sở dữ liệu giữ, và ba test e2e (chồng giờ ⇒ 409, lịch của người khác ⇒ 404, người không phụ trách duyệt ⇒ 404). Gợi ý chia giờ: 30 phút đọc đề và viết migration, 90 phút service + controller, 45 phút test, 15 phút README.</p>

<h3>4. Rubric biến thành một script</h3>
<p>Rubric ở 0.2 ghi, chẳng hạn, "hội đồng chạy script gửi 50 request đồng thời; đúng một cái thắng". Vậy thì viết chính script đó — <code>cham/cham.mjs</code>, Node 22 thuần với <code>fetch</code> và <code>socket.io-client</code>, không đụng vào mã đang bị chấm:</p>
<pre><code class="language-js">${esc(MA_CHAM)}</code></pre>
<table>
<thead><tr><th>Dòng rubric</th><th>Điểm</th><th>Mục kiểm</th></tr></thead>
<tbody>
<tr><td>Bảo mật: mặc định đóng, vai trò, sở hữu, kiểm dữ liệu</td><td>20</td><td>B1–B5</td></tr>
<tr><td>Quy tắc lõi khi đồng thời</td><td>20</td><td>L1–L7</td></tr>
<tr><td>Bất đồng bộ + thời gian thực</td><td>10</td><td>T1–T3</td></tr>
<tr><td>Cấu trúc, test, vận hành, bảo vệ</td><td>50</td><td>người đọc và hỏi: 12.2, 12.5, 12.6</td></tr>
</tbody>
</table>

<h3>5. Lần chạy đầu: chính bộ chấm sai</h3>
<pre><code class="language-text">${esc(OUT_LOI)}</code></pre>
<p>Mọi lượt đặt đều nhận 400 — kể cả những lượt hiển nhiên phải thành công. API không sai; bộ chấm dựng <code>end</code> bằng <code>toISOString()</code>, ra chuỗi <code>…T03:00:00.000Z</code>, còn DTO từ bài 4.1 chỉ nhận ISO không có mili giây. Để ý thêm: L4 "đạt" — một mục kiểm chờ 400 sẽ hài lòng với một request hỏng vì lý do chẳng liên quan. Bài học: <strong>công cụ kiểm thử cũng là mã</strong> — thử nó trên ca bắt buộc phải thành công trước khi tin những chỗ nó báo trượt. Ngay sau đó lộ lỗi thứ hai của bộ chấm (hai mục kiểm dùng khung giờ chồng nhau, nên API đúng mà trông như sai); giờ mỗi mục kiểm hạn mức dùng một ngày riêng.</p>

<h3>6. Bản mốc 11 trước bộ chấm</h3>
<pre><code class="language-text">${esc(OUT_MOC11)}</code></pre>
<p>Mười một trên mười lăm. Bảo mật, luật không chồng giờ dưới 50 request đồng thời, luồng duyệt, socket và email đều giữ được. Bốn chỗ trượt đúng là các câu chuyện mới: chưa có giờ mở cửa (đặt lúc 02:00 vẫn được nhận; route đặt giờ chưa tồn tại ⇒ 404), và chưa có hạn mức lịch chờ — sáu request lần lượt đều qua, mười request cùng lúc cũng qua. Bốn dòng này là kế hoạch của bài 12.3; bài 12.4 sửa con số của US-08.</p>

<h3>🧪 Thực hành (45 phút)</h3>
<ol>
<li>Viết tiêu chí chấp nhận cho đề tài của bạn theo đúng dạng bảng trên — tối thiểu 8 câu chuyện, mỗi câu có một tiêu chí mà script kiểm được.</li>
<li>Viết bộ chấm tối thiểu 8 mục, trong đó có một mục đồng thời. Trước khi tin nó, chạy một lần trên ca bắt buộc phải đạt.</li>
<li>Chạy trên mốc 11 của bạn và liệt kê các chỗ trượt — đó là kế hoạch chương này của bạn.</li>
</ol>
<details><summary>Xem mẫu (đề 2: bán vé sự kiện)</summary>
<pre><code class="language-text">B1  mua không token ⇒ 401
B2  body có "price": 0 ⇒ 400 (whitelist)
B3  vé của người khác ⇒ 404
L1  100 lượt mua đồng thời cho 1 chỗ cuối ⇒ đúng một 201
L2  điểm danh cùng một mã QR hai lần ⇒ lần hai 200 "đã điểm danh", số đếm vẫn là 1
L3  mua sau khi sự kiện bắt đầu ⇒ 400
T1  ban tổ chức thấy số chỗ giảm trực tiếp (socket) ≤ 3 giây
T2  mua vé gửi đúng một email kể cả khi worker khởi động lại</code></pre>
<p>Kiểm bộ chấm trước: một lượt mua bình thường phải ra 201 — nếu ra 400, sửa bộ chấm trước khi đọc bất cứ kết quả nào khác.</p>
</details>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>"Kể về dự án cuối của bạn."</strong> — Một câu về bài toán, rồi tới luật khó nhất và cách bạn chứng minh: "hai lịch không bao giờ chồng giờ; cơ sở dữ liệu giữ luật bằng exclusion constraint, và một script bắn 50 request đồng thời cho thấy đúng một 201."</li>
<li><strong>"Làm sao bạn biết đã xong?"</strong> — Tiêu chí chấp nhận viết trước, một script nghiệm thu tự động, CI chạy nó trên stack dựng mới.</li>
<li><strong>"Bạn đã bỏ ngoài phạm vi những gì?"</strong> — Nêu tên và lý do: không có lịch lặp, không có danh sách chờ; phạm vi vừa hai tuần.</li>
<li><strong>"Test của bạn xanh — sao biết nó kiểm đúng thứ cần kiểm?"</strong> — Chạy nó ở chỗ bắt buộc phải đỏ và chỗ bắt buộc phải xanh; chuyện mục L4 ở trên.</li>
</ol>

<h3>💼 Tình huống đi làm</h3>
<p>Ở công ty outsourcing, "đề bài" thường là một email của khách: "sinh viên đặt được phòng lab, giảng viên duyệt". Trước khi ước lượng, một lập trình viên tốt (hoặc BA) gửi lại đúng cái bảng ở trên và hỏi những câu nó gợi ra: múi giờ của ai? lịch chờ duyệt có được giữ chỗ không? đổi giờ mở cửa thì lịch cũ ra sao? Câu trả lời thành tiêu chí chấp nhận trong ticket, khách ký xác nhận. Rất nhiều "lỗi" bị báo sau khi bàn giao thật ra là bất đồng về những tiêu chí chưa ai viết ra.</p>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">User story</span><span class="v">"Là ⟨vai trò⟩, tôi muốn ⟨mục tiêu⟩" — ai cần gì, không nói cách làm.</span></div>
  <div class="kv"><span class="k">Tiêu chí chấp nhận</span><span class="v">Điều kiện kiểm được, quyết định một câu chuyện đã xong hay chưa.</span></div>
  <div class="kv"><span class="k">Test nghiệm thu</span><span class="v">Test viết từ phía người dùng, chỉ đi qua giao diện công khai.</span></div>
  <div class="kv"><span class="k">Definition of Done</span><span class="v">Danh sách chung cả nhóm mà câu chuyện nào cũng phải đạt (test, tài liệu, review, CI xanh).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>10 user story có tiêu chí kiểm được; US-05 (giờ mở cửa) và US-06 (hạn mức lịch chờ) là mới.</li>
<li>Kế hoạch hai tuần và một bản thi có giờ ba tiếng.</li>
<li>Nửa rubric kiểm được bằng máy thành một script 15 mục; nó sai hai lần trước khi đúng.</li>
<li>Bản mốc 11 đạt 11/15; bốn chỗ trượt là kế hoạch của chương.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
