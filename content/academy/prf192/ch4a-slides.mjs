/**
 * PRF192 · Slot 05-07 (deck 'prf3', 60 slide) — phần slide 1→23, học theo từng slide.
 * Nội dung bám ĐÚNG chữ trích từ file .pptx gốc của trường (/tmp/prf192-text/prf3.txt).
 *
 * Mọi con số và mọi đoạn code C trong bài đã được biên dịch bằng `cc -Wall` và CHẠY THẬT:
 *   · Áo thun (slide 16): N=1→120000 · N=3→360000 · N=4→450000 · N=5→540000 ·
 *     N=8→800000 · N=10→970000 · N=12→1110000
 *   · Điện (slide 17, bậc 950/1250/1350/1550 theo mốc 100/150/200):
 *     80→76000 · 100→95000 · 120→120000 · 150→157500 · 180→198000 · 200→225000 · 250→302500
 *   · if (x = 0) với x=5 → chạy nhánh else, x còn 0 · if (y = 7) → chạy nhánh then, y=7
 *   · dangling else: a=1,b=-2 rơi vào else của if TRONG (clang cảnh báo -Wdangling-else)
 *   · switch thiếu break: d=3 in cả "Bac 3" lẫn "Bac 4"
 *   · scanf("%lf%c%lf") ĐỌC HỎNG khi người dùng gõ "4 * 5" (có dấu cách) — đã đo;
 *     bản vá "%lf %c %lf" đọc đúng cả "4*5" lẫn "4 * 5"
 *
 * Slide 22 có một câu trắc nghiệm mà PHẦN CODE nằm trong ẢNH, không có trong chữ trích được.
 * Bài KHÔNG bịa lại code đó — chỉ chép nguyên các phương án và dạy cách tự truy vết.
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'prf3';

export default {
  title: '4.0a — Slide by slide: Structured programming, pseudo-code, flowcharts & branching (slides 1–23)|||4.0a — Slide bài giảng: Lập trình có cấu trúc, mã giả, lưu đồ & rẽ nhánh (slide 1–23)',
  slug: 'prf192-4-0a-slides-cau-truc-re-nhanh',
  type: 'DOCUMENT',
  description: 'Nửa đầu bộ slide Slot 05-07 của PRF192 (slide 1–23): ba khối logic (tuần tự, rẽ nhánh, lặp), lập trình có cấu trúc, thiết kế bằng mã giả và lưu đồ, câu lệnh đơn và khối lệnh, rồi trọn phần rẽ nhánh — if…else, chuỗi else if lồng nhau, dangling else, toán tử ? : và câu lệnh switch. Mỗi slide kèm giảng song ngữ, ví dụ giải từng bước có bảng vết, và các bẫy đề thi hay hỏi (nhầm = với ==, else thuộc về if nào, thiếu break gây fall-through).',
  content: [
    walkHead(D, 1, 23),
    walk(D, [

      [1, 'Basic Logics',
        `<p class="y-chinh">🎯 Slot 05-07 is where a C program stops being a straight line: from here on it can <em>choose</em> a path and <em>repeat</em> work.</p>
<ul>
<li><strong>What "basic logics" means here</strong> — not formal logic, but the three control-flow shapes every structured program is built from: <em>sequence</em>, <em>selection</em>, <em>iteration</em>. Slides 6 and 13 name them explicitly.</li>
<li><strong>Why this deck is three slots long</strong> — 60 slides covering design notation (pseudo-code, flowcharts), all of branching, all of looping, plus walkthroughs and debugging. It is the longest single idea in PRF192.</li>
<li><strong>What you can already do</strong> — after Slot 02-04 you can declare variables, compute expressions and print results. Every program you wrote ran top to bottom, once. That is a <em>sequence</em>, and it is only one of the three constructs.</li>
<li><strong>What changes now</strong> — a condition can make the CPU jump over statements (<code>if</code>, <code>switch</code>) or jump backwards (<code>while</code>, <code>for</code>). Program text order stops being execution order.</li>
<li><strong>Scope of this lesson</strong> — slides 1–23 of 60: structured programming, pseudo-code, flowcharts, sequence constructs, and the whole selection family (<code>if</code>, <code>if…else</code>, <code>else if</code>, <code>? :</code>, <code>switch</code>). Iteration starts at slide 24 and belongs to the second half.</li>
</ul>
<p class="meo">💡 Carry one sentence through this deck: <em>a program is a graph of statements, and the control constructs are the only legal ways to draw an edge</em>. Structured programming is the rule that every construct has exactly one way in and one way out.</p>`,
        `<p class="y-chinh">🎯 Slot 05-07 là chỗ chương trình C thôi đi thẳng một mạch: từ đây nó biết <em>chọn</em> đường và biết <em>lặp lại</em> công việc.</p>
<ul>
<li><strong>"Basic logics" ở đây nghĩa là gì</strong> — không phải logic hình thức, mà là ba hình dạng luồng điều khiển dựng nên mọi chương trình có cấu trúc: <em>tuần tự (sequence)</em>, <em>rẽ nhánh (selection)</em>, <em>lặp (iteration)</em>. Slide 6 và slide 13 gọi tên chúng rõ ràng.</li>
<li><strong>Vì sao bộ slide này dài tới ba slot</strong> — 60 slide phủ cả ký pháp thiết kế (mã giả, lưu đồ), toàn bộ phần rẽ nhánh, toàn bộ phần lặp, cộng thêm walkthrough và gỡ lỗi. Đây là ý tưởng đơn lẻ dài nhất của PRF192.</li>
<li><strong>Bạn đã làm được gì</strong> — sau Slot 02-04 bạn khai báo được biến, tính được biểu thức và in được kết quả. Mọi chương trình đã viết đều chạy từ trên xuống, đúng một lần. Đó là <em>tuần tự</em>, và nó chỉ là một trong ba khối.</li>
<li><strong>Cái gì thay đổi từ bây giờ</strong> — một điều kiện có thể khiến CPU nhảy vượt qua vài câu lệnh (<code>if</code>, <code>switch</code>) hoặc nhảy ngược lại (<code>while</code>, <code>for</code>). Thứ tự chữ trong file thôi không còn là thứ tự chạy.</li>
<li><strong>Phạm vi bài học này</strong> — slide 1–23 trên tổng 60: lập trình có cấu trúc, mã giả, lưu đồ, khối tuần tự, và trọn họ rẽ nhánh (<code>if</code>, <code>if…else</code>, <code>else if</code>, <code>? :</code>, <code>switch</code>). Phần lặp bắt đầu từ slide 24, thuộc nửa sau.</li>
</ul>
<p class="meo">💡 Mang theo một câu suốt bộ slide này: <em>chương trình là một đồ thị các câu lệnh, và các cấu trúc điều khiển là cách hợp lệ duy nhất để vẽ một cạnh</em>. Lập trình có cấu trúc chính là quy tắc: mỗi khối có đúng một lối vào và đúng một lối ra.</p>`],

      [2, 'Review',
        `<p class="y-chinh">🎯 Everything Slot 02-04 established, in one screen — because branching conditions are built out of exactly these pieces: variables, types and expressions.</p>
<ul>
<li><strong>"A variable is a name referencing to a memory location"</strong> — the name is for you; the address is for the machine. A condition like <code>if (x &gt; 0)</code> is really "read the bytes at x's address, compare, branch".</li>
<li><strong>"A data type defines: how the values are stored and how the operations on those values are performed"</strong> — this bites immediately in this deck: <code>switch</code> accepts only integral types precisely because a jump table needs whole numbers, not <code>float</code>.</li>
<li><strong>Four primitive types in C: <code>int</code>, <code>char</code>, <code>float</code>, <code>double</code></strong> — remember that <code>char</code> <em>is</em> a small integer. That is why <code>switch (op)</code> on a <code>char</code> is legal (slide 21) and <code>case '+':</code> is a valid constant.</li>
<li><strong>"Data stored are in binary format"</strong> — and so is truth: C has no <code>bool</code> in the C89 core. A condition is just an <code>int</code>; <strong>0 means false, anything non-zero means true</strong>. That single fact explains the <code>if (x = 0)</code> trap on slide 14.</li>
<li><strong>Declaration syntax <code>data_type identifier [=initialValue];</code></strong> — the square brackets mean "optional", they are not typed. An uninitialised variable holds garbage, and branching on garbage gives a program that works on your machine and fails on the grader's.</li>
<li><strong>Identifier rules</strong> — starts with a letter or <code>_</code>, then letters, digits, <code>_</code>; and must not be a C keyword. Note that <code>if</code>, <code>else</code>, <code>switch</code>, <code>case</code>, <code>default</code>, <code>break</code> are all keywords: you cannot name a variable <code>default</code>.</li>
<li><strong>"Expression is a valid association of constants, variables, operators and functions"</strong> — the key consequence: <em>every</em> expression has a value, including <code>x = 0</code> (value 0) and <code>x == 0</code> (value 1 or 0). Both are legal inside <code>if (…)</code>. Only one is what you meant.</li>
</ul>
<p class="meo">💡 Write this on your cheat sheet before the exam: <strong>condition = expression, and expression ≠ 0 means TRUE</strong>. Half the branching traps in PRF192 collapse once you believe that sentence.</p>`,
        `<p class="y-chinh">🎯 Tất cả những gì Slot 02-04 đã chốt, gom trong một màn hình — vì điều kiện rẽ nhánh được dựng đúng từ những mảnh này: biến, kiểu dữ liệu và biểu thức.</p>
<ul>
<li><strong>"Biến là một cái tên trỏ tới một ô nhớ"</strong> — cái tên dành cho bạn; địa chỉ dành cho máy. Một điều kiện như <code>if (x &gt; 0)</code> thực chất là "đọc các byte ở địa chỉ của x, so sánh, rồi rẽ".</li>
<li><strong>"Kiểu dữ liệu quy định: giá trị được lưu thế nào và các phép toán trên giá trị đó thực hiện ra sao"</strong> — điều này cắn ngay trong bộ slide này: <code>switch</code> chỉ nhận kiểu nguyên, chính vì bảng nhảy cần số nguyên chứ không cần <code>float</code>.</li>
<li><strong>Bốn kiểu nguyên thuỷ của C: <code>int</code>, <code>char</code>, <code>float</code>, <code>double</code></strong> — nhớ rằng <code>char</code> <em>chính là</em> một số nguyên nhỏ. Nhờ vậy <code>switch (op)</code> trên một <code>char</code> mới hợp lệ (slide 21) và <code>case '+':</code> mới là hằng hợp lệ.</li>
<li><strong>"Dữ liệu lưu ở dạng nhị phân"</strong> — và chân lý cũng vậy: C chuẩn C89 không có kiểu <code>bool</code>. Điều kiện chỉ là một <code>int</code>; <strong>0 là sai, khác 0 là đúng</strong>. Đúng một sự thật đó giải thích cái bẫy <code>if (x = 0)</code> ở slide 14.</li>
<li><strong>Cú pháp khai báo <code>data_type identifier [=initialValue];</code></strong> — cặp ngoặc vuông nghĩa là "tuỳ chọn", không phải gõ vào. Biến chưa khởi tạo chứa rác, mà rẽ nhánh trên rác cho ra chương trình chạy đúng trên máy bạn và sai trên máy chấm.</li>
<li><strong>Quy tắc định danh</strong> — bắt đầu bằng chữ cái hoặc <code>_</code>, sau đó là chữ, số, <code>_</code>; và không được trùng từ khoá C. Lưu ý <code>if</code>, <code>else</code>, <code>switch</code>, <code>case</code>, <code>default</code>, <code>break</code> đều là từ khoá: bạn không thể đặt tên biến là <code>default</code>.</li>
<li><strong>"Biểu thức là một kết hợp hợp lệ của hằng, biến, toán tử và hàm"</strong> — hệ quả then chốt: <em>mọi</em> biểu thức đều có giá trị, kể cả <code>x = 0</code> (giá trị 0) lẫn <code>x == 0</code> (giá trị 1 hoặc 0). Cả hai đều hợp lệ trong <code>if (…)</code>. Chỉ một cái là điều bạn định nói.</li>
</ul>
<p class="meo">💡 Ghi câu này vào tờ giấy ôn trước khi thi: <strong>điều kiện = biểu thức, và biểu thức khác 0 nghĩa là ĐÚNG</strong>. Một nửa số bẫy rẽ nhánh của PRF192 sụp đổ ngay khi bạn tin câu đó.</p>`],

      [3, 'Objectives',
        `<p class="y-chinh">🎯 Three questions drive this slot: how do I <em>develop</em> a C program, what <em>rules</em> should I follow while writing it, and how do I <em>understand</em> a program someone hands me?</p>
<ul>
<li><strong>"How to develop a C-program?" ⟶ Logic constructs</strong> — the answer the slide gives is not "type code". It is "pick the right construct". Design comes before syntax, which is why slides 7–11 are about pseudo-code and flowcharts, not about C.</li>
<li><strong>"When I develop a C-program, what are things that I should follow?" ⟶ Programming styles</strong> — indentation, braces, naming, comments. In this deck style is not cosmetics: the dangling-else bug on slide 18 is <em>caused</em> by misleading indentation.</li>
<li><strong>"How I can understand a program?" ⟶ Walkthroughs and debug</strong> — hand-tracing a program with a table of variable values. This is the single most examinable skill in PRF192, because "what does this code print?" is the standard question format.</li>
<li><strong>Read the verbs, they tell you the exam format</strong> — <em>develop</em> (write code from a spec), <em>follow</em> (style questions, spot-the-bad-code), <em>understand</em> (trace tables, predict output).</li>
<li><strong>What is NOT an objective</strong> — memorising the flowchart symbol shapes for their own sake. The symbols exist so that you can design before you code; nobody is going to ask you to draw a perfect parallelogram.</li>
</ul>
<p class="meo">💡 Turn each objective into a self-test. "Can I take a word problem, write pseudo-code, draw a flowchart, then translate it to C without looking anything up?" If yes, this slot is done.</p>`,
        `<p class="y-chinh">🎯 Ba câu hỏi dẫn dắt cả slot: làm sao <em>xây dựng</em> một chương trình C, khi viết thì phải <em>theo</em> quy tắc gì, và làm sao <em>hiểu</em> một chương trình do người khác đưa cho?</p>
<ul>
<li><strong>"Làm sao phát triển một chương trình C?" ⟶ Các khối logic</strong> — câu trả lời của slide không phải "gõ code". Nó là "chọn đúng khối cấu trúc". Thiết kế đi trước cú pháp, nên slide 7–11 nói về mã giả và lưu đồ chứ chưa nói về C.</li>
<li><strong>"Khi viết chương trình C thì phải theo những gì?" ⟶ Phong cách lập trình</strong> — thụt lề, ngoặc nhọn, cách đặt tên, chú thích. Trong bộ slide này phong cách không phải chuyện làm đẹp: lỗi dangling else ở slide 18 <em>sinh ra</em> chính từ việc thụt lề đánh lừa mắt.</li>
<li><strong>"Làm sao để hiểu một chương trình?" ⟶ Walkthrough và gỡ lỗi</strong> — chạy tay chương trình với một bảng giá trị biến. Đây là kỹ năng dễ ra đề nhất của PRF192, vì "đoạn code này in ra gì?" là dạng câu hỏi chuẩn.</li>
<li><strong>Đọc các động từ, chúng nói cho bạn dạng đề</strong> — <em>phát triển</em> (viết code từ đề bài), <em>tuân theo</em> (câu hỏi về phong cách, chỉ ra chỗ code xấu), <em>hiểu</em> (bảng vết, dự đoán kết quả in).</li>
<li><strong>Cái gì KHÔNG phải mục tiêu</strong> — học thuộc hình dạng các ký hiệu lưu đồ chỉ để mà thuộc. Ký hiệu sinh ra để bạn thiết kế trước khi code; không ai bắt bạn vẽ một hình bình hành thật chuẩn.</li>
</ul>
<p class="meo">💡 Biến mỗi mục tiêu thành một bài tự kiểm. "Tôi có lấy một đề bài chữ, viết ra mã giả, vẽ lưu đồ, rồi dịch sang C mà không cần tra cứu gì không?" Nếu có, slot này coi như xong.</p>`],

      [4, 'Contents',
        `<p class="y-chinh">🎯 Three blocks for the whole 60-slide deck: <strong>Logic constructs</strong>, <strong>Programming Styles</strong>, <strong>Walkthroughs</strong> — and this lesson lives entirely inside the first one.</p>
<ul>
<li><strong>Block 1 — Logic constructs</strong> (slides 5 to roughly 45). Sub-divided into structured programming design (7–11), sequence (12), selection (13–23) and iteration (24 onward). By far the biggest block.</li>
<li><strong>Block 2 — Programming Styles</strong> — naming, indenting, commenting, and how to write code that another human can read a year later. It follows the constructs on purpose: you cannot have a style for something you cannot write yet.</li>
<li><strong>Block 3 — Walkthroughs</strong> — hand-executing code with a trace table, and using a debugger to watch variables change. This is the verification half of the slot.</li>
<li><strong>Where slides 1–23 stop</strong> — right at the end of selection, just before "4. Iteration (loop) Constructs" on slide 24. So this lesson is: design notation + sequence + all branching.</li>
<li><strong>Why the order is design → sequence → selection → iteration</strong> — each construct is strictly more powerful than the previous. Sequence alone can compute a fixed formula; selection adds decisions; iteration adds unbounded repetition. Add all three and the language is Turing-complete — you can compute anything computable.</li>
</ul>
<p class="meo">💡 The Böhm–Jacopini theorem (1966) is the formal version of this contents slide: <em>any</em> program can be written using only sequence, selection and iteration. Every <code>goto</code> you will ever be tempted by is unnecessary — that is the whole thesis of structured programming.</p>`,
        `<p class="y-chinh">🎯 Ba khối cho trọn bộ 60 slide: <strong>Các khối logic</strong>, <strong>Phong cách lập trình</strong>, <strong>Walkthrough</strong> — và bài học này nằm gọn trong khối thứ nhất.</p>
<ul>
<li><strong>Khối 1 — Các khối logic</strong> (slide 5 đến khoảng 45). Chia nhỏ thành thiết kế có cấu trúc (7–11), tuần tự (12), rẽ nhánh (13–23) và lặp (từ 24 trở đi). Khối lớn nhất, hơn hẳn phần còn lại.</li>
<li><strong>Khối 2 — Phong cách lập trình</strong> — đặt tên, thụt lề, chú thích, và cách viết code để một người khác đọc lại sau một năm vẫn hiểu. Nó đi sau phần cấu trúc là có chủ ý: không thể có phong cách cho thứ mà bạn còn chưa viết được.</li>
<li><strong>Khối 3 — Walkthrough</strong> — chạy tay đoạn code bằng bảng vết, và dùng trình gỡ lỗi để nhìn biến đổi giá trị. Đây là nửa "kiểm chứng" của slot.</li>
<li><strong>Slide 1–23 dừng ở đâu</strong> — ngay cuối phần rẽ nhánh, sát trước mục "4. Iteration (loop) Constructs" ở slide 24. Vậy bài học này gồm: ký pháp thiết kế + tuần tự + toàn bộ rẽ nhánh.</li>
<li><strong>Vì sao thứ tự là thiết kế → tuần tự → rẽ nhánh → lặp</strong> — mỗi khối mạnh hơn hẳn khối trước. Chỉ tuần tự thì tính được một công thức cố định; thêm rẽ nhánh thì có quyết định; thêm lặp thì có lặp lại không giới hạn. Đủ ba thứ là ngôn ngữ đạt Turing-complete — tính được mọi thứ tính được.</li>
</ul>
<p class="meo">💡 Định lý Böhm–Jacopini (1966) chính là bản hình thức của slide mục lục này: <em>mọi</em> chương trình đều viết lại được chỉ bằng tuần tự, rẽ nhánh và lặp. Mọi câu <code>goto</code> mà bạn từng thấy thèm đều là thừa — đó là toàn bộ luận điểm của lập trình có cấu trúc.</p>`],

      [5, 'Logic Constructs (section divider)',
        `<p class="y-chinh">🎯 A section marker: the next twenty slides define the grammar of control flow, one construct at a time.</p>
<ul>
<li><strong>What a "construct" is</strong> — a named, reusable shape of control flow with <em>one entry point and one exit point</em>. That single-entry/single-exit property is what slide 7 will call structured programming, and it is what makes code traceable by hand.</li>
<li><strong>The three shapes you are about to meet</strong> — sequence (do A then B), selection (do A <em>or</em> B), iteration (do A again and again while a condition holds).</li>
<li><strong>Constructs nest, they do not overlap</strong> — an <code>if</code> may contain a <code>while</code> which contains a <code>switch</code>. What you must never produce is two constructs that partially overlap, because then there is no single exit and no way to reason about the code.</li>
<li><strong>What comes next, slide by slide</strong> — slide 6 names the three; slide 7 defines structured programming; slides 8–9 design with pseudo-code; slides 10–11 design with flowcharts; slide 12 is sequence; slides 13–23 are selection.</li>
<li><strong>Why design notation comes before syntax</strong> — pseudo-code and flowcharts are language-independent. The same absolute-value design on slide 8 becomes C, C++ or Java on slide 9 without being rethought. Design once, translate many times.</li>
</ul>
<p class="meo">💡 When you are stuck on a programming exercise, the problem is almost never C syntax — it is that you have not decided which construct you need. Say the solution out loud in Vietnamese first; the words "nếu", "ngược lại", "lặp lại" tell you exactly which construct to reach for.</p>`,
        `<p class="y-chinh">🎯 Slide phân mục: hai chục slide tiếp theo định nghĩa ngữ pháp của luồng điều khiển, mỗi lần một khối.</p>
<ul>
<li><strong>"Khối cấu trúc" là gì</strong> — một hình dạng luồng điều khiển có tên, dùng lại được, với <em>một lối vào và một lối ra duy nhất</em>. Chính tính chất một-vào-một-ra đó là thứ slide 7 gọi là lập trình có cấu trúc, và là thứ khiến code chạy tay được.</li>
<li><strong>Ba hình dạng bạn sắp gặp</strong> — tuần tự (làm A rồi làm B), rẽ nhánh (làm A <em>hoặc</em> B), lặp (làm A đi làm lại chừng nào điều kiện còn đúng).</li>
<li><strong>Các khối lồng nhau, không chồng chéo nhau</strong> — một <code>if</code> có thể chứa một <code>while</code>, bên trong lại chứa một <code>switch</code>. Thứ tuyệt đối không được tạo ra là hai khối cắt ngang nhau một phần, vì khi đó không còn lối ra duy nhất và không còn cách nào lập luận về đoạn code.</li>
<li><strong>Tiếp theo là gì, theo từng slide</strong> — slide 6 gọi tên ba khối; slide 7 định nghĩa lập trình có cấu trúc; slide 8–9 thiết kế bằng mã giả; slide 10–11 thiết kế bằng lưu đồ; slide 12 là tuần tự; slide 13–23 là rẽ nhánh.</li>
<li><strong>Vì sao ký pháp thiết kế đi trước cú pháp</strong> — mã giả và lưu đồ độc lập với ngôn ngữ. Cùng một thiết kế tính trị tuyệt đối ở slide 8 sẽ thành C, C++ hay Java ở slide 9 mà không phải nghĩ lại. Thiết kế một lần, dịch nhiều lần.</li>
</ul>
<p class="meo">💡 Khi bí một bài tập lập trình, vấn đề gần như không bao giờ là cú pháp C — mà là bạn chưa quyết định mình cần khối nào. Cứ nói giải pháp ra thành tiếng Việt trước; các chữ "nếu", "ngược lại", "lặp lại" sẽ chỉ đúng khối cần dùng.</p>`],

      [6, 'Logic constructs — sequence, selection, iteration',
        `<p class="y-chinh">🎯 The slide's own words: expressions let us "perform calculations and execute statements in a sequential order"; structured programming organises those statements into three logic constructs — <strong>sequence</strong>, <strong>selection</strong>, <strong>iteration</strong>.</p>
<ul>
<li><strong>Sequence constructs</strong> — statements executed one after another, in written order. A single statement is a sequence; so is a block <code>{ … }</code>. This is everything you wrote in Slot 02-04.</li>
<li><strong>Selection constructs</strong> — a condition is evaluated once, and exactly one of several paths is taken. In C: <code>if</code>, <code>if…else</code>, the <code>else if</code> chain, the <code>? :</code> operator, and <code>switch</code>.</li>
<li><strong>Iteration constructs</strong> — a block is executed repeatedly while a condition holds. In C: <code>while</code>, <code>do…while</code>, <code>for</code>. That is slide 24 onward.</li>
<li><strong>Why exactly three, and not five or ten</strong> — because three are provably enough (Böhm–Jacopini). C also has <code>goto</code>, <code>break</code>, <code>continue</code> and <code>return</code>, but none of them adds power; they are shortcuts, and every one of them can break the single-exit rule if abused.</li>
<li><strong>Recognising which one a sentence needs</strong> — "compute the total" ⟶ sequence · "if the customer is a member, apply a discount" ⟶ selection · "for each of the 30 students" ⟶ iteration. Most real problems need all three nested inside each other.</li>
<li><strong>A worked mini-design</strong> — "read 3 marks, print the average, and print PASS if the average is at least 5". Sequence: read, sum, divide, print. Selection: compare with 5, print one of two words. Iteration: none yet — but change "3 marks" to "n marks" and you suddenly need it.</li>
</ul>
<p class="meo">💡 The three constructs map onto three English words you already use when explaining a task to a person: <em>then</em> (sequence), <em>if</em> (selection), <em>while</em> (iteration). Programming is mostly being disciplined about which of the three you mean.</p>`,
        `<p class="y-chinh">🎯 Nguyên văn slide: biểu thức cho phép ta "thực hiện tính toán và chạy các câu lệnh theo thứ tự tuần tự"; lập trình có cấu trúc tổ chức các câu lệnh đó thành ba khối logic — <strong>tuần tự</strong>, <strong>rẽ nhánh</strong>, <strong>lặp</strong>.</p>
<ul>
<li><strong>Khối tuần tự</strong> — các câu lệnh chạy lần lượt, theo đúng thứ tự viết. Một câu lệnh đơn là một khối tuần tự; một khối <code>{ … }</code> cũng vậy. Đây là toàn bộ những gì bạn viết ở Slot 02-04.</li>
<li><strong>Khối rẽ nhánh</strong> — một điều kiện được tính đúng một lần, và đúng một trong nhiều đường được chọn. Trong C: <code>if</code>, <code>if…else</code>, chuỗi <code>else if</code>, toán tử <code>? :</code>, và <code>switch</code>.</li>
<li><strong>Khối lặp</strong> — một khối lệnh chạy đi chạy lại chừng nào điều kiện còn đúng. Trong C: <code>while</code>, <code>do…while</code>, <code>for</code>. Đó là từ slide 24 trở đi.</li>
<li><strong>Vì sao đúng ba, không phải năm hay mười</strong> — vì ba là đủ, và đã được chứng minh (Böhm–Jacopini). C còn có <code>goto</code>, <code>break</code>, <code>continue</code>, <code>return</code>, nhưng không cái nào thêm sức mạnh; chúng chỉ là lối tắt, và cái nào cũng có thể phá vỡ quy tắc một-lối-ra nếu dùng ẩu.</li>
<li><strong>Nhận ra một câu chữ cần khối nào</strong> — "tính tổng tiền" ⟶ tuần tự · "nếu khách là thành viên thì giảm giá" ⟶ rẽ nhánh · "với mỗi sinh viên trong 30 người" ⟶ lặp. Bài toán thật thường cần cả ba lồng vào nhau.</li>
<li><strong>Một thiết kế nhỏ đã giải</strong> — "đọc 3 điểm, in điểm trung bình, và in PASS nếu trung bình từ 5 trở lên". Tuần tự: đọc, cộng, chia, in. Rẽ nhánh: so với 5, in một trong hai chữ. Lặp: chưa cần — nhưng đổi "3 điểm" thành "n điểm" là lập tức phải có.</li>
</ul>
<p class="meo">💡 Ba khối ứng với ba từ tiếng Việt bạn vẫn dùng khi giảng một việc cho người khác: <em>rồi</em> (tuần tự), <em>nếu</em> (rẽ nhánh), <em>trong khi / lặp lại</em> (lặp). Lập trình phần lớn là kỷ luật xác định mình đang nói cái nào trong ba cái đó.</p>`],

      [7, '1. Structured Programming',
        `<p class="y-chinh">🎯 The definition to memorise: code should be organised so that it is <strong>understandable, testable and readily modifiable</strong>, and it consists of simple logical constructs, <strong>each of which has one entry point and one exit point</strong>.</p>
<ul>
<li><strong>Three quality words, three different audiences</strong> — <em>understandable</em> (a human reading it), <em>testable</em> (you proving it works), <em>readily modifiable</em> (you or someone else changing it in six months). A program that runs correctly but satisfies none of the three is still bad code.</li>
<li><strong>One entry, one exit — what it actually forbids</strong> — jumping into the middle of a loop body, or leaving a block from three different places. If every construct has one way in and one way out, you can reason about it as a black box: "given these inputs, it leaves these outputs".</li>
<li><strong>Why that property makes hand-tracing possible</strong> — you can replace a whole <code>if…else</code> with the single line "after this, t holds the price" and keep tracing. Without single-exit, you would have to track every possible jump target at once. This is exactly the skill tested in the walkthrough part of the slot.</li>
<li><strong>"The beginning step for developing a program is DESIGN"</strong> — capitalised on the slide. The tools it names are <em>pseudo-coding</em> and <em>flow charting</em>. Design first, code second; slides 8–11 teach both tools.</li>
<li><strong>The historical villain</strong> — unrestricted <code>goto</code>. Code full of jumps was called "spaghetti code"; Dijkstra's 1968 letter "Go To Statement Considered Harmful" is the origin of this whole slide. C still has <code>goto</code>; PRF192 will never ask you to use it.</li>
<li><strong>Applied to this deck</strong> — every construct from slide 12 to slide 45 obeys single-entry/single-exit. When you later write <code>break</code> inside a loop you are deliberately punching a second exit; that is allowed, but it is a decision, not an accident.</li>
</ul>
<p class="pitfall">⚠️ Common misreading: "structured programming means using functions". Functions are Slot 08-09 (modularity). Structured programming is narrower and older — it is specifically about control flow having one way in and one way out.</p>`,
        `<p class="y-chinh">🎯 Định nghĩa cần thuộc: mã nguồn phải được tổ chức sao cho <strong>dễ hiểu, dễ kiểm thử và dễ sửa đổi</strong>, và nó gồm các khối logic đơn giản, <strong>mỗi khối có đúng một lối vào và một lối ra</strong>.</p>
<ul>
<li><strong>Ba từ chất lượng, ba đối tượng khác nhau</strong> — <em>dễ hiểu</em> (người đọc nó), <em>dễ kiểm thử</em> (bạn chứng minh nó chạy đúng), <em>dễ sửa đổi</em> (bạn hoặc người khác sửa nó sau sáu tháng). Chương trình chạy đúng mà không đạt cái nào trong ba thì vẫn là code tồi.</li>
<li><strong>Một vào, một ra — thực chất cấm điều gì</strong> — cấm nhảy thẳng vào giữa thân vòng lặp, hoặc thoát khỏi một khối từ ba chỗ khác nhau. Nếu mỗi khối chỉ có một đường vào và một đường ra, bạn có thể coi nó là hộp đen: "cho vào cái này thì ra cái kia".</li>
<li><strong>Vì sao tính chất đó khiến chạy tay được</strong> — bạn có quyền thay cả khối <code>if…else</code> bằng một dòng "sau đoạn này, t giữ số tiền" rồi chạy tiếp. Không có một-lối-ra thì phải theo dõi mọi đích nhảy cùng lúc. Đây đúng là kỹ năng mà phần walkthrough của slot kiểm tra.</li>
<li><strong>"Bước khởi đầu để phát triển chương trình là THIẾT KẾ"</strong> — slide viết hoa chữ này. Hai công cụ được nêu tên là <em>mã giả</em> và <em>lưu đồ</em>. Thiết kế trước, code sau; slide 8–11 dạy cả hai công cụ.</li>
<li><strong>Kẻ phản diện trong lịch sử</strong> — <code>goto</code> dùng bừa bãi. Code đầy lệnh nhảy bị gọi là "code mì sợi"; lá thư năm 1968 của Dijkstra "Go To Statement Considered Harmful" chính là nguồn gốc của cả slide này. C vẫn còn <code>goto</code>; PRF192 sẽ không bao giờ bắt bạn dùng nó.</li>
<li><strong>Áp vào bộ slide này</strong> — mọi khối từ slide 12 tới slide 45 đều tuân thủ một-vào-một-ra. Sau này khi bạn viết <code>break</code> trong vòng lặp là bạn đang cố ý đục thêm một lối ra thứ hai; điều đó được phép, nhưng phải là một quyết định, không phải một tai nạn.</li>
</ul>
<p class="pitfall">⚠️ Hiểu nhầm hay gặp: "lập trình có cấu trúc nghĩa là dùng hàm". Hàm là Slot 08-09 (tính module). Lập trình có cấu trúc hẹp hơn và ra đời sớm hơn — nó nói riêng về chuyện luồng điều khiển phải có một đường vào và một đường ra.</p>`],

      [8, 'Structured Programming — Pseudo-code',
        `<p class="y-chinh">🎯 Pseudo-code is "a set of shorthand notes in a human (non-programming) language that itemizes the key steps in the sequence of instructions that produce a programming solution".</p>
<ul>
<li><strong>Read the definition carefully</strong> — <em>human language</em>, <em>key steps</em>, <em>itemised</em>. No semicolons, no <code>#include</code>, no types. If your pseudo-code compiles, you wrote C, not pseudo-code.</li>
<li><strong>Example 1 on the slide, verbatim</strong> — "Calculating the absolute value of an integer inputted from the keyboard":
<pre><code>Prompt the user for an integer value
Accept an integer value from the user and store it in x
If x is negative then x = -x
Display x</code></pre></li>
<li><strong>Four lines, three constructs visible</strong> — lines 1, 2 and 4 are pure <em>sequence</em>; line 3 is a <em>selection</em> with no else branch. Notice there is no iteration: the task is done once.</li>
<li><strong>Hand-trace it, input x = -17</strong> — line 1: prompt shown · line 2: x = -17 · line 3: is -17 negative? yes ⟶ x = -(-17) = 17 · line 4: display 17.</li>
<li><strong>Hand-trace it, input x = 7</strong> — line 2: x = 7 · line 3: is 7 negative? no ⟶ line 3 does nothing, x stays 7 · line 4: display 7.</li>
<li><strong>Hand-trace it, input x = 0</strong> — line 3: is 0 negative? no (0 is neither positive nor negative) ⟶ x stays 0 · line 4: display 0. Correct, and it is the boundary case a tester would try first.</li>
</ul>
<p class="dap-an">✅ Đáp án: the three traces give |−17| = <strong>17</strong>, |7| = <strong>7</strong>, |0| = <strong>0</strong>. Verified by compiling the C version below with <code>cc -Wall</code>: input −17 prints 17, input 7 prints 7.</p>
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    int x;
    printf("Enter an integer: ");
    scanf("%d", &amp;x);
    if (x &lt; 0) x = -x;
    printf("|x| = %d\\n", x);
    return 0;
}</code></pre>
<p class="meo">💡 Good pseudo-code uses verbs from the problem domain ("Prompt", "Accept", "Display"), not from C ("printf", "scanf"). That is what makes the same design translate to three languages on the next slide.</p>`,
        `<p class="y-chinh">🎯 Mã giả là "một tập ghi chú tốc ký bằng ngôn ngữ con người (không phải ngôn ngữ lập trình), liệt kê các bước chính trong dãy lệnh tạo ra lời giải của bài toán".</p>
<ul>
<li><strong>Đọc kỹ định nghĩa</strong> — <em>ngôn ngữ con người</em>, <em>các bước chính</em>, <em>liệt kê từng mục</em>. Không dấu chấm phẩy, không <code>#include</code>, không kiểu dữ liệu. Nếu mã giả của bạn biên dịch được thì bạn đã viết C, không phải mã giả.</li>
<li><strong>Ví dụ 1 trên slide, nguyên văn</strong> — "Tính trị tuyệt đối của một số nguyên nhập từ bàn phím":
<pre><code>Prompt the user for an integer value
Accept an integer value from the user and store it in x
If x is negative then x = -x
Display x</code></pre></li>
<li><strong>Bốn dòng, nhìn thấy ba khối</strong> — dòng 1, 2 và 4 là <em>tuần tự</em> thuần tuý; dòng 3 là một <em>rẽ nhánh</em> không có nhánh ngược lại. Chú ý không có lặp: việc chỉ làm đúng một lần.</li>
<li><strong>Chạy tay với x = -17</strong> — dòng 1: hiện lời nhắc · dòng 2: x = -17 · dòng 3: -17 có âm không? có ⟶ x = -(-17) = 17 · dòng 4: hiện 17.</li>
<li><strong>Chạy tay với x = 7</strong> — dòng 2: x = 7 · dòng 3: 7 có âm không? không ⟶ dòng 3 không làm gì, x vẫn là 7 · dòng 4: hiện 7.</li>
<li><strong>Chạy tay với x = 0</strong> — dòng 3: 0 có âm không? không (0 không âm cũng không dương) ⟶ x vẫn 0 · dòng 4: hiện 0. Đúng, và đây là ca biên mà người kiểm thử sẽ thử đầu tiên.</li>
</ul>
<p class="dap-an">✅ Đáp án: ba lần chạy tay cho |−17| = <strong>17</strong>, |7| = <strong>7</strong>, |0| = <strong>0</strong>. Đã kiểm bằng cách biên dịch bản C dưới đây với <code>cc -Wall</code>: nhập −17 in ra 17, nhập 7 in ra 7.</p>
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    int x;
    printf("Enter an integer: ");
    scanf("%d", &amp;x);
    if (x &lt; 0) x = -x;
    printf("|x| = %d\\n", x);
    return 0;
}</code></pre>
<p class="meo">💡 Mã giả tốt dùng động từ của bài toán ("Nhắc", "Nhận", "Hiện"), không dùng động từ của C ("printf", "scanf"). Chính nhờ vậy mà cùng một thiết kế dịch được sang ba ngôn ngữ ở slide kế tiếp.</p>`],

      [9, 'Pseudo-code ⟶ a program (C, C++, Java)',
        `<p class="y-chinh">🎯 The same four-line pseudo-code, translated into C, C++ and Java side by side — proof that the <em>design</em> is the valuable artefact and the language is a detail.</p>
<ul>
<li><strong>The mapping is line-for-line</strong> — "Prompt the user" ⟶ an output call · "Accept … store it in x" ⟶ an input call · "If x is negative then x = -x" ⟶ an <code>if</code> · "Display x" ⟶ an output call. Four pseudo-code lines, four groups of statements.</li>
<li><strong>What changes between the three languages</strong> — only the I/O library and the boilerplate. C uses <code>printf</code>/<code>scanf</code>, C++ uses <code>cout</code>/<code>cin</code>, Java uses <code>System.out.println</code> and a <code>Scanner</code>.</li>
<li><strong>What does NOT change</strong> — the <code>if (x &lt; 0) x = -x;</code> line is character-for-character identical in all three. Control flow is the shared core of the whole C family, which is why learning it once in PRF192 pays off in every later course.</li>
<li><strong>Worked translation, C</strong>:
<pre><code>int x;
printf("Enter an integer: ");
scanf("%d", &amp;x);
if (x &lt; 0) x = -x;
printf("%d\\n", x);</code></pre></li>
<li><strong>Worked translation, C++ and Java (for comparison only)</strong> — C++: <code>int x; std::cin &gt;&gt; x; if (x &lt; 0) x = -x; std::cout &lt;&lt; x;</code> · Java: <code>int x = sc.nextInt(); if (x &lt; 0) x = -x; System.out.println(x);</code>. The exam only asks for the C column, but seeing the other two is the point of the slide.</li>
<li><strong>The practical lesson</strong> — when you get stuck coding, go back one level and fix the pseudo-code. A bug in the design shows up as three bugs in the code.</li>
</ul>
<p class="dap-an">✅ Đáp án: with input −17 all three programs print <strong>17</strong>; with input 7 all three print <strong>7</strong>. The C version was compiled with <code>cc -Wall</code> and run to confirm.</p>
<p class="meo">💡 Interview-proof phrasing: "pseudo-code is language-independent; source code is language-specific". One sentence, full marks.</p>`,
        `<p class="y-chinh">🎯 Vẫn bốn dòng mã giả đó, dịch song song sang C, C++ và Java — bằng chứng rằng <em>thiết kế</em> mới là sản phẩm có giá trị, còn ngôn ngữ chỉ là chi tiết.</p>
<ul>
<li><strong>Ánh xạ là một-dòng-một-dòng</strong> — "Nhắc người dùng" ⟶ một lời gọi xuất · "Nhận … lưu vào x" ⟶ một lời gọi nhập · "Nếu x âm thì x = -x" ⟶ một câu <code>if</code> · "Hiện x" ⟶ một lời gọi xuất. Bốn dòng mã giả, bốn nhóm câu lệnh.</li>
<li><strong>Cái gì đổi giữa ba ngôn ngữ</strong> — chỉ thư viện vào/ra và phần khung. C dùng <code>printf</code>/<code>scanf</code>, C++ dùng <code>cout</code>/<code>cin</code>, Java dùng <code>System.out.println</code> và một <code>Scanner</code>.</li>
<li><strong>Cái gì KHÔNG đổi</strong> — dòng <code>if (x &lt; 0) x = -x;</code> giống hệt nhau tới từng ký tự ở cả ba. Luồng điều khiển là phần lõi dùng chung của cả họ nhà C, nên học một lần ở PRF192 là dùng được cho mọi môn sau.</li>
<li><strong>Bản dịch đã giải, C</strong>:
<pre><code>int x;
printf("Enter an integer: ");
scanf("%d", &amp;x);
if (x &lt; 0) x = -x;
printf("%d\\n", x);</code></pre></li>
<li><strong>Bản dịch C++ và Java (chỉ để đối chiếu)</strong> — C++: <code>int x; std::cin &gt;&gt; x; if (x &lt; 0) x = -x; std::cout &lt;&lt; x;</code> · Java: <code>int x = sc.nextInt(); if (x &lt; 0) x = -x; System.out.println(x);</code>. Đề thi chỉ hỏi cột C, nhưng nhìn thấy hai cột kia mới là ý đồ của slide.</li>
<li><strong>Bài học thực dụng</strong> — khi bí lúc code, hãy lùi một bậc và sửa mã giả. Một lỗi trong thiết kế sẽ hiện ra thành ba lỗi trong code.</li>
</ul>
<p class="dap-an">✅ Đáp án: với đầu vào −17 cả ba chương trình in <strong>17</strong>; với đầu vào 7 cả ba in <strong>7</strong>. Bản C đã được biên dịch bằng <code>cc -Wall</code> và chạy để xác nhận.</p>
<p class="meo">💡 Câu nói an toàn cho mọi kỳ phỏng vấn: "mã giả độc lập ngôn ngữ; mã nguồn phụ thuộc ngôn ngữ". Một câu, trọn điểm.</p>`],

      [10, 'Structured Programming – flowcharting',
        `<p class="y-chinh">🎯 A flowchart is "a set of conventional symbols connected by arrows that illustrate the flow of control through a programming solution" — a picture of the same thing pseudo-code writes in words.</p>
<ul>
<li><strong>The conventional symbols</strong> — <em>oval/rounded</em> = start and end (terminator) · <em>parallelogram</em> = input/output · <em>rectangle</em> = process (a computation or assignment) · <em>diamond</em> = decision (a condition, with a TRUE branch and a FALSE branch) · <em>arrow</em> = flow of control.</li>
<li><strong>Why a diamond has exactly two exits</strong> — because a C condition is an expression that is either zero or non-zero. Every selection you draw, however many <code>else if</code> branches it has, is built from diamonds with two exits each.</li>
<li><strong>The slide shows one shape per construct</strong> — sequence: boxes stacked vertically with one arrow between them · selection: a diamond that splits and then <em>re-joins</em> · iteration: a diamond whose FALSE branch continues and whose TRUE branch loops back above the diamond.</li>
<li><strong>The re-join is the single-exit rule made visible</strong> — notice that on the slide's selection symbol the two branches come back together before continuing. That is exactly the "one exit point" from slide 7, drawn.</li>
<li><strong>Flowchart versus pseudo-code — when to use which</strong> — flowcharts are better for showing <em>branching and looping shape</em> at a glance; pseudo-code is better for detail and is far faster to write. Real designers sketch a flowchart for the hard part and write pseudo-code for the rest.</li>
<li><strong>What the exam does with this</strong> — it gives you a flowchart and asks for the output, or gives you code and asks which flowchart matches. Both are trace exercises; neither requires artistic drawing.</li>
</ul>
<p class="pitfall">⚠️ A diamond is a <em>question</em>, never an action. Writing <code>x = -x</code> inside a diamond is wrong — assignments go in rectangles. Conversely <code>x &lt; 0</code> inside a rectangle is wrong. Markers do deduct for this.</p>`,
        `<p class="y-chinh">🎯 Lưu đồ là "một tập ký hiệu quy ước nối bằng các mũi tên, minh hoạ luồng điều khiển đi qua lời giải" — bức tranh của đúng thứ mà mã giả diễn đạt bằng chữ.</p>
<ul>
<li><strong>Các ký hiệu quy ước</strong> — <em>hình bầu dục</em> = bắt đầu và kết thúc · <em>hình bình hành</em> = nhập/xuất · <em>hình chữ nhật</em> = xử lý (một phép tính hoặc một phép gán) · <em>hình thoi</em> = quyết định (một điều kiện, có nhánh TRUE và nhánh FALSE) · <em>mũi tên</em> = luồng điều khiển.</li>
<li><strong>Vì sao hình thoi luôn có đúng hai lối ra</strong> — vì điều kiện trong C là một biểu thức, chỉ có thể bằng 0 hoặc khác 0. Mọi rẽ nhánh bạn vẽ, dù có bao nhiêu nhánh <code>else if</code>, đều ghép từ các hình thoi hai lối ra.</li>
<li><strong>Slide trình bày một hình dạng cho mỗi khối</strong> — tuần tự: các hộp xếp dọc, giữa chúng một mũi tên · rẽ nhánh: một hình thoi tách ra rồi <em>nhập lại</em> · lặp: một hình thoi mà nhánh FALSE đi tiếp còn nhánh TRUE vòng ngược lên phía trên hình thoi.</li>
<li><strong>Chỗ nhập lại chính là quy tắc một-lối-ra được vẽ ra</strong> — để ý trên ký hiệu rẽ nhánh của slide, hai nhánh gặp lại nhau trước khi đi tiếp. Đó đúng là "một lối ra duy nhất" của slide 7, ở dạng hình vẽ.</li>
<li><strong>Lưu đồ so với mã giả — khi nào dùng cái nào</strong> — lưu đồ tốt hơn khi cần thấy ngay <em>hình dạng rẽ nhánh và vòng lặp</em>; mã giả tốt hơn khi cần chi tiết và viết nhanh hơn nhiều. Người thiết kế thật sẽ phác lưu đồ cho đoạn khó và viết mã giả cho phần còn lại.</li>
<li><strong>Đề thi làm gì với phần này</strong> — đưa lưu đồ và hỏi kết quả in ra, hoặc đưa code và hỏi lưu đồ nào khớp. Cả hai đều là bài chạy tay; không bài nào đòi vẽ đẹp.</li>
</ul>
<p class="pitfall">⚠️ Hình thoi là một <em>câu hỏi</em>, không bao giờ là một hành động. Viết <code>x = -x</code> trong hình thoi là sai — phép gán phải nằm trong hình chữ nhật. Ngược lại, <code>x &lt; 0</code> nằm trong hình chữ nhật cũng sai. Người chấm có trừ điểm chỗ này.</p>`],

      [11, 'Flowchart — Example (absolute value)',
        `<p class="y-chinh">🎯 The absolute-value problem again, now as a picture: Begin ⟶ input x ⟶ diamond "x &lt; 0?" ⟶ (TRUE) x = −x ⟶ re-join ⟶ output x ⟶ End.</p>
<ul>
<li><strong>Six symbols, in order</strong> — oval "Begin" · parallelogram "Accept x" · diamond "x &lt; 0?" · rectangle "x = -x" on the TRUE arm · parallelogram "Display x" after the arms re-join · oval "End".</li>
<li><strong>Why the FALSE arm is empty</strong> — this is an <code>if</code> with no <code>else</code>. The FALSE arrow goes straight to the re-join point. In C that is exactly <code>if (x &lt; 0) x = -x;</code> with nothing after it.</li>
<li><strong>Trace 1 — x = −17</strong>: Begin · read x, x = −17 · diamond: −17 &lt; 0 ⟶ TRUE · rectangle: x = −(−17) = 17 · re-join · display 17 · End.</li>
<li><strong>Trace 2 — x = 7</strong>: read x, x = 7 · diamond: 7 &lt; 0 ⟶ FALSE · skip the rectangle entirely, x unchanged · display 7 · End.</li>
<li><strong>Trace 3 — x = 0</strong>: read x, x = 0 · diamond: 0 &lt; 0 ⟶ FALSE (this is why the test must be <code>&lt;</code> and not <code>&lt;=</code>; either works here, but only <code>&lt;</code> says what you mean) · display 0 · End.</li>
<li><strong>Trace table — the format the exam expects</strong>:
<pre><code>step        input=-17   input=7   input=0
read x          -17          7        0
x &lt; 0 ?        TRUE      FALSE    FALSE
x = -x           17          -        -
display          17          7        0</code></pre></li>
</ul>
<p class="dap-an">✅ Đáp án: outputs are <strong>17, 7, 0</strong> for inputs −17, 7, 0. Confirmed by compiling and running the C program from slide 8: input −17 printed <code>|x| = 17</code>, input 7 printed <code>|x| = 7</code>.</p>
<p class="pitfall">⚠️ <code>INT_MIN</code> (−2147483648 on a 32-bit <code>int</code>) is the one input this flowchart gets wrong: −(−2147483648) overflows and stays negative. The slide does not mention it, and the exam will not ask — but it is the classic example of "the design is right for the stated range, not for all inputs".</p>`,
        `<p class="y-chinh">🎯 Vẫn bài trị tuyệt đối, giờ ở dạng hình: Begin ⟶ nhập x ⟶ hình thoi "x &lt; 0?" ⟶ (TRUE) x = −x ⟶ nhập lại ⟶ xuất x ⟶ End.</p>
<ul>
<li><strong>Sáu ký hiệu, theo thứ tự</strong> — bầu dục "Begin" · bình hành "Nhận x" · hình thoi "x &lt; 0?" · chữ nhật "x = -x" trên nhánh TRUE · bình hành "Hiện x" sau khi hai nhánh nhập lại · bầu dục "End".</li>
<li><strong>Vì sao nhánh FALSE rỗng</strong> — đây là một <code>if</code> không có <code>else</code>. Mũi tên FALSE đi thẳng tới điểm nhập lại. Trong C đó đúng là <code>if (x &lt; 0) x = -x;</code> và không có gì phía sau.</li>
<li><strong>Vết 1 — x = −17</strong>: Begin · đọc x, x = −17 · hình thoi: −17 &lt; 0 ⟶ TRUE · chữ nhật: x = −(−17) = 17 · nhập lại · hiện 17 · End.</li>
<li><strong>Vết 2 — x = 7</strong>: đọc x, x = 7 · hình thoi: 7 &lt; 0 ⟶ FALSE · bỏ qua hẳn hình chữ nhật, x không đổi · hiện 7 · End.</li>
<li><strong>Vết 3 — x = 0</strong>: đọc x, x = 0 · hình thoi: 0 &lt; 0 ⟶ FALSE (đây là lý do phép thử phải là <code>&lt;</code> chứ không phải <code>&lt;=</code>; ở đây cả hai đều ra đúng, nhưng chỉ <code>&lt;</code> nói đúng điều bạn nghĩ) · hiện 0 · End.</li>
<li><strong>Bảng vết — đúng định dạng đề thi mong đợi</strong>:
<pre><code>bước         vào=-17    vào=7    vào=0
đọc x           -17         7        0
x &lt; 0 ?        TRUE     FALSE    FALSE
x = -x           17         -        -
hiện             17         7        0</code></pre></li>
</ul>
<p class="dap-an">✅ Đáp án: kết quả in ra là <strong>17, 7, 0</strong> ứng với đầu vào −17, 7, 0. Đã xác nhận bằng cách biên dịch và chạy chương trình C ở slide 8: nhập −17 in <code>|x| = 17</code>, nhập 7 in <code>|x| = 7</code>.</p>
<p class="pitfall">⚠️ <code>INT_MIN</code> (−2147483648 với <code>int</code> 32 bit) là đầu vào duy nhất mà lưu đồ này làm sai: −(−2147483648) tràn số và vẫn âm. Slide không nhắc, đề thi cũng sẽ không hỏi — nhưng đây là ví dụ kinh điển cho câu "thiết kế đúng trong miền đã nêu, không phải đúng với mọi đầu vào".</p>`],

      [12, '2. Sequence Constructs — simple statements & code blocks',
        `<p class="y-chinh">🎯 "A sequence is either a simple statement or a code block." Two syntaxes, one idea: a chunk of work with one entry and one exit.</p>
<ul>
<li><strong>Simple statement — syntax <code>Expression;</code></strong> — an expression plus a semicolon. The semicolon is not decoration: it is what turns the <em>expression</em> <code>a + b</code> into the <em>statement</em> <code>a + b;</code>. In C the semicolon is a terminator, not a separator.</li>
<li><strong>Code block — "a set of statements enclosed in curly braces"</strong>:
<pre><code>{
    statement
    ...
    statement
}</code></pre>
A block counts as <strong>one</strong> statement everywhere the grammar expects a statement. That single sentence is the whole reason <code>if (c) { … }</code> works.</li>
<li><strong>Where this matters immediately</strong> — <code>if (condition) statement</code> takes exactly <em>one</em> statement. Want two? Wrap them in a block. Forget the braces and only the first line is controlled by the <code>if</code>:
<pre><code>if (x &lt; 0)
    printf("negative\\n");
    x = -x;          /* NOT part of the if — always runs */</code></pre></li>
