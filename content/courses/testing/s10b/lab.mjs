/**
 * Testing · Chương 10B · Lab 10B — Một collection Postman bắt 8 bug được cài vào API. BÀI MỚI 24/11/2026, slug tst-10b-7-lab-postman.
 * Máy chấm postman/lab/cham-lab.mjs (mỗi bug một bản sao API ở cổng riêng 43191–43198, newman --reporters json). Đo thật:
 * khởi đầu (= collection 10B.1–10B.2) 4/8 ⇒ 6/10 trượt; lần thử đầu 6/8 ⇒ 8/10 (đặt sát giờ ở phòng khác; 30 chỗ chỉ kiểm 201); lời giải 8/8 ⇒ 10/10, 21 request / 63 assertion.
 */
import { ma, ra, lienKet } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const lines = (t) => t.split('\n');
const RUN4 = (() => { const a = lines(OUT['lab-run']); const i = a.findIndex((l) => l.startsWith('❏ 4 Lab')); const j = a.findIndex((l, k) => k > i && l.startsWith('┌')); return a.slice(i, j).join('\n').trim() + '\n' + a.filter((l) => /│ +(requests|assertions)/.test(l)).join('\n'); })();

const BUG_EN = `<table>
<thead><tr><th>#</th><th>File</th><th>Planted bug</th><th>What a user would notice</th></tr></thead>
<tbody>
<tr><td>B1</td><td>src/api/server.js</td><td>owner check replaced by <code>true</code></td><td>any student reads any booking (IDOR)</td></tr>
<tr><td>B2</td><td>src/api/server.js</td><td>admin check becomes “not a student”</td><td>lecturers see every booking</td></tr>
<tr><td>B3</td><td>src/booking/service.js</td><td><code>&lt;</code> → <code>&lt;=</code> in the overlap test</td><td>09:00–11:00 blocks 11:00–12:00</td></tr>
<tr><td>B4</td><td>src/rules/booking.js</td><td><code>seats &gt; 30</code> → <code>seats &gt;= 30</code></td><td>a 30-seat class waits for approval</td></tr>
<tr><td>B5</td><td>src/api/server.js</td><td>Location <code>/api/booking/1</code></td><td>the app cannot open the new booking</td></tr>
<tr><td>B6</td><td>src/api/schemas.js</td><td><code>z.object</code> instead of <code>z.strictObject</code></td><td><code>role: ADMIN</code> in the body silently accepted</td></tr>
<tr><td>B7</td><td>src/api/server.js</td><td>rule errors 422 → 400</td><td>“your request is malformed” instead of “against a rule”</td></tr>
<tr><td>B8</td><td>src/booking/myBookings.js</td><td><code>listByUser</code> → <code>list</code></td><td>“My bookings” shows everyone's</td></tr>
</tbody></table>`;
const BUG_VI = `<table>
<thead><tr><th>#</th><th>Tệp</th><th>Bug được cài</th><th>Người dùng sẽ thấy gì</th></tr></thead>
<tbody>
<tr><td>B1</td><td>src/api/server.js</td><td>kiểm chủ sở hữu bị thay bằng <code>true</code></td><td>sinh viên nào cũng đọc được lượt đặt của ai (IDOR)</td></tr>
<tr><td>B2</td><td>src/api/server.js</td><td>kiểm admin thành “không phải sinh viên”</td><td>giảng viên thấy mọi lượt đặt</td></tr>
<tr><td>B3</td><td>src/booking/service.js</td><td><code>&lt;</code> → <code>&lt;=</code> trong kiểm trùng giờ</td><td>09:00–11:00 chặn luôn 11:00–12:00</td></tr>
<tr><td>B4</td><td>src/rules/booking.js</td><td><code>seats &gt; 30</code> → <code>seats &gt;= 30</code></td><td>lớp 30 người phải chờ duyệt</td></tr>
<tr><td>B5</td><td>src/api/server.js</td><td>Location <code>/api/booking/1</code></td><td>ứng dụng không mở được lượt đặt mới</td></tr>
<tr><td>B6</td><td>src/api/schemas.js</td><td><code>z.object</code> thay vì <code>z.strictObject</code></td><td><code>role: ADMIN</code> trong body bị lặng lẽ chấp nhận</td></tr>
<tr><td>B7</td><td>src/api/server.js</td><td>lỗi luật 422 → 400</td><td>“request của bạn sai dạng” thay vì “trái luật”</td></tr>
<tr><td>B8</td><td>src/booking/myBookings.js</td><td><code>listByUser</code> → <code>list</code></td><td>“Lượt đặt của tôi” hiện của mọi người</td></tr>
</tbody></table>`;

