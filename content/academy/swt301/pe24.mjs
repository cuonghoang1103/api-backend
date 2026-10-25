/**
 * SWT301 · Practical Exam — PE24 (SU26 Paper 2), the newest PE paper, solved in a 4-part VIDEO series (25/10/2026).
 * Exam room: content/exams/SWT301-PE24.mjs ("SWT301 — Practical Exam Đề 24 (SU26 - Paper 2)"), 85 minutes on paper (the room gives 90).
 * One lesson per video part; each slug = slugWeb of the part in ~/Documents/video-bai-giang/src/bai/swt-pe24-{0..3}/kichban.ts,
 * video attached via content/course-videos/software-testing.mjs (track VI/R2).
 * Original question images (cropped, FUO logo removed): media.cuongthai.com/images/exam-questions/SWT301/PE24/q1|q2|q3.png.
 * Everything below matches the video: Q1 compiled + run (JDK 21), Q2 JUnit 5 + JaCoCo 0.8.13 + exhaustive search of all inputs,
 * Q3 expected outputs from a reference implementation of the spec that reproduces all 7 rows of the paper's example table.
 * The Q1/Q2 code on the paper is a tiny, very blurry screenshot — the listings are transcriptions and say so.
 */
import { bi } from './_slides.mjs';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const numbered = (lines) => '<pre><code>' + lines.map((l, i) => String(i + 1).padStart(2, ' ') + '  ' + esc(l)).join('\n') + '</code></pre>';
const code = (lines) => '<pre><code>' + esc(lines.join('\n')) + '</code></pre>';
const tbl = (head, rows) => `<div class="table-wrap"><table><thead><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>` +
  rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('') + '</tbody></table></div>';
const sheet = (label, html) => `<div class="callout ok"><strong>📝 ${label}</strong></div>\n${html}`;
const IMG = 'https://media.cuongthai.com/images/exam-questions/SWT301/PE24';
const anh = (q, h, en, vi) => `<div class="anh-slide"><img src="${IMG}/${q}.png" alt="SWT301 PE24 (SU26 Paper 2) — original paper, ${en}" loading="lazy" width="1160" height="${h}" />` +
  `<p class="chu-thich">📄 <strong>PE24 · SU26 Paper 2</strong> — ${en} · ${vi}</p></div>`;
const LINK = (slug, t) => `<a href="/courses/software-testing/learn?lessonSlug=${slug}">${t}</a>`;
const PHONG = (en) => en
  ? '<div class="callout">🧪 <strong>Practise it timed:</strong> <a href="/exam?course=SWT301">Exam room</a> → SWT301 → <strong>"Practical Exam Đề 24 (SU26 - Paper 2)"</strong>. Download the answer template there, set a timer to 85 minutes and only compare with this lesson afterwards.</div>'
  : '<div class="callout">🧪 <strong>Luyện có bấm giờ:</strong> <a href="/exam?course=SWT301">Phòng thi</a> → SWT301 → <strong>"Đề thi thực hành số 24 (SU26 - Paper 2)"</strong>. Tải template trả lời ở đó, bấm giờ 85 phút, làm xong mới so với bài này.</div>';
const SERIES = (k, en) => {
  const parts = [
    ['swt301-pe24-su26-0-doc-de', 'Part 0 — reading the paper', 'Tập 0 — đọc đề'],
    ['swt301-pe24-su26-1-review-cartcalculator', 'Part 1 — Q1 review', 'Tập 1 — câu 1 review'],
    ['swt301-pe24-su26-2-mcdc-calcbaggagefee', 'Part 2 — Q2 MC/DC', 'Tập 2 — câu 2 MC/DC'],
    ['swt301-pe24-su26-3-ticket-refund-black-box', 'Part 3 — Q3 black-box', 'Tập 3 — câu 3 black-box'],
  ];
  return `<p class="chu-thich">🎬 ${en ? 'Video series' : 'Loạt video'}: ${parts.map(([s, e, v], i) => (i === k ? `<strong>${en ? e : v}</strong>` : LINK(s, en ? e : v))).join(' · ')}</p>`;
};

/* ─────────────── code as transcribed (line numbers = the paper's) ─────────────── */
const Q1_GOC = [
  'public class CartCalculator {',
  '    public static double calcTotal(double[] prices, int[] qty, double discountPercent) {',
  '            double total = 0;',
  '            for (int i = 0; i <= prices.length; i++) {',
  '                total += prices[i] * qty[i];',
  '            }',
  '            if (discountPercent > 0 & discountPercent < 100);',
  '            {',
  '                total = total - total * discountPercent;',
  '            }',
  '            double shipping = total > 500000 ? 0 : 25000;',
  '            return total + shipping;',
  '    }',
  '    public static void main(String[] args) {',
  '            double[] p = {100000, 200000};',
  '            int[] q = {2, 1, 3};',
  '            System.out.println(calcTotal(p, q, 110));',
  '    }',
  '}',
];
const Q1_SUA = [
  'public class CartCalculator {',
  '    private static final double FREE_SHIPPING_THRESHOLD = 500_000;',
  '    private static final double SHIPPING_FEE = 25_000;',
  '',
  '    public static double calcTotal(double[] prices, int[] qty, double discountPercent) {',
  '        if (prices == null || qty == null) throw new IllegalArgumentException("prices/qty must not be null");',
  '        if (prices.length != qty.length) throw new IllegalArgumentException("prices and qty must have the same length");',
  '        double total = 0;',
  '        for (int i = 0; i < prices.length; i++) {',
  '            if (prices[i] < 0 || qty[i] < 0) throw new IllegalArgumentException("values must be non-negative");',
  '            total += prices[i] * qty[i];',
  '        }',
  '        if (discountPercent > 0 && discountPercent < 100) {',
  '            total = total - total * discountPercent / 100;',
  '        }',
  '        double shipping = total >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;',
  '        return total + shipping;',
  '    }',
  '}',
];
const Q2_GOC = [
  'public static String calcBaggageFee(int weightKg, boolean isBusiness, boolean isSkyMember) {',
  '    if (weightKg <= 0 || weightKg > 40)',
  '        return "Invalid Weight";',
  '    int allowance = isBusiness ? 30 : 20;',
  '    if (isSkyMember)',
  '        allowance += 5;',
  '    if (weightKg <= allowance)',
  '        return "No Fee";',
  '    int excess = weightKg - allowance;',
  '    if (excess <= 10)',
  '        return "Fee: " + (excess * 12) + " USD";',
  '    return "Fee: " + (excess * 15) + " USD";',
  '}',
];
const Q2_TEST = [
  'class BaggageTest {',
  '    @Test void utcid01() { assertEquals("Invalid Weight", Baggage.calcBaggageFee(0, false, false)); }',
  '    @Test void utcid02() { assertEquals("Invalid Weight", Baggage.calcBaggageFee(41, false, false)); }',
  '    @Test void utcid03() { assertEquals("No Fee", Baggage.calcBaggageFee(25, true, false)); }',
  '    @Test void utcid04() { assertEquals("Fee: 60 USD", Baggage.calcBaggageFee(30, false, true)); }',
  '    @Test void utcid05() { assertEquals("Fee: 195 USD", Baggage.calcBaggageFee(35, false, false)); }',
  '}',
];
const Q1_ISSUES = [
  ['[Logic · High] Off-by-one: loop uses i &lt;= prices.length, reads prices[prices.length] → ArrayIndexOutOfBoundsException on every call', '4', 'Use i &lt; prices.length'],
  ['[Logic · High] Stray ";" after if: the if controls an empty statement, so lines 8–10 always run (discount applied even when invalid, e.g. 110)', '7', 'Remove ";" → if (...) { ... }'],
  ['[Logic · High] Percentage used as a fraction: total * discountPercent (missing / 100) → negative total', '9', 'total = total - total * discountPercent / 100;'],
  ['[Boundary · Medium] total &gt; 500000 charges shipping at exactly 500,000; spec: 500,000 or more is free', '11', 'Use total &gt;= 500000'],
  ['[Validation · Medium] No null check for prices / qty (spec: must not be null) → NullPointerException', '2–4', 'if (prices == null || qty == null) throw new IllegalArgumentException(...)'],
  ['[Validation · Medium] No same-length check: a longer qty is silently ignored, a shorter one crashes', '2–5', 'if (prices.length != qty.length) throw new IllegalArgumentException(...)'],
  ['[Validation · Medium] No non-negative check of prices / quantities (spec: non-negative values)', '5', 'Reject prices[i] &lt; 0 || qty[i] &lt; 0'],
  ['[Coding practice · Low] Single "&amp;" (non-short-circuit) in a boolean condition', '7', 'Use &amp;&amp;'],
  ['[Coding practice · Low] Magic numbers 500000 / 25000; double used for money', '11', 'Named constants; long / BigDecimal for VND'],
  ['[Test data · Low] Data in main breaks the spec (qty has 3 items, discount 110); no expected value', '15–17', 'Valid data, e.g. {2, 1}, 10 → expected 385,000'],
  ['[Convention · Low] Inconsistent indentation of the method bodies', '3–17', 'Re-format with 4-space indentation'],
];