<li><strong>The empty statement</strong> — a lone <code>;</code> is a legal statement that does nothing. That is why <code>if (x &gt; 0);</code> compiles silently and then does nothing, one of the most painful typos in C.</li>
<li><strong>Blocks and scope</strong> — a variable declared inside a block exists only inside it. This becomes important in Slot 08-09, but the rule starts here.</li>
<li><strong>Style rule worth adopting today</strong> — always write braces, even for one statement. It costs two characters and immunises you against both the missing-brace bug above and the dangling-else bug on slide 18.</li>
</ul>
<p class="dap-an">✅ Đáp án for the trap above, with x = −5: the program prints <code>negative</code> and then runs <code>x = -x;</code> unconditionally, so x becomes 5. With x = 5: nothing is printed, but <code>x = -x;</code> still runs and x becomes <strong>−5</strong> — the opposite of what the code looks like it does.</p>`,
        `<p class="y-chinh">🎯 "Một khối tuần tự là một câu lệnh đơn hoặc một khối lệnh." Hai cú pháp, một ý tưởng: một mẩu công việc có một lối vào và một lối ra.</p>
<ul>
<li><strong>Câu lệnh đơn — cú pháp <code>Expression;</code></strong> — một biểu thức cộng dấu chấm phẩy. Dấu chấm phẩy không phải đồ trang trí: chính nó biến <em>biểu thức</em> <code>a + b</code> thành <em>câu lệnh</em> <code>a + b;</code>. Trong C dấu chấm phẩy là dấu kết thúc, không phải dấu ngăn cách.</li>
<li><strong>Khối lệnh — "một tập câu lệnh đặt trong cặp ngoặc nhọn"</strong>:
<pre><code>{
    statement
    ...
    statement
}</code></pre>
Một khối được tính là <strong>MỘT</strong> câu lệnh ở mọi chỗ ngữ pháp đòi một câu lệnh. Đúng một câu đó là toàn bộ lý do <code>if (c) { … }</code> chạy được.</li>
<li><strong>Chỗ này có tác dụng ngay lập tức</strong> — <code>if (condition) statement</code> chỉ nhận đúng <em>một</em> câu lệnh. Muốn hai? Bọc chúng vào một khối. Quên ngoặc là chỉ dòng đầu chịu sự chi phối của <code>if</code>:
<pre><code>if (x &lt; 0)
    printf("negative\\n");
    x = -x;          /* KHÔNG thuộc if — luôn luôn chạy */</code></pre></li>
