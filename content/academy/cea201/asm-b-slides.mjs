/**
 * CEA201 · Deck cea15 (CH15-COA11e.pptx) — "Assembly Language and Related
 * Topics", PHẦN B: slide 20–37. Ứng cụm 6 buổi liên tiếp 39–44 của trường,
 * "Practical Assembly Language with MARIE" (CLO7 + CLO10) — phần thực hành
 * nặng nhất của môn.
 *
 * ⚠️ NỘI DUNG THẬT của slide 20–37 (đọc từ /tmp/cea201-text/cea15.txt và đọc
 * THẲNG ẢNH render với những slide chỉ có tiêu đề):
 *   20–24 ví dụ hợp ngữ x86 (GCD, số nguyên tố, chuỗi) + bảng lệnh chuỗi
 *   25–28 CÁC LOẠI TRÌNH DỊCH HỢP NGỮ, two-pass, mã hoá lệnh ARM, one-pass
 *   29–36 TẢI, LIÊN KẾT, ĐỊNH VỊ LẠI, gắn địa chỉ, liên kết động (load-time,
 *         run-time, DLL hell)
 *   37    Summary
 * ⇒ Nửa đầu KHÔNG phải linking/loading. Tiêu đề bài đã mở rộng cho khớp; slug
 *    giữ nguyên theo yêu cầu đặt hàng.
 *
 * ⚠️ MỌI phép đo trong bài đều CHẠY THẬT trên máy viết bài (Apple M1 Max,
 * macOS 26, Apple clang 17.0.0, target arm64-apple-darwin25.6.0):
 *   · cc -S / cc -c / nm / otool -tv / otool -r / otool -L / ar / -dynamiclib
 *     trên cặp gcd.c + helper.c → chứng minh U (chưa phân giải) trong .o thành
 *     địa chỉ thật sau liên kết: bl 0x20 → bl _gcd (0x1000004ac).
 *   · Lỗi "Undefined symbols for architecture arm64: _gcd" xảy ra ở LIÊN KẾT,
 *     trong khi cc -c cùng file đó vẫn trả về 0 — in nguyên văn trong bài.
 *   · Thư viện 300 hàm: liên kết TĨNH 76.184 B so với ĐỘNG 45.272 B (1,68×);
 *     khởi động (trung vị 300 lượt) 3,021 ms so với 3,198 ms.
 *   · Thay .dylib mà KHÔNG dịch lại: bản động đổi kết quả 6 → 999, bản tĩnh
 *     vẫn 6. Đây là bằng chứng trực tiếp cho "dễ nâng cấp phiên bản" (slide 35)
 *     và cho DLL hell (slide 36).
 *   · ASLR: 4 lượt chạy, _main và _g DỜI CÙNG MỘT LƯỢNG (0x858000 · 0x4af4000 ·
 *     0x2d98000 · 0x2d0c000) — định vị lại là PHÉP CỘNG MỘT HẰNG SỐ.
 *   · Chương trình C của Figure 15.5 đã biên dịch và chạy → in đúng 15 số
 *     nguyên tố ≤ 50, đối chiếu với python.
 *   · Cả HAI chương trình hợp ngữ x86 của Figure 15.4 đã mô phỏng bằng python3
 *     trên 59×59 và 60×60 cặp đầu vào: 0 ca sai (quy ước gcd(0,0) = 1).
 *   · MARIE: tự viết trình dịch 2 lượt + máy mô phỏng bằng python3
 *     (assemble/run, đủ 15 mã lệnh). Bốn bài tập chạy thật:
 *     tổng dãy = 62 (73 nhịp) · max = 30 (59 nhịp) · đếm chẵn = 3 (340 nhịp) ·
 *     7×6 = 42 (62 nhịp). Bảng vết lấy từ máy, KHÔNG chạy tay.
 *
 * ⛔ LỖI TÌM ĐƯỢC TRONG SLIDE GỐC (nêu rõ trong bài, KHÔNG tự sửa slide):
 *   · slide 27 (Figure 15.9): dải bit ghi opcode = 0010, nhưng 0010 là mã của
 *     SUB; ADD là 0100. Đối chiếu bằng trình dịch thật (clang -target
 *     armv7-none-eabi): ADDS r3,r3,#19 = 0xE2933013, còn đúng dải bit trên
 *     slide = 0xE2533013 = SUBS r3,r3,#19.
 *   · slide 20 (Figure 15.4a): nhãn ghi "L3;" thay vì "L3:".
 *   · slide 23 (Table 15.3): ghi "STOSSB", tên thật là STOSB.
 *   · slide 24 (Figure 15.7): rep movsb chép len = 14 byte nhưng sys_write ghi
 *     edx = 20 byte ⇒ thừa 6 byte của .bss.
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'cea15';

export default {
  title: 'ASM.b — Slide by slide: assembly examples, assemblers, then linking, loading and relocation (slides 20–37)|||ASM.b — Slide bài giảng: ví dụ hợp ngữ, trình dịch hợp ngữ, rồi liên kết · tải · định vị lại & liên kết động (slide 20–37)',
  slug: 'cea201-asm-b-slides-trinh-dich-lien-ket-tai',
  type: 'DOCUMENT',
  description: 'Nửa sau chương Hợp ngữ của CEA201 (slide 20–37), tương ứng cụm 6 buổi thực hành 39–44 "Practical Assembly Language with MARIE". Đi từ ba chương trình hợp ngữ x86 thật của sách (ước chung lớn nhất, sinh số nguyên tố, chép chuỗi) qua các loại trình dịch hợp ngữ và cơ chế hai lượt/một lượt, rồi tới nửa quan trọng nhất cho đi thi: TẢI, LIÊN KẾT, ĐỊNH VỊ LẠI và LIÊN KẾT ĐỘNG. Toàn bộ đường đi .c → hợp ngữ → .o → liên kết → tệp chạy → tiến trình được chạy THẬT trên máy bằng cc -S, cc -c, nm, otool, ar và -dynamiclib, có in nguyên output; kèm bài tính định vị lại, phép đo ASLR, bảng so tĩnh/động đo bằng byte thật, và một máy mô phỏng MARIE tự viết bằng python3 với bảng vết từng nhịp cùng bốn bài tập đã kiểm đáp án.',
  content: [
    walkHead(D, 20, 37),
    walk(D, [

      [20, 'Figure 15.4 — Assembly Programs for Greatest Common Divisor',
        `<p class="y-chinh">🎯 Two x86 programs that compute the <strong>same</strong> greatest common divisor, side by side: <strong>(a) Compiled program</strong> — what a C compiler emitted — and <strong>(b) Written directly in assembly language</strong> — what a human wrote. The point of the slide is the size of the gap: <strong>22 instruction lines versus 11</strong>.</p>
<p class="nhan">📐 Column (b), copied exactly from the slide:</p>
<pre><code>gcd:    neg     eax
        je      L3
L1:     neg     eax
        xchg    eax,edx
L2:     sub     eax,edx
        jg      L2
        jne     L1
L3:     add     eax,edx
        jne     L4
        inc     eax
L4:     ret</code></pre>
<ul>
<li><strong>Arguments arrive in registers.</strong> <code>eax</code> holds a, <code>edx</code> holds b, and the result comes back in <code>eax</code>. No memory, no stack frame — this is the register-operand case of slide 11 ("each operand identifies an immediate value, a register value, or a memory location").</li>
<li><strong>The algorithm is subtractive Euclid, not the modulo version.</strong> <code>L2: sub eax,edx</code> keeps subtracting; <code>jg L2</code> repeats while the result is still positive; when it goes negative, <code>jne L1</code> goes back, negates and swaps the two registers so the bigger one is on top again. It terminates when the subtraction lands exactly on zero.</li>
<li><strong>Why the leading <code>neg eax</code> then another <code>neg eax</code>?</strong> The first one is a free zero test — <code>neg</code> sets ZF, so <code>je L3</code> catches a = 0 without a separate <code>cmp</code>. The second undoes it. This is exactly the "accessing instructions that are not accessible from a high-level language" advantage listed on slide 6: C has no way to say "negate and reuse the flag".</li>
<li><strong>Why (a) is twice as long.</strong> The compiler cannot know that the flags from <code>neg</code> are still valid, so it re-tests with <code>test ebx,ebx</code> / <code>test edx,edx</code>; it keeps a spare copy of a in <code>ebx</code>; and it lays out the two branch directions as separate blocks (<code>L4: sub ebx,eax</code> versus <code>sub eax,ebx</code>). Every one of those is a safe, mechanical choice — and each costs an instruction.</li>
<li><strong>Read it as evidence for slide 5 AND slide 6 at once.</strong> The hand-written version wins on <em>size</em> and <em>speed</em> (slide 6: "optimizing code for size", "optimizing code for speed"), and loses on <em>readability, portability, maintainability</em> (slide 5). Neither column is "the right answer"; the slide is showing you the price tag on both sides.</li>
</ul>
<p class="nhan">📐 <strong>Verified by simulation, not by eye.</strong> Both columns were re-implemented in python3 with faithful flag semantics (ZF/SF/OF) and run over every input pair:</p>
<table>
<tr><th>Program</th><th>Inputs tested</th><th>Mismatches vs. the true GCD</th><th>gcd(48,18)</th><th>gcd(0,0)</th></tr>
<tr><td>(a) Compiled</td><td>60 × 60 = 3600 pairs</td><td><strong>0</strong></td><td>6</td><td>1</td></tr>
<tr><td>(b) Hand-written</td><td>59 × 59 = 3481 pairs</td><td><strong>0</strong></td><td>6</td><td>1</td></tr>
</table>
<p class="dap-an">✅ Both are correct, and both share one deliberate convention: <strong>gcd(0,0) returns 1</strong>. In (a) that is the explicit <code>mov eax,1</code> after both <code>test</code>s fail; in (b) it is the <code>inc eax</code> after <code>add eax,edx</code> produced zero. Mathematically gcd(0,0) is usually defined as 0 — the programs pick 1 so the result is always a legal divisor. Trace of (b) for gcd(48,18), from the simulator: <code>eax</code> goes −48 → 48 → (swap) 18 → −30 → 30 → (swap) 48 → 18 → 6 → −6 → 6 → (swap) 12 → 6 → 0, then <code>add eax,edx</code> gives <strong>6</strong>.</p>
<p class="pitfall">⚠️ Genuine typo on the slide: in column (a) the label is printed <strong><code>L3;</code></strong> with a semicolon instead of <code>L3:</code> with a colon. In Intel syntax the semicolon starts a comment (slide 13), so as printed that line defines no label at all and the two <code>jmp L3</code> below it would not assemble. Read it as <code>L3:</code>. Do not "fix" it in your own answer sheet without saying why — just note it.</p>
<p class="meo">💡 Exam hook: if you are asked "give one concrete advantage of hand-written assembly", this slide is the answer with a number attached — <strong>the same function in half the instructions</strong> (11 versus 22).</p>`,
        `<p class="y-chinh">🎯 Hai chương trình x86 tính CÙNG một ước chung lớn nhất, đặt cạnh nhau: <strong>(a) Compiled program</strong> — thứ trình biên dịch C sinh ra — và <strong>(b) Written directly in assembly language</strong> — thứ con người tự viết. Điều slide muốn cho thấy là độ chênh: <strong>22 dòng lệnh so với 11</strong>.</p>
<p class="nhan">📐 Cột (b), chép nguyên từ slide:</p>
<pre><code>gcd:    neg     eax
        je      L3
L1:     neg     eax
        xchg    eax,edx
L2:     sub     eax,edx
        jg      L2
        jne     L1
L3:     add     eax,edx
        jne     L4
        inc     eax
L4:     ret</code></pre>
<ul>
<li><strong>Tham số vào bằng THANH GHI.</strong> <code>eax</code> giữ a, <code>edx</code> giữ b, kết quả trả về trong <code>eax</code>. Không đụng bộ nhớ, không dựng khung ngăn xếp — đây đúng là ca "toán hạng thanh ghi" của slide 11 (mỗi toán hạng là giá trị tức thời, giá trị thanh ghi, hoặc ô nhớ).</li>
<li><strong>Thuật toán là Euclid bằng PHÉP TRỪ, không phải bằng phép chia dư.</strong> <code>L2: sub eax,edx</code> trừ liên tục; <code>jg L2</code> lặp khi kết quả còn dương; khi âm thì <code>jne L1</code> quay lại, đảo dấu rồi <code>xchg</code> hoán vị hai thanh ghi cho số lớn lên trên. Nó dừng khi phép trừ rơi đúng vào 0.</li>
<li><strong>Vì sao có <code>neg eax</code> đầu rồi lại <code>neg eax</code> nữa?</strong> Cái đầu là một phép kiểm-bằng-0 MIỄN PHÍ — <code>neg</code> có đặt cờ ZF, nên <code>je L3</code> bắt được ca a = 0 mà không tốn một lệnh <code>cmp</code> riêng. Cái thứ hai trả lại dấu. Đây chính xác là lợi thế "truy cập những lệnh mà ngôn ngữ bậc cao không với tới" ở slide 6: C không có cách nào nói "đảo dấu rồi dùng lại cái cờ".</li>
<li><strong>Vì sao (a) dài gấp đôi.</strong> Trình biên dịch không dám tin cờ do <code>neg</code> đặt còn nguyên, nên nó kiểm lại bằng <code>test ebx,ebx</code> / <code>test edx,edx</code>; nó giữ thêm một bản sao của a trong <code>ebx</code>; và nó trải hai nhánh rẽ thành hai khối riêng (<code>L4: sub ebx,eax</code> so với <code>sub eax,ebx</code>). Mỗi lựa chọn đó đều AN TOÀN và máy móc — và mỗi cái tốn một lệnh.</li>
<li><strong>Đọc nó như bằng chứng cho CẢ slide 5 lẫn slide 6.</strong> Bản viết tay thắng về <em>kích thước</em> và <em>tốc độ</em> (slide 6: tối ưu kích thước, tối ưu tốc độ), và thua về <em>dễ đọc, khả chuyển, dễ bảo trì</em> (slide 5). Không cột nào là "đáp án đúng"; slide đang dán bảng giá cho cả hai bên.</li>
</ul>
<p class="nhan">📐 <strong>ĐÃ KIỂM BẰNG MÔ PHỎNG, không kiểm bằng mắt.</strong> Cả hai cột được viết lại bằng python3 với ngữ nghĩa cờ trung thực (ZF/SF/OF) rồi chạy qua toàn bộ cặp đầu vào:</p>
<table>
<tr><th>Chương trình</th><th>Số cặp đã thử</th><th>Số ca lệch so với ƯCLN thật</th><th>gcd(48,18)</th><th>gcd(0,0)</th></tr>
<tr><td>(a) Do trình biên dịch sinh</td><td>60 × 60 = 3600 cặp</td><td><strong>0</strong></td><td>6</td><td>1</td></tr>
<tr><td>(b) Viết tay</td><td>59 × 59 = 3481 cặp</td><td><strong>0</strong></td><td>6</td><td>1</td></tr>
</table>
<p class="dap-an">✅ Cả hai đều ĐÚNG, và cả hai cùng chung một quy ước cố ý: <strong>gcd(0,0) trả về 1</strong>. Ở (a) đó là dòng <code>mov eax,1</code> sau khi cả hai lệnh <code>test</code> đều trượt; ở (b) đó là <code>inc eax</code> sau khi <code>add eax,edx</code> ra 0. Trong toán học gcd(0,0) thường định nghĩa là 0 — hai chương trình chọn 1 để kết quả luôn là một ước hợp lệ. Vết chạy của (b) với gcd(48,18), lấy từ máy mô phỏng: <code>eax</code> đi qua −48 → 48 → (hoán vị) 18 → −30 → 30 → (hoán vị) 48 → 18 → 6 → −6 → 6 → (hoán vị) 12 → 6 → 0, rồi <code>add eax,edx</code> cho <strong>6</strong>.</p>
<p class="pitfall">⚠️ Lỗi in THẬT trên slide: ở cột (a) nhãn được in là <strong><code>L3;</code></strong> — dấu chấm phẩy thay vì <code>L3:</code> dấu hai chấm. Trong cú pháp Intel, dấu chấm phẩy mở đầu một chú thích (slide 13), nên đúng như in thì dòng đó KHÔNG định nghĩa nhãn nào cả và hai lệnh <code>jmp L3</code> bên dưới sẽ không dịch được. Hãy đọc nó là <code>L3:</code>. Đừng lẳng lặng "sửa" trong bài làm — cứ ghi chú lại.</p>
<p class="meo">💡 Móc câu đi thi: nếu bị hỏi "nêu MỘT lợi thế cụ thể của hợp ngữ viết tay", slide này là đáp án kèm luôn con số — <strong>cùng một hàm, nửa số lệnh</strong> (11 so với 22).</p>`],

      [21, 'Figure 15.5 — C Program for Generating Prime Numbers',
        `<p class="y-chinh">🎯 The <strong>reference</strong> half of a two-slide pair. This is the ordinary C program; slide 22 shows the same algorithm hand-written in NASM assembly. Keep both on screen — the pair is the single best "high-level versus assembly" exercise in the whole course.</p>
<p class="nhan">📐 The program exactly as printed on the slide:</p>
<pre><code>unsigned guess;            /* current guess for prime */
unsigned factor ;          /* possible factor of guess */
unsigned limit ;           /* find primes up to this value */

printf ("Find primes up to : ");
scanf("%u", &amp;limit);
printf ("2\\n");            /* treat first two primes as */
printf ("3\\n");            /* special case */
guess = 5;                 /* initial guess */
while ( guess &lt;= limit ) {  /* look for a factor of guess */
   factor = 3;
   while ( factor * factor &lt; guess &amp;&amp; guess % factor != 0 )
   factor += 2;
   if ( guess % factor != 0 )
       printf ("%d\\n", guess);
   guess += 2;             /* only look at odd numbers */
}</code></pre>
<ul>
<li><strong>Three unsigned variables, no arrays.</strong> That matters for slide 22: every one of them becomes a single named memory cell in the <code>.bss</code> segment, and the assembly version can therefore use plain direct addressing everywhere. A program with an array would have forced indexed addressing (Ch.14) and doubled the assembly listing.</li>
<li><strong>Two special cases are hard-coded.</strong> 2 and 3 are printed literally, and the search starts at 5 stepping by 2. Why: the inner test starts at <code>factor = 3</code>, so it can never certify 2 or 3 themselves. This is the classic "peel the awkward cases out of the loop" trick, and it is also why the assembly version has two <code>call print_int</code> pairs before the loop.</li>
<li><strong>The inner loop stops at the square root, without ever computing a square root.</strong> <code>factor * factor &lt; guess</code> is the same condition as <code>factor &lt; sqrt(guess)</code>, done with one multiply instead of a floating-point library call. On slide 22 that single C operator becomes <code>mul eax</code> plus an overflow check <code>jo end_while_factor</code> — an instruction that has no C equivalent at all.</li>
<li><strong>The exit condition of the inner loop is doing double duty.</strong> The loop stops either because the bound was reached (<em>guess is prime</em>) or because a factor divided evenly (<em>guess is composite</em>). The <code>if</code> below then re-tests <code>guess % factor != 0</code> to tell those two exits apart. Beginners usually add a flag variable here; this version does not need one.</li>
<li><strong>Connect to PRF192.</strong> Everything here is first-semester C: <code>while</code>, <code>%</code>, <code>scanf</code>. The only thing CEA201 adds is the question "what does the machine actually do with it" — which is exactly slide 22.</li>
</ul>
<p class="nhan">📐 <strong>Compiled and run, not just read.</strong> Typed in verbatim, compiled with <code>cc -O1 primes.c -o primes</code> (Apple clang 17, arm64) and run with input 50:</p>
<pre><code>$ echo 50 | ./primes
Find primes up to : 2 3 5 7 11 13 17 19 23 29 31 37 41 43 47</code></pre>
<p class="dap-an">✅ That is exactly the 15 primes ≤ 50, cross-checked against an independent python3 sieve: <code>[2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]</code>. The algorithm on the slide is correct as printed. Spot-check the two cases that usually break such loops: <strong>9</strong> → <code>factor = 3</code>, <code>3*3 &lt; 9</code> is false so the inner loop never runs, then <code>9 % 3 == 0</code> → not printed, correct. <strong>25</strong> → <code>9 &lt; 25</code> and <code>25 % 3 != 0</code> so <code>factor</code> becomes 5, then <code>25 &lt; 25</code> is false, and <code>25 % 5 == 0</code> → not printed, correct.</p>
<p class="pitfall">⚠️ Two cosmetic blemishes worth knowing about before an examiner points at them. First, <code>printf("%d\\n", guess)</code> prints an <code>unsigned</code> with the signed conversion <code>%d</code> — harmless for the values here, but a type mismatch. Second, the body of the inner <code>while</code> is the <em>next line</em> <code>factor += 2;</code> with no braces and no indentation; that is legal C but it is exactly the layout that hides bugs. Neither affects the output.</p>
<p class="meo">💡 Before you read slide 22, write down by hand which C construct you expect to become which assembly shape: <code>while</code> → compare + conditional jump to an <code>end_</code> label; <code>%</code> → <code>div</code> with the remainder landing in <code>edx</code>; <code>printf</code> → a <code>call</code>. Getting three out of three right means you have understood Ch.13 and Ch.14.</p>`,
        `<p class="y-chinh">🎯 Nửa <strong>ĐỐI CHIẾU</strong> của một cặp hai slide. Đây là chương trình C bình thường; slide 22 là đúng thuật toán đó viết tay bằng NASM. Hãy mở cả hai cạnh nhau — cặp này là bài tập "bậc cao đối chiếu hợp ngữ" tốt nhất trong cả môn.</p>
<p class="nhan">📐 Chương trình y nguyên như in trên slide:</p>
<pre><code>unsigned guess;            /* số đang đoán là nguyên tố */
unsigned factor ;          /* ước có thể có của guess */
unsigned limit ;           /* tìm nguyên tố tới giá trị này */

printf ("Find primes up to : ");
scanf("%u", &amp;limit);
printf ("2\\n");            /* hai số nguyên tố đầu */
printf ("3\\n");            /* xử lý riêng */
guess = 5;                 /* giá trị đoán ban đầu */
while ( guess &lt;= limit ) {  /* tìm một ước của guess */
   factor = 3;
   while ( factor * factor &lt; guess &amp;&amp; guess % factor != 0 )
   factor += 2;
   if ( guess % factor != 0 )
       printf ("%d\\n", guess);
   guess += 2;             /* chỉ xét số lẻ */
}</code></pre>
<ul>
<li><strong>Ba biến unsigned, không mảng.</strong> Điều đó quan trọng cho slide 22: mỗi biến biến thành ĐÚNG MỘT ô nhớ có tên trong đoạn <code>.bss</code>, nên bản hợp ngữ dùng định địa chỉ trực tiếp ở khắp nơi. Nếu có mảng thì đã phải dùng định địa chỉ chỉ số (Ch.14) và bản hợp ngữ dài gấp đôi.</li>
<li><strong>Hai ca đặc biệt bị nhét cứng vào mã.</strong> 2 và 3 được in thẳng, và vòng tìm bắt đầu từ 5, bước 2. Vì sao: phép thử bên trong bắt đầu ở <code>factor = 3</code> nên nó không bao giờ chứng nhận được chính 2 và 3. Đây là mẹo kinh điển "bóc ca khó ra khỏi vòng lặp", và cũng là lý do bản hợp ngữ có hai cặp <code>call print_int</code> đứng trước vòng lặp.</li>
<li><strong>Vòng trong dừng ở CĂN BẬC HAI mà không hề tính căn.</strong> <code>factor * factor &lt; guess</code> tương đương <code>factor &lt; sqrt(guess)</code>, làm bằng MỘT phép nhân thay vì gọi thư viện dấu phẩy động. Ở slide 22 một toán tử C đó nở ra thành <code>mul eax</code> cộng thêm một phép kiểm tràn <code>jo end_while_factor</code> — thứ lệnh mà C hoàn toàn không có tương đương.</li>
<li><strong>Điều kiện thoát của vòng trong làm HAI việc một lúc.</strong> Vòng dừng hoặc vì đã chạm cận (<em>guess là nguyên tố</em>), hoặc vì gặp ước chia hết (<em>guess là hợp số</em>). Câu <code>if</code> bên dưới thử lại <code>guess % factor != 0</code> để phân biệt hai lối thoát ấy. Người mới học thường thêm một biến cờ ở đây; bản này không cần.</li>
<li><strong>Nối sang PRF192.</strong> Ở đây toàn là C kỳ một: <code>while</code>, <code>%</code>, <code>scanf</code>. Thứ duy nhất CEA201 thêm vào là câu hỏi "vậy máy THỰC SỰ làm gì với nó" — và đó chính là slide 22.</li>
</ul>
<p class="nhan">📐 <strong>ĐÃ BIÊN DỊCH VÀ CHẠY, không chỉ đọc.</strong> Gõ lại nguyên văn, biên dịch bằng <code>cc -O1 primes.c -o primes</code> (Apple clang 17, arm64) rồi chạy với đầu vào 50:</p>
<pre><code>$ echo 50 | ./primes
Find primes up to : 2 3 5 7 11 13 17 19 23 29 31 37 41 43 47</code></pre>
<p class="dap-an">✅ Đúng 15 số nguyên tố ≤ 50, đối chiếu chéo với một sàng nguyên tố viết độc lập bằng python3: <code>[2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]</code>. Thuật toán trên slide ĐÚNG như in. Thử lại hai ca hay làm vỡ loại vòng lặp này: <strong>9</strong> → <code>factor = 3</code>, <code>3*3 &lt; 9</code> sai nên vòng trong không chạy lần nào, rồi <code>9 % 3 == 0</code> → không in, đúng. <strong>25</strong> → <code>9 &lt; 25</code> và <code>25 % 3 != 0</code> nên <code>factor</code> thành 5, rồi <code>25 &lt; 25</code> sai, và <code>25 % 5 == 0</code> → không in, đúng.</p>
<p class="pitfall">⚠️ Hai vết xước hình thức nên biết trước khi bị giám khảo chỉ vào. Thứ nhất, <code>printf("%d\\n", guess)</code> in một biến <code>unsigned</code> bằng đặc tả có dấu <code>%d</code> — vô hại với dải giá trị này, nhưng vẫn là lệch kiểu. Thứ hai, thân vòng <code>while</code> bên trong là DÒNG KẾ TIẾP <code>factor += 2;</code>, không ngoặc nhọn và không thụt lề; hợp lệ trong C nhưng đúng là kiểu trình bày hay giấu lỗi. Cả hai đều không làm sai kết quả.</p>
<p class="meo">💡 Trước khi đọc slide 22, hãy tự viết ra giấy: cấu trúc C nào sẽ thành hình dạng hợp ngữ nào. <code>while</code> → so sánh + nhảy có điều kiện tới nhãn <code>end_</code>; <code>%</code> → <code>div</code> với phần dư rơi vào <code>edx</code>; <code>printf</code> → một lệnh <code>call</code>. Đoán đúng ba trên ba nghĩa là bạn đã nắm được Ch.13 và Ch.14.</p>`],

      [22, 'Figure 15.6 — Assembly Program for Generating Prime Numbers (NASM)',
        `<p class="y-chinh">🎯 The same prime-number program as slide 21, written directly in NASM x86 assembly. This one slide exercises <em>everything</em> from the first half of the chapter at once: the three segments, the <code>RESD</code> and <code>DB</code> directives, labels, mnemonics, operands, comments, and a <code>global</code> declaration for the linker.</p>
<p class="nhan">📐 The skeleton, in the order the slide prints it:</p>
<pre><code>%include "asm_io.inc"
segment .data
Message db "Find primes up to: ", 0

segment .bss
Limit resd 1               ; find primes up to this limit
Guess resd 1               ; the current guess for prime

segment .text
        global _asm_main
_asm_main:
        enter 0,0          ; setup routine
        pusha
        ...
        popa
        mov eax, 0         ; return back to C
        leave
        ret</code></pre>
