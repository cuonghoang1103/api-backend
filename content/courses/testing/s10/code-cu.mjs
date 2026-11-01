/**
 * Testing · Chương 10 · 10.2 — Thêm test cho code cũ chưa có test. Slug giữ từ khung: tst-10-2-code-cu.
 * Code/output ở ./_ma.mjs (sinh bằng scripts/tst/sinh-ma.mjs, Node 22.23.3 + Vitest 5.0.5, chạy thật 01/11/2026):
 * module "LabFlow v0" monthlyReport (CSDL toàn cục cổng 54399, fetch API ngày lễ nuốt lỗi, new Date() chọn tháng) ⇒ gọi thẳng ECONNREFUSED;
 * link seam (vi.mock + stubGlobal + fake Date) và "để lỗi in ra sự thật"; chốt 1 ví dụ: 96,42% dòng / 66,66% nhánh mà chỉ bắt 3/10 thay đổi;
 * golden master 9 dòng dữ liệu × 3 tháng × 2 phòng (toMatchFileSnapshot): 100% cả bốn chỉ số, 10/10; múi giờ: v0 đỏ dưới America/New_York
 * (Weekend/holiday 2 → 1), bản refactor xanh ở UTC/VN/New York; object seam (tham số deps) rồi lõi thuần buildMonthlyReport; trượt tay
 * toFixed(1) ⇒ "Hours: 7.0" bị bắt. Nguồn: Michael Feathers, Working Effectively with Legacy Code (2004) — định nghĩa seam đọc qua bliki
 * của Martin Fowler; bài "Characterization Testing" của Feathers; approvaltests.com (đều GET 200 ngày 01/11/2026).
 */
import G from '../giang/tst-10-2.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const loc = (t, re) => t.split('\n').filter((l) => re.test(l)).join('\n');

