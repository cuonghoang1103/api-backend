/**
 * PRF192 · Slot 10 — Pointers, học theo từng slide: PHẦN 2 (slide 19–35).
 * Deck 'prf5' (PRF5), 35 slide, ảnh đã render sẵn lên CDN images/academy/PRF192/v1/prf5/NNN.webp.
 *
 * Nội dung bám ĐÚNG chữ trích từ Slot_10_Pointers.pptx của trường
 * (/tmp/prf192-text/prf5.txt, slide 19→35). Nhiều slide đặt MÃ NGUỒN TRONG ẢNH
 * (19, 20, 21, 22, 23, 26, 27, 28, 29, 30, 31, 32, 34) nên các ảnh đó đã được
 * đọc trực tiếp để lấy đúng từng dòng code.
 *
 * MỌI chương trình và con số dưới đây đã được biên dịch thật bằng `cc -Wall` và chạy:
 *   · slide 19  pD+i / pI+i           → bước nhảy 8 byte (double) và 4 byte (int) ✓
 *                                       `printf("%u", &n)` cho -Wformat và in ra số cụt ✓
 *   · slide 20  Exercise 3            → "n2=15, n1=9, n0=-3" ✓ (đo cả 3 địa chỉ: n0 < n1 < n2, cách nhau 4 byte)
 *   · slide 21  Exercise 4 & 5        → p+8=1032 · p-3=988 · p++ →1004 ; q+8=207008 · q-3=206997 · q++ →207001 ✓
 *   · slide 22  swap1(a, b)           → "a=5, b=7" cả hai lần ✓ (khớp ảnh console trên slide)
 *   · slide 23  swap2(&a, &b)         → "a=5, b=7" rồi "a=7, b=5" ✓ (khớp ảnh console trên slide)
 *   · slide 26  malloc 5 int          → 20 bytes ✓ ; vùng nhớ KHÔNG được khởi tạo (đo thật: lần chạy này ra 0, không bảo đảm)
 *   · slide 27  calloc(5, sizeof(int))→ "0 0 0 0 0" ✓ đúng như slide nói
 *   · slide 28  realloc 5→10 int      → khối ĐÃ DỜI thật: 0x791000920 → 0x1035f9f70, 5 phần tử cũ giữ nguyên 1 2 3 4 5 ✓
 *   · slide 30  Demo 1                → stack đi XUỐNG (&p2 < &p1 < &n), heap đi LÊN (p1 < p2 < p3, cách 16 byte) ✓
 *   · slide 31  Demo 2 với 12.5 và 4  → Sum 16.5 · Difference 8.5 · Product 50 · Quotient 3.125 ✓
 *   · slide 32  Demo 3 với 5/10 5 7 20 6 → "10 5 7 20 6" ✓ khớp đúng ảnh console trên slide
 *   · slide 34  Exercise 6 nhập "D A" → A/B/C/D với %d %o %X = 65 101 41 · 66 102 42 · 67 103 43 · 68 104 44
 *     ⚠ BẢNG TRÊN SLIDE ghi cột giữa là 81/82/83/84 — SAI. Hệ 8 của 65 là 101 chứ không phải 81
 *       (81 là kết quả của phép chia 65 : 8 = 8 dư 1 rồi ghép "8" với "1" mà quên đổi thương 8 sang hệ 8 = 10).
 *       Đã nêu rõ trong bài, KHÔNG sửa slide và KHÔNG im lặng chép lại.
 *   · rò rỉ bộ nhớ: ghi đè con trỏ gốc bằng malloc thứ hai → 16 byte đầu mất dấu vết ✓ ; free + gán NULL → p = 0x0 ✓
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'prf5';

export default {
  title: '6.0b — Slide by slide: Pointers as parameters, malloc/calloc/realloc/free (slides 19–35)|||6.0b — Slide bài giảng: Con trỏ làm tham số, cấp phát động malloc/calloc/realloc/free (slide 19–35)',
  slug: 'prf192-6-0b-slides-con-tro-cap-phat-dong',
  type: 'DOCUMENT',
  description: 'Nửa sau của Slot 10 (slide 19–35): số học con trỏ qua ví dụ chạy thật, ba bài Exercise 3/4/6 giải trọn vẹn, rồi hai slide trả lời câu hỏi lớn nhất của chương — vì sao hàm C không sửa được dữ liệu bên ngoài và con trỏ chữa nó thế nào (swap1 so với swap2). Phần cuối là toàn bộ bộ tứ cấp phát động malloc · calloc · realloc · free với ba Demo của trường, slide Note bốn quy tắc an toàn và slide tổng kết. Mọi chương trình trong bài đều đã được biên dịch bằng cc -Wall và chạy thật để đối chiếu từng con số; một lỗi sai trong bảng kết quả của Exercise 6 trên slide gốc đã được chỉ ra thay vì chép lại.',
  content: [
    walkHead(D, 19, 35),
    walk(D, [

      [19, 'Pointer Arithmetic Operators: Example',
        `<p class="y-chinh">🎯 The whole slide is one formula in the yellow box: <strong>Pointer + i → Pointer + (i * sizeof(baseType))</strong>. Adding 1 to a pointer does not add 1 byte — it adds one <em>element</em>, and how big an element is depends entirely on the pointer's declared type.</p>
<ul>
<li><strong>Two loops, same code, different step</strong> — the program declares <code>double x = 0.5; double *pD = &amp;x;</code> and <code>int n = 3; int *pI = &amp;n;</code>, then prints <code>pD+i</code> and <code>pI+i</code> for <code>i</code> from −2 to 2. The console on the slide shows the double row stepping <code>6684144, 6684152, 6684160, 6684168, 6684176</code> — gaps of <strong>8</strong> — and the int row stepping <code>6684148, 6684152, 6684156, 6684160, 6684164</code> — gaps of <strong>4</strong>.</li>
<li><strong>Why the compiler does this for you</strong> — because pointers exist to walk arrays. If <code>pD</code> points at element 0 of a <code>double</code> array, you want <code>pD+3</code> to be element 3, not "3 bytes into element 0" which is the middle of a number and means nothing.</li>
<li><strong>The red box is the warning of the slide</strong> — <em>"If access data using pI (bytes) can cause harm to the variable"</em>. Look at the address map on the right: <code>x</code> lives at 6684152…6684159 (8 bytes) and <code>n</code> at 6684148. After <code>pI = pI - 1;</code> the int pointer lands at 6684148, and <code>*pI = 10;</code> writes 4 bytes there — which is not <code>n</code> and not a whole <code>x</code> either.</li>
<li><strong>The console proves the damage</strong> — the slide prints <code>Address of pI: 6684152 - Value: 0</code>. The value read back is <strong>0</strong>, not 3 and not 10: the int pointer is now reading four bytes taken from the middle of a <code>double</code>. That is memory corruption, and C reports it with no error at all.</li>
<li><strong>Increment and decrement are the same rule</strong> — the tail of the program does <code>pI++;</code> then <code>pI--;</code> and prints the address each time: it goes up by 4 and comes back down by 4. Slide 16 stated this in words; this slide is the measurement.</li>
<li><strong>Link forward</strong> — this is exactly the machinery that will make <code>arr[i]</code> work in Slot 13–15. <code>arr[i]</code> is defined in C as <code>*(arr + i)</code>, and "+ i" here is the scaled addition you are reading about.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main() {
    double x = 0.5;
    double *pD = &amp;x;

    int i;
    for (i = -2; i &lt;= 2; i++) {
        printf("%p, ", (void *)(pD + i));   /* buoc 8 byte */
    }
    printf("\\n");

    int n = 3;
    int *pI = &amp;n;
    for (i = -2; i &lt;= 2; i++) {
        printf("%p, ", (void *)(pI + i));   /* buoc 4 byte */
    }
    printf("\\n");

    printf("sizeof(double) = %zu, sizeof(int) = %zu\\n", sizeof(double), sizeof(int));
    return 0;
}</code></pre>
<p class="dap-an">✅ Compiled with <code>cc -Wall</code> and run: the <code>double</code> row steps by exactly <strong>8 bytes</strong> per <code>i</code>, the <code>int</code> row by exactly <strong>4 bytes</strong> — the slide's formula holds, and the two rows are not interchangeable. On my 64-bit machine the addresses are larger numbers than the slide's, but every gap is identical, because the gap is <code>sizeof(baseType)</code> and nothing else.</p>
<p class="pitfall">⚠️ The slide prints addresses with <code>printf("%u", ...)</code>. That was fine in the 32-bit Dev-C++ world where the slide was made; on any modern 64-bit compiler it is a real bug — <code>cc -Wall</code> answers with <em>"format specifies type 'unsigned int' but the argument has type 'int *'"</em> and the address printed is truncated garbage (I measured <code>1839850424</code> for a real address of <code>0x16d06a3c8</code>). Print pointers with <code>%p</code> and a <code>(void *)</code> cast.</p>`,
        `<p class="y-chinh">🎯 Cả slide gói trong một công thức nằm trong khung vàng: <strong>Pointer + i → Pointer + (i * sizeof(baseType))</strong>. Cộng 1 vào một con trỏ KHÔNG phải cộng 1 byte — nó cộng một <em>phần tử</em>, mà phần tử to bao nhiêu thì hoàn toàn do kiểu khai báo của con trỏ quyết định.</p>