<table>
<tr><th>C on slide 21</th><th>Assembly on slide 22</th><th>Which earlier slide explains it</th></tr>
<tr><td><code>unsigned limit;</code></td><td><code>Limit resd 1</code></td><td>slide 15, Table 15.2: RESD reserves one uninitialized doubleword</td></tr>
<tr><td>the string literal</td><td><code>Message db "...", 0</code></td><td>slide 15: DB initialises locations, the trailing 0 terminates the string</td></tr>
<tr><td><code>scanf("%u", &amp;limit)</code></td><td><code>call read_int</code> / <code>mov [Limit], eax</code></td><td>slide 19, system calls (wrapped here by asm_io.inc)</td></tr>
<tr><td><code>while (guess &lt;= limit)</code></td><td><code>cmp eax,[Limit]</code> / <code>jnbe end_while_limit</code></td><td>slide 9: labels are what branch instructions aim at</td></tr>
<tr><td><code>factor * factor</code></td><td><code>mov eax,ebx</code> / <code>mul eax</code> / <code>jo end_while_factor</code></td><td>Ch.13: <code>mul</code> produces the 64-bit result <code>edx:eax</code></td></tr>
<tr><td><code>guess % factor</code></td><td><code>mov edx,0</code> / <code>div ebx</code> / <code>cmp edx,0</code></td><td>Ch.13: <code>div</code> leaves the quotient in eax and the <strong>remainder in edx</strong></td></tr>
<tr><td><code>printf("%u\\n", guess)</code></td><td><code>call print_int</code> / <code>call print_nl</code></td><td>slide 19</td></tr>
</table>
<ul>
<li><strong><code>jnbe</code>, not <code>jg</code> — and the comment on the slide says why.</strong> The listing carries the note "use jnbe since numbers are unsigned". <code>jg</code> tests the <em>signed</em> condition; the C variables are <code>unsigned</code>. For values above 2<sup>31</sup> the two disagree, so the wrong jump would silently produce wrong primes. This is the single most examinable line on the slide: <strong>the data type lives in the programmer's head, not in the register.</strong></li>
<li><strong><code>mov edx,0</code> before every <code>div</code> is not optional.</strong> <code>div ebx</code> divides the 64-bit pair <code>edx:eax</code>, not <code>eax</code> alone. Leaving stale bits in <code>edx</code> gives a garbage quotient or a divide-error exception. C's <code>%</code> hides this completely; assembly does not.</li>
<li><strong><code>jo end_while_factor</code> has no C counterpart at all.</strong> It leaves the inner loop when <code>factor * factor</code> overflows 32 bits — the case where the square-root bound has certainly been passed. In C that overflow would wrap around silently and the loop would keep going. Slide 6 called this "accessing instructions that are not accessible from a high-level language"; this is what it looks like in practice.</li>
<li><strong><code>enter 0,0</code> … <code>leave</code> and <code>pusha</code> … <code>popa</code> are the calling-convention wrapper.</strong> This routine is declared <code>global _asm_main</code> and is <em>called from a C main</em> — which is precisely the EXTERN/GLOBAL pairing of slide 18: this module says GLOBAL, the C driver's object file says EXTERN, and the <strong>linker</strong> joins them. If you forget the <code>global</code> line, everything assembles and the failure appears only at link time.</li>
<li><strong>Count the cost.</strong> The C version is 16 lines; this is roughly 60. That ratio — about four assembly lines per line of C — is the honest answer to "why don't we write everything in assembly", and it is the quantitative version of slide 5's "development time" bullet.</li>
</ul>
<p class="dap-an">✅ Structure check you can do without a machine: every <code>while</code> in the C becomes exactly <strong>three</strong> assembly pieces — a label at the top (<code>while_limit:</code>, <code>while_factor:</code>), a compare-and-conditional-jump that leaves to an <code>end_</code> label, and an unconditional <code>jmp</code> back at the bottom. Find those three pieces twice in the listing and you have proved the control flow matches slide 21 without tracing a single value.</p>
<p class="pitfall">⚠️ The line after <code>end_while_factor:</code> is <code>je end_if</code> — a conditional jump that depends on flags set <em>before</em> the loop was exited, by the earlier <code>cmp edx, 0</code>. That style works, but it is fragile: insert any flag-setting instruction between the two points and the program breaks in a way no compiler will warn you about. Flags are global mutable state; treat them as something you consume immediately.</p>`,
        `<p class="y-chinh">🎯 Vẫn chương trình số nguyên tố của slide 21, nhưng viết thẳng bằng hợp ngữ NASM x86. Riêng slide này huy động <em>TẤT CẢ</em> nửa đầu chương cùng lúc: ba đoạn, chỉ thị <code>RESD</code> và <code>DB</code>, nhãn, từ gợi nhớ, toán hạng, chú thích, và một khai báo <code>global</code> dành cho bộ liên kết.</p>
<p class="nhan">📐 Bộ khung, theo đúng thứ tự slide in:</p>
<pre><code>%include "asm_io.inc"
segment .data
Message db "Find primes up to: ", 0

segment .bss
Limit resd 1               ; tìm nguyên tố tới cận này
Guess resd 1               ; số đang đoán

segment .text
        global _asm_main
_asm_main:
        enter 0,0          ; thủ tục mở đầu
        pusha
        ...
        popa
        mov eax, 0         ; trả về cho C
        leave
        ret</code></pre>
<table>
<tr><th>C ở slide 21</th><th>Hợp ngữ ở slide 22</th><th>Slide nào phía trước giải thích</th></tr>
<tr><td><code>unsigned limit;</code></td><td><code>Limit resd 1</code></td><td>slide 15, Table 15.2: RESD đặt chỗ một doubleword chưa khởi tạo</td></tr>
<tr><td>chuỗi hằng</td><td><code>Message db "...", 0</code></td><td>slide 15: DB khởi tạo ô nhớ, số 0 cuối là dấu kết chuỗi</td></tr>
<tr><td><code>scanf("%u", &amp;limit)</code></td><td><code>call read_int</code> / <code>mov [Limit], eax</code></td><td>slide 19, lời gọi hệ thống (ở đây gói trong asm_io.inc)</td></tr>
<tr><td><code>while (guess &lt;= limit)</code></td><td><code>cmp eax,[Limit]</code> / <code>jnbe end_while_limit</code></td><td>slide 9: nhãn chính là đích mà lệnh rẽ nhánh nhắm vào</td></tr>
<tr><td><code>factor * factor</code></td><td><code>mov eax,ebx</code> / <code>mul eax</code> / <code>jo end_while_factor</code></td><td>Ch.13: <code>mul</code> cho kết quả 64 bit nằm ở <code>edx:eax</code></td></tr>
<tr><td><code>guess % factor</code></td><td><code>mov edx,0</code> / <code>div ebx</code> / <code>cmp edx,0</code></td><td>Ch.13: <code>div</code> để thương ở eax và <strong>SỐ DƯ Ở EDX</strong></td></tr>
<tr><td><code>printf("%u\\n", guess)</code></td><td><code>call print_int</code> / <code>call print_nl</code></td><td>slide 19</td></tr>
</table>
<ul>
<li><strong>Dùng <code>jnbe</code> chứ KHÔNG dùng <code>jg</code> — và chú thích ngay trên slide nói rõ vì sao.</strong> Dòng ghi chú "use jnbe since numbers are unsigned". <code>jg</code> kiểm điều kiện <em>CÓ DẤU</em>; các biến C ở đây là <code>unsigned</code>. Với giá trị vượt 2<sup>31</sup> thì hai cái lệch nhau, và chọn nhầm lệnh nhảy sẽ âm thầm cho ra danh sách nguyên tố sai. Đây là dòng đáng ra đề nhất trên slide: <strong>KIỂU DỮ LIỆU nằm trong đầu người lập trình, không nằm trong thanh ghi.</strong></li>
<li><strong><code>mov edx,0</code> trước mỗi <code>div</code> KHÔNG phải tuỳ chọn.</strong> <code>div ebx</code> chia cặp 64 bit <code>edx:eax</code>, chứ không chia riêng <code>eax</code>. Để rác lại trong <code>edx</code> thì hoặc ra thương bậy, hoặc nổ ngoại lệ chia. Toán tử <code>%</code> của C giấu hoàn toàn chuyện này; hợp ngữ thì không.</li>
<li><strong><code>jo end_while_factor</code> hoàn toàn KHÔNG có tương đương trong C.</strong> Nó thoát vòng trong khi <code>factor * factor</code> tràn 32 bit — tức chắc chắn đã vượt cận căn bậc hai. Trong C phép tràn đó sẽ quấn vòng âm thầm và vòng lặp cứ chạy tiếp. Slide 6 gọi đây là "truy cập những lệnh mà ngôn ngữ bậc cao không với tới"; đây là bộ mặt thật của nó.</li>
<li><strong><code>enter 0,0</code> … <code>leave</code> và <code>pusha</code> … <code>popa</code> là lớp bọc quy ước gọi hàm.</strong> Thủ tục này khai <code>global _asm_main</code> và <em>ĐƯỢC GỌI TỪ một hàm main viết bằng C</em> — đúng là cặp EXTERN/GLOBAL của slide 18: mô-đun này nói GLOBAL, tệp đối tượng của phần C nói EXTERN, và <strong>BỘ LIÊN KẾT</strong> nối hai đầu lại. Quên dòng <code>global</code> thì mọi thứ vẫn dịch xanh, sự cố chỉ hiện ra ở bước liên kết.</li>
<li><strong>Đếm cái giá.</strong> Bản C 16 dòng; bản này khoảng 60. Tỉ lệ đó — chừng bốn dòng hợp ngữ cho mỗi dòng C — là câu trả lời thành thật cho "sao không viết tất cả bằng hợp ngữ", và là phiên bản có số của gạch đầu dòng "development time" ở slide 5.</li>
</ul>
<p class="dap-an">✅ Phép kiểm cấu trúc làm được mà không cần máy: mỗi vòng <code>while</code> trong C biến thành ĐÚNG <strong>BA</strong> mảnh hợp ngữ — một nhãn ở đầu (<code>while_limit:</code>, <code>while_factor:</code>), một cặp so-sánh-rồi-nhảy-có-điều-kiện thoát ra nhãn <code>end_</code>, và một lệnh <code>jmp</code> vô điều kiện quay lại ở cuối. Tìm được ba mảnh đó hai lần trong listing là bạn đã chứng minh luồng điều khiển khớp slide 21 mà chưa phải lần theo một giá trị nào.</p>
<p class="pitfall">⚠️ Dòng ngay sau <code>end_while_factor:</code> là <code>je end_if</code> — một lệnh nhảy có điều kiện dựa vào cờ đã được đặt TỪ TRƯỚC khi thoát vòng, bởi lệnh <code>cmp edx, 0</code> ở trên. Cách viết đó chạy được, nhưng mong manh: chèn bất kỳ lệnh nào có đặt cờ vào giữa hai điểm ấy là chương trình hỏng theo kiểu không trình biên dịch nào cảnh báo. Cờ là trạng thái toàn cục thay đổi được; hãy coi nó là thứ phải TIÊU THỤ NGAY.</p>`],

      [23, 'Table 15.3 — x86 String Instructions',
        `<p class="y-chinh">🎯 Eight instructions that let the processor walk through a block of memory <strong>one byte per instruction, with no loop written by you</strong>. Five do the work (MOVSB, CMPSB, SCASB, LODSB, STOSB) and three are <em>prefixes</em> that repeat them (REP, REPE/REPZ, REPNE/REPNZ).</p>
<table>
<tr><th>Instruction</th><th>What the slide says it does</th><th>Registers it silently uses</th></tr>
<tr><td><code>MOVSB</code></td><td>Moves the string byte addressed by <strong>ESI</strong> to the location addressed by <strong>EDI</strong></td><td>ESI (source), EDI (destination)</td></tr>
<tr><td><code>CMPSB</code></td><td>Subtracts the destination string byte from the source string element and updates the status flags in EFLAGS according to the results</td><td>ESI, EDI, EFLAGS</td></tr>
<tr><td><code>SCASB</code></td><td>Subtracts the destination string byte from the contents of the <strong>AL</strong> register and updates the status flags</td><td>EDI, AL, EFLAGS</td></tr>
<tr><td><code>LODSB</code></td><td>Loads the source string byte identified by ESI into the <strong>EAX</strong> register</td><td>ESI, EAX</td></tr>
<tr><td><code>STOSB</code> (slide prints "STOSSB")</td><td>Stores the source string byte from the <strong>AL</strong> register into the memory location identified with EDI</td><td>AL, EDI</td></tr>
<tr><td><code>REP</code></td><td>Repeat while the <strong>ECX</strong> register is not zero</td><td>ECX</td></tr>
<tr><td><code>REPE/REPZ</code></td><td>Repeat while ECX is not zero <strong>and the ZF flag is set</strong></td><td>ECX, ZF</td></tr>
<tr><td><code>REPNE/REPNZ</code></td><td>Repeat while ECX is not zero <strong>and the ZF flag is clear</strong></td><td>ECX, ZF</td></tr>
</table>
<ul>
<li><strong>The whole family is built on implied operands.</strong> None of these instructions names its operands — ESI, EDI, ECX and AL are <em>baked into the opcode</em>. That is the <strong>implied addressing mode</strong> of Ch.14, and this table is its most useful real-world example. It is also why the instruction is one byte long: there is nothing to encode.</li>
<li><strong>Read the names as a code, not as words.</strong> MOV-S-B = move string byte. LOD-S = load string. STO-S = store string. SCA-S = scan string. CMP-S = compare string. The trailing letter is the size: <strong>B</strong> byte, <strong>W</strong> word, <strong>D</strong> doubleword — the same letter code as Table 15.2 on slide 15. So MOVSD exists and moves 4 bytes per step.</li>
<li><strong>Each step also advances the pointers by itself.</strong> The table does not say so, but ESI and EDI are incremented (or decremented) after every element. The direction is chosen by the <strong>direction flag DF</strong> — <code>cld</code> clears it for "forward", <code>std</code> sets it for "backward". Slide 24 opens with <code>cld</code> for exactly this reason.</li>
<li><strong>Pick the right REP for the right instruction.</strong> Plain <code>REP</code> pairs with MOVS and STOS, which set no flags — you just want N copies. <code>REPE</code> pairs with CMPS ("keep comparing while they stay equal" = string comparison). <code>REPNE</code> pairs with SCAS ("keep scanning while it is <em>not</em> the byte I want" = searching, exactly what <code>strlen</code> and <code>memchr</code> do).</li>
<li><strong>This is one instruction doing the job of a whole C function.</strong> <code>rep movsb</code> is <code>memcpy</code>. <code>repne scasb</code> is <code>strlen</code>. <code>repe cmpsb</code> is <code>memcmp</code>. Slide 6 lists "function libraries" as a reason to use assembly at all — this table is why: the C standard library's hottest functions were hand-written on top of these.</li>
</ul>
<p class="dap-an">✅ Worked question, the kind that appears on exams. "Copy 100 bytes from buffer A to buffer B, forward." Answer, four instructions: <code>mov esi, A</code> · <code>mov edi, B</code> · <code>mov ecx, 100</code> · <code>cld</code> · <code>rep movsb</code>. Trace the state: ECX counts 100 → 99 → … → 0, ESI and EDI each advance by 1 per step, and the loop ends because ECX hit zero, <strong>not</strong> because of any flag. That is the definition of plain <code>REP</code> in the table.</p>
<p class="pitfall">⚠️ Typo on the slide: the fifth row is printed <strong><code>STOSSB</code></strong> with a doubled S. The real mnemonic is <code>STOSB</code> — and you can see it is a typo from the table's own naming scheme, because every other entry is exactly MOVS/CMPS/SCAS/LODS plus one size letter. Also note the table calls it "the <em>source</em> string byte from the AL register", which is loose wording: AL is the source of the data, but the string being written is the <em>destination</em> string at EDI.</p>
<p class="meo">💡 Mnemonic for which register is which: <strong>S</strong>I = <strong>S</strong>ource Index, <strong>D</strong>I = <strong>D</strong>estination Index, <strong>C</strong>X = <strong>C</strong>ount. Three letters, three jobs, and they never swap roles.</p>`,
        `<p class="y-chinh">🎯 Tám lệnh cho phép bộ xử lý đi hết một khối bộ nhớ, <strong>mỗi lệnh một byte, mà bạn KHÔNG phải tự viết vòng lặp</strong>. Năm lệnh làm việc (MOVSB, CMPSB, SCASB, LODSB, STOSB) và ba lệnh là <em>TIỀN TỐ</em> lặp lại chúng (REP, REPE/REPZ, REPNE/REPNZ).</p>
<table>
<tr><th>Lệnh</th><th>Slide nói nó làm gì</th><th>Thanh ghi nó ngầm dùng</th></tr>
<tr><td><code>MOVSB</code></td><td>Chuyển byte chuỗi mà <strong>ESI</strong> trỏ tới sang ô mà <strong>EDI</strong> trỏ tới</td><td>ESI (nguồn), EDI (đích)</td></tr>
<tr><td><code>CMPSB</code></td><td>Lấy byte chuỗi nguồn trừ đi byte chuỗi đích rồi cập nhật cờ trạng thái trong EFLAGS theo kết quả</td><td>ESI, EDI, EFLAGS</td></tr>
<tr><td><code>SCASB</code></td><td>Lấy nội dung thanh ghi <strong>AL</strong> trừ đi byte chuỗi đích rồi cập nhật cờ trạng thái</td><td>EDI, AL, EFLAGS</td></tr>
<tr><td><code>LODSB</code></td><td>Nạp byte chuỗi nguồn do <strong>ESI</strong> chỉ định vào thanh ghi <strong>EAX</strong></td><td>ESI, EAX</td></tr>
<tr><td><code>STOSB</code> (slide in là "STOSSB")</td><td>Ghi byte từ thanh ghi <strong>AL</strong> vào ô nhớ do <strong>EDI</strong> chỉ định</td><td>AL, EDI</td></tr>
<tr><td><code>REP</code></td><td>Lặp lại chừng nào thanh ghi <strong>ECX</strong> còn khác 0</td><td>ECX</td></tr>
<tr><td><code>REPE/REPZ</code></td><td>Lặp chừng nào ECX khác 0 <strong>VÀ cờ ZF đang bật</strong></td><td>ECX, ZF</td></tr>
<tr><td><code>REPNE/REPNZ</code></td><td>Lặp chừng nào ECX khác 0 <strong>VÀ cờ ZF đang tắt</strong></td><td>ECX, ZF</td></tr>
</table>
<ul>
<li><strong>Cả họ lệnh này dựng trên TOÁN HẠNG NGẦM ĐỊNH.</strong> Không lệnh nào nêu tên toán hạng của nó — ESI, EDI, ECX và AL <em>nướng cứng vào mã lệnh</em>. Đó là <strong>chế độ định địa chỉ ngầm định</strong> của Ch.14, và bảng này là ví dụ đời thực hữu ích nhất của nó. Cũng vì thế mà mỗi lệnh chỉ dài một byte: chẳng còn gì để mã hoá.</li>
<li><strong>Đọc tên lệnh như một mật mã, đừng đọc như một từ.</strong> MOV-S-B = move string byte. LOD-S = load string. STO-S = store string. SCA-S = scan string. CMP-S = compare string. Chữ cuối là KÍCH THƯỚC: <strong>B</strong> byte, <strong>W</strong> word, <strong>D</strong> doubleword — đúng bộ chữ cái của Table 15.2 ở slide 15. Nên MOVSD có thật, và nó chuyển 4 byte mỗi bước.</li>
<li><strong>Mỗi bước còn TỰ ĐẨY con trỏ đi.</strong> Bảng không ghi, nhưng ESI và EDI được tăng (hoặc giảm) sau mỗi phần tử. Chiều do <strong>cờ hướng DF</strong> quyết định — <code>cld</code> xoá nó để đi "xuôi", <code>std</code> bật nó để đi "ngược". Slide 24 mở đầu bằng <code>cld</code> chính vì lý do này.</li>
<li><strong>Chọn đúng REP cho đúng lệnh.</strong> <code>REP</code> trơn đi với MOVS và STOS, hai lệnh không đặt cờ — bạn chỉ muốn N bản sao. <code>REPE</code> đi với CMPS ("so tiếp chừng nào còn bằng nhau" = so sánh chuỗi). <code>REPNE</code> đi với SCAS ("quét tiếp chừng nào CHƯA phải byte tôi tìm" = tìm kiếm, đúng việc mà <code>strlen</code> và <code>memchr</code> làm).</li>
<li><strong>Một lệnh làm thay cả một hàm C.</strong> <code>rep movsb</code> chính là <code>memcpy</code>. <code>repne scasb</code> chính là <code>strlen</code>. <code>repe cmpsb</code> chính là <code>memcmp</code>. Slide 6 liệt kê "function libraries" như một lý do còn dùng hợp ngữ — bảng này là lý do đó: những hàm nóng nhất của thư viện chuẩn C được viết tay trên nền mấy lệnh này.</li>
</ul>
<p class="dap-an">✅ Bài giải mẫu, đúng dạng hay ra thi. "Chép 100 byte từ vùng đệm A sang vùng đệm B, theo chiều xuôi." Đáp án, bốn lệnh chuẩn bị và một lệnh làm việc: <code>mov esi, A</code> · <code>mov edi, B</code> · <code>mov ecx, 100</code> · <code>cld</code> · <code>rep movsb</code>. Lần theo trạng thái: ECX đếm 100 → 99 → … → 0, ESI và EDI mỗi bước tiến 1, và vòng kết thúc VÌ ECX chạm 0, <strong>không phải</strong> vì bất kỳ cờ nào. Đó đúng là định nghĩa của <code>REP</code> trơn trong bảng.</p>
<p class="pitfall">⚠️ Lỗi in trên slide: dòng thứ năm ghi <strong><code>STOSSB</code></strong> với hai chữ S. Từ gợi nhớ thật là <code>STOSB</code> — và bạn nhận ra đó là lỗi gõ nhờ chính quy tắc đặt tên của bảng, vì mọi mục khác đều đúng dạng MOVS/CMPS/SCAS/LODS cộng một chữ kích thước. Thêm nữa, bảng gọi AL là "byte chuỗi NGUỒN", cách nói lỏng lẻo: AL là nguồn của DỮ LIỆU, còn chuỗi đang bị ghi là chuỗi ĐÍCH tại EDI.</p>
<p class="meo">💡 Mẹo nhớ thanh ghi nào việc nào: <strong>S</strong>I = <strong>S</strong>ource Index (chỉ số nguồn), <strong>D</strong>I = <strong>D</strong>estination Index (chỉ số đích), <strong>C</strong>X = <strong>C</strong>ount (bộ đếm). Ba chữ, ba việc, và chúng không bao giờ đổi vai cho nhau.</p>`],

      [24, 'Figure 15.7 — Assembly Program for Moving a String',
        `<p class="y-chinh">🎯 A complete, runnable Linux program in eighteen lines: copy the string "Hello, world!" from <code>s1</code> to <code>s2</code> with one <code>rep movsb</code>, print the copy with a <code>sys_write</code> system call, then exit. It is the direct application of Table 15.3 (slide 23) and of the INT-based system calls of slide 19.</p>
<p class="nhan">📐 The listing exactly as printed:</p>
<pre><code>section .text
    global  main            ;must be declared for using gcc
main:                       ;tell linker entry point
    mov   ecx, len
    mov   esi, s1
    mov   edi, s2
    cld
    rep   movsb
    mov   edx,20            ;message length
    mov   ecx,s2            ;message to write
    mov   ebx,1             ;file descriptor (stdout)
    mov   eax,4             ;system call number (sys_write)
    int   0x80              ;call kernel
    mov   eax,1             ;system call number (sys_exit)
    int   0x80              ;call kernel
section .data
s1 db 'Hello, world!',0     ;string 1
len equ   $-s1
section .bss
s2  resb 20                 ;destination</code></pre>
<table>
<tr><th>Line</th><th>What it sets up</th><th>Why that register</th></tr>
<tr><td><code>mov ecx, len</code></td><td>the repeat count</td><td>REP counts down in ECX (slide 23)</td></tr>
<tr><td><code>mov esi, s1</code></td><td>source address</td><td>MOVSB reads from ESI</td></tr>
<tr><td><code>mov edi, s2</code></td><td>destination address</td><td>MOVSB writes to EDI</td></tr>
<tr><td><code>cld</code></td><td>direction = forward</td><td>clears DF so ESI/EDI increase</td></tr>
<tr><td><code>rep movsb</code></td><td><strong>the entire copy</strong></td><td>one instruction, <code>len</code> bytes</td></tr>
<tr><td><code>mov eax,4</code> + <code>int 0x80</code></td><td>sys_write</td><td>slide 19: EAX selects the call, EBX/ECX/EDX carry arguments 1, 2, 3</td></tr>
<tr><td><code>mov eax,1</code> + <code>int 0x80</code></td><td>sys_exit</td><td>the process must not fall off the end of .text</td></tr>
</table>
<ul>
<li><strong><code>len equ $-s1</code> is the most instructive line on the slide.</strong> <code>$</code> means "the current value of the location counter" — the address the assembler has reached right now. Subtracting the address of <code>s1</code> gives the number of bytes the string occupied. So <code>len</code> is computed <strong>at assembly time</strong>, costs zero instructions at run time, and stays correct if you edit the string. <code>EQU</code> is the directive from Table 15.2 (slide 15).</li>
<li><strong>Count it: <code>len</code> = 14.</strong> "Hello, world!" is 13 characters, plus the explicit terminating <code>,0</code> = 14 bytes. You can verify that without a machine — count the characters including the comma, the space and the exclamation mark.</li>
<li><strong>Three sections, three jobs — and the slide names all three.</strong> <code>.text</code> holds instructions (read-only, executable), <code>.data</code> holds <em>initialised</em> data (the string literal), <code>.bss</code> holds <em>uninitialised</em> reserved space (the 20-byte destination). This is exactly the SECTION/SEGMENT directive of slide 18, and it is the same three-way split you will see again on slide 29 as "Program / Data" inside the object file.</li>
<li><strong><code>global main</code> is a message to the linker, not to the CPU.</strong> The comment on the slide says so outright: "must be declared for using gcc", "tell linker entry point". Without it the symbol <code>main</code> stays local to this object file, the C runtime cannot find it, and you get an <em>undefined symbol</em> error at link time — slide 18's GLOBAL/EXTERN pairing again.</li>
<li><strong>Why <code>int 0x80</code> and not <code>call write</code>.</strong> A system call must cross from user mode to kernel mode, and the only legal doorway is a trap instruction. <code>int 0x80</code> is that doorway on 32-bit Linux. This ties straight into Ch.8/Ch.9 (operating-system support): the interrupt is what lets the OS keep control.</li>
</ul>
<p class="dap-an">✅ Answer to the obvious question, "what exactly gets printed?" The copy moves <code>len</code> = <strong>14</strong> bytes, but the write asks for <code>edx</code> = <strong>20</strong> bytes. So the program prints the 13 visible characters, then the NUL that terminated the string, then <strong>6 more bytes that <code>rep movsb</code> never wrote</strong>. Those 6 come from <code>s2 resb 20</code> in <code>.bss</code>, which the loader zero-fills, so in practice you see "Hello, world!" followed by seven invisible NUL bytes. The output looks right, and the program is still reading bytes it never initialised.</p>
<p class="pitfall">⚠️ Treat that mismatch as the lesson, not as a curiosity. The safe line is <code>mov edx, len</code> — let the assembler compute the length once, exactly as it already does for <code>ecx</code>. A hard-coded <code>20</code> is a buffer length being used as a data length; that is the same confusion that produces buffer over-reads in real C code (think <code>strcpy</code> versus <code>strncpy</code>). The slide's version is correct <em>by accident</em>, because <code>.bss</code> happens to be zeroed.</p>
<p class="meo">💡 Remember the system-call recipe as a sentence: <strong>"number in EAX, arguments in EBX, ECX, EDX, then knock with INT 0x80."</strong> Slide 19 gave you the register order (EBX first, then ECX, EDX, ESI, EDI, EBP); this slide is that order in action, twice.</p>`,
        `<p class="y-chinh">🎯 Một chương trình Linux hoàn chỉnh, chạy được, trong mười tám dòng: chép chuỗi "Hello, world!" từ <code>s1</code> sang <code>s2</code> bằng MỘT lệnh <code>rep movsb</code>, in bản chép ra bằng lời gọi hệ thống <code>sys_write</code>, rồi thoát. Đây là ứng dụng trực tiếp của Table 15.3 (slide 23) và của lời gọi hệ thống qua INT ở slide 19.</p>
<p class="nhan">📐 Listing y nguyên như in:</p>
<pre><code>section .text
    global  main            ;phải khai báo để dùng được với gcc
main:                       ;báo cho bộ liên kết biết điểm vào
    mov   ecx, len
    mov   esi, s1
    mov   edi, s2
    cld
    rep   movsb
    mov   edx,20            ;độ dài thông điệp
    mov   ecx,s2            ;thông điệp cần ghi
    mov   ebx,1             ;mô tả tệp (stdout)
    mov   eax,4             ;số hiệu lời gọi hệ thống (sys_write)
    int   0x80              ;gọi nhân
    mov   eax,1             ;số hiệu lời gọi hệ thống (sys_exit)
    int   0x80              ;gọi nhân
