/**
 * PRF192 · Slot 11-12 (deck 'prf6', 65 slide) — phần slide 1→30, học theo từng slide.
 * Chương 7a: Thư viện chuẩn C — stdlib.h (abs, rand/srand), math.h, time.h, ctype.h.
 *
 * Nội dung bám ĐÚNG chữ trích từ .pptx gốc của trường (/tmp/prf192-text/prf6.txt);
 * các slide chỉ có tiêu đề (mã nguồn nằm trong ẢNH) đã đọc thẳng ảnh đã render.
 *
 * MỌI con số in ra trong phần giảng đã kiểm bằng biên dịch thật
 * (Apple clang, cc -Wall -std=c99, macOS arm64):
 *   abs(-12)=12 · labs(-24L)=24 · abs(0)=0
 *   RAND_MAX trên macOS/clang = 2147483647 (Dev-C++/MinGW = 32767) — KHÁC NHAU
 *   Không srand: hai lần chạy ra ĐÚNG một dãy 16807 282475249 1622650073 …
 *   srand(5) hai lần liên tiếp -> 35 45 24 96 56 (giống hệt)
 *   srand(time(NULL)) đặt TRONG vòng lặp -> 34 34 34 34 34 34 34 34 34 34
 *   srand(time(NULL)) đặt MỘT lần        -> 34 0 12 47 88 10 89 55 78 89
 *   6 + rand()%(100+1-6), 200.000 lượt -> min=6 max=100 (đúng hai đầu)
 *   6 + rand()%(100-6),   200.000 lượt -> min=6 max=99  (mất số 100)
 *   math demo slide 15 với x=15.3, y=-2.6: floor 15/-3 · ceil 16/-2 · round 15/-3 ·
 *     trunc 15/-2 · sqrt 3.911521 · pow(x,y) 0.000831 · exp(x) 4412711.892350 ·
 *     log(x) 2.727853 · log(x)/log(2) 3.935460
 *   pow(12.5,3)=1953.125 · log(e)=1 · exp(1)=2.718281828459045 · round(2.5)=3 · round(-2.5)=-3
 *   sqrt(-1.0)=nan · pow(-8, 1.0/3)=nan
 *   time demo slide 18: CLOCKS_PER_SEC=1000000 (Dev-C++=1000) · sizeof(time_t)=8 ·
 *     difftime đo 1 tỉ phép cộng double = 4.000000 s, cộng int = 1.000000 s (chỉ số nguyên giây),
 *     clock() cùng vòng lặp int = 959622 ticks = 0.959622 s (mịn hơn difftime)
 *   ctype: trên macOS mọi is… trả về đúng 1 hoặc 0; tolower('A')=97, toupper('a')=65,
 *     tolower('5')=53, toupper('!')=33 (không đổi) · ' ' và '\t' là blank · '\n' '\r' '\f' '\v'
 *     là space nhưng KHÔNG blank · CHAR_MIN=-128 nên (char)0xE9 = -23 (chỉ số âm, UB)
 *   Exercise 1 chạy thật với 'K' 'q' '7' '@' ' ' — kết quả ghi trong phần Đáp án slide 29
 *
 * ⚠️ LỖI CỦA SLIDE GỐC đã nêu thẳng, không im lặng chép lại và không tự sửa slide:
 *   slide 21, 22, 23, 24, 25 in #include &lt;stdlib.h&gt; thay vì &lt;ctype.h&gt; — dán nguyên văn
 *   vào clang thì "error: call to undeclared library function 'isalpha'", KHÔNG dịch được.
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'prf6';

export default {
  title: '7.0a — Slide by slide: stdlib.h, math.h, time.h and ctype.h (slides 1–30)|||7.0a — Slide bài giảng: stdlib.h, math.h, time.h và ctype.h (slide 1–30)',
  slug: 'prf192-7-0a-slides-thu-vien-chuan',
  type: 'DOCUMENT',
  description: 'Nửa đầu bộ slide Slot 11-12 của PRF192 (slide 1–30): bốn thư viện chuẩn mà người mới học C dùng nhiều nhất — stdlib.h (giá trị tuyệt đối nguyên, số ngẫu nhiên rand/srand), math.h (floor, ceil, round, trunc, sqrt, pow, log, exp), time.h (time_t, clock_t, difftime, đo chi phí thuật toán) và ctype.h với chín hàm phân loại/đổi hoa thường, mỗi hàm một slide kèm bảng vào→ra. Exercise 1 được giải trọn vẹn, và mọi con số in ra đều đã kiểm lại bằng trình biên dịch thật.',
  content: [
    walkHead(D, 1, 30),
    walk(D, [

      [1, 'Libraries (title slide)',
        `<p class="y-chinh">🎯 The cover of Slot 11-12. Everything from here on is about code <em>you do not write</em>: the standard C libraries, already compiled, waiting to be called.</p>
<ul>
<li><strong>What a "library" means in C</strong> — a pair of things: a <em>header file</em> (<code>.h</code>) that tells the compiler what the functions look like, and a <em>binary file</em> that holds the machine code and is glued to your program by the linker. You include the first; the toolchain finds the second.</li>
<li><strong>Why this slot exists at all</strong> — slide 2 says it straight: "Many basic tasks are very hard for programming beginners." Square roots, rounding, random numbers, "is this character a digit" — writing them yourself is a week of bugs; calling them is one line.</li>
<li><strong>The four libraries in this deck</strong> — <code>stdlib.h</code> (general utilities), <code>math.h</code> (real-number maths), <code>time.h</code> (dates, clocks, measuring cost), <code>ctype.h</code> (single-character tests and case conversion). Slides 1–30 cover all four; slides 31–65 move on to input and validation.</li>
<li><strong>You already used one</strong> — <code>stdio.h</code> has been in every program since Slot 01. <code>printf</code> and <code>scanf</code> are library functions exactly like <code>sqrt</code> is; nothing new is being introduced, only more of the same thing.</li>
<li><strong>Exam weight</strong> — the practical exam of PRF192 almost always needs at least one of <code>sqrt</code>, <code>pow</code>, <code>rand</code>, <code>toupper</code> or <code>isdigit</code>. Knowing which header each one lives in is worth marks by itself.</li>
</ul>
<p class="meo">💡 Learn libraries the way you learn a toolbox: not by memorising every tool, but by knowing which drawer to open. "Number-ish → <code>math.h</code>, character-ish → <code>ctype.h</code>, program-ish → <code>stdlib.h</code>, clock-ish → <code>time.h</code>" gets you to the right manual page in two seconds.</p>`,
        `<p class="y-chinh">🎯 Trang bìa Slot 11-12. Từ đây trở đi là chuyện về những đoạn mã <em>bạn không phải viết</em>: các thư viện chuẩn của C, đã biên dịch sẵn, chỉ chờ được gọi.</p>
<ul>
<li><strong>"Thư viện" trong C nghĩa là gì</strong> — một cặp hai thứ: một <em>file tiêu đề</em> (<code>.h</code>) nói cho trình biên dịch biết hàm có hình dạng thế nào, và một <em>file nhị phân</em> chứa mã máy, được trình liên kết (linker) dán vào chương trình của bạn. Bạn <code>#include</code> cái thứ nhất; bộ công cụ tự tìm cái thứ hai.</li>
<li><strong>Vì sao có slot này</strong> — slide 2 nói thẳng: "Nhiều việc rất cơ bản lại rất khó với người mới lập trình". Căn bậc hai, làm tròn, số ngẫu nhiên, "ký tự này có phải chữ số không" — tự viết thì mất một tuần gỡ lỗi; gọi thư viện thì một dòng.</li>
<li><strong>Bốn thư viện trong bộ slide này</strong> — <code>stdlib.h</code> (tiện ích chung), <code>math.h</code> (toán số thực), <code>time.h</code> (ngày giờ, đồng hồ, đo chi phí), <code>ctype.h</code> (kiểm tra và đổi hoa/thường từng ký tự). Slide 1–30 lo cả bốn; slide 31–65 chuyển sang nhập liệu và kiểm tra dữ liệu vào.</li>
<li><strong>Bạn đã dùng một cái rồi</strong> — <code>stdio.h</code> có mặt trong mọi chương trình từ Slot 01. <code>printf</code> và <code>scanf</code> là hàm thư viện y hệt như <code>sqrt</code>; ở đây không có khái niệm nào mới, chỉ là nhiều hơn của cùng một thứ.</li>
<li><strong>Trọng số trong đề thi</strong> — bài thi thực hành PRF192 gần như luôn cần ít nhất một trong <code>sqrt</code>, <code>pow</code>, <code>rand</code>, <code>toupper</code>, <code>isdigit</code>. Riêng việc nhớ mỗi hàm nằm ở header nào đã ăn điểm.</li>
</ul>
<p class="meo">💡 Học thư viện như học một hộp đồ nghề: không phải thuộc lòng từng cái kìm, mà là biết mở ngăn kéo nào. "Dính tới SỐ → <code>math.h</code>, dính tới KÝ TỰ → <code>ctype.h</code>, dính tới CHƯƠNG TRÌNH → <code>stdlib.h</code>, dính tới ĐỒNG HỒ → <code>time.h</code>" là đủ để tới đúng trang tra cứu trong hai giây.</p>`],

      [2, 'Introduction — how a library reaches your program',
        `<p class="y-chinh">🎯 The slide draws the whole build pipeline: <code>Lib.h</code> → <strong>include</strong> → <code>File.c</code> → <strong>compile</strong> → <code>File.obj</code> → <strong>link</strong> (with the library binary code) → <code>File.exe</code>.</p>
<ul>
<li><strong>Two different moments, two different files</strong> — at <em>compile</em> time only the header matters: it supplies the prototype so the compiler can check your call. At <em>link</em> time only the binary matters: it supplies the actual machine code. Mixing these two up is the source of almost every "undefined reference" message you will ever see.</li>
<li><strong>"You may not know their names"</strong> — the slide is honest that the binary files are named by the tool vendor (<code>libm.a</code>, <code>msvcrt.lib</code>, <code>libSystem.dylib</code>…). You normally never type those names; the exception is <code>math.h</code> on Linux, which needs <code>-lm</code> on the command line (slide 12).</li>
<li><strong>Why headers end in <code>.h</code></strong> — pure convention, but a useful one: a <code>.h</code> file holds declarations only (prototypes, macros, type names), never the body of a function. That is why including a header twenty times costs nothing at run time.</li>
<li><strong>What <code>#include</code> literally does</strong> — the preprocessor pastes the entire text of the header into your file at that point, before the compiler ever sees it. Slide 48 of Slot 08-09 proved this with <code>cc -E</code>. There is no magic, only copy-and-paste.</li>
<li><strong>Angle brackets vs quotes</strong> — <code>#include &lt;stdio.h&gt;</code> searches the system directories; <code>#include "mylib.h"</code> searches your project folder first. Use angle brackets for the standard libraries in this chapter, always.</li>
</ul>
<pre><code>#include &lt;stdlib.h&gt;     /* header: cho compiler biet abs() ton tai  */
#include &lt;stdio.h&gt;

