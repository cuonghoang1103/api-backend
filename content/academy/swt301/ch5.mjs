/**
 * SWT301 · Chapter 5 — Test design: white-box techniques.
 * Source: SWT4_tim.pptx visible slides 82–99 (from the CONTENTS slide that
 * opens "White-box Test Techniques" to the last question before the
 * experience-based CONTENTS slide) + SWT3 slides 101–103 (cyclomatic
 * complexity, shown as cross-reference figures) + the practical exams
 * FA23 Q2 (countCharacters), SP25 Q3 (calculateRewardPoints) and
 * SU24 PE1 Q2 (fncPersonalIncomeTax flowchart).
 * Lesson split:
 *   5.1 Coverage: statement & decision   swt4 82–90
 *   5.2 V(G), Examples 1–6, PE Question 2 swt4 91–99 (+ swt3 101–103)
 *   5.3 More from the 2023 deck           oswt4 (SWT4.ppt) pages 34–55 — only the NEW/PARTIAL pages as cards
 * Every coverage number was checked twice: by reasoning on the control-flow
 * graph AND by running JUnit 5.12.2 + JaCoCo 0.8.13 on JDK 21.0.9; the
 * outputs pasted below are the real console output.
 */
import { walk, walkHead, books, bi, ansEn as AE, ansVi as AV } from './_slides.mjs';

const D = 'swt4';
const q = (question, options, correctIndex) => ({ question, options, correctIndex, points: 1 });
// qx = q + explanation (kept in source; the seeder currently stores only question/options/correctIndex/points).
const qx = (question, options, correctIndex, explanation) => ({ ...q(question, options, correctIndex), explanation });

