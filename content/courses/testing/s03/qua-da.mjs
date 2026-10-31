/**
 * Testing · Chương 3 · 3.3 — Khi mock làm test vô giá trị. Slug giữ từ khung: tst-3-3-qua-da.
 * Đo thật bằng scripts/thu-loi.mjs: bug status (mock xanh / fake đỏ), thêm cột source (test quá chi tiết đỏ / fake xanh).
 */
import G from '../giang/tst-03-3.mjs';
import { ma, ra } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const MUI_EN = `<table>
<thead><tr><th>Smell</th><th>Fix</th></tr></thead>
<tbody>
<tr><td>The mock returns the very answer the test then checks</td><td>Run the real logic; fake only the I/O around it</td></tr>
<tr><td><code>toHaveBeenCalledWith</code> on every internal call</td><td>Assert the outcome: returned value, stored rows, outbox</td></tr>
<tr><td>More lines setting up mocks than describing the scenario</td><td>A reusable fake (memory repo, fake mailer)</td></tr>
<tr><td><code>vi.mock</code> of your own business modules</td><td>Pass dependencies in (lesson 3.4)</td></tr>
<tr><td>Every refactor turns a batch of tests red</td><td>Test through the public behaviour, not the call graph</td></tr>
</tbody></table>`;
const MUI_VI = `<table>
<thead><tr><th>Dấu hiệu</th><th>Cách sửa</th></tr></thead>
<tbody>
<tr><td>Mock trả về đúng câu trả lời mà test sau đó kiểm</td><td>Chạy logic thật; chỉ giả phần vào/ra xung quanh</td></tr>
<tr><td><code>toHaveBeenCalledWith</code> cho mọi lời gọi bên trong</td><td>Khẳng định kết quả: giá trị trả về, dòng đã lưu, hộp thư</td></tr>
<tr><td>Nhiều dòng dựng mock hơn dòng mô tả tình huống</td><td>Một fake dùng lại được (repo bộ nhớ, mailer giả)</td></tr>
<tr><td><code>vi.mock</code> module nghiệp vụ của chính mình</td><td>Truyền phụ thuộc vào (bài 3.4)</td></tr>
<tr><td>Mỗi lần refactor là cả loạt test đỏ</td><td>Test qua hành vi công khai, không qua sơ đồ lời gọi</td></tr>
</tbody></table>`;

