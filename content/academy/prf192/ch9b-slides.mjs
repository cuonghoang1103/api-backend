/**
 * PRF192 · Slot 16-18 — Strings, học theo từng slide: PHẦN 2 (slide 25–49).
 * Deck 'prf8' (PRF8), 49 slide, ảnh đã render sẵn lên CDN images/academy/PRF192/v1/prf8/NNN.webp.
 *
 * Nội dung bám ĐÚNG chữ trích từ Slot_16_17_18_Strings.pptx của trường
 * (/tmp/prf192-text/prf8.txt, slide 25→49). Rất nhiều slide đặt MÃ NGUỒN VÀ
 * KHUNG CONSOLE TRONG ẢNH (26, 27, 28, 29, 30, 31, 32, 33, 36, 37, 38, 39, 40,
 * 41, 42, 44, 45, 46, 47) nên các ảnh đó đã được đọc trực tiếp để lấy đúng từng dòng.
 *
 * MỌI chương trình và con số dưới đây đã được biên dịch thật bằng `cc -Wall`
 * (Apple clang 17, arm64-apple-darwin25.6.0) và chạy:
 *   · strlen  → "Hi FPTU!" = 8 ✓ ; char a[10]="abc" → strlen 3 / sizeof 10 ; "a\0b" → strlen 1 / sizeof 4
 *   · strcmp  → SLIDE ghi -1 / 0 / 1 ; đo thật trên clang ra -32 / 0 / 32. Độ lớn KHÔNG được chuẩn quy định.
 *   · strcpy  → dest giữ lại rác sau '\0' (d[3] vẫn là 'F' sau khi chép "xy" đè "Hi FPTU!") ✓
 *               strncpy(buf,"ABCDEFGH",5) → [A][B][C][D][E][#] — KHÔNG có '\0' ✓
 *               char d[5]; strcpy(d,"Hi FPTU!") → clang chặn ngay lúc dịch: "'strcpy' will always overflow"
 *   · strcat  → "This is an" + " example" = "This is an example" (18) ✓
 *   · strupr/strlwr → KHÔNG dịch được trên macOS/clang: "call to undeclared function 'strupr'" (LỖI, không phải cảnh báo)
 *   · strstr  → "FPT" ở chỉ số 11 ✓ ; "fpt" → NULL ; "" → trả về chính s1 ; "abc" trong "abcd" → NULL
 *   · strtok  → 4 token ✓ ; chuỗi gốc thành "Welcome\0to\0FPT\0University\0" nên printf("%s") chỉ in "Welcome" ✓
 *               ",,," và "" → NULL ngay lần gọi đầu ; strtok trên chuỗi hằng → SIGBUS (exit 138)
 *   · Exercise 3 → "Hello"/"World": strcmp = -15, nối "HelloWorld" (10), 'W' ở chỉ số 5 ✓
 *   · lTrim/rTrim/trim/nameStr → tái tạo ĐÚNG mọi ví dụ của slide 35–39, kể cả "Hoa Anh Dao No"
 *     ⚠ strcpy(&s[0], &s[i]) và strcpy(ptr, ptr+1) là CHỒNG LẤN: macOS bắt được và giết chương trình
 *       (SIGTRAP, exit 133). Với -D_FORTIFY_SOURCE=0 thì "chạy được". memmove là bản vá đúng. Đã đo cả ba.
 *     ⚠ rTrim của slide đọc s[-1] khi chuỗi rỗng / toàn dấu cách — đo thật: thoát được nhờ may.
 *   · Exercise 4 → "T nu  na nu  nong  t" (20 ký tự) = 6 từ, count tăng tại i = 0,2,6,9,13,19
 *     — KHỚP TỪNG MŨI TÊN với bảng vết trên slide 40 ✓
 *   · Exercise 5 → "12nua7na9df123459P7 " (20 ký tự) = 5 số, count tăng tại i = 0,5,8,11,18
 *     — KHỚP TỪNG MŨI TÊN với bảng vết trên slide 41 ✓
 *   · Exercise 6 → "con coc trong hang" thay "coc" bằng "bo"/"buom"/"cuc" → đúng cả ba chiều dịch ✓
 *   · Exercise 7 → 10 tên của slide 47 sắp xong ra ĐÚNG Anh·Binh·Chau·Duc·Hoang·Hong·Linh·Nam·Nghia·Tuan ✓
 *   · mảng chuỗi → char names[5][31]: sizeof 155, hai phần tử cách nhau đúng 31 byte ✓
 *     char *p[3]: sizeof 24, mỗi ô 8 byte ; ghi p[0][0]='M' → SIGBUS (exit 138)
 *
 * ⚠ HAI CHỖ SLIDE GỐC TỰ MÂU THUẪN, đã nêu rõ trong bài, KHÔNG im lặng chép lại:
 *   · slide 35: ví dụ trim ghi vào "   I   am   student   " mà ra "I am a student" — chữ "a" từ đâu?
 *   · slide 45: mã khai names[1] = "Pham Ngoc Tho" nhưng ảnh console lại in "Hoang Xuan Son".
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'prf8';

export default {
  title: '9.0b — Slide by slide: string.h, user-defined string functions and arrays of strings (slides 25–49)|||9.0b — Slide bài giảng: string.h, hàm chuỗi tự viết & mảng chuỗi (slide 25–49)',
  slug: 'prf192-9-0b-slides-string-h-mang-chuoi',
  type: 'DOCUMENT',
  description: 'Nửa sau của Slot 16-18 (slide 25–49): toàn bộ tám hàm của thư viện string.h — strlen, strcpy, strcmp, strcat, strupr, strlwr, strstr, strtok — mỗi hàm một bảng ví dụ vào→ra đo bằng chạy thật, kèm các bẫy hay làm rớt điểm (strlen không đếm \'\\0\', strcmp trả 0 khi bằng nhau, strcpy/strcat không kiểm tra kích thước đích, strupr/strlwr không thuộc chuẩn C, strtok sửa thẳng chuỗi gốc). Tiếp đó là bốn hàm chuỗi tự viết lTrim · rTrim · trim · nameStr giảng từng dòng, năm bài Exercise 3–7 giải trọn vẹn bằng chương trình C chạy được, và phần mảng chuỗi (char a[n][m] so với char *a[n], truyền mảng chuỗi vào hàm, sắp xếp danh sách tên). Mọi con số trong bài đều lấy từ `cc -Wall` chạy thật; hai chỗ slide gốc tự mâu thuẫn đã được chỉ ra thay vì chép lại.',
  content: [
    walkHead(D, 25, 49),
    walk(D, [

      [25, 'String Functions: string.h',
        `<p class="y-chinh">🎯 Slide 24 kết luận: C operators cannot be applied to strings — <em>"We need functions for processing arrays and string"</em>. This slide is the answer: a table of the eight <code>string.h</code> functions the course expects you to know by name, and the next eight slides take them one at a time.</p>
<ul>
<li><strong>The eight rows exactly as the slide lists them</strong> — <code>strlen()</code> get the length · <code>strcpy()</code> copy source to destination · <code>strcmp()</code> compare two strings · <code>strcat()</code> concatenate src to the end of dest · <code>strupr()</code> to uppercase · <code>strlwr()</code> to lowercase · <code>strstr()</code> find the address of a substring · <code>strtok()</code> break a string into tokens.</li>
<li><strong>Read the return types before anything else</strong> — they split the table into three families. <code>strlen</code> returns a <em>number</em>. <code>strcmp</code> returns a <em>number that is a verdict</em>. The other six return <code>char *</code> — an <em>address</em>, not a new string. Nothing in this library ever allocates memory for you.</li>
<li><strong>Which of them write into your memory</strong> — <code>strcpy</code>, <code>strcat</code>, <code>strupr</code>, <code>strlwr</code> and <code>strtok</code> all modify the buffer you hand them. <code>strlen</code>, <code>strcmp</code> and <code>strstr</code> only read. That single distinction predicts every crash in this chapter.</li>
<li><strong>Two rows are not standard C</strong> — <code>strupr</code> and <code>strlwr</code> exist in Dev-C++ / Turbo C on Windows, and in no ISO C standard. I compiled the slide's own <code>strupr</code> example with <code>cc -Wall</code> on macOS: it is a hard <strong>error</strong>, not a warning. Slide 30 and 31 deal with this.</li>
<li><strong>Every one of them needs <code>#include &lt;string.h&gt;</code></strong> — forgetting it used to compile silently in C89; since C99 an undeclared function is an error, which is the safety net that caught <code>strupr</code> above.</li>
<li><strong>Link back and forward</strong> — Slot 08-09 taught you that a function needs a prototype; <code>string.h</code> is nothing but a file full of prototypes. Slot 10 taught you pointers; every <code>char *</code> in this table is one.</li>
</ul>
<table>
<tr><th>Function</th><th>Returns</th><th>Reads or writes the buffer?</th><th>Standard C?</th></tr>
<tr><td><code>strlen</code></td><td><code>size_t</code> (a count)</td><td>read only</td><td>yes</td></tr>
<tr><td><code>strcpy</code> / <code>strcat</code></td><td><code>char *</code> (= dest)</td><td><strong>writes dest</strong></td><td>yes</td></tr>
<tr><td><code>strcmp</code></td><td><code>int</code> (a verdict)</td><td>read only</td><td>yes</td></tr>
<tr><td><code>strupr</code> / <code>strlwr</code></td><td><code>char *</code> (= str)</td><td><strong>writes str</strong></td><td><strong>NO</strong></td></tr>
<tr><td><code>strstr</code></td><td><code>char *</code> inside s1, or <code>NULL</code></td><td>read only</td><td>yes</td></tr>
<tr><td><code>strtok</code></td><td><code>char *</code> to a token, or <code>NULL</code></td><td><strong>writes str</strong></td><td>yes</td></tr>
</table>
<p class="meo">💡 Memorise the table by the question "does it change my string?". Six of the eight return <code>char *</code> and it is tempting to think they all behave alike; in fact <code>strstr</code> hands you a pointer <em>into</em> the string you gave it, while <code>strcpy</code> hands back the very pointer you passed as <code>dest</code>. Neither creates anything new.</p>`,
        `<p class="y-chinh">🎯 Slide 24 vừa kết luận: toán tử của C không dùng được cho chuỗi — <em>"We need functions for processing arrays and string"</em>. Slide này chính là câu trả lời: bảng tám hàm của <code>string.h</code> mà môn học yêu cầu thuộc tên, và tám slide kế tiếp sẽ mổ từng hàm một.</p>
<ul>
<li><strong>Tám dòng đúng như slide liệt kê</strong> — <code>strlen()</code> lấy độ dài · <code>strcpy()</code> chép chuỗi nguồn sang chuỗi đích · <code>strcmp()</code> so sánh hai chuỗi · <code>strcat()</code> nối src vào cuối dest · <code>strupr()</code> đổi sang chữ hoa · <code>strlwr()</code> đổi sang chữ thường · <code>strstr()</code> tìm địa chỉ của chuỗi con · <code>strtok()</code> cắt chuỗi thành các mẩu theo dấu phân tách.</li>
<li><strong>Đọc kiểu trả về trước đã</strong> — nó chia bảng thành ba họ. <code>strlen</code> trả về một <em>con số</em>. <code>strcmp</code> trả về một <em>con số mang nghĩa phán quyết</em>. Sáu hàm còn lại trả về <code>char *</code> — một <em>địa chỉ</em>, KHÔNG phải một chuỗi mới. Không hàm nào trong thư viện này cấp phát bộ nhớ giùm bạn.</li>
<li><strong>Hàm nào GHI vào bộ nhớ của bạn</strong> — <code>strcpy</code>, <code>strcat</code>, <code>strupr</code>, <code>strlwr</code> và <code>strtok</code> đều sửa thẳng vùng nhớ bạn đưa vào. Còn <code>strlen</code>, <code>strcmp</code>, <code>strstr</code> chỉ đọc. Đúng một điều phân biệt ấy dự đoán được mọi vụ sập trong cả chương này.</li>
<li><strong>Hai dòng KHÔNG thuộc chuẩn C</strong> — <code>strupr</code> và <code>strlwr</code> có trong Dev-C++ / Turbo C trên Windows, và không có trong bất kỳ chuẩn ISO C nào. Tôi đã dịch đúng ví dụ <code>strupr</code> của slide bằng <code>cc -Wall</code> trên macOS: nó là <strong>lỗi</strong> chứ không phải cảnh báo. Slide 30 và 31 sẽ nói kỹ.</li>
<li><strong>Hàm nào cũng cần <code>#include &lt;string.h&gt;</code></strong> — quên nó thì thời C89 vẫn dịch im lặng; từ C99 gọi hàm chưa khai báo là lỗi, và chính lưới ấy đã tóm được <code>strupr</code> ở trên.</li>
<li><strong>Nối về trước và về sau</strong> — Slot 08-09 dạy hàm phải có prototype; <code>string.h</code> chẳng qua là một tệp chỉ toàn prototype. Slot 10 dạy con trỏ; mỗi chữ <code>char *</code> trong bảng này là một con trỏ.</li>
</ul>
<table>
<tr><th>Hàm</th><th>Trả về</th><th>Đọc hay GHI vùng nhớ?</th><th>Thuộc chuẩn C?</th></tr>
<tr><td><code>strlen</code></td><td><code>size_t</code> (một số đếm)</td><td>chỉ đọc</td><td>có</td></tr>
<tr><td><code>strcpy</code> / <code>strcat</code></td><td><code>char *</code> (= dest)</td><td><strong>GHI vào dest</strong></td><td>có</td></tr>
<tr><td><code>strcmp</code></td><td><code>int</code> (một phán quyết)</td><td>chỉ đọc</td><td>có</td></tr>
<tr><td><code>strupr</code> / <code>strlwr</code></td><td><code>char *</code> (= str)</td><td><strong>GHI vào str</strong></td><td><strong>KHÔNG</strong></td></tr>
<tr><td><code>strstr</code></td><td><code>char *</code> nằm TRONG s1, hoặc <code>NULL</code></td><td>chỉ đọc</td><td>có</td></tr>
<tr><td><code>strtok</code></td><td><code>char *</code> tới một mẩu, hoặc <code>NULL</code></td><td><strong>GHI vào str</strong></td><td>có</td></tr>
</table>
<p class="meo">💡 Học thuộc bảng bằng câu hỏi "hàm này có đổi chuỗi của tôi không?". Sáu trong tám hàm trả về <code>char *</code> nên rất dễ tưởng chúng cư xử giống nhau; thật ra <code>strstr</code> đưa bạn một con trỏ trỏ <em>vào bên trong</em> chuỗi bạn vừa đưa, còn <code>strcpy</code> trả lại đúng con trỏ <code>dest</code> bạn truyền vào. Không hàm nào tạo ra cái gì mới cả.</p>`],

      [26, 'strlen() function',
        `<p class="y-chinh">🎯 <em>"The strlen() function calculates the length of a given string. It doesn't count the null character '\\0'."</em> One sentence, and the second half of it is the part that gets asked in exams.</p>
<ul>
<li><strong>The prototype on the slide</strong> — <code>int strlen(const char *str);</code>. The real prototype in <code>&lt;string.h&gt;</code> is <code>size_t strlen(const char *str);</code>; <code>size_t</code> is an unsigned integer type. The slide's <code>int</code> is close enough for this course, but see the trap below.</li>
<li><strong>The <code>const</code> is a promise</strong> — <code>strlen</code> declares it will not modify your string. That is why you can safely call it on a string literal, unlike <code>strtok</code> on slide 33.</li>
<li><strong>How it works inside</strong> — it starts at <code>str[0]</code> and walks forward counting, stopping at the first <code>'\\0'</code>. So its cost grows with the length of the string; calling it inside a loop condition (<code>for (i = 0; i &lt; strlen(s); i++)</code>) re-scans the whole string on every iteration.</li>
<li><strong><code>strlen</code> versus <code>sizeof</code> — the classic exam question</strong> — <code>strlen</code> counts the characters <em>before</em> the terminator; <code>sizeof</code> on an array counts the <em>bytes reserved</em>, terminator included. I measured: <code>char a[10] = "abc";</code> gives <code>strlen = 3</code> but <code>sizeof = 10</code>. And <code>char b[] = "abc";</code> gives <code>strlen = 3</code>, <code>sizeof = 4</code>.</li>
<li><strong>The example on the slide</strong> — <code>char str[] = "Hi FPTU!";</code> then <code>int length = strlen(str);</code>. Count the characters yourself: H·i·space·F·P·T·U·! = 8. The console box confirms <code>String: Hi FPTU!</code> / <code>Length: 8</code>, and the array itself occupies 9 bytes.</li>
<li><strong>Links to slide 4</strong> — <em>"If a string with the length n is needed, declare it with the length n+1."</em> That n+1 is exactly the gap between <code>strlen</code> and <code>sizeof</code>.</li>
</ul>
<table>
<tr><th>Expression</th><th><code>strlen</code></th><th><code>sizeof</code> (if an array)</th><th>Why</th></tr>
<tr><td><code>"Hi FPTU!"</code></td><td><strong>8</strong></td><td>9</td><td>8 characters + 1 terminator — the slide's own example</td></tr>
<tr><td><code>char a[10] = "abc";</code></td><td><strong>3</strong></td><td><strong>10</strong></td><td>7 bytes are reserved but unused — the classic trap</td></tr>
<tr><td><code>char b[] = "abc";</code></td><td>3</td><td>4</td><td>the compiler sizes the array to fit exactly</td></tr>
<tr><td><code>""</code> (empty string)</td><td><strong>0</strong></td><td>1</td><td>edge case: zero characters, but the <code>'\\0'</code> still occupies a byte</td></tr>
<tr><td><code>"  "</code> (two blanks)</td><td>2</td><td>3</td><td>a blank IS a character — matters for <code>lTrim</code> on slide 36</td></tr>
<tr><td><code>"a\\0b"</code></td><td><strong>1</strong></td><td>4</td><td>edge case: <code>strlen</code> stops at the FIRST <code>'\\0'</code>, the <code>'b'</code> is invisible to it</td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;string.h&gt;

int main()
{
    char str[] = "Hi FPTU!";
    int length = strlen(str);
    printf("String: %s\\n", str);
    printf("Length: %d\\n", length);
    return 0;
}</code></pre>
<p class="dap-an">✅ Compiled with <code>cc -Wall</code> and run: <code>String: Hi FPTU!</code> then <code>Length: 8</code> — exactly the console box on the slide. Adding <code>printf("%zu %zu", strlen(str), sizeof(str));</code> to the same program prints <code>8 9</code>: the terminator is there, it is just not counted.</p>
<p class="pitfall">⚠️ Because the real return type is unsigned, <code>strlen(a) - strlen(b)</code> is a trap: if <code>b</code> is longer, the subtraction wraps to a huge positive number instead of going negative. Write <code>if (strlen(a) &gt; strlen(b))</code>, never <code>if (strlen(a) - strlen(b) &gt; 0)</code>.</p>`,
        `<p class="y-chinh">🎯 <em>"Hàm strlen() tính độ dài của một chuỗi cho trước. Nó KHÔNG đếm ký tự null '\\0'."</em> Một câu thôi, và nửa sau của câu ấy mới là chỗ đề thi hay hỏi.</p>
<ul>
<li><strong>Prototype trên slide</strong> — <code>int strlen(const char *str);</code>. Prototype thật trong <code>&lt;string.h&gt;</code> là <code>size_t strlen(const char *str);</code>, với <code>size_t</code> là một kiểu nguyên KHÔNG dấu. Chữ <code>int</code> của slide đủ dùng cho môn này, nhưng hãy xem cái bẫy ở cuối.</li>
<li><strong>Chữ <code>const</code> là một lời hứa</strong> — <code>strlen</code> tuyên bố nó sẽ không sửa chuỗi của bạn. Nhờ vậy gọi nó trên một chuỗi hằng là an toàn, khác hẳn <code>strtok</code> ở slide 33.</li>
<li><strong>Bên trong nó làm gì</strong> — bắt đầu từ <code>str[0]</code> rồi đi tới và đếm, dừng ở <code>'\\0'</code> đầu tiên. Vậy nên chi phí của nó tỉ lệ với độ dài chuỗi; đặt nó vào điều kiện vòng lặp (<code>for (i = 0; i &lt; strlen(s); i++)</code>) là quét lại cả chuỗi ở MỖI vòng.</li>
<li><strong><code>strlen</code> so với <code>sizeof</code> — câu hỏi kinh điển của đề thi</strong> — <code>strlen</code> đếm số ký tự <em>trước</em> dấu kết thúc; <code>sizeof</code> của một mảng đếm số <em>byte đã đặt chỗ</em>, tính cả dấu kết thúc. Tôi đo thật: <code>char a[10] = "abc";</code> cho <code>strlen = 3</code> nhưng <code>sizeof = 10</code>. Còn <code>char b[] = "abc";</code> cho <code>strlen = 3</code>, <code>sizeof = 4</code>.</li>
<li><strong>Ví dụ trên slide</strong> — <code>char str[] = "Hi FPTU!";</code> rồi <code>int length = strlen(str);</code>. Tự đếm mà xem: H·i·dấu cách·F·P·T·U·! = 8. Khung console xác nhận <code>String: Hi FPTU!</code> / <code>Length: 8</code>, còn bản thân mảng chiếm 9 byte.</li>
<li><strong>Nối với slide 4</strong> — <em>"Cần một chuỗi dài n thì phải khai báo độ dài n+1."</em> Con số n+1 ấy chính là khoảng cách giữa <code>strlen</code> và <code>sizeof</code>.</li>
</ul>
<table>
<tr><th>Biểu thức</th><th><code>strlen</code></th><th><code>sizeof</code> (nếu là mảng)</th><th>Vì sao</th></tr>
<tr><td><code>"Hi FPTU!"</code></td><td><strong>8</strong></td><td>9</td><td>8 ký tự + 1 dấu kết thúc — đúng ví dụ của slide</td></tr>
<tr><td><code>char a[10] = "abc";</code></td><td><strong>3</strong></td><td><strong>10</strong></td><td>7 byte đã đặt chỗ nhưng chưa dùng — cái bẫy kinh điển</td></tr>
<tr><td><code>char b[] = "abc";</code></td><td>3</td><td>4</td><td>trình biên dịch tự cắt mảng vừa khít</td></tr>
<tr><td><code>""</code> (chuỗi rỗng)</td><td><strong>0</strong></td><td>1</td><td>ca biên: không ký tự nào, nhưng <code>'\\0'</code> vẫn chiếm một byte</td></tr>
<tr><td><code>"  "</code> (hai dấu cách)</td><td>2</td><td>3</td><td>dấu cách LÀ ký tự — chuyện này quan trọng với <code>lTrim</code> ở slide 36</td></tr>
<tr><td><code>"a\\0b"</code></td><td><strong>1</strong></td><td>4</td><td>ca biên: <code>strlen</code> dừng ở <code>'\\0'</code> ĐẦU TIÊN, chữ <code>'b'</code> vô hình với nó</td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;string.h&gt;

int main()
{
    char str[] = "Hi FPTU!";
    int length = strlen(str);
    printf("String: %s\\n", str);
    printf("Length: %d\\n", length);
    return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch bằng <code>cc -Wall</code> và chạy thật: in ra <code>String: Hi FPTU!</code> rồi <code>Length: 8</code> — đúng y khung console trên slide. Thêm <code>printf("%zu %zu", strlen(str), sizeof(str));</code> vào cùng chương trình thì in <code>8 9</code>: dấu kết thúc vẫn nằm đó, chỉ là không được đếm.</p>
<p class="pitfall">⚠️ Vì kiểu trả về thật là KHÔNG dấu, phép <code>strlen(a) - strlen(b)</code> là một cái bẫy: nếu <code>b</code> dài hơn thì hiệu không âm đi mà quay vòng thành một số dương khổng lồ. Hãy viết <code>if (strlen(a) &gt; strlen(b))</code>, đừng bao giờ viết <code>if (strlen(a) - strlen(b) &gt; 0)</code>.</p>`],

      [27, 'strcpy() function',
        `<p class="y-chinh">🎯 <em>"The strcpy() is a function used to copy one string to another."</em> It exists because slide 24 already showed you that <code>dest = source;</code> does not compile for arrays — assignment works on primitive types only.</p>
<ul>
<li><strong>The prototype</strong> — <code>char* strcpy(char* dest, const char* src);</code>. Note the asymmetry: <code>dest</code> is plain <code>char*</code> (it will be written to), <code>src</code> is <code>const char*</code> (a promise not to touch it). Argument order is <strong>destination first</strong>, like an assignment written left to right.</li>
<li><strong>What it actually copies</strong> — every byte of <code>src</code> up to <em>and including</em> the <code>'\\0'</code>. That final byte is what makes <code>dest</code> a valid string afterwards; a loop that copies <code>strlen(src)</code> bytes and stops is a bug.</li>
<li><strong>What it returns</strong> — the value of <code>dest</code>, unchanged. That is why <code>printf("%s", strcpy(d, s));</code> works. It does not allocate anything: <code>dest</code> must already be a buffer you own.</li>
<li><strong>The example on the slide</strong> — <code>char source[] = "Hi FPTU!";</code> and <code>char dest[20];</code>, then <code>strcpy(dest, source);</code>. The 20 is not decoration: <code>source</code> needs 9 bytes including the terminator, and 20 &ge; 9 so the copy fits.</li>
<li><strong>The single biggest danger in this chapter</strong> — <code>strcpy</code> does <strong>not</strong> check the size of <code>dest</code>. It cannot: all it receives is an address. Write <code>char d[5]; strcpy(d, "Hi FPTU!");</code> and it will happily write 9 bytes into 5 bytes of space and corrupt whatever follows. Modern clang catches this particular case at compile time — I measured the message <em>"'strcpy' will always overflow; destination buffer has size 5, but the source string has length 9"</em> — but only because both sizes were literals. Make the source a runtime value and nothing warns you.</li>
<li><strong>The safer sibling and its own trap</strong> — <code>strncpy(dest, src, n)</code> copies at most <code>n</code> bytes. But if <code>src</code> is <code>n</code> characters or longer, it writes <strong>no terminator at all</strong>. I measured it: <code>strncpy(buf, "ABCDEFGH", 5)</code> into a buffer pre-filled with <code>#</code> left <code>[A][B][C][D][E][#]</code>. Always follow it with <code>dest[n-1] = '\\0';</code>.</li>
</ul>
<table>
<tr><th><code>dest</code> before</th><th><code>src</code></th><th><code>dest</code> after</th><th><code>strlen(dest)</code></th><th>Note</th></tr>
<tr><td><code>char dest[20]</code> (uninitialised)</td><td><code>"Hi FPTU!"</code></td><td><code>Hi FPTU!</code></td><td>8</td><td>the slide's own example</td></tr>
<tr><td><code>"Hi FPTU!"</code></td><td><code>""</code></td><td><code></code> (empty)</td><td><strong>0</strong></td><td>edge case: one <code>'\\0'</code> written, the rest is now unreachable garbage</td></tr>
<tr><td><code>"Hi FPTU!"</code></td><td><code>"xy"</code></td><td><code>xy</code></td><td>2</td><td>measured: byte 3 still holds <code>'F'</code> — old data is NOT erased, only hidden</td></tr>
<tr><td><code>"abc"</code></td><td><code>"abc"</code></td><td><code>abc</code></td><td>3</td><td>same length: nothing left over, nothing lost</td></tr>
<tr><td><code>char d[5]</code></td><td><code>"Hi FPTU!"</code></td><td colspan="2"><strong>buffer overflow</strong></td><td>clang refuses to build it; with a runtime source it builds and corrupts memory</td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;string.h&gt;

int main()
{
    // defining strings
    char source[] = "Hi FPTU!";
    char dest[20];
    // Copying the source string to dest
    strcpy(dest, source);
    // printing result
    printf("Source: %s\\n", source);
    printf("Destination: %s\\n", dest);
    return 0;
}</code></pre>
<p class="dap-an">✅ Compiled and run: <code>Source: Hi FPTU!</code> / <code>Destination: Hi FPTU!</code> — matches the slide. The extra measurement that matters: after <code>strcpy(dest, "xy")</code> over the same buffer, <code>strlen(dest)</code> is 2 but <code>dest[3]</code> still contains <code>'F'</code> from the earlier copy. <code>strcpy</code> only moves the terminator; it never wipes the tail.</p>
<p class="meo">💡 Read the argument order as an assignment: <code>strcpy(dest, src)</code> is "<code>dest = src</code>". Getting it backwards is a very common slip, and it compiles fine — it just silently destroys your source string instead.</p>`,
        `<p class="y-chinh">🎯 <em>"strcpy() là hàm dùng để chép một chuỗi sang một chuỗi khác."</em> Nó tồn tại vì slide 24 vừa cho bạn thấy <code>dest = source;</code> không dịch được với mảng — phép gán chỉ chạy trên kiểu nguyên thuỷ.</p>
<ul>
<li><strong>Prototype</strong> — <code>char* strcpy(char* dest, const char* src);</code>. Để ý sự bất đối xứng: <code>dest</code> là <code>char*</code> trần (nó sẽ bị GHI vào), còn <code>src</code> là <code>const char*</code> (lời hứa không đụng tới). Thứ tự tham số là <strong>đích trước</strong>, giống một phép gán viết từ trái sang phải.</li>
<li><strong>Nó chép cái gì</strong> — mọi byte của <code>src</code> cho tới <em>và bao gồm</em> dấu <code>'\\0'</code>. Chính byte cuối ấy mới làm <code>dest</code> thành một chuỗi hợp lệ; một vòng lặp chép đúng <code>strlen(src)</code> byte rồi dừng là một cái lỗi.</li>
<li><strong>Nó trả về gì</strong> — chính giá trị <code>dest</code>, không đổi. Vì thế <code>printf("%s", strcpy(d, s));</code> chạy được. Nó KHÔNG cấp phát gì cả: <code>dest</code> phải là vùng nhớ bạn đã có sẵn.</li>
<li><strong>Ví dụ trên slide</strong> — <code>char source[] = "Hi FPTU!";</code> và <code>char dest[20];</code>, rồi <code>strcpy(dest, source);</code>. Con số 20 không phải để trang trí: <code>source</code> cần 9 byte kể cả dấu kết thúc, mà 20 &ge; 9 nên phép chép vừa chỗ.</li>
<li><strong>Mối nguy lớn nhất của cả chương</strong> — <code>strcpy</code> <strong>KHÔNG</strong> kiểm tra kích thước <code>dest</code>. Nó không thể: tất cả những gì nó nhận được chỉ là một địa chỉ. Viết <code>char d[5]; strcpy(d, "Hi FPTU!");</code> thì nó vui vẻ ghi 9 byte vào chỗ 5 byte và phá nát thứ nằm ngay sau. Clang đời mới bắt được đúng ca này lúc dịch — tôi đo được câu <em>"'strcpy' will always overflow; destination buffer has size 5, but the source string has length 9"</em> — nhưng chỉ vì cả hai kích thước đều là hằng. Cho nguồn thành giá trị lúc chạy thì không ai cảnh báo bạn nữa.</li>
<li><strong>Người anh em an toàn hơn, và cái bẫy của chính nó</strong> — <code>strncpy(dest, src, n)</code> chép nhiều nhất <code>n</code> byte. Nhưng nếu <code>src</code> dài từ <code>n</code> ký tự trở lên thì nó <strong>KHÔNG ghi dấu kết thúc nào cả</strong>. Tôi đo thật: <code>strncpy(buf, "ABCDEFGH", 5)</code> vào một mảng đã lấp đầy <code>#</code> để lại <code>[A][B][C][D][E][#]</code>. Luôn viết thêm <code>dest[n-1] = '\\0';</code> ngay sau.</li>
</ul>
<table>
<tr><th><code>dest</code> trước</th><th><code>src</code></th><th><code>dest</code> sau</th><th><code>strlen(dest)</code></th><th>Ghi chú</th></tr>
<tr><td><code>char dest[20]</code> (chưa khởi tạo)</td><td><code>"Hi FPTU!"</code></td><td><code>Hi FPTU!</code></td><td>8</td><td>đúng ví dụ của slide</td></tr>
<tr><td><code>"Hi FPTU!"</code></td><td><code>""</code></td><td><code></code> (rỗng)</td><td><strong>0</strong></td><td>ca biên: chỉ một <code>'\\0'</code> được ghi, phần còn lại thành rác không với tới được</td></tr>
<tr><td><code>"Hi FPTU!"</code></td><td><code>"xy"</code></td><td><code>xy</code></td><td>2</td><td>đo thật: byte thứ 3 vẫn là <code>'F'</code> — dữ liệu cũ KHÔNG bị xoá, chỉ bị che</td></tr>
<tr><td><code>"abc"</code></td><td><code>"abc"</code></td><td><code>abc</code></td><td>3</td><td>độ dài bằng nhau: không thừa gì, không mất gì</td></tr>
<tr><td><code>char d[5]</code></td><td><code>"Hi FPTU!"</code></td><td colspan="2"><strong>tràn bộ đệm</strong></td><td>clang từ chối dịch; với nguồn lúc chạy thì nó dịch được rồi phá bộ nhớ</td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;string.h&gt;

int main()
{
    // defining strings
    char source[] = "Hi FPTU!";
    char dest[20];
    // Copying the source string to dest
    strcpy(dest, source);
    // printing result
    printf("Source: %s\\n", source);
    printf("Destination: %s\\n", dest);
    return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch và chạy thật: <code>Source: Hi FPTU!</code> / <code>Destination: Hi FPTU!</code> — khớp slide. Phép đo thêm mới là chỗ đáng giá: sau khi <code>strcpy(dest, "xy")</code> đè lên cùng vùng nhớ ấy, <code>strlen(dest)</code> bằng 2 nhưng <code>dest[3]</code> vẫn còn chữ <code>'F'</code> của lần chép trước. <code>strcpy</code> chỉ dời dấu kết thúc, nó không hề xoá phần đuôi.</p>
<p class="meo">💡 Đọc thứ tự tham số như một phép gán: <code>strcpy(dest, src)</code> là "<code>dest = src</code>". Viết ngược là lỗi cực kỳ hay gặp, mà nó vẫn dịch được ngon lành — chỉ có điều nó âm thầm phá huỷ chuỗi nguồn của bạn.</p>`],

      [28, 'strcmp() function',
        `<p class="y-chinh">🎯 <em>"This function lexicographically compares … two null-terminated strings and returns an integer based on the outcome."</em> The whole difficulty is that the integer is a <strong>verdict</strong>, not a similarity score — and the verdict for "equal" is <strong>0</strong>.</p>
<ul>
<li><strong>The prototype</strong> — <code>int strcmp(const char *str1, const char *str2);</code>. Both arguments are <code>const</code>: it reads only, so it is safe on literals.</li>
<li><strong>How to read the return value</strong> — negative means <code>str1</code> comes before <code>str2</code>, zero means they are identical, positive means <code>str1</code> comes after. The mnemonic: the sign of <code>strcmp(a, b)</code> is the sign of <code>a - b</code>.</li>
<li><strong>How the verdict is produced</strong> — it walks both strings in step. At the first position where they differ, it returns the difference of the two ASCII codes. If it reaches the end of both together with no difference, it returns 0.</li>
<li><strong>The magnitude is NOT specified</strong> — this is the part the slide hides. The slide's console shows <code>-1</code>, <code>0</code>, <code>1</code>. I compiled and ran the exact same program with <code>cc -Wall</code> and got <strong><code>-32</code>, <code>0</code>, <code>32</code></strong>. Both are correct: 32 is the ASCII gap between <code>'F'</code>(70) and <code>'f'</code>(102), and Dev-C++ simply normalises the result to −1/0/1. <em>Never write <code>if (strcmp(a,b) == 1)</code></em> — it is false on most compilers.</li>
<li><strong>The single most common student error</strong> — writing <code>if (strcmp(a, b))</code> and thinking it means "if equal". It means the opposite: a non-zero value is true in C, so that condition fires exactly when the strings <strong>differ</strong>. The correct test is <code>if (strcmp(a, b) == 0)</code>.</li>
<li><strong>Uppercase sorts before lowercase</strong> — all capitals (65–90) have smaller codes than all small letters (97–122), so <code>"Zebra"</code> compares less than <code>"apple"</code>. If you want a case-insensitive comparison you must fold the case yourself first, which is exactly what <code>nameStr</code> on slide 39 does with <code>tolower</code>.</li>
</ul>
<table>
<tr><th><code>str1</code></th><th><code>str2</code></th><th>Measured (clang)</th><th>Slide / Dev-C++</th><th>Why</th></tr>
<tr><td><code>"FPTU"</code></td><td><code>"fpt"</code></td><td><strong>-32</strong></td><td>-1</td><td><code>'F'</code>(70) − <code>'f'</code>(102) = −32 at position 0</td></tr>
<tr><td><code>"FPTU"</code></td><td><code>"FPTU"</code></td><td><strong>0</strong></td><td>0</td><td>identical — the "equal" verdict is ZERO</td></tr>
<tr><td><code>"fpt"</code></td><td><code>"FPTU"</code></td><td><strong>32</strong></td><td>1</td><td>same comparison, arguments swapped, sign flips</td></tr>
<tr><td><code>""</code></td><td><code>""</code></td><td>0</td><td>0</td><td>edge case: two empty strings are equal</td></tr>
<tr><td><code>""</code></td><td><code>"a"</code></td><td>-97</td><td>-1</td><td>edge case: <code>'\\0'</code>(0) − <code>'a'</code>(97); the empty string sorts first</td></tr>
<tr><td><code>"abc"</code></td><td><code>"abcd"</code></td><td>-100</td><td>-1</td><td>prefix: the shorter one loses, at the terminator</td></tr>
<tr><td><code>"apple"</code></td><td><code>"banana"</code></td><td>-1</td><td>-1</td><td><code>'a'</code>−<code>'b'</code> = −1; here the two agree <em>by coincidence</em></td></tr>
<tr><td><code>"Zebra"</code></td><td><code>"apple"</code></td><td>-7</td><td>-1</td><td>capital letters sort BEFORE small letters</td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
#include &lt;stdlib.h&gt;

int main(){
    char s1[] = "FPTU";
    char s2[] = "fpt";
    char s3[] = "FPTU";

    printf("Comparation of s1 and s2: %d\\n", strcmp(s1,s2));
    printf("Comparation of s1 and s3: %d\\n", strcmp(s1,s3));
    printf("Comparation of s2 and s3: %d\\n", strcmp(s2,s3));

    /* system("pause"); — Windows only, drop it elsewhere */
    return 0;
}</code></pre>
<p class="dap-an">✅ Đáp án — the slide's console reads <code>-1 / 0 / 1</code>. Compiled with <code>cc -Wall</code> and run for real, the same program printed <strong><code>-32 / 0 / 32</code></strong>. The slide is not wrong about the <em>signs</em>, and the signs are all the standard promises; the specific magnitudes are compiler-dependent and Dev-C++ normalises them. Answer exam questions with "negative / zero / positive", and write code that tests only <code>== 0</code>, <code>&lt; 0</code>, <code>&gt; 0</code>.</p>
<p class="pitfall">⚠️ <code>strcmp</code> compares CONTENT. <code>s1 == s2</code> compares ADDRESSES, and for two separate arrays that is always false no matter what they contain. That comparison compiles without a single warning, which is why it survives into so many submitted assignments.</p>`,
        `<p class="y-chinh">🎯 <em>"Hàm này so sánh hai chuỗi kết thúc null theo thứ tự từ điển và trả về một số nguyên tuỳ theo kết quả."</em> Toàn bộ cái khó nằm ở chỗ số nguyên ấy là một <strong>phán quyết</strong> chứ không phải điểm giống nhau — và phán quyết cho "bằng nhau" là số <strong>0</strong>.</p>
