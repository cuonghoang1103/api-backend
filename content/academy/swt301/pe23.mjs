/**
 * SWT301 · Practical Exam — PE23 (SU26 Paper 1), solved in ONE long video (luật chủ kênh 25/10/2026, LUAT-VIDEO-CHUA-DE B.0:
 * mỗi đề PE = một video dài; 4 phần swt-pe23-0..3 ghép bằng xuat/ghep-phan.mts ⇒ thư mục `-tron`, có mốc từng phần).
 * Exam room: content/exams/SWT301-PE23.mjs ("SWT301 — Practical Exam Đề 23 (SU26 - Paper 1)"), 85 minutes on paper (the room gives 90).
 * Video: ~/Videos/CuongThai-KhoaHoc/software-testing/15-thi-thuc-hanh-pe/15-06-de-su26-pe23-0-tron (38:19, mốc = mo-ta-chuong.txt).
 * Slug = slugWeb of all four parts in ~/Documents/video-bai-giang/src/bai/swt-pe23-{0..3}/kichban.ts; video attached via
 * content/course-videos/software-testing.mjs (track VI/R2) after render + ghep-phan + len-r2.
 * ⚠️ The only copy of this paper (FUOverflow "Đề 1-SP26") has NO legible code for Q1/Q2 — the listings are PRACTICE code written
 * from the spec (kept: template sample "int fare … Line 3", Q2 "minimum 7 TCs"). Everything is run for real (JDK 21):
 * Q1 javac/java · Q2 Maven + JUnit 5.12.2 + JaCoCo 0.8.13 + exhaustive search · Q3 reference implementation (5/5 example rows).
 */
import { bi } from './_slides.mjs';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const numbered = (lines) => '<pre><code>' + lines.map((l, i) => String(i + 1).padStart(2, ' ') + '  ' + esc(l)).join('\n') + '</code></pre>';
const code = (lines) => '<pre><code>' + esc(lines.join('\n')) + '</code></pre>';
const tbl = (head, rows) => `<div class="table-wrap"><table><thead><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>` +
  rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('') + '</tbody></table></div>';
const sheet = (label, html) => `<div class="callout ok"><strong>📝 ${label}</strong></div>\n${html}`;
const IMG = 'https://media.cuongthai.com/images/exam-questions/SWT301/PE23';
const anh = (q, h, en, vi) => `<div class="anh-slide"><img src="${IMG}/${q}.png" alt="SWT301 PE23 (SU26 Paper 1) — paper, ${en}" loading="lazy" width="1600" height="${h}" />` +
  `<p class="chu-thich">📄 <strong>PE23 · SU26 Paper 1</strong> — ${en} · ${vi}</p></div>`;
const LINK = (slug, t) => `<a href="/courses/software-testing/learn?lessonSlug=${slug}">${t}</a>`;

/* Mốc từng phần trong video ghép (mo-ta-chuong.txt của bản -tron). */
const MOC = [
  ['0:00', 'Part 1 — reading the paper, template, rubric, timing', 'Phần 1 — đọc đề, template, rubric, chia giờ'],
  ['10:33', 'Part 2 — Q1 review calcFee: 11 issues, compiled and run', 'Phần 2 — câu 1 review calcFee: 11 lỗi, biên dịch và chạy thật'],
  ['19:56', 'Part 3 — Q2 checkWithdrawal: 7 minimum tests + MC/DC, real JaCoCo', 'Phần 3 — câu 2 checkWithdrawal: 7 test tối thiểu + MC/DC, JaCoCo thật'],
  ['28:47', 'Part 4 — Q3 Interbank Transfer: validation, decision table, BVA', 'Phần 4 — câu 3 Interbank Transfer: hợp lệ, bảng quyết định, giá trị biên'],
];