/* ───────────────────── 5.1 Coverage: statement & decision ───────────────────── */
const L51 = {
  title: '5.1 — White-box testing: coverage, statement & decision coverage|||5.1 — Kiểm thử white-box: coverage, statement & decision coverage',
  slug: 'swt301-whitebox-coverage',
  type: 'VIDEO',
  description: 'SWT4 slide 82–90: hai mục đích của white-box, công thức coverage, bẫy coverage, statement coverage, decision (branch) coverage, số đường đi và vòng lặp — kèm ví dụ đo thật bằng JUnit + JaCoCo.',
  content: [
    bi(`<span class="eyebrow">Chapter 5 · Lesson 5.1 · SWT4 slides 82–90</span>
<h2>White-box testing: measuring what your tests exercised</h2>
<p class="lead">Black-box techniques (Chapter 4) derive tests from the specification. White-box techniques — the syllabus also calls them <strong>structure-based</strong> — look inside, at the statements and decisions of the code.</p>
<p>This lesson walks SWT4 slides 82–90:</p>
<ul>
<li>the two purposes of white-box testing and the coverage formula;</li>
<li>the <strong>coverage trap</strong>;</li>
<li><strong>statement coverage</strong> and <strong>decision (branch) coverage</strong>;</li>
<li>how the number of paths explodes, especially with loops.</li>
</ul>
<div class="callout"><strong>Learning objectives.</strong>
<ul>
<li>LO-4.3.1 Explain statement coverage (K2)</li>
<li>LO-4.3.2 Explain decision coverage (K2)</li>
<li>LO-4.3.3 Explain the value of statement and decision coverage (K2)</li>
</ul>
<p>In the ISTQB exam you must be able to compute a coverage percentage and the minimum number of tests for a short piece of code. In the SWT301 PE (Question 2 of FA23 and SU24, Question 3 of SP25) you must also <em>write</em> those tests — lesson 5.2 does exactly that.</p></div>
<h3>The essentials in one screen</h3>
<table>
<thead><tr><th>Idea</th><th>What you must be able to say</th></tr></thead>
<tbody>
<tr><td>Coverage</td><td>Coverage = (coverage items exercised ÷ total coverage items) × 100%. A coverage item is anything we can count and tick off once a test has exercised it.</td></tr>
<tr><td>Statement coverage</td><td>Items = <em>executable statements</em>. 100% = every executable statement has run at least once.</td></tr>
<tr><td>Decision coverage</td><td>Items = <em>decision outcomes</em> — the True and the False of every IF, loop condition and CASE. 100% = every outcome taken at least once.</td></tr>
<tr><td>Which one is stronger?</td><td>100% decision coverage ⇒ 100% statement coverage. The reverse is <strong>not</strong> true: an IF without ELSE can be fully statement-covered by its True side alone.</td></tr>
<tr><td>Paths</td><td>Sequential decisions multiply paths (2 → 4 → 8…); a loop makes the number unbounded. So we aim for statement/decision coverage, not path coverage.</td></tr>
<tr><td>Numbers on the slides</td><td>Typical ad hoc testing reaches only 60–75% statement coverage and 40–60% decision coverage (slides 86, 88).</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 5 · Bài 5.1 · SWT4 slide 82–90</span>
<h2>Kiểm thử white-box: đo xem test đã chạy qua những gì</h2>
<p class="lead">Kỹ thuật black-box (Chương 4) rút test ra từ đặc tả. Kỹ thuật white-box — syllabus còn gọi là <strong>structure-based</strong> (dựa trên cấu trúc) — nhìn vào bên trong: các câu lệnh và các quyết định của code.</p>
<p>Bài này đi qua SWT4 slide 82–90:</p>
<ul>
<li>hai mục đích của white-box và công thức coverage;</li>
<li><strong>bẫy coverage</strong>;</li>
<li><strong>statement coverage</strong> và <strong>decision (branch) coverage</strong>;</li>
<li>số đường đi bùng nổ ra sao, nhất là khi có vòng lặp.</li>
</ul>
<div class="callout"><strong>Chuẩn đầu ra.</strong>
<ul>
<li>LO-4.3.1 Giải thích statement coverage (K2)</li>
<li>LO-4.3.2 Giải thích decision coverage (K2)</li>
<li>LO-4.3.3 Giải thích giá trị của statement và decision coverage (K2)</li>
</ul>
<p>Trong đề ISTQB bạn phải tính được tỉ lệ coverage và số test tối thiểu cho một đoạn code ngắn. Trong PE của SWT301 (câu 2 đề FA23 và SU24, câu 3 đề SP25) bạn còn phải <em>viết</em> các test đó — bài 5.2 làm đúng việc ấy.</p></div>
<h3>Cốt lõi trong một màn hình</h3>
<table>
<thead><tr><th>Ý chính</th><th>Bạn phải nói được</th></tr></thead>
<tbody>
<tr><td>Coverage</td><td>Coverage = (số coverage item đã được chạy qua ÷ tổng số coverage item) × 100%. Coverage item là bất cứ thứ gì đếm được và đánh dấu được khi một test đã chạy qua nó.</td></tr>
<tr><td>Statement coverage</td><td>Item = <em>câu lệnh thực thi được</em>. 100% = mọi câu lệnh thực thi được đã chạy ít nhất một lần.</td></tr>
<tr><td>Decision coverage</td><td>Item = <em>kết quả của quyết định</em> — nhánh True và nhánh False của mọi IF, điều kiện vòng lặp và CASE. 100% = mọi kết quả đều đã được đi qua ít nhất một lần.</td></tr>
<tr><td>Cái nào mạnh hơn?</td><td>100% decision coverage ⇒ 100% statement coverage. Chiều ngược lại <strong>không</strong> đúng: một IF không có ELSE có thể đạt đủ statement coverage chỉ bằng nhánh True.</td></tr>
<tr><td>Đường đi (path)</td><td>Các quyết định nối tiếp nhau thì số đường nhân lên (2 → 4 → 8…); vòng lặp làm số đường không có giới hạn. Vì vậy ta nhắm statement/decision coverage chứ không nhắm path coverage.</td></tr>
<tr><td>Con số trên slide</td><td>Test ad hoc (tuỳ hứng) thường chỉ đạt 60–75% statement coverage và 40–60% decision coverage (slide 86, 88).</td></tr>
</tbody>
</table>`),
    walkHead(D, 82, 90),
    walk(D, [
      [82, 'CONTENTS — White-box Test Techniques',
        `<p class="y-chinh">🎯 The white-box block of SWT4 starts here: two techniques, statement coverage and decision coverage.</p>
<p class="nhan">What the slide shows</p>
<ul>
<li><strong>Pink box</strong> — highlights <strong>White-box Test Techniques</strong>, the fourth block of SWT4.</li>
<li><strong>Dashed box</strong> — its two sub-topics: <strong>statement coverage</strong> and <strong>decision coverage</strong>.</li>
</ul>
<p class="nhan">Where it sits in the syllabus</p>
<ul>
<li><strong>CTFL 2018 §4.3</strong> — contains exactly these two white-box techniques.</li>
<li><strong>Condition coverage, MC/DC, path coverage</strong> — Advanced level (Technical Test Analyst); here they appear only as "stronger" levels on slides 84–85.</li>
</ul>
<p class="nhan">On this site</p>
<ol>
<li><strong>Lesson 5.1</strong> — the concepts (slides 82–90).</li>
<li><strong>Lesson 5.2</strong> — the six flowchart examples, cyclomatic complexity and the PE question (slides 91–99).</li>
<li><strong>Quiz 5</strong>.</li>
</ol>`,
        `<p class="y-chinh">🎯 Khối white-box của SWT4 bắt đầu từ đây: hai kỹ thuật, statement coverage và decision coverage.</p>
<p class="nhan">Slide cho thấy gì</p>
<ul>
<li><strong>Ô hồng</strong> — tô <strong>White-box Test Techniques</strong>, khối thứ tư của SWT4.</li>
<li><strong>Ô nét đứt</strong> — hai mục con: <strong>statement coverage</strong> và <strong>decision coverage</strong>.</li>
</ul>
<p class="nhan">Vị trí trong syllabus</p>
<ul>
<li><strong>CTFL 2018 §4.3</strong> — có đúng hai kỹ thuật white-box này.</li>
<li><strong>Condition coverage, MC/DC, path coverage</strong> — thuộc cấp Advanced (Technical Test Analyst); ở đây chúng chỉ xuất hiện như các mức "mạnh hơn" trên slide 84–85.</li>
</ul>
<p class="nhan">Trên trang này</p>
<ol>
<li><strong>Bài 5.1</strong> — khái niệm (slide 82–90).</li>
<li><strong>Bài 5.2</strong> — sáu ví dụ lưu đồ, cyclomatic complexity và câu hỏi PE (slide 91–99).</li>
<li><strong>Quiz 5</strong>.</li>
</ol>`],
      [83, 'White-box Test Techniques — two purposes & the coverage formula',
        `<p class="y-chinh">🎯 White-box techniques measure how much of the code your tests exercised, and help you design tests for the rest.</p>
<p class="nhan">Two purposes</p>
<ol>
<li><strong>Coverage measurement</strong> — assess how much of the code structure the tests you already have (usually designed with black-box techniques) actually exercised.</li>
<li><strong>Structural test design</strong> — design <em>additional</em> tests to increase that coverage.</li>
</ol>
<p class="nhan">The formula at the bottom</p>
<p><em>Coverage = number of coverage items exercised ÷ total number of coverage items × 100%</em></p>
<ul>
<li><strong>Coverage item</strong> — "what we've been able to count and see whether a test has exercised it".</li>
<li><strong>White-box items</strong> — statements, decision outcomes, conditions, paths…</li>
<li><strong>Black-box items</strong> — partitions, boundary values, transitions.</li>
</ul>
<p class="nhan">Typical use</p>
<ol>
<li>Run your 20 EP/BVA tests with a coverage tool — JaCoCo (Java), coverage.py (Python), Istanbul/nyc (JavaScript).</li>
<li>The tool reports, say, 85% of statements; the red lines show which code no test touched.</li>
<li>Design tests to reach those lines.</li>
</ol>
<p class="meo">🧠 <strong>Remember:</strong> coverage is a <em>measure</em> of thoroughness, not a guarantee of correctness (slide 85).</p>`,
        `<p class="y-chinh">🎯 Kỹ thuật white-box đo xem test đã chạy qua bao nhiêu phần code, và giúp thiết kế test cho phần còn lại.</p>
<p class="nhan">Hai mục đích</p>
<ol>
<li><strong>Đo coverage</strong> — đánh giá bộ test sẵn có (thường thiết kế bằng black-box) thực sự đã chạy qua bao nhiêu phần cấu trúc code.</li>
<li><strong>Thiết kế test theo cấu trúc</strong> — thiết kế <em>thêm</em> test để tăng coverage đó.</li>
</ol>
<p class="nhan">Công thức ở cuối slide</p>
<p><em>Coverage = số coverage item đã được chạy ÷ tổng số coverage item × 100%</em></p>
<ul>
<li><strong>Coverage item</strong> — "thứ ta đếm được và xem được một test đã chạy qua nó hay chưa".</li>
<li><strong>Item của white-box</strong> — câu lệnh, kết quả quyết định, điều kiện, đường đi…</li>
<li><strong>Item của black-box</strong> — phân vùng, giá trị biên, chuyển trạng thái.</li>
</ul>
<p class="nhan">Cách dùng thường gặp</p>
<ol>
<li>Chạy 20 test EP/BVA với công cụ đo coverage — JaCoCo (Java), coverage.py (Python), Istanbul/nyc (JavaScript).</li>
<li>Công cụ báo, chẳng hạn, 85% câu lệnh; các dòng tô đỏ cho biết code nào chưa test nào chạm tới.</li>
<li>Thiết kế thêm test để với tới những dòng đó.</li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> coverage là <em>thước đo</em> độ kỹ lưỡng, không phải bảo đảm code đúng (slide 85).</p>`],
      [84, 'Using Structural Coverage — the feedback loop',
        `<p class="y-chinh">🎯 Coverage closes a feedback loop: run the tests, see what is covered, add tests until the target is met.</p>
<p class="nhan">Read the diagram as a loop</p>
<ol>
<li><strong>Spec → Tests → Software</strong> — tests come from the spec and run on the software.</li>
<li><strong>"Results OK?"</strong> — did the software behave as the spec says?</li>
<li><strong>"Enough tests?"</strong> — the arrow goes back to the spec.</li>
<li><strong>"What's covered?"</strong> — the black shadow under the Tests bubble: the coverage tool.</li>
<li><strong>"Coverage OK?"</strong> — if not, write "<em>More tests</em>" and go round again.</li>
</ol>
<p class="nhan">The small pictures</p>
<ul>
<li><strong>Top row</strong> — boxes and diamonds; the <em>black</em> ones are not yet executed. That is statement-level thinking.</li>
<li><strong>Bottom row</strong> — the red lines are decision outcomes and paths; they cover more and more of the graph from left to right ("<strong>Increasing coverage</strong>").</li>
<li><strong>Downward arrow</strong> — "<strong>Stronger structural techniques (different structural elements)</strong>": statements → decision outcomes → paths. Each level counts a different element and demands more tests.</li>
</ul>
<p class="nhan">In a real project</p>
<p>The exit criterion is written as a target, e.g. "≥ 80% decision coverage for all new classes".</p>`,
        `<p class="y-chinh">🎯 Coverage khép một vòng phản hồi: chạy test, xem đã phủ gì, thêm test cho tới khi đạt chỉ tiêu.</p>
<p class="nhan">Đọc hình như một vòng lặp</p>
<ol>
<li><strong>Spec → Tests → Software</strong> — test lấy từ đặc tả và chạy trên phần mềm.</li>
<li><strong>"Results OK?"</strong> — phần mềm có chạy đúng như đặc tả không?</li>
<li><strong>"Enough tests?"</strong> — mũi tên quay về spec.</li>
<li><strong>"What's covered?"</strong> — bóng đen dưới bong bóng Tests: công cụ đo coverage.</li>
<li><strong>"Coverage OK?"</strong> — nếu chưa, viết thêm "<em>More tests</em>" và quay lại vòng mới.</li>
</ol>
<p class="nhan">Các hình nhỏ</p>
<ul>
<li><strong>Hàng trên</strong> — các hộp và hình thoi; hộp <em>đen</em> là phần chưa chạy tới. Đó là tư duy mức câu lệnh.</li>
<li><strong>Hàng dưới</strong> — đường đỏ là các kết quả quyết định và đường đi; chúng phủ ngày càng nhiều đồ thị từ trái sang phải ("<strong>Increasing coverage</strong>").</li>
<li><strong>Mũi tên đi xuống</strong> — "<strong>Stronger structural techniques (different structural elements)</strong>": câu lệnh → kết quả quyết định → đường đi. Mỗi mức đếm một loại phần tử khác và đòi nhiều test hơn.</li>
</ul>
<p class="nhan">Trong dự án thật</p>
<p>Tiêu chí kết thúc được viết thành chỉ tiêu, ví dụ "≥ 80% decision coverage cho mọi class mới".</p>`],
      [85, 'The test coverage trap',
        `<p class="y-chinh">🎯 100% coverage does not mean 100% tested — good testing needs both structural and functional depth.</p>
<p class="nhan">The two axes</p>
<ul>
<li><strong>Structural testedness</strong> (x) — % statement → % decision → % condition combination.</li>
<li><strong>Functional testedness</strong> (y) — how much of the specified behaviour you tested.</li>
</ul>
<p class="nhan">The two boxes and the arrow</p>
<ul>
<li><strong>Top-left: "Function exercised, insufficient structure"</strong> — black-box only; big parts of the code never ran.</li>
<li><strong>Bottom-right: "Structure exercised, insufficient function"</strong> — white-box only; every line ran but the features were not checked.</li>
<li><strong>Diagonal "better testing"</strong> — needs <strong>both</strong>.</li>
</ul>
<p class="nhan">Two sentences to memorise</p>
<ul>
<li><strong>"100% coverage does not mean 100% tested!"</strong></li>
<li><strong>"Coverage is only one aspect of thoroughness."</strong></li>
</ul>
<p class="nhan">Why</p>
<ol>
<li><strong>Code cannot show what is missing</strong> — if the requirement "send a receipt e-mail" was never coded, 100% coverage of the code says nothing about it.</li>
<li><strong>Running is not checking</strong> — a test can execute a line without checking its result; a test with no assertion still counts as coverage.</li>
</ol>
<p>This is why white-box complements black-box, never replaces it.</p>`,
        `<p class="y-chinh">🎯 100% coverage không có nghĩa là đã test 100% — test tốt cần đủ sâu cả về cấu trúc lẫn chức năng.</p>
<p class="nhan">Hai trục</p>
<ul>
<li><strong>Mức test theo cấu trúc</strong> (trục x) — % statement → % decision → % tổ hợp điều kiện.</li>
<li><strong>Mức test theo chức năng</strong> (trục y) — đã test bao nhiêu hành vi trong đặc tả.</li>
</ul>
<p class="nhan">Hai ô và mũi tên</p>
<ul>
<li><strong>Ô trên-trái: "Function exercised, insufficient structure"</strong> — chỉ làm black-box; nhiều phần code chưa bao giờ chạy.</li>
<li><strong>Ô dưới-phải: "Structure exercised, insufficient function"</strong> — chỉ làm white-box; dòng nào cũng chạy nhưng tính năng thì chưa được kiểm.</li>
<li><strong>Mũi tên chéo "better testing"</strong> — cần <strong>cả hai</strong>.</li>
</ul>
<p class="nhan">Hai câu phải thuộc</p>
<ul>
<li><strong>"100% coverage không có nghĩa là đã test 100%!"</strong></li>
<li><strong>"Coverage chỉ là một khía cạnh của độ kỹ lưỡng."</strong></li>
</ul>
<p class="nhan">Vì sao</p>
<ol>
<li><strong>Code không cho thấy cái bị thiếu</strong> — nếu yêu cầu "gửi e-mail biên nhận" chưa hề được code, 100% coverage của code không nói gì về nó.</li>
<li><strong>Chạy qua không phải là kiểm</strong> — một test có thể chạy qua một dòng mà không kiểm kết quả; test không có assertion vẫn được tính coverage.</li>
</ol>
<p>Vì vậy white-box bổ sung cho black-box chứ không thay thế nó.</p>`],
      [86, 'Statement coverage',
        `<p class="y-chinh">🎯 Statement coverage = the percentage of executable statements your tests ran.</p>
<p class="nhan">Formula and example</p>
<ul>
<li><strong>Formula</strong> — statements exercised ÷ total number of (executable) statements.</li>
<li><strong>Example</strong> — the program has 100 statements, the tests exercise 87 → <strong>87%</strong>.</li>
<li><strong>Measured by</strong> — "normally … a software tool".</li>
<li><strong>Typical ad hoc testing</strong> — achieves only <strong>60–75%</strong>: a quarter or more of the code is never run by casual testing.</li>
</ul>
<p class="nhan">The green flowchart</p>
<p>One decision "?" whose False arrow bypasses the middle box. A single test down the True side executes every green box → 100% statement coverage, although the bypass arrow was never used.</p>
<p>Keep this picture in mind: it is the whole reason decision coverage exists (slide 88).</p>
<p class="nhan">What counts as a statement?</p>
<ul>
<li><strong>Counted</strong> — executable statements only: assignments, calls, returns, input/output, and the IF/WHILE test itself.</li>
<li><strong>Not counted</strong> — comments, braces, <code>ELSE</code>/<code>ENDIF</code> keywords and declarations without initialisation.</li>
<li><strong>Tools</strong> — count <em>lines</em> or bytecode instructions, so their percentages may differ a little from a hand count.</li>
</ul>`,
        `<p class="y-chinh">🎯 Statement coverage = tỉ lệ câu lệnh thực thi được mà test đã chạy qua.</p>
<p class="nhan">Công thức và ví dụ</p>
<ul>
<li><strong>Công thức</strong> — số câu lệnh đã chạy ÷ tổng số câu lệnh (thực thi được).</li>
<li><strong>Ví dụ</strong> — chương trình có 100 câu lệnh, test chạy qua 87 → <strong>87%</strong>.</li>
<li><strong>Đo bằng</strong> — "thường là công cụ phần mềm".</li>
<li><strong>Test ad hoc điển hình</strong> — chỉ đạt <strong>60–75%</strong>: một phần tư code trở lên không bao giờ được chạy khi test tuỳ hứng.</li>
</ul>
<p class="nhan">Lưu đồ xanh bên phải</p>
<p>Một quyết định "?" có mũi tên False đi vòng qua hộp ở giữa. Chỉ một test đi theo nhánh True là chạy qua mọi hộp xanh → 100% statement coverage, dù mũi tên đi vòng chưa hề được dùng.</p>
<p>Nhớ hình này: nó là toàn bộ lý do decision coverage ra đời (slide 88).</p>
<p class="nhan">Thế nào là một câu lệnh?</p>
<ul>
<li><strong>Có tính</strong> — chỉ câu lệnh thực thi được: gán, gọi hàm, return, nhập/xuất, và chính phép kiểm tra IF/WHILE.</li>
<li><strong>Không tính</strong> — chú thích, dấu ngoặc, từ khoá <code>ELSE</code>/<code>ENDIF</code> và khai báo không khởi tạo.</li>
<li><strong>Công cụ</strong> — đếm theo <em>dòng</em> hoặc lệnh bytecode, nên tỉ lệ có thể lệch chút ít so với đếm tay.</li>
</ul>`],
      [87, 'Example of statement coverage — read(a); IF a > 6',
        `<p class="y-chinh">🎯 One test (input 7) runs all five lines — 100% statement coverage — yet it lets a real defect through.</p>
<p class="nhan">The code — 5 numbered lines</p>
<ol>
<li><code>read(a)</code></li>
<li><code>IF a &gt; 6 THEN</code></li>
<li><code>b = a</code></li>
<li><code>ENDIF</code></li>
<li><code>print b</code></li>
</ol>
<p class="nhan">The single test case</p>
<ul>
<li><strong>Test 1</strong> — input 7, expected output 7.</li>
<li><strong>Why 100%</strong> — 7 &gt; 6, so all five lines run → "we have achieved 100% statement coverage".</li>
<li><strong>Small print</strong> — the slide numbers <code>ENDIF</code> as a statement to keep the picture simple; counting only the 4 executable statements, the answer is still 100%.</li>
</ul>
<p class="nhan">What that test did not do</p>
<ul>
<li><strong>Decision coverage only 50%</strong> — <code>a &gt; 6</code> was only ever True: 1 of 2 outcomes.</li>
<li><strong>A hidden defect</strong> — for <code>a = 3</code>, <code>b</code> is never assigned, so <code>print b</code> prints an undefined value. That is the "variable used before it has been defined" data-flow fault of SWT3 slide 98.</li>
<li><strong>What would catch it</strong> — 100% statement coverage let it through; one more test (a = 3) for decision coverage would have exposed it.</li>
</ul>`,
        `<p class="y-chinh">🎯 Một test (input 7) chạy cả năm dòng — 100% statement coverage — nhưng vẫn để lọt một defect thật.</p>
<p class="nhan">Đoạn code — 5 dòng đánh số</p>
<ol>
<li><code>read(a)</code></li>
<li><code>IF a &gt; 6 THEN</code></li>
<li><code>b = a</code></li>
<li><code>ENDIF</code></li>
<li><code>print b</code></li>
</ol>
<p class="nhan">Test case duy nhất</p>
<ul>
<li><strong>Test 1</strong> — input 7, output mong đợi 7.</li>
<li><strong>Vì sao 100%</strong> — 7 &gt; 6 nên cả năm dòng đều chạy → "đã đạt 100% statement coverage".</li>
<li><strong>Chú thích nhỏ</strong> — slide đánh số cả <code>ENDIF</code> như một câu lệnh cho hình đơn giản; nếu chỉ tính 4 câu lệnh thực thi được thì đáp án vẫn là 100%.</li>
</ul>
<p class="nhan">Điều test đó không làm</p>
<ul>
<li><strong>Decision coverage chỉ 50%</strong> — <code>a &gt; 6</code> chỉ từng là True: 1/2 kết quả.</li>
<li><strong>Một defect bị giấu</strong> — với <code>a = 3</code>, <code>b</code> không bao giờ được gán, nên <code>print b</code> in ra giá trị không xác định. Đó đúng là lỗi luồng dữ liệu "biến được dùng trước khi được định nghĩa" ở SWT3 slide 98.</li>
<li><strong>Cái gì bắt được nó</strong> — 100% statement coverage để lọt; thêm một test (a = 3) cho decision coverage là lộ ngay.</li>
</ul>`],
      [88, 'Decision coverage (Branch coverage)',
        `<p class="y-chinh">🎯 Decision coverage = the percentage of decision outcomes — every True and every False — your tests took.</p>
<p class="nhan">Formula and example</p>
<ul>
<li><strong>Formula</strong> — decision outcomes exercised ÷ total number of decision outcomes.</li>
<li><strong>Example</strong> — 120 outcomes, 60 exercised → <strong>50%</strong>.</li>
<li><strong>Measured by</strong> — a tool, like statement coverage.</li>
<li><strong>Typical ad hoc testing</strong> — only <strong>40–60%</strong>: lower than for statements, because casual testing mostly follows the happy path.</li>
</ul>
<p class="nhan">The diagram — one decision, two outcomes</p>
<ul>
<li><span style="color:#16a34a">True</span> (green) — straight down through the box.</li>
<li><span style="color:#dc2626">False</span> (red) — around the box. This red arrow is exactly the part statement coverage ignores.</li>
</ul>
<p class="nhan">What counts as a decision</p>
<ul>
<li>Every <code>IF</code> / <code>ELSE IF</code>.</li>
<li>Every loop condition — <code>WHILE</code>, <code>FOR</code>, <code>DO…WHILE</code>.</li>
<li>Every <code>CASE</code> — each case label is an outcome.</li>
</ul>
<p class="nhan">Two facts for the exam</p>
<ol>
<li><strong>100% decision coverage guarantees 100% statement coverage</strong> — every statement lies on some outcome (assuming no unreachable code). Not vice versa.</li>
<li><strong>Decision = branch, for the exam</strong> — CTFL 2018 says "decision coverage"; the slide title and many tools say "branch coverage". Strictly, branch coverage counts the edges of the control-flow graph, including unconditional ones.</li>
</ol>`,
        `<p class="y-chinh">🎯 Decision coverage = tỉ lệ kết quả quyết định — mọi nhánh True và mọi nhánh False — mà test đã đi qua.</p>
<p class="nhan">Công thức và ví dụ</p>
<ul>
<li><strong>Công thức</strong> — số kết quả quyết định đã chạy ÷ tổng số kết quả quyết định.</li>
<li><strong>Ví dụ</strong> — 120 kết quả, chạy qua 60 → <strong>50%</strong>.</li>
<li><strong>Đo bằng</strong> — công cụ, giống statement coverage.</li>
<li><strong>Test ad hoc điển hình</strong> — chỉ <strong>40–60%</strong>: thấp hơn statement, vì test tuỳ hứng chủ yếu đi theo đường suôn sẻ (happy path).</li>
</ul>
<p class="nhan">Hình vẽ — một quyết định, hai kết quả</p>
<ul>
<li><span style="color:#16a34a">True</span> (xanh) — đi thẳng xuống qua hộp.</li>
<li><span style="color:#dc2626">False</span> (đỏ) — đi vòng qua hộp. Mũi tên đỏ này chính là phần statement coverage bỏ qua.</li>
</ul>
<p class="nhan">Thế nào là một quyết định</p>
<ul>
<li>Mọi <code>IF</code> / <code>ELSE IF</code>.</li>
<li>Mọi điều kiện vòng lặp — <code>WHILE</code>, <code>FOR</code>, <code>DO…WHILE</code>.</li>
<li>Mọi <code>CASE</code> — mỗi nhãn case là một kết quả.</li>
</ul>
<p class="nhan">Hai điều cho kỳ thi</p>
<ol>
<li><strong>100% decision coverage bảo đảm 100% statement coverage</strong> — mọi câu lệnh đều nằm trên một kết quả nào đó (với điều kiện không có code không thể tới). Chiều ngược lại thì không.</li>
<li><strong>Khi thi, decision = branch</strong> — CTFL 2018 dùng chữ "decision coverage"; tiêu đề slide và nhiều công cụ dùng "branch coverage". Nói chặt thì branch coverage đếm các cạnh của đồ thị luồng điều khiển, kể cả cạnh không điều kiện.</li>
</ol>`],
      [89, 'Paths through code',
        `<p class="y-chinh">🎯 Decisions in sequence multiply the number of paths; nested or cascaded decisions only add to it.</p>
<p class="nhan">The four graphs, left to right</p>
<ol>
<li><strong>IF without ELSE</strong> — 2 paths: green through the box, blue around it.</li>
<li><strong>IF-THEN-ELSE</strong> — still 2 paths.</li>
<li><strong>Cascade</strong> — an IF whose False side leads into a second IF (like ELSE IF): 3 paths (green, blue, orange).</li>
<li><strong>Two IFs in sequence</strong>, each with a box on its True side — 4 paths (green, blue, orange, red) = 2 × 2.</li>
</ol>
<p class="nhan">The rule behind it</p>
<ul>
<li><strong>In sequence → multiply</strong> — n independent IFs → 2ⁿ paths.</li>
<li><strong>Nested / cascaded → add</strong> — n decisions → n + 1 paths.</li>
<li><strong>Path coverage</strong> — every path at least once: the strongest structural criterion, but it grows fast.</li>
</ul>
<p>That is why Example 4 on slide 95 has 4 paths yet needs only 2 tests for decision coverage.</p>`,
        `<p class="y-chinh">🎯 Quyết định nối tiếp thì nhân số đường đi; quyết định lồng hoặc bậc thang thì chỉ cộng thêm.</p>
<p class="nhan">Bốn đồ thị, từ trái sang phải</p>
<ol>
<li><strong>IF không có ELSE</strong> — 2 đường: xanh lá đi qua hộp, xanh dương đi vòng.</li>
<li><strong>IF-THEN-ELSE</strong> — vẫn 2 đường.</li>
<li><strong>Bậc thang</strong> — một IF mà nhánh False dẫn vào IF thứ hai (giống ELSE IF): 3 đường (xanh lá, xanh dương, cam).</li>
<li><strong>Hai IF nối tiếp</strong>, mỗi IF có một hộp ở nhánh True — 4 đường (xanh lá, xanh dương, cam, đỏ) = 2 × 2.</li>
</ol>
<p class="nhan">Quy luật đằng sau</p>
<ul>
<li><strong>Nối tiếp → nhân</strong> — n IF độc lập → 2ⁿ đường.</li>
<li><strong>Lồng / bậc thang → cộng</strong> — n quyết định → n + 1 đường.</li>
<li><strong>Path coverage</strong> — mọi đường đi ít nhất một lần: tiêu chí cấu trúc mạnh nhất, nhưng tăng rất nhanh.</li>
</ul>
<p>Vì thế Ví dụ 4 ở slide 95 có 4 đường mà decision coverage chỉ cần 2 test.</p>`],
      [90, 'Paths through code with loops',
        `<p class="y-chinh">🎯 A loop makes the number of paths unlimited, so 100% path coverage is impossible for most real code.</p>
<p class="nhan">What the slide shows</p>
<ul>
<li><strong>Path 1</strong> skips the loop, <strong>path 2</strong> goes round once, <strong>path 3</strong> twice… and the numbering runs on to "8 …".</li>
<li>"<em>for as many times as it is possible to go round the loop (this can be unlimited, i.e. infinite)</em>".</li>
<li>This is the structural version of Principle 2, "exhaustive testing is impossible" (SWT1).</li>
</ul>
<p class="nhan">The practical answer</p>
<ol>
<li><strong>Target decision coverage</strong> — the loop condition must be True at least once and False at least once.</li>
<li><strong>Add the experience rule</strong> — test each loop <strong>0 times, once and many times</strong> (see the ★ box below).</li>
</ol>`,
        `<p class="y-chinh">🎯 Vòng lặp làm số đường đi không có giới hạn, nên 100% path coverage là bất khả thi với hầu hết code thật.</p>
<p class="nhan">Slide cho thấy gì</p>
<ul>
<li><strong>Đường 1</strong> bỏ qua vòng lặp, <strong>đường 2</strong> đi một vòng, <strong>đường 3</strong> hai vòng… và số cứ chạy tiếp tới "8 …".</li>
<li>"<em>đi bao nhiêu vòng cũng được, có thể không giới hạn, tức là vô hạn</em>".</li>
<li>Đây là phiên bản cấu trúc của Nguyên tắc 2 "không thể test vét cạn" (SWT1).</li>
</ul>
<p class="nhan">Cách làm thực tế</p>
<ol>
<li><strong>Lấy decision coverage làm chỉ tiêu</strong> — điều kiện vòng lặp phải đúng ít nhất một lần và sai ít nhất một lần.</li>
<li><strong>Thêm quy tắc kinh nghiệm</strong> — test mỗi vòng lặp <strong>0 lần, 1 lần và nhiều lần</strong> (xem ô ★ bên dưới).</li>
</ol>`],
    ]),
    bi(`<h3>Ví dụ có lời giải · Worked example — measure it, do not guess it</h3>
<p>The discount rule "orders over 100 get 10 off" in Java — the same shape as slide 87 (an IF without ELSE):</p>
<pre><code>public static int discount(int total) {   // line 3
    int d = 0;                            // line 4
    if (total &gt; 100) {                    // line 5  — the only decision
        d = 10;                           // line 6
    }
    return total - d;                     // line 8
}</code></pre>
<p><strong>By reasoning.</strong></p>
<ul>
<li><strong>Executable statements</strong> — lines 4, 5, 6, 8 (4 statements).</li>
<li><strong>Decision outcomes</strong> — <code>total &gt; 100</code> True and False (2 outcomes).</li>
<li><strong>T1: total = 200 → expected 190</strong> — runs lines 4-5-6-8 → statement coverage 4/4 = 100%, but only the True outcome → decision coverage 1/2 = 50%.</li>
<li><strong>T2: total = 50 → expected 50</strong> — the False outcome → decision coverage 2/2 = 100%.</li>
<li><strong>So</strong> — minimum 1 test for 100% statement coverage, 2 tests for 100% decision coverage.</li>
</ul>
<p><strong>By measurement.</strong> We ran exactly these inputs under the JaCoCo 0.8.13 agent (JDK 21) and read the counters with JaCoCo's analyzer. Real output:</p>
<pre><code>disc-1   Coverage.discount  lines 4/4  branches 1/2 (50%)
         missed: L5(1 branch missed)
disc-2   Coverage.discount  lines 4/4  branches 2/2 (100%)</code></pre>
<p>The tool agrees with the hand count, and it points at line 5 — the decision whose False side no test took.</p>
<p>That is how coverage is used in practice: run the black-box tests, read the report, design a test for each red or yellow line.</p>
<div class="pitfall co-tieu-de"><strong>Exam traps.</strong>
<ol>
<li>"100% statement coverage implies 100% decision coverage" — <em>false</em>; it is the other way round.</li>
<li>"Coverage is measured on the specification" — no, statement and decision coverage are measured on the <em>code</em> (black-box techniques have their own coverage items).</li>
<li>Counting <code>ELSE</code>, <code>ENDIF</code> or <code>}</code> as statements.</li>
<li>Forgetting that a loop condition is a decision with a True and a False outcome.</li>
</ol></div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>Stronger criteria and how industry uses them.</strong>
<ul>
<li><strong>Condition coverage</strong> — makes every atomic condition in <code>if (a &amp;&amp; b)</code> both true and false.</li>
<li><strong>MC/DC</strong> (modified condition/decision coverage) — additionally shows that each condition independently changes the decision; required for the most critical avionics software by DO-178C.</li>
<li><strong>Loop testing</strong> (Beizer's heuristic) — skip the loop, 1 pass, 2 passes, a typical number, max−1, max, max+1.</li>
<li><strong>Mutation testing</strong> (PIT for Java) — checks whether your assertions are any good: it plants small bugs and counts how many your tests kill. A suite with 100% coverage and no assertions kills none.</li>
</ul>
<p><em>Outside the syllabus because CTFL 2018 limits white-box testing to statement and decision coverage; the rest is Advanced Technical Test Analyst material.</em></p></div>`,
    `<h3>Ví dụ có lời giải · Đo, đừng đoán</h3>
<p>Quy tắc giảm giá "đơn trên 100 được giảm 10" viết bằng Java — cùng dạng với slide 87 (IF không có ELSE):</p>
<pre><code>public static int discount(int total) {   // dòng 3
    int d = 0;                            // dòng 4
    if (total &gt; 100) {                    // dòng 5  — quyết định duy nhất
        d = 10;                           // dòng 6
    }
    return total - d;                     // dòng 8
}</code></pre>
<p><strong>Bằng lập luận.</strong></p>
<ul>
<li><strong>Câu lệnh thực thi được</strong> — dòng 4, 5, 6, 8 (4 câu lệnh).</li>
<li><strong>Kết quả quyết định</strong> — <code>total &gt; 100</code> True và False (2 kết quả).</li>
<li><strong>T1: total = 200 → mong đợi 190</strong> — chạy dòng 4-5-6-8 → statement coverage 4/4 = 100%, nhưng chỉ có kết quả True → decision coverage 1/2 = 50%.</li>
<li><strong>T2: total = 50 → mong đợi 50</strong> — kết quả False → decision coverage 2/2 = 100%.</li>
<li><strong>Vậy</strong> — tối thiểu 1 test cho 100% statement coverage, 2 test cho 100% decision coverage.</li>
</ul>
<p><strong>Bằng đo đạc.</strong> Chúng tôi chạy đúng các input này dưới agent JaCoCo 0.8.13 (JDK 21) và đọc bộ đếm bằng analyzer của JaCoCo. Output thật:</p>
<pre><code>disc-1   Coverage.discount  lines 4/4  branches 1/2 (50%)
         missed: L5(1 branch missed)
disc-2   Coverage.discount  lines 4/4  branches 2/2 (100%)</code></pre>
<p>Công cụ khớp với phép đếm tay, và nó chỉ đúng dòng 5 — quyết định có nhánh False chưa test nào đi qua.</p>
<p>Đó là cách dùng coverage ngoài thực tế: chạy bộ test black-box, đọc báo cáo, thiết kế một test cho mỗi dòng đỏ hoặc vàng.</p>
<div class="pitfall co-tieu-de"><strong>Bẫy trong đề.</strong>
<ol>
<li>"100% statement coverage kéo theo 100% decision coverage" — <em>sai</em>; ngược lại mới đúng.</li>
<li>"Coverage được đo trên đặc tả" — không, statement và decision coverage đo trên <em>code</em> (kỹ thuật black-box có coverage item riêng).</li>
<li>Đếm <code>ELSE</code>, <code>ENDIF</code> hay <code>}</code> là câu lệnh.</li>
<li>Quên rằng điều kiện vòng lặp cũng là một quyết định có kết quả True và False.</li>
</ol></div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Các tiêu chí mạnh hơn và cách ngành dùng chúng.</strong>
<ul>
<li><strong>Condition coverage</strong> — bắt mỗi điều kiện đơn trong <code>if (a &amp;&amp; b)</code> phải vừa đúng vừa sai.</li>
<li><strong>MC/DC</strong> (modified condition/decision coverage) — còn phải chỉ ra mỗi điều kiện tự nó làm đổi kết quả quyết định; bắt buộc cho phần mềm hàng không mức nghiêm trọng nhất theo DO-178C.</li>
<li><strong>Loop testing</strong> (heuristic của Beizer) — bỏ qua vòng lặp, 1 vòng, 2 vòng, số vòng điển hình, max−1, max, max+1.</li>
<li><strong>Mutation testing</strong> (PIT cho Java) — kiểm assertion của bạn có tốt không: cài những lỗi nhỏ vào code rồi đếm xem test "giết" được bao nhiêu. Bộ test 100% coverage mà không có assertion thì không giết được con nào.</li>
</ul>
<p><em>Ngoài giáo trình vì CTFL 2018 chỉ giới hạn white-box ở statement và decision coverage; phần còn lại thuộc Advanced Technical Test Analyst.</em></p></div>`),
    books([
      ['fst4', 'Ch.4 §3 "White-box test techniques" (statement coverage, decision coverage, value of both) — book pp.132–139 (PDF pp.146–153)', 'Chương 4 §3 "White-box test techniques" (statement coverage, decision coverage, giá trị của hai loại) — trang sách 132–139 (PDF 146–153)'],
      ['fst', '§4.4 "Structure-based or white-box techniques" — pp.105–112 (PDF pp.108–115)', '§4.4 "Structure-based or white-box techniques" — trang 105–112 (PDF 108–115)'],
      ['sp5', '§5.2 "White-Box Test Techniques": statement testing & coverage PDF p.215, decision testing & coverage PDF p.218, evaluation PDF p.232', '§5.2 "White-Box Test Techniques": statement testing & coverage PDF 215, decision testing & coverage PDF 218, đánh giá PDF 232'],
      ['sp4', '§5.2 "White Box Testing Techniques": statement coverage p.146, decision coverage p.148 (PDF pp.161–165)', '§5.2 "White Box Testing Techniques": statement coverage trang 146, decision coverage trang 148 (PDF 161–165)'],
      ['junit', 'Ch.6 "Test quality" — code coverage and how to measure it, PDF pp.103–126', 'Chương 6 "Test quality" — code coverage và cách đo, PDF 103–126'],
    ]),
  ].join('\n'),
};