<ul>
<li><strong>Prototype</strong> — <code>int strcmp(const char *str1, const char *str2);</code>. Cả hai tham số đều <code>const</code>: nó chỉ đọc, nên dùng với chuỗi hằng là an toàn.</li>
<li><strong>Đọc giá trị trả về thế nào</strong> — âm nghĩa là <code>str1</code> đứng TRƯỚC <code>str2</code>, bằng 0 nghĩa là giống hệt nhau, dương nghĩa là <code>str1</code> đứng SAU. Cách nhớ: dấu của <code>strcmp(a, b)</code> chính là dấu của <code>a - b</code>.</li>
<li><strong>Phán quyết được tạo ra thế nào</strong> — nó đi song song trên hai chuỗi. Tại vị trí ĐẦU TIÊN khác nhau, nó trả về hiệu hai mã ASCII. Nếu đi tới cuối cả hai mà không có chỗ nào khác, nó trả về 0.</li>
<li><strong>Độ lớn KHÔNG được quy định</strong> — đây là chỗ slide giấu. Console trên slide ghi <code>-1</code>, <code>0</code>, <code>1</code>. Tôi biên dịch và chạy đúng chương trình ấy bằng <code>cc -Wall</code> và nhận được <strong><code>-32</code>, <code>0</code>, <code>32</code></strong>. Cả hai đều đúng: 32 là khoảng cách ASCII giữa <code>'F'</code>(70) và <code>'f'</code>(102), còn Dev-C++ chỉ đơn giản chuẩn hoá kết quả về −1/0/1. <em>Đừng bao giờ viết <code>if (strcmp(a,b) == 1)</code></em> — trên phần lớn trình biên dịch nó sai.</li>
<li><strong>Lỗi sinh viên hay mắc nhất</strong> — viết <code>if (strcmp(a, b))</code> và tưởng nó nghĩa là "nếu bằng nhau". Nó nghĩa ngược lại: trong C giá trị khác 0 là ĐÚNG, nên điều kiện ấy chỉ bật khi hai chuỗi <strong>KHÁC nhau</strong>. Phép kiểm đúng là <code>if (strcmp(a, b) == 0)</code>.</li>
<li><strong>Chữ HOA đứng trước chữ thường</strong> — mọi chữ hoa (65–90) có mã nhỏ hơn mọi chữ thường (97–122), nên <code>"Zebra"</code> nhỏ hơn <code>"apple"</code>. Muốn so sánh không phân biệt hoa thường thì bạn phải tự đồng nhất chữ trước, và đó đúng là việc <code>nameStr</code> ở slide 39 làm với <code>tolower</code>.</li>
</ul>
<table>
<tr><th><code>str1</code></th><th><code>str2</code></th><th>Đo thật (clang)</th><th>Slide / Dev-C++</th><th>Vì sao</th></tr>
<tr><td><code>"FPTU"</code></td><td><code>"fpt"</code></td><td><strong>-32</strong></td><td>-1</td><td><code>'F'</code>(70) − <code>'f'</code>(102) = −32 ngay vị trí 0</td></tr>
<tr><td><code>"FPTU"</code></td><td><code>"FPTU"</code></td><td><strong>0</strong></td><td>0</td><td>giống hệt — phán quyết "bằng nhau" là SỐ KHÔNG</td></tr>
<tr><td><code>"fpt"</code></td><td><code>"FPTU"</code></td><td><strong>32</strong></td><td>1</td><td>vẫn phép so ấy, đảo tham số, đảo dấu</td></tr>
<tr><td><code>""</code></td><td><code>""</code></td><td>0</td><td>0</td><td>ca biên: hai chuỗi rỗng bằng nhau</td></tr>
<tr><td><code>""</code></td><td><code>"a"</code></td><td>-97</td><td>-1</td><td>ca biên: <code>'\\0'</code>(0) − <code>'a'</code>(97); chuỗi rỗng đứng đầu bảng</td></tr>
<tr><td><code>"abc"</code></td><td><code>"abcd"</code></td><td>-100</td><td>-1</td><td>tiền tố: chuỗi ngắn hơn thua, ngay tại dấu kết thúc</td></tr>
<tr><td><code>"apple"</code></td><td><code>"banana"</code></td><td>-1</td><td>-1</td><td><code>'a'</code>−<code>'b'</code> = −1; ở đây hai bên trùng nhau <em>do tình cờ</em></td></tr>
<tr><td><code>"Zebra"</code></td><td><code>"apple"</code></td><td>-7</td><td>-1</td><td>chữ hoa xếp TRƯỚC chữ thường</td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
#include &lt;stdlib.h&gt;

int main(){
    char s1[] = "FPTU";
    char s2[] = "fpt";
    char s3[] = "FPTU";

    printf("Comparation of s1 and s2: %d\\n", strcmp(s1,s2));
    printf("Comparation of s1 and s3: %d\\n", strcmp(s1,s3));
    printf("Comparation of s2 and s3: %d\\n", strcmp(s2,s3));

    /* system("pause"); — chi co tren Windows, noi khac thi bo */
    return 0;
}</code></pre>
<p class="dap-an">✅ Đáp án — console trên slide ghi <code>-1 / 0 / 1</code>. Biên dịch bằng <code>cc -Wall</code> và chạy thật thì đúng chương trình ấy in ra <strong><code>-32 / 0 / 32</code></strong>. Slide KHÔNG sai về <em>dấu</em>, mà dấu mới là toàn bộ điều chuẩn C bảo đảm; còn độ lớn cụ thể thì tuỳ trình biên dịch, và Dev-C++ đã chuẩn hoá nó. Khi làm bài hãy trả lời "âm / bằng 0 / dương", và khi viết mã chỉ kiểm <code>== 0</code>, <code>&lt; 0</code>, <code>&gt; 0</code>.</p>
<p class="pitfall">⚠️ <code>strcmp</code> so sánh NỘI DUNG. Còn <code>s1 == s2</code> so sánh ĐỊA CHỈ, và với hai mảng riêng biệt thì nó luôn sai bất kể bên trong chứa gì. Phép so ấy dịch được mà không một lời cảnh báo, nên nó sống sót trong rất nhiều bài nộp.</p>`],

      [29, 'strcat() function',
        `<p class="y-chinh">🎯 <em>"It will append a copy of the source string to the end of the destination string."</em> The two words that carry the whole slide are <strong>"to the end"</strong> — <code>strcat</code> must first FIND the end of <code>dest</code>, and it finds it by looking for <code>'\\0'</code>.</p>
<ul>
<li><strong>The prototype</strong> — <code>char* strcat(char* dest, const char* src);</code>. Same shape as <code>strcpy</code>: destination first, source is <code>const</code>, the return value is <code>dest</code> again.</li>
<li><strong>What it does step by step</strong> — (1) scan <code>dest</code> for its <code>'\\0'</code>; (2) copy <code>src</code> starting at that byte, overwriting the old terminator; (3) write a new <code>'\\0'</code> after the last copied character. So the result is one valid string, not two glued fragments.</li>
<li><strong>The consequence nobody tells you</strong> — <code>dest</code> must ALREADY be a valid string. <code>char dest[50]; strcat(dest, "abc");</code> is undefined behaviour, because an uninitialised array has no <code>'\\0'</code> anywhere in particular and <code>strcat</code> will append at whatever random byte it finds first. The fix is one character: <code>char dest[50] = "";</code> or <code>dest[0] = '\\0';</code>. I verified both forms work and produce <code>abc</code>.</li>
<li><strong>The example on the slide</strong> — <code>char dest[50] = "This is an";</code> and <code>char src[50] = " example";</code>. Note the leading blank inside <code>src</code>: <code>strcat</code> adds nothing of its own, so if you want a space between the two words you have to supply it. The console reads <code>dest Before: This is an</code> then <code>dest After: This is an example</code>.</li>
<li><strong>Sizing the destination</strong> — <code>dest</code> needs room for <code>strlen(dest) + strlen(src) + 1</code> bytes. Here 10 + 8 + 1 = 19, and the array is 50, so it fits with room to spare. Like <code>strcpy</code>, <code>strcat</code> checks nothing; the 50 is your responsibility.</li>
<li><strong>The safer sibling</strong> — <code>strncat(dest, src, n)</code> appends at most <code>n</code> characters and, unlike <code>strncpy</code>, it <em>always</em> adds the terminator. Its <code>n</code> counts only the characters taken from <code>src</code>, so the buffer must still have <code>n + 1</code> free bytes.</li>
</ul>
<table>
<tr><th><code>dest</code> before</th><th><code>src</code></th><th><code>dest</code> after</th><th><code>strlen</code></th><th>Note</th></tr>
<tr><td><code>"This is an"</code></td><td><code>" example"</code></td><td><code>This is an example</code></td><td><strong>18</strong></td><td>the slide's example; the blank came from <code>src</code></td></tr>
<tr><td><code>"abc"</code></td><td><code>""</code></td><td><code>abc</code></td><td>3</td><td>edge case: appending nothing changes nothing</td></tr>
<tr><td><code>""</code></td><td><code>"abc"</code></td><td><code>abc</code></td><td>3</td><td>edge case: an empty but VALID dest — this is the safe way to start</td></tr>
<tr><td><code>"ab"</code></td><td><code>"ab"</code></td><td><code>abab</code></td><td>4</td><td>equal lengths; the copy is independent of the original</td></tr>
<tr><td><code>"Hoang"</code></td><td><code>" "</code> then <code>"Thi"</code></td><td><code>Hoang Thi</code></td><td>9</td><td>chained calls — how you build a full name</td></tr>
<tr><td><code>char d[50];</code> uninitialised</td><td><code>"abc"</code></td><td colspan="2"><strong>undefined behaviour</strong></td><td>no <code>'\\0'</code> to find — write <code>= ""</code> first</td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
int main(){
    char dest[50] = "This is an";
    char src[50]  = " example";
    printf("dest Before: %s\\n", dest);
    // concatenating src at the end of dest
    strcat(dest, src);
    printf("dest After: %s", dest);
    return 0;
}</code></pre>
<p class="dap-an">✅ Compiled with <code>cc -Wall</code> and run: <code>dest Before: This is an</code> then <code>dest After: This is an example</code> — identical to the slide's console. Measured afterwards: <code>strlen(dest) = 18</code> while <code>sizeof(dest) = 50</code>, so 31 bytes remain free for further appends.</p>
<p class="meo">💡 <code>strcat</code> re-scans <code>dest</code> from the beginning on every call. Concatenating n pieces one by one therefore costs roughly n² work — fine for a name, bad for a loop building a long text. If you already know where the end is, <code>strcpy(dest + len, src)</code> does the same job in one pass.</p>`,
        `<p class="y-chinh">🎯 <em>"Nó sẽ nối một bản sao của chuỗi nguồn vào CUỐI chuỗi đích."</em> Hai chữ gánh cả slide là <strong>"vào cuối"</strong> — <code>strcat</code> phải TÌM ra chỗ kết thúc của <code>dest</code> trước đã, và nó tìm bằng cách dò dấu <code>'\\0'</code>.</p>