<li><strong>Câu lệnh rỗng</strong> — một dấu <code>;</code> đứng một mình là câu lệnh hợp lệ và không làm gì. Nhờ vậy <code>if (x &gt; 0);</code> biên dịch im lặng rồi chẳng làm gì, một trong những lỗi gõ nhầm đau đớn nhất của C.</li>
<li><strong>Khối và phạm vi</strong> — biến khai báo bên trong một khối chỉ tồn tại bên trong khối đó. Điều này quan trọng từ Slot 08-09, nhưng quy tắc bắt đầu ngay tại đây.</li>
<li><strong>Quy tắc phong cách nên nhận ngay hôm nay</strong> — luôn viết ngoặc nhọn, kể cả khi chỉ có một câu lệnh. Nó tốn hai ký tự và miễn nhiễm cho bạn với cả lỗi thiếu-ngoặc ở trên lẫn lỗi dangling else ở slide 18.</li>
</ul>
<p class="dap-an">✅ Đáp án cho cái bẫy ở trên, với x = −5: chương trình in <code>negative</code> rồi chạy <code>x = -x;</code> vô điều kiện, nên x thành 5. Với x = 5: không in gì, nhưng <code>x = -x;</code> vẫn chạy và x thành <strong>−5</strong> — ngược hẳn với cái mà đoạn code trông như đang làm.</p>`],

      [13, '3. Selection Constructs — the whole family',
        `<p class="y-chinh">🎯 The map of the next ten slides: selection splits into <strong>Select 1/2</strong> (<code>if</code>, <code>if…else</code>, <code>? :</code>) and <strong>Select 1/n</strong> (<code>if…else if…else</code>, <code>switch</code>).</p>
