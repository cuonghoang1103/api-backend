/**
 * PRF192 · Slot 05-07 (deck 'prf3', 60 slide) — phần slide 24→40: CẤU TRÚC LẶP.
 * Nội dung bám ĐÚNG chữ trích từ file .pptx gốc của trường (/tmp/prf192-text/prf3.txt).
 *
 * Mọi đoạn C trong bài đã được trích ra file tạm, biên dịch bằng `cc -Wall` và CHẠY THẬT.
 * Các số đã kiểm:
 *   1+2+…+10 = 55 · 1+2+…+100 = 5050 · off-by-one (i<n) cho 45
 *   `for (i=1;i<=5;i++);` rồi `sum += i;`  →  sum = 6, i = 6 (thân rỗng, biên dịch sạch)
 *   Exercise 1 (do…while): 10 20 30 0 → 60 · 7 -3 0 → 4 · 0 → 0
 *   Exercise 2 (while): "abc1234fGH+-*\/?" + ENTER → digits 4, letters 6, others **6**
 *     (slide gốc đếm luôn phím ENTER vào noOthers — đã nêu rõ ở slide 34, KHÔNG sửa slide)
 *   Slide 27: n=7 → 16 · n=8 → 20 · n=10 (đếm lùi) → 30 · n=9 → 25
 *     S=1.0,i=1 với 1/pow(i,i-1), n=3 → 2,611111 (khớp đúng biểu thức có số 1 đứng đầu)
 *   n % 2 với n = -3 cho -1 (KHÔNG phải 1) — bẫy đã nêu ở slide 27
 *   break 0..9 dừng ở i==6 → "0 1 2 3 4 5" · continue bỏ i>5 → "0 1 2 3 4 5" (cùng kết quả)
 *   continue trong while quên i++ → kẹt vĩnh viễn tại i=2 (đo thật, phải chặn bằng bộ đếm)
 *   Cờ found: tìm 15 trong {4,9,15,7,15,2} → index 2; sau vòng lặp i = 3 (phải trừ 1)
 *   goto again: chạy 3 lượt · continue-sum lẻ 1..10 = 25 = bản dùng if
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'prf3';

export default {
  title: '4.0b — Slide by slide: Loops — for, while, do-while, break and flags (slides 24–40)|||4.0b — Slide bài giảng: Vòng lặp — for, while, do-while, break và biến cờ (slide 24–40)',
  slug: 'prf192-4-0b-slides-vong-lap',
  type: 'DOCUMENT',
  description: 'Phần vòng lặp của bộ slide Slot 05-07 (slide 24–40): cấu trúc một vòng lặp (khối khởi tạo, điều kiện, việc làm mỗi lượt), cách đọc một biểu thức toán ra vòng lặp, ba dạng lệnh for/while/do…while, hai bài Exercise được giải trọn vẹn kèm bảng vết từng lượt, break/continue, và kỹ thuật dùng biến cờ để giữ nguyên tắc "một lối vào, một lối ra". Mọi chương trình C trong bài đều đã biên dịch và chạy thật để đối chiếu kết quả.',
  content: [
    walkHead(D, 24, 40),
    walk(D, [

      [24, '4. Iteration (loop) Constructs',
        `<p class="y-chinh">🎯 A loop means "some statements are executed repetitively". Every loop you will ever write has exactly three parts: an <strong>initial block</strong>, a <strong>condition</strong>, and a <strong>task performed in each execution</strong>.</p>
<ul>
<li><strong>The slide definition, verbatim</strong> — "Loop/Iteration: some statements are executed repetitively". That is the third and last of the logic constructs: sequence (slide 12), selection (slides 13–23), iteration (from here on).</li>
<li><strong>Structure of a loop — three named parts</strong> — Initial block (what is true before the first repetition), Condition (the test that decides whether to repeat again), Task in each execution (the work, plus the step that moves you towards the condition becoming false).</li>
<li><strong>Why the third part has two halves</strong> — the "task" is nearly always <em>real work</em> plus <em>progress</em>. Forget the progress half and the condition never changes: that is exactly what an infinite loop is.</li>
<li><strong>Types of iteration: fixed loops vs variable loops</strong> — a <em>fixed</em> loop repeats a number of times you know before starting (print 1..100, read 10 marks). A <em>variable</em> loop repeats until something happens that you cannot predict (read numbers until the user types 0). This distinction decides which keyword you pick.</li>
<li><strong>The three C keywords</strong> — <code>while</code>, <code>do while</code>, <code>for</code>. They are equally powerful: anything one can do, the other two can do. The choice is about <em>readability</em>, not ability.</li>
<li><strong>Rule of thumb for the choice</strong> — counting a known number of times → <code>for</code>; repeating while a condition holds and possibly zero times → <code>while</code>; must run at least once (menus, re-entering bad input) → <code>do…while</code>.</li>
<li><strong>How the three parts map onto <code>for</code></strong> — the header <code>for (init; condition; step)</code> literally puts all three in one line, which is why beginners are taught <code>for</code> first even though <code>while</code> is simpler:
<pre><code>for (i = 1; i &lt;= 100; i++)   /* init · condition · step */
    sum += i;                 /* the real work */</code></pre></li>
</ul>
<p class="meo">💡 Before writing any loop, say the three parts out loud in Vietnamese first: "bắt đầu từ đâu — lặp khi nào còn đúng — mỗi lượt làm gì". If you cannot say all three, you do not yet understand the problem, and no amount of syntax will rescue you.</p>`,
        `<p class="y-chinh">🎯 Vòng lặp nghĩa là "một số câu lệnh được thực hiện lặp đi lặp lại". Mọi vòng lặp bạn từng viết đều có đúng ba phần: <strong>khối khởi tạo</strong>, <strong>điều kiện</strong>, và <strong>việc làm trong mỗi lượt chạy</strong>.</p>
<ul>
<li><strong>Định nghĩa nguyên văn trên slide</strong> — "Loop/Iteration: some statements are executed repetitively". Đây là cấu trúc logic thứ ba và cũng là cuối cùng: tuần tự (slide 12), rẽ nhánh (slide 13–23), lặp (từ đây trở đi).</li>
<li><strong>Cấu trúc một vòng lặp — ba phần có tên</strong> — Initial block (cái gì đúng trước lượt lặp đầu tiên), Condition (phép thử quyết định có lặp tiếp không), Task in each execution (phần việc, cộng với bước đẩy cho điều kiện dần sai đi).</li>
<li><strong>Vì sao phần thứ ba lại có hai nửa</strong> — "việc làm" gần như luôn gồm <em>việc thật</em> cộng <em>bước tiến</em>. Quên nửa bước tiến thì điều kiện không bao giờ đổi: đó chính xác là định nghĩa của vòng lặp vô hạn.</li>
<li><strong>Hai loại lặp: fixed loops và variable loops</strong> — lặp <em>cố định</em> là lặp một số lần bạn biết trước khi bắt đầu (in 1..100, đọc 10 điểm). Lặp <em>biến thiên</em> là lặp cho tới khi có chuyện xảy ra mà bạn không đoán trước được (đọc số cho tới khi người dùng gõ 0). Phân biệt này quyết định bạn chọn từ khoá nào.</li>
<li><strong>Ba từ khoá của C</strong> — <code>while</code>, <code>do while</code>, <code>for</code>. Chúng mạnh ngang nhau: cái nào làm được thì hai cái kia cũng làm được. Chọn là chọn cho <em>dễ đọc</em>, không phải vì khả năng.</li>
<li><strong>Mẹo chọn nhanh</strong> — đếm đúng số lần đã biết → <code>for</code>; lặp trong khi điều kiện còn đúng và có thể lặp không lần nào → <code>while</code>; bắt buộc chạy ít nhất một lần (menu, nhập lại dữ liệu sai) → <code>do…while</code>.</li>
<li><strong>Ba phần đó ánh xạ vào <code>for</code> ra sao</strong> — dòng đầu <code>for (khởi tạo; điều kiện; bước)</code> gói cả ba vào một dòng, và đó là lý do người mới học được dạy <code>for</code> trước dù <code>while</code> đơn giản hơn:
<pre><code>for (i = 1; i &lt;= 100; i++)   /* khởi tạo · điều kiện · bước */
    sum += i;                 /* phần việc thật */</code></pre></li>
</ul>
<p class="meo">💡 Trước khi viết bất kỳ vòng lặp nào, hãy nói ba phần đó ra miệng bằng tiếng Việt trước: "bắt đầu từ đâu — lặp khi nào còn đúng — mỗi lượt làm gì". Nếu chưa nói được đủ ba, nghĩa là bạn chưa hiểu bài toán, và không cú pháp nào cứu được.</p>`],

      [25, 'Iteration Constructs (cont.) — Identify a loop',
        `<p class="y-chinh">🎯 Before coding, you must <em>recognise</em> that a problem needs a loop. The tell-tale sign is a verb that repeats: "some additions are performed", "accept and add numbers".</p>
<ul>
<li><strong>Example 1 on the slide</strong> — "Calculate S = 1 + 2 + 3 + 4 + 5 + 6 + 7 + … + 100". The slide's own reasoning: <em>some additions are performed → Loop</em>. One <code>+</code> is a statement; ninety-nine of them following a pattern is a loop.</li>
<li><strong>Example 2 on the slide</strong> — "Sum of some numbers they are inputted until user enters 0". Reasoning: <em>accept and add numbers → Loop</em>.</li>
<li><strong>The two examples are deliberately different kinds</strong> — Example 1 is a <strong>fixed</strong> loop (exactly 100 repetitions, known in advance). Example 2 is a <strong>variable</strong> loop (you cannot know how many numbers the user will type). That is slide 24's "fixed loops, variable loops" made concrete.</li>
<li><strong>Why never unroll by hand</strong> — writing <code>S = 1+2+3+…</code> as a hundred terms is possible but it does not scale: change 100 to 1000 and you rewrite everything. A loop turns "how many" into <em>data</em> instead of <em>code</em>.</li>
<li><strong>Example 1 in C — the counted form</strong>:
<pre><code>int i, S = 0;
for (i = 1; i &lt;= 100; i++) S += i;
printf("%d\\n", S);        /* prints 5050 */</code></pre>
Checked by running: 5050, which matches 100 × 101 / 2.</li>
<li><strong>Example 2 in C — the sentinel form</strong>:
<pre><code>int x, S = 0;
do { scanf("%d", &amp;x); S += x; } while (x != 0);
printf("%d\\n", S);</code></pre>
The value 0 here is called a <strong>sentinel</strong>: a data value that means "stop", not "add this". Adding it is harmless only because 0 is the neutral element of addition — for a product you would need <code>if (x != 0) P *= x;</code>.</li>
<li><strong>The question that identifies a loop</strong> — "does the same kind of step happen more than once, with something changing between the steps?" If yes, loop. What changes between steps is your loop variable.</li>
</ul>
<p class="dap-an">✅ Đáp án: Example 1 → fixed loop, 100 lượt, S = 5050 (đã chạy thật). Example 2 → variable loop, số lượt do người dùng quyết định, dừng khi gặp sentinel 0.</p>`,
        `<p class="y-chinh">🎯 Trước khi viết code, bạn phải <em>nhận ra</em> bài toán cần vòng lặp. Dấu hiệu là một động từ lặp lại: "some additions are performed", "accept and add numbers".</p>
<ul>
<li><strong>Ví dụ 1 trên slide</strong> — "Calculate S = 1 + 2 + 3 + 4 + 5 + 6 + 7 + … + 100". Lập luận của chính slide: <em>có nhiều phép cộng được thực hiện → Loop</em>. Một dấu <code>+</code> là một câu lệnh; chín mươi chín dấu cộng theo một quy luật là một vòng lặp.</li>
<li><strong>Ví dụ 2 trên slide</strong> — "Sum of some numbers they are inputted until user enters 0". Lập luận: <em>nhận vào rồi cộng dồn các số → Loop</em>.</li>
<li><strong>Hai ví dụ được chọn khác loại có chủ ý</strong> — Ví dụ 1 là lặp <strong>cố định</strong> (đúng 100 lượt, biết trước). Ví dụ 2 là lặp <strong>biến thiên</strong> (không thể biết người dùng sẽ gõ bao nhiêu số). Đó chính là "fixed loops, variable loops" của slide 24 được cụ thể hoá.</li>
<li><strong>Vì sao không bao giờ viết trải ra bằng tay</strong> — viết <code>S = 1+2+3+…</code> thành một trăm số hạng thì vẫn được, nhưng không mở rộng được: đổi 100 thành 1000 là phải viết lại hết. Vòng lặp biến "bao nhiêu lần" từ <em>mã nguồn</em> thành <em>dữ liệu</em>.</li>
<li><strong>Ví dụ 1 bằng C — dạng đếm</strong>:
<pre><code>int i, S = 0;
for (i = 1; i &lt;= 100; i++) S += i;
printf("%d\\n", S);        /* in ra 5050 */</code></pre>
Đã chạy thật: 5050, khớp công thức 100 × 101 / 2.</li>
<li><strong>Ví dụ 2 bằng C — dạng có giá trị canh</strong>:
<pre><code>int x, S = 0;
do { scanf("%d", &amp;x); S += x; } while (x != 0);
printf("%d\\n", S);</code></pre>
Số 0 ở đây gọi là <strong>sentinel</strong> (giá trị canh): nó mang nghĩa "dừng", không phải "cộng cái này vào". Cộng nó vào vô hại chỉ vì 0 là phần tử trung hoà của phép cộng — nếu là phép nhân thì phải viết <code>if (x != 0) P *= x;</code>.</li>
<li><strong>Câu hỏi giúp nhận ra vòng lặp</strong> — "có cùng một loại bước xảy ra nhiều hơn một lần, với một thứ gì đó thay đổi giữa các bước không?". Có thì là vòng lặp. Thứ thay đổi giữa các bước chính là biến lặp của bạn.</li>
</ul>
<p class="dap-an">✅ Đáp án: Ví dụ 1 → lặp cố định, 100 lượt, S = 5050 (đã chạy thật). Ví dụ 2 → lặp biến thiên, số lượt do người dùng quyết định, dừng khi gặp giá trị canh 0.</p>`],

      [26, 'Iteration Constructs (cont.) — Identify a loop for an expression',
        `<p class="y-chinh">🎯 A recipe for turning a mathematical expression into a loop: <strong>left side → initial block</strong>, <strong>right side → condition</strong>, <strong>the repeated operation plus the preparation for the next term → tasks in each iteration</strong>.</p>