<ul>
<li><strong>Prototype</strong> — <code>char* strcat(char* dest, const char* src);</code>. Cùng hình dạng với <code>strcpy</code>: đích trước, nguồn là <code>const</code>, giá trị trả về lại là <code>dest</code>.</li>
<li><strong>Nó làm gì, từng bước</strong> — (1) quét <code>dest</code> tìm dấu <code>'\\0'</code> của nó; (2) chép <code>src</code> bắt đầu từ đúng byte ấy, đè lên dấu kết thúc cũ; (3) ghi một <code>'\\0'</code> mới sau ký tự cuối vừa chép. Nhờ vậy kết quả là MỘT chuỗi hợp lệ chứ không phải hai mẩu dán lại.</li>
<li><strong>Hệ quả không ai nói cho bạn</strong> — <code>dest</code> phải ĐÃ là một chuỗi hợp lệ. <code>char dest[50]; strcat(dest, "abc");</code> là hành vi không xác định, vì một mảng chưa khởi tạo không có dấu <code>'\\0'</code> ở chỗ nào xác định cả, và <code>strcat</code> sẽ nối vào đúng cái byte rác nó gặp đầu tiên. Cách chữa chỉ tốn một ký tự: <code>char dest[50] = "";</code> hoặc <code>dest[0] = '\\0';</code>. Tôi đã thử cả hai dạng, đều ra <code>abc</code>.</li>
<li><strong>Ví dụ trên slide</strong> — <code>char dest[50] = "This is an";</code> và <code>char src[50] = " example";</code>. Để ý dấu cách nằm SẴN trong <code>src</code>: <code>strcat</code> không tự thêm gì hết, nên muốn có khoảng trắng giữa hai chữ thì bạn phải tự đưa vào. Console đọc được <code>dest Before: This is an</code> rồi <code>dest After: This is an example</code>.</li>
<li><strong>Tính kích thước chuỗi đích</strong> — <code>dest</code> cần chỗ cho <code>strlen(dest) + strlen(src) + 1</code> byte. Ở đây 10 + 8 + 1 = 19, mảng có 50, nên vừa và còn dư. Cũng như <code>strcpy</code>, <code>strcat</code> chẳng kiểm tra gì; con số 50 là trách nhiệm của bạn.</li>
<li><strong>Người anh em an toàn hơn</strong> — <code>strncat(dest, src, n)</code> nối nhiều nhất <code>n</code> ký tự và, khác <code>strncpy</code>, nó <em>luôn</em> ghi dấu kết thúc. Con số <code>n</code> của nó chỉ đếm ký tự lấy từ <code>src</code>, nên vùng nhớ vẫn phải còn trống <code>n + 1</code> byte.</li>
</ul>
<table>
<tr><th><code>dest</code> trước</th><th><code>src</code></th><th><code>dest</code> sau</th><th><code>strlen</code></th><th>Ghi chú</th></tr>
<tr><td><code>"This is an"</code></td><td><code>" example"</code></td><td><code>This is an example</code></td><td><strong>18</strong></td><td>ví dụ của slide; dấu cách đến từ <code>src</code></td></tr>
<tr><td><code>"abc"</code></td><td><code>""</code></td><td><code>abc</code></td><td>3</td><td>ca biên: nối chuỗi rỗng thì không đổi gì</td></tr>
<tr><td><code>""</code></td><td><code>"abc"</code></td><td><code>abc</code></td><td>3</td><td>ca biên: dest rỗng nhưng HỢP LỆ — đây là cách khởi đầu an toàn</td></tr>
<tr><td><code>"ab"</code></td><td><code>"ab"</code></td><td><code>abab</code></td><td>4</td><td>độ dài bằng nhau; bản chép độc lập với bản gốc</td></tr>
<tr><td><code>"Hoang"</code></td><td><code>" "</code> rồi <code>"Thi"</code></td><td><code>Hoang Thi</code></td><td>9</td><td>gọi nối tiếp — cách ghép một họ tên đầy đủ</td></tr>
<tr><td><code>char d[50];</code> chưa khởi tạo</td><td><code>"abc"</code></td><td colspan="2"><strong>hành vi không xác định</strong></td><td>không có <code>'\\0'</code> nào để tìm — phải viết <code>= ""</code> trước</td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
int main(){
    char dest[50] = "This is an";
    char src[50]  = " example";
    printf("dest Before: %s\\n", dest);
    // concatenating src at the end of dest
    strcat(dest, src);
    printf("dest After: %s", dest);
    return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch bằng <code>cc -Wall</code> và chạy thật: <code>dest Before: This is an</code> rồi <code>dest After: This is an example</code> — y hệt console trên slide. Đo thêm sau đó: <code>strlen(dest) = 18</code> trong khi <code>sizeof(dest) = 50</code>, tức còn dư 31 byte cho những lần nối sau.</p>
<p class="meo">💡 <code>strcat</code> quét lại <code>dest</code> từ đầu ở MỖI lần gọi. Nối n mẩu lần lượt vì thế tốn cỡ n² công — không sao với một cái tên, nhưng tệ với vòng lặp dựng một văn bản dài. Nếu bạn đã biết chỗ kết thúc, <code>strcpy(dest + len, src)</code> làm đúng việc ấy chỉ trong một lượt.</p>`],

      [30, 'strupr() function',
        `<p class="y-chinh">🎯 <em>"The strupr() function is used to converts a given string to uppercase."</em> Everything the slide says about <em>what</em> it does is right. What the slide does not say is that this function <strong>is not part of the C language</strong> — and that is the most useful thing on the whole slide.</p>
<ul>
<li><strong>The prototype</strong> — <code>char *strupr(char *str);</code>. No <code>const</code> on the argument, and that is the tell: it rewrites your buffer in place and returns the same pointer, which is why <code>printf("%s\\n", strupr(str));</code> on the slide prints the converted text.</li>
<li><strong>It converts in place</strong> — the original is destroyed. If you need both cases, copy first: <code>strcpy(backup, str); strupr(str);</code>.</li>
<li><strong>Where it exists and where it does not</strong> — <code>strupr</code> / <code>strlwr</code> are old Borland/Microsoft extensions. They ship with Turbo C and Dev-C++ on Windows. They appear in <strong>no</strong> ISO C standard (C89, C99, C11, C17, C23) and they are absent from glibc on Linux and from the macOS libc.</li>
<li><strong>Measured, not guessed</strong> — I put the slide's exact program in a file and ran <code>cc -Wall</code> on macOS (Apple clang 17). The result is a hard <strong>error</strong>: <em>"call to undeclared function 'strupr'; ISO C99 and later do not support implicit function declarations"</em>, plus a second complaint that <code>%s</code> received an <code>int</code>. The program does not build at all.</li>
<li><strong>Why the second complaint matters</strong> — it shows what used to happen in the old days. Before C99 an undeclared function was assumed to return <code>int</code>, so the code compiled and then fed a truncated integer to <code>%s</code>. That is how "it works on my machine" bugs were born.</li>
<li><strong>The portable replacement is four lines</strong> — <code>toupper()</code> from <code>&lt;ctype.h&gt;</code> converts one character, so a loop over the string does the whole job and works everywhere. Cast to <code>unsigned char</code> inside the call: <code>toupper</code> is undefined for negative values, which a plain <code>char</code> can hold.</li>
</ul>
<table>
<tr><th>Input</th><th>Output (measured, own implementation)</th><th>Note</th></tr>
<tr><td><code>"Welcome to FPT University!"</code></td><td><code>WELCOME TO FPT UNIVERSITY!</code></td><td>the slide's own example — reproduced exactly</td></tr>
<tr><td><code>""</code></td><td><code></code> (empty)</td><td>edge case: the loop body never runs, nothing breaks</td></tr>
<tr><td><code>"ABC123xyz"</code></td><td><code>ABC123XYZ</code></td><td>digits are left alone; already-capital letters are unchanged</td></tr>
<tr><td><code>"prf192"</code></td><td><code>PRF192</code></td><td>the length never changes — conversion is byte for byte</td></tr>
<tr><td><code>"a-b_c"</code></td><td><code>A-B_C</code></td><td>punctuation passes through untouched</td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
#include &lt;ctype.h&gt;

/* ban tu viet — chay duoc tren MOI trinh bien dich */
char* myStrupr(char *s)
{
    int i;
    for (i = 0; s[i] != '\\0'; i++)
        s[i] = toupper((unsigned char)s[i]);
    return s;
}

int main()
{
    char str[] = "Welcome to FPT University!";
    printf("%s\\n", myStrupr(str));
    return 0;
}</code></pre>
<p class="dap-an">✅ Đáp án — the slide's version, compiled verbatim with <code>cc -Wall</code>, produced <strong>a compile error</strong>, not the console box shown: <em>"call to undeclared function 'strupr'"</em>. The slide is describing a Dev-C++/Windows extension and does not say so. The replacement above compiled clean and printed <code>WELCOME TO FPT UNIVERSITY!</code> — the exact text in the slide's console. I am not editing the slide; I am telling you that on a lab machine that is not Windows you will need those four lines.</p>
<p class="pitfall">⚠️ If your exam paper asks you to "use strupr", write it and add one line of comment saying it is a non-standard extension. If your own code must run anywhere — a marked assignment, a CI job, a Linux server — use the <code>toupper</code> loop. Do not go hunting for a library to install: there is nothing to install, the function simply does not exist there.</p>`,
        `<p class="y-chinh">🎯 <em>"Hàm strupr() dùng để đổi một chuỗi cho trước sang chữ HOA."</em> Mọi điều slide nói về <em>việc</em> nó làm đều đúng. Điều slide KHÔNG nói là hàm này <strong>không thuộc ngôn ngữ C</strong> — và đó mới là thứ hữu ích nhất trên cả slide.</p>
<ul>
<li><strong>Prototype</strong> — <code>char *strupr(char *str);</code>. Không có <code>const</code> ở tham số, và đó là dấu hiệu: nó ghi đè thẳng lên vùng nhớ của bạn rồi trả lại chính con trỏ ấy, nhờ vậy <code>printf("%s\\n", strupr(str));</code> trên slide in ra được văn bản đã đổi.</li>
<li><strong>Nó đổi TẠI CHỖ</strong> — bản gốc mất luôn. Cần giữ cả hai dạng thì phải chép trước: <code>strcpy(backup, str); strupr(str);</code>.</li>
<li><strong>Nó có ở đâu và không có ở đâu</strong> — <code>strupr</code> / <code>strlwr</code> là phần mở rộng cũ của Borland/Microsoft. Chúng đi kèm Turbo C và Dev-C++ trên Windows. Chúng <strong>KHÔNG</strong> có trong bất kỳ chuẩn ISO C nào (C89, C99, C11, C17, C23) và không có trong glibc của Linux lẫn libc của macOS.</li>
<li><strong>Đo thật, không đoán</strong> — tôi chép đúng chương trình của slide vào một tệp rồi chạy <code>cc -Wall</code> trên macOS (Apple clang 17). Kết quả là <strong>LỖI</strong> cứng: <em>"call to undeclared function 'strupr'; ISO C99 and later do not support implicit function declarations"</em>, kèm lời phàn nàn thứ hai rằng <code>%s</code> nhận phải một <code>int</code>. Chương trình không dịch nổi.</li>
<li><strong>Vì sao lời phàn nàn thứ hai đáng chú ý</strong> — nó cho thấy chuyện gì từng xảy ra ngày xưa. Trước C99, hàm chưa khai báo bị mặc định coi là trả về <code>int</code>, nên mã vẫn dịch được rồi đưa một số nguyên cụt cho <code>%s</code>. Đó chính là cách sinh ra loại lỗi "máy tôi chạy được mà".</li>
<li><strong>Bản thay thế chạy được ở mọi nơi chỉ tốn bốn dòng</strong> — <code>toupper()</code> trong <code>&lt;ctype.h&gt;</code> đổi một ký tự, nên một vòng lặp trên chuỗi là xong và chạy ở đâu cũng được. Nhớ ép kiểu <code>unsigned char</code> khi gọi: <code>toupper</code> không xác định với giá trị âm, mà <code>char</code> trần thì giữ được giá trị âm.</li>
</ul>
<table>
<tr><th>Vào</th><th>Ra (đo thật, bản tự viết)</th><th>Ghi chú</th></tr>
<tr><td><code>"Welcome to FPT University!"</code></td><td><code>WELCOME TO FPT UNIVERSITY!</code></td><td>đúng ví dụ của slide — tái tạo y hệt</td></tr>
<tr><td><code>""</code></td><td><code></code> (rỗng)</td><td>ca biên: thân vòng lặp không chạy lần nào, không hỏng gì</td></tr>
<tr><td><code>"ABC123xyz"</code></td><td><code>ABC123XYZ</code></td><td>chữ số để nguyên; chữ vốn đã hoa thì không đổi</td></tr>
<tr><td><code>"prf192"</code></td><td><code>PRF192</code></td><td>độ dài không bao giờ đổi — đổi từng byte một</td></tr>
<tr><td><code>"a-b_c"</code></td><td><code>A-B_C</code></td><td>dấu câu đi qua mà không bị đụng</td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
#include &lt;ctype.h&gt;

/* ban tu viet — chay duoc tren MOI trinh bien dich */
char* myStrupr(char *s)
{
    int i;
    for (i = 0; s[i] != '\\0'; i++)
        s[i] = toupper((unsigned char)s[i]);
    return s;
}

int main()
{
    char str[] = "Welcome to FPT University!";
    printf("%s\\n", myStrupr(str));
    return 0;
}</code></pre>
<p class="dap-an">✅ Đáp án — bản của slide, biên dịch nguyên văn bằng <code>cc -Wall</code>, cho ra <strong>một lỗi biên dịch</strong> chứ không phải khung console được vẽ: <em>"call to undeclared function 'strupr'"</em>. Slide đang mô tả một phần mở rộng của Dev-C++/Windows mà không nói ra điều đó. Bản thay thế ở trên dịch sạch và in <code>WELCOME TO FPT UNIVERSITY!</code> — đúng dòng chữ trong console của slide. Tôi không sửa slide; tôi báo để bạn biết rằng trên máy phòng lab không chạy Windows thì bạn sẽ cần bốn dòng ấy.</p>
<p class="pitfall">⚠️ Nếu đề thi yêu cầu "dùng strupr" thì cứ viết, và thêm một dòng chú thích rằng đây là phần mở rộng ngoài chuẩn. Còn nếu mã của bạn phải chạy ở đâu cũng được — bài tập lớn chấm máy, một job CI, một máy chủ Linux — thì dùng vòng lặp <code>toupper</code>. Đừng đi tìm thư viện để cài: không có gì để cài cả, hàm ấy đơn giản là không tồn tại ở đó.</p>`],

      [31, 'strlwr() function',
        `<p class="y-chinh">🎯 The mirror image of slide 30: <em>"The strlwr() function is used to converts a given string to lowercase."</em> Same prototype shape, same in-place behaviour, and the same fact the slide leaves out — <strong>it is not standard C either</strong>.</p>
<ul>
<li><strong>The prototype</strong> — <code>char *strlwr(char *str);</code>. Argument not <code>const</code>, return value is the same pointer, so the slide can nest it inside <code>printf("%s\\n", strlwr(str));</code>.</li>
<li><strong>Same example, opposite direction</strong> — <code>char str[] = "Welcome to FPT University!";</code> gives the console box <code>welcome to fpt university!</code>. Only the 12 letters that were capital changed; the blanks and the <code>!</code> are untouched.</li>
<li><strong>Same portability verdict</strong> — I compiled the <code>strlwr</code> version on macOS clang exactly as I did <code>strupr</code>, and it is the same hard error: the function does not exist outside the Windows toolchains. Use a <code>tolower()</code> loop instead; it is the same four lines with one word changed.</li>
<li><strong>Why this function earns its place in the course</strong> — it is the standard first step of a case-insensitive comparison. <code>strcmp</code> (slide 28) says <code>"FPTU"</code> and <code>"fpt"</code> differ by 32; fold both to lowercase first and <code>strcmp</code> returns 0 for genuinely equal words. That is exactly the trick <code>nameStr</code> uses on slide 39.</li>
<li><strong>The ASCII arithmetic behind it</strong> — <code>'a'</code> is 97 and <code>'A'</code> is 65, a constant gap of 32, so some textbooks write <code>s[i] = s[i] + 32;</code>. Do not. That corrupts digits and punctuation, and it only works for the English alphabet. <code>tolower</code> checks first and leaves everything else alone.</li>
<li><strong>Link to slide 9</strong> — <em>"Each character in a string is stored as its ASCII code."</em> Case conversion is simply arithmetic on those codes, which is why it costs one pass and never changes the length.</li>
</ul>
<table>
<tr><th>Input</th><th>Output (measured, own implementation)</th><th>Note</th></tr>
<tr><td><code>"Welcome to FPT University!"</code></td><td><code>welcome to fpt university!</code></td><td>the slide's own example — reproduced exactly</td></tr>
<tr><td><code>""</code></td><td><code></code> (empty)</td><td>edge case: nothing to do, no crash</td></tr>
<tr><td><code>"ABC123xyz"</code></td><td><code>abc123xyz</code></td><td>digits untouched; already-small letters unchanged</td></tr>
<tr><td><code>"PRF192"</code></td><td><code>prf192</code></td><td>same length in, same length out</td></tr>
<tr><td><code>"A-B_C"</code></td><td><code>a-b_c</code></td><td>punctuation survives — this is why <code>+32</code> is the wrong way</td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
#include &lt;ctype.h&gt;

char* myStrlwr(char *s)
{
    int i;
    for (i = 0; s[i] != '\\0'; i++)
        s[i] = tolower((unsigned char)s[i]);
    return s;
}

int main()
{
    char str[] = "Welcome to FPT University!";
    printf("%s\\n", myStrlwr(str));   /* welcome to fpt university! */
    return 0;
}</code></pre>
<p class="dap-an">✅ Đáp án — run for real, the loop above prints <code>welcome to fpt university!</code>, character for character the slide's console. The slide's own <code>strlwr</code> line, compiled unchanged with <code>cc -Wall</code>, fails to build on anything but Windows. Both facts belong in your notes; only one of them is on the slide.</p>
<p class="meo">💡 The pair <code>strupr</code>/<code>strlwr</code> is a good illustration of a habit worth keeping for the rest of the course: when a function is not in the header's documentation, check before you rely on it. One <code>man 3 strlwr</code> on a Linux lab machine answers the question in two seconds, and it answers "No manual entry".</p>`,
        `<p class="y-chinh">🎯 Ảnh soi gương của slide 30: <em>"Hàm strlwr() dùng để đổi một chuỗi cho trước sang chữ thường."</em> Cùng hình dạng prototype, cùng lối sửa tại chỗ, và cùng một sự thật slide bỏ sót — <strong>nó cũng không thuộc chuẩn C</strong>.</p>
<ul>
<li><strong>Prototype</strong> — <code>char *strlwr(char *str);</code>. Tham số không <code>const</code>, trả về chính con trỏ ấy, nên slide lồng được nó vào <code>printf("%s\\n", strlwr(str));</code>.</li>
<li><strong>Cùng ví dụ, ngược chiều</strong> — <code>char str[] = "Welcome to FPT University!";</code> cho khung console <code>welcome to fpt university!</code>. Chỉ 12 chữ vốn viết hoa là đổi; các dấu cách và dấu <code>!</code> không hề bị đụng.</li>
<li><strong>Cùng một phán quyết về tính khả chuyển</strong> — tôi biên dịch bản <code>strlwr</code> trên macOS clang y như đã làm với <code>strupr</code>, và vẫn đúng lỗi cứng ấy: hàm này không tồn tại ngoài bộ công cụ Windows. Hãy dùng vòng lặp <code>tolower()</code> thay thế; vẫn bốn dòng ấy, đổi đúng một chữ.</li>
<li><strong>Vì sao hàm này xứng đáng có mặt trong môn học</strong> — nó là bước đầu tiên tiêu chuẩn của phép so sánh không phân biệt hoa thường. <code>strcmp</code> (slide 28) bảo <code>"FPTU"</code> và <code>"fpt"</code> lệch nhau 32; đổi cả hai về chữ thường trước thì <code>strcmp</code> trả 0 cho những từ thật sự bằng nhau. Đó đúng là mẹo mà <code>nameStr</code> dùng ở slide 39.</li>
<li><strong>Số học ASCII nằm phía sau</strong> — <code>'a'</code> là 97 còn <code>'A'</code> là 65, chênh đúng 32, nên vài giáo trình viết <code>s[i] = s[i] + 32;</code>. Đừng làm thế. Cách ấy phá hỏng chữ số và dấu câu, và chỉ đúng với bảng chữ cái tiếng Anh. <code>tolower</code> kiểm tra trước rồi mới đổi, còn lại để yên.</li>
<li><strong>Nối với slide 9</strong> — <em>"Mỗi ký tự trong chuỗi được lưu bằng mã ASCII của nó."</em> Đổi hoa/thường chẳng qua là làm toán trên các mã ấy, nên nó tốn đúng một lượt quét và không bao giờ làm đổi độ dài.</li>
</ul>
<table>
<tr><th>Vào</th><th>Ra (đo thật, bản tự viết)</th><th>Ghi chú</th></tr>
<tr><td><code>"Welcome to FPT University!"</code></td><td><code>welcome to fpt university!</code></td><td>đúng ví dụ của slide — tái tạo y hệt</td></tr>
<tr><td><code>""</code></td><td><code></code> (rỗng)</td><td>ca biên: không có gì để làm, không sập</td></tr>
<tr><td><code>"ABC123xyz"</code></td><td><code>abc123xyz</code></td><td>chữ số để nguyên; chữ vốn đã thường thì không đổi</td></tr>
<tr><td><code>"PRF192"</code></td><td><code>prf192</code></td><td>vào bao nhiêu ký tự, ra bấy nhiêu</td></tr>
<tr><td><code>"A-B_C"</code></td><td><code>a-b_c</code></td><td>dấu câu sống sót — đây là lý do cộng 32 là cách sai</td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
#include &lt;ctype.h&gt;

char* myStrlwr(char *s)
{
    int i;
    for (i = 0; s[i] != '\\0'; i++)
        s[i] = tolower((unsigned char)s[i]);
    return s;
}

int main()
{
    char str[] = "Welcome to FPT University!";
    printf("%s\\n", myStrlwr(str));   /* welcome to fpt university! */
    return 0;
}</code></pre>
<p class="dap-an">✅ Đáp án — chạy thật, vòng lặp trên in ra <code>welcome to fpt university!</code>, giống console của slide từng ký tự. Còn dòng <code>strlwr</code> của chính slide, biên dịch nguyên vẹn bằng <code>cc -Wall</code>, không dựng nổi ở đâu ngoài Windows. Cả hai sự thật đều nên vào vở; chỉ một trong hai có trên slide.</p>
<p class="meo">💡 Cặp <code>strupr</code>/<code>strlwr</code> minh hoạ rất đẹp một thói quen đáng giữ cho cả phần còn lại của môn: hàm nào không có trong tài liệu của header thì phải kiểm trước khi dựa vào nó. Một lệnh <code>man 3 strlwr</code> trên máy Linux phòng lab trả lời trong hai giây, và câu trả lời là "No manual entry".</p>`],

      [32, 'strstr() function',
        `<p class="y-chinh">🎯 <em>"The strstr() function is used to search the first occurrence of a substring in another string."</em> Read the table on slide 25 again — its description is <em>"Find the <strong>address</strong> of a substring"</em>. That word address is the whole slide: <code>strstr</code> does not return a position number.</p>
<ul>
<li><strong>The prototype</strong> — <code>char *strstr (const char *s1, const char *s2);</code>. Both <code>const</code>: read-only, so it is safe on literals. <code>s1</code> is the haystack, <code>s2</code> is the needle, in that order.</li>
<li><strong>What comes back</strong> — a pointer to the first character of the match, <em>inside s1 itself</em>. It is not a copy. Printing it with <code>%s</code> therefore shows the match <strong>and everything after it</strong>, which is why the slide's console reads <code>Substring found: FPT University!</code> and not just <code>FPT</code>.</li>
<li><strong>What comes back when there is no match</strong> — <code>NULL</code>. That is why the example guards with <code>if (result != NULL)</code>. Dereferencing or printing a <code>NULL</code> is a crash, so this check is not optional decoration.</li>
<li><strong>Turning the address into an index</strong> — subtract: <code>result - s1</code>. Measured on the slide's own data, <code>strstr(s1, "FPT")</code> returns an address exactly <strong>11</strong> bytes into <code>s1</code>, which matches counting "Welcome to " by hand. This subtraction is the pointer arithmetic from Slot 10, and it is how Exercise 3 reports a position.</li>
<li><strong>It is case sensitive</strong> — measured: searching for <code>"fpt"</code> in <code>"Welcome to FPT University!"</code> returns <code>NULL</code>. If you want case-insensitive searching, lowercase a copy of both strings first (slides 30–31).</li>
<li><strong>Its single-character cousin</strong> — <code>strchr(s, c)</code> finds one character and also returns an address or <code>NULL</code>. Exercise 3 on slide 34 asks you to find a character; either <code>strchr</code> or a hand-written loop answers it.</li>
</ul>
<table>
<tr><th><code>s1</code> (haystack)</th><th><code>s2</code> (needle)</th><th>Returns</th><th>Index</th><th>Note</th></tr>
<tr><td><code>"Welcome to FPT University!"</code></td><td><code>"FPT"</code></td><td><code>"FPT University!"</code></td><td><strong>11</strong></td><td>the slide's example: the tail, not the match alone</td></tr>
<tr><td><code>"Welcome to FPT University!"</code></td><td><code>"fpt"</code></td><td><strong><code>NULL</code></strong></td><td>—</td><td>edge case: NOT FOUND — the search is case sensitive</td></tr>
<tr><td><code>"Welcome to FPT University!"</code></td><td><code>""</code></td><td>the whole of <code>s1</code></td><td>0</td><td>edge case: the empty needle matches immediately at the front</td></tr>
<tr><td><code>"Welcome to FPT University!"</code></td><td>the same 26-char string</td><td>the whole of <code>s1</code></td><td>0</td><td>equal lengths: a string always contains itself</td></tr>
<tr><td><code>"abcabc"</code></td><td><code>"bc"</code></td><td><code>"bcabc"</code></td><td>1</td><td>only the FIRST occurrence; the second is ignored</td></tr>
<tr><td><code>"abc"</code></td><td><code>"abcd"</code></td><td><strong><code>NULL</code></strong></td><td>—</td><td>edge case: the needle is longer than the haystack</td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
int main(){
    char s1[] = "Welcome to FPT University!";
    char s2[] = "FPT";
    char* result;
    // Find the first occurrence of 's2' within 's1'
    result = strstr(s1, s2);
    if (result != NULL) {
        printf("Substring found: %s\\n", result);
        printf("Position: %ld\\n", (long)(result - s1));   /* dia chi -&gt; chi so */
    } else {
        printf("Substring not found.\\n");
    }
    return 0;
}</code></pre>
<p class="dap-an">✅ Compiled with <code>cc -Wall</code> and run: <code>Substring found: FPT University!</code> then <code>Position: 11</code>. The slide shows only the first line; the second is the measurement that explains it — the returned pointer sits 11 bytes inside <code>s1</code>, and printing from there naturally prints the rest of the sentence.</p>
<p class="pitfall">⚠️ Because the result points <em>into</em> <code>s1</code>, writing through it modifies <code>s1</code>. That is not a bug, it is a tool: both <code>trim()</code> on slide 38 and Exercise 6 on slide 42 use <code>strstr</code> to locate a spot and then overwrite it. But it also means the result is only valid while <code>s1</code> is alive and unchanged — never return it from a function whose local array it points into.</p>`,
        `<p class="y-chinh">🎯 <em>"Hàm strstr() dùng để tìm lần xuất hiện ĐẦU TIÊN của một chuỗi con trong một chuỗi khác."</em> Hãy đọc lại bảng ở slide 25 — mô tả của nó là <em>"Tìm ĐỊA CHỈ của chuỗi con"</em>. Chữ địa chỉ ấy là toàn bộ slide này: <code>strstr</code> KHÔNG trả về một số thứ tự.</p>
<ul>
<li><strong>Prototype</strong> — <code>char *strstr (const char *s1, const char *s2);</code>. Cả hai đều <code>const</code>: chỉ đọc, nên dùng với chuỗi hằng là an toàn. <code>s1</code> là đống rơm, <code>s2</code> là cây kim, đúng thứ tự ấy.</li>
<li><strong>Nó trả về cái gì</strong> — một con trỏ tới ký tự đầu của chỗ khớp, <em>nằm ngay bên trong s1</em>. Không phải bản sao. Vì thế in nó bằng <code>%s</code> sẽ hiện chỗ khớp <strong>và tất cả những gì đứng sau</strong>, nên console của slide đọc là <code>Substring found: FPT University!</code> chứ không phải chỉ <code>FPT</code>.</li>
<li><strong>Nó trả về gì khi không tìm thấy</strong> — <code>NULL</code>. Đó là lý do ví dụ phải rào bằng <code>if (result != NULL)</code>. Lấy giá trị hay in một con trỏ <code>NULL</code> là sập chương trình, nên phép kiểm này không phải đồ trang trí tuỳ chọn.</li>
<li><strong>Đổi địa chỉ thành chỉ số</strong> — lấy hiệu: <code>result - s1</code>. Đo trên đúng dữ liệu của slide, <code>strstr(s1, "FPT")</code> trả về một địa chỉ nằm đúng <strong>11</strong> byte trong <code>s1</code>, khớp với việc đếm tay chuỗi "Welcome to ". Phép trừ này chính là số học con trỏ của Slot 10, và đó là cách Exercise 3 báo được vị trí.</li>
<li><strong>Nó PHÂN BIỆT hoa thường</strong> — đo thật: tìm <code>"fpt"</code> trong <code>"Welcome to FPT University!"</code> trả về <code>NULL</code>. Muốn tìm không phân biệt hoa thường thì phải đổi bản sao của cả hai về chữ thường trước (slide 30–31).</li>
<li><strong>Người anh em một ký tự</strong> — <code>strchr(s, c)</code> tìm một ký tự và cũng trả về địa chỉ hoặc <code>NULL</code>. Exercise 3 ở slide 34 yêu cầu tìm một ký tự; dùng <code>strchr</code> hay một vòng lặp tự viết đều trả lời được.</li>
</ul>
<table>
<tr><th><code>s1</code> (đống rơm)</th><th><code>s2</code> (cây kim)</th><th>Trả về</th><th>Chỉ số</th><th>Ghi chú</th></tr>
<tr><td><code>"Welcome to FPT University!"</code></td><td><code>"FPT"</code></td><td><code>"FPT University!"</code></td><td><strong>11</strong></td><td>ví dụ của slide: cả phần đuôi chứ không riêng chỗ khớp</td></tr>
<tr><td><code>"Welcome to FPT University!"</code></td><td><code>"fpt"</code></td><td><strong><code>NULL</code></strong></td><td>—</td><td>ca biên: KHÔNG TÌM THẤY — phép tìm phân biệt hoa thường</td></tr>
<tr><td><code>"Welcome to FPT University!"</code></td><td><code>""</code></td><td>toàn bộ <code>s1</code></td><td>0</td><td>ca biên: cây kim rỗng khớp ngay lập tức ở đầu</td></tr>
<tr><td><code>"Welcome to FPT University!"</code></td><td>chính chuỗi 26 ký tự ấy</td><td>toàn bộ <code>s1</code></td><td>0</td><td>độ dài bằng nhau: một chuỗi luôn chứa chính nó</td></tr>
<tr><td><code>"abcabc"</code></td><td><code>"bc"</code></td><td><code>"bcabc"</code></td><td>1</td><td>chỉ lần ĐẦU TIÊN; lần thứ hai bị bỏ qua</td></tr>
<tr><td><code>"abc"</code></td><td><code>"abcd"</code></td><td><strong><code>NULL</code></strong></td><td>—</td><td>ca biên: cây kim dài hơn đống rơm</td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
int main(){
    char s1[] = "Welcome to FPT University!";
    char s2[] = "FPT";
    char* result;
    // Find the first occurrence of 's2' within 's1'
    result = strstr(s1, s2);
    if (result != NULL) {
        printf("Substring found: %s\\n", result);
        printf("Position: %ld\\n", (long)(result - s1));   /* dia chi -&gt; chi so */
    } else {
        printf("Substring not found.\\n");
    }
    return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch bằng <code>cc -Wall</code> và chạy thật: <code>Substring found: FPT University!</code> rồi <code>Position: 11</code>. Slide chỉ hiện dòng đầu; dòng thứ hai là phép đo giải thích dòng đầu — con trỏ trả về nằm sâu 11 byte trong <code>s1</code>, và in từ chỗ đó thì đương nhiên in nốt phần còn lại của câu.</p>
<p class="pitfall">⚠️ Vì kết quả trỏ <em>vào bên trong</em> <code>s1</code> nên ghi qua nó là sửa thẳng <code>s1</code>. Đó không phải lỗi, đó là công cụ: cả <code>trim()</code> ở slide 38 lẫn Exercise 6 ở slide 42 đều dùng <code>strstr</code> để định vị rồi ghi đè. Nhưng nó cũng có nghĩa kết quả chỉ còn giá trị chừng nào <code>s1</code> còn sống và chưa đổi — đừng bao giờ trả con trỏ ấy ra khỏi một hàm mà nó đang trỏ vào mảng cục bộ của hàm đó.</p>`],

      [33, 'strtok() function',
        `<p class="y-chinh">🎯 <em>"The strtok() function is used to split the string into small tokens based on a set of delimiter characters."</em> It is the most useful function on the list and by far the most dangerous, because it works by <strong>destroying the string you give it</strong>.</p>
<ul>
<li><strong>The prototype</strong> — <code>char * strtok(char* str, const char *delims);</code>. Notice <code>str</code> is <em>not</em> <code>const</code>, unlike every read-only function above. That missing <code>const</code> is the warning label.</li>
<li><strong>The two-call protocol</strong> — the FIRST call passes the string; every call after that passes <code>NULL</code> to mean "continue where you left off". The slide's loop is the canonical shape: get a token, print it, then <code>token = strtok(NULL, delimiters);</code> until it returns <code>NULL</code>.</li>
<li><strong><code>delims</code> is a SET, not a sequence</strong> — <code>"-,:"</code> means "any of hyphen, comma or colon", not the three-character text. That is why <code>"Welcome,to-FPT:University"</code> splits at three different characters into four tokens.</li>
<li><strong>How it does it — and the damage</strong> — it overwrites each delimiter it finds with <code>'\\0'</code> and returns a pointer to the start of the token. I measured the buffer byte by byte after the loop: <code>Welcome\\0to\\0FPT\\0University\\0</code>. The consequence is brutal and invisible: <code>printf("%s", str)</code> afterwards prints only <strong><code>Welcome</code></strong>. The rest of your data is still in memory but is no longer one string.</li>
<li><strong>Three things you therefore cannot do</strong> — (1) call it on a string literal: <code>char *s = "a,b"; strtok(s, ",");</code> tries to write into read-only memory and I measured a real crash, <strong>SIGBUS, exit 138</strong>; (2) nest two <code>strtok</code> loops, because it keeps ONE hidden static position shared by the whole program; (3) use it from two threads. The reentrant version <code>strtok_r</code> (POSIX) fixes (2) and (3).</li>
<li><strong>It collapses runs of delimiters</strong> — measured: <code>"a,,b"</code> with delimiter <code>","</code> yields <code>[a]</code> and <code>[b]</code>, never an empty token. Handy for splitting words on blanks, wrong if you are parsing CSV where an empty field is meaningful.</li>
</ul>
<table>
<tr><th>String</th><th>Delimiters</th><th>Tokens produced (measured)</th><th>Note</th></tr>
<tr><td><code>"Welcome,to-FPT:University"</code></td><td><code>"-,:"</code></td><td><code>Welcome</code> · <code>to</code> · <code>FPT</code> · <code>University</code></td><td>the slide's example — four tokens, exactly as its console shows</td></tr>
<tr><td><code>"a,,b"</code></td><td><code>","</code></td><td><code>a</code> · <code>b</code></td><td>edge case: consecutive delimiters give NO empty token</td></tr>
<tr><td><code>",,,"</code></td><td><code>","</code></td><td><strong>NULL on the very first call</strong></td><td>edge case: nothing but delimiters — the loop never starts</td></tr>
<tr><td><code>""</code></td><td><code>","</code></td><td><strong>NULL on the very first call</strong></td><td>edge case: empty string</td></tr>
<tr><td><code>"abc"</code></td><td><code>","</code></td><td><code>abc</code></td><td>no delimiter present — one token, the whole string</td></tr>
<tr><td><code>"Hoang Thi  Hoa"</code></td><td><code>" "</code></td><td><code>Hoang</code> · <code>Thi</code> · <code>Hoa</code></td><td>double blank collapses — this is the word-splitting use</td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
int main(){
    char str[] = "Welcome,to-FPT:University";   /* MANG, khong phai char* */
    // Delimiters: space, comma, dot
    char delimiters[] = "-,:";
    // Tokenize the string
    char* token = strtok(str, delimiters);
    while (token != NULL) {
        printf("Token: %s\\n", token);
        token = strtok(NULL, delimiters);
    }
    return 0;
}</code></pre>
<p class="dap-an">✅ Compiled and run: <code>Token: Welcome</code> / <code>Token: to</code> / <code>Token: FPT</code> / <code>Token: University</code> — exactly the slide's console. The measurement the slide does not show: dumping <code>str</code> byte by byte afterwards gives <code>Welcome\\0to\\0FPT\\0University\\0</code>, and <code>printf("%s", str)</code> prints only <code>Welcome</code>. If you need the original afterwards, <code>strcpy</code> it to a spare buffer BEFORE the first <code>strtok</code> call.</p>
<p class="pitfall">⚠️ The slide's comment line says <em>"Delimiters: space, comma, dot"</em> while the code actually sets <code>"-,:"</code> — hyphen, comma, colon. The code is what runs; the comment is stale. Copy the code, not the comment, and notice that the output would be identical either way only because this particular sentence has no space or dot in it.</p>`,
        `<p class="y-chinh">🎯 <em>"Hàm strtok() dùng để cắt chuỗi thành các mẩu nhỏ dựa trên một tập ký tự phân tách."</em> Đây là hàm hữu ích nhất trong danh sách và cũng nguy hiểm nhất, vì cách nó làm việc là <strong>phá huỷ chính chuỗi bạn đưa cho nó</strong>.</p>
<ul>
<li><strong>Prototype</strong> — <code>char * strtok(char* str, const char *delims);</code>. Để ý <code>str</code> KHÔNG có <code>const</code>, khác mọi hàm chỉ-đọc ở trên. Chỗ thiếu <code>const</code> ấy chính là nhãn cảnh báo.</li>
<li><strong>Giao thức hai kiểu gọi</strong> — lần gọi ĐẦU truyền chuỗi vào; mọi lần sau truyền <code>NULL</code> với nghĩa "đi tiếp từ chỗ lần trước dừng". Vòng lặp trên slide là hình mẫu chuẩn: lấy một mẩu, in ra, rồi <code>token = strtok(NULL, delimiters);</code> cho tới khi nó trả <code>NULL</code>.</li>
<li><strong><code>delims</code> là một TẬP HỢP, không phải một chuỗi</strong> — <code>"-,:"</code> nghĩa là "bất kỳ ký tự nào trong ba ký tự gạch nối, phẩy, hai chấm", chứ không phải đoạn văn bản ba ký tự ấy. Nhờ vậy <code>"Welcome,to-FPT:University"</code> bị cắt ở ba ký tự khác nhau thành bốn mẩu.</li>
<li><strong>Nó làm bằng cách nào — và thiệt hại ra sao</strong> — nó ghi đè mỗi dấu phân tách gặp được bằng <code>'\\0'</code> rồi trả về con trỏ tới đầu mẩu. Tôi đã đọc lại vùng nhớ từng byte sau vòng lặp: <code>Welcome\\0to\\0FPT\\0University\\0</code>. Hậu quả vừa nặng vừa vô hình: <code>printf("%s", str)</code> sau đó chỉ in ra <strong><code>Welcome</code></strong>. Phần dữ liệu còn lại vẫn nằm trong bộ nhớ nhưng không còn là MỘT chuỗi nữa.</li>
<li><strong>Ba việc vì thế bạn KHÔNG làm được</strong> — (1) gọi nó trên chuỗi hằng: <code>char *s = "a,b"; strtok(s, ",");</code> định ghi vào vùng chỉ đọc và tôi đo được cú sập thật, <strong>SIGBUS, exit 138</strong>; (2) lồng hai vòng <code>strtok</code>, vì nó giữ MỘT vị trí tĩnh ẩn dùng chung cho cả chương trình; (3) dùng nó từ hai luồng. Bản có thể vào lại <code>strtok_r</code> (POSIX) chữa được (2) và (3).</li>
<li><strong>Nó gộp các dấu phân tách liền nhau</strong> — đo thật: <code>"a,,b"</code> với dấu <code>","</code> cho ra <code>[a]</code> và <code>[b]</code>, không bao giờ có mẩu rỗng. Tiện khi tách từ theo dấu cách, nhưng sai nếu bạn đang đọc CSV mà ô rỗng lại có nghĩa.</li>
</ul>
<table>
<tr><th>Chuỗi</th><th>Dấu phân tách</th><th>Các mẩu thu được (đo thật)</th><th>Ghi chú</th></tr>
<tr><td><code>"Welcome,to-FPT:University"</code></td><td><code>"-,:"</code></td><td><code>Welcome</code> · <code>to</code> · <code>FPT</code> · <code>University</code></td><td>ví dụ của slide — bốn mẩu, đúng như console của nó</td></tr>
<tr><td><code>"a,,b"</code></td><td><code>","</code></td><td><code>a</code> · <code>b</code></td><td>ca biên: hai dấu liền nhau KHÔNG sinh mẩu rỗng</td></tr>
<tr><td><code>",,,"</code></td><td><code>","</code></td><td><strong>NULL ngay lần gọi đầu</strong></td><td>ca biên: toàn dấu phân tách — vòng lặp không chạy lần nào</td></tr>
<tr><td><code>""</code></td><td><code>","</code></td><td><strong>NULL ngay lần gọi đầu</strong></td><td>ca biên: chuỗi rỗng</td></tr>
<tr><td><code>"abc"</code></td><td><code>","</code></td><td><code>abc</code></td><td>không có dấu phân tách nào — một mẩu, là cả chuỗi</td></tr>
<tr><td><code>"Hoang Thi  Hoa"</code></td><td><code>" "</code></td><td><code>Hoang</code> · <code>Thi</code> · <code>Hoa</code></td><td>hai dấu cách bị gộp — đây là kiểu dùng để tách từ</td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
int main(){
    char str[] = "Welcome,to-FPT:University";   /* MANG, khong phai char* */
    // Delimiters: space, comma, dot
    char delimiters[] = "-,:";
    // Tokenize the string
    char* token = strtok(str, delimiters);
    while (token != NULL) {
        printf("Token: %s\\n", token);
        token = strtok(NULL, delimiters);
    }
    return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch và chạy thật: <code>Token: Welcome</code> / <code>Token: to</code> / <code>Token: FPT</code> / <code>Token: University</code> — đúng console của slide. Phép đo mà slide không cho thấy: đọc lại <code>str</code> từng byte sau đó cho <code>Welcome\\0to\\0FPT\\0University\\0</code>, và <code>printf("%s", str)</code> chỉ in <code>Welcome</code>. Nếu sau này còn cần bản gốc thì hãy <code>strcpy</code> nó sang một mảng dự phòng TRƯỚC lần gọi <code>strtok</code> đầu tiên.</p>
<p class="pitfall">⚠️ Dòng chú thích trên slide ghi <em>"Delimiters: space, comma, dot"</em> trong khi mã thật đặt <code>"-,:"</code> — gạch nối, phẩy, hai chấm. Thứ chạy là mã, còn chú thích đã cũ. Hãy chép mã chứ đừng chép chú thích, và để ý rằng kết quả hai đằng chỉ giống nhau vì đúng câu ví dụ này không có dấu cách lẫn dấu chấm nào.</p>`],

      [34, 'Exercise 3: Using built-in function (string.h)',
        `<p class="y-chinh">🎯 One program that exercises four of the eight library functions at once: read two strings, compare them, join them, measure the result, and find a character in it. Nothing new is introduced — this is the checkpoint for slides 26–33.</p>
<ul>
<li><strong>The five requirements on the slide</strong> — (1) prompt for two strings; (2) compare and say whether they are equal or which is lexicographically greater; (3) concatenate and display; (4) display the length of the concatenation; (5) search for a character the user types and display its position, or say it is not found.</li>
<li><strong>Requirement 2 is the <code>strcmp</code> trap</strong> — the verdict has three branches, so you need <code>== 0</code>, <code>&gt; 0</code> and <code>&lt; 0</code>, not a single <code>if/else</code>. And remember slide 28: test the sign, never the value 1.</li>
<li><strong>Requirement 3 needs a third buffer</strong> — do NOT <code>strcat(s1, s2)</code>, because that destroys <code>s1</code> and you still have to print it in the comparison message. Declare <code>char both[101];</code>, <code>strcpy(both, s1);</code> then <code>strcat(both, s2);</code>. The 101 is <code>50 + 50 + 1</code> — the +1 is the terminator, exactly the n+1 rule from slide 4.</li>
<li><strong>Requirement 5: "position" is ambiguous</strong> — index (0-based) or position (1-based)? Print both and label them, and you cannot be marked wrong. You may use <code>strchr</code> or a hand loop; the loop is closer to what the exercise is testing.</li>
<li><strong>The input specifier matters</strong> — <code>scanf("%s", s1)</code> stops at the first blank (slide 14), so "Hello World" would be read as two separate inputs. Use a width limit (<code>%49s</code>) so a long input cannot overflow the 50-byte array, and <code>scanf(" %c", &amp;ch)</code> with a leading blank so the pending newline is skipped.</li>
<li><strong>Where each library function lands</strong> — <code>strcmp</code> for step 2, <code>strcpy</code>+<code>strcat</code> for step 3, <code>strlen</code> for step 4, a loop (or <code>strchr</code>) for step 5. Four of the eight, in twenty lines.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;string.h&gt;

int main(void)
{
    char s1[50], s2[50], both[101];
    char ch;
    int cmp, i, pos = -1;

    printf("Enter the first string : ");
    scanf("%49s", s1);
    printf("Enter the second string: ");
    scanf("%49s", s2);

    cmp = strcmp(s1, s2);
    if (cmp == 0)      printf("The two strings are EQUAL.\\n");
    else if (cmp &gt; 0)  printf("\\"%s\\" is greater than \\"%s\\".\\n", s1, s2);
    else               printf("\\"%s\\" is greater than \\"%s\\".\\n", s2, s1);
    printf("strcmp returned %d\\n", cmp);

    strcpy(both, s1);
    strcat(both, s2);
    printf("Concatenated string: %s\\n", both);
    printf("Length             : %d\\n", (int)strlen(both));

    printf("Enter a character to search: ");
    scanf(" %c", &amp;ch);
    for (i = 0; both[i] != '\\0'; i++)
        if (both[i] == ch) { pos = i; break; }

    if (pos &gt;= 0) printf("'%c' found at index %d (position %d).\\n", ch, pos, pos + 1);
    else          printf("'%c' is not found in the concatenated string.\\n", ch);
    return 0;
}</code></pre>
<p class="dap-an">✅ Đáp án — compiled with <code>cc -Wall</code> and run twice with real input. <strong>Run 1</strong>, typing <code>Hello</code>, <code>World</code>, <code>W</code>: <em>"World" is greater than "Hello"</em> · <code>strcmp returned -15</code> · <code>Concatenated string: HelloWorld</code> · <code>Length: 10</code> · <code>'W' found at index 5 (position 6)</code>. <strong>Run 2</strong> (the two edge cases in one go), typing <code>FPTU</code>, <code>FPTU</code>, <code>z</code>: <em>The two strings are EQUAL.</em> · <code>strcmp returned 0</code> · <code>Concatenated string: FPTUFPTU</code> · <code>Length: 8</code> · <code>'z' is not found in the concatenated string.</code></p>
<p class="meo">💡 The <code>-15</code> is worth a second look: <code>'H'</code>(72) − <code>'W'</code>(87) = −15, so the verdict came from position 0 alone — the rest of both words was never examined. On Dev-C++ the same run would print −1. Report the sign in your answer, and the program above is correct on every compiler.</p>`,
        `<p class="y-chinh">🎯 Một chương trình dùng liền bốn trong tám hàm thư viện: nhập hai chuỗi, so sánh, nối lại, đo độ dài, rồi tìm một ký tự trong đó. Không có gì mới — đây là bài kiểm tra chốt cho slide 26–33.</p>
<ul>
<li><strong>Năm yêu cầu trên slide</strong> — (1) nhắc người dùng nhập hai chuỗi; (2) so sánh và cho biết chúng bằng nhau hay chuỗi nào lớn hơn theo thứ tự từ điển; (3) nối hai chuỗi rồi hiển thị; (4) tính và hiển thị độ dài chuỗi đã nối; (5) tìm một ký tự do người dùng nhập trong chuỗi đã nối và hiện vị trí, hoặc báo không tìm thấy.</li>
<li><strong>Yêu cầu 2 là cái bẫy <code>strcmp</code></strong> — phán quyết có BA nhánh, nên bạn cần cả <code>== 0</code>, <code>&gt; 0</code> và <code>&lt; 0</code>, chứ không phải một <code>if/else</code>. Và nhớ slide 28: kiểm DẤU, đừng bao giờ kiểm giá trị 1.</li>
<li><strong>Yêu cầu 3 cần một mảng thứ ba</strong> — ĐỪNG <code>strcat(s1, s2)</code>, vì làm vậy là phá <code>s1</code> trong khi bạn vẫn còn phải in nó ra ở câu thông báo so sánh. Hãy khai <code>char both[101];</code>, rồi <code>strcpy(both, s1);</code> và <code>strcat(both, s2);</code>. Con số 101 là <code>50 + 50 + 1</code> — dấu +1 là chỗ cho ký tự kết thúc, đúng luật n+1 của slide 4.</li>
<li><strong>Yêu cầu 5: chữ "vị trí" nhập nhằng</strong> — chỉ số (đếm từ 0) hay vị trí (đếm từ 1)? Hãy in cả hai và ghi nhãn rõ ràng, thế thì không ai trừ điểm được. Bạn dùng <code>strchr</code> hay vòng lặp tay đều được; vòng lặp sát với thứ bài tập đang kiểm hơn.</li>
<li><strong>Định dạng nhập rất quan trọng</strong> — <code>scanf("%s", s1)</code> dừng ở dấu cách đầu tiên (slide 14), nên "Hello World" sẽ bị đọc thành hai lần nhập. Hãy giới hạn bề rộng (<code>%49s</code>) để chuỗi dài không tràn mảng 50 byte, và dùng <code>scanf(" %c", &amp;ch)</code> có dấu cách phía trước để nuốt ký tự xuống dòng còn sót lại.</li>
<li><strong>Hàm thư viện nào rơi vào đâu</strong> — <code>strcmp</code> cho bước 2, <code>strcpy</code>+<code>strcat</code> cho bước 3, <code>strlen</code> cho bước 4, một vòng lặp (hoặc <code>strchr</code>) cho bước 5. Bốn trong tám hàm, gói trong hai mươi dòng.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;string.h&gt;

int main(void)
{
    char s1[50], s2[50], both[101];
    char ch;
    int cmp, i, pos = -1;

    printf("Enter the first string : ");
    scanf("%49s", s1);
    printf("Enter the second string: ");
    scanf("%49s", s2);

    cmp = strcmp(s1, s2);
    if (cmp == 0)      printf("The two strings are EQUAL.\\n");
    else if (cmp &gt; 0)  printf("\\"%s\\" is greater than \\"%s\\".\\n", s1, s2);
    else               printf("\\"%s\\" is greater than \\"%s\\".\\n", s2, s1);
    printf("strcmp returned %d\\n", cmp);

    strcpy(both, s1);
    strcat(both, s2);
    printf("Concatenated string: %s\\n", both);
    printf("Length             : %d\\n", (int)strlen(both));

    printf("Enter a character to search: ");
    scanf(" %c", &amp;ch);
    for (i = 0; both[i] != '\\0'; i++)
        if (both[i] == ch) { pos = i; break; }

    if (pos &gt;= 0) printf("'%c' found at index %d (position %d).\\n", ch, pos, pos + 1);
    else          printf("'%c' is not found in the concatenated string.\\n", ch);
    return 0;
}</code></pre>
<p class="dap-an">✅ Đáp án — đã biên dịch bằng <code>cc -Wall</code> và chạy thật hai lần với dữ liệu vào cụ thể. <strong>Lần 1</strong>, gõ <code>Hello</code>, <code>World</code>, <code>W</code>: <em>"World" is greater than "Hello"</em> · <code>strcmp returned -15</code> · <code>Concatenated string: HelloWorld</code> · <code>Length: 10</code> · <code>'W' found at index 5 (position 6)</code>. <strong>Lần 2</strong> (gộp hai ca biên vào một), gõ <code>FPTU</code>, <code>FPTU</code>, <code>z</code>: <em>The two strings are EQUAL.</em> · <code>strcmp returned 0</code> · <code>Concatenated string: FPTUFPTU</code> · <code>Length: 8</code> · <code>'z' is not found in the concatenated string.</code></p>
<p class="meo">💡 Con số <code>-15</code> đáng nhìn lại: <code>'H'</code>(72) − <code>'W'</code>(87) = −15, tức phán quyết đến từ riêng vị trí 0 — phần còn lại của hai từ chưa hề được xem tới. Trên Dev-C++ cùng lần chạy ấy sẽ in −1. Trong bài làm hãy nói theo DẤU, và chương trình ở trên thì đúng trên mọi trình biên dịch.</p>`],

      [35, '7. Some User-Defined String Functions',
        `<p class="y-chinh">🎯 A second table, this time of four functions <strong>you</strong> write, because <code>string.h</code> has nothing for the most common real-world chore: cleaning up the blanks a human typed. Four slides follow, one per function, and they build on each other.</p>
<ul>
<li><strong>The four rows, with the slide's own examples</strong> — <code>char* lTrim(char s[])</code> trims blanks at the beginning: <code>"   Hello"</code> &rarr; <code>"Hello"</code>. <code>char* rTrim(char s[])</code> trims at the end: <code>"Hello   "</code> &rarr; <code>"Hello"</code>. <code>char* trim(char s[])</code> removes extra blanks everywhere. <code>char* nameStr(char s[])</code> converts a string to a name: <code>"  hoang thi    hoa  "</code> &rarr; <code>"Hoang Thi Hoa"</code>.</li>
<li><strong>Read the prototypes: they all return <code>char*</code> and take <code>char s[]</code></strong> — no <code>const</code>, so all four modify in place, exactly like <code>strupr</code>. The returned pointer is <code>s</code> itself, which is what makes <code>rTrim(lTrim(s))</code> on slide 38 possible.</li>
<li><strong>Why <code>char s[]</code> and <code>char *s</code> are the same here</strong> — Slot 13–15: an array parameter decays to a pointer. Writing <code>char s[]</code> is documentation ("I expect an array"), not a different type. It also means the function cannot know how long the array is — only where the <code>'\\0'</code> is.</li>
<li><strong>They compose</strong> — <code>trim</code> is built from <code>lTrim</code> + <code>rTrim</code> + a loop; <code>nameStr</code> is built from <code>trim</code> + lowercase + capitalise. Four slides, one pyramid. If <code>lTrim</code> is wrong, all four are wrong.</li>
<li><strong>Why this belongs in a strings chapter</strong> — every one of them is a loop over indices plus one library call, and together they use <code>strlen</code>, <code>strcpy</code> and <code>strstr</code>. They are the exam's favourite way to check you understood <code>'\\0'</code>.</li>
<li><strong>⚠️ The slide's third row does not add up</strong> — it shows <code>"   I   am   student   "</code> becoming <code>"I am a student"</code>. The word <em>"a"</em> is in the output but not in the input. No trim function invents a word; the input on the slide is simply missing it. I ran the real <code>trim</code> on <code>"   I   am   a   student   "</code> and got <code>"I am a student"</code>, which is what the slide meant.</li>
</ul>
<table>
<tr><th>Purpose</th><th>Prototype</th><th>Example on the slide</th><th>Measured result</th></tr>
<tr><td>Trim blanks at the beginning</td><td><code>char* lTrim(char s[])</code></td><td><code>"   Hello"</code></td><td><code>"Hello"</code> (len 8 &rarr; 5)</td></tr>
<tr><td>Trim blanks at the end</td><td><code>char* rTrim(char s[])</code></td><td><code>"Hello   "</code></td><td><code>"Hello"</code> (len 8 &rarr; 5)</td></tr>
<tr><td>Trim extra blanks in a string</td><td><code>char* trim (char s[])</code></td><td><code>"   I   am   student   "</code></td><td><code>"I am student"</code> — the slide prints "I am a student", see the note above</td></tr>
<tr><td>Convert a string to a name</td><td><code>char* nameStr(char s[])</code></td><td><code>"  hoang thi    hoa  "</code></td><td><code>"Hoang Thi Hoa"</code> (len 20 &rarr; 13)</td></tr>
</table>
<p class="meo">💡 Before writing any of the four, decide the answer to three edge cases and write them in the margin: what should happen for <code>""</code>, for <code>"     "</code> (all blanks), and for a string with no blanks at all? My measurements: all four functions return an empty string for the first two, and leave the third untouched apart from <code>nameStr</code>, which capitalises the first letter. If your version crashes on one of those, you have found the bug before the marker did.</p>`,
        `<p class="y-chinh">🎯 Một bảng thứ hai, lần này là bốn hàm do <strong>bạn</strong> viết, vì <code>string.h</code> chẳng có gì cho cái việc đời thường phổ biến nhất: dọn sạch những dấu cách mà con người gõ thừa. Bốn slide kế tiếp, mỗi slide một hàm, và chúng xây chồng lên nhau.</p>
<ul>
<li><strong>Bốn dòng, kèm chính ví dụ của slide</strong> — <code>char* lTrim(char s[])</code> cắt dấu cách ở ĐẦU: <code>"   Hello"</code> &rarr; <code>"Hello"</code>. <code>char* rTrim(char s[])</code> cắt ở CUỐI: <code>"Hello   "</code> &rarr; <code>"Hello"</code>. <code>char* trim(char s[])</code> bỏ dấu cách thừa ở mọi chỗ. <code>char* nameStr(char s[])</code> đổi chuỗi thành một cái TÊN: <code>"  hoang thi    hoa  "</code> &rarr; <code>"Hoang Thi Hoa"</code>.</li>
<li><strong>Đọc prototype: cả bốn đều trả <code>char*</code> và nhận <code>char s[]</code></strong> — không có <code>const</code>, nên cả bốn đều sửa TẠI CHỖ, y như <code>strupr</code>. Con trỏ trả về chính là <code>s</code>, và đó là thứ làm cho <code>rTrim(lTrim(s))</code> ở slide 38 viết được.</li>
<li><strong>Vì sao <code>char s[]</code> và <code>char *s</code> ở đây là một</strong> — Slot 13–15: tham số mảng tự suy biến thành con trỏ. Viết <code>char s[]</code> là để ghi chú ("tôi mong nhận một mảng"), không phải một kiểu khác. Nó cũng có nghĩa hàm KHÔNG thể biết mảng dài bao nhiêu — nó chỉ biết dấu <code>'\\0'</code> nằm ở đâu.</li>
<li><strong>Chúng ghép chồng lên nhau</strong> — <code>trim</code> dựng từ <code>lTrim</code> + <code>rTrim</code> + một vòng lặp; <code>nameStr</code> dựng từ <code>trim</code> + đổi chữ thường + viết hoa đầu từ. Bốn slide, một kim tự tháp. <code>lTrim</code> sai thì cả bốn cùng sai.</li>
<li><strong>Vì sao phần này thuộc chương chuỗi</strong> — hàm nào cũng chỉ là một vòng lặp trên chỉ số cộng một lời gọi thư viện, và gộp lại chúng dùng cả <code>strlen</code>, <code>strcpy</code> lẫn <code>strstr</code>. Đây là cách ưa thích của đề thi để kiểm xem bạn đã hiểu <code>'\\0'</code> chưa.</li>
<li><strong>⚠️ Dòng thứ ba của slide KHÔNG khớp</strong> — nó ghi <code>"   I   am   student   "</code> thành <code>"I am a student"</code>. Chữ <em>"a"</em> có ở đầu ra mà không có ở đầu vào. Không hàm cắt dấu cách nào bịa thêm được một từ; đơn giản là dữ liệu vào trên slide bị thiếu chữ ấy. Tôi chạy <code>trim</code> thật trên <code>"   I   am   a   student   "</code> và nhận được <code>"I am a student"</code>, đúng ý slide muốn nói.</li>
</ul>
<table>
<tr><th>Mục đích</th><th>Prototype</th><th>Ví dụ trên slide</th><th>Kết quả đo thật</th></tr>
<tr><td>Cắt dấu cách ở đầu chuỗi</td><td><code>char* lTrim(char s[])</code></td><td><code>"   Hello"</code></td><td><code>"Hello"</code> (dài 8 &rarr; 5)</td></tr>
<tr><td>Cắt dấu cách ở cuối chuỗi</td><td><code>char* rTrim(char s[])</code></td><td><code>"Hello   "</code></td><td><code>"Hello"</code> (dài 8 &rarr; 5)</td></tr>
<tr><td>Bỏ dấu cách thừa trong chuỗi</td><td><code>char* trim (char s[])</code></td><td><code>"   I   am   student   "</code></td><td><code>"I am student"</code> — slide in ra "I am a student", xem ghi chú ở trên</td></tr>
<tr><td>Đổi chuỗi thành một cái tên</td><td><code>char* nameStr(char s[])</code></td><td><code>"  hoang thi    hoa  "</code></td><td><code>"Hoang Thi Hoa"</code> (dài 20 &rarr; 13)</td></tr>
</table>
<p class="meo">💡 Trước khi viết bất kỳ hàm nào trong bốn hàm, hãy quyết trước câu trả lời cho ba ca biên và ghi ra lề: chuỗi <code>""</code> thì sao, chuỗi <code>"     "</code> (toàn dấu cách) thì sao, và chuỗi không có dấu cách nào thì sao? Số tôi đo được: cả bốn hàm trả về chuỗi rỗng ở hai ca đầu, và để nguyên ca thứ ba, trừ <code>nameStr</code> thì viết hoa chữ cái đầu. Nếu bản của bạn sập ở một trong ba ca ấy, bạn vừa tìm ra lỗi trước người chấm.</p>`],

      [36, 'lTrim() user-defined string function',
        `<p class="y-chinh">🎯 The first of the four, and the diagram above the code is the whole idea: find how many blanks stand at the front, then <strong>slide the rest of the string left</strong> to overwrite them. The array does not shrink; only the content moves.</p>
<ul>
<li><strong>Line 1 — <code>int i = 0;</code></strong> — <code>i</code> will count the leading blanks. It must start at the very first byte, so 0.</li>
<li><strong>Line 2 — <code>while (s[i] == ' ') i++;</code></strong> — walk forward while the character is a blank. This loop is safe on any valid string because <code>'\\0'</code> is not a blank, so it always stops at or before the terminator. In the slide's picture, <code>"   Hoa"</code> has blanks at 0, 1, 2 and the loop exits with <code>i == 3</code>, pointing at <code>'H'</code>.</li>
<li><strong>Line 3 — <code>if (i &gt; 0) strcpy(&amp;s[0], &amp;s[i]);</code></strong> — this is the blue arrow on the slide: copy the string that starts at index <code>i</code> back to index 0. The <code>if</code> matters: when <code>i</code> is 0 there is nothing to trim, and skipping the copy avoids a pointless self-copy.</li>
<li><strong>Line 4 — <code>return s;</code></strong> — hand back the same pointer so the call can be nested, e.g. <code>rTrim(lTrim(s))</code> on slide 38.</li>
<li><strong>Read the second row of the slide's table carefully</strong> — after the copy, the array holds <code>H o a NULL o a NULL</code>. Indexes 4, 5, 6 still contain the old <code>o</code>, <code>a</code>, <code>NULL</code>! Nothing was erased; the string simply ends earlier now. This is the same observation as slide 27: <code>strcpy</code> moves the terminator, it does not wipe the tail.</li>
<li><strong>⚠️ The hidden defect — overlapping <code>strcpy</code></strong> — source and destination are inside the SAME array, and the C standard says the behaviour of <code>strcpy</code> is undefined if the regions overlap. It normally "works" because the copy runs left to right and the destination is to the left of the source. But it is not guaranteed, and it is checked: on macOS, <code>cc -Wall</code> compiles it and the program then <strong>dies at runtime with SIGTRAP (exit 133)</strong> the moment it hits that line. I measured all three states — it aborts by default, it runs and prints <code>Hello</code> when built with <code>-D_FORTIFY_SOURCE=0</code>, and it runs correctly and legally when <code>strcpy</code> is replaced by <code>memmove</code>.</li>
</ul>
<pre><code>char* lTrim(char s[])
{
    int i = 0;
    while (s[i] == ' ') i++;               /* dem so dau cach o dau */
    if (i &gt; 0) strcpy(&amp;s[0], &amp;s[i]);       /* keo phan con lai ve dau */
    return s;
}

/* Ban VA dung chuan — memmove cho phep vung nho chong lan: */
char* lTrimSafe(char s[])
{
    int i = 0;
    while (s[i] == ' ') i++;
    if (i &gt; 0) memmove(&amp;s[0], &amp;s[i], strlen(&amp;s[i]) + 1);   /* +1 de chep ca '\\0' */
    return s;
}</code></pre>
<table>
<tr><th>Input</th><th>Blanks counted (<code>i</code>)</th><th>Result (measured)</th><th><code>strlen</code> before &rarr; after</th></tr>
<tr><td><code>"   Hello"</code></td><td>3</td><td><code>"Hello"</code></td><td>8 &rarr; <strong>5</strong> — the slide's own example</td></tr>
<tr><td><code>"Hello   "</code></td><td>0</td><td><code>"Hello   "</code></td><td>8 &rarr; 8 — trailing blanks are NOT its job</td></tr>
<tr><td><code>"   I   am   a   student   "</code></td><td>3</td><td><code>"I   am   a   student   "</code></td><td>26 &rarr; 23 — inner blanks untouched</td></tr>
<tr><td><code>""</code> (empty)</td><td>0</td><td><code>""</code></td><td>0 &rarr; 0 — edge case, the loop stops immediately at <code>'\\0'</code></td></tr>
<tr><td><code>"     "</code> (all blanks)</td><td>5</td><td><code>""</code></td><td>5 &rarr; <strong>0</strong> — edge case, everything is trimmed away</td></tr>
<tr><td><code>"abc"</code></td><td>0</td><td><code>"abc"</code></td><td>3 &rarr; 3 — nothing to do, and the <code>if</code> skips the copy</td></tr>
</table>
<p class="dap-an">✅ Đáp án — every row above came from a real run (built with <code>-D_FORTIFY_SOURCE=0</code> so the slide's own <code>strcpy</code> line could execute). The slide's example reproduces exactly: <code>"   Hello"</code> of length 8 becomes <code>"Hello"</code> of length 5. In its default configuration the same program aborts with exit 133 at the overlapping <code>strcpy</code> — so if your lab machine "crashes for no reason" on this function, this is why, and <code>memmove</code> is the fix.</p>
<p class="pitfall">⚠️ Note what <code>lTrim</code> does <em>not</em> handle: a tab (<code>'\\t'</code>) is not <code>' '</code>, so <code>"\\tHello"</code> is left alone. If the exercise says "whitespace" rather than "blank", use <code>isspace()</code> from <code>&lt;ctype.h&gt;</code> in the condition instead of <code>== ' '</code>.</p>`,
        `<p class="y-chinh">🎯 Hàm đầu trong bốn hàm, và sơ đồ phía trên đoạn mã là toàn bộ ý tưởng: đếm xem có bao nhiêu dấu cách đứng ở đầu, rồi <strong>kéo phần còn lại của chuỗi sang trái</strong> để đè lên chúng. Mảng KHÔNG co lại; chỉ nội dung dịch chỗ.</p>
<ul>
<li><strong>Dòng 1 — <code>int i = 0;</code></strong> — <code>i</code> sẽ đếm số dấu cách ở đầu. Nó phải bắt đầu từ chính byte đầu tiên, nên bằng 0.</li>
<li><strong>Dòng 2 — <code>while (s[i] == ' ') i++;</code></strong> — đi tới chừng nào ký tự còn là dấu cách. Vòng lặp này an toàn với mọi chuỗi hợp lệ, vì <code>'\\0'</code> không phải dấu cách nên nó luôn dừng tại hoặc trước dấu kết thúc. Trong hình của slide, <code>"   Hoa"</code> có dấu cách ở 0, 1, 2 và vòng lặp thoát với <code>i == 3</code>, đúng chỗ chữ <code>'H'</code>.</li>
<li><strong>Dòng 3 — <code>if (i &gt; 0) strcpy(&amp;s[0], &amp;s[i]);</code></strong> — đây chính là mũi tên xanh trên slide: chép chuỗi bắt đầu từ chỉ số <code>i</code> về chỉ số 0. Chữ <code>if</code> có lý do: khi <code>i</code> bằng 0 thì chẳng có gì để cắt, bỏ qua phép chép là tránh một lần tự chép vô nghĩa.</li>
<li><strong>Dòng 4 — <code>return s;</code></strong> — trả lại chính con trỏ ấy để lời gọi lồng được vào nhau, ví dụ <code>rTrim(lTrim(s))</code> ở slide 38.</li>
<li><strong>Hãy đọc kỹ hàng thứ hai trong bảng của slide</strong> — sau phép chép, mảng chứa <code>H o a NULL o a NULL</code>. Các chỉ số 4, 5, 6 VẪN còn <code>o</code>, <code>a</code>, <code>NULL</code> cũ! Không có gì bị xoá; chuỗi chỉ đơn giản là kết thúc sớm hơn. Đây đúng là nhận xét ở slide 27: <code>strcpy</code> dời dấu kết thúc chứ không lau phần đuôi.</li>
<li><strong>⚠️ Khuyết tật ẩn — <code>strcpy</code> CHỒNG LẤN</strong> — nguồn và đích nằm trong CÙNG một mảng, mà chuẩn C nói hành vi của <code>strcpy</code> là không xác định nếu hai vùng chồng nhau. Nó thường "chạy được" vì phép chép đi từ trái sang phải và đích nằm bên trái nguồn. Nhưng không có gì bảo đảm, và người ta có kiểm: trên macOS, <code>cc -Wall</code> dịch được rồi chương trình <strong>chết ngay lúc chạy với SIGTRAP (exit 133)</strong> đúng lúc chạm dòng ấy. Tôi đã đo cả ba trạng thái — mặc định thì nó bị giết, dựng với <code>-D_FORTIFY_SOURCE=0</code> thì nó chạy và in <code>Hello</code>, còn thay <code>strcpy</code> bằng <code>memmove</code> thì nó chạy đúng và hợp lệ.</li>
</ul>
<pre><code>char* lTrim(char s[])
{
    int i = 0;
    while (s[i] == ' ') i++;               /* dem so dau cach o dau */
    if (i &gt; 0) strcpy(&amp;s[0], &amp;s[i]);       /* keo phan con lai ve dau */
    return s;
}

/* Ban VA dung chuan — memmove cho phep vung nho chong lan: */
char* lTrimSafe(char s[])
{
    int i = 0;
    while (s[i] == ' ') i++;
    if (i &gt; 0) memmove(&amp;s[0], &amp;s[i], strlen(&amp;s[i]) + 1);   /* +1 de chep ca '\\0' */
    return s;
}</code></pre>
<table>
<tr><th>Vào</th><th>Số dấu cách đếm được (<code>i</code>)</th><th>Ra (đo thật)</th><th><code>strlen</code> trước &rarr; sau</th></tr>
<tr><td><code>"   Hello"</code></td><td>3</td><td><code>"Hello"</code></td><td>8 &rarr; <strong>5</strong> — đúng ví dụ của slide</td></tr>
<tr><td><code>"Hello   "</code></td><td>0</td><td><code>"Hello   "</code></td><td>8 &rarr; 8 — dấu cách cuối KHÔNG phải việc của nó</td></tr>
<tr><td><code>"   I   am   a   student   "</code></td><td>3</td><td><code>"I   am   a   student   "</code></td><td>26 &rarr; 23 — dấu cách bên trong không bị đụng</td></tr>
<tr><td><code>""</code> (rỗng)</td><td>0</td><td><code>""</code></td><td>0 &rarr; 0 — ca biên, vòng lặp dừng ngay ở <code>'\\0'</code></td></tr>
<tr><td><code>"     "</code> (toàn dấu cách)</td><td>5</td><td><code>""</code></td><td>5 &rarr; <strong>0</strong> — ca biên, cắt sạch không còn gì</td></tr>
<tr><td><code>"abc"</code></td><td>0</td><td><code>"abc"</code></td><td>3 &rarr; 3 — không có gì để làm, và chữ <code>if</code> bỏ qua phép chép</td></tr>
</table>
<p class="dap-an">✅ Đáp án — mọi hàng trong bảng đều lấy từ một lần chạy thật (dựng với <code>-D_FORTIFY_SOURCE=0</code> để dòng <code>strcpy</code> của chính slide chạy được). Ví dụ của slide tái tạo y hệt: <code>"   Hello"</code> dài 8 thành <code>"Hello"</code> dài 5. Còn ở cấu hình mặc định thì đúng chương trình ấy bị giết với exit 133 tại chỗ <code>strcpy</code> chồng lấn — nên nếu máy phòng lab của bạn "sập không rõ lý do" ở hàm này thì đây là lý do, và <code>memmove</code> là bản vá.</p>
<p class="pitfall">⚠️ Để ý thứ <code>lTrim</code> KHÔNG xử lý: ký tự tab (<code>'\\t'</code>) không phải <code>' '</code>, nên <code>"\\tHello"</code> được để nguyên. Nếu đề bài nói "khoảng trắng" chứ không nói "dấu cách" thì hãy dùng <code>isspace()</code> trong <code>&lt;ctype.h&gt;</code> ở điều kiện thay cho <code>== ' '</code>.</p>`],

      [37, 'rTrim() user-defined string function',
        `<p class="y-chinh">🎯 The mirror of slide 36, and it is <strong>cheaper</strong>: to cut blanks off the end you do not move a single character. You just put the <code>'\\0'</code> in a new place. The blue arrow on the slide points leftwards for exactly that reason.</p>
<ul>
<li><strong>Line 1 — <code>int i = strlen(s) - 1;</code></strong> — start at the LAST real character, not at the terminator. For <code>"Hoa   "</code>, <code>strlen</code> is 6 so <code>i</code> starts at 5, which is the final blank.</li>
<li><strong>Line 2 — <code>while (s[i] == ' ') i--;</code></strong> — walk backwards while blanks continue. The slide's trace shows <code>i = 5, 4, 3</code> and then it stops at index 2, which holds <code>'a'</code>.</li>
<li><strong>Line 3 — <code>s[i+1] = '\\0';</code></strong> — the whole trick. <code>i</code> now points at the last character you want to KEEP, so the terminator belongs one place further along. The <code>+1</code> is the single most error-prone character on this slide; writing <code>s[i] = '\\0'</code> eats one real character.</li>
<li><strong>Nothing is moved and nothing is freed</strong> — the slide's second table shows <code>H o a NULL . . NULL</code>: the old bytes at 4, 5, 6 are still there, and the array is still 7 bytes wide. Only the meaning of the array changed.</li>
<li><strong>Why it must be a separate pass from <code>lTrim</code></strong> — the two walk in opposite directions and use different mechanisms: <code>lTrim</code> must copy, <code>rTrim</code> need only write one byte. Slide 38 will run them one after the other.</li>
<li><strong>⚠️ A real bug in the slide's version</strong> — for an empty string, <code>strlen(s) - 1</code> is <strong>−1</strong>, so <code>s[-1]</code> is read: that is outside the array. For a string of nothing but blanks, <code>i</code> marches down past 0 into the same territory. I ran it: on this machine the byte before the array happened not to be a blank, so the loop stopped and the program printed the right answer — which is exactly what makes this class of bug so dangerous. One guard fixes it: <code>while (i &gt;= 0 &amp;&amp; s[i] == ' ') i--;</code>.</li>
</ul>
<pre><code>char* rTrim(char s[])
{
    int i = strlen(s) - 1;
    while (s[i] == ' ') i--;
    s[i+1] = '\\0';      /* NULL */
    return s;
}

/* Ban da chot: an toan voi chuoi rong va chuoi toan dau cach */
char* rTrimSafe(char s[])
{
    int i = (int)strlen(s) - 1;
    while (i &gt;= 0 &amp;&amp; s[i] == ' ') i--;
    s[i+1] = '\\0';
    return s;
}</code></pre>
<table>
<tr><th>Input</th><th>Where <code>i</code> stops</th><th>Result (measured)</th><th><code>strlen</code> before &rarr; after</th></tr>
<tr><td><code>"Hello   "</code></td><td>4 (the <code>'o'</code>)</td><td><code>"Hello"</code></td><td>8 &rarr; <strong>5</strong> — the slide's own example</td></tr>
<tr><td><code>"   Hello"</code></td><td>7 (the <code>'o'</code>)</td><td><code>"   Hello"</code></td><td>8 &rarr; 8 — leading blanks are NOT its job</td></tr>
<tr><td><code>"   I   am   a   student   "</code></td><td>22 (the <code>'t'</code>)</td><td><code>"   I   am   a   student"</code></td><td>26 &rarr; 23</td></tr>
<tr><td><code>"abc"</code></td><td>2</td><td><code>"abc"</code></td><td>3 &rarr; 3 — no trailing blank, <code>s[3] = '\\0'</code> is written harmlessly</td></tr>
<tr><td><code>"     "</code> (all blanks)</td><td><strong>−1 — outside the array</strong></td><td><code>""</code></td><td>5 &rarr; <strong>0</strong> — right answer, wrong road: see the guard above</td></tr>
<tr><td><code>""</code> (empty)</td><td><strong>−1 before the loop even starts</strong></td><td><code>""</code></td><td>0 &rarr; 0 — <code>s[-1]</code> is read; undefined behaviour</td></tr>
</table>
<p class="dap-an">✅ Đáp án — measured with <code>cc -Wall</code>: <code>"Hello   "</code> of length 8 becomes <code>"Hello"</code> of length 5, matching the slide exactly. The two bottom rows are the interesting ones: both produced the <em>correct</em> output while reading memory outside the array. Correct output is not proof of correct code — add the <code>i &gt;= 0</code> guard and the same function becomes defensible.</p>
<p class="meo">💡 Remember the pair as "left costs a copy, right costs a byte". If you ever need to trim the right side of a huge string in a loop, that asymmetry is why you should trim right first and left once at the end — the copy then moves less data.</p>`,
        `<p class="y-chinh">🎯 Ảnh soi gương của slide 36, và nó <strong>RẺ hơn</strong>: để cắt dấu cách ở cuối, bạn không phải dời một ký tự nào. Chỉ cần đặt dấu <code>'\\0'</code> vào chỗ mới. Mũi tên xanh trên slide chỉ sang trái đúng vì lẽ đó.</p>
<ul>
<li><strong>Dòng 1 — <code>int i = strlen(s) - 1;</code></strong> — bắt đầu từ ký tự THẬT cuối cùng, không phải từ dấu kết thúc. Với <code>"Hoa   "</code>, <code>strlen</code> bằng 6 nên <code>i</code> khởi đầu ở 5, đúng cái dấu cách cuối.</li>
<li><strong>Dòng 2 — <code>while (s[i] == ' ') i--;</code></strong> — lùi dần chừng nào còn gặp dấu cách. Bảng vết trên slide cho thấy <code>i = 5, 4, 3</code> rồi dừng ở chỉ số 2, nơi chứa chữ <code>'a'</code>.</li>
<li><strong>Dòng 3 — <code>s[i+1] = '\\0';</code></strong> — cả cái mẹo nằm ở đây. <code>i</code> lúc này trỏ vào ký tự cuối cùng bạn muốn GIỮ, nên dấu kết thúc phải nằm lùi thêm một ô. Dấu <code>+1</code> là ký tự dễ sai nhất trên cả slide này; viết <code>s[i] = '\\0'</code> là ăn mất một ký tự thật.</li>
<li><strong>Không có gì bị dời và không có gì được giải phóng</strong> — bảng thứ hai của slide cho thấy <code>H o a NULL . . NULL</code>: các byte cũ ở 4, 5, 6 vẫn còn nguyên, và mảng vẫn rộng 7 byte. Chỉ có Ý NGHĨA của mảng là đổi.</li>
<li><strong>Vì sao nó phải là một lượt quét riêng so với <code>lTrim</code></strong> — hai hàm đi ngược chiều nhau và dùng cơ chế khác nhau: <code>lTrim</code> buộc phải chép, còn <code>rTrim</code> chỉ cần ghi một byte. Slide 38 sẽ chạy chúng nối đuôi nhau.</li>
<li><strong>⚠️ Một lỗi THẬT trong bản của slide</strong> — với chuỗi rỗng, <code>strlen(s) - 1</code> bằng <strong>−1</strong>, nên <code>s[-1]</code> bị đọc: chỗ ấy nằm ngoài mảng. Với chuỗi toàn dấu cách, <code>i</code> tụt qua 0 vào đúng vùng đất ấy. Tôi đã chạy: trên máy này byte đứng trước mảng tình cờ không phải dấu cách, nên vòng lặp dừng và chương trình in ra kết quả đúng — và chính điều đó mới làm loại lỗi này nguy hiểm. Một cái chốt là xong: <code>while (i &gt;= 0 &amp;&amp; s[i] == ' ') i--;</code>.</li>
</ul>
<pre><code>char* rTrim(char s[])
{
    int i = strlen(s) - 1;
    while (s[i] == ' ') i--;
    s[i+1] = '\\0';      /* NULL */
    return s;
}

/* Ban da chot: an toan voi chuoi rong va chuoi toan dau cach */
char* rTrimSafe(char s[])
{
    int i = (int)strlen(s) - 1;
    while (i &gt;= 0 &amp;&amp; s[i] == ' ') i--;
    s[i+1] = '\\0';
    return s;
}</code></pre>
<table>
<tr><th>Vào</th><th><code>i</code> dừng ở đâu</th><th>Ra (đo thật)</th><th><code>strlen</code> trước &rarr; sau</th></tr>
<tr><td><code>"Hello   "</code></td><td>4 (chữ <code>'o'</code>)</td><td><code>"Hello"</code></td><td>8 &rarr; <strong>5</strong> — đúng ví dụ của slide</td></tr>
<tr><td><code>"   Hello"</code></td><td>7 (chữ <code>'o'</code>)</td><td><code>"   Hello"</code></td><td>8 &rarr; 8 — dấu cách đầu KHÔNG phải việc của nó</td></tr>
<tr><td><code>"   I   am   a   student   "</code></td><td>22 (chữ <code>'t'</code>)</td><td><code>"   I   am   a   student"</code></td><td>26 &rarr; 23</td></tr>
<tr><td><code>"abc"</code></td><td>2</td><td><code>"abc"</code></td><td>3 &rarr; 3 — không có dấu cách cuối, <code>s[3] = '\\0'</code> ghi vào chỗ vô hại</td></tr>
<tr><td><code>"     "</code> (toàn dấu cách)</td><td><strong>−1 — ngoài mảng</strong></td><td><code>""</code></td><td>5 &rarr; <strong>0</strong> — đúng kết quả, sai đường đi: xem chốt ở trên</td></tr>
<tr><td><code>""</code> (rỗng)</td><td><strong>−1 ngay trước khi vòng lặp chạy</strong></td><td><code>""</code></td><td>0 &rarr; 0 — <code>s[-1]</code> bị đọc; hành vi không xác định</td></tr>
</table>
<p class="dap-an">✅ Đáp án — đo bằng <code>cc -Wall</code>: <code>"Hello   "</code> dài 8 thành <code>"Hello"</code> dài 5, khớp slide chính xác. Hai hàng cuối mới là chỗ đáng chú ý: cả hai đều cho ra kết quả ĐÚNG trong khi đang đọc bộ nhớ ngoài mảng. Kết quả đúng KHÔNG chứng minh mã đúng — thêm chốt <code>i &gt;= 0</code> thì chính hàm ấy trở nên bảo vệ được.</p>
<p class="meo">💡 Nhớ cặp này bằng câu "bên trái tốn một lần chép, bên phải tốn một byte". Nếu có lúc phải cắt đuôi một chuỗi khổng lồ trong vòng lặp, chính sự bất đối xứng ấy là lý do nên cắt phải trước rồi cắt trái một lần ở cuối — khi đó phép chép phải dời ít dữ liệu hơn.</p>`],

      [38, 'trim() user-defined string function',
        `<p class="y-chinh">🎯 The third function reuses the first two and then adds the hard part: squeezing the <strong>inner</strong> runs of blanks down to one. The diagram on the left shows the two-step warm-up; the stack of blue bars on the right is the loop, one line per removed blank.</p>
<ul>
<li><strong>Line 1 — <code>rTrim(lTrim(s));</code></strong> — the ends first. Reading it inside out: <code>lTrim(s)</code> removes the leading blanks and returns <code>s</code>, then <code>rTrim</code> receives that same pointer and removes the trailing ones. This one line is the payoff for making both functions <code>return s</code>. On the slide: <code>"   Hoa   anh   dao   "</code> &rarr; <code>"Hoa   anh   dao   "</code> &rarr; <code>"Hoa   anh   dao"</code>.</li>
<li><strong>Line 2 — <code>char *ptr = strstr(s, "  ");</code></strong> — the needle is <strong>two</strong> blanks, not one. That is the definition of "extra blank": a blank that is immediately followed by another blank. If <code>strstr</code> returns <code>NULL</code>, the string is already clean.</li>
<li><strong>Line 3 — <code>while (ptr != NULL)</code></strong> — <em>"While two blanks exist"</em>, says the slide's own comment. The loop keeps going until no double blank is left anywhere.</li>
<li><strong>Line 4 — <code>strcpy(ptr, ptr+1);</code></strong> — <em>"remove one blank"</em>. It copies the string starting one byte further along back over <code>ptr</code>, which deletes exactly one character — the first of the pair. The red arrows on the slide are these repeated shifts: five bars, five deletions, <code>"Hoa   anh   dao"</code> down to <code>"Hoa anh dao"</code>.</li>
<li><strong>Line 5 — <code>ptr = strstr(s, "  ");</code></strong> — search again from the beginning. It works, but it is the inefficient part: each pass rescans the whole string, so a text with k extra blanks costs about k full scans. Searching from <code>ptr</code> instead of <code>s</code> would be enough and is a fair improvement to mention in an exam answer.</li>
<li><strong>⚠️ Two overlapping copies, same warning as slide 36</strong> — both <code>lTrim</code>'s <code>strcpy</code> and this <code>strcpy(ptr, ptr+1)</code> copy within one array. On macOS the program is killed at the first one (SIGTRAP, exit 133). Replace both with <code>memmove</code> and the function is legal C; the behaviour and all the numbers below are unchanged.</li>
</ul>
<pre><code>char* trim(char s[])
{
    rTrim(lTrim(s));
    char *ptr = strstr(s, "  ");
    while (ptr != NULL)              /* While two blanks exist */
    {
        strcpy(ptr, ptr+1);          /* remove one blank       */
        ptr = strstr(s, "  ");
    }
    return s;
}</code></pre>
<table>
<tr><th>Input</th><th>After <code>lTrim</code></th><th>After <code>rTrim</code></th><th>Final result (measured)</th><th>Length</th></tr>
<tr><td><code>"   Hoa   anh   dao   "</code></td><td><code>"Hoa   anh   dao   "</code></td><td><code>"Hoa   anh   dao"</code></td><td><code>"Hoa anh dao"</code></td><td>21 &rarr; 11</td></tr>
<tr><td><code>"   I   am   a   student   "</code></td><td><code>"I   am   a   student   "</code></td><td><code>"I   am   a   student"</code></td><td><strong><code>"I am a student"</code></strong></td><td>26 &rarr; <strong>14</strong></td></tr>
<tr><td><code>"  hoang thi    hoa  "</code></td><td><code>"hoang thi    hoa  "</code></td><td><code>"hoang thi    hoa"</code></td><td><code>"hoang thi hoa"</code></td><td>20 &rarr; 13</td></tr>
<tr><td><code>"abc"</code></td><td><code>"abc"</code></td><td><code>"abc"</code></td><td><code>"abc"</code></td><td>3 &rarr; 3 — edge case: <code>strstr</code> returns <code>NULL</code> at once</td></tr>
<tr><td><code>""</code></td><td><code>""</code></td><td><code>""</code></td><td><code>""</code></td><td>0 &rarr; 0 — edge case</td></tr>
<tr><td><code>"     "</code></td><td><code>""</code></td><td><code>""</code></td><td><code>""</code></td><td>5 &rarr; <strong>0</strong> — edge case: the ends ate everything</td></tr>
</table>
<p class="dap-an">✅ Đáp án — run for real: <code>"   I   am   a   student   "</code> (26 characters) comes out as <code>"I am a student"</code> (14), and <code>"  hoang thi    hoa  "</code> (20) comes out as <code>"hoang thi hoa"</code> (13). Both match the slide's stated intent. Recall the note on slide 35: the slide's own third example writes the INPUT without the word "a" while showing an output that contains it — the function did not invent it, the slide dropped it.</p>
<p class="meo">💡 The <code>"  "</code> needle is the elegant bit worth remembering: instead of tracking "was the previous character a blank?" by hand, it lets <code>strstr</code> find the condition for you. The same idea reappears in Exercise 6 on slide 42, where <code>strstr</code> locates each occurrence to replace.</p>`,
        `<p class="y-chinh">🎯 Hàm thứ ba dùng lại hai hàm trước rồi thêm phần khó: bóp các chuỗi dấu cách nằm <strong>bên trong</strong> xuống còn một. Sơ đồ bên trái là hai bước khởi động; chồng thanh xanh bên phải chính là vòng lặp, mỗi dòng một dấu cách bị xoá.</p>
<ul>
<li><strong>Dòng 1 — <code>rTrim(lTrim(s));</code></strong> — hai đầu trước đã. Đọc từ trong ra: <code>lTrim(s)</code> cắt dấu cách đầu rồi trả về <code>s</code>, sau đó <code>rTrim</code> nhận đúng con trỏ ấy và cắt dấu cách cuối. Một dòng này chính là phần thưởng cho việc cả hai hàm đều <code>return s</code>. Trên slide: <code>"   Hoa   anh   dao   "</code> &rarr; <code>"Hoa   anh   dao   "</code> &rarr; <code>"Hoa   anh   dao"</code>.</li>
<li><strong>Dòng 2 — <code>char *ptr = strstr(s, "  ");</code></strong> — cây kim là <strong>HAI</strong> dấu cách, không phải một. Đó chính là định nghĩa của "dấu cách thừa": một dấu cách mà ngay sau nó lại là một dấu cách nữa. Nếu <code>strstr</code> trả <code>NULL</code> thì chuỗi vốn đã sạch.</li>
<li><strong>Dòng 3 — <code>while (ptr != NULL)</code></strong> — <em>"Chừng nào còn tồn tại hai dấu cách"</em>, đúng lời chú thích của chính slide. Vòng lặp chạy cho tới khi không còn cặp dấu cách nào ở bất cứ đâu.</li>
<li><strong>Dòng 4 — <code>strcpy(ptr, ptr+1);</code></strong> — <em>"bỏ đi một dấu cách"</em>. Nó chép chuỗi bắt đầu lùi một byte về đè lên <code>ptr</code>, tức là xoá đúng một ký tự — cái đầu trong cặp. Các mũi tên đỏ trên slide là những lần dịch lặp đi lặp lại ấy: năm thanh, năm lần xoá, từ <code>"Hoa   anh   dao"</code> xuống <code>"Hoa anh dao"</code>.</li>
<li><strong>Dòng 5 — <code>ptr = strstr(s, "  ");</code></strong> — tìm lại từ đầu. Chạy đúng, nhưng đây là chỗ kém hiệu quả: mỗi lượt quét lại cả chuỗi, nên một văn bản có k dấu cách thừa tốn cỡ k lần quét toàn bộ. Tìm từ <code>ptr</code> thay vì từ <code>s</code> là đủ, và đó là một cải tiến đáng nêu trong bài thi.</li>
<li><strong>⚠️ Hai phép chép chồng lấn, cùng cảnh báo với slide 36</strong> — cả <code>strcpy</code> trong <code>lTrim</code> lẫn <code>strcpy(ptr, ptr+1)</code> ở đây đều chép trong cùng một mảng. Trên macOS chương trình bị giết ngay ở cái đầu tiên (SIGTRAP, exit 133). Thay cả hai bằng <code>memmove</code> thì hàm trở thành C hợp lệ; hành vi và mọi con số dưới đây không đổi.</li>
</ul>
<pre><code>char* trim(char s[])
{
    rTrim(lTrim(s));
    char *ptr = strstr(s, "  ");
    while (ptr != NULL)              /* While two blanks exist */
    {
        strcpy(ptr, ptr+1);          /* remove one blank       */
        ptr = strstr(s, "  ");
    }
    return s;
}</code></pre>
<table>
<tr><th>Vào</th><th>Sau <code>lTrim</code></th><th>Sau <code>rTrim</code></th><th>Kết quả cuối (đo thật)</th><th>Độ dài</th></tr>
<tr><td><code>"   Hoa   anh   dao   "</code></td><td><code>"Hoa   anh   dao   "</code></td><td><code>"Hoa   anh   dao"</code></td><td><code>"Hoa anh dao"</code></td><td>21 &rarr; 11</td></tr>
<tr><td><code>"   I   am   a   student   "</code></td><td><code>"I   am   a   student   "</code></td><td><code>"I   am   a   student"</code></td><td><strong><code>"I am a student"</code></strong></td><td>26 &rarr; <strong>14</strong></td></tr>
<tr><td><code>"  hoang thi    hoa  "</code></td><td><code>"hoang thi    hoa  "</code></td><td><code>"hoang thi    hoa"</code></td><td><code>"hoang thi hoa"</code></td><td>20 &rarr; 13</td></tr>
<tr><td><code>"abc"</code></td><td><code>"abc"</code></td><td><code>"abc"</code></td><td><code>"abc"</code></td><td>3 &rarr; 3 — ca biên: <code>strstr</code> trả <code>NULL</code> ngay</td></tr>
<tr><td><code>""</code></td><td><code>""</code></td><td><code>""</code></td><td><code>""</code></td><td>0 &rarr; 0 — ca biên</td></tr>
<tr><td><code>"     "</code></td><td><code>""</code></td><td><code>""</code></td><td><code>""</code></td><td>5 &rarr; <strong>0</strong> — ca biên: hai đầu đã ăn hết</td></tr>
</table>
<p class="dap-an">✅ Đáp án — chạy thật: <code>"   I   am   a   student   "</code> (26 ký tự) ra <code>"I am a student"</code> (14), và <code>"  hoang thi    hoa  "</code> (20) ra <code>"hoang thi hoa"</code> (13). Cả hai khớp với ý slide muốn nói. Nhắc lại ghi chú ở slide 35: ví dụ thứ ba của chính slide viết dữ liệu VÀO thiếu chữ "a" mà lại trưng ra kết quả có chữ ấy — hàm không bịa thêm, mà slide đánh rơi.</p>
<p class="meo">💡 Cây kim <code>"  "</code> là chỗ thanh lịch đáng nhớ: thay vì tự tay theo dõi "ký tự trước có phải dấu cách không?", nó để <code>strstr</code> tìm giùm cái điều kiện ấy. Ý tưởng y hệt sẽ quay lại ở Exercise 6 slide 42, nơi <code>strstr</code> định vị từng chỗ cần thay.</p>`],

      [39, 'nameStr() user-defined string function',
        `<p class="y-chinh">🎯 The top of the pyramid: turn whatever a human typed into a properly-cased name. <code>"   hOA  anH   dAo    nO   "</code> becomes <code>"Hoa Anh Dao No"</code>. It is three steps, and the first two are functions you already have.</p>
<ul>
<li><strong>Line 1 — <code>trim(s);</code></strong> — <em>"trim all extra blanks"</em>. This is why slide 38 had to come first: the capitalisation rule depends on single blanks between words, so the blanks must be normalised before anything else. The slide's picture shows <code>"   hOA  anH   dAo    nO   "</code> collapsing to <code>"hOA anH dAo nO"</code>.</li>
<li><strong>Line 2 — <code>strlwr(s);</code></strong> — <em>"convert it to lowercase"</em>. Flattening the case first is what lets step three be a single rule; otherwise you would have to both raise and lower letters. The picture: <code>"hOA anH dAo nO"</code> &rarr; <code>"hoa anh dao no"</code>. Remember slide 31: <code>strlwr</code> is not standard C, so on a non-Windows compiler substitute the four-line <code>tolower</code> loop.</li>
<li><strong>Line 3 — <code>int L = strlen(s);</code></strong> — compute the length once, before the loop. Slide 26 explained why: calling <code>strlen</code> inside the loop condition would rescan the string every iteration.</li>
<li><strong>Line 4 — the loop and its condition</strong> — <code>if (i==0 || (i&gt;0 &amp;&amp; s[i-1]==' ')) s[i] = toupper(s[i]);</code>. Read it as one sentence: <em>capitalise this character if it is the first character of the string, or if the character before it is a blank</em>. That is the definition of "first letter of a word", and it is the SAME criterion as Exercise 4 on slide 40.</li>
<li><strong>Why the <code>i==0</code> branch has to be there</strong> — without it the very first letter would never be raised, because there is no <code>s[-1]</code> to look at. And note the short-circuit: since <code>i==0</code> is tested first, <code>s[i-1]</code> is only ever evaluated when <code>i</code> is at least 1. The extra <code>i&gt;0</code> in the slide's code is redundant but harmless, and it documents the intent.</li>
<li><strong>The red arrows on the slide are the loop hitting indices 0, 4, 8 and 12</strong> — exactly the four word-starts of <code>"hoa anh dao no"</code>. Every other index is left in lowercase, which is what makes <code>"dAo"</code> come out as <code>"Dao"</code> rather than <code>"DAo"</code>.</li>
</ul>
<pre><code>char* nameStr(char s[])
{
    trim(s);        /* trim all extra blanks   */
    strlwr(s);      /* convert it to lowercase */
    int L = strlen(s);
    int i;
    for (i = 0; i &lt; L; i++)
        if (i == 0 || (i &gt; 0 &amp;&amp; s[i-1] == ' '))
            s[i] = toupper(s[i]);
    return s;
}</code></pre>
<table>
<tr><th>Input</th><th>After <code>trim</code></th><th>After lowercase</th><th>Capitalised at indices</th><th>Result (measured)</th></tr>
<tr><td><code>"   hOA  anH   dAo    nO   "</code></td><td><code>"hOA anH dAo nO"</code></td><td><code>"hoa anh dao no"</code></td><td>0, 4, 8, 12</td><td><strong><code>"Hoa Anh Dao No"</code></strong></td></tr>
<tr><td><code>"  hoang thi    hoa  "</code></td><td><code>"hoang thi hoa"</code></td><td><code>"hoang thi hoa"</code></td><td>0, 6, 10</td><td><strong><code>"Hoang Thi Hoa"</code></strong></td></tr>
<tr><td><code>"   I   am   a   student   "</code></td><td><code>"I am a student"</code></td><td><code>"i am a student"</code></td><td>0, 2, 5, 7</td><td><code>"I Am A Student"</code></td></tr>
<tr><td><code>"abc"</code></td><td><code>"abc"</code></td><td><code>"abc"</code></td><td>0</td><td><code>"Abc"</code> — edge case: one word, one capital</td></tr>
<tr><td><code>""</code></td><td><code>""</code></td><td><code>""</code></td><td>none</td><td><code>""</code> — edge case: <code>L</code> is 0, the loop body never runs</td></tr>
<tr><td><code>"     "</code></td><td><code>""</code></td><td><code>""</code></td><td>none</td><td><code>""</code> — edge case: trimmed to nothing first</td></tr>
</table>
<p class="dap-an">✅ Đáp án — compiled and run: <code>"   hOA  anH   dAo    nO   "</code> (26 characters) came out as <strong><code>"Hoa Anh Dao No"</code></strong> (14), character for character the string in the slide's last blue bar. The slide's other example, <code>"  hoang thi    hoa  "</code> (20), came out as <strong><code>"Hoang Thi Hoa"</code></strong> (13). Both used the portable <code>tolower</code> loop in place of <code>strlwr</code>, because <code>strlwr</code> does not compile outside Windows.</p>
<p class="pitfall">⚠️ <code>nameStr</code> is a good demonstration and a bad name-formatter. It will turn <code>"o'brien"</code> into <code>"O'brien"</code> and <code>"nguyen van a"</code> into <code>"Nguyen Van A"</code> but also <code>"McDonald"</code> into <code>"Mcdonald"</code>. Real names are not a formatting problem with one rule — which is a useful thing to know before you write a user-registration form.</p>`,
        `<p class="y-chinh">🎯 Đỉnh của kim tự tháp: biến bất cứ thứ gì người dùng gõ vào thành một cái tên viết hoa đúng chuẩn. <code>"   hOA  anH   dAo    nO   "</code> thành <code>"Hoa Anh Dao No"</code>. Ba bước, và hai bước đầu là những hàm bạn đã có sẵn.</p>
<ul>
<li><strong>Dòng 1 — <code>trim(s);</code></strong> — <em>"cắt hết dấu cách thừa"</em>. Đây là lý do slide 38 phải đứng trước: luật viết hoa dựa vào việc giữa các từ chỉ có MỘT dấu cách, nên phải chuẩn hoá dấu cách trước đã. Hình trên slide cho thấy <code>"   hOA  anH   dAo    nO   "</code> co lại thành <code>"hOA anH dAo nO"</code>.</li>
<li><strong>Dòng 2 — <code>strlwr(s);</code></strong> — <em>"đổi hết sang chữ thường"</em>. San phẳng chữ hoa/thường trước là thứ cho phép bước ba chỉ cần một luật duy nhất; không thì bạn vừa phải nâng vừa phải hạ từng chữ. Hình: <code>"hOA anH dAo nO"</code> &rarr; <code>"hoa anh dao no"</code>. Nhớ slide 31: <code>strlwr</code> không thuộc chuẩn C, nên trên trình biên dịch ngoài Windows hãy thay bằng vòng lặp <code>tolower</code> bốn dòng.</li>
<li><strong>Dòng 3 — <code>int L = strlen(s);</code></strong> — tính độ dài MỘT lần, trước vòng lặp. Slide 26 đã giải thích vì sao: đặt <code>strlen</code> vào điều kiện vòng lặp là quét lại cả chuỗi ở mỗi vòng.</li>
<li><strong>Dòng 4 — vòng lặp và điều kiện của nó</strong> — <code>if (i==0 || (i&gt;0 &amp;&amp; s[i-1]==' ')) s[i] = toupper(s[i]);</code>. Đọc nó thành một câu: <em>hãy viết hoa ký tự này nếu nó là ký tự đầu tiên của chuỗi, hoặc nếu ký tự đứng ngay trước nó là dấu cách</em>. Đó chính là định nghĩa "chữ cái đầu của một từ", và nó TRÙNG tiêu chí của Exercise 4 ở slide 40.</li>
<li><strong>Vì sao nhánh <code>i==0</code> bắt buộc phải có</strong> — không có nó thì chữ cái đầu tiên chẳng bao giờ được nâng, vì làm gì có <code>s[-1]</code> để nhìn. Và để ý phép đoản mạch: vì <code>i==0</code> được kiểm trước, <code>s[i-1]</code> chỉ được tính khi <code>i</code> từ 1 trở lên. Điều kiện <code>i&gt;0</code> thừa trong mã của slide là vô hại, và nó ghi lại ý định cho người đọc.</li>
<li><strong>Các mũi tên đỏ trên slide là vòng lặp chạm vào chỉ số 0, 4, 8 và 12</strong> — đúng bốn chỗ bắt đầu từ của <code>"hoa anh dao no"</code>. Mọi chỉ số khác giữ nguyên chữ thường, và chính điều đó làm <code>"dAo"</code> ra thành <code>"Dao"</code> chứ không phải <code>"DAo"</code>.</li>
</ul>
<pre><code>char* nameStr(char s[])
{
    trim(s);        /* trim all extra blanks   */
    strlwr(s);      /* convert it to lowercase */
    int L = strlen(s);
    int i;
    for (i = 0; i &lt; L; i++)
        if (i == 0 || (i &gt; 0 &amp;&amp; s[i-1] == ' '))
            s[i] = toupper(s[i]);
    return s;
}</code></pre>
<table>
<tr><th>Vào</th><th>Sau <code>trim</code></th><th>Sau đổi chữ thường</th><th>Viết hoa ở chỉ số</th><th>Ra (đo thật)</th></tr>
<tr><td><code>"   hOA  anH   dAo    nO   "</code></td><td><code>"hOA anH dAo nO"</code></td><td><code>"hoa anh dao no"</code></td><td>0, 4, 8, 12</td><td><strong><code>"Hoa Anh Dao No"</code></strong></td></tr>
<tr><td><code>"  hoang thi    hoa  "</code></td><td><code>"hoang thi hoa"</code></td><td><code>"hoang thi hoa"</code></td><td>0, 6, 10</td><td><strong><code>"Hoang Thi Hoa"</code></strong></td></tr>
<tr><td><code>"   I   am   a   student   "</code></td><td><code>"I am a student"</code></td><td><code>"i am a student"</code></td><td>0, 2, 5, 7</td><td><code>"I Am A Student"</code></td></tr>
<tr><td><code>"abc"</code></td><td><code>"abc"</code></td><td><code>"abc"</code></td><td>0</td><td><code>"Abc"</code> — ca biên: một từ, một chữ hoa</td></tr>
<tr><td><code>""</code></td><td><code>""</code></td><td><code>""</code></td><td>không có</td><td><code>""</code> — ca biên: <code>L</code> bằng 0, thân vòng lặp không chạy</td></tr>
<tr><td><code>"     "</code></td><td><code>""</code></td><td><code>""</code></td><td>không có</td><td><code>""</code> — ca biên: bị cắt sạch ngay từ bước đầu</td></tr>
</table>
<p class="dap-an">✅ Đáp án — đã biên dịch và chạy thật: <code>"   hOA  anH   dAo    nO   "</code> (26 ký tự) ra <strong><code>"Hoa Anh Dao No"</code></strong> (14), giống từng ký tự chuỗi trong thanh xanh cuối cùng của slide. Ví dụ còn lại của slide, <code>"  hoang thi    hoa  "</code> (20), ra <strong><code>"Hoang Thi Hoa"</code></strong> (13). Cả hai đều dùng vòng lặp <code>tolower</code> khả chuyển thay cho <code>strlwr</code>, vì <code>strlwr</code> không dịch được ngoài Windows.</p>
<p class="pitfall">⚠️ <code>nameStr</code> là một bài minh hoạ hay và một bộ định dạng tên dở. Nó biến <code>"o'brien"</code> thành <code>"O'brien"</code> và <code>"nguyen van a"</code> thành <code>"Nguyen Van A"</code>, nhưng cũng biến <code>"McDonald"</code> thành <code>"Mcdonald"</code>. Tên người thật không phải bài toán định dạng một luật — biết điều này trước khi viết một biểu mẫu đăng ký người dùng thì rất có ích.</p>`],

      [40, 'Exercise 4: Counting words in a string',
        `<p class="y-chinh">🎯 <em>"Suppose that only the blank character is used to separate words in a sentence. Implement a function for counting number of words in a sentence."</em> Marked <strong>Do Yourself</strong>, and the slide hands you the answer in one line — the blue box at the bottom right.</p>
<ul>
<li><strong>The criterion, verbatim from the slide</strong> — <em>increase count when <code>s[i]</code> is not a blank AND (<code>i==0</code> or <code>s[i-1]</code> is a blank)</em>. In words: count the <strong>starts</strong> of words, not the words themselves. It is the same test <code>nameStr</code> used on slide 39 to decide where to capitalise.</li>
<li><strong>Why counting blanks does NOT work</strong> — the obvious idea is "words = blanks + 1". That fails on every string in the trace: leading blanks, trailing blanks, or two blanks in a row all break it. Counting transitions is immune to all three, which is exactly why the slide phrases it that way.</li>
<li><strong>Reading the trace table</strong> — the sentence occupies indices 0 to 19 and reads <code>T</code>·blank·<code>nu</code>·2 blanks·<code>na</code>·blank·<code>nu</code>·2 blanks·<code>nong</code>·2 blanks·<code>t</code>. The <code>count</code> row steps 0 &rarr; 1 &rarr; 2 &rarr; 3 &rarr; 4 &rarr; 5 &rarr; 6, and the arrows land under indices 0, 2, 6, 9, 13 and 19.</li>
<li><strong>I reproduced the trace exactly</strong> — running the criterion on <code>"T nu  na nu  nong  t"</code> (20 characters) prints the increment indices <strong>0, 2, 6, 9, 13, 19</strong> and the final count <strong>6</strong>. Every arrow on the slide is accounted for, which confirms the string the slide drew.</li>
<li><strong>The <code>i==0</code> half of the condition</strong> — it exists for the case where the sentence starts with a letter and there is no previous character to inspect. Thanks to short-circuit evaluation, <code>s[i-1]</code> is never read when <code>i</code> is 0, so no out-of-bounds access happens. Swap the two halves of the <code>||</code> and you introduce the same bug slide 37's <code>rTrim</code> has.</li>
<li><strong>One pass, no extra memory</strong> — the whole function is a single <code>for</code> loop with two comparisons per character. No <code>strtok</code>, no copying, and it does not modify the string — which matters, because <code>strtok</code> would have destroyed it (slide 33).</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int countWords(char s[])
{
    int i, count = 0;
    for (i = 0; s[i] != '\\0'; i++)
        if (s[i] != ' ' &amp;&amp; (i == 0 || s[i-1] == ' '))
            count++;
    return count;
}

int main(void)
{
    char s[] = "T nu  na nu  nong  t";   /* dung chuoi tren slide */
    printf("%d\\n", countWords(s));       /* 6 */
    return 0;
}</code></pre>
<table>
<tr><th>Sentence</th><th>Indices where <code>count</code> increases</th><th>Words (measured)</th><th>Why it is a trap</th></tr>
<tr><td><code>"T nu  na nu  nong  t"</code></td><td><strong>0, 2, 6, 9, 13, 19</strong></td><td><strong>6</strong></td><td>the slide's own trace — every arrow matches</td></tr>
<tr><td><code>""</code></td><td>none</td><td><strong>0</strong></td><td>edge case: the loop never runs</td></tr>
<tr><td><code>"   "</code></td><td>none</td><td><strong>0</strong></td><td>edge case: all blanks — "blanks + 1" would answer 4</td></tr>
<tr><td><code>"Hello"</code></td><td>0</td><td>1</td><td>no blank at all — "blanks + 1" happens to be right here</td></tr>
<tr><td><code>"  Hello   world  "</code></td><td>2, 10</td><td><strong>2</strong></td><td>leading, inner and trailing runs — "blanks + 1" would answer 9</td></tr>
<tr><td><code>"Lap trinh C co ban"</code></td><td>0, 4, 10, 12, 15</td><td>5</td><td>a clean sentence: single blanks only</td></tr>
</table>
<p class="dap-an">✅ Đáp án — compiled with <code>cc -Wall</code> and run. On the slide's own 20-character sentence the function returns <strong>6</strong> and the increments happen at i = 0, 2, 6, 9, 13, 19 — identical to the six arrows drawn on the slide. The five extra rows are my own edge cases; note especially <code>"  Hello   world  "</code>, where the naive "count blanks and add one" gives 9 instead of 2.</p>
<p class="meo">💡 Learn the shape, not the exercise: <em>"count the positions where a run STARTS"</em> solves a whole family of problems — words, numbers (Exercise 5 is literally the same loop with <code>isdigit</code>), runs of identical characters, groups in a CSV. The only thing that changes is the predicate.</p>`,
        `<p class="y-chinh">🎯 <em>"Giả sử chỉ dùng dấu cách để ngăn cách các từ trong một câu. Hãy viết một hàm đếm số từ trong câu."</em> Bài được đánh dấu <strong>Do Yourself</strong>, và slide đưa sẵn lời giải trong một dòng — cái hộp xanh ở góc dưới bên phải.</p>
<ul>
<li><strong>Tiêu chí, chép nguyên từ slide</strong> — <em>tăng count khi <code>s[i]</code> không phải dấu cách VÀ (<code>i==0</code> hoặc <code>s[i-1]</code> là dấu cách)</em>. Nói bằng lời: hãy đếm các CHỖ BẮT ĐẦU của từ, chứ không đếm từ. Đó đúng là phép kiểm mà <code>nameStr</code> dùng ở slide 39 để quyết định viết hoa ở đâu.</li>
<li><strong>Vì sao đếm dấu cách thì KHÔNG được</strong> — ý nghĩ hiển nhiên là "số từ = số dấu cách + 1". Nó sai với mọi chuỗi trong bảng vết: dấu cách ở đầu, dấu cách ở cuối, hay hai dấu cách liền nhau đều phá nó. Đếm chỗ chuyển tiếp thì miễn nhiễm với cả ba, và đó chính là lý do slide diễn đạt theo cách ấy.</li>
<li><strong>Đọc bảng vết</strong> — câu chiếm chỉ số 0 tới 19 và đọc là <code>T</code>·dấu cách·<code>nu</code>·2 dấu cách·<code>na</code>·dấu cách·<code>nu</code>·2 dấu cách·<code>nong</code>·2 dấu cách·<code>t</code>. Hàng <code>count</code> nhảy 0 &rarr; 1 &rarr; 2 &rarr; 3 &rarr; 4 &rarr; 5 &rarr; 6, và các mũi tên rơi xuống dưới chỉ số 0, 2, 6, 9, 13 và 19.</li>
<li><strong>Tôi đã tái tạo lại đúng bảng vết ấy</strong> — chạy tiêu chí trên <code>"T nu  na nu  nong  t"</code> (20 ký tự) in ra các chỉ số làm count tăng là <strong>0, 2, 6, 9, 13, 19</strong> và kết quả cuối là <strong>6</strong>. Mọi mũi tên trên slide đều có chỗ, điều đó xác nhận đúng chuỗi mà slide đã vẽ.</li>
<li><strong>Nửa <code>i==0</code> của điều kiện</strong> — nó có mặt cho trường hợp câu bắt đầu ngay bằng một chữ cái và không có ký tự nào phía trước để nhìn. Nhờ phép đoản mạch, <code>s[i-1]</code> không bao giờ bị đọc khi <code>i</code> bằng 0, nên không có truy cập ngoài mảng. Đảo hai nửa của dấu <code>||</code> là bạn tạo ra đúng cái lỗi mà <code>rTrim</code> ở slide 37 đang mắc.</li>
<li><strong>Một lượt quét, không tốn thêm bộ nhớ</strong> — cả hàm chỉ là một vòng <code>for</code> với hai phép so mỗi ký tự. Không <code>strtok</code>, không chép gì, và nó KHÔNG sửa chuỗi — điều này quan trọng, vì <code>strtok</code> thì đã phá nát chuỗi rồi (slide 33).</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int countWords(char s[])
{
    int i, count = 0;
    for (i = 0; s[i] != '\\0'; i++)
        if (s[i] != ' ' &amp;&amp; (i == 0 || s[i-1] == ' '))
            count++;
    return count;
}

int main(void)
{
    char s[] = "T nu  na nu  nong  t";   /* dung chuoi tren slide */
    printf("%d\\n", countWords(s));       /* 6 */
    return 0;
}</code></pre>
<table>
<tr><th>Câu</th><th>Chỉ số làm <code>count</code> tăng</th><th>Số từ (đo thật)</th><th>Vì sao đây là cái bẫy</th></tr>
<tr><td><code>"T nu  na nu  nong  t"</code></td><td><strong>0, 2, 6, 9, 13, 19</strong></td><td><strong>6</strong></td><td>đúng bảng vết của slide — mọi mũi tên đều khớp</td></tr>
<tr><td><code>""</code></td><td>không có</td><td><strong>0</strong></td><td>ca biên: vòng lặp không chạy lần nào</td></tr>
<tr><td><code>"   "</code></td><td>không có</td><td><strong>0</strong></td><td>ca biên: toàn dấu cách — cách "dấu cách + 1" sẽ trả lời 4</td></tr>
<tr><td><code>"Hello"</code></td><td>0</td><td>1</td><td>không có dấu cách nào — ở đây "dấu cách + 1" tình cờ đúng</td></tr>
<tr><td><code>"  Hello   world  "</code></td><td>2, 10</td><td><strong>2</strong></td><td>dấu cách đầu, giữa và cuối — cách "dấu cách + 1" sẽ trả lời 9</td></tr>
<tr><td><code>"Lap trinh C co ban"</code></td><td>0, 4, 10, 12, 15</td><td>5</td><td>một câu sạch: chỉ có dấu cách đơn</td></tr>
</table>
<p class="dap-an">✅ Đáp án — đã biên dịch bằng <code>cc -Wall</code> và chạy thật. Trên chính câu 20 ký tự của slide, hàm trả về <strong>6</strong> và các lần tăng xảy ra tại i = 0, 2, 6, 9, 13, 19 — trùng khít sáu mũi tên vẽ trên slide. Năm hàng còn lại là ca biên tôi tự thêm; chú ý nhất là <code>"  Hello   world  "</code>, nơi cách ngây thơ "đếm dấu cách rồi cộng một" cho ra 9 thay vì 2.</p>
<p class="meo">💡 Hãy học lấy HÌNH DẠNG chứ không phải bài tập: <em>"đếm những vị trí mà một dải BẮT ĐẦU"</em> giải được cả một họ bài toán — từ, số (Exercise 5 đúng là vòng lặp ấy đổi sang <code>isdigit</code>), dải ký tự giống nhau, nhóm trong một dòng CSV. Thứ duy nhất thay đổi là cái vị từ.</p>`],

      [41, 'Exercise 5: Counting integers in a string',
        `<p class="y-chinh">🎯 The same exercise wearing different clothes: <em>"Counting integers in a string"</em>, also marked <strong>Do Yourself</strong>. Compare the two blue boxes on slides 40 and 41 — the sentence structure is identical, only the predicate changed from "is not a blank" to "is a digit".</p>
<ul>
<li><strong>The criterion, verbatim from the slide</strong> — <em>increase count when <code>s[i]</code> is a digit AND (<code>i==0</code> or <code>s[i-1]</code> is not a digit)</em>. So an "integer" here means a maximal run of consecutive digits: <code>"123459"</code> counts as ONE integer, not six.</li>
<li><strong>Reading the trace table</strong> — the string occupies indices 0 to 19: <code>1 2 n u a 7 n a 9 d f 1 2 3 4 5 9 P 7</code> and then a blank. The digits are drawn in red. The <code>count</code> row steps 0 &rarr; 1 &rarr; 2 &rarr; 3 &rarr; 4 &rarr; 5, and the arrows land under indices 0, 5, 8, 11 and 18.</li>
<li><strong>I reproduced the trace exactly</strong> — running the criterion on <code>"12nua7na9df123459P7 "</code> (20 characters) prints the increment indices <strong>0, 5, 8, 11, 18</strong> and the final count <strong>5</strong>. Those five integers are <code>12</code>, <code>7</code>, <code>9</code>, <code>123459</code> and <code>7</code>.</li>
<li><strong>Use <code>isdigit()</code>, not a hand-rolled range test</strong> — <code>isdigit((unsigned char)s[i])</code> from <code>&lt;ctype.h&gt;</code> says what it means. The equivalent <code>s[i] &gt;= '0' &amp;&amp; s[i] &lt;= '9'</code> is also correct for ASCII, but note the quotes: comparing against the <em>characters</em> <code>'0'</code> and <code>'9'</code>, not the numbers 0 and 9. Forgetting the quotes is a classic one-character bug.</li>
<li><strong>The negation is where people slip</strong> — the second half is "<code>s[i-1]</code> is <strong>NOT</strong> a digit", so it is <code>!isdigit(s[i-1])</code>. On slide 40 the same slot held "<code>s[i-1]</code> IS a blank". Getting this backwards counts every digit individually and turns <code>123459</code> into six.</li>
<li><strong>What it does not do</strong> — it counts groups of digits, not numbers. A minus sign, a decimal point or a thousands separator is simply not a digit, so <code>"-3.5"</code> counts as two integers (<code>3</code> and <code>5</code>). If an exam asks for signed or decimal numbers, the predicate has to grow; the loop shape does not.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;ctype.h&gt;

int countIntegers(char s[])
{
    int i, count = 0;
    for (i = 0; s[i] != '\\0'; i++)
        if (isdigit((unsigned char)s[i]) &amp;&amp;
            (i == 0 || !isdigit((unsigned char)s[i-1])))
            count++;
    return count;
}

int main(void)
{
    char s[] = "12nua7na9df123459P7 ";   /* dung chuoi tren slide */
    printf("%d\\n", countIntegers(s));    /* 5 */
    return 0;
}</code></pre>
<table>
<tr><th>String</th><th>Indices where <code>count</code> increases</th><th>Integers (measured)</th><th>Which runs were counted</th></tr>
<tr><td><code>"12nua7na9df123459P7 "</code></td><td><strong>0, 5, 8, 11, 18</strong></td><td><strong>5</strong></td><td><code>12</code> · <code>7</code> · <code>9</code> · <code>123459</code> · <code>7</code> — the slide's own trace</td></tr>
<tr><td><code>""</code></td><td>none</td><td><strong>0</strong></td><td>edge case: the loop never runs</td></tr>
<tr><td><code>"abc"</code></td><td>none</td><td><strong>0</strong></td><td>edge case: no digit anywhere — "not found"</td></tr>
<tr><td><code>"2026"</code></td><td>0</td><td><strong>1</strong></td><td>the key case: four digits, ONE integer</td></tr>
<tr><td><code>"a1b2c3"</code></td><td>1, 3, 5</td><td>3</td><td>every digit is isolated, so each starts its own run</td></tr>
<tr><td><code>"PRF192 co 5 slot"</code></td><td>3, 10</td><td>2</td><td>digits glued to letters still count — the predicate ignores letters</td></tr>
</table>
<p class="dap-an">✅ Đáp án — compiled and run: on the slide's own 20-character string the function returns <strong>5</strong>, with increments at i = 0, 5, 8, 11, 18 — the five arrows drawn on the slide, in the same places. The most instructive extra row is <code>"2026"</code>: the answer is 1, not 4, and if your version says 4 you have dropped the <code>!isdigit(s[i-1])</code> half of the condition.</p>
<p class="meo">💡 Write the two exercises side by side in your notes. <code>countWords</code> and <code>countIntegers</code> differ by exactly one predicate and one negation. Seeing that they are the same algorithm is worth more than memorising either of them, and an exam that asks for "count the groups of X" is then already solved.</p>`,
        `<p class="y-chinh">🎯 Vẫn bài ấy nhưng mặc áo khác: <em>"Đếm số nguyên trong một chuỗi"</em>, cũng đánh dấu <strong>Do Yourself</strong>. Hãy so hai hộp xanh ở slide 40 và 41 — cấu trúc câu giống hệt, chỉ có vị từ đổi từ "không phải dấu cách" sang "là chữ số".</p>
<ul>
<li><strong>Tiêu chí, chép nguyên từ slide</strong> — <em>tăng count khi <code>s[i]</code> là chữ số VÀ (<code>i==0</code> hoặc <code>s[i-1]</code> không phải chữ số)</em>. Vậy "một số nguyên" ở đây nghĩa là một dải chữ số liền nhau dài nhất có thể: <code>"123459"</code> tính là MỘT số, không phải sáu.</li>
<li><strong>Đọc bảng vết</strong> — chuỗi chiếm chỉ số 0 tới 19: <code>1 2 n u a 7 n a 9 d f 1 2 3 4 5 9 P 7</code> rồi một dấu cách. Các chữ số được tô đỏ. Hàng <code>count</code> nhảy 0 &rarr; 1 &rarr; 2 &rarr; 3 &rarr; 4 &rarr; 5, và các mũi tên rơi xuống dưới chỉ số 0, 5, 8, 11 và 18.</li>
<li><strong>Tôi đã tái tạo lại đúng bảng vết ấy</strong> — chạy tiêu chí trên <code>"12nua7na9df123459P7 "</code> (20 ký tự) in ra các chỉ số làm count tăng là <strong>0, 5, 8, 11, 18</strong> và kết quả cuối là <strong>5</strong>. Năm số nguyên ấy là <code>12</code>, <code>7</code>, <code>9</code>, <code>123459</code> và <code>7</code>.</li>
<li><strong>Dùng <code>isdigit()</code>, đừng tự viết phép so khoảng</strong> — <code>isdigit((unsigned char)s[i])</code> trong <code>&lt;ctype.h&gt;</code> nói đúng điều nó làm. Cách tương đương <code>s[i] &gt;= '0' &amp;&amp; s[i] &lt;= '9'</code> cũng đúng với ASCII, nhưng để ý dấu nháy: so với KÝ TỰ <code>'0'</code> và <code>'9'</code> chứ không phải số 0 và 9. Quên dấu nháy là lỗi một-ký-tự kinh điển.</li>
<li><strong>Chỗ người ta hay trượt là phép phủ định</strong> — nửa thứ hai là "<code>s[i-1]</code> <strong>KHÔNG</strong> phải chữ số", tức <code>!isdigit(s[i-1])</code>. Ở slide 40 đúng chỗ ấy là "<code>s[i-1]</code> LÀ dấu cách". Viết ngược thì mỗi chữ số được đếm riêng và <code>123459</code> hoá thành sáu.</li>
<li><strong>Nó KHÔNG làm được gì</strong> — nó đếm các dải chữ số, không đếm các con SỐ. Dấu trừ, dấu thập phân hay dấu phân nhóm hàng nghìn đơn giản là không phải chữ số, nên <code>"-3.5"</code> được tính thành hai số nguyên (<code>3</code> và <code>5</code>). Nếu đề thi hỏi số có dấu hoặc số thập phân thì vị từ phải mở rộng; còn hình dạng vòng lặp thì không.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;ctype.h&gt;

int countIntegers(char s[])
{
    int i, count = 0;
    for (i = 0; s[i] != '\\0'; i++)
        if (isdigit((unsigned char)s[i]) &amp;&amp;
            (i == 0 || !isdigit((unsigned char)s[i-1])))
            count++;
    return count;
}

int main(void)
{
    char s[] = "12nua7na9df123459P7 ";   /* dung chuoi tren slide */
    printf("%d\\n", countIntegers(s));    /* 5 */
    return 0;
}</code></pre>
<table>
<tr><th>Chuỗi</th><th>Chỉ số làm <code>count</code> tăng</th><th>Số nguyên (đo thật)</th><th>Những dải nào được đếm</th></tr>
<tr><td><code>"12nua7na9df123459P7 "</code></td><td><strong>0, 5, 8, 11, 18</strong></td><td><strong>5</strong></td><td><code>12</code> · <code>7</code> · <code>9</code> · <code>123459</code> · <code>7</code> — đúng bảng vết của slide</td></tr>
<tr><td><code>""</code></td><td>không có</td><td><strong>0</strong></td><td>ca biên: vòng lặp không chạy lần nào</td></tr>
<tr><td><code>"abc"</code></td><td>không có</td><td><strong>0</strong></td><td>ca biên: không có chữ số nào — "không tìm thấy"</td></tr>
<tr><td><code>"2026"</code></td><td>0</td><td><strong>1</strong></td><td>ca quan trọng nhất: bốn chữ số, MỘT số nguyên</td></tr>
<tr><td><code>"a1b2c3"</code></td><td>1, 3, 5</td><td>3</td><td>mỗi chữ số đứng lẻ nên mỗi cái mở một dải riêng</td></tr>
<tr><td><code>"PRF192 co 5 slot"</code></td><td>3, 10</td><td>2</td><td>chữ số dính liền chữ cái vẫn được đếm — vị từ không quan tâm chữ cái</td></tr>
</table>
<p class="dap-an">✅ Đáp án — đã biên dịch và chạy thật: trên chính chuỗi 20 ký tự của slide, hàm trả về <strong>5</strong>, với các lần tăng tại i = 0, 5, 8, 11, 18 — đúng năm mũi tên vẽ trên slide, đúng chỗ. Hàng bổ sung dạy được nhiều nhất là <code>"2026"</code>: đáp số là 1 chứ không phải 4, và nếu bản của bạn nói 4 thì bạn đã đánh rơi nửa <code>!isdigit(s[i-1])</code> của điều kiện.</p>
<p class="meo">💡 Hãy chép hai bài tập này cạnh nhau vào vở. <code>countWords</code> và <code>countIntegers</code> khác nhau đúng một vị từ và một dấu phủ định. Nhìn ra chúng là CÙNG một thuật toán còn giá trị hơn học thuộc cả hai, và khi đề thi hỏi "đếm số nhóm X" thì bạn đã có sẵn lời giải.</p>`],

      [42, 'Exercise 6: Replace a sub-string by another',
        `<p class="y-chinh">🎯 <em>"Replace all existences of a sub-string (subStr) in a string (source) by another (repStr)."</em> The hardest exercise in the slot, and the slide gives you the entire algorithm as a picture. The reason it is hard: the replacement may be <strong>shorter, equal or longer</strong> than what it replaces, and each case moves the tail a different way.</p>
<ul>
<li><strong>Step 1 — <code>ptr = strstr(source, subStr)</code></strong> — locate the occurrence. The green cells on the slide are the three characters of <code>"coc"</code> found inside <code>"con coc trong hang"</code>. If <code>strstr</code> returns <code>NULL</code> there is nothing left to do.</li>
<li><strong>Step 2 — <code>strcpy(ptr, ptr+subL)</code></strong> — delete the found substring by pulling the tail left by <code>subL</code> characters. The slide's second row shows <code>"coc"</code> gone.</li>
<li><strong>Step 3 — <code>strcpy(temp, ptr)</code> then <code>strcpy(ptr+repL, temp)</code></strong> — open a hole of <code>repL</code> characters by pushing the tail right again. The slide explains why <code>temp</code> is needed in the pink box on the left: <em>"strcpy will copy char-by-char from the left to the right … it will work properly when a sub-string is shifted UP only"</em>, and <em>"A temporary string is used when a sub-string is shifted DOWN."</em> Shifting right with overlapping buffers would copy a byte onto a byte it has not read yet and smear the first character across the tail.</li>
<li><strong>Step 4 — <code>for (i=0; i&lt;repL; i++) *(ptr+i) = repStr[i];</code></strong> — fill the hole with <code>repStr</code>, character by character. Not <code>strcpy</code>: <code>strcpy</code> would write a <code>'\\0'</code> after the last character and cut the tail off.</li>
<li><strong>Step 5 — search again, from <code>ptr + repL</code></strong> — continuing from after the replacement, not from the start. This matters when the replacement itself contains the pattern: replacing <code>"a"</code> with <code>"aa"</code> starting from the beginning would loop forever.</li>
<li><strong>The three length cases, measured</strong> — <code>repL &lt; subL</code> (<code>"coc"</code> &rarr; <code>"bo"</code>): the string shrinks. <code>repL == subL</code> (&rarr; <code>"cuc"</code>): the length is unchanged and no shifting is needed at all. <code>repL &gt; subL</code> (&rarr; <code>"buom"</code>): the string grows, and <strong>the destination array must be big enough</strong> — nothing in this algorithm checks that.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;string.h&gt;

char* replaceAll(char source[], const char subStr[], const char repStr[])
{
    int subL = strlen(subStr);
    int repL = strlen(repStr);
    char temp[1000];
    char *ptr = strstr(source, subStr);
    int i;
    while (ptr != NULL) {
        strcpy(temp, ptr + subL);            /* giu phan duoi vao chuoi tam */
        strcpy(ptr + repL, temp);            /* dat phan duoi vao cho moi   */
        for (i = 0; i &lt; repL; i++)
            *(ptr + i) = repStr[i];          /* ghi chuoi thay the          */
        ptr = strstr(ptr + repL, subStr);    /* tim tiep SAU phan vua thay  */
    }
    return source;
}

int main(void)
{
    char s[1000] = "con coc trong hang";
    printf("%s\\n", replaceAll(s, "coc", "bo"));
    return 0;
}</code></pre>
<table>
<tr><th><code>source</code></th><th><code>subStr</code></th><th><code>repStr</code></th><th>Result (measured)</th><th>Case</th></tr>
<tr><td><code>"con coc trong hang"</code></td><td><code>"coc"</code></td><td><code>"bo"</code></td><td><strong><code>"con bo trong hang"</code></strong> (17)</td><td>the slide's example — shorter, the string shrinks by 1</td></tr>
<tr><td><code>"con coc trong hang"</code></td><td><code>"coc"</code></td><td><code>"buom"</code></td><td><code>"con buom trong hang"</code> (19)</td><td>longer — the tail is pushed right by 1</td></tr>
<tr><td><code>"con coc trong hang"</code></td><td><code>"coc"</code></td><td><code>"cuc"</code></td><td><code>"con cuc trong hang"</code> (18)</td><td>equal lengths — no shifting at all</td></tr>
<tr><td><code>"abcabcabc"</code></td><td><code>"abc"</code></td><td><code>"X"</code></td><td><code>"XXX"</code> (3)</td><td>three occurrences, all replaced</td></tr>
<tr><td><code>"banana"</code></td><td><code>"na"</code></td><td><code>"NA"</code></td><td><code>"baNANA"</code> (6)</td><td>overlapping-looking runs handled correctly</td></tr>
<tr><td><code>"hello"</code></td><td><code>"z"</code></td><td><code>"y"</code></td><td><code>"hello"</code> (5)</td><td>edge case: NOT FOUND — <code>strstr</code> returns <code>NULL</code>, the loop never runs</td></tr>
<tr><td><code>""</code></td><td><code>"a"</code></td><td><code>"b"</code></td><td><code>""</code> (0)</td><td>edge case: empty source</td></tr>
</table>
<p class="dap-an">✅ Đáp án — compiled with <code>cc -Wall</code> and run on all seven rows. The slide's own case, <code>"con coc trong hang"</code> with <code>"coc"</code> &rarr; <code>"bo"</code>, produced <strong><code>"con bo trong hang"</code></strong>, exactly the final green row drawn on the slide. Note the two design decisions that are easy to get wrong and that I verified by running: searching from <code>ptr + repL</code> (not from <code>source</code>) is what keeps <code>"a"</code> &rarr; <code>"aa"</code> from looping forever, and writing <code>repStr</code> with a <code>for</code> loop rather than <code>strcpy</code> is what keeps the tail attached.</p>
<p class="pitfall">⚠️ <code>source</code> must be a writable array with room for the result — <code>char s[1000]</code>, never <code>char *s = "..."</code> (slide 33 measured that crash: SIGBUS). And the growth case has no bound check at all: replacing <code>"a"</code> with a 50-character string in a 20-byte array overflows silently. In real code you would compute the needed size first, or build the answer in a second buffer.</p>`,
        `<p class="y-chinh">🎯 <em>"Thay MỌI lần xuất hiện của một chuỗi con (subStr) trong một chuỗi (source) bằng một chuỗi khác (repStr)."</em> Bài khó nhất của slot, và slide đưa cho bạn trọn thuật toán dưới dạng hình vẽ. Lý do nó khó: chuỗi thay thế có thể <strong>ngắn hơn, bằng, hoặc dài hơn</strong> thứ nó thay, và mỗi trường hợp lại dời phần đuôi theo một kiểu.</p>
<ul>
<li><strong>Bước 1 — <code>ptr = strstr(source, subStr)</code></strong> — định vị chỗ xuất hiện. Các ô xanh lá trên slide là ba ký tự của <code>"coc"</code> tìm thấy trong <code>"con coc trong hang"</code>. Nếu <code>strstr</code> trả <code>NULL</code> thì không còn gì để làm.</li>
<li><strong>Bước 2 — <code>strcpy(ptr, ptr+subL)</code></strong> — xoá chuỗi con vừa tìm được bằng cách kéo phần đuôi sang trái <code>subL</code> ký tự. Hàng thứ hai trên slide cho thấy chữ <code>"coc"</code> đã biến mất.</li>
<li><strong>Bước 3 — <code>strcpy(temp, ptr)</code> rồi <code>strcpy(ptr+repL, temp)</code></strong> — mở một cái lỗ rộng <code>repL</code> ký tự bằng cách đẩy phần đuôi sang phải trở lại. Slide giải thích vì sao cần <code>temp</code> ngay trong hộp hồng bên trái: <em>"strcpy chép từng ký tự từ TRÁI sang PHẢI … nên nó chỉ chạy đúng khi chuỗi con được dịch LÊN"</em>, và <em>"Phải dùng một chuỗi tạm khi chuỗi con bị dịch XUỐNG."</em> Dịch sang phải với hai vùng chồng nhau sẽ ghi một byte đè lên byte chưa kịp đọc, và bôi ký tự đầu ra khắp phần đuôi.</li>
<li><strong>Bước 4 — <code>for (i=0; i&lt;repL; i++) *(ptr+i) = repStr[i];</code></strong> — lấp cái lỗ bằng <code>repStr</code>, từng ký tự một. KHÔNG dùng <code>strcpy</code>: <code>strcpy</code> sẽ ghi một <code>'\\0'</code> sau ký tự cuối và cắt cụt phần đuôi.</li>
<li><strong>Bước 5 — tìm tiếp, từ <code>ptr + repL</code></strong> — đi tiếp từ SAU chỗ vừa thay chứ không quay về đầu. Chi tiết này quan trọng khi chính chuỗi thay thế lại chứa mẫu cần tìm: thay <code>"a"</code> bằng <code>"aa"</code> mà cứ tìm lại từ đầu thì vòng lặp chạy mãi không dừng.</li>
<li><strong>Ba trường hợp độ dài, đo thật</strong> — <code>repL &lt; subL</code> (<code>"coc"</code> &rarr; <code>"bo"</code>): chuỗi ngắn lại. <code>repL == subL</code> (&rarr; <code>"cuc"</code>): độ dài không đổi và không cần dịch gì cả. <code>repL &gt; subL</code> (&rarr; <code>"buom"</code>): chuỗi dài ra, và <strong>mảng đích phải đủ chỗ</strong> — thuật toán này không hề kiểm tra điều đó.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;string.h&gt;

char* replaceAll(char source[], const char subStr[], const char repStr[])
{
    int subL = strlen(subStr);
    int repL = strlen(repStr);
    char temp[1000];
    char *ptr = strstr(source, subStr);
    int i;
    while (ptr != NULL) {
        strcpy(temp, ptr + subL);            /* giu phan duoi vao chuoi tam */
        strcpy(ptr + repL, temp);            /* dat phan duoi vao cho moi   */
        for (i = 0; i &lt; repL; i++)
            *(ptr + i) = repStr[i];          /* ghi chuoi thay the          */
        ptr = strstr(ptr + repL, subStr);    /* tim tiep SAU phan vua thay  */
    }
    return source;
}

int main(void)
{
    char s[1000] = "con coc trong hang";
    printf("%s\\n", replaceAll(s, "coc", "bo"));
    return 0;
}</code></pre>
<table>
<tr><th><code>source</code></th><th><code>subStr</code></th><th><code>repStr</code></th><th>Kết quả (đo thật)</th><th>Trường hợp</th></tr>
<tr><td><code>"con coc trong hang"</code></td><td><code>"coc"</code></td><td><code>"bo"</code></td><td><strong><code>"con bo trong hang"</code></strong> (17)</td><td>ví dụ của slide — ngắn hơn, chuỗi co lại 1 ký tự</td></tr>
<tr><td><code>"con coc trong hang"</code></td><td><code>"coc"</code></td><td><code>"buom"</code></td><td><code>"con buom trong hang"</code> (19)</td><td>dài hơn — phần đuôi bị đẩy sang phải 1 ký tự</td></tr>
<tr><td><code>"con coc trong hang"</code></td><td><code>"coc"</code></td><td><code>"cuc"</code></td><td><code>"con cuc trong hang"</code> (18)</td><td>độ dài bằng nhau — không phải dịch gì cả</td></tr>
<tr><td><code>"abcabcabc"</code></td><td><code>"abc"</code></td><td><code>"X"</code></td><td><code>"XXX"</code> (3)</td><td>ba lần xuất hiện, thay hết</td></tr>
<tr><td><code>"banana"</code></td><td><code>"na"</code></td><td><code>"NA"</code></td><td><code>"baNANA"</code> (6)</td><td>các dải trông như chồng lấn vẫn xử lý đúng</td></tr>
<tr><td><code>"hello"</code></td><td><code>"z"</code></td><td><code>"y"</code></td><td><code>"hello"</code> (5)</td><td>ca biên: KHÔNG TÌM THẤY — <code>strstr</code> trả <code>NULL</code>, vòng lặp không chạy</td></tr>
<tr><td><code>""</code></td><td><code>"a"</code></td><td><code>"b"</code></td><td><code>""</code> (0)</td><td>ca biên: chuỗi nguồn rỗng</td></tr>
</table>
<p class="dap-an">✅ Đáp án — đã biên dịch bằng <code>cc -Wall</code> và chạy thật cả bảy hàng. Đúng ca của slide, <code>"con coc trong hang"</code> với <code>"coc"</code> &rarr; <code>"bo"</code>, cho ra <strong><code>"con bo trong hang"</code></strong>, chính là hàng xanh lá cuối cùng được vẽ trên slide. Chú ý hai quyết định thiết kế rất dễ làm sai mà tôi đã kiểm bằng chạy thật: tìm tiếp từ <code>ptr + repL</code> (chứ không từ <code>source</code>) là thứ giữ cho phép thay <code>"a"</code> &rarr; <code>"aa"</code> khỏi lặp vô tận, còn ghi <code>repStr</code> bằng vòng <code>for</code> thay vì <code>strcpy</code> là thứ giữ cho phần đuôi khỏi bị đứt.</p>
<p class="pitfall">⚠️ <code>source</code> phải là một mảng GHI ĐƯỢC và đủ chỗ cho kết quả — <code>char s[1000]</code>, đừng bao giờ <code>char *s = "..."</code> (slide 33 đã đo cú sập đó: SIGBUS). Và trường hợp chuỗi dài ra thì không có phép kiểm biên nào cả: thay <code>"a"</code> bằng một chuỗi 50 ký tự trong mảng 20 byte là tràn âm thầm. Trong mã thật, bạn sẽ tính trước kích thước cần, hoặc dựng kết quả vào một mảng thứ hai.</p>`],

      [43, '8. Array of Strings',
        `<p class="y-chinh">🎯 <em>"A string array declaration takes the form <code>char identifier[numberOfString][number_byte_per_string];</code>"</em> — a list of names, a menu, a table of cities. Read it as an array whose elements happen to be arrays of characters: it is the two-dimensional array from Slot 13–15, given a string meaning.</p>
<ul>
<li><strong>The two numbers mean different things</strong> — the first is <em>how many strings</em>, the second is <em>how many bytes each string gets</em>. <code>char names[5][31];</code> is five strings of at most 30 characters each. Neither number can change later; this is a fixed-size table.</li>
<li><strong>Where the 31 comes from</strong> — the slide says "each name holds up to 30 characters", and 31 = 30 + 1, the terminator. This is the n+1 rule of slide 4 applied per row. Write 30 and every full-length name will overflow into the next row.</li>
<li><strong>Initialising at declaration</strong> — <code>char names[5][31] = { "Harry", "Jean", "Jessica", "Irene", "Jim" };</code>. Each literal is copied into its own row and padded; the rest of each row is filled with zeros. This is the only moment you may "assign" strings — after this, it is <code>strcpy</code> only (slide 27).</li>
<li><strong>How it sits in memory</strong> — one flat block of 5 × 31 = 155 bytes, rows back to back, no pointers anywhere. I measured it: <code>sizeof(names)</code> is <strong>155</strong> and <code>&amp;names[1] - &amp;names[0]</code> is exactly <strong>31</strong> bytes. That contiguity is what lets you pass the whole table to a function as one argument (slide 45).</li>
<li><strong>Accessing it</strong> — <code>names[i]</code> is a whole string (usable with <code>puts</code>, <code>strcpy</code>, <code>strcmp</code>); <code>names[i][j]</code> is a single character. Getting this right is the difference between <code>%s</code> and <code>%c</code> in your <code>printf</code>.</li>
<li><strong>⚠️ The other spelling — <code>char *names[5]</code> — is NOT the same thing</strong> — that is an array of five <em>pointers</em>, 8 bytes each on a 64-bit machine (I measured <code>sizeof</code> of a 3-element version: 24). Rows can have different lengths and cost no wasted space, but if you initialise them with string literals the text lives in read-only memory: <code>p[0][0] = 'M';</code> crashed for real with <strong>SIGBUS, exit 138</strong>. Use <code>char a[n][m]</code> when you need to modify, <code>char *a[n]</code> for a fixed table of constants.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main(void)
{
    char names[5][31];                    /* 5 chuoi, moi chuoi toi da 30 ky tu */
    char list[5][31] = { "Harry", "Jean", "Jessica", "Irene", "Jim" };
    char *ptrs[3]    = { "Harry", "Jean", "Jessica" };   /* KHAC HAN */

    (void)names;
    printf("sizeof(list) = %zu, sizeof(list[0]) = %zu, so phan tu = %zu\\n",
           sizeof list, sizeof list[0], sizeof list / sizeof list[0]);
    printf("sizeof(ptrs) = %zu, sizeof(ptrs[0]) = %zu\\n", sizeof ptrs, sizeof ptrs[0]);
    printf("list[2] = %s, list[2][0] = %c\\n", list[2], list[2][0]);
    return 0;
}</code></pre>
<table>
<tr><th></th><th><code>char a[3][20]</code></th><th><code>char *a[3]</code></th></tr>
<tr><td>What it really is</td><td>a 2-D array of characters</td><td>an array of 3 pointers</td></tr>
<tr><td>Memory (measured)</td><td>60 bytes, one flat block</td><td><strong>24 bytes</strong> of pointers + the text elsewhere</td></tr>
<tr><td>Row length</td><td>fixed at 19 characters + <code>'\\0'</code></td><td>each row as long as its own literal</td></tr>
<tr><td>Can you modify a row?</td><td><strong>yes</strong> — <code>strcpy(a[1], "new")</code></td><td><strong>no</strong> if it points at a literal — measured SIGBUS</td></tr>
<tr><td>Wasted space</td><td>yes, short names still take 20 bytes</td><td>none</td></tr>
<tr><td>Use it for</td><td>input, sorting, editing (Exercise 7)</td><td>a fixed menu, error messages, month names</td></tr>
</table>
<p class="dap-an">✅ Measured with <code>cc -Wall</code>: for <code>char names[5][31]</code>, <code>sizeof</code> is <strong>155</strong>, each row is exactly <strong>31</strong> bytes wide, and <code>sizeof(names)/sizeof(names[0])</code> gives back the element count 5. For <code>char *p[3] = {"Harry","Jean","Jessica"}</code>, <code>sizeof</code> is 24 and each slot is 8 — the text itself is not in the array at all. Writing <code>p[0][0] = 'M'</code> killed the program with SIGBUS (exit 138).</p>
<p class="meo">💡 The trick <code>sizeof(arr)/sizeof(arr[0])</code> gives the number of rows, but <strong>only inside the function where the array was declared</strong>. Pass it to a function and the array decays to a pointer, so that division silently returns garbage. That is exactly why every prototype on slides 45 and 46 carries an extra <code>int n</code> parameter.</p>`,
        `<p class="y-chinh">🎯 <em>"Một mảng chuỗi được khai báo theo dạng <code>char identifier[numberOfString][number_byte_per_string];</code>"</em> — một danh sách tên, một thực đơn, một bảng tên thành phố. Hãy đọc nó là một mảng mà mỗi phần tử tình cờ lại là một mảng ký tự: đúng là mảng hai chiều của Slot 13–15, được gán thêm ý nghĩa chuỗi.</p>
<ul>
<li><strong>Hai con số mang hai nghĩa khác nhau</strong> — số thứ nhất là <em>có bao nhiêu chuỗi</em>, số thứ hai là <em>mỗi chuỗi được bao nhiêu byte</em>. <code>char names[5][31];</code> là năm chuỗi, mỗi chuỗi nhiều nhất 30 ký tự. Cả hai con số về sau không đổi được; đây là một bảng kích thước cố định.</li>
<li><strong>Con số 31 từ đâu ra</strong> — slide nói "mỗi tên chứa tối đa 30 ký tự", và 31 = 30 + 1, chỗ cho dấu kết thúc. Đây là luật n+1 của slide 4 áp dụng cho từng hàng. Viết 30 thì mọi cái tên dài kịch khung sẽ tràn sang hàng bên cạnh.</li>
<li><strong>Khởi tạo ngay lúc khai báo</strong> — <code>char names[5][31] = { "Harry", "Jean", "Jessica", "Irene", "Jim" };</code>. Mỗi chuỗi hằng được chép vào hàng của nó; phần còn lại của mỗi hàng được lấp bằng số 0. Đây là khoảnh khắc DUY NHẤT bạn được "gán" chuỗi — sau đó chỉ còn <code>strcpy</code> (slide 27).</li>
<li><strong>Nó nằm thế nào trong bộ nhớ</strong> — một khối phẳng 5 × 31 = 155 byte, các hàng nối đuôi nhau, không có con trỏ nào cả. Tôi đo thật: <code>sizeof(names)</code> bằng <strong>155</strong> và <code>&amp;names[1] - &amp;names[0]</code> đúng bằng <strong>31</strong> byte. Chính tính liền mạch ấy cho phép truyền cả bảng vào một hàm bằng một tham số (slide 45).</li>
<li><strong>Truy cập ra sao</strong> — <code>names[i]</code> là một CHUỖI trọn vẹn (dùng được với <code>puts</code>, <code>strcpy</code>, <code>strcmp</code>); còn <code>names[i][j]</code> là một KÝ TỰ. Phân biệt đúng chỗ này là khác biệt giữa <code>%s</code> và <code>%c</code> trong lệnh <code>printf</code> của bạn.</li>
<li><strong>⚠️ Cách viết kia — <code>char *names[5]</code> — KHÔNG phải cùng một thứ</strong> — đó là mảng năm CON TRỎ, mỗi con 8 byte trên máy 64-bit (tôi đo <code>sizeof</code> bản 3 phần tử: 24). Các hàng được phép dài ngắn khác nhau và không tốn chỗ thừa, nhưng nếu khởi tạo bằng chuỗi hằng thì văn bản nằm trong vùng chỉ đọc: <code>p[0][0] = 'M';</code> sập thật với <strong>SIGBUS, exit 138</strong>. Cần SỬA được thì dùng <code>char a[n][m]</code>, còn bảng hằng cố định thì dùng <code>char *a[n]</code>.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main(void)
{
    char names[5][31];                    /* 5 chuoi, moi chuoi toi da 30 ky tu */
    char list[5][31] = { "Harry", "Jean", "Jessica", "Irene", "Jim" };
    char *ptrs[3]    = { "Harry", "Jean", "Jessica" };   /* KHAC HAN */

    (void)names;
    printf("sizeof(list) = %zu, sizeof(list[0]) = %zu, so phan tu = %zu\\n",
           sizeof list, sizeof list[0], sizeof list / sizeof list[0]);
    printf("sizeof(ptrs) = %zu, sizeof(ptrs[0]) = %zu\\n", sizeof ptrs, sizeof ptrs[0]);
    printf("list[2] = %s, list[2][0] = %c\\n", list[2], list[2][0]);
    return 0;
}</code></pre>
<table>
<tr><th></th><th><code>char a[3][20]</code></th><th><code>char *a[3]</code></th></tr>
<tr><td>Thực chất là gì</td><td>một mảng ký tự 2 chiều</td><td>một mảng 3 con trỏ</td></tr>
<tr><td>Bộ nhớ (đo thật)</td><td>60 byte, một khối phẳng</td><td><strong>24 byte</strong> con trỏ + văn bản nằm chỗ khác</td></tr>
<tr><td>Độ dài mỗi hàng</td><td>cố định 19 ký tự + <code>'\\0'</code></td><td>mỗi hàng dài đúng bằng chuỗi hằng của nó</td></tr>
<tr><td>Sửa được một hàng không?</td><td><strong>ĐƯỢC</strong> — <code>strcpy(a[1], "new")</code></td><td><strong>KHÔNG</strong> nếu nó trỏ vào chuỗi hằng — đo được SIGBUS</td></tr>
<tr><td>Chỗ thừa</td><td>có, tên ngắn vẫn chiếm đủ 20 byte</td><td>không có</td></tr>
<tr><td>Dùng cho</td><td>nhập liệu, sắp xếp, chỉnh sửa (Exercise 7)</td><td>thực đơn cố định, câu báo lỗi, tên tháng</td></tr>
</table>
<p class="dap-an">✅ Đo bằng <code>cc -Wall</code>: với <code>char names[5][31]</code>, <code>sizeof</code> bằng <strong>155</strong>, mỗi hàng rộng đúng <strong>31</strong> byte, và <code>sizeof(names)/sizeof(names[0])</code> trả về đúng số phần tử 5. Với <code>char *p[3] = {"Harry","Jean","Jessica"}</code>, <code>sizeof</code> bằng 24 và mỗi ô 8 byte — bản thân văn bản không hề nằm trong mảng. Ghi <code>p[0][0] = 'M'</code> giết chương trình với SIGBUS (exit 138).</p>
<p class="meo">💡 Mẹo <code>sizeof(arr)/sizeof(arr[0])</code> cho ra số hàng, nhưng <strong>chỉ bên trong hàm nơi mảng được khai báo</strong>. Truyền nó vào một hàm thì mảng suy biến thành con trỏ, và phép chia ấy âm thầm trả về rác. Đó đúng là lý do mọi prototype ở slide 45 và 46 đều mang thêm một tham số <code>int n</code>.</p>`],

      [44, 'Array of Strings (cont.): Example',
        `<p class="y-chinh">🎯 The declaration of slide 43 turned into a running program: declare five names, initialise them in place, and print them with a <code>for</code> loop. Small, but it settles three questions at once — how to initialise, how to index, and how to print.</p>
<ul>
<li><strong><code>#define MAXN 5</code></strong> — the count appears in the declaration and in the loop, so it becomes a named constant. Change 5 to 8 in one place and both follow. This is the habit from Slot 02-04 and it is what stops a loop from running past the end of the table.</li>
<li><strong>The declaration and the comment</strong> — <em>"Declare a string array of 5 elements, with each element having a maximum of 30 characters"</em>, written as <code>char names[MAXN][31]</code>. The 31 is the 30 + terminator again, and the blue arrow on the slide labels the brace list as <strong>Initialization</strong>.</li>
<li><strong>Five literals, five rows</strong> — <code>{"Nguyen Tien Linh", "Pham Ngoc Tho", "Nguyen Hoang Duc", "Pham Minh Chau", "Vu Tuan Hai"}</code>. The longest is 16 characters, comfortably inside 30. Each row is padded with zeros, so every row is a valid string from the first statement onward — which is why <code>strcat</code> would be safe here (slide 29) while it would not be on an uninitialised array.</li>
<li><strong>The loop</strong> — <code>for(i=0; i&lt;MAXN; i++) printf("%s\\n", names[i]);</code>. Note <code>%s</code> with <code>names[i]</code>: one index gives you a whole string. Using <code>%c</code> here, or <code>names[i][0]</code>, would print one letter per line instead.</li>
<li><strong>Why <code>names[i]</code> works as a <code>%s</code> argument</strong> — it is the address of row <code>i</code>, and <code>%s</code> wants exactly that: an address, from which it prints until <code>'\\0'</code> (slide 10). No copying happens.</li>
<li><strong>The last two lines</strong> — <code>system("pause");</code> is Windows-only; on Linux or macOS it needs <code>&lt;stdlib.h&gt;</code> and does nothing useful, so drop it. Its output <em>"Press any key to continue . . ."</em> is what you see at the bottom of the slide's console box, and it is not part of your program's real output.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;string.h&gt;
#define MAXN 5

int main(){
    /* Declare a string array of 5 elements, with each element
       having a maximum of 30 characters. */
    char names[MAXN][31] = {"Nguyen Tien Linh", "Pham Ngoc Tho",
                            "Nguyen Hoang Duc", "Pham Minh Chau", "Vu Tuan Hai"};

    int i;
    printf("List of names:\\n");
    for(i = 0; i &lt; MAXN; i++){
        printf("%s\\n", names[i]);
    }
    /* system("pause"); — Windows only */
    return 0;
}</code></pre>
<table>
<tr><th><code>i</code></th><th><code>names[i]</code> (a whole string)</th><th><code>strlen</code></th><th>Bytes used of 31</th><th><code>names[i][0]</code> (one character)</th></tr>
<tr><td>0</td><td><code>Nguyen Tien Linh</code></td><td>16</td><td>17</td><td><code>N</code></td></tr>
<tr><td>1</td><td><code>Pham Ngoc Tho</code></td><td>13</td><td>14</td><td><code>P</code></td></tr>
<tr><td>2</td><td><code>Nguyen Hoang Duc</code></td><td>16</td><td>17</td><td><code>N</code></td></tr>
<tr><td>3</td><td><code>Pham Minh Chau</code></td><td>14</td><td>15</td><td><code>P</code></td></tr>
<tr><td>4</td><td><code>Vu Tuan Hai</code></td><td>11</td><td>12</td><td><code>V</code></td></tr>
</table>
<p class="dap-an">✅ Compiled with <code>cc -Wall</code> and run: <code>List of names:</code> followed by the five names in declaration order, identical to the slide's console box (minus the Windows <em>"Press any key"</em> line). Measured on the same program: <code>sizeof(names)</code> is <strong>155</strong> bytes, and the addresses of <code>names[0]</code> and <code>names[1]</code> are exactly <strong>31</strong> apart — the rows really are one flat block, exactly as slide 43 claimed.</p>
<p class="meo">💡 Notice how much of the 155 bytes is wasted: the five names use 75 bytes of content, so half the table is padding. That is the price of the fixed row width, and it is the trade-off against <code>char *names[5]</code> from slide 43. For five names it does not matter; for fifty thousand it does.</p>`,
        `<p class="y-chinh">🎯 Khai báo của slide 43 biến thành một chương trình chạy được: khai năm cái tên, khởi tạo ngay tại chỗ, rồi in ra bằng vòng <code>for</code>. Nhỏ thôi, nhưng nó giải quyết cùng lúc ba câu hỏi — khởi tạo thế nào, đánh chỉ số thế nào, và in ra thế nào.</p>
<ul>
<li><strong><code>#define MAXN 5</code></strong> — con số đếm xuất hiện cả ở khai báo lẫn ở vòng lặp, nên nó được đặt tên thành hằng. Đổi 5 thành 8 ở một chỗ thì cả hai chỗ theo sau. Đây là thói quen từ Slot 02-04, và nó là thứ ngăn vòng lặp chạy vượt khỏi bảng.</li>
<li><strong>Khai báo và lời chú thích</strong> — <em>"Khai một mảng chuỗi 5 phần tử, mỗi phần tử tối đa 30 ký tự"</em>, viết thành <code>char names[MAXN][31]</code>. Con số 31 lại là 30 + dấu kết thúc, và mũi tên xanh trên slide gắn nhãn cho danh sách trong ngoặc nhọn là <strong>Initialization</strong>.</li>
<li><strong>Năm chuỗi hằng, năm hàng</strong> — <code>{"Nguyen Tien Linh", "Pham Ngoc Tho", "Nguyen Hoang Duc", "Pham Minh Chau", "Vu Tuan Hai"}</code>. Chuỗi dài nhất 16 ký tự, thoải mái nằm trong 30. Mỗi hàng được lấp thêm số 0, nên mọi hàng đều là chuỗi hợp lệ ngay từ câu lệnh đầu tiên — và vì thế dùng <code>strcat</code> ở đây là an toàn (slide 29) trong khi với mảng chưa khởi tạo thì không.</li>
<li><strong>Vòng lặp</strong> — <code>for(i=0; i&lt;MAXN; i++) printf("%s\\n", names[i]);</code>. Để ý <code>%s</code> đi với <code>names[i]</code>: MỘT chỉ số cho bạn nguyên một chuỗi. Dùng <code>%c</code> ở đây, hay viết <code>names[i][0]</code>, thì mỗi dòng chỉ in ra một chữ cái.</li>
<li><strong>Vì sao <code>names[i]</code> làm được tham số cho <code>%s</code></strong> — nó là ĐỊA CHỈ của hàng <code>i</code>, và <code>%s</code> cần đúng thứ ấy: một địa chỉ, rồi in từ đó cho tới khi gặp <code>'\\0'</code> (slide 10). Không hề có phép chép nào.</li>
<li><strong>Hai dòng cuối</strong> — <code>system("pause");</code> chỉ có trên Windows; trên Linux hay macOS nó cần <code>&lt;stdlib.h&gt;</code> và chẳng làm gì có ích, nên hãy bỏ đi. Dòng <em>"Press any key to continue . . ."</em> mà nó in ra chính là dòng bạn thấy ở đáy khung console trên slide, và nó KHÔNG thuộc kết quả thật của chương trình bạn.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;string.h&gt;
#define MAXN 5

int main(){
    /* Declare a string array of 5 elements, with each element
       having a maximum of 30 characters. */
    char names[MAXN][31] = {"Nguyen Tien Linh", "Pham Ngoc Tho",
                            "Nguyen Hoang Duc", "Pham Minh Chau", "Vu Tuan Hai"};

    int i;
    printf("List of names:\\n");
    for(i = 0; i &lt; MAXN; i++){
        printf("%s\\n", names[i]);
    }
    /* system("pause"); — chi co tren Windows */
    return 0;
}</code></pre>
<table>
<tr><th><code>i</code></th><th><code>names[i]</code> (cả một chuỗi)</th><th><code>strlen</code></th><th>Dùng mấy byte trong 31</th><th><code>names[i][0]</code> (một ký tự)</th></tr>
<tr><td>0</td><td><code>Nguyen Tien Linh</code></td><td>16</td><td>17</td><td><code>N</code></td></tr>
<tr><td>1</td><td><code>Pham Ngoc Tho</code></td><td>13</td><td>14</td><td><code>P</code></td></tr>
<tr><td>2</td><td><code>Nguyen Hoang Duc</code></td><td>16</td><td>17</td><td><code>N</code></td></tr>
<tr><td>3</td><td><code>Pham Minh Chau</code></td><td>14</td><td>15</td><td><code>P</code></td></tr>
<tr><td>4</td><td><code>Vu Tuan Hai</code></td><td>11</td><td>12</td><td><code>V</code></td></tr>
</table>
<p class="dap-an">✅ Đã biên dịch bằng <code>cc -Wall</code> và chạy thật: in ra <code>List of names:</code> rồi năm cái tên theo đúng thứ tự khai báo, y hệt khung console trên slide (trừ dòng <em>"Press any key"</em> của Windows). Đo trên cùng chương trình ấy: <code>sizeof(names)</code> bằng <strong>155</strong> byte, và địa chỉ của <code>names[0]</code> với <code>names[1]</code> cách nhau đúng <strong>31</strong> — các hàng đúng là một khối phẳng, chính xác như slide 43 đã khẳng định.</p>
<p class="meo">💡 Để ý xem trong 155 byte ấy bao nhiêu là bỏ phí: năm cái tên dùng hết 75 byte nội dung, nghĩa là một nửa cái bảng là chỗ đệm. Đó là cái giá của bề rộng hàng cố định, và là phần đánh đổi so với <code>char *names[5]</code> ở slide 43. Với năm cái tên thì không sao; với năm mươi nghìn thì có.</p>`],

      [45, 'Array of Strings: Parameter in a function',
        `<p class="y-chinh">🎯 The last piece: how to hand a whole table of strings to a function. The blue label on the slide says it — <strong>"Parameter is a Array of String"</strong> — and the prototype is <code>void listOfNames(char list[][31], int n)</code>.</p>
<ul>
<li><strong>Why the FIRST bracket may be empty and the SECOND may not</strong> — this is the one rule of the slide. When an array is passed, it decays to a pointer to its first element; for a 2-D array that first element is a <em>whole row</em>, so the compiler must know how wide a row is to compute <code>list[i]</code>. The row width 31 is therefore compulsory. The number of rows is not, because the pointer arithmetic never needs it.</li>
<li><strong>Which is why <code>int n</code> is there</strong> — with the first dimension gone, the function has no way to know how many rows exist. <code>sizeof</code> inside the function would measure a pointer, not the table (slide 43). Passing the count explicitly is not optional book-keeping; it is the only information available.</li>
<li><strong>It is passed by reference in effect</strong> — no copy is made. The function receives an address, so writing <code>strcpy(list[0], "X")</code> inside it changes the caller's array. That is a feature here: it is how <code>inputNames</code> and <code>sortNamesByAsc</code> in Exercise 7 will do their work, and it is the pointer lesson from Slot 10 arriving at strings.</li>
<li><strong>The body</strong> — <code>for(i=0; i&lt;n; i++) puts(list[i]);</code>. <code>puts</code> prints the string and adds a newline by itself (slide 12), so it is shorter than <code>printf("%s\\n", ...)</code> and does the same thing here.</li>
<li><strong>The call</strong> — <code>listOfNames(names, MAXN);</code>. Just the array name, no <code>&amp;</code> and no brackets — the name already IS the address.</li>
<li><strong>⚠️ The slide's screenshot does not match its own code</strong> — line 14 declares <code>names[1]</code> as <code>"Pham Ngoc Tho"</code>, but the console box on the right shows <code>Hoang Xuan Son</code> as the second name. I compiled and ran the code exactly as printed and got <strong>Pham Ngoc Tho</strong>, matching slide 44. The screenshot was clearly taken from a different edit of the program. Trust the code, not the picture.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;string.h&gt;
#define MAXN 5

void listOfNames(char list[][31], int n){    /* [] trong, [31] BAT BUOC */
    int i;
    for(i = 0; i &lt; n; i++){
        puts(list[i]);
    }
}

int main(){
    char names[MAXN][31] = {"Nguyen Tien Linh", "Pham Ngoc Tho",
                            "Nguyen Hoang Duc", "Pham Minh Chau", "Vu Tuan Hai"};
    printf("List of names:\\n");
    listOfNames(names, MAXN);       /* chi ten mang, khong co &amp; */
    return 0;
}</code></pre>
<table>
<tr><th>Parameter written as</th><th>Compiles?</th><th>Why</th></tr>
<tr><td><code>char list[][31]</code></td><td><strong>yes</strong></td><td>the slide's form — row width known, row count supplied by <code>n</code></td></tr>
<tr><td><code>char list[5][31]</code></td><td>yes</td><td>the 5 is accepted but IGNORED; it does not protect you from passing 3 rows</td></tr>
<tr><td><code>char (*list)[31]</code></td><td>yes</td><td>exactly what the two forms above mean: pointer to an array of 31 chars</td></tr>
<tr><td><code>char list[][]</code></td><td><strong>no</strong></td><td>the row width is missing — <code>list[i]</code> cannot be computed</td></tr>
<tr><td><code>char **list</code></td><td>compiles, <strong>crashes</strong></td><td>a different type entirely — this is <code>char *a[]</code>, not <code>char a[][31]</code></td></tr>
</table>
<p class="dap-an">✅ Đáp án — compiled with <code>cc -Wall</code> and run: the program prints <code>List of names:</code> then <code>Nguyen Tien Linh</code> · <strong><code>Pham Ngoc Tho</code></strong> · <code>Nguyen Hoang Duc</code> · <code>Pham Minh Chau</code> · <code>Vu Tuan Hai</code>. The slide's console shows <em>Hoang Xuan Son</em> in second place, which its own line 14 does not produce. I am reporting the mismatch rather than copying the picture; the code on the slide is correct and the screenshot is stale.</p>
<p class="pitfall">⚠️ The last row of the table is the one that bites in the exam: <code>char **list</code> looks like a reasonable spelling of "array of strings" and it compiles. It is not the same type. <code>char a[5][31]</code> is one flat block; <code>char **</code> expects an array of pointers to read. Passing one where the other is expected gives a program that builds cleanly and then reads a name as if it were an address.</p>`,
        `<p class="y-chinh">🎯 Mảnh ghép cuối: làm sao đưa cả một bảng chuỗi vào một hàm. Nhãn xanh trên slide nói thẳng — <strong>"Parameter is a Array of String"</strong> — và prototype là <code>void listOfNames(char list[][31], int n)</code>.</p>
<ul>
<li><strong>Vì sao cặp ngoặc THỨ NHẤT được để trống còn cặp THỨ HAI thì không</strong> — đây là luật duy nhất của slide. Khi truyền một mảng, nó suy biến thành con trỏ tới phần tử đầu; với mảng 2 chiều thì phần tử đầu là <em>trọn một hàng</em>, nên trình biên dịch buộc phải biết một hàng rộng bao nhiêu mới tính được <code>list[i]</code>. Vậy nên bề rộng hàng 31 là bắt buộc. Còn số hàng thì không, vì số học con trỏ chẳng cần tới nó.</li>
<li><strong>Và đó chính là lý do có <code>int n</code></strong> — khi chiều thứ nhất biến mất, hàm không còn cách nào biết có bao nhiêu hàng. <code>sizeof</code> bên trong hàm sẽ đo một con trỏ chứ không đo cái bảng (slide 43). Truyền số lượng vào không phải thủ tục giấy tờ tuỳ chọn; đó là nguồn thông tin DUY NHẤT.</li>
<li><strong>Trên thực tế nó được truyền theo tham chiếu</strong> — không có bản sao nào. Hàm nhận một địa chỉ, nên viết <code>strcpy(list[0], "X")</code> bên trong là sửa thẳng mảng của hàm gọi. Ở đây đó là tính năng: <code>inputNames</code> và <code>sortNamesByAsc</code> trong Exercise 7 sẽ làm việc bằng đúng cơ chế này, và đó là bài học con trỏ của Slot 10 cập bến chuỗi.</li>
<li><strong>Thân hàm</strong> — <code>for(i=0; i&lt;n; i++) puts(list[i]);</code>. <code>puts</code> in chuỗi rồi tự thêm ký tự xuống dòng (slide 12), nên nó ngắn hơn <code>printf("%s\\n", ...)</code> và ở đây làm đúng cùng một việc.</li>
<li><strong>Lời gọi</strong> — <code>listOfNames(names, MAXN);</code>. Chỉ có tên mảng, không dấu <code>&amp;</code> và không ngoặc vuông — bản thân cái tên ĐÃ là địa chỉ.</li>
<li><strong>⚠️ Ảnh chụp trên slide không khớp với chính mã của nó</strong> — dòng 14 khai <code>names[1]</code> là <code>"Pham Ngoc Tho"</code>, nhưng khung console bên phải lại hiện <code>Hoang Xuan Son</code> ở vị trí thứ hai. Tôi biên dịch và chạy đúng đoạn mã in trên slide và nhận được <strong>Pham Ngoc Tho</strong>, khớp với slide 44. Ảnh chụp rõ ràng lấy từ một bản sửa khác của chương trình. Hãy tin đoạn MÃ, đừng tin bức ảnh.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;string.h&gt;
#define MAXN 5

void listOfNames(char list[][31], int n){    /* [] trong, [31] BAT BUOC */
    int i;
    for(i = 0; i &lt; n; i++){
        puts(list[i]);
    }
}

int main(){
    char names[MAXN][31] = {"Nguyen Tien Linh", "Pham Ngoc Tho",
                            "Nguyen Hoang Duc", "Pham Minh Chau", "Vu Tuan Hai"};
    printf("List of names:\\n");
    listOfNames(names, MAXN);       /* chi ten mang, khong co &amp; */
    return 0;
}</code></pre>
<table>
<tr><th>Tham số viết thành</th><th>Dịch được?</th><th>Vì sao</th></tr>
<tr><td><code>char list[][31]</code></td><td><strong>được</strong></td><td>dạng của slide — biết bề rộng hàng, số hàng do <code>n</code> cung cấp</td></tr>
<tr><td><code>char list[5][31]</code></td><td>được</td><td>số 5 được chấp nhận nhưng BỊ BỎ QUA; nó không ngăn bạn truyền vào 3 hàng</td></tr>
<tr><td><code>char (*list)[31]</code></td><td>được</td><td>đúng nghĩa của hai dạng trên: con trỏ tới một mảng 31 ký tự</td></tr>
<tr><td><code>char list[][]</code></td><td><strong>KHÔNG</strong></td><td>thiếu bề rộng hàng — không tính nổi <code>list[i]</code></td></tr>
<tr><td><code>char **list</code></td><td>dịch được, <strong>chạy là sập</strong></td><td>một kiểu hoàn toàn khác — đó là <code>char *a[]</code>, không phải <code>char a[][31]</code></td></tr>
</table>
<p class="dap-an">✅ Đáp án — đã biên dịch bằng <code>cc -Wall</code> và chạy thật: chương trình in <code>List of names:</code> rồi <code>Nguyen Tien Linh</code> · <strong><code>Pham Ngoc Tho</code></strong> · <code>Nguyen Hoang Duc</code> · <code>Pham Minh Chau</code> · <code>Vu Tuan Hai</code>. Console trên slide hiện <em>Hoang Xuan Son</em> ở vị trí thứ hai, mà chính dòng 14 của nó không sinh ra được. Tôi báo lại chỗ vênh chứ không chép bức ảnh; mã trên slide thì đúng, còn ảnh chụp thì cũ.</p>
<p class="pitfall">⚠️ Hàng cuối của bảng mới là chỗ cắn người trong phòng thi: <code>char **list</code> trông như một cách viết hợp lý của "mảng chuỗi" và nó dịch được. Nó KHÔNG cùng kiểu. <code>char a[5][31]</code> là một khối phẳng; còn <code>char **</code> thì chờ đọc một mảng con trỏ. Truyền nhầm cái này cho cái kia thì bạn có một chương trình dựng sạch sẽ rồi đọc một cái TÊN như thể nó là một địa chỉ.</p>`],

      [46, 'Exercise 7: Input, print and sort 10 names',
        `<p class="y-chinh">🎯 <em>"Write a C program that will accept 10 names, print out the list, sort the list using ascending order, print out the result."</em> This is the capstone of the whole slot: it uses arrays of strings, functions taking arrays of strings, <code>strcmp</code> for ordering and <code>strcpy</code> for swapping. The slide gives you the <strong>code design prototype</strong>, not the answer.</p>
<ul>
<li><strong>The three prototypes on the slide</strong> — <code>void inputNames(char names[][31], int n);</code> · <code>void printNames(char names[][31], int n);</code> · <code>void sortNamesByAsc(char names[][31], int n);</code>. All three follow slide 45 exactly: empty first bracket, compulsory 31, explicit <code>n</code>.</li>
<li><strong>The <code>main</code> on the right is the whole plan</strong> — <code>char names[10][31]; int n = 10;</code> then input, print "before sort", sort, print "after sort". Four calls, and each function does one job. This is the modular design of Slot 08-09 applied to a real task.</li>
<li><strong>Why <code>void</code> and not a return value</strong> — the functions do not need to return anything, because the array is passed by address and they edit it in place. <code>inputNames</code> fills the caller's array; <code>sortNamesByAsc</code> rearranges it. That is the whole reason slide 45 came first.</li>
<li><strong>Sorting strings means <code>strcmp</code>, swapping means <code>strcpy</code></strong> — you cannot write <code>if (names[i] &gt; names[j])</code> (that compares addresses) and you cannot write <code>temp = names[i]</code> (slide 24: no assignment for arrays). The correct pair is <code>if (strcmp(names[i], names[j]) &gt; 0)</code> and three <code>strcpy</code> calls through a <code>char temp[31]</code>.</li>
<li><strong>Ascending order means <code>&gt; 0</code></strong> — <code>strcmp(a, b) &gt; 0</code> says a comes after b, so they are in the wrong order and must be swapped. Flip it to <code>&lt; 0</code> and you get descending. And remember slide 28: test the sign, never <code>== 1</code>.</li>
<li><strong>Reading names with blanks</strong> — <code>scanf("%s", ...)</code> would stop at the first blank (slide 14), so "Nguyen Tien Linh" would arrive as three entries. Use <code>scanf("%30[^\\n]", names[i])</code> (slide 17) with a width limit, and clear the rest of the line afterwards. The sample data on slide 47 is single-word names, which conveniently hides this trap — do not let it hide from you.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
#define MAXN 10

void inputNames(char names[][31], int n);
void printNames(char names[][31], int n);
void sortNamesByAsc(char names[][31], int n);

void inputNames(char names[][31], int n) {
    int i;
    printf("Enter %d names (each up to 30 characters):\\n", n);
    for (i = 0; i &lt; n; i++) {
        printf("Name %d: ", i + 1);
        scanf("%30[^\\n]", names[i]);
        while (getchar() != '\\n');            /* bo phan con lai cua dong */
    }
}
void printNames(char names[][31], int n) {
    int i;
    for (i = 0; i &lt; n; i++) puts(names[i]);
}
void sortNamesByAsc(char names[][31], int n) {
    int i, j;
    char temp[31];
    for (i = 0; i &lt; n - 1; i++)
        for (j = i + 1; j &lt; n; j++)
            if (strcmp(names[i], names[j]) &gt; 0) {   /* tang dan */
                strcpy(temp, names[i]);
                strcpy(names[i], names[j]);
                strcpy(names[j], temp);
            }
}
int main(void) {
    char names[MAXN][31];
    int n = MAXN;
    inputNames(names, n);
    printf("\\nList of names before sort:\\n");
    printNames(names, n);
    sortNamesByAsc(names, n);
    printf("\\nList of names after sort:\\n");
    printNames(names, n);
    return 0;
}</code></pre>
<p class="dap-an">✅ Đáp án — compiled with <code>cc -Wall</code> and run with the exact ten names from slide 47 (Hoang, Tuan, Binh, Chau, Anh, Duc, Nam, Hong, Nghia, Linh). The program printed them back unsorted in the order entered, then sorted: <strong>Anh · Binh · Chau · Duc · Hoang · Hong · Linh · Nam · Nghia · Tuan</strong> — character for character the slide's third console box. Measured on the same run: <code>sizeof(names)</code> = <strong>310</strong> bytes and <code>sizeof(names[0])</code> = <strong>31</strong>, i.e. 10 rows of 31.</p>
<p class="meo">💡 The sort above is selection/exchange sort — two nested loops, no extra array. It is O(n²), which for 10 names is 45 comparisons and entirely fine. The important part is not the algorithm but the two substitutions: <strong>comparison becomes <code>strcmp</code>, assignment becomes <code>strcpy</code></strong>. Make those two swaps and any sort you learned for <code>int</code> arrays works on names.</p>`,
        `<p class="y-chinh">🎯 <em>"Viết một chương trình C nhận vào 10 cái tên, in danh sách ra, sắp xếp tăng dần, rồi in kết quả."</em> Đây là bài tổng kết của cả slot: nó dùng mảng chuỗi, hàm nhận mảng chuỗi, <code>strcmp</code> để so thứ tự và <code>strcpy</code> để hoán đổi. Slide đưa cho bạn <strong>khung thiết kế mã</strong>, chứ không đưa lời giải.</p>
<ul>
<li><strong>Ba prototype trên slide</strong> — <code>void inputNames(char names[][31], int n);</code> · <code>void printNames(char names[][31], int n);</code> · <code>void sortNamesByAsc(char names[][31], int n);</code>. Cả ba theo đúng slide 45: cặp ngoặc đầu để trống, số 31 bắt buộc, và <code>n</code> truyền tường minh.</li>
<li><strong>Hàm <code>main</code> bên phải chính là toàn bộ kế hoạch</strong> — <code>char names[10][31]; int n = 10;</code> rồi nhập, in "trước khi sắp", sắp xếp, in "sau khi sắp". Bốn lời gọi, mỗi hàm làm đúng một việc. Đây là lối thiết kế module của Slot 08-09 áp vào một bài toán thật.</li>
<li><strong>Vì sao <code>void</code> mà không trả về gì</strong> — các hàm không cần trả về gì cả, vì mảng được truyền theo địa chỉ và chúng sửa thẳng tại chỗ. <code>inputNames</code> điền vào mảng của hàm gọi; <code>sortNamesByAsc</code> xếp lại chính mảng ấy. Đó là toàn bộ lý do slide 45 phải đứng trước.</li>
<li><strong>Sắp xếp chuỗi nghĩa là <code>strcmp</code>, hoán đổi nghĩa là <code>strcpy</code></strong> — bạn KHÔNG viết được <code>if (names[i] &gt; names[j])</code> (cái đó so ĐỊA CHỈ) và cũng không viết được <code>temp = names[i]</code> (slide 24: mảng không có phép gán). Cặp đúng là <code>if (strcmp(names[i], names[j]) &gt; 0)</code> và ba lời gọi <code>strcpy</code> đi qua một <code>char temp[31]</code>.</li>
<li><strong>Tăng dần nghĩa là <code>&gt; 0</code></strong> — <code>strcmp(a, b) &gt; 0</code> nói a đứng SAU b, tức chúng đang sai thứ tự và phải đổi chỗ. Lật thành <code>&lt; 0</code> thì được thứ tự giảm dần. Và nhớ slide 28: kiểm DẤU, đừng bao giờ <code>== 1</code>.</li>
<li><strong>Nhập tên có dấu cách</strong> — <code>scanf("%s", ...)</code> sẽ dừng ở dấu cách đầu tiên (slide 14), nên "Nguyen Tien Linh" sẽ vào thành ba mục. Hãy dùng <code>scanf("%30[^\\n]", names[i])</code> (slide 17) có giới hạn bề rộng, rồi xoá nốt phần còn lại của dòng. Dữ liệu mẫu ở slide 47 toàn tên một chữ, vô tình che mất cái bẫy này — đừng để nó che mắt bạn.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
#define MAXN 10

void inputNames(char names[][31], int n);
void printNames(char names[][31], int n);
void sortNamesByAsc(char names[][31], int n);

void inputNames(char names[][31], int n) {
    int i;
    printf("Enter %d names (each up to 30 characters):\\n", n);
    for (i = 0; i &lt; n; i++) {
        printf("Name %d: ", i + 1);
        scanf("%30[^\\n]", names[i]);
        while (getchar() != '\\n');            /* bo phan con lai cua dong */
    }
}
void printNames(char names[][31], int n) {
    int i;
    for (i = 0; i &lt; n; i++) puts(names[i]);
}
void sortNamesByAsc(char names[][31], int n) {
    int i, j;
    char temp[31];
    for (i = 0; i &lt; n - 1; i++)
        for (j = i + 1; j &lt; n; j++)
            if (strcmp(names[i], names[j]) &gt; 0) {   /* tang dan */
                strcpy(temp, names[i]);
                strcpy(names[i], names[j]);
                strcpy(names[j], temp);
            }
}
int main(void) {
    char names[MAXN][31];
    int n = MAXN;
    inputNames(names, n);
    printf("\\nList of names before sort:\\n");
    printNames(names, n);
    sortNamesByAsc(names, n);
    printf("\\nList of names after sort:\\n");
    printNames(names, n);
    return 0;
}</code></pre>
<p class="dap-an">✅ Đáp án — đã biên dịch bằng <code>cc -Wall</code> và chạy thật với đúng mười cái tên của slide 47 (Hoang, Tuan, Binh, Chau, Anh, Duc, Nam, Hong, Nghia, Linh). Chương trình in lại chúng theo thứ tự nhập, rồi sau khi sắp: <strong>Anh · Binh · Chau · Duc · Hoang · Hong · Linh · Nam · Nghia · Tuan</strong> — giống từng ký tự khung console thứ ba trên slide. Đo trên cùng lần chạy: <code>sizeof(names)</code> = <strong>310</strong> byte và <code>sizeof(names[0])</code> = <strong>31</strong>, tức 10 hàng mỗi hàng 31.</p>
<p class="meo">💡 Phép sắp ở trên là sắp xếp chọn/đổi chỗ — hai vòng lặp lồng nhau, không cần mảng phụ. Nó là O(n²), với 10 cái tên thì bằng 45 phép so, hoàn toàn ổn. Điều quan trọng không phải thuật toán mà là hai phép thay thế: <strong>so sánh biến thành <code>strcmp</code>, gán biến thành <code>strcpy</code></strong>. Làm đúng hai chỗ đó thì mọi thuật toán sắp xếp bạn từng học cho mảng <code>int</code> đều chạy được trên danh sách tên.</p>`],

      [47, 'Exercise 7: Sample output',
        `<p class="y-chinh">🎯 The expected behaviour of Exercise 7, drawn as three console screenshots in the order they appear: the input prompts, the list before sorting, and the list after sorting. This slide is your acceptance test — if your program produces these three boxes, it is correct.</p>
<ul>
<li><strong>Box 1 — the input session</strong> — <em>"Enter 10 names (each up to 30 characters):"</em> then ten prompts <code>Name 1:</code> through <code>Name 10:</code>. The names typed are Hoang · Tuan · Binh · Chau · Anh · Duc · Nam · Hong · Nghia · Linh. Note the header text repeats the 30 from slide 43's <code>[31]</code>.</li>
<li><strong>Box 2 — before sorting</strong> — <em>"List of names before sort:"</em> and the same ten names <strong>in the order typed</strong>. Printing before sorting is not decoration: it proves that <code>inputNames</code> filled the caller's array (slide 45's pass-by-address), separately from whether the sort works.</li>
<li><strong>Box 3 — after sorting</strong> — <em>"List of names after sort:"</em> and Anh · Binh · Chau · Duc · Hoang · Hong · Linh · Nam · Nghia · Tuan. That is ascending ASCII order, produced by <code>strcmp(...) &gt; 0</code>.</li>
<li><strong>Two orderings worth checking on this data</strong> — <code>Hoang</code> comes before <code>Hong</code> because at index 1 <code>'o'</code> equals <code>'o'</code>, and at index 2 <code>'a'</code>(97) is less than <code>'n'</code>(110). And <code>Nam</code> comes before <code>Nghia</code> for the same reason at index 1: <code>'a'</code> before <code>'g'</code>. If your output has these two pairs the wrong way round, you sorted by length or by first letter only.</li>
<li><strong>What this sample deliberately does NOT test</strong> — every name is one word, so a program using <code>scanf("%s", ...)</code> passes this sample and still fails on "Nguyen Tien Linh". It also contains no duplicates, no empty input and no lowercase name. Your own testing should add all four.</li>
<li><strong>The <em>"Press any key to continue . . ."</em> at the bottom</strong> — that is <code>system("pause")</code>, a Windows console artefact, not output from your program. On Linux or macOS it will not appear and must not be part of what you compare.</li>
</ul>
<table>
<tr><th>#</th><th>As typed (before sort)</th><th>After sort (measured)</th><th>Why it lands there</th></tr>
<tr><td>1</td><td>Hoang</td><td><strong>Anh</strong></td><td><code>'A'</code>(65) is the smallest first letter in the set</td></tr>
<tr><td>2</td><td>Tuan</td><td>Binh</td><td><code>'B'</code>(66)</td></tr>
<tr><td>3</td><td>Binh</td><td>Chau</td><td><code>'C'</code>(67)</td></tr>
<tr><td>4</td><td>Chau</td><td>Duc</td><td><code>'D'</code>(68)</td></tr>
<tr><td>5</td><td>Anh</td><td><strong>Hoang</strong></td><td>ties with Hong on <code>'H'</code>, then <code>'o'</code>=<code>'o'</code>, then <code>'a'</code>&lt;<code>'n'</code></td></tr>
<tr><td>6</td><td>Duc</td><td><strong>Hong</strong></td><td>loses to Hoang at index 2</td></tr>
<tr><td>7</td><td>Nam</td><td>Linh</td><td><code>'L'</code>(76)</td></tr>
<tr><td>8</td><td>Hong</td><td><strong>Nam</strong></td><td>ties with Nghia on <code>'N'</code>, then <code>'a'</code>&lt;<code>'g'</code></td></tr>
<tr><td>9</td><td>Nghia</td><td><strong>Nghia</strong></td><td>loses to Nam at index 1</td></tr>
<tr><td>10</td><td>Linh</td><td>Tuan</td><td><code>'T'</code>(84) is the largest first letter</td></tr>
</table>
<p class="dap-an">✅ Đáp án — I fed those ten names to the program from slide 46 and the sorted output was <strong>Anh, Binh, Chau, Duc, Hoang, Hong, Linh, Nam, Nghia, Tuan</strong> — exactly the slide's third box, in the same order, with the two tie-break pairs (Hoang/Hong and Nam/Nghia) resolved as shown. Also verified: the "before sort" box is the input order untouched, which confirms that the array really was filled through the function parameter.</p>
<p class="pitfall">⚠️ This sort is case sensitive because <code>strcmp</code> is (slide 28). Type <code>anh</code> instead of <code>Anh</code> and it moves to the END of the list, after <code>Tuan</code>, because all lowercase letters have larger codes than all capitals. If an assignment says "alphabetical order" and the data has mixed case, compare lowercase copies — the <code>tolower</code> loop from slide 31.</p>`,
        `<p class="y-chinh">🎯 Hành vi mong đợi của Exercise 7, vẽ ra thành ba ảnh chụp console theo đúng thứ tự xuất hiện: phần nhập liệu, danh sách trước khi sắp, và danh sách sau khi sắp. Slide này chính là bài kiểm tra nghiệm thu của bạn — chương trình cho ra đúng ba khung này là đúng.</p>
<ul>
<li><strong>Khung 1 — phiên nhập liệu</strong> — <em>"Enter 10 names (each up to 30 characters):"</em> rồi mười lời nhắc <code>Name 1:</code> tới <code>Name 10:</code>. Các tên được gõ vào là Hoang · Tuan · Binh · Chau · Anh · Duc · Nam · Hong · Nghia · Linh. Để ý dòng tiêu đề nhắc lại con số 30 tương ứng với <code>[31]</code> ở slide 43.</li>
<li><strong>Khung 2 — trước khi sắp</strong> — <em>"List of names before sort:"</em> và vẫn mười cái tên ấy <strong>theo đúng thứ tự vừa gõ</strong>. In ra trước khi sắp không phải để trang trí: nó chứng minh <code>inputNames</code> đã điền được vào mảng của hàm gọi (lối truyền theo địa chỉ ở slide 45), tách bạch với chuyện phép sắp có chạy đúng hay không.</li>
<li><strong>Khung 3 — sau khi sắp</strong> — <em>"List of names after sort:"</em> và Anh · Binh · Chau · Duc · Hoang · Hong · Linh · Nam · Nghia · Tuan. Đó là thứ tự ASCII tăng dần, do <code>strcmp(...) &gt; 0</code> tạo ra.</li>
<li><strong>Hai cặp thứ tự đáng kiểm trên đúng bộ dữ liệu này</strong> — <code>Hoang</code> đứng trước <code>Hong</code> vì ở chỉ số 1 thì <code>'o'</code> bằng <code>'o'</code>, còn ở chỉ số 2 thì <code>'a'</code>(97) nhỏ hơn <code>'n'</code>(110). Và <code>Nam</code> đứng trước <code>Nghia</code> cũng vì lẽ ấy ở chỉ số 1: <code>'a'</code> trước <code>'g'</code>. Nếu kết quả của bạn đảo hai cặp này thì bạn đã sắp theo độ dài hoặc chỉ theo chữ cái đầu.</li>
<li><strong>Thứ bộ mẫu này CỐ TÌNH không kiểm</strong> — mọi cái tên đều một chữ, nên một chương trình dùng <code>scanf("%s", ...)</code> vẫn qua được bộ mẫu này rồi vẫn hỏng với "Nguyen Tien Linh". Nó cũng không có tên trùng, không có ô bỏ trống, không có tên viết thường. Khi tự kiểm, bạn nên thêm đủ cả bốn.</li>
<li><strong>Dòng <em>"Press any key to continue . . ."</em> ở dưới cùng</strong> — đó là <code>system("pause")</code>, một sản phẩm của console Windows, không phải kết quả của chương trình bạn. Trên Linux hay macOS nó sẽ không xuất hiện và không được tính vào phần đối chiếu.</li>
</ul>
<table>
<tr><th>#</th><th>Thứ tự gõ vào (trước khi sắp)</th><th>Sau khi sắp (đo thật)</th><th>Vì sao nó nằm ở đó</th></tr>
<tr><td>1</td><td>Hoang</td><td><strong>Anh</strong></td><td><code>'A'</code>(65) là chữ cái đầu nhỏ nhất trong bộ</td></tr>
<tr><td>2</td><td>Tuan</td><td>Binh</td><td><code>'B'</code>(66)</td></tr>
<tr><td>3</td><td>Binh</td><td>Chau</td><td><code>'C'</code>(67)</td></tr>
<tr><td>4</td><td>Chau</td><td>Duc</td><td><code>'D'</code>(68)</td></tr>
<tr><td>5</td><td>Anh</td><td><strong>Hoang</strong></td><td>hoà với Hong ở <code>'H'</code>, rồi <code>'o'</code>=<code>'o'</code>, rồi <code>'a'</code>&lt;<code>'n'</code></td></tr>
<tr><td>6</td><td>Duc</td><td><strong>Hong</strong></td><td>thua Hoang ở chỉ số 2</td></tr>
<tr><td>7</td><td>Nam</td><td>Linh</td><td><code>'L'</code>(76)</td></tr>
<tr><td>8</td><td>Hong</td><td><strong>Nam</strong></td><td>hoà với Nghia ở <code>'N'</code>, rồi <code>'a'</code>&lt;<code>'g'</code></td></tr>
<tr><td>9</td><td>Nghia</td><td><strong>Nghia</strong></td><td>thua Nam ở chỉ số 1</td></tr>
<tr><td>10</td><td>Linh</td><td>Tuan</td><td><code>'T'</code>(84) là chữ cái đầu lớn nhất</td></tr>
</table>
<p class="dap-an">✅ Đáp án — tôi đã đưa đúng mười cái tên ấy vào chương trình của slide 46 và kết quả sau khi sắp là <strong>Anh, Binh, Chau, Duc, Hoang, Hong, Linh, Nam, Nghia, Tuan</strong> — đúng khung thứ ba trên slide, đúng thứ tự, với hai cặp phải phân xử (Hoang/Hong và Nam/Nghia) rơi đúng như hình. Kiểm thêm: khung "before sort" giữ nguyên thứ tự nhập, xác nhận mảng thật sự đã được điền qua tham số của hàm.</p>
<p class="pitfall">⚠️ Phép sắp này PHÂN BIỆT hoa thường vì <code>strcmp</code> phân biệt (slide 28). Gõ <code>anh</code> thay vì <code>Anh</code> thì nó nhảy xuống CUỐI danh sách, sau cả <code>Tuan</code>, vì mọi chữ thường có mã lớn hơn mọi chữ hoa. Nếu đề bài nói "theo thứ tự bảng chữ cái" mà dữ liệu lẫn lộn hoa thường thì hãy so sánh trên bản sao viết thường — vòng lặp <code>tolower</code> ở slide 31.</p>`],

      [48, 'Summary (1/2)',
        `<p class="y-chinh">🎯 Five sentences that tie the whole slot together. Read them as five separate claims and check that you can justify each one from a slide you have already seen — that is the fastest revision you can do for this chapter.</p>
<ul>
<li><strong>"String in C is terminated by the NULL character ('\\0')"</strong> — the founding fact, from slide 4. Everything else follows: <code>strlen</code> counts up to it (slide 26), <code>strcpy</code> copies it (27), <code>strcat</code> overwrites it (29), <code>strtok</code> writes new ones (33), and <code>rTrim</code> works by moving it (37).</li>
<li><strong>"A string is similar to an array of characters"</strong> — similar, not identical. The difference is the terminator, which is why <code>char a[10] = "abc"</code> has <code>strlen</code> 3 and <code>sizeof</code> 10. Declare length n + 1 for n characters.</li>
<li><strong>"All input functions for string will automatically add the NULL character"</strong> — <code>scanf("%s")</code>, <code>scanf("%[^\\n]")</code> and <code>gets</code> all terminate what they store (slides 14, 17, 21). You never add it by hand after reading. But note this promise does NOT extend to <code>strncpy</code>, which I measured leaving a buffer with no terminator at all (slide 27).</li>
<li><strong>"Using the functions on arrays, strings are implemented to operate on arrays and strings"</strong> — the answer to slide 24's question "may operators be applied to strings?". No: no <code>=</code>, no <code>==</code>, no <code>+</code>. Use <code>strcpy</code>, <code>strcmp</code>, <code>strcat</code>. Writing <code>if (s1 == s2)</code> compiles and compares addresses.</li>
<li><strong>"If dynamic arrays or strings (using pointers), the assignment can be used on these pointers"</strong> — the one exception, and read it carefully. For <code>char *p, *q;</code> the statement <code>p = q;</code> is legal, but it copies the <em>address</em>: afterwards both names point at ONE string, and changing it through <code>p</code> changes what <code>q</code> sees. That is not a copy of the text; <code>strcpy</code> still is.</li>
<li><strong>What the summary leaves out, and you should add to your notes</strong> — that <code>strupr</code>/<code>strlwr</code> are not standard C (measured: a compile error outside Windows), that <code>strcmp</code>'s magnitude is unspecified (measured: −32 where the slide shows −1), and that <code>strtok</code> destroys its input (measured byte by byte).</li>
</ul>
<table>
<tr><th>Claim on the slide</th><th>Where it was proved</th><th>The measurement that backs it</th></tr>
<tr><td>Strings end with <code>'\\0'</code></td><td>slides 4, 26</td><td><code>"a\\0b"</code> has <code>strlen</code> 1 but <code>sizeof</code> 4</td></tr>
<tr><td>A string is like a char array</td><td>slides 4, 43</td><td><code>char a[10]="abc"</code>: <code>strlen</code> 3, <code>sizeof</code> 10</td></tr>
<tr><td>Input functions add the <code>'\\0'</code></td><td>slides 14, 17, 21</td><td>but <code>strncpy(buf,"ABCDEFGH",5)</code> leaves <code>[A][B][C][D][E][#]</code></td></tr>
<tr><td>Operators do not work; use functions</td><td>slides 24, 25–33</td><td><code>s1 == s2</code> compiles and compares addresses, never content</td></tr>
<tr><td>Assignment works on pointers</td><td>slide 7</td><td>but <code>p = q</code> shares one string; writing through a literal crashed (SIGBUS)</td></tr>
</table>
<p class="meo">💡 Turn this slide into flashcards by removing the middle column: given the claim, name the function and the trap. If you can say "strcat — destination must already end with <code>'\\0'</code>, and it checks no sizes" without looking, you are ready for the string questions on the exam.</p>`,
        `<p class="y-chinh">🎯 Năm câu buộc cả slot lại với nhau. Hãy đọc chúng như năm lời khẳng định riêng biệt và tự kiểm xem mình chứng minh được từng câu bằng một slide đã học chưa — đó là cách ôn nhanh nhất cho chương này.</p>
<ul>
<li><strong>"Chuỗi trong C kết thúc bằng ký tự NULL ('\\0')"</strong> — sự thật nền móng, từ slide 4. Mọi thứ khác đều suy ra từ đó: <code>strlen</code> đếm tới nó (slide 26), <code>strcpy</code> chép cả nó (27), <code>strcat</code> ghi đè lên nó (29), <code>strtok</code> ghi thêm những cái mới (33), và <code>rTrim</code> làm việc bằng cách dời nó (37).</li>
<li><strong>"Chuỗi tương tự một mảng ký tự"</strong> — TƯƠNG TỰ, không phải giống hệt. Khác nhau ở dấu kết thúc, và đó là lý do <code>char a[10] = "abc"</code> có <code>strlen</code> 3 mà <code>sizeof</code> 10. Cần n ký tự thì khai độ dài n + 1.</li>
<li><strong>"Mọi hàm nhập chuỗi sẽ tự động thêm ký tự NULL"</strong> — <code>scanf("%s")</code>, <code>scanf("%[^\\n]")</code> và <code>gets</code> đều kết thúc thứ chúng lưu (slide 14, 17, 21). Bạn không bao giờ phải tự thêm sau khi đọc. Nhưng lời hứa này KHÔNG mở rộng tới <code>strncpy</code>, mà tôi đã đo được nó để lại một vùng nhớ không có dấu kết thúc nào (slide 27).</li>
<li><strong>"Dùng các hàm trên mảng, chuỗi được cài đặt để thao tác trên mảng và chuỗi"</strong> — câu trả lời cho câu hỏi ở slide 24 "toán tử có dùng được cho chuỗi không?". Không: không <code>=</code>, không <code>==</code>, không <code>+</code>. Hãy dùng <code>strcpy</code>, <code>strcmp</code>, <code>strcat</code>. Viết <code>if (s1 == s2)</code> thì vẫn dịch được và nó so ĐỊA CHỈ.</li>
<li><strong>"Nếu là mảng/chuỗi động (dùng con trỏ) thì phép gán dùng được trên các con trỏ ấy"</strong> — ngoại lệ duy nhất, và hãy đọc kỹ. Với <code>char *p, *q;</code> thì câu lệnh <code>p = q;</code> hợp lệ, nhưng nó chép ĐỊA CHỈ: sau đó hai cái tên cùng trỏ vào MỘT chuỗi, và sửa qua <code>p</code> là đổi luôn thứ <code>q</code> nhìn thấy. Đó không phải bản sao của văn bản; muốn chép văn bản vẫn phải <code>strcpy</code>.</li>
<li><strong>Thứ phần tổng kết bỏ sót, và bạn nên ghi thêm vào vở</strong> — rằng <code>strupr</code>/<code>strlwr</code> không thuộc chuẩn C (đo thật: lỗi biên dịch ngoài Windows), rằng độ lớn của <code>strcmp</code> không được quy định (đo thật: −32 ở chỗ slide ghi −1), và rằng <code>strtok</code> phá huỷ dữ liệu vào của nó (đo từng byte).</li>
</ul>
<table>
<tr><th>Lời khẳng định trên slide</th><th>Đã chứng minh ở đâu</th><th>Phép đo chống lưng cho nó</th></tr>
<tr><td>Chuỗi kết thúc bằng <code>'\\0'</code></td><td>slide 4, 26</td><td><code>"a\\0b"</code> có <code>strlen</code> 1 mà <code>sizeof</code> 4</td></tr>
<tr><td>Chuỗi giống một mảng ký tự</td><td>slide 4, 43</td><td><code>char a[10]="abc"</code>: <code>strlen</code> 3, <code>sizeof</code> 10</td></tr>
<tr><td>Hàm nhập tự thêm <code>'\\0'</code></td><td>slide 14, 17, 21</td><td>nhưng <code>strncpy(buf,"ABCDEFGH",5)</code> để lại <code>[A][B][C][D][E][#]</code></td></tr>
<tr><td>Toán tử không dùng được; phải dùng hàm</td><td>slide 24, 25–33</td><td><code>s1 == s2</code> vẫn dịch và so địa chỉ, không bao giờ so nội dung</td></tr>
<tr><td>Phép gán dùng được với con trỏ</td><td>slide 7</td><td>nhưng <code>p = q</code> là dùng chung một chuỗi; ghi vào chuỗi hằng thì sập (SIGBUS)</td></tr>
</table>
<p class="meo">💡 Biến slide này thành thẻ ghi nhớ bằng cách che cột giữa: cho lời khẳng định, hãy gọi tên hàm và cái bẫy. Nếu bạn nói được "strcat — chuỗi đích phải ĐÃ kết thúc bằng <code>'\\0'</code>, và nó không kiểm tra kích thước nào cả" mà không cần nhìn, thì bạn đã sẵn sàng cho phần chuỗi trong đề thi.</p>`],

      [49, 'Summary (2/2): String Functions and Arrays of Strings',
        `<p class="y-chinh">🎯 The checklist version of the slot: what you must be able to do, listed as a small tree. Two branches for input, four for functions and arrays. If any leaf makes you hesitate, that is the slide to reread.</p>
<ul>
<li><strong>"String Input — scanf; gets"</strong> — <code>scanf("%s")</code> stops at the first blank (slide 14); <code>scanf("%[^\\n]")</code> reads the whole line including blanks (slide 17); <code>gets</code> reads a line too but the slide itself warns <em>"gets is unsafe … can lead to buffer overflows"</em> (slide 21). <code>gets</code> was removed from the C standard in C11; use <code>fgets</code> in anything you write for real.</li>
<li><strong>"Do yourself using getchar()"</strong> — the one item on this slide with no worked example anywhere in the deck. Reading a line with <code>getchar()</code> means: loop, append each character until <code>'\\n'</code> or EOF, stop before the buffer is full, and write the <code>'\\0'</code> yourself. It is worth writing once, because it makes the "automatically adds NULL" clause of slide 48 concrete.</li>
<li><strong>"Functions: strlen(), strcpy(), strcmp(), strcat(), strupr(), strlwr(), strstr(), strtok()"</strong> — the eight from slide 25. For each one you should be able to say its return type, whether it writes into your buffer, and its single trap. Two of the eight (<code>strupr</code>, <code>strlwr</code>) will not compile outside Windows, which I verified.</li>
<li><strong>"Arrays of Strings — Input and Output"</strong> — <code>char names[n][m]</code>, one row per string, <code>names[i]</code> is a whole string and <code>names[i][j]</code> one character (slides 43–44).</li>
<li><strong>"Passing to Functions"</strong> — <code>void f(char list[][31], int n)</code>: the row width is compulsory, the row count is not, so <code>n</code> travels separately. No copy is made, so the function edits the caller's table (slide 45).</li>
<li><strong>"Sorting an Array of Names"</strong> — Exercise 7: comparison becomes <code>strcmp(a,b) &gt; 0</code>, assignment becomes <code>strcpy</code> through a <code>char temp[31]</code>. Verified against the slide's own ten names, producing Anh &hellip; Tuan (slides 46–47).</li>
</ul>
<table>
<tr><th>Leaf on the summary tree</th><th>Slide</th><th>The one thing to remember</th></tr>
<tr><td><code>scanf</code> / <code>gets</code></td><td>13–22</td><td><code>%s</code> stops at a blank; <code>gets</code> has no size limit and was removed in C11</td></tr>
<tr><td><code>getchar()</code> version</td><td>—</td><td>you must write the <code>'\\0'</code> yourself; nothing does it for you</td></tr>
<tr><td><code>strlen</code> · <code>strcpy</code> · <code>strcmp</code> · <code>strcat</code></td><td>26–29</td><td>no <code>'\\0'</code> in the count · no size check · 0 means EQUAL · appends at the end</td></tr>
<tr><td><code>strupr</code> · <code>strlwr</code></td><td>30–31</td><td>NOT standard C — measured: a compile error on clang</td></tr>
<tr><td><code>strstr</code> · <code>strtok</code></td><td>32–33</td><td>returns an address or <code>NULL</code> · rewrites the original string</td></tr>
<tr><td>Arrays of strings, I/O</td><td>43–44</td><td><code>char a[n][m]</code> is one flat block of n × m bytes (measured 155 for 5×31)</td></tr>
<tr><td>Passing to functions</td><td>45</td><td><code>char list[][31]</code> — second bracket compulsory, plus an explicit <code>int n</code></td></tr>
<tr><td>Sorting names</td><td>46–47</td><td><code>strcmp</code> for compare, <code>strcpy</code> for swap — never <code>&gt;</code> and never <code>=</code></td></tr>
</table>
<p class="dap-an">✅ Every row of that table was checked by compiling and running code with <code>cc -Wall</code>, not by reading the slides. Three of the checks disagreed with what the slides display: <code>strcmp</code> returned −32/0/32 where slide 28 shows −1/0/1; <code>strupr</code> and <code>strlwr</code> failed to compile at all where slides 30–31 show a console box; and slide 45's screenshot lists a name its own code does not produce. In each case the slide's <em>teaching point</em> is sound — it is the printed numbers and screenshots that are environment-specific or stale.</p>
<p class="meo">💡 One last habit from this slot, worth more than any single function: when a string behaves strangely, print the buffer <strong>byte by byte</strong> instead of with <code>%s</code>. <code>for (i = 0; i &lt; sizeof(s); i++) printf("[%c]", s[i] ? s[i] : '@');</code> is four seconds of typing, and it is how the <code>strtok</code> damage on slide 33 and the leftover <code>'F'</code> after <code>strcpy</code> on slide 27 become visible. <code>%s</code> shows you what the string claims to be; the byte dump shows you what is actually there.</p>`,
        `<p class="y-chinh">🎯 Bản danh sách kiểm của cả slot: những gì bạn phải làm được, xếp thành một cái cây nhỏ. Hai nhánh cho phần nhập, bốn nhánh cho hàm và mảng. Chiếc lá nào làm bạn chững lại thì đó chính là slide cần đọc lại.</p>
<ul>
<li><strong>"String Input — scanf; gets"</strong> — <code>scanf("%s")</code> dừng ở dấu cách đầu tiên (slide 14); <code>scanf("%[^\\n]")</code> đọc cả dòng kể cả dấu cách (slide 17); <code>gets</code> cũng đọc cả dòng nhưng chính slide đã cảnh báo <em>"gets không an toàn … có thể gây tràn bộ đệm"</em> (slide 21). <code>gets</code> đã bị xoá khỏi chuẩn C từ C11; hãy dùng <code>fgets</code> trong mọi thứ bạn viết thật.</li>
<li><strong>"Do yourself using getchar()"</strong> — mục duy nhất trên slide này không có ví dụ mẫu ở bất cứ đâu trong bộ slide. Đọc một dòng bằng <code>getchar()</code> nghĩa là: lặp, nối từng ký tự cho tới khi gặp <code>'\\n'</code> hoặc EOF, dừng trước khi mảng đầy, và tự tay ghi dấu <code>'\\0'</code>. Đáng viết một lần, vì nó làm cho câu "tự động thêm NULL" của slide 48 trở nên cụ thể.</li>
<li><strong>"Functions: strlen(), strcpy(), strcmp(), strcat(), strupr(), strlwr(), strstr(), strtok()"</strong> — tám hàm của slide 25. Với mỗi hàm bạn phải nói được kiểu trả về, nó có GHI vào vùng nhớ của bạn không, và cái bẫy riêng của nó. Hai trong tám (<code>strupr</code>, <code>strlwr</code>) không dịch nổi ngoài Windows, tôi đã kiểm.</li>
<li><strong>"Arrays of Strings — Input and Output"</strong> — <code>char names[n][m]</code>, mỗi hàng một chuỗi, <code>names[i]</code> là cả một chuỗi còn <code>names[i][j]</code> là một ký tự (slide 43–44).</li>
<li><strong>"Passing to Functions"</strong> — <code>void f(char list[][31], int n)</code>: bề rộng hàng bắt buộc, số hàng thì không, nên <code>n</code> phải đi riêng. Không có bản sao nào, nên hàm sửa thẳng bảng của người gọi (slide 45).</li>
<li><strong>"Sorting an Array of Names"</strong> — Exercise 7: so sánh biến thành <code>strcmp(a,b) &gt; 0</code>, gán biến thành <code>strcpy</code> qua một <code>char temp[31]</code>. Đã kiểm với đúng mười cái tên của slide, cho ra Anh &hellip; Tuan (slide 46–47).</li>
</ul>
<table>
<tr><th>Lá trên cây tổng kết</th><th>Slide</th><th>Điều DUY NHẤT phải nhớ</th></tr>
<tr><td><code>scanf</code> / <code>gets</code></td><td>13–22</td><td><code>%s</code> dừng ở dấu cách; <code>gets</code> không giới hạn kích thước và đã bị xoá ở C11</td></tr>
<tr><td>Bản dùng <code>getchar()</code></td><td>—</td><td>bạn phải TỰ ghi dấu <code>'\\0'</code>; không ai làm giúp</td></tr>
<tr><td><code>strlen</code> · <code>strcpy</code> · <code>strcmp</code> · <code>strcat</code></td><td>26–29</td><td>không đếm <code>'\\0'</code> · không kiểm kích thước · số 0 là BẰNG NHAU · nối vào CUỐI</td></tr>
<tr><td><code>strupr</code> · <code>strlwr</code></td><td>30–31</td><td>KHÔNG thuộc chuẩn C — đo thật: lỗi biên dịch trên clang</td></tr>
<tr><td><code>strstr</code> · <code>strtok</code></td><td>32–33</td><td>trả về địa chỉ hoặc <code>NULL</code> · ghi đè thẳng lên chuỗi gốc</td></tr>
<tr><td>Mảng chuỗi, nhập/xuất</td><td>43–44</td><td><code>char a[n][m]</code> là một khối phẳng n × m byte (đo được 155 cho 5×31)</td></tr>
<tr><td>Truyền vào hàm</td><td>45</td><td><code>char list[][31]</code> — cặp ngoặc thứ hai bắt buộc, cộng thêm một <code>int n</code> tường minh</td></tr>
<tr><td>Sắp xếp danh sách tên</td><td>46–47</td><td><code>strcmp</code> để so, <code>strcpy</code> để đổi chỗ — đừng bao giờ <code>&gt;</code> và đừng bao giờ <code>=</code></td></tr>
</table>
<p class="dap-an">✅ Mọi hàng trong bảng ấy đều được kiểm bằng cách biên dịch và chạy mã thật với <code>cc -Wall</code>, chứ không phải bằng cách đọc slide. Ba phép kiểm cho kết quả khác thứ slide trưng ra: <code>strcmp</code> trả −32/0/32 trong khi slide 28 ghi −1/0/1; <code>strupr</code> và <code>strlwr</code> không dịch nổi trong khi slide 30–31 vẽ hẳn một khung console; và ảnh chụp ở slide 45 liệt kê một cái tên mà chính mã của nó không sinh ra. Trong cả ba trường hợp, <em>điều slide muốn dạy</em> đều đúng — chỉ có những con số in ra và những bức ảnh là phụ thuộc môi trường hoặc đã cũ.</p>
<p class="meo">💡 Một thói quen cuối rút từ slot này, đáng giá hơn bất cứ hàm riêng lẻ nào: khi một chuỗi cư xử lạ, hãy in vùng nhớ ra <strong>từng byte</strong> thay vì in bằng <code>%s</code>. Câu <code>for (i = 0; i &lt; sizeof(s); i++) printf("[%c]", s[i] ? s[i] : '@');</code> tốn bốn giây gõ, và đó là cách làm hiện ra thiệt hại của <code>strtok</code> ở slide 33 lẫn chữ <code>'F'</code> còn sót sau <code>strcpy</code> ở slide 27. <code>%s</code> cho bạn thấy chuỗi TỰ NHẬN nó là gì; còn bản đổ byte cho bạn thấy thực sự có gì ở đó.</p>`],

    ]),
  ].join('\n'),
};
