/**
 * PRF192 · Slot 02-04 (deck 'prf2', 62 slide) — phần slide 45→62, học theo từng slide.
 * Chương 3: Biểu thức & toán tử.
 *
 * Nội dung bám ĐÚNG chữ trích từ .pptx gốc của trường (/tmp/prf192-text/prf2.txt).
 * MỌI con số trong phần giảng đã được kiểm bằng biên dịch thật (cc -Wall -std=c99):
 *   5/2=2 · 5.0/2=2.5 · -7/2=-3 · -7%2=-1 · 7/-2=-3 · 7%-2=1
 *   10/3=3 · 10.0/3=3.333333 · 17%3=2 · 15.0%3 => LỖI BIÊN DỊCH
 *   12&8=8 · 12|8=12 · 12^8=4 · 12>>1=6 · 12<<1=24 · ~12=-13 · (-1)>>1=-1
 *   13&7=5 · 62|53=63 · 17^21=4 · 12>>2=3 · 65<<3=520
 *   m=3,k=2,n=4: m<n=1 · k<m<n=1 · k>m>n=0 · m<n>k=0 · m&&k<n=1
 *   3*n+620*t-3*x = 76253.1 (n=3 int, t=123 long, x=5.3 double)
 *   (int)3.99=3 · (int)-3.99=-3 · (char)321=65='A' · 7/2=3 nhưng (double)7/2=3.5
 *   1/2*3.0=0 nhưng 3.0*1/2=1.5 · 2+3*4=14 · 17%5*2=4
 * Chỗ slide gốc ghi nhầm đã nêu thẳng trong phần Đáp án (slide 47, 53), KHÔNG im lặng chép lại.
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'prf2';

export default {
  title: '3.0 — Slide by slide: Expressions, operators, type mixing & precedence (slides 45–62)|||3.0 — Slide bài giảng: Biểu thức, toán tử, trộn kiểu & thứ tự ưu tiên (slide 45–62)',
  slug: 'prf192-3-0-slides-bieu-thuc-toan-tu',
  type: 'DOCUMENT',
  description: 'Phần cuối bộ slide Slot 02-04 của PRF192 (slide 45–62): biểu thức là gì, toàn bộ năm nhóm toán tử của C (số học, quan hệ, logic, bit, gán rút gọn), quy tắc trộn kiểu dữ liệu — ép kiểu ngầm định lẫn tường minh — và bảng thứ tự ưu tiên toán tử. Mỗi slide kèm giảng song ngữ, mọi ví dụ và bài tập trên slide đều được giải từng bước và kiểm lại bằng trình biên dịch thật.',
  content: [
    walkHead(D, 45, 62),
    walk(D, [

      [45, 'Expressions (section divider)',
        `<p class="y-chinh">🎯 A section marker: everything from here to the end of the deck is about turning stored data into <em>computed</em> data — expressions and the operators that build them.</p>
<ul>
<li><strong>Where you are in the deck</strong> — slides 1–44 taught you how to <em>hold</em> a value: data types, declarations, memory, literals, constants, input and output. Slides 45–62 teach you how to <em>combine</em> values.</li>
<li><strong>The eight blocks ahead</strong> — expressions (46), arithmetic operators (47–49), relational (50), logical (51), bitwise (52–53), shorthand assignment (54), mixing data types and casting (55–59), precedence (60), summary (61–62).</li>
<li><strong>Why operators come after types</strong> — every operator in C asks "what type are my operands?" before deciding what it means. <code>/</code> on two ints is integer division; <code>/</code> on a double is real division. The operator does not have one fixed behaviour — the <em>pair</em> (operator, operand types) does.</li>
<li><strong>The hardware behind it</strong> — slide 46 names the unit that does this work: the ALU (Arithmetic Logic Unit) inside the CPU. Arithmetic, relational and logic operations are exactly the three families the ALU implements in silicon. That is not a coincidence; C was designed to expose them.</li>
<li><strong>What the exam does with this chunk</strong> — almost never "define an expression". Almost always "trace this expression and write the printed value". So the skill to build here is hand-evaluation, not recitation.</li>
</ul>
<p class="meo">💡 From this slide on, read every code fragment with two questions in mind: <em>what type is each operand?</em> and <em>which operator binds first?</em> Nearly every wrong answer in this chapter comes from missing one of those two.</p>`,
        `<p class="y-chinh">🎯 Slide phân mục: từ đây tới hết bộ slide là chuyện biến dữ liệu đã lưu thành dữ liệu được <em>tính ra</em> — biểu thức và các toán tử dựng nên nó.</p>
<ul>
<li><strong>Bạn đang ở đâu trong bộ slide</strong> — slide 1–44 dạy cách <em>giữ</em> một giá trị: kiểu dữ liệu, khai báo, bộ nhớ, hằng literal, hằng có tên, nhập và xuất. Slide 45–62 dạy cách <em>kết hợp</em> các giá trị.</li>
<li><strong>Tám khối phía trước</strong> — biểu thức (46), toán tử số học (47–49), quan hệ (50), logic (51), bit (52–53), gán rút gọn (54), trộn kiểu và ép kiểu (55–59), thứ tự ưu tiên (60), tổng kết (61–62).</li>
<li><strong>Vì sao toán tử đi sau kiểu dữ liệu</strong> — mọi toán tử trong C đều hỏi "toán hạng của tôi kiểu gì?" trước khi quyết định nó có nghĩa gì. <code>/</code> trên hai số int là chia lấy nguyên; <code>/</code> có double là chia thực. Bản thân toán tử KHÔNG có một hành vi cố định — <em>cặp</em> (toán tử, kiểu toán hạng) mới có.</li>
<li><strong>Phần cứng đứng sau</strong> — slide 46 gọi tên bộ phận làm việc này: ALU (Arithmetic Logic Unit) nằm trong CPU. Số học, quan hệ và logic đúng là ba họ phép toán mà ALU cài đặt bằng mạch điện. Đó không phải trùng hợp; C được thiết kế để phơi chúng ra.</li>
<li><strong>Đề thi khai thác khối này thế nào</strong> — gần như không bao giờ hỏi "biểu thức là gì". Gần như luôn hỏi "chạy tay biểu thức này và viết ra giá trị được in". Nên kỹ năng cần luyện ở đây là tính tay, không phải học thuộc.</li>
</ul>
<p class="meo">💡 Từ slide này trở đi, đọc mọi đoạn code với hai câu hỏi trong đầu: <em>mỗi toán hạng kiểu gì?</em> và <em>toán tử nào kết hợp trước?</em> Gần như mọi đáp án sai trong chương này đều do bỏ sót một trong hai câu đó.</p>`],

      [46, 'Expressions — definition, examples, and the ALU',
        `<p class="y-chinh">🎯 The slide's definition: "Expression is a valid association of constants, variables, operators and functions and returns an <em>only</em> result."</p>
<ul>
<li><strong>Four ingredients</strong> — constants (<code>32</code>, <code>16.5</code>), variables (<code>x</code>, <code>y</code>, <code>z</code>), operators (<code>+ - * / &gt; =</code>), and functions (<code>sqrt(15)</code>). Anything built from those four, legally combined, is an expression.</li>
<li><strong>"Returns an only result"</strong> — the key clause. An expression <em>has a value</em>. That is what separates it from a statement. This is why <code>y = 17 + 6*5/9 - z*z</code> is itself an expression: assignment in C yields a value (the value assigned), which is why <code>a = b = c = 5</code> is legal.</li>
<li><strong>The slide's four examples, evaluated</strong> —
<pre><code>32 - x + y/6                   /* arithmetic, one numeric result   */
16.5 + 4/sqrt(15) * 17 - 8     /* arithmetic + a library function  */
45 &gt; 5*x                       /* relational, result is 1 or 0     */
y = 17 + 6*5/9 - z*z           /* assignment, result is y's value  */</code></pre></li>
<li><strong>A trap hiding in example 2</strong> — <code>4/sqrt(15)</code> is <em>not</em> integer division, because <code>sqrt</code> returns a <code>double</code>, so <code>4</code> is promoted to <code>4.0</code>. Change it to <code>4/15</code> and you get 0. Same symbol, different answer, decided purely by types.</li>
<li><strong>The hardware line</strong> — "Hardware for calculating expressions: ALU. Operations that can be supported by ALU: Arithmetic, relational and logic operations." The ALU has no "string concatenation" or "sort" circuit; those are built out of these three families by software.</li>
</ul>
<p class="dap-an">✅ Worked evaluation of example 4 with <code>z = 2</code>: <code>6*5 = 30</code> → <code>30/9 = 3</code> (integer division, the .33 is thrown away) → <code>17 + 3 = 20</code> → <code>z*z = 4</code> → <code>20 - 4 = 16</code>. So <strong>y = 16</strong>, not 16.33. Verified by compiling it.</p>
<p class="pitfall">⚠️ "A valid association" is doing real work in that definition. <code>32 - + x</code> is valid (unary plus). <code>32 - * x</code> is not — <code>*</code> has no unary arithmetic meaning. Validity is decided by the grammar, not by whether it "looks like maths".</p>`,
        `<p class="y-chinh">🎯 Định nghĩa trên slide: "Expression is a valid association of constants, variables, operators and functions and returns an <em>only</em> result" — biểu thức là một tổ hợp hợp lệ của hằng, biến, toán tử và hàm, trả về đúng MỘT kết quả.</p>
<ul>
<li><strong>Bốn thành phần</strong> — hằng (<code>32</code>, <code>16.5</code>), biến (<code>x</code>, <code>y</code>, <code>z</code>), toán tử (<code>+ - * / &gt; =</code>), và hàm (<code>sqrt(15)</code>). Bất cứ thứ gì dựng từ bốn thứ đó theo đúng luật đều là biểu thức.</li>
<li><strong>"Trả về đúng một kết quả"</strong> — đây là mệnh đề then chốt. Biểu thức <em>có một giá trị</em>. Đó là thứ phân biệt nó với câu lệnh. Cũng vì thế <code>y = 17 + 6*5/9 - z*z</code> bản thân nó là một biểu thức: phép gán trong C trả về giá trị vừa gán, và đó là lý do <code>a = b = c = 5</code> viết được.</li>
<li><strong>Bốn ví dụ trên slide, đọc kỹ</strong> —
<pre><code>32 - x + y/6                   /* số học, một kết quả số         */
16.5 + 4/sqrt(15) * 17 - 8     /* số học + một hàm thư viện      */
45 &gt; 5*x                       /* quan hệ, kết quả là 1 hoặc 0   */
y = 17 + 6*5/9 - z*z           /* gán, kết quả là giá trị của y  */</code></pre></li>
<li><strong>Một cái bẫy nấp trong ví dụ 2</strong> — <code>4/sqrt(15)</code> KHÔNG phải chia nguyên, vì <code>sqrt</code> trả về <code>double</code> nên <code>4</code> được nâng thành <code>4.0</code>. Đổi thành <code>4/15</code> thì ra 0. Cùng một ký hiệu, khác đáp số, quyết định hoàn toàn bởi kiểu dữ liệu.</li>
<li><strong>Dòng nói về phần cứng</strong> — "Hardware for calculating expressions: ALU. Operations that can be supported by ALU: Arithmetic, relational and logic operations." ALU không có mạch "nối chuỗi" hay "sắp xếp"; những thứ đó do phần mềm dựng lên từ ba họ phép toán này.</li>
</ul>
<p class="dap-an">✅ Giải từng bước ví dụ 4 với <code>z = 2</code>: <code>6*5 = 30</code> → <code>30/9 = 3</code> (chia nguyên, phần .33 bị vứt) → <code>17 + 3 = 20</code> → <code>z*z = 4</code> → <code>20 - 4 = 16</code>. Vậy <strong>y = 16</strong>, không phải 16,33. Đã kiểm bằng biên dịch thật.</p>
<p class="pitfall">⚠️ Chữ "hợp lệ" trong định nghĩa gánh việc thật đấy. <code>32 - + x</code> là hợp lệ (dấu cộng một ngôi). <code>32 - * x</code> thì không — <code>*</code> không có nghĩa một ngôi trong số học. Tính hợp lệ do văn phạm quyết định, không phải do "nhìn giống toán".</p>`],

      [47, '1. Arithmetic Operators (the table)',
        `<p class="y-chinh">🎯 Seven arithmetic operators: unary <code>+</code> and <code>-</code>, binary <code>+ - * / %</code>, and the increment/decrement pair <code>++ --</code>.</p>
<ul>
<li><strong>Unary <code>+x</code></strong> — "leaves the variable, constant or expression unchanged". <code>y = +x;</code> is identical to <code>y = x;</code>. It exists for symmetry and readability, not for effect.</li>
<li><strong>Unary <code>-x</code></strong> — "reverses the sign of the variable". Note it does <em>not</em> modify <code>x</code>; it produces a new value. <code>y = -x;</code> leaves <code>x</code> alone.</li>
<li><strong>Binary <code>+ - *</code></strong> — ordinary add, subtract, multiply. Nothing surprising until types differ (slides 55–59).</li>
<li><strong>The one you must not get wrong: <code>/</code></strong> — "get the quotient of a division". With two integers it is <em>integer</em> division and the fractional part is discarded. The slide's own numbers: <code>z = 10/3;</code> → <strong>3</strong>, but <code>z = 10.0/3;</code> → <strong>3.3333333</strong>. One decimal point changes everything.</li>
<li><strong><code>%</code> — remainder, integers only</strong> — <code>17%3</code> → <strong>2</strong>. And <code>15.0 % 3</code> → <strong>ERROR</strong>, exactly as the slide says: <code>%</code> is undefined for floating-point operands and the compiler refuses to build.</li>
<li><strong><code>++</code> and <code>--</code></strong> — "increase/decrease the value of a variable (prefix/postfix operators)". These are the only operators in this table that <em>change</em> their operand. That fact is the summary question on slide 61.</li>
</ul>
<pre><code>printf("%d %g %d\\n", 10/3, 10.0/3, 17%3);   /* 3 3.33333 2 */
/* float a = 15.0;  a % 3   -- will not compile */</code></pre>
<p class="dap-an">✅ Verified by compiling: <code>10/3</code> = 3 · <code>10.0/3</code> = 3.333333 · <code>17%3</code> = 2 · <code>float a = 15.0; a % 3;</code> → <em>error: invalid operands to binary expression ('float' and 'int')</em>. ⚠️ The school slide has a copy-paste slip in this table: the Example column of the <code>* /</code> row reads <code>z = x-y;</code>, but it is illustrating multiplication, so it should read <code>z = x*y;</code>. The numeric examples underneath (<code>10/3</code>, <code>10.0/3</code>) are correct.</p>
<p class="pitfall">⚠️ Negative operands: C99 truncates <em>toward zero</em>. <code>-7/2</code> = <strong>-3</strong> (not -4) and <code>-7%2</code> = <strong>-1</strong> (not +1). The sign of <code>%</code> follows the <em>left</em> operand: <code>7%-2</code> = <strong>+1</strong>. All three verified by compiling.</p>`,
        `<p class="y-chinh">🎯 Bảy toán tử số học: <code>+</code> và <code>-</code> một ngôi, <code>+ - * / %</code> hai ngôi, và cặp tăng/giảm <code>++ --</code>.</p>