/* ──────────────── 5.2 Cyclomatic complexity & minimum test sets ──────────────── */
const L52 = {
  title: '5.2 — Cyclomatic complexity V(G), Examples 1–6 & minimum test sets (PE Question 2)|||5.2 — Độ phức tạp chu trình V(G), Ví dụ 1–6 & bộ test tối thiểu (câu 2 PE)',
  slug: 'swt301-cyclomatic-complexity',
  type: 'VIDEO',
  description: 'SWT4 slide 91–99 (+ hình tham chiếu SWT3 101–103): vẽ control-flow graph, tính V(G) = E − N + 2, giải đủ 6 ví dụ lưu đồ và 2 câu hỏi; giải trọn câu PE FA23 countCharacters, SP25 calculateRewardPoints, SU24 thuế TNCN bằng JUnit 5 chạy thật.',
  content: [
    bi(`<span class="eyebrow">Chapter 5 · Lesson 5.2 · SWT4 slides 91–99 (+ SWT3 slides 101–103)</span>
<h2>Cyclomatic complexity and the minimum test set</h2>
<p class="lead">This is the lesson that earns points in the practical exam. It walks the six flowchart examples of SWT4 (slides 91–97) and the two questions (98–99), and borrows three cyclomatic-complexity figures from SWT3.</p>
<p>Then it solves three real PE questions end to end — control-flow graph, V(G), minimum tests for 100% statement and 100% decision coverage, JUnit 5 code, real output:</p>
<ul>
<li><strong>FA23 Q2</strong> — countCharacters</li>
<li><strong>SP25 Q3</strong> — calculateRewardPoints</li>
<li><strong>SU24 PE1</strong> — the income-tax flowchart</li>
</ul>
<div class="callout"><strong>Learning objectives.</strong>
<ul>
<li>LO-4.3.1 (K2) and LO-4.3.2 (K2) applied to code and flowcharts</li>
<li>LO-4.3.3 Explain the value of statement and decision coverage (K2)</li>
</ul>
<p>Cyclomatic complexity itself is a static-analysis metric (SWT3, Chapter 3); CTFL 2018 has no separate LO for it, but slides 93–97 ask for it and the PE uses it.</p></div>
<h3>The five-step recipe (use it for every exercise)</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1 · Draw the CFG</div><div class="lz-t">nodes &amp; edges</div><div class="lz-d">one node per block or decision, one edge per possible jump</div></div>
  <div class="lz-step"><div class="lz-k">2 · V(G)</div><div class="lz-t">E − N + 2</div><div class="lz-d">= number of binary decisions + 1</div></div>
  <div class="lz-step"><div class="lz-k">3 · Min for 100% SC</div><div class="lz-t">touch every statement</div><div class="lz-d">count mutually exclusive statements (THEN vs ELSE, different returns)</div></div>
  <div class="lz-step"><div class="lz-k">4 · Min for 100% DC</div><div class="lz-t">every True &amp; False</div><div class="lz-d">one test can take several outcomes if decisions are in sequence or in a loop</div></div>
  <div class="lz-step"><div class="lz-k">5 · Write the tests</div><div class="lz-t">input + expected</div><div class="lz-d">expected result from the spec, never from running the code</div></div>
</div>
<table>
<thead><tr><th>Rule</th><th>Why</th></tr></thead>
<tbody>
<tr><td>min SC ≤ min DC ≤ V(G)</td><td>Decision coverage includes statement coverage; V(G) basis paths cover every edge (when all of them are feasible).</td></tr>
<tr><td>Fully nested IFs → min DC = V(G)</td><td>Each test ends in a different leaf, and there are decisions + 1 leaves (Examples 1, 2, 3).</td></tr>
<tr><td>IFs in sequence → min DC is usually 2</td><td>One test takes all True sides, another all False sides, however many IFs there are (Examples 4, 5, 6) — but paths = 2ⁿ.</td></tr>
<tr><td>IF without ELSE → SC needs only the True side</td><td>The False side has no statement of its own (Examples 2, 5).</td></tr>
<tr><td>Loops → one test can do a lot</td><td>Each iteration can take a different outcome of the IFs inside the loop (countCharacters: V(G) = 5, one test is enough).</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 5 · Bài 5.2 · SWT4 slide 91–99 (+ SWT3 slide 101–103)</span>
<h2>Độ phức tạp chu trình và bộ test tối thiểu</h2>
<p class="lead">Đây là bài kiếm điểm trong kỳ thi thực hành. Nó đi qua sáu ví dụ lưu đồ của SWT4 (slide 91–97) và hai câu hỏi (98–99), và mượn ba hình về cyclomatic complexity từ SWT3.</p>
<p>Rồi nó giải trọn ba câu PE thật — đồ thị luồng điều khiển, V(G), số test tối thiểu cho 100% statement và 100% decision coverage, code JUnit 5, output chạy thật:</p>
<ul>
<li><strong>FA23 câu 2</strong> — countCharacters</li>
<li><strong>SP25 câu 3</strong> — calculateRewardPoints</li>
<li><strong>SU24 PE1</strong> — lưu đồ thuế thu nhập cá nhân</li>
</ul>
<div class="callout"><strong>Chuẩn đầu ra.</strong>
<ul>
<li>LO-4.3.1 (K2) và LO-4.3.2 (K2) áp dụng trên code và lưu đồ</li>
<li>LO-4.3.3 Giải thích giá trị của statement và decision coverage (K2)</li>
</ul>
<p>Bản thân cyclomatic complexity là một chỉ số của phân tích tĩnh (SWT3, Chương 3); CTFL 2018 không có LO riêng cho nó, nhưng slide 93–97 hỏi nó và đề PE dùng nó.</p></div>
<h3>Công thức 5 bước (dùng cho mọi bài tập)</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1 · Vẽ CFG</div><div class="lz-t">node &amp; cạnh</div><div class="lz-d">mỗi khối lệnh hay quyết định là một node, mỗi bước nhảy có thể xảy ra là một cạnh</div></div>
  <div class="lz-step"><div class="lz-k">2 · V(G)</div><div class="lz-t">E − N + 2</div><div class="lz-d">= số quyết định nhị phân + 1</div></div>
  <div class="lz-step"><div class="lz-k">3 · Tối thiểu cho 100% SC</div><div class="lz-t">chạm mọi câu lệnh</div><div class="lz-d">đếm các câu lệnh loại trừ nhau (THEN vs ELSE, các return khác nhau)</div></div>
  <div class="lz-step"><div class="lz-k">4 · Tối thiểu cho 100% DC</div><div class="lz-t">mọi True &amp; False</div><div class="lz-d">một test có thể đi nhiều kết quả nếu các quyết định nối tiếp hoặc nằm trong vòng lặp</div></div>
  <div class="lz-step"><div class="lz-k">5 · Viết test</div><div class="lz-t">input + mong đợi</div><div class="lz-d">kết quả mong đợi lấy từ đặc tả, không bao giờ lấy từ việc chạy code</div></div>
</div>
<table>
<thead><tr><th>Quy tắc</th><th>Vì sao</th></tr></thead>
<tbody>
<tr><td>min SC ≤ min DC ≤ V(G)</td><td>Decision coverage bao hàm statement coverage; các basis path của V(G) phủ mọi cạnh (khi tất cả chúng đều khả thi).</td></tr>
<tr><td>IF lồng hoàn toàn → min DC = V(G)</td><td>Mỗi test kết thúc ở một lá khác nhau, và có số quyết định + 1 lá (Ví dụ 1, 2, 3).</td></tr>
<tr><td>IF nối tiếp → min DC thường là 2</td><td>Một test đi hết các nhánh True, một test đi hết các nhánh False, bao nhiêu IF cũng vậy (Ví dụ 4, 5, 6) — nhưng số đường = 2ⁿ.</td></tr>
<tr><td>IF không có ELSE → SC chỉ cần nhánh True</td><td>Nhánh False không có câu lệnh riêng (Ví dụ 2, 5).</td></tr>
<tr><td>Vòng lặp → một test làm được rất nhiều</td><td>Mỗi lần lặp có thể đi một kết quả khác của các IF bên trong (countCharacters: V(G) = 5 mà một test là đủ).</td></tr>
</tbody>
</table>`),
    bi(`<h3>🔁 Cross-reference from SWT3 — where V(G) comes from</h3>
<p>Cyclomatic complexity was introduced in Chapter 3 (static analysis) as a <em>code metric</em>. The three SWT3 slides below are repeated here as <strong>cross-reference figures from SWT3</strong> because slides 93–97 of SWT4 ask for V(G) without re-explaining it. Their place in the static-analysis story is covered in the Chapter 3 lessons.</p>`,
    `<h3>🔁 Tham chiếu chéo từ SWT3 — V(G) từ đâu ra</h3>
<p>Cyclomatic complexity được giới thiệu ở Chương 3 (phân tích tĩnh) như một <em>chỉ số đo code</em>. Ba slide SWT3 dưới đây được nhắc lại như <strong>hình tham chiếu chéo từ SWT3</strong> vì slide 93–97 của SWT4 hỏi V(G) mà không giải thích lại. Vị trí của chúng trong câu chuyện phân tích tĩnh nằm ở các bài Chương 3.</p>`),
    walk('swt3', [
      [101, 'Cyclomatic complexity (cross-reference from SWT3)',
        `<p class="y-chinh">🎯 Cyclomatic complexity (McCabe, 1976) is one number for how complex a flow graph — and so its code — is: decisions + 1.</p>
<p class="nhan">What the slide says</p>
<ul>
<li><strong>Definition</strong> — "a measure of the complexity of a flow graph, and therefore of the code that the flow graph represents".</li>
<li><strong>Direction</strong> — the more complex the graph, the greater the number.</li>
<li><strong>Easy formula</strong> — <strong>complexity = number of decisions + 1</strong>.</li>
</ul>
<p class="nhan">The graph formula behind it</p>
<ul>
<li><strong>V(G) = E − N + 2</strong> — E edges, N nodes, for one connected routine; in general E − N + 2P with P components.</li>
<li><strong>Same answer</strong> — both formulas agree when every decision is binary; a CASE with k outcomes counts as k − 1 decisions.</li>
</ul>
<p class="nhan">What the number means</p>
<ul>
<li><strong>Basis paths</strong> — V(G) is the count of <em>linearly independent paths</em> through the routine.</li>
<li><strong>Upper bound</strong> — so it is also an upper bound on the tests needed for decision coverage.</li>
</ul>`,
        `<p class="y-chinh">🎯 Cyclomatic complexity (McCabe, 1976) là một con số đo độ phức tạp của đồ thị luồng — và của code nó biểu diễn: số quyết định + 1.</p>
<p class="nhan">Slide nói gì</p>
<ul>
<li><strong>Định nghĩa</strong> — "thước đo độ phức tạp của một đồ thị luồng, và do đó của đoạn code mà đồ thị biểu diễn".</li>
<li><strong>Chiều tăng</strong> — đồ thị càng phức tạp, con số càng lớn.</li>
<li><strong>Công thức dễ</strong> — <strong>độ phức tạp = số quyết định + 1</strong>.</li>
</ul>
<p class="nhan">Công thức theo đồ thị đứng sau nó</p>
<ul>
<li><strong>V(G) = E − N + 2</strong> — E cạnh, N node, với một routine liên thông; tổng quát là E − N + 2P với P thành phần.</li>
<li><strong>Cùng kết quả</strong> — hai công thức khớp nhau khi mọi quyết định là nhị phân; một CASE có k kết quả tính là k − 1 quyết định.</li>
</ul>
<p class="nhan">Con số có ý nghĩa gì</p>
<ul>
<li><strong>Basis path</strong> — V(G) là số <em>đường độc lập tuyến tính</em> qua routine.</li>
<li><strong>Cận trên</strong> — nên nó cũng là cận trên của số test cần cho decision coverage.</li>
</ul>`],
      [102, 'Which flow graph is most complex? (cross-reference from SWT3)',
        `<p class="y-chinh">🎯 The red numbers are the answers — the V(G) of each graph: count the diamonds and add 1.</p>
<p class="nhan">Graph by graph</p>
<ul>
<li><strong>Graph 1</strong> — two boxes in a straight line, no decision → 0 + 1 = <strong>1</strong>.</li>
<li><strong>Graph 2</strong> — one diamond → 1 + 1 = <strong>2</strong>.</li>
<li><strong>Graph 3</strong> — two diamonds → <strong>3</strong>.</li>
<li><strong>Graph 5</strong> — four diamonds → <strong>5</strong>, the most complex.</li>
</ul>
<p class="nhan">Check one with the graph formula</p>
<p>Graph 2 has 5 nodes (box, diamond, two boxes, end box) and 5 edges → 5 − 5 + 2 = 2.</p>`,
        `<p class="y-chinh">🎯 Các số đỏ là đáp án — V(G) của từng đồ thị: đếm hình thoi rồi cộng 1.</p>
<p class="nhan">Từng đồ thị</p>
<ul>
<li><strong>Đồ thị 1</strong> — hai hộp nối thẳng, không có quyết định → 0 + 1 = <strong>1</strong>.</li>
<li><strong>Đồ thị 2</strong> — một hình thoi → 1 + 1 = <strong>2</strong>.</li>
<li><strong>Đồ thị 3</strong> — hai hình thoi → <strong>3</strong>.</li>
<li><strong>Đồ thị 5</strong> — bốn hình thoi → <strong>5</strong>, phức tạp nhất.</li>
</ul>
<p class="nhan">Kiểm lại một cái bằng công thức đồ thị</p>
<p>Đồ thị 2 có 5 node (hộp, hình thoi, hai hộp, hộp cuối) và 5 cạnh → 5 − 5 + 2 = 2.</p>`],
      [103, 'Example control flow graph (cross-reference from SWT3)',
        `<p class="y-chinh">🎯 A quiz-scoring loop drawn as a control-flow graph: 10 nodes, 12 edges, V(G) = 4 — and just 2 tests cover it.</p>
<p class="nhan">The pseudo-code</p>
<ol>
<li><strong>Loop</strong> — <code>DO WHILE more Questions</code> containing <code>IF Answer = Correct THEN Right = Right + 1</code>.</li>
<li><strong>Score</strong> — <code>Result = Right / Questions</code>.</li>
<li><strong>Verdict</strong> — <code>IF Result &gt; 60% THEN Print "pass" ELSE Print "fail"</code>.</li>
</ol>
<p class="nhan">The graph beside it</p>
<ul>
<li><strong>10 nodes</strong> — init, do, if, r=r+1, end (end of loop body), res, if, pass, fail, end.</li>
<li><strong>12 edges</strong> — init→do, do→if, do→res, if→r=r+1, if→end, r=r+1→end, end→do, res→if, if→pass, if→fail, pass→end, fail→end.</li>
<li><strong>V(G)</strong> = 12 − 10 + 2 = <strong>4</strong> = 3 decisions + 1 ✓.</li>
</ul>
<p class="nhan">Minimum tests</p>
<ul>
<li><strong>Statement coverage: 2</strong> — "pass" and "fail" are both needed. E.g. 2 answers both correct → pass; 2 answers, one correct and one wrong → 50% → fail. The second test also takes the False side of the inner IF.</li>
<li><strong>Decision coverage: the same 2</strong> — the loop condition is True and False in both.</li>
<li><strong>Error-guessing idea for Chapter 6</strong> — <code>Questions = 0</code> → division by zero.</li>
</ul>`,
        `<p class="y-chinh">🎯 Vòng lặp chấm bài trắc nghiệm vẽ thành control-flow graph: 10 node, 12 cạnh, V(G) = 4 — và chỉ cần 2 test để phủ.</p>
<p class="nhan">Mã giả</p>
<ol>
<li><strong>Vòng lặp</strong> — <code>DO WHILE more Questions</code> chứa <code>IF Answer = Correct THEN Right = Right + 1</code>.</li>
<li><strong>Tính điểm</strong> — <code>Result = Right / Questions</code>.</li>
<li><strong>Kết luận</strong> — <code>IF Result &gt; 60% THEN Print "pass" ELSE Print "fail"</code>.</li>
</ol>
<p class="nhan">Đồ thị bên cạnh</p>
<ul>
<li><strong>10 node</strong> — init, do, if, r=r+1, end (cuối thân vòng lặp), res, if, pass, fail, end.</li>
<li><strong>12 cạnh</strong> — init→do, do→if, do→res, if→r=r+1, if→end, r=r+1→end, end→do, res→if, if→pass, if→fail, pass→end, fail→end.</li>
<li><strong>V(G)</strong> = 12 − 10 + 2 = <strong>4</strong> = 3 quyết định + 1 ✓.</li>
</ul>
<p class="nhan">Số test tối thiểu</p>
<ul>
<li><strong>Statement coverage: 2</strong> — cần cả "pass" lẫn "fail". Vd 2 câu đều đúng → pass; 2 câu, một đúng một sai → 50% → fail. Test thứ hai cũng đi nhánh False của IF bên trong.</li>
<li><strong>Decision coverage: chính 2 test đó</strong> — điều kiện vòng lặp có cả True và False trong cả hai.</li>
<li><strong>Ý error guessing cho Chương 6</strong> — <code>Questions = 0</code> → chia cho 0.</li>
</ul>`],
    ]),
    walkHead(D, 91, 99, 'Every "fill in the blank" example is solved below with the graph, the formula and the concrete tests — cover the answers and try first.', 'Mọi ví dụ "điền vào chỗ trống" đều được giải bên dưới bằng đồ thị, công thức và test cụ thể — hãy che đáp án và tự làm trước.'),
    walk(D, [
      [91, 'Example 1 — ATM card and PIN (pseudo-code)',
        `<p class="y-chinh">🎯 An ATM in pseudo-code: the PIN decision is <strong>nested</strong> inside the THEN of the card decision.</p>
<p class="nhan">The pseudo-code, step by step</p>
<ol>
<li>Wait for a card.</li>
<li><code>IF card is a valid card THEN</code> display "Enter PIN number", and
<ul>
<li><code>IF PIN is valid THEN</code> select transaction</li>
<li><code>ELSE</code> display "PIN invalid"</li>
</ul></li>
<li><code>ELSE</code> reject card.</li>
<li>End.</li>
</ol>
<p class="nhan">Try before turning the page</p>
<ul>
<li>How many decisions?</li>
<li>How many different "endings"?</li>
</ul>
<p class="ghi-chu">Answers on slide 92.</p>`,
        `<p class="y-chinh">🎯 Máy ATM viết bằng mã giả: quyết định PIN <strong>lồng</strong> bên trong nhánh THEN của quyết định thẻ.</p>
<p class="nhan">Mã giả, từng bước</p>
<ol>
<li>Chờ thẻ.</li>
<li><code>IF thẻ hợp lệ THEN</code> hiển thị "Enter PIN number", và
<ul>
<li><code>IF PIN hợp lệ THEN</code> chọn giao dịch</li>
<li><code>ELSE</code> hiển thị "PIN invalid"</li>
</ul></li>
<li><code>ELSE</code> từ chối thẻ.</li>
<li>End.</li>
</ol>
<p class="nhan">Tự thử trước khi lật slide</p>
<ul>
<li>Có mấy quyết định?</li>
<li>Có mấy "kết cục" khác nhau?</li>
</ul>
<p class="ghi-chu">Đáp án ở slide 92.</p>`],
      [92, 'Example 1 — the flowchart',
        `<p class="y-chinh">🎯 Fully nested decisions: V(G) = 3, and statement and decision coverage both need 3 tests.</p>
<p class="nhan">The flowchart</p>
<ul>
<li><strong>Wait</strong> → <em>Valid card?</em></li>
<li><strong>Card = No</strong> → Reject card → End.</li>
<li><strong>Card = Yes</strong> → Display "Enter…" → <em>Valid PIN?</em> — Yes → Select trans… → End; No → Display "PIN in…" → End.</li>
</ul>
<p class="nhan">Full solution (the slide gives no numbers)</p>
<ul>
<li><strong>V(G)</strong>: 2 decisions + 1 = <strong>3</strong>. Graph check: nodes Wait, Valid card, Display Enter, Valid PIN, Select, PIN invalid, Reject, End = 8; edges = 9 (Wait→card, card→Display, card→Reject, Display→PIN, PIN→Select, PIN→Invalid, Select→End, Invalid→End, Reject→End) → 9 − 8 + 2 = 3.</li>
<li><strong>Minimum tests for 100% statement coverage: 3</strong> — "Reject card", "Select transaction" and "PIN invalid" are on three mutually exclusive paths, and each test reaches only one of them.</li>
<li><strong>Minimum tests for 100% decision coverage: 3</strong> — the same three tests: T1 invalid card (card = No); T2 valid card + valid PIN (card = Yes, PIN = Yes); T3 valid card + wrong PIN (card = Yes, PIN = No).</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> fully nested decisions → min SC = min DC = V(G) = number of paths = 3.</p>`,
        `<p class="y-chinh">🎯 Quyết định lồng hoàn toàn: V(G) = 3, và cả statement lẫn decision coverage đều cần 3 test.</p>
<p class="nhan">Lưu đồ</p>
<ul>
<li><strong>Wait</strong> → <em>Valid card?</em></li>
<li><strong>Card = No</strong> → Reject card → End.</li>
<li><strong>Card = Yes</strong> → Display "Enter…" → <em>Valid PIN?</em> — Yes → Select trans… → End; No → Display "PIN in…" → End.</li>
</ul>
<p class="nhan">Lời giải đầy đủ (slide không cho đáp số)</p>
<ul>
<li><strong>V(G)</strong>: 2 quyết định + 1 = <strong>3</strong>. Kiểm bằng đồ thị: các node Wait, Valid card, Display Enter, Valid PIN, Select, PIN invalid, Reject, End = 8; cạnh = 9 (Wait→card, card→Display, card→Reject, Display→PIN, PIN→Select, PIN→Invalid, Select→End, Invalid→End, Reject→End) → 9 − 8 + 2 = 3.</li>
<li><strong>Số test tối thiểu cho 100% statement coverage: 3</strong> — "Reject card", "Select transaction" và "PIN invalid" nằm trên ba đường loại trừ nhau, mỗi test chỉ tới được một cái.</li>
<li><strong>Số test tối thiểu cho 100% decision coverage: 3</strong> — chính ba test đó: T1 thẻ không hợp lệ (card = No); T2 thẻ hợp lệ + PIN đúng (card = Yes, PIN = Yes); T3 thẻ hợp lệ + PIN sai (card = Yes, PIN = No).</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> quyết định lồng hoàn toàn → min SC = min DC = V(G) = số đường = 3.</p>`],
      [93, 'Example 2 — IF A > 0 THEN IF A = 21 THEN Print "Key"',
        `<p class="y-chinh">🎯 Two nested IFs without ELSE: one test runs every statement, but decision coverage needs 3.</p>
<p class="nhan">The slide</p>
<ul>
<li><strong>Code</strong> — <code>Read A; IF A &gt; 0 THEN IF A = 21 THEN Print "Key" ENDIF ENDIF</code>.</li>
<li><strong>Flowchart</strong> — Read → <em>A&gt;0</em> — No → End; Yes → <em>A=21</em> — No → End; Yes → Print → End.</li>
<li><strong>Red answers</strong> — <strong>V(G) = 3, statement coverage 1, branch coverage 3</strong>.</li>
</ul>
<p class="nhan">Why</p>
<ul>
<li><strong>V(G)</strong>: 2 decisions + 1 = 3 (graph: 5 nodes Read, A&gt;0, A=21, Print, End; 6 edges → 6 − 5 + 2 = 3).</li>
<li><strong>Statement coverage = 1</strong>: A = 21 passes both decisions and runs every statement (both IFs are IF-without-ELSE, so the False sides contain no statement).</li>
<li><strong>Decision coverage = 3</strong>: A = 21 (True, True), A = 5 (A&gt;0 True, A=21 False), A = −3 (A&gt;0 False).</li>
<li><strong>Why not 2</strong> — A&gt;0 False ends the program immediately, so a second test can reach only one of the two outcomes of A = 21.</li>
</ul>`,
        `<p class="y-chinh">🎯 Hai IF lồng nhau, không có ELSE: một test chạy hết mọi câu lệnh, nhưng decision coverage cần 3.</p>
<p class="nhan">Slide</p>
<ul>
<li><strong>Code</strong> — <code>Read A; IF A &gt; 0 THEN IF A = 21 THEN Print "Key" ENDIF ENDIF</code>.</li>
<li><strong>Lưu đồ</strong> — Read → <em>A&gt;0</em> — No → End; Yes → <em>A=21</em> — No → End; Yes → Print → End.</li>
<li><strong>Đáp án đỏ</strong> — <strong>V(G) = 3, statement coverage 1, branch coverage 3</strong>.</li>
</ul>
<p class="nhan">Vì sao</p>
<ul>
<li><strong>V(G)</strong>: 2 quyết định + 1 = 3 (đồ thị: 5 node Read, A&gt;0, A=21, Print, End; 6 cạnh → 6 − 5 + 2 = 3).</li>
<li><strong>Statement coverage = 1</strong>: A = 21 qua được cả hai quyết định và chạy mọi câu lệnh (cả hai IF đều không có ELSE, nên nhánh False không chứa câu lệnh nào).</li>
<li><strong>Decision coverage = 3</strong>: A = 21 (True, True), A = 5 (A&gt;0 True, A=21 False), A = −3 (A&gt;0 False).</li>
<li><strong>Vì sao không làm bằng 2</strong> — A&gt;0 False kết thúc chương trình ngay, nên test thứ hai chỉ với tới được một trong hai kết quả của A = 21.</li>
</ul>`],
      [94, 'Example 3 — three nested decisions',
        `<p class="y-chinh">🎯 Three nested levels: V(G) = 4, statement coverage 2, decision coverage 4 = V(G).</p>
<p class="nhan">The slide</p>
<ul>
<li><strong>Code</strong> — <code>Read A; Read B; IF A &gt; 0 THEN IF B = 0 THEN Print "No values" ELSE Print B; IF A &gt; 21 THEN Print A ENDIF ENDIF ENDIF</code>.</li>
<li><strong>Answers on the slide</strong> — <strong>V(G) = 4, statement coverage 2, branch coverage 4</strong>.</li>
</ul>
<p class="nhan">Why</p>
<ul>
<li><strong>V(G)</strong>: 3 decisions + 1 = 4. Graph: nodes Read, A&gt;0, B=0, Print "No values", Print B, A&gt;21, Print A, End = 8; edges = 10 → 10 − 8 + 2 = 4.</li>
<li><strong>Statement coverage = 2</strong>: "No values" and "Print B" are THEN/ELSE of the same IF, so two tests are needed.
<ul>
<li>T1 (A = 1, B = 0) prints "No values".</li>
<li>T2 (A = 30, B = 5) prints B and then A (30 &gt; 21) — one test covers both "Print B" and "Print A".</li>
</ul></li>
<li><strong>Decision coverage = 4</strong>: T1 and T2, plus T3 (A = −1, any B) for A&gt;0 False and T4 (A = 10, B = 5) for A&gt;21 False. Six outcomes, but every test ends in a different leaf of a nested structure, so 4 = V(G).</li>
</ul>
<p class="ghi-chu">Small slide glitch: in the flowchart there is an extra "No" label to the right of "Print A"; only the arrow from the <em>A&gt;21</em> diamond straight to End is the "No" outcome.</p>`,
        `<p class="y-chinh">🎯 Lồng ba tầng: V(G) = 4, statement coverage 2, decision coverage 4 = V(G).</p>
<p class="nhan">Slide</p>
<ul>
<li><strong>Code</strong> — <code>Read A; Read B; IF A &gt; 0 THEN IF B = 0 THEN Print "No values" ELSE Print B; IF A &gt; 21 THEN Print A ENDIF ENDIF ENDIF</code>.</li>
<li><strong>Đáp án trên slide</strong> — <strong>V(G) = 4, statement coverage 2, branch coverage 4</strong>.</li>
</ul>
<p class="nhan">Vì sao</p>
<ul>
<li><strong>V(G)</strong>: 3 quyết định + 1 = 4. Đồ thị: các node Read, A&gt;0, B=0, Print "No values", Print B, A&gt;21, Print A, End = 8; cạnh = 10 → 10 − 8 + 2 = 4.</li>
<li><strong>Statement coverage = 2</strong>: "No values" và "Print B" là THEN/ELSE của cùng một IF nên cần hai test.
<ul>
<li>T1 (A = 1, B = 0) in "No values".</li>
<li>T2 (A = 30, B = 5) in B rồi in A (30 &gt; 21) — một test phủ cả "Print B" lẫn "Print A".</li>
</ul></li>
<li><strong>Decision coverage = 4</strong>: T1, T2, cộng T3 (A = −1, B bất kỳ) cho A&gt;0 False và T4 (A = 10, B = 5) cho A&gt;21 False. Có 6 kết quả, nhưng mỗi test kết thúc ở một lá khác nhau của cấu trúc lồng, nên 4 = V(G).</li>
</ul>
<p class="ghi-chu">Một lỗi nhỏ trên slide: trong lưu đồ có thêm một nhãn "No" bên phải "Print A"; chỉ mũi tên từ hình thoi <em>A&gt;21</em> đi thẳng tới End mới là kết quả "No".</p>`],
      [95, 'Example 4 — two IF-THEN-ELSE in sequence',
        `<p class="y-chinh">🎯 Two IF-THEN-ELSE in sequence: V(G) = 3, but only 2 tests for decision coverage — and 4 paths.</p>
<p class="nhan">The slide</p>
<ul>
<li><strong>Code</strong> — <code>IF A &lt; 0 THEN Print "A negative" ELSE Print "A positive" ENDIF; IF B &lt; 0 THEN Print "B negative" ELSE Print "B positive" ENDIF</code>.</li>
<li><strong>Answers</strong> — <strong>V(G) = 3, statement coverage 2, branch coverage 2</strong>, and the pink note "there are 4 paths".</li>
</ul>
<p class="nhan">Why</p>
<ul>
<li><strong>V(G)</strong> = 2 + 1 = 3.</li>
<li><strong>Statement coverage = 2</strong>: each IF has a statement on both sides, so at least 2 tests. T1 (A = −1, B = −1) prints both "negative"; T2 (A = 1, B = 1) prints both "positive".</li>
<li><strong>Decision coverage = 2</strong>: T1 takes both True outcomes, T2 both False outcomes → 4/4.</li>
<li><strong>Paths</strong> = 2 × 2 = <strong>4</strong> (−/−, −/+, +/−, +/+) — path coverage would need 4 tests.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> this is the classic proof that V(G) (3) is neither the number of paths (4) nor the minimum for decision coverage (2).</p>
<p class="ghi-chu">Bonus defect for Chapter 4 thinking: A = 0 prints "A positive" — zero is not positive; a BVA test at 0 would reveal it.</p>`,
        `<p class="y-chinh">🎯 Hai IF-THEN-ELSE nối tiếp: V(G) = 3, nhưng decision coverage chỉ cần 2 test — và có 4 đường.</p>
<p class="nhan">Slide</p>
<ul>
<li><strong>Code</strong> — <code>IF A &lt; 0 THEN Print "A negative" ELSE Print "A positive" ENDIF; IF B &lt; 0 THEN Print "B negative" ELSE Print "B positive" ENDIF</code>.</li>
<li><strong>Đáp án</strong> — <strong>V(G) = 3, statement coverage 2, branch coverage 2</strong>, và ghi chú hồng "có 4 đường".</li>
</ul>
<p class="nhan">Vì sao</p>
<ul>
<li><strong>V(G)</strong> = 2 + 1 = 3.</li>
<li><strong>Statement coverage = 2</strong>: mỗi IF đều có câu lệnh ở cả hai nhánh nên cần ít nhất 2 test. T1 (A = −1, B = −1) in hai chữ "negative"; T2 (A = 1, B = 1) in hai chữ "positive".</li>
<li><strong>Decision coverage = 2</strong>: T1 đi cả hai kết quả True, T2 cả hai kết quả False → 4/4.</li>
<li><strong>Số đường</strong> = 2 × 2 = <strong>4</strong> (−/−, −/+, +/−, +/+) — path coverage sẽ cần 4 test.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> đây là ví dụ kinh điển chứng minh V(G) (3) không phải số đường (4) cũng không phải số test tối thiểu cho decision coverage (2).</p>
<p class="ghi-chu">Defect tặng thêm theo tư duy Chương 4: A = 0 in ra "A positive" — số 0 không phải số dương; một test BVA tại 0 sẽ lộ ra.</p>`],
      [96, 'Example 5 — two IF without ELSE in sequence',
        `<p class="y-chinh">🎯 Two IF without ELSE in sequence: one test covers every statement, two cover every decision.</p>
<p class="nhan">The slide</p>
<ul>
<li><strong>Code</strong> — <code>IF A &lt; 0 THEN Print "A negative" ENDIF; IF B &lt; 0 THEN Print "B negative" ENDIF</code>.</li>
<li><strong>Answers</strong> — <strong>V(G) = 3, statement coverage 1, branch coverage 2</strong>.</li>
</ul>
<p class="nhan">Why</p>
<ul>
<li><strong>V(G)</strong> = 2 + 1 = 3.</li>
<li><strong>Statement coverage = 1</strong>: A = −1, B = −1 runs both Print statements (no ELSE, so nothing else to cover).</li>
<li><strong>Decision coverage = 2</strong>: add A = 1, B = 1 for both False outcomes.</li>
</ul>
<p class="nhan">Compare with Example 4</p>
<ul>
<li><strong>Same</strong> — V(G) and number of paths (4).</li>
<li><strong>Different</strong> — removing the ELSE parts drops the statement-coverage answer from 2 to 1.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> the difference between SC and DC exists exactly because of "IF without ELSE".</p>`,
        `<p class="y-chinh">🎯 Hai IF không có ELSE nối tiếp: một test phủ mọi câu lệnh, hai test phủ mọi quyết định.</p>
<p class="nhan">Slide</p>
<ul>
<li><strong>Code</strong> — <code>IF A &lt; 0 THEN Print "A negative" ENDIF; IF B &lt; 0 THEN Print "B negative" ENDIF</code>.</li>
<li><strong>Đáp án</strong> — <strong>V(G) = 3, statement coverage 1, branch coverage 2</strong>.</li>
</ul>
<p class="nhan">Vì sao</p>
<ul>
<li><strong>V(G)</strong> = 2 + 1 = 3.</li>
<li><strong>Statement coverage = 1</strong>: A = −1, B = −1 chạy cả hai lệnh Print (không có ELSE nên không còn gì khác để phủ).</li>
<li><strong>Decision coverage = 2</strong>: thêm A = 1, B = 1 cho hai kết quả False.</li>
</ul>
<p class="nhan">So với Ví dụ 4</p>
<ul>
<li><strong>Giống</strong> — V(G) và số đường (4).</li>
<li><strong>Khác</strong> — bỏ phần ELSE thì đáp án statement coverage giảm từ 2 xuống 1.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> chênh lệch giữa SC và DC tồn tại chính vì "IF không có ELSE".</p>`],
      [97, 'Example 6 — IF A < 0 … IF A > 0 (same variable)',
        `<p class="y-chinh">🎯 Same variable in two IFs: "True, True" is infeasible, so statement coverage already needs 2 tests.</p>
<p class="nhan">The slide</p>
<ul>
<li><strong>Code</strong> — <code>Read A; IF A &lt; 0 THEN Print "A negative" ENDIF; IF A &gt; 0 THEN Print "A positive" ENDIF</code>.</li>
<li><strong>Answers</strong> — <strong>V(G) = 3, statement coverage 2, branch coverage 2</strong>.</li>
</ul>
<p class="nhan">Why</p>
<ul>
<li><strong>V(G)</strong> = 2 + 1 = 3 (the formula looks only at the graph, not at what is feasible).</li>
<li><strong>Statement coverage = 2</strong>: the two Prints can never run in the same test, because A cannot be both negative and positive. T1: A = −5 → "A negative"; T2: A = 5 → "A positive".</li>
<li><strong>Decision coverage = 2</strong>: T1 gives A&lt;0 True and A&gt;0 False; T2 gives A&lt;0 False and A&gt;0 True → 4/4 outcomes.</li>
</ul>
<p class="nhan">The trick</p>
<ul>
<li><strong>4 paths in the graph</strong> — but the path "True, True" is <strong>infeasible</strong>.</li>
<li><strong>3 feasible paths</strong> — A &lt; 0, A &gt; 0 and A = 0 (prints nothing): a nice match with V(G) = 3.</li>
<li><strong>A = 0</strong> — exactly the value a boundary-value tester would add.</li>
</ul>`,
        `<p class="y-chinh">🎯 Cùng một biến trong hai IF: đường "True, True" không khả thi, nên statement coverage đã cần 2 test.</p>
<p class="nhan">Slide</p>
<ul>
<li><strong>Code</strong> — <code>Read A; IF A &lt; 0 THEN Print "A negative" ENDIF; IF A &gt; 0 THEN Print "A positive" ENDIF</code>.</li>
<li><strong>Đáp án</strong> — <strong>V(G) = 3, statement coverage 2, branch coverage 2</strong>.</li>
</ul>
<p class="nhan">Vì sao</p>
<ul>
<li><strong>V(G)</strong> = 2 + 1 = 3 (công thức chỉ nhìn đồ thị, không xét đường nào khả thi).</li>
<li><strong>Statement coverage = 2</strong>: hai lệnh Print không bao giờ chạy trong cùng một test, vì A không thể vừa âm vừa dương. T1: A = −5 → "A negative"; T2: A = 5 → "A positive".</li>
<li><strong>Decision coverage = 2</strong>: T1 cho A&lt;0 True và A&gt;0 False; T2 cho A&lt;0 False và A&gt;0 True → đủ 4/4 kết quả.</li>
</ul>
<p class="nhan">Mẹo ở đây</p>
<ul>
<li><strong>Đồ thị có 4 đường</strong> — nhưng đường "True, True" là <strong>không khả thi</strong>.</li>
<li><strong>3 đường khả thi</strong> — A &lt; 0, A &gt; 0 và A = 0 (không in gì): khớp đẹp với V(G) = 3.</li>
<li><strong>A = 0</strong> — chính là giá trị mà người làm phân tích giá trị biên sẽ thêm vào.</li>
</ul>`],
      [98, 'Question — printSum: tests for 100% statement coverage',
        `<p class="y-chinh">🎯 The two <code>println</code> calls sit on mutually exclusive branches, so statement coverage needs 2 tests.</p>
<p class="nhan">The statements</p>
<ol>
<li><code>int result = a + b;</code></li>
<li>the <code>if</code></li>
<li><code>println("red"…)</code></li>
<li>the <code>else if</code></li>
<li><code>println("blue"…)</code></li>
</ol>
<p class="nhan">The minimum set</p>
<ul>
<li><strong>T1</strong> — a = 1, b = 1 (result 2 &gt; 0 → "red2").</li>
<li><strong>T2</strong> — a = −1, b = −1 (result −2 &lt; 0 → "blue-2").</li>
<li><strong>Other options</strong> — 1 is too few; 3 and 4 are more than the <em>minimum</em>.</li>
</ul>
<p class="nhan">Trap for the next level</p>
<ul>
<li><strong>Decision coverage needs 3</strong> — result = 0 (e.g. a = 0, b = 0) is the only way to take the False side of <code>else if (result &lt; 0)</code>.</li>
<li><strong>Checked with JaCoCo</strong> on a copy of the method (the print replaced by a returned String so it can be asserted):
<ul>
<li>2 tests → <code>lines 7/7 branches 3/4 (75%), missed: L15(1 branch missed)</code></li>
<li>3 tests → <code>lines 7/7 branches 4/4 (100%)</code></li>
</ul></li>
</ul>
` + AE('B — 2', 'Option order on the slide is 1, 2, 4, 3 — the answer is the second option.'),
        `<p class="y-chinh">🎯 Hai lệnh <code>println</code> nằm trên hai nhánh loại trừ nhau, nên statement coverage cần 2 test.</p>
<p class="nhan">Các câu lệnh</p>
<ol>
<li><code>int result = a + b;</code></li>
<li>lệnh <code>if</code></li>
<li><code>println("red"…)</code></li>
<li>lệnh <code>else if</code></li>
<li><code>println("blue"…)</code></li>
</ol>
<p class="nhan">Bộ tối thiểu</p>
<ul>
<li><strong>T1</strong> — a = 1, b = 1 (result 2 &gt; 0 → "red2").</li>
<li><strong>T2</strong> — a = −1, b = −1 (result −2 &lt; 0 → "blue-2").</li>
<li><strong>Các phương án khác</strong> — 1 là thiếu; 3 và 4 là nhiều hơn mức <em>tối thiểu</em>.</li>
</ul>
<p class="nhan">Bẫy ở mức tiếp theo</p>
<ul>
<li><strong>Decision coverage cần 3</strong> — result = 0 (vd a = 0, b = 0) là cách duy nhất đi nhánh False của <code>else if (result &lt; 0)</code>.</li>
<li><strong>Đã kiểm bằng JaCoCo</strong> trên bản sao của hàm (thay lệnh in bằng trả về String để assert được):
<ul>
<li>2 test → <code>lines 7/7 branches 3/4 (75%), missed: L15(1 branch missed)</code></li>
<li>3 test → <code>lines 7/7 branches 4/4 (100%)</code></li>
</ul></li>
</ul>
` + AV('B — 2', 'Thứ tự phương án trên slide là 1, 2, 4, 3 — đáp án là phương án thứ hai.')],
      [99, 'Question — one simple IF: tests for 100% decision coverage',
        `<p class="y-chinh">🎯 One simple IF = one decision with two outcomes, True and False; one test takes only one, so 2 are needed and enough.</p>
<p class="nhan">Why the other options are wrong</p>
<ul>
<li><strong>A (1)</strong> — the statement-coverage answer for an IF without ELSE.</li>
<li><strong>C (3)</strong> — confuses the question with a nested/cascaded structure.</li>
<li><strong>D "unknown"</strong> — tempting, but the question says the code has <em>one</em> simple IF, so nothing else can add decision outcomes.</li>
</ul>
` + AE('B — 2', 'Two outcomes, one test each.'),
        `<p class="y-chinh">🎯 Một IF đơn giản = một quyết định có hai kết quả True và False; một test chỉ đi được một kết quả, nên cần và đủ 2 test.</p>
<p class="nhan">Vì sao các phương án khác sai</p>
<ul>
<li><strong>A (1)</strong> — là đáp án statement coverage cho IF không có ELSE.</li>
<li><strong>C (3)</strong> — nhầm với cấu trúc lồng/bậc thang.</li>
<li><strong>D "không xác định"</strong> — dễ bị dụ, nhưng đề nói code chỉ có <em>một</em> IF đơn giản, nên không còn gì khác sinh thêm kết quả quyết định.</li>
</ul>
` + AV('B — 2', 'Hai kết quả, mỗi kết quả một test.')],
    ]),
    bi(`<h3>All six examples on one card</h3>
<div class="table-wrap"><table>
<thead><tr><th>Slide</th><th>Structure</th><th>Decisions</th><th>V(G)</th><th>Min SC</th><th>Min DC</th><th>Paths</th></tr></thead>
<tbody>
<tr><td>91–92 Ex 1</td><td>IF-ELSE nested in THEN of IF-ELSE</td><td>2</td><td>3</td><td>3</td><td>3</td><td>3</td></tr>
<tr><td>93 Ex 2</td><td>IF (no ELSE) nested in IF (no ELSE)</td><td>2</td><td>3</td><td>1</td><td>3</td><td>3</td></tr>
<tr><td>94 Ex 3</td><td>3 nested levels</td><td>3</td><td>4</td><td>2</td><td>4</td><td>4</td></tr>
<tr><td>95 Ex 4</td><td>2 IF-ELSE in sequence</td><td>2</td><td>3</td><td>2</td><td>2</td><td>4</td></tr>
<tr><td>96 Ex 5</td><td>2 IF (no ELSE) in sequence</td><td>2</td><td>3</td><td>1</td><td>2</td><td>4</td></tr>
<tr><td>97 Ex 6</td><td>2 IF in sequence, same variable</td><td>2</td><td>3</td><td>2</td><td>2</td><td>3 feasible</td></tr>
<tr><td>98 printSum</td><td>IF / ELSE IF cascade, no final ELSE</td><td>2</td><td>3</td><td>2</td><td>3</td><td>3</td></tr>
</tbody>
</table></div>`,
    `<h3>Sáu ví dụ trên một tấm thẻ</h3>
<div class="table-wrap"><table>
<thead><tr><th>Slide</th><th>Cấu trúc</th><th>Số quyết định</th><th>V(G)</th><th>Min SC</th><th>Min DC</th><th>Số đường</th></tr></thead>
<tbody>
<tr><td>91–92 VD 1</td><td>IF-ELSE lồng trong THEN của IF-ELSE</td><td>2</td><td>3</td><td>3</td><td>3</td><td>3</td></tr>
<tr><td>93 VD 2</td><td>IF (không ELSE) lồng trong IF (không ELSE)</td><td>2</td><td>3</td><td>1</td><td>3</td><td>3</td></tr>
<tr><td>94 VD 3</td><td>lồng 3 tầng</td><td>3</td><td>4</td><td>2</td><td>4</td><td>4</td></tr>
<tr><td>95 VD 4</td><td>2 IF-ELSE nối tiếp</td><td>2</td><td>3</td><td>2</td><td>2</td><td>4</td></tr>
<tr><td>96 VD 5</td><td>2 IF (không ELSE) nối tiếp</td><td>2</td><td>3</td><td>1</td><td>2</td><td>4</td></tr>
<tr><td>97 VD 6</td><td>2 IF nối tiếp, cùng một biến</td><td>2</td><td>3</td><td>2</td><td>2</td><td>3 khả thi</td></tr>
<tr><td>98 printSum</td><td>bậc thang IF / ELSE IF, không có ELSE cuối</td><td>2</td><td>3</td><td>2</td><td>3</td><td>3</td></tr>
</tbody>
</table></div>`),
    bi(`<h3>Ví dụ có lời giải A · PE FA23 Question 2 — countCharacters(String)</h3>
<p><em>"Assuming you are assigned to conduct the component test for the method below, please design and create the minimum component test cases (Unit Test case) needed to achieve 100% statement coverage and 100% decision coverage."</em> The method, exactly as in the paper (line numbers as in the paper):</p>
<pre><code> 3  public static HashMap&lt;String, Integer&gt; countCharacters(String input) {
 4      int upperCaseCount = 0;
 5      int lowerCaseCount = 0;
 6      int numericCount = 0;
 7      int specialCharCount = 0;
 9      for (char c : input.toCharArray()) {
10          if (Character.isUpperCase(c)) {
11              upperCaseCount++;
12          } else if (Character.isLowerCase(c)) {
13              lowerCaseCount++;
14          } else if (Character.isDigit(c)) {
15              numericCount++;
16          } else {
17              specialCharCount++;
18          }
19      }
21      HashMap&lt;String, Integer&gt; characterCounts = new HashMap&lt;&gt;();
22-25   characterCounts.put("UpperCase", …); … put("SpecialCharacter", …);
27      return characterCounts;
28  }</code></pre>
<p><strong>Step 1 — control-flow graph (in a table).</strong></p>
<div class="table-wrap"><table>
<thead><tr><th>Node</th><th>Lines</th><th>Content</th><th>Out-edges</th></tr></thead>
<tbody>
<tr><td>N1</td><td>4–7</td><td>four counters = 0</td><td>→ N2</td></tr>
<tr><td>N2</td><td>9</td><td><strong>D1</strong> another character?</td><td>True → N3 · False → N10</td></tr>
<tr><td>N3</td><td>10</td><td><strong>D2</strong> isUpperCase(c)?</td><td>True → N4 · False → N5</td></tr>
<tr><td>N4</td><td>11</td><td>upperCaseCount++</td><td>→ N2</td></tr>
<tr><td>N5</td><td>12</td><td><strong>D3</strong> isLowerCase(c)?</td><td>True → N6 · False → N7</td></tr>
<tr><td>N6</td><td>13</td><td>lowerCaseCount++</td><td>→ N2</td></tr>
<tr><td>N7</td><td>14</td><td><strong>D4</strong> isDigit(c)?</td><td>True → N8 · False → N9</td></tr>
<tr><td>N8</td><td>15</td><td>numericCount++</td><td>→ N2</td></tr>
<tr><td>N9</td><td>17</td><td>specialCharCount++</td><td>→ N2</td></tr>
<tr><td>N10</td><td>21–27</td><td>build the map, return</td><td>(exit)</td></tr>
</tbody>
</table></div>
<p><strong>Step 2 — V(G).</strong> N = 10 nodes, E = 13 edges (1 + 2 + 2 + 1 + 2 + 1 + 2 + 1 + 1 = 13) → V(G) = 13 − 10 + 2 = <strong>5</strong> = 4 decisions (D1–D4) + 1 ✓.</p>
<p><strong>Step 3 &amp; 4 — minimum tests.</strong> The loop is the key: each character is one trip through the loop and can take a <em>different</em> branch. Trace of one input <code>"Ab1@"</code>:</p>
<div class="table-wrap"><table>
<thead><tr><th>Trip</th><th>c</th><th>D1</th><th>D2 upper?</th><th>D3 lower?</th><th>D4 digit?</th><th>Statement run</th></tr></thead>
<tbody>
<tr><td>1</td><td>'A'</td><td>T</td><td>T</td><td>–</td><td>–</td><td>line 11</td></tr>
<tr><td>2</td><td>'b'</td><td>T</td><td>F</td><td>T</td><td>–</td><td>line 13</td></tr>
<tr><td>3</td><td>'1'</td><td>T</td><td>F</td><td>F</td><td>T</td><td>line 15</td></tr>
<tr><td>4</td><td>'@'</td><td>T</td><td>F</td><td>F</td><td>F</td><td>line 17</td></tr>
<tr><td>end</td><td>–</td><td>F</td><td colspan="3">loop exits</td><td>lines 21–27</td></tr>
</tbody>
</table></div>
<p>All 10 nodes and all 8 decision outcomes (D1–D4 each True and False) are exercised → <strong>the minimum is 1 test case for 100% statement coverage and the same 1 test case for 100% decision coverage.</strong> V(G) = 5 does not contradict this: V(G) counts <em>basis paths</em> — five independent paths such as <code>""</code>, <code>"A"</code>, <code>"a"</code>, <code>"1"</code>, <code>"@"</code> — and is only an upper bound for decision coverage.</p>
<p><strong>Step 5 — the test case in the Question 2 template</strong> (grey cells unchanged; "O" marks which input/result belongs to which case):</p>
<div class="table-wrap"><table>
<thead><tr><th></th><th></th><th>UTCID01</th></tr></thead>
<tbody>
<tr><td>Condition · Precondition</td><td>none (static method, no state)</td><td>O</td></tr>
<tr><td>Input · input</td><td><code>"Ab1@"</code></td><td>O</td></tr>
<tr><td>Confirm · Return</td><td><code>{UpperCase=1, LowerCase=1, Numeric=1, SpecialCharacter=1}</code></td><td>O</td></tr>
<tr><td>Exception / Log message</td><td>none</td><td></td></tr>
<tr><td>Result · Type</td><td>N (normal)</td><td>N</td></tr>
</tbody>
</table></div>
<p>The JUnit 5 test class (UTCID02 and UTCID03 are <em>extra</em> boundary/abnormal cases, labelled as such — the coverage question does not need them, but they show you know the method's weak spots):</p>
<pre><code>class CharacterCounterTest {
    @Test @DisplayName("UTCID01 (N) \\"Ab1@\\" -&gt; U1 L1 N1 S1  [the whole minimum set]")
    void allFourKinds() {
        HashMap&lt;String, Integer&gt; r = CharacterCounter.countCharacters("Ab1@");
        assertEquals(1, r.get("UpperCase"));
        assertEquals(1, r.get("LowerCase"));
        assertEquals(1, r.get("Numeric"));
        assertEquals(1, r.get("SpecialCharacter"));
    }
    @Test @DisplayName("UTCID02 (B) \\"\\" -&gt; all 0  [extra, not needed for coverage]")
    void emptyString() { … sum of the four counts == 0 … }
    @Test @DisplayName("UTCID03 (A) null -&gt; NullPointerException  [extra, error guessing]")
    void nullInput() {
        assertThrows(NullPointerException.class, () -&gt; CharacterCounter.countCharacters(null));
    }
}</code></pre>
<p>Compiled with <code>javac</code> (JDK 21.0.9) against JUnit 5.12.2 and run through the JUnit Platform launcher — real output:</p>
<pre><code>PASS  UTCID03 (A) null -&gt; NullPointerException  [extra, error guessing]
PASS  UTCID02 (B) "" -&gt; all 0  [extra, not needed for coverage]
PASS  UTCID01 (N) "Ab1@" -&gt; U1 L1 N1 S1  [the whole minimum set]
3 of 3 tests passed</code></pre>
<p>And the coverage of the minimum set alone, measured with JaCoCo — compared with a "one test per character type" set that looks bigger but misses the special-character branch:</p>
<pre><code>cc-1     CharacterCounter.countCharacters  lines 18/18  branches 8/8 (100%)      &lt;- "Ab1@"
cc-3     CharacterCounter.countCharacters  lines 17/18  branches 7/8 (88%)       &lt;- "A", "b", "1"
         missed: L14(1 branch missed) L17(not run)</code></pre>`,
    `<h3>Ví dụ có lời giải A · PE FA23 câu 2 — countCharacters(String)</h3>
<p><em>"Giả sử bạn được giao component test cho phương thức dưới đây, hãy thiết kế và tạo số component test case (Unit Test case) tối thiểu cần để đạt 100% statement coverage và 100% decision coverage."</em> Phương thức, đúng như trong đề (số dòng như trong đề):</p>
<pre><code> 3  public static HashMap&lt;String, Integer&gt; countCharacters(String input) {
 4      int upperCaseCount = 0;
 5      int lowerCaseCount = 0;
 6      int numericCount = 0;
 7      int specialCharCount = 0;
 9      for (char c : input.toCharArray()) {
10          if (Character.isUpperCase(c)) {
11              upperCaseCount++;
12          } else if (Character.isLowerCase(c)) {
13              lowerCaseCount++;
14          } else if (Character.isDigit(c)) {
15              numericCount++;
16          } else {
17              specialCharCount++;
18          }
19      }
21      HashMap&lt;String, Integer&gt; characterCounts = new HashMap&lt;&gt;();
22-25   characterCounts.put("UpperCase", …); … put("SpecialCharacter", …);
27      return characterCounts;
28  }</code></pre>
<p><strong>Bước 1 — đồ thị luồng điều khiển (dạng bảng).</strong></p>
<div class="table-wrap"><table>
<thead><tr><th>Node</th><th>Dòng</th><th>Nội dung</th><th>Cạnh ra</th></tr></thead>
<tbody>
<tr><td>N1</td><td>4–7</td><td>bốn bộ đếm = 0</td><td>→ N2</td></tr>
<tr><td>N2</td><td>9</td><td><strong>D1</strong> còn ký tự không?</td><td>True → N3 · False → N10</td></tr>
<tr><td>N3</td><td>10</td><td><strong>D2</strong> isUpperCase(c)?</td><td>True → N4 · False → N5</td></tr>
<tr><td>N4</td><td>11</td><td>upperCaseCount++</td><td>→ N2</td></tr>
<tr><td>N5</td><td>12</td><td><strong>D3</strong> isLowerCase(c)?</td><td>True → N6 · False → N7</td></tr>
<tr><td>N6</td><td>13</td><td>lowerCaseCount++</td><td>→ N2</td></tr>
<tr><td>N7</td><td>14</td><td><strong>D4</strong> isDigit(c)?</td><td>True → N8 · False → N9</td></tr>
<tr><td>N8</td><td>15</td><td>numericCount++</td><td>→ N2</td></tr>
<tr><td>N9</td><td>17</td><td>specialCharCount++</td><td>→ N2</td></tr>
<tr><td>N10</td><td>21–27</td><td>tạo map, return</td><td>(thoát)</td></tr>
</tbody>
</table></div>
<p><strong>Bước 2 — V(G).</strong> N = 10 node, E = 13 cạnh (1 + 2 + 2 + 1 + 2 + 1 + 2 + 1 + 1 = 13) → V(G) = 13 − 10 + 2 = <strong>5</strong> = 4 quyết định (D1–D4) + 1 ✓.</p>
<p><strong>Bước 3 &amp; 4 — số test tối thiểu.</strong> Chìa khoá là vòng lặp: mỗi ký tự là một lượt đi qua vòng lặp và có thể rẽ vào một nhánh <em>khác</em>. Dò vết một input <code>"Ab1@"</code>:</p>
<div class="table-wrap"><table>
<thead><tr><th>Lượt</th><th>c</th><th>D1</th><th>D2 hoa?</th><th>D3 thường?</th><th>D4 số?</th><th>Câu lệnh chạy</th></tr></thead>
<tbody>
<tr><td>1</td><td>'A'</td><td>T</td><td>T</td><td>–</td><td>–</td><td>dòng 11</td></tr>
<tr><td>2</td><td>'b'</td><td>T</td><td>F</td><td>T</td><td>–</td><td>dòng 13</td></tr>
<tr><td>3</td><td>'1'</td><td>T</td><td>F</td><td>F</td><td>T</td><td>dòng 15</td></tr>
<tr><td>4</td><td>'@'</td><td>T</td><td>F</td><td>F</td><td>F</td><td>dòng 17</td></tr>
<tr><td>hết</td><td>–</td><td>F</td><td colspan="3">thoát vòng lặp</td><td>dòng 21–27</td></tr>
</tbody>
</table></div>
<p>Cả 10 node và cả 8 kết quả quyết định (D1–D4 mỗi cái True và False) đều được chạy → <strong>tối thiểu là 1 test case cho 100% statement coverage và cũng chính 1 test case đó cho 100% decision coverage.</strong> V(G) = 5 không mâu thuẫn với điều này: V(G) đếm <em>basis path</em> — năm đường độc lập như <code>""</code>, <code>"A"</code>, <code>"a"</code>, <code>"1"</code>, <code>"@"</code> — và chỉ là cận trên cho decision coverage.</p>
<p><strong>Bước 5 — test case trong template câu 2</strong> (giữ nguyên ô xám; "O" đánh dấu input/kết quả thuộc ca nào):</p>
<div class="table-wrap"><table>
<thead><tr><th></th><th></th><th>UTCID01</th></tr></thead>
<tbody>
<tr><td>Condition · Precondition</td><td>không có (phương thức static, không có trạng thái)</td><td>O</td></tr>
<tr><td>Input · input</td><td><code>"Ab1@"</code></td><td>O</td></tr>
<tr><td>Confirm · Return</td><td><code>{UpperCase=1, LowerCase=1, Numeric=1, SpecialCharacter=1}</code></td><td>O</td></tr>
<tr><td>Exception / Log message</td><td>không có</td><td></td></tr>
<tr><td>Result · Type</td><td>N (normal)</td><td>N</td></tr>
</tbody>
</table></div>
<p>Class test JUnit 5 (UTCID02 và UTCID03 là các ca biên/bất thường <em>thêm</em>, có ghi rõ — câu hỏi coverage không cần chúng, nhưng chúng cho thấy bạn biết điểm yếu của hàm):</p>
<pre><code>class CharacterCounterTest {
    @Test @DisplayName("UTCID01 (N) \\"Ab1@\\" -&gt; U1 L1 N1 S1  [the whole minimum set]")
    void allFourKinds() {
        HashMap&lt;String, Integer&gt; r = CharacterCounter.countCharacters("Ab1@");
        assertEquals(1, r.get("UpperCase"));
        assertEquals(1, r.get("LowerCase"));
        assertEquals(1, r.get("Numeric"));
        assertEquals(1, r.get("SpecialCharacter"));
    }
    @Test @DisplayName("UTCID02 (B) \\"\\" -&gt; all 0  [extra, not needed for coverage]")
    void emptyString() { … tổng bốn bộ đếm == 0 … }
    @Test @DisplayName("UTCID03 (A) null -&gt; NullPointerException  [extra, error guessing]")
    void nullInput() {
        assertThrows(NullPointerException.class, () -&gt; CharacterCounter.countCharacters(null));
    }
}</code></pre>
<p>Biên dịch bằng <code>javac</code> (JDK 21.0.9) với JUnit 5.12.2 và chạy qua JUnit Platform launcher — output thật:</p>
<pre><code>PASS  UTCID03 (A) null -&gt; NullPointerException  [extra, error guessing]
PASS  UTCID02 (B) "" -&gt; all 0  [extra, not needed for coverage]
PASS  UTCID01 (N) "Ab1@" -&gt; U1 L1 N1 S1  [the whole minimum set]
3 of 3 tests passed</code></pre>
<p>Và coverage của riêng bộ tối thiểu, đo bằng JaCoCo — so với bộ "mỗi loại ký tự một test" trông nhiều hơn nhưng bỏ sót nhánh ký tự đặc biệt:</p>
<pre><code>cc-1     CharacterCounter.countCharacters  lines 18/18  branches 8/8 (100%)      &lt;- "Ab1@"
cc-3     CharacterCounter.countCharacters  lines 17/18  branches 7/8 (88%)       &lt;- "A", "b", "1"
         missed: L14(1 branch missed) L17(not run)</code></pre>`),
    bi(`<h3>Ví dụ có lời giải B · PE SP25 Question 3 — calculateRewardPoints (a discount-style method)</h3>
<pre><code>public int calculateRewardPoints(double bookingAmount, String customerType) {
    if (bookingAmount &lt; 0) {                         // D1
        return -1;
    } else if (customerType.equals("VIP")) {         // D2
        return (int) (bookingAmount * 0.1);
    } else if (customerType.equals("Regular")) {     // D3
        return (int) (bookingAmount * 0.05);
    } else {
        return 0;
    }
}</code></pre>
<p class="nhan">CFG in words</p>
<ul>
<li><strong>D1</strong> — True → return −1; False → D2.</li>
<li><strong>D2</strong> — True → return 10%; False → D3.</li>
<li><strong>D3</strong> — True → return 5%; False → return 0.</li>
<li><strong>Exit</strong> — all four returns go to the exit.</li>
<li><strong>V(G)</strong> — N = 8 (D1, D2, D3, four returns, exit), E = 10 (six decision edges + four return→exit) → V(G) = 10 − 8 + 2 = <strong>4</strong> = 3 decisions + 1.</li>
</ul>
<p class="nhan">Minimum tests</p>
<ul>
<li><strong>4 tests for 100% statement coverage</strong> — the four <code>return</code> statements are mutually exclusive (each call leaves through exactly one).</li>
<li><strong>4 tests for 100% decision coverage</strong> — the same 4 give every True/False of D1–D3 (a cascade: min SC = min DC = V(G)).</li>
</ul>
<div class="table-wrap"><table>
<thead><tr><th>ID</th><th>bookingAmount</th><th>customerType</th><th>Expected</th><th>Outcomes covered</th></tr></thead>
<tbody>
<tr><td>UTCID01 (A)</td><td>−1</td><td>"VIP"</td><td>−1</td><td>D1 T</td></tr>
<tr><td>UTCID02 (N)</td><td>1000</td><td>"VIP"</td><td>100</td><td>D1 F, D2 T</td></tr>
<tr><td>UTCID03 (N)</td><td>1000</td><td>"Regular"</td><td>50</td><td>D2 F, D3 T</td></tr>
<tr><td>UTCID04 (N)</td><td>1000</td><td>"Guest"</td><td>0</td><td>D3 F</td></tr>
</tbody>
</table></div>
<p>SP25 also asks for 100% equivalence-partition and boundary-value coverage, so we added five more cases:</p>
<ul>
<li><strong>EP</strong> — amount &lt; 0 / ≥ 0; type VIP / Regular / other.</li>
<li><strong>BVA</strong> — −0.01 and 0.</li>
<li><strong>Error guessing</strong> — truncation, lower-case "vip", null.</li>
</ul>
<p>Real JUnit output (JUnit 5.12.2, JDK 21):</p>
<pre><code>PASS  UTCID09 (A) 100, null     -&gt; NullPointerException
PASS  UTCID08 (A) 100, "vip"    -&gt; 0   (equals is case-sensitive)
PASS  UTCID02 (N) 1000, "VIP"   -&gt; 100
PASS  UTCID05 (B) 0, "VIP"      -&gt; 0   (boundary: 0 is NOT negative)
PASS  UTCID04 (N) 1000, "Guest" -&gt; 0
PASS  UTCID01 (A) -1, "VIP"     -&gt; -1
PASS  UTCID03 (N) 1000, "Regular" -&gt; 50
PASS  UTCID07 (N) 99.99, "VIP"  -&gt; 9   ((int) truncates 9.999)
PASS  UTCID06 (B) -0.01, "Regular" -&gt; -1 (just below the boundary)
9 of 9 tests passed</code></pre>
<p>JaCoCo on the minimum set, and on the same set without UTCID04:</p>
<pre><code>book-3   Booking.calculateRewardPoints  lines 6/7  branches 5/6 (83%)
         missed: L7(1 branch missed) L10(not run)
book-4   Booking.calculateRewardPoints  lines 7/7  branches 6/6 (100%)</code></pre>
<p>Notice what "all tests pass" means here: UTCID08 and UTCID09 pass because they record what the code <em>does</em>. Whether a lower-case "vip" customer should get 0 points, and whether a null type should crash, is a question for the spec owner — raise them as issues in your answer.</p>`,
    `<h3>Ví dụ có lời giải B · PE SP25 câu 3 — calculateRewardPoints (dạng hàm giảm giá/tích điểm)</h3>
<pre><code>public int calculateRewardPoints(double bookingAmount, String customerType) {
    if (bookingAmount &lt; 0) {                         // D1
        return -1;
    } else if (customerType.equals("VIP")) {         // D2
        return (int) (bookingAmount * 0.1);
    } else if (customerType.equals("Regular")) {     // D3
        return (int) (bookingAmount * 0.05);
    } else {
        return 0;
    }
}</code></pre>
<p class="nhan">CFG bằng lời</p>
<ul>
<li><strong>D1</strong> — True → return −1; False → D2.</li>
<li><strong>D2</strong> — True → return 10%; False → D3.</li>
<li><strong>D3</strong> — True → return 5%; False → return 0.</li>
<li><strong>Điểm thoát</strong> — cả bốn return đều đi tới điểm thoát.</li>
<li><strong>V(G)</strong> — N = 8 (D1, D2, D3, bốn return, điểm thoát), E = 10 (sáu cạnh quyết định + bốn cạnh return→thoát) → V(G) = 10 − 8 + 2 = <strong>4</strong> = 3 quyết định + 1.</li>
</ul>
<p class="nhan">Số test tối thiểu</p>
<ul>
<li><strong>4 test cho 100% statement coverage</strong> — bốn lệnh <code>return</code> loại trừ nhau (mỗi lần gọi thoát ra đúng một cửa).</li>
<li><strong>4 test cho 100% decision coverage</strong> — chính 4 test đó cho mọi True/False của D1–D3 (dạng bậc thang: min SC = min DC = V(G)).</li>
</ul>
<div class="table-wrap"><table>
<thead><tr><th>ID</th><th>bookingAmount</th><th>customerType</th><th>Mong đợi</th><th>Kết quả quyết định phủ được</th></tr></thead>
<tbody>
<tr><td>UTCID01 (A)</td><td>−1</td><td>"VIP"</td><td>−1</td><td>D1 T</td></tr>
<tr><td>UTCID02 (N)</td><td>1000</td><td>"VIP"</td><td>100</td><td>D1 F, D2 T</td></tr>
<tr><td>UTCID03 (N)</td><td>1000</td><td>"Regular"</td><td>50</td><td>D2 F, D3 T</td></tr>
<tr><td>UTCID04 (N)</td><td>1000</td><td>"Guest"</td><td>0</td><td>D3 F</td></tr>
</tbody>
</table></div>
<p>Đề SP25 còn yêu cầu 100% phủ phân vùng tương đương và giá trị biên, nên chúng tôi thêm năm ca:</p>
<ul>
<li><strong>EP</strong> — amount &lt; 0 / ≥ 0; loại khách VIP / Regular / khác.</li>
<li><strong>BVA</strong> — −0.01 và 0.</li>
<li><strong>Error guessing</strong> — cắt phần thập phân, "vip" chữ thường, null.</li>
</ul>
<p>Output JUnit thật (JUnit 5.12.2, JDK 21):</p>
<pre><code>PASS  UTCID09 (A) 100, null     -&gt; NullPointerException
PASS  UTCID08 (A) 100, "vip"    -&gt; 0   (equals is case-sensitive)
PASS  UTCID02 (N) 1000, "VIP"   -&gt; 100
PASS  UTCID05 (B) 0, "VIP"      -&gt; 0   (boundary: 0 is NOT negative)
PASS  UTCID04 (N) 1000, "Guest" -&gt; 0
PASS  UTCID01 (A) -1, "VIP"     -&gt; -1
PASS  UTCID03 (N) 1000, "Regular" -&gt; 50
PASS  UTCID07 (N) 99.99, "VIP"  -&gt; 9   ((int) truncates 9.999)
PASS  UTCID06 (B) -0.01, "Regular" -&gt; -1 (just below the boundary)
9 of 9 tests passed</code></pre>
<p>JaCoCo trên bộ tối thiểu, và trên cùng bộ đó nhưng bỏ UTCID04:</p>
<pre><code>book-3   Booking.calculateRewardPoints  lines 6/7  branches 5/6 (83%)
         missed: L7(1 branch missed) L10(not run)
book-4   Booking.calculateRewardPoints  lines 7/7  branches 6/6 (100%)</code></pre>
<p>Để ý "tất cả test đều pass" ở đây nghĩa là gì: UTCID08 và UTCID09 pass vì chúng ghi lại cái code <em>đang làm</em>. Khách "vip" viết thường có nên được 0 điểm không, loại khách null có nên làm sập chương trình không — đó là câu hỏi cho người nắm đặc tả; hãy nêu chúng thành issue trong bài làm.</p>`),
    bi(`<h3>Ví dụ có lời giải C · PE SU24 (PE1) Question 2 — the personal-income-tax flowchart</h3>
<p>The paper gives a flowchart, not code: <code>float fncPersonalIncomeTax(float sal, float te, int nod)</code> (salary, tax-exempt amount, number of dependents).</p>
<p class="nhan">The flowchart, in order</p>
<ol>
<li><code>sal &lt; 0</code>, <code>te &lt; 0</code>, <code>nod &lt; 0</code> — each Yes → one shared box <em>Return −1</em>.</li>
<li><code>ti := sal − te − 9,000,000 − nod × 4,000,000</code></li>
<li><code>ti &gt; 0</code> — No → Return 0.</li>
<li><code>ti &gt; 5,000,000</code> — No → 5% × ti.</li>
<li><code>&gt; 10,000,000</code> — No → 10% × ti − 250,000.</li>
<li><code>&gt; 20,000,000</code> — No → 15% × ti − 750,000.</li>
<li><code>&gt; 40,000,000</code> — No → 20% × ti − 2,250,000.</li>
<li><code>&gt; 80,000,000</code> — No → 25% × ti − 6,250,000; Yes → 30% × ti − 16,250,000.</li>
</ol>
<p><strong>V(G).</strong> 9 binary decisions → V(G) = <strong>10</strong>. Graph check with one exit node: N = start + 9 decisions + the ti assignment + 8 return boxes + exit = 20; E = 20 (start edge, 2 per decision = 18, ti → ti&gt;0) + 8 (return → exit) = 28 → 28 − 20 + 2 = 10 ✓.</p>
<p><strong>Minimum for 100% statement coverage = 8</strong>: there are 8 return boxes (Return −1 is <em>one</em> box) and every test ends in exactly one. <strong>Minimum for 100% decision coverage = 10</strong>: Return −1 is reached by three different True outcomes (sal &lt; 0, te &lt; 0, nod &lt; 0) that need three different tests, plus the 7 other returns. Here min DC = V(G).</p>
<div class="table-wrap"><table>
<thead><tr><th>ID</th><th>sal</th><th>te</th><th>nod</th><th>ti</th><th>Expected</th><th>Needed for</th></tr></thead>
<tbody>
<tr><td>UTCID01 (A)</td><td>−1</td><td>0</td><td>0</td><td>–</td><td>−1</td><td>SC, DC</td></tr>
<tr><td>UTCID02 (A)</td><td>10,000,000</td><td>−1</td><td>0</td><td>–</td><td>−1</td><td>DC only</td></tr>
<tr><td>UTCID03 (A)</td><td>10,000,000</td><td>0</td><td>−1</td><td>–</td><td>−1</td><td>DC only</td></tr>
<tr><td>UTCID04 (B)</td><td>12,000,000</td><td>0</td><td>1</td><td>−1,000,000</td><td>0</td><td>SC, DC</td></tr>
<tr><td>UTCID05 (N)</td><td>12,000,000</td><td>0</td><td>0</td><td>3,000,000</td><td>150,000</td><td>SC, DC</td></tr>
<tr><td>UTCID06 (N)</td><td>17,000,000</td><td>0</td><td>0</td><td>8,000,000</td><td>550,000</td><td>SC, DC</td></tr>
<tr><td>UTCID07 (N)</td><td>24,000,000</td><td>0</td><td>0</td><td>15,000,000</td><td>1,500,000</td><td>SC, DC</td></tr>
<tr><td>UTCID08 (N)</td><td>39,000,000</td><td>0</td><td>0</td><td>30,000,000</td><td>3,750,000</td><td>SC, DC</td></tr>
<tr><td>UTCID09 (N)</td><td>69,000,000</td><td>0</td><td>0</td><td>60,000,000</td><td>8,750,000</td><td>SC, DC</td></tr>
<tr><td>UTCID10 (N)</td><td>109,000,000</td><td>0</td><td>0</td><td>100,000,000</td><td>13,750,000</td><td>SC, DC</td></tr>
</tbody>
</table></div>
<p>We translated the flowchart literally into Java (<code>float</code> as in the signature) and ran the 10 cases as JUnit 5 tests — all passed (<code>10 of 10 tests passed</code>). JaCoCo shows why the 8-test set is enough for statements but not for decisions:</p>
<pre><code>tax-8    TaxCalculator.fncPersonalIncomeTax  lines 16/16  branches 16/18 (89%)
         missed: L5(1 branch missed) L6(1 branch missed)       &lt;- te&lt;0 True, nod&lt;0 True
tax-10   TaxCalculator.fncPersonalIncomeTax  lines 16/16  branches 18/18 (100%)</code></pre>
<p>The raw results of the 10 cases were <code>-1.0 -1.0 -1.0 0.0 150000.0 550000.0 1500000.0 3750000.0 8750000.0 1.3750002E7</code> — the last one is 13,750,00<strong>2</strong>, not 13,750,000: a <code>float</code> has only about 7 significant digits. The test uses <code>assertEquals(13_750_000f, actual, 4f)</code> (a tolerance), and in a real review you would report "money stored in <code>float</code>" as a defect.</p>`,
    `<h3>Ví dụ có lời giải C · PE SU24 (PE1) câu 2 — lưu đồ thuế thu nhập cá nhân</h3>
<p>Đề cho lưu đồ chứ không cho code: <code>float fncPersonalIncomeTax(float sal, float te, int nod)</code> (lương, khoản miễn thuế, số người phụ thuộc).</p>
<p class="nhan">Lưu đồ, theo thứ tự</p>
<ol>
<li><code>sal &lt; 0</code>, <code>te &lt; 0</code>, <code>nod &lt; 0</code> — mỗi Yes → cùng một hộp <em>Return −1</em>.</li>
<li><code>ti := sal − te − 9.000.000 − nod × 4.000.000</code></li>
<li><code>ti &gt; 0</code> — No → Return 0.</li>
<li><code>ti &gt; 5.000.000</code> — No → 5% × ti.</li>
<li><code>&gt; 10.000.000</code> — No → 10% × ti − 250.000.</li>
<li><code>&gt; 20.000.000</code> — No → 15% × ti − 750.000.</li>
<li><code>&gt; 40.000.000</code> — No → 20% × ti − 2.250.000.</li>
<li><code>&gt; 80.000.000</code> — No → 25% × ti − 6.250.000; Yes → 30% × ti − 16.250.000.</li>
</ol>
<p><strong>V(G).</strong> 9 quyết định nhị phân → V(G) = <strong>10</strong>. Kiểm bằng đồ thị với một node thoát: N = start + 9 quyết định + lệnh gán ti + 8 hộp return + thoát = 20; E = 20 (cạnh từ start, mỗi quyết định 2 cạnh = 18, ti → ti&gt;0) + 8 (return → thoát) = 28 → 28 − 20 + 2 = 10 ✓.</p>
<p><strong>Tối thiểu cho 100% statement coverage = 8</strong>: có 8 hộp return (Return −1 là <em>một</em> hộp) và mỗi test kết thúc ở đúng một hộp. <strong>Tối thiểu cho 100% decision coverage = 10</strong>: Return −1 được tới bởi ba kết quả True khác nhau (sal &lt; 0, te &lt; 0, nod &lt; 0) cần ba test khác nhau, cộng 7 return còn lại. Ở đây min DC = V(G).</p>
<div class="table-wrap"><table>
<thead><tr><th>ID</th><th>sal</th><th>te</th><th>nod</th><th>ti</th><th>Mong đợi</th><th>Cần cho</th></tr></thead>
<tbody>
<tr><td>UTCID01 (A)</td><td>−1</td><td>0</td><td>0</td><td>–</td><td>−1</td><td>SC, DC</td></tr>
<tr><td>UTCID02 (A)</td><td>10.000.000</td><td>−1</td><td>0</td><td>–</td><td>−1</td><td>chỉ DC</td></tr>
<tr><td>UTCID03 (A)</td><td>10.000.000</td><td>0</td><td>−1</td><td>–</td><td>−1</td><td>chỉ DC</td></tr>
<tr><td>UTCID04 (B)</td><td>12.000.000</td><td>0</td><td>1</td><td>−1.000.000</td><td>0</td><td>SC, DC</td></tr>
<tr><td>UTCID05 (N)</td><td>12.000.000</td><td>0</td><td>0</td><td>3.000.000</td><td>150.000</td><td>SC, DC</td></tr>
<tr><td>UTCID06 (N)</td><td>17.000.000</td><td>0</td><td>0</td><td>8.000.000</td><td>550.000</td><td>SC, DC</td></tr>
<tr><td>UTCID07 (N)</td><td>24.000.000</td><td>0</td><td>0</td><td>15.000.000</td><td>1.500.000</td><td>SC, DC</td></tr>
<tr><td>UTCID08 (N)</td><td>39.000.000</td><td>0</td><td>0</td><td>30.000.000</td><td>3.750.000</td><td>SC, DC</td></tr>
<tr><td>UTCID09 (N)</td><td>69.000.000</td><td>0</td><td>0</td><td>60.000.000</td><td>8.750.000</td><td>SC, DC</td></tr>
<tr><td>UTCID10 (N)</td><td>109.000.000</td><td>0</td><td>0</td><td>100.000.000</td><td>13.750.000</td><td>SC, DC</td></tr>
</tbody>
</table></div>
<p>Chúng tôi dịch nguyên văn lưu đồ sang Java (<code>float</code> như trong chữ ký hàm) và chạy 10 ca dưới dạng test JUnit 5 — tất cả đều pass (<code>10 of 10 tests passed</code>). JaCoCo cho thấy vì sao bộ 8 test đủ cho câu lệnh nhưng không đủ cho quyết định:</p>
<pre><code>tax-8    TaxCalculator.fncPersonalIncomeTax  lines 16/16  branches 16/18 (89%)
         missed: L5(1 branch missed) L6(1 branch missed)       &lt;- te&lt;0 True, nod&lt;0 True
tax-10   TaxCalculator.fncPersonalIncomeTax  lines 16/16  branches 18/18 (100%)</code></pre>
<p>Kết quả thô của 10 ca là <code>-1.0 -1.0 -1.0 0.0 150000.0 550000.0 1500000.0 3750000.0 8750000.0 1.3750002E7</code> — ca cuối là 13.750.00<strong>2</strong> chứ không phải 13.750.000: kiểu <code>float</code> chỉ có khoảng 7 chữ số có nghĩa. Test dùng <code>assertEquals(13_750_000f, actual, 4f)</code> (có sai số cho phép), và khi review thật bạn nên báo "lưu tiền bằng <code>float</code>" là một defect.</p>`),
    bi(`<div class="pitfall co-tieu-de"><strong>The three mistakes that cost the most PE points.</strong>
<ol>
<li><em>"V(G) = the number of test cases for decision coverage."</em> No — V(G) is the number of basis paths and an <em>upper bound</em>: Examples 4–6 need 2 tests with V(G) = 3, countCharacters needs 1 with V(G) = 5; only fully nested/cascaded code (Examples 1–3, SP25, SU24) makes them equal.</li>
<li>Writing the expected result by running the code: the test then passes by definition and finds nothing — take it from the spec (or the flowchart).</li>
<li>Padding the "minimum" answer with extra cases without saying so. If you add boundary/abnormal cases, label them as extra (as UTCID02–03 above) and state the minimum clearly.</li>
</ol></div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>Basis-path testing, McCabe's thresholds and what tools really count.</strong>
<ul>
<li><strong>Basis-path testing</strong> (McCabe) — picks V(G) linearly independent paths (every other path is a combination of them) and tests each one. It guarantees decision coverage (if the paths are feasible) and is what "list the independent paths" questions mean.</li>
<li><strong>Thresholds</strong> — as a quality signal, V(G) 1–10 is usually considered simple, 11–20 moderate, 21–50 complex, above 50 untestable (SonarQube flags methods above a configurable threshold).</li>
<li><strong>Compound conditions</strong> — McCabe's predicate rule counts every <code>&amp;&amp;</code>/<code>||</code> as an extra decision, and JaCoCo counts <em>bytecode</em> branches (<code>if (a || b)</code> shows 4 branches), so a tool's "branch coverage" can be stricter than the syllabus's decision coverage.</li>
</ul>
<p><em>Outside the syllabus because CTFL 2018 only asks for statement and decision coverage; V(G) is a Chapter 3 static metric and basis-path testing is not an ISTQB Foundation technique.</em></p></div>`,
    `<div class="pitfall co-tieu-de"><strong>Ba lỗi làm mất nhiều điểm PE nhất.</strong>
<ol>
<li><em>"V(G) = số test case cho decision coverage."</em> Không — V(G) là số basis path và là <em>cận trên</em>: Ví dụ 4–6 cần 2 test trong khi V(G) = 3, countCharacters cần 1 test trong khi V(G) = 5; chỉ code lồng/bậc thang hoàn toàn (Ví dụ 1–3, SP25, SU24) mới làm hai số bằng nhau.</li>
<li>Viết kết quả mong đợi bằng cách chạy code: khi đó test mặc nhiên pass và không tìm ra gì — hãy lấy từ đặc tả (hoặc từ lưu đồ).</li>
<li>Độn thêm ca vào đáp án "tối thiểu" mà không nói rõ. Nếu thêm ca biên/bất thường, hãy ghi rõ là ca thêm (như UTCID02–03 ở trên) và nêu rõ con số tối thiểu.</li>
</ol></div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Basis-path testing, ngưỡng McCabe và thứ công cụ thật sự đếm.</strong>
<ul>
<li><strong>Basis-path testing</strong> (McCabe) — chọn V(G) đường độc lập tuyến tính (mọi đường khác đều là tổ hợp của chúng) và test từng đường. Nó bảo đảm decision coverage (nếu các đường khả thi) và chính là ý của các câu hỏi "liệt kê các đường độc lập".</li>
<li><strong>Ngưỡng</strong> — như một tín hiệu chất lượng, V(G) 1–10 thường coi là đơn giản, 11–20 trung bình, 21–50 phức tạp, trên 50 là không test nổi (SonarQube cảnh báo phương thức vượt một ngưỡng cấu hình được).</li>
<li><strong>Điều kiện ghép</strong> — quy tắc predicate của McCabe tính mỗi <code>&amp;&amp;</code>/<code>||</code> là thêm một quyết định, còn JaCoCo đếm nhánh <em>bytecode</em> (<code>if (a || b)</code> hiện 4 nhánh), nên "branch coverage" của công cụ có thể khắt khe hơn decision coverage của syllabus.</li>
</ul>
<p><em>Ngoài giáo trình vì CTFL 2018 chỉ hỏi statement và decision coverage; V(G) là chỉ số tĩnh của Chương 3 và basis-path testing không phải kỹ thuật của ISTQB Foundation.</em></p></div>`),
    books([
      ['fst4', 'Ch.4 §3 "White-box test techniques", incl. Figure 4.4 control-flow diagram p.139 — book pp.132–139 (PDF pp.146–153); sample questions pp.144–147, exercises p.148, solutions pp.149–153', 'Chương 4 §3 "White-box test techniques", gồm Hình 4.4 sơ đồ luồng điều khiển trang 139 — trang sách 132–139 (PDF 146–153); câu hỏi mẫu trang 144–147, bài tập trang 148, lời giải trang 149–153'],
      ['fst', '§4.4 "Structure-based or white-box techniques" pp.105–112 (PDF pp.108–115); cyclomatic complexity in §3.3 "Static analysis by tools" pp.69–73', '§4.4 "Structure-based or white-box techniques" trang 105–112 (PDF 108–115); cyclomatic complexity ở §3.3 "Static analysis by tools" trang 69–73'],
      ['sp5', '§5.2.1 Statement testing PDF p.215 and §5.2.2 Decision testing PDF p.218', '§5.2.1 Statement testing PDF 215 và §5.2.2 Decision testing PDF 218'],
      ['sp4', '§4.2.4 control-flow analysis p.99 and §4.2.5 metrics / cyclomatic number p.100; §5.2.1–5.2.2 statement & decision coverage pp.146–150 (PDF pp.161–165)', '§4.2.4 phân tích luồng điều khiển trang 99 và §4.2.5 metric / cyclomatic number trang 100; §5.2.1–5.2.2 statement & decision coverage trang 146–150 (PDF 161–165)'],
      ['junit', 'Ch.6 "Test quality" (code coverage) PDF pp.103–126; Ch.2 "Exploring core JUnit" for assertEquals/assertThrows/@DisplayName PDF pp.18–48', 'Chương 6 "Test quality" (code coverage) PDF 103–126; Chương 2 "Exploring core JUnit" cho assertEquals/assertThrows/@DisplayName PDF 18–48'],
    ]),
  ].join('\n'),
};

