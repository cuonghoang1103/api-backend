/**
 * 11.4 — Lab: báo cáo, ghi bản sửa và postmortem cho một lỗi ở Lab 8 (#802 múi giờ) (soạn 24/11/2026, máy nhà Linux).
 * Bộ chấm bằng MÁY: chạy khối tái hiện của bug report trên bản lỗi (phải thoát ≠ 0) và bản sửa (phải thoát 0), chạy test chặn tái phát
 * (đỏ trên bản lỗi, xanh trên bản sửa), soát bí mật, soát postmortem (số, giờ, người + hạn, không đổ lỗi).
 * Output thật — scratchpad/dbg/lab/ch11/lab (chay.sh, kiem.mjs, dap-an/, voi-vang/; out/o-lab11-*.txt).
 */
import { L_CHAY, L_SCHEMA, L_KIEM, L_APP, L_BC, L_BS, L_TEST, L_PM, V_BC, V_BS, V_TEST, V_PM } from './_ma-11.mjs';
import { L_CHAY as RA_CHAY, L_BANG, L_VOI, L_DAP } from './_ra-11.mjs';
import { lienKet } from '../_chung.mjs';

const ma = (s, lang = 'js') => `<pre><code class="language-${lang}">${s}</code></pre>`;
const ra = (s) => `<div class="out">${s}</div>`;

const CHUAN_BI = ma(`# Cần: Docker, Node 22, jq. PostgreSQL của khoá (dbg-pg, 127.0.0.1:45432) đang chạy.
cd dbg-lab/ch11/lab
./chay.sh                 # tạo CSDL labflow_lab11 (3 lịch hẹn), chạy bản LỖI :41140 và bản ĐÃ SỬA :41141 (server TZ=UTC)
mkdir bai-cua-toi         # nộp 4 tệp ở đây: bao-cao.md  ban-sua.md  tai-phat.test.mjs  postmortem.md
node kiem.mjs bai-cua-toi # chấm; đạt khi ≥ 80/100
./chay.sh dung            # dọn`, 'bash');

const VE_EN = ma(`From: Sato (partner, Tokyo office)         20/11/2026 09:12 (UTC+7)
Subject: schedule wrong?

Hello, in the schedule screen for Dec 1 (we use tz=Asia/Tokyo) we see "Minh 01:30 2/12" and we do not see
Tanaka-san 08:00. Tanaka-san appointment is Dec 1 morning. Please check.`, 'text');
const VE_VI = ma(`Từ: Sato (đối tác, văn phòng Tokyo)          20/11/2026 09:12 (giờ VN)
Tiêu đề: schedule wrong?

Hello, in the schedule screen for Dec 1 (we use tz=Asia/Tokyo) we see "Minh 01:30 2/12" and we do not see
Tanaka-san 08:00. Tanaka-san appointment is Dec 1 morning. Please check.`, 'text');

const DU_KIEN_EN = `<ul>
<li>18/11 10:05 — release 2.4.0 adds the <code>tz</code> parameter for the Japanese partner.</li>
<li>20/11 09:12 — the email above arrives. 20/11 14:30 — ticket #802 is closed as "cannot reproduce" (the tester looked at Vietnam time, where no booking was before 07:00 yet).</li>
<li>24/11 — you reopen it. Your fix from Lab 8.5 (or the reference fix running on :41141) is approved at 15:55 and deployed as 2.4.1 at 16:40.</li>
<li>The partner had 3 December bookings on the wrong day on their screen and phoned to confirm all three. Vietnamese early slots (06:30) only open from 01/12.</li>
</ul>`;
const DU_KIEN_VI = `<ul>
<li>18/11 10:05 — bản 2.4.0 thêm tham số <code>tz</code> cho đối tác Nhật.</li>
<li>20/11 09:12 — email ở trên tới. 20/11 14:30 — ticket #802 bị đóng với lý do "không tái hiện được" (người kiểm xem theo giờ Việt Nam, khi đó chưa có lịch nào trước 07:00).</li>
<li>24/11 — bạn mở lại. Bản sửa của bạn ở Lab 8.5 (hoặc bản sửa mẫu chạy ở :41141) được duyệt lúc 15:55 và deploy thành 2.4.1 lúc 16:40.</li>
<li>Đối tác có 3 lịch hẹn tháng 12 hiện sai ngày trên màn của họ và đã gọi điện xác nhận lại cả ba. Ca sớm 06:30 phía Việt Nam chỉ mở từ 01/12.</li>
</ul>`;