<ul>
<li><strong>The trick the slide uses</strong> — it first <em>rewrites</em> the expression so that the first term becomes the initial value. "S = 1+2+3+4+…+100" is rewritten as "S = <strong>0</strong>+1+2+3+4+…+100"; "S = 1*2*3*4*…*100" becomes "S = <strong>1</strong>*1*2*3*4*…*100". The inserted number is the neutral element: 0 for sums, 1 for products.</li>
<li><strong>Sum case, as read off the slide</strong> — Initial: <code>S = 0; i = 1;</code> · Condition: <code>i &lt;= 100</code> · Tasks: (1) <code>S = S + i;</code> (2) <code>i = i + 1;</code>. Two tasks, numbered, in that order — the slide numbers them because the order matters.</li>
<li><strong>Product case</strong> — Initial: <code>S = 1; i = 1;</code> · Condition: <code>i &lt;= 100</code> · Tasks: (1) <code>S = S * i;</code> (2) <code>i = i + 1;</code>. The slide also notes the alternative <code>S = 1; i = 2;</code> — legal here only because multiplying by 1 changes nothing.</li>
<li><strong>Why order of the two tasks matters</strong> — swap them and you compute a different sum. Verified by running: with <code>S += i; i++;</code> over i = 1..100 you get 5050; with <code>i++; S += i;</code> you get 5150, because the first term added becomes 2 and the last becomes 101.</li>
<li><strong>Neutral element, stated once</strong> — accumulating with <code>+</code> starts at 0; accumulating with <code>*</code> starts at 1; accumulating a maximum starts at the first element (never at 0 — that breaks for all-negative data).</li>
<li><strong>Both forms in code, side by side</strong>:
<pre><code>int i, S = 0, P = 1;
for (i = 1; i &lt;= 100; i++) S += i;   /* 5050 */
for (i = 1; i &lt;= 10;  i++) P *= i;   /* 10! = 3628800 */</code></pre></li>
<li><strong>Where the recipe pays off</strong> — in the exam you are rarely asked "write a loop". You are asked "compute S = …". The three-line recipe is how you get from the second question to the first without guessing.</li>
</ul>
<p class="meo">💡 Write the three lines on your exam paper before writing any C: <em>Initial:</em> … <em>Condition:</em> … <em>Tasks:</em> …. It is exactly the layout the lecturer uses on this slide, and it converts to a <code>for</code> header mechanically.</p>`,
        `<p class="y-chinh">🎯 Công thức biến một biểu thức toán thành vòng lặp: <strong>vế trái → khối khởi tạo</strong>, <strong>vế phải → điều kiện</strong>, <strong>phép toán lặp lại cộng với việc chuẩn bị cho số hạng kế tiếp → việc làm mỗi lượt</strong>.</p>
<ul>
<li><strong>Mẹo mà slide dùng</strong> — nó <em>viết lại</em> biểu thức sao cho số hạng đầu trở thành giá trị khởi tạo. "S = 1+2+3+4+…+100" được viết lại thành "S = <strong>0</strong>+1+2+3+4+…+100"; "S = 1*2*3*4*…*100" thành "S = <strong>1</strong>*1*2*3*4*…*100". Số được chèn vào chính là phần tử trung hoà: 0 cho tổng, 1 cho tích.</li>
<li><strong>Trường hợp tổng, đọc thẳng từ slide</strong> — Khởi tạo: <code>S = 0; i = 1;</code> · Điều kiện: <code>i &lt;= 100</code> · Việc làm: (1) <code>S = S + i;</code> (2) <code>i = i + 1;</code>. Hai việc, có đánh số, theo đúng thứ tự đó — slide đánh số vì thứ tự có ý nghĩa.</li>
<li><strong>Trường hợp tích</strong> — Khởi tạo: <code>S = 1; i = 1;</code> · Điều kiện: <code>i &lt;= 100</code> · Việc làm: (1) <code>S = S * i;</code> (2) <code>i = i + 1;</code>. Slide còn ghi thêm phương án <code>S = 1; i = 2;</code> — chỉ hợp lệ ở đây vì nhân với 1 không đổi gì.</li>
<li><strong>Vì sao thứ tự hai việc lại quan trọng</strong> — đảo lại là ra tổng khác. Đã chạy kiểm: với <code>S += i; i++;</code> chạy i = 1..100 được 5050; với <code>i++; S += i;</code> được 5150, vì số hạng đầu cộng vào thành 2 còn số hạng cuối thành 101.</li>
<li><strong>Phần tử trung hoà, nói một lần cho nhớ</strong> — cộng dồn bằng <code>+</code> thì bắt đầu từ 0; cộng dồn bằng <code>*</code> thì bắt đầu từ 1; tìm giá trị lớn nhất thì bắt đầu từ phần tử đầu tiên (không bao giờ từ 0 — dữ liệu toàn số âm là sai ngay).</li>
<li><strong>Hai dạng đặt cạnh nhau trong code</strong>:
<pre><code>int i, S = 0, P = 1;
for (i = 1; i &lt;= 100; i++) S += i;   /* 5050 */
for (i = 1; i &lt;= 10;  i++) P *= i;   /* 10! = 3628800 */</code></pre></li>
<li><strong>Công thức này có giá ở đâu</strong> — trong đề thi người ta hiếm khi bảo "hãy viết một vòng lặp". Người ta bảo "tính S = …". Ba dòng công thức là đường đi từ câu hỏi thứ hai về câu hỏi thứ nhất mà không phải đoán.</li>
</ul>
<p class="meo">💡 Hãy viết ba dòng đó ra giấy thi trước khi viết C: <em>Khởi tạo:</em> … <em>Điều kiện:</em> … <em>Việc làm:</em> …. Đó đúng là bố cục giảng viên dùng trên slide này, và nó chuyển sang dòng <code>for</code> một cách máy móc.</p>`],

      [27, 'Iteration Constructs (cont.) — Three worked expressions',
        `<p class="y-chinh">🎯 Three harder expressions, each solved with the same three-line recipe — and each one hiding a different trap: parity, counting downwards, and a library call.</p>
<ul>
<li><strong>Expression 1</strong> — S = 0 when n ≤ 0; S = 1+3+5+…+n when n is odd; S = 2+4+6+…+n when n is even. The slide's answer: <code>S = 0; i = (n%2==1) ? 1 : 2;</code> · condition <code>i &lt;= n</code> · tasks <code>S += i; i += 2;</code>. One conditional expression replaces two whole branches.</li>
<li><strong>Checked by running</strong> — n = 7 → 1+3+5+7 = <strong>16</strong>; n = 8 → 2+4+6+8 = <strong>20</strong>; n = -3 → the loop body never runs, so S stays <strong>0</strong>, as required.</li>
<li><strong>Expression 2</strong> — S = 0 when n ≤ 0; otherwise n + (n-2) + (n-4) + … + 0. The slide's answer: <code>S = 0; i = n;</code> · condition <code>i &gt; 0</code> · tasks <code>S += i; i -= 2;</code>. This one counts <em>down</em>, so the step is <code>-=</code> and the condition is <code>&gt;</code>, not <code>&lt;=</code>.</li>
<li><strong>Checked by running</strong> — n = 10 → 10+8+6+4+2 = <strong>30</strong> (the final 0 adds nothing, which is why the condition may stop at <code>i &gt; 0</code>); n = 9 → 9+7+5+3+1 = <strong>25</strong>. Note the slide writes the series as "… + 0", which is only literally true when n is even; for odd n the last term is 1. The code is right either way.</li>
<li><strong>Expression 3</strong> — S = 1 + 1/1⁰ + 1/2¹ + 1/3² + … + 1/n<sup>n-1</sup>. The slide's answer: <code>S = 1.0; i = 1;</code> · condition <code>i &lt;= n</code> · tasks <code>S += 1.0/pow(i, i-1); i = i + 1;</code>, with the note <em>math.h</em> because <code>pow</code> lives there.</li>
<li><strong>Checked by running</strong> — for n = 3 this gives 1 + 1 + 0.5 + 0.111… = <strong>2.611111</strong>, which is exactly the written expression (the leading 1 is a separate constant term, and the i = 1 term 1/1⁰ is also 1). Had you started from <code>S = 0.0</code> you would get 1.611111 — a different value, so read the leading constant carefully.</li>
<li><strong>The three programs, compiled and run</strong>:
<pre><code>#include &lt;stdio.h&gt;
#include &lt;math.h&gt;        /* for pow(), link with -lm on gcc/clang */

int main(void) {
    int n = 7, i, S = 0;
    double T = 1.0;
    for (i = (n % 2 == 1) ? 1 : 2; i &lt;= n; i += 2) S += i;
    printf("expr1 n=7  -&gt; %d\\n", S);       /* 16 */
    S = 0; n = 10;
    for (i = n; i &gt; 0; i -= 2) S += i;
    printf("expr2 n=10 -&gt; %d\\n", S);       /* 30 */
    n = 3;
    for (i = 1; i &lt;= n; i++) T += 1.0 / pow(i, i - 1);
    printf("expr3 n=3  -&gt; %.6f\\n", T);     /* 2.611111 */
    return 0;
}</code></pre></li>
</ul>
<p class="pitfall">⚠️ The parity test <code>n % 2 == 1</code> is <strong>false for negative odd numbers in C</strong>: measured, <code>-3 % 2</code> is <code>-1</code>, not <code>1</code>. Here it is harmless (for n ≤ 0 the loop never runs), but as a habit write <code>n % 2 != 0</code>, which is correct for every sign.</p>
<p class="dap-an">✅ Đáp án: expr1 n=7 → 16, n=8 → 20 · expr2 n=10 → 30, n=9 → 25 · expr3 n=3 → 2,611111. Cả ba đều đã biên dịch bằng <code>cc -Wall … -lm</code> và chạy thật.</p>`,
        `<p class="y-chinh">🎯 Ba biểu thức khó hơn, mỗi cái giải bằng đúng công thức ba dòng — và mỗi cái giấu một cái bẫy khác nhau: tính chẵn lẻ, đếm lùi, và một lời gọi thư viện.</p>
<ul>
<li><strong>Biểu thức 1</strong> — S = 0 khi n ≤ 0; S = 1+3+5+…+n khi n lẻ; S = 2+4+6+…+n khi n chẵn. Đáp án của slide: <code>S = 0; i = (n%2==1) ? 1 : 2;</code> · điều kiện <code>i &lt;= n</code> · việc làm <code>S += i; i += 2;</code>. Một toán tử điều kiện thay cho cả hai nhánh.</li>
<li><strong>Đã chạy kiểm</strong> — n = 7 → 1+3+5+7 = <strong>16</strong>; n = 8 → 2+4+6+8 = <strong>20</strong>; n = -3 → thân vòng lặp không chạy lần nào, S giữ nguyên <strong>0</strong>, đúng yêu cầu.</li>
<li><strong>Biểu thức 2</strong> — S = 0 khi n ≤ 0; ngược lại n + (n-2) + (n-4) + … + 0. Đáp án của slide: <code>S = 0; i = n;</code> · điều kiện <code>i &gt; 0</code> · việc làm <code>S += i; i -= 2;</code>. Cái này đếm <em>lùi</em>, nên bước là <code>-=</code> và điều kiện là <code>&gt;</code> chứ không phải <code>&lt;=</code>.</li>
<li><strong>Đã chạy kiểm</strong> — n = 10 → 10+8+6+4+2 = <strong>30</strong> (số 0 cuối cùng cộng vào không đổi gì, nên điều kiện dừng ở <code>i &gt; 0</code> là được); n = 9 → 9+7+5+3+1 = <strong>25</strong>. Chú ý slide viết dãy kết thúc "… + 0", điều này chỉ đúng theo nghĩa đen khi n chẵn; n lẻ thì số hạng cuối là 1. Code thì đúng cho cả hai.</li>
<li><strong>Biểu thức 3</strong> — S = 1 + 1/1⁰ + 1/2¹ + 1/3² + … + 1/n<sup>n-1</sup>. Đáp án của slide: <code>S = 1.0; i = 1;</code> · điều kiện <code>i &lt;= n</code> · việc làm <code>S += 1.0/pow(i, i-1); i = i + 1;</code>, kèm ghi chú <em>math.h</em> vì <code>pow</code> nằm ở đó.</li>
<li><strong>Đã chạy kiểm</strong> — với n = 3 ra 1 + 1 + 0,5 + 0,111… = <strong>2,611111</strong>, đúng bằng biểu thức đã viết (số 1 đứng đầu là một hằng số riêng, còn số hạng i = 1 là 1/1⁰ cũng bằng 1). Nếu khởi tạo <code>S = 0.0</code> thì ra 1,611111 — một giá trị khác hẳn, nên phải đọc kỹ hằng số đứng đầu dãy.</li>
<li><strong>Ba chương trình, đã biên dịch và chạy</strong>:
<pre><code>#include &lt;stdio.h&gt;
#include &lt;math.h&gt;        /* cho pow(), gcc/clang phải thêm -lm */

int main(void) {
    int n = 7, i, S = 0;
    double T = 1.0;
    for (i = (n % 2 == 1) ? 1 : 2; i &lt;= n; i += 2) S += i;
    printf("expr1 n=7  -&gt; %d\\n", S);       /* 16 */
    S = 0; n = 10;
    for (i = n; i &gt; 0; i -= 2) S += i;
    printf("expr2 n=10 -&gt; %d\\n", S);       /* 30 */
    n = 3;
    for (i = 1; i &lt;= n; i++) T += 1.0 / pow(i, i - 1);
    printf("expr3 n=3  -&gt; %.6f\\n", T);     /* 2.611111 */
    return 0;
}</code></pre></li>
</ul>
<p class="pitfall">⚠️ Phép thử chẵn lẻ <code>n % 2 == 1</code> <strong>SAI với số lẻ âm trong C</strong>: đo thật, <code>-3 % 2</code> ra <code>-1</code> chứ không phải <code>1</code>. Ở đây vô hại (n ≤ 0 thì vòng lặp không chạy), nhưng nên tập thói quen viết <code>n % 2 != 0</code>, đúng với mọi dấu.</p>
<p class="dap-an">✅ Đáp án: expr1 n=7 → 16, n=8 → 20 · expr2 n=10 → 30, n=9 → 25 · expr3 n=3 → 2,611111. Cả ba đều đã biên dịch bằng <code>cc -Wall … -lm</code> và chạy thật.</p>`],

      [28, 'Iteration — for statement',
        `<p class="y-chinh">🎯 The general form is <code>for (InitBlock; Condition; Task2) Task1;</code> — and the slide immediately shows that <strong>all three header parts are optional</strong>.</p>
<ul>
<li><strong>Form 1 — everything in the header</strong>: <code>for (InitBlock; Condition; Task2) Task1;</code>. Task1 is the body (the real work), Task2 is the step. Execution order is: InitBlock once → test Condition → Task1 → Task2 → test again.</li>
<li><strong>Form 2 — comma operator</strong>: <code>for (Init1, Init2; Condition; Task1, Task2);</code>. The comma lets you initialise or step two variables at once. Verified by running: <code>for (a = 0, b = 10; a &lt; b; a++, b--)</code> runs 5 times and ends with a = b = 5.</li>
<li><strong>Form 3 — empty init</strong>: <code>InitBlock;</code> written above, then <code>for ( ; Condition ; Task2) Task1;</code>. Useful when the starting value is computed by a longer piece of code.</li>
<li><strong>Form 4 — empty init and empty step</strong>: <code>InitBlock;</code> then <code>for ( ; Condition ; ) { Task1; Task2; }</code>. At this point the <code>for</code> has become a <code>while</code> — which is exactly the lesson: the three loop keywords are interchangeable.</li>
<li><strong>Taking it one step further</strong> — <code>for (;;)</code> with all three parts empty is an <strong>infinite loop</strong>, identical to <code>while (1)</code>. An empty condition counts as <em>true</em>. It is legal and sometimes idiomatic, but then the exit must come from a <code>break</code> inside:
<pre><code>int k = 0;
for (;;) { k++; if (k == 4) break; }   /* verified: exits with k = 4 */</code></pre></li>
<li><strong>The single most damaging typo in C</strong> — a stray semicolon right after the header:
<pre><code>for (i = 1; i &lt;= n; i++);   /* &lt;-- this ';' IS the whole body */
    sum += i;                /* runs ONCE, after the loop */</code></pre>
