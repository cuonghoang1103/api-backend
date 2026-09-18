/**
 * PRF192 · Slot 00 — Course Introduction, học theo từng slide.
 * Deck 'prf0' (PRF0), 17 slide, render sẵn lên CDN images/academy/PRF192/v1/prf0/NNN.webp.
 * Nội dung bám ĐÚNG chữ trích từ file gốc Slot_00_Course Introduction.pptx của trường.
 * Mọi phép tính điểm trong phần giảng đều đã kiểm tay theo công thức trên slide 13:
 *   Total = 0.15*PT + 0.1*WS + 0.15*AS + 0.3*PE + 0.3*FE
 *   (7, 8, 9, 6, 5)   -> 1.05 + 0.80 + 1.35 + 1.80 + 1.50 = 6.50  (ĐẠT)
 *   (7, 8, 9, 6, 3.5) -> 1.05 + 0.80 + 1.35 + 1.80 + 1.05 = 6.05  (TRƯỢT vì FE < 4)
 *   (4, 5, 4, 3, FE)  -> 0.60 + 0.50 + 0.60 + 0.90 = 2.60 => cần FE >= 8.0
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'prf0';

export default {
  title: '0.0 — Slide by slide: Course Introduction (17 slides)|||0.0 — Slide bài giảng: Giới thiệu môn học (17 slide)',
  slug: 'prf192-0-0-slides-gioi-thieu-mon',
  type: 'DOCUMENT',
  description: 'Toàn bộ 17 slide Slot 00 của PRF192 — vì sao học C, vì sao trường chọn C, điều kiện đầu vào, 6 mục tiêu môn học, 9 khối kiến thức của course description, giáo trình và công cụ Dev-C++, nội quy lớp, công thức tính điểm 0.15·PT + 0.1·WS + 0.15·AS + 0.3·PE + 0.3·FE cùng điều kiện đạt, cách học và chính sách liêm chính học thuật — mỗi slide kèm giảng song ngữ, ví dụ tính điểm giải từng bước và bẫy hay gặp.',
  content: [
    walkHead(D, 1, 17),
    walk(D, [
      [1, 'Programming Fundamentals using C — course cover',
        `<p class="y-chinh">🎯 The opening slide of <strong>PRF192 — Programming Fundamentals using C</strong>: the first programming course of the curriculum, and the one every later coding subject leans on.</p>
<ul>
<li><strong>Read the title carefully</strong> — the subject is <em>Programming Fundamentals</em>; C is only the vehicle. You are here to learn how to turn a problem into an algorithm and an algorithm into running code, not to memorise C trivia.</li>
<li><strong>Why a cover slide matters</strong> — Slot 00 contains no C syntax at all. It is the contract between you and the course: what is expected, how you are graded, which tools you must install before Slot 01.</li>
<li><strong>Where PRF192 sits</strong> — it is the prerequisite for PRO192 (OOP with Java), CSD201 (Data Structures &amp; Algorithms) and DBI202. Weak pointers or weak loops here become a real problem two semesters later.</li>
<li><strong>What "fundamentals" really means</strong> — variables and types, input/output, decisions, loops, functions, pointers, arrays, structs, strings, files. Nine blocks, listed on slide 8.</li>
<li><strong>Your first program will look like this</strong> — every C program starts from a function called <code>main</code>:</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main() {
    printf("Programming Fundamentals using C\\n");
    return 0;
}</code></pre>
<p class="meo">💡 Treat Slot 00 as a checklist, not a warm-up talk. By the end of this deck you should have Dev-C++ installed, know your grade formula by heart, and know where the course plan lives.</p>`,
        `<p class="y-chinh">🎯 Slide mở đầu của <strong>PRF192 — Programming Fundamentals using C</strong>: môn lập trình đầu tiên của chương trình, và là chỗ tựa của mọi môn code về sau.</p>
<ul>
<li><strong>Đọc kỹ cái tên</strong> — môn học là <em>Nền tảng lập trình</em>, còn C chỉ là phương tiện. Bạn tới đây để học cách biến bài toán thành thuật toán, rồi biến thuật toán thành mã chạy được, chứ không phải để thuộc lòng cú pháp C.</li>
<li><strong>Vì sao cần một slide bìa</strong> — Slot 00 không có một dòng cú pháp C nào. Nó là bản cam kết giữa bạn và môn học: kỳ vọng ra sao, chấm điểm thế nào, phải cài công cụ gì trước Slot 01.</li>
<li><strong>PRF192 nằm ở đâu</strong> — nó là môn tiên quyết của PRO192 (lập trình hướng đối tượng với Java), CSD201 (Cấu trúc dữ liệu &amp; giải thuật) và DBI202. Yếu con trỏ hay yếu vòng lặp ở đây sẽ thành vấn đề thật sự sau hai kỳ.</li>
<li><strong>"Nền tảng" cụ thể là gì</strong> — biến và kiểu dữ liệu, nhập/xuất, rẽ nhánh, vòng lặp, hàm, con trỏ, mảng, struct, chuỗi, tệp tin. Chín khối, liệt kê ở slide 8.</li>
<li><strong>Chương trình đầu tiên của bạn sẽ trông thế này</strong> — mọi chương trình C đều khởi động từ hàm tên <code>main</code>:</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main() {
    printf("Programming Fundamentals using C\\n");
    return 0;
}</code></pre>
<p class="meo">💡 Hãy coi Slot 00 là một danh sách việc phải làm, không phải buổi nói chuyện khởi động. Học hết deck này bạn phải cài xong Dev-C++, thuộc công thức tính điểm, và biết kế hoạch môn nằm ở đâu.</p>`],

      [2, 'Contents — what Slot 00 covers',
        `<p class="y-chinh">🎯 The agenda of the introduction session: ten items, running from motivation, through the rules, to installing the compiler.</p>
<ul>
<li><strong>Why should you study this course?</strong> (slides 3–4) and <strong>Why C is chosen?</strong> (slide 5) — the motivation block: what C buys you and why the university did not start with Python.</li>
<li><strong>Prerequisites</strong> (slide 6) — English reading comprehension and basic mathematical logic. Two items only, but both are used every single slot.</li>
<li><strong>Course Objectives</strong> (slide 7) and <strong>Course Description / Course Plan</strong> (slides 8–9) — what you will be able to do, and the topic order you will do it in.</li>
<li><strong>Materials / References / Tools</strong> (slides 10–11) — three references plus one IDE, Dev-C++ 6.3 with TDM-GCC 9.2.</li>
<li><strong>Course Rules</strong> (12), <strong>Evaluation Strategy</strong> (13), <strong>How to study</strong> (14), <strong>Academic policy</strong> (15) — the administrative half: attendance, grade weights, study method, and cheating/plagiarism.</li>
<li><strong>Install tools for programming</strong> (17) — the session ends hands-on, so you leave with a working compiler, not just notes.</li>
</ul>
<p class="meo">💡 Of these ten items, exactly two decide whether you pass: the <em>evaluation strategy</em> (slide 13) and the <em>academic policy</em> (slide 15). Everything else decides how painful the semester is.</p>`,
        `<p class="y-chinh">🎯 Chương trình của buổi giới thiệu: mười mục, chạy từ động lực, qua nội quy, tới bước cài trình biên dịch.</p>
<ul>
<li><strong>Vì sao nên học môn này?</strong> (slide 3–4) và <strong>Vì sao chọn C?</strong> (slide 5) — khối động lực: học C được gì, và vì sao trường không bắt đầu bằng Python.</li>
<li><strong>Điều kiện đầu vào</strong> (slide 6) — đọc hiểu tiếng Anh và tư duy logic toán cơ bản. Chỉ hai mục, nhưng cả hai đều dùng ở từng buổi.</li>
<li><strong>Mục tiêu môn học</strong> (slide 7) và <strong>Mô tả môn / Kế hoạch môn</strong> (slide 8–9) — học xong làm được gì, và đi theo trình tự chủ đề nào.</li>
<li><strong>Giáo trình / Tài liệu tham khảo / Công cụ</strong> (slide 10–11) — ba tài liệu cộng một IDE là Dev-C++ 6.3 kèm TDM-GCC 9.2.</li>
<li><strong>Nội quy lớp</strong> (12), <strong>Chiến lược đánh giá</strong> (13), <strong>Cách học</strong> (14), <strong>Chính sách học thuật</strong> (15) — nửa hành chính: điểm danh, trọng số điểm, phương pháp học, và chuyện gian lận/đạo văn.</li>
<li><strong>Cài công cụ lập trình</strong> (17) — buổi học kết thúc bằng thực hành, để bạn ra về với một trình biên dịch chạy được chứ không chỉ với mấy trang ghi chép.</li>
</ul>
<p class="meo">💡 Trong mười mục này, đúng hai mục quyết định bạn đậu hay trượt: <em>chiến lược đánh giá</em> (slide 13) và <em>chính sách học thuật</em> (slide 15). Những mục còn lại quyết định kỳ học này khổ tới mức nào.</p>`],

      [3, 'Why should you study this course? (1/2)',
        `<p class="y-chinh">🎯 Three reasons on this slide: C is the <strong>foundation</strong> of modern languages, it gives <strong>performance</strong>, and it is the language of <strong>system-level programming</strong>.</p>
<ul>
<li><strong>Foundation of Programming</strong> — the slide calls C the "mother" of modern languages. C++, Java, C# and (in its reference implementation) Python all grew out of C, so their syntax for <code>if</code>, <code>for</code>, <code>while</code>, braces, operators and function calls is essentially C's. Learn it once, read four languages.</li>
<li><strong>Performance</strong> — C is low-level: you control memory yourself and the compiler adds almost no hidden runtime. There is no garbage collector pausing your program and no interpreter between your code and the CPU, which is why benchmarks routinely put C an order of magnitude ahead of scripting languages.</li>
<li><strong>System-Level Programming</strong> — operating systems (Linux, Windows kernels), device drivers, databases and embedded firmware are written in C, because at that level you must talk to fixed hardware addresses and fit into kilobytes of RAM.</li>
<li><strong>What "fine control over memory" looks like</strong> — in C you can literally see the address of a variable, which is why Slot 10 (Pointers) exists:</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main() {
    int x = 10;
    int *p = &amp;x;          /* p holds the ADDRESS of x */
    printf("%d\\n", x);    /* 10  - the value        */
    printf("%d\\n", *p);   /* 10  - value via pointer */
    *p = 99;              /* write through the pointer */
    printf("%d\\n", x);    /* 99  - x really changed  */
    return 0;
}</code></pre>
<p class="pitfall">⚠️ The same power is the danger: C will happily let you write past the end of an array or dereference a pointer that points nowhere. Nothing stops you at compile time — you find out at run time, with a crash. That is why this course spends whole slots on pointers and arrays.</p>`,
        `<p class="y-chinh">🎯 Slide này nêu ba lý do: C là <strong>nền móng</strong> của các ngôn ngữ hiện đại, C cho <strong>hiệu năng</strong>, và C là ngôn ngữ của <strong>lập trình hệ thống</strong>.</p>