<ul>
<li><strong>Select 1 of 2 — one condition, two outcomes</strong>. The slide's picture: a diamond "Condition?" with <em>Operation 1</em> on the TRUE arm and <em>Operation 2</em> on the FALSE arm, both re-joining afterwards. The C forms are <code>if</code> (slide 14), <code>if…else</code> (slide 14) and the <code>? :</code> operator (slide 20).</li>
<li><strong>Select 1 of n — one value, many outcomes</strong>. The slide's picture: an "Integral expression" box fanning out to <em>Op1…Op4</em> under labels <em>c1, c2, c3, default</em>. The C forms are the <code>else if</code> chain (slides 16–17) and <code>switch</code> (slides 21–23).</li>
<li><strong>Why two families and not one</strong> — an <code>else if</code> chain evaluates a <em>different condition</em> at each step, so it handles ranges (<code>N &lt;= 3</code>, then <code>N &lt;= 6</code>, …). <code>switch</code> compares <em>one value</em> against constants, so it handles menus and codes. Ranges ⟶ <code>else if</code>; discrete values ⟶ <code>switch</code>.</li>
<li><strong>Note the word "Integral" on the slide</strong> — it is not decoration. <code>switch</code> works only on <code>int</code>, <code>char</code>, <code>short</code>, <code>long</code> and enums. It cannot switch on a <code>float</code>, a <code>double</code> or a string. Slide 21 repeats this as "char / int".</li>
<li><strong>Everything is built from two-way diamonds</strong> — even <code>switch</code> is compiled either into a chain of comparisons or into a jump table. The n-way picture is a convenience for humans, not a new kind of machine instruction.</li>
<li><strong>Choosing correctly, in one question</strong> — ask "am I testing a <em>range</em> or an <em>exact value</em>?" Range ⟶ <code>if…else if</code>. Exact value from a small fixed set ⟶ <code>switch</code>. That question answers 100% of exam cases.</li>
</ul>
<p class="meo">💡 Draw the two pictures from this slide on your cheat sheet: one diamond with two arms, and one box with four arrows. Every selection question in PRF192 is one of those two shapes.</p>`,
        `<p class="y-chinh">🎯 Bản đồ của mười slide kế tiếp: rẽ nhánh chia làm <strong>Chọn 1/2</strong> (<code>if</code>, <code>if…else</code>, <code>? :</code>) và <strong>Chọn 1/n</strong> (<code>if…else if…else</code>, <code>switch</code>).</p>
<ul>
<li><strong>Chọn 1 trong 2 — một điều kiện, hai kết cục</strong>. Hình trên slide: một hình thoi "Condition?" với <em>Operation 1</em> ở nhánh TRUE và <em>Operation 2</em> ở nhánh FALSE, sau đó nhập lại. Các dạng trong C là <code>if</code> (slide 14), <code>if…else</code> (slide 14) và toán tử <code>? :</code> (slide 20).</li>
<li><strong>Chọn 1 trong n — một giá trị, nhiều kết cục</strong>. Hình trên slide: một hộp "Integral expression" toả ra <em>Op1…Op4</em> dưới các nhãn <em>c1, c2, c3, default</em>. Các dạng trong C là chuỗi <code>else if</code> (slide 16–17) và <code>switch</code> (slide 21–23).</li>
<li><strong>Vì sao hai họ chứ không phải một</strong> — chuỗi <code>else if</code> tính một <em>điều kiện khác nhau</em> ở mỗi bước, nên nó xử được các khoảng (<code>N &lt;= 3</code>, rồi <code>N &lt;= 6</code>, …). Còn <code>switch</code> so <em>một giá trị</em> với các hằng, nên nó xử menu và mã lệnh. Khoảng ⟶ <code>else if</code>; giá trị rời rạc ⟶ <code>switch</code>.</li>
<li><strong>Chú ý chữ "Integral" trên slide</strong> — đó không phải chữ trang trí. <code>switch</code> chỉ chạy trên <code>int</code>, <code>char</code>, <code>short</code>, <code>long</code> và enum. Nó không switch được trên <code>float</code>, <code>double</code> hay chuỗi. Slide 21 nhắc lại bằng cụm "char / int".</li>
<li><strong>Mọi thứ đều dựng từ hình thoi hai nhánh</strong> — ngay cả <code>switch</code> cũng được dịch thành một chuỗi phép so sánh hoặc một bảng nhảy. Bức tranh n-nhánh là tiện lợi cho con người, không phải một loại lệnh máy mới.</li>
<li><strong>Chọn đúng, gói trong một câu hỏi</strong> — tự hỏi "mình đang kiểm một <em>khoảng</em> hay một <em>giá trị chính xác</em>?". Khoảng ⟶ <code>if…else if</code>. Giá trị chính xác lấy từ một tập nhỏ cố định ⟶ <code>switch</code>. Câu hỏi đó trả lời được 100% trường hợp trong đề thi.</li>
</ul>
<p class="meo">💡 Vẽ hai bức hình của slide này vào tờ giấy ôn: một hình thoi hai nhánh, và một hộp bốn mũi tên. Mọi câu hỏi rẽ nhánh của PRF192 đều là một trong hai hình đó.</p>`],

      [14, 'Selection Constructs — if … else',
        `<p class="y-chinh">🎯 Two syntaxes side by side: <code>if (condition) { statements }</code> alone, and <code>if (condition) { statements } else { statements }</code>.</p>
<ul>
<li><strong>Form 1 — <code>if</code> with no else</strong> — "do this extra work only under this condition". The FALSE path does nothing, as in the absolute-value flowchart on slide 11.</li>
<li><strong>Form 2 — <code>if…else</code></strong> — "do exactly one of these two". The two branches are mutually exclusive and jointly exhaustive: one of them always runs, never both.</li>
<li><strong>Grammar details that cost marks</strong> — the parentheses around the condition are compulsory · there is <strong>no</strong> semicolon after <code>)</code> · there is <strong>no</strong> semicolon after <code>}</code> · the word <code>then</code> does not exist in C (that is Pascal).</li>
<li><strong>The condition is any expression</strong> — <code>if (x)</code> means "if x is non-zero". <code>if (x != 0)</code> is identical but says so out loud; prefer it.</li>
<li><strong>The single biggest beginner bug: <code>=</code> versus <code>==</code></strong>. <code>==</code> asks "are these equal?" and yields 1 or 0. <code>=</code> <em>assigns</em> and yields the value assigned. Both are expressions, so both compile:
<pre><code>int x = 5;
if (x = 0)  printf("THEN\\n");
else        printf("ELSE, x=%d\\n", x);</code></pre></li>
<li><strong>Trace it</strong> — <code>x = 0</code> stores 0 into x <em>and</em> evaluates to 0 · 0 means false · so the ELSE branch runs · and x has been silently destroyed: it is now 0, not 5. The test did not test anything; it overwrote the variable.</li>
<li><strong>Worse still, <code>if (x = 7)</code> is always TRUE</strong> — it assigns 7, and 7 is non-zero. A condition that is <em>always</em> true or <em>always</em> false is the signature of this bug.</li>
</ul>
<p class="dap-an">✅ Đáp án (compiled with <code>cc -Wall</code> and run): <code>if (x = 0)</code> with x initially 5 prints <code>ELSE, x=0</code> — the else branch, and x is destroyed. <code>if (y = 7)</code> with y initially 5 prints <code>THEN, y=7</code>. The compiler emits <em>"using the result of an assignment as a condition without parentheses"</em> — so <strong>always compile with <code>-Wall</code></strong>; it catches this for free.</p>
<p class="meo">💡 Defensive habit for constant comparisons: write the constant on the left — <code>if (0 == x)</code>. If you slip and type <code>if (0 = x)</code> the compiler <em>errors</em> instead of silently accepting it, because you cannot assign to a constant.</p>`,
        `<p class="y-chinh">🎯 Hai cú pháp đặt cạnh nhau: <code>if (condition) { statements }</code> đứng một mình, và <code>if (condition) { statements } else { statements }</code>.</p>