<ul>
<li><strong><code>+x</code> một ngôi</strong> — "leaves the variable, constant or expression unchanged". <code>y = +x;</code> giống hệt <code>y = x;</code>. Nó tồn tại cho cân đối và dễ đọc, không tạo tác dụng gì.</li>
<li><strong><code>-x</code> một ngôi</strong> — "reverses the sign of the variable" (đổi dấu). Chú ý nó KHÔNG sửa <code>x</code>; nó sinh ra một giá trị mới. <code>y = -x;</code> để nguyên <code>x</code>.</li>
<li><strong><code>+ - *</code> hai ngôi</strong> — cộng, trừ, nhân thông thường. Không có gì bất ngờ cho tới khi kiểu toán hạng khác nhau (slide 55–59).</li>
<li><strong>Cái không được phép sai: <code>/</code></strong> — "get the quotient of a division". Với hai số nguyên thì đó là chia <em>nguyên</em>, phần thập phân bị vứt bỏ. Chính số liệu trên slide: <code>z = 10/3;</code> → <strong>3</strong>, nhưng <code>z = 10.0/3;</code> → <strong>3,3333333</strong>. Một dấu chấm thập phân đổi hết mọi thứ.</li>
<li><strong><code>%</code> — lấy dư, CHỈ cho số nguyên</strong> — <code>17%3</code> → <strong>2</strong>. Còn <code>15.0 % 3</code> → <strong>LỖI</strong>, đúng như slide ghi: <code>%</code> không định nghĩa cho toán hạng số thực và trình biên dịch từ chối dịch.</li>
<li><strong><code>++</code> và <code>--</code></strong> — "increase/decrease the value of a variable (prefix/postfix)". Đây là hai toán tử DUY NHẤT trong bảng này <em>làm đổi</em> toán hạng của chính nó. Chính sự thật đó là câu hỏi tổng kết ở slide 61.</li>
</ul>
<pre><code>printf("%d %g %d\\n", 10/3, 10.0/3, 17%3);   /* 3 3.33333 2 */
/* float a = 15.0;  a % 3   -- không dịch được */</code></pre>
<p class="dap-an">✅ Đã kiểm bằng biên dịch thật: <code>10/3</code> = 3 · <code>10.0/3</code> = 3.333333 · <code>17%3</code> = 2 · <code>float a = 15.0; a % 3;</code> → <em>error: invalid operands to binary expression ('float' and 'int')</em>. ⚠️ Slide gốc của trường có một lỗi chép nhầm trong bảng này: cột Example của dòng <code>* /</code> ghi <code>z = x-y;</code>, nhưng dòng đó đang minh hoạ phép NHÂN nên phải là <code>z = x*y;</code>. Các ví dụ số bên dưới (<code>10/3</code>, <code>10.0/3</code>) thì đúng.</p>
<p class="pitfall">⚠️ Toán hạng âm: C99 cắt <em>về phía 0</em>. <code>-7/2</code> = <strong>-3</strong> (không phải -4) và <code>-7%2</code> = <strong>-1</strong> (không phải +1). Dấu của <code>%</code> theo toán hạng <em>bên trái</em>: <code>7%-2</code> = <strong>+1</strong>. Cả ba đều đã kiểm bằng biên dịch.</p>`],

      [48, '1. Arithmetic Operators — Example 1',
        `<p class="y-chinh">🎯 The first demo program on screen: the same five arithmetic operators applied to the same operands, so you can see integer division and remainder side by side with real division.</p>
<ul>
<li><strong>What the slide is doing</strong> — declaring a couple of numeric variables, applying <code>+ - * / %</code> to them, and printing each result. The whole point is the contrast between the <code>/</code> line and the <code>%</code> line.</li>
<li><strong>Write it yourself and run it</strong> — that is the only way this slide teaches anything. Here is a faithful version you can compile:
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    int x = 10, y = 3;
    printf("x + y = %d\\n", x + y);
    printf("x - y = %d\\n", x - y);
    printf("x * y = %d\\n", x * y);
    printf("x / y = %d\\n", x / y);      /* integer division */
    printf("x %% y = %d\\n", x % y);     /* remainder        */
    printf("real  = %f\\n", (double)x / y);
    return 0;
}</code></pre></li>
<li><strong>Printing a literal percent</strong> — inside <code>printf</code> you must write <code>%%</code> to get one <code>%</code> on screen. Writing a bare <code>%</code> followed by a space is a malformed conversion specification.</li>
<li><strong>The identity worth memorising</strong> — for positive integers, <code>x == (x/y)*y + x%y</code>. Check it: <code>(10/3)*3 + 10%3 = 3*3 + 1 = 10</code>. ✔ This identity is what <code>/</code> and <code>%</code> are <em>defined</em> to satisfy, which is exactly why they truncate toward zero together.</li>
<li><strong>Everyday uses of <code>%</code></strong> — <code>n % 2 == 0</code> tests even; <code>n % 10</code> extracts the last decimal digit; <code>n / 10</code> drops it. Those two lines are the engine of every "sum the digits" exercise in this course.</li>
</ul>
<p class="dap-an">✅ Compiled and run, the program above prints: <code>x + y = 13</code> · <code>x - y = 7</code> · <code>x * y = 30</code> · <code>x / y = 3</code> · <code>x % y = 1</code> · <code>real = 3.333333</code>.</p>
<p class="meo">💡 Whenever you actually want the fractional answer, cast <em>one</em> operand, do not cast the result: <code>(double)x / y</code> gives 3.333333, but <code>(double)(x / y)</code> gives 3.000000 because the damage is already done inside the parentheses.</p>`,
        `<p class="y-chinh">🎯 Chương trình minh hoạ đầu tiên trên màn hình: cùng năm toán tử số học áp lên cùng bộ toán hạng, để bạn thấy chia nguyên và lấy dư nằm cạnh chia thực.</p>
<ul>
<li><strong>Slide đang làm gì</strong> — khai báo vài biến số, áp <code>+ - * / %</code> lên chúng, rồi in từng kết quả. Toàn bộ ý nghĩa nằm ở chỗ đối chiếu dòng <code>/</code> với dòng <code>%</code>.</li>
<li><strong>Tự gõ lại và chạy</strong> — đó là cách duy nhất slide này dạy được điều gì. Đây là bản trung thành bạn biên dịch được ngay:
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    int x = 10, y = 3;
    printf("x + y = %d\\n", x + y);
    printf("x - y = %d\\n", x - y);
    printf("x * y = %d\\n", x * y);
    printf("x / y = %d\\n", x / y);      /* chia nguyên */
    printf("x %% y = %d\\n", x % y);     /* lấy dư      */
    printf("real  = %f\\n", (double)x / y);
    return 0;
}</code></pre></li>
<li><strong>In ra dấu phần trăm</strong> — trong <code>printf</code> phải viết <code>%%</code> mới ra một dấu <code>%</code> trên màn hình. Viết một dấu <code>%</code> trơ trọi là một đặc tả chuyển đổi hỏng.</li>
<li><strong>Đẳng thức đáng thuộc</strong> — với số nguyên dương, <code>x == (x/y)*y + x%y</code>. Kiểm thử: <code>(10/3)*3 + 10%3 = 3*3 + 1 = 10</code>. ✔ Đẳng thức này chính là thứ mà <code>/</code> và <code>%</code> được <em>định nghĩa</em> để thoả, và cũng vì thế chúng cùng cắt về phía 0.</li>
<li><strong>Công dụng đời thường của <code>%</code></strong> — <code>n % 2 == 0</code> kiểm số chẵn; <code>n % 10</code> lấy chữ số hàng đơn vị; <code>n / 10</code> bỏ nó đi. Hai dòng đó là động cơ của mọi bài "tính tổng các chữ số" trong môn này.</li>
</ul>
<p class="dap-an">✅ Biên dịch và chạy thật, chương trình trên in ra: <code>x + y = 13</code> · <code>x - y = 7</code> · <code>x * y = 30</code> · <code>x / y = 3</code> · <code>x % y = 1</code> · <code>real = 3.333333</code>.</p>
<p class="meo">💡 Khi thật sự muốn phần thập phân, hãy ép kiểu <em>một</em> toán hạng, đừng ép kết quả: <code>(double)x / y</code> cho 3.333333, còn <code>(double)(x / y)</code> cho 3.000000 vì trong ngoặc thì mất mát đã xảy ra rồi.</p>`],

      [49, '1. Arithmetic Operators — Example 2 (++, --, and a performance note)',
        `<p class="y-chinh">🎯 The second demo is the prefix/postfix one, and the slide deliberately refuses to explain the output: "Explain yourself the output ?"</p>
<ul>
<li><strong>The rule in one line</strong> — <code>x++</code> yields the <em>old</em> value then increments; <code>++x</code> increments then yields the <em>new</em> value. Either way <code>x</code> ends up one larger; only the value handed to the surrounding expression differs.</li>
<li><strong>Traced step by step</strong> —
<pre><code>int x = 5, y;
y = x++;   /* y gets 5, then x becomes 6  =&gt; y=5 x=6 */
x = 5;
y = ++x;   /* x becomes 6, then y gets 6  =&gt; y=6 x=6 */</code></pre></li>
<li><strong>As a statement on its own they are identical</strong> — <code>x++;</code> and <code>++x;</code> on a line by themselves both just add one. The difference only shows up when the expression's <em>value</em> is used.</li>
<li><strong>The slide's "Statistic" box</strong> — "Multiply &gt; Division. Integral operations &gt; floating-point ones." Read as speed: multiplication is faster than division, and integer arithmetic is faster than floating-point. Hence the classic trick of writing <code>x * 0.5</code> instead of <code>x / 2.0</code>.</li>
<li><strong>How true is that today</strong> — directionally still true (integer divide is one of the slowest single instructions on a modern CPU, and float ops carry more latency), but modern compilers already rewrite <code>x/2.0</code> into a multiply for you. Treat it as a reason to understand the hardware, not as a licence to write unreadable code.</li>
</ul>
<p class="dap-an">✅ Verified by compiling: <code>y = x++;</code> with <code>x=5</code> leaves <strong>y=5, x=6</strong>; <code>y = ++x;</code> with <code>x=5</code> leaves <strong>y=6, x=6</strong>. And <code>printf("%d", x++)</code> prints <strong>5</strong>, leaving x=6; <code>printf("%d", ++x)</code> prints <strong>6</strong>, leaving x=6.</p>
<p class="pitfall">⚠️ Never put two changes to the same variable in one expression: <code>i = i++ + ++i;</code> or <code>printf("%d %d", x++, x)</code> is <strong>undefined behaviour</strong> in C — the compiler may produce any answer, and gcc/clang warn <em>"unsequenced modification and access"</em>. Exam questions that look like this have no correct answer; real code must split them into separate statements.</p>`,
        `<p class="y-chinh">🎯 Chương trình minh hoạ thứ hai là bài về prefix/postfix, và slide cố tình không giải thích kết quả: "Explain yourself the output ?"</p>
<ul>
<li><strong>Luật gói trong một dòng</strong> — <code>x++</code> trả về giá trị <em>cũ</em> rồi mới tăng; <code>++x</code> tăng trước rồi trả về giá trị <em>mới</em>. Kiểu nào thì <code>x</code> cũng lớn hơn 1 đơn vị; chỉ khác ở giá trị được đưa cho biểu thức bao quanh.</li>
<li><strong>Chạy tay từng bước</strong> —
<pre><code>int x = 5, y;
y = x++;   /* y nhận 5, rồi x thành 6  =&gt; y=5 x=6 */
x = 5;
y = ++x;   /* x thành 6, rồi y nhận 6  =&gt; y=6 x=6 */</code></pre></li>
<li><strong>Đứng riêng thành câu lệnh thì hai cái y hệt nhau</strong> — <code>x++;</code> và <code>++x;</code> nằm một mình trên một dòng đều chỉ cộng thêm 1. Khác biệt chỉ lộ ra khi <em>giá trị</em> của biểu thức được dùng.</li>
<li><strong>Ô "Statistic" trên slide</strong> — "Multiply &gt; Division. Integral operations &gt; floating-point ones." Hiểu theo tốc độ: nhân nhanh hơn chia, và số học số nguyên nhanh hơn số thực. Từ đó có mẹo kinh điển viết <code>x * 0.5</code> thay cho <code>x / 2.0</code>.</li>
<li><strong>Điều đó còn đúng đến đâu ngày nay</strong> — về xu hướng vẫn đúng (chia số nguyên là một trong những lệnh chậm nhất của CPU hiện đại, và phép số thực có độ trễ cao hơn), nhưng trình biên dịch ngày nay đã tự đổi <code>x/2.0</code> thành phép nhân giúp bạn rồi. Hãy coi đó là lý do để hiểu phần cứng, không phải giấy phép để viết code khó đọc.</li>
</ul>
<p class="dap-an">✅ Đã kiểm bằng biên dịch thật: <code>y = x++;</code> với <code>x=5</code> để lại <strong>y=5, x=6</strong>; <code>y = ++x;</code> với <code>x=5</code> để lại <strong>y=6, x=6</strong>. Và <code>printf("%d", x++)</code> in ra <strong>5</strong>, còn lại x=6; <code>printf("%d", ++x)</code> in ra <strong>6</strong>, còn lại x=6.</p>
<p class="pitfall">⚠️ Đừng bao giờ đặt hai lần thay đổi cùng một biến trong một biểu thức: <code>i = i++ + ++i;</code> hay <code>printf("%d %d", x++, x)</code> là <strong>hành vi không xác định</strong> trong C — trình biên dịch được phép cho ra đáp số bất kỳ, và gcc/clang cảnh báo <em>"unsequenced modification and access"</em>. Câu hỏi thi trông giống thế này thì không có đáp án đúng; code thật phải tách thành các câu lệnh riêng.</p>`],

      [50, '2. Relational Operators',
        `<p class="y-chinh">🎯 Six comparison operators — <code>&lt;</code> <code>&lt;=</code> <code>==</code> <code>&gt;=</code> <code>&gt;</code> <code>!=</code> — and each of them returns <strong>1 for true, 0 for false</strong>, as an <code>int</code>.</p>