Measured with n = 5: <code>sum</code> ends at <strong>6</strong> and <code>i</code> at <strong>6</strong> — not 15. It compiles cleanly; <code>cc -Wall</code> does give <em>"for loop has empty body"</em>, which is one more reason to always compile with warnings on.</li>
<li><strong>The indentation lies</strong> — in that example <code>sum += i;</code> is indented as if it were inside the loop. C does not care about indentation; only the braces and semicolons decide. This is why slide 47 says "Avoid iterations with empty bodies".</li>
</ul>
<p class="pitfall">⚠️ Same trap, same day, different keyword: <code>while (i &lt; n);</code> with a semicolon is <em>worse</em> than the <code>for</code> version — since nothing inside ever changes <code>i</code>, the program hangs forever with no output and no error.</p>`,
        `<p class="y-chinh">🎯 Dạng tổng quát là <code>for (InitBlock; Condition; Task2) Task1;</code> — và slide cho thấy ngay rằng <strong>cả ba phần trong ngoặc đều tuỳ chọn</strong>.</p>
<ul>
<li><strong>Dạng 1 — mọi thứ nằm trong ngoặc</strong>: <code>for (khởi tạo; điều kiện; Task2) Task1;</code>. Task1 là thân (phần việc thật), Task2 là bước nhảy. Thứ tự chạy: khởi tạo một lần → kiểm tra điều kiện → Task1 → Task2 → kiểm tra lại.</li>
<li><strong>Dạng 2 — toán tử dấu phẩy</strong>: <code>for (Init1, Init2; Condition; Task1, Task2);</code>. Dấu phẩy cho phép khởi tạo hoặc tăng hai biến cùng lúc. Đã chạy kiểm: <code>for (a = 0, b = 10; a &lt; b; a++, b--)</code> chạy 5 lượt và kết thúc với a = b = 5.</li>
<li><strong>Dạng 3 — bỏ trống phần khởi tạo</strong>: viết <code>InitBlock;</code> ở dòng trên, rồi <code>for ( ; điều kiện ; Task2) Task1;</code>. Hữu ích khi giá trị bắt đầu phải tính bằng một đoạn code dài hơn.</li>
<li><strong>Dạng 4 — bỏ trống cả khởi tạo lẫn bước</strong>: <code>InitBlock;</code> rồi <code>for ( ; điều kiện ; ) { Task1; Task2; }</code>. Đến đây thì <code>for</code> đã trở thành <code>while</code> — và đó chính là bài học: ba từ khoá lặp thay thế được cho nhau.</li>
<li><strong>Đi thêm một bước nữa</strong> — <code>for (;;)</code> bỏ trống cả ba phần là <strong>vòng lặp vô hạn</strong>, y hệt <code>while (1)</code>. Điều kiện để trống được coi là <em>đúng</em>. Nó hợp lệ và đôi khi là cách viết quen thuộc, nhưng khi đó lối thoát phải là một lệnh <code>break</code> bên trong:
<pre><code>int k = 0;
for (;;) { k++; if (k == 4) break; }   /* đã kiểm: thoát với k = 4 */</code></pre></li>
<li><strong>Lỗi gõ thừa tai hại nhất trong C</strong> — một dấu chấm phẩy lạc ngay sau ngoặc:
<pre><code>for (i = 1; i &lt;= n; i++);   /* &lt;-- dấu ';' này CHÍNH LÀ toàn bộ thân */
    sum += i;                /* chạy MỘT lần, sau vòng lặp */</code></pre>
Đo thật với n = 5: <code>sum</code> kết thúc bằng <strong>6</strong> và <code>i</code> bằng <strong>6</strong> — không phải 15. Nó biên dịch sạch; <code>cc -Wall</code> có báo <em>"for loop has empty body"</em>, thêm một lý do để luôn bật cảnh báo khi biên dịch.</li>
<li><strong>Cách thụt lề nói dối</strong> — trong ví dụ trên, dòng <code>sum += i;</code> được thụt vào như thể nó nằm trong vòng lặp. C không quan tâm thụt lề; chỉ dấu ngoặc nhọn và dấu chấm phẩy quyết định. Đây là lý do slide 47 viết "Avoid iterations with empty bodies".</li>
</ul>
<p class="pitfall">⚠️ Cùng cái bẫy đó, đổi từ khoá thì <em>nặng hơn</em>: <code>while (i &lt; n);</code> có dấu chấm phẩy — vì không có gì bên trong làm <code>i</code> đổi, chương trình treo vĩnh viễn, không in ra gì và cũng không báo lỗi gì.</p>`],

      [29, 'Iteration — for statement (cont.): 1+2+3+…+n',
        `<p class="y-chinh">🎯 The slide's full worked example: read n, compute 1+2+3+…+n, print it. The analysis columns are exactly the three-line recipe from slide 26.</p>
<ul>
<li><strong>Analysis, as written on the slide</strong> — Accepted variable: <code>int n</code> · Sum 1..N: <code>int sum</code> · Algorithm: accept n → Loop (Initialize i = 1, sum = 0 · Condition i &lt;= n · Tasks: sum += i; i++) → print out sum.</li>
<li><strong>Naming, straight from the style rules</strong> — <code>n</code> and <code>i</code> are deliberately one letter: slide 43 says "Keep the names of indices very short — treat them as mathematical notation". <code>sum</code> is a noun, as slide 43 also asks.</li>
<li><strong>The program</strong>:
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    int n, i, sum = 0;
    printf("Enter n: ");
    scanf("%d", &amp;n);
    for (i = 1; i &lt;= n; i++)
        sum += i;
    printf("Sum = %d\\n", sum);
    return 0;
}</code></pre></li>
<li><strong>Trace table for n = 5</strong> — one row per test of the condition:
<table>
<tr><th>Lượt</th><th>i (trước thân)</th><th>i &lt;= 5 ?</th><th>sum += i</th><th>i++ → i</th></tr>
<tr><td>khởi tạo</td><td>1</td><td>—</td><td>sum = 0</td><td>—</td></tr>
<tr><td>1</td><td>1</td><td>đúng</td><td>0 + 1 = 1</td><td>2</td></tr>
<tr><td>2</td><td>2</td><td>đúng</td><td>1 + 2 = 3</td><td>3</td></tr>
<tr><td>3</td><td>3</td><td>đúng</td><td>3 + 3 = 6</td><td>4</td></tr>
<tr><td>4</td><td>4</td><td>đúng</td><td>6 + 4 = 10</td><td>5</td></tr>
<tr><td>5</td><td>5</td><td>đúng</td><td>10 + 5 = 15</td><td>6</td></tr>
<tr><td>6</td><td>6</td><td><strong>sai → thoát</strong></td><td>—</td><td>—</td></tr>
</table></li>
<li><strong>Off-by-one, the classic</strong> — change <code>i &lt;= n</code> to <code>i &lt; n</code> and for n = 10 the answer drops from <strong>55</strong> to <strong>45</strong>: the last term n is silently missing. Both compile, both run, only one is right. Measured, not guessed.</li>
<li><strong>How to check for off-by-one in two seconds</strong> — count the repetitions, not the values. <code>for (i = 0; i &lt; n; i++)</code> runs exactly n times; <code>for (i = 1; i &lt;= n; i++)</code> also runs exactly n times; <code>for (i = 0; i &lt;= n; i++)</code> runs <strong>n + 1</strong> times. Memorise the third one as the usual bug.</li>
<li><strong>The slide's own homework</strong> — "Requirement: Students practice other structures of for and give feedback", i.e. rewrite this same program with each of the four forms from slide 28. Do it: the loop that counts down (<code>for (i = n; i &gt;= 1; i--)</code>) gives the same 15 and proves the order of addition does not matter here.</li>
</ul>
<p class="dap-an">✅ Đáp án: n = 5 → Sum = 15 · n = 10 → 55 · n = 100 → 5050 (đã chạy thật). Bản viết nhầm <code>i &lt; n</code> với n = 10 cho 45.</p>`,
        `<p class="y-chinh">🎯 Ví dụ giải đầy đủ của slide: đọc n, tính 1+2+3+…+n, in ra. Các cột phân tích chính là công thức ba dòng của slide 26.</p>
<ul>
<li><strong>Phân tích, nguyên văn trên slide</strong> — Biến nhận vào: <code>int n</code> · Tổng 1..N: <code>int sum</code> · Giải thuật: nhận n → Vòng lặp (Khởi tạo i = 1, sum = 0 · Điều kiện i &lt;= n · Việc làm: sum += i; i++) → in sum.</li>
<li><strong>Cách đặt tên, lấy thẳng từ quy tắc văn phong</strong> — <code>n</code> và <code>i</code> để một chữ cái là có chủ ý: slide 43 viết "Keep the names of indices very short — treat them as mathematical notation". Còn <code>sum</code> là danh từ, cũng đúng yêu cầu của slide 43.</li>
<li><strong>Chương trình</strong>:
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    int n, i, sum = 0;
    printf("Nhap n: ");
    scanf("%d", &amp;n);
    for (i = 1; i &lt;= n; i++)
        sum += i;
    printf("Tong = %d\\n", sum);
    return 0;
}</code></pre></li>
<li><strong>Bảng vết với n = 5</strong> — mỗi dòng là một lần kiểm tra điều kiện:
<table>
<tr><th>Lượt</th><th>i (trước thân)</th><th>i &lt;= 5 ?</th><th>sum += i</th><th>i++ → i</th></tr>
<tr><td>khởi tạo</td><td>1</td><td>—</td><td>sum = 0</td><td>—</td></tr>
<tr><td>1</td><td>1</td><td>đúng</td><td>0 + 1 = 1</td><td>2</td></tr>
<tr><td>2</td><td>2</td><td>đúng</td><td>1 + 2 = 3</td><td>3</td></tr>
<tr><td>3</td><td>3</td><td>đúng</td><td>3 + 3 = 6</td><td>4</td></tr>
<tr><td>4</td><td>4</td><td>đúng</td><td>6 + 4 = 10</td><td>5</td></tr>
<tr><td>5</td><td>5</td><td>đúng</td><td>10 + 5 = 15</td><td>6</td></tr>
<tr><td>6</td><td>6</td><td><strong>sai → thoát</strong></td><td>—</td><td>—</td></tr>
</table></li>
<li><strong>Lệch một đơn vị, lỗi kinh điển</strong> — đổi <code>i &lt;= n</code> thành <code>i &lt; n</code> thì với n = 10 đáp số tụt từ <strong>55</strong> xuống <strong>45</strong>: số hạng cuối cùng n bị mất một cách im lặng. Cả hai đều biên dịch được, cả hai đều chạy, chỉ một cái đúng. Đây là số đo, không phải đoán.</li>
<li><strong>Cách kiểm lệch một đơn vị trong hai giây</strong> — đếm số lượt, đừng đếm giá trị. <code>for (i = 0; i &lt; n; i++)</code> chạy đúng n lượt; <code>for (i = 1; i &lt;= n; i++)</code> cũng đúng n lượt; <code>for (i = 0; i &lt;= n; i++)</code> chạy <strong>n + 1</strong> lượt. Hãy nhớ cái thứ ba như một lỗi thường gặp.</li>
<li><strong>Bài tập chính slide giao</strong> — "Requirement: Students practice other structures of for and give feedback", tức là viết lại đúng chương trình này bằng cả bốn dạng của slide 28. Hãy làm thật: bản đếm lùi (<code>for (i = n; i &gt;= 1; i--)</code>) vẫn cho 15 và chứng minh thứ tự cộng ở đây không ảnh hưởng.</li>
</ul>
<p class="dap-an">✅ Đáp án: n = 5 → Tong = 15 · n = 10 → 55 · n = 100 → 5050 (đã chạy thật). Bản viết nhầm <code>i &lt; n</code> với n = 10 cho 45.</p>`],

      [30, 'Iteration — for statement: Practice 3 (ASCII table)',
        `<p class="y-chinh">🎯 Practice 3: print the whole ASCII table with a <code>for</code> loop — codes 0 to 255, each shown in four formats: <code>%c</code>, <code>%d</code>, <code>%o</code>, <code>%X</code>.</p>
<ul>
<li><strong>Analysis, verbatim from the slide</strong> — ASCII code: 0 → 255 · Initialize: <code>int code = 0</code> · Condition: <code>code &lt; 256</code> · Task: print the code using 4 formats (%c, %d, %o, %X) and <code>code = code + 1</code>.</li>
<li><strong>Why the type must be <code>int</code>, not <code>char</code></strong> — this is the whole hidden point of the exercise. An <code>unsigned char</code> holds 0..255, so <code>code &lt; 256</code> is <em>always true</em>: the counter wraps 255 → 0 and the loop never ends. Measured: with <code>unsigned char</code> the loop was still running after 1000 steps and had to be cut off by hand. <code>cc -Wall</code> warns <em>"comparison … is always true"</em>.</li>
<li><strong>The four conversion specifiers</strong> — <code>%c</code> the character itself · <code>%d</code> decimal · <code>%o</code> octal · <code>%X</code> uppercase hexadecimal. Same value, four notations — an echo of slide 5's "data versus information": the bits are identical, the reading differs.</li>
<li><strong>The program</strong>:
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    int code;
    for (code = 0; code &lt; 256; code++)
        printf("%c\\t%d\\t%o\\t%X\\n", code, code, code, code);
    return 0;
}</code></pre></li>
<li><strong>What it really prints (verified for codes 65..69)</strong>:
<table>
<tr><th>%c</th><th>%d</th><th>%o</th><th>%X</th></tr>
<tr><td>A</td><td>65</td><td>101</td><td>41</td></tr>
<tr><td>B</td><td>66</td><td>102</td><td>42</td></tr>
<tr><td>C</td><td>67</td><td>103</td><td>43</td></tr>
<tr><td>D</td><td>68</td><td>104</td><td>44</td></tr>
<tr><td>E</td><td>69</td><td>105</td><td>45</td></tr>
</table>
Note 65 in octal is 101, which is <em>not</em> "one hundred and one" — a favourite exam trick.</li>
<li><strong>Codes 0..31 are control characters</strong> — <code>%c</code> of code 7 rings the terminal bell, code 9 is a tab, code 10 is the newline that Exercise 2 on slide 34 uses as its ENTER. Do not be surprised when the first 32 rows look ragged; that is correct behaviour, not a bug.</li>
<li><strong>Codes 128..255 are not "ASCII"</strong> — strict ASCII is 0..127. What you see above 127 depends on the terminal's encoding, so two machines can print different glyphs for the same number. If the exercise asks for ASCII only, stop the condition at <code>code &lt; 128</code>.</li>
</ul>
<p class="meo">💡 The loop header <code>for (code = 0; code &lt; 256; code++)</code> is the "n iterations" pattern: start at 0, use <code>&lt;</code>, and the count of repetitions is exactly the number written in the condition — 256 rows, no arithmetic needed.</p>`,
        `<p class="y-chinh">🎯 Practice 3: in toàn bộ bảng mã ASCII bằng vòng <code>for</code> — mã từ 0 đến 255, mỗi mã hiện ở bốn định dạng: <code>%c</code>, <code>%d</code>, <code>%o</code>, <code>%X</code>.</p>