<ul>
<li><strong>Dạng 1 — <code>if</code> không có else</strong> — "chỉ làm thêm việc này khi điều kiện đúng". Đường FALSE không làm gì, đúng như lưu đồ trị tuyệt đối ở slide 11.</li>
<li><strong>Dạng 2 — <code>if…else</code></strong> — "làm đúng một trong hai". Hai nhánh loại trừ nhau và phủ kín: luôn có đúng một nhánh chạy, không bao giờ cả hai.</li>
<li><strong>Chi tiết ngữ pháp hay mất điểm</strong> — cặp ngoặc tròn quanh điều kiện là bắt buộc · <strong>không</strong> có dấu chấm phẩy sau <code>)</code> · <strong>không</strong> có dấu chấm phẩy sau <code>}</code> · từ khoá <code>then</code> không tồn tại trong C (đó là Pascal).</li>
<li><strong>Điều kiện là một biểu thức bất kỳ</strong> — <code>if (x)</code> nghĩa là "nếu x khác 0". <code>if (x != 0)</code> hoàn toàn tương đương nhưng nói rõ ra; nên dùng cách này.</li>
<li><strong>Lỗi lớn nhất của người mới: <code>=</code> với <code>==</code></strong>. <code>==</code> hỏi "hai cái này bằng nhau không?" và cho ra 1 hoặc 0. <code>=</code> thì <em>gán</em> và cho ra chính giá trị vừa gán. Cả hai đều là biểu thức, nên cả hai đều biên dịch được:
<pre><code>int x = 5;
if (x = 0)  printf("THEN\\n");
else        printf("ELSE, x=%d\\n", x);</code></pre></li>
<li><strong>Chạy tay</strong> — <code>x = 0</code> lưu 0 vào x <em>và</em> cho giá trị 0 · 0 nghĩa là sai · nên nhánh ELSE chạy · và x đã bị phá âm thầm: bây giờ nó là 0, không còn là 5. Phép thử không thử được gì; nó ghi đè lên biến.</li>
<li><strong>Tệ hơn nữa, <code>if (x = 7)</code> luôn luôn ĐÚNG</strong> — nó gán 7, mà 7 khác 0. Một điều kiện <em>luôn</em> đúng hoặc <em>luôn</em> sai chính là dấu vân tay của lỗi này.</li>
</ul>
<p class="dap-an">✅ Đáp án (đã biên dịch bằng <code>cc -Wall</code> và chạy thật): <code>if (x = 0)</code> với x ban đầu bằng 5 in ra <code>ELSE, x=0</code> — chạy nhánh else, và x bị phá. <code>if (y = 7)</code> với y ban đầu bằng 5 in ra <code>THEN, y=7</code>. Trình biên dịch có cảnh báo <em>"using the result of an assignment as a condition without parentheses"</em> — nên <strong>luôn biên dịch với <code>-Wall</code></strong>; nó bắt lỗi này miễn phí.</p>
<p class="meo">💡 Thói quen phòng thủ khi so với hằng: viết hằng bên trái — <code>if (0 == x)</code>. Lỡ gõ nhầm thành <code>if (0 = x)</code> thì trình biên dịch <em>báo lỗi</em> chứ không im lặng chấp nhận, vì không thể gán vào một hằng.</p>`],

      [15, 'Selection Constructs — if … else (cont.)',
        `<p class="y-chinh">🎯 The warning line on this slide: <em>"The compiler can not determine the if statement before the else statement."</em> In plain words — an <code>else</code> must be attached to an <code>if</code> that the compiler can still see, and nothing may come between them.</p>
<ul>
<li><strong>What the sentence is really about</strong> — <code>else</code> is not a statement of its own. It is a <em>clause</em> of the <code>if</code> statement. So the parser must be able to say "this <code>else</code> continues that <code>if</code>". If the <code>if</code> was already terminated, there is nothing to continue and you get <code>error: 'else' without a previous 'if'</code>.</li>
<li><strong>Killer number one — a stray semicolon</strong>:
<pre><code>if (x &gt; 0);            /* ← this ; ENDS the if statement */
    printf("pos\\n");
else                   /* compile error: this else has no if */
    printf("neg\\n");</code></pre>
The <code>;</code> is the empty statement from slide 12, and it becomes the <code>if</code>'s body. The <code>printf</code> is then an ordinary statement, and the <code>else</code> has nothing to attach to.</li>
<li><strong>Killer number two — two statements without braces</strong>:
<pre><code>if (x &gt; 0)
    printf("pos\\n");
    x = 0;             /* ← the if already ended here */
else                   /* compile error */
    printf("neg\\n");</code></pre>
Same cause: the <code>if</code> owns exactly one statement, so it finished at the first semicolon.</li>
<li><strong>The fix is always the same</strong> — braces:
<pre><code>if (x &gt; 0) {
    printf("pos\\n");
    x = 0;
} else {
    printf("neg\\n");
}</code></pre></li>
<li><strong>Why this error message confuses everyone</strong> — the compiler points at the <code>else</code> line, but the mistake is one or two lines <em>above</em> it. GCC words it <code>error: 'else' without a previous 'if'</code>; clang (the default <code>cc</code> on macOS) only says <code>error: expected expression</code> at the <code>else</code>, which is far less helpful. Either way, look <em>upward</em> for a stray <code>;</code> or a missing <code>{</code>.</li>
<li><strong>Connection to the next two slides</strong> — this slide is about an <code>else</code> that has <em>no</em> <code>if</code>. Slides 18–19 are the opposite problem: an <code>else</code> that has <em>two</em> candidate <code>if</code>s. Both are solved by the same habit of always bracing.</li>
</ul>
<p class="dap-an">✅ Đáp án: both broken snippets above <strong>fail to compile</strong> — verified by actually compiling the first one, which also emits <code>warning: if statement has empty body [-Wempty-body]</code> pointing straight at the stray <code>;</code> before erroring on the <code>else</code>. The braced version compiles cleanly under <code>cc -Wall</code>, and with x = 5 prints <code>pos</code> then sets x to 0; with x = −5 prints <code>neg</code>.</p>`,
        `<p class="y-chinh">🎯 Dòng cảnh báo trên slide: <em>"The compiler can not determine the if statement before the else statement."</em> Nói nôm na — một <code>else</code> phải gắn vào một <code>if</code> mà trình biên dịch còn "nhìn thấy", và không được có gì chen vào giữa.</p>
<ul>
<li><strong>Câu đó thực chất nói về cái gì</strong> — <code>else</code> không phải một câu lệnh độc lập. Nó là một <em>mệnh đề</em> của câu lệnh <code>if</code>. Nên bộ phân tích cú pháp phải nói được "cái <code>else</code> này nối tiếp cái <code>if</code> kia". Nếu <code>if</code> đã kết thúc rồi thì chẳng còn gì để nối, và bạn nhận <code>error: 'else' without a previous 'if'</code>.</li>
<li><strong>Thủ phạm số một — một dấu chấm phẩy lạc</strong>:
<pre><code>if (x &gt; 0);            /* ← dấu ; này KẾT THÚC câu lệnh if */
    printf("pos\\n");
else                   /* lỗi biên dịch: else này không có if nào */
    printf("neg\\n");</code></pre>
Dấu <code>;</code> chính là câu lệnh rỗng ở slide 12, và nó trở thành thân của <code>if</code>. Câu <code>printf</code> khi đó chỉ là một câu lệnh bình thường, còn <code>else</code> không còn chỗ bám.</li>
<li><strong>Thủ phạm số hai — hai câu lệnh mà không có ngoặc nhọn</strong>:
<pre><code>if (x &gt; 0)
    printf("pos\\n");
    x = 0;             /* ← if đã kết thúc ở đây rồi */
else                   /* lỗi biên dịch */
    printf("neg\\n");</code></pre>
Cùng nguyên nhân: <code>if</code> chỉ sở hữu đúng một câu lệnh, nên nó đã hết ở dấu chấm phẩy đầu tiên.</li>
<li><strong>Cách chữa luôn luôn giống nhau</strong> — ngoặc nhọn:
<pre><code>if (x &gt; 0) {
    printf("pos\\n");
    x = 0;
} else {
    printf("neg\\n");
}</code></pre></li>
<li><strong>Vì sao thông báo lỗi này làm ai cũng rối</strong> — trình biên dịch chỉ vào dòng <code>else</code>, nhưng lỗi nằm ở một hoặc hai dòng <em>phía trên</em>. GCC ghi là <code>error: 'else' without a previous 'if'</code>; còn clang (chính là <code>cc</code> mặc định trên macOS) chỉ ghi <code>error: expected expression</code> ngay tại <code>else</code>, đỡ rõ ràng hơn nhiều. Kiểu gì cũng vậy: hãy nhìn <em>ngược lên</em> tìm một dấu <code>;</code> lạc hoặc một dấu <code>{</code> còn thiếu.</li>
<li><strong>Liên hệ với hai slide kế tiếp</strong> — slide này nói về một <code>else</code> <em>không có</em> <code>if</code>. Slide 18–19 là bài toán ngược lại: một <code>else</code> có <em>hai</em> ứng viên <code>if</code>. Cả hai đều chữa bằng cùng một thói quen: luôn đóng ngoặc nhọn.</li>
</ul>
<p class="dap-an">✅ Đáp án: cả hai đoạn hỏng ở trên đều <strong>không biên dịch được</strong> — đã kiểm bằng cách biên dịch thật đoạn thứ nhất, nó còn in thêm <code>warning: if statement has empty body [-Wempty-body]</code> chỉ thẳng vào dấu <code>;</code> lạc trước khi báo lỗi ở <code>else</code>. Bản có ngoặc nhọn biên dịch sạch với <code>cc -Wall</code>, và với x = 5 in <code>pos</code> rồi đặt x về 0; với x = −5 in <code>neg</code>.</p>`],

      [16, 'Selection Constructs — if … else if … else (Nested if) · Example 1',
        `<p class="y-chinh">🎯 The <code>else if</code> chain: conditions are tested <strong>in order</strong>, the first TRUE one wins, everything below it is skipped, and the final <code>else</code> catches the rest.</p>
<ul>
<li><strong>Syntax on the slide</strong> — <code>if (condition1) { … } else if (condition2) { … } else { … }</code>. There is no <code>elseif</code> keyword in C: it is literally an <code>else</code> whose single statement happens to be another <code>if</code>. That is why the slide calls it <em>Nested if</em>.</li>
<li><strong>Order is semantics, not style</strong> — because later conditions are only reached when all earlier ones were false, each condition may assume the previous ones failed. That is exactly why the example can write <code>N &lt;= 6</code> instead of <code>N &gt; 3 &amp;&amp; N &lt;= 6</code>.</li>
<li><strong>Example 1, verbatim from the slide</strong> — buying N T-shirts with promotion: N≤3 ⟶ 120000/item · items 4 to 6 ⟶ 90000/item · items 7 to 10 ⟶ 85000/item · from the 11th ⟶ 70000/item. Design given on the slide: Begin · <code>N, t int</code> · Accept N · Compute t · Print t · End. The slide's own solution:
<pre><code>if (N &lt;= 3)       t = N * 120000;
else if (N &lt;= 6)  t = 3*120000 + (N-3) * 90000;
else if (N &lt;= 10) t = 3*120000 + 3*90000 + (N-6) * 85000;
else              t = 3*120000 + 3*90000 + 4*85000 + (N-10) * 70000;</code></pre></li>
<li><strong>Why each line re-adds the full previous tiers</strong> — this is <em>progressive</em> pricing: the first 3 shirts always cost 120000 each, whatever N is. 3×120000 = 360000 · 3×90000 = 270000 (shirts 4–6) · 4×85000 = 340000 (shirts 7–10). Those three constants are the whole trick.</li>
<li><strong>Trace, N = 5</strong> — <code>5 &lt;= 3</code>? no · <code>5 &lt;= 6</code>? YES ⟶ t = 360000 + (5−3)×90000 = 360000 + 180000 = <strong>540000</strong>; the remaining branches are never evaluated.</li>
<li><strong>Trace, N = 8</strong> — no · no · <code>8 &lt;= 10</code>? YES ⟶ t = 360000 + 270000 + (8−6)×85000 = 630000 + 170000 = <strong>800000</strong>.</li>
<li><strong>Trace, N = 12</strong> — no · no · no ⟶ final else: t = 360000 + 270000 + 340000 + (12−10)×70000 = 970000 + 140000 = <strong>1110000</strong>.</li>
</ul>
<p class="dap-an">✅ Đáp án, verified by compiling the slide's formula with <code>cc -Wall</code> and running it: N=1 ⟶ 120000 · N=3 ⟶ 360000 · N=4 ⟶ 450000 · N=5 ⟶ <strong>540000</strong> · N=8 ⟶ <strong>800000</strong> · N=10 ⟶ 970000 · N=12 ⟶ <strong>1110000</strong>. The slide's four expressions are correct.</p>
<p class="pitfall">⚠️ Two traps. (1) Reordering the branches breaks everything: if <code>N &lt;= 10</code> came first, N = 2 would take that branch and be charged the wrong tier. (2) Writing four separate <code>if</code>s instead of one chain makes <em>all four</em> run, so t is overwritten and only the last matching line survives — test with N = 2 and you will see 2×120000 replaced by a negative number.</p>`,
        `<p class="y-chinh">🎯 Chuỗi <code>else if</code>: các điều kiện được kiểm <strong>theo thứ tự</strong>, cái ĐÚNG đầu tiên thắng, mọi thứ phía dưới bị bỏ qua, và <code>else</code> cuối cùng hứng phần còn lại.</p>
<ul>
<li><strong>Cú pháp trên slide</strong> — <code>if (condition1) { … } else if (condition2) { … } else { … }</code>. C không có từ khoá <code>elseif</code>: đây đúng nghĩa là một <code>else</code> mà câu lệnh duy nhất của nó tình cờ lại là một <code>if</code> khác. Vì vậy slide gọi nó là <em>Nested if</em> (if lồng nhau).</li>
<li><strong>Thứ tự là ngữ nghĩa, không phải phong cách</strong> — vì các điều kiện sau chỉ được chạm tới khi mọi điều kiện trước đã sai, nên mỗi điều kiện có quyền giả định các điều kiện trước đều trượt. Đó đúng là lý do ví dụ viết được <code>N &lt;= 6</code> thay vì <code>N &gt; 3 &amp;&amp; N &lt;= 6</code>.</li>
<li><strong>Ví dụ 1, nguyên văn từ slide</strong> — mua N áo thun có khuyến mãi: N≤3 ⟶ 120000/chiếc · chiếc thứ 4 đến 6 ⟶ 90000/chiếc · chiếc thứ 7 đến 10 ⟶ 85000/chiếc · từ chiếc thứ 11 ⟶ 70000/chiếc. Thiết kế slide cho sẵn: Begin · <code>N, t int</code> · Accept N · Compute t · Print t · End. Lời giải của chính slide:
<pre><code>if (N &lt;= 3)       t = N * 120000;
else if (N &lt;= 6)  t = 3*120000 + (N-3) * 90000;
else if (N &lt;= 10) t = 3*120000 + 3*90000 + (N-6) * 85000;
else              t = 3*120000 + 3*90000 + 4*85000 + (N-10) * 70000;</code></pre></li>
<li><strong>Vì sao mỗi dòng phải cộng lại trọn các bậc trước</strong> — đây là giá <em>luỹ tiến</em>: 3 chiếc đầu luôn tính 120000 mỗi chiếc, bất kể N bằng bao nhiêu. 3×120000 = 360000 · 3×90000 = 270000 (chiếc 4–6) · 4×85000 = 340000 (chiếc 7–10). Ba hằng số đó là toàn bộ mẹo của bài.</li>
<li><strong>Chạy tay, N = 5</strong> — <code>5 &lt;= 3</code>? không · <code>5 &lt;= 6</code>? CÓ ⟶ t = 360000 + (5−3)×90000 = 360000 + 180000 = <strong>540000</strong>; các nhánh còn lại không hề được tính.</li>
<li><strong>Chạy tay, N = 8</strong> — không · không · <code>8 &lt;= 10</code>? CÓ ⟶ t = 360000 + 270000 + (8−6)×85000 = 630000 + 170000 = <strong>800000</strong>.</li>
<li><strong>Chạy tay, N = 12</strong> — không · không · không ⟶ else cuối: t = 360000 + 270000 + 340000 + (12−10)×70000 = 970000 + 140000 = <strong>1110000</strong>.</li>
</ul>
<p class="dap-an">✅ Đáp án, đã kiểm bằng cách biên dịch chính công thức của slide với <code>cc -Wall</code> rồi chạy: N=1 ⟶ 120000 · N=3 ⟶ 360000 · N=4 ⟶ 450000 · N=5 ⟶ <strong>540000</strong> · N=8 ⟶ <strong>800000</strong> · N=10 ⟶ 970000 · N=12 ⟶ <strong>1110000</strong>. Bốn biểu thức của slide là chính xác.</p>
<p class="pitfall">⚠️ Hai cái bẫy. (1) Đảo thứ tự các nhánh là hỏng hết: nếu <code>N &lt;= 10</code> đứng trước thì N = 2 sẽ rơi vào nhánh đó và bị tính sai bậc. (2) Viết bốn câu <code>if</code> rời nhau thay vì một chuỗi thì <em>cả bốn</em> đều chạy, t bị ghi đè và chỉ dòng khớp cuối cùng còn sống — thử với N = 2 sẽ thấy 2×120000 bị thay bằng một số âm.</p>`],

      [17, 'Selection Constructs — if … else (cont.) · Practice 1: electricity bill',
        `<p class="y-chinh">🎯 Practice 1: same progressive-tier pattern, new data — electricity priced 950 / 1250 / 1350 / 1550 per kWh at the boundaries 100, 150, 200.</p>
<ul>
<li><strong>Reading the slide's chart</strong> — the x-axis marks are 100, 150, 200 kWh; the price steps are 950, 1250, 1350, 1550. So: the first 100 kWh at 950 · kWh 101–150 at 1250 · kWh 151–200 at 1350 · every kWh above 200 at 1550. Same shape as the T-shirt problem, so the same four-branch chain applies.</li>
<li><strong>Step 1 — precompute the full-tier constants</strong> (this is the part students skip and then get wrong): 100×950 = 95000 · 50×1250 = 62500 · 50×1350 = 67500. Running totals: 95000 · 157500 · 225000.</li>
<li><strong>Step 2 — write the chain</strong>:
<pre><code>if (n &lt;= 100)      t = n * 950;
else if (n &lt;= 150) t = 95000 + (n - 100) * 1250;
else if (n &lt;= 200) t = 157500 + (n - 150) * 1350;
else               t = 225000 + (n - 200) * 1550;</code></pre></li>
<li><strong>Step 3 — the full program</strong>:
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    long n, t;
    printf("So kWh: ");
    scanf("%ld", &amp;n);
    if (n &lt;= 100)      t = n * 950;
    else if (n &lt;= 150) t = 95000 + (n - 100) * 1250;
    else if (n &lt;= 200) t = 157500 + (n - 150) * 1350;
    else               t = 225000 + (n - 200) * 1550;
    printf("Tien dien = %ld\\n", t);
    return 0;
}</code></pre></li>
<li><strong>Trace, n = 120</strong> — <code>120 &lt;= 100</code>? no · <code>120 &lt;= 150</code>? YES ⟶ t = 95000 + 20×1250 = 95000 + 25000 = <strong>120000</strong>.</li>
<li><strong>Trace, n = 180</strong> — no · no · <code>180 &lt;= 200</code>? YES ⟶ t = 157500 + 30×1350 = 157500 + 40500 = <strong>198000</strong>.</li>
<li><strong>Trace, n = 250</strong> — no · no · no ⟶ else: t = 225000 + 50×1550 = 225000 + 77500 = <strong>302500</strong>.</li>
</ul>
<p class="dap-an">✅ Đáp án, compiled with <code>cc -Wall</code> and run: 80 ⟶ 76000 · 100 ⟶ 95000 · 120 ⟶ <strong>120000</strong> · 150 ⟶ 157500 · 180 ⟶ <strong>198000</strong> · 200 ⟶ 225000 · 250 ⟶ <strong>302500</strong>. Note the boundaries 100, 150, 200 are each charged at the <em>lower</em> tier — check that against the chart before submitting, as it is the one modelling decision the picture leaves ambiguous.</p>
<p class="pitfall">⚠️ Use <code>long</code>, not <code>int</code>, for money here. A 16-bit <code>int</code> (still legal C) overflows above 32767, and even a 32-bit <code>int</code> dies around 2.1 billion — a year of bills would break it. Also: never compare money with <code>float</code> equality; keep it integral.</p>`,
        `<p class="y-chinh">🎯 Practice 1: vẫn mẫu bậc thang luỹ tiến, dữ liệu mới — giá điện 950 / 1250 / 1350 / 1550 mỗi kWh tại các mốc 100, 150, 200.</p>
<ul>
<li><strong>Đọc biểu đồ trên slide</strong> — các mốc trên trục là 100, 150, 200 kWh; các bậc giá là 950, 1250, 1350, 1550. Vậy: 100 kWh đầu giá 950 · kWh thứ 101–150 giá 1250 · kWh thứ 151–200 giá 1350 · mỗi kWh trên 200 giá 1550. Cùng hình dạng với bài áo thun, nên dùng lại đúng chuỗi bốn nhánh.</li>
<li><strong>Bước 1 — tính sẵn các hằng của bậc đầy</strong> (đây là phần sinh viên hay bỏ qua rồi làm sai): 100×950 = 95000 · 50×1250 = 62500 · 50×1350 = 67500. Tổng dồn: 95000 · 157500 · 225000.</li>
<li><strong>Bước 2 — viết chuỗi điều kiện</strong>:
<pre><code>if (n &lt;= 100)      t = n * 950;
else if (n &lt;= 150) t = 95000 + (n - 100) * 1250;
else if (n &lt;= 200) t = 157500 + (n - 150) * 1350;
else               t = 225000 + (n - 200) * 1550;</code></pre></li>
<li><strong>Bước 3 — chương trình đầy đủ</strong>:
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    long n, t;
    printf("So kWh: ");
    scanf("%ld", &amp;n);
    if (n &lt;= 100)      t = n * 950;
    else if (n &lt;= 150) t = 95000 + (n - 100) * 1250;
    else if (n &lt;= 200) t = 157500 + (n - 150) * 1350;
    else               t = 225000 + (n - 200) * 1550;
    printf("Tien dien = %ld\\n", t);
    return 0;
}</code></pre></li>
<li><strong>Chạy tay, n = 120</strong> — <code>120 &lt;= 100</code>? không · <code>120 &lt;= 150</code>? CÓ ⟶ t = 95000 + 20×1250 = 95000 + 25000 = <strong>120000</strong>.</li>
<li><strong>Chạy tay, n = 180</strong> — không · không · <code>180 &lt;= 200</code>? CÓ ⟶ t = 157500 + 30×1350 = 157500 + 40500 = <strong>198000</strong>.</li>
<li><strong>Chạy tay, n = 250</strong> — không · không · không ⟶ else: t = 225000 + 50×1550 = 225000 + 77500 = <strong>302500</strong>.</li>
</ul>
<p class="dap-an">✅ Đáp án, đã biên dịch bằng <code>cc -Wall</code> và chạy: 80 ⟶ 76000 · 100 ⟶ 95000 · 120 ⟶ <strong>120000</strong> · 150 ⟶ 157500 · 180 ⟶ <strong>198000</strong> · 200 ⟶ 225000 · 250 ⟶ <strong>302500</strong>. Lưu ý các mốc 100, 150, 200 đều được tính theo bậc <em>thấp hơn</em> — hãy đối chiếu lại với biểu đồ trước khi nộp, vì đó là điểm mô hình hoá duy nhất mà bức hình để mập mờ.</p>
<p class="pitfall">⚠️ Ở đây phải dùng <code>long</code>, không dùng <code>int</code>, cho tiền. Một <code>int</code> 16 bit (vẫn hợp chuẩn C) tràn từ 32767 trở lên, và ngay cả <code>int</code> 32 bit cũng chết quanh 2,1 tỷ — cộng tiền cả năm là vỡ. Ngoài ra: đừng bao giờ so tiền bằng phép bằng trên <code>float</code>; hãy giữ nó ở kiểu nguyên.</p>`],

      [18, 'Selection Constructs — Dangling Else',
        `<p class="y-chinh">🎯 "Ambiguity may arise in the case of nested if else constructs. <strong>To which if does the else belong?</strong>" — the classic dangling-else problem, stated by the slide as a question with two candidate interpretations.</p>