<ul>
<li><strong>They return a number, not a "boolean"</strong> — C89 has no <code>bool</code> type. A comparison is an ordinary <code>int</code> expression with value 1 or 0, which is exactly why <code>printf("%d", 3 &lt; 5)</code> prints <code>1</code> and why you can write <code>total += (mark &gt;= 5);</code> to count passes.</li>
<li><strong>The reverse direction</strong> — when C <em>tests</em> a value (in <code>if</code>, <code>while</code>, <code>&amp;&amp;</code>), the rule is: <strong>0 is false, every non-zero value is true</strong>. Not "1 is true". <code>-7</code> is true. <code>0.0</code> is false.</li>
<li><strong><code>==</code> versus <code>=</code></strong> — the single most expensive typo in C. <code>if (x = 5)</code> <em>assigns</em> 5 to x and then tests 5, which is non-zero, so the branch <em>always</em> runs and x is destroyed. <code>if (x == 5)</code> compares. Modern compilers warn, but only if you enable warnings.</li>
<li><strong>Two spellings, one token</strong> — <code>&lt;=</code> and <code>&gt;=</code> and <code>!=</code> and <code>==</code> are single tokens; a space inside them (<code>&lt; =</code>) is a syntax error. And there is no <code>=&lt;</code> or <code>=&gt;</code> operator in C.</li>
<li><strong>Do not chain them mathematically</strong> — <code>0 &lt; x &lt; 10</code> is legal C but does not mean what maths means; see slide 60 where the deck makes this its exam question. Write <code>0 &lt; x &amp;&amp; x &lt; 10</code>.</li>
<li><strong>Never use <code>==</code> on floats</strong> — <code>0.1 + 0.2 == 0.3</code> is <em>false</em> in IEEE-754. Compare with a tolerance: <code>fabs(a - b) &lt; 1e-9</code>.</li>
</ul>
<pre><code>int x = 7;
printf("%d %d %d\\n", x &gt; 5, x == 5, x != 5);   /* 1 0 1 */</code></pre>
<p class="dap-an">✅ Evaluating the slide's own earlier example <code>45 &gt; 5*x</code> for <code>x = 8</code>: <code>5*8 = 40</code> → <code>45 &gt; 40</code> → true → the expression's value is <strong>1</strong>. For <code>x = 9</code>: <code>45 &gt; 45</code> → false → <strong>0</strong>.</p>
<p class="meo">💡 Because a comparison <em>is</em> a number, <code>if (found == 1)</code> and <code>if (found)</code> mean the same thing when <code>found</code> came from a comparison — and the second one keeps working if <code>found</code> later holds a count instead of a flag.</p>`,
        `<p class="y-chinh">🎯 Sáu toán tử so sánh — <code>&lt;</code> <code>&lt;=</code> <code>==</code> <code>&gt;=</code> <code>&gt;</code> <code>!=</code> — và mỗi cái trả về <strong>1 nếu đúng, 0 nếu sai</strong>, kiểu <code>int</code>.</p>
<ul>
<li><strong>Chúng trả về một con số, không phải "boolean"</strong> — C89 không có kiểu <code>bool</code>. Một phép so sánh là biểu thức <code>int</code> bình thường mang giá trị 1 hoặc 0, chính vì thế <code>printf("%d", 3 &lt; 5)</code> in ra <code>1</code> và bạn viết được <code>total += (mark &gt;= 5);</code> để đếm số môn đạt.</li>
<li><strong>Chiều ngược lại</strong> — khi C <em>kiểm tra</em> một giá trị (trong <code>if</code>, <code>while</code>, <code>&amp;&amp;</code>), luật là: <strong>0 là sai, MỌI giá trị khác 0 đều là đúng</strong>. Không phải "1 mới là đúng". <code>-7</code> là đúng. <code>0.0</code> là sai.</li>
<li><strong><code>==</code> so với <code>=</code></strong> — lỗi gõ nhầm đắt nhất trong C. <code>if (x = 5)</code> là GÁN 5 cho x rồi kiểm tra 5, mà 5 khác 0 nên nhánh <em>luôn luôn</em> chạy và x bị phá. <code>if (x == 5)</code> mới là so sánh. Trình biên dịch nay có cảnh báo, nhưng chỉ khi bạn bật cảnh báo.</li>
<li><strong>Hai ký tự, một token</strong> — <code>&lt;=</code>, <code>&gt;=</code>, <code>!=</code>, <code>==</code> là token đơn; chèn dấu cách vào giữa (<code>&lt; =</code>) là lỗi cú pháp. Và C không có toán tử <code>=&lt;</code> hay <code>=&gt;</code>.</li>
<li><strong>Đừng nối chuỗi so sánh theo kiểu toán học</strong> — <code>0 &lt; x &lt; 10</code> hợp lệ trong C nhưng KHÔNG mang nghĩa toán học; xem slide 60, chỗ bộ slide lấy đúng chuyện này làm câu hỏi thi. Phải viết <code>0 &lt; x &amp;&amp; x &lt; 10</code>.</li>
<li><strong>Đừng bao giờ dùng <code>==</code> với số thực</strong> — <code>0.1 + 0.2 == 0.3</code> là <em>sai</em> trong IEEE-754. So sánh có sai số: <code>fabs(a - b) &lt; 1e-9</code>.</li>
</ul>
<pre><code>int x = 7;
printf("%d %d %d\\n", x &gt; 5, x == 5, x != 5);   /* 1 0 1 */</code></pre>
<p class="dap-an">✅ Tính ví dụ mà chính bộ slide đã nêu ở slide 46, <code>45 &gt; 5*x</code>, với <code>x = 8</code>: <code>5*8 = 40</code> → <code>45 &gt; 40</code> → đúng → giá trị biểu thức là <strong>1</strong>. Với <code>x = 9</code>: <code>45 &gt; 45</code> → sai → <strong>0</strong>.</p>
<p class="meo">💡 Vì một phép so sánh CHÍNH LÀ một con số, <code>if (found == 1)</code> và <code>if (found)</code> nghĩa như nhau khi <code>found</code> lấy từ một phép so sánh — và cách thứ hai vẫn chạy đúng nếu sau này <code>found</code> chứa số đếm thay vì cờ.</p>`],

      [51, '3. Logical Operators',
        `<p class="y-chinh">🎯 Three operators for joining conditions: <code>&amp;&amp;</code> (and), <code>||</code> (or), <code>!</code> (not) — each returning <strong>1 for true, 0 for false</strong>.</p>
<ul>
<li><strong>The truth tables, compressed</strong> — <code>a &amp;&amp; b</code> is 1 only when both operands are non-zero. <code>a || b</code> is 1 when at least one is non-zero. <code>!a</code> is 1 when <code>a</code> is 0, and 0 otherwise.</li>
<li><strong>Short-circuit evaluation — the feature that matters</strong> — <code>&amp;&amp;</code> stops as soon as the left side is false; <code>||</code> stops as soon as the left side is true. The right-hand side is then <em>never evaluated at all</em>, side effects included.</li>
<li><strong>Why short-circuit is not a micro-optimisation but a safety device</strong> —
<pre><code>if (n != 0 &amp;&amp; total / n &gt; 5)     /* safe: no division by zero    */
if (total / n &gt; 5 &amp;&amp; n != 0)     /* CRASHES when n == 0          */</code></pre>
The order of the two tests is load-bearing. This idiom is everywhere in real C (and later, <code>p != NULL &amp;&amp; p-&gt;field</code>).</li>
<li><strong>Normalisation</strong> — <code>!!x</code> turns any non-zero into exactly 1. Useful when a function must return a clean flag.</li>
<li><strong>Precedence among the three</strong> — <code>!</code> binds tightest (it is a unary operator, above <code>*</code>), then <code>&amp;&amp;</code>, then <code>||</code>. So <code>a || b &amp;&amp; c</code> means <code>a || (b &amp;&amp; c)</code>, exactly like "or" being looser than "and" in logic.</li>
<li><strong>Relational binds tighter than logical</strong> — <code>x &gt; 0 &amp;&amp; x &lt; 10</code> needs no parentheses at all; it already parses as <code>(x &gt; 0) &amp;&amp; (x &lt; 10)</code>.</li>
</ul>
<p class="dap-an">✅ Short-circuit proved by compiling: <code>int i = 0; r = (0 &amp;&amp; ++i);</code> → r = 0 and <strong>i is still 0</strong> — <code>++i</code> never ran. Likewise <code>int j = 0; r = (1 || ++j);</code> → r = 1 and <strong>j is still 0</strong>.</p>
<p class="pitfall">⚠️ <code>&amp;</code> is <em>not</em> a typo-tolerant <code>&amp;&amp;</code>. Verified by compiling: <code>2 &amp; 1</code> = <strong>0</strong> (binary 10 AND 01 = 00) but <code>2 &amp;&amp; 1</code> = <strong>1</strong> (both non-zero). Similarly <code>4 | 2</code> = <strong>6</strong> while <code>4 || 2</code> = <strong>1</strong>. Drop one character and the answer changes silently, with no warning and no crash.</p>`,
        `<p class="y-chinh">🎯 Ba toán tử để nối các điều kiện: <code>&amp;&amp;</code> (và), <code>||</code> (hoặc), <code>!</code> (phủ định) — mỗi cái trả về <strong>1 nếu đúng, 0 nếu sai</strong>.</p>
<ul>
<li><strong>Bảng chân trị, nén gọn</strong> — <code>a &amp;&amp; b</code> bằng 1 chỉ khi cả hai toán hạng khác 0. <code>a || b</code> bằng 1 khi có ít nhất một cái khác 0. <code>!a</code> bằng 1 khi <code>a</code> bằng 0, ngược lại bằng 0.</li>
<li><strong>Đoản mạch (short-circuit) — tính chất đáng nhớ nhất</strong> — <code>&amp;&amp;</code> dừng ngay khi vế trái sai; <code>||</code> dừng ngay khi vế trái đúng. Khi đó vế phải <em>hoàn toàn không được tính</em>, kể cả các tác dụng phụ trong đó.</li>
<li><strong>Vì sao đoản mạch không phải mẹo tối ưu vặt mà là thiết bị an toàn</strong> —
<pre><code>if (n != 0 &amp;&amp; total / n &gt; 5)     /* an toàn: không chia cho 0      */
if (total / n &gt; 5 &amp;&amp; n != 0)     /* SẬP khi n == 0                 */</code></pre>
Thứ tự hai phép kiểm là thứ chịu lực. Thành ngữ này có mặt khắp code C thật (và về sau là <code>p != NULL &amp;&amp; p-&gt;field</code>).</li>
<li><strong>Chuẩn hoá về 0/1</strong> — <code>!!x</code> biến mọi giá trị khác 0 thành đúng 1. Hữu ích khi hàm phải trả về một lá cờ sạch.</li>
<li><strong>Thứ tự ưu tiên giữa ba cái</strong> — <code>!</code> chặt nhất (nó là toán tử một ngôi, đứng trên cả <code>*</code>), rồi tới <code>&amp;&amp;</code>, rồi <code>||</code>. Nên <code>a || b &amp;&amp; c</code> có nghĩa là <code>a || (b &amp;&amp; c)</code>, đúng như "hoặc" lỏng hơn "và" trong logic.</li>
<li><strong>Quan hệ chặt hơn logic</strong> — <code>x &gt; 0 &amp;&amp; x &lt; 10</code> không cần ngoặc gì cả; nó đã tự phân tích thành <code>(x &gt; 0) &amp;&amp; (x &lt; 10)</code>.</li>
</ul>
<p class="dap-an">✅ Đoản mạch đã chứng minh bằng biên dịch thật: <code>int i = 0; r = (0 &amp;&amp; ++i);</code> → r = 0 và <strong>i vẫn bằng 0</strong> — <code>++i</code> chưa hề chạy. Tương tự <code>int j = 0; r = (1 || ++j);</code> → r = 1 và <strong>j vẫn bằng 0</strong>.</p>
<p class="pitfall">⚠️ <code>&amp;</code> KHÔNG phải là <code>&amp;&amp;</code> viết thiếu mà vẫn chạy đúng. Đã kiểm bằng biên dịch: <code>2 &amp; 1</code> = <strong>0</strong> (nhị phân 10 AND 01 = 00) nhưng <code>2 &amp;&amp; 1</code> = <strong>1</strong> (cả hai khác 0). Tương tự <code>4 | 2</code> = <strong>6</strong> còn <code>4 || 2</code> = <strong>1</strong>. Rơi mất một ký tự là đáp số đổi âm thầm, không cảnh báo, không sập.</p>`],

      [52, '4. Bitwise Operators',
        `<p class="y-chinh">🎯 Six operators that work on the individual <em>bits</em> of an integer: <code>&amp;</code> (and), <code>|</code> (or), <code>^</code> (xor), <code>&lt;&lt;</code> (left shift), <code>&gt;&gt;</code> (right shift), <code>~</code> (invert).</p>