const Q1_GOC = [
  'public class TransferFeeCalculator {',
  '    public static double calcFee(double amount, String type, boolean isVip) {',
  '        int fare = 0;',
  '        if (amount < 0) {',
  '            System.out.println("Invalid amount");',
  '        }',
  '        if (type == "INTERNAL") {',
  '            fare = 0;',
  '        } else if (type.equals("EXTERNAL")) {',
  '            if (amount <= 500) {',
  '                fare = amount * 0.02;',
  '            } else {',
  '                fare = amount * 0.001;',
  '            }',
  '        }',
  '        if (isVip = true) {',
  '            fare = fare * 50 / 100',
  '        }',
  '        return fare;',
  '    }',
  '',
  '    public static void main(String[] args) {',
  '        System.out.println(calcFee(1000, "EXTERNAL", false));',
  '    }',
  '}',
];
const Q1_SUA = [
  'public static double calcFee(double amount, String type, boolean isVip) {',
  '    if (amount <= 0) throw new IllegalArgumentException("Amount must be greater than 0");',
  '    if (type == null) throw new IllegalArgumentException("Transfer type is required");',
  '    double fee;',
  '    if ("INTERNAL".equals(type)) {',
  '        fee = 0;',
  '    } else if ("EXTERNAL".equals(type)) {',
  '        fee = amount < THRESHOLD ? amount * SMALL_RATE : amount * LARGE_RATE;   // 500, 0.002, 0.001',
  '    } else {',
  '        throw new IllegalArgumentException("Unknown transfer type: " + type);',
  '    }',
  '    if (isVip) {',
  '        fee = fee * VIP_DISCOUNT;   // 0.5',
  '    }',
  '    return fee;',
  '}',
];
const Q1_ISSUES = [
  ['[Compile error · High] fare is declared int but receives double results (lines 11, 13) → "possible lossy conversion from double to int"', '3', 'double fare = 0;'],
  ['[Compile error · High] Missing semicolon at the end of the statement → "\';\' expected"', '17', 'fare = fare * 50 / 100;'],
  ['[Boundary · Medium] amount &lt; 0 lets amount = 0 through; spec: amount must be greater than 0', '4', 'if (amount &lt;= 0)'],
  ['[Logic · High] Invalid amount is only printed — execution continues and a fee is returned (−100 → −1.0)', '4–6', 'throw new IllegalArgumentException("Amount must be greater than 0");'],
  ['[Logic · High] String compared with == (reference equality): a runtime "INTERNAL" never matches', '7', '"INTERNAL".equals(type)'],
  ['[Logic · Medium] type.equals(...) throws NullPointerException when type is null', '9', 'Check null first, or "EXTERNAL".equals(type)'],
  ['[Logic · Medium] No else branch: an unknown type (e.g. "ONLINE") silently returns fee 0', '7–15', 'else throw new IllegalArgumentException("Unknown transfer type");'],
  ['[Boundary · Medium] amount &lt;= 500 charges the small rate at exactly 500; spec: 500 or more → 0.1%', '10', 'if (amount &lt; 500)'],
  ['[Logic · High] Wrong rate 0.02 (= 2%); spec 0.2% = 0.002 → fee 10× too high', '11', 'fare = amount * 0.002;'],
  ['[Logic · High] isVip = true assigns instead of compares → always true, every customer gets 50% off', '16', 'if (isVip)'],
  ['[Coding practice · Low] Magic numbers (500, 0.02, 0.001, 50/100); console output in a calculation method; main has no expected value', '5, 10–17, 23', 'Named constants; no I/O in business logic; unit tests'],
];
const Q2_GOC = [
  'public static String checkWithdrawal(long amount, boolean isActive, boolean isForeign, int hour) {',
  '    if (amount <= 0 || amount % 50000 != 0) {',
  '        return "Invalid amount";',
  '    }',
  '    if (!isActive) {',
  '        return "Card is inactive";',
  '    }',
  '    boolean isNight = hour >= 22 || hour < 6;',
  '    if (isForeign && isNight) {',
  '        return "Rejected: foreign cards cannot withdraw at night";',
  '    }',
  '    if (isForeign) {',
  '        return "Success: foreign card fee applied";',
  '    }',
  '    if (isNight) {',
  '        return "Success: night withdrawal";',
  '    }',
  '    return "Success";',
  '}',
];
const Q2_UTC = [
  ['UTCID01', '0', 'true', 'false', '10', '"Invalid amount"', 'A'],
  ['UTCID02', '70000', 'true', 'false', '10', '"Invalid amount"', 'A'],
  ['UTCID03', '100000', 'false', 'false', '10', '"Card is inactive"', 'A'],
  ['UTCID04', '100000', 'true', 'true', '23', '"Rejected: foreign cards cannot withdraw at night"', 'N'],
  ['UTCID05', '100000', 'true', 'true', '10', '"Success: foreign card fee applied"', 'N'],
  ['UTCID06', '100000', 'true', 'false', '3', '"Success: night withdrawal"', 'N'],
  ['UTCID07', '100000', 'true', 'false', '10', '"Success"', 'N'],
];
const P = 'User is on the Interbank Transfer screen';
const proc = (a, t, c, o) => `1. Amount = ${a}<br>2. Transaction Type = ${t}<br>3. Customer Tier = ${c}<br>4. OTP = ${o}<br>5. Click Transfer`;
const Q3_A = [
  ['A01', 'Amount empty', '(empty)', 'Interbank', 'Standard', '123456', '"Amount is required."'],
  ['A02', 'Amount not a number', 'abc', 'Interbank', 'Standard', '123456', '"Amount must be a number &gt; 0."'],
  ['A03', 'Amount negative', '-5000', 'Interbank', 'Standard', '123456', '"Amount must be a number &gt; 0."'],
  ['A04', 'Amount = 0 (assumption 1)', '0', 'Interbank', 'Standard', '123456', '"Amount must be a number &gt; 0."'],
  ['A05', 'Transaction Type not selected', '1000000', '(not selected)', 'Standard', '123456', '"Transaction Type is required."'],
  ['A06', 'Customer Tier not selected', '1000000', 'Interbank', '(not selected)', '123456', '"Customer Tier is required."'],
  ['A07', 'OTP empty', '1000000', 'Interbank', 'Standard', '(empty)', '"OTP Code is required."'],
  ['A08', 'Wrong OTP', '1000000', 'Interbank', 'Standard', '654321', '"Invalid OTP."'],
  ['A09', 'OTP with 5 digits', '1000000', 'Interbank', 'Standard', '12345', '"Invalid OTP."'],
  ['A10', 'All fields empty — only the FIRST error', '(empty)', '(not selected)', '(not selected)', '(empty)', '"Amount is required."'],
];
const Q3_B = [
  ['B01', 'R5 — Interbank, Standard, 0.05% ≥ 2,000 (example row 1)', '10000000', 'Interbank', 'Standard', '"Transaction successful. Fee: 5,000 VND."'],
  ['B02', 'R6 — Interbank, Standard, 0.05% &lt; 2,000 → minimum (example row 2)', '3000000', 'Interbank', 'Standard', '"Transaction successful. Fee: 2,000 VND."'],
  ['B03', 'R4 — Interbank, VIP within limit (example row 3)', '200000000', 'Interbank', 'VIP', '"Transaction successful. Fee: 0 VND."'],
  ['B04', 'R3 — Internal, Standard (example row 4)', '50000000', 'Internal', 'Standard', '"Transaction successful. Fee: 0 VND."'],
  ['B05', 'R1 — Standard over limit (example row 5)', '150000000', 'Interbank', 'Standard', '"Transaction limit exceeded."'],
  ['B06', 'R3 — Internal, VIP (fee 0 for any tier)', '300000000', 'Internal', 'VIP', '"Transaction successful. Fee: 0 VND."'],
  ['B07', 'R1 — the limit also applies to Internal', '150000000', 'Internal', 'Standard', '"Transaction limit exceeded."'],
  ['B08', 'R2 — VIP over limit', '600000000', 'Interbank', 'VIP', '"Transaction limit exceeded."'],
];
const Q3_C = [
  ['C01', 'Smallest valid amount → minimum fee', '1', 'Standard', '"Transaction successful. Fee: 2,000 VND."'],
  ['C02', 'Just below the minimum-fee edge (0.05% = 1,999)', '3998000', 'Standard', '"Transaction successful. Fee: 2,000 VND."'],
  ['C03', 'On the edge (0.05% = 2,000)', '4000000', 'Standard', '"Transaction successful. Fee: 2,000 VND."'],
  ['C04', 'Just above the edge (0.05% = 2,001)', '4002000', 'Standard', '"Transaction successful. Fee: 2,001 VND."'],
  ['C05', 'Standard limit, exactly 100,000,000', '100000000', 'Standard', '"Transaction successful. Fee: 50,000 VND."'],
  ['C06', 'Standard limit + 1', '100000001', 'Standard', '"Transaction limit exceeded."'],
  ['C07', 'VIP limit, exactly 500,000,000', '500000000', 'VIP', '"Transaction successful. Fee: 0 VND."'],
  ['C08', 'VIP limit + 1', '500000001', 'VIP', '"Transaction limit exceeded."'],
];

