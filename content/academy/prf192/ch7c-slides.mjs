/**
 * PRF192 · Slot 11-12 (deck 'prf6', 65 slide) — phần slide 55→65, học theo từng slide.
 * Chương 7c: Xuất dữ liệu có định dạng — putchar, printf, chuỗi định dạng, conversion specifier.
 *
 * Nội dung bám ĐÚNG chữ trích từ .pptx gốc của trường (/tmp/prf192-text/prf6.txt); những slide
 * chỉ có mã nguồn trong ẢNH (59, 60, 61, 62) đã đọc thẳng từ ảnh render /tmp/prf192-slides/prf6/.
 *
 * MỌI output in ra trong bài đã kiểm bằng biên dịch thật (Apple clang 17.0.0, cc -Wall -std=c99):
 *   Bảng conversion specifier: %d/%i 255 · %u 4294967295 · %ld 1234567890 · %lld 9876543210
 *     %f float 3.141590 / double 3.141593 · %lf 3.141593 · %e 3.141593e+00 · %g 3.14159
 *     %g 1234567.0 -> 1.23457e+06 · %c A · %s Hello · %p 0x16bde237c · %x ff · %X FF · %o 377 · %% %
 *   Bảng cờ định dạng: %10d "      4321" · %-10d "4321      " · %05d "00042" · %+d "+4321"
 *     %.2f "3.14" · %8.2f "    3.14" · %08.2f "00003.14" · %*d(8) "    4321" · %.*f(3) "3.142"
 *     %3d voi 1234567 -> "1234567" (width la TOI THIEU, khong cat)
 *   Slide 61 Example 1: dung "%10.3lf" (KHONG phai "%10.31f") -> "  4321.988" / "004321.988" / "4321.988  "
 *     %f cua 4321.9876546 -> 4321.987655 (lam tron len o chu so thu 6)
 *   Slide 62 Example 2: nhap "5 135000 A 45.23" ->
 *     "The inputted values are:         5         135000    A   45.230000" (66 ky tu)
 *     Chuoi "The inputted values are" dai 23 > width 20 => %-20s KHONG dem, cung KHONG cat.
 *   putchar (slide 57): putchar('A') tra ve 65; EOF = -1; putchar(65) in ra 'A'.
 *   Sai specifier (UB, do that): printf("%d", 3.14) -> 1374389535 · printf("%f", 7) -> 0.000000
 *     printf("%d %d", 1) -> "1 1832084584"; ca ba deu bi -Wformat bat duoc.
 *   scanf("%f", &double) -> bien KHONG doi dung: -1.0 thanh -1.000000239815563.
 *   printf tra ve so ky tu: printf("Hello, %d!\n", 42) tra ve 11; printf("%10d", 7) tra ve 10.
 *   Lam tron .2f: 2.345 -> 2.35 · 2.355 -> 2.35 (nhi phan) · %.0f cua 2.5 -> 2, cua 3.5 -> 4.
 *   Exercise 4: menu chay that; "c a" -> "c: 99, 63h / b: 98, 62h / a: 97, 61h" (dung y slide);
 *     29/02/2024 hop le, 29/02/2023 khong, 31/04/2025 khong.
 *   Exercise 5: 1 -3 2 -> x1=1.0000 x2=2.0000 · 1 2 1 -> nghiem kep -1.0000 · 1 0 1 -> vo nghiem;
 *     gui 1.000.000 lai 0,01/thang trong 12 thang -> 1.126.825,03 (lai 126.825,03).
 * Chỗ slide gốc ghi thiếu/dễ hiểu nhầm đã nêu thẳng trong phần Đáp án (slide 59, 60, 62), không im lặng chép lại.
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'prf6';

export default {
  title: '7.0c — Slide by slide: putchar, printf and formatted output (slides 55–65)|||7.0c — Slide bài giảng: putchar, printf & xuất có định dạng (slide 55–65)',
  slug: 'prf192-7-0c-slides-xuat-dinh-dang',
  type: 'DOCUMENT',
  description: 'Phần cuối bộ slide Slot 11-12 của PRF192 (slide 55–65): xuất dữ liệu có định dạng trong C — bộ đệm xuất chuẩn, hàm putchar, hàm printf, cấu trúc đầy đủ của một conversion specifier (cờ · độ rộng · độ chính xác · size · ký tự chuyển đổi) và hai ví dụ định dạng của trường. Có bảng đầy đủ 15 specifier và bảng 7 loại cờ định dạng, mọi output đều đo bằng biên dịch thật; Exercise 4 và Exercise 5 được giải trọn vẹn bằng chương trình C chạy được.',
  content: [
    walkHead(D, 55, 65),
    walk(D, [

      [55, 'Formatted Output (section divider)',
        `<p class="y-chinh">🎯 A section marker. Slides 40–54 were about getting data <em>into</em> the program (<code>getchar</code>, <code>scanf</code>, input validation). From here the deck turns around and asks the opposite question: how do you get data <em>out</em>, and how do you make it look the way you want?</p>
<ul>
<li><strong>Where you are in the deck</strong> — <code>PRF6</code> is "Slot 11-12 — Libraries". Slides 1–39 covered <code>stdlib.h</code>, <code>math.h</code>, <code>time.h</code> and <code>ctype.h</code>; slides 40–54 covered formatted <em>input</em>; slides 55–65 (this block) close the deck with formatted <em>output</em>. It is still one library — <code>stdio.h</code>.</li>
<li><strong>Why output gets its own section</strong> — you already used <code>printf</code> on the very first day of PRF192 ("Hello, world"). What you used was one percent of it. This block finally explains the other ninety-nine: width, precision, alignment, padding, and the size letters.</li>
<li><strong>Input and output are mirror images — with one asymmetry</strong> — the same conversion characters (<code>%d</code>, <code>%f</code>, <code>%c</code>, <code>%s</code>) appear in both <code>scanf</code> and <code>printf</code>. But they do <strong>not</strong> mean exactly the same thing on both sides; the <code>%f</code> / <code>%lf</code> difference (slide 60) is the classic trap that comes from assuming they do.</li>
<li><strong>Why this matters beyond cosmetics</strong> — every assignment and every practical exam in PRF192 is marked by comparing your program's output text with the expected output text, character for character. A number printed with the wrong number of decimals is a wrong answer, even when the computation is perfect.</li>
<li><strong>Only two functions ahead</strong> — <code>putchar</code> (one character) and <code>printf</code> (everything else). Slides 57 and 58–62 respectively. That is the whole section; the depth is all in <code>printf</code>'s format string.</li>
</ul>
<p class="meo">💡 Keep one sentence in mind for the next ten slides: <em>a format string is a small program</em>. The literal characters are instructions to "print this as-is", and each <code>%…</code> is an instruction to "take the next argument and render it like this". Reading <code>printf</code> that way makes every rule below feel inevitable.</p>`,
        `<p class="y-chinh">🎯 Slide phân mục. Slide 40–54 nói về việc đưa dữ liệu <em>vào</em> chương trình (<code>getchar</code>, <code>scanf</code>, kiểm tra dữ liệu nhập). Từ đây bộ slide quay ngược lại và hỏi câu ngược: làm sao đưa dữ liệu <em>ra</em>, và làm sao cho nó hiện đúng như ý mình muốn?</p>
<ul>
<li><strong>Bạn đang ở đâu trong bộ slide</strong> — <code>PRF6</code> là "Slot 11-12 — Libraries". Slide 1–39 nói về <code>stdlib.h</code>, <code>math.h</code>, <code>time.h</code> và <code>ctype.h</code>; slide 40–54 nói về <em>nhập</em> có định dạng; slide 55–65 (khối này) khép lại bộ slide bằng <em>xuất</em> có định dạng. Vẫn là một thư viện thôi — <code>stdio.h</code>.</li>
<li><strong>Vì sao xuất dữ liệu được dành riêng một mục</strong> — bạn đã dùng <code>printf</code> ngay buổi đầu tiên của PRF192 ("Hello, world"). Nhưng thứ bạn dùng chỉ là một phần trăm của nó. Khối này mới giải thích chín mươi chín phần còn lại: độ rộng, độ chính xác, căn lề, đệm ký tự và các chữ cái size.</li>
<li><strong>Nhập và xuất soi gương nhau — nhưng có MỘT chỗ lệch</strong> — cùng những ký tự chuyển đổi (<code>%d</code>, <code>%f</code>, <code>%c</code>, <code>%s</code>) xuất hiện ở cả <code>scanf</code> lẫn <code>printf</code>. Nhưng chúng <strong>không</strong> mang đúng cùng một nghĩa ở hai bên; cái bẫy <code>%f</code> / <code>%lf</code> (slide 60) sinh ra chính từ việc tưởng rằng chúng giống nhau.</li>
<li><strong>Vì sao chuyện này không chỉ là làm đẹp</strong> — mọi bài tập lớn và mọi bài thi thực hành của PRF192 đều chấm bằng cách so văn bản chương trình bạn in ra với văn bản kết quả mong đợi, từng ký tự một. Một con số in sai số chữ số thập phân là một câu trả lời sai, dù phép tính hoàn toàn đúng.</li>
<li><strong>Chỉ có hai hàm ở phía trước</strong> — <code>putchar</code> (một ký tự) và <code>printf</code> (tất cả phần còn lại), lần lượt ở slide 57 và 58–62. Toàn bộ mục này chỉ có thế; chiều sâu nằm hết trong chuỗi định dạng của <code>printf</code>.</li>
</ul>
<p class="meo">💡 Hãy giữ một câu trong đầu suốt mười slide tới: <em>chuỗi định dạng là một chương trình nhỏ</em>. Các ký tự thường là lệnh "in nguyên văn cái này", còn mỗi <code>%…</code> là lệnh "lấy đối số kế tiếp rồi vẽ nó ra theo kiểu này". Đọc <code>printf</code> theo cách đó thì mọi luật bên dưới đều trở nên hiển nhiên.</p>`],

      [56, 'Formatted Output — buffering and the two stdio.h functions',
        `<p class="y-chinh">🎯 Two ideas in one slide: standard output is <strong>buffered</strong> (your characters wait in a queue before they reach the screen), and <code>stdio.h</code> gives you exactly two ways to push data into that queue — <code>putchar(int)</code> for one character, <code>printf(format_string, varList)</code> for a list of data.</p>
<ul>
<li><strong>The slide's exact words on buffering</strong> — "Standard output is buffered. The standard output buffer empties to the standard output device whenever the buffer receives a newline character or the buffer is full." So two events flush it: a <code>\\n</code>, or the buffer filling up. (In practice a third one exists: the program ending normally.)</li>
<li><strong>Why buffering exists</strong> — the slide answers this too: "Buffering enables a program to continue executing without waiting for the output device to finish displaying the most recently received characters." Screens and files are slow; the CPU is not. The buffer lets the two run at different speeds.</li>
<li><strong>The consequence you will actually meet</strong> — if your program crashes before the buffer is flushed, the text you "already printed" never appears. When you debug with <code>printf</code> and the program dies, always end the message with <code>\\n</code>, otherwise the last, most important line is the one you lose.</li>
<li><strong>The same buffer explains a <code>scanf</code> oddity</strong> — a prompt like <code>printf("Enter n: ");</code> has no <code>\\n</code>, so strictly it is not guaranteed to appear before <code>scanf</code> waits. On a terminal it usually does (terminals are line-buffered and reading from the keyboard flushes the prompt), but redirect the output to a file and the order can change.</li>
<li><strong>The two functions, and the division of labour</strong> — <code>putchar(int)</code> takes <em>one character</em> and nothing else: no format, no conversion, no padding. <code>printf(format_string, varList)</code> takes any number of values of any type and renders them under the control of a format string. There is no third option in this deck.</li>
<li><strong>Note the parameter type of <code>putchar</code></strong> — the slide writes <code>putchar(int)</code>, not <code>putchar(char)</code>. That is deliberate and is explained on the next slide; it is the mirror of <code>getchar</code> returning <code>int</code> so it can also return <code>EOF</code>.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main(void)
{
    putchar('H');          /* one character, straight into the buffer */
    printf("i, %s! ", "PRF192");
    printf("%d + %d = %d\\n", 2, 3, 2 + 3);   /* the \\n flushes the buffer */
    return 0;
}</code></pre>
<p class="dap-an">✅ Compiled with <code>cc -Wall -std=c99</code> and run: the program prints <code>Hi, PRF192! 2 + 3 = 5</code> on one line. Remove the <code>\\n</code> and the text still appears — but only because the program exits, which also flushes; that is the accident that hides buffering bugs until the day the program crashes.</p>
<p class="meo">💡 Think of the buffer as the outbox of an email client. <code>printf</code> writes the mail; <code>\\n</code> presses "send". Everything in the outbox when the power goes off is simply gone.</p>`,
        `<p class="y-chinh">🎯 Hai ý trong một slide: xuất chuẩn có <strong>bộ đệm</strong> (các ký tự của bạn xếp hàng chờ trước khi tới màn hình), và <code>stdio.h</code> cho bạn đúng hai cách đẩy dữ liệu vào hàng đợi đó — <code>putchar(int)</code> cho một ký tự, <code>printf(format_string, varList)</code> cho cả một danh sách dữ liệu.</p>