<ul>
<li><strong>How they differ from the logical ones</strong> — the slide says it precisely: <code>&amp;</code>, <code>|</code>, <code>^</code> "will act on a pair of bits at the same position in 2 operands". Bit 0 with bit 0, bit 1 with bit 1, and so on — sixteen independent little decisions, not one.</li>
<li><strong>The slide's worked example, <code>n = 12</code>, <code>m = 8</code></strong> (shown as 16-bit patterns) —
<pre><code>n = 12 :  0000 0000 0000 1100
m =  8 :  0000 0000 0000 1000
n &amp; m  :  0000 0000 0000 1000   =  8   (1 only where BOTH are 1)
n | m  :  0000 0000 0000 1100   = 12   (1 where EITHER is 1)
n ^ m  :  0000 0000 0000 0100   =  4   (1 where they DIFFER)</code></pre></li>
<li><strong>The shifts</strong> — <code>&lt;&lt;</code> "left shift bits of the operand (operands unchanged)"; <code>&gt;&gt;</code> "right shift bits of the operand (operands unchanged, the sign is preserved)". Note "operands unchanged": <code>n &lt;&lt; 1</code> produces a new value, it does not modify <code>n</code>. To modify, write <code>n &lt;&lt;= 1</code>.</li>
<li><strong><code>~</code> inverts every bit</strong> — and because integers are stored in two's complement, <code>~n == -n - 1</code>. So <code>~12</code> = <strong>-13</strong>, not 3 and not 65523.</li>
<li><strong>What they are actually for</strong> — flags packed into one integer. <code>flags | MASK</code> turns a bit on, <code>flags &amp; ~MASK</code> turns it off, <code>flags &amp; MASK</code> tests it, <code>flags ^ MASK</code> toggles it. That is how file permissions, graphics colours and hardware registers are handled.</li>
</ul>
<p class="dap-an">✅ All three slide results verified by compiling: <code>12 &amp; 8</code> = <strong>8</strong> · <code>12 | 8</code> = <strong>12</strong> · <code>12 ^ 8</code> = <strong>4</strong>. Also <code>~12</code> = <strong>-13</strong>. The slide's binary drawings are correct.</p>
<p class="pitfall">⚠️ Two independent traps. (1) <code>&amp;</code> vs <code>&amp;&amp;</code> again — <code>12 &amp; 8</code> is 8 but <code>12 &amp;&amp; 8</code> is 1. (2) Bitwise operators sit <em>below</em> the relational ones in precedence, which is a famous C design wart: <code>x &amp; 1 == 0</code> parses as <code>x &amp; (1 == 0)</code> = <code>x &amp; 0</code> = 0, always. You must write <code>(x &amp; 1) == 0</code>.</p>`,
        `<p class="y-chinh">🎯 Sáu toán tử làm việc trên từng <em>bit</em> của một số nguyên: <code>&amp;</code> (và), <code>|</code> (hoặc), <code>^</code> (xor), <code>&lt;&lt;</code> (dịch trái), <code>&gt;&gt;</code> (dịch phải), <code>~</code> (đảo bit).</p>
<ul>
<li><strong>Khác toán tử logic ở chỗ nào</strong> — slide nói rất chính xác: <code>&amp;</code>, <code>|</code>, <code>^</code> "will act on a pair of bits at the same position in 2 operands" — bit 0 với bit 0, bit 1 với bit 1, v.v. Mười sáu quyết định nhỏ độc lập, không phải một.</li>
<li><strong>Ví dụ đã giải trên slide, <code>n = 12</code>, <code>m = 8</code></strong> (vẽ dạng 16 bit) —
<pre><code>n = 12 :  0000 0000 0000 1100
m =  8 :  0000 0000 0000 1000
n &amp; m  :  0000 0000 0000 1000   =  8   (là 1 chỉ khi CẢ HAI là 1)
n | m  :  0000 0000 0000 1100   = 12   (là 1 khi CÓ MỘT bên là 1)
n ^ m  :  0000 0000 0000 0100   =  4   (là 1 khi hai bên KHÁC nhau)</code></pre></li>
<li><strong>Hai phép dịch</strong> — <code>&lt;&lt;</code> "left shift bits of the operand (operands unchanged)"; <code>&gt;&gt;</code> "right shift bits of the operand (operands unchanged, the sign is preserved)". Để ý chữ "operands unchanged": <code>n &lt;&lt; 1</code> sinh ra giá trị mới chứ KHÔNG sửa <code>n</code>. Muốn sửa thì viết <code>n &lt;&lt;= 1</code>.</li>
<li><strong><code>~</code> đảo mọi bit</strong> — và vì số nguyên lưu theo bù hai nên <code>~n == -n - 1</code>. Vậy <code>~12</code> = <strong>-13</strong>, không phải 3 và cũng không phải 65523.</li>
<li><strong>Chúng thật ra để làm gì</strong> — gói nhiều lá cờ vào một số nguyên. <code>flags | MASK</code> bật một bit, <code>flags &amp; ~MASK</code> tắt nó, <code>flags &amp; MASK</code> kiểm tra nó, <code>flags ^ MASK</code> lật nó. Quyền truy cập tệp, màu đồ hoạ và thanh ghi phần cứng đều xử lý theo cách đó.</li>
</ul>
<p class="dap-an">✅ Cả ba kết quả trên slide đã kiểm bằng biên dịch thật: <code>12 &amp; 8</code> = <strong>8</strong> · <code>12 | 8</code> = <strong>12</strong> · <code>12 ^ 8</code> = <strong>4</strong>. Thêm <code>~12</code> = <strong>-13</strong>. Các hình vẽ nhị phân trên slide là đúng.</p>
<p class="pitfall">⚠️ Hai cái bẫy độc lập nhau. (1) Lại là <code>&amp;</code> với <code>&amp;&amp;</code> — <code>12 &amp; 8</code> bằng 8 nhưng <code>12 &amp;&amp; 8</code> bằng 1. (2) Toán tử bit có độ ưu tiên THẤP HƠN toán tử quan hệ, một khuyết tật thiết kế nổi tiếng của C: <code>x &amp; 1 == 0</code> được hiểu là <code>x &amp; (1 == 0)</code> = <code>x &amp; 0</code> = 0, luôn luôn. Phải viết <code>(x &amp; 1) == 0</code>.</p>`],

      [53, '4. Bitwise Operators (cont.) — shifting, and what happens to the sign',
        `<p class="y-chinh">🎯 Shifting by one position is multiplying or dividing by 2 — and on the right shift the <em>sign bit</em> is copied back in, which is why shifting a negative number is not the same as shifting its magnitude.</p>
<ul>
<li><strong>Left shift, <code>n = 12</code>, <code>n &lt;&lt; 1</code></strong> — every bit moves one place to the left and a <code>0</code> is fed in at the right:
<pre><code>n      :  0000 0000 0000 1100   = 12
n &lt;&lt; 1 :  0000 0000 0001 1000   = 24</code></pre>
The slide's own note: "Left shift 1 bit: multiply by 2". In general <code>n &lt;&lt; k</code> = <code>n * 2^k</code>.</li>
<li><strong>Right shift, <code>n = 12</code>, <code>n &gt;&gt; 1</code></strong> — every bit moves one place right, the rightmost bit falls off the end, and the <em>sign</em> (here 0) is copied into the vacated leftmost position:
<pre><code>n      :  0000 0000 0000 1100   = 12
n &gt;&gt; 1 :  0000 0000 0000 0110   =  6</code></pre>
So <code>n &gt;&gt; k</code> = <code>n / 2^k</code> for non-negative <code>n</code>.</li>
<li><strong>The negative case, <code>k = -1</code></strong> — the slide first shows how -1 is stored: take <code>1</code> = <code>0000 0000 0000 0001</code>, take the two's complement, get <code>1111 1111 1111 1111</code>. Now shift right: the sign bit is 1, so a 1 is copied in, and you get <code>1111 1111 1111 1111</code> again — still -1.</li>
<li><strong>Why -1 is a fixed point</strong> — arithmetic right shift rounds <em>down</em> (toward minus infinity), not toward zero like <code>/</code>. <code>-1 / 2</code> is 0, but <code>-1 &gt;&gt; 1</code> is -1. Those two are <strong>not</strong> interchangeable for negative numbers.</li>
<li><strong>Standard-level caveat</strong> — "the sign is preserved" describes what gcc/clang actually do (arithmetic shift), but the C standard calls right-shifting a negative value <em>implementation-defined</em>. Shifting unsigned values is always well defined, which is why systems code uses <code>unsigned</code> for bit work.</li>
</ul>
<p class="dap-an">✅ Verified by compiling: <code>12 &lt;&lt; 1</code> = <strong>24</strong> · <code>12 &gt;&gt; 1</code> = <strong>6</strong> · <code>(-1) &gt;&gt; 1</code> = <strong>-1</strong>. ⚠️ Note on the source slide: the bit strings in the -1 column are garbled by the PowerPoint-to-text conversion (you will see fragments like <code>1111 1111 1111</code> and <code>111 1111 1 111 1111</code> with the wrong number of digits), and the final label is printed as "(-110)", which is a mangled "-1₁₀" — i.e. the value −1 written in base 10. The <em>result</em> the slide is teaching (-1 &gt;&gt; 1 = -1) is correct; only its typography is broken.</p>
<p class="pitfall">⚠️ Shifting by a negative amount, or by more bits than the type has (<code>x &lt;&lt; 32</code> on a 32-bit <code>int</code>), is undefined behaviour — not "zero". And <code>1 &lt;&lt; 31</code> on a signed 32-bit <code>int</code> overflows; write <code>1u &lt;&lt; 31</code>.</p>`,
        `<p class="y-chinh">🎯 Dịch một vị trí chính là nhân hoặc chia cho 2 — và khi dịch phải thì <em>bit dấu</em> được chép trở lại vào, nên dịch một số âm không giống dịch phần độ lớn của nó.</p>
<ul>
<li><strong>Dịch trái, <code>n = 12</code>, <code>n &lt;&lt; 1</code></strong> — mọi bit dời sang trái một chỗ và một số <code>0</code> được đẩy vào bên phải:
<pre><code>n      :  0000 0000 0000 1100   = 12
n &lt;&lt; 1 :  0000 0000 0001 1000   = 24</code></pre>
Chính slide ghi: "Left shift 1 bit: multiply by 2". Tổng quát <code>n &lt;&lt; k</code> = <code>n * 2^k</code>.</li>
<li><strong>Dịch phải, <code>n = 12</code>, <code>n &gt;&gt; 1</code></strong> — mọi bit dời sang phải một chỗ, bit ngoài cùng bên phải rơi ra ngoài, và <em>dấu</em> (ở đây là 0) được chép vào chỗ trống ngoài cùng bên trái:
<pre><code>n      :  0000 0000 0000 1100   = 12
n &gt;&gt; 1 :  0000 0000 0000 0110   =  6</code></pre>
Vậy <code>n &gt;&gt; k</code> = <code>n / 2^k</code> với <code>n</code> không âm.</li>
<li><strong>Trường hợp số âm, <code>k = -1</code></strong> — slide trình bày trước cách lưu -1: lấy <code>1</code> = <code>0000 0000 0000 0001</code>, lấy bù hai, được <code>1111 1111 1111 1111</code>. Giờ dịch phải: bit dấu là 1 nên một số 1 được chép vào, và ta lại được <code>1111 1111 1111 1111</code> — vẫn là -1.</li>
<li><strong>Vì sao -1 là điểm bất động</strong> — dịch phải số học làm tròn <em>xuống</em> (về phía âm vô cùng), không cắt về phía 0 như <code>/</code>. <code>-1 / 2</code> bằng 0, nhưng <code>-1 &gt;&gt; 1</code> bằng -1. Hai cái đó <strong>không</strong> thay thế cho nhau với số âm.</li>
<li><strong>Nói cho đúng chuẩn</strong> — "the sign is preserved" mô tả đúng cái gcc/clang thật sự làm (dịch số học), nhưng chuẩn C xếp việc dịch phải một giá trị âm vào loại <em>implementation-defined</em>. Dịch số <code>unsigned</code> thì luôn được định nghĩa rõ ràng, và đó là lý do code hệ thống dùng <code>unsigned</code> khi làm việc với bit.</li>
</ul>
<p class="dap-an">✅ Đã kiểm bằng biên dịch thật: <code>12 &lt;&lt; 1</code> = <strong>24</strong> · <code>12 &gt;&gt; 1</code> = <strong>6</strong> · <code>(-1) &gt;&gt; 1</code> = <strong>-1</strong>. ⚠️ Ghi chú về slide gốc: các dãy bit ở cột -1 bị vỡ khi chuyển từ PowerPoint sang chữ (bạn sẽ thấy những mẩu như <code>1111 1111 1111</code> và <code>111 1111 1 111 1111</code> với số chữ số không khớp), và nhãn cuối in ra là "(-110)", thực chất là "-1₁₀" bị dính chữ — tức giá trị −1 viết ở hệ 10. <em>Kết quả</em> mà slide muốn dạy (-1 &gt;&gt; 1 = -1) thì đúng; chỉ phần trình bày bị hỏng.</p>
<p class="pitfall">⚠️ Dịch với số lượng âm, hoặc nhiều bit hơn số bit của kiểu (<code>x &lt;&lt; 32</code> trên <code>int</code> 32 bit), là hành vi không xác định — không phải "bằng 0". Và <code>1 &lt;&lt; 31</code> trên <code>int</code> 32 bit có dấu là tràn số; hãy viết <code>1u &lt;&lt; 31</code>.</p>`],

      [54, '5. Assignment Operators — and the shorthand family',
        `<p class="y-chinh">🎯 The shape of an assignment is <code>Variable = expression</code>, and every arithmetic and bitwise operator has a shorthand form that folds the operation into the assignment.</p>
<ul>
<li><strong>Read <code>=</code> as "becomes", never as "equals"</strong> — the right side is evaluated first, then the result is stored into the variable on the left. That is why <code>x = x + 1;</code> is sensible C and nonsense in algebra.</li>
<li><strong>The shorthand table</strong> — <code>x += y</code> is <code>x = x + y</code>; likewise <code>-=</code>, <code>*=</code>, <code>/=</code>, <code>%=</code>, and the bitwise ones <code>&amp;=</code>, <code>|=</code>, <code>^=</code>, <code>&lt;&lt;=</code>, <code>&gt;&gt;=</code>. Ten in all.</li>
<li><strong>Why the shorthand exists</strong> — it names the variable once. <code>scores[i*2+1] += 10;</code> cannot go wrong; the long form makes you type the index twice and invites a typo.</li>
<li><strong>Traced example</strong> —
<pre><code>int s = 10;
s += 3;    /* s = 10 + 3  =&gt; 13 */
s *= 2;    /* s = 13 * 2  =&gt; 26 */
s %= 7;    /* s = 26 % 7  =&gt;  5 */</code></pre></li>
<li><strong>Assignment is an expression, and it associates right to left</strong> — <code>a = b = c = 5;</code> runs as <code>a = (b = (c = 5))</code>: c becomes 5, that expression's value 5 flows into b, then into a. All three end at 5.</li>
<li><strong>Its precedence is nearly the lowest</strong> — only the comma operator is lower. That is what lets you write <code>x = a + b * c;</code> with no parentheses: everything on the right finishes before <code>=</code> acts.</li>
<li><strong>The shorthand has a hidden cast</strong> — <code>x += 1.5</code> where <code>x</code> is <code>int</code> is <em>not</em> a compile error; it silently means <code>x = (int)(x + 1.5)</code>. The long form would warn about the narrowing; the short form does it quietly.</li>
</ul>
<p class="dap-an">✅ Verified by compiling: the trace above prints <strong>13, 26, 5</strong>. And <code>int p, q, r; p = q = r = 5;</code> leaves <strong>p = 5, q = 5, r = 5</strong>.</p>
<p class="pitfall">⚠️ <code>x =- 1;</code> and <code>x -= 1;</code> look almost identical and do completely different things: the first assigns -1, the second subtracts 1. Space your operators. Also, the left side must be something that can hold a value (an <em>lvalue</em>): <code>5 = x;</code> and <code>x + 1 = 7;</code> are syntax errors.</p>`,
        `<p class="y-chinh">🎯 Dạng của phép gán là <code>Variable = expression</code>, và mọi toán tử số học lẫn toán tử bit đều có dạng rút gọn gộp phép toán vào trong phép gán.</p>
