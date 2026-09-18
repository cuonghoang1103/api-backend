/**
 * PRF192 · Slot 08-09 (deck 'prf4', 71 slide) — phần slide 49→71, học theo từng slide.
 * Chương 5c: Ngăn xếp lời gọi, truyền theo giá trị, extent & scope, chạy tay có hàm.
 *
 * Nội dung bám ĐÚNG chữ trích từ .pptx gốc của trường (/tmp/prf192-text/prf4.txt).
 * MỌI con số / kết quả in ra trong phần giảng đã kiểm bằng biên dịch thật (cc -Wall -std=c99):
 *   average(5,8) = 6.500000 · địa chỉ khung main 0x16bd6e3c8 > khung average 0x16bd6e37c (stack mọc XUỐNG)
 *   swap(a,b) truyền giá trị: trong hàm a=8 b=5, về main VẪN a=5 b=8 · bản con trỏ swap(&a,&b) → a=8 b=5
 *   printNPrimes(5) → "2, 3, 5, 7, 11," · printNPrimes(10) → "…, 29,"
 *   gcd(12,18)=6 lcm=36 · gcd(48,180)=12 lcm=720 · gcd(7,13)=1 lcm=91
 *   main→gcd khung 0x…38c; gcd trả về rồi main→lcm LẠI khung 0x…38c; lcm→gcd khung SÂU hơn 0x…34c
 *   slide 66: f(6,5,7) = 2*(6+5-7)/5 = 8/5 = 1 ⇒ t = 3*1 = 3
 *   isPower2: 1,2,4,8,16,32,1024 → 1; 3,5,6,12,24,1000 → 0; n=0 → 1 (DƯƠNG TÍNH GIẢ)
 *   biến cục bộ không khởi tạo in ra rác đổi theo từng lần chạy; biến toàn cục g = 0
 *   static int c giữ 1,2,3 qua 3 lời gọi; int c thường luôn 1
 *   trả về &biến_cục_bộ: cc -Wall cảnh báo -Wreturn-stack-address, chạy vẫn "ra 42" (UB)
 *
 * ⚠️ Slide 68 của trường ghi SAI công thức năm nhuận. Đã đo: công thức trên slide
 * lệch với công thức đúng ở 30 năm trong khoảng 1..4000 (1700, 1800, 1900, 2100…).
 * Đã nêu thẳng trong phần Đáp án của slide 68, KHÔNG im lặng chép lại, KHÔNG sửa slide.
 * Slide 53, 58, 70, 71 có code/hình nằm trong ẢNH, không có trong file text — đã nói rõ
 * chỗ nào là tái dựng theo mô tả, chỗ nào không tái tạo được.
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'prf4';

export default {
  title: '5.0c — Slide by slide: The call stack, pass by value, scope & tracing functions (slides 49–71)|||5.0c — Slide bài giảng: Ngăn xếp lời gọi, truyền theo giá trị, phạm vi biến & chạy tay hàm (slide 49–71)',
  slug: 'prf192-5-0c-slides-stack-scope-walkthrough',
  type: 'DOCUMENT',
  description: 'Phần cuối bộ slide Slot 08-09 của PRF192 (slide 49–71): điều gì thật sự xảy ra trong bộ nhớ khi một hàm được gọi (bốn phân đoạn code/data/stack/heap, khung ngăn xếp, địa chỉ trở về), vì sao C chỉ truyền theo giá trị nên swap thường không đổi được biến ở main, cách phân rã một bài toán thành hàm, extent so với scope của biến, và kỹ thuật chạy tay chương trình có hàm. Bốn Exercise 3–6 được giải trọn vẹn, mọi chương trình đều đã biên dịch và chạy thật bằng cc -Wall.',
  content: [
    walkHead(D, 49, 71),
    walk(D, [

      [49, '7 - What happen when a function is called? (section divider)',
        `<p class="y-chinh">🎯 A section marker. Everything you have learned so far said <em>how to write</em> a function; this block says <em>what the machine actually does</em> at the moment the call happens.</p>
<ul>
<li><strong>Where you are in the deck</strong> — slides 1–25 defined modules, 26–33 turned a module into a C function, 34–48 covered implementing, calling, prototypes and style. From here the deck goes under the bonnet: memory map (50–51), pass by value (52), Exercise 3 (53).</li>
<li><strong>Why a whole section for one moment in time</strong> — because three of this course's hardest topics are all consequences of it: why <code>swap(a,b)</code> silently fails, why a local variable "disappears" when the function returns, and why Slot 10 has to introduce pointers at all. One mental picture explains all three.</li>
<li><strong>The one sentence to carry forward</strong> — calling a function creates a <em>new block of memory</em> (a <strong>stack frame</strong>), copies the arguments into it, runs the body, and then <em>destroys that block</em>. Everything else in this section is detail attached to that sentence.</li>
<li><strong>What it costs</strong> — a call is not free. The CPU must push the return address, push or copy the arguments, jump, and later unwind. That is why slide 49's question ("what happens?") is also a performance question, and why tiny functions are sometimes inlined by the compiler.</li>
<li><strong>Exam angle</strong> — questions in this section are almost never "define stack". They are "here is a program, draw the memory map" or "here is a swap, explain the result". Both are drawing exercises. Practise with a pen.</li>
</ul>
<p class="meo">💡 Read the next three slides with one habit: every time you see a variable name, ask <em>which frame does it live in?</em> Two variables with the same spelling in two frames are two different pieces of memory, and the whole section exists to make that obvious.</p>`,
        `<p class="y-chinh">🎯 Slide phân mục. Mọi thứ học tới đây nói <em>cách viết</em> một hàm; khối này nói <em>máy thật sự làm gì</em> đúng vào khoảnh khắc lời gọi xảy ra.</p>
<ul>
<li><strong>Bạn đang ở đâu trong bộ slide</strong> — slide 1–25 định nghĩa module, 26–33 biến module thành hàm C, 34–48 nói cách hiện thực, cách gọi, prototype và phong cách. Từ đây bộ slide mở nắp máy ra: bản đồ bộ nhớ (50–51), truyền theo giá trị (52), Exercise 3 (53).</li>
<li><strong>Vì sao cả một mục chỉ cho một khoảnh khắc</strong> — vì ba chủ đề khó nhất của môn đều là hệ quả của nó: vì sao <code>swap(a,b)</code> thất bại âm thầm, vì sao biến cục bộ "biến mất" khi hàm trả về, và vì sao Slot 10 buộc phải dạy con trỏ. Một bức tranh duy nhất giải thích cả ba.</li>
<li><strong>Một câu phải mang theo</strong> — gọi một hàm là tạo ra <em>một khối bộ nhớ mới</em> (gọi là <strong>khung ngăn xếp</strong>, stack frame), chép các đối số vào đó, chạy thân hàm, rồi <em>huỷ khối đó đi</em>. Mọi thứ còn lại trong mục này chỉ là chi tiết gắn vào câu đó.</li>
<li><strong>Cái giá của nó</strong> — một lời gọi không miễn phí. CPU phải đẩy địa chỉ trở về, chép đối số, nhảy, rồi sau đó tháo khung. Vì thế câu hỏi của slide 49 ("chuyện gì xảy ra?") cũng là câu hỏi về hiệu năng, và vì thế trình biên dịch đôi khi nội tuyến (inline) các hàm nhỏ.</li>
<li><strong>Góc nhìn đề thi</strong> — câu hỏi trong mục này gần như không bao giờ là "định nghĩa stack". Chúng là "cho chương trình sau, vẽ bản đồ bộ nhớ" hoặc "cho đoạn swap sau, giải thích kết quả". Cả hai đều là bài VẼ. Hãy luyện bằng bút.</li>
</ul>
<p class="meo">💡 Đọc ba slide tiếp theo với một thói quen: cứ thấy một tên biến là hỏi <em>nó sống trong khung nào?</em> Hai biến viết giống hệt nhau ở hai khung là hai vùng nhớ khác nhau, và cả mục này tồn tại để làm điều đó trở nên hiển nhiên.</p>`],

      [50, 'Memory map when a function is called — the four segments',
        `<p class="y-chinh">🎯 The picture on screen splits a running C program's memory into four regions: <strong>Code segment</strong>, <strong>Data segment</strong>, <strong>STACK segment</strong> and <strong>HEAP</strong>.</p>
<ul>
<li><strong>Code segment</strong> — the machine instructions themselves. The slide labels two blocks inside it, "Code of main()" at address 4199776 and "Code of average()" at 4200002. Functions are <em>data at an address</em> too; that is why a function name without parentheses is a value (its address), a fact Slot 10 reuses.</li>
<li><strong>Data segment</strong> — global and <code>static</code> variables. The slide puts <code>myVar = 10</code> here (around 42026608). This region is created when the program starts and destroyed when it ends: nothing in it comes and goes with function calls.</li>
<li><strong>STACK segment</strong> — local variables and parameters. The slide shows <code>a = 5</code> and <code>b = 8</code> at 6684184 / 6684188. This is the region that grows and shrinks on every call.</li>
<li><strong>HEAP</strong> — named on the slide but deliberately left empty. It is memory you request explicitly at run time with <code>malloc</code> and release with <code>free</code>. PRF192 never allocates on the heap; it is drawn only so you know the fourth region exists and is <em>not</em> where your ordinary variables live.</li>
<li><strong>The addresses on the slide are just an illustration</strong> — they are the numbers one particular compiler on one particular machine produced. Yours will differ every run (address randomisation). What is <em>not</em> illustrative is the <em>grouping</em>: globals far from locals, code far from both.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int myVar = 10;                       /* data segment  */

double average(int a, int b) {        /* code segment  */
    double result;                    /* stack         */
    result = (a + b) / 2.;
    printf("  average: &amp;a=%p &amp;b=%p &amp;result=%p\\n",
           (void *)&amp;a, (void *)&amp;b, (void *)&amp;result);
    return result;
}

int main(void) {
    int x = 5, y = 8;                 /* stack         */
    printf("main: &amp;myVar=%p &amp;x=%p &amp;y=%p\\n",
           (void *)&amp;myVar, (void *)&amp;x, (void *)&amp;y);
    printf("avg = %f\\n", average(x, y));
    return 0;
}</code></pre>
<p class="dap-an">✅ Compiled and run with <code>cc -Wall -std=c99</code>, one real run printed:<br>
<code>main: &amp;myVar=0x104098000 &amp;x=0x16bd6e3c8 &amp;y=0x16bd6e3c4</code><br>
<code>&nbsp;&nbsp;average: &amp;a=0x16bd6e37c &amp;b=0x16bd6e378 &amp;result=0x16bd6e370</code><br>
<code>avg = 6.500000</code><br>
Read the exponents, not the digits: the global sits at <strong>0x1040…</strong>, the locals at <strong>0x16bd…</strong> — <em>billions of bytes apart</em>, i.e. two different segments, exactly as the slide draws. And <code>average</code>'s frame (0x…37c) is at a <em>lower</em> address than <code>main</code>'s (0x…3c8): the stack grows <strong>downwards</strong>.</p>
<p class="meo">💡 Memorise the table, not the numbers — <em>code</em> = what to do, <em>data</em> = globals that live forever, <em>stack</em> = locals that come and go with calls, <em>heap</em> = memory you asked for by hand. Every "where is this variable stored?" exam question is answered by finding the right row.</p>`,
        `<p class="y-chinh">🎯 Hình trên màn hình chia bộ nhớ của một chương trình C đang chạy thành bốn vùng: <strong>Code segment</strong> (đoạn mã), <strong>Data segment</strong> (đoạn dữ liệu), <strong>STACK segment</strong> (ngăn xếp) và <strong>HEAP</strong> (vùng cấp phát động).</p>
<ul>
<li><strong>Code segment</strong> — chính các lệnh máy. Slide ghi hai khối bên trong: "Code of main()" ở địa chỉ 4199776 và "Code of average()" ở 4200002. Hàm cũng là <em>dữ liệu nằm ở một địa chỉ</em>; đó là lý do tên hàm không kèm ngoặc là một giá trị (địa chỉ của nó), điều Slot 10 sẽ dùng lại.</li>
<li><strong>Data segment</strong> — biến toàn cục và biến <code>static</code>. Slide đặt <code>myVar = 10</code> ở đây (quanh 42026608). Vùng này sinh ra khi chương trình khởi động và mất khi chương trình kết thúc: không có gì trong đó đến rồi đi theo từng lời gọi hàm.</li>
<li><strong>STACK segment</strong> — biến cục bộ và tham số. Slide vẽ <code>a = 5</code> và <code>b = 8</code> ở 6684184 / 6684188. Đây chính là vùng phình ra và co lại theo mỗi lời gọi.</li>
<li><strong>HEAP</strong> — được gọi tên trên slide nhưng cố ý để trống. Đó là bộ nhớ bạn xin tường minh lúc chạy bằng <code>malloc</code> và trả lại bằng <code>free</code>. PRF192 không bao giờ cấp phát trên heap; nó được vẽ ra chỉ để bạn biết vùng thứ tư tồn tại và <em>không phải</em> nơi biến thường của bạn nằm.</li>
<li><strong>Các địa chỉ trên slide chỉ để minh hoạ</strong> — đó là con số mà một trình biên dịch cụ thể trên một máy cụ thể sinh ra. Máy bạn sẽ khác, và khác cả giữa hai lần chạy (do ngẫu nhiên hoá địa chỉ). Thứ <em>không</em> mang tính minh hoạ là cách <em>gom nhóm</em>: toàn cục nằm rất xa cục bộ, mã nằm rất xa cả hai.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int myVar = 10;                       /* đoạn dữ liệu  */

double average(int a, int b) {        /* đoạn mã       */
    double result;                    /* ngăn xếp      */
    result = (a + b) / 2.;
    printf("  average: &amp;a=%p &amp;b=%p &amp;result=%p\\n",
           (void *)&amp;a, (void *)&amp;b, (void *)&amp;result);
    return result;
}