<ul>
<li><strong>Phân tích, nguyên văn trên slide</strong> — ASCII code: 0 → 255 · Khởi tạo: <code>int code = 0</code> · Điều kiện: <code>code &lt; 256</code> · Việc làm: in mã theo 4 định dạng (%c, %d, %o, %X) và <code>code = code + 1</code>.</li>
<li><strong>Vì sao kiểu phải là <code>int</code>, không phải <code>char</code></strong> — đây mới là điểm giấu kín của bài tập. Một <code>unsigned char</code> chỉ chứa 0..255, nên <code>code &lt; 256</code> <em>luôn luôn đúng</em>: bộ đếm quay vòng 255 → 0 và vòng lặp không bao giờ dừng. Đo thật: dùng <code>unsigned char</code> thì sau 1000 bước vòng lặp vẫn chạy, phải chặn bằng tay. <code>cc -Wall</code> có cảnh báo <em>"comparison … is always true"</em>.</li>
<li><strong>Bốn ký hiệu định dạng</strong> — <code>%c</code> chính ký tự · <code>%d</code> hệ mười · <code>%o</code> hệ tám · <code>%X</code> hệ mười sáu chữ hoa. Cùng một giá trị, bốn cách viết — đúng là tiếng vọng của slide 5 "dữ liệu với thông tin": các bit y hệt nhau, chỉ cách đọc khác.</li>
<li><strong>Chương trình</strong>:
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    int code;
    for (code = 0; code &lt; 256; code++)
        printf("%c\\t%d\\t%o\\t%X\\n", code, code, code, code);
    return 0;
}</code></pre></li>
<li><strong>Nó in ra thật cái gì (đã kiểm với mã 65..69)</strong>:
<table>
<tr><th>%c</th><th>%d</th><th>%o</th><th>%X</th></tr>
<tr><td>A</td><td>65</td><td>101</td><td>41</td></tr>
<tr><td>B</td><td>66</td><td>102</td><td>42</td></tr>
<tr><td>C</td><td>67</td><td>103</td><td>43</td></tr>
<tr><td>D</td><td>68</td><td>104</td><td>44</td></tr>
<tr><td>E</td><td>69</td><td>105</td><td>45</td></tr>
</table>
Chú ý 65 ở hệ tám là 101, <em>không phải</em> "một trăm lẻ một" — một trò rất hay gặp trong đề.</li>
<li><strong>Mã 0..31 là ký tự điều khiển</strong> — <code>%c</code> của mã 7 làm máy kêu bíp, mã 9 là dấu tab, mã 10 là dấu xuống dòng mà Exercise 2 ở slide 34 dùng làm phím ENTER. Đừng ngạc nhiên khi 32 dòng đầu trông lộn xộn; đó là hành vi đúng, không phải lỗi.</li>
<li><strong>Mã 128..255 không còn là "ASCII"</strong> — ASCII chuẩn chỉ có 0..127. Những gì hiện ra trên 127 phụ thuộc bảng mã của cửa sổ dòng lệnh, nên hai máy có thể in ra hai ký tự khác nhau cho cùng một số. Nếu đề chỉ yêu cầu ASCII, hãy dừng điều kiện ở <code>code &lt; 128</code>.</li>
</ul>
<p class="meo">💡 Dòng <code>for (code = 0; code &lt; 256; code++)</code> chính là khuôn "lặp n lần": bắt đầu từ 0, dùng <code>&lt;</code>, và số lượt lặp đúng bằng con số viết trong điều kiện — 256 dòng, không phải tính toán gì.</p>`],

      [31, 'Iteration — while / do … while statements',
        `<p class="y-chinh">🎯 Two more loop keywords, and one difference that matters: <code>while</code> tests <strong>before</strong> the body, <code>do … while</code> tests <strong>after</strong> — so <code>do…while</code> always runs <strong>at least once</strong>.</p>
<ul>
<li><strong>Syntax side by side</strong>:
<pre><code>while (condition) {          do {
    statements;                  statements;
}                            } while (condition);</code></pre>
Note the semicolon after <code>while (condition)</code> in the <code>do</code> form — it is required there, and forbidden in the plain <code>while</code> form. That asymmetry catches everybody once.</li>
<li><strong>Zero versus one, measured</strong> — with n = 0: <code>i = 1; while (i &lt;= n) { print; i++; }</code> printed nothing (0 repetitions); <code>i = 1; do { print; i++; } while (i &lt;= n);</code> printed <code>1</code> (1 repetition). Same condition, same data, different output.</li>
<li><strong>When <code>do…while</code> is the right choice</strong> — (a) a menu: you must show it once before asking whether to show it again; (b) re-reading invalid input: you must read once before knowing it is invalid; (c) any "repeat until" phrasing in the requirement.</li>
<li><strong>Menu pattern — the canonical <code>do…while</code></strong>:
<pre><code>int choice;
do {
    printf("1. Add  2. List  0. Quit\\nChoice: ");
    scanf("%d", &amp;choice);
    /* handle choice here */
} while (choice != 0);</code></pre></li>
<li><strong>Input validation pattern</strong>:
<pre><code>int age;
do {
    printf("Age (1..120): ");
    scanf("%d", &amp;age);
} while (age &lt; 1 || age &gt; 120);   /* keeps asking until valid */</code></pre></li>
<li><strong>Converting between the three keywords</strong> — <code>for (A; B; C) D;</code> is exactly <code>A; while (B) { D; C; }</code>. That single identity lets you rewrite any <code>for</code> as a <code>while</code> in an exam without thinking, and it explains why slide 28's empty-header forms exist.</li>
<li><strong>Which one to pick, in one line</strong> — known repetition count → <code>for</code>; unknown count, may be zero → <code>while</code>; unknown count, at least one → <code>do…while</code>. Picking wrongly is not a compile error, it is a <em>logic</em> error, and those are the expensive kind.</li>
</ul>
<p class="pitfall">⚠️ In a <code>while</code> loop the step that makes progress lives inside the body, where it is easy to forget. <code>while (i &lt; 10) printf("%d", i);</code> compiles, runs, and prints <code>0</code> forever. In a <code>for</code> the step sits in the header, which is precisely why <code>for</code> is safer for counting.</p>`,
        `<p class="y-chinh">🎯 Thêm hai từ khoá lặp, và một khác biệt có ý nghĩa: <code>while</code> kiểm tra <strong>trước</strong> thân, <code>do … while</code> kiểm tra <strong>sau</strong> — nên <code>do…while</code> luôn chạy <strong>ít nhất một lần</strong>.</p>
<ul>
<li><strong>Cú pháp đặt cạnh nhau</strong>:
<pre><code>while (điều kiện) {          do {
    các câu lệnh;                các câu lệnh;
}                            } while (điều kiện);</code></pre>
Chú ý dấu chấm phẩy sau <code>while (điều kiện)</code> ở dạng <code>do</code> — ở đó là bắt buộc, còn ở dạng <code>while</code> trơn thì lại cấm. Chỗ bất đối xứng này ai cũng vấp một lần.</li>
<li><strong>Không lần nào so với một lần, đo thật</strong> — với n = 0: <code>i = 1; while (i &lt;= n) { in; i++; }</code> không in gì (0 lượt); <code>i = 1; do { in; i++; } while (i &lt;= n);</code> in ra <code>1</code> (1 lượt). Cùng điều kiện, cùng dữ liệu, khác kết quả.</li>
<li><strong>Khi nào <code>do…while</code> là lựa chọn đúng</strong> — (a) menu: phải hiện một lần rồi mới hỏi có hiện tiếp không; (b) nhập lại dữ liệu sai: phải đọc một lần mới biết là sai; (c) mọi yêu cầu có chữ "lặp cho tới khi".</li>
<li><strong>Khuôn menu — dạng kinh điển của <code>do…while</code></strong>:
<pre><code>int chon;
do {
    printf("1. Them  2. Liet ke  0. Thoat\\nChon: ");
    scanf("%d", &amp;chon);
    /* xử lý lựa chọn ở đây */
} while (chon != 0);</code></pre></li>
<li><strong>Khuôn kiểm tra dữ liệu vào</strong>:
<pre><code>int tuoi;
do {
    printf("Tuoi (1..120): ");
    scanf("%d", &amp;tuoi);
} while (tuoi &lt; 1 || tuoi &gt; 120);   /* hỏi lại cho tới khi hợp lệ */</code></pre></li>
<li><strong>Chuyển đổi giữa ba từ khoá</strong> — <code>for (A; B; C) D;</code> đúng bằng <code>A; while (B) { D; C; }</code>. Chỉ một đẳng thức đó đủ để bạn viết lại mọi <code>for</code> thành <code>while</code> trong phòng thi mà không cần nghĩ, và nó giải thích vì sao các dạng bỏ trống ở slide 28 lại tồn tại.</li>
<li><strong>Chọn cái nào, gói trong một dòng</strong> — biết trước số lượt → <code>for</code>; không biết số lượt, có thể không lần nào → <code>while</code>; không biết số lượt, nhưng ít nhất một lần → <code>do…while</code>. Chọn sai không phải lỗi biên dịch, mà là lỗi <em>logic</em> — loại đắt tiền.</li>
</ul>
<p class="pitfall">⚠️ Trong vòng <code>while</code>, bước tạo tiến triển nằm trong thân, chỗ rất dễ quên. <code>while (i &lt; 10) printf("%d", i);</code> biên dịch được, chạy được, và in <code>0</code> mãi mãi. Trong <code>for</code> thì bước đó nằm ngay trên đầu, và đó đúng là lý do <code>for</code> an toàn hơn khi đếm.</p>`],

      [32, 'Iteration — while / do … while: Practice 4 (ASCII table)',
        `<p class="y-chinh">🎯 Practice 4 is Practice 3 again, word for word — the same ASCII table, the same analysis — but now you must write it with <code>while</code> and with <code>do … while</code>. The point is that the three parts do not disappear; they just move.</p>
<ul>
<li><strong>Same analysis as slide 30</strong> — ASCII code: 0 → 255 · Initialize: <code>int code = 0</code> · Condition: <code>code &lt; 256</code> · Task: print the code in 4 formats, then <code>code = code + 1</code>. The lecturer repeats the slide deliberately: identical problem, different keyword.</li>
<li><strong>The <code>while</code> version — the step moves into the body</strong>:
<pre><code>int code = 0;                         /* init block */
while (code &lt; 256) {                  /* condition  */
    printf("%c\\t%d\\t%o\\t%X\\n", code, code, code, code);
    code = code + 1;                  /* &lt;-- the step, now inside */
}</code></pre></li>
<li><strong>The <code>do … while</code> version — the test moves to the bottom</strong>:
<pre><code>int code = 0;
do {
    printf("%c\\t%d\\t%o\\t%X\\n", code, code, code, code);
    code = code + 1;
} while (code &lt; 256);</code></pre></li>
<li><strong>All three print exactly the same 256 lines</strong> — verified. For this problem the choice is pure style, because 0 &lt; 256 is true at the start, so "at least once" costs nothing.</li>
<li><strong>Where they would stop agreeing</strong> — change the upper bound to a variable <code>limit</code> read from the user. If the user types 0, the <code>for</code> and <code>while</code> versions print nothing, while the <code>do…while</code> version still prints row 0. That is slide 31's difference, made visible by one input value.</li>
<li><strong>The classic failure of the <code>while</code> version</strong> — deleting or misplacing <code>code = code + 1;</code>. The program then prints code 0 forever. With <code>for</code>, forgetting the step is much harder because the header looks incomplete. This is the strongest practical argument for using <code>for</code> whenever you are counting.</li>
<li><strong>How to answer this in an exam</strong> — write the three parts as comments first (<code>/* init */ /* condition */ /* step */</code>), then place them according to the keyword. You will never lose the step again.</li>
</ul>
<p class="dap-an">✅ Đáp án: cả ba bản (for / while / do…while) in ra 256 dòng giống hệt nhau; đã kiểm bằng cách chạy đoạn 65..69 và so từng cột: A 65 101 41 · B 66 102 42 · C 67 103 43 · D 68 104 44 · E 69 105 45.</p>`,
        `<p class="y-chinh">🎯 Practice 4 là Practice 3 lặp lại y nguyên từng chữ — cùng bảng ASCII, cùng phần phân tích — nhưng giờ phải viết bằng <code>while</code> và bằng <code>do … while</code>. Ý ở đây là ba phần không biến mất; chúng chỉ đổi chỗ.</p>
<ul>
<li><strong>Phân tích y hệt slide 30</strong> — ASCII code: 0 → 255 · Khởi tạo: <code>int code = 0</code> · Điều kiện: <code>code &lt; 256</code> · Việc làm: in mã ở 4 định dạng, rồi <code>code = code + 1</code>. Giảng viên lặp lại slide có chủ ý: bài toán giống hệt, từ khoá khác.</li>
<li><strong>Bản <code>while</code> — bước nhảy chui vào trong thân</strong>:
<pre><code>int code = 0;                         /* khối khởi tạo */
while (code &lt; 256) {                  /* điều kiện     */
    printf("%c\\t%d\\t%o\\t%X\\n", code, code, code, code);
    code = code + 1;                  /* &lt;-- bước nhảy, giờ nằm trong */
}</code></pre></li>
<li><strong>Bản <code>do … while</code> — phép kiểm tra tụt xuống dưới cùng</strong>:
<pre><code>int code = 0;
do {
    printf("%c\\t%d\\t%o\\t%X\\n", code, code, code, code);
    code = code + 1;
} while (code &lt; 256);</code></pre></li>
<li><strong>Cả ba in ra đúng 256 dòng giống hệt nhau</strong> — đã kiểm. Với bài này việc chọn từ khoá thuần là văn phong, vì 0 &lt; 256 đúng ngay từ đầu nên "ít nhất một lần" không tốn gì.</li>
<li><strong>Chỗ chúng sẽ hết giống nhau</strong> — đổi cận trên thành một biến <code>limit</code> đọc từ người dùng. Nếu người dùng gõ 0, bản <code>for</code> và <code>while</code> không in gì, còn bản <code>do…while</code> vẫn in dòng số 0. Đó chính là khác biệt của slide 31, được một giá trị đầu vào làm lộ ra.</li>
<li><strong>Kiểu hỏng kinh điển của bản <code>while</code></strong> — xoá mất hoặc đặt sai chỗ dòng <code>code = code + 1;</code>. Chương trình khi đó in mã 0 mãi mãi. Với <code>for</code>, quên bước nhảy khó hơn nhiều vì dòng đầu trông sẽ thiếu hẳn một phần. Đây là lý lẽ thực dụng mạnh nhất để dùng <code>for</code> mỗi khi bạn đang đếm.</li>
<li><strong>Cách trả lời câu này trong phòng thi</strong> — viết ba phần ra dạng chú thích trước (<code>/* khởi tạo */ /* điều kiện */ /* bước */</code>), rồi mới đặt chúng vào đúng chỗ theo từ khoá. Bạn sẽ không bao giờ đánh rơi bước nhảy nữa.</li>
</ul>
<p class="dap-an">✅ Đáp án: cả ba bản (for / while / do…while) in ra 256 dòng giống hệt nhau; đã kiểm bằng cách chạy đoạn 65..69 và so từng cột: A 65 101 41 · B 66 102 42 · C 67 103 43 · D 68 104 44 · E 69 105 45.</p>`],

      [33, 'Iteration — Exercise 1',
        `<p class="y-chinh">🎯 Exercise 1: "print the sum of integers inputted by user. The input will terminate if user enters the value 0." The slide gives the algorithm; here it is implemented, run, and traced.</p>