/* ─────────────── 5.3 More from the 2023 slide set (SWT4.ppt pages 34–55) ─────────────── */
const O = 'oswt4';
const L53 = {
  title: '5.3 — More from the 2023 slide set: BS 7925-2 white-box list, MC/DC & LCSAJ|||5.3 — Bổ sung từ bộ slide 2023: danh mục white-box BS 7925-2, MC/DC & LCSAJ',
  slug: 'swt301-ch5-slides-2023',
  type: 'VIDEO',
  description: 'Bộ slide SWT4 cũ (2023) trang 34–55: những trang bài 5.1–5.2 và Chương 6 chưa có — bảy kỹ thuật white-box của BS 7925-2, MC/DC (có ví dụ A AND B giải từng bước), LCSAJ và chỗ slide nói quá, error guessing & fault attack. Các trang trùng (coverage, Ví dụ 1–6, chọn kỹ thuật) được liệt kê kèm chỗ đã học và đáp án đã đối chiếu.',
  content: [
    bi(`<span class="eyebrow">Chapter 5 · Lesson 5.3 · SWT4 (2023) pages 34–55</span>
<h2>More from the 2023 slide set — the white-box pages</h2>
<p class="lead">The older 2023 deck (SWT4.ppt, 55 pages) taught white-box testing with the same coverage pages and Examples 1–6 you met in Lessons 5.1–5.2 — but it also listed the <strong>stronger white-box techniques</strong> of the British standard BS 7925-2. This lesson shows those pages, explains them with worked examples, and points to where every other page is already taught.</p>
<div class="callout"><strong>Learning objectives.</strong> After this lesson you can:
<ul>
<li><strong>list</strong> the seven white-box techniques of BS 7925-2 and rank them from weakest to strongest;</li>
<li><strong>derive</strong> an MC/DC test set for a decision with two or three conditions (n + 1 tests);</li>
<li><strong>say</strong> what 100% LCSAJ coverage does — and does not — guarantee;</li>
<li><strong>place</strong> “error guessing and fault attacks” in today's experience-based techniques.</li>
</ul></div>
<h3>Old words → current CTFL words</h3>
<table>
<thead><tr><th>In the 2023 deck</th><th>Say today (CTFL 2018 / v4.0)</th></tr></thead>
<tbody>
<tr><td>Techniques “defined in BS 7925-2”</td><td>ISO/IEC/IEEE 29119-4 (BS 7925-2 is withdrawn)</td></tr>
<tr><td>Branch / decision testing</td><td><strong>Decision testing</strong> — the only two white-box techniques in CTFL are statement and decision testing</td></tr>
<tr><td>Branch condition combination testing</td><td><strong>Multiple condition testing</strong> (Advanced level, not Foundation)</td></tr>
<tr><td>Modified condition decision testing</td><td><strong>MC/DC</strong> — Advanced Technical Test Analyst</td></tr>
<tr><td>LCSAJ, data flow testing</td><td>Not in any current ISTQB syllabus; data flow appears only as a static-analysis check</td></tr>
<tr><td>Error guessing and <em>fault</em> attacks</td><td>Error guessing (a “fault attack” is its methodical form); <em>fault</em> = defect</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 5 · Bài 5.3 · SWT4 (2023) trang 34–55</span>
<h2>Bổ sung từ bộ slide 2023 — phần white-box</h2>
<p class="lead">Bộ slide cũ 2023 (SWT4.ppt, 55 trang) dạy white-box bằng đúng những trang coverage và Ví dụ 1–6 bạn đã gặp ở bài 5.1–5.2 — nhưng nó còn liệt kê các <strong>kỹ thuật white-box mạnh hơn</strong> của chuẩn Anh BS 7925-2. Bài này đưa các trang đó, giải thích bằng ví dụ có lời giải, và chỉ rõ mọi trang còn lại đã được dạy ở đâu.</p>
<div class="callout"><strong>Chuẩn đầu ra.</strong> Học xong bài này bạn có thể:
<ul>
<li><strong>kể</strong> bảy kỹ thuật white-box của BS 7925-2 và xếp chúng từ yếu tới mạnh;</li>
<li><strong>lập</strong> bộ test MC/DC cho một quyết định có hai hoặc ba điều kiện (n + 1 test);</li>
<li><strong>nói được</strong> 100% LCSAJ coverage bảo đảm gì — và không bảo đảm gì;</li>
<li><strong>đặt</strong> “error guessing and fault attacks” vào đúng chỗ trong nhóm kỹ thuật dựa kinh nghiệm hiện nay.</li>
</ul></div>
<h3>Từ cũ → từ CTFL hiện hành</h3>
<table>
<thead><tr><th>Trong slide 2023</th><th>Nói theo CTFL 2018 / v4.0</th></tr></thead>
<tbody>
<tr><td>Kỹ thuật “định nghĩa trong BS 7925-2”</td><td>ISO/IEC/IEEE 29119-4 (BS 7925-2 đã bị rút)</td></tr>
<tr><td>Branch / decision testing</td><td><strong>Decision testing</strong> — CTFL chỉ có hai kỹ thuật white-box: statement và decision testing</td></tr>
<tr><td>Branch condition combination testing</td><td><strong>Multiple condition testing</strong> (cấp Advanced, không thuộc Foundation)</td></tr>
<tr><td>Modified condition decision testing</td><td><strong>MC/DC</strong> — Advanced Technical Test Analyst</td></tr>
<tr><td>LCSAJ, data flow testing</td><td>Không còn trong syllabus ISTQB hiện hành; data flow chỉ còn là một phép kiểm của static analysis</td></tr>
<tr><td>Error guessing and <em>fault</em> attacks</td><td>Error guessing (“fault attack” là dạng có phương pháp của nó); <em>fault</em> = defect</td></tr>
</tbody>
</table>`),
    bi(`<h3>Old pages you have already learned</h3>
<p>These 2023 pages match the current lessons; the answers printed on pages 45–49 were re-worked and agree with Lesson 5.2. Slide numbers refer to the current <em>SWT4</em> deck.</p>
<table>
<thead><tr><th>2023 page</th><th>Topic</th><th>Already taught in</th><th>Note</th></tr></thead>
<tbody>
<tr><td>33, 50, 52, 55</td><td>“Contents” agenda / “Summary: key points”</td><td>—</td><td>Repeats of the seven-section agenda (page 2, Lesson 4.7)</td></tr>
<tr><td>37</td><td>Using structural coverage</td><td>5.1 — slide 84</td><td>Identical</td></tr>
<tr><td>38</td><td>The test coverage trap</td><td>5.1 — slide 85</td><td>Old “Coverage is not thoroughness” = new “only one aspect of thoroughness”</td></tr>
<tr><td>39–41</td><td>Statement coverage (87%) · example · decision coverage (50%)</td><td>5.1 — slides 86–88</td><td>Same numbers: 87/100 = 87%, 60/120 = 50%</td></tr>
<tr><td>42–43</td><td>Paths through code · with loops</td><td>5.1 — slides 89–90</td><td>Identical (2, 2, 3 and 4 paths)</td></tr>
<tr><td>44</td><td>Example 1 — card and PIN</td><td>5.2 — slides 91–92</td><td>V(G) 3, statement 3, decision 3</td></tr>
<tr><td>45</td><td>Example 2</td><td>5.2 — slide 93</td><td>3 / 1 / 3 ✓</td></tr>
<tr><td>46</td><td>Example 3</td><td>5.2 — slide 94</td><td>4 / 2 / 4 ✓</td></tr>
<tr><td>47</td><td>Example 4 (4 paths)</td><td>5.2 — slide 95</td><td>3 / 2 / 2 ✓</td></tr>
<tr><td>48</td><td>Example 5</td><td>5.2 — slide 96</td><td>3 / 1 / 2 ✓</td></tr>
<tr><td>49</td><td>Example 6</td><td>5.2 — slide 97</td><td>3 / 2 / 2 ✓</td></tr>
<tr><td>53–54</td><td>Choosing a technique: internal and external factors</td><td>6.2 — block on hidden pptx slides 114–115</td><td>Same six internal and five external factors</td></tr>
</tbody>
</table>`,
    `<h3>Những trang cũ bạn đã học</h3>
<p>Các trang 2023 dưới đây khớp với bài hiện tại; đáp án in trên trang 45–49 đã được giải lại và trùng với bài 5.2. Số slide là số của bộ <em>SWT4</em> hiện tại.</p>
<table>
<thead><tr><th>Trang 2023</th><th>Chủ đề</th><th>Đã học ở</th><th>Ghi chú</th></tr></thead>
<tbody>
<tr><td>33, 50, 52, 55</td><td>Mục lục “Contents” / “Summary: key points”</td><td>—</td><td>Lặp lại mục lục bảy phần (trang 2, bài 4.7)</td></tr>
<tr><td>37</td><td>Using structural coverage</td><td>5.1 — slide 84</td><td>Giống hệt</td></tr>
<tr><td>38</td><td>Bẫy độ phủ</td><td>5.1 — slide 85</td><td>“Coverage is not thoroughness” cũ = “chỉ là một khía cạnh của độ kỹ lưỡng” mới</td></tr>
<tr><td>39–41</td><td>Statement coverage (87%) · ví dụ · decision coverage (50%)</td><td>5.1 — slide 86–88</td><td>Cùng số: 87/100 = 87%, 60/120 = 50%</td></tr>
<tr><td>42–43</td><td>Đường đi trong code · có vòng lặp</td><td>5.1 — slide 89–90</td><td>Giống hệt (2, 2, 3 và 4 đường)</td></tr>
<tr><td>44</td><td>Ví dụ 1 — thẻ và PIN</td><td>5.2 — slide 91–92</td><td>V(G) 3, statement 3, decision 3</td></tr>
<tr><td>45</td><td>Ví dụ 2</td><td>5.2 — slide 93</td><td>3 / 1 / 3 ✓</td></tr>
<tr><td>46</td><td>Ví dụ 3</td><td>5.2 — slide 94</td><td>4 / 2 / 4 ✓</td></tr>
<tr><td>47</td><td>Ví dụ 4 (4 đường)</td><td>5.2 — slide 95</td><td>3 / 2 / 2 ✓</td></tr>
<tr><td>48</td><td>Ví dụ 5</td><td>5.2 — slide 96</td><td>3 / 1 / 2 ✓</td></tr>
<tr><td>49</td><td>Ví dụ 6</td><td>5.2 — slide 97</td><td>3 / 2 / 2 ✓</td></tr>
<tr><td>53–54</td><td>Chọn kỹ thuật: yếu tố bên trong và bên ngoài</td><td>6.2 — khối về slide ẩn pptx 114–115</td><td>Cùng sáu yếu tố bên trong và năm yếu tố bên ngoài</td></tr>
</tbody>
</table>`),
    walkHead(O, 34, 51, 'Only the 2023 pages that add something to Lessons 5.1–5.2 and Chapter 6 are shown, in page order.', 'Chỉ hiện những trang 2023 bổ sung điều mới cho bài 5.1–5.2 và Chương 6, theo đúng thứ tự trang.'),
    walk(O, [
      [34, 'White Box test design and measurement techniques (BS 7925-2)',
        `<p class="y-chinh">🎯 BS 7925-2 defined seven white-box techniques, and every one of them is also a coverage measure.</p>
<p class="nhan">The seven techniques and what each one counts</p>
<table>
<thead><tr><th>Technique</th><th>Coverage item</th><th>In CTFL?</th></tr></thead>
<tbody>
<tr><td>Statement testing</td><td>executable statements</td><td>Yes (Lesson 5.1)</td></tr>
<tr><td>Branch / decision testing</td><td>decision outcomes (True and False)</td><td>Yes (Lesson 5.1)</td></tr>
<tr><td>Data flow testing</td><td>definition–use pairs of each variable</td><td>No</td></tr>
<tr><td>Branch condition testing</td><td>each atomic condition True and False</td><td>No</td></tr>
<tr><td>Branch condition combination testing</td><td>every combination of the atomic conditions (2ⁿ)</td><td>No (Advanced)</td></tr>
<tr><td>Modified condition decision testing</td><td>each condition shown to change the decision on its own (page 35)</td><td>No (Advanced)</td></tr>
<tr><td>LCSAJ testing</td><td>linear code sequences and jumps (page 36)</td><td>No</td></tr>
</tbody>
</table>
<p class="nhan">One decision, four strengths — <code>if (a &gt; 0 &amp;&amp; b &gt; 0)</code></p>
<ul>
<li><strong>Decision coverage</strong> — 2 tests: (T, T) → True, (F, T) → False.</li>
<li><strong>Condition coverage</strong> — 2 tests (T, F) and (F, T) make each condition True and False, yet the decision is False both times: only 50% decision coverage.</li>
<li><strong>MC/DC</strong> — 3 tests: (T, T), (F, T), (T, F).</li>
<li><strong>Multiple condition</strong> — all 2² = 4 combinations.</li>
</ul>
<div class="pitfall">Condition coverage does <em>not</em> include decision coverage — the example above reaches 100% condition coverage with the True branch never taken.</div>
<p class="ghi-chu">In the rendered image the green ticks are scattered by the old .ppt animation. There are seven ticks, one per technique: all seven are “also a measurement technique”.</p>`,
        `<p class="y-chinh">🎯 BS 7925-2 định nghĩa bảy kỹ thuật white-box, và kỹ thuật nào cũng đồng thời là một thước đo độ phủ.</p>
<p class="nhan">Bảy kỹ thuật và thứ mỗi kỹ thuật đếm</p>
<table>
<thead><tr><th>Kỹ thuật</th><th>Phần tử độ phủ</th><th>Có trong CTFL?</th></tr></thead>
<tbody>
<tr><td>Statement testing</td><td>các câu lệnh thực thi được</td><td>Có (bài 5.1)</td></tr>
<tr><td>Branch / decision testing</td><td>các kết quả quyết định (True và False)</td><td>Có (bài 5.1)</td></tr>
<tr><td>Data flow testing</td><td>các cặp định nghĩa–sử dụng của từng biến</td><td>Không</td></tr>
<tr><td>Branch condition testing</td><td>mỗi điều kiện đơn nhận cả True và False</td><td>Không</td></tr>
<tr><td>Branch condition combination testing</td><td>mọi tổ hợp của các điều kiện đơn (2ⁿ)</td><td>Không (Advanced)</td></tr>
<tr><td>Modified condition decision testing</td><td>mỗi điều kiện tự mình đổi được kết quả quyết định (trang 35)</td><td>Không (Advanced)</td></tr>
<tr><td>LCSAJ testing</td><td>các đoạn code tuần tự kèm bước nhảy (trang 36)</td><td>Không</td></tr>
</tbody>
</table>
<p class="nhan">Một quyết định, bốn mức mạnh — <code>if (a &gt; 0 &amp;&amp; b &gt; 0)</code></p>
<ul>
<li><strong>Decision coverage</strong> — 2 test: (T, T) → True, (F, T) → False.</li>
<li><strong>Condition coverage</strong> — 2 test (T, F) và (F, T) cho mỗi điều kiện cả True lẫn False, nhưng quyết định đều ra False: chỉ đạt 50% decision coverage.</li>
<li><strong>MC/DC</strong> — 3 test: (T, T), (F, T), (T, F).</li>
<li><strong>Multiple condition</strong> — đủ 2² = 4 tổ hợp.</li>
</ul>
<div class="pitfall">Condition coverage <em>không</em> bao hàm decision coverage — ví dụ trên đạt 100% condition coverage mà nhánh True chưa bao giờ chạy.</div>
<p class="ghi-chu">Trong ảnh dựng lại, các dấu tích xanh bị animation của file .ppt cũ làm lệch chỗ. Có đúng bảy dấu tích, mỗi kỹ thuật một dấu: cả bảy đều “also a measurement technique”.</p>`],
      [35, 'Modified condition decision testing (MC/DC)',
        `<p class="y-chinh">🎯 MC/DC asks for four things; the last one — each condition independently changes the decision — is what makes it strong yet affordable.</p>
<ol>
<li><strong>Each entry and exit point is invoked</strong> — every function is called and every return is reached.</li>
<li><strong>Each decision takes every possible outcome</strong> — this is decision coverage.</li>
<li><strong>Each condition in a decision takes every possible outcome</strong> — this is condition coverage.</li>
<li><strong>Each condition is shown to independently affect the outcome</strong> — two tests that differ <em>only</em> in that condition give different decisions.</li>
</ol>
<p class="nhan">Worked example — A AND B</p>
<table>
<thead><tr><th>Test</th><th>A</th><th>B</th><th>A AND B</th><th>Proves</th></tr></thead>
<tbody>
<tr><td>1</td><td>T</td><td>T</td><td>T</td><td>pair partner for both</td></tr>
<tr><td>2</td><td>F</td><td>T</td><td>F</td><td>A matters (compare with test 1)</td></tr>
<tr><td>3</td><td>T</td><td>F</td><td>F</td><td>B matters (compare with test 1)</td></tr>
</tbody>
</table>
<p class="nhan">Answers re-worked (checked with a script)</p>
<ul>
<li><strong>A AND B</strong> — {TT, FT, TF}: 3 tests. Multiple condition would need 4.</li>
<li><strong>A OR B</strong> — {FF, TF, FT}: 3 tests.</li>
<li><strong>A AND (B OR C)</strong> — {TTF, FTF, TFF, TFT}: 4 tests instead of 2³ = 8.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> MC/DC usually needs n + 1 tests for n conditions — it grows linearly, multiple condition grows as 2ⁿ. That is why avionics (DO-178C level A) demands MC/DC rather than all combinations.</p>`,
        `<p class="y-chinh">🎯 MC/DC đòi bốn điều; điều cuối — mỗi điều kiện tự mình đổi được kết quả quyết định — làm nó vừa mạnh vừa không quá tốn.</p>
<ol>
<li><strong>Mọi điểm vào và điểm ra đều được gọi tới</strong> — hàm nào cũng được gọi, lệnh return nào cũng được chạy tới.</li>
<li><strong>Mỗi quyết định nhận mọi kết quả có thể</strong> — đây là decision coverage.</li>
<li><strong>Mỗi điều kiện trong quyết định nhận mọi kết quả có thể</strong> — đây là condition coverage.</li>
<li><strong>Mỗi điều kiện được chứng minh ảnh hưởng độc lập tới kết quả</strong> — hai test chỉ khác nhau <em>đúng</em> ở điều kiện đó cho ra quyết định khác nhau.</li>
</ol>
<p class="nhan">Ví dụ có lời giải — A AND B</p>
<table>
<thead><tr><th>Test</th><th>A</th><th>B</th><th>A AND B</th><th>Chứng minh</th></tr></thead>
<tbody>
<tr><td>1</td><td>T</td><td>T</td><td>T</td><td>test đối chiếu cho cả hai</td></tr>
<tr><td>2</td><td>F</td><td>T</td><td>F</td><td>A có ảnh hưởng (so với test 1)</td></tr>
<tr><td>3</td><td>T</td><td>F</td><td>F</td><td>B có ảnh hưởng (so với test 1)</td></tr>
</tbody>
</table>
<p class="nhan">Giải lại đáp án (đã kiểm bằng script)</p>
<ul>
<li><strong>A AND B</strong> — {TT, FT, TF}: 3 test. Multiple condition cần 4.</li>
<li><strong>A OR B</strong> — {FF, TF, FT}: 3 test.</li>
<li><strong>A AND (B OR C)</strong> — {TTF, FTF, TFF, TFT}: 4 test thay vì 2³ = 8.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> MC/DC thường cần n + 1 test cho n điều kiện — tăng tuyến tính, còn multiple condition tăng theo 2ⁿ. Vì thế hàng không (DO-178C mức A) đòi MC/DC chứ không đòi mọi tổ hợp.</p>`],
      [36, 'LCSAJ testing',
        `<p class="y-chinh">🎯 LCSAJ coverage is stronger than statement and branch coverage — but the page claims one thing too many.</p>
<p class="nhan">What an LCSAJ is</p>
<p>A <strong>Linear Code Sequence And Jump</strong> is a triple (start line, end line, jump target): a run of consecutive statements executed one after another, ending with a jump of control to another line.</p>
<p class="nhan">The four claims, checked</p>
<ol>
<li><strong>100% LCSAJ ⇒ 100% statement coverage</strong> — ✓ true: every statement lies in some LCSAJ.</li>
<li><strong>100% LCSAJ ⇒ 100% branch coverage</strong> — ✓ true: every jump and every fall-through is exercised.</li>
<li><strong>⇒ 100% procedure / function call coverage</strong> — ✓ true: it already follows from statement coverage, since each call is a statement.</li>
<li><strong>⇒ 100% multiple condition coverage</strong> — ✗ not true. LCSAJ follows jumps between lines; it never looks inside a compound condition.</li>
</ol>
<p class="nhan">Counter-example for claim 4</p>
<p>For <code>if (a &gt; 0 &amp;&amp; b &gt; 0) x = 1;</code> the tests (T, T) and (F, F) take both the fall-through and the jump, so all LCSAJs are covered. The combinations (T, F) and (F, T) never run: multiple condition coverage is 2 of 4 = 50%.</p>
<p class="ghi-chu">LCSAJ was used with tools such as LDRA Testbed; it is not in any current ISTQB syllabus.</p>`,
        `<p class="y-chinh">🎯 LCSAJ coverage mạnh hơn statement và branch coverage — nhưng trang này khẳng định dư một điều.</p>
<p class="nhan">LCSAJ là gì</p>
<p><strong>Linear Code Sequence And Jump</strong> là một bộ ba (dòng bắt đầu, dòng kết thúc, đích nhảy): một dãy lệnh liền nhau chạy lần lượt, kết thúc bằng một bước nhảy điều khiển sang dòng khác.</p>
<p class="nhan">Kiểm lại bốn khẳng định</p>
<ol>
<li><strong>100% LCSAJ ⇒ 100% statement coverage</strong> — ✓ đúng: câu lệnh nào cũng thuộc một LCSAJ nào đó.</li>
<li><strong>100% LCSAJ ⇒ 100% branch coverage</strong> — ✓ đúng: mọi bước nhảy và mọi lần đi thẳng đều được chạy.</li>
<li><strong>⇒ 100% procedure / function call coverage</strong> — ✓ đúng: điều này đã suy ra từ statement coverage, vì mỗi lời gọi là một câu lệnh.</li>
<li><strong>⇒ 100% multiple condition coverage</strong> — ✗ sai. LCSAJ theo các bước nhảy giữa các dòng; nó không nhìn vào bên trong một điều kiện ghép.</li>
</ol>
<p class="nhan">Phản ví dụ cho khẳng định 4</p>
<p>Với <code>if (a &gt; 0 &amp;&amp; b &gt; 0) x = 1;</code> hai test (T, T) và (F, F) đã đi cả đường thẳng lẫn bước nhảy, nên mọi LCSAJ đều được phủ. Tổ hợp (T, F) và (F, T) chưa bao giờ chạy: multiple condition coverage chỉ 2/4 = 50%.</p>
<p class="ghi-chu">LCSAJ từng được dùng với công cụ như LDRA Testbed; nó không có trong syllabus ISTQB hiện hành nào.</p>`],
      [51, 'Experience-based techniques — error guessing and fault attacks',
        `<p class="y-chinh">🎯 Experience-based techniques complement the formal ones — they are never the only technique you use.</p>
<p class="nhan">The two techniques on the page</p>
<ul>
<li><strong>Error guessing and fault attacks</strong> — use experience to guess where developers make mistakes. A <em>fault attack</em> is the methodical form: write a list of possible defects and failures, then design one test to “attack” each (empty input, 0, a very long string, a full disc, a lost connection…).</li>
<li><strong>Exploratory testing</strong> — a hands-on approach with minimum planning and maximum test execution: design, execution and learning happen at the same time.</li>
</ul>
<p class="nhan">What the current deck adds</p>
<ul>
<li><strong>Checklist-based testing</strong> — the third experience-based technique of CTFL 2018 (Lesson 6.1).</li>
<li><strong>Session-based testing</strong> — exploratory testing inside a time-box, guided by a test charter (Lesson 6.1, slide 104).</li>
</ul>
<div class="pitfall">“Should always be used as a <em>complement</em>” — an exam option saying error guessing can replace EP, BVA or decision tables is wrong. Old “fault” = today's <strong>defect</strong>.</div>`,
        `<p class="y-chinh">🎯 Kỹ thuật dựa kinh nghiệm bổ sung cho các kỹ thuật chính thức — không bao giờ là kỹ thuật duy nhất bạn dùng.</p>
<p class="nhan">Hai kỹ thuật trên trang</p>
<ul>
<li><strong>Error guessing và fault attack</strong> — dùng kinh nghiệm đoán chỗ lập trình viên hay sai. <em>Fault attack</em> là dạng có phương pháp: lập danh sách defect và failure có thể xảy ra, rồi thiết kế mỗi mục một test để “tấn công” (ô trống, số 0, chuỗi rất dài, đĩa đầy, mất kết nối…).</li>
<li><strong>Exploratory testing</strong> — cách làm thực hành, lập kế hoạch tối thiểu và chạy test tối đa: thiết kế, thực thi và học diễn ra cùng lúc.</li>
</ul>
<p class="nhan">Bộ slide hiện tại bổ sung</p>
<ul>
<li><strong>Checklist-based testing</strong> — kỹ thuật dựa kinh nghiệm thứ ba của CTFL 2018 (bài 6.1).</li>
<li><strong>Session-based testing</strong> — exploratory testing trong một khung thời gian cố định, có test charter định hướng (bài 6.1, slide 104).</li>
</ul>
<div class="pitfall">“Luôn được dùng như một kỹ thuật <em>bổ sung</em>” — phương án nói error guessing có thể thay EP, BVA hay decision table là sai. “Fault” cũ = <strong>defect</strong> hiện nay.</div>`],
    ]),
  ].join('\n'),
};