const RUBRIC_EN = `<table>
<thead><tr><th>Part</th><th>What kiem.mjs checks</th><th>Points</th></tr></thead>
<tbody>
<tr><td>Bug report</td><td>title states symptom + where; 6 sections; version + commit; severity and priority separate; <strong>the bash block reproduces</strong> (exit ≠ 0 on the buggy build, 0 on the fixed build); no secrets</td><td>40</td></tr>
<tr><td>Fix write-up</td><td>4 sections; the cause explains the mechanism; <strong>the test is red on the buggy build and green on the fixed build</strong></td><td>30</td></tr>
<tr><td>Postmortem</td><td>impact has numbers; ≥ 4 timed events; ≥ 2 contributing factors; every action has an owner and a date; no "be careful"; no blaming words</td><td>30</td></tr>
</tbody></table>`;
const RUBRIC_VI = `<table>
<thead><tr><th>Phần</th><th>kiem.mjs kiểm gì</th><th>Điểm</th></tr></thead>
<tbody>
<tr><td>Bug report</td><td>tiêu đề nói triệu chứng + nơi xảy ra; đủ 6 mục; có phiên bản + commit; tách severity và priority; <strong>khối bash tái hiện được</strong> (thoát ≠ 0 trên bản lỗi, 0 trên bản sửa); không lộ bí mật</td><td>40</td></tr>
<tr><td>Ghi bản sửa</td><td>đủ 4 mục; nguyên nhân giải thích cơ chế; <strong>test đỏ trên bản lỗi và xanh trên bản sửa</strong></td><td>30</td></tr>
<tr><td>Postmortem</td><td>ảnh hưởng có số; ≥ 4 mốc có giờ; ≥ 2 yếu tố góp phần; mọi hành động có người và hạn; không "cẩn thận hơn"; không từ ngữ đổ lỗi</td><td>30</td></tr>
</tbody></table>`;

const DAN_Y_EN = `<ol>
<li><strong>"What makes a good bug report?"</strong> A stranger can reproduce it alone: a title with symptom and condition, environment from commands (version, commit), steps with data — ideally one self-checking command — expected vs actual, frequency, evidence with secrets removed, facts separated from guesses.</li>
<li><strong>"Severity vs priority — give an example where they differ."</strong> Severity is technical impact, priority is business urgency: a misspelled customer name before a demo is trivial but P1; a crash in a yearly report is major but can wait.</li>
<li><strong>"How do you know your fix works?"</strong> A regression test that I saw fail on the old code for the reported reason, then pass with the fix; boundary cases on both sides; plus the original reproduction run against the fixed build.</li>
<li><strong>"Tell me about a postmortem you wrote."</strong> Impact with numbers, timeline from logs, several contributing factors (not one person), actions with owners and dates — and what changed afterwards.</li>
<li><strong>"A ticket was closed as 'cannot reproduce'. What do you do?"</strong> Ask for or rebuild the missing context (data, time zone, account, version), write a reproduction that checks itself, reopen with that — as happened with #802.</li>
</ol>`;
const DAN_Y_VI = `<ol>
<li><strong>"Thế nào là một bug report tốt?"</strong> Người lạ tự tái hiện được: tiêu đề có triệu chứng và điều kiện, môi trường lấy bằng lệnh (phiên bản, commit), các bước kèm dữ liệu — tốt nhất là một lệnh tự kiểm — mong đợi và thực tế, tần suất, bằng chứng đã che bí mật, sự thật tách khỏi phỏng đoán.</li>
<li><strong>"Severity và priority — cho ví dụ hai cái khác nhau."</strong> Severity là ảnh hưởng kỹ thuật, priority là độ gấp về kinh doanh: tên khách viết sai trước buổi demo là trivial nhưng P1; sập ở báo cáo mỗi năm một lần là major nhưng chờ được.</li>
<li><strong>"Làm sao bạn biết bản sửa đúng?"</strong> Một test chặn tái phát mà tôi đã thấy hỏng trên mã cũ đúng vì lỗi đã báo, rồi qua khi có bản sửa; trường hợp biên ở cả hai phía; cộng thêm chạy lại bản tái hiện gốc trên bản đã sửa.</li>
<li><strong>"Kể về một postmortem bạn đã viết."</strong> Ảnh hưởng có số, dòng thời gian lấy từ log, nhiều yếu tố góp phần (không phải một con người), hành động có người và hạn — và sau đó cái gì đã thay đổi.</li>
<li><strong>"Một ticket bị đóng 'không tái hiện được'. Bạn làm gì?"</strong> Hỏi hoặc tự dựng lại phần bối cảnh còn thiếu (dữ liệu, múi giờ, tài khoản, phiên bản), viết một bản tái hiện tự kiểm, mở lại kèm nó — đúng như chuyện của #802.</li>
</ol>`;