<ul>
<li><strong>Đọc <code>=</code> là "trở thành", đừng bao giờ đọc là "bằng"</strong> — vế phải được tính trước, rồi kết quả mới được cất vào biến bên trái. Đó là lý do <code>x = x + 1;</code> hợp lý trong C nhưng vô nghĩa trong đại số.</li>
<li><strong>Bảng gán rút gọn</strong> — <code>x += y</code> là <code>x = x + y</code>; tương tự <code>-=</code>, <code>*=</code>, <code>/=</code>, <code>%=</code>, và nhóm bit <code>&amp;=</code>, <code>|=</code>, <code>^=</code>, <code>&lt;&lt;=</code>, <code>&gt;&gt;=</code>. Tổng cộng mười cái.</li>
<li><strong>Vì sao có dạng rút gọn</strong> — nó gọi tên biến đúng một lần. <code>scores[i*2+1] += 10;</code> không thể sai; dạng dài bắt bạn gõ chỉ số hai lần và mời gọi lỗi gõ nhầm.</li>
<li><strong>Ví dụ chạy tay</strong> —
<pre><code>int s = 10;
s += 3;    /* s = 10 + 3  =&gt; 13 */
s *= 2;    /* s = 13 * 2  =&gt; 26 */
s %= 7;    /* s = 26 % 7  =&gt;  5 */</code></pre></li>
<li><strong>Gán là một biểu thức, và nó kết hợp từ PHẢI sang TRÁI</strong> — <code>a = b = c = 5;</code> chạy như <code>a = (b = (c = 5))</code>: c thành 5, giá trị 5 của biểu thức đó chảy vào b, rồi vào a. Cả ba cùng bằng 5.</li>
<li><strong>Độ ưu tiên của nó gần thấp nhất</strong> — chỉ có toán tử dấu phẩy thấp hơn. Chính điều đó cho phép viết <code>x = a + b * c;</code> mà không cần ngoặc: mọi thứ bên phải xong xuôi rồi <code>=</code> mới ra tay.</li>
<li><strong>Dạng rút gọn giấu một phép ép kiểu</strong> — <code>x += 1.5</code> với <code>x</code> kiểu <code>int</code> KHÔNG phải lỗi biên dịch; nó âm thầm có nghĩa <code>x = (int)(x + 1.5)</code>. Dạng dài sẽ bị cảnh báo thu hẹp kiểu; dạng ngắn làm lặng lẽ.</li>
</ul>
<p class="dap-an">✅ Đã kiểm bằng biên dịch thật: đoạn chạy tay ở trên in ra <strong>13, 26, 5</strong>. Và <code>int p, q, r; p = q = r = 5;</code> để lại <strong>p = 5, q = 5, r = 5</strong>.</p>
<p class="pitfall">⚠️ <code>x =- 1;</code> và <code>x -= 1;</code> nhìn gần như giống hệt nhưng làm hai việc hoàn toàn khác: cái đầu GÁN -1, cái sau TRỪ đi 1. Hãy đặt dấu cách cho đúng. Ngoài ra vế trái phải là thứ chứa được giá trị (một <em>lvalue</em>): <code>5 = x;</code> và <code>x + 1 = 7;</code> đều là lỗi cú pháp.</p>`],

      [55, '6. Mixing Data Types — why the compiler has to intervene',
        `<p class="y-chinh">🎯 The ALU cannot add an <code>int</code> to a <code>double</code> directly, so when an expression mixes types the compiler <strong>converts one operand to match the other</strong> before the operation happens.</p>