/* ═════════════════════════ PE-5.0 — reading the paper ═════════════════════════ */
const P0 = {
  title: 'PE-5.0 — SU26 Paper 2 (PE24) · Part 0: reading the original paper, template, rubric, timing|||PE-5.0 — Đề SU26 Paper 2 (PE24) · Tập 0: đọc đề trên ảnh gốc, template, rubric, chia giờ',
  slug: 'swt301-pe24-su26-0-doc-de',
  type: 'DOCUMENT',
  description: 'Đề PE mới nhất (SU26 Paper 2, 85 phút, 3+3+4 điểm): đọc từng câu trên ảnh đề gốc, dịch, từ vựng, chữ bẫy; template SU26 ba sheet; rubric; chia 85 phút. Video tập 0/3.',
  content: [
    bi(`<span class="eyebrow">Practical Exam · Lesson PE-5.0 · newest paper · video part 0 of 3</span>
<h2>SU26 Paper 2 (PE24) — read the paper before you solve it</h2>
<p class="lead">The newest SWT301 practical paper: <strong>85 minutes</strong>, three questions — Q1 (3 pts) review the class <code>CartCalculator</code>, Q2 (3 pts) the minimum unit tests for <code>calcBaggageFee</code> including <strong>MC/DC</strong>, Q3 (4 pts) black-box tests for <strong>Ticket Refund Request</strong>. Same layout as PE23 of the same term. This part does not solve anything yet: it reads every question on the original image, translates it, lists the key terms, points at the trap words, then walks through the template, the rubric and a time plan.</p>
${SERIES(0, true)}`,
    `<span class="eyebrow">Thi thực hành · Bài PE-5.0 · đề mới nhất · video tập 0/3</span>
<h2>SU26 Paper 2 (PE24) — đọc kỹ đề trước khi giải</h2>
<p class="lead">Đề thi thực hành SWT301 mới nhất: <strong>85 phút</strong>, ba câu — câu 1 (3đ) review lớp <code>CartCalculator</code>, câu 2 (3đ) số test tối thiểu cho <code>calcBaggageFee</code> kèm <strong>MC/DC</strong>, câu 3 (4đ) test hộp đen chức năng <strong>Ticket Refund Request</strong> (hoàn tiền vé máy bay). Khuôn giống đề PE23 cùng kỳ. Tập này chưa giải: đọc từng câu trên chính ảnh đề gốc, dịch, ghi từ vựng, chỉ chữ bẫy, rồi xem template, rubric và chia giờ.</p>
${SERIES(0, false)}`),
    anh('q1', 1140, 'page 1: instructions + Question 1', 'trang 1: hướng dẫn + câu 1'),
    bi(`<h3>Instructions — the zero-mark rules</h3>
<ul>
<li>No IDE (NetBeans, IntelliJ…) and no other software during the exam.</li>
<li>Every answer goes into the <strong>provided template</strong>, in English, and must <strong>reflect this exam paper</strong>. Any keyword not related to this paper ⇒ that answer gets <strong>ZERO</strong>; not using the template ⇒ the whole exam gets ZERO.</li>
<li><strong>Trap:</strong> the template already contains blue sample rows from <em>another</em> paper. Forget to delete them and you have submitted "keywords not related".</li>
</ul>
<h3>Question 1 — what the paper says</h3>
<p>Review the class and find <strong>at least 8 issues</strong> (older papers asked for 6). Spec of <code>calcTotal</code>: (1) the two arrays must not be null, must have the same length and contain non-negative values; (2) <code>discountPercent</code> is a percentage in the <strong>open</strong> interval (0, 100), and when valid the total is reduced by that percentage; (3) shipping is free for totals of <strong>500,000 VND or more</strong>, otherwise 25,000 VND.</p>
<p>📝 <em>non-negative</em> = ≥ 0 · <em>or more</em> = ≥ · <em>reduced by</em> = minus. Trap words: "or more" ⇒ <code>&gt;=</code>; "(0, 100)" excludes 0 and 100; "percentage" ⇒ divide by 100. The code on the paper is a tiny blurry screenshot — the structure and line numbers are certain, a few characters are read from the blur.</p>`,
      `<h3>Instructions — luật điểm không</h3>
<ul>
<li>Không dùng IDE (NetBeans, IntelliJ…) và không dùng phần mềm nào khác.</li>
<li>Mọi câu trả lời viết vào <strong>file template được phát</strong>, bằng tiếng Anh, <strong>bám đúng đề này</strong>. Có từ khoá lạc đề ⇒ câu đó <strong>0 điểm</strong>; không dùng template ⇒ cả bài 0 điểm.</li>
<li><strong>Bẫy:</strong> template có sẵn dòng mẫu chữ xanh của <em>đề khác</em>. Quên xoá là nộp luôn từ khoá lạc đề.</li>
</ul>
<h3>Câu 1 — đề nói gì</h3>
<p>Review lớp và tìm <strong>ít nhất 8 lỗi</strong> (đề cũ chỉ đòi 6). Đặc tả <code>calcTotal</code>: (1) hai mảng đơn giá, số lượng không được null, cùng độ dài, chỉ chứa giá trị không âm; (2) <code>discountPercent</code> là phần trăm trong khoảng <strong>mở</strong> (0, 100), hợp lệ thì tổng giảm đúng phần trăm đó; (3) miễn phí giao hàng khi tổng <strong>từ 500.000đ trở lên</strong>, ngược lại phí 25.000đ.</p>
<p>📝 <em>non-negative</em> = không âm (≥ 0) · <em>or more</em> = trở lên (≥) · <em>reduced by</em> = giảm đi. Chữ bẫy: "or more" ⇒ <code>&gt;=</code>; "(0, 100)" không lấy 0 và 100; "percentage" ⇒ phải chia 100. Code trong đề là ảnh chụp nhỏ rất mờ — cấu trúc và số dòng chắc chắn, vài ký tự đọc từ ảnh mờ.</p>`),
    anh('q2', 625, 'Question 2', 'câu 2'),
    bi(`<h3>Question 2 — what the paper says</h3>
<p>Design the <strong>minimum</strong> number of test cases for 100% statement coverage, 100% decision coverage <strong>and MC/DC</strong> of the compound conditions. <code>calcBaggageFee(weightKg, isBusiness, isSkyMember)</code>: valid weight 1–40 kg; free allowance Business 30 kg, Economy 20 kg, SkyMember +5 kg; the first 10 excess kg cost 12 USD/kg, the excess <em>beyond that</em> 15 USD/kg.</p>
<p>📝 <em>minimum</em> = tối thiểu · <em>compound condition</em> = A || B · <em>allowance</em> = free limit · <em>excess</em> = the part above it. Traps: extra tests lose marks; MC/DC buys exactly one extra test here; and line 12 of the code (as transcribed) multiplies <em>all</em> the excess by 15 — not the tiered price of the spec (solved in part 2).</p>`,
      `<h3>Câu 2 — đề nói gì</h3>
<p>Thiết kế số test case <strong>tối thiểu</strong> để đạt 100% phủ câu lệnh, 100% phủ quyết định <strong>và MC/DC</strong> cho điều kiện ghép. <code>calcBaggageFee(weightKg, isBusiness, isSkyMember)</code>: cân nặng hợp lệ 1–40 kg; hạn mức miễn cước Business 30 kg, Economy 20 kg, hội viên SkyMember +5 kg; 10 kg vượt đầu tiên 12 USD/kg, phần vượt <em>sau đó</em> 15 USD/kg.</p>
<p>📝 <em>minimum</em> = tối thiểu · <em>compound condition</em> = điều kiện ghép (A || B) · <em>allowance</em> = hạn mức · <em>excess</em> = phần vượt. Bẫy: test thừa bị trừ điểm; MC/DC đòi thêm đúng một test; và dòng 12 của code (như chép được) nhân <em>cả</em> phần vượt với 15 — lệch giá bậc thang của đặc tả (xử lý ở tập 2).</p>`),
    anh('q3', 2820, 'Question 3 (form, 7 steps, calculation example)', 'câu 3 (form, 7 bước, bảng ví dụ)'),
    bi(`<h3>Question 3 — what the paper says</h3>
<p>Black-box test the <strong>Ticket Refund Request</strong> screen: Booking Code (valid: VN0001, VN0002, VN0003), Ticket Price (&gt; 0), Fare Class, Hours Before Departure (≥ 0), Cancellation Insurance — all required — and a <em>Request Refund</em> button. The system runs 7 steps <strong>sequentially</strong>: steps 1–5 validate one field each with an exact message; step 6 computes the refund — with insurance: price − 100,000, <strong>minimum 0</strong>, <em>regardless of</em> class and time; without insurance: Economy ≥ 72 h 70%, 24 to &lt; 72 h 50%, &lt; 24 h 0%; Business 90% / 70% / 30%.</p>
<p>📝 <em>refund</em> = hoàn tiền · <em>fare class</em> = hạng vé · <em>sequentially</em> = one after another · <em>regardless of</em> = bất kể. Four traps: (1) the example table has no row for Business, 24 to &lt; 72 h; (2) "minimum 0" — a price under 100,000 refunds 0, never a negative amount; (3) sequential ⇒ several wrong fields show only the first message; (4) the screen says "Hours Before Departure", the messages say "Cancellation Time" — the paper invites assumptions, so state that they are the same field.</p>`,
      `<h3>Câu 3 — đề nói gì</h3>
<p>Test hộp đen màn hình <strong>Ticket Refund Request</strong>: mã đặt chỗ (hợp lệ: VN0001, VN0002, VN0003), giá vé (&gt; 0), hạng vé, số giờ trước giờ bay (≥ 0), bảo hiểm huỷ vé — ô nào cũng bắt buộc — và nút <em>Request Refund</em>. Hệ thống chạy <strong>tuần tự</strong> 7 bước: bước 1–5 kiểm từng ô, mỗi lỗi một câu thông báo nguyên văn; bước 6 tính tiền — có bảo hiểm: giá vé − 100.000, <strong>thấp nhất là 0</strong>, <em>bất kể</em> hạng vé và thời gian; không bảo hiểm: Economy ≥ 72 giờ 70%, 24 đến &lt; 72 giờ 50%, &lt; 24 giờ 0%; Business 90% / 70% / 30%.</p>
<p>📝 <em>refund</em> = hoàn tiền · <em>fare class</em> = hạng vé · <em>sequentially</em> = tuần tự · <em>regardless of</em> = bất kể. Bốn bẫy: (1) bảng ví dụ thiếu ca Business, 24 đến &lt; 72 giờ; (2) "minimum 0" — giá vé dưới 100.000 hoàn 0đ, không phải số âm; (3) tuần tự ⇒ nhiều ô sai chỉ hiện lỗi đầu tiên; (4) màn hình gọi "Hours Before Departure", câu báo lỗi gọi "Cancellation Time" — đề mời ghi giả định, nên ghi rõ đó là một ô.</p>`),
    bi(`<h3>The SU26 template (three sheets)</h3>
${tbl(['Sheet', 'Layout', 'Watch out'], [
      ['Q1', 'Issue No · Description · Line · Fix Suggestion (no Severity column)', 'Delete the blue sample row "int fare declared — wrong type"; put type + severity at the start of Description'],
      ['Q2', 'UTCID grid (like Lab 2) + a Vietnamese "grading convention": 3 pts ÷ minimum number of TCs per test; −0.1 per missing field, −0.1 per extra TC', '"Tối thiểu 7 TCs" belongs to the sample function checkWithdrawal, not to this paper'],
      ['Q3', 'Table 3.3 Test case, three bands: A validation (1.0) · B business logic (2.0, "build a reduced decision table") · C boundary values (1.0)', 'Module Code sample "Interbank Transfer" ⇒ change to "Ticket Refund Request"; grey cells must not be edited'],
    ])}
<h3>Rubric (Exam room — a simulation, not the official key)</h3>
<ul>
<li><strong>Q1:</strong> 1.5 for 8 valid issues with the right line · 1.0 for the severe ones · 0.5 for concrete fixes; calling the single <code>&amp;</code> a compile error loses marks.</li>
<li><strong>Q2:</strong> 1.0 for the right minimum number with a reason · 1.5 for a complete UTCID grid with expected values from the spec · 0.5 for the MC/DC pairs. Five tests ⇒ 0.6 pts each.</li>
<li><strong>Q3:</strong> A 1.0 · B 2.0 · C 1.0 — the bands printed in the template.</li>
</ul>
<h3>Time plan for 85 minutes</h3>
${tbl(['Minutes', 'Do'], [['0–5', 'Skim the paper, open the template, delete every blue sample'], ['5–25', 'Q1'], ['25–50', 'Q2'], ['50–80', 'Q3 — most points; band A is just copying messages exactly, do it fast'], ['80–85', 'Check line numbers and messages, save the file']])}`,
      `<h3>Template SU26 (ba sheet)</h3>
${tbl(['Sheet', 'Bố cục', 'Cần để ý'], [
      ['Q1', 'Issue No · Description · Line · Fix Suggestion (không có cột Severity)', 'Xoá dòng mẫu chữ xanh "int fare declared — wrong type"; ghi loại + mức độ ở đầu cột Description'],
      ['Q2', 'Lưới UTCID (như Lab 2) + "Quy ước chấm điểm" tiếng Việt: 3 điểm ÷ số TC tối thiểu = điểm mỗi test; thiếu trường −0,1, thừa TC −0,1', 'Dòng "Tối thiểu 7 TCs" là của hàm mẫu checkWithdrawal, không phải đề này'],
      ['Q3', 'Table 3.3 Test case, ba dải: A kiểm tra hợp lệ (1.0) · B logic nghiệp vụ (2.0, "Cần lập bảng quyết định rút gọn") · C giá trị biên (1.0)', 'Module Code mẫu "Interbank Transfer" ⇒ đổi thành "Ticket Refund Request"; ô xám không được sửa'],
    ])}
<h3>Rubric (Phòng thi — mô phỏng, không phải đáp án chính thức)</h3>
<ul>
<li><strong>Câu 1:</strong> 1,5 cho 8 lỗi hợp lệ đúng số dòng · 1 cho các lỗi nghiêm trọng · 0,5 cho cách sửa cụ thể; gọi dấu <code>&amp;</code> đơn là lỗi biên dịch thì bị trừ.</li>
<li><strong>Câu 2:</strong> 1 cho đúng số test tối thiểu kèm lý do · 1,5 cho lưới UTCID đầy đủ, kỳ vọng theo đặc tả · 0,5 cho cặp MC/DC. Năm test ⇒ mỗi test 0,6 điểm.</li>
<li><strong>Câu 3:</strong> A 1 · B 2 · C 1 — đúng khung điểm in sẵn trong template.</li>
</ul>
<h3>Chia 85 phút</h3>
${tbl(['Phút', 'Làm gì'], [['0–5', 'Đọc lướt cả đề, mở template, xoá hết chữ mẫu xanh'], ['5–25', 'Câu 1'], ['25–50', 'Câu 2'], ['50–80', 'Câu 3 — nhiều điểm nhất; phần A chỉ là chép đúng câu thông báo, làm thật nhanh'], ['80–85', 'Soát số dòng, soát câu thông báo, lưu file']])}`),
    bi(`<h3>Self-check</h3>
<ol>
<li>"or more" in Q1 means which operator? — <strong>&gt;=</strong>.</li>
<li>Why does MC/DC add one test? — in <code>weightKg &lt;= 0 || weightKg &gt; 40</code> each side must flip the outcome on its own ⇒ you need both a ≤ 0 case and a &gt; 40 case.</li>
<li>Which rule does Q3's example table leave out? — no insurance · Business · 24 to &lt; 72 h ⇒ 70%.</li>
</ol>
${PHONG(true)}
<p>Background: ${LINK('swt301-pe-how-it-works', 'PE-0 — how the PE works')} · ${LINK('swt301-ch5-slides-2023', '5.3 — MC/DC')} · ${LINK('swt301-blackbox-decision-state', '4.4 — decision tables')}.</p>`,
      `<h3>Tự kiểm</h3>
<ol>
<li>"or more" trong câu 1 là dấu gì? — <strong>&gt;=</strong> (lớn hơn hoặc bằng).</li>
<li>Vì sao MC/DC làm số test tăng thêm một? — với <code>weightKg &lt;= 0 || weightKg &gt; 40</code>, mỗi vế phải một mình đổi được kết quả ⇒ cần cả ca ≤ 0 lẫn ca &gt; 40.</li>
<li>Bảng ví dụ câu 3 bỏ sót ca nào? — không bảo hiểm · Business · 24 đến dưới 72 giờ ⇒ 70%.</li>
</ol>
${PHONG(false)}
<p>Nền tảng: ${LINK('swt301-pe-how-it-works', 'PE-0 — PE vận hành thế nào')} · ${LINK('swt301-ch5-slides-2023', '5.3 — MC/DC')} · ${LINK('swt301-blackbox-decision-state', '4.4 — bảng quyết định')}.</p>`),
  ].join('\n'),
};