const DAP_AN = `<details><summary>Model submission (passes 100/100) / Bài mẫu (đạt 100/100)</summary>
${ma(L_BC, 'markdown')}${ma(L_BS, 'markdown')}${ma(L_TEST)}${ma(L_PM, 'markdown')}
${ra(L_DAP)}</details>`;

const LIEN_KET = [
  lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-8-5-lab', title: 'Bài 8.5 — Lab: ba ticket #801, #802, #803', sub: 'Nơi bạn đã sửa #802 — lab này viết phần giấy tờ cho nó.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'debug-co-phuong-phap', bai: 'dbg-8-2-thoi-gian', title: 'Bài 8.2 — Lỗi thời gian: múi giờ, DST, tháng 0', sub: 'Nền kiến thức của #802.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'incident-response', bai: 'ir-14-4-postmortem-cuoi', title: 'Incident Response 14.4 — Postmortem, cải tiến và câu chuyện phỏng vấn', sub: 'Postmortem cho sự cố lớn hơn, sau buổi diễn tập.', cta: 'Mở bài →' }),
].join('\n');

export default {
  title: '11.4 — Lab: Report, fix write-up and postmortem for one bug from Lab 8|||11.4 — Lab: Báo cáo, ghi bản sửa và postmortem cho một lỗi ở Lab 8',
  slug: 'dbg-11-4-lab',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Ticket #802 của Lab 8 (đối tác Tokyo thấy lịch 01/12 hiện "Minh 01:30 2/12", thiếu Tanaka 08:00) từng bị đóng "không tái hiện được". Bạn nộp 4 tệp: bug report, ghi bản sửa, test chặn tái phát, postmortem — và MÁY chấm điều người đọc cần: khối bash trong báo cáo chạy trên bản lỗi (:41140) phải thoát ≠ 0 và trên bản sửa (:41141) phải thoát 0, test phải đỏ trên bản lỗi và xanh trên bản sửa, không lộ token, postmortem có số, ≥ 4 mốc giờ, ≥ 2 yếu tố, hành động có người + hạn, không "cẩn thận hơn", không đổ lỗi. Output thật: bài nộp vội 10/100 (test "trả về 200" xanh trên cả bản lỗi), bài mẫu 100/100 (3 test đỏ/xanh). Rubric 100 điểm, gợi ý ba bậc, 5 câu phỏng vấn kèm dàn ý, mốc dự án.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lab</span>
<h2>Reopen #802, and write it so nobody can close it again</h2>
<p class="lead">In Lab 8.5 you fixed ticket #802: bookings shown on the wrong day for a partner in Tokyo. The code part is done. This lab is the other half — the three documents that make a fix useful to other people — and they are graded by a machine that does what a colleague would do: run your reproduction, run your test, read your postmortem for numbers, owners and blame.</p>

<h3>Rules</h3>
<ul>
<li>Everything you claim must come from running something: <code>curl</code>, <code>/health</code>, the test runner, the data in <code>schema.sql</code>.</li>
<li>The reproduction is a bash block that <em>checks itself</em>: it exits non-zero while the bug exists. Use <code>$BASE</code> for the address.</li>
<li>The test reads <code>BASE</code> from the environment; the grader runs it against both builds.</li>
<li>No tokens, passwords or cookies in any file (the app here has none — keep the habit).</li>
</ul>

<h3>Setup (5 min)</h3>
${CHUAN_BI}
${ra(RA_CHAY)}

<h3>The ticket (verbatim from the partner)</h3>
${VE_EN}
<p>Facts for the postmortem (the scenario — everything technical you must find yourself):</p>
${DU_KIEN_EN}

<h3>What to hand in</h3>
<ol>
<li><code>bao-cao.md</code> — sections: Summary, Environment, Steps to reproduce (with the bash block), Expected, Actual, Severity (severity and priority), Evidence. Headings may be English or Vietnamese.</li>
<li><code>ban-sua.md</code> — Root cause, Change, Why it is correct / how verified, Risk and impact.</li>
<li><code>tai-phat.test.mjs</code> — <code>node --test</code> tests that fail on :41140 and pass on :41141.</li>
<li><code>postmortem.md</code> — Summary, Impact (with numbers), Timeline (≥ 4 timed events), Causes and contributing factors (a list), Actions (a table with owner and due date), Lessons.</li>
</ol>

<h3>Rubric (100 points, pass ≥ 80)</h3>
${RUBRIC_EN}
<p>What a hasty submission gets — four files that "look like" the documents:</p>
<details><summary>voi-vang/ — the hasty files</summary>${ma(V_BC, 'markdown')}${ma(V_BS, 'markdown')}${ma(V_TEST)}${ma(V_PM, 'markdown')}</details>
${ra(L_VOI)}
<p>Read the second part: the hasty test "returns 200" is green on the buggy build — it would never catch #802. And the report leaked a (fake) token, which the grader caught before any customer did.</p>

<h3>Hints (open one level at a time)</h3>
<details><summary>Level 1: the reproduction</summary><p>The partner's screen is the API <code>/lich?ngay=…&amp;tz=…</code>. Which bookings exist is in <code>schema.sql</code>. Compute by hand which ones belong to 1 December in Tokyo time, then compare with what the API returns. Make the last line of your block a comparison (<code>[ "$kq" = '…' ]</code>).</p></details>
<details><summary>Level 2: the test</summary><p>Test three views: Tokyo 01/12, Tokyo 30/11, Vietnam 01/12. Each must be red on 41140. Run them against both ports yourself before the grader does: <code>BASE=http://127.0.0.1:41140 node --test tai-phat.test.mjs</code>.</p></details>
<details><summary>Level 3: the table that explains everything</summary>${ra(L_BANG)}</details>

<h3>🎤 What an interviewer will ask</h3>
${DAN_Y_EN}

<h3>🛠 Project milestone</h3>
<p>For your own project: add <code>docs/bug-report-template.md</code> and a PR template with Root cause / Change / How verified / Risk; add a <code>/health</code> endpoint that returns version and commit; and write one mini postmortem for the worst bug of the semester. These three files are good material for an OJT portfolio.</p>

<h3>Answers (check only after writing yours)</h3>
${DAP_AN}
${LIEN_KET}
<details><summary>chay.sh · schema.sql · kiem.mjs · the buggy app</summary>${ma(L_CHAY, 'bash')}${ma(L_SCHEMA, 'sql')}${ma(L_KIEM)}${ma(L_APP)}</details>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Lab</span>
<h2>Mở lại #802, và viết sao cho không ai đóng nó lần nữa</h2>
<p class="lead">Ở Lab 8.5 bạn đã sửa ticket #802: lịch hiện sai ngày với đối tác ở Tokyo. Phần mã đã xong. Lab này là nửa còn lại — ba tài liệu làm cho bản sửa có ích với người khác — và chúng được chấm bởi một cái máy làm đúng việc một đồng nghiệp sẽ làm: chạy bản tái hiện của bạn, chạy test của bạn, đọc postmortem của bạn để tìm số liệu, người phụ trách và chỗ đổ lỗi.</p>

<h3>Luật</h3>
<ul>
<li>Mọi điều bạn khẳng định phải đến từ việc chạy một thứ gì đó: <code>curl</code>, <code>/health</code>, trình chạy test, dữ liệu trong <code>schema.sql</code>.</li>
<li>Bản tái hiện là một khối bash <em>tự kiểm</em>: nó thoát với mã khác 0 khi lỗi còn đó. Dùng <code>$BASE</code> cho địa chỉ.</li>
<li>Test đọc <code>BASE</code> từ biến môi trường; bộ chấm chạy nó trên cả hai bản.</li>
<li>Không có token, mật khẩu hay cookie trong tệp nào (ứng dụng ở đây không có — cứ giữ thói quen).</li>
</ul>

<h3>Chuẩn bị (5 phút)</h3>
${CHUAN_BI}
${ra(RA_CHAY)}

<h3>Ticket (nguyên văn từ đối tác)</h3>
${VE_VI}
<p>Dữ kiện cho postmortem (là kịch bản — mọi thứ kỹ thuật bạn phải tự tìm):</p>
${DU_KIEN_VI}

<h3>Nộp gì</h3>
<ol>
<li><code>bao-cao.md</code> — các mục: Tóm tắt, Môi trường, Các bước tái hiện (có khối bash), Mong đợi, Thực tế, Mức độ (severity và priority), Bằng chứng. Tiêu đề mục viết tiếng Anh hay tiếng Việt đều được.</li>
<li><code>ban-sua.md</code> — Nguyên nhân gốc, Thay đổi, Vì sao đúng / đã kiểm thế nào, Rủi ro và ảnh hưởng.</li>
<li><code>tai-phat.test.mjs</code> — test <code>node --test</code> hỏng trên :41140 và qua trên :41141.</li>
<li><code>postmortem.md</code> — Tóm tắt, Ảnh hưởng (có số), Dòng thời gian (≥ 4 mốc có giờ), Nguyên nhân và yếu tố góp phần (dạng danh sách), Hành động (bảng có người và hạn), Bài học.</li>
</ol>

<h3>Rubric (100 điểm, đạt khi ≥ 80)</h3>
${RUBRIC_VI}
<p>Một bài nộp vội được bao nhiêu — bốn tệp "trông giống" tài liệu:</p>
<details><summary>voi-vang/ — các tệp nộp vội</summary>${ma(V_BC, 'markdown')}${ma(V_BS, 'markdown')}${ma(V_TEST)}${ma(V_PM, 'markdown')}</details>
${ra(L_VOI)}
<p>Đọc phần thứ hai: test vội "trả về 200" xanh trên cả bản lỗi — nó sẽ không bao giờ bắt được #802. Và báo cáo đã làm lộ một token (giả), bộ chấm bắt được trước khi khách nào thấy.</p>

<h3>Gợi ý (mở từng bậc một)</h3>
<details><summary>Bậc 1: bản tái hiện</summary><p>Màn hình của đối tác chính là API <code>/lich?ngay=…&amp;tz=…</code>. Có những lịch hẹn nào thì xem trong <code>schema.sql</code>. Tự tính tay lịch nào thuộc ngày 1/12 theo giờ Tokyo, rồi so với cái API trả về. Cho dòng cuối của khối là một phép so sánh (<code>[ "$kq" = '…' ]</code>).</p></details>
<details><summary>Bậc 2: test</summary><p>Kiểm ba góc nhìn: Tokyo 01/12, Tokyo 30/11, Việt Nam 01/12. Mỗi cái đều phải đỏ trên 41140. Tự chạy trên cả hai cổng trước khi bộ chấm chạy: <code>BASE=http://127.0.0.1:41140 node --test tai-phat.test.mjs</code>.</p></details>
<details><summary>Bậc 3: bảng giải thích mọi thứ</summary>${ra(L_BANG)}</details>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
${DAN_Y_VI}

<h3>🛠 Mốc dự án</h3>
<p>Với dự án của bạn: thêm <code>docs/bug-report-template.md</code> và một mẫu PR có Nguyên nhân gốc / Thay đổi / Đã kiểm thế nào / Rủi ro; thêm endpoint <code>/health</code> trả về phiên bản và commit; và viết một postmortem nhỏ cho lỗi tệ nhất trong học kỳ. Ba tệp này là tư liệu tốt cho hồ sơ OJT.</p>

<h3>Đáp án (chỉ xem sau khi đã viết bài của mình)</h3>
${DAP_AN}
${LIEN_KET}
<details><summary>chay.sh · schema.sql · kiem.mjs · ứng dụng bản lỗi</summary>${ma(L_CHAY, 'bash')}${ma(L_SCHEMA, 'sql')}${ma(L_KIEM)}${ma(L_APP)}</details>
</div>
`,
};