int main(void) {
    printf("%d\\n", abs(-7));   /* ma may cua abs() den o buoc LINK */
    return 0;
}</code></pre>
<p class="pitfall">⚠️ Two error messages, two different causes. <em>"implicit declaration of function 'sqrt'"</em> = you forgot the <code>#include</code> (compile stage). <em>"undefined reference to 'sqrt'"</em> = the header was there but the binary was not linked (link stage — on Linux, add <code>-lm</code>). Reading which of the two you got tells you exactly which half of the picture above broke.</p>`,
        `<p class="y-chinh">🎯 Slide vẽ trọn dây chuyền dựng chương trình: <code>Lib.h</code> → <strong>include</strong> → <code>File.c</code> → <strong>compile</strong> → <code>File.obj</code> → <strong>link</strong> (cùng với mã nhị phân của thư viện) → <code>File.exe</code>.</p>
<ul>
<li><strong>Hai thời điểm khác nhau, hai file khác nhau</strong> — lúc <em>biên dịch</em> chỉ header có ý nghĩa: nó cung cấp nguyên mẫu để trình biên dịch kiểm tra lời gọi của bạn. Lúc <em>liên kết</em> chỉ file nhị phân có ý nghĩa: nó cung cấp mã máy thật. Lẫn lộn hai cái này là nguồn gốc của gần như mọi thông báo "undefined reference" bạn sẽ gặp.</li>
<li><strong>"Bạn có thể không biết tên chúng"</strong> — slide nói thật: file nhị phân do nhà cung cấp công cụ đặt tên (<code>libm.a</code>, <code>msvcrt.lib</code>, <code>libSystem.dylib</code>…). Bình thường bạn không bao giờ phải gõ những tên đó; ngoại lệ là <code>math.h</code> trên Linux, cần thêm <code>-lm</code> vào dòng lệnh (xem slide 12).</li>
<li><strong>Vì sao header có đuôi <code>.h</code></strong> — thuần quy ước, nhưng là quy ước có ích: file <code>.h</code> chỉ chứa khai báo (nguyên mẫu, macro, tên kiểu), không bao giờ chứa thân hàm. Nhờ vậy <code>#include</code> hai chục lần cũng không tốn gì lúc chạy.</li>
<li><strong><code>#include</code> thật ra làm gì</strong> — bộ tiền xử lý DÁN NGUYÊN VĂN toàn bộ nội dung header vào đúng chỗ đó trong file của bạn, trước khi trình biên dịch kịp nhìn thấy. Slide 48 của Slot 08-09 đã chứng minh bằng <code>cc -E</code>. Không có phép màu nào, chỉ là chép-dán.</li>
<li><strong>Ngoặc nhọn hay ngoặc kép</strong> — <code>#include &lt;stdio.h&gt;</code> tìm trong thư mục hệ thống; <code>#include "mylib.h"</code> tìm trong thư mục dự án của bạn trước. Với các thư viện chuẩn của chương này thì luôn dùng ngoặc nhọn.</li>
</ul>
<pre><code>#include &lt;stdlib.h&gt;     /* header: cho compiler biet abs() ton tai  */
#include &lt;stdio.h&gt;

int main(void) {
    printf("%d\\n", abs(-7));   /* ma may cua abs() den o buoc LINK */
    return 0;
}</code></pre>
<p class="pitfall">⚠️ Hai thông báo lỗi, hai nguyên nhân khác hẳn. <em>"implicit declaration of function 'sqrt'"</em> = bạn quên <code>#include</code> (giai đoạn biên dịch). <em>"undefined reference to 'sqrt'"</em> = đã có header nhưng chưa liên kết file nhị phân (giai đoạn link — trên Linux thêm <code>-lm</code>). Đọc xem mình dính cái nào là biết ngay nửa nào của bức tranh trên bị hỏng.</p>`],

      [3, 'Objectives',
        `<p class="y-chinh">🎯 The contract for this slot: after it you should be able to <em>use</em> — not recite — four built-in libraries: <code>stdlib.h</code> and <code>math.h</code>, <code>time.h</code>, and <code>ctype.h</code>.</p>
<ul>
<li><strong>Read the verb carefully</strong> — the slide says "be able to <strong>use</strong>". Nobody will ask you to list all 40 functions of <code>math.h</code>. You will be asked to solve a problem in which one of them is obviously the right tool, and to call it correctly.</li>
<li><strong>Objective 1 — <code>stdlib.h</code> + <code>math.h</code>: mathematical functions</strong> — integer absolute value and random numbers live in <code>stdlib</code>; everything that takes or returns a <code>double</code> lives in <code>math</code>. That split trips people up constantly: <code>abs</code> is in <code>stdlib.h</code>, <code>fabs</code> is in <code>math.h</code>.</li>
<li><strong>Objective 2 — <code>time.h</code></strong> — two jobs, not one: telling you what time it is <em>now</em> (to seed a random generator, to stamp a record) and measuring how long a piece of your own code takes (slide 17: "We can use these function to evaluate time cost for an algorithm").</li>
<li><strong>Objective 3 — <code>ctype.h</code></strong> — nine tiny functions, one slide each on slides 20–28. They look trivial, and they are the most-used library in the whole string chapter (Slot 16-18) and in every input-validation loop in Slot 11-12's second half.</li>
<li><strong>What is NOT an objective</strong> — writing your own library, splitting code across several <code>.c</code> files, or understanding how the linker resolves symbols. Those come later; here you are a consumer of libraries, not a producer.</li>
</ul>
<p class="meo">💡 Turn each objective into a one-line self-test you can do before the exam: "given a <code>double</code>, print it rounded down" (<code>floor</code>), "pick a random exam question number from 1 to 40" (<code>rand</code>), "how many seconds did my sort take" (<code>clock</code>), "reject the input if the user typed a letter where a digit belongs" (<code>isdigit</code>). If you can write those four from memory, the slot is done.</p>`,
        `<p class="y-chinh">🎯 Bản hợp đồng của slot này: học xong bạn phải <em>dùng được</em> — chứ không phải đọc thuộc — bốn thư viện có sẵn: <code>stdlib.h</code> và <code>math.h</code>, <code>time.h</code>, và <code>ctype.h</code>.</p>
<ul>
<li><strong>Đọc kỹ động từ</strong> — slide viết "be able to <strong>use</strong>" (dùng được). Không ai bắt bạn liệt kê 40 hàm của <code>math.h</code>. Bạn sẽ được giao một bài toán mà trong đó một hàm nào đó rõ ràng là công cụ đúng, và bạn phải gọi nó cho đúng.</li>
<li><strong>Mục tiêu 1 — <code>stdlib.h</code> + <code>math.h</code>: các hàm toán</strong> — giá trị tuyệt đối của số NGUYÊN và số ngẫu nhiên nằm ở <code>stdlib</code>; mọi thứ nhận hoặc trả <code>double</code> nằm ở <code>math</code>. Chỗ chia này làm người ta nhầm suốt: <code>abs</code> ở <code>stdlib.h</code>, còn <code>fabs</code> ở <code>math.h</code>.</li>
<li><strong>Mục tiêu 2 — <code>time.h</code></strong> — hai việc chứ không phải một: cho biết <em>bây giờ</em> là lúc nào (để gieo hạt cho bộ sinh số ngẫu nhiên, để đóng dấu thời gian một bản ghi) và đo xem một đoạn mã của chính bạn chạy mất bao lâu (slide 17: "Ta có thể dùng các hàm này để đánh giá chi phí thời gian của một thuật toán").</li>
<li><strong>Mục tiêu 3 — <code>ctype.h</code></strong> — chín hàm bé xíu, mỗi hàm một slide ở slide 20–28. Trông tầm thường, nhưng đó là thư viện được dùng nhiều nhất trong cả chương chuỗi (Slot 16-18) và trong mọi vòng lặp kiểm tra dữ liệu nhập ở nửa sau của chính Slot 11-12.</li>
<li><strong>Cái KHÔNG phải mục tiêu</strong> — tự viết thư viện, chia mã ra nhiều file <code>.c</code>, hay hiểu linker phân giải ký hiệu thế nào. Những cái đó để sau; ở đây bạn là người DÙNG thư viện, không phải người làm ra nó.</li>
</ul>
<p class="meo">💡 Biến mỗi mục tiêu thành một câu tự kiểm tra trước khi thi: "cho một <code>double</code>, in ra phần nguyên làm tròn xuống" (<code>floor</code>), "bốc ngẫu nhiên một câu hỏi từ 1 đến 40" (<code>rand</code>), "hàm sắp xếp của tôi chạy mất mấy giây" (<code>clock</code>), "từ chối dữ liệu nếu người dùng gõ chữ vào chỗ đáng lẽ là số" (<code>isdigit</code>). Viết được bốn cái đó không cần nhìn sách là xong slot.</p>`],

      [4, 'Contents — the four standard C libraries',
        `<p class="y-chinh">🎯 The map of slides 1–30: <strong>Standard</strong> (slides 5–11) → <strong>Math</strong> (12–15) → <strong>Time</strong> (16–18) → <strong>Character</strong> (19–28), then an exercise and a summary.</p>
<ul>
<li><strong>Standard, slides 5–11</strong> — only two topics out of a very large header: integer absolute value (<code>abs</code>, <code>labs</code>, <code>llabs</code>) and pseudo-random numbers (<code>rand</code>, <code>srand</code>, <code>RAND_MAX</code>). Five of the seven slides are about randomness, which tells you where the exam questions are.</li>
<li><strong>Math, slides 12–15</strong> — three table slides (<code>fabs</code>; <code>floor</code>/<code>ceil</code>/<code>round</code>/<code>trunc</code>/<code>sqrt</code>; <code>pow</code>/<code>log</code>/<code>exp</code>) and one "write, compile and run this" demo. Everything here is <code>double</code> in, <code>double</code> out.</li>
<li><strong>Time, slides 16–18</strong> — the smallest block: two data types (<code>time_t</code>, <code>clock_t</code>), three functions (<code>time</code>, <code>difftime</code>, <code>clock</code>), one constant (<code>CLOCKS_PER_SEC</code>), and a demo that measures a billion additions.</li>
<li><strong>Character, slides 19–28</strong> — the biggest block: one overview table and then <em>nine</em> slides, one per function. Seven of them answer a yes/no question (<code>is…</code>) and two convert (<code>tolower</code>, <code>toupper</code>).</li>
<li><strong>Why this order</strong> — each block is more useful than the last for the exam. <code>ctype.h</code> comes last and gets the most slides because it is what you will actually reach for when validating input, and because the second half of this same deck (slides 31–65) is entirely about input validation.</li>
</ul>
<table>
<tr><th>Thư viện</th><th>Header</th><th>Slide</th><th>Điển hình</th></tr>
<tr><td>Standard</td><td><code>stdlib.h</code></td><td>5–11</td><td><code>abs</code>, <code>rand</code>, <code>srand</code></td></tr>
<tr><td>Math</td><td><code>math.h</code></td><td>12–15</td><td><code>sqrt</code>, <code>pow</code>, <code>floor</code></td></tr>
<tr><td>Time</td><td><code>time.h</code></td><td>16–18</td><td><code>time</code>, <code>clock</code>, <code>difftime</code></td></tr>
<tr><td>Character</td><td><code>ctype.h</code></td><td>19–28</td><td><code>isdigit</code>, <code>toupper</code></td></tr>
</table>
<p class="meo">💡 Count the slides per topic — it is a free hint about what the lecturer thinks matters. 9 slides for nine <code>ctype</code> functions, 5 for random numbers, 3 for the whole of <code>time.h</code>. Study time should follow that shape.</p>`,
        `<p class="y-chinh">🎯 Bản đồ của slide 1–30: <strong>Standard</strong> (slide 5–11) → <strong>Math</strong> (12–15) → <strong>Time</strong> (16–18) → <strong>Character</strong> (19–28), rồi một bài tập và một slide tổng kết.</p>
<ul>
<li><strong>Standard, slide 5–11</strong> — chỉ hai chủ đề trong một header rất lớn: giá trị tuyệt đối số nguyên (<code>abs</code>, <code>labs</code>, <code>llabs</code>) và số giả ngẫu nhiên (<code>rand</code>, <code>srand</code>, <code>RAND_MAX</code>). Năm trên bảy slide dành cho số ngẫu nhiên — đó là chỉ dấu câu hỏi thi nằm ở đâu.</li>
<li><strong>Math, slide 12–15</strong> — ba slide bảng (<code>fabs</code>; <code>floor</code>/<code>ceil</code>/<code>round</code>/<code>trunc</code>/<code>sqrt</code>; <code>pow</code>/<code>log</code>/<code>exp</code>) và một slide demo "hãy gõ, biên dịch và chạy". Mọi thứ ở đây đều vào <code>double</code>, ra <code>double</code>.</li>
<li><strong>Time, slide 16–18</strong> — khối nhỏ nhất: hai kiểu dữ liệu (<code>time_t</code>, <code>clock_t</code>), ba hàm (<code>time</code>, <code>difftime</code>, <code>clock</code>), một hằng số (<code>CLOCKS_PER_SEC</code>), và một demo đo một tỉ phép cộng.</li>
<li><strong>Character, slide 19–28</strong> — khối lớn nhất: một bảng tổng quan rồi <em>chín</em> slide, mỗi hàm một slide. Bảy hàm trả lời câu hỏi có/không (<code>is…</code>) và hai hàm chuyển đổi (<code>tolower</code>, <code>toupper</code>).</li>
<li><strong>Vì sao xếp theo thứ tự này</strong> — khối sau hữu dụng cho bài thi hơn khối trước. <code>ctype.h</code> đứng cuối và được nhiều slide nhất vì đó chính là thứ bạn sẽ với tay tới khi kiểm tra dữ liệu nhập, và vì nửa sau của chính bộ slide này (slide 31–65) nói hoàn toàn về kiểm tra dữ liệu nhập.</li>
</ul>
<table>
<tr><th>Thư viện</th><th>Header</th><th>Slide</th><th>Hàm điển hình</th></tr>
<tr><td>Standard (chuẩn)</td><td><code>stdlib.h</code></td><td>5–11</td><td><code>abs</code>, <code>rand</code>, <code>srand</code></td></tr>
<tr><td>Math (toán)</td><td><code>math.h</code></td><td>12–15</td><td><code>sqrt</code>, <code>pow</code>, <code>floor</code></td></tr>
<tr><td>Time (thời gian)</td><td><code>time.h</code></td><td>16–18</td><td><code>time</code>, <code>clock</code>, <code>difftime</code></td></tr>
<tr><td>Character (ký tự)</td><td><code>ctype.h</code></td><td>19–28</td><td><code>isdigit</code>, <code>toupper</code></td></tr>
</table>
<p class="meo">💡 Hãy đếm số slide cho từng chủ đề — đó là gợi ý miễn phí về thứ giảng viên cho là quan trọng. 9 slide cho chín hàm <code>ctype</code>, 5 slide cho số ngẫu nhiên, 3 slide cho toàn bộ <code>time.h</code>. Thời gian ôn nên chia theo đúng hình dạng đó.</p>`],

      [5, '1 - Standard Library: integer absolute value',
        `<p class="y-chinh">🎯 <code>&lt;stdlib.h&gt;</code> holds "the more general mathematical calculations", and the first of them is absolute value for <strong>integers</strong>, in three sizes.</p>
<ul>
<li><strong>The table, exactly as printed</strong> — <code>int abs(int);</code>, <code>long labs(long);</code>, <code>long long llabs(long long);</code> — all three "return the absolute value of the argument". One function per integer width, because C cannot overload names the way C++ can.</li>
<li><strong>Pick by the type of the argument, not by its size today</strong> — a value that fits in <code>int</code> now may not next year. If your variable is declared <code>long</code>, call <code>labs</code>; passing a <code>long</code> to <code>abs</code> silently truncates it to <code>int</code> first, and a value like 3 000 000 000 comes back wrong.</li>
<li><strong>What "absolute value" means here</strong> — distance from zero: <code>abs(-12)</code> is 12, <code>abs(12)</code> is 12, <code>abs(0)</code> is 0. In C, <code>abs(x)</code> is exactly what you would otherwise write as <code>(x &lt; 0 ? -x : x)</code>, only shorter and clearer.</li>
<li><strong>The one input it cannot handle</strong> — <code>abs(INT_MIN)</code>, i.e. <code>abs(-2147483648)</code>, is undefined behaviour: the positive counterpart does not fit in an <code>int</code>. This is the classic interview question about <code>abs</code>, and it is real, not a trick.</li>
<li><strong>Do not confuse it with <code>fabs</code></strong> — <code>abs</code> is integer and lives in <code>stdlib.h</code>; <code>fabs</code> is <code>double</code> and lives in <code>math.h</code> (slide 12). Calling <code>abs(-2.7)</code> converts to <code>int</code> first and hands back <strong>2</strong>, losing the fraction without a word of warning.</li>
</ul>
<pre><code>#include &lt;stdlib.h&gt;
#include &lt;stdio.h&gt;
int main(void) {
    printf("%d %d %d\\n", abs(-12), abs(12), abs(0));
    printf("%ld\\n", labs(-3000000000L));
    return 0;
}</code></pre>
<p class="dap-an">✅ Compiled and run: prints <code>12 12 0</code> and <code>3000000000</code>. Also measured: <code>abs(INT_MIN + 1)</code> = <strong>2147483647</strong>, the largest value an <code>int</code> can hold — one step further and the result has nowhere to go.</p>`,
        `<p class="y-chinh">🎯 <code>&lt;stdlib.h&gt;</code> chứa "các phép tính toán học tổng quát hơn", và cái đầu tiên là giá trị tuyệt đối cho số <strong>nguyên</strong>, có ba cỡ.</p>
<ul>
<li><strong>Bảng trên slide, chép đúng</strong> — <code>int abs(int);</code>, <code>long labs(long);</code>, <code>long long llabs(long long);</code> — cả ba đều "trả về giá trị tuyệt đối của đối số". Mỗi bề rộng số nguyên một hàm, vì C không nạp chồng tên hàm được như C++.</li>
<li><strong>Chọn theo KIỂU của đối số, đừng chọn theo giá trị hôm nay</strong> — một giá trị lọt vào <code>int</code> hôm nay có thể sang năm thì không. Biến khai <code>long</code> thì gọi <code>labs</code>; truyền một <code>long</code> vào <code>abs</code> thì nó bị cắt xuống <code>int</code> trước, và một số như 3.000.000.000 sẽ trả về sai.</li>
<li><strong>"Giá trị tuyệt đối" ở đây nghĩa là gì</strong> — khoảng cách tới 0: <code>abs(-12)</code> là 12, <code>abs(12)</code> là 12, <code>abs(0)</code> là 0. Trong C, <code>abs(x)</code> đúng bằng thứ bạn sẽ phải tự viết là <code>(x &lt; 0 ? -x : x)</code>, chỉ ngắn hơn và rõ hơn.</li>
<li><strong>Một dữ liệu vào nó không xử lý nổi</strong> — <code>abs(INT_MIN)</code>, tức <code>abs(-2147483648)</code>, là hành vi không xác định: số dương tương ứng không lọt vào <code>int</code>. Đây là câu hỏi phỏng vấn kinh điển về <code>abs</code>, và nó có thật chứ không phải mẹo vặt.</li>
<li><strong>Đừng lẫn với <code>fabs</code></strong> — <code>abs</code> là số nguyên, ở <code>stdlib.h</code>; <code>fabs</code> là <code>double</code>, ở <code>math.h</code> (slide 12). Gọi <code>abs(-2.7)</code> thì nó ép về <code>int</code> trước rồi trả về <strong>2</strong>, mất phần lẻ mà không hé một lời cảnh báo.</li>
</ul>
<pre><code>#include &lt;stdlib.h&gt;
#include &lt;stdio.h&gt;
int main(void) {
    printf("%d %d %d\\n", abs(-12), abs(12), abs(0));
    printf("%ld\\n", labs(-3000000000L));
    return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch và chạy: in ra <code>12 12 0</code> và <code>3000000000</code>. Đo thêm: <code>abs(INT_MIN + 1)</code> = <strong>2147483647</strong>, đúng bằng giá trị lớn nhất một <code>int</code> chứa được — lùi thêm một bước nữa là kết quả không còn chỗ nào để nằm.</p>`],

      [6, 'Integer absolute value: Example',
        `<p class="y-chinh">🎯 A 14-line program, shown with its console window: it declares <code>int x = -12;</code> and <code>long y = -24L;</code>, then prints both absolute values with the right conversion specifier for each.</p>
<ul>
<li><strong>The two printf lines are the lesson</strong> — <code>printf("|%d| is %d\\n", x, abs(x));</code> and <code>printf("|%ld| is %ld\\n", y, labs(y));</code>. Note <code>%d</code> pairs with <code>int</code>/<code>abs</code>, and <code>%ld</code> pairs with <code>long</code>/<code>labs</code>. Three things must agree: the variable type, the function, and the format specifier.</li>
<li><strong>The <code>L</code> suffix on <code>-24L</code></strong> — it makes the literal a <code>long</code> rather than an <code>int</code>. For a small value like 24 it changes nothing, but it documents intent and it matters the moment the number exceeds 2 147 483 647.</li>
<li><strong>Both headers are needed</strong> — <code>&lt;stdlib.h&gt;</code> for <code>abs</code>/<code>labs</code> and <code>&lt;stdio.h&gt;</code> for <code>printf</code>. The slide includes them in that order; order between two independent standard headers never matters.</li>
<li><strong><code>system("pause")</code> is Windows-only</strong> — it exists purely so the console window does not vanish before you can read it, which is a Dev-C++/Windows problem. On macOS or Linux you run from a terminal and the output stays; delete that line. It also costs a process launch and is considered poor practice outside a classroom.</li>
<li><strong>The vertical bars in the format string</strong> — <code>|%d|</code> just prints literal pipe characters around the number so the output reads like mathematical notation. Nothing in <code>printf</code> treats <code>|</code> specially.</li>
</ul>
<pre><code>#include &lt;stdlib.h&gt;
#include &lt;stdio.h&gt;

int main()
{
    int x = -12;
    long y = -24L;

    printf("|%d| is %d\\n", x, abs(x));
    printf("|%ld| is %ld\\n", y, labs(y));

    return 0;                 /* bo system("pause") khi chay ngoai Windows */
}</code></pre>
<p class="dap-an">✅ Typed in and run with <code>cc -Wall -std=c99</code>. Output, matching the screenshot on the slide character for character:<br><code>|-12| is 12</code><br><code>|-24| is 24</code></p>
<p class="pitfall">⚠️ Swap the specifiers — write <code>%d</code> where <code>%ld</code> belongs — and you do not get a compile error on every compiler, you get a wrong number or garbage at run time. <code>printf</code> cannot see the real types of its arguments; it believes the format string blindly.</p>`,
        `<p class="y-chinh">🎯 Một chương trình 14 dòng, kèm luôn cửa sổ console: khai <code>int x = -12;</code> và <code>long y = -24L;</code>, rồi in cả hai giá trị tuyệt đối với đúng đặc tả chuyển đổi cho từng kiểu.</p>
<ul>
<li><strong>Hai dòng printf mới là bài học</strong> — <code>printf("|%d| is %d\\n", x, abs(x));</code> và <code>printf("|%ld| is %ld\\n", y, labs(y));</code>. Để ý <code>%d</code> đi với <code>int</code>/<code>abs</code>, còn <code>%ld</code> đi với <code>long</code>/<code>labs</code>. Ba thứ phải khớp nhau: kiểu của biến, tên hàm, và đặc tả định dạng.</li>
<li><strong>Hậu tố <code>L</code> trong <code>-24L</code></strong> — nó làm hằng số thành <code>long</code> thay vì <code>int</code>. Với con số nhỏ như 24 thì chẳng đổi gì, nhưng nó ghi rõ ý định và trở nên quan trọng ngay khi số vượt 2.147.483.647.</li>
<li><strong>Cần cả hai header</strong> — <code>&lt;stdlib.h&gt;</code> cho <code>abs</code>/<code>labs</code> và <code>&lt;stdio.h&gt;</code> cho <code>printf</code>. Slide để theo thứ tự đó; thứ tự giữa hai header chuẩn độc lập thì không bao giờ quan trọng.</li>
<li><strong><code>system("pause")</code> chỉ chạy trên Windows</strong> — nó tồn tại thuần tuý để cửa sổ console không biến mất trước khi bạn kịp đọc, một vấn đề của Dev-C++/Windows. Trên macOS hay Linux bạn chạy từ terminal nên kết quả nằm nguyên đó; hãy xoá dòng ấy. Nó cũng tốn một lần khởi tạo tiến trình và bị coi là thói quen xấu ngoài lớp học.</li>
<li><strong>Hai gạch đứng trong chuỗi định dạng</strong> — <code>|%d|</code> chỉ in ra ký tự gạch đứng nguyên văn quanh con số cho giống ký hiệu toán học. Không có gì trong <code>printf</code> coi <code>|</code> là đặc biệt.</li>
</ul>
<pre><code>#include &lt;stdlib.h&gt;
#include &lt;stdio.h&gt;

int main()
{
    int x = -12;
    long y = -24L;

    printf("|%d| is %d\\n", x, abs(x));
    printf("|%ld| is %ld\\n", y, labs(y));

    return 0;                 /* bo system("pause") khi chay ngoai Windows */
}</code></pre>
<p class="dap-an">✅ Đã gõ lại và chạy bằng <code>cc -Wall -std=c99</code>. Kết quả, khớp từng ký tự với ảnh chụp trên slide:<br><code>|-12| is 12</code><br><code>|-24| is 24</code></p>
<p class="pitfall">⚠️ Đổi chỗ hai đặc tả — viết <code>%d</code> vào chỗ đáng lẽ <code>%ld</code> — thì không phải trình biên dịch nào cũng báo lỗi, mà bạn nhận một con số sai hoặc rác lúc chạy. <code>printf</code> không nhìn thấy kiểu thật của đối số; nó tin chuỗi định dạng một cách mù quáng.</p>`],

      [7, 'Random Number — rand() and RAND_MAX',
        `<p class="y-chinh">🎯 <code>int rand(void);</code> "returns a pseudo-random integer in the range 0 to RAND_MAX. RAND_MAX is implementation-dependent but no less than 32767." Example 1 prints ten of them.</p>
<ul>
<li><strong>The word <em>pseudo</em> is the whole slide</strong> — <code>rand</code> is a formula, not a dice. Given a starting number (the <em>seed</em>) it produces a fixed, perfectly predictable sequence. Without <code>srand</code> (slide 10) the seed is always 1, so <strong>every run of your program produces the identical list of "random" numbers</strong>.</li>
<li><strong><code>RAND_MAX</code> is not a fixed number</strong> — the standard only promises at least 32767. Dev-C++/MinGW, the compiler in the screenshot, uses exactly 32767, which is why the slide's outputs stop at five digits. Other toolchains use 2147483647. Never hard-code either value; write <code>RAND_MAX</code>.</li>
<li><strong><code>(void)</code> in the prototype</strong> — <code>rand</code> takes no arguments at all. You call it as <code>rand()</code>, never <code>rand(10)</code>. Any range you want has to be built by you, out of the raw number — that is what slides 8 and 9 do.</li>
<li><strong>Example 1, read carefully</strong> — <code>for (i = 0; i &lt; 10; i++) printf("Random number %d is %d\\n", i+1, rand());</code>. The <code>i+1</code> is only so the human-facing count starts at 1 while the loop counter starts at 0. Each call to <code>rand()</code> advances the generator one step.</li>
<li><strong>Where you will actually use it</strong> — test data, shuffling a quiz, simple games, Monte-Carlo estimates. Where you must <em>not</em>: anything security-related (passwords, tokens). <code>rand</code> is predictable by design.</li>
</ul>
<pre><code>#include &lt;stdlib.h&gt;
#include &lt;stdio.h&gt;

int main()
{
    int i;
    for (i = 0; i &lt; 10 ; i++)
    {
        printf("Random number %d is %d\\n", i+1, rand());
    }
    return 0;
}</code></pre>
<p class="dap-an">✅ Run twice in a row on Apple clang: both runs printed <strong>exactly the same ten numbers</strong> — 16807, 282475249, 1622650073, 984943658, 1144108930, 470211272, 101027544, 1457850878, 1458777923, 2007237709. They differ from the slide's 41, 18467, 6334… because that screenshot came from Dev-C++, whose generator and whose <code>RAND_MAX</code> (32767) are different. Measured here: <code>RAND_MAX = 2147483647</code>. Both behaviours are standard-conforming — <em>the sequence is a property of the implementation, not of C.</em></p>
<p class="pitfall">⚠️ Do not "test" randomness by running the program twice and seeing the same numbers, then concluding your code is broken. That is the correct, documented behaviour of an unseeded <code>rand</code>. The fix is <code>srand</code> on slide 10, not more <code>rand</code> calls.</p>`,
        `<p class="y-chinh">🎯 <code>int rand(void);</code> "trả về một số nguyên GIẢ ngẫu nhiên trong khoảng 0 đến RAND_MAX. RAND_MAX phụ thuộc cài đặt nhưng không nhỏ hơn 32767." Example 1 in ra mười số như thế.</p>
<ul>
<li><strong>Chữ <em>giả</em> (pseudo) chính là toàn bộ slide này</strong> — <code>rand</code> là một công thức, không phải con xúc xắc. Cho trước một số khởi đầu (gọi là <em>hạt giống</em> — seed), nó sinh ra một dãy cố định, đoán trước được hoàn toàn. Không gọi <code>srand</code> (slide 10) thì hạt giống luôn là 1, nên <strong>mỗi lần chạy chương trình bạn nhận đúng một danh sách số "ngẫu nhiên" giống hệt nhau</strong>.</li>
<li><strong><code>RAND_MAX</code> không phải một con số cố định</strong> — chuẩn chỉ hứa ít nhất 32767. Dev-C++/MinGW, tức trình biên dịch trong ảnh chụp, dùng đúng 32767, vì thế các số trên slide chỉ tới năm chữ số. Bộ công cụ khác dùng 2147483647. Đừng bao giờ gõ cứng con số; hãy viết <code>RAND_MAX</code>.</li>
<li><strong><code>(void)</code> trong nguyên mẫu</strong> — <code>rand</code> không nhận đối số nào cả. Bạn gọi <code>rand()</code>, không bao giờ <code>rand(10)</code>. Muốn có khoảng nào thì bạn phải tự dựng lấy từ con số thô — đó đúng là việc của slide 8 và 9.</li>
<li><strong>Đọc kỹ Example 1</strong> — <code>for (i = 0; i &lt; 10; i++) printf("Random number %d is %d\\n", i+1, rand());</code>. Cái <code>i+1</code> chỉ để số thứ tự cho người đọc bắt đầu từ 1 trong khi biến đếm bắt đầu từ 0. Mỗi lời gọi <code>rand()</code> đẩy bộ sinh tiến một bước.</li>
<li><strong>Chỗ bạn thật sự sẽ dùng</strong> — sinh dữ liệu thử, xáo đề trắc nghiệm, trò chơi đơn giản, ước lượng Monte-Carlo. Chỗ <em>không được</em> dùng: bất cứ thứ gì liên quan an toàn (mật khẩu, mã thông báo). <code>rand</code> đoán trước được — đó là bản chất của nó.</li>
</ul>
<pre><code>#include &lt;stdlib.h&gt;
#include &lt;stdio.h&gt;

int main()
{
    int i;
    for (i = 0; i &lt; 10 ; i++)
    {
        printf("Random number %d is %d\\n", i+1, rand());
    }
    return 0;
}</code></pre>
<p class="dap-an">✅ Chạy hai lần liên tiếp trên Apple clang: cả hai lần in ra <strong>y hệt mười số</strong> — 16807, 282475249, 1622650073, 984943658, 1144108930, 470211272, 101027544, 1457850878, 1458777923, 2007237709. Chúng khác dãy 41, 18467, 6334… trên slide vì ảnh đó chụp từ Dev-C++, nơi bộ sinh và <code>RAND_MAX</code> (32767) đều khác. Đo tại chỗ: <code>RAND_MAX = 2147483647</code>. Cả hai đều đúng chuẩn — <em>dãy số là đặc tính của bản cài đặt, không phải của ngôn ngữ C.</em></p>
<p class="pitfall">⚠️ Đừng "kiểm tra tính ngẫu nhiên" bằng cách chạy hai lần, thấy ra cùng dãy số rồi kết luận mã của mình hỏng. Đó chính là hành vi ĐÚNG và có ghi trong tài liệu của <code>rand</code> khi chưa gieo hạt. Thuốc chữa là <code>srand</code> ở slide 10, không phải gọi thêm <code>rand</code>.</p>`],

      [8, 'Random Number: Example 2 — integers in a range',
        `<p class="y-chinh">🎯 The formula you must memorise, boxed in red on the slide: <code>n = a + rand() % (b + 1 - a);</code> gives a random integer from <code>a</code> to <code>b</code> <strong>inclusive</strong> — here 6 to 100.</p>
<ul>
<li><strong>Why <code>%</code> at all</strong> — <code>rand()</code> hands you a number anywhere from 0 to <code>RAND_MAX</code>, which is far too big. <code>rand() % k</code> keeps only the remainder, which is always in 0…k−1. That is a window of exactly <code>k</code> different values.</li>
<li><strong>Why <code>b + 1 - a</code> and not <code>b - a</code></strong> — you want both ends included. From 6 to 100 there are 95 values, and 100 − 6 = 94, one short. The <code>+1</code> is the difference between "100 can come up" and "100 never comes up" — a classic off-by-one that silently biases your whole program.</li>
<li><strong>Why <code>a +</code> at the front</strong> — the remainder starts at 0; adding the lower bound slides the whole window up so it starts at <code>a</code>. Read the formula as "start at <code>a</code>, then jump forward by up to (size−1) steps".</li>
<li><strong>The slide's variables</strong> — <code>int i, n, a = 6, b = 100;</code>. Naming the bounds <code>a</code> and <code>b</code> instead of writing 6 and 100 inside the loop is good practice: change one line and the whole program changes range.</li>
<li><strong>The small print nobody mentions in class</strong> — <code>%</code> makes the low values very slightly more likely, because <code>RAND_MAX + 1</code> is usually not an exact multiple of the range. For a dice game the bias is invisible; for a statistics assignment it is worth knowing it exists.</li>
</ul>
<pre><code>#include &lt;stdlib.h&gt;
#include &lt;stdio.h&gt;

int main()
{
    int i, n, a = 6, b = 100;
    for (i = 0; i &lt; 10 ; i++)
    {
        n = a + rand() % (b + 1 - a);
        printf("Random number %d is %d\\n", i+1, n);
    }
    return 0;
}</code></pre>
<p class="dap-an">✅ Compiled and run. Ten values came out as 93, 70, 14, 99, 91, 38, 85, 74, 14, <strong>100</strong> — all inside 6…100. Then the formula was hammered 200 000 times: <strong>min = 6, max = 100</strong>, both ends reachable. The same loop with the wrong <code>b - a</code> gave <strong>min = 6, max = 99</strong> — the value 100 never appeared once in 200 000 draws, which is exactly how this bug hides in a short test.</p>
<p class="meo">💡 Sanity-check any range formula with the two extremes on paper. If <code>rand()</code> returned 0 you should get <code>a</code>; if it returned the largest useful value you should get <code>b</code>. Two lines of arithmetic, and you never write the off-by-one again.</p>`,
        `<p class="y-chinh">🎯 Công thức phải thuộc lòng, được khoanh đỏ trên slide: <code>n = a + rand() % (b + 1 - a);</code> cho một số nguyên ngẫu nhiên từ <code>a</code> đến <code>b</code> <strong>bao gồm cả hai đầu</strong> — ở đây là 6 đến 100.</p>
<ul>
<li><strong>Vì sao phải có <code>%</code></strong> — <code>rand()</code> đưa cho bạn một số nằm đâu đó từ 0 tới <code>RAND_MAX</code>, quá lớn. <code>rand() % k</code> chỉ giữ lại phần dư, mà phần dư luôn nằm trong 0…k−1. Đó đúng là một cửa sổ gồm <code>k</code> giá trị khác nhau.</li>
<li><strong>Vì sao là <code>b + 1 - a</code> chứ không phải <code>b - a</code></strong> — bạn muốn lấy cả hai đầu. Từ 6 đến 100 có 95 giá trị, mà 100 − 6 = 94, thiếu một. Cái <code>+1</code> chính là khác biệt giữa "100 có thể xuất hiện" và "100 không bao giờ xuất hiện" — một lỗi lệch-một kinh điển, âm thầm làm lệch cả chương trình.</li>
<li><strong>Vì sao có <code>a +</code> ở đầu</strong> — phần dư bắt đầu từ 0; cộng cận dưới vào là trượt cả cửa sổ lên để nó bắt đầu từ <code>a</code>. Hãy đọc công thức là "bắt đầu ở <code>a</code>, rồi nhảy tới trước nhiều nhất (kích thước−1) bước".</li>
<li><strong>Các biến trên slide</strong> — <code>int i, n, a = 6, b = 100;</code>. Đặt tên cận là <code>a</code> và <code>b</code> thay vì gõ thẳng 6 và 100 vào trong vòng lặp là thói quen tốt: sửa một dòng là đổi khoảng cho cả chương trình.</li>
<li><strong>Dòng chữ nhỏ ít ai nói trên lớp</strong> — phép <code>%</code> làm các giá trị nhỏ có xác suất nhỉnh hơn một chút, vì <code>RAND_MAX + 1</code> thường không chia hết cho kích thước khoảng. Với trò chơi xúc xắc thì độ lệch đó vô hình; với bài tập thống kê thì nên biết là nó có tồn tại.</li>
</ul>
<pre><code>#include &lt;stdlib.h&gt;
#include &lt;stdio.h&gt;

int main()
{
    int i, n, a = 6, b = 100;
    for (i = 0; i &lt; 10 ; i++)
    {
        n = a + rand() % (b + 1 - a);
        printf("Random number %d is %d\\n", i+1, n);
    }
    return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch và chạy. Mười giá trị ra là 93, 70, 14, 99, 91, 38, 85, 74, 14, <strong>100</strong> — đều nằm trong 6…100. Sau đó nện công thức 200.000 lượt: <strong>nhỏ nhất = 6, lớn nhất = 100</strong>, chạm được cả hai đầu. Cũng vòng lặp ấy với <code>b - a</code> sai thì cho <strong>nhỏ nhất = 6, lớn nhất = 99</strong> — số 100 không xuất hiện lấy một lần trong 200.000 lượt, đúng kiểu con bug này nấp kỹ trong một phép thử ngắn.</p>
<p class="meo">💡 Hãy tự kiểm mọi công thức khoảng bằng hai giá trị biên trên giấy. Nếu <code>rand()</code> trả 0 thì phải ra <code>a</code>; nếu nó trả giá trị hữu ích lớn nhất thì phải ra <code>b</code>. Hai dòng số học, và bạn không bao giờ viết lệch-một nữa.</p>`],

      [9, 'Random Number: Example 3 — floating-point in a range',
        `<p class="y-chinh">🎯 Real numbers need a different formula, also boxed in red: <code>x = a + ((double) rand() / RAND_MAX * (b - a));</code> gives a <code>double</code> from 3.0 to 100.</p>
<ul>
<li><strong>The cast is not optional</strong> — <code>rand()</code> and <code>RAND_MAX</code> are both <code>int</code>. Without <code>(double)</code>, <code>rand() / RAND_MAX</code> is <em>integer</em> division and is 0 almost every time (and 1 exactly once), so <code>x</code> would always come out as 3.0. This is the same trap as <code>(a+b+c)/3</code> from the functions chapter, in a new costume.</li>
<li><strong>Read the formula in three steps</strong> — <code>(double)rand()/RAND_MAX</code> is a fraction in 0.0…1.0; times <code>(b - a)</code> stretches it to 0.0…97.0; plus <code>a</code> shifts it to 3.0…100.0. Fraction, stretch, shift.</li>
<li><strong>No <code>+1</code> here</strong> — and that is not an inconsistency with slide 8. Integers are counted, so you need <code>+1</code> to include both ends; real numbers are measured, so scaling by <code>(b - a)</code> already reaches exactly <code>b</code> when the fraction hits 1.0. The two formulas are different on purpose.</li>
<li><strong><code>%.2lf</code> in the output</strong> — the slide prints two decimals. The values are full <code>double</code>s underneath; <code>%.2lf</code> only changes what you see, never what is stored. (In <code>printf</code>, <code>%f</code> and <code>%lf</code> are equivalent for <code>double</code>; in <code>scanf</code> they are absolutely not — <code>%f</code> there means <code>float</code>.)</li>
<li><strong>How to get a different granularity</strong> — for money you usually want two decimals exactly: generate an integer number of cents with the slide-8 formula, then divide by 100.0. Do not try to round a random <code>double</code> into place afterwards.</li>
</ul>
<pre><code>#include &lt;stdlib.h&gt;
#include &lt;stdio.h&gt;

int main()
{
    int i;
    double x, a = 3.0, b = 100.0;
    for (i = 0; i &lt; 10 ; i++)
    {
        x = a + ((double) rand() / RAND_MAX * (b - a));
        printf("Random number %d is %.2lf\\n", i+1, x);
    }
    return 0;
}</code></pre>
<p class="dap-an">✅ Compiled and run with <code>srand(1)</code> so the run is reproducible: 3.00, 15.76, 76.29, 47.49, 54.68, 24.24, 7.56, 68.85, 68.89, 93.67 — every value inside 3.0…100.0. Removing the <code>(double)</code> cast was tested too: every single value became <strong>3.00</strong>, because the integer division collapses to 0.</p>
<p class="pitfall">⚠️ <code>(double)(rand() / RAND_MAX)</code> does <em>not</em> fix it — the division already happened inside the parentheses, so you are casting a 0. The cast must touch an <strong>operand</strong>: <code>(double) rand() / RAND_MAX</code>.</p>`,
        `<p class="y-chinh">🎯 Số thực cần một công thức khác, cũng khoanh đỏ: <code>x = a + ((double) rand() / RAND_MAX * (b - a));</code> cho một <code>double</code> từ 3.0 đến 100.</p>
<ul>
<li><strong>Phép ép kiểu không phải tuỳ chọn</strong> — <code>rand()</code> và <code>RAND_MAX</code> đều là <code>int</code>. Không có <code>(double)</code> thì <code>rand() / RAND_MAX</code> là phép chia <em>nguyên</em>, và nó bằng 0 gần như mọi lần (bằng 1 đúng một lần), nên <code>x</code> sẽ luôn ra 3.0. Đây đúng là cái bẫy <code>(a+b+c)/3</code> của chương hàm, chỉ thay bộ áo.</li>
<li><strong>Đọc công thức theo ba bước</strong> — <code>(double)rand()/RAND_MAX</code> là một phân số trong 0,0…1,0; nhân với <code>(b - a)</code> kéo nó ra 0,0…97,0; cộng <code>a</code> dịch nó thành 3,0…100,0. Phân số, kéo giãn, dịch chuyển.</li>
<li><strong>Ở đây KHÔNG có <code>+1</code></strong> — và đó không phải mâu thuẫn với slide 8. Số nguyên thì ĐẾM được, nên cần <code>+1</code> để lấy cả hai đầu; số thực thì ĐO, nên nhân với <code>(b - a)</code> đã chạm đúng <code>b</code> khi phân số bằng 1,0. Hai công thức khác nhau là có chủ ý.</li>
<li><strong><code>%.2lf</code> ở phần in</strong> — slide in hai chữ số thập phân. Bên dưới các giá trị vẫn là <code>double</code> đầy đủ; <code>%.2lf</code> chỉ đổi thứ bạn NHÌN THẤY, không đổi thứ được LƯU. (Trong <code>printf</code>, <code>%f</code> và <code>%lf</code> là như nhau với <code>double</code>; trong <code>scanf</code> thì tuyệt đối không — ở đó <code>%f</code> nghĩa là <code>float</code>.)</li>
<li><strong>Muốn độ mịn khác thì làm sao</strong> — với tiền bạc bạn thường muốn đúng hai chữ số thập phân: hãy sinh một số nguyên đơn vị xu bằng công thức slide 8 rồi chia cho 100.0. Đừng sinh một <code>double</code> ngẫu nhiên rồi làm tròn sau.</li>
</ul>
<pre><code>#include &lt;stdlib.h&gt;
#include &lt;stdio.h&gt;

int main()
{
    int i;
    double x, a = 3.0, b = 100.0;
    for (i = 0; i &lt; 10 ; i++)
    {
        x = a + ((double) rand() / RAND_MAX * (b - a));
        printf("Random number %d is %.2lf\\n", i+1, x);
    }
    return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch và chạy với <code>srand(1)</code> cho lặp lại được: 3,00 · 15,76 · 76,29 · 47,49 · 54,68 · 24,24 · 7,56 · 68,85 · 68,89 · 93,67 — mọi giá trị đều trong 3,0…100,0. Đã thử bỏ luôn <code>(double)</code>: mọi giá trị đều thành <strong>3,00</strong>, vì phép chia nguyên sập về 0.</p>
<p class="pitfall">⚠️ <code>(double)(rand() / RAND_MAX)</code> <em>không</em> cứu được — phép chia đã xảy ra trong ngoặc rồi, bạn đang ép kiểu một số 0. Ép kiểu phải chạm vào một <strong>toán hạng</strong>: <code>(double) rand() / RAND_MAX</code>.</p>`],

      [10, 'Random Number (cont.) — srand() and the seed',
        `<p class="y-chinh">🎯 <code>srand(unsigned seed)</code> "sets the seed for the random number generator", and the slide's Note gives the rule in one sentence: call it <strong>once</strong> with <code>time(NULL)</code>, before the first <code>rand()</code>, typically at the start of your program.</p>
<ul>
<li><strong>What a seed is</strong> — the generator is a chain: each number is computed from the previous one. The seed is link zero. Same seed → same chain, every time, on the same machine. That is why an unseeded program repeats itself: the standard says the default seed is 1.</li>
<li><strong>Why <code>time(NULL)</code></strong> — it returns the number of seconds since 1 January 1970, so it is a different number on every run of a program you launch by hand. It costs you a <code>#include &lt;time.h&gt;</code>, which is why slide 11 has three includes instead of two.</li>
<li><strong>"ONCE" is the exam answer</strong> — put <code>srand(time(NULL))</code> inside the loop and every iteration within the same second re-seeds with the same value, so every number comes out identical. This is the single most common bug with <code>rand</code>, and it looks like the generator is broken.</li>
<li><strong><code>unsigned</code></strong> — the slide defines it: "a type that only holds non-negative integer values". <code>time</code> returns a <code>time_t</code>, which gets converted to <code>unsigned</code> at the call. Some compilers warn about that conversion; it is harmless here.</li>
<li><strong>Repeatability is sometimes what you want</strong> — while debugging, a fixed <code>srand(1)</code> makes a failing case reproducible. Ship with <code>time(NULL)</code>, debug with a constant; knowing you can choose is the real point of this slide.</li>
</ul>
<pre><code>srand(time(NULL));      /* DUNG:  mot lan, truoc moi loi goi rand() */
for (i = 0; i &lt; 10; i++) printf("%d ", rand() % 100);

for (i = 0; i &lt; 10; i++) {
    srand(time(NULL));  /* SAI:  gieo lai trong vong lap */
    printf("%d ", rand() % 100);
}</code></pre>
<p class="dap-an">✅ Both versions above were compiled and run side by side. The correct one printed <strong>34 0 12 47 88 10 89 55 78 89</strong>. The one that re-seeds inside the loop printed <strong>34 34 34 34 34 34 34 34 34 34</strong> — ten copies of the same number, because all ten iterations fell inside the same second. Also verified: <code>srand(5)</code> twice in one program gives the same five numbers both times (35, 45, 24, 96, 56).</p>
<p class="pitfall">⚠️ Two programs started in the same second get the same seed and therefore the same "random" data. Harmless in class; a real defect if you launch many processes at once. <code>time(NULL)</code> is convenient, not unpredictable.</p>`,
        `<p class="y-chinh">🎯 <code>srand(unsigned seed)</code> "đặt hạt giống cho bộ sinh số ngẫu nhiên", và phần Note của slide cho luật gọn trong một câu: gọi nó <strong>một lần</strong> với <code>time(NULL)</code>, trước lời gọi <code>rand()</code> đầu tiên, thường là ở ngay đầu chương trình.</p>
<ul>
<li><strong>Hạt giống là gì</strong> — bộ sinh là một chuỗi mắt xích: mỗi số được tính từ số trước nó. Hạt giống là mắt xích số không. Cùng hạt giống → cùng chuỗi, lần nào cũng thế, trên cùng một máy. Vì vậy chương trình không gieo hạt thì lặp lại chính mình: chuẩn quy định hạt giống mặc định là 1.</li>
<li><strong>Vì sao dùng <code>time(NULL)</code></strong> — nó trả về số giây kể từ 1/1/1970, nên là một số khác nhau ở mỗi lần bạn tự tay chạy chương trình. Cái giá là phải thêm <code>#include &lt;time.h&gt;</code>, và đó là lý do slide 11 có ba dòng include chứ không phải hai.</li>
<li><strong>Chữ "MỘT LẦN" chính là đáp án thi</strong> — đặt <code>srand(time(NULL))</code> vào trong vòng lặp thì mọi vòng chạy trong cùng một giây đều gieo lại đúng giá trị cũ, nên mọi số in ra giống hệt nhau. Đây là lỗi phổ biến nhất khi dùng <code>rand</code>, và nó trông y như bộ sinh bị hỏng.</li>
<li><strong><code>unsigned</code></strong> — slide định nghĩa luôn: "kiểu chỉ chứa giá trị nguyên không âm". <code>time</code> trả về <code>time_t</code>, được chuyển sang <code>unsigned</code> ngay tại lời gọi. Một số trình biên dịch cảnh báo phép chuyển này; ở đây nó vô hại.</li>
<li><strong>Có lúc bạn LẠI MUỐN lặp lại được</strong> — khi gỡ lỗi, một <code>srand(1)</code> cố định làm ca lỗi tái hiện được. Khi phát hành thì dùng <code>time(NULL)</code>, khi gỡ lỗi thì dùng hằng số; biết mình được quyền chọn mới là ý chính của slide này.</li>
</ul>
<pre><code>srand(time(NULL));      /* DUNG:  mot lan, truoc moi loi goi rand() */
for (i = 0; i &lt; 10; i++) printf("%d ", rand() % 100);

for (i = 0; i &lt; 10; i++) {
    srand(time(NULL));  /* SAI:  gieo lai trong vong lap */
    printf("%d ", rand() % 100);
}</code></pre>
<p class="dap-an">✅ Cả hai bản trên đã được biên dịch và chạy cạnh nhau. Bản đúng in ra <strong>34 0 12 47 88 10 89 55 78 89</strong>. Bản gieo lại trong vòng lặp in ra <strong>34 34 34 34 34 34 34 34 34 34</strong> — mười bản sao của cùng một số, vì cả mười vòng đều rơi vào cùng một giây. Kiểm thêm: gọi <code>srand(5)</code> hai lần trong một chương trình thì cả hai lần đều ra đúng năm số 35, 45, 24, 96, 56.</p>
<p class="pitfall">⚠️ Hai chương trình khởi động trong cùng một giây sẽ nhận cùng hạt giống, nên nhận cùng dữ liệu "ngẫu nhiên". Vô hại trong lớp học; là lỗi thật khi bạn bung nhiều tiến trình cùng lúc. <code>time(NULL)</code> là tiện, không phải là khó đoán.</p>`],

      [11, 'Random Number: Example — a different set on every run',
        `<p class="y-chinh">🎯 Everything from slides 7 and 10 assembled into one program: three includes, one <code>srand(time(NULL));</code> above the loop, and ten <code>rand()</code> calls inside it.</p>
<ul>
<li><strong>The third include is the news</strong> — <code>#include &lt;time.h&gt;</code>, annotated on the slide as "prototype for time(NULL)". <code>time</code> does not live in <code>stdlib.h</code>, so without this line the compiler does not know what <code>time</code> is and modern C refuses to build.</li>
<li><strong>Where the seeding line sits</strong> — after <code>int i;</code> and <em>before</em> the <code>for</code>. That position is the whole message of the previous slide, drawn in a red box so you cannot miss it.</li>
<li><strong>The loop is unchanged from Example 1</strong> — which is the point. Seeding changes nothing about how you call <code>rand</code>; it only changes where the chain starts. Compare slide 7 and slide 11 line by line: one added line, completely different behaviour.</li>
<li><strong>What "different set with every run" really means</strong> — different between runs that start in different seconds. Two runs launched within the same second still match, because <code>time(NULL)</code> has one-second resolution (measured on slide 18: <code>difftime</code> only ever reports whole seconds).</li>
<li><strong>Turning this into something useful</strong> — combine with slide 8 and you have a dice: <code>1 + rand() % 6</code>. Combine with a swap and you have a shuffle. Almost every "random" feature in a beginner program is these five lines plus arithmetic.</li>
</ul>
<pre><code>#include &lt;stdlib.h&gt;
#include &lt;stdio.h&gt;
#include &lt;time.h&gt;      /* prototype for time(NULL) */

int main()
{
    int i;

    srand(time(NULL));  /* mot hat giong rieng cho moi lan chay */
    for (i = 0; i &lt; 10 ; i++)
    {
        printf("Random number %d is %d\\n", i+1, rand());
    }
    return 0;
}</code></pre>
<p class="dap-an">✅ Compiled and run. The seed actually used in the measured run was <code>time(NULL) = 1789728199</code>, and consecutive runs produced different lists — confirming the slide's claim. The screenshot's values (6840, 24710, 18358…) are all below 32767 because that run came from Dev-C++; on a toolchain with <code>RAND_MAX = 2147483647</code> the numbers are much larger. Both are correct.</p>
<p class="meo">💡 Want a range and a fresh sequence at the same time? Keep the seeding line here and change only the body: <code>printf("%d\\n", 1 + rand() % 6);</code> rolls a die. Seeding and ranging are two independent decisions — do not fuse them in your head.</p>`,
        `<p class="y-chinh">🎯 Mọi thứ của slide 7 và 10 ráp vào một chương trình: ba dòng include, một <code>srand(time(NULL));</code> đặt trên vòng lặp, và mười lời gọi <code>rand()</code> bên trong.</p>
<ul>
<li><strong>Dòng include thứ ba mới là điểm mới</strong> — <code>#include &lt;time.h&gt;</code>, được chú thích ngay trên slide là "prototype for time(NULL)". <code>time</code> không nằm trong <code>stdlib.h</code>, nên thiếu dòng này thì trình biên dịch không biết <code>time</code> là gì và C hiện đại từ chối dịch.</li>
<li><strong>Dòng gieo hạt nằm ở đâu</strong> — sau <code>int i;</code> và <em>trước</em> <code>for</code>. Vị trí ấy chính là toàn bộ thông điệp của slide trước, được khoanh đỏ để bạn không thể bỏ sót.</li>
<li><strong>Vòng lặp không đổi gì so với Example 1</strong> — và đó mới là điều đáng nói. Gieo hạt không thay đổi cách bạn gọi <code>rand</code>; nó chỉ đổi chỗ chuỗi bắt đầu. So slide 7 và slide 11 từng dòng: thêm đúng một dòng, hành vi khác hẳn.</li>
<li><strong>"Mỗi lần chạy một bộ khác" thật ra nghĩa là gì</strong> — khác giữa những lần chạy rơi vào các GIÂY khác nhau. Hai lần chạy trong cùng một giây vẫn ra giống nhau, vì <code>time(NULL)</code> chỉ mịn tới giây (đã đo ở slide 18: <code>difftime</code> luôn báo số giây nguyên).</li>
<li><strong>Biến nó thành thứ có ích</strong> — ghép với slide 8 là có con xúc xắc: <code>1 + rand() % 6</code>. Ghép với một phép hoán vị là có phép xáo bài. Gần như mọi tính năng "ngẫu nhiên" trong chương trình của người mới học đều là năm dòng này cộng vài phép toán.</li>
</ul>
<pre><code>#include &lt;stdlib.h&gt;
#include &lt;stdio.h&gt;
#include &lt;time.h&gt;      /* prototype for time(NULL) */

int main()
{
    int i;

    srand(time(NULL));  /* mot hat giong rieng cho moi lan chay */
    for (i = 0; i &lt; 10 ; i++)
    {
        printf("Random number %d is %d\\n", i+1, rand());
    }
    return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch và chạy. Hạt giống thật sự dùng trong lần đo là <code>time(NULL) = 1789728199</code>, và các lần chạy liên tiếp cho danh sách khác nhau — đúng như slide khẳng định. Các số trên ảnh chụp (6840, 24710, 18358…) đều nhỏ hơn 32767 vì lần chạy đó ở Dev-C++; trên bộ công cụ có <code>RAND_MAX = 2147483647</code> thì các số lớn hơn nhiều. Cả hai đều đúng.</p>
<p class="meo">💡 Muốn vừa có khoảng vừa có dãy mới mỗi lần chạy? Giữ nguyên dòng gieo hạt ở đây và chỉ đổi thân vòng lặp: <code>printf("%d\\n", 1 + rand() % 6);</code> là gieo xúc xắc. Gieo hạt và giới hạn khoảng là hai quyết định độc lập — đừng dính chúng làm một trong đầu.</p>`],

      [12, 'Math Library — math.h and fabs()',
        `<p class="y-chinh">🎯 A new header and a new rule: "The math library contains many functions that perform mathematical calculations. Their prototypes are listed in <code>&lt;math.h&gt;</code>." The table starts with <code>fabs</code> / <code>fabsf</code>.</p>
<ul>
<li><strong>Every row of this table has the same shape</strong> — a <code>double</code> version with a plain name and a <code>float</code> version with an <code>f</code> suffix: <code>double fabs(double);</code> and <code>float fabsf(float);</code>. That pattern repeats for <code>floor</code>/<code>floorf</code>, <code>sqrt</code>/<code>sqrtf</code>, <code>pow</code>/<code>powf</code> on slides 13–14. Learn the pattern, not the 40 names.</li>
<li><strong>Which version to use</strong> — <code>double</code> unless you have a specific reason. It is the default type of every floating literal in C, it is what <code>printf("%f")</code> expects, and on a modern CPU it is not slower. The <code>f</code> variants exist for memory-constrained code.</li>
<li><strong><code>fabs</code> vs <code>abs</code>, said once more</strong> — the slide's examples are <code>fabs(-12.5) → 12.5</code> and <code>fabsf(-12.5f) → 12.5</code>. Feed −12.5 to <code>abs</code> from <code>stdlib.h</code> instead and you get <strong>12</strong>: it converts to <code>int</code> first. Two headers, two functions, one letter of difference, and a silently wrong answer.</li>
<li><strong>The linking footnote that costs people an hour</strong> — on Linux and many Unix systems <code>math.h</code>'s binary is a separate library, so you must compile with <code>cc bai.c -lm</code>. Forget it and you get "undefined reference to sqrt" even though the <code>#include</code> is right there — a <em>link</em> error, not a compile error (slide 2).</li>
<li><strong>The row of "…" on the slide</strong> — the lecturer is signalling that the table is a sample, not a complete list. <code>math.h</code> also has <code>sin</code>, <code>cos</code>, <code>tan</code>, <code>atan2</code>, <code>fmod</code>, <code>hypot</code> and dozens more; you look them up when you need them.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;math.h&gt;
int main(void) {
    printf("%g %g\\n", fabs(-12.5), (double) fabsf(-12.5f));
    return 0;
}
/* Linux/macOS:  cc bai.c -lm  */</code></pre>
<p class="dap-an">✅ Compiled and run: prints <code>12.5 12.5</code>, matching the slide. Measured detail worth knowing: on this macOS toolchain the program also links <em>without</em> <code>-lm</code>, because the maths code sits inside the system C library there. On Linux/gcc the <code>-lm</code> is genuinely required — so write it always; an extra <code>-lm</code> never hurts.</p>
<p class="meo">💡 Mnemonic for the whole chapter: <strong>f = float/floating</strong>. <code>fabs</code> is "floating abs". <code>fabsf</code> is "floating abs, float version". Once you see the <code>f</code> as a type marker rather than random noise, the 40-name table becomes 20 ideas.</p>`,
        `<p class="y-chinh">🎯 Một header mới và một luật mới: "Thư viện toán chứa nhiều hàm thực hiện các phép tính toán học. Nguyên mẫu của chúng nằm trong <code>&lt;math.h&gt;</code>." Bảng mở đầu bằng <code>fabs</code> / <code>fabsf</code>.</p>
<ul>
<li><strong>Mọi dòng của bảng này đều cùng một hình dạng</strong> — bản <code>double</code> mang tên trơn và bản <code>float</code> mang hậu tố <code>f</code>: <code>double fabs(double);</code> và <code>float fabsf(float);</code>. Khuôn đó lặp lại cho <code>floor</code>/<code>floorf</code>, <code>sqrt</code>/<code>sqrtf</code>, <code>pow</code>/<code>powf</code> ở slide 13–14. Hãy thuộc cái KHUÔN, đừng thuộc 40 cái tên.</li>
<li><strong>Dùng bản nào</strong> — dùng <code>double</code>, trừ khi có lý do cụ thể. Đó là kiểu mặc định của mọi hằng số thực trong C, là thứ <code>printf("%f")</code> chờ đợi, và trên CPU hiện đại nó không chậm hơn. Các biến thể <code>f</code> tồn tại cho mã bị bó hẹp bộ nhớ.</li>
<li><strong><code>fabs</code> và <code>abs</code>, nhắc lại lần nữa</strong> — ví dụ trên slide là <code>fabs(-12.5) → 12.5</code> và <code>fabsf(-12.5f) → 12.5</code>. Đưa −12,5 cho <code>abs</code> của <code>stdlib.h</code> thì nhận được <strong>12</strong>: nó ép về <code>int</code> trước. Hai header, hai hàm, lệch nhau một chữ cái, và một đáp số sai trong im lặng.</li>
<li><strong>Ghi chú về liên kết làm người ta mất cả tiếng</strong> — trên Linux và nhiều hệ Unix, phần nhị phân của <code>math.h</code> là một thư viện riêng, nên phải biên dịch bằng <code>cc bai.c -lm</code>. Quên là nhận "undefined reference to sqrt" dù dòng <code>#include</code> nằm sờ sờ ở đó — lỗi <em>liên kết</em>, không phải lỗi biên dịch (slide 2).</li>
<li><strong>Hàng "…" trên slide</strong> — giảng viên đang ra hiệu rằng bảng này là mẫu chứ không phải danh sách đầy đủ. <code>math.h</code> còn có <code>sin</code>, <code>cos</code>, <code>tan</code>, <code>atan2</code>, <code>fmod</code>, <code>hypot</code> và hàng chục hàm nữa; cần thì tra.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;math.h&gt;
int main(void) {
    printf("%g %g\\n", fabs(-12.5), (double) fabsf(-12.5f));
    return 0;
}
/* Linux/macOS:  cc bai.c -lm  */</code></pre>
<p class="dap-an">✅ Đã biên dịch và chạy: in ra <code>12.5 12.5</code>, khớp slide. Một chi tiết đo được đáng biết: trên bộ công cụ macOS này chương trình liên kết được cả khi <em>không</em> có <code>-lm</code>, vì mã toán nằm ngay trong thư viện C hệ thống ở đó. Trên Linux/gcc thì <code>-lm</code> là bắt buộc thật — nên cứ viết nó vào; thừa một <code>-lm</code> không bao giờ có hại.</p>
<p class="meo">💡 Mẹo nhớ cho cả chương: <strong>f = float / floating (số thực)</strong>. <code>fabs</code> là "abs của số thực". <code>fabsf</code> là "abs của số thực, bản float". Khi đã nhìn chữ <code>f</code> như một dấu hiệu KIỂU chứ không phải tiếng ồn ngẫu nhiên, bảng 40 tên co lại còn 20 ý.</p>`],

      [13, 'Math Library — floor, ceil, round, trunc, sqrt',
        `<p class="y-chinh">🎯 Four different ways to turn a real number into a whole one, plus the square root. They are <em>not</em> interchangeable, and the slide picks its examples precisely to show that.</p>
<ul>
<li><strong><code>floor</code></strong> — "the largest integer value not greater than the argument": always goes <em>down</em>, towards minus infinity. <code>floor(16.3) → 16.0</code>, and <code>floor(-2.6) → -3.0</code>.</li>
<li><strong><code>ceil</code></strong> — "the smallest integer value not less than the argument": always goes <em>up</em>. <code>ceil(16.3) → 17.0</code>. Use it whenever you need "how many whole boxes do I need" — 16.3 boxes means you buy 17.</li>
<li><strong><code>round</code></strong> — "the integer value closest to the argument". The slide shows <code>round(16.3) → 16.0</code> and <code>round(-16.3) → -16.0</code>: it goes to the nearest, so sign does not matter. At exactly .5 C rounds <em>away from zero</em>, which is not the same as the "round half to even" rule used in some spreadsheets.</li>
<li><strong><code>trunc</code></strong> — "the integer part of the argument": simply deletes the fraction. <code>trunc(16.7) → 16.0</code>, <code>trunc(-16.7) → -16.0</code>. This is the one that behaves like the cast <code>(int)</code>. Compare with <code>floor</code>: for positives they agree, for negatives they never do.</li>
<li><strong>They all return <code>double</code>, not <code>int</code></strong> — <code>floor(16.3)</code> is <strong>16.0</strong>, a <code>double</code> that happens to be whole. Print it with <code>%f</code> or <code>%.0f</code>, or cast to <code>int</code> yourself if you need an integer. Printing it with <code>%d</code> gives garbage.</li>
<li><strong><code>sqrt</code></strong> — <code>sqrt(16.0) → 4.0</code>. Negative input is a domain error and yields <code>NaN</code> ("not a number"), it does not crash and it does not warn. Guard with <code>if (x &gt;= 0)</code> before you call it.</li>
</ul>
<table>
<tr><th>x</th><th>floor(x)</th><th>ceil(x)</th><th>round(x)</th><th>trunc(x)</th></tr>
<tr><td>16.3</td><td>16</td><td>17</td><td>16</td><td>16</td></tr>
<tr><td>16.7</td><td>16</td><td>17</td><td>17</td><td>16</td></tr>
<tr><td>−2.6</td><td>−3</td><td>−2</td><td>−3</td><td>−2</td></tr>
<tr><td>2.5</td><td>2</td><td>3</td><td>3</td><td>2</td></tr>
<tr><td>−2.5</td><td>−3</td><td>−2</td><td>−3</td><td>−2</td></tr>
</table>
<p class="dap-an">✅ Every cell of that table was produced by a real program, not by hand: <code>floor(16.3)=16 ceil(16.3)=17 round(16.3)=16 round(-16.3)=-16 trunc(16.7)=16 trunc(-16.7)=-16 sqrt(16.0)=4</code>, plus <code>round(2.5)=3</code>, <code>round(-2.5)=-3</code>, <code>floor(-2.6)=-3</code> against <code>trunc(-2.6)=-2</code>, and <code>sqrt(-1.0)=nan</code>. The slide's four example values all check out.</p>
<p class="meo">💡 The negative row is the exam question. <code>floor(-2.6)</code> and <code>trunc(-2.6)</code> differ by a whole unit, and <code>(int)(-2.6)</code> behaves like <code>trunc</code>, not like <code>floor</code>. If a calculation with negative numbers is one off, this is the first place to look.</p>`,
        `<p class="y-chinh">🎯 Bốn cách khác nhau để biến số thực thành số nguyên, cộng thêm căn bậc hai. Chúng <em>không</em> thay thế nhau được, và slide chọn ví dụ đúng chỗ để lộ ra điều đó.</p>
<ul>
<li><strong><code>floor</code></strong> — "số nguyên lớn nhất không lớn hơn đối số": luôn đi <em>xuống</em>, về phía âm vô cùng. <code>floor(16.3) → 16.0</code>, và <code>floor(-2.6) → -3.0</code>.</li>
<li><strong><code>ceil</code></strong> — "số nguyên nhỏ nhất không nhỏ hơn đối số": luôn đi <em>lên</em>. <code>ceil(16.3) → 17.0</code>. Dùng nó mỗi khi cần "phải mua bao nhiêu thùng nguyên" — 16,3 thùng nghĩa là mua 17.</li>
<li><strong><code>round</code></strong> — "số nguyên gần đối số nhất". Slide đưa <code>round(16.3) → 16.0</code> và <code>round(-16.3) → -16.0</code>: nó về cái gần nhất nên dấu không quan trọng. Đúng tại mức .5 thì C làm tròn <em>ra xa số 0</em>, khác luật "làm tròn về số chẵn" mà vài phần mềm bảng tính dùng.</li>
<li><strong><code>trunc</code></strong> — "phần nguyên của đối số": đơn giản là xoá phần lẻ. <code>trunc(16.7) → 16.0</code>, <code>trunc(-16.7) → -16.0</code>. Đây mới là hàm hành xử giống phép ép kiểu <code>(int)</code>. So với <code>floor</code>: với số dương chúng trùng nhau, với số âm thì không bao giờ trùng.</li>
<li><strong>Tất cả đều trả <code>double</code>, không phải <code>int</code></strong> — <code>floor(16.3)</code> là <strong>16.0</strong>, một <code>double</code> tình cờ tròn. In bằng <code>%f</code> hoặc <code>%.0f</code>, hoặc tự ép sang <code>int</code> nếu cần số nguyên. In bằng <code>%d</code> thì ra rác.</li>
<li><strong><code>sqrt</code></strong> — <code>sqrt(16.0) → 4.0</code>. Đối số âm là lỗi miền xác định và cho ra <code>NaN</code> ("không phải một số"), nó không sập và cũng không cảnh báo. Hãy chặn bằng <code>if (x &gt;= 0)</code> trước khi gọi.</li>
</ul>
<table>
<tr><th>x</th><th>floor(x)</th><th>ceil(x)</th><th>round(x)</th><th>trunc(x)</th></tr>
<tr><td>16,3</td><td>16</td><td>17</td><td>16</td><td>16</td></tr>
<tr><td>16,7</td><td>16</td><td>17</td><td>17</td><td>16</td></tr>
<tr><td>−2,6</td><td>−3</td><td>−2</td><td>−3</td><td>−2</td></tr>
<tr><td>2,5</td><td>2</td><td>3</td><td>3</td><td>2</td></tr>
<tr><td>−2,5</td><td>−3</td><td>−2</td><td>−3</td><td>−2</td></tr>
</table>
<p class="dap-an">✅ Từng ô của bảng trên do một chương trình thật in ra chứ không phải tính nhẩm: <code>floor(16.3)=16 ceil(16.3)=17 round(16.3)=16 round(-16.3)=-16 trunc(16.7)=16 trunc(-16.7)=-16 sqrt(16.0)=4</code>, cộng thêm <code>round(2.5)=3</code>, <code>round(-2.5)=-3</code>, <code>floor(-2.6)=-3</code> đối chọi <code>trunc(-2.6)=-2</code>, và <code>sqrt(-1.0)=nan</code>. Bốn giá trị ví dụ trên slide đều đúng.</p>
<p class="meo">💡 Hàng số âm mới là câu hỏi thi. <code>floor(-2.6)</code> và <code>trunc(-2.6)</code> lệch nhau nguyên một đơn vị, và <code>(int)(-2.6)</code> hành xử giống <code>trunc</code> chứ không giống <code>floor</code>. Nếu một phép tính có số âm bị lệch một đơn vị thì đây là chỗ cần soi đầu tiên.</p>`],

      [14, 'Math Library — pow, log, exp',
        `<p class="y-chinh">🎯 Three functions that deal with powers and logarithms: <code>pow(base, exponent)</code>, <code>log</code> (natural logarithm) and <code>exp</code> (natural anti-logarithm). All three take and return <code>double</code>.</p>
<ul>
<li><strong><code>double pow(double base, double exponent);</code></strong> — the only two-argument function in this block, and the order matters: <code>pow(12.5, 3)</code> is 12.5³ = <strong>1953.125</strong>, not 3 to the power 12.5. The slide's example is exactly this.</li>
<li><strong>C has no <code>^</code> operator for powers</strong> — this is the single most common beginner mistake in the whole chapter. Writing <code>x ^ y</code> compiles happily and computes a bitwise exclusive-OR on integers, producing a plausible-looking wrong number. Powers are <em>always</em> <code>pow</code>.</li>
<li><strong>Do not use <code>pow</code> for squares</strong> — <code>x * x</code> is faster, exact, and shorter than <code>pow(x, 2)</code>, which converts to <code>double</code>, calls a library routine and can return 8.999999999 where you expected 9. Reserve <code>pow</code> for genuinely variable exponents.</li>
<li><strong><code>log</code> is base <em>e</em>, not base 10</strong> — the slide states it: "return the natural logarithm", with <code>log(2.718281828459045) → 1.0</code>. Base 10 is <code>log10</code>; base 2 you build yourself as <code>log(x)/log(2)</code>, which is exactly what the demo on slide 15 does.</li>
<li><strong><code>exp</code> undoes <code>log</code></strong> — "the natural anti-logarithm", <code>exp(1.0) → 2.718281828459045</code>. The pair is used for compound growth, half-lives, and for computing <code>a</code> to the power <code>b</code> as <code>exp(b * log(a))</code> when you want to understand what <code>pow</code> is doing internally.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;math.h&gt;
int main(void) {
    printf("pow(12.5,3) = %g\\n", pow(12.5, 3.0));
    printf("log(e)      = %g\\n", log(2.718281828459045));
    printf("exp(1.0)    = %.15f\\n", exp(1.0));
    printf("log2(8)     = %g\\n", log(8.0) / log(2.0));
    return 0;
}</code></pre>
<p class="dap-an">✅ Compiled with <code>cc -Wall -std=c99 … -lm</code> and run: <code>pow(12.5,3) = 1953.125</code> (the slide writes 1953.125 — correct), <code>log(e) = 1</code>, <code>exp(1.0) = 2.718281828459045</code> to fifteen decimals, and <code>log2(8) = 3</code>. All three slide examples verified exactly.</p>
<p class="pitfall">⚠️ <code>log(0)</code> is <code>-inf</code> and <code>log(</code>negative<code>)</code> is <code>NaN</code>; <code>pow</code> with a negative base and a fractional exponent is also <code>NaN</code> — measured: <code>pow(-8, 1.0/3)</code> gives <strong>nan</strong>, not −2. None of these stop the program, so a <code>NaN</code> quietly poisons every later calculation. Validate the input before you call, not after.</p>`,
        `<p class="y-chinh">🎯 Ba hàm về luỹ thừa và logarit: <code>pow(cơ số, số mũ)</code>, <code>log</code> (logarit tự nhiên) và <code>exp</code> (đối logarit tự nhiên). Cả ba đều nhận và trả <code>double</code>.</p>
<ul>
<li><strong><code>double pow(double base, double exponent);</code></strong> — hàm hai đối số duy nhất trong khối này, và thứ tự có ý nghĩa: <code>pow(12.5, 3)</code> là 12,5³ = <strong>1953,125</strong>, chứ không phải 3 mũ 12,5. Ví dụ trên slide đúng là như vậy.</li>
<li><strong>C KHÔNG có toán tử <code>^</code> để lấy luỹ thừa</strong> — đây là lỗi phổ biến nhất của người mới trong cả chương. Viết <code>x ^ y</code> thì dịch trót lọt và tính phép XOR theo bit trên số nguyên, cho ra một con số sai nhưng trông rất hợp lý. Luỹ thừa thì <em>luôn luôn</em> là <code>pow</code>.</li>
<li><strong>Đừng dùng <code>pow</code> để bình phương</strong> — <code>x * x</code> nhanh hơn, chính xác tuyệt đối, và ngắn hơn <code>pow(x, 2)</code>, thứ phải ép sang <code>double</code>, gọi một thủ tục thư viện và có thể trả 8,999999999 ở chỗ bạn chờ 9. Hãy để dành <code>pow</code> cho những số mũ thật sự thay đổi.</li>
<li><strong><code>log</code> là cơ số <em>e</em>, không phải cơ số 10</strong> — slide ghi rõ: "trả về logarit tự nhiên", với <code>log(2.718281828459045) → 1.0</code>. Cơ số 10 là <code>log10</code>; cơ số 2 thì bạn tự dựng bằng <code>log(x)/log(2)</code>, và đó đúng là việc demo ở slide 15 làm.</li>
<li><strong><code>exp</code> là phép ngược của <code>log</code></strong> — "đối logarit tự nhiên", <code>exp(1.0) → 2.718281828459045</code>. Cặp này dùng cho tăng trưởng kép, chu kỳ bán rã, và để tính <code>a</code> mũ <code>b</code> bằng <code>exp(b * log(a))</code> khi bạn muốn hiểu <code>pow</code> làm gì bên trong.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;math.h&gt;
int main(void) {
    printf("pow(12.5,3) = %g\\n", pow(12.5, 3.0));
    printf("log(e)      = %g\\n", log(2.718281828459045));
    printf("exp(1.0)    = %.15f\\n", exp(1.0));
    printf("log2(8)     = %g\\n", log(8.0) / log(2.0));
    return 0;
}</code></pre>
<p class="dap-an">✅ Biên dịch bằng <code>cc -Wall -std=c99 … -lm</code> rồi chạy: <code>pow(12.5,3) = 1953.125</code> (slide ghi 1953.125 — đúng), <code>log(e) = 1</code>, <code>exp(1.0) = 2.718281828459045</code> tới mười lăm chữ số thập phân, và <code>log2(8) = 3</code>. Cả ba ví dụ trên slide đều kiểm đúng.</p>
<p class="pitfall">⚠️ <code>log(0)</code> là <code>-inf</code> còn <code>log(</code>số âm<code>)</code> là <code>NaN</code>; <code>pow</code> với cơ số âm và số mũ lẻ phân số cũng là <code>NaN</code> — đo thật: <code>pow(-8, 1.0/3)</code> ra <strong>nan</strong> chứ không ra −2. Không cái nào trong số đó làm chương trình dừng, nên một <code>NaN</code> sẽ âm thầm đầu độc mọi phép tính phía sau. Hãy kiểm dữ liệu vào TRƯỚC khi gọi, đừng kiểm sau.</p>`],

      [15, 'Math Library: Demo — write, compile and run this program',
        `<p class="y-chinh">🎯 A 21-line program that exercises nine <code>math.h</code> functions on two fixed values, <code>x = 15.3</code> and <code>y = -2.6</code>. The yellow box says it all: <em>write, compile and run this program</em> — do not just read it.</p>
<ul>
<li><strong>Why <code>y</code> is negative</strong> — deliberately. The four rounding functions all agree on 15.3 and all disagree on −2.6, so a single run shows you the whole distinction from slide 13 in one screen.</li>
<li><strong><code>%lf</code> in <code>printf</code></strong> — the demo uses <code>%lf</code> throughout. For <code>printf</code> this is identical to <code>%f</code>; both print a <code>double</code> with six decimals. (In <code>scanf</code> the two are completely different, so do not carry the habit across.)</li>
<li><strong>Line 17 is a trick worth stealing</strong> — <code>log(x)/log(2)</code> is how you compute a base-2 logarithm when the library only gives you a natural one. The change-of-base identity works for any base: <code>log(x)/log(b)</code>.</li>
<li><strong>The includes</strong> — <code>stdio.h</code> for <code>printf</code>, <code>math.h</code> for the maths, <code>stdlib.h</code> only because of the Windows-only <code>system("pause")</code> on line 19. Drop that line and you can drop <code>stdlib.h</code> with it.</li>
<li><strong>Do the arithmetic yourself first</strong> — before running it, write down what you expect for each of the nine lines. Then run it. Every line where you were wrong is a line you actually learned something from; the ones you got right cost you nothing.</li>
</ul>
<p class="dap-an">✅ Typed in exactly as on the slide (minus <code>system("pause")</code>), compiled with <code>cc -Wall -std=c99 math_demo.c -o math_demo -lm</code> and run. Real output:</p>
<table>
<tr><th>Dòng lệnh</th><th>Kết quả thật</th></tr>
<tr><td><code>floor(x), floor(y)</code></td><td>15.000000, −3.000000</td></tr>
<tr><td><code>ceil(x), ceil(y)</code></td><td>16.000000, −2.000000</td></tr>
<tr><td><code>round(x), round(y)</code></td><td>15.000000, −3.000000</td></tr>
<tr><td><code>trunc(x), trunc(y)</code></td><td>15.000000, −2.000000</td></tr>
<tr><td><code>sqrt(x)</code></td><td>3.911521</td></tr>
<tr><td><code>pow(x, y)</code></td><td>0.000831</td></tr>
<tr><td><code>exp(x)</code></td><td>4412711.892350</td></tr>
<tr><td><code>log(x)</code></td><td>2.727853</td></tr>
<tr><td><code>log(x)/log(2)</code></td><td>3.935460</td></tr>
</table>
<p class="meo">💡 Look at the <code>y</code> column: <code>floor</code> and <code>round</code> both gave −3, while <code>ceil</code> and <code>trunc</code> both gave −2 — but for completely different reasons. <code>floor</code> goes down, <code>round</code> goes to the nearest (which happens to be down for −2.6); <code>ceil</code> goes up, <code>trunc</code> chops (which happens to be up for a negative). Same answer, different rule — change <code>y</code> to −2.4 and the pairs regroup.</p>`,
        `<p class="y-chinh">🎯 Một chương trình 21 dòng thử chín hàm <code>math.h</code> trên hai giá trị cố định, <code>x = 15.3</code> và <code>y = -2.6</code>. Khung vàng nói hết ý: <em>hãy viết, biên dịch và chạy chương trình này</em> — đừng chỉ đọc.</p>
<ul>
<li><strong>Vì sao <code>y</code> âm</strong> — cố tình. Bốn hàm làm tròn đều nhất trí ở 15,3 và đều bất đồng ở −2,6, nên chỉ một lần chạy là thấy trọn vẹn sự phân biệt của slide 13 trên cùng một màn hình.</li>
<li><strong><code>%lf</code> trong <code>printf</code></strong> — demo dùng <code>%lf</code> xuyên suốt. Với <code>printf</code> nó y hệt <code>%f</code>; cả hai in một <code>double</code> với sáu chữ số thập phân. (Trong <code>scanf</code> thì hai cái khác hẳn nhau, nên đừng mang thói quen này sang.)</li>
<li><strong>Dòng 17 là mẹo đáng ăn cắp</strong> — <code>log(x)/log(2)</code> là cách tính logarit cơ số 2 khi thư viện chỉ cho bạn logarit tự nhiên. Công thức đổi cơ số đúng cho mọi cơ số: <code>log(x)/log(b)</code>.</li>
<li><strong>Các dòng include</strong> — <code>stdio.h</code> cho <code>printf</code>, <code>math.h</code> cho phần toán, <code>stdlib.h</code> chỉ vì dòng <code>system("pause")</code> chạy được trên Windows ở dòng 19. Bỏ dòng ấy đi là bỏ luôn được <code>stdlib.h</code>.</li>
<li><strong>Hãy tự tính trước</strong> — trước khi chạy, ghi ra giấy bạn chờ đợi kết quả nào cho từng dòng trong chín dòng. Rồi mới chạy. Mỗi dòng bạn đoán sai là một dòng bạn thật sự học được điều gì đó; những dòng đoán đúng thì chẳng tốn gì.</li>
</ul>
<p class="dap-an">✅ Đã gõ đúng như trên slide (trừ <code>system("pause")</code>), biên dịch bằng <code>cc -Wall -std=c99 math_demo.c -o math_demo -lm</code> rồi chạy. Kết quả thật:</p>
<table>
<tr><th>Dòng lệnh</th><th>Kết quả thật</th></tr>
<tr><td><code>floor(x), floor(y)</code></td><td>15.000000, −3.000000</td></tr>
<tr><td><code>ceil(x), ceil(y)</code></td><td>16.000000, −2.000000</td></tr>
<tr><td><code>round(x), round(y)</code></td><td>15.000000, −3.000000</td></tr>
<tr><td><code>trunc(x), trunc(y)</code></td><td>15.000000, −2.000000</td></tr>
<tr><td><code>sqrt(x)</code></td><td>3.911521</td></tr>
<tr><td><code>pow(x, y)</code></td><td>0.000831</td></tr>
<tr><td><code>exp(x)</code></td><td>4412711.892350</td></tr>
<tr><td><code>log(x)</code></td><td>2.727853</td></tr>
<tr><td><code>log(x)/log(2)</code></td><td>3.935460</td></tr>
</table>
<p class="meo">💡 Nhìn cột <code>y</code>: <code>floor</code> và <code>round</code> cùng cho −3, còn <code>ceil</code> và <code>trunc</code> cùng cho −2 — nhưng vì những lý do hoàn toàn khác nhau. <code>floor</code> đi xuống, <code>round</code> về cái gần nhất (mà với −2,6 thì tình cờ là xuống); <code>ceil</code> đi lên, <code>trunc</code> chặt đuôi (mà với số âm thì tình cờ là lên). Cùng đáp số, khác quy tắc — đổi <code>y</code> thành −2,4 là các cặp đổi phe ngay.</p>`],

      [16, '2 - Time Library: time.h — the two data types',
        `<p class="y-chinh">🎯 Time inside a computer is just a number. <code>time.h</code> gives that number two names — <code>time_t</code> for calendar time and <code>clock_t</code> for processor ticks — and one constant, <code>CLOCKS_PER_SEC</code>.</p>
<ul>
<li><strong>"Date and time information is presented using an integral number"</strong> — usually the count of seconds since 1 January 1970 (the "epoch"). A date is not stored as "18/09/2026"; it is stored as a big integer, and a library function formats it when a human needs to read it.</li>
<li><strong><code>time_t</code></strong> — the type for calendar time. The slide notes that in Dev-C++ it is <code>typedef long time_t;</code>. It is a <em>typedef</em>, an alias: you use the name <code>time_t</code> and let the platform decide the real width. That is precisely why you must not assume it is a <code>long</code>.</li>
<li><strong><code>clock_t</code></strong> — the type for processor time, measured in <em>clock ticks</em>. "A clock tick is the unit by which processor time is measured and is returned by <code>clock</code>." It is not wall-clock time; it is how much CPU your process actually burned.</li>
<li><strong><code>CLOCKS_PER_SEC</code></strong> — the conversion factor from ticks to seconds. The slide says Dev-C++ defines it as 1000, so one tick = 1 millisecond. <em>Other platforms use other values</em>, which is why you must always divide by the constant instead of by a hard-coded number.</li>
<li><strong>Why two clocks at all</strong> — <code>time_t</code> answers "what time is it in the world", which is what you want for timestamps and for seeding <code>srand</code>. <code>clock_t</code> answers "how much work has my program done", which is what you want when measuring an algorithm and do not care that the user went for coffee in the middle.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;time.h&gt;
int main(void) {
    printf("CLOCKS_PER_SEC = %ld\\n", (long) CLOCKS_PER_SEC);
    printf("sizeof(time_t) = %zu bytes\\n", sizeof(time_t));
    printf("now = %ld\\n", (long) time(NULL));
    return 0;
}</code></pre>
<p class="dap-an">✅ Compiled and run on macOS/clang: <code>CLOCKS_PER_SEC = 1000000</code> — one tick is a <strong>microsecond</strong> here, a thousand times finer than the 1000 the slide quotes for Dev-C++. <code>sizeof(time_t) = 8</code> and <code>sizeof(clock_t) = 8</code> (not 4, so "long" in the slide's note is Dev-C++-specific too). The slide is right about Dev-C++ and wrong as a general statement — <em>always print the constant instead of trusting a remembered value.</em></p>
<p class="meo">💡 The 32-bit <code>time_t</code> is the famous "Year 2038 problem": a signed 32-bit second counter overflows on 19 January 2038. Measuring 8 bytes above means this machine is safe. It is a real, dated deadline, and it is the best possible argument for using the <code>time_t</code> alias instead of writing <code>long</code> yourself.</p>`,
        `<p class="y-chinh">🎯 Thời gian trong máy tính chỉ là một con số. <code>time.h</code> đặt cho con số ấy hai cái tên — <code>time_t</code> cho thời gian lịch và <code>clock_t</code> cho nhịp đồng hồ bộ xử lý — cùng một hằng số, <code>CLOCKS_PER_SEC</code>.</p>
<ul>
<li><strong>"Thông tin ngày giờ được biểu diễn bằng một số nguyên"</strong> — thường là số giây tính từ 1/1/1970 (gọi là "epoch"). Một ngày tháng không được lưu dạng "18/09/2026"; nó được lưu dạng một số nguyên lớn, và một hàm thư viện định dạng lại khi con người cần đọc.</li>
<li><strong><code>time_t</code></strong> — kiểu cho thời gian lịch. Slide ghi chú rằng trong Dev-C++ nó là <code>typedef long time_t;</code>. Đó là một <em>typedef</em>, tức bí danh: bạn dùng cái tên <code>time_t</code> và để nền tảng tự quyết bề rộng thật. Chính vì vậy mà bạn không được giả định nó là <code>long</code>.</li>
<li><strong><code>clock_t</code></strong> — kiểu cho thời gian bộ xử lý, đo bằng <em>nhịp đồng hồ</em> (clock tick). "Nhịp đồng hồ là đơn vị đo thời gian bộ xử lý và được hàm <code>clock</code> trả về." Đó không phải thời gian treo tường; đó là lượng CPU mà tiến trình của bạn thật sự đốt.</li>
<li><strong><code>CLOCKS_PER_SEC</code></strong> — hệ số đổi từ nhịp sang giây. Slide nói Dev-C++ định nghĩa nó bằng 1000, tức một nhịp = 1 mili giây. <em>Nền tảng khác dùng giá trị khác</em>, và đó là lý do luôn phải chia cho HẰNG SỐ chứ không chia cho một con số gõ cứng.</li>
<li><strong>Vì sao lại cần tới hai cái đồng hồ</strong> — <code>time_t</code> trả lời "bây giờ là mấy giờ ngoài đời", thứ bạn cần cho dấu thời gian và cho việc gieo hạt <code>srand</code>. <code>clock_t</code> trả lời "chương trình của tôi đã làm bao nhiêu việc", thứ bạn cần khi đo một thuật toán và không quan tâm giữa chừng người dùng có đi pha cà phê hay không.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;time.h&gt;
int main(void) {
    printf("CLOCKS_PER_SEC = %ld\\n", (long) CLOCKS_PER_SEC);
    printf("sizeof(time_t) = %zu bytes\\n", sizeof(time_t));
    printf("now = %ld\\n", (long) time(NULL));
    return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch và chạy trên macOS/clang: <code>CLOCKS_PER_SEC = 1000000</code> — ở đây một nhịp là một <strong>micro giây</strong>, mịn gấp một nghìn lần con số 1000 mà slide dẫn cho Dev-C++. <code>sizeof(time_t) = 8</code> và <code>sizeof(clock_t) = 8</code> (không phải 4, nên chữ "long" trong ghi chú của slide cũng chỉ đúng với Dev-C++). Slide đúng về Dev-C++ và sai nếu hiểu thành phát biểu chung — <em>hãy luôn in hằng số ra thay vì tin vào con số nhớ được.</em></p>
<p class="meo">💡 <code>time_t</code> 32 bit chính là "sự cố năm 2038" nổi tiếng: bộ đếm giây 32 bit có dấu sẽ tràn vào ngày 19/01/2038. Đo được 8 byte ở trên nghĩa là máy này an toàn. Đó là một hạn chót có thật, có ngày tháng hẳn hoi, và là lý lẽ tốt nhất cho việc dùng bí danh <code>time_t</code> thay vì tự gõ <code>long</code>.</p>`],

      [17, 'Time Library: time.h (cont.) — the three functions',
        `<p class="y-chinh">🎯 Three prototypes and one promise: with these you "can use these function to evaluate <strong>time cost for an algorithm</strong>" — the real reason <code>time.h</code> appears in a programming-fundamentals course.</p>
<ul>
<li><strong><code>time_t time(time_t *tptr);</code></strong> — "returns the current calendar time and this time is stored in its parameter". Two ways to get the answer, and you normally only use one: pass <code>NULL</code> and take the return value. <code>time(NULL)</code> is the idiom you saw on slide 11.</li>
<li><strong>Why the parameter is a pointer</strong> — this is Slot 10 material paying off. The function needs to write into a variable you own, so it takes its address. Passing <code>NULL</code> means "do not bother, just return it to me". Both forms give the same number.</li>
<li><strong><code>double difftime(time_t, time_t);</code></strong> — "returns the difference in seconds between two calendar time arguments". Argument order is <em>later, earlier</em>: <code>difftime(t2, t1)</code>. Swap them and you get a negative duration, which is the classic silent mistake.</li>
<li><strong>Why not just subtract?</strong> — because <code>time_t</code> is not guaranteed to be a plain integer counted in seconds; the standard only says <code>difftime</code> converts the gap to seconds correctly. On most systems <code>t2 - t1</code> happens to work; <code>difftime</code> always works.</li>
<li><strong><code>clock_t clock(void);</code></strong> — "returns the current date time information using the unit clock tick". More precisely it returns the CPU time used <em>by your process so far</em>. You call it twice and subtract; divide by <code>CLOCKS_PER_SEC</code> to get seconds.</li>
<li><strong>Which to use for measuring</strong> — <code>clock</code>, almost always. <code>difftime</code> is limited to whole seconds, so anything faster than a second measures as 0. That limitation is visible in the very next slide's output.</li>
</ul>
<pre><code>time_t t1 = time(NULL);          /* moc dau  */
/* … doan ma can do … */
time_t t2 = time(NULL);          /* moc cuoi */
printf("%.0f giay\\n", difftime(t2, t1));

clock_t c1 = clock();
/* … doan ma can do … */
clock_t c2 = clock();
printf("%.6f giay CPU\\n", (double)(c2 - c1) / CLOCKS_PER_SEC);</code></pre>
<p class="dap-an">✅ Both patterns were compiled and run on the same one-billion-iteration loop. <code>difftime</code> reported <strong>1.000000 sec</strong>; <code>clock</code> reported <strong>959622 ticks = 0.959622 sec</strong> for the identical work. The <code>clock</code> figure is the honest one — <code>difftime</code> had rounded a 0.96-second job up to a whole second, because one second is the finest thing it can see.</p>
<p class="pitfall">⚠️ <code>(c2 - c1) / CLOCKS_PER_SEC</code> without a cast is <em>integer</em> division and prints <strong>0</strong> for anything under a second. The cast to <code>double</code> must be on the numerator: <code>(double)(c2 - c1) / CLOCKS_PER_SEC</code>. Same trap as slide 9, third appearance in this deck.</p>`,
        `<p class="y-chinh">🎯 Ba nguyên mẫu và một lời hứa: với chúng ta "có thể dùng các hàm này để đánh giá <strong>chi phí thời gian của một thuật toán</strong>" — lý do thật sự khiến <code>time.h</code> xuất hiện trong một môn nhập môn lập trình.</p>
<ul>
<li><strong><code>time_t time(time_t *tptr);</code></strong> — "trả về thời gian lịch hiện tại và thời gian này được cất vào tham số của nó". Hai đường lấy đáp số, và bình thường bạn chỉ dùng một: truyền <code>NULL</code> rồi lấy giá trị trả về. <code>time(NULL)</code> chính là lối viết bạn đã thấy ở slide 11.</li>
<li><strong>Vì sao tham số là con trỏ</strong> — đây là lúc kiến thức Slot 10 sinh lời. Hàm cần GHI vào một biến do bạn sở hữu, nên nó nhận địa chỉ của biến đó. Truyền <code>NULL</code> nghĩa là "khỏi ghi, cứ trả về cho tôi". Hai cách cho cùng một con số.</li>
<li><strong><code>double difftime(time_t, time_t);</code></strong> — "trả về hiệu tính bằng giây giữa hai mốc thời gian lịch". Thứ tự đối số là <em>mốc sau, mốc trước</em>: <code>difftime(t2, t1)</code>. Đảo lại thì được một khoảng thời gian âm, đúng kiểu lỗi âm thầm kinh điển.</li>
<li><strong>Sao không trừ thẳng?</strong> — vì <code>time_t</code> không được bảo đảm là một số nguyên đếm theo giây; chuẩn chỉ nói <code>difftime</code> quy khoảng cách ra giây một cách chính xác. Trên phần lớn hệ thống thì <code>t2 - t1</code> tình cờ chạy đúng; còn <code>difftime</code> thì luôn đúng.</li>
<li><strong><code>clock_t clock(void);</code></strong> — "trả về thông tin thời gian hiện tại theo đơn vị nhịp đồng hồ". Chính xác hơn: nó trả về lượng thời gian CPU mà <em>tiến trình của bạn đã dùng tới lúc đó</em>. Bạn gọi hai lần rồi trừ; chia cho <code>CLOCKS_PER_SEC</code> để ra giây.</li>
<li><strong>Đo thì dùng cái nào</strong> — dùng <code>clock</code>, gần như luôn luôn. <code>difftime</code> chỉ tới mức giây nguyên, nên bất cứ thứ gì nhanh hơn một giây đều đo ra 0. Hạn chế đó lộ ngay trong kết quả của slide kế tiếp.</li>
</ul>
<pre><code>time_t t1 = time(NULL);          /* moc dau  */
/* … doan ma can do … */
time_t t2 = time(NULL);          /* moc cuoi */
printf("%.0f giay\\n", difftime(t2, t1));

clock_t c1 = clock();
/* … doan ma can do … */
clock_t c2 = clock();
printf("%.6f giay CPU\\n", (double)(c2 - c1) / CLOCKS_PER_SEC);</code></pre>
<p class="dap-an">✅ Cả hai khuôn mẫu đã được biên dịch và chạy trên cùng một vòng lặp một tỉ bước. <code>difftime</code> báo <strong>1.000000 sec</strong>; <code>clock</code> báo <strong>959622 nhịp = 0.959622 giây</strong> cho đúng khối việc ấy. Con số của <code>clock</code> mới là con số trung thực — <code>difftime</code> đã làm tròn một công việc 0,96 giây lên thành nguyên một giây, vì một giây là thứ nhỏ nhất nó nhìn thấy được.</p>
<p class="pitfall">⚠️ <code>(c2 - c1) / CLOCKS_PER_SEC</code> mà không ép kiểu là phép chia <em>nguyên</em> và in ra <strong>0</strong> với mọi thứ dưới một giây. Phép ép kiểu phải nằm ở TỬ SỐ: <code>(double)(c2 - c1) / CLOCKS_PER_SEC</code>. Đúng cái bẫy của slide 9, lần xuất hiện thứ ba trong bộ slide này.</p>`],

      [18, 'Time Library: Demo — measuring one billion additions',
        `<p class="y-chinh">🎯 A 36-line benchmark. It times a billion <code>double</code> additions with <code>difftime</code>, then a billion <code>int</code> additions with <code>difftime</code>, then the same integer loop again with <code>clock</code> — so you can compare the two clocks on identical work.</p>
<ul>
<li><strong>The measurement pattern, three times over</strong> — take a reading, do the work, take another reading, subtract. That pattern is all there is to benchmarking; everything else is choosing what to put in the middle.</li>
<li><strong>Why <code>double</code> first and <code>int</code> second</strong> — the demo is asking an honest engineering question: does floating-point arithmetic cost more than integer arithmetic? Running both under the same harness is the only way to answer it.</li>
<li><strong>The third loop repeats the second on purpose</strong> — identical work, different instrument. Whatever difference appears between the <code>difftime</code> number and the <code>clock</code> number is a property of the <em>clocks</em>, not of the code being measured.</li>
<li><strong>Line 31–32, the two-step conversion</strong> — first print the raw difference as ticks with <code>%ld</code>, then print it again in seconds as <code>((double)(ct2-ct1))/CLOCKS_PER_SEC</code>. Seeing both makes the meaning of <code>CLOCKS_PER_SEC</code> concrete.</li>
<li><strong>Benchmark honestly</strong> — with optimisation turned on, a modern compiler can prove the loop's result is unused and delete the whole thing, giving you a suspicious 0.000000. Measure at <code>-O0</code>, or print the accumulated value afterwards so the work cannot be removed.</li>
</ul>
<p class="dap-an">✅ Typed in and run with <code>cc -Wall -std=c99 -O0</code> (Apple M-series). Real measurements:</p>
<table>
<tr><th>Phép đo</th><th>Công cụ</th><th>Kết quả thật</th></tr>
<tr><td>1 tỉ phép cộng <code>double</code></td><td><code>difftime</code></td><td>4.000000 sec</td></tr>
<tr><td>1 tỉ phép cộng <code>int</code></td><td><code>difftime</code></td><td>1.000000 sec</td></tr>
<tr><td>1 tỉ phép cộng <code>int</code></td><td><code>clock</code></td><td>959622 ticks = 0.959622 sec</td></tr>
<tr><td><code>CLOCKS_PER_SEC</code></td><td>—</td><td>1000000</td></tr>
<tr><td>Tổng thời gian tiến trình</td><td><code>time</code> của shell</td><td>5.44 s CPU / 6.11 s thực</td></tr>
</table>
<p class="dap-an">✅ The engineering conclusion from those numbers: floating-point addition cost about <strong>4×</strong> integer addition in this loop. And note the two <code>difftime</code> figures are suspiciously round — 4.000000 and 1.000000 — because <code>difftime</code> can only ever return whole seconds. The true integer figure was 0.959622 s, which <code>difftime</code> reported as 1.</p>
<p class="meo">💡 This slide is the first time in PRF192 that you measure instead of guess. Keep the habit: when someone claims one loop is faster than another, the argument ends the moment somebody runs it. Ten lines of <code>clock()</code> beat an hour of debate.</p>`,
        `<p class="y-chinh">🎯 Một chương trình đo hiệu năng 36 dòng. Nó đo một tỉ phép cộng <code>double</code> bằng <code>difftime</code>, rồi một tỉ phép cộng <code>int</code> cũng bằng <code>difftime</code>, rồi lặp lại đúng vòng lặp số nguyên ấy bằng <code>clock</code> — để bạn so hai cái đồng hồ trên cùng một khối việc.</p>
<ul>
<li><strong>Khuôn đo lặp lại ba lần</strong> — lấy một mốc, làm việc, lấy mốc nữa, trừ đi. Đo hiệu năng chỉ có thế; mọi thứ còn lại là chọn xem đặt gì vào giữa.</li>
<li><strong>Vì sao <code>double</code> trước, <code>int</code> sau</strong> — demo đang đặt một câu hỏi kỹ thuật trung thực: số thực có đắt hơn số nguyên không? Chạy cả hai dưới cùng một bộ khung là cách duy nhất trả lời được.</li>
<li><strong>Vòng lặp thứ ba lặp lại vòng thứ hai là có chủ ý</strong> — cùng khối việc, khác dụng cụ đo. Chênh lệch nào xuất hiện giữa con số của <code>difftime</code> và của <code>clock</code> đều là đặc tính của <em>cái đồng hồ</em>, không phải của đoạn mã đang bị đo.</li>
<li><strong>Dòng 31–32, phép đổi hai bước</strong> — in hiệu số thô dạng nhịp bằng <code>%ld</code> trước, rồi in lại dạng giây bằng <code>((double)(ct2-ct1))/CLOCKS_PER_SEC</code>. Nhìn cả hai thì ý nghĩa của <code>CLOCKS_PER_SEC</code> trở nên cụ thể.</li>
<li><strong>Đo cho trung thực</strong> — bật tối ưu lên thì trình biên dịch hiện đại có thể chứng minh kết quả vòng lặp không ai dùng và xoá sạch nó, cho bạn một con số 0.000000 rất đáng ngờ. Hãy đo ở <code>-O0</code>, hoặc in giá trị tích luỹ ra sau để khối việc không bị gỡ bỏ.</li>
</ul>
<p class="dap-an">✅ Đã gõ lại và chạy bằng <code>cc -Wall -std=c99 -O0</code> (chip Apple M). Số đo thật:</p>
<table>
<tr><th>Phép đo</th><th>Công cụ</th><th>Kết quả thật</th></tr>
<tr><td>1 tỉ phép cộng <code>double</code></td><td><code>difftime</code></td><td>4.000000 sec</td></tr>
<tr><td>1 tỉ phép cộng <code>int</code></td><td><code>difftime</code></td><td>1.000000 sec</td></tr>
<tr><td>1 tỉ phép cộng <code>int</code></td><td><code>clock</code></td><td>959622 nhịp = 0.959622 sec</td></tr>
<tr><td><code>CLOCKS_PER_SEC</code></td><td>—</td><td>1000000</td></tr>
<tr><td>Tổng thời gian tiến trình</td><td><code>time</code> của shell</td><td>5,44 s CPU / 6,11 s thực</td></tr>
</table>
<p class="dap-an">✅ Kết luận kỹ thuật rút từ những con số đó: phép cộng số thực tốn khoảng <strong>4 lần</strong> phép cộng số nguyên trong vòng lặp này. Và để ý hai con số của <code>difftime</code> tròn trịa một cách đáng ngờ — 4.000000 và 1.000000 — bởi <code>difftime</code> chỉ có thể trả về số giây nguyên. Con số thật của vòng lặp số nguyên là 0,959622 s, bị <code>difftime</code> báo thành 1.</p>
<p class="meo">💡 Slide này là lần đầu tiên trong PRF192 bạn ĐO thay vì ĐOÁN. Hãy giữ thói quen đó: khi có ai khẳng định vòng lặp này nhanh hơn vòng lặp kia, cuộc tranh luận kết thúc ngay khi có người chạy thử. Mười dòng <code>clock()</code> thắng một giờ cãi nhau.</p>`],

      [19, '3 - The Character Library (ctype.h) — the nine functions',
        `<p class="y-chinh">🎯 One table introducing the next nine slides: <code>&lt;ctype.h&gt;</code> "provides many functions for classifying and modifying characters" — seven classifiers and two converters.</p>
<ul>
<li><strong>The seven classifiers</strong> — <code>isalnum</code> (letter or digit), <code>isalpha</code> (letter), <code>isblank</code> (space or tab), <code>isdigit</code> (decimal digit), <code>islower</code> (lowercase letter), <code>isupper</code> (uppercase letter), <code>isspace</code> (any whitespace). Every one answers yes/no about <strong>one</strong> character.</li>
<li><strong>The two converters</strong> — <code>tolower</code> and <code>toupper</code> "return a lowercase/uppercase version of a character". Note the word <em>return</em>: they hand you a new value and leave your variable untouched. Slides 27–28 come back to this.</li>
<li><strong>The naming convention is the whole API</strong> — <code>is…</code> asks a question and gives a true/false answer; <code>to…</code> performs a conversion and gives a character back. Once you see that, you can guess <code>ispunct</code>, <code>isxdigit</code>, <code>isprint</code>, <code>iscntrl</code> and be right every time.</li>
<li><strong>Every one of them takes an <code>int</code>, not a <code>char</code></strong> — the prototypes on slides 20–28 all read <code>int isxxx(int c);</code>. That is deliberate: the parameter must be able to hold every character value <em>plus</em> the special value <code>EOF</code> (−1), which no <code>char</code> can do. The consequence is on the next slide.</li>
<li><strong>Every one of them returns non-zero, not necessarily 1</strong> — the slides say "a non-zero value (equivalent to boolean true)". Write <code>if (isdigit(c))</code>, never <code>if (isdigit(c) == 1)</code>. The first is always correct; the second is correct only by luck on your particular compiler.</li>
</ul>
<table>
<tr><th>Hàm</th><th>Trả về khác 0 khi…</th><th>Slide</th></tr>
<tr><td><code>isalnum()</code></td><td>chữ cái hoặc chữ số</td><td>20</td></tr>
<tr><td><code>isalpha()</code></td><td>chữ cái</td><td>21</td></tr>
<tr><td><code>isblank()</code></td><td>dấu cách hoặc tab</td><td>22</td></tr>
<tr><td><code>isdigit()</code></td><td>chữ số thập phân</td><td>23</td></tr>
<tr><td><code>islower()</code></td><td>chữ thường</td><td>24</td></tr>
<tr><td><code>isupper()</code></td><td>chữ hoa</td><td>25</td></tr>
<tr><td><code>isspace()</code></td><td>ký tự trắng bất kỳ</td><td>26</td></tr>
<tr><td><code>tolower()</code></td><td>(đổi) trả bản chữ thường</td><td>27</td></tr>
<tr><td><code>toupper()</code></td><td>(đổi) trả bản chữ hoa</td><td>28</td></tr>
</table>
<p class="meo">💡 Do not memorise nine definitions — memorise the two <em>overlaps</em> that the exam loves. (1) <code>isalnum</code> = <code>isalpha</code> OR <code>isdigit</code>. (2) every <code>isblank</code> character is also an <code>isspace</code> character, but not the reverse: <code>'\\n'</code> is space and not blank. Everything else follows from the names.</p>`,
        `<p class="y-chinh">🎯 Một bảng mở màn cho chín slide kế tiếp: <code>&lt;ctype.h&gt;</code> "cung cấp nhiều hàm để phân loại và biến đổi ký tự" — bảy hàm phân loại và hai hàm chuyển đổi.</p>
<ul>
<li><strong>Bảy hàm phân loại</strong> — <code>isalnum</code> (chữ cái hoặc chữ số), <code>isalpha</code> (chữ cái), <code>isblank</code> (dấu cách hoặc tab), <code>isdigit</code> (chữ số thập phân), <code>islower</code> (chữ thường), <code>isupper</code> (chữ hoa), <code>isspace</code> (ký tự trắng bất kỳ). Mỗi hàm trả lời có/không về <strong>một</strong> ký tự.</li>
<li><strong>Hai hàm chuyển đổi</strong> — <code>tolower</code> và <code>toupper</code> "trả về bản chữ thường/chữ hoa của một ký tự". Hãy để ý chữ <em>trả về</em>: chúng đưa cho bạn một giá trị MỚI và để nguyên biến của bạn. Slide 27–28 quay lại chuyện này.</li>
<li><strong>Quy ước đặt tên chính là toàn bộ bộ hàm</strong> — <code>is…</code> đặt một câu hỏi và cho đáp án đúng/sai; <code>to…</code> thực hiện một phép đổi và trả lại một ký tự. Nhìn ra điều đó rồi thì bạn đoán được <code>ispunct</code>, <code>isxdigit</code>, <code>isprint</code>, <code>iscntrl</code> và lần nào cũng đúng.</li>
<li><strong>Cả chín hàm đều nhận <code>int</code>, không phải <code>char</code></strong> — các nguyên mẫu ở slide 20–28 đều viết <code>int isxxx(int c);</code>. Đó là chủ ý: tham số phải chứa được mọi giá trị ký tự <em>cộng thêm</em> giá trị đặc biệt <code>EOF</code> (−1), mà không <code>char</code> nào làm nổi. Hệ quả nằm ở slide sau.</li>
<li><strong>Cả chín hàm trả về KHÁC 0, không nhất thiết là 1</strong> — các slide viết "một giá trị khác 0 (tương đương boolean true)". Hãy viết <code>if (isdigit(c))</code>, đừng bao giờ viết <code>if (isdigit(c) == 1)</code>. Cách đầu luôn đúng; cách sau chỉ đúng nhờ may mắn trên đúng trình biên dịch của bạn.</li>
</ul>
<table>
<tr><th>Hàm</th><th>Trả về khác 0 khi…</th><th>Slide</th></tr>
<tr><td><code>isalnum()</code></td><td>chữ cái hoặc chữ số</td><td>20</td></tr>
<tr><td><code>isalpha()</code></td><td>chữ cái</td><td>21</td></tr>
<tr><td><code>isblank()</code></td><td>dấu cách hoặc tab</td><td>22</td></tr>
<tr><td><code>isdigit()</code></td><td>chữ số thập phân</td><td>23</td></tr>
<tr><td><code>islower()</code></td><td>chữ thường</td><td>24</td></tr>
<tr><td><code>isupper()</code></td><td>chữ hoa</td><td>25</td></tr>
<tr><td><code>isspace()</code></td><td>ký tự trắng bất kỳ</td><td>26</td></tr>
<tr><td><code>tolower()</code></td><td>(đổi) trả bản chữ thường</td><td>27</td></tr>
<tr><td><code>toupper()</code></td><td>(đổi) trả bản chữ hoa</td><td>28</td></tr>
</table>
<p class="meo">💡 Đừng học thuộc chín định nghĩa — hãy thuộc hai chỗ <em>chồng lấn</em> mà đề thi rất thích. (1) <code>isalnum</code> = <code>isalpha</code> HOẶC <code>isdigit</code>. (2) mọi ký tự <code>isblank</code> đều là ký tự <code>isspace</code>, nhưng chiều ngược lại thì không: <code>'\\n'</code> là space mà không phải blank. Mọi thứ còn lại suy ra được từ chính cái tên.</p>`],

      [20, 'isalnum() Function',
        `<p class="y-chinh">🎯 <code>int isalnum(int c);</code> — non-zero if the character is <strong>alphanumeric</strong>, i.e. a letter (a-z, A-Z) <em>or</em> a digit (0-9). The slide lists the counter-examples itself: space, <code>!</code>, <code>#</code>, <code>%</code>, <code>&amp;</code>, <code>?</code>.</p>
<ul>
<li><strong>The one that is a union of two others</strong> — <code>isalnum(c)</code> is true exactly when <code>isalpha(c) || isdigit(c)</code> is true. It exists because "letter or digit" is the single most common thing you need when validating a username, an identifier, or a licence plate.</li>
<li><strong>Its real job: rejecting punctuation</strong> — the natural use is a loop over a string: "if any character fails <code>isalnum</code>, the input is not a plain word/number". That is a three-line validator instead of a twenty-line chain of comparisons.</li>
<li><strong>The slide's example uses a single character</strong> — <code>char c = 'A';</code> then <code>if (isalnum(c))</code>. It prints <code>A is alphanumeric</code>, which matches the console window on the right.</li>
<li><strong>This slide gets the header right</strong> — <code>#include &lt;ctype.h&gt;</code> is there on line 2. Keep an eye on it: slides 21–25 print <code>&lt;stdlib.h&gt;</code> instead, which does not work (see the Answer on slide 21).</li>
<li><strong>Underscore is not alphanumeric</strong> — a detail that matters, because C identifiers allow <code>_</code>. If you are validating a variable name, the test is <code>isalnum(c) || c == '_'</code>, not <code>isalnum</code> alone.</li>
</ul>
<table>
<tr><th>c</th><th><code>isalnum(c)</code></th><th>Vì sao</th></tr>
<tr><td><code>'a'</code></td><td>1</td><td>chữ thường</td></tr>
<tr><td><code>'Z'</code></td><td>1</td><td>chữ hoa</td></tr>
<tr><td><code>'7'</code></td><td>1</td><td>chữ số</td></tr>
<tr><td><code>' '</code> (dấu cách)</td><td>0</td><td>ký tự trắng</td></tr>
<tr><td><code>'!'</code></td><td>0</td><td>dấu câu</td></tr>
<tr><td><code>'_'</code></td><td>0</td><td>dấu gạch dưới KHÔNG tính</td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;ctype.h&gt;

int main() {
  char c = 'A';
  if (isalnum(c)) { printf("%c is alphanumeric", c); }
  else { printf("%c is not alphanumeric", c); }
  return 0;
}</code></pre>
<p class="dap-an">✅ Compiled and run: prints <code>A is alphanumeric</code>, exactly as the slide's screenshot. The whole table above was produced by a real program — measured values for <code>'a' 'Z' '7'</code> are <strong>1</strong> and for <code>' ' '!' '_'</code> are <strong>0</strong>.</p>
<p class="meo">💡 Remember it as a two-letter word: <strong>al</strong>pha + <strong>num</strong>ber = <code>isalnum</code>. Three of the nine names are built this way, and reading them as abbreviations rather than as magic words is how you stop confusing <code>isalnum</code> with <code>isalpha</code> under exam pressure.</p>`,
        `<p class="y-chinh">🎯 <code>int isalnum(int c);</code> — trả về khác 0 nếu ký tự là <strong>chữ-hoặc-số</strong> (alphanumeric), tức một chữ cái (a-z, A-Z) <em>hoặc</em> một chữ số (0-9). Slide tự liệt kê phản ví dụ: dấu cách, <code>!</code>, <code>#</code>, <code>%</code>, <code>&amp;</code>, <code>?</code>.</p>
<ul>
<li><strong>Hàm hợp của hai hàm khác</strong> — <code>isalnum(c)</code> đúng chính xác khi <code>isalpha(c) || isdigit(c)</code> đúng. Nó tồn tại vì "chữ hoặc số" là thứ bạn cần nhiều nhất khi kiểm tra tên đăng nhập, một định danh, hay một biển số xe.</li>
<li><strong>Việc thật của nó: loại bỏ dấu câu</strong> — cách dùng tự nhiên là một vòng lặp trên chuỗi: "nếu có ký tự nào rớt <code>isalnum</code> thì dữ liệu vào không phải một từ/số thuần". Đó là một bộ kiểm ba dòng thay cho hai chục dòng so sánh nối đuôi.</li>
<li><strong>Ví dụ trên slide chỉ xét một ký tự</strong> — <code>char c = 'A';</code> rồi <code>if (isalnum(c))</code>. Nó in ra <code>A is alphanumeric</code>, khớp cửa sổ console bên phải.</li>
<li><strong>Slide này ghi ĐÚNG header</strong> — <code>#include &lt;ctype.h&gt;</code> nằm ở dòng 2. Hãy để mắt tới chi tiết này: slide 21–25 lại in <code>&lt;stdlib.h&gt;</code>, và như thế thì không chạy được (xem phần Đáp án ở slide 21).</li>
<li><strong>Dấu gạch dưới KHÔNG phải alphanumeric</strong> — chi tiết này có ý nghĩa, vì định danh trong C cho phép <code>_</code>. Nếu bạn đang kiểm tra tên biến thì điều kiện là <code>isalnum(c) || c == '_'</code>, chứ không phải mỗi <code>isalnum</code>.</li>
</ul>
<table>
<tr><th>c</th><th><code>isalnum(c)</code></th><th>Vì sao</th></tr>
<tr><td><code>'a'</code></td><td>1</td><td>chữ thường</td></tr>
<tr><td><code>'Z'</code></td><td>1</td><td>chữ hoa</td></tr>
<tr><td><code>'7'</code></td><td>1</td><td>chữ số</td></tr>
<tr><td><code>' '</code> (dấu cách)</td><td>0</td><td>ký tự trắng</td></tr>
<tr><td><code>'!'</code></td><td>0</td><td>dấu câu</td></tr>
<tr><td><code>'_'</code></td><td>0</td><td>dấu gạch dưới KHÔNG tính</td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;ctype.h&gt;

int main() {
  char c = 'A';
  if (isalnum(c)) { printf("%c is alphanumeric", c); }
  else { printf("%c is not alphanumeric", c); }
  return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch và chạy: in ra <code>A is alphanumeric</code>, đúng như ảnh chụp trên slide. Toàn bộ bảng trên do một chương trình thật in ra — giá trị đo được cho <code>'a' 'Z' '7'</code> là <strong>1</strong> và cho <code>' ' '!' '_'</code> là <strong>0</strong>.</p>
<p class="meo">💡 Hãy nhớ nó như một từ ghép hai mảnh: <strong>al</strong>pha + <strong>num</strong>ber = <code>isalnum</code>. Ba trong chín cái tên được dựng theo kiểu này, và đọc chúng như chữ viết tắt thay vì như phù chú là cách để không còn lẫn <code>isalnum</code> với <code>isalpha</code> lúc căng thẳng phòng thi.</p>`],

      [21, 'isalpha() Function',
        `<p class="y-chinh">🎯 <code>int isalpha(int c);</code> — non-zero if the character is <strong>a letter</strong>. Digits are out, punctuation is out, whitespace is out. Only A–Z and a–z remain.</p>
<ul>
<li><strong>The narrowest of the "is it a word character" family</strong> — <code>isalpha</code> is strictly stronger than <code>isalnum</code>: every <code>isalpha</code> character passes <code>isalnum</code>, but <code>'7'</code> passes <code>isalnum</code> and fails <code>isalpha</code>. Pick <code>isalpha</code> when digits must be rejected.</li>
<li><strong>Its typical use: "is this a name?"</strong> — validating a person's surname, a country code, a menu letter. Combined with <code>isspace</code> you can accept "Nguyen Van A" while rejecting "Nguyen1".</li>
<li><strong>It is also <code>islower</code> OR <code>isupper</code></strong> — in the default C locale those three lock together: <code>isalpha(c)</code> is true exactly when <code>islower(c) || isupper(c)</code> is. That identity is the cleanest way to remember what slides 24 and 25 add.</li>
<li><strong>The slide's example</strong> — <code>char c = 'A';</code>, then the same if/else shape as slide 20, printing <code>A is a letter</code>. The screenshot confirms it.</li>
<li><strong>Vietnamese letters are not <code>isalpha</code></strong> — <code>'ế'</code>, <code>'đ'</code>, <code>'ư'</code> are multi-byte in UTF-8, so a single <code>char</code> holds only a fragment of them, and <code>isalpha</code> answers 0. <code>ctype.h</code> is an ASCII tool. Do not use it to validate Vietnamese names.</li>
</ul>
<table>
<tr><th>c</th><th><code>isalpha(c)</code></th><th><code>isalnum(c)</code></th><th>Khác nhau?</th></tr>
<tr><td><code>'a'</code></td><td>1</td><td>1</td><td>—</td></tr>
<tr><td><code>'Z'</code></td><td>1</td><td>1</td><td>—</td></tr>
<tr><td><code>'7'</code></td><td>0</td><td>1</td><td>✔ chỗ khác nhau</td></tr>
<tr><td><code>' '</code></td><td>0</td><td>0</td><td>—</td></tr>
<tr><td><code>'?'</code></td><td>0</td><td>0</td><td>—</td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;ctype.h&gt;        /* slide ghi &lt;stdlib.h&gt; — xem Dap an */

int main() {
  char c = 'A';
  if (isalpha(c)) { printf("%c is a letter", c); }
  else { printf("%c is not a letter", c); }
  return 0;
}</code></pre>
<p class="dap-an">✅ With <code>&lt;ctype.h&gt;</code> the program compiles and prints <code>A is a letter</code>, matching the slide. <strong>But the slide as printed does not compile.</strong> Its second include line is <code>#include &lt;stdlib.h&gt;</code>, not <code>&lt;ctype.h&gt;</code>. Typed in verbatim, clang answers: <em>"error: call to undeclared library function 'isalpha' with type 'int (int)'; ISO C99 and later do not support implicit function declarations"</em> and refuses to build. The same slip is on slides 22, 23, 24 and 25; slides 20, 26, 27 and 28 have the correct header. The slide is wrong here — noted, not silently copied, and not edited.</p>
<p class="pitfall">⚠️ Old compilers (C89 mode) accepted the missing header by guessing the prototype, which is why the screenshots on the slide exist. Since C99 that guessing is gone. A program that "used to work" in Dev-C++ and now errors is usually missing exactly one <code>#include</code> — read the error text, it names the header for you.</p>`,
        `<p class="y-chinh">🎯 <code>int isalpha(int c);</code> — trả về khác 0 nếu ký tự là <strong>một chữ cái</strong>. Chữ số bị loại, dấu câu bị loại, ký tự trắng bị loại. Chỉ còn A–Z và a–z.</p>
<ul>
<li><strong>Hàm hẹp nhất trong nhóm "có phải ký tự của từ không"</strong> — <code>isalpha</code> chặt hơn hẳn <code>isalnum</code>: mọi ký tự qua được <code>isalpha</code> đều qua <code>isalnum</code>, nhưng <code>'7'</code> thì qua <code>isalnum</code> mà rớt <code>isalpha</code>. Chọn <code>isalpha</code> khi phải loại bỏ chữ số.</li>
<li><strong>Cách dùng điển hình: "đây có phải một cái tên không?"</strong> — kiểm tra họ tên, mã quốc gia, chữ cái chọn mục trong menu. Ghép với <code>isspace</code> là bạn chấp nhận được "Nguyen Van A" trong khi loại "Nguyen1".</li>
<li><strong>Nó cũng chính là <code>islower</code> HOẶC <code>isupper</code></strong> — trong locale C mặc định, ba hàm này khớp nhau: <code>isalpha(c)</code> đúng chính xác khi <code>islower(c) || isupper(c)</code> đúng. Đẳng thức đó là cách gọn nhất để nhớ slide 24 và 25 thêm điều gì.</li>
<li><strong>Ví dụ trên slide</strong> — <code>char c = 'A';</code>, rồi đúng khuôn if/else của slide 20, in ra <code>A is a letter</code>. Ảnh chụp xác nhận điều đó.</li>
<li><strong>Chữ cái tiếng Việt KHÔNG phải <code>isalpha</code></strong> — <code>'ế'</code>, <code>'đ'</code>, <code>'ư'</code> là nhiều byte trong UTF-8, nên một <code>char</code> chỉ giữ được một mảnh của chúng, và <code>isalpha</code> trả lời 0. <code>ctype.h</code> là công cụ của ASCII. Đừng dùng nó để kiểm tra tên tiếng Việt.</li>
</ul>
<table>
<tr><th>c</th><th><code>isalpha(c)</code></th><th><code>isalnum(c)</code></th><th>Khác nhau?</th></tr>
<tr><td><code>'a'</code></td><td>1</td><td>1</td><td>—</td></tr>
<tr><td><code>'Z'</code></td><td>1</td><td>1</td><td>—</td></tr>
<tr><td><code>'7'</code></td><td>0</td><td>1</td><td>✔ chỗ khác nhau</td></tr>
<tr><td><code>' '</code></td><td>0</td><td>0</td><td>—</td></tr>
<tr><td><code>'?'</code></td><td>0</td><td>0</td><td>—</td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;ctype.h&gt;        /* slide ghi &lt;stdlib.h&gt; — xem Dap an */

int main() {
  char c = 'A';
  if (isalpha(c)) { printf("%c is a letter", c); }
  else { printf("%c is not a letter", c); }
  return 0;
}</code></pre>
<p class="dap-an">✅ Với <code>&lt;ctype.h&gt;</code> thì chương trình dịch được và in ra <code>A is a letter</code>, khớp slide. <strong>Nhưng slide in như hiện tại thì KHÔNG dịch được.</strong> Dòng include thứ hai của nó là <code>#include &lt;stdlib.h&gt;</code> chứ không phải <code>&lt;ctype.h&gt;</code>. Gõ nguyên văn vào clang, kết quả là: <em>"error: call to undeclared library function 'isalpha' with type 'int (int)'; ISO C99 and later do not support implicit function declarations"</em> và nó từ chối dịch. Cùng lỗi ấy có ở slide 22, 23, 24 và 25; slide 20, 26, 27 và 28 thì ghi đúng header. Ở đây slide sai — đã nêu ra chứ không im lặng chép lại, và cũng không tự sửa slide.</p>
<p class="pitfall">⚠️ Trình biên dịch cũ (chế độ C89) chấp nhận việc thiếu header bằng cách ĐOÁN nguyên mẫu, và đó là lý do các ảnh chụp trên slide vẫn tồn tại. Từ C99 thì phép đoán ấy bị bỏ. Một chương trình "trước chạy được" trên Dev-C++ mà nay báo lỗi thì thường chỉ thiếu đúng một dòng <code>#include</code> — hãy đọc thông báo lỗi, nó gọi tên header giùm bạn.</p>`],

      [22, 'isblank() Function',
        `<p class="y-chinh">🎯 <code>int isblank(int c);</code> — non-zero for exactly <strong>two</strong> characters: the space <code>' '</code> and the tab <code>'\\t'</code>. Nothing else. This is the narrowest function in the whole header.</p>
<ul>
<li><strong>Why "blank" and not "space"</strong> — blank means "horizontal gap on the current line". A newline is not a gap on the line; it ends the line. That single idea is the entire difference between <code>isblank</code> and <code>isspace</code> (slide 26).</li>
<li><strong>The exam question hiding here</strong> — <code>isblank('\\n')</code> is <strong>0</strong> while <code>isspace('\\n')</code> is non-zero. If you use <code>isblank</code> to skip whitespace while reading a file, you will stop dead at the end of the first line.</li>
<li><strong>Where it is genuinely the right tool</strong> — splitting one line into fields. "Skip blanks, read a word, skip blanks, read the next word" is correct with <code>isblank</code> and subtly wrong with <code>isspace</code>, which would happily run past the end of the line into the next one.</li>
<li><strong>It is the newest of the nine</strong> — <code>isblank</code> was added in C99; the other eight date back to C89. Very old compilers may not have it, and that is the only one of the nine you might ever have to write yourself: <code>c == ' ' || c == '\\t'</code>.</li>
<li><strong>The slide's example</strong> — <code>char c = ' ';</code> and the usual if/else. Printing a space with <code>%c</code> produces an invisible character, which is why the console line looks like it starts with a gap.</li>
</ul>
<table>
<tr><th>c</th><th><code>isblank(c)</code></th><th><code>isspace(c)</code></th><th>Ghi chú</th></tr>
<tr><td><code>' '</code> (dấu cách)</td><td>1</td><td>1</td><td>cả hai đều nhận</td></tr>
<tr><td><code>'\\t'</code> (tab)</td><td>1</td><td>1</td><td>cả hai đều nhận</td></tr>
<tr><td><code>'\\n'</code> (xuống dòng)</td><td><strong>0</strong></td><td><strong>1</strong></td><td>✔ chỗ khác nhau</td></tr>
<tr><td><code>'a'</code></td><td>0</td><td>0</td><td>—</td></tr>
<tr><td><code>'7'</code></td><td>0</td><td>0</td><td>—</td></tr>
<tr><td><code>'!'</code></td><td>0</td><td>0</td><td>—</td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;ctype.h&gt;        /* slide ghi &lt;stdlib.h&gt; */

int main() {
  char c = ' ';
  if (isblank(c)) { printf("[%c] is blank character\\n", c); }
  else { printf("[%c] is not a blank character\\n", c); }
  printf("isblank('\\\\n') = %d, isspace('\\\\n') = %d\\n", isblank('\\n'), isspace('\\n'));
  return 0;
}</code></pre>
<p class="dap-an">✅ Measured: <code>isblank(' ') = 1</code>, <code>isblank('\\t') = 1</code>, and <code>isblank('\\n') = 0</code> while <code>isspace('\\n') = 1</code> — the table above is real output. Two notes on the slide itself: its include line says <code>&lt;stdlib.h&gt;</code> (same defect as slide 21), and its screenshot reads <em>"is a blank character"</em> while its code prints <code>"%c is blank character"</code> without the "a" — the picture and the code do not come from the same run.</p>
<p class="meo">💡 One sentence to keep: <strong>blank = space and tab only; space = blank plus the four line/page characters</strong>. If you can say that out loud you have already answered every <code>isblank</code>/<code>isspace</code> question the exam can build.</p>`,
        `<p class="y-chinh">🎯 <code>int isblank(int c);</code> — trả về khác 0 với đúng <strong>hai</strong> ký tự: dấu cách <code>' '</code> và tab <code>'\\t'</code>. Không có gì khác. Đây là hàm hẹp nhất trong cả header.</p>
<ul>
<li><strong>Vì sao gọi là "blank" chứ không phải "space"</strong> — blank nghĩa là "khoảng trống NẰM NGANG trên dòng hiện tại". Ký tự xuống dòng không phải khoảng trống trên dòng; nó KẾT THÚC dòng. Đúng một ý đó là toàn bộ khác biệt giữa <code>isblank</code> và <code>isspace</code> (slide 26).</li>
<li><strong>Câu hỏi thi nấp ở đây</strong> — <code>isblank('\\n')</code> bằng <strong>0</strong> trong khi <code>isspace('\\n')</code> khác 0. Nếu bạn dùng <code>isblank</code> để bỏ qua ký tự trắng khi đọc một tệp thì bạn sẽ đứng chết ngay cuối dòng đầu tiên.</li>
<li><strong>Chỗ nó thật sự là công cụ đúng</strong> — tách một DÒNG thành các trường. "Bỏ qua khoảng trắng, đọc một từ, bỏ qua khoảng trắng, đọc từ kế" thì đúng với <code>isblank</code> và sai một cách tinh vi với <code>isspace</code>, vì <code>isspace</code> sẽ thản nhiên chạy vượt qua cuối dòng sang dòng sau.</li>
<li><strong>Nó là hàm mới nhất trong chín hàm</strong> — <code>isblank</code> được thêm vào ở C99; tám hàm kia có từ C89. Trình biên dịch rất cũ có thể không có nó, và đó cũng là hàm duy nhất trong chín hàm mà đôi khi bạn phải tự viết lấy: <code>c == ' ' || c == '\\t'</code>.</li>
<li><strong>Ví dụ trên slide</strong> — <code>char c = ' ';</code> và khuôn if/else quen thuộc. In một dấu cách bằng <code>%c</code> thì ra một ký tự vô hình, vì thế dòng console trông như bắt đầu bằng một khoảng trống.</li>
</ul>
<table>
<tr><th>c</th><th><code>isblank(c)</code></th><th><code>isspace(c)</code></th><th>Ghi chú</th></tr>
<tr><td><code>' '</code> (dấu cách)</td><td>1</td><td>1</td><td>cả hai đều nhận</td></tr>
<tr><td><code>'\\t'</code> (tab)</td><td>1</td><td>1</td><td>cả hai đều nhận</td></tr>
<tr><td><code>'\\n'</code> (xuống dòng)</td><td><strong>0</strong></td><td><strong>1</strong></td><td>✔ chỗ khác nhau</td></tr>
<tr><td><code>'a'</code></td><td>0</td><td>0</td><td>—</td></tr>
<tr><td><code>'7'</code></td><td>0</td><td>0</td><td>—</td></tr>
<tr><td><code>'!'</code></td><td>0</td><td>0</td><td>—</td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;ctype.h&gt;        /* slide ghi &lt;stdlib.h&gt; */

int main() {
  char c = ' ';
  if (isblank(c)) { printf("[%c] is blank character\\n", c); }
  else { printf("[%c] is not a blank character\\n", c); }
  printf("isblank('\\\\n') = %d, isspace('\\\\n') = %d\\n", isblank('\\n'), isspace('\\n'));
  return 0;
}</code></pre>
<p class="dap-an">✅ Đo thật: <code>isblank(' ') = 1</code>, <code>isblank('\\t') = 1</code>, và <code>isblank('\\n') = 0</code> trong khi <code>isspace('\\n') = 1</code> — bảng trên là kết quả thật. Hai ghi chú về chính slide: dòng include của nó ghi <code>&lt;stdlib.h&gt;</code> (cùng lỗi với slide 21), và ảnh chụp của nó đọc là <em>"is a blank character"</em> trong khi mã của nó in <code>"%c is blank character"</code> không có chữ "a" — ảnh và mã không đến từ cùng một lần chạy.</p>
<p class="meo">💡 Một câu để nhớ: <strong>blank = chỉ dấu cách và tab; space = blank cộng thêm bốn ký tự xuống dòng/sang trang</strong>. Nói to được câu đó là bạn đã trả lời xong mọi câu hỏi <code>isblank</code>/<code>isspace</code> mà đề thi dựng lên được.</p>`],

      [23, 'isdigit() Function',
        `<p class="y-chinh">🎯 <code>int isdigit(int c);</code> — non-zero if the character is <strong>a decimal digit</strong>, i.e. one of the ten characters <code>'0'</code> to <code>'9'</code>. The most-used function of the nine.</p>
<ul>
<li><strong>The distinction that matters most in this whole deck</strong> — the <em>character</em> <code>'8'</code> is not the <em>number</em> 8. <code>'8'</code> has the code 56; 8 is eight. <code>isdigit</code> asks about the character. To get the number you subtract: <code>c - '0'</code>.</li>
<li><strong>Its real job: input validation</strong> — this is how you check that the user typed a number without <code>scanf</code> silently leaving letters in the buffer. Slides 31–65 of this same deck are built on exactly this idea.</li>
<li><strong>It does not accept a sign or a point</strong> — <code>'-'</code> and <code>'.'</code> both fail. Validating "−12.5" therefore takes a small state machine, not a single <code>isdigit</code> call. A common exam trap is a program that rejects every negative number.</li>
<li><strong>Digits of other kinds are excluded</strong> — hexadecimal letters (<code>'a'</code>…<code>'f'</code>) are not digits; <code>isxdigit</code> exists for those. "Decimal" in the definition is doing real work.</li>
<li><strong>The slide's example</strong> — <code>char c = '8';</code> in quotes. If it were written <code>char c = 8;</code> without quotes it would be the backspace control character and the program would print "is not a digit". One pair of quotes changes the whole answer.</li>
</ul>
<table>
<tr><th>c</th><th><code>isdigit(c)</code></th><th>Mã ASCII</th><th><code>c - '0'</code></th></tr>
<tr><td><code>'0'</code></td><td>1</td><td>48</td><td>0</td></tr>
<tr><td><code>'7'</code></td><td>1</td><td>55</td><td>7</td></tr>
<tr><td><code>'a'</code></td><td>0</td><td>97</td><td>(vô nghĩa)</td></tr>
<tr><td><code>'Z'</code></td><td>0</td><td>90</td><td>(vô nghĩa)</td></tr>
<tr><td><code>' '</code></td><td>0</td><td>32</td><td>(vô nghĩa)</td></tr>
<tr><td><code>'!'</code></td><td>0</td><td>33</td><td>(vô nghĩa)</td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;ctype.h&gt;        /* slide ghi &lt;stdlib.h&gt; */

int main() {
  char c = '8';
  if (isdigit(c)) { printf("%c is a digit, value = %d\\n", c, c - '0'); }
  else { printf("%c is not a digit\\n", c); }
  return 0;
}</code></pre>
<p class="dap-an">✅ Compiled and run: prints <code>8 is a digit, value = 8</code>. Measured ASCII codes backing the table: <code>'0'</code> = 48, <code>'a'</code> = 97, <code>' '</code> = 32, <code>'!'</code> = 33 — so <code>'7' - '0'</code> = 55 − 48 = <strong>7</strong>, which is why the subtraction trick works for every digit. (Header note again: the slide prints <code>&lt;stdlib.h&gt;</code>.)</p>
<p class="pitfall">⚠️ Do not write <code>if (isdigit(c) == 1)</code>. The standard only promises "non-zero"; on this toolchain the measured value happens to be 1, but on glibc these functions return an internal bit mask, and your condition would then be false for a genuine digit. <code>if (isdigit(c))</code> is the only portable form.</p>`,
        `<p class="y-chinh">🎯 <code>int isdigit(int c);</code> — trả về khác 0 nếu ký tự là <strong>một chữ số thập phân</strong>, tức một trong mười ký tự <code>'0'</code> đến <code>'9'</code>. Hàm được dùng nhiều nhất trong chín hàm.</p>
<ul>
<li><strong>Phân biệt quan trọng nhất của cả bộ slide này</strong> — <em>ký tự</em> <code>'8'</code> không phải <em>số</em> 8. <code>'8'</code> có mã 56; còn 8 là tám. <code>isdigit</code> hỏi về KÝ TỰ. Muốn lấy con số thì trừ đi: <code>c - '0'</code>.</li>
<li><strong>Việc thật của nó: kiểm tra dữ liệu nhập</strong> — đây là cách bạn kiểm rằng người dùng đã gõ một con số, thay vì để <code>scanf</code> âm thầm bỏ lại chữ cái trong bộ đệm. Slide 31–65 của chính bộ slide này được dựng trên đúng ý tưởng ấy.</li>
<li><strong>Nó không nhận dấu âm hay dấu chấm</strong> — <code>'-'</code> và <code>'.'</code> đều rớt. Vì vậy kiểm "−12.5" cần một máy trạng thái nho nhỏ, chứ không phải một lời gọi <code>isdigit</code> đơn lẻ. Bẫy thi hay gặp là chương trình từ chối mọi số âm.</li>
<li><strong>Chữ số kiểu khác bị loại</strong> — các chữ cái của hệ thập lục phân (<code>'a'</code>…<code>'f'</code>) không phải chữ số; đã có <code>isxdigit</code> lo việc đó. Chữ "thập phân" trong định nghĩa không phải để cho đẹp.</li>
<li><strong>Ví dụ trên slide</strong> — <code>char c = '8';</code> có dấu nháy. Nếu viết <code>char c = 8;</code> không nháy thì đó là ký tự điều khiển backspace và chương trình sẽ in "is not a digit". Một cặp nháy đổi cả đáp án.</li>
</ul>
<table>
<tr><th>c</th><th><code>isdigit(c)</code></th><th>Mã ASCII</th><th><code>c - '0'</code></th></tr>
<tr><td><code>'0'</code></td><td>1</td><td>48</td><td>0</td></tr>
<tr><td><code>'7'</code></td><td>1</td><td>55</td><td>7</td></tr>
<tr><td><code>'a'</code></td><td>0</td><td>97</td><td>(vô nghĩa)</td></tr>
<tr><td><code>'Z'</code></td><td>0</td><td>90</td><td>(vô nghĩa)</td></tr>
<tr><td><code>' '</code></td><td>0</td><td>32</td><td>(vô nghĩa)</td></tr>
<tr><td><code>'!'</code></td><td>0</td><td>33</td><td>(vô nghĩa)</td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;ctype.h&gt;        /* slide ghi &lt;stdlib.h&gt; */

int main() {
  char c = '8';
  if (isdigit(c)) { printf("%c is a digit, value = %d\\n", c, c - '0'); }
  else { printf("%c is not a digit\\n", c); }
  return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch và chạy: in ra <code>8 is a digit, value = 8</code>. Các mã ASCII đo được làm nền cho bảng: <code>'0'</code> = 48, <code>'a'</code> = 97, <code>' '</code> = 32, <code>'!'</code> = 33 — nên <code>'7' - '0'</code> = 55 − 48 = <strong>7</strong>, đó là lý do mẹo trừ này đúng với mọi chữ số. (Lại ghi chú về header: slide in <code>&lt;stdlib.h&gt;</code>.)</p>
<p class="pitfall">⚠️ Đừng viết <code>if (isdigit(c) == 1)</code>. Chuẩn chỉ hứa "khác 0"; trên bộ công cụ này giá trị đo được tình cờ là 1, nhưng trên glibc các hàm này trả về một mặt nạ bit nội bộ, và khi đó điều kiện của bạn sẽ SAI với một chữ số thật. <code>if (isdigit(c))</code> là dạng khả chuyển duy nhất.</p>`],

      [24, 'islower() Function',
        `<p class="y-chinh">🎯 <code>int islower(int c);</code> — non-zero if the character is <strong>a lowercase letter</strong>, that is one of <code>'a'</code> … <code>'z'</code>. Digits, punctuation and uppercase letters all answer 0.</p>
<ul>
<li><strong>It is a strict half of <code>isalpha</code></strong> — the 26 lowercase letters. Together with <code>isupper</code> (slide 25) they partition the letters exactly: no letter is both, and every letter is one of the two.</li>
<li><strong>Digits are not lowercase</strong> — this catches people out, because in casual speech "lowercase" sometimes means "not shouting". <code>islower('7')</code> is <strong>0</strong>. Case is a property that only letters have.</li>
<li><strong>Its typical use: deciding which way to convert</strong> — "if it is lowercase, make it uppercase, otherwise leave it alone" is the core of Exercise 1 on slide 29. Testing first and converting second is more readable than converting blindly.</li>
<li><strong>The arithmetic underneath</strong> — <code>'a'</code> is 97 and <code>'z'</code> is 122, a contiguous block, so <code>islower(c)</code> is equivalent to <code>c &gt;= 'a' &amp;&amp; c &lt;= 'z'</code> in ASCII. Knowing the equivalence is useful; writing it by hand instead of calling the library is not.</li>
<li><strong>The slide's example</strong> — <code>char c = 'b';</code> prints <code>b is a lowercase letter</code>, matching the console window. Change it to <code>'B'</code> and the else branch fires.</li>
</ul>
<table>
<tr><th>c</th><th><code>islower(c)</code></th><th><code>isupper(c)</code></th><th><code>isalpha(c)</code></th></tr>
<tr><td><code>'b'</code></td><td>1</td><td>0</td><td>1</td></tr>
<tr><td><code>'a'</code></td><td>1</td><td>0</td><td>1</td></tr>
<tr><td><code>'Z'</code></td><td>0</td><td>1</td><td>1</td></tr>
<tr><td><code>'7'</code></td><td>0</td><td>0</td><td>0</td></tr>
<tr><td><code>' '</code></td><td>0</td><td>0</td><td>0</td></tr>
<tr><td><code>'!'</code></td><td>0</td><td>0</td><td>0</td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;ctype.h&gt;        /* slide ghi &lt;stdlib.h&gt; */

int main() {
  char c = 'b';
  if (islower(c)) { printf("%c is a lowercase letter\\n", c); }
  else { printf("%c is not a lowercase letter\\n", c); }
  return 0;
}</code></pre>
<p class="dap-an">✅ Compiled and run: prints <code>b is a lowercase letter</code>, as on the slide. The whole table is measured output; note how the last three rows are 0 in <em>all three</em> columns — a character with no case at all is neither lower nor upper, and that third state is what Exercise 1 must handle.</p>
<p class="meo">💡 Read the table columns, not the rows: <code>islower</code> and <code>isupper</code> are never both 1, and their sum is exactly <code>isalpha</code>. That single sentence replaces three definitions and is enough to answer any multiple-choice question built on these three functions.</p>`,
        `<p class="y-chinh">🎯 <code>int islower(int c);</code> — trả về khác 0 nếu ký tự là <strong>chữ cái viết thường</strong>, tức một trong <code>'a'</code> … <code>'z'</code>. Chữ số, dấu câu và chữ hoa đều trả 0.</p>
<ul>
<li><strong>Nó là đúng một nửa của <code>isalpha</code></strong> — 26 chữ thường. Cùng với <code>isupper</code> (slide 25), hai hàm chia đôi tập chữ cái không thừa không thiếu: không chữ nào thuộc cả hai, và mọi chữ cái đều thuộc một trong hai.</li>
<li><strong>Chữ số không phải chữ thường</strong> — chỗ này làm nhiều người vấp, vì trong lời nói thường ngày "viết thường" đôi khi được hiểu là "không viết hoa lên". <code>islower('7')</code> bằng <strong>0</strong>. Hoa/thường là thuộc tính chỉ chữ cái mới có.</li>
<li><strong>Cách dùng điển hình: quyết định đổi chiều nào</strong> — "nếu là chữ thường thì đổi thành hoa, ngược lại để yên" chính là lõi của Exercise 1 ở slide 29. Kiểm trước rồi đổi sau thì dễ đọc hơn là đổi mù.</li>
<li><strong>Phép số học bên dưới</strong> — <code>'a'</code> là 97 và <code>'z'</code> là 122, một khối liên tục, nên trong ASCII thì <code>islower(c)</code> tương đương <code>c &gt;= 'a' &amp;&amp; c &lt;= 'z'</code>. Biết sự tương đương đó thì có ích; còn tự tay viết nó thay vì gọi thư viện thì không.</li>
<li><strong>Ví dụ trên slide</strong> — <code>char c = 'b';</code> in ra <code>b is a lowercase letter</code>, khớp cửa sổ console. Đổi thành <code>'B'</code> là nhánh else chạy.</li>
</ul>
<table>
<tr><th>c</th><th><code>islower(c)</code></th><th><code>isupper(c)</code></th><th><code>isalpha(c)</code></th></tr>
<tr><td><code>'b'</code></td><td>1</td><td>0</td><td>1</td></tr>
<tr><td><code>'a'</code></td><td>1</td><td>0</td><td>1</td></tr>
<tr><td><code>'Z'</code></td><td>0</td><td>1</td><td>1</td></tr>
<tr><td><code>'7'</code></td><td>0</td><td>0</td><td>0</td></tr>
<tr><td><code>' '</code></td><td>0</td><td>0</td><td>0</td></tr>
<tr><td><code>'!'</code></td><td>0</td><td>0</td><td>0</td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;ctype.h&gt;        /* slide ghi &lt;stdlib.h&gt; */

int main() {
  char c = 'b';
  if (islower(c)) { printf("%c is a lowercase letter\\n", c); }
  else { printf("%c is not a lowercase letter\\n", c); }
  return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch và chạy: in ra <code>b is a lowercase letter</code>, như trên slide. Cả bảng là kết quả đo; để ý ba hàng cuối đều bằng 0 ở <em>cả ba</em> cột — một ký tự không có khái niệm hoa/thường thì không phải thường mà cũng không phải hoa, và trạng thái thứ ba đó chính là thứ Exercise 1 phải xử lý.</p>
<p class="meo">💡 Hãy đọc bảng theo CỘT chứ đừng theo hàng: <code>islower</code> và <code>isupper</code> không bao giờ cùng bằng 1, và tổng của chúng đúng bằng <code>isalpha</code>. Một câu đó thay được ba định nghĩa và đủ để trả lời mọi câu trắc nghiệm dựng trên ba hàm này.</p>`],

      [25, 'isupper() Function',
        `<p class="y-chinh">🎯 <code>int isupper(int c);</code> — non-zero if the character is <strong>an uppercase letter</strong>, one of <code>'A'</code> … <code>'Z'</code>. The mirror image of slide 24.</p>
<ul>
<li><strong>The slide deliberately shows a FALSE case</strong> — its example sets <code>char c = 'b';</code> and the console prints <code>b is not an uppercase letter</code>. Every other example slide in this block shows a success; this one shows the <code>else</code> branch, so you see both halves of the pattern at least once.</li>
<li><strong>Uppercase and lowercase differ by exactly 32</strong> — <code>'A'</code> is 65, <code>'a'</code> is 97. That constant gap is why the old trick <code>c + 32</code> converts to lowercase, and why <code>toupper</code>/<code>tolower</code> are so cheap. It only holds inside ASCII.</li>
<li><strong>Use it for menu keys</strong> — the honest way to accept both <code>'Y'</code> and <code>'y'</code> is not two comparisons but one conversion: <code>if (toupper(answer) == 'Y')</code>. <code>isupper</code> is for when you must <em>know</em> the case, not merely normalise it.</li>
<li><strong>Not a spelling checker</strong> — <code>isupper</code> says nothing about whether a word is capitalised correctly, only about one character at a time. "Title case" is a loop over the string, testing position as well as character.</li>
<li><strong>Same header defect as slides 21–24</strong> — the printed include is <code>&lt;stdlib.h&gt;</code>. This is the last slide of the run; slides 26, 27, 28 are back to <code>&lt;ctype.h&gt;</code>.</li>
</ul>
<table>
<tr><th>c</th><th><code>isupper(c)</code></th><th>Mã ASCII</th><th>Ghi chú</th></tr>
<tr><td><code>'Z'</code></td><td>1</td><td>90</td><td>chữ hoa</td></tr>
<tr><td><code>'A'</code></td><td>1</td><td>65</td><td>chữ hoa</td></tr>
<tr><td><code>'b'</code></td><td>0</td><td>98</td><td>ví dụ trên slide</td></tr>
<tr><td><code>'7'</code></td><td>0</td><td>55</td><td>chữ số không có hoa/thường</td></tr>
<tr><td><code>' '</code></td><td>0</td><td>32</td><td>ký tự trắng</td></tr>
<tr><td><code>'?'</code></td><td>0</td><td>63</td><td>dấu câu</td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;ctype.h&gt;        /* slide ghi &lt;stdlib.h&gt; */

int main() {
  char c = 'b';
  if (isupper(c)) { printf("%c is an uppercase letter\\n", c); }
  else { printf("%c is not an uppercase letter\\n", c); }
  return 0;
}</code></pre>
<p class="dap-an">✅ Compiled and run: prints <code>b is not an uppercase letter</code>, exactly the slide's screenshot. Measured codes confirming the 32-gap: <code>'A'</code> = 65, <code>'a'</code> = 97, and <code>'a' - 'A'</code> = <strong>32</strong>.</p>
<p class="pitfall">⚠️ Never hard-code that 32. <code>c - 32</code> "works" on ASCII and produces nonsense the moment the character is not a lowercase letter — <code>'5' - 32</code> is the digit-less character <code>'\\x15'</code>. <code>toupper</code> already checks before it converts; that check is the whole reason the function exists.</p>`,
        `<p class="y-chinh">🎯 <code>int isupper(int c);</code> — trả về khác 0 nếu ký tự là <strong>chữ cái viết hoa</strong>, một trong <code>'A'</code> … <code>'Z'</code>. Ảnh phản chiếu của slide 24.</p>
<ul>
<li><strong>Slide cố ý đưa một ca SAI</strong> — ví dụ của nó đặt <code>char c = 'b';</code> và console in ra <code>b is not an uppercase letter</code>. Mọi slide ví dụ khác trong khối này đều cho ca đúng; riêng slide này cho nhánh <code>else</code>, để bạn thấy được cả hai nửa của khuôn mẫu ít nhất một lần.</li>
<li><strong>Chữ hoa và chữ thường lệch nhau đúng 32</strong> — <code>'A'</code> là 65, <code>'a'</code> là 97. Khoảng cách hằng số đó là lý do mẹo cũ <code>c + 32</code> đổi được sang chữ thường, và là lý do <code>toupper</code>/<code>tolower</code> rẻ đến thế. Nó chỉ đúng trong phạm vi ASCII.</li>
<li><strong>Dùng nó cho phím chọn menu</strong> — cách trung thực để nhận cả <code>'Y'</code> lẫn <code>'y'</code> không phải là hai phép so sánh mà là một phép đổi: <code>if (toupper(answer) == 'Y')</code>. <code>isupper</code> dành cho lúc bạn cần BIẾT chữ đang hoa hay thường, chứ không phải chỉ để chuẩn hoá.</li>
<li><strong>Không phải bộ kiểm chính tả</strong> — <code>isupper</code> không nói gì về việc một từ có viết hoa đúng chỗ hay không, nó chỉ xét một ký tự mỗi lần. "Viết hoa đầu từ" là một vòng lặp trên chuỗi, xét cả VỊ TRÍ chứ không chỉ ký tự.</li>
<li><strong>Vẫn lỗi header như slide 21–24</strong> — dòng include in ra là <code>&lt;stdlib.h&gt;</code>. Đây là slide cuối của chuỗi ấy; slide 26, 27, 28 quay lại đúng <code>&lt;ctype.h&gt;</code>.</li>
</ul>
<table>
<tr><th>c</th><th><code>isupper(c)</code></th><th>Mã ASCII</th><th>Ghi chú</th></tr>
<tr><td><code>'Z'</code></td><td>1</td><td>90</td><td>chữ hoa</td></tr>
<tr><td><code>'A'</code></td><td>1</td><td>65</td><td>chữ hoa</td></tr>
<tr><td><code>'b'</code></td><td>0</td><td>98</td><td>ví dụ trên slide</td></tr>
<tr><td><code>'7'</code></td><td>0</td><td>55</td><td>chữ số không có hoa/thường</td></tr>
<tr><td><code>' '</code></td><td>0</td><td>32</td><td>ký tự trắng</td></tr>
<tr><td><code>'?'</code></td><td>0</td><td>63</td><td>dấu câu</td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;ctype.h&gt;        /* slide ghi &lt;stdlib.h&gt; */

int main() {
  char c = 'b';
  if (isupper(c)) { printf("%c is an uppercase letter\\n", c); }
  else { printf("%c is not an uppercase letter\\n", c); }
  return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch và chạy: in ra <code>b is not an uppercase letter</code>, đúng y ảnh chụp trên slide. Các mã đo được xác nhận khoảng cách 32: <code>'A'</code> = 65, <code>'a'</code> = 97, và <code>'a' - 'A'</code> = <strong>32</strong>.</p>
<p class="pitfall">⚠️ Đừng bao giờ gõ cứng con số 32 ấy. <code>c - 32</code> "chạy được" trên ASCII và cho ra thứ vô nghĩa ngay khi ký tự không phải chữ thường — <code>'5' - 32</code> ra ký tự điều khiển <code>'\\x15'</code>. <code>toupper</code> đã kiểm tra trước khi đổi; chính phép kiểm đó là lý do tồn tại của hàm.</p>`],

      [26, 'isspace() Function',
        `<p class="y-chinh">🎯 <code>int isspace(int c);</code> — non-zero for <strong>any whitespace</strong> character. The slide names three (space, tab, newline); the C standard defines <strong>six</strong>, and the extra three are the ones that catch you out.</p>
<ul>
<li><strong>The full list of six</strong> — space <code>' '</code>, horizontal tab <code>'\\t'</code>, newline <code>'\\n'</code>, carriage return <code>'\\r'</code>, form feed <code>'\\f'</code> and vertical tab <code>'\\v'</code>. The slide's "spaces, tabs and newline characters" is a simplification, not the whole definition.</li>
<li><strong>Why <code>'\\r'</code> is worth knowing</strong> — Windows text files end each line with <code>'\\r''\\n'</code>. Read such a file on Linux with <code>isblank</code> and the stray <code>'\\r'</code> survives into your data; with <code>isspace</code> it is swallowed correctly. That is a real bug class, not trivia.</li>
<li><strong>The standard skipping idiom</strong> — <code>while (isspace(c)) c = getchar();</code> walks past every kind of gap. This is how nearly all hand-written parsers start, and it is the second half of this deck's subject.</li>
<li><strong><code>scanf("%d")</code> already does this</strong> — it skips leading whitespace for you, which is why it seems forgiving until you use <code>%c</code>, which does not skip. Knowing what <code>isspace</code> covers explains why those two behave so differently.</li>
<li><strong>The slide's example</strong> — <code>char c = ' ';</code> prints <code>is whitespace</code> (the leading space is the invisible <code>%c</code>). This slide has the correct <code>#include &lt;ctype.h&gt;</code>.</li>
</ul>
<table>
<tr><th>c</th><th><code>isspace(c)</code></th><th><code>isblank(c)</code></th><th>Tên</th></tr>
<tr><td><code>' '</code></td><td>1</td><td>1</td><td>dấu cách</td></tr>
<tr><td><code>'\\t'</code></td><td>1</td><td>1</td><td>tab ngang</td></tr>
<tr><td><code>'\\n'</code></td><td>1</td><td>0</td><td>xuống dòng</td></tr>
<tr><td><code>'\\r'</code></td><td>1</td><td>0</td><td>về đầu dòng</td></tr>
<tr><td><code>'\\f'</code></td><td>1</td><td>0</td><td>sang trang</td></tr>
<tr><td><code>'\\v'</code></td><td>1</td><td>0</td><td>tab dọc</td></tr>
<tr><td><code>'a'</code> / <code>'7'</code> / <code>'!'</code></td><td>0</td><td>0</td><td>không phải khoảng trắng</td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;ctype.h&gt;

int main() {
  char c = ' ';
  if (isspace(c)) { printf("[%c] is whitespace\\n", c); }
  else { printf("[%c] is not whitespace\\n", c); }
  return 0;
}</code></pre>
<p class="dap-an">✅ Every row measured with a real program: <code>isspace</code> returned 1 for all six of <code>' ' '\\t' '\\n' '\\r' '\\f' '\\v'</code> and 0 for <code>'a'</code>, <code>'Z'</code>, <code>'7'</code>, <code>'!'</code>, <code>'_'</code>. So the slide's three-item list is <strong>incomplete but not wrong</strong> — the three it names really are whitespace; three more exist that it does not mention.</p>
<p class="meo">💡 Remember the six as a picture: two that move sideways (<code>' '</code>, <code>'\\t'</code>) and four that move the paper (<code>'\\n'</code>, <code>'\\r'</code>, <code>'\\f'</code>, <code>'\\v'</code>). The two sideways ones are precisely <code>isblank</code>; all six are <code>isspace</code>. The names come from mechanical typewriters, and the mental image survives.</p>`,
        `<p class="y-chinh">🎯 <code>int isspace(int c);</code> — trả về khác 0 với <strong>mọi ký tự khoảng trắng</strong>. Slide nêu ba cái (dấu cách, tab, xuống dòng); chuẩn C định nghĩa <strong>sáu</strong>, và ba cái còn lại chính là chỗ làm bạn vấp.</p>
<ul>
<li><strong>Danh sách đủ sáu</strong> — dấu cách <code>' '</code>, tab ngang <code>'\\t'</code>, xuống dòng <code>'\\n'</code>, về đầu dòng <code>'\\r'</code>, sang trang <code>'\\f'</code> và tab dọc <code>'\\v'</code>. Câu "dấu cách, tab và ký tự xuống dòng" của slide là một cách nói gọn, không phải định nghĩa đầy đủ.</li>
<li><strong>Vì sao đáng biết <code>'\\r'</code></strong> — tệp văn bản Windows kết thúc mỗi dòng bằng <code>'\\r''\\n'</code>. Đọc tệp như thế trên Linux bằng <code>isblank</code> thì cái <code>'\\r'</code> lạc lõng sẽ sống sót và chui vào dữ liệu của bạn; với <code>isspace</code> thì nó được nuốt đúng cách. Đây là một lớp lỗi có thật, không phải chuyện vặt.</li>
<li><strong>Lối viết bỏ qua khoảng trắng chuẩn mực</strong> — <code>while (isspace(c)) c = getchar();</code> đi qua mọi loại khoảng trống. Gần như mọi bộ phân tích cú pháp viết tay đều mở đầu như vậy, và đó là nửa sau của chủ đề bộ slide này.</li>
<li><strong><code>scanf("%d")</code> đã làm sẵn việc đó</strong> — nó tự bỏ qua khoảng trắng đứng trước, vì thế nó có vẻ dễ tính cho tới khi bạn dùng <code>%c</code>, thứ KHÔNG bỏ qua. Biết <code>isspace</code> bao gồm những gì là giải thích được vì sao hai cái ấy hành xử khác nhau đến vậy.</li>
<li><strong>Ví dụ trên slide</strong> — <code>char c = ' ';</code> in ra <code>is whitespace</code> (khoảng trống đứng đầu chính là <code>%c</code> vô hình). Slide này ghi đúng <code>#include &lt;ctype.h&gt;</code>.</li>
</ul>
<table>
<tr><th>c</th><th><code>isspace(c)</code></th><th><code>isblank(c)</code></th><th>Tên</th></tr>
<tr><td><code>' '</code></td><td>1</td><td>1</td><td>dấu cách</td></tr>
<tr><td><code>'\\t'</code></td><td>1</td><td>1</td><td>tab ngang</td></tr>
<tr><td><code>'\\n'</code></td><td>1</td><td>0</td><td>xuống dòng</td></tr>
<tr><td><code>'\\r'</code></td><td>1</td><td>0</td><td>về đầu dòng</td></tr>
<tr><td><code>'\\f'</code></td><td>1</td><td>0</td><td>sang trang</td></tr>
<tr><td><code>'\\v'</code></td><td>1</td><td>0</td><td>tab dọc</td></tr>
<tr><td><code>'a'</code> / <code>'7'</code> / <code>'!'</code></td><td>0</td><td>0</td><td>không phải khoảng trắng</td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;ctype.h&gt;

int main() {
  char c = ' ';
  if (isspace(c)) { printf("[%c] is whitespace\\n", c); }
  else { printf("[%c] is not whitespace\\n", c); }
  return 0;
}</code></pre>
<p class="dap-an">✅ Từng hàng đều đo bằng chương trình thật: <code>isspace</code> trả 1 cho cả sáu ký tự <code>' ' '\\t' '\\n' '\\r' '\\f' '\\v'</code> và trả 0 cho <code>'a'</code>, <code>'Z'</code>, <code>'7'</code>, <code>'!'</code>, <code>'_'</code>. Vậy danh sách ba mục của slide là <strong>thiếu chứ không sai</strong> — ba cái nó nêu đúng là khoảng trắng thật; còn ba cái nữa mà nó không nhắc tới.</p>
<p class="meo">💡 Nhớ sáu cái bằng một hình ảnh: hai cái đi NGANG (<code>' '</code>, <code>'\\t'</code>) và bốn cái làm CHẠY GIẤY (<code>'\\n'</code>, <code>'\\r'</code>, <code>'\\f'</code>, <code>'\\v'</code>). Hai cái đi ngang chính là <code>isblank</code>; cả sáu là <code>isspace</code>. Các tên gọi này đến từ máy đánh chữ cơ khí, và hình ảnh ấy vẫn còn dùng được.</p>`],

      [27, 'tolower() Function',
        `<p class="y-chinh">🎯 <code>int tolower(int c);</code> — "returns the ASCII value of a lowercase version of the character". Read the verb: it <strong>returns</strong>. It does not change your variable.</p>
<ul>
<li><strong>The mistake this slide is really about</strong> — writing <code>tolower(c);</code> on a line by itself does nothing at all. The converted value is computed, returned, and thrown away. You must write <code>c = tolower(c);</code> or use the result directly in an expression.</li>
<li><strong>Non-letters pass through unchanged</strong> — <code>tolower('5')</code> is <code>'5'</code>, <code>tolower('!')</code> is <code>'!'</code>, <code>tolower(' ')</code> is <code>' '</code>. There is no "error" case: it lowercases what can be lowercased and returns everything else untouched. That is what makes it safe to call on every character of a string.</li>
<li><strong>Already-lowercase input is also unchanged</strong> — <code>tolower('a')</code> is <code>'a'</code>. So you do not need <code>if (isupper(c)) c = tolower(c);</code>; the <code>if</code> is redundant. Slides 24–25 are for when you need to <em>know</em> the case, not when you just want to normalise it.</li>
<li><strong>The return type is <code>int</code>, which matters for printing</strong> — the slide's example stores it back in a <code>char</code> (<code>char l = tolower(u);</code>) and prints with <code>%c</code>. If you print the result of <code>tolower</code> directly with <code>%d</code> you get the code (97), not the letter.</li>
<li><strong>The classic use: case-insensitive comparison</strong> — <code>if (tolower(a) == tolower(b))</code> compares two characters ignoring case, in one line, correctly, without touching either variable.</li>
</ul>
<table>
<tr><th>c</th><th><code>tolower(c)</code> (mã)</th><th>Ký tự ra</th><th>Có đổi không</th></tr>
<tr><td><code>'A'</code> (65)</td><td>97</td><td><code>'a'</code></td><td>✔ đổi</td></tr>
<tr><td><code>'Z'</code> (90)</td><td>122</td><td><code>'z'</code></td><td>✔ đổi</td></tr>
<tr><td><code>'a'</code> (97)</td><td>97</td><td><code>'a'</code></td><td>giữ nguyên</td></tr>
<tr><td><code>'5'</code> (53)</td><td>53</td><td><code>'5'</code></td><td>giữ nguyên</td></tr>
<tr><td><code>' '</code> (32)</td><td>32</td><td><code>' '</code></td><td>giữ nguyên</td></tr>
<tr><td><code>'!'</code> (33)</td><td>33</td><td><code>'!'</code></td><td>giữ nguyên</td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;ctype.h&gt;

int main() {
  char u = 'A';
  char l = tolower(u);
  printf("%c in lowercase is %c\\n", u, l);
  return 0;
}</code></pre>
<p class="dap-an">✅ Compiled and run: prints <code>A in lowercase is a</code>, exactly the slide's screenshot. Measured codes for the table: <code>tolower('A') = 97</code>, <code>tolower('Z') = 122</code>, <code>tolower('5') = 53</code> (unchanged), <code>tolower(' ') = 32</code> (unchanged), <code>tolower('!') = 33</code> (unchanged).</p>
<p class="pitfall">⚠️ Proven by running it: after the statement <code>toupper(x);</code> with <code>x = 'a'</code>, the variable <code>x</code> was still <strong>'a'</strong>; only after <code>x = toupper(x);</code> did it become <strong>'A'</strong>. The compiler even warned — <em>"ignoring return value of function"</em> — which is one more reason to compile with <code>-Wall</code>.</p>`,
        `<p class="y-chinh">🎯 <code>int tolower(int c);</code> — "trả về mã ASCII của bản chữ thường của ký tự". Hãy đọc kỹ động từ: nó <strong>TRẢ VỀ</strong>. Nó không sửa biến của bạn.</p>
<ul>
<li><strong>Lỗi mà slide này thật sự nói tới</strong> — viết <code>tolower(c);</code> đứng riêng một dòng thì chẳng làm gì cả. Giá trị đã đổi được tính ra, được trả về, rồi bị vứt đi. Bạn phải viết <code>c = tolower(c);</code> hoặc dùng thẳng kết quả trong một biểu thức.</li>
<li><strong>Ký tự không phải chữ cái đi qua nguyên vẹn</strong> — <code>tolower('5')</code> là <code>'5'</code>, <code>tolower('!')</code> là <code>'!'</code>, <code>tolower(' ')</code> là <code>' '</code>. Không có ca "lỗi" nào: nó hạ chữ nào hạ được và trả lại nguyên vẹn mọi thứ còn lại. Chính điều đó khiến nó an toàn khi gọi trên từng ký tự của cả một chuỗi.</li>
<li><strong>Dữ liệu vào vốn đã là chữ thường thì cũng không đổi</strong> — <code>tolower('a')</code> là <code>'a'</code>. Nên bạn không cần <code>if (isupper(c)) c = tolower(c);</code>; cái <code>if</code> ấy thừa. Slide 24–25 dành cho lúc bạn cần BIẾT hoa hay thường, chứ không phải lúc chỉ muốn chuẩn hoá.</li>
<li><strong>Kiểu trả về là <code>int</code>, và điều đó quan trọng khi in</strong> — ví dụ trên slide cất nó lại vào một <code>char</code> (<code>char l = tolower(u);</code>) rồi in bằng <code>%c</code>. Nếu bạn in thẳng kết quả của <code>tolower</code> bằng <code>%d</code> thì nhận được mã số (97), không phải chữ cái.</li>
<li><strong>Công dụng kinh điển: so sánh không phân biệt hoa thường</strong> — <code>if (tolower(a) == tolower(b))</code> so hai ký tự bất kể hoa thường, gọn một dòng, đúng, và không đụng vào biến nào.</li>
</ul>
<table>
<tr><th>c</th><th><code>tolower(c)</code> (mã)</th><th>Ký tự ra</th><th>Có đổi không</th></tr>
<tr><td><code>'A'</code> (65)</td><td>97</td><td><code>'a'</code></td><td>✔ đổi</td></tr>
<tr><td><code>'Z'</code> (90)</td><td>122</td><td><code>'z'</code></td><td>✔ đổi</td></tr>
<tr><td><code>'a'</code> (97)</td><td>97</td><td><code>'a'</code></td><td>giữ nguyên</td></tr>
<tr><td><code>'5'</code> (53)</td><td>53</td><td><code>'5'</code></td><td>giữ nguyên</td></tr>
<tr><td><code>' '</code> (32)</td><td>32</td><td><code>' '</code></td><td>giữ nguyên</td></tr>
<tr><td><code>'!'</code> (33)</td><td>33</td><td><code>'!'</code></td><td>giữ nguyên</td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;ctype.h&gt;

int main() {
  char u = 'A';
  char l = tolower(u);
  printf("%c in lowercase is %c\\n", u, l);
  return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch và chạy: in ra <code>A in lowercase is a</code>, đúng y ảnh chụp trên slide. Các mã đo được cho bảng: <code>tolower('A') = 97</code>, <code>tolower('Z') = 122</code>, <code>tolower('5') = 53</code> (không đổi), <code>tolower(' ') = 32</code> (không đổi), <code>tolower('!') = 33</code> (không đổi).</p>
<p class="pitfall">⚠️ Đã chứng minh bằng cách chạy thật: sau câu lệnh <code>toupper(x);</code> với <code>x = 'a'</code>, biến <code>x</code> vẫn là <strong>'a'</strong>; chỉ sau <code>x = toupper(x);</code> nó mới thành <strong>'A'</strong>. Trình biên dịch còn cảnh báo luôn — <em>"ignoring return value of function"</em> — thêm một lý do nữa để luôn biên dịch với <code>-Wall</code>.</p>`],

      [28, 'toupper() Function',
        `<p class="y-chinh">🎯 <code>int toupper(int c);</code> — "returns the ASCII value of an uppercase version of the character". Same contract as <code>tolower</code>, opposite direction.</p>
<ul>
<li><strong>The slide's example reads in reverse</strong> — <code>char l = 'a'; char u = toupper(l);</code> then prints <code>a in uppercase is A</code>. Compare it to slide 27 line by line: only the two variable names and the function name changed.</li>
<li><strong>Where it earns its keep: menu answers</strong> — <code>if (toupper(ch) == 'Y')</code> accepts both <code>'y'</code> and <code>'Y'</code> in one comparison. Writing <code>if (ch == 'y' || ch == 'Y')</code> works too, but it stops scaling the moment you have more than two options.</li>
<li><strong>Uppercasing a whole string</strong> — the loop is <code>for (i = 0; s[i] != '\\0'; i++) s[i] = toupper(s[i]);</code>. Note the assignment back into <code>s[i]</code>; without it, nothing happens (slide 27's lesson again). You will write this loop in Slot 16-18.</li>
<li><strong>It cannot uppercase Vietnamese</strong> — <code>'đ'</code> is two bytes in UTF-8 and <code>toupper</code> works on one byte, so the result is mangled, not capitalised. Use <code>ctype.h</code> for ASCII data; anything else needs a proper Unicode library.</li>
<li><strong>One subtle guarantee</strong> — <code>toupper(tolower(c))</code> equals <code>toupper(c)</code> for every ASCII character, and the pair is a clean round trip for letters. For non-letters both functions are the identity, which is what makes chaining them safe.</li>
</ul>
<table>
<tr><th>c</th><th><code>toupper(c)</code> (mã)</th><th>Ký tự ra</th><th>Có đổi không</th></tr>
<tr><td><code>'a'</code> (97)</td><td>65</td><td><code>'A'</code></td><td>✔ đổi</td></tr>
<tr><td><code>'b'</code> (98)</td><td>66</td><td><code>'B'</code></td><td>✔ đổi</td></tr>
<tr><td><code>'Z'</code> (90)</td><td>90</td><td><code>'Z'</code></td><td>giữ nguyên</td></tr>
<tr><td><code>'7'</code> (55)</td><td>55</td><td><code>'7'</code></td><td>giữ nguyên</td></tr>
<tr><td><code>' '</code> (32)</td><td>32</td><td><code>' '</code></td><td>giữ nguyên</td></tr>
<tr><td><code>'!'</code> (33)</td><td>33</td><td><code>'!'</code></td><td>giữ nguyên</td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;ctype.h&gt;

int main() {
  char l = 'a';
  char u = toupper(l);
  printf("%c in uppercase is %c\\n", l, u);
  return 0;
}</code></pre>
<p class="dap-an">✅ Compiled and run: prints <code>a in uppercase is A</code>, matching the slide. Measured: <code>toupper('a') = 65</code>, <code>toupper('b') = 66</code>, <code>toupper('Z') = 90</code> (unchanged), <code>toupper('7') = 55</code> (unchanged), <code>toupper('!') = 33</code> (unchanged).</p>
<p class="pitfall">⚠️ The one real portability trap in this whole header: these functions take an <code>int</code>, and passing a <em>signed</em> <code>char</code> holding a byte above 127 gives a negative index and undefined behaviour. Measured here: <code>CHAR_MIN = -128</code>, so <code>(char) 0xE9</code> came out as <strong>−23</strong>. The correct, always-safe form is <code>toupper((unsigned char) c)</code>.</p>`,
        `<p class="y-chinh">🎯 <code>int toupper(int c);</code> — "trả về mã ASCII của bản chữ hoa của ký tự". Cùng bản hợp đồng với <code>tolower</code>, ngược chiều.</p>
<ul>
<li><strong>Ví dụ trên slide đọc ngược lại</strong> — <code>char l = 'a'; char u = toupper(l);</code> rồi in <code>a in uppercase is A</code>. So với slide 27 từng dòng: chỉ đổi hai tên biến và tên hàm.</li>
<li><strong>Chỗ nó xứng đồng tiền: câu trả lời của menu</strong> — <code>if (toupper(ch) == 'Y')</code> nhận cả <code>'y'</code> lẫn <code>'Y'</code> trong một phép so sánh. Viết <code>if (ch == 'y' || ch == 'Y')</code> cũng chạy, nhưng hết đường mở rộng ngay khi bạn có hơn hai lựa chọn.</li>
<li><strong>Đổi cả chuỗi sang chữ hoa</strong> — vòng lặp là <code>for (i = 0; s[i] != '\\0'; i++) s[i] = toupper(s[i]);</code>. Để ý phép GÁN NGƯỢC vào <code>s[i]</code>; thiếu nó thì không có gì xảy ra (lại đúng bài học slide 27). Bạn sẽ viết vòng lặp này ở Slot 16-18.</li>
<li><strong>Nó không viết hoa được tiếng Việt</strong> — <code>'đ'</code> là hai byte trong UTF-8 mà <code>toupper</code> làm việc trên một byte, nên kết quả là méo mó chứ không phải viết hoa. Dùng <code>ctype.h</code> cho dữ liệu ASCII; thứ khác thì cần một thư viện Unicode đàng hoàng.</li>
<li><strong>Một bảo đảm tinh tế</strong> — <code>toupper(tolower(c))</code> bằng <code>toupper(c)</code> với mọi ký tự ASCII, và cặp này là một vòng đi–về sạch sẽ cho chữ cái. Với ký tự không phải chữ cái thì cả hai hàm đều là phép đồng nhất, và chính điều đó làm việc ghép chúng an toàn.</li>
</ul>
<table>
<tr><th>c</th><th><code>toupper(c)</code> (mã)</th><th>Ký tự ra</th><th>Có đổi không</th></tr>
<tr><td><code>'a'</code> (97)</td><td>65</td><td><code>'A'</code></td><td>✔ đổi</td></tr>
<tr><td><code>'b'</code> (98)</td><td>66</td><td><code>'B'</code></td><td>✔ đổi</td></tr>
<tr><td><code>'Z'</code> (90)</td><td>90</td><td><code>'Z'</code></td><td>giữ nguyên</td></tr>
<tr><td><code>'7'</code> (55)</td><td>55</td><td><code>'7'</code></td><td>giữ nguyên</td></tr>
<tr><td><code>' '</code> (32)</td><td>32</td><td><code>' '</code></td><td>giữ nguyên</td></tr>
<tr><td><code>'!'</code> (33)</td><td>33</td><td><code>'!'</code></td><td>giữ nguyên</td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;ctype.h&gt;

int main() {
  char l = 'a';
  char u = toupper(l);
  printf("%c in uppercase is %c\\n", l, u);
  return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch và chạy: in ra <code>a in uppercase is A</code>, khớp slide. Đo được: <code>toupper('a') = 65</code>, <code>toupper('b') = 66</code>, <code>toupper('Z') = 90</code> (không đổi), <code>toupper('7') = 55</code> (không đổi), <code>toupper('!') = 33</code> (không đổi).</p>
<p class="pitfall">⚠️ Cái bẫy khả chuyển thật sự duy nhất của cả header này: các hàm nhận <code>int</code>, và truyền vào một <code>char</code> <em>có dấu</em> đang giữ một byte lớn hơn 127 thì được một chỉ số ÂM và hành vi không xác định. Đo tại chỗ: <code>CHAR_MIN = -128</code>, nên <code>(char) 0xE9</code> ra <strong>−23</strong>. Dạng đúng và luôn an toàn là <code>toupper((unsigned char) c)</code>.</p>`],

      [29, 'Exercise 1: Character Classification',
        `<p class="y-chinh">🎯 The exercise, word for word: read one character and decide (1) whether it is a digit, an uppercase letter, a lowercase letter, or none of these; and (2) if it is a letter, convert it to the <strong>opposite</strong> case.</p>
<ul>
<li><strong>Part 1 is a four-way classification</strong> — and the fourth branch is the one students forget. <code>'@'</code>, <code>' '</code> and <code>'\\n'</code> are none of the three, so a bare <code>if/else if/else if</code> without a final <code>else</code> silently prints nothing for them.</li>
<li><strong>Part 2 is conditional on part 1</strong> — "if it is a letter". Digits and punctuation get no conversion line at all, so the two parts are not one chain: first classify, then (separately) convert when applicable.</li>
<li><strong>"Opposite case" needs both converters</strong> — <code>isupper(c) ? tolower(c) : toupper(c)</code>. A single <code>toupper</code> would turn <code>'K'</code> into <code>'K'</code>, which is not "the opposite". The conditional operator says this in one line; an <code>if/else</code> says it in four.</li>
<li><strong>Read with <code>getchar()</code>, store in an <code>int</code></strong> — <code>int c = getchar();</code>. Using <code>int</code> rather than <code>char</code> lets you detect <code>EOF</code> (−1) and is exactly what the <code>ctype.h</code> prototypes want. This is the same reasoning as slide 19's "they all take <code>int</code>".</li>
<li><strong>Order the tests from specific to general</strong> — <code>isdigit</code> first, then <code>isupper</code>, then <code>islower</code>, then the catch-all. Because the three are mutually exclusive the order does not change the result here, but the habit matters the moment the categories overlap (e.g. if you added <code>isalnum</code>).</li>
</ul>
<pre><code>/* Exercise 1: Character Classification */
#include &lt;stdio.h&gt;
#include &lt;ctype.h&gt;

int main(void)
{
    int c;

    printf("Enter a character: ");
    c = getchar();                 /* doc 1 ky tu, giu nguyen ma int */

    if (c == EOF) {
        printf("No character entered.\\n");
        return 1;
    }

    if (isdigit(c))
        printf("'%c' is a digit.\\n", c);
    else if (isupper(c))
        printf("'%c' is an uppercase letter.\\n", c);
    else if (islower(c))
        printf("'%c' is a lowercase letter.\\n", c);
    else
        printf("'%c' is none of these (code %d).\\n", c, c);

    if (isalpha(c)) {
        int opposite = isupper(c) ? tolower(c) : toupper(c);
        printf("Opposite case: '%c' -&gt; '%c'\\n", c, opposite);
    }
    return 0;
}</code></pre>
<p class="dap-an">✅ Compiled with <code>cc -Wall -std=c99 ex1.c -o ex1</code> and run against five inputs. Real output:</p>
<table>
<tr><th>Nhập</th><th>Dòng phân loại</th><th>Dòng đổi hoa/thường</th></tr>
<tr><td><code>K</code></td><td>'K' is an uppercase letter.</td><td>'K' -&gt; 'k'</td></tr>
<tr><td><code>q</code></td><td>'q' is a lowercase letter.</td><td>'q' -&gt; 'Q'</td></tr>
<tr><td><code>7</code></td><td>'7' is a digit.</td><td>(không in — đúng yêu cầu)</td></tr>
<tr><td><code>@</code></td><td>'@' is none of these (code 64).</td><td>(không in)</td></tr>
<tr><td><code>(dấu cách)</code></td><td>' ' is none of these (code 32).</td><td>(không in)</td></tr>
</table>
<p class="meo">💡 Two upgrades worth doing yourself. (a) Wrap the whole body in <code>while ((c = getchar()) != EOF)</code> and it classifies an entire typed line, one character per line of output. (b) Replace the conditional operator with <code>c = isupper(c) ? tolower(c) : toupper(c);</code> and print <code>c</code> — same answer, and it forces you to remember that these functions return rather than modify.</p>`,
        `<p class="y-chinh">🎯 Đề bài, chép đúng từng chữ: đọc một ký tự rồi xác định (1) nó là chữ số, chữ hoa, chữ thường, hay không thuộc nhóm nào; và (2) nếu là chữ cái thì đổi nó sang <strong>trường hợp ngược lại</strong> (hoa thành thường và ngược lại).</p>
<ul>
<li><strong>Phần 1 là phép phân loại bốn nhánh</strong> — và nhánh thứ tư mới là chỗ sinh viên hay quên. <code>'@'</code>, <code>' '</code> và <code>'\\n'</code> không thuộc ba nhóm kia, nên một chuỗi <code>if/else if/else if</code> trơ trọi không có <code>else</code> cuối sẽ im lặng không in gì cho chúng.</li>
<li><strong>Phần 2 phụ thuộc vào phần 1</strong> — "nếu là chữ cái". Chữ số và dấu câu không có dòng chuyển đổi nào cả, nên hai phần không phải một chuỗi liền: phân loại trước, rồi (riêng biệt) mới đổi khi đủ điều kiện.</li>
<li><strong>"Trường hợp ngược lại" cần CẢ HAI hàm đổi</strong> — <code>isupper(c) ? tolower(c) : toupper(c)</code>. Chỉ một <code>toupper</code> thì <code>'K'</code> vẫn ra <code>'K'</code>, và đó không phải "ngược lại". Toán tử điều kiện nói điều này trong một dòng; <code>if/else</code> nói nó trong bốn dòng.</li>
<li><strong>Đọc bằng <code>getchar()</code>, cất vào <code>int</code></strong> — <code>int c = getchar();</code>. Dùng <code>int</code> thay vì <code>char</code> cho phép bạn phát hiện <code>EOF</code> (−1) và đúng là thứ mà các nguyên mẫu của <code>ctype.h</code> mong muốn. Cùng lý lẽ với câu "cả chín hàm đều nhận <code>int</code>" ở slide 19.</li>
<li><strong>Xếp các phép kiểm từ hẹp tới rộng</strong> — <code>isdigit</code> trước, rồi <code>isupper</code>, rồi <code>islower</code>, rồi nhánh vét. Vì ba nhóm loại trừ lẫn nhau nên ở đây thứ tự không đổi kết quả, nhưng thói quen ấy trở nên quan trọng ngay khi các nhóm chồng lấn (ví dụ nếu bạn thêm <code>isalnum</code> vào).</li>
</ul>
<pre><code>/* Exercise 1: Character Classification */
#include &lt;stdio.h&gt;
#include &lt;ctype.h&gt;

int main(void)
{
    int c;

    printf("Enter a character: ");
    c = getchar();                 /* doc 1 ky tu, giu nguyen ma int */

    if (c == EOF) {
        printf("No character entered.\\n");
        return 1;
    }

    if (isdigit(c))
        printf("'%c' is a digit.\\n", c);
    else if (isupper(c))
        printf("'%c' is an uppercase letter.\\n", c);
    else if (islower(c))
        printf("'%c' is a lowercase letter.\\n", c);
    else
        printf("'%c' is none of these (code %d).\\n", c, c);

    if (isalpha(c)) {
        int opposite = isupper(c) ? tolower(c) : toupper(c);
        printf("Opposite case: '%c' -&gt; '%c'\\n", c, opposite);
    }
    return 0;
}</code></pre>
<p class="dap-an">✅ Biên dịch bằng <code>cc -Wall -std=c99 ex1.c -o ex1</code> rồi chạy với năm dữ liệu vào. Kết quả thật:</p>
<table>
<tr><th>Nhập</th><th>Dòng phân loại</th><th>Dòng đổi hoa/thường</th></tr>
<tr><td><code>K</code></td><td>'K' is an uppercase letter.</td><td>'K' -&gt; 'k'</td></tr>
<tr><td><code>q</code></td><td>'q' is a lowercase letter.</td><td>'q' -&gt; 'Q'</td></tr>
<tr><td><code>7</code></td><td>'7' is a digit.</td><td>(không in — đúng yêu cầu)</td></tr>
<tr><td><code>@</code></td><td>'@' is none of these (code 64).</td><td>(không in)</td></tr>
<tr><td><code>(dấu cách)</code></td><td>' ' is none of these (code 32).</td><td>(không in)</td></tr>
</table>
<p class="meo">💡 Hai nâng cấp đáng tự làm. (a) Bọc cả thân chương trình trong <code>while ((c = getchar()) != EOF)</code> là nó phân loại nguyên một dòng bạn gõ, mỗi ký tự một dòng kết quả. (b) Thay toán tử điều kiện bằng <code>c = isupper(c) ? tolower(c) : toupper(c);</code> rồi in <code>c</code> — cùng đáp số, và nó buộc bạn nhớ rằng các hàm này TRẢ VỀ chứ không sửa tại chỗ.</p>`],

      [30, 'Summary',
        `<p class="y-chinh">🎯 The closing slide lists the four libraries once more — Standard <code>stdlib.h</code>, Time <code>time.h</code>, Math <code>math.h</code>, Character <code>ctype.h</code> — and ends with Q&amp;A. Here is the whole block compressed into what you must be able to reproduce.</p>
<ul>
<li><strong><code>stdlib.h</code></strong> — <code>abs</code>/<code>labs</code>/<code>llabs</code> for integer absolute value; <code>rand()</code> for a pseudo-random <code>int</code> in 0…<code>RAND_MAX</code>; <code>srand(seed)</code> called <strong>once</strong>, with <code>time(NULL)</code>, before the first <code>rand</code>. Range formula: <code>min + rand() % (max - min + 1)</code>.</li>
<li><strong><code>math.h</code></strong> — everything is <code>double</code> in, <code>double</code> out. <code>floor</code> down, <code>ceil</code> up, <code>round</code> nearest, <code>trunc</code> chop; <code>sqrt</code>, <code>pow(base, exp)</code>, <code>log</code> (natural), <code>exp</code>. On Linux compile with <code>-lm</code>. C has no <code>^</code> operator.</li>
<li><strong><code>time.h</code></strong> — <code>time_t</code> and <code>clock_t</code>; <code>time(NULL)</code> for now, <code>difftime(t2, t1)</code> for whole seconds, <code>clock()</code> divided by <code>CLOCKS_PER_SEC</code> for a precise CPU measurement.</li>
<li><strong><code>ctype.h</code></strong> — seven <code>is…</code> questions returning non-zero for true (never compare with 1), two <code>to…</code> converters that <em>return</em> a value rather than modify their argument. All nine take an <code>int</code>; the safe call is <code>isalpha((unsigned char) c)</code>.</li>
<li><strong>The three traps this block plants for later chapters</strong> — integer division sneaking into a <code>double</code> expression (slides 9 and 17), an unseeded or over-seeded <code>rand</code> (slides 7 and 10), and calling a <code>to…</code> function without assigning the result (slide 27). All three will reappear in Strings and Files.</li>
<li><strong>What comes next in this same deck</strong> — slides 31–65: types of input, buffered vs unbuffered, <code>getchar()</code>, clearing the keyboard buffer, <code>scanf</code>, and input validation. That second half is where <code>ctype.h</code> stops being an exercise and becomes the tool you use every day.</li>
</ul>
<table>
<tr><th>Header</th><th>Phải thuộc</th><th>Bẫy hay dính</th></tr>
<tr><td><code>stdlib.h</code></td><td><code>abs</code>, <code>rand</code>, <code>srand</code>, <code>RAND_MAX</code></td><td>quên <code>srand</code>, hoặc gọi trong vòng lặp</td></tr>
<tr><td><code>math.h</code></td><td><code>floor</code> <code>ceil</code> <code>round</code> <code>trunc</code> <code>sqrt</code> <code>pow</code></td><td>dùng <code>^</code>, quên <code>-lm</code>, nhầm <code>abs</code>/<code>fabs</code></td></tr>
<tr><td><code>time.h</code></td><td><code>time</code>, <code>difftime</code>, <code>clock</code>, <code>CLOCKS_PER_SEC</code></td><td>chia nguyên khi đổi nhịp ra giây</td></tr>
<tr><td><code>ctype.h</code></td><td>7 hàm <code>is…</code> + <code>tolower</code>/<code>toupper</code></td><td>so <code>== 1</code>; quên gán lại kết quả</td></tr>
</table>
<p class="dap-an">✅ Every claim in this summary was checked by compiling and running code, not by reading the slides: the random formula was hammered 200 000 times (min 6, max 100), the nine <code>math.h</code> results were printed at full precision, <code>CLOCKS_PER_SEC</code> was measured as 1000000 here against the slide's 1000 for Dev-C++, and the nine <code>ctype.h</code> functions were tabulated over sixteen different characters.</p>
<p class="meo">💡 Before the Q&amp;A, do this self-test on one sheet of paper: write from memory the header each of these lives in — <code>sqrt</code>, <code>abs</code>, <code>fabs</code>, <code>rand</code>, <code>time</code>, <code>toupper</code>, <code>isdigit</code>, <code>pow</code>. Getting <code>abs</code> and <code>fabs</code> into different headers is the one that separates a pass from a distinction on this topic.</p>`,
        `<p class="y-chinh">🎯 Slide kết liệt kê lại bốn thư viện — Standard <code>stdlib.h</code>, Time <code>time.h</code>, Math <code>math.h</code>, Character <code>ctype.h</code> — rồi kết thúc bằng Q&amp;A. Dưới đây là cả khối nén lại thành những thứ bạn phải viết ra được.</p>
<ul>
<li><strong><code>stdlib.h</code></strong> — <code>abs</code>/<code>labs</code>/<code>llabs</code> cho giá trị tuyệt đối số nguyên; <code>rand()</code> cho một <code>int</code> giả ngẫu nhiên trong 0…<code>RAND_MAX</code>; <code>srand(hạt)</code> gọi <strong>đúng một lần</strong>, với <code>time(NULL)</code>, trước lời <code>rand</code> đầu tiên. Công thức khoảng: <code>min + rand() % (max - min + 1)</code>.</li>
<li><strong><code>math.h</code></strong> — mọi thứ vào <code>double</code>, ra <code>double</code>. <code>floor</code> xuống, <code>ceil</code> lên, <code>round</code> gần nhất, <code>trunc</code> chặt đuôi; <code>sqrt</code>, <code>pow(cơ số, mũ)</code>, <code>log</code> (tự nhiên), <code>exp</code>. Trên Linux biên dịch kèm <code>-lm</code>. C không có toán tử <code>^</code>.</li>
<li><strong><code>time.h</code></strong> — <code>time_t</code> và <code>clock_t</code>; <code>time(NULL)</code> cho thời điểm hiện tại, <code>difftime(t2, t1)</code> cho số giây nguyên, <code>clock()</code> chia <code>CLOCKS_PER_SEC</code> cho một phép đo CPU chính xác.</li>
<li><strong><code>ctype.h</code></strong> — bảy câu hỏi <code>is…</code> trả về khác 0 khi đúng (đừng bao giờ so với 1), hai hàm đổi <code>to…</code> <em>trả về</em> giá trị chứ không sửa đối số. Cả chín hàm nhận <code>int</code>; lời gọi an toàn là <code>isalpha((unsigned char) c)</code>.</li>
<li><strong>Ba cái bẫy khối này gieo cho các chương sau</strong> — phép chia nguyên lẻn vào một biểu thức <code>double</code> (slide 9 và 17), <code>rand</code> quên gieo hạt hoặc gieo quá tay (slide 7 và 10), và gọi một hàm <code>to…</code> mà không gán kết quả (slide 27). Cả ba sẽ quay lại ở chương Chuỗi và chương Tệp.</li>
<li><strong>Tiếp theo trong chính bộ slide này</strong> — slide 31–65: các kiểu nhập liệu, có đệm và không đệm, <code>getchar()</code>, dọn bộ đệm bàn phím, <code>scanf</code>, và kiểm tra dữ liệu vào. Nửa sau đó là chỗ <code>ctype.h</code> thôi làm bài tập và trở thành công cụ bạn dùng hằng ngày.</li>
</ul>
<table>
<tr><th>Header</th><th>Phải thuộc</th><th>Bẫy hay dính</th></tr>
<tr><td><code>stdlib.h</code></td><td><code>abs</code>, <code>rand</code>, <code>srand</code>, <code>RAND_MAX</code></td><td>quên <code>srand</code>, hoặc gọi trong vòng lặp</td></tr>
<tr><td><code>math.h</code></td><td><code>floor</code> <code>ceil</code> <code>round</code> <code>trunc</code> <code>sqrt</code> <code>pow</code></td><td>dùng <code>^</code>, quên <code>-lm</code>, nhầm <code>abs</code>/<code>fabs</code></td></tr>
<tr><td><code>time.h</code></td><td><code>time</code>, <code>difftime</code>, <code>clock</code>, <code>CLOCKS_PER_SEC</code></td><td>chia nguyên khi đổi nhịp ra giây</td></tr>
<tr><td><code>ctype.h</code></td><td>7 hàm <code>is…</code> + <code>tolower</code>/<code>toupper</code></td><td>so <code>== 1</code>; quên gán lại kết quả</td></tr>
</table>
<p class="dap-an">✅ Mọi khẳng định trong bản tổng kết này đều đã kiểm bằng cách biên dịch và chạy mã, không phải bằng cách đọc slide: công thức số ngẫu nhiên bị nện 200.000 lượt (nhỏ nhất 6, lớn nhất 100), chín kết quả <code>math.h</code> được in ở độ chính xác đầy đủ, <code>CLOCKS_PER_SEC</code> đo được là 1000000 ở đây so với con số 1000 slide dẫn cho Dev-C++, và chín hàm <code>ctype.h</code> được lập bảng trên mười sáu ký tự khác nhau.</p>
<p class="meo">💡 Trước phần Q&amp;A, hãy tự kiểm trên một tờ giấy: viết từ trí nhớ xem mỗi hàm sau nằm ở header nào — <code>sqrt</code>, <code>abs</code>, <code>fabs</code>, <code>rand</code>, <code>time</code>, <code>toupper</code>, <code>isdigit</code>, <code>pow</code>. Xếp đúng <code>abs</code> và <code>fabs</code> vào hai header khác nhau chính là chỗ phân định giữa "qua môn" và "điểm cao" ở chủ đề này.</p>`],

    ]),
  ].join('\n'),
};