/* ─────────────────────────────────── Quiz 5 ─────────────────────────────────── */
const QUIZ5 = {
  title: 'Quiz 5 — White-box techniques & cyclomatic complexity|||Quiz 5 — Kỹ thuật white-box & độ phức tạp chu trình',
  slug: 'swt301-quiz-5',
  type: 'QUIZ',
  description: '20 câu: 2 câu "Question" trên slide SWT4 (s.98, s.99), 6 câu từ các ví dụ lưu đồ 1–6, 6 câu về coverage, V(G) và các bài PE (countCharacters, thuế TNCN, tích điểm) + 6 câu từ bộ slide 2023 (bài 5.3: MC/DC, condition coverage, LCSAJ, error guessing).',
  quiz: {
    timeLimitSeconds: 1200,
    questions: [
      q('How many test cases are necessary to achieve 100% statement coverage of printSum(a, b) (if result > 0 print "red"… else if result < 0 print "blue"…)? (SWT4 s.98)|||Cần bao nhiêu test case để đạt 100% statement coverage cho printSum(a, b) (if result > 0 in "red"… else if result < 0 in "blue"…)? (SWT4 s.98)', ['1', '2', '4', '3'], 1),
      q('A section of code has one simple IF statement. How many tests are needed for 100% decision coverage? (s.99)|||Một đoạn code có một lệnh IF đơn giản. Cần bao nhiêu test để đạt 100% decision coverage? (s.99)', ['1', '2', '3', 'Unknown with this information|||Không xác định được với thông tin này'], 1),
      q('Example 1 (valid card? → valid PIN? nested): minimum tests for 100% statement coverage? (s.91–92)|||Ví dụ 1 (thẻ hợp lệ? → PIN hợp lệ? lồng nhau): số test tối thiểu cho 100% statement coverage? (s.91–92)', ['1', '2', '3', '4'], 2),
      q('Example 2 (IF A > 0 THEN IF A = 21 THEN Print): cyclomatic complexity? (s.93)|||Ví dụ 2 (IF A > 0 THEN IF A = 21 THEN Print): cyclomatic complexity? (s.93)', ['1', '2', '3', '4'], 2),
      q('Example 3 (three nested decisions A>0, B=0, A>21): minimum tests for 100% decision coverage? (s.94)|||Ví dụ 3 (ba quyết định lồng A>0, B=0, A>21): số test tối thiểu cho 100% decision coverage? (s.94)', ['2', '3', '4', '5'], 2),
      q('Example 4 (two IF-THEN-ELSE in sequence): number of paths and minimum tests for 100% decision coverage? (s.95)|||Ví dụ 4 (hai IF-THEN-ELSE nối tiếp): số đường đi và số test tối thiểu cho 100% decision coverage? (s.95)', ['2 paths, 2 tests|||2 đường, 2 test', '4 paths, 2 tests|||4 đường, 2 test', '4 paths, 4 tests|||4 đường, 4 test', '3 paths, 3 tests|||3 đường, 3 test'], 1),
      q('Example 5 (IF A < 0 THEN Print; IF B < 0 THEN Print — no ELSE): minimum tests for 100% statement coverage? (s.96)|||Ví dụ 5 (IF A < 0 THEN Print; IF B < 0 THEN Print — không ELSE): số test tối thiểu cho 100% statement coverage? (s.96)', ['1', '2', '3', '4'], 0),
      q('Example 6 (IF A < 0 THEN Print; IF A > 0 THEN Print): minimum tests for 100% decision coverage? (s.97)|||Ví dụ 6 (IF A < 0 THEN Print; IF A > 0 THEN Print): số test tối thiểu cho 100% decision coverage? (s.97)', ['1', '2', '3', '4'], 1),
      q('A program has 120 decision outcomes and the tests exercise 60 of them. Decision coverage is… (s.88)|||Chương trình có 120 kết quả quyết định và test chạy qua 60. Decision coverage là… (s.88)', ['40%', '50%', '60%', '120%'], 1),
      q('Which statement is TRUE?|||Phát biểu nào ĐÚNG?', ['100% statement coverage guarantees 100% decision coverage|||100% statement coverage bảo đảm 100% decision coverage', '100% decision coverage guarantees 100% statement coverage|||100% decision coverage bảo đảm 100% statement coverage', 'The two are always equal|||Hai loại luôn bằng nhau', '100% coverage means the code is fully tested|||100% coverage nghĩa là code đã được test đầy đủ'], 1),
      q('A control-flow graph has 13 edges and 10 nodes (one connected routine). V(G) = ?|||Một đồ thị luồng điều khiển có 13 cạnh và 10 node (một routine liên thông). V(G) = ?', ['3', '4', '5', '23'], 2),
      q('PE FA23: countCharacters(String) loops over the characters with if isUpperCase / else if isLowerCase / else if isDigit / else. Minimum number of test cases for 100% statement AND 100% decision coverage?|||PE FA23: countCharacters(String) lặp qua từng ký tự với if isUpperCase / else if isLowerCase / else if isDigit / else. Số test case tối thiểu cho 100% statement VÀ 100% decision coverage?', ['1', '4', '5', '8'], 0),
      q('PE SU24 tax flowchart: 9 binary decisions, 8 distinct return boxes, and "Return −1" is reached from three different decisions. Minimum tests for 100% statement / 100% decision coverage?|||Lưu đồ thuế PE SU24: 9 quyết định nhị phân, 8 hộp return khác nhau, và "Return −1" được tới từ ba quyết định khác nhau. Số test tối thiểu cho 100% statement / 100% decision coverage?', ['8 / 10', '9 / 10', '8 / 8', '10 / 10'], 0),
      q('Why is 100% path coverage rarely achievable in real code? (s.90)|||Vì sao 100% path coverage hiếm khi đạt được với code thật? (s.90)', ['Tools cannot measure paths|||Công cụ không đo được đường đi', 'Loops make the number of paths unbounded|||Vòng lặp làm số đường đi không giới hạn', 'Every decision has three outcomes|||Mỗi quyết định có ba kết quả', 'Paths only exist in black-box testing|||Đường đi chỉ có trong black-box'], 1),
      // ── 2023 slide set (Lesson 5.3) ──
      qx('MC/DC (2023 deck p.35): minimum number of tests for the decision "A AND B"?|||MC/DC (slide 2023 tr.35): số test tối thiểu cho quyết định "A AND B"?', ['2', '3', '4', '8'], 1,
        '{TT, FT, TF}: FT vs TT shows A changes the outcome alone, TF vs TT shows B does. n + 1 = 3 tests.|||{TT, FT, TF}: FT so với TT cho thấy A tự đổi kết quả, TF so với TT cho thấy B cũng vậy. n + 1 = 3 test.'),
      qx('For "if (A AND B)" the tests are (A=T, B=F) and (A=F, B=T). Which statement is TRUE?|||Với "if (A AND B)" hai test là (A=T, B=F) và (A=F, B=T). Phát biểu nào ĐÚNG?', ['100% condition coverage, but only 50% decision coverage|||100% condition coverage, nhưng chỉ 50% decision coverage', '100% decision coverage|||100% decision coverage', '100% MC/DC|||100% MC/DC', '100% multiple condition coverage|||100% multiple condition coverage'], 0,
        'Each condition is True once and False once, but the decision is False in both tests, so the True outcome is never taken. Condition coverage does not include decision coverage.|||Mỗi điều kiện có một lần True và một lần False, nhưng quyết định đều False nên nhánh True chưa bao giờ chạy. Condition coverage không bao hàm decision coverage.'),
      qx('Branch condition combination (multiple condition) testing of a decision with 3 atomic conditions needs how many combinations?|||Branch condition combination (multiple condition) testing cho một quyết định có 3 điều kiện đơn cần bao nhiêu tổ hợp?', ['3', '4', '6', '8'], 3,
        'All combinations: 2^3 = 8. MC/DC would need only 4 (n + 1).|||Mọi tổ hợp: 2^3 = 8. MC/DC chỉ cần 4 (n + 1).'),
      qx('MC/DC for the decision "A AND (B OR C)": minimum number of tests?|||MC/DC cho quyết định "A AND (B OR C)": số test tối thiểu?', ['3', '4', '6', '8'], 1,
        '{TTF, FTF, TFF, TFT}: A pair TTF/FTF, B pair TTF/TFF, C pair TFF/TFT — 4 tests (checked with a script).|||{TTF, FTF, TFF, TFT}: cặp A là TTF/FTF, cặp B là TTF/TFF, cặp C là TFF/TFT — 4 test (đã kiểm bằng script).'),
      qx('The 2023 page on LCSAJ (p.36) lists four things 100% LCSAJ coverage gives. Which one does it NOT actually guarantee?|||Trang LCSAJ của slide 2023 (tr.36) liệt kê bốn điều mà 100% LCSAJ mang lại. Điều nào nó thực ra KHÔNG bảo đảm?', ['100% statement coverage|||100% statement coverage', '100% branch coverage|||100% branch coverage', '100% function call coverage|||100% function call coverage', '100% multiple condition coverage|||100% multiple condition coverage'], 3,
        'LCSAJ follows jumps between lines and never looks inside a compound condition: for "if (a > 0 && b > 0)" the tests TT and FF cover every LCSAJ but only 2 of 4 condition combinations.|||LCSAJ theo bước nhảy giữa các dòng, không nhìn vào trong điều kiện ghép: với "if (a > 0 && b > 0)" hai test TT và FF phủ mọi LCSAJ nhưng chỉ 2/4 tổ hợp điều kiện.'),
      qx('According to the 2023 deck (p.51), error guessing should always be used…|||Theo slide 2023 (tr.51), error guessing luôn nên được dùng…', ['as the first technique, before any other|||như kỹ thuật đầu tiên, trước mọi kỹ thuật khác', 'only when there is no specification|||chỉ khi không có đặc tả', 'as a complement to other, more formal techniques|||như một kỹ thuật bổ sung cho các kỹ thuật chính thức hơn', 'only by developers|||chỉ bởi lập trình viên'], 2,
        'Error guessing (and its methodical form, fault attacks) complements EP, BVA, decision tables and white-box testing; it never replaces them.|||Error guessing (và dạng có phương pháp của nó, fault attack) bổ sung cho EP, BVA, decision table và white-box; không bao giờ thay thế chúng.'),
    ],
  },
};

export default {
  title: 'Chapter 5 — Test design: white-box techniques|||Chương 5 — Thiết kế test: kỹ thuật white-box',
  description: 'SWT4 slide 82–99 học từng slide: coverage, statement & decision coverage, đường đi và vòng lặp, 6 ví dụ lưu đồ có lời giải, cyclomatic complexity (tham chiếu SWT3) — và giải trọn câu 2 của đề PE bằng JUnit 5 chạy thật.',
  lessons: [L51, L52, L53, QUIZ5],
};
