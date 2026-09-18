/**
 * PRF192 · Slot 08-09 (deck 'prf4', 71 slide) — phần slide 1→25, học theo từng slide.
 * Chương 5a: Module, thiết kế cấu trúc, cohesion & coupling.
 *
 * Nội dung bám ĐÚNG chữ trích từ .pptx gốc của trường (/tmp/prf192-text/prf4.txt).
 * MỌI đoạn C trong phần giảng đã được biên dịch thật (cc -Wall -std=c99) và chạy:
 *   tongUoc(12)=28 · tongUoc(18)=39 · tongUoc(28)=56 · tongUoc(6)=12 · tongUoc(7)=8 · tongUoc(1)=1
 *   ước của 12 in ra: 1, 2, 3, 4, 6, 12,
 *   tinhDienTich(2.0)=12.566371 · tinhDienTich(1.5)=7.068583
 *   chuỗi tuần tự chiaDoi(binhPhuong(docSo())) với docSo()=12 → 72
 *   thongKe(12) → sum=28 count=6
 *   bản dùng biến toàn cục: n=12 → 28, đổi n=18 → 39 (phải SỬA biến chung mới tái dùng được)
 *   bản truyền tham số: tongUoc(12)+tongUoc(18) = 67 trong MỘT biểu thức
 *   content coupling: dem_tang ×2 → 2, rồi B_xau ghi thẳng field → 99
 *   một lối ra / nhiều lối ra cho cùng kết quả: -1→-1 · 2→1 · 5→2 · 8→3 · 11→-1
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'prf4';

export default {
  title: '5.0a — Slide by slide: Modules, structure design, cohesion & coupling (slides 1–25)|||5.0a — Slide bài giảng: Module, thiết kế cấu trúc, cohesion & coupling (slide 1–25)',
  slug: 'prf192-5-0a-slides-module-cohesion-coupling',
  type: 'DOCUMENT',
  description: 'Phần đầu bộ slide Slot 08-09 của PRF192 (slide 1–25): module là gì, thiết kế cấu trúc một chương trình thành các module, đặc trưng và nguyên tắc thiết kế module, rồi hai thước đo cốt lõi — cohesion (độ kết dính) với ba mức thấp và ba mức cao, coupling (độ ghép nối) với năm loại dữ liệu. Khép lại bằng ví dụ High Cohesion & Low Coupling đầy đủ và quy trình bốn bước để tự tìm ra module. Mỗi mức cohesion/coupling đều kèm một đoạn C ngắn đã biên dịch và chạy thật.',
  content: [
    walkHead(D, 1, 25),
    walk(D, [

      [1, 'Modules and Functions (title slide)',
        `<p class="y-chinh">🎯 The title slide of Slot 08-09. From here the course stops writing programs as one long <code>main()</code> and starts cutting them into named, reusable pieces.</p>
<ul>
<li><strong>What changes at this slot</strong> — Slots 02–07 gave you everything needed to write a correct program in a single block: types, operators, <code>if</code>, <code>switch</code>, <code>for</code>, <code>while</code>. Nothing you learned is wrong. What is missing is a way to keep a 300-line program <em>readable</em>.</li>
<li><strong>Two words in the title, two layers</strong> — <em>Module</em> is the design idea (a unit of a solution, language-independent). <em>Function</em> is how C spells that idea. Slides 1–25 are almost entirely about the design idea; slide 26 onwards is the C syntax.</li>
<li><strong>Why design comes first</strong> — if you learn the <code>returnType name(params)</code> syntax without the design idea, you get programs that compile and are still unmaintainable: one function doing six jobs, ten functions all writing to the same global. The two words the deck uses for those two diseases are <em>cohesion</em> and <em>coupling</em>.</li>
<li><strong>The two rules the whole deck is aiming at</strong> — slide 14 states them: each module is <strong>highly cohesive</strong> and each module exhibits <strong>low coupling</strong>. Everything between slide 13 and slide 25 is an unpacking of those two lines.</li>
<li><strong>Be honest about the exam</strong> — theory slides like 16–20 look skippable. They are the ones that produce multiple-choice questions ("which degree of cohesion is this?"), because they are the only part of the slot that cannot be answered by running a compiler.</li>
</ul>
<p class="meo">💡 Keep one running example in your head for the whole of slides 1–25: "accept a positive integer n, then print out the sum of its divisors". The deck uses it on slide 9, again on slides 21–24, and again in the exercises. Everything abstract becomes concrete when you map it onto that one problem.</p>`,
        `<p class="y-chinh">🎯 Slide tiêu đề của Slot 08-09. Từ đây môn học thôi viết chương trình thành một <code>main()</code> dài ngoằng, và bắt đầu cắt nó thành những mảnh có tên, dùng lại được.</p>
<ul>
<li><strong>Điều gì đổi ở slot này</strong> — Slot 02–07 đã cho bạn đủ thứ để viết một chương trình ĐÚNG trong một khối duy nhất: kiểu, toán tử, <code>if</code>, <code>switch</code>, <code>for</code>, <code>while</code>. Không có gì bạn học là sai. Thứ còn thiếu là cách giữ cho một chương trình 300 dòng còn <em>đọc được</em>.</li>
<li><strong>Hai chữ trong tiêu đề, hai tầng</strong> — <em>Module</em> là ý tưởng thiết kế (một đơn vị của lời giải, không phụ thuộc ngôn ngữ). <em>Function</em> là cách C viết ra ý tưởng đó. Slide 1–25 gần như hoàn toàn nói về ý tưởng thiết kế; từ slide 26 trở đi mới là cú pháp C.</li>
<li><strong>Vì sao thiết kế phải đi trước</strong> — nếu học cú pháp <code>kiểuTrảVề tên(thamSố)</code> mà không có ý tưởng thiết kế, bạn sẽ có những chương trình dịch được nhưng vẫn không bảo trì nổi: một hàm làm sáu việc, mười hàm cùng ghi vào một biến toàn cục. Hai từ mà bộ slide dùng để gọi hai căn bệnh đó là <em>cohesion</em> và <em>coupling</em>.</li>
<li><strong>Hai luật mà cả bộ slide nhắm tới</strong> — slide 14 phát biểu thẳng: mỗi module phải <strong>kết dính cao (highly cohesive)</strong> và <strong>ghép nối thấp (low coupling)</strong>. Toàn bộ từ slide 13 tới slide 25 là phần mở gói của hai dòng đó.</li>
<li><strong>Nói thật về đề thi</strong> — mấy slide lý thuyết 16–20 trông có vẻ bỏ qua được. Chính chúng lại đẻ ra câu trắc nghiệm ("đoạn này thuộc mức cohesion nào?"), vì đó là phần duy nhất của slot mà trình biên dịch không trả lời hộ bạn được.</li>
</ul>
<p class="meo">💡 Giữ một ví dụ chạy suốt trong đầu cho cả slide 1–25: "nhận số nguyên dương n rồi in tổng các ước của nó". Bộ slide dùng nó ở slide 9, dùng lại ở slide 21–24, rồi lại dùng trong bài tập. Mọi thứ trừu tượng sẽ thành cụ thể khi bạn chiếu nó lên đúng bài toán đó.</p>`],

      [2, 'Review — logic constructs, walkthrough, debugging',
        `<p class="y-chinh">🎯 A three-line recap of Slots 05–07, put here because modules are built <em>out of</em> these constructs, not instead of them.</p>
<ul>
<li><strong>"Logic constructs = Statements can be used in a program"</strong> — the slide's own wording. Everything a C program does is assembled from a fixed, tiny alphabet of statement shapes.</li>
<li><strong>The three basic constructs</strong> — <em>Sequence</em> (one statement after another), <em>selection</em> (<code>if</code>, <code>if…else</code>, <code>?:</code>, and <code>switch</code>), and <em>iteration</em> (<code>for</code>, <code>while</code>, <code>do…while</code>). Structured-programming theory says those three suffice for any computable algorithm — no <code>goto</code> needed.</li>
<li><strong>Why that matters right now</strong> — a module is not a fourth construct. It is a <em>name</em> put on a block built from the three. That is why you can learn functions quickly: nothing new happens inside them.</li>
<li><strong>"Walkthrough — code are executed by ourself"</strong> — hand-tracing. The slide defines the task precisely: keep "a record of the changes that occur in the values of program variables" and a "listing of the output, if any, produced by the program".</li>
<li><strong>Walkthrough survives into this slot</strong> — slide 66 is a walkthrough <em>with functions</em>, where you must also track which variable belongs to which function. The technique does not change; the table just gains a column per call.</li>
<li><strong>"Debug program"</strong> — the third line. Modules are the single biggest debugging aid you will meet in this course: a bug in a 15-line function is found by reading 15 lines.</li>
</ul>
<pre><code>/* the three constructs, one line each */
s = s + i;                      /* sequence  */
if (n % i == 0) s = s + i;      /* selection */
for (i = 1; i &lt;= n; i++) ...    /* iteration */</code></pre>
<p class="meo">💡 A useful self-test before going on: can you write, without looking, a loop that prints every divisor of <code>n</code>? If yes, you are ready — slides 7–25 will do nothing but move that loop into a box and give the box a name.</p>`,
        `<p class="y-chinh">🎯 Ba dòng ôn lại Slot 05–07, đặt ở đây vì module được dựng <em>từ</em> các cấu trúc này, chứ không thay thế chúng.</p>
<ul>
<li><strong>"Logic constructs = Statements can be used in a program"</strong> — nguyên văn slide. Mọi việc một chương trình C làm đều lắp từ một bảng chữ cái nhỏ và cố định các dạng câu lệnh.</li>
<li><strong>Ba cấu trúc cơ bản</strong> — <em>Tuần tự</em> (lệnh này rồi lệnh kia), <em>rẽ nhánh</em> (<code>if</code>, <code>if…else</code>, <code>?:</code>, và <code>switch</code>), <em>lặp</em> (<code>for</code>, <code>while</code>, <code>do…while</code>). Lý thuyết lập trình có cấu trúc chứng minh ba cái đó là đủ cho mọi thuật toán tính được — không cần <code>goto</code>.</li>
<li><strong>Vì sao điều đó quan trọng ngay lúc này</strong> — module KHÔNG phải cấu trúc thứ tư. Nó là một cái <em>tên</em> dán lên một khối dựng từ ba cấu trúc kia. Chính vì thế bạn học hàm rất nhanh: bên trong hàm chẳng có gì mới.</li>
<li><strong>"Walkthrough — code are executed by ourself"</strong> — chạy tay. Slide định nghĩa nhiệm vụ rất chính xác: ghi lại "a record of the changes that occur in the values of program variables" và "listing of the output, if any".</li>
<li><strong>Chạy tay còn sống tiếp trong slot này</strong> — slide 66 là một bài chạy tay <em>có hàm</em>, ở đó bạn phải theo dõi thêm biến nào thuộc hàm nào. Kỹ thuật không đổi; bảng chỉ thêm một cột cho mỗi lời gọi.</li>
<li><strong>"Debug program"</strong> — dòng thứ ba. Module là công cụ gỡ lỗi mạnh nhất bạn gặp trong môn này: một lỗi nằm trong hàm 15 dòng thì đọc 15 dòng là ra.</li>
</ul>
<pre><code>/* ba cấu trúc, mỗi cái một dòng */
s = s + i;                      /* tuần tự   */
if (n % i == 0) s = s + i;      /* rẽ nhánh  */
for (i = 1; i &lt;= n; i++) ...    /* lặp       */</code></pre>
<p class="meo">💡 Một phép tự kiểm trước khi đi tiếp: bạn có viết được, không nhìn tài liệu, một vòng lặp in mọi ước của <code>n</code> không? Nếu được thì bạn đã sẵn sàng — slide 7–25 chẳng làm gì khác ngoài chuyển đúng vòng lặp đó vào một cái hộp rồi đặt tên cho hộp.</p>`],

      [3, 'Objective — why modules and functions exist (7 reasons)',
        `<p class="y-chinh">🎯 Seven named benefits of modular code. Read them as seven <em>different</em> problems that one idea solves — that is why the idea is worth a whole slot.</p>