<ul>
<li><strong>Nouns, from the slide</strong> — inputted integer → <code>int x</code> · sum of integers → <code>int sum</code>. Two variables, no more. Naming follows slide 43: nouns for data.</li>
<li><strong>Algorithm, verbatim from the slide</strong> — Begin · <code>sum = 0</code> · <code>do { accept x; sum += x; } while (x != 0);</code> · print out sum · End. Note the choice of <code>do…while</code>: you must read at least one number before you can know whether it is the terminator.</li>
<li><strong>Full program</strong>:
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    int x, sum = 0;
    do {
        printf("Enter an integer (0 to stop): ");
        scanf("%d", &amp;x);
        sum += x;
    } while (x != 0);
    printf("Sum = %d\\n", sum);
    return 0;
}</code></pre></li>
<li><strong>Why <code>sum += x;</code> before the test is safe</strong> — the terminator is 0, and adding 0 changes nothing. The algorithm is therefore allowed to be sloppy on purpose. Change the requirement to a <em>product</em> and the same shape becomes a bug: every run would return 0.</li>
<li><strong>Trace table, data set 1: 10, 20, 30, 0</strong>:
<table>
<tr><th>Lượt</th><th>x đọc vào</th><th>sum += x</th><th>x != 0 ?</th></tr>
<tr><td>khởi tạo</td><td>—</td><td>sum = 0</td><td>—</td></tr>
<tr><td>1</td><td>10</td><td>0 + 10 = 10</td><td>đúng → lặp tiếp</td></tr>
<tr><td>2</td><td>20</td><td>10 + 20 = 30</td><td>đúng → lặp tiếp</td></tr>
<tr><td>3</td><td>30</td><td>30 + 30 = 60</td><td>đúng → lặp tiếp</td></tr>
<tr><td>4</td><td>0</td><td>60 + 0 = 60</td><td><strong>sai → thoát</strong></td></tr>
</table>
Output measured: <code>Sum = 60</code>.</li>
<li><strong>Trace table, data set 2: 7, -3, 0</strong>:
<table>
<tr><th>Lượt</th><th>x</th><th>sum</th><th>x != 0 ?</th></tr>
<tr><td>khởi tạo</td><td>—</td><td>0</td><td>—</td></tr>
<tr><td>1</td><td>7</td><td>7</td><td>đúng</td></tr>
<tr><td>2</td><td>-3</td><td>4</td><td>đúng</td></tr>
<tr><td>3</td><td>0</td><td>4</td><td><strong>sai → thoát</strong></td></tr>
</table>
Output measured: <code>Sum = 4</code>. Negative inputs are accepted — the requirement says "integers", not "positive integers".</li>
<li><strong>Trace table, data set 3 (the edge case): 0 straight away</strong> — one repetition runs, x = 0, sum stays 0, the test fails, output measured: <code>Sum = 0</code>. A <code>while</code> version would print 0 as well here, but only because <code>sum</code> was initialised; with <code>while (x != 0)</code> and no initial read, <code>x</code> would be used uninitialised — undefined behaviour.</li>
</ul>
<p class="dap-an">✅ Đáp án: 10 20 30 0 → <strong>Sum = 60</strong> · 7 -3 0 → <strong>Sum = 4</strong> · 0 → <strong>Sum = 0</strong>. Cả ba đều đã biên dịch bằng <code>cc -Wall</code> và chạy thật với dữ liệu đưa qua đường ống.</p>
<p class="pitfall">⚠️ If the user types a letter instead of a number, <code>scanf("%d", &amp;x)</code> returns 0, leaves <code>x</code> untouched and leaves the letter in the input buffer — the loop then spins forever on the same bad character. The professional fix is to test the return value: <code>if (scanf("%d", &amp;x) != 1) break;</code>.</p>`,
        `<p class="y-chinh">🎯 Exercise 1: "in ra tổng các số nguyên người dùng nhập. Việc nhập kết thúc khi người dùng gõ 0." Slide cho sẵn giải thuật; ở đây nó được hiện thực, chạy thật và lập bảng vết.</p>
<ul>
<li><strong>Danh từ, lấy từ slide</strong> — số nguyên nhập vào → <code>int x</code> · tổng các số → <code>int sum</code>. Hai biến, không hơn. Cách đặt tên theo slide 43: dữ liệu thì dùng danh từ.</li>
<li><strong>Giải thuật, nguyên văn trên slide</strong> — Begin · <code>sum = 0</code> · <code>do { accept x; sum += x; } while (x != 0);</code> · in sum · End. Chú ý lựa chọn <code>do…while</code>: phải đọc ít nhất một số thì mới biết nó có phải số kết thúc hay không.</li>
<li><strong>Chương trình đầy đủ</strong>:
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    int x, sum = 0;
    do {
        printf("Nhap so nguyen (0 de dung): ");
        scanf("%d", &amp;x);
        sum += x;
    } while (x != 0);
    printf("Tong = %d\\n", sum);
    return 0;
}</code></pre></li>
<li><strong>Vì sao đặt <code>sum += x;</code> trước phép kiểm tra vẫn an toàn</strong> — số kết thúc là 0, mà cộng 0 thì không đổi gì. Giải thuật vì thế được phép "cẩu thả" có chủ ý. Đổi yêu cầu thành <em>tích</em> thì đúng cái khuôn này trở thành lỗi: mọi lần chạy đều ra 0.</li>
<li><strong>Bảng vết, bộ dữ liệu 1: 10, 20, 30, 0</strong>:
<table>
<tr><th>Lượt</th><th>x đọc vào</th><th>sum += x</th><th>x != 0 ?</th></tr>
<tr><td>khởi tạo</td><td>—</td><td>sum = 0</td><td>—</td></tr>
<tr><td>1</td><td>10</td><td>0 + 10 = 10</td><td>đúng → lặp tiếp</td></tr>
<tr><td>2</td><td>20</td><td>10 + 20 = 30</td><td>đúng → lặp tiếp</td></tr>
<tr><td>3</td><td>30</td><td>30 + 30 = 60</td><td>đúng → lặp tiếp</td></tr>
<tr><td>4</td><td>0</td><td>60 + 0 = 60</td><td><strong>sai → thoát</strong></td></tr>
</table>
Kết quả đo được: <code>Tong = 60</code>.</li>
<li><strong>Bảng vết, bộ dữ liệu 2: 7, -3, 0</strong>:
<table>
<tr><th>Lượt</th><th>x</th><th>sum</th><th>x != 0 ?</th></tr>
<tr><td>khởi tạo</td><td>—</td><td>0</td><td>—</td></tr>
<tr><td>1</td><td>7</td><td>7</td><td>đúng</td></tr>
<tr><td>2</td><td>-3</td><td>4</td><td>đúng</td></tr>
<tr><td>3</td><td>0</td><td>4</td><td><strong>sai → thoát</strong></td></tr>
</table>
Kết quả đo được: <code>Tong = 4</code>. Số âm vẫn được nhận — đề nói "số nguyên", không nói "số nguyên dương".</li>
<li><strong>Bảng vết, bộ dữ liệu 3 (trường hợp biên): gõ 0 ngay</strong> — vòng lặp chạy đúng một lượt, x = 0, sum giữ nguyên 0, phép kiểm tra sai, kết quả đo được: <code>Tong = 0</code>. Bản viết bằng <code>while</code> ở đây cũng in 0, nhưng chỉ vì <code>sum</code> đã được khởi tạo; còn <code>while (x != 0)</code> mà chưa đọc lần nào thì <code>x</code> bị dùng khi chưa có giá trị — hành vi không xác định.</li>
</ul>
<p class="dap-an">✅ Đáp án: 10 20 30 0 → <strong>Tong = 60</strong> · 7 -3 0 → <strong>Tong = 4</strong> · 0 → <strong>Tong = 0</strong>. Cả ba đều đã biên dịch bằng <code>cc -Wall</code> và chạy thật với dữ liệu đưa qua đường ống.</p>
<p class="pitfall">⚠️ Nếu người dùng gõ một chữ cái thay vì số, <code>scanf("%d", &amp;x)</code> trả về 0, để nguyên <code>x</code> và bỏ chữ cái đó lại trong bộ đệm — vòng lặp sẽ quay vô tận trên đúng ký tự hỏng ấy. Cách vá chuyên nghiệp là kiểm giá trị trả về: <code>if (scanf("%d", &amp;x) != 1) break;</code>.</p>`],

      [34, 'Iteration — Exercise 2',
        `<p class="y-chinh">🎯 Exercise 2: read characters until ENTER (code 10), then print how many were digits, how many were letters, and how many were other keys. The slide chooses <code>while</code> on purpose — and that choice creates a counting error worth studying.</p>
<ul>
<li><strong>Nouns, from the slide</strong> — <code>char c</code> · <code>int noDigits</code> · <code>noLetters</code> · <code>noOthers</code> · <code>#define ENTER 10</code>. Reading one character is <code>c = getchar();</code>.</li>
<li><strong>Algorithm, verbatim from the slide</strong> — <code>noDigits = noLetters = noOthers = c = 0</code> · print "Enter a string:" · <code>while (c != ENTER) { accept c; if (c &gt;= '0' &amp;&amp; c &lt;= '9') noDigits++; else if ((c &gt;= 'a' &amp;&amp; c &lt;= 'z') || (c &gt;= 'A' &amp;&amp; c &lt;= 'Z')) noLetters++; else noOthers++; }</code> · print the three counters.</li>
<li><strong>The slide explains its own trick</strong> — "The while statement is intentionally used. So, c = 0 is assigned and the condition c != ENTER is evaluated to TRUE". Initialising <code>c = 0</code> is what lets a pre-test loop run its first repetition; it is a hand-made substitute for <code>do…while</code>.</li>
<li><strong>Full program, exactly as the slide specifies</strong>:
<pre><code>#include &lt;stdio.h&gt;
#define ENTER 10

int main(void) {
    char c = 0;
    int noDigits = 0, noLetters = 0, noOthers = 0;
    printf("Enter a string: ");
    while (c != ENTER) {
        c = getchar();
        if (c &gt;= '0' &amp;&amp; c &lt;= '9') noDigits++;
        else if ((c &gt;= 'a' &amp;&amp; c &lt;= 'z') || (c &gt;= 'A' &amp;&amp; c &lt;= 'Z')) noLetters++;
        else noOthers++;
    }
    printf("Digits = %d, Letters = %d, Others = %d\\n",
           noDigits, noLetters, noOthers);
    return 0;
}</code></pre></li>
<li><strong>Trace table for the slide's own input <code>abc1234fGH+-*/?</code> then ENTER</strong> — the branch taken, repetition by repetition:
<table>
<tr><th>Lượt</th><th>c</th><th>Nhánh</th><th>noDigits</th><th>noLetters</th><th>noOthers</th><th>c != 10 ?</th></tr>
<tr><td>1–3</td><td>a b c</td><td>letter</td><td>0</td><td>3</td><td>0</td><td>đúng</td></tr>
<tr><td>4–7</td><td>1 2 3 4</td><td>digit</td><td>4</td><td>3</td><td>0</td><td>đúng</td></tr>
<tr><td>8–10</td><td>f G H</td><td>letter</td><td>4</td><td>6</td><td>0</td><td>đúng</td></tr>
<tr><td>11–15</td><td>+ - * / ?</td><td>other</td><td>4</td><td>6</td><td>5</td><td>đúng</td></tr>
<tr><td>16</td><td>ENTER (10)</td><td><strong>other</strong></td><td>4</td><td>6</td><td><strong>6</strong></td><td><strong>sai → thoát</strong></td></tr>
</table></li>
<li><strong>What the program actually prints (measured, not assumed)</strong> — <code>Digits = 4, Letters = 6, Others = 6</strong></code>. Two more data sets confirm the pattern: <code>a1+</code> + ENTER → 1, 1, <strong>2</strong>; pressing ENTER alone → 0, 0, <strong>1</strong>.</li>
<li><strong>The slide's algorithm counts the ENTER key itself as an "other key"</strong> — because the classification runs <em>before</em> the condition is re-tested. Strictly, the user pressed five other keys (+ - * / ?), so the expected answer is 5 and the program reports 6. This is a real flaw in the slide, not a typo in this lesson; the slide is reproduced as it is. The minimal fix keeps the same structure:
<pre><code>while (c != ENTER) {
    c = getchar();
    if (c == ENTER) continue;        /* do not classify the terminator */
    if (c &gt;= '0' &amp;&amp; c &lt;= '9') noDigits++;
    else if ((c &gt;= 'a' &amp;&amp; c &lt;= 'z') || (c &gt;= 'A' &amp;&amp; c &lt;= 'Z')) noLetters++;
    else noOthers++;
}</code></pre>
Measured with the fix: <code>Digits = 4, Letters = 6, Others = 5</code>.</li>
</ul>
<p class="dap-an">✅ Đáp án: chạy ĐÚNG như slide viết, đầu vào <code>abc1234fGH+-*/?</code> + ENTER cho <strong>4 chữ số · 6 chữ cái · 6 phím khác</strong> (đã biên dịch và chạy thật). Con số "6 phím khác" bao gồm chính phím ENTER — slide đếm dư 1. Bản vá thêm một dòng <code>if (c == ENTER) continue;</code> cho <strong>4 · 6 · 5</strong>, là con số người dùng thật sự gõ. Ở đây <strong>không sửa slide</strong>, chỉ nêu rõ sai lệch.</p>
<p class="pitfall">⚠️ Two more traps in this exercise. (1) <code>getchar()</code> returns <code>int</code>, not <code>char</code> — storing it in a <code>char</code> loses the ability to detect <code>EOF</code> (-1), so a redirected input file that ends without ENTER loops forever. (2) The letter test must be written with parentheses around each range, as the slide does: dropping them lets <code>&amp;&amp;</code> bind tighter than <code>||</code> in the wrong place and silently miscounts.</p>`,
        `<p class="y-chinh">🎯 Exercise 2: đọc ký tự cho tới khi gặp ENTER (mã 10), rồi in ra có bao nhiêu chữ số, bao nhiêu chữ cái, bao nhiêu phím khác. Slide cố ý chọn <code>while</code> — và chính lựa chọn đó tạo ra một sai số đếm rất đáng học.</p>
<ul>
<li><strong>Danh từ, lấy từ slide</strong> — <code>char c</code> · <code>int noDigits</code> · <code>noLetters</code> · <code>noOthers</code> · <code>#define ENTER 10</code>. Đọc một ký tự là <code>c = getchar();</code>.</li>
<li><strong>Giải thuật, nguyên văn trên slide</strong> — <code>noDigits = noLetters = noOthers = c = 0</code> · in "Enter a string:" · <code>while (c != ENTER) { accept c; if (c &gt;= '0' &amp;&amp; c &lt;= '9') noDigits++; else if ((c &gt;= 'a' &amp;&amp; c &lt;= 'z') || (c &gt;= 'A' &amp;&amp; c &lt;= 'Z')) noLetters++; else noOthers++; }</code> · in ba bộ đếm.</li>
<li><strong>Slide tự giải thích mẹo của nó</strong> — "The while statement is intentionally used. So, c = 0 is assigned and the condition c != ENTER is evaluated to TRUE". Gán <code>c = 0</code> là cách để một vòng lặp kiểm-tra-trước chạy được lượt đầu tiên; đó là bản thay thế thủ công cho <code>do…while</code>.</li>
<li><strong>Chương trình đầy đủ, đúng như slide đặc tả</strong>:
<pre><code>#include &lt;stdio.h&gt;
#define ENTER 10