int main(void) {
    int x = 5, y = 8;                 /* ngăn xếp      */
    printf("main: &amp;myVar=%p &amp;x=%p &amp;y=%p\\n",
           (void *)&amp;myVar, (void *)&amp;x, (void *)&amp;y);
    printf("avg = %f\\n", average(x, y));
    return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch và chạy thật bằng <code>cc -Wall -std=c99</code>, một lần chạy in ra:<br>
<code>main: &amp;myVar=0x104098000 &amp;x=0x16bd6e3c8 &amp;y=0x16bd6e3c4</code><br>
<code>&nbsp;&nbsp;average: &amp;a=0x16bd6e37c &amp;b=0x16bd6e378 &amp;result=0x16bd6e370</code><br>
<code>avg = 6.500000</code><br>
Hãy đọc phần đầu địa chỉ, đừng đọc từng chữ số: biến toàn cục nằm ở <strong>0x1040…</strong>, biến cục bộ ở <strong>0x16bd…</strong> — <em>cách nhau hàng tỉ byte</em>, tức hai phân đoạn khác nhau, đúng như slide vẽ. Và khung của <code>average</code> (0x…37c) nằm ở địa chỉ <em>thấp hơn</em> khung của <code>main</code> (0x…3c8): ngăn xếp mọc <strong>xuống dưới</strong>.</p>
<p class="meo">💡 Hãy thuộc cái bảng, đừng thuộc con số — <em>code</em> = làm gì, <em>data</em> = biến toàn cục sống suốt đời chương trình, <em>stack</em> = biến cục bộ đến rồi đi theo lời gọi, <em>heap</em> = bộ nhớ bạn tự xin. Mọi câu hỏi thi dạng "biến này lưu ở đâu?" đều trả lời được bằng cách tìm đúng dòng trong bảng.</p>`],

      [51, 'Memory map when a function is called — the three numbered steps',
        `<p class="y-chinh">🎯 The same picture, now animated: the slide adds the labels <strong>1</strong>, <strong>2</strong>, <strong>2</strong>, <strong>3</strong>, <strong>3</strong>, the word <em>copy</em>, and the new frame holding <code>a = 5</code>, <code>b = 8</code>, <code>result = 6.500000</code>.</p>
<ul>
<li><strong>Step 1 — main is running</strong> — <code>main</code>'s frame is already on the stack, holding its own locals. Execution reaches the line <code>average(x, y)</code>.</li>
<li><strong>Step 2 — allocate and <em>copy</em></strong> — a new frame is pushed for <code>average</code>. The compiler reserves one slot per parameter and <em>initialises each slot with the value of the matching argument</em>. That is the arrow labelled <em>copy</em>: 5 is copied into <code>a</code>, 8 is copied into <code>b</code>. Nothing is shared; two new integers are born.</li>
<li><strong>Step 3 — run, return, destroy</strong> — the body executes in the new frame (<code>result</code> becomes 6.500000), the return value is handed back to the caller, and the whole frame is popped. The memory is not erased, it is simply <em>no longer reserved</em> — which is why reading it afterwards gives garbage rather than an error.</li>
<li><strong>The invisible fourth thing on the stack</strong> — besides parameters and locals, the frame also stores the <strong>return address</strong>: where in <code>main</code>'s code to resume. That is how the CPU finds its way home after the jump into the code segment. The slide does not label it, but every exam drawing of a frame should include it.</li>
<li><strong>Nesting</strong> — if <code>average</code> itself called another function, a third frame would sit below it. Frames stack up; that is the whole reason for the name.</li>
</ul>
<table>
<tr><th>Step</th><th>Stack (top = newest)</th><th>Frame contents</th><th>Return address</th></tr>
<tr><td>1 — before the call</td><td><code>main</code></td><td><code>x = 5</code>, <code>y = 8</code></td><td>(back to the OS)</td></tr>
<tr><td>2 — frame pushed, arguments copied</td><td><code>average</code><br><code>main</code></td><td><code>a = 5</code>, <code>b = 8</code>, <code>result = ?</code><br><code>x = 5</code>, <code>y = 8</code></td><td>line of <code>average(x, y)</code> in <code>main</code><br>(back to the OS)</td></tr>
<tr><td>3 — body runs</td><td><code>average</code><br><code>main</code></td><td><code>a = 5</code>, <code>b = 8</code>, <code>result = 6.500000</code><br><code>x = 5</code>, <code>y = 8</code></td><td>same<br>same</td></tr>
<tr><td>3 — return, frame popped</td><td><code>main</code></td><td><code>x = 5</code>, <code>y = 8</code>; the value 6.5 arrives</td><td>(back to the OS)</td></tr>
</table>
<p class="dap-an">✅ Frames really are pushed and popped — measured. A program where <code>main</code> calls <code>gcd</code>, then calls <code>lcm</code>, and <code>lcm</code> calls <code>gcd</code>, printed the address of the first parameter in each frame:<br>
<code>main frame: &amp;m=0x16b3fa3c8</code> · <code>gcd (called from main): &amp;a=0x16b3fa38c</code> · <code>lcm (called from main): &amp;a=0x16b3fa38c</code> · <code>gcd (called from lcm): &amp;a=0x16b3fa34c</code><br>
<code>gcd</code> and <code>lcm</code> got the <strong>same address</strong> because the first frame was popped before the second was pushed — the space was reused. But the <em>nested</em> <code>gcd</code> got a <strong>deeper</strong> address (0x…34c &lt; 0x…38c) because <code>lcm</code>'s frame was still occupying the space above it. That is the stack discipline, visible in real numbers.</p>
<p class="pitfall">⚠️ "The frame is destroyed" is why unbounded recursion crashes. Each call pushes a frame and never pops it; eventually the stack region runs out and the program dies with a <em>stack overflow</em> / segmentation fault. That is also why slide 48's style rule said "avoid calling the main function recursively".</p>`,
        `<p class="y-chinh">🎯 Vẫn hình đó, nay có hoạt cảnh: slide thêm các nhãn <strong>1</strong>, <strong>2</strong>, <strong>2</strong>, <strong>3</strong>, <strong>3</strong>, chữ <em>copy</em>, và khung mới chứa <code>a = 5</code>, <code>b = 8</code>, <code>result = 6.500000</code>.</p>
<ul>
<li><strong>Bước 1 — main đang chạy</strong> — khung của <code>main</code> đã nằm sẵn trên ngăn xếp, giữ các biến cục bộ của nó. Luồng thực thi chạy tới dòng <code>average(x, y)</code>.</li>
<li><strong>Bước 2 — cấp phát và <em>chép</em></strong> — một khung mới được đẩy lên cho <code>average</code>. Trình biên dịch dành một ô cho mỗi tham số và <em>khởi tạo mỗi ô bằng GIÁ TRỊ của đối số tương ứng</em>. Đó chính là mũi tên ghi <em>copy</em>: số 5 được chép vào <code>a</code>, số 8 được chép vào <code>b</code>. Không có gì dùng chung; hai số nguyên mới ra đời.</li>
<li><strong>Bước 3 — chạy, trả về, huỷ</strong> — thân hàm chạy trong khung mới (<code>result</code> thành 6.500000), giá trị trả về được trao lại cho nơi gọi, rồi cả khung bị gỡ đi. Bộ nhớ không bị xoá, nó chỉ <em>thôi được giữ chỗ</em> — và đó là lý do đọc lại nó sau đó ra rác chứ không ra lỗi.</li>
<li><strong>Thứ thứ tư vô hình trên ngăn xếp</strong> — ngoài tham số và biến cục bộ, khung còn lưu <strong>địa chỉ trở về</strong> (return address): chỗ nào trong mã của <code>main</code> để chạy tiếp. Nhờ nó CPU biết đường về sau cú nhảy sang đoạn mã. Slide không ghi nhãn cho nó, nhưng mọi bài vẽ khung trong đề thi đều nên có.</li>
<li><strong>Lồng nhau</strong> — nếu <code>average</code> lại gọi một hàm khác, khung thứ ba sẽ nằm bên dưới nó. Các khung chồng lên nhau; đó chính là lý do có cái tên "ngăn xếp".</li>
</ul>
<table>
<tr><th>Bước</th><th>Ngăn xếp (trên cùng = mới nhất)</th><th>Nội dung khung</th><th>Địa chỉ trở về</th></tr>
<tr><td>1 — trước lời gọi</td><td><code>main</code></td><td><code>x = 5</code>, <code>y = 8</code></td><td>(về hệ điều hành)</td></tr>
<tr><td>2 — đẩy khung, chép đối số</td><td><code>average</code><br><code>main</code></td><td><code>a = 5</code>, <code>b = 8</code>, <code>result = ?</code><br><code>x = 5</code>, <code>y = 8</code></td><td>dòng <code>average(x, y)</code> trong <code>main</code><br>(về hệ điều hành)</td></tr>
<tr><td>3 — thân hàm chạy</td><td><code>average</code><br><code>main</code></td><td><code>a = 5</code>, <code>b = 8</code>, <code>result = 6.500000</code><br><code>x = 5</code>, <code>y = 8</code></td><td>như trên<br>như trên</td></tr>
<tr><td>3 — trả về, gỡ khung</td><td><code>main</code></td><td><code>x = 5</code>, <code>y = 8</code>; giá trị 6,5 về tới nơi</td><td>(về hệ điều hành)</td></tr>
</table>
<p class="dap-an">✅ Khung thật sự được đẩy lên và gỡ xuống — đã đo. Một chương trình trong đó <code>main</code> gọi <code>gcd</code>, rồi gọi <code>lcm</code>, và <code>lcm</code> gọi <code>gcd</code>, in địa chỉ tham số đầu của từng khung:<br>
<code>khung main: &amp;m=0x16b3fa3c8</code> · <code>gcd (gọi từ main): &amp;a=0x16b3fa38c</code> · <code>lcm (gọi từ main): &amp;a=0x16b3fa38c</code> · <code>gcd (gọi từ lcm): &amp;a=0x16b3fa34c</code><br>
<code>gcd</code> và <code>lcm</code> nhận <strong>cùng một địa chỉ</strong> vì khung thứ nhất đã bị gỡ trước khi khung thứ hai được đẩy lên — chỗ đó được dùng lại. Nhưng <code>gcd</code> <em>lồng bên trong</em> nhận địa chỉ <strong>sâu hơn</strong> (0x…34c &lt; 0x…38c) vì khung của <code>lcm</code> vẫn còn chiếm chỗ phía trên. Đó là kỷ luật ngăn xếp, hiện ra bằng số thật.</p>
<p class="pitfall">⚠️ "Khung bị huỷ" chính là lý do đệ quy không có điểm dừng làm sập chương trình. Mỗi lời gọi đẩy thêm một khung mà không bao giờ gỡ; cuối cùng vùng ngăn xếp hết chỗ và chương trình chết vì <em>stack overflow</em> / segmentation fault. Đó cũng là lý do quy tắc phong cách ở slide 48 dặn "avoid calling the main function recursively".</p>`],

      [52, 'Pass by value',
        `<p class="y-chinh">🎯 The rule that governs every function call in C, stated on the slide in five lines: <strong>"C-language uses the 'pass by value' only when passing arguments to called functions."</strong> There is no alternative mode in this language.</p>
<ul>
<li><strong>What "by value" means precisely</strong> — the slide spells it out: "The function receives <em>copies</em> of the data supplied by the arguments… (The compiler allocates space for each parameter and initializes each parameter to the value of the corresponding argument in the function call)". Allocate, then initialise from the argument. Two separate variables.</li>
<li><strong>The consequence, in the slide's own words</strong> — "anything passed into a function call is unchanged in the caller's scope when the function returns". Not "usually unchanged". <em>Unchanged</em>, by construction.</li>
<li><strong>"Parameters and arguments stored in different addresses"</strong> — this is the sentence the whole slide turns on, and it is measurable. See the verified addresses below.</li>
<li><strong>"Although they have the same names, they are still different"</strong> — the slide is warning about the most confusing case: <code>void f(int a)</code> called as <code>f(a)</code>. Same letter on screen, two separate integers in two separate frames. The compiler does not care what you named them.</li>
<li><strong>"When a called function completes its task, its memory block, allocated, is de-allocated"</strong> — the frame is popped (slide 51, step 3). So even if the function <em>did</em> change its parameter, the change is thrown away a microsecond later.</li>
<li><strong>Where the escape hatch is</strong> — if a function must change the caller's variable, the caller passes the <em>address</em> and the function writes through it. That is pass-by-value too (you copy an address), but the thing you copied points back at the original. This is Slot 10, Pointers, and slide 52 is the reason it exists.</li>
</ul>
<p class="dap-an">✅ "Different addresses" verified by compiling. A function with parameters <code>a</code> and <code>b</code> called from a <code>main</code> whose locals are also named <code>a</code> and <code>b</code> printed:<br>
<code>main: &amp;a=0x16f0aa3c8 &amp;b=0x16f0aa3c4</code><br>
<code>&nbsp;&nbsp;swap: &amp;a=0x16f0aa38c &amp;b=0x16f0aa388</code><br>
Four different addresses, 60 bytes apart. The names match; the storage does not.</p>
<p class="pitfall">⚠️ Two things people wrongly assume are exceptions. (1) <strong>Arrays</strong> — <code>void f(int arr[])</code> <em>does</em> let the function change the caller's array, and it looks like an exception. It is not: what gets copied is the array's <em>address</em>, so C is still passing by value; you copied a pointer. (2) <strong><code>const</code></strong> — <code>void f(const int a)</code> adds nothing for a plain <code>int</code>; the caller was already safe. <code>const</code> only earns its keep once addresses are involved.</p>`,
        `<p class="y-chinh">🎯 Luật chi phối mọi lời gọi hàm trong C, slide nêu trong năm dòng: <strong>"C-language uses the 'pass by value' only when passing arguments to called functions"</strong> — C CHỈ truyền theo giá trị. Ngôn ngữ này không có chế độ nào khác.</p>
<ul>
<li><strong>"Theo giá trị" nghĩa chính xác là gì</strong> — slide viết rõ: "The function receives <em>copies</em> of the data supplied by the arguments… (The compiler allocates space for each parameter and initializes each parameter to the value of the corresponding argument in the function call)" — cấp chỗ cho mỗi tham số, rồi khởi tạo nó bằng giá trị của đối số. Hai biến riêng biệt.</li>
<li><strong>Hệ quả, bằng chính chữ của slide</strong> — "anything passed into a function call is unchanged in the caller's scope when the function returns": thứ gì truyền vào hàm thì khi hàm trả về, ở phía người gọi nó KHÔNG đổi. Không phải "thường không đổi". Là <em>không đổi</em>, do cấu tạo.</li>
<li><strong>"Parameters and arguments stored in different addresses"</strong> — đây là câu mà cả slide xoay quanh, và nó đo được. Xem các địa chỉ đã kiểm ở dưới.</li>
<li><strong>"Although they have the same names, they are still different"</strong> — slide đang cảnh báo trường hợp gây rối nhất: <code>void f(int a)</code> được gọi bằng <code>f(a)</code>. Cùng một chữ cái trên màn hình, hai số nguyên riêng biệt ở hai khung riêng biệt. Trình biên dịch không quan tâm bạn đặt tên là gì.</li>
<li><strong>"When a called function completes it's task, it's memory block, allocated, is de-allocated"</strong> — khung bị gỡ (slide 51, bước 3). Nên kể cả hàm <em>có</em> sửa tham số của nó thì một phần triệu giây sau thay đổi ấy cũng bị vứt đi.</li>
<li><strong>Lối thoát nằm ở đâu</strong> — nếu một hàm buộc phải sửa biến của người gọi, người gọi truyền <em>địa chỉ</em> và hàm ghi xuyên qua địa chỉ đó. Đó vẫn là truyền theo giá trị (bạn chép một địa chỉ), nhưng thứ bạn chép lại trỏ ngược về bản gốc. Đó là Slot 10 — Con trỏ, và slide 52 chính là lý do nó tồn tại.</li>
</ul>
<p class="dap-an">✅ "Khác địa chỉ" đã kiểm bằng biên dịch thật. Một hàm có tham số <code>a</code>, <code>b</code> được gọi từ <code>main</code> mà biến cục bộ cũng tên <code>a</code>, <code>b</code>, in ra:<br>
<code>main: &amp;a=0x16f0aa3c8 &amp;b=0x16f0aa3c4</code><br>
<code>&nbsp;&nbsp;swap: &amp;a=0x16f0aa38c &amp;b=0x16f0aa388</code><br>
Bốn địa chỉ khác nhau, cách nhau 60 byte. Tên thì trùng; ô nhớ thì không.</p>
<p class="pitfall">⚠️ Hai thứ hay bị tưởng nhầm là ngoại lệ. (1) <strong>Mảng</strong> — <code>void f(int arr[])</code> <em>thật sự</em> cho phép hàm sửa mảng của người gọi, trông y như ngoại lệ. Không phải: thứ được chép là <em>địa chỉ</em> của mảng, nên C vẫn đang truyền theo giá trị; bạn đã chép một con trỏ. (2) <strong><code>const</code></strong> — <code>void f(const int a)</code> chẳng thêm gì cho một <code>int</code> thường; người gọi vốn đã an toàn. <code>const</code> chỉ có giá trị khi đã dính tới địa chỉ.</p>`],

      [53, 'Exercise 3 — swap two integers: rewrite, run, draw the memory map, explain',
        `<p class="y-chinh">🎯 The classic exercise that makes pass-by-value unforgettable: a swap function that looks perfectly correct, compiles without a single warning, runs — and changes nothing.</p>
<ul>
<li><strong>What the slide asks</strong> — three tasks, in order: "Rewrite, compile and run this program", "Draw memory map", "Explain the result". Notice the order: <em>run first</em>, then explain. The surprise is the teaching device.</li>
<li><strong>About the code on this slide</strong> — the program itself is an image on the slide, so the exact source is not in the extracted text and is not reproduced here character-for-character. What follows is the canonical version of this exercise; if your copy of the slide differs in variable names or in the printed wording, the mechanism and the answer are identical.</li>
<li><strong>The program</strong> —
<pre><code>#include &lt;stdio.h&gt;

void swap(int a, int b) {
    int temp;
    temp = a;
    a = b;
    b = temp;
    printf("  inside swap : a = %d, b = %d\\n", a, b);
}

int main(void) {
    int a = 5, b = 8;
    printf("before swap : a = %d, b = %d\\n", a, b);
    swap(a, b);
    printf("after  swap : a = %d, b = %d\\n", a, b);
    return 0;
}</code></pre></li>
<li><strong>The memory map the slide asks you to draw</strong> — two frames, four integers, and the copy arrows. See the table below.</li>
<li><strong>Why it is not a bug in your code</strong> — the swap <em>does</em> work. It works perfectly on <code>swap</code>'s own <code>a</code> and <code>b</code>. Those two variables are then destroyed. The function was never given any way to reach <code>main</code>'s <code>a</code> and <code>b</code>; it only got their values.</li>
</ul>
<table>
<tr><th>Step</th><th><code>main</code> frame (0x…3c8 / 0x…3c4)</th><th><code>swap</code> frame (0x…38c / 0x…388)</th><th>Output</th></tr>
<tr><td>1. <code>main</code> starts</td><td><code>a = 5</code>, <code>b = 8</code></td><td>— not created yet —</td><td><code>before swap : a = 5, b = 8</code></td></tr>
<tr><td>2. call <code>swap(a, b)</code> — copy</td><td><code>a = 5</code>, <code>b = 8</code></td><td><code>a = 5</code>, <code>b = 8</code>, <code>temp = ?</code></td><td></td></tr>
<tr><td>3. <code>temp = a;</code></td><td><code>a = 5</code>, <code>b = 8</code></td><td><code>a = 5</code>, <code>b = 8</code>, <code>temp = 5</code></td><td></td></tr>
<tr><td>4. <code>a = b;</code></td><td><code>a = 5</code>, <code>b = 8</code></td><td><code>a = 8</code>, <code>b = 8</code>, <code>temp = 5</code></td><td></td></tr>
<tr><td>5. <code>b = temp;</code></td><td><code>a = 5</code>, <code>b = 8</code></td><td><code>a = 8</code>, <code>b = 5</code>, <code>temp = 5</code></td><td><code>&nbsp;&nbsp;inside swap : a = 8, b = 5</code></td></tr>
<tr><td>6. <code>swap</code> returns — frame popped</td><td><code>a = 5</code>, <code>b = 8</code></td><td>— destroyed —</td><td><code>after&nbsp;&nbsp;swap : a = 5, b = 8</code></td></tr>
</table>
<p class="dap-an">✅ <strong>Answer.</strong> Compiled with <code>cc -Wall -std=c99</code> (no warnings) and run, the program prints exactly:<br>
<code>before swap : a = 5, b = 8</code><br>
<code>&nbsp;&nbsp;inside swap : a = 8, b = 5</code><br>
<code>after&nbsp;&nbsp;swap : a = 5, b = 8</code><br>
<strong>Explanation:</strong> <code>swap</code>'s parameters are <em>copies</em> living at different addresses (measured: <code>main</code> 0x16f0aa3c8 / 0x16f0aa3c4 versus <code>swap</code> 0x16f0aa38c / 0x16f0aa388). Lines 3–5 swap the copies; line 6 destroys them. <code>main</code>'s <code>a</code> and <code>b</code> were never touched. The fix needs addresses:
<pre><code>void swap(int *pa, int *pb) {
    int t = *pa;
    *pa = *pb;
    *pb = t;
}
/* called as:  swap(&amp;a, &amp;b);  */</code></pre>
Also compiled and run: this version prints <code>a=8 b=5</code> in <code>main</code>. That is the whole reason Slot 10 exists.</p>
<p class="pitfall">⚠️ A tempting "fix" that is worse than the bug: making <code>a</code> and <code>b</code> global so <code>swap()</code> can reach them. It works, and it is exactly the <em>high coupling</em> slides 19–20 told you to avoid — the function is now welded to two specific variables and can never swap any other pair. Prefer the pointer version.</p>`,
        `<p class="y-chinh">🎯 Bài tập kinh điển khiến "truyền theo giá trị" không thể quên: một hàm hoán đổi trông hoàn toàn đúng, biên dịch không một cảnh báo, chạy được — và không đổi gì cả.</p>
<ul>
<li><strong>Slide yêu cầu gì</strong> — ba việc, theo thứ tự: "Rewrite, compile and run this program", "Draw memory map", "Explain the result". Để ý thứ tự: <em>chạy trước</em>, giải thích sau. Chính sự bất ngờ là công cụ dạy học.</li>
<li><strong>Về đoạn code trên slide này</strong> — bản thân chương trình nằm trong ẢNH của slide, nên mã nguồn chính xác không có trong phần chữ trích ra và ở đây KHÔNG tái tạo nguyên văn từng ký tự. Dưới đây là phiên bản chuẩn của bài này; nếu bản slide của bạn khác tên biến hay khác câu chữ in ra thì cơ chế và đáp án vẫn y hệt.</li>
<li><strong>Chương trình</strong> —
<pre><code>#include &lt;stdio.h&gt;

void swap(int a, int b) {
    int temp;
    temp = a;
    a = b;
    b = temp;
    printf("  inside swap : a = %d, b = %d\\n", a, b);
}

int main(void) {
    int a = 5, b = 8;
    printf("before swap : a = %d, b = %d\\n", a, b);
    swap(a, b);
    printf("after  swap : a = %d, b = %d\\n", a, b);
    return 0;
}</code></pre></li>
<li><strong>Bản đồ bộ nhớ mà slide bảo bạn vẽ</strong> — hai khung, bốn số nguyên, và các mũi tên chép. Xem bảng bên dưới.</li>
<li><strong>Vì sao đây không phải lỗi code của bạn</strong> — phép hoán đổi <em>có</em> chạy. Nó chạy hoàn hảo trên <code>a</code> và <code>b</code> của chính <code>swap</code>. Rồi hai biến đó bị huỷ. Hàm chưa từng được trao bất kỳ đường nào để với tới <code>a</code>, <code>b</code> của <code>main</code>; nó chỉ nhận được giá trị của chúng.</li>
</ul>
<table>
<tr><th>Bước</th><th>Khung <code>main</code> (0x…3c8 / 0x…3c4)</th><th>Khung <code>swap</code> (0x…38c / 0x…388)</th><th>Kết quả in</th></tr>
<tr><td>1. <code>main</code> bắt đầu</td><td><code>a = 5</code>, <code>b = 8</code></td><td>— chưa tạo —</td><td><code>before swap : a = 5, b = 8</code></td></tr>
<tr><td>2. gọi <code>swap(a, b)</code> — chép</td><td><code>a = 5</code>, <code>b = 8</code></td><td><code>a = 5</code>, <code>b = 8</code>, <code>temp = ?</code></td><td></td></tr>
<tr><td>3. <code>temp = a;</code></td><td><code>a = 5</code>, <code>b = 8</code></td><td><code>a = 5</code>, <code>b = 8</code>, <code>temp = 5</code></td><td></td></tr>
<tr><td>4. <code>a = b;</code></td><td><code>a = 5</code>, <code>b = 8</code></td><td><code>a = 8</code>, <code>b = 8</code>, <code>temp = 5</code></td><td></td></tr>
<tr><td>5. <code>b = temp;</code></td><td><code>a = 5</code>, <code>b = 8</code></td><td><code>a = 8</code>, <code>b = 5</code>, <code>temp = 5</code></td><td><code>&nbsp;&nbsp;inside swap : a = 8, b = 5</code></td></tr>
<tr><td>6. <code>swap</code> trả về — gỡ khung</td><td><code>a = 5</code>, <code>b = 8</code></td><td>— bị huỷ —</td><td><code>after&nbsp;&nbsp;swap : a = 5, b = 8</code></td></tr>
</table>
<p class="dap-an">✅ <strong>Đáp án.</strong> Biên dịch bằng <code>cc -Wall -std=c99</code> (không cảnh báo nào) và chạy thật, chương trình in đúng:<br>
<code>before swap : a = 5, b = 8</code><br>
<code>&nbsp;&nbsp;inside swap : a = 8, b = 5</code><br>
<code>after&nbsp;&nbsp;swap : a = 5, b = 8</code><br>
<strong>Giải thích:</strong> tham số của <code>swap</code> là <em>bản sao</em> nằm ở địa chỉ khác (đo được: <code>main</code> 0x16f0aa3c8 / 0x16f0aa3c4 so với <code>swap</code> 0x16f0aa38c / 0x16f0aa388). Dòng 3–5 hoán đổi các bản sao; dòng 6 huỷ chúng. <code>a</code> và <code>b</code> của <code>main</code> chưa hề bị đụng tới. Muốn sửa thì phải dùng địa chỉ:
<pre><code>void swap(int *pa, int *pb) {
    int t = *pa;
    *pa = *pb;
    *pb = t;
}
/* gọi là:  swap(&amp;a, &amp;b);  */</code></pre>
Bản này cũng đã biên dịch và chạy: nó in <code>a=8 b=5</code> trong <code>main</code>. Đó chính là toàn bộ lý do tồn tại của Slot 10.</p>
<p class="pitfall">⚠️ Một "cách sửa" hấp dẫn nhưng còn tệ hơn cả cái lỗi: đưa <code>a</code> và <code>b</code> thành biến toàn cục để <code>swap()</code> với tới được. Nó chạy, và nó đúng là <em>coupling cao</em> mà slide 19–20 dặn phải tránh — hàm nay bị hàn chết vào hai biến cụ thể và không bao giờ hoán đổi được cặp nào khác. Hãy dùng bản con trỏ.</p>`],

      [54, '8 - Analyse a program to functions (section divider)',
        `<p class="y-chinh">🎯 A section marker. The previous block answered "what does a call cost?"; this one answers the design question that comes before any call exists: <strong>given a problem statement in English, which functions should there be?</strong></p>
<ul>
<li><strong>Why this is the hard part</strong> — writing a function whose specification you already have is mechanical. Deciding <em>what the functions are</em> is where programs become readable or unreadable. Slides 13–25 gave you the quality criteria (cohesion, coupling); slides 54–55 give you the procedure.</li>
<li><strong>The procedure in one line</strong> — pick the <strong>nouns</strong> out of the problem and they become your variables; pick the <strong>verbs</strong> and they become your functions. Slide 16 already planted this: "If you still use a verb to describe a task then a module is identified."</li>
<li><strong>Then order them</strong> — the verbs come out of an English sentence in whatever order the sentence happened to use. You must re-order them into an order a machine can execute: you cannot print a result before you compute it, nor compute it before you read the input.</li>
<li><strong>Simple versus complex</strong> — not every verb deserves a function. "Read an integer" is one <code>scanf</code> call; making a function for it adds a name and buys nothing. Slide 55 draws exactly this distinction and calls the trivial ones "Simple task: Input/Output simple variables → Use library functions".</li>
<li><strong>What the exam asks</strong> — typically: "analyse the following problem into functions" with a two- or three-sentence problem. Full marks come from listing nouns, listing verbs, marking which verbs become functions, and writing each function's header (return type + name + parameters) <em>before</em> writing a single line of body.</li>
</ul>
<p class="meo">💡 A fast self-check on your chosen function names: if you cannot name a function with a <em>verb + noun</em> (<code>sumDivisors</code>, <code>printNPrimes</code>, <code>isPrime</code>, <code>checkDate</code>), the function is probably doing more than one thing. A name like <code>process()</code> or <code>doStuff()</code> is a design smell, not a naming problem.</p>`,
        `<p class="y-chinh">🎯 Slide phân mục. Khối trước trả lời "một lời gọi tốn gì?"; khối này trả lời câu hỏi thiết kế đến TRƯỚC khi có bất kỳ lời gọi nào: <strong>cho một đề bài viết bằng tiếng Anh, chương trình nên có những hàm nào?</strong></p>
<ul>
<li><strong>Vì sao đây mới là phần khó</strong> — viết một hàm mà bạn đã có sẵn đặc tả là việc máy móc. Quyết định <em>có những hàm nào</em> mới là chỗ chương trình trở nên dễ đọc hay không đọc nổi. Slide 13–25 đã cho bạn tiêu chuẩn chất lượng (cohesion, coupling); slide 54–55 cho bạn quy trình.</li>
<li><strong>Quy trình gói trong một dòng</strong> — nhặt các <strong>danh từ</strong> trong đề, chúng thành biến; nhặt các <strong>động từ</strong>, chúng thành hàm. Slide 16 đã gieo sẵn ý này: "If you still use a verb to describe a task then a module is identified."</li>
<li><strong>Rồi sắp xếp lại</strong> — các động từ hiện ra theo thứ tự mà câu tiếng Anh tình cờ dùng. Bạn phải sắp lại thành thứ tự máy chạy được: không thể in kết quả trước khi tính, cũng không thể tính trước khi đọc dữ liệu vào.</li>
<li><strong>Đơn giản hay phức tạp</strong> — không phải động từ nào cũng xứng đáng có một hàm. "Đọc một số nguyên" chỉ là một lời gọi <code>scanf</code>; làm hàm cho nó thì thêm một cái tên mà chẳng được gì. Slide 55 vẽ đúng ranh giới này và gọi nhóm tầm thường là "Simple task: Input/Output simple variables → Use library functions".</li>
<li><strong>Đề thi hỏi gì</strong> — thường là: "phân tích bài toán sau thành các hàm" kèm một đề dài hai ba câu. Muốn trọn điểm thì liệt kê danh từ, liệt kê động từ, đánh dấu động từ nào thành hàm, và viết header của từng hàm (kiểu trả về + tên + tham số) <em>trước khi</em> viết một dòng thân hàm nào.</li>
</ul>
<p class="meo">💡 Cách tự kiểm nhanh tên hàm bạn vừa đặt: nếu không đặt được tên theo kiểu <em>động từ + danh từ</em> (<code>sumDivisors</code>, <code>printNPrimes</code>, <code>isPrime</code>, <code>checkDate</code>) thì nhiều khả năng hàm đó đang làm hơn một việc. Một cái tên như <code>process()</code> hay <code>doStuff()</code> là mùi thiết kế hỏng, không phải chuyện đặt tên.</p>`],

      [55, 'Analyse a program to functions — the pipeline',
        `<p class="y-chinh">🎯 The slide draws the analysis as a pipeline: <strong>Problem → pick nouns → variables a, b, c (suitable types) → re-order requirements into a logical order (algorithm) → write each verb as a function.</strong></p>
<ul>
<li><strong>Stage 1: pick nouns → variables</strong> — the slide's note "(Suitable types)" is doing real work. "A positive integer" → <code>int</code> or <code>long</code>; "a resistance" → <code>double</code>; "a year" → <code>int</code>. Getting the type wrong here poisons every function downstream.</li>
<li><strong>Stage 2: re-order into an algorithm</strong> — the slide writes the result as pseudo-code:
<pre><code>Begin
    Verb1  a ;   // complex
    Verb2  b ;   // complex
    Verb3  c ;   // Simple
    ...
End.</code></pre>
Each line is tagged <em>complex</em> or <em>Simple</em>. Complex ones become your own functions; Simple ones stay inline as library calls.</li>
<li><strong>Stage 3: the skeleton it produces</strong> — the slide shows exactly what you should have on paper before coding:
<pre><code>// library functions
#include &lt;stdio.h&gt;

void verb1(Type a) {  }
int  verb2(Type b) {  ......  return 3*b; }

int main() {
    int a, b, c;
    verb1(a);                        // call function
    printf("%d\\n", verb2(b));
    &lt;suitable statements&gt;
}</code></pre></li>
<li><strong>The rule for "Simple"</strong> — the slide's box says it: "Simple task: Input/Output simple variables → Use library functions". Reading an <code>int</code>, printing an <code>int</code>: those are <code>scanf</code> and <code>printf</code>, already written for you.</li>
<li><strong>How the header falls out of the analysis</strong> — three questions from slide 28, answered per verb: <em>what is the result?</em> → return type. <em>what is the name?</em> → the verb. <em>what data does it need?</em> → the parameters. If the verb produces nothing to hand back, the return type is <code>void</code>.</li>
</ul>
<p class="dap-an">✅ Worked end to end on the deck's own running example — <em>"accept a positive integer, then print the sum of its divisors and its divisors"</em>. Nouns: the integer <code>n</code>, the sum <code>s</code> → <code>int n, s;</code>. Verbs: <em>accept</em> (simple → <code>scanf</code>), <em>sum the divisors</em> (complex → function), <em>print the divisors</em> (complex → function). Headers: <code>int sumOfDivisors(int n);</code> and <code>void printDivisors(int n);</code>. The finished program compiles and, for <code>n = 12</code>, prints <code>Sum of divisors of 12 = 28</code> and <code>Divisors of 12: 1, 2, 3, 4, 6, 12,</code> — matching the numbers the deck itself quoted back on slide 27. For <code>n = 28</code> it prints <strong>56</strong> and <code>1, 2, 4, 7, 14, 28,</code>.</p>
<p class="meo">💡 The pipeline also tells you the <em>order to write code in</em>: prototypes first (so the compiler is happy), then <code>main</code> reading like the English problem statement, then the bodies one at a time. Each body can be compiled and tested the moment it is written, instead of debugging 80 lines at once.</p>`,
        `<p class="y-chinh">🎯 Slide vẽ quá trình phân tích thành một dây chuyền: <strong>Đề bài → nhặt danh từ → biến a, b, c (kiểu phù hợp) → sắp lại yêu cầu theo thứ tự hợp lý (thuật toán) → viết mỗi động từ thành một hàm.</strong></p>
<ul>
<li><strong>Chặng 1: nhặt danh từ → biến</strong> — ghi chú "(Suitable types)" trên slide gánh việc thật. "Một số nguyên dương" → <code>int</code> hoặc <code>long</code>; "một điện trở" → <code>double</code>; "một năm" → <code>int</code>. Chọn sai kiểu ở đây là đầu độc mọi hàm phía sau.</li>
<li><strong>Chặng 2: sắp lại thành thuật toán</strong> — slide viết kết quả dưới dạng mã giả:
<pre><code>Begin
    Verb1  a ;   // phức tạp
    Verb2  b ;   // phức tạp
    Verb3  c ;   // đơn giản
    ...
End.</code></pre>
Mỗi dòng gắn nhãn <em>complex</em> hay <em>Simple</em>. Cái phức tạp thành hàm của bạn; cái đơn giản để nguyên tại chỗ bằng lời gọi thư viện.</li>
<li><strong>Chặng 3: bộ khung nó sinh ra</strong> — slide cho thấy đúng thứ bạn phải có trên giấy TRƯỚC khi gõ code:
<pre><code>// hàm thư viện
#include &lt;stdio.h&gt;

void verb1(Type a) {  }
int  verb2(Type b) {  ......  return 3*b; }

int main() {
    int a, b, c;
    verb1(a);                        // gọi hàm
    printf("%d\\n", verb2(b));
    &lt;các câu lệnh phù hợp&gt;
}</code></pre></li>
<li><strong>Luật cho chữ "Simple"</strong> — ô ghi chú trên slide nói rõ: "Simple task: Input/Output simple variables → Use library functions". Đọc một <code>int</code>, in một <code>int</code>: đó là <code>scanf</code> và <code>printf</code>, người ta viết sẵn cho bạn rồi.</li>
<li><strong>Header rơi ra từ phần phân tích thế nào</strong> — ba câu hỏi của slide 28, trả lời cho từng động từ: <em>kết quả là gì?</em> → kiểu trả về. <em>tên việc là gì?</em> → chính động từ đó. <em>cần dữ liệu gì?</em> → danh sách tham số. Nếu động từ không sinh ra thứ gì để trao lại thì kiểu trả về là <code>void</code>.</li>
</ul>
<p class="dap-an">✅ Làm trọn vẹn trên chính ví dụ xuyên suốt bộ slide — <em>"nhận một số nguyên dương rồi in tổng các ước và các ước của nó"</em>. Danh từ: số nguyên <code>n</code>, tổng <code>s</code> → <code>int n, s;</code>. Động từ: <em>nhận</em> (đơn giản → <code>scanf</code>), <em>tính tổng các ước</em> (phức tạp → hàm), <em>in các ước</em> (phức tạp → hàm). Header: <code>int sumOfDivisors(int n);</code> và <code>void printDivisors(int n);</code>. Chương trình hoàn chỉnh biên dịch được và với <code>n = 12</code> in ra <code>Sum of divisors of 12 = 28</code> cùng <code>Divisors of 12: 1, 2, 3, 4, 6, 12,</code> — khớp đúng con số mà chính bộ slide đã nêu ở slide 27. Với <code>n = 28</code> nó in <strong>56</strong> và <code>1, 2, 4, 7, 14, 28,</code>.</p>
<p class="meo">💡 Dây chuyền này cũng nói cho bạn <em>thứ tự gõ code</em>: prototype trước (để trình biên dịch yên tâm), rồi <code>main</code> đọc lên nghe giống hệt đề bài tiếng Anh, rồi từng thân hàm một. Mỗi thân hàm vừa viết xong là biên dịch và thử được ngay, thay vì gỡ lỗi 80 dòng cùng lúc.</p>`],

      [56, '9 - Implement a program using functions (section divider)',
        `<p class="y-chinh">🎯 A section marker. Slide 55 turned a problem into a <em>list of headers</em>; this block fills in the bodies, using one complete worked example — printing the first n primes — from analysis all the way to compiled output.</p>
<ul>
<li><strong>What changes at this point</strong> — analysis is done on paper and in English. Implementation is done in C, one function at a time, and every function you finish can be compiled and tested immediately.</li>
<li><strong>The example chosen, and why</strong> — "print the n first primes" is deliberately two-level: the outer job (<code>printNPrimes</code>) is itself complex, and <em>inside</em> it another verb appears ("value is a prime"). That second-level discovery is the point of the example.</li>
<li><strong>Analysis can recurse</strong> — this is the lesson most students miss. You do not analyse once and then code. You analyse, start coding, discover a new verb hiding inside a body, and analyse that one too. Slides 57–58 show exactly that happening.</li>
<li><strong>Bottom-up testing</strong> — write and test <code>isPrime</code> alone first (does <code>isPrime(2)</code> give 1? does <code>isPrime(1)</code> give 0? does <code>isPrime(9)</code> give 0?). Only then wire it into <code>printNPrimes</code>. Debugging a 6-line function is trivial; debugging a 40-line program is not.</li>
<li><strong>The connection to Exercise 4</strong> — slide 59 immediately asks you to do the same thing unaided for GCD and LCM. If you can follow 57–58 with a pen, 59 is fifteen minutes of work.</li>
</ul>
<p class="meo">💡 A practical habit for this block: keep a temporary <code>main</code> that does nothing but call the function you just wrote with three or four hand-picked inputs, including the awkward ones (0, 1, the smallest legal value). Delete it when the real <code>main</code> is ready. That is unit testing, and it starts here in PRF192.</p>`,
        `<p class="y-chinh">🎯 Slide phân mục. Slide 55 biến đề bài thành một <em>danh sách header</em>; khối này điền thân hàm vào, bằng một ví dụ hoàn chỉnh — in n số nguyên tố đầu tiên — từ phân tích cho tới kết quả biên dịch chạy ra.</p>
<ul>
<li><strong>Điều gì đổi ở đây</strong> — phân tích làm trên giấy và bằng tiếng Anh. Hiện thực làm bằng C, từng hàm một, và mỗi hàm viết xong là biên dịch và thử được ngay.</li>
<li><strong>Vì sao chọn ví dụ này</strong> — "in n số nguyên tố đầu tiên" cố ý có hai tầng: việc bên ngoài (<code>printNPrimes</code>) đã phức tạp, và <em>bên trong</em> nó lại lòi ra một động từ nữa ("value is a prime"). Phát hiện tầng thứ hai đó chính là ý nghĩa của ví dụ.</li>
<li><strong>Phân tích có thể lặp lại</strong> — đây là bài học đa số sinh viên bỏ lỡ. Bạn KHÔNG phân tích một lần rồi ngồi gõ. Bạn phân tích, bắt đầu gõ, phát hiện một động từ mới nấp trong thân hàm, rồi phân tích tiếp cái đó. Slide 57–58 cho thấy đúng chuyện đó đang diễn ra.</li>
<li><strong>Thử từ dưới lên</strong> — viết và thử <code>isPrime</code> đứng riêng trước (<code>isPrime(2)</code> có ra 1 không? <code>isPrime(1)</code> có ra 0 không? <code>isPrime(9)</code> có ra 0 không?). Xong rồi mới ghép vào <code>printNPrimes</code>. Gỡ lỗi một hàm 6 dòng là chuyện vặt; gỡ lỗi chương trình 40 dòng thì không.</li>
<li><strong>Liên hệ với Exercise 4</strong> — slide 59 ngay sau đó bắt bạn tự làm y như vậy cho ƯCLN và BCNN. Nếu bạn theo được 57–58 bằng bút thì 59 chỉ là mười lăm phút.</li>
</ul>
<p class="meo">💡 Một thói quen thực dụng cho khối này: giữ một <code>main</code> tạm chỉ để gọi đúng cái hàm bạn vừa viết với ba bốn dữ liệu tự chọn, kể cả những ca khó chịu (0, 1, giá trị hợp lệ nhỏ nhất). Xoá nó đi khi <code>main</code> thật đã xong. Đó chính là kiểm thử đơn vị, và nó bắt đầu ngay ở PRF192.</p>`],

      [57, 'Implement a program using functions — analysis of "print the n first primes"',
        `<p class="y-chinh">🎯 One complete analysis on screen: nouns → <code>int n</code>; verbs → accept n (<em>simple</em>), print the n first primes (<em>function</em>); and inside that function, a second verb appears — "value is a prime" → another <em>function</em>.</p>
<ul>
<li><strong>The slide's noun list</strong> — "Nouns: the integer n → <code>int n</code>". One noun, one variable. Everything else in this problem is machinery, not data from the problem statement.</li>
<li><strong>The slide's verb list</strong> — "Begin / Accept n → <em>simple</em> / Print n first primes → <em>function</em> / End." Exactly the Simple-versus-complex split from slide 55: <code>scanf</code> handles the first, you write the second.</li>
<li><strong>The body it gives you</strong> — written as pseudo-code with the second-level discovery marked:
<pre><code>Function printNPrimes(int n)
    int count = 0;
    int value = 2;
    while (count &lt; n)
    {
        if ( value is a prime )       &lt;-- function
        {
            count = count + 1;
            print out value;          &lt;-- simple
        }
        value = value + 1;
    }</code></pre></li>
<li><strong>Why <code>count</code> and <code>value</code> are two different variables</strong> — this is the exam's favourite trap here. <code>value</code> is the number being tested and it climbs 2, 3, 4, 5, 6, 7…; <code>count</code> is how many primes have been <em>found</em> and it climbs 1, 2, 3… The loop must stop on <code>count</code>, not on <code>value</code>. One variable cannot do both jobs.</li>
<li><strong><code>value = value + 1</code> must sit outside the <code>if</code></strong> — it runs whether or not the number was prime. Put it inside the <code>if</code> and the program hangs forever at <code>value = 4</code>.</li>
<li><strong>The slide's stated expected result</strong> — "Input: n=5 / Output: 2, 3, 5, 7, 11".</li>
</ul>
<table>
<tr><th>Iteration</th><th><code>value</code> on entry</th><th><code>isPrime(value)</code></th><th><code>count</code> after</th><th>printed</th></tr>
<tr><td>1</td><td>2</td><td>1</td><td>1</td><td><code>2, </code></td></tr>
<tr><td>2</td><td>3</td><td>1</td><td>2</td><td><code>3, </code></td></tr>
<tr><td>3</td><td>4</td><td>0</td><td>2</td><td>—</td></tr>
<tr><td>4</td><td>5</td><td>1</td><td>3</td><td><code>5, </code></td></tr>
<tr><td>5</td><td>6</td><td>0</td><td>3</td><td>—</td></tr>
<tr><td>6</td><td>7</td><td>1</td><td>4</td><td><code>7, </code></td></tr>
<tr><td>7</td><td>8</td><td>0</td><td>4</td><td>—</td></tr>
<tr><td>8</td><td>9</td><td>0</td><td>4</td><td>—</td></tr>
<tr><td>9</td><td>10</td><td>0</td><td>4</td><td>—</td></tr>
<tr><td>10</td><td>11</td><td>1</td><td>5</td><td><code>11, </code></td></tr>
<tr><td>—</td><td>12</td><td colspan="3"><code>count &lt; n</code> is <code>5 &lt; 5</code> = false → loop ends</td></tr>
</table>
<p class="dap-an">✅ The trace table above was produced by hand and then confirmed by compiling and running the finished program (source on slide 58): with <code>n = 5</code> it prints <code>2, 3, 5, 7, 11,</code> — matching the slide. With <code>n = 10</code> it prints <code>2, 3, 5, 7, 11, 13, 17, 19, 23, 29,</code>.</p>
<p class="meo">💡 Note the analysis produced <em>two</em> functions from a problem statement that named only one job. That is normal and it is a sign of good decomposition, not of over-engineering: <code>isPrime</code> is reusable on its own, testable on its own, and it makes <code>printNPrimes</code> readable as a sentence.</p>`,
        `<p class="y-chinh">🎯 Một bài phân tích trọn vẹn trên màn hình: danh từ → <code>int n</code>; động từ → nhận n (<em>đơn giản</em>), in n số nguyên tố đầu tiên (<em>hàm</em>); và bên trong hàm đó lòi ra động từ thứ hai — "value is a prime" → lại một <em>hàm</em> nữa.</p>
<ul>
<li><strong>Danh sách danh từ của slide</strong> — "Nouns: the integer n → <code>int n</code>". Một danh từ, một biến. Mọi thứ còn lại trong bài này là bộ máy, không phải dữ liệu từ đề bài.</li>
<li><strong>Danh sách động từ của slide</strong> — "Begin / Accept n → <em>simple</em> / Print n first primes → <em>function</em> / End." Đúng kiểu chia Simple–complex ở slide 55: <code>scanf</code> lo cái đầu, bạn viết cái sau.</li>
<li><strong>Thân hàm slide đưa cho bạn</strong> — viết dạng mã giả, có đánh dấu phát hiện tầng hai:
<pre><code>Function printNPrimes(int n)
    int count = 0;
    int value = 2;
    while (count &lt; n)
    {
        if ( value is a prime )       &lt;-- hàm
        {
            count = count + 1;
            print out value;          &lt;-- đơn giản
        }
        value = value + 1;
    }</code></pre></li>
<li><strong>Vì sao <code>count</code> và <code>value</code> phải là hai biến khác nhau</strong> — đây là cái bẫy đề thi thích nhất ở chỗ này. <code>value</code> là số đang được đem đi kiểm và nó leo 2, 3, 4, 5, 6, 7…; <code>count</code> là số lượng số nguyên tố đã <em>tìm được</em> và nó leo 1, 2, 3… Vòng lặp phải dừng theo <code>count</code>, không phải theo <code>value</code>. Một biến không thể gánh cả hai việc.</li>
<li><strong><code>value = value + 1</code> phải nằm NGOÀI <code>if</code></strong> — nó chạy bất kể số đó có nguyên tố hay không. Đặt nó vào trong <code>if</code> thì chương trình treo vĩnh viễn ở <code>value = 4</code>.</li>
<li><strong>Kết quả slide ghi sẵn</strong> — "Input: n=5 / Output: 2, 3, 5, 7, 11".</li>
</ul>
<table>
<tr><th>Vòng</th><th><code>value</code> lúc vào</th><th><code>isPrime(value)</code></th><th><code>count</code> sau đó</th><th>in ra</th></tr>
<tr><td>1</td><td>2</td><td>1</td><td>1</td><td><code>2, </code></td></tr>
<tr><td>2</td><td>3</td><td>1</td><td>2</td><td><code>3, </code></td></tr>
<tr><td>3</td><td>4</td><td>0</td><td>2</td><td>—</td></tr>
<tr><td>4</td><td>5</td><td>1</td><td>3</td><td><code>5, </code></td></tr>
<tr><td>5</td><td>6</td><td>0</td><td>3</td><td>—</td></tr>
<tr><td>6</td><td>7</td><td>1</td><td>4</td><td><code>7, </code></td></tr>
<tr><td>7</td><td>8</td><td>0</td><td>4</td><td>—</td></tr>
<tr><td>8</td><td>9</td><td>0</td><td>4</td><td>—</td></tr>
<tr><td>9</td><td>10</td><td>0</td><td>4</td><td>—</td></tr>
<tr><td>10</td><td>11</td><td>1</td><td>5</td><td><code>11, </code></td></tr>
<tr><td>—</td><td>12</td><td colspan="3"><code>count &lt; n</code> là <code>5 &lt; 5</code> = sai → thoát vòng lặp</td></tr>
</table>
<p class="dap-an">✅ Bảng vết trên được lập bằng tay rồi kiểm lại bằng cách biên dịch và chạy chương trình hoàn chỉnh (mã nguồn ở slide 58): với <code>n = 5</code> nó in <code>2, 3, 5, 7, 11,</code> — khớp slide. Với <code>n = 10</code> nó in <code>2, 3, 5, 7, 11, 13, 17, 19, 23, 29,</code>.</p>
<p class="meo">💡 Để ý phần phân tích sinh ra <em>hai</em> hàm từ một đề bài chỉ nêu một việc. Đó là bình thường và là dấu hiệu phân rã tốt, không phải vẽ vời: <code>isPrime</code> tự nó dùng lại được, tự nó thử được, và nó làm cho <code>printNPrimes</code> đọc lên như một câu văn.</p>`],

      [58, 'Implement a program using functions (cont.) — compile & run',
        `<p class="y-chinh">🎯 The continuation slide: the pseudo-code of slide 57 becomes real C, is compiled, and is run. The slide's labels are just "continue" and "Compile &amp; Run" — the substance is in the screenshot.</p>
<ul>
<li><strong>What is on this slide</strong> — the finished source and a console screenshot, both as images; the extracted text carries only the two captions. The program below is the faithful C translation of the pseudo-code on slide 57 and it has been compiled and run; if your slide's version differs in cosmetic details, the behaviour is the same.</li>
<li><strong>The full program</strong> —
<pre><code>#include &lt;stdio.h&gt;

int  isPrime(int value);          /* prototypes, slide 44 */
void printNPrimes(int n);

int main(void) {
    int n;
    printf("Enter n: ");
    scanf("%d", &amp;n);
    printNPrimes(n);
    printf("\\n");
    return 0;
}

int isPrime(int value) {
    int i;
    if (value &lt; 2) return 0;                    /* 0 and 1 are NOT prime */
    for (i = 2; i * i &lt;= value; i++)
        if (value % i == 0) return 0;           /* a divisor found       */
    return 1;                                   /* none found            */
}

void printNPrimes(int n) {
    int count = 0;
    int value = 2;
    while (count &lt; n) {
        if (isPrime(value)) {
            count = count + 1;
            printf("%d, ", value);
        }
        value = value + 1;
    }
}</code></pre></li>
<li><strong>Prototypes at the top</strong> — slide 44 explained the mechanism and slide 48 made it a style rule. With the prototypes present, the two definitions can appear in any order below <code>main</code>. Delete them and <code>main</code> will not compile, because the compiler meets <code>printNPrimes</code> before it has been told what it is.</li>
<li><strong><code>isPrime</code> returns 1 or 0, never prints</strong> — that is slide 36's rule: "Functions for testing will return 1 for true and 0 for false." A testing function that printed would be doing two jobs (low cohesion) and would be unusable inside an <code>if</code>.</li>
<li><strong>Two guards that carry all the marks</strong> — <code>if (value &lt; 2) return 0;</code> (without it, <code>isPrime(1)</code> returns 1 and the output becomes <code>1, 2, 3, 5, 7</code>), and the loop bound <code>i * i &lt;= value</code>. Testing divisors only up to the square root is correct because a composite number always has a factor no larger than its square root.</li>
<li><strong>The early <code>return 0</code></strong> — this is slide 36's "common algorithm in testing is checking all cases which cause FALSE. TRUE is accepted when no case causes FALSE", written in C. It also ends the loop instantly, which is why this version is fast.</li>
</ul>
<p class="dap-an">✅ Compiled with <code>cc -Wall -std=c99</code> (no warnings) and run:<br>
<code>$ echo 5 | ./primes</code> → <code>Enter n: 2, 3, 5, 7, 11,</code><br>
<code>$ echo 10 | ./primes</code> → <code>Enter n: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29,</code><br>
Both match the slide's stated expected output and the hand trace on slide 57.</p>
<p class="pitfall">⚠️ Three variants that look equivalent and are not. <code>i &lt; value</code> instead of <code>i * i &lt;= value</code> — still correct, just slower. <code>i &lt;= value</code> — always returns 0, because every number divides itself. <code>i * i &lt; value</code> — wrong for perfect squares: <code>isPrime(9)</code> would return 1, because <code>i = 3</code> is never tested. Always check your loop bound against a perfect square.</p>`,
        `<p class="y-chinh">🎯 Slide tiếp nối: mã giả của slide 57 thành C thật, được biên dịch và chạy. Nhãn trên slide chỉ có "continue" và "Compile &amp; Run" — phần nội dung nằm trong ảnh chụp màn hình.</p>
<ul>
<li><strong>Trên slide này có gì</strong> — mã nguồn hoàn chỉnh và một ảnh chụp cửa sổ console, cả hai đều là ẢNH; phần chữ trích ra chỉ còn hai dòng nhãn. Chương trình dưới đây là bản dịch trung thành mã giả của slide 57 sang C và đã được biên dịch, chạy thật; nếu bản trên slide của bạn khác vài chi tiết hình thức thì hành vi vẫn như nhau.</li>
<li><strong>Chương trình đầy đủ</strong> —
<pre><code>#include &lt;stdio.h&gt;

int  isPrime(int value);          /* prototype, slide 44 */
void printNPrimes(int n);

int main(void) {
    int n;
    printf("Enter n: ");
    scanf("%d", &amp;n);
    printNPrimes(n);
    printf("\\n");
    return 0;
}

int isPrime(int value) {
    int i;
    if (value &lt; 2) return 0;                    /* 0 và 1 KHÔNG nguyên tố */
    for (i = 2; i * i &lt;= value; i++)
        if (value % i == 0) return 0;           /* tìm được một ước       */
    return 1;                                   /* không tìm được cái nào */
}

void printNPrimes(int n) {
    int count = 0;
    int value = 2;
    while (count &lt; n) {
        if (isPrime(value)) {
            count = count + 1;
            printf("%d, ", value);
        }
        value = value + 1;
    }
}</code></pre></li>
<li><strong>Prototype đặt trên đầu</strong> — slide 44 giải thích cơ chế và slide 48 biến nó thành quy tắc phong cách. Có prototype rồi thì hai định nghĩa bên dưới <code>main</code> đặt theo thứ tự nào cũng được. Xoá chúng đi thì <code>main</code> không dịch được, vì trình biên dịch gặp <code>printNPrimes</code> trước khi có ai nói cho nó biết đó là cái gì.</li>
<li><strong><code>isPrime</code> trả về 1 hoặc 0, KHÔNG in gì</strong> — đó là luật của slide 36: "Functions for testing will return 1 for true and 0 for false." Một hàm kiểm tra mà lại in ra màn hình là đang làm hai việc (cohesion thấp) và sẽ không dùng được bên trong <code>if</code>.</li>
<li><strong>Hai chốt gánh toàn bộ điểm</strong> — <code>if (value &lt; 2) return 0;</code> (thiếu nó thì <code>isPrime(1)</code> trả về 1 và kết quả thành <code>1, 2, 3, 5, 7</code>), và cận vòng lặp <code>i * i &lt;= value</code>. Chỉ thử ước tới căn bậc hai là đúng, vì một hợp số luôn có một thừa số không lớn hơn căn bậc hai của nó.</li>
<li><strong>Lệnh <code>return 0</code> sớm</strong> — chính là câu của slide 36 "common algorithm in testing is checking all cases which cause FALSE. TRUE is accept when no case cause FALSE", viết bằng C. Nó cũng kết thúc vòng lặp ngay lập tức, nên bản này chạy nhanh.</li>
</ul>
<p class="dap-an">✅ Biên dịch bằng <code>cc -Wall -std=c99</code> (không cảnh báo) và chạy thật:<br>
<code>$ echo 5 | ./primes</code> → <code>Enter n: 2, 3, 5, 7, 11,</code><br>
<code>$ echo 10 | ./primes</code> → <code>Enter n: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29,</code><br>
Cả hai khớp kết quả mong đợi ghi trên slide và khớp bảng vết chạy tay ở slide 57.</p>
<p class="pitfall">⚠️ Ba biến thể trông tương đương mà không tương đương. <code>i &lt; value</code> thay cho <code>i * i &lt;= value</code> — vẫn đúng, chỉ chậm hơn. <code>i &lt;= value</code> — luôn trả về 0, vì số nào cũng chia hết cho chính nó. <code>i * i &lt; value</code> — SAI với số chính phương: <code>isPrime(9)</code> sẽ trả về 1, vì <code>i = 3</code> chưa từng được thử. Luôn kiểm cận vòng lặp bằng một số chính phương.</p>`],

      [59, 'Exercise 4 — greatest common divisor and least common multiple',
        `<p class="y-chinh">🎯 "Develop a program that will accept two positive integers then print out the greatest common divisor and the least common multiple of them." The same analysis pipeline as slide 57, now done by you.</p>
<ul>
<li><strong>Analysis — nouns</strong> — two positive integers <code>m</code>, <code>n</code>; the GCD <code>G</code>; the LCM <code>L</code>. All <code>int</code> (slide 63 will use exactly these four names, which is a strong hint the deck expects this solution).</li>
<li><strong>Analysis — verbs</strong> — <em>accept two integers</em> (simple → <code>scanf</code>), <em>find the GCD</em> (function), <em>find the LCM</em> (function), <em>print them</em> (simple → <code>printf</code>). Two headers: <code>int gcd(int a, int b);</code> and <code>int lcm(int a, int b);</code>.</li>
<li><strong>The algorithm for GCD</strong> — Euclid's: repeatedly replace (a, b) with (b, a % b) until b is 0; the answer is a. It terminates because the remainder strictly decreases and is never negative.</li>
<li><strong>The formula for LCM</strong> — <code>lcm(a, b) = a * b / gcd(a, b)</code>. Note <code>lcm</code> may call <code>gcd</code>; that is a function calling another function, exactly the nesting slide 51 drew.</li>
<li><strong>The overflow detail worth a mark</strong> — write <code>a / gcd(a, b) * b</code>, not <code>a * b / gcd(a, b)</code>. Both are mathematically equal, but the second computes <code>a * b</code> first and can overflow <code>int</code> for inputs as small as 50000 and 60000. Divide first: <code>a / g</code> is exact, because <code>g</code> divides <code>a</code>.</li>
<li><strong>The full solution</strong> —
<pre><code>#include &lt;stdio.h&gt;

int gcd(int a, int b);
int lcm(int a, int b);

int main(void) {
    int m, n, G, L;
    printf("Enter two positive integers: ");
    scanf("%d%d", &amp;m, &amp;n);
    G = gcd(m, n);
    L = lcm(m, n);
    printf("GCD(%d, %d) = %d\\n", m, n, G);
    printf("LCM(%d, %d) = %d\\n", m, n, L);
    return 0;
}

int gcd(int a, int b) {
    while (b != 0) {
        int r = a % b;
        a = b;
        b = r;
    }
    return a;
}

int lcm(int a, int b) {
    return a / gcd(a, b) * b;      /* divide FIRST to avoid overflow */
}</code></pre></li>
</ul>
<table>
<tr><th>Step</th><th><code>a</code></th><th><code>b</code></th><th><code>r = a % b</code></th><th>after <code>a = b; b = r;</code></th></tr>
<tr><td>1</td><td>48</td><td>180</td><td>48</td><td>a = 180, b = 48</td></tr>
<tr><td>2</td><td>180</td><td>48</td><td>36</td><td>a = 48, b = 36</td></tr>
<tr><td>3</td><td>48</td><td>36</td><td>12</td><td>a = 36, b = 12</td></tr>
<tr><td>4</td><td>36</td><td>12</td><td>0</td><td>a = 12, b = 0 → loop ends</td></tr>
<tr><td>return</td><td colspan="4"><code>a = 12</code> → <strong>gcd(48, 180) = 12</strong></td></tr>
</table>
<p class="dap-an">✅ <strong>Answer.</strong> Compiled with <code>cc -Wall -std=c99</code> and run on three inputs:<br>
<code>12 18</code> → <code>GCD(12, 18) = 6</code>, <code>LCM(12, 18) = 36</code><br>
<code>48 180</code> → <code>GCD(48, 180) = 12</code>, <code>LCM(48, 180) = 720</code><br>
<code>7 13</code> → <code>GCD(7, 13) = 1</code>, <code>LCM(7, 13) = 91</code> (coprime, so the LCM is the product)<br>
The trace table above was also printed by an instrumented build and matches step for step; the <code>gcd(12, 18)</code> trace is <code>(12,18) → (18,12) → (12,6) → (6,0)</code> → <strong>6</strong>. Note step 1 when <code>a &lt; b</code>: <code>48 % 180 = 48</code>, so the first iteration simply swaps them. The algorithm needs no "put the larger first" check.</p>
<p class="pitfall">⚠️ <code>a % 0</code> is undefined behaviour and usually crashes the program. Euclid's loop is safe because it tests <code>b != 0</code> before dividing, but <code>lcm(a, 0)</code> would divide by <code>gcd(a, 0) = a</code> and then multiply by 0 — a wrong answer, silently. The problem says "two <em>positive</em> integers"; a robust program validates that with a <code>do … while (m &lt;= 0 || n &lt;= 0);</code> input loop, exactly as Exercise 5 does on slide 67.</p>`,
        `<p class="y-chinh">🎯 "Develop a program that will accept two positive integers then print out the greatest common divisor and the least common multiple of them" — viết chương trình nhận hai số nguyên dương rồi in ƯCLN và BCNN. Vẫn dây chuyền phân tích của slide 57, nay bạn tự làm.</p>
<ul>
<li><strong>Phân tích — danh từ</strong> — hai số nguyên dương <code>m</code>, <code>n</code>; ƯCLN <code>G</code>; BCNN <code>L</code>. Tất cả kiểu <code>int</code> (slide 63 sẽ dùng đúng bốn cái tên này, một gợi ý rất mạnh rằng bộ slide mong đợi lời giải này).</li>
<li><strong>Phân tích — động từ</strong> — <em>nhận hai số nguyên</em> (đơn giản → <code>scanf</code>), <em>tìm ƯCLN</em> (hàm), <em>tìm BCNN</em> (hàm), <em>in chúng ra</em> (đơn giản → <code>printf</code>). Hai header: <code>int gcd(int a, int b);</code> và <code>int lcm(int a, int b);</code>.</li>
<li><strong>Thuật toán ƯCLN</strong> — Euclid: lặp lại việc thay (a, b) bằng (b, a % b) cho tới khi b bằng 0; đáp số là a. Nó chắc chắn dừng vì số dư giảm ngặt và không bao giờ âm.</li>
<li><strong>Công thức BCNN</strong> — <code>lcm(a, b) = a * b / gcd(a, b)</code>. Để ý <code>lcm</code> có thể gọi <code>gcd</code>; đó là hàm gọi hàm, đúng kiểu lồng nhau slide 51 đã vẽ.</li>
<li><strong>Chi tiết tràn số đáng một điểm</strong> — hãy viết <code>a / gcd(a, b) * b</code>, đừng viết <code>a * b / gcd(a, b)</code>. Về toán thì bằng nhau, nhưng cách thứ hai tính <code>a * b</code> trước và tràn <code>int</code> ngay với dữ liệu nhỏ như 50000 và 60000. Chia trước: <code>a / g</code> luôn chia hết, vì <code>g</code> là ước của <code>a</code>.</li>
<li><strong>Lời giải đầy đủ</strong> —
<pre><code>#include &lt;stdio.h&gt;

int gcd(int a, int b);
int lcm(int a, int b);

int main(void) {
    int m, n, G, L;
    printf("Enter two positive integers: ");
    scanf("%d%d", &amp;m, &amp;n);
    G = gcd(m, n);
    L = lcm(m, n);
    printf("GCD(%d, %d) = %d\\n", m, n, G);
    printf("LCM(%d, %d) = %d\\n", m, n, L);
    return 0;
}

int gcd(int a, int b) {
    while (b != 0) {
        int r = a % b;
        a = b;
        b = r;
    }
    return a;
}

int lcm(int a, int b) {
    return a / gcd(a, b) * b;      /* CHIA trước để khỏi tràn số */
}</code></pre></li>
</ul>
<table>
<tr><th>Bước</th><th><code>a</code></th><th><code>b</code></th><th><code>r = a % b</code></th><th>sau <code>a = b; b = r;</code></th></tr>
<tr><td>1</td><td>48</td><td>180</td><td>48</td><td>a = 180, b = 48</td></tr>
<tr><td>2</td><td>180</td><td>48</td><td>36</td><td>a = 48, b = 36</td></tr>
<tr><td>3</td><td>48</td><td>36</td><td>12</td><td>a = 36, b = 12</td></tr>
<tr><td>4</td><td>36</td><td>12</td><td>0</td><td>a = 12, b = 0 → thoát vòng lặp</td></tr>
<tr><td>trả về</td><td colspan="4"><code>a = 12</code> → <strong>gcd(48, 180) = 12</strong></td></tr>
</table>
<p class="dap-an">✅ <strong>Đáp án.</strong> Biên dịch bằng <code>cc -Wall -std=c99</code> và chạy thật với ba bộ dữ liệu:<br>
<code>12 18</code> → <code>GCD(12, 18) = 6</code>, <code>LCM(12, 18) = 36</code><br>
<code>48 180</code> → <code>GCD(48, 180) = 12</code>, <code>LCM(48, 180) = 720</code><br>
<code>7 13</code> → <code>GCD(7, 13) = 1</code>, <code>LCM(7, 13) = 91</code> (nguyên tố cùng nhau nên BCNN là tích)<br>
Bảng vết ở trên cũng đã được in ra từ một bản dựng có gắn lệnh in và khớp từng bước; vết của <code>gcd(12, 18)</code> là <code>(12,18) → (18,12) → (12,6) → (6,0)</code> → <strong>6</strong>. Chú ý bước 1 khi <code>a &lt; b</code>: <code>48 % 180 = 48</code>, nên vòng đầu tiên chỉ đơn giản là đảo chỗ hai số. Thuật toán KHÔNG cần bước "đưa số lớn lên trước".</p>
<p class="pitfall">⚠️ <code>a % 0</code> là hành vi không xác định và thường làm sập chương trình. Vòng lặp Euclid an toàn vì nó kiểm <code>b != 0</code> trước khi chia, nhưng <code>lcm(a, 0)</code> sẽ chia cho <code>gcd(a, 0) = a</code> rồi nhân với 0 — ra đáp số sai, âm thầm. Đề bài nói "hai số nguyên <em>dương</em>"; chương trình chắc chắn phải kiểm bằng vòng nhập <code>do … while (m &lt;= 0 || n &lt;= 0);</code>, đúng như Exercise 5 làm ở slide 67.</p>`],

      [60, '10 - Extent and Scope of a variable (section divider)',
        `<p class="y-chinh">🎯 A section marker for the pair of ideas students most often merge into one: <strong>extent</strong> = <em>how long</em> a variable exists, <strong>scope</strong> = <em>where in the source</em> its name can be used. They are independent.</p>
<ul>
<li><strong>Two axes, not one</strong> — extent is a question about <em>time</em> (slide 62 literally calls it "Time-View"). Scope is a question about <em>text</em> (slide 63 calls it "Code-View"). A variable has one answer on each axis, and the two answers do not have to match.</li>
<li><strong>Proof that they are independent</strong> — a <code>static</code> local has the extent of a global (it lives for the whole program) but the scope of a local (only its own function can name it). That single example is the reason the deck insists on two words.</li>
<li><strong>Why it belongs right here</strong> — the previous section showed frames being created and destroyed. Extent <em>is</em> that creation and destruction, given a name. Scope is the compile-time rule that stops you naming something that is not there.</li>
<li><strong>What goes wrong when you confuse them</strong> — returning the address of a local (its scope has ended <em>and</em> its extent has ended → dangling pointer), or expecting a local counter to remember its value between calls (its scope is fine; its extent is not).</li>
<li><strong>The five slides ahead</strong> — 61 gives the definitions and the global/local split, 62 draws extent on a timeline, 63 draws scope over source code, 64 handles the collision case (two variables, same name), and then the deck moves to walkthroughs.</li>
</ul>
<p class="meo">💡 A two-question test that settles almost every exam item in this section: <em>"When was this memory created and when is it destroyed?"</em> (extent) and <em>"From which line to which line may I write this name?"</em> (scope). Answer them separately and never in the same sentence.</p>`,
        `<p class="y-chinh">🎯 Slide phân mục cho cặp khái niệm mà sinh viên hay gộp làm một: <strong>extent</strong> (thời gian sống) = biến tồn tại <em>bao lâu</em>, <strong>scope</strong> (tầm nhìn/phạm vi) = tên của nó dùng được <em>ở đoạn mã nào</em>. Hai thứ độc lập với nhau.</p>
<ul>
<li><strong>Hai trục, không phải một</strong> — extent là câu hỏi về <em>thời gian</em> (slide 62 gọi thẳng là "Time-View"). Scope là câu hỏi về <em>văn bản mã nguồn</em> (slide 63 gọi là "Code-View"). Mỗi biến có một đáp án trên mỗi trục, và hai đáp án đó không bắt buộc phải khớp nhau.</li>
<li><strong>Bằng chứng chúng độc lập</strong> — một biến cục bộ <code>static</code> có extent như biến toàn cục (sống suốt chương trình) nhưng scope như biến cục bộ (chỉ hàm của nó gọi tên được). Riêng ví dụ đó là lý do bộ slide nhất định dùng hai từ khác nhau.</li>
<li><strong>Vì sao nó nằm đúng chỗ này</strong> — mục trước cho thấy khung được tạo rồi bị huỷ. Extent CHÍNH LÀ sự tạo và huỷ đó, được đặt tên. Scope là luật lúc biên dịch, chặn bạn gọi tên một thứ không có ở đó.</li>
<li><strong>Nhầm hai cái thì hỏng chuyện gì</strong> — trả về địa chỉ của biến cục bộ (scope đã hết <em>và</em> extent cũng đã hết → con trỏ treo), hoặc trông chờ một biến đếm cục bộ nhớ được giá trị giữa các lời gọi (scope thì ổn; extent thì không).</li>
<li><strong>Năm slide phía trước</strong> — 61 cho định nghĩa và phân chia toàn cục/cục bộ, 62 vẽ extent trên trục thời gian, 63 vẽ scope trên mã nguồn, 64 xử lý ca va chạm (hai biến trùng tên), rồi bộ slide chuyển sang phần chạy tay.</li>
</ul>
<p class="meo">💡 Hai câu hỏi giải quyết gần như mọi câu thi trong mục này: <em>"Ô nhớ này được tạo lúc nào và bị huỷ lúc nào?"</em> (extent) và <em>"Từ dòng nào tới dòng nào tôi được phép viết cái tên này?"</em> (scope). Hãy trả lời riêng từng câu và đừng bao giờ trộn chúng vào một câu.</p>`],

      [61, 'Extent and Scope of a variable — the definitions',
        `<p class="y-chinh">🎯 Four definitions, in the slide's own words: extent, scope, global variables, local variables — plus a warning about globals.</p>
<ul>
<li><strong>Extent</strong> — "Duration begins at the time the memory of this variable is allocated to the time this block is de-allocated." A <em>duration</em>, measured in program time. For a local, it starts when its frame is pushed and ends when the frame is popped (slide 51).</li>
<li><strong>Scope</strong> — "The code block between the line which this variable is declared and the close brace of this block. In its scope, the variable is visible (means that accessing to this variable is valid)." Two boundaries: the <em>declaration line</em> on one side, the <em>closing brace</em> on the other. Not the opening brace — the declaration line. Using the name one line above where it is declared is a compile error.</li>
<li><strong>Global variables</strong> — "Variables declared outside of all functions → They are stored in the data segment." That is the Data segment of slide 50. Extent: the entire program. Scope: from the declaration line to the end of the file.</li>
<li><strong>Local variables</strong> — "Variables declared inside a function → They are stored in the stack segment." Extent: one call. Scope: that block.</li>
<li><strong>The warning, and it is the point of the slide</strong> — "If possible, do not use global variables because they can cause high coupling in functions." This is slides 19–20 arriving with teeth: a function that reads a global is welded to that global, cannot be reused, and cannot be tested in isolation.</li>
<li><strong>The difference nobody mentions until it bites</strong> — globals are initialised to <strong>0</strong> automatically; locals are <strong>not initialised at all</strong> and start holding whatever bytes the previous frame left behind.</li>
</ul>
<table>
<tr><th></th><th>Global</th><th>Local (automatic)</th><th>Local <code>static</code></th></tr>
<tr><td>Declared</td><td>outside every function</td><td>inside a function/block</td><td>inside, with <code>static</code></td></tr>
<tr><td>Segment</td><td>Data</td><td>Stack</td><td>Data</td></tr>
<tr><td><strong>Extent</strong></td><td>whole program</td><td>one call</td><td><strong>whole program</strong></td></tr>
<tr><td><strong>Scope</strong></td><td>declaration → end of file</td><td>declaration → closing brace</td><td><strong>declaration → closing brace</strong></td></tr>
<tr><td>Auto-initialised?</td><td>yes, to 0</td><td><strong>no — holds garbage</strong></td><td>yes, to 0 (once)</td></tr>
</table>
<p class="dap-an">✅ Both surprising rows verified by compiling and running. (1) A global <code>int g;</code> that is never assigned printed <strong>0</strong>. Four locals that were never assigned, in a function called after another function had dirtied the same stack space, printed <code>866953031 281346071 57008 57007</code> on the first run and <code>1797790108 -1709244187 57008 57007</code> on the second — different values, same program, no code change. (2) A function with <code>int c = 0; c++; return c;</code> returned <strong>1, 1, 1</strong> over three calls; the same function with <code>static int c = 0;</code> returned <strong>1, 2, 3</strong>. Same scope, different extent.</p>
<p class="pitfall">⚠️ <code>-Wall</code> catches the uninitialised read (<em>"variable 'a' is uninitialized when used here"</em>) — but only in the easy cases it can prove. Never rely on the warning; initialise every local at its declaration. And never assume a local starts at 0 just because it did once while you were testing: the garbage is whatever the <em>previous</em> function left, so the bug appears only after you change unrelated code.</p>`,
        `<p class="y-chinh">🎯 Bốn định nghĩa, bằng chính chữ của slide: extent, scope, biến toàn cục, biến cục bộ — kèm một lời cảnh báo về biến toàn cục.</p>
<ul>
<li><strong>Extent (thời gian sống)</strong> — "Duration begins at the time the memory of this variable is allocated to the time this block is de-allocated": khoảng thời gian từ lúc cấp ô nhớ cho biến tới lúc khối đó bị thu hồi. Là một <em>khoảng thời gian</em>, đo bằng thời gian chương trình chạy. Với biến cục bộ, nó bắt đầu khi khung được đẩy lên và kết thúc khi khung bị gỡ (slide 51).</li>
<li><strong>Scope (tầm nhìn)</strong> — "The code block between the line which this variable is declared and the close brace of this block. In it's scope, the variable is visible": đoạn mã từ DÒNG KHAI BÁO biến tới dấu ngoặc nhọn đóng của khối. Hai mốc: một bên là <em>dòng khai báo</em>, bên kia là <em>ngoặc đóng</em>. KHÔNG phải ngoặc mở — là dòng khai báo. Dùng cái tên đó ở dòng ngay phía trên chỗ khai báo là lỗi biên dịch.</li>
<li><strong>Biến toàn cục</strong> — "Variables declared outside of all functions → They are stored in the data segment." Chính là Data segment của slide 50. Extent: cả chương trình. Scope: từ dòng khai báo tới hết tệp.</li>
<li><strong>Biến cục bộ</strong> — "Variables declared inside a function → They are stored in the stack segment." Extent: một lời gọi. Scope: khối đó.</li>
<li><strong>Lời cảnh báo, và đó mới là trọng tâm slide</strong> — "If possible, do not use global variables because they can cause high coupling in functions." Đây là slide 19–20 quay lại có răng: một hàm đọc biến toàn cục là bị hàn vào biến đó, không dùng lại được, không thử riêng được.</li>
<li><strong>Khác biệt không ai nhắc cho tới lúc bị cắn</strong> — biến toàn cục được khởi tạo <strong>0</strong> tự động; biến cục bộ <strong>không được khởi tạo gì cả</strong> và mang sẵn đúng những byte mà khung trước để lại.</li>
</ul>
<table>
<tr><th></th><th>Toàn cục</th><th>Cục bộ (tự động)</th><th>Cục bộ <code>static</code></th></tr>
<tr><td>Khai báo ở</td><td>ngoài mọi hàm</td><td>trong một hàm/khối</td><td>trong hàm, có <code>static</code></td></tr>
<tr><td>Phân đoạn</td><td>Data</td><td>Stack</td><td>Data</td></tr>
<tr><td><strong>Extent</strong></td><td>cả chương trình</td><td>một lời gọi</td><td><strong>cả chương trình</strong></td></tr>
<tr><td><strong>Scope</strong></td><td>dòng khai báo → hết tệp</td><td>dòng khai báo → ngoặc đóng</td><td><strong>dòng khai báo → ngoặc đóng</strong></td></tr>
<tr><td>Tự khởi tạo?</td><td>có, bằng 0</td><td><strong>KHÔNG — chứa rác</strong></td><td>có, bằng 0 (một lần)</td></tr>
</table>
<p class="dap-an">✅ Cả hai dòng gây bất ngờ đều đã kiểm bằng biên dịch và chạy thật. (1) Một biến toàn cục <code>int g;</code> chưa hề gán in ra <strong>0</strong>. Bốn biến cục bộ chưa hề gán, trong một hàm được gọi sau khi một hàm khác đã làm bẩn đúng vùng ngăn xếp đó, in ra <code>866953031 281346071 57008 57007</code> ở lần chạy thứ nhất và <code>1797790108 -1709244187 57008 57007</code> ở lần thứ hai — giá trị khác nhau, cùng một chương trình, không sửa một dòng code. (2) Một hàm có <code>int c = 0; c++; return c;</code> trả về <strong>1, 1, 1</strong> qua ba lời gọi; cũng hàm đó với <code>static int c = 0;</code> trả về <strong>1, 2, 3</strong>. Cùng scope, khác extent.</p>
<p class="pitfall">⚠️ <code>-Wall</code> có bắt được lỗi đọc biến chưa khởi tạo (<em>"variable 'a' is uninitialized when used here"</em>) — nhưng chỉ ở những ca dễ mà nó chứng minh được. Đừng bao giờ dựa vào cảnh báo; hãy khởi tạo mọi biến cục bộ ngay tại dòng khai báo. Và đừng bao giờ tưởng biến cục bộ bắt đầu từ 0 chỉ vì có một lần thử nó như thế: rác là thứ hàm <em>trước đó</em> để lại, nên lỗi chỉ lộ ra sau khi bạn sửa một đoạn code chẳng liên quan.</p>`],

      [62, 'Extent of Variables: Time-View',
        `<p class="y-chinh">🎯 A timeline. The horizontal axis runs from "Program Starts" to "Program Terminates", and three bars — <code>r</code>, <code>rx</code>, <code>ry</code> — show how long each variable exists.</p>
<ul>
<li><strong>How to read the drawing</strong> — the length of a bar <em>is</em> the variable's extent. A bar spanning the whole axis is a global (or a <code>static</code>). A short bar starting and stopping inside the axis is a local: it appears when its function is entered and disappears when that function returns.</li>
<li><strong>Why three bars and not one</strong> — because the same source file produces variables with completely different lifetimes, and the picture is the only way to see it at a glance. Names tell you nothing; the declaration's <em>position</em> does.</li>
<li><strong>Two locals in two different functions</strong> — if <code>rx</code> and <code>ry</code> belong to two functions called one after the other, their bars do not overlap at all, and their memory may well be the <em>same bytes</em> reused. That is precisely what was measured on slide 51, where <code>gcd</code> and <code>lcm</code> both got address 0x…38c.</li>
<li><strong>Two locals nested</strong> — if the second function is called <em>from inside</em> the first, the inner bar sits entirely inside the outer bar, and the two frames coexist at different addresses (0x…34c inside 0x…38c, measured on slide 51).</li>
<li><strong>Extent is not about usefulness</strong> — a local variable exists even while its function is blocked waiting inside a call to another function. It is unreachable by name from there (that is scope), but it is still allocated.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int r = 100;                       /* bar spans the whole program */

int counterAuto(void)   { int c = 0; c++; return c; }         /* new c each call    */
int counterStatic(void) { static int c = 0; c++; return c; }  /* one c, lives on     */

int main(void) {
    int i;
    for (i = 0; i &lt; 3; i++)
        printf("auto=%d  static=%d\\n", counterAuto(), counterStatic());
    return 0;
}</code></pre>
<table>
<tr><th>Moment</th><th><code>r</code> (global)</th><th><code>c</code> in <code>counterAuto</code></th><th><code>c</code> in <code>counterStatic</code></th></tr>
<tr><td>program starts</td><td>alive, = 100</td><td>does not exist</td><td>alive, = 0</td></tr>
<tr><td>1st call</td><td>alive</td><td>born, 0 → 1, <strong>dies</strong></td><td>alive, 0 → 1</td></tr>
<tr><td>2nd call</td><td>alive</td><td><strong>born again</strong>, 0 → 1, dies</td><td>alive, 1 → 2</td></tr>
<tr><td>3rd call</td><td>alive</td><td>born again, 0 → 1, dies</td><td>alive, 2 → 3</td></tr>
<tr><td>program ends</td><td>dies</td><td>—</td><td>dies</td></tr>
</table>
<p class="dap-an">✅ Compiled and run, the program prints exactly:<br>
<code>auto=1  static=1</code><br>
<code>auto=1  static=2</code><br>
<code>auto=1  static=3</code><br>
The <code>auto</code> column never moves because that <code>c</code> is a <em>different variable each time</em> — short bar, three times. The <code>static</code> column climbs because there is only ever one <code>c</code>, with a bar as long as the program. Note that <code>static int c = 0;</code> runs its initialisation <strong>once</strong>, not on every call; otherwise the column would read 1, 1, 1 as well.</p>
<p class="meo">💡 <code>static</code> changes the extent and leaves the scope alone — the perfect counter-example to keep in your head when an exam asks whether the two words mean the same thing. It is also how you write a "remember how many times I was called" function without a global, which keeps coupling low (slide 19).</p>`,
        `<p class="y-chinh">🎯 Một trục thời gian. Trục ngang chạy từ "Program Starts" tới "Program Terminates", và ba thanh — <code>r</code>, <code>rx</code>, <code>ry</code> — cho thấy mỗi biến tồn tại bao lâu.</p>
<ul>
<li><strong>Đọc hình thế nào</strong> — độ dài của một thanh CHÍNH LÀ extent của biến đó. Thanh trải hết trục là biến toàn cục (hoặc <code>static</code>). Thanh ngắn bắt đầu và kết thúc bên trong trục là biến cục bộ: nó xuất hiện khi vào hàm và biến mất khi hàm trả về.</li>
<li><strong>Vì sao ba thanh mà không phải một</strong> — vì cùng một tệp mã nguồn sinh ra những biến có tuổi thọ hoàn toàn khác nhau, và bức hình là cách duy nhất thấy được điều đó trong một cái liếc. Tên biến chẳng nói gì; <em>vị trí</em> của dòng khai báo mới nói.</li>
<li><strong>Hai biến cục bộ ở hai hàm khác nhau</strong> — nếu <code>rx</code> và <code>ry</code> thuộc hai hàm được gọi lần lượt, hai thanh của chúng không hề chồng lên nhau, và ô nhớ của chúng rất có thể là <em>cùng những byte</em> được dùng lại. Đó đúng là thứ đã đo được ở slide 51, chỗ <code>gcd</code> và <code>lcm</code> cùng nhận địa chỉ 0x…38c.</li>
<li><strong>Hai biến cục bộ lồng nhau</strong> — nếu hàm thứ hai được gọi <em>từ bên trong</em> hàm thứ nhất, thanh trong nằm trọn trong thanh ngoài, và hai khung cùng tồn tại ở hai địa chỉ khác nhau (0x…34c nằm trong 0x…38c, đã đo ở slide 51).</li>
<li><strong>Extent không nói về chuyện có dùng được hay không</strong> — một biến cục bộ vẫn tồn tại ngay cả khi hàm của nó đang đứng chờ bên trong một lời gọi hàm khác. Từ chỗ đó không gọi tên nó được (đấy là scope), nhưng ô nhớ vẫn đang được giữ.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int r = 100;                       /* thanh trải hết chương trình */

int counterAuto(void)   { int c = 0; c++; return c; }         /* c mới mỗi lần gọi */
int counterStatic(void) { static int c = 0; c++; return c; }  /* một c, sống tiếp   */

int main(void) {
    int i;
    for (i = 0; i &lt; 3; i++)
        printf("auto=%d  static=%d\\n", counterAuto(), counterStatic());
    return 0;
}</code></pre>
<table>
<tr><th>Thời điểm</th><th><code>r</code> (toàn cục)</th><th><code>c</code> trong <code>counterAuto</code></th><th><code>c</code> trong <code>counterStatic</code></th></tr>
<tr><td>chương trình khởi động</td><td>sống, = 100</td><td>chưa tồn tại</td><td>sống, = 0</td></tr>
<tr><td>lời gọi 1</td><td>sống</td><td>sinh ra, 0 → 1, <strong>chết</strong></td><td>sống, 0 → 1</td></tr>
<tr><td>lời gọi 2</td><td>sống</td><td><strong>sinh ra lại</strong>, 0 → 1, chết</td><td>sống, 1 → 2</td></tr>
<tr><td>lời gọi 3</td><td>sống</td><td>sinh ra lại, 0 → 1, chết</td><td>sống, 2 → 3</td></tr>
<tr><td>chương trình kết thúc</td><td>chết</td><td>—</td><td>chết</td></tr>
</table>
<p class="dap-an">✅ Biên dịch và chạy thật, chương trình in đúng:<br>
<code>auto=1  static=1</code><br>
<code>auto=1  static=2</code><br>
<code>auto=1  static=3</code><br>
Cột <code>auto</code> đứng im vì <code>c</code> đó là một <em>biến khác nhau ở mỗi lần</em> — thanh ngắn, lặp ba lần. Cột <code>static</code> leo lên vì từ đầu tới cuối chỉ có duy nhất một <code>c</code>, với thanh dài bằng cả chương trình. Chú ý <code>static int c = 0;</code> chạy phần khởi tạo <strong>một lần duy nhất</strong>, không phải mỗi lời gọi; nếu không thì cột đó cũng sẽ là 1, 1, 1.</p>
<p class="meo">💡 <code>static</code> đổi extent và để nguyên scope — phản ví dụ hoàn hảo cần giữ trong đầu khi đề thi hỏi hai từ đó có cùng nghĩa không. Nó cũng là cách viết một hàm "nhớ tôi đã được gọi mấy lần" mà không cần biến toàn cục, nhờ đó giữ coupling thấp (slide 19).</p>`],

      [63, 'Scope of Variables: Code-View',
        `<p class="y-chinh">🎯 The same program seen as <em>text</em> instead of time. The slide lists, for a GCD/LCM program, exactly which variables each function owns — and note that it counts the return value as one of them.</p>
<ul>
<li><strong>The slide's three lists, verbatim</strong> — "Local variables of the function <code>gcd</code> include: memory containing return value (int), <code>a</code>, <code>b</code>" · "Local variables of the function <code>lcm</code> include: memory containing return value (int), <code>a</code>, <code>b</code>" · "Local variables of the function <code>main</code> include: memory containing return value (int), <code>m</code>, <code>n</code>, <code>G</code>, <code>L</code>". This is Exercise 4 from slide 59, reused as the example.</li>
<li><strong>Parameters are locals</strong> — <code>a</code> and <code>b</code> are in the list. A parameter is a local variable that happens to be initialised for you from the argument. Everything true of locals (stack, one call, invisible outside) is true of parameters.</li>
<li><strong>The return value gets storage too</strong> — that is the detail worth marks. <code>return a;</code> does not hand over the variable <code>a</code>; it copies <code>a</code>'s value into a place the caller can read <em>before</em> the frame is destroyed. One more copy, on top of the copies made on the way in.</li>
<li><strong><code>gcd</code>'s <code>a</code> and <code>lcm</code>'s <code>a</code> are unrelated</strong> — same spelling, three frames, three separate integers. This is slide 52's "although they have the same names, they are still different", now seen from the scope side.</li>
<li><strong>Neither function can see <code>main</code>'s <code>m</code>, <code>n</code>, <code>G</code>, <code>L</code></strong> — writing <code>m</code> inside <code>gcd</code> is a compile error (<em>"use of undeclared identifier"</em>), not a runtime bug. That is scope doing its job: the compiler refuses before the program ever runs.</li>
<li><strong>Blocks nest, and so does scope</strong> — <code>int r</code> declared inside the <code>while</code> body of <code>gcd</code> has a scope narrower than the function: it ends at the <code>while</code>'s closing brace. That is legal in C99 and it is good style: declare a variable in the smallest block that needs it.</li>
</ul>
<table>
<tr><th>Name</th><th>Declared in</th><th>Scope (where the name is legal)</th><th>Extent</th></tr>
<tr><td><code>m</code>, <code>n</code>, <code>G</code>, <code>L</code></td><td><code>main</code></td><td>body of <code>main</code> only</td><td>whole program (main never returns early)</td></tr>
<tr><td><code>a</code>, <code>b</code></td><td>parameters of <code>gcd</code></td><td>body of <code>gcd</code> only</td><td>one call to <code>gcd</code></td></tr>
<tr><td><code>r</code></td><td>inside <code>gcd</code>'s <code>while</code></td><td><strong>that <code>while</code> body only</strong></td><td>one iteration</td></tr>
<tr><td><code>a</code>, <code>b</code></td><td>parameters of <code>lcm</code></td><td>body of <code>lcm</code> only</td><td>one call to <code>lcm</code></td></tr>
<tr><td>return-value slot</td><td>every function</td><td>no name at all</td><td>just long enough to reach the caller</td></tr>
</table>
<p class="dap-an">✅ That the three <code>a</code>s are three different variables was measured, not assumed. Instrumenting the Exercise 4 program to print <code>&amp;a</code> in each frame gave: <code>main</code> <code>&amp;m = 0x16b3fa3c8</code> · <code>gcd</code> called from <code>main</code> <code>&amp;a = 0x16b3fa38c</code> · <code>lcm</code> called from <code>main</code> <code>&amp;a = 0x16b3fa38c</code> · <code>gcd</code> called from inside <code>lcm</code> <code>&amp;a = 0x16b3fa34c</code>. Three distinct addresses were in play, and the answers were still correct: <code>G = 6</code>, <code>L = 36</code> for <code>m = 12</code>, <code>n = 18</code>.</p>
<p class="pitfall">⚠️ A scope error and an extent error look completely different, and telling them apart saves hours. <em>Scope</em> errors are caught by the compiler: "undeclared identifier", "use of undeclared identifier 'm'". <em>Extent</em> errors compile cleanly and misbehave at run time: a dangling pointer, a counter that resets, garbage in an uninitialised local. If it compiled, it was never a scope problem.</p>`,
        `<p class="y-chinh">🎯 Vẫn chương trình đó, nhưng nhìn theo <em>văn bản mã</em> thay vì theo thời gian. Slide liệt kê, cho chương trình ƯCLN/BCNN, chính xác từng hàm sở hữu những biến nào — và chú ý nó tính cả ô chứa giá trị trả về là một biến cục bộ.</p>
<ul>
<li><strong>Ba danh sách của slide, nguyên văn</strong> — "Local variables of the function <code>gcd</code> include: memory containing return value (int), <code>a</code>, <code>b</code>" · "Local variables of the function <code>lcm</code> include: memory containing return value (int), <code>a</code>, <code>b</code>" · "Local variables of the function <code>main</code> include: memory containing return value (int), <code>m</code>, <code>n</code>, <code>G</code>, <code>L</code>". Đây chính là Exercise 4 ở slide 59, được dùng lại làm ví dụ.</li>
<li><strong>Tham số cũng là biến cục bộ</strong> — <code>a</code> và <code>b</code> nằm trong danh sách. Tham số là biến cục bộ, chỉ khác ở chỗ nó được khởi tạo sẵn từ đối số. Mọi điều đúng với biến cục bộ (nằm stack, sống một lời gọi, bên ngoài không thấy) đều đúng với tham số.</li>
<li><strong>Giá trị trả về cũng chiếm ô nhớ</strong> — đây là chi tiết đáng điểm. <code>return a;</code> KHÔNG trao đi biến <code>a</code>; nó chép giá trị của <code>a</code> sang một chỗ mà người gọi đọc được <em>trước khi</em> khung bị huỷ. Thêm một lần chép nữa, ngoài các lần chép lúc đi vào.</li>
<li><strong><code>a</code> của <code>gcd</code> và <code>a</code> của <code>lcm</code> không liên quan gì nhau</strong> — cùng cách viết, ba khung, ba số nguyên riêng biệt. Đây chính là câu "although they have the same names, they are still different" của slide 52, nay nhìn từ phía scope.</li>
<li><strong>Không hàm nào thấy được <code>m</code>, <code>n</code>, <code>G</code>, <code>L</code> của <code>main</code></strong> — viết <code>m</code> bên trong <code>gcd</code> là lỗi BIÊN DỊCH (<em>"use of undeclared identifier"</em>), không phải lỗi lúc chạy. Đó là scope làm đúng việc của nó: trình biên dịch từ chối trước khi chương trình kịp chạy.</li>
<li><strong>Khối lồng nhau thì scope cũng lồng nhau</strong> — <code>int r</code> khai báo bên trong thân <code>while</code> của <code>gcd</code> có scope hẹp hơn cả hàm: nó hết ở ngoặc đóng của <code>while</code>. C99 cho phép, và đó là phong cách tốt: khai báo biến trong khối nhỏ nhất cần tới nó.</li>
</ul>
<table>
<tr><th>Tên</th><th>Khai báo ở</th><th>Scope (nơi gọi tên hợp lệ)</th><th>Extent</th></tr>
<tr><td><code>m</code>, <code>n</code>, <code>G</code>, <code>L</code></td><td><code>main</code></td><td>chỉ thân <code>main</code></td><td>cả chương trình (main không trả về sớm)</td></tr>
<tr><td><code>a</code>, <code>b</code></td><td>tham số của <code>gcd</code></td><td>chỉ thân <code>gcd</code></td><td>một lời gọi <code>gcd</code></td></tr>
<tr><td><code>r</code></td><td>trong <code>while</code> của <code>gcd</code></td><td><strong>chỉ thân <code>while</code> đó</strong></td><td>một vòng lặp</td></tr>
<tr><td><code>a</code>, <code>b</code></td><td>tham số của <code>lcm</code></td><td>chỉ thân <code>lcm</code></td><td>một lời gọi <code>lcm</code></td></tr>
<tr><td>ô giá trị trả về</td><td>mọi hàm</td><td>không có tên nào cả</td><td>vừa đủ lâu để về tới người gọi</td></tr>
</table>
<p class="dap-an">✅ Chuyện ba cái <code>a</code> là ba biến khác nhau đã được ĐO, không phải suy đoán. Gắn lệnh in <code>&amp;a</code> vào từng khung của chương trình Exercise 4 cho ra: <code>main</code> <code>&amp;m = 0x16b3fa3c8</code> · <code>gcd</code> gọi từ <code>main</code> <code>&amp;a = 0x16b3fa38c</code> · <code>lcm</code> gọi từ <code>main</code> <code>&amp;a = 0x16b3fa38c</code> · <code>gcd</code> gọi từ trong <code>lcm</code> <code>&amp;a = 0x16b3fa34c</code>. Có ba địa chỉ khác nhau cùng tham gia, và đáp số vẫn đúng: <code>G = 6</code>, <code>L = 36</code> với <code>m = 12</code>, <code>n = 18</code>.</p>
<p class="pitfall">⚠️ Lỗi scope và lỗi extent trông hoàn toàn khác nhau, và phân biệt được chúng tiết kiệm hàng giờ. Lỗi <em>scope</em> bị trình biên dịch bắt: "undeclared identifier", "use of undeclared identifier 'm'". Lỗi <em>extent</em> thì dịch sạch sẽ rồi chạy sai: con trỏ treo, biến đếm tự reset, rác trong biến cục bộ chưa khởi tạo. Nếu nó đã dịch được thì đó chưa bao giờ là vấn đề scope.</p>`],

      [64, 'Extent and Scope of a variable: Visibility — "Local first, Global later"',
        `<p class="y-chinh">🎯 The collision case. The slide's note: "Two variables have the same name (<code>input</code>) but they are different because the inner variable has the narrower scope than the outer variable → <strong>RULE: Local first, Global later</strong>."</p>
<ul>
<li><strong>What the rule decides</strong> — when a name could refer to more than one variable, C picks the one declared in the <em>innermost</em> enclosing block. The outer one is not deleted or changed; it is simply <strong>shadowed</strong> — unreachable by that name, for the length of the inner block.</li>
<li><strong>It is a compile-time decision</strong> — the compiler resolves the name once, while translating. Nothing is decided at run time, and there is no cost.</li>
<li><strong>Nesting goes deeper than function-vs-global</strong> — a variable declared inside a <code>for</code> body shadows one declared in the function, which shadows one declared globally. The search always runs inner → outer, and stops at the first match.</li>
<li><strong>Why this is a warning slide, not a feature slide</strong> — shadowing is legal, and it is one of the most reliable sources of "the value didn't change and I don't know why". You assign to what you think is the global; you are actually assigning to a local that is about to be destroyed.</li>
<li><strong>How to not be bitten</strong> — the real fix is slide 61's advice: stop using globals. With no globals there is nothing to shadow. When you must keep one, give it a name locals would never use (a <code>g_</code> prefix, for example), and turn on <code>-Wshadow</code>, which <code>-Wall</code> does <em>not</em> include.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int input = 100;                    /* global */

void show(void) {
    int input = 7;                  /* shadows the global inside show() */
    printf("  inside show: input = %d   (local wins)\\n", input);
}

int main(void) {
    printf("global input = %d\\n", input);
    show();
    printf("after show, global input = %d\\n", input);
    return 0;
}</code></pre>
<table>
<tr><th>Line being compiled</th><th>Candidates for the name <code>input</code></th><th>Chosen</th><th>Value at run time</th></tr>
<tr><td>inside <code>main</code></td><td>global only</td><td>global</td><td>100</td></tr>
<tr><td>inside <code>show</code>, after its declaration</td><td>local <code>input</code>, global <code>input</code></td><td><strong>local</strong> (inner scope)</td><td>7</td></tr>
<tr><td>back in <code>main</code> after <code>show()</code></td><td>global only (local is gone)</td><td>global</td><td><strong>100 — untouched</strong></td></tr>
</table>
<p class="dap-an">✅ Compiled and run, the program prints:<br>
<code>global input = 100</code><br>
<code>&nbsp;&nbsp;inside show: input = 7   (local wins)</code><br>
<code>after show, global input = 100</code><br>
The global survives unchanged, proving the two <code>input</code>s are separate storage. Had <code>show</code> omitted its own declaration, all three lines would print 100 and the middle one would have <em>modified</em> the global — the same source line, a completely different program, with one declaration as the only difference.</p>
<p class="pitfall">⚠️ The declaration line is the boundary, so a block can use the <em>outer</em> variable above the declaration and the <em>inner</em> one below it — in the same block. <code>int x = 5; { printf("%d", x); int x = 9; printf("%d", x); }</code> prints <code>5</code> then <code>9</code>. Worse, <code>int x = x + 1;</code> inside a block is legal C and reads the <em>new, uninitialised</em> <code>x</code>, not the outer one: instant garbage, and <code>-Wall</code> does warn here. Never reuse a visible name in an inner block.</p>`,
        `<p class="y-chinh">🎯 Ca va chạm tên. Ghi chú trên slide: "Two variables have the same name (<code>input</code>) but they are different because the inner variable has the narrower scope than the outer variable → <strong>RULE: Local first, Global later</strong>" — biến cục bộ được ưu tiên, biến toàn cục xét sau.</p>
<ul>
<li><strong>Luật đó quyết định điều gì</strong> — khi một cái tên có thể trỏ tới nhiều biến, C chọn biến khai báo ở khối <em>trong cùng</em> bao quanh chỗ đó. Biến ngoài không bị xoá cũng không bị đổi; nó chỉ bị <strong>che (shadow)</strong> — không gọi được bằng tên đó, trong suốt khối bên trong.</li>
<li><strong>Đây là quyết định lúc BIÊN DỊCH</strong> — trình biên dịch phân giải cái tên một lần, ngay lúc dịch. Không có gì được quyết lúc chạy, và không tốn chi phí gì.</li>
<li><strong>Lồng nhau sâu hơn chuyện cục bộ–toàn cục</strong> — biến khai báo trong thân <code>for</code> che biến khai báo trong hàm, biến trong hàm che biến toàn cục. Cuộc tìm kiếm luôn chạy từ trong ra ngoài và dừng ở kết quả khớp đầu tiên.</li>
<li><strong>Vì sao đây là slide cảnh báo, không phải slide giới thiệu tính năng</strong> — che tên là hợp lệ, và nó là một trong những nguồn đáng tin cậy nhất của câu than "giá trị không đổi mà tôi không hiểu vì sao". Bạn tưởng mình gán cho biến toàn cục; thực ra bạn gán cho một biến cục bộ sắp bị huỷ.</li>
<li><strong>Cách để không bị cắn</strong> — cách sửa thật sự là lời khuyên ở slide 61: đừng dùng biến toàn cục nữa. Không có biến toàn cục thì không có gì để che. Khi buộc phải giữ một cái, hãy đặt cho nó cái tên mà biến cục bộ không bao giờ dùng (ví dụ tiền tố <code>g_</code>), và bật <code>-Wshadow</code> — cờ mà <code>-Wall</code> KHÔNG bao gồm.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int input = 100;                    /* toàn cục */

void show(void) {
    int input = 7;                  /* che biến toàn cục bên trong show() */
    printf("  inside show: input = %d   (local wins)\\n", input);
}

int main(void) {
    printf("global input = %d\\n", input);
    show();
    printf("after show, global input = %d\\n", input);
    return 0;
}</code></pre>
<table>
<tr><th>Dòng đang được dịch</th><th>Ứng viên cho tên <code>input</code></th><th>Chọn</th><th>Giá trị lúc chạy</th></tr>
<tr><td>trong <code>main</code></td><td>chỉ có biến toàn cục</td><td>toàn cục</td><td>100</td></tr>
<tr><td>trong <code>show</code>, sau dòng khai báo</td><td><code>input</code> cục bộ, <code>input</code> toàn cục</td><td><strong>cục bộ</strong> (scope hẹp hơn)</td><td>7</td></tr>
<tr><td>về lại <code>main</code> sau <code>show()</code></td><td>chỉ toàn cục (biến cục bộ đã mất)</td><td>toàn cục</td><td><strong>100 — nguyên vẹn</strong></td></tr>
</table>
<p class="dap-an">✅ Biên dịch và chạy thật, chương trình in ra:<br>
<code>global input = 100</code><br>
<code>&nbsp;&nbsp;inside show: input = 7   (local wins)</code><br>
<code>after show, global input = 100</code><br>
Biến toàn cục sống sót nguyên vẹn, chứng minh hai cái <code>input</code> là hai ô nhớ riêng. Nếu <code>show</code> bỏ dòng khai báo của nó đi thì cả ba dòng đều in 100 và dòng giữa sẽ <em>sửa</em> biến toàn cục — vẫn dòng lệnh đó, nhưng là một chương trình hoàn toàn khác, khác nhau đúng một dòng khai báo.</p>
<p class="pitfall">⚠️ Ranh giới là DÒNG KHAI BÁO, nên trong cùng một khối, phía trên dòng khai báo dùng biến <em>ngoài</em>, phía dưới dùng biến <em>trong</em>. <code>int x = 5; { printf("%d", x); int x = 9; printf("%d", x); }</code> in ra <code>5</code> rồi <code>9</code>. Tệ hơn, <code>int x = x + 1;</code> bên trong một khối là C hợp lệ và nó đọc chính cái <code>x</code> <em>mới, chưa khởi tạo</em>, không phải cái ở ngoài: ra rác ngay, và chỗ này thì <code>-Wall</code> có cảnh báo. Đừng bao giờ dùng lại một cái tên đang nhìn thấy được ở khối trong.</p>`],

      [65, '11 - Walkthroughs with Functions (section divider)',
        `<p class="y-chinh">🎯 A section marker. Slide 2 defined a walkthrough — "Code are executed by ourself… a record of the changes that occur in the values of program variables and a listing of the output". This block extends that technique to programs that call functions.</p>
<ul>
<li><strong>What changes once functions exist</strong> — a single trace table is no longer enough, because the same name can mean two things at once. You now need a table <em>per frame</em>, and you must record when each frame is created and destroyed.</li>
<li><strong>The three-column discipline</strong> — for every step write: which <em>frame</em> is executing, what each of its variables holds, and what (if anything) has been printed. Keep the caller's row visible; it is frozen, not gone.</li>
<li><strong>The mapping step is where marks are lost</strong> — when a call is <code>f(y, x, z)</code> and the header is <code>int f(int a, int b, int c)</code>, the pairing is <strong>by position, never by name</strong>: <code>a</code> takes <code>y</code>'s value, <code>b</code> takes <code>x</code>'s. Slide 66 was built specifically to punish anyone who matches letters instead of positions.</li>
<li><strong>Then arithmetic rules still apply</strong> — inside the function you are back in Slot 02-04: integer division truncates, precedence decides grouping. A walkthrough question is usually two traps stacked, one about frames and one about arithmetic.</li>
<li><strong>Why do it by hand at all</strong> — because the exam has no compiler, and because the ability to predict what code will do before running it is the difference between programming and guessing.</li>
</ul>
<p class="meo">💡 Exam technique: before tracing anything, rewrite the call with the values substituted in — <code>f(y, x, z)</code> with <code>x=5, y=6, z=7</code> becomes <code>f(6, 5, 7)</code> — and only then map them onto <code>a</code>, <code>b</code>, <code>c</code> left to right. Doing the substitution and the mapping in one step is exactly how people get slide 66 wrong.</p>`,
        `<p class="y-chinh">🎯 Slide phân mục. Slide 2 đã định nghĩa walkthrough — "Code are executed by ourself… a record of the changes that occur in the values of program variables and a listing of the output": tự tay chạy code, ghi lại mọi thay đổi giá trị biến và mọi thứ được in ra. Khối này mở rộng kỹ thuật đó cho chương trình có gọi hàm.</p>
<ul>
<li><strong>Có hàm rồi thì khác gì</strong> — một bảng vết duy nhất không còn đủ, vì cùng một cái tên có thể mang hai nghĩa cùng lúc. Nay bạn cần một bảng <em>cho mỗi khung</em>, và phải ghi rõ mỗi khung sinh ra lúc nào, bị huỷ lúc nào.</li>
<li><strong>Kỷ luật ba cột</strong> — mỗi bước ghi: <em>khung</em> nào đang chạy, mỗi biến của nó đang giữ gì, và đã in ra cái gì (nếu có). Giữ nguyên dòng của hàm gọi trên bảng; nó đang đóng băng chứ không biến mất.</li>
<li><strong>Bước ghép tham số là chỗ mất điểm</strong> — khi lời gọi là <code>f(y, x, z)</code> mà header là <code>int f(int a, int b, int c)</code> thì việc ghép cặp diễn ra <strong>theo VỊ TRÍ, không bao giờ theo TÊN</strong>: <code>a</code> nhận giá trị của <code>y</code>, <code>b</code> nhận giá trị của <code>x</code>. Slide 66 được dựng ra đúng để phạt ai ghép theo chữ cái thay vì theo vị trí.</li>
<li><strong>Rồi luật số học vẫn giữ nguyên</strong> — bên trong hàm là bạn quay về Slot 02-04: chia nguyên cắt phần thập phân, thứ tự ưu tiên quyết định cách nhóm. Một câu walkthrough thường là hai cái bẫy chồng lên nhau, một về khung và một về số học.</li>
<li><strong>Vì sao phải làm tay</strong> — vì phòng thi không có trình biên dịch, và vì khả năng đoán trước code sẽ làm gì trước khi chạy chính là ranh giới giữa lập trình và đoán mò.</li>
</ul>
<p class="meo">💡 Mẹo phòng thi: trước khi vẽ bảng, hãy viết lại lời gọi với giá trị đã thay vào — <code>f(y, x, z)</code> với <code>x=5, y=6, z=7</code> thành <code>f(6, 5, 7)</code> — rồi mới ghép vào <code>a</code>, <code>b</code>, <code>c</code> từ trái sang phải. Làm gộp bước thay giá trị và bước ghép tên vào một là cách chính xác để làm sai slide 66.</p>`],

      [66, 'Walkthroughs with Functions — the worked example',
        `<p class="y-chinh">🎯 The deck's own exam question: <em>"Given the following function and a case of using it. What is the value of the variable <code>t</code> when the function terminates?"</em></p>
<ul>
<li><strong>The code, exactly as on the slide</strong> —
<pre><code>int f(int a, int b, int c)
{
    int t = 2 * (a + b - c) / 5;
    return t;
}

int x = 5, y = 6, z = 7;
int t = 3 * f(y, x, z);</code></pre></li>
<li><strong>Trap 1 — the argument order</strong> — the call is <code>f(y, x, z)</code>, not <code>f(x, y, z)</code>. Position decides: <code>a ← y = 6</code>, <code>b ← x = 5</code>, <code>c ← z = 7</code>. The slide draws this explicitly with arrows from <code>y=6</code>, <code>x=5</code>, <code>z=7</code> down into <code>a</code>, <code>b</code>, <code>c</code>.</li>
<li><strong>Trap 2 — two variables called <code>t</code></strong> — there is a <code>t</code> inside <code>f</code> and a <code>t</code> outside it. The question asks about the outer one. They are separate storage (slide 52) and they hold different values.</li>
<li><strong>Trap 3 — integer division</strong> — <code>2 * (a + b - c) / 5</code> has no parentheses around the division, so it groups left to right as <code>(2 * (a + b - c)) / 5</code>. With the values: <code>a + b - c = 6 + 5 - 7 = 4</code> → <code>2 * 4 = 8</code> → <code>8 / 5 = 1</code>, because both operands are <code>int</code>. The 0.6 is discarded.</li>
<li><strong>The final multiplication</strong> — <code>3 * f(...) = 3 * 1 = 3</code>. The slide states this itself: "2*(6+5-7)/5 = 1" and "t = 3*f(…) = 3*1 = 3".</li>
</ul>
<table>
<tr><th>Step</th><th>Caller's frame</th><th><code>f</code>'s frame</th><th>Expression being evaluated</th></tr>
<tr><td>1. before the call</td><td><code>x=5</code>, <code>y=6</code>, <code>z=7</code>, <code>t=?</code></td><td>— not created —</td><td><code>3 * f(y, x, z)</code></td></tr>
<tr><td>2. arguments evaluated</td><td><code>x=5</code>, <code>y=6</code>, <code>z=7</code></td><td>— being built —</td><td><code>f(6, 5, 7)</code></td></tr>
<tr><td>3. frame pushed, copied <em>by position</em></td><td>frozen</td><td><code>a=6</code>, <code>b=5</code>, <code>c=7</code>, <code>t=?</code></td><td></td></tr>
<tr><td>4. <code>a + b - c</code></td><td>frozen</td><td><code>a=6</code>, <code>b=5</code>, <code>c=7</code></td><td><code>6 + 5 - 7 = 4</code></td></tr>
<tr><td>5. <code>2 * 4</code></td><td>frozen</td><td>same</td><td><code>8</code></td></tr>
<tr><td>6. <code>8 / 5</code> — <strong>int division</strong></td><td>frozen</td><td><code>t = 1</code></td><td><code>1</code> (not 1.6)</td></tr>
<tr><td>7. <code>return t;</code>, frame popped</td><td><code>x=5</code>, <code>y=6</code>, <code>z=7</code></td><td>— destroyed, its <code>t</code> gone —</td><td>the value <strong>1</strong> arrives</td></tr>
<tr><td>8. <code>3 * 1</code></td><td><code>t = 3</code></td><td>—</td><td><code>3</code></td></tr>
</table>
<p class="dap-an">✅ <strong>Answer: <code>t = 3</code></strong> (the outer <code>t</code>; the inner <code>t</code> was 1 and no longer exists). Verified by compiling and running: an instrumented build printed <code>f: a=6 b=5 c=7 -&gt; a+b-c=4, 2*(..)=8, /5=1</code> then <code>main: t = 3</code>. The two most common wrong answers: <strong>1</strong> (answering about the inner <code>t</code>) and <strong>0</strong> (grouping as <code>2 * ((a+b-c)/5)</code> = <code>2 * (4/5)</code> = <code>2 * 0</code> = 0 — that variant was also compiled, and it really does print 0). Swapping the arguments to <code>f(5, 6, 7)</code> happens to give the same 4 here, so this particular question does not punish trap 1 numerically — but the next one will.</p>
<p class="pitfall">⚠️ <code>2 * (a + b - c) / 5</code> and <code>2 * ((a + b - c) / 5)</code> are different expressions with different answers (1 versus 0) even though the operands are identical. <code>*</code> and <code>/</code> have equal precedence and associate <em>left to right</em>, so the multiplication happens first. When an exam gives you a mixed <code>*</code> and <code>/</code> chain on integers, work strictly left to right and never "simplify" the fraction first.</p>`,
        `<p class="y-chinh">🎯 Câu hỏi thi do chính bộ slide đưa ra: <em>"Given the following function and a case of using it. What is the value of the variable <code>t</code> when the function terminates?"</em> — cho hàm sau và một ca dùng nó, giá trị của biến <code>t</code> là bao nhiêu?</p>
<ul>
<li><strong>Đoạn mã, đúng như trên slide</strong> —
<pre><code>int f(int a, int b, int c)
{
    int t = 2 * (a + b - c) / 5;
    return t;
}

int x = 5, y = 6, z = 7;
int t = 3 * f(y, x, z);</code></pre></li>
<li><strong>Bẫy 1 — thứ tự đối số</strong> — lời gọi là <code>f(y, x, z)</code>, KHÔNG phải <code>f(x, y, z)</code>. Vị trí quyết định: <code>a ← y = 6</code>, <code>b ← x = 5</code>, <code>c ← z = 7</code>. Slide vẽ hẳn mũi tên từ <code>y=6</code>, <code>x=5</code>, <code>z=7</code> xuống <code>a</code>, <code>b</code>, <code>c</code>.</li>
<li><strong>Bẫy 2 — có HAI biến tên <code>t</code></strong> — một <code>t</code> bên trong <code>f</code> và một <code>t</code> bên ngoài. Câu hỏi hỏi cái bên ngoài. Chúng là hai ô nhớ riêng (slide 52) và mang hai giá trị khác nhau.</li>
<li><strong>Bẫy 3 — chia nguyên</strong> — <code>2 * (a + b - c) / 5</code> không có ngoặc quanh phép chia, nên nó nhóm từ trái sang phải thành <code>(2 * (a + b - c)) / 5</code>. Thay số: <code>a + b - c = 6 + 5 - 7 = 4</code> → <code>2 * 4 = 8</code> → <code>8 / 5 = 1</code>, vì cả hai toán hạng đều là <code>int</code>. Phần 0,6 bị vứt bỏ.</li>
<li><strong>Phép nhân cuối</strong> — <code>3 * f(...) = 3 * 1 = 3</code>. Chính slide cũng ghi: "2*(6+5-7)/5 = 1" và "t = 3*f(…) = 3*1 = 3".</li>
</ul>
<table>
<tr><th>Bước</th><th>Khung người gọi</th><th>Khung <code>f</code></th><th>Biểu thức đang tính</th></tr>
<tr><td>1. trước lời gọi</td><td><code>x=5</code>, <code>y=6</code>, <code>z=7</code>, <code>t=?</code></td><td>— chưa tạo —</td><td><code>3 * f(y, x, z)</code></td></tr>
<tr><td>2. tính các đối số</td><td><code>x=5</code>, <code>y=6</code>, <code>z=7</code></td><td>— đang dựng —</td><td><code>f(6, 5, 7)</code></td></tr>
<tr><td>3. đẩy khung, chép <em>theo vị trí</em></td><td>đóng băng</td><td><code>a=6</code>, <code>b=5</code>, <code>c=7</code>, <code>t=?</code></td><td></td></tr>
<tr><td>4. <code>a + b - c</code></td><td>đóng băng</td><td><code>a=6</code>, <code>b=5</code>, <code>c=7</code></td><td><code>6 + 5 - 7 = 4</code></td></tr>
<tr><td>5. <code>2 * 4</code></td><td>đóng băng</td><td>như trên</td><td><code>8</code></td></tr>
<tr><td>6. <code>8 / 5</code> — <strong>chia nguyên</strong></td><td>đóng băng</td><td><code>t = 1</code></td><td><code>1</code> (không phải 1,6)</td></tr>
<tr><td>7. <code>return t;</code>, gỡ khung</td><td><code>x=5</code>, <code>y=6</code>, <code>z=7</code></td><td>— bị huỷ, <code>t</code> của nó mất —</td><td>giá trị <strong>1</strong> về tới nơi</td></tr>
<tr><td>8. <code>3 * 1</code></td><td><code>t = 3</code></td><td>—</td><td><code>3</code></td></tr>
</table>
<p class="dap-an">✅ <strong>Đáp án: <code>t = 3</code></strong> (là <code>t</code> bên ngoài; <code>t</code> bên trong bằng 1 và đã không còn tồn tại). Đã kiểm bằng biên dịch và chạy thật: bản có gắn lệnh in ra <code>f: a=6 b=5 c=7 -&gt; a+b-c=4, 2*(..)=8, /5=1</code> rồi <code>main: t = 3</code>. Hai đáp án sai phổ biến nhất: <strong>1</strong> (trả lời nhầm về <code>t</code> bên trong) và <strong>0</strong> (nhóm thành <code>2 * ((a+b-c)/5)</code> = <code>2 * (4/5)</code> = <code>2 * 0</code> = 0 — biến thể đó cũng đã được biên dịch và nó in ra đúng 0 thật). Ở bài này đảo đối số thành <code>f(5, 6, 7)</code> tình cờ vẫn ra 4, nên câu này không phạt bẫy 1 về mặt con số — nhưng câu sau thì có.</p>
<p class="pitfall">⚠️ <code>2 * (a + b - c) / 5</code> và <code>2 * ((a + b - c) / 5)</code> là hai biểu thức khác nhau, cho đáp số khác nhau (1 so với 0), dù toán hạng y hệt. <code>*</code> và <code>/</code> cùng mức ưu tiên và kết hợp <em>từ trái sang phải</em>, nên phép nhân xảy ra trước. Gặp đề trộn <code>*</code> và <code>/</code> trên số nguyên thì làm nghiêm ngặt từ trái sang phải, đừng bao giờ "rút gọn phân số" trước.</p>`],

      [67, 'Exercise 5 — is this number a power of 2?',
        `<p class="y-chinh">🎯 "Write a C program that will accept a non-negative integer then print out whether this number is power of 2 or not." The slide hands you the whole analysis, including the trick.</p>
<ul>
<li><strong>The slide's analysis, verbatim</strong> — "Variable: <code>long n;</code>" · "Operation: Check a long integer n whether it is power of 2 or not (named <code>isPower2</code>)" · the body is one line: <code>return ((n &amp; (n-1))==0);</code></li>
<li><strong>The slide's <code>main</code></strong> —
<pre><code>Do
    accept n;
While (n &lt;= 0)
if (isPower2(n)==1) Print out " It is power of 2"
else                print out " It is not power of 2"</code></pre></li>
<li><strong>Why the trick works</strong> — a power of 2 has exactly one bit set. Subtracting 1 flips that bit off and turns every bit below it on. The two patterns therefore share no bit, so the AND is 0. For anything else, at least one higher bit survives in both. The slide's own table shows it for 1, 2, 4, 8, 16.</li>
<li><strong>Read the slide's table this way</strong> — for <code>n = 8</code>: <code>n</code> = <code>0000 1000</code>, <code>n-1</code> = <code>0000 0111</code>, <code>n &amp; (n-1)</code> = <code>0000 0000</code> → power of 2. For <code>n = 12</code>: <code>0000 1100</code> and <code>0000 1011</code> share bit 3 → result <code>0000 1000</code> = 8 ≠ 0 → not a power of 2.</li>
<li><strong>Why the <code>do … while (n &lt;= 0)</code> loop is not decoration</strong> — it is load-bearing. <code>isPower2(0)</code> returns <strong>1</strong>, which is wrong: 0 is not a power of 2. The input loop makes 0 unreachable. A robust standalone function would instead read <code>return n &gt; 0 &amp;&amp; (n &amp; (n - 1)) == 0;</code></li>
<li><strong>The full program</strong> —
<pre><code>#include &lt;stdio.h&gt;

int isPower2(long n) {
    return ((n &amp; (n - 1)) == 0);
}

int main(void) {
    long n;
    do {
        printf("Enter a positive integer: ");
        scanf("%ld", &amp;n);
    } while (n &lt;= 0);

    if (isPower2(n) == 1) printf("It is power of 2\\n");
    else                  printf("It is not power of 2\\n");
    return 0;
}</code></pre></li>
</ul>
<table>
<tr><th><code>n</code></th><th><code>n</code> in binary</th><th><code>n-1</code> in binary</th><th><code>n &amp; (n-1)</code></th><th><code>isPower2</code></th></tr>
<tr><td>1</td><td><code>0000 0001</code></td><td><code>0000 0000</code></td><td><code>0000 0000</code> = 0</td><td><strong>1</strong></td></tr>
<tr><td>2</td><td><code>0000 0010</code></td><td><code>0000 0001</code></td><td><code>0000 0000</code> = 0</td><td><strong>1</strong></td></tr>
<tr><td>3</td><td><code>0000 0011</code></td><td><code>0000 0010</code></td><td><code>0000 0010</code> = 2</td><td>0</td></tr>
<tr><td>4</td><td><code>0000 0100</code></td><td><code>0000 0011</code></td><td><code>0000 0000</code> = 0</td><td><strong>1</strong></td></tr>
<tr><td>8</td><td><code>0000 1000</code></td><td><code>0000 0111</code></td><td><code>0000 0000</code> = 0</td><td><strong>1</strong></td></tr>
<tr><td>12</td><td><code>0000 1100</code></td><td><code>0000 1011</code></td><td><code>0000 1000</code> = 8</td><td>0</td></tr>
<tr><td>16</td><td><code>0001 0000</code></td><td><code>0000 1111</code></td><td><code>0000 0000</code> = 0</td><td><strong>1</strong></td></tr>
<tr><td>24</td><td><code>0001 1000</code></td><td><code>0001 0111</code></td><td><code>0001 0000</code> = 16</td><td>0</td></tr>
<tr><td><strong>0</strong></td><td><code>0000 0000</code></td><td><code>1111 1111…</code> (−1)</td><td><code>0000 0000</code> = 0</td><td><strong>1 ← WRONG</strong></td></tr>
</table>
<p class="dap-an">✅ <strong>Answer.</strong> Every row of that table was produced by compiling and running the function, not by hand. Measured: <code>1, 2, 4, 8, 16, 32, 1024</code> → <strong>1</strong>; <code>3, 5, 6, 12, 24, 1000</code> → <strong>0</strong>; and <code>n = 0</code> → <strong>1</strong>, the false positive the input loop exists to prevent. The slide's table (n = 1, 2, 4, 8, 16) is correct as printed.</p>
<p class="pitfall">⚠️ <strong>Do not drop the inner parentheses.</strong> Writing <code>return n &amp; (n-1) == 0;</code> compiles, but <code>==</code> binds tighter than <code>&amp;</code>, so it means <code>n &amp; ((n-1) == 0)</code> — which for <code>n = 8</code> evaluates to <code>8 &amp; 0</code> = <strong>0</strong>, i.e. "not a power of 2". Verified by compiling; <code>cc -Wall</code> does warn here: <em>"&amp; has lower precedence than ==; == will be evaluated first"</em>. This is the same precedence wart as in Slot 02-04 — bitwise operators sit <em>below</em> the relational ones.</p>`,
        `<p class="y-chinh">🎯 "Write a C program that will accept a non-negative integer then print out whether this number is power of 2 or not" — nhận một số nguyên không âm rồi cho biết nó có phải luỹ thừa của 2 hay không. Slide trao sẵn cho bạn cả phần phân tích, kể cả cái mẹo.</p>
<ul>
<li><strong>Phần phân tích của slide, nguyên văn</strong> — "Variable: <code>long n;</code>" · "Operation: Check a long integer n whether it is power of 2 or not (named <code>isPower2</code>)" · thân hàm đúng một dòng: <code>return ((n &amp; (n-1))==0);</code></li>
<li><strong><code>main</code> theo slide</strong> —
<pre><code>Do
    accept n;
While (n &lt;= 0)
if (isPower2(n)==1) Print out " It is power of 2"
else                print out " It is not power of 2"</code></pre></li>
<li><strong>Vì sao mẹo đó đúng</strong> — một luỹ thừa của 2 có đúng một bit bằng 1. Trừ đi 1 làm tắt bit đó và bật hết các bit thấp hơn. Hai mẫu bit vì thế không chung bit nào, nên phép AND ra 0. Với số khác, luôn còn ít nhất một bit cao sống sót ở cả hai. Bảng trên slide minh hoạ với 1, 2, 4, 8, 16.</li>
<li><strong>Đọc bảng của slide như thế này</strong> — với <code>n = 8</code>: <code>n</code> = <code>0000 1000</code>, <code>n-1</code> = <code>0000 0111</code>, <code>n &amp; (n-1)</code> = <code>0000 0000</code> → là luỹ thừa của 2. Với <code>n = 12</code>: <code>0000 1100</code> và <code>0000 1011</code> chung bit thứ 3 → kết quả <code>0000 1000</code> = 8 ≠ 0 → không phải.</li>
<li><strong>Vòng <code>do … while (n &lt;= 0)</code> không phải để trang trí</strong> — nó chịu lực. <code>isPower2(0)</code> trả về <strong>1</strong>, và điều đó SAI: 0 không phải luỹ thừa của 2. Vòng nhập làm cho số 0 không bao giờ tới được hàm. Một hàm đứng riêng cho chắc chắn thì phải viết <code>return n &gt; 0 &amp;&amp; (n &amp; (n - 1)) == 0;</code></li>
<li><strong>Chương trình đầy đủ</strong> —
<pre><code>#include &lt;stdio.h&gt;

int isPower2(long n) {
    return ((n &amp; (n - 1)) == 0);
}

int main(void) {
    long n;
    do {
        printf("Enter a positive integer: ");
        scanf("%ld", &amp;n);
    } while (n &lt;= 0);

    if (isPower2(n) == 1) printf("It is power of 2\\n");
    else                  printf("It is not power of 2\\n");
    return 0;
}</code></pre></li>
</ul>
<table>
<tr><th><code>n</code></th><th><code>n</code> nhị phân</th><th><code>n-1</code> nhị phân</th><th><code>n &amp; (n-1)</code></th><th><code>isPower2</code></th></tr>
<tr><td>1</td><td><code>0000 0001</code></td><td><code>0000 0000</code></td><td><code>0000 0000</code> = 0</td><td><strong>1</strong></td></tr>
<tr><td>2</td><td><code>0000 0010</code></td><td><code>0000 0001</code></td><td><code>0000 0000</code> = 0</td><td><strong>1</strong></td></tr>
<tr><td>3</td><td><code>0000 0011</code></td><td><code>0000 0010</code></td><td><code>0000 0010</code> = 2</td><td>0</td></tr>
<tr><td>4</td><td><code>0000 0100</code></td><td><code>0000 0011</code></td><td><code>0000 0000</code> = 0</td><td><strong>1</strong></td></tr>
<tr><td>8</td><td><code>0000 1000</code></td><td><code>0000 0111</code></td><td><code>0000 0000</code> = 0</td><td><strong>1</strong></td></tr>
<tr><td>12</td><td><code>0000 1100</code></td><td><code>0000 1011</code></td><td><code>0000 1000</code> = 8</td><td>0</td></tr>
<tr><td>16</td><td><code>0001 0000</code></td><td><code>0000 1111</code></td><td><code>0000 0000</code> = 0</td><td><strong>1</strong></td></tr>
<tr><td>24</td><td><code>0001 1000</code></td><td><code>0001 0111</code></td><td><code>0001 0000</code> = 16</td><td>0</td></tr>
<tr><td><strong>0</strong></td><td><code>0000 0000</code></td><td><code>1111 1111…</code> (−1)</td><td><code>0000 0000</code> = 0</td><td><strong>1 ← SAI</strong></td></tr>
</table>
<p class="dap-an">✅ <strong>Đáp án.</strong> Từng dòng của bảng trên đều do biên dịch và chạy hàm thật mà ra, không phải tính tay. Đo được: <code>1, 2, 4, 8, 16, 32, 1024</code> → <strong>1</strong>; <code>3, 5, 6, 12, 24, 1000</code> → <strong>0</strong>; và <code>n = 0</code> → <strong>1</strong>, đúng cái dương tính giả mà vòng nhập sinh ra để chặn. Bảng trên slide (n = 1, 2, 4, 8, 16) in ra là đúng.</p>
<p class="pitfall">⚠️ <strong>Đừng bỏ cặp ngoặc bên trong.</strong> Viết <code>return n &amp; (n-1) == 0;</code> vẫn dịch được, nhưng <code>==</code> kết hợp chặt hơn <code>&amp;</code>, nên nó có nghĩa là <code>n &amp; ((n-1) == 0)</code> — với <code>n = 8</code> thì thành <code>8 &amp; 0</code> = <strong>0</strong>, tức "không phải luỹ thừa của 2". Đã kiểm bằng biên dịch; <code>cc -Wall</code> có cảnh báo ở đây: <em>"&amp; has lower precedence than ==; == will be evaluated first"</em>. Đây đúng là cái dị tật thứ tự ưu tiên đã gặp ở Slot 02-04 — toán tử bit nằm <em>dưới</em> toán tử quan hệ.</p>`],

      [68, 'Exercise 6 — is this date valid? (and a formula on the slide that is wrong)',
        `<p class="y-chinh">🎯 "Accept 3 integers <code>m</code>, <code>d</code>, <code>y</code> that represent a date. Print out they are valid or not." The slide adds: "The February in a leap year will have 29 days" and gives a leap-year test — <strong>which does not work</strong>. See the Answer box.</p>
<ul>
<li><strong>Analysis — nouns</strong> — three integers: month <code>m</code>, day <code>d</code>, year <code>y</code>. All <code>int</code>.</li>
<li><strong>Analysis — verbs</strong> — <em>accept three integers</em> (simple), <em>decide whether the year is a leap year</em> (function, because February depends on it), <em>find how many days that month has</em> (function, because the answer depends on both <code>m</code> and <code>y</code>), <em>check the date</em> (function), <em>print the verdict</em> (simple). Three functions, each highly cohesive.</li>
<li><strong>Why <code>daysInMonth</code> deserves to be its own function</strong> — it is the only place where the leap-year rule touches the calendar. Every other part of the program can then ignore leap years entirely. That is cohesion (slide 18) buying you simplicity.</li>
<li><strong>The order of the tests matters</strong> — check the year, then the month, then the day. <code>daysInMonth(13, y)</code> must never be called, so the month check has to happen first. Short-circuit <code>&amp;&amp;</code> would do the same job in a single expression.</li>
<li><strong>The correct leap-year rule</strong> — a year is a leap year if it is divisible by 4, <em>except</em> centuries, <em>unless</em> the century is divisible by 400. In C: <code>(y % 4 == 0 &amp;&amp; y % 100 != 0) || (y % 400 == 0)</code>. So 2024 yes, 2023 no, 1900 <strong>no</strong>, 2000 <strong>yes</strong>.</li>
<li><strong>The full program</strong> —
<pre><code>#include &lt;stdio.h&gt;

int isLeapYear(int y) {
    return (y % 4 == 0 &amp;&amp; y % 100 != 0) || (y % 400 == 0);
}

int daysInMonth(int m, int y) {
    if (m == 2) return isLeapYear(y) ? 29 : 28;
    if (m == 4 || m == 6 || m == 9 || m == 11) return 30;
    return 31;
}

int isValidDate(int m, int d, int y) {
    if (y &lt; 1) return 0;
    if (m &lt; 1 || m &gt; 12) return 0;
    if (d &lt; 1 || d &gt; daysInMonth(m, y)) return 0;
    return 1;
}

int main(void) {
    int m, d, y;
    printf("Enter month, day, year: ");
    scanf("%d%d%d", &amp;m, &amp;d, &amp;y);
    if (isValidDate(m, d, y)) printf("Valid date\\n");
    else                      printf("Invalid date\\n");
    return 0;
}</code></pre></li>
</ul>
<table>
<tr><th>Input <code>m d y</code></th><th><code>isLeapYear(y)</code></th><th><code>daysInMonth(m, y)</code></th><th>Verdict</th></tr>
<tr><td><code>2 29 2024</code></td><td>1</td><td>29</td><td><strong>VALID</strong></td></tr>
<tr><td><code>2 29 2023</code></td><td>0</td><td>28</td><td>INVALID</td></tr>
<tr><td><code>2 29 1900</code></td><td><strong>0</strong> (century, not /400)</td><td>28</td><td>INVALID</td></tr>
<tr><td><code>2 29 2000</code></td><td><strong>1</strong> (divisible by 400)</td><td>29</td><td><strong>VALID</strong></td></tr>
<tr><td><code>4 31 2024</code></td><td>1</td><td>30</td><td>INVALID</td></tr>
<tr><td><code>13 1 2024</code></td><td>—</td><td>never called</td><td>INVALID</td></tr>
<tr><td><code>1 0 2024</code></td><td>1</td><td>31</td><td>INVALID (<code>d &lt; 1</code>)</td></tr>
<tr><td><code>12 31 2024</code></td><td>1</td><td>31</td><td><strong>VALID</strong></td></tr>
</table>
<p class="dap-an">✅ <strong>Answer.</strong> Compiled with <code>cc -Wall -std=c99</code> and run on all eight rows above; every verdict matches the table exactly.<br>
⚠️ <strong>The formula printed on this slide is incorrect and must not be copied.</strong> The slide says: "If Y is a leap year then <code>(Y%4==0 &amp;&amp; Y%400 !=0) || (Y%100==0)</code>". Both clauses are wrong: the first says a year divisible by 4 <em>but not</em> by 400 is a leap year (so 1900 would be one), and the second says <em>every</em> century is a leap year (so 2100 would be one). Measured: both formulas were compiled and compared over the years 1..4000 and they <strong>disagree on 30 years</strong> — 1700, 1800, 1900, 2100, 2200, 2300, … every century that is not a multiple of 400. Concretely: 1900 → slide says leap (<em>wrong</em>, real answer no), 2100 → slide says leap (<em>wrong</em>). They agree on 2000, 2024, 2023 and 1600, which is why the mistake survives casual testing. Use <code>(y%4==0 &amp;&amp; y%100!=0) || (y%400==0)</code>. This is what the slide says; it is reported here as-is and not silently corrected on the slide.</p>
<p class="pitfall">⚠️ Two further traps in this exercise. (1) The input order is <code>m</code>, <code>d</code>, <code>y</code> — month first, US style — so <code>2 29 2024</code> means 29 February 2024, not 2 December. Reading it as day-first turns every test case upside down. (2) Do not write <code>d &gt; 31</code> as the day check: it accepts 31 April and 30 February. The day limit <em>must</em> come from <code>daysInMonth(m, y)</code>, which is exactly why that function exists.</p>`,
        `<p class="y-chinh">🎯 "Accept 3 integers <code>m</code>, <code>d</code>, <code>y</code> that represent a date. Print out they are valid or not" — nhận ba số nguyên biểu diễn một ngày rồi cho biết nó hợp lệ hay không. Slide ghi thêm: "The February in a leap year will have 29 days" và đưa ra một công thức kiểm năm nhuận — <strong>công thức đó SAI</strong>. Xem ô Đáp án.</p>
<ul>
<li><strong>Phân tích — danh từ</strong> — ba số nguyên: tháng <code>m</code>, ngày <code>d</code>, năm <code>y</code>. Đều kiểu <code>int</code>.</li>
<li><strong>Phân tích — động từ</strong> — <em>nhận ba số nguyên</em> (đơn giản), <em>xác định năm có nhuận không</em> (hàm, vì tháng Hai phụ thuộc vào nó), <em>tìm tháng đó có bao nhiêu ngày</em> (hàm, vì đáp số phụ thuộc cả <code>m</code> lẫn <code>y</code>), <em>kiểm tra ngày</em> (hàm), <em>in kết luận</em> (đơn giản). Ba hàm, mỗi hàm cohesion cao.</li>
<li><strong>Vì sao <code>daysInMonth</code> xứng đáng là một hàm riêng</strong> — nó là NƠI DUY NHẤT luật năm nhuận chạm vào lịch. Nhờ đó mọi phần còn lại của chương trình có thể quên hẳn chuyện năm nhuận. Đó là cohesion (slide 18) mua về cho bạn sự đơn giản.</li>
<li><strong>Thứ tự các phép kiểm quan trọng</strong> — kiểm năm, rồi tháng, rồi ngày. <code>daysInMonth(13, y)</code> không bao giờ được phép chạy, nên phép kiểm tháng phải đứng trước. Toán tử <code>&amp;&amp;</code> đoản mạch cũng làm đúng việc đó trong một biểu thức duy nhất.</li>
<li><strong>Luật năm nhuận ĐÚNG</strong> — một năm là năm nhuận nếu chia hết cho 4, <em>trừ</em> các năm tròn thế kỷ, <em>trừ khi</em> năm thế kỷ đó chia hết cho 400. Bằng C: <code>(y % 4 == 0 &amp;&amp; y % 100 != 0) || (y % 400 == 0)</code>. Nên 2024 có, 2023 không, 1900 <strong>không</strong>, 2000 <strong>có</strong>.</li>
<li><strong>Chương trình đầy đủ</strong> —
<pre><code>#include &lt;stdio.h&gt;

int isLeapYear(int y) {
    return (y % 4 == 0 &amp;&amp; y % 100 != 0) || (y % 400 == 0);
}

int daysInMonth(int m, int y) {
    if (m == 2) return isLeapYear(y) ? 29 : 28;
    if (m == 4 || m == 6 || m == 9 || m == 11) return 30;
    return 31;
}

int isValidDate(int m, int d, int y) {
    if (y &lt; 1) return 0;
    if (m &lt; 1 || m &gt; 12) return 0;
    if (d &lt; 1 || d &gt; daysInMonth(m, y)) return 0;
    return 1;
}

int main(void) {
    int m, d, y;
    printf("Enter month, day, year: ");
    scanf("%d%d%d", &amp;m, &amp;d, &amp;y);
    if (isValidDate(m, d, y)) printf("Valid date\\n");
    else                      printf("Invalid date\\n");
    return 0;
}</code></pre></li>
</ul>
<table>
<tr><th>Nhập <code>m d y</code></th><th><code>isLeapYear(y)</code></th><th><code>daysInMonth(m, y)</code></th><th>Kết luận</th></tr>
<tr><td><code>2 29 2024</code></td><td>1</td><td>29</td><td><strong>HỢP LỆ</strong></td></tr>
<tr><td><code>2 29 2023</code></td><td>0</td><td>28</td><td>KHÔNG HỢP LỆ</td></tr>
<tr><td><code>2 29 1900</code></td><td><strong>0</strong> (tròn thế kỷ, không chia hết 400)</td><td>28</td><td>KHÔNG HỢP LỆ</td></tr>
<tr><td><code>2 29 2000</code></td><td><strong>1</strong> (chia hết 400)</td><td>29</td><td><strong>HỢP LỆ</strong></td></tr>
<tr><td><code>4 31 2024</code></td><td>1</td><td>30</td><td>KHÔNG HỢP LỆ</td></tr>
<tr><td><code>13 1 2024</code></td><td>—</td><td>không được gọi</td><td>KHÔNG HỢP LỆ</td></tr>
<tr><td><code>1 0 2024</code></td><td>1</td><td>31</td><td>KHÔNG HỢP LỆ (<code>d &lt; 1</code>)</td></tr>
<tr><td><code>12 31 2024</code></td><td>1</td><td>31</td><td><strong>HỢP LỆ</strong></td></tr>
</table>
<p class="dap-an">✅ <strong>Đáp án.</strong> Biên dịch bằng <code>cc -Wall -std=c99</code> và chạy thật trên cả tám dòng trên; mọi kết luận khớp đúng bảng.<br>
⚠️ <strong>Công thức in trên slide này SAI và không được chép lại.</strong> Slide ghi: "If Y is a leap year then <code>(Y%4==0 &amp;&amp; Y%400 !=0) || (Y%100==0)</code>". Cả hai vế đều sai: vế đầu nói năm chia hết cho 4 <em>mà không</em> chia hết cho 400 là năm nhuận (vậy thì 1900 thành nhuận), vế sau nói <em>mọi</em> năm tròn thế kỷ đều nhuận (vậy thì 2100 thành nhuận). Đã đo: biên dịch cả hai công thức và so trên các năm 1..4000, chúng <strong>lệch nhau ở 30 năm</strong> — 1700, 1800, 1900, 2100, 2200, 2300, … tức mọi năm tròn thế kỷ không chia hết cho 400. Cụ thể: 1900 → slide nói nhuận (<em>sai</em>, thực tế là không), 2100 → slide nói nhuận (<em>sai</em>). Hai công thức trùng nhau ở 2000, 2024, 2023 và 1600, và đó là lý do lỗi này sống sót qua những lần thử qua loa. Hãy dùng <code>(y%4==0 &amp;&amp; y%100!=0) || (y%400==0)</code>. Ở đây chỉ nêu đúng những gì slide ghi và báo lại, KHÔNG tự ý sửa slide.</p>
<p class="pitfall">⚠️ Hai bẫy nữa trong bài này. (1) Thứ tự nhập là <code>m</code>, <code>d</code>, <code>y</code> — tháng trước, theo kiểu Mỹ — nên <code>2 29 2024</code> nghĩa là 29 tháng Hai 2024, không phải 2 tháng Chạp. Đọc nhầm thành ngày-trước là lật ngược toàn bộ bộ dữ liệu thử. (2) Đừng lấy <code>d &gt; 31</code> làm phép kiểm ngày: nó chấp nhận 31 tháng Tư và 30 tháng Hai. Giới hạn ngày <em>bắt buộc</em> phải lấy từ <code>daysInMonth(m, y)</code>, và đó chính là lý do hàm ấy tồn tại.</p>`],

      [69, 'Summary — what a module is and the four parts of a function',
        `<p class="y-chinh">🎯 The deck's own recap, six statements. Every one of them is a candidate for a one-line theory question on the exam.</p>
<ul>
<li><strong>"Module: A portion of a program that carries out a specific function and may be used alone or combined with other modules to create a program."</strong> — word for word the definition from slide 7. Note the two halves: <em>a specific</em> job, and <em>combinable</em>.</li>
<li><strong>"Advantages of modules: It is easy to upgrade and it can be re-used."</strong> — the two characteristics of slide 11. Upgradeable because the code is small and focused; reusable because it has a name and can be called many times, from many programs if it lives in a library file.</li>
<li><strong>"C-function is a module."</strong> — the bridge that the whole deck is built on: in C there is no separate "module" construct. The function <em>is</em> the module.</li>
<li><strong>"A function is highly cohesive if all its statements focus to the same purpose."</strong> — slide 16's definition, compressed. The practical test stays the same: can you name it with one verb phrase?</li>
<li><strong>"Parameters make a function low coupling."</strong> — the sharpest line on the slide. A function that receives what it needs through parameters is independent; one that reaches out to globals is welded to its surroundings. This sentence is the summary of slides 19–20 <em>and</em> the reason slide 61 warned against globals.</li>
<li><strong>"4 parts of a function: Return type, function name, parameters, body"</strong> — with the syntax repeated:
<pre><code>returnType functionName( Type param1, Type param2, …)
{
    &lt;&lt;statements&gt;
}</code></pre>
The first three parts together are the <em>header</em>; the header is also what a prototype is (slide 44), which is why the prototype ends with a semicolon and no braces.</li>
</ul>
<p class="dap-an">✅ Self-check on the four parts using a function verified earlier in this lesson, <code>int gcd(int a, int b) { … }</code>: return type = <code>int</code> · name = <code>gcd</code> · parameters = <code>int a, int b</code> · body = the <code>while</code> loop plus <code>return a;</code>. Its prototype is the header plus a semicolon: <code>int gcd(int a, int b);</code>. And for <code>void printDivisors(int n)</code> the return type is <code>void</code>, so the body has no <code>return</code> expression — the compiled, run version printed <code>1, 2, 3, 4, 6, 12,</code> for <code>n = 12</code>.</p>
<p class="meo">💡 If an exam asks you to "write the prototype", the answer is always mechanical: copy the header, delete the body, add a semicolon. Slide 48's style rule adds one thing — keep the parameter names in the prototype, even though C lets you drop them, because the names are documentation for whoever calls the function.</p>`,
        `<p class="y-chinh">🎯 Phần tổng kết do chính bộ slide viết, sáu câu. Câu nào cũng là ứng viên cho một câu lý thuyết một dòng trong đề thi.</p>
<ul>
<li><strong>"Module: A portion of a program that carries out a specific function and may be used alone or combined with other modules to create a program."</strong> — đúng từng chữ định nghĩa ở slide 7. Chú ý hai nửa: làm <em>một việc cụ thể</em>, và <em>ghép được</em> với nhau.</li>
<li><strong>"Advantages of modules: It is easy to upgrade and it can be re-used."</strong> — hai đặc điểm ở slide 11. Dễ nâng cấp vì đoạn code nhỏ và tập trung; dùng lại được vì nó có tên và gọi được nhiều lần, thậm chí từ nhiều chương trình nếu nó nằm trong tệp thư viện.</li>
<li><strong>"C-function is a module."</strong> — cây cầu mà cả bộ slide dựng trên đó: trong C không có cấu trúc "module" riêng. Hàm CHÍNH LÀ module.</li>
<li><strong>"A function is highly cohesive if all it's statements focus to the same purpose."</strong> — định nghĩa của slide 16, nén lại. Phép thử thực dụng vẫn thế: bạn có đặt tên được cho nó bằng một cụm động từ không?</li>
<li><strong>"Parameters make a function low coupling."</strong> — câu sắc nhất trên slide. Hàm nhận thứ nó cần qua tham số thì độc lập; hàm thò tay ra biến toàn cục thì bị hàn vào môi trường xung quanh. Câu này là bản tóm tắt của slide 19–20 <em>và</em> là lý do slide 61 cảnh báo về biến toàn cục.</li>
<li><strong>"4 parts of a function: Return type, function name, parameters, body"</strong> — kèm cú pháp nhắc lại:
<pre><code>returnType functionName( Type param1, Type param2, …)
{
    &lt;&lt;statements&gt;
}</code></pre>
Ba phần đầu gộp lại là <em>header</em>; mà header cũng chính là prototype (slide 44), nên prototype kết thúc bằng dấu chấm phẩy và không có cặp ngoặc nhọn.</li>
</ul>
<p class="dap-an">✅ Tự kiểm bốn phần trên một hàm đã được kiểm chạy trong bài này, <code>int gcd(int a, int b) { … }</code>: kiểu trả về = <code>int</code> · tên = <code>gcd</code> · tham số = <code>int a, int b</code> · thân = vòng <code>while</code> cộng <code>return a;</code>. Prototype của nó là header cộng dấu chấm phẩy: <code>int gcd(int a, int b);</code>. Còn với <code>void printDivisors(int n)</code> thì kiểu trả về là <code>void</code> nên thân hàm không có biểu thức <code>return</code> — bản đã biên dịch và chạy in ra <code>1, 2, 3, 4, 6, 12,</code> với <code>n = 12</code>.</p>
<p class="meo">💡 Nếu đề thi bảo "viết prototype", đáp án luôn máy móc: chép header, xoá thân hàm, thêm dấu chấm phẩy. Quy tắc phong cách ở slide 48 thêm một ý — giữ lại TÊN tham số trong prototype dù C cho phép bỏ, vì những cái tên đó là tài liệu cho người sẽ gọi hàm.</p>`],

      [70, 'Summary (cont.) — the mechanics: calling, the stack, pass by value',
        `<p class="y-chinh">🎯 The second summary slide. Its content is a picture; the extracted text holds only the words "Summary (cont.)". Rather than invent what the image shows, here is the checklist for the block this slide closes — the mechanics of a call, slides 34–53.</p>
<ul>
<li><strong>Note on this slide</strong> — the slide body is an image (a diagram or a table) and is <em>not</em> reproduced here, because the extracted text does not contain it. Read it on screen alongside the checklist below; everything in the checklist is drawn from slides 34–53 of this same deck and has been verified by compiling.</li>
<li><strong>Implementing (slides 35–37)</strong> — state the task as verb + nouns; give the parameters values and do the job yourself; write the steps down; translate the steps to C. A task is described well "if the receiver does not need to ask anything". Testing functions return 1 for true and 0 for false.</li>
<li><strong>Using (slides 39, 44–47)</strong> — <em>parameters</em> are the names in the definition, <em>arguments</em> are the values at the call. Library functions need their <code>#include</code>; your own need a prototype if defined below the caller. <code>#include "file"</code> looks in your directory, <code>#include &lt;file&gt;</code> in the system directory.</li>
<li><strong>What a call does (slides 50–51)</strong> — push a frame; copy each argument into the matching parameter <em>by position</em>; store the return address; run the body; copy the return value out; pop the frame. Four memory regions exist: code, data (globals), stack (locals), heap (<code>malloc</code>).</li>
<li><strong>Pass by value (slides 52–53)</strong> — C has no other mode. Parameters live at different addresses from arguments (measured: 0x16f0aa3c8 versus 0x16f0aa38c). A function cannot change the caller's variable unless it is given the address. That is the whole content of Exercise 3, and the reason Slot 10 exists.</li>
<li><strong>The style rules to carry away (slide 48)</strong> — a prototype for every definition; an explicit return type; <code>void</code> for no parameters; never recurse into <code>main</code>; keep parameter names in prototypes; write generic names so the function is reusable.</li>
</ul>
<p class="meo">💡 A one-minute self-test for this whole block, all answerable from the checklist: <em>Which segment holds a <code>static</code> local?</em> (data) · <em>How are arguments matched to parameters — by name or by position?</em> (position) · <em>What does a function get when you pass it an <code>int</code>?</em> (a copy) · <em>What is stored in a frame besides variables?</em> (the return address) · <em>Where does a prototype go and why?</em> (above the first call, so the compiler can mark the call site — slide 44).</p>`,
        `<p class="y-chinh">🎯 Slide tổng kết thứ hai. Nội dung của nó là một hình; phần chữ trích ra chỉ có đúng dòng "Summary (cont.)". Thay vì bịa ra hình đó vẽ gì, dưới đây là bảng kiểm cho chính khối mà slide này khép lại — cơ chế của một lời gọi, slide 34–53.</p>
<ul>
<li><strong>Ghi chú về slide này</strong> — phần thân slide là ẢNH (một sơ đồ hoặc một bảng) và ở đây KHÔNG tái tạo được, vì phần chữ trích ra không chứa nó. Hãy nhìn slide trên màn hình song song với bảng kiểm dưới đây; mọi ý trong bảng kiểm đều lấy từ slide 34–53 của chính bộ slide này và đều đã được kiểm bằng biên dịch.</li>
<li><strong>Hiện thực hàm (slide 35–37)</strong> — phát biểu công việc dạng động từ + danh từ; gán giá trị cho tham số rồi tự tay làm việc đó; viết ra từng bước; dịch các bước sang C. Một công việc được mô tả tốt "if the receiver does not need to ask any thing" — khi người nhận không phải hỏi thêm gì. Hàm kiểm tra trả về 1 cho đúng, 0 cho sai.</li>
<li><strong>Dùng hàm (slide 39, 44–47)</strong> — <em>parameter</em> là tên trong định nghĩa, <em>argument</em> là giá trị lúc gọi. Hàm thư viện cần <code>#include</code> của nó; hàm của bạn cần prototype nếu định nghĩa nằm dưới chỗ gọi. <code>#include "file"</code> tìm trong thư mục của bạn, <code>#include &lt;file&gt;</code> tìm trong thư mục hệ thống.</li>
<li><strong>Một lời gọi làm gì (slide 50–51)</strong> — đẩy một khung; chép từng đối số vào tham số tương ứng <em>theo vị trí</em>; lưu địa chỉ trở về; chạy thân hàm; chép giá trị trả về ra; gỡ khung. Có bốn vùng nhớ: code, data (biến toàn cục), stack (biến cục bộ), heap (<code>malloc</code>).</li>
<li><strong>Truyền theo giá trị (slide 52–53)</strong> — C không có chế độ nào khác. Tham số nằm ở địa chỉ khác đối số (đo được: 0x16f0aa3c8 so với 0x16f0aa38c). Hàm không thể sửa biến của người gọi trừ khi được trao địa chỉ. Đó là toàn bộ nội dung Exercise 3, và là lý do Slot 10 tồn tại.</li>
<li><strong>Quy tắc phong cách phải mang theo (slide 48)</strong> — mỗi định nghĩa một prototype; ghi rõ kiểu trả về; dùng <code>void</code> khi không có tham số; đừng gọi đệ quy vào <code>main</code>; giữ tên tham số trong prototype; đặt tên tổng quát để hàm dùng lại được.</li>
</ul>
<p class="meo">💡 Bài tự kiểm một phút cho cả khối này, đáp án đều nằm trong bảng kiểm: <em>Biến cục bộ <code>static</code> nằm ở phân đoạn nào?</em> (data) · <em>Đối số ghép vào tham số theo tên hay theo vị trí?</em> (vị trí) · <em>Hàm nhận được gì khi bạn truyền vào một <code>int</code>?</em> (một bản sao) · <em>Trong một khung còn lưu gì ngoài biến?</em> (địa chỉ trở về) · <em>Prototype đặt ở đâu và để làm gì?</em> (trên chỗ gọi đầu tiên, để trình biên dịch đánh dấu vị trí gọi — slide 44).</p>`],

      [71, 'Summary (cont.) — extent, scope, and what comes next',
        `<p class="y-chinh">🎯 The last slide of the deck. Like slide 70 its body is an image, so what follows is the closing checklist for slides 54–68 — analysis, extent and scope, walkthroughs — plus the bridge into Slot 10.</p>
<ul>
<li><strong>Note on this slide</strong> — the content is an image not present in the extracted text and is not reconstructed here. The checklist below is assembled from slides 54–68 of this deck and every claim in it was verified by compiling and running code.</li>
<li><strong>Analysis (54–58)</strong> — nouns become variables with suitable types; verbs become functions; re-order the verbs into an executable algorithm; mark each verb <em>simple</em> (a library call) or <em>complex</em> (your function). Analysis recurses: <code>printNPrimes</code> revealed <code>isPrime</code> hiding inside it.</li>
<li><strong>Extent versus scope (60–64)</strong> — extent is a duration (time), scope is a region of source text. Globals: data segment, whole-program extent, auto-initialised to 0. Locals: stack, one-call extent, <strong>not</strong> initialised. <code>static</code> locals: global extent, local scope. When names collide, <em>local first, global later</em>.</li>
<li><strong>Walkthroughs (65–66)</strong> — one trace table per frame; map arguments to parameters by position; remember that two variables may share a name; and apply Slot 02-04 arithmetic inside the body. The deck's own example resolved to <code>t = 3</code>.</li>
<li><strong>The exercises (53, 59, 67, 68)</strong> — broken swap (pass by value), GCD/LCM (function calling function), power of 2 (bit trick plus a false positive at <code>n = 0</code>), date validation (a leap-year rule the slide states incorrectly — see slide 68).</li>
<li><strong>What comes next — Slot 10, Pointers</strong> — every unanswered question in this deck points there: how does a function change its caller's variable? how does a function return more than one value? how do you pass a large object without copying it? The answer to all three is the same, and it is the address.</li>
</ul>
<p class="dap-an">✅ One last measurement that ties extent to the next chapter. Returning the address of a local looks like a way out of pass-by-value and is not:
<pre><code>int *makeLocal(void) {
    int x = 42;
    return &amp;x;          /* x dies the instant this returns */
}</code></pre>
Compiled with <code>cc -Wall</code>, this produces the warning <em>"address of stack memory associated with local variable 'x' returned [-Wreturn-stack-address]"</em>. Run, it happened to print <strong>42</strong> — and that is the danger, not the reassurance: the frame was popped, the bytes simply had not been overwritten yet. This is <em>undefined behaviour</em>; the same code in a bigger program prints garbage or crashes. Extent, not scope, is what killed <code>x</code> — the pointer's spelling was fine.</p>
<p class="meo">💡 Before moving to Slot 10, be able to do these four things with a pen and no compiler: draw the four memory segments and place any given variable in one; draw two stack frames for a call and mark the copy arrows and the return address; explain in one sentence why a value-swap cannot work; and say which of extent or scope a given bug belongs to (compiler error → scope; wrong behaviour at run time → extent).</p>`,
        `<p class="y-chinh">🎯 Slide cuối cùng của bộ. Giống slide 70, phần thân là ảnh, nên dưới đây là bảng kiểm khép lại cho slide 54–68 — phân tích, extent và scope, chạy tay — cộng với cây cầu sang Slot 10.</p>
<ul>
<li><strong>Ghi chú về slide này</strong> — nội dung là ẢNH, không có trong phần chữ trích ra, và ở đây KHÔNG dựng lại. Bảng kiểm dưới đây gom từ slide 54–68 của chính bộ này và mọi khẳng định trong đó đều đã kiểm bằng biên dịch và chạy thật.</li>
<li><strong>Phân tích (54–58)</strong> — danh từ thành biến với kiểu phù hợp; động từ thành hàm; sắp lại các động từ thành thuật toán chạy được; đánh dấu mỗi động từ là <em>simple</em> (lời gọi thư viện) hay <em>complex</em> (hàm của bạn). Phân tích có thể lặp: <code>printNPrimes</code> làm lộ ra <code>isPrime</code> nấp bên trong.</li>
<li><strong>Extent so với scope (60–64)</strong> — extent là một khoảng THỜI GIAN, scope là một vùng VĂN BẢN mã nguồn. Biến toàn cục: đoạn data, extent cả chương trình, tự khởi tạo bằng 0. Biến cục bộ: stack, extent một lời gọi, <strong>KHÔNG</strong> được khởi tạo. Biến cục bộ <code>static</code>: extent toàn cục, scope cục bộ. Trùng tên thì <em>cục bộ trước, toàn cục sau</em>.</li>
<li><strong>Chạy tay (65–66)</strong> — mỗi khung một bảng vết; ghép đối số vào tham số theo VỊ TRÍ; nhớ rằng hai biến có thể trùng tên; và áp luật số học Slot 02-04 bên trong thân hàm. Ví dụ của chính bộ slide cho ra <code>t = 3</code>.</li>
<li><strong>Các bài tập (53, 59, 67, 68)</strong> — swap hỏng (truyền theo giá trị), ƯCLN/BCNN (hàm gọi hàm), luỹ thừa của 2 (mẹo bit kèm dương tính giả ở <code>n = 0</code>), kiểm ngày tháng (công thức năm nhuận mà slide ghi sai — xem slide 68).</li>
<li><strong>Tiếp theo là gì — Slot 10, Con trỏ</strong> — mọi câu hỏi còn bỏ ngỏ trong bộ slide này đều chỉ về đó: làm sao một hàm sửa được biến của người gọi? làm sao một hàm trả về nhiều hơn một giá trị? làm sao truyền một đối tượng lớn mà không phải chép? Cả ba đều chung một đáp án, và đó là ĐỊA CHỈ.</li>
</ul>
<p class="dap-an">✅ Một phép đo cuối nối extent với chương sau. Trả về địa chỉ của biến cục bộ trông như một lối thoát khỏi truyền-theo-giá-trị, nhưng không phải:
<pre><code>int *makeLocal(void) {
    int x = 42;
    return &amp;x;          /* x chết ngay khi hàm này trả về */
}</code></pre>
Biên dịch bằng <code>cc -Wall</code>, nó sinh cảnh báo <em>"address of stack memory associated with local variable 'x' returned [-Wreturn-stack-address]"</em>. Chạy thì nó tình cờ in ra <strong>42</strong> — và đó mới là chỗ nguy hiểm, không phải chỗ để yên tâm: khung đã bị gỡ, chỉ là các byte chưa kịp bị ghi đè. Đây là <em>hành vi không xác định</em>; cũng đoạn mã đó trong một chương trình lớn hơn sẽ in ra rác hoặc làm sập. Thứ giết <code>x</code> là extent, không phải scope — cách viết con trỏ thì chẳng sai gì.</p>
<p class="meo">💡 Trước khi sang Slot 10, hãy làm được bốn việc này bằng bút và không có trình biên dịch: vẽ bốn phân đoạn bộ nhớ và đặt được một biến bất kỳ vào đúng vùng; vẽ hai khung ngăn xếp cho một lời gọi kèm mũi tên chép và địa chỉ trở về; giải thích trong một câu vì sao hoán đổi theo giá trị không thể chạy; và nói được một lỗi cho trước thuộc về extent hay scope (lỗi biên dịch → scope; chạy sai → extent).</p>`],

    ]),
  ].join('\n'),
};