section .data
s1 db 'Hello, world!',0     ;chuỗi 1
len equ   $-s1
section .bss
s2  resb 20                 ;đích</code></pre>
<table>
<tr><th>Dòng</th><th>Nó chuẩn bị gì</th><th>Vì sao đúng thanh ghi đó</th></tr>
<tr><td><code>mov ecx, len</code></td><td>số lần lặp</td><td>REP đếm lùi trong ECX (slide 23)</td></tr>
<tr><td><code>mov esi, s1</code></td><td>địa chỉ nguồn</td><td>MOVSB đọc từ ESI</td></tr>
<tr><td><code>mov edi, s2</code></td><td>địa chỉ đích</td><td>MOVSB ghi vào EDI</td></tr>
<tr><td><code>cld</code></td><td>chiều = xuôi</td><td>xoá DF nên ESI/EDI tăng dần</td></tr>
<tr><td><code>rep movsb</code></td><td><strong>TOÀN BỘ phép chép</strong></td><td>một lệnh, <code>len</code> byte</td></tr>
<tr><td><code>mov eax,4</code> + <code>int 0x80</code></td><td>sys_write</td><td>slide 19: EAX chọn lời gọi, EBX/ECX/EDX mang tham số 1, 2, 3</td></tr>
<tr><td><code>mov eax,1</code> + <code>int 0x80</code></td><td>sys_exit</td><td>tiến trình không được phép chạy rơi khỏi cuối .text</td></tr>
</table>
<ul>
<li><strong><code>len equ $-s1</code> là dòng dạy được nhiều nhất trên slide.</strong> <code>$</code> nghĩa là "giá trị hiện tại của bộ đếm vị trí" — địa chỉ mà trình dịch vừa đi tới. Lấy nó trừ địa chỉ <code>s1</code> ra đúng số byte chuỗi chiếm. Vậy <code>len</code> được tính <strong>LÚC DỊCH</strong>, tốn 0 lệnh lúc chạy, và vẫn đúng nếu bạn sửa chuỗi. <code>EQU</code> chính là chỉ thị trong Table 15.2 (slide 15).</li>
<li><strong>Đếm thử: <code>len</code> = 14.</strong> "Hello, world!" có 13 ký tự, cộng dấu kết <code>,0</code> khai tường minh = 14 byte. Bạn kiểm được mà không cần máy — đếm cả dấu phẩy, dấu cách và dấu chấm than.</li>
<li><strong>Ba section, ba việc — và slide gọi tên đủ cả ba.</strong> <code>.text</code> chứa lệnh (chỉ đọc, thực thi được), <code>.data</code> chứa dữ liệu <em>ĐÃ KHỞI TẠO</em> (chuỗi hằng), <code>.bss</code> chứa chỗ trống <em>CHƯA KHỞI TẠO</em> (20 byte đích). Đây đúng là chỉ thị SECTION/SEGMENT của slide 18, và cũng đúng cái chia ba mà bạn sẽ gặp lại ở slide 29 dưới tên "Program / Data" bên trong tệp đối tượng.</li>
<li><strong><code>global main</code> là lời nhắn cho BỘ LIÊN KẾT, không phải cho CPU.</strong> Chú thích trên slide nói thẳng: "must be declared for using gcc", "tell linker entry point". Thiếu nó thì ký hiệu <code>main</code> chỉ cục bộ trong tệp đối tượng này, phần chạy nền của C không tìm ra, và bạn nhận lỗi <em>undefined symbol</em> ở bước liên kết — lại là cặp GLOBAL/EXTERN của slide 18.</li>
<li><strong>Vì sao <code>int 0x80</code> mà không phải <code>call write</code>.</strong> Một lời gọi hệ thống phải vượt từ chế độ người dùng sang chế độ nhân, và cánh cửa hợp pháp duy nhất là một lệnh bẫy. <code>int 0x80</code> là cánh cửa đó trên Linux 32 bit. Chỗ này nối thẳng sang Ch.8/Ch.9 (hỗ trợ của hệ điều hành): chính ngắt mới là thứ giữ quyền kiểm soát cho hệ điều hành.</li>
</ul>
<p class="dap-an">✅ Trả lời câu hỏi hiển nhiên, "rốt cuộc nó in ra đúng những gì?" Phép chép chuyển <code>len</code> = <strong>14</strong> byte, nhưng lệnh ghi đòi <code>edx</code> = <strong>20</strong> byte. Nên chương trình in 13 ký tự nhìn thấy, rồi byte NUL kết chuỗi, rồi <strong>6 byte nữa mà <code>rep movsb</code> chưa từng ghi vào</strong>. Sáu byte đó đến từ <code>s2 resb 20</code> trong <code>.bss</code>, mà bộ tải điền sẵn số 0, nên thực tế bạn thấy "Hello, world!" kèm bảy byte NUL vô hình. Kết quả nhìn thì đúng, mà chương trình vẫn đang đọc những byte nó chưa hề khởi tạo.</p>
<p class="pitfall">⚠️ Hãy coi chỗ lệch ấy là BÀI HỌC, không phải chuyện lạ vui. Dòng an toàn là <code>mov edx, len</code> — để trình dịch tính độ dài một lần, y như nó đã làm cho <code>ecx</code>. Con số <code>20</code> nhét cứng là lấy ĐỘ DÀI VÙNG ĐỆM dùng thay cho ĐỘ DÀI DỮ LIỆU; đó đúng là sự nhầm lẫn sinh ra lỗi đọc quá vùng đệm trong mã C thật (nghĩ tới <code>strcpy</code> so với <code>strncpy</code>). Bản trên slide đúng <em>một cách tình cờ</em>, chỉ vì <code>.bss</code> ngẫu nhiên được xoá về 0.</p>
<p class="meo">💡 Nhớ công thức gọi hệ thống thành một câu: <strong>"số hiệu vào EAX, tham số vào EBX, ECX, EDX, rồi gõ cửa bằng INT 0x80."</strong> Slide 19 đã cho bạn thứ tự thanh ghi (EBX trước, rồi ECX, EDX, ESI, EDI, EBP); slide này là thứ tự đó đang chạy, hai lần.</p>`],

      [25, 'TYPES OF ASSEMBLERS',
        `<p class="y-chinh">🎯 An assembler is "a software that translates assembly language into machine language", and although all assemblers perform the same tasks, <strong>their implementations vary</strong>. The slide lists seven names you are expected to be able to tell apart.</p>
<table>
<tr><th>Type</th><th>What makes it that type</th><th>Where you meet it</th></tr>
<tr><td><strong>Cross-assembler</strong></td><td>Runs on one machine, produces code for a <em>different</em> machine</td><td>Building ARM firmware on your x86 laptop; every embedded toolchain</td></tr>
<tr><td><strong>Resident assembler</strong></td><td>Runs on the same machine it produces code for</td><td>NASM on the PC that will run the program (slides 22 and 24)</td></tr>
<tr><td><strong>Macroassembler</strong></td><td>Supports macro definition and expansion</td><td>Slide 16: the macro is expanded <em>at assembly time</em>, no call overhead</td></tr>
<tr><td><strong>Microassembler</strong></td><td>Assembles the <em>microprogram</em> of a control unit, not user programs</td><td>Ch.19, microprogrammed control — a level below the instruction set</td></tr>
<tr><td><strong>Meta-assembler</strong></td><td>Can be told what instruction set to assemble — the target is data, not code</td><td>Retargetable toolchains, CPU research</td></tr>
<tr><td><strong>One-pass assembler</strong></td><td>Reads the source <em>once</em> and patches forward references afterwards</td><td>Slide 28</td></tr>
<tr><td><strong>Two-pass assembler</strong></td><td>Reads the source <em>twice</em>: pass 1 builds the symbol table, pass 2 emits code</td><td>Slide 26 (Figure 15.8)</td></tr>
</table>
<ul>
<li><strong>The seven are not seven parallel categories — they are three different questions.</strong> <em>Where does it run?</em> → cross versus resident. <em>What can it do?</em> → macroassembler, microassembler, meta-assembler. <em>How many times does it read the file?</em> → one-pass versus two-pass. A single real assembler answers all three at once: NASM is resident-or-cross, a macroassembler, and multi-pass.</li>
<li><strong>Cross-assembler is the one with real-world weight.</strong> Slide 4 said assembly language is <em>hardware dependent</em>, with a different language per processor. That is exactly why cross-assembly exists: the target machine may have no keyboard, no disk and 2 kB of RAM — it could not host a toolchain even in principle.</li>
<li><strong>Do not confuse microassembler with macroassembler.</strong> They differ by one letter and sit at opposite ends. A <strong>macro</strong>assembler works <em>above</em> the instruction set (one macro line expands into many instructions). A <strong>micro</strong>assembler works <em>below</em> it (one machine instruction is implemented by many microoperations). Ch.19 is where the second one lives.</li>
<li><strong>Meta-assembler is the rarest and the easiest to describe.</strong> An ordinary assembler has one instruction set hard-wired into it. A meta-assembler reads a <em>description</em> of an instruction set and then assembles for it. Same idea as a parser generator: the grammar is input, not source code.</li>
<li><strong>One-pass versus two-pass is the only pair the exam actually tests.</strong> The whole difference is <strong>forward references</strong> — a <code>jmp</code> to a label defined later in the file. Two-pass solves it by learning all the labels first (slide 26); one-pass solves it by leaving a hole and coming back (slide 28). Everything else in the pair follows from that.</li>
</ul>
<p class="dap-an">✅ Quick classification drill with answers. (1) "A program on a Windows PC that produces code for an 8051 microcontroller" → <strong>cross-assembler</strong>. (2) "An assembler whose input includes a definition of the opcodes it should recognise" → <strong>meta-assembler</strong>. (3) "The tool that turns the control unit's microcode source into control words" → <strong>microassembler</strong>. (4) "An assembler that cannot handle a jump to a label further down the file without extra bookkeeping" → <strong>one-pass assembler</strong>.</p>
<p class="meo">💡 Memory hook: <strong>cross</strong> = crosses to another machine · <strong>resident</strong> = stays at home · <strong>macro</strong> = bigger than one instruction · <strong>micro</strong> = smaller than one instruction · <strong>meta</strong> = about the instruction set itself · <strong>one/two-pass</strong> = how many times it reads the file.</p>`,
        `<p class="y-chinh">🎯 Trình dịch hợp ngữ là "phần mềm dịch hợp ngữ sang ngôn ngữ máy", và tuy mọi trình dịch đều làm cùng những việc ấy, <strong>cách CÀI ĐẶT của chúng khác nhau</strong>. Slide liệt kê bảy cái tên mà bạn phải phân biệt được.</p>
<table>
<tr><th>Loại</th><th>Điều gì làm nên loại đó</th><th>Gặp ở đâu</th></tr>
<tr><td><strong>Cross-assembler</strong> (dịch chéo)</td><td>Chạy trên một máy, sinh mã cho một máy <em>KHÁC</em></td><td>Dựng firmware ARM ngay trên laptop x86; mọi bộ công cụ nhúng</td></tr>
<tr><td><strong>Resident assembler</strong> (thường trú)</td><td>Chạy trên chính cái máy sẽ chạy mã nó sinh ra</td><td>NASM trên đúng máy PC sẽ chạy chương trình (slide 22 và 24)</td></tr>
<tr><td><strong>Macroassembler</strong></td><td>Hỗ trợ định nghĩa và khai triển macro</td><td>Slide 16: macro được khai triển <em>LÚC DỊCH</em>, không tốn phí gọi hàm</td></tr>
<tr><td><strong>Microassembler</strong></td><td>Dịch <em>VI CHƯƠNG TRÌNH</em> của khối điều khiển, không dịch chương trình người dùng</td><td>Ch.19, điều khiển vi chương trình — một tầng DƯỚI tập lệnh</td></tr>
<tr><td><strong>Meta-assembler</strong></td><td>Có thể được khai báo cho biết phải dịch tập lệnh nào — đích đến là DỮ LIỆU, không phải mã</td><td>Bộ công cụ đổi đích được, nghiên cứu CPU</td></tr>
<tr><td><strong>One-pass assembler</strong></td><td>Đọc mã nguồn MỘT lượt rồi vá các tham chiếu tiến sau</td><td>Slide 28</td></tr>
<tr><td><strong>Two-pass assembler</strong></td><td>Đọc mã nguồn HAI lượt: lượt 1 dựng bảng ký hiệu, lượt 2 sinh mã</td><td>Slide 26 (Figure 15.8)</td></tr>
</table>
<ul>
<li><strong>Bảy cái này KHÔNG phải bảy loại song song — chúng là ba câu hỏi khác nhau.</strong> <em>Nó chạy ở đâu?</em> → chéo hay thường trú. <em>Nó làm được gì?</em> → macro, micro, meta. <em>Nó đọc tệp mấy lượt?</em> → một lượt hay hai lượt. Một trình dịch thật trả lời cả ba cùng lúc: NASM vừa thường trú hoặc chéo, vừa là macroassembler, vừa nhiều lượt.</li>
<li><strong>Cross-assembler là cái có sức nặng thực tế nhất.</strong> Slide 4 đã nói hợp ngữ <em>PHỤ THUỘC PHẦN CỨNG</em>, mỗi bộ xử lý một thứ tiếng riêng. Đó đúng là lý do dịch chéo tồn tại: máy đích có thể không có bàn phím, không có đĩa và chỉ 2 kB RAM — nó không thể chứa nổi bộ công cụ ngay cả trên nguyên tắc.</li>
<li><strong>Đừng lẫn microassembler với macroassembler.</strong> Chúng lệch nhau một chữ cái và nằm ở hai đầu đối nhau. <strong>MACRO</strong>assembler làm việc <em>PHÍA TRÊN</em> tập lệnh (một dòng macro nở ra nhiều lệnh). <strong>MICRO</strong>assembler làm việc <em>PHÍA DƯỚI</em> nó (một lệnh máy được thực hiện bởi nhiều vi thao tác). Ch.19 là chỗ cái thứ hai sống.</li>
<li><strong>Meta-assembler hiếm nhất mà lại dễ mô tả nhất.</strong> Trình dịch thường có ĐÚNG MỘT tập lệnh đóng cứng bên trong. Meta-assembler đọc vào một BẢN MÔ TẢ tập lệnh rồi mới dịch theo nó. Cùng ý tưởng với bộ sinh trình phân tích cú pháp: văn phạm là ĐẦU VÀO, không phải mã nguồn.</li>
<li><strong>Cặp một lượt / hai lượt mới là thứ đề thi thật sự hỏi.</strong> Toàn bộ khác biệt nằm ở <strong>THAM CHIẾU TIẾN</strong> — một lệnh <code>jmp</code> tới nhãn định nghĩa ở phía sau trong tệp. Hai lượt giải bằng cách học hết nhãn trước (slide 26); một lượt giải bằng cách chừa lỗ rồi quay lại lấp (slide 28). Mọi khác biệt còn lại đều suy ra từ đó.</li>
</ul>
<p class="dap-an">✅ Bài phân loại nhanh kèm đáp án. (1) "Một chương trình trên PC Windows sinh mã cho vi điều khiển 8051" → <strong>cross-assembler</strong>. (2) "Trình dịch mà đầu vào có kèm cả định nghĩa những mã lệnh nó phải nhận ra" → <strong>meta-assembler</strong>. (3) "Công cụ biến mã nguồn vi chương trình của khối điều khiển thành các từ điều khiển" → <strong>microassembler</strong>. (4) "Trình dịch không xử lý nổi một lệnh nhảy tới nhãn ở phía sau tệp nếu không ghi sổ thêm" → <strong>one-pass assembler</strong>.</p>
<p class="meo">💡 Mẹo nhớ: <strong>cross</strong> = vượt sang máy khác · <strong>resident</strong> = ở nhà · <strong>macro</strong> = TO hơn một lệnh · <strong>micro</strong> = NHỎ hơn một lệnh · <strong>meta</strong> = nói về chính tập lệnh · <strong>một/hai lượt</strong> = đọc tệp mấy lần.</p>`],

      [26, 'Figure 15.8 — Flowchart of Two-Pass Assembler',
        `<p class="y-chinh">🎯 The algorithm of a two-pass assembler, drawn as two parallel flowcharts. <strong>Pass 1 learns where everything is; Pass 2 writes the machine code.</strong> The two passes communicate through exactly two objects: an <em>intermediate file</em> and a <em>symbol table</em>.</p>
<table>
<tr><th>Pass 1 — boxes on the slide, in order</th><th>Pass 2 — boxes on the slide, in order</th></tr>
<tr><td>Read line from source file</td><td>read next line from intermediate file</td></tr>
<tr><td>eof? → yes → <em>Close source file and rewind intermediate file</em> → Pass 2</td><td>eof? → yes → <strong>Stop</strong></td></tr>
<tr><td>label defined? → yes → <strong>Store name and value in symbol table</strong></td><td>assemble instruction</td></tr>
<tr><td>determine size of instruction</td><td>write object instruction into object file</td></tr>
<tr><td><strong>LC = LC + size</strong></td><td>write source &amp; object lines into listing file</td></tr>
<tr><td>write source line &amp; other info on intermediate file → loop back</td><td>loop back to "read next line"</td></tr>
</table>
<ul>
<li><strong>LC is the location counter, and it is the heart of pass 1.</strong> It starts at the program origin and, for every line, advances by the <em>size</em> of that line's instruction. When a label appears, the <em>current</em> value of LC is what gets stored in the symbol table. That is the precise meaning of slide 9's sentence: "the assembler defines the label as equivalent to the address into which the first byte of the object code generated for that instruction will be loaded".</li>
<li><strong>Notice what pass 1 does <em>not</em> do: it never emits a single byte of machine code.</strong> It only measures. That is why the box says "determine size of instruction" rather than "assemble instruction" — on a variable-length instruction set like x86 the size is itself a small calculation, and getting it wrong shifts every later address.</li>
<li><strong>The intermediate file exists so pass 2 never re-parses the source.</strong> Pass 1 has already split each line into label / mnemonic / operands; writing that out means pass 2 does pure translation. The slide even shows "rewind intermediate file" — the same file, read again from the start.</li>
<li><strong>Two passes solve forward references for free.</strong> By the time pass 2 sees <code>JUMP Done</code>, the symbol <code>Done</code> is already in the table with its address, because pass 1 walked the whole file first. No patching, no fix-up list. Compare slide 28, where a single pass must invent both.</li>
<li><strong>The listing file is the third output, and students forget it exists.</strong> "write source &amp; object lines into listing file" — the human-readable side-by-side of your source and the bytes it became. That is what you read in a lab when the machine code is not what you expected.</li>
</ul>
<p class="nhan">📐 <strong>Run for real.</strong> A two-pass assembler for MARIE was written in python3 for this lesson (about 40 lines: pass 1 walks the lines maintaining LC and filling a dictionary, pass 2 re-walks and emits words). Input — the multiply-by-repeated-addition program:</p>
<pre><code>        ORG 100
        Clear
        Store Prod
Loop,   Load  Y
        Skipcond 800
        Jump  Done
        Load  Prod
        Add   X
        Store Prod
        Load  Y
        Subt  One
        Store Y
        Jump  Loop
Done,   Load  Prod
        Output
        Halt
Prod,   DEC 0
X,      DEC 7
Y,      DEC 6
One,    DEC 1</code></pre>
<p class="nhan">📐 <strong>Output of pass 1 — the symbol table</strong> (every MARIE instruction is one word, so here LC simply counts up by 1):</p>
<table>
<tr><th>Symbol</th><th>Value (LC when the label was seen)</th></tr>
<tr><td>Loop</td><td>102</td></tr>
<tr><td>Done</td><td>10C</td></tr>
<tr><td>Prod</td><td>10F</td></tr>
<tr><td>X</td><td>110</td></tr>
<tr><td>Y</td><td>111</td></tr>
<tr><td>One</td><td>112</td></tr>
</table>
<p class="nhan">📐 <strong>Output of pass 2 — the object file</strong> (address: 16-bit word, opcode nibble on the left, address in the remaining 12 bits):</p>
<pre><code>100: A000   Clear            10A: 2111   Store Y
101: 210F   Store Prod       10B: 9102   Jump  Loop
102: 1111   Load  Y          10C: 110F   Load  Prod
103: 8800   Skipcond 800     10D: 6000   Output
104: 910C   Jump  Done       10E: 7000   Halt
105: 110F   Load  Prod       10F: 0000   Prod  DEC 0
106: 3110   Add   X          110: 0007   X     DEC 7
107: 210F   Store Prod       111: 0006   Y     DEC 6
108: 1111   Load  Y          112: 0001   One   DEC 1
109: 4112   Subt  One</code></pre>
<p class="dap-an">✅ Read the two passes off the listing. Pass 1 produced <code>Done = 10C</code> by counting lines. Pass 2 then turned <code>Jump Done</code> at address 104 into the word <strong><code>910C</code></strong> — opcode <code>9</code> (Jump) in the top nibble, address <code>10C</code> in the bottom twelve bits. That single word is the whole point of the flowchart: <strong>the name became a number, and the number came from the symbol table.</strong> Note that <code>Jump Done</code> is a <em>forward</em> reference — <code>Done</code> is defined eight lines later — and two passes handled it without noticing.</p>
<p class="pitfall">⚠️ The trap that ruins pass 1 on a real machine: an instruction whose size depends on the value of an operand that is itself a forward reference. On x86 a short jump is 2 bytes and a near jump is 5; if the target is not yet known, the assembler must guess, and a wrong guess shifts <em>every</em> subsequent address. Real assemblers either assume the long form or add extra passes. MARIE has no such problem because every instruction is exactly one word — which is precisely why the course teaches it first.</p>`,
        `<p class="y-chinh">🎯 Thuật toán của trình dịch hợp ngữ HAI LƯỢT, vẽ thành hai lưu đồ song song. <strong>Lượt 1 học xem cái gì nằm ở đâu; Lượt 2 mới viết mã máy.</strong> Hai lượt trao đổi với nhau qua đúng hai thứ: một <em>tệp trung gian</em> và một <em>bảng ký hiệu</em>.</p>
<table>
<tr><th>Lượt 1 — các ô trên slide, theo thứ tự</th><th>Lượt 2 — các ô trên slide, theo thứ tự</th></tr>
<tr><td>Đọc một dòng từ tệp nguồn</td><td>Đọc dòng kế tiếp từ tệp trung gian</td></tr>
<tr><td>Hết tệp? → có → <em>Đóng tệp nguồn và tua tệp trung gian về đầu</em> → sang Lượt 2</td><td>Hết tệp? → có → <strong>Dừng</strong></td></tr>
<tr><td>Có nhãn được định nghĩa không? → có → <strong>Lưu tên và giá trị vào bảng ký hiệu</strong></td><td>Dịch lệnh</td></tr>
<tr><td>Xác định KÍCH THƯỚC của lệnh</td><td>Ghi lệnh đối tượng vào tệp đối tượng</td></tr>
<tr><td><strong>LC = LC + size</strong></td><td>Ghi dòng nguồn và dòng đối tượng vào tệp listing</td></tr>
<tr><td>Ghi dòng nguồn và thông tin khác ra tệp trung gian → quay lại đầu vòng</td><td>Quay lại "đọc dòng kế tiếp"</td></tr>
</table>
<ul>
<li><strong>LC là BỘ ĐẾM VỊ TRÍ, và nó là trái tim của lượt 1.</strong> Nó bắt đầu ở địa chỉ gốc của chương trình rồi với mỗi dòng lại tiến thêm đúng <em>KÍCH THƯỚC</em> của lệnh ở dòng đó. Khi gặp một nhãn, giá trị <em>HIỆN TẠI</em> của LC chính là thứ được cất vào bảng ký hiệu. Đó là nghĩa chính xác của câu ở slide 9: "trình dịch định nghĩa nhãn tương đương với địa chỉ mà byte đầu tiên của mã đối tượng sinh cho lệnh đó sẽ được nạp vào".</li>
<li><strong>Để ý điều lượt 1 KHÔNG làm: nó không sinh ra một byte mã máy nào.</strong> Nó chỉ ĐO. Vì thế ô trên slide ghi "determine size of instruction" chứ không ghi "assemble instruction" — trên một tập lệnh dài ngắn khác nhau như x86, chính cái kích thước đã là một phép tính nhỏ, mà đoán sai thì mọi địa chỉ phía sau xê dịch theo.</li>
<li><strong>Tệp trung gian tồn tại để lượt 2 KHỎI phải phân tích lại mã nguồn.</strong> Lượt 1 đã tách mỗi dòng thành nhãn / từ gợi nhớ / toán hạng rồi; ghi kết quả đó ra nghĩa là lượt 2 chỉ còn việc dịch thuần tuý. Slide còn vẽ hẳn ô "rewind intermediate file" — vẫn tệp ấy, đọc lại từ đầu.</li>
<li><strong>Hai lượt giải bài toán THAM CHIẾU TIẾN một cách miễn phí.</strong> Tới lúc lượt 2 nhìn thấy <code>JUMP Done</code> thì ký hiệu <code>Done</code> đã nằm sẵn trong bảng kèm địa chỉ, vì lượt 1 đã đi hết tệp trước rồi. Không phải vá, không phải danh sách sửa sau. So với slide 28, nơi một lượt duy nhất buộc phải bịa ra cả hai thứ đó.</li>
<li><strong>Tệp listing là đầu ra THỨ BA, và sinh viên hay quên nó có tồn tại.</strong> "write source &amp; object lines into listing file" — bản đối chiếu người đọc được, mã nguồn của bạn kề bên những byte nó đã biến thành. Đó chính là thứ bạn mở ra trong buổi lab khi mã máy không giống điều bạn tưởng.</li>
</ul>
<p class="nhan">📐 <strong>CHẠY THẬT.</strong> Một trình dịch hai lượt cho MARIE đã được viết bằng python3 cho bài này (khoảng 40 dòng: lượt 1 đi hết các dòng, giữ LC và điền một từ điển; lượt 2 đi lại và phát ra từng từ máy). Đầu vào — chương trình nhân bằng cộng lặp:</p>
<pre><code>        ORG 100
        Clear
        Store Prod
Loop,   Load  Y
        Skipcond 800
        Jump  Done
        Load  Prod
        Add   X
        Store Prod
        Load  Y
        Subt  One
        Store Y
        Jump  Loop
Done,   Load  Prod
        Output
        Halt
Prod,   DEC 0
X,      DEC 7
Y,      DEC 6
One,    DEC 1</code></pre>
<p class="nhan">📐 <strong>Kết quả lượt 1 — bảng ký hiệu</strong> (mọi lệnh MARIE dài đúng một từ nên ở đây LC chỉ đơn giản tăng 1):</p>
<table>
<tr><th>Ký hiệu</th><th>Giá trị (LC lúc gặp nhãn)</th></tr>
<tr><td>Loop</td><td>102</td></tr>
<tr><td>Done</td><td>10C</td></tr>
<tr><td>Prod</td><td>10F</td></tr>
<tr><td>X</td><td>110</td></tr>
<tr><td>Y</td><td>111</td></tr>
<tr><td>One</td><td>112</td></tr>
</table>
<p class="nhan">📐 <strong>Kết quả lượt 2 — tệp đối tượng</strong> (địa chỉ: từ 16 bit, nửa byte mã lệnh bên trái, địa chỉ trong 12 bit còn lại):</p>
<pre><code>100: A000   Clear            10A: 2111   Store Y
101: 210F   Store Prod       10B: 9102   Jump  Loop
102: 1111   Load  Y          10C: 110F   Load  Prod
103: 8800   Skipcond 800     10D: 6000   Output
104: 910C   Jump  Done       10E: 7000   Halt
105: 110F   Load  Prod       10F: 0000   Prod  DEC 0
106: 3110   Add   X          110: 0007   X     DEC 7
107: 210F   Store Prod       111: 0006   Y     DEC 6
108: 1111   Load  Y          112: 0001   One   DEC 1
109: 4112   Subt  One</code></pre>
<p class="dap-an">✅ Đọc hai lượt ngay trên bản in. Lượt 1 cho ra <code>Done = 10C</code> bằng cách đếm dòng. Lượt 2 sau đó biến <code>Jump Done</code> ở địa chỉ 104 thành từ máy <strong><code>910C</code></strong> — mã lệnh <code>9</code> (Jump) ở nửa byte cao, địa chỉ <code>10C</code> ở mười hai bit thấp. Đúng một từ đó là toàn bộ thông điệp của lưu đồ: <strong>cái TÊN đã thành con SỐ, và con số ấy lấy từ bảng ký hiệu.</strong> Để ý <code>Jump Done</code> là một tham chiếu <em>TIẾN</em> — <code>Done</code> được định nghĩa tám dòng sau — mà hai lượt xử lý gọn tới mức không ai để ý.</p>
<p class="pitfall">⚠️ Cái bẫy giết lượt 1 trên máy thật: một lệnh mà KÍCH THƯỚC của nó phụ thuộc vào GIÁ TRỊ của toán hạng, trong khi chính toán hạng đó lại là tham chiếu tiến. Trên x86 lệnh nhảy ngắn dài 2 byte còn nhảy gần dài 5; đích chưa biết thì trình dịch buộc phải ĐOÁN, mà đoán sai là xê dịch <em>TOÀN BỘ</em> địa chỉ phía sau. Trình dịch thật hoặc luôn giả định dạng dài, hoặc thêm lượt nữa. MARIE không dính chuyện này vì mọi lệnh đều đúng một từ — và đó chính là lý do môn học dạy nó trước.</p>`],

      [27, 'Figure 15.9 — Translating an ARM Assembly Instruction into a Binary Machine Instruction',
        `<p class="y-chinh">🎯 One assembly line, <code>ADDS r3, r3, #19</code>, exploded into the 32 bits the processor actually fetches. This is the single clearest picture in the chapter of what "assembling" <em>means</em>: every symbol on the left becomes a fixed-width bit field on the right.</p>