<ul>
<li><strong>Nguyên văn slide nói về bộ đệm</strong> — "Standard output is buffered. The standard output buffer empties to the standard output device whenever the buffer receives a newline character or the buffer is full" — bộ đệm xuất chuẩn đổ ra thiết bị mỗi khi nó nhận được ký tự xuống dòng, hoặc khi nó đầy. Vậy có hai sự kiện làm nó xả: một <code>\\n</code>, hoặc đầy bộ đệm. (Thực tế còn sự kiện thứ ba: chương trình kết thúc bình thường.)</li>
<li><strong>Vì sao phải có bộ đệm</strong> — slide trả lời luôn: "Buffering enables a program to continue executing without waiting for the output device to finish displaying…" — bộ đệm cho chương trình chạy tiếp mà không phải đứng chờ thiết bị hiển thị xong. Màn hình và file thì chậm, CPU thì không. Bộ đệm cho hai bên chạy ở hai tốc độ khác nhau.</li>
<li><strong>Hệ quả bạn sẽ gặp thật</strong> — nếu chương trình chết trước khi bộ đệm được xả thì dòng chữ bạn tưởng "đã in rồi" sẽ không bao giờ hiện ra. Khi gỡ lỗi bằng <code>printf</code> mà chương trình sập, luôn kết thúc thông điệp bằng <code>\\n</code>, nếu không thì đúng dòng cuối cùng — dòng quan trọng nhất — lại là dòng bị mất.</li>
<li><strong>Cùng cái bộ đệm đó giải thích một chuyện lạ của <code>scanf</code></strong> — câu nhắc kiểu <code>printf("Nhap n: ");</code> không có <code>\\n</code>, nên về lý thuyết không bảo đảm nó hiện ra trước khi <code>scanf</code> dừng chờ. Trên terminal thì thường vẫn hiện (terminal đệm theo dòng và việc đọc bàn phím làm xả bộ đệm), nhưng chuyển hướng output vào file thì thứ tự có thể đổi.</li>
<li><strong>Hai hàm và sự phân công</strong> — <code>putchar(int)</code> nhận <em>một ký tự</em> và chỉ thế thôi: không định dạng, không chuyển đổi, không đệm. <code>printf(format_string, varList)</code> nhận bao nhiêu giá trị kiểu gì cũng được và vẽ chúng ra theo điều khiển của chuỗi định dạng. Trong bộ slide này không có lựa chọn thứ ba.</li>
<li><strong>Để ý kiểu tham số của <code>putchar</code></strong> — slide viết <code>putchar(int)</code> chứ không phải <code>putchar(char)</code>. Đó là cố ý và sẽ được giải thích ở slide sau; nó soi gương với chuyện <code>getchar</code> trả về <code>int</code> để còn trả được <code>EOF</code>.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main(void)
{
    putchar('H');          /* mot ky tu, di thang vao bo dem */
    printf("i, %s! ", "PRF192");
    printf("%d + %d = %d\\n", 2, 3, 2 + 3);   /* \\n xa bo dem */
    return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch bằng <code>cc -Wall -std=c99</code> và chạy: chương trình in ra <code>Hi, PRF192! 2 + 3 = 5</code> trên một dòng. Bỏ <code>\\n</code> đi thì chữ vẫn hiện — nhưng chỉ vì chương trình kết thúc, mà kết thúc cũng làm xả bộ đệm; đó chính là sự tình cờ giúp lỗi bộ đệm nấp kỹ cho tới ngày chương trình sập.</p>
<p class="meo">💡 Hãy hình dung bộ đệm như hộp thư đi của trình gửi mail. <code>printf</code> là soạn thư; <code>\\n</code> là bấm "gửi". Mọi thứ còn nằm trong hộp thư đi lúc mất điện thì coi như mất luôn.</p>`],

      [57, 'putchar(int) function',
        `<p class="y-chinh">🎯 The slide's sentence, word for word: "<strong>putchar</strong> writes the character received to the standard output stream buffer and returns the character written or <strong>EOF</strong> if an error occurred." Syntax: <code>int putchar( int );</code>. Example: <code>putchar('a');</code></p>
<ul>
<li><strong>It takes an <code>int</code>, not a <code>char</code></strong> — and that is not a typo on the slide. <code>putchar</code> converts the value to <code>unsigned char</code> internally, so every one of the 256 byte values fits; the <code>int</code> parameter exists so the function can also be handed the out-of-band value <code>EOF</code> and so it matches <code>getchar</code>'s <code>int</code> return type. In practice you pass a <code>char</code> and C promotes it for you.</li>
<li><strong>It <em>returns</em> something, and the return value is useful</strong> — normally the character it just wrote, as an <code>int</code>; <code>EOF</code> (which is <code>-1</code> on this compiler) if the write failed. The slide's own program proves it: <code>code = putchar(ch);</code> then <code>printf("The return value of putchar is: %d\\n", code);</code></li>
<li><strong>Read the slide's screenshot carefully</strong> — the console shows <code>AThe return value of putchar is: 65</code>. The <code>A</code> at the front is the output of <code>putchar</code> itself; it has no newline, so the next <code>printf</code> continues on the same line. <code>65</code> is the ASCII code of <code>'A'</code>, printed with <code>%d</code>, and it is also the return value of <code>putchar</code>.</li>
<li><strong>Why use it at all when <code>printf</code> exists</strong> — <code>putchar('A')</code> does one thing: copy one byte into the buffer. <code>printf("%c", 'A')</code> must first parse the format string at run time, find the <code>%c</code>, fetch a variadic argument, and then copy the same one byte. For a single character <code>putchar</code> is measurably faster and cannot be given the wrong specifier.</li>
<li><strong>Where you will really use it</strong> — printing a triangle of stars, a progress bar, a separator line, or echoing a file character by character in the <code>while ((c = getchar()) != EOF) putchar(c);</code> loop. Anywhere the output is naturally one character at a time.</li>
<li><strong>Its hard limit</strong> — one character. It cannot print a number, a string, or anything with width or padding. The moment you need <code>%5d</code>, <code>putchar</code> is out of the picture.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main(void)
{
    char ch;
    int code;

    printf("Input a character: ");
    ch = getchar();
    printf("Inputted character is: %c\\n", ch);
    code = putchar(ch);
    printf("The return value of putchar is: %d\\n", code);
    return 0;
}</code></pre>
<p class="dap-an">✅ The slide's program, compiled with <code>cc -Wall -std=c99</code> and fed the letter <code>A</code>, reproduces the screenshot exactly:<br><code>Input a character: Inputted character is: A</code><br><code>AThe return value of putchar is: 65</code><br>Checked further in the same run: <code>EOF</code> prints as <strong>-1</strong>, and <code>putchar(65)</code> — an <code>int</code> literal, no character constant at all — prints <strong>A</strong>, which is the clearest possible proof that the parameter really is an <code>int</code>.</p>
<p class="pitfall">⚠️ <code>putchar</code> writes <strong>no newline</strong>. Two <code>putchar</code> calls put two characters side by side, and the next <code>printf</code> continues on the same line — exactly the <code>AThe return value…</code> effect on the slide. If you want a line break you must say so: <code>putchar('\\n');</code></p>`,
        `<p class="y-chinh">🎯 Nguyên văn câu trên slide: "<strong>putchar</strong> writes the character received to the standard output stream buffer and returns the character written or <strong>EOF</strong> if an error occurred" — putchar ghi ký tự nhận được vào bộ đệm xuất chuẩn rồi trả về chính ký tự đã ghi, hoặc <code>EOF</code> nếu có lỗi. Cú pháp: <code>int putchar( int );</code>. Ví dụ: <code>putchar('a');</code></p>
<ul>
<li><strong>Nó nhận <code>int</code> chứ không phải <code>char</code></strong> — và đó không phải lỗi đánh máy của slide. Bên trong, <code>putchar</code> chuyển giá trị về <code>unsigned char</code> nên cả 256 giá trị byte đều vừa; tham số kiểu <code>int</code> tồn tại để hàm còn nhận được giá trị ngoài luồng là <code>EOF</code>, và để khớp với kiểu trả về <code>int</code> của <code>getchar</code>. Thực tế bạn cứ truyền một <code>char</code>, C tự nâng kiểu giúp.</li>
<li><strong>Nó CÓ <em>trả về</em> giá trị, và giá trị đó dùng được</strong> — bình thường là chính ký tự vừa ghi, dưới dạng <code>int</code>; là <code>EOF</code> (bằng <code>-1</code> trên trình biên dịch này) nếu ghi hỏng. Chính chương trình trên slide chứng minh điều đó: <code>code = putchar(ch);</code> rồi <code>printf("The return value of putchar is: %d\\n", code);</code></li>
<li><strong>Đọc kỹ ảnh chụp console trên slide</strong> — nó hiện <code>AThe return value of putchar is: 65</code>. Chữ <code>A</code> đứng đầu chính là output của <code>putchar</code>; nó không kèm xuống dòng nên <code>printf</code> kế tiếp viết tiếp ngay trên cùng dòng. Số <code>65</code> là mã ASCII của <code>'A'</code>, in bằng <code>%d</code>, và cũng chính là giá trị <code>putchar</code> trả về.</li>
<li><strong>Đã có <code>printf</code> rồi thì dùng nó làm gì</strong> — <code>putchar('A')</code> làm đúng một việc: chép một byte vào bộ đệm. Còn <code>printf("%c", 'A')</code> phải phân tích chuỗi định dạng lúc chạy, tìm ra <code>%c</code>, lấy một đối số biến thiên, rồi mới chép đúng cái byte đó. Với một ký tự lẻ, <code>putchar</code> nhanh hơn đo được và không thể bị truyền nhầm specifier.</li>
<li><strong>Chỗ bạn sẽ dùng nó thật</strong> — in tam giác dấu sao, thanh tiến trình, dòng kẻ ngăn cách, hoặc chép một file ra màn hình từng ký tự bằng vòng <code>while ((c = getchar()) != EOF) putchar(c);</code>. Bất cứ chỗ nào mà đầu ra vốn dĩ đi từng ký tự một.</li>
<li><strong>Giới hạn cứng của nó</strong> — một ký tự. Nó không in được số, không in được chuỗi, không có độ rộng hay đệm. Hễ bạn cần tới <code>%5d</code> là <code>putchar</code> hết vai trò.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main(void)
{
    char ch;
    int code;

    printf("Input a character: ");
    ch = getchar();
    printf("Inputted character is: %c\\n", ch);
    code = putchar(ch);
    printf("The return value of putchar is: %d\\n", code);
    return 0;
}</code></pre>
<p class="dap-an">✅ Chương trình trên slide, biên dịch bằng <code>cc -Wall -std=c99</code> và nhập chữ <code>A</code>, cho ra đúng y ảnh chụp:<br><code>Input a character: Inputted character is: A</code><br><code>AThe return value of putchar is: 65</code><br>Kiểm thêm trong cùng lần chạy: <code>EOF</code> in ra là <strong>-1</strong>, và <code>putchar(65)</code> — một hằng <code>int</code>, không hề có hằng ký tự nào — in ra chữ <strong>A</strong>, bằng chứng rõ nhất cho việc tham số thật sự là <code>int</code>.</p>
<p class="pitfall">⚠️ <code>putchar</code> <strong>không</strong> tự xuống dòng. Hai lời gọi <code>putchar</code> đặt hai ký tự cạnh nhau, và <code>printf</code> kế tiếp viết tiếp cùng dòng — đúng hiện tượng <code>AThe return value…</code> trên slide. Muốn xuống dòng thì phải nói ra: <code>putchar('\\n');</code></p>`],

      [58, 'printf(…) function',
        `<p class="y-chinh">🎯 The slide's definition: "<strong>printf</strong> sends data under format control to the standard output stream buffer and <strong>returns the number of characters sent</strong>." Syntax: <code>printf ( format string , value, ..., value )</code>.</p>
<ul>
<li><strong>"Under format control" is the whole idea</strong> — <code>printf</code> does not print values, it prints a <em>string</em>, and some parts of that string are filled in from your values. The first argument is always the map; everything after it is cargo.</li>
<li><strong>The two notes on the slide, spelled out</strong> — (1) "The format string is a literal string that consists of characters interspersed with conversion specifiers"; (2) "Conversion specifier begins with a <code>%</code> and ends with a conversion character". So the parser has a trivial rule: copy characters out verbatim until you hit a <code>%</code>, then read a specifier, consume one argument, and carry on.</li>
<li><strong>The return value nobody uses — and exams love</strong> — <code>printf</code> returns an <code>int</code>: how many characters actually went into the buffer. Not how many arguments, not how many specifiers: <strong>characters</strong>, including the spaces added by padding and including <code>\\n</code>. A negative return means an output error.</li>
<li><strong>Why it is variadic, and what that costs you</strong> — <code>printf</code> accepts any number of arguments of any type, so the compiler cannot check them the way it checks <code>sqrt(double)</code>. The only thing that tells <code>printf</code> what is on the stack is your format string. Lie in the format string and the function believes you — that is the root of every <code>printf</code> bug on slide 60.</li>
<li><strong>Consequence: count your specifiers and your values</strong> — there must be exactly as many values after the format string as there are specifiers inside it (a <code>%%</code> is not a specifier; it consumes nothing). Too few values and <code>printf</code> reads whatever garbage sits next in memory.</li>
<li><strong>Escape sequences are <em>not</em> specifiers</strong> — <code>\\n</code>, <code>\\t</code>, <code>\\\\</code>, <code>\\"</code> are handled by the <strong>compiler</strong> when it builds the string literal; <code>%d</code> is handled by <code>printf</code> at <strong>run time</strong>. That is why a wrong <code>\\q</code> is a compile-time warning while a wrong <code>%d</code> is only a run-time disaster.</li>
</ul>
<pre><code>int k;
k = printf("Hello, %d!\\n", 42);   /* prints, then reports the length */
printf("k = %d\\n", k);

printf("%10d", 7);                 /* padding counts toward the total */</code></pre>
<p class="dap-an">✅ Measured, not guessed. <code>printf("Hello, %d!\\n", 42)</code> prints <code>Hello, 42!</code> and returns <strong>11</strong> — the seven characters of <code>Hello, </code>, the two digits <code>42</code>, the <code>!</code> and the <code>\\n</code>. And <code>printf("%10d", 7)</code> returns <strong>10</strong>, because the nine padding spaces are characters too. Both checked with <code>cc -Wall -std=c99</code>.</p>
<p class="pitfall">⚠️ Never put user data in the format string: <code>printf(name)</code> compiles, but if <code>name</code> happens to contain a <code>%</code> the function will go looking for an argument that was never passed. Always write <code>printf("%s", name)</code>. The compiler will warn you with <code>-Wformat-security</code>; in the real world this mistake is a security hole with its own name, "format string vulnerability".</p>`,
        `<p class="y-chinh">🎯 Định nghĩa trên slide: "<strong>printf</strong> sends data under format control to the standard output stream buffer and <strong>returns the number of characters sent</strong>" — printf gửi dữ liệu vào bộ đệm xuất chuẩn dưới sự điều khiển của định dạng, và trả về <strong>số ký tự đã gửi</strong>. Cú pháp: <code>printf ( format string , value, ..., value )</code>.</p>
<ul>
<li><strong>"Dưới sự điều khiển của định dạng" chính là toàn bộ ý tưởng</strong> — <code>printf</code> không in các giá trị, nó in một <em>chuỗi</em>, và vài chỗ trong chuỗi đó được điền bằng giá trị của bạn. Đối số đầu tiên luôn là tấm bản đồ; tất cả những gì đứng sau chỉ là hàng hoá.</li>
<li><strong>Hai chú ý trên slide, nói cho rõ</strong> — (1) "chuỗi định dạng là một chuỗi hằng gồm các ký tự xen kẽ với các conversion specifier"; (2) "conversion specifier bắt đầu bằng <code>%</code> và kết thúc bằng một ký tự chuyển đổi". Vậy bộ phân tích có một luật rất đơn giản: chép ký tự ra nguyên văn cho tới khi gặp <code>%</code>, đọc lấy một specifier, tiêu thụ một đối số, rồi đi tiếp.</li>
<li><strong>Giá trị trả về không ai dùng — mà đề thi rất thích</strong> — <code>printf</code> trả về một <code>int</code>: có bao nhiêu ký tự thật sự đã vào bộ đệm. Không phải số đối số, không phải số specifier, mà là <strong>số ký tự</strong>, kể cả các dấu cách do đệm sinh ra và kể cả <code>\\n</code>. Trả về số âm nghĩa là có lỗi khi xuất.</li>
<li><strong>Vì sao nó là hàm biến thiên đối số, và cái giá phải trả</strong> — <code>printf</code> nhận bao nhiêu đối số kiểu gì cũng được, nên trình biên dịch không thể kiểm tra chúng như cách nó kiểm <code>sqrt(double)</code>. Thứ duy nhất cho <code>printf</code> biết trên ngăn xếp có gì chính là chuỗi định dạng của bạn. Nói dối trong chuỗi định dạng thì hàm tin ngay — đó là gốc của mọi lỗi <code>printf</code> ở slide 60.</li>
<li><strong>Hệ quả: hãy đếm specifier và đếm giá trị</strong> — sau chuỗi định dạng phải có đúng bằng ấy giá trị so với số specifier bên trong nó (riêng <code>%%</code> không phải specifier, nó không tiêu thụ đối số nào). Thiếu giá trị thì <code>printf</code> đọc đúng đống rác nằm kế tiếp trong bộ nhớ.</li>
<li><strong>Escape sequence <em>không phải</em> specifier</strong> — <code>\\n</code>, <code>\\t</code>, <code>\\\\</code>, <code>\\"</code> do <strong>trình biên dịch</strong> xử lý lúc dựng hằng chuỗi; còn <code>%d</code> do <code>printf</code> xử lý lúc <strong>chạy</strong>. Vì thế gõ nhầm <code>\\q</code> thì bị cảnh báo lúc dịch, còn gõ nhầm <code>%d</code> thì chỉ vỡ lúc chạy.</li>
</ul>
<pre><code>int k;
k = printf("Hello, %d!\\n", 42);   /* in ra, roi bao do dai */
printf("k = %d\\n", k);

printf("%10d", 7);                 /* phan dem CO tinh vao tong */</code></pre>
<p class="dap-an">✅ Đã đo, không đoán. <code>printf("Hello, %d!\\n", 42)</code> in ra <code>Hello, 42!</code> và trả về <strong>11</strong> — bảy ký tự của <code>Hello, </code>, hai chữ số <code>42</code>, dấu <code>!</code> và <code>\\n</code>. Còn <code>printf("%10d", 7)</code> trả về <strong>10</strong>, vì chín dấu cách đệm cũng là ký tự. Cả hai đã kiểm bằng <code>cc -Wall -std=c99</code>.</p>
<p class="pitfall">⚠️ Đừng bao giờ đặt dữ liệu người dùng vào chuỗi định dạng: <code>printf(name)</code> vẫn dịch được, nhưng nếu <code>name</code> chẳng may chứa dấu <code>%</code> thì hàm sẽ đi tìm một đối số chưa từng được truyền. Luôn viết <code>printf("%s", name)</code>. Trình biên dịch có cảnh báo <code>-Wformat-security</code> cho chuyện này; ngoài đời nó là một lỗ hổng bảo mật có hẳn tên riêng: "format string vulnerability".</p>`],

      [59, 'printf(…) function: Format String — flags, width, precision, size',
        `<p class="y-chinh">🎯 The anatomy slide. Between the <code>%</code> and the conversion character there may be, in this exact order: <code>%</code> <strong>flags</strong> <strong>width</strong> <code>.</code> <strong>precision</strong> <strong>size</strong> <strong>conversion_character</strong>. Every part is optional; the order is not.</p>
<ul>
<li><strong>flags — the slide lists two</strong> — <code>-</code> "prescribes left justification of the converted value in its field", and <code>0</code> "pads the field width with leading zeros". Two more are worth knowing for exams: <code>+</code> always shows the sign, and a space reserves a column for it.</li>
<li><strong>width — a MINIMUM, never a maximum</strong> — <code>%10d</code> means "at least 10 columns; pad with spaces on the left if the value is shorter". If the value is longer, nothing is cut: the field simply grows. This single sentence explains most "my table columns are misaligned" bugs.</li>
<li><strong>precision — meaning depends on the conversion</strong> — after the dot, for <code>%f</code> it is the number of digits <em>after</em> the decimal point (<code>%.2f</code> → two decimals); for <code>%e</code> the same; for <code>%g</code> it is the number of <em>significant</em> digits; for <code>%s</code> it is a <strong>maximum</strong> number of characters, and there it really does truncate.</li>
<li><strong>size — the two tables on the right of the slide</strong> — for integers: <em>none</em>&nbsp;=&nbsp;<code>int</code>, <code>hh</code>&nbsp;=&nbsp;<code>char</code>, <code>h</code>&nbsp;=&nbsp;<code>short</code>, <code>l</code>&nbsp;=&nbsp;<code>long</code>, <code>ll</code>&nbsp;=&nbsp;<code>long long</code>. For floating point: <em>none</em>&nbsp;=&nbsp;<code>float</code>, <code>l</code>&nbsp;=&nbsp;<code>double</code>, <code>L</code>&nbsp;=&nbsp;<code>long double</code>.</li>
<li><strong>The size table has a catch on the float side</strong> — in <code>printf</code> a <code>float</code> argument is <em>automatically promoted to</em> <code>double</code> before the function ever sees it, so <code>%f</code> and <code>%lf</code> behave identically there. The table is literally true for <code>scanf</code>, where the distinction is compulsory. See the pitfall on slide 60.</li>
<li><strong>Width and precision can be supplied at run time</strong> — write <code>*</code> where the number would go and pass the number as an extra argument, <em>before</em> the value: <code>printf("%*d", 8, n)</code>. That is how you print a table whose column width is computed rather than typed.</li>
</ul>
<table>
<thead><tr><th>Flag / form</th><th>Meaning</th><th>Code</th><th>Real output (| marks the field edges)</th></tr></thead>
<tbody>
<tr><td>(none)</td><td>natural width</td><td><code>printf("|%d|", 4321)</code></td><td><code>|4321|</code></td></tr>
<tr><td><code>%10d</code></td><td>width 10, right aligned</td><td><code>printf("|%10d|", 4321)</code></td><td><code>|      4321|</code></td></tr>
<tr><td><code>%-10d</code></td><td>width 10, left aligned</td><td><code>printf("|%-10d|", 4321)</code></td><td><code>|4321      |</code></td></tr>
<tr><td><code>%05d</code></td><td>width 5, zero padded</td><td><code>printf("|%05d|", 42)</code></td><td><code>|00042|</code></td></tr>
<tr><td><code>%+d</code></td><td>always show the sign</td><td><code>printf("|%+d| |%+d|", 4321, -4321)</code></td><td><code>|+4321| |-4321|</code></td></tr>
<tr><td><code>%.2f</code></td><td>precision: 2 decimals</td><td><code>printf("|%.2f|", 3.14159)</code></td><td><code>|3.14|</code></td></tr>
<tr><td><code>%8.2f</code></td><td>width 8 + 2 decimals</td><td><code>printf("|%8.2f|", 3.14159)</code></td><td><code>|    3.14|</code></td></tr>
<tr><td><code>%-8.2f</code></td><td>width 8, left aligned</td><td><code>printf("|%-8.2f|", 3.14159)</code></td><td><code>|3.14    |</code></td></tr>
<tr><td><code>%08.2f</code></td><td>width 8, zero padded</td><td><code>printf("|%08.2f|", 3.14159)</code></td><td><code>|00003.14|</code></td></tr>
<tr><td><code>%*d</code></td><td>width given at run time</td><td><code>printf("|%*d|", 8, 4321)</code></td><td><code>|    4321|</code></td></tr>
<tr><td><code>%.*f</code></td><td>precision at run time</td><td><code>printf("|%.*f|", 3, 3.14159)</code></td><td><code>|3.142|</code></td></tr>
<tr><td><code>%10s</code> / <code>%-10s</code></td><td>strings obey width too</td><td><code>printf("|%10s| |%-10s|", "hi", "hi")</code></td><td><code>|        hi| |hi        |</code></td></tr>
<tr><td><code>%.3s</code></td><td>precision on a string TRUNCATES</td><td><code>printf("|%.3s|", "abcdef")</code></td><td><code>|abc|</code></td></tr>
<tr><td><code>%3d</code> (too narrow)</td><td>width is a minimum — nothing is cut</td><td><code>printf("|%3d|", 1234567)</code></td><td><code>|1234567|</code></td></tr>
</tbody>
</table>
<p class="dap-an">✅ Every line of that table was produced by one program compiled with <code>cc -Wall -std=c99</code> and run; the <code>|</code> characters are printed by the program itself so the padding is visible. Two results deserve a second look: <code>%08.2f</code> puts the zeros <em>before</em> the digits but after the sign, and <code>%3d</code> with a seven-digit value silently widens the field — which is exactly how a "neat" table loses its alignment on one unusually large row.</p>
<p class="pitfall">⚠️ <code>0</code> and <code>-</code> together: the <code>-</code> wins and the <code>0</code> is ignored, because zeros on the right of a left-aligned number would change its value. Also note the order rule — <code>%-010d</code> is fine, <code>%10-d</code> is not a valid specifier; flags come before the width, always.</p>`,
        `<p class="y-chinh">🎯 Slide giải phẫu. Giữa dấu <code>%</code> và ký tự chuyển đổi có thể có, theo đúng thứ tự này: <code>%</code> <strong>flags</strong> <strong>width</strong> <code>.</code> <strong>precision</strong> <strong>size</strong> <strong>conversion_character</strong>. Mọi thành phần đều tuỳ chọn; riêng thứ tự thì không.</p>
<ul>
<li><strong>flags — slide liệt kê hai cái</strong> — <code>-</code> "quy định căn TRÁI giá trị đã chuyển đổi trong ô của nó", và <code>0</code> "đệm phần độ rộng bằng các số 0 ở đầu". Hai cái nữa nên biết để đi thi: <code>+</code> luôn hiện dấu, và một dấu cách thì chừa sẵn một cột cho dấu.</li>
<li><strong>width — là số TỐI THIỂU, không bao giờ là tối đa</strong> — <code>%10d</code> nghĩa là "ít nhất 10 cột; nếu giá trị ngắn hơn thì đệm dấu cách vào bên trái". Nếu giá trị dài hơn thì không cắt gì cả: ô tự nở ra. Đúng một câu này giải thích gần hết các lỗi "bảng của em bị lệch cột".</li>
<li><strong>precision — nghĩa thay đổi theo ký tự chuyển đổi</strong> — sau dấu chấm, với <code>%f</code> đó là số chữ số <em>sau</em> dấu thập phân (<code>%.2f</code> → hai số lẻ); với <code>%e</code> cũng vậy; với <code>%g</code> đó là số chữ số <em>có nghĩa</em>; còn với <code>%s</code> đó là số ký tự <strong>tối đa</strong>, và ở đây nó cắt thật.</li>
<li><strong>size — hai bảng nhỏ bên phải slide</strong> — với số nguyên: <em>không có</em>&nbsp;=&nbsp;<code>int</code>, <code>hh</code>&nbsp;=&nbsp;<code>char</code>, <code>h</code>&nbsp;=&nbsp;<code>short</code>, <code>l</code>&nbsp;=&nbsp;<code>long</code>, <code>ll</code>&nbsp;=&nbsp;<code>long long</code>. Với số thực: <em>không có</em>&nbsp;=&nbsp;<code>float</code>, <code>l</code>&nbsp;=&nbsp;<code>double</code>, <code>L</code>&nbsp;=&nbsp;<code>long double</code>.</li>
<li><strong>Bảng size có một cái bẫy ở nửa số thực</strong> — trong <code>printf</code>, một đối số <code>float</code> được <em>tự động nâng lên</em> <code>double</code> trước khi hàm kịp nhìn thấy nó, nên ở đây <code>%f</code> và <code>%lf</code> hành xử y hệt nhau. Bảng chỉ đúng nguyên văn với <code>scanf</code>, nơi việc phân biệt là bắt buộc. Xem phần bẫy ở slide 60.</li>
<li><strong>Độ rộng và độ chính xác có thể đưa vào lúc CHẠY</strong> — viết dấu <code>*</code> vào chỗ đáng lẽ là con số, rồi truyền con số đó như một đối số phụ, <em>đứng trước</em> giá trị: <code>printf("%*d", 8, n)</code>. Đó là cách in một bảng mà bề rộng cột được tính ra chứ không gõ cứng.</li>
</ul>
<table>
<thead><tr><th>Cờ / dạng</th><th>Ý nghĩa</th><th>Mã</th><th>Output THẬT (dấu | đánh dấu mép ô)</th></tr></thead>
<tbody>
<tr><td>(không có)</td><td>độ rộng tự nhiên</td><td><code>printf("|%d|", 4321)</code></td><td><code>|4321|</code></td></tr>
<tr><td><code>%10d</code></td><td>rộng 10, căn phải</td><td><code>printf("|%10d|", 4321)</code></td><td><code>|      4321|</code></td></tr>
<tr><td><code>%-10d</code></td><td>rộng 10, căn trái</td><td><code>printf("|%-10d|", 4321)</code></td><td><code>|4321      |</code></td></tr>
<tr><td><code>%05d</code></td><td>rộng 5, đệm số 0</td><td><code>printf("|%05d|", 42)</code></td><td><code>|00042|</code></td></tr>
<tr><td><code>%+d</code></td><td>luôn hiện dấu</td><td><code>printf("|%+d| |%+d|", 4321, -4321)</code></td><td><code>|+4321| |-4321|</code></td></tr>
<tr><td><code>%.2f</code></td><td>độ chính xác: 2 số lẻ</td><td><code>printf("|%.2f|", 3.14159)</code></td><td><code>|3.14|</code></td></tr>
<tr><td><code>%8.2f</code></td><td>rộng 8 + 2 số lẻ</td><td><code>printf("|%8.2f|", 3.14159)</code></td><td><code>|    3.14|</code></td></tr>
<tr><td><code>%-8.2f</code></td><td>rộng 8, căn trái</td><td><code>printf("|%-8.2f|", 3.14159)</code></td><td><code>|3.14    |</code></td></tr>
<tr><td><code>%08.2f</code></td><td>rộng 8, đệm số 0</td><td><code>printf("|%08.2f|", 3.14159)</code></td><td><code>|00003.14|</code></td></tr>
<tr><td><code>%*d</code></td><td>độ rộng đưa vào lúc chạy</td><td><code>printf("|%*d|", 8, 4321)</code></td><td><code>|    4321|</code></td></tr>
<tr><td><code>%.*f</code></td><td>độ chính xác lúc chạy</td><td><code>printf("|%.*f|", 3, 3.14159)</code></td><td><code>|3.142|</code></td></tr>
<tr><td><code>%10s</code> / <code>%-10s</code></td><td>chuỗi cũng theo độ rộng</td><td><code>printf("|%10s| |%-10s|", "hi", "hi")</code></td><td><code>|        hi| |hi        |</code></td></tr>
<tr><td><code>%.3s</code></td><td>độ chính xác trên chuỗi thì CẮT</td><td><code>printf("|%.3s|", "abcdef")</code></td><td><code>|abc|</code></td></tr>
<tr><td><code>%3d</code> (quá hẹp)</td><td>width là tối thiểu — không cắt gì</td><td><code>printf("|%3d|", 1234567)</code></td><td><code>|1234567|</code></td></tr>
</tbody>
</table>
<p class="dap-an">✅ Từng dòng trong bảng trên đều do một chương trình biên dịch bằng <code>cc -Wall -std=c99</code> chạy ra; các dấu <code>|</code> do chính chương trình in để nhìn rõ phần đệm. Hai kết quả đáng nhìn lại: <code>%08.2f</code> đặt các số 0 <em>trước</em> chữ số nhưng sau dấu, và <code>%3d</code> với một giá trị bảy chữ số thì âm thầm nở ô ra — đó đúng là cách một cái bảng "gọn gàng" mất canh lề chỉ vì một dòng có số lớn bất thường.</p>
<p class="pitfall">⚠️ Đi chung <code>0</code> với <code>-</code>: <code>-</code> thắng và <code>0</code> bị bỏ qua, vì thêm số 0 vào bên PHẢI một số căn trái sẽ làm đổi giá trị của nó. Cũng nhớ luật thứ tự — <code>%-010d</code> thì hợp lệ, còn <code>%10-d</code> thì không phải specifier hợp lệ; cờ luôn đứng trước độ rộng.</p>`],

      [60, 'printf(…) function: Conversion Specifiers',
        `<p class="y-chinh">🎯 The reference table of the deck. The slide lists eight rows — <code>%c</code>, <code>%d</code>, <code>%u</code>, <code>%o</code>, <code>%x</code>, <code>%f</code>, <code>%g</code>, <code>%e</code> — each with what it outputs and which types it may be used with. The table below is that slide, completed with <code>%i</code>, <code>%ld</code>, <code>%lld</code>, <code>%lf</code>, <code>%s</code>, <code>%p</code>, <code>%%</code>, and with a measured output for every row.</p>
<ul>
<li><strong>The slide's own three columns</strong> — "Specifier / Output As A / Use With". Read it as a contract: <code>%d</code> outputs a decimal and may be used with <code>char, int, short, long, long long</code>; <code>%f</code> outputs a floating-point number and may be used with <code>float, double, long double</code>; and so on.</li>
<li><strong>The integer family</strong> — <code>%d</code> and <code>%i</code> are identical in <code>printf</code> (they differ only in <code>scanf</code>, where <code>%i</code> auto-detects <code>0x</code> and <code>0</code> prefixes). <code>%u</code> reads the same bits as an <em>unsigned</em> number, which is why <code>printf("%u", -1)</code> prints 4294967295 rather than -1.</li>
<li><strong>The base family</strong> — <code>%o</code> (octal) and <code>%x</code> (hexadecimal) print the same integer in another base, with no <code>0</code> or <code>0x</code> prefix unless you add the <code>#</code> flag. <code>%X</code> uses capital letters. These are what Exercise 4 needs for its "63h, 62h, 61h" output.</li>
<li><strong>The floating family</strong> — <code>%f</code> is fixed notation with 6 decimals by default; <code>%e</code> is scientific; <code>%g</code> picks whichever of the two is shorter and drops trailing zeros. <code>%g</code> is the one to use when you do not know the magnitude in advance.</li>
<li><strong>The single most examined line on this slide</strong> — <code>%f</code> "Use With: float, double, long double". In <strong>printf</strong> that is true, because of default argument promotion: a <code>float</code> is widened to <code>double</code> before <code>printf</code> sees it, so <code>%f</code> serves both. In <strong>scanf</strong> it is false and dangerous: a <code>float*</code> needs <code>%f</code> and a <code>double*</code> needs <code>%lf</code>, because there is no promotion through a pointer.</li>
<li><strong>Using the wrong specifier is undefined behaviour, not a conversion</strong> — <code>printf("%d", 3.14)</code> does not print 3 and does not round; it reinterprets the bits of a <code>double</code> as an <code>int</code>, and what comes out is junk. Compile with <code>-Wall</code> (which turns on <code>-Wformat</code>) and the compiler catches it every time.</li>
</ul>
<table>
<thead><tr><th>Specifier</th><th>Argument type it expects</th><th>Example code</th><th>Real output</th></tr></thead>
<tbody>
<tr><td><code>%d</code></td><td><code>int</code> (also char/short after promotion)</td><td><code>printf("%d", 255)</code></td><td><code>255</code></td></tr>
<tr><td><code>%i</code></td><td><code>int</code> — identical to <code>%d</code> in printf</td><td><code>printf("%i", 255)</code></td><td><code>255</code></td></tr>
<tr><td><code>%u</code></td><td><code>unsigned int</code></td><td><code>printf("%u", 4294967295u)</code></td><td><code>4294967295</code></td></tr>
<tr><td><code>%ld</code></td><td><code>long</code></td><td><code>printf("%ld", 1234567890L)</code></td><td><code>1234567890</code></td></tr>
<tr><td><code>%lld</code></td><td><code>long long</code></td><td><code>printf("%lld", 9876543210LL)</code></td><td><code>9876543210</code></td></tr>
<tr><td><code>%f</code></td><td><code>double</code> (a <code>float</code> is promoted to it)</td><td><code>printf("%f", 3.14159f)</code></td><td><code>3.141590</code></td></tr>
<tr><td><code>%f</code></td><td>the same specifier, a real <code>double</code></td><td><code>printf("%f", 3.14159265358979)</code></td><td><code>3.141593</code></td></tr>
<tr><td><code>%lf</code></td><td><code>double</code> — same as <code>%f</code> in printf</td><td><code>printf("%lf", 3.14159265358979)</code></td><td><code>3.141593</code></td></tr>
<tr><td><code>%e</code></td><td><code>double</code>, scientific notation</td><td><code>printf("%e", 3.14159265358979)</code></td><td><code>3.141593e+00</code></td></tr>
<tr><td><code>%g</code></td><td><code>double</code>, shorter of %f/%e, no trailing zeros</td><td><code>printf("%g", 3.14159265358979)</code></td><td><code>3.14159</code></td></tr>
<tr><td><code>%g</code></td><td>same, but a large value switches to %e</td><td><code>printf("%g", 1234567.0)</code></td><td><code>1.23457e+06</code></td></tr>
<tr><td><code>%c</code></td><td><code>int</code> holding a character code</td><td><code>printf("%c", 'A')</code></td><td><code>A</code></td></tr>
<tr><td><code>%s</code></td><td><code>char *</code> — a '\\0'-terminated string</td><td><code>printf("%s", "Hello")</code></td><td><code>Hello</code></td></tr>
<tr><td><code>%p</code></td><td><code>void *</code> — an address</td><td><code>printf("%p", (void*)&amp;x)</code></td><td><code>0x16bde237c</code> (varies per run)</td></tr>
<tr><td><code>%x</code></td><td><code>unsigned int</code>, base 16, lowercase</td><td><code>printf("%x", 255)</code></td><td><code>ff</code> (and <code>%X</code> gives <code>FF</code>)</td></tr>
<tr><td><code>%o</code></td><td><code>unsigned int</code>, base 8</td><td><code>printf("%o", 255)</code></td><td><code>377</code></td></tr>
<tr><td><code>%%</code></td><td>no argument at all — prints one percent sign</td><td><code>printf("%%")</code></td><td><code>%</code></td></tr>
</tbody>
</table>
<p class="dap-an">✅ Every output above came from one program compiled with <code>cc -Wall -std=c99</code> and run; no value was typed from memory. Two notes on what the slide does <em>not</em> say. (1) The slide's table has no row for <code>%s</code>, <code>%p</code> or <code>%%</code>, yet all three are used in the deck's own examples on slides 61–62 and in the exercises — they are listed here to close the gap, not to contradict the slide. (2) The slide's "Use With: <code>char, int, short, long, long long</code>" for <code>%d</code> is safe only because of promotion; a genuine <code>long</code> needs <code>%ld</code>, and passing one to a bare <code>%d</code> is undefined behaviour even though the slide's wording seems to allow it.</p>
<p class="pitfall">⚠️ Measured, three times, with <code>cc -Wall</code>: <code>printf("%d", 3.14)</code> printed <strong>1374389535</strong>; <code>printf("%f", 7)</code> printed <strong>0.000000</strong>; and <code>printf("%d %d", 1)</code> — one specifier too many — printed <strong><code>1 1832084584</code></strong>. All three produced a <code>-Wformat</code> warning at compile time and no error at all at run time. And in <code>scanf</code>, reading into a <code>double</code> with <code>%f</code> left the variable at <code>-1.000000239815563</code> instead of 3.5 — the value is silently mangled, not refused.</p>`,
        `<p class="y-chinh">🎯 Bảng tra cứu của cả bộ slide. Slide liệt kê tám dòng — <code>%c</code>, <code>%d</code>, <code>%u</code>, <code>%o</code>, <code>%x</code>, <code>%f</code>, <code>%g</code>, <code>%e</code> — mỗi dòng ghi nó in ra cái gì và dùng được với kiểu nào. Bảng dưới đây chính là bảng đó, bổ sung thêm <code>%i</code>, <code>%ld</code>, <code>%lld</code>, <code>%lf</code>, <code>%s</code>, <code>%p</code>, <code>%%</code>, và mỗi dòng đều có output đo thật.</p>
<ul>
<li><strong>Ba cột của chính slide</strong> — "Specifier / Output As A / Use With". Hãy đọc nó như một bản hợp đồng: <code>%d</code> in ra dạng thập phân và dùng được với <code>char, int, short, long, long long</code>; <code>%f</code> in ra số thực và dùng được với <code>float, double, long double</code>; v.v.</li>
<li><strong>Nhóm số nguyên</strong> — <code>%d</code> và <code>%i</code> giống hệt nhau trong <code>printf</code> (chúng chỉ khác nhau trong <code>scanf</code>, nơi <code>%i</code> tự nhận ra tiền tố <code>0x</code> và <code>0</code>). <code>%u</code> đọc cùng dãy bit đó nhưng hiểu là số <em>không dấu</em>, vì thế <code>printf("%u", -1)</code> in ra 4294967295 chứ không phải -1.</li>
<li><strong>Nhóm đổi cơ số</strong> — <code>%o</code> (bát phân) và <code>%x</code> (thập lục phân) in cùng số nguyên đó ở hệ khác, không kèm tiền tố <code>0</code> hay <code>0x</code> trừ khi bạn thêm cờ <code>#</code>. <code>%X</code> dùng chữ hoa. Đây chính là thứ Exercise 4 cần để in ra "63h, 62h, 61h".</li>
<li><strong>Nhóm số thực</strong> — <code>%f</code> là dạng cố định, mặc định 6 số lẻ; <code>%e</code> là dạng khoa học; <code>%g</code> tự chọn cái nào ngắn hơn trong hai cái và bỏ các số 0 thừa ở đuôi. <code>%g</code> là lựa chọn khi bạn chưa biết trước độ lớn của số.</li>
<li><strong>Dòng bị hỏi nhiều nhất trên slide này</strong> — <code>%f</code> "Use With: float, double, long double". Trong <strong>printf</strong> thì đúng, nhờ luật nâng kiểu đối số mặc định: một <code>float</code> được nới thành <code>double</code> trước khi <code>printf</code> nhìn thấy, nên <code>%f</code> phục vụ được cả hai. Trong <strong>scanf</strong> thì sai và nguy hiểm: <code>float*</code> phải dùng <code>%f</code>, còn <code>double*</code> <strong>bắt buộc</strong> <code>%lf</code>, vì đi qua con trỏ thì không có nâng kiểu nào cả.</li>
<li><strong>Dùng sai specifier là hành vi KHÔNG XÁC ĐỊNH, không phải phép chuyển kiểu</strong> — <code>printf("%d", 3.14)</code> không in ra 3 và không làm tròn; nó đọc lại dãy bit của một <code>double</code> như thể là <code>int</code>, và cái ra được là rác. Dịch với <code>-Wall</code> (nó bật <code>-Wformat</code>) thì trình biên dịch bắt được mọi lần.</li>
</ul>
<table>
<thead><tr><th>Specifier</th><th>Kiểu đối số nó chờ</th><th>Mã ví dụ</th><th>Output THẬT</th></tr></thead>
<tbody>
<tr><td><code>%d</code></td><td><code>int</code> (char/short cũng được, sau nâng kiểu)</td><td><code>printf("%d", 255)</code></td><td><code>255</code></td></tr>
<tr><td><code>%i</code></td><td><code>int</code> — giống hệt <code>%d</code> trong printf</td><td><code>printf("%i", 255)</code></td><td><code>255</code></td></tr>
<tr><td><code>%u</code></td><td><code>unsigned int</code></td><td><code>printf("%u", 4294967295u)</code></td><td><code>4294967295</code></td></tr>
<tr><td><code>%ld</code></td><td><code>long</code></td><td><code>printf("%ld", 1234567890L)</code></td><td><code>1234567890</code></td></tr>
<tr><td><code>%lld</code></td><td><code>long long</code></td><td><code>printf("%lld", 9876543210LL)</code></td><td><code>9876543210</code></td></tr>
<tr><td><code>%f</code></td><td><code>double</code> (một <code>float</code> được nâng lên nó)</td><td><code>printf("%f", 3.14159f)</code></td><td><code>3.141590</code></td></tr>
<tr><td><code>%f</code></td><td>cùng specifier, với <code>double</code> thật</td><td><code>printf("%f", 3.14159265358979)</code></td><td><code>3.141593</code></td></tr>
<tr><td><code>%lf</code></td><td><code>double</code> — trong printf giống <code>%f</code></td><td><code>printf("%lf", 3.14159265358979)</code></td><td><code>3.141593</code></td></tr>
<tr><td><code>%e</code></td><td><code>double</code>, ký hiệu khoa học</td><td><code>printf("%e", 3.14159265358979)</code></td><td><code>3.141593e+00</code></td></tr>
<tr><td><code>%g</code></td><td><code>double</code>, chọn cái ngắn hơn giữa %f/%e</td><td><code>printf("%g", 3.14159265358979)</code></td><td><code>3.14159</code></td></tr>
<tr><td><code>%g</code></td><td>cũng nó, số lớn thì tự chuyển sang %e</td><td><code>printf("%g", 1234567.0)</code></td><td><code>1.23457e+06</code></td></tr>
<tr><td><code>%c</code></td><td><code>int</code> chứa mã của một ký tự</td><td><code>printf("%c", 'A')</code></td><td><code>A</code></td></tr>
<tr><td><code>%s</code></td><td><code>char *</code> — chuỗi kết thúc bằng '\\0'</td><td><code>printf("%s", "Hello")</code></td><td><code>Hello</code></td></tr>
<tr><td><code>%p</code></td><td><code>void *</code> — một địa chỉ</td><td><code>printf("%p", (void*)&amp;x)</code></td><td><code>0x16bde237c</code> (khác nhau mỗi lần chạy)</td></tr>
<tr><td><code>%x</code></td><td><code>unsigned int</code>, hệ 16, chữ thường</td><td><code>printf("%x", 255)</code></td><td><code>ff</code> (và <code>%X</code> cho <code>FF</code>)</td></tr>
<tr><td><code>%o</code></td><td><code>unsigned int</code>, hệ 8</td><td><code>printf("%o", 255)</code></td><td><code>377</code></td></tr>
<tr><td><code>%%</code></td><td>không nhận đối số nào — in ra một dấu phần trăm</td><td><code>printf("%%")</code></td><td><code>%</code></td></tr>
</tbody>
</table>
<p class="dap-an">✅ Mọi output trên đều do một chương trình biên dịch bằng <code>cc -Wall -std=c99</code> chạy ra; không có giá trị nào gõ theo trí nhớ. Hai điều slide <em>không</em> nói. (1) Bảng trên slide không có dòng nào cho <code>%s</code>, <code>%p</code> hay <code>%%</code>, thế mà cả ba đều được dùng ngay trong ví dụ của chính bộ slide ở slide 61–62 và trong các bài tập — liệt kê ở đây là để bù chỗ thiếu, không phải để cãi slide. (2) Dòng "Use With: <code>char, int, short, long, long long</code>" của <code>%d</code> chỉ an toàn nhờ luật nâng kiểu; một biến <code>long</code> thật sự thì phải dùng <code>%ld</code>, truyền nó cho <code>%d</code> trơ là hành vi không xác định, dù cách viết trên slide trông như cho phép.</p>
<p class="pitfall">⚠️ Đo thật, ba lần, bằng <code>cc -Wall</code>: <code>printf("%d", 3.14)</code> in ra <strong>1374389535</strong>; <code>printf("%f", 7)</code> in ra <strong>0.000000</strong>; và <code>printf("%d %d", 1)</code> — thừa một specifier — in ra <strong><code>1 1832084584</code></strong>. Cả ba đều sinh cảnh báo <code>-Wformat</code> lúc dịch và tuyệt nhiên không có lỗi nào lúc chạy. Còn trong <code>scanf</code>, đọc vào một <code>double</code> bằng <code>%f</code> làm biến giữ nguyên giá trị hỏng <code>-1.000000239815563</code> thay vì 3.5 — giá trị bị phá âm thầm chứ không bị từ chối.</p>`],

      [61, 'printf(…) function: Example 1',
        `<p class="y-chinh">🎯 The slide puts the code on the left and the resulting console on the right, with two ruler lines (<code>00000000011</code> / <code>12345678901</code>) so you can literally count the columns. It walks the same value, <code>4321</code>, through four integer formats, then a float, then a double, then a character.</p>
<ul>
<li><strong>The integers</strong> — <code>%d</code> gives <code>4321</code>; <code>%10d</code> gives <code>      4321</code> (six spaces then the digits, ten columns total); <code>%010d</code> gives <code>0000004321</code> (the <code>0</code> flag replaces the spaces with zeros); <code>%-10d</code> gives <code>4321      </code> (the <code>-</code> flag moves the value to the left edge).</li>
<li><strong>Why the two ruler lines are there</strong> — <code>00000000011</code> over <code>12345678901</code> reads vertically as 1,2,3,…,9,10,11. The deck prints them before each block so you can check by eye that the <code>4321</code> really does end in column 10. Steal this trick when you debug your own tables.</li>
<li><strong>The float and the double give the same text</strong> — <code>%f</code> of <code>4321.9876546</code> prints <code>4321.987655</code>, and <code>%lf</code> of the same value prints <code>4321.987655</code>. Identical, because in <code>printf</code> the <code>l</code> size letter changes nothing for floating point. Note also the default: exactly <strong>6</strong> digits after the point, and the seventh digit caused a round <em>up</em> from …65<u>4</u>6 to …655.</li>
<li><strong>Read the fourth double line carefully</strong> — it is <code>%10.3lf</code>: <code>l</code> is a lowercase L (the size letter), not the digit one. Width 10, precision 3, size <code>l</code>, conversion <code>f</code>. This is the single most misread line in the whole deck.</li>
<li><strong>The three formatted doubles</strong> — <code>%10.3lf</code> gives <code>  4321.988</code>; <code>%010.3lf</code> gives <code>004321.988</code>; <code>%-10.3lf</code> gives <code>4321.988  </code>. The rounding to three decimals happens first, then the padding fills the field to 10 columns.</li>
<li><strong>The character block is the real lesson</strong> — the same value <code>'d'</code> is printed three ways: <code>%c</code> gives <code>d</code>, <code>%d</code> gives <code>100</code>, <code>%o</code> gives <code>144</code>. A <code>char</code> in C <em>is</em> a small integer; the specifier decides whether you see the glyph, its decimal code, or its octal code. Exercise 4 on slide 64 is built entirely on this idea.</li>
</ul>
<pre><code>printf("%d|&lt;--        %%d\\n", 4321);
printf("%10d|&lt;--   %%10d\\n", 4321);
printf("%010d|&lt;--  %%010d\\n", 4321);
printf("%-10d|&lt;--  %%-10d\\n", 4321);

printf("%f|&lt;-- %%f\\n",   4321.9876546);
printf("%lf|&lt;-- %%lf\\n", 4321.9876546);
printf("%10.3lf|&lt;--  %%10.3lf\\n",  4321.9876546);
printf("%010.3lf|&lt;--  %%010.3lf\\n", 4321.9876546);
printf("%-10.3lf|&lt;--  %%-10.3lf\\n", 4321.9876546);

printf("%c|&lt;--  %%c\\n", 'd');
printf("%d|&lt;--  %%d\\n", 'd');
printf("%o|&lt;--  %%o\\n", 'd');</code></pre>
<p class="dap-an">✅ The whole slide was retyped, compiled with <code>cc -Wall -std=c99</code> and run. Every line matches the slide exactly: <code>4321</code> · <code>      4321</code> · <code>0000004321</code> · <code>4321      </code> · <code>4321.987655</code> (both <code>%f</code> and <code>%lf</code>) · <code>  4321.988</code> · <code>004321.988</code> · <code>4321.988  </code> · <code>d</code> · <code>100</code> · <code>144</code>. One warning about reading the slide image: typed as <code>%10.31f</code> (with the digit one) the same call prints <code>4321.9876545999995869351550936698914</code> — 31 decimals — which is how you can prove to yourself that the character really is a lowercase L.</p>
<p class="meo">💡 The <code>|&lt;--</code> at the end of each output line is not magic: it is literal text inside the format string, placed right after the specifier so the right-hand edge of the field is visible. Put a <code>|</code> on both sides of a specifier whenever you are unsure what your padding is doing.</p>`,
        `<p class="y-chinh">🎯 Slide đặt mã bên trái, console kết quả bên phải, kèm hai dòng thước (<code>00000000011</code> / <code>12345678901</code>) để bạn đếm cột bằng mắt được thật. Nó dắt đúng một giá trị, <code>4321</code>, đi qua bốn định dạng số nguyên, rồi tới một float, một double, rồi một ký tự.</p>
<ul>
<li><strong>Phần số nguyên</strong> — <code>%d</code> cho <code>4321</code>; <code>%10d</code> cho <code>      4321</code> (sáu dấu cách rồi tới chữ số, tổng cộng mười cột); <code>%010d</code> cho <code>0000004321</code> (cờ <code>0</code> thay dấu cách bằng số 0); <code>%-10d</code> cho <code>4321      </code> (cờ <code>-</code> đẩy giá trị về mép trái).</li>
<li><strong>Hai dòng thước để làm gì</strong> — <code>00000000011</code> nằm trên <code>12345678901</code>, đọc dọc xuống là 1,2,3,…,9,10,11. Bộ slide in chúng trước mỗi khối để bạn kiểm bằng mắt rằng <code>4321</code> quả thật kết thúc ở cột thứ 10. Hãy học lỏm mẹo này khi tự gỡ lỗi bảng của mình.</li>
<li><strong>float và double cho ra cùng một dòng chữ</strong> — <code>%f</code> của <code>4321.9876546</code> in ra <code>4321.987655</code>, và <code>%lf</code> của cùng giá trị cũng in ra <code>4321.987655</code>. Giống hệt nhau, vì trong <code>printf</code> chữ size <code>l</code> chẳng thay đổi gì với số thực. Cũng để ý mặc định: đúng <strong>6</strong> chữ số sau dấu chấm, và chữ số thứ bảy đã làm tròn <em>lên</em> từ …65<u>4</u>6 thành …655.</li>
<li><strong>Đọc thật kỹ dòng double thứ tư</strong> — nó là <code>%10.3lf</code>: chữ <code>l</code> là chữ L thường (chữ cái size), không phải chữ số một. Rộng 10, độ chính xác 3, size <code>l</code>, chuyển đổi <code>f</code>. Đây là dòng bị đọc nhầm nhiều nhất trong cả bộ slide.</li>
<li><strong>Ba dòng double có định dạng</strong> — <code>%10.3lf</code> cho <code>  4321.988</code>; <code>%010.3lf</code> cho <code>004321.988</code>; <code>%-10.3lf</code> cho <code>4321.988  </code>. Việc làm tròn về ba số lẻ xảy ra trước, rồi phần đệm mới lấp cho đủ 10 cột.</li>
<li><strong>Khối ký tự mới là bài học thật</strong> — cùng một giá trị <code>'d'</code> được in ba kiểu: <code>%c</code> cho <code>d</code>, <code>%d</code> cho <code>100</code>, <code>%o</code> cho <code>144</code>. Trong C, một <code>char</code> <em>chính là</em> một số nguyên nhỏ; specifier mới là thứ quyết định bạn thấy hình chữ, thấy mã thập phân hay thấy mã bát phân. Exercise 4 ở slide 64 dựng hoàn toàn trên ý này.</li>
</ul>
<pre><code>printf("%d|&lt;--        %%d\\n", 4321);
printf("%10d|&lt;--   %%10d\\n", 4321);
printf("%010d|&lt;--  %%010d\\n", 4321);
printf("%-10d|&lt;--  %%-10d\\n", 4321);

printf("%f|&lt;-- %%f\\n",   4321.9876546);
printf("%lf|&lt;-- %%lf\\n", 4321.9876546);
printf("%10.3lf|&lt;--  %%10.3lf\\n",  4321.9876546);
printf("%010.3lf|&lt;--  %%010.3lf\\n", 4321.9876546);
printf("%-10.3lf|&lt;--  %%-10.3lf\\n", 4321.9876546);

printf("%c|&lt;--  %%c\\n", 'd');
printf("%d|&lt;--  %%d\\n", 'd');
printf("%o|&lt;--  %%o\\n", 'd');</code></pre>
<p class="dap-an">✅ Cả slide đã được gõ lại, biên dịch bằng <code>cc -Wall -std=c99</code> và chạy. Mọi dòng khớp đúng với slide: <code>4321</code> · <code>      4321</code> · <code>0000004321</code> · <code>4321      </code> · <code>4321.987655</code> (cả <code>%f</code> lẫn <code>%lf</code>) · <code>  4321.988</code> · <code>004321.988</code> · <code>4321.988  </code> · <code>d</code> · <code>100</code> · <code>144</code>. Một cảnh báo khi đọc ảnh slide: nếu gõ thành <code>%10.31f</code> (với chữ số một) thì cùng lời gọi đó in ra <code>4321.9876545999995869351550936698914</code> — 31 chữ số lẻ — và đó là cách bạn tự chứng minh được rằng ký tự kia đúng là chữ L thường.</p>
<p class="meo">💡 Cụm <code>|&lt;--</code> ở cuối mỗi dòng không có phép thuật gì: nó là chữ thường nằm trong chuỗi định dạng, đặt ngay sau specifier để nhìn thấy mép phải của ô. Cứ kẹp một dấu <code>|</code> ở hai bên specifier mỗi khi bạn chưa chắc phần đệm đang làm gì.</p>`],

      [62, 'printf(…) function: Example 2 — one line, four aligned fields',
        `<p class="y-chinh">🎯 The deck's closing example: read four values of four different types with one <code>scanf</code>, then print them as one aligned row with one <code>printf</code>. The format string is <code>"%-20s:%10d%15ld%5c%12.6lf\\n"</code> and the slide annotates every field underneath the console.</p>
<ul>
<li><strong>The program, line by line</strong> — it declares <code>int n; long lo; char ch; double d;</code>, prints a prompt, reads with <code>scanf("%d %ld %c %lf", &amp;n, &amp;lo, &amp;ch, &amp;d);</code>, then prints everything in a single formatted line and returns 0.</li>
<li><strong>The four fields and the slide's own labels</strong> — <code>%-20s</code> is "Size=20, left align" (the caption); <code>%10d</code> is "Size=10, right align"; <code>%15ld</code> is "Size=15, right align"; <code>%5c</code> is "5, right align"; <code>%12.6lf</code> is "Size=12 including the dot character, right align".</li>
<li><strong>Each specifier is matched to its type on purpose</strong> — <code>%10d</code> for the <code>int</code>, <code>%15ld</code> for the <code>long</code> (note the <code>l</code>, without it this is undefined behaviour), <code>%5c</code> for the <code>char</code>, <code>%12.6lf</code> for the <code>double</code>. This is the size table of slide 59 in production.</li>
<li><strong>Yes, <code>%c</code> can take a width</strong> — <code>%5c</code> prints four spaces then the character. Width applies to <em>every</em> conversion, not only to numbers; this is how you centre a single character in a table column.</li>
<li><strong>"Size=12 including the dot" is the sentence to remember</strong> — the width counts <strong>all</strong> the printed characters: the integer digits, the decimal point, the fraction digits, and the sign. <code>45.230000</code> is 9 characters, so <code>%12.6lf</code> adds 3 spaces in front. Students who assume the width counts only the digits before the point misalign every money column they ever print.</li>
<li><strong>The <code>scanf</code> line is a lesson of its own</strong> — <code>%lf</code> for the <code>double</code> (compulsory, see slide 60), <code>%ld</code> for the <code>long</code>, and a <code>%c</code> that would swallow the space before <code>A</code> if the format string did not have a blank in front of it. The prompt even tells the user "(use blank)" because the spaces in the format string are what separate the fields.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main(void)
{   int n; long lo; char ch; double d;
    printf("Input a integer number, a long number, a character, and a double number: (use blank)");
    scanf("%d %ld %c %lf", &amp;n, &amp;lo, &amp;ch, &amp;d);
    printf("%-20s:%10d%15ld%5c%12.6lf\\n", "The inputted values are", n, lo, ch, d);
    return 0;
}</code></pre>
<p class="dap-an">✅ Typed out, compiled with <code>cc -Wall -std=c99</code>, and fed the slide's own input <code>5 135000 A 45.23</code>. The output line is, character for character, the one in the screenshot:<br><code>The inputted values are:         5         135000    A   45.230000</code><br>Measured: the line is 66 characters long. But the slide's caption "Size=20 left align" is <strong>misleading on this very run</strong> — the string <code>The inputted values are</code> is <strong>23</strong> characters, longer than the width 20, so <code>%-20s</code> adds no padding at all and cuts nothing either. The field you see is 23 wide, not 20. That is not a mistake in the program; it is the "width is a minimum" rule from slide 59 catching the deck's own example. Change the width to <code>%-25s</code> and two spaces appear before the colon, which proves the padding code really is there.</p>
<p class="pitfall">⚠️ Drop the space before <code>%c</code> in the <code>scanf</code> format — write <code>"%d %ld%c %lf"</code> — and <code>ch</code> receives the <strong>space</strong> character that separated the numbers, not <code>'A'</code>. Then <code>%lf</code> tries to read <code>A</code> as a number, fails, and <code>d</code> keeps whatever garbage it had. <code>%c</code> is the one conversion that does <em>not</em> skip whitespace by itself; the blank in the format string is what makes it skip.</p>`,
        `<p class="y-chinh">🎯 Ví dụ khép lại bộ slide: đọc bốn giá trị thuộc bốn kiểu khác nhau bằng một lệnh <code>scanf</code>, rồi in chúng ra thành một hàng canh cột bằng một lệnh <code>printf</code>. Chuỗi định dạng là <code>"%-20s:%10d%15ld%5c%12.6lf\\n"</code> và slide chú thích từng ô ngay dưới ảnh console.</p>
<ul>
<li><strong>Chương trình, từng dòng</strong> — khai báo <code>int n; long lo; char ch; double d;</code>, in câu nhắc, đọc bằng <code>scanf("%d %ld %c %lf", &amp;n, &amp;lo, &amp;ch, &amp;d);</code>, rồi in tất cả trên một dòng có định dạng và trả về 0.</li>
<li><strong>Bốn ô và nhãn của chính slide</strong> — <code>%-20s</code> là "Size=20, left align" (căn trái); <code>%10d</code> là "Size=10, right align"; <code>%15ld</code> là "Size=15, right align"; <code>%5c</code> là "5, right align"; <code>%12.6lf</code> là "Size=12 including the dot character, right align" — rộng 12 kể cả dấu chấm.</li>
<li><strong>Mỗi specifier được khớp với kiểu của nó một cách có chủ ý</strong> — <code>%10d</code> cho <code>int</code>, <code>%15ld</code> cho <code>long</code> (để ý chữ <code>l</code>, thiếu nó là hành vi không xác định), <code>%5c</code> cho <code>char</code>, <code>%12.6lf</code> cho <code>double</code>. Đây chính là bảng size của slide 59 đem ra dùng thật.</li>
<li><strong>Đúng vậy, <code>%c</code> cũng nhận được độ rộng</strong> — <code>%5c</code> in bốn dấu cách rồi tới ký tự. Độ rộng áp dụng cho <em>mọi</em> phép chuyển đổi chứ không riêng gì số; đó là cách bạn đặt một ký tự lẻ vào giữa một cột bảng.</li>
<li><strong>"Size=12 kể cả dấu chấm" là câu phải nhớ</strong> — độ rộng đếm <strong>tất cả</strong> ký tự được in ra: phần nguyên, dấu chấm thập phân, phần lẻ và cả dấu âm. <code>45.230000</code> dài 9 ký tự, nên <code>%12.6lf</code> thêm 3 dấu cách ở trước. Sinh viên nào tưởng độ rộng chỉ đếm phần trước dấu chấm thì mọi cột tiền in ra đều lệch.</li>
<li><strong>Dòng <code>scanf</code> là một bài học riêng</strong> — <code>%lf</code> cho <code>double</code> (bắt buộc, xem slide 60), <code>%ld</code> cho <code>long</code>, và một <code>%c</code> mà nếu chuỗi định dạng không có dấu cách đứng trước thì nó sẽ nuốt luôn dấu cách trước chữ <code>A</code>. Câu nhắc còn dặn người dùng "(use blank)" vì chính các dấu cách trong chuỗi định dạng là thứ tách các ô ra.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main(void)
{   int n; long lo; char ch; double d;
    printf("Input a integer number, a long number, a character, and a double number: (use blank)");
    scanf("%d %ld %c %lf", &amp;n, &amp;lo, &amp;ch, &amp;d);
    printf("%-20s:%10d%15ld%5c%12.6lf\\n", "The inputted values are", n, lo, ch, d);
    return 0;
}</code></pre>
<p class="dap-an">✅ Đã gõ lại, biên dịch bằng <code>cc -Wall -std=c99</code>, và nhập đúng dữ liệu của slide <code>5 135000 A 45.23</code>. Dòng kết quả trùng khít từng ký tự với ảnh chụp:<br><code>The inputted values are:         5         135000    A   45.230000</code><br>Đo được: dòng này dài 66 ký tự. Nhưng chú thích "Size=20 left align" của slide <strong>gây hiểu nhầm ngay ở chính lần chạy này</strong> — chuỗi <code>The inputted values are</code> dài <strong>23</strong> ký tự, dài hơn độ rộng 20, nên <code>%-20s</code> không đệm thêm chút nào và cũng không cắt đi chút nào. Ô bạn nhìn thấy rộng 23 chứ không phải 20. Đó không phải lỗi của chương trình; đó là luật "width là số tối thiểu" ở slide 59 bắt thóp chính ví dụ của bộ slide. Đổi độ rộng thành <code>%-25s</code> thì hai dấu cách hiện ra trước dấu hai chấm, chứng minh phần đệm vẫn hoạt động.</p>
<p class="pitfall">⚠️ Bỏ dấu cách trước <code>%c</code> trong chuỗi của <code>scanf</code> — viết <code>"%d %ld%c %lf"</code> — thì <code>ch</code> nhận được ký tự <strong>dấu cách</strong> ngăn giữa các số, chứ không phải <code>'A'</code>. Sau đó <code>%lf</code> cố đọc chữ <code>A</code> thành số, thất bại, và <code>d</code> giữ nguyên đống rác nó đang có. <code>%c</code> là phép chuyển đổi duy nhất <em>không</em> tự bỏ qua khoảng trắng; dấu cách trong chuỗi định dạng mới là thứ bắt nó bỏ qua.</p>`],

      [63, 'Summary — Formatted Output',
        `<p class="y-chinh">🎯 The checklist slide: <strong>Formatted Output</strong> → <code>putchar</code> → <code>printf</code>, then Q&amp;A. Three words, but each one should unpack into a paragraph in your head before you turn the page.</p>
<ul>
<li><strong>Formatted Output — the concept</strong> — standard output is a buffer that empties on <code>\\n</code> or when full; <code>stdio.h</code> is the library; there are exactly two functions. If you can say that sentence you have slide 56.</li>
<li><strong><code>putchar</code> — the one-line summary</strong> — <code>int putchar(int);</code> writes one character and returns it, or <code>EOF</code> (measured: <code>-1</code>) on error. No formatting, no width, no newline. Fast, and impossible to give a wrong specifier.</li>
<li><strong><code>printf</code> — the one-line summary</strong> — sends data under format control and returns the <strong>number of characters</strong> sent. Its first argument is a map; the rest is cargo; the compiler cannot check the cargo, only <code>-Wall</code> can.</li>
<li><strong>The format string grammar, in order</strong> — <code>%</code> · flags · width · <code>.</code> precision · size · conversion character. Flags <code>-</code> (left), <code>0</code> (zero pad), <code>+</code> (sign). Width is a minimum. Precision is decimals for <code>%f</code>, significant digits for <code>%g</code>, a maximum length for <code>%s</code>. Size is <code>h/hh/l/ll</code> for integers and <code>l/L</code> for floating point.</li>
<li><strong>The four traps this block has proved, not asserted</strong> — (1) wrong specifier is undefined behaviour, and <code>printf("%d", 3.14)</code> really printed <code>1374389535</code>; (2) in <code>scanf</code>, <code>double</code> must use <code>%lf</code> or the variable is silently corrupted; (3) <code>%.2f</code> rounds the <em>display</em>, never the variable; (4) to print a percent sign you write <code>%%</code>.</li>
<li><strong>What comes next in PRF192</strong> — Slot 13-15 is arrays and structs, Slot 16-18 is strings (where <code>%s</code> stops being a mystery), Slot 19-20 is files (where the same format strings reappear as <code>fprintf</code> and <code>fscanf</code>). Nothing you learned here is thrown away; it is all reused with an <code>f</code> in front.</li>
</ul>
<table>
<thead><tr><th>Question that shows up in exams</th><th>The answer, verified</th></tr></thead>
<tbody>
<tr><td>What does <code>putchar</code> return?</td><td>The character written, as an <code>int</code> — <code>putchar('A')</code> returned <strong>65</strong>; <code>EOF</code> (<strong>-1</strong>) on error</td></tr>
<tr><td>What does <code>printf</code> return?</td><td>The number of characters sent — <code>printf("Hello, %d!\\n", 42)</code> returned <strong>11</strong></td></tr>
<tr><td>How do you print one <code>%</code>?</td><td><code>printf("%%")</code> → <code>%</code>; it consumes no argument</td></tr>
<tr><td>Does <code>%5.2f</code> change the variable?</td><td>No. <code>d</code> stayed <code>3.1415900000</code> while printing as <code>3.14</code></td></tr>
<tr><td>Is width a maximum?</td><td>No, a minimum: <code>printf("%3d", 1234567)</code> printed all <strong>7</strong> digits</td></tr>
<tr><td>Which specifier for a <code>double</code> in <code>scanf</code>?</td><td><code>%lf</code> — never <code>%f</code></td></tr>
</tbody>
</table>
<p class="meo">💡 A good revision drill: take the table on slide 60, cover the output column, and write what each line prints. Then compile and check. Anything you got wrong is exactly the line that will cost you a mark.</p>`,
        `<p class="y-chinh">🎯 Slide điểm danh: <strong>Formatted Output</strong> → <code>putchar</code> → <code>printf</code>, rồi Q&amp;A. Chỉ ba chữ, nhưng mỗi chữ phải mở ra được thành một đoạn trong đầu bạn trước khi lật trang.</p>
<ul>
<li><strong>Formatted Output — khái niệm</strong> — xuất chuẩn là một bộ đệm, nó xả khi gặp <code>\\n</code> hoặc khi đầy; thư viện là <code>stdio.h</code>; có đúng hai hàm. Nói được câu đó là bạn đã nắm slide 56.</li>
<li><strong><code>putchar</code> — tóm một dòng</strong> — <code>int putchar(int);</code> ghi một ký tự và trả về chính nó, hoặc <code>EOF</code> (đo được: <code>-1</code>) khi lỗi. Không định dạng, không độ rộng, không xuống dòng. Nhanh, và không thể truyền nhầm specifier.</li>
<li><strong><code>printf</code> — tóm một dòng</strong> — gửi dữ liệu dưới sự điều khiển của định dạng và trả về <strong>số ký tự</strong> đã gửi. Đối số đầu là bản đồ; phần còn lại là hàng hoá; trình biên dịch không kiểm được hàng hoá, chỉ <code>-Wall</code> mới kiểm.</li>
<li><strong>Văn phạm chuỗi định dạng, theo thứ tự</strong> — <code>%</code> · cờ · độ rộng · <code>.</code> độ chính xác · size · ký tự chuyển đổi. Cờ <code>-</code> (căn trái), <code>0</code> (đệm số 0), <code>+</code> (hiện dấu). Độ rộng là số tối thiểu. Độ chính xác là số lẻ với <code>%f</code>, số chữ số có nghĩa với <code>%g</code>, độ dài tối đa với <code>%s</code>. Size là <code>h/hh/l/ll</code> cho số nguyên và <code>l/L</code> cho số thực.</li>
<li><strong>Bốn cái bẫy khối này đã CHỨNG MINH chứ không chỉ khẳng định</strong> — (1) sai specifier là hành vi không xác định, và <code>printf("%d", 3.14)</code> in ra thật <code>1374389535</code>; (2) trong <code>scanf</code>, <code>double</code> phải dùng <code>%lf</code> nếu không biến bị phá âm thầm; (3) <code>%.2f</code> làm tròn phần <em>hiển thị</em>, không bao giờ đụng tới biến; (4) muốn in dấu phần trăm thì viết <code>%%</code>.</li>
<li><strong>Tiếp theo trong PRF192 là gì</strong> — Slot 13-15 là mảng và struct, Slot 16-18 là chuỗi (chỗ <code>%s</code> hết còn bí ẩn), Slot 19-20 là tệp tin (chỗ đúng những chuỗi định dạng này quay lại dưới tên <code>fprintf</code> và <code>fscanf</code>). Không có gì bạn học ở đây bị bỏ đi; tất cả đều được dùng lại, chỉ thêm chữ <code>f</code> ở đằng trước.</li>
</ul>
<table>
<thead><tr><th>Câu hỏi hay xuất hiện trong đề thi</th><th>Đáp án, đã kiểm</th></tr></thead>
<tbody>
<tr><td><code>putchar</code> trả về gì?</td><td>Ký tự vừa ghi, dưới dạng <code>int</code> — <code>putchar('A')</code> trả về <strong>65</strong>; lỗi thì trả <code>EOF</code> (<strong>-1</strong>)</td></tr>
<tr><td><code>printf</code> trả về gì?</td><td>Số ký tự đã gửi — <code>printf("Hello, %d!\\n", 42)</code> trả về <strong>11</strong></td></tr>
<tr><td>In một dấu <code>%</code> thế nào?</td><td><code>printf("%%")</code> → <code>%</code>; nó không tiêu thụ đối số nào</td></tr>
<tr><td><code>%5.2f</code> có làm đổi biến không?</td><td>Không. <code>d</code> vẫn là <code>3.1415900000</code> trong khi in ra <code>3.14</code></td></tr>
<tr><td>Độ rộng có phải giới hạn tối đa?</td><td>Không, là tối thiểu: <code>printf("%3d", 1234567)</code> in đủ <strong>7</strong> chữ số</td></tr>
<tr><td>Specifier nào cho <code>double</code> trong <code>scanf</code>?</td><td><code>%lf</code> — tuyệt đối không dùng <code>%f</code></td></tr>
</tbody>
</table>
<p class="meo">💡 Một bài ôn tốt: lấy bảng ở slide 60, che cột output đi, rồi tự viết ra mỗi dòng in cái gì. Sau đó biên dịch và đối chiếu. Dòng nào bạn viết sai đúng là dòng sẽ lấy mất điểm của bạn.</p>`],

      [64, 'Exercise 4 — a menu program: date validation and ASCII codes',
        `<p class="y-chinh">🎯 The slide asks for a menu — <em>1- Processing date data · 2- Character data · 3- Quit · Choose an operation:</em> — where option 1 validates a date the user types, and option 2 reads two characters and prints the ASCII codes of every character between them in <strong>descending</strong> order, in both decimal and hexadecimal.</p>
<ul>
<li><strong>Read the slide's own worked example</strong> — input <code>ca</code> gives<br><code>c: 99, 63h</code><br><code>b: 98, 62h</code><br><code>a: 97, 61h</code><br>Three formatting facts hide in there: the decimal code comes from <code>%d</code>, the hexadecimal from <code>%x</code>, and the trailing <code>h</code> is a literal character you type into the format string yourself.</li>
<li><strong>Why this exercise lives in the formatted-output slot</strong> — the whole task is one <code>printf("%c: %d, %xh\\n", c, c, c)</code>. The same variable, three specifiers, three different renderings. That is the lesson of slide 61's character block, applied.</li>
<li><strong>The loop is over characters, and that is legal</strong> — <code>for (c = a; c &gt;= b; c--)</code> works because a <code>char</code> is an integer. Descending order simply means you start from the larger code, so swap the two inputs first if the user typed them the other way round.</li>
<li><strong>Date validation: what "valid" must cover</strong> — month in 1..12, day in 1..(days of that month), and February depends on the leap year. A year is leap when it is divisible by 400, or by 4 but not by 100. 2024 is leap, 2023 is not, 1900 is not, 2000 is.</li>
<li><strong>Use a lookup array, not a chain of ifs</strong> — <code>int t[13] = {0,31,28,31,30,31,30,31,31,30,31,30,31};</code> indexes directly by month number (index 0 is unused so the numbers line up). Twelve <code>if</code> branches do the same thing with twelve chances to make a typo.</li>
<li><strong>The menu structure</strong> — a <code>do … while (choice != 3)</code> with a <code>switch</code> inside is the standard shape for every menu exercise in PRF192. Add a <code>default:</code> branch: an exam marker will type <code>9</code> to see whether your program survives it.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int isLeap(int y)
{
    return (y % 400 == 0) || (y % 4 == 0 &amp;&amp; y % 100 != 0);
}

int daysInMonth(int m, int y)
{
    int t[13] = {0,31,28,31,30,31,30,31,31,30,31,30,31};
    if (m == 2 &amp;&amp; isLeap(y)) return 29;
    return t[m];
}

void processDate(void)
{
    int d, m, y;
    printf("Enter day, month, year: ");
    if (scanf("%d %d %d", &amp;d, &amp;m, &amp;y) != 3) { printf("Invalid input!\\n"); return; }
    if (y &lt; 1 || m &lt; 1 || m &gt; 12 || d &lt; 1 || d &gt; daysInMonth(m, y))
        printf("%02d/%02d/%04d is NOT a valid date.\\n", d, m, y);
    else
        printf("%02d/%02d/%04d is a valid date.\\n", d, m, y);
}

void processChars(void)
{
    char a, b, c;
    printf("Enter two characters: ");
    scanf(" %c %c", &amp;a, &amp;b);
    if (a &lt; b) { c = a; a = b; b = c; }      /* descending: start from the larger */
    for (c = a; c &gt;= b; c--)
        printf("%c: %d, %xh\\n", c, c, c);
}

int main(void)
{
    int choice;
    do {
        printf("\\n1- Processing date data\\n");
        printf("2- Character data\\n");
        printf("3- Quit\\n");
        printf("Choose an operation: ");
        if (scanf("%d", &amp;choice) != 1) break;
        switch (choice) {
            case 1: processDate();  break;
            case 2: processChars(); break;
            case 3: printf("Bye!\\n"); break;
            default: printf("Invalid choice, try 1..3\\n");
        }
    } while (choice != 3);
    return 0;
}</code></pre>
<p class="dap-an">✅ Compiled with <code>cc -Wall -std=c99</code> (no warnings) and run against six inputs. Option 2 with <code>c a</code> printed exactly the three lines on the slide: <code>c: 99, 63h</code> / <code>b: 98, 62h</code> / <code>a: 97, 61h</code>. With <code>a d</code> — deliberately typed the wrong way round — the swap kicked in and it printed <code>d: 100, 64h</code> / <code>c: 99, 63h</code> / <code>b: 98, 62h</code> / <code>a: 97, 61h</code>, still descending. Option 1 answered <strong>valid</strong> for <code>29 2 2024</code>, <strong>NOT valid</strong> for <code>29 2 2023</code> (2023 is not a leap year) and <strong>NOT valid</strong> for <code>31 4 2025</code> (April has 30 days). Option 3 printed <code>Bye!</code> and ended the loop.</p>
<p class="meo">💡 The <code>%02d</code> in the date output is the <code>0</code> flag plus width 2 from slide 59 — it is what turns <code>5/3/2025</code> into the conventional <code>05/03/2025</code>. Combined with <code>%04d</code> for the year, the whole date is aligned whatever the user typed.</p>`,
        `<p class="y-chinh">🎯 Slide yêu cầu một chương trình có menu — <em>1- Processing date data · 2- Character data · 3- Quit · Choose an operation:</em> — trong đó lựa chọn 1 kiểm tra một ngày người dùng nhập có hợp lệ không, còn lựa chọn 2 đọc hai ký tự rồi in mã ASCII của mọi ký tự nằm giữa chúng theo thứ tự <strong>giảm dần</strong>, cả hệ thập phân lẫn hệ mười sáu.</p>
<ul>
<li><strong>Đọc kỹ ví dụ mẫu của chính slide</strong> — nhập <code>ca</code> cho ra<br><code>c: 99, 63h</code><br><code>b: 98, 62h</code><br><code>a: 97, 61h</code><br>Có ba chi tiết định dạng nấp trong đó: mã thập phân do <code>%d</code> in, mã thập lục do <code>%x</code> in, và chữ <code>h</code> ở cuối là ký tự thường do chính bạn gõ vào chuỗi định dạng.</li>
<li><strong>Vì sao bài này nằm ở mục xuất có định dạng</strong> — toàn bộ nhiệm vụ gói trong một câu <code>printf("%c: %d, %xh\\n", c, c, c)</code>. Cùng một biến, ba specifier, ba cách vẽ khác nhau. Đó chính là bài học ở khối ký tự của slide 61, đem ra dùng.</li>
<li><strong>Vòng lặp chạy trên ký tự, và điều đó hợp lệ</strong> — <code>for (c = a; c &gt;= b; c--)</code> chạy được vì <code>char</code> là một số nguyên. Giảm dần nghĩa là bắt đầu từ mã lớn hơn, nên phải hoán đổi hai giá trị nhập vào nếu người dùng gõ ngược thứ tự.</li>
<li><strong>Kiểm tra ngày: "hợp lệ" phải bao gồm những gì</strong> — tháng trong 1..12, ngày trong 1..(số ngày của tháng đó), và tháng Hai còn phụ thuộc năm nhuận. Một năm là nhuận khi chia hết cho 400, hoặc chia hết cho 4 mà không chia hết cho 100. 2024 nhuận, 2023 không, 1900 không, 2000 có.</li>
<li><strong>Dùng mảng tra cứu, đừng dùng dãy if</strong> — <code>int t[13] = {0,31,28,31,30,31,30,31,31,30,31,30,31};</code> tra thẳng theo số tháng (ô 0 bỏ trống để các số khớp chỉ số). Mười hai nhánh <code>if</code> làm đúng việc đó nhưng cho bạn mười hai cơ hội gõ nhầm.</li>
<li><strong>Bộ khung của menu</strong> — một <code>do … while (choice != 3)</code> có <code>switch</code> bên trong là dáng chuẩn cho mọi bài menu của PRF192. Nhớ thêm nhánh <code>default:</code>: người chấm thi sẽ gõ <code>9</code> để xem chương trình bạn có sống nổi không.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int isLeap(int y)
{
    return (y % 400 == 0) || (y % 4 == 0 &amp;&amp; y % 100 != 0);
}

int daysInMonth(int m, int y)
{
    int t[13] = {0,31,28,31,30,31,30,31,31,30,31,30,31};
    if (m == 2 &amp;&amp; isLeap(y)) return 29;
    return t[m];
}

void processDate(void)
{
    int d, m, y;
    printf("Enter day, month, year: ");
    if (scanf("%d %d %d", &amp;d, &amp;m, &amp;y) != 3) { printf("Invalid input!\\n"); return; }
    if (y &lt; 1 || m &lt; 1 || m &gt; 12 || d &lt; 1 || d &gt; daysInMonth(m, y))
        printf("%02d/%02d/%04d is NOT a valid date.\\n", d, m, y);
    else
        printf("%02d/%02d/%04d is a valid date.\\n", d, m, y);
}

void processChars(void)
{
    char a, b, c;
    printf("Enter two characters: ");
    scanf(" %c %c", &amp;a, &amp;b);
    if (a &lt; b) { c = a; a = b; b = c; }      /* giam dan: bat dau tu ma lon hon */
    for (c = a; c &gt;= b; c--)
        printf("%c: %d, %xh\\n", c, c, c);
}

int main(void)
{
    int choice;
    do {
        printf("\\n1- Processing date data\\n");
        printf("2- Character data\\n");
        printf("3- Quit\\n");
        printf("Choose an operation: ");
        if (scanf("%d", &amp;choice) != 1) break;
        switch (choice) {
            case 1: processDate();  break;
            case 2: processChars(); break;
            case 3: printf("Bye!\\n"); break;
            default: printf("Invalid choice, try 1..3\\n");
        }
    } while (choice != 3);
    return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch bằng <code>cc -Wall -std=c99</code> (không cảnh báo nào) và chạy với sáu bộ dữ liệu. Lựa chọn 2 với <code>c a</code> in ra đúng ba dòng trên slide: <code>c: 99, 63h</code> / <code>b: 98, 62h</code> / <code>a: 97, 61h</code>. Với <code>a d</code> — cố tình gõ ngược — phần hoán đổi phát huy tác dụng và nó in <code>d: 100, 64h</code> / <code>c: 99, 63h</code> / <code>b: 98, 62h</code> / <code>a: 97, 61h</code>, vẫn giảm dần. Lựa chọn 1 trả lời <strong>hợp lệ</strong> với <code>29 2 2024</code>, <strong>KHÔNG hợp lệ</strong> với <code>29 2 2023</code> (2023 không nhuận) và <strong>KHÔNG hợp lệ</strong> với <code>31 4 2025</code> (tháng Tư có 30 ngày). Lựa chọn 3 in <code>Bye!</code> và kết thúc vòng lặp.</p>
<p class="meo">💡 Cụm <code>%02d</code> trong phần in ngày chính là cờ <code>0</code> cộng độ rộng 2 ở slide 59 — nó biến <code>5/3/2025</code> thành dạng quen thuộc <code>05/03/2025</code>. Đi kèm <code>%04d</code> cho năm thì cả ngày tháng đều canh cột đẹp dù người dùng gõ kiểu gì.</p>`],

      [65, 'Exercise 5 — a menu program: quadratic equation and bank deposit',
        `<p class="y-chinh">🎯 The last slide of the deck: another menu — <em>1- Quadratic equation · 2- Bank deposit problem · 3- Quit</em>. Option 1 reads the coefficients of a quadratic equation and prints its solution if one exists; option 2 reads a deposit, a monthly rate (positive, at most 0.1) and a number of months, and prints the amount at the end.</p>
<ul>
<li><strong>The quadratic, done completely</strong> — <code>delta = b*b - 4*a*c</code>. If <code>delta &lt; 0</code> there is no real root; if <code>delta == 0</code> there is a double root <code>-b/(2a)</code>; if <code>delta &gt; 0</code> there are two roots <code>(-b ± sqrt(delta)) / (2a)</code>. <code>sqrt</code> comes from <code>math.h</code>, which is exactly the library this deck opened with.</li>
<li><strong>Do not forget <code>a == 0</code></strong> — the slide says "a quadratic equation", but if the user types <code>a = 0</code> the formula divides by zero. A complete answer handles the degenerate cases: <code>a = 0, b ≠ 0</code> is linear (<code>x = -c/b</code>), <code>a = b = 0, c = 0</code> has every x as a solution, and <code>a = b = 0, c ≠ 0</code> has none.</li>
<li><strong>The deposit formula</strong> — compound interest month by month: <code>amount = deposit × (1 + rate)^months</code>, which is <code>pow(1 + rate, months)</code> from <code>math.h</code>. The exercise's own limits — deposit positive, <code>0 &lt; rate ≤ 0.1</code>, months a positive integer — are the input validation from slides 50–53 of this same deck, so reject bad data instead of computing nonsense.</li>
<li><strong>Money is where formatted output pays off</strong> — print with <code>%.2lf</code> so you get exactly two decimals, and give the column a width so the numbers line up under one another: <code>printf("%-22s:%15.2lf\\n", label, value)</code>. This is Example 2 (slide 62) reused for something you would actually hand to a user.</li>
<li><strong>Precision, honestly</strong> — <code>%.2lf</code> rounds the display only. The stored <code>double</code> still carries its full binary value, so do not add up rounded strings; keep the <code>double</code>s, add them, and round once at the end. Serious money software uses integer cents for this reason.</li>
<li><strong>Link back with <code>-lm</code></strong> — on macOS and Linux a program that calls <code>sqrt</code> or <code>pow</code> may need <code>cc -Wall prog.c -lm</code>. Forgetting it produces an "undefined symbol" error at link time, not a compile error — a classic five-minute panic in the lab.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;math.h&gt;

void quadratic(void)
{
    double a, b, c, delta, x1, x2;
    printf("Enter a, b, c of a*x^2 + b*x + c = 0: ");
    if (scanf("%lf %lf %lf", &amp;a, &amp;b, &amp;c) != 3) { printf("Invalid input!\\n"); return; }
    if (a == 0) {
        if (b == 0) printf(c == 0 ? "Every x is a solution.\\n" : "No solution.\\n");
        else printf("Linear equation, x = %.4lf\\n", -c / b);
        return;
    }
    delta = b * b - 4 * a * c;
    if (delta &lt; 0)       printf("delta = %.4lf &lt; 0 -&gt; no real solution.\\n", delta);
    else if (delta == 0) printf("delta = 0 -&gt; double root x = %.4lf\\n", -b / (2 * a));
    else {
        x1 = (-b - sqrt(delta)) / (2 * a);
        x2 = (-b + sqrt(delta)) / (2 * a);
        printf("delta = %.4lf &gt; 0 -&gt; x1 = %.4lf, x2 = %.4lf\\n", delta, x1, x2);
    }
}

void deposit(void)
{
    double money, rate, amount;
    int months;
    printf("Enter deposit (&gt;0): ");             scanf("%lf", &amp;money);
    printf("Enter monthly rate (0 &lt; r &lt;= 0.1): "); scanf("%lf", &amp;rate);
    printf("Enter number of months (&gt;0): ");    scanf("%d", &amp;months);
    if (money &lt;= 0 || rate &lt;= 0 || rate &gt; 0.1 || months &lt;= 0) {
        printf("Invalid data!\\n");
        return;
    }
    amount = money * pow(1 + rate, months);
    printf("%-22s:%15.2lf\\n", "Deposit", money);
    printf("%-22s:%15.2lf\\n", "Interest", amount - money);
    printf("%-22s:%15.2lf\\n", "Amount after months", amount);
}

int main(void)
{
    int choice;
    do {
        printf("\\n1- Quadratic equation\\n2- Bank deposit problem\\n3- Quit\\nChoose an operation: ");
        if (scanf("%d", &amp;choice) != 1) break;
        switch (choice) {
            case 1: quadratic(); break;
            case 2: deposit();   break;
            case 3: printf("Bye!\\n"); break;
            default: printf("Invalid choice, try 1..3\\n");
        }
    } while (choice != 3);
    return 0;
}</code></pre>
<p class="dap-an">✅ Compiled with <code>cc -Wall -std=c99 ex5.c -lm</code> (no warnings) and run. Option 1 with <code>1 -3 2</code> printed <code>delta = 1.0000 &gt; 0 -&gt; x1 = 1.0000, x2 = 2.0000</code>; with <code>1 2 1</code> it printed <code>delta = 0 -&gt; double root x = -1.0000</code>; with <code>1 0 1</code> it printed <code>delta = -4.0000 &lt; 0 -&gt; no real solution.</code> — all three branches exercised. Option 2 with a deposit of 1 000 000, a rate of 0.01 per month and 12 months printed:<br><code>Deposit               :     1000000.00</code><br><code>Interest              :      126825.03</code><br><code>Amount after months   :     1126825.03</code><br>which is 1 000 000 × 1.01¹² rounded to two decimals. Note how <code>%-22s</code> lines up the three colons and <code>%15.2lf</code> lines up the three amounts — that alignment is the entire point of slides 59–62.</p>
<p class="pitfall">⚠️ <code>%.2lf</code> rounds the text, and binary floating point makes that rounding occasionally surprising: measured on this compiler, <code>printf("%.2f", 2.345)</code> gives <strong>2.35</strong> but <code>printf("%.2f", 2.355)</code> gives <strong>2.35</strong> as well, because 2.355 is stored as slightly <em>less</em> than 2.355. And <code>%.0f</code> of 2.5 gives <strong>2</strong> while <code>%.0f</code> of 3.5 gives <strong>4</strong> — ties round to even, not always up. Never write a marking scheme, or an accounting program, that assumes "round half up".</p>`,
        `<p class="y-chinh">🎯 Slide cuối cùng của bộ: lại một menu — <em>1- Quadratic equation · 2- Bank deposit problem · 3- Quit</em>. Lựa chọn 1 đọc các hệ số của một phương trình bậc hai rồi in nghiệm nếu có; lựa chọn 2 đọc số tiền gửi, lãi suất theo tháng (dương, tối đa 0,1) và số tháng, rồi in số tiền cuối kỳ.</p>
<ul>
<li><strong>Phương trình bậc hai, làm cho trọn</strong> — <code>delta = b*b - 4*a*c</code>. Nếu <code>delta &lt; 0</code> thì vô nghiệm thực; nếu <code>delta == 0</code> thì có nghiệm kép <code>-b/(2a)</code>; nếu <code>delta &gt; 0</code> thì có hai nghiệm <code>(-b ± sqrt(delta)) / (2a)</code>. Hàm <code>sqrt</code> lấy từ <code>math.h</code>, đúng cái thư viện mà bộ slide này mở đầu.</li>
<li><strong>Đừng quên trường hợp <code>a == 0</code></strong> — slide nói "phương trình bậc hai", nhưng nếu người dùng gõ <code>a = 0</code> thì công thức chia cho không. Một lời giải trọn vẹn phải xử lý các trường hợp suy biến: <code>a = 0, b ≠ 0</code> là phương trình bậc nhất (<code>x = -c/b</code>), <code>a = b = 0, c = 0</code> thì mọi x đều là nghiệm, còn <code>a = b = 0, c ≠ 0</code> thì vô nghiệm.</li>
<li><strong>Công thức tiền gửi</strong> — lãi kép theo từng tháng: <code>số tiền cuối = gốc × (1 + lãi)^số tháng</code>, tức là <code>pow(1 + rate, months)</code> của <code>math.h</code>. Chính các giới hạn mà đề nêu — gốc dương, <code>0 &lt; lãi ≤ 0,1</code>, số tháng nguyên dương — là phần kiểm tra dữ liệu nhập ở slide 50–53 của cùng bộ slide này, nên hãy từ chối dữ liệu xấu thay vì tính ra số vô nghĩa.</li>
<li><strong>Tiền bạc là chỗ xuất có định dạng phát huy tác dụng</strong> — in bằng <code>%.2lf</code> để được đúng hai số lẻ, và cho cột một độ rộng để các con số thẳng hàng nhau: <code>printf("%-22s:%15.2lf\\n", nhãn, giá_trị)</code>. Đây chính là Example 2 (slide 62) dùng lại cho một thứ bạn thật sự đưa cho người dùng xem.</li>
<li><strong>Nói thật về độ chính xác</strong> — <code>%.2lf</code> chỉ làm tròn phần hiển thị. Biến <code>double</code> vẫn giữ nguyên giá trị nhị phân đầy đủ, nên đừng cộng các chuỗi đã làm tròn; hãy giữ các <code>double</code>, cộng chúng lại, rồi mới làm tròn đúng một lần ở cuối. Phần mềm tài chính nghiêm túc dùng số nguyên đơn vị xu chính vì lý do này.</li>
<li><strong>Nhớ liên kết với <code>-lm</code></strong> — trên macOS và Linux, chương trình gọi <code>sqrt</code> hay <code>pow</code> có thể cần <code>cc -Wall prog.c -lm</code>. Quên nó thì gặp lỗi "undefined symbol" ở khâu liên kết chứ không phải lỗi biên dịch — một cơn hoảng loạn năm phút rất kinh điển trong phòng lab.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;math.h&gt;

void quadratic(void)
{
    double a, b, c, delta, x1, x2;
    printf("Enter a, b, c of a*x^2 + b*x + c = 0: ");
    if (scanf("%lf %lf %lf", &amp;a, &amp;b, &amp;c) != 3) { printf("Invalid input!\\n"); return; }
    if (a == 0) {
        if (b == 0) printf(c == 0 ? "Every x is a solution.\\n" : "No solution.\\n");
        else printf("Linear equation, x = %.4lf\\n", -c / b);
        return;
    }
    delta = b * b - 4 * a * c;
    if (delta &lt; 0)       printf("delta = %.4lf &lt; 0 -&gt; no real solution.\\n", delta);
    else if (delta == 0) printf("delta = 0 -&gt; double root x = %.4lf\\n", -b / (2 * a));
    else {
        x1 = (-b - sqrt(delta)) / (2 * a);
        x2 = (-b + sqrt(delta)) / (2 * a);
        printf("delta = %.4lf &gt; 0 -&gt; x1 = %.4lf, x2 = %.4lf\\n", delta, x1, x2);
    }
}

void deposit(void)
{
    double money, rate, amount;
    int months;
    printf("Enter deposit (&gt;0): ");                scanf("%lf", &amp;money);
    printf("Enter monthly rate (0 &lt; r &lt;= 0.1): "); scanf("%lf", &amp;rate);
    printf("Enter number of months (&gt;0): ");       scanf("%d", &amp;months);
    if (money &lt;= 0 || rate &lt;= 0 || rate &gt; 0.1 || months &lt;= 0) {
        printf("Invalid data!\\n");
        return;
    }
    amount = money * pow(1 + rate, months);
    printf("%-22s:%15.2lf\\n", "Deposit", money);
    printf("%-22s:%15.2lf\\n", "Interest", amount - money);
    printf("%-22s:%15.2lf\\n", "Amount after months", amount);
}

int main(void)
{
    int choice;
    do {
        printf("\\n1- Quadratic equation\\n2- Bank deposit problem\\n3- Quit\\nChoose an operation: ");
        if (scanf("%d", &amp;choice) != 1) break;
        switch (choice) {
            case 1: quadratic(); break;
            case 2: deposit();   break;
            case 3: printf("Bye!\\n"); break;
            default: printf("Invalid choice, try 1..3\\n");
        }
    } while (choice != 3);
    return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch bằng <code>cc -Wall -std=c99 ex5.c -lm</code> (không cảnh báo nào) và chạy. Lựa chọn 1 với <code>1 -3 2</code> in ra <code>delta = 1.0000 &gt; 0 -&gt; x1 = 1.0000, x2 = 2.0000</code>; với <code>1 2 1</code> in ra <code>delta = 0 -&gt; double root x = -1.0000</code>; với <code>1 0 1</code> in ra <code>delta = -4.0000 &lt; 0 -&gt; no real solution.</code> — cả ba nhánh đều được chạy qua. Lựa chọn 2 với số tiền gửi 1.000.000, lãi 0,01 mỗi tháng và 12 tháng in ra:<br><code>Deposit               :     1000000.00</code><br><code>Interest              :      126825.03</code><br><code>Amount after months   :     1126825.03</code><br>đúng bằng 1.000.000 × 1,01¹² làm tròn hai số lẻ. Để ý <code>%-22s</code> làm ba dấu hai chấm thẳng hàng và <code>%15.2lf</code> làm ba con số thẳng hàng — sự canh cột đó chính là toàn bộ mục đích của slide 59–62.</p>
<p class="pitfall">⚠️ <code>%.2lf</code> làm tròn phần chữ, và số thực nhị phân làm phép làm tròn ấy đôi khi gây bất ngờ: đo trên trình biên dịch này, <code>printf("%.2f", 2.345)</code> cho <strong>2.35</strong> nhưng <code>printf("%.2f", 2.355)</code> cũng cho <strong>2.35</strong>, vì 2,355 được lưu thành một số hơi <em>nhỏ hơn</em> 2,355. Và <code>%.0f</code> của 2,5 cho <strong>2</strong> trong khi <code>%.0f</code> của 3,5 cho <strong>4</strong> — hoà thì làm tròn về số chẵn, không phải lúc nào cũng làm tròn lên. Đừng bao giờ viết một biểu điểm chấm bài, hay một chương trình kế toán, dựa trên giả định "cứ 5 là làm tròn lên".</p>`],

    ]),
  ].join('\n'),
};
