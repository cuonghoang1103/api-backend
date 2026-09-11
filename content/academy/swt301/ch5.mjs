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
 * Every coverage number was checked twice: by reasoning on the control-flow
 * graph AND by running JUnit 5.12.2 + JaCoCo 0.8.13 on JDK 21.0.9; the
 * outputs pasted below are the real console output.
 */
import { walk, walkHead, books, bi, ansEn as AE, ansVi as AV } from './_slides.mjs';

const D = 'swt4';
const q = (question, options, correctIndex) => ({ question, options, correctIndex, points: 1 });

/* ───────────────────── 5.1 Coverage: statement & decision ───────────────────── */
const L51 = {
  title: '5.1 — White-box testing: coverage, statement & decision coverage|||5.1 — Kiểm thử white-box: coverage, statement & decision coverage',
  slug: 'swt301-whitebox-coverage',
  type: 'VIDEO',
  description: 'SWT4 slide 82–90: hai mục đích của white-box, công thức coverage, bẫy coverage, statement coverage, decision (branch) coverage, số đường đi và vòng lặp — kèm ví dụ đo thật bằng JUnit + JaCoCo.',
  content: [
    bi(`<span class="eyebrow">Chapter 5 · Lesson 5.1 · SWT4 slides 82–90</span>
<h2>White-box testing: measuring what your tests exercised</h2>
<p class="lead">Black-box techniques (Chapter 4) derive tests from the specification. White-box techniques — the syllabus also calls them <strong>structure-based</strong> — look inside, at the statements and decisions of the code. This lesson walks SWT4 slides 82–90: the two purposes of white-box testing, the coverage formula, the <strong>coverage trap</strong>, <strong>statement coverage</strong>, <strong>decision (branch) coverage</strong>, and how the number of paths explodes, especially with loops.</p>
<div class="callout"><b>Learning objectives.</b> LO-4.3.1 Explain statement coverage (K2) · LO-4.3.2 Explain decision coverage (K2) · LO-4.3.3 Explain the value of statement and decision coverage (K2). In the ISTQB exam you must be able to compute a coverage percentage and the minimum number of tests for a short piece of code. In the SWT301 PE (Question 2 of FA23 and SU24, Question 3 of SP25) you must also <em>write</em> those tests — lesson 5.2 does exactly that.</div>
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
<p class="lead">Kỹ thuật black-box (Chương 4) rút test ra từ đặc tả. Kỹ thuật white-box — syllabus còn gọi là <strong>structure-based</strong> (dựa trên cấu trúc) — nhìn vào bên trong: các câu lệnh và các quyết định của code. Bài này đi qua SWT4 slide 82–90: hai mục đích của white-box, công thức coverage, <strong>bẫy coverage</strong>, <strong>statement coverage</strong>, <strong>decision (branch) coverage</strong>, và việc số đường đi bùng nổ ra sao, nhất là khi có vòng lặp.</p>
<div class="callout"><b>Chuẩn đầu ra.</b> LO-4.3.1 Giải thích statement coverage (K2) · LO-4.3.2 Giải thích decision coverage (K2) · LO-4.3.3 Giải thích giá trị của statement và decision coverage (K2). Trong đề ISTQB bạn phải tính được tỉ lệ coverage và số test tối thiểu cho một đoạn code ngắn. Trong PE của SWT301 (câu 2 đề FA23 và SU24, câu 3 đề SP25) bạn còn phải <em>viết</em> các test đó — bài 5.2 làm đúng việc ấy.</div>
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
        `<p>The fourth block of SWT4 opens. The pink box highlights <strong>White-box Test Techniques</strong> and the dashed box lists its two sub-topics: <strong>statement coverage</strong> and <strong>decision coverage</strong>. These are exactly the two white-box techniques in the CTFL 2018 syllabus (§4.3). Condition coverage, MC/DC and path coverage belong to the Advanced (Technical Test Analyst) level; they appear here only as "stronger" levels on slides 84–85. On this site: lesson 5.1 = the concepts (slides 82–90), lesson 5.2 = the six flowchart examples, cyclomatic complexity and the PE question (slides 91–99), then Quiz 5.</p>`,
        `<p>Mở khối thứ tư của SWT4. Ô hồng tô <strong>White-box Test Techniques</strong>, ô nét đứt liệt kê hai mục con: <strong>statement coverage</strong> và <strong>decision coverage</strong>. Đây đúng là hai kỹ thuật white-box có trong syllabus CTFL 2018 (§4.3). Condition coverage, MC/DC và path coverage thuộc cấp Advanced (Technical Test Analyst); ở đây chúng chỉ xuất hiện như các mức "mạnh hơn" trên slide 84–85. Trên trang này: bài 5.1 = khái niệm (slide 82–90), bài 5.2 = sáu ví dụ lưu đồ, cyclomatic complexity và câu hỏi PE (slide 91–99), rồi Quiz 5.</p>`],
      [83, 'White-box Test Techniques — two purposes & the coverage formula',
        `<p>White-box techniques serve <strong>two purposes</strong>: (1) <strong>coverage measurement</strong> — assess how much of the code structure the tests you already have (usually designed with black-box techniques) actually exercised; (2) <strong>structural test design</strong> — design <em>additional</em> tests to increase that coverage. The formula at the bottom is the general one: <em>Coverage = number of coverage items exercised ÷ total number of coverage items × 100%</em>. A <strong>coverage item</strong> is "what we've been able to count and see whether a test has exercised it" — statements, decision outcomes, conditions, paths… (and, for black-box techniques, partitions, boundary values, transitions).</p>
<p>Typical use: you run your 20 EP/BVA tests with a coverage tool (JaCoCo in Java, coverage.py in Python, Istanbul/nyc in JavaScript) and it reports 85% of statements. The red lines tell you which code no test touched — you then design tests to reach them. Coverage is a <em>measure</em> of thoroughness, not a guarantee of correctness (slide 85).</p>`,
        `<p>Kỹ thuật white-box phục vụ <strong>hai mục đích</strong>: (1) <strong>đo coverage</strong> — đánh giá bộ test sẵn có (thường thiết kế bằng black-box) thực sự đã chạy qua bao nhiêu phần cấu trúc code; (2) <strong>thiết kế test theo cấu trúc</strong> — thiết kế thêm test để tăng coverage đó. Công thức ở cuối slide là công thức chung: <em>Coverage = số coverage item đã được chạy ÷ tổng số coverage item × 100%</em>. <strong>Coverage item</strong> là "thứ ta đếm được và xem được một test đã chạy qua nó hay chưa" — câu lệnh, kết quả quyết định, điều kiện, đường đi… (và với black-box là phân vùng, giá trị biên, chuyển trạng thái).</p>
<p>Cách dùng thường gặp: bạn chạy 20 test EP/BVA với công cụ đo coverage (JaCoCo cho Java, coverage.py cho Python, Istanbul/nyc cho JavaScript) và nó báo 85% câu lệnh. Những dòng tô đỏ cho biết code nào chưa test nào chạm tới — bạn thiết kế thêm test để với tới chúng. Coverage là <em>thước đo</em> độ kỹ lưỡng, không phải bảo đảm code đúng (slide 85).</p>`],
      [84, 'Using Structural Coverage — the feedback loop',
        `<p>Read the diagram as a loop. <strong>Spec → Tests → Software</strong>; after running we ask "<em>Results OK?</em>" (did the software behave as the spec says?) and "<em>Enough tests?</em>" (the arrow goes back to the spec). The black shadow under the Tests bubble asks "<em>What's covered?</em>" — the coverage tool. If "<em>Coverage OK?</em>" is no, we write "<em>More tests</em>" and go round again.</p>
<p>The small pictures show the structure being covered. Top row: dark boxes and diamonds, with the <em>black</em> ones not yet executed — that is statement-level thinking. Bottom row: the red lines are decision outcomes and paths, and they cover more and more of the graph from left to right ("<strong>Increasing coverage</strong>"). The downward arrow "<strong>Stronger structural techniques (different structural elements)</strong>" means going from statements to decision outcomes to paths: each level counts a different element and demands more tests. In a real project the exit criterion is written as a target, e.g. "≥ 80% decision coverage for all new classes".</p>`,
        `<p>Đọc hình như một vòng lặp. <strong>Spec → Tests → Software</strong>; sau khi chạy ta hỏi "<em>Results OK?</em>" (phần mềm có chạy đúng như đặc tả không?) và "<em>Enough tests?</em>" (mũi tên quay về spec). Bóng đen dưới bong bóng Tests hỏi "<em>What's covered?</em>" — tức công cụ đo coverage. Nếu "<em>Coverage OK?</em>" là chưa, ta viết thêm "<em>More tests</em>" và quay lại vòng mới.</p>
<p>Các hình nhỏ cho thấy cấu trúc đang được phủ. Hàng trên: các hộp và hình thoi, hộp <em>đen</em> là phần chưa chạy tới — đó là tư duy mức câu lệnh. Hàng dưới: đường đỏ là các kết quả quyết định và đường đi, phủ ngày càng nhiều đồ thị từ trái sang phải ("<strong>Increasing coverage</strong>"). Mũi tên đi xuống "<strong>Stronger structural techniques (different structural elements)</strong>" nghĩa là đi từ câu lệnh sang kết quả quyết định rồi sang đường đi: mỗi mức đếm một loại phần tử khác và đòi nhiều test hơn. Trong dự án thật, tiêu chí kết thúc được viết thành chỉ tiêu, ví dụ "≥ 80% decision coverage cho mọi class mới".</p>`],
      [85, 'The test coverage trap',
        `<p>Two axes: <strong>structural testedness</strong> (x: % statement → % decision → % condition combination) and <strong>functional testedness</strong> (y: how much of the specified behaviour you tested). Top-left box: "<em>Function exercised, insufficient structure</em>" — black-box only, big parts of the code never ran. Bottom-right box: "<em>Structure exercised, insufficient function</em>" — white-box only, every line ran but features were not checked. The diagonal arrow "<em>better testing</em>" needs <strong>both</strong>.</p>
<p>The two coloured boxes are the sentences to memorise: <strong>"100% coverage does not mean 100% tested!"</strong> and <strong>"Coverage is only one aspect of thoroughness."</strong> Two reasons: (1) code cannot show you what is <em>missing</em> — if the requirement "send a receipt e-mail" was never coded, 100% coverage of the code says nothing about it; (2) a test can execute a line without checking its result — a test with no assertion still counts as coverage. This is why white-box complements black-box, never replaces it.</p>`,
        `<p>Hai trục: <strong>mức test theo cấu trúc</strong> (trục x: % statement → % decision → % tổ hợp điều kiện) và <strong>mức test theo chức năng</strong> (trục y: đã test bao nhiêu hành vi trong đặc tả). Ô trên-trái: "<em>Function exercised, insufficient structure</em>" — chỉ làm black-box, nhiều phần code chưa bao giờ chạy. Ô dưới-phải: "<em>Structure exercised, insufficient function</em>" — chỉ làm white-box, dòng nào cũng chạy nhưng tính năng thì chưa được kiểm. Mũi tên chéo "<em>better testing</em>" cần <strong>cả hai</strong>.</p>
<p>Hai ô màu là hai câu phải thuộc: <strong>"100% coverage không có nghĩa là đã test 100%!"</strong> và <strong>"Coverage chỉ là một khía cạnh của độ kỹ lưỡng."</strong> Hai lý do: (1) code không cho bạn thấy cái gì <em>bị thiếu</em> — nếu yêu cầu "gửi e-mail biên nhận" chưa hề được code, 100% coverage của code không nói gì về nó; (2) một test có thể chạy qua một dòng mà không kiểm kết quả — test không có assertion vẫn được tính coverage. Vì vậy white-box bổ sung cho black-box chứ không thay thế nó.</p>`],
      [86, 'Statement coverage',
        `<p><strong>Statement coverage</strong> = number of statements exercised ÷ total number of (executable) statements. Example: a program has 100 statements, the tests exercise 87 → 87%. It is "normally measured by a software tool", and "<strong>typical ad hoc testing achieves 60–75%</strong>" — meaning a quarter or more of the code is never run by casual testing.</p>
<p>The green flowchart on the right: one decision "?" whose False arrow bypasses the middle box. A single test that goes down the True side executes every green box → 100% statement coverage, although the bypass arrow was never used. Keep this picture in mind: it is the whole reason decision coverage exists (slide 88).</p>
<p><strong>What counts as a statement?</strong> Executable statements only: assignments, calls, returns, input/output, and the IF/WHILE test itself. Comments, braces, <code>ELSE</code>/<code>ENDIF</code> keywords and declarations without initialisation are not counted. Tools count <em>lines</em> or bytecode instructions, so their percentages may differ a little from a hand count.</p>`,
        `<p><strong>Statement coverage</strong> = số câu lệnh đã chạy ÷ tổng số câu lệnh (thực thi được). Ví dụ: chương trình có 100 câu lệnh, test chạy qua 87 → 87%. Nó "thường được đo bằng công cụ phần mềm", và "<strong>test ad hoc điển hình chỉ đạt 60–75%</strong>" — tức một phần tư code trở lên không bao giờ được chạy khi test tuỳ hứng.</p>
<p>Lưu đồ xanh bên phải: một quyết định "?" có mũi tên False đi vòng qua hộp ở giữa. Chỉ một test đi theo nhánh True là chạy qua mọi hộp xanh → 100% statement coverage, dù mũi tên đi vòng chưa hề được dùng. Nhớ hình này: nó là toàn bộ lý do decision coverage ra đời (slide 88).</p>
<p><strong>Thế nào là một câu lệnh?</strong> Chỉ tính câu lệnh thực thi được: gán, gọi hàm, return, nhập/xuất, và chính phép kiểm tra IF/WHILE. Chú thích, dấu ngoặc, từ khoá <code>ELSE</code>/<code>ENDIF</code> và khai báo không khởi tạo thì không tính. Công cụ đếm theo <em>dòng</em> hoặc lệnh bytecode, nên tỉ lệ của nó có thể lệch chút ít so với đếm tay.</p>`],
      [87, 'Example of statement coverage — read(a); IF a > 6',
        `<p>Five numbered lines: 1 <code>read(a)</code>, 2 <code>IF a &gt; 6 THEN</code>, 3 <code>b = a</code>, 4 <code>ENDIF</code>, 5 <code>print b</code>. One test case: input 7, expected output 7. Since 7 &gt; 6, all five lines run → "we have achieved 100% statement coverage". (The slide numbers <code>ENDIF</code> as a statement to keep the picture simple; with only the 4 executable statements the answer is still 100%.)</p>
<p>Now look at what that single test did <em>not</em> do: the decision <code>a &gt; 6</code> was only ever True, so decision coverage is 1 of 2 outcomes = <strong>50%</strong>. And the False side hides a real defect: for <code>a = 3</code>, <code>b</code> is never assigned, so <code>print b</code> prints an undefined value — the "variable used before it has been defined" data-flow fault of SWT3 slide 98. 100% statement coverage let it through; one more test (a = 3) for decision coverage would have exposed it.</p>`,
        `<p>Năm dòng được đánh số: 1 <code>read(a)</code>, 2 <code>IF a &gt; 6 THEN</code>, 3 <code>b = a</code>, 4 <code>ENDIF</code>, 5 <code>print b</code>. Một test case: input 7, output mong đợi 7. Vì 7 &gt; 6 nên cả năm dòng đều chạy → "đã đạt 100% statement coverage". (Slide đánh số cả <code>ENDIF</code> như một câu lệnh cho hình đơn giản; nếu chỉ tính 4 câu lệnh thực thi được thì đáp án vẫn là 100%.)</p>
<p>Giờ nhìn cái mà test duy nhất đó <em>không</em> làm: quyết định <code>a &gt; 6</code> chỉ từng đúng (True), nên decision coverage là 1/2 kết quả = <strong>50%</strong>. Và nhánh False giấu một defect thật: với <code>a = 3</code>, <code>b</code> không bao giờ được gán, nên <code>print b</code> in ra giá trị không xác định — đúng lỗi luồng dữ liệu "biến được dùng trước khi được định nghĩa" ở SWT3 slide 98. 100% statement coverage để lọt nó; thêm một test (a = 3) cho decision coverage là lộ ngay.</p>`],
      [88, 'Decision coverage (Branch coverage)',
        `<p><strong>Decision coverage</strong> = number of decision outcomes exercised ÷ total number of decision outcomes. Example: 120 outcomes, 60 exercised → 50%. Also measured by a tool; "<strong>typical ad hoc testing achieves 40–60%</strong>" — lower than for statements, because casual testing mostly follows the happy path.</p>
<p>The diagram shows one decision with its two outcomes: <span style="color:#16a34a">True</span> (green, straight down through the box) and <span style="color:#dc2626">False</span> (red, around the box). The red False arrow is exactly the part statement coverage ignores. Decisions include every <code>IF</code>/<code>ELSE IF</code>, every loop condition (<code>WHILE</code>, <code>FOR</code>, <code>DO…WHILE</code>) and every <code>CASE</code> (each case label is an outcome).</p>
<p>Two facts for the exam: (1) <strong>100% decision coverage guarantees 100% statement coverage</strong> (every statement lies on some outcome — assuming no unreachable code), but not vice versa; (2) CTFL 2018 says "decision coverage"; the slide title and many tools say "branch coverage". For the exam treat them as the same thing (strictly, branch coverage counts the edges of the control-flow graph, including unconditional ones).</p>`,
        `<p><strong>Decision coverage</strong> = số kết quả quyết định đã chạy ÷ tổng số kết quả quyết định. Ví dụ: 120 kết quả, chạy qua 60 → 50%. Cũng đo bằng công cụ; "<strong>test ad hoc điển hình chỉ đạt 40–60%</strong>" — thấp hơn statement, vì test tuỳ hứng chủ yếu đi theo đường suôn sẻ (happy path).</p>
<p>Hình vẽ một quyết định với hai kết quả: <span style="color:#16a34a">True</span> (xanh, đi thẳng xuống qua hộp) và <span style="color:#dc2626">False</span> (đỏ, đi vòng qua hộp). Mũi tên False màu đỏ chính là phần statement coverage bỏ qua. Quyết định gồm mọi <code>IF</code>/<code>ELSE IF</code>, mọi điều kiện vòng lặp (<code>WHILE</code>, <code>FOR</code>, <code>DO…WHILE</code>) và mọi <code>CASE</code> (mỗi nhãn case là một kết quả).</p>
<p>Hai điều cho kỳ thi: (1) <strong>100% decision coverage bảo đảm 100% statement coverage</strong> (mọi câu lệnh đều nằm trên một kết quả nào đó — với điều kiện không có code không thể tới), nhưng chiều ngược lại thì không; (2) CTFL 2018 dùng chữ "decision coverage"; tiêu đề slide và nhiều công cụ dùng "branch coverage". Khi thi coi hai chữ là một (nói chặt thì branch coverage đếm các cạnh của đồ thị luồng điều khiển, kể cả cạnh không điều kiện).</p>`],
      [89, 'Paths through code',
        `<p>Four little graphs, each with its paths drawn in colour. (1) An <strong>IF without ELSE</strong>: 2 paths — green through the box, blue around it. (2) An <strong>IF-THEN-ELSE</strong>: still 2 paths. (3) An IF whose False side leads into a <strong>second IF</strong> (a cascade, like ELSE IF): 3 paths (green, blue, orange). (4) <strong>Two IFs one after the other</strong>, each with a box on its True side: 4 paths (green, blue, orange, red) = 2 × 2.</p>
<p>The rule behind it: decisions in <strong>sequence multiply</strong> the number of paths (n independent IFs → 2<sup>n</sup> paths), decisions <strong>nested/cascaded add</strong> (n decisions → n + 1 paths). <strong>Path coverage</strong> (every path at least once) is the strongest structural criterion, but it grows fast — which is why Example 4 on slide 95 has 4 paths yet needs only 2 tests for decision coverage.</p>`,
        `<p>Bốn đồ thị nhỏ, mỗi đồ thị vẽ các đường đi bằng màu. (1) <strong>IF không có ELSE</strong>: 2 đường — xanh lá đi qua hộp, xanh dương đi vòng. (2) <strong>IF-THEN-ELSE</strong>: vẫn 2 đường. (3) Một IF mà nhánh False dẫn vào <strong>IF thứ hai</strong> (dạng bậc thang, giống ELSE IF): 3 đường (xanh lá, xanh dương, cam). (4) <strong>Hai IF nối tiếp nhau</strong>, mỗi IF có một hộp ở nhánh True: 4 đường (xanh lá, xanh dương, cam, đỏ) = 2 × 2.</p>
<p>Quy luật đằng sau: các quyết định <strong>nối tiếp thì nhân</strong> số đường (n IF độc lập → 2<sup>n</sup> đường), các quyết định <strong>lồng/bậc thang thì cộng</strong> (n quyết định → n + 1 đường). <strong>Path coverage</strong> (mọi đường đi ít nhất một lần) là tiêu chí cấu trúc mạnh nhất, nhưng tăng rất nhanh — vì thế Ví dụ 4 ở slide 95 có 4 đường mà decision coverage chỉ cần 2 test.</p>`],
      [90, 'Paths through code with loops',
        `<p>With a loop, every extra trip round the loop is a new path: path 1 skips the loop, path 2 goes round once, path 3 twice… "<em>for as many times as it is possible to go round the loop (this can be unlimited, i.e. infinite)</em>". So 100% path coverage is impossible for most real code — the structural version of Principle 2 "exhaustive testing is impossible" (SWT1). Practical answer: take <strong>decision coverage</strong> as the target (the loop condition must be True at least once and False at least once) and, from experience, test each loop <strong>0 times, once and many times</strong> (see the ★ box below).</p>`,
        `<p>Có vòng lặp thì mỗi lần đi thêm một vòng là một đường mới: đường 1 bỏ qua vòng lặp, đường 2 đi một vòng, đường 3 hai vòng… "<em>đi bao nhiêu vòng cũng được, có thể không giới hạn, tức là vô hạn</em>". Nên 100% path coverage là bất khả thi với hầu hết code thật — đây là phiên bản cấu trúc của Nguyên tắc 2 "không thể test vét cạn" (SWT1). Cách làm thực tế: lấy <strong>decision coverage</strong> làm chỉ tiêu (điều kiện vòng lặp phải đúng ít nhất một lần và sai ít nhất một lần) và, theo kinh nghiệm, test mỗi vòng lặp <strong>0 lần, 1 lần và nhiều lần</strong> (xem ô ★ bên dưới).</p>`],
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
<p><strong>By reasoning.</strong> Executable statements: lines 4, 5, 6, 8 (4 statements). Decision outcomes: <code>total &gt; 100</code> True and False (2 outcomes). Test T1: total = 200 → expected 190. T1 runs lines 4-5-6-8 → statement coverage 4/4 = 100%, but only the True outcome → decision coverage 1/2 = 50%. Add T2: total = 50 → expected 50 (False outcome) → decision coverage 2/2 = 100%. So: minimum 1 test for 100% statement coverage, 2 tests for 100% decision coverage.</p>
<p><strong>By measurement.</strong> We ran exactly these inputs under the JaCoCo 0.8.13 agent (JDK 21) and read the counters with JaCoCo's analyzer. Real output:</p>
<pre><code>disc-1   Coverage.discount  lines 4/4  branches 1/2 (50%)
         missed: L5(1 branch missed)
disc-2   Coverage.discount  lines 4/4  branches 2/2 (100%)</code></pre>
<p>The tool agrees with the hand count, and it points at line 5 — the decision whose False side no test took. That is how coverage is used in practice: run the black-box tests, read the report, design a test for each red or yellow line.</p>
<div class="pitfall"><b>Exam traps.</b> (1) "100% statement coverage implies 100% decision coverage" — <em>false</em>; it is the other way round. (2) "Coverage is measured on the specification" — no, statement and decision coverage are measured on the <em>code</em> (black-box techniques have their own coverage items). (3) Counting <code>ELSE</code>, <code>ENDIF</code> or <code>}</code> as statements. (4) Forgetting that a loop condition is a decision with a True and a False outcome.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Stronger criteria and how industry uses them.</b> <em>Condition coverage</em> makes every atomic condition in <code>if (a &amp;&amp; b)</code> both true and false; <em>MC/DC</em> (modified condition/decision coverage) additionally shows that each condition independently changes the decision — required for the most critical avionics software by DO-178C. For loops, Beizer's <em>loop testing</em> heuristic is: skip the loop, 1 pass, 2 passes, a typical number, max−1, max, max+1. And to check whether your assertions are any good, <em>mutation testing</em> (PIT for Java) plants small bugs and counts how many your tests kill — a suite with 100% coverage and no assertions kills none. <em>Outside the syllabus because CTFL 2018 limits white-box testing to statement and decision coverage; the rest is Advanced Technical Test Analyst material.</em></div>`,
    `<h3>Ví dụ có lời giải · Đo, đừng đoán</h3>
<p>Quy tắc giảm giá "đơn trên 100 được giảm 10" viết bằng Java — cùng dạng với slide 87 (IF không có ELSE):</p>
<pre><code>public static int discount(int total) {   // dòng 3
    int d = 0;                            // dòng 4
    if (total &gt; 100) {                    // dòng 5  — quyết định duy nhất
        d = 10;                           // dòng 6
    }
    return total - d;                     // dòng 8
}</code></pre>
<p><strong>Bằng lập luận.</strong> Câu lệnh thực thi được: dòng 4, 5, 6, 8 (4 câu lệnh). Kết quả quyết định: <code>total &gt; 100</code> True và False (2 kết quả). Test T1: total = 200 → mong đợi 190. T1 chạy dòng 4-5-6-8 → statement coverage 4/4 = 100%, nhưng chỉ có kết quả True → decision coverage 1/2 = 50%. Thêm T2: total = 50 → mong đợi 50 (kết quả False) → decision coverage 2/2 = 100%. Vậy: tối thiểu 1 test cho 100% statement coverage, 2 test cho 100% decision coverage.</p>
<p><strong>Bằng đo đạc.</strong> Chúng tôi chạy đúng các input này dưới agent JaCoCo 0.8.13 (JDK 21) và đọc bộ đếm bằng analyzer của JaCoCo. Output thật:</p>
<pre><code>disc-1   Coverage.discount  lines 4/4  branches 1/2 (50%)
         missed: L5(1 branch missed)
disc-2   Coverage.discount  lines 4/4  branches 2/2 (100%)</code></pre>
<p>Công cụ khớp với phép đếm tay, và nó chỉ đúng dòng 5 — quyết định có nhánh False chưa test nào đi qua. Đó là cách dùng coverage ngoài thực tế: chạy bộ test black-box, đọc báo cáo, thiết kế một test cho mỗi dòng đỏ hoặc vàng.</p>
<div class="pitfall"><b>Bẫy trong đề.</b> (1) "100% statement coverage kéo theo 100% decision coverage" — <em>sai</em>; ngược lại mới đúng. (2) "Coverage được đo trên đặc tả" — không, statement và decision coverage đo trên <em>code</em> (kỹ thuật black-box có coverage item riêng). (3) Đếm <code>ELSE</code>, <code>ENDIF</code> hay <code>}</code> là câu lệnh. (4) Quên rằng điều kiện vòng lặp cũng là một quyết định có kết quả True và False.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Các tiêu chí mạnh hơn và cách ngành dùng chúng.</b> <em>Condition coverage</em> bắt mỗi điều kiện đơn trong <code>if (a &amp;&amp; b)</code> phải vừa đúng vừa sai; <em>MC/DC</em> (modified condition/decision coverage) còn phải chỉ ra mỗi điều kiện tự nó làm đổi kết quả quyết định — bắt buộc cho phần mềm hàng không mức nghiêm trọng nhất theo DO-178C. Với vòng lặp, heuristic <em>loop testing</em> của Beizer là: bỏ qua vòng lặp, 1 vòng, 2 vòng, số vòng điển hình, max−1, max, max+1. Còn để biết assertion của bạn có tốt không, <em>mutation testing</em> (PIT cho Java) cài những lỗi nhỏ vào code rồi đếm xem test "giết" được bao nhiêu — bộ test 100% coverage mà không có assertion thì không giết được con nào. <em>Ngoài giáo trình vì CTFL 2018 chỉ giới hạn white-box ở statement và decision coverage; phần còn lại thuộc Advanced Technical Test Analyst.</em></div>`),
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
<p class="lead">This is the lesson that earns points in the practical exam. It walks the six flowchart examples of SWT4 (slides 91–97) and the two questions (98–99), borrows three cyclomatic-complexity figures from SWT3, and then solves three real PE questions end to end — <strong>FA23 Q2 countCharacters</strong>, <strong>SP25 Q3 calculateRewardPoints</strong> and the <strong>SU24 PE1 income-tax flowchart</strong>: control-flow graph, V(G), minimum tests for 100% statement and 100% decision coverage, JUnit 5 code, real output.</p>
<div class="callout"><b>Learning objectives.</b> LO-4.3.1 (K2) and LO-4.3.2 (K2) applied to code and flowcharts · LO-4.3.3 Explain the value of statement and decision coverage (K2). Cyclomatic complexity itself is a static-analysis metric (SWT3, Chapter 3); CTFL 2018 has no separate LO for it, but slides 93–97 ask for it and the PE uses it.</div>
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
<tr><td>IFs in sequence → min DC is usually 2</td><td>One test takes all True sides, another all False sides, however many IFs there are (Examples 4, 5, 6) — but paths = 2<sup>n</sup>.</td></tr>
<tr><td>IF without ELSE → SC needs only the True side</td><td>The False side has no statement of its own (Examples 2, 5).</td></tr>
<tr><td>Loops → one test can do a lot</td><td>Each iteration can take a different outcome of the IFs inside the loop (countCharacters: V(G) = 5, one test is enough).</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 5 · Bài 5.2 · SWT4 slide 91–99 (+ SWT3 slide 101–103)</span>
<h2>Độ phức tạp chu trình và bộ test tối thiểu</h2>
<p class="lead">Đây là bài kiếm điểm trong kỳ thi thực hành. Nó đi qua sáu ví dụ lưu đồ của SWT4 (slide 91–97) và hai câu hỏi (98–99), mượn ba hình về cyclomatic complexity từ SWT3, rồi giải trọn ba câu PE thật — <strong>FA23 câu 2 countCharacters</strong>, <strong>SP25 câu 3 calculateRewardPoints</strong> và <strong>lưu đồ thuế thu nhập cá nhân của SU24 PE1</strong>: đồ thị luồng điều khiển, V(G), số test tối thiểu cho 100% statement và 100% decision coverage, code JUnit 5, output chạy thật.</p>
<div class="callout"><b>Chuẩn đầu ra.</b> LO-4.3.1 (K2) và LO-4.3.2 (K2) áp dụng trên code và lưu đồ · LO-4.3.3 Giải thích giá trị của statement và decision coverage (K2). Bản thân cyclomatic complexity là một chỉ số của phân tích tĩnh (SWT3, Chương 3); CTFL 2018 không có LO riêng cho nó, nhưng slide 93–97 hỏi nó và đề PE dùng nó.</div>
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
<tr><td>IF nối tiếp → min DC thường là 2</td><td>Một test đi hết các nhánh True, một test đi hết các nhánh False, bao nhiêu IF cũng vậy (Ví dụ 4, 5, 6) — nhưng số đường = 2<sup>n</sup>.</td></tr>
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
        `<p>Cyclomatic complexity (McCabe, 1976) is "a measure of the complexity of a flow graph, and therefore of the code that the flow graph represents"; the more complex the graph, the greater the number. The slide gives the easy formula: <strong>complexity = number of decisions + 1</strong>. The graph formula behind it is <strong>V(G) = E − N + 2</strong> (E edges, N nodes, for one connected routine; in general E − N + 2P with P components). Both give the same answer when every decision is binary; a CASE with k outcomes counts as k − 1 decisions. Meaning of the number: it is the count of <em>linearly independent paths</em> (basis paths) through the routine — and so an upper bound on the tests needed for decision coverage.</p>`,
        `<p>Cyclomatic complexity (McCabe, 1976) là "thước đo độ phức tạp của một đồ thị luồng, và do đó của đoạn code mà đồ thị biểu diễn"; đồ thị càng phức tạp, con số càng lớn. Slide cho công thức dễ: <strong>độ phức tạp = số quyết định + 1</strong>. Công thức theo đồ thị đứng sau nó là <strong>V(G) = E − N + 2</strong> (E cạnh, N node, với một routine liên thông; tổng quát là E − N + 2P với P thành phần). Hai cách cho cùng kết quả khi mọi quyết định là nhị phân; một CASE có k kết quả tính là k − 1 quyết định. Ý nghĩa con số: đó là số <em>đường độc lập tuyến tính</em> (basis path) qua routine — nên cũng là cận trên của số test cần cho decision coverage.</p>`],
      [102, 'Which flow graph is most complex? (cross-reference from SWT3)',
        `<p>The red numbers are the answers — the V(G) of each graph. Graph <strong>1</strong>: two boxes in a straight line, no decision → 0 + 1 = 1. Graph <strong>2</strong>: one diamond → 1 + 1 = 2. Graph <strong>3</strong>: two diamonds → 3. Graph <strong>5</strong>: four diamonds → 5, the most complex. Check one with the graph formula: graph 2 has 5 nodes (box, diamond, two boxes, end box) and 5 edges → 5 − 5 + 2 = 2.</p>`,
        `<p>Các số đỏ là đáp án — V(G) của từng đồ thị. Đồ thị <strong>1</strong>: hai hộp nối thẳng, không có quyết định → 0 + 1 = 1. Đồ thị <strong>2</strong>: một hình thoi → 1 + 1 = 2. Đồ thị <strong>3</strong>: hai hình thoi → 3. Đồ thị <strong>5</strong>: bốn hình thoi → 5, phức tạp nhất. Kiểm lại một cái bằng công thức đồ thị: đồ thị 2 có 5 node (hộp, hình thoi, hai hộp, hộp cuối) và 5 cạnh → 5 − 5 + 2 = 2.</p>`],
      [103, 'Example control flow graph (cross-reference from SWT3)',
        `<p>Pseudo-code that scores a quiz: a <code>DO WHILE more Questions</code> loop containing <code>IF Answer = Correct THEN Right = Right + 1</code>, then <code>Result = Right / Questions</code> and <code>IF Result &gt; 60% THEN Print "pass" ELSE Print "fail"</code>. The graph beside it has the nodes init, do, if, r=r+1, end (end of loop body), res, if, pass, fail, end = <strong>10 nodes</strong> and <strong>12 edges</strong> (init→do, do→if, do→res, if→r=r+1, if→end, r=r+1→end, end→do, res→if, if→pass, if→fail, pass→end, fail→end). V(G) = 12 − 10 + 2 = <strong>4</strong> = 3 decisions + 1 ✓.</p>
<p>Minimum tests: statement coverage needs "pass" and "fail" → <strong>2</strong> tests (e.g. 2 answers both correct → pass; 2 answers one correct one wrong → 50% → fail — the second test also takes the False side of the inner IF). Those same 2 tests give 100% decision coverage (loop condition True and False in both). And an error-guessing idea for Chapter 6: <code>Questions = 0</code> → division by zero.</p>`,
        `<p>Mã giả chấm một bài trắc nghiệm: vòng lặp <code>DO WHILE more Questions</code> chứa <code>IF Answer = Correct THEN Right = Right + 1</code>, rồi <code>Result = Right / Questions</code> và <code>IF Result &gt; 60% THEN Print "pass" ELSE Print "fail"</code>. Đồ thị bên cạnh có các node init, do, if, r=r+1, end (cuối thân vòng lặp), res, if, pass, fail, end = <strong>10 node</strong> và <strong>12 cạnh</strong> (init→do, do→if, do→res, if→r=r+1, if→end, r=r+1→end, end→do, res→if, if→pass, if→fail, pass→end, fail→end). V(G) = 12 − 10 + 2 = <strong>4</strong> = 3 quyết định + 1 ✓.</p>
<p>Số test tối thiểu: statement coverage cần cả "pass" và "fail" → <strong>2</strong> test (vd 2 câu đều đúng → pass; 2 câu một đúng một sai → 50% → fail — test thứ hai cũng đi nhánh False của IF bên trong). Chính 2 test đó cho 100% decision coverage (điều kiện vòng lặp có cả True và False trong cả hai). Và một ý error guessing cho Chương 6: <code>Questions = 0</code> → chia cho 0.</p>`],
    ]),
    walkHead(D, 91, 99, 'Every "fill in the blank" example is solved below with the graph, the formula and the concrete tests — cover the answers and try first.', 'Mọi ví dụ "điền vào chỗ trống" đều được giải bên dưới bằng đồ thị, công thức và test cụ thể — hãy che đáp án và tự làm trước.'),
    walk(D, [
      [91, 'Example 1 — ATM card and PIN (pseudo-code)',
        `<p>Pseudo-code of an ATM: wait for a card; <code>IF card is a valid card THEN</code> display "Enter PIN number" and <code>IF PIN is valid THEN</code> select transaction <code>ELSE</code> display "PIN invalid"; <code>ELSE</code> reject card; End. Note the structure: the PIN decision is <strong>nested</strong> inside the THEN of the card decision. Before turning the page, try to answer: how many decisions? how many different "endings"? (Answers on slide 92.)</p>`,
        `<p>Mã giả của một máy ATM: chờ thẻ; <code>IF thẻ hợp lệ THEN</code> hiển thị "Enter PIN number" và <code>IF PIN hợp lệ THEN</code> chọn giao dịch <code>ELSE</code> hiển thị "PIN invalid"; <code>ELSE</code> từ chối thẻ; End. Để ý cấu trúc: quyết định PIN <strong>lồng</strong> bên trong nhánh THEN của quyết định thẻ. Trước khi lật slide, thử trả lời: có mấy quyết định? có mấy "kết cục" khác nhau? (Đáp án ở slide 92.)</p>`],
      [92, 'Example 1 — the flowchart',
        `<p>The flowchart: Wait → <em>Valid card?</em> — No → Reject card → End; Yes → Display "Enter…" → <em>Valid PIN?</em> — Yes → Select trans… → End; No → Display "PIN in…" → End. The slide gives no numbers, so here is the full solution:</p>
<ul>
<li><strong>V(G)</strong>: 2 decisions + 1 = <strong>3</strong>. Graph check: nodes Wait, Valid card, Display Enter, Valid PIN, Select, PIN invalid, Reject, End = 8; edges = 9 (Wait→card, card→Display, card→Reject, Display→PIN, PIN→Select, PIN→Invalid, Select→End, Invalid→End, Reject→End) → 9 − 8 + 2 = 3.</li>
<li><strong>Minimum tests for 100% statement coverage: 3</strong> — "Reject card", "Select transaction" and "PIN invalid" are on three mutually exclusive paths, and each test reaches only one of them.</li>
<li><strong>Minimum tests for 100% decision coverage: 3</strong> — the same three tests: T1 invalid card (card = No); T2 valid card + valid PIN (card = Yes, PIN = Yes); T3 valid card + wrong PIN (card = Yes, PIN = No).</li>
</ul>
<p>Fully nested decisions → min SC = min DC = V(G) = number of paths = 3.</p>`,
        `<p>Lưu đồ: Wait → <em>Valid card?</em> — No → Reject card → End; Yes → Display "Enter…" → <em>Valid PIN?</em> — Yes → Select trans… → End; No → Display "PIN in…" → End. Slide không cho đáp số, nên đây là lời giải đầy đủ:</p>
<ul>
<li><strong>V(G)</strong>: 2 quyết định + 1 = <strong>3</strong>. Kiểm bằng đồ thị: các node Wait, Valid card, Display Enter, Valid PIN, Select, PIN invalid, Reject, End = 8; cạnh = 9 (Wait→card, card→Display, card→Reject, Display→PIN, PIN→Select, PIN→Invalid, Select→End, Invalid→End, Reject→End) → 9 − 8 + 2 = 3.</li>
<li><strong>Số test tối thiểu cho 100% statement coverage: 3</strong> — "Reject card", "Select transaction" và "PIN invalid" nằm trên ba đường loại trừ nhau, mỗi test chỉ tới được một cái.</li>
<li><strong>Số test tối thiểu cho 100% decision coverage: 3</strong> — chính ba test đó: T1 thẻ không hợp lệ (card = No); T2 thẻ hợp lệ + PIN đúng (card = Yes, PIN = Yes); T3 thẻ hợp lệ + PIN sai (card = Yes, PIN = No).</li>
</ul>
<p>Quyết định lồng hoàn toàn → min SC = min DC = V(G) = số đường = 3.</p>`],
      [93, 'Example 2 — IF A > 0 THEN IF A = 21 THEN Print "Key"',
        `<p>Code: <code>Read A; IF A &gt; 0 THEN IF A = 21 THEN Print "Key" ENDIF ENDIF</code>. Flowchart: Read → <em>A&gt;0</em> — No → End; Yes → <em>A=21</em> — No → End; Yes → Print → End. The red answers: <strong>V(G) = 3, statement coverage 1, branch coverage 3</strong>. Why:</p>
<ul>
<li>V(G): 2 decisions + 1 = 3 (graph: 5 nodes Read, A&gt;0, A=21, Print, End; 6 edges → 6 − 5 + 2 = 3).</li>
<li>Statement coverage = <strong>1</strong>: A = 21 passes both decisions and runs every statement (both IFs are IF-without-ELSE, so the False sides contain no statement).</li>
<li>Decision coverage = <strong>3</strong>: A = 21 (True, True), A = 5 (A&gt;0 True, A=21 False), A = −3 (A&gt;0 False). You cannot do it in 2: A&gt;0 False ends the program immediately, so a second test can reach only one of the two outcomes of A = 21.</li>
</ul>`,
        `<p>Code: <code>Read A; IF A &gt; 0 THEN IF A = 21 THEN Print "Key" ENDIF ENDIF</code>. Lưu đồ: Read → <em>A&gt;0</em> — No → End; Yes → <em>A=21</em> — No → End; Yes → Print → End. Đáp án đỏ: <strong>V(G) = 3, statement coverage 1, branch coverage 3</strong>. Vì sao:</p>
<ul>
<li>V(G): 2 quyết định + 1 = 3 (đồ thị: 5 node Read, A&gt;0, A=21, Print, End; 6 cạnh → 6 − 5 + 2 = 3).</li>
<li>Statement coverage = <strong>1</strong>: A = 21 qua được cả hai quyết định và chạy mọi câu lệnh (cả hai IF đều không có ELSE, nên nhánh False không chứa câu lệnh nào).</li>
<li>Decision coverage = <strong>3</strong>: A = 21 (True, True), A = 5 (A&gt;0 True, A=21 False), A = −3 (A&gt;0 False). Không thể làm bằng 2: A&gt;0 False kết thúc chương trình ngay, nên test thứ hai chỉ với tới được một trong hai kết quả của A = 21.</li>
</ul>`],
      [94, 'Example 3 — three nested decisions',
        `<p>Code: <code>Read A; Read B; IF A &gt; 0 THEN IF B = 0 THEN Print "No values" ELSE Print B; IF A &gt; 21 THEN Print A ENDIF ENDIF ENDIF</code>. Answers on the slide: <strong>V(G) = 4, statement coverage 2, branch coverage 4</strong>.</p>
<ul>
<li>V(G): 3 decisions + 1 = 4. Graph: nodes Read, A&gt;0, B=0, Print "No values", Print B, A&gt;21, Print A, End = 8; edges = 10 → 10 − 8 + 2 = 4.</li>
<li>Statement coverage = <strong>2</strong>: "No values" and "Print B" are THEN/ELSE of the same IF, so two tests are needed — T1 (A = 1, B = 0) prints "No values"; T2 (A = 30, B = 5) prints B and then A (30 &gt; 21), so one test covers both "Print B" and "Print A".</li>
<li>Decision coverage = <strong>4</strong>: T1 and T2 plus T3 (A = −1, any B) for A&gt;0 False and T4 (A = 10, B = 5) for A&gt;21 False. Six outcomes, but every test ends in a different leaf of a nested structure, so 4 = V(G).</li>
</ul>
<p>Small slide glitch: in the flowchart there is an extra "No" label to the right of "Print A"; only the arrow from the <em>A&gt;21</em> diamond straight to End is the "No" outcome.</p>`,
        `<p>Code: <code>Read A; Read B; IF A &gt; 0 THEN IF B = 0 THEN Print "No values" ELSE Print B; IF A &gt; 21 THEN Print A ENDIF ENDIF ENDIF</code>. Đáp án trên slide: <strong>V(G) = 4, statement coverage 2, branch coverage 4</strong>.</p>
<ul>
<li>V(G): 3 quyết định + 1 = 4. Đồ thị: các node Read, A&gt;0, B=0, Print "No values", Print B, A&gt;21, Print A, End = 8; cạnh = 10 → 10 − 8 + 2 = 4.</li>
<li>Statement coverage = <strong>2</strong>: "No values" và "Print B" là THEN/ELSE của cùng một IF nên cần hai test — T1 (A = 1, B = 0) in "No values"; T2 (A = 30, B = 5) in B rồi in A (30 &gt; 21), nên một test phủ cả "Print B" lẫn "Print A".</li>
<li>Decision coverage = <strong>4</strong>: T1, T2 cộng T3 (A = −1, B bất kỳ) cho A&gt;0 False và T4 (A = 10, B = 5) cho A&gt;21 False. Có 6 kết quả, nhưng mỗi test kết thúc ở một lá khác nhau của cấu trúc lồng, nên 4 = V(G).</li>
</ul>
<p>Một lỗi nhỏ trên slide: trong lưu đồ có thêm một nhãn "No" bên phải "Print A"; chỉ mũi tên từ hình thoi <em>A&gt;21</em> đi thẳng tới End mới là kết quả "No".</p>`],
      [95, 'Example 4 — two IF-THEN-ELSE in sequence',
        `<p>Code: <code>IF A &lt; 0 THEN Print "A negative" ELSE Print "A positive" ENDIF; IF B &lt; 0 THEN Print "B negative" ELSE Print "B positive" ENDIF</code>. Answers: <strong>V(G) = 3, statement coverage 2, branch coverage 2</strong>, and the pink note "there are 4 paths".</p>
<ul>
<li>V(G) = 2 + 1 = 3.</li>
<li>Statement coverage = <strong>2</strong>: each IF has a statement on both sides, so at least 2 tests. T1 (A = −1, B = −1) prints both "negative"; T2 (A = 1, B = 1) prints both "positive".</li>
<li>Decision coverage = <strong>2</strong>: T1 takes both True outcomes, T2 both False outcomes → 4/4.</li>
<li>Paths = 2 × 2 = <strong>4</strong> (−/−, −/+, +/−, +/+) — path coverage would need 4 tests. This is the classic proof that V(G) (3) is neither the number of paths (4) nor the minimum for decision coverage (2).</li>
</ul>
<p>Bonus defect for Chapter 4 thinking: A = 0 prints "A positive" — zero is not positive; a BVA test at 0 would reveal it.</p>`,
        `<p>Code: <code>IF A &lt; 0 THEN Print "A negative" ELSE Print "A positive" ENDIF; IF B &lt; 0 THEN Print "B negative" ELSE Print "B positive" ENDIF</code>. Đáp án: <strong>V(G) = 3, statement coverage 2, branch coverage 2</strong>, và ghi chú hồng "có 4 đường".</p>
<ul>
<li>V(G) = 2 + 1 = 3.</li>
<li>Statement coverage = <strong>2</strong>: mỗi IF đều có câu lệnh ở cả hai nhánh nên cần ít nhất 2 test. T1 (A = −1, B = −1) in hai chữ "negative"; T2 (A = 1, B = 1) in hai chữ "positive".</li>
<li>Decision coverage = <strong>2</strong>: T1 đi cả hai kết quả True, T2 cả hai kết quả False → 4/4.</li>
<li>Số đường = 2 × 2 = <strong>4</strong> (−/−, −/+, +/−, +/+) — path coverage sẽ cần 4 test. Đây là ví dụ kinh điển chứng minh V(G) (3) không phải số đường (4) cũng không phải số test tối thiểu cho decision coverage (2).</li>
</ul>
<p>Defect tặng thêm theo tư duy Chương 4: A = 0 in ra "A positive" — số 0 không phải số dương; một test BVA tại 0 sẽ lộ ra.</p>`],
      [96, 'Example 5 — two IF without ELSE in sequence',
        `<p>Code: <code>IF A &lt; 0 THEN Print "A negative" ENDIF; IF B &lt; 0 THEN Print "B negative" ENDIF</code>. Answers: <strong>V(G) = 3, statement coverage 1, branch coverage 2</strong>.</p>
<ul>
<li>V(G) = 2 + 1 = 3.</li>
<li>Statement coverage = <strong>1</strong>: A = −1, B = −1 runs both Print statements (no ELSE, so nothing else to cover).</li>
<li>Decision coverage = <strong>2</strong>: add A = 1, B = 1 for both False outcomes.</li>
</ul>
<p>Compare with Example 4: same V(G), same paths (4), but removing the ELSE parts drops the statement-coverage answer from 2 to 1. The difference between SC and DC exists exactly because of "IF without ELSE".</p>`,
        `<p>Code: <code>IF A &lt; 0 THEN Print "A negative" ENDIF; IF B &lt; 0 THEN Print "B negative" ENDIF</code>. Đáp án: <strong>V(G) = 3, statement coverage 1, branch coverage 2</strong>.</p>
<ul>
<li>V(G) = 2 + 1 = 3.</li>
<li>Statement coverage = <strong>1</strong>: A = −1, B = −1 chạy cả hai lệnh Print (không có ELSE nên không còn gì khác để phủ).</li>
<li>Decision coverage = <strong>2</strong>: thêm A = 1, B = 1 cho hai kết quả False.</li>
</ul>
<p>So với Ví dụ 4: cùng V(G), cùng số đường (4), nhưng bỏ phần ELSE thì đáp án statement coverage giảm từ 2 xuống 1. Chênh lệch giữa SC và DC tồn tại chính vì "IF không có ELSE".</p>`],
      [97, 'Example 6 — IF A < 0 … IF A > 0 (same variable)',
        `<p>Code: <code>Read A; IF A &lt; 0 THEN Print "A negative" ENDIF; IF A &gt; 0 THEN Print "A positive" ENDIF</code>. Answers: <strong>V(G) = 3, statement coverage 2, branch coverage 2</strong>.</p>
<ul>
<li>V(G) = 2 + 1 = 3 (the formula looks only at the graph, not at what is feasible).</li>
<li>Statement coverage = <strong>2</strong>: the two Prints can never run in the same test, because A cannot be both negative and positive. T1: A = −5 → "A negative"; T2: A = 5 → "A positive".</li>
<li>Decision coverage = <strong>2</strong>: T1 gives A&lt;0 True and A&gt;0 False; T2 gives A&lt;0 False and A&gt;0 True → 4/4 outcomes.</li>
</ul>
<p>The trick: the graph has 4 paths, but the path "True, True" is <strong>infeasible</strong>. The 3 feasible paths are A &lt; 0, A &gt; 0 and A = 0 (prints nothing) — a nice match with V(G) = 3 — and A = 0 is exactly the value a boundary-value tester would add.</p>`,
        `<p>Code: <code>Read A; IF A &lt; 0 THEN Print "A negative" ENDIF; IF A &gt; 0 THEN Print "A positive" ENDIF</code>. Đáp án: <strong>V(G) = 3, statement coverage 2, branch coverage 2</strong>.</p>
<ul>
<li>V(G) = 2 + 1 = 3 (công thức chỉ nhìn đồ thị, không xét đường nào khả thi).</li>
<li>Statement coverage = <strong>2</strong>: hai lệnh Print không bao giờ chạy trong cùng một test, vì A không thể vừa âm vừa dương. T1: A = −5 → "A negative"; T2: A = 5 → "A positive".</li>
<li>Decision coverage = <strong>2</strong>: T1 cho A&lt;0 True và A&gt;0 False; T2 cho A&lt;0 False và A&gt;0 True → đủ 4/4 kết quả.</li>
</ul>
<p>Mẹo ở đây: đồ thị có 4 đường, nhưng đường "True, True" là <strong>không khả thi</strong>. Ba đường khả thi là A &lt; 0, A &gt; 0 và A = 0 (không in gì) — khớp đẹp với V(G) = 3 — và A = 0 chính là giá trị mà người làm phân tích giá trị biên sẽ thêm vào.</p>`],
      [98, 'Question — printSum: tests for 100% statement coverage',
        AE('B — 2', 'Statements: <code>int result = a + b;</code>, the <code>if</code>, <code>println("red"…)</code>, the <code>else if</code>, <code>println("blue"…)</code>. The two <code>println</code> calls are on mutually exclusive branches, so one test cannot reach both: T1 a = 1, b = 1 (result 2 &gt; 0 → "red2"); T2 a = −1, b = −1 (result −2 &lt; 0 → "blue-2"). 1 is too few; 3 and 4 are more than the <em>minimum</em>. Note the trap for the next level: <strong>decision coverage needs 3</strong>, because result = 0 (e.g. a = 0, b = 0) is the only way to take the False side of <code>else if (result &lt; 0)</code>. We checked it with JaCoCo on a copy of the method (the print replaced by a returned String so it can be asserted): 2 tests → <code>lines 7/7 branches 3/4 (75%), missed: L15(1 branch missed)</code>; 3 tests → <code>lines 7/7 branches 4/4 (100%)</code>. Option order on the slide is 1, 2, 4, 3 — the answer is the second option.'),
        AV('B — 2', 'Các câu lệnh: <code>int result = a + b;</code>, lệnh <code>if</code>, <code>println("red"…)</code>, lệnh <code>else if</code>, <code>println("blue"…)</code>. Hai lệnh <code>println</code> nằm trên hai nhánh loại trừ nhau nên một test không thể chạm cả hai: T1 a = 1, b = 1 (result 2 &gt; 0 → "red2"); T2 a = −1, b = −1 (result −2 &lt; 0 → "blue-2"). 1 là thiếu; 3 và 4 là nhiều hơn mức <em>tối thiểu</em>. Để ý bẫy ở mức tiếp theo: <strong>decision coverage cần 3</strong>, vì result = 0 (vd a = 0, b = 0) là cách duy nhất đi nhánh False của <code>else if (result &lt; 0)</code>. Chúng tôi đã kiểm bằng JaCoCo trên bản sao của hàm (thay lệnh in bằng trả về String để assert được): 2 test → <code>lines 7/7 branches 3/4 (75%), missed: L15(1 branch missed)</code>; 3 test → <code>lines 7/7 branches 4/4 (100%)</code>. Thứ tự phương án trên slide là 1, 2, 4, 3 — đáp án là phương án thứ hai.')],
      [99, 'Question — one simple IF: tests for 100% decision coverage',
        AE('B — 2', 'A simple IF is one decision with two outcomes, True and False; one test can take only one of them, so 2 tests are needed and enough. A (1) is the statement-coverage answer for an IF without ELSE; C (3) confuses the question with a nested/cascaded structure; D "unknown" is tempting but the question says the code has <em>one</em> simple IF, so nothing else can add decision outcomes.'),
        AV('B — 2', 'Một IF đơn giản là một quyết định có hai kết quả True và False; một test chỉ đi được một kết quả, nên cần và đủ 2 test. A (1) là đáp án statement coverage cho IF không có ELSE; C (3) nhầm với cấu trúc lồng/bậc thang; D "không xác định" dễ bị dụ, nhưng đề nói code chỉ có <em>một</em> IF đơn giản, nên không còn gì khác sinh thêm kết quả quyết định.')],
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
<tr><td>N2</td><td>9</td><td><b>D1</b> another character?</td><td>True → N3 · False → N10</td></tr>
<tr><td>N3</td><td>10</td><td><b>D2</b> isUpperCase(c)?</td><td>True → N4 · False → N5</td></tr>
<tr><td>N4</td><td>11</td><td>upperCaseCount++</td><td>→ N2</td></tr>
<tr><td>N5</td><td>12</td><td><b>D3</b> isLowerCase(c)?</td><td>True → N6 · False → N7</td></tr>
<tr><td>N6</td><td>13</td><td>lowerCaseCount++</td><td>→ N2</td></tr>
<tr><td>N7</td><td>14</td><td><b>D4</b> isDigit(c)?</td><td>True → N8 · False → N9</td></tr>
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
<tr><td>N2</td><td>9</td><td><b>D1</b> còn ký tự không?</td><td>True → N3 · False → N10</td></tr>
<tr><td>N3</td><td>10</td><td><b>D2</b> isUpperCase(c)?</td><td>True → N4 · False → N5</td></tr>
<tr><td>N4</td><td>11</td><td>upperCaseCount++</td><td>→ N2</td></tr>
<tr><td>N5</td><td>12</td><td><b>D3</b> isLowerCase(c)?</td><td>True → N6 · False → N7</td></tr>
<tr><td>N6</td><td>13</td><td>lowerCaseCount++</td><td>→ N2</td></tr>
<tr><td>N7</td><td>14</td><td><b>D4</b> isDigit(c)?</td><td>True → N8 · False → N9</td></tr>
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
<p><strong>CFG in words:</strong> D1 True → return −1; False → D2. D2 True → return 10%; False → D3. D3 True → return 5%; False → return 0. All four returns go to the exit. N = 8 (D1, D2, D3, four returns, exit), E = 10 (six decision edges + four return→exit) → V(G) = 10 − 8 + 2 = <strong>4</strong> = 3 decisions + 1.</p>
<p><strong>Minimum tests.</strong> The four <code>return</code> statements are mutually exclusive (each call leaves through exactly one) → <strong>4 tests for 100% statement coverage</strong>, and the same 4 give every True/False of D1–D3 → <strong>4 tests for 100% decision coverage</strong> (a cascade: min SC = min DC = V(G)).</p>
<div class="table-wrap"><table>
<thead><tr><th>ID</th><th>bookingAmount</th><th>customerType</th><th>Expected</th><th>Outcomes covered</th></tr></thead>
<tbody>
<tr><td>UTCID01 (A)</td><td>−1</td><td>"VIP"</td><td>−1</td><td>D1 T</td></tr>
<tr><td>UTCID02 (N)</td><td>1000</td><td>"VIP"</td><td>100</td><td>D1 F, D2 T</td></tr>
<tr><td>UTCID03 (N)</td><td>1000</td><td>"Regular"</td><td>50</td><td>D2 F, D3 T</td></tr>
<tr><td>UTCID04 (N)</td><td>1000</td><td>"Guest"</td><td>0</td><td>D3 F</td></tr>
</tbody>
</table></div>
<p>SP25 also asks for 100% equivalence-partition and boundary-value coverage, so we added five more cases (EP: amount &lt; 0 / ≥ 0; type VIP / Regular / other · BVA: −0.01 and 0 · error guessing: truncation, lower-case "vip", null). Real JUnit output (JUnit 5.12.2, JDK 21):</p>
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
<p><strong>CFG bằng lời:</strong> D1 True → return −1; False → D2. D2 True → return 10%; False → D3. D3 True → return 5%; False → return 0. Cả bốn return đều đi tới điểm thoát. N = 8 (D1, D2, D3, bốn return, điểm thoát), E = 10 (sáu cạnh quyết định + bốn cạnh return→thoát) → V(G) = 10 − 8 + 2 = <strong>4</strong> = 3 quyết định + 1.</p>
<p><strong>Số test tối thiểu.</strong> Bốn lệnh <code>return</code> loại trừ nhau (mỗi lần gọi thoát ra đúng một cửa) → <strong>4 test cho 100% statement coverage</strong>, và chính 4 test đó cho mọi True/False của D1–D3 → <strong>4 test cho 100% decision coverage</strong> (dạng bậc thang: min SC = min DC = V(G)).</p>
<div class="table-wrap"><table>
<thead><tr><th>ID</th><th>bookingAmount</th><th>customerType</th><th>Mong đợi</th><th>Kết quả quyết định phủ được</th></tr></thead>
<tbody>
<tr><td>UTCID01 (A)</td><td>−1</td><td>"VIP"</td><td>−1</td><td>D1 T</td></tr>
<tr><td>UTCID02 (N)</td><td>1000</td><td>"VIP"</td><td>100</td><td>D1 F, D2 T</td></tr>
<tr><td>UTCID03 (N)</td><td>1000</td><td>"Regular"</td><td>50</td><td>D2 F, D3 T</td></tr>
<tr><td>UTCID04 (N)</td><td>1000</td><td>"Guest"</td><td>0</td><td>D3 F</td></tr>
</tbody>
</table></div>
<p>Đề SP25 còn yêu cầu 100% phủ phân vùng tương đương và giá trị biên, nên chúng tôi thêm năm ca (EP: amount &lt; 0 / ≥ 0; loại khách VIP / Regular / khác · BVA: −0.01 và 0 · error guessing: cắt phần thập phân, "vip" chữ thường, null). Output JUnit thật (JUnit 5.12.2, JDK 21):</p>
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
<p>The paper gives a flowchart, not code: <code>float fncPersonalIncomeTax(float sal, float te, int nod)</code> (salary, tax-exempt amount, number of dependents). Decisions in order: <code>sal &lt; 0</code>, <code>te &lt; 0</code>, <code>nod &lt; 0</code> (each Yes → one shared box <em>Return −1</em>); then <code>ti := sal − te − 9,000,000 − nod × 4,000,000</code>; <code>ti &gt; 0</code> (No → Return 0); <code>ti &gt; 5,000,000</code> (No → 5% × ti); <code>&gt; 10,000,000</code> (No → 10% × ti − 250,000); <code>&gt; 20,000,000</code> (No → 15% × ti − 750,000); <code>&gt; 40,000,000</code> (No → 20% × ti − 2,250,000); <code>&gt; 80,000,000</code> (No → 25% × ti − 6,250,000, Yes → 30% × ti − 16,250,000).</p>
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
<p>The raw results of the 10 cases were <code>-1.0 -1.0 -1.0 0.0 150000.0 550000.0 1500000.0 3750000.0 8750000.0 1.3750002E7</code> — the last one is 13,750,00<b>2</b>, not 13,750,000: a <code>float</code> has only about 7 significant digits. The test uses <code>assertEquals(13_750_000f, actual, 4f)</code> (a tolerance), and in a real review you would report "money stored in <code>float</code>" as a defect.</p>`,
    `<h3>Ví dụ có lời giải C · PE SU24 (PE1) câu 2 — lưu đồ thuế thu nhập cá nhân</h3>
<p>Đề cho lưu đồ chứ không cho code: <code>float fncPersonalIncomeTax(float sal, float te, int nod)</code> (lương, khoản miễn thuế, số người phụ thuộc). Các quyết định theo thứ tự: <code>sal &lt; 0</code>, <code>te &lt; 0</code>, <code>nod &lt; 0</code> (mỗi Yes → cùng một hộp <em>Return −1</em>); rồi <code>ti := sal − te − 9.000.000 − nod × 4.000.000</code>; <code>ti &gt; 0</code> (No → Return 0); <code>ti &gt; 5.000.000</code> (No → 5% × ti); <code>&gt; 10.000.000</code> (No → 10% × ti − 250.000); <code>&gt; 20.000.000</code> (No → 15% × ti − 750.000); <code>&gt; 40.000.000</code> (No → 20% × ti − 2.250.000); <code>&gt; 80.000.000</code> (No → 25% × ti − 6.250.000, Yes → 30% × ti − 16.250.000).</p>
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
<p>Kết quả thô của 10 ca là <code>-1.0 -1.0 -1.0 0.0 150000.0 550000.0 1500000.0 3750000.0 8750000.0 1.3750002E7</code> — ca cuối là 13.750.00<b>2</b> chứ không phải 13.750.000: kiểu <code>float</code> chỉ có khoảng 7 chữ số có nghĩa. Test dùng <code>assertEquals(13_750_000f, actual, 4f)</code> (có sai số cho phép), và khi review thật bạn nên báo "lưu tiền bằng <code>float</code>" là một defect.</p>`),
    bi(`<div class="pitfall"><b>The three mistakes that cost the most PE points.</b> (1) <em>"V(G) = the number of test cases for decision coverage."</em> No — V(G) is the number of basis paths and an <em>upper bound</em>: Examples 4–6 need 2 tests with V(G) = 3, countCharacters needs 1 with V(G) = 5; only fully nested/cascaded code (Examples 1–3, SP25, SU24) makes them equal. (2) Writing the expected result by running the code: the test then passes by definition and finds nothing — take it from the spec (or the flowchart). (3) Padding the "minimum" answer with extra cases without saying so. If you add boundary/abnormal cases, label them as extra (as UTCID02–03 above) and state the minimum clearly.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Basis-path testing, McCabe's thresholds and what tools really count.</b> McCabe's <em>basis-path testing</em> picks V(G) linearly independent paths — every other path is a combination of them — and tests each one; it guarantees decision coverage (if the paths are feasible) and is what "list the independent paths" questions mean. As a quality signal, V(G) 1–10 is usually considered simple, 11–20 moderate, 21–50 complex, above 50 untestable (SonarQube flags methods above a configurable threshold). Compound conditions: McCabe's predicate rule counts every <code>&amp;&amp;</code>/<code>||</code> as an extra decision, and JaCoCo counts <em>bytecode</em> branches — <code>if (a || b)</code> shows 4 branches — so a tool's "branch coverage" can be stricter than the syllabus's decision coverage. <em>Outside the syllabus because CTFL 2018 only asks for statement and decision coverage; V(G) is a Chapter 3 static metric and basis-path testing is not an ISTQB Foundation technique.</em></div>`,
    `<div class="pitfall"><b>Ba lỗi làm mất nhiều điểm PE nhất.</b> (1) <em>"V(G) = số test case cho decision coverage."</em> Không — V(G) là số basis path và là <em>cận trên</em>: Ví dụ 4–6 cần 2 test trong khi V(G) = 3, countCharacters cần 1 test trong khi V(G) = 5; chỉ code lồng/bậc thang hoàn toàn (Ví dụ 1–3, SP25, SU24) mới làm hai số bằng nhau. (2) Viết kết quả mong đợi bằng cách chạy code: khi đó test mặc nhiên pass và không tìm ra gì — hãy lấy từ đặc tả (hoặc từ lưu đồ). (3) Độn thêm ca vào đáp án "tối thiểu" mà không nói rõ. Nếu thêm ca biên/bất thường, hãy ghi rõ là ca thêm (như UTCID02–03 ở trên) và nêu rõ con số tối thiểu.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Basis-path testing, ngưỡng McCabe và thứ công cụ thật sự đếm.</b> <em>Basis-path testing</em> của McCabe chọn V(G) đường độc lập tuyến tính — mọi đường khác đều là tổ hợp của chúng — và test từng đường; nó bảo đảm decision coverage (nếu các đường khả thi) và chính là ý của các câu hỏi "liệt kê các đường độc lập". Như một tín hiệu chất lượng, V(G) 1–10 thường coi là đơn giản, 11–20 trung bình, 21–50 phức tạp, trên 50 là không test nổi (SonarQube cảnh báo phương thức vượt một ngưỡng cấu hình được). Điều kiện ghép: quy tắc predicate của McCabe tính mỗi <code>&amp;&amp;</code>/<code>||</code> là thêm một quyết định, còn JaCoCo đếm nhánh <em>bytecode</em> — <code>if (a || b)</code> hiện 4 nhánh — nên "branch coverage" của công cụ có thể khắt khe hơn decision coverage của syllabus. <em>Ngoài giáo trình vì CTFL 2018 chỉ hỏi statement và decision coverage; V(G) là chỉ số tĩnh của Chương 3 và basis-path testing không phải kỹ thuật của ISTQB Foundation.</em></div>`),
    books([
      ['fst4', 'Ch.4 §3 "White-box test techniques", incl. Figure 4.4 control-flow diagram p.139 — book pp.132–139 (PDF pp.146–153); sample questions pp.144–147, exercises p.148, solutions pp.149–153', 'Chương 4 §3 "White-box test techniques", gồm Hình 4.4 sơ đồ luồng điều khiển trang 139 — trang sách 132–139 (PDF 146–153); câu hỏi mẫu trang 144–147, bài tập trang 148, lời giải trang 149–153'],
      ['fst', '§4.4 "Structure-based or white-box techniques" pp.105–112 (PDF pp.108–115); cyclomatic complexity in §3.3 "Static analysis by tools" pp.69–73', '§4.4 "Structure-based or white-box techniques" trang 105–112 (PDF 108–115); cyclomatic complexity ở §3.3 "Static analysis by tools" trang 69–73'],
      ['sp5', '§5.2.1 Statement testing PDF p.215 and §5.2.2 Decision testing PDF p.218', '§5.2.1 Statement testing PDF 215 và §5.2.2 Decision testing PDF 218'],
      ['sp4', '§4.2.4 control-flow analysis p.99 and §4.2.5 metrics / cyclomatic number p.100; §5.2.1–5.2.2 statement & decision coverage pp.146–150 (PDF pp.161–165)', '§4.2.4 phân tích luồng điều khiển trang 99 và §4.2.5 metric / cyclomatic number trang 100; §5.2.1–5.2.2 statement & decision coverage trang 146–150 (PDF 161–165)'],
      ['junit', 'Ch.6 "Test quality" (code coverage) PDF pp.103–126; Ch.2 "Exploring core JUnit" for assertEquals/assertThrows/@DisplayName PDF pp.18–48', 'Chương 6 "Test quality" (code coverage) PDF 103–126; Chương 2 "Exploring core JUnit" cho assertEquals/assertThrows/@DisplayName PDF 18–48'],
    ]),
  ].join('\n'),
};

/* ─────────────────────────────────── Quiz 5 ─────────────────────────────────── */
const QUIZ5 = {
  title: 'Quiz 5 — White-box techniques & cyclomatic complexity|||Quiz 5 — Kỹ thuật white-box & độ phức tạp chu trình',
  slug: 'swt301-quiz-5',
  type: 'QUIZ',
  description: '14 câu: 2 câu "Question" trên slide SWT4 (s.98, s.99), 6 câu từ các ví dụ lưu đồ 1–6 và 6 câu về coverage, V(G) và các bài PE (countCharacters, thuế TNCN, tích điểm).',
  quiz: {
    timeLimitSeconds: 840,
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
    ],
  },
};

export default {
  title: 'Chapter 5 — Test design: white-box techniques|||Chương 5 — Thiết kế test: kỹ thuật white-box',
  description: 'SWT4 slide 82–99 học từng slide: coverage, statement & decision coverage, đường đi và vòng lặp, 6 ví dụ lưu đồ có lời giải, cyclomatic complexity (tham chiếu SWT3) — và giải trọn câu 2 của đề PE bằng JUnit 5 chạy thật.',
  lessons: [L51, L52, QUIZ5],
};
