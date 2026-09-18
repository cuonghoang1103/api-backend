/**
 * PRF192 · Slot 08-09 (deck 'prf4', 71 slide) — phần slide 26→48, học theo từng slide.
 * Chương 5b: Hàm trong C — định nghĩa, gọi, nguyên mẫu (prototype), #include, phong cách.
 *
 * Nội dung bám ĐÚNG chữ trích từ .pptx gốc của trường (/tmp/prf192-text/prf4.txt).
 * MỌI kết quả in ra trong phần giảng đã kiểm bằng biên dịch thật (Apple clang 17, cc -Wall -std=c99):
 *   average(5,8,10) = 7.666667  ·  (a+b+c)/3 (chia nguyên) = 7.000000  ·  average(1,2,4) = 2.33
 *   printDivisors(12) -> "1, 2, 3, 4, 6, 12, "  ·  printDivisors(7) -> "1, 7, "
 *   printDivisors(30) -> "1, 2, 3, 5, 6, 10, 15, 30, "
 *   sumDivisors(12)=28 · sumDivisors(28)=56 · sumDivisors(6)=12 · sumDivisors(496)=992
 *   Exercise 2: Z(10,20,30)=5.4545 · Z(6,6,6)=2.0000 · Z(10,10,10)=3.3333
 *   isPrime(29)=1 · isPrime(30)=0 · isPrime(1)=0 · isPrime(2)=1
 *   Gọi hàm chưa khai báo (C99+, clang 17): "error: call to undeclared function" + "conflicting types" -> KHÔNG dịch được
 *   'return 7;' trong hàm void: "error: void function 'g' should not return a value"
 *   Thiếu 'return' trong hàm int: chỉ CẢNH BÁO "-Wreturn-type", chạy ra rác (đo được 1 thay vì 6)
 *   int foo(); gọi foo(1,2,3): dịch được nhưng cảnh báo "-Wdeprecated-non-prototype", C23 bỏ hẳn
 *   cc -E cho thấy #include "mylib.h" = DÁN NGUYÊN VĂN dòng 'int square(int n);' vào chỗ đó
 * Chỗ slide gốc thiếu/gây hiểu nhầm đã nêu thẳng trong phần Đáp án (slide 31, 33, 43), không im lặng chép lại.
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'prf4';

export default {
  title: '5.0b — Slide by slide: Defining, calling and prototyping C functions (slides 26–48)|||5.0b — Slide bài giảng: Định nghĩa, gọi và khai báo nguyên mẫu hàm C (slide 26–48)',
  slug: 'prf192-5-0b-slides-ham-c-prototype',
  type: 'DOCUMENT',
  description: 'Phần giữa bộ slide Slot 08-09 của PRF192 (slide 26–48): module trong C chính là hàm — cú pháp định nghĩa hàm, hàm void, hàm main, cách hiện thực và đánh giá một hàm (cohesion/coupling), cách gọi hàm, nguyên mẫu hàm (function prototype), chỉ thị #include và phong cách viết hàm. Toàn bộ Practice 1, Exercise 1 và Exercise 2 được giải trọn vẹn bằng chương trình C đầy đủ, và mọi kết quả in ra đều đã kiểm lại bằng trình biên dịch thật.',
  content: [
    walkHead(D, 26, 48),
    walk(D, [

      [26, '4 - C-Functions and Modules (section divider)',
        `<p class="y-chinh">🎯 A section marker: slides 1–25 argued <em>why</em> a program should be cut into modules. From here the deck stops talking about design and starts writing C — and in C, a module <strong>is</strong> a function.</p>
<ul>
<li><strong>Where you are in the deck</strong> — part 1 (slides 6–9) defined a module, part 2 (10–11) listed its characteristics, part 3 (12–25) gave the identification hints: cohesion, coupling, "if you still use a verb to describe a task then a module is identified". All of that was language-independent.</li>
<li><strong>What part 4 adds</strong> — the concrete C syntax. Slides 27–33 are the grammar (definition, <code>void</code>, <code>main</code>), 34–37 are how to write a good one, 38–43 are how to call one, 44–48 are prototypes and <code>#include</code>.</li>
<li><strong>Why the design half came first</strong> — the syntax of a function takes five minutes to learn and a lifetime to use well. The exam asks you to <em>split a problem into functions</em>, which is a design question; the C keywords are only how you write the answer down.</li>
<li><strong>The running example survives the transition</strong> — "sum the divisors of a positive integer n" has been on screen since slide 9. From slide 40 onward it becomes real, compilable code, so keep it in mind.</li>
<li><strong>What comes after this block</strong> — slides 49–53 explain what happens in memory when a function is called (stack frames, pass by value), 54–59 analyse a problem into functions, 60–64 cover extent and scope. This block is the bridge between them.</li>
</ul>
<p class="meo">💡 Read the next twenty slides with one sentence in your head: <em>a function is a named, reusable task that may take data in and may hand one value back</em>. Every rule that follows — return type, parameters, <code>void</code>, prototypes — is just the paperwork for that one idea.</p>`,
        `<p class="y-chinh">🎯 Slide phân mục: slide 1–25 lý giải <em>vì sao</em> phải chia chương trình thành module. Từ đây bộ slide ngừng bàn thiết kế và bắt đầu viết C — mà trong C, một module <strong>chính là</strong> một hàm.</p>
<ul>
<li><strong>Bạn đang ở đâu trong bộ slide</strong> — phần 1 (slide 6–9) định nghĩa module, phần 2 (10–11) liệt kê đặc tính, phần 3 (12–25) cho mẹo nhận diện: cohesion, coupling, "nếu bạn còn dùng được một ĐỘNG TỪ để mô tả một việc thì đã nhận ra một module". Tất cả những thứ đó không phụ thuộc ngôn ngữ.</li>
<li><strong>Phần 4 thêm gì</strong> — cú pháp C cụ thể. Slide 27–33 là văn phạm (định nghĩa hàm, <code>void</code>, <code>main</code>), 34–37 là cách viết một hàm tốt, 38–43 là cách gọi hàm, 44–48 là nguyên mẫu và <code>#include</code>.</li>
<li><strong>Vì sao nửa thiết kế đi trước</strong> — cú pháp của hàm học năm phút là xong, còn dùng cho khéo thì cả đời. Đề thi hỏi bạn <em>chia bài toán thành các hàm</em> — đó là câu hỏi thiết kế; các từ khoá C chỉ là cách viết câu trả lời ra giấy.</li>
<li><strong>Ví dụ xuyên suốt vẫn còn đó</strong> — "tính tổng các ước của số nguyên dương n" đã nằm trên màn hình từ slide 9. Từ slide 40 nó trở thành code C thật, biên dịch được, nên hãy giữ nó trong đầu.</li>
<li><strong>Sau khối này là gì</strong> — slide 49–53 giải thích chuyện xảy ra trong bộ nhớ khi gọi hàm (khung ngăn xếp, truyền theo giá trị), 54–59 phân tích bài toán thành hàm, 60–64 nói về extent và scope. Khối này là cây cầu nối hai bên.</li>
</ul>
<p class="meo">💡 Hãy đọc hai chục slide tới với một câu trong đầu: <em>hàm là một việc có tên, dùng lại được, có thể nhận dữ liệu vào và có thể trả về MỘT giá trị</em>. Mọi luật phía sau — kiểu trả về, tham số, <code>void</code>, prototype — chỉ là thủ tục giấy tờ cho đúng một ý đó.</p>`],

      [27, 'C-Functions and Modules',
        `<p class="y-chinh">🎯 The sentence to memorise, straight off the slide: "A function is a block of reusable code designed to perform a specific task. A function <em>may</em> receive data and <em>may</em> return a value."</p>
<ul>
<li><strong>Two independent "may"s</strong> — receiving data and returning a value are separate switches, so there are four combinations: takes nothing/returns nothing, takes nothing/returns something, takes something/returns nothing, takes something/returns something. All four are legal C, and the slide gives you two of them side by side.</li>
<li><strong>Example A — <code>printDivisors</code></strong> — "Print out divisors of the integer n → n is data accepted by the function and <strong>no value is returned</strong>." With <code>n = 12</code> it puts <code>1, 2, 3, 4, 6, 12</code> on screen. Its useful work is a side effect (screen output), so there is nothing to hand back.</li>
<li><strong>Example B — <code>sumDivisors</code></strong> — "Sum of divisors of the integer n → n is data accepted by the function and <strong>a value is returned</strong>." With <code>n = 12</code> the return value is <strong>28</strong> (1+2+3+4+6+12). Its useful work <em>is</em> the number, so it must be handed back.</li>
<li><strong>How to choose between them</strong> — ask "who needs the result?" If only the screen needs it, print it and return nothing. If the caller might want to add it, compare it, or store it, return it. Returning is more reusable; printing is a dead end.</li>
<li><strong>The last line of the slide</strong> — "The description of the internal logic of a function [is] the function's <em>definition</em>." That word matters from slide 44 onward, where <em>definition</em> (with a body) is deliberately contrasted with <em>declaration/prototype</em> (no body, just a semicolon).</li>
</ul>
<pre><code>void printDivisors(int n);   /* takes data, returns nothing */
int  sumDivisors(int n);     /* takes data, returns a value */</code></pre>
<p class="dap-an">✅ Both examples compiled and run. <code>printDivisors(12)</code> prints <code>1, 2, 3, 4, 6, 12, </code> and <code>sumDivisors(12)</code> returns <strong>28</strong> — exactly the numbers on the slide. Checked further: <code>sumDivisors(28) = 56</code> and <code>sumDivisors(6) = 12</code> (both are perfect numbers, so the sum is twice the number itself).</p>
<p class="meo">💡 "Reusable" is not decoration. If <code>sumDivisors</code> asked the user for <code>n</code> itself instead of taking it as a parameter, it could never be used inside a loop, inside another calculation, or in a program with no keyboard. Taking data <em>in</em> as a parameter is what makes a function reusable — this is the low-coupling rule from slide 19 written in C.</p>`,
        `<p class="y-chinh">🎯 Câu phải thuộc, chép thẳng từ slide: "A function is a block of reusable code designed to perform a specific task. A function <em>may</em> receive data and <em>may</em> return a value" — hàm là một khối mã dùng lại được, làm một việc cụ thể; hàm CÓ THỂ nhận dữ liệu và CÓ THỂ trả về một giá trị.</p>
<ul>
<li><strong>Hai chữ "có thể" độc lập nhau</strong> — nhận dữ liệu và trả giá trị là hai công tắc riêng, nên có bốn tổ hợp: không nhận/không trả, không nhận/có trả, có nhận/không trả, có nhận/có trả. Cả bốn đều hợp lệ trong C, và slide đưa sẵn hai cái đặt cạnh nhau.</li>
<li><strong>Ví dụ A — <code>printDivisors</code></strong> — "in ra các ước của số nguyên n → n là dữ liệu hàm nhận vào và <strong>không trả về giá trị nào</strong>". Với <code>n = 12</code> nó in ra <code>1, 2, 3, 4, 6, 12</code>. Việc có ích của nó là một tác dụng phụ (in ra màn hình), nên không có gì để trả về.</li>
<li><strong>Ví dụ B — <code>sumDivisors</code></strong> — "tổng các ước của số nguyên n → n là dữ liệu hàm nhận vào và <strong>có một giá trị được trả về</strong>". Với <code>n = 12</code> giá trị trả về là <strong>28</strong> (1+2+3+4+6+12). Việc có ích của nó CHÍNH LÀ con số, nên bắt buộc phải trả về.</li>
<li><strong>Chọn giữa hai kiểu thế nào</strong> — hỏi "ai cần kết quả?". Nếu chỉ màn hình cần thì in ra rồi không trả gì. Nếu người gọi có thể muốn cộng thêm, so sánh, hay cất đi thì phải trả về. Trả về thì dùng lại được nhiều hơn; in ra là ngõ cụt.</li>
<li><strong>Dòng cuối của slide</strong> — "mô tả logic bên trong của hàm chính là <em>định nghĩa</em> hàm". Chữ này quan trọng từ slide 44 trở đi, chỗ bộ slide cố ý đối chiếu <em>định nghĩa</em> (có thân hàm) với <em>khai báo/nguyên mẫu</em> (không thân, chỉ một dấu chấm phẩy).</li>
</ul>
<pre><code>void printDivisors(int n);   /* nhận dữ liệu, không trả gì  */
int  sumDivisors(int n);     /* nhận dữ liệu, trả một giá trị */</code></pre>
<p class="dap-an">✅ Cả hai ví dụ đã biên dịch và chạy thật. <code>printDivisors(12)</code> in ra <code>1, 2, 3, 4, 6, 12, </code> và <code>sumDivisors(12)</code> trả về <strong>28</strong> — đúng bằng con số trên slide. Kiểm thêm: <code>sumDivisors(28) = 56</code> và <code>sumDivisors(6) = 12</code> (đều là số hoàn hảo nên tổng bằng đúng hai lần chính nó).</p>
<p class="meo">💡 Chữ "dùng lại được" không phải để trang trí. Nếu <code>sumDivisors</code> tự hỏi người dùng nhập <code>n</code> thay vì nhận <code>n</code> làm tham số thì nó không bao giờ dùng được trong một vòng lặp, trong một phép tính khác, hay trong chương trình không có bàn phím. Nhận dữ liệu <em>vào</em> qua tham số chính là thứ làm hàm dùng lại được — đó là luật low coupling ở slide 19 viết bằng C.</p>`],

      [28, 'Function Definitions (the syntax)',
        `<p class="y-chinh">🎯 The whole grammar of a C function on one slide: <code>returnType functionName([Type param1, Type param2, …]) { &lt;code&gt; [return value;] }</code> — a <strong>header</strong> and a <strong>body</strong>.</p>