/* ═════════════════════════ PE-5.1 — Q1 review CartCalculator ═════════════════════════ */
const P1 = {
  title: 'PE-5.1 — SU26 Paper 2 (PE24) · Part 1: Q1 reviewing CartCalculator — 11 issues, run for real|||PE-5.1 — Đề SU26 Paper 2 (PE24) · Tập 1: câu 1 review CartCalculator — 11 lỗi, chạy thật',
  slug: 'swt301-pe24-su26-1-review-cartcalculator',
  type: 'DOCUMENT',
  description: 'Câu 1 đề PE24 (3đ, ≥ 8 lỗi): 4 bước review (biên dịch, chạy tay, đối chiếu đặc tả, quy ước), 11 lỗi đúng số dòng của đề, bằng chứng javac/java chạy thật, bản sửa đã chạy, rubric và 3 lỗi mất điểm. Video tập 1/3.',
  content: [
    bi(`<span class="eyebrow">Practical Exam · Lesson PE-5.1 · PE24 Question 1 (3 pts) · video part 1 of 3</span>
<h2>Q1 — review CartCalculator, at least 8 issues</h2>
<p class="lead">Four steps in 20 minutes: <strong>compile in your head → run main by hand → check every spec rule → check coding conventions</strong>. The paper asks for 8; aim for 10–11 so that one rejected issue does not cost you the mark. Every result below was produced by compiling and running the transcription (JDK 21).</p>
${SERIES(1, true)}`,
      `<span class="eyebrow">Thi thực hành · Bài PE-5.1 · câu 1 đề PE24 (3đ) · video tập 1/3</span>
<h2>Câu 1 — review CartCalculator, ít nhất 8 lỗi</h2>
<p class="lead">Bốn bước trong 20 phút: <strong>biên dịch trong đầu → chạy tay hàm main → đối chiếu từng luật đặc tả → soát quy ước viết code</strong>. Đề đòi 8, nhắm 10–11 để lỡ người chấm không nhận một lỗi vẫn đủ. Mọi kết quả dưới đây là biên dịch và chạy thật bản chép (JDK 21).</p>
${SERIES(1, false)}`),
    anh('q1', 1140, 'Question 1', 'câu 1'),
    bi(`<h3>The code (transcribed from the blurry screenshot — line numbers match the paper)</h3>
<p>⚠️ Structure and line numbers are certain; characters such as <code>&lt;=</code> on line 4, <code>&amp;</code> and <code>;</code> on line 7 and the numbers in <code>main</code> are read from a blurry image. In the exam, review exactly the code you see.</p>`,
      `<h3>Mã nguồn (chép lại từ ảnh mờ — số dòng khớp đề)</h3>
<p>⚠️ Cấu trúc và số dòng chắc chắn; các ký tự như <code>&lt;=</code> dòng 4, <code>&amp;</code> và <code>;</code> dòng 7, các con số trong <code>main</code> là đọc từ ảnh mờ. Đi thi, bạn review đúng đoạn code bạn thấy.</p>`),
    numbered(Q1_GOC),
    bi(`<h3>Steps 1–3 with real runs</h3>
<ol>
<li><strong>Compile.</strong> Single <code>&amp;</code> and a <code>;</code> right after <code>if (...)</code> are both legal Java. <code>javac -Xlint:all</code> ⇒ compiles, one warning: <em>"CartCalculator.java:7: warning: [empty] empty statement after if"</em>. So <strong>do not</strong> report <code>&amp;</code> as a compile error — <code>&amp;</code> on booleans is a non-short-circuit AND.</li>
<li><strong>Run main.</strong> <code>ArrayIndexOutOfBoundsException: Index 2 out of bounds for length 2 at calcTotal(CartCalculator.java:5)</code>. Cause: the loop condition on <strong>line 4</strong> (<code>i &lt;= prices.length</code>) — report line 4 (cause), not line 5 (where it blows up).</li>
<li><strong>Spec, after fixing only line 4:</strong> discount 110 ⇒ <code>-4.3575E7</code> (the <code>;</code> on line 7 makes the block 8–10 run always); discount 10 ⇒ <code>-3575000.0</code> (= 400,000 − 400,000 × 10 + 25,000: line 9 forgets <code>/ 100</code>); total exactly 500,000 ⇒ <code>525000.0</code> (line 11 uses <code>&gt;</code>, spec says "or more"); qty <code>{2,1,3}</code> ⇒ <code>425000.0</code> (third quantity silently ignored); price −100,000 ⇒ <code>-75000.0</code>; prices <code>null</code> ⇒ <code>NullPointerException</code>.</li>
</ol>`,
      `<h3>Bước 1–3, có chạy thật</h3>
<ol>
<li><strong>Biên dịch.</strong> Dấu <code>&amp;</code> đơn và dấu <code>;</code> ngay sau <code>if (...)</code> đều hợp lệ trong Java. <code>javac -Xlint:all</code> ⇒ biên dịch được, đúng một cảnh báo: <em>"CartCalculator.java:7: warning: [empty] empty statement after if"</em>. Vậy <strong>đừng</strong> ghi <code>&amp;</code> là lỗi biên dịch — <code>&amp;</code> giữa hai boolean là phép AND không tắt mạch.</li>
<li><strong>Chạy main.</strong> <code>ArrayIndexOutOfBoundsException: Index 2 out of bounds for length 2 at calcTotal(CartCalculator.java:5)</code>. Nguyên nhân: điều kiện vòng lặp ở <strong>dòng 4</strong> (<code>i &lt;= prices.length</code>) — ghi dòng 4 (nguyên nhân), không phải dòng 5 (chỗ nổ).</li>
<li><strong>Đặc tả, sau khi chỉ sửa dòng 4:</strong> giảm 110 ⇒ <code>-4.3575E7</code> (dấu <code>;</code> dòng 7 làm khối 8–10 luôn chạy); giảm 10 ⇒ <code>-3575000.0</code> (= 400.000 − 400.000 × 10 + 25.000: dòng 9 quên <code>/ 100</code>); tổng đúng 500.000 ⇒ <code>525000.0</code> (dòng 11 dùng <code>&gt;</code>, đặc tả nói "trở lên"); qty <code>{2,1,3}</code> ⇒ <code>425000.0</code> (số lượng thứ ba bị bỏ qua im lặng); đơn giá −100.000 ⇒ <code>-75000.0</code>; prices <code>null</code> ⇒ <code>NullPointerException</code>.</li>
</ol>`),
    sheet('Answer sheet — Q1 template (delete the blue sample row first) · Bài làm mẫu sheet Q1 (xoá dòng mẫu xanh trước)', tbl(['Issue No', 'Description', 'Line', 'Fix Suggestion'], Q1_ISSUES.map((r, i) => [String(i + 1), ...r]))),
    bi(`<p>4 severe logic issues (lines 4, 7, 9, 11) + 3 missing input checks + 4 convention issues = 11, each with <strong>one</strong> cause — no issue repeated in other words. The template prints 9 rows: insert two more.</p>
<h3>The fix, checked by running it</h3>`,
      `<p>4 lỗi logic nặng (dòng 4, 7, 9, 11) + 3 lỗi thiếu kiểm đầu vào + 4 lỗi quy ước = 11, mỗi lỗi <strong>một</strong> nguyên nhân — không lỗi nào lặp lại bằng lời khác. Template in sẵn 9 dòng: chèn thêm hai.</p>
<h3>Bản sửa, có chạy kiểm</h3>`),
    code(Q1_SUA),
    bi(`<p>Same data, fixed class (<code>-Xlint:all</code>: 0 warnings): discount 110 ignored ⇒ <code>425000.0</code> · discount 10 ⇒ <code>385000.0</code> · exactly 500,000 ⇒ <code>500000.0</code> (free shipping) · null / different length / negative ⇒ <code>IllegalArgumentException</code> ×3. There is no computer in the exam — the run is only there so you can trust the fixes and learn to trace code by hand.</p>
<h3>Three ways to lose Q1 marks</h3>
<ol>
<li>Calling the single <code>&amp;</code> a compile error.</li>
<li>Writing the consequence instead of the cause ("program crashes"), or line 5 instead of line 4.</li>
<li>Leaving the blue sample row, or a class name from another paper ⇒ "keywords not related", Q1 can drop to 0.</li>
</ol>
${PHONG(true)}
<p>Background: ${LINK('swt301-lab1-pe-question1', 'Lab 1.10 — from Lab 1 to PE question 1')} · ${LINK('swt301-static-analysis', '3.4 — static analysis')}.</p>`,
      `<p>Cùng dữ liệu, lớp đã sửa (<code>-Xlint:all</code>: 0 cảnh báo): giảm 110 bị bỏ qua ⇒ <code>425000.0</code> · giảm 10 ⇒ <code>385000.0</code> · đúng 500.000 ⇒ <code>500000.0</code> (miễn ship) · null / khác độ dài / số âm ⇒ <code>IllegalArgumentException</code> ×3. Trong phòng thi không có máy để chạy — lần chạy này chỉ để bạn tin cách sửa và nhớ cách tự lần theo code bằng tay.</p>
<h3>Ba lỗi mất điểm câu 1</h3>
<ol>
<li>Ghi dấu <code>&amp;</code> đơn là lỗi biên dịch.</li>
<li>Ghi hậu quả thay cho nguyên nhân ("chương trình crash"), hoặc ghi dòng 5 thay cho dòng 4.</li>
<li>Để lại dòng mẫu chữ xanh, hoặc chép tên lớp của đề khác ⇒ từ khoá lạc đề, câu 1 có thể về 0.</li>
</ol>
${PHONG(false)}
<p>Nền tảng: ${LINK('swt301-lab1-pe-question1', 'Lab 1.10 — từ Lab 1 tới câu 1 đề PE')} · ${LINK('swt301-static-analysis', '3.4 — phân tích tĩnh')}.</p>`),
  ].join('\n'),
};