<ul>
<li><strong>The slide's premise, verbatim</strong> — "Although the ALU does not perform operations on operands of differing data type directly, C compilers can interpret expressions that contain operands of differing data type."</li>
<li><strong>The rule</strong> — "If a binary expression contains operands of differing type, a C compiler changes the data type of one of the operands to match the other." One operand moves; the other stays. Which one moves is decided by the hierarchy below.</li>
<li><strong>The hierarchy, exactly as the slide gives it</strong> — <strong>double &gt; float &gt; long &gt; int &gt; char</strong>. The <em>lower</em> one is promoted up to meet the higher one, never the other way round, because promoting upward never loses information.</li>
<li><strong>Why up and not down</strong> — turning an <code>int</code> 3 into a <code>double</code> 3.0 is exact. Turning a <code>double</code> 3.7 into an <code>int</code> loses the 0.7 forever. A compiler will not silently destroy data in the middle of an expression, so it always climbs.</li>
<li><strong>The physical reason</strong> — an <code>int</code> and a <code>double</code> do not just differ in size (4 vs 8 bytes); they use completely different bit layouts (two's complement vs IEEE-754 sign/exponent/mantissa). The ALU has separate circuits for each. "Conversion" is a real instruction, not a reinterpretation of the same bits.</li>
<li><strong>Three places this rule fires</strong> — inside arithmetic expressions (slide 58), inside relational comparisons (also 58), and across an assignment (slide 57). The assignment case is the only one that can convert <em>downward</em>.</li>
</ul>
<p class="dap-an">✅ Quick check of the hierarchy in action: <code>char c = 100; short s = 200;</code> then <code>c + s</code> — both climb to <code>int</code>, and <code>sizeof(c+s)</code> is <strong>4</strong> (not 1 or 2) while the value is <strong>300</strong>. Verified by compiling. Note that <code>char</code> and <code>short</code> are promoted to <code>int</code> even when both operands are the same type — this is called <em>integer promotion</em> and it happens before the hierarchy above is consulted.</p>
<p class="meo">💡 Memorise the chain as a staircase you can only walk <em>up</em>: char → int → long → float → double. In any binary operation, both operands meet on the higher step.</p>`,
        `<p class="y-chinh">🎯 ALU không cộng thẳng một <code>int</code> với một <code>double</code> được, nên khi biểu thức trộn kiểu thì trình biên dịch <strong>đổi kiểu một toán hạng cho khớp với toán hạng kia</strong> trước khi phép toán xảy ra.</p>
<ul>
<li><strong>Tiền đề nguyên văn trên slide</strong> — "Although the ALU does not perform operations on operands of differing data type directly, C compilers can interpret expressions that contain operands of differing data type."</li>
<li><strong>Quy tắc</strong> — "If a binary expression contains operands of differing type, a C compiler changes the data type of one of the operands to match the other." Một toán hạng phải dịch chuyển; cái kia đứng yên. Cái nào dịch thì do thứ bậc dưới đây quyết định.</li>
<li><strong>Thứ bậc, đúng như slide ghi</strong> — <strong>double &gt; float &gt; long &gt; int &gt; char</strong>. Cái <em>thấp</em> hơn được nâng lên cho gặp cái cao hơn, không bao giờ ngược lại, vì nâng lên thì không mất thông tin.</li>
<li><strong>Vì sao nâng lên chứ không hạ xuống</strong> — biến <code>int</code> 3 thành <code>double</code> 3.0 là chính xác tuyệt đối. Biến <code>double</code> 3.7 thành <code>int</code> thì mất 0.7 vĩnh viễn. Trình biên dịch sẽ không âm thầm phá dữ liệu giữa chừng một biểu thức, nên nó luôn leo lên.</li>
<li><strong>Lý do vật lý</strong> — <code>int</code> và <code>double</code> không chỉ khác cỡ (4 so với 8 byte); chúng dùng cách bố trí bit hoàn toàn khác nhau (bù hai so với IEEE-754 dấu/số mũ/phần định trị). ALU có mạch riêng cho từng loại. "Chuyển kiểu" là một lệnh máy thật sự, không phải đọc lại cùng đống bit theo cách khác.</li>
<li><strong>Ba chỗ quy tắc này khai hoả</strong> — trong biểu thức số học (slide 58), trong phép so sánh quan hệ (cũng slide 58), và qua một phép gán (slide 57). Trường hợp phép gán là trường hợp DUY NHẤT có thể chuyển kiểu <em>đi xuống</em>.</li>
</ul>
<p class="dap-an">✅ Kiểm nhanh thứ bậc khi chạy thật: <code>char c = 100; short s = 200;</code> rồi <code>c + s</code> — cả hai cùng leo lên <code>int</code>, và <code>sizeof(c+s)</code> bằng <strong>4</strong> (không phải 1 hay 2) còn giá trị là <strong>300</strong>. Đã kiểm bằng biên dịch. Chú ý <code>char</code> và <code>short</code> bị nâng lên <code>int</code> kể cả khi hai toán hạng cùng kiểu — cái này gọi là <em>integer promotion</em> (thăng cấp số nguyên) và nó xảy ra TRƯỚC khi xét tới thứ bậc ở trên.</p>
<p class="meo">💡 Hãy nhớ dãy này như một cầu thang chỉ đi <em>lên</em> được: char → int → long → float → double. Trong mọi phép toán hai ngôi, hai toán hạng gặp nhau ở bậc cao hơn.</p>`],

      [56, '6. Mixing Data Types (cont.) — casting across an assignment',
        `<p class="y-chinh">🎯 The slide narrows to one shape: <code>x = y;</code> where <code>x</code> and <code>y</code> have different types. This is where the conversion can go <em>downhill</em> and lose data.</p>
<ul>
<li><strong>Assignment is not symmetric</strong> — in <code>a + b</code> the compiler is free to move either operand up. In <code>x = y</code> the destination type is fixed: <code>y</code> must become whatever <code>x</code> is, up or down. The variable on the left always wins.</li>
<li><strong>Two directions, two names</strong> — if the left side is <em>higher</em>, <code>y</code> is <strong>promoted</strong> (safe, exact for the usual cases). If the left side is <em>lower</em>, <code>y</code> is <strong>truncated</strong> (lossy). Slide 57 spells both out.</li>
<li><strong>Promotion example</strong> —
<pre><code>int    n = 7;
double d = n;        /* 7 becomes 7.0 exactly */</code></pre></li>
<li><strong>Truncation example</strong> —
<pre><code>double d = 3.7;
int    n = d;        /* n becomes 3 — the .7 is CUT OFF, not rounded */</code></pre></li>
<li><strong>"Cut off, not rounded" is the exam sentence</strong> — <code>(int)3.7</code> is 3 and <code>(int)3.99</code> is also 3. Going negative, <code>(int)-3.7</code> is <strong>-3</strong>, not -4: the conversion truncates toward zero, in both directions.</li>
<li><strong>If you want rounding, ask for it</strong> — <code>(int)(d + 0.5)</code> for non-negative <code>d</code>, or <code>round()</code> from <code>&lt;math.h&gt;</code> for the general case.</li>
</ul>
<p class="dap-an">✅ Verified by compiling: <code>(int)3.99</code> = <strong>3</strong> · <code>(int)-3.99</code> = <strong>-3</strong> · <code>(int)(-0.5)</code> = <strong>0</strong> · <code>double d = 3.7; int i = d;</code> → <strong>i = 3</strong> · <code>double e = -3.7; int j = e;</code> → <strong>j = -3</strong> · the rounding trick <code>(int)(3.7 + 0.5)</code> = <strong>4</strong>.</p>
<p class="pitfall">⚠️ An assignment conversion is silent by default. <code>int n = 3.7;</code> compiles, runs, and quietly stores 3. If this is your average-mark calculation, nobody will ever see an error message — they will just see wrong marks. Compile with <code>-Wall -Wconversion</code> so the compiler tells you where you are losing data.</p>`,
        `<p class="y-chinh">🎯 Slide thu hẹp về đúng một dạng: <code>x = y;</code> với <code>x</code> và <code>y</code> khác kiểu. Đây là chỗ phép chuyển kiểu có thể đi <em>xuống dốc</em> và làm mất dữ liệu.</p>
<ul>
<li><strong>Phép gán không đối xứng</strong> — trong <code>a + b</code> trình biên dịch tự do nâng toán hạng nào cũng được. Trong <code>x = y</code> thì kiểu đích đã cố định: <code>y</code> phải trở thành đúng kiểu của <code>x</code>, lên hay xuống cũng vậy. Biến bên trái luôn thắng.</li>
<li><strong>Hai chiều, hai tên gọi</strong> — nếu vế trái <em>cao</em> hơn thì <code>y</code> được <strong>promote</strong> (nâng cấp — an toàn, chính xác trong các trường hợp thường gặp). Nếu vế trái <em>thấp</em> hơn thì <code>y</code> bị <strong>truncate</strong> (cắt bớt — mất mát). Slide 57 nói rõ cả hai.</li>
<li><strong>Ví dụ nâng cấp</strong> —
<pre><code>int    n = 7;
double d = n;        /* 7 thành 7.0, chính xác tuyệt đối */</code></pre></li>
<li><strong>Ví dụ cắt bớt</strong> —
<pre><code>double d = 3.7;
int    n = d;        /* n thành 3 — phần .7 bị CẮT, không làm tròn */</code></pre></li>
<li><strong>"Cắt chứ không làm tròn" là câu đi thi</strong> — <code>(int)3.7</code> bằng 3 và <code>(int)3.99</code> cũng bằng 3. Sang số âm, <code>(int)-3.7</code> bằng <strong>-3</strong>, không phải -4: phép chuyển cắt về phía số 0, ở cả hai chiều.</li>
<li><strong>Muốn làm tròn thì phải yêu cầu</strong> — <code>(int)(d + 0.5)</code> với <code>d</code> không âm, hoặc dùng <code>round()</code> trong <code>&lt;math.h&gt;</code> cho trường hợp tổng quát.</li>
</ul>
<p class="dap-an">✅ Đã kiểm bằng biên dịch thật: <code>(int)3.99</code> = <strong>3</strong> · <code>(int)-3.99</code> = <strong>-3</strong> · <code>(int)(-0.5)</code> = <strong>0</strong> · <code>double d = 3.7; int i = d;</code> → <strong>i = 3</strong> · <code>double e = -3.7; int j = e;</code> → <strong>j = -3</strong> · mẹo làm tròn <code>(int)(3.7 + 0.5)</code> = <strong>4</strong>.</p>
<p class="pitfall">⚠️ Phép chuyển kiểu khi gán mặc định là IM LẶNG. <code>int n = 3.7;</code> dịch được, chạy được, và lặng lẽ lưu 3. Nếu đó là phép tính điểm trung bình của bạn thì sẽ không ai thấy một dòng báo lỗi nào cả — họ chỉ thấy điểm sai. Hãy dịch với <code>-Wall -Wconversion</code> để trình biên dịch chỉ ra chỗ bạn đang làm mất dữ liệu.</p>`],

      [57, '6. Mixing Data Types (cont.) — Implicit casting for the assignment',
        `<p class="y-chinh">🎯 The slide states the assignment rule in two halves: the compiler <strong>promotes</strong> the right operand if the left type is higher, and <strong>truncates</strong> it if the left type is lower.</p>
<ul>
<li><strong>Rule half one, verbatim</strong> — "Promotes the right operand to the data type of the left operand if the left operand is of a higher data type than the right operand."</li>
<li><strong>Rule half two, verbatim</strong> — "Truncates the right operand to the data type of the left operand if the left operand is of a lower data type than the right operand."</li>
<li><strong>The picture on the slide — promotion</strong> — a single byte <code>0100 0001</code> (that is 65, the character <code>'A'</code>) being widened into four bytes <code>0000 0000 0000 0000 0000 0000 0100 0001</code>. Same value, more room. This is <code>char</code> → <code>int</code>:
<pre><code>char c = 'A';
int  n = c;          /* n == 65, nothing lost */</code></pre></li>
<li><strong>The picture on the slide — truncation</strong> — four bytes ending in <code>0001 1001</code> being squeezed back into one byte <code>0001 1001</code> (that is 25). Only the low byte survives; the three high bytes are thrown away. This is <code>int</code> → <code>char</code>:
<pre><code>int  m = 25;
char d = m;          /* d holds 25, fits in one byte */</code></pre></li>
<li><strong>What happens when it does <em>not</em> fit</strong> — truncation keeps only the low-order bits, which is arithmetic modulo 256 for an 8-bit <code>char</code>. <code>char c = 321;</code> stores <code>321 - 256 = 65</code>, i.e. the letter <code>'A'</code>. No warning at runtime, no error, just a different number.</li>
<li><strong>Two truncations, two mechanisms</strong> — narrowing <em>integer</em> types drops high bits (modulo). Narrowing <em>float to integer</em> drops the fraction (truncate toward zero). Do not confuse the two: <code>(char)321</code> is 65, but <code>(int)321.9</code> is 321.</li>
</ul>
<p class="dap-an">✅ Verified by compiling: <code>char c = 'A'; int ci = c;</code> → <strong>ci = 65</strong>, matching the slide's <code>0100 0001</code>. And <code>int big = 321; char cb = (char)big;</code> → <strong>cb = 65</strong>, which prints as <strong>'A'</strong>. The slide's second picture value <code>0001 1001</code> = <strong>25</strong> in decimal, which fits in a <code>char</code> and survives the squeeze intact.</p>
<p class="pitfall">⚠️ "Promotes ... if the left operand is of a higher data type" is safe for the cases in this course, but it is not a universal guarantee: assigning a large <code>long</code> into a <code>float</code> is a promotion by the slide's hierarchy yet still loses precision, because <code>float</code> has only ~7 significant decimal digits. Bigger type ≠ more precise type.</p>`,
        `<p class="y-chinh">🎯 Slide phát biểu quy tắc gán thành hai nửa: trình biên dịch <strong>nâng cấp</strong> toán hạng phải nếu kiểu bên trái cao hơn, và <strong>cắt bớt</strong> nó nếu kiểu bên trái thấp hơn.</p>
<ul>
<li><strong>Nửa quy tắc thứ nhất, nguyên văn</strong> — "Promotes the right operand to the data type of the left operand if the left operand is of a higher data type than the right operand."</li>
<li><strong>Nửa quy tắc thứ hai, nguyên văn</strong> — "Truncates the right operand to the data type of the left operand if the left operand is of a lower data type than the right operand."</li>
<li><strong>Hình trên slide — nâng cấp</strong> — một byte đơn <code>0100 0001</code> (tức 65, ký tự <code>'A'</code>) được nới rộng thành bốn byte <code>0000 0000 0000 0000 0000 0000 0100 0001</code>. Cùng giá trị, rộng chỗ hơn. Đây là <code>char</code> → <code>int</code>:
<pre><code>char c = 'A';
int  n = c;          /* n == 65, không mất gì */</code></pre></li>
<li><strong>Hình trên slide — cắt bớt</strong> — bốn byte kết thúc bằng <code>0001 1001</code> bị ép trở lại vào một byte <code>0001 1001</code> (tức 25). Chỉ byte thấp sống sót; ba byte cao bị vứt. Đây là <code>int</code> → <code>char</code>:
<pre><code>int  m = 25;
char d = m;          /* d giữ 25, vừa một byte */</code></pre></li>
<li><strong>Chuyện gì xảy ra khi KHÔNG vừa</strong> — cắt bớt chỉ giữ lại các bit thấp, tức là lấy dư cho 256 với <code>char</code> 8 bit. <code>char c = 321;</code> lưu <code>321 - 256 = 65</code>, tức chữ <code>'A'</code>. Không cảnh báo lúc chạy, không lỗi, chỉ là một con số khác.</li>
<li><strong>Hai kiểu cắt, hai cơ chế</strong> — thu hẹp giữa các kiểu <em>số nguyên</em> thì rụng bit cao (lấy dư). Thu hẹp từ <em>số thực sang số nguyên</em> thì rụng phần thập phân (cắt về phía 0). Đừng lẫn hai cái: <code>(char)321</code> bằng 65, còn <code>(int)321.9</code> bằng 321.</li>
</ul>
<p class="dap-an">✅ Đã kiểm bằng biên dịch thật: <code>char c = 'A'; int ci = c;</code> → <strong>ci = 65</strong>, khớp với dãy <code>0100 0001</code> trên slide. Và <code>int big = 321; char cb = (char)big;</code> → <strong>cb = 65</strong>, in ra là <strong>'A'</strong>. Giá trị ở hình thứ hai của slide, <code>0001 1001</code>, bằng <strong>25</strong> hệ mười, vừa khít một <code>char</code> nên sống sót nguyên vẹn qua phép ép.</p>
<p class="pitfall">⚠️ Câu "promotes ... if the left operand is of a higher data type" đúng và an toàn với phạm vi môn này, nhưng nó không phải bảo đảm phổ quát: gán một <code>long</code> lớn vào một <code>float</code> là "nâng cấp" theo thứ bậc của slide mà vẫn mất độ chính xác, vì <code>float</code> chỉ có khoảng 7 chữ số thập phân có nghĩa. Kiểu lớn hơn ≠ kiểu chính xác hơn.</p>`],

      [58, '6. Mixing Data Types (cont.) — Implicit casting inside expressions',
        `<p class="y-chinh">🎯 In an arithmetic or relational expression the compiler promotes the lower-typed value up to the higher type <em>before</em> each operation — and it does this one operator at a time, left to right along the precedence order.</p>
<ul>
<li><strong>The rule, verbatim</strong> — "If the operands in an arithmetic or relational expression differ in data type, the compiler promotes the value of lower data type to a value of higher data type before implementing the operation."</li>
<li><strong>The slide's worked expression</strong> — with <code>int n = 3; long t = 123; double x = 5.3;</code> it evaluates <code>3*n + 620*t - 3*x</code> and annotates the type of every sub-result:
<pre><code>3*n        620*t        3*x
(int*int)  (int*long)   (int*double)
  int    +   long    -    double
      long          -     double
                double</code></pre></li>
<li><strong>Reading that diagram</strong> — each multiplication resolves first (higher precedence), giving <code>int</code>, <code>long</code>, <code>double</code>. Then <code>int + long</code> meets on <code>long</code>. Then <code>long - double</code> meets on <code>double</code>. The whole expression's type is <strong>double</strong>.</li>
<li><strong>Now the numbers</strong> — <code>3*3 = 9</code> · <code>620*123 = 76260</code> · <code>3*5.3 = 15.9</code> · <code>9 + 76260 = 76269</code> · <code>76269 - 15.9 = 76253.1</code>.</li>
<li><strong>Why "one operator at a time" matters</strong> — the promotion is <em>local</em>, not global. <code>1/2*3.0</code> is <strong>0</strong>, because <code>1/2</code> is computed as an int division first and only the resulting 0 gets promoted. But <code>3.0*1/2</code> is <strong>1.5</strong>, because <code>3.0*1</code> is already a double so the <code>/2</code> is a real division. Same three numbers, same operators, order changes the answer.</li>
<li><strong>Relational comparisons follow the same rule</strong> — <code>3 &lt; 3.5</code> promotes 3 to 3.0 before comparing, so it is true (1). This is why comparing an <code>int</code> with a <code>double</code> is not a type error.</li>
</ul>
<p class="dap-an">✅ Verified by compiling with exactly the slide's declarations: <code>3*n + 620*t - 3*x</code> prints <strong>76253.1</strong>, and its type is <code>double</code> (it needs <code>%f</code>, not <code>%d</code>). The order trap is verified too: <code>1/2*3.0</code> = <strong>0</strong> · <code>3.0*1/2</code> = <strong>1.5</strong>.</p>
<p class="pitfall">⚠️ The classic average bug lives here. <code>double avg = sum / count;</code> with two <code>int</code>s does the integer division <em>first</em> and only then promotes the already-truncated result. <code>7/2</code> gives 3, so <code>avg</code> becomes 3.0, not 3.5. Verified: <code>sum/cnt</code> = <strong>3</strong>, <code>(double)sum/cnt</code> = <strong>3.5</strong>, <code>(double)(sum/cnt)</code> = <strong>3</strong>. The cast has to be <em>inside</em>, on an operand.</p>`,
        `<p class="y-chinh">🎯 Trong một biểu thức số học hoặc quan hệ, trình biên dịch nâng giá trị kiểu thấp lên kiểu cao <em>trước</em> mỗi phép toán — và nó làm từng toán tử một, theo thứ tự ưu tiên.</p>
<ul>
<li><strong>Quy tắc, nguyên văn</strong> — "If the operands in an arithmetic or relational expression differ in data type, the compiler promotes the value of lower data type to a value of higher data type before implementing the operation."</li>
<li><strong>Biểu thức đã giải trên slide</strong> — với <code>int n = 3; long t = 123; double x = 5.3;</code> slide tính <code>3*n + 620*t - 3*x</code> và chú thích kiểu của từng kết quả trung gian:
<pre><code>3*n        620*t        3*x
(int*int)  (int*long)   (int*double)
  int    +   long    -    double
      long          -     double
                double</code></pre></li>
<li><strong>Đọc sơ đồ đó</strong> — ba phép nhân giải quyết trước (ưu tiên cao hơn), cho ra <code>int</code>, <code>long</code>, <code>double</code>. Rồi <code>int + long</code> gặp nhau ở <code>long</code>. Rồi <code>long - double</code> gặp nhau ở <code>double</code>. Kiểu của cả biểu thức là <strong>double</strong>.</li>
<li><strong>Giờ tới các con số</strong> — <code>3*3 = 9</code> · <code>620*123 = 76260</code> · <code>3*5,3 = 15,9</code> · <code>9 + 76260 = 76269</code> · <code>76269 - 15,9 = 76253,1</code>.</li>
<li><strong>Vì sao "từng toán tử một" là chuyện lớn</strong> — phép nâng cấp mang tính <em>cục bộ</em>, không phải toàn cục. <code>1/2*3.0</code> bằng <strong>0</strong>, vì <code>1/2</code> được tính như chia nguyên trước và chỉ có kết quả 0 mới được nâng cấp. Còn <code>3.0*1/2</code> bằng <strong>1,5</strong>, vì <code>3.0*1</code> đã là double nên <code>/2</code> là chia thực. Cùng ba con số, cùng bấy nhiêu toán tử, đổi thứ tự là đổi đáp án.</li>
<li><strong>So sánh quan hệ theo đúng quy tắc đó</strong> — <code>3 &lt; 3.5</code> nâng 3 thành 3.0 rồi mới so sánh, nên nó đúng (bằng 1). Cũng vì vậy so sánh một <code>int</code> với một <code>double</code> không phải lỗi kiểu.</li>
</ul>
<p class="dap-an">✅ Đã kiểm bằng biên dịch thật với đúng khai báo trên slide: <code>3*n + 620*t - 3*x</code> in ra <strong>76253.1</strong>, và kiểu của nó là <code>double</code> (phải dùng <code>%f</code>, không dùng được <code>%d</code>). Cái bẫy thứ tự cũng đã kiểm: <code>1/2*3.0</code> = <strong>0</strong> · <code>3.0*1/2</code> = <strong>1.5</strong>.</p>
<p class="pitfall">⚠️ Lỗi tính điểm trung bình kinh điển nằm ở đây. <code>double avg = sum / count;</code> với hai biến <code>int</code> thực hiện chia nguyên <em>trước</em>, rồi mới nâng cấp cái kết quả đã bị cắt. <code>7/2</code> cho 3, nên <code>avg</code> thành 3.0 chứ không phải 3.5. Đã kiểm: <code>sum/cnt</code> = <strong>3</strong>, <code>(double)sum/cnt</code> = <strong>3.5</strong>, <code>(double)(sum/cnt)</code> = <strong>3</strong>. Phép ép kiểu phải nằm <em>bên trong</em>, trên một toán hạng.</p>`],

      [59, '6. Mixing Data Types (cont.) — Explicit Casting',
        `<p class="y-chinh">🎯 "We may <em>temporarily</em> change the data type of any operand in any expression to obtain a result of a certain data type" — that is the cast operator, written <code>(type)operand</code>.</p>
<ul>
<li><strong>The word "temporarily" is the whole idea</strong> — <code>(double)n</code> does <strong>not</strong> change the variable <code>n</code>. It produces a new <code>double</code> value for this one operation; <code>n</code> is still an <code>int</code> on the next line.</li>
<li><strong>Syntax and precedence</strong> — the cast is a <em>unary</em> operator, so it binds very tightly, just below <code>++</code>/<code>--</code> and above <code>* / %</code>. That is why <code>(double)a / b</code> casts only <code>a</code>, then divides — no extra parentheses needed.</li>
<li><strong>The canonical use</strong> — forcing real division out of two integers:
<pre><code>int sum = 7, count = 2;
double avg;

avg = sum / count;              /* 3.0   — wrong, int division first */
avg = (double)sum / count;      /* 3.5   — right                     */
avg = (double)(sum / count);    /* 3.0   — wrong, cast comes too late */</code></pre></li>
<li><strong>The other canonical use — forcing truncation on purpose</strong> — <code>int whole = (int)price;</code> to drop the cents, or <code>(int)(x * 100) / 100.0</code> to keep two decimals. Here the loss is intentional and the cast documents that intention to the next reader.</li>
<li><strong>The slide's diagram</strong> — it shows a four-byte cell holding <code>00000000 00000000 00000000 00000001</code> next to labels <code>c</code> and <code>n</code>, i.e. a one-byte <code>char</code> value being viewed as a four-byte <code>int</code>. The cast is what lets you name which of the two views you want at this instant.</li>
<li><strong>Implicit vs explicit, side by side</strong> — implicit conversion is the compiler's decision and is silent; an explicit cast is <em>your</em> decision and is visible in the source. When a narrowing has to happen, write the cast even when C does not require it — it turns "possible bug" into "deliberate choice".</li>
</ul>
<p class="dap-an">✅ Verified by compiling all three lines above: <code>sum/count</code> = <strong>3</strong> · <code>(double)sum/count</code> = <strong>3.5</strong> · <code>(double)(sum/count)</code> = <strong>3</strong>. So position matters more than the presence of the cast.</p>
<p class="pitfall">⚠️ A cast cannot recover information that has already been destroyed. Once <code>7/2</code> has produced the integer 3, no cast anywhere downstream will bring back the 0.5. Cast <em>before</em> the lossy operation, never after it.</p>`,
        `<p class="y-chinh">🎯 "We may <em>temporarily</em> change the data type of any operand in any expression to obtain a result of a certain data type" — đó chính là toán tử ép kiểu, viết là <code>(kiểu)toán_hạng</code>.</p>
<ul>
<li><strong>Chữ "tạm thời" là toàn bộ ý tưởng</strong> — <code>(double)n</code> KHÔNG làm đổi biến <code>n</code>. Nó tạo ra một giá trị <code>double</code> mới cho đúng phép toán này; sang dòng sau <code>n</code> vẫn là <code>int</code>.</li>
<li><strong>Cú pháp và độ ưu tiên</strong> — ép kiểu là toán tử <em>một ngôi</em>, nên nó kết hợp rất chặt, ngay dưới <code>++</code>/<code>--</code> và trên <code>* / %</code>. Vì thế <code>(double)a / b</code> chỉ ép <code>a</code> rồi mới chia — không cần thêm ngoặc.</li>
<li><strong>Công dụng kinh điển</strong> — ép ra phép chia thực từ hai số nguyên:
<pre><code>int sum = 7, count = 2;
double avg;

avg = sum / count;              /* 3.0   — SAI, chia nguyên trước   */
avg = (double)sum / count;      /* 3.5   — ĐÚNG                     */
avg = (double)(sum / count);    /* 3.0   — SAI, ép kiểu quá muộn    */</code></pre></li>
<li><strong>Công dụng kinh điển thứ hai — cố ý cắt bớt</strong> — <code>int whole = (int)price;</code> để bỏ phần lẻ, hay <code>(int)(x * 100) / 100.0</code> để giữ hai chữ số thập phân. Ở đây mất mát là có chủ ý, và phép ép kiểu ghi lại chủ ý đó cho người đọc sau.</li>
<li><strong>Hình trên slide</strong> — nó vẽ một ô bốn byte chứa <code>00000000 00000000 00000000 00000001</code> cạnh hai nhãn <code>c</code> và <code>n</code>, tức một giá trị <code>char</code> một byte đang được nhìn như một <code>int</code> bốn byte. Phép ép kiểu chính là thứ cho bạn gọi tên bạn muốn cách nhìn nào ngay lúc này.</li>
<li><strong>Ngầm định và tường minh, đặt cạnh nhau</strong> — chuyển kiểu ngầm định là quyết định của trình biên dịch và nó im lặng; ép kiểu tường minh là quyết định của <em>bạn</em> và nó hiện ra trong mã nguồn. Khi buộc phải thu hẹp kiểu, hãy viết phép ép kiểu ngay cả khi C không đòi — nó biến "có thể là lỗi" thành "lựa chọn có chủ đích".</li>
</ul>
<p class="dap-an">✅ Đã kiểm bằng biên dịch thật cả ba dòng trên: <code>sum/count</code> = <strong>3</strong> · <code>(double)sum/count</code> = <strong>3.5</strong> · <code>(double)(sum/count)</code> = <strong>3</strong>. Vậy VỊ TRÍ đặt phép ép kiểu quan trọng hơn cả việc có ép kiểu hay không.</p>
<p class="pitfall">⚠️ Ép kiểu không lấy lại được thông tin đã bị phá. Một khi <code>7/2</code> đã cho ra số nguyên 3 thì không phép ép kiểu nào ở phía sau đem được 0,5 quay lại. Ép kiểu <em>trước</em> phép toán gây mất mát, đừng bao giờ ép sau.</p>`],

      [60, '7. Operator Precedence',
        `<p class="y-chinh">🎯 When one expression contains several operators, a pre-defined precedence decides who goes first — and parentheses are how you overrule it.</p>
<ul>
<li><strong>The slide's statement</strong> — "In an expression containing more than one operator, which operator will perform first? Pre-defined Precedence." And: "We can use ( ) to instruct the compiler to evaluate the expression within the parentheses first."</li>
<li><strong>The order you must know for this course</strong> (highest first) — <code>()</code> · unary <code>! ~ ++ -- (type) + -</code> · <code>* / %</code> · binary <code>+ -</code> · <code>&lt;&lt; &gt;&gt;</code> · <code>&lt; &lt;= &gt; &gt;=</code> · <code>== !=</code> · <code>&amp;</code> · <code>^</code> · <code>|</code> · <code>&amp;&amp;</code> · <code>||</code> · <code>?:</code> · <code>= += -= …</code> · <code>,</code></li>
<li><strong>Three facts that answer most exam questions</strong> — (1) <code>* / %</code> bind tighter than <code>+ -</code>; (2) all relational operators bind tighter than <code>&amp;&amp;</code>, which binds tighter than <code>||</code>; (3) assignment is nearly last and it associates <strong>right to left</strong>.</li>
<li><strong>Associativity, not just precedence</strong> — equal-precedence operators need a tie-break. <code>+ - * / %</code> and the relationals go <em>left to right</em>: <code>17 % 5 * 2</code> is <code>(17 % 5) * 2 = 2 * 2 = 4</code>, not <code>17 % 10</code>. Assignment and the unary operators go <em>right to left</em>.</li>
<li><strong>The slide's exercise</strong> — <code>int m = 3, k = 2, n = 4;</code> then evaluate <code>m&lt;n</code> · <code>k&lt;m&lt;n</code> · <code>k&gt;m&gt;n</code> · <code>m&lt;n&gt;k</code> · <code>m &amp;&amp; k&lt;n</code>. Solved one at a time:
<ul>
<li><code>m&lt;n</code> → <code>3&lt;4</code> → <strong>1</strong></li>
<li><code>k&lt;m&lt;n</code> → left-to-right → <code>(k&lt;m)&lt;n</code> → <code>(2&lt;3)=1</code> → <code>1&lt;4</code> → <strong>1</strong></li>
<li><code>k&gt;m&gt;n</code> → <code>(k&gt;m)&gt;n</code> → <code>(2&gt;3)=0</code> → <code>0&gt;4</code> → <strong>0</strong></li>
<li><code>m&lt;n&gt;k</code> → <code>(m&lt;n)&gt;k</code> → <code>(3&lt;4)=1</code> → <code>1&gt;2</code> → <strong>0</strong></li>
<li><code>m &amp;&amp; k&lt;n</code> → <code>&lt;</code> binds tighter → <code>m &amp;&amp; (k&lt;n)</code> → <code>3 &amp;&amp; 1</code> → both non-zero → <strong>1</strong></li>
</ul></li>
</ul>
<p class="dap-an">✅ Answers, all five confirmed by compiling: <code>m&lt;n</code> = <strong>1</strong> · <code>k&lt;m&lt;n</code> = <strong>1</strong> · <code>k&gt;m&gt;n</code> = <strong>0</strong> · <code>m&lt;n&gt;k</code> = <strong>0</strong> · <code>m &amp;&amp; k&lt;n</code> = <strong>1</strong>. Note <code>k&lt;m&lt;n</code> answering 1 is a coincidence of these numbers, not maths working: clang even warns <em>"comparisons like X&lt;=Y&lt;=Z don't have their mathematical meaning"</em>. Counterexample, also compiled: with <code>k=5, m=3, n=4</code> the mathematical reading "5 &lt; 3 &lt; 4" is plainly <em>false</em>, yet C answers <strong>1</strong> — because <code>(5&lt;3)=0</code> and <code>0&lt;4</code> is true. To mean the maths you must write <code>k&lt;m &amp;&amp; m&lt;n</code>, which gives <strong>0</strong> as it should.</p>
<p class="meo">💡 Do not memorise all fifteen levels. Memorise the three facts above, and put parentheses everywhere else. <code>(a &amp; 1) == 0</code> costs two characters and saves an hour of debugging.</p>`,
        `<p class="y-chinh">🎯 Khi một biểu thức chứa nhiều toán tử, một thứ tự ưu tiên định sẵn quyết định ai làm trước — và dấu ngoặc là cách bạn lật ngược nó.</p>
<ul>
<li><strong>Phát biểu trên slide</strong> — "In an expression containing more than one operator, which operator will perform first? Pre-defined Precedence." Và: "We can use ( ) to instruct the compiler to evaluate the expression within the parentheses first."</li>
<li><strong>Thứ tự bạn phải thuộc cho môn này</strong> (cao nhất trước) — <code>()</code> · một ngôi <code>! ~ ++ -- (kiểu) + -</code> · <code>* / %</code> · <code>+ -</code> hai ngôi · <code>&lt;&lt; &gt;&gt;</code> · <code>&lt; &lt;= &gt; &gt;=</code> · <code>== !=</code> · <code>&amp;</code> · <code>^</code> · <code>|</code> · <code>&amp;&amp;</code> · <code>||</code> · <code>?:</code> · <code>= += -= …</code> · <code>,</code></li>
<li><strong>Ba sự thật trả lời được hầu hết câu hỏi thi</strong> — (1) <code>* / %</code> chặt hơn <code>+ -</code>; (2) mọi toán tử quan hệ chặt hơn <code>&amp;&amp;</code>, và <code>&amp;&amp;</code> chặt hơn <code>||</code>; (3) phép gán gần thấp nhất và nó kết hợp <strong>từ PHẢI sang TRÁI</strong>.</li>
<li><strong>Tính kết hợp, không chỉ độ ưu tiên</strong> — các toán tử cùng độ ưu tiên cần một luật phá hoà. <code>+ - * / %</code> và nhóm quan hệ đi <em>trái sang phải</em>: <code>17 % 5 * 2</code> là <code>(17 % 5) * 2 = 2 * 2 = 4</code>, không phải <code>17 % 10</code>. Phép gán và các toán tử một ngôi đi <em>phải sang trái</em>.</li>
<li><strong>Bài tập trên slide</strong> — <code>int m = 3, k = 2, n = 4;</code> rồi tính <code>m&lt;n</code> · <code>k&lt;m&lt;n</code> · <code>k&gt;m&gt;n</code> · <code>m&lt;n&gt;k</code> · <code>m &amp;&amp; k&lt;n</code>. Giải từng câu:
<ul>
<li><code>m&lt;n</code> → <code>3&lt;4</code> → <strong>1</strong></li>
<li><code>k&lt;m&lt;n</code> → trái sang phải → <code>(k&lt;m)&lt;n</code> → <code>(2&lt;3)=1</code> → <code>1&lt;4</code> → <strong>1</strong></li>
<li><code>k&gt;m&gt;n</code> → <code>(k&gt;m)&gt;n</code> → <code>(2&gt;3)=0</code> → <code>0&gt;4</code> → <strong>0</strong></li>
<li><code>m&lt;n&gt;k</code> → <code>(m&lt;n)&gt;k</code> → <code>(3&lt;4)=1</code> → <code>1&gt;2</code> → <strong>0</strong></li>
<li><code>m &amp;&amp; k&lt;n</code> → <code>&lt;</code> chặt hơn → <code>m &amp;&amp; (k&lt;n)</code> → <code>3 &amp;&amp; 1</code> → cả hai khác 0 → <strong>1</strong></li>
</ul></li>
</ul>
<p class="dap-an">✅ Đáp án, cả năm đã xác nhận bằng biên dịch thật: <code>m&lt;n</code> = <strong>1</strong> · <code>k&lt;m&lt;n</code> = <strong>1</strong> · <code>k&gt;m&gt;n</code> = <strong>0</strong> · <code>m&lt;n&gt;k</code> = <strong>0</strong> · <code>m &amp;&amp; k&lt;n</code> = <strong>1</strong>. Chú ý: <code>k&lt;m&lt;n</code> ra 1 là do bộ số này trùng hợp, không phải vì toán học chạy đúng — clang còn cảnh báo thẳng <em>"comparisons like X&lt;=Y&lt;=Z don't have their mathematical meaning"</em>. Phản ví dụ, cũng đã biên dịch thật: với <code>k=5, m=3, n=4</code> thì cách đọc toán học "5 &lt; 3 &lt; 4" rõ ràng là <em>sai</em>, vậy mà C trả về <strong>1</strong> — vì <code>(5&lt;3)=0</code> rồi <code>0&lt;4</code> là đúng. Muốn đúng nghĩa toán thì phải viết <code>k&lt;m &amp;&amp; m&lt;n</code>, và nó cho <strong>0</strong> như phải thế.</p>
<p class="meo">💡 Đừng học thuộc cả mười lăm mức. Hãy thuộc ba sự thật ở trên, còn lại thì đặt ngoặc. <code>(a &amp; 1) == 0</code> tốn hai ký tự và tiết kiệm một giờ gỡ lỗi.</p>`],

      [61, 'Summary — the checklist questions',
        `<p class="y-chinh">🎯 The deck closes by asking you to reconstruct its definitions from memory and then to compute five bitwise expressions by hand. Every one is answered below.</p>
<ul>
<li><strong>"Variable is ……"</strong> — a named location in memory whose content may change while the program runs; its declaration fixes its type (how many bytes, and how to interpret them) and its name.</li>
<li><strong>"Basic memory operations are ……"</strong> — declare (reserve the bytes), write/assign (store a value), and read (fetch the value). Everything a program does is built from those three.</li>
<li><strong>"Expression is ………"</strong> — a valid association of constants, variables, operators and functions that returns exactly one result (slide 46, word for word).</li>
<li><strong>"Which of the following operators will change value of a variable? <code>+ - * / % ++</code>"</strong> — only <code>++</code>. The other five read their operands and produce a new value without touching them. (<code>--</code> would also qualify; it is simply not in this list.)</li>
<li><strong>"Which of the following operators can accept only one operand? <code>+ - * / % --</code>"</strong> — <code>+</code>, <code>-</code> and <code>--</code>. Careful: <code>+</code> and <code>-</code> accept <em>either</em> one or two operands, so the truly one-operand-only member of the list is <code>--</code>. Read the question as "which can be used with a single operand" and the answer is the three; read it as "which accepts <em>only</em> one" and the answer is <code>--</code> alone.</li>
<li><strong>The five bitwise problems, worked in binary</strong> —
<pre><code>13 &amp; 7  :  1101 &amp; 0111 = 0101              =   5
62 | 53 :  111110 | 110101 = 111111       =  63
17 ^ 21 :  10001 ^ 10101 = 00100          =   4
12 &gt;&gt; 2 :  1100 -&gt; 0011                   =   3   (12 / 4)
65 &lt;&lt; 3 :  1000001 -&gt; 1000001000          = 520   (65 * 8)</code></pre></li>
</ul>
<p class="dap-an">✅ All five verified by compiling: <strong>13 &amp; 7 = 5</strong> · <strong>62 | 53 = 63</strong> · <strong>17 ^ 21 = 4</strong> · <strong>12 &gt;&gt; 2 = 3</strong> · <strong>65 &lt;&lt; 3 = 520</strong>.</p>
<p class="meo">💡 Shifts are faster to do as arithmetic than as bit drawings: <code>n &gt;&gt; k</code> = <code>n / 2^k</code> and <code>n &lt;&lt; k</code> = <code>n * 2^k</code> (for non-negative n). <code>12 &gt;&gt; 2 = 12/4 = 3</code> and <code>65 &lt;&lt; 3 = 65*8 = 520</code> — no binary needed. Keep the binary method for <code>&amp; | ^</code>, where there is no arithmetic shortcut.</p>
<p class="pitfall">⚠️ For <code>&amp; | ^</code>, line the numbers up by writing both with the <em>same</em> number of digits and padding on the left with zeros. Most wrong answers in this exercise come from misaligned columns, not from misunderstanding the operator.</p>`,
        `<p class="y-chinh">🎯 Bộ slide khép lại bằng việc bắt bạn dựng lại các định nghĩa từ trí nhớ rồi tính tay năm biểu thức bit. Toàn bộ được giải bên dưới.</p>
<ul>
<li><strong>"Variable is ……"</strong> — biến là một vùng nhớ có tên, nội dung có thể thay đổi trong lúc chương trình chạy; khai báo của nó chốt kiểu (chiếm bao nhiêu byte, và diễn giải các byte đó ra sao) cùng cái tên.</li>
<li><strong>"Basic memory operations are ……"</strong> — khai báo (giữ chỗ các byte), ghi/gán (cất một giá trị vào), và đọc (lấy giá trị ra). Mọi việc một chương trình làm đều dựng từ ba thao tác đó.</li>
<li><strong>"Expression is ………"</strong> — một tổ hợp hợp lệ của hằng, biến, toán tử và hàm, trả về đúng một kết quả (slide 46, đúng từng chữ).</li>
<li><strong>"Toán tử nào trong số <code>+ - * / % ++</code> LÀM ĐỔI giá trị của một biến?"</strong> — chỉ có <code>++</code>. Năm cái còn lại đọc toán hạng rồi sinh ra giá trị mới mà không đụng tới chúng. (<code>--</code> cũng thoả, chỉ là nó không có trong danh sách này.)</li>
<li><strong>"Toán tử nào trong số <code>+ - * / % --</code> CHỈ nhận một toán hạng?"</strong> — <code>+</code>, <code>-</code> và <code>--</code>. Cẩn thận: <code>+</code> và <code>-</code> nhận <em>cả</em> một lẫn hai toán hạng, nên thành viên duy nhất CHỈ nhận một toán hạng trong danh sách là <code>--</code>. Hiểu câu hỏi là "cái nào dùng được với một toán hạng" thì đáp án là ba cái; hiểu là "cái nào CHỈ nhận đúng một" thì đáp án là mình <code>--</code>.</li>
<li><strong>Năm bài tập bit, giải bằng nhị phân</strong> —
<pre><code>13 &amp; 7  :  1101 &amp; 0111 = 0101              =   5
62 | 53 :  111110 | 110101 = 111111       =  63
17 ^ 21 :  10001 ^ 10101 = 00100          =   4
12 &gt;&gt; 2 :  1100 -&gt; 0011                   =   3   (12 / 4)
65 &lt;&lt; 3 :  1000001 -&gt; 1000001000          = 520   (65 * 8)</code></pre></li>
</ul>
<p class="dap-an">✅ Cả năm đã kiểm bằng biên dịch thật: <strong>13 &amp; 7 = 5</strong> · <strong>62 | 53 = 63</strong> · <strong>17 ^ 21 = 4</strong> · <strong>12 &gt;&gt; 2 = 3</strong> · <strong>65 &lt;&lt; 3 = 520</strong>.</p>
<p class="meo">💡 Phép dịch tính bằng số học nhanh hơn vẽ bit: <code>n &gt;&gt; k</code> = <code>n / 2^k</code> và <code>n &lt;&lt; k</code> = <code>n * 2^k</code> (với n không âm). <code>12 &gt;&gt; 2 = 12/4 = 3</code> và <code>65 &lt;&lt; 3 = 65*8 = 520</code> — khỏi cần nhị phân. Giữ cách vẽ nhị phân cho <code>&amp; | ^</code>, chỗ không có lối tắt số học nào.</p>
<p class="pitfall">⚠️ Với <code>&amp; | ^</code>, hãy xếp thẳng hàng bằng cách viết cả hai số với <em>cùng</em> số chữ số, đệm số 0 vào bên trái. Phần lớn đáp án sai ở bài này đến từ lệch cột, không phải từ hiểu sai toán tử.</p>`],

      [62, 'Summary (cont.) — the eight things this chapter taught',
        `<p class="y-chinh">🎯 The closing contents list: Expressions · Arithmetic · Relational · Logical · Bit operators · Shorthand Assignment · Casting · Precedence. Here is each one in a single sentence you can revise from.</p>
<ul>
<li><strong>Expressions</strong> — a valid association of constants, variables, operators and functions returning exactly one value; evaluated by the ALU, which supports arithmetic, relational and logic operations.</li>
<li><strong>Arithmetic operators</strong> — <code>+ - * / %</code> plus unary <code>+ -</code> and <code>++ --</code>; <code>/</code> on two integers truncates (<code>5/2</code> = 2, <code>5.0/2</code> = 2.5) and <code>%</code> refuses floating-point operands entirely.</li>
<li><strong>Relational operators</strong> — <code>&lt; &lt;= == &gt;= &gt; !=</code>, each returning the <code>int</code> 1 or 0; and in the other direction, zero is false and every non-zero value is true.</li>
<li><strong>Logical operators</strong> — <code>&amp;&amp; || !</code> with short-circuit evaluation, which is what makes <code>n != 0 &amp;&amp; total/n &gt; 5</code> safe; do not confuse them with <code>&amp;</code> and <code>|</code>, which work bit by bit and give different answers (<code>2&amp;1</code> = 0 but <code>2&amp;&amp;1</code> = 1).</li>
<li><strong>Bit operators</strong> — <code>&amp; | ^ ~ &lt;&lt; &gt;&gt;</code>; shifting by one is multiplying or dividing by two, right shift copies the sign bit back in, and <code>~n</code> equals <code>-n-1</code>.</li>
<li><strong>Shorthand assignment</strong> — <code>+= -= *= /= %= &amp;= |= ^= &lt;&lt;= &gt;&gt;=</code>; assignment is itself an expression with a value, it has almost the lowest precedence, and it associates right to left, which is why <code>a = b = c = 5</code> works.</li>
<li><strong>Casting</strong> — implicit conversion follows the staircase <code>char → int → long → float → double</code>, upward inside expressions and in either direction across an assignment; explicit <code>(type)x</code> changes one operand temporarily, and it must be applied <em>before</em> the lossy operation, never after.</li>
<li><strong>Precedence</strong> — <code>* / %</code> before <code>+ -</code>; relational before <code>&amp;&amp;</code> before <code>||</code>; bitwise <code>&amp; ^ |</code> sit <em>below</em> the relational operators (so <code>x &amp; 1 == 0</code> is a trap); assignment last and right-associative.</li>
</ul>
<p class="dap-an">✅ Self-test, all answers verified by compiling: <code>5/2</code> = <strong>2</strong> · <code>5.0/2</code> = <strong>2.5</strong> · <code>-7/2</code> = <strong>-3</strong> · <code>-7%2</code> = <strong>-1</strong> · <code>2+3*4</code> = <strong>14</strong> · <code>17%5*2</code> = <strong>4</strong> · <code>(int)3.99</code> = <strong>3</strong> · <code>2&amp;1</code> = <strong>0</strong> vs <code>2&amp;&amp;1</code> = <strong>1</strong>. If you got all eight without running them, this chapter is done.</p>
<p class="meo">💡 Everything in this chapter reduces to two questions asked in order: <em>which operator binds first?</em> (precedence and associativity) and then <em>what type are its two operands?</em> (promotion and casting). Answer those two at every step and you can hand-evaluate any expression the exam can print.</p>`,
        `<p class="y-chinh">🎯 Danh mục khép lại: Biểu thức · Số học · Quan hệ · Logic · Toán tử bit · Gán rút gọn · Ép kiểu · Thứ tự ưu tiên. Dưới đây mỗi mục gói trong một câu để ôn.</p>
<ul>
<li><strong>Biểu thức</strong> — một tổ hợp hợp lệ của hằng, biến, toán tử và hàm trả về đúng một giá trị; do ALU tính, mà ALU hỗ trợ ba họ phép toán số học, quan hệ và logic.</li>
<li><strong>Toán tử số học</strong> — <code>+ - * / %</code> cộng thêm <code>+ -</code> một ngôi và <code>++ --</code>; <code>/</code> trên hai số nguyên thì cắt (<code>5/2</code> = 2, <code>5.0/2</code> = 2,5) còn <code>%</code> từ chối hoàn toàn toán hạng số thực.</li>
<li><strong>Toán tử quan hệ</strong> — <code>&lt; &lt;= == &gt;= &gt; !=</code>, mỗi cái trả về số <code>int</code> 1 hoặc 0; và theo chiều ngược lại, 0 là sai còn mọi giá trị khác 0 đều là đúng.</li>
<li><strong>Toán tử logic</strong> — <code>&amp;&amp; || !</code> có đoản mạch, chính thứ làm cho <code>n != 0 &amp;&amp; total/n &gt; 5</code> an toàn; đừng lẫn với <code>&amp;</code> và <code>|</code> vốn làm việc theo từng bit và cho đáp số khác (<code>2&amp;1</code> = 0 nhưng <code>2&amp;&amp;1</code> = 1).</li>
<li><strong>Toán tử bit</strong> — <code>&amp; | ^ ~ &lt;&lt; &gt;&gt;</code>; dịch một vị trí là nhân hoặc chia hai, dịch phải chép lại bit dấu vào, và <code>~n</code> bằng <code>-n-1</code>.</li>
<li><strong>Gán rút gọn</strong> — <code>+= -= *= /= %= &amp;= |= ^= &lt;&lt;= &gt;&gt;=</code>; bản thân phép gán là một biểu thức có giá trị, nó có độ ưu tiên gần thấp nhất, và nó kết hợp từ phải sang trái — vì thế <code>a = b = c = 5</code> mới chạy được.</li>
<li><strong>Ép kiểu</strong> — chuyển kiểu ngầm định đi theo cầu thang <code>char → int → long → float → double</code>, đi lên khi ở trong biểu thức và đi cả hai chiều khi qua phép gán; ép kiểu tường minh <code>(kiểu)x</code> đổi một toán hạng một cách tạm thời, và phải đặt <em>trước</em> phép toán gây mất mát, không bao giờ đặt sau.</li>
<li><strong>Thứ tự ưu tiên</strong> — <code>* / %</code> trước <code>+ -</code>; quan hệ trước <code>&amp;&amp;</code> trước <code>||</code>; nhóm bit <code>&amp; ^ |</code> nằm <em>dưới</em> nhóm quan hệ (nên <code>x &amp; 1 == 0</code> là một cái bẫy); gán đứng cuối và kết hợp phải sang trái.</li>
</ul>
<p class="dap-an">✅ Tự kiểm tra, mọi đáp án đã xác nhận bằng biên dịch thật: <code>5/2</code> = <strong>2</strong> · <code>5.0/2</code> = <strong>2.5</strong> · <code>-7/2</code> = <strong>-3</strong> · <code>-7%2</code> = <strong>-1</strong> · <code>2+3*4</code> = <strong>14</strong> · <code>17%5*2</code> = <strong>4</strong> · <code>(int)3.99</code> = <strong>3</strong> · <code>2&amp;1</code> = <strong>0</strong> so với <code>2&amp;&amp;1</code> = <strong>1</strong>. Trả lời trúng cả tám mà không cần chạy thử thì chương này coi như xong.</p>
<p class="meo">💡 Cả chương này rút lại thành hai câu hỏi đặt theo đúng thứ tự: <em>toán tử nào kết hợp trước?</em> (ưu tiên và tính kết hợp) rồi <em>hai toán hạng của nó kiểu gì?</em> (nâng cấp và ép kiểu). Trả lời được hai câu đó ở mỗi bước là bạn chạy tay được mọi biểu thức đề thi in ra.</p>`],

    ]),
  ].join('\n'),
};