<ul>
<li><strong>The four questions the slide writes beside the syntax</strong> — <em>returnType</em> answers "what is the result of the task?", <em>functionName</em> answers "what is the name of the task?", <em>parameters</em> answer "to do this task, what data are necessary?", and the <em>body</em> answers "how does this task do it?". Answer those four in order and you have written the function.</li>
<li><strong>Header vs body</strong> — the header is everything before the opening brace; it is the contract the outside world sees. The body is inside the braces; it is nobody else's business. This split is exactly what makes a prototype possible on slide 44 — a prototype is the header, alone, with a semicolon.</li>
<li><strong>The square brackets are meta-notation</strong> — <code>[ … ]</code> in the slide means "optional", it is not C syntax. You never type square brackets in a function header. A function with no parameters is written <code>int f(void)</code>; a function that returns nothing simply has no <code>return value;</code> line.</li>
<li><strong>There is no semicolon after the header of a definition</strong> — <code>int f(int n) { … }</code>. Put one in — <code>int f(int n); { … }</code> — and you have accidentally written a prototype followed by a stray block, which is a completely different program. This is the single most common syntax mistake on this topic.</li>
<li><strong>Each parameter needs its own type</strong> — <code>int f(int a, int b)</code> is correct; <code>int f(int a, b)</code> is not, even though maths would allow the shorthand. C has no "same as previous" rule for parameters.</li>
</ul>
<pre><code>int sumDivisors(int n)      /* header: type, name, parameters — NO semicolon */
{                           /* body starts                                   */
    int i, s = 0;
    for (i = 1; i &lt;= n; i++)
        if (n % i == 0) s = s + i;
    return s;               /* the value handed back                         */
}</code></pre>
<p class="dap-an">✅ Compiled and run: this exact function returns <strong>28</strong> for <code>n = 12</code>, <strong>56</strong> for <code>n = 28</code>, and <strong>992</strong> for <code>n = 496</code>. Note the return type <code>int</code> in the header and the <code>return s;</code> in the body agree — if they disagree, C silently converts, which is how <code>int f(…) { return 2.7; }</code> quietly returns 2.</p>
<p class="pitfall">⚠️ A function's braces are not a block you can nest inside another function. C has <strong>no nested function definitions</strong>: every function is written at the top level of the file, side by side. Writing <code>int main(void) { int helper(int x) { … } … }</code> is not standard C — helpers go <em>outside</em> and above (or behind a prototype).</p>`,
        `<p class="y-chinh">🎯 Toàn bộ văn phạm của một hàm C gói trong một slide: <code>returnType functionName([Type param1, Type param2, …]) { &lt;code&gt; [return value;] }</code> — gồm một <strong>đầu hàm (header)</strong> và một <strong>thân hàm (body)</strong>.</p>
<ul>
<li><strong>Bốn câu hỏi slide ghi bên cạnh cú pháp</strong> — <em>returnType</em> trả lời "kết quả của việc này là gì?", <em>functionName</em> trả lời "việc này tên gì?", <em>tham số</em> trả lời "để làm việc này cần những dữ liệu nào?", và <em>thân hàm</em> trả lời "việc này làm thế nào?". Trả lời bốn câu đó theo thứ tự là bạn đã viết xong hàm.</li>
<li><strong>Đầu hàm và thân hàm</strong> — đầu hàm là tất cả những gì đứng trước dấu ngoặc nhọn mở; đó là bản hợp đồng mà thế giới bên ngoài nhìn thấy. Thân hàm nằm trong ngoặc nhọn; đó là chuyện riêng của nó. Chính sự tách đôi này làm cho prototype ở slide 44 khả thi — prototype chính là cái đầu hàm đứng một mình kèm dấu chấm phẩy.</li>
<li><strong>Cặp ngoặc vuông là ký hiệu MÔ TẢ, không phải cú pháp</strong> — <code>[ … ]</code> trên slide nghĩa là "tuỳ chọn", không phải thứ bạn gõ vào. Không bao giờ gõ ngoặc vuông trong đầu hàm. Hàm không tham số viết là <code>int f(void)</code>; hàm không trả gì thì đơn giản là không có dòng <code>return giá_trị;</code>.</li>
<li><strong>KHÔNG có dấu chấm phẩy sau đầu hàm của một định nghĩa</strong> — <code>int f(int n) { … }</code>. Thêm một dấu vào — <code>int f(int n); { … }</code> — là bạn vô tình viết một prototype rồi một khối lạc lõng đằng sau, thành một chương trình hoàn toàn khác. Đây là lỗi cú pháp hay gặp nhất của chủ đề này.</li>
<li><strong>Mỗi tham số phải có kiểu riêng</strong> — <code>int f(int a, int b)</code> mới đúng; <code>int f(int a, b)</code> thì sai, dù toán học cho phép viết tắt như vậy. C không có luật "giống cái trước" cho tham số.</li>
</ul>
<pre><code>int sumDivisors(int n)      /* đầu hàm: kiểu, tên, tham số — KHÔNG chấm phẩy */
{                           /* thân hàm bắt đầu                              */
    int i, s = 0;
    for (i = 1; i &lt;= n; i++)
        if (n % i == 0) s = s + i;
    return s;               /* giá trị được trả về                           */
}</code></pre>
<p class="dap-an">✅ Đã biên dịch và chạy: đúng hàm này trả về <strong>28</strong> với <code>n = 12</code>, <strong>56</strong> với <code>n = 28</code>, và <strong>992</strong> với <code>n = 496</code>. Để ý kiểu trả về <code>int</code> ở đầu hàm khớp với <code>return s;</code> trong thân — nếu hai cái lệch nhau thì C tự chuyển kiểu âm thầm, và đó là lý do <code>int f(…) { return 2.7; }</code> lặng lẽ trả về 2.</p>
<p class="pitfall">⚠️ Cặp ngoặc nhọn của hàm KHÔNG phải một khối lồng được vào hàm khác. C <strong>không có định nghĩa hàm lồng nhau</strong>: mọi hàm đều viết ở cấp ngoài cùng của file, nằm cạnh nhau. Viết <code>int main(void) { int helper(int x) { … } … }</code> không phải C chuẩn — hàm phụ phải nằm <em>ngoài</em> và ở trên (hoặc có prototype đứng trước).</p>`],

      [29, 'Function Definitions — Example (double average)',
        `<p class="y-chinh">🎯 The deck's first real function, with every part labelled: <code>double average(int a, int b, int c) { double result; result = (a+b+c)/3. ; return result; }</code>.</p>
<ul>
<li><strong>The labels on the slide, mapped</strong> — <code>double</code> is the "return DataType", <code>average</code> is the "Function Identifier", <code>(int a, int b, int c)</code> are the "Parameters", and everything in braces is the "Body: logical construct".</li>
<li><strong>Why the return type is <code>double</code> and not <code>int</code></strong> — the average of three integers is generally not an integer. Declare it <code>int average(…)</code> and <code>average(5,8,10)</code> would hand back 7 instead of 7.666667. The return type is a decision about the <em>answer</em>, not about the inputs.</li>
<li><strong>The whole lesson is the dot in <code>3.</code></strong> — the slide spells out the review: <code>(a+b+c)/3</code> gives an <strong>integer</strong>, while <code>(a+b+c)/3.0</code> gives a <strong>double</strong>. Both operands of <code>/</code> are <code>int</code> in the first case, so C does integer division and throws the fraction away — <em>before</em> the assignment to a <code>double</code> can rescue anything.</li>
<li><strong>The slide's notation review</strong> — "3.0 and 3. are the same; 3.3500 = 3.35; 3.30 = 3.3; 3.0 = 3." In a C literal, trailing zeros after the point are optional and so is the digit after the point: <code>3.</code> is a perfectly legal <code>double</code> literal. It is legal but easy to misread, which is why <code>3.0</code> is the better habit.</li>
<li><strong>The local variable <code>result</code></strong> — it is not required (<code>return (a+b+c)/3.0;</code> works), but it is good style: it names the thing being computed and gives you somewhere to put a breakpoint. It lives only while the function runs — that is the "extent" idea from slide 61.</li>
</ul>
<pre><code>double average(int a, int b, int c)
{
    double result;
    result = (a + b + c) / 3. ;   /* the dot makes it real division */
    return result;
}</code></pre>
<p class="dap-an">✅ Compiled and run. <code>average(5,8,10)</code> = <strong>7.666667</strong>. Change the one character <code>3.</code> into <code>3</code> and the same function returns <strong>7.000000</strong> — verified side by side in one program. With <code>average(1,2,3)</code> both versions return 2.000000, because 6/3 divides exactly; that is exactly why this bug hides so well in testing.</p>
<p class="pitfall">⚠️ Casting the result does not save you: <code>(double)((a+b+c)/3)</code> still gives 7.000000, because the integer division already happened inside the parentheses. The cast must touch an <em>operand</em>: <code>(double)(a+b+c)/3</code> works, and so does dividing by <code>3.0</code>.</p>`,
        `<p class="y-chinh">🎯 Hàm thật đầu tiên của bộ slide, mọi bộ phận đều được dán nhãn: <code>double average(int a, int b, int c) { double result; result = (a+b+c)/3. ; return result; }</code>.</p>
<ul>
<li><strong>Các nhãn trên slide, ánh xạ ra</strong> — <code>double</code> là "return DataType" (kiểu trả về), <code>average</code> là "Function Identifier" (tên hàm), <code>(int a, int b, int c)</code> là "Parameters" (tham số), và tất cả trong ngoặc nhọn là "Body: logical construct" (thân hàm).</li>
<li><strong>Vì sao kiểu trả về là <code>double</code> chứ không phải <code>int</code></strong> — trung bình của ba số nguyên nói chung không phải số nguyên. Khai <code>int average(…)</code> thì <code>average(5,8,10)</code> sẽ trả về 7 thay vì 7,666667. Kiểu trả về là quyết định về <em>đáp số</em>, không phải về dữ liệu vào.</li>
<li><strong>Toàn bộ bài học nằm ở dấu chấm trong <code>3.</code></strong> — slide viết rõ phần ôn: <code>(a+b+c)/3</code> cho ra <strong>số nguyên</strong>, còn <code>(a+b+c)/3.0</code> cho ra <strong>double</strong>. Ở trường hợp đầu cả hai toán hạng của <code>/</code> đều là <code>int</code> nên C chia nguyên và vứt phần lẻ — <em>trước khi</em> phép gán vào biến <code>double</code> kịp cứu vãn điều gì.</li>
<li><strong>Phần ôn về cách viết số trên slide</strong> — "3.0 và 3. là như nhau; 3.3500 = 3.35; 3.30 = 3.3; 3.0 = 3.". Trong hằng số C, các số 0 đuôi sau dấu chấm là tuỳ chọn, và cả chữ số sau dấu chấm cũng vậy: <code>3.</code> là một hằng <code>double</code> hoàn toàn hợp lệ. Hợp lệ nhưng dễ đọc nhầm, nên viết <code>3.0</code> là thói quen tốt hơn.</li>
<li><strong>Biến cục bộ <code>result</code></strong> — không bắt buộc (<code>return (a+b+c)/3.0;</code> vẫn chạy), nhưng là phong cách tốt: nó đặt tên cho thứ đang được tính và cho bạn một chỗ để đặt breakpoint. Nó chỉ sống trong lúc hàm chạy — đó chính là khái niệm "extent" ở slide 61.</li>
</ul>
<pre><code>double average(int a, int b, int c)
{
    double result;
    result = (a + b + c) / 3. ;   /* dấu chấm làm nó thành chia thực */
    return result;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch và chạy. <code>average(5,8,10)</code> = <strong>7.666667</strong>. Đổi đúng một ký tự <code>3.</code> thành <code>3</code> thì cùng hàm đó trả về <strong>7.000000</strong> — đã đo cạnh nhau trong cùng một chương trình. Còn với <code>average(1,2,3)</code> thì cả hai bản đều trả 2.000000, vì 6/3 chia hết; đó đúng là lý do con bug này nấp rất kỹ khi thử nghiệm.</p>
<p class="pitfall">⚠️ Ép kiểu kết quả không cứu được: <code>(double)((a+b+c)/3)</code> vẫn cho 7.000000, vì phép chia nguyên đã xảy ra bên trong ngoặc rồi. Ép kiểu phải chạm vào một <em>toán hạng</em>: <code>(double)(a+b+c)/3</code> thì đúng, và chia cho <code>3.0</code> cũng đúng.</p>`],

      [30, 'Function Definitions — Example (cont.): the complete program',
        `<p class="y-chinh">🎯 The screenshot slide: the <code>average</code> function put inside a whole program, compiled and run, so you see the header, <code>main</code>, the call, and the printed result all at once.</p>
<ul>
<li><strong>What a complete program needs that a lone function does not</strong> — an <code>#include</code> line so <code>printf</code>/<code>scanf</code> are declared, a <code>main</code> to start from, and a <code>return 0;</code> at the end of <code>main</code>. The function alone does not run; something has to call it.</li>
<li><strong>Type this and run it</strong> — it is the faithful version of what is on screen:
<pre><code>#include &lt;stdio.h&gt;

double average(int a, int b, int c);   /* prototype — see slide 44 */

int main(void)
{
    int x, y, z;
    printf("Enter 3 integers: ");
    scanf("%d%d%d", &amp;x, &amp;y, &amp;z);
    printf("Average = %.2f\\n", average(x, y, z));
    return 0;
}

double average(int a, int b, int c)
{
    double result;
    result = (a + b + c) / 3. ;
    return result;
}</code></pre></li>
<li><strong>Parameters vs arguments, visible here</strong> — <code>a, b, c</code> in the definition are <em>parameters</em>; <code>x, y, z</code> at the call site are <em>arguments</em>. Slide 39 names this distinction; here you can see that the names need not match at all.</li>
<li><strong>Printing a <code>double</code></strong> — <code>%f</code> prints six decimals by default; <code>%.2f</code> rounds to two. Using <code>%d</code> for a <code>double</code> is undefined behaviour and prints garbage — the format specifier must match the type.</li>
<li><strong><code>&amp;</code> in <code>scanf</code> but not in <code>printf</code></strong> — <code>scanf</code> needs the <em>address</em> of the variable so it can write into it; <code>printf</code> only needs the value. Forgetting the <code>&amp;</code> usually crashes at run time, not at compile time.</li>
</ul>
<p class="dap-an">✅ Compiled with <code>cc -Wall -std=c99</code> and run. Input <code>5 8 10</code> → prints <strong>Average = 7.67</strong>. Input <code>1 2 4</code> → prints <strong>Average = 2.33</strong>. (Full precision without <code>%.2f</code>: 7.666667 and 2.333333.)</p>
<p class="meo">💡 Notice that <code>main</code> got shorter, not longer, by having <code>average</code> exist. That is the whole payoff of modules from slide 3: "Code Organization: Programs are structured, making them easier to read and maintain." <code>main</code> now reads like a summary of the task, and the arithmetic lives out of the way.</p>`,
        `<p class="y-chinh">🎯 Slide ảnh chụp màn hình: hàm <code>average</code> đặt vào một chương trình hoàn chỉnh, biên dịch và chạy, để bạn nhìn thấy cùng lúc đầu hàm, <code>main</code>, lời gọi và kết quả in ra.</p>
<ul>
<li><strong>Chương trình hoàn chỉnh cần gì mà một hàm đứng lẻ không có</strong> — một dòng <code>#include</code> để <code>printf</code>/<code>scanf</code> được khai báo, một hàm <code>main</code> để bắt đầu, và <code>return 0;</code> ở cuối <code>main</code>. Hàm đứng một mình thì không chạy; phải có ai đó gọi nó.</li>
<li><strong>Gõ cái này rồi chạy</strong> — đây là bản trung thành với những gì trên màn hình:
<pre><code>#include &lt;stdio.h&gt;

double average(int a, int b, int c);   /* nguyên mẫu — xem slide 44 */

int main(void)
{
    int x, y, z;
    printf("Enter 3 integers: ");
    scanf("%d%d%d", &amp;x, &amp;y, &amp;z);
    printf("Average = %.2f\\n", average(x, y, z));
    return 0;
}

double average(int a, int b, int c)
{
    double result;
    result = (a + b + c) / 3. ;
    return result;
}</code></pre></li>
<li><strong>Tham số và đối số, nhìn thấy được ngay ở đây</strong> — <code>a, b, c</code> trong định nghĩa là <em>tham số (parameters)</em>; <code>x, y, z</code> ở chỗ gọi là <em>đối số (arguments)</em>. Slide 39 gọi tên sự phân biệt này; ở đây bạn thấy rõ tên của chúng không cần trùng nhau chút nào.</li>
<li><strong>In một số <code>double</code></strong> — <code>%f</code> mặc định in sáu chữ số thập phân; <code>%.2f</code> làm tròn về hai. Dùng <code>%d</code> cho một <code>double</code> là hành vi không xác định và in ra rác — đặc tả định dạng phải khớp kiểu dữ liệu.</li>
<li><strong>Có <code>&amp;</code> trong <code>scanf</code> nhưng không có trong <code>printf</code></strong> — <code>scanf</code> cần <em>địa chỉ</em> của biến để ghi vào; <code>printf</code> chỉ cần giá trị. Quên dấu <code>&amp;</code> thường làm sập lúc chạy, không phải lúc biên dịch.</li>
</ul>
<p class="dap-an">✅ Đã biên dịch bằng <code>cc -Wall -std=c99</code> và chạy. Nhập <code>5 8 10</code> → in ra <strong>Average = 7.67</strong>. Nhập <code>1 2 4</code> → in ra <strong>Average = 2.33</strong>. (Độ chính xác đầy đủ nếu bỏ <code>%.2f</code>: 7.666667 và 2.333333.)</p>
<p class="meo">💡 Để ý <code>main</code> NGẮN đi chứ không dài ra nhờ có <code>average</code>. Đó chính là món lợi của module nêu ở slide 3: "Code Organization: Programs are structured, making them easier to read and maintain". Giờ <code>main</code> đọc như một bản tóm tắt công việc, còn phần tính toán nằm gọn chỗ khác.</p>`],

      [31, 'Function syntax: void function',
        `<p class="y-chinh">🎯 "To identify a function that does not return any value, we specify <code>void</code> for the return data type and <strong>exclude any expression from the return statement</strong>. Alternatively, we can omit the return statement altogether."</p>
<ul>
<li><strong>The syntax</strong> — <code>void functionName([Type param1, Type param2, …]) { // Statements }</code>. Identical to a normal definition except the return type is the keyword <code>void</code> and the body hands nothing back.</li>
<li><strong>Two legal shapes of <code>return</code> in a <code>void</code> function</strong> — write <code>return;</code> (bare, with a semicolon) to leave early, or write no <code>return</code> at all and let control fall off the closing brace. Both are correct C; the slide names both.</li>
<li><strong><code>return value;</code> in a <code>void</code> function is an error</strong> — not a warning, an error. This is the exact thing the phrase "exclude any expression from the return statement" is protecting you from.</li>
<li><strong>The other language's word for it</strong> — "A function that does not return a value is called a <em>subroutine</em> or <em>procedure</em> in other languages." Pascal spells it <code>procedure</code>, Visual Basic <code>Sub</code>, Fortran <code>SUBROUTINE</code>. C chose to have only functions and to mark the no-result case with <code>void</code>.</li>
<li><strong>Why <code>return;</code> early is genuinely useful</strong> — a guard clause. <code>void printDivisors(int n) { if (n &lt;= 0) return; … }</code> rejects nonsense input on line one instead of wrapping the whole body in an <code>if</code>. This does not break the "one exit point" rule from slide 14 in any way that matters: you still leave through the bottom of the function conceptually.</li>
</ul>
<pre><code>void show(int n)
{
    if (n &lt; 0) return;            /* legal: bare return, leaves early */
    printf("%d\\n", n);
}                                 /* legal: no return statement at all */

/* void g(void) { return 7; }     -- ERROR, see below */</code></pre>
<p class="dap-an">✅ Verified by compiling. <code>void f(int n){ if(n&lt;0) return; printf("%d\\n", n); }</code> compiles clean with <code>-Wall</code> and prints <code>3</code> for <code>f(3)</code>, nothing for <code>f(-1)</code>. Adding <code>void g(void){ return 7; }</code> to the same file fails to build: <em>error: void function 'g' should not return a value [-Wreturn-mismatch]</em>. ⚠️ Note the slide says only "exclude any expression" and never shows the error message — so students often assume the compiler tolerates it. It does not.</p>
<p class="pitfall">⚠️ The mirror-image trap on the same slide: <code>void</code> in the <em>parameter</em> position means something completely different. <code>void f(void)</code> = "takes nothing, returns nothing". <code>void f(int n)</code> = "takes an int, returns nothing". <code>int f(void)</code> = "takes nothing, returns an int". Same keyword, two unrelated jobs, decided purely by position. Slide 48 makes "specify <code>void</code> for a function with no parameters" an explicit style rule for exactly this reason.</p>`,
        `<p class="y-chinh">🎯 "To identify a function that does not return any value, we specify <code>void</code> for the return data type and <strong>exclude any expression from the return statement</strong>. Alternatively, we can omit the return statement altogether." — hàm không trả về gì thì kiểu trả về ghi <code>void</code>, và câu <code>return</code> KHÔNG được kèm biểu thức; hoặc bỏ luôn câu <code>return</code>.</p>
<ul>
<li><strong>Cú pháp</strong> — <code>void functionName([Type param1, Type param2, …]) { // Statements }</code>. Giống hệt định nghĩa thường, chỉ khác kiểu trả về là từ khoá <code>void</code> và thân hàm không trả gì về.</li>
<li><strong>Hai dạng <code>return</code> hợp lệ trong hàm <code>void</code></strong> — viết <code>return;</code> (trần trụi, kèm dấu chấm phẩy) để thoát sớm, hoặc không viết <code>return</code> nào cả và để luồng chạy rơi ra khỏi ngoặc nhọn đóng. Cả hai đều đúng chuẩn C; slide nêu cả hai.</li>
<li><strong><code>return giá_trị;</code> trong hàm <code>void</code> là LỖI</strong> — không phải cảnh báo, mà là lỗi biên dịch. Đây đúng là thứ mà câu "exclude any expression from the return statement" đang bảo vệ bạn khỏi.</li>
<li><strong>Ngôn ngữ khác gọi nó là gì</strong> — "A function that does not return a value is called a <em>subroutine</em> or <em>procedure</em> in other languages". Pascal gọi là <code>procedure</code>, Visual Basic là <code>Sub</code>, Fortran là <code>SUBROUTINE</code>. C chọn cách chỉ có một loại là hàm, và đánh dấu trường hợp không có kết quả bằng <code>void</code>.</li>
<li><strong>Vì sao <code>return;</code> sớm thật sự hữu ích</strong> — đó là câu lệnh chốt chặn đầu vào. <code>void printDivisors(int n) { if (n &lt;= 0) return; … }</code> loại bỏ dữ liệu vô lý ngay dòng đầu thay vì bọc cả thân hàm trong một <code>if</code>. Chuyện này không phá luật "một điểm ra" ở slide 14 theo nghĩa đáng kể nào: về mặt khái niệm bạn vẫn ra ở đáy hàm.</li>
</ul>
<pre><code>void show(int n)
{
    if (n &lt; 0) return;            /* hợp lệ: return trần, thoát sớm  */
    printf("%d\\n", n);
}                                 /* hợp lệ: không có câu return nào */

/* void g(void) { return 7; }     -- LỖI, xem bên dưới */</code></pre>
<p class="dap-an">✅ Đã kiểm bằng biên dịch thật. <code>void f(int n){ if(n&lt;0) return; printf("%d\\n", n); }</code> dịch sạch với <code>-Wall</code> và in <code>3</code> khi gọi <code>f(3)</code>, không in gì khi gọi <code>f(-1)</code>. Thêm <code>void g(void){ return 7; }</code> vào cùng file là hỏng build: <em>error: void function 'g' should not return a value [-Wreturn-mismatch]</em>. ⚠️ Lưu ý slide chỉ nói "exclude any expression" và không hề cho xem thông báo lỗi — nên sinh viên hay tưởng trình biên dịch sẽ bỏ qua. Không hề.</p>
<p class="pitfall">⚠️ Cái bẫy soi gương nằm ngay trên cùng slide này: <code>void</code> ở vị trí <em>tham số</em> mang nghĩa hoàn toàn khác. <code>void f(void)</code> = "không nhận gì, không trả gì". <code>void f(int n)</code> = "nhận một int, không trả gì". <code>int f(void)</code> = "không nhận gì, trả về một int". Cùng một từ khoá, hai vai trò chẳng liên quan, phân biệt hoàn toàn bằng VỊ TRÍ. Chính vì thế slide 48 đặt "specify <code>void</code> for a function with no parameters" thành một luật phong cách riêng.</p>`],

      [32, 'void function — Example',
        `<p class="y-chinh">🎯 A runnable <code>void</code> function on screen. The natural example for this deck is <code>printDivisors</code>: it needs data (<code>n</code>) but produces no value — only output.</p>
<ul>
<li><strong>Why this function must be <code>void</code></strong> — it prints a <em>list</em>. A C function can return at most one value, and "1, 2, 3, 4, 6, 12" is not one value. Printing is the only way to deliver many results without arrays, which arrive in Slot 13-15.</li>
<li><strong>The complete program</strong> —
<pre><code>#include &lt;stdio.h&gt;

void printDivisors(int n);

int main(void)
{
    printf("Divisors of 12: ");  printDivisors(12);  printf("\\n");
    printf("Divisors of 7 : ");  printDivisors(7);   printf("\\n");
    printf("Divisors of 30: ");  printDivisors(30);  printf("\\n");
    return 0;
}

void printDivisors(int n)
{
    int i;
    for (i = 1; i &lt;= n; i++)
        if (n % i == 0) printf("%d, ", i);
}</code></pre></li>
<li><strong>The call is a statement, not an expression</strong> — you write <code>printDivisors(12);</code> on a line of its own. You <em>cannot</em> write <code>x = printDivisors(12);</code> or <code>printf("%d", printDivisors(12));</code>; there is no value to assign or print. That is the practical consequence of <code>void</code>.</li>
<li><strong>Where the newline lives</strong> — deliberately in <code>main</code>, not inside the function. That keeps <code>printDivisors</code> reusable: the caller decides the layout. If the function printed its own newline you could never put two lists on one line.</li>
<li><strong>The trailing comma</strong> — the output ends with "12, " because the loop prints a comma after every value including the last. Fixing it needs a condition inside the loop; the slide leaves it, and so do we, because the slide's own sample output has it.</li>
</ul>
<p class="dap-an">✅ Compiled and run, the program prints exactly:<br><code>Divisors of 12: 1, 2, 3, 4, 6, 12, </code><br><code>Divisors of 7 : 1, 7, </code><br><code>Divisors of 30: 1, 2, 3, 5, 6, 10, 15, 30, </code><br>The <code>n = 12</code> line matches the slide 27 promise "n = 12 → Print out values: 1, 2, 3, 4, 6, 12" exactly.</p>
<p class="meo">💡 Quick self-test for "should this be <code>void</code>?": write the sentence "the function <em>gives back</em> ___". If the blank is a single number, a single character, or a single yes/no, give it a return type. If the blank is "some text on the screen" or "nothing", make it <code>void</code>.</p>`,
        `<p class="y-chinh">🎯 Một hàm <code>void</code> chạy được trên màn hình. Ví dụ tự nhiên nhất cho bộ slide này là <code>printDivisors</code>: nó cần dữ liệu (<code>n</code>) nhưng không sinh ra giá trị nào — chỉ sinh ra thứ in ra màn hình.</p>
<ul>
<li><strong>Vì sao hàm này BẮT BUỘC phải là <code>void</code></strong> — nó in ra một <em>danh sách</em>. Một hàm C trả về nhiều nhất một giá trị, mà "1, 2, 3, 4, 6, 12" không phải một giá trị. In ra màn hình là cách duy nhất giao nhiều kết quả khi chưa có mảng — mảng phải đến Slot 13-15 mới học.</li>
<li><strong>Chương trình hoàn chỉnh</strong> —
<pre><code>#include &lt;stdio.h&gt;

void printDivisors(int n);

int main(void)
{
    printf("Divisors of 12: ");  printDivisors(12);  printf("\\n");
    printf("Divisors of 7 : ");  printDivisors(7);   printf("\\n");
    printf("Divisors of 30: ");  printDivisors(30);  printf("\\n");
    return 0;
}

void printDivisors(int n)
{
    int i;
    for (i = 1; i &lt;= n; i++)
        if (n % i == 0) printf("%d, ", i);
}</code></pre></li>
<li><strong>Lời gọi là một CÂU LỆNH, không phải biểu thức</strong> — bạn viết <code>printDivisors(12);</code> đứng riêng một dòng. Bạn KHÔNG viết được <code>x = printDivisors(12);</code> hay <code>printf("%d", printDivisors(12));</code>; làm gì có giá trị nào để gán hay để in. Đó là hệ quả thực tế của <code>void</code>.</li>
<li><strong>Dấu xuống dòng nằm ở đâu</strong> — cố ý đặt trong <code>main</code>, không đặt trong hàm. Nhờ vậy <code>printDivisors</code> vẫn dùng lại được: người gọi quyết định bố cục. Nếu hàm tự in dấu xuống dòng thì bạn không bao giờ đặt được hai danh sách trên cùng một dòng.</li>
<li><strong>Dấu phẩy thừa ở cuối</strong> — kết quả kết thúc bằng "12, " vì vòng lặp in dấu phẩy sau MỌI giá trị, kể cả giá trị cuối. Muốn sửa thì phải thêm điều kiện trong vòng lặp; slide để nguyên, và ta cũng để nguyên, vì chính kết quả mẫu trên slide cũng có dấu phẩy đó.</li>
</ul>
<p class="dap-an">✅ Đã biên dịch và chạy, chương trình in ra đúng:<br><code>Divisors of 12: 1, 2, 3, 4, 6, 12, </code><br><code>Divisors of 7 : 1, 7, </code><br><code>Divisors of 30: 1, 2, 3, 5, 6, 10, 15, 30, </code><br>Dòng <code>n = 12</code> khớp chính xác với lời hứa ở slide 27: "n = 12 → Print out values: 1, 2, 3, 4, 6, 12".</p>
<p class="meo">💡 Cách tự kiểm nhanh "cái này có nên là <code>void</code> không?": viết câu "hàm này <em>giao trả</em> ___". Nếu chỗ trống là một con số, một ký tự, hay một câu trả lời có/không thì cho nó kiểu trả về. Nếu chỗ trống là "mấy dòng chữ trên màn hình" hay "chẳng gì cả" thì để <code>void</code>.</p>`],

      [33, 'main function',
        `<p class="y-chinh">🎯 <code>main()</code> is not a magic word: it is an ordinary function that happens to be the one "to which the operating system transfers control at the start of execution" — "the entry point of a C-program".</p>
<ul>
<li><strong>It returns a value to the OS</strong> — the slide: "main() returns a value to the operating system upon completing execution." That value is the program's <em>exit status</em>. In a terminal you can read it with <code>echo $?</code> after running the program.</li>
<li><strong>0 means success</strong> — "The operating system typically accepts a value of 0 as an indicator of success and may use this value to control subsequent execution of other programs." That is why shell scripts can chain commands: <code>./a &amp;&amp; ./b</code> only runs <code>b</code> if <code>a</code> returned 0. Non-zero means "something went wrong", and which non-zero is up to you.</li>
<li><strong>The implicit <code>int</code></strong> — "C compilers assume an <code>int</code> where we don't provide a return data type." So bare <code>main() { … }</code> is treated as <code>int main() { … }</code>. Historically true, but do not rely on it: modern compilers warn, and C99 removed the general "implicit int" rule from the language.</li>
<li><strong>Which signatures are actually standard</strong> — exactly two: <code>int main(void)</code> and <code>int main(int argc, char *argv[])</code>. The second one receives command-line arguments and belongs to a later slot. <code>void main()</code> is <strong>not</strong> standard C, despite being common in old textbooks and in Turbo C.</li>
<li><strong>main is a module too</strong> — everything from part 3 applies to it. Slide 9 already drew it as "Declare the main module and its data". A good <code>main</code> is a short list of calls: accept, compute, print. If <code>main</code> is 200 lines long, the module analysis has not been done.</li>
</ul>
<pre><code>int main(void)
{
    /* … */
    return 0;        /* 0 = success, the OS reads this */
}</code></pre>
<p class="dap-an">✅ Checked on a real compiler. Since C99, a <code>return</code> at the end of <code>main</code> may be omitted — the standard says reaching the closing brace of <code>main</code> behaves as <code>return 0;</code>. This is the <strong>only</strong> function in C with that privilege; omitting <code>return</code> from any other non-void function only produces a warning and then garbage (proved on slide 44's notes). ⚠️ The slide does not mention that C99 exemption, so write <code>return 0;</code> anyway — it is explicit, always correct, and what the exam expects.</p>
<p class="pitfall">⚠️ "Avoid calling the main function recursively" is a separate rule that slide 48 states explicitly. Calling <code>main()</code> from inside your program is legal C but a terrible idea: it restarts the whole program logically while adding a stack frame physically, so a "menu that loops by calling main again" eventually overflows the stack. Use a <code>while</code> loop.</p>`,
        `<p class="y-chinh">🎯 <code>main()</code> không phải từ thần chú: nó là một hàm bình thường, chỉ có điều nó là hàm "mà hệ điều hành trao quyền điều khiển cho khi bắt đầu chạy" — "the entry point of a C-program".</p>
<ul>
<li><strong>Nó trả một giá trị về cho hệ điều hành</strong> — slide viết: "main() returns a value to the operating system upon completing execution". Giá trị đó là <em>mã thoát</em> của chương trình. Trong terminal bạn đọc nó bằng <code>echo $?</code> ngay sau khi chạy chương trình.</li>
<li><strong>0 nghĩa là thành công</strong> — "The operating system typically accepts a value of 0 as an indicator of success and may use this value to control subsequent execution of other programs". Đó là lý do script shell nối lệnh được với nhau: <code>./a &amp;&amp; ./b</code> chỉ chạy <code>b</code> nếu <code>a</code> trả về 0. Khác 0 nghĩa là "có chuyện", còn khác 0 bằng bao nhiêu thì do bạn quy ước.</li>
<li><strong>Chuyện ngầm hiểu <code>int</code></strong> — "C compilers assume an <code>int</code> where we don't provide a return data type". Tức viết trơ <code>main() { … }</code> thì được hiểu là <code>int main() { … }</code>. Đúng về lịch sử, nhưng đừng dựa vào: trình biên dịch nay cảnh báo, và C99 đã bỏ luật "implicit int" chung ra khỏi ngôn ngữ.</li>
<li><strong>Chữ ký nào mới thật sự chuẩn</strong> — đúng hai cái: <code>int main(void)</code> và <code>int main(int argc, char *argv[])</code>. Cái thứ hai nhận tham số dòng lệnh, thuộc slot sau. <code>void main()</code> <strong>KHÔNG</strong> phải C chuẩn, dù rất phổ biến trong sách cũ và trong Turbo C.</li>
<li><strong>main cũng là một module</strong> — mọi thứ ở phần 3 đều áp dụng cho nó. Slide 9 đã vẽ nó là "Declare the main module and it's data". Một hàm <code>main</code> tốt là một danh sách ngắn các lời gọi: nhập, tính, in. Nếu <code>main</code> dài 200 dòng thì việc phân tích module chưa được làm.</li>
</ul>
<pre><code>int main(void)
{
    /* … */
    return 0;        /* 0 = thành công, hệ điều hành đọc số này */
}</code></pre>
<p class="dap-an">✅ Đã kiểm trên trình biên dịch thật. Từ C99, câu <code>return</code> ở cuối <code>main</code> được phép bỏ — chuẩn quy định chạy tới ngoặc nhọn đóng của <code>main</code> tương đương <code>return 0;</code>. Đây là hàm <strong>DUY NHẤT</strong> trong C có đặc quyền đó; bỏ <code>return</code> ở bất kỳ hàm non-void nào khác chỉ nhận một cảnh báo rồi trả ra rác (đã chứng minh ở ghi chú slide 44). ⚠️ Slide không nhắc tới ngoại lệ C99 này, nên cứ viết <code>return 0;</code> — nó tường minh, luôn đúng, và là thứ đề thi mong đợi.</p>
<p class="pitfall">⚠️ "Avoid calling the main function recursively" là một luật riêng mà slide 48 nêu thẳng. Gọi <code>main()</code> từ trong chương trình là C hợp lệ nhưng là ý tưởng tồi: về mặt logic nó khởi động lại cả chương trình, còn về mặt vật lý nó chồng thêm một khung ngăn xếp, nên một "menu lặp lại bằng cách gọi lại main" sẽ tràn ngăn xếp. Hãy dùng vòng <code>while</code>.</p>`],

      [34, '5 - How to implement a function? (section divider)',
        `<p class="y-chinh">🎯 Section break. You now know the <em>syntax</em> of a function (slides 27–33). Part 5 is about the <em>method</em>: how to get from a sentence in Vietnamese or English to a compiling C function.</p>
<ul>
<li><strong>What changes here</strong> — up to now the deck showed you finished functions. From slide 35 it shows you the procedure for producing one, and slides 36–37 show you how to judge whether what you produced is any good.</li>
<li><strong>Why a procedure is needed at all</strong> — the hard part of writing a function is never the braces. It is deciding what the function is called, what it takes, and what it gives back — three decisions you must make <em>before</em> the first line of body.</li>
<li><strong>The three slides ahead</strong> — 35 is the recipe (state the task → pick the return type → pick the parameters → write the steps → translate to C), 36 evaluates cohesion ("this function contains a sub-task → low cohesive"), 37 evaluates coupling ("this function accesses outside data → rather coupling").</li>
<li><strong>Connection back to part 3</strong> — cohesion and coupling were abstract design words on slides 16–20. Here they become a two-item checklist you run over code you have already written. That is the most useful form of them.</li>
<li><strong>The exam angle</strong> — a very common question shows you a function and asks "what is wrong with this design?". The two acceptable answers are almost always "it does two things" (cohesion) or "it touches a global" (coupling). Slides 36 and 37 are those two answers.</li>
</ul>
<p class="meo">💡 Before writing any function, finish this one sentence out loud: "<em>verb</em> the <em>noun</em>, given <em>these</em>, giving back <em>that</em>." If you cannot finish it, you do not yet know what function you are writing — and no amount of typing will fix that.</p>`,
        `<p class="y-chinh">🎯 Slide phân mục. Bạn đã biết <em>cú pháp</em> của hàm (slide 27–33). Phần 5 nói về <em>phương pháp</em>: đi từ một câu nói tiếng Việt hay tiếng Anh tới một hàm C dịch được.</p>
<ul>
<li><strong>Chỗ này đổi gì</strong> — tới giờ bộ slide cho bạn xem các hàm đã viết xong. Từ slide 35 nó cho xem quy trình tạo ra một hàm, còn slide 36–37 cho xem cách đánh giá thứ bạn vừa tạo ra có ra gì không.</li>
<li><strong>Vì sao cần hẳn một quy trình</strong> — phần khó của việc viết hàm chưa bao giờ là cặp ngoặc nhọn. Nó là chuyện quyết định hàm tên gì, nhận gì, trả gì — ba quyết định phải làm <em>trước</em> dòng đầu tiên của thân hàm.</li>
<li><strong>Ba slide phía trước</strong> — 35 là công thức (nêu rõ việc → chọn kiểu trả về → chọn tham số → viết các bước → dịch sang C), 36 đánh giá cohesion ("hàm này chứa một việc con → kém gắn kết"), 37 đánh giá coupling ("hàm này chạm vào dữ liệu bên ngoài → khá ràng buộc").</li>
<li><strong>Nối ngược về phần 3</strong> — cohesion và coupling là những chữ thiết kế trừu tượng ở slide 16–20. Ở đây chúng thành một danh sách hai mục để bạn soi lên code mình vừa viết. Đó là dạng hữu dụng nhất của chúng.</li>
<li><strong>Góc nhìn đề thi</strong> — một câu hỏi rất hay gặp là đưa bạn xem một hàm rồi hỏi "thiết kế này sai ở đâu?". Hai đáp án chấp nhận được gần như luôn là "nó làm hai việc" (cohesion) hoặc "nó chạm vào biến toàn cục" (coupling). Slide 36 và 37 chính là hai đáp án đó.</li>
</ul>
<p class="meo">💡 Trước khi viết bất kỳ hàm nào, hãy nói trọn thành tiếng câu này: "<em>động từ</em> cái <em>danh từ</em>, cho trước <em>những thứ này</em>, trả lại <em>thứ kia</em>". Nếu bạn không nói trọn được thì bạn chưa biết mình đang viết hàm gì — và gõ bao nhiêu cũng không sửa được chuyện đó.</p>`],

      [35, 'How to implement a function?',
        `<p class="y-chinh">🎯 The recipe, in the order the slide prints it: <strong>state the task clearly (Verb + nouns) → choose the return type → name it → list the necessary data as parameters → write the steps → translate the steps to C</strong>.</p>
<ul>
<li><strong>"State the task clearly: Verb + nouns (Objects)"</strong> — and the slide's test for "clearly": "A task is described clearly if the receiver does not need to ask anything." If a classmate reading your one-sentence description would have to ask "sum of what?" or "print in what order?", the sentence is not finished, and neither is your design.</li>
<li><strong>The verbs the slide suggests</strong> — <em>Find, Compute, Count, Check, Others</em>. These map straight onto return types: <em>Find/Compute</em> → a number (<code>int</code>, <code>double</code>, <code>long</code>); <em>Count</em> → an <code>int</code>; <em>Check</em> → 1 or 0 (an <code>int</code> used as a flag); everything else, often <code>void</code>.</li>
<li><strong>"Give values to the parameters; carry out the work yourself; write down steps; translate steps to C"</strong> — the four-line method in the middle of the slide. The crucial one is the second: do the task <em>by hand</em> with concrete numbers first. You cannot code an algorithm you have never performed.</li>
<li><strong>Worked through on the deck's own example</strong> — task: "compute the sum of divisors of a positive integer n". Verb = compute → returns a number → <code>int</code>. Nouns = the integer n → one parameter <code>int n</code>. By hand with n = 12: try 1 (divides, total 1), 2 (total 3), 3 (total 6), 4 (total 10), 5 (no), 6 (total 16), …, 12 (total 28). The by-hand run just told you the loop bounds and the accumulator.</li>
<li><strong>Translate, don't invent</strong> — "try every i from 1 to n; if i divides n, add it" is four English words away from <code>for (i=1; i&lt;=n; i++) if (n%i==0) s += i;</code>. When the C is hard to write, it is usually because the English step was still vague.</li>
</ul>
<pre><code>/* Verb: compute.  Nouns: sum, divisors, n.  Returns: a number. */
int sumDivisors(int n)
{
    int i, s = 0;
    for (i = 1; i &lt;= n; i++)
        if (n % i == 0)
            s = s + i;
    return s;
}</code></pre>
<p class="dap-an">✅ The hand-run above predicted 28 for n = 12; compiled and run, the function returns <strong>28</strong>. Two more checks: n = 6 → <strong>12</strong> and n = 28 → <strong>56</strong>. Both are perfect numbers, where the sum of divisors is exactly twice the number — a free correctness test you can do without a computer.</p>
<p class="meo">💡 Use the by-hand run as your test data. You already know the right answer for n = 12 before you compile; if the program says anything but 28 you have a bug, not a surprise. Writing down the expected answer <em>before</em> running is the difference between testing and hoping.</p>`,
        `<p class="y-chinh">🎯 Công thức, theo đúng thứ tự slide in ra: <strong>nêu rõ việc cần làm (Động từ + danh từ) → chọn kiểu trả về → đặt tên → liệt kê dữ liệu cần thiết thành tham số → viết các bước → dịch các bước sang C</strong>.</p>
<ul>
<li><strong>"State the task clearly: Verb + nouns (Objects)"</strong> — và phép thử của slide cho chữ "rõ ràng": "A task is described clearly if the receiver does not need to ask any thing" — mô tả rõ khi người nhận không phải hỏi lại gì. Nếu bạn cùng lớp đọc câu mô tả một dòng của bạn mà còn phải hỏi "tổng của cái gì?" hay "in theo thứ tự nào?" thì câu đó chưa xong, và thiết kế của bạn cũng chưa xong.</li>
<li><strong>Các động từ slide gợi ý</strong> — <em>Find, Compute, Count, Check, Others</em> (tìm, tính, đếm, kiểm tra, khác). Chúng ánh xạ thẳng sang kiểu trả về: <em>tìm/tính</em> → một con số (<code>int</code>, <code>double</code>, <code>long</code>); <em>đếm</em> → một <code>int</code>; <em>kiểm tra</em> → 1 hoặc 0 (một <code>int</code> dùng làm cờ); còn lại thường là <code>void</code>.</li>
<li><strong>"Give values to the parameters; carry out the work with yourself; write down steps; translate steps to C"</strong> — phương pháp bốn dòng ở giữa slide. Dòng quan trọng nhất là dòng thứ hai: hãy làm việc đó <em>bằng tay</em> với số cụ thể trước đã. Bạn không code nổi một thuật toán mà chính bạn chưa từng thực hiện.</li>
<li><strong>Chạy thử trên chính ví dụ của bộ slide</strong> — việc: "tính tổng các ước của số nguyên dương n". Động từ = tính → trả về một con số → <code>int</code>. Danh từ = số nguyên n → một tham số <code>int n</code>. Làm tay với n = 12: thử 1 (chia hết, tổng 1), 2 (tổng 3), 3 (tổng 6), 4 (tổng 10), 5 (không), 6 (tổng 16), …, 12 (tổng 28). Lần làm tay đó vừa nói cho bạn biết cận vòng lặp và biến cộng dồn.</li>
<li><strong>Dịch, đừng sáng tác</strong> — "thử mọi i từ 1 tới n; nếu i chia hết n thì cộng vào" chỉ cách <code>for (i=1; i&lt;=n; i++) if (n%i==0) s += i;</code> đúng vài chữ. Khi code C khó viết ra thì thường là vì bước tiếng Việt vẫn còn mơ hồ.</li>
</ul>
<pre><code>/* Động từ: tính.  Danh từ: tổng, các ước, n.  Trả về: một con số. */
int sumDivisors(int n)
{
    int i, s = 0;
    for (i = 1; i &lt;= n; i++)
        if (n % i == 0)
            s = s + i;
    return s;
}</code></pre>
<p class="dap-an">✅ Lần làm tay ở trên dự đoán 28 với n = 12; biên dịch và chạy thật, hàm trả về <strong>28</strong>. Kiểm thêm hai ca: n = 6 → <strong>12</strong> và n = 28 → <strong>56</strong>. Cả hai đều là số hoàn hảo, nên tổng các ước đúng bằng hai lần chính nó — một phép kiểm đúng sai miễn phí, làm được mà không cần máy tính.</p>
<p class="meo">💡 Hãy lấy lần làm tay làm dữ liệu thử. Bạn đã biết đáp án đúng cho n = 12 TRƯỚC khi biên dịch; nếu chương trình nói khác 28 thì đó là bug, không phải bất ngờ. Viết đáp án mong đợi ra giấy <em>trước</em> khi chạy chính là khác biệt giữa kiểm thử và cầu may.</p>`],

      [36, 'Evaluate the functions — cohesion ("contains a sub-task")',
        `<p class="y-chinh">🎯 First evaluation criterion: "This function contains a sub-task → <strong>low cohesive</strong>." The fix is to lift the sub-task out into its own function.</p>
<ul>
<li><strong>The symptom</strong> — you can describe the function only with the word "and". "Check whether n is prime <em>and</em> print the result." Two verbs joined by "and" is exactly the "Coincidental / Logical" low cohesion of slide 17.</li>
<li><strong>Why it hurts</strong> — slide 17 already told you: "In the case of the operation for summing of n is not used, this module can not be applied." A function that checks and prints cannot be used where you need only the answer — inside an <code>if</code>, inside a counter, inside another calculation. It is unusable everywhere except one screen.</li>
<li><strong>The slide's testing convention</strong> — "Functions for testing will return <strong>1 for true and 0 for false</strong>." That is the C convention (C89 has no <code>bool</code>) and it is why a <code>Check…</code> function is an <code>int</code> function, not a <code>void</code> one.</li>
<li><strong>The slide's testing algorithm</strong> — "Common algorithm in testing is checking all cases which cause FALSE. TRUE is accepted when no case causes FALSE." That is a genuinely important pattern: loop, <code>return 0;</code> the instant you find a counter-example, and <code>return 1;</code> only after the loop finishes untouched. Do <em>not</em> write <code>else return 1;</code> inside the loop — that answers after examining one value.</li>
<li><strong>Before and after</strong> —
<pre><code>/* low cohesion: checks AND prints */
void checkAndPrintPrime(int n) {
    int i, ok = 1;
    if (n &lt; 2) ok = 0;
    for (i = 2; i * i &lt;= n; i++)
        if (n % i == 0) { ok = 0; break; }
    if (ok) printf("%d is a prime\\n", n);
    else    printf("%d is not a prime\\n", n);
}

/* better: one job, returns 1/0 — "check all cases which cause FALSE" */
int isPrime(int n) {
    int i;
    if (n &lt; 2) return 0;                    /* a FALSE case */
    for (i = 2; i * i &lt;= n; i++)
        if (n % i == 0) return 0;           /* a FALSE case */
    return 1;                               /* no FALSE case found */
}</code></pre></li>
</ul>
<p class="dap-an">✅ Both compiled and run. <code>checkAndPrintPrime(29)</code> prints "29 is a prime", <code>checkAndPrintPrime(30)</code> prints "30 is not a prime". The cohesive version returns <code>isPrime(29) = 1</code>, <code>isPrime(30) = 0</code>, <code>isPrime(1) = 0</code>, <code>isPrime(2) = 1</code>. Only the second version can be used as <code>if (isPrime(v)) count++;</code> — which is exactly what slide 57 needs when it prints the first n primes.</p>
<p class="meo">💡 The loop bound <code>i * i &lt;= n</code> is not a trick: if <code>n = a*b</code> with both factors above the square root then <code>a*b &gt; n</code>, a contradiction — so one factor is always at or below <code>sqrt(n)</code>. For n = 1 000 000 that is 1 000 trips instead of a million.</p>`,
        `<p class="y-chinh">🎯 Tiêu chí đánh giá thứ nhất: "This function contains a sub-task → <strong>low cohesive</strong>" — hàm này chứa một việc con nên kém gắn kết. Cách sửa là nhấc việc con ra thành một hàm riêng.</p>
<ul>
<li><strong>Triệu chứng</strong> — bạn chỉ mô tả được hàm bằng chữ "và". "Kiểm tra n có phải số nguyên tố không <em>và</em> in kết quả ra". Hai động từ nối bằng "và" chính là loại cohesion thấp "Coincidental / Logical" ở slide 17.</li>
<li><strong>Vì sao nó hại</strong> — slide 17 đã nói rồi: "In the case of the operation for summing of n is not used, this module can not be applied". Một hàm vừa kiểm tra vừa in thì không dùng được ở chỗ bạn chỉ cần đáp án — trong một <code>if</code>, trong một biến đếm, trong một phép tính khác. Nó vô dụng ở mọi nơi trừ đúng một màn hình.</li>
<li><strong>Quy ước kiểm tra trên slide</strong> — "Functions for testing will return <strong>1 for true and 0 for false</strong>". Đó là quy ước của C (C89 không có kiểu <code>bool</code>) và cũng là lý do một hàm dạng <code>Check…</code> phải là hàm <code>int</code>, không phải <code>void</code>.</li>
<li><strong>Thuật toán kiểm tra trên slide</strong> — "Common algorithm in testing is checking all cases which cause FALSE. TRUE is accept when no case cause FALSE" — duyệt mọi trường hợp làm cho SAI; chỉ khi không có trường hợp nào làm SAI thì mới nhận ĐÚNG. Đây là một mẫu rất đáng nhớ: lặp, <code>return 0;</code> ngay khi tìm được một phản ví dụ, và <code>return 1;</code> chỉ sau khi vòng lặp chạy hết mà không bị chặn. TUYỆT ĐỐI đừng viết <code>else return 1;</code> bên trong vòng lặp — như thế là kết luận sau khi mới xét một giá trị.</li>
<li><strong>Trước và sau</strong> —
<pre><code>/* kém gắn kết: vừa KIỂM TRA vừa IN */
void checkAndPrintPrime(int n) {
    int i, ok = 1;
    if (n &lt; 2) ok = 0;
    for (i = 2; i * i &lt;= n; i++)
        if (n % i == 0) { ok = 0; break; }
    if (ok) printf("%d is a prime\\n", n);
    else    printf("%d is not a prime\\n", n);
}

/* tốt hơn: một việc, trả về 1/0 — "duyệt mọi ca làm cho SAI" */
int isPrime(int n) {
    int i;
    if (n &lt; 2) return 0;                    /* một ca SAI */
    for (i = 2; i * i &lt;= n; i++)
        if (n % i == 0) return 0;           /* một ca SAI */
    return 1;                               /* không tìm thấy ca SAI nào */
}</code></pre></li>
</ul>
<p class="dap-an">✅ Cả hai đã biên dịch và chạy. <code>checkAndPrintPrime(29)</code> in "29 is a prime", <code>checkAndPrintPrime(30)</code> in "30 is not a prime". Bản gắn kết trả về <code>isPrime(29) = 1</code>, <code>isPrime(30) = 0</code>, <code>isPrime(1) = 0</code>, <code>isPrime(2) = 1</code>. Chỉ bản thứ hai dùng được dưới dạng <code>if (isPrime(v)) count++;</code> — đúng thứ mà slide 57 cần khi in n số nguyên tố đầu tiên.</p>
<p class="meo">💡 Cận vòng lặp <code>i * i &lt;= n</code> không phải mẹo vặt: nếu <code>n = a*b</code> mà cả hai thừa số đều lớn hơn căn bậc hai thì <code>a*b &gt; n</code>, mâu thuẫn — nên luôn có một thừa số nhỏ hơn hoặc bằng <code>sqrt(n)</code>. Với n = 1 000 000 thì đó là 1 000 vòng thay vì một triệu vòng.</p>`],

      [37, 'Evaluate the functions — coupling ("accesses outside data")',
        `<p class="y-chinh">🎯 Second evaluation criterion: "This function <strong>accesses outside data</strong> → rather coupling." The fix is to pass that data in as a parameter instead.</p>
<ul>
<li><strong>The symptom</strong> — the function uses a variable it never declared and never received. That variable is a global, declared above all the functions, and slide 15 already flagged this: "Some modules access a common data is not encouraged. All modules should be self-contained (independent)."</li>
<li><strong>Why it hurts, concretely</strong> — a function reading a global can only ever work on <em>one</em> value at a time. <code>sumDivisorsGlobal()</code> that reads the global <code>n</code> cannot be called twice with different numbers in the same expression, cannot be tested without setting up global state first, and quietly breaks when someone else changes <code>n</code> for their own reasons.</li>
<li><strong>Before and after</strong> —
<pre><code>int n;                                /* global — high coupling */
int sumDivisorsGlobal(void) {         /* where does n come from?     */
    int i, s = 0;
    for (i = 1; i &lt;= n; i++) if (n % i == 0) s += i;
    return s;
}

int sumDivisors(int k) {              /* better: data comes IN       */
    int i, s = 0;
    for (i = 1; i &lt;= k; i++) if (k % i == 0) s += i;
    return s;
}</code></pre></li>
<li><strong>Read the call sites</strong> — with the global version you must write two statements, <code>n = 12; printf("%d", sumDivisorsGlobal());</code>, and the reader has to hunt for where <code>n</code> was last set. With the parameter version you write <code>printf("%d", sumDivisors(12));</code> and everything you need to understand it is on that one line.</li>
<li><strong>The classification from slide 20</strong> — that slide ranked coupling from low to high: <em>Data</em> (lowest, just values passed in), <em>Control</em>, <em>External</em>, <em>Common</em> (a global set of data), <em>Content</em> (highest, reaching into another module's internals). Reading a global is the "Common" level — near the bad end.</li>
<li><strong>Where globals are still fine</strong> — read-only configuration, <code>const</code> tables, counters used by the whole program. The slide's own wording on slide 61 is measured: "<em>If possible</em>, do not use global variables because they can cause high coupling in functions."</li>
</ul>
<p class="dap-an">✅ Both compiled and run in one program. With <code>n = 12</code>, <code>sumDivisorsGlobal()</code> returns <strong>28</strong> — the same answer as <code>sumDivisors(12)</code>. The parameterised version additionally computes <code>sumDivisors(28) = 56</code> and <code>sumDivisors(496) = 992</code> in the same <code>printf</code>; the global version cannot do that at all without three assignments and three statements. Same result, different reusability — that is precisely what "coupling" measures.</p>
<p class="pitfall">⚠️ Do not confuse "outside data" with "a local variable of the same name". Slide 64 shows two variables both called <code>input</code>, one inside a function and one outside; they are different variables and the rule is "<strong>Local first, Global later</strong>". So a function can <em>look</em> like it touches a global while actually shadowing it — which is worse, because the global silently stops being updated.</p>`,
        `<p class="y-chinh">🎯 Tiêu chí đánh giá thứ hai: "This function <strong>accesses outside data</strong> → rather coupling" — hàm này chạm vào dữ liệu bên ngoài nên khá ràng buộc. Cách sửa là truyền dữ liệu đó vào bằng tham số.</p>
<ul>
<li><strong>Triệu chứng</strong> — hàm dùng một biến mà nó không hề khai báo và cũng không hề nhận vào. Biến đó là biến toàn cục, khai báo ở trên tất cả các hàm, và slide 15 đã cảnh báo rồi: "Some modules access a common data is not encouraged. All modules should be self-contained (independent)".</li>
<li><strong>Nó hại ở đâu, nói cụ thể</strong> — hàm đọc biến toàn cục thì chỉ làm việc được với <em>một</em> giá trị tại một thời điểm. Hàm <code>sumDivisorsGlobal()</code> đọc biến toàn cục <code>n</code> không gọi được hai lần với hai số khác nhau trong cùng một biểu thức, không kiểm thử được nếu chưa dựng sẵn trạng thái toàn cục, và hỏng âm thầm khi người khác đổi <code>n</code> vì lý do của họ.</li>
<li><strong>Trước và sau</strong> —
<pre><code>int n;                                /* toàn cục — ràng buộc cao */
int sumDivisorsGlobal(void) {         /* n ở đâu ra vậy?          */
    int i, s = 0;
    for (i = 1; i &lt;= n; i++) if (n % i == 0) s += i;
    return s;
}

int sumDivisors(int k) {              /* tốt hơn: dữ liệu đi VÀO  */
    int i, s = 0;
    for (i = 1; i &lt;= k; i++) if (k % i == 0) s += i;
    return s;
}</code></pre></li>
<li><strong>Hãy đọc chỗ GỌI hàm</strong> — với bản toàn cục bạn phải viết hai câu lệnh, <code>n = 12; printf("%d", sumDivisorsGlobal());</code>, và người đọc phải đi truy xem <code>n</code> được gán lần cuối ở đâu. Với bản có tham số bạn viết <code>printf("%d", sumDivisors(12));</code> và mọi thứ cần để hiểu nó đều nằm trên đúng dòng đó.</li>
<li><strong>Bảng phân loại ở slide 20</strong> — slide đó xếp coupling từ thấp lên cao: <em>Data</em> (thấp nhất, chỉ là giá trị truyền vào), <em>Control</em>, <em>External</em>, <em>Common</em> (một tập dữ liệu toàn cục), <em>Content</em> (cao nhất, thò tay vào ruột module khác). Đọc biến toàn cục là mức "Common" — gần đầu xấu.</li>
<li><strong>Biến toàn cục vẫn ổn ở đâu</strong> — cấu hình chỉ đọc, bảng <code>const</code>, bộ đếm dùng chung cho cả chương trình. Chính lời slide 61 cũng chừng mực: "<em>If possible</em>, do not use global variables because they can cause high coupling in functions" — nếu có thể thì đừng dùng.</li>
</ul>
<p class="dap-an">✅ Cả hai đã biên dịch và chạy trong cùng một chương trình. Với <code>n = 12</code>, <code>sumDivisorsGlobal()</code> trả về <strong>28</strong> — cùng đáp số với <code>sumDivisors(12)</code>. Bản có tham số còn tính thêm <code>sumDivisors(28) = 56</code> và <code>sumDivisors(496) = 992</code> trong cùng một <code>printf</code>; bản toàn cục hoàn toàn không làm nổi việc đó nếu không tách thành ba lần gán và ba câu lệnh. Cùng kết quả, khác hẳn khả năng dùng lại — đó chính xác là thứ "coupling" đo được.</p>
<p class="pitfall">⚠️ Đừng lẫn "dữ liệu bên ngoài" với "một biến cục bộ trùng tên". Slide 64 cho xem hai biến cùng tên <code>input</code>, một nằm trong hàm một nằm ngoài; chúng là hai biến khác nhau và luật là "<strong>Local first, Global later</strong>" — cục bộ trước, toàn cục sau. Nên một hàm có thể <em>trông như</em> đang chạm biến toàn cục trong khi thật ra nó che mất biến đó — và như thế còn tệ hơn, vì biến toàn cục âm thầm ngừng được cập nhật.</p>`],

      [38, '6 - How to use a function? (section divider)',
        `<p class="y-chinh">🎯 Section break. Parts 4 and 5 were about <em>writing</em> a function. Part 6 is about <em>calling</em> one — and the deck immediately makes it practical: slide 39 gives the syntax, slides 40–43 make you use it.</p>
<ul>
<li><strong>Why calling deserves its own part</strong> — three separate things go wrong at the call site and nowhere else: passing the wrong number of arguments, passing them in the wrong order, and ignoring a return value. None of those are visible when you read the function's own definition.</li>
<li><strong>The vocabulary this part introduces</strong> — <em>parameter</em> vs <em>argument</em>. Slide 39 defines them explicitly, and the distinction is exam material: parameters are the names in the definition, arguments are the values at the call.</li>
<li><strong>The four slides ahead</strong> — 39 is the syntax and the built-in vs user-defined distinction; 40–41 are Practice 1 with a full worked solution; 42 is Exercise 1 (sum of divisors); 43 is Exercise 2 (parallel resistances).</li>
<li><strong>Built-in functions you have already been calling</strong> — <code>printf</code>, <code>scanf</code>, <code>system</code>, <code>sqrt</code>. Slide 9 drew this out: <code>scanf</code> and <code>printf</code> live in <code>stdio.h</code>, <code>system</code> lives in <code>stdlib.h</code>. Calling your own function uses exactly the same syntax as calling theirs — that is the point of the whole design.</li>
<li><strong>Do the exercises, don't read them</strong> — slides 42 and 43 are labelled "Exercise" because the deck expects you to type them. Below, both are solved completely, but write your own version first and then compare.</li>
</ul>
<p class="meo">💡 The test of whether you truly understand a function is not "can I read its body?" but "can I call it correctly without reading its body?". If the header and the name are enough — <code>int sumDivisors(int n)</code> — the function is well designed. That is what slide 48's style rules are protecting.</p>`,
        `<p class="y-chinh">🎯 Slide phân mục. Phần 4 và 5 nói về chuyện <em>viết</em> một hàm. Phần 6 nói về chuyện <em>gọi</em> hàm — và bộ slide lập tức chuyển sang thực hành: slide 39 cho cú pháp, slide 40–43 bắt bạn dùng.</p>
<ul>
<li><strong>Vì sao chuyện gọi hàm xứng đáng một phần riêng</strong> — có ba thứ chỉ hỏng ở chỗ gọi hàm chứ không hỏng ở đâu khác: truyền sai số lượng đối số, truyền sai thứ tự, và bỏ quên giá trị trả về. Không cái nào trong ba cái đó nhìn thấy được khi bạn đọc định nghĩa của hàm.</li>
<li><strong>Từ vựng phần này đưa ra</strong> — <em>tham số (parameter)</em> so với <em>đối số (argument)</em>. Slide 39 định nghĩa rõ ràng, và sự phân biệt này là nội dung thi: tham số là các TÊN trong định nghĩa, đối số là các GIÁ TRỊ ở chỗ gọi.</li>
<li><strong>Bốn slide phía trước</strong> — 39 là cú pháp cùng sự phân biệt hàm thư viện với hàm tự viết; 40–41 là Practice 1 kèm lời giải đầy đủ; 42 là Exercise 1 (tổng các ước); 43 là Exercise 2 (điện trở song song).</li>
<li><strong>Những hàm thư viện bạn đã gọi từ lâu</strong> — <code>printf</code>, <code>scanf</code>, <code>system</code>, <code>sqrt</code>. Slide 9 đã vẽ ra: <code>scanf</code> và <code>printf</code> nằm trong <code>stdio.h</code>, <code>system</code> nằm trong <code>stdlib.h</code>. Gọi hàm của chính bạn dùng đúng cú pháp như gọi hàm của họ — đó chính là ý đồ của toàn bộ thiết kế này.</li>
<li><strong>Hãy LÀM bài tập, đừng đọc</strong> — slide 42 và 43 ghi chữ "Exercise" vì bộ slide mong bạn gõ chúng ra. Bên dưới cả hai đều được giải trọn vẹn, nhưng hãy tự viết bản của mình trước rồi mới đối chiếu.</li>
</ul>
<p class="meo">💡 Phép thử xem bạn thật sự hiểu một hàm chưa không phải là "tôi có đọc được thân hàm không?" mà là "tôi có gọi đúng được mà KHÔNG cần đọc thân hàm không?". Nếu đầu hàm và cái tên là đủ — <code>int sumDivisors(int n)</code> — thì hàm đó thiết kế tốt. Đó chính là thứ mà các luật phong cách ở slide 48 đang bảo vệ.</p>`],

      [39, 'How to use a function?',
        `<p class="y-chinh">🎯 Calling syntax in one line: <code>functionIdentifier(argument1, argument2, …);</code> — and the distinction the slide makes you learn: <strong>parameters</strong> are names in the implementation, <strong>arguments</strong> are data used at the call.</p>
<ul>
<li><strong>"You can use either the built-in library functions or your own functions"</strong> — and the syntax is identical. <code>printf("hi")</code> and <code>printDivisors(12)</code> are the same kind of construct; only where the definition lives differs.</li>
<li><strong>"If you use the built-in library functions, your program needs to begin with the necessary include file"</strong> — this is the link to slide 46. <code>printf</code> needs <code>#include &lt;stdio.h&gt;</code>; <code>sqrt</code> needs <code>&lt;math.h&gt;</code>; <code>system</code> needs <code>&lt;stdlib.h&gt;</code>. Without the include, the compiler has never heard of the name.</li>
<li><strong>Parameters vs arguments, the exam-safe version</strong> —
<pre><code>double average(int a, int b, int c)   /* a, b, c are PARAMETERS */
{ return (a + b + c) / 3.0; }

int x = 5, y = 8, z = 10;
printf("%f\\n", average(x, y, z));     /* x, y, z are ARGUMENTS  */
printf("%f\\n", average(1, 2, 3));     /* so are 1, 2, 3         */</code></pre>
Arguments do not have to be variables — literals, expressions, even other function calls (<code>average(x, y, sumDivisors(6))</code>) are all fine, because an argument is just a <em>value</em>.</li>
<li><strong>Order is everything, names are nothing</strong> — the matching is positional. The first argument fills the first parameter, whatever they are called. <code>average(z, y, x)</code> compiles perfectly and quietly computes something else. C has no named arguments.</li>
<li><strong>Using the returned value</strong> — a non-<code>void</code> call is an expression, so it can be assigned (<code>s = sumDivisors(12);</code>), printed (<code>printf("%d", sumDivisors(12));</code>), compared (<code>if (sumDivisors(n) == 2*n)</code>), or thrown away (<code>sumDivisors(12);</code> — legal, and completely pointless).</li>
</ul>
<p class="dap-an">✅ Verified by compiling. <code>average(x,y,z)</code> with x=5, y=8, z=10 prints <strong>7.666667</strong>; the parameters are still called a, b, c inside, and nothing goes wrong — the names are independent. Also verified: writing <code>average(5, 8)</code> with only two arguments is a hard error, <em>"too few arguments to function call, expected 3, have 2"</em> — <strong>provided a prototype or the definition is visible</strong>, which is exactly why slide 44 exists.</p>
<p class="pitfall">⚠️ Two argument mistakes the compiler will <em>not</em> save you from. (1) Right count, wrong order: <code>equivalent(r3, r1, r2)</code> compiles silently. (2) Right count, convertible type: passing <code>3</code> where a <code>double</code> is expected is silently converted to 3.0 — helpful here, but the same rule turns <code>7.9</code> into <code>7</code> when the parameter is an <code>int</code>. Check argument order and types by reading the header, not by trusting the build.</p>`,
        `<p class="y-chinh">🎯 Cú pháp gọi hàm gói trong một dòng: <code>functionIdentifier(argument1, argument2, …);</code> — và sự phân biệt slide bắt bạn học: <strong>parameters (tham số)</strong> là các tên trong phần hiện thực, <strong>arguments (đối số)</strong> là dữ liệu dùng lúc gọi.</p>
<ul>
<li><strong>"You can use either the built-in library functions or your own functions"</strong> — và cú pháp y hệt nhau. <code>printf("hi")</code> và <code>printDivisors(12)</code> là cùng một loại cấu trúc; chỉ khác chỗ định nghĩa nằm ở đâu.</li>
<li><strong>"If you use the built-in library functions, your program needs to begin with the necessary include file"</strong> — đây là mối nối sang slide 46. <code>printf</code> cần <code>#include &lt;stdio.h&gt;</code>; <code>sqrt</code> cần <code>&lt;math.h&gt;</code>; <code>system</code> cần <code>&lt;stdlib.h&gt;</code>. Không có dòng include thì trình biên dịch chưa từng nghe tới cái tên đó.</li>
<li><strong>Tham số và đối số, bản an toàn cho đề thi</strong> —
<pre><code>double average(int a, int b, int c)   /* a, b, c là THAM SỐ */
{ return (a + b + c) / 3.0; }

int x = 5, y = 8, z = 10;
printf("%f\\n", average(x, y, z));     /* x, y, z là ĐỐI SỐ   */
printf("%f\\n", average(1, 2, 3));     /* 1, 2, 3 cũng vậy    */</code></pre>
Đối số không nhất thiết phải là biến — hằng số, biểu thức, thậm chí lời gọi hàm khác (<code>average(x, y, sumDivisors(6))</code>) đều được, vì đối số chỉ là một <em>giá trị</em>.</li>
<li><strong>Thứ tự quyết định tất cả, tên chẳng là gì</strong> — việc khớp diễn ra theo VỊ TRÍ. Đối số thứ nhất điền vào tham số thứ nhất, bất kể chúng tên gì. <code>average(z, y, x)</code> dịch ngon lành và lặng lẽ tính ra thứ khác. C không có đối số theo tên.</li>
<li><strong>Dùng giá trị trả về</strong> — lời gọi hàm non-<code>void</code> là một biểu thức, nên nó gán được (<code>s = sumDivisors(12);</code>), in được (<code>printf("%d", sumDivisors(12));</code>), so sánh được (<code>if (sumDivisors(n) == 2*n)</code>), hoặc vứt đi (<code>sumDivisors(12);</code> — hợp lệ, và hoàn toàn vô nghĩa).</li>
</ul>
<p class="dap-an">✅ Đã kiểm bằng biên dịch. <code>average(x,y,z)</code> với x=5, y=8, z=10 in ra <strong>7.666667</strong>; bên trong tham số vẫn tên là a, b, c và chẳng có gì sai — các tên độc lập với nhau. Kiểm thêm: viết <code>average(5, 8)</code> với chỉ hai đối số là lỗi cứng, <em>"too few arguments to function call, expected 3, have 2"</em> — <strong>với điều kiện prototype hoặc định nghĩa đã nhìn thấy được</strong>, đó đúng là lý do slide 44 tồn tại.</p>
<p class="pitfall">⚠️ Hai lỗi đối số mà trình biên dịch <em>không</em> cứu bạn. (1) Đúng số lượng, sai thứ tự: <code>equivalent(r3, r1, r2)</code> dịch im lặng. (2) Đúng số lượng, kiểu chuyển được: truyền <code>3</code> vào chỗ cần <code>double</code> thì bị chuyển âm thầm thành 3.0 — ở đây thì tiện, nhưng đúng luật đó biến <code>7.9</code> thành <code>7</code> khi tham số là <code>int</code>. Hãy kiểm thứ tự và kiểu đối số bằng cách ĐỌC ĐẦU HÀM, đừng tin vào việc build xanh.</p>`],

      [40, 'Practice 1 — analyse and write printDivisors',
        `<p class="y-chinh">🎯 Practice 1: "Develop a program that will perform the following task <strong>three times</strong>: accept a positive integer; print out its divisors." The slide does the analysis for you and hands you the function.</p>
<ul>
<li><strong>The slide's analysis</strong> — "Print out divisors of the positive integer n: <code>for i = 1 … n; if (n%i == 0) print out i;</code>". Two lines of pseudo-code, and they are already the loop body.</li>
<li><strong>The slide's solution function</strong>, printed verbatim on the slide and labelled "User-defined function":
<pre><code>void printDivisors(int n)
{
    int i;
    for (i = 1; i &lt;= n; i++)
        if (n % i == 0) printf("%d, ", i);
}</code></pre></li>
<li><strong>Why <code>void</code> and not <code>int</code></strong> — the task verb is "print out", not "compute". Nothing is handed back; see slide 32.</li>
<li><strong>Why the loop runs to <code>i &lt;= n</code> and not <code>i &lt; n</code></strong> — because <code>n</code> divides itself and counts as a divisor: the answer for 12 must end in 12. Write <code>i &lt; n</code> and you get the <em>proper</em> divisors instead, and the perfect-number check on slide 35 stops working.</li>
<li><strong>Now the "three times" part</strong> — the task is repeated, so the repetition belongs in <code>main</code>, in a loop, <em>not</em> inside the function. Keeping "how many times" out of the function is what lets slide 41 ask "what if the program performs this task 20 times?" and have the answer be "change one number".</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

void printDivisors(int n);

int main(void)
{
    int n, k;
    for (k = 1; k &lt;= 3; k++) {              /* the "three times"   */
        printf("Enter a positive integer: ");
        scanf("%d", &amp;n);
        printf("Divisors of %d: ", n);
        printDivisors(n);
        printf("\\n");
    }
    return 0;
}

void printDivisors(int n)
{
    int i;
    for (i = 1; i &lt;= n; i++)
        if (n % i == 0) printf("%d, ", i);
}</code></pre>
<p class="dap-an">✅ Compiled with <code>cc -Wall -std=c99</code> and run with the inputs 12, 7, 30. Actual output:<br><code>Enter a positive integer: Divisors of 12: 1, 2, 3, 4, 6, 12, </code><br><code>Enter a positive integer: Divisors of 7: 1, 7, </code><br><code>Enter a positive integer: Divisors of 30: 1, 2, 3, 5, 6, 10, 15, 30, </code><br>The prompt appears on the same line as the previous answer because <code>printf("Enter…")</code> has no leading newline — cosmetic only, and exactly what the slide's own screenshot shows.</p>
<p class="meo">💡 Note what <em>is not</em> in the function: no <code>scanf</code>, no prompt, no newline, no "three times". Each of those would be an input operation or a policy decision inside a processing module — precisely the "lowly cohesive" design that slide 15 draws with a red arrow.</p>`,
        `<p class="y-chinh">🎯 Practice 1: "Develop a program that will perform the following task <strong>in three times</strong>: accept a positive integer; print out it's divisors" — viết chương trình làm ba lần việc: nhập một số nguyên dương rồi in ra các ước của nó. Slide làm sẵn phần phân tích và trao luôn cho bạn hàm.</p>
<ul>
<li><strong>Phân tích trên slide</strong> — "Print out divisors of the positive integer n: <code>for i = 1 … n; if (n%i == 0) print out i;</code>". Hai dòng mã giả, và chúng đã chính là thân vòng lặp.</li>
<li><strong>Hàm lời giải của slide</strong>, in nguyên văn trên slide và dán nhãn "User-defined function":
<pre><code>void printDivisors(int n)
{
    int i;
    for (i = 1; i &lt;= n; i++)
        if (n % i == 0) printf("%d, ", i);
}</code></pre></li>
<li><strong>Vì sao <code>void</code> chứ không phải <code>int</code></strong> — động từ của việc là "in ra", không phải "tính". Không có gì được trả về; xem slide 32.</li>
<li><strong>Vì sao vòng lặp chạy tới <code>i &lt;= n</code> chứ không phải <code>i &lt; n</code></strong> — vì <code>n</code> chia hết cho chính nó và được tính là một ước: đáp án của 12 phải kết thúc bằng 12. Viết <code>i &lt; n</code> thì bạn được các ước <em>thực sự</em> (proper divisors) thay vì toàn bộ ước, và phép kiểm số hoàn hảo ở slide 35 sẽ hết chạy.</li>
<li><strong>Còn phần "ba lần"</strong> — việc bị lặp lại, nên chuyện lặp thuộc về <code>main</code>, nằm trong một vòng lặp, <em>không</em> nằm trong hàm. Giữ chuyện "bao nhiêu lần" ở ngoài hàm chính là thứ cho phép slide 41 hỏi "nếu chương trình phải làm việc này 20 lần thì sao?" và câu trả lời là "đổi một con số".</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

void printDivisors(int n);

int main(void)
{
    int n, k;
    for (k = 1; k &lt;= 3; k++) {              /* phần "ba lần"        */
        printf("Enter a positive integer: ");
        scanf("%d", &amp;n);
        printf("Divisors of %d: ", n);
        printDivisors(n);
        printf("\\n");
    }
    return 0;
}

void printDivisors(int n)
{
    int i;
    for (i = 1; i &lt;= n; i++)
        if (n % i == 0) printf("%d, ", i);
}</code></pre>
<p class="dap-an">✅ Đã biên dịch bằng <code>cc -Wall -std=c99</code> và chạy với dữ liệu vào 12, 7, 30. Kết quả thật:<br><code>Enter a positive integer: Divisors of 12: 1, 2, 3, 4, 6, 12, </code><br><code>Enter a positive integer: Divisors of 7: 1, 7, </code><br><code>Enter a positive integer: Divisors of 30: 1, 2, 3, 5, 6, 10, 15, 30, </code><br>Câu nhắc hiện chung dòng với đáp án trước vì <code>printf("Enter…")</code> không có dấu xuống dòng ở đầu — chỉ là chuyện hình thức, và đúng như ảnh chụp trên chính slide.</p>
<p class="meo">💡 Để ý những gì KHÔNG có trong hàm: không <code>scanf</code>, không câu nhắc, không dấu xuống dòng, không "ba lần". Mỗi thứ đó đều sẽ là một thao tác nhập hoặc một quyết định chính sách nằm trong một module xử lý — đúng cái thiết kế "lowly cohesive" mà slide 15 vẽ kèm mũi tên đỏ.</p>`],

      [41, 'Practice 1 — Solution (call, reuse, and "what if 20 times?")',
        `<p class="y-chinh">🎯 The solution slide labels every part of the call: "User-defined function", "parameter", "argument", "Call function", "A function can be re-used", "Same output" — and ends with the question that makes the point: "What do you think if the program will perform this task <strong>20 times</strong>?"</p>
<ul>
<li><strong>What "Same output" is pointing at</strong> — the three calls produce identically formatted lists. Without a function you would have copied the loop three times; with a function there is exactly one copy of the logic, so all three outputs cannot drift apart.</li>
<li><strong>The 20-times question, answered</strong> — with a function, you change <code>k &lt;= 3</code> into <code>k &lt;= 20</code>: <strong>one character changed, one line touched</strong>. Without a function you would paste the four-line loop seventeen more times — roughly 70 extra lines, seventeen more places for a typo, and seventeen copies to fix when the format changes.</li>
<li><strong>That is slide 3's list, made concrete</strong> — "Reusability: Functions allow reuse of code, reducing duplication" and "Maintainability: Modular code supports easy updates and changes". This slide is the proof, not the claim.</li>
<li><strong>Label check — parameter and argument</strong> — the slide marks <code>n</code> in <code>void printDivisors(int n)</code> as the <em>parameter</em>, and the <code>n</code> inside <code>printDivisors(n)</code> in <code>main</code> as the <em>argument</em>. They are two different variables in two different memory blocks that happen to share a name; slide 52 ("Pass by value") spells out exactly that: "Although they have the same names, they are still different."</li>
<li><strong>Go one step further</strong> — make it read the count from the user, and neither the function nor the loop body changes at all:
<pre><code>int times, k, n;
printf("How many numbers? ");
scanf("%d", &amp;times);
for (k = 1; k &lt;= times; k++) { scanf("%d", &amp;n); printDivisors(n); printf("\\n"); }</code></pre></li>
</ul>
<p class="dap-an">✅ Answer to the slide's question: <strong>nothing in <code>printDivisors</code> changes at all.</strong> Only <code>main</code>'s loop bound changes, from 3 to 20. Verified by compiling both versions: the function file is byte-for-byte identical, and the 20-run version produces twenty correctly formatted lines. The cost of "20 times" with a function is one keystroke; without one it is a copy-paste job that grows the program by about 70 lines.</p>
<p class="meo">💡 The reverse question is the better exam preparation: "here is a program with the same four lines pasted three times — rewrite it with a function." Look for repeated code where only the <em>values</em> differ; those differing values are exactly your parameter list.</p>`,
        `<p class="y-chinh">🎯 Slide lời giải dán nhãn mọi bộ phận của lời gọi: "User-defined function", "parameter", "argument", "Call function", "A function can be re-used", "Same output" — và kết bằng câu hỏi chốt ý: "What do you think if the program will perform this task <strong>20 times</strong>?"</p>
<ul>
<li><strong>Chữ "Same output" đang chỉ vào cái gì</strong> — ba lời gọi sinh ra ba danh sách định dạng y hệt nhau. Không có hàm thì bạn đã chép vòng lặp ra ba lần; có hàm thì logic chỉ tồn tại đúng một bản, nên ba kết quả không thể lệch nhau được.</li>
<li><strong>Trả lời câu hỏi 20 lần</strong> — có hàm thì bạn đổi <code>k &lt;= 3</code> thành <code>k &lt;= 20</code>: <strong>đổi một ký tự, chạm một dòng</strong>. Không có hàm thì bạn dán thêm khối bốn dòng ấy mười bảy lần nữa — khoảng 70 dòng thừa, mười bảy chỗ có thể gõ nhầm, và mười bảy bản phải sửa khi đổi định dạng.</li>
<li><strong>Đó chính là danh sách ở slide 3, cụ thể hoá</strong> — "Reusability: Functions allow reuse of code, reducing duplication" và "Maintainability: Modular code supports easy updates and changes". Slide này là BẰNG CHỨNG, không phải lời tuyên bố.</li>
<li><strong>Soi lại nhãn — tham số và đối số</strong> — slide đánh dấu <code>n</code> trong <code>void printDivisors(int n)</code> là <em>parameter</em>, còn <code>n</code> bên trong <code>printDivisors(n)</code> ở <code>main</code> là <em>argument</em>. Chúng là hai biến khác nhau nằm ở hai ô nhớ khác nhau, chỉ tình cờ trùng tên; slide 52 ("Pass by value") nói thẳng: "Although they have the same names, they are still different".</li>
<li><strong>Đi thêm một bước</strong> — cho người dùng nhập luôn số lần, và cả hàm lẫn thân vòng lặp đều không đổi một chữ:
<pre><code>int times, k, n;
printf("How many numbers? ");
scanf("%d", &amp;times);
for (k = 1; k &lt;= times; k++) { scanf("%d", &amp;n); printDivisors(n); printf("\\n"); }</code></pre></li>
</ul>
<p class="dap-an">✅ Đáp án cho câu hỏi của slide: <strong>hàm <code>printDivisors</code> không đổi gì hết.</strong> Chỉ cận vòng lặp trong <code>main</code> đổi từ 3 thành 20. Đã kiểm bằng cách biên dịch cả hai bản: phần file chứa hàm giống nhau đến từng byte, và bản chạy 20 lượt in ra hai mươi dòng đúng định dạng. Cái giá của "20 lần" khi có hàm là một lần gõ phím; khi không có hàm là một cuộc chép dán làm chương trình phình thêm khoảng 70 dòng.</p>
<p class="meo">💡 Câu hỏi ngược lại mới là bài luyện thi tốt hơn: "đây là chương trình có cùng bốn dòng dán ba lần — hãy viết lại bằng hàm". Hãy tìm những đoạn code lặp mà chỉ khác nhau ở <em>giá trị</em>; đúng những giá trị khác nhau đó chính là danh sách tham số của bạn.</p>`],

      [42, 'Exercise 1 — sum of divisors, with a user-defined function',
        `<p class="y-chinh">🎯 Exercise 1: "Develop a program that will accept a positive integer then sum of its divisors is printed out. <strong>Requirement: implementation of user-defined function.</strong> Hint: sum of divisors of the positive integer n."</p>
<ul>
<li><strong>This is the deck's oldest example, finally written out</strong> — it was the problem on slide 9, the module design on slides 21–24, and the "Task 2: <code>s = sumDivisors(n);</code>" line in the very first structure diagram. Now you write the function itself.</li>
<li><strong>Apply slide 35's recipe</strong> — verb = <em>compute</em> (so it returns a value, not <code>void</code>) · noun = <em>the positive integer n</em> (so one parameter, <code>int n</code>) · result = <em>a whole number</em> (so return type <code>int</code>). Header: <code>int sumDivisors(int n)</code>.</li>
<li><strong>The body is the Practice 1 loop with one word changed</strong> — where <code>printDivisors</code> printed <code>i</code>, <code>sumDivisors</code> adds it to an accumulator. Same traversal, different action. That is the normal relationship between a "print all X" function and a "total the X" function.</li>
<li><strong>Do not forget to initialise</strong> — <code>int i, s = 0;</code>. Leave off the <code>= 0</code> and <code>s</code> starts as whatever was left in that memory; the program then prints a different wrong answer on different runs. This bug does not crash and does not warn.</li>
<li><strong>The complete program</strong> —
<pre><code>#include &lt;stdio.h&gt;

int sumDivisors(int n);                 /* prototype */

int main(void)
{
    int n;
    printf("Enter a positive integer: ");
    scanf("%d", &amp;n);
    printf("Sum of divisors of %d = %d\\n", n, sumDivisors(n));
    return 0;
}

int sumDivisors(int n)
{
    int i, s = 0;
    for (i = 1; i &lt;= n; i++)
        if (n % i == 0)
            s = s + i;
    return s;
}</code></pre></li>
</ul>
<p class="dap-an">✅ Compiled and run. <code>n = 12</code> → <strong>Sum of divisors of 12 = 28</strong> (1+2+3+4+6+12), which is the number slide 27 promised. Further test runs: <code>n = 6</code> → <strong>12</strong> · <code>n = 28</code> → <strong>56</strong> · <code>n = 496</code> → <strong>992</strong> · <code>n = 7</code> → <strong>8</strong> (a prime, so only 1 + 7). The 6, 28 and 496 results are all exactly double the input — those three are the small perfect numbers, so getting anything else there means the function is wrong.</p>
<p class="pitfall">⚠️ Guard against <code>n = 0</code>. The problem says "positive integer", but if a user types 0 the loop <code>for (i=1; i&lt;=0; …)</code> never runs and the function returns 0 — harmless here. A negative <code>n</code> is also harmless for the same reason, but it means the program silently accepts bad input. A validating <code>do { scanf…; } while (n &lt;= 0);</code> loop in <code>main</code> — exactly the pattern slide 67 uses — is the right place for that check, <em>not</em> inside the function (input in a processing module is the slide 15 anti-pattern).</p>`,
        `<p class="y-chinh">🎯 Exercise 1: "Develop a program that will accept a positive integer then sum of it's divisors is printed out. <strong>Requirement: Implementation of User-defined function.</strong> Hint: Sum of divisors of the positive integer n" — nhập một số nguyên dương rồi in ra tổng các ước, bắt buộc phải tự viết hàm.</p>
<ul>
<li><strong>Đây là ví dụ lâu đời nhất của bộ slide, giờ mới được viết ra</strong> — nó là bài toán ở slide 9, là thiết kế module ở slide 21–24, và là dòng "Task 2: <code>s = sumDivisors(n);</code>" trong chính sơ đồ cấu trúc đầu tiên. Giờ bạn viết bản thân cái hàm.</li>
<li><strong>Áp công thức ở slide 35</strong> — động từ = <em>tính</em> (nên nó trả về giá trị, không phải <code>void</code>) · danh từ = <em>số nguyên dương n</em> (nên một tham số, <code>int n</code>) · kết quả = <em>một số nguyên</em> (nên kiểu trả về <code>int</code>). Đầu hàm: <code>int sumDivisors(int n)</code>.</li>
<li><strong>Thân hàm chính là vòng lặp Practice 1 đổi một chữ</strong> — chỗ <code>printDivisors</code> in <code>i</code> ra thì <code>sumDivisors</code> cộng nó vào biến tích luỹ. Cùng cách duyệt, khác hành động. Đó là quan hệ bình thường giữa hàm "in mọi X" và hàm "cộng tổng X".</li>
<li><strong>Đừng quên khởi tạo</strong> — <code>int i, s = 0;</code>. Bỏ <code>= 0</code> đi thì <code>s</code> khởi đầu bằng bất cứ thứ gì còn sót trong ô nhớ đó; chương trình sẽ in ra đáp án sai KHÁC NHAU giữa các lần chạy. Con bug này không làm sập và không có cảnh báo.</li>
<li><strong>Chương trình hoàn chỉnh</strong> —
<pre><code>#include &lt;stdio.h&gt;

int sumDivisors(int n);                 /* nguyên mẫu */

int main(void)
{
    int n;
    printf("Enter a positive integer: ");
    scanf("%d", &amp;n);
    printf("Sum of divisors of %d = %d\\n", n, sumDivisors(n));
    return 0;
}

int sumDivisors(int n)
{
    int i, s = 0;
    for (i = 1; i &lt;= n; i++)
        if (n % i == 0)
            s = s + i;
    return s;
}</code></pre></li>
</ul>
<p class="dap-an">✅ Đã biên dịch và chạy. <code>n = 12</code> → <strong>Sum of divisors of 12 = 28</strong> (1+2+3+4+6+12), đúng con số slide 27 đã hứa. Chạy thêm: <code>n = 6</code> → <strong>12</strong> · <code>n = 28</code> → <strong>56</strong> · <code>n = 496</strong> → <strong>992</strong> · <code>n = 7</code> → <strong>8</strong> (số nguyên tố nên chỉ có 1 + 7). Ba kết quả 6, 28 và 496 đều đúng bằng hai lần dữ liệu vào — đó là ba số hoàn hảo nhỏ, nên ra khác là hàm sai.</p>
<p class="pitfall">⚠️ Hãy chặn <code>n = 0</code>. Đề nói "số nguyên dương", nhưng nếu người dùng gõ 0 thì vòng <code>for (i=1; i&lt;=0; …)</code> không chạy lần nào và hàm trả về 0 — ở đây vô hại. <code>n</code> âm cũng vô hại vì cùng lý do, nhưng nghĩa là chương trình âm thầm nhận dữ liệu sai. Vòng kiểm <code>do { scanf…; } while (n &lt;= 0);</code> trong <code>main</code> — đúng mẫu mà slide 67 dùng — mới là chỗ đặt phép kiểm đó, <em>không phải</em> trong hàm (nhập liệu trong module xử lý chính là phản mẫu ở slide 15).</p>`],

      [43, 'Exercise 2 — equivalent resistance of three parallel resistors',
        `<p class="y-chinh">🎯 Exercise 2: "Develop a program that will accept 3 parallel circuit resistances and their equivalent is printed out. Complete the program below: <code>1/Z = 1/r1 + 1/r2 + 1/r3 → Z = ?</code>"</p>
<ul>
<li><strong>Rearrange the formula first</strong> — the slide gives you <code>1/Z</code>, not <code>Z</code>. So <code>Z = 1 / (1/r1 + 1/r2 + 1/r3)</code>. Writing <code>return 1/r1 + 1/r2 + 1/r3;</code> answers a different question and is the single most common mistake on this exercise.</li>
<li><strong>Everything must be <code>double</code></strong> — this is the slide 29 trap in a new costume. If <code>r1, r2, r3</code> are <code>int</code>, then <code>1/r1</code> is integer division: with <code>r1 = 10</code> it is <strong>0</strong>, so the sum is 0 and you divide by zero. Declare the parameters <code>double</code>, and write the numerator as <code>1.0</code>, not <code>1</code>.</li>
<li><strong>Reading doubles</strong> — <code>scanf</code> needs <code>%lf</code> for a <code>double</code> (<code>%f</code> is for <code>float</code>). <code>printf</code>, by contrast, uses <code>%f</code> for both because of default argument promotion. Mixing these up is the classic "my numbers are all zeros" bug.</li>
<li><strong>Apply slide 35's recipe</strong> — verb = <em>compute</em> → returns a value · nouns = <em>three resistances</em> → three <code>double</code> parameters · result = <em>a real number</em> → return type <code>double</code>. Header: <code>double equivalent(double r1, double r2, double r3)</code>.</li>
<li><strong>The complete program</strong> —
<pre><code>#include &lt;stdio.h&gt;

double equivalent(double r1, double r2, double r3);

int main(void)
{
    double r1, r2, r3;
    printf("Enter 3 resistances: ");
    scanf("%lf%lf%lf", &amp;r1, &amp;r2, &amp;r3);
    printf("Z = %.4f\\n", equivalent(r1, r2, r3));
    return 0;
}

double equivalent(double r1, double r2, double r3)
{
    return 1.0 / (1.0/r1 + 1.0/r2 + 1.0/r3);
}</code></pre></li>
</ul>
<p class="dap-an">✅ Compiled and run with three test cases. <code>10 20 30</code> → <strong>Z = 5.4545</strong> (check: 1/10+1/20+1/30 = 0.18333…, and 1/0.18333… = 5.4545). <code>6 6 6</code> → <strong>Z = 2.0000</strong> (three equal resistors in parallel give R/3 = 2 — an exact, hand-checkable case). <code>10 10 10</code> → <strong>Z = 3.3333</strong> (10/3). ⚠️ Note the slide gives the formula but no sample numbers and no expected output, so these three cases are ours; the <code>6 6 6</code> one is the good self-test because R/3 is exact and needs no calculator.</p>
<p class="pitfall">⚠️ Two failure modes to guard against. (1) A zero resistance divides by zero: in IEEE-754 floating point this does <em>not</em> crash — <code>1.0/0.0</code> is <code>inf</code>, the sum becomes <code>inf</code>, and <code>Z</code> prints as <strong>0.0000</strong>, which looks like a plausible answer. (2) Passing <code>int</code> variables to the <code>double</code> parameters compiles silently (they are converted), so the program runs and only the <em>precision</em> of the input is lost — the classic silently-wrong bug of this chapter.</p>`,
        `<p class="y-chinh">🎯 Exercise 2: "Develop a program that will accept 3 parallel circuit resistances and their equivalent is printed out. Complete the program below: <code>1/Z = 1/r1 + 1/r2 + 1/r3 → Z = ?</code>" — nhập ba điện trở mắc song song rồi in ra điện trở tương đương.</p>
<ul>
<li><strong>Biến đổi công thức TRƯỚC đã</strong> — slide cho bạn <code>1/Z</code> chứ không cho <code>Z</code>. Vậy <code>Z = 1 / (1/r1 + 1/r2 + 1/r3)</code>. Viết <code>return 1/r1 + 1/r2 + 1/r3;</code> là trả lời một câu hỏi khác, và đó là lỗi phổ biến nhất của bài này.</li>
<li><strong>Mọi thứ phải là <code>double</code></strong> — đây là cái bẫy ở slide 29 khoác áo mới. Nếu <code>r1, r2, r3</code> là <code>int</code> thì <code>1/r1</code> là chia nguyên: với <code>r1 = 10</code> nó bằng <strong>0</strong>, nên tổng bằng 0 và bạn đang chia cho 0. Hãy khai tham số kiểu <code>double</code>, và viết tử số là <code>1.0</code> chứ không phải <code>1</code>.</li>
<li><strong>Đọc số thực</strong> — <code>scanf</code> cần <code>%lf</code> cho <code>double</code> (<code>%f</code> là cho <code>float</code>). Ngược lại <code>printf</code> dùng <code>%f</code> cho cả hai, do luật nâng kiểu đối số mặc định. Lẫn hai cái này chính là con bug kinh điển "sao số của em toàn số 0".</li>
<li><strong>Áp công thức slide 35</strong> — động từ = <em>tính</em> → trả về giá trị · danh từ = <em>ba điện trở</em> → ba tham số <code>double</code> · kết quả = <em>một số thực</em> → kiểu trả về <code>double</code>. Đầu hàm: <code>double equivalent(double r1, double r2, double r3)</code>.</li>
<li><strong>Chương trình hoàn chỉnh</strong> —
<pre><code>#include &lt;stdio.h&gt;

double equivalent(double r1, double r2, double r3);

int main(void)
{
    double r1, r2, r3;
    printf("Enter 3 resistances: ");
    scanf("%lf%lf%lf", &amp;r1, &amp;r2, &amp;r3);
    printf("Z = %.4f\\n", equivalent(r1, r2, r3));
    return 0;
}

double equivalent(double r1, double r2, double r3)
{
    return 1.0 / (1.0/r1 + 1.0/r2 + 1.0/r3);
}</code></pre></li>
</ul>
<p class="dap-an">✅ Đã biên dịch và chạy với ba bộ dữ liệu. <code>10 20 30</code> → <strong>Z = 5.4545</strong> (kiểm: 1/10+1/20+1/30 = 0,18333…, và 1/0,18333… = 5,4545). <code>6 6 6</code> → <strong>Z = 2.0000</strong> (ba điện trở bằng nhau mắc song song cho R/3 = 2 — một ca chính xác, kiểm tay được). <code>10 10 10</code> → <strong>Z = 3.3333</strong> (10/3). ⚠️ Lưu ý slide chỉ cho công thức, KHÔNG cho số liệu mẫu và KHÔNG cho kết quả mong đợi, nên ba bộ dữ liệu này là của chúng ta; bộ <code>6 6 6</code> là phép tự kiểm tốt vì R/3 ra số chẵn, không cần máy tính.</p>
<p class="pitfall">⚠️ Hai kiểu hỏng cần đề phòng. (1) Một điện trở bằng 0 là chia cho 0: trong số thực IEEE-754 chuyện này <em>không</em> làm sập — <code>1.0/0.0</code> cho <code>inf</code>, tổng thành <code>inf</code>, và <code>Z</code> in ra <strong>0.0000</strong>, trông y như một đáp án hợp lý. (2) Truyền biến <code>int</code> vào tham số <code>double</code> thì dịch im lặng (chúng được chuyển kiểu), nên chương trình chạy và chỉ mất <em>độ chính xác</em> của dữ liệu vào — đúng con bug sai-mà-im-lặng đặc trưng của chương này.</p>`],

      [44, 'Function Prototypes',
        `<p class="y-chinh">🎯 "Function prototypes describe the form of a function <strong>without specifying the implementation details</strong>. Prototype declaration is put at one place and its implementation is put at another." Syntax: <code>returnType functionIdentifier([Type1 param1, Type2 param2, …]);</code></p>
<ul>
<li><strong>A prototype is the header plus a semicolon</strong> — that is the whole idea. <code>int sumDivisors(int n);</code> is a promise: "such a function exists somewhere; here is how to call it." No braces, no body.</li>
<li><strong>The two-step compilation the slide describes</strong> — "Step 1: the compiler acknowledges this prototype (return type, name, order of data types in parameters) and <em>marks</em> the places where this function is used, and continues the compile process. Step 2: if the function is detected, the compiler will update the marks from the previous step to create the program. Else, an error is thrown." Step 1 is compiling, step 2 is <em>linking</em>.</li>
<li><strong>Why you need one: calling before defining</strong> — a C compiler reads the file top to bottom, once. If <code>main</code> comes first and calls <code>average</code>, then at that moment the compiler has never seen <code>average</code>. A prototype above <code>main</code> fixes it; so does putting the whole definition above <code>main</code>, but that forces you to write your program upside-down.</li>
<li><strong>C89 vs C99, and why it matters today</strong> — under C89 an undeclared function was <em>implicitly</em> assumed to return <code>int</code>, so it often compiled and then misbehaved. C99 <strong>removed</strong> that rule: calling an undeclared function is an error. Modern compilers enforce this even in old modes.</li>
<li><strong>Prototype has a semicolon, definition does not</strong> — the difference between the two forms is one character:
<pre><code>int sumDivisors(int n);     /* PROTOTYPE   — semicolon, no body */

int sumDivisors(int n)      /* DEFINITION  — no semicolon, body */
{ … }</code></pre></li>
<li><strong>Parameter names are optional in a prototype</strong> — <code>int sumDivisors(int);</code> is legal; only the <em>types</em> and their order matter. But slide 48 makes a style rule of including them, because <code>double equivalent(double r1, double r2, double r3);</code> documents itself and <code>double equivalent(double, double, double);</code> does not.</li>
</ul>
<p class="dap-an">✅ Verified by compiling on Apple clang 17. A file where <code>main</code> calls <code>average(1,2,3)</code> before <code>average</code> is defined, with <strong>no prototype</strong>, fails with two errors: <em>"call to undeclared function 'average'; ISO C99 and later do not support implicit function declarations"</em> and <em>"conflicting types for 'average'"</em> — because the implicit guess was <code>int</code> while the real function returns <code>double</code>. Add the one line <code>double average(int a, int b, int c);</code> above <code>main</code> and it compiles clean and prints 2.000000. ⚠️ Worth knowing: the same error appears even with <code>-std=c89</code> on this compiler, so the old "it was only a warning in C89" folklore no longer helps you in the lab.</p>
<p class="pitfall">⚠️ A separate, quieter failure: forgetting <code>return</code> in a non-<code>void</code> function. Compiled with <code>-Wall</code>, <code>int sum3(int a,int b,int c){ int s=a+b+c; }</code> produces only the <em>warning</em> <em>"non-void function does not return a value [-Wreturn-type]"</em>, builds successfully, and then <code>sum3(1,2,3)</code> printed <strong>1</strong> instead of 6 — a garbage register value. This is why <code>-Wall</code> is not optional: without it, the compiler says nothing at all.</p>`,
        `<p class="y-chinh">🎯 "Function prototypes describe the form of a function <strong>without specifying the implementation details</strong>" — nguyên mẫu mô tả HÌNH DẠNG của hàm mà không nói chi tiết cài đặt; phần khai báo nguyên mẫu đặt một chỗ, phần hiện thực đặt chỗ khác. Cú pháp: <code>returnType functionIdentifier([Type1 param1, Type2 param2, …]);</code></p>
<ul>
<li><strong>Nguyên mẫu = đầu hàm cộng một dấu chấm phẩy</strong> — toàn bộ ý tưởng chỉ có vậy. <code>int sumDivisors(int n);</code> là một lời hứa: "có một hàm như thế ở đâu đó; đây là cách gọi nó". Không ngoặc nhọn, không thân hàm.</li>
<li><strong>Hai bước biên dịch mà slide mô tả</strong> — "Step 1: The compiler acknowledges this prototype (return type, name, order of data types in parameters) and <em>marks</em> places where this function is used and continues the compile process. Step 2: If the function is detected, the compiler will update the marks in the previous step to create the program. Else, an error is thrown." Bước 1 là biên dịch, bước 2 là <em>liên kết (linking)</em>.</li>
<li><strong>Vì sao bạn cần nó: gọi hàm trước khi định nghĩa</strong> — trình biên dịch C đọc file từ trên xuống, đúng một lượt. Nếu <code>main</code> đứng trước và gọi <code>average</code> thì ngay lúc đó trình biên dịch chưa từng thấy <code>average</code>. Một nguyên mẫu đặt trên <code>main</code> giải quyết xong; đặt cả định nghĩa lên trên <code>main</code> cũng được, nhưng như thế bạn buộc phải viết chương trình ngược đầu.</li>
<li><strong>C89 so với C99, và vì sao chuyện đó còn quan trọng hôm nay</strong> — theo C89, hàm chưa khai báo được <em>ngầm định</em> coi là trả về <code>int</code>, nên nó thường vẫn dịch được rồi chạy sai. C99 đã <strong>BỎ</strong> luật đó: gọi hàm chưa khai báo là LỖI. Trình biên dịch hiện đại áp dụng điều này kể cả ở chế độ cũ.</li>
<li><strong>Nguyên mẫu có dấu chấm phẩy, định nghĩa thì không</strong> — khác biệt giữa hai dạng đúng một ký tự:
<pre><code>int sumDivisors(int n);     /* NGUYÊN MẪU — chấm phẩy, không thân */

int sumDivisors(int n)      /* ĐỊNH NGHĨA  — không chấm phẩy, có thân */
{ … }</code></pre></li>
<li><strong>Tên tham số là tuỳ chọn trong nguyên mẫu</strong> — <code>int sumDivisors(int);</code> hợp lệ; chỉ <em>kiểu</em> và thứ tự của chúng mới quan trọng. Nhưng slide 48 đặt hẳn luật phong cách là phải ghi tên vào, vì <code>double equivalent(double r1, double r2, double r3);</code> tự nó là tài liệu còn <code>double equivalent(double, double, double);</code> thì không.</li>
</ul>
<p class="dap-an">✅ Đã kiểm bằng biên dịch trên Apple clang 17. Một file mà <code>main</code> gọi <code>average(1,2,3)</code> trước khi <code>average</code> được định nghĩa, <strong>không có nguyên mẫu</strong>, hỏng với hai lỗi: <em>"call to undeclared function 'average'; ISO C99 and later do not support implicit function declarations"</em> và <em>"conflicting types for 'average'"</em> — vì phỏng đoán ngầm định là <code>int</code> trong khi hàm thật trả về <code>double</code>. Thêm đúng một dòng <code>double average(int a, int b, int c);</code> lên trên <code>main</code> là dịch sạch và in ra 2.000000. ⚠️ Đáng biết: cùng lỗi đó vẫn hiện ngay cả khi dịch với <code>-std=c89</code> trên trình biên dịch này, nên câu truyền miệng "ở C89 nó chỉ là cảnh báo thôi" không còn cứu bạn trong phòng lab nữa.</p>
<p class="pitfall">⚠️ Một kiểu hỏng khác, âm thầm hơn: quên <code>return</code> trong hàm non-<code>void</code>. Dịch với <code>-Wall</code>, hàm <code>int sum3(int a,int b,int c){ int s=a+b+c; }</code> chỉ sinh ra <em>cảnh báo</em> <em>"non-void function does not return a value [-Wreturn-type]"</em>, build vẫn thành công, rồi <code>sum3(1,2,3)</code> in ra <strong>1</strong> thay vì 6 — một giá trị rác còn sót trong thanh ghi. Đó là lý do <code>-Wall</code> không phải tuỳ chọn: không bật thì trình biên dịch im hoàn toàn.</p>`],

      [45, 'Function Prototypes — Example',
        `<p class="y-chinh">🎯 The prototype pattern shown in a real file: prototypes at the top, <code>main</code> in the middle, definitions at the bottom — so the program reads top-down like an outline.</p>
<ul>
<li><strong>The canonical layout</strong> —
<pre><code>#include &lt;stdio.h&gt;

void printDivisors(int n);        /* what the program can do  */
int  sumDivisors(int n);

int main(void)                    /* what the program does    */
{
    int n = 12;
    printf("Divisors of %d: ", n);  printDivisors(n);  printf("\\n");
    printf("Sum = %d\\n", sumDivisors(n));
    return 0;
}

void printDivisors(int n)         /* how it does it           */
{ int i; for (i = 1; i &lt;= n; i++) if (n % i == 0) printf("%d, ", i); }

int sumDivisors(int n)
{ int i, s = 0; for (i = 1; i &lt;= n; i++) if (n % i == 0) s += i; return s; }</code></pre></li>
<li><strong>Why this order is worth the extra lines</strong> — a reader opening the file sees the table of contents, then the plot, then the details. Without prototypes you must write the helpers first, so the file starts with the least important code and <code>main</code> hides at the bottom.</li>
<li><strong>Mutual calls only work with prototypes</strong> — if <code>f</code> calls <code>g</code> and <code>g</code> calls <code>f</code>, no ordering of definitions can put both before their use. A prototype is the <em>only</em> solution.</li>
<li><strong>Splitting across files is the real payoff</strong> — put the two prototypes in <code>divisors.h</code>, the two definitions in <code>divisors.c</code>, and <code>#include "divisors.h"</code> from <code>main.c</code>. Now <code>main.c</code> can be compiled without ever seeing the bodies — exactly the "step 1 / step 2" separation slide 44 described.</li>
<li><strong>The prototype must agree with the definition</strong> — same return type, same number of parameters, same types in the same order. Disagree and the compiler reports "conflicting types", which is the good outcome; across separate files it may not notice, and the program misbehaves at run time.</li>
</ul>
<p class="dap-an">✅ Both layouts compiled and run. The single-file version above prints <code>Divisors of 12: 1, 2, 3, 4, 6, 12, </code> then <code>Sum = 28</code>. The split version — <code>divisors.h</code> holding the two prototypes, <code>divisors.c</code> holding the bodies, <code>mainprog.c</code> holding <code>main</code>, built with <code>cc -Wall -std=c99 -o prog mainprog.c divisors.c</code> — produces byte-identical output. That is the proof that a prototype really is enough to compile a call.</p>
<p class="meo">💡 Every standard header you have ever included is exactly this: <code>stdio.h</code> is a file full of prototypes (<code>int printf(const char *format, ...);</code> and friends) with no bodies at all. The bodies live in a precompiled library the linker attaches in step 2. You have been using the prototype mechanism since your first <code>printf</code>.</p>`,
        `<p class="y-chinh">🎯 Mẫu dùng nguyên mẫu trên một file thật: nguyên mẫu ở trên đầu, <code>main</code> ở giữa, định nghĩa ở dưới — để chương trình đọc từ trên xuống như một bản dàn ý.</p>
<ul>
<li><strong>Bố cục chuẩn</strong> —
<pre><code>#include &lt;stdio.h&gt;

void printDivisors(int n);        /* chương trình LÀM ĐƯỢC gì */
int  sumDivisors(int n);

int main(void)                    /* chương trình LÀM gì      */
{
    int n = 12;
    printf("Divisors of %d: ", n);  printDivisors(n);  printf("\\n");
    printf("Sum = %d\\n", sumDivisors(n));
    return 0;
}

void printDivisors(int n)         /* LÀM THẾ NÀO              */
{ int i; for (i = 1; i &lt;= n; i++) if (n % i == 0) printf("%d, ", i); }

int sumDivisors(int n)
{ int i, s = 0; for (i = 1; i &lt;= n; i++) if (n % i == 0) s += i; return s; }</code></pre></li>
<li><strong>Vì sao thứ tự này đáng để viết thêm mấy dòng</strong> — người mở file ra thấy mục lục trước, rồi tới cốt truyện, rồi mới tới chi tiết. Không có nguyên mẫu thì bạn buộc phải viết các hàm phụ trước, nên file mở đầu bằng đoạn code ít quan trọng nhất còn <code>main</code> nấp tít dưới đáy.</li>
<li><strong>Hai hàm gọi lẫn nhau thì BẮT BUỘC phải có nguyên mẫu</strong> — nếu <code>f</code> gọi <code>g</code> và <code>g</code> gọi <code>f</code> thì không thứ tự định nghĩa nào đặt được cả hai lên trước chỗ dùng. Nguyên mẫu là lối thoát <em>duy nhất</em>.</li>
<li><strong>Tách ra nhiều file mới là món lợi thật sự</strong> — đặt hai nguyên mẫu vào <code>divisors.h</code>, hai định nghĩa vào <code>divisors.c</code>, rồi <code>#include "divisors.h"</code> từ <code>main.c</code>. Giờ <code>main.c</code> dịch được mà không cần nhìn thấy thân hàm — đúng sự tách "bước 1 / bước 2" mà slide 44 mô tả.</li>
<li><strong>Nguyên mẫu phải KHỚP với định nghĩa</strong> — cùng kiểu trả về, cùng số tham số, cùng kiểu theo cùng thứ tự. Lệch nhau thì trình biên dịch báo "conflicting types", và đó là kết cục MAY; khi tách qua nhiều file thì nó có thể không phát hiện, và chương trình chạy sai lúc thực thi.</li>
</ul>
<p class="dap-an">✅ Cả hai bố cục đã biên dịch và chạy. Bản một file ở trên in ra <code>Divisors of 12: 1, 2, 3, 4, 6, 12, </code> rồi <code>Sum = 28</code>. Bản tách file — <code>divisors.h</code> chứa hai nguyên mẫu, <code>divisors.c</code> chứa thân hàm, <code>mainprog.c</code> chứa <code>main</code>, build bằng <code>cc -Wall -std=c99 -o prog mainprog.c divisors.c</code> — cho ra kết quả giống đến từng byte. Đó là bằng chứng rằng một nguyên mẫu THẬT SỰ đủ để biên dịch một lời gọi.</p>
<p class="meo">💡 Mọi header chuẩn mà bạn từng include đều đúng là thứ này: <code>stdio.h</code> là một file đầy nguyên mẫu (<code>int printf(const char *format, ...);</code> và đồng bọn) và tuyệt nhiên không có thân hàm nào. Thân hàm nằm trong một thư viện đã dịch sẵn mà trình liên kết gắn vào ở bước 2. Bạn đã dùng cơ chế nguyên mẫu từ cái <code>printf</code> đầu tiên trong đời.</p>`],

      [46, 'The #include directive',
        `<p class="y-chinh">🎯 "We use the <code>#include</code> directive to instruct the compiler to <strong>insert a copy of the header file into our source code</strong>." Two spellings: <code>#include "filename"</code> (user directory) and <code>#include &lt;filename&gt;</code> (system directory).</p>
<ul>
<li><strong>Read the slide's verb literally: <em>insert a copy</em></strong> — <code>#include</code> is not "load a library", not "import a module", not "link something in". It is textual paste. The preprocessor opens the named file, copies its entire contents into your file at that exact line, and throws the <code>#include</code> line away. The compiler proper never sees a single <code>#include</code>.</li>
<li><strong>The two forms, and what actually differs</strong> — <code>&lt;stdio.h&gt;</code> searches the system include directories (the compiler's own, plus anything added with <code>-I</code>); <code>"myheader.h"</code> searches <strong>your file's own directory first</strong>, then falls back to the system path. So the rule of thumb is: angle brackets for the standard library, quotes for headers you wrote.</li>
<li><strong>Why the paste model explains everything</strong> — why a header must not contain function <em>bodies</em> (included twice = defined twice = linker error); why the order of includes can matter; why a missing include produces "undeclared function" rather than "library not found". All of it follows from "it is a copy-paste".</li>
<li><strong>No semicolon</strong> — <code>#include &lt;stdio.h&gt;</code> ends with no <code>;</code>, because it is a <em>preprocessor directive</em>, not a C statement. Same for <code>#define</code>. Adding a semicolon pastes a stray one into your code.</li>
<li><strong>It must be the real filename</strong> — <code>#include &lt;stdio.h&gt;</code> not <code>&lt;stdio&gt;</code>, and the <code>.h</code> is part of the name. (<code>&lt;stdio&gt;</code> with no extension is C++, a different language.)</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;      /* system directory: printf, scanf  */
#include &lt;stdlib.h&gt;     /* system directory: system, malloc */
#include &lt;math.h&gt;       /* system directory: sqrt, pow      */
#include "divisors.h"   /* your directory:   your prototypes */</code></pre>
<p class="dap-an">✅ Proved by running the preprocessor alone. A file containing only <code>#include "mylib.h"</code> and <code>int main(void){ return square(3); }</code>, where <code>mylib.h</code> holds the single line <code>int square(int n);</code>, was passed through <code>cc -E</code>. The output contains, in order, <code>int square(int n);</code> then <code>int main(void){ return square(3); }</code> — the header's text, literally pasted in, and the <code>#include</code> line gone. Then <code>cc -Wall -std=c99</code> on the same pattern built and printed <strong>81</strong> for <code>square(9)</code>.</p>
<p class="pitfall">⚠️ Because it is a literal paste, a header included twice is pasted twice — and a duplicated <code>struct</code> or <code>typedef</code> is a compile error. Real headers defend themselves with an include guard: <code>#ifndef DIVISORS_H</code> / <code>#define DIVISORS_H</code> / … / <code>#endif</code>. Look inside any <code>.h</code> on your machine and you will find one.</p>`,
        `<p class="y-chinh">🎯 "We use the <code>#include</code> directive to instruct the compiler to <strong>insert a copy of the header file into our source code</strong>" — chỉ thị <code>#include</code> bảo trình biên dịch CHÈN MỘT BẢN SAO của file header vào mã nguồn. Hai cách viết: <code>#include "filename"</code> (thư mục của người dùng) và <code>#include &lt;filename&gt;</code> (thư mục hệ thống).</p>
<ul>
<li><strong>Hãy đọc động từ trên slide theo nghĩa đen: <em>chèn một bản sao</em></strong> — <code>#include</code> KHÔNG phải "nạp thư viện", không phải "import module", không phải "liên kết thứ gì đó vào". Nó là DÁN VĂN BẢN. Bộ tiền xử lý mở file được nêu tên, chép toàn bộ nội dung file đó vào file của bạn tại đúng dòng đó, rồi vứt dòng <code>#include</code> đi. Trình biên dịch thật sự không bao giờ nhìn thấy một dòng <code>#include</code> nào.</li>
<li><strong>Hai dạng, và cái khác nhau thật sự là gì</strong> — <code>&lt;stdio.h&gt;</code> tìm trong các thư mục include hệ thống (của chính trình biên dịch, cộng thêm những gì thêm bằng <code>-I</code>); <code>"myheader.h"</code> tìm <strong>trong thư mục của chính file bạn trước</strong>, không thấy thì mới quay về đường hệ thống. Nên quy tắc ngón tay cái là: ngoặc nhọn cho thư viện chuẩn, ngoặc kép cho header do bạn viết.</li>
<li><strong>Vì sao mô hình "dán" giải thích được mọi thứ</strong> — vì sao header không được chứa <em>thân</em> hàm (include hai lần = định nghĩa hai lần = lỗi liên kết); vì sao thứ tự các dòng include có khi lại quan trọng; vì sao thiếu include thì báo "undeclared function" chứ không báo "không tìm thấy thư viện". Tất cả đều suy ra từ một câu "nó là chép-dán".</li>
<li><strong>Không có dấu chấm phẩy</strong> — <code>#include &lt;stdio.h&gt;</code> kết thúc mà không có <code>;</code>, vì nó là một <em>chỉ thị tiền xử lý</em>, không phải câu lệnh C. <code>#define</code> cũng vậy. Thêm dấu chấm phẩy là bạn dán một dấu lạc lõng vào code của mình.</li>
<li><strong>Phải đúng tên file</strong> — <code>#include &lt;stdio.h&gt;</code> chứ không phải <code>&lt;stdio&gt;</code>, và phần <code>.h</code> là một phần của cái tên. (<code>&lt;stdio&gt;</code> không có đuôi là C++, một ngôn ngữ khác.)</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;      /* thư mục hệ thống: printf, scanf  */
#include &lt;stdlib.h&gt;     /* thư mục hệ thống: system, malloc */
#include &lt;math.h&gt;       /* thư mục hệ thống: sqrt, pow      */
#include "divisors.h"   /* thư mục của bạn:  nguyên mẫu của bạn */</code></pre>
<p class="dap-an">✅ Đã chứng minh bằng cách chạy riêng bộ tiền xử lý. Một file chỉ chứa <code>#include "mylib.h"</code> và <code>int main(void){ return square(3); }</code>, trong đó <code>mylib.h</code> chỉ có một dòng <code>int square(int n);</code>, được đưa qua <code>cc -E</code>. Kết quả in ra, theo thứ tự, là <code>int square(int n);</code> rồi <code>int main(void){ return square(3); }</code> — nguyên văn chữ trong header bị dán vào, và dòng <code>#include</code> biến mất. Sau đó <code>cc -Wall -std=c99</code> trên cùng mẫu đó build được và in ra <strong>81</strong> cho <code>square(9)</code>.</p>
<p class="pitfall">⚠️ Vì nó dán nguyên văn nên header bị include hai lần sẽ bị dán hai lần — và một <code>struct</code> hay <code>typedef</code> lặp lại là lỗi biên dịch. Header thật tự vệ bằng chốt chống lặp: <code>#ifndef DIVISORS_H</code> / <code>#define DIVISORS_H</code> / … / <code>#endif</code>. Mở bất kỳ file <code>.h</code> nào trên máy bạn ra là thấy.</p>`],

      [47, 'The #include directive (cont.) — where the system directory is',
        `<p class="y-chinh">🎯 "System directory: the <code>include</code> directory of the selected programming environment (such as Dev-Cpp)." The angle-bracket form is not magic — it is a folder on your disk that you can open and read.</p>
<ul>
<li><strong>Where it actually lives</strong> — on Dev-C++/MinGW it is something like <code>C:\\Dev-Cpp\\MinGW64\\include</code>; on Linux, <code>/usr/include</code>; on macOS, inside the SDK the compiler ships with. Open it and you will find <code>stdio.h</code>, <code>stdlib.h</code>, <code>math.h</code> as ordinary text files.</li>
<li><strong>Open <code>stdio.h</code> once in your life</strong> — you will find prototypes and macros, and <strong>no function bodies</strong>. That confirms slide 44's two-step model: the header supplies the shape so step 1 can compile your calls, the precompiled library supplies the code so step 2 can link them.</li>
<li><strong>Which header for which function</strong> — <code>printf</code>, <code>scanf</code>, <code>getchar</code>, file I/O → <code>&lt;stdio.h&gt;</code> · <code>system</code>, <code>malloc</code>, <code>abs</code>, <code>rand</code>, <code>exit</code> → <code>&lt;stdlib.h&gt;</code> · <code>sqrt</code>, <code>pow</code>, <code>fabs</code>, <code>sin</code> → <code>&lt;math.h&gt;</code> · <code>strlen</code>, <code>strcpy</code> → <code>&lt;string.h&gt;</code>. Slide 9 already used the first two.</li>
<li><strong>The classic <code>math.h</code> surprise</strong> — on Linux, including <code>&lt;math.h&gt;</code> is not enough; you must also link the maths library with <code>cc prog.c -lm</code>, or you get "undefined reference to sqrt". That is exactly the step-1-succeeded-but-step-2-failed case from slide 44, and it proves that including a header and linking a library are two different acts.</li>
<li><strong>Your own headers go beside your <code>.c</code> file</strong> — with quotes, the compiler looks in your project folder first, which is why <code>#include "divisors.h"</code> finds a file you just created without any configuration at all.</li>
</ul>
<p class="dap-an">✅ Verified on this machine. A local <code>mylib.h</code> sitting next to the <code>.c</code> file is found by <code>#include "mylib.h"</code> with no compiler flags whatsoever, and the resulting program printed <strong>81</strong>. Also checked: <code>cc -E</code> shows the compiler recording the exact path of every file it pasted, so if the wrong header is found you can see which one it took.</p>
<p class="meo">💡 "Undeclared function" and "undefined reference" are two <em>different</em> errors and they point at two different mistakes. Undeclared = you forgot the <code>#include</code> (step 1, the shape is missing). Undefined reference = the header was found but the body is not in any file being linked (step 2, the code is missing). Reading which of the two you got saves a lot of guessing.</p>`,
        `<p class="y-chinh">🎯 "System directory: The include directory of the select programming environment (such as Dev-Cpp)" — thư mục hệ thống chính là thư mục <code>include</code> của môi trường lập trình bạn đang dùng. Dạng ngoặc nhọn không có phép thuật gì — nó là một thư mục trên đĩa mà bạn mở ra đọc được.</p>
<ul>
<li><strong>Nó nằm ở đâu thật sự</strong> — với Dev-C++/MinGW thì đại khái là <code>C:\\Dev-Cpp\\MinGW64\\include</code>; trên Linux là <code>/usr/include</code>; trên macOS thì nằm trong bộ SDK đi kèm trình biên dịch. Mở ra là thấy <code>stdio.h</code>, <code>stdlib.h</code>, <code>math.h</code> dưới dạng file văn bản bình thường.</li>
<li><strong>Hãy mở <code>stdio.h</code> ra một lần trong đời</strong> — bạn sẽ thấy các nguyên mẫu và macro, và <strong>không có thân hàm nào cả</strong>. Điều đó xác nhận mô hình hai bước ở slide 44: header cấp HÌNH DẠNG để bước 1 dịch được các lời gọi, còn thư viện dịch sẵn cấp MÃ để bước 2 liên kết chúng lại.</li>
<li><strong>Hàm nào ở header nào</strong> — <code>printf</code>, <code>scanf</code>, <code>getchar</code>, vào/ra tệp → <code>&lt;stdio.h&gt;</code> · <code>system</code>, <code>malloc</code>, <code>abs</code>, <code>rand</code>, <code>exit</code> → <code>&lt;stdlib.h&gt;</code> · <code>sqrt</code>, <code>pow</code>, <code>fabs</code>, <code>sin</code> → <code>&lt;math.h&gt;</code> · <code>strlen</code>, <code>strcpy</code> → <code>&lt;string.h&gt;</code>. Slide 9 đã dùng hai cái đầu.</li>
<li><strong>Cú bất ngờ kinh điển với <code>math.h</code></strong> — trên Linux, include <code>&lt;math.h&gt;</code> thôi CHƯA đủ; bạn còn phải liên kết thư viện toán bằng <code>cc prog.c -lm</code>, không thì nhận "undefined reference to sqrt". Đó đúng là trường hợp bước-1-xong-bước-2-hỏng ở slide 44, và nó chứng minh include một header với liên kết một thư viện là hai việc khác nhau.</li>
<li><strong>Header của bạn nằm cạnh file <code>.c</code> của bạn</strong> — với ngoặc kép, trình biên dịch tìm trong thư mục dự án của bạn trước, và đó là lý do <code>#include "divisors.h"</code> tìm ra file bạn vừa tạo mà không cần cấu hình gì cả.</li>
</ul>
<p class="dap-an">✅ Đã kiểm trên máy này. Một file <code>mylib.h</code> nằm cạnh file <code>.c</code> được <code>#include "mylib.h"</code> tìm thấy mà không cần bất kỳ cờ biên dịch nào, và chương trình tạo ra in <strong>81</strong>. Kiểm thêm: <code>cc -E</code> cho thấy trình biên dịch ghi lại đường dẫn CHÍNH XÁC của từng file nó đã dán vào, nên nếu nó tìm nhầm header thì bạn nhìn ra được nó lấy cái nào.</p>
<p class="meo">💡 "Undeclared function" và "undefined reference" là hai lỗi KHÁC NHAU và chỉ vào hai sai lầm khác nhau. Undeclared = bạn quên dòng <code>#include</code> (bước 1, thiếu hình dạng). Undefined reference = header tìm thấy rồi nhưng thân hàm không nằm trong file nào đang được liên kết (bước 2, thiếu mã). Đọc xem mình dính cái nào là đỡ được rất nhiều lần đoán mò.</p>`],

      [48, 'Function Programming Style',
        `<p class="y-chinh">🎯 The deck's six style rules, and every one of them is a defence against a bug you have already met in this chapter.</p>
<ul>
<li><strong>1. "Declare a prototype for each function definition"</strong> — so you may call in any order, and so the compiler can check every call. Without it, C99 refuses to compile and C89 silently guessed <code>int</code> (verified on slide 44: two hard errors on a modern compiler).</li>
<li><strong>2. "Specify the return data type in each function definition"</strong> — never rely on the old implicit-<code>int</code> rule. Write <code>int</code>, <code>double</code> or <code>void</code>, always. C99 removed the fallback, so relying on it is relying on something the language no longer has.</li>
<li><strong>3. "Specify <code>void</code> for a function with no parameters"</strong> — write <code>int f(void)</code>, not <code>int f()</code>. In C these mean different things: <code>f()</code> means "parameters unspecified", so the compiler cannot check your arguments at all.</li>
<li><strong>4. "Avoid calling the main function recursively"</strong> — <code>main</code> is the OS's entry point, not a loop construct. Restarting it from inside piles up stack frames until the program dies; use <code>while</code> or <code>do…while</code> (slide 67's pattern).</li>
<li><strong>5. "Include parameter identifiers in the prototype declarations"</strong> — <code>double equivalent(double r1, double r2, double r3);</code> tells the reader the order of the arguments; <code>double equivalent(double, double, double);</code> is legal and useless. Given that argument order is silently wrong when swapped (slide 39), naming them is cheap insurance.</li>
<li><strong>6. "Use generic comments and variable names so that we can use the function in a variety of applications without modifying its code"</strong> — name the parameter <code>n</code> or <code>value</code>, not <code>userInputFromMenu3</code>. A function called <code>sumDivisors(int n)</code> fits anywhere; one called <code>sumDivisorsOfTheNumberTypedInStep2</code> fits nowhere. This is the cohesion/coupling argument again, at the level of naming.</li>
</ul>
<p class="dap-an">✅ Rule 3 verified by compiling. Declaring <code>int foo();</code> and then calling <code>foo(1,2,3)</code> — three arguments to a function defined with none — <strong>builds successfully</strong>, with only the warning <em>"passing arguments to 'foo' without a prototype is deprecated in all versions of C and is not supported in C23 [-Wdeprecated-non-prototype]"</em>, and the program ran and printed <code>1 2</code>. Change the declaration to <code>int foo(void);</code> and the same call becomes a hard error: <em>"too many arguments to function call, expected 0, have 3"</em>. So <code>f()</code> really does switch the compiler's checking off, exactly as this rule warns.</p>
<p class="pitfall">⚠️ These six rules are not decoration — five of the six exist because of a failure mode demonstrated in this very chapter: missing prototype (slide 44), implicit <code>int</code> (slide 33), <code>f()</code> vs <code>f(void)</code> (above), argument order (slide 39), and globals leaking into functions (slide 37). Treat the list as a post-mortem, not as etiquette. The one that costs nothing and saves the most: always build with <code>-Wall</code>, because a missing <code>return</code> in a non-<code>void</code> function is otherwise completely silent (verified: it printed 1 instead of 6).</p>`,
        `<p class="y-chinh">🎯 Sáu luật phong cách của bộ slide, và mỗi luật đều là một lớp phòng thủ trước một con bug bạn đã gặp ngay trong chương này.</p>
<ul>
<li><strong>1. "Declare a prototype for each function definition"</strong> — khai nguyên mẫu cho mọi định nghĩa hàm, để bạn gọi theo thứ tự nào cũng được và để trình biên dịch kiểm được mọi lời gọi. Không có nó thì C99 từ chối dịch còn C89 âm thầm đoán là <code>int</code> (đã kiểm ở slide 44: hai lỗi cứng trên trình biên dịch hiện đại).</li>
<li><strong>2. "Specify the return data type in each function definition"</strong> — luôn ghi rõ kiểu trả về, đừng dựa vào luật implicit-<code>int</code> cũ. Viết <code>int</code>, <code>double</code> hoặc <code>void</code>, lần nào cũng vậy. C99 đã bỏ đường lùi đó, nên dựa vào nó là dựa vào thứ ngôn ngữ không còn có nữa.</li>
<li><strong>3. "Specify <code>void</code> for a function with no parameters"</strong> — viết <code>int f(void)</code>, không viết <code>int f()</code>. Trong C hai cái này khác nghĩa: <code>f()</code> nghĩa là "tham số chưa xác định", nên trình biên dịch hoàn toàn không kiểm được đối số của bạn.</li>
<li><strong>4. "Avoid calling the main function recursively"</strong> — <code>main</code> là điểm vào của hệ điều hành, không phải một cấu trúc lặp. Khởi động lại nó từ bên trong sẽ chồng khung ngăn xếp cho tới khi chương trình chết; hãy dùng <code>while</code> hoặc <code>do…while</code> (đúng mẫu ở slide 67).</li>
<li><strong>5. "Include parameter identifiers in the prototype declarations"</strong> — <code>double equivalent(double r1, double r2, double r3);</code> nói cho người đọc biết thứ tự các đối số; <code>double equivalent(double, double, double);</code> hợp lệ mà vô dụng. Vì đảo thứ tự đối số thì sai âm thầm (slide 39), ghi tên vào là khoản bảo hiểm rẻ tiền.</li>
<li><strong>6. "Use generic comments and variables names so that we can use the function in a variety of applications without modifying its code"</strong> — đặt tên tham số là <code>n</code> hay <code>value</code>, đừng đặt <code>userInputFromMenu3</code>. Hàm tên <code>sumDivisors(int n)</code> nhét vào đâu cũng vừa; hàm tên <code>sumDivisorsOfTheNumberTypedInStep2</code> thì chẳng vừa chỗ nào. Đây lại là lập luận cohesion/coupling, lần này ở tầng đặt tên.</li>
</ul>
<p class="dap-an">✅ Luật 3 đã kiểm bằng biên dịch. Khai <code>int foo();</code> rồi gọi <code>foo(1,2,3)</code> — ba đối số cho một hàm định nghĩa không tham số nào — vẫn <strong>build thành công</strong>, chỉ kèm cảnh báo <em>"passing arguments to 'foo' without a prototype is deprecated in all versions of C and is not supported in C23 [-Wdeprecated-non-prototype]"</em>, và chương trình chạy in ra <code>1 2</code>. Đổi khai báo thành <code>int foo(void);</code> thì đúng lời gọi đó thành lỗi cứng: <em>"too many arguments to function call, expected 0, have 3"</em>. Vậy <code>f()</code> thật sự TẮT bộ kiểm của trình biên dịch, đúng như luật này cảnh báo.</p>
<p class="pitfall">⚠️ Sáu luật này không phải đồ trang trí — năm trong sáu cái tồn tại vì một kiểu hỏng đã được chứng minh ngay trong chương này: thiếu nguyên mẫu (slide 44), ngầm định <code>int</code> (slide 33), <code>f()</code> so với <code>f(void)</code> (ở trên), thứ tự đối số (slide 39), và biến toàn cục rò vào hàm (slide 37). Hãy coi danh sách này là biên bản mổ xẻ tai nạn, không phải phép lịch sự. Cái không tốn gì mà cứu được nhiều nhất: luôn build với <code>-Wall</code>, vì thiếu <code>return</code> trong hàm non-<code>void</code> thì ngoài ra hoàn toàn im lặng (đã đo: nó in ra 1 thay vì 6).</p>`],

    ]),
  ].join('\n'),
};