<ul>
<li><strong>Code Organization</strong> — "Programs are structured, making them easier to read and maintain." A 400-line <code>main()</code> has no landmarks; twelve named functions give you a table of contents.</li>
<li><strong>Reusability</strong> — "Functions allow reuse of code, reducing duplication." If the divisor loop is written once, a bug in it is fixed once. If it is copy-pasted three times, you will fix two of the three and ship the bug.</li>
<li><strong>Debugging and Testing</strong> — "Isolated functions simplify locating and fixing bugs." You can call <code>tongUoc(12)</code> on its own and check it prints 28, without running the rest of the program.</li>
<li><strong>Maintainability</strong> — "Modular code supports easy updates and changes." Changing how input is read touches exactly one function, if input lives in exactly one function (slide 22's Module 1).</li>
<li><strong>Abstraction</strong> — "Functions hide implementation details, focusing on functionality." You call <code>printf</code> every day without knowing how it formats. That is abstraction, and your own functions earn the same privilege.</li>
<li><strong>Scalability &amp; Collaboration</strong> — "Modular design enables handling larger and more complex systems" and "Teams can work on separate modules independently". The second one is only possible <em>because</em> of low coupling: two people can edit two files only if the files do not share hidden state.</li>
</ul>
<pre><code>/* Reusability, made concrete: one definition, three uses */
printf("%d %d %d\\n", tongUoc(12), tongUoc(18), tongUoc(28));</code></pre>
<p class="dap-an">✅ Compiled and run, that line prints <strong>28 39 56</strong>. Check by hand: 12 → 1+2+3+4+6+12 = 28 · 18 → 1+2+3+6+9+18 = 39 · 28 → 1+2+4+7+14+28 = 56.</p>
<p class="meo">💡 Notice that reasons 6 and 7 (scalability, collaboration) are not about your code at all — they are about <em>people</em>. That is the real reason this design vocabulary exists: it lets two programmers agree on a boundary without reading each other's code.</p>`,
        `<p class="y-chinh">🎯 Bảy lợi ích có tên của code chia module. Hãy đọc chúng như bảy <em>vấn đề khác nhau</em> mà một ý tưởng giải được — đó là lý do ý tưởng này đáng cả một slot.</p>
<ul>
<li><strong>Code Organization (tổ chức mã)</strong> — "Programs are structured, making them easier to read and maintain." Một <code>main()</code> 400 dòng không có cột mốc nào; mười hai hàm có tên cho bạn một mục lục.</li>
<li><strong>Reusability (tái sử dụng)</strong> — "Functions allow reuse of code, reducing duplication." Vòng lặp tìm ước viết một lần thì lỗi trong nó sửa một lần. Chép dán ba chỗ thì bạn sẽ sửa hai trong ba và mang lỗi lên sản phẩm.</li>
<li><strong>Debugging and Testing</strong> — "Isolated functions simplify locating and fixing bugs." Bạn gọi riêng <code>tongUoc(12)</code> và kiểm xem có ra 28 không, mà không cần chạy phần còn lại của chương trình.</li>
<li><strong>Maintainability (bảo trì)</strong> — "Modular code supports easy updates and changes." Đổi cách nhập dữ liệu chỉ đụng đúng một hàm, NẾU việc nhập nằm đúng trong một hàm (Module 1 ở slide 22).</li>
<li><strong>Abstraction (trừu tượng hoá)</strong> — "Functions hide implementation details, focusing on functionality." Bạn gọi <code>printf</code> mỗi ngày mà không biết nó định dạng thế nào. Đó là trừu tượng hoá, và hàm của chính bạn cũng được hưởng đặc quyền đó.</li>
<li><strong>Scalability &amp; Collaboration</strong> — "Modular design enables handling larger and more complex systems" và "Teams can work on separate modules independently". Cái thứ hai chỉ có được <em>nhờ</em> ghép nối thấp: hai người sửa hai file được chỉ khi hai file không chia nhau trạng thái ngầm.</li>
</ul>
<pre><code>/* Tái sử dụng, cho cụ thể: một định nghĩa, ba lời gọi */
printf("%d %d %d\\n", tongUoc(12), tongUoc(18), tongUoc(28));</code></pre>
<p class="dap-an">✅ Đã biên dịch và chạy thật, dòng đó in ra <strong>28 39 56</strong>. Kiểm tay: 12 → 1+2+3+4+6+12 = 28 · 18 → 1+2+3+6+9+18 = 39 · 28 → 1+2+4+7+14+28 = 56.</p>
<p class="meo">💡 Để ý lý do 6 và 7 (mở rộng, cộng tác) hoàn toàn không nói về code — chúng nói về <em>con người</em>. Đó mới là lý do thật sự khiến bộ từ vựng thiết kế này tồn tại: nó cho hai lập trình viên thống nhất một đường ranh mà không phải đọc code của nhau.</p>`],

      [4, 'Objective — the nine skills you must be able to do',
        `<p class="y-chinh">🎯 The assessable objectives, in the school's own words. Nine items, and they split cleanly into "design" (items 1, 2, 7) and "C mechanics" (the rest).</p>
<ul>
<li><strong>"Define a C-module or C-function?"</strong> and <strong>"Explain module's characteristics"</strong> — slides 6–11. This is the definition-and-table part; it is pure recall and it is free marks.</li>
<li><strong>"Implement C functions" / "Use functions?"</strong> — slides 26–48. Writing the header, the body, the <code>return</code>; then calling it with arguments.</li>
<li><strong>"Differentiate built-in and user-defined functions"</strong> — slide 39. <code>printf</code>, <code>scanf</code>, <code>sqrt</code> come from a header you <code>#include</code>; <code>tongUoc</code> comes from you.</li>
<li><strong>"Explain mechanism when a function is called"</strong> — slides 49–52, the stack/heap memory map and pass-by-value. This is the single hardest idea of the slot and the one most often examined.</li>
<li><strong>"Analyze a problem into functions"</strong> — slides 54–58. The noun/verb technique: nouns become variables, verbs become functions.</li>
<li><strong>"Understand extent and scope of a variable"</strong> — slides 60–64. Where a variable is visible and how long it lives. It closes the loop with coupling: global variables are exactly the ones with program-wide scope, which is why the deck tells you to avoid them.</li>
<li><strong>Where slides 1–25 sit</strong> — this lesson covers objectives 1, 2 and the design half of 7. The remaining objectives are the next lessons of this slot.</li>
</ul>
<p class="meo">💡 Every verb in this list is an action ("define", "explain", "implement", "analyze"). None of them is "know about". Study by <em>doing</em> the matching exercise, not by re-reading the slide.</p>
<p class="pitfall">⚠️ The objective "Analyze a problem into functions" is the one students skip, because it has no syntax to memorise — and it is the one the project marks. A program that works but is one 200-line <code>main()</code> loses points against exactly this line.</p>`,
        `<p class="y-chinh">🎯 Các mục tiêu sẽ bị kiểm tra, theo đúng chữ của trường. Chín mục, và chúng tách rất gọn thành "thiết kế" (mục 1, 2, 7) và "cơ chế C" (phần còn lại).</p>
<ul>
<li><strong>"Define a C-module or C-function?"</strong> và <strong>"Explain module's characteristics"</strong> — slide 6–11. Đây là phần định nghĩa và bảng; thuần học thuộc, và là điểm cho không.</li>
<li><strong>"Implement C functions" / "Use functions?"</strong> — slide 26–48. Viết phần đầu hàm, thân hàm, câu <code>return</code>; rồi gọi nó với đối số.</li>
<li><strong>"Differentiate built-in and user-defined functions"</strong> — slide 39. <code>printf</code>, <code>scanf</code>, <code>sqrt</code> đến từ header bạn <code>#include</code>; <code>tongUoc</code> đến từ bạn.</li>
<li><strong>"Explain mechanism when a function is called"</strong> — slide 49–52, bản đồ bộ nhớ stack/heap và truyền theo giá trị. Đây là ý khó nhất của slot và cũng là ý hay bị hỏi nhất.</li>
<li><strong>"Analyze a problem into functions"</strong> — slide 54–58. Kỹ thuật danh từ/động từ: danh từ thành biến, động từ thành hàm.</li>
<li><strong>"Understand extent and scope of a variable"</strong> — slide 60–64. Biến nhìn thấy được ở đâu và sống bao lâu. Nó khép vòng với coupling: biến toàn cục chính là loại có phạm vi toàn chương trình, và đó là lý do bộ slide bảo bạn tránh chúng.</li>
<li><strong>Slide 1–25 nằm ở đâu</strong> — bài này phủ mục tiêu 1, 2 và nửa thiết kế của mục 7. Các mục tiêu còn lại là những bài kế tiếp của slot.</li>
</ul>
<p class="meo">💡 Mọi động từ trong danh sách đều là hành động ("định nghĩa", "giải thích", "cài đặt", "phân tích"). Không cái nào là "biết về". Hãy học bằng cách <em>làm</em> bài tập tương ứng, đừng học bằng cách đọc lại slide.</p>
<p class="pitfall">⚠️ Mục tiêu "Analyze a problem into functions" là mục sinh viên hay bỏ, vì nó chẳng có cú pháp nào để thuộc — mà nó lại chính là mục chấm điểm đồ án. Một chương trình chạy đúng nhưng gói trong một <code>main()</code> 200 dòng sẽ mất điểm đúng ở dòng này.</p>`],

      [5, 'Contents — the roadmap of the whole slot',
        `<p class="y-chinh">🎯 Eleven headings, which are exactly the eleven numbered section dividers you will meet (slides 6, 10, 12, 26, 34, 38, 49, 54, 56, 60, 65).</p>
<ul>
<li><strong>Blocks 1–3 — the design half (slides 6–25, this lesson)</strong> — "What is a module?", "Characteristics of modules", "Hints for module identifying". No C syntax is required to understand them.</li>
<li><strong>Blocks 4–6 — the syntax half (slides 26–48)</strong> — "C-Functions and Modules", "How to implement a function?", "How to use a function?". Header, body, <code>return</code>, prototypes, <code>#include</code>.</li>
<li><strong>Block 7 — the machine (slides 49–53)</strong> — "What happen when a function is called?": stack frames, copies of arguments, why swapping two integers by value does not work.</li>
<li><strong>Blocks 8–9 — the method (slides 54–59)</strong> — "How to analyze a problem into functions?" and "Implement a program using functions". This is where design and syntax meet.</li>
<li><strong>Blocks 10–11 — the fine print (slides 60–68)</strong> — "Extent and Scope of a variable", then "Walkthroughs with Functions".</li>
<li><strong>Read the order as a claim</strong> — the deck deliberately puts design (blocks 1–3) <em>before</em> syntax (blocks 4–6). That ordering is the lesson: you decide what the modules are, and only then write function headers.</li>
</ul>
<p class="meo">💡 Use this slide as a checklist while revising. If you cannot say one sentence about each of the eleven headings, you know exactly which slide range to re-open — the dividers are numbered on screen so the mapping is instant.</p>
<p class="pitfall">⚠️ Do not let the word "Contents" fool you into skipping it. Slides 5 and 69–71 (the summary) are the two places where the deck tells you what it considers important; the exam agrees with the deck far more often than with your own sense of what was interesting.</p>`,
        `<p class="y-chinh">🎯 Mười một đầu mục, chính là mười một slide phân mục đánh số mà bạn sẽ gặp (slide 6, 10, 12, 26, 34, 38, 49, 54, 56, 60, 65).</p>
<ul>
<li><strong>Khối 1–3 — nửa thiết kế (slide 6–25, chính là bài này)</strong> — "What is a module?", "Characteristics of modules", "Hints for module identifying". Không cần cú pháp C nào để hiểu chúng.</li>
<li><strong>Khối 4–6 — nửa cú pháp (slide 26–48)</strong> — "C-Functions and Modules", "How to implement a function?", "How to use a function?". Phần đầu hàm, thân hàm, <code>return</code>, prototype, <code>#include</code>.</li>
<li><strong>Khối 7 — phần máy móc (slide 49–53)</strong> — "What happen when a function is called?": khung ngăn xếp, bản sao của đối số, và vì sao hoán đổi hai số nguyên theo giá trị lại không ăn thua.</li>
<li><strong>Khối 8–9 — phương pháp (slide 54–59)</strong> — "How to analyze a problem into functions?" và "Implement a program using functions". Đây là chỗ thiết kế gặp cú pháp.</li>
<li><strong>Khối 10–11 — phần chữ nhỏ (slide 60–68)</strong> — "Extent and Scope of a variable", rồi "Walkthroughs with Functions".</li>
<li><strong>Hãy đọc thứ tự này như một tuyên bố</strong> — bộ slide cố ý đặt thiết kế (khối 1–3) TRƯỚC cú pháp (khối 4–6). Chính thứ tự ấy là bài học: quyết định module là những gì đã, rồi mới viết phần đầu hàm.</li>
</ul>
<p class="meo">💡 Dùng slide này làm bảng kiểm khi ôn. Nếu bạn không nói được một câu về mỗi đầu mục trong mười một mục, bạn biết ngay phải mở lại khoảng slide nào — các slide phân mục có đánh số trên màn hình nên tra ra tức thì.</p>
<p class="pitfall">⚠️ Đừng để chữ "Contents" khiến bạn bỏ qua nó. Slide 5 và slide 69–71 (phần tổng kết) là hai chỗ bộ slide tự nói ra thứ nó coi là quan trọng; đề thi đồng ý với bộ slide nhiều hơn hẳn so với đồng ý với cảm giác "phần này hay" của bạn.</p>`],

      [6, 'Section 1 — What is a Module? (divider)',
        `<p class="y-chinh">🎯 Divider for block 1. Two slides follow (7 and 8) plus a worked example (9); together they answer one question: what counts as a module?</p>
<ul>
<li><strong>Why the definition needs its own block</strong> — "module" is a word students think they already know. The deck insists on a precise version because two of its clauses ("specific small function", "may be used alone or combined") are exactly what cohesion and coupling will later measure.</li>
<li><strong>Language-independent on purpose</strong> — nothing in slides 6–9 mentions C syntax. The same idea appears as <em>procedure</em> in Pascal, <em>method</em> in Java, <em>function</em> in C and Python. Learn it once here and it transfers to every language you meet afterwards.</li>
<li><strong>What is coming in each of the three slides</strong> — slide 7 gives the definition plus a non-programming example (cooking rice); slide 8 gives the formal design framing ("design units", reducing simultaneous factors); slide 9 maps the whole thing onto a real C program, line by line.</li>
<li><strong>The connection to <code>#include</code></strong> — slide 8 ends with "Some related modules can be put into a file (You used it — stdio.h)". You have been consuming other people's modules since your first <code>printf</code>; this block is where you start producing them.</li>
<li><strong>How to read a divider slide</strong> — it is a bookmark, not content. Its value is that it lets you locate a topic in a 71-slide deck in seconds.</li>
</ul>
<p class="meo">💡 Before you turn to slide 7, write your own one-sentence definition of "module" on paper. Then compare it with the deck's. The gap between the two is precisely what this block has to teach you.</p>`,
        `<p class="y-chinh">🎯 Slide phân mục cho khối 1. Có hai slide theo sau (7 và 8) cộng một ví dụ đã giải (9); cả ba trả lời một câu hỏi: cái gì được tính là module?</p>
<ul>
<li><strong>Vì sao định nghĩa cần hẳn một khối riêng</strong> — "module" là chữ mà sinh viên tưởng mình đã biết. Bộ slide nhất định đưa một bản chính xác vì hai mệnh đề trong đó ("specific small function", "may be used alone or combined") chính là thứ mà cohesion và coupling sẽ đo về sau.</li>
<li><strong>Cố ý không phụ thuộc ngôn ngữ</strong> — không có dòng nào trong slide 6–9 nhắc tới cú pháp C. Cùng ý tưởng đó xuất hiện dưới tên <em>procedure</em> trong Pascal, <em>method</em> trong Java, <em>function</em> trong C và Python. Học một lần ở đây là mang đi được mọi ngôn ngữ sau này.</li>
<li><strong>Ba slide sắp tới nói gì</strong> — slide 7 cho định nghĩa cộng một ví dụ ngoài lập trình (nấu cơm); slide 8 cho cách diễn đạt hình thức của thiết kế ("design units", giảm số yếu tố phải xử lý cùng lúc); slide 9 chiếu toàn bộ chuyện đó lên một chương trình C thật, từng dòng một.</li>
<li><strong>Mối nối với <code>#include</code></strong> — slide 8 kết bằng "Some related modules can be put into a file (You used it — stdio.h)". Bạn đã dùng module của người khác từ lời <code>printf</code> đầu tiên; khối này là chỗ bạn bắt đầu tự sản xuất chúng.</li>
<li><strong>Đọc một slide phân mục thế nào</strong> — nó là dấu trang, không phải nội dung. Giá trị của nó là giúp bạn định vị một chủ đề trong bộ 71 slide chỉ trong vài giây.</li>
</ul>
<p class="meo">💡 Trước khi lật sang slide 7, hãy tự viết ra giấy định nghĩa "module" của riêng bạn trong một câu. Rồi so với định nghĩa của bộ slide. Khoảng cách giữa hai bản chính là thứ khối này cần dạy bạn.</p>`],

      [7, 'What is a Module? — definition and the rice-cooking example',
        `<p class="y-chinh">🎯 The definition to memorise: "Module is a portion of a program that carries out a specific small function and may be used alone or combined with other modules to create a program."</p>
<ul>
<li><strong>Clause 1: "a portion of a program"</strong> — a part, not the whole. A program that is one module is not modular.</li>
<li><strong>Clause 2: "a specific small function"</strong> — two adjectives, both load-bearing. <em>Specific</em> is cohesion: one job, nameable by one verb. <em>Small</em> is readability: slide 14 will say "a readable amount of code".</li>
<li><strong>Clause 3: "may be used alone"</strong> — this is low coupling. If a module can only run after some other module has set a global first, it cannot be used alone, and the definition itself excludes it.</li>
<li><strong>Clause 4: "or combined with other modules to create a program"</strong> — composition. Modules are building blocks; the program is what you get by stacking them.</li>
<li><strong>"Natural thinking: A large task is divided into some smaller tasks"</strong> — the deck's justification. Modularity is not a programming invention; it is how people already handle any complex job.</li>
<li><strong>The rice example, exactly as printed</strong> — (1) Clean the pot; (2) Measure rice; (3) Washing rice; (4) add water; (5) Boil; (6) Keep hot 10 minutes. Six modules. Notice every single one starts with a <strong>verb</strong> — which is the identification rule slide 16 will state formally.</li>
</ul>
<pre><code>/* the rice recipe, written as C module headers */
void cleanThePot(void);
void measureRice(int cups);
void washRice(void);
void addWater(int cups);
void boil(void);
void keepHot(int minutes);</code></pre>
<p class="dap-an">✅ Apply the definition to step (5) "Boil": is it specific? yes, one job. Small? yes. Usable alone? yes — you can boil water without having washed rice. Combinable? yes, it sits between (4) and (6). So it qualifies as a module on all four clauses. Now test "Cook rice" itself: specific? <strong>no</strong> — it is six jobs. It fails clause 2, which is precisely why it must be divided.</p>
<p class="meo">💡 The rice example is not padding. It gives you a test you can run on your own designs without a computer: say the module's name out loud. If it needs the word "and" ("read input and compute the sum"), it is not one module yet.</p>`,
        `<p class="y-chinh">🎯 Định nghĩa phải thuộc: "Module is a portion of a program that carries out a specific small function and may be used alone or combined with other modules to create a program."</p>
<ul>
<li><strong>Mệnh đề 1: "a portion of a program"</strong> — một PHẦN, không phải toàn bộ. Một chương trình chỉ có đúng một module thì không phải là chia module.</li>
<li><strong>Mệnh đề 2: "a specific small function"</strong> — hai tính từ, cả hai đều chịu lực. <em>Specific</em> (cụ thể) chính là cohesion: một việc, gọi tên được bằng một động từ. <em>Small</em> (nhỏ) là tính đọc được: slide 14 sẽ nói "a readable amount of code".</li>
<li><strong>Mệnh đề 3: "may be used alone"</strong> — đây là ghép nối thấp. Nếu một module chỉ chạy được sau khi một module khác đã gán biến toàn cục trước, thì nó không "dùng một mình" được, và chính định nghĩa đã loại nó ra.</li>
<li><strong>Mệnh đề 4: "or combined with other modules to create a program"</strong> — tính lắp ghép. Module là viên gạch; chương trình là thứ có được khi xếp chúng lại.</li>
<li><strong>"Natural thinking: A large task is divided into some smaller tasks"</strong> — lời biện hộ của bộ slide. Chia module không phải phát minh của lập trình; đó là cách con người vốn đã xử lý mọi việc phức tạp.</li>
<li><strong>Ví dụ nấu cơm, đúng nguyên văn</strong> — (1) Clean the pot; (2) Measure rice; (3) Washing rice; (4) add water; (5) Boil; (6) Keep hot 10 minutes. Sáu module. Để ý từng cái đều mở đầu bằng một <strong>động từ</strong> — đúng là quy tắc nhận diện mà slide 16 sẽ phát biểu hình thức.</li>
</ul>
<pre><code>/* công thức nấu cơm, viết thành các phần đầu hàm C */
void cleanThePot(void);
void measureRice(int cups);
void washRice(void);
void addWater(int cups);
void boil(void);
void keepHot(int minutes);</code></pre>
<p class="dap-an">✅ Áp định nghĩa vào bước (5) "Boil": có cụ thể không? có, một việc. Nhỏ không? có. Dùng một mình được không? được — bạn đun sôi nước mà không cần đã vo gạo. Ghép được không? được, nó nằm giữa (4) và (6). Vậy nó đạt cả bốn mệnh đề. Giờ thử với chính "Nấu cơm": có cụ thể không? <strong>KHÔNG</strong> — nó là sáu việc. Nó trượt mệnh đề 2, và đó đúng là lý do nó phải được chia nhỏ.</p>
<p class="meo">💡 Ví dụ nấu cơm không phải phần độn. Nó cho bạn một phép thử chạy được trên thiết kế của chính mình mà không cần máy tính: đọc to tên module lên. Nếu phải dùng chữ "và" ("đọc dữ liệu vào VÀ tính tổng"), thì nó chưa phải một module.</p>`],

      [8, 'Modules: Structure Design',
        `<p class="y-chinh">🎯 The formal framing: "In designing a program, we subdivide the problem conceptually into a set of design units. We call these design units as modules. In subdividing the problem, we reduce the number of factors with which to deal simultaneously."</p>
<ul>
<li><strong>"Conceptually"</strong> — the subdivision happens on paper, in your head, before any code exists. Modules are a thinking tool first and a syntax second.</li>
<li><strong>"Design units"</strong> — the deck's name for the pieces. A design unit is a decision you have finished making; once "summing divisors" is a unit, you never have to think about <em>how</em> it sums while designing the rest.</li>
<li><strong>The real payoff: "reduce the number of factors with which to deal simultaneously"</strong> — this is the sentence worth underlining. Human working memory holds roughly a handful of things at once. A 200-line <code>main()</code> asks you to hold 200. Four modules ask you to hold four.</li>
<li><strong>Why "simultaneously" is the key word</strong> — modules do not reduce the total amount of code. The program is the same size. What shrinks is how much of it you must have in your head <em>at one moment</em>.</li>
<li><strong>"Some related modules can be put into a file"</strong> — the next level up: modules group into files, files group into libraries. Same idea applied twice.</li>
<li><strong>"(You used it — stdio.h)"</strong> — the deck's proof that you already rely on this. <code>stdio.h</code> is a file collecting the input/output modules: <code>printf</code>, <code>scanf</code>, <code>getchar</code>, <code>fopen</code>. Related modules, one file, one <code>#include</code>.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;    /* printf, scanf, getchar, fopen, ...  */
#include &lt;stdlib.h&gt;   /* system, malloc, abs, rand, ...      */
#include &lt;math.h&gt;     /* sqrt, pow, fabs, sin, ...           */</code></pre>
<p class="dap-an">✅ Test of the grouping principle: which header would you expect <code>sqrt</code> in? It is a mathematical computation, so <code>math.h</code> — and compiling <code>sqrt(15.0)</code> with only <code>stdio.h</code> included produces <em>"implicit declaration of function 'sqrt'"</em>. The grouping is not decoration; the compiler enforces it.</p>
<p class="meo">💡 "Reduce the factors to deal with simultaneously" is also the answer to "how small should a module be?". Small enough that you can hold its whole job in your head while reading its caller. In practice that is usually well under 30 lines.</p>`,
        `<p class="y-chinh">🎯 Cách diễn đạt hình thức: "In designing a program, we subdivide the problem conceptually into a set of design units. We call these design units as modules. In subdividing the problem, we reduce the number of factors with which to deal simultaneously."</p>
<ul>
<li><strong>"Conceptually" (về mặt ý niệm)</strong> — việc chia nhỏ diễn ra trên giấy, trong đầu, TRƯỚC khi có dòng code nào. Module trước hết là công cụ tư duy, sau đó mới là cú pháp.</li>
<li><strong>"Design units" (đơn vị thiết kế)</strong> — tên bộ slide đặt cho các mảnh. Một đơn vị thiết kế là một quyết định bạn đã làm xong; khi "tính tổng ước" đã là một đơn vị, bạn không phải nghĩ nó tính <em>bằng cách nào</em> trong lúc thiết kế phần còn lại.</li>
<li><strong>Cái lợi thật: "reduce the number of factors with which to deal simultaneously"</strong> — câu này đáng gạch chân. Trí nhớ làm việc của người giữ được chừng dăm bảy thứ cùng lúc. Một <code>main()</code> 200 dòng bắt bạn giữ 200. Bốn module bắt bạn giữ bốn.</li>
<li><strong>Vì sao "simultaneously" mới là chữ then chốt</strong> — module KHÔNG làm giảm tổng lượng code. Chương trình vẫn từng ấy. Cái giảm đi là lượng code bạn phải giữ trong đầu <em>tại một thời điểm</em>.</li>
<li><strong>"Some related modules can be put into a file"</strong> — tầng tiếp theo: module gom thành file, file gom thành thư viện. Cùng một ý tưởng áp hai lần.</li>
<li><strong>"(You used it — stdio.h)"</strong> — bằng chứng của bộ slide rằng bạn đã dựa vào chuyện này rồi. <code>stdio.h</code> là một file gom các module vào/ra: <code>printf</code>, <code>scanf</code>, <code>getchar</code>, <code>fopen</code>. Module liên quan, một file, một dòng <code>#include</code>.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;    /* printf, scanf, getchar, fopen, ...  */
#include &lt;stdlib.h&gt;   /* system, malloc, abs, rand, ...      */
#include &lt;math.h&gt;     /* sqrt, pow, fabs, sin, ...           */</code></pre>
<p class="dap-an">✅ Phép thử nguyên tắc gom nhóm: bạn đoán <code>sqrt</code> nằm ở header nào? Nó là phép tính toán học nên nằm ở <code>math.h</code> — và biên dịch <code>sqrt(15.0)</code> khi chỉ <code>#include &lt;stdio.h&gt;</code> sẽ ra <em>"implicit declaration of function 'sqrt'"</em>. Việc gom nhóm không phải trang trí; trình biên dịch cưỡng chế nó.</p>
<p class="meo">💡 "Giảm số yếu tố phải xử lý cùng lúc" cũng chính là câu trả lời cho "module nên nhỏ cỡ nào?". Nhỏ đủ để bạn giữ trọn công việc của nó trong đầu trong lúc đọc chỗ gọi nó. Trên thực tế thường là dưới 30 dòng khá xa.</p>`],

      [9, 'Structure design — Example (the divisor-sum program, task by task)',
        `<p class="y-chinh">🎯 The deck's first real design walkthrough. Problem: "Develop a program that will accept a positive integer then sum of it's divisors is printed out." The slide shows a three-column table — Analyze / Code / Description.</p>
<ul>
<li><strong>The four tasks the slide identifies</strong> — Task 1: accept n. Task 2: s = sum of its divisors. Task 3: print out s. Task 4: pause the program. Each row of the table is one task, one line of C, one sentence of explanation.</li>
<li><strong>Which tasks are already modules you own</strong> — Task 1 is <code>scanf</code> ("Use a module scanf in the stdio.h"), Task 3 is <code>printf</code>, Task 4 is <code>system("pause")</code> from <code>stdlib.h</code>. Three of the four tasks are solved by borrowing.</li>
<li><strong>Which task is yours to write</strong> — only Task 2: <code>s = sumDivisors(n);</code>, annotated "Module will be implemented". That asymmetry is the lesson of the slide: design first identifies <em>all</em> tasks, then discovers most of them already exist.</li>
<li><strong>The declaration row</strong> — <code>int main { int n; int s; }</code> is described as "Declare the main module and it's data". <code>main</code> is itself a module, and <code>n</code> and <code>s</code> are its private data.</li>
<li><strong>Note what the slide does NOT do</strong> — it does not put the <code>scanf</code> inside <code>sumDivisors</code>. Input stays in <code>main</code>; the computing module receives <code>n</code> as a parameter. That single choice is what slides 15–24 will spend ten slides justifying.</li>
<li><strong>About <code>system("pause")</code></strong> — it is a Windows/Dev-C++ habit that keeps the console window open. It costs you portability (it fails on macOS/Linux) and it launches a whole shell. Fine for a lab, not for real code.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

int sumDivisors(int n) {           /* Task 2 - the module we implement */
    int i, s = 0;
    for (i = 1; i &lt;= n; i++)
        if (n % i == 0) s = s + i;
    return s;
}

int main(void) {
    int n, s;
    scanf("%d", &amp;n);               /* Task 1 - module from stdio.h  */
    s = sumDivisors(n);            /* Task 2                        */
    printf("%d", s);               /* Task 3 - module from stdio.h  */
    system("pause");               /* Task 4 - module from stdlib.h */
    return 0;
}</code></pre>
<p class="dap-an">✅ Compiled with <code>cc -Wall -std=c99</code> and run with input <strong>12</strong>: the divisors are 1, 2, 3, 4, 6, 12 and the program prints <strong>28</strong>. Further runs: n = 6 → <strong>12</strong>; n = 7 → <strong>8</strong> (a prime, so 1 + 7); n = 28 → <strong>56</strong>; n = 1 → <strong>1</strong>.</p>
<p class="pitfall">⚠️ Note the loop runs <code>i &lt;= n</code>, so <strong>n itself counts as a divisor</strong>. That is why 6 gives 12 and not 6. If a question says "proper divisors" (excluding n), the loop becomes <code>i &lt; n</code> and 6 gives 6 — a perfect number. Read which one the question wants before writing the condition.</p>`,
        `<p class="y-chinh">🎯 Bài thiết kế thật đầu tiên của bộ slide. Đề: "Develop a program that will accept a positive integer then sum of it's divisors is printed out." Slide trình bày một bảng ba cột — Analyze / Code / Description.</p>
<ul>
<li><strong>Bốn việc mà slide chỉ ra</strong> — Task 1: nhận n. Task 2: s = tổng các ước của nó. Task 3: in s. Task 4: dừng chương trình. Mỗi hàng của bảng là một việc, một dòng C, một câu giải thích.</li>
<li><strong>Việc nào đã có sẵn module</strong> — Task 1 là <code>scanf</code> ("Use a module scanf in the stdio.h"), Task 3 là <code>printf</code>, Task 4 là <code>system("pause")</code> của <code>stdlib.h</code>. Ba trong bốn việc được giải bằng cách mượn.</li>
<li><strong>Việc nào là của bạn</strong> — chỉ Task 2: <code>s = sumDivisors(n);</code>, chú thích "Module will be implemented". Sự lệch đó chính là bài học của slide: thiết kế trước hết liệt kê TẤT CẢ các việc, rồi phát hiện ra phần lớn đã có sẵn.</li>
<li><strong>Hàng khai báo</strong> — <code>int main { int n; int s; }</code> được mô tả là "Declare the main module and it's data". Bản thân <code>main</code> cũng là một module, còn <code>n</code> và <code>s</code> là dữ liệu riêng của nó.</li>
<li><strong>Để ý điều slide KHÔNG làm</strong> — nó không nhét <code>scanf</code> vào trong <code>sumDivisors</code>. Việc nhập ở lại <code>main</code>; module tính toán nhận <code>n</code> qua tham số. Đúng một lựa chọn đó là thứ mà slide 15–24 sẽ dùng mười slide để biện minh.</li>
<li><strong>Về <code>system("pause")</code></strong> — đó là thói quen Windows/Dev-C++ để giữ cửa sổ console không đóng. Cái giá là mất tính di động (nó hỏng trên macOS/Linux) và nó khởi chạy hẳn một shell. Được cho bài lab, không được cho code thật.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

int sumDivisors(int n) {           /* Task 2 - module ta tự cài đặt */
    int i, s = 0;
    for (i = 1; i &lt;= n; i++)
        if (n % i == 0) s = s + i;
    return s;
}

int main(void) {
    int n, s;
    scanf("%d", &amp;n);               /* Task 1 - module của stdio.h  */
    s = sumDivisors(n);            /* Task 2                       */
    printf("%d", s);               /* Task 3 - module của stdio.h  */
    system("pause");               /* Task 4 - module của stdlib.h */
    return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch bằng <code>cc -Wall -std=c99</code> và chạy với dữ liệu vào <strong>12</strong>: các ước là 1, 2, 3, 4, 6, 12 và chương trình in ra <strong>28</strong>. Chạy thêm: n = 6 → <strong>12</strong>; n = 7 → <strong>8</strong> (số nguyên tố nên chỉ 1 + 7); n = 28 → <strong>56</strong>; n = 1 → <strong>1</strong>.</p>
<p class="pitfall">⚠️ Chú ý vòng lặp chạy <code>i &lt;= n</code>, nên <strong>chính n cũng được tính là ước</strong>. Vì thế 6 cho 12 chứ không phải 6. Nếu đề nói "ước thực sự" (không kể n) thì vòng lặp thành <code>i &lt; n</code> và 6 cho 6 — một số hoàn hảo. Đọc kỹ đề muốn loại nào rồi hãy viết điều kiện.</p>`],

      [10, 'Section 2 — Characteristics of Modules (divider)',
        `<p class="y-chinh">🎯 Divider for block 2. One slide follows (11): a two-column table matching each characteristic of a module to the reason it holds.</p>
<ul>
<li><strong>What "characteristic" means here</strong> — not a rule you must follow, but a property you <em>get</em> once something genuinely is a module. Slide 3 sold you the benefits; slide 11 explains the mechanism behind three of them.</li>
<li><strong>Why it is placed after the definition</strong> — the characteristics all follow from the four clauses of slide 7. "Can be re-used" follows from "may be used alone". "Easy to upgrade" follows from "specific small function".</li>
<li><strong>The shape of slide 11</strong> — left column: the characteristic (what you observe). Right column: the reason (why it happens). Reading it right-to-left is more instructive: the reason causes the characteristic.</li>
<li><strong>Three levels of reuse to keep straight</strong> — reuse <em>inside one function</em> (a loop), reuse <em>inside one program</em> (call the function from several places), reuse <em>across programs</em> (put it in a header file). Slide 11 covers the last two.</li>
<li><strong>Where it leads</strong> — block 3 (slides 12–25) turns these observations into actionable design criteria: cohesion and coupling. Block 2 is the "what you get"; block 3 is the "how to get it".</li>
</ul>
<p class="meo">💡 If you are short of revision time, slides 11, 14 and 24 are the three highest-value slides in this whole range: a table of properties, a list of principles, and a worked example that satisfies them all.</p>`,
        `<p class="y-chinh">🎯 Slide phân mục cho khối 2. Một slide theo sau (11): bảng hai cột ghép mỗi đặc trưng của module với lý do nó đúng.</p>
<ul>
<li><strong>"Đặc trưng" ở đây nghĩa là gì</strong> — không phải luật bạn phải tuân, mà là tính chất bạn <em>được hưởng</em> khi một thứ thật sự là module. Slide 3 chào hàng các lợi ích; slide 11 giải thích cơ chế đứng sau ba trong số đó.</li>
<li><strong>Vì sao đặt sau định nghĩa</strong> — các đặc trưng đều suy ra từ bốn mệnh đề của slide 7. "Tái dùng được" suy ra từ "may be used alone". "Dễ nâng cấp" suy ra từ "specific small function".</li>
<li><strong>Hình dạng của slide 11</strong> — cột trái: đặc trưng (thứ bạn quan sát được). Cột phải: lý do (vì sao có nó). Đọc từ phải sang trái thì bổ ích hơn: lý do là nguyên nhân sinh ra đặc trưng.</li>
<li><strong>Ba mức tái sử dụng cần phân biệt</strong> — tái dùng <em>trong một hàm</em> (vòng lặp), tái dùng <em>trong một chương trình</em> (gọi hàm từ nhiều nơi), tái dùng <em>giữa nhiều chương trình</em> (đưa vào file header). Slide 11 nói về hai mức sau.</li>
<li><strong>Nó dẫn tới đâu</strong> — khối 3 (slide 12–25) biến các quan sát này thành tiêu chí thiết kế dùng được: cohesion và coupling. Khối 2 là "bạn được gì"; khối 3 là "làm sao có được".</li>
</ul>
<p class="meo">💡 Nếu bạn thiếu thời gian ôn, thì slide 11, 14 và 24 là ba slide giá trị nhất trong cả khoảng này: một bảng tính chất, một danh sách nguyên tắc, và một ví dụ đã giải thoả mãn hết.</p>`],

      [11, 'Characteristics of Modules — the table (characteristic / reason)',
        `<p class="y-chinh">🎯 Three characteristics, each with its reason. Learn the pairs, not the left column alone — exams ask "why".</p>
<ul>
<li><strong>"It is easy to upgrade and maintain" ← "It contains a small group of code lines for a SPECIFIC task."</strong> The capital letters are the deck's. The causal chain: specific task → few lines → you can read all of them → you can change them without fear.</li>
<li><strong>Why "SPECIFIC" is shouted</strong> — it is cohesion under a different name, four slides early. A module that does one specific thing has exactly one reason to ever be modified, so a change request maps to exactly one place.</li>
<li><strong>"It can be re-used in the same program" ← "It has a identified name (a descriptive identifier) and can be used more than one time in a program."</strong> The name is the mechanism. A block of code without a name cannot be invoked twice; giving it a name is literally what makes reuse possible.</li>
<li><strong>"Descriptive" is not decoration</strong> — <code>sumDivisors</code> tells the caller what will happen; <code>f1</code> forces them to read the body. A descriptive name is the difference between using a module and re-deriving it.</li>
<li><strong>"It can be re-used in some programs" ← "if it is stored in an outside file (library file), it can be used in some programs."</strong> The step from reuse-in-one-program to reuse-across-programs is purely a matter of where the text lives: same function, moved into a <code>.h</code>/<code>.c</code> pair.</li>
<li><strong>Note the missing fourth row</strong> — the table says nothing about speed. Modules do not make programs faster; a call has a small cost. You trade a little speed for a lot of maintainability, knowingly.</li>
</ul>
<pre><code>/* characteristic 2 in one line: one name, three uses */
int tongUoc(int x) { int i, s = 0; for (i = 1; i &lt;= x; i++) if (x % i == 0) s += i; return s; }

printf("%d %d %d\\n", tongUoc(12), tongUoc(18), tongUoc(28));
printf("%d\\n", tongUoc(12) + tongUoc(18));</code></pre>
<p class="dap-an">✅ Compiled and run: the first line prints <strong>28 39 56</strong>, the second prints <strong>67</strong> (28 + 39). Three calls, one definition — that is "re-used in the same program", demonstrated rather than asserted.</p>
<p class="meo">💡 Turn the table into a checklist for your own function: (1) could I read the whole body without scrolling? (2) does the name say what it does? (3) would it still compile if I moved it to another program unchanged? Three yeses and you have a module.</p>`,
        `<p class="y-chinh">🎯 Ba đặc trưng, mỗi cái kèm lý do. Hãy học theo CẶP, đừng học mỗi cột trái — đề thi hỏi "vì sao".</p>
<ul>
<li><strong>"It is easy to upgrade and maintain" ← "It contains a small group of code lines for a SPECIFIC task."</strong> Chữ in hoa là của bộ slide. Chuỗi nhân quả: việc cụ thể → ít dòng → bạn đọc hết được → bạn sửa được mà không sợ.</li>
<li><strong>Vì sao "SPECIFIC" bị hét lên</strong> — đó chính là cohesion dưới một cái tên khác, sớm hơn bốn slide. Một module làm đúng một việc cụ thể thì chỉ có đúng một lý do để bị sửa, nên một yêu cầu thay đổi chiếu vào đúng một chỗ.</li>
<li><strong>"It can be re-used in the same program" ← "It has a identified name (a descriptive identifier) and can be used more than one time in a program."</strong> Cái TÊN chính là cơ chế. Một khối code không có tên thì không gọi được lần thứ hai; đặt tên cho nó đúng nghĩa đen là thứ làm cho tái sử dụng khả thi.</li>
<li><strong>"Descriptive" (gợi nghĩa) không phải trang trí</strong> — <code>sumDivisors</code> nói cho người gọi biết chuyện gì sẽ xảy ra; <code>f1</code> bắt họ phải đọc thân hàm. Một cái tên gợi nghĩa là khác biệt giữa DÙNG một module và phải suy lại nó.</li>
<li><strong>"It can be re-used in some programs" ← "if it is stored in an outside file (library file), it can be used in some programs."</strong> Bước từ tái dùng trong một chương trình lên tái dùng giữa nhiều chương trình thuần tuý là chuyện đoạn chữ ấy nằm ở đâu: vẫn hàm đó, chuyển sang cặp <code>.h</code>/<code>.c</code>.</li>
<li><strong>Để ý hàng thứ tư KHÔNG có</strong> — bảng không nói gì về tốc độ. Module không làm chương trình nhanh hơn; một lời gọi có chi phí nhỏ. Bạn đánh đổi một chút tốc độ lấy rất nhiều khả năng bảo trì, một cách có ý thức.</li>
</ul>
<pre><code>/* đặc trưng 2 gói trong một dòng: một cái tên, ba lần dùng */
int tongUoc(int x) { int i, s = 0; for (i = 1; i &lt;= x; i++) if (x % i == 0) s += i; return s; }

printf("%d %d %d\\n", tongUoc(12), tongUoc(18), tongUoc(28));
printf("%d\\n", tongUoc(12) + tongUoc(18));</code></pre>
<p class="dap-an">✅ Đã biên dịch và chạy: dòng đầu in <strong>28 39 56</strong>, dòng sau in <strong>67</strong> (28 + 39). Ba lời gọi, một định nghĩa — đó là "re-used in the same program", được chứng minh chứ không phải chỉ tuyên bố.</p>
<p class="meo">💡 Biến cái bảng thành bảng kiểm cho hàm của chính bạn: (1) tôi có đọc hết thân hàm mà không phải cuộn màn hình không? (2) cái tên có nói nó làm gì không? (3) nếu bê nguyên sang chương trình khác thì nó còn dịch được không? Ba lần "có" là bạn đã có một module.</p>`],

      [12, 'Section 3 — Module identifying: Hints (divider)',
        `<p class="y-chinh">🎯 Divider for block 3, the longest and most examined block of this lesson: slides 13 to 25.</p>
<ul>
<li><strong>The question this block answers</strong> — blocks 1 and 2 said what a module is and what you get from one. Block 3 answers the hard practical question: given a problem, <em>how do you decide where to cut it?</em></li>
<li><strong>The route through the block</strong> — design principles (13–14), a negative example showing both diseases at once (15), cohesion defined (16) and graded low-to-high (17–18), coupling defined (19) and classified (20), a full positive example (21–24), and finally a four-step recipe (25).</li>
<li><strong>Two words to hold onto</strong> — <strong>cohesion</strong> looks <em>inside</em> one module: do its statements all serve one purpose? <strong>Coupling</strong> looks <em>between</em> modules: how much does this one depend on the others?</li>
<li><strong>The target, stated once and repeated everywhere</strong> — high cohesion, low coupling. Note the asymmetry: you want cohesion <em>high</em> and coupling <em>low</em>. Students lose marks by mixing the directions up, so anchor it: inside = tight, between = loose.</li>
<li><strong>An everyday analogy that holds up</strong> — a toolbox with one tool per slot is cohesive; if pulling out the screwdriver drags the hammer with it, the slots are coupled.</li>
<li><strong>Why "Hints" in the title</strong> — there is no algorithm for this. The deck offers heuristics: the verb test, the six degrees of cohesion, the five kinds of coupling. Judgement, guided.</li>
</ul>
<p class="meo">💡 Write "high cohesion, low coupling" on the first page of your notebook now. Every remaining slide in this lesson is a commentary on those four words, and the summary slide 69 repeats them almost verbatim.</p>`,
        `<p class="y-chinh">🎯 Slide phân mục cho khối 3, khối dài nhất và bị hỏi nhiều nhất của bài này: slide 13 tới 25.</p>
<ul>
<li><strong>Câu hỏi khối này trả lời</strong> — khối 1 và 2 đã nói module là gì và bạn được gì từ nó. Khối 3 trả lời câu thực tế khó nhất: cho một bài toán, <em>làm sao quyết định cắt ở đâu?</em></li>
<li><strong>Lộ trình xuyên khối</strong> — nguyên tắc thiết kế (13–14), một ví dụ PHẢN DIỆN mắc cả hai bệnh cùng lúc (15), cohesion được định nghĩa (16) rồi xếp hạng từ thấp lên cao (17–18), coupling được định nghĩa (19) và phân loại (20), một ví dụ CHÍNH DIỆN đầy đủ (21–24), và cuối cùng là công thức bốn bước (25).</li>
<li><strong>Hai chữ phải nắm</strong> — <strong>cohesion</strong> nhìn vào BÊN TRONG một module: các câu lệnh của nó có cùng phục vụ một mục đích không? <strong>coupling</strong> nhìn vào GIỮA các module: cái này phụ thuộc vào những cái kia nhiều tới đâu?</li>
<li><strong>Cái đích, nói một lần và nhắc khắp nơi</strong> — cohesion CAO, coupling THẤP. Chú ý sự bất đối xứng: bạn muốn cohesion <em>cao</em> còn coupling <em>thấp</em>. Sinh viên mất điểm vì đảo chiều hai cái, nên hãy neo lại: bên trong = chặt, giữa các module = lỏng.</li>
<li><strong>Một phép ví đời thường mà vẫn đúng</strong> — hộp đồ nghề mỗi ngăn một dụng cụ là kết dính cao; nếu rút cái tua vít mà cái búa bị lôi theo thì các ngăn đang ghép nối với nhau.</li>
<li><strong>Vì sao tiêu đề là "Hints"</strong> — không có thuật toán cho việc này. Bộ slide đưa ra các mẹo dẫn đường: phép thử động từ, sáu mức cohesion, năm loại coupling. Là phán đoán, nhưng có dẫn dắt.</li>
</ul>
<p class="meo">💡 Hãy viết "cohesion cao, coupling thấp" lên trang đầu vở ngay bây giờ. Mọi slide còn lại của bài này đều là lời bình cho bốn chữ đó, và slide tổng kết 69 nhắc lại chúng gần như nguyên văn.</p>`],

      [13, 'Modules Design Principles',
        `<p class="y-chinh">🎯 Three sentences that say the same uncomfortable truth: there is no unique correct decomposition, so you need a criterion for choosing between the possible ones.</p>
<ul>
<li><strong>"We can sub-divide a programming project in different ways."</strong> The honest admission. For the divisor problem you could design {input, compute, output}, or {input, computeAndPrint}, or {doEverything}. All three run. They are not equally good.</li>
<li><strong>"Select our modules so that each one focuses on a narrower aspect of the project."</strong> The first criterion: <em>narrower</em>. Each module should cover less than the problem, and less than its caller. If a module is as broad as the program, it has bought you nothing.</li>
<li><strong>"Our objective is to define a set of modules that simplifies the complexity of the original problem."</strong> The goal is stated as a measurable-ish outcome, not as a rule. Ask after each split: is the problem now easier to think about? If not, undo the split.</li>
<li><strong>Splitting can make things worse</strong> — this is the part students miss. Cutting one clear 12-line function into four 3-line functions that must be called in exactly the right order with shared state is a <em>worse</em> design, not a better one, because complexity moved from inside a module to between modules.</li>
<li><strong>"Focuses on" is the verb test again</strong> — a module that focuses has a focus you can name. If naming it requires a paragraph, it has no focus.</li>
<li><strong>The link forward</strong> — slide 14 turns these three soft sentences into six checkable statements, and slides 16–20 turn those into named categories. Abstraction descending into precision, slide by slide.</li>
</ul>
<pre><code>/* three legal decompositions of the same problem -- only one is good */
/* A */ void lamTatCa(void);                              /* nothing gained     */
/* B */ int  nhapVaTinh(void);   void inKetQua(int s);    /* input hidden in B1 */
/* C */ int  nhapSo(void);  int tongUoc(int x);  void inUoc(int x);   /* good  */</code></pre>
<p class="dap-an">✅ Judge the three with the slide's own criterion ("each one focuses on a narrower aspect"): <strong>A</strong> has one module as broad as the whole problem — no narrowing, so it fails. <strong>B</strong> has <code>nhapVaTinh</code> covering two aspects (its name needs "and") — partially fails. <strong>C</strong> gives three modules, each strictly narrower than the program and each nameable by one verb — it passes. C is the design slides 21–24 will actually build.</p>
<p class="meo">💡 A practical stopping rule for "how far do I subdivide?": stop when every module's name is a single verb phrase and you would be comfortable handing any one of them to a classmate with no further explanation.</p>`,
        `<p class="y-chinh">🎯 Ba câu nói cùng một sự thật khó chịu: KHÔNG có một cách phân rã đúng duy nhất, nên bạn cần một tiêu chí để chọn giữa các cách khả dĩ.</p>
<ul>
<li><strong>"We can sub-divide a programming project in different ways."</strong> Lời thừa nhận thẳng thắn. Với bài tổng ước, bạn có thể thiết kế {nhập, tính, xuất}, hoặc {nhập, tính-và-in}, hoặc {làm-tất}. Cả ba đều chạy. Chúng không tốt ngang nhau.</li>
<li><strong>"Select our modules so that each one focuses on a narrower aspect of the project."</strong> Tiêu chí thứ nhất: <em>hẹp hơn</em>. Mỗi module phải phủ ít hơn cả bài toán, và ít hơn kẻ gọi nó. Nếu một module rộng bằng cả chương trình thì nó chẳng đem lại gì.</li>
<li><strong>"Our objective is to define a set of modules that simplifies the complexity of the original problem."</strong> Mục tiêu được phát biểu như một kết quả đo được, không phải như một luật. Sau mỗi lần cắt hãy tự hỏi: bài toán giờ có dễ nghĩ hơn không? Nếu không thì huỷ nhát cắt đó.</li>
<li><strong>Cắt nhỏ CÓ THỂ làm mọi thứ tệ hơn</strong> — đây là chỗ sinh viên hay bỏ sót. Xẻ một hàm 12 dòng rõ ràng thành bốn hàm 3 dòng buộc phải gọi đúng thứ tự và cùng dùng chung trạng thái là một thiết kế <em>tệ hơn</em>, không phải tốt hơn, vì độ phức tạp đã dời từ bên trong module ra giữa các module.</li>
<li><strong>"Focuses on" lại chính là phép thử động từ</strong> — một module có tiêu điểm thì tiêu điểm đó gọi tên được. Nếu gọi tên nó phải mất một đoạn văn thì nó không có tiêu điểm.</li>
<li><strong>Nối về phía trước</strong> — slide 14 biến ba câu mềm này thành sáu phát biểu kiểm được, và slide 16–20 biến chúng thành các hạng mục có tên. Từ trừu tượng đi xuống chính xác, từng slide một.</li>
</ul>
<pre><code>/* ba cách phân rã hợp lệ cho cùng bài toán -- chỉ một cái tốt */
/* A */ void lamTatCa(void);                              /* chẳng được gì      */
/* B */ int  nhapVaTinh(void);   void inKetQua(int s);    /* nhập lẫn vào B1    */
/* C */ int  nhapSo(void);  int tongUoc(int x);  void inUoc(int x);   /* tốt   */</code></pre>
<p class="dap-an">✅ Chấm ba phương án bằng đúng tiêu chí của slide ("each one focuses on a narrower aspect"): <strong>A</strong> có một module rộng bằng cả bài toán — không thu hẹp gì, nên trượt. <strong>B</strong> có <code>nhapVaTinh</code> phủ hai khía cạnh (tên nó phải dùng chữ "và") — trượt một nửa. <strong>C</strong> cho ba module, mỗi cái hẹp hơn hẳn chương trình và mỗi cái gọi tên được bằng một động từ — đạt. C chính là thiết kế mà slide 21–24 sẽ dựng thật.</p>
<p class="meo">💡 Một luật dừng dùng được cho câu "chia nhỏ tới đâu?": dừng khi tên mọi module đều là một cụm động từ duy nhất, và bạn thấy thoải mái giao bất kỳ module nào trong đó cho bạn cùng lớp mà không cần giải thích thêm.</p>`],

      [14, 'Modules Design Principles (cont.) — the six checkable rules',
        `<p class="y-chinh">🎯 Three "general guidelines" plus three "for a structured design, we stipulate that" rules. The second group is the stricter one, and it is where cohesion and coupling are named for the first time.</p>
<ul>
<li><strong>Guideline 1: "The module is easy to upgrade"</strong> — can you change how it works without touching anything else? If changing <code>tongUoc</code> from a loop to a formula forces edits in <code>main</code>, the boundary is wrong.</li>
<li><strong>Guideline 2: "The module contains a readable amount of code"</strong> — deliberately vague, because the real limit is human, not numeric. A common working rule: it fits on one screen.</li>
<li><strong>Guideline 3: "The module may be used as part of the solution to some other problem"</strong> — the reuse test. <code>tongUoc(int x)</code> passes: any program needing a divisor sum can take it. A version that reads a global <code>n</code> and prints a Vietnamese label fails.</li>
<li><strong>Stipulation 1: "Each module has one entry point and one exit point"</strong> — you enter through the function header and leave through one <code>return</code>. C lets you write several <code>return</code>s; structured design asks you to prefer one, so a reader knows exactly where control leaves.</li>
<li><strong>Stipulation 2: "Each module is highly cohesive"</strong> — defined on slide 16, graded on slides 17–18.</li>
<li><strong>Stipulation 3: "Each module exhibits low coupling"</strong> — defined on slide 19, classified on slide 20. Together with 2, this is the sentence the whole lesson is built around.</li>
</ul>
<pre><code>/* stipulation 1, both ways, same behaviour */
int loaiDiem_nhieuLoiRa(int d) {              /* several exits */
    if (d &lt; 0 || d &gt; 10) return -1;
    if (d &gt;= 8) return 3;
    if (d &gt;= 5) return 2;
    return 1;
}
int loaiDiem_motLoiRa(int d) {                /* ONE exit      */
    int kq;
    if (d &lt; 0 || d &gt; 10) kq = -1;
    else if (d &gt;= 8)     kq = 3;
    else if (d &gt;= 5)     kq = 2;
    else                 kq = 1;
    return kq;
}</code></pre>
<p class="dap-an">✅ Both compiled and run over d = -1, 2, 5, 8, 11. They agree everywhere: <strong>-1 → -1 · 2 → 1 · 5 → 2 · 8 → 3 · 11 → -1</strong>. So "one exit point" is a <em>readability</em> stipulation, not a correctness one — the two functions are behaviourally identical, and the second one has a single place to put a debug print or a cleanup step.</p>
<p class="pitfall">⚠️ Do not read stipulation 1 as "one <code>return</code> is always better". In deeply nested validation code, early <code>return</code>s often read better than a pyramid of <code>else</code>s. Know the rule, know why it exists (a single exit is a single place for cleanup), and apply judgement — but on a PRF192 exam, answer with the deck's rule.</p>`,
        `<p class="y-chinh">🎯 Ba "general guidelines" cộng ba luật "for a structured design, we stipulate that". Nhóm thứ hai chặt hơn, và đó là chỗ cohesion cùng coupling được gọi tên lần đầu.</p>
<ul>
<li><strong>Hướng dẫn 1: "The module is easy to upgrade"</strong> — bạn có đổi được cách nó làm việc mà không đụng gì khác không? Nếu đổi <code>tongUoc</code> từ vòng lặp sang công thức mà buộc phải sửa <code>main</code>, thì ranh giới đã đặt sai.</li>
<li><strong>Hướng dẫn 2: "The module contains a readable amount of code"</strong> — cố tình mơ hồ, vì giới hạn thật là ở con người chứ không phải con số. Một luật thực dụng hay dùng: vừa một màn hình.</li>
<li><strong>Hướng dẫn 3: "The module may be used as part of the solution to some other problem"</strong> — phép thử tái sử dụng. <code>tongUoc(int x)</code> đạt: chương trình nào cần tổng ước đều lấy được. Một bản đọc biến toàn cục <code>n</code> rồi in kèm nhãn tiếng Việt thì trượt.</li>
<li><strong>Quy định 1: "Each module has one entry point and one exit point"</strong> — vào qua phần đầu hàm, ra qua MỘT câu <code>return</code>. C cho phép viết nhiều <code>return</code>; thiết kế có cấu trúc khuyên dùng một, để người đọc biết chính xác điều khiển rời đi ở đâu.</li>
<li><strong>Quy định 2: "Each module is highly cohesive"</strong> — định nghĩa ở slide 16, xếp hạng ở slide 17–18.</li>
<li><strong>Quy định 3: "Each module exhibits low coupling"</strong> — định nghĩa ở slide 19, phân loại ở slide 20. Cùng với quy định 2, đây là câu mà cả bài học được dựng quanh nó.</li>
</ul>
<pre><code>/* quy định 1, viết cả hai kiểu, cùng hành vi */
int loaiDiem_nhieuLoiRa(int d) {              /* nhiều lối ra */
    if (d &lt; 0 || d &gt; 10) return -1;
    if (d &gt;= 8) return 3;
    if (d &gt;= 5) return 2;
    return 1;
}
int loaiDiem_motLoiRa(int d) {                /* MỘT lối ra   */
    int kq;
    if (d &lt; 0 || d &gt; 10) kq = -1;
    else if (d &gt;= 8)     kq = 3;
    else if (d &gt;= 5)     kq = 2;
    else                 kq = 1;
    return kq;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch và chạy cả hai với d = -1, 2, 5, 8, 11. Chúng khớp nhau ở mọi giá trị: <strong>-1 → -1 · 2 → 1 · 5 → 2 · 8 → 3 · 11 → -1</strong>. Vậy "một lối ra" là quy định về tính <em>đọc được</em>, không phải về tính đúng — hai hàm có hành vi y hệt, và bản thứ hai có đúng một chỗ để đặt câu in gỡ lỗi hay bước dọn dẹp.</p>
<p class="pitfall">⚠️ Đừng hiểu quy định 1 thành "một <code>return</code> luôn tốt hơn". Trong code kiểm tra dữ liệu lồng sâu, <code>return</code> sớm thường dễ đọc hơn một kim tự tháp <code>else</code>. Hãy biết luật, biết vì sao có luật (một lối ra là một chỗ dọn dẹp), rồi dùng phán đoán — nhưng trong bài thi PRF192 thì trả lời theo luật của bộ slide.</p>`],

      [15, 'Module Identifying — the negative example (lowly cohesive + high coupling)',
        `<p class="y-chinh">🎯 One diagram carrying both diseases at once, with the deck's own verdicts printed next to it: "Lowly cohesive" and "High coupling".</p>
<ul>
<li><strong>What the diagram shows</strong> — a global <code>int n;</code> declared outside every function, then two modules ("Module for summing divisors of n" and "Module for printing out divisors of n"), each of which internally does <code>{ accept n; ... }</code>, and a <code>main()</code> that just does <code>{ access n }</code>.</li>
<li><strong>Verdict 1 — "Lowly cohesive"</strong>, with the reason: <em>"An input operation in a processing module is not encouraged."</em> The summing module both reads input and computes. Two jobs, one box.</li>
<li><strong>The rule under it</strong> — <em>"All the code in a module focus to the purpose of the module."</em> If the module's purpose is "sum divisors", a <code>scanf</code> line does not serve that purpose and does not belong.</li>
<li><strong>Verdict 2 — "High coupling"</strong>, with the reason: <em>"Some modules access a common data is not encouraged."</em> Both modules read the same global <code>n</code>. That is exactly <em>common coupling</em>, the second-worst class on slide 20.</li>
<li><strong>The rule under it</strong> — <em>"All modules should be self-contained (independent)."</em> Self-contained means: everything it needs arrives through its parameters.</li>
<li><strong>Why the two faults travel together</strong> — once input lives inside the processing module, the value has nowhere to go except a global, and the moment it is a global, every other module is coupled to it. Fixing cohesion usually fixes coupling for free.</li>
</ul>
<pre><code>/* the slide's design, made runnable */
int n;                              /* common data -- the problem */
int sumXau(void) {
    int i, s = 0;
    scanf("%d", &amp;n);                /* input INSIDE a computing module */
    for (i = 1; i &lt;= n; i++) if (n % i == 0) s += i;
    return s;
}
/* the fix: one verb per module, data through parameters */
int nhapSo(void) { int x; scanf("%d", &amp;x); return x; }
int tongUoc(int x) { int i, s = 0; for (i = 1; i &lt;= x; i++) if (x % i == 0) s += i; return s; }</code></pre>
<p class="dap-an">✅ Both versions compiled and run (with the <code>scanf</code> replaced by a fixed 12 so the run is reproducible): <code>sumXau()</code> → <strong>28</strong>, and <code>tongUoc(nhapSo())</code> → <strong>28</strong>. Same answer — so the slide's complaint is <em>not</em> that the bad version computes wrongly. The difference shows on the second call: <code>tongUoc(18)</code> → <strong>39</strong> works instantly, while <code>sumXau()</code> cannot be asked about 18 at all without typing a new number in at the keyboard.</p>
<p class="pitfall">⚠️ This is the single most common beginner design, and it always looks fine in the lab because the program runs. The damage only appears when someone asks you to reuse it, test it automatically, or call it twice with different data — and then it is a rewrite, not a tweak.</p>`,
        `<p class="y-chinh">🎯 Một sơ đồ mang cả hai căn bệnh cùng lúc, với chính lời phán của bộ slide in ngay bên cạnh: "Lowly cohesive" và "High coupling".</p>
<ul>
<li><strong>Sơ đồ vẽ gì</strong> — một biến toàn cục <code>int n;</code> khai báo ngoài mọi hàm, rồi hai module ("Module for summing divisors of n" và "Module for printing out divisors of n"), mỗi cái bên trong đều làm <code>{ accept n; ... }</code>, còn <code>main()</code> thì chỉ <code>{ access n }</code>.</li>
<li><strong>Phán quyết 1 — "Lowly cohesive"</strong>, kèm lý do: <em>"An input operation in a processing module is not encouraged."</em> Module tính tổng vừa đọc dữ liệu vào vừa tính. Hai việc, một hộp.</li>
<li><strong>Luật đi kèm</strong> — <em>"All the code in a module focus to the purpose of the module."</em> Nếu mục đích của module là "tính tổng ước" thì dòng <code>scanf</code> không phục vụ mục đích đó và không thuộc về đó.</li>
<li><strong>Phán quyết 2 — "High coupling"</strong>, kèm lý do: <em>"Some modules access a common data is not encouraged."</em> Cả hai module cùng đọc biến toàn cục <code>n</code>. Đó đúng là <em>common coupling</em>, hạng tệ thứ nhì trên slide 20.</li>
<li><strong>Luật đi kèm</strong> — <em>"All modules should be self-contained (independent)."</em> Tự chứa nghĩa là: mọi thứ nó cần đều đi vào qua tham số của nó.</li>
<li><strong>Vì sao hai lỗi luôn đi cùng nhau</strong> — khi việc nhập đã nằm trong module xử lý thì giá trị chẳng biết đi đâu ngoài một biến toàn cục, và khoảnh khắc nó thành biến toàn cục thì mọi module khác đều bị ghép nối vào nó. Sửa cohesion thường sửa luôn coupling miễn phí.</li>
</ul>
<pre><code>/* thiết kế trên slide, viết thành code chạy được */
int n;                              /* dữ liệu chung -- chính là vấn đề */
int sumXau(void) {
    int i, s = 0;
    scanf("%d", &amp;n);                /* việc NHẬP nằm TRONG module tính toán */
    for (i = 1; i &lt;= n; i++) if (n % i == 0) s += i;
    return s;
}
/* bản sửa: mỗi module một động từ, dữ liệu đi qua tham số */
int nhapSo(void) { int x; scanf("%d", &amp;x); return x; }
int tongUoc(int x) { int i, s = 0; for (i = 1; i &lt;= x; i++) if (x % i == 0) s += i; return s; }</code></pre>
<p class="dap-an">✅ Đã biên dịch và chạy cả hai bản (thay <code>scanf</code> bằng số 12 cố định cho kết quả lặp lại được): <code>sumXau()</code> → <strong>28</strong>, và <code>tongUoc(nhapSo())</code> → <strong>28</strong>. Cùng đáp số — nên lời chê của slide KHÔNG phải là bản xấu tính sai. Khác biệt lộ ra ở lời gọi thứ hai: <code>tongUoc(18)</code> → <strong>39</strong> chạy ngay, còn <code>sumXau()</code> thì không cách nào hỏi nó về số 18 nếu không gõ lại một con số từ bàn phím.</p>
<p class="pitfall">⚠️ Đây là thiết kế phổ biến nhất của người mới, và trong phòng lab nó luôn trông ổn vì chương trình chạy được. Thiệt hại chỉ hiện ra khi có người bảo bạn tái dùng nó, kiểm thử tự động nó, hoặc gọi nó hai lần với dữ liệu khác nhau — và lúc đó là viết lại, không phải chỉnh sửa.</p>`],

      [16, 'Module identifying — Cohesion (the definition and the verb test)',
        `<p class="y-chinh">🎯 "Cohesion is a measure of the focus within a module." One module, one purpose — and a practical test for spotting it: if you still need a verb to describe a task, that task is a module.</p>
<ul>
<li><strong>The two poles, stated on the slide</strong> — "A module performs a single task → highly cohesive." "A module performs a collection of unrelated tasks → low cohesion." Cohesion is a spectrum, and slides 17–18 name six points on it.</li>
<li><strong>The design question the slide gives you</strong> — "In designing a cohesive module, we ask whether a certain task belongs". Include it if "it is related to the other tasks in some particular manner"; exclude it if "it is unrelated to the other tasks".</li>
<li><strong>Note the phrase "in some particular manner"</strong> — vague on purpose, and slide 18 makes it precise: related by shared data (communicational), by feeding each other (sequential), or by being literally the same job (functional).</li>
<li><strong>The identification rule, quoted</strong> — "How to identify modules? If you still use a verb to describe a task then a module is identified." A verb is one action. Two verbs means two modules.</li>
<li><strong>How to apply the verb test in practice</strong> — describe your function in one sentence. Count the verbs. "Read n <em>and</em> compute its divisor sum" has two → split. "Compute the divisor sum of x" has one → keep.</li>
<li><strong>Why cohesion is judged from the inside</strong> — you never need to look at any other module to measure it. Open the function, read its statements, ask whether each one serves the name on the door.</li>
</ul>
<pre><code>/* FUNCTIONAL cohesion -- one verb, one job, nothing else in the box */
double tinhDienTich(double r) {
    return 3.14159265358979 * r * r;
}
/* the SAME job written non-cohesively: computing + printing + a greeting */
void tinhVaIn(double r) {
    printf("Xin chao\\n");
    printf("%f\\n", 3.14159265358979 * r * r);
}</code></pre>
<p class="dap-an">✅ Compiled and run: <code>tinhDienTich(2.0)</code> → <strong>12.566371</strong> and <code>tinhDienTich(1.5)</code> → <strong>7.068583</strong>. Apply the verb test to each version: "compute the area of a circle of radius r" — one verb, so <code>tinhDienTich</code> is a module. "Greet the user <em>and</em> compute <em>and</em> print" — three verbs, so <code>tinhVaIn</code> is three modules wearing one name. And only the first can be used in a sum: <code>tinhDienTich(2.0) + tinhDienTich(1.5)</code> = <strong>19.634954</strong>, which the second version cannot express at all, because it returns nothing.</p>
<p class="meo">💡 The verb test doubles as a naming test. If you cannot name a function without using "and", "then", "also", or a number (<code>xuLy2</code>), you have found a cohesion problem before writing a single line of its body.</p>`,
        `<p class="y-chinh">🎯 "Cohesion is a measure of the focus within a module" — cohesion đo mức tập trung BÊN TRONG một module. Một module, một mục đích — và có một phép thử thực dụng để nhận ra nó: nếu bạn vẫn còn phải dùng một động từ để mô tả một việc, thì việc đó là một module.</p>
<ul>
<li><strong>Hai cực, nguyên văn trên slide</strong> — "A module performs a single task → highly cohesive." "A module performs a collection of unrelated tasks → low cohesion." Cohesion là một dải liên tục, và slide 17–18 đặt tên cho sáu điểm trên dải đó.</li>
<li><strong>Câu hỏi thiết kế slide trao cho bạn</strong> — "In designing a cohesive module, we ask whether a certain task belongs" (việc này có thuộc về đây không). Giữ lại nếu "it is related to the other tasks in some particular manner"; loại ra nếu "it is unrelated to the other tasks".</li>
<li><strong>Chú ý cụm "in some particular manner"</strong> — cố ý mơ hồ, và slide 18 làm nó chính xác: liên quan qua dữ liệu dùng chung (communicational), qua việc cái này nuôi cái kia (sequential), hoặc do đúng là cùng một việc (functional).</li>
<li><strong>Quy tắc nhận diện, trích nguyên</strong> — "How to identify modules? If you still use a verb to describe a task then a module is identified." Một động từ là một hành động. Hai động từ nghĩa là hai module.</li>
<li><strong>Áp phép thử động từ thế nào trong thực tế</strong> — mô tả hàm của bạn bằng một câu. Đếm số động từ. "Đọc n <em>và</em> tính tổng ước của nó" có hai → tách. "Tính tổng ước của x" có một → giữ nguyên.</li>
<li><strong>Vì sao cohesion được chấm từ bên trong</strong> — bạn không cần nhìn module nào khác để đo nó. Mở hàm ra, đọc từng câu lệnh, hỏi xem mỗi câu có phục vụ cái tên ghi ngoài cửa không.</li>
</ul>
<pre><code>/* cohesion FUNCTIONAL -- một động từ, một việc, trong hộp không còn gì khác */
double tinhDienTich(double r) {
    return 3.14159265358979 * r * r;
}
/* CÙNG việc đó viết mất kết dính: tính + in + chào hỏi */
void tinhVaIn(double r) {
    printf("Xin chao\\n");
    printf("%f\\n", 3.14159265358979 * r * r);
}</code></pre>
<p class="dap-an">✅ Đã biên dịch và chạy: <code>tinhDienTich(2.0)</code> → <strong>12.566371</strong> và <code>tinhDienTich(1.5)</code> → <strong>7.068583</strong>. Áp phép thử động từ cho từng bản: "tính diện tích hình tròn bán kính r" — một động từ, vậy <code>tinhDienTich</code> là một module. "Chào người dùng <em>và</em> tính <em>và</em> in" — ba động từ, vậy <code>tinhVaIn</code> là ba module đội chung một cái tên. Và chỉ bản đầu dùng được trong một phép cộng: <code>tinhDienTich(2.0) + tinhDienTich(1.5)</code> = <strong>19.634954</strong>, điều mà bản thứ hai không diễn đạt nổi, vì nó chẳng trả về gì.</p>
<p class="meo">💡 Phép thử động từ kiêm luôn phép thử đặt tên. Nếu bạn không đặt được tên hàm mà không dùng chữ "và", "rồi", "kiêm", hay một con số (<code>xuLy2</code>), thì bạn đã tìm ra một vấn đề cohesion trước cả khi viết dòng đầu tiên của thân hàm.</p>`],

      [17, 'Degrees of cohesion — the LOW three (coincidental, logical, temporal)',
        `<p class="y-chinh">🎯 "Low cohesion → generally unacceptable." Three named degrees, worst first, each with the deck's own fix printed beside it.</p>
<ul>
<li><strong>Coincidental — "unrelated tasks"</strong>, the worst. The statements are in the same function for no reason at all; somebody needed somewhere to put them. Fix on the slide: <em>"This module is not enough small → Separate smaller tasks in this task."</em></li>
<li><strong>Logical — "contains some related tasks of which only one is performed"</strong>. The tasks are related in kind, but a flag or a <code>switch</code> selects exactly one per call. Fix on the slide: <em>"Separate them into separate smaller module, each smaller module for a choice."</em></li>
<li><strong>Why logical cohesion is a trap</strong> — it looks tidy, and it drags in control coupling (slide 20): the caller must pass a magic number telling the module which branch to take. Two faults from one design.</li>
<li><strong>Temporal — "multiple logically unrelated tasks that are only temporally related"</strong>. Grouped only because they all happen at the same moment — the classic <code>khoiTao()</code> that zeroes a score, opens a file and seeds the random generator. Fix on the slide: <em>"Separate them into separate smaller module although they are temporal."</em></li>
<li><strong>The deck's own worked case</strong> — "One module for two tasks: Sum divisors of the integer n / Print out divisors of the integer n", with the damning consequence: <em>"In the case of the operation for summing of n is not used, this module can not be applied."</em></li>
<li><strong>Read that consequence carefully</strong> — the cost of low cohesion is stated as an inability to <em>reuse</em>. If you only want to print the divisors, you must also pay for a sum you do not want. That is the mechanism by which low cohesion wastes your time later.</li>
</ul>
<pre><code>/* COINCIDENTAL: three tasks with nothing in common */
void doStuff(int n) {
    printf("Hello\\n");                 /* greet  */
    printf("%d\\n", n * n);             /* square */
    printf("today is Monday\\n");       /* date   */
}
/* LOGICAL: one box, a flag picks exactly one branch per call */
void xuLy(int choice, int n) {
    switch (choice) {
        case 1: printf("sum=%d\\n", n + n); break;
        case 2: printf("sqr=%d\\n", n * n); break;
        case 3: printf("dbl=%d\\n", 2 * n); break;
    }
}
/* TEMPORAL: unrelated jobs bundled because they happen at the same instant */
int diem; double tien;
void khoiTao(void) { diem = 0; tien = 0.0; printf("init done\\n"); }</code></pre>
<p class="dap-an">✅ All three compiled and run. <code>doStuff(5)</code> prints <strong>Hello / 25 / today is Monday</strong> — three outputs, no relationship, so the verb test gives three verbs and the answer is <strong>coincidental</strong>. <code>xuLy(2, 7)</code> prints only <strong>sqr=49</strong>: two of the three branches did nothing at all, which is the signature of <strong>logical</strong> cohesion. <code>khoiTao()</code> prints <strong>init done</strong> and touches two unrelated globals — <strong>temporal</strong>.</p>
<p class="pitfall">⚠️ How to tell logical from coincidental in an exam: look for the <em>selector parameter</em>. If a flag, code or <code>switch</code> chooses which task runs, it is logical. If everything runs every time and the tasks still have nothing to do with each other, it is coincidental.</p>`,
        `<p class="y-chinh">🎯 "Low cohesion → generally unacceptable" — kết dính thấp, nhìn chung không chấp nhận được. Ba mức có tên, tệ nhất trước, mỗi mức kèm cách sửa in ngay bên cạnh của chính bộ slide.</p>
<ul>
<li><strong>Coincidental (ngẫu nhiên) — "unrelated tasks"</strong>, tệ nhất. Các câu lệnh nằm chung một hàm mà chẳng vì lý do gì; có người cần một chỗ để nhét chúng vào. Cách sửa trên slide: <em>"This module is not enough small → Separate smaller tasks in this task."</em></li>
<li><strong>Logical (theo lô-gic) — "contains some related tasks of which only one is performed"</strong>. Các việc có họ hàng về bản chất, nhưng một lá cờ hay một <code>switch</code> chọn đúng một việc cho mỗi lời gọi. Cách sửa trên slide: <em>"Separate them into separate smaller module, each smaller module for a choice."</em></li>
<li><strong>Vì sao cohesion logical là cái bẫy</strong> — nó trông gọn gàng, và nó kéo theo control coupling (slide 20): người gọi phải truyền một con số thần bí để bảo module rẽ nhánh nào. Một thiết kế đẻ ra hai lỗi.</li>
<li><strong>Temporal (theo thời điểm) — "multiple logically unrelated tasks that are only temporally related"</strong>. Gom lại chỉ vì chúng cùng xảy ra tại một thời điểm — kinh điển là hàm <code>khoiTao()</code> vừa xoá điểm, vừa mở file, vừa gieo hạt số ngẫu nhiên. Cách sửa trên slide: <em>"Separate them into separate smaller module although they are temporal."</em></li>
<li><strong>Ca cụ thể mà chính bộ slide nêu</strong> — "One module for two tasks: Sum divisors of the integer n / Print out divisors of the integer n", kèm hậu quả đanh thép: <em>"In the case of the operation for summing of n is not used, this module can not be applied."</em></li>
<li><strong>Đọc kỹ cái hậu quả đó</strong> — cái giá của cohesion thấp được phát biểu thành sự BẤT LỰC trong tái sử dụng. Nếu bạn chỉ muốn in các ước, bạn vẫn phải trả tiền cho một phép tổng mình không cần. Đó chính là cơ chế mà cohesion thấp dùng để ăn mòn thời gian của bạn về sau.</li>
</ul>
<pre><code>/* COINCIDENTAL: ba việc chẳng liên quan gì nhau */
void doStuff(int n) {
    printf("Hello\\n");                 /* chào   */
    printf("%d\\n", n * n);             /* bình phương */
    printf("today is Monday\\n");       /* ngày   */
}
/* LOGICAL: một hộp, một lá cờ chọn đúng một nhánh mỗi lời gọi */
void xuLy(int choice, int n) {
    switch (choice) {
        case 1: printf("sum=%d\\n", n + n); break;
        case 2: printf("sqr=%d\\n", n * n); break;
        case 3: printf("dbl=%d\\n", 2 * n); break;
    }
}
/* TEMPORAL: những việc không liên quan bị buộc chung vì cùng xảy ra một lúc */
int diem; double tien;
void khoiTao(void) { diem = 0; tien = 0.0; printf("init done\\n"); }</code></pre>
<p class="dap-an">✅ Cả ba đã biên dịch và chạy. <code>doStuff(5)</code> in ra <strong>Hello / 25 / today is Monday</strong> — ba kết quả, không quan hệ gì, nên phép thử động từ cho ba động từ và đáp án là <strong>coincidental</strong>. <code>xuLy(2, 7)</code> chỉ in <strong>sqr=49</strong>: hai trong ba nhánh hoàn toàn không chạy, đó là dấu hiệu của cohesion <strong>logical</strong>. <code>khoiTao()</code> in <strong>init done</strong> và đụng vào hai biến toàn cục không liên quan — <strong>temporal</strong>.</p>
<p class="pitfall">⚠️ Cách phân biệt logical với coincidental trong phòng thi: tìm cái <em>tham số chọn nhánh</em>. Nếu có một lá cờ, một mã, hay một <code>switch</code> quyết định việc nào chạy thì đó là logical. Nếu mọi thứ đều chạy mỗi lần mà các việc vẫn chẳng dính dáng gì nhau thì đó là coincidental.</p>`],

      [18, 'Degrees of cohesion — the HIGH three (communicational, sequential, functional)',
        `<p class="y-chinh">🎯 "High cohesion — generally acceptable." Three degrees again, weakest first, with functional at the top as the target.</p>
<ul>
<li><strong>Communicational — "the tasks share the same data"</strong>, and crucially <em>"All tasks are carried out each time."</em> That last clause is what separates it from logical cohesion: nothing is selected, everything runs.</li>
<li><strong>The deck's licence note</strong> — <em>"Some modules share the common data can be accepted if they perform their tasks sequentially."</em> Sharing data is not automatically a sin; it is acceptable when the sharing is ordered and contained inside one module.</li>
<li><strong>Sequential — "multiple tasks in a sequentially dependent relationship"</strong>, explained as <em>"Output of one task serves as input to another task — the module identifier suggests an assembly line."</em> A pipeline: read → clean → compute.</li>
<li><strong>How to spot sequential cohesion</strong> — the name contains an arrow in disguise: <code>docVaChuanHoa</code>, <code>parseAndValidate</code>. Acceptable, but each stage is usually still worth its own function so the stages can be tested separately.</li>
<li><strong>Functional — "performs a single specific task"</strong>, the top of the scale, recognised by: <em>"The module identifier suggests a precise verb phrase."</em> <code>tinhDienTich</code>, <code>tongUoc</code>, <code>kiemTraNguyenTo</code>.</li>
<li><strong>The whole ladder, in order</strong> — coincidental &lt; logical &lt; temporal &lt; communicational &lt; sequential &lt; functional. Six rungs; know the order, because "which is higher" is a standard exam question.</li>
</ul>
<pre><code>/* COMMUNICATIONAL: two computations over the SAME n, both run every call */
void thongKe(int n) {
    int i, s = 0, d = 0;
    for (i = 1; i &lt;= n; i++) if (n % i == 0) { s += i; d++; }
    printf("sum=%d count=%d\\n", s, d);
}
/* SEQUENTIAL: the output of each stage is the input of the next */
int docSo(void)       { return 12; }
int binhPhuong(int x) { return x * x; }
int chiaDoi(int x)    { return x / 2; }
/* FUNCTIONAL: one precise verb phrase, nothing else */
double tinhDienTich(double r) { return 3.14159265358979 * r * r; }</code></pre>
<p class="dap-an">✅ Compiled and run. <code>thongKe(12)</code> prints <strong>sum=28 count=6</strong> — the divisors of 12 are 1, 2, 3, 4, 6, 12, so six of them summing to 28; both results come from one pass over the same data, which is exactly <strong>communicational</strong>. The pipeline <code>chiaDoi(binhPhuong(docSo()))</code> gives 12 → 144 → <strong>72</strong>, an assembly line, so <strong>sequential</strong>. And <code>tinhDienTich(2.0)</code> → <strong>12.566371</strong>, one verb phrase, so <strong>functional</strong>.</p>
<p class="meo">💡 A fast way to place any function on the six-rung ladder: ask two questions in order. (1) Does everything run every call? No → it is logical. (2) Is there one result, described by one verb? Yes → functional. Otherwise you are somewhere in the middle, and the tie-breaker is whether the tasks merely share data (communicational) or feed each other (sequential).</p>`,
        `<p class="y-chinh">🎯 "High cohesion — generally acceptable" — kết dính cao, nhìn chung chấp nhận được. Lại ba mức, yếu nhất trước, với functional ở đỉnh làm cái đích.</p>
<ul>
<li><strong>Communicational (qua dữ liệu chung) — "the tasks share the same data"</strong>, và quan trọng là <em>"All tasks are carried out each time."</em> Chính mệnh đề cuối tách nó khỏi cohesion logical: không có gì bị chọn cả, mọi việc đều chạy.</li>
<li><strong>Lời cho phép của bộ slide</strong> — <em>"Some modules share the common data can be accepted if they perform their tasks sequentially."</em> Dùng chung dữ liệu không mặc nhiên là tội; nó chấp nhận được khi việc dùng chung có thứ tự và nằm gọn trong một module.</li>
<li><strong>Sequential (tuần tự) — "multiple tasks in a sequentially dependent relationship"</strong>, giải thích là <em>"Output of one task serves as input to another task — the module identifier suggests an assembly line."</em> Một dây chuyền: đọc → làm sạch → tính.</li>
<li><strong>Cách nhận ra cohesion sequential</strong> — cái tên chứa một mũi tên trá hình: <code>docVaChuanHoa</code>, <code>parseAndValidate</code>. Chấp nhận được, nhưng thường mỗi chặng vẫn xứng đáng có hàm riêng để kiểm thử từng chặng.</li>
<li><strong>Functional (theo chức năng) — "performs a single specific task"</strong>, đỉnh của thang, nhận ra bằng: <em>"The module identifier suggests a precise verb phrase."</em> <code>tinhDienTich</code>, <code>tongUoc</code>, <code>kiemTraNguyenTo</code>.</li>
<li><strong>Cả cái thang, đúng thứ tự</strong> — coincidental &lt; logical &lt; temporal &lt; communicational &lt; sequential &lt; functional. Sáu bậc; phải thuộc thứ tự, vì "cái nào cao hơn" là câu hỏi thi tiêu chuẩn.</li>
</ul>
<pre><code>/* COMMUNICATIONAL: hai phép tính trên CÙNG n, cả hai chạy mỗi lời gọi */
void thongKe(int n) {
    int i, s = 0, d = 0;
    for (i = 1; i &lt;= n; i++) if (n % i == 0) { s += i; d++; }
    printf("sum=%d count=%d\\n", s, d);
}
/* SEQUENTIAL: đầu ra của chặng này là đầu vào của chặng kia */
int docSo(void)       { return 12; }
int binhPhuong(int x) { return x * x; }
int chiaDoi(int x)    { return x / 2; }
/* FUNCTIONAL: một cụm động từ chính xác, không gì khác */
double tinhDienTich(double r) { return 3.14159265358979 * r * r; }</code></pre>
<p class="dap-an">✅ Đã biên dịch và chạy. <code>thongKe(12)</code> in <strong>sum=28 count=6</strong> — các ước của 12 là 1, 2, 3, 4, 6, 12, vậy sáu ước và tổng 28; cả hai kết quả ra từ một lượt duyệt trên cùng dữ liệu, đúng là <strong>communicational</strong>. Dây chuyền <code>chiaDoi(binhPhuong(docSo()))</code> cho 12 → 144 → <strong>72</strong>, một dây chuyền lắp ráp, nên là <strong>sequential</strong>. Còn <code>tinhDienTich(2.0)</code> → <strong>12.566371</strong>, một cụm động từ, nên là <strong>functional</strong>.</p>
<p class="meo">💡 Cách xếp nhanh một hàm bất kỳ vào thang sáu bậc: hỏi hai câu theo thứ tự. (1) Mọi thứ có chạy ở mọi lời gọi không? Không → là logical. (2) Có đúng một kết quả, mô tả được bằng một động từ không? Có → functional. Còn lại thì bạn đang ở khoảng giữa, và tiêu chí phân định là các việc chỉ dùng chung dữ liệu (communicational) hay nuôi nhau (sequential).</p>`],

      [19, 'Module identifying — High Coupling (the definition)',
        `<p class="y-chinh">🎯 "Coupling is a measure of the degree of interrelatedness of a module to its referring module(s)." Cohesion looked inside one box; coupling looks at the wires between boxes.</p>
<ul>
<li><strong>The slide's headline verdict</strong> — "High Coupling — It's not advisable." Unlike cohesion, where high is good, with coupling <strong>high is bad</strong>. Keep the directions straight: cohesion high, coupling low.</li>
<li><strong>"Referring module(s)"</strong> — the modules that call this one. Coupling is measured along the caller/callee relationship, so it is never a property of one function alone: it is a property of a <em>pair</em>.</li>
<li><strong>The low-coupling test, quoted</strong> — "A module is low in coupling if it performs its tasks on its own." On its own: it needs nothing beyond its parameters, and it leaves nothing behind that another module depends on.</li>
<li><strong>The high-coupling verdict, quoted</strong> — "A module is highly coupled if it shares that performance with some other module including the referring module → It should not be used."</li>
<li><strong>"Sharing the performance"</strong> means the work only completes correctly if some other module has already done, or will later do, part of it — typically by setting a global first.</li>
<li><strong>The design question</strong> — "In designing for low coupling, we ask what kind of data to avoid passing to the module." Notice it is a question about <em>data</em>, which is exactly what slide 20 then classifies into five kinds.</li>
</ul>
<pre><code>/* HIGH coupling: the module needs a global that someone else must set first */
int n;
int sumDivisorsGlobal(void) {
    int i, s = 0;
    for (i = 1; i &lt;= n; i++) if (n % i == 0) s += i;
    return s;
}
/* LOW coupling: everything it needs arrives as a parameter */
int sumDivisors(int x) {
    int i, s = 0;
    for (i = 1; i &lt;= x; i++) if (x % i == 0) s += i;
    return s;
}</code></pre>
<p class="dap-an">✅ Compiled and run, and the difference is visible in the calling code, not in the answers. Globals version: set <code>n = 12</code> then call → <strong>28</strong>; to ask about 18 you must first <em>mutate</em> the shared variable, <code>n = 18</code>, then call → <strong>39</strong>. Parameter version: <code>sumDivisors(12), sumDivisors(18), sumDivisors(28)</code> → <strong>28 39 56</strong> in one line, and <code>sumDivisors(12) + sumDivisors(18)</code> → <strong>67</strong> in one expression. That last line is simply impossible with the global version — you cannot hold two different values of <code>n</code> at the same time.</p>
<p class="pitfall">⚠️ The global version also silently makes the order of statements load-bearing. Forget to set <code>n</code> before calling and you get the <em>previous</em> value, not a compiler error and not a crash — just a wrong number. Low coupling replaces that whole class of bug with "too few arguments to function call", caught at compile time.</p>`,
        `<p class="y-chinh">🎯 "Coupling is a measure of the degree of interrelatedness of a module to its referring module(s)" — coupling đo mức phụ thuộc lẫn nhau giữa một module và (các) module gọi nó. Cohesion nhìn vào bên trong một cái hộp; coupling nhìn vào những sợi dây nối giữa các hộp.</p>
<ul>
<li><strong>Phán quyết đầu đề của slide</strong> — "High Coupling — It's not advisable." Khác với cohesion vốn cao là tốt, với coupling thì <strong>cao là xấu</strong>. Giữ đúng chiều: cohesion cao, coupling thấp.</li>
<li><strong>"Referring module(s)"</strong> — các module gọi tới module này. Coupling được đo dọc theo quan hệ gọi/bị gọi, nên nó không bao giờ là tính chất của riêng một hàm: nó là tính chất của một <em>cặp</em>.</li>
<li><strong>Phép thử ghép nối thấp, trích nguyên</strong> — "A module is low in coupling if it performs its tasks on its own." Tự mình: nó không cần gì ngoài tham số của nó, và nó không để lại gì cho module khác phải phụ thuộc vào.</li>
<li><strong>Phán quyết ghép nối cao, trích nguyên</strong> — "A module is highly coupled if it shares that performance with some other module including the referring module → It should not be used."</li>
<li><strong>"Chia sẻ việc thực hiện"</strong> nghĩa là công việc chỉ hoàn tất đúng nếu một module khác đã làm trước, hoặc sẽ làm sau, một phần của nó — thường là bằng cách gán một biến toàn cục trước.</li>
<li><strong>Câu hỏi thiết kế</strong> — "In designing for low coupling, we ask what kind of data to avoid passing to the module." Để ý đây là câu hỏi về <em>dữ liệu</em>, đúng là thứ mà slide 20 sẽ chia thành năm loại.</li>
</ul>
<pre><code>/* GHÉP NỐI CAO: module cần một biến toàn cục mà người khác phải gán trước */
int n;
int sumDivisorsGlobal(void) {
    int i, s = 0;
    for (i = 1; i &lt;= n; i++) if (n % i == 0) s += i;
    return s;
}
/* GHÉP NỐI THẤP: mọi thứ nó cần đều đi vào qua tham số */
int sumDivisors(int x) {
    int i, s = 0;
    for (i = 1; i &lt;= x; i++) if (x % i == 0) s += i;
    return s;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch và chạy, và khác biệt hiện ra ở PHÍA CODE GỌI, không phải ở đáp số. Bản dùng biến toàn cục: gán <code>n = 12</code> rồi gọi → <strong>28</strong>; muốn hỏi về 18 thì phải <em>sửa</em> biến chung trước, <code>n = 18</code>, rồi gọi → <strong>39</strong>. Bản truyền tham số: <code>sumDivisors(12), sumDivisors(18), sumDivisors(28)</code> → <strong>28 39 56</strong> trong một dòng, và <code>sumDivisors(12) + sumDivisors(18)</code> → <strong>67</strong> trong một biểu thức. Dòng cuối đó đơn giản là KHÔNG thể viết với bản biến toàn cục — bạn không giữ được hai giá trị <code>n</code> khác nhau cùng lúc.</p>
<p class="pitfall">⚠️ Bản dùng biến toàn cục còn âm thầm biến thứ tự câu lệnh thành thứ chịu lực. Quên gán <code>n</code> trước khi gọi thì bạn nhận giá trị <em>lần trước</em>, không có lỗi biên dịch, không sập — chỉ là một con số sai. Ghép nối thấp thay cả lớp lỗi đó bằng "too few arguments to function call", bắt được ngay lúc biên dịch.</p>`],

      [20, 'Coupling classification — five kinds of data, from low to high',
        `<p class="y-chinh">🎯 Five classifications of the data a module depends on, printed with "low" at the top and "high" at the bottom: Data → Control → External → Common → Content.</p>
<ul>
<li><strong>Data (lowest, the goal)</strong> — "used by the module but not to control its execution → Data in/dependant". A plain value arrives as a parameter and is consumed. <code>tongUoc(12)</code>: 12 is data.</li>
<li><strong>Control</strong> — "controls the execution of the module → Control in/dependent". A parameter that does not carry information but chooses a branch. <code>tinh(x, flag)</code>: <code>flag</code> is control. The caller must now know the module's internal branches, which is exactly the dependency you wanted to avoid.</li>
<li><strong>External</strong> — "part of an environment external to the module that controls its execution". Behaviour depends on something outside the program itself: an environment variable, a device, a hardware register, a file format.</li>
<li><strong>Common</strong> — "part of a global set of data". The global-variable case; this is the one slide 15 flagged and the one you will actually commit. Every module touching the global is coupled to every other module touching it.</li>
<li><strong>Content (worst)</strong> — "accesses the internals of another module". One module reaches in and changes another's private state directly, bypassing its interface. Any change to the internals silently breaks the intruder.</li>
<li><strong>Read the list as a ladder to climb down</strong> — when you find content or common coupling, the fix is almost always to push the dependency down the list: turn shared state into a parameter, turn a flag into two separate functions.</li>
</ul>
<pre><code>/* DATA: a value, consumed, not controlling anything      -- lowest, good */
int tongUoc(int x);
/* CONTROL: the second parameter picks a branch           -- higher       */
int tinh(int x, int flag) { if (flag == 0) return tongUoc(x); else return x * x; }
/* COMMON: both modules read the same global              -- higher still */
int n;
/* CONTENT: module B writes A's internal field directly   -- worst        */
struct Counter { int dem; };
void dem_tang(struct Counter *c) { c-&gt;dem++; }      /* A's own interface  */
void B_xau(struct Counter *c)    { c-&gt;dem = 99; }   /* B pokes the field  */</code></pre>
<p class="dap-an">✅ Compiled and run. Control coupling: <code>tinh(12, 0)</code> → <strong>28</strong> but <code>tinh(12, 1)</code> → <strong>144</strong> — the same call site produces two unrelated meanings, and a reader of <code>tinh(12, 1)</code> cannot tell what it does without opening the function. Content coupling: calling <code>dem_tang</code> twice gives <code>dem</code> = <strong>2</strong>, then one call to <code>B_xau</code> makes it <strong>99</strong> — module A's counting rule ("go up by one") was destroyed from outside, and A's own code is still perfectly correct.</p>
<p class="meo">💡 Control coupling has a standard cure worth remembering: replace <code>tinh(x, flag)</code> with two functions, <code>tongUoc(x)</code> and <code>binhPhuong(x)</code>. The <code>if</code> disappears, the magic number disappears, and both new functions are functionally cohesive. One fix improves cohesion and coupling at once.</p>`,
        `<p class="y-chinh">🎯 Năm phân loại dữ liệu mà một module phụ thuộc vào, in kèm chữ "low" ở trên và "high" ở dưới: Data → Control → External → Common → Content.</p>
<ul>
<li><strong>Data (thấp nhất, cái đích)</strong> — "used by the module but not to control its execution → Data in/dependant". Một giá trị thuần tuý đi vào qua tham số và được tiêu thụ. <code>tongUoc(12)</code>: số 12 là data.</li>
<li><strong>Control</strong> — "controls the execution of the module → Control in/dependent". Một tham số không mang thông tin mà chọn nhánh. <code>tinh(x, flag)</code>: <code>flag</code> là control. Người gọi giờ buộc phải biết các nhánh bên trong module, đúng là thứ phụ thuộc mà bạn muốn tránh.</li>
<li><strong>External</strong> — "part of an environment external to the module that controls its execution". Hành vi phụ thuộc vào thứ nằm ngoài chính chương trình: một biến môi trường, một thiết bị, một thanh ghi phần cứng, một định dạng file.</li>
<li><strong>Common</strong> — "part of a global set of data". Chính là ca biến toàn cục; đây là cái slide 15 đã chỉ mặt và cũng là cái bạn sẽ thật sự phạm phải. Mọi module đụng vào biến chung đều bị ghép nối với mọi module khác cũng đụng vào nó.</li>
<li><strong>Content (tệ nhất)</strong> — "accesses the internals of another module". Một module thò tay vào sửa thẳng trạng thái riêng của module khác, đi vòng qua giao diện của nó. Chỉ cần đổi phần ruột là kẻ thò tay vỡ âm thầm.</li>
<li><strong>Đọc danh sách như một cái thang để tụt xuống</strong> — khi phát hiện content hay common coupling, cách sửa gần như luôn là đẩy sự phụ thuộc xuống thấp hơn trong danh sách: biến trạng thái chung thành tham số, biến một lá cờ thành hai hàm riêng.</li>
</ul>
<pre><code>/* DATA: một giá trị, được tiêu thụ, không điều khiển gì   -- thấp nhất, tốt */
int tongUoc(int x);
/* CONTROL: tham số thứ hai chọn nhánh                     -- cao hơn        */
int tinh(int x, int flag) { if (flag == 0) return tongUoc(x); else return x * x; }
/* COMMON: hai module cùng đọc một biến toàn cục           -- cao hơn nữa    */
int n;
/* CONTENT: module B ghi thẳng vào trường riêng của A      -- tệ nhất        */
struct Counter { int dem; };
void dem_tang(struct Counter *c) { c-&gt;dem++; }      /* giao diện của A      */
void B_xau(struct Counter *c)    { c-&gt;dem = 99; }   /* B chọc thẳng vào     */</code></pre>
<p class="dap-an">✅ Đã biên dịch và chạy. Control coupling: <code>tinh(12, 0)</code> → <strong>28</strong> nhưng <code>tinh(12, 1)</code> → <strong>144</strong> — cùng một chỗ gọi mà cho hai nghĩa chẳng liên quan, và người đọc dòng <code>tinh(12, 1)</code> không thể biết nó làm gì nếu không mở hàm ra. Content coupling: gọi <code>dem_tang</code> hai lần cho <code>dem</code> = <strong>2</strong>, rồi một lời gọi <code>B_xau</code> làm nó thành <strong>99</strong> — quy tắc đếm của module A ("tăng từng một") bị phá từ bên ngoài, trong khi code của chính A vẫn hoàn toàn đúng.</p>
<p class="meo">💡 Control coupling có một cách chữa chuẩn đáng nhớ: thay <code>tinh(x, flag)</code> bằng hai hàm, <code>tongUoc(x)</code> và <code>binhPhuong(x)</code>. Câu <code>if</code> biến mất, con số thần bí biến mất, và cả hai hàm mới đều có cohesion functional. Một nhát sửa cải thiện cả cohesion lẫn coupling.</p>`],

      [21, 'Example — High Cohesion & Low Coupling (the module diagram)',
        `<p class="y-chinh">🎯 The same problem as slide 9, now designed properly: a Main Program calling three independent modules — Input Handling, Summing Divisors, Printing Divisors.</p>
<ul>
<li><strong>The problem, unchanged</strong> — "Develop a program that will accept a positive integer then sum of it's divisors is printed out." Same statement as slide 9, so you can compare the two designs directly.</li>
<li><strong>The structure chart</strong> — Main Program sits on top with three children: Module 1 Input Handling, Module 2 Summing Divisors, Module 3 Printing Divisors. Note the shape: one level of nesting, three siblings, <em>no arrows between the siblings</em>.</li>
<li><strong>Read the missing arrows</strong> — that absence <em>is</em> the low coupling. Module 2 does not call Module 1; it receives a number. Module 3 does not know Module 2 exists. All communication goes up through main.</li>
<li><strong>Main as coordinator</strong> — main is the only module that knows the order of operations. That is a deliberate concentration of knowledge: the sequence lives in one place, so changing it means editing one function.</li>
<li><strong>Compare with slide 15</strong> — slide 15 had the same three jobs, but input was buried inside the computing module and the data was a global. Same problem, same jobs, opposite design. The only real difference is <em>where the data travels</em>.</li>
<li><strong>Why three and not two</strong> — printing the divisors and summing them are different verbs producing different outputs (a list on screen versus a number). By slide 16's verb test they are two modules, even though both loop over the same divisors.</li>
</ul>
<pre><code>/* the chart, written as prototypes -- the design before any body exists */
int  getInput(void);          /* Module 1 - Input Handling     */
int  sumOfDivisors(int n);    /* Module 2 - Summing Divisors   */
void printDivisors(int n);    /* Module 3 - Printing Divisors  */
int  main(void);              /* coordinator                   */</code></pre>
<p class="dap-an">✅ Check each module against the two rules before writing a single body. Cohesion: each prototype's name is one verb phrase, so all three are <strong>functionally cohesive</strong>. Coupling: every module takes what it needs as a parameter and returns what it produces, so all three are at the <strong>data</strong> level — the lowest rung of slide 20. The design passes both stipulations of slide 14, and it passes them on paper, before the compiler is ever involved.</p>
<p class="meo">💡 Draw this chart for your own assignments before coding. A chart where arrows criss-cross between siblings is telling you about coupling you have not noticed yet; a box you cannot label with one verb is telling you about cohesion.</p>`,
        `<p class="y-chinh">🎯 Vẫn bài toán của slide 9, giờ được thiết kế cho tử tế: một Main Program gọi ba module độc lập — Input Handling, Summing Divisors, Printing Divisors.</p>
<ul>
<li><strong>Đề bài, không đổi</strong> — "Develop a program that will accept a positive integer then sum of it's divisors is printed out." Cùng phát biểu với slide 9, nên bạn so được hai thiết kế trực tiếp với nhau.</li>
<li><strong>Sơ đồ cấu trúc</strong> — Main Program nằm trên cùng với ba con: Module 1 Input Handling, Module 2 Summing Divisors, Module 3 Printing Divisors. Chú ý hình dạng: một tầng lồng, ba anh em, và <em>không có mũi tên nào giữa các anh em</em>.</li>
<li><strong>Hãy đọc những mũi tên KHÔNG có</strong> — chính sự vắng mặt đó LÀ ghép nối thấp. Module 2 không gọi Module 1; nó nhận một con số. Module 3 không biết Module 2 tồn tại. Mọi liên lạc đều đi ngược lên qua main.</li>
<li><strong>Main đóng vai điều phối</strong> — main là module duy nhất biết thứ tự các bước. Đó là sự tập trung tri thức có chủ ý: trình tự nằm ở một chỗ, nên muốn đổi trình tự chỉ phải sửa một hàm.</li>
<li><strong>So với slide 15</strong> — slide 15 cũng đúng ba việc đó, nhưng việc nhập bị chôn trong module tính toán và dữ liệu là biến toàn cục. Cùng bài toán, cùng các việc, thiết kế ngược nhau. Khác biệt thật sự duy nhất là <em>dữ liệu đi đường nào</em>.</li>
<li><strong>Vì sao ba chứ không phải hai</strong> — in các ước và tính tổng chúng là hai động từ khác nhau cho hai kết quả khác nhau (một danh sách trên màn hình so với một con số). Theo phép thử động từ ở slide 16 thì đó là hai module, dù cả hai đều duyệt trên cùng tập ước.</li>
</ul>
<pre><code>/* sơ đồ, viết thành prototype -- thiết kế trước khi có thân hàm nào */
int  getInput(void);          /* Module 1 - Nhập dữ liệu       */
int  sumOfDivisors(int n);    /* Module 2 - Tính tổng ước      */
void printDivisors(int n);    /* Module 3 - In các ước         */
int  main(void);              /* điều phối                     */</code></pre>
<p class="dap-an">✅ Chấm từng module theo hai luật, trước khi viết một thân hàm nào. Cohesion: tên mỗi prototype là một cụm động từ, nên cả ba đều có cohesion <strong>functional</strong>. Coupling: mỗi module nhận thứ nó cần qua tham số và trả về thứ nó tạo ra, nên cả ba đều ở mức <strong>data</strong> — bậc thấp nhất của slide 20. Thiết kế này đạt cả hai quy định của slide 14, và đạt ngay trên giấy, trước khi trình biên dịch dính dáng vào.</p>
<p class="meo">💡 Hãy vẽ sơ đồ này cho bài tập lớn của chính bạn trước khi viết code. Một sơ đồ có mũi tên chằng chịt giữa các anh em đang mách bạn về một sự ghép nối bạn chưa nhận ra; một cái hộp bạn không dán được nhãn bằng một động từ đang mách bạn về cohesion.</p>`],

      [22, 'Example (cont.) — what each module is responsible for',
        `<p class="y-chinh">🎯 One responsibility statement per module. Read them as contracts: each sentence says what the module promises and, by omission, what it refuses to do.</p>
<ul>
<li><strong>Module 1 — Input Handling</strong>: "This module is responsible for reading the value of n from the user." Reading only. It does not validate against the rest of the program, it does not compute, it does not print results.</li>
<li><strong>Module 2 — Summing Divisors</strong>: "This module calculates the sum of all divisors of a given integer." Note "a given integer" — the number arrives from outside. That single phrase is the data coupling.</li>
<li><strong>Module 3 — Printing Divisors</strong>: "This module prints all divisors of a given integer." Again "a given". Same shape as Module 2, different verb, different output.</li>
<li><strong>Main Program</strong>: "This module coordinates the other modules. It uses input, calculates the sum of divisors, and prints the divisors." Main is allowed to have three verbs precisely because coordinating <em>is</em> its one job.</li>
<li><strong>The word doing the work: "given"</strong> — modules 2 and 3 both say "of a given integer" rather than "of n". That is the whole difference from slide 15, expressed in English before it is expressed in C.</li>
<li><strong>What each contract buys you</strong> — because Module 2 promises only a calculation, you can call it from a test, from a loop over many numbers, or from a completely different program. Because Module 1 promises only reading, swapping <code>scanf</code> for a file read touches one function.</li>
</ul>
<pre><code>int getInput(void) {                     /* Module 1: read, return, nothing else */
    int n;
    printf("Enter a positive integer: ");
    scanf("%d", &amp;n);
    return n;
}
int sumOfDivisors(int n) {               /* Module 2: calculate, return a number */
    int i, s = 0;
    for (i = 1; i &lt;= n; i++) if (n % i == 0) s += i;
    return s;
}
void printDivisors(int n) {              /* Module 3: print, return nothing      */
    int i;
    for (i = 1; i &lt;= n; i++) if (n % i == 0) printf("%d, ", i);
    printf("\\n");
}</code></pre>
<p class="dap-an">✅ Compiled and run with n = 12: <code>printDivisors(12)</code> prints <strong>1, 2, 3, 4, 6, 12,</strong> and <code>sumOfDivisors(12)</code> returns <strong>28</strong>. Notice the return types follow straight from the contracts — Module 2 promises a value, so it returns <code>int</code>; Module 3 promises an effect on the screen, so it returns <code>void</code>. The contract decided the signature before any code was written.</p>
<p class="pitfall">⚠️ <code>printDivisors</code> leaves a trailing comma: the output really is <code>1, 2, 3, 4, 6, 12,</code>. The slide's own code has the same shape. If a grader requires <code>1, 2, 3, 4, 6, 12</code>, print the separator <em>before</em> each item except the first, or print <code>i</code> then a comma only when another divisor follows. Verified: the trailing comma is what the straightforward loop actually produces.</p>`,
        `<p class="y-chinh">🎯 Mỗi module một câu phát biểu trách nhiệm. Hãy đọc chúng như hợp đồng: mỗi câu nói module hứa làm gì, và bằng cách bỏ trống, nói nó từ chối làm gì.</p>
<ul>
<li><strong>Module 1 — Input Handling</strong>: "This module is responsible for reading the value of n from the user." Chỉ ĐỌC. Nó không kiểm tra tương quan với phần còn lại của chương trình, không tính toán, không in kết quả.</li>
<li><strong>Module 2 — Summing Divisors</strong>: "This module calculates the sum of all divisors of a given integer." Chú ý chữ "a given integer" — con số đến từ bên ngoài. Đúng cụm từ ấy chính là data coupling.</li>
<li><strong>Module 3 — Printing Divisors</strong>: "This module prints all divisors of a given integer." Lại "a given". Cùng hình dạng với Module 2, khác động từ, khác đầu ra.</li>
<li><strong>Main Program</strong>: "This module coordinates the other modules. It uses input, calculates the sum of divisors, and prints the divisors." Main được phép có ba động từ chính vì ĐIỀU PHỐI mới là một việc duy nhất của nó.</li>
<li><strong>Chữ gánh việc: "given" (cho trước)</strong> — module 2 và 3 đều nói "of a given integer" chứ không nói "of n". Đó là toàn bộ khác biệt so với slide 15, diễn đạt bằng tiếng Anh trước khi diễn đạt bằng C.</li>
<li><strong>Mỗi hợp đồng mua cho bạn cái gì</strong> — vì Module 2 chỉ hứa tính toán, bạn gọi được nó từ một bài kiểm thử, từ một vòng lặp qua nhiều số, hay từ một chương trình hoàn toàn khác. Vì Module 1 chỉ hứa đọc, đổi <code>scanf</code> sang đọc file chỉ đụng một hàm.</li>
</ul>
<pre><code>int getInput(void) {                     /* Module 1: đọc, trả về, không gì khác */
    int n;
    printf("Enter a positive integer: ");
    scanf("%d", &amp;n);
    return n;
}
int sumOfDivisors(int n) {               /* Module 2: tính, trả về một con số    */
    int i, s = 0;
    for (i = 1; i &lt;= n; i++) if (n % i == 0) s += i;
    return s;
}
void printDivisors(int n) {              /* Module 3: in, không trả về gì        */
    int i;
    for (i = 1; i &lt;= n; i++) if (n % i == 0) printf("%d, ", i);
    printf("\\n");
}</code></pre>
<p class="dap-an">✅ Đã biên dịch và chạy với n = 12: <code>printDivisors(12)</code> in ra <strong>1, 2, 3, 4, 6, 12,</strong> còn <code>sumOfDivisors(12)</code> trả về <strong>28</strong>. Để ý kiểu trả về suy thẳng ra từ hợp đồng — Module 2 hứa một giá trị nên trả <code>int</code>; Module 3 hứa một tác động lên màn hình nên trả <code>void</code>. Hợp đồng đã quyết định chữ ký hàm trước khi có dòng code nào.</p>
<p class="pitfall">⚠️ <code>printDivisors</code> để thừa một dấu phẩy cuối: kết quả thật đúng là <code>1, 2, 3, 4, 6, 12,</code>. Code trên slide cũng có đúng hình dạng đó. Nếu người chấm đòi <code>1, 2, 3, 4, 6, 12</code> thì hãy in dấu ngăn cách TRƯỚC mỗi phần tử trừ phần tử đầu, hoặc chỉ in dấu phẩy khi còn ước tiếp theo. Đã kiểm: dấu phẩy thừa đúng là thứ vòng lặp viết thẳng tay sinh ra.</p>`],

      [23, 'Example (cont.) — the full program and its Output',
        `<p class="y-chinh">🎯 The screen shows the four modules assembled into one file plus the run's Output. This is the design of slide 21 turned into working C.</p>
<ul>
<li><strong>How main is now written</strong> — it declares almost nothing, calls the three modules in order, and prints. Compare with slide 9's main, which held the loop logic indirectly; here main holds only the <em>sequence</em>.</li>
<li><strong>Where each value travels</strong> — <code>getInput()</code> produces n and hands it to main; main hands n to <code>printDivisors</code> and to <code>sumOfDivisors</code>; <code>sumOfDivisors</code> hands a number back. Every arrow is a parameter or a return. No global anywhere.</li>
<li><strong>The order of the calls is a choice, not a constraint</strong> — you can print the divisors before or after computing the sum, and nothing breaks, because the two modules do not depend on each other. That freedom is exactly what "low coupling" buys.</li>
<li><strong>Prototypes or definition order</strong> — because all three modules are defined above <code>main</code> in this listing, no prototypes are needed. Put them below <code>main</code> and you must declare prototypes first; slides 44–45 cover that.</li>
<li><strong>Each function is short enough to read at a glance</strong> — five to seven lines each, satisfying slide 14's "readable amount of code" guideline, and the whole file is still under thirty lines.</li>
<li><strong>What the Output panel proves</strong> — that the decomposition costs nothing at runtime. Same problem, same answer as slide 9's single-module version; only the shape of the source changed.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int getInput(void) {
    int n;
    printf("Enter a positive integer: ");
    scanf("%d", &amp;n);
    return n;
}
int sumOfDivisors(int n) {
    int i, s = 0;
    for (i = 1; i &lt;= n; i++) if (n % i == 0) s += i;
    return s;
}
void printDivisors(int n) {
    int i;
    for (i = 1; i &lt;= n; i++) if (n % i == 0) printf("%d, ", i);
    printf("\\n");
}
int main(void) {
    int n = getInput();
    printf("Divisors of %d: ", n);
    printDivisors(n);
    printf("Sum of divisors = %d\\n", sumOfDivisors(n));
    return 0;
}</code></pre>
<p class="dap-an">✅ Compiled with <code>cc -Wall -std=c99</code> and run with the input <strong>12</strong>, this program prints exactly:<br><code>Enter a positive integer: 12</code><br><code>Divisors of 12: 1, 2, 3, 4, 6, 12,</code><br><code>Sum of divisors = 28</code><br>Other runs, same binary: n = 6 → divisors 1, 2, 3, 6 and sum <strong>12</strong>; n = 7 → 1, 7 and sum <strong>8</strong>; n = 28 → 1, 2, 4, 7, 14, 28 and sum <strong>56</strong>.</p>
<p class="meo">💡 Because <code>sumOfDivisors</code> is data-coupled, you can test it without typing anything: add <code>printf("%d %d %d\\n", sumOfDivisors(6), sumOfDivisors(7), sumOfDivisors(28));</code> to main and you get <strong>12 8 56</strong> in one run. Try that with slide 15's global version and you cannot — that is the practical value of the design, not just a theoretical one.</p>`,
        `<p class="y-chinh">🎯 Màn hình cho thấy bốn module lắp vào một file cùng phần Output của lần chạy. Đây là thiết kế của slide 21 biến thành C chạy được.</p>
<ul>
<li><strong>Main giờ được viết thế nào</strong> — nó gần như không khai báo gì, gọi ba module theo thứ tự, rồi in. So với main của slide 9 vốn còn gánh gián tiếp phần lô-gic vòng lặp; ở đây main chỉ giữ <em>trình tự</em>.</li>
<li><strong>Mỗi giá trị đi đường nào</strong> — <code>getInput()</code> sinh ra n và trao cho main; main trao n cho <code>printDivisors</code> và cho <code>sumOfDivisors</code>; <code>sumOfDivisors</code> trả một con số về. Mọi mũi tên đều là tham số hoặc giá trị trả về. Không có biến toàn cục nào.</li>
<li><strong>Thứ tự các lời gọi là một lựa chọn, không phải ràng buộc</strong> — bạn in các ước trước hay sau khi tính tổng đều được, không hỏng gì, vì hai module không phụ thuộc nhau. Sự tự do đó đúng là thứ mà "ghép nối thấp" mua được.</li>
<li><strong>Prototype hay thứ tự định nghĩa</strong> — vì cả ba module được định nghĩa phía trên <code>main</code> trong listing này nên không cần prototype. Đặt chúng dưới <code>main</code> thì phải khai báo prototype trước; slide 44–45 nói chuyện đó.</li>
<li><strong>Mỗi hàm đủ ngắn để đọc trong một cái liếc</strong> — năm tới bảy dòng mỗi cái, thoả hướng dẫn "a readable amount of code" của slide 14, và cả file vẫn dưới ba mươi dòng.</li>
<li><strong>Khung Output chứng minh điều gì</strong> — rằng việc phân rã không tốn gì lúc chạy. Cùng bài toán, cùng đáp án với bản một-module của slide 9; chỉ hình dạng mã nguồn là đổi.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int getInput(void) {
    int n;
    printf("Enter a positive integer: ");
    scanf("%d", &amp;n);
    return n;
}
int sumOfDivisors(int n) {
    int i, s = 0;
    for (i = 1; i &lt;= n; i++) if (n % i == 0) s += i;
    return s;
}
void printDivisors(int n) {
    int i;
    for (i = 1; i &lt;= n; i++) if (n % i == 0) printf("%d, ", i);
    printf("\\n");
}
int main(void) {
    int n = getInput();
    printf("Divisors of %d: ", n);
    printDivisors(n);
    printf("Sum of divisors = %d\\n", sumOfDivisors(n));
    return 0;
}</code></pre>
<p class="dap-an">✅ Biên dịch bằng <code>cc -Wall -std=c99</code> và chạy với dữ liệu vào <strong>12</strong>, chương trình in ra đúng:<br><code>Enter a positive integer: 12</code><br><code>Divisors of 12: 1, 2, 3, 4, 6, 12,</code><br><code>Sum of divisors = 28</code><br>Các lần chạy khác, vẫn file chạy đó: n = 6 → ước 1, 2, 3, 6 và tổng <strong>12</strong>; n = 7 → 1, 7 và tổng <strong>8</strong>; n = 28 → 1, 2, 4, 7, 14, 28 và tổng <strong>56</strong>.</p>
<p class="meo">💡 Vì <code>sumOfDivisors</code> chỉ ghép nối mức data, bạn kiểm thử nó mà không phải gõ gì: thêm <code>printf("%d %d %d\\n", sumOfDivisors(6), sumOfDivisors(7), sumOfDivisors(28));</code> vào main là được <strong>12 8 56</strong> trong một lần chạy. Thử làm vậy với bản biến toàn cục của slide 15 thì chịu — đó là giá trị thực dụng của thiết kế này, không phải chỉ là lý thuyết.</p>`],

      [24, 'Example Explain — why this design satisfies both rules',
        `<p class="y-chinh">🎯 The deck grades its own example against the two stipulations of slide 14, then names two consequences that follow for free.</p>
<ul>
<li><strong>"High Cohesion: Each module has a single, well-defined purpose"</strong> — then it lists them: "getInput: Handles user input. sumOfDivisors: Calculates the sum of divisors. printDivisors: Displays all divisors." Three names, three verbs, no "and".</li>
<li><strong>Where on the ladder</strong> — each of the three is <em>functional</em> cohesion, the top rung of slide 18, because each name is "a precise verb phrase" and each performs "a single specific task".</li>
<li><strong>"Low Coupling: Each module operates independently and communicates only via function calls and return values."</strong> The mechanism is named exactly: parameters in, return values out. Nothing else.</li>
<li><strong>"No global variables are shared between modules."</strong> One sentence, and it is the whole difference from slide 15. On slide 20's scale this puts every module at <strong>data</strong> coupling, the lowest class.</li>
<li><strong>Consequence 1 — "Reusability: Each module can be reused in other programs without modification."</strong> Test it honestly: <code>sumOfDivisors</code> mentions no global, no <code>scanf</code>, no label text. Copy it into any program and it compiles and works.</li>
<li><strong>Consequence 2 — "Ease of Maintenance: Modifications to one module (e.g., changing the input method) won't affect others."</strong> Swap <code>scanf</code> for a file read inside <code>getInput</code> and the other three functions do not change by one character — because they never knew where n came from.</li>
</ul>
<pre><code>/* the reusability claim, tested: same Module 2, no edits, a different program */
int main(void) {
    int k, tong = 0;
    for (k = 1; k &lt;= 10; k++) tong += sumOfDivisors(k);   /* reused 10 times */
    printf("%d\\n", tong);
    return 0;
}</code></pre>
<p class="dap-an">✅ Run by hand first: sumOfDivisors of 1..10 = 1, 3, 4, 7, 6, 12, 8, 15, 13, 18. Adding them: 1+3=4, +4=8, +7=15, +6=21, +12=33, +8=41, +15=56, +13=69, +18=<strong>87</strong>. Compiled and run, the program prints <strong>87</strong> — the hand trace matches. The point is not the number: it is that Module 2 was reused ten times, in a program with no input and no divisor printing, <em>without one character changed</em>. That is what "reusable without modification" means, demonstrated.</p>
<p class="meo">💡 This slide is the answer template for the standard exam question "explain why this design has high cohesion and low coupling". Say (1) each module has one purpose, name them; (2) communication is only through parameters and return values; (3) there are no shared globals. Three sentences, full marks.</p>`,
        `<p class="y-chinh">🎯 Bộ slide tự chấm ví dụ của chính nó theo hai quy định của slide 14, rồi nêu hai hệ quả có được miễn phí.</p>
<ul>
<li><strong>"High Cohesion: Each module has a single, well-defined purpose"</strong> — rồi liệt kê ra: "getInput: Handles user input. sumOfDivisors: Calculates the sum of divisors. printDivisors: Displays all divisors." Ba cái tên, ba động từ, không có chữ "và".</li>
<li><strong>Nằm ở đâu trên thang</strong> — cả ba đều là cohesion <em>functional</em>, bậc cao nhất của slide 18, vì mỗi tên là "a precise verb phrase" và mỗi cái làm "a single specific task".</li>
<li><strong>"Low Coupling: Each module operates independently and communicates only via function calls and return values."</strong> Cơ chế được gọi tên chính xác: tham số đi vào, giá trị trả về đi ra. Không gì khác.</li>
<li><strong>"No global variables are shared between modules."</strong> Một câu, và đó là toàn bộ khác biệt so với slide 15. Trên thang của slide 20, câu này đặt mọi module ở mức ghép nối <strong>data</strong>, hạng thấp nhất.</li>
<li><strong>Hệ quả 1 — "Reusability: Each module can be reused in other programs without modification."</strong> Hãy kiểm cho thật: <code>sumOfDivisors</code> không nhắc tới biến toàn cục nào, không <code>scanf</code>, không chữ nhãn nào. Chép nó vào chương trình bất kỳ là dịch được và chạy.</li>
<li><strong>Hệ quả 2 — "Ease of Maintenance: Modifications to one module (e.g., changing the input method) won't affect others."</strong> Đổi <code>scanf</code> thành đọc file bên trong <code>getInput</code> thì ba hàm kia không đổi một ký tự — vì chúng chưa bao giờ biết n từ đâu tới.</li>
</ul>
<pre><code>/* kiểm lời hứa tái sử dụng: vẫn Module 2, không sửa gì, một chương trình khác */
int main(void) {
    int k, tong = 0;
    for (k = 1; k &lt;= 10; k++) tong += sumOfDivisors(k);   /* tái dùng 10 lần */
    printf("%d\\n", tong);
    return 0;
}</code></pre>
<p class="dap-an">✅ Chạy tay trước: sumOfDivisors của 1..10 lần lượt là 1, 3, 4, 7, 6, 12, 8, 15, 13, 18. Cộng dồn: 1+3=4, +4=8, +7=15, +6=21, +12=33, +8=41, +15=56, +13=69, +18=<strong>87</strong>. Biên dịch và chạy thật, chương trình in <strong>87</strong> — khớp với bản chạy tay. Điểm mấu chốt không phải con số: mấu chốt là Module 2 đã được tái dùng mười lần, trong một chương trình không có nhập liệu và không in ước, mà <em>không sửa một ký tự</em>. Đó chính là nghĩa của "tái sử dụng không cần chỉnh sửa", được chứng minh.</p>
<p class="meo">💡 Slide này là khuôn trả lời cho câu hỏi thi tiêu chuẩn "giải thích vì sao thiết kế này có cohesion cao và coupling thấp". Nói (1) mỗi module một mục đích, kể tên ra; (2) liên lạc chỉ qua tham số và giá trị trả về; (3) không có biến toàn cục dùng chung. Ba câu, trọn điểm.</p>`],

      [25, 'Module identifying — How to create them? (the four-step recipe)',
        `<p class="y-chinh">🎯 The closing slide of the design block turns everything before it into a procedure you can actually run: list the verbs, pick the modules, then check cohesion and check coupling.</p>
<ul>
<li><strong>The rule restated</strong> — "If you still use a verb to describe a task then a module is identified." Same sentence as slide 16, repeated because it is the operative one.</li>
<li><strong>Step 1 — "List all of the tasks (verbs) that the program should perform to solve this problem."</strong> Write them as verbs, exhaustively, without judging yet. For the divisor problem: accept, sum, print, pause.</li>
<li><strong>Step 2 — "Identify the modules (verbs) for the problem structure."</strong> Now judge: which verbs are already library modules (<code>scanf</code>, <code>printf</code>) and which must be written by you? Only the leftovers become your functions.</li>
<li><strong>Step 3 — "Check that each module is high in cohesion (each basic task is a module)."</strong> Apply slides 16–18: read each module's name aloud; if it needs "and", split it.</li>
<li><strong>Step 4 — "Check that each module is low in coupling (modules are independent)."</strong> Apply slides 19–20: could you compile this function in a file by itself, given only its parameters? If it needs a global, fix it now.</li>
<li><strong>Note the shape of the recipe</strong> — two creative steps then two checking steps. The checks come last on purpose: you cannot judge cohesion of a module that does not exist yet, and the checks are cheap to run repeatedly.</li>
</ul>
<pre><code>/* Steps 1-4 on "print the n first primes" (the deck's own slide-57 problem) */
/* 1. verbs:  accept n · check whether a value is prime · print · count       */
/* 2. modules: accept -&gt; scanf (library) · print -&gt; printf (library)          */
/*             laNguyenTo, inNSoNguyenTo -&gt; mine                              */
int laNguyenTo(int v) {              /* 3. one verb  -&gt; functional cohesion   */
    int i;
    if (v &lt; 2) return 0;
    for (i = 2; i * i &lt;= v; i++) if (v % i == 0) return 0;
    return 1;
}
void inNSoNguyenTo(int n) {          /* 4. takes n as a parameter -&gt; data     */
    int dem = 0, v = 2;
    while (dem &lt; n) {
        if (laNguyenTo(v)) { dem++; printf("%d, ", v); }
        v++;
    }
    printf("\\n");
}</code></pre>
<p class="dap-an">✅ Compiled and run. <code>inNSoNguyenTo(5)</code> prints <strong>2, 3, 5, 7, 11,</strong> — exactly the "Input: n=5 / Output: 2, 3, 5, 7, 11" that slide 57 promises. Spot checks on the helper: <code>laNguyenTo(1)</code> → <strong>0</strong>, <code>laNguyenTo(2)</code> → <strong>1</strong>, <code>laNguyenTo(9)</code> → <strong>0</strong>, <code>laNguyenTo(11)</code> → <strong>1</strong>. Now grade the design with steps 3 and 4: <code>laNguyenTo</code> is one verb ("check whether v is prime") and takes v as a parameter → functional cohesion, data coupling. <code>inNSoNguyenTo</code> is one verb and takes n as a parameter → same verdict. The recipe passes its own checks.</p>
<p class="pitfall">⚠️ Step 4 is the one people skip, and it is the one that silently fails later. A quick way to run it without thinking: search your function body for any identifier that is neither a parameter nor declared inside the function. Every hit is a coupling you did not intend. In <code>laNguyenTo</code> and <code>inNSoNguyenTo</code> above, there are none — and that is checkable in ten seconds, not a matter of opinion.</p>`,
        `<p class="y-chinh">🎯 Slide khép lại khối thiết kế biến mọi thứ phía trước thành một quy trình bạn chạy được thật: liệt kê động từ, chọn ra module, rồi kiểm cohesion và kiểm coupling.</p>
<ul>
<li><strong>Quy tắc nhắc lại</strong> — "If you still use a verb to describe a task then a module is identified." Đúng câu của slide 16, nhắc lại vì đó là câu có tác dụng thi hành.</li>
<li><strong>Bước 1 — "List all of the tasks (verbs) that the program should perform to solve this problem."</strong> Viết chúng ra dưới dạng động từ, cho đủ, chưa phán xét gì. Với bài tổng ước: nhận, tính tổng, in, dừng.</li>
<li><strong>Bước 2 — "Identify the modules (verbs) for the problem structure."</strong> Giờ mới phán xét: động từ nào đã có sẵn module thư viện (<code>scanf</code>, <code>printf</code>) và động từ nào bạn phải tự viết? Chỉ phần còn lại mới thành hàm của bạn.</li>
<li><strong>Bước 3 — "Check that each module is high in cohesion (each basic task is a module)."</strong> Áp slide 16–18: đọc to tên từng module; nếu phải dùng chữ "và" thì tách ra.</li>
<li><strong>Bước 4 — "Check that each module is low in coupling (modules are independent)."</strong> Áp slide 19–20: bạn có dịch được hàm này trong một file riêng, chỉ với các tham số của nó, không? Nếu nó cần một biến toàn cục thì sửa ngay bây giờ.</li>
<li><strong>Chú ý hình dạng của công thức</strong> — hai bước sáng tạo rồi hai bước kiểm tra. Các bước kiểm đặt sau cùng là có chủ ý: không thể chấm cohesion của một module chưa tồn tại, và các phép kiểm thì chạy đi chạy lại rất rẻ.</li>
</ul>
<pre><code>/* Bước 1-4 cho bài "in n số nguyên tố đầu tiên" (chính đề ở slide 57)       */
/* 1. động từ: nhận n · kiểm một số có nguyên tố không · in · đếm            */
/* 2. module:  nhận -&gt; scanf (thư viện) · in -&gt; printf (thư viện)           */
/*             laNguyenTo, inNSoNguyenTo -&gt; của mình                        */
int laNguyenTo(int v) {              /* 3. một động từ -&gt; cohesion functional */
    int i;
    if (v &lt; 2) return 0;
    for (i = 2; i * i &lt;= v; i++) if (v % i == 0) return 0;
    return 1;
}
void inNSoNguyenTo(int n) {          /* 4. nhận n qua tham số -&gt; mức data     */
    int dem = 0, v = 2;
    while (dem &lt; n) {
        if (laNguyenTo(v)) { dem++; printf("%d, ", v); }
        v++;
    }
    printf("\\n");
}</code></pre>
<p class="dap-an">✅ Đã biên dịch và chạy. <code>inNSoNguyenTo(5)</code> in ra <strong>2, 3, 5, 7, 11,</strong> — đúng phần "Input: n=5 / Output: 2, 3, 5, 7, 11" mà slide 57 hứa. Kiểm điểm hàm phụ: <code>laNguyenTo(1)</code> → <strong>0</strong>, <code>laNguyenTo(2)</code> → <strong>1</strong>, <code>laNguyenTo(9)</code> → <strong>0</strong>, <code>laNguyenTo(11)</code> → <strong>1</strong>. Giờ chấm thiết kế bằng bước 3 và 4: <code>laNguyenTo</code> là một động từ ("kiểm v có nguyên tố không") và nhận v qua tham số → cohesion functional, coupling mức data. <code>inNSoNguyenTo</code> cũng một động từ và cũng nhận n qua tham số → cùng phán quyết. Công thức vượt qua chính phép kiểm của nó.</p>
<p class="pitfall">⚠️ Bước 4 là bước người ta hay bỏ, và cũng là bước âm thầm hỏng về sau. Một cách chạy nó mà không phải nghĩ: dò trong thân hàm xem có định danh nào không phải tham số và cũng không được khai báo bên trong hàm không. Mỗi lần trúng là một mối ghép nối bạn không hề định tạo. Trong <code>laNguyenTo</code> và <code>inNSoNguyenTo</code> ở trên thì không có cái nào — và điều đó kiểm được trong mười giây, không phải chuyện quan điểm.</p>`],

    ]),
  ].join('\n'),
};