const LEGACY = CODE.legacyV0.split('\n').slice(5).join('\n');
const DO1 = loc(OUT['102-1-ngay-tho'], /^\$ |×|Error:|Tests {2}/);
const DT2 = loc(CODE.dt2, /vi\.mock|^ {2}\{ lab|^\] \} \}|^beforeEach|^ {2}vi\.|^ {2}return|^it\(|toBe\(''\)|^\}\);/);
const DO2 = loc(OUT['102-2-doc-loi'], /^\$ |×|AssertionError|^\+ [^R]/);
const MUT3 = loc(OUT['102-mut-3'], /^\$ |SURVIVED|\/10/);
const XANH3 = loc(OUT['102-3-chot'], /^\$ |✓ prints|Tests {2}/);
const COV3 = loc(OUT['102-cov-3'], /^\$ |^File|lyReport/);
const COV4 = loc(OUT['102-cov-4'], /^\$ |^File|lyReport/);
const LAN_DAU = loc(OUT['102-4-lan-dau'], /^\$ |✓ prints|Snapshots|Tests {2}/);
const D4 = CODE.dt4.split('\n');
const DT4 = [D4.find((l) => /vi\.mock/.test(l)), ...D4.slice(D4.findIndex((l) => /^it\(/.test(l)))].join('\n');
const MUT4 = loc(OUT['102-mut-4'], /^\$ |\/10/);
const TZ_DO = loc(OUT['102-tz-do'], /^\$ |^[-+] W/);
const SEAMS = loc(CODE.v1Seams, /deps/);
const GD = (k) => loc(OUT[k], /^\$ |Tests {2}/);
const TRUOT = loc(OUT['102-truot'], /^planted|×|^[-+] |Snapshots {2}/);

const FLOW_EN = `<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Change point</div><div class="lz-d">a new column in the monthly report</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Test point</div><div class="lz-d">monthlyReport(lab) returns the whole text</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Break dependencies</div><div class="lz-d">database, network, clock — link seams, no edit</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Write tests</div><div class="lz-d">pin what it does today, measured 10/10</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Change and refactor</div><div class="lz-d">the same approved file stays green</div></div>
</div>`;
const FLOW_VI = `<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Điểm cần đổi</div><div class="lz-d">thêm một cột vào báo cáo tháng</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Điểm kiểm</div><div class="lz-d">monthlyReport(lab) trả về cả đoạn chữ</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Gỡ phụ thuộc</div><div class="lz-d">CSDL, mạng, đồng hồ — link seam, không sửa code</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Viết test</div><div class="lz-d">chốt điều nó làm hôm nay, đo được 10/10</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Sửa và refactor</div><div class="lz-d">cùng một file đã duyệt vẫn xanh</div></div>
</div>`;

const KHI_EN = `<table>
<thead><tr><th>Situation</th><th>Use</th></tr></thead>
<tbody>
<tr><td>Not allowed to edit yet</td><td>link seams: <code>vi.mock</code>, <code>vi.stubGlobal</code>, fake timers</td></tr>
<tr><td>Big text or JSON, many inputs</td><td>golden master / approval file</td></tr>
<tr><td>Allowed to edit a little</td><td>object seam: a parameter with a default</td></tr>
<tr><td>Tests green and strong</td><td>extract a pure core</td></tr>
</tbody></table>`;
const KHI_VI = `<table>
<thead><tr><th>Tình huống</th><th>Dùng</th></tr></thead>
<tbody>
<tr><td>Chưa được sửa code</td><td>link seam: <code>vi.mock</code>, <code>vi.stubGlobal</code>, fake timers</td></tr>
<tr><td>Đoạn chữ hay JSON lớn, nhiều đầu vào</td><td>golden master / file đã duyệt</td></tr>
<tr><td>Được sửa một chút</td><td>object seam: tham số có mặc định</td></tr>
<tr><td>Test xanh và đủ mạnh</td><td>tách lõi thuần</td></tr>
</tbody></table>`;

const NGUON = [
  nguon('🧵', 'Martin Fowler — Legacy Seam', 'Feathers’ definition of a seam and its enabling point (read 01/11/2026).', 'https://martinfowler.com/bliki/LegacySeam.html'),
  nguon('🔍', 'Michael Feathers — Characterization Testing', 'Document actual behaviour; a dummy expectation, then read the real value.', 'https://michaelfeathers.silvrback.com/characterization-testing'),
].join('\n');

export default {
  title: '10.2 — Adding tests to legacy code|||10.2 — Thêm test cho code cũ chưa có test',
  slug: 'tst-10-2-code-cu',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Thêm test cho một module cũ không có test (báo cáo tháng "LabFlow v0": CSDL toàn cục, gọi API ngày lễ, new Date()) theo Michael Feathers: gọi thẳng ⇒ ECONNREFUSED 127.0.0.1:54399; link seam (vi.mock, stubGlobal, fake Date) không sửa một dòng; để lỗi in ra hành vi thật rồi chốt lại; một ví dụ đạt 96,42% dòng nhưng chỉ 66,66% nhánh và bắt 3/10 thay đổi thật — golden master 9 dòng dữ liệu đạt 100% nhánh và 10/10; chốt cả điều kỳ quặc (giờ "9" chứ không "9.0", mất mạng thì không có ngày lễ, ở New York đếm sai cuối tuần); object seam rồi tách lõi thuần, một trượt tay toFixed(1) bị bắt ngay.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.2</span>
<h2>Adding tests to legacy code</h2>
<p class="lead">Lesson 10.1 started from an empty file. At work you more often change a function with no tests that talks to a database, the network and the clock. This lesson tests such a module without editing it, then refactors it safely.</p>
<p><strong>After this lesson you can</strong> test code you may not edit yet, pin what it does today, measure that pin, keep a big output in an approved file, and refactor under it. <strong>Why it is useful:</strong> an intern’s first tickets are “small changes” in old code; these tests turn the fear of breaking something into a red test that shows what changed — and “how do you test code with no tests?” is a common interview question.</p>

<h3>Legacy code, and the plan for it</h3>
<p>Michael Feathers, <em>Working Effectively with Legacy Code</em> (2004), defines legacy code as <strong>code without tests</strong>, however new it is. His legacy code change algorithm is the plan of this lesson:</p>
${FLOW_EN}
<p>The module is LabFlow’s old monthly report (v0). Its header says it all: “DO NOT CHANGE THE OUTPUT: the office pastes this text into its Excel sheet every month. No tests. The person who wrote it has left.”</p>
${ma('javascript', LEGACY)}
<p>Three dependencies hide inside: a <strong>global database</strong> (<code>src/legacy/db.js</code>, <code>LEGACY_DATABASE_URL</code>, port 54399 by default), a <strong>network call</strong> whose <code>catch</code> swallows every error, and <strong>the clock</strong>, which picks the month.</p>

<h3>Step 1 — just call it</h3>
${ra(DO1)}
<p>The test never reaches the report. A test needing a real database, the internet and today’s date is not a unit test — and next month the text would differ anyway.</p>

<h3>Step 2 — link seams, and let the failure tell you</h3>
<p>Feathers’ key idea is the <strong>seam</strong>: “a place where you can alter behavior in your program without editing in that place”. Its <strong>enabling point</strong> is where you choose the behaviour. Here they are <strong>link seams</strong> — <code>vi.mock</code> replaces <code>db.js</code>, <code>vi.stubGlobal</code> replaces <code>fetch</code>, fake timers replace the date — and the enabling point is the test file, so v0 stays untouched. The expected <code>''</code> is wrong on purpose: Feathers’ recipe is a dummy expectation, then read the real value from the failure:</p>
${ma('javascript', DT2)}
${ra(DO2)}
<p>That is what the code really does on 31/10/2026 with these three rows, and nobody had to read its 42 lines to find out.</p>

<h3>Step 3 — pin it, then measure it</h3>
<p>Paste the received text as the expected value (<code>demo10/dac-ta/3-chot.test.js</code>):</p>
${ra(XANH3)}
<p>That is a <strong>characterization test</strong>. It does not claim the report is right; in Feathers’ words it documents “your system’s actual behavior, not … the behavior you wish your system had”. Is one example enough to refactor under? Measure, as in Chapter 8: coverage, then ten real changes planted in v0 one at a time (<code>demo10/dac-ta/dot-bien-dac-ta.mjs</code>):</p>
${ra(COV3)}
${ra(MUT3)}
<div class="pitfall co-tieu-de"><strong>A green characterization test can be almost blind.</strong> One happy example covered 96.42% of the lines and caught 3 changes out of 10: no Saturday, no holiday, no pending booking, no other lab, and line 34 — the empty month — never ran. Choose inputs by <em>branches</em> (66.66% here) and prove them with planted changes before you refactor.</div>

<h3>Step 4 — a golden master</h3>
<p>A <strong>golden master</strong> — an <strong>approval test</strong> in Llewellyn Falco’s ApprovalTests — keeps the whole output in a file, reviewed once and compared on every run. The rows are chosen to hit every branch:</p>
${ma('javascript', CODE.rows)}
${ma('javascript', DT4)}
${ra(LAN_DAU)}
${ra(MUT4)}
<p>The first run wrote the file (“Snapshots 1 written”); from then on Vitest compares. 10 changes out of 10, and 100% of branches (coverage in the practice below). Commit the file with the test and review its diff like code: <code>-u</code> writes whatever the code prints, bugs included.</p>

<h3>Pin the quirks — do not fix them now</h3>
<p>Characterization digs up odd behaviour. v0 prints <code>Hours: 9</code>, not <code>9.0</code>. Without network it silently counts no holiday. And it finds weekends with <code>new Date(b.date).getDay()</code>, which depends on the machine’s time zone:</p>
${ra(OUT['102-tz-v0'])}
${ra(TZ_DO)}
<p>In New York the date string is midnight UTC, still the evening before locally: Saturday 3 October becomes a Friday. The same run under UTC and Asia/Ho_Chi_Minh, where the server runs, is green — the approved file is right where the code runs.</p>
<div class="pitfall co-tieu-de"><strong>A refactor that also “fixes a few things” is two changes in one.</strong> When a test goes red you cannot tell your slip from your fix. Pin the quirk, file an issue, refactor with the output unchanged, then change behaviour in its own pull request, where the approved file’s diff shows the office exactly what changes.</div>

<h3>Step 5 — seams by editing, as little as possible</h3>
<p>Now we may touch the file. Feathers’ <em>Parameterize Method</em>: each dependency becomes an optional parameter whose default is the old behaviour, so every caller keeps working — an <strong>object seam</strong>:</p>
${ma('javascript', SEAMS)}
<p>The characterization tests in <code>src/legacy/monthlyReport.test.js</code> use the same link seams, so they run unchanged against this version, as they did against v0:</p>
${ra(GD('102-gd1'))}

<h3>Step 6 — refactor under the tests</h3>
<p>The logic moves into a pure function, <code>buildMonthlyReport({ lab, month, rows, holidays })</code> in <code>src/report/monthly.js</code> — no database, no network, no clock, like <code>buildMail</code> in lesson 3.4. <code>src/legacy/monthlyReport.js</code> keeps its signature, takes named seams <code>{ database, fetch, now }</code>, loads the data and calls it:</p>
${ra(GD('102-gd2'))}
${ra(OUT['102-tz-moi'])}
<p>The core reads the weekday in UTC (<code>new Date(iso + 'T00:00:00Z').getUTCDay()</code>), so the tests are green in all three time zones. And the reason for all this — a “cleaner” hours format, <code>(minutes / 60).toFixed(1)</code>, caught with the exact lines the office would have seen change:</p>
${ra(TRUOT)}
<p><strong>In Java/Spring:</strong> ApprovalTests.Java’s <code>Approvals.verify(text)</code> compares <code>*.received.txt</code> with <code>*.approved.txt</code>; the usual object seam is constructor injection — a <code>@Service</code> gets its repository and a <code>java.time.Clock</code>, so a test passes a fixed clock.</p>

<h3>Which tool when</h3>
${KHI_EN}

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<p>Start from <code>3-chot.test.js</code> (3/10, 66.66% branches). Make it a golden master and add booking rows — only rows, never edit v0 — until <code>node demo10/dac-ta/dot-bien-dac-ta.mjs &lt;your test&gt;</code> prints 10/10 and v0’s branch coverage is 100%. Read which change survives, then ask which row would make it visible.</p>
<p><strong>Solution and real output</strong> — the rows and test of step 4:</p>
${ra(MUT4)}
${ra(COV4)}
<p><strong>Done when</strong> you reach 10/10 and 100% branches, the approved file is committed, and you can name the rows that kill #1 (exactly 30 seats) and #8 (an empty month).</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">legacy code (code cũ)</span><span class="v">Code without tests (Feathers), however new.</span></div>
  <div class="kv"><span class="k">characterization test (test mô tả hiện trạng)</span><span class="v">Records what the code does today, not what it should do.</span></div>
  <div class="kv"><span class="k">seam / enabling point (đường nối / điểm bật)</span><span class="v">Where behaviour changes without editing there / where you choose it.</span></div>
  <div class="kv"><span class="k">link seam vs object seam</span><span class="v">Replace an import (vi.mock) vs pass the dependency as a parameter.</span></div>
  <div class="kv"><span class="k">golden master / approval test (bản chuẩn đã duyệt)</span><span class="v">The whole output kept in a reviewed file, compared on every run.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Legacy code is code without tests: break dependencies, pin behaviour, then change it.</li>
<li>Link seams let you test before you edit; a dummy expectation makes the failure print the truth.</li>
<li>Measure the pins: 96.42% lines caught 3/10; rows chosen by branch caught 10/10.</li>
<li>Pin quirks; change behaviour later, in its own PR; refactor behind object seams and a pure core.</li>
</ul>

${NGUON}
${lienKet({ bai: 'swt301-maintenance-test-plan', title: 'Theory in SWT301 — 2.5: maintenance testing and impact analysis', sub: 'Same: changes to running software need regression tests, and with no spec the current output is the baseline. Deeper here: that baseline as an automated golden master, seams to reach it, its strength measured (3/10 → 10/10), and a refactor under it.', cta: 'OPEN LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.2</span>
<h2>Thêm test cho code cũ chưa có test</h2>
<p class="lead">Bài 10.1 bắt đầu từ một file trống. Đi làm thì hay gặp hơn là sửa một hàm không có test lại nói chuyện với CSDL, mạng và đồng hồ. Bài này test một module như thế mà không sửa nó, rồi refactor nó an toàn.</p>
<p><strong>Sau bài này bạn có thể</strong> test code mình chưa được sửa, chốt điều nó làm hôm nay bằng characterization test (test mô tả hiện trạng), đo chỗ chốt đó, giữ một output lớn trong file đã duyệt, và refactor dưới nó. <strong>Vì sao hữu ích:</strong> ticket đầu tiên của thực tập sinh là “sửa nhỏ” trong code cũ; các test này biến nỗi sợ làm hỏng thành một test đỏ chỉ ra cái gì đã đổi — và “bạn test code chưa có test thế nào?” là câu phỏng vấn hay gặp.</p>

<h3>Code cũ, và kế hoạch cho nó</h3>
<p>Michael Feathers, <em>Working Effectively with Legacy Code</em> (2004), định nghĩa legacy code (code cũ) là <strong>code không có test</strong>, dù mới viết. Thuật toán sửa code cũ của ông là kế hoạch của bài này:</p>
${FLOW_VI}
<p>Module là báo cáo tháng cũ của LabFlow (v0). Lời chú thích đầu file nói hết: “DO NOT CHANGE THE OUTPUT” — phòng đào tạo dán đoạn chữ này vào Excel mỗi tháng, không có test, người viết đã nghỉ. Chính <em>đoạn chữ</em> là hợp đồng:</p>
${ma('javascript', LEGACY)}
<p>Ba phụ thuộc nấp bên trong: một <strong>CSDL toàn cục</strong> (<code>src/legacy/db.js</code>, <code>LEGACY_DATABASE_URL</code>, mặc định cổng 54399), một <strong>lời gọi mạng</strong> mà <code>catch</code> nuốt im mọi lỗi, và <strong>đồng hồ</strong> chọn tháng.</p>

<h3>Bước 1 — cứ gọi thử</h3>
${ra(DO1)}
<p>Test không chạm được tới báo cáo. Test cần CSDL thật, internet và ngày hôm nay thì không phải unit test — và tháng sau đoạn chữ đã khác.</p>

<h3>Bước 2 — link seam, và để lỗi nói cho bạn biết</h3>
<p>Ý then chốt của Feathers là <strong>seam</strong> (đường nối): “a place where you can alter behavior in your program without editing in that place” — chỗ đổi được hành vi mà không sửa tại chỗ đó. <strong>Enabling point</strong> (điểm bật) của nó là nơi bạn chọn hành vi. Ở đây là <strong>link seam</strong> — <code>vi.mock</code> thay <code>db.js</code>, <code>vi.stubGlobal</code> thay <code>fetch</code>, fake timers thay ngày giờ — và điểm bật là file test, nên v0 không bị đụng. <code>''</code> cố ý sai: công thức của Feathers là đưa giá trị giả rồi đọc giá trị thật từ lỗi:</p>
${ma('javascript', DT2)}
${ra(DO2)}
<p>Đó là điều code thật sự làm ngày 31/10/2026 với ba dòng này, và không ai phải đọc 42 dòng của nó để biết.</p>

<h3>Bước 3 — chốt lại, rồi đo</h3>
<p>Dán đoạn chữ nhận được làm giá trị mong đợi (<code>demo10/dac-ta/3-chot.test.js</code>):</p>
${ra(XANH3)}
<p>Đó là một <strong>characterization test</strong>. Nó không khẳng định báo cáo đúng; theo lời Feathers nó ghi lại “hành vi thật của hệ thống, không phải hành vi bạn mong nó có”. Một ví dụ có đủ để refactor không? Hai phép đo từ Chương 8 — độ phủ, rồi mười thay đổi thật cài vào v0 từng cái một (<code>demo10/dac-ta/dot-bien-dac-ta.mjs</code>):</p>
${ra(COV3)}
${ra(MUT3)}
<div class="pitfall co-tieu-de"><strong>Một characterization test xanh có thể gần như mù.</strong> Một ví dụ suôn sẻ phủ 96,42% dòng mà chỉ bắt 3 trên 10 thay đổi: không thứ Bảy, không ngày lễ, không lượt chờ duyệt, không phòng khác, và dòng 34 — tháng trống — chưa từng chạy. Chọn đầu vào theo <em>nhánh</em> (ở đây 66,66%) và chứng minh bằng thay đổi cài sẵn trước khi refactor.</div>

<h3>Bước 4 — golden master</h3>
<p>Một <strong>golden master</strong> — <strong>approval test</strong> trong ApprovalTests của Llewellyn Falco — giữ cả output trong một file, review một lần rồi so ở mọi lần chạy. Dữ liệu được chọn để đi qua mọi nhánh:</p>
${ma('javascript', CODE.rows)}
${ma('javascript', DT4)}
${ra(LAN_DAU)}
${ra(MUT4)}
<p>Lần chạy đầu ghi file (“Snapshots 1 written”); từ đó Vitest so sánh. Bắt 10 trên 10 thay đổi, và 100% nhánh (độ phủ ở phần thực hành bên dưới). Commit file cùng test và review diff của nó như code: <code>-u</code> ghi bất cứ thứ gì code in ra, kể cả bug.</p>

<h3>Chốt cả điều kỳ quặc — đừng sửa lúc này</h3>
<p>Mô tả hiện trạng lôi ra hành vi lạ. v0 in <code>Hours: 9</code> chứ không phải <code>9.0</code>. Mất mạng thì nó im lặng coi như không có ngày lễ. Và nó tìm cuối tuần bằng <code>new Date(b.date).getDay()</code>, phụ thuộc múi giờ của máy:</p>
${ra(OUT['102-tz-v0'])}
${ra(TZ_DO)}
<p>Ở New York chuỗi ngày là nửa đêm UTC, vẫn là tối hôm trước theo giờ địa phương: thứ Bảy 3/10 thành thứ Sáu. Cùng lần chạy đó dưới UTC và Asia/Ho_Chi_Minh, nơi server chạy, thì xanh — file đã duyệt đúng ở nơi code chạy.</p>
<div class="pitfall co-tieu-de"><strong>Refactor mà “tiện sửa vài chỗ” là hai thay đổi gộp làm một.</strong> Khi test đỏ bạn không phân biệt được trượt tay với chỗ mình sửa. Chốt điều kỳ quặc, mở issue, refactor với output giữ nguyên, rồi đổi hành vi trong pull request riêng, nơi diff của file đã duyệt cho phòng đào tạo thấy chính xác cái gì đổi.</div>

<h3>Bước 5 — thêm seam bằng cách sửa, càng ít càng tốt</h3>
<p>Giờ được đụng vào file. <em>Parameterize Method</em> của Feathers: mỗi phụ thuộc thành một tham số tuỳ chọn có mặc định là hành vi cũ, nên mọi nơi gọi vẫn chạy — một <strong>object seam</strong>:</p>
${ma('javascript', SEAMS)}
<p>Characterization test trong <code>src/legacy/monthlyReport.test.js</code> dùng đúng các link seam đó, nên chạy nguyên xi với bản này, như đã chạy với v0:</p>
${ra(GD('102-gd1'))}

<h3>Bước 6 — refactor dưới các test</h3>
<p>Logic chuyển vào một hàm thuần, <code>buildMonthlyReport({ lab, month, rows, holidays })</code> trong <code>src/report/monthly.js</code> — không CSDL, không mạng, không đồng hồ, như <code>buildMail</code> ở bài 3.4. <code>src/legacy/monthlyReport.js</code> giữ nguyên chữ ký, nhận seam có tên <code>{ database, fetch, now }</code>, nạp dữ liệu rồi gọi nó:</p>
${ra(GD('102-gd2'))}
${ra(OUT['102-tz-moi'])}
<p>Lõi đọc thứ trong tuần theo UTC (<code>new Date(iso + 'T00:00:00Z').getUTCDay()</code>), nên test xanh ở cả ba múi giờ. Và lý do của mọi thứ — một cách in số giờ “gọn hơn”, <code>(minutes / 60).toFixed(1)</code>, bị bắt kèm đúng những dòng phòng đào tạo sẽ thấy đổi:</p>
${ra(TRUOT)}
<p><strong>Trong Java/Spring:</strong> <code>Approvals.verify(text)</code> của ApprovalTests.Java so <code>*.received.txt</code> với <code>*.approved.txt</code>; object seam quen thuộc là constructor injection — một <code>@Service</code> nhận repository và một <code>java.time.Clock</code>, nên test truyền đồng hồ cố định.</p>

<h3>Khi nào dùng gì</h3>
${KHI_VI}

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<p>Bắt đầu từ <code>3-chot.test.js</code> (3/10, 66,66% nhánh). Biến nó thành golden master rồi thêm dòng dữ liệu — chỉ thêm dòng, không sửa v0 — tới khi <code>node demo10/dac-ta/dot-bien-dac-ta.mjs &lt;file test của bạn&gt;</code> in 10/10 và độ phủ nhánh của v0 đạt 100%. Đọc thay đổi nào sống sót, rồi hỏi dòng dữ liệu nào làm nó lộ ra.</p>
<p><strong>Lời giải và output thật</strong> — dữ liệu và test ở bước 4:</p>
${ra(MUT4)}
${ra(COV4)}
<p><strong>Xong khi</strong> bạn được 10/10 và 100% nhánh, file đã duyệt được commit, và bạn chỉ ra được dòng dữ liệu diệt #1 (đúng 30 chỗ) và #8 (tháng trống).</p>
</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">legacy code (code cũ)</span><span class="v">Code không có test (Feathers), dù mới viết.</span></div>
  <div class="kv"><span class="k">characterization test (test mô tả hiện trạng)</span><span class="v">Ghi lại điều code làm hôm nay, không phải điều nó nên làm.</span></div>
  <div class="kv"><span class="k">seam / enabling point (đường nối / điểm bật)</span><span class="v">Chỗ đổi hành vi mà không sửa tại đó / nơi chọn hành vi.</span></div>
  <div class="kv"><span class="k">link seam vs object seam</span><span class="v">Thay một import (vi.mock) vs truyền phụ thuộc qua tham số.</span></div>
  <div class="kv"><span class="k">golden master / approval test (bản chuẩn đã duyệt)</span><span class="v">Cả output giữ trong một file đã review, so ở mọi lần chạy.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Code cũ là code không có test: gỡ phụ thuộc, chốt hành vi, rồi mới sửa.</li>
<li>Link seam cho test chạy trước khi sửa; giá trị mong đợi giả để lỗi in ra sự thật.</li>
<li>Đo những gì đã chốt: 96,42% dòng chỉ bắt 3/10; dữ liệu chọn theo nhánh bắt 10/10.</li>
<li>Chốt điều kỳ quặc; đổi hành vi sau, trong PR riêng; refactor sau object seam và lõi thuần.</li>
</ul>

${NGUON}
${lienKet({ bai: 'swt301-maintenance-test-plan', title: 'Lý thuyết ở SWT301 — 2.5: kiểm thử bảo trì và phân tích tác động', sub: 'Giống: thay đổi trên phần mềm đang chạy cần regression test, và khi không có đặc tả thì output hiện tại là mốc so. Sâu thêm ở đây: biến mốc đó thành golden master tự động, seam để chạm tới nó, đo độ mạnh (3/10 → 10/10), và refactor dưới nó.', cta: 'MỞ BÀI →' })}
</div>
`,
};
