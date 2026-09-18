/**
 * PRF192 · Slot 11-12 (deck 'prf6', 65 slide) — phần slide 31→54, học theo từng slide.
 * Chương 7b: Nhập dữ liệu và kiểm tra hợp lệ — buffered input, getchar(), scanf(...), input validation.
 *
 * Nội dung bám ĐÚNG chữ trích từ .pptx gốc của trường (/tmp/prf192-text/prf6.txt); những slide
 * chỉ có mã nguồn trong ẢNH (37, 38, 39, 44, 45, 46, 47, 49, 51, 52) đã đọc thẳng ảnh đã render.
 *
 * MỌI con số trong các bảng và phần Đáp án đều ĐO THẬT bằng Apple clang, cc -Wall -std=c99:
 *   s37  scanf("%c",&c1) rồi c2=getchar(), gõ "A⏎a⏎"  -> c1='A'(65), c2='\n'(10)   [đúng như slide]
 *   s35  getchar() với 'A' -> 65 ; với EOF -> -1
 *   s38  fflush(stdin) TRÊN macOS/clang KHÔNG dọn được: c2 vẫn = 10  (slide chạy Dev-C++/Windows)
 *   s39  clear(){while(getchar()!='\n');} -> c2='a'(97)  ·  scanf(" %c") cũng cho 97
 *   Ex2  "PRF192 lab #3, ok!" -> 4 / 8 / 6   ·  "Hello World 2026" -> 4 / 10 / 2  ·  ""(⏎) -> 0/0/0
 *   Ex2  gợi ý slide viết "c=getchar() != '\n'" -> ĐO ĐƯỢC c=1 mọi vòng (lỗi thứ tự ưu tiên)
 *   Ex2  vào EOF không có '\n' -> lặp VÔ HẠN (phải kill -9)
 *   s44  long x; scanf("%lf") gõ 5.3 -> x=4617653287933653811 (=0x4015333333333333); slide 32-bit: 858993459 (=0x33333333, đúng nửa thấp)
 *   s44  double x; scanf("%ld") gõ 5.3 -> x=0.000000   [đúng như slide]
 *   s45  "%d%d" với "8 6" / "8⏎6" / "8<TAB>6" / "   8     6  " -> đều x=8, y=6
 *   s46  "%d,%d&%d": "10,20&30"->3 (10,20,30) · "10,20 ,30"->2 · "10 , 20 & 30"->1 · "10;20&30"->1
 *   s47  "%d%c" "70D"->D(68) · "70⏎"->'\n'(10) · "70 D"->' '(32)
 *   s47  "%d%*c%c" "70 D"/"70⏎D"/"70PD" -> đều D(68), trả về 2   ·  "%d%*c"+getchar() -> trả về 1, c='D'
 *   s49  "%d%d%lf": EOF->-1 · "asjklfghjk"->0 · "12dfghjkl;"->1 · "12 789 asd"->2 · "12 789 12.7803"->3
 *   s52  getInt(5,10) với "test7 / 7.5 / 20 / 8" -> No input accepted! / Trailing characters! / Out of range! / n=8
 *   s52  LỖ HỔNG đo được: gặp EOF thì count=-1 rơi vào nhánh 'Trailing', clear() quay VÔ HẠN (treo)
 *   Ex3  getDouble(1.5,9.75) với "abc / 3.5x / 12.0 / 0.5 / 7.25" -> 4 lần từ chối rồi d=7.2500
 *   %llf (slide 43) -> clang cảnh báo "undefined behavior", đọc xong ld vẫn = 0.0000; %Lf mới đúng (2.5000)
 *   scanf("%f", &double) -> cảnh báo -Wformat, biến double giữ nguyên rác (đo: -1.000000)
 * Chỗ slide gốc sai/thiếu đã nêu thẳng trong phần Đáp án (slide 38, 40, 43, 44, 52), không im lặng chép lại.
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'prf6';

export default {
  title: '7.0b — Slide by slide: Buffered input, getchar, scanf and input validation (slides 31–54)|||7.0b — Slide bài giảng: Bộ đệm nhập, getchar, scanf & kiểm tra dữ liệu vào (slide 31–54)',
  slug: 'prf192-7-0b-slides-nhap-lieu-kiem-tra',
  type: 'DOCUMENT',
  description: 'Nửa sau bộ slide Slot 11-12 của PRF192 (slide 31–54): dữ liệu từ bàn phím đi qua bộ đệm như thế nào, getchar() và bài toán ENTER còn sót, hai giải pháp dọn bộ đệm, scanf(...) từ conversion specifier đến dấu tách tự đặt, %*c và số trường đọc được, rồi bốn loại lỗi nhập liệu cùng hàm kiểm tra hợp lệ hoàn chỉnh. Exercise 2 và Exercise 3 được giải trọn vẹn; mọi giá trị trong bảng đều đo bằng cách biên dịch và chạy thật, kể cả những chỗ slide gốc ghi sai.',
  content: [
    walkHead(D, 31, 54),
    walk(D, [

      [31, 'Input and Validation (section divider)',
        `<p class="y-chinh">🎯 A one-word divider that opens the second half of Slot 11-12. The deck stops listing library functions and starts on the one thing that sinks more beginner programs than any algorithm: reading what the user actually typed.</p>
<ul>
<li><strong>Where this sits in the deck</strong> — slides 1–30 were the libraries themselves (<code>stdlib.h</code>, <code>math.h</code>, <code>time.h</code>, <code>ctype.h</code>) and closed with Exercise 1 plus a Summary. Slides 31–54 are a new, self-contained topic. Slides 55–65 are a third one, Formatted Output.</li>
<li><strong>Two functions, one idea</strong> — everything here is <code>getchar()</code> and <code>scanf(...)</code> from <code>&lt;stdio.h&gt;</code>, plus the <em>keyboard buffer</em> that sits between the user's fingers and your variables. Understand the buffer and both functions become obvious.</li>
<li><strong>Why "and Validation" is in the title</strong> — reading is easy; reading <em>safely</em> is not. The deck spends four slides on how to read and five on how to refuse bad input, because that is the ratio in real programs too.</li>
<li><strong>What you must already own</strong> — <code>if/else</code> and <code>do...while</code> (Slot 05-07), functions and prototypes (Slot 08-09), the <code>&amp;</code> address operator (Slot 10) and <code>ctype.h</code> from the first half of <em>this very deck</em>. All five appear together in the validation function on slide 52.</li>
<li><strong>Exam weight</strong> — every PRF192 practical exam question reads data from the keyboard. A program that mis-reads its input scores zero however elegant the algorithm is, so this block is worth more marks per slide than almost anything else in the course.</li>
</ul>
<p class="meo">💡 Keep one sentence in mind for the next twenty-three slides: <em>the keyboard does not talk to your variables — it talks to a buffer, and your input function then talks to the buffer</em>. Almost every bug in this chapter is a character left behind in that buffer.</p>`,
        `<p class="y-chinh">🎯 Slide phân mục một chữ, mở ra nửa sau của Slot 11-12. Bộ slide ngừng liệt kê hàm thư viện và bước vào thứ làm chết nhiều chương trình của người mới hơn bất kỳ thuật toán nào: đọc cho đúng thứ người dùng vừa gõ.</p>
<ul>
<li><strong>Vị trí trong bộ slide</strong> — slide 1–30 là các thư viện (<code>stdlib.h</code>, <code>math.h</code>, <code>time.h</code>, <code>ctype.h</code>), kết bằng Exercise 1 và một slide Summary. Slide 31–54 là một chủ đề mới, trọn vẹn. Slide 55–65 lại là chủ đề thứ ba: Formatted Output (in ra có định dạng).</li>
<li><strong>Hai hàm, một ý tưởng</strong> — tất cả ở đây xoay quanh <code>getchar()</code> và <code>scanf(...)</code> trong <code>&lt;stdio.h&gt;</code>, cộng với cái <em>bộ đệm bàn phím</em> nằm giữa ngón tay người dùng và biến của bạn. Hiểu bộ đệm là hai hàm kia trở nên hiển nhiên.</li>
<li><strong>Vì sao có chữ "and Validation"</strong> — đọc thì dễ, đọc <em>an toàn</em> mới khó. Bộ slide dành bốn slide cho cách đọc và năm slide cho cách từ chối dữ liệu sai — đúng tỉ lệ của chương trình thật.</li>
<li><strong>Bạn phải nắm sẵn những gì</strong> — <code>if/else</code> và <code>do...while</code> (Slot 05-07), hàm và nguyên mẫu (Slot 08-09), toán tử lấy địa chỉ <code>&amp;</code> (Slot 10) và <code>ctype.h</code> ở ngay nửa đầu <em>bộ slide này</em>. Cả năm thứ đó gặp nhau trong hàm kiểm tra hợp lệ ở slide 52.</li>
<li><strong>Trọng số trong đề thi</strong> — mọi đề thực hành PRF192 đều đọc dữ liệu từ bàn phím. Chương trình đọc sai đầu vào thì được 0 điểm dù thuật toán có hay đến đâu, nên khối này "đắt" điểm hơn gần như mọi phần khác của môn.</li>
</ul>
<p class="meo">💡 Giữ đúng một câu trong đầu suốt 23 slide tới: <em>bàn phím KHÔNG nói chuyện với biến của bạn — nó nói với một bộ đệm, rồi hàm nhập mới nói chuyện với bộ đệm đó</em>. Gần như mọi lỗi của chương này đều là một ký tự bị bỏ quên trong bộ đệm ấy.</p>`],

      [32, 'Contents',
        `<p class="y-chinh">🎯 The map of the block, in four items: <strong>Types of Input</strong> → <strong>Input a character: getchar()</strong> → <strong>Input data: scanf(…)</strong> → <strong>Input Validation</strong>. They are in dependency order, not in order of difficulty.</p>
<ul>
<li><strong>Item 1 — Types of Input (slides 33–34)</strong> — buffered versus unbuffered, what a buffer is, what a stream is. Two slides of vocabulary that make the next twenty make sense.</li>
<li><strong>Item 2 — getchar() (slides 35–40)</strong> — one function, six slides, because five of them are about the mess it leaves behind: clearing the buffer, the classic "second character is skipped" problem, two solutions, then Exercise 2.</li>
<li><strong>Item 3 — scanf(…) (slides 41–49)</strong> — the biggest item: syntax, conversion specifiers, what counts as a separator, how to define your own, <code>%*c</code>, and the return value. Nine slides.</li>
<li><strong>Item 4 — Input Validation (slides 50–53)</strong> — the payoff. Everything above is combined into one reusable function that refuses invalid characters, trailing characters and out-of-range values, then you write the same thing yourself for <code>double</code> in Exercise 3.</li>
<li><strong>Read it as a single build-up</strong> — item 4 literally cannot be written without items 1–3: it needs the buffer model, the <code>clear()</code> helper from item 2, and the return value from item 3. Skipping ahead to slide 52 and copying the code is exactly how students end up unable to debug it.</li>
</ul>
<p class="meo">💡 If you only have ten minutes before an exam, read slides 48–49 (what <code>scanf</code> returns) and slide 52 (the validation loop). Those two ideas answer most of the "why does my program behave strangely" questions in this course.</p>`,
        `<p class="y-chinh">🎯 Bản đồ của cả khối, gồm bốn mục: <strong>Types of Input</strong> → <strong>Input a character: getchar()</strong> → <strong>Input data: scanf(…)</strong> → <strong>Input Validation</strong>. Chúng xếp theo thứ tự phụ thuộc, không phải theo độ khó.</p>
<ul>
<li><strong>Mục 1 — Types of Input (slide 33–34)</strong> — có đệm và không có đệm, bộ đệm là gì, dòng (stream) là gì. Hai slide từ vựng, nhưng nhờ chúng mà hai chục slide sau mới có nghĩa.</li>
<li><strong>Mục 2 — getchar() (slide 35–40)</strong> — một hàm mà chiếm sáu slide, vì năm trong số đó nói về đống lộn xộn nó để lại: dọn bộ đệm, bài toán kinh điển "ký tự thứ hai bị bỏ qua", hai giải pháp, rồi Exercise 2.</li>
<li><strong>Mục 3 — scanf(…) (slide 41–49)</strong> — mục lớn nhất: cú pháp, conversion specifier, cái gì được tính là dấu tách, cách tự đặt dấu tách, <code>%*c</code>, và giá trị trả về. Chín slide.</li>
<li><strong>Mục 4 — Input Validation (slide 50–53)</strong> — phần thu hoạch. Tất cả những thứ trên gộp lại thành MỘT hàm dùng lại được, biết từ chối ký tự sai, ký tự thừa phía sau và giá trị ngoài khoảng; rồi bạn tự viết đúng như thế cho <code>double</code> ở Exercise 3.</li>
<li><strong>Hãy đọc như một mạch xây dần</strong> — mục 4 không thể viết nổi nếu thiếu mục 1–3: nó cần mô hình bộ đệm, cần hàm <code>clear()</code> của mục 2, và cần giá trị trả về của mục 3. Nhảy thẳng tới slide 52 chép code chính là cách sinh viên tự làm mình không debug nổi.</li>
</ul>
<p class="meo">💡 Nếu chỉ còn mười phút trước giờ thi: đọc slide 48–49 (<code>scanf</code> trả về cái gì) và slide 52 (vòng lặp kiểm tra hợp lệ). Hai ý đó trả lời phần lớn câu "sao chương trình em chạy kỳ kỳ" của cả môn.</p>`],

      [33, '1 - Types of Input',
        `<p class="y-chinh">🎯 Two pictures stacked on one slide. <strong>Unbuffered:</strong> User → Device → <code>var</code> in the Program. <strong>Buffered:</strong> User → Device → <em>Device buffer</em> → <code>var</code> in the Program. One extra box changes everything.</p>
<ul>
<li><strong>Unbuffered input</strong> — "Interactive program (event-based program) uses unbuffered input. The program can respond to each and every keystroke directly." Think of a game where holding an arrow key moves the sprite immediately; nothing waits for ENTER.</li>
<li><strong>Buffer, as the slide defines it</strong> — "A memory region is associated with a hardware such as keyboard, monitor, hard disk, … It holds data temporarily." It belongs to the <em>device</em>, not to your variable, which is why data can sit in it after your <code>scanf</code> is finished.</li>
<li><strong>Buffered input</strong> — "enables data editing before submission to a program. That means that input data can be treated as units and they can be pre-processed before they are passed to the program." That is exactly why Backspace works while you type: you are editing the buffer, and the program has not seen anything yet.</li>
<li><strong>The last bullet is the operative one</strong> — "Input functions will access device buffer to get data." Your <code>scanf</code>/<code>getchar</code> never touches the keyboard. It reads the buffer. Everything the keyboard put there and nobody consumed is still waiting for the <em>next</em> read.</li>
<li><strong>Standard C is buffered</strong> — plain C with <code>&lt;stdio.h&gt;</code> gives you only buffered input. Unbuffered keystrokes need non-standard extras (<code>conio.h</code>'s <code>getch()</code> on Windows, <code>termios</code> on Unix) which are outside this course and outside the exam.</li>
</ul>
<p class="pitfall">⚠️ The mental model most beginners carry — "<code>scanf</code> waits for me to type, then takes what I typed" — is wrong in a way that costs hours. The truth is: <code>scanf</code> waits only <em>if the buffer is empty</em>. If a previous read left characters behind, it takes those and returns instantly without ever pausing. That is the whole of slides 36–39 in one sentence.</p>`,
        `<p class="y-chinh">🎯 Hai bức tranh xếp chồng trên một slide. <strong>Không đệm:</strong> User → Device → <code>var</code> trong Program. <strong>Có đệm:</strong> User → Device → <em>Device buffer</em> → <code>var</code> trong Program. Thêm đúng một cái hộp mà đổi cả cách suy nghĩ.</p>
<ul>
<li><strong>Nhập không đệm (unbuffered)</strong> — "chương trình tương tác (hướng sự kiện) dùng unbuffered input; chương trình đáp lại từng cú gõ phím một cách trực tiếp". Hình dung một game: giữ phím mũi tên là nhân vật chạy ngay, chẳng chờ ENTER nào cả.</li>
<li><strong>Bộ đệm, theo đúng định nghĩa của slide</strong> — "một vùng nhớ gắn với một thiết bị phần cứng như bàn phím, màn hình, đĩa cứng… Nó giữ dữ liệu tạm thời". Nó thuộc về <em>thiết bị</em>, không thuộc về biến của bạn — đó là lý do dữ liệu vẫn có thể nằm lại đó sau khi <code>scanf</code> đã xong việc.</li>
<li><strong>Nhập có đệm (buffered)</strong> — "cho phép sửa dữ liệu trước khi nộp cho chương trình; nghĩa là dữ liệu vào được coi như từng đơn vị và có thể tiền xử lý trước khi truyền vào chương trình". Chính vì thế phím Backspace mới dùng được lúc bạn đang gõ: bạn đang sửa bộ đệm, còn chương trình thì chưa nhìn thấy gì cả.</li>
<li><strong>Gạch đầu dòng cuối mới là gạch quan trọng</strong> — "các hàm nhập sẽ truy cập bộ đệm thiết bị để lấy dữ liệu". <code>scanf</code>/<code>getchar</code> của bạn KHÔNG bao giờ chạm vào bàn phím. Nó đọc bộ đệm. Mọi thứ bàn phím đã đẩy vào đó mà chưa ai lấy ra thì vẫn còn nằm chờ lần đọc <em>tiếp theo</em>.</li>
<li><strong>C chuẩn chỉ có nhập có đệm</strong> — C thuần với <code>&lt;stdio.h&gt;</code> chỉ cho bạn buffered input. Muốn bắt từng phím phải dùng thứ ngoài chuẩn (<code>getch()</code> của <code>conio.h</code> trên Windows, <code>termios</code> trên Unix) — nằm ngoài môn này và ngoài đề thi.</li>
</ul>
<p class="pitfall">⚠️ Mô hình trong đầu phần lớn người mới — "<code>scanf</code> chờ mình gõ rồi lấy đúng thứ mình vừa gõ" — sai theo kiểu tốn hàng giờ đồng hồ. Sự thật là: <code>scanf</code> chỉ chờ <em>khi bộ đệm rỗng</em>. Nếu lần đọc trước còn bỏ lại ký tự, nó lấy luôn mấy ký tự đó và trả về tức khắc, không dừng lại một nhịp nào. Đó là toàn bộ slide 36–39 gói trong một câu.</p>`],

      [34, 'Buffered Input',
        `<p class="y-chinh">🎯 Three facts that define how C reads the keyboard: you must press <code>'\\n'</code> to hand the buffer over, the buffer is viewed as a <strong>stream</strong> of characters, and <code>&lt;stdio.h&gt;</code> offers exactly two ways in — <code>getchar()</code> and <code>scanf(…)</code>.</p>
<ul>
<li><strong>"To transfer the contents of a buffer to a program the user must press the <code>'\\n'</code> character"</strong> — nothing you type reaches your variables until ENTER. This is why a program can look frozen while you type: it <em>is</em> blocked, waiting for a newline, not for characters.</li>
<li><strong>ENTER is itself data</strong> — the newline is not a magic signal that evaporates. It is pushed into the buffer like every other key, code 10. Forgetting that one character is the direct cause of the problem on slide 37 and of most "my program skipped an input" bug reports.</li>
<li><strong>Stream</strong> — "a concept allows generalizing access data in a buffer as a chain of characters". The buffer is a queue: first in, first out, no going back. You cannot peek at position 5 without consuming 0–4, and you cannot un-read a character you have taken.</li>
<li><strong>Two functions, two granularities</strong> — <code>getchar()</code> takes exactly one character and does no conversion at all; <code>scanf(…)</code> takes as many items as the format string asks for and converts text into <code>int</code>, <code>double</code>, and so on. Same stream, two different windows onto it.</li>
<li><strong>They share the stream</strong> — mixing them is legal and common (slide 47's last example does exactly that), but whatever one leaves behind, the other will find. The two functions are not independent; there is only one queue.</li>
</ul>
<pre><code>/* Ba lần đọc, MỘT dòng người dùng gõ: "AB\\n" */
char a = getchar();   /* 'A'  — lấy khỏi hàng đợi */
char b = getchar();   /* 'B'  — lấy tiếp          */
char c = getchar();   /* '\\n' — CÒN LẠI là nó     */</code></pre>
<p class="meo">💡 Draw the buffer as a row of boxes on scratch paper and cross off a box for every character a function consumes. Every bug in slides 36–39, 47 and 52 becomes visible the moment you do this — and it takes ten seconds. Examiners' favourite trick questions are all "which boxes are still uncrossed?".</p>`,
        `<p class="y-chinh">🎯 Ba sự thật định nghĩa cách C đọc bàn phím: phải gõ <code>'\\n'</code> thì bộ đệm mới được trao cho chương trình, bộ đệm được nhìn như một <strong>dòng (stream)</strong> ký tự, và <code>&lt;stdio.h&gt;</code> cho đúng hai cửa vào — <code>getchar()</code> và <code>scanf(…)</code>.</p>
<ul>
<li><strong>"Muốn chuyển nội dung bộ đệm cho chương trình thì người dùng phải nhấn ký tự <code>'\\n'</code>"</strong> — không gì bạn gõ tới được biến trước khi có ENTER. Vì thế chương trình trông như treo trong lúc bạn đang gõ: nó <em>đang</em> bị chặn, chờ một dấu xuống dòng, chứ không phải chờ ký tự.</li>
<li><strong>ENTER bản thân nó cũng là DỮ LIỆU</strong> — dấu xuống dòng không phải tín hiệu thần kỳ rồi tan biến. Nó bị đẩy vào bộ đệm y hệt mọi phím khác, mã 10. Quên đúng một ký tự đó chính là nguyên nhân trực tiếp của bài toán ở slide 37 và của hầu hết lời than "chương trình em bỏ qua một lần nhập".</li>
<li><strong>Stream (dòng)</strong> — "một khái niệm cho phép tổng quát hoá việc truy cập dữ liệu trong bộ đệm như một chuỗi ký tự". Bộ đệm là một hàng đợi: vào trước ra trước, không quay lui. Không thể nhìn trộm ô thứ 5 mà chưa tiêu thụ ô 0–4, và không thể "trả lại" ký tự đã lấy.</li>
<li><strong>Hai hàm, hai cỡ hạt</strong> — <code>getchar()</code> lấy đúng một ký tự và không chuyển đổi gì cả; <code>scanf(…)</code> lấy bao nhiêu mục là do chuỗi định dạng đòi, và biến chữ thành <code>int</code>, <code>double</code>… Cùng một dòng, hai khung cửa khác nhau nhìn vào.</li>
<li><strong>Chúng dùng CHUNG một dòng</strong> — trộn hai hàm là hợp lệ và rất hay gặp (ví dụ cuối của slide 47 làm đúng thế), nhưng thứ hàm này bỏ lại thì hàm kia sẽ nhặt được. Hai hàm không độc lập; chỉ có MỘT hàng đợi.</li>
</ul>
<pre><code>/* Ba lần đọc, MỘT dòng người dùng gõ: "AB\\n" */
char a = getchar();   /* 'A'  — lấy khỏi hàng đợi */
char b = getchar();   /* 'B'  — lấy tiếp          */
char c = getchar();   /* '\\n' — CÒN LẠI là nó     */</code></pre>
<p class="meo">💡 Hãy vẽ bộ đệm thành một dãy ô vuông ra giấy nháp, và gạch bỏ một ô mỗi khi một hàm tiêu thụ một ký tự. Mọi lỗi ở slide 36–39, 47 và 52 hiện ra ngay khi bạn làm vậy — mà chỉ mất mười giây. Câu bẫy ruột của giám khảo đều quy về "ô nào còn chưa bị gạch?".</p>`],

      [35, '2 - The getchar() function',
        `<p class="y-chinh">🎯 One function, one line of syntax: <code>int getchar(void);</code> — "retrieves a single character from the standard input stream buffer <strong>without translating the input</strong>", and returns either the character code or <code>EOF</code>.</p>
<ul>
<li><strong>"Without translating"</strong> — no conversion happens. Type <code>7</code> and <code>getchar()</code> hands you <strong>55</strong>, the ASCII code of the digit, not the number seven. Converting text into numbers is <code>scanf</code>'s job, from slide 41 onward.</li>
<li><strong>Why the return type is <code>int</code>, not <code>char</code></strong> — it must be able to return every one of the 256 possible character codes <em>and</em> a distinct <code>EOF</code> value that is none of them. <code>EOF</code> is <code>-1</code>; a <code>char</code> cannot hold 256 values plus a 257th sentinel.</li>
<li><strong>EOF, as the slide gives it</strong> — "(EOF = -1, ctrl+z in Windows, ctrl+d in Unix)". It means "there is no more input, ever", not "the user typed nothing". Pressing ENTER on an empty line does <em>not</em> give EOF — it gives character 10.</li>
<li><strong>The slide's program, and its instruction</strong> — "Copy, paste, compile and run the program with input: Ctrl + Z". The screenshot shows <code>Code inputted:-1</code>. That <code>-1</code> is the whole point of the exercise: it proves <code>getchar</code> has a second kind of answer.</li>
<li><strong>Getting one character is rarely the goal</strong> — you use <code>getchar()</code> in loops (count characters, as in Exercise 2) or as a broom (clear the buffer, slide 36). Both uses show up again before this block ends.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
int main()
{
    char c;
    printf("Input a character:");
    c = getchar();
    printf("Code inputted:%d\\n", c);
    return 0;
}</code></pre>
<p class="dap-an">✅ Compiled with <code>cc -Wall -std=c99</code> and run. Input <code>A</code> → <code>Code inputted:65</code>. Input closed immediately (Ctrl+D on this machine, Ctrl+Z on Windows) → <code>Code inputted:-1</code>, exactly the screenshot on the slide. Rewriting the variable as <code>int c</code> gives the same two answers here, 65 and -1.</p>
<p class="pitfall">⚠️ The slide's own program declares <code>char c</code>, and that is a latent bug even though it printed -1 here. On a platform where <code>char</code> is <em>unsigned</em> (ARM Linux, for one), <code>EOF</code> stored into a <code>char</code> becomes 255 and the test <code>c != EOF</code> is never true — an infinite loop. Always write <code>int c = getchar();</code> in your own code and compare <em>then</em>.</p>`,
        `<p class="y-chinh">🎯 Một hàm, một dòng cú pháp: <code>int getchar(void);</code> — "lấy một ký tự đơn từ bộ đệm dòng nhập chuẩn <strong>mà không dịch chuyển gì</strong>", và trả về hoặc mã ký tự, hoặc <code>EOF</code>.</p>
<ul>
<li><strong>"Không dịch chuyển" nghĩa là gì</strong> — không có phép chuyển đổi nào xảy ra. Gõ <code>7</code> thì <code>getchar()</code> đưa bạn <strong>55</strong>, mã ASCII của chữ số, chứ không phải số bảy. Chuyển chữ thành số là việc của <code>scanf</code>, từ slide 41 trở đi.</li>
<li><strong>Vì sao kiểu trả về là <code>int</code> chứ không phải <code>char</code></strong> — nó phải trả được cả 256 mã ký tự <em>và</em> một giá trị <code>EOF</code> riêng biệt không trùng cái nào. <code>EOF</code> là <code>-1</code>; một <code>char</code> không chứa nổi 256 giá trị cộng thêm một giá trị canh thứ 257.</li>
<li><strong>EOF, đúng như slide ghi</strong> — "(EOF = -1, ctrl+z trên Windows, ctrl+d trên Unix)". Nó nghĩa là "hết dữ liệu vào, vĩnh viễn", chứ KHÔNG phải "người dùng không gõ gì". Nhấn ENTER trên dòng trống <em>không</em> cho EOF — nó cho ký tự mã 10.</li>
<li><strong>Chương trình trên slide và lời dặn kèm theo</strong> — "chép, dán, biên dịch và chạy chương trình với dữ liệu vào: Ctrl + Z". Ảnh chụp cho thấy <code>Code inputted:-1</code>. Con <code>-1</code> đó chính là toàn bộ mục đích của bài tập: nó chứng minh <code>getchar</code> có một loại câu trả lời thứ hai.</li>
<li><strong>Lấy một ký tự hiếm khi là mục tiêu</strong> — bạn dùng <code>getchar()</code> trong vòng lặp (đếm ký tự, như Exercise 2) hoặc như một cái chổi (quét sạch bộ đệm, slide 36). Cả hai cách dùng đều trở lại trước khi khối này kết thúc.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
int main()
{
    char c;
    printf("Input a character:");
    c = getchar();
    printf("Code inputted:%d\\n", c);
    return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch bằng <code>cc -Wall -std=c99</code> và chạy thật. Gõ <code>A</code> → <code>Code inputted:65</code>. Đóng dòng nhập ngay lập tức (Ctrl+D trên máy này, Ctrl+Z trên Windows) → <code>Code inputted:-1</code>, đúng y ảnh chụp trên slide. Viết lại biến thành <code>int c</code> thì ở đây vẫn ra hai kết quả đó, 65 và -1.</p>
<p class="pitfall">⚠️ Chính chương trình của slide khai <code>char c</code>, và đó là một quả bom hẹn giờ dù ở đây nó in ra -1. Trên nền tảng mà <code>char</code> là <em>không dấu</em> (ARM Linux chẳng hạn), <code>EOF</code> nhét vào <code>char</code> thành 255 và phép so <code>c != EOF</code> không bao giờ đúng — lặp vô hạn. Trong code của bạn hãy luôn viết <code>int c = getchar();</code> rồi hãy so sánh.</p>`],

      [36, 'getchar(): Clearing the Buffer',
        `<p class="y-chinh">🎯 The slide asks the question the whole chapter turns on — "some characters are remained in the keyboard buffer. <strong>How to remove them?</strong>" — and answers it with a four-line function you will reuse on slides 39, 51 and 52.</p>
<ul>
<li><strong>The symptom, in the slide's words</strong> — "in some cases, you may not get successfully data for a variable because some characters are remained in the keyboard buffer". You did not lose the data; a previous read left rubbish in front of it and your new read swallowed the rubbish.</li>
<li><strong>The standard answer</strong> — a user-defined <code>clear()</code> that keeps calling <code>getchar()</code> until it has eaten the newline. Nothing is stored anywhere: the return value is thrown away on purpose. This is a <em>broom</em>, not a reader.</li>
<li><strong>Why it stops at <code>'\\n'</code>, not at "buffer empty"</strong> — there is no portable way to ask "is the buffer empty?" in C. But you know the user finished the line with ENTER, so consuming up to and including the newline means consuming exactly what is left of that line. The newline is the fence post.</li>
<li><strong>The non-standard answer, and the warning that follows it</strong> — "In some tools, the function <code>fflush(stdin)</code> is implemented for this purpose (in stdio.h)". Note "in some tools": slide 38 will put a yellow warning under it, and the measurement below shows it flatly does not work here.</li>
<li><strong>The rule of thumb from the last bullet</strong> — "make clear the keyboard buffer <em>before</em> the operation of accepting a character (or a string)". Clear before a <code>%c</code> read or a string read, not before a <code>%d</code> read — <code>%d</code> skips whitespace on its own (slide 45).</li>
</ul>
<pre><code>/* clear empties input buffer */
void clear (void) {
    while ( getchar() != '\\n' );
}</code></pre>
<p class="dap-an">✅ The slide's version works for ordinary typing but hangs at end of input: <code>getchar()</code> then returns <code>EOF</code> for ever, which is never <code>'\\n'</code>. Measured: a program using this exact <code>clear()</code> spun until it had to be killed with <code>kill -9</code>. The safe version, used everywhere below, adds one test: <code>int ch; while ((ch = getchar()) != '\\n' &amp;&amp; ch != EOF);</code></p>
<p class="pitfall">⚠️ Do not call <code>clear()</code> "just in case" when the buffer is already empty — it will sit there and wait for the user to press ENTER, and your program looks frozen for no reason. Clear <em>after</em> a read that you know left something behind, not before a read at random.</p>`,
        `<p class="y-chinh">🎯 Slide đặt đúng câu hỏi mà cả chương xoay quanh — "một số ký tự còn sót lại trong bộ đệm bàn phím. <strong>Làm sao bỏ chúng đi?</strong>" — rồi trả lời bằng một hàm bốn dòng mà bạn sẽ dùng lại ở slide 39, 51 và 52.</p>
<ul>
<li><strong>Triệu chứng, đúng lời slide</strong> — "trong vài trường hợp, bạn không lấy được dữ liệu cho một biến vì còn ký tự sót trong bộ đệm bàn phím". Bạn không mất dữ liệu; lần đọc trước bỏ lại rác nằm chắn phía trước, và lần đọc mới của bạn nuốt phải đống rác đó.</li>
<li><strong>Câu trả lời chuẩn</strong> — một hàm <code>clear()</code> tự viết, cứ gọi <code>getchar()</code> mãi cho tới khi nuốt xong dấu xuống dòng. Không cất gì vào đâu cả: giá trị trả về bị vứt đi có chủ ý. Đây là một cái <em>chổi</em>, không phải hàm đọc.</li>
<li><strong>Vì sao dừng ở <code>'\\n'</code> chứ không dừng ở "bộ đệm rỗng"</strong> — C không có cách khả chuyển nào để hỏi "bộ đệm rỗng chưa?". Nhưng bạn biết người dùng kết thúc dòng bằng ENTER, nên ăn tới và gồm cả dấu xuống dòng là ăn đúng phần còn lại của dòng đó. Dấu xuống dòng là cái cọc mốc.</li>
<li><strong>Câu trả lời ngoài chuẩn, và lời cảnh báo đi kèm</strong> — "ở một số công cụ, hàm <code>fflush(stdin)</code> được cài đặt cho mục đích này (trong stdio.h)". Để ý chữ "một số công cụ": slide 38 sẽ dán một dòng cảnh báo nền vàng dưới nó, còn phép đo bên dưới cho thấy ở đây nó thẳng thừng không chạy.</li>
<li><strong>Quy tắc bỏ túi ở gạch đầu dòng cuối</strong> — "hãy dọn bộ đệm bàn phím <em>trước</em> thao tác nhận một ký tự (hoặc một chuỗi)". Dọn trước lần đọc <code>%c</code> hay đọc chuỗi, chứ đừng dọn trước lần đọc <code>%d</code> — <code>%d</code> tự bỏ qua khoảng trắng (slide 45).</li>
</ul>
<pre><code>/* clear empties input buffer */
void clear (void) {
    while ( getchar() != '\\n' );
}</code></pre>
<p class="dap-an">✅ Bản trên slide chạy đúng với thao tác gõ bình thường nhưng TREO khi hết dữ liệu vào: lúc đó <code>getchar()</code> trả <code>EOF</code> mãi mãi, mà <code>EOF</code> không bao giờ là <code>'\\n'</code>. Đo thật: chương trình dùng đúng hàm <code>clear()</code> này quay tít cho tới khi phải <code>kill -9</code>. Bản an toàn, dùng ở mọi chỗ bên dưới, chỉ thêm một phép kiểm: <code>int ch; while ((ch = getchar()) != '\\n' &amp;&amp; ch != EOF);</code></p>
<p class="pitfall">⚠️ Đừng gọi <code>clear()</code> "cho chắc" khi bộ đệm đang rỗng — nó sẽ ngồi đó chờ người dùng bấm ENTER, và chương trình của bạn trông như treo mà chẳng vì lý do gì. Hãy dọn <em>sau</em> một lần đọc mà bạn BIẾT là có bỏ lại thứ gì, đừng dọn bừa trước mỗi lần đọc.</p>`],

      [37, 'getchar() function: Problem',
        `<p class="y-chinh">🎯 The most famous bug in the whole course, shown with a memory diagram: read a character with <code>scanf("%c", &amp;c1)</code>, then read a second one with <code>getchar()</code>, and the second read never waits — <code>c2</code> silently becomes <code>'\\n'</code>, code <strong>10</strong>.</p>
<ul>
<li><strong>The task</strong> — "Write a program input two character variables from STDIN. Print out the value and ASCII code." Perfectly reasonable, four lines of code, and it fails.</li>
<li><strong>The slide's explanation, unpacked</strong> — "after user presses 'A' and ENTER (2 code: 13, 10), ASCII codes of them are put into the keyboard buffer. The function scanf(…) will get 'A' to c1. The remaining codes, 13 and 10, are interpreted to the character '\\n' — code 10 only, to c2 by the function getchar(). So, you can not get a new character for c2."</li>
<li><strong>Follow the diagram box by box</strong> — Keyboard sends <code>A</code> then <code>Enter</code>; the Buffer holds <code>01000001</code> (65), <code>00001101</code> (13, CR) and <code>00001010</code> (10, NL); <code>c1</code> receives <code>01000001</code> and <code>c2</code> receives <code>00001010</code>. Nobody threw anything away — <code>c2</code> got a real character that you did not think of as data.</li>
<li><strong>Why <code>%c</code> is the guilty specifier</strong> — unlike <code>%d</code>, <code>%c</code> does <strong>not</strong> skip leading whitespace. It takes the very next byte, whatever it is. Newline is whitespace, and whitespace is exactly what <code>%c</code> refuses to skip.</li>
<li><strong>Read the screenshot carefully</strong> — the output line reads <code>c2 = </code> then a line break, then <code>, ASCII code c2 = 10</code>. The program is not broken in some mysterious way; it faithfully printed character 10, which <em>is</em> a line break.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
int main()
{
    char c1, c2;
    printf("Input c1: ");
    scanf("%c", &amp;c1);
    printf("Input c2: ");
    c2 = getchar();
    printf("c1 = %c, ASCII code c1 = %d\\n", c1, c1);
    printf("c2 = %c, ASCII code c2 = %d\\n", c2, c2);
    return 0;
}</code></pre>
<table>
<tr><th>What you type</th><th>Buffer after scanf</th><th>c1</th><th>c2</th></tr>
<tr><td><code>A</code> ⏎ then <code>a</code> ⏎</td><td><code>\\n a \\n</code></td><td>A (65)</td><td><strong>\\n (10)</strong> — the user's <code>a</code> is never read</td></tr>
<tr><td><code>A</code> ⏎ only</td><td><code>\\n</code></td><td>A (65)</td><td><strong>\\n (10)</strong></td></tr>
<tr><td><code>Aa</code> ⏎</td><td><code>a \\n</code></td><td>A (65)</td><td>a (97) — accidentally correct</td></tr>
</table>
<p class="dap-an">✅ Compiled and run with input <code>A</code>⏎<code>a</code>⏎: output is <code>c1 = A, ASCII code c1 = 65</code> and <code>c2 = </code>(newline)<code>, ASCII code c2 = 10</code> — the slide's screenshot reproduced exactly. Note the third table row, also measured: typing both characters on one line (<code>Aa</code>⏎) makes the program <em>look</em> correct. A bug that passes when you test it carelessly is the worst kind.</p>
<p class="pitfall">⚠️ The "13, 10" in the slide's text is a Windows detail (CR+LF). On Unix/macOS the buffer only ever holds the single byte 10, and even on Windows the C runtime translates CR+LF into one <code>'\\n'</code> for text streams. Do not memorise "13 and 10"; memorise "<strong>ENTER leaves exactly one <code>'\\n'</code> behind</strong>" — that is what both platforms present to your program.</p>`,
        `<p class="y-chinh">🎯 Con bug nổi tiếng nhất cả môn, trình bày kèm sơ đồ bộ nhớ: đọc một ký tự bằng <code>scanf("%c", &amp;c1)</code>, rồi đọc ký tự thứ hai bằng <code>getchar()</code>, thì lần đọc thứ hai KHÔNG hề chờ — <code>c2</code> âm thầm nhận <code>'\\n'</code>, mã <strong>10</strong>.</p>
<ul>
<li><strong>Đề bài</strong> — "viết chương trình nhập hai biến ký tự từ STDIN, in ra giá trị và mã ASCII". Hoàn toàn hợp lý, bốn dòng code, và nó hỏng.</li>
<li><strong>Lời giải thích của slide, mở ra</strong> — "sau khi người dùng nhấn 'A' và ENTER (2 mã: 13, 10), mã ASCII của chúng được đẩy vào bộ đệm bàn phím. Hàm scanf(…) lấy 'A' cho c1. Phần còn lại, 13 và 10, được diễn giải thành ký tự '\\n' — chỉ mã 10 — và vào c2 qua hàm getchar(). Vậy nên bạn không thể lấy được ký tự mới cho c2."</li>
<li><strong>Đi theo sơ đồ từng ô một</strong> — Keyboard gửi <code>A</code> rồi <code>Enter</code>; Buffer giữ <code>01000001</code> (65), <code>00001101</code> (13, CR) và <code>00001010</code> (10, NL); <code>c1</code> nhận <code>01000001</code> còn <code>c2</code> nhận <code>00001010</code>. Không ai vứt gì đi cả — <code>c2</code> nhận được một ký tự THẬT mà bạn không nghĩ nó là dữ liệu.</li>
<li><strong>Vì sao <code>%c</code> là thủ phạm</strong> — khác <code>%d</code>, <code>%c</code> <strong>không</strong> bỏ qua khoảng trắng đứng đầu. Nó lấy đúng byte kế tiếp, bất kể byte đó là gì. Dấu xuống dòng là khoảng trắng, mà khoảng trắng chính là thứ <code>%c</code> từ chối bỏ qua.</li>
<li><strong>Nhìn kỹ ảnh chụp màn hình</strong> — dòng kết quả ghi <code>c2 = </code> rồi xuống hàng, rồi <code>, ASCII code c2 = 10</code>. Chương trình không hỏng theo cách bí ẩn nào cả; nó in ra trung thực ký tự mã 10, mà ký tự đó <em>chính là</em> một lần xuống dòng.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
int main()
{
    char c1, c2;
    printf("Input c1: ");
    scanf("%c", &amp;c1);
    printf("Input c2: ");
    c2 = getchar();
    printf("c1 = %c, ASCII code c1 = %d\\n", c1, c1);
    printf("c2 = %c, ASCII code c2 = %d\\n", c2, c2);
    return 0;
}</code></pre>
<table>
<tr><th>Bạn gõ gì</th><th>Bộ đệm sau scanf</th><th>c1</th><th>c2</th></tr>
<tr><td><code>A</code> ⏎ rồi <code>a</code> ⏎</td><td><code>\\n a \\n</code></td><td>A (65)</td><td><strong>\\n (10)</strong> — chữ <code>a</code> người dùng gõ KHÔNG bao giờ được đọc</td></tr>
<tr><td>chỉ <code>A</code> ⏎</td><td><code>\\n</code></td><td>A (65)</td><td><strong>\\n (10)</strong></td></tr>
<tr><td><code>Aa</code> ⏎</td><td><code>a \\n</code></td><td>A (65)</td><td>a (97) — đúng một cách tình cờ</td></tr>
</table>
<p class="dap-an">✅ Đã biên dịch và chạy với dữ liệu vào <code>A</code>⏎<code>a</code>⏎: kết quả là <code>c1 = A, ASCII code c1 = 65</code> và <code>c2 = </code>(xuống dòng)<code>, ASCII code c2 = 10</code> — tái hiện chính xác ảnh chụp trên slide. Chú ý hàng thứ ba của bảng, cũng đo thật: gõ cả hai ký tự trên CÙNG một dòng (<code>Aa</code>⏎) thì chương trình <em>trông như</em> đúng. Một con bug chịu qua được phép thử cẩu thả là loại bug tệ nhất.</p>
<p class="pitfall">⚠️ Chỗ "13, 10" trong lời slide là chi tiết của Windows (CR+LF). Trên Unix/macOS bộ đệm chỉ bao giờ chứa đúng một byte 10, và ngay cả trên Windows thì thư viện C cũng dịch CR+LF thành một <code>'\\n'</code> duy nhất với dòng văn bản. Đừng học thuộc "13 và 10"; hãy thuộc "<strong>ENTER để lại đúng MỘT <code>'\\n'</code></strong>" — đó là thứ cả hai nền tảng đưa tới chương trình của bạn.</p>`],

      [38, 'getchar() function: Solution 1 — fflush(stdin)',
        `<p class="y-chinh">🎯 The first "fix": call <code>fflush(stdin)</code> before each read. The screenshot shows it working, and the slide immediately prints a yellow warning underneath — which the measurement below turns from a warning into a fact.</p>
<ul>
<li><strong>What the code does</strong> — <code>fflush(stdin);</code> is inserted twice, once before <code>scanf("%c", &amp;c1)</code> and once before <code>c2 = getchar()</code>. The screenshot then reads <code>c1 = A (65)</code> and <code>c2 = a (97)</code>, which is what we wanted.</li>
<li><strong>The warning, in full</strong> — "The fflush(stdin) function should not be overused. This function is not defined in the C standard library and is not supported by other compilers."</li>
<li><strong>The standard is stricter than the slide</strong> — ISO C defines <code>fflush</code> only for <em>output</em> streams. For an input stream the standard says the behaviour is <strong>undefined</strong>, which means a compiler is allowed to do anything at all, including nothing, and still be correct.</li>
<li><strong>"Undefined behaviour" is not "usually works"</strong> — Microsoft's runtime chose to make it clear the input buffer, so it works in Dev-C++ and Visual Studio on Windows. glibc and Apple's libc chose not to. Same source file, same compiler flags, two different programs.</li>
<li><strong>What to write in an exam</strong> — if the question asks how to clear the buffer, answer with the <code>clear()</code> loop of slide 39 and mention <code>fflush(stdin)</code> only as "non-standard, Windows-specific". Writing <code>fflush(stdin)</code> as <em>the</em> answer is how you lose a mark you did not need to lose.</li>
</ul>
<pre><code>printf("Input c1: ");
fflush(stdin);          /* NON-STANDARD — undefined behaviour on input streams */
scanf("%c", &amp;c1);
printf("Input c2: ");
fflush(stdin);
c2 = getchar();</code></pre>
<table>
<tr><th>Platform</th><th><code>fflush(stdin)</code> before the read</th><th>c2 with input <code>A</code>⏎<code>a</code>⏎</th></tr>
<tr><td>Dev-C++ / MSVC (Windows) — the slide</td><td>clears the buffer</td><td>a (97) ✔ as the screenshot shows</td></tr>
<tr><td>Apple clang / macOS — measured here</td><td><strong>does nothing</strong></td><td><strong>\\n (10)</strong> ✘ bug unchanged</td></tr>
<tr><td><code>clear()</code> loop (slide 39) — measured here</td><td>clears the buffer</td><td>a (97) ✔ portable</td></tr>
</table>
<p class="dap-an">✅ Measured, not assumed: the slide's Solution 1 compiled without a single warning under <code>cc -Wall -std=c99</code>, ran, and printed <code>c2 = </code>(newline)<code>, ASCII code c2 = 10</code> — <strong>identical to the broken program on slide 37</strong>. So on this machine Solution 1 is not a solution at all. The slide is not wrong about its own screenshot; it is right about its own toolchain and the yellow warning is the important half of the slide. Solution 2 (slide 39) gave <code>c2 = a (97)</code> on the same machine.</p>
<p class="pitfall">⚠️ This is the sharpest lesson of the whole chapter: <em>a program that works on your machine proves nothing about the language</em>. <code>fflush(stdin)</code> compiles silently, produces no warning, and behaves differently on the next computer. When the standard says "undefined", "it worked when I tried it" is not evidence.</p>`,
        `<p class="y-chinh">🎯 Cách "sửa" thứ nhất: gọi <code>fflush(stdin)</code> trước mỗi lần đọc. Ảnh chụp cho thấy nó chạy được, và slide dán ngay một dòng cảnh báo nền vàng bên dưới — phép đo dưới đây biến lời cảnh báo đó thành sự thật đo được.</p>
<ul>
<li><strong>Code làm gì</strong> — chèn <code>fflush(stdin);</code> hai lần, một trước <code>scanf("%c", &amp;c1)</code> và một trước <code>c2 = getchar()</code>. Ảnh chụp khi đó hiện <code>c1 = A (65)</code> và <code>c2 = a (97)</code>, đúng thứ ta muốn.</li>
<li><strong>Lời cảnh báo, nguyên văn</strong> — "không nên lạm dụng hàm fflush(stdin). Hàm này KHÔNG được định nghĩa trong thư viện chuẩn C và không được các trình biên dịch khác hỗ trợ".</li>
<li><strong>Chuẩn còn khắt khe hơn cả slide</strong> — ISO C chỉ định nghĩa <code>fflush</code> cho dòng <em>xuất</em>. Với dòng nhập, chuẩn nói hành vi là <strong>không xác định</strong> (undefined) — nghĩa là trình biên dịch được phép làm bất cứ điều gì, kể cả không làm gì, mà vẫn đúng chuẩn.</li>
<li><strong>"Không xác định" KHÔNG đồng nghĩa "thường thì chạy"</strong> — thư viện của Microsoft chọn cách dọn bộ đệm nhập, nên nó chạy trong Dev-C++ và Visual Studio trên Windows. glibc và libc của Apple chọn không làm gì. Cùng một file mã nguồn, cùng cờ biên dịch, ra hai chương trình khác nhau.</li>
<li><strong>Viết gì trong bài thi</strong> — nếu đề hỏi cách dọn bộ đệm, hãy trả lời bằng vòng lặp <code>clear()</code> ở slide 39, và chỉ nhắc <code>fflush(stdin)</code> kèm chú "ngoài chuẩn, riêng Windows". Viết <code>fflush(stdin)</code> như là <em>câu trả lời chính</em> là cách mất điểm không đáng mất.</li>
</ul>
<pre><code>printf("Input c1: ");
fflush(stdin);          /* NGOÀI CHUẨN — hành vi không xác định với dòng nhập */
scanf("%c", &amp;c1);
printf("Input c2: ");
fflush(stdin);
c2 = getchar();</code></pre>
<table>
<tr><th>Nền tảng</th><th><code>fflush(stdin)</code> trước lần đọc</th><th>c2 khi gõ <code>A</code>⏎<code>a</code>⏎</th></tr>
<tr><td>Dev-C++ / MSVC (Windows) — như slide</td><td>dọn sạch bộ đệm</td><td>a (97) ✔ đúng ảnh chụp</td></tr>
<tr><td>Apple clang / macOS — đo tại đây</td><td><strong>không làm gì cả</strong></td><td><strong>\\n (10)</strong> ✘ bug y nguyên</td></tr>
<tr><td>Vòng lặp <code>clear()</code> (slide 39) — đo tại đây</td><td>dọn sạch bộ đệm</td><td>a (97) ✔ khả chuyển</td></tr>
</table>
<p class="dap-an">✅ Đo thật, không phỏng đoán: Solution 1 của slide biên dịch không một lời cảnh báo với <code>cc -Wall -std=c99</code>, chạy, và in ra <code>c2 = </code>(xuống dòng)<code>, ASCII code c2 = 10</code> — <strong>y hệt chương trình hỏng ở slide 37</strong>. Nghĩa là trên máy này Solution 1 không hề là một giải pháp. Slide không sai về ảnh chụp của chính nó; nó đúng với bộ công cụ của nó, và dòng cảnh báo vàng mới là nửa quan trọng của slide. Solution 2 (slide 39) trên cùng máy đó cho <code>c2 = a (97)</code>.</p>
<p class="pitfall">⚠️ Đây là bài học sắc nhất của cả chương: <em>một chương trình chạy được trên máy bạn KHÔNG chứng minh được điều gì về ngôn ngữ</em>. <code>fflush(stdin)</code> dịch êm ru, không cảnh báo, rồi cư xử khác hẳn trên máy tiếp theo. Khi chuẩn đã nói "không xác định" thì "em thử thấy chạy mà" không phải bằng chứng.</p>`],

      [39, 'getchar() function: Solution 2 — the clear() function',
        `<p class="y-chinh">🎯 The portable fix, and the one to memorise: write your own <code>clear()</code> — "the user-defined function for clearing the keyboard buffer" — and call it between the two reads. Measured here: <code>c2</code> finally gets <code>a</code>, code 97.</p>
<ul>
<li><strong>The whole change is one line</strong> — <code>scanf("%c", &amp;c1); clear(); printf("Input c2: "); c2 = getchar();</code>. The <code>clear()</code> eats the leftover newline, so <code>getchar()</code> finds an empty buffer and does what you expected all along: it waits.</li>
<li><strong>Why this is better than <code>fflush(stdin)</code></strong> — it is made of nothing but standard C. <code>getchar()</code> is defined by ISO C, a <code>while</code> loop is defined by ISO C, and the behaviour is therefore the same on every compiler on earth. No warning, no platform footnote.</li>
<li><strong>It is a <em>function</em>, deliberately</strong> — the buffer needs clearing in four different places in the validation program on slides 51–52. Writing the loop inline four times is exactly the duplication that Slot 08-09 told you to remove by making a module.</li>
<li><strong>Placement matters more than the code</strong> — <code>clear()</code> goes <em>after</em> the read that left junk, not before the read that will suffer. The effect is the same here, but "clean up after yourself" scales to loops, where "clean up before" leaves the very first iteration unprotected.</li>
<li><strong>A second standard fix, worth knowing</strong> — for <code>%c</code> specifically, you can put a space in the format string: <code>scanf(" %c", &amp;c2)</code>. A blank in a <code>scanf</code> format means "skip any amount of whitespace, including none". It is shorter, but it only helps <code>%c</code>; <code>clear()</code> also handles typed-in rubbish like <code>Abcd</code>.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

void clear(){
    while(getchar()!='\\n');
}

int main()
{
    char c1, c2;
    printf("Input c1: ");
    scanf("%c", &amp;c1);
    clear();                       /* ăn nốt phần thừa của dòng, kể cả '\\n' */
    printf("Input c2: ");
    c2 = getchar();
    printf("c1 = %c, ASCII code c1 = %d\\n", c1, c1);
    printf("c2 = %c, ASCII code c2 = %d\\n", c2, c2);
    return 0;
}</code></pre>
<table>
<tr><th>Input typed</th><th>Without clear() (slide 37)</th><th>With clear() (this slide)</th><th>With <code>scanf(" %c")</code></th></tr>
<tr><td><code>A</code>⏎ <code>a</code>⏎</td><td>c2 = \\n (10) ✘</td><td><strong>c2 = a (97) ✔</strong></td><td>c2 = a (97) ✔</td></tr>
<tr><td><code>Abcd</code>⏎ <code>a</code>⏎</td><td>c2 = b (98) ✘</td><td><strong>c2 = a (97) ✔</strong></td><td>c2 = b (98) ✘</td></tr>
</table>
<p class="dap-an">✅ All three columns measured on the same machine with <code>cc -Wall -std=c99</code>. Row 1: without <code>clear()</code> → 10; with <code>clear()</code> → 97; with <code>" %c"</code> → 97. Row 2 is the interesting one and is <em>not</em> on the slide: type <code>Abcd</code> by mistake and only <code>clear()</code> saves you — the space-in-format trick skips whitespace but happily hands you the stray <code>b</code>.</p>
<p class="meo">💡 Learn both tools and their range. <code>" %c"</code> = "ignore whitespace in front of my character". <code>clear()</code> = "throw away everything left on this line". The first is a scalpel for one specifier; the second is the broom you need after <em>any</em> partially-consumed line, which is why slides 51–52 use the broom.</p>`,
        `<p class="y-chinh">🎯 Cách sửa khả chuyển, và là cách phải thuộc: tự viết hàm <code>clear()</code> — "hàm do người dùng định nghĩa để dọn bộ đệm bàn phím" — rồi gọi nó giữa hai lần đọc. Đo tại chỗ: <code>c2</code> cuối cùng cũng nhận được <code>a</code>, mã 97.</p>
<ul>
<li><strong>Toàn bộ thay đổi gói trong một dòng</strong> — <code>scanf("%c", &amp;c1); clear(); printf("Input c2: "); c2 = getchar();</code>. Hàm <code>clear()</code> ăn nốt dấu xuống dòng còn sót, nên <code>getchar()</code> gặp bộ đệm rỗng và làm đúng thứ bạn vẫn mong từ đầu: nó CHỜ.</li>
<li><strong>Vì sao hơn hẳn <code>fflush(stdin)</code></strong> — nó làm hoàn toàn bằng C chuẩn. <code>getchar()</code> có trong ISO C, vòng <code>while</code> có trong ISO C, nên hành vi giống nhau trên mọi trình biên dịch trên đời. Không cảnh báo, không chú thích nền tảng.</li>
<li><strong>Nó là một HÀM, có chủ ý</strong> — trong chương trình kiểm tra hợp lệ ở slide 51–52, bộ đệm cần được dọn ở bốn chỗ khác nhau. Viết lại vòng lặp đó bốn lần chính là kiểu lặp mã mà Slot 08-09 đã bảo bạn dẹp đi bằng cách tạo một module.</li>
<li><strong>Đặt ở ĐÂU quan trọng hơn cả code</strong> — <code>clear()</code> đặt <em>sau</em> lần đọc để lại rác, chứ không phải trước lần đọc sắp lãnh đủ. Ở đây hiệu quả như nhau, nhưng thói quen "dọn sau khi mình bày" mới đúng trong vòng lặp, còn "dọn trước" thì vòng đầu tiên vẫn hở.</li>
<li><strong>Một cách chuẩn thứ hai, nên biết</strong> — riêng với <code>%c</code>, bạn có thể đặt một dấu cách trong chuỗi định dạng: <code>scanf(" %c", &amp;c2)</code>. Một dấu trắng trong chuỗi định dạng của <code>scanf</code> nghĩa là "bỏ qua bao nhiêu khoảng trắng cũng được, kể cả không có". Ngắn hơn, nhưng chỉ cứu được <code>%c</code>; còn <code>clear()</code> xử lý được cả rác người dùng gõ nhầm kiểu <code>Abcd</code>.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

void clear(){
    while(getchar()!='\\n');
}

int main()
{
    char c1, c2;
    printf("Input c1: ");
    scanf("%c", &amp;c1);
    clear();                       /* ăn nốt phần thừa của dòng, kể cả '\\n' */
    printf("Input c2: ");
    c2 = getchar();
    printf("c1 = %c, ASCII code c1 = %d\\n", c1, c1);
    printf("c2 = %c, ASCII code c2 = %d\\n", c2, c2);
    return 0;
}</code></pre>
<table>
<tr><th>Gõ vào</th><th>Không clear() (slide 37)</th><th>Có clear() (slide này)</th><th>Dùng <code>scanf(" %c")</code></th></tr>
<tr><td><code>A</code>⏎ <code>a</code>⏎</td><td>c2 = \\n (10) ✘</td><td><strong>c2 = a (97) ✔</strong></td><td>c2 = a (97) ✔</td></tr>
<tr><td><code>Abcd</code>⏎ <code>a</code>⏎</td><td>c2 = b (98) ✘</td><td><strong>c2 = a (97) ✔</strong></td><td>c2 = b (98) ✘</td></tr>
</table>
<p class="dap-an">✅ Cả ba cột đều đo trên cùng một máy với <code>cc -Wall -std=c99</code>. Hàng 1: không <code>clear()</code> → 10; có <code>clear()</code> → 97; dùng <code>" %c"</code> → 97. Hàng 2 mới là hàng thú vị và <em>không</em> có trên slide: lỡ gõ nhầm <code>Abcd</code> thì chỉ <code>clear()</code> cứu được bạn — mẹo thêm dấu cách chỉ bỏ qua khoảng trắng, còn chữ <code>b</code> lạc thì nó vẫn vui vẻ đưa cho bạn.</p>
<p class="meo">💡 Học cả hai công cụ và tầm với của chúng. <code>" %c"</code> = "bỏ qua khoảng trắng đứng trước ký tự của tôi". <code>clear()</code> = "vứt sạch mọi thứ còn lại trên dòng này". Cái đầu là con dao mổ cho đúng một specifier; cái sau là cây chổi bạn cần sau <em>bất kỳ</em> dòng nào bị đọc dở — và đó là lý do slide 51–52 dùng cây chổi.</p>`],

      [40, 'Exercise 2: Input Characters',
        `<p class="y-chinh">🎯 The exercise that makes <code>getchar()</code> earn its place: read characters until ENTER and report how many were digits, how many were letters, and how many were something else — reusing <code>ctype.h</code> from the first half of this same deck.</p>
<ul>
<li><strong>The statement</strong> — "Develop a program that will accept a string of characters until the key ENTER is pressed then number of digits, number of alphabets, and number of other characters are printed out."</li>
<li><strong>The slide's own hint, verbatim</strong> — variables <code>char c;</code> and <code>int numOfDigits=0, numOfAlpha=0, numOfOthers = 0</code>; algorithm <code>While (c=getchar() != '\\n') { if c is a digit then numOfDigits++; else if c is an alphabet then numOfAlpha++; else numOfOthers++; }</code>; and the closing note "Using library functions in ctype.h".</li>
<li><strong>Why <code>getchar()</code> and not <code>scanf</code></strong> — you must see <em>every</em> character including the spaces and the punctuation, and <code>scanf("%c")</code> would do the same job one call at a time with nothing gained. Character-at-a-time work is what <code>getchar()</code> is for.</li>
<li><strong>Why <code>ctype.h</code> and not <code>c &gt;= '0' &amp;&amp; c &lt;= '9'</code></strong> — <code>isdigit(c)</code> and <code>isalpha(c)</code> (slides 19–28) say what you mean, cover both letter cases in one call, and do not assume the alphabet is contiguous in the character set. The exercise is deliberately placed <em>after</em> the ctype half of the deck.</li>
<li><strong>The order of the tests is not free</strong> — <code>else</code> chains are exclusive, so each character is counted exactly once and the three counts always add up to the number of characters typed. Turning the <code>else if</code> into a second plain <code>if</code> would double-count nothing here, but it would stop the totals from being a useful self-check.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;ctype.h&gt;

int main(void)
{
    int c;                       /* int, NOT char — so EOF is representable */
    int numOfDigits = 0, numOfAlpha = 0, numOfOthers = 0;

    printf("Input a string, then press ENTER: ");
    while ((c = getchar()) != '\\n' &amp;&amp; c != EOF) {
        if (isdigit(c))      numOfDigits++;
        else if (isalpha(c)) numOfAlpha++;
        else                 numOfOthers++;
    }
    printf("Digits     : %d\\n", numOfDigits);
    printf("Alphabets  : %d\\n", numOfAlpha);
    printf("Others     : %d\\n", numOfOthers);
    return 0;
}</code></pre>
<table>
<tr><th>Input line</th><th>Digits</th><th>Alphabets</th><th>Others</th><th>Check: total</th></tr>
<tr><td><code>PRF192 lab #3, ok!</code></td><td>4</td><td>8</td><td>6</td><td>18 = length ✔</td></tr>
<tr><td><code>Hello World 2026</code></td><td>4</td><td>10</td><td>2</td><td>16 = length ✔</td></tr>
<tr><td>(ENTER on an empty line)</td><td>0</td><td>0</td><td>0</td><td>0 ✔</td></tr>
</table>
<p class="dap-an">✅ Answer: the program above, compiled with <code>cc -Wall -std=c99</code> and run on real input. <code>PRF192 lab #3, ok!</code> → <strong>4 digits, 8 alphabets, 6 others</strong> (the six being two spaces, <code>#</code>, <code>,</code>, a space and <code>!</code>). <code>Hello World 2026</code> → <strong>4 / 10 / 2</strong>. Empty line → <strong>0 / 0 / 0</strong>.<br>Two corrections to the slide's hint, both measured, not guessed. <strong>(1)</strong> <code>While (c=getchar() != '\\n')</code> is wrong C: <code>!=</code> binds tighter than <code>=</code>, so C reads it as <code>c = (getchar() != '\\n')</code> and <code>c</code> receives <strong>1</strong> on every iteration, never the character. Running it on <code>ab3!</code> printed <code>c = 1</code> four times. You need the inner parentheses: <code>while ((c = getchar()) != '\\n')</code>. <strong>(2)</strong> the hint has no <code>EOF</code> test, so closing the input without pressing ENTER makes it loop for ever — the version without <code>&amp;&amp; c != EOF</code> had to be killed with <code>kill -9</code>. The slide also prints <code>numOfDigits</code> twice instead of <code>numOfAlpha</code>; that is a typo on the slide, corrected above.</p>
<p class="meo">💡 The pattern <code>while ((c = getchar()) != '\\n' &amp;&amp; c != EOF)</code> is worth learning as a single unit — assignment in parentheses, then two tests. It is the same shape as the safe <code>clear()</code> of slide 36 and it will carry you through the Strings chapter (Slot 16-18) unchanged.</p>`,
        `<p class="y-chinh">🎯 Bài tập làm cho <code>getchar()</code> xứng đáng có mặt: đọc ký tự cho tới khi gặp ENTER rồi báo có bao nhiêu chữ số, bao nhiêu chữ cái, bao nhiêu ký tự khác — dùng lại <code>ctype.h</code> ở nửa đầu chính bộ slide này.</p>
<ul>
<li><strong>Đề bài</strong> — "viết chương trình nhận một chuỗi ký tự cho tới khi nhấn phím ENTER, rồi in ra số chữ số, số chữ cái và số ký tự khác".</li>
<li><strong>Gợi ý của chính slide, nguyên văn</strong> — biến <code>char c;</code> và <code>int numOfDigits=0, numOfAlpha=0, numOfOthers = 0</code>; thuật toán <code>While (c=getchar() != '\\n') { if c is a digit then numOfDigits++; else if c is an alphabet then numOfAlpha++; else numOfOthers++; }</code>; và dòng chốt "Using library functions in ctype.h".</li>
<li><strong>Vì sao dùng <code>getchar()</code> chứ không <code>scanf</code></strong> — bạn phải nhìn thấy <em>mọi</em> ký tự, kể cả dấu cách và dấu câu; <code>scanf("%c")</code> làm đúng việc đó nhưng mỗi lần một lời gọi mà chẳng được lợi gì. Việc "từng ký tự một" chính là việc <code>getchar()</code> sinh ra để làm.</li>
<li><strong>Vì sao dùng <code>ctype.h</code> chứ không <code>c &gt;= '0' &amp;&amp; c &lt;= '9'</code></strong> — <code>isdigit(c)</code> và <code>isalpha(c)</code> (slide 19–28) nói đúng ý bạn định nói, gộp cả chữ hoa lẫn chữ thường trong một lời gọi, và không giả định bảng chữ cái nằm liền nhau trong bảng mã. Bài tập được đặt <em>sau</em> phần ctype là có chủ ý.</li>
<li><strong>Thứ tự các phép kiểm không phải tuỳ tiện</strong> — chuỗi <code>else</code> loại trừ nhau nên mỗi ký tự được đếm đúng một lần, và ba con số cộng lại luôn bằng số ký tự đã gõ. Đổi <code>else if</code> thành một <code>if</code> rời thì ở đây chưa đếm trùng, nhưng tổng ba số mất luôn tác dụng tự kiểm.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;ctype.h&gt;

int main(void)
{
    int c;                       /* int, KHÔNG phải char — để chứa nổi EOF */
    int numOfDigits = 0, numOfAlpha = 0, numOfOthers = 0;

    printf("Input a string, then press ENTER: ");
    while ((c = getchar()) != '\\n' &amp;&amp; c != EOF) {
        if (isdigit(c))      numOfDigits++;
        else if (isalpha(c)) numOfAlpha++;
        else                 numOfOthers++;
    }
    printf("Digits     : %d\\n", numOfDigits);
    printf("Alphabets  : %d\\n", numOfAlpha);
    printf("Others     : %d\\n", numOfOthers);
    return 0;
}</code></pre>
<table>
<tr><th>Dòng gõ vào</th><th>Chữ số</th><th>Chữ cái</th><th>Khác</th><th>Đối chiếu: tổng</th></tr>
<tr><td><code>PRF192 lab #3, ok!</code></td><td>4</td><td>8</td><td>6</td><td>18 = độ dài ✔</td></tr>
<tr><td><code>Hello World 2026</code></td><td>4</td><td>10</td><td>2</td><td>16 = độ dài ✔</td></tr>
<tr><td>(chỉ nhấn ENTER, dòng trống)</td><td>0</td><td>0</td><td>0</td><td>0 ✔</td></tr>
</table>
<p class="dap-an">✅ Đáp án: chương trình ở trên, biên dịch bằng <code>cc -Wall -std=c99</code> và chạy với dữ liệu vào thật. <code>PRF192 lab #3, ok!</code> → <strong>4 chữ số, 8 chữ cái, 6 ký tự khác</strong> (sáu cái đó là hai dấu cách, <code>#</code>, <code>,</code>, một dấu cách nữa và <code>!</code>). <code>Hello World 2026</code> → <strong>4 / 10 / 2</strong>. Dòng trống → <strong>0 / 0 / 0</strong>.<br>Hai chỗ phải sửa trong gợi ý của slide, đều đo được chứ không suy đoán. <strong>(1)</strong> <code>While (c=getchar() != '\\n')</code> là C SAI: <code>!=</code> có độ ưu tiên cao hơn <code>=</code>, nên C hiểu thành <code>c = (getchar() != '\\n')</code> và <code>c</code> nhận giá trị <strong>1</strong> ở mọi vòng lặp, không bao giờ nhận ký tự. Chạy thử với <code>ab3!</code> in ra <code>c = 1</code> bốn lần. Phải có cặp ngoặc bên trong: <code>while ((c = getchar()) != '\\n')</code>. <strong>(2)</strong> gợi ý không kiểm <code>EOF</code>, nên đóng dòng nhập mà không nhấn ENTER là nó lặp vô hạn — bản thiếu <code>&amp;&amp; c != EOF</code> đã phải <code>kill -9</code>. Ngoài ra slide in <code>numOfDigits</code> hai lần thay vì <code>numOfAlpha</code>; đó là lỗi gõ trên slide, đã sửa ở trên.</p>
<p class="meo">💡 Khuôn <code>while ((c = getchar()) != '\\n' &amp;&amp; c != EOF)</code> đáng học thuộc như một khối liền — phép gán trong ngoặc, rồi hai phép kiểm. Nó cùng dáng với hàm <code>clear()</code> an toàn ở slide 36 và sẽ theo bạn nguyên vẹn qua chương Chuỗi ký tự (Slot 16-18).</p>`],

      [41, '3 - scanf(…) function',
        `<p class="y-chinh">🎯 The definition and the stopping rule: <code>scanf(format string, &amp;identifier, ...)</code> "retrieves data values from the standard input stream buffer <strong>under format control</strong>", and it keeps going until one of three things happens.</p>
<ul>
<li><strong>"Under format control" is the difference from <code>getchar()</code></strong> — <code>getchar()</code> hands you raw character codes; <code>scanf</code> reads the format string and <em>converts</em>. Type <code>70</code> with <code>%d</code> and you get the integer seventy, not the codes 55 and 48.</li>
<li><strong>Stop condition 1 — the format string is finished</strong> — "Interpreted and processed the entire format string". The happy case: every specifier got its data, everything is in your variables.</li>
<li><strong>Stop condition 2 — a character that does not fit</strong> — "Found a character that does not meet the next conversion specification in the format string, in which case scanf <strong>leaves the offending character in the buffer</strong>". This half-sentence is the single most important fact about <code>scanf</code> in the whole course; it is why a bad input can hang a retry loop for ever.</li>
<li><strong>Stop condition 3 — the buffer ran out</strong> — "or emptied the buffer, in which case scanf <strong>waits</strong> until the user adds more data values". That is why <code>scanf("%d%d")</code> happily accepts your two numbers on two separate lines.</li>
<li><strong>Why <code>&amp;</code> is not optional</strong> — <code>scanf</code> must <em>write into</em> your variables, so it needs their addresses (Slot 10). Passing the value instead of the address compiles with a warning under <code>-Wall</code> and typically crashes at run time. The only common exception is a string name, which is already an address.</li>
</ul>
<pre><code>int   n;   scanf("%d",  &amp;n);     /* đọc một số nguyên            */
char  c;   scanf("%c",  &amp;c);     /* đọc đúng MỘT ký tự, kể cả '\\n' */
double x;  scanf("%lf", &amp;x);     /* đọc một số thực double        */
int a, b;  scanf("%d%d", &amp;a, &amp;b);/* đọc hai số, cách nhau bởi khoảng trắng */</code></pre>
<table>
<tr><th>You type (format <code>"%d%d"</code>)</th><th>scanf returns</th><th>a, b</th><th>What is left in the buffer</th></tr>
<tr><td><code>8 6</code>⏎</td><td>2</td><td>8, 6</td><td><code>\\n</code></td></tr>
<tr><td><code>8</code>⏎<code>6</code>⏎</td><td>2</td><td>8, 6</td><td><code>\\n</code> — it waited for the second line (stop 3)</td></tr>
<tr><td><code>8 x</code>⏎</td><td><strong>1</strong></td><td>8, unchanged</td><td><code>x\\n</code> — the offending <code>x</code> stays (stop 2)</td></tr>
<tr><td><code>x</code>⏎</td><td><strong>0</strong></td><td>both unchanged</td><td><code>x\\n</code></td></tr>
</table>
<p class="dap-an">✅ Every row measured with <code>cc -Wall -std=c99</code>, printing the return value and the variables. The third and fourth rows are the ones that matter: <strong>the bad character is not thrown away</strong>. Call <code>scanf("%d", &amp;a)</code> again without cleaning up and it meets the same <code>x</code>, returns 0 again, and you have an infinite loop — measured below on slide 50.</p>
<p class="meo">💡 Read <code>scanf</code>'s format string as a <em>pattern the input must match</em>, not as a list of variables. Everything in it is either a conversion (<code>%d</code>), a whitespace instruction (a blank), or a literal the input must contain exactly (a comma, an <code>&amp;</code>). Slides 45–47 are three consequences of that one reading.</p>`,
        `<p class="y-chinh">🎯 Định nghĩa và luật dừng: <code>scanf(format string, &amp;identifier, ...)</code> "lấy các giá trị dữ liệu từ bộ đệm dòng nhập chuẩn <strong>dưới sự điều khiển của định dạng</strong>", và nó chạy tiếp cho tới khi một trong ba chuyện xảy ra.</p>
<ul>
<li><strong>"Dưới điều khiển của định dạng" là chỗ khác <code>getchar()</code></strong> — <code>getchar()</code> đưa bạn mã ký tự thô; <code>scanf</code> đọc chuỗi định dạng rồi <em>chuyển đổi</em>. Gõ <code>70</code> với <code>%d</code> thì bạn nhận số nguyên bảy mươi, không phải hai mã 55 và 48.</li>
<li><strong>Điều kiện dừng 1 — hết chuỗi định dạng</strong> — "đã diễn giải và xử lý xong toàn bộ chuỗi định dạng". Trường hợp đẹp: mọi specifier đều có dữ liệu, mọi thứ đã nằm trong biến của bạn.</li>
<li><strong>Điều kiện dừng 2 — gặp ký tự không khớp</strong> — "gặp một ký tự không thoả conversion specification kế tiếp trong chuỗi định dạng, khi đó scanf <strong>để nguyên ký tự phạm quy trong bộ đệm</strong>". Nửa câu này là sự thật quan trọng nhất về <code>scanf</code> trong cả môn; nó là lý do một lần nhập sai có thể treo vĩnh viễn vòng lặp nhập lại.</li>
<li><strong>Điều kiện dừng 3 — bộ đệm cạn</strong> — "hoặc đã vét sạch bộ đệm, khi đó scanf <strong>chờ</strong> tới lúc người dùng thêm dữ liệu". Đó là lý do <code>scanf("%d%d")</code> vui vẻ nhận hai số bạn gõ trên hai dòng khác nhau.</li>
<li><strong>Vì sao <code>&amp;</code> không được thiếu</strong> — <code>scanf</code> phải <em>ghi vào</em> biến của bạn, nên nó cần địa chỉ của biến (Slot 10). Truyền giá trị thay vì địa chỉ thì dịch được kèm cảnh báo với <code>-Wall</code> và thường sập lúc chạy. Ngoại lệ thường gặp duy nhất là tên một chuỗi, vốn đã là địa chỉ.</li>
</ul>
<pre><code>int   n;   scanf("%d",  &amp;n);     /* đọc một số nguyên            */
char  c;   scanf("%c",  &amp;c);     /* đọc đúng MỘT ký tự, kể cả '\\n' */
double x;  scanf("%lf", &amp;x);     /* đọc một số thực double        */
int a, b;  scanf("%d%d", &amp;a, &amp;b);/* đọc hai số, cách nhau bởi khoảng trắng */</code></pre>
<table>
<tr><th>Gõ gì (định dạng <code>"%d%d"</code>)</th><th>scanf trả về mấy</th><th>a, b nhận gì</th><th>Bộ đệm còn lại gì</th></tr>
<tr><td><code>8 6</code>⏎</td><td>2</td><td>8, 6</td><td><code>\\n</code></td></tr>
<tr><td><code>8</code>⏎<code>6</code>⏎</td><td>2</td><td>8, 6</td><td><code>\\n</code> — nó ĐÃ CHỜ dòng thứ hai (dừng 3)</td></tr>
<tr><td><code>8 x</code>⏎</td><td><strong>1</strong></td><td>8, b giữ nguyên</td><td><code>x\\n</code> — chữ <code>x</code> phạm quy NẰM LẠI (dừng 2)</td></tr>
<tr><td><code>x</code>⏎</td><td><strong>0</strong></td><td>cả hai giữ nguyên</td><td><code>x\\n</code></td></tr>
</table>
<p class="dap-an">✅ Mọi hàng đều đo bằng <code>cc -Wall -std=c99</code>, in kèm giá trị trả về và các biến. Hàng thứ ba và thứ tư mới là hàng đáng giá: <strong>ký tự sai KHÔNG bị vứt đi</strong>. Gọi <code>scanf("%d", &amp;a)</code> lần nữa mà không dọn dẹp thì nó gặp lại đúng chữ <code>x</code> đó, lại trả về 0, và bạn có một vòng lặp vô hạn — đo thật ở slide 50 bên dưới.</p>
<p class="meo">💡 Hãy đọc chuỗi định dạng của <code>scanf</code> như một <em>khuôn mẫu mà dữ liệu vào phải khớp</em>, chứ không phải như một danh sách biến. Mọi thứ trong đó chỉ là một trong ba loại: phép chuyển đổi (<code>%d</code>), chỉ thị khoảng trắng (một dấu trắng), hoặc một ký tự hằng mà dữ liệu vào phải có đúng như thế (dấu phẩy, dấu <code>&amp;</code>). Slide 45–47 là ba hệ quả của đúng một cách đọc đó.</p>`],

      [42, 'scanf(…) function (cont.) — the four questions',
        `<p class="y-chinh">🎯 A road map slide: four questions about <code>scanf</code>, and the promise that "we will get the answers in the following slides". Each question is answered by an exact slide, so use this as a checklist when you revise.</p>
<ul>
<li><strong>Q1 — "How to specify the input format string?"</strong> Answered on <strong>slides 43–44</strong>: the table of conversion specifiers, and two programs showing what a mismatched specifier does to your data.</li>
<li><strong>Q2 — "How to separate input data?"</strong> Answered on <strong>slides 45–46</strong>: whitespace is the default separator, and you may override it with literal characters of your own.</li>
<li><strong>Q3 — "How to realize that how many data were inputted successfully?"</strong> Answered on <strong>slides 48–49</strong>: the return value of <code>scanf</code>. This is the question that turns into the whole of input validation.</li>
<li><strong>Q4 — "How to remove the byte '\\n' in the keyboard buffer after an input operation? Is clearing the buffer the only way?"</strong> Answered on <strong>slide 47</strong>: no, it is not the only way — <code>%*c</code> reads and discards without needing a variable or a helper function.</li>
<li><strong>Note what the four questions have in common</strong> — none of them is about the data you want; all four are about the <em>plumbing</em> around it. That is an honest picture of how much of real input code is defensive.</li>
</ul>
<table>
<tr><th>Question</th><th>Answered on</th><th>One-line answer</th></tr>
<tr><td>Q1 format string</td><td>43, 44</td><td><code>%d %c %lf …</code> — and a wrong one silently corrupts the variable</td></tr>
<tr><td>Q2 separators</td><td>45, 46</td><td>whitespace by default; any literal you write overrides it</td></tr>
<tr><td>Q3 how many read</td><td>48, 49</td><td>the return value: 0, 1, 2, … or EOF (-1)</td></tr>
<tr><td>Q4 removing '\\n'</td><td>47</td><td><code>%*c</code>, or <code>clear()</code>, or a space before <code>%c</code></td></tr>
</table>
<p class="meo">💡 Turn these four into your own revision questions and answer them from memory before an exam. If you can say what <code>scanf("%d%*c%c", &amp;n, &amp;c)</code> does to the input <code>70 D</code> — and what it returns — you have answered all four at once.</p>`,
        `<p class="y-chinh">🎯 Slide chỉ đường: bốn câu hỏi về <code>scanf</code>, kèm lời hứa "chúng ta sẽ có câu trả lời ở các slide sau". Mỗi câu được trả lời ở một slide cụ thể, nên hãy dùng slide này làm danh sách kiểm khi ôn.</p>
<ul>
<li><strong>Câu 1 — "Chỉ định chuỗi định dạng đầu vào thế nào?"</strong> Trả lời ở <strong>slide 43–44</strong>: bảng conversion specifier, và hai chương trình cho thấy specifier lệch kiểu làm gì với dữ liệu của bạn.</li>
<li><strong>Câu 2 — "Tách dữ liệu vào bằng gì?"</strong> Trả lời ở <strong>slide 45–46</strong>: khoảng trắng là dấu tách mặc định, và bạn được phép đè lên bằng ký tự hằng do mình đặt.</li>
<li><strong>Câu 3 — "Làm sao biết đã nhập thành công bao nhiêu dữ liệu?"</strong> Trả lời ở <strong>slide 48–49</strong>: giá trị trả về của <code>scanf</code>. Chính câu hỏi này lớn lên thành toàn bộ phần kiểm tra hợp lệ.</li>
<li><strong>Câu 4 — "Làm sao bỏ byte '\\n' trong bộ đệm sau một thao tác nhập? Dọn bộ đệm có phải cách duy nhất không?"</strong> Trả lời ở <strong>slide 47</strong>: không, không phải cách duy nhất — <code>%*c</code> đọc rồi vứt, không cần biến cũng không cần hàm phụ.</li>
<li><strong>Để ý điểm chung của bốn câu</strong> — không câu nào hỏi về dữ liệu bạn CẦN; cả bốn đều hỏi về phần <em>đường ống</em> quanh nó. Đó là bức tranh trung thực về tỉ lệ mã phòng thủ trong code nhập liệu thật.</li>
</ul>
<table>
<tr><th>Câu hỏi</th><th>Trả lời ở slide</th><th>Đáp án một dòng</th></tr>
<tr><td>C1 chuỗi định dạng</td><td>43, 44</td><td><code>%d %c %lf …</code> — và chọn sai thì biến hỏng âm thầm</td></tr>
<tr><td>C2 dấu tách</td><td>45, 46</td><td>mặc định là khoảng trắng; viết ký tự hằng nào thì ký tự đó đè lên</td></tr>
<tr><td>C3 đọc được mấy</td><td>48, 49</td><td>giá trị trả về: 0, 1, 2, … hoặc EOF (-1)</td></tr>
<tr><td>C4 bỏ '\\n'</td><td>47</td><td><code>%*c</code>, hoặc <code>clear()</code>, hoặc một dấu cách trước <code>%c</code></td></tr>
</table>
<p class="meo">💡 Hãy biến bốn câu này thành câu hỏi ôn của chính bạn và trả lời bằng trí nhớ trước khi thi. Nếu nói được <code>scanf("%d%*c%c", &amp;n, &amp;c)</code> làm gì với dữ liệu vào <code>70 D</code> — và trả về mấy — là bạn đã trả lời cả bốn câu cùng lúc.</p>`],

      [43, 'scanf(…): Conversion Specifiers',
        `<p class="y-chinh">🎯 The reference table of the chapter, with the blue box under it saying <em>why</em> it exists: "Data from the keyboard are passed to the buffer as characters (ASCII codes). So, conversion specifiers are instructions that specify how to convert character data to typed-data. <strong>If a specifier does not match the data type of a variable, the conversion is incorrect.</strong>"</p>
<ul>
<li><strong>The specifier is an instruction, not a label</strong> — <code>%d</code> does not <em>describe</em> your variable; it <em>orders</em> <code>scanf</code> to read decimal text, build a 4-byte <code>int</code> and write it to the address you gave. If the address points at an 8-byte <code>double</code>, the order is carried out anyway. Slide 44 shows the wreckage.</li>
<li><strong>The rows you will actually use in PRF192</strong> — <code>%c</code> (char), <code>%d</code> (int), <code>%ld</code> (long), <code>%f</code> (float), <code>%lf</code> (double). Everything else on the slide (<code>%u</code>, <code>%o</code>, <code>%x</code>) is background you should recognise but will rarely type.</li>
<li><strong><code>%*c</code> is not a type at all</strong> — the slide puts it in the same row as <code>%c</code> with the description "Remove one character in the input buffer". The star means "convert but <em>assign to nobody</em>". It is the answer to question 4 of slide 42, and it gets a whole slide of its own at 47.</li>
<li><strong>The scanf/printf trap that is not on the slide</strong> — in <code>scanf</code>, <code>%f</code> means <code>float*</code> and <code>%lf</code> means <code>double*</code>; in <code>printf</code>, <code>%f</code> prints a <code>double</code> and <code>%lf</code> means the same thing. So the two functions do <em>not</em> use the specifiers identically, and copying a <code>printf</code> format into a <code>scanf</code> is a classic way to corrupt a variable.</li>
<li><strong>Read the "Use with" column with suspicion</strong> — it lists <code>%d</code> as usable with "char, int, short, long, long long". That is true of the <em>printed</em> value but not of the <em>address</em>: <code>scanf("%d", &amp;someShort)</code> writes four bytes into a two-byte variable and smashes whatever is next to it. Match the width exactly: <code>%hd</code> for <code>short</code>, <code>%ld</code> for <code>long</code>.</li>
</ul>
<table>
<tr><th>Specifier</th><th>Variable it must be given</th><th>Type <code>%d</code>-style input <code>5.3</code>, what happens</th></tr>
<tr><td><code>%c</code></td><td><code>char *</code></td><td>takes the very next byte, even <code>'\\n'</code> or a space</td></tr>
<tr><td><code>%d</code></td><td><code>int *</code></td><td>reads <code>5</code>, stops at <code>.</code>, leaves <code>.3</code> in the buffer, returns 1</td></tr>
<tr><td><code>%ld</code></td><td><code>long *</code></td><td>same, into a <code>long</code></td></tr>
<tr><td><code>%f</code></td><td><code>float *</code> ← <em>not</em> double</td><td>reads 5.3 into a 4-byte float</td></tr>
<tr><td><code>%lf</code></td><td><code>double *</code></td><td>reads 5.3 into an 8-byte double</td></tr>
<tr><td><code>%llf</code> (as printed on the slide)</td><td>— <strong>does not exist</strong></td><td>clang: "length modifier 'll' results in undefined behavior"; measured value stayed <strong>0.0000</strong></td></tr>
<tr><td><code>%Lf</code> (the real one)</td><td><code>long double *</code></td><td>measured: reads 2.5 correctly → <strong>2.5000</strong></td></tr>
</table>
<p class="dap-an">✅ The last two rows are a correction to the slide, measured rather than argued. The slide's bottom row says <code>%llf</code> ↔ <code>long double</code>. Compiling <code>scanf("%llf", &amp;ld)</code> gives the clang diagnostic <em>"length modifier 'll' results in undefined behavior or no effect with 'f' conversion specifier"</em>, and running it on input <code>2.5</code> left <code>ld</code> at <strong>0.0000</strong> while still returning 1 — the worst combination: it claims success and writes nothing. The standard spelling is <code>%Lf</code> (capital L), which on the same input measured <strong>2.5000</strong>. The slide also has a typo in the <code>%d</code> row, "long ong" for "long long".</p>
<p class="pitfall">⚠️ Also measured: <code>double d; scanf("%f", &amp;d);</code> with input <code>3.75</code> left <code>d</code> at its old value <strong>-1.000000</strong>. <code>scanf</code> wrote a 4-byte float into the first half of an 8-byte double, and the result is meaningless. The compiler <em>did</em> warn (<code>-Wformat</code>) — which is the entire argument for always building with <code>-Wall</code>.</p>`,
        `<p class="y-chinh">🎯 Bảng tra cứu của cả chương, với ô xanh phía dưới nói rõ <em>vì sao</em> nó tồn tại: "dữ liệu từ bàn phím được đưa vào bộ đệm dưới dạng ký tự (mã ASCII). Vậy nên conversion specifier là chỉ thị quy định cách chuyển dữ liệu ký tự thành dữ liệu có kiểu. <strong>Nếu specifier không khớp kiểu dữ liệu của biến thì phép chuyển đổi là sai.</strong>"</p>
<ul>
<li><strong>Specifier là một MỆNH LỆNH, không phải một cái nhãn</strong> — <code>%d</code> không <em>mô tả</em> biến của bạn; nó <em>ra lệnh</em> cho <code>scanf</code> đọc chữ hệ mười, dựng một <code>int</code> 4 byte và ghi vào địa chỉ bạn đưa. Nếu địa chỉ đó trỏ vào một <code>double</code> 8 byte thì lệnh vẫn được thi hành. Slide 44 cho xem đống đổ nát.</li>
<li><strong>Những hàng bạn thực sự dùng trong PRF192</strong> — <code>%c</code> (char), <code>%d</code> (int), <code>%ld</code> (long), <code>%f</code> (float), <code>%lf</code> (double). Phần còn lại trên slide (<code>%u</code>, <code>%o</code>, <code>%x</code>) là kiến thức nền nên nhận mặt, nhưng hiếm khi gõ.</li>
<li><strong><code>%*c</code> không phải một kiểu</strong> — slide xếp nó chung hàng với <code>%c</code>, mô tả là "bỏ một ký tự trong bộ đệm nhập". Dấu sao nghĩa là "chuyển đổi nhưng <em>không gán cho ai cả</em>". Nó là câu trả lời cho câu hỏi 4 của slide 42, và có hẳn một slide riêng ở số 47.</li>
<li><strong>Cái bẫy scanf/printf mà slide không nói</strong> — trong <code>scanf</code>, <code>%f</code> nghĩa là <code>float*</code> còn <code>%lf</code> nghĩa là <code>double*</code>; trong <code>printf</code>, <code>%f</code> in một <code>double</code> và <code>%lf</code> cũng thế. Vậy hai hàm KHÔNG dùng specifier giống hệt nhau, và bê một định dạng của <code>printf</code> sang <code>scanf</code> là cách kinh điển làm hỏng biến.</li>
<li><strong>Đọc cột "Use with" với con mắt nghi ngờ</strong> — nó ghi <code>%d</code> dùng được với "char, int, short, long, long long". Điều đó đúng với giá trị được <em>in ra</em>, nhưng sai với <em>địa chỉ</em>: <code>scanf("%d", &amp;someShort)</code> ghi bốn byte vào một biến hai byte và đập nát thứ nằm kế bên. Phải khớp đúng bề rộng: <code>%hd</code> cho <code>short</code>, <code>%ld</code> cho <code>long</code>.</li>
</ul>
<table>
<tr><th>Specifier</th><th>Bắt buộc đưa cho nó biến kiểu</th><th>Gõ <code>5.3</code> thì chuyện gì xảy ra</th></tr>
<tr><td><code>%c</code></td><td><code>char *</code></td><td>lấy đúng byte kế tiếp, kể cả <code>'\\n'</code> hay dấu cách</td></tr>
<tr><td><code>%d</code></td><td><code>int *</code></td><td>đọc <code>5</code>, dừng ở <code>.</code>, để lại <code>.3</code> trong bộ đệm, trả về 1</td></tr>
<tr><td><code>%ld</code></td><td><code>long *</code></td><td>y như trên, nhưng vào một <code>long</code></td></tr>
<tr><td><code>%f</code></td><td><code>float *</code> ← <em>không phải</em> double</td><td>đọc 5.3 vào một float 4 byte</td></tr>
<tr><td><code>%lf</code></td><td><code>double *</code></td><td>đọc 5.3 vào một double 8 byte</td></tr>
<tr><td><code>%llf</code> (như slide in)</td><td>— <strong>KHÔNG tồn tại</strong></td><td>clang: "length modifier 'll' results in undefined behavior"; đo được biến vẫn là <strong>0.0000</strong></td></tr>
<tr><td><code>%Lf</code> (bản thật)</td><td><code>long double *</code></td><td>đo được: đọc đúng 2.5 → <strong>2.5000</strong></td></tr>
</table>
<p class="dap-an">✅ Hai hàng cuối là một chỗ SỬA slide, đo thật chứ không lý luận suông. Hàng dưới cùng của slide ghi <code>%llf</code> ↔ <code>long double</code>. Biên dịch <code>scanf("%llf", &amp;ld)</code> thì clang báo <em>"length modifier 'll' results in undefined behavior or no effect with 'f' conversion specifier"</em>, và chạy với dữ liệu vào <code>2.5</code> thì <code>ld</code> vẫn nằm ở <strong>0.0000</strong> trong khi hàm vẫn trả về 1 — tổ hợp tệ nhất: báo thành công mà không ghi gì. Cách viết chuẩn là <code>%Lf</code> (chữ L hoa), và trên cùng dữ liệu vào đó đo được <strong>2.5000</strong>. Slide cũng có lỗi gõ ở hàng <code>%d</code>: "long ong" đáng lẽ là "long long".</p>
<p class="pitfall">⚠️ Cũng đo thật: <code>double d; scanf("%f", &amp;d);</code> với dữ liệu vào <code>3.75</code> để <code>d</code> nằm nguyên ở giá trị cũ <strong>-1.000000</strong>. <code>scanf</code> đã ghi một float 4 byte vào nửa đầu của một double 8 byte, và kết quả vô nghĩa. Trình biên dịch CÓ cảnh báo (<code>-Wformat</code>) — đó chính là toàn bộ lý do luôn phải dịch kèm <code>-Wall</code>.</p>`],

      [44, 'scanf(…): Conversion Specifiers (cont.) — two mismatches',
        `<p class="y-chinh">🎯 The slide proves the blue box of slide 43 with two programs side by side. Left: a <code>long</code> read with <code>%lf</code> → prints <strong>858993459</strong>. Right: a <code>double</code> read with <code>%ld</code> → prints <strong>0.000000</strong>. Both typed the same thing: <code>5.3</code>.</p>
<ul>
<li><strong>Left program — "The conversion specifier does not match the data type long"</strong> — <code>long x; scanf("%lf", &amp;x);</code>. <code>scanf</code> obeys <code>%lf</code>: it builds the 8-byte IEEE-754 pattern for 5.3 and writes it at <code>&amp;x</code>. Then <code>printf("%ld")</code> reads that pattern as an integer. Nothing is "wrong" at any single step; the steps just disagree about what the bytes mean.</li>
<li><strong>Where 858993459 comes from</strong> — 5.3 as a <code>double</code> is the bit pattern <code>0x4015333333333333</code>. On the 32-bit Dev-C++ used for the slide, <code>long</code> is 4 bytes, so <code>printf</code> saw only the low half, <code>0x33333333</code> = <strong>858993459</strong>. The number is not random; it is arithmetic.</li>
<li><strong>Right program — "does not match the data type double"</strong> — <code>double x; scanf("%ld", &amp;x);</code>. <code>scanf</code> reads the integer part <code>5</code> and stores a 4-byte or 8-byte integer at <code>&amp;x</code>. Read back as a <code>double</code>, the integer 5 is a denormal so tiny that <code>%lf</code> prints <strong>0.000000</strong>.</li>
<li><strong>Both programs "succeeded"</strong> — no crash, no error message, and <code>scanf</code> returned 1 in each case. This is why the return value alone is not validation; it tells you a field was consumed, not that your variable now holds something sensible.</li>
<li><strong>The compiler saw it and said so</strong> — under <code>-Wall</code>, clang reports <em>"format specifies type 'double *' but the argument has type 'long *'"</em> and even suggests the fix. Dev-C++'s default settings do not show this, which is the real reason the slide needed two screenshots to make the point.</li>
</ul>
<table>
<tr><th>Program</th><th>You type</th><th>scanf returns</th><th>Printed here (64-bit clang)</th><th>Printed on the slide (32-bit Dev-C++)</th></tr>
<tr><td><code>long x; scanf("%lf",&amp;x); printf("%ld")</code></td><td><code>5.3</code></td><td>1</td><td><strong>4617653287933653811</strong></td><td>858993459</td></tr>
<tr><td><code>double x; scanf("%ld",&amp;x); printf("%lf")</code></td><td><code>5.3</code></td><td>1</td><td><strong>0.000000</strong></td><td>0.000000</td></tr>
<tr><td><code>double x; scanf("%lf",&amp;x); printf("%lf")</code> (correct)</td><td><code>5.3</code></td><td>1</td><td>5.300000</td><td>5.300000</td></tr>
</table>
<p class="dap-an">✅ Measured with <code>cc -Wall -std=c99</code>. The right-hand program reproduced the slide exactly: <strong>0.000000</strong>. The left-hand one printed <strong>4617653287933653811</strong>, not the slide's 858993459 — and the difference is not a contradiction: 4617653287933653811 is <code>0x4015333333333333</code>, and 858993459 is <code>0x33333333</code>, its lower 32 bits. Same bytes, different <code>long</code> width (8 bytes here, 4 bytes in Dev-C++). The slide is right for its platform; the <em>bug</em> is identical on both.</p>
<p class="pitfall">⚠️ The lesson generalises beyond <code>scanf</code>: in C, a variable is an address plus an agreed interpretation of the bytes there. Nothing at run time checks that everyone agrees. The only guard you have is the compiler's <code>-Wformat</code> warning — so treat a warning as an error, and never silence it by adding a cast to <code>&amp;x</code>, which hides the problem instead of fixing it.</p>`,
        `<p class="y-chinh">🎯 Slide chứng minh ô xanh của slide 43 bằng hai chương trình đặt cạnh nhau. Trái: một <code>long</code> đọc bằng <code>%lf</code> → in ra <strong>858993459</strong>. Phải: một <code>double</code> đọc bằng <code>%ld</code> → in ra <strong>0.000000</strong>. Cả hai đều gõ đúng một thứ: <code>5.3</code>.</p>
<ul>
<li><strong>Chương trình trái — "specifier không khớp kiểu long"</strong> — <code>long x; scanf("%lf", &amp;x);</code>. <code>scanf</code> tuân lệnh <code>%lf</code>: nó dựng mẫu bit IEEE-754 8 byte của số 5.3 rồi ghi vào <code>&amp;x</code>. Sau đó <code>printf("%ld")</code> đọc mẫu bit ấy như một số nguyên. Không bước nào "sai" cả; chỉ là các bước không thống nhất với nhau về ý nghĩa của mấy byte đó.</li>
<li><strong>Con 858993459 ở đâu ra</strong> — số 5.3 dạng <code>double</code> là mẫu bit <code>0x4015333333333333</code>. Trên Dev-C++ 32-bit mà slide dùng, <code>long</code> chỉ 4 byte, nên <code>printf</code> chỉ nhìn thấy nửa thấp, <code>0x33333333</code> = <strong>858993459</strong>. Con số đó không ngẫu nhiên; nó là số học.</li>
<li><strong>Chương trình phải — "không khớp kiểu double"</strong> — <code>double x; scanf("%ld", &amp;x);</code>. <code>scanf</code> đọc phần nguyên <code>5</code> và cất một số nguyên tại <code>&amp;x</code>. Đọc lại như một <code>double</code> thì số nguyên 5 là một giá trị denormal nhỏ tới mức <code>%lf</code> in ra <strong>0.000000</strong>.</li>
<li><strong>Cả hai chương trình đều "thành công"</strong> — không sập, không báo lỗi, và <code>scanf</code> trả về 1 ở cả hai. Đó là lý do giá trị trả về MỘT MÌNH chưa phải là kiểm tra hợp lệ: nó nói một trường đã được tiêu thụ, không nói biến của bạn giờ đang chứa thứ có nghĩa.</li>
<li><strong>Trình biên dịch nhìn thấy và có nói</strong> — với <code>-Wall</code>, clang báo <em>"format specifies type 'double *' but the argument has type 'long *'"</em> và còn gợi ý cách sửa. Cấu hình mặc định của Dev-C++ không hiện cái này, và đó mới là lý do thật khiến slide phải cần tới hai ảnh chụp để nói điều đó.</li>
</ul>
<table>
<tr><th>Chương trình</th><th>Gõ vào</th><th>scanf trả về</th><th>In ra ở đây (clang 64-bit)</th><th>In ra trên slide (Dev-C++ 32-bit)</th></tr>
<tr><td><code>long x; scanf("%lf",&amp;x); printf("%ld")</code></td><td><code>5.3</code></td><td>1</td><td><strong>4617653287933653811</strong></td><td>858993459</td></tr>
<tr><td><code>double x; scanf("%ld",&amp;x); printf("%lf")</code></td><td><code>5.3</code></td><td>1</td><td><strong>0.000000</strong></td><td>0.000000</td></tr>
<tr><td><code>double x; scanf("%lf",&amp;x); printf("%lf")</code> (đúng)</td><td><code>5.3</code></td><td>1</td><td>5.300000</td><td>5.300000</td></tr>
</table>
<p class="dap-an">✅ Đo bằng <code>cc -Wall -std=c99</code>. Chương trình bên phải tái hiện y hệt slide: <strong>0.000000</strong>. Chương trình bên trái in ra <strong>4617653287933653811</strong> chứ không phải 858993459 của slide — và chênh lệch đó KHÔNG mâu thuẫn: 4617653287933653811 chính là <code>0x4015333333333333</code>, còn 858993459 là <code>0x33333333</code>, đúng 32 bit thấp của nó. Cùng một dãy byte, chỉ khác bề rộng của <code>long</code> (8 byte ở đây, 4 byte trong Dev-C++). Slide đúng với nền tảng của nó; còn <em>con bug</em> thì giống hệt nhau ở cả hai bên.</p>
<p class="pitfall">⚠️ Bài học vượt ra ngoài <code>scanf</code>: trong C, một biến là một địa chỉ CỘNG một thoả thuận về ý nghĩa mấy byte nằm ở đó. Lúc chạy chẳng có gì kiểm tra xem mọi bên có thoả thuận giống nhau không. Lá chắn duy nhất của bạn là cảnh báo <code>-Wformat</code> của trình biên dịch — hãy coi cảnh báo là lỗi, và đừng bao giờ bịt miệng nó bằng cách ép kiểu <code>&amp;x</code>, vì làm thế là giấu vấn đề chứ không phải sửa.</p>`],

      [45, 'scanf(…) function: Default Separators',
        `<p class="y-chinh">🎯 One rule with five members: "If an input value is a number led by a whitespace, <code>scanf</code> treats the whitespace as a separator. The whitespace characters include <strong>newline, horizontal tab, form feed, vertical tab and space</strong>." One program, three screenshots, same answer every time.</p>
<ul>
<li><strong>The demo program is the simplest possible</strong> — <code>int x, y; scanf("%d%d", &amp;x, &amp;y);</code> with no separator written between the two specifiers. The three screenshots show the user typing <code>8 6</code>, then <code>8</code>⏎<code>6</code>, then <code>8</code>⇥<code>6</code>, and <code>x=8, y=6</code> comes out of all three.</li>
<li><strong>What "skip whitespace" really means</strong> — before a numeric conversion, <code>scanf</code> throws away <em>any amount</em> of whitespace, including none at all, and including newlines left over from a previous line. That single behaviour is why <code>%d</code> almost never suffers from the slide-37 bug while <code>%c</code> always does.</li>
<li><strong>The exception, and it is the whole chapter</strong> — <code>%c</code> does <strong>not</strong> skip whitespace. Neither does <code>%[...]</code>. Everything else (<code>%d</code>, <code>%u</code>, <code>%f</code>, <code>%lf</code>, <code>%s</code>) does. If you can recite that exception you can predict every example in this deck.</li>
<li><strong>Whitespace in the <em>format string</em> is a separate rule</strong> — a blank inside the quotes does not mean "expect exactly one space", it means "skip any run of whitespace here, including none". That is why <code>scanf(" %c")</code> works as a fix on slide 39, and why <code>scanf("%d %d")</code> behaves identically to <code>scanf("%d%d")</code>.</li>
<li><strong>Consequence you can rely on</strong> — the user may spread the values over lines, pad them with tabs, or bunch them up; a numeric <code>scanf</code> does not care. What it <em>does</em> care about is the trailing newline, which stays in the buffer for the next read to trip over.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
int main(){
    int x, y;
    printf("Input x and y: ");
    scanf("%d%d", &amp;x, &amp;y);
    printf("x=%d, y=%d\\n", x, y);
    return 0;
}</code></pre>
<table>
<tr><th>What you type</th><th>scanf returns</th><th>x</th><th>y</th></tr>
<tr><td><code>8 6</code>⏎ (space)</td><td>2</td><td>8</td><td>6</td></tr>
<tr><td><code>8</code>⏎<code>6</code>⏎ (newline)</td><td>2</td><td>8</td><td>6</td></tr>
<tr><td><code>8</code>⇥<code>6</code>⏎ (tab)</td><td>2</td><td>8</td><td>6</td></tr>
<tr><td><code>&nbsp;&nbsp;&nbsp;8&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6&nbsp;&nbsp;</code>⏎ (leading and repeated)</td><td>2</td><td>8</td><td>6</td></tr>
</table>
<p class="dap-an">✅ All four rows measured with <code>cc -Wall -std=c99</code>; every one printed <code>x=8, y=6</code>. The fourth row is not on the slide and is the one worth remembering: leading spaces, multiple spaces and trailing spaces are all invisible to <code>%d</code>. The slide's three screenshots are three faces of one rule, not three special cases.</p>
<p class="meo">💡 Because whitespace is <em>skipped</em> rather than <em>required</em>, a numeric <code>scanf</code> in a loop reads a whole column of numbers typed any way the user likes. Remember the flip side, though: after the last number, the ENTER is still sitting there. That is the leftover every <code>%c</code> read after a <code>%d</code> read will swallow.</p>`,
        `<p class="y-chinh">🎯 Một luật với năm thành viên: "nếu một giá trị vào là số và có khoảng trắng đứng trước, <code>scanf</code> coi khoảng trắng đó là dấu tách. Các ký tự khoảng trắng gồm <strong>xuống dòng, tab ngang, sang trang, tab dọc và dấu cách</strong>." Một chương trình, ba ảnh chụp, lần nào cũng ra cùng một đáp số.</p>
<ul>
<li><strong>Chương trình minh hoạ đơn giản hết mức</strong> — <code>int x, y; scanf("%d%d", &amp;x, &amp;y);</code>, giữa hai specifier không viết dấu tách nào cả. Ba ảnh chụp cho thấy người dùng gõ <code>8 6</code>, rồi <code>8</code>⏎<code>6</code>, rồi <code>8</code>⇥<code>6</code>, và cả ba đều cho <code>x=8, y=6</code>.</li>
<li><strong>"Bỏ qua khoảng trắng" thực sự nghĩa là gì</strong> — trước một phép chuyển đổi số, <code>scanf</code> vứt bỏ <em>bao nhiêu</em> khoảng trắng cũng được, kể cả không có cái nào, và kể cả dấu xuống dòng còn sót từ dòng trước. Đúng một hành vi đó là lý do <code>%d</code> gần như không bao giờ dính con bug của slide 37 còn <code>%c</code> thì luôn dính.</li>
<li><strong>Ngoại lệ, và nó chính là cả chương này</strong> — <code>%c</code> <strong>không</strong> bỏ qua khoảng trắng. <code>%[...]</code> cũng không. Mọi thứ còn lại (<code>%d</code>, <code>%u</code>, <code>%f</code>, <code>%lf</code>, <code>%s</code>) thì có. Đọc thuộc được ngoại lệ đó là bạn đoán trước được mọi ví dụ trong bộ slide này.</li>
<li><strong>Khoảng trắng trong <em>chuỗi định dạng</em> lại là luật riêng</strong> — một dấu trắng trong ngoặc kép KHÔNG có nghĩa "chờ đúng một dấu cách", mà là "bỏ qua bao nhiêu khoảng trắng liền nhau ở đây cũng được, kể cả không có". Vì thế <code>scanf(" %c")</code> mới chữa được lỗi ở slide 39, và <code>scanf("%d %d")</code> hành xử hệt như <code>scanf("%d%d")</code>.</li>
<li><strong>Hệ quả bạn có thể tin cậy</strong> — người dùng gõ mỗi số một dòng, chèn tab, hay dồn sát nhau: <code>scanf</code> số học không quan tâm. Cái nó <em>có</em> để lại là dấu xuống dòng cuối cùng, nằm im trong bộ đệm chờ lần đọc sau vấp phải.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
int main(){
    int x, y;
    printf("Input x and y: ");
    scanf("%d%d", &amp;x, &amp;y);
    printf("x=%d, y=%d\\n", x, y);
    return 0;
}</code></pre>
<table>
<tr><th>Gõ gì</th><th>scanf trả về</th><th>x</th><th>y</th></tr>
<tr><td><code>8 6</code>⏎ (dấu cách)</td><td>2</td><td>8</td><td>6</td></tr>
<tr><td><code>8</code>⏎<code>6</code>⏎ (xuống dòng)</td><td>2</td><td>8</td><td>6</td></tr>
<tr><td><code>8</code>⇥<code>6</code>⏎ (tab)</td><td>2</td><td>8</td><td>6</td></tr>
<tr><td><code>&nbsp;&nbsp;&nbsp;8&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6&nbsp;&nbsp;</code>⏎ (khoảng trắng đầu và lặp)</td><td>2</td><td>8</td><td>6</td></tr>
</table>
<p class="dap-an">✅ Cả bốn hàng đều đo bằng <code>cc -Wall -std=c99</code>; hàng nào cũng in <code>x=8, y=6</code>. Hàng thứ tư không có trên slide và mới là hàng đáng nhớ: khoảng trắng đầu dòng, nhiều khoảng trắng liền nhau và khoảng trắng cuối đều VÔ HÌNH với <code>%d</code>. Ba ảnh chụp của slide là ba khuôn mặt của MỘT luật, không phải ba trường hợp đặc biệt.</p>
<p class="meo">💡 Vì khoảng trắng bị <em>bỏ qua</em> chứ không phải <em>bắt buộc</em>, một <code>scanf</code> số học đặt trong vòng lặp sẽ đọc được cả cột số dù người dùng gõ kiểu gì. Nhưng nhớ mặt kia của đồng xu: sau con số cuối, phím ENTER vẫn nằm đó. Đó chính là phần thừa mà mọi lần đọc <code>%c</code> sau một lần đọc <code>%d</code> sẽ nuốt phải.</p>`],

      [46, 'scanf(…) function: User-defined Separators',
        `<p class="y-chinh">🎯 Two sentences and two screenshots: "User can specify the character for separating input data" and "<strong>User-defined separators will override default separators</strong>". The moment you write a literal in the format string, whitespace stops being free.</p>
<ul>
<li><strong>The demo</strong> — <code>scanf("%d,%d&amp;%d", &amp;n, &amp;m, &amp;k);</code>. The comma and the ampersand are <em>literals</em>: the input must contain those exact characters, in those exact places. Type <code>10,20&amp;30</code> and the screenshot prints <code>10, 20, 30</code>.</li>
<li><strong>What "override" means in practice</strong> — the right-hand screenshot types <code>10,20 ,30</code> — one innocent space before the comma — and the output becomes <code>10, 20, 37</code>. The 37 is garbage: <code>k</code> was never written to. A space that would have been ignored under the default rule now breaks the match.</li>
<li><strong>Why the space breaks it</strong> — after reading 20, the format demands a literal <code>&amp;</code>. The next character in the buffer is a space. A non-whitespace literal in a format string matches <strong>only itself</strong>; it does not skip whitespace first. Mismatch → <code>scanf</code> stops and leaves the space in the buffer.</li>
<li><strong>The half-fix if you want tolerance</strong> — write the format as <code>"%d , %d &amp; %d"</code>. The blanks you add are whitespace instructions, so spaces around the separators become optional again while the comma and ampersand stay compulsory. The slide does not mention this, but it is exactly the rule of slide 45 applied deliberately.</li>
<li><strong>Where you meet this for real</strong> — reading a date as <code>dd/mm/yyyy</code> with <code>scanf("%d/%d/%d", &amp;d, &amp;m, &amp;y)</code>, or a CSV-ish line. Handy, and fragile: any user who types the separator differently gets a partially-filled set of variables and no error message unless you check the return value.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
int n;
int main()
{   int m, k;
    scanf("%d,%d&amp;%d", &amp;n, &amp;m, &amp;k);
    printf("%d, %d, %d\\n", n, m, k);
    return 0;
}</code></pre>
<table>
<tr><th>What you type</th><th>scanf returns</th><th>n</th><th>m</th><th>k</th></tr>
<tr><td><code>10,20&amp;30</code></td><td><strong>3</strong></td><td>10</td><td>20</td><td>30 ✔</td></tr>
<tr><td><code>10,20 ,30</code> (space before the comma)</td><td><strong>2</strong></td><td>10</td><td>20</td><td><em>never written</em> — garbage</td></tr>
<tr><td><code>10 , 20 &amp; 30</code> (spaces everywhere)</td><td><strong>1</strong></td><td>10</td><td><em>never written</em></td><td><em>never written</em></td></tr>
<tr><td><code>10;20&amp;30</code> (wrong separator)</td><td><strong>1</strong></td><td>10</td><td><em>never written</em></td><td><em>never written</em></td></tr>
</table>
<p class="dap-an">✅ All four rows measured with <code>cc -Wall -std=c99</code>, printing the return value alongside the variables. Row 2 reproduces the slide's right-hand screenshot: the slide shows <code>10, 20, 37</code> where 37 is whatever happened to be in memory — here the same slot held a different leftover, which is the honest meaning of "uninitialised". Rows 3 and 4 show the damage spreading backwards: one wrong character early on and <em>two</em> variables are left untouched, with the program cheerfully printing them.</p>
<p class="pitfall">⚠️ Notice that <strong>the printed value of an unwritten variable is meaningless but looks like data</strong>. If the program had checked <code>if (scanf(...) != 3)</code> — the lesson of slides 48–49 — every failing row above would have been caught immediately. User-defined separators without a return-value check is the most brittle input code in this course.</p>`,
        `<p class="y-chinh">🎯 Hai câu chữ và hai ảnh chụp: "người dùng có thể chỉ định ký tự để tách dữ liệu vào" và "<strong>dấu tách tự đặt sẽ ĐÈ LÊN dấu tách mặc định</strong>". Ngay khi bạn viết một ký tự hằng vào chuỗi định dạng, khoảng trắng hết được miễn phí.</p>
<ul>
<li><strong>Chương trình minh hoạ</strong> — <code>scanf("%d,%d&amp;%d", &amp;n, &amp;m, &amp;k);</code>. Dấu phẩy và dấu <code>&amp;</code> là <em>ký tự hằng</em>: dữ liệu vào phải chứa đúng những ký tự đó, đúng ở những chỗ đó. Gõ <code>10,20&amp;30</code> thì ảnh chụp in ra <code>10, 20, 30</code>.</li>
<li><strong>"Đè lên" trong thực tế nghĩa là gì</strong> — ảnh chụp bên phải gõ <code>10,20 ,30</code> — thêm đúng một dấu cách vô tội trước dấu phẩy — và kết quả thành <code>10, 20, 37</code>. Số 37 là rác: <code>k</code> chưa hề được ghi. Một dấu cách lẽ ra vô hại theo luật mặc định thì giờ làm vỡ phép khớp.</li>
<li><strong>Vì sao dấu cách làm vỡ</strong> — đọc xong 20, chuỗi định dạng đòi một ký tự hằng <code>&amp;</code>. Ký tự kế tiếp trong bộ đệm lại là dấu cách. Một ký tự hằng KHÔNG PHẢI khoảng trắng chỉ khớp <strong>với chính nó</strong>; nó không bỏ qua khoảng trắng trước. Không khớp → <code>scanf</code> dừng và để dấu cách nằm lại trong bộ đệm.</li>
<li><strong>Cách chữa nửa vời nếu bạn muốn dễ tính hơn</strong> — viết định dạng thành <code>"%d , %d &amp; %d"</code>. Mấy dấu trắng bạn thêm vào là chỉ thị khoảng trắng, nên dấu cách quanh dấu tách trở lại thành tuỳ chọn, còn dấu phẩy và dấu <code>&amp;</code> vẫn bắt buộc. Slide không nói điều này, nhưng đó đúng là luật của slide 45 được dùng có chủ đích.</li>
<li><strong>Bạn gặp nó thật ở đâu</strong> — đọc một ngày dạng <code>dd/mm/yyyy</code> bằng <code>scanf("%d/%d/%d", &amp;d, &amp;m, &amp;y)</code>, hay một dòng kiểu CSV. Tiện, và mong manh: người dùng nào gõ dấu tách khác đi là nhận về một bộ biến điền dở dang mà không một lời báo lỗi, trừ khi bạn kiểm giá trị trả về.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
int n;
int main()
{   int m, k;
    scanf("%d,%d&amp;%d", &amp;n, &amp;m, &amp;k);
    printf("%d, %d, %d\\n", n, m, k);
    return 0;
}</code></pre>
<table>
<tr><th>Gõ gì</th><th>scanf trả về</th><th>n</th><th>m</th><th>k</th></tr>
<tr><td><code>10,20&amp;30</code></td><td><strong>3</strong></td><td>10</td><td>20</td><td>30 ✔</td></tr>
<tr><td><code>10,20 ,30</code> (một dấu cách trước dấu phẩy)</td><td><strong>2</strong></td><td>10</td><td>20</td><td><em>chưa hề được ghi</em> — rác</td></tr>
<tr><td><code>10 , 20 &amp; 30</code> (dấu cách khắp nơi)</td><td><strong>1</strong></td><td>10</td><td><em>chưa hề được ghi</em></td><td><em>chưa hề được ghi</em></td></tr>
<tr><td><code>10;20&amp;30</code> (sai dấu tách)</td><td><strong>1</strong></td><td>10</td><td><em>chưa hề được ghi</em></td><td><em>chưa hề được ghi</em></td></tr>
</table>
<p class="dap-an">✅ Cả bốn hàng đo bằng <code>cc -Wall -std=c99</code>, in giá trị trả về cùng với các biến. Hàng 2 tái hiện ảnh chụp bên phải của slide: slide hiện <code>10, 20, 37</code> trong đó 37 là thứ tình cờ còn nằm trong bộ nhớ — ở đây cùng ô đó lại giữ một giá trị thừa khác, và đó là ý nghĩa trung thực của chữ "chưa khởi tạo". Hàng 3 và 4 cho thấy thiệt hại lan ngược: sai một ký tự từ sớm là <em>hai</em> biến không được đụng tới, mà chương trình vẫn hồn nhiên in chúng ra.</p>
<p class="pitfall">⚠️ Để ý rằng <strong>giá trị in ra của một biến chưa được ghi thì vô nghĩa nhưng TRÔNG y như dữ liệu</strong>. Nếu chương trình có kiểm <code>if (scanf(...) != 3)</code> — bài học của slide 48–49 — thì mọi hàng hỏng ở trên đã bị bắt ngay lập tức. Dấu tách tự đặt mà không kiểm giá trị trả về là đoạn mã nhập liệu mong manh nhất của cả môn.</p>`],

      [47, 'scanf(…) function: Using %*c for removing a character',
        `<p class="y-chinh">🎯 Six little programs on one slide, all variations of "read a number then a character", showing that <code>%*c</code> <strong>reads one character and throws it away</strong> — no variable, no <code>clear()</code> function, no <code>&amp;</code> argument.</p>
<ul>
<li><strong>The star means "suppress assignment"</strong> — <code>scanf</code> performs the conversion normally and then discards the result instead of storing it. Because nothing is stored, <code>%*c</code> consumes no argument: <code>scanf("%d%*c%c", &amp;n, &amp;c)</code> has three specifiers but only two pointers. Counting specifiers to count arguments is how students get this wrong.</li>
<li><strong>Top-left, the baseline</strong> — <code>scanf("%d%c", &amp;n, &amp;c)</code> with input <code>70D</code> gives <code>70, D</code>. It works only because the user typed the two items with nothing between them.</li>
<li><strong>Top-middle, the failure</strong> — same program, input <code>70</code> then ENTER. The slide draws the <code>'\\n'</code> in a yellow box being handed to <code>c</code>, and the output shows <code>70,</code> followed by a blank line. This is the slide-37 bug again, now inside a single <code>scanf</code> call.</li>
<li><strong>Top-right and the bottom row, the fix</strong> — <code>scanf("%d%*c%c", &amp;n, &amp;c)</code>. Whatever single character sits between the number and the one you want — a space, a newline, even a stray <code>P</code> — is eaten by <code>%*c</code> and <code>c</code> receives <code>D</code> in all three cases.</li>
<li><strong>Bottom-right, mixing the two functions</strong> — <code>scanf("%d%*c", &amp;n); c = getchar();</code>. Same result, and it is the cleanest reading of the intent: "read the number, drop the separator, now fetch a character". It also shows <code>scanf</code> and <code>getchar()</code> sharing one buffer, as slide 34 said.</li>
</ul>
<pre><code>int n; char c;

scanf("%d%c",   &amp;n, &amp;c);   /* c nhận NGAY ký tự kế tiếp — kể cả '\\n' */
scanf("%d%*c%c", &amp;n, &amp;c);  /* bỏ MỘT ký tự rồi mới lấy c            */
scanf("%d%*c",  &amp;n); c = getchar();  /* cùng ý, viết tách ra         */</code></pre>
<table>
<tr><th>Format</th><th>You type</th><th>scanf returns</th><th>c receives</th></tr>
<tr><td><code>"%d%c"</code></td><td><code>70D</code></td><td>2</td><td><code>D</code> (68)</td></tr>
<tr><td><code>"%d%c"</code></td><td><code>70</code>⏎</td><td>2</td><td><strong><code>\\n</code> (10)</strong> — the bug</td></tr>
<tr><td><code>"%d%c"</code></td><td><code>70 D</code></td><td>2</td><td><strong><code>' '</code> (32)</strong> — the space, not the D</td></tr>
<tr><td><code>"%d%*c%c"</code></td><td><code>70 D</code></td><td><strong>2</strong></td><td><code>D</code> (68) ✔</td></tr>
<tr><td><code>"%d%*c%c"</code></td><td><code>70</code>⏎<code>D</code></td><td><strong>2</strong></td><td><code>D</code> (68) ✔</td></tr>
<tr><td><code>"%d%*c%c"</code></td><td><code>70PD</code></td><td><strong>2</strong></td><td><code>D</code> (68) — the <code>P</code> was eaten</td></tr>
<tr><td><code>"%d%*c"</code> + <code>getchar()</code></td><td><code>70</code>⏎<code>D</code></td><td><strong>1</strong></td><td><code>D</code> (68) ✔</td></tr>
</table>
<p class="dap-an">✅ All seven rows measured with <code>cc -Wall -std=c99</code> and the return value printed. Two results deserve attention. First, row 3 is <em>not</em> on the slide and is the trap students actually hit: <code>"%d%c"</code> with <code>70 D</code> gives <code>c = ' '</code>, a space, which prints as nothing and looks like the program lost the input. Second, compare the returns: <code>"%d%*c%c"</code> returns <strong>2</strong>, not 3, and <code>"%d%*c"</code> returns <strong>1</strong>, not 2 — exactly as slide 48 will state: "the return code from scanf does not reflect success of %* conversions".</p>
<p class="meo">💡 Three tools now solve the same leftover-newline problem, and they are not interchangeable: <code>%*c</code> drops <strong>exactly one</strong> character, <code>" %c"</code> skips <strong>any amount of whitespace</strong> but nothing else, and <code>clear()</code> drops <strong>everything to the end of the line</strong>. Row 6 shows why the difference matters — <code>%*c</code> silently ate a real letter <code>P</code> that a human typed by mistake.</p>`,
        `<p class="y-chinh">🎯 Sáu chương trình nhỏ trên một slide, đều là biến thể của "đọc một số rồi một ký tự", cho thấy <code>%*c</code> <strong>đọc một ký tự rồi vứt đi</strong> — không cần biến, không cần hàm <code>clear()</code>, không cần đối số <code>&amp;</code>.</p>
<ul>
<li><strong>Dấu sao nghĩa là "chặn phép gán"</strong> — <code>scanf</code> vẫn thực hiện phép chuyển đổi như thường rồi vứt kết quả thay vì cất đi. Vì không cất gì nên <code>%*c</code> KHÔNG ăn đối số nào: <code>scanf("%d%*c%c", &amp;n, &amp;c)</code> có ba specifier nhưng chỉ hai con trỏ. Đếm specifier để suy ra số đối số chính là chỗ sinh viên hay sai.</li>
<li><strong>Trên-trái, bản gốc</strong> — <code>scanf("%d%c", &amp;n, &amp;c)</code> với dữ liệu vào <code>70D</code> cho <code>70, D</code>. Nó chạy được chỉ vì người dùng gõ hai mục dính liền nhau, không có gì ở giữa.</li>
<li><strong>Trên-giữa, lúc hỏng</strong> — cùng chương trình đó, gõ <code>70</code> rồi ENTER. Slide vẽ ký tự <code>'\\n'</code> trong ô vàng được trao cho <code>c</code>, và kết quả in ra <code>70,</code> rồi một dòng trống. Đây lại đúng là con bug của slide 37, lần này nằm gọn trong MỘT lời gọi <code>scanf</code>.</li>
<li><strong>Trên-phải và cả hàng dưới, cách chữa</strong> — <code>scanf("%d%*c%c", &amp;n, &amp;c)</code>. Bất kể ký tự đơn nào chen giữa con số và ký tự bạn cần — dấu cách, dấu xuống dòng, thậm chí một chữ <code>P</code> lạc — đều bị <code>%*c</code> ăn mất, và <code>c</code> nhận <code>D</code> ở cả ba trường hợp.</li>
<li><strong>Dưới-phải, trộn hai hàm</strong> — <code>scanf("%d%*c", &amp;n); c = getchar();</code>. Cùng kết quả, và đọc ra ý định sạch nhất: "đọc con số, bỏ dấu tách, giờ lấy một ký tự". Nó cũng cho thấy <code>scanf</code> và <code>getchar()</code> dùng chung MỘT bộ đệm, đúng như slide 34 đã nói.</li>
</ul>
<pre><code>int n; char c;

scanf("%d%c",   &amp;n, &amp;c);   /* c nhận NGAY ký tự kế tiếp — kể cả '\\n' */
scanf("%d%*c%c", &amp;n, &amp;c);  /* bỏ MỘT ký tự rồi mới lấy c            */
scanf("%d%*c",  &amp;n); c = getchar();  /* cùng ý, viết tách ra         */</code></pre>
<table>
<tr><th>Định dạng</th><th>Gõ gì</th><th>scanf trả về</th><th>c nhận giá trị gì</th></tr>
<tr><td><code>"%d%c"</code></td><td><code>70D</code></td><td>2</td><td><code>D</code> (68)</td></tr>
<tr><td><code>"%d%c"</code></td><td><code>70</code>⏎</td><td>2</td><td><strong><code>\\n</code> (10)</strong> — con bug</td></tr>
<tr><td><code>"%d%c"</code></td><td><code>70 D</code></td><td>2</td><td><strong><code>' '</code> (32)</strong> — DẤU CÁCH, không phải chữ D</td></tr>
<tr><td><code>"%d%*c%c"</code></td><td><code>70 D</code></td><td><strong>2</strong></td><td><code>D</code> (68) ✔</td></tr>
<tr><td><code>"%d%*c%c"</code></td><td><code>70</code>⏎<code>D</code></td><td><strong>2</strong></td><td><code>D</code> (68) ✔</td></tr>
<tr><td><code>"%d%*c%c"</code></td><td><code>70PD</code></td><td><strong>2</strong></td><td><code>D</code> (68) — chữ <code>P</code> bị ăn mất</td></tr>
<tr><td><code>"%d%*c"</code> + <code>getchar()</code></td><td><code>70</code>⏎<code>D</code></td><td><strong>1</strong></td><td><code>D</code> (68) ✔</td></tr>
</table>
<p class="dap-an">✅ Cả bảy hàng đều đo bằng <code>cc -Wall -std=c99</code> và có in kèm giá trị trả về. Hai kết quả đáng chú ý. Thứ nhất, hàng 3 <em>không</em> có trên slide và mới là cái bẫy sinh viên thực sự vấp: <code>"%d%c"</code> với <code>70 D</code> cho <code>c = ' '</code>, một dấu cách, in ra thì chẳng thấy gì và trông như chương trình làm mất dữ liệu. Thứ hai, hãy so các giá trị trả về: <code>"%d%*c%c"</code> trả về <strong>2</strong> chứ không phải 3, và <code>"%d%*c"</code> trả về <strong>1</strong> chứ không phải 2 — đúng y điều slide 48 sắp nói: "giá trị trả về của scanf không phản ánh thành công của các phép chuyển đổi %*".</p>
<p class="meo">💡 Giờ đã có ba công cụ cùng giải bài toán dấu xuống dòng thừa, và chúng KHÔNG thay thế được cho nhau: <code>%*c</code> bỏ <strong>đúng một</strong> ký tự, <code>" %c"</code> bỏ <strong>bao nhiêu khoảng trắng cũng được</strong> nhưng chỉ khoảng trắng, còn <code>clear()</code> bỏ <strong>mọi thứ tới hết dòng</strong>. Hàng 6 cho thấy vì sao khác biệt đó quan trọng — <code>%*c</code> đã âm thầm ăn mất một chữ cái thật, chữ <code>P</code> mà người dùng gõ nhầm.</p>`],

      [48, 'scanf(…) function: Number of data fields are inputted',
        `<p class="y-chinh">🎯 The single most useful sentence about <code>scanf</code>: it "returns <strong>the number of addresses successfully filled</strong>, or EOF" — not the value it read, not 0/1 for success, but a count.</p>
<ul>
<li><strong>The full ladder, as the slide lists it</strong> — "0 indicates that scanf did not fill any address; 1 indicates that scanf filled the first address successfully; 2 indicates that scanf filled the first and second addresses successfully; …"</li>
<li><strong>EOF is different in kind</strong> — "EOF (-1) indicates that scanf did not fill any address <strong>AND</strong> encountered an end of data character". So 0 means "the user typed something unusable"; -1 means "there is no user any more". A retry loop must treat them differently: retry on 0, give up on -1.</li>
<li><strong>The <code>%*</code> footnote</strong> — "The return code from scanf does not reflect success of %* conversions." Measured on slide 47: <code>"%d%*c%c"</code> returns 2, and <code>"%d%*c"</code> returns 1. Suppressed conversions are invisible in the count, which is consistent — they filled no address.</li>
<li><strong>Why "number of fields" and not "was it OK"</strong> — the count tells you <em>where</em> the input went wrong, not just <em>that</em> it did. With <code>scanf("%d%d%d", …)</code> returning 2 you know the third value is missing and the first two are good, which is enough to write a precise error message.</li>
<li><strong>The rule to apply for the rest of your life</strong> — compare the return value against the number of specifiers you expected to fill: <code>if (scanf("%d", &amp;n) != 1) { /* handle it */ }</code>. Ignoring the return value is the root cause of most of the weird behaviour in slides 44, 46 and 49.</li>
</ul>
<pre><code>int n;
if (scanf("%d", &amp;n) != 1) {          /* 0 = rác, -1 = hết dữ liệu vào */
    printf("Khong doc duoc so nguyen!\\n");
    /* ...và PHẢI dọn bộ đệm trước khi thử lại — xem slide 50 */
} else {
    printf("n = %d\\n", n);
}</code></pre>
<table>
<tr><th>Format</th><th>You type</th><th>Return</th><th>Meaning</th></tr>
<tr><td><code>"%d"</code></td><td><code>42</code>⏎</td><td><strong>1</strong></td><td>the one address was filled</td></tr>
<tr><td><code>"%d"</code></td><td><code>abc</code>⏎</td><td><strong>0</strong></td><td>nothing filled; <code>n</code> keeps its old value; <code>abc</code> still in the buffer</td></tr>
<tr><td><code>"%d"</code></td><td>Ctrl+D / Ctrl+Z</td><td><strong>-1</strong></td><td>EOF — no data will ever come</td></tr>
<tr><td><code>"%d%*c%c"</code></td><td><code>70 D</code></td><td><strong>2</strong></td><td>the <code>%*c</code> is not counted</td></tr>
</table>
<p class="dap-an">✅ All four measured with <code>cc -Wall -std=c99</code>, printing the return value and the variable. Row 2 is the one worth internalising: with input <code>abc</code>, <code>n</code> was still <strong>-999</strong>, the value it had before the call. <code>scanf</code> did not zero it, did not touch it, and did not complain. If you print <code>n</code> after an unchecked failed read, you are printing whatever was in that memory before — which is exactly the "37" on the slide-46 screenshot.</p>
<p class="meo">💡 A useful way to remember it: <code>scanf</code> answers the question "<em>how many of my variables did you manage to fill?</em>", not "<em>did it work?</em>" and not "<em>what did you read?</em>". Slide 49 turns that answer into five measurable cases, and slides 51–52 turn it into a reusable function.</p>`,
        `<p class="y-chinh">🎯 Câu hữu ích nhất về <code>scanf</code>: nó "trả về <strong>SỐ ĐỊA CHỈ được điền thành công</strong>, hoặc EOF" — không phải giá trị vừa đọc, không phải 0/1 báo thành bại, mà là một CON ĐẾM.</p>
<ul>
<li><strong>Cả cái thang, đúng như slide liệt kê</strong> — "0 nghĩa là scanf không điền được địa chỉ nào; 1 nghĩa là scanf điền thành công địa chỉ thứ nhất; 2 nghĩa là điền thành công địa chỉ thứ nhất và thứ hai; …"</li>
<li><strong>EOF khác về BẢN CHẤT</strong> — "EOF (-1) nghĩa là scanf không điền được địa chỉ nào <strong>VÀ</strong> gặp ký tự kết thúc dữ liệu". Vậy 0 nghĩa là "người dùng gõ thứ không dùng được"; còn -1 nghĩa là "không còn người dùng nào nữa". Vòng lặp nhập lại phải đối xử khác nhau: 0 thì thử lại, -1 thì bỏ cuộc.</li>
<li><strong>Dòng chú về <code>%*</code></strong> — "giá trị trả về của scanf không phản ánh thành công của các phép chuyển đổi %*". Đo ở slide 47: <code>"%d%*c%c"</code> trả về 2, còn <code>"%d%*c"</code> trả về 1. Phép chuyển đổi bị chặn gán thì vô hình trong con đếm, mà như vậy là nhất quán — chúng có điền địa chỉ nào đâu.</li>
<li><strong>Vì sao là "số trường" chứ không phải "có ổn không"</strong> — con đếm cho bạn biết dữ liệu vào hỏng <em>ở đâu</em>, chứ không chỉ là <em>có hỏng</em>. Với <code>scanf("%d%d%d", …)</code> trả về 2, bạn biết giá trị thứ ba thiếu còn hai giá trị đầu tốt — đủ để viết một câu báo lỗi chính xác.</li>
<li><strong>Quy tắc dùng suốt đời</strong> — đem giá trị trả về so với số specifier bạn mong được điền: <code>if (scanf("%d", &amp;n) != 1) { /* xử lý */ }</code>. Bỏ qua giá trị trả về chính là gốc rễ của phần lớn những hành vi kỳ quặc ở slide 44, 46 và 49.</li>
</ul>
<pre><code>int n;
if (scanf("%d", &amp;n) != 1) {          /* 0 = rác, -1 = hết dữ liệu vào */
    printf("Khong doc duoc so nguyen!\\n");
    /* ...và PHẢI dọn bộ đệm trước khi thử lại — xem slide 50 */
} else {
    printf("n = %d\\n", n);
}</code></pre>
<table>
<tr><th>Định dạng</th><th>Gõ gì</th><th>Trả về</th><th>Nghĩa là gì</th></tr>
<tr><td><code>"%d"</code></td><td><code>42</code>⏎</td><td><strong>1</strong></td><td>một địa chỉ duy nhất đã được điền</td></tr>
<tr><td><code>"%d"</code></td><td><code>abc</code>⏎</td><td><strong>0</strong></td><td>không điền gì; <code>n</code> giữ nguyên giá trị cũ; <code>abc</code> vẫn nằm trong bộ đệm</td></tr>
<tr><td><code>"%d"</code></td><td>Ctrl+D / Ctrl+Z</td><td><strong>-1</strong></td><td>EOF — sẽ không bao giờ có dữ liệu nữa</td></tr>
<tr><td><code>"%d%*c%c"</code></td><td><code>70 D</code></td><td><strong>2</strong></td><td>phần <code>%*c</code> KHÔNG được tính</td></tr>
</table>
<p class="dap-an">✅ Cả bốn đều đo bằng <code>cc -Wall -std=c99</code>, có in giá trị trả về lẫn biến. Hàng 2 mới là hàng đáng thuộc: với dữ liệu vào <code>abc</code>, biến <code>n</code> vẫn là <strong>-999</strong>, đúng giá trị nó có trước lời gọi. <code>scanf</code> không gán 0, không đụng tới, và cũng không kêu ca gì. Nếu bạn in <code>n</code> sau một lần đọc hỏng mà không kiểm, tức là bạn đang in thứ nằm sẵn trong ô nhớ đó — chính là con "37" trên ảnh chụp của slide 46.</p>
<p class="meo">💡 Một cách nhớ dễ: <code>scanf</code> trả lời câu hỏi "<em>anh điền giúp tôi được MẤY biến?</em>", chứ không phải "<em>có chạy được không?</em>" và cũng không phải "<em>anh đọc được cái gì?</em>". Slide 49 biến câu trả lời đó thành năm trường hợp đo được, còn slide 51–52 biến nó thành một hàm dùng lại được.</p>`],

      [49, 'Number of data fields are inputted (cont.)',
        `<p class="y-chinh">🎯 One program, five screenshots, five return values. <code>count = scanf("%d%d%lf", &amp;m, &amp;n, &amp;x);</code> and the console shows count going <strong>-1, 0, 1, 2, 3</strong> as the input gets progressively more valid. This is slide 48 turned into evidence.</p>
<ul>
<li><strong>The program</strong> — three specifiers, three addresses, then <code>printf("count=%d, m=%d, n=%d, x=%lf\\n", count, m, n, x);</code>. Everything is printed every time, including variables that were never filled, which is precisely what makes the screenshots instructive.</li>
<li><strong>Screenshot <code>^Z</code> → count=-1</strong> — the user pressed Ctrl+Z (EOF on Windows) before typing anything. Nothing was filled, and <code>m=2, n=37, x=0.000000</code> are leftovers, not data.</li>
<li><strong>Screenshot <code>asjklfghjk</code> → count=0</strong> — the very first <code>%d</code> met a letter. <code>scanf</code> stopped immediately, left the whole word in the buffer, and filled nothing. Note the same <code>m=2, n=37</code> appear: identical garbage, so it is clearly not coming from the input.</li>
<li><strong>Screenshot <code>12dfghjkl;</code> → count=1, m=12</strong> — the first conversion succeeded and stopped at <code>d</code>. Partial success is the normal case, not an exotic one, and it is why "did it work" is the wrong question.</li>
<li><strong>Screenshots <code>12 789 asd</code> → count=2 and <code>12 789 12.7803</code> → count=3</strong> — the ladder climbs one rung at a time as each field becomes readable, and only the last row has all three variables holding what the user meant.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
int main()
{   int m = 2, n = 37; double x = 0.0;   /* giá trị cũ, để thấy cái gì KHÔNG bị ghi đè */
    int count;
    count = scanf("%d%d%lf", &amp;m, &amp;n, &amp;x);
    printf("count=%d, m=%d, n=%d, x=%lf\\n", count, m, n, x);
    return 0;
}</code></pre>
<table>
<tr><th>What you type</th><th>count</th><th>m</th><th>n</th><th>x</th></tr>
<tr><td>Ctrl+Z / Ctrl+D (no input at all)</td><td><strong>-1</strong></td><td>2 (old)</td><td>37 (old)</td><td>0.000000 (old)</td></tr>
<tr><td><code>asjklfghjk</code></td><td><strong>0</strong></td><td>2 (old)</td><td>37 (old)</td><td>0.000000 (old)</td></tr>
<tr><td><code>12dfghjkl;</code></td><td><strong>1</strong></td><td><strong>12</strong></td><td>37 (old)</td><td>0.000000 (old)</td></tr>
<tr><td><code>12 789 asd</code></td><td><strong>2</strong></td><td><strong>12</strong></td><td><strong>789</strong></td><td>0.000000 (old)</td></tr>
<tr><td><code>12 789 12.7803</code></td><td><strong>3</strong></td><td><strong>12</strong></td><td><strong>789</strong></td><td><strong>12.780300</strong></td></tr>
</table>
<p class="dap-an">✅ All five rows measured with <code>cc -Wall -std=c99</code> and they reproduce the slide's five screenshots exactly, count for count and value for value. One honest note: to make the "old value" column meaningful I initialised <code>m = 2, n = 37, x = 0.0</code> deliberately. On the slide those same numbers are <em>uninitialised</em> garbage that happened to be 2 and 37 — the agreement is a coincidence of that machine, and on yours the untouched columns may show anything at all. The pattern that <strong>is</strong> guaranteed is the staircase: count = the number of leading fields that converted, and everything after the failure point is untouched.</p>
<p class="pitfall">⚠️ Reading this table left to right shows the design flaw in unchecked input: rows 1–4 all <em>print</em> three numbers, and four of the five rows are lying about at least one of them. There is no visual difference between a real 37 and a leftover 37. Only <code>count</code> can tell you, and only if you look at it.</p>`,
        `<p class="y-chinh">🎯 Một chương trình, năm ảnh chụp, năm giá trị trả về. <code>count = scanf("%d%d%lf", &amp;m, &amp;n, &amp;x);</code> và màn hình cho thấy count lần lượt là <strong>-1, 0, 1, 2, 3</strong> khi dữ liệu vào ngày càng hợp lệ hơn. Đây là slide 48 biến thành bằng chứng.</p>
<ul>
<li><strong>Chương trình</strong> — ba specifier, ba địa chỉ, rồi <code>printf("count=%d, m=%d, n=%d, x=%lf\\n", count, m, n, x);</code>. Lần nào cũng in ra hết, kể cả những biến chưa hề được điền — mà chính điều đó làm mấy ảnh chụp trở nên đắt giá.</li>
<li><strong>Ảnh <code>^Z</code> → count=-1</strong> — người dùng bấm Ctrl+Z (EOF trên Windows) trước khi gõ gì. Không có gì được điền, và <code>m=2, n=37, x=0.000000</code> là đồ thừa, không phải dữ liệu.</li>
<li><strong>Ảnh <code>asjklfghjk</code> → count=0</strong> — ngay <code>%d</code> đầu tiên đã gặp chữ cái. <code>scanf</code> dừng tức khắc, để nguyên cả từ trong bộ đệm, và không điền gì. Để ý vẫn đúng <code>m=2, n=37</code> xuất hiện: rác y hệt nhau, nên rõ ràng chúng không tới từ dữ liệu vào.</li>
<li><strong>Ảnh <code>12dfghjkl;</code> → count=1, m=12</strong> — phép chuyển đổi đầu thành công rồi dừng ở chữ <code>d</code>. Thành công một phần là trường hợp BÌNH THƯỜNG, không phải hiếm gặp, và đó là lý do "có chạy không" là câu hỏi sai.</li>
<li><strong>Ảnh <code>12 789 asd</code> → count=2 và <code>12 789 12.7803</code> → count=3</strong> — cái thang leo từng nấc một khi mỗi trường trở nên đọc được, và chỉ hàng cuối cùng mới có cả ba biến giữ đúng thứ người dùng định nhập.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
int main()
{   int m = 2, n = 37; double x = 0.0;   /* giá trị cũ, để thấy cái gì KHÔNG bị ghi đè */
    int count;
    count = scanf("%d%d%lf", &amp;m, &amp;n, &amp;x);
    printf("count=%d, m=%d, n=%d, x=%lf\\n", count, m, n, x);
    return 0;
}</code></pre>
<table>
<tr><th>Gõ gì</th><th>count</th><th>m</th><th>n</th><th>x</th></tr>
<tr><td>Ctrl+Z / Ctrl+D (không gõ gì cả)</td><td><strong>-1</strong></td><td>2 (cũ)</td><td>37 (cũ)</td><td>0.000000 (cũ)</td></tr>
<tr><td><code>asjklfghjk</code></td><td><strong>0</strong></td><td>2 (cũ)</td><td>37 (cũ)</td><td>0.000000 (cũ)</td></tr>
<tr><td><code>12dfghjkl;</code></td><td><strong>1</strong></td><td><strong>12</strong></td><td>37 (cũ)</td><td>0.000000 (cũ)</td></tr>
<tr><td><code>12 789 asd</code></td><td><strong>2</strong></td><td><strong>12</strong></td><td><strong>789</strong></td><td>0.000000 (cũ)</td></tr>
<tr><td><code>12 789 12.7803</code></td><td><strong>3</strong></td><td><strong>12</strong></td><td><strong>789</strong></td><td><strong>12.780300</strong></td></tr>
</table>
<p class="dap-an">✅ Cả năm hàng đều đo bằng <code>cc -Wall -std=c99</code> và tái hiện chính xác năm ảnh chụp của slide, đúng từng con count và từng giá trị. Một ghi chú trung thực: để cột "giá trị cũ" có nghĩa, tôi khởi tạo cố ý <code>m = 2, n = 37, x = 0.0</code>. Trên slide, đúng mấy con số đó là rác <em>chưa khởi tạo</em> tình cờ bằng 2 và 37 — sự trùng khớp là chuyện may của máy đó, còn trên máy bạn mấy cột không bị đụng tới có thể hiện bất cứ gì. Thứ <strong>được</strong> bảo đảm là cái cầu thang: count = số trường đầu tiên chuyển đổi được, và mọi thứ sau điểm hỏng đều không bị đụng tới.</p>
<p class="pitfall">⚠️ Đọc bảng này từ trái sang phải là thấy ngay khuyết tật thiết kế của việc nhập liệu không kiểm: hàng 1–4 đều <em>in ra</em> ba con số, và bốn trên năm hàng đang nói dối về ít nhất một con. Không có khác biệt thị giác nào giữa một số 37 thật và một số 37 thừa. Chỉ <code>count</code> nói cho bạn biết được, và chỉ khi bạn chịu nhìn nó.</p>`],

      [50, '4 - Input Validation',
        `<p class="y-chinh">🎯 The slide states the premise honestly — "<strong>We cannot predict how the user will input the data values</strong>" — and then names the four things your code must trap: <strong>invalid characters, trailing characters, out-of-range input, incorrect number of input fields</strong>.</p>
<ul>
<li><strong>Three kinds of user, one kind of code</strong> — the slide lists them: the user may not enter data as requested, "one user may make a mistake", or "another user may simply try to break the program". Your program cannot tell these apart, so it must be equally polite to all three.</li>
<li><strong>Invalid characters</strong> — letters where a number belongs. Detected by the return value: <code>scanf("%d", &amp;n)</code> gives <strong>0</strong>. And remember slide 41: the offending characters are still in the buffer, so you must clear them or the next attempt reads the same rubbish.</li>
<li><strong>Trailing characters</strong> — <code>7.5</code> typed where an integer was expected. <code>scanf("%d")</code> happily takes the <code>7</code> and returns 1, so the return value alone says "fine". You catch this by reading the <em>next</em> character too and checking it is the newline — exactly what slide 52 does with <code>"%d%c"</code>.</li>
<li><strong>Out-of-range input</strong> — a perfectly-formed number that your problem forbids, such as month 13 or a negative deposit. No library function can detect this; only your <code>if (value &lt; min || value &gt; max)</code> can.</li>
<li><strong>Incorrect number of input fields</strong> — you asked for three values and the return value says 2. Slide 49 is the measured picture of this, and it is why the check is always <code>!= expected</code>, never <code>== 0</code>.</li>
</ul>
<table>
<tr><th>Error class</th><th>Example input for <code>scanf("%d")</code> in [5,10]</th><th>How it is detected</th><th>Must you clear the buffer?</th></tr>
<tr><td>Invalid characters</td><td><code>test7</code></td><td>return value = <strong>0</strong></td><td><strong>Yes</strong> — the letters are still queued</td></tr>
<tr><td>Trailing characters</td><td><code>7.5</code></td><td>the character after the number is not <code>'\\n'</code></td><td><strong>Yes</strong> — <code>.5</code> is still queued</td></tr>
<tr><td>Out of range</td><td><code>20</code></td><td>your own <code>if</code> on the value</td><td>No — the line was fully consumed</td></tr>
<tr><td>Wrong number of fields</td><td><code>12 789</code> for three values</td><td>return value &lt; expected</td><td>Yes, if anything is left</td></tr>
<tr><td>End of input</td><td>Ctrl+D / Ctrl+Z</td><td>return value = <strong>-1</strong> (EOF)</td><td>No — and do <strong>not</strong> retry, you will loop for ever</td></tr>
</table>
<p class="dap-an">✅ The "must you clear" column is measured, not theory. A retry loop that reacts to <code>scanf("%d") == 0</code> <em>without</em> clearing was fed the single input <code>abc</code> and printed its error message over and over — five times in the first instant, and it was only stopped by a counter added for the test. The identical loop with <code>clear()</code> added, fed <code>abc</code> then <code>7</code>, printed the error once and then accepted <strong>n = 7</strong>. Same program, one line of difference between "hangs" and "works".</p>
<p class="pitfall">⚠️ The five rows need different reactions and students routinely collapse them into one. Rows 1, 2 and 4 → <em>clean up and ask again</em>. Row 3 → <em>ask again, nothing to clean</em>. Row 5 → <em>stop asking</em>. Treating EOF like an ordinary error is how a "friendly" validation loop becomes an infinite loop, which is exactly the hole measured in the slide's own example on slide 52.</p>`,
        `<p class="y-chinh">🎯 Slide nói thẳng tiền đề — "<strong>Chúng ta không thể đoán trước người dùng sẽ nhập dữ liệu như thế nào</strong>" — rồi gọi tên bốn thứ mã của bạn phải bẫy cho được: <strong>ký tự không hợp lệ, ký tự thừa phía sau, giá trị ngoài khoảng, và sai số lượng trường nhập</strong>.</p>
<ul>
<li><strong>Ba loại người dùng, một loại mã</strong> — slide liệt kê: người dùng có thể không nhập đúng như yêu cầu, "một người có thể gõ nhầm", hoặc "một người khác đơn giản là muốn thử phá chương trình". Chương trình của bạn không phân biệt nổi ba loại đó, nên phải lịch sự như nhau với cả ba.</li>
<li><strong>Ký tự không hợp lệ</strong> — chữ cái nằm ở chỗ đáng lẽ là số. Bắt bằng giá trị trả về: <code>scanf("%d", &amp;n)</code> cho <strong>0</strong>. Và nhớ slide 41: mấy ký tự phạm quy vẫn nằm trong bộ đệm, nên bạn phải dọn, không thì lần thử sau lại đọc đúng đống rác đó.</li>
<li><strong>Ký tự thừa phía sau</strong> — gõ <code>7.5</code> vào chỗ đợi một số nguyên. <code>scanf("%d")</code> vui vẻ lấy số <code>7</code> và trả về 1, nên riêng giá trị trả về nói "ổn cả". Bắt được nó bằng cách đọc luôn ký tự <em>kế tiếp</em> và kiểm xem có phải dấu xuống dòng không — đúng việc slide 52 làm với <code>"%d%c"</code>.</li>
<li><strong>Giá trị ngoài khoảng</strong> — một con số đúng dạng nhưng bài toán của bạn cấm, như tháng 13 hay một khoản gửi âm. Không hàm thư viện nào phát hiện nổi; chỉ câu <code>if (value &lt; min || value &gt; max)</code> của bạn mới làm được.</li>
<li><strong>Sai số lượng trường nhập</strong> — bạn đòi ba giá trị mà giá trị trả về nói 2. Slide 49 chính là bức ảnh đo được của chuyện này, và đó là lý do phép kiểm luôn là <code>!= số mong đợi</code>, chứ không bao giờ là <code>== 0</code>.</li>
</ul>
<table>
<tr><th>Loại lỗi</th><th>Ví dụ gõ vào cho <code>scanf("%d")</code> trong [5,10]</th><th>Phát hiện bằng gì</th><th>Có phải dọn bộ đệm không?</th></tr>
<tr><td>Ký tự không hợp lệ</td><td><code>test7</code></td><td>giá trị trả về = <strong>0</strong></td><td><strong>CÓ</strong> — mấy chữ cái vẫn xếp hàng chờ</td></tr>
<tr><td>Ký tự thừa phía sau</td><td><code>7.5</code></td><td>ký tự ngay sau số không phải <code>'\\n'</code></td><td><strong>CÓ</strong> — phần <code>.5</code> vẫn xếp hàng</td></tr>
<tr><td>Ngoài khoảng</td><td><code>20</code></td><td>câu <code>if</code> của chính bạn trên giá trị</td><td>Không — cả dòng đã được tiêu thụ hết</td></tr>
<tr><td>Sai số trường</td><td><code>12 789</code> trong khi cần ba giá trị</td><td>giá trị trả về &lt; số mong đợi</td><td>Có, nếu còn sót gì</td></tr>
<tr><td>Hết dữ liệu vào</td><td>Ctrl+D / Ctrl+Z</td><td>giá trị trả về = <strong>-1</strong> (EOF)</td><td>Không — và <strong>ĐỪNG</strong> thử lại, sẽ lặp vô hạn</td></tr>
</table>
<p class="dap-an">✅ Cột "có phải dọn bộ đệm không" là đo thật, không phải lý thuyết. Một vòng lặp nhập lại phản ứng theo <code>scanf("%d") == 0</code> mà <em>không</em> dọn, khi cho ăn đúng một dữ liệu vào <code>abc</code>, đã in câu báo lỗi liên tục — năm lần ngay trong nháy mắt đầu tiên, và chỉ dừng được nhờ một biến đếm thêm vào để thử. Cũng vòng lặp đó thêm <code>clear()</code>, cho ăn <code>abc</code> rồi <code>7</code>, thì in lỗi đúng một lần rồi nhận <strong>n = 7</strong>. Cùng một chương trình, một dòng khác nhau giữa "treo" và "chạy".</p>
<p class="pitfall">⚠️ Năm hàng đó cần năm phản ứng khác nhau, mà sinh viên hay gộp hết làm một. Hàng 1, 2 và 4 → <em>dọn dẹp rồi hỏi lại</em>. Hàng 3 → <em>hỏi lại, không có gì để dọn</em>. Hàng 5 → <em>thôi đừng hỏi nữa</em>. Đối xử với EOF như một lỗi thường chính là cách một vòng lặp kiểm tra "thân thiện" biến thành vòng lặp vô hạn — đúng cái lỗ hổng đo được trong chính ví dụ của slide 52.</p>`],

      [51, 'Input Validation: Example (main and clear)',
        `<p class="y-chinh">🎯 The payoff program, part one. The caption states the contract precisely: a function that "will ensure that inputted integer must be in the range [min, max] and <strong>no invalid characters or trailing character</strong> following inputted digits (<strong>EXCEPT the ENTER key</strong>)".</p>
<ul>
<li><strong>Read the contract as a specification</strong> — three separate promises: the value is an integer, it lies in <code>[min, max]</code>, and the line contains nothing after it but ENTER. Each promise maps to one branch of the <code>if/else if</code> chain on slide 52.</li>
<li><strong>The "EXCEPT the ENTER key" clause is the crux</strong> — the newline must be allowed, because the user has to press it to submit anything at all. So "trailing" means "anything that is not the newline". That single exception is why the code reads a second character with <code>%c</code> instead of just checking the return value.</li>
<li><strong>The file layout, line by line</strong> — <code>#include &lt;stdio.h&gt;</code>, then <code>clear()</code> defined in full (lines 3–5), then <code>int getInt(int min, int max);</code> as a <em>prototype</em> (line 7), then <code>main</code> (lines 9–14). The definition of <code>getInt</code> comes after <code>main</code>, on slide 52 — which is exactly the prototype pattern from Slot 08-09.</li>
<li><strong><code>main</code> is three lines and says nothing about validation</strong> — <code>int n; n = getInt(5, 10); printf("n = %d", n);</code>. That is the point of modularisation: the caller states <em>what</em> it wants (an integer in 5..10) and knows nothing of <em>how</em> it is enforced.</li>
<li><strong>The screenshot is the acceptance test</strong> — four attempts, four different messages: <code>test7</code> → "No input accepted!", <code>7.5</code> → "Trailing characters!", <code>20</code> → "Out of range!", <code>8</code> → <code>n = 8</code>. Those are exactly the first three error classes of slide 50 plus the success case.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
// Clear input buffer
void clear(){
    while(getchar()!='\\n');
}
// Function prototype
int getInt(int min, int max);

int main(){
    int n;
    n = getInt(5, 10);
    printf("n = %d", n);
    return 0;
}</code></pre>
<table>
<tr><th>Attempt</th><th>You type</th><th>Message printed</th><th>Which error class (slide 50)</th></tr>
<tr><td>1</td><td><code>test7</code></td><td>No input accepted!</td><td>invalid characters (scanf returned 0)</td></tr>
<tr><td>2</td><td><code>7.5</code></td><td>Trailing characters!</td><td>trailing characters (the char after 7 was <code>.</code>)</td></tr>
<tr><td>3</td><td><code>20</code></td><td>Out of range!</td><td>out-of-range (20 &gt; 10)</td></tr>
<tr><td>4</td><td><code>8</code></td><td><code>n = 8</code></td><td>accepted</td></tr>
</table>
<p class="dap-an">✅ Typed the slide's four attempts into the compiled program (<code>cc -Wall -std=c99</code>) in that exact order and got the slide's four lines back, in order, ending with <code>n = 8</code>. Typing just <code>8</code> straight away also gives <code>n = 8</code> with no messages — worth checking, because a validation loop that nags even on correct input is a bug users notice faster than any other.</p>
<p class="meo">💡 Note where <code>clear()</code> lives: it is defined <em>before</em> everything that uses it, so it needs no prototype, while <code>getInt</code> is defined after <code>main</code> and therefore does. Two functions in one 14-line file, illustrating both halves of the Slot 08-09 rule — it is a deliberate teaching choice, not an accident of layout.</p>`,
        `<p class="y-chinh">🎯 Chương trình thu hoạch, phần một. Dòng chú giải nêu bản hợp đồng rất chính xác: một hàm "bảo đảm số nguyên nhập vào phải nằm trong khoảng [min, max] và <strong>không có ký tự không hợp lệ hay ký tự thừa</strong> đứng sau các chữ số đã nhập (<strong>NGOẠI TRỪ phím ENTER</strong>)".</p>
<ul>
<li><strong>Hãy đọc bản hợp đồng đó như một đặc tả</strong> — ba lời hứa riêng biệt: giá trị là số nguyên, nó nằm trong <code>[min, max]</code>, và trên dòng không còn gì ngoài ENTER. Mỗi lời hứa ứng với đúng một nhánh trong chuỗi <code>if/else if</code> ở slide 52.</li>
<li><strong>Mệnh đề "NGOẠI TRỪ phím ENTER" là mấu chốt</strong> — dấu xuống dòng bắt buộc phải được cho qua, vì người dùng phải bấm nó thì mới nộp được bất cứ thứ gì. Vậy "thừa" nghĩa là "mọi thứ không phải dấu xuống dòng". Riêng ngoại lệ đó là lý do đoạn mã phải đọc thêm một ký tự thứ hai bằng <code>%c</code> thay vì chỉ kiểm giá trị trả về.</li>
<li><strong>Bố cục file, theo từng dòng</strong> — <code>#include &lt;stdio.h&gt;</code>, rồi <code>clear()</code> định nghĩa đầy đủ (dòng 3–5), rồi <code>int getInt(int min, int max);</code> ở dạng <em>nguyên mẫu</em> (dòng 7), rồi <code>main</code> (dòng 9–14). Định nghĩa của <code>getInt</code> nằm SAU <code>main</code>, ở slide 52 — đúng khuôn prototype của Slot 08-09.</li>
<li><strong><code>main</code> chỉ ba dòng và không nói gì về kiểm tra hợp lệ</strong> — <code>int n; n = getInt(5, 10); printf("n = %d", n);</code>. Đó chính là ý nghĩa của chia module: bên gọi nói ra <em>cái nó muốn</em> (một số nguyên trong 5..10) và không biết gì về <em>cách</em> điều đó được cưỡng chế.</li>
<li><strong>Ảnh chụp chính là bài kiểm nghiệm thu</strong> — bốn lần thử, bốn thông báo khác nhau: <code>test7</code> → "No input accepted!", <code>7.5</code> → "Trailing characters!", <code>20</code> → "Out of range!", <code>8</code> → <code>n = 8</code>. Đó đúng là ba loại lỗi đầu của slide 50 cộng trường hợp thành công.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
// Clear input buffer
void clear(){
    while(getchar()!='\\n');
}
// Function prototype
int getInt(int min, int max);

int main(){
    int n;
    n = getInt(5, 10);
    printf("n = %d", n);
    return 0;
}</code></pre>
<table>
<tr><th>Lần thử</th><th>Gõ gì</th><th>Thông báo in ra</th><th>Thuộc loại lỗi nào (slide 50)</th></tr>
<tr><td>1</td><td><code>test7</code></td><td>No input accepted!</td><td>ký tự không hợp lệ (scanf trả về 0)</td></tr>
<tr><td>2</td><td><code>7.5</code></td><td>Trailing characters!</td><td>ký tự thừa (ký tự sau số 7 là dấu <code>.</code>)</td></tr>
<tr><td>3</td><td><code>20</code></td><td>Out of range!</td><td>ngoài khoảng (20 &gt; 10)</td></tr>
<tr><td>4</td><td><code>8</code></td><td><code>n = 8</code></td><td>được chấp nhận</td></tr>
</table>
<p class="dap-an">✅ Đã gõ đúng bốn lần thử của slide vào chương trình đã biên dịch (<code>cc -Wall -std=c99</code>) theo đúng thứ tự đó và nhận lại đúng bốn dòng của slide, đúng trình tự, kết bằng <code>n = 8</code>. Gõ thẳng <code>8</code> ngay từ đầu cũng cho <code>n = 8</code> mà không một thông báo nào — đáng kiểm, vì một vòng lặp kiểm tra cằn nhằn cả khi dữ liệu vào đúng là loại bug người dùng phát hiện nhanh nhất.</p>
<p class="meo">💡 Để ý chỗ <code>clear()</code> nằm: nó được định nghĩa <em>trước</em> mọi thứ dùng nó nên không cần nguyên mẫu, còn <code>getInt</code> định nghĩa sau <code>main</code> nên bắt buộc phải có. Hai hàm trong một file 14 dòng, minh hoạ đủ cả hai nửa của luật ở Slot 08-09 — đó là lựa chọn sư phạm có chủ ý, không phải ngẫu nhiên của cách trình bày.</p>`],

      [52, 'Input Validation: Example (cont.) — the getInt function',
        `<p class="y-chinh">🎯 The body of <code>getInt</code>, lines 16–38: a <code>do…while</code> loop whose single <code>scanf("%d%c", &amp;value, &amp;lastCharacter)</code> collects <em>both</em> the number and the character that follows it, then four branches decide what just happened.</p>
<ul>
<li><strong>The one clever line is line 22</strong> — <code>count = scanf("%d%c", &amp;value, &amp;lastCharacter);</code>. Reading the following character deliberately is what makes "trailing characters" detectable at all; the return value alone cannot distinguish <code>7</code> from <code>7.5</code>, because both return at least 1.</li>
<li><strong>Branch 1 — <code>if (count == 0)</code></strong> → "No input accepted!" and <code>clear()</code>. Nothing converted, so the offending text is still queued and <em>must</em> be swept away before the loop turns, exactly as measured on slide 50.</li>
<li><strong>Branch 2 — <code>else if (lastCharacter != '\\n')</code></strong> → "Trailing characters!" and <code>clear()</code>. The number was fine but something followed it. <code>clear()</code> is needed again because the rest of that line is still waiting.</li>
<li><strong>Branch 3 — <code>else if (value &lt; min || value &gt; max)</code></strong> → "Out of range!" and, notably, <strong>no</strong> <code>clear()</code>. That is correct and worth noticing: to reach this branch, <code>lastCharacter</code> must already have been the newline, so the line is fully consumed and there is nothing left to sweep.</li>
<li><strong>Branch 4 — <code>else { flag = 0; }</code></strong> → the only way out. <code>do…while(flag==1)</code> then exits and <code>return value;</code> hands back a number that is guaranteed to satisfy all three promises of slide 51.</li>
</ul>
<pre><code>int getInt(int min, int max){
    int value, flag = 1, count;
    char lastCharacter;

    do{
        printf("Input an integer number in range [%d-&gt;%d]: ", min, max);
        count = scanf("%d%c", &amp;value, &amp;lastCharacter);

        if(count==0){
            printf("No input accepted!\\n\\n");
            clear();
        }else if(lastCharacter!='\\n'){
            printf("Trailing characters!\\n\\n");
            clear();
        }else if(value&lt;min || value&gt;max){
            printf("Out of range!\\n\\n");
        }else{
            flag = 0;
        }
    }while(flag==1);

    return value;
}</code></pre>
<table>
<tr><th>You type (range 5..10)</th><th>count</th><th>value</th><th>lastCharacter</th><th>Branch taken → message</th></tr>
<tr><td><code>test7</code></td><td>0</td><td>untouched</td><td>untouched</td><td>1 → No input accepted!</td></tr>
<tr><td><code>7.5</code></td><td>2</td><td>7</td><td><code>.</code></td><td>2 → Trailing characters!</td></tr>
<tr><td><code>20</code></td><td>2</td><td>20</td><td><code>\\n</code></td><td>3 → Out of range!</td></tr>
<tr><td><code>8</code></td><td>2</td><td>8</td><td><code>\\n</code></td><td>4 → accepted, returns <strong>8</strong></td></tr>
<tr><td>Ctrl+D / Ctrl+Z</td><td><strong>-1</strong></td><td>untouched</td><td><strong>untouched</strong></td><td>2 → Trailing characters!, then <strong>hangs</strong></td></tr>
</table>
<p class="dap-an">✅ Rows 1–4 measured and they match the slide's screenshot exactly, in order, ending at <code>n = 8</code>. Row 5 is a real hole in the slide's code, found by running it rather than reading it: on EOF, <code>scanf</code> returns <strong>-1</strong>, which is neither 0 nor a success, so control falls into branch 2 and tests <code>lastCharacter</code> — a variable that was <em>never assigned</em>. The program printed "Trailing characters!" and then <code>clear()</code> spun for ever on <code>getchar()</code> returning EOF; it had to be killed with <code>kill -9</code>, having produced exactly 64 bytes of output in two seconds and no second prompt. Two lines fix it, and the fixed version was measured returning cleanly on empty input:
<br><code>if (count == EOF) { printf("End of input!\\n"); return min; }</code> as the first test, and a safe sweeper <code>void clear(void){ int ch; while ((ch = getchar()) != '\\n' &amp;&amp; ch != EOF); }</code>.</p>
<p class="pitfall">⚠️ A second latent problem in the same function: if <code>count == 1</code> — the number converted but the following <code>%c</code> did not, which happens at end of input right after a valid number — branch 2 reads <code>lastCharacter</code> uninitialised, so the program's behaviour depends on stack rubbish. Make branch 2 <code>else if (count == 1 || lastCharacter != '\\n')</code> and initialise <code>char lastCharacter = '\\n';</code>. The pattern to remember: <strong>every value <code>scanf</code> did not fill is a variable you must not read</strong>.</p>`,
        `<p class="y-chinh">🎯 Thân hàm <code>getInt</code>, dòng 16–38: một vòng <code>do…while</code> mà lời gọi <code>scanf("%d%c", &amp;value, &amp;lastCharacter)</code> duy nhất của nó lấy về <em>cả</em> con số lẫn ký tự đứng ngay sau, rồi bốn nhánh quyết định vừa xảy ra chuyện gì.</p>
<ul>
<li><strong>Dòng khôn ngoan duy nhất là dòng 22</strong> — <code>count = scanf("%d%c", &amp;value, &amp;lastCharacter);</code>. Cố ý đọc luôn ký tự theo sau mới là thứ làm cho "ký tự thừa" phát hiện được; riêng giá trị trả về không phân biệt nổi <code>7</code> với <code>7.5</code>, vì cả hai đều trả về ít nhất 1.</li>
<li><strong>Nhánh 1 — <code>if (count == 0)</code></strong> → "No input accepted!" rồi <code>clear()</code>. Không chuyển đổi được gì, nên đoạn chữ phạm quy vẫn xếp hàng và <em>bắt buộc</em> phải quét đi trước khi vòng lặp quay, đúng như đã đo ở slide 50.</li>
<li><strong>Nhánh 2 — <code>else if (lastCharacter != '\\n')</code></strong> → "Trailing characters!" rồi <code>clear()</code>. Con số thì ổn nhưng có thứ bám theo sau. Lại cần <code>clear()</code> vì phần còn lại của dòng vẫn đang chờ.</li>
<li><strong>Nhánh 3 — <code>else if (value &lt; min || value &gt; max)</code></strong> → "Out of range!" và, đáng chú ý, <strong>KHÔNG</strong> gọi <code>clear()</code>. Như thế là đúng và rất đáng để ý: muốn tới được nhánh này thì <code>lastCharacter</code> đã phải là dấu xuống dòng rồi, tức cả dòng đã tiêu thụ hết, chẳng còn gì để quét.</li>
<li><strong>Nhánh 4 — <code>else { flag = 0; }</code></strong> → lối ra duy nhất. <code>do…while(flag==1)</code> khi đó thoát và <code>return value;</code> trao lại một con số bảo đảm thoả cả ba lời hứa của slide 51.</li>
</ul>
<pre><code>int getInt(int min, int max){
    int value, flag = 1, count;
    char lastCharacter;

    do{
        printf("Input an integer number in range [%d-&gt;%d]: ", min, max);
        count = scanf("%d%c", &amp;value, &amp;lastCharacter);

        if(count==0){
            printf("No input accepted!\\n\\n");
            clear();
        }else if(lastCharacter!='\\n'){
            printf("Trailing characters!\\n\\n");
            clear();
        }else if(value&lt;min || value&gt;max){
            printf("Out of range!\\n\\n");
        }else{
            flag = 0;
        }
    }while(flag==1);

    return value;
}</code></pre>
<table>
<tr><th>Gõ gì (khoảng 5..10)</th><th>count</th><th>value</th><th>lastCharacter</th><th>Vào nhánh nào → thông báo</th></tr>
<tr><td><code>test7</code></td><td>0</td><td>không đụng</td><td>không đụng</td><td>1 → No input accepted!</td></tr>
<tr><td><code>7.5</code></td><td>2</td><td>7</td><td><code>.</code></td><td>2 → Trailing characters!</td></tr>
<tr><td><code>20</code></td><td>2</td><td>20</td><td><code>\\n</code></td><td>3 → Out of range!</td></tr>
<tr><td><code>8</code></td><td>2</td><td>8</td><td><code>\\n</code></td><td>4 → nhận, trả về <strong>8</strong></td></tr>
<tr><td>Ctrl+D / Ctrl+Z</td><td><strong>-1</strong></td><td>không đụng</td><td><strong>không đụng</strong></td><td>2 → Trailing characters!, rồi <strong>TREO</strong></td></tr>
</table>
<p class="dap-an">✅ Hàng 1–4 đo thật và khớp chính xác ảnh chụp của slide, đúng thứ tự, kết ở <code>n = 8</code>. Hàng 5 là một LỖ HỔNG thật trong mã của slide, tìm ra bằng cách CHẠY chứ không phải bằng cách đọc: khi gặp EOF, <code>scanf</code> trả về <strong>-1</strong>, không phải 0 mà cũng không phải thành công, nên luồng rơi vào nhánh 2 và đi kiểm <code>lastCharacter</code> — một biến <em>chưa hề được gán</em>. Chương trình in ra "Trailing characters!" rồi <code>clear()</code> quay vô tận vì <code>getchar()</code> cứ trả EOF; phải <code>kill -9</code>, sau khi in đúng 64 byte trong hai giây và không có dòng nhắc thứ hai nào. Hai dòng là vá được, và bản vá đã đo thấy kết thúc êm với dữ liệu vào rỗng:
<br><code>if (count == EOF) { printf("End of input!\\n"); return min; }</code> đặt làm phép kiểm đầu tiên, cộng một cây chổi an toàn <code>void clear(void){ int ch; while ((ch = getchar()) != '\\n' &amp;&amp; ch != EOF); }</code>.</p>
<p class="pitfall">⚠️ Một vấn đề tiềm ẩn thứ hai trong chính hàm đó: nếu <code>count == 1</code> — con số chuyển đổi được nhưng <code>%c</code> theo sau thì không, chuyện xảy ra khi hết dữ liệu vào ngay sau một con số hợp lệ — thì nhánh 2 đọc <code>lastCharacter</code> lúc nó chưa khởi tạo, và hành vi chương trình phụ thuộc vào rác trên ngăn xếp. Hãy sửa nhánh 2 thành <code>else if (count == 1 || lastCharacter != '\\n')</code> và khởi tạo <code>char lastCharacter = '\\n';</code>. Khuôn phải nhớ: <strong>mọi giá trị <code>scanf</code> chưa điền là một biến bạn KHÔNG được phép đọc</strong>.</p>`],

      [53, 'Exercise 3: Input Validation',
        `<p class="y-chinh">🎯 Write slide 52 again, yourself, for <code>double</code>: "Design and code a function named <strong>getDouble</strong> that receives two double values (a lower limit and an upper limit) and returns user input that lies between the limiting values. Your function rejects any input that includes trailing characters or lies outside the specified limits."</p>
<ul>
<li><strong>What changes from <code>getInt</code></strong> — only three things: the return type and both parameters become <code>double</code>, the conversion specifier becomes <code>%lf</code>, and the prompt prints the limits with <code>%.2lf</code>. The control flow is identical, which is the real lesson of the exercise.</li>
<li><strong>Do not use <code>%f</code></strong> — in <code>scanf</code>, <code>%f</code> expects a <code>float *</code> (slide 43). Passing a <code>double *</code> writes four bytes into an eight-byte variable; measured earlier in this lesson, the variable kept its old value <code>-1.000000</code> while <code>scanf</code> still reported success.</li>
<li><strong>The "trailing characters" test is unchanged</strong> — read the following character with <code>%c</code> and demand a newline. It now also catches inputs like <code>3.5x</code> and, deliberately, <code>7.25</code> followed by a space.</li>
<li><strong>Fix the two holes found on slide 52 while you are here</strong> — test <code>count == EOF</code> first and give up, treat <code>count == 1</code> as trailing, initialise <code>lastCharacter</code>, and use the EOF-safe <code>clear()</code>. The exercise says nothing about this; your marks in the practical exam do.</li>
<li><strong>Boundaries belong in your test plan</strong> — a range test must be checked at <code>lower</code>, at <code>upper</code>, just below and just above. <code>value &lt; lower || value &gt; upper</code> is inclusive on both ends, so 1.5 and 9.75 must be <em>accepted</em> in the run below.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

void clear(void)                       /* CÓ chặn EOF — xem slide 52 */
{
    int ch;
    while ((ch = getchar()) != '\\n' &amp;&amp; ch != EOF)
        ;
}

double getDouble(double lower, double upper);

int main(void)
{
    double d = getDouble(1.5, 9.75);
    printf("d = %.4lf\\n", d);
    return 0;
}

double getDouble(double lower, double upper)
{
    double value = 0.0;
    int flag = 1, count;
    char lastCharacter = '\\n';

    do {
        printf("Input a real number in range [%.2lf-&gt;%.2lf]: ", lower, upper);
        count = scanf("%lf%c", &amp;value, &amp;lastCharacter);

        if (count == EOF) {                     /* hết dữ liệu vào */
            printf("End of input!\\n");
            return lower;
        } else if (count == 0) {                /* không đọc được số nào */
            printf("No input accepted!\\n\\n");
            clear();
        } else if (count == 1 || lastCharacter != '\\n') {   /* còn rác phía sau */
            printf("Trailing characters!\\n\\n");
            clear();
        } else if (value &lt; lower || value &gt; upper) {
            printf("Out of range!\\n\\n");
        } else {
            flag = 0;
        }
    } while (flag == 1);

    return value;
}</code></pre>
<table>
<tr><th>You type</th><th>count</th><th>lastCharacter</th><th>What the program does</th></tr>
<tr><td><code>abc</code></td><td>0</td><td>—</td><td>No input accepted! (clears, asks again)</td></tr>
<tr><td><code>3.5x</code></td><td>2</td><td><code>x</code></td><td>Trailing characters!</td></tr>
<tr><td><code>12.0</code></td><td>2</td><td><code>\\n</code></td><td>Out of range! (12.0 &gt; 9.75)</td></tr>
<tr><td><code>0.5</code></td><td>2</td><td><code>\\n</code></td><td>Out of range! (0.5 &lt; 1.5)</td></tr>
<tr><td><code>7.25</code></td><td>2</td><td><code>\\n</code></td><td><strong>accepted → d = 7.2500</strong></td></tr>
<tr><td><code>2</code> (an integer)</td><td>2</td><td><code>\\n</code></td><td>accepted → d = 2.0000</td></tr>
<tr><td><code>1.5</code> / <code>9.75</code> (the boundaries)</td><td>2</td><td><code>\\n</code></td><td>accepted → 1.5000 / 9.7500</td></tr>
</table>
<p class="dap-an">✅ Answer: the program above, compiled with <code>cc -Wall -std=c99</code> and driven with real input. The five-step session <code>abc</code> → <code>3.5x</code> → <code>12.0</code> → <code>0.5</code> → <code>7.25</code> printed, in order, <em>No input accepted!</em>, <em>Trailing characters!</em>, <em>Out of range!</em>, <em>Out of range!</em>, then <strong><code>d = 7.2500</code></strong>. Boundary values measured and accepted: <code>1.5</code> → 1.5000, <code>9.75</code> → 9.7500. A plain integer <code>2</code> is accepted → 2.0000, because <code>%lf</code> does not require a decimal point. With no input at all (EOF) the function printed <em>End of input!</em> and returned the lower limit instead of hanging — the slide-52 hole, closed.</p>
<p class="pitfall">⚠️ One measured design decision you must be able to defend: typing <code>&nbsp;&nbsp;7.25&nbsp;&nbsp;</code> with trailing spaces is <strong>rejected</strong> as "Trailing characters!", because <code>%c</code> reads the space, not the newline. That is faithful to the exercise's wording ("rejects any input that includes trailing characters"), but if you want to tolerate spaces, use <code>scanf("%lf%c", …)</code> then skip blanks before testing, or read the whole line and parse it. Decide which behaviour you want — do not discover it from a failing test case in the exam.</p>`,
        `<p class="y-chinh">🎯 Viết lại slide 52, bằng tay bạn, cho kiểu <code>double</code>: "thiết kế và viết một hàm tên <strong>getDouble</strong> nhận hai giá trị double (một cận dưới và một cận trên) và trả về dữ liệu người dùng nhập nằm giữa hai cận đó. Hàm của bạn phải từ chối mọi dữ liệu vào có ký tự thừa phía sau hoặc nằm ngoài các cận đã cho".</p>
<ul>
<li><strong>Khác <code>getInt</code> ở chỗ nào</strong> — chỉ ba thứ: kiểu trả về và hai tham số đổi sang <code>double</code>, conversion specifier đổi thành <code>%lf</code>, và dòng nhắc in cận bằng <code>%.2lf</code>. Luồng điều khiển giữ nguyên — đó mới là bài học thật của bài tập này.</li>
<li><strong>ĐỪNG dùng <code>%f</code></strong> — trong <code>scanf</code>, <code>%f</code> đòi một <code>float *</code> (slide 43). Đưa cho nó một <code>double *</code> là ghi bốn byte vào biến tám byte; đo ở phần trên của bài này, biến đó giữ nguyên giá trị cũ <code>-1.000000</code> trong khi <code>scanf</code> vẫn báo thành công.</li>
<li><strong>Phép kiểm "ký tự thừa" không đổi</strong> — đọc ký tự theo sau bằng <code>%c</code> và đòi nó phải là dấu xuống dòng. Giờ nó bắt luôn những dữ liệu vào như <code>3.5x</code> và, một cách có chủ ý, cả <code>7.25</code> có dấu cách theo sau.</li>
<li><strong>Nhân tiện hãy vá luôn hai lỗ hổng tìm được ở slide 52</strong> — kiểm <code>count == EOF</code> trước tiên rồi bỏ cuộc, coi <code>count == 1</code> là có rác thừa, khởi tạo <code>lastCharacter</code>, và dùng bản <code>clear()</code> chặn EOF. Đề bài không nói gì về mấy thứ này; điểm thi thực hành của bạn thì có.</li>
<li><strong>Biên phải nằm trong kế hoạch kiểm thử</strong> — kiểm một khoảng thì phải thử ở <code>lower</code>, ở <code>upper</code>, ngay dưới và ngay trên. Điều kiện <code>value &lt; lower || value &gt; upper</code> là bao gồm cả hai đầu, nên 1.5 và 9.75 phải được <em>chấp nhận</em> trong lần chạy dưới đây.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

void clear(void)                       /* CÓ chặn EOF — xem slide 52 */
{
    int ch;
    while ((ch = getchar()) != '\\n' &amp;&amp; ch != EOF)
        ;
}

double getDouble(double lower, double upper);

int main(void)
{
    double d = getDouble(1.5, 9.75);
    printf("d = %.4lf\\n", d);
    return 0;
}

double getDouble(double lower, double upper)
{
    double value = 0.0;
    int flag = 1, count;
    char lastCharacter = '\\n';

    do {
        printf("Input a real number in range [%.2lf-&gt;%.2lf]: ", lower, upper);
        count = scanf("%lf%c", &amp;value, &amp;lastCharacter);

        if (count == EOF) {                     /* hết dữ liệu vào */
            printf("End of input!\\n");
            return lower;
        } else if (count == 0) {                /* không đọc được số nào */
            printf("No input accepted!\\n\\n");
            clear();
        } else if (count == 1 || lastCharacter != '\\n') {   /* còn rác phía sau */
            printf("Trailing characters!\\n\\n");
            clear();
        } else if (value &lt; lower || value &gt; upper) {
            printf("Out of range!\\n\\n");
        } else {
            flag = 0;
        }
    } while (flag == 1);

    return value;
}</code></pre>
<table>
<tr><th>Gõ gì</th><th>count</th><th>lastCharacter</th><th>Chương trình làm gì</th></tr>
<tr><td><code>abc</code></td><td>0</td><td>—</td><td>No input accepted! (dọn bộ đệm, hỏi lại)</td></tr>
<tr><td><code>3.5x</code></td><td>2</td><td><code>x</code></td><td>Trailing characters!</td></tr>
<tr><td><code>12.0</code></td><td>2</td><td><code>\\n</code></td><td>Out of range! (12.0 &gt; 9.75)</td></tr>
<tr><td><code>0.5</code></td><td>2</td><td><code>\\n</code></td><td>Out of range! (0.5 &lt; 1.5)</td></tr>
<tr><td><code>7.25</code></td><td>2</td><td><code>\\n</code></td><td><strong>được nhận → d = 7.2500</strong></td></tr>
<tr><td><code>2</code> (một số nguyên)</td><td>2</td><td><code>\\n</code></td><td>được nhận → d = 2.0000</td></tr>
<tr><td><code>1.5</code> / <code>9.75</code> (hai biên)</td><td>2</td><td><code>\\n</code></td><td>được nhận → 1.5000 / 9.7500</td></tr>
</table>
<p class="dap-an">✅ Đáp án: chương trình ở trên, biên dịch bằng <code>cc -Wall -std=c99</code> và cho ăn dữ liệu vào thật. Phiên năm bước <code>abc</code> → <code>3.5x</code> → <code>12.0</code> → <code>0.5</code> → <code>7.25</code> in ra, đúng thứ tự, <em>No input accepted!</em>, <em>Trailing characters!</em>, <em>Out of range!</em>, <em>Out of range!</em>, rồi <strong><code>d = 7.2500</code></strong>. Giá trị biên đo được và đều được nhận: <code>1.5</code> → 1.5000, <code>9.75</code> → 9.7500. Một số nguyên trơn <code>2</code> cũng được nhận → 2.0000, vì <code>%lf</code> không đòi phải có dấu chấm thập phân. Khi không có dữ liệu vào nào (EOF) thì hàm in <em>End of input!</em> và trả về cận dưới thay vì treo — đúng lỗ hổng của slide 52, đã bịt.</p>
<p class="pitfall">⚠️ Một quyết định thiết kế đã đo được mà bạn phải bảo vệ được: gõ <code>&nbsp;&nbsp;7.25&nbsp;&nbsp;</code> có dấu cách phía sau thì bị <strong>từ chối</strong> là "Trailing characters!", vì <code>%c</code> đọc được dấu cách chứ không phải dấu xuống dòng. Như vậy là trung thành với chữ của đề ("từ chối mọi dữ liệu vào có ký tự thừa phía sau"), nhưng nếu bạn muốn dễ tính với dấu cách thì hãy <code>scanf("%lf%c", …)</code> rồi bỏ qua khoảng trắng trước khi kiểm, hoặc đọc cả dòng rồi tự phân tích. Hãy QUYẾT trước mình muốn hành vi nào — đừng để phát hiện ra nó từ một ca kiểm thử trượt trong phòng thi.</p>`],

      [54, 'Summary',
        `<p class="y-chinh">🎯 Four bullets close the block — <strong>Types of Input · getchar · scanf · Input validation</strong> — and a Q&amp;A mark. Here is each one compressed to the sentence that is actually examinable.</p>
<ul>
<li><strong>Types of Input</strong> — standard C input is <em>buffered</em>: the keyboard fills a buffer, ENTER hands it over, and your input function reads the buffer, never the keys. Anything a read does not consume waits for the next read.</li>
<li><strong>getchar</strong> — <code>int getchar(void)</code>, one character, no conversion, returns the code or <code>EOF</code> (-1). Declare the receiving variable <code>int</code>. Its second career is as a broom: <code>while ((ch = getchar()) != '\\n' &amp;&amp; ch != EOF);</code>.</li>
<li><strong>scanf</strong> — reads under format control and <strong>returns the number of addresses filled</strong>, 0 … n or EOF. <code>%d</code> and friends skip leading whitespace; <code>%c</code> does not, so write <code>" %c"</code>. Any literal you put in the format must appear exactly in the input. <code>%*c</code> reads and discards and is not counted in the return value.</li>
<li><strong>Input validation</strong> — four error classes (invalid characters, trailing characters, out of range, wrong number of fields) plus EOF. Read the number <em>and</em> the character after it, check the count, check the newline, check the range, and clear the buffer in every branch where something is left behind.</li>
<li><strong>What comes next</strong> — slides 55–65 are Formatted Output (<code>putchar</code>, <code>printf</code>, the full format string) and then Exercises 4 and 5, both of which build a menu program that reads a choice from the keyboard. Every line of this block is a prerequisite for them.</li>
</ul>
<table>
<tr><th>Symptom you will actually see</th><th>Cause</th><th>Fix</th></tr>
<tr><td>A <code>%c</code> read is "skipped"</td><td>ENTER left <code>'\\n'</code> in the buffer</td><td><code>" %c"</code>, <code>%*c</code>, or <code>clear()</code></td></tr>
<tr><td>Retry loop spins for ever</td><td>the bad characters were never consumed</td><td><code>clear()</code> in the error branch</td></tr>
<tr><td>A variable prints nonsense</td><td><code>scanf</code> never filled it; you ignored the return value</td><td><code>if (scanf(...) != expected)</code></td></tr>
<tr><td><code>7.5</code> accepted as the integer 7</td><td>the return value alone cannot see trailing text</td><td>read the next char too and demand <code>'\\n'</code></td></tr>
<tr><td>Program hangs at end of input</td><td><code>EOF</code> (-1) treated as an ordinary error</td><td>test <code>count == EOF</code> and stop</td></tr>
</table>
<p class="meo">💡 Every row of that table was reproduced by compiling and running the slides' own programs during this lesson — including two cases where the slide's code is the thing that hangs. Do the same yourself: type the four or five lines, feed them deliberately bad input, and watch. In this topic, <em>reading</em> the code teaches you what it should do; <em>running</em> it teaches you what it does.</p>`,
        `<p class="y-chinh">🎯 Bốn gạch đầu dòng khép lại cả khối — <strong>Types of Input · getchar · scanf · Input validation</strong> — cùng một dấu Q&amp;A. Dưới đây là từng mục nén lại thành câu thực sự ra thi được.</p>
<ul>
<li><strong>Types of Input</strong> — nhập chuẩn trong C là <em>có đệm</em>: bàn phím đổ đầy một bộ đệm, ENTER trao nó đi, còn hàm nhập của bạn đọc bộ đệm chứ không bao giờ đọc phím. Thứ gì một lần đọc không tiêu thụ thì nằm chờ lần đọc sau.</li>
<li><strong>getchar</strong> — <code>int getchar(void)</code>, một ký tự, không chuyển đổi, trả về mã ký tự hoặc <code>EOF</code> (-1). Biến nhận phải khai <code>int</code>. Nghề thứ hai của nó là làm chổi: <code>while ((ch = getchar()) != '\\n' &amp;&amp; ch != EOF);</code>.</li>
<li><strong>scanf</strong> — đọc dưới sự điều khiển của định dạng và <strong>trả về SỐ ĐỊA CHỈ đã điền</strong>, 0 … n hoặc EOF. <code>%d</code> và đồng bọn bỏ qua khoảng trắng đứng đầu; <code>%c</code> thì không, nên phải viết <code>" %c"</code>. Mọi ký tự hằng bạn đặt vào định dạng đều phải xuất hiện đúng như thế trong dữ liệu vào. <code>%*c</code> đọc rồi vứt và KHÔNG được tính vào giá trị trả về.</li>
<li><strong>Input validation</strong> — bốn loại lỗi (ký tự không hợp lệ, ký tự thừa, ngoài khoảng, sai số trường) cộng thêm EOF. Đọc con số <em>và</em> ký tự ngay sau nó, kiểm con đếm, kiểm dấu xuống dòng, kiểm khoảng, và dọn bộ đệm ở mọi nhánh còn sót lại thứ gì.</li>
<li><strong>Tiếp theo là gì</strong> — slide 55–65 là Formatted Output (<code>putchar</code>, <code>printf</code>, toàn bộ chuỗi định dạng) rồi Exercise 4 và 5, cả hai đều dựng một chương trình menu đọc lựa chọn từ bàn phím. Mọi dòng của khối này là điều kiện tiên quyết cho chúng.</li>
</ul>
<table>
<tr><th>Triệu chứng bạn sẽ thật sự gặp</th><th>Nguyên nhân</th><th>Cách chữa</th></tr>
<tr><td>Một lần đọc <code>%c</code> bị "bỏ qua"</td><td>ENTER để lại <code>'\\n'</code> trong bộ đệm</td><td><code>" %c"</code>, <code>%*c</code>, hoặc <code>clear()</code></td></tr>
<tr><td>Vòng lặp nhập lại quay vô tận</td><td>mấy ký tự sai chưa hề bị tiêu thụ</td><td><code>clear()</code> trong nhánh báo lỗi</td></tr>
<tr><td>Một biến in ra số vô nghĩa</td><td><code>scanf</code> chưa hề điền nó; bạn bỏ qua giá trị trả về</td><td><code>if (scanf(...) != số mong đợi)</code></td></tr>
<tr><td><code>7.5</code> bị nhận thành số nguyên 7</td><td>riêng giá trị trả về không thấy được chữ thừa phía sau</td><td>đọc luôn ký tự kế tiếp và đòi nó là <code>'\\n'</code></td></tr>
<tr><td>Chương trình treo khi hết dữ liệu vào</td><td><code>EOF</code> (-1) bị coi như một lỗi thường</td><td>kiểm <code>count == EOF</code> rồi dừng</td></tr>
</table>
<p class="meo">💡 Mọi hàng trong bảng đó đều được tái hiện bằng cách biên dịch và chạy chính các chương trình của bộ slide trong bài học này — kể cả hai trường hợp mà thứ bị treo chính là mã của slide. Bạn hãy làm y như vậy: gõ bốn năm dòng, cố tình cho ăn dữ liệu sai, rồi ngồi xem. Ở chủ đề này, <em>đọc</em> code dạy bạn nó ĐÁNG LẼ làm gì; <em>chạy</em> code mới dạy bạn nó THỰC SỰ làm gì.</p>`],

    ]),
  ].join('\n'),
};