<ul>
<li><strong>The ambiguous code</strong> — indentation suggests one reading, the grammar picks the other:
<pre><code>if (a &gt; 0)
    if (b &gt; 0)
        printf("both positive\\n");
else
    printf("??\\n");</code></pre></li>
<li><strong>Interpretation A — the else belongs to the OUTER if</strong> (what the indentation above is trying to suggest): "if a &gt; 0 then check b, otherwise print ??". Under this reading, a = −1 would print <code>??</code>.</li>
<li><strong>Interpretation B — the else belongs to the INNER if</strong>: "if a &gt; 0 then: if b &gt; 0 print both positive, else print ??". Under this reading, a = −1 prints <em>nothing at all</em>.</li>
<li><strong>Why the two differ in behaviour, not just in style</strong> — they disagree on every input where <code>a &lt;= 0</code>. That is half the input space. A bug that only appears for negative <code>a</code> is exactly the kind that survives your testing and dies in production.</li>
<li><strong>Why the compiler cannot ask you</strong> — C's grammar is ambiguous here, so the language <em>defines</em> a tie-breaking rule rather than reporting an error. Slide 19 states that rule. The code compiles either way; only the meaning changes.</li>
<li><strong>Whitespace is not syntax in C</strong> — the indentation in the snippet above is a <em>lie</em> the author told themselves. The compiler ignores every space and newline. Python made indentation meaningful specifically to kill this bug class; C did not.</li>
</ul>
<p class="pitfall">⚠️ This is one of the most-asked PRF192 exam items, and the question is always phrased as "what does this print for a = …, b = …". Do not answer from the indentation. Answer from the rule on the next slide.</p>`,
        `<p class="y-chinh">🎯 "Nhập nhằng có thể phát sinh khi các cấu trúc if else lồng nhau. <strong>Cái else thuộc về if nào?</strong>" — bài toán dangling else kinh điển, được slide nêu thành một câu hỏi với hai cách hiểu ứng viên.</p>
<ul>
<li><strong>Đoạn code nhập nhằng</strong> — thụt lề gợi ý một cách hiểu, còn ngữ pháp chọn cách kia:
<pre><code>if (a &gt; 0)
    if (b &gt; 0)
        printf("both positive\\n");
else
    printf("??\\n");</code></pre></li>
<li><strong>Cách hiểu A — else thuộc if NGOÀI</strong> (đúng thứ mà kiểu thụt lề ở trên đang cố gợi ý): "nếu a &gt; 0 thì kiểm b, ngược lại in ??". Theo cách này, a = −1 sẽ in <code>??</code>.</li>
<li><strong>Cách hiểu B — else thuộc if TRONG</strong>: "nếu a &gt; 0 thì: nếu b &gt; 0 in both positive, ngược lại in ??". Theo cách này, a = −1 <em>không in gì cả</em>.</li>
<li><strong>Vì sao hai cách khác nhau về hành vi, không chỉ về phong cách</strong> — chúng bất đồng ở mọi đầu vào có <code>a &lt;= 0</code>. Đó là một nửa không gian đầu vào. Một lỗi chỉ hiện ra khi <code>a</code> âm chính là loại lỗi sống sót qua vòng kiểm thử của bạn rồi chết trên production.</li>
<li><strong>Vì sao trình biên dịch không hỏi lại bạn</strong> — ngữ pháp C nhập nhằng ở chỗ này, nên ngôn ngữ <em>quy định sẵn</em> một luật phá hoà chứ không báo lỗi. Slide 19 phát biểu luật đó. Code biên dịch được theo cả hai cách đọc; chỉ có ý nghĩa là đổi.</li>
<li><strong>Khoảng trắng không phải cú pháp trong C</strong> — kiểu thụt lề trong đoạn trên là một <em>lời nói dối</em> mà tác giả tự nói với chính mình. Trình biên dịch bỏ qua mọi dấu cách và xuống dòng. Python cố tình cho thụt lề mang nghĩa chính là để diệt lớp lỗi này; C thì không.</li>
</ul>
<p class="pitfall">⚠️ Đây là một trong những mục hay ra đề nhất của PRF192, và câu hỏi luôn ở dạng "đoạn này in ra gì với a = …, b = …". Đừng trả lời theo thụt lề. Hãy trả lời theo luật ở slide kế tiếp.</p>`],

      [19, 'Selection Constructs — Dangling Else (cont.) · the rule and the fix',
        `<p class="y-chinh">🎯 The rule, verbatim: <em>"The rule in C is that an else always belongs to the innermost if available. Use { } to explicitly determine statements."</em></p>
<ul>
<li><strong>Interpretation B always wins</strong> — the <code>else</code> binds to the nearest preceding <code>if</code> that does not already have an <code>else</code>. Indentation has zero influence. So the ambiguous snippet on slide 18 really means:
<pre><code>if (a &gt; 0) {
    if (b &gt; 0) printf("both positive\\n");
    else       printf("??\\n");
}</code></pre></li>
<li><strong>Trace the real meaning, three inputs</strong> — a=1, b=2 ⟶ outer TRUE, inner TRUE ⟶ prints <code>both positive</code> · a=1, b=−2 ⟶ outer TRUE, inner FALSE ⟶ prints <code>??</code> · a=−1, b=5 ⟶ outer FALSE ⟶ prints <strong>nothing</strong>.</li>
<li><strong>The fix when you actually wanted interpretation A</strong> — brace the inner <code>if</code> so it is complete and the <code>else</code> has to jump outward:
<pre><code>if (a &gt; 0) {
    if (b &gt; 0) printf("both positive\\n");
} else {
    printf("a is not positive\\n");
}</code></pre></li>
<li><strong>Trace the fixed version, same three inputs</strong> — a=1, b=2 ⟶ <code>both positive</code> · a=1, b=−2 ⟶ <strong>nothing</strong> (the inner <code>if</code> has no else now) · a=−1, b=5 ⟶ <code>a is not positive</code>. Compare with the traces above: the two versions differ on <em>two of three</em> inputs.</li>
<li><strong>Your compiler will help if you let it</strong> — clang and gcc both warn <code>-Wdangling-else</code> ("add explicit braces to avoid dangling else") on the unbraced version. It is included in <code>-Wall</code>. Treat that warning as an error.</li>
<li><strong>The habit that makes the whole problem disappear</strong> — always put <code>{ }</code> around the body of every <code>if</code> and every <code>else</code>, even one-liners. There is no dangling-else problem in braced code, because there is never a second candidate <code>if</code>.</li>
</ul>
<p class="dap-an">✅ Đáp án, compiled with <code>cc -Wall</code> and run. Unbraced (real C meaning): a=1,b=2 ⟶ <code>ca hai duong</code> · a=1,b=−2 ⟶ <code>else cua if NAO?</code> · a=−1,b=5 ⟶ <strong>no output</strong>. Braced as interpretation A: a=1,b=2 ⟶ <code>ca hai duong</code> · a=1,b=−2 ⟶ <strong>no output</strong> · a=−1,b=5 ⟶ <code>a khong duong</code>. The compiler also printed <em>warning: add explicit braces to avoid dangling else [-Wdangling-else]</em>.</p>`,
        `<p class="y-chinh">🎯 Luật, nguyên văn: <em>"The rule in C is that an else always belongs to the innermost if available. Use { } to explicitly determine statements."</em> — <code>else</code> luôn thuộc về <code>if</code> gần nhất còn trống.</p>