/* ═════════════════════════ PE-5.2 — Q2 MC/DC calcBaggageFee ═════════════════════════ */
const P2 = {
  title: 'PE-5.2 — SU26 Paper 2 (PE24) · Part 2: Q2 minimum tests + MC/DC (calcBaggageFee)|||PE-5.2 — Đề SU26 Paper 2 (PE24) · Tập 2: câu 2 test tối thiểu + MC/DC (calcBaggageFee)',
  slug: 'swt301-pe24-su26-2-mcdc-calcbaggagefee',
  type: 'DOCUMENT',
  description: 'Câu 2 đề PE24 (3đ): liệt kê quyết định, 4 test cho statement + decision, +1 test cho MC/DC của weightKg <= 0 || weightKg > 40 ⇒ tối thiểu 5; lưới UTCID điền đúng template; JUnit + JaCoCo chạy thật (12/12 nhánh), vét cạn chứng minh 5 là tối thiểu. Video tập 2/3.',
  content: [
    bi(`<span class="eyebrow">Practical Exam · Lesson PE-5.2 · PE24 Question 2 (3 pts) · video part 2 of 3</span>
<h2>Q2 — the minimum test set for statement + decision + MC/DC</h2>
<p class="lead">Answer: <strong>5 tests</strong> — 4 cover every statement and every decision outcome, MC/DC of the compound condition on line 2 buys exactly one more. Proven three ways in the video: by reasoning, by JaCoCo on real JUnit runs, and by an exhaustive search of all inputs.</p>
${SERIES(2, true)}`,
      `<span class="eyebrow">Thi thực hành · Bài PE-5.2 · câu 2 đề PE24 (3đ) · video tập 2/3</span>
<h2>Câu 2 — bộ test tối thiểu cho statement + decision + MC/DC</h2>
<p class="lead">Đáp án: <strong>5 test</strong> — 4 test phủ mọi câu lệnh và mọi nhánh quyết định, MC/DC của điều kiện ghép dòng 2 đòi thêm đúng một test. Video chứng minh ba cách: lập luận, JaCoCo trên JUnit chạy thật, và vét cạn mọi đầu vào.</p>
${SERIES(2, false)}`),
    anh('q2', 625, 'Question 2', 'câu 2'),
    bi('<h3>The code (13 lines, transcribed — the constants 12 and 15 on lines 11–12 are read from the blurry image)</h3>', '<h3>Mã nguồn (13 dòng, chép lại — hai hằng 12 và 15 ở dòng 11–12 đọc từ ảnh mờ)</h3>'),
    numbered(Q2_GOC),
    bi(`<h3>Decisions and returns</h3>
<ul>
<li>Line 2: compound decision <code>A || B</code> — A = <code>weightKg &lt;= 0</code>, B = <code>weightKg &gt; 40</code>.</li>
<li>Line 4: ternary on <code>isBusiness</code> (also a decision) · line 5: <code>isSkyMember</code> · line 7: <code>weightKg &lt;= allowance</code> · line 10: <code>excess &lt;= 10</code>.</li>
<li>Four returns: line 3 Invalid, line 8 No Fee, line 11 tier 1, line 12 tier 2 ⇒ <strong>statement coverage needs ≥ 4 tests</strong>.</li>
</ul>
<h3>From 4 to 5 tests</h3>
<p><strong>Statement + decision:</strong> weight 0 · 25 kg Business · 30 kg Economy + member · 35 kg Economy — every decision gets both true and false, so 4 is enough. <strong>MC/DC</strong> of <code>A || B</code>: A's pair is (T,F)→T vs (F,F)→F, B's pair is (F,T)→T vs the same (F,F)→F ⇒ three combinations: one weight ≤ 0, one weight &gt; 40, one valid weight (A and B both true is impossible). The 4 tests have no weight &gt; 40 ⇒ add <strong>41 kg</strong>: total <strong>5</strong>. Short-circuit: with weight 0, A is true and Java never evaluates B — write B as "not evaluated", that is fine.</p>
<p><strong>Choosing values:</strong> the large-excess test must be <strong>Economy</strong> — Business allowance 30, max weight 40, so Business can exceed by at most 10. Expected values come from the <strong>spec</strong>: 30 kg Economy + member ⇒ excess 5 ⇒ 5 × 12 = <strong>60 USD</strong>; 35 kg Economy ⇒ excess 15 ⇒ 10 × 12 + 5 × 15 = <strong>195 USD</strong>. The code (as transcribed) computes 15 × 15 = 225 ⇒ that test is <strong>Failed</strong> and you log a defect on line 12. If your paper's code computes the tiers correctly, it passes — either way the expected column says 195; never copy the code's number into it.</p>`,
      `<h3>Quyết định và câu return</h3>
<ul>
<li>Dòng 2: quyết định ghép <code>A || B</code> — A = <code>weightKg &lt;= 0</code>, B = <code>weightKg &gt; 40</code>.</li>
<li>Dòng 4: toán tử ba ngôi theo <code>isBusiness</code> (cũng là quyết định) · dòng 5: <code>isSkyMember</code> · dòng 7: <code>weightKg &lt;= allowance</code> · dòng 10: <code>excess &lt;= 10</code>.</li>
<li>Bốn return: dòng 3 Invalid, dòng 8 No Fee, dòng 11 bậc 1, dòng 12 bậc 2 ⇒ <strong>phủ câu lệnh cần ít nhất 4 test</strong>.</li>
</ul>
<h3>Từ 4 lên 5 test</h3>
<p><strong>Statement + decision:</strong> cân nặng 0 · 25 kg Business · 30 kg Economy có hội viên · 35 kg Economy — mọi quyết định đều có đúng có sai, nên 4 là đủ. <strong>MC/DC</strong> của <code>A || B</code>: cặp cho A là (T,F)→T so với (F,F)→F, cặp cho B là (F,T)→T so với chính (F,F)→F ⇒ cần ba tổ hợp: một cân nặng ≤ 0, một cân nặng &gt; 40, một cân nặng hợp lệ (A và B cùng đúng là không thể). Bốn test trên chưa có ca &gt; 40 ⇒ thêm <strong>41 kg</strong>: tổng <strong>5</strong>. Tắt mạch: cân nặng 0 thì A đúng, Java không tính B — ghi B là "không xét", không sao.</p>
<p><strong>Chọn giá trị:</strong> test vượt lớn phải là <strong>Economy</strong> — hạn mức Business 30, tối đa 40, nên Business vượt nhiều nhất 10. Giá trị mong đợi lấy từ <strong>đặc tả</strong>: 30 kg Economy có hội viên ⇒ vượt 5 ⇒ 5 × 12 = <strong>60 USD</strong>; 35 kg Economy ⇒ vượt 15 ⇒ 10 × 12 + 5 × 15 = <strong>195 USD</strong>. Code (như chép) tính 15 × 15 = 225 ⇒ test đó <strong>Failed</strong>, ghi defect ở dòng 12. Nếu đề bạn nhận tính đúng bậc thang thì Passed — dù thế nào cột kỳ vọng vẫn là 195; đừng chép số của code vào kỳ vọng.</p>`),
    sheet('Answer sheet — Q2 template (calcBaggageFee, 13 LOC) · Bài làm mẫu sheet Q2', tbl(['', 'UTCID01', 'UTCID02', 'UTCID03', 'UTCID04', 'UTCID05'], [
      ['<strong>Input</strong> weightKg', '0 (≤ 0)', '41 (&gt; 40)', '25', '30', '35'],
      ['isBusiness', 'false', 'false', 'true', 'false', 'false'],
      ['isSkyMember', 'false', 'false', 'false', 'true', 'false'],
      ['<strong>Return</strong>', '"Invalid Weight"', '"Invalid Weight"', '"No Fee"', '"Fee: 60 USD"', '"Fee: 195 USD"'],
      ['Exception / Log message', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A'],
      ['Type (N/A/B)', 'A', 'A', 'N', 'N', 'N'],
      ['Passed/Failed', 'P', 'P', 'P', 'P', 'F'],
      ['Defect ID', '', '', '', '', 'BUG-01 (line 12)'],
    ])),
    bi(`<p>Test requirement: 100% statement + 100% decision + MC/DC of the condition on line 2. Passed 4 · Failed 1 · N/A/B = 3/2/0 · 5 test cases. Write the returned strings exactly, including "Fee:" and "USD".</p>
<h3>Checked by machine — JUnit 5 + JaCoCo 0.8.13 (code placed on the paper's line numbers)</h3>`,
      `<p>Test requirement: 100% statement + 100% decision + MC/DC cho điều kiện dòng 2. Passed 4 · Failed 1 · N/A/B = 3/2/0 · 5 test case. Ghi nguyên văn chuỗi trả về, kể cả "Fee:" và "USD".</p>
<h3>Kiểm bằng máy — JUnit 5 + JaCoCo 0.8.13 (code đặt đúng số dòng của đề)</h3>`),
    code(Q2_TEST),
    bi(`<ul>
<li>5 tests ⇒ <code>Tests run: 5, Failures: 1</code> — <code>utcid05: expected: &lt;Fee: 195 USD&gt; but was: &lt;Fee: 225 USD&gt;</code>, exactly as predicted.</li>
<li>JaCoCo: instructions 100%, <strong>branches 12/12</strong>, line 2 "All 4 branches covered". Drop UTCID02 (41 kg) ⇒ <strong>11/12</strong>, line 2 "1 of 4 branches missed" — B was never true.</li>
<li>Exhaustive search (weight −1…42 × 2 × 2, 17 coverage targets): no set of 1–4 tests is enough; 18 different sets of 5 are ⇒ <strong>5 really is the minimum</strong>.</li>
</ul>
<h3>Scoring and the usual mistakes</h3>
<p>3 pts ÷ 5 = <strong>0.6 per test</strong>; −0.1 per missing field; −0.1 per extra test (e.g. 1 kg and 40 kg "to test the boundaries" — boundaries belong to Q3). Typical losses: only 4 tests (MC/DC forgotten); trying to get a large excess with Business (impossible); copying 225 from the code into the expected column.</p>
${PHONG(true)}
<p>Background: ${LINK('swt301-ch5-slides-2023', '5.3 — MC/DC')} · ${LINK('swt301-cyclomatic-complexity', '5.2 — minimum test sets')} · ${LINK('swt301-whitebox-coverage', '5.1 — statement & decision coverage')}.</p>`,
      `<ul>
<li>5 test ⇒ <code>Tests run: 5, Failures: 1</code> — <code>utcid05: expected: &lt;Fee: 195 USD&gt; but was: &lt;Fee: 225 USD&gt;</code>, đúng như dự đoán.</li>
<li>JaCoCo: instructions 100%, <strong>nhánh 12/12</strong>, dòng 2 "All 4 branches covered". Bỏ UTCID02 (41 kg) ⇒ <strong>11/12</strong>, dòng 2 "1 of 4 branches missed" — vế B chưa bao giờ đúng.</li>
<li>Vét cạn (cân nặng −1…42 × 2 × 2, 17 mục tiêu phủ): không bộ 1–4 test nào đủ; có 18 bộ 5 test đủ ⇒ <strong>5 là tối thiểu thật sự</strong>.</li>
</ul>
<h3>Chấm điểm và lỗi hay gặp</h3>
<p>3 điểm ÷ 5 = <strong>0,6 điểm mỗi test</strong>; thiếu một trường −0,1; thừa mỗi test −0,1 (ví dụ thêm 1 kg và 40 kg "để thử biên" — thử biên là việc của câu 3). Hay mất điểm: chỉ làm 4 test (quên MC/DC); cố tìm phần vượt lớn bằng hạng Business (không thể); chép 225 của code vào cột kỳ vọng.</p>
${PHONG(false)}
<p>Nền tảng: ${LINK('swt301-ch5-slides-2023', '5.3 — MC/DC')} · ${LINK('swt301-cyclomatic-complexity', '5.2 — bộ test tối thiểu')} · ${LINK('swt301-whitebox-coverage', '5.1 — phủ câu lệnh & quyết định')}.</p>`),
  ].join('\n'),
};

/* ═════════════════════════ PE-5.3 — Q3 Ticket Refund black-box ═════════════════════════ */
const A_ROWS = [
  ['A01', 'Booking Code', '(empty)', '"Booking Code is required."'],
  ['A02', 'Booking Code', 'XXXX', '"Invalid Booking Code."'],
  ['A03', 'Ticket Price', '(empty)', '"Ticket Price is required."'],
  ['A04', 'Ticket Price', 'abc', '"Ticket Price must be a number &gt; 0."'],
  ['A05', 'Ticket Price', '0', '"Ticket Price must be a number &gt; 0."'],
  ['A06', 'Ticket Price', '-1000', '"Ticket Price must be a number &gt; 0."'],
  ['A07', 'Fare Class', '(not selected)', '"Fare Class is required."'],
  ['A08', 'Hours', '(empty)', '"Cancellation Time is required."'],
  ['A09', 'Hours', 'abc', '"Cancellation Time must be a number ≥ 0."'],
  ['A10', 'Hours', '-1', '"Cancellation Time must be a number ≥ 0."'],
  ['A11', 'Insurance', '(not selected)', '"Cancellation Insurance is required."'],
  ['A12', 'ALL 5 fields', '(empty)', '"Booking Code is required." (only this one)'],
];
const B_ROWS = [
  ['B01', 'R1 · insurance, price &gt; 100,000', 'VN0001 · 2,000,000 · Economy · 10 · Yes', 'Refund Amount: 1,900,000 VND.', 'example table'],
  ['B02', 'R3 · Economy ≥ 72 h', 'VN0001 · 2,000,000 · Economy · 80 · No', 'Refund Amount: 1,400,000 VND.', 'example table'],
  ['B03', 'R4 · Economy 24 – &lt; 72 h', 'VN0002 · 2,000,000 · Economy · 48 · No', 'Refund Amount: 1,000,000 VND.', 'example table'],
  ['B04', 'R5 · Economy &lt; 24 h', 'VN0002 · 2,000,000 · Economy · 10 · No', 'Refund Amount: 0 VND.', 'example table'],
  ['B05', 'R6 · Business ≥ 72 h', 'VN0003 · 5,000,000 · Business · 80 · No', 'Refund Amount: 4,500,000 VND.', 'example table'],
  ['B06', 'R7 · Business 24 – &lt; 72 h', 'VN0003 · 5,000,000 · Business · 48 · No', 'Refund Amount: 3,500,000 VND.', '<strong>missing from the example table</strong>'],
  ['B07', 'R8 · Business &lt; 24 h', 'VN0003 · 5,000,000 · Business · 10 · No', 'Refund Amount: 1,500,000 VND.', 'example table'],
  ['B08', 'R2 · insurance, price ≤ 100,000', 'VN0002 · 50,000 · Business · 100 · Yes', 'Refund Amount: 0 VND.', '<strong>"minimum 0"</strong>'],
];
const C_ROWS = [
  ['C01', 'Economy · No', '72', '2,000,000', '1,400,000 (70%)'], ['C02', 'Economy · No', '71.99', '2,000,000', '1,000,000 (50%)'],
  ['C03', 'Economy · No', '24', '2,000,000', '1,000,000 (50%)'], ['C04', 'Economy · No', '23.99', '2,000,000', '0 (0%)'],
  ['C05', 'Business · No', '72', '5,000,000', '4,500,000 (90%)'], ['C06', 'Business · No', '71.99', '5,000,000', '3,500,000 (70%)'],
  ['C07', 'Business · No', '24', '5,000,000', '3,500,000 (70%)'], ['C08', 'Business · No', '23.99', '5,000,000', '1,500,000 (30%)'],
  ['C09', 'Business · No', '0', '5,000,000', '1,500,000 (30%)'], ['C10', 'Economy · Yes', '10', '100,000', '0'],
  ['C11', 'Economy · Yes', '10', '100,001', '1'], ['C12', 'Economy · Yes', '10', '1', '0'],
];
const P3 = {
  title: 'PE-5.3 — SU26 Paper 2 (PE24) · Part 3: Q3 Ticket Refund — decision table & BVA|||PE-5.3 — Đề SU26 Paper 2 (PE24) · Tập 3: câu 3 Ticket Refund — bảng quyết định & BVA',
  slug: 'swt301-pe24-su26-3-ticket-refund-black-box',
  type: 'DOCUMENT',
  description: 'Câu 3 đề PE24 (4đ): 4 giả định, phần A 12 ca kiểm tra hợp lệ (câu báo nguyên văn, đúng thứ tự), phần B bảng quyết định rút gọn 8 luật (có luật bảng ví dụ bỏ sót + luật thấp nhất 0), phần C 12 ca biên; mọi kết quả chạy qua cài đặt tham chiếu khớp 7/7 dòng ví dụ của đề. Video tập 3/3.',
  content: [
    bi(`<span class="eyebrow">Practical Exam · Lesson PE-5.3 · PE24 Question 3 (4 pts) · video part 3 of 3</span>
<h2>Q3 — Ticket Refund Request: validation, decision table, boundaries</h2>
<p class="lead">The template already splits Q3 into three bands, and the solution follows them: <strong>A validation (1.0)</strong> · <strong>B business logic with a reduced decision table (2.0)</strong> · <strong>C boundary values (1.0)</strong>. 12 + 8 + 12 = 32 test cases. Every expected output was run through a reference implementation of the spec, which reproduces all 7 rows of the paper's example table.</p>
${SERIES(3, true)}`,
      `<span class="eyebrow">Thi thực hành · Bài PE-5.3 · câu 3 đề PE24 (4đ) · video tập 3/3</span>
<h2>Câu 3 — Ticket Refund Request: kiểm tra hợp lệ, bảng quyết định, giá trị biên</h2>
<p class="lead">Template chia sẵn câu 3 thành ba phần, và lời giải đi đúng ba phần đó: <strong>A kiểm tra hợp lệ (1đ)</strong> · <strong>B logic nghiệp vụ với bảng quyết định rút gọn (2đ)</strong> · <strong>C giá trị biên (1đ)</strong>. 12 + 8 + 12 = 32 test case. Mọi kết quả mong đợi đều chạy qua một cài đặt tham chiếu theo đặc tả, tái tạo đủ 7 dòng bảng ví dụ của đề.</p>
${SERIES(3, false)}`),
    anh('q3', 2820, 'Question 3', 'câu 3'),
    bi(`<h3>Four assumptions (write them at the top of the sheet — the paper's Notes invite it)</h3>
<ol>
<li>"Hours Before Departure" on the screen and "Cancellation Time" in the messages are the same field.</li>
<li>Hours accept decimals, so just below 72 is 71.99 (if the field only takes integers, use 71).</li>
<li>Validation runs sequentially and stops at the first failing step ⇒ only one message is shown.</li>
<li>Amounts are printed with thousand separators: "Refund Amount: 1,900,000 VND."</li>
</ol>
<h3>Band A — validation (1.0)</h3>
<p>Each test breaks exactly <strong>one</strong> field, keeps the others valid, and follows the order of steps 1–5. Copy every message word for word, including the final full stop.</p>`,
      `<h3>Bốn giả định (ghi ngay đầu sheet — dòng Notes của đề mời làm vậy)</h3>
<ol>
<li>Ô "Hours Before Departure" trên màn hình và cụm "Cancellation Time" trong câu báo là cùng một ô.</li>
<li>Số giờ nhập được số thập phân, nên ngay dưới 72 là 71.99 (nếu ô chỉ nhận số nguyên thì dùng 71).</li>
<li>Kiểm tuần tự, dừng ở bước sai đầu tiên ⇒ chỉ hiện một câu báo.</li>
<li>Số tiền in có dấu phẩy ngăn hàng nghìn: "Refund Amount: 1,900,000 VND."</li>
</ol>
<h3>Phần A — kiểm tra hợp lệ (1đ)</h3>
<p>Mỗi test chỉ làm sai <strong>một</strong> ô, các ô khác giữ hợp lệ, và đi đúng thứ tự bước 1–5. Chép nguyên văn từng câu báo, kể cả dấu chấm cuối câu.</p>`),
    sheet('Band A — 12 validation cases · Phần A — 12 ca', tbl(['ID', 'Field broken', 'Input', 'Expected output'], A_ROWS)),
    bi(`<h3>Band B — reduced decision table (2.0)</h3>
<p>Conditions: insurance (Y/N), fare class (Economy/Business), hours band (≥ 72 · 24 – &lt; 72 · &lt; 24). Full table: 2 × 2 × 3 = 12 columns. With insurance the paper says "regardless of class and time" ⇒ those 6 columns collapse into one (class and hours = "–"), which then splits on the "minimum 0" rule: price &gt; 100,000 ⇒ price − 100,000 (<strong>R1</strong>); price ≤ 100,000 ⇒ 0 (<strong>R2</strong>). Without insurance: 2 classes × 3 bands = <strong>R3–R8</strong> (Economy 70/50/0%, Business 90/70/30%). <strong>8 rules, one test each.</strong> Six come straight from the example table; the two it does not contain are where the marks are: <strong>R7</strong> (Business, 48 h, 5,000,000 ⇒ 3,500,000) and <strong>R2</strong> (insurance, 50,000 ⇒ 0, not a negative number).</p>`,
      `<h3>Phần B — bảng quyết định rút gọn (2đ)</h3>
<p>Điều kiện: bảo hiểm (Có/Không), hạng vé (Economy/Business), khoảng giờ (≥ 72 · 24 – &lt; 72 · &lt; 24). Bảng đầy đủ: 2 × 2 × 3 = 12 cột. Có bảo hiểm thì đề nói "bất kể hạng và thời gian" ⇒ 6 cột đó gộp thành một (hạng và giờ ghi "–"), rồi lại tách theo luật "thấp nhất là 0": giá &gt; 100.000 ⇒ giá − 100.000 (<strong>R1</strong>); giá ≤ 100.000 ⇒ 0 (<strong>R2</strong>). Không bảo hiểm: 2 hạng × 3 khoảng = <strong>R3–R8</strong> (Economy 70/50/0%, Business 90/70/30%). <strong>8 luật, mỗi luật một test.</strong> Sáu luật lấy luôn dữ liệu bảng ví dụ của đề; hai luật bảng ví dụ không có là chỗ ăn điểm: <strong>R7</strong> (Business, 48 giờ, 5.000.000 ⇒ 3.500.000) và <strong>R2</strong> (có bảo hiểm, 50.000 ⇒ 0, không phải số âm).</p>`),
    sheet('Band B — one test per rule · Phần B — mỗi luật một test', tbl(['ID', 'Rule', 'Code · Price · Class · Hours · Insurance', 'Expected output', 'Source'], B_ROWS)),
    bi(`<h3>Band C — boundary values (1.0)</h3>
<p>The boundaries are the 72 h and 24 h marks, for <strong>both</strong> classes (each class has its own rates): take the mark itself and the value just below. Add hours = 0 (smallest valid value), and the "minimum 0" boundary with insurance: 100,000 ⇒ 0, 100,001 ⇒ 1, price 1 ⇒ 0. Validation boundaries (price 0, hours −1) are already in band A — do not repeat them.</p>`,
      `<h3>Phần C — giá trị biên (1đ)</h3>
<p>Biên nằm ở mốc 72 giờ và 24 giờ, cho <strong>cả hai</strong> hạng vé (mỗi hạng một tỉ lệ riêng): lấy đúng giá trị mốc và giá trị ngay dưới. Thêm số giờ = 0 (giá trị hợp lệ nhỏ nhất), và biên của luật "thấp nhất là 0" khi có bảo hiểm: 100.000 ⇒ 0, 100.001 ⇒ 1, giá 1 ⇒ 0. Biên của kiểm tra hợp lệ (giá 0, giờ −1) đã nằm ở phần A — không lặp lại.</p>`),
    sheet('Band C — 12 boundary cases · Phần C — 12 ca biên', tbl(['ID', 'Class · Insurance', 'Hours', 'Price', 'Refund (VND)'], C_ROWS)),
    bi(`<h3>Filling Table 3.3</h3>
<p>Module Code: <strong>Ticket Refund Request</strong>. Pre-condition: the user is on the Ticket Refund Request screen. Procedure: one line per field — all five, valid ones included — then "Click Request Refund". Expected output: the exact message or amount. The template only has 6 / 6 / 5 empty rows for A / B / C: insert rows, never put two cases in one cell.</p>
<h3>Rubric and the usual mistakes</h3>
<p>A 1.0 for all five fields' messages, exact and in order · B 2.0 for all 8 rules with correct amounts · C 1.0 for 72/24 on both classes, hours 0 and the 100,000 boundary. Typical losses: missing R7 because you only copied the example table; expecting several messages for a case with several wrong fields; writing "an error message is shown" instead of the exact message.</p>
${PHONG(true)}
<p>Background: ${LINK('swt301-blackbox-decision-state', '4.4 — decision tables')} · ${LINK('swt301-blackbox-bva-template', '4.3 — BVA & the PE condition template')} · ${LINK('swt301-blackbox-ep-bva', '4.2 — equivalence partitioning')}.</p>`,
      `<h3>Điền Table 3.3</h3>
<p>Module Code: <strong>Ticket Refund Request</strong>. Pre-condition: người dùng đang ở màn hình Ticket Refund Request. Procedure: mỗi ô một dòng — đủ cả năm ô, kể cả ô hợp lệ — rồi "Click Request Refund". Expected output: chép nguyên văn câu báo hoặc số tiền. Template chỉ có sẵn 6 / 6 / 5 dòng trống cho A / B / C: chèn thêm dòng, đừng dồn hai ca vào một ô.</p>
<h3>Rubric và lỗi hay gặp</h3>
<p>A 1đ cho đủ câu báo của năm ô, nguyên văn, đúng thứ tự · B 2đ cho đủ 8 luật tính đúng tiền · C 1đ cho biên 72/24 ở cả hai hạng, giờ 0 và biên 100.000. Hay mất điểm: bỏ sót R7 vì chỉ chép bảng ví dụ; ca nhiều ô sai lại mong nhiều câu báo; ghi chung chung "hiện thông báo lỗi" thay vì chép nguyên văn.</p>
${PHONG(false)}
<p>Nền tảng: ${LINK('swt301-blackbox-decision-state', '4.4 — bảng quyết định')} · ${LINK('swt301-blackbox-bva-template', '4.3 — BVA & template điều kiện của PE')} · ${LINK('swt301-blackbox-ep-bva', '4.2 — phân vùng tương đương')}.</p>`),
  ].join('\n'),
};

export default [P0, P1, P2, P3];