const RUBRIC_EN = `<table>
<thead><tr><th>Points</th><th>For</th></tr></thead>
<tbody>
<tr><td>2</td><td>the collection is green on the real API (otherwise the score is 0 — a red collection proves nothing)</td></tr>
<tr><td>8 × 1</td><td>each planted bug that turns the run red</td></tr>
<tr><td>—</td><td>pass at 7/10</td></tr>
</tbody></table>`;
const RUBRIC_VI = `<table>
<thead><tr><th>Điểm</th><th>Cho</th></tr></thead>
<tbody>
<tr><td>2</td><td>collection xanh trên API thật (không thì 0 điểm — collection đỏ chẳng chứng minh gì)</td></tr>
<tr><td>8 × 1</td><td>mỗi bug được cài làm lượt chạy đỏ</td></tr>
<tr><td>—</td><td>đạt từ 7/10</td></tr>
</tbody></table>`;

export default {
  title: 'Lab 10B — A Postman collection that catches 8 planted bugs|||Lab 10B — Một collection Postman bắt 8 bug được cài vào API',
  slug: 'tst-10b-7-lab-postman',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lab chương: máy chấm chạy collection của bạn với API thật (phải xanh) rồi với 8 bản API bị cài bug (IDOR, giảng viên qua cửa admin, đặt sát giờ bị coi là trùng, 30 chỗ phải duyệt, Location sai, nhận trường lạ, 422 thành 400, "lượt đặt của tôi" lộ của người khác). Đo thật: collection khởi đầu 6/10, lần thử đầu 8/10 vì hai test đặt sai chỗ, lời giải 10/10.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10B · Lab 10B</span>
<h2>A Postman collection that catches 8 planted bugs</h2>
<p class="lead">Every Lab of this course asks the same question: do your tests notice when the code is wrong? Here the tests are a Postman collection and the grader breaks the real API eight times, one bug per copy. A collection that stays green on a broken API scores nothing for that bug.</p>

<h3>Mission</h3>
<p>Start from the collection of lessons 10B.1–10B.2 (<code>postman/lab/khoi-dau.postman_collection.json</code>). Add requests and tests — in the Postman app or by editing the JSON — until the grader catches all eight bugs below and the collection is still green on the real API.</p>
${BUG_EN}

<h3>The grader</h3>
<p>For each bug it copies the project into a temporary folder, makes one text replacement, starts that copy on its own port, runs your collection with Newman, and reads the JSON report. Read it — a grader you do not understand teaches nothing:</p>
<details><summary>postman/lab/cham-lab.mjs</summary>
${ma('javascript', CODE.grader)}
</details>
<p>Run it from the project folder: <code>node postman/lab/cham-lab.mjs &lt;your collection&gt;</code> (it needs Newman on the PATH, or <code>NEWMAN=path/to/newman</code>). The starter collection, as measured:</p>
${ra(OUT['lab-khoi-dau'])}
<p>The 42 assertions from 10B.1 catch the four bugs that touch what they already check (owner, Location, schema, 422) and miss the four rules nobody tested: who counts as admin, touching bookings, the 30-seat edge, and “my bookings”.</p>

<h3>Rubric</h3>
${RUBRIC_EN}

<h3>Hints (open one at a time)</h3>
<details><summary>Hint 1 — which user?</summary><p>B2 only shows for a user who is neither student nor admin. The collection never logs in as <code>thay</code>.</p></details>
<details><summary>Hint 2 — touching is not overlapping</summary><p>B3 needs a booking that starts exactly when an existing one ends — <em>in the same lab, on the same day</em>. A back-to-back booking in an empty lab cannot overlap anything, buggy or not.</p></details>
<details><summary>Hint 3 — the edge, and what changes there</summary><p>B4 changes nothing about 201: a 30-seat booking is still created. What changes is its <code>status</code>.</p></details>
<details><summary>Hint 4 — absence</summary><p>B8 makes a list longer. Assert what must <em>not</em> be in Binh's list, and what must be in An's.</p></details>

<h3>A first attempt, graded</h3>
<p>A real first try: log in as <code>thay</code> ✓, 31 seats → PENDING ✓, Binh's list ✓ — but the back-to-back booking used a fresh lab <code>BE-205</code>, and the 30-seat test only checked for 201:</p>
${ra(OUT['lab-thu-lan-dau'])}
<p>8/10 passes the Lab, and it is still wrong in a useful way: two tests whose names promise a rule but whose setup cannot see it. Hints 2 and 3 are exactly those two.</p>

<h3>Reference solution</h3>
<details><summary>Open only after your own attempt</summary>
<p>A fifth folder, <code>4 Lab — the rules nobody tested</code>. The two booking requests send <code>{ "lab": "BE-201", "date": "2026-12-01", "start": "11:00", "end": "12:00", "seats": 20 }</code> (right after An's 09:00–11:00 in the same lab) and a 30-seat and a 31-seat booking in free labs. The tests:</p>
${ma('javascript', CODE.labTests)}
${ra(RUN4)}
${ra(OUT['lab-loi-giai'])}
</details>

<h3>✅ Checklist</h3>
<ul>
<li>Green on the real API, run twice in a row (the reset request makes the second run identical).</li>
<li>Every new test named after the rule it protects, not after the request.</li>
<li>Each new test seen red once — the grader shows you which bug made it red.</li>
<li>No secrets in the collection except the demo password of a demo server.</li>
</ul>
${lienKet({ khoa: 'testing', bai: 'tst-5-5-lab-api', title: 'Compare with Lab 5 — the same API, 8 mutants, Supertest', sub: 'Which bugs were easier to catch from inside the code, and which from outside?', cta: 'OPEN LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10B · Lab 10B</span>
<h2>Một collection Postman bắt 8 bug được cài vào API</h2>
<p class="lead">Lab nào của khoá này cũng hỏi cùng một câu: test của bạn có nhận ra khi mã sai không? Ở đây test là một collection Postman và máy chấm làm hỏng API thật tám lần, mỗi bản sao một bug. Collection vẫn xanh trên một API hỏng thì bug đó không được điểm nào.</p>

<h3>Nhiệm vụ</h3>
<p>Bắt đầu từ collection của bài 10B.1–10B.2 (<code>postman/lab/khoi-dau.postman_collection.json</code>). Thêm request và test — trong ứng dụng Postman hoặc sửa thẳng JSON — tới khi máy chấm bắt được cả tám bug dưới đây và collection vẫn xanh trên API thật.</p>
${BUG_VI}

<h3>Máy chấm</h3>
<p>Với mỗi bug, nó chép dự án vào một thư mục tạm, thay đúng một đoạn chữ, bật bản sao đó ở một cổng riêng, chạy collection của bạn bằng Newman và đọc báo cáo JSON. Hãy đọc nó — một máy chấm bạn không hiểu thì chẳng dạy được gì:</p>
<details><summary>postman/lab/cham-lab.mjs</summary>
${ma('javascript', CODE.grader)}
</details>
<p>Chạy từ thư mục dự án: <code>node postman/lab/cham-lab.mjs &lt;collection của bạn&gt;</code> (cần Newman trong PATH, hoặc <code>NEWMAN=đường/dẫn/newman</code>). Collection khởi đầu, đo thật:</p>
${ra(OUT['lab-khoi-dau'])}
<p>42 assertion của 10B.1 bắt được bốn bug chạm vào thứ chúng đã kiểm (chủ sở hữu, Location, schema, 422) và bỏ lọt bốn luật chưa ai test: ai được tính là admin, hai lượt đặt sát nhau, mép 30 chỗ, và “lượt đặt của tôi”.</p>

<h3>Thang chấm</h3>
${RUBRIC_VI}

<h3>Gợi ý (mở từng cái một)</h3>
<details><summary>Gợi ý 1 — người dùng nào?</summary><p>B2 chỉ lộ ra với người không phải sinh viên cũng không phải admin. Collection chưa bao giờ đăng nhập bằng <code>thay</code>.</p></details>
<details><summary>Gợi ý 2 — sát nhau không phải trùng</summary><p>B3 cần một lượt đặt bắt đầu đúng lúc một lượt có sẵn kết thúc — <em>cùng phòng, cùng ngày</em>. Lượt đặt sát giờ trong một phòng trống không thể trùng với gì, dù có bug hay không.</p></details>
<details><summary>Gợi ý 3 — ở mép, cái gì thay đổi</summary><p>B4 không đổi gì ở 201: lượt đặt 30 chỗ vẫn được tạo. Thứ thay đổi là <code>status</code> của nó.</p></details>
<details><summary>Gợi ý 4 — sự vắng mặt</summary><p>B8 làm một danh sách dài ra. Khẳng định thứ <em>không được</em> có trong danh sách của Bình, và thứ phải có trong danh sách của An.</p></details>

<h3>Một lần thử đầu, đem chấm</h3>
<p>Một lần thử thật: đăng nhập bằng <code>thay</code> ✓, 31 chỗ → PENDING ✓, danh sách của Bình ✓ — nhưng lượt đặt sát giờ dùng một phòng mới <code>BE-205</code>, và test 30 chỗ chỉ kiểm 201:</p>
${ra(OUT['lab-thu-lan-dau'])}
<p>8/10 là đạt Lab, nhưng vẫn sai theo một cách đáng học: hai test có tên hứa hẹn một luật mà phần dựng dữ liệu lại không thể thấy luật đó. Gợi ý 2 và 3 nói đúng hai chỗ ấy.</p>

<h3>Lời giải tham khảo</h3>
<details><summary>Chỉ mở sau khi đã tự làm</summary>
<p>Một folder thứ năm, <code>4 Lab — the rules nobody tested</code>. Hai request đặt phòng gửi <code>{ "lab": "BE-201", "date": "2026-12-01", "start": "11:00", "end": "12:00", "seats": 20 }</code> (ngay sau lượt 09:00–11:00 của An, cùng phòng) cùng một lượt 30 chỗ và một lượt 31 chỗ ở các phòng trống. Các test:</p>
${ma('javascript', CODE.labTests)}
${ra(RUN4)}
${ra(OUT['lab-loi-giai'])}
</details>

<h3>✅ Danh sách kiểm</h3>
<ul>
<li>Xanh trên API thật, chạy hai lần liền (request reset làm lần hai giống hệt lần đầu).</li>
<li>Mỗi test mới đặt tên theo luật nó bảo vệ, không theo tên request.</li>
<li>Mỗi test mới đã thấy đỏ một lần — máy chấm cho bạn biết bug nào làm nó đỏ.</li>
<li>Không bí mật nào trong collection ngoài mật khẩu demo của một server demo.</li>
</ul>
${lienKet({ khoa: 'testing', bai: 'tst-5-5-lab-api', title: 'So với Lab 5 — cùng API, 8 đột biến, bằng Supertest', sub: 'Bug nào dễ bắt từ bên trong mã hơn, bug nào dễ bắt từ bên ngoài hơn?', cta: 'MỞ BÀI →' })}
</div>
`,
};