<table>
<tr><th>Bits</th><th>Field name on the slide</th><th>Value printed</th><th>Meaning</th></tr>
<tr><td>31–28</td><td>cond</td><td><code>1110</code></td><td>"always" condition code — execute unconditionally</td></tr>
<tr><td>27–25</td><td>instr format</td><td><code>001</code></td><td>data processing, immediate operand format</td></tr>
<tr><td>24–21</td><td>opcode</td><td><code>0010</code></td><td>which arithmetic/logic operation</td></tr>
<tr><td>20</td><td>S</td><td><code>1</code></td><td>"update condition flags" — the S in ADD<strong>S</strong></td></tr>
<tr><td>19–16</td><td>Rn</td><td><code>0011</code></td><td>first source register = r3</td></tr>
<tr><td>15–12</td><td>Rd</td><td><code>0011</code></td><td>destination register = r3</td></tr>
<tr><td>11–8</td><td>rotate</td><td><code>0000</code></td><td>"zero rotation" — do not rotate the immediate</td></tr>
<tr><td>7–0</td><td>immediate</td><td><code>00010011</code></td><td>= 19 decimal, the <code>#19</code> in the source</td></tr>
</table>
<ul>
<li><strong>Every bit is accounted for: 4 + 3 + 4 + 1 + 4 + 4 + 4 + 8 = 32.</strong> Check that sum first in any instruction-format question — a format that does not add up to the word size is a misread.</li>
<li><strong>The three symbols in the source map to three fields, and nothing is left over.</strong> <code>#19</code> → the immediate field; the two <code>r3</code>s → Rn and Rd; the <strong>S</strong> suffix → bit 20. The mnemonic <code>ADD</code> itself → the opcode field. That is assembly in one sentence: <em>a one-to-one, mechanical, table-driven substitution</em> — exactly what slide 4 meant by "each assembly language instruction is translated into one machine instruction".</li>
<li><strong>The <code>cond</code> field is ARM's signature feature.</strong> Every ARM instruction, not just branches, carries a 4-bit condition. <code>1110</code> = AL = always. Put <code>0000</code> (EQ) there instead and the very same ADD only executes when the Z flag is set — that is <em>predicated execution</em>, and it removes short branches entirely. Ch.17 (RISC) explains why that mattered so much for pipelining.</li>
<li><strong>The <code>rotate</code> field is the clever trick.</strong> Eight bits can only hold 0–255, which would be a crippling limit. ARM lets those 8 bits be rotated right by an even number of positions given by the 4-bit rotate field, so a single word can express values like 0x3F000000. Here rotate = 0, so the immediate is plain 19.</li>
<li><strong>This is the other half of Ch.14.</strong> Ch.14 taught addressing <em>modes</em>; this slide shows the <em>format</em> that encodes one. The immediate mode needs only 8 bits of payload; a memory operand would have needed a different format entirely, which is why bits 27–25 exist.</li>
</ul>
<p class="nhan">📐 <strong>Checked against a real assembler.</strong> The bit string was fed to clang's ARM back end (<code>clang -target armv7-none-eabi</code>) to see what the same two instructions really encode to:</p>
<table>
<tr><th>Source line</th><th>Encoding produced by the assembler</th><th>opcode field (bits 24–21)</th></tr>
<tr><td><code>adds r3, r3, #19</code></td><td><code>0xE2933013</code></td><td><strong>0100</strong></td></tr>
<tr><td><code>subs r3, r3, #19</code></td><td><code>0xE2533013</code></td><td><strong>0010</strong></td></tr>
<tr><td>the bits drawn on the slide</td><td><code>0xE2533013</code></td><td><strong>0010</strong></td></tr>
</table>
<p class="dap-an">✅ Everything on the slide is right <em>except the opcode field</em>. In the ARM data-processing encoding, <code>0100</code> is ADD and <code>0010</code> is SUB. The slide labels the instruction <code>ADDS r3, r3, #19</code> but draws <code>0010</code>, so the 32 bits as printed assemble to <strong><code>SUBS r3, r3, #19</code></strong>, not ADDS. The correct word for ADDS r3, r3, #19 is <code>0xE2933013</code>; the slide's word is <code>0xE2533013</code>. Everything else — cond, format, S, Rn, Rd, rotate, immediate — matches the real encoding bit for bit. State this in an exam answer rather than copying the figure silently, and do not "correct" the slide in your notes without saying which bits you changed and why.</p>
<p class="pitfall">⚠️ The deeper lesson is the one this course keeps repeating: <strong>a figure is a claim, and a claim can be measured.</strong> Reading the diagram carefully would never have found this; running an assembler found it in one command. When a number in a book can be reproduced by a tool you already have, reproduce it.</p>
<p class="meo">💡 Decode-by-hand recipe for the exam: (1) split the word into the fields the format demands, (2) check the widths sum to 32, (3) translate cond and opcode through their tables, (4) read Rn/Rd as register numbers, (5) convert the immediate to decimal. Five steps, in that order, every time.</p>`,
        `<p class="y-chinh">🎯 Một dòng hợp ngữ, <code>ADDS r3, r3, #19</code>, bung ra thành đúng 32 bit mà bộ xử lý nạp vào. Đây là bức hình rõ nghĩa nhất cả chương về chuyện "dịch hợp ngữ" NGHĨA LÀ GÌ: mỗi ký hiệu bên trái biến thành một trường bit rộng cố định bên phải.</p>
<table>
<tr><th>Bit</th><th>Tên trường trên slide</th><th>Giá trị in</th><th>Ý nghĩa</th></tr>
<tr><td>31–28</td><td>cond</td><td><code>1110</code></td><td>mã điều kiện "always" — chạy vô điều kiện</td></tr>
<tr><td>27–25</td><td>instr format</td><td><code>001</code></td><td>xử lý dữ liệu, khuôn dạng toán hạng tức thời</td></tr>
<tr><td>24–21</td><td>opcode</td><td><code>0010</code></td><td>phép số học/logic nào</td></tr>
<tr><td>20</td><td>S</td><td><code>1</code></td><td>"cập nhật cờ điều kiện" — chữ S trong ADD<strong>S</strong></td></tr>
<tr><td>19–16</td><td>Rn</td><td><code>0011</code></td><td>thanh ghi nguồn thứ nhất = r3</td></tr>
<tr><td>15–12</td><td>Rd</td><td><code>0011</code></td><td>thanh ghi đích = r3</td></tr>
<tr><td>11–8</td><td>rotate</td><td><code>0000</code></td><td>"zero rotation" — không quay giá trị tức thời</td></tr>
<tr><td>7–0</td><td>immediate</td><td><code>00010011</code></td><td>= 19 hệ mười, chính là <code>#19</code> trong mã nguồn</td></tr>
</table>
<ul>
<li><strong>Mọi bit đều có chỗ: 4 + 3 + 4 + 1 + 4 + 4 + 4 + 8 = 32.</strong> Hãy kiểm tổng đó TRƯỚC trong mọi câu hỏi về khuôn dạng lệnh — một khuôn dạng không cộng ra đúng độ dài từ máy là dấu hiệu bạn đọc nhầm.</li>
<li><strong>Ba ký hiệu trong mã nguồn ánh xạ vào ba trường, và không thừa gì cả.</strong> <code>#19</code> → trường tức thời; hai chữ <code>r3</code> → Rn và Rd; hậu tố <strong>S</strong> → bit 20. Còn từ gợi nhớ <code>ADD</code> → trường opcode. Dịch hợp ngữ gói trong một câu: <em>phép thay thế MỘT-ĐỔI-MỘT, máy móc, tra bảng</em> — đúng ý slide 4 khi nói "mỗi lệnh hợp ngữ được dịch thành một lệnh máy".</li>
<li><strong>Trường <code>cond</code> là đặc sản của ARM.</strong> MỌI lệnh ARM, không riêng lệnh rẽ nhánh, đều mang 4 bit điều kiện. <code>1110</code> = AL = luôn luôn. Thay bằng <code>0000</code> (EQ) thì đúng lệnh ADD ấy chỉ chạy khi cờ Z bật — đó là <em>thực thi có vị từ</em>, và nó xoá sổ các lệnh rẽ nhánh ngắn. Ch.17 (RISC) giải thích vì sao điều đó quan trọng đến thế với đường ống.</li>
<li><strong>Trường <code>rotate</code> mới là mẹo thông minh.</strong> Tám bit chỉ chứa nổi 0–255, một giới hạn quá ngặt. ARM cho phép quay phải tám bit ấy một số vị trí CHẴN do trường rotate 4 bit quy định, nhờ vậy một từ máy diễn tả được cả những giá trị như 0x3F000000. Ở đây rotate = 0 nên giá trị tức thời đúng bằng 19.</li>
<li><strong>Đây là nửa còn lại của Ch.14.</strong> Ch.14 dạy <em>CHẾ ĐỘ</em> định địa chỉ; slide này cho thấy <em>KHUÔN DẠNG</em> mã hoá một chế độ. Chế độ tức thời chỉ cần 8 bit tải trọng; một toán hạng bộ nhớ đã phải dùng khuôn dạng khác hẳn — đó là lý do bit 27–25 tồn tại.</li>
</ul>
<p class="nhan">📐 <strong>ĐÃ ĐỐI CHIẾU VỚI TRÌNH DỊCH THẬT.</strong> Dải bit được đem so với kết quả của chính bộ dịch ARM trong clang (<code>clang -target armv7-none-eabi</code>) trên hai lệnh:</p>
<table>
<tr><th>Dòng nguồn</th><th>Mã hoá do trình dịch thật sinh ra</th><th>Trường opcode (bit 24–21)</th></tr>
<tr><td><code>adds r3, r3, #19</code></td><td><code>0xE2933013</code></td><td><strong>0100</strong></td></tr>
<tr><td><code>subs r3, r3, #19</code></td><td><code>0xE2533013</code></td><td><strong>0010</strong></td></tr>
<tr><td>dải bit vẽ trên slide</td><td><code>0xE2533013</code></td><td><strong>0010</strong></td></tr>
</table>
<p class="dap-an">✅ Mọi thứ trên slide đều đúng <em>TRỪ trường opcode</em>. Trong mã hoá lệnh xử lý dữ liệu của ARM, <code>0100</code> là ADD còn <code>0010</code> là SUB. Slide ghi tên lệnh là <code>ADDS r3, r3, #19</code> nhưng vẽ <code>0010</code>, nên 32 bit đúng như in ấy dịch ra thành <strong><code>SUBS r3, r3, #19</code></strong> chứ không phải ADDS. Từ máy ĐÚNG cho ADDS r3, r3, #19 là <code>0xE2933013</code>; từ máy trên slide là <code>0xE2533013</code>. Mọi trường còn lại — cond, format, S, Rn, Rd, rotate, immediate — khớp mã hoá thật từng bit. Hãy NÓI RÕ điều này trong bài thi thay vì chép lại hình một cách lặng lẽ, và cũng đừng "sửa" slide trong vở mà không ghi bạn đã đổi bit nào, vì sao.</p>
<p class="pitfall">⚠️ Bài học sâu hơn là thứ môn này nhắc đi nhắc lại: <strong>một hình vẽ là một LỜI KHẲNG ĐỊNH, mà lời khẳng định thì ĐO ĐƯỢC.</strong> Đọc kỹ sơ đồ sẽ không bao giờ tìm ra lỗi này; chạy một trình dịch thì tìm ra trong một câu lệnh. Khi một con số trong sách có thể tái tạo bằng công cụ bạn đang có sẵn, hãy tái tạo nó.</p>
<p class="meo">💡 Công thức giải mã bằng tay cho phòng thi: (1) cắt từ máy theo đúng các trường mà khuôn dạng quy định, (2) kiểm tổng độ rộng có ra 32 không, (3) tra bảng dịch cond và opcode, (4) đọc Rn/Rd thành số hiệu thanh ghi, (5) đổi giá trị tức thời sang hệ mười. Năm bước, đúng thứ tự đó, lần nào cũng vậy.</p>`],

      [28, 'One-Pass Assembler',
        `<p class="y-chinh">🎯 It <em>is</em> possible to assemble a program in a single pass. The slide states the one difficulty plainly — <strong>"the main difficulty in trying to assemble a program in one pass involves forward references to labels"</strong> — and then gives the exact three-step bookkeeping that solves it.</p>