<ul>
<li><strong>Nền móng của lập trình</strong> — slide gọi C là "mẹ" của các ngôn ngữ hiện đại. C++, Java, C# và (ở bản cài đặt gốc) Python đều mọc lên từ C, nên cú pháp <code>if</code>, <code>for</code>, <code>while</code>, dấu ngoặc nhọn, toán tử và cách gọi hàm của chúng về bản chất là của C. Học một lần, đọc được bốn ngôn ngữ.</li>
<li><strong>Hiệu năng</strong> — C là ngôn ngữ bậc thấp: bạn tự quản lý bộ nhớ và trình biên dịch gần như không chèn thêm phần chạy ngầm nào. Không có bộ dọn rác làm chương trình khựng lại, không có trình thông dịch chen giữa mã của bạn và CPU — vì vậy các phép đo thường cho C nhanh hơn ngôn ngữ kịch bản cả một bậc độ lớn.</li>
<li><strong>Lập trình hệ thống</strong> — hệ điều hành (nhân Linux, nhân Windows), trình điều khiển thiết bị, hệ quản trị cơ sở dữ liệu và firmware nhúng đều viết bằng C, vì ở tầng đó bạn buộc phải nói chuyện với địa chỉ phần cứng cố định và phải nhét vừa vài kilobyte RAM.</li>
<li><strong>"Kiểm soát bộ nhớ tinh vi" trông ra sao</strong> — trong C bạn nhìn thấy được địa chỉ của biến, và đó là lý do tồn tại của Slot 10 (Con trỏ):</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main() {
    int x = 10;
    int *p = &amp;x;          /* p giu DIA CHI cua x      */
    printf("%d\\n", x);    /* 10  - gia tri            */
    printf("%d\\n", *p);   /* 10  - gia tri qua con tro */
    *p = 99;              /* ghi thong qua con tro    */
    printf("%d\\n", x);    /* 99  - x doi that         */
    return 0;
}</code></pre>
<p class="pitfall">⚠️ Chính sức mạnh đó là hiểm hoạ: C sẵn sàng cho bạn ghi tràn khỏi mảng hoặc truy cập một con trỏ chẳng trỏ vào đâu. Không có gì chặn bạn lúc biên dịch — bạn chỉ biết lúc chạy, bằng một cú sập chương trình. Vì thế môn này dành hẳn nhiều buổi cho con trỏ và mảng.</p>`],

      [4, 'Why should you study this course? (2/2)',
        `<p class="y-chinh">🎯 Three more reasons: a <strong>rich standard library</strong>, sharper <strong>problem-solving skills</strong>, and a huge <strong>community</strong> of resources.</p>
<ul>
<li><strong>Rich Library Support</strong> — the C standard library is small but complete: <code>stdio.h</code> for input/output, <code>math.h</code> for mathematics, <code>string.h</code> for strings, <code>stdlib.h</code> for conversion and memory, <code>ctype.h</code> for character tests, <code>time.h</code> for dates. Slots 11–12 are dedicated to them (slide 8, "Libraries").</li>
<li><strong>Problem-Solving Skills</strong> — because C hands you no dictionary, no dynamic list and no built-in string type, you must build them from arrays, loops and pointers. That forces you to actually understand the algorithm instead of calling a ready-made method.</li>
<li><strong>Community and Resources</strong> — C has existed since 1972, so nearly every error message you will ever see has already been asked and answered somewhere. The slide explicitly mentions using tutorials and forums to <em>fix bugs in source code</em> — reading other people's diagnoses is a legitimate study skill.</li>
<li><strong>Library example</strong> — three headers, three jobs, one program:</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;math.h&gt;
#include &lt;string.h&gt;

int main() {
    double r = sqrt(16.0);            /* math.h   -&gt; 4.0 */
    char name[20] = "PRF192";
    int  n = strlen(name);            /* string.h -&gt; 6   */
    printf("%.1f %d\\n", r, n);        /* stdio.h  -&gt; 4.0 6 */
    return 0;
}</code></pre>
<p class="dap-an">✅ Output: <code>4.0 6</code> — <code>sqrt(16.0)</code> is 4.0 and "PRF192" has 6 characters (the terminating '\\0' is not counted by <code>strlen</code>).</p>
<p class="meo">💡 Getting help is allowed; copying an answer and submitting it as your own is not — see the academic policy on slide 15. The test is simple: could you re-derive the code on a blank sheet tomorrow?</p>`,
        `<p class="y-chinh">🎯 Ba lý do nữa: <strong>thư viện chuẩn phong phú</strong>, <strong>kỹ năng giải quyết vấn đề</strong> sắc hơn, và một <strong>cộng đồng</strong> tài nguyên khổng lồ.</p>
<ul>
<li><strong>Thư viện chuẩn phong phú</strong> — thư viện chuẩn của C gọn nhưng đủ: <code>stdio.h</code> cho nhập/xuất, <code>math.h</code> cho toán, <code>string.h</code> cho chuỗi, <code>stdlib.h</code> cho chuyển đổi và cấp phát, <code>ctype.h</code> cho kiểm tra ký tự, <code>time.h</code> cho thời gian. Slot 11–12 dành riêng cho chúng (slide 8, mục "Libraries").</li>
<li><strong>Kỹ năng giải quyết vấn đề</strong> — vì C không cho sẵn từ điển, không có danh sách động, cũng không có kiểu chuỗi dựng sẵn, bạn phải tự dựng chúng từ mảng, vòng lặp và con trỏ. Điều đó buộc bạn hiểu thật thuật toán thay vì gọi một phương thức có sẵn.</li>
<li><strong>Cộng đồng và tài nguyên</strong> — C tồn tại từ năm 1972, nên gần như mọi thông báo lỗi bạn sẽ gặp đều đã có người hỏi và có người trả lời ở đâu đó. Slide nói thẳng việc dùng hướng dẫn và diễn đàn để <em>sửa lỗi mã nguồn</em> — đọc chẩn đoán của người khác là một kỹ năng học tập chính đáng.</li>
<li><strong>Ví dụ dùng thư viện</strong> — ba header, ba việc, một chương trình:</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;math.h&gt;
#include &lt;string.h&gt;

int main() {
    double r = sqrt(16.0);            /* math.h   -&gt; 4.0 */
    char name[20] = "PRF192";
    int  n = strlen(name);            /* string.h -&gt; 6   */
    printf("%.1f %d\\n", r, n);        /* stdio.h  -&gt; 4.0 6 */
    return 0;
}</code></pre>
<p class="dap-an">✅ Kết quả in ra: <code>4.0 6</code> — <code>sqrt(16.0)</code> bằng 4.0 và "PRF192" có 6 ký tự (ký tự kết thúc '\\0' không được <code>strlen</code> đếm).</p>
<p class="meo">💡 Nhờ người khác giúp thì được; chép đáp án rồi nộp như của mình thì không — xem chính sách học thuật ở slide 15. Phép thử rất đơn giản: ngày mai đưa bạn tờ giấy trắng, bạn có tự viết lại được đoạn mã đó không?</p>`],

      [5, 'Why C is chosen? — top ten common programming languages',
        `<p class="y-chinh">🎯 The slide answers "why not start with an easier language?" by showing C's place in the <strong>top ten most used programming languages</strong>.</p>