export default {
  title: '3.3 — When mocks make tests worthless: one planted bug, one harmless change|||3.3 — Khi mock làm test vô giá trị: một bug được cài, một thay đổi vô hại',
  slug: 'tst-3-3-qua-da',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Đo thật hai kiểu thất bại của test dùng mock tràn lan: test mock bookLab vẫn xanh khi luật BR-06 bị phá (test fake đỏ đúng chỗ); test kiểm từng lời gọi repo đỏ khi chỉ lưu thêm một cột (test fake vẫn xanh). Công cụ scripts/thu-loi.mjs cài một thay đổi rồi trả lại; năm dấu hiệu và cách sửa.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.3</span>
<h2>When mocks make tests worthless</h2>
<p class="lead">A test is worth exactly the bugs it would catch. Mock-heavy tests often catch none, and still break whenever someone tidies the code. Here both failures are measured, not argued.</p>

<h3>A tool to plant one change</h3>
<p><code>scripts/thu-loi.mjs</code> (“thử lỗi” = try a bug) replaces one exact piece of a source file, runs the tests you name, and always restores the file — a one-mutant version of the Lab scripts:</p>
${ma('javascript', CODE.thuLoi)}

<h3>Two ways to test the same scenario</h3>
<p>Scenario: a student books 31 seats. BR-06 says this needs approval, so the booking is PENDING and the approver gets the e-mail.</p>
${ma('javascript', CODE.quaDaMock)}
${ma('javascript', CODE.quaDaFake)}
${ra(OUT['33-xanh'])}
<p>All green (the third file is the next section). But read the first test: it makes the mocked <code>bookLab</code> return CONFIRMED for 31 seats — the opposite of BR-06 — and then checks that the student got a confirmation. The second test, <code>passes the input to bookLab unchanged</code>, checks a line of glue code. Neither runs a single business rule.</p>

<h3>Plant a real bug</h3>
<p>Make every booking CONFIRMED, as if someone deleted the approval rule:</p>
${ra(OUT['33-bug'])}
<p>The mock-heavy file: <strong>2 of 2 green</strong> — the bug would ship. The fake-based file fails with exactly the right message: expected PENDING, received CONFIRMED.</p>

<h3>Make a harmless change</h3>
${ma('javascript', CODE.quaChiTiet)}
<p>This test checks how <code>bookLab</code> talks to the repository, argument by argument. Now store one more column — nothing a user can see changes:</p>
${ra(OUT['33-refactor'])}
<p>The over-specified test goes red; the fake-based tests stay green. In a suite of hundreds of tests, this is how teams end up spending a day “fixing tests” after every refactor — and then stop refactoring.</p>

<h3>Five smells and their fixes</h3>
${MUI_EN}
<p>Mocks are not banned. They are the right tool for outgoing side effects you cannot observe otherwise (lesson 3.1). The problem starts when they replace the logic you meant to test, or pin down calls that are nobody’s business but the implementation.</p>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>Rewrite “a 31-seat student booking e-mails the student” with real <code>bookLab</code>, the memory repo and the fake mailer, stating the correct rule.</li>
<li>Run it under <code>thu-loi.mjs</code> with the status bug — it must turn red.</li>
<li>Rewrite the over-specified test to assert the stored booking (use <code>repo.count()</code> and the returned row) instead of the calls.</li>
</ol>
<p><strong>Solution and real output:</strong></p>
${ma('javascript', CODE.th33)}
${ra(OUT['33-th'])}
${ra(OUT['33-th-bug'])}
${ra(OUT['33-th-refactor'])}
<p><strong>Done when:</strong> 2 passed normally; under the status bug only the first test is red; with the extra column both stay green.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">over-specified test</span><span class="v">A test that asserts implementation details the requirement does not mention.</span></div>
  <div class="kv"><span class="k">brittle test</span><span class="v">A test that breaks when behaviour did not change.</span></div>
  <div class="kv"><span class="k">false confidence</span><span class="v">Green tests that would stay green on a real bug.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Plant a bug and look: a test that stays green has no value against that bug.</li>
<li>Mocking the code under test only re-checks the mock.</li>
<li>Asserting internal calls punishes harmless changes.</li>
<li>Real logic + fake infrastructure catches the bug and survives the refactor.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.3</span>
<h2>Khi mock làm test vô giá trị</h2>
<p class="lead">Một test đáng giá đúng bằng số bug nó bắt được. Test dùng mock tràn lan thường chẳng bắt được bug nào, mà vẫn vỡ mỗi khi có người dọn dẹp code. Ở đây cả hai kiểu thất bại được đo, không phải tranh luận.</p>

<h3>Công cụ cài một thay đổi</h3>
<p><code>scripts/thu-loi.mjs</code> (“thử lỗi”) thay đúng một đoạn trong file nguồn, chạy các test bạn chỉ định, rồi luôn trả file về — phiên bản một-đột-biến của các script trong Lab:</p>
${ma('javascript', CODE.thuLoi)}

<h3>Hai cách test cùng một tình huống</h3>
<p>Tình huống: một sinh viên đặt 31 chỗ. BR-06 nói lượt này cần duyệt, nên lượt đặt ở trạng thái PENDING và người duyệt nhận thư.</p>
${ma('javascript', CODE.quaDaMock)}
${ma('javascript', CODE.quaDaFake)}
${ra(OUT['33-xanh'])}
<p>Xanh hết (file thứ ba là của mục sau). Nhưng đọc test đầu: nó bắt <code>bookLab</code> giả trả CONFIRMED cho 31 chỗ — ngược hẳn BR-06 — rồi kiểm sinh viên đã nhận thư xác nhận. Test thứ hai, <code>passes the input to bookLab unchanged</code>, kiểm một dòng code nối. Không test nào chạy lấy một luật nghiệp vụ.</p>

<h3>Cài một bug thật</h3>
<p>Làm mọi lượt đặt đều CONFIRMED, như thể có người xoá mất luật duyệt:</p>
${ra(OUT['33-bug'])}
<p>File dùng mock: <strong>2 trên 2 xanh</strong> — bug sẽ lên production. File dùng fake hỏng với thông báo đúng chỗ: mong PENDING, nhận CONFIRMED.</p>

<h3>Một thay đổi vô hại</h3>
${ma('javascript', CODE.quaChiTiet)}
<p>Test này kiểm <code>bookLab</code> nói chuyện với repository thế nào, từng tham số một. Giờ lưu thêm một cột — người dùng không thấy gì khác:</p>
${ra(OUT['33-refactor'])}
<p>Test quá chi tiết chuyển đỏ; test dùng fake vẫn xanh. Trong một bộ hàng trăm test, đây là cách các nhóm mất một ngày “sửa test” sau mỗi lần refactor — rồi thôi không dám refactor nữa.</p>

<h3>Năm dấu hiệu và cách sửa</h3>
${MUI_VI}
<p>Mock không bị cấm. Nó là công cụ đúng cho tác dụng phụ đi ra ngoài mà không có cách nào khác để quan sát (bài 3.1). Vấn đề bắt đầu khi nó thay chính phần logic bạn định test, hoặc ghim chặt các lời gọi vốn chỉ là chuyện riêng của cách cài đặt.</p>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Viết lại “a 31-seat student booking e-mails the student” bằng <code>bookLab</code> thật, repo bộ nhớ và mailer giả, phát biểu đúng luật.</li>
<li>Chạy nó dưới <code>thu-loi.mjs</code> với bug trạng thái — nó phải chuyển đỏ.</li>
<li>Viết lại test quá chi tiết để khẳng định lượt đặt đã lưu (dùng <code>repo.count()</code> và dòng trả về) thay vì các lời gọi.</li>
</ol>
<p><strong>Lời giải và output thật:</strong></p>
${ma('javascript', CODE.th33)}
${ra(OUT['33-th'])}
${ra(OUT['33-th-bug'])}
${ra(OUT['33-th-refactor'])}
<p><strong>Đạt khi:</strong> bình thường 2 passed; dưới bug trạng thái chỉ test đầu đỏ; khi thêm cột thì cả hai vẫn xanh.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">over-specified test (test quá chi tiết)</span><span class="v">Test khẳng định những chi tiết cài đặt mà yêu cầu không hề nhắc tới.</span></div>
  <div class="kv"><span class="k">brittle test (test giòn)</span><span class="v">Test vỡ khi hành vi không hề đổi.</span></div>
  <div class="kv"><span class="k">false confidence (tự tin giả)</span><span class="v">Test xanh mà vẫn sẽ xanh khi có bug thật.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Cài một bug rồi nhìn: test vẫn xanh thì vô giá trị với bug đó.</li>
<li>Mock chính code đang test chỉ là kiểm lại cái mock.</li>
<li>Khẳng định lời gọi bên trong là phạt những thay đổi vô hại.</li>
<li>Logic thật + hạ tầng giả vừa bắt được bug vừa sống qua refactor.</li>
</ul>
</div>
`,
};