const PE23 = {
  title: 'PE-6 — SU26 Paper 1 (PE23) · full walkthrough: calcFee review · checkWithdrawal MC/DC · Interbank Transfer black-box|||PE-6 — Chữa trọn đề SU26 Paper 1 (PE23): review calcFee · MC/DC checkWithdrawal · hộp đen Interbank Transfer',
  slug: 'swt301-pe23-su26-chua-tron-de',
  type: 'VIDEO',
  description: `Chữa trọn đề PE23 (SU26 Paper 1, 85 phút, 3+3+4 điểm) trong một video dài 4 phần có mốc: ${MOC.map(([t, , v]) => `${t} ${v}`).join(' · ')}. Mã câu 1 và câu 2 là mã luyện tập viết theo đặc tả (bản đề nguồn không đọc được ảnh code); mọi kết quả chạy thật.`,
  content: [
    bi(`<span class="eyebrow">Practical Exam · Lesson PE-6 · SU26 Paper 1 · one long video, 4 parts</span>
<h2>SU26 Paper 1 (PE23) — the whole paper in one video</h2>
<p class="lead">85 minutes, three questions: Q1 (3 pts) review <code>calcFee</code>, Q2 (3 pts) the minimum unit tests for <code>checkWithdrawal</code> with <strong>MC/DC</strong>, Q3 (4 pts) black-box tests for <strong>Interbank Transfer</strong>. Same layout as PE24 (Paper 2) of the same term.</p>
<h3>Chapters in the video</h3>
<ul>${MOC.map(([t, e]) => `<li><b>${t}</b> — ${e}</li>`).join('')}</ul>
<div class="callout">⚠️ <strong>About the code in Q1 and Q2.</strong> The only copy of this paper (a FUOverflow transcription, "Đề 1-SP26") does not contain a legible code screenshot — it only says the image was "too low to transcribe the individual code lines verbatim". The two listings below are <strong>practice code written by this site strictly from the specification</strong>. The one real clue is kept: the answer template's blue sample row for Q1 ("int fare declared — wrong type · Line 3 · Change to double fare = 0;") and its Q2 note ("minimum 7 TCs"). In the exam, review the code you are given.</div>`,
    `<span class="eyebrow">Thi thực hành · Bài PE-6 · SU26 Paper 1 · một video dài, 4 phần</span>
<h2>SU26 Paper 1 (PE23) — chữa trọn đề trong một video</h2>
<p class="lead">85 phút, ba câu: câu 1 (3đ) review <code>calcFee</code>, câu 2 (3đ) số test tối thiểu cho <code>checkWithdrawal</code> kèm <strong>MC/DC</strong>, câu 3 (4đ) test hộp đen chức năng <strong>Interbank Transfer</strong>. Khuôn giống đề PE24 (Paper 2) cùng kỳ.</p>
<h3>Các mốc trong video</h3>
<ul>${MOC.map(([t, , v]) => `<li><b>${t}</b> — ${v}</li>`).join('')}</ul>
<div class="callout">⚠️ <strong>Về mã ở câu 1 và câu 2.</strong> Bản đề duy nhất có trong tay (bản FUOverflow chép lại, "Đề 1-SP26") không có ảnh code đọc được — chỉ ghi ảnh "quá mờ, không chép được từng dòng". Hai đoạn mã dưới đây là <strong>mã luyện tập do website viết theo đúng đặc tả</strong>. Manh mối thật duy nhất được giữ: dòng mẫu xanh của template ở Q1 ("int fare declared — wrong type · Line 3 · Change to double fare = 0;") và ghi chú Q2 ("Tối thiểu 7 TCs"). Đi thi, bạn review đúng đoạn mã được phát.</div>`),
    bi(`<h3>Part 1 — reading the paper</h3>
<ul>
<li>Everything goes into <code>SWT301_SU26_Template.xlsx</code>, in English, matching this paper; unrelated keywords ⇒ 0 for that answer, no template ⇒ 0 for the exam. The blue sample text in the template happens to describe <em>this</em> paper — use the idea, but rewrite it in black.</li>
<li><strong>Trap words:</strong> "greater than 0" (0 is rejected) · "less than 500 / 500 or more" (500 belongs to the 0.1% band) · 0.2% = 0.002 · "before 06:00" (hour &lt; 6, so night = 22–23 and 0–5) · "in order" (only the first error is shown).</li>
<li>Q1 asks for a <strong>severity</strong>, but the Q1 sheet has no Severity column ⇒ write <code>[type · severity]</code> at the start of Description.</li>
<li>Time plan: 0–5 read + template · 5–25 Q1 · 25–50 Q2 · 50–80 Q3 · 80–85 check.</li>
</ul>`,
    `<h3>Phần 1 — đọc đề</h3>
<ul>
<li>Mọi câu trả lời viết vào <code>SWT301_SU26_Template.xlsx</code>, bằng tiếng Anh, bám đúng đề; từ khoá lạc đề ⇒ câu đó 0 điểm, không dùng template ⇒ cả bài 0. Chữ mẫu xanh trong template lại nói đúng về <em>đề này</em> — được dùng ý, nhưng viết lại bằng chữ đen.</li>
<li><strong>Chữ bẫy:</strong> "greater than 0" (0 bị từ chối) · "less than 500 / 500 or more" (đúng 500 thuộc mức 0,1%) · 0,2% = 0.002 · "before 06:00" (hour &lt; 6, đêm = 22–23 và 0–5) · "in order" (chỉ hiện lỗi đầu tiên).</li>
<li>Câu 1 đòi <strong>mức độ</strong>, nhưng sheet Q1 không có cột Severity ⇒ ghi <code>[loại · mức]</code> ở đầu Description.</li>
<li>Chia giờ: 0–5 đọc đề + template · 5–25 câu 1 · 25–50 câu 2 · 50–80 câu 3 · 80–85 soát.</li>
</ul>`),
    anh('q1', 1080, 'Question 1', 'câu 1'),
    bi('<h3>Part 2 — Q1: review calcFee (practice listing, 25 lines)</h3>', '<h3>Phần 2 — câu 1: review calcFee (mã luyện tập, 25 dòng)</h3>'),
    numbered(Q1_GOC),
    bi(`<p><strong>Real runs (JDK 21).</strong> <code>javac</code> first reports only <em>"TransferFeeCalculator.java:17: error: ';' expected"</em> — javac stops at the syntax error. Add the <code>;</code> and it reports lines 11 and 13: <em>"incompatible types: possible lossy conversion from double to int"</em> — the cause is <code>int fare</code> on line 3. After both fixes: <code>main</code> prints <code>0.5</code> (spec 1.0 — <code>isVip = true</code> is an assignment, always true) · 500 ⇒ <code>5.0</code> (spec 0.5: <code>&lt;= 500</code> + rate 0.02) · 400 ⇒ <code>4.0</code> (spec 0.8) · 0 ⇒ <code>0.0</code> (should be rejected) · −100 ⇒ prints "Invalid amount" and returns <code>-1.0</code> · type null ⇒ <code>NullPointerException</code> · "ONLINE" ⇒ <code>0.0</code>. A runtime <code>new String("INTERNAL")</code> also gives 0.0 — only by luck, because the "no type matched" path returns 0 too.</p>`,
      `<p><strong>Chạy thật (JDK 21).</strong> Lần đầu <code>javac</code> chỉ báo <em>"TransferFeeCalculator.java:17: error: ';' expected"</em> — javac dừng ở lỗi cú pháp. Thêm <code>;</code> thì báo tiếp dòng 11 và 13: <em>"incompatible types: possible lossy conversion from double to int"</em> — nguyên nhân là <code>int fare</code> ở dòng 3. Sửa xong hai lỗi: <code>main</code> in <code>0.5</code> (đặc tả 1.0 — <code>isVip = true</code> là phép gán, luôn đúng) · 500 ⇒ <code>5.0</code> (đặc tả 0.5: <code>&lt;= 500</code> + tỉ lệ 0.02) · 400 ⇒ <code>4.0</code> (đặc tả 0.8) · 0 ⇒ <code>0.0</code> (lẽ ra bị từ chối) · −100 ⇒ in "Invalid amount" rồi trả <code>-1.0</code> · type null ⇒ <code>NullPointerException</code> · "ONLINE" ⇒ <code>0.0</code>. Chuỗi tạo lúc chạy <code>new String("INTERNAL")</code> cũng ra 0.0 — chỉ là may, vì nhánh "không khớp loại nào" cũng trả 0.</p>`),
    sheet('Sheet Q1 — 11 issues, ordered by line · Sheet Q1 — 11 lỗi, xếp theo số dòng', tbl(['Issue No', 'Description', 'Line', 'Fix Suggestion'], Q1_ISSUES.map((r, i) => [String(i + 1), ...r]))),
    bi('<p>The fix, checked by running it (<code>javac -Xlint:all</code>: 0 warnings) — 400 ⇒ 0.8 · 500 ⇒ 0.5 · 1000 ⇒ 1.0 · VIP ⇒ 0.5 · INTERNAL ⇒ 0.0 · amount 0 / type null / "ONLINE" ⇒ <code>IllegalArgumentException</code>:</p>',
      '<p>Bản sửa, có chạy kiểm (<code>javac -Xlint:all</code>: 0 cảnh báo) — 400 ⇒ 0.8 · 500 ⇒ 0.5 · 1000 ⇒ 1.0 · VIP ⇒ 0.5 · INTERNAL ⇒ 0.0 · amount 0 / type null / "ONLINE" ⇒ <code>IllegalArgumentException</code>:</p>'),
    code(Q1_SUA),
    anh('q2', 440, 'Question 2', 'câu 2'),
    bi('<h3>Part 3 — Q2: checkWithdrawal (practice listing, 19 lines)</h3>', '<h3>Phần 3 — câu 2: checkWithdrawal (mã luyện tập, 19 dòng)</h3>'),
    numbered(Q2_GOC),
    bi(`<p><strong>Three compound conditions:</strong> line 2 <code>A || B</code> (amount ≤ 0, not a multiple of 50,000) · line 8 <code>C || D</code> (hour ≥ 22, hour &lt; 6) · line 9 <code>E &amp;&amp; F</code> (foreign, night). Statement + decision alone needs 6 tests; MC/DC needs <strong>7</strong> — both minimums confirmed by an exhaustive search over all inputs. 3 Abnormal (amount 0, amount 70,000, inactive card) + 4 Normal (one per remaining result). 3 ÷ 7 ≈ 0.43 point per test; an extra test −0.1.</p>
<p><strong>MC/DC independence pairs:</strong> A: 01↔03 · B: 02↔03 · C: 04↔05 · D: 06↔07 · E: 04↔06 (in 06, F is not evaluated — short-circuit) · F: 04↔05.</p>`,
      `<p><strong>Ba điều kiện ghép:</strong> dòng 2 <code>A || B</code> (amount ≤ 0, không chia hết 50.000) · dòng 8 <code>C || D</code> (hour ≥ 22, hour &lt; 6) · dòng 9 <code>E &amp;&amp; F</code> (thẻ nước ngoài, giờ đêm). Chỉ statement + decision cần 6 test; thêm MC/DC cần <strong>7</strong> — cả hai con số tối thiểu đều đã kiểm bằng vét cạn mọi đầu vào. 3 ca Abnormal (amount 0, amount 70.000, thẻ không hoạt động) + 4 ca Normal (mỗi kết quả còn lại một ca). 3 ÷ 7 ≈ 0,43 điểm mỗi test; thừa một test −0,1.</p>
<p><strong>Cặp độc lập MC/DC:</strong> A: 01↔03 · B: 02↔03 · C: 04↔05 · D: 06↔07 · E: 04↔06 (ở 06, F không được tính — tắt mạch) · F: 04↔05.</p>`),
    sheet('Sheet Q2 — UTCID grid (Function: checkWithdrawal · Lines of code: 19) · Lưới UTCID', tbl(['UTCID', 'amount', 'isActive', 'isForeign', 'hour', 'Return', 'Type'], Q2_UTC)),
    bi(`<p><strong>Real run</strong> (Maven, JUnit 5.12.2, JaCoCo 0.8.13, JDK 21): <code>Tests run: 7, Failures: 0</code> · JaCoCo <code>checkWithdrawal</code>: instructions 42/42, branches <strong>18/18</strong>, lines 12/12 (lines 2 and 8: 4/4 branches each). A 6-test set that reaches statement + decision coverage also passes, but JaCoCo shows <strong>16/18</strong> branches: on line 2 the "not a multiple" condition never became true, on line 8 <code>hour &gt;= 22</code> never did — exactly what MC/DC adds. All 7 tests pass because the practice code follows the spec (no defect).</p>`,
      `<p><strong>Chạy thật</strong> (Maven, JUnit 5.12.2, JaCoCo 0.8.13, JDK 21): <code>Tests run: 7, Failures: 0</code> · JaCoCo <code>checkWithdrawal</code>: lệnh 42/42, nhánh <strong>18/18</strong>, dòng 12/12 (dòng 2 và 8 mỗi dòng 4/4 nhánh). Bộ 6 test chỉ đạt statement + decision cũng xanh, nhưng JaCoCo báo <strong>16/18</strong> nhánh: dòng 2 vế "không chia hết" chưa từng đúng, dòng 8 <code>hour &gt;= 22</code> chưa từng đúng — đúng phần MC/DC đòi thêm. Cả 7 test Passed vì mã luyện tập viết đúng đặc tả (không có defect).</p>`),
    anh('q3', 1734, 'Question 3', 'câu 3'),
    bi(`<h3>Part 4 — Q3: Interbank Transfer (black-box)</h3>
<p><strong>Assumptions</strong> (the paper invites them): (1) step 1 says "&lt; 0" but the field rule and the message say "&gt; 0" ⇒ 0 is also rejected; (2) validation stops at the first failing step; (3) the tier limit (step 5) applies to Internal transfers too; (4) fees are shown with thousand separators. Every expected output below comes from a reference implementation of the spec, which reproduces all 5 rows of the paper's example table. Pre-condition of every case: <em>${P}</em>; procedure: enter the four fields, then click Transfer.</p>`,
      `<h3>Phần 4 — câu 3: Interbank Transfer (hộp đen)</h3>
<p><strong>Giả định</strong> (đề mời ghi): (1) bước 1 ghi "&lt; 0" nhưng luật của ô và câu báo nói "&gt; 0" ⇒ 0 cũng bị từ chối; (2) kiểm tuần tự, dừng ở bước sai đầu tiên; (3) hạn mức (bước 5) áp cả cho chuyển Internal; (4) phí in có dấu phẩy ngăn hàng nghìn. Mọi kết quả mong đợi dưới đây chạy qua một cài đặt tham chiếu theo đặc tả, tái tạo đủ 5 dòng bảng ví dụ của đề. Pre-condition mọi ca: <em>${P}</em>; procedure: nhập bốn ô rồi bấm Transfer.</p>`),
    sheet('A — Validation (1.0) · Phần A — kiểm tra hợp lệ', tbl(['ID', 'Description', 'Procedure', 'Expected Output'], Q3_A.map(([id, d, a, t, c, o, e]) => [id, d, proc(a, t, c, o), e]))),
    bi(`<p><strong>B — reduced decision table (2.0).</strong> Conditions: tier · amount ≤ tier limit · type · 0.05% × amount ≥ 2,000. Rules: R1 Standard over limit ⇒ "Transaction limit exceeded." · R2 VIP over limit ⇒ same · R3 within limit + Internal ⇒ fee 0 (any tier) · R4 VIP + Interbank ⇒ fee 0 · R5 Standard + Interbank + 0.05% ≥ 2,000 ⇒ fee 0.05% · R6 Standard + Interbank + 0.05% &lt; 2,000 ⇒ fee 2,000. B01–B05 are the paper's example rows; B06–B08 are where the marks are.</p>`,
      `<p><strong>B — bảng quyết định rút gọn (2đ).</strong> Điều kiện: hạng · số tiền ≤ hạn mức · loại · 0,05% × số tiền ≥ 2.000. Luật: R1 Standard vượt hạn mức ⇒ "Transaction limit exceeded." · R2 VIP vượt hạn mức ⇒ như trên · R3 trong hạn mức + Internal ⇒ phí 0 (mọi hạng) · R4 VIP + Interbank ⇒ phí 0 · R5 Standard + Interbank + 0,05% ≥ 2.000 ⇒ phí 0,05% · R6 Standard + Interbank + 0,05% &lt; 2.000 ⇒ phí 2.000. B01–B05 là các dòng bảng ví dụ của đề; B06–B08 là chỗ ăn điểm.</p>`),
    sheet('B — Business logic / decision table (2.0) · Phần B', tbl(['ID', 'Rule', 'Amount · Type · Tier (OTP 123456)', 'Expected Output'], Q3_B.map(([id, d, a, t, c, e]) => [id, d, `${a} · ${t} · ${c}`, e]))),
    sheet('C — Boundary values (1.0) · Phần C — giá trị biên (Interbank, OTP 123456)', tbl(['ID', 'Description', 'Amount · Tier', 'Expected Output'], Q3_C.map(([id, d, a, c, e]) => [id, d, `${a} · ${c}`, e]))),
    bi(`<div class="callout">The minimum-fee edge is <strong>4,000,000</strong> (2,000 ÷ 0.0005) — the example's 3,000,000 is not a boundary. The limit check (step 5) comes <strong>before</strong> the fee, so Internal 150,000,000 Standard is "Transaction limit exceeded.". Practise the whole paper timed in the <a href="/exam?course=SWT301">Exam room</a> → SWT301 → <strong>"Practical Exam Đề 23 (SU26 - Paper 1)"</strong>.</div>
<p>Background: ${LINK('swt301-lab1-pe-question1', 'Lab 1.10 — from Lab 1 to PE question 1')} · ${LINK('swt301-ch5-slides-2023', '5.3 — MC/DC')} · ${LINK('swt301-whitebox-coverage', '5.1 — statement & decision coverage')} · ${LINK('swt301-blackbox-decision-state', '4.4 — decision tables')} · ${LINK('swt301-blackbox-bva-template', '4.3 — BVA')}.</p>`,
      `<div class="callout">Mốc phí tối thiểu là <strong>4.000.000</strong> (2.000 ÷ 0,0005) — 3.000.000 trong bảng ví dụ không phải biên. Kiểm hạn mức (bước 5) đứng <strong>trước</strong> tính phí, nên Internal 150.000.000 hạng Standard là "Transaction limit exceeded.". Làm lại cả đề có bấm giờ trong <a href="/exam?course=SWT301">Phòng thi</a> → SWT301 → <strong>"Đề thi thực hành số 23 (SU26 - Paper 1)"</strong>.</div>
<p>Nền tảng: ${LINK('swt301-lab1-pe-question1', 'Lab 1.10 — từ Lab 1 tới câu 1 đề PE')} · ${LINK('swt301-ch5-slides-2023', '5.3 — MC/DC')} · ${LINK('swt301-whitebox-coverage', '5.1 — phủ câu lệnh & quyết định')} · ${LINK('swt301-blackbox-decision-state', '4.4 — bảng quyết định')} · ${LINK('swt301-blackbox-bva-template', '4.3 — BVA')}.</p>`),
  ].join('\n'),
};

export default PE23;