<ul>
<li><strong>Cách hiểu B luôn thắng</strong> — <code>else</code> gắn vào <code>if</code> gần nhất phía trước mà chưa có <code>else</code>. Thụt lề không có chút ảnh hưởng nào. Vậy đoạn nhập nhằng ở slide 18 thực sự có nghĩa là:
<pre><code>if (a &gt; 0) {
    if (b &gt; 0) printf("both positive\\n");
    else       printf("??\\n");
}</code></pre></li>
<li><strong>Chạy tay theo nghĩa thật, ba bộ dữ liệu</strong> — a=1, b=2 ⟶ if ngoài ĐÚNG, if trong ĐÚNG ⟶ in <code>both positive</code> · a=1, b=−2 ⟶ ngoài ĐÚNG, trong SAI ⟶ in <code>??</code> · a=−1, b=5 ⟶ ngoài SAI ⟶ <strong>không in gì</strong>.</li>
<li><strong>Cách chữa khi bạn thật sự muốn cách hiểu A</strong> — đóng ngoặc cho <code>if</code> bên trong để nó hoàn chỉnh, buộc <code>else</code> phải nhảy ra ngoài:
<pre><code>if (a &gt; 0) {
    if (b &gt; 0) printf("both positive\\n");
} else {
    printf("a is not positive\\n");
}</code></pre></li>
<li><strong>Chạy tay bản đã sửa, vẫn ba bộ đó</strong> — a=1, b=2 ⟶ <code>both positive</code> · a=1, b=−2 ⟶ <strong>không in gì</strong> (giờ <code>if</code> trong không còn else) · a=−1, b=5 ⟶ <code>a is not positive</code>. So với các vết ở trên: hai bản khác nhau ở <em>hai trong ba</em> bộ dữ liệu.</li>
<li><strong>Trình biên dịch sẽ giúp nếu bạn cho phép</strong> — cả clang lẫn gcc đều cảnh báo <code>-Wdangling-else</code> ("add explicit braces to avoid dangling else") trên bản không ngoặc. Nó nằm sẵn trong <code>-Wall</code>. Hãy coi cảnh báo đó như một lỗi.</li>
<li><strong>Thói quen làm cả vấn đề biến mất</strong> — luôn đặt <code>{ }</code> quanh thân của mọi <code>if</code> và mọi <code>else</code>, kể cả khi chỉ có một dòng. Code có ngoặc đầy đủ thì không tồn tại dangling else, vì không bao giờ có <code>if</code> ứng viên thứ hai.</li>
</ul>
<p class="dap-an">✅ Đáp án, đã biên dịch bằng <code>cc -Wall</code> và chạy thật. Bản không ngoặc (nghĩa thật của C): a=1,b=2 ⟶ <code>ca hai duong</code> · a=1,b=−2 ⟶ <code>else cua if NAO?</code> · a=−1,b=5 ⟶ <strong>không in gì</strong>. Bản có ngoặc theo cách hiểu A: a=1,b=2 ⟶ <code>ca hai duong</code> · a=1,b=−2 ⟶ <strong>không in gì</strong> · a=−1,b=5 ⟶ <code>a khong duong</code>. Trình biên dịch cũng in ra <em>warning: add explicit braces to avoid dangling else [-Wdangling-else]</em>.</p>`],

      [20, 'Selection Constructs — Operator ? :',
        `<p class="y-chinh">🎯 Syntax from the slide: <code>(condition) ? True_Value : False_Value</code> — the only <strong>ternary</strong> (three-operand) operator in C, and the only selection construct that produces a <em>value</em> instead of executing a <em>statement</em>.</p>