int main(void) {
    char c = 0;
    int noDigits = 0, noLetters = 0, noOthers = 0;
    printf("Nhap mot chuoi: ");
    while (c != ENTER) {
        c = getchar();
        if (c &gt;= '0' &amp;&amp; c &lt;= '9') noDigits++;
        else if ((c &gt;= 'a' &amp;&amp; c &lt;= 'z') || (c &gt;= 'A' &amp;&amp; c &lt;= 'Z')) noLetters++;
        else noOthers++;
    }
    printf("So chu so = %d, So chu cai = %d, So phim khac = %d\\n",
           noDigits, noLetters, noOthers);
    return 0;
}</code></pre></li>
<li><strong>Bảng vết với chính đầu vào của slide <code>abc1234fGH+-*/?</code> rồi ENTER</strong> — nhánh nào được chọn, theo từng lượt:
<table>
<tr><th>Lượt</th><th>c</th><th>Nhánh</th><th>noDigits</th><th>noLetters</th><th>noOthers</th><th>c != 10 ?</th></tr>
<tr><td>1–3</td><td>a b c</td><td>chữ cái</td><td>0</td><td>3</td><td>0</td><td>đúng</td></tr>
<tr><td>4–7</td><td>1 2 3 4</td><td>chữ số</td><td>4</td><td>3</td><td>0</td><td>đúng</td></tr>
<tr><td>8–10</td><td>f G H</td><td>chữ cái</td><td>4</td><td>6</td><td>0</td><td>đúng</td></tr>
<tr><td>11–15</td><td>+ - * / ?</td><td>khác</td><td>4</td><td>6</td><td>5</td><td>đúng</td></tr>
<tr><td>16</td><td>ENTER (10)</td><td><strong>khác</strong></td><td>4</td><td>6</td><td><strong>6</strong></td><td><strong>sai → thoát</strong></td></tr>
</table></li>
<li><strong>Chương trình in ra thật cái gì (đo, không phải đoán)</strong> — <code>So chu so = 4, So chu cai = 6, So phim khac = 6</code>. Hai bộ dữ liệu nữa xác nhận đúng quy luật: <code>a1+</code> + ENTER → 1, 1, <strong>2</strong>; bấm ENTER không gõ gì → 0, 0, <strong>1</strong>.</li>
<li><strong>Giải thuật của slide đếm luôn phím ENTER vào nhóm "phím khác"</strong> — vì việc phân loại chạy <em>trước</em> khi điều kiện được kiểm lại. Nói chặt chẽ thì người dùng bấm năm phím khác (+ - * / ?), nên đáp số mong đợi là 5 còn chương trình báo 6. Đây là một lỗi thật của slide, không phải lỗi gõ trong bài học này; slide được chép lại đúng nguyên trạng. Cách vá tối thiểu giữ nguyên cấu trúc:
<pre><code>while (c != ENTER) {
    c = getchar();
    if (c == ENTER) continue;        /* không phân loại ký tự kết thúc */
    if (c &gt;= '0' &amp;&amp; c &lt;= '9') noDigits++;
    else if ((c &gt;= 'a' &amp;&amp; c &lt;= 'z') || (c &gt;= 'A' &amp;&amp; c &lt;= 'Z')) noLetters++;
    else noOthers++;
}</code></pre>
Đo với bản vá: <code>4 chữ số, 6 chữ cái, 5 phím khác</code>.</li>
</ul>
<p class="dap-an">✅ Đáp án: chạy ĐÚNG như slide viết, đầu vào <code>abc1234fGH+-*/?</code> + ENTER cho <strong>4 chữ số · 6 chữ cái · 6 phím khác</strong> (đã biên dịch và chạy thật). Con số "6 phím khác" đã tính luôn chính phím ENTER — slide đếm dư 1. Bản vá thêm dòng <code>if (c == ENTER) continue;</code> cho <strong>4 · 6 · 5</strong>, đúng số phím người dùng gõ. Ở đây <strong>không sửa slide</strong>, chỉ nêu rõ chỗ lệch.</p>
<p class="pitfall">⚠️ Còn hai bẫy nữa trong bài này. (1) <code>getchar()</code> trả về <code>int</code>, không phải <code>char</code> — cất vào <code>char</code> là mất khả năng phát hiện <code>EOF</code> (-1), nên một tệp dữ liệu vào kết thúc mà không có ENTER sẽ làm vòng lặp quay mãi. (2) Phép thử chữ cái phải có ngoặc bao quanh từng khoảng đúng như slide viết: bỏ ngoặc đi thì <code>&amp;&amp;</code> ưu tiên cao hơn <code>||</code> ở sai chỗ và đếm sai một cách im lặng.</p>`],

      [35, 'Iteration — break / bypass a loop',
        `<p class="y-chinh">🎯 Two keywords that change the normal flow of a loop: <code>break</code> leaves the loop entirely, <code>continue</code> skips the rest of the current repetition and goes on to the next one. The slide shows both producing the same printed line <code>0 1 2 3 4 5</code>.</p>
<ul>
<li><strong>What the slide shows</strong> — two small examples, labelled "Example: break" and "Example: continue", each with the output row <code>0 1 2 3 4 5</code>. The point of the pairing is that <em>identical output can come from two different mechanisms</em>, so you cannot tell them apart from the result alone.</li>
<li><strong>The canonical pair that produces exactly those two lines</strong> (compiled and run — both printed <code>0 1 2 3 4 5</code>):
<pre><code>int i;
for (i = 0; i &lt; 10; i++) { if (i == 6) break;    printf("%d ", i); }
for (i = 0; i &lt; 10; i++) { if (i &gt; 5)  continue; printf("%d ", i); }</code></pre></li>
<li><strong>The difference you cannot see in the output</strong> — the <code>break</code> version performs <strong>7</strong> repetitions and then stops for good; the <code>continue</code> version performs all <strong>10</strong> and simply prints nothing in the last four. Same paper, different amount of work.</li>
<li><strong><code>break</code> leaves exactly ONE loop</strong> — the innermost one containing it. In a nested loop, <code>break</code> in the inner loop returns you to the outer loop, it does not leave both:
<pre><code>for (i = 0; i &lt; 3; i++)
    for (j = 0; j &lt; 3; j++)
        if (j == 1) break;      /* leaves the j loop only; i keeps going */</code></pre>
This is the single most common misunderstanding about <code>break</code>, and it is exactly the problem that flags (slides 36–40) solve.</li>
<li><strong><code>break</code> also belongs to <code>switch</code></strong> — you already met it on slide 21, where a missing <code>break</code> makes execution fall through to the next case. Inside a <code>switch</code> nested in a loop, <code>break</code> leaves the <em>switch</em>, not the loop — another silent trap.</li>
<li><strong>Where <code>continue</code> jumps to, precisely</strong> — in a <code>for</code>, it jumps to the <em>step</em> part (<code>i++</code>), so counting continues normally. In a <code>while</code> or <code>do…while</code>, it jumps straight to the <em>condition</em>, skipping everything after it in the body — including your increment.</li>
<li><strong>That asymmetry causes real infinite loops</strong> — measured:
<pre><code>i = 0;
while (i &lt; 5) {
    if (i == 2) continue;   /* i++ below is skipped -&gt; stuck at 2 forever */
    printf("%d ", i);
    i++;
}</code></pre>
Running this printed <code>0 1</code> and then hung; it had to be cut off by a counter. The same body written as a <code>for</code> would have survived, because <code>i++</code> lives in the header.</li>
</ul>
<p class="pitfall">⚠️ Reconstruction note: the .pptx text layer preserved only the two output rows (<code>0 1 2 3 4 5</code> twice) and the two labels, not the code images. The pair above is the standard form that reproduces exactly those outputs — read the slide picture for the lecturer's own wording, but the behaviour described here was verified by compiling and running.</p>
<p class="meo">💡 Translation into plain words that never fails you: <code>break</code> = "stop the loop"; <code>continue</code> = "skip to the next round". If your sentence needs "and also stop the outer one", <code>break</code> is the wrong tool — use a flag.</p>`,
        `<p class="y-chinh">🎯 Hai từ khoá làm đổi dòng chảy bình thường của vòng lặp: <code>break</code> thoát hẳn khỏi vòng lặp, <code>continue</code> bỏ phần còn lại của lượt hiện tại và đi tiếp lượt sau. Slide cho thấy cả hai cùng in ra một dòng <code>0 1 2 3 4 5</code>.</p>
<ul>
<li><strong>Slide cho thấy cái gì</strong> — hai ví dụ nhỏ, ghi nhãn "Example: break" và "Example: continue", mỗi cái kèm dòng kết quả <code>0 1 2 3 4 5</code>. Ý của việc đặt cặp là <em>kết quả giống hệt nhau vẫn có thể đến từ hai cơ chế khác nhau</em>, nên nhìn kết quả không phân biệt được.</li>
<li><strong>Cặp chuẩn tạo ra đúng hai dòng đó</strong> (đã biên dịch và chạy — cả hai in <code>0 1 2 3 4 5</code>):
<pre><code>int i;
for (i = 0; i &lt; 10; i++) { if (i == 6) break;    printf("%d ", i); }
for (i = 0; i &lt; 10; i++) { if (i &gt; 5)  continue; printf("%d ", i); }</code></pre></li>
<li><strong>Khác biệt mà kết quả không cho thấy</strong> — bản <code>break</code> chạy <strong>7</strong> lượt rồi dừng hẳn; bản <code>continue</code> chạy đủ <strong>10</strong> lượt và chỉ đơn giản là bốn lượt cuối không in gì. Cùng một tờ giấy, khác nhau lượng công làm.</li>
<li><strong><code>break</code> chỉ thoát ĐÚNG MỘT vòng lặp</strong> — vòng gần nhất bao quanh nó. Trong vòng lặp lồng nhau, <code>break</code> ở vòng trong trả bạn về vòng ngoài, chứ không thoát cả hai:
<pre><code>for (i = 0; i &lt; 3; i++)
    for (j = 0; j &lt; 3; j++)
        if (j == 1) break;      /* chỉ thoát vòng j; vòng i vẫn chạy tiếp */</code></pre>
Đây là hiểu lầm phổ biến nhất về <code>break</code>, và cũng chính là bài toán mà biến cờ (slide 36–40) sinh ra để giải.</li>
<li><strong><code>break</code> còn thuộc về <code>switch</code></strong> — bạn đã gặp ở slide 21, nơi thiếu <code>break</code> thì lệnh rơi xuống case kế tiếp. Trong một <code>switch</code> nằm trong vòng lặp, <code>break</code> thoát khỏi <em>switch</em>, không thoát khỏi vòng lặp — thêm một cái bẫy im lặng.</li>
<li><strong><code>continue</code> nhảy chính xác tới đâu</strong> — trong <code>for</code>, nó nhảy tới phần <em>bước nhảy</em> (<code>i++</code>), nên việc đếm vẫn diễn ra bình thường. Trong <code>while</code> hay <code>do…while</code>, nó nhảy thẳng tới <em>điều kiện</em>, bỏ qua mọi thứ nằm sau nó trong thân — kể cả lệnh tăng biến đếm của bạn.</li>
<li><strong>Chỗ bất đối xứng đó gây ra vòng lặp vô hạn thật</strong> — đã đo:
<pre><code>i = 0;
while (i &lt; 5) {
    if (i == 2) continue;   /* i++ bên dưới bị bỏ qua -&gt; kẹt mãi ở 2 */
    printf("%d ", i);
    i++;
}</code></pre>
Chạy đoạn này in ra <code>0 1</code> rồi treo; phải chặn bằng một bộ đếm mới dừng được. Cùng thân đó viết bằng <code>for</code> thì vẫn sống, vì <code>i++</code> nằm trên dòng đầu.</li>
</ul>
<p class="pitfall">⚠️ Ghi chú về việc dựng lại: lớp chữ của file .pptx chỉ giữ được hai dòng kết quả (<code>0 1 2 3 4 5</code> hai lần) và hai nhãn, không giữ ảnh đoạn code. Cặp ở trên là dạng chuẩn tái tạo đúng hai kết quả đó — hãy nhìn ảnh slide để đọc đúng chữ giảng viên viết, còn phần hành vi mô tả ở đây thì đã được kiểm bằng biên dịch và chạy thật.</p>
<p class="meo">💡 Dịch ra lời thường, không bao giờ sai: <code>break</code> = "dừng vòng lặp"; <code>continue</code> = "bỏ qua, sang lượt sau". Nếu câu của bạn cần thêm "và dừng luôn vòng ngoài" thì <code>break</code> là công cụ sai — hãy dùng biến cờ.</p>`],

      [36, 'Iteration Constructs: Flags',
        `<p class="y-chinh">🎯 The principle behind the whole flags section: <strong>one entry, one exit</strong> is fundamental to structured programming — and <code>goto</code>, <code>continue</code> and <code>break</code> all violate it (except <code>break</code> inside a <code>switch</code>).</p>
<ul>
<li><strong>The slide, verbatim</strong> — "The one entry, one exit principle is fundamental to structured programming. C includes three keywords that allow jumps across statements: goto, continue, and break. Using any of these keywords, except for break in a switch construct, violates the one entry, one exit principle."</li>
<li><strong>What "one entry, one exit" means</strong> — slide 7 already defined it: a structured construct "has one entry point and one exit point". You enter a loop at the top and you leave it at the bottom, through the condition. Nothing else jumps in or out.</li>
<li><strong>Why it matters practically</strong> — if a block has exactly one way out, then whatever is true at that one exit is true for the whole block. You can reason about it, test it, and modify it locally. Add a second exit and every statement about the block needs the words "unless we broke out early".</li>
<li><strong>The exception, and why it is an exception</strong> — <code>break</code> in a <code>switch</code> is not a jump out of a loop; it is the punctuation that ends a case. Without it, the cases fall through, as slide 21 warns. So it is part of the construct, not an escape from it.</li>
<li><strong>Where the rule comes from</strong> — this is the classic "goto considered harmful" argument from structured programming: code with arbitrary jumps cannot be read top to bottom, so understanding it requires simulating it. Slide 50's walkthroughs become impossible to do on paper.</li>
<li><strong>How the rule shows up in PRF192's own style guide</strong> — slide 46 says plainly: "Avoid goto, continue, break except in switch". The flags technique on slides 37–40 is the recommended way to obey that rule without making the code ugly.</li>
<li><strong>The honest modern position</strong> — industrial C today does use an early <code>break</code> or an early <code>return</code> for guard clauses, because deeply nested <code>if</code>s are their own kind of unreadable. But you must first be able to write the flag version: the exam asks for it, and the discipline of naming the state is what makes the code clear either way.</li>
</ul>
<p class="meo">💡 One sentence to carry out of this slide: a jump is cheap to write and expensive to read. Every <code>break</code> you remove is one sentence you no longer need in the comment explaining what the loop does.</p>`,
        `<p class="y-chinh">🎯 Nguyên tắc nằm sau cả phần biến cờ: <strong>một lối vào, một lối ra</strong> là nền tảng của lập trình có cấu trúc — và <code>goto</code>, <code>continue</code>, <code>break</code> đều vi phạm nó (trừ <code>break</code> trong <code>switch</code>).</p>