<p class="nhan">📐 What the slide says the assembler does when it meets an operand symbol that is not yet defined:</p>
<table>
<tr><th>Step</th><th>The slide's wording</th><th>What it means in practice</th></tr>
<tr><td>1</td><td>It leaves the instruction operand field <strong>empty</strong> in the assembled binary instruction</td><td>The opcode is written now; the address bits are a hole</td></tr>
<tr><td>2</td><td>The symbol is entered in the <strong>symbol table</strong> and the entry is <strong>flagged</strong> to indicate that the symbol is <strong>undefined</strong></td><td>A promise: "someone will define this later"</td></tr>
<tr><td>3</td><td>The <strong>address of the operand field</strong> in the instruction that refers to the undefined symbol is added to a <strong>list of forward references</strong> associated with that symbol table entry</td><td>A to-do list of holes to fill, one per use</td></tr>
</table>
<ul>
<li><strong>Read step 3 twice — it is the whole idea.</strong> The assembler does not remember "there was a forward reference somewhere"; it remembers <em>the exact address of the hole</em>. When the label finally gets defined, the assembler walks that list and pokes the now-known value into every recorded position. That data structure has a name in real toolchains: a <strong>fix-up list</strong> or backpatch list.</li>
<li><strong>Why the list, and not just one address?</strong> Because the same undefined label can be used many times before it is defined — five <code>jmp Done</code> lines mean five holes. The list grows as they arrive.</li>
<li><strong>What happens if the symbol is never defined?</strong> At end of file the assembler still holds entries flagged "undefined" with non-empty fix-up lists. Those become the error <em>undefined symbol</em>. Note where this error lives: in a one-pass <em>assembler</em> it is an assembly error; for a symbol declared <code>EXTERN</code> (slide 18) the assembler stays silent and the same complaint comes from the <strong>linker</strong> instead (slide 34).</li>
<li><strong>The real trade-off is speed versus memory-and-complexity.</strong> One pass reads the source file once — attractive when the source is on paper tape or a slow disk, which is the era this technique comes from. The cost is a more complicated symbol table and the backpatching logic. Two passes (slide 26) buy simplicity with a second read of a much smaller intermediate file.</li>
<li><strong>Size-dependent forward references are the hard limit.</strong> If knowing the target's value is needed to know the instruction's <em>length</em>, one pass cannot leave a hole of the right size. That is why one-pass assemblers are comfortable on fixed-length instruction sets (ARM, MARIE) and awkward on x86.</li>
</ul>
<p class="dap-an">✅ Worked example on the MARIE program from slide 26. Line <code>Jump Done</code> sits at address <strong>104</strong>, and <code>Done</code> is not defined until address <strong>10C</strong>, eight lines later. A one-pass assembler would: (1) emit <code>9000</code> at 104 — opcode 9 present, address bits empty; (2) put <code>Done</code> in the symbol table flagged <em>undefined</em>; (3) record "hole at 104" on Done's forward-reference list. Later, when the label <code>Done</code> is read with LC = 10C, it sets Done = 10C, walks the list, and rewrites 104 from <code>9000</code> to <strong><code>910C</code></strong> — which is exactly the word the two-pass assembler produced in one go. <strong>Same output, different amount of bookkeeping.</strong></p>
<p class="pitfall">⚠️ Exam trap worth memorising: a <em>backward</em> reference is never a problem in either design, because the label is already in the table when the instruction is read. Only <em>forward</em> references need machinery. If a question asks "why does a one-pass assembler need a fix-up list", the answer is not "because it is fast" — it is "because at the moment it must emit the instruction, the value does not exist yet".</p>
<p class="meo">💡 Picture it as filling in a form with a blank you promise to complete: you write the blank, staple a sticky note to the page saying where the blank is, and file the note under the missing person's name. When the person turns up, you pull their notes and fill in every blank at once.</p>`,
        `<p class="y-chinh">🎯 Dịch một chương trình chỉ trong MỘT lượt là việc làm được. Slide nêu thẳng khó khăn duy nhất — <strong>"khó khăn chính khi dịch một lượt nằm ở các THAM CHIẾU TIẾN tới nhãn"</strong> — rồi đưa ra đúng ba bước ghi sổ để giải nó.</p>
<p class="nhan">📐 Slide nói trình dịch làm gì khi gặp một toán hạng là ký hiệu CHƯA được định nghĩa:</p>
<table>
<tr><th>Bước</th><th>Nguyên văn slide</th><th>Nghĩa trong thực tế</th></tr>
<tr><td>1</td><td>Nó để TRỐNG trường toán hạng trong lệnh nhị phân vừa dịch</td><td>Mã lệnh được ghi ngay; phần bit địa chỉ là một cái LỖ</td></tr>
<tr><td>2</td><td>Ký hiệu đó được đưa vào <strong>bảng ký hiệu</strong> và mục đó được <strong>ĐÁNH DẤU</strong> là ký hiệu <strong>chưa định nghĩa</strong></td><td>Một lời hứa: "sẽ có ai đó định nghĩa nó sau"</td></tr>
<tr><td>3</td><td><strong>ĐỊA CHỈ của trường toán hạng</strong> trong lệnh đang tham chiếu tới ký hiệu chưa định nghĩa được thêm vào <strong>DANH SÁCH THAM CHIẾU TIẾN</strong> gắn với mục bảng ký hiệu đó</td><td>Một danh sách việc-phải-làm: mỗi lần dùng là một cái lỗ</td></tr>
</table>
<ul>
<li><strong>Đọc bước 3 hai lần — nó là toàn bộ ý tưởng.</strong> Trình dịch không nhớ kiểu "đâu đó có một tham chiếu tiến"; nó nhớ <em>ĐỊA CHỈ CHÍNH XÁC CỦA CÁI LỖ</em>. Khi nhãn rốt cuộc được định nghĩa, trình dịch đi hết danh sách ấy và nhét giá trị vừa biết vào từng vị trí đã ghi. Cấu trúc dữ liệu đó có tên hẳn hoi trong bộ công cụ thật: <strong>fix-up list</strong> (danh sách vá) hay backpatch list.</li>
<li><strong>Vì sao phải là một DANH SÁCH, không phải một địa chỉ?</strong> Vì cùng một nhãn chưa định nghĩa có thể bị dùng nhiều lần trước khi nó được định nghĩa — năm dòng <code>jmp Done</code> nghĩa là năm cái lỗ. Danh sách dài thêm mỗi lần gặp.</li>
<li><strong>Nếu ký hiệu KHÔNG BAO GIỜ được định nghĩa thì sao?</strong> Tới cuối tệp, trình dịch vẫn còn giữ những mục bị đánh dấu "chưa định nghĩa" với danh sách vá chưa rỗng. Chúng thành lỗi <em>undefined symbol</em>. Để ý lỗi đó sống ở ĐÂU: trong một <em>TRÌNH DỊCH</em> một lượt thì đó là lỗi dịch; còn với ký hiệu khai <code>EXTERN</code> (slide 18) thì trình dịch im lặng và cũng lời than ấy phát ra từ <strong>BỘ LIÊN KẾT</strong> (slide 34).</li>
<li><strong>Đánh đổi thật là TỐC ĐỘ lấy BỘ NHỚ-VÀ-ĐỘ PHỨC TẠP.</strong> Một lượt đọc tệp nguồn đúng một lần — rất hấp dẫn khi mã nguồn nằm trên băng giấy đục lỗ hay đĩa chậm, tức đúng cái thời kỹ thuật này ra đời. Cái giá là bảng ký hiệu phức tạp hơn và phần logic vá. Hai lượt (slide 26) mua sự đơn giản bằng một lần đọc lại tệp trung gian vốn nhỏ hơn nhiều.</li>
<li><strong>Tham chiếu tiến ảnh hưởng KÍCH THƯỚC lệnh là giới hạn cứng.</strong> Nếu phải biết giá trị của đích mới biết <em>ĐỘ DÀI</em> lệnh thì một lượt không thể chừa cái lỗ đúng cỡ. Vì thế trình dịch một lượt thoải mái trên tập lệnh dài cố định (ARM, MARIE) và vất vả trên x86.</li>
</ul>
<p class="dap-an">✅ Ví dụ giải trọn trên chính chương trình MARIE ở slide 26. Dòng <code>Jump Done</code> nằm ở địa chỉ <strong>104</strong>, còn <code>Done</code> mãi tới địa chỉ <strong>10C</strong> mới được định nghĩa, tám dòng sau. Trình dịch một lượt sẽ: (1) phát ra <code>9000</code> tại 104 — mã lệnh 9 đã có, phần bit địa chỉ để trống; (2) đưa <code>Done</code> vào bảng ký hiệu, đánh dấu <em>chưa định nghĩa</em>; (3) ghi "lỗ ở 104" vào danh sách tham chiếu tiến của Done. Về sau, khi đọc tới nhãn <code>Done</code> với LC = 10C, nó đặt Done = 10C, duyệt danh sách, và ghi đè 104 từ <code>9000</code> thành <strong><code>910C</code></strong> — đúng bằng từ máy mà trình dịch hai lượt tạo ra ngay từ đầu. <strong>Cùng một kết quả, khác nhau ở lượng sổ sách phải giữ.</strong></p>
<p class="pitfall">⚠️ Bẫy đề thi đáng thuộc lòng: tham chiếu <em>LÙI</em> KHÔNG bao giờ là vấn đề với cả hai thiết kế, vì lúc đọc tới lệnh thì nhãn đã nằm sẵn trong bảng. Chỉ tham chiếu <em>TIẾN</em> mới cần bộ máy phụ. Nếu đề hỏi "vì sao trình dịch một lượt cần danh sách vá", đáp án KHÔNG phải "vì nó nhanh" — mà là "vì đúng lúc nó buộc phải phát ra lệnh, giá trị ấy chưa tồn tại".</p>
<p class="meo">💡 Hình dung như điền một tờ khai còn một ô bỏ trống mà bạn hứa sẽ điền: bạn để trống ô đó, dán một mẩu giấy nhớ ghi rõ ô trống nằm ở đâu, rồi xếp mẩu giấy vào hồ sơ mang tên người còn thiếu. Lúc người ấy xuất hiện, bạn rút hết mẩu giấy của họ ra và điền một lượt.</p>`],

      [29, 'Figure 15.10 — The Loading Function',
        `<p class="y-chinh">🎯 The picture is deliberately simple: on the left a box labelled <strong>Object Code</strong> split into <em>Program</em> and <em>Data</em>; on the right a taller box labelled <strong>Process image in main memory</strong> containing <em>Process Control Block</em>, <em>Program</em>, <em>Data</em> and <em>Stack</em>; three dashed arrows copy the file into memory. <strong>Loading is a copy — plus two things the file did not contain.</strong></p>
<table>
<tr><th>In the object code file</th><th>In the process image</th><th>Where the extra part comes from</th></tr>
<tr><td>—</td><td><strong>Process Control Block</strong></td><td>Created by the <strong>operating system</strong>, not by the compiler. Holds the PC, registers, state, priority — Ch.9.</td></tr>
<tr><td>Program</td><td>Program</td><td>copied</td></tr>
<tr><td>Data</td><td>Data</td><td>copied</td></tr>
<tr><td>—</td><td><strong>Stack</strong></td><td>Allocated at load time and grows at run time; no bytes of it exist on disk</td></tr>
</table>
<ul>
<li><strong>The two boxes that have no source arrow are the whole message.</strong> A program on disk is not a process. Loading is what turns a passive file into a running thing, and the OS contributes the PCB and the stack to make that happen. Slide 31 will show why the stack has to be there.</li>
<li><strong>The loader is defined on slide 2:</strong> "a program routine that copies an executable program into memory for execution". Note the word <em>routine</em> — on a modern system the loader is a part of the OS kernel plus a user-space helper, not a separate program you run.</li>
<li><strong>The three sections of slide 24 reappear here.</strong> <code>.text</code> is the "Program" box, <code>.data</code> is the "Data" box, and <code>.bss</code> is the part of Data that occupies <em>no space in the file</em> but must be reserved and zeroed in memory. That asymmetry — a 20-byte buffer that costs 0 bytes on disk — is why an object file's size never equals its memory footprint.</li>
<li><strong>Loading is where address binding can happen.</strong> Table 15.4 on slide 32 lists "load time" as one of four possible binding times, and slide 33 draws what the loader has to change when it picks a different starting address.</li>
</ul>
<p class="nhan">📐 <strong>The whole road, run on this machine</strong> (Apple M1 Max, Apple clang 17, arm64). Two tiny C files: <code>gcd.c</code> calls <code>gcd()</code>, <code>helper.c</code> defines it.</p>
<pre><code>$ cc -S -O1 gcd.c -o gcd.s        # step 1: C  -&gt;  assembly language
$ cc -c gcd.c -o gcd.o            # step 2: assembly  -&gt;  object file
$ cc -c helper.c -o helper.o
$ cc gcd.o helper.o -o gcd        # step 3: link  -&gt;  executable
$ ./gcd                           # step 4: load and run
gcd(48,18) = 6</code></pre>
<p class="nhan">📐 What step 1 actually produced — this is the "Assembly Language" box of Figure 15.1 (slide 3), generated by a compiler rather than typed by a human:</p>
<pre><code>_main:
        sub     sp, sp, #32
        stp     x29, x30, [sp, #16]
        mov     w0, #48
        mov     w1, #18
        bl      _gcd
        adrp    x0, l_.str@PAGE
        add     x0, x0, l_.str@PAGEOFF
        bl      _printf
        mov     w0, #0
        ldp     x29, x30, [sp, #16]
        add     sp, sp, #32
        ret</code></pre>
<p class="dap-an">✅ Sizes measured with <code>ls -l</code>: <code>gcd.o</code> = <strong>800 bytes</strong>, <code>helper.o</code> = <strong>592 bytes</strong>, and the linked executable <code>gcd</code> = <strong>33 456 bytes</strong>. The executable is far larger than the sum of its object files because linking adds the Mach-O headers, the startup code, the symbol stubs and the load commands that tell the loader how to build the process image on the right-hand side of Figure 15.10. <strong>An object file is not a small executable; it is a different kind of thing.</strong></p>
<p class="pitfall">⚠️ Straight line to PRF192, and the most useful thing on this slide. Compiling <code>gcd.c</code> <em>alone</em> succeeds — the compiler is happy to call a function it has only seen declared:</p>
<pre><code>$ cc -c gcd.c -o gcd.o
(no output — exit status 0)

$ cc gcd.o -o gcd_fail
Undefined symbols for architecture arm64:
  "_gcd", referenced from:
      _main in gcd.o
ld: symbol(s) not found for architecture arm64
clang: error: linker command failed with exit code 1</code></pre>
<p class="pitfall">⚠️ Read the tool names in that message: the error is printed by <strong><code>ld</code></strong>, the linker — not by the compiler. So "undefined symbol" never means "you wrote the function wrong"; it means <strong>the definition was not handed to the linker</strong>. Nine times out of ten the fix is adding a missing <code>.c</code> file or a missing <code>-l</code> library to the command line, not editing any code at all.</p>`,
        `<p class="y-chinh">🎯 Hình vẽ cố tình đơn giản: bên trái một hộp ghi <strong>Object Code</strong> chia làm <em>Program</em> và <em>Data</em>; bên phải một hộp cao hơn ghi <strong>Process image in main memory</strong> gồm <em>Process Control Block</em>, <em>Program</em>, <em>Data</em> và <em>Stack</em>; ba mũi tên nét đứt chép tệp vào bộ nhớ. <strong>Tải là một phép CHÉP — cộng thêm hai thứ mà tệp vốn không hề chứa.</strong></p>
<table>
<tr><th>Trong tệp mã đối tượng</th><th>Trong ảnh tiến trình</th><th>Phần thêm ra đến từ đâu</th></tr>
<tr><td>—</td><td><strong>Process Control Block</strong> (khối điều khiển tiến trình)</td><td>Do <strong>HỆ ĐIỀU HÀNH</strong> tạo ra, không phải trình biên dịch. Giữ PC, thanh ghi, trạng thái, độ ưu tiên — Ch.9.</td></tr>
<tr><td>Program</td><td>Program</td><td>chép sang</td></tr>
<tr><td>Data</td><td>Data</td><td>chép sang</td></tr>
<tr><td>—</td><td><strong>Stack</strong> (ngăn xếp)</td><td>Cấp phát lúc tải và lớn dần lúc chạy; trên đĩa không có lấy một byte của nó</td></tr>
</table>
<ul>
<li><strong>Hai cái hộp KHÔNG có mũi tên đi vào mới là thông điệp chính.</strong> Một chương trình trên đĩa KHÔNG phải một tiến trình. Tải là thao tác biến một tệp thụ động thành một thứ đang sống, và hệ điều hành góp thêm PCB cùng ngăn xếp để chuyện đó xảy ra. Slide 31 sẽ cho thấy vì sao bắt buộc phải có ngăn xếp.</li>
<li><strong>Bộ tải đã được định nghĩa ở slide 2:</strong> "một thủ tục chương trình chép chương trình chạy được vào bộ nhớ để thực thi". Chú ý chữ <em>thủ tục</em> — trên hệ thống hiện đại, bộ tải là một phần của nhân hệ điều hành cộng một trợ thủ ở không gian người dùng, chứ không phải một chương trình riêng bạn gọi ra chạy.</li>
<li><strong>Ba section của slide 24 xuất hiện lại ở đây.</strong> <code>.text</code> là hộp "Program", <code>.data</code> là hộp "Data", còn <code>.bss</code> là phần của Data <em>KHÔNG chiếm chỗ nào trong tệp</em> nhưng phải được đặt chỗ và xoá về 0 trong bộ nhớ. Sự bất đối xứng đó — một vùng đệm 20 byte tốn 0 byte trên đĩa — là lý do kích thước tệp đối tượng không bao giờ bằng dấu chân bộ nhớ của nó.</li>
<li><strong>Tải là một trong những nơi GẮN ĐỊA CHỈ có thể xảy ra.</strong> Table 15.4 ở slide 32 liệt kê "load time" là một trong bốn thời điểm gắn địa chỉ, còn slide 33 vẽ ra thứ bộ tải phải sửa khi nó chọn một địa chỉ bắt đầu khác.</li>
</ul>
<p class="nhan">📐 <strong>TRỌN ĐƯỜNG ĐI, chạy thật trên máy này</strong> (Apple M1 Max, Apple clang 17, arm64). Hai tệp C tí hon: <code>gcd.c</code> gọi <code>gcd()</code>, <code>helper.c</code> định nghĩa nó.</p>
<pre><code>$ cc -S -O1 gcd.c -o gcd.s        # bước 1: C  -&gt;  hợp ngữ
$ cc -c gcd.c -o gcd.o            # bước 2: hợp ngữ  -&gt;  tệp đối tượng
$ cc -c helper.c -o helper.o
$ cc gcd.o helper.o -o gcd        # bước 3: liên kết  -&gt;  tệp chạy được
$ ./gcd                           # bước 4: nạp và chạy
gcd(48,18) = 6</code></pre>
<p class="nhan">📐 Bước 1 thực sự sinh ra cái gì — đây chính là hộp "Assembly Language" của Figure 15.1 (slide 3), do trình biên dịch sinh chứ không phải người gõ:</p>
<pre><code>_main:
        sub     sp, sp, #32
        stp     x29, x30, [sp, #16]
        mov     w0, #48
        mov     w1, #18
        bl      _gcd
        adrp    x0, l_.str@PAGE
        add     x0, x0, l_.str@PAGEOFF
        bl      _printf
        mov     w0, #0
        ldp     x29, x30, [sp, #16]
        add     sp, sp, #32
        ret</code></pre>
<p class="dap-an">✅ Kích thước đo bằng <code>ls -l</code>: <code>gcd.o</code> = <strong>800 byte</strong>, <code>helper.o</code> = <strong>592 byte</strong>, còn tệp chạy được sau liên kết <code>gcd</code> = <strong>33.456 byte</strong>. Tệp chạy được lớn hơn tổng hai tệp đối tượng rất nhiều vì liên kết còn thêm vào phần đầu Mach-O, mã khởi động, các stub ký hiệu và những lệnh tải (load command) chỉ cho bộ tải cách dựng ảnh tiến trình ở nửa phải Figure 15.10. <strong>Tệp đối tượng KHÔNG phải một tệp chạy được nhỏ; nó là một loại vật khác hẳn.</strong></p>
<p class="pitfall">⚠️ Nối thẳng sang PRF192, và đây là điều hữu ích nhất trên slide này. Biên dịch <em>RIÊNG</em> <code>gcd.c</code> thì THÀNH CÔNG — trình biên dịch vui vẻ gọi một hàm mà nó mới chỉ thấy khai báo:</p>
<pre><code>$ cc -c gcd.c -o gcd.o
(không in gì — mã thoát 0)

$ cc gcd.o -o gcd_fail
Undefined symbols for architecture arm64:
  "_gcd", referenced from:
      _main in gcd.o
ld: symbol(s) not found for architecture arm64
clang: error: linker command failed with exit code 1</code></pre>
<p class="pitfall">⚠️ Hãy đọc TÊN CÔNG CỤ trong thông báo đó: lỗi do <strong><code>ld</code></strong> — BỘ LIÊN KẾT — in ra, không phải trình biên dịch. Nên "undefined symbol" chưa bao giờ có nghĩa là "bạn viết sai hàm"; nó có nghĩa là <strong>ĐỊNH NGHĨA chưa được đưa tới tay bộ liên kết</strong>. Chín trên mười lần cách sửa là thêm một tệp <code>.c</code> còn thiếu hoặc một tuỳ chọn <code>-l</code> còn thiếu vào dòng lệnh, chứ không phải sửa một dòng mã nào.</p>`],

      [30, 'Figure 15.11 — A Linking and Loading Scenario',
        `<p class="y-chinh">🎯 The one diagram that shows <em>all three</em> ways code can be joined together, in a single picture. Follow the boxes left to right: <strong>Static library + Module 1 … Module n → Linker → Load Module → Loader (+ Dynamic library) → Main memory at address x</strong>, and underneath a second path, <strong>Dynamic library → Run-time linker/loader → Main memory</strong>, arriving later and somewhere else.</p>
<table>
<tr><th>Path on the diagram</th><th>When the joining happens</th><th>What ends up in the load module</th></tr>
<tr><td>Static library + modules → <strong>Linker</strong></td><td>Before the program ever runs</td><td>A copy of the library code, baked in</td></tr>
<tr><td>Dynamic library → <strong>Loader</strong></td><td>At load time, as the process is created</td><td>Nothing; the reference is resolved while loading (slide 35)</td></tr>
<tr><td>Dynamic library → <strong>Run-time linker/loader</strong></td><td>On the first call, while the program is already running</td><td>Nothing; the reference survives into memory (slide 36)</td></tr>
</table>
<ul>
<li><strong>Read the shapes, not just the arrows.</strong> Libraries are drawn as <em>document</em> shapes (files on disk); the linker and loaders are drawn as <em>process</em> boxes (programs that run). The right-hand column with the wavy top and bottom is main memory, and the label <strong>x</strong> marks where the load module landed — the same <em>x</em> that reappears in Figure 15.13 (slide 33) as "loaded into main memory starting at location x".</li>
<li><strong>"Load Module" is the technical name for the linker's output.</strong> Slide 2 defined a linker as combining object files "into a single file containing loadable or executable code" — that file is the load module, and the loader is the only thing that reads it.</li>
<li><strong>Notice that the two dynamic paths never pass through the linker box.</strong> That is the whole definition of dynamic linking on slide 35: "deferring the linkage of some external modules <em>until after the load module has been created</em>". The load module is finished before either dynamic library is touched.</li>
<li><strong>The lower path arrives in a different region of memory.</strong> The diagram shows the run-time-linked module dropped in as a thin separate band, not inside the block at x. That is deliberate: a shared library is mapped wherever there is room, which is exactly why it must be position-independent code (slide 33).</li>
<li><strong>One program routinely uses all three at once.</strong> Your C code is statically linked with the pieces of libc chosen at build time, load-time-linked against the system C library, and may run-time-link a plugin you only load on demand. The picture is not three alternatives; it is three layers.</li>
</ul>
<p class="nhan">📐 <strong>The right-hand half made visible.</strong> <code>otool -L</code> lists the dynamic libraries an executable will ask the loader for. On the little <code>gcd</code> program built on the previous slide:</p>
<pre><code>$ otool -L gcd
gcd:
        /usr/lib/libSystem.B.dylib (compatibility version 1.0.0, current version 1356.0.0)

$ otool -L /bin/ls
/bin/ls:
        /usr/lib/libutil.dylib
        /usr/lib/libncurses.5.4.dylib
        /usr/lib/libSystem.B.dylib</code></pre>
<p class="dap-an">✅ Read what that proves. The <code>gcd</code> executable contains the machine code of <code>_gcd</code> and <code>_main</code> — those were statically linked — but it does <strong>not</strong> contain <code>printf</code>. Instead it carries a <em>request</em> for <code>libSystem.B.dylib</code>, and the loader satisfies it while building the process image. <code>nm gcd</code> confirms both halves at once: <code>_gcd</code> and <code>_main</code> appear with real addresses (<code>T</code>), while <code>_printf</code> is still <code>U</code> — undefined, to be resolved by the loader. <strong>One executable, both linking styles, side by side.</strong></p>
<p class="pitfall">⚠️ A very common mix-up: the <em>linker</em> and the <em>loader</em> are different programs with different jobs, even though one command (<code>cc</code>) hides both. The linker resolves names to relative addresses and writes a file. The loader takes that file, picks a real memory location, and builds a process. If an executable is missing a library you get a <em>loader</em> error at run time (<code>Library not loaded</code>), not a linker error — a distinction that tells you immediately whether the problem is your build or your deployment.</p>`,
        `<p class="y-chinh">🎯 Sơ đồ DUY NHẤT gộp được <em>CẢ BA</em> cách nối mã lại với nhau vào một bức hình. Đi theo các hộp từ trái sang phải: <strong>Static library + Module 1 … Module n → Linker → Load Module → Loader (+ Dynamic library) → Bộ nhớ chính tại địa chỉ x</strong>, và bên dưới là một đường thứ hai, <strong>Dynamic library → Run-time linker/loader → Bộ nhớ chính</strong>, tới muộn hơn và nằm ở chỗ khác.</p>
<table>
<tr><th>Đường trên sơ đồ</th><th>Việc nối xảy ra lúc nào</th><th>Cái gì nằm trong load module</th></tr>
<tr><td>Thư viện tĩnh + các mô-đun → <strong>Linker</strong></td><td>Trước khi chương trình chạy lần nào</td><td>Một BẢN SAO mã thư viện, nướng cứng vào</td></tr>
<tr><td>Thư viện động → <strong>Loader</strong></td><td>Lúc TẢI, khi tiến trình đang được tạo</td><td>Không có gì; tham chiếu được phân giải trong lúc tải (slide 35)</td></tr>
<tr><td>Thư viện động → <strong>Run-time linker/loader</strong></td><td>Ở lời gọi ĐẦU TIÊN, khi chương trình đã chạy rồi</td><td>Không có gì; tham chiếu còn sống nguyên trong bộ nhớ (slide 36)</td></tr>
</table>
<ul>
<li><strong>Đọc HÌNH DẠNG chứ không chỉ đọc mũi tên.</strong> Thư viện được vẽ dạng <em>tài liệu</em> (tệp trên đĩa); linker và các loader vẽ dạng hộp <em>tiến trình</em> (chương trình đang chạy). Cột bên phải với đầu và chân lượn sóng là bộ nhớ chính, và nhãn <strong>x</strong> đánh dấu chỗ load module đáp xuống — đúng cái <em>x</em> sẽ trở lại ở Figure 15.13 (slide 33) dưới dạng "nạp vào bộ nhớ chính bắt đầu tại vị trí x".</li>
<li><strong>"Load Module" là tên kỹ thuật của ĐẦU RA của bộ liên kết.</strong> Slide 2 định nghĩa linker là thứ gộp các tệp đối tượng "thành một tệp duy nhất chứa mã nạp được hoặc chạy được" — tệp đó chính là load module, và loader là thứ duy nhất đọc nó.</li>
<li><strong>Để ý hai đường ĐỘNG không hề đi qua hộp Linker.</strong> Đó chính là định nghĩa liên kết động ở slide 35: "hoãn việc liên kết một số mô-đun ngoài <em>CHO TỚI SAU KHI load module đã được tạo xong</em>". Load module đã hoàn tất trước khi bất kỳ thư viện động nào bị đụng tới.</li>
<li><strong>Đường dưới đáp xuống một VÙNG KHÁC của bộ nhớ.</strong> Sơ đồ vẽ mô-đun liên kết lúc chạy thành một dải mỏng riêng, không nằm trong khối tại x. Đó là cố ý: thư viện dùng chung được ánh xạ vào chỗ nào còn trống, mà đó chính là lý do nó buộc phải là mã độc lập vị trí (slide 33).</li>
<li><strong>Một chương trình bình thường dùng CẢ BA cùng lúc.</strong> Mã C của bạn liên kết tĩnh với những mảnh libc chọn lúc dựng, liên kết lúc tải với thư viện C của hệ thống, và có thể liên kết lúc chạy một plugin chỉ nạp khi cần. Bức hình không phải ba lựa chọn thay thế nhau; nó là ba TẦNG.</li>
</ul>
<p class="nhan">📐 <strong>Cho nửa bên phải hiện ra.</strong> <code>otool -L</code> liệt kê những thư viện động mà tệp chạy được sẽ đòi bộ tải cung cấp. Trên chính chương trình <code>gcd</code> bé tí dựng ở slide trước:</p>
<pre><code>$ otool -L gcd
gcd:
        /usr/lib/libSystem.B.dylib (compatibility version 1.0.0, current version 1356.0.0)

$ otool -L /bin/ls
/bin/ls:
        /usr/lib/libutil.dylib
        /usr/lib/libncurses.5.4.dylib
        /usr/lib/libSystem.B.dylib</code></pre>
<p class="dap-an">✅ Đọc xem điều đó CHỨNG MINH gì. Tệp chạy được <code>gcd</code> chứa mã máy của <code>_gcd</code> và <code>_main</code> — hai thứ đó liên kết TĨNH — nhưng nó <strong>KHÔNG</strong> chứa <code>printf</code>. Thay vào đó nó mang theo một <em>YÊU CẦU</em> về <code>libSystem.B.dylib</code>, và bộ tải đáp ứng yêu cầu ấy trong lúc dựng ảnh tiến trình. Lệnh <code>nm gcd</code> xác nhận cả hai nửa cùng một lúc: <code>_gcd</code> và <code>_main</code> hiện ra kèm địa chỉ thật (ký hiệu <code>T</code>), còn <code>_printf</code> vẫn là <code>U</code> — chưa phân giải, để bộ tải lo. <strong>Một tệp chạy được, hai kiểu liên kết, nằm cạnh nhau.</strong></p>
<p class="pitfall">⚠️ Nhầm lẫn rất hay gặp: <em>bộ liên kết</em> và <em>bộ tải</em> là hai chương trình khác nhau với hai việc khác nhau, dù một lệnh (<code>cc</code>) giấu cả hai. Bộ liên kết phân giải tên thành địa chỉ tương đối rồi ghi ra một tệp. Bộ tải cầm tệp đó, chọn một vị trí bộ nhớ thật, và dựng nên một tiến trình. Nếu tệp chạy được thiếu thư viện thì bạn nhận lỗi của <em>BỘ TẢI</em> lúc chạy (<code>Library not loaded</code>), không phải lỗi liên kết — phân biệt đó nói ngay cho bạn biết trục trặc nằm ở khâu dựng hay khâu triển khai.</p>`],

      [31, 'Figure 15.12 — Addressing Requirements for a Process',
        `<p class="y-chinh">🎯 A single process image annotated with every kind of address that has to be correct for it to run. Reading the labels off the figure: <strong>Process control information</strong> → the Process Control Block at the top, <strong>Entry point to program</strong> → the first instruction, a <strong>Branch instruction</strong> pointing from one place in Program back into Program, a <strong>Reference to data</strong> pointing from Program down into Data, and <strong>Current top of stack</strong> at the Stack. An arrow on the left marks <strong>increasing address values</strong> downward.</p>
<table>
<tr><th>Requirement on the figure</th><th>Who must get it right</th><th>What breaks if it is wrong</th></tr>
<tr><td>Process control information</td><td>Operating system (Ch.9)</td><td>The process cannot be scheduled or resumed</td></tr>
<tr><td>Entry point to program</td><td>Linker writes it, loader honours it</td><td>Execution starts in the middle of nowhere</td></tr>
<tr><td>Branch instruction (Program → Program)</td><td>Assembler + linker + relocation</td><td>Jumps land on the wrong instruction</td></tr>
<tr><td>Reference to data (Program → Data)</td><td>Assembler + linker + relocation</td><td>Reads or writes the wrong variable</td></tr>
<tr><td>Current top of stack</td><td>Hardware stack pointer, at run time</td><td>Calls and returns corrupt each other</td></tr>
</table>
<ul>
<li><strong>The figure is the <em>list of things relocation has to fix</em>.</strong> That is its real purpose, and slide 33 is the answer to it. Every arrow drawn inside the box is an address embedded in the program that would point somewhere else if the whole image were loaded at a different starting location.</li>
<li><strong>Two of the five are fixed at load time, three are not.</strong> The entry point and the branch/data references are baked into the image when it is placed. The process control information is maintained continuously by the OS, and the stack pointer changes on every call and return. That is why the stack got its own box on slide 29 — it is the only part that is <em>alive</em>.</li>
<li><strong>Branch and data reference are drawn differently for a reason.</strong> The branch arrow starts in Program and returns into Program — it is a <em>relative</em> distance, and relative distances survive relocation untouched. The data arrow leaves Program and lands in Data — historically an <em>absolute</em> address, and absolute addresses are what break. Hold that distinction; slide 33 turns it into the difference between an absolute and a relocatable load module.</li>
<li><strong>"Increasing address values" pointing down is the standard convention.</strong> Program lowest, then Data, then Stack. On real systems the stack then grows <em>back upward</em> toward the data — which is why a runaway recursion eventually collides with the heap, and why this diagram places the two at opposite ends.</li>
<li><strong>Connect to Ch.9.</strong> Everything here is what a context switch has to preserve. The PCB stores the registers and the PC, the stack stores the call chain, and the memory management unit maps the whole picture. Nothing in this figure is optional.</li>
</ul>
<p class="dap-an">✅ Exam-shaped question with the answer. "A process image is moved from address 0x4000 to address 0x9000 in memory. Which of the five labelled items must be changed?" Answer: the <strong>entry point</strong> and any <strong>absolute</strong> data or branch references — all shifted by 0x5000. The <strong>stack pointer</strong> must also be adjusted, because it holds a real address. <strong>Relative</strong> branches need no change at all: the distance from one instruction to another does not depend on where the pair sits. And the <strong>process control information</strong> is not inside the moved region — the OS updates it separately. Slide 33 shows exactly this arithmetic drawn out.</p>
<p class="meo">💡 Use this figure as a checklist whenever a program "runs on my machine but crashes when loaded elsewhere". Walk the five arrows and ask which one was assumed to be fixed. Nine times out of ten it is the data reference.</p>`,
        `<p class="y-chinh">🎯 Một ảnh tiến trình được chú thích đủ mọi LOẠI ĐỊA CHỈ phải đúng thì nó mới chạy được. Đọc nhãn ngay trên hình: <strong>Process control information</strong> → khối điều khiển tiến trình ở trên cùng, <strong>Entry point to program</strong> → lệnh đầu tiên, một <strong>Branch instruction</strong> chỉ từ một chỗ trong Program quay lại chính Program, một <strong>Reference to data</strong> chỉ từ Program xuống Data, và <strong>Current top of stack</strong> ở Stack. Mũi tên bên trái đánh dấu <strong>giá trị địa chỉ tăng dần</strong> theo chiều xuống.</p>
<table>
<tr><th>Yêu cầu trên hình</th><th>Ai phải làm cho đúng</th><th>Sai thì hỏng cái gì</th></tr>
<tr><td>Thông tin điều khiển tiến trình</td><td>Hệ điều hành (Ch.9)</td><td>Tiến trình không lập lịch được, không phục hồi được</td></tr>
<tr><td>Điểm vào chương trình</td><td>Bộ liên kết ghi ra, bộ tải tôn trọng</td><td>Chạy bắt đầu từ một chỗ vô nghĩa</td></tr>
<tr><td>Lệnh rẽ nhánh (Program → Program)</td><td>Trình dịch + bộ liên kết + định vị lại</td><td>Lệnh nhảy đáp trúng lệnh khác</td></tr>
<tr><td>Tham chiếu dữ liệu (Program → Data)</td><td>Trình dịch + bộ liên kết + định vị lại</td><td>Đọc hoặc ghi nhầm biến</td></tr>
<tr><td>Đỉnh ngăn xếp hiện tại</td><td>Con trỏ ngăn xếp của phần cứng, lúc chạy</td><td>Gọi hàm và trả về phá lẫn nhau</td></tr>
</table>
<ul>
<li><strong>Hình này chính là <em>DANH SÁCH NHỮNG THỨ MÀ ĐỊNH VỊ LẠI PHẢI SỬA</em>.</strong> Đó mới là mục đích thật của nó, và slide 33 là câu trả lời. Mỗi mũi tên vẽ bên trong cái hộp đều là một địa chỉ nhúng sẵn trong chương trình, và nó sẽ chỉ sang chỗ khác nếu cả ảnh được nạp ở một vị trí bắt đầu khác.</li>
<li><strong>Hai trong năm thứ được chốt lúc tải, ba thứ thì KHÔNG.</strong> Điểm vào và các tham chiếu rẽ nhánh/dữ liệu bị nướng cứng vào ảnh khi nó được đặt xuống. Thông tin điều khiển tiến trình thì hệ điều hành duy trì liên tục, còn con trỏ ngăn xếp đổi sau mỗi lần gọi và trả về. Đó là lý do ngăn xếp có hộp riêng ở slide 29 — nó là phần duy nhất <em>ĐANG SỐNG</em>.</li>
<li><strong>Mũi tên rẽ nhánh và mũi tên dữ liệu được vẽ khác nhau là có lý do.</strong> Mũi tên rẽ nhánh xuất phát trong Program và quay về Program — đó là một KHOẢNG CÁCH <em>TƯƠNG ĐỐI</em>, mà khoảng cách tương đối thì sống sót qua định vị lại nguyên vẹn. Mũi tên dữ liệu rời Program và đáp xuống Data — trong lịch sử đó là địa chỉ <em>TUYỆT ĐỐI</em>, và địa chỉ tuyệt đối mới là thứ vỡ. Giữ lấy phân biệt này; slide 33 biến nó thành khác biệt giữa load module tuyệt đối và load module định vị lại được.</li>
<li><strong>"Địa chỉ tăng dần" chỉ xuống dưới là quy ước chuẩn.</strong> Program thấp nhất, rồi Data, rồi Stack. Trên hệ thống thật, ngăn xếp sau đó lớn <em>NGƯỢC LÊN</em> về phía dữ liệu — đó là lý do đệ quy mất kiểm soát rốt cuộc va vào heap, và cũng là lý do sơ đồ này đặt hai thứ ở hai đầu.</li>
<li><strong>Nối sang Ch.9.</strong> Mọi thứ ở đây là những gì một lần chuyển ngữ cảnh phải giữ gìn. PCB cất thanh ghi và PC, ngăn xếp cất chuỗi lời gọi, và khối quản lý bộ nhớ ánh xạ cả bức tranh. Không có chi tiết nào trong hình này là tuỳ chọn.</li>
</ul>
<p class="dap-an">✅ Câu hỏi đúng dạng đề thi, kèm đáp án. "Một ảnh tiến trình bị dời từ địa chỉ 0x4000 sang 0x9000 trong bộ nhớ. Trong năm mục có nhãn, mục nào bắt buộc phải đổi?" Đáp án: <strong>điểm vào</strong> và mọi tham chiếu dữ liệu hay rẽ nhánh dạng <strong>TUYỆT ĐỐI</strong> — tất cả dời thêm 0x5000. <strong>Con trỏ ngăn xếp</strong> cũng phải chỉnh, vì nó giữ một địa chỉ thật. Các lệnh rẽ nhánh <strong>TƯƠNG ĐỐI</strong> thì không đổi gì cả: khoảng cách từ lệnh này tới lệnh kia không phụ thuộc cặp lệnh đó nằm ở đâu. Còn <strong>thông tin điều khiển tiến trình</strong> nằm NGOÀI vùng bị dời — hệ điều hành cập nhật nó riêng. Slide 33 vẽ ra đúng phép tính này.</p>
<p class="meo">💡 Dùng hình này như một danh sách kiểm khi gặp cảnh "chạy trên máy tôi thì được, nạp ở chỗ khác thì sập". Đi hết năm mũi tên và hỏi cái nào đã bị mặc định là cố định. Chín trên mười lần đó là mũi tên tham chiếu dữ liệu.</p>`],

      [32, 'Table 15.4 — Address Binding: (a) Loader, (b) Linker',
        `<p class="y-chinh">🎯 The most exam-dense slide in the chapter. Two tables answer one question each — <strong>(a) when does a symbolic address become a real memory address?</strong> and <strong>(b) when does a reference to another module get connected?</strong> — and both answers are a list of four or five possible <em>times</em>, from earliest to latest.</p>
<p class="nhan">📐 (a) Loader — binding time versus function, exactly as printed:</p>
<table>
<tr><th>Binding Time</th><th>Function</th></tr>
<tr><td><strong>Programming time</strong></td><td>All actual physical addresses are directly specified by the programmer in the program itself</td></tr>
<tr><td><strong>Compile or assembly time</strong></td><td>The program contains symbolic address references, and these are converted to actual physical addresses by the compiler or assembler</td></tr>
<tr><td><strong>Load time</strong></td><td>The compiler or assembler produces <em>relative</em> addresses. The loader translates these to absolute addresses at the time of program loading</td></tr>
<tr><td><strong>Run time</strong></td><td>The loaded program retains relative addresses. These are converted <em>dynamically</em> to absolute addresses by processor hardware</td></tr>
</table>
<p class="nhan">📐 (b) Linker — linkage time versus function:</p>
<table>
<tr><th>Linkage Time</th><th>Function</th></tr>
<tr><td><strong>Programming time</strong></td><td>No external program or data references are allowed. The programmer must place into the program the source code for all subprograms that are referenced</td></tr>
<tr><td><strong>Compile or assembly time</strong></td><td>The assembler must fetch the source code of every subroutine that is referenced and assemble them as a unit</td></tr>
<tr><td><strong>Load module creation</strong></td><td>All object modules have been assembled using <em>relative</em> addresses. These modules are linked together, and all references are restated relative to the origin of the final load module</td></tr>
<tr><td><strong>Load time</strong></td><td>External references are not resolved until the load module is to be loaded into main memory. At that time, referenced dynamic link modules are appended to the load module, and the entire package is loaded</td></tr>
<tr><td><strong>Run time</strong></td><td>External references are not resolved until the external call is <em>executed</em>. At that time the process is interrupted and the desired module is linked to the calling program</td></tr>
</table>
<ul>
<li><strong>Both tables are ordered from earliest to latest, and that order <em>is</em> the trade-off.</strong> Bind early: fast at run time, totally inflexible. Bind late: flexible, sharable, upgradable — and you pay for it every time the program runs. There is no third axis; this is the whole design space.</li>
<li><strong>Row by row, (a) is a history of computing.</strong> "Programming time" is the era of writing absolute addresses on paper. "Compile time" is a program that owns the machine. "Load time" arrives with multiprogramming — you no longer know who else is in memory. "Run time" is the modern answer: virtual memory hardware translates on every single access (Ch.9).</li>
<li><strong>The last row of (a) is the one people misread.</strong> "Converted dynamically to absolute addresses by <em>processor hardware</em>" means the binding never happens in software at all — a base register or an MMU adds the offset on every reference. That is why a modern process can be relocated without a single byte of its code being rewritten.</li>
<li><strong>Table (b) rows 4 and 5 are exactly slides 35 and 36.</strong> "Load time" in (b) is <em>load-time dynamic linking</em>; "Run time" in (b) is <em>run-time dynamic linking</em>, DLLs and all. Row 3, "Load module creation", is ordinary static linking. Memorise which row maps to which slide and half the chapter's exam questions answer themselves.</li>
<li><strong>The first two rows of (b) sound absurd, and they are the point.</strong> "No external references are allowed" and "the assembler must fetch and assemble every subroutine as a unit" describe a world with no libraries. The table includes them so you can see what separate compilation actually bought us — and it is the reason the linker exists at all.</li>
</ul>
<p class="dap-an">✅ Mapping the real toolchain from slide 29 onto both tables. <code>cc -c gcd.c</code> produces an object file with <em>relative</em> addresses and an unresolved <code>_gcd</code> → that is row 3 of (b), waiting for load module creation. <code>cc gcd.o helper.o -o gcd</code> creates the load module and restates every reference relative to its origin → <strong>row 3 of (b), "Load module creation"</strong>. <code>printf</code> stays unresolved in the executable and is bound when the process starts → <strong>row 4 of (b), "Load time"</strong>. And the addresses inside the running process are produced by the MMU on every access → <strong>row 4 of (a), "Run time"</strong>. One <code>cc</code> command, three different rows of Table 15.4.</p>
<p class="pitfall">⚠️ The classic exam trap is mixing the two tables up, because "Load time" appears in both with <em>different meanings</em>. In (a) it is about turning a relative address into an absolute one — a question about <strong>where in memory</strong>. In (b) it is about finding a module defined elsewhere — a question about <strong>which file</strong>. Before answering, decide which of the two questions is being asked.</p>
<p class="meo">💡 One sentence to carry into the exam: <strong>the later you bind, the more you can change and the more you pay.</strong> Every row in both tables is that sentence with a different price tag.</p>`,
        `<p class="y-chinh">🎯 Slide dày điểm thi nhất cả chương. Hai bảng trả lời mỗi bảng một câu hỏi — <strong>(a) khi nào một địa chỉ ký hiệu trở thành địa chỉ bộ nhớ thật?</strong> và <strong>(b) khi nào một tham chiếu tới mô-đun khác được nối vào?</strong> — và cả hai câu trả lời đều là một danh sách bốn hoặc năm <em>THỜI ĐIỂM</em>, từ sớm nhất tới muộn nhất.</p>
<p class="nhan">📐 (a) Bộ tải — thời điểm gắn kết so với chức năng, y nguyên như in:</p>
<table>
<tr><th>Thời điểm gắn kết</th><th>Chức năng</th></tr>
<tr><td><strong>Lúc lập trình</strong></td><td>Mọi địa chỉ vật lý thật đều do chính người lập trình chỉ định thẳng trong chương trình</td></tr>
<tr><td><strong>Lúc biên dịch / dịch hợp ngữ</strong></td><td>Chương trình chứa tham chiếu địa chỉ dạng ký hiệu, và chúng được trình biên dịch hoặc trình dịch đổi thành địa chỉ vật lý thật</td></tr>
<tr><td><strong>Lúc tải</strong></td><td>Trình biên dịch hoặc trình dịch sinh ra địa chỉ <em>TƯƠNG ĐỐI</em>. Bộ tải dịch chúng thành địa chỉ tuyệt đối vào thời điểm nạp chương trình</td></tr>
<tr><td><strong>Lúc chạy</strong></td><td>Chương trình đã nạp vẫn GIỮ địa chỉ tương đối. Chúng được <em>ĐỘNG</em> chuyển thành địa chỉ tuyệt đối bởi PHẦN CỨNG bộ xử lý</td></tr>
</table>
<p class="nhan">📐 (b) Bộ liên kết — thời điểm liên kết so với chức năng:</p>
<table>
<tr><th>Thời điểm liên kết</th><th>Chức năng</th></tr>
<tr><td><strong>Lúc lập trình</strong></td><td>Không cho phép tham chiếu chương trình hay dữ liệu ngoài. Người lập trình phải đặt vào chương trình mã nguồn của TẤT CẢ chương trình con được tham chiếu</td></tr>
<tr><td><strong>Lúc biên dịch / dịch hợp ngữ</strong></td><td>Trình dịch phải lấy mã nguồn của MỌI chương trình con được tham chiếu và dịch tất cả như một khối</td></tr>
<tr><td><strong>Lúc tạo load module</strong></td><td>Mọi mô-đun đối tượng đã được dịch bằng địa chỉ <em>TƯƠNG ĐỐI</em>. Chúng được liên kết lại, và mọi tham chiếu được phát biểu lại theo gốc của load module cuối cùng</td></tr>
<tr><td><strong>Lúc tải</strong></td><td>Tham chiếu ngoài chưa được phân giải cho tới khi load module sắp được nạp vào bộ nhớ chính. Lúc đó các mô-đun liên kết động được tham chiếu sẽ được nối thêm vào load module và cả gói được nạp vào</td></tr>
<tr><td><strong>Lúc chạy</strong></td><td>Tham chiếu ngoài chưa phân giải cho tới khi lời gọi ngoài được <em>THỰC THI</em>. Lúc đó tiến trình bị ngắt và mô-đun cần thiết được liên kết vào chương trình gọi</td></tr>
</table>
<ul>
<li><strong>Cả hai bảng đều xếp từ SỚM tới MUỘN, và chính thứ tự đó LÀ sự đánh đổi.</strong> Gắn sớm: chạy nhanh, cứng ngắc hoàn toàn. Gắn muộn: linh hoạt, chia sẻ được, nâng cấp được — và bạn trả giá mỗi lần chương trình chạy. Không có trục thứ ba; đây là toàn bộ không gian thiết kế.</li>
<li><strong>Đọc từng dòng, bảng (a) là một pho lịch sử máy tính.</strong> "Lúc lập trình" là thời người ta viết địa chỉ tuyệt đối ra giấy. "Lúc biên dịch" là thời một chương trình sở hữu cả cái máy. "Lúc tải" ra đời cùng đa chương trình — bạn không còn biết ai khác đang nằm trong bộ nhớ. "Lúc chạy" là câu trả lời hiện đại: phần cứng bộ nhớ ảo dịch địa chỉ ở MỌI lần truy cập (Ch.9).</li>
<li><strong>Dòng cuối của (a) là dòng người ta hay đọc nhầm.</strong> "Được động chuyển thành địa chỉ tuyệt đối bởi <em>PHẦN CỨNG bộ xử lý</em>" nghĩa là việc gắn kết KHÔNG hề xảy ra trong phần mềm — một thanh ghi nền hay một MMU cộng độ dời vào mỗi lần tham chiếu. Vì thế một tiến trình hiện đại dời được mà không cần viết lại lấy một byte mã của nó.</li>
<li><strong>Dòng 4 và 5 của bảng (b) chính xác là slide 35 và 36.</strong> "Lúc tải" trong (b) là <em>liên kết động lúc tải</em>; "Lúc chạy" trong (b) là <em>liên kết động lúc chạy</em>, DLL và mọi thứ kèm theo. Dòng 3, "Lúc tạo load module", là liên kết tĩnh thông thường. Thuộc xem dòng nào ứng slide nào là một nửa số câu hỏi thi của chương tự trả lời.</li>
<li><strong>Hai dòng đầu của (b) nghe vô lý, và đó mới là dụng ý.</strong> "Không cho phép tham chiếu ngoài" và "trình dịch phải lấy về và dịch mọi chương trình con như một khối" mô tả một thế giới KHÔNG CÓ THƯ VIỆN. Bảng liệt kê chúng để bạn thấy biên dịch riêng lẻ thực sự mua được cho ta cái gì — và đó là lý do bộ liên kết tồn tại.</li>
</ul>
<p class="dap-an">✅ Chiếu bộ công cụ thật ở slide 29 lên cả hai bảng. <code>cc -c gcd.c</code> sinh tệp đối tượng có địa chỉ <em>TƯƠNG ĐỐI</em> và một <code>_gcd</code> chưa phân giải → đó là dòng 3 của (b), đang chờ tạo load module. <code>cc gcd.o helper.o -o gcd</code> tạo ra load module và phát biểu lại mọi tham chiếu theo gốc của nó → <strong>dòng 3 của (b), "Lúc tạo load module"</strong>. <code>printf</code> vẫn chưa phân giải trong tệp chạy được và chỉ được gắn khi tiến trình khởi động → <strong>dòng 4 của (b), "Lúc tải"</strong>. Còn các địa chỉ bên trong tiến trình đang chạy thì do MMU sinh ra ở mọi lần truy cập → <strong>dòng 4 của (a), "Lúc chạy"</strong>. Một lệnh <code>cc</code> duy nhất, ba dòng khác nhau của Table 15.4.</p>
<p class="pitfall">⚠️ Bẫy thi kinh điển là lẫn lộn hai bảng, vì chữ "Lúc tải" xuất hiện ở CẢ HAI với <em>NGHĨA KHÁC NHAU</em>. Trong (a) nó nói về biến một địa chỉ tương đối thành tuyệt đối — câu hỏi <strong>NẰM Ở ĐÂU TRONG BỘ NHỚ</strong>. Trong (b) nó nói về việc tìm một mô-đun định nghĩa ở nơi khác — câu hỏi <strong>NẰM TRONG TỆP NÀO</strong>. Trước khi trả lời, hãy xác định đề đang hỏi cái nào trong hai cái đó.</p>
<p class="meo">💡 Một câu mang vào phòng thi: <strong>gắn càng MUỘN thì đổi được càng nhiều và trả giá càng lớn.</strong> Mỗi dòng của cả hai bảng chỉ là câu đó với một bảng giá khác.</p>`],

      [33, 'Figure 15.13 — Absolute and Relocatable Load Modules',
        `<p class="y-chinh">🎯 Four columns of the same tiny program, showing what happens to its two addresses as it moves down the toolchain. The program is just <code>JUMP X</code> … <code>LOAD Y</code>, with <strong>X</strong> a location in the PROGRAM area and <strong>Y</strong> a location in the DATA area.</p>
<table>
<tr><th>Column</th><th>Origin</th><th>The jump reads</th><th>The load reads</th><th>Where X and Y sit</th></tr>
<tr><td>(a) Object module — <em>symbolic addresses</em></td><td>none</td><td><code>JUMP X</code></td><td><code>LOAD Y</code></td><td>X, Y (names)</td></tr>
<tr><td>(b) Absolute load module</td><td>1024</td><td><code>JUMP 1424</code></td><td><code>LOAD 2224</code></td><td>1424, 2224</td></tr>
<tr><td>(c) Relative load module</td><td>0</td><td><code>JUMP 400</code></td><td><code>LOAD 1200</code></td><td>400, 1200</td></tr>
<tr><td>(d) Relative load module loaded at <em>x</em></td><td><em>x</em></td><td><code>JUMP 400</code></td><td><code>LOAD 1200</code></td><td>400 + <em>x</em>, 1200 + <em>x</em></td></tr>
</table>
<ul>
<li><strong>Check the arithmetic of (b) against (c) — the figure is internally consistent.</strong> 1024 + 400 = 1424 and 1024 + 1200 = 2224. Column (b) is simply column (c) with the origin 1024 already added in. That single observation is the definition of <em>absolute</em>: the offsets were folded into the instructions and can never be unfolded again.</li>
<li><strong>Column (d) is the one to stare at.</strong> The instructions <em>still say</em> <code>JUMP 400</code> and <code>LOAD 1200</code> — unchanged from (c) — yet the targets are at 400 + <em>x</em> and 1200 + <em>x</em>. Nothing in the code was rewritten. The addition is done by <strong>hardware</strong> on every reference, using a base register loaded with <em>x</em>. This is row 4 of Table 15.4(a), "Run time … converted dynamically by processor hardware".</li>
<li><strong>So there are two different ways to relocate, and the figure shows both.</strong> <em>Static relocation</em>: the loader walks a relocation table and rewrites each address — that turns (c) into something like (b). <em>Dynamic relocation</em>: nobody rewrites anything and the hardware adds a base on every access — that is (d). The first costs time once, at load; the second costs a tiny amount of time forever, but lets the process be moved even after it has started.</li>
<li><strong>An absolute load module can only ever be loaded in one place.</strong> If address 1024 is occupied, the program cannot run at all. With multiprogramming, where several processes share memory, that is fatal — which is precisely why relocatable modules exist.</li>
<li><strong>Connect to Ch.9.</strong> Paging and segmentation are dynamic relocation taken to its conclusion: the base is per-page, held in a page table, and applied by the MMU. Figure 15.13(d) is the one-base special case of the same idea.</li>
</ul>
<p class="nhan">📐 <strong>Do the exercise.</strong> A program is assembled with origin 0 and later loaded at 0x4000. Every internal reference shifts by exactly that constant:</p>
<table>
<tr><th>Reference in the relative module</th><th>What it points at</th><th>After loading at 0x4000</th></tr>
<tr><td>0x0000</td><td>entry point</td><td><strong>0x4000</strong></td></tr>
<tr><td>0x0120</td><td>a branch target inside the code</td><td><strong>0x4120</strong></td></tr>
<tr><td>0x0400</td><td>X, the label of Figure 15.13</td><td><strong>0x4400</strong></td></tr>
<tr><td>0x1200</td><td>Y, the data item</td><td><strong>0x5200</strong></td></tr>
<tr><td>0x1FFC</td><td>last word of the module</td><td><strong>0x5FFC</strong></td></tr>
</table>
<p class="dap-an">✅ Relocation is <strong>addition of one constant</strong>, and nothing more. Note what is <em>not</em> in that table: a <code>bl</code> or <code>jmp</code> encoded as a PC-relative <em>distance</em> needs no entry at all, because the distance between two things that moved together did not change. That is why modern code contains far fewer relocation entries than you would guess — and why it can be position-independent in the first place.</p>
<p class="nhan">📐 <strong>Position-independent code and ASLR, measured on this machine.</strong> A three-line C program prints the address of its own <code>main</code>, of a global variable <code>g</code>, and of <code>printf</code>. The linker marked it <code>PIE</code> (position-independent executable), so the OS loads it at a random address every time. Four consecutive runs:</p>
<table>
<tr><th>Run</th><th><code>main</code></th><th><code>g</code></th><th>shift of <code>main</code></th><th>shift of <code>g</code></th></tr>
<tr><td>address stored in the file</td><td>0x1000004f8</td><td>0x100008000</td><td>—</td><td>—</td></tr>
<tr><td>1</td><td>0x1008584f8</td><td>0x100860000</td><td>0x858000</td><td>0x858000</td></tr>
<tr><td>2</td><td>0x104af44f8</td><td>0x104afc000</td><td>0x4af4000</td><td>0x4af4000</td></tr>
<tr><td>3</td><td>0x102d984f8</td><td>0x102da0000</td><td>0x2d98000</td><td>0x2d98000</td></tr>
<tr><td>4</td><td>0x102d0c4f8</td><td>0x102d14000</td><td>0x2d0c000</td><td>0x2d0c000</td></tr>
</table>
<p class="dap-an">✅ Two facts fall straight out of the measurement. <strong>First: the shift is the same for code and for data in every run</strong> — 0x858000 for both in run 1, 0x4af4000 for both in run 2, and so on. That is column (d) of Figure 15.13 happening for real: the whole image slid by one constant, exactly as the table above predicts. <strong>Second: the address is different every run</strong>, which is ASLR — address space layout randomisation. Relocation was invented in the 1960s so two programs could share memory; today the same mechanism is reused as a security defence, because an attacker who does not know where the code landed cannot write down the address of the function they want to jump to.</p>
<p class="pitfall">⚠️ Honest note from the same experiment: <code>printf</code> printed the <em>same</em> address, 0x18f089964, in all four runs. That is not a bug in the measurement — the system libraries live in the dyld shared cache, which is randomised once per boot and then shared by every process. So ASLR is per-process for your own code and per-boot for the system libraries. Also worth reporting: trying to disable it with <code>-Wl,-no_pie</code> produced <code>ld: warning: -no_pie ignored for arm64</code> and the binary was still PIE. On Apple Silicon you cannot turn position independence off, so any exam answer of the form "just build it non-PIE" is no longer a real option there.</p>`,
        `<p class="y-chinh">🎯 Bốn cột của CÙNG một chương trình tí hon, cho thấy hai địa chỉ của nó biến đổi thế nào khi đi xuống dọc bộ công cụ. Chương trình chỉ gồm <code>JUMP X</code> … <code>LOAD Y</code>, với <strong>X</strong> là một vị trí trong vùng PROGRAM và <strong>Y</strong> là một vị trí trong vùng DATA.</p>
<table>
<tr><th>Cột</th><th>Gốc</th><th>Lệnh nhảy ghi</th><th>Lệnh nạp ghi</th><th>X và Y nằm ở</th></tr>
<tr><td>(a) Object module — <em>địa chỉ ký hiệu</em></td><td>không có</td><td><code>JUMP X</code></td><td><code>LOAD Y</code></td><td>X, Y (tên)</td></tr>
<tr><td>(b) Load module TUYỆT ĐỐI</td><td>1024</td><td><code>JUMP 1424</code></td><td><code>LOAD 2224</code></td><td>1424, 2224</td></tr>
<tr><td>(c) Load module TƯƠNG ĐỐI</td><td>0</td><td><code>JUMP 400</code></td><td><code>LOAD 1200</code></td><td>400, 1200</td></tr>
<tr><td>(d) Load module tương đối, nạp tại <em>x</em></td><td><em>x</em></td><td><code>JUMP 400</code></td><td><code>LOAD 1200</code></td><td>400 + <em>x</em>, 1200 + <em>x</em></td></tr>
</table>
<ul>
<li><strong>Kiểm phép tính của (b) so với (c) — hình vẽ nhất quán bên trong.</strong> 1024 + 400 = 1424 và 1024 + 1200 = 2224. Cột (b) chính là cột (c) với gốc 1024 đã cộng sẵn vào. Riêng nhận xét đó là định nghĩa của chữ <em>TUYỆT ĐỐI</em>: độ dời đã bị gấp vào trong lệnh và không bao giờ mở ra lại được nữa.</li>
<li><strong>Cột (d) mới là cột đáng nhìn chằm chằm.</strong> Các lệnh <em>VẪN GHI</em> <code>JUMP 400</code> và <code>LOAD 1200</code> — không đổi gì so với (c) — thế mà đích thật lại ở 400 + <em>x</em> và 1200 + <em>x</em>. Không một dòng mã nào bị viết lại. Phép cộng do <strong>PHẦN CỨNG</strong> làm ở mỗi lần tham chiếu, bằng một thanh ghi nền nạp sẵn giá trị <em>x</em>. Đây đúng là dòng 4 của Table 15.4(a): "Lúc chạy … được động chuyển bởi phần cứng bộ xử lý".</li>
<li><strong>Vậy có HAI cách định vị lại, và hình vẽ cho thấy cả hai.</strong> <em>Định vị lại TĨNH</em>: bộ tải duyệt một bảng định vị lại và viết lại từng địa chỉ — biến (c) thành đại loại (b). <em>Định vị lại ĐỘNG</em>: không ai viết lại gì cả và phần cứng cộng thêm nền ở mọi lần truy cập — đó là (d). Cách thứ nhất tốn thời gian MỘT lần lúc tải; cách thứ hai tốn một chút thời gian MÃI MÃI, nhưng cho phép dời tiến trình ngay cả khi nó đã chạy.</li>
<li><strong>Load module tuyệt đối chỉ nạp được đúng MỘT chỗ.</strong> Nếu địa chỉ 1024 đang có người, chương trình không chạy được, chấm hết. Trong đa chương trình, nơi nhiều tiến trình dùng chung bộ nhớ, đó là án tử — và chính vì vậy mà mô-đun định vị lại được mới ra đời.</li>
<li><strong>Nối sang Ch.9.</strong> Phân trang và phân đoạn là định vị lại động đẩy tới tận cùng: cái nền được đặt theo TỪNG TRANG, giữ trong bảng trang, và do MMU áp dụng. Figure 15.13(d) là ca đặc biệt "một nền duy nhất" của cùng ý tưởng ấy.</li>
</ul>
<p class="nhan">📐 <strong>Làm thử bài tập.</strong> Một chương trình dịch với địa chỉ gốc 0, sau đó nạp tại 0x4000. Mọi tham chiếu bên trong dời đúng bằng hằng số đó:</p>
<table>
<tr><th>Tham chiếu trong mô-đun tương đối</th><th>Nó trỏ vào đâu</th><th>Sau khi nạp tại 0x4000</th></tr>
<tr><td>0x0000</td><td>điểm vào</td><td><strong>0x4000</strong></td></tr>
<tr><td>0x0120</td><td>một đích rẽ nhánh trong mã</td><td><strong>0x4120</strong></td></tr>
<tr><td>0x0400</td><td>X, đúng cái nhãn của Figure 15.13</td><td><strong>0x4400</strong></td></tr>
<tr><td>0x1200</td><td>Y, ô dữ liệu</td><td><strong>0x5200</strong></td></tr>
<tr><td>0x1FFC</td><td>từ cuối cùng của mô-đun</td><td><strong>0x5FFC</strong></td></tr>
</table>
<p class="dap-an">✅ Định vị lại là <strong>PHÉP CỘNG MỘT HẰNG SỐ</strong>, không hơn. Để ý thứ KHÔNG có trong bảng: một lệnh <code>bl</code> hay <code>jmp</code> mã hoá dưới dạng KHOẢNG CÁCH tương đối so với PC thì không cần mục nào cả, vì khoảng cách giữa hai thứ cùng dời đi thì không đổi. Đó là lý do mã hiện đại chứa ÍT mục định vị lại hơn bạn tưởng rất nhiều — và cũng là lý do nó độc lập vị trí được ngay từ đầu.</p>
<p class="nhan">📐 <strong>Mã độc lập vị trí và ASLR, ĐO THẬT trên máy này.</strong> Một chương trình C ba dòng in ra địa chỉ của chính hàm <code>main</code> của nó, của biến toàn cục <code>g</code>, và của <code>printf</code>. Bộ liên kết đánh dấu nó <code>PIE</code> (tệp chạy được độc lập vị trí) nên hệ điều hành nạp nó ở một địa chỉ ngẫu nhiên mỗi lần. Bốn lượt chạy liên tiếp:</p>
<table>
<tr><th>Lượt</th><th><code>main</code></th><th><code>g</code></th><th>độ dời của <code>main</code></th><th>độ dời của <code>g</code></th></tr>
<tr><td>địa chỉ ghi trong TỆP</td><td>0x1000004f8</td><td>0x100008000</td><td>—</td><td>—</td></tr>
<tr><td>1</td><td>0x1008584f8</td><td>0x100860000</td><td>0x858000</td><td>0x858000</td></tr>
<tr><td>2</td><td>0x104af44f8</td><td>0x104afc000</td><td>0x4af4000</td><td>0x4af4000</td></tr>
<tr><td>3</td><td>0x102d984f8</td><td>0x102da0000</td><td>0x2d98000</td><td>0x2d98000</td></tr>
<tr><td>4</td><td>0x102d0c4f8</td><td>0x102d14000</td><td>0x2d0c000</td><td>0x2d0c000</td></tr>
</table>
<p class="dap-an">✅ Hai sự thật rơi thẳng ra từ phép đo. <strong>Thứ nhất: độ dời của MÃ và của DỮ LIỆU bằng nhau trong mọi lượt</strong> — 0x858000 cho cả hai ở lượt 1, 0x4af4000 cho cả hai ở lượt 2, và cứ thế. Đó chính là cột (d) của Figure 15.13 đang xảy ra thật: cả cái ảnh trượt đi đúng MỘT hằng số, khớp y như bảng bài tập ở trên dự đoán. <strong>Thứ hai: địa chỉ khác nhau ở mỗi lượt</strong>, và đó là ASLR — ngẫu nhiên hoá bố trí không gian địa chỉ. Định vị lại được phát minh từ thập niên 1960 để hai chương trình dùng chung được bộ nhớ; ngày nay đúng cơ chế đó được tái sử dụng làm lớp phòng thủ an ninh, vì kẻ tấn công không biết mã đáp xuống đâu thì không viết ra nổi địa chỉ của hàm mà hắn muốn nhảy tới.</p>
<p class="pitfall">⚠️ Ghi chú thành thật từ cùng thí nghiệm: <code>printf</code> in ra <em>CÙNG MỘT</em> địa chỉ 0x18f089964 ở cả bốn lượt. Đó không phải lỗi đo — thư viện hệ thống nằm trong dyld shared cache, vốn chỉ được ngẫu nhiên hoá MỘT LẦN mỗi lần khởi động máy rồi dùng chung cho mọi tiến trình. Vậy ASLR là theo TIẾN TRÌNH với mã của bạn và theo LẦN KHỞI ĐỘNG với thư viện hệ thống. Cũng đáng báo lại: thử tắt nó bằng <code>-Wl,-no_pie</code> thì nhận <code>ld: warning: -no_pie ignored for arm64</code> và tệp vẫn là PIE. Trên Apple Silicon bạn KHÔNG tắt được tính độc lập vị trí, nên mọi đáp án kiểu "cứ dựng bản không PIE là xong" đã không còn là lựa chọn thật ở đó.</p>`],

      [34, 'Figure 15.14 — The Linking Function',
        `<p class="y-chinh">🎯 Three separate object modules on the left become one load module on the right, and the picture shows exactly what the linker changed: <strong>the names became numbers.</strong> Module A has an "External Reference to Module B" written as <code>CALL B;</code>; in the load module that same line reads <code>JSR "L"</code>.</p>
<table>
<tr><th>Left: object modules</th><th>Length</th><th>Right: load module, relative addresses</th><th>The call becomes</th></tr>
<tr><td>Module A, contains <code>CALL B;</code> then <code>Return</code></td><td>L</td><td>occupies 0 … L − 1</td><td><code>JSR "L"</code></td></tr>
<tr><td>Module B, contains <code>CALL C;</code> then <code>Return</code></td><td>M</td><td>occupies L … L + M − 1</td><td><code>JSR "L + M"</code></td></tr>
<tr><td>Module C, contains <code>Return</code></td><td>N</td><td>occupies L + M … L + M + N − 1</td><td>—</td></tr>
</table>
<ul>
<li><strong>The addresses on the right are arithmetic, and you can reproduce them.</strong> Stack the modules in order: A starts at 0, so B must start at L, and C must start at L + M. Therefore the call to B is a jump to <em>L</em> and the call to C is a jump to <em>L + M</em>. Put in numbers — say L = 100, M = 60, N = 40 — and you get: A at 0–99, B at 100–159, C at 160–199, <code>JSR 100</code>, <code>JSR 160</code>, total length 200.</li>
<li><strong>Everything is <em>relative to the origin of the load module</em>, not absolute.</strong> That is row 3 of Table 15.4(b) word for word: "all references are restated relative to the origin of the final load module". The load module is still relocatable; slide 33 handles the final step.</li>
<li><strong>The dashed lines at L − 1 and L + M − 1 mark the seams.</strong> Each module's <code>Return</code> is the last thing before the next module begins. The linker did not merge or reorder any code — it concatenated, then rewrote the references.</li>
<li><strong>Why <code>JSR</code> and not <code>CALL</code> in the output.</strong> JSR = Jump to SubRoutine, a machine instruction. <code>CALL B;</code> on the left is a <em>source-level</em> reference to a name. The change of mnemonic is the figure's way of saying: on the left you had a symbol, on the right you have an instruction with a number in it.</li>
<li><strong>This is the EXTERN/GLOBAL pairing of slide 18 completed.</strong> Module A declared B as EXTERN (undefined here, defined elsewhere); Module B declared itself GLOBAL. The linker is the only component that ever sees both declarations, which is why it is the only component that can fail with "undefined symbol".</li>
</ul>
<p class="nhan">📐 <strong>Watch the symbol turn into an address, on this machine.</strong> <code>nm</code> prints one letter per symbol: <code>T</code> means defined in the text section with a real address, <code>U</code> means <strong>undefined — the linker must find it</strong>.</p>
<pre><code>$ nm gcd.o                    $ nm helper.o
                 U _gcd       0000000000000000 T _gcd
0000000000000000 T _main
                 U _printf

$ cc gcd.o helper.o -o gcd
$ nm gcd
00000001000004ac T _gcd       &lt;- was U, now has an address
0000000100000460 T _main
                 U _printf    &lt;- still U: resolved later, by the loader</code></pre>
<p class="nhan">📐 And the same thing at the instruction level. <code>otool -tv</code> disassembles; look at the <code>bl</code> (branch-and-link, the ARM call) before and after:</p>
<pre><code>$ otool -tv gcd.o             # BEFORE linking
_main:
  00000018  mov  w0, #0x30
  0000001c  mov  w1, #0x12
  00000020  bl   0x20         &lt;- branches to ITSELF: the offset field is a HOLE
  ...
  00000038  bl   0x38         &lt;- same hole, for printf

$ otool -tv gcd               # AFTER linking
_main:
  100000478  mov  w0, #0x30
  10000047c  mov  w1, #0x12
  100000480  bl   _gcd                       &lt;- real target 0x1000004ac
  100000498  bl   0x100000500 ; symbol stub for: _printf
_gcd:
  1000004ac  sub  sp, sp, #0x10              &lt;- the definition, pulled in from helper.o</code></pre>
<p class="nhan">📐 And the to-do list the linker worked from — this is the file's relocation table, the real version of slide 28's forward-reference list:</p>
<pre><code>$ otool -r gcd.o
Relocation information (__TEXT,__text) 4 entries
address  pcrel length extern type  symbolnum
00000038 1     2      1      2     6        &lt;- fix the call at 0x38 (_printf)
00000034 0     2      1      4     1
00000030 1     2      1      3     1
00000020 1     2      1      2     5        &lt;- fix the call at 0x20 (_gcd)</code></pre>
<p class="dap-an">✅ Put the three outputs together and Figure 15.14 is completely explained by real data. In <code>gcd.o</code> the call to <code>_gcd</code> is the instruction <code>bl 0x20</code> sitting <em>at</em> address 0x20 — a branch whose displacement is zero, i.e. an empty operand field, exactly the "hole" of slide 28. The relocation table records "there is a hole at address 0x20, and it belongs to symbol number 5, <code>_gcd</code>". The linker finds <code>_gcd</code> in <code>helper.o</code>, places it at 0x1000004ac, and patches the hole. <code>nm</code> then shows <code>U</code> becoming a real address. <strong>That is the <code>CALL B;</code> → <code>JSR "L"</code> arrow of Figure 15.14, in bytes.</strong> And note that <code>_printf</code> stayed <code>U</code> even after linking — its arrow will not be drawn until the loader runs, which is slide 35.</p>
<p class="pitfall">⚠️ Do not read <code>bl 0x20</code> in the object file as "an infinite loop". An unlinked object file is <em>not runnable</em>, and its disassembly is not meant to be executed — the zero displacement is a placeholder, and the relocation table is what says so. Judging an object file by its disassembly alone is how people convince themselves a linker bug exists where there is none.</p>`,
        `<p class="y-chinh">🎯 Ba mô-đun đối tượng riêng biệt bên trái biến thành MỘT load module bên phải, và bức hình cho thấy chính xác bộ liên kết đã đổi cái gì: <strong>TÊN đã thành SỐ.</strong> Mô-đun A có một "External Reference to Module B" viết là <code>CALL B;</code>; trong load module, đúng dòng ấy thành <code>JSR "L"</code>.</p>
<table>
<tr><th>Trái: các mô-đun đối tượng</th><th>Độ dài</th><th>Phải: load module, địa chỉ tương đối</th><th>Lời gọi biến thành</th></tr>
<tr><td>Module A, có <code>CALL B;</code> rồi <code>Return</code></td><td>L</td><td>chiếm 0 … L − 1</td><td><code>JSR "L"</code></td></tr>
<tr><td>Module B, có <code>CALL C;</code> rồi <code>Return</code></td><td>M</td><td>chiếm L … L + M − 1</td><td><code>JSR "L + M"</code></td></tr>
<tr><td>Module C, có <code>Return</code></td><td>N</td><td>chiếm L + M … L + M + N − 1</td><td>—</td></tr>
</table>
<ul>
<li><strong>Địa chỉ bên phải là PHÉP TÍNH, và bạn tái tạo lại được.</strong> Xếp chồng các mô-đun theo thứ tự: A bắt đầu ở 0 nên B phải bắt đầu ở L, và C phải bắt đầu ở L + M. Do đó lời gọi B là nhảy tới <em>L</em> còn lời gọi C là nhảy tới <em>L + M</em>. Thay số vào — chẳng hạn L = 100, M = 60, N = 40 — ta được: A ở 0–99, B ở 100–159, C ở 160–199, <code>JSR 100</code>, <code>JSR 160</code>, tổng độ dài 200.</li>
<li><strong>Mọi thứ đều TƯƠNG ĐỐI so với gốc của load module, không phải tuyệt đối.</strong> Đó là dòng 3 của Table 15.4(b) đúng từng chữ: "mọi tham chiếu được phát biểu lại theo gốc của load module cuối cùng". Load module vẫn còn định vị lại được; slide 33 lo nốt bước cuối.</li>
<li><strong>Hai đường nét đứt ở L − 1 và L + M − 1 đánh dấu MỐI NỐI.</strong> Lệnh <code>Return</code> của mỗi mô-đun là thứ cuối cùng trước khi mô-đun kế bắt đầu. Bộ liên kết KHÔNG trộn và KHÔNG sắp xếp lại mã nào — nó nối đuôi, rồi viết lại các tham chiếu.</li>
<li><strong>Vì sao đầu ra là <code>JSR</code> chứ không còn <code>CALL</code>.</strong> JSR = Jump to SubRoutine, một LỆNH MÁY. <code>CALL B;</code> bên trái là tham chiếu ở mức <em>MÃ NGUỒN</em> tới một cái tên. Việc đổi từ gợi nhớ là cách hình vẽ nói: bên trái bạn có một KÝ HIỆU, bên phải bạn có một LỆNH với một con số trong đó.</li>
<li><strong>Đây là cặp EXTERN/GLOBAL của slide 18 được hoàn tất.</strong> Mô-đun A khai B là EXTERN (ở đây chưa định nghĩa, định nghĩa ở nơi khác); mô-đun B tự khai mình là GLOBAL. Bộ liên kết là thành phần DUY NHẤT nhìn thấy cả hai khai báo, và vì thế nó cũng là thành phần duy nhất có thể báo lỗi "undefined symbol".</li>
</ul>
<p class="nhan">📐 <strong>Xem cái ký hiệu biến thành địa chỉ, trên chính máy này.</strong> <code>nm</code> in một chữ cái cho mỗi ký hiệu: <code>T</code> nghĩa là đã định nghĩa trong đoạn mã và có địa chỉ thật, <code>U</code> nghĩa là <strong>chưa phân giải — bộ liên kết phải đi tìm</strong>.</p>
<pre><code>$ nm gcd.o                    $ nm helper.o
                 U _gcd       0000000000000000 T _gcd
0000000000000000 T _main
                 U _printf

$ cc gcd.o helper.o -o gcd
$ nm gcd
00000001000004ac T _gcd       &lt;- trước là U, giờ đã có địa chỉ
0000000100000460 T _main
                 U _printf    &lt;- vẫn U: để bộ TẢI phân giải sau</code></pre>
<p class="nhan">📐 Và đúng chuyện đó ở mức LỆNH. <code>otool -tv</code> dịch ngược; hãy nhìn lệnh <code>bl</code> (branch-and-link, lệnh gọi hàm của ARM) trước và sau:</p>
<pre><code>$ otool -tv gcd.o             # TRƯỚC khi liên kết
_main:
  00000018  mov  w0, #0x30
  0000001c  mov  w1, #0x12
  00000020  bl   0x20         &lt;- nhảy vào CHÍNH NÓ: trường độ dời là một CÁI LỖ
  ...
  00000038  bl   0x38         &lt;- cũng cái lỗ đó, dành cho printf

$ otool -tv gcd               # SAU khi liên kết
_main:
  100000478  mov  w0, #0x30
  10000047c  mov  w1, #0x12
  100000480  bl   _gcd                       &lt;- đích thật 0x1000004ac
  100000498  bl   0x100000500 ; symbol stub for: _printf
_gcd:
  1000004ac  sub  sp, sp, #0x10              &lt;- phần định nghĩa, kéo về từ helper.o</code></pre>
<p class="nhan">📐 Và đây là danh sách việc-phải-làm mà bộ liên kết dựa vào — bảng ĐỊNH VỊ LẠI của tệp, bản đời thực của danh sách tham chiếu tiến ở slide 28:</p>
<pre><code>$ otool -r gcd.o
Relocation information (__TEXT,__text) 4 entries
address  pcrel length extern type  symbolnum
00000038 1     2      1      2     6        &lt;- vá lời gọi tại 0x38 (_printf)
00000034 0     2      1      4     1
00000030 1     2      1      3     1
00000020 1     2      1      2     5        &lt;- vá lời gọi tại 0x20 (_gcd)</code></pre>
<p class="dap-an">✅ Ghép ba đầu ra lại thì Figure 15.14 được giải thích trọn vẹn bằng dữ liệu thật. Trong <code>gcd.o</code>, lời gọi <code>_gcd</code> là lệnh <code>bl 0x20</code> nằm NGAY TẠI địa chỉ 0x20 — một lệnh nhảy có độ dời bằng 0, tức trường toán hạng để trống, đúng là "cái lỗ" của slide 28. Bảng định vị lại ghi "có một cái lỗ ở địa chỉ 0x20, và nó thuộc ký hiệu số 5, <code>_gcd</code>". Bộ liên kết tìm ra <code>_gcd</code> trong <code>helper.o</code>, đặt nó ở 0x1000004ac, rồi vá cái lỗ. Sau đó <code>nm</code> cho thấy <code>U</code> đã thành một địa chỉ thật. <strong>Đó chính là mũi tên <code>CALL B;</code> → <code>JSR "L"</code> của Figure 15.14, tính bằng byte.</strong> Và chú ý <code>_printf</code> VẪN là <code>U</code> kể cả sau khi liên kết — mũi tên của nó chưa được vẽ cho tới khi bộ tải chạy, tức slide 35.</p>
<p class="pitfall">⚠️ Đừng đọc <code>bl 0x20</code> trong tệp đối tượng thành "một vòng lặp vô hạn". Một tệp đối tượng CHƯA liên kết thì <em>KHÔNG chạy được</em>, và bản dịch ngược của nó vốn không nhằm để thực thi — độ dời bằng 0 là chỗ giữ chỗ, và bảng định vị lại là thứ nói rõ điều đó. Phán xét một tệp đối tượng chỉ qua bản dịch ngược là cách người ta tự thuyết phục mình rằng bộ liên kết có lỗi, trong khi nó chẳng có lỗi nào.</p>`],

      [35, 'Load-Time Dynamic Linking',
        `<p class="y-chinh">🎯 The slide defines it in one sentence: <strong>"Dynamic linking is used to refer to the practice of deferring the linkage of some external modules until after the load module has been created."</strong> Then it gives the two steps and the three advantages over what it calls "static linking".</p>
<table>
<tr><th>The two steps, as printed</th><th>What actually happens</th></tr>
<tr><td>The load module to be loaded is read into memory</td><td>The loader builds the process image of Figure 15.10</td></tr>
<tr><td>Any reference to an external module causes the loader to <strong>find</strong> the target module, <strong>load</strong> it, and <strong>alter the reference</strong> to a relative address in memory from the beginning of the application module</td><td>The <code>U</code> symbols left over from slide 34 get their addresses now, before the first instruction runs</td></tr>
</table>
<p class="nhan">📐 The three advantages the slide lists, with what each one really buys:</p>
<table>
<tr><th>Advantage on the slide</th><th>What it means in practice</th></tr>
<tr><td>It becomes easier to incorporate <strong>changed or upgraded versions</strong> of the target module</td><td>Ship a new library file; every program that uses it gets the fix without being rebuilt</td></tr>
<tr><td>Having target code in a dynamic link file <strong>paves the way for automatic code sharing</strong></td><td>One copy of the library in physical memory, mapped into many processes</td></tr>
<tr><td>It becomes easier for <strong>independent software developers to extend</strong> the functionality of a widely-used operating system such as Linux</td><td>Plugins and drivers, without the OS vendor re-linking anything</td></tr>
</table>
<table>
<tr><th>Criterion</th><th>Static linking</th><th>Dynamic linking</th></tr>
<tr><td>Executable file size</td><td>Bigger — a copy of every library routine used</td><td>Smaller — only a request for the library</td></tr>
<tr><td>Memory shared between processes</td><td>No: 10 processes = 10 copies of the library code</td><td>Yes: one physical copy mapped into all of them</td></tr>
<tr><td>Upgrading the library</td><td>Must re-link every program</td><td>Replace one file; no rebuild</td></tr>
<tr><td>Start-up time</td><td>Slightly faster — nothing left to resolve</td><td>Slightly slower — the loader must find and bind</td></tr>
<tr><td>Risk</td><td>None from outside: the program carries its own world</td><td>The library can vanish or change under you (slide 36: DLL hell)</td></tr>
</table>
<p class="nhan">📐 <strong>Measured, both ways, on this machine.</strong> A library of 300 small functions was built twice — once as a static archive (<code>ar rcs libbig.a</code>) and once as a shared library (<code>cc -dynamiclib</code>) — and the same program was linked against each:</p>
<table>
<tr><th>What was measured</th><th>Statically linked</th><th>Dynamically linked</th><th>Ratio</th></tr>
<tr><td>Size of the executable</td><td><strong>76 184 bytes</strong></td><td><strong>45 272 bytes</strong></td><td>static is <strong>1,68×</strong> bigger</td></tr>
<tr><td>Start-up time (median of 300 runs)</td><td><strong>3,021 ms</strong></td><td><strong>3,198 ms</strong></td><td>dynamic is <strong>0,18 ms</strong> slower</td></tr>
<tr><td>Library code present inside the executable?</td><td>Yes — <code>nm</code> shows <code>T _gcd</code> with an address</td><td>No — <code>nm</code> shows <code>U _gcd</code></td><td>—</td></tr>
<tr><td>External dependency</td><td><code>otool -L</code>: libSystem only</td><td><code>otool -L</code>: libSystem <em>plus</em> the library</td><td>—</td></tr>
</table>
<p class="dap-an">✅ Both halves of the trade-off show up in the numbers. The static executable is <strong>30 912 bytes bigger</strong> because it swallowed a copy of the library; the dynamic one starts <strong>6% slower</strong> because the loader has to locate and bind that library first. Now scale it up mentally: if 50 running programs each statically embed a 2 MB library, that is 100 MB of physical memory holding 50 identical copies. Dynamically linked, it is 2 MB, mapped 50 times. That is the "automatic code sharing" bullet on the slide, turned into a number — and it is why every general-purpose operating system made dynamic linking the default.</p>
<p class="pitfall">⚠️ Honest caveat about the size measurement. For a <em>tiny</em> library the difference vanishes: the first version of this experiment linked a single 10-line <code>gcd</code> function and both executables came out at exactly <strong>33 464 bytes</strong> — identical, because the function is smaller than the alignment padding. The 1,68× ratio only appeared after the library grew to 300 functions. Report the size of the library alongside the ratio, or the ratio means nothing.</p>
<p class="meo">💡 Remember the two dynamic-linking slides by <em>when the binding happens</em>: slide 35 = <strong>before</strong> the first instruction executes (the loader does it), slide 36 = <strong>during</strong> execution, on the first call (the run-time linker does it). Table 15.4(b) rows 4 and 5, in that order.</p>`,
        `<p class="y-chinh">🎯 Slide định nghĩa gọn trong một câu: <strong>"Liên kết động là cách nói về việc HOÃN liên kết một số mô-đun ngoài cho tới SAU KHI load module đã được tạo xong."</strong> Rồi nó nêu hai bước và ba lợi thế so với thứ nó gọi là "liên kết tĩnh".</p>
<table>
<tr><th>Hai bước, nguyên văn slide</th><th>Thực tế xảy ra chuyện gì</th></tr>
<tr><td>Load module cần nạp được đọc vào bộ nhớ</td><td>Bộ tải dựng ảnh tiến trình của Figure 15.10</td></tr>
<tr><td>Mọi tham chiếu tới mô-đun ngoài khiến bộ tải phải <strong>TÌM</strong> mô-đun đích, <strong>NẠP</strong> nó, và <strong>SỬA tham chiếu</strong> thành một địa chỉ tương đối trong bộ nhớ tính từ đầu mô-đun ứng dụng</td><td>Những ký hiệu <code>U</code> còn sót lại từ slide 34 được cấp địa chỉ NGAY LÚC NÀY, trước khi lệnh đầu tiên chạy</td></tr>
</table>
<p class="nhan">📐 Ba lợi thế slide liệt kê, kèm thứ mà mỗi cái thực sự mua được:</p>
<table>
<tr><th>Lợi thế trên slide</th><th>Nghĩa trong thực tế</th></tr>
<tr><td>Dễ đưa vào các <strong>phiên bản đã sửa hoặc nâng cấp</strong> của mô-đun đích</td><td>Phát hành một tệp thư viện mới; mọi chương trình dùng nó đều nhận bản vá mà không phải dựng lại</td></tr>
<tr><td>Đặt mã đích trong một tệp liên kết động <strong>mở đường cho việc DÙNG CHUNG MÃ tự động</strong></td><td>Một bản sao thư viện trong bộ nhớ vật lý, ánh xạ vào nhiều tiến trình</td></tr>
<tr><td>Dễ hơn cho <strong>các nhà phát triển độc lập MỞ RỘNG</strong> chức năng của một hệ điều hành phổ biến như Linux</td><td>Plugin và trình điều khiển, mà nhà cung cấp hệ điều hành không phải liên kết lại thứ gì</td></tr>
</table>
<table>
<tr><th>Tiêu chí</th><th>Liên kết TĨNH</th><th>Liên kết ĐỘNG</th></tr>
<tr><td>Kích thước tệp chạy được</td><td>To hơn — mang theo bản sao mọi thủ tục thư viện đã dùng</td><td>Nhỏ hơn — chỉ mang một YÊU CẦU về thư viện</td></tr>
<tr><td>Bộ nhớ dùng chung giữa các tiến trình</td><td>KHÔNG: 10 tiến trình = 10 bản sao mã thư viện</td><td>CÓ: một bản vật lý duy nhất ánh xạ vào tất cả</td></tr>
<tr><td>Nâng cấp thư viện</td><td>Phải liên kết lại MỌI chương trình</td><td>Thay MỘT tệp; không dựng lại gì</td></tr>
<tr><td>Thời gian khởi động</td><td>Nhanh hơn chút — chẳng còn gì phải phân giải</td><td>Chậm hơn chút — bộ tải phải tìm rồi gắn</td></tr>
<tr><td>Rủi ro</td><td>Không có rủi ro từ bên ngoài: chương trình mang theo cả thế giới của nó</td><td>Thư viện có thể biến mất hoặc đổi dưới chân bạn (slide 36: DLL hell)</td></tr>
</table>
<p class="nhan">📐 <strong>ĐO THẬT, cả hai đường, trên máy này.</strong> Một thư viện gồm 300 hàm nhỏ được dựng hai lần — một lần thành kho tĩnh (<code>ar rcs libbig.a</code>) và một lần thành thư viện dùng chung (<code>cc -dynamiclib</code>) — rồi cùng một chương trình được liên kết với từng bản:</p>
<table>
<tr><th>Thứ được đo</th><th>Liên kết TĨNH</th><th>Liên kết ĐỘNG</th><th>Tỉ lệ</th></tr>
<tr><td>Kích thước tệp chạy được</td><td><strong>76.184 byte</strong></td><td><strong>45.272 byte</strong></td><td>tĩnh lớn hơn <strong>1,68×</strong></td></tr>
<tr><td>Thời gian khởi động (trung vị 300 lượt)</td><td><strong>3,021 ms</strong></td><td><strong>3,198 ms</strong></td><td>động chậm hơn <strong>0,18 ms</strong></td></tr>
<tr><td>Mã thư viện có nằm TRONG tệp chạy được không?</td><td>CÓ — <code>nm</code> hiện <code>T _gcd</code> kèm địa chỉ</td><td>KHÔNG — <code>nm</code> hiện <code>U _gcd</code></td><td>—</td></tr>
<tr><td>Phụ thuộc bên ngoài</td><td><code>otool -L</code>: chỉ libSystem</td><td><code>otool -L</code>: libSystem <em>CỘNG</em> thư viện kia</td><td>—</td></tr>
</table>
<p class="dap-an">✅ Cả hai vế của phép đánh đổi đều hiện ra thành số. Bản tĩnh lớn hơn <strong>30.912 byte</strong> vì nó nuốt trọn một bản sao thư viện; bản động khởi động chậm hơn <strong>6%</strong> vì bộ tải phải đi tìm rồi gắn thư viện ấy trước. Giờ hãy nhân lên trong đầu: nếu 50 chương trình đang chạy mỗi cái nhúng tĩnh một thư viện 2 MB thì đó là 100 MB bộ nhớ vật lý chứa 50 bản y hệt nhau. Liên kết động thì chỉ 2 MB, ánh xạ 50 lần. Đó chính là gạch đầu dòng "dùng chung mã tự động" trên slide, quy ra con số — và đó là lý do mọi hệ điều hành đa dụng đều lấy liên kết động làm mặc định.</p>
<p class="pitfall">⚠️ Cảnh báo thành thật về phép đo kích thước. Với một thư viện <em>TÍ HON</em> thì khác biệt biến mất: bản thí nghiệm đầu tiên liên kết đúng một hàm <code>gcd</code> mười dòng và cả hai tệp chạy được đều ra đúng <strong>33.464 byte</strong> — giống hệt nhau, vì hàm đó còn nhỏ hơn phần đệm căn lề. Tỉ lệ 1,68× chỉ xuất hiện sau khi thư viện phình lên 300 hàm. Hãy báo kích thước thư viện kèm theo tỉ lệ, không thì tỉ lệ chẳng nói lên gì.</p>
<p class="meo">💡 Nhớ hai slide liên kết động bằng câu hỏi <em>việc gắn xảy ra LÚC NÀO</em>: slide 35 = <strong>TRƯỚC</strong> khi lệnh đầu tiên chạy (bộ tải làm), slide 36 = <strong>TRONG LÚC</strong> chạy, ở lời gọi đầu tiên (bộ liên kết lúc chạy làm). Đúng dòng 4 và dòng 5 của Table 15.4(b), theo thứ tự đó.</p>`],

      [36, 'Run-Time Dynamic Linking (DLLs and DLL hell)',
        `<p class="y-chinh">🎯 The latest binding time of all: <strong>"with run-time dynamic linking some of the linking is postponed until execution time"</strong>. External references survive into the loaded program, and the operating system only locates and links a module <em>when a call to it is actually made</em>.</p>
<table>
<tr><th>What the slide says</th><th>Consequence</th></tr>
<tr><td>External references to target modules <strong>remain in the loaded program</strong></td><td>The process image contains unresolved references while it is already running</td></tr>
<tr><td>When a call is made to the absent module, the <strong>operating system</strong> locates it, loads it, and links it to the calling module</td><td>The first call is slow; later calls are ordinary calls</td></tr>
<tr><td>Such modules are typically <strong>shareable</strong></td><td>Same physical memory serves every process that wants it</td></tr>
<tr><td>In the Windows environment these are called <strong>dynamic-link libraries (DLLs)</strong></td><td>On Linux they are <code>.so</code> files, on macOS <code>.dylib</code></td></tr>
<tr><td>If one process is <strong>already using</strong> a dynamically linked shared module, that module is in main memory and a new process can simply link to the <strong>already-loaded</strong> module</td><td>The second user of a library pays almost nothing</td></tr>
<tr><td>The use of DLLs can lead to <strong>"DLL hell"</strong>: two or more processes share a DLL module but <strong>expect different versions</strong></td><td>The failure appears in a program nobody changed</td></tr>
</table>
<ul>
<li><strong>The advantage and the disease come from the same property.</strong> Because the library is not inside your program, it can be upgraded without touching your program — and it can be <em>downgraded, replaced or broken</em> without touching your program either. Slide 35's first advantage and this slide's DLL hell are two readings of one sentence.</li>
<li><strong>Run-time linking is the only kind that can decide <em>which</em> module at run time.</strong> A plugin architecture, a codec chosen by file type, a driver matched to hardware found at boot — none of these can be linked earlier, because the name of the module is not known until the program is running.</li>
<li><strong>Why the first call is the expensive one.</strong> The OS must find the file, map it, relocate it and patch the call site; after that the reference points straight at the code. Real systems implement this with a jump table (the PLT on Linux) whose entries start out pointing at the resolver and are rewritten on first use — <em>lazy binding</em>, and a direct descendant of the fix-up list on slide 28.</li>
<li><strong>DLL hell is a versioning problem, not a technical bug.</strong> Nothing in the mechanism is broken: process A wants version 1, process B wants version 2, and there is one file. The modern answers are all about naming — version numbers baked into the file name, side-by-side installation, or containers that give each application its own copy of everything.</li>
<li><strong>Connect to Ch.9.</strong> Sharing one physical copy among processes requires the memory management unit: the same page frames are mapped into several address spaces, at possibly different virtual addresses. That is why shared libraries must be position-independent code — slide 33 again.</li>
</ul>
<p class="nhan">📐 <strong>DLL hell, reproduced in four commands.</strong> One tiny library defines <code>gcd</code>. Two executables were built from the <em>same</em> object file — one linked statically against <code>libmyg.a</code>, one dynamically against <code>libmyg.dylib</code>. Then the library was rewritten to return a wrong answer and rebuilt, <strong>without recompiling either program</strong>:</p>
<pre><code>$ ./gcd_static ; ./gcd_dyn
gcd(48,18) = 6
gcd(48,18) = 6

# now replace ONLY the shared library — no program is rebuilt
$ cat helper2.c
unsigned gcd(unsigned a, unsigned b) { return 999; }
$ cc -dynamiclib helper2.c -o libmyg.dylib

$ ./gcd_dyn
gcd(48,18) = 999          &lt;- behaviour changed. Nothing was recompiled.
$ ./gcd_static
gcd(48,18) = 6            &lt;- unaffected: it carries its own copy</code></pre>
<p class="dap-an">✅ That single output pair is the whole slide. The dynamically linked program changed its answer because the code it calls was never inside it — <code>nm gcd_dyn</code> shows <code>U _gcd</code>, an unresolved reference filled in at load time from whatever file is on disk <em>right now</em>. The statically linked program shows <code>T _gcd</code> with a real address and is immune. <strong>Read it as the upside on Monday and the horror on Friday:</strong> the same mechanism that lets a security fix reach fifty programs without rebuilding them is the mechanism that lets one careless library update break fifty programs whose source code nobody touched. If an exam asks for one concrete example of DLL hell, this is it, with the exact commands.</p>
<p class="pitfall">⚠️ The debugging lesson that follows from this experiment: when a program that "has not changed" suddenly misbehaves, the first thing to check is not your code — it is <code>otool -L</code> / <code>ldd</code> and the <em>versions of the libraries it loads</em>. A binary is not self-contained; it is a request to the loader, and the answer to that request can change between two runs.</p>`,
        `<p class="y-chinh">🎯 Thời điểm gắn kết MUỘN NHẤT trong tất cả: <strong>"với liên kết động lúc chạy, một phần việc liên kết bị hoãn tới tận thời điểm thực thi"</strong>. Tham chiếu ngoài sống nguyên vào trong chương trình đã nạp, và hệ điều hành chỉ đi tìm rồi liên kết một mô-đun <em>KHI lời gọi tới nó thực sự xảy ra</em>.</p>
<table>
<tr><th>Slide nói gì</th><th>Hệ quả</th></tr>
<tr><td>Tham chiếu ngoài tới các mô-đun đích <strong>CÒN NGUYÊN trong chương trình đã nạp</strong></td><td>Ảnh tiến trình chứa tham chiếu chưa phân giải trong khi nó đã đang chạy</td></tr>
<tr><td>Khi có lời gọi tới mô-đun vắng mặt, <strong>HỆ ĐIỀU HÀNH</strong> định vị nó, nạp nó, và liên kết nó vào mô-đun gọi</td><td>Lời gọi ĐẦU TIÊN chậm; những lời gọi sau là lời gọi bình thường</td></tr>
<tr><td>Những mô-đun như vậy thường <strong>DÙNG CHUNG ĐƯỢC</strong></td><td>Cùng một vùng bộ nhớ vật lý phục vụ mọi tiến trình cần tới</td></tr>
<tr><td>Trong môi trường Windows chúng được gọi là <strong>dynamic-link libraries (DLL)</strong></td><td>Trên Linux là tệp <code>.so</code>, trên macOS là <code>.dylib</code></td></tr>
<tr><td>Nếu một tiến trình <strong>ĐANG dùng</strong> một mô-đun dùng chung liên kết động thì mô-đun đó đã nằm trong bộ nhớ chính và một tiến trình mới chỉ việc liên kết vào mô-đun <strong>ĐÃ NẠP SẴN</strong></td><td>Người dùng thứ hai của một thư viện gần như không phải trả gì</td></tr>
<tr><td>Dùng DLL có thể dẫn tới <strong>"DLL hell"</strong>: hai tiến trình trở lên dùng chung một DLL nhưng <strong>CHỜ ĐỢI HAI PHIÊN BẢN KHÁC NHAU</strong></td><td>Sự cố hiện ra ở một chương trình mà không ai sửa gì cả</td></tr>
</table>
<ul>
<li><strong>Lợi thế và căn bệnh sinh ra từ CÙNG một tính chất.</strong> Vì thư viện không nằm trong chương trình bạn, nó nâng cấp được mà không cần đụng tới chương trình bạn — và nó cũng <em>hạ cấp, bị thay, bị làm hỏng</em> được mà không cần đụng tới chương trình bạn. Lợi thế thứ nhất ở slide 35 và DLL hell ở slide này là hai cách đọc của cùng một câu.</li>
<li><strong>Liên kết lúc chạy là kiểu DUY NHẤT quyết định được <em>MÔ-ĐUN NÀO</em> vào lúc chạy.</strong> Kiến trúc plugin, bộ giải mã chọn theo loại tệp, trình điều khiển khớp với phần cứng phát hiện lúc khởi động — không thứ nào liên kết sớm hơn được, vì TÊN mô-đun chưa hề biết cho tới khi chương trình đang chạy.</li>
<li><strong>Vì sao lời gọi đầu tiên là lời gọi đắt.</strong> Hệ điều hành phải tìm tệp, ánh xạ nó, định vị lại nó và vá điểm gọi; sau đó tham chiếu chỉ thẳng vào mã. Hệ thống thật cài đặt chuyện này bằng một bảng nhảy (PLT trên Linux) mà ban đầu các mục đều trỏ vào bộ phân giải rồi được ghi đè ở lần dùng đầu tiên — <em>gắn kết lười</em>, con cháu trực hệ của danh sách vá ở slide 28.</li>
<li><strong>DLL hell là bài toán PHIÊN BẢN, không phải một lỗi kỹ thuật.</strong> Không có gì trong cơ chế bị hỏng cả: tiến trình A muốn bản 1, tiến trình B muốn bản 2, mà chỉ có một tệp. Mọi lời giải hiện đại đều xoay quanh việc ĐẶT TÊN — nhét số phiên bản vào tên tệp, cài song song nhiều bản, hoặc dùng container để mỗi ứng dụng có bản sao riêng của mọi thứ.</li>
<li><strong>Nối sang Ch.9.</strong> Dùng chung MỘT bản vật lý giữa nhiều tiến trình đòi hỏi khối quản lý bộ nhớ: cùng những khung trang được ánh xạ vào nhiều không gian địa chỉ, có thể ở những địa chỉ ảo khác nhau. Đó là lý do thư viện dùng chung bắt buộc phải là mã độc lập vị trí — lại slide 33.</li>
</ul>
<p class="nhan">📐 <strong>DLL hell, TÁI HIỆN trong bốn câu lệnh.</strong> Một thư viện tí hon định nghĩa <code>gcd</code>. Hai tệp chạy được dựng từ <em>CÙNG MỘT</em> tệp đối tượng — một liên kết tĩnh với <code>libmyg.a</code>, một liên kết động với <code>libmyg.dylib</code>. Rồi thư viện bị viết lại cho trả về kết quả sai và dựng lại, <strong>mà KHÔNG biên dịch lại chương trình nào</strong>:</p>
<pre><code>$ ./gcd_static ; ./gcd_dyn
gcd(48,18) = 6
gcd(48,18) = 6

# giờ chỉ thay MỖI thư viện dùng chung — không chương trình nào được dựng lại
$ cat helper2.c
unsigned gcd(unsigned a, unsigned b) { return 999; }
$ cc -dynamiclib helper2.c -o libmyg.dylib

$ ./gcd_dyn
gcd(48,18) = 999          &lt;- HÀNH VI ĐÃ ĐỔI. Không có gì được biên dịch lại.
$ ./gcd_static
gcd(48,18) = 6            &lt;- không hề hấn: nó mang theo bản sao của riêng nó</code></pre>
<p class="dap-an">✅ Đúng một cặp kết quả đó là toàn bộ slide này. Chương trình liên kết động đổi câu trả lời vì đoạn mã nó gọi CHƯA BAO GIỜ nằm bên trong nó — <code>nm gcd_dyn</code> hiện <code>U _gcd</code>, một tham chiếu chưa phân giải, được lấp lúc tải từ bất kỳ tệp nào đang nằm trên đĩa <em>NGAY LÚC ẤY</em>. Chương trình liên kết tĩnh hiện <code>T _gcd</code> kèm địa chỉ thật và miễn nhiễm. <strong>Hãy đọc nó như điều tuyệt vời hôm thứ Hai và nỗi kinh hoàng hôm thứ Sáu:</strong> đúng cái cơ chế cho phép một bản vá bảo mật tới được năm mươi chương trình mà không phải dựng lại chúng cũng là cái cơ chế cho phép một lần cập nhật thư viện cẩu thả làm hỏng năm mươi chương trình mà không ai đụng vào mã nguồn. Nếu đề thi đòi MỘT ví dụ cụ thể về DLL hell, đây, kèm nguyên vẹn các câu lệnh.</p>
<p class="pitfall">⚠️ Bài học gỡ lỗi rút ra từ chính thí nghiệm này: khi một chương trình "chẳng đổi gì" bỗng dở chứng, thứ đầu tiên phải kiểm KHÔNG phải mã của bạn — mà là <code>otool -L</code> / <code>ldd</code> và <em>PHIÊN BẢN những thư viện nó nạp vào</em>. Một tệp nhị phân không tự chứa đủ; nó là một YÊU CẦU gửi tới bộ tải, và câu trả lời cho yêu cầu đó có thể đổi giữa hai lần chạy.</p>`],

      [37, 'Summary — Chapter 15: Assembly Language and Related Topics',
        `<p class="y-chinh">🎯 The closing map of the chapter, in two columns. Left: <em>assembly language concepts · motivation · elements</em> (statements, pseudo-instructions, macro definitions, directives, system calls). Right: <em>types of assemblers · assemblers</em> (two-pass, one-pass) <em>· loading and linking</em> (relocation, loading, linking). Slides 20–37 covered the whole right-hand column and the examples that make the left one concrete.</p>
<table>
<tr><th>Summary item</th><th>Where you saw it in slides 20–37</th><th>The one sentence to remember</th></tr>
<tr><td>Assembly language elements, in real programs</td><td>20, 21, 22, 24</td><td>Hand-written assembly did the same GCD in 11 instructions where the compiler needed 22</td></tr>
<tr><td>Types of assemblers</td><td>25</td><td>Three questions, not seven categories: where it runs, what it can do, how many passes</td></tr>
<tr><td>Two-pass assembler</td><td>26</td><td>Pass 1 builds the symbol table with a location counter; pass 2 emits code</td></tr>
<tr><td>One-pass assembler</td><td>28</td><td>Leave a hole, flag the symbol, remember the hole's address; patch when the label arrives</td></tr>
<tr><td>Loading</td><td>29, 31</td><td>A file becomes a process when the OS adds a PCB and a stack</td></tr>
<tr><td>Relocation</td><td>32, 33</td><td>Relocation is the addition of one constant — proved by measuring ASLR</td></tr>
<tr><td>Linking</td><td>30, 34, 35, 36</td><td>The linker turns <code>U</code> into an address; the loader and the run-time linker do the rest, later</td></tr>
</table>
<p class="nhan">📐 <strong>Now do the lab: MARIE, hands on.</strong> The school ships the simulator with the course (<code>CEA201_tool/MARIESimulator.zip</code> plus <code>GuideMARIE.zip</code>). The routine is always the same four steps:</p>
<table>
<tr><th>Step</th><th>What to do</th><th>What to watch</th></tr>
<tr><td>1</td><td>Unzip and run <code>MarieSim.jar</code> (needs Java). Type the program into the editor and save it as a <code>.mas</code> file</td><td>The editor is plain text — labels end with a comma, comments start with <code>/</code></td></tr>
<tr><td>2</td><td><strong>Assemble.</strong> If it succeeds you get a <code>.mex</code> file and a listing</td><td>Open the listing: it is the <em>symbol table and object code</em> of slide 26, produced by a real two-pass assembler</td></tr>
<tr><td>3</td><td><strong>Load</strong> the assembled program into the simulated memory</td><td>The memory panel fills with the same hex words the listing showed — this is Figure 15.10, loading</td></tr>
<tr><td>4</td><td><strong>Step</strong>, one instruction at a time (not Run)</td><td>Watch PC, AC, MAR, MBR and IR change on every click, and watch the memory cell light up when a <code>Store</code> executes</td></tr>
</table>
<p class="nhan">📐 <strong>The program to type first</strong> — multiply 7 by 6 using nothing but repeated addition, since MARIE has no multiply instruction:</p>
<pre><code>        ORG 100
        Clear                 / AC &lt;- 0
        Store Prod            / Prod = 0
Loop,   Load  Y
        Skipcond 800          / skip next if AC &gt; 0
        Jump  Done            / Y reached 0 -&gt; finished
        Load  Prod
        Add   X
        Store Prod            / Prod = Prod + X
        Load  Y
        Subt  One
        Store Y               / Y = Y - 1
        Jump  Loop
Done,   Load  Prod
        Output
        Halt
Prod,   DEC 0
X,      DEC 7
Y,      DEC 6
One,    DEC 1</code></pre>
<p class="nhan">📐 <strong>Execution trace, produced by a MARIE simulator written in python3 for this lesson and run — not traced by hand.</strong> It implements all 15 opcodes and the standard fetch cycle (MAR ← PC; IR ← M[MAR]; PC ← PC + 1; MAR ← IR[11..0]). First eleven steps, then the last four:</p>
<table>
<tr><th>PC</th><th>Instruction</th><th>AC</th><th>MAR</th><th>MBR</th><th>memory cell changed</th></tr>
<tr><td>100</td><td><code>CLEAR</code></td><td>0</td><td>000</td><td>0</td><td>—</td></tr>
<tr><td>101</td><td><code>STORE 10F</code></td><td>0</td><td>10F</td><td>0</td><td>M[10F] = 0</td></tr>
<tr><td>102</td><td><code>LOAD 111</code></td><td>6</td><td>111</td><td>6</td><td>—</td></tr>
<tr><td>103</td><td><code>SKIPCOND 800</code></td><td>6</td><td>800</td><td>6</td><td>— (AC &gt; 0 so the next instruction is skipped)</td></tr>
<tr><td>105</td><td><code>LOAD 10F</code></td><td>0</td><td>10F</td><td>0</td><td>—</td></tr>
<tr><td>106</td><td><code>ADD 110</code></td><td>7</td><td>110</td><td>7</td><td>—</td></tr>
<tr><td>107</td><td><code>STORE 10F</code></td><td>7</td><td>10F</td><td>7</td><td>M[10F] = 7</td></tr>
<tr><td>108</td><td><code>LOAD 111</code></td><td>6</td><td>111</td><td>6</td><td>—</td></tr>
<tr><td>109</td><td><code>SUBT 112</code></td><td>5</td><td>112</td><td>1</td><td>—</td></tr>
<tr><td>10A</td><td><code>STORE 111</code></td><td>5</td><td>111</td><td>5</td><td>M[111] = 5</td></tr>
<tr><td>10B</td><td><code>JUMP 102</code></td><td>5</td><td>102</td><td>5</td><td>—</td></tr>
<tr><td colspan="6">… 48 more steps: the loop body runs five more times …</td></tr>
<tr><td>104</td><td><code>JUMP 10C</code></td><td>0</td><td>10C</td><td>0</td><td>—</td></tr>
<tr><td>10C</td><td><code>LOAD 10F</code></td><td>42</td><td>10F</td><td>42</td><td>—</td></tr>
<tr><td>10D</td><td><code>OUTPUT</code></td><td>42</td><td>000</td><td>42</td><td>—</td></tr>
<tr><td>10E</td><td><code>HALT</code></td><td>42</td><td>000</td><td>42</td><td>—</td></tr>
</table>
<p class="dap-an">✅ Output <strong>42</strong>, reached in <strong>62 instruction cycles</strong>. Two things in the trace are worth pausing on. (1) At PC = 103 the <code>Skipcond 800</code> jumped straight to <strong>105</strong>, not 104 — the skip is visible as a gap in the PC column, which is the easiest way to check a Skipcond in a lab. (2) MBR always carries the value that just crossed the bus: on a <code>Load</code> it is the value read <em>from</em> memory, on a <code>Store</code> it is the value written <em>to</em> memory. If your own trace shows MBR unchanged across a memory instruction, you have mis-traced it.</p>
<p class="nhan">📐 <strong>Four exercises to practise on, all four written, assembled and run in the simulator before being printed here.</strong> Each uses the array <code>12, 7, 30, 4, 9</code> stored from address 200, except the last:</p>
<table>
<tr><th>#</th><th>Task</th><th>Key technique</th><th>Verified answer</th><th>Cycles</th></tr>
<tr><td>1</td><td>Sum a list of 5 numbers</td><td><code>LoadI Ptr</code> with a pointer incremented each pass — MARIE's indirect addressing</td><td><strong>62</strong> (12+7+30+4+9)</td><td>73</td></tr>
<tr><td>2</td><td>Find the largest of 5 numbers</td><td>Keep <code>Max</code>; subtract and use <code>Skipcond 800</code> to test "greater than"</td><td><strong>30</strong></td><td>59</td></tr>
<tr><td>3</td><td>Count how many are even</td><td>No modulo instruction: subtract 2 repeatedly until the value hits 0 (even) or goes negative (odd)</td><td><strong>3</strong> (12, 30, 4)</td><td>340</td></tr>
<tr><td>4</td><td>Multiply 7 × 6 without a multiply instruction</td><td>Repeated addition, the program traced above</td><td><strong>42</strong></td><td>62</td></tr>
</table>
<p class="nhan">📐 Exercise 1 in full, so you have a working model for the other three:</p>
<pre><code>        ORG 100
        Clear
        Store Sum
Loop,   Load  Ctr
        Skipcond 400          / Ctr == 0 ?
        Jump  Body
        Jump  Done
Body,   LoadI Ptr             / AC &lt;- M[M[Ptr]]  : the element
        Add   Sum
        Store Sum
        Load  Ptr
        Add   One
        Store Ptr             / Ptr = Ptr + 1
        Load  Ctr
        Subt  One
        Store Ctr
        Jump  Loop
Done,   Load  Sum
        Output
        Halt
Sum,    DEC 0
Ctr,    DEC 5
Ptr,    HEX 200
One,    DEC 1
        ORG 200
        DEC 12
        DEC 7
        DEC 30
        DEC 4
        DEC 9</code></pre>
<p class="dap-an">✅ Answers, each confirmed by running the program rather than by reasoning about it: <strong>62 · 30 · 3 · 42</strong>. Notice exercise 3's cycle count — <strong>340 cycles</strong>, five times more than any other, because testing evenness by repeated subtraction is genuinely expensive on a machine with no divide. That number is the best argument in the course for why real instruction sets grew a <code>div</code>: the algorithm did not change, only the instruction set, and the cost fell by an order of magnitude.</p>
<p class="pitfall">⚠️ Three traps that cost lab time, all of them hit while writing these four programs. (1) <strong><code>Skipcond</code> takes a hex code, not a comparison</strong>: <code>000</code> = skip if AC &lt; 0, <code>400</code> = skip if AC = 0, <code>800</code> = skip if AC &gt; 0. There is no "skip if less than or equal" — build it from two tests. (2) <strong>Only one accumulator exists.</strong> Every intermediate value must be stored back to memory before you can compute the next one; that is why the loops above are full of <code>Load</code>/<code>Store</code> pairs that would be invisible registers on x86. (3) <strong><code>ORG</code> appearing twice does not move the entry point.</strong> The first <code>ORG</code> is where execution starts; a later <code>ORG 200</code> only places data. An early version of exercise 1 started executing <em>at the data</em> and spun forever — the symptom was a trace full of nonsense opcodes, and the fix was one line in the assembler, not in the program.</p>
<p class="meo">💡 Study routine for the six practical sessions: for every program you write, do it three times — <em>trace it on paper first</em>, then <em>Step it in the simulator</em>, then compare. The places where your paper trace and the simulator disagree are exactly the things you did not understand about the fetch–execute cycle, and there are usually only two or three of them.</p>`,
        `<p class="y-chinh">🎯 Bản đồ khép lại chương, chia hai cột. Trái: <em>khái niệm hợp ngữ · động cơ dùng hợp ngữ · các thành phần</em> (câu lệnh, giả lệnh, định nghĩa macro, chỉ thị, lời gọi hệ thống). Phải: <em>các loại trình dịch · trình dịch</em> (hai lượt, một lượt) <em>· tải và liên kết</em> (định vị lại, tải, liên kết). Slide 20–37 đã phủ trọn cột PHẢI và những ví dụ làm cột TRÁI trở nên cụ thể.</p>
<table>
<tr><th>Mục trong Summary</th><th>Bạn đã gặp ở slide nào (20–37)</th><th>Một câu để nhớ</th></tr>
<tr><td>Thành phần hợp ngữ, trong chương trình thật</td><td>20, 21, 22, 24</td><td>Hợp ngữ viết tay làm cùng bài ƯCLN trong 11 lệnh, chỗ trình biên dịch cần 22</td></tr>
<tr><td>Các loại trình dịch hợp ngữ</td><td>25</td><td>Ba câu hỏi chứ không phải bảy loại: chạy ở đâu, làm được gì, mấy lượt</td></tr>
<tr><td>Trình dịch hai lượt</td><td>26</td><td>Lượt 1 dựng bảng ký hiệu bằng bộ đếm vị trí; lượt 2 phát mã</td></tr>
<tr><td>Trình dịch một lượt</td><td>28</td><td>Chừa lỗ, đánh dấu ký hiệu, nhớ ĐỊA CHỈ cái lỗ; vá khi nhãn xuất hiện</td></tr>
<tr><td>Tải</td><td>29, 31</td><td>Một tệp thành tiến trình khi hệ điều hành thêm PCB và ngăn xếp</td></tr>
<tr><td>Định vị lại</td><td>32, 33</td><td>Định vị lại là phép cộng MỘT hằng số — chứng minh bằng cách đo ASLR</td></tr>
<tr><td>Liên kết</td><td>30, 34, 35, 36</td><td>Bộ liên kết biến <code>U</code> thành địa chỉ; bộ tải và bộ liên kết lúc chạy lo nốt phần sau</td></tr>
</table>
<p class="nhan">📐 <strong>Giờ vào lab: MARIE, làm bằng tay.</strong> Trường phát kèm trình mô phỏng theo môn (<code>CEA201_tool/MARIESimulator.zip</code> cùng <code>GuideMARIE.zip</code>). Quy trình luôn đúng bốn bước:</p>
<table>
<tr><th>Bước</th><th>Làm gì</th><th>Nhìn vào đâu</th></tr>
<tr><td>1</td><td>Giải nén rồi chạy <code>MarieSim.jar</code> (cần Java). Gõ chương trình vào trình soạn và lưu thành tệp <code>.mas</code></td><td>Trình soạn là văn bản thuần — nhãn kết thúc bằng dấu PHẨY, chú thích mở đầu bằng <code>/</code></td></tr>
<tr><td>2</td><td><strong>Assemble</strong> (dịch). Thành công thì bạn có tệp <code>.mex</code> và một tệp listing</td><td>Mở listing ra: đó chính là <em>bảng ký hiệu và mã đối tượng</em> của slide 26, do một trình dịch hai lượt THẬT sinh ra</td></tr>
<tr><td>3</td><td><strong>Load</strong> chương trình đã dịch vào bộ nhớ mô phỏng</td><td>Bảng bộ nhớ đầy lên đúng những từ hex mà listing vừa in — đây là Figure 15.10, phần tải</td></tr>
<tr><td>4</td><td><strong>Step</strong>, từng lệnh một (ĐỪNG bấm Run)</td><td>Nhìn PC, AC, MAR, MBR và IR đổi sau mỗi cú bấm, và nhìn ô nhớ sáng lên khi một lệnh <code>Store</code> thực thi</td></tr>
</table>
<p class="nhan">📐 <strong>Chương trình nên gõ đầu tiên</strong> — nhân 7 với 6 chỉ bằng phép cộng lặp, vì MARIE không có lệnh nhân:</p>
<pre><code>        ORG 100
        Clear                 / AC &lt;- 0
        Store Prod            / Prod = 0
Loop,   Load  Y
        Skipcond 800          / bỏ qua lệnh kế nếu AC &gt; 0
        Jump  Done            / Y về 0 -&gt; xong
        Load  Prod
        Add   X
        Store Prod            / Prod = Prod + X
        Load  Y
        Subt  One
        Store Y               / Y = Y - 1
        Jump  Loop
Done,   Load  Prod
        Output
        Halt
Prod,   DEC 0
X,      DEC 7
Y,      DEC 6
One,    DEC 1</code></pre>
<p class="nhan">📐 <strong>BẢNG VẾT THỰC THI, do một máy mô phỏng MARIE viết bằng python3 cho bài này CHẠY RA — không phải lần theo bằng tay.</strong> Nó cài đủ 15 mã lệnh và đúng chu kỳ nạp lệnh (MAR ← PC; IR ← M[MAR]; PC ← PC + 1; MAR ← IR[11..0]). Mười một nhịp đầu, rồi bốn nhịp cuối:</p>
<table>
<tr><th>PC</th><th>Lệnh</th><th>AC</th><th>MAR</th><th>MBR</th><th>ô nhớ bị đổi</th></tr>
<tr><td>100</td><td><code>CLEAR</code></td><td>0</td><td>000</td><td>0</td><td>—</td></tr>
<tr><td>101</td><td><code>STORE 10F</code></td><td>0</td><td>10F</td><td>0</td><td>M[10F] = 0</td></tr>
<tr><td>102</td><td><code>LOAD 111</code></td><td>6</td><td>111</td><td>6</td><td>—</td></tr>
<tr><td>103</td><td><code>SKIPCOND 800</code></td><td>6</td><td>800</td><td>6</td><td>— (AC &gt; 0 nên lệnh kế bị bỏ qua)</td></tr>
<tr><td>105</td><td><code>LOAD 10F</code></td><td>0</td><td>10F</td><td>0</td><td>—</td></tr>
<tr><td>106</td><td><code>ADD 110</code></td><td>7</td><td>110</td><td>7</td><td>—</td></tr>
<tr><td>107</td><td><code>STORE 10F</code></td><td>7</td><td>10F</td><td>7</td><td>M[10F] = 7</td></tr>
<tr><td>108</td><td><code>LOAD 111</code></td><td>6</td><td>111</td><td>6</td><td>—</td></tr>
<tr><td>109</td><td><code>SUBT 112</code></td><td>5</td><td>112</td><td>1</td><td>—</td></tr>
<tr><td>10A</td><td><code>STORE 111</code></td><td>5</td><td>111</td><td>5</td><td>M[111] = 5</td></tr>
<tr><td>10B</td><td><code>JUMP 102</code></td><td>5</td><td>102</td><td>5</td><td>—</td></tr>
<tr><td colspan="6">… 48 nhịp nữa: thân vòng lặp chạy thêm năm lượt …</td></tr>
<tr><td>104</td><td><code>JUMP 10C</code></td><td>0</td><td>10C</td><td>0</td><td>—</td></tr>
<tr><td>10C</td><td><code>LOAD 10F</code></td><td>42</td><td>10F</td><td>42</td><td>—</td></tr>
<tr><td>10D</td><td><code>OUTPUT</code></td><td>42</td><td>000</td><td>42</td><td>—</td></tr>
<tr><td>10E</td><td><code>HALT</code></td><td>42</td><td>000</td><td>42</td><td>—</td></tr>
</table>
<p class="dap-an">✅ Kết quả ra <strong>42</strong>, đạt sau <strong>62 nhịp lệnh</strong>. Hai chỗ trong bảng vết đáng dừng lại. (1) Ở PC = 103, lệnh <code>Skipcond 800</code> nhảy thẳng tới <strong>105</strong> chứ không phải 104 — cú bỏ qua hiện ra thành một KHOẢNG TRỐNG trong cột PC, và đó là cách dễ nhất để kiểm một lệnh Skipcond trong buổi lab. (2) MBR luôn mang đúng giá trị vừa đi qua bus: với <code>Load</code> đó là giá trị đọc <em>TỪ</em> bộ nhớ, với <code>Store</code> đó là giá trị ghi <em>VÀO</em> bộ nhớ. Nếu bảng vết bạn tự làm cho thấy MBR không đổi qua một lệnh truy cập bộ nhớ thì bạn đã lần sai.</p>
<p class="nhan">📐 <strong>Bốn bài tập để tự luyện, cả bốn đều đã viết, dịch và chạy trong máy mô phỏng TRƯỚC KHI in ra đây.</strong> Mỗi bài dùng dãy <code>12, 7, 30, 4, 9</code> cất từ địa chỉ 200, trừ bài cuối:</p>
<table>
<tr><th>#</th><th>Đề bài</th><th>Kỹ thuật mấu chốt</th><th>Đáp án đã kiểm</th><th>Số nhịp</th></tr>
<tr><td>1</td><td>Tính tổng một dãy 5 số</td><td><code>LoadI Ptr</code> với con trỏ tăng sau mỗi lượt — định địa chỉ GIÁN TIẾP của MARIE</td><td><strong>62</strong> (12+7+30+4+9)</td><td>73</td></tr>
<tr><td>2</td><td>Tìm số lớn nhất trong 5 số</td><td>Giữ biến <code>Max</code>; lấy hiệu rồi dùng <code>Skipcond 800</code> để thử "lớn hơn"</td><td><strong>30</strong></td><td>59</td></tr>
<tr><td>3</td><td>Đếm xem có bao nhiêu số chẵn</td><td>Không có lệnh chia dư: trừ 2 liên tục tới khi giá trị chạm 0 (chẵn) hoặc âm (lẻ)</td><td><strong>3</strong> (12, 30, 4)</td><td>340</td></tr>
<tr><td>4</td><td>Nhân 7 × 6 mà không có lệnh nhân</td><td>Cộng lặp, đúng chương trình vừa lần vết ở trên</td><td><strong>42</strong></td><td>62</td></tr>
</table>
<p class="nhan">📐 Bài 1 viết đầy đủ, để bạn có một mẫu chạy được làm chỗ dựa cho ba bài kia:</p>
<pre><code>        ORG 100
        Clear
        Store Sum
Loop,   Load  Ctr
        Skipcond 400          / Ctr == 0 ?
        Jump  Body
        Jump  Done
Body,   LoadI Ptr             / AC &lt;- M[M[Ptr]]  : phần tử đang xét
        Add   Sum
        Store Sum
        Load  Ptr
        Add   One
        Store Ptr             / Ptr = Ptr + 1
        Load  Ctr
        Subt  One
        Store Ctr
        Jump  Loop
Done,   Load  Sum
        Output
        Halt
Sum,    DEC 0
Ctr,    DEC 5
Ptr,    HEX 200
One,    DEC 1
        ORG 200
        DEC 12
        DEC 7
        DEC 30
        DEC 4
        DEC 9</code></pre>
<p class="dap-an">✅ Đáp án, mỗi cái đều xác nhận bằng cách CHẠY chương trình chứ không phải bằng suy luận: <strong>62 · 30 · 3 · 42</strong>. Để ý số nhịp của bài 3 — <strong>340 nhịp</strong>, gấp năm lần mọi bài khác, vì kiểm tính chẵn lẻ bằng cách trừ dần thực sự rất đắt trên một cỗ máy không có phép chia. Con số đó là lập luận hay nhất cả môn cho câu hỏi vì sao các tập lệnh thật về sau mọc ra lệnh <code>div</code>: thuật toán không đổi, chỉ tập lệnh đổi, mà chi phí tụt đi cả một bậc độ lớn.</p>
<p class="pitfall">⚠️ Ba cái bẫy ăn thời gian trong lab, cả ba đều đã vấp phải trong lúc viết bốn chương trình này. (1) <strong><code>Skipcond</code> nhận một MÃ HEX, không nhận phép so sánh</strong>: <code>000</code> = bỏ qua nếu AC &lt; 0, <code>400</code> = bỏ qua nếu AC = 0, <code>800</code> = bỏ qua nếu AC &gt; 0. Không có "bỏ qua nếu nhỏ hơn hoặc bằng" — phải ghép từ hai phép thử. (2) <strong>Chỉ có ĐÚNG MỘT thanh ghi tích luỹ.</strong> Mọi giá trị trung gian đều phải cất trả về bộ nhớ trước khi tính giá trị kế tiếp; đó là lý do các vòng lặp ở trên dày đặc cặp <code>Load</code>/<code>Store</code> mà trên x86 chúng chỉ là những thanh ghi vô hình. (3) <strong><code>ORG</code> xuất hiện hai lần KHÔNG dời điểm vào.</strong> Cái <code>ORG</code> ĐẦU TIÊN mới là nơi bắt đầu thực thi; cái <code>ORG 200</code> phía sau chỉ đặt chỗ cho dữ liệu. Một bản đầu của bài 1 đã bắt đầu thực thi <em>NGAY TRÊN VÙNG DỮ LIỆU</em> và quay vô tận — triệu chứng là bảng vết đầy những mã lệnh vô nghĩa, và chỗ sửa nằm ở một dòng trong trình dịch, không nằm trong chương trình.</p>
<p class="meo">💡 Nếp học cho sáu buổi thực hành: với mỗi chương trình bạn viết, hãy làm ba lượt — <em>lần vết trên giấy TRƯỚC</em>, rồi <em>bấm Step trong máy mô phỏng</em>, rồi ĐỐI CHIẾU. Những chỗ bảng vết trên giấy và máy mô phỏng lệch nhau chính xác là những thứ bạn chưa hiểu về chu kỳ nạp–thực thi, và thường chỉ có hai hoặc ba chỗ như vậy.</p>`],
    ]),
  ].join('\n'),
};