<ul>
<li><strong>What the table is</strong> — a popularity ranking of the kind published by indexes such as TIOBE or IEEE Spectrum. Year to year the order shuffles, but the same handful keeps reappearing: Python, C, C++, Java, C#, JavaScript, SQL, Visual Basic, Go, PHP.</li>
<li><strong>The argument being made</strong> — C is not a museum piece. It has stayed in the top group for decades because the jobs it is good at (kernels, drivers, embedded, runtimes) never went away.</li>
<li><strong>Why it is the right <em>teaching</em> language</strong> — C is small: about 32 keywords and no hidden machinery. A beginner can hold the whole language in their head, and everything the program does is visible in the source.</li>
<li><strong>The hidden benefit</strong> — four of the top ten (C, C++, Java, C#) share C's syntax family. Learning C first makes those four cheap to pick up later, which is exactly the curriculum's plan (PRO192 uses Java).</li>
<li><strong>Counter-argument, answered</strong> — Python is friendlier, true. But Python hides memory, types and the difference between a value and a reference. Those hidden things are precisely the <em>fundamentals</em> this course is named after.</li>
</ul>
<p class="meo">💡 Do not memorise the exact ranking numbers — they change every year and no exam will ask for them. Remember the claim instead: C is simultaneously old, small, fast and still widely used, and that combination is rare.</p>
<p class="pitfall">⚠️ "Popular" does not mean "best for every job". Nobody builds a web front-end in C. The slide argues that C is the best <em>first</em> language for a software engineer, not the best language for all tasks.</p>`,
        `<p class="y-chinh">🎯 Slide này trả lời câu "sao không bắt đầu bằng ngôn ngữ dễ hơn?" bằng cách cho thấy vị trí của C trong <strong>top mười ngôn ngữ lập trình thông dụng</strong>.</p>
<ul>
<li><strong>Bảng đó là gì</strong> — một bảng xếp hạng mức độ phổ biến kiểu các chỉ số TIOBE hay IEEE Spectrum công bố. Thứ tự đổi theo từng năm, nhưng vẫn quanh quẩn từng ấy cái tên: Python, C, C++, Java, C#, JavaScript, SQL, Visual Basic, Go, PHP.</li>
<li><strong>Lập luận mà slide muốn đưa ra</strong> — C không phải đồ cổ trong bảo tàng. Nó trụ trong nhóm đầu suốt mấy chục năm vì những việc nó làm giỏi (nhân hệ điều hành, driver, nhúng, môi trường chạy) chưa bao giờ biến mất.</li>
<li><strong>Vì sao nó là ngôn ngữ <em>để dạy</em> đúng đắn</strong> — C nhỏ: khoảng 32 từ khoá và không có bộ máy chạy ngầm. Người mới có thể ôm trọn cả ngôn ngữ trong đầu, và mọi thứ chương trình làm đều nhìn thấy được ngay trong mã nguồn.</li>
<li><strong>Lợi ích ngầm</strong> — bốn trong top mười (C, C++, Java, C#) cùng họ cú pháp với C. Học C trước khiến bốn ngôn ngữ kia về sau rất rẻ để học thêm, đúng như thiết kế của chương trình đào tạo (PRO192 dùng Java).</li>
<li><strong>Phản biện, và câu trả lời</strong> — Python thân thiện hơn, đúng vậy. Nhưng Python giấu đi bộ nhớ, giấu kiểu dữ liệu, giấu cả sự khác nhau giữa giá trị và tham chiếu. Những thứ bị giấu đó chính là <em>nền tảng</em> mà tên môn học đang nói tới.</li>
</ul>
<p class="meo">💡 Đừng học thuộc các con số thứ hạng — chúng đổi hằng năm và không đề thi nào hỏi. Hãy nhớ luận điểm: C vừa cũ, vừa nhỏ, vừa nhanh, lại vẫn đang được dùng rộng rãi, và tổ hợp đó rất hiếm.</p>
<p class="pitfall">⚠️ "Phổ biến" không có nghĩa là "tốt cho mọi việc". Chẳng ai dựng giao diện web bằng C. Slide đang lập luận rằng C là ngôn ngữ <em>đầu tiên</em> tốt nhất cho một kỹ sư phần mềm, chứ không phải ngôn ngữ tốt nhất cho mọi bài toán.</p>`],

      [6, 'Prerequisites',
        `<p class="y-chinh">🎯 Only two entry requirements, and neither is "previous programming experience": <strong>English reading comprehension</strong> and <strong>basic logical thinking in mathematics</strong>.</p>
<ul>
<li><strong>English reading comprehension</strong> — the textbook, the IDE menus, the standard library documentation and every compiler message are in English. You do not need to speak it fluently; you need to read a paragraph and an error line without panicking.</li>
<li><strong>Why English is non-negotiable</strong> — a compiler error like <code>error: expected ';' before 'return'</code> already tells you the file, the line and the missing character. A student who skips the message and stares at the code instead wastes hours on a five-second fix.</li>
<li><strong>Basic logical thinking in mathematics</strong> — you need conditions (AND, OR, NOT), inequalities, remainders, and the idea of a step-by-step procedure. Nothing beyond secondary school; no calculus is required.</li>
<li><strong>Where the logic shows up immediately</strong> — every <code>if</code> and every loop condition is a logical proposition. "n is divisible by 3 and by 5" becomes code almost word for word:</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main() {
    int n;
    printf("n = ");
    scanf("%d", &amp;n);
    if (n % 3 == 0 &amp;&amp; n % 5 == 0)
        printf("divisible by 15\\n");
    else
        printf("not divisible by 15\\n");
    return 0;
}</code></pre>
<p class="dap-an">✅ Trace it: n = 30 → 30 % 3 is 0 and 30 % 5 is 0 → both true → prints "divisible by 15". n = 9 → 9 % 3 is 0 but 9 % 5 is 4 → the AND is false → prints "not divisible by 15".</p>
<p class="pitfall">⚠️ No prior coding is assumed, so do not be intimidated by classmates who already code. But "no prerequisite" is not "no preparation": slide 12 requires you to read the next session's material <em>at home, before class</em>.</p>`,
        `<p class="y-chinh">🎯 Chỉ có hai điều kiện đầu vào, và không điều kiện nào là "đã từng lập trình": <strong>đọc hiểu tiếng Anh</strong> và <strong>tư duy logic toán học cơ bản</strong>.</p>
<ul>
<li><strong>Đọc hiểu tiếng Anh</strong> — giáo trình, menu của IDE, tài liệu thư viện chuẩn và mọi thông báo của trình biên dịch đều bằng tiếng Anh. Bạn không cần nói trôi chảy; bạn cần đọc được một đoạn văn và một dòng báo lỗi mà không hoảng.</li>
<li><strong>Vì sao tiếng Anh là điều không thể miễn</strong> — một lỗi biên dịch kiểu <code>error: expected ';' before 'return'</code> đã nói sẵn tên tệp, số dòng và ký tự còn thiếu. Sinh viên bỏ qua dòng báo lỗi rồi ngồi nhìn chằm chằm vào mã sẽ mất hàng giờ cho một lỗi sửa trong năm giây.</li>
<li><strong>Tư duy logic toán học cơ bản</strong> — bạn cần điều kiện (VÀ, HOẶC, PHỦ ĐỊNH), bất đẳng thức, phép chia lấy dư, và ý niệm về một quy trình từng bước. Không vượt quá phổ thông; không đòi hỏi giải tích.</li>
<li><strong>Logic xuất hiện ngay lập tức ở đâu</strong> — mỗi <code>if</code> và mỗi điều kiện lặp đều là một mệnh đề logic. Câu "n chia hết cho 3 và cho 5" chuyển thành mã gần như từng chữ một:</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main() {
    int n;
    printf("n = ");
    scanf("%d", &amp;n);
    if (n % 3 == 0 &amp;&amp; n % 5 == 0)
        printf("chia het cho 15\\n");
    else
        printf("khong chia het cho 15\\n");
    return 0;
}</code></pre>
<p class="dap-an">✅ Chạy thử bằng tay: n = 30 → 30 % 3 bằng 0 và 30 % 5 bằng 0 → cả hai đúng → in "chia het cho 15". n = 9 → 9 % 3 bằng 0 nhưng 9 % 5 bằng 4 → phép VÀ sai → in "khong chia het cho 15".</p>
<p class="pitfall">⚠️ Môn học không giả định bạn biết code, nên đừng nao núng vì bạn cùng lớp đã code sẵn. Nhưng "không có điều kiện tiên quyết" không đồng nghĩa với "không cần chuẩn bị": slide 12 yêu cầu bạn đọc trước nội dung buổi sau <em>ở nhà, trước khi tới lớp</em>.</p>`],

      [7, 'Course Objectives',
        `<p class="y-chinh">🎯 Six outcomes the course promises: from <em>explaining</em> how a computer solves a problem, up to <em>solving real problems in C</em>, plus teamwork behaviour.</p>
<ul>
<li><strong>1. Explain the way to solve a real problem using a computer</strong> — the analysis habit: identify Input, Process, Output before writing a single line. This is the skeleton of every workshop and every exam question.</li>
<li><strong>2. Understand the basic concepts of a computer system and software development</strong> — source code → compiler → object code → linker → executable; and the development cycle of analyse, design, code, test, maintain.</li>
<li><strong>3. Understand programming concepts: procedural programming, testing and debugging, unit testing</strong> — "procedural" means the program is organised as functions that call one another (Slot 08–09), not as objects — objects come in PRO192.</li>
<li><strong>4. Read and understand simple C programs</strong> — note the wording: <em>read</em>, not only write. A big share of exam marks comes from tracing given code and predicting its output.</li>
<li><strong>5. Solve real problems using C</strong> — the assignment and practical exam are exactly this: a stated problem, your program, real test data.</li>
<li><strong>6. Individual and team work behaviours</strong> — workshops are done in class in teams; the assignment has both individual and group elements.</li>
</ul>
<p class="dap-an">✅ Objective 1 applied to "compute the average of 3 marks": <strong>Input</strong> = three real numbers a, b, c · <strong>Process</strong> = avg = (a + b + c) / 3 · <strong>Output</strong> = avg with 2 decimals. Only after this table do you open the IDE.</p>
<p class="meo">💡 Objectives are written with measurable verbs — explain, understand, read, solve. Every exam item maps to one of the six. If you can name which objective a question tests, you usually already know the shape of the answer.</p>`,
        `<p class="y-chinh">🎯 Sáu kết quả môn học cam kết: từ <em>giải thích</em> cách máy tính giải một bài toán, tới <em>giải bài toán thực tế bằng C</em>, cộng thêm hành vi làm việc nhóm.</p>
<ul>
<li><strong>1. Giải thích cách giải một bài toán thực tế bằng máy tính</strong> — thói quen phân tích: xác định Đầu vào, Xử lý, Đầu ra trước khi viết một dòng nào. Đây là bộ khung của mọi workshop và mọi câu hỏi thi.</li>
<li><strong>2. Hiểu khái niệm cơ bản về hệ thống máy tính và phát triển phần mềm</strong> — mã nguồn → trình biên dịch → mã đối tượng → trình liên kết → tệp thực thi; và vòng đời phân tích, thiết kế, viết mã, kiểm thử, bảo trì.</li>
<li><strong>3. Hiểu khái niệm lập trình: lập trình thủ tục, kiểm thử và gỡ lỗi, unit testing</strong> — "thủ tục" nghĩa là chương trình được tổ chức thành các hàm gọi lẫn nhau (Slot 08–09), không phải thành đối tượng — đối tượng để dành cho PRO192.</li>
<li><strong>4. Đọc và hiểu được các chương trình C đơn giản</strong> — chú ý cách dùng từ: <em>đọc</em>, không chỉ viết. Một phần lớn điểm thi đến từ việc dò mã cho sẵn và dự đoán kết quả in ra.</li>
<li><strong>5. Giải bài toán thực tế bằng C</strong> — bài assignment và bài thi thực hành đúng là như vậy: một đề bài, chương trình của bạn, dữ liệu kiểm thử thật.</li>
<li><strong>6. Hành vi làm việc cá nhân và làm việc nhóm</strong> — workshop làm tại lớp theo nhóm; assignment có cả phần cá nhân lẫn phần nhóm.</li>
</ul>
<p class="dap-an">✅ Áp dụng mục tiêu 1 vào bài "tính trung bình 3 điểm": <strong>Đầu vào</strong> = ba số thực a, b, c · <strong>Xử lý</strong> = avg = (a + b + c) / 3 · <strong>Đầu ra</strong> = avg lấy 2 chữ số thập phân. Lập xong bảng này rồi mới mở IDE.</p>
<p class="meo">💡 Các mục tiêu đều dùng động từ đo được — giải thích, hiểu, đọc, giải. Mỗi câu hỏi thi đều ứng với một trong sáu mục tiêu. Gọi được tên mục tiêu mà câu hỏi đang kiểm, thường là bạn đã hình dung được dáng của lời giải.</p>`],

      [8, 'Course Description — the nine blocks',
        `<p class="y-chinh">🎯 The whole syllabus in nine topics, ordered so that each one needs everything before it and nothing after it.</p>
<ul>
<li><strong>1. Introduction to PFC</strong> (Slot 01) — what a program is, the compile-link-run chain, algorithms and flowcharts, your first <code>main</code>.</li>
<li><strong>2. Basic Computation</strong> (Slots 02–04) — variables, the types <code>int</code>, <code>float</code>, <code>double</code>, <code>char</code>, operators, and <code>printf</code>/<code>scanf</code>.</li>
<li><strong>3. Basic Logic constructs</strong> (Slots 05–07) — <code>if</code>/<code>else</code>, <code>switch</code>, and the three loops <code>for</code>, <code>while</code>, <code>do…while</code>.</li>
<li><strong>4. Modules and Functions</strong> (Slots 08–09) — splitting a program into functions, parameters, return values, scope. This is where "procedural programming" becomes real.</li>
<li><strong>5. Pointers</strong> (Slot 10) — addresses, <code>&amp;</code> and <code>*</code>, passing by reference. The hardest block, and the one everything after it depends on.</li>
<li><strong>6. Libraries</strong> (Slots 11–12) · <strong>7. Contiguous Storage using Arrays and Struct</strong> (Slots 13–15) · <strong>8. Strings</strong> (Slots 16–18) · <strong>9. Working to file: Text and Binary files</strong> (Slots 19–20).</li>
</ul>
<p class="dap-an">✅ Why this order is not arbitrary: a string in C <em>is</em> a <code>char</code> array ending in '\\0' (needs block 7), an array name behaves like a pointer (needs block 5), and a pointer is passed to a function (needs block 4). Skip one block and the next stops making sense.</p>
<p class="meo">💡 Copy these nine lines into the front page of your notebook and tick them off. When you get lost mid-semester, the list tells you exactly which earlier block to go back and repair.</p>
<p class="pitfall">⚠️ The most common failure pattern in PRF192: coasting through loops, then hitting pointers in Slot 10 with shaky basics. Pointers are not harder than loops — they are just unforgiving of gaps left behind.</p>`,
        `<p class="y-chinh">🎯 Toàn bộ chương trình môn học gói trong chín chủ đề, xếp sao cho mỗi chủ đề cần mọi thứ đứng trước và không cần thứ gì đứng sau.</p>
<ul>
<li><strong>1. Nhập môn PFC</strong> (Slot 01) — chương trình là gì, chuỗi biên dịch–liên kết–chạy, thuật toán và lưu đồ, hàm <code>main</code> đầu tiên của bạn.</li>
<li><strong>2. Tính toán cơ bản</strong> (Slot 02–04) — biến, các kiểu <code>int</code>, <code>float</code>, <code>double</code>, <code>char</code>, các toán tử, và <code>printf</code>/<code>scanf</code>.</li>
<li><strong>3. Cấu trúc điều khiển cơ bản</strong> (Slot 05–07) — <code>if</code>/<code>else</code>, <code>switch</code>, và ba vòng lặp <code>for</code>, <code>while</code>, <code>do…while</code>.</li>
<li><strong>4. Module và hàm</strong> (Slot 08–09) — chia chương trình thành các hàm, tham số, giá trị trả về, phạm vi biến. Đây là chỗ "lập trình thủ tục" trở thành thứ có thật.</li>
<li><strong>5. Con trỏ</strong> (Slot 10) — địa chỉ, hai toán tử <code>&amp;</code> và <code>*</code>, truyền tham chiếu. Khối khó nhất, và là khối mà mọi thứ sau nó đều dựa vào.</li>
<li><strong>6. Thư viện</strong> (Slot 11–12) · <strong>7. Lưu trữ liên tiếp bằng mảng và struct</strong> (Slot 13–15) · <strong>8. Chuỗi ký tự</strong> (Slot 16–18) · <strong>9. Làm việc với tệp: tệp văn bản và tệp nhị phân</strong> (Slot 19–20).</li>
</ul>
<p class="dap-an">✅ Vì sao trình tự này không tuỳ tiện: chuỗi trong C <em>chính là</em> mảng <code>char</code> kết thúc bằng '\\0' (cần khối 7), tên mảng hành xử như con trỏ (cần khối 5), và con trỏ được truyền vào hàm (cần khối 4). Bỏ một khối là khối kế tiếp mất nghĩa.</p>
<p class="meo">💡 Chép chín dòng này vào trang đầu vở rồi tích dần. Giữa kỳ mà thấy lạc, danh sách này chỉ đúng khối nào ở phía trước cần quay lại vá.</p>
<p class="pitfall">⚠️ Kiểu trượt phổ biến nhất của PRF192: học vòng lặp cho qua, tới Slot 10 gặp con trỏ với nền tảng lung lay. Con trỏ không khó hơn vòng lặp — nó chỉ không tha thứ cho những lỗ hổng bỏ lại phía sau.</p>`],

      [9, 'Course Plan — see course plan on FLM',
        `<p class="y-chinh">🎯 One line only: the authoritative, dated, slot-by-slot plan lives on <strong>FLM</strong> (the FPT Learning Materials portal), not in these slides.</p>
<ul>
<li><strong>Why the slide is deliberately empty</strong> — the deck is reused every semester, but dates, room, lecturer and deadlines change. Putting them on a slide would guarantee they are wrong; FLM is the single source of truth.</li>
<li><strong>What FLM actually gives you</strong> — the syllabus (learning outcomes and their assessment mapping), the session-by-session plan with the material for each slot, the list of workshops and the assignment specification, plus the grade weights.</li>
<li><strong>How to use it</strong> — before each session, open the plan, find today's slot, and read the listed chapter <em>beforehand</em>. That is not a suggestion: slide 12 makes "prepare contents of the next session at home" a course rule.</li>
<li><strong>The three portals, three jobs</strong> — <strong>FLM</strong> = syllabus and materials · <strong>CMS/EduNext</strong> = announcements, attendance and discussion (slide 12) · <strong>exam.fpt.edu.vn</strong> = quizzes and chapter assessments (slide 12).</li>
<li><strong>Reading the plan defensively</strong> — mark the Progress Test slots and the assignment deadline in your own calendar the first week. Those dates move rarely, but missing one costs a whole grade component.</li>
</ul>
<p class="meo">💡 If a slide and FLM disagree about a date, weight or deadline, <strong>FLM wins</strong>. Slides are teaching material; FLM is the contract.</p>
<p class="pitfall">⚠️ Classic mistake: assuming "the lecturer will announce it in class". Announcements go through CMS/EduNext, and missing a class does not pause a deadline.</p>`,
        `<p class="y-chinh">🎯 Chỉ một dòng: kế hoạch chính thức, có ngày tháng, chi tiết từng slot nằm trên <strong>FLM</strong> (cổng tài liệu học tập của FPT), không nằm trong bộ slide này.</p>
<ul>
<li><strong>Vì sao slide cố ý để trống</strong> — bộ slide dùng lại mỗi kỳ, nhưng ngày tháng, phòng học, giảng viên và hạn nộp thì đổi. Ghi chúng lên slide là chắc chắn sai; FLM mới là nguồn sự thật duy nhất.</li>
<li><strong>FLM cho bạn những gì</strong> — syllabus (chuẩn đầu ra và bản đồ đánh giá tương ứng), kế hoạch từng buổi kèm tài liệu cho mỗi slot, danh sách workshop và đề bài assignment, cùng bảng trọng số điểm.</li>
<li><strong>Dùng nó thế nào</strong> — trước mỗi buổi, mở kế hoạch, tìm slot hôm nay, và đọc trước chương được liệt kê. Đây không phải lời khuyên: slide 12 đặt "chuẩn bị nội dung buổi sau ở nhà" thành nội quy môn học.</li>
<li><strong>Ba cổng, ba việc</strong> — <strong>FLM</strong> = syllabus và tài liệu · <strong>CMS/EduNext</strong> = thông báo, điểm danh và thảo luận (slide 12) · <strong>exam.fpt.edu.vn</strong> = quiz và bài đánh giá theo chương (slide 12).</li>
<li><strong>Đọc kế hoạch một cách phòng thủ</strong> — ngay tuần đầu, đánh dấu vào lịch riêng của bạn các buổi có Progress Test và hạn nộp assignment. Những mốc đó hiếm khi dời, nhưng lỡ một mốc là mất trọn một thành phần điểm.</li>
</ul>
<p class="meo">💡 Nếu slide và FLM nói khác nhau về ngày, trọng số hay hạn nộp thì <strong>FLM thắng</strong>. Slide là tài liệu giảng dạy; FLM là bản cam kết.</p>
<p class="pitfall">⚠️ Sai lầm kinh điển: mặc định "giảng viên sẽ thông báo trên lớp". Thông báo đi qua CMS/EduNext, và nghỉ một buổi không làm hạn nộp dừng lại.</p>`],

      [10, 'Materials / References',
        `<p class="y-chinh">🎯 Three sources: one course textbook, one classic reference, and one free online course.</p>
<ul>
<li><strong>1. <em>Foundations of Programming Using C</em></strong> — Evan Weaver, July 2006, hard copy available in the FPT University Library. This is the book the course structure follows, so it is the one to read <em>before</em> each session.</li>
<li><strong>2. <em>The C Programming Language</em></strong> — Brian W. Kernighan &amp; Dennis M. Ritchie, 2nd edition, 1988. Universally known as "K&amp;R". Ritchie invented C, so this is the language described by its own author: short, dense, and still the best reference for "what exactly does this construct do?".</li>
<li><strong>3. MOOC: <em>Introduction to C</em></strong> — Chris Szalwinski and Seneca College, at <code>https://intro2c.sdds.ca/</code>. Free, online, with worked examples — useful when a slot's explanation did not land and you want a second wording.</li>
<li><strong>How to use three sources without drowning</strong> — Weaver to follow the course, K&amp;R to settle an argument about semantics, the MOOC when you are stuck. Do not read all three linearly; that is three times the pages for the same syllabus.</li>
<li><strong>Note the 2nd edition of K&amp;R</strong> — the 2nd edition covers ANSI C (C89), which is what this course teaches and what Dev-C++ with TDM-GCC compiles by default. The 1st edition predates function prototypes and will confuse you.</li>
</ul>
<p class="meo">💡 K&amp;R is only ~270 pages but every page is dense. Read it a section at a time <em>after</em> the matching slot, not before — it is a reference, not a tutorial.</p>
<p class="pitfall">⚠️ Photocopying an entire textbook instead of borrowing it is a breach of copyright, which slide 15 lists as a serious offence under the academic policy. The library hard copy exists precisely so you do not need to.</p>`,
        `<p class="y-chinh">🎯 Ba nguồn: một giáo trình chính, một sách tham khảo kinh điển, và một khoá học trực tuyến miễn phí.</p>
<ul>
<li><strong>1. <em>Foundations of Programming Using C</em></strong> — Evan Weaver, tháng 7/2006, có bản in tại Thư viện Đại học FPT. Đây là quyển mà cấu trúc môn học bám theo, nên là quyển cần đọc <em>trước</em> mỗi buổi.</li>
<li><strong>2. <em>The C Programming Language</em></strong> — Brian W. Kernighan &amp; Dennis M. Ritchie, bản in lần 2, năm 1988. Giới lập trình gọi tắt là "K&amp;R". Ritchie chính là người tạo ra C, nên đây là ngôn ngữ do chính tác giả của nó mô tả: ngắn, đặc, và tới giờ vẫn là chỗ tra tốt nhất cho câu hỏi "cấu trúc này chính xác làm gì?".</li>
<li><strong>3. MOOC: <em>Introduction to C</em></strong> — Chris Szalwinski và Seneca College, tại <code>https://intro2c.sdds.ca/</code>. Miễn phí, trực tuyến, có ví dụ giải sẵn — hữu ích khi phần giảng của một slot chưa vào đầu và bạn muốn một cách diễn đạt thứ hai.</li>
<li><strong>Dùng ba nguồn mà không chết đuối</strong> — Weaver để đi theo môn học, K&amp;R để phân xử khi tranh cãi về ngữ nghĩa, MOOC khi bí. Đừng đọc cả ba theo kiểu tuần tự; như vậy là gấp ba số trang cho cùng một chương trình học.</li>
<li><strong>Để ý chi tiết "bản in lần 2" của K&amp;R</strong> — bản 2 viết theo ANSI C (C89), đúng thứ môn này dạy và đúng thứ Dev-C++ với TDM-GCC biên dịch mặc định. Bản 1 ra đời trước cả prototype hàm, đọc vào chỉ thêm rối.</li>
</ul>
<p class="meo">💡 K&amp;R chỉ khoảng 270 trang nhưng trang nào cũng đặc. Hãy đọc từng mục một <em>sau</em> buổi học tương ứng, đừng đọc trước — nó là sách tra cứu, không phải sách hướng dẫn nhập môn.</p>
<p class="pitfall">⚠️ Photo nguyên một quyển giáo trình thay vì mượn thư viện là vi phạm bản quyền, thứ mà slide 15 xếp vào nhóm vi phạm nghiêm trọng của chính sách học thuật. Bản in ở thư viện tồn tại chính là để bạn không phải làm vậy.</p>`],

      [11, 'Tools — Dev-C++ 6.3 (TDM-GCC 9.2)',
        `<p class="y-chinh">🎯 One official IDE for the whole course: <strong>Dev-C++ version 6.3</strong>, bundled with the <strong>TDM-GCC 9.2</strong> compiler, downloadable from <code>https://www.embarcadero.com/free-tools/dev-cpp</code>.</p>
<ul>
<li><strong>IDE vs compiler — two different things</strong> — Dev-C++ is the <em>editor</em> (where you type, and press Compile &amp; Run). TDM-GCC is the <em>compiler</em> (the program that turns your .c file into an .exe). The download bundles both, which is why you install one thing and get a working toolchain.</li>
<li><strong>What actually happens when you press F11</strong> — preprocessor expands your <code>#include</code> lines → compiler translates the C into machine code (an object file) → linker joins your object file with the standard library → you get an .exe → it runs in a console window.</li>
<li><strong>Why everyone uses the same version</strong> — identical compiler, identical error messages, identical behaviour. When the lecturer says "you will see error C2143 on line 7", you actually see it. It also matches the practical exam environment, which is the real reason.</li>
<li><strong>Save your file as <code>.c</code>, not <code>.cpp</code></strong> — the extension chooses the language. A <code>.cpp</code> file is compiled as C++, which accepts things C rejects; you would then fail on the exam machine while "it worked at home".</li>
<li><strong>Minimum check that the install worked</strong> — new source file, paste this, press Compile &amp; Run:</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main() {
    int a = 7, b = 3;
    printf("%d + %d = %d\\n", a, b, a + b);
    printf("%d / %d = %d\\n", a, b, a / b);
    printf("%d %% %d = %d\\n", a, b, a % b);
    return 0;
}</code></pre>
<p class="dap-an">✅ Expected output: <code>7 + 3 = 10</code>, then <code>7 / 3 = 2</code> (integer division truncates, it does not round), then <code>7 % 3 = 1</code>. If all three lines appear, your toolchain is correct. Note <code>%%</code> is how you print a literal percent sign.</p>
<p class="pitfall">⚠️ The console window closing instantly is not a bug and not a failed install — the program ended. Add <code>getchar();</code> (or run from a terminal) if you want to read the output.</p>`,
        `<p class="y-chinh">🎯 Một IDE chính thức cho cả môn: <strong>Dev-C++ phiên bản 6.3</strong>, đi kèm trình biên dịch <strong>TDM-GCC 9.2</strong>, tải tại <code>https://www.embarcadero.com/free-tools/dev-cpp</code>.</p>
<ul>
<li><strong>IDE và trình biên dịch là hai thứ khác nhau</strong> — Dev-C++ là <em>trình soạn thảo</em> (nơi bạn gõ mã và bấm Compile &amp; Run). TDM-GCC là <em>trình biên dịch</em> (chương trình biến tệp .c của bạn thành .exe). Bản tải gói sẵn cả hai, nên cài một lần là có đủ bộ công cụ.</li>
<li><strong>Bấm F11 thì thực sự điều gì xảy ra</strong> — bộ tiền xử lý bung các dòng <code>#include</code> → trình biên dịch dịch mã C thành mã máy (tệp đối tượng) → trình liên kết ghép tệp đối tượng của bạn với thư viện chuẩn → ra tệp .exe → chạy trong cửa sổ console.</li>
<li><strong>Vì sao cả lớp dùng chung một phiên bản</strong> — cùng trình biên dịch, cùng thông báo lỗi, cùng hành vi. Khi giảng viên nói "chỗ này sẽ báo lỗi ở dòng 7" thì bạn thấy đúng lỗi đó. Quan trọng hơn cả: nó khớp với môi trường của kỳ thi thực hành.</li>
<li><strong>Lưu tệp đuôi <code>.c</code>, đừng lưu <code>.cpp</code></strong> — phần mở rộng quyết định ngôn ngữ. Tệp <code>.cpp</code> sẽ được biên dịch theo C++, vốn chấp nhận những thứ C từ chối; rồi bạn rớt trên máy thi trong khi "ở nhà vẫn chạy".</li>
<li><strong>Phép kiểm tối thiểu xem cài đặt đã ổn chưa</strong> — tạo tệp mã nguồn mới, dán đoạn này vào, bấm Compile &amp; Run:</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main() {
    int a = 7, b = 3;
    printf("%d + %d = %d\\n", a, b, a + b);
    printf("%d / %d = %d\\n", a, b, a / b);
    printf("%d %% %d = %d\\n", a, b, a % b);
    return 0;
}</code></pre>
<p class="dap-an">✅ Kết quả mong đợi: <code>7 + 3 = 10</code>, rồi <code>7 / 3 = 2</code> (chia số nguyên là cắt phần thập phân, không làm tròn), rồi <code>7 % 3 = 1</code>. Hiện đủ ba dòng là bộ công cụ đã đúng. Lưu ý <code>%%</code> chính là cách in ra một dấu phần trăm.</p>
<p class="pitfall">⚠️ Cửa sổ console đóng ngay tức khắc không phải lỗi, cũng không phải cài hỏng — chương trình đã chạy xong. Thêm <code>getchar();</code> (hoặc chạy từ cửa sổ dòng lệnh) nếu bạn muốn kịp đọc kết quả.</p>`],

      [12, 'Course Rules — conduct, communication, others',
        `<p class="y-chinh">🎯 The rules split into three groups: <strong>how to conduct</strong> the study, <strong>how to communicate</strong>, and <strong>everything else</strong> (phones, laptops).</p>
<ul>
<li><strong>Prepare the next session at home</strong> — the lecture assumes you have already met the vocabulary. Coming in cold means spending the whole slot decoding terms instead of solving problems.</li>
<li><strong>Follow the lessons in the classroom</strong> — the practical part of every slot is done in class. Workshops are worth 10% of the final grade (slide 13) and are assessed in the room, so there is no remote substitute.</li>
<li><strong>Complete chapter assessments and quizzes on time</strong> at <code>https://exam.fpt.edu.vn</code> — these are timed and they close. A missed window is a lost mark, and slide 13 requires every on-going component to be strictly greater than 0.</li>
<li><strong>Write reports of all labs and assignments in your notebook</strong> — this is the artefact the lecturer inspects. It also becomes your own revision material before the Progress Tests.</li>
<li><strong>Communication</strong> — class exchanges go through <strong>CMS</strong> and <strong>EduNext</strong>; discuss actively within your team and in class; you are free to question and answer at any time.</li>
<li><strong>Others</strong> — phones off, no games, no chatting in class; use your laptop only under the teacher's instruction (so the class does not turn into 30 people browsing).</li>
</ul>
<p class="dap-an">✅ Turned into a weekly routine: <em>before class</em> read the next slot on FLM · <em>in class</em> do the workshop and take notes · <em>same evening</em> write the lab report in the notebook · <em>before the deadline</em> submit the quiz on exam.fpt.edu.vn. Four steps, repeated every slot.</p>
<p class="meo">💡 The rules look like discipline for its own sake, but each one maps to a grade component: preparation → progress tests, workshops in class → 10%, notebook reports → assignment 15%, quizzes → on-going assessment.</p>`,
        `<p class="y-chinh">🎯 Nội quy chia làm ba nhóm: <strong>cách tiến hành</strong> việc học, <strong>cách trao đổi</strong>, và <strong>những thứ khác</strong> (điện thoại, laptop).</p>
<ul>
<li><strong>Chuẩn bị nội dung buổi sau ở nhà</strong> — bài giảng mặc định bạn đã gặp qua các thuật ngữ. Vào lớp với đầu trống nghĩa là tiêu cả buổi để giải mã từ vựng thay vì giải bài toán.</li>
<li><strong>Theo bài học tại lớp</strong> — phần thực hành của mỗi slot làm ngay tại lớp. Workshop chiếm 10% điểm tổng kết (slide 13) và được chấm ngay trong phòng học, nên không có phương án học từ xa thay thế.</li>
<li><strong>Hoàn thành bài đánh giá theo chương và quiz đúng hạn</strong> tại <code>https://exam.fpt.edu.vn</code> — các bài này có giờ và sẽ đóng. Lỡ cửa sổ thời gian là mất điểm, mà slide 13 yêu cầu mọi thành phần điểm quá trình phải lớn hơn 0.</li>
<li><strong>Viết báo cáo mọi bài lab và assignment vào vở</strong> — đây là thứ giảng viên kiểm tra. Nó cũng trở thành tài liệu ôn của chính bạn trước các bài Progress Test.</li>
<li><strong>Trao đổi</strong> — thông tin lớp đi qua <strong>CMS</strong> và <strong>EduNext</strong>; thảo luận tích cực trong nhóm và trong lớp; tự do hỏi và tự do trả lời bất cứ lúc nào.</li>
<li><strong>Những thứ khác</strong> — tắt điện thoại, không chơi game, không tán gẫu trong lớp; chỉ dùng laptop theo hướng dẫn của giảng viên (để lớp học không biến thành 30 người lướt web).</li>
</ul>
<p class="dap-an">✅ Quy thành nếp hằng tuần: <em>trước buổi học</em> đọc slot kế tiếp trên FLM · <em>trong buổi học</em> làm workshop và ghi chép · <em>ngay tối đó</em> viết báo cáo lab vào vở · <em>trước hạn</em> nộp quiz trên exam.fpt.edu.vn. Bốn bước, lặp lại mỗi slot.</p>
<p class="meo">💡 Nội quy nhìn như kỷ luật cho có, nhưng mỗi dòng đều ứng vào một thành phần điểm: chuẩn bị bài → progress test, workshop tại lớp → 10%, báo cáo trong vở → assignment 15%, quiz → điểm quá trình.</p>`],

      [13, 'Evaluation Strategy — the grade formula',
        `<p class="y-chinh">🎯 The most important slide of the deck: <strong>80% attendance is compulsory</strong>, and the mark is <code>Total = 0.15·PT + 0.1·WS + 0.15·AS + 0.3·PE + 0.3·FE</code> out of 10.</p>
<ul>
<li><strong>Attendance gate</strong> — you must attend more than 80% of contact hours. Below that you are <em>not allowed to sit the exam</em> at all, no matter how good your marks are. This is a gate, not a deduction.</li>
<li><strong>The five components</strong> — 02 Progress Tests (PT, 15%) · 05 Workshops (WS, 10%) · 01 Assignment (AS, 15%) · 01 Practical Exam (PE, 30%) · Final Exam (FE, 30%). On-going assessment is 40%, the two exams are 60%.</li>
<li><strong>Pass conditions — all three must hold</strong> — (a) every on-going component &gt; 0 · (b) Final Exam ≥ 4 · (c) Final Result ≥ 5. Only the Final Exam can be retaken, and only if you did not pass.</li>
<li><strong>Worked example 1</strong> — PT = 7, WS = 8, AS = 9, PE = 6, FE = 5. Total = 0.15·7 + 0.1·8 + 0.15·9 + 0.3·6 + 0.3·5 = 1.05 + 0.80 + 1.35 + 1.80 + 1.50 = <strong>6.50</strong>. Every component &gt; 0 ✔, FE = 5 ≥ 4 ✔, 6.50 ≥ 5 ✔.</li>
<li><strong>Worked example 2 — the trap</strong> — same marks but FE = 3.5. Total = 1.05 + 0.80 + 1.35 + 1.80 + 1.05 = <strong>6.05</strong>, comfortably above 5 — and you still fail, because FE = 3.5 &lt; 4. The final exam has a floor of its own.</li>
<li><strong>Worked example 3 — what do I need?</strong> — PT = 4, WS = 5, AS = 4, PE = 3 gives a fixed part of 0.60 + 0.50 + 0.60 + 0.90 = 2.60. Need 2.60 + 0.3·FE ≥ 5 ⇒ 0.3·FE ≥ 2.40 ⇒ FE ≥ 8.0.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main() {
    double pt, ws, as, pe, fe, total;
    printf("PT WS AS PE FE: ");
    scanf("%lf %lf %lf %lf %lf", &amp;pt, &amp;ws, &amp;as, &amp;pe, &amp;fe);
    total = 0.15*pt + 0.1*ws + 0.15*as + 0.3*pe + 0.3*fe;
    printf("Total = %.2f\\n", total);
    if (pt &gt; 0 &amp;&amp; ws &gt; 0 &amp;&amp; as &gt; 0 &amp;&amp; pe &gt; 0 &amp;&amp; fe &gt;= 4 &amp;&amp; total &gt;= 5)
        printf("PASSED\\n");
    else
        printf("NOT PASSED\\n");
    return 0;
}</code></pre>
<p class="dap-an">✅ Feed it <code>7 8 9 6 5</code> → <code>Total = 6.50</code> / PASSED. Feed it <code>7 8 9 6 3.5</code> → <code>Total = 6.05</code> / NOT PASSED. The program is the slide, written in the language of the course.</p>
<p class="pitfall">⚠️ Three separate traps: (1) skipping a workshop leaves WS = 0 and kills the pass condition however high the rest is; (2) a Final Result of 6 does not rescue an FE of 3.9; (3) attendance below 80% blocks the exam before any of this arithmetic matters.</p>`,
        `<p class="y-chinh">🎯 Slide quan trọng nhất của cả deck: <strong>bắt buộc dự trên 80% số giờ</strong>, và điểm tính theo <code>Total = 0.15·PT + 0.1·WS + 0.15·AS + 0.3·PE + 0.3·FE</code> trên thang 10.</p>
<ul>
<li><strong>Cửa điểm danh</strong> — phải dự trên 80% số giờ lên lớp. Dưới mức đó bạn <em>không được dự thi</em>, bất kể điểm quá trình đẹp tới đâu. Đây là một cái cửa, không phải một khoản trừ điểm.</li>
<li><strong>Năm thành phần</strong> — 02 bài Progress Test (PT, 15%) · 05 Workshop (WS, 10%) · 01 Assignment (AS, 15%) · 01 bài thi thực hành (PE, 30%) · Thi cuối kỳ (FE, 30%). Điểm quá trình chiếm 40%, hai bài thi chiếm 60%.</li>
<li><strong>Điều kiện đạt — phải thoả cả ba</strong> — (a) mọi thành phần quá trình &gt; 0 · (b) điểm thi cuối kỳ ≥ 4 · (c) điểm tổng kết ≥ 5. Chỉ bài thi cuối kỳ mới được thi lại, và chỉ khi chưa đạt.</li>
<li><strong>Ví dụ giải 1</strong> — PT = 7, WS = 8, AS = 9, PE = 6, FE = 5. Total = 0,15·7 + 0,1·8 + 0,15·9 + 0,3·6 + 0,3·5 = 1,05 + 0,80 + 1,35 + 1,80 + 1,50 = <strong>6,50</strong>. Mọi thành phần &gt; 0 ✔, FE = 5 ≥ 4 ✔, 6,50 ≥ 5 ✔.</li>
<li><strong>Ví dụ giải 2 — cái bẫy</strong> — vẫn các điểm đó nhưng FE = 3,5. Total = 1,05 + 0,80 + 1,35 + 1,80 + 1,05 = <strong>6,05</strong>, dư sức trên 5 — vậy mà vẫn trượt, vì FE = 3,5 &lt; 4. Bài thi cuối kỳ có sàn riêng của nó.</li>
<li><strong>Ví dụ giải 3 — tôi cần bao nhiêu?</strong> — PT = 4, WS = 5, AS = 4, PE = 3 cho phần cố định 0,60 + 0,50 + 0,60 + 0,90 = 2,60. Cần 2,60 + 0,3·FE ≥ 5 ⇒ 0,3·FE ≥ 2,40 ⇒ FE ≥ 8,0.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main() {
    double pt, ws, as, pe, fe, total;
    printf("PT WS AS PE FE: ");
    scanf("%lf %lf %lf %lf %lf", &amp;pt, &amp;ws, &amp;as, &amp;pe, &amp;fe);
    total = 0.15*pt + 0.1*ws + 0.15*as + 0.3*pe + 0.3*fe;
    printf("Total = %.2f\\n", total);
    if (pt &gt; 0 &amp;&amp; ws &gt; 0 &amp;&amp; as &gt; 0 &amp;&amp; pe &gt; 0 &amp;&amp; fe &gt;= 4 &amp;&amp; total &gt;= 5)
        printf("DAT\\n");
    else
        printf("CHUA DAT\\n");
    return 0;
}</code></pre>
<p class="dap-an">✅ Nhập <code>7 8 9 6 5</code> → <code>Total = 6.50</code> / DAT. Nhập <code>7 8 9 6 3.5</code> → <code>Total = 6.05</code> / CHUA DAT. Chương trình này chính là nội dung slide, viết bằng ngôn ngữ của môn học.</p>
<p class="pitfall">⚠️ Ba cái bẫy riêng biệt: (1) bỏ một buổi workshop làm WS = 0 và huỷ luôn điều kiện đạt dù phần còn lại cao đến đâu; (2) tổng kết 6 không cứu nổi FE 3,9; (3) điểm danh dưới 80% chặn bạn khỏi phòng thi trước khi mọi phép tính trên có ý nghĩa.</p>`],

      [14, 'How to study',
        `<p class="y-chinh">🎯 The slide admits the course is <strong>complex knowledge</strong> — attractive and exciting, but you must "keep a tight grip on it". Then it gives a four-phase method.</p>
<ul>
<li><strong>Read</strong> — first the books, to get the general concept; then reference, study and collect from anywhere else: the internet, your classmates, forums. Two passes, not one: concept first, details second.</li>
<li><strong>Attend lectures</strong> — listen, understand, <em>then</em> make your notes. The order matters: copying slides while the lecturer is still talking produces neither notes nor understanding.</li>
<li><strong>Be active in the lecture</strong> — give your own explanation of a topic, ask questions, and supply examples that are <em>not</em> in the book. Inventing a fresh example is the cheapest test of whether you actually understood.</li>
<li><strong>Practise everything</strong> — do all the exercises and demos "to make your sense". In programming this is not optional: reading code you have never typed produces the illusion of understanding, which collapses at the practical exam.</li>
<li><strong>After classes</strong> — discuss with classmates on the forum, analyse–design–implement the workshops and assignments, write the reports in your notebook, and build a team that supports each other.</li>
</ul>
<p class="dap-an">✅ A concrete loop for one slot: read the FLM material (30 min) → attend and take notes in your own words → re-type every demo from memory, not by copy-paste → change one thing in it and predict the output before running → write the report → post whatever you could not explain on the forum.</p>
<p class="meo">💡 "Change one thing and predict the output before running" is the single highest-value habit in this course. Every correct prediction confirms a mental model; every wrong one shows you exactly which model is broken.</p>
<p class="pitfall">⚠️ The most common self-deception: watching the lecturer type a program, understanding each line as it appears, and concluding you can write it. Close the slides and write it on a blank file — that is the real test, and it is also what the PE asks for.</p>`,
        `<p class="y-chinh">🎯 Slide thừa nhận đây là môn <strong>kiến thức phức tạp</strong> — hấp dẫn và thú vị, nhưng phải "nắm thật chắc". Rồi nó đưa ra một phương pháp bốn giai đoạn.</p>
<ul>
<li><strong>Đọc</strong> — trước hết đọc sách để nắm khái niệm tổng quát; sau đó tra cứu, nghiên cứu, thu thập từ mọi nguồn khác: internet, bạn cùng lớp, diễn đàn. Hai lượt chứ không phải một: khái niệm trước, chi tiết sau.</li>
<li><strong>Dự giảng</strong> — nghe, hiểu, <em>rồi mới</em> ghi chép. Thứ tự này quan trọng: vừa chép slide vừa nghe giảng thì không có nổi cả ghi chép lẫn sự hiểu.</li>
<li><strong>Chủ động trong giờ giảng</strong> — tự trình bày lại một chủ đề, đặt câu hỏi, và đưa ra ví dụ <em>không có</em> trong sách. Tự nghĩ ra một ví dụ mới là phép thử rẻ nhất xem bạn có thật sự hiểu hay không.</li>
<li><strong>Thực hành mọi thứ</strong> — làm hết bài tập và các demo "để cảm được". Với lập trình thì đây không phải tuỳ chọn: đọc đoạn mã mà chưa từng tự gõ chỉ tạo ra ảo giác hiểu bài, và ảo giác đó sụp đổ ở kỳ thi thực hành.</li>
<li><strong>Sau giờ học</strong> — thảo luận với bạn trên diễn đàn, phân tích–thiết kế–cài đặt các workshop và assignment, viết báo cáo vào vở, và dựng một nhóm để hỗ trợ lẫn nhau.</li>
</ul>
<p class="dap-an">✅ Một vòng lặp cụ thể cho mỗi slot: đọc tài liệu trên FLM (30 phút) → tới lớp và ghi chép bằng lời của mình → gõ lại từng demo theo trí nhớ, không copy-paste → sửa một chi tiết trong đó rồi dự đoán kết quả trước khi chạy → viết báo cáo → đăng lên diễn đàn thứ mình chưa giải thích được.</p>
<p class="meo">💡 "Sửa một chi tiết rồi dự đoán kết quả trước khi chạy" là thói quen có giá trị cao nhất của môn này. Mỗi lần dự đoán đúng là một mô hình trong đầu được xác nhận; mỗi lần sai chỉ thẳng ra mô hình nào đang hỏng.</p>
<p class="pitfall">⚠️ Kiểu tự lừa mình phổ biến nhất: nhìn giảng viên gõ chương trình, hiểu từng dòng khi nó hiện ra, rồi kết luận mình viết được. Hãy đóng slide lại và viết vào một tệp trắng — đó mới là phép thử thật, và cũng chính là thứ kỳ thi thực hành đòi hỏi.</p>`],

      [15, 'Academic policy',
        `<p class="y-chinh">🎯 Three named offences, all classed as <strong>serious</strong>: <strong>cheating</strong>, <strong>plagiarism</strong> and <strong>breach of copyright</strong>.</p>
<ul>
<li><strong>Cheating</strong> — the slide defines it during a test or exam as talking, peeking at another student's paper, "or any other clandestine method of transmitting information". Note how broad that last clause is: signals, hidden notes, messaging apps, a shared screen all fall inside it.</li>
<li><strong>Plagiarism</strong> — "using the work of others without citing it; that is, holding the work of others out as your own work". The offence is the <em>absence of attribution</em>, not the act of reading someone else's code.</li>
<li><strong>Breach of Copyright</strong> — photocopying a textbook without the copyright holder's permission violates copyright law. This is exactly why slide 10 points you to the library hard copy.</li>
<li><strong>Where it bites in a programming course</strong> — submitting a friend's assignment with renamed variables, pasting a StackOverflow function into your assignment with no comment saying where it came from, or sharing your own solution with a classmate before the deadline. The last one surprises people: the giver is implicated too.</li>
<li><strong>The line between help and plagiarism</strong> — discussing an <em>approach</em> is encouraged (slides 12 and 14 explicitly ask for it). Handing over <em>code</em> is not. A safe rule: talk about the algorithm with the screen off, then each person writes their own code.</li>
</ul>
<p class="dap-an">✅ Two cases decided: (a) you read a forum answer, understand it, close the tab, and write your own version — that is study, and citing the source in a comment makes it unambiguous. (b) You paste the same answer unchanged and submit it as yours — that is plagiarism, even if you understood every line.</p>
<p class="pitfall">⚠️ Automated similarity checks compare structure, not just text, so renaming variables and reordering functions does not hide a copied submission. And "we worked together" is not a defence when the assignment was specified as individual — check the specification on FLM before collaborating.</p>`,
        `<p class="y-chinh">🎯 Ba hành vi vi phạm được gọi tên, đều xếp loại <strong>nghiêm trọng</strong>: <strong>gian lận</strong>, <strong>đạo văn</strong> và <strong>vi phạm bản quyền</strong>.</p>
<ul>
<li><strong>Gian lận (cheating)</strong> — slide định nghĩa trong lúc kiểm tra hoặc thi là nói chuyện, nhìn bài của bạn khác, "hoặc bất kỳ phương thức lén lút nào để truyền thông tin". Để ý mệnh đề cuối rộng đến mức nào: ra hiệu, giấu phao, nhắn tin, chia sẻ màn hình đều nằm trong đó.</li>
<li><strong>Đạo văn (plagiarism)</strong> — "dùng công trình của người khác mà không trích dẫn; tức là trưng công trình của người khác ra như của mình". Hành vi vi phạm nằm ở chỗ <em>thiếu ghi nguồn</em>, chứ không phải ở việc đọc mã của người khác.</li>
<li><strong>Vi phạm bản quyền</strong> — photo một cuốn giáo trình mà không có phép của chủ sở hữu bản quyền là vi phạm luật bản quyền. Đây đúng là lý do slide 10 chỉ bạn tới bản in ở thư viện.</li>
<li><strong>Nó cắn vào đâu trong một môn lập trình</strong> — nộp bài của bạn cùng lớp sau khi đổi tên biến, dán một hàm từ StackOverflow vào assignment mà không có dòng chú thích ghi nguồn, hoặc đưa bài giải của chính mình cho bạn trước hạn nộp. Điều cuối làm nhiều người bất ngờ: người cho cũng bị liên đới.</li>
<li><strong>Ranh giới giữa giúp đỡ và đạo văn</strong> — bàn về <em>cách tiếp cận</em> thì được khuyến khích (slide 12 và 14 nói thẳng là nên làm). Đưa <em>mã nguồn</em> thì không. Một quy tắc an toàn: tắt màn hình, bàn về thuật toán, rồi mỗi người tự viết mã của mình.</li>
</ul>
<p class="dap-an">✅ Phân xử hai tình huống: (a) bạn đọc một câu trả lời trên diễn đàn, hiểu nó, đóng tab lại và tự viết bản của mình — đó là học, và ghi nguồn vào một dòng chú thích thì càng rõ ràng. (b) Bạn dán nguyên câu trả lời đó rồi nộp như của mình — đó là đạo văn, kể cả khi bạn hiểu từng dòng.</p>
<p class="pitfall">⚠️ Các công cụ dò trùng lặp tự động so cả cấu trúc chứ không chỉ so chữ, nên đổi tên biến và đảo thứ tự hàm không giấu được bài chép. Và "bọn em làm chung" không phải lý do bào chữa khi đề bài quy định làm cá nhân — hãy đọc kỹ đặc tả trên FLM trước khi hợp tác.</p>`],

      [16, 'Enjoy the Course',
        `<p class="y-chinh">🎯 The closing message: be <strong>enthusiastic</strong> about the material, because it is interesting, useful, and an important part of your training as a software engineer.</p>
<ul>
<li><strong>"An important part of your training"</strong> — this is the honest claim. PRF192 is not a box to tick; it is where the mental model of "how a machine executes my instructions" is built, and that model is used in every later subject.</li>
<li><strong>"Our job is to help you learn and enjoy the experience"</strong> — the lecturer's side of the contract: explain, demonstrate, answer.</li>
<li><strong>"We will do our best but we need your help"</strong> — your side: prepare beforehand, ask when stuck, practise after class. A lecture is not a broadcast; the 10% workshop weight exists to make participation concrete.</li>
<li><strong>Why enjoyment is a technical argument, not a slogan</strong> — programming is learned by many short feedback loops. People who enjoy the loop run it hundreds of times a semester; people who dread it run it the night before the deadline. The gap in outcome is entirely explained by the number of loops.</li>
<li><strong>Where the fun actually starts</strong> — around Slot 05, when loops let twenty lines do work that would take a human hours. That is the first moment the machine clearly out-performs doing it by hand.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main() {
    int i, sum = 0;
    for (i = 1; i &lt;= 100; i++)
        sum += i;
    printf("1+2+...+100 = %d\\n", sum);
    return 0;
}</code></pre>
<p class="dap-an">✅ Output: <code>1+2+...+100 = 5050</code>. Check by the pairing trick: 100·101/2 = 5050. Five lines of C reproduce a result that took Gauss a clever idea — and the same five lines handle 1..1000000 by changing one number.</p>
<p class="meo">💡 Keep a folder of every small program you write this semester. By Slot 20 it is a visible record of progress, and it is the fastest revision material you will own before the final exam.</p>`,
        `<p class="y-chinh">🎯 Thông điệp khép lại: hãy <strong>hào hứng</strong> với môn học, vì nó thú vị, hữu ích, và là một phần quan trọng trong quá trình đào tạo bạn thành kỹ sư phần mềm.</p>
<ul>
<li><strong>"Một phần quan trọng trong quá trình đào tạo"</strong> — đây là một khẳng định thành thật. PRF192 không phải cái ô để tích cho xong; nó là chỗ xây nên mô hình trong đầu về "máy thực thi lệnh của tôi như thế nào", và mô hình đó được dùng ở mọi môn về sau.</li>
<li><strong>"Việc của chúng tôi là giúp bạn học và thấy thú vị"</strong> — phần cam kết của giảng viên: giảng, làm mẫu, trả lời.</li>
<li><strong>"Chúng tôi sẽ cố hết sức nhưng cần bạn góp phần"</strong> — phần của bạn: chuẩn bị trước, hỏi khi bí, luyện sau giờ học. Buổi giảng không phải một chương trình phát thanh; trọng số 10% của workshop tồn tại để biến sự tham gia thành thứ đo được.</li>
<li><strong>Vì sao "thấy vui" là một lập luận kỹ thuật chứ không phải khẩu hiệu</strong> — lập trình được học qua rất nhiều vòng phản hồi ngắn. Người thấy vui chạy vòng đó hàng trăm lần mỗi kỳ; người thấy sợ chỉ chạy nó vào đêm trước hạn nộp. Khoảng cách kết quả giải thích trọn vẹn bằng số vòng lặp.</li>
<li><strong>Chỗ cái vui thật sự bắt đầu</strong> — khoảng Slot 05, khi vòng lặp khiến hai mươi dòng làm được việc mà con người phải ngồi hàng giờ. Đó là khoảnh khắc đầu tiên máy tính rõ ràng thắng việc làm tay.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main() {
    int i, sum = 0;
    for (i = 1; i &lt;= 100; i++)
        sum += i;
    printf("1+2+...+100 = %d\\n", sum);
    return 0;
}</code></pre>
<p class="dap-an">✅ Kết quả: <code>1+2+...+100 = 5050</code>. Kiểm lại bằng mẹo ghép cặp: 100·101/2 = 5050. Năm dòng C tái hiện kết quả mà Gauss phải nghĩ ra một ý tưởng tài tình mới có — và cũng năm dòng đó xử lý được 1..1000000 chỉ bằng cách đổi một con số.</p>
<p class="meo">💡 Hãy giữ một thư mục chứa mọi chương trình nhỏ bạn viết trong kỳ. Tới Slot 20 nó là bằng chứng nhìn thấy được về tiến bộ, và là tài liệu ôn nhanh nhất bạn có trước kỳ thi cuối.</p>`],

      [17, 'Install tools for programming — Q&A',
        `<p class="y-chinh">🎯 The session ends hands-on: install the toolchain now, verify it with a real program, and use the remaining time for questions.</p>
<ul>
<li><strong>Step 1 — download and install</strong> — Dev-C++ 6.3 with TDM-GCC 9.2 from <code>https://www.embarcadero.com/free-tools/dev-cpp</code> (slide 11). Accept the bundled compiler; that is the part that actually does the work.</li>
<li><strong>Step 2 — create a source file</strong> — File → New → Source File, then <strong>save it with a <code>.c</code> extension</strong> before compiling. Saving first also gives the compiler somewhere to put the .exe.</li>
<li><strong>Step 3 — compile and run</strong> — Compile &amp; Run (F11). A successful build reports 0 errors, 0 warnings and opens a console window.</li>
<li><strong>Step 4 — verify with input, not just output</strong> — a program that only prints proves the compiler works; a program that reads input proves <code>scanf</code>, the console and your format strings work too.</li>
<li><strong>Step 5 — deliberately break it</strong> — delete one semicolon, compile, and read the error message. Doing this once, on purpose, on a program you know is otherwise correct, teaches you to read compiler output for the rest of the semester.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main() {
    char name[30];
    int  year;
    printf("Your name: ");
    scanf("%s", name);           /* no &amp; : an array is already an address */
    printf("Birth year: ");
    scanf("%d", &amp;year);          /* &amp; needed for a plain int */
    printf("Hello %s, you are about %d years old.\\n", name, 2026 - year);
    return 0;
}</code></pre>
<p class="dap-an">✅ Typing <code>Cuong</code> then <code>2006</code> prints <code>Hello Cuong, you are about 20 years old.</code> Note the two different rules already in play: <code>&amp;year</code> takes the address of an int, while <code>name</code> needs no <code>&amp;</code> because an array name already <em>is</em> the address of its first element — the idea that Slots 10 and 13–15 unpack in full.</p>
<p class="pitfall">⚠️ Common install-day problems, in order of frequency: the file was saved as <code>.cpp</code> (wrong language); antivirus blocked the new .exe (allow it); the path contains spaces or non-ASCII characters (put projects in a simple folder like <code>D:\\PRF192</code>); the console closed too fast (add <code>getchar();</code>).</p>
<p class="meo">💡 Bring a specific question to the Q&amp;A, not "I don't get it". The useful shape is: what I did, what I expected, what actually happened, plus the exact error text. That is also the shape that gets answered on the class forum.</p>`,
        `<p class="y-chinh">🎯 Buổi học kết thúc bằng thực hành: cài bộ công cụ ngay tại chỗ, kiểm chứng bằng một chương trình thật, rồi dùng thời gian còn lại để hỏi đáp.</p>
<ul>
<li><strong>Bước 1 — tải và cài</strong> — Dev-C++ 6.3 kèm TDM-GCC 9.2 tại <code>https://www.embarcadero.com/free-tools/dev-cpp</code> (slide 11). Nhớ giữ phần trình biên dịch đi kèm; đó mới là phần làm việc thật.</li>
<li><strong>Bước 2 — tạo tệp mã nguồn</strong> — File → New → Source File, rồi <strong>lưu với đuôi <code>.c</code></strong> trước khi biên dịch. Lưu trước cũng là để trình biên dịch có chỗ đặt tệp .exe.</li>
<li><strong>Bước 3 — biên dịch và chạy</strong> — Compile &amp; Run (F11). Dựng thành công sẽ báo 0 lỗi, 0 cảnh báo và mở ra một cửa sổ console.</li>
<li><strong>Bước 4 — kiểm bằng cả đầu vào, đừng chỉ kiểm đầu ra</strong> — chương trình chỉ in ra thì mới chứng minh trình biên dịch chạy; chương trình có đọc dữ liệu vào mới chứng minh <code>scanf</code>, cửa sổ console và các chuỗi định dạng của bạn cũng chạy.</li>
<li><strong>Bước 5 — cố tình làm hỏng nó</strong> — xoá một dấu chấm phẩy, biên dịch, và đọc thông báo lỗi. Làm việc này một lần, có chủ đích, trên một chương trình mà bạn biết chắc là đúng, sẽ dạy bạn cách đọc thông báo của trình biên dịch cho cả kỳ còn lại.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main() {
    char name[30];
    int  year;
    printf("Ten cua ban: ");
    scanf("%s", name);           /* khong co &amp; : mang von da la dia chi */
    printf("Nam sinh: ");
    scanf("%d", &amp;year);          /* int thuong thi can &amp; */
    printf("Chao %s, ban khoang %d tuoi.\\n", name, 2026 - year);
    return 0;
}</code></pre>
<p class="dap-an">✅ Gõ <code>Cuong</code> rồi <code>2006</code> sẽ in ra <code>Chao Cuong, ban khoang 20 tuoi.</code> Chú ý hai quy tắc khác nhau đã xuất hiện ngay ở đây: <code>&amp;year</code> lấy địa chỉ của một biến int, còn <code>name</code> không cần <code>&amp;</code> vì tên mảng vốn <em>chính là</em> địa chỉ phần tử đầu tiên — đúng cái ý tưởng mà Slot 10 và Slot 13–15 sẽ mổ xẻ đầy đủ.</p>
<p class="pitfall">⚠️ Các trục trặc thường gặp trong ngày cài đặt, xếp theo tần suất: tệp bị lưu thành <code>.cpp</code> (sai ngôn ngữ); phần mềm diệt virus chặn tệp .exe mới sinh (cho phép nó); đường dẫn có dấu cách hoặc ký tự tiếng Việt (hãy để dự án trong thư mục đơn giản như <code>D:\\PRF192</code>); cửa sổ console đóng quá nhanh (thêm <code>getchar();</code>).</p>
<p class="meo">💡 Hãy mang tới phần hỏi đáp một câu hỏi cụ thể, đừng nói "em không hiểu gì cả". Dạng câu hỏi hữu ích là: em đã làm gì, em mong kết quả gì, thực tế xảy ra gì, kèm nguyên văn thông báo lỗi. Đó cũng là dạng câu hỏi được trả lời trên diễn đàn lớp.</p>`],
    ]),
  ].join('\n'),
};