<ul>
<li><strong>Nguyên văn trên slide</strong> — "The one entry, one exit principle is fundamental to structured programming. C includes three keywords that allow jumps across statements: goto, continue, and break. Using any of these keywords, except for break in a switch construct, violates the one entry, one exit principle."</li>
<li><strong>"Một lối vào, một lối ra" nghĩa là gì</strong> — slide 7 đã định nghĩa: một cấu trúc có tổ chức thì "has one entry point and one exit point". Bạn vào vòng lặp ở trên đỉnh và rời nó ở dưới đáy, qua điều kiện. Không có gì khác nhảy vào hay nhảy ra.</li>
<li><strong>Vì sao điều đó quan trọng trên thực tế</strong> — nếu một khối chỉ có đúng một lối ra, thì điều gì đúng tại lối ra ấy sẽ đúng cho cả khối. Bạn suy luận được, kiểm thử được, và sửa cục bộ được. Thêm một lối ra thứ hai là mọi phát biểu về khối đó đều phải kèm mệnh đề "trừ khi ta đã thoát sớm".</li>
<li><strong>Ngoại lệ, và vì sao nó là ngoại lệ</strong> — <code>break</code> trong <code>switch</code> không phải cú nhảy ra khỏi vòng lặp; nó là dấu chấm câu kết thúc một nhánh case. Thiếu nó thì các case rơi xuống nhau, đúng như slide 21 cảnh báo. Vậy nó là một phần của cấu trúc, không phải lối trốn khỏi cấu trúc.</li>
<li><strong>Quy tắc này từ đâu ra</strong> — đây là lập luận kinh điển "goto considered harmful" của lập trình có cấu trúc: mã có các cú nhảy tuỳ tiện thì không đọc từ trên xuống được, muốn hiểu phải mô phỏng lại. Bài "walkthrough" của slide 50 sẽ thành bất khả thi khi làm trên giấy.</li>
<li><strong>Quy tắc này hiện ra trong chính bộ quy ước văn phong của PRF192</strong> — slide 46 viết thẳng: "Avoid goto, continue, break except in switch". Kỹ thuật biến cờ ở slide 37–40 là cách được khuyến nghị để tuân thủ mà không làm code xấu đi.</li>
<li><strong>Nói cho thật về quan điểm hiện đại</strong> — C công nghiệp ngày nay vẫn dùng <code>break</code> hoặc <code>return</code> sớm làm mệnh đề canh, vì <code>if</code> lồng quá sâu cũng là một kiểu khó đọc khác. Nhưng bạn phải viết được bản dùng cờ trước: đề thi hỏi đúng cái đó, và cái kỷ luật đặt tên cho trạng thái mới là thứ làm code sáng ra, dù bạn chọn lối nào.</li>
</ul>
<p class="meo">💡 Một câu mang theo từ slide này: cú nhảy rẻ khi viết và đắt khi đọc. Mỗi lệnh <code>break</code> bạn bỏ được là một câu bạn không còn phải viết trong chú thích giải thích vòng lặp làm gì.</p>`],

      [37, 'Iteration Constructs: Flags (cont.)',
        `<p class="y-chinh">🎯 The definition you must be able to write down: <strong>a flag is a variable that keeps track of a true or false state</strong>, and <em>flagging</em> is the technique of using one to avoid jumps.</p>
<ul>
<li><strong>What the slide advocates, verbatim</strong> — "The use of whitespace to identify the logical structure of the code · The abolition of all goto statements · The abolition of all continue statements · The abolition of all break statements, except with switch". Then: "A technique for avoiding jumps is called flagging. A flag is a variable that keeps track of a true or false state."</li>
<li><strong>C has no <code>bool</code> in C89</strong> — a flag is just an <code>int</code> holding 0 (false) or 1 (true). Since C99 you may write <code>#include &lt;stdbool.h&gt;</code> and use <code>bool found = false;</code>, which reads better and means exactly the same thing.</li>
<li><strong>Naming rule — state the flag as a POSITIVE assertion</strong> — <code>found</code>, <code>isValid</code>, <code>done</code>, <code>isPrime</code>. Then <code>if (found)</code> reads as English. A negative name produces double negatives: <code>if (!notFound)</code> is correct but nobody parses it on the first read.</li>
<li><strong>Naming rule — use a noun phrase or an "is/has" question</strong> — <code>isValid</code> asks a yes/no question, so a yes/no variable is the right answer to it. <code>valid</code>, <code>flag</code>, <code>ok</code>, <code>t</code> are all worse; <code>flag</code> is the worst because it names the mechanism instead of the meaning.</li>
<li><strong>The three-step pattern, always the same</strong> — (1) initialise the flag to the answer you would give if nothing happened: <code>int found = 0;</code> (2) set it inside the loop when the event occurs: <code>found = 1;</code> (3) put it in the loop condition and/or test it after the loop: <code>while (i &lt; n &amp;&amp; !found)</code>, then <code>if (found) …</code>.</li>
<li><strong>Why a flag beats <code>break</code> in nested loops</strong> — <code>break</code> exits only the innermost loop (slide 35), so escaping two levels needs two <code>break</code>s and an extra test. One flag in both conditions does it once:
<pre><code>int found = 0;
for (i = 0; i &lt; rows &amp;&amp; !found; i++)
    for (j = 0; j &lt; cols &amp;&amp; !found; j++)
        if (a[i][j] == key) found = 1;</code></pre></li>
<li><strong>The cost, stated honestly</strong> — the flag version keeps evaluating the condition, so it is a few tests slower and one variable longer. In exchange, the loop still has one exit, and the answer ("was it found?") is stored in a variable you can print, return, or test later — the <code>break</code> version leaves that knowledge only in the value of <code>i</code>.</li>
</ul>
<p class="meo">💡 Read your own flag out loud in a sentence. "While i is less than n <em>and not found</em>" is a sentence. "While i is less than n and not the flag" is not — and that is your signal to rename the variable.</p>`,
        `<p class="y-chinh">🎯 Định nghĩa bạn phải viết ra được: <strong>biến cờ là một biến theo dõi một trạng thái đúng/sai</strong>, và <em>flagging</em> là kỹ thuật dùng nó để tránh các cú nhảy.</p>
<ul>
<li><strong>Slide khuyến nghị gì, nguyên văn</strong> — "The use of whitespace to identify the logical structure of the code · The abolition of all goto statements · The abolition of all continue statements · The abolition of all break statements, except with switch". Rồi: "A technique for avoiding jumps is called flagging. A flag is a variable that keeps track of a true or false state."</li>
<li><strong>C89 không có kiểu <code>bool</code></strong> — biến cờ chỉ là một <code>int</code> mang giá trị 0 (sai) hoặc 1 (đúng). Từ C99 bạn có thể viết <code>#include &lt;stdbool.h&gt;</code> rồi dùng <code>bool found = false;</code>, đọc dễ hơn và ý nghĩa y hệt.</li>
<li><strong>Quy tắc đặt tên — phát biểu cờ ở dạng KHẲNG ĐỊNH</strong> — <code>found</code>, <code>isValid</code>, <code>done</code>, <code>isPrime</code>. Khi đó <code>if (found)</code> đọc lên thành câu tiếng Anh xuôi tai. Tên phủ định đẻ ra phủ định kép: <code>if (!notFound)</code> vẫn đúng nhưng không ai đọc hiểu ngay lần đầu.</li>
<li><strong>Quy tắc đặt tên — dùng cụm danh từ hoặc câu hỏi "is/has"</strong> — <code>isValid</code> là một câu hỏi có/không, nên một biến có/không là câu trả lời đúng cho nó. <code>valid</code>, <code>flag</code>, <code>ok</code>, <code>t</code> đều tệ hơn; <code>flag</code> tệ nhất vì nó gọi tên cơ chế thay vì gọi tên ý nghĩa.</li>
<li><strong>Khuôn ba bước, lúc nào cũng vậy</strong> — (1) khởi tạo cờ bằng câu trả lời nếu không có gì xảy ra: <code>int found = 0;</code> (2) đặt cờ bên trong vòng lặp khi sự kiện xảy ra: <code>found = 1;</code> (3) đưa cờ vào điều kiện lặp và/hoặc kiểm nó sau vòng lặp: <code>while (i &lt; n &amp;&amp; !found)</code>, rồi <code>if (found) …</code>.</li>
<li><strong>Vì sao cờ hơn <code>break</code> trong vòng lặp lồng nhau</strong> — <code>break</code> chỉ thoát vòng trong cùng (slide 35), nên thoát hai tầng thì cần hai lệnh <code>break</code> cộng một phép kiểm phụ. Một biến cờ đặt ở cả hai điều kiện thì làm xong trong một lần:
<pre><code>int found = 0;
for (i = 0; i &lt; rows &amp;&amp; !found; i++)
    for (j = 0; j &lt; cols &amp;&amp; !found; j++)
        if (a[i][j] == key) found = 1;</code></pre></li>
<li><strong>Cái giá, nói cho sòng phẳng</strong> — bản dùng cờ vẫn phải tính lại điều kiện, nên chậm hơn vài phép so sánh và dài hơn một biến. Đổi lại, vòng lặp vẫn chỉ có một lối ra, và câu trả lời ("có tìm thấy không?") được cất trong một biến mà bạn in ra, trả về hay kiểm lại sau đều được — bản dùng <code>break</code> để lại hiểu biết đó chỉ trong giá trị của <code>i</code>.</li>
</ul>
<p class="meo">💡 Hãy đọc to biến cờ của chính bạn thành một câu. "Trong khi i còn nhỏ hơn n <em>và chưa tìm thấy</em>" là một câu. "Trong khi i còn nhỏ hơn n và không phải cờ" thì không — và đó là tín hiệu bạn phải đổi tên biến.</p>`],

      [38, 'Iteration Constructs: Flags (cont.) — use if instead of continue',
        `<p class="y-chinh">🎯 The first and easiest transformation: every <code>continue</code> can be removed by inverting its condition and wrapping the rest of the body in an <code>if</code>. The slide labels this "Use if instead of continue".</p>
<ul>
<li><strong>The mechanical rule</strong> — <code>if (C) continue; REST;</code> becomes <code>if (!C) { REST; }</code>. Nothing else changes. No new variable is needed, which is why this is the transformation you should always try first.</li>
<li><strong>Worked example — sum the odd numbers from 1 to 10</strong>. Version with <code>continue</code>:
<pre><code>int i, s = 0;
for (i = 1; i &lt;= 10; i++) {
    if (i % 2 == 0) continue;     /* skip the even ones */
    s += i;
}</code></pre>
Version with <code>if</code>:
<pre><code>int i, s = 0;
for (i = 1; i &lt;= 10; i++) {
    if (i % 2 != 0) s += i;       /* keep the odd ones */
}</code></pre>
Both compiled and run: both print <strong>25</strong> (1+3+5+7+9).</li>
<li><strong>Read the two versions as sentences</strong> — the first says "if it is even, skip"; the second says "if it is odd, add it". The second is a direct statement of <em>what the loop does</em>; the first is a statement about <em>what it does not do</em>. Positive statements are easier to check against a requirement.</li>
<li><strong>Why this is not only style</strong> — recall slide 35: in a <code>while</code> loop, <code>continue</code> jumps over the increment and hangs the program. Removing the <code>continue</code> removes that entire class of bug at the source.</li>
<li><strong>When the <code>if</code> version gets uglier</strong> — if the loop body is 40 lines and the skip test is at the top, wrapping everything in an <code>if</code> adds a level of indentation to 40 lines. That is the real argument for guard clauses. The professional answer is to extract those 40 lines into a function (slot 08–09) so the body is short again.</li>
<li><strong>The same rule with multiple skips</strong> — two <code>continue</code>s become one combined condition: <code>if (C1) continue; if (C2) continue; REST;</code> is <code>if (!C1 &amp;&amp; !C2) { REST; }</code>, which De Morgan also lets you write as <code>if (!(C1 || C2))</code>. Choose whichever reads closer to the requirement's own wording.</li>
<li><strong>Connection to the style guide</strong> — slide 46's "Avoid goto, continue, break except in switch" is exactly this transformation applied as policy. Slide 47's "Avoid iterations with empty bodies — reserve the body for the algorithm" is the same instinct: the body should say what the algorithm <em>is</em>.</li>
</ul>
<p class="dap-an">✅ Đáp án: hai bản (dùng <code>continue</code> và dùng <code>if</code>) cùng cho <strong>25</strong> — đã biên dịch bằng <code>cc -Wall</code> và chạy thật, in ra "continue -&gt; 25 ; if -&gt; 25".</p>`,
        `<p class="y-chinh">🎯 Phép biến đổi đầu tiên và dễ nhất: mọi <code>continue</code> đều bỏ được bằng cách đảo ngược điều kiện của nó và bọc phần còn lại của thân vào một <code>if</code>. Slide ghi nhãn đúng câu này: "Use if instead of continue".</p>
<ul>
<li><strong>Quy tắc máy móc</strong> — <code>if (C) continue; PHẦN_CÒN_LẠI;</code> thành <code>if (!C) { PHẦN_CÒN_LẠI; }</code>. Không đổi gì khác. Không cần thêm biến nào, và đó là lý do đây luôn là phép biến đổi nên thử trước nhất.</li>
<li><strong>Ví dụ đã giải — tính tổng các số lẻ từ 1 đến 10</strong>. Bản dùng <code>continue</code>:
<pre><code>int i, s = 0;
for (i = 1; i &lt;= 10; i++) {
    if (i % 2 == 0) continue;     /* bỏ qua số chẵn */
    s += i;
}</code></pre>
Bản dùng <code>if</code>:
<pre><code>int i, s = 0;
for (i = 1; i &lt;= 10; i++) {
    if (i % 2 != 0) s += i;       /* giữ lại số lẻ */
}</code></pre>
Cả hai đã biên dịch và chạy: cả hai in <strong>25</strong> (1+3+5+7+9).</li>
<li><strong>Đọc hai bản như hai câu nói</strong> — bản đầu nói "nếu chẵn thì bỏ qua"; bản sau nói "nếu lẻ thì cộng vào". Bản sau là phát biểu trực tiếp về <em>vòng lặp làm gì</em>; bản đầu là phát biểu về <em>nó không làm gì</em>. Phát biểu khẳng định thì dễ đối chiếu với đề bài hơn.</li>
<li><strong>Vì sao đây không chỉ là chuyện văn phong</strong> — nhớ lại slide 35: trong vòng <code>while</code>, lệnh <code>continue</code> nhảy qua luôn phần tăng biến và làm chương trình treo. Bỏ <code>continue</code> đi là diệt cả một họ lỗi ngay từ gốc.</li>
<li><strong>Khi nào bản dùng <code>if</code> lại xấu hơn</strong> — nếu thân vòng lặp dài 40 dòng và phép thử bỏ qua nằm ở đầu, bọc tất cả vào một <code>if</code> là thêm một tầng thụt lề cho 40 dòng. Đó mới là lý lẽ thật của mệnh đề canh. Câu trả lời chuyên nghiệp là tách 40 dòng ấy thành một hàm (slot 08–09) để thân lại ngắn.</li>
<li><strong>Cùng quy tắc với nhiều lần bỏ qua</strong> — hai lệnh <code>continue</code> gộp thành một điều kiện: <code>if (C1) continue; if (C2) continue; PHẦN_CÒN_LẠI;</code> là <code>if (!C1 &amp;&amp; !C2) { … }</code>, mà theo De Morgan cũng viết được thành <code>if (!(C1 || C2))</code>. Chọn cách nào đọc gần với lời đề bài hơn.</li>
<li><strong>Liên hệ với bộ quy ước văn phong</strong> — câu "Avoid goto, continue, break except in switch" ở slide 46 chính là phép biến đổi này được nâng thành chính sách. Còn câu "Avoid iterations with empty bodies — reserve the body for the algorithm" ở slide 47 cũng cùng một trực giác: thân vòng lặp phải nói giải thuật <em>là gì</em>.</li>
</ul>
<p class="dap-an">✅ Đáp án: hai bản (dùng <code>continue</code> và dùng <code>if</code>) cùng cho <strong>25</strong> — đã biên dịch bằng <code>cc -Wall</code> và chạy thật, in ra "continue -&gt; 25 ; if -&gt; 25".</p>`],

      [39, 'Iteration Constructs: Flags (cont.) — example using goto',
        `<p class="y-chinh">🎯 The slide shows <code>goto</code> used to build a loop ("Loop infinitively") — the oldest way to repeat, and the one structured programming was invented to replace.</p>