<ul>
<li><strong>Statement versus expression — the whole point</strong> — <code>if…else</code> chooses which statement to <em>run</em>; <code>? :</code> chooses which value to <em>produce</em>. So it can sit inside an assignment, a <code>printf</code> argument, or another expression, where an <code>if</code> cannot.</li>
<li><strong>The slide's example — marks</strong>. Case 1: mark &gt; 7 · Case 2: mark &lt; 7. Written with <code>if…else</code>:
<pre><code>if (mark &gt; 7) printf("Gioi\\n");
else          printf("Chua gioi\\n");</code></pre>
Written with <code>? :</code>:
<pre><code>printf("%s\\n", (mark &gt; 7) ? "Gioi" : "Chua gioi");</code></pre></li>
<li><strong>Trace, three inputs</strong> — mark = 8.5 ⟶ 8.5 &gt; 7 is TRUE ⟶ value is <code>"Gioi"</code> · mark = 7.0 ⟶ 7.0 &gt; 7 is FALSE (strictly greater!) ⟶ <code>"Chua gioi"</code> · mark = 6.0 ⟶ FALSE ⟶ <code>"Chua gioi"</code>.</li>
<li><strong>Only one arm is evaluated</strong> — just like <code>if…else</code>, <code>? :</code> is short-circuiting. In <code>(n != 0) ? (100 / n) : 0</code> the division never happens when n is 0, so this is safe.</li>
<li><strong>Classic compact uses</strong> — <code>max = (a &gt; b) ? a : b;</code> · <code>abs = (x &lt; 0) ? -x : x;</code> · printing a plural: <code>printf("%d file%s\\n", n, (n == 1) ? "" : "s");</code>. Each is one short expression whose meaning you can read in a single glance.</li>
<li><strong>Where it stops being a good idea</strong> — nesting. <code>a ? b : c ? d : e</code> is legal (it groups right-to-left, as <code>a ? b : (c ? d : e)</code>) but three levels deep it becomes unreadable and is a common source of logic bugs. Past two branches, use <code>if…else if</code>.</li>
</ul>
<p class="dap-an">✅ Đáp án, compiled with <code>cc -Wall</code> and run: mark=8.5 ⟶ <strong>Gioi</strong> · mark=7.0 ⟶ <strong>Chua gioi</strong> · mark=6.0 ⟶ <strong>Chua gioi</strong>. Note that the slide's two cases ("mark &gt; 7" and "mark &lt; 7") leave <em>mark exactly 7</em> unstated — the <code>? :</code> form forces you to decide, and here it lands in the FALSE arm.</p>
<p class="pitfall">⚠️ Two traps. (1) The gap in the slide's own case split: <code>&gt; 7</code> and <code>&lt; 7</code> do not cover <code>== 7</code>. Always make your branches exhaustive. (2) <code>? :</code> has very low precedence, so <code>x = a &gt; b ? a : b</code> parses as intended but <code>printf("%d", a &gt; b ? a : b + 1)</code> does not — parenthesise when mixing it with arithmetic.</p>`,
        `<p class="y-chinh">🎯 Cú pháp trên slide: <code>(condition) ? True_Value : False_Value</code> — toán tử <strong>ba ngôi</strong> duy nhất của C, và cũng là khối rẽ nhánh duy nhất tạo ra một <em>giá trị</em> thay vì chạy một <em>câu lệnh</em>.</p>
<ul>
<li><strong>Câu lệnh và biểu thức — đây mới là điểm mấu chốt</strong> — <code>if…else</code> chọn xem <em>chạy</em> câu lệnh nào; <code>? :</code> chọn xem <em>sinh ra</em> giá trị nào. Nhờ vậy nó nằm được bên trong một phép gán, một tham số của <code>printf</code>, hay trong một biểu thức khác — những chỗ mà <code>if</code> không vào được.</li>
<li><strong>Ví dụ của slide — điểm số</strong>. Case 1: mark &gt; 7 · Case 2: mark &lt; 7. Viết bằng <code>if…else</code>:
<pre><code>if (mark &gt; 7) printf("Gioi\\n");
else          printf("Chua gioi\\n");</code></pre>
Viết bằng <code>? :</code>:
<pre><code>printf("%s\\n", (mark &gt; 7) ? "Gioi" : "Chua gioi");</code></pre></li>
<li><strong>Chạy tay, ba bộ dữ liệu</strong> — mark = 8.5 ⟶ 8.5 &gt; 7 là ĐÚNG ⟶ giá trị là <code>"Gioi"</code> · mark = 7.0 ⟶ 7.0 &gt; 7 là SAI (lớn hơn thực sự!) ⟶ <code>"Chua gioi"</code> · mark = 6.0 ⟶ SAI ⟶ <code>"Chua gioi"</code>.</li>
<li><strong>Chỉ một nhánh được tính</strong> — hệt như <code>if…else</code>, <code>? :</code> cũng đoản mạch. Trong <code>(n != 0) ? (100 / n) : 0</code>, phép chia không bao giờ xảy ra khi n bằng 0, nên viết vậy là an toàn.</li>
<li><strong>Các cách dùng gọn kinh điển</strong> — <code>max = (a &gt; b) ? a : b;</code> · <code>abs = (x &lt; 0) ? -x : x;</code> · in số nhiều: <code>printf("%d file%s\\n", n, (n == 1) ? "" : "s");</code>. Mỗi cái là một biểu thức ngắn mà bạn đọc một cái là hiểu.</li>
<li><strong>Chỗ nó thôi là ý hay</strong> — lồng nhau. <code>a ? b : c ? d : e</code> hợp lệ (nó gom từ phải sang trái, thành <code>a ? b : (c ? d : e)</code>) nhưng lồng ba tầng thì không đọc nổi và là nguồn lỗi logic phổ biến. Quá hai nhánh thì dùng <code>if…else if</code>.</li>
</ul>
<p class="dap-an">✅ Đáp án, đã biên dịch bằng <code>cc -Wall</code> và chạy: mark=8.5 ⟶ <strong>Gioi</strong> · mark=7.0 ⟶ <strong>Chua gioi</strong> · mark=6.0 ⟶ <strong>Chua gioi</strong>. Lưu ý hai case của chính slide ("mark &gt; 7" và "mark &lt; 7") bỏ trống trường hợp <em>mark đúng bằng 7</em> — dạng <code>? :</code> buộc bạn phải quyết định, và ở đây nó rơi vào nhánh SAI.</p>
<p class="pitfall">⚠️ Hai cái bẫy. (1) Lỗ hổng trong chính cách chia case của slide: <code>&gt; 7</code> và <code>&lt; 7</code> không phủ được <code>== 7</code>. Hãy luôn làm cho các nhánh phủ kín. (2) <code>? :</code> có độ ưu tiên rất thấp, nên <code>x = a &gt; b ? a : b</code> đọc đúng ý nhưng <code>printf("%d", a &gt; b ? a : b + 1)</code> thì không — hãy đóng ngoặc khi trộn nó với số học.</p>`],

      [21, 'Selection Constructs — The switch statement',
        `<p class="y-chinh">🎯 The Select-1/n construct: one integral expression is compared against a list of constants, and execution <strong>jumps into</strong> the matching <code>case</code> and then runs forward until it meets a <code>break</code>.</p>
<ul>
<li><strong>Syntax, verbatim from the slide</strong>:
<pre><code>switch (variable or expression)
{
    case constant :
        statement(s);
        break;
    case constant :
        statement(s);
        break;
    default:
        statement(s);
}</code></pre></li>
<li><strong>Restriction 1 — the switch expression must be integral</strong>. The slide annotates it "char / int". <code>float</code>, <code>double</code>, strings and arrays are all rejected at compile time: <code>error: statement requires expression of integer type</code>. That is because equality on floating point is unreliable and a jump table needs whole numbers.</li>
<li><strong>Restriction 2 — every <code>case</code> label must be a compile-time constant</strong>, and all of them must be distinct. <code>case 3:</code> and <code>case 'A':</code> are fine (<code>'A'</code> is the integer 65); <code>case n:</code> with <code>n</code> a variable is an error, and so is <code>case 1 &lt;= x:</code>. This is the hard limit that forces you back to <code>if…else if</code> for ranges.</li>
<li><strong>"Each case is an entry of a selection"</strong> — the slide's own phrasing, and the key mental model. A <code>case</code> label is a <strong>door you jump to</strong>, not a box you enter and leave. Once inside, execution continues downward through the following cases.</li>
<li><strong>Restriction 3 — the slide states the fall-through rule</strong>: "If the break statement is missed, the next statements are executed until a break is detected or all statements in the body of the switch are executed."</li>
<li><strong><code>default</code></strong> — runs when no case matched. It is optional, it may be placed anywhere (conventionally last), and omitting it means an unmatched value silently does nothing. Always write one, even if it only prints "invalid input".</li>
<li><strong>Deliberate fall-through, the one legitimate use</strong> — stacking labels to share a body:
<pre><code>switch (d) {
    case 1:
    case 2:  printf("Bac 1-2\\n"); break;
    case 3:  printf("Bac 3\\n");          /* no break — falls through! */
    case 4:  printf("Bac 4\\n"); break;
    default: printf("Khong hop le\\n");
}</code></pre>
<code>case 1:</code> with an empty body falling into <code>case 2:</code> is idiomatic and intentional. <code>case 3:</code> falling into <code>case 4:</code> after printing is almost always a bug.</li>
</ul>
<p class="dap-an">✅ Đáp án, compiled with <code>cc -Wall</code> and run: d=1 ⟶ <code>Bac 1-2</code> · d=2 ⟶ <code>Bac 1-2</code> · d=3 ⟶ <strong><code>Bac 3</code> AND <code>Bac 4</code> (two lines)</strong> · d=4 ⟶ <code>Bac 4</code> · d=9 ⟶ <code>Khong hop le</code>. The doubled output at d=3 is the fall-through the slide warns about.</p>
<p class="meo">💡 If you ever write intentional fall-through, leave a comment <code>/* fall through */</code> on the line. Modern compilers have a <code>-Wimplicit-fallthrough</code> warning, and reviewers assume an uncommented one is a missing <code>break</code>.</p>`,
        `<p class="y-chinh">🎯 Khối Chọn-1/n: một biểu thức nguyên được so với một danh sách hằng, rồi luồng thực thi <strong>nhảy vào</strong> đúng <code>case</code> khớp và chạy thẳng xuống cho tới khi gặp <code>break</code>.</p>
<ul>
<li><strong>Cú pháp, nguyên văn từ slide</strong>:
<pre><code>switch (variable or expression)
{
    case constant :
        statement(s);
        break;
    case constant :
        statement(s);
        break;
    default:
        statement(s);
}</code></pre></li>
<li><strong>Ràng buộc 1 — biểu thức trong switch phải thuộc kiểu nguyên</strong>. Slide chú thích ngay cạnh là "char / int". <code>float</code>, <code>double</code>, chuỗi và mảng đều bị từ chối ngay lúc biên dịch: <code>error: statement requires expression of integer type</code>. Lý do: so bằng trên số thực không đáng tin, còn bảng nhảy thì cần số nguyên.</li>
<li><strong>Ràng buộc 2 — mỗi nhãn <code>case</code> phải là hằng biết được lúc biên dịch</strong>, và tất cả phải khác nhau. <code>case 3:</code> và <code>case 'A':</code> đều hợp lệ (<code>'A'</code> chính là số nguyên 65); <code>case n:</code> với <code>n</code> là biến thì lỗi, <code>case 1 &lt;= x:</code> cũng lỗi. Đây là giới hạn cứng buộc bạn quay về <code>if…else if</code> khi cần kiểm khoảng.</li>
<li><strong>"Mỗi case là một lối vào của phép chọn"</strong> — chính chữ của slide, và là mô hình tư duy then chốt. Nhãn <code>case</code> là một <strong>cánh cửa để nhảy vào</strong>, không phải một cái hộp có vào có ra. Vào rồi thì luồng chạy tiếp xuống các case phía dưới.</li>
<li><strong>Ràng buộc 3 — slide phát biểu luật fall-through</strong>: "Nếu thiếu câu lệnh break thì các câu lệnh kế tiếp vẫn được chạy cho đến khi gặp một break, hoặc cho đến khi hết toàn bộ thân switch."</li>
<li><strong><code>default</code></strong> — chạy khi không case nào khớp. Nó là tuỳ chọn, đặt ở đâu cũng được (theo thông lệ là cuối), và bỏ nó đi nghĩa là một giá trị không khớp sẽ âm thầm không làm gì. Hãy luôn viết một cái, dù chỉ để in "dữ liệu không hợp lệ".</li>
<li><strong>Fall-through cố ý, trường hợp dùng chính đáng duy nhất</strong> — xếp chồng nhãn để dùng chung một thân:
<pre><code>switch (d) {
    case 1:
    case 2:  printf("Bac 1-2\\n"); break;
    case 3:  printf("Bac 3\\n");          /* thiếu break — rơi xuống! */
    case 4:  printf("Bac 4\\n"); break;
    default: printf("Khong hop le\\n");
}</code></pre>
<code>case 1:</code> để thân rỗng rồi rơi vào <code>case 2:</code> là cách viết chuẩn mực và có chủ đích. Còn <code>case 3:</code> in xong rồi rơi vào <code>case 4:</code> thì gần như luôn luôn là lỗi.</li>
</ul>
<p class="dap-an">✅ Đáp án, đã biên dịch bằng <code>cc -Wall</code> và chạy: d=1 ⟶ <code>Bac 1-2</code> · d=2 ⟶ <code>Bac 1-2</code> · d=3 ⟶ <strong>in CẢ <code>Bac 3</code> LẪN <code>Bac 4</code> (hai dòng)</strong> · d=4 ⟶ <code>Bac 4</code> · d=9 ⟶ <code>Khong hop le</code>. Cái kết quả in đúp ở d=3 chính là fall-through mà slide cảnh báo.</p>
<p class="meo">💡 Nếu có lúc bạn cố ý để fall-through, hãy ghi chú <code>/* fall through */</code> ngay dòng đó. Trình biên dịch hiện đại có cảnh báo <code>-Wimplicit-fallthrough</code>, và người review mặc định coi một chỗ rơi không chú thích là một <code>break</code> bị quên.</p>`],

      [22, 'Selection Constructs — The switch statement (cont.) · the quiz',
        `<p class="y-chinh">🎯 A two-part multiple-choice drill on fall-through: <em>"If input is 8, what are outputs?"</em> and <em>"If input is 7, what are outputs?"</em>, with paired answers (an amount and a count).</p>
<ul>
<li><strong>The answer options, verbatim from the slide</strong> — <code>200000 , 2</code> · <code>300000, 3</code> · <code>0, 0</code> · <code>1000000, 4</code> · <code>1500000, 10</code> · <code>None of the others</code>. Each option is a pair, so the code being traced maintains <em>two</em> variables — a money accumulator and a counter.</li>
<li><strong>Honest note about this slide</strong> — the <code>switch</code> code body itself is a <em>picture</em> on the slide; it is not present in the text extracted from the .pptx, so it is not reproduced here. What follows is the <strong>method</strong> for answering it, plus a fully specified exercise of the same shape that you can actually run.</li>
<li><strong>The method, step by step</strong> — (1) write the two variables and their initial values in a table · (2) find the <code>case</code> label that equals the input; if none, jump to <code>default</code> · (3) from that label, execute every statement <em>downward</em>, updating the table · (4) stop at the first <code>break</code> or at the closing brace · (5) read the final values off the table. The paired options exist precisely to catch people who stop at the matched case instead of falling through.</li>
<li><strong>Why an "amount, count" pair is the giveaway</strong> — a correct <code>switch</code> with every <code>break</code> in place would give the same count for every input (usually 1). Options with counts 2, 3, 4 and 10 only make sense if several case bodies ran, i.e. if breaks are missing on purpose.</li>
<li><strong>An equivalent exercise you can run</strong> — trace this and predict the output for x = 8 and x = 7:
<pre><code>int money = 0, n = 0;
switch (x) {
    case 9:  money += 500000; n++;
    case 8:  money += 200000; n++;
    case 7:  money += 100000; n++; break;
    case 6:  money += 50000;  n++; break;
    default: money = 0; n = 0;
}
printf("%d, %d\\n", money, n);</code></pre></li>
<li><strong>Trace, x = 8</strong> — match <code>case 8</code> · money = 0+200000 = 200000, n = 1 · no break ⟶ fall into <code>case 7</code> · money = 200000+100000 = 300000, n = 2 · <code>break</code> ⟶ stop. Output: <code>300000, 2</code>.</li>
<li><strong>Trace, x = 7</strong> — match <code>case 7</code> · money = 100000, n = 1 · <code>break</code> ⟶ stop. Output: <code>100000, 1</code>. Different entry door, different total — same code.</li>
</ul>
<p class="dap-an">✅ Đáp án: for the <em>slide's own</em> question, the answer cannot be stated from the extracted text because the code is an image — do not guess it; trace the picture in your own deck with the five-step method above, and remember the giveaway that a non-1 count means missing breaks. For the equivalent exercise printed above, compiled with <code>cc -Wall</code> and run: x = 8 ⟶ <strong>300000, 2</strong> · x = 7 ⟶ <strong>100000, 1</strong> · x = 9 ⟶ 800000, 3 · x = 5 ⟶ 0, 0 (the <code>default</code> arm).</p>
<p class="pitfall">⚠️ The two most common wrong answers in this drill type: (1) stopping at the matched case and reporting <code>200000, 1</code> for x = 8 — that ignores fall-through; (2) running <em>all</em> the cases from the top — that ignores the jump. Execution starts at the matching label and runs down, no earlier, no later.</p>`,
        `<p class="y-chinh">🎯 Một bài trắc nghiệm hai phần về fall-through: <em>"Nếu nhập 8 thì in ra gì?"</em> và <em>"Nếu nhập 7 thì in ra gì?"</em>, với các đáp án là cặp (một số tiền và một số đếm).</p>
<ul>
<li><strong>Các phương án, nguyên văn từ slide</strong> — <code>200000 , 2</code> · <code>300000, 3</code> · <code>0, 0</code> · <code>1000000, 4</code> · <code>1500000, 10</code> · <code>None of the others</code>. Mỗi phương án là một cặp, nên đoạn code cần truy vết giữ <em>hai</em> biến — một biến cộng dồn tiền và một biến đếm.</li>
<li><strong>Ghi chú thành thật về slide này</strong> — phần thân <code>switch</code> nằm trong một <em>ảnh</em> trên slide; nó không có trong chữ trích được từ file .pptx, nên bài này KHÔNG chép lại nó và cũng không bịa ra. Dưới đây là <strong>phương pháp</strong> để giải, kèm một bài tập cùng dạng được đặc tả đầy đủ để bạn chạy thật.</li>
<li><strong>Phương pháp, từng bước</strong> — (1) kẻ bảng hai biến với giá trị ban đầu · (2) tìm nhãn <code>case</code> bằng đúng giá trị nhập; không có thì nhảy tới <code>default</code> · (3) từ nhãn đó, chạy mọi câu lệnh <em>đi xuống</em>, cập nhật bảng · (4) dừng ở <code>break</code> đầu tiên hoặc ở dấu ngoặc đóng · (5) đọc giá trị cuối trên bảng. Các phương án dạng cặp sinh ra đúng là để bắt những ai dừng lại ở case vừa khớp thay vì chạy tiếp xuống.</li>
<li><strong>Vì sao cặp "tiền, số đếm" là dấu hiệu tố cáo</strong> — một <code>switch</code> đúng chuẩn với đủ <code>break</code> sẽ cho cùng một số đếm với mọi đầu vào (thường là 1). Các phương án có số đếm 2, 3, 4 và 10 chỉ có nghĩa khi nhiều thân case cùng chạy, tức là các <code>break</code> bị bỏ có chủ ý.</li>
<li><strong>Một bài tập tương đương bạn chạy được</strong> — truy vết đoạn này và dự đoán kết quả với x = 8 và x = 7:
<pre><code>int money = 0, n = 0;
switch (x) {
    case 9:  money += 500000; n++;
    case 8:  money += 200000; n++;
    case 7:  money += 100000; n++; break;
    case 6:  money += 50000;  n++; break;
    default: money = 0; n = 0;
}
printf("%d, %d\\n", money, n);</code></pre></li>
<li><strong>Chạy tay, x = 8</strong> — khớp <code>case 8</code> · money = 0+200000 = 200000, n = 1 · không có break ⟶ rơi xuống <code>case 7</code> · money = 200000+100000 = 300000, n = 2 · <code>break</code> ⟶ dừng. Kết quả: <code>300000, 2</code>.</li>
<li><strong>Chạy tay, x = 7</strong> — khớp <code>case 7</code> · money = 100000, n = 1 · <code>break</code> ⟶ dừng. Kết quả: <code>100000, 1</code>. Cửa vào khác nhau, tổng khác nhau — vẫn cùng một đoạn code.</li>
</ul>
<p class="dap-an">✅ Đáp án: với câu hỏi của <em>chính slide</em>, không thể nêu đáp số từ chữ trích được vì phần code nằm trong ảnh — đừng đoán; hãy truy vết bức hình trong bộ slide của bạn bằng năm bước ở trên, và nhớ dấu hiệu tố cáo: số đếm khác 1 nghĩa là có <code>break</code> bị bỏ. Với bài tập tương đương in ở trên, đã biên dịch bằng <code>cc -Wall</code> và chạy: x = 8 ⟶ <strong>300000, 2</strong> · x = 7 ⟶ <strong>100000, 1</strong> · x = 9 ⟶ 800000, 3 · x = 5 ⟶ 0, 0 (nhánh <code>default</code>).</p>
<p class="pitfall">⚠️ Hai đáp án sai phổ biến nhất ở dạng bài này: (1) dừng ngay tại case vừa khớp và trả lời <code>200000, 1</code> cho x = 8 — bỏ qua fall-through; (2) chạy <em>tất cả</em> các case từ trên xuống — bỏ qua cú nhảy. Luồng thực thi bắt đầu tại nhãn khớp rồi chạy xuống, không sớm hơn, không muộn hơn.</p>`],

      [23, 'The switch statement (cont.) · Practice 2: a four-operator calculator',
        `<p class="y-chinh">🎯 Practice 2, verbatim: read a simple expression containing one of <code>+ - * /</code> in the format <code>num1 operator num2</code> (example: <code>4*5</code>) and print the result. The slide walks the full noun/verb analysis and then gives the <code>switch</code> solution.</p>
<ul>
<li><strong>The slide's analysis — Nouns ⟶ variables</strong> — "expression ⟶ num1 op num2 ⟶ <code>double num1, num2; char op</code>" and "result ⟶ <code>double result</code>". Note <code>op</code> is a <code>char</code>, which is integral, which is exactly why a <code>switch</code> is legal here.</li>
<li><strong>The slide's analysis — Verbs ⟶ statements</strong> — Begin · Accept num1, op, num2 with the format string <code>"%lf%c%lf"</code> · <code>switch (op)</code> with four cases plus <code>default</code> · End. This noun/verb method is worth stealing for every exercise in the course.</li>
<li><strong>The slide's switch, restated</strong> — <code>case '+'</code>, <code>case '-'</code>, <code>case '*'</code> each compute and print then <code>break</code>; <code>case '/'</code> first checks <code>if (num2 == 0)</code> and prints "Divide by 0", else computes and prints, then <code>break</code>; <code>default</code> prints "Op is not supported". Notice the <code>if…else</code> nested inside a <code>case</code> — constructs nest freely.</li>
<li><strong>The complete program</strong>:
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    double num1, num2, result;
    char op;
    printf("Nhap bieu thuc (vd 4*5): ");
    if (scanf("%lf %c %lf", &amp;num1, &amp;op, &amp;num2) != 3) {
        printf("Input format is wrong\\n");
        return 1;
    }
    switch (op) {
        case '+': result = num1 + num2; printf("%.2f\\n", result); break;
        case '-': result = num1 - num2; printf("%.2f\\n", result); break;
        case '*': result = num1 * num2; printf("%.2f\\n", result); break;
        case '/':
            if (num2 == 0) printf("Divide by 0\\n");
            else { result = num1 / num2; printf("%.2f\\n", result); }
            break;
        default: printf("Op is not supported\\n");
    }
    return 0;
}</code></pre></li>
<li><strong>Trace, input <code>4*5</code></strong> — num1 = 4, op = <code>'*'</code>, num2 = 5 · <code>switch ('*')</code> matches <code>case '*'</code> · result = 20 · print · break. Output <code>20.00</code>.</li>
<li><strong>Trace, input <code>4/0</code></strong> — op = <code>'/'</code> ⟶ inner <code>if (num2 == 0)</code> is TRUE ⟶ print <code>Divide by 0</code> ⟶ break. The guard exists because integer division by zero crashes the program, and floating division by zero silently produces <code>inf</code>; neither is an acceptable answer to show a user.</li>
<li><strong>Trace, input <code>4%5</code></strong> — op = <code>'%'</code> matches no case ⟶ <code>default</code> ⟶ print <code>Op is not supported</code>.</li>
</ul>
<p class="dap-an">✅ Đáp án, compiled with <code>cc -Wall</code> and run: <code>4*5</code> ⟶ <strong>20.00</strong> · <code>4+5</code> ⟶ <strong>9.00</strong> · <code>4/0</code> ⟶ <strong>Divide by 0</strong> · <code>7/2</code> ⟶ <strong>3.50</strong> (note: <code>double</code>, so 3.50 and not 3 as integer division would give) · <code>4%5</code> ⟶ <strong>Op is not supported</strong>.</p>
<p class="pitfall">⚠️ <strong>The slide's format string <code>"%lf%c%lf"</code> is fragile, measured not guessed.</strong> Compiled and run: it reads <code>4*5</code> correctly, but on input <code>4 * 5</code> (with spaces) it <em>fails</em> — <code>%c</code> does not skip whitespace, so <code>op</code> becomes <code>' '</code> and the third <code>%lf</code> then chokes on <code>'*'</code>, leaving <code>num2</code> uninitialised. The fix is one space before <code>%c</code>: <code>"%lf %c %lf"</code>, which was tested and reads both <code>4*5</code> and <code>4 * 5</code> correctly. Also always check <code>scanf</code>'s return value — it tells you how many items it actually converted.</p>`,
        `<p class="y-chinh">🎯 Practice 2, nguyên văn: đọc một biểu thức đơn giản chứa một trong bốn phép <code>+ - * /</code> theo định dạng <code>num1 operator num2</code> (ví dụ: <code>4*5</code>) rồi in kết quả. Slide đi trọn phần phân tích danh từ/động từ rồi mới đưa lời giải bằng <code>switch</code>.</p>
<ul>
<li><strong>Phân tích của slide — Danh từ ⟶ biến</strong> — "expression ⟶ num1 op num2 ⟶ <code>double num1, num2; char op</code>" và "result ⟶ <code>double result</code>". Chú ý <code>op</code> là <code>char</code>, tức kiểu nguyên, và đó đúng là lý do dùng được <code>switch</code> ở đây.</li>
<li><strong>Phân tích của slide — Động từ ⟶ câu lệnh</strong> — Begin · Nhận num1, op, num2 với chuỗi định dạng <code>"%lf%c%lf"</code> · <code>switch (op)</code> gồm bốn case cộng <code>default</code> · End. Phương pháp danh từ/động từ này đáng "mượn" để dùng cho mọi bài tập trong môn.</li>
<li><strong>Đoạn switch của slide, viết lại</strong> — <code>case '+'</code>, <code>case '-'</code>, <code>case '*'</code> mỗi cái tính rồi in rồi <code>break</code>; <code>case '/'</code> kiểm <code>if (num2 == 0)</code> trước rồi in "Divide by 0", ngược lại mới tính và in, sau đó <code>break</code>; <code>default</code> in "Op is not supported". Để ý có một <code>if…else</code> lồng trong một <code>case</code> — các khối cấu trúc lồng nhau thoải mái.</li>
<li><strong>Chương trình hoàn chỉnh</strong>:
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    double num1, num2, result;
    char op;
    printf("Nhap bieu thuc (vd 4*5): ");
    if (scanf("%lf %c %lf", &amp;num1, &amp;op, &amp;num2) != 3) {
        printf("Input format is wrong\\n");
        return 1;
    }
    switch (op) {
        case '+': result = num1 + num2; printf("%.2f\\n", result); break;
        case '-': result = num1 - num2; printf("%.2f\\n", result); break;
        case '*': result = num1 * num2; printf("%.2f\\n", result); break;
        case '/':
            if (num2 == 0) printf("Divide by 0\\n");
            else { result = num1 / num2; printf("%.2f\\n", result); }
            break;
        default: printf("Op is not supported\\n");
    }
    return 0;
}</code></pre></li>
<li><strong>Chạy tay, nhập <code>4*5</code></strong> — num1 = 4, op = <code>'*'</code>, num2 = 5 · <code>switch ('*')</code> khớp <code>case '*'</code> · result = 20 · in · break. Kết quả <code>20.00</code>.</li>
<li><strong>Chạy tay, nhập <code>4/0</code></strong> — op = <code>'/'</code> ⟶ <code>if (num2 == 0)</code> bên trong ĐÚNG ⟶ in <code>Divide by 0</code> ⟶ break. Cái chốt này tồn tại vì chia nguyên cho 0 làm chương trình sập, còn chia thực cho 0 thì âm thầm cho ra <code>inf</code>; không cái nào là câu trả lời chấp nhận được để đưa cho người dùng.</li>
<li><strong>Chạy tay, nhập <code>4%5</code></strong> — op = <code>'%'</code> không khớp case nào ⟶ <code>default</code> ⟶ in <code>Op is not supported</code>.</li>
</ul>
<p class="dap-an">✅ Đáp án, đã biên dịch bằng <code>cc -Wall</code> và chạy: <code>4*5</code> ⟶ <strong>20.00</strong> · <code>4+5</code> ⟶ <strong>9.00</strong> · <code>4/0</code> ⟶ <strong>Divide by 0</strong> · <code>7/2</code> ⟶ <strong>3.50</strong> (lưu ý: kiểu <code>double</code> nên ra 3.50, không phải 3 như chia nguyên) · <code>4%5</code> ⟶ <strong>Op is not supported</strong>.</p>
<p class="pitfall">⚠️ <strong>Chuỗi định dạng <code>"%lf%c%lf"</code> của slide là mong manh — đây là đo thật, không phải đoán.</strong> Đã biên dịch và chạy: nó đọc đúng <code>4*5</code>, nhưng với đầu vào <code>4 * 5</code> (có dấu cách) thì nó <em>hỏng</em> — <code>%c</code> không bỏ qua khoảng trắng, nên <code>op</code> nhận dấu cách <code>' '</code>, rồi <code>%lf</code> thứ ba nghẹn ở ký tự <code>'*'</code>, để lại <code>num2</code> chưa khởi tạo. Cách chữa là một dấu cách trước <code>%c</code>: <code>"%lf %c %lf"</code> — bản này đã được kiểm và đọc đúng cả <code>4*5</code> lẫn <code>4 * 5</code>. Ngoài ra hãy luôn kiểm giá trị trả về của <code>scanf</code> — nó cho biết thực sự đã đọc được mấy mục.</p>`],

    ]),
  ].join('\n'),
};