<ul>
<li><strong>Hai vòng lặp, cùng một đoạn mã, bước nhảy khác nhau</strong> — chương trình khai <code>double x = 0.5; double *pD = &amp;x;</code> và <code>int n = 3; int *pI = &amp;n;</code>, rồi in <code>pD+i</code> và <code>pI+i</code> với <code>i</code> chạy từ −2 tới 2. Cửa sổ console trên slide cho hàng double nhảy <code>6684144, 6684152, 6684160, 6684168, 6684176</code> — cách nhau <strong>8</strong> — còn hàng int nhảy <code>6684148, 6684152, 6684156, 6684160, 6684164</code> — cách nhau <strong>4</strong>.</li>
<li><strong>Vì sao trình biên dịch làm giúp bạn chuyện này</strong> — vì con trỏ sinh ra để đi trên mảng. Nếu <code>pD</code> trỏ vào phần tử 0 của một mảng <code>double</code>, bạn muốn <code>pD+3</code> là phần tử 3, chứ không phải "3 byte tính từ đầu phần tử 0" — chỗ ấy nằm giữa một con số và chẳng có nghĩa gì.</li>
<li><strong>Khung đỏ chính là lời cảnh báo của slide</strong> — <em>"Nếu truy cập dữ liệu bằng pI (tính theo byte) thì có thể làm hỏng biến"</em>. Nhìn bản đồ địa chỉ bên phải: <code>x</code> nằm ở 6684152…6684159 (8 byte) còn <code>n</code> ở 6684148. Sau <code>pI = pI - 1;</code> con trỏ int rơi xuống 6684148, và <code>*pI = 10;</code> ghi 4 byte ở đó — chỗ đó không phải <code>n</code>, mà cũng không phải trọn một <code>x</code>.</li>
<li><strong>Console chứng minh thiệt hại</strong> — slide in ra <code>Address of pI: 6684152 - Value: 0</code>. Giá trị đọc lại là <strong>0</strong>, không phải 3 cũng không phải 10: con trỏ int giờ đang đọc bốn byte lấy từ giữa lòng một <code>double</code>. Đó là hỏng bộ nhớ, và C báo lại bằng… không một lỗi nào.</li>
<li><strong>Tăng và giảm cũng cùng một luật</strong> — cuối chương trình có <code>pI++;</code> rồi <code>pI--;</code> và in địa chỉ mỗi lần: nó lên 4 rồi tụt về đúng 4. Slide 16 nói bằng lời, slide này là phép đo.</li>
<li><strong>Nối về sau</strong> — đây chính là bộ máy sẽ làm <code>arr[i]</code> chạy được ở Slot 13–15. Trong C, <code>arr[i]</code> được định nghĩa là <code>*(arr + i)</code>, và dấu "+ i" ấy chính là phép cộng có nhân hệ số bạn đang đọc.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main() {
    double x = 0.5;
    double *pD = &amp;x;

    int i;
    for (i = -2; i &lt;= 2; i++) {
        printf("%p, ", (void *)(pD + i));   /* buoc 8 byte */
    }
    printf("\\n");

    int n = 3;
    int *pI = &amp;n;
    for (i = -2; i &lt;= 2; i++) {
        printf("%p, ", (void *)(pI + i));   /* buoc 4 byte */
    }
    printf("\\n");

    printf("sizeof(double) = %zu, sizeof(int) = %zu\\n", sizeof(double), sizeof(int));
    return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch bằng <code>cc -Wall</code> và chạy thật: hàng <code>double</code> nhảy đúng <strong>8 byte</strong> mỗi đơn vị <code>i</code>, hàng <code>int</code> nhảy đúng <strong>4 byte</strong> — công thức của slide đúng, và hai hàng đó không thể thay cho nhau. Trên máy 64-bit của tôi các địa chỉ là số lớn hơn trên slide, nhưng mọi khoảng cách đều y hệt, vì khoảng cách ấy bằng <code>sizeof(baseType)</code> chứ không phụ thuộc gì khác.</p>
<p class="pitfall">⚠️ Slide in địa chỉ bằng <code>printf("%u", ...)</code>. Chuyện đó ổn trong thế giới Dev-C++ 32-bit nơi slide được soạn; trên mọi trình biên dịch 64-bit ngày nay nó là lỗi thật — <code>cc -Wall</code> trả lời ngay <em>"format specifies type 'unsigned int' but the argument has type 'int *'"</em> và địa chỉ in ra bị cụt thành rác (tôi đo được <code>1839850424</code> cho địa chỉ thật là <code>0x16d06a3c8</code>). Hãy in con trỏ bằng <code>%p</code> kèm ép kiểu <code>(void *)</code>.</p>`],

      [20, 'Exercise 3: Accessing the neighbor',
        `<p class="y-chinh">🎯 <em>"Rewrite, run the program and explain the result."</em> The program declares three neighbouring <code>int</code> variables, takes the address of the middle one, and then walks the pointer up and down to write into the other two — without ever mentioning their names.</p>
<ul>
<li><strong>What the code does, line by line</strong> — <code>n2 = 10, n1 = 6, n0 = 5</code> are printed. Then <code>int* p = &amp;n1;</code>. <code>*p = 9</code> changes <code>n1</code>. <code>p++</code> steps one <code>int</code> forward and <code>*p = 15</code> writes there. Then <code>p--; p--;</code> steps two <code>int</code>s back and <code>*p = -3</code> writes there.</li>
<li><strong>Which variable is "one int forward"?</strong> — that is the whole exercise. I measured the three addresses: <code>&amp;n0 = 0x16ef7e3c0</code>, <code>&amp;n1 = 0x16ef7e3c4</code>, <code>&amp;n2 = 0x16ef7e3c8</code>. They are exactly 4 bytes apart and they ascend in the order <strong>n0 &lt; n1 &lt; n2</strong> — the reverse of the declaration order.</li>
<li><strong>So <code>p++</code> from <code>&amp;n1</code> lands on <code>n2</code></strong>, and <code>p--; p--;</code> from there lands on <code>n0</code>. The three writes therefore hit n1, then n2, then n0.</li>
<li><strong>Why this is a teaching exercise and not a technique</strong> — it works, but the C standard does not promise it. Nothing requires a compiler to put local variables next to each other, in that order, with no padding. Change the optimisation level, add a variable, switch compilers, and the neighbour may move. This is called <em>undefined behaviour</em>.</li>
<li><strong>What it does prove</strong> — that a pointer is just a number, that <code>++</code> on it moves by <code>sizeof(int)</code>, and that C will happily let you write outside the variable you aimed at. Slot 13–15 gives you the legitimate version of exactly this trick: inside a real array, neighbours <em>are</em> guaranteed to be adjacent.</li>
</ul>
<pre><code>/* file pointer_demo.c */
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

int main()
{
    int n2 = 10;
    int n1 = 6;
    int n0 = 5;
    printf("n2=%d, n1=%d, n0=%d\\n", n2, n1, n0);

    int* p = &amp;n1;
    *p = 9;     /* n1 = 9              */
    p++;        /* p tro sang o int ke */
    *p = 15;
    p--;
    p--;        /* lui hai o int       */
    *p = -3;

    printf("n2=%d, n1=%d, n0=%d\\n", n2, n1, n0);
    return 0;
}</code></pre>
<p class="dap-an">✅ Đáp án (compiled with <code>cc -Wall</code>, run for real): the first line prints <code>n2=10, n1=6, n0=5</code> and the second line prints <strong><code>n2=15, n1=9, n0=-3</code></strong>. Explanation: <code>*p = 9</code> hit <code>n1</code>; <code>p++</code> moved 4 bytes up to <code>n2</code> so <code>*p = 15</code> hit <code>n2</code>; two <code>p--</code> moved 8 bytes down to <code>n0</code> so <code>*p = -3</code> hit <code>n0</code>. Not one of the three variables was named after the pointer was created.</p>
<p class="pitfall">⚠️ Two traps. First, the slide's last-but-one line is <code>system("pause")</code> — that is Windows-only; on Linux/macOS drop it (it needs <code>&lt;stdlib.h&gt;</code>, which is why the program includes it). Second, never ship code that relies on this layout: if you genuinely need neighbours, declare an array <code>int n[3];</code> and then <code>p+1</code> is guaranteed by the standard, not by luck.</p>`,
        `<p class="y-chinh">🎯 <em>"Chép lại, chạy chương trình và giải thích kết quả."</em> Chương trình khai ba biến <code>int</code> nằm kề nhau, lấy địa chỉ của biến ở giữa, rồi cho con trỏ đi lên đi xuống để ghi vào hai biến kia — mà không hề gọi tên chúng một lần nào nữa.</p>
<ul>
<li><strong>Mã làm gì, từng dòng</strong> — in ra <code>n2 = 10, n1 = 6, n0 = 5</code>. Rồi <code>int* p = &amp;n1;</code>. <code>*p = 9</code> đổi <code>n1</code>. <code>p++</code> tiến một ô <code>int</code> và <code>*p = 15</code> ghi vào đó. Rồi <code>p--; p--;</code> lùi hai ô <code>int</code> và <code>*p = -3</code> ghi vào chỗ ấy.</li>
<li><strong>"Một ô int phía trước" là biến nào?</strong> — đó mới là toàn bộ bài tập. Tôi đã đo ba địa chỉ thật: <code>&amp;n0 = 0x16ef7e3c0</code>, <code>&amp;n1 = 0x16ef7e3c4</code>, <code>&amp;n2 = 0x16ef7e3c8</code>. Chúng cách nhau đúng 4 byte và tăng dần theo thứ tự <strong>n0 &lt; n1 &lt; n2</strong> — ngược với thứ tự khai báo.</li>
<li><strong>Vậy <code>p++</code> từ <code>&amp;n1</code> rơi trúng <code>n2</code></strong>, và <code>p--; p--;</code> từ đó rơi trúng <code>n0</code>. Ba lệnh ghi lần lượt trúng n1, rồi n2, rồi n0.</li>
<li><strong>Vì sao đây là bài học chứ không phải kỹ thuật</strong> — nó chạy được, nhưng chuẩn C không hề hứa như vậy. Không có điều luật nào bắt trình biên dịch phải đặt biến cục bộ sát nhau, theo thứ tự đó, không chèn byte đệm. Đổi mức tối ưu, thêm một biến, đổi trình biên dịch — hàng xóm có thể dọn đi chỗ khác. Đó gọi là <em>hành vi không xác định</em> (undefined behaviour).</li>
<li><strong>Nhưng nó chứng minh được điều gì</strong> — rằng con trỏ chỉ là một con số, rằng <code>++</code> trên nó dịch đúng <code>sizeof(int)</code>, và rằng C sẵn lòng cho bạn ghi ra ngoài biến mình nhắm tới. Slot 13–15 sẽ cho bạn phiên bản hợp pháp của đúng mẹo này: bên trong một mảng thật, các phần tử kề nhau <em>được bảo đảm</em> là sát nhau.</li>
</ul>
<pre><code>/* file pointer_demo.c */
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

int main()
{
    int n2 = 10;
    int n1 = 6;
    int n0 = 5;
    printf("n2=%d, n1=%d, n0=%d\\n", n2, n1, n0);

    int* p = &amp;n1;
    *p = 9;     /* n1 = 9                */
    p++;        /* p tro sang o int ke   */
    *p = 15;
    p--;
    p--;        /* lui hai o int         */
    *p = -3;

    printf("n2=%d, n1=%d, n0=%d\\n", n2, n1, n0);
    return 0;
}</code></pre>
<p class="dap-an">✅ Đáp án (đã biên dịch bằng <code>cc -Wall</code> và chạy thật): dòng đầu in <code>n2=10, n1=6, n0=5</code>, dòng sau in <strong><code>n2=15, n1=9, n0=-3</code></strong>. Giải thích: <code>*p = 9</code> trúng <code>n1</code>; <code>p++</code> dịch lên 4 byte tới <code>n2</code> nên <code>*p = 15</code> trúng <code>n2</code>; hai lệnh <code>p--</code> dịch xuống 8 byte tới <code>n0</code> nên <code>*p = -3</code> trúng <code>n0</code>. Không một biến nào trong ba biến được gọi tên sau khi con trỏ được tạo ra.</p>
<p class="pitfall">⚠️ Hai cái bẫy. Một, dòng gần cuối trên slide là <code>system("pause")</code> — lệnh này chỉ có trên Windows; trên Linux/macOS hãy bỏ đi (nó cần <code>&lt;stdlib.h&gt;</code>, đó là lý do chương trình include thư viện này). Hai, đừng bao giờ đưa vào sản phẩm đoạn mã dựa vào cách xếp chỗ này: nếu thật sự cần các ô kề nhau thì khai một mảng <code>int n[3];</code>, khi ấy <code>p+1</code> được chuẩn bảo đảm chứ không phải nhờ may mắn.</p>`],

      [21, 'Exercises — Exercise 4 & Exercise 5',
        `<p class="y-chinh">🎯 Two paper exercises with no compiler: given a pointer holding a made-up address, compute <code>p+8</code>, <code>p-3</code> and <code>p++</code>. They are the same question asked twice with a different <code>sizeof</code>, so that you cannot answer by memorising one number.</p>
<ul>
<li><strong>Exercise 4</strong> — <code>long *p;</code>, a <code>long</code> occupies 4 bytes, <code>p</code> holds 1000. Multiply every offset by 4: <code>p+8</code> = 1000 + 8×4 = <strong>1032</strong> · <code>p-3</code> = 1000 − 3×4 = <strong>988</strong> · <code>p++</code> leaves <code>p</code> = <strong>1004</strong>.</li>
<li><strong>Exercise 5</strong> — <code>char *p;</code>, a <code>char</code> occupies 1 byte, <code>p</code> holds 207000. Multiply by 1, i.e. do nothing: <code>p+8</code> = <strong>207008</strong> · <code>p-3</code> = <strong>206997</strong> · <code>p++</code> leaves <code>p</code> = <strong>207001</strong>.</li>
<li><strong>The point of pairing them</strong> — <code>char*</code> is the only pointer type where pointer arithmetic and byte arithmetic coincide. Every other type scales. That is why casting to <code>char*</code> is the standard trick when you really do want to move by bytes.</li>
<li><strong>The hidden part of <code>p++</code></strong> — the exercise asks for "the result of the expression", and for post-increment the <em>expression</em> evaluates to the OLD value while the <em>variable</em> ends up holding the new one. I measured both: <code>p++</code> returns 1000 and afterwards <code>p</code> is 1004. Examiners love this distinction, so state both halves in your answer.</li>
<li><strong>"Suppose that a long occupies 4 bytes"</strong> — that sentence is doing real work. On 64-bit Linux and macOS <code>long</code> is actually 8 bytes, so the same expression would give 1000 + 64 = 1064. Never answer a pointer-arithmetic question without first writing down the <code>sizeof</code> you are assuming.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

/* mo phong dung gia dinh cua de: mot "long" chiem 4 byte */
typedef int long4;

int main(void) {
    long4 *p = (long4 *)1000;      /* Exercise 4 */
    char  *q = (char  *)207000;    /* Exercise 5 */

    printf("p+8 = %lu\\n", (unsigned long)(p + 8));
    printf("p-3 = %lu\\n", (unsigned long)(p - 3));
    p++;
    printf("sau p++, p = %lu\\n", (unsigned long)p);

    printf("q+8 = %lu\\n", (unsigned long)(q + 8));
    printf("q-3 = %lu\\n", (unsigned long)(q - 3));
    q++;
    printf("sau q++, q = %lu\\n", (unsigned long)q);
    return 0;
}</code></pre>
<p class="dap-an">✅ Đáp án — compiled and run: <strong>Exercise 4</strong> → <code>p+8 = 1032</code>, <code>p-3 = 988</code>, <code>p++</code> returns 1000 and leaves <code>p = 1004</code>. <strong>Exercise 5</strong> → <code>q+8 = 207008</code>, <code>q-3 = 206997</code>, <code>q++</code> returns 207000 and leaves <code>q = 207001</code>. Neither pointer was dereferenced, which is why inventing the addresses 1000 and 207000 is harmless here.</p>
<p class="meo">💡 One sentence to carry into the exam: <em>"pointer arithmetic counts elements, not bytes — so multiply every offset by <code>sizeof</code> of the base type."</em> Write the <code>sizeof</code> in the margin before you compute anything, and both exercises collapse into one multiplication.</p>`,
        `<p class="y-chinh">🎯 Hai bài tập làm trên giấy, không cần trình biên dịch: cho một con trỏ đang giữ một địa chỉ giả định, hãy tính <code>p+8</code>, <code>p-3</code> và <code>p++</code>. Thực chất là một câu hỏi hỏi hai lần với hai <code>sizeof</code> khác nhau, để bạn không thể trả lời bằng cách học thuộc một con số.</p>
<ul>
<li><strong>Exercise 4</strong> — <code>long *p;</code>, một <code>long</code> chiếm 4 byte, <code>p</code> đang giữ 1000. Nhân mọi độ dời với 4: <code>p+8</code> = 1000 + 8×4 = <strong>1032</strong> · <code>p-3</code> = 1000 − 3×4 = <strong>988</strong> · <code>p++</code> để lại <code>p</code> = <strong>1004</strong>.</li>
<li><strong>Exercise 5</strong> — <code>char *p;</code>, một <code>char</code> chiếm 1 byte, <code>p</code> đang giữ 207000. Nhân với 1, tức là không làm gì cả: <code>p+8</code> = <strong>207008</strong> · <code>p-3</code> = <strong>206997</strong> · <code>p++</code> để lại <code>p</code> = <strong>207001</strong>.</li>
<li><strong>Vì sao đề ghép hai bài này lại</strong> — <code>char*</code> là kiểu con trỏ duy nhất mà số học con trỏ trùng khít với số học theo byte. Mọi kiểu khác đều bị nhân hệ số. Đó cũng là lý do ép kiểu về <code>char*</code> là mẹo chuẩn khi bạn thật sự muốn dịch theo từng byte.</li>
<li><strong>Phần khuất của <code>p++</code></strong> — đề hỏi "kết quả của biểu thức", mà với phép tăng sau thì <em>biểu thức</em> cho giá trị CŨ còn <em>biến</em> thì kết thúc với giá trị mới. Tôi đã đo cả hai: <code>p++</code> trả về 1000 và sau đó <code>p</code> bằng 1004. Người ra đề rất thích chỗ phân biệt này, nên hãy ghi cả hai nửa vào bài làm.</li>
<li><strong>Câu "Giả sử một long chiếm 4 byte"</strong> — câu ấy đang gánh việc thật. Trên Linux và macOS 64-bit, <code>long</code> chiếm tới 8 byte, nên cùng biểu thức ấy sẽ cho 1000 + 64 = 1064. Đừng bao giờ trả lời một câu hỏi số học con trỏ mà chưa ghi ra <code>sizeof</code> mình đang giả định.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

/* mo phong dung gia dinh cua de: mot "long" chiem 4 byte */
typedef int long4;

int main(void) {
    long4 *p = (long4 *)1000;      /* Exercise 4 */
    char  *q = (char  *)207000;    /* Exercise 5 */

    printf("p+8 = %lu\\n", (unsigned long)(p + 8));
    printf("p-3 = %lu\\n", (unsigned long)(p - 3));
    p++;
    printf("sau p++, p = %lu\\n", (unsigned long)p);

    printf("q+8 = %lu\\n", (unsigned long)(q + 8));
    printf("q-3 = %lu\\n", (unsigned long)(q - 3));
    q++;
    printf("sau q++, q = %lu\\n", (unsigned long)q);
    return 0;
}</code></pre>
<p class="dap-an">✅ Đáp án — đã biên dịch và chạy thật: <strong>Exercise 4</strong> → <code>p+8 = 1032</code>, <code>p-3 = 988</code>, <code>p++</code> trả về 1000 và để lại <code>p = 1004</code>. <strong>Exercise 5</strong> → <code>q+8 = 207008</code>, <code>q-3 = 206997</code>, <code>q++</code> trả về 207000 và để lại <code>q = 207001</code>. Không con trỏ nào bị lấy giá trị (dereference), nên việc bịa ra hai địa chỉ 1000 và 207000 ở đây là vô hại.</p>
<p class="meo">💡 Một câu để mang vào phòng thi: <em>"số học con trỏ đếm theo PHẦN TỬ chứ không theo byte — nên nhân mọi độ dời với <code>sizeof</code> của kiểu cơ sở."</em> Ghi <code>sizeof</code> ra lề giấy trước khi tính, cả hai bài rút gọn thành một phép nhân.</p>`],

      [22, '7 - Pointers as Parameters of a Function',
        `<p class="y-chinh">🎯 The problem statement of the whole section, in one line on the slide: <em>"C passes arguments to parameters <strong>by values only</strong> → C functions can not modify outside data."</em> The slide proves it with a swap function that does not swap.</p>
<ul>
<li><strong>What <code>swap1</code> does</strong> — <code>void swap1(int x, int y)</code> uses a temporary and exchanges <code>x</code> and <code>y</code> correctly. The algorithm is right. The problem is what <code>x</code> and <code>y</code> <em>are</em>.</li>
<li><strong>What the call actually passes</strong> — <code>swap1(a, b)</code> copies the <em>values</em> 5 and 7 into two brand-new local variables <code>x</code> and <code>y</code> that live in <code>swap1</code>'s own stack frame. The picture on the right shows exactly that: the yellow block (the function's frame, holding <code>t = 5</code>, <code>x = 5→7</code>, <code>y = 7→5</code>) sits above the black line, and the blue block below it (<code>a = 5</code>, <code>b = 7</code>) never changes.</li>
<li><strong>The frame dies at <code>return</code></strong> — this is the memory model from slides 4 and 6. Locals live in the Stack segment and are removed when the function completes, so a perfectly correct swap of two copies leaves no trace.</li>
<li><strong>The console on the slide is the evidence</strong> — <code>a=5, b=7</code> before the call and <code>a=5, b=7</code> after it. I compiled and ran it: identical output, both lines the same.</li>
<li><strong>Why this matters beyond swapping</strong> — this is the limitation you already met in Slot 08–09. A C function can return <em>one</em> value with <code>return</code>. Any function that must hand back two or more results, or must edit the caller's variable in place, is blocked by this rule. Slide 9 listed it as the very first reason pointers exist: <em>"to modify outside arguments of a function"</em>.</li>
<li><strong>Do not blame the algorithm</strong> — students often "fix" this by adding a third temporary or reordering the three assignments. No arrangement of assignments to <code>x</code> and <code>y</code> can ever reach <code>a</code> and <code>b</code>, because the function was never told where <code>a</code> and <code>b</code> live.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

/* swap 2 integers */
void swap1(int x, int y) {
    int temp = x;
    x = y;
    y = temp;
}

int main() {
    int a = 5, b = 7;
    printf("a=%d, b=%d\\n", a, b);
    swap1(a, b);                    /* chi gui BAN SAO cua 5 va 7 */
    printf("a=%d, b=%d\\n", a, b);
    return 0;
}</code></pre>
<p class="dap-an">✅ Compiled with <code>cc -Wall</code> and run: the output is <code>a=5, b=7</code> then <code>a=5, b=7</code> — exactly the two identical lines shown in the black console on the slide. The swap happened; it happened to copies; the copies were then thrown away.</p>
<p class="meo">💡 The mental model that makes this obvious forever: a C function call is a <strong>photocopy</strong>, not a loan. <code>swap1</code> got photocopies of <code>a</code> and <code>b</code>, rearranged the photocopies, and shredded them on the way out. Slide 23 fixes it by sending the <em>addresses</em> instead — a photocopy of an address still points at the original.</p>`,
        `<p class="y-chinh">🎯 Phát biểu vấn đề của cả phần này, gói trong một dòng trên slide: <em>"C truyền đối số cho tham số <strong>chỉ theo giá trị</strong> → hàm C không sửa được dữ liệu bên ngoài."</em> Slide chứng minh bằng một hàm hoán đổi… không hoán đổi được gì.</p>
<ul>
<li><strong><code>swap1</code> làm gì</strong> — <code>void swap1(int x, int y)</code> dùng một biến tạm và đổi chỗ <code>x</code> với <code>y</code> hoàn toàn đúng. Thuật toán không sai. Cái sai nằm ở chỗ <code>x</code> và <code>y</code> <em>là cái gì</em>.</li>
<li><strong>Lời gọi thật sự truyền cái gì</strong> — <code>swap1(a, b)</code> chép <em>giá trị</em> 5 và 7 vào hai biến cục bộ hoàn toàn mới là <code>x</code> và <code>y</code>, sống trong khung ngăn xếp của riêng <code>swap1</code>. Hình bên phải vẽ đúng chuyện đó: khối vàng (khung của hàm, chứa <code>t = 5</code>, <code>x = 5→7</code>, <code>y = 7→5</code>) nằm phía trên vạch đen, còn khối xanh phía dưới (<code>a = 5</code>, <code>b = 7</code>) không hề đổi.</li>
<li><strong>Khung ấy chết ngay khi <code>return</code></strong> — đây chính là mô hình bộ nhớ ở slide 4 và slide 6. Biến cục bộ sống trong Stack segment và bị xoá khi hàm kết thúc, nên một phép hoán đổi đúng tuyệt đối trên hai bản sao chẳng để lại dấu vết nào.</li>
<li><strong>Cửa sổ console trên slide là bằng chứng</strong> — <code>a=5, b=7</code> trước lời gọi và <code>a=5, b=7</code> sau lời gọi. Tôi đã biên dịch và chạy thật: kết quả y hệt, hai dòng như nhau.</li>
<li><strong>Vì sao chuyện này lớn hơn bài hoán đổi</strong> — đây chính là giới hạn bạn đã gặp ở Slot 08–09. Một hàm C chỉ trả về được <em>một</em> giá trị bằng <code>return</code>. Mọi hàm cần trả lại hai kết quả trở lên, hoặc cần sửa thẳng biến của người gọi, đều bị luật này chặn. Slide 9 đã liệt kê nó là lý do đầu tiên khiến con trỏ tồn tại: <em>"để sửa các đối số bên ngoài của hàm"</em>.</li>
<li><strong>Đừng đổ tại thuật toán</strong> — sinh viên hay "sửa" bằng cách thêm biến tạm thứ ba hoặc đảo thứ tự ba phép gán. Không cách sắp xếp phép gán nào lên <code>x</code> và <code>y</code> chạm được tới <code>a</code> và <code>b</code>, vì hàm chưa bao giờ được cho biết <code>a</code> và <code>b</code> nằm ở đâu.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

/* swap 2 integers */
void swap1(int x, int y) {
    int temp = x;
    x = y;
    y = temp;
}

int main() {
    int a = 5, b = 7;
    printf("a=%d, b=%d\\n", a, b);
    swap1(a, b);                    /* chi gui BAN SAO cua 5 va 7 */
    printf("a=%d, b=%d\\n", a, b);
    return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch bằng <code>cc -Wall</code> và chạy thật: kết quả là <code>a=5, b=7</code> rồi <code>a=5, b=7</code> — đúng hai dòng giống hệt nhau như trong khung console đen trên slide. Phép hoán đổi có xảy ra; nó xảy ra trên bản sao; rồi bản sao bị vứt đi lúc hàm kết thúc.</p>
<p class="meo">💡 Hình dung giúp bạn nhớ mãi: một lời gọi hàm trong C là một lần <strong>photocopy</strong>, không phải cho mượn. <code>swap1</code> nhận bản photo của <code>a</code> và <code>b</code>, sắp xếp lại mấy bản photo, rồi huỷ chúng lúc đi ra. Slide 23 chữa bằng cách gửi <em>địa chỉ</em> thay vì giá trị — bản photo của một địa chỉ thì vẫn trỏ về đúng bản gốc.</p>`],

      [23, '7 - Pointers as Parameters of a Function (cont.)',
        `<p class="y-chinh">🎯 The fix, in the slide's own words: <em>"Solution: Use pointer arguments, we can modify outside values."</em> Two boxes are highlighted in the code — the parameter list <code>(int *px, int *py)</code> and the call <code>swap2(&amp;a, &amp;b)</code>. Those two edits are the entire difference from slide 22.</p>
<ul>
<li><strong>The parameters are still copied</strong> — C did not change its rule. What changed is <em>what</em> is being copied: an address. <code>px</code> is a copy of the address 1000, <code>py</code> a copy of 996, and a copy of a street address still leads to the same house.</li>
<li><strong>Read the three lines with the slide's own comments</strong> — <code>int temp = *px;</code> (<em>t = value at px</em>) · <code>*px = *py;</code> (<em>value at px = value at py</em>) · <code>*py = temp;</code> (<em>value at py = temp</em>). Every single statement goes through <code>*</code>. Drop one star and you are back to swapping the local copies of the addresses, which compiles and does nothing visible.</li>
<li><strong>The diagram tells the story</strong> — the yellow frame at the top holds <code>t = 5</code>, <code>px : 1000</code>, <code>py : 996</code>; the two red arrows run down out of the frame into the green boxes where <code>a = 5 → 7</code> and <code>b = 7 → 5</code>. The arrows crossing the line is the picture of "modifying outside data".</li>
<li><strong>The call site is half the fix</strong> — <code>swap2(&amp;a, &amp;b)</code>. Forgetting the two <code>&amp;</code> is the most common error here, and on a modern compiler it is caught: passing <code>int</code> where <code>int *</code> is expected is a type error, not a silent bug. Be glad.</li>
<li><strong>This is "pass by reference", emulated</strong> — C has no reference parameters (C++ and Java do, in their own ways). C gives you exactly one mechanism to reach outside a function: pass an address and dereference it. Every C API that "returns" something through a parameter — <code>scanf("%d", &amp;n)</code> is the one you have used a hundred times already — is this same pattern.</li>
<li><strong><code>scanf</code> finally makes sense</strong> — you have been writing <code>&amp;n</code> since Slot 02 without being told why. Now you know: <code>scanf</code> must write into <em>your</em> variable, so it needs the address of <code>n</code>, not the value of <code>n</code>. That is also why <code>scanf("%s", str)</code> has no <code>&amp;</code> — a string name is already an address (Slot 16–18).</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

/* swap 2 integers */
void swap2(int *px, int *py) {
    int temp = *px;   /* t = gia tri tai px         */
    *px = *py;        /* gia tri tai px = tai py    */
    *py = temp;       /* gia tri tai py = temp      */
}

int main() {
    int a = 5, b = 7;
    printf("a=%d, b=%d\\n", a, b);
    swap2(&amp;a, &amp;b);                 /* gui DIA CHI, khong gui gia tri */
    printf("a=%d, b=%d\\n", a, b);
    return 0;
}</code></pre>
<p class="dap-an">✅ Compiled with <code>cc -Wall</code> and run: <code>a=5, b=7</code> then <strong><code>a=7, b=5</code></strong> — exactly the console shown on the slide, and exactly the opposite of slide 22's result. Same algorithm, same number of lines; the only change is one <code>*</code> per parameter and one <code>&amp;</code> per argument.</p>
<p class="pitfall">⚠️ Three ways to break <code>swap2</code>, all of which compile on an older compiler: (1) <code>int temp = px;</code> instead of <code>*px</code> — you swap addresses locally, nothing outside changes; (2) <code>px = py;</code> instead of <code>*px = *py;</code> — same silent failure; (3) calling <code>swap2(a, b)</code> without the <code>&amp;</code> — the integers 5 and 7 are then treated as addresses and the program crashes. Rule of thumb: inside such a function, <strong>every</strong> use of the parameter should carry a <code>*</code>.</p>`,
        `<p class="y-chinh">🎯 Cách chữa, đúng lời slide: <em>"Giải pháp: dùng đối số con trỏ, ta sửa được giá trị bên ngoài."</em> Trên mã có hai khung được tô đậm — danh sách tham số <code>(int *px, int *py)</code> và lời gọi <code>swap2(&amp;a, &amp;b)</code>. Hai chỗ sửa ấy là toàn bộ khác biệt so với slide 22.</p>
<ul>
<li><strong>Tham số VẪN bị chép</strong> — C không đổi luật của nó. Cái đổi là <em>thứ</em> bị chép: một địa chỉ. <code>px</code> là bản sao của địa chỉ 1000, <code>py</code> là bản sao của 996, mà bản sao của một địa chỉ nhà thì vẫn dẫn tới đúng ngôi nhà đó.</li>
<li><strong>Đọc ba dòng kèm chú thích của chính slide</strong> — <code>int temp = *px;</code> (<em>t = giá trị tại px</em>) · <code>*px = *py;</code> (<em>giá trị tại px = giá trị tại py</em>) · <code>*py = temp;</code> (<em>giá trị tại py = temp</em>). Từng câu lệnh một đều đi qua dấu <code>*</code>. Rụng một dấu sao là bạn quay về hoán đổi hai bản sao địa chỉ — vẫn biên dịch được, và không thấy gì đổi.</li>
<li><strong>Hình vẽ kể trọn câu chuyện</strong> — khung vàng phía trên giữ <code>t = 5</code>, <code>px : 1000</code>, <code>py : 996</code>; hai mũi tên đỏ chạy xuống, xuyên ra khỏi khung, vào hai ô xanh nơi <code>a = 5 → 7</code> và <code>b = 7 → 5</code>. Mũi tên vượt qua vạch ngăn chính là hình ảnh của "sửa được dữ liệu bên ngoài".</li>
<li><strong>Chỗ gọi hàm là một nửa cách chữa</strong> — <code>swap2(&amp;a, &amp;b)</code>. Quên hai dấu <code>&amp;</code> là lỗi hay gặp nhất ở đây, và trên trình biên dịch hiện đại thì lỗi ấy bị bắt: truyền <code>int</code> vào chỗ cần <code>int *</code> là lỗi kiểu, không phải lỗi âm thầm. Đáng mừng.</li>
<li><strong>Đây chính là "truyền theo tham chiếu", mô phỏng lại</strong> — C không có tham số tham chiếu (C++ và Java có, theo cách riêng của chúng). C cho bạn đúng một cơ chế để với ra ngoài hàm: truyền địa chỉ rồi lấy giá trị qua nó. Mọi API C "trả về" thứ gì đó qua tham số — <code>scanf("%d", &amp;n)</code> là cái bạn đã gõ cả trăm lần — đều là đúng khuôn mẫu này.</li>
<li><strong>Giờ thì <code>scanf</code> mới có nghĩa</strong> — bạn đã viết <code>&amp;n</code> từ Slot 02 mà chưa ai giải thích vì sao. Bây giờ thì rõ: <code>scanf</code> phải ghi vào biến <em>của bạn</em>, nên nó cần địa chỉ của <code>n</code> chứ không cần giá trị của <code>n</code>. Đó cũng là lý do <code>scanf("%s", str)</code> không có dấu <code>&amp;</code> — tên một chuỗi vốn đã là một địa chỉ rồi (Slot 16–18).</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

/* swap 2 integers */
void swap2(int *px, int *py) {
    int temp = *px;   /* t = gia tri tai px         */
    *px = *py;        /* gia tri tai px = tai py    */
    *py = temp;       /* gia tri tai py = temp      */
}

int main() {
    int a = 5, b = 7;
    printf("a=%d, b=%d\\n", a, b);
    swap2(&amp;a, &amp;b);                 /* gui DIA CHI, khong gui gia tri */
    printf("a=%d, b=%d\\n", a, b);
    return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch bằng <code>cc -Wall</code> và chạy thật: <code>a=5, b=7</code> rồi <strong><code>a=7, b=5</code></strong> — đúng khung console in trên slide, và ngược hẳn kết quả của slide 22. Cùng thuật toán, cùng số dòng; khác biệt duy nhất là thêm một dấu <code>*</code> cho mỗi tham số và một dấu <code>&amp;</code> cho mỗi đối số.</p>
<p class="pitfall">⚠️ Ba cách làm hỏng <code>swap2</code>, cả ba đều biên dịch trót lọt trên trình biên dịch cũ: (1) viết <code>int temp = px;</code> thay vì <code>*px</code> — bạn chỉ hoán đổi địa chỉ trong nội bộ hàm, bên ngoài không đổi; (2) viết <code>px = py;</code> thay vì <code>*px = *py;</code> — cũng hỏng âm thầm như vậy; (3) gọi <code>swap2(a, b)</code> mà quên <code>&amp;</code> — hai số 5 và 7 bị coi là địa chỉ và chương trình sập. Quy tắc bỏ túi: bên trong loại hàm này, <strong>mọi</strong> lần dùng tham số đều phải có dấu <code>*</code> đi kèm.</p>`],

      [24, '8 - Dynamic Allocated Data',
        `<p class="y-chinh">🎯 The section that finally opens the Heap. Until now every variable you wrote existed because you typed its name and its size at compile time. Dynamic allocation lets the program decide, <em>while running</em>, how much memory it needs — and the four functions that do it all live in <code>&lt;stdlib.h&gt;</code>.</p>
<ul>
<li><strong>Why it exists, in the slide's words</strong> — <em>"It is particularly useful when the size of the data is not known at compile time."</em> You cannot write <code>int arr[n];</code> in C89 when <code>n</code> comes from <code>scanf</code>. You can write <code>malloc(n * sizeof(int))</code>.</li>
<li><strong>The four prototypes, and what to notice in each</strong> — <code>void* malloc(size_t numBytes)</code> takes <em>bytes</em> · <code>void* calloc(size_t numberOfItem, size_t bytesPerItem)</code> takes <em>two</em> numbers and multiplies them itself · <code>void* realloc(void* curPointer, size_t newNumBytes)</code> takes an existing block plus a new size · <code>void free(void* willBeDeletedPointer)</code> returns a block and is the only one of the four that returns nothing.</li>
<li><strong><code>size_t</code></strong> — the slide defines it as <em>"another name of the int type, used in case of memory allocation managing"</em>. More precisely it is an unsigned integer type big enough to hold the size of any object. Treat it as "a count of bytes that can never be negative"; <code>sizeof</code> produces one.</li>
<li><strong><code>void*</code> and why you must cast</strong> — the slide: <em>"void is the general datatype which means that the data type is not determined yet. So, user must give an explicit casting when it is used."</em> <code>malloc</code> has no idea whether you want ints or doubles; it hands back a raw address, and <code>(int*)</code> tells the compiler how to interpret it — which also fixes what <code>p+1</code> will mean (slide 19).</li>
<li><strong>Dynamic memory is managed via pointers</strong> — and only via pointers. A heap block has no name. The only thing standing between you and the block is the pointer variable holding its address, which is the whole reason memory leaks are possible (slide 33).</li>
<li><strong>Where this sits in the memory map</strong> — go back to slides 4 and 6: Code segment, Data segment (globals), Stack segment (locals), and the Heap. This section is about the fourth one, and the Heap is the only segment whose lifetime <em>you</em> control.</li>
</ul>
<table>
<tr><th>Function</th><th>Arguments</th><th>Initialises memory?</th><th>Returns</th></tr>
<tr><td><code>malloc</code></td><td>total bytes</td><td>No — garbage values</td><td><code>void*</code>, or <code>NULL</code> on failure</td></tr>
<tr><td><code>calloc</code></td><td>count, size of one item</td><td>Yes — all bytes zero</td><td><code>void*</code>, or <code>NULL</code> on failure</td></tr>
<tr><td><code>realloc</code></td><td>old pointer, new total bytes</td><td>Only the old part is preserved</td><td><code>void*</code> (may be a NEW address), or <code>NULL</code></td></tr>
<tr><td><code>free</code></td><td>pointer to release</td><td>—</td><td>nothing (<code>void</code>)</td></tr>
</table>
<p class="meo">💡 Learn the four as one sentence: <em>malloc asks for bytes, calloc asks for items and cleans them, realloc resizes and may move, free gives it back.</em> Every exam question about this section is one of those four verbs.</p>`,
        `<p class="y-chinh">🎯 Phần học mở ra vùng Heap. Tới giờ, mọi biến bạn viết tồn tại được là vì bạn đã gõ tên và kích thước của nó ngay lúc biên dịch. Cấp phát động cho phép chương trình tự quyết định, <em>trong lúc đang chạy</em>, rằng nó cần bao nhiêu bộ nhớ — và bốn hàm làm việc đó đều nằm trong <code>&lt;stdlib.h&gt;</code>.</p>
<ul>
<li><strong>Vì sao cần nó, theo đúng lời slide</strong> — <em>"Đặc biệt hữu ích khi kích thước dữ liệu chưa biết được lúc biên dịch."</em> Trong C89 bạn không thể viết <code>int arr[n];</code> khi <code>n</code> lấy từ <code>scanf</code>. Nhưng bạn viết được <code>malloc(n * sizeof(int))</code>.</li>
<li><strong>Bốn nguyên mẫu, và điểm cần để ý ở từng cái</strong> — <code>void* malloc(size_t numBytes)</code> nhận <em>số byte</em> · <code>void* calloc(size_t numberOfItem, size_t bytesPerItem)</code> nhận <em>hai</em> số rồi tự nhân · <code>void* realloc(void* curPointer, size_t newNumBytes)</code> nhận khối đang có kèm kích thước mới · <code>void free(void* willBeDeletedPointer)</code> trả khối về và là hàm duy nhất trong bốn hàm không trả lại gì.</li>
<li><strong><code>size_t</code></strong> — slide định nghĩa là <em>"một tên khác của kiểu int, dùng khi quản lý cấp phát bộ nhớ"</em>. Chính xác hơn: đó là một kiểu nguyên KHÔNG DẤU, đủ lớn để chứa kích thước của mọi đối tượng. Cứ hiểu là "số đếm byte, không bao giờ âm"; <code>sizeof</code> trả về đúng kiểu này.</li>
<li><strong><code>void*</code> và vì sao bắt buộc phải ép kiểu</strong> — slide viết: <em>"void là kiểu dữ liệu tổng quát, nghĩa là kiểu chưa được xác định. Nên người dùng phải ép kiểu tường minh khi sử dụng."</em> <code>malloc</code> không biết bạn định để int hay double; nó trả về một địa chỉ trần, còn <code>(int*)</code> nói cho trình biên dịch biết phải hiểu địa chỉ ấy thế nào — và cũng chốt luôn ý nghĩa của <code>p+1</code> sau này (slide 19).</li>
<li><strong>Bộ nhớ động được quản lý QUA con trỏ</strong> — và chỉ qua con trỏ. Một khối trên heap không có tên. Thứ duy nhất nối bạn với khối ấy là biến con trỏ đang giữ địa chỉ của nó, và đó chính là lý do rò rỉ bộ nhớ có thể xảy ra (slide 33).</li>
<li><strong>Chỗ đứng của nó trong bản đồ bộ nhớ</strong> — quay lại slide 4 và 6: Code segment, Data segment (biến toàn cục), Stack segment (biến cục bộ), và Heap. Phần này nói về cái thứ tư, và Heap là vùng duy nhất mà tuổi thọ do <em>bạn</em> điều khiển.</li>
</ul>
<table>
<tr><th>Hàm</th><th>Tham số</th><th>Có khởi tạo vùng nhớ?</th><th>Trả về</th></tr>
<tr><td><code>malloc</code></td><td>tổng số byte</td><td>KHÔNG — toàn giá trị rác</td><td><code>void*</code>, hoặc <code>NULL</code> nếu thất bại</td></tr>
<tr><td><code>calloc</code></td><td>số phần tử, cỡ một phần tử</td><td>CÓ — mọi byte đặt về 0</td><td><code>void*</code>, hoặc <code>NULL</code> nếu thất bại</td></tr>
<tr><td><code>realloc</code></td><td>con trỏ cũ, tổng byte mới</td><td>Chỉ giữ lại phần dữ liệu cũ</td><td><code>void*</code> (có thể là địa chỉ MỚI), hoặc <code>NULL</code></td></tr>
<tr><td><code>free</code></td><td>con trỏ cần thu hồi</td><td>—</td><td>không trả gì (<code>void</code>)</td></tr>
</table>
<p class="meo">💡 Học bốn hàm bằng một câu: <em>malloc xin theo byte, calloc xin theo phần tử và dọn sạch, realloc đổi cỡ và có thể DỜI chỗ, free trả lại.</em> Mọi câu hỏi thi về phần này đều rơi vào một trong bốn động từ ấy.</p>`],

      [25, 'Dynamic Allocated Data (cont.)',
        `<p class="y-chinh">🎯 The smallest complete life cycle of a heap block, in four lines: <code>int* p = (int*) malloc(sizeof(int));</code> · <code>*p = 2;</code> · <code>….</code> · <code>free(p);</code>. Everything else in this section is a variation on those four lines.</p>
<ul>
<li><strong>Read the first line right to left</strong> — <code>sizeof(int)</code> asks "how many bytes is one int?" (4 on almost every machine you will meet) · <code>malloc</code> reserves that many bytes on the Heap and returns their address as <code>void*</code> · <code>(int*)</code> reinterprets that address as "address of an int" · and the result is stored in <code>p</code>.</li>
<li><strong>Where the two things live</strong> — the diagram on the right is the point of the slide. The pointer variable <code>p</code> itself is a local, so it sits in the <strong>Stack segment</strong>; the 4 bytes it points to sit in the <strong>Heap</strong>, drawn in red. Two different segments, one arrow between them.</li>
<li><strong>The block has no name</strong> — <code>*p = 2;</code> is the only way to reach it. There is no identifier you could write instead. That is why losing <code>p</code> loses the block forever.</li>
<li><strong>The <code>….</code> line is where your program happens</strong> — read it, print it, pass the pointer to a function, store it in a structure. The block stays alive across all of it, including across function returns — unlike a local, which dies with its frame (slide 22).</li>
<li><strong>Stack versus Heap, the distinction the exam asks for</strong> — a local variable is created by the compiler, destroyed automatically when the function completes, and sized at compile time. A heap block is created by <em>your</em> call, destroyed only by <em>your</em> <code>free</code>, and can be sized at run time. Automatic versus manual.</li>
<li><strong><code>free(p)</code> does not erase <code>p</code></strong> — it returns the <em>block</em> to the system. The variable <code>p</code> still holds the same number afterwards, now pointing at memory you no longer own. Slide 29 and slide 33 come back to this; the cure is one extra line, <code>p = NULL;</code>.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

int main(void) {
    int *p = (int *) malloc(sizeof(int));   /* xin 4 byte tren HEAP     */
    if (p == NULL) {                        /* luon kiem tra            */
        printf("Memory allocation failed\\n");
        return 1;
    }

    *p = 2;                                 /* khoi duy nhat co the toi */
    printf("*p = %d, dia chi khoi = %p, dia chi cua p = %p\\n",
           *p, (void *)p, (void *)&amp;p);

    free(p);                                /* tra khoi ve he thong     */
    p = NULL;                               /* tranh con tro treo       */
    return 0;
}</code></pre>
<p class="dap-an">✅ Run for real: the block address printed by <code>p</code> and the address of the variable <code>p</code> itself are wildly far apart — on my machine the heap block was around <code>0x1036220d0</code> while <code>&amp;p</code> was around <code>0x16d06a3c0</code>. That gap is the picture on the slide: the pointer is on the Stack, the data is on the Heap.</p>
<p class="pitfall">⚠️ <code>sizeof(int)</code>, never the literal <code>4</code>. Hard-coding 4 works on your laptop and silently allocates half the memory you need on a machine where the type is bigger. The habit to build: <code>malloc(n * sizeof(&lt;type&gt;))</code>, with the type spelled out, always.</p>`,
        `<p class="y-chinh">🎯 Vòng đời đầy đủ ngắn nhất của một khối heap, gói trong bốn dòng: <code>int* p = (int*) malloc(sizeof(int));</code> · <code>*p = 2;</code> · <code>….</code> · <code>free(p);</code>. Mọi thứ còn lại trong phần này chỉ là biến thể của bốn dòng đó.</p>
<ul>
<li><strong>Đọc dòng đầu từ phải sang trái</strong> — <code>sizeof(int)</code> hỏi "một int chiếm bao nhiêu byte?" (4 trên hầu hết máy bạn gặp) · <code>malloc</code> giữ chỗ chừng ấy byte trên Heap và trả về địa chỉ dạng <code>void*</code> · <code>(int*)</code> diễn giải lại địa chỉ đó thành "địa chỉ của một int" · và kết quả được cất vào <code>p</code>.</li>
<li><strong>Hai thứ nằm ở hai nơi</strong> — hình bên phải chính là trọng tâm của slide. Bản thân biến con trỏ <code>p</code> là biến cục bộ nên nó nằm trong <strong>Stack segment</strong>; còn 4 byte mà nó trỏ tới nằm trong <strong>Heap</strong>, vẽ màu đỏ. Hai vùng khác nhau, một mũi tên nối giữa.</li>
<li><strong>Khối nhớ đó KHÔNG có tên</strong> — <code>*p = 2;</code> là đường duy nhất tới nó. Không có định danh nào để bạn viết thay vào. Đó là lý do mất <code>p</code> là mất khối nhớ vĩnh viễn.</li>
<li><strong>Dòng <code>….</code> mới là nơi chương trình của bạn diễn ra</strong> — đọc nó, in nó, truyền con trỏ vào một hàm, cất nó vào một cấu trúc. Khối nhớ vẫn sống suốt thời gian ấy, kể cả khi hàm đã return — khác hẳn biến cục bộ, thứ chết theo khung của nó (slide 22).</li>
<li><strong>Stack với Heap, đúng chỗ đề thi hay hỏi</strong> — biến cục bộ do trình biên dịch tạo ra, tự huỷ khi hàm kết thúc, và được định cỡ lúc biên dịch. Khối heap do <em>lời gọi của bạn</em> tạo ra, chỉ bị huỷ bởi <em>lệnh <code>free</code> của bạn</em>, và có thể định cỡ lúc chạy. Tự động đối lại thủ công.</li>
<li><strong><code>free(p)</code> KHÔNG xoá <code>p</code></strong> — nó trả <em>khối nhớ</em> về cho hệ thống. Biến <code>p</code> sau đó vẫn giữ nguyên con số cũ, giờ trỏ vào vùng nhớ bạn không còn sở hữu. Slide 29 và slide 33 sẽ quay lại chuyện này; thuốc chữa là thêm một dòng: <code>p = NULL;</code>.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

int main(void) {
    int *p = (int *) malloc(sizeof(int));   /* xin 4 byte tren HEAP      */
    if (p == NULL) {                        /* luon luon kiem tra        */
        printf("Memory allocation failed\\n");
        return 1;
    }

    *p = 2;                                 /* duong duy nhat toi khoi   */
    printf("*p = %d, dia chi khoi = %p, dia chi cua p = %p\\n",
           *p, (void *)p, (void *)&amp;p);

    free(p);                                /* tra khoi ve he thong      */
    p = NULL;                               /* tranh con tro treo        */
    return 0;
}</code></pre>
<p class="dap-an">✅ Chạy thật: địa chỉ khối nhớ do <code>p</code> in ra và địa chỉ của chính biến <code>p</code> cách nhau rất xa — trên máy tôi khối heap nằm quanh <code>0x1036220d0</code> còn <code>&amp;p</code> nằm quanh <code>0x16d06a3c0</code>. Đúng khoảng cách ấy là hình vẽ trên slide: con trỏ ở Stack, dữ liệu ở Heap.</p>
<p class="pitfall">⚠️ Luôn viết <code>sizeof(int)</code>, đừng viết số <code>4</code> cứng. Gõ số 4 thì chạy được trên máy bạn, nhưng trên máy mà kiểu ấy lớn hơn thì bạn âm thầm cấp phát chỉ nửa số byte cần dùng. Thói quen cần dựng: luôn viết <code>malloc(n * sizeof(&lt;kiểu&gt;))</code>, ghi rõ tên kiểu ra.</p>`],

      [26, 'malloc (Memory Allocation)',
        `<p class="y-chinh">🎯 <em>"Allocates a specified number of bytes and returns a pointer to the allocated memory. <strong>The memory is uninitialized, meaning it may contain garbage values.</strong>"</em> That second sentence is the whole difference between <code>malloc</code> and <code>calloc</code>, and it is what the exam asks about.</p>
<ul>
<li><strong>The signature</strong> — <code>void *malloc(size_t size);</code>. One argument, and it is a count of <em>bytes</em>, not of items. That is why the example on the slide writes <code>malloc(5 * sizeof(int))</code>: five items × four bytes = the twenty bytes <code>malloc</code> actually wants.</li>
<li><strong>Uninitialised means anything</strong> — the bytes you get back are whatever the previous owner left there. Printing <code>arr[0]</code> before writing to it is undefined behaviour; sometimes it is zero (which is worse, because your buggy program appears to work), sometimes it is a huge number.</li>
<li><strong>The <code>if (arr == NULL)</code> in the example is not decoration</strong> — <code>malloc</code> returns <code>NULL</code> when the request cannot be satisfied. Every allocation in this slide deck is followed by the check, and slide 33 makes it the first rule.</li>
<li><strong>Read the slide's console output</strong> — <code>Address of arr: 7345152</code> and <code>Size of memory of arr: 20 bytes</code>. Note that the "size" line is not asking <code>malloc</code> anything: it is just <code>5 * sizeof(int)</code> printed back. <strong>There is no way to ask a pointer how big its block is</strong> — you must remember the size yourself.</li>
<li><strong><code>sizeof(arr)</code> would not help</strong> — <code>arr</code> is a pointer, so <code>sizeof(arr)</code> gives you the size of the pointer (8 bytes on 64-bit), not of the 20-byte block. This is one of the most common misunderstandings in the whole course.</li>
<li><strong>Why cast the result</strong> — <code>(int *)</code>. In C the cast is optional (a <code>void*</code> converts implicitly), but this course, this deck, and every C++ compiler require it, so write it. It also documents what the block is for.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

int main() {
    /* Allocates memory for an array of 5 integers */
    int *arr = (int *)malloc(5 * sizeof(int));
    if (arr == NULL) {
        printf("Memory allocation failed\\n");
    } else {
        printf("Address of arr: %p\\n", (void *)arr);
        printf("Size of memory of arr: %lu bytes\\n",
               (unsigned long)(5 * sizeof(int)));
        printf("arr[0] = %d (chua ghi gi -> gia tri RAC)\\n", arr[0]);
        free(arr);
    }
    return 0;
}</code></pre>
<p class="dap-an">✅ Compiled with <code>cc -Wall</code> and run: <code>Size of memory of arr: 20 bytes</code> — matching the slide exactly. The address differs every run (mine was <code>0x103146050</code>), which is normal. On this run <code>arr[0]</code> happened to read back as <code>0</code>, but that is luck from a freshly-mapped page, <strong>not</strong> a guarantee: the slide's warning stands, <code>malloc</code> promises nothing about the contents.</p>
<p class="pitfall">⚠️ The classic beginner bug is <code>malloc(5)</code> when you meant five integers. That reserves 5 bytes, you then write 20, and you have corrupted the heap — with no error message at all, until the program crashes somewhere unrelated much later. Always spell it <code>n * sizeof(type)</code>.</p>`,
        `<p class="y-chinh">🎯 <em>"Cấp phát một số byte được chỉ định và trả về con trỏ tới vùng nhớ đó. <strong>Vùng nhớ KHÔNG được khởi tạo, nghĩa là nó có thể chứa giá trị rác.</strong>"</em> Câu thứ hai chính là toàn bộ khác biệt giữa <code>malloc</code> và <code>calloc</code>, và cũng là chỗ đề thi hay hỏi.</p>
<ul>
<li><strong>Nguyên mẫu</strong> — <code>void *malloc(size_t size);</code>. Một tham số duy nhất, và nó đếm theo <em>byte</em> chứ không theo phần tử. Đó là lý do ví dụ trên slide viết <code>malloc(5 * sizeof(int))</code>: năm phần tử × bốn byte = đúng hai mươi byte mà <code>malloc</code> cần nghe.</li>
<li><strong>"Không khởi tạo" nghĩa là có thể là bất cứ thứ gì</strong> — mấy byte bạn nhận về đang giữ những gì chủ trước để lại. In <code>arr[0]</code> khi chưa ghi vào là hành vi không xác định; có lúc nó ra 0 (còn tệ hơn, vì chương trình lỗi của bạn trông như chạy đúng), có lúc nó ra một con số khổng lồ.</li>
<li><strong>Dòng <code>if (arr == NULL)</code> trong ví dụ không phải để trang trí</strong> — <code>malloc</code> trả về <code>NULL</code> khi không đáp ứng được yêu cầu. Mọi lần cấp phát trong bộ slide này đều có phép kiểm đi kèm, và slide 33 đặt nó làm quy tắc số một.</li>
<li><strong>Đọc kỹ cửa sổ kết quả trên slide</strong> — <code>Address of arr: 7345152</code> và <code>Size of memory of arr: 20 bytes</code>. Để ý dòng "size" không hề hỏi <code>malloc</code> điều gì: nó chỉ in lại <code>5 * sizeof(int)</code>. <strong>Không có cách nào hỏi một con trỏ xem khối của nó to bao nhiêu</strong> — bạn phải tự nhớ lấy con số ấy.</li>
<li><strong><code>sizeof(arr)</code> không cứu được</strong> — <code>arr</code> là con trỏ, nên <code>sizeof(arr)</code> cho ra kích thước của con trỏ (8 byte trên máy 64-bit), chứ không phải 20 byte của khối. Đây là một trong những hiểu nhầm phổ biến nhất của cả môn học.</li>
<li><strong>Vì sao phải ép kiểu kết quả</strong> — <code>(int *)</code>. Trong C thì ép kiểu là tuỳ chọn (một <code>void*</code> tự chuyển ngầm được), nhưng môn này, bộ slide này, và mọi trình biên dịch C++ đều đòi, nên cứ viết. Nó còn tự ghi chú giùm bạn rằng khối nhớ ấy dùng cho kiểu gì.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

int main() {
    /* Cap phat vung nho cho mang 5 so nguyen */
    int *arr = (int *)malloc(5 * sizeof(int));
    if (arr == NULL) {
        printf("Memory allocation failed\\n");
    } else {
        printf("Address of arr: %p\\n", (void *)arr);
        printf("Size of memory of arr: %lu bytes\\n",
               (unsigned long)(5 * sizeof(int)));
        printf("arr[0] = %d (chua ghi gi -> gia tri RAC)\\n", arr[0]);
        free(arr);
    }
    return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch bằng <code>cc -Wall</code> và chạy thật: <code>Size of memory of arr: 20 bytes</code> — khớp đúng slide. Địa chỉ thì mỗi lần chạy một khác (lần của tôi là <code>0x103146050</code>), chuyện đó bình thường. Lần chạy này <code>arr[0]</code> tình cờ đọc ra <code>0</code>, nhưng đó là may mắn của một trang nhớ vừa được cấp mới, <strong>không</strong> phải bảo đảm: cảnh báo của slide vẫn đúng nguyên, <code>malloc</code> không hứa gì về nội dung.</p>
<p class="pitfall">⚠️ Lỗi kinh điển của người mới là viết <code>malloc(5)</code> khi ý muốn nói năm số nguyên. Lệnh đó giữ 5 byte, rồi bạn ghi 20 byte vào, và bạn vừa phá hỏng heap — không một thông báo lỗi nào, cho tới khi chương trình sập ở một chỗ chẳng liên quan gì, rất lâu sau đó. Luôn viết đủ <code>n * sizeof(kiểu)</code>.</p>`],

      [27, 'calloc (Contiguous Allocation)',
        `<p class="y-chinh">🎯 One sentence, two promises: <em>"Allocates memory for an array of elements <strong>and initializes all bytes to zero</strong>."</em> <code>calloc</code> is <code>malloc</code> plus a guaranteed clean slate — and it counts in items, not bytes.</p>
<ul>
<li><strong>Two arguments, not one</strong> — <code>void *calloc(size_t num, size_t size);</code>. The slide's example is <code>calloc(5, sizeof(int))</code>: "five things, each four bytes". Compare with <code>malloc(5 * sizeof(int))</code> on slide 26 — same 20 bytes, different spelling, and the comma is the thing to remember.</li>
<li><strong>The zeroing is the reason to choose it</strong> — after <code>calloc</code>, every <code>int</code> in the block reads back as 0, every <code>double</code> as 0.0, every <code>char</code> as <code>'\\0'</code>, every pointer as <code>NULL</code> on normal machines. If your algorithm starts by clearing an array (counters, histograms, sums), <code>calloc</code> has already done it.</li>
<li><strong>"Contiguous" in the title</strong> — the block is a single unbroken run of bytes, which is exactly what makes <code>arr[0] … arr[4]</code> legal and what makes pointer arithmetic (slide 19) walk correctly across it. <code>malloc</code> gives you a contiguous block too; the name is historical.</li>
<li><strong>The rest of the example is identical to slide 26</strong> — the <code>NULL</code> check, the two <code>printf</code>s, the same reported <code>20 bytes</code>. That is deliberate: the deck wants you to see that only the allocation line changed.</li>
<li><strong>The cost</strong> — zeroing 20 bytes is free; zeroing 200 MB is not. When you are about to overwrite every byte anyway, <code>malloc</code> is the honest choice. In this course either is fine; in a large program that distinction becomes real.</li>
<li><strong>Which to pick, as a rule</strong> — need a clean array of counters or a struct with sensible defaults → <code>calloc</code>. Need raw space you will fill immediately → <code>malloc</code>. Both are freed with the same <code>free</code>.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

int main() {
    /* Allocates and initializes memory for 5 integers */
    int *arr = (int *)calloc(5, sizeof(int));
    if (arr == NULL) {
        printf("Memory allocation failed\\n");
    } else {
        printf("Address of arr: %p\\n", (void *)arr);
        printf("Size of memory of arr: %lu bytes\\n",
               (unsigned long)(5 * sizeof(int)));
        printf("calloc -&gt; %d %d %d %d %d\\n",
               arr[0], arr[1], arr[2], arr[3], arr[4]);
        free(arr);
    }
    return 0;
}</code></pre>
<p class="dap-an">✅ Compiled and run for real: <code>Size of memory of arr: 20 bytes</code> and the extra line prints <strong><code>calloc -&gt; 0 0 0 0 0</code></strong>. That is the promise the slide makes, and unlike the <code>malloc</code> run on slide 26 it is guaranteed by the standard, not by luck.</p>
<p class="meo">💡 Remember the argument order by reading it aloud as English: <code>calloc(5, sizeof(int))</code> = "calloc five ints". <code>malloc</code> has no comma because it speaks only bytes. Swapping the two arguments of <code>calloc</code> happens to work here (5 × 4 = 4 × 5) but is a habit that will bite you the day one of them is not a plain number.</p>`,
        `<p class="y-chinh">🎯 Một câu, hai lời hứa: <em>"Cấp phát vùng nhớ cho một mảng phần tử <strong>và đặt mọi byte về 0</strong>."</em> <code>calloc</code> là <code>malloc</code> cộng thêm bảo đảm về một tờ giấy trắng — và nó đếm theo phần tử chứ không theo byte.</p>
<ul>
<li><strong>Hai tham số, không phải một</strong> — <code>void *calloc(size_t num, size_t size);</code>. Ví dụ của slide là <code>calloc(5, sizeof(int))</code>: "năm món, mỗi món bốn byte". So với <code>malloc(5 * sizeof(int))</code> ở slide 26 — vẫn 20 byte ấy, chỉ khác cách viết, và dấu phẩy mới là thứ phải nhớ.</li>
<li><strong>Việc đặt về 0 mới là lý do chọn nó</strong> — sau <code>calloc</code>, mọi <code>int</code> trong khối đọc ra 0, mọi <code>double</code> ra 0.0, mọi <code>char</code> ra <code>'\\0'</code>, mọi con trỏ ra <code>NULL</code> trên máy thông thường. Nếu thuật toán của bạn mở đầu bằng việc xoá trắng một mảng (biến đếm, bảng tần suất, biến tổng) thì <code>calloc</code> đã làm giúp rồi.</li>
<li><strong>Chữ "Contiguous" trong tiêu đề</strong> — khối nhớ là một dải byte liền mạch không đứt quãng, và chính điều đó làm <code>arr[0] … arr[4]</code> hợp lệ, cũng như làm số học con trỏ (slide 19) đi đúng trên nó. <code>malloc</code> cũng cho bạn một khối liền mạch; cái tên này là di sản lịch sử.</li>
<li><strong>Phần còn lại của ví dụ giống hệt slide 26</strong> — vẫn phép kiểm <code>NULL</code>, vẫn hai lệnh <code>printf</code>, vẫn báo <code>20 bytes</code>. Đó là cố ý: bộ slide muốn bạn thấy rằng chỉ có đúng dòng cấp phát là đổi.</li>
<li><strong>Cái giá</strong> — xoá trắng 20 byte thì miễn phí; xoá trắng 200 MB thì không. Khi bạn sắp ghi đè lên từng byte rồi thì <code>malloc</code> mới là lựa chọn trung thực. Trong môn này dùng cái nào cũng được; trong một chương trình lớn thì khác biệt ấy là có thật.</li>
<li><strong>Chọn cái nào, thành quy tắc</strong> — cần một mảng biến đếm sạch hoặc một cấu trúc có giá trị mặc định hợp lý → <code>calloc</code>. Cần chỗ trống thô để ghi đè ngay → <code>malloc</code>. Cả hai đều thu hồi bằng cùng một lệnh <code>free</code>.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

int main() {
    /* Cap phat VA khoi tao vung nho cho 5 so nguyen */
    int *arr = (int *)calloc(5, sizeof(int));
    if (arr == NULL) {
        printf("Memory allocation failed\\n");
    } else {
        printf("Address of arr: %p\\n", (void *)arr);
        printf("Size of memory of arr: %lu bytes\\n",
               (unsigned long)(5 * sizeof(int)));
        printf("calloc -&gt; %d %d %d %d %d\\n",
               arr[0], arr[1], arr[2], arr[3], arr[4]);
        free(arr);
    }
    return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch và chạy thật: <code>Size of memory of arr: 20 bytes</code> và dòng thêm vào in ra <strong><code>calloc -&gt; 0 0 0 0 0</code></strong>. Đó đúng là lời hứa của slide, và khác với lần chạy <code>malloc</code> ở slide 26, điều này được CHUẨN bảo đảm chứ không phải nhờ may mắn.</p>
<p class="meo">💡 Nhớ thứ tự tham số bằng cách đọc thành lời: <code>calloc(5, sizeof(int))</code> = "calloc năm cái int". <code>malloc</code> không có dấu phẩy vì nó chỉ nói chuyện bằng byte. Đảo hai tham số của <code>calloc</code> ở đây thì tình cờ vẫn chạy (5 × 4 = 4 × 5), nhưng đó là thói quen sẽ cắn bạn vào ngày một trong hai không còn là số trần.</p>`],

      [28, 'realloc (Reallocation)',
        `<p class="y-chinh">🎯 <em>"Resizes an already allocated memory block. It can <strong>shrink</strong> or <strong>expand</strong> the memory block. If it expands the block, the new memory might be uninitialized."</em> The one function in this set that can hand you back a <em>different</em> address.</p>
<ul>
<li><strong>The signature</strong> — <code>void *realloc(void *ptr, size_t size);</code>. First argument: the block you already have. Second: the <strong>new total size in bytes</strong>, not the extra amount. The slide's example goes from <code>malloc(5 * sizeof(int))</code> to <code>realloc(arr, 10 * sizeof(int))</code> — ten, not five more.</li>
<li><strong>It may MOVE the whole block</strong> — this is the fact the slide leaves implicit and the exam makes explicit. If there is no room to grow in place, <code>realloc</code> allocates elsewhere, <em>copies your old data across</em>, frees the old block, and returns the new address. Your old pointer is then dangling.</li>
<li><strong>I measured a real move</strong> — 5 ints at <code>0x791000920</code>, then <code>realloc</code> to 10 ints returned <code>0x1035f9f70</code>: a completely different address. The five old values <code>1 2 3 4 5</code> were still intact at the new location, exactly as promised.</li>
<li><strong>Which is why you must reassign</strong> — <code>arr = (int *)realloc(arr, …)</code>, as the slide's red-boxed line does. Ignoring the return value and carrying on with the old <code>arr</code> is a use-after-free.</li>
<li><strong>But the slide's own line has a leak</strong> — <code>arr = (int *)realloc(arr, 10 * sizeof(int));</code> assigns straight back onto <code>arr</code>. If <code>realloc</code> fails it returns <code>NULL</code>, the original block is <em>not</em> freed, and you have just overwritten the only pointer to it: a guaranteed memory leak plus a <code>NULL</code> dereference waiting downstream. The safe form uses a temporary.</li>
<li><strong>What the new bytes contain</strong> — when expanding, the part beyond the old size is uninitialised, like <code>malloc</code>. When shrinking, the data beyond the new size is gone. And <code>realloc(NULL, n)</code> behaves exactly like <code>malloc(n)</code>, which is handy for growing loops.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

int main() {
    int i;
    int *arr = (int *)malloc(5 * sizeof(int));     /* 5 integers  */
    if (arr == NULL) { printf("Memory allocation failed\\n"); return 1; }
    for (i = 0; i &lt; 5; i++) arr[i] = i + 1;

    /* DUNG CACH: nhan ket qua vao bien tam, kiem NULL, roi moi gan lai */
    int *tmp = (int *)realloc(arr, 10 * sizeof(int));   /* resize -&gt; 10 */
    if (tmp == NULL) {
        printf("Memory reallocation failed\\n");
        free(arr);                                  /* khoi cu VAN con  */
        return 1;
    }
    arr = tmp;

    for (i = 0; i &lt; 5; i++) printf("%d ", arr[i]);  /* 5 gia tri cu     */
    printf("\\n");

    free(arr);
    arr = NULL;
    return 0;
}</code></pre>
<p class="dap-an">✅ Compiled with <code>cc -Wall</code> and run: before <code>realloc</code> the block was at <code>0x791000920</code> holding <code>1 2 3 4 5</code>; after <code>realloc</code> the block was at <code>0x1035f9f70</code> — <strong>it moved</strong> — and still held <code>1 2 3 4 5</code>. Both halves of the lesson in one run: the data survives, the address does not.</p>
<p class="pitfall">⚠️ Never write <code>p = realloc(p, n);</code> — that is the slide's own line and it is the textbook leak. On failure <code>realloc</code> returns <code>NULL</code> <em>without</em> freeing the old block, so <code>p</code> becomes <code>NULL</code> and the block becomes unreachable forever. Always go through a temporary, check it, then assign.</p>`,
        `<p class="y-chinh">🎯 <em>"Đổi cỡ một khối nhớ đã cấp phát. Nó có thể <strong>thu nhỏ</strong> hoặc <strong>nới rộng</strong> khối nhớ. Nếu nới rộng thì phần nhớ mới có thể chưa được khởi tạo."</em> Đây là hàm duy nhất trong bộ này có thể trả về cho bạn một địa chỉ <em>khác</em>.</p>
<ul>
<li><strong>Nguyên mẫu</strong> — <code>void *realloc(void *ptr, size_t size);</code>. Tham số một: khối bạn đang có. Tham số hai: <strong>tổng kích thước MỚI tính bằng byte</strong>, không phải phần cần thêm. Ví dụ của slide đi từ <code>malloc(5 * sizeof(int))</code> sang <code>realloc(arr, 10 * sizeof(int))</code> — là mười, chứ không phải thêm năm.</li>
<li><strong>Nó có thể DỜI cả khối</strong> — đây là điều slide để ngầm còn đề thi thì hỏi thẳng. Nếu không còn chỗ để nới tại chỗ, <code>realloc</code> cấp phát ở nơi khác, <em>chép dữ liệu cũ sang</em>, giải phóng khối cũ, rồi trả về địa chỉ mới. Con trỏ cũ của bạn khi ấy thành con trỏ treo.</li>
<li><strong>Tôi đã đo được một lần dời thật</strong> — 5 số nguyên ở <code>0x791000920</code>, sau <code>realloc</code> lên 10 số thì trả về <code>0x1035f9f70</code>: một địa chỉ hoàn toàn khác. Năm giá trị cũ <code>1 2 3 4 5</code> vẫn còn nguyên ở chỗ mới, đúng như lời hứa.</li>
<li><strong>Vì thế bắt buộc phải gán lại</strong> — <code>arr = (int *)realloc(arr, …)</code>, đúng như dòng được khoanh đỏ trên slide. Bỏ qua giá trị trả về rồi vẫn dùng <code>arr</code> cũ là dùng vùng nhớ đã bị giải phóng.</li>
<li><strong>Nhưng chính dòng của slide lại có rò rỉ</strong> — <code>arr = (int *)realloc(arr, 10 * sizeof(int));</code> gán thẳng đè lên <code>arr</code>. Nếu <code>realloc</code> thất bại, nó trả <code>NULL</code>, khối gốc <em>không</em> bị giải phóng, mà bạn vừa ghi đè mất con trỏ duy nhất tới nó: chắc chắn rò rỉ bộ nhớ, cộng thêm một lần dereference <code>NULL</code> đang chờ ở dưới. Cách an toàn là qua một biến tạm.</li>
<li><strong>Mấy byte mới chứa gì</strong> — khi nới rộng, phần vượt quá kích thước cũ là chưa khởi tạo, giống <code>malloc</code>. Khi thu nhỏ, dữ liệu nằm ngoài kích thước mới mất luôn. Và <code>realloc(NULL, n)</code> hành xử y hệt <code>malloc(n)</code>, rất tiện cho các vòng lặp nới dần.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

int main() {
    int i;
    int *arr = (int *)malloc(5 * sizeof(int));     /* 5 so nguyen */
    if (arr == NULL) { printf("Memory allocation failed\\n"); return 1; }
    for (i = 0; i &lt; 5; i++) arr[i] = i + 1;

    /* DUNG CACH: nhan ket qua vao bien tam, kiem NULL, roi moi gan lai */
    int *tmp = (int *)realloc(arr, 10 * sizeof(int));   /* doi co -&gt; 10 */
    if (tmp == NULL) {
        printf("Memory reallocation failed\\n");
        free(arr);                                  /* khoi cu VAN con  */
        return 1;
    }
    arr = tmp;

    for (i = 0; i &lt; 5; i++) printf("%d ", arr[i]);  /* 5 gia tri cu     */
    printf("\\n");

    free(arr);
    arr = NULL;
    return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch bằng <code>cc -Wall</code> và chạy thật: trước <code>realloc</code>, khối nằm ở <code>0x791000920</code> và chứa <code>1 2 3 4 5</code>; sau <code>realloc</code>, khối nằm ở <code>0x1035f9f70</code> — <strong>nó đã DỜI chỗ</strong> — và vẫn chứa <code>1 2 3 4 5</code>. Cả hai nửa bài học gói trong một lần chạy: dữ liệu sống sót, địa chỉ thì không.</p>
<p class="pitfall">⚠️ Đừng bao giờ viết <code>p = realloc(p, n);</code> — đó chính là dòng của slide và cũng là bài rò rỉ kinh điển trong sách giáo khoa. Khi thất bại, <code>realloc</code> trả <code>NULL</code> mà <em>không</em> giải phóng khối cũ, nên <code>p</code> thành <code>NULL</code> còn khối nhớ thì mất đường về vĩnh viễn. Luôn đi qua một biến tạm, kiểm nó, rồi mới gán.</p>`],

      [29, 'free (Deallocation)',
        `<p class="y-chinh">🎯 <em>"Frees memory previously allocated with: malloc, calloc, realloc."</em> Signature <code>void free(void *ptr);</code> — it returns nothing, and it is the only one of the four you can forget without the compiler ever noticing.</p>
<ul>
<li><strong>Read the two red-boxed lines together</strong> — <code>free(arr); // Releases allocated memory</code> and then <code>arr = NULL; // Avoids dangling pointer</code>. The slide pairs them deliberately: <code>free</code> alone is only half the job.</li>
<li><strong>What <code>free</code> actually does</strong> — it tells the allocator "I am finished with this block, you may reuse it". It does <em>not</em> erase the bytes and it does <em>not</em> change your pointer variable. After <code>free(arr)</code>, <code>arr</code> still holds the same address, now pointing into memory owned by someone else.</li>
<li><strong>Dangling pointer</strong> — using that stale pointer is reading or writing another part of the program's data. It often appears to work for a while, which is what makes the bug so expensive: the crash happens far from the cause. Setting <code>arr = NULL</code> converts a silent corruption into an immediate, obvious crash — a much better failure.</li>
<li><strong>Double free</strong> — calling <code>free</code> twice on the same block corrupts the allocator's bookkeeping and is one of the classic security holes in C. Note that <code>free(NULL)</code> is explicitly <em>safe</em> and does nothing, so once you set the pointer to <code>NULL</code>, a second <code>free</code> becomes harmless.</li>
<li><strong>Only free what the heap gave you</strong> — slide 33 spells it out: <em>"Avoid using free on pointers that were not dynamically allocated."</em> <code>int n; free(&amp;n);</code> is undefined behaviour; so is freeing a pointer that has been moved with <code>p++</code>. <code>free</code> must receive the exact address that <code>malloc</code>/<code>calloc</code>/<code>realloc</code> returned.</li>
<li><strong>Every allocation needs exactly one free</strong> — one, no more, no fewer. In this course the operating system reclaims everything when the program ends, so a leak is invisible; in a service that runs for months, it is fatal.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

int main() {
    int *arr = (int *)malloc(5 * sizeof(int));   /* 5 integers */
    if (arr == NULL) { printf("Memory allocation failed\\n"); return 1; }

    /* ... other operations on array ... */
    arr[0] = 7;
    printf("arr[0] = %d\\n", arr[0]);

    free(arr);      /* Releases allocated memory  */
    arr = NULL;     /* Avoids dangling pointer    */

    printf("sau free + NULL: arr = %p\\n", (void *)arr);
    free(arr);      /* free(NULL) la AN TOAN, khong lam gi ca */
    return 0;
}</code></pre>
<p class="dap-an">✅ Compiled and run: it prints <code>arr[0] = 7</code>, then <code>sau free + NULL: arr = 0x0</code>, and the second <code>free</code> does nothing at all — no crash, because <code>free(NULL)</code> is defined to be a no-op. Remove the <code>arr = NULL;</code> line and that same second <code>free</code> becomes a double free, i.e. undefined behaviour.</p>
<p class="meo">💡 Write the <code>free</code> the moment you write the <code>malloc</code>, before you write anything in between — the same reflex as closing a bracket. And make <code>free(p); p = NULL;</code> a single unit in your head; they belong together like <code>{</code> and <code>}</code>.</p>`,
        `<p class="y-chinh">🎯 <em>"Giải phóng vùng nhớ trước đó đã cấp phát bằng: malloc, calloc, realloc."</em> Nguyên mẫu <code>void free(void *ptr);</code> — nó không trả về gì, và nó là hàm duy nhất trong bốn hàm mà bạn có thể quên mất mà trình biên dịch chẳng bao giờ hay biết.</p>
<ul>
<li><strong>Đọc hai dòng khoanh đỏ cùng nhau</strong> — <code>free(arr); // Releases allocated memory</code> rồi <code>arr = NULL; // Avoids dangling pointer</code>. Slide cố ý ghép chúng: chỉ <code>free</code> thôi mới là làm nửa việc.</li>
<li><strong><code>free</code> thực sự làm gì</strong> — nó báo cho bộ cấp phát biết "tôi xong với khối này rồi, anh dùng lại được". Nó <em>không</em> xoá các byte và <em>không</em> đụng tới biến con trỏ của bạn. Sau <code>free(arr)</code>, <code>arr</code> vẫn giữ nguyên địa chỉ ấy, giờ trỏ vào vùng nhớ đã thuộc về người khác.</li>
<li><strong>Con trỏ treo (dangling pointer)</strong> — dùng con trỏ cũ kỹ ấy là đang đọc hoặc ghi vào một phần dữ liệu khác của chương trình. Thường thì nó vẫn "chạy được" một lúc, và chính vì thế lỗi này rất đắt: chỗ sập cách rất xa chỗ gây ra. Gán <code>arr = NULL</code> biến một vụ phá hoại âm thầm thành một vụ sập ngay và rõ ràng — một kiểu hỏng tốt hơn nhiều.</li>
<li><strong>Giải phóng hai lần (double free)</strong> — gọi <code>free</code> hai lần trên cùng một khối làm hỏng sổ sách của bộ cấp phát, và là một trong những lỗ hổng bảo mật kinh điển của C. Để ý rằng <code>free(NULL)</code> được chuẩn quy định là <em>an toàn</em> và không làm gì, nên hễ bạn đã gán con trỏ về <code>NULL</code> thì lần <code>free</code> thứ hai trở nên vô hại.</li>
<li><strong>Chỉ giải phóng thứ heap đã cấp cho bạn</strong> — slide 33 nói thẳng: <em>"Tránh dùng free trên các con trỏ không được cấp phát động."</em> <code>int n; free(&amp;n);</code> là hành vi không xác định; giải phóng một con trỏ đã bị dịch bằng <code>p++</code> cũng vậy. <code>free</code> phải nhận đúng cái địa chỉ mà <code>malloc</code>/<code>calloc</code>/<code>realloc</code> đã trả về.</li>
<li><strong>Mỗi lần cấp phát cần đúng một lần free</strong> — một, không hơn không kém. Trong môn học này, hệ điều hành thu hồi tất cả khi chương trình kết thúc nên rò rỉ không nhìn thấy được; còn trong một dịch vụ chạy liên tục nhiều tháng thì nó là chí mạng.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

int main() {
    int *arr = (int *)malloc(5 * sizeof(int));   /* 5 so nguyen */
    if (arr == NULL) { printf("Memory allocation failed\\n"); return 1; }

    /* ... cac thao tac khac tren mang ... */
    arr[0] = 7;
    printf("arr[0] = %d\\n", arr[0]);

    free(arr);      /* tra vung nho ve he thong   */
    arr = NULL;     /* tranh con tro treo         */

    printf("sau free + NULL: arr = %p\\n", (void *)arr);
    free(arr);      /* free(NULL) la AN TOAN, khong lam gi ca */
    return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch và chạy thật: in ra <code>arr[0] = 7</code>, rồi <code>sau free + NULL: arr = 0x0</code>, và lệnh <code>free</code> thứ hai không làm gì cả — không sập, vì <code>free(NULL)</code> được định nghĩa là không làm gì. Bỏ dòng <code>arr = NULL;</code> đi thì chính lệnh <code>free</code> thứ hai ấy trở thành một vụ double free, tức hành vi không xác định.</p>
<p class="meo">💡 Viết lệnh <code>free</code> ngay lúc vừa viết <code>malloc</code>, trước khi gõ bất cứ thứ gì ở giữa — cùng một phản xạ như đóng ngoặc. Và hãy coi <code>free(p); p = NULL;</code> là MỘT đơn vị trong đầu; chúng đi với nhau như <code>{</code> với <code>}</code>.</p>`],

      [30, 'Dynamic Allocated Data: Demo 1',
        `<p class="y-chinh">🎯 A program whose only job is to print addresses, so that the four segments from slide 4 stop being a drawing and become numbers. Four requirements are attached: run it, draw the memory map, mark which segment is which, and comment on the <em>direction</em> dynamic allocation grows.</p>
<ul>
<li><strong>What gets printed</strong> — <code>&amp;MAXN</code> (a <code>const int</code> global, so Data segment), <code>&amp;main</code> (a function, so Code segment), <code>&amp;n</code>, <code>&amp;p1</code>, <code>&amp;p2</code> (locals, so Stack segment), then <code>p1</code>, <code>p2</code>, <code>p3</code> themselves (values returned by <code>malloc</code>, so Heap).</li>
<li><strong>Note what is being printed for the pointers</strong> — for <code>n</code> and <code>p1</code> the program prints <code>&amp;p1</code>, the address <em>of the pointer variable</em> (Stack). For the allocations it prints <code>p1</code> without <code>&amp;</code>, the address <em>the pointer contains</em> (Heap). Getting that distinction right is the whole exercise.</li>
<li><strong>Requirement 4, the interesting one</strong> — I measured: <code>p1 = 0x1036220d0</code>, <code>p2 = 0x1036220e0</code>, <code>p3 = 0x1036220f0</code>. Three successive <code>malloc</code>s of 4 bytes each came back <strong>ascending, 16 bytes apart</strong>. Ascending is the classic answer: the Heap grows <em>upward</em>, toward higher addresses.</li>
<li><strong>And the Stack goes the other way</strong> — same run: <code>&amp;n = 0x16d06a3c8</code>, <code>&amp;p1 = 0x16d06a3c0</code>, <code>&amp;p2 = 0x16d06a3b8</code>. Each later local sits at a <em>lower</em> address. Stack down, Heap up, growing toward each other — exactly the picture on slide 4.</li>
<li><strong>Why 16 bytes apart and not 4</strong> — you asked for 4 bytes, the allocator reserved a larger rounded chunk (alignment plus its own bookkeeping header). This is why you can never assume two allocations are adjacent, and why the neighbour trick of Exercise 3 does not transfer to the heap.</li>
<li><strong>The leak hiding in plain sight</strong> — the program frees <code>p1</code> and <code>p2</code> and never frees <code>p3</code>. Four bytes, harmless here because the process exits immediately, but it is the exact shape of a real leak: an allocation whose <code>free</code> was simply forgotten.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

const int MAXN = 100;

int main()
{
    int n;   int *p1;   int *p2;   int *p3;

    printf("Address of MAXN: %p\\n", (void *)&amp;MAXN);        /* Data segment  */
    printf("Main function is allocated at: %p\\n", (void *)&amp;main); /* Code   */
    printf("Address of n : %p\\n", (void *)&amp;n);             /* Stack         */
    printf("Address of p1: %p\\n", (void *)&amp;p1);            /* Stack         */
    printf("Address of p2: %p\\n", (void *)&amp;p2);            /* Stack         */

    p1 = (int *)malloc(sizeof(int));
    p2 = (int *)malloc(sizeof(int));
    p3 = (int *)malloc(sizeof(int));
    printf("Dynamic allocation (p1) at: %p\\n", (void *)p1); /* Heap          */
    printf("Dynamic allocation (p2) at: %p\\n", (void *)p2);
    printf("Dynamic allocation (p3) at: %p\\n", (void *)p3);

    free(p1);
    free(p2);
    free(p3);        /* slide quen dong nay -&gt; ro ri 4 byte */
    return 0;
}</code></pre>
<p class="dap-an">✅ Measured output (one real run): <code>MAXN → 0x102d9460c</code> · <code>main → 0x102d944b0</code> (Code and Data sit close together, far from everything else) · <code>n → 0x16d06a3c8</code>, <code>p1 → 0x16d06a3c0</code>, <code>p2 → 0x16d06a3b8</code> (Stack, <strong>descending</strong>) · <code>p1 → 0x1036220d0</code>, <code>p2 → 0x1036220e0</code>, <code>p3 → 0x1036220f0</code> (Heap, <strong>ascending, step 16</strong>). Answer to requirement 4: <strong>dynamic allocation grows upward</strong> while the stack grows downward.</p>
<p class="pitfall">⚠️ The slide's program prints every address with <code>%u</code> and ends with <code>system("pause")</code>. Both are Dev-C++/Windows-era code: <code>%u</code> truncates a 64-bit address to 32 bits (I saw a real address of <code>0x16d06a3c8</code> print as <code>1839850424</code>) and <code>system("pause")</code> does not exist outside Windows. If the numbers in your run look impossibly small or two different variables print the same address, check the format specifier before you doubt the memory model.</p>`,
        `<p class="y-chinh">🎯 Một chương trình mà việc duy nhất của nó là in địa chỉ, để bốn vùng nhớ ở slide 4 thôi làm một bức vẽ và trở thành những con số. Kèm theo bốn yêu cầu: chạy nó, vẽ bản đồ bộ nhớ, chỉ ra đâu là vùng nào, và nhận xét về <em>chiều</em> mà cấp phát động lớn lên.</p>
<ul>
<li><strong>Chương trình in những gì</strong> — <code>&amp;MAXN</code> (một biến toàn cục <code>const int</code>, nên nằm ở Data segment), <code>&amp;main</code> (một hàm, nên ở Code segment), <code>&amp;n</code>, <code>&amp;p1</code>, <code>&amp;p2</code> (biến cục bộ, nên ở Stack segment), rồi chính <code>p1</code>, <code>p2</code>, <code>p3</code> (giá trị do <code>malloc</code> trả về, nên ở Heap).</li>
<li><strong>Để ý kỹ chỗ in cho các con trỏ</strong> — với <code>n</code> và <code>p1</code> thì chương trình in <code>&amp;p1</code>, tức địa chỉ <em>của biến con trỏ</em> (Stack). Với các lần cấp phát thì nó in <code>p1</code> không có dấu <code>&amp;</code>, tức địa chỉ mà <em>con trỏ đang chứa</em> (Heap). Phân biệt đúng chỗ đó chính là toàn bộ bài tập.</li>
<li><strong>Yêu cầu 4, phần thú vị nhất</strong> — tôi đã đo: <code>p1 = 0x1036220d0</code>, <code>p2 = 0x1036220e0</code>, <code>p3 = 0x1036220f0</code>. Ba lần <code>malloc</code> liên tiếp, mỗi lần 4 byte, trả về địa chỉ <strong>tăng dần, cách nhau 16 byte</strong>. Tăng dần chính là câu trả lời kinh điển: Heap lớn lên <em>đi lên</em>, về phía địa chỉ cao.</li>
<li><strong>Còn Stack đi ngược lại</strong> — cũng lần chạy ấy: <code>&amp;n = 0x16d06a3c8</code>, <code>&amp;p1 = 0x16d06a3c0</code>, <code>&amp;p2 = 0x16d06a3b8</code>. Biến cục bộ khai sau nằm ở địa chỉ <em>thấp hơn</em>. Stack đi xuống, Heap đi lên, hai bên tiến về phía nhau — đúng bức hình ở slide 4.</li>
<li><strong>Vì sao cách nhau 16 byte chứ không phải 4</strong> — bạn xin 4 byte, bộ cấp phát giữ một mẩu lớn hơn đã làm tròn (căn lề cộng với phần đầu mục ghi sổ của chính nó). Đó là lý do không bao giờ được giả định hai lần cấp phát nằm kề nhau, và cũng là lý do mẹo "hàng xóm" của Exercise 3 không mang sang heap được.</li>
<li><strong>Chỗ rò rỉ nằm ngay trước mắt</strong> — chương trình giải phóng <code>p1</code> và <code>p2</code> mà không bao giờ giải phóng <code>p3</code>. Bốn byte, ở đây vô hại vì tiến trình kết thúc ngay sau đó, nhưng nó đúng hình dạng của một vụ rò rỉ thật: một lần cấp phát mà lệnh <code>free</code> đơn giản là bị quên.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

const int MAXN = 100;

int main()
{
    int n;   int *p1;   int *p2;   int *p3;

    printf("Address of MAXN: %p\\n", (void *)&amp;MAXN);        /* Data segment  */
    printf("Main function is allocated at: %p\\n", (void *)&amp;main); /* Code   */
    printf("Address of n : %p\\n", (void *)&amp;n);             /* Stack         */
    printf("Address of p1: %p\\n", (void *)&amp;p1);            /* Stack         */
    printf("Address of p2: %p\\n", (void *)&amp;p2);            /* Stack         */

    p1 = (int *)malloc(sizeof(int));
    p2 = (int *)malloc(sizeof(int));
    p3 = (int *)malloc(sizeof(int));
    printf("Dynamic allocation (p1) at: %p\\n", (void *)p1); /* Heap          */
    printf("Dynamic allocation (p2) at: %p\\n", (void *)p2);
    printf("Dynamic allocation (p3) at: %p\\n", (void *)p3);

    free(p1);
    free(p2);
    free(p3);        /* slide quen dong nay -&gt; ro ri 4 byte */
    return 0;
}</code></pre>
<p class="dap-an">✅ Kết quả đo thật (một lần chạy): <code>MAXN → 0x102d9460c</code> · <code>main → 0x102d944b0</code> (Code và Data nằm sát nhau, cách xa mọi thứ còn lại) · <code>n → 0x16d06a3c8</code>, <code>p1 → 0x16d06a3c0</code>, <code>p2 → 0x16d06a3b8</code> (Stack, <strong>giảm dần</strong>) · <code>p1 → 0x1036220d0</code>, <code>p2 → 0x1036220e0</code>, <code>p3 → 0x1036220f0</code> (Heap, <strong>tăng dần, bước 16</strong>). Trả lời yêu cầu 4: <strong>cấp phát động đi LÊN</strong>, còn ngăn xếp đi XUỐNG.</p>
<p class="pitfall">⚠️ Chương trình trên slide in mọi địa chỉ bằng <code>%u</code> và kết thúc bằng <code>system("pause")</code>. Cả hai đều là mã thời Dev-C++/Windows: <code>%u</code> cắt cụt một địa chỉ 64-bit xuống 32 bit (tôi thấy địa chỉ thật <code>0x16d06a3c8</code> in ra thành <code>1839850424</code>) còn <code>system("pause")</code> thì không tồn tại ngoài Windows. Nếu lần chạy của bạn cho ra những con số nhỏ đến vô lý, hoặc hai biến khác nhau in ra cùng một địa chỉ, hãy kiểm định dạng in trước khi nghi ngờ mô hình bộ nhớ.</p>`],

      [31, 'Dynamic Allocated Data: Demo 2',
        `<p class="y-chinh">🎯 <em>"Use dynamic memory allocation. Develop a program that will accept two real numbers then sum of them, their difference, their product, and their quotient are printed out."</em> Marked <strong>"Do yourself"</strong>, with the skeleton on the slide and two requirements: run it, and draw the stack/heap map.</p>
<ul>
<li><strong>Two <code>double</code>s, but no <code>double</code> variable</strong> — the program never declares <code>double a, b;</code>. It declares two <em>pointers</em> and asks the heap for the actual storage. Functionally pointless for two numbers, pedagogically exact: it forces every access to go through <code>*p1</code>.</li>
<li><strong>The line worth staring at</strong> — <code>scanf("%lf%lf", p1, p2);</code>. <strong>No <code>&amp;</code>.</strong> You have written <code>scanf("%lf", &amp;x)</code> a hundred times, and now the <code>&amp;</code> is gone — because <code>scanf</code> needs an address and <code>p1</code> <em>already is</em> one. Writing <code>&amp;p1</code> here would pass the address of the pointer variable, and <code>scanf</code> would overwrite the pointer itself with a bit pattern taken from a floating-point number.</li>
<li><strong>Everything else uses <code>*</code></strong> — <code>*p1 + *p2</code>, <code>*p1 - *p2</code>, <code>*p1 * (*p2)</code>, <code>*p1 / *p2</code>. Note the parentheses in the product: <code>*p1 * *p2</code> is legal but hard to read, and <code>*p1 **p2</code> would begin a comment-looking token sequence in some fonts. The slide's <code>*p1 * (*p2)</code> is the readable form.</li>
<li><strong>The two printf lines before input</strong> — <code>printf("p1, address: %u, value: %u\\n", &amp;p1, p1);</code> prints both halves at once: where the pointer lives (Stack) and what it holds (Heap). That is requirement 2 handed to you as output.</li>
<li><strong>What the map looks like</strong> — I measured: <code>&amp;p1 = 0x16fac63c0</code>, <code>&amp;p2 = 0x16fac63b8</code> (Stack, 8 bytes apart, descending) and <code>p1 = 0x100976070</code>, <code>p2 = 0x100976080</code> (Heap, 16 bytes apart, ascending). Two boxes on the stack, each holding an arrow into a separate 8-byte box on the heap.</li>
<li><strong>What the slide's skeleton is missing</strong> — no <code>NULL</code> check and no <code>free</code>. Add both when you write it up: this is a "Do yourself" slide and those two lines are what the marker is looking for.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

int main() {
    double *p1, *p2;
    p1 = (double *) malloc(sizeof(double));
    p2 = (double *) malloc(sizeof(double));
    if (p1 == NULL || p2 == NULL) {          /* slide thieu buoc nay */
        printf("Memory allocation failed\\n");
        return 1;
    }

    printf("p1, address: %p, value: %p\\n", (void *)&amp;p1, (void *)p1);
    printf("p2, address: %p, value: %p\\n", (void *)&amp;p2, (void *)p2);

    printf("Input 2 numbers:");
    scanf("%lf%lf", p1, p2);                 /* KHONG co dau &amp; */

    printf("Sum: %lf\\n",        *p1 + *p2);
    printf("Difference: %lf\\n", *p1 - *p2);
    printf("Product: %lf\\n",    *p1 * (*p2));
    printf("Quotient: %lf\\n",   *p1 / *p2);

    free(p1); p1 = NULL;                     /* slide thieu buoc nay */
    free(p2); p2 = NULL;
    return 0;
}</code></pre>
<p class="dap-an">✅ Compiled with <code>cc -Wall</code> and run with input <code>12.5</code> and <code>4</code>: <code>Sum: 16.500000</code> · <code>Difference: 8.500000</code> · <code>Product: 50.000000</code> · <code>Quotient: 3.125000</code>. Memory map from the same run: Stack holds <code>p1</code> at <code>0x16fac63c0</code> and <code>p2</code> at <code>0x16fac63b8</code>; Heap holds the two <code>double</code>s at <code>0x100976070</code> and <code>0x100976080</code>.</p>
<p class="pitfall">⚠️ Division has no guard. Enter <code>0</code> as the second number and <code>*p1 / *p2</code> gives <code>inf</code> (or <code>nan</code> if the first is 0 too) — floating-point division by zero does not crash, it produces a special value, which is arguably worse because the program carries on printing nonsense. Add <code>if (*p2 == 0)</code> before the quotient line. Also note the slide's code uses curly typographic quotes <code>“ ”</code> around the format strings; they are an artefact of PowerPoint and will not compile — retype them as straight <code>"</code>.</p>`,
        `<p class="y-chinh">🎯 <em>"Dùng cấp phát bộ nhớ động. Viết chương trình nhận hai số thực rồi in ra tổng, hiệu, tích và thương của chúng."</em> Slide ghi rõ <strong>"Do yourself"</strong> (tự làm), kèm bộ khung có sẵn và hai yêu cầu: chạy nó, và vẽ bản đồ stack/heap.</p>
<ul>
<li><strong>Hai số <code>double</code>, nhưng không có biến <code>double</code> nào</strong> — chương trình không hề khai <code>double a, b;</code>. Nó khai hai <em>con trỏ</em> rồi xin heap cấp chỗ chứa thật. Với hai con số thì cách này vô ích về mặt chức năng, nhưng chính xác về mặt sư phạm: nó bắt mọi lần truy cập phải đi qua <code>*p1</code>.</li>
<li><strong>Dòng đáng nhìn kỹ nhất</strong> — <code>scanf("%lf%lf", p1, p2);</code>. <strong>Không có dấu <code>&amp;</code>.</strong> Bạn đã viết <code>scanf("%lf", &amp;x)</code> cả trăm lần, giờ dấu <code>&amp;</code> biến mất — vì <code>scanf</code> cần một địa chỉ, mà <code>p1</code> <em>vốn đã là</em> một địa chỉ rồi. Viết <code>&amp;p1</code> ở đây là truyền địa chỉ của biến con trỏ, và <code>scanf</code> sẽ ghi đè lên chính con trỏ bằng một chuỗi bit lấy từ một số thực.</li>
<li><strong>Mọi chỗ còn lại đều dùng <code>*</code></strong> — <code>*p1 + *p2</code>, <code>*p1 - *p2</code>, <code>*p1 * (*p2)</code>, <code>*p1 / *p2</code>. Để ý cặp ngoặc ở phép nhân: <code>*p1 * *p2</code> tuy hợp lệ nhưng khó đọc, còn <code>*p1 **p2</code> nhìn dễ nhầm với dấu mở chú thích trong một số phông chữ. Cách viết <code>*p1 * (*p2)</code> của slide là cách dễ đọc.</li>
<li><strong>Hai dòng printf trước khi nhập</strong> — <code>printf("p1, address: %u, value: %u\\n", &amp;p1, p1);</code> in cả hai nửa cùng lúc: con trỏ ở đâu (Stack) và nó đang giữ gì (Heap). Đó chính là yêu cầu 2 được đưa sẵn cho bạn dưới dạng kết quả in ra.</li>
<li><strong>Bản đồ nhìn ra sao</strong> — tôi đo được: <code>&amp;p1 = 0x16fac63c0</code>, <code>&amp;p2 = 0x16fac63b8</code> (Stack, cách nhau 8 byte, giảm dần) và <code>p1 = 0x100976070</code>, <code>p2 = 0x100976080</code> (Heap, cách nhau 16 byte, tăng dần). Hai ô trên stack, mỗi ô giữ một mũi tên chỉ sang một ô 8 byte riêng trên heap.</li>
<li><strong>Bộ khung của slide thiếu gì</strong> — thiếu phép kiểm <code>NULL</code> và thiếu <code>free</code>. Hãy bổ sung cả hai khi làm bài: đây là slide "tự làm" và hai dòng ấy chính là thứ người chấm đang tìm.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

int main() {
    double *p1, *p2;
    p1 = (double *) malloc(sizeof(double));
    p2 = (double *) malloc(sizeof(double));
    if (p1 == NULL || p2 == NULL) {          /* slide thieu buoc nay */
        printf("Memory allocation failed\\n");
        return 1;
    }

    printf("p1, address: %p, value: %p\\n", (void *)&amp;p1, (void *)p1);
    printf("p2, address: %p, value: %p\\n", (void *)&amp;p2, (void *)p2);

    printf("Input 2 numbers:");
    scanf("%lf%lf", p1, p2);                 /* KHONG co dau &amp; */

    printf("Sum: %lf\\n",        *p1 + *p2);
    printf("Difference: %lf\\n", *p1 - *p2);
    printf("Product: %lf\\n",    *p1 * (*p2));
    printf("Quotient: %lf\\n",   *p1 / *p2);

    free(p1); p1 = NULL;                     /* slide thieu buoc nay */
    free(p2); p2 = NULL;
    return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch bằng <code>cc -Wall</code> và chạy thật với đầu vào <code>12.5</code> và <code>4</code>: <code>Sum: 16.500000</code> · <code>Difference: 8.500000</code> · <code>Product: 50.000000</code> · <code>Quotient: 3.125000</code>. Bản đồ bộ nhớ của cùng lần chạy: Stack giữ <code>p1</code> ở <code>0x16fac63c0</code> và <code>p2</code> ở <code>0x16fac63b8</code>; Heap giữ hai số <code>double</code> ở <code>0x100976070</code> và <code>0x100976080</code>.</p>
<p class="pitfall">⚠️ Phép chia không có chốt chặn. Nhập <code>0</code> cho số thứ hai thì <code>*p1 / *p2</code> cho ra <code>inf</code> (hoặc <code>nan</code> nếu số đầu cũng là 0) — chia cho 0 với số thực KHÔNG làm sập chương trình, nó sinh ra một giá trị đặc biệt, mà như thế còn tệ hơn vì chương trình cứ thế in tiếp những thứ vô nghĩa. Hãy thêm <code>if (*p2 == 0)</code> trước dòng tính thương. Ngoài ra, mã trên slide dùng dấu nháy cong <code>“ ”</code> quanh chuỗi định dạng; đó là do PowerPoint tự đổi và nó sẽ không biên dịch được — hãy gõ lại thành dấu nháy thẳng <code>"</code>.</p>`],

      [32, 'Dynamic Allocated Data: Demo 3',
        `<p class="y-chinh">🎯 The demo that shows <em>why</em> dynamic allocation exists: an array whose size is typed in by the user at run time. This is the thing you could not do with <code>int arr[n];</code> in C89, and the whole section has been building to it.</p>
<ul>
<li><strong>Line 7: <code>scanf("%d", &amp;n);</code></strong> — <code>n</code> is not known when the program is compiled. Line 10 then does <code>int *arr = (int *)malloc(n * sizeof(int));</code>, sizing the block from a value that only existed a microsecond ago.</li>
<li><strong>Lines 11–14 are the <code>NULL</code> check done properly</strong> — <code>if (arr == NULL) { printf("Memory allocation failed\\n"); return 1; }</code>. Note the <code>return 1</code>: it stops the program instead of carrying on to dereference a null pointer. Returning a non-zero value from <code>main</code> is the C convention for "this run failed".</li>
<li><strong><code>arr[i]</code> works on a malloc'd block</strong> — lines 18–20 read with <code>scanf("%d", &amp;arr[i])</code> and lines 24–26 print with <code>arr[i]</code>, exactly as if <code>arr</code> had been declared as an array. That is because <code>arr[i]</code> <em>means</em> <code>*(arr + i)</code>, and slide 19 already taught you that <code>arr + i</code> steps by <code>sizeof(int)</code>. A pointer to a contiguous block and an array are the same thing to the indexing operator.</li>
<li><strong><code>&amp;arr[i]</code> in the scanf</strong> — read it as "the address of the i-th element". Equivalent spelling: <code>arr + i</code>. Both are correct; the first is what you will write, the second is what the compiler sees.</li>
<li><strong>Line 30: <code>free(arr);</code></strong> — one allocation, one free, placed at the end of the function it was allocated in. That is the pattern to copy.</li>
<li><strong>What is still missing</strong> — nobody checks that <code>n</code> is positive. Enter <code>0</code> and <code>malloc(0)</code> may return either <code>NULL</code> or a valid pointer to zero bytes; enter a negative number and <code>n * sizeof(int)</code> converts to a colossal unsigned value and the allocation fails. Validate input before allocating.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

int main() {
    int n, i;
    printf("Enter the number of elements: ");
    scanf("%d", &amp;n);

    /* Dynamically allocate memory */
    int *arr = (int *)malloc(n * sizeof(int));
    if (arr == NULL) {
        printf("Memory allocation failed\\n");
        return 1;
    }

    /* Input values */
    printf("Enter %d elements:\\n", n);
    for (i = 0; i &lt; n; i++) {
        scanf("%d", &amp;arr[i]);
    }

    /* Display values */
    printf("You entered:\\n");
    for (i = 0; i &lt; n; i++) {
        printf("%d ", arr[i]);
    }
    printf("\\n");

    /* Free the allocated memory */
    free(arr);
    return 0;
}</code></pre>
<p class="dap-an">✅ Compiled with <code>cc -Wall</code> and run with the slide's own input — <code>5</code> then <code>10 5 7 20 6</code> — the output is <code>You entered:</code> followed by <strong><code>10 5 7 20 6</code></strong>, character for character what the black console on the slide shows. The 20 bytes came from the heap and were handed back by line 30.</p>
<p class="meo">💡 This program is the template for every "read N items then process them" exercise in the rest of the course: <em>read n → check n → malloc n × sizeof → check NULL → loop to fill → loop to use → free</em>. Learn those seven steps as a unit and the array chapters (Slot 13–15) will feel like revision.</p>`,
        `<p class="y-chinh">🎯 Demo cho thấy <em>vì sao</em> cấp phát động tồn tại: một mảng mà kích thước do người dùng gõ vào lúc chạy. Đây đúng là thứ bạn không thể làm bằng <code>int arr[n];</code> trong C89, và cả phần học này đã dẫn tới đây.</p>
<ul>
<li><strong>Dòng 7: <code>scanf("%d", &amp;n);</code></strong> — <code>n</code> chưa hề được biết lúc biên dịch chương trình. Rồi dòng 10 viết <code>int *arr = (int *)malloc(n * sizeof(int));</code>, định cỡ khối nhớ bằng một giá trị vừa mới ra đời một phần triệu giây trước.</li>
<li><strong>Dòng 11–14 là phép kiểm <code>NULL</code> làm đúng bài bản</strong> — <code>if (arr == NULL) { printf("Memory allocation failed\\n"); return 1; }</code>. Chú ý lệnh <code>return 1</code>: nó dừng chương trình lại thay vì chạy tiếp rồi lấy giá trị qua con trỏ rỗng. Trả về một giá trị khác 0 từ <code>main</code> là quy ước của C để nói "lần chạy này thất bại".</li>
<li><strong><code>arr[i]</code> dùng được trên khối malloc</strong> — dòng 18–20 đọc bằng <code>scanf("%d", &amp;arr[i])</code> và dòng 24–26 in bằng <code>arr[i]</code>, y hệt như thể <code>arr</code> được khai báo là một mảng. Là vì <code>arr[i]</code> <em>có nghĩa là</em> <code>*(arr + i)</code>, mà slide 19 đã dạy bạn rằng <code>arr + i</code> nhảy theo <code>sizeof(int)</code>. Với toán tử chỉ số, một con trỏ tới khối liền mạch và một mảng là cùng một thứ.</li>
<li><strong><code>&amp;arr[i]</code> trong scanf</strong> — đọc là "địa chỉ của phần tử thứ i". Cách viết tương đương: <code>arr + i</code>. Cả hai đều đúng; cách đầu là thứ bạn sẽ gõ, cách sau là thứ trình biên dịch nhìn thấy.</li>
<li><strong>Dòng 30: <code>free(arr);</code></strong> — một lần cấp phát, một lần giải phóng, đặt ở cuối chính cái hàm đã cấp phát nó. Đó là khuôn mẫu để chép theo.</li>
<li><strong>Vẫn còn thiếu gì</strong> — không ai kiểm tra rằng <code>n</code> là số dương. Nhập <code>0</code> thì <code>malloc(0)</code> có thể trả <code>NULL</code> hoặc trả một con trỏ hợp lệ tới không byte nào; nhập số âm thì <code>n * sizeof(int)</code> chuyển thành một số không dấu khổng lồ và cấp phát thất bại. Hãy kiểm tra đầu vào trước khi cấp phát.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

int main() {
    int n, i;
    printf("Enter the number of elements: ");
    scanf("%d", &amp;n);

    /* Cap phat dong */
    int *arr = (int *)malloc(n * sizeof(int));
    if (arr == NULL) {
        printf("Memory allocation failed\\n");
        return 1;
    }

    /* Nhap du lieu */
    printf("Enter %d elements:\\n", n);
    for (i = 0; i &lt; n; i++) {
        scanf("%d", &amp;arr[i]);
    }

    /* Hien thi du lieu */
    printf("You entered:\\n");
    for (i = 0; i &lt; n; i++) {
        printf("%d ", arr[i]);
    }
    printf("\\n");

    /* Giai phong vung nho */
    free(arr);
    return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch bằng <code>cc -Wall</code> và chạy thật với chính đầu vào của slide — <code>5</code> rồi <code>10 5 7 20 6</code> — kết quả là <code>You entered:</code> rồi <strong><code>10 5 7 20 6</code></strong>, khớp từng ký tự với khung console đen trên slide. Hai mươi byte ấy lấy từ heap và được trả lại ở dòng 30.</p>
<p class="meo">💡 Chương trình này là khuôn mẫu cho mọi bài "đọc N phần tử rồi xử lý" còn lại của môn học: <em>đọc n → kiểm n → malloc n × sizeof → kiểm NULL → vòng lặp nhập → vòng lặp dùng → free</em>. Học thuộc bảy bước ấy thành một khối thì các chương về mảng (Slot 13–15) sẽ như ôn lại bài cũ.</p>`],

      [33, 'Dynamic Allocated Data: Note',
        `<p class="y-chinh">🎯 Four rules, and they are the four ways students lose marks (and real programs lose stability). Learn them as a checklist you run over every allocation you ever write.</p>
<ul>
<li><strong>Rule 1 — <em>"Always check if the pointer returned by malloc, calloc, or realloc is NULL."</em></strong> Dereferencing <code>NULL</code> is an immediate crash on any modern OS. The check is three lines and it converts "segmentation fault" into a message you wrote yourself.</li>
<li><strong>Rule 2 — <em>"Always use free to deallocate when it's no longer needed."</em></strong> Note "when no longer needed", not "at the end of main". A block held longer than necessary in a loop is how a program that ran fine for an hour dies at hour three.</li>
<li><strong>Rule 3 — <em>"Avoid memory leaks by freeing all allocated memory."</em></strong> A leak is not just a forgotten <code>free</code>: the more common shape is <strong>losing the pointer</strong>. Overwrite <code>p</code> with a second <code>malloc</code>, or let <code>p</code> go out of scope, and the block is still allocated with nothing on earth pointing at it.</li>
<li><strong>Rule 4 — <em>"Avoid using free on pointers that were not dynamically allocated."</em></strong> <code>int n; free(&amp;n);</code> corrupts the allocator. So does freeing a pointer you moved (<code>p++</code> then <code>free(p)</code>) and freeing the same block twice. <code>free</code> wants exactly the address the allocator gave you, exactly once.</li>
<li><strong>The rule the slide leaves out</strong> — after <code>free(p)</code>, write <code>p = NULL;</code>. Slide 29's own example does it in a comment (<em>"Avoids dangling pointer"</em>) but this Note page omits it. It is the cheapest safety line in C: it makes a double free harmless and a use-after-free crash loudly instead of corrupting silently.</li>
<li><strong>Why the compiler cannot help you here</strong> — none of these four is a syntax error. <code>cc -Wall</code> will not warn about a missing <code>free</code> or an unchecked <code>malloc</code>. Tools like <code>valgrind</code> or <code>-fsanitize=address</code> exist precisely because this whole page is invisible to the compiler.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

int main(void) {
    /* RO RI dien hinh: ghi de con tro goc */
    int *p = (int *)malloc(4 * sizeof(int));
    if (p == NULL) return 1;
    p[0] = 7;
    printf("truoc: p = %p, p[0] = %d\\n", (void *)p, p[0]);

    p = (int *)malloc(2 * sizeof(int));   /* 16 byte cu MAT DUONG VE */
    if (p == NULL) return 1;
    printf("sau  : p = %p\\n", (void *)p);

    free(p);
    p = NULL;                              /* dong slide 33 khong nhac */
    free(p);                               /* free(NULL) -&gt; vo hai     */
    return 0;
}</code></pre>
<p class="dap-an">✅ Compiled and run: <code>truoc: p = 0x100706070, p[0] = 7</code> then <code>sau : p = 0x100706080</code>. The first 16-byte block is still allocated and there is now no pointer anywhere in the program holding <code>0x100706070</code> — that is a leak, and note that the program printed nothing unusual and exited with status 0. <code>cc -Wall</code> gave not one warning.</p>
<p class="pitfall">⚠️ The leak above is invisible in this course because the OS reclaims everything at exit. Check it properly with <code>cc -g -fsanitize=address prog.c</code> (clang/gcc) or <code>valgrind --leak-check=full ./prog</code>: both print the exact line of the <code>malloc</code> that was never freed. Run one of them once on your own assignment — it is a genuinely humbling five minutes.</p>`,
        `<p class="y-chinh">🎯 Bốn quy tắc, và đó cũng là bốn cách sinh viên mất điểm (còn chương trình thật thì mất sự ổn định). Hãy học chúng như một danh mục kiểm tra chạy qua mọi lần cấp phát bạn từng viết.</p>
<ul>
<li><strong>Quy tắc 1 — <em>"Luôn kiểm tra con trỏ do malloc, calloc, realloc trả về có phải NULL không."</em></strong> Lấy giá trị qua <code>NULL</code> là sập ngay lập tức trên mọi hệ điều hành hiện đại. Phép kiểm chỉ ba dòng và nó đổi một "segmentation fault" thành một thông báo do chính bạn viết.</li>
<li><strong>Quy tắc 2 — <em>"Luôn dùng free để thu hồi khi không còn cần nữa."</em></strong> Để ý câu "khi không còn cần", chứ không phải "ở cuối hàm main". Giữ một khối lâu hơn mức cần thiết trong một vòng lặp chính là cách một chương trình chạy ngon lành suốt một giờ rồi chết ở giờ thứ ba.</li>
<li><strong>Quy tắc 3 — <em>"Tránh rò rỉ bộ nhớ bằng cách giải phóng hết những gì đã cấp phát."</em></strong> Rò rỉ không chỉ là quên một lệnh <code>free</code>: dạng phổ biến hơn là <strong>làm mất con trỏ</strong>. Ghi đè <code>p</code> bằng một lần <code>malloc</code> thứ hai, hoặc để <code>p</code> ra khỏi phạm vi, là khối nhớ vẫn đang được cấp mà không còn thứ gì trên đời trỏ vào nó.</li>
<li><strong>Quy tắc 4 — <em>"Tránh dùng free trên con trỏ không được cấp phát động."</em></strong> <code>int n; free(&amp;n);</code> làm hỏng bộ cấp phát. Giải phóng một con trỏ đã bị dịch (<code>p++</code> rồi <code>free(p)</code>) hay giải phóng cùng một khối hai lần cũng vậy. <code>free</code> muốn nhận đúng cái địa chỉ mà bộ cấp phát đã đưa, đúng một lần.</li>
<li><strong>Quy tắc mà slide bỏ sót</strong> — sau <code>free(p)</code>, hãy viết <code>p = NULL;</code>. Chính ví dụ ở slide 29 có làm chuyện đó kèm chú thích (<em>"Avoids dangling pointer"</em>) nhưng trang Note này lại bỏ quên. Đó là dòng an toàn rẻ nhất trong C: nó khiến một vụ double free thành vô hại, và khiến việc dùng vùng nhớ đã giải phóng sập thật to thay vì phá hoại âm thầm.</li>
<li><strong>Vì sao trình biên dịch không giúp được ở đây</strong> — không cái nào trong bốn điều trên là lỗi cú pháp. <code>cc -Wall</code> sẽ không cảnh báo về một lệnh <code>free</code> bị thiếu hay một lần <code>malloc</code> không kiểm tra. Những công cụ như <code>valgrind</code> hay <code>-fsanitize=address</code> tồn tại đúng là vì cả trang này vô hình với trình biên dịch.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

int main(void) {
    /* RO RI dien hinh: ghi de con tro goc */
    int *p = (int *)malloc(4 * sizeof(int));
    if (p == NULL) return 1;
    p[0] = 7;
    printf("truoc: p = %p, p[0] = %d\\n", (void *)p, p[0]);

    p = (int *)malloc(2 * sizeof(int));   /* 16 byte cu MAT DUONG VE */
    if (p == NULL) return 1;
    printf("sau  : p = %p\\n", (void *)p);

    free(p);
    p = NULL;                              /* dong slide 33 khong nhac */
    free(p);                               /* free(NULL) -&gt; vo hai     */
    return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch và chạy thật: <code>truoc: p = 0x100706070, p[0] = 7</code> rồi <code>sau : p = 0x100706080</code>. Khối 16 byte đầu tiên vẫn đang được cấp phát và trong cả chương trình không còn con trỏ nào giữ <code>0x100706070</code> nữa — đó là rò rỉ, và hãy để ý rằng chương trình không in ra điều gì bất thường, kết thúc với mã trạng thái 0. <code>cc -Wall</code> không cho lấy một cảnh báo nào.</p>
<p class="pitfall">⚠️ Vụ rò rỉ trên vô hình trong môn học này vì hệ điều hành thu hồi mọi thứ lúc thoát. Muốn kiểm cho đúng thì dùng <code>cc -g -fsanitize=address prog.c</code> (clang/gcc) hoặc <code>valgrind --leak-check=full ./prog</code>: cả hai đều in ra đúng dòng <code>malloc</code> chưa từng được giải phóng. Hãy chạy thử một lần trên bài assignment của chính bạn — năm phút đó dạy được khá nhiều điều.</p>`],

      [34, 'Exercise 6:',
        `<p class="y-chinh">🎯 <em>"Write a C program using dynamic allocating memory to allow user entering two characters then the program will print out characters between these in ascending order."</em> Example: input <code>DA</code>, output a table of the letters A…D with their codes. Then: draw the memory map.</p>
<ul>
<li><strong>Why the input is "DA" and not "AD"</strong> — the exercise deliberately gives you the two characters in the <em>wrong</em> order so that you must sort them before looping. <code>for (c = first; c &lt;= second; c++)</code> with first='D' and second='A' prints nothing at all.</li>
<li><strong>How to loop over letters</strong> — a <code>char</code> is a small integer, so <code>c++</code> moves to the next character code and <code>hi - lo + 1</code> counts how many there are. From 'A' (65) to 'D' (68) that is 4 characters.</li>
<li><strong>Where the "dynamic allocating memory" comes in</strong> — the exercise requires it. Minimum: allocate the two input characters on the heap (<code>char *p = malloc(sizeof(char))</code>) and read with <code>scanf(" %c", p)</code> — no <code>&amp;</code>, because <code>p</code> is already an address. Better: also allocate the <code>n</code>-character result list, which is the part that genuinely needs a run-time size.</li>
<li><strong>The space in <code>scanf(" %c", ...)</code> matters</strong> — <code>%c</code> does not skip whitespace, so without the leading space the second read grabs the newline you pressed after the first character. This is the single most common bug in character-input exercises.</li>
<li><strong>Reading the output table</strong> — four columns: the character, then its code in three different bases. For 'A': decimal <strong>65</strong>, then the middle column, then hexadecimal <strong>41</strong>. The middle column is meant to be octal.</li>
<li><strong>The memory map to draw</strong> — Stack: <code>pFirst</code>, <code>pSecond</code>, <code>pList</code>, <code>lo</code>, <code>hi</code>, <code>n</code>, <code>i</code>. Heap: one 1-byte block per input character plus one <code>n</code>-byte block for the list. Three arrows from stack to heap, and three matching <code>free</code> calls at the end.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

int main(void) {
    char *pFirst, *pSecond, *pList;
    char c, lo, hi;
    int n, i;

    pFirst  = (char *) malloc(sizeof(char));
    pSecond = (char *) malloc(sizeof(char));
    if (pFirst == NULL || pSecond == NULL) {
        printf("Memory allocation failed\\n");
        free(pFirst); free(pSecond);
        return 1;
    }

    printf("Input 2 characters: ");
    scanf(" %c %c", pFirst, pSecond);      /* khong co &amp;, va co dau cach */

    lo = (*pFirst &lt;= *pSecond) ? *pFirst : *pSecond;   /* sap xep truoc */
    hi = (*pFirst &lt;= *pSecond) ? *pSecond : *pFirst;

    n = hi - lo + 1;
    pList = (char *) malloc(n * sizeof(char));         /* co biet luc CHAY */
    if (pList == NULL) {
        printf("Memory allocation failed\\n");
        free(pFirst); free(pSecond);
        return 1;
    }
    for (i = 0; i &lt; n; i++) pList[i] = (char)(lo + i);

    for (i = 0; i &lt; n; i++) {
        c = pList[i];
        printf("%c\\t%d\\t%o\\t%X\\n", c, c, c, c);   /* ky tu, he 10, he 8, he 16 */
    }

    free(pList);   pList   = NULL;
    free(pFirst);  pFirst  = NULL;
    free(pSecond); pSecond = NULL;
    return 0;
}</code></pre>
<p class="dap-an">✅ Đáp án — compiled with <code>cc -Wall</code> and run with input <code>D A</code>, the program prints four rows: <code>A 65 101 41</code> · <code>B 66 102 42</code> · <code>C 67 103 43</code> · <code>D 68 104 44</code> (character, decimal, octal, hexadecimal). The ascending order is produced by sorting the two inputs before the loop, which is exactly what the "DA" example is testing. <strong>⚠️ The table printed on the slide gives the middle column as 81, 82, 83, 84 — that is wrong.</strong> Octal 65 is <code>101</code>, not <code>81</code>; the slide's numbers look like the result of computing 65 ÷ 8 = 8 remainder 1 and writing "8" next to "1" without converting the quotient 8 into octal (which is 10). The hexadecimal column (41, 42, 43, 44) is correct, because there the quotient 4 is already a single hex digit. I have not altered the slide — I am reporting the discrepancy, and the values above are what a real compiler prints.</p>
<p class="pitfall">⚠️ Two more traps. <strong>Case matters</strong>: 'a' is 97, so input <code>a A</code> gives lo='A' (65) and hi='a' (97) and the loop prints all 33 characters in between, including <code>[ \\ ] ^ _ \`</code>. Decide whether your program should accept that or reject it. And <strong>allocate <code>hi - lo + 1</code>, not <code>hi - lo</code></strong> — the classic off-by-one: from A to D there are 4 characters, not 3, and writing the fourth into a 3-byte block corrupts the heap silently.</p>`,
        `<p class="y-chinh">🎯 <em>"Viết chương trình C dùng cấp phát bộ nhớ động cho phép người dùng nhập hai ký tự, rồi chương trình in ra các ký tự nằm giữa chúng theo thứ tự tăng dần."</em> Ví dụ: nhập <code>DA</code>, in ra bảng các chữ A…D kèm mã. Sau đó: vẽ bản đồ bộ nhớ.</p>
<ul>
<li><strong>Vì sao đề cho "DA" chứ không phải "AD"</strong> — đề cố ý đưa hai ký tự theo thứ tự <em>ngược</em> để bắt bạn phải sắp xếp trước khi lặp. Viết <code>for (c = first; c &lt;= second; c++)</code> với first='D' và second='A' thì chẳng in ra gì cả.</li>
<li><strong>Lặp trên chữ cái thế nào</strong> — một <code>char</code> là một số nguyên nhỏ, nên <code>c++</code> chuyển sang mã ký tự kế tiếp, và <code>hi - lo + 1</code> đếm được có bao nhiêu ký tự. Từ 'A' (65) tới 'D' (68) là 4 ký tự.</li>
<li><strong>"Cấp phát động" vào chỗ nào</strong> — đề bắt buộc phải có. Tối thiểu: cấp phát hai ký tự nhập vào trên heap (<code>char *p = malloc(sizeof(char))</code>) và đọc bằng <code>scanf(" %c", p)</code> — không có <code>&amp;</code>, vì <code>p</code> vốn đã là địa chỉ. Tốt hơn: cấp phát luôn danh sách <code>n</code> ký tự kết quả, vì đó mới là phần thật sự cần kích thước lúc chạy.</li>
<li><strong>Dấu cách trong <code>scanf(" %c", ...)</code> là quan trọng</strong> — <code>%c</code> KHÔNG bỏ qua khoảng trắng, nên thiếu dấu cách đứng trước thì lần đọc thứ hai vớ ngay ký tự xuống dòng bạn vừa gõ sau ký tự thứ nhất. Đây là lỗi phổ biến nhất trong các bài nhập ký tự.</li>
<li><strong>Đọc bảng kết quả</strong> — bốn cột: ký tự, rồi mã của nó trong ba hệ cơ số. Với 'A': hệ 10 là <strong>65</strong>, rồi tới cột giữa, rồi hệ 16 là <strong>41</strong>. Cột giữa đáng lẽ phải là hệ 8.</li>
<li><strong>Bản đồ bộ nhớ cần vẽ</strong> — Stack: <code>pFirst</code>, <code>pSecond</code>, <code>pList</code>, <code>lo</code>, <code>hi</code>, <code>n</code>, <code>i</code>. Heap: mỗi ký tự nhập vào một khối 1 byte, cộng một khối <code>n</code> byte cho danh sách. Ba mũi tên từ stack sang heap, và ba lệnh <code>free</code> tương ứng ở cuối.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

int main(void) {
    char *pFirst, *pSecond, *pList;
    char c, lo, hi;
    int n, i;

    pFirst  = (char *) malloc(sizeof(char));
    pSecond = (char *) malloc(sizeof(char));
    if (pFirst == NULL || pSecond == NULL) {
        printf("Memory allocation failed\\n");
        free(pFirst); free(pSecond);
        return 1;
    }

    printf("Input 2 characters: ");
    scanf(" %c %c", pFirst, pSecond);      /* khong co &amp;, va co dau cach */

    lo = (*pFirst &lt;= *pSecond) ? *pFirst : *pSecond;   /* sap xep truoc */
    hi = (*pFirst &lt;= *pSecond) ? *pSecond : *pFirst;

    n = hi - lo + 1;
    pList = (char *) malloc(n * sizeof(char));         /* co biet luc CHAY */
    if (pList == NULL) {
        printf("Memory allocation failed\\n");
        free(pFirst); free(pSecond);
        return 1;
    }
    for (i = 0; i &lt; n; i++) pList[i] = (char)(lo + i);

    for (i = 0; i &lt; n; i++) {
        c = pList[i];
        printf("%c\\t%d\\t%o\\t%X\\n", c, c, c, c);   /* ky tu, he 10, he 8, he 16 */
    }

    free(pList);   pList   = NULL;
    free(pFirst);  pFirst  = NULL;
    free(pSecond); pSecond = NULL;
    return 0;
}</code></pre>
<p class="dap-an">✅ Đáp án — đã biên dịch bằng <code>cc -Wall</code> và chạy thật với đầu vào <code>D A</code>, chương trình in ra bốn dòng: <code>A 65 101 41</code> · <code>B 66 102 42</code> · <code>C 67 103 43</code> · <code>D 68 104 44</code> (ký tự, hệ 10, hệ 8, hệ 16). Thứ tự tăng dần có được là nhờ sắp xếp hai ký tự nhập vào trước khi lặp — đúng cái mà ví dụ "DA" đang kiểm tra. <strong>⚠️ Bảng in trên slide ghi cột giữa là 81, 82, 83, 84 — con số đó SAI.</strong> Hệ 8 của 65 là <code>101</code> chứ không phải <code>81</code>; các số của slide trông đúng như kết quả của phép tính 65 : 8 = 8 dư 1 rồi ghép "8" cạnh "1" mà quên đổi thương số 8 sang hệ 8 (là 10). Cột hệ 16 (41, 42, 43, 44) thì đúng, vì ở đó thương số 4 vốn đã là một chữ số hệ 16. Tôi KHÔNG sửa slide — chỉ nêu rõ chỗ lệch, và các giá trị ở trên là thứ một trình biên dịch thật in ra.</p>
<p class="pitfall">⚠️ Hai cái bẫy nữa. <strong>Chữ hoa chữ thường là khác nhau</strong>: 'a' là 97, nên nhập <code>a A</code> sẽ cho lo='A' (65) và hi='a' (97), vòng lặp in ra cả 33 ký tự ở giữa, gồm cả <code>[ \\ ] ^ _ \`</code>. Hãy quyết định chương trình của bạn chấp nhận hay từ chối trường hợp đó. Và <strong>cấp phát <code>hi - lo + 1</code>, không phải <code>hi - lo</code></strong> — lỗi lệch một kinh điển: từ A tới D có 4 ký tự chứ không phải 3, và ghi ký tự thứ tư vào một khối 3 byte là phá hỏng heap một cách âm thầm.</p>`],

      [35, 'Summary',
        `<p class="y-chinh">🎯 The closing slide repeats the contents list from slide 3, unchanged — which is the point: everything promised at the start has now been delivered. Use it as your revision checklist, and be able to say one sentence about each line.</p>
<ul>
<li><strong>Memory structure and where data goes</strong> (slides 4–6) — Code segment holds the instructions, Data segment holds globals, Stack segment holds locals (created and destroyed automatically), Heap holds dynamic data (created and destroyed by you). Demo 1 on slide 30 measured all four.</li>
<li><strong>What pointers are, and declaring them</strong> (slides 7–8) — a pointer is a variable holding the address of another variable; <code>dataType *pointerName;</code>. The type is not decoration: it decides how many bytes <code>*</code> touches and how far <code>+1</code> moves.</li>
<li><strong>Where they are used</strong> (slide 9) — five reasons, and slides 22–32 delivered the first and the last of them: modifying outside arguments, and allocating memory directly.</li>
<li><strong>Operators, assigning, and access</strong> (slides 10–15) — <code>&amp;</code> takes an address, <code>*</code> follows one. <code>&amp;</code> and <code>*</code> are inverses: <code>*(&amp;n)</code> is <code>n</code>.</li>
<li><strong>Arithmetic and comparison</strong> (slides 16–21) — <code>p + i</code> means <code>p + i * sizeof(baseType)</code>; two pointers of the same type can be compared. Exercises 3, 4 and 5 were the drill.</li>
<li><strong>Pointers as parameters</strong> (slides 22–23) — the answer to "why can't my function change <code>a</code>?": pass <code>&amp;a</code> and dereference. This is the single most exam-relevant idea in the chapter, and it is why <code>scanf</code> has always needed <code>&amp;</code>.</li>
<li><strong>Dynamic allocated data</strong> (slides 24–34) — <code>malloc</code> (bytes, uninitialised) · <code>calloc</code> (items, zeroed) · <code>realloc</code> (resize, may move, reassign the pointer) · <code>free</code> (once, exactly, then set to <code>NULL</code>). Always check for <code>NULL</code>; never leak.</li>
<li><strong>What comes next</strong> — Slot 11–12 (libraries) and Slot 13–15 (arrays and structs) both assume this chapter. <code>arr[i]</code> is <code>*(arr + i)</code>; passing an array to a function is passing a pointer; strings in Slot 16–18 are <code>char*</code>. Pointers do not go away — they become the background.</li>
</ul>
<table>
<tr><th>Concept</th><th>Syntax</th><th>The trap</th></tr>
<tr><td>Address-of</td><td><code>int *p = &amp;n;</code></td><td>Types must match: <code>int*</code> to <code>int</code></td></tr>
<tr><td>Dereference</td><td><code>*p = 100;</code></td><td>Touches <code>sizeof(int)</code> bytes, not 1</td></tr>
<tr><td>Arithmetic</td><td><code>p + i</code></td><td>Scaled by <code>sizeof(baseType)</code></td></tr>
<tr><td>Out parameter</td><td><code>f(&amp;a)</code> + <code>*px</code> inside</td><td>Miss one <code>*</code> and it silently does nothing</td></tr>
<tr><td>Allocate</td><td><code>(int*)malloc(n*sizeof(int))</code></td><td>Unchecked <code>NULL</code>; bytes not items</td></tr>
<tr><td>Release</td><td><code>free(p); p = NULL;</code></td><td>Double free, dangling pointer, leak</td></tr>
</table>
<p class="meo">💡 Three sentences worth memorising verbatim for the exam: <em>"<code>&amp;</code> gives an address, <code>*</code> follows one."</em> · <em>"Pointer arithmetic counts elements, not bytes."</em> · <em>"Every <code>malloc</code> needs exactly one <code>free</code>, and the pointer should be <code>NULL</code> afterwards."</em> Almost every question in this chapter is one of those three, dressed up.</p>`,
        `<p class="y-chinh">🎯 Slide khép lại lặp nguyên danh sách nội dung ở slide 3, không đổi một chữ — và đó chính là ý: mọi thứ hứa lúc mở đầu giờ đã trả đủ. Hãy dùng nó làm danh mục ôn tập, và phải nói được một câu về từng dòng.</p>
<ul>
<li><strong>Cấu trúc bộ nhớ và dữ liệu nằm ở đâu</strong> (slide 4–6) — Code segment giữ lệnh, Data segment giữ biến toàn cục, Stack segment giữ biến cục bộ (tự tạo và tự huỷ), Heap giữ dữ liệu động (do bạn tạo và bạn huỷ). Demo 1 ở slide 30 đã đo được cả bốn.</li>
<li><strong>Con trỏ là gì và khai báo thế nào</strong> (slide 7–8) — con trỏ là một biến giữ địa chỉ của một biến khác; <code>dataType *pointerName;</code>. Cái kiểu ấy không phải để trang trí: nó quyết định <code>*</code> chạm vào bao nhiêu byte và <code>+1</code> dịch đi bao xa.</li>
<li><strong>Dùng chúng ở đâu</strong> (slide 9) — năm lý do, và slide 22–32 đã trả bài cho lý do đầu tiên lẫn lý do cuối cùng: sửa đối số bên ngoài, và cấp phát bộ nhớ trực tiếp.</li>
<li><strong>Toán tử, gán và truy cập</strong> (slide 10–15) — <code>&amp;</code> lấy địa chỉ, <code>*</code> đi theo địa chỉ. Hai toán tử này ngược nhau: <code>*(&amp;n)</code> chính là <code>n</code>.</li>
<li><strong>Số học và so sánh</strong> (slide 16–21) — <code>p + i</code> nghĩa là <code>p + i * sizeof(baseType)</code>; hai con trỏ cùng kiểu thì so sánh được với nhau. Exercise 3, 4 và 5 là phần luyện tay.</li>
<li><strong>Con trỏ làm tham số</strong> (slide 22–23) — câu trả lời cho "sao hàm của tôi không đổi được <code>a</code>?": truyền <code>&amp;a</code> rồi lấy giá trị qua <code>*</code>. Đây là ý quan trọng nhất của cả chương về mặt thi cử, và cũng là lý do <code>scanf</code> xưa nay luôn cần dấu <code>&amp;</code>.</li>
<li><strong>Dữ liệu cấp phát động</strong> (slide 24–34) — <code>malloc</code> (theo byte, không khởi tạo) · <code>calloc</code> (theo phần tử, đặt về 0) · <code>realloc</code> (đổi cỡ, có thể DỜI, phải gán lại con trỏ) · <code>free</code> (đúng một lần, rồi gán <code>NULL</code>). Luôn kiểm <code>NULL</code>; đừng bao giờ để rò rỉ.</li>
<li><strong>Tiếp theo là gì</strong> — Slot 11–12 (thư viện) và Slot 13–15 (mảng và struct) đều mặc định bạn đã nắm chương này. <code>arr[i]</code> chính là <code>*(arr + i)</code>; truyền một mảng vào hàm chính là truyền một con trỏ; chuỗi ký tự ở Slot 16–18 chính là <code>char*</code>. Con trỏ không biến mất — nó trở thành nền của mọi thứ.</li>
</ul>
<table>
<tr><th>Khái niệm</th><th>Cú pháp</th><th>Cái bẫy</th></tr>
<tr><td>Lấy địa chỉ</td><td><code>int *p = &amp;n;</code></td><td>Kiểu phải khớp: <code>int*</code> với <code>int</code></td></tr>
<tr><td>Lấy giá trị qua con trỏ</td><td><code>*p = 100;</code></td><td>Chạm <code>sizeof(int)</code> byte, không phải 1</td></tr>
<tr><td>Số học con trỏ</td><td><code>p + i</code></td><td>Bị nhân với <code>sizeof(baseType)</code></td></tr>
<tr><td>Tham số trả ra</td><td><code>f(&amp;a)</code> + <code>*px</code> bên trong</td><td>Thiếu một dấu <code>*</code> là im lặng không làm gì</td></tr>
<tr><td>Cấp phát</td><td><code>(int*)malloc(n*sizeof(int))</code></td><td>Quên kiểm <code>NULL</code>; đếm byte chứ không đếm phần tử</td></tr>
<tr><td>Thu hồi</td><td><code>free(p); p = NULL;</code></td><td>Free hai lần, con trỏ treo, rò rỉ</td></tr>
</table>
<p class="meo">💡 Ba câu đáng học thuộc từng chữ để đi thi: <em>"<code>&amp;</code> cho ra địa chỉ, <code>*</code> đi theo địa chỉ."</em> · <em>"Số học con trỏ đếm theo phần tử, không theo byte."</em> · <em>"Mỗi <code>malloc</code> cần đúng một <code>free</code>, và sau đó con trỏ nên được gán <code>NULL</code>."</em> Gần như mọi câu hỏi trong chương này chỉ là một trong ba câu ấy khoác áo khác.</p>`],
    ]),
  ].join('\n'),
};