<ul>
<li><strong>How <code>goto</code> works in C</strong> — you write a <em>label</em> (an identifier followed by a colon) somewhere in the function, and <code>goto label;</code> jumps there. Jumping backwards makes a loop; jumping forwards makes an escape.</li>
<li><strong>A backward <code>goto</code> is a loop</strong> — compiled and run:
<pre><code>int i = 0;
again:
    i++;
    if (i &lt; 3) goto again;
printf("goto loop ran %d times\\n", i);   /* prints 3 */</code></pre>
Written as <code>while</code> it is simply <code>i = 0; while (i &lt; 3) i++;</code> — same behaviour, half the reading effort.</li>
<li><strong>"Loop infinitively"</strong> — drop the test and the jump is unconditional: <code>again: …; goto again;</code> never stops. It is the <code>goto</code> equivalent of <code>while (1)</code> or <code>for (;;)</code> from slide 28, but with one crucial difference: the loop is invisible. There is no keyword to tell the reader "this repeats".</li>
<li><strong>That invisibility is the whole argument</strong> — with <code>for</code>/<code>while</code> the loop's boundaries are the braces, so you can see at a glance what repeats. With <code>goto</code> the boundary is wherever the label happens to be, possibly hundreds of lines away, possibly jumped into from three different places. One entry, one exit is lost.</li>
<li><strong>What C does forbid</strong> — <code>goto</code> can only jump inside the same function, which is why it cannot create the truly chaotic control flow of older languages. Jumping <em>into</em> a block past a variable's initialisation is also a defect the compiler may warn about.</li>
<li><strong>The one place working C programmers still use it</strong> — a single forward <code>goto cleanup;</code> to free resources on an error path in a long function. Even there it is a forward jump to one exit label, so it respects "one exit" in spirit. Backward jumps to fake a loop have no defence at all.</li>
<li><strong>What PRF192 expects of you</strong> — slide 46 says "Avoid goto"; slide 37 lists "The abolition of all goto statements" first. In an exam, a <code>goto</code> loop where a <code>for</code> would do loses marks even if the output is correct, because the marking rubric is this section.</li>
</ul>
<p class="dap-an">✅ Đáp án: vòng lặp bằng <code>goto</code> ở trên chạy đúng <strong>3</strong> lượt (đã biên dịch và chạy). Bản <code>while</code> tương đương cho cùng kết quả — <code>goto</code> ở đây không mang lại gì ngoài việc làm mất chữ "lặp" khỏi mã nguồn.</p>
<p class="pitfall">⚠️ A <code>goto</code> that jumps backwards over the statement that changes the loop variable produces an infinite loop with <strong>no syntax error, no warning, and no output</strong> — the hardest kind of bug to find, because the program looks busy while doing nothing. Slide 39's caption "Loop infinitively" is describing exactly that.</p>`,
        `<p class="y-chinh">🎯 Slide cho thấy <code>goto</code> được dùng để dựng một vòng lặp ("Loop infinitively") — cách lặp cổ xưa nhất, và cũng là thứ mà lập trình có cấu trúc ra đời để thay thế.</p>
<ul>
<li><strong><code>goto</code> hoạt động thế nào trong C</strong> — bạn viết một <em>nhãn</em> (một định danh theo sau bởi dấu hai chấm) ở đâu đó trong hàm, và <code>goto nhãn;</code> sẽ nhảy tới đó. Nhảy lùi thì tạo ra vòng lặp; nhảy tới thì tạo ra lối thoát.</li>
<li><strong>Một cú <code>goto</code> nhảy lùi chính là vòng lặp</strong> — đã biên dịch và chạy:
<pre><code>int i = 0;
again:
    i++;
    if (i &lt; 3) goto again;
printf("goto loop ran %d times\\n", i);   /* in ra 3 */</code></pre>
Viết bằng <code>while</code> thì chỉ là <code>i = 0; while (i &lt; 3) i++;</code> — cùng hành vi, một nửa công sức đọc.</li>
<li><strong>"Loop infinitively"</strong> — bỏ phép thử đi thì cú nhảy thành vô điều kiện: <code>again: …; goto again;</code> không bao giờ dừng. Đó là bản <code>goto</code> của <code>while (1)</code> hay <code>for (;;)</code> ở slide 28, nhưng khác một điểm cốt tử: vòng lặp trở nên vô hình. Không còn từ khoá nào nói với người đọc rằng "chỗ này lặp".</li>
<li><strong>Chính sự vô hình đó là toàn bộ lý lẽ</strong> — với <code>for</code>/<code>while</code>, biên của vòng lặp là cặp ngoặc nhọn, nhìn một cái là biết cái gì lặp. Với <code>goto</code>, biên nằm ở chỗ cái nhãn tình cờ được đặt, có thể cách hàng trăm dòng, có thể bị nhảy vào từ ba nơi khác nhau. Một lối vào một lối ra mất sạch.</li>
<li><strong>C cấm cái gì</strong> — <code>goto</code> chỉ nhảy được trong cùng một hàm, nên nó không tạo nổi kiểu dòng điều khiển hỗn loạn của các ngôn ngữ cũ. Nhảy <em>vào giữa</em> một khối, vượt qua chỗ khởi tạo biến, cũng là một khiếm khuyết mà trình biên dịch có thể cảnh báo.</li>
<li><strong>Chỗ duy nhất dân C đi làm còn dùng nó</strong> — một cú <code>goto cleanup;</code> nhảy tới, để giải phóng tài nguyên trên nhánh lỗi trong một hàm dài. Kể cả ở đó nó vẫn là cú nhảy tới một nhãn thoát duy nhất, nên vẫn tôn trọng tinh thần "một lối ra". Còn nhảy lùi để giả làm vòng lặp thì không có gì bào chữa nổi.</li>
<li><strong>PRF192 mong đợi gì ở bạn</strong> — slide 46 viết "Avoid goto"; slide 37 xếp "The abolition of all goto statements" lên hàng đầu. Trong phòng thi, một vòng lặp bằng <code>goto</code> ở chỗ đáng lẽ dùng <code>for</code> vẫn bị trừ điểm dù kết quả đúng, vì barem chấm chính là mục này.</li>
</ul>
<p class="dap-an">✅ Đáp án: vòng lặp bằng <code>goto</code> ở trên chạy đúng <strong>3</strong> lượt (đã biên dịch và chạy). Bản <code>while</code> tương đương cho cùng kết quả — <code>goto</code> ở đây không mang lại gì ngoài việc làm mất chữ "lặp" khỏi mã nguồn.</p>
<p class="pitfall">⚠️ Một cú <code>goto</code> nhảy lùi vượt qua câu lệnh làm thay đổi biến lặp sẽ tạo ra vòng lặp vô hạn <strong>không lỗi cú pháp, không cảnh báo, không in ra gì</strong> — loại lỗi khó tìm nhất, vì chương trình trông như đang rất bận trong khi chẳng làm gì. Dòng chú thích "Loop infinitively" trên slide 39 đang mô tả đúng cảnh đó.</p>`],

      [40, 'Iteration Construct: Flags (cont.) — use a flag instead of break',
        `<p class="y-chinh">🎯 The last slide of the section, and its payoff: the same search written twice — "A flag is used" and "No flag is used" — with the caption <strong>"Same output"</strong>. Identical behaviour, different structure.</p>
<ul>
<li><strong>The transformation rule</strong> — <code>while (C) { … if (E) break; … }</code> becomes <code>flag = 0; while (C &amp;&amp; !flag) { … if (E) flag = 1; … }</code>. The event that used to jump now records itself, and the loop's own condition does the leaving.</li>
<li><strong>The task used here</strong> — search the array <code>{4, 9, 15, 7, 15, 2}</code> for the value 15 and report the position of the first match.</li>
<li><strong>"No flag is used" — the <code>break</code> version</strong>:
<pre><code>for (i = 0; i &lt; N; i++)
    if (a[i] == key) break;
if (i &lt; N) printf("found %d at index %d\\n", key, i);
else       printf("%d not found\\n", key);</code></pre>
Note it needs the extra test <code>i &lt; N</code> afterwards: the value of <code>i</code> is the only record of <em>why</em> the loop ended.</li>
<li><strong>"A flag is used" — the flag version</strong>:
<pre><code>int found = 0, pos = -1;
for (i = 0; i &lt; N &amp;&amp; !found; i++)
    if (a[i] == key) { found = 1; pos = i; }
if (found) printf("found %d at index %d\\n", key, pos);
else       printf("%d not found\\n", key);</code></pre></li>
<li><strong>"Same output" — measured, not assumed</strong>:
<table>
<tr><th>Phiên bản</th><th>key = 15</th><th>key = 100</th></tr>
<tr><td>No flag (break)</td><td>found 15 at index 2</td><td>15 not found</td></tr>
<tr><td>A flag is used</td><td>found 15 at index 2</td><td>found = 0, pos = -1 → not found</td></tr>
</table>
Both versions stop at the <strong>first</strong> match (index 2), not the second one at index 4 — that is what "first occurrence" requires.</li>
<li><strong>The trap the flag version hides</strong> — in <code>for (i = 0; i &lt; N &amp;&amp; !found; i++)</code>, the step <code>i++</code> still runs on the repetition that sets the flag. Measured: after finding the value at index 2, <code>i</code> equals <strong>3</strong>, not 2. That is exactly why the code above saves <code>pos = i</code> at the moment of the match instead of reading <code>i</code> afterwards.</li>
<li><strong>Which one to submit</strong> — PRF192's own style guide (slides 37 and 46) asks for the flag version, and it is strictly more informative: <code>found</code> and <code>pos</code> are two named facts you can print, return from a function, or feed into the next <code>if</code>. The <code>break</code> version stores the same knowledge implicitly in a loop counter, which is the kind of implicitness the whole section is arguing against.</li>
</ul>
<p class="dap-an">✅ Đáp án: cả hai bản cùng in "found 15 at index 2" với mảng {4, 9, 15, 7, 15, 2}, và cùng báo không tìm thấy với key = 100 — đã biên dịch bằng <code>cc -Wall</code> và chạy thật, đúng như chữ "Same output" trên slide. Bẫy đo được: sau vòng lặp có cờ, <code>i</code> bằng 3 chứ không bằng 2, nên phải lưu <code>pos</code> ngay lúc khớp.</p>
<p class="meo">💡 Cách nhớ cả mục 36–40 trong một câu: <em>đừng nhảy ra khỏi vòng lặp, hãy ghi lại điều vừa xảy ra rồi để điều kiện của vòng lặp tự đưa bạn ra</em>. Cái tên bạn đặt cho biến cờ chính là câu trả lời cho câu hỏi mà vòng lặp sinh ra để trả lời.</p>`,
        `<p class="y-chinh">🎯 Slide cuối của mục, và cũng là phần thu hoạch: cùng một phép tìm kiếm viết hai lần — "A flag is used" và "No flag is used" — với dòng chú thích <strong>"Same output"</strong>. Hành vi y hệt, cấu trúc khác nhau.</p>
<ul>
<li><strong>Quy tắc biến đổi</strong> — <code>while (C) { … if (E) break; … }</code> thành <code>flag = 0; while (C &amp;&amp; !flag) { … if (E) flag = 1; … }</code>. Sự kiện trước đây gây ra cú nhảy thì nay tự ghi lại mình, còn việc rời vòng lặp trả về cho chính điều kiện của vòng lặp.</li>
<li><strong>Bài toán dùng ở đây</strong> — tìm giá trị 15 trong mảng <code>{4, 9, 15, 7, 15, 2}</code> và báo vị trí lần khớp đầu tiên.</li>
<li><strong>"No flag is used" — bản dùng <code>break</code></strong>:
<pre><code>for (i = 0; i &lt; N; i++)
    if (a[i] == key) break;
if (i &lt; N) printf("tim thay %d tai chi so %d\\n", key, i);
else       printf("khong tim thay %d\\n", key);</code></pre>
Chú ý nó cần thêm phép kiểm <code>i &lt; N</code> ở sau: giá trị của <code>i</code> là dấu vết duy nhất cho biết <em>vì sao</em> vòng lặp kết thúc.</li>
<li><strong>"A flag is used" — bản dùng biến cờ</strong>:
<pre><code>int found = 0, pos = -1;
for (i = 0; i &lt; N &amp;&amp; !found; i++)
    if (a[i] == key) { found = 1; pos = i; }
if (found) printf("tim thay %d tai chi so %d\\n", key, pos);
else       printf("khong tim thay %d\\n", key);</code></pre></li>
<li><strong>"Same output" — đo thật, không phải giả định</strong>:
<table>
<tr><th>Phiên bản</th><th>key = 15</th><th>key = 100</th></tr>
<tr><td>Không cờ (break)</td><td>tìm thấy 15 tại chỉ số 2</td><td>không tìm thấy 15</td></tr>
<tr><td>Có dùng cờ</td><td>tìm thấy 15 tại chỉ số 2</td><td>found = 0, pos = -1 → không tìm thấy</td></tr>
</table>
Cả hai bản đều dừng ở lần khớp <strong>đầu tiên</strong> (chỉ số 2), không phải lần thứ hai ở chỉ số 4 — đúng yêu cầu "lần xuất hiện đầu tiên".</li>
<li><strong>Cái bẫy mà bản dùng cờ giấu đi</strong> — trong <code>for (i = 0; i &lt; N &amp;&amp; !found; i++)</code>, bước <code>i++</code> vẫn chạy ở chính lượt đặt cờ. Đo thật: sau khi tìm thấy giá trị ở chỉ số 2, <code>i</code> bằng <strong>3</strong>, không phải 2. Đó đúng là lý do đoạn code trên lưu <code>pos = i</code> ngay tại thời điểm khớp, thay vì đọc <code>i</code> ở sau.</li>
<li><strong>Nộp bài bằng bản nào</strong> — bộ quy ước văn phong của chính PRF192 (slide 37 và 46) yêu cầu bản dùng cờ, và nó cũng cho nhiều thông tin hơn hẳn: <code>found</code> và <code>pos</code> là hai sự thật có tên, in ra được, trả về từ hàm được, đưa vào lệnh <code>if</code> kế tiếp được. Bản dùng <code>break</code> cất cùng hiểu biết đó một cách ngầm ẩn trong biến đếm — đúng kiểu ngầm ẩn mà cả mục này đang phản đối.</li>
</ul>
<p class="dap-an">✅ Đáp án: cả hai bản cùng in "tìm thấy 15 tại chỉ số 2" với mảng {4, 9, 15, 7, 15, 2}, và cùng báo không tìm thấy với key = 100 — đã biên dịch bằng <code>cc -Wall</code> và chạy thật, đúng như chữ "Same output" trên slide. Bẫy đo được: sau vòng lặp có cờ, <code>i</code> bằng 3 chứ không bằng 2, nên phải lưu <code>pos</code> ngay lúc khớp.</p>
<p class="meo">💡 Cách nhớ cả mục 36–40 trong một câu: <em>đừng nhảy ra khỏi vòng lặp, hãy ghi lại điều vừa xảy ra rồi để điều kiện của vòng lặp tự đưa bạn ra</em>. Cái tên bạn đặt cho biến cờ chính là câu trả lời cho câu hỏi mà vòng lặp sinh ra để trả lời.</p>`],

    ]),
  ].join('\n'),
};
