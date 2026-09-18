/**
 * PRF192 · Slot 16-18 — Strings, học theo từng slide: PHẦN 1 (slide 1–24).
 * Deck 'prf8' (PRF8), 49 slide, ảnh đã render sẵn lên CDN images/academy/PRF192/v1/prf8/NNN.webp.
 *
 * Nội dung bám ĐÚNG chữ trích từ Slot_16_17_18_Strings.pptx của trường
 * (/tmp/prf192-text/prf8.txt, slide 1→24). Các slide đặt MÃ NGUỒN / BẢNG Ô NHỚ /
 * KHUNG CONSOLE TRONG ẢNH (4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 16, 18, 19,
 * 21, 22, 23, 24) đã được đọc trực tiếp để lấy đúng từng dòng.
 *
 * MỌI chương trình và con số dưới đây đã biên dịch thật bằng `cc -Wall` (Apple
 * clang 17, arm64) và chạy với dữ liệu vào cụ thể:
 *   · slide 4/9  "ABC" trong char[15]  → 65 66 67 0 0 … ✓ khớp console trên slide
 *   · slide 5    country[31] = {'V','i','e','t','N','a','m'} (KHÔNG có '\0')
 *                → vẫn in ra "VietNam", country[7] = 0 ✓ (phần dư tự động bằng 0)
 *   · slide 5    char s[5] = "hello" → hợp lệ nhưng KHÔNG phải chuỗi: strlen = 8,
 *                printf("%s") in ra rác ✓ ; char *p = "abc"; p[0]='X' → SIGBUS (exit 138) ✓
 *   · slide 8    malloc vs calloc → chạy "String: Hello" / "String: World" ✓ ;
 *                strcpy 21 byte vào khối malloc(10) → sập (exit 138) ✓
 *   · slide 11   %20s · %-20s · %20.10s · %-20.10s → đo từng cột, khớp ảnh ✓
 *   · slide 12   puts("My name is Arnold") trả về 10 (số không âm) ✓
 *   · slide 13   printf("%u", str) → -Wformat, in ra 1868243891 (địa chỉ bị cụt) ✓
 *   · slide 15   nhập "My name is Arnold", scanf("%s") → "My", bộ đệm còn " name is Arnold\n" ✓
 *   · slide 16   nhập "Schwartzenegger", scanf("%10s") → "Schwartzen", bộ đệm còn "egger\n"
 *                ⚠ SLIDE GHI SAI: nó chép lại câu "' name is Arnold' remain in the input
 *                  buffer" của slide 15. Đo thật: còn "egger". Đã nêu rõ, KHÔNG sửa slide.
 *   · slide 18   %[^\n] → "My name is Arnold" (17 ký tự) ; %10[^\n] → "My name is",
 *                bộ đệm còn " Arnold\n" ✓ ; hai lần %[^\n] liên tiếp → lần 2 trả về 0 ✓
 *   · slide 19   Exercise 1 — TC1 "FPT Uni" → str=FPT, m/n nguyên vẹn ✓ ;
 *                TC2 "abcdefghijklmnopq#123456" → máy này ABORT (exit 134, stack canary).
 *                Giải mã hai số trên slide: n = 1869507948 = byte 'l','m','n','o';
 *                m = 824406384 = byte 'p','q','#','1' → đúng là phần tràn của chuỗi.
 *   · slide 20   %[0-9] · %[A-Z] · %[^,] · %[abcd] trên "2026FPTuni,abcdxyz" → đo từng bước ✓
 *   · slide 21/22 gets() → clang cảnh báo deprecated, và BẢN CHẠY tự in
 *                "warning: this program uses gets(), which is unsafe."; nhập 40 ký tự
 *                vào char[10] → abort (exit 134) ✓. fgets cùng dữ liệu → an toàn, giữ lại '\n' ✓
 *   · slide 23   Exercise 2 getstr() → chạy với 3 dữ liệu vào (câu thường, dòng rỗng,
 *                43 ký tự) ✓ ; truyền max = 31 cho char s[31] → sập (exit 134) ✓
 *   · slide 24   a2 = a1 → "array type 'char[5]' is not assignable" ✓ ;
 *                s1 == s2 với hai chuỗi nội dung giống hệt → 0 ; strcmp → 0 ✓
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'prf8';

export default {
  title: '9.0a — Slide by slide: C-strings, declaring/initializing, reading and printing strings (slides 1–24)|||9.0a — Slide bài giảng: Chuỗi C, khai báo/khởi tạo, nhập và xuất chuỗi (slide 1–24)',
  slug: 'prf192-9-0a-slides-chuoi-nhap-xuat',
  type: 'DOCUMENT',
  description: 'Nửa đầu của Slot 16-18 (slide 1–24): chuỗi trong C thực chất là mảng ký tự có thêm một byte NULL ở cuối, và gần như mọi lỗi chuỗi của sinh viên đều bắt nguồn từ việc quên mất byte ấy. Bài đi qua khai báo/khởi tạo chuỗi tĩnh và chuỗi động, cách dữ liệu nằm trong bộ nhớ theo mã ASCII, xuất chuỗi có và không định dạng, rồi toàn bộ phần nhập chuỗi bằng scanf %s, %[^\\n] và gets — kèm hai bài Exercise của trường được giải trọn vẹn. Mọi chương trình đều đã biên dịch bằng cc -Wall và chạy thật với dữ liệu vào cụ thể để lấy số thật; một câu ghi sai trên slide 16 và tình trạng gets() đã bị loại khỏi chuẩn C11 đều được nêu rõ thay vì chép lại.',
  content: [
    walkHead(D, 1, 24),
    walk(D, [

      [1, 'Strings',
        `<p class="y-chinh">🎯 The title slide of Slot 16-18. One word — <strong>Strings</strong> — but it is the first data type in this course that the C language does not really have: C has no string type at all, only a convention about arrays of <code>char</code>.</p>
<ul>
<li><strong>Three slots for one topic</strong> — 16, 17 and 18. That weight is not an accident: strings sit on top of arrays (Slot 13–15) and pointers (Slot 10) at once, so every misunderstanding left over from those two slots surfaces here.</li>
<li><strong>What "C has no string type" means in practice</strong> — there is no <code>string</code> keyword, no length field stored anywhere, no bounds checking. A string is an array of <code>char</code> plus <em>one agreement</em>: the useful characters end at the first byte whose value is 0.</li>
<li><strong>Why that agreement is the whole chapter</strong> — every library function in <code>&lt;string.h&gt;</code> trusts it blindly. <code>strlen</code> walks forward until it meets a 0 byte. If nobody put one there, it keeps walking into memory that is not yours.</li>
<li><strong>What you will be able to do after these three slots</strong> — declare and initialise strings, read a whole line (harder than it looks), print with field widths, and call the <code>&lt;string.h&gt;</code> family: <code>strlen</code>, <code>strcpy</code>, <code>strcmp</code>, <code>strcat</code>, <code>strstr</code>, <code>strtok</code>.</li>
<li><strong>Where this part stops</strong> — slides 1–24, i.e. what a string <em>is</em>, how to create one, how to print it and how to read one from the keyboard. The library functions and arrays of strings are the second half of the deck.</li>
</ul>
<p class="meo">💡 Carry one sentence through the whole chapter: <em>"a C string is an array of char that ends with a byte equal to 0."</em> Almost every exam question and every crash in this chapter is that sentence being violated somewhere.</p>`,
        `<p class="y-chinh">🎯 Slide bìa của Slot 16-18. Chỉ một chữ — <strong>Strings</strong> (chuỗi) — nhưng đây là kiểu dữ liệu đầu tiên trong môn mà ngôn ngữ C thật ra KHÔNG có: C không hề có kiểu chuỗi, nó chỉ có một quy ước về mảng <code>char</code>.</p>
<ul>
<li><strong>Ba buổi cho một chủ đề</strong> — 16, 17 và 18. Trọng lượng ấy không ngẫu nhiên: chuỗi nằm chồng lên cả mảng (Slot 13–15) lẫn con trỏ (Slot 10), nên mọi chỗ hiểu lơ mơ còn sót lại từ hai slot đó sẽ lộ ra ở đây.</li>
<li><strong>"C không có kiểu chuỗi" nghĩa là gì trong thực tế</strong> — không có từ khoá <code>string</code>, không có ô nào lưu độ dài, không có kiểm tra vượt biên. Chuỗi là một mảng <code>char</code> cộng với <em>một thoả thuận duy nhất</em>: phần có ý nghĩa kết thúc ở byte đầu tiên mang giá trị 0.</li>
<li><strong>Vì sao thoả thuận ấy chính là cả chương này</strong> — mọi hàm trong <code>&lt;string.h&gt;</code> tin nó một cách mù quáng. <code>strlen</code> đi tới cho tới khi gặp byte 0. Nếu không ai đặt byte đó vào, nó cứ đi tiếp vào vùng nhớ không thuộc về bạn.</li>
<li><strong>Sau ba buổi này bạn làm được gì</strong> — khai báo và khởi tạo chuỗi, đọc trọn một dòng (khó hơn vẻ ngoài của nó nhiều), in ra với độ rộng cột, và gọi được họ hàm <code>&lt;string.h&gt;</code>: <code>strlen</code>, <code>strcpy</code>, <code>strcmp</code>, <code>strcat</code>, <code>strstr</code>, <code>strtok</code>.</li>
<li><strong>Phần này dừng ở đâu</strong> — slide 1–24, tức là chuỗi <em>là gì</em>, tạo ra nó thế nào, in ra sao và đọc từ bàn phím kiểu gì. Các hàm thư viện và mảng chuỗi thuộc nửa sau của bộ slide.</li>
</ul>
<p class="meo">💡 Mang một câu này đi suốt cả chương: <em>"chuỗi C là một mảng char kết thúc bằng một byte có giá trị 0."</em> Gần như mọi câu hỏi thi và mọi lần chương trình sập trong chương này đều là câu ấy bị vi phạm ở đâu đó.</p>`],

      [2, 'Objectives',
        `<p class="y-chinh">🎯 Seven questions the deck promises to answer. Read them as a checklist you can tick off — if you cannot answer one of them at the end, you know exactly which slides to return to.</p>
<ul>
<li><strong>"The way a string of characters is stored in C"</strong> — slides 4 and 9. The answer is: consecutive bytes holding ASCII codes, plus a trailing 0 byte. Slide 9 prints those codes so you can see them.</li>
<li><strong>"How to declare/initialize a string"</strong> — slides 5 to 8, split into <em>static</em> (the compiler picks the memory) and <em>dynamic</em> (you ask <code>malloc</code>/<code>calloc</code> for it at run time).</li>
<li><strong>"How to access a character in a string"</strong> — with the same <code>s[i]</code> notation you already use on arrays, because a string <em>is</em> an array. Slide 6's two <code>for</code> loops do exactly that.</li>
<li><strong>"What are operations on strings"</strong> — slide 24 gives the surprising answer: <strong>none of the operators work</strong>. No <code>=</code>, no <code>==</code>, no <code>+</code>. You must call functions instead.</li>
<li><strong>"Input/output (stdio.h)"</strong> — slides 10 to 23, the biggest block of this half. Output is easy; input is where the traps live.</li>
<li><strong>"Some common used functions in the library string.h"</strong> and <strong>"How to manage an array of strings"</strong> — the second half of the deck, slides 25 onwards.</li>
</ul>
<p class="meo">💡 Notice how the objectives are ordered: <em>storage → declaration → access → operations → I/O → library</em>. That is also the right order to revise in, because each one only makes sense once the previous one is solid.</p>`,
        `<p class="y-chinh">🎯 Bảy câu hỏi mà bộ slide hứa sẽ trả lời. Hãy đọc chúng như một danh sách để tự đánh dấu — cuối chương mà còn một câu chưa trả lời được thì bạn biết chính xác phải quay lại slide nào.</p>
<ul>
<li><strong>"Cách một chuỗi ký tự được lưu trong C"</strong> — slide 4 và 9. Câu trả lời là: các byte liên tiếp chứa mã ASCII, cộng thêm một byte 0 ở cuối. Slide 9 in thẳng những mã ấy ra cho bạn nhìn thấy.</li>
<li><strong>"Khai báo/khởi tạo một chuỗi thế nào"</strong> — slide 5 đến 8, chia làm <em>tĩnh</em> (trình biên dịch tự chọn chỗ nhớ) và <em>động</em> (bạn xin <code>malloc</code>/<code>calloc</code> lúc chạy).</li>
<li><strong>"Truy cập một ký tự trong chuỗi thế nào"</strong> — bằng đúng ký hiệu <code>s[i]</code> bạn đã dùng cho mảng, vì chuỗi <em>chính là</em> một mảng. Hai vòng <code>for</code> ở slide 6 làm đúng việc đó.</li>
<li><strong>"Có những phép toán nào trên chuỗi"</strong> — slide 24 cho câu trả lời bất ngờ: <strong>không phép toán nào chạy cả</strong>. Không <code>=</code>, không <code>==</code>, không <code>+</code>. Phải gọi hàm thay thế.</li>
<li><strong>"Nhập/xuất (stdio.h)"</strong> — slide 10 đến 23, khối lớn nhất của nửa này. Xuất thì dễ; nhập mới là nơi ở của các cái bẫy.</li>
<li><strong>"Một số hàm hay dùng trong thư viện string.h"</strong> và <strong>"Quản lý một mảng các chuỗi thế nào"</strong> — thuộc nửa sau của bộ slide, từ slide 25 trở đi.</li>
</ul>
<p class="meo">💡 Để ý thứ tự của mục tiêu: <em>lưu trữ → khai báo → truy cập → phép toán → nhập/xuất → thư viện</em>. Đó cũng là thứ tự ôn đúng, vì mỗi mục chỉ có nghĩa khi mục trước đã chắc.</p>`],

      [3, 'Contents',
        `<p class="y-chinh">🎯 The map of the whole deck in eight numbered sections. Slides 1–24 — this lesson — cover the first six of them; the last two belong to the second half.</p>
<ul>
<li><strong>1. Null-String / C-String</strong> (slide 4) — the definition and the one rule: length <code>n</code> needs an array of <code>n+1</code>.</li>
<li><strong>2. Declare / Initialize a string</strong> (slides 5–8) — static strings in the data or stack segment, dynamic strings on the heap.</li>
<li><strong>3. Data stored in a string</strong> (slide 9) — each character is its ASCII code; the terminator is the number 0.</li>
<li><strong>4. Output a String</strong> (slides 10–12) — <code>printf("%s")</code> with qualifiers, then <code>puts()</code>.</li>
<li><strong>5. Input a string</strong> (slides 13–23) — <code>scanf</code> with <code>%s</code>, <code>scanf</code> with <code>%[…]</code>, and <code>gets</code>. Two exercises sit inside this block, at slides 19 and 23.</li>
<li><strong>6. May Operators Applied to String?</strong> (slide 24) — the bridge into section 7: since operators fail, functions are needed.</li>
<li><strong>7. Other String Functions</strong> and <strong>8. Array of Strings</strong> — slides 25–49, the next lesson.</li>
</ul>
<p class="nhan">Where the weight is — section 5 (input) takes 11 of the 24 slides in this half. That is the honest ratio: printing a string is one line, reading one correctly is a skill.</p>
<p class="meo">💡 When you revise, revise by section number, not by slide number. The section numbers appear in the orange titles of the content slides (<em>"1. Null-String/ C-String"</em>, <em>"4. Output Strings (cont.)"</em>) so you can always tell where you are in this map.</p>`,
        `<p class="y-chinh">🎯 Bản đồ của cả bộ slide, chia thành tám mục có đánh số. Slide 1–24 — tức bài học này — bao trọn sáu mục đầu; hai mục cuối thuộc nửa sau.</p>
<ul>
<li><strong>1. Null-String / C-String</strong> (slide 4) — định nghĩa và một quy tắc duy nhất: chuỗi dài <code>n</code> thì cần mảng <code>n+1</code>.</li>
<li><strong>2. Khai báo / Khởi tạo chuỗi</strong> (slide 5–8) — chuỗi tĩnh nằm ở vùng data hoặc stack, chuỗi động nằm trên heap.</li>
<li><strong>3. Dữ liệu lưu trong chuỗi</strong> (slide 9) — mỗi ký tự là mã ASCII của nó; dấu kết thúc là số 0.</li>
<li><strong>4. Xuất chuỗi</strong> (slide 10–12) — <code>printf("%s")</code> kèm các bộ chỉnh, rồi <code>puts()</code>.</li>
<li><strong>5. Nhập chuỗi</strong> (slide 13–23) — <code>scanf</code> với <code>%s</code>, <code>scanf</code> với <code>%[…]</code>, và <code>gets</code>. Hai bài tập nằm ngay trong khối này, ở slide 19 và 23.</li>
<li><strong>6. Toán tử có áp dụng được cho chuỗi không?</strong> (slide 24) — cây cầu dẫn sang mục 7: vì toán tử không chạy nên phải có hàm.</li>
<li><strong>7. Các hàm chuỗi khác</strong> và <strong>8. Mảng các chuỗi</strong> — slide 25–49, thuộc bài kế tiếp.</li>
</ul>
<p class="nhan">Trọng lượng nằm ở đâu — mục 5 (nhập) chiếm 11 trên 24 slide của nửa này. Đó là tỷ lệ thành thật: in một chuỗi ra chỉ là một dòng, còn đọc một chuỗi vào cho đúng mới là kỹ năng.</p>
<p class="meo">💡 Lúc ôn, hãy ôn theo số mục chứ đừng theo số slide. Số mục hiện ngay trên tiêu đề màu cam của các slide nội dung (<em>"1. Null-String/ C-String"</em>, <em>"4. Output Strings (cont.)"</em>) nên lúc nào bạn cũng biết mình đang ở đâu trên bản đồ này.</p>`],

      [4, '1. Null-String / C-String',
        `<p class="y-chinh">🎯 The definition slide, and the single most examined sentence of the whole chapter: <em>"If a string with the length <strong>n</strong> is needed, declare it with the length <strong>n+1</strong>."</em> The extra slot is for the NULL byte.</p>
<ul>
<li><strong>What the NULL byte is</strong> — a byte whose <em>value</em> is 0, written in source code as the escape sequence <code>'\\0'</code>. It is not the character <code>'0'</code> (that is ASCII 48) and it is not the pointer <code>NULL</code>. The slide names the result a <strong>NULL-string</strong> or a <strong>C-string</strong>.</li>
<li><strong>Why an array of char is not enough</strong> — an array knows nothing about how much of it is in use. <code>char name[31]</code> always has 31 bytes; the 0 byte is what says "the meaningful part ends here". The slide phrases it exactly so: the NULL byte "locates the last meaningful element".</li>
<li><strong>Read the table at the bottom</strong> — <code>"My name is Arnold"</code> is 17 characters, indices 0 to 16, and the red <code>\\0</code> sits at index <strong>17</strong>. Indices 18 to 30 exist but hold nothing you may rely on.</li>
<li><strong>Spaces are characters too</strong> — indices 2, 7 and 10 in the table hold the blank character (ASCII 32). Beginners often forget this and count "My name is Arnold" as 14. It is 17.</li>
<li><strong>So the n+1 rule applied here</strong> — 17 useful characters need <code>char name[18]</code> at minimum. The slide declares 31, which is fine: an array may be longer than the string inside it, never shorter.</li>
</ul>
<p class="nhan">Đo thật — the exact bytes of <code>char name[31] = "My name is Arnold";</code>:</p>
<table>
<tr><th>Chỉ số</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th><th>11</th><th>12</th><th>13</th><th>14</th><th>15</th><th>16</th><th>17</th><th>18</th></tr>
<tr><th>Ký tự</th><td>M</td><td>y</td><td>(dấu cách)</td><td>n</td><td>a</td><td>m</td><td>e</td><td>(dấu cách)</td><td>i</td><td>s</td><td>(dấu cách)</td><td>A</td><td>r</td><td>n</td><td>o</td><td>l</td><td>d</td><td><strong>\\0</strong></td><td>?</td></tr>
<tr><th>Mã ASCII</th><td>77</td><td>121</td><td>32</td><td>110</td><td>97</td><td>109</td><td>101</td><td>32</td><td>105</td><td>115</td><td>32</td><td>65</td><td>114</td><td>110</td><td>111</td><td>108</td><td>100</td><td><strong>0</strong></td><td>0</td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;string.h&gt;

int main(void) {
    char name[31] = "My name is Arnold";
    printf("strlen(name) = %zu\\n", strlen(name));   /* 17  - KHONG dem '\\0' */
    printf("sizeof(name) = %zu\\n", sizeof name);    /* 31  - kich thuoc MANG */
    for (int i = 0; i &lt; 19; i++)
        printf("[%d]=%c(%d) ", i, name[i] ? name[i] : '.', name[i]);
    printf("\\n");
    return 0;
}</code></pre>
<p class="dap-an">✅ Compiled with <code>cc -Wall</code> and run: <code>strlen(name) = 17</code> while <code>sizeof(name) = 31</code>. Those two numbers being different is the whole point of this slide — <code>strlen</code> counts up to the 0 byte, <code>sizeof</code> reports the box. Index 17 printed <code>(0)</code>, exactly where the slide's red <code>\\0</code> is drawn.</p>
<p class="pitfall">⚠️ <code>'\\0'</code> (one character, value 0), <code>'0'</code> (the digit, value 48) and <code>"0"</code> (a two-byte string) are three different things. Writing <code>s[i] = '0';</code> when you meant <code>s[i] = '\\0';</code> does not end the string — it appends a zero digit and leaves the string running on.</p>`,
        `<p class="y-chinh">🎯 Slide định nghĩa, và là câu bị hỏi thi nhiều nhất cả chương: <em>"Nếu cần một chuỗi dài <strong>n</strong>, hãy khai báo nó với độ dài <strong>n+1</strong>."</em> Ô dư ra ấy dành cho byte NULL.</p>
<ul>
<li><strong>Byte NULL là cái gì</strong> — một byte có <em>giá trị</em> bằng 0, viết trong mã nguồn là chuỗi thoát <code>'\\0'</code>. Nó KHÔNG phải ký tự <code>'0'</code> (ký tự đó có mã ASCII 48) và cũng không phải con trỏ <code>NULL</code>. Slide gọi kết quả là <strong>NULL-string</strong> hay <strong>C-string</strong>.</li>
<li><strong>Vì sao một mảng char thôi thì chưa đủ</strong> — mảng không biết gì về chuyện bao nhiêu phần của nó đang được dùng. <code>char name[31]</code> lúc nào cũng có 31 byte; chính byte 0 mới nói "phần có nghĩa kết thúc ở đây". Slide diễn đạt đúng như vậy: byte NULL "định vị phần tử có ý nghĩa cuối cùng".</li>
<li><strong>Hãy đọc kỹ bảng dưới cùng</strong> — <code>"My name is Arnold"</code> có 17 ký tự, chỉ số 0 đến 16, và dấu <code>\\0</code> màu đỏ nằm ở chỉ số <strong>17</strong>. Chỉ số 18 đến 30 vẫn tồn tại nhưng chứa thứ bạn không được phép tin.</li>
<li><strong>Dấu cách cũng là ký tự</strong> — chỉ số 2, 7 và 10 trong bảng chứa ký tự trắng (ASCII 32). Người mới hay quên và đếm "My name is Arnold" thành 14. Nó là 17.</li>
<li><strong>Vậy quy tắc n+1 áp vào đây</strong> — 17 ký tự có ích thì tối thiểu cần <code>char name[18]</code>. Slide khai 31, thế là ổn: mảng được phép dài hơn chuỗi nằm trong nó, chỉ không được ngắn hơn.</li>
</ul>
<p class="nhan">Đo thật — từng byte của <code>char name[31] = "My name is Arnold";</code>:</p>
<table>
<tr><th>Chỉ số</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th><th>11</th><th>12</th><th>13</th><th>14</th><th>15</th><th>16</th><th>17</th><th>18</th></tr>
<tr><th>Ký tự</th><td>M</td><td>y</td><td>(dấu cách)</td><td>n</td><td>a</td><td>m</td><td>e</td><td>(dấu cách)</td><td>i</td><td>s</td><td>(dấu cách)</td><td>A</td><td>r</td><td>n</td><td>o</td><td>l</td><td>d</td><td><strong>\\0</strong></td><td>?</td></tr>
<tr><th>Mã ASCII</th><td>77</td><td>121</td><td>32</td><td>110</td><td>97</td><td>109</td><td>101</td><td>32</td><td>105</td><td>115</td><td>32</td><td>65</td><td>114</td><td>110</td><td>111</td><td>108</td><td>100</td><td><strong>0</strong></td><td>0</td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;string.h&gt;

int main(void) {
    char name[31] = "My name is Arnold";
    printf("strlen(name) = %zu\\n", strlen(name));   /* 17  - KHONG dem '\\0' */
    printf("sizeof(name) = %zu\\n", sizeof name);    /* 31  - kich thuoc MANG */
    for (int i = 0; i &lt; 19; i++)
        printf("[%d]=%c(%d) ", i, name[i] ? name[i] : '.', name[i]);
    printf("\\n");
    return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch bằng <code>cc -Wall</code> và chạy thật: <code>strlen(name) = 17</code> còn <code>sizeof(name) = 31</code>. Hai con số ấy khác nhau chính là toàn bộ ý của slide — <code>strlen</code> đếm tới byte 0, còn <code>sizeof</code> báo kích thước cái hộp. Chỉ số 17 in ra <code>(0)</code>, đúng chỗ slide vẽ dấu <code>\\0</code> đỏ.</p>
<p class="pitfall">⚠️ <code>'\\0'</code> (một ký tự, giá trị 0), <code>'0'</code> (chữ số, giá trị 48) và <code>"0"</code> (một chuỗi hai byte) là ba thứ khác nhau. Viết <code>s[i] = '0';</code> trong khi định viết <code>s[i] = '\\0';</code> thì chuỗi không hề kết thúc — bạn vừa nối thêm một chữ số 0 và chuỗi vẫn chạy tiếp.</p>`],

      [5, '2. Declare / Initialize a String — Static strings',
        `<p class="y-chinh">🎯 <em>"Static strings: stored in data segment or stack segment. Compiler can determine the location for storing strings."</em> The key word is <strong>compiler</strong>: the size is fixed at compile time, so you must know it when you write the code.</p>
<ul>
<li><strong>Three ways on the slide</strong> — declare only: <code>char name[21];</code> (21 bytes of garbage). Declare and initialise from a literal: <code>char address[31] = "Hoa Lac Hi-tech Park";</code>. Declare and initialise character by character: <code>char country[31] = {'V','i','e','t', 'N','a','m'};</code>.</li>
<li><strong>"NULL byte is automatically inserted"</strong> — the blue comment on the slide. For the string-literal form this is guaranteed. For the brace form the slide shows <em>no</em> explicit <code>'\\0'</code> — and it still works, because C zero-fills every element you did not list. I measured it: <code>country[7]</code> is 0 and <code>strlen(country)</code> is 7.</li>
<li><strong>Read the two tables</strong> — <code>address</code> fills 0…19 and puts <code>\\0</code> at 20; <code>country</code> fills 0…6 and puts <code>\\0</code> at 7. In both cases the array is 31, so most of it is spare. That is normal and safe.</li>
<li><strong>"data segment or stack segment"</strong> — a local <code>char s[31]</code> inside a function lives on the <strong>stack</strong> and disappears when the function returns; a <code>char s[31]</code> outside all functions, or marked <code>static</code>, lives in the <strong>data segment</strong> for the whole run. Both are "static strings" in the slide's sense because the compiler picks the address.</li>
<li><strong>The dangerous cousin the slide does not show</strong> — <code>char *p = "abc";</code> also looks like a static string, but it puts the text in a <em>read-only</em> area and only stores its address in <code>p</code>. Writing through <code>p</code> crashes; writing into an array does not. See the measurement below.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;string.h&gt;

int main(void) {
    char name[21];                                     /* chua khoi tao  */
    char address[31] = "Hoa Lac Hi-tech Park";         /* '\\0' tu dong    */
    char country[31] = {'V','i','e','t', 'N','a','m'}; /* phan du = 0     */

    printf("address = %s (len %zu)\\n", address, strlen(address));
    printf("country = %s (len %zu), country[7] = %d\\n",
           country, strlen(country), country[7]);

    char a[] = "abc";      /* MANG tren stack - sua duoc */
    a[0] = 'X';
    printf("mang sua duoc: %s\\n", a);

    char *p = "abc";       /* CON TRO toi vung chi doc   */
    printf("p tro toi: %s\\n", p);
    p[0] = 'X';            /* &lt;-- sap o day              */
    printf("khong bao gio in duoc dong nay\\n");
    (void)name;
    return 0;
}</code></pre>
<p class="dap-an">✅ Measured with <code>cc -Wall</code>: <code>address = Hoa Lac Hi-tech Park (len 20)</code> and <code>country = VietNam (len 7), country[7] = 0</code> — the slide's brace form really does get its terminator for free. Then <code>a[0] = 'X'</code> printed <code>Xbc</code> happily, and the very next line <code>p[0] = 'X'</code> killed the process with <strong>SIGBUS, exit code 138</strong>. Same-looking initialisation, opposite behaviour.</p>
<p class="pitfall">⚠️ The n+1 rule has a nasty legal exception. <code>char s[5] = "hello";</code> does <strong>not</strong> fail to compile — C quietly drops the <code>'\\0'</code> when the array is exactly one byte too short. <code>cc -Wall</code> said nothing. The result is not a string: I measured <code>strlen(s) = 8</code> and <code>printf("%s", s)</code> printed <code>hello</code> followed by garbage from the next variable. Write <code>char s[6] = "hello";</code>, or better <code>char s[] = "hello";</code> and let the compiler count.</p>`,
        `<p class="y-chinh">🎯 <em>"Chuỗi tĩnh: lưu ở vùng data hoặc vùng stack. Trình biên dịch xác định được chỗ lưu chuỗi."</em> Từ khoá là <strong>trình biên dịch</strong>: kích thước bị chốt ngay lúc biên dịch, nên bạn phải biết nó từ lúc gõ mã.</p>
<ul>
<li><strong>Ba cách trên slide</strong> — chỉ khai báo: <code>char name[21];</code> (21 byte rác). Khai báo kèm khởi tạo bằng hằng chuỗi: <code>char address[31] = "Hoa Lac Hi-tech Park";</code>. Khai báo kèm khởi tạo từng ký tự: <code>char country[31] = {'V','i','e','t', 'N','a','m'};</code>.</li>
<li><strong>"NULL byte is automatically inserted"</strong> — dòng chú thích xanh trên slide. Với dạng hằng chuỗi thì điều này được bảo đảm. Với dạng ngoặc nhọn, slide KHÔNG hề ghi <code>'\\0'</code> — mà nó vẫn chạy, vì C điền 0 vào mọi phần tử bạn không liệt kê. Tôi đã đo: <code>country[7]</code> bằng 0 và <code>strlen(country)</code> bằng 7.</li>
<li><strong>Đọc kỹ hai bảng</strong> — <code>address</code> chiếm 0…19 và đặt <code>\\0</code> ở ô 20; <code>country</code> chiếm 0…6 và đặt <code>\\0</code> ở ô 7. Cả hai mảng đều dài 31 nên phần lớn còn trống. Chuyện đó bình thường và an toàn.</li>
<li><strong>"vùng data hoặc vùng stack"</strong> — một <code>char s[31]</code> cục bộ trong hàm nằm trên <strong>stack</strong> và biến mất khi hàm kết thúc; một <code>char s[31]</code> đặt ngoài mọi hàm, hoặc có từ khoá <code>static</code>, nằm ở <strong>vùng data</strong> suốt cả lần chạy. Cả hai đều là "chuỗi tĩnh" theo nghĩa của slide, vì trình biên dịch chọn địa chỉ.</li>
<li><strong>Người anh em nguy hiểm mà slide không vẽ</strong> — <code>char *p = "abc";</code> trông cũng như chuỗi tĩnh, nhưng nó đặt phần chữ vào vùng <em>chỉ đọc</em> và chỉ cất địa chỉ vào <code>p</code>. Ghi qua <code>p</code> là sập; ghi vào mảng thì không. Xem phép đo bên dưới.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;string.h&gt;

int main(void) {
    char name[21];                                     /* chua khoi tao  */
    char address[31] = "Hoa Lac Hi-tech Park";         /* '\\0' tu dong    */
    char country[31] = {'V','i','e','t', 'N','a','m'}; /* phan du = 0     */

    printf("address = %s (len %zu)\\n", address, strlen(address));
    printf("country = %s (len %zu), country[7] = %d\\n",
           country, strlen(country), country[7]);

    char a[] = "abc";      /* MANG tren stack - sua duoc */
    a[0] = 'X';
    printf("mang sua duoc: %s\\n", a);

    char *p = "abc";       /* CON TRO toi vung chi doc   */
    printf("p tro toi: %s\\n", p);
    p[0] = 'X';            /* &lt;-- sap o day              */
    printf("khong bao gio in duoc dong nay\\n");
    (void)name;
    return 0;
}</code></pre>
<p class="dap-an">✅ Đo bằng <code>cc -Wall</code>: <code>address = Hoa Lac Hi-tech Park (len 20)</code> và <code>country = VietNam (len 7), country[7] = 0</code> — dạng ngoặc nhọn của slide thật sự được tặng không byte kết thúc. Sau đó <code>a[0] = 'X'</code> in ra <code>Xbc</code> ngon lành, còn ngay dòng kế <code>p[0] = 'X'</code> giết tiến trình bằng <strong>SIGBUS, mã thoát 138</strong>. Hai cách khởi tạo nhìn giống nhau, hành vi ngược nhau.</p>
<p class="pitfall">⚠️ Quy tắc n+1 có một ngoại lệ hợp pháp rất khó chịu. <code>char s[5] = "hello";</code> KHÔNG hề báo lỗi biên dịch — C lặng lẽ vứt bỏ <code>'\\0'</code> khi mảng ngắn đúng một byte. <code>cc -Wall</code> im re. Kết quả không còn là chuỗi: tôi đo được <code>strlen(s) = 8</code> và <code>printf("%s", s)</code> in ra <code>hello</code> kèm rác lấy từ biến kế bên. Hãy viết <code>char s[6] = "hello";</code>, hoặc tốt hơn là <code>char s[] = "hello";</code> rồi để trình biên dịch tự đếm.</p>`],

      [6, 'Static Strings: Example',
        `<p class="y-chinh">🎯 The slide from the previous page turned into a running program: declare three strings, then walk each one with a <code>for</code> loop whose stopping condition is <code>address[i] != '\\0'</code> — that is how you visit "exactly the meaningful part" of a string.</p>
<ul>
<li><strong>The red box repeats slide 5</strong> — but with a detail worth noticing: here the arrays are <code>[30]</code>, not <code>[31]</code>, and <code>country</code> <em>does</em> list <code>'\\0'</code> explicitly. Both spellings are correct; the slide is showing you they are interchangeable.</li>
<li><strong>The loop is the real lesson</strong> — <code>for (i = 0; address[i] != '\\0'; i++) printf("%c", address[i]);</code>. Nothing here knows the array is 30 long. The loop stops because it finds the 0 byte, which is why that byte must exist.</li>
<li><strong>Printing with <code>%c</code> one at a time</strong> — this is deliberately the manual version of <code>printf("%s", address)</code> from slide 10. Doing it by hand once makes the later shortcut meaningful: <code>%s</code> <em>is</em> this loop, written inside the library.</li>
<li><strong>The console on the slide</strong> — two lines, <code>Hoa Lac Hi-tech Park</code> and <code>VietNam</code>, then Dev-C++'s <em>"Press any key to continue"</em> from <code>system("pause")</code>.</li>
<li><strong>What happens if the terminator is missing</strong> — the loop does not stop at the end of the array. It keeps reading whatever bytes follow, printing junk, until it happens to hit a zero. That is a read past the end of an array, and C will not warn you.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

int main() {
    char name[21];
    char address[30] = "Hoa Lac Hi-tech Park";
    char country[30] = {'V','i','e','t', 'N','a','m', '\\0'};

    int i;
    for (i = 0; address[i] != '\\0'; i++) { printf("%c", address[i]); }
    printf("\\n");
    for (i = 0; country[i] != '\\0'; i++) { printf("%c", country[i]); }
    printf("\\n");
    (void)name;
    return 0;
}</code></pre>
<p class="dap-an">✅ Compiled with <code>cc -Wall</code> and run: the output is exactly the two lines on the slide's console —<br><code>Hoa Lac Hi-tech Park</code><br><code>VietNam</code><br>The first loop ran 20 times and the second 7 times, which is <code>strlen</code> of each string. Neither loop ever looked at index 20 or beyond in the first array.</p>
<p class="pitfall">⚠️ <code>system("pause")</code> on the last-but-one line is Windows-only — that is what needs <code>&lt;stdlib.h&gt;</code> here. On Linux/macOS remove it, or your program will report <em>sh: pause: command not found</em>. It is a Dev-C++ habit, not part of C.</p>`,
        `<p class="y-chinh">🎯 Slide trước được biến thành một chương trình chạy được: khai ba chuỗi, rồi đi hết từng chuỗi bằng vòng <code>for</code> có điều kiện dừng là <code>address[i] != '\\0'</code> — đó chính là cách thăm "đúng phần có nghĩa" của một chuỗi.</p>
<ul>
<li><strong>Khung đỏ lặp lại slide 5</strong> — nhưng có một chi tiết đáng để ý: ở đây mảng là <code>[30]</code> chứ không phải <code>[31]</code>, và <code>country</code> có liệt kê <code>'\\0'</code> một cách tường minh. Cả hai cách viết đều đúng; slide đang cho bạn thấy chúng thay thế nhau được.</li>
<li><strong>Vòng lặp mới là bài học thật</strong> — <code>for (i = 0; address[i] != '\\0'; i++) printf("%c", address[i]);</code>. Không có gì ở đây biết mảng dài 30. Vòng lặp dừng vì nó gặp byte 0, và đó là lý do byte ấy bắt buộc phải tồn tại.</li>
<li><strong>In từng ký tự bằng <code>%c</code></strong> — đây cố ý là phiên bản làm tay của <code>printf("%s", address)</code> ở slide 10. Làm tay một lần khiến cái lối tắt sau này có ý nghĩa: <code>%s</code> CHÍNH LÀ vòng lặp này, chỉ là nó nằm trong thư viện.</li>
<li><strong>Cửa sổ console trên slide</strong> — hai dòng, <code>Hoa Lac Hi-tech Park</code> và <code>VietNam</code>, rồi câu <em>"Press any key to continue"</em> của Dev-C++ do <code>system("pause")</code> sinh ra.</li>
<li><strong>Thiếu byte kết thúc thì sao</strong> — vòng lặp không dừng ở cuối mảng. Nó đọc tiếp mọi byte phía sau, in ra rác, cho tới khi tình cờ gặp một số 0. Đó là đọc vượt biên mảng, và C sẽ không cảnh báo gì cho bạn.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

int main() {
    char name[21];
    char address[30] = "Hoa Lac Hi-tech Park";
    char country[30] = {'V','i','e','t', 'N','a','m', '\\0'};

    int i;
    for (i = 0; address[i] != '\\0'; i++) { printf("%c", address[i]); }
    printf("\\n");
    for (i = 0; country[i] != '\\0'; i++) { printf("%c", country[i]); }
    printf("\\n");
    (void)name;
    return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch bằng <code>cc -Wall</code> và chạy: kết quả đúng hai dòng trên console của slide —<br><code>Hoa Lac Hi-tech Park</code><br><code>VietNam</code><br>Vòng thứ nhất quay 20 lượt, vòng thứ hai 7 lượt, bằng đúng <code>strlen</code> của mỗi chuỗi. Không vòng nào chạm tới chỉ số 20 trở đi của mảng đầu.</p>
<p class="pitfall">⚠️ <code>system("pause")</code> ở dòng gần cuối chỉ có trên Windows — đó mới là thứ cần <code>&lt;stdlib.h&gt;</code> ở đây. Trên Linux/macOS hãy bỏ nó đi, không thì chương trình báo <em>sh: pause: command not found</em>. Đó là thói quen của Dev-C++, không phải một phần của C.</p>`],

      [7, '2. Declare / Initialize a String (cont.) — Dynamic strings',
        `<p class="y-chinh">🎯 <em>"Dynamic strings: stored in the heap."</em> The opposite of slide 5: here the <strong>program</strong>, not the compiler, decides how many bytes it needs — and it decides while running, from data it only learns at run time.</p>
<ul>
<li><strong>The two syntaxes in the box</strong> — <code>char *str = (char *)malloc(length * sizeof(char));</code> or <code>char *str = (char *)calloc(length, sizeof(char));</code>. Both hand back the address of a fresh block; the variable holding it is a <strong>pointer</strong>, not an array.</li>
<li><strong>malloc versus calloc</strong> — <code>malloc</code> takes one number (total bytes) and leaves the block <em>uninitialised</em>; <code>calloc</code> takes two (count and item size) and <em>fills the block with zeros</em>. For strings that difference matters: after <code>calloc</code> the block already reads as an empty string, after <code>malloc</code> it reads as garbage.</li>
<li><strong>"Note: using malloc and calloc in <code>&lt;stdlib.h&gt;</code>"</strong> — forget that include and old compilers assume <code>malloc</code> returns <code>int</code>, which corrupts the pointer on a 64-bit machine. Modern <code>cc</code> refuses outright.</li>
<li><strong>Why <code>sizeof(char)</code> when it is always 1</strong> — it is a habit, and a good one: writing <code>n * sizeof(T)</code> keeps the formula correct if you later change <code>T</code>. For <code>char</code> it multiplies by 1 and costs nothing.</li>
<li><strong>The n+1 rule comes along too</strong> — <code>malloc(10)</code> gives room for a 9-character string plus its terminator, not a 10-character one. This is the same arithmetic as slide 4, just on the heap.</li>
<li><strong>What the heap buys you</strong> — a size computed at run time (<code>malloc(n + 1)</code> where <code>n</code> came from the user), and a block that survives after the function that created it returns. A local array can do neither.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;string.h&gt;

int main(void) {
    int length = 10;
    char *m = (char *)malloc(length * sizeof(char));
    char *c = (char *)calloc(length, sizeof(char));
    if (m == NULL || c == NULL) return 1;            /* luon kiem tra */

    printf("malloc, 3 byte dau: %d %d %d\\n", m[0], m[1], m[2]);
    printf("calloc, 3 byte dau: %d %d %d\\n", c[0], c[1], c[2]);

    strcpy(m, "Hello");
    printf("String: %s\\n", m);

    free(m);
    free(c);
    return 0;
}</code></pre>
<p class="dap-an">✅ Run for real: <code>calloc</code>'s first bytes came back <code>0 0 0</code>, guaranteed by the standard. <code>malloc</code>'s also read <code>0 0 0</code> <em>on this run</em> — and that is precisely the trap: nothing promises it, a later run or another machine may give anything. Never rely on a <code>malloc</code> block's contents; write into it first.</p>
<p class="pitfall">⚠️ <code>sizeof</code> lies about heap strings. For <code>char s[31]</code>, <code>sizeof s</code> is 31; for <code>char *str = malloc(31)</code>, <code>sizeof str</code> is <strong>8</strong> — the size of the pointer, not of the block. There is no way to ask C how big a <code>malloc</code> block is, so you must remember the number yourself.</p>`,
        `<p class="y-chinh">🎯 <em>"Chuỗi động: lưu trên heap."</em> Ngược hẳn với slide 5: ở đây <strong>chương trình</strong>, chứ không phải trình biên dịch, quyết định cần bao nhiêu byte — và nó quyết định lúc đang chạy, dựa trên dữ liệu chỉ tới lúc đó mới biết.</p>
<ul>
<li><strong>Hai cú pháp trong khung</strong> — <code>char *str = (char *)malloc(length * sizeof(char));</code> hoặc <code>char *str = (char *)calloc(length, sizeof(char));</code>. Cả hai trả về địa chỉ của một khối mới; biến giữ địa chỉ ấy là <strong>con trỏ</strong>, không phải mảng.</li>
<li><strong>malloc khác calloc chỗ nào</strong> — <code>malloc</code> nhận một số (tổng byte) và để khối <em>chưa khởi tạo</em>; <code>calloc</code> nhận hai số (số lượng và kích thước mỗi phần tử) rồi <em>điền 0 vào cả khối</em>. Với chuỗi thì khác biệt ấy có nghĩa: sau <code>calloc</code> khối đã đọc được như chuỗi rỗng, sau <code>malloc</code> nó là rác.</li>
<li><strong>"Note: dùng malloc và calloc trong <code>&lt;stdlib.h&gt;</code>"</strong> — quên include thì trình biên dịch cũ tưởng <code>malloc</code> trả về <code>int</code>, làm hỏng con trỏ trên máy 64-bit. <code>cc</code> hiện đại thì từ chối thẳng.</li>
<li><strong>Vì sao viết <code>sizeof(char)</code> khi nó luôn bằng 1</strong> — đó là thói quen, và là thói quen tốt: viết <code>n * sizeof(T)</code> giúp công thức vẫn đúng nếu sau này bạn đổi <code>T</code>. Với <code>char</code> thì nó nhân 1, không mất gì.</li>
<li><strong>Quy tắc n+1 vẫn đi theo</strong> — <code>malloc(10)</code> cho chỗ chứa chuỗi 9 ký tự kèm byte kết thúc, chứ không phải 10 ký tự. Vẫn là phép tính của slide 4, chỉ là làm trên heap.</li>
<li><strong>Heap mua cho bạn cái gì</strong> — một kích thước tính lúc chạy (<code>malloc(n + 1)</code> với <code>n</code> lấy từ người dùng), và một khối sống sót cả sau khi hàm tạo ra nó đã kết thúc. Mảng cục bộ không làm được việc nào trong hai việc đó.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;string.h&gt;

int main(void) {
    int length = 10;
    char *m = (char *)malloc(length * sizeof(char));
    char *c = (char *)calloc(length, sizeof(char));
    if (m == NULL || c == NULL) return 1;            /* luon kiem tra */

    printf("malloc, 3 byte dau: %d %d %d\\n", m[0], m[1], m[2]);
    printf("calloc, 3 byte dau: %d %d %d\\n", c[0], c[1], c[2]);

    strcpy(m, "Hello");
    printf("String: %s\\n", m);

    free(m);
    free(c);
    return 0;
}</code></pre>
<p class="dap-an">✅ Chạy thật: các byte đầu của <code>calloc</code> trả về <code>0 0 0</code>, đúng như chuẩn bảo đảm. Các byte của <code>malloc</code> cũng ra <code>0 0 0</code> <em>ở lần chạy này</em> — và đó đúng là cái bẫy: chẳng có gì hứa hẹn cả, lần chạy sau hay máy khác có thể ra bất cứ thứ gì. Đừng bao giờ tin vào nội dung một khối <code>malloc</code>; hãy ghi vào đó trước đã.</p>
<p class="pitfall">⚠️ <code>sizeof</code> nói dối về chuỗi trên heap. Với <code>char s[31]</code> thì <code>sizeof s</code> bằng 31; với <code>char *str = malloc(31)</code> thì <code>sizeof str</code> bằng <strong>8</strong> — kích thước con trỏ, không phải của khối. Không có cách nào hỏi C xem một khối <code>malloc</code> to bao nhiêu, nên bạn phải tự nhớ con số ấy.</p>`],

      [8, 'Dynamic Strings: Example',
        `<p class="y-chinh">🎯 The same program written twice, side by side: <code>malloc</code> on the left, <code>calloc</code> on the right. Everything else is identical — which is the point: the two calls are interchangeable here, and only the red box differs.</p>
<ul>
<li><strong>The shared shape</strong> — <code>int length = 10;</code> → allocate → <code>strcpy(str, "Hello")</code> / <code>strcpy(str, "World")</code> → <code>printf("String: %s\\n", str)</code> → <code>free(str)</code>. Four steps, and the fourth is the one students forget.</li>
<li><strong>Why <code>strcpy</code> and not <code>=</code></strong> — <code>str = "Hello";</code> would compile but would throw away the address you just allocated and point <code>str</code> at a read-only literal instead: a memory leak plus a string you cannot modify. This is the same lesson slide 24 makes explicit.</li>
<li><strong>"Hello" and "World" both fit</strong> — 5 characters plus <code>'\\0'</code> is 6 bytes, and the block is 10. Comfortable. A 10-character word would not fit, and <code>strcpy</code> would not tell you.</li>
<li><strong>The two consoles</strong> — <code>String: Hello</code> and <code>String: World</code>. Identical behaviour, confirming that for a block you immediately overwrite, <code>calloc</code>'s zero-filling buys nothing.</li>
<li><strong>When the choice does matter</strong> — if you plan to append with <code>strcat</code> before writing anything, <code>calloc</code> gives you a valid empty string to append to, while a <code>malloc</code> block is garbage and <code>strcat</code> will append after some random byte far away. Then <code>calloc</code> (or <code>str[0] = '\\0';</code>) is required.</li>
<li><strong><code>free</code> is not optional</strong> — every <code>malloc</code>/<code>calloc</code> needs exactly one <code>free</code>. In a 10-line program the OS cleans up anyway; in a loop that allocates per record, forgetting <code>free</code> is how a server dies after six hours.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;string.h&gt;

int main() {
    int length = 10;
    char *str = (char *)malloc(length * sizeof(char));
    if (str == NULL) return 1;

    strcpy(str, "Hello");
    printf("String: %s\\n", str);

    free(str);
    return 0;
}</code></pre>
<p class="dap-an">✅ Both versions compiled with <code>cc -Wall</code> and run: the <code>malloc</code> one printed <code>String: Hello</code> and the <code>calloc</code> one printed <code>String: World</code> — exactly the two consoles on the slide. I also measured the addresses: the two blocks came back at <code>0x104952120</code> and <code>0x104951e30</code> (heap), while the pointer variable itself lived at <code>0x16bd623c0</code> (stack). The <em>pointer</em> is on the stack; the <em>string</em> is on the heap.</p>
<p class="pitfall">⚠️ I then ran <code>strcpy(p, "Hoa Lac Hi-tech Park")</code> — 21 bytes — into a <code>malloc(10)</code> block. There is no bounds check anywhere in <code>strcpy</code>, and the process died with <strong>exit code 138 (SIGBUS)</strong>. The rule for the heap is the same as for arrays: you must count the bytes yourself, including the <code>'\\0'</code>.</p>`,
        `<p class="y-chinh">🎯 Cùng một chương trình viết hai lần, đặt cạnh nhau: <code>malloc</code> bên trái, <code>calloc</code> bên phải. Mọi thứ còn lại y hệt — và đó chính là ý: ở đây hai lời gọi thay nhau được, chỉ khung đỏ là khác.</p>
<ul>
<li><strong>Bộ khung dùng chung</strong> — <code>int length = 10;</code> → cấp phát → <code>strcpy(str, "Hello")</code> / <code>strcpy(str, "World")</code> → <code>printf("String: %s\\n", str)</code> → <code>free(str)</code>. Bốn bước, và bước thứ tư là bước sinh viên hay quên.</li>
<li><strong>Vì sao dùng <code>strcpy</code> chứ không dùng <code>=</code></strong> — <code>str = "Hello";</code> vẫn biên dịch được nhưng sẽ vứt đi cái địa chỉ bạn vừa xin và cho <code>str</code> trỏ vào một hằng chuỗi chỉ đọc: vừa rò rỉ bộ nhớ vừa được một chuỗi không sửa được. Đây đúng là bài học mà slide 24 nói thẳng ra.</li>
<li><strong>"Hello" và "World" đều vừa</strong> — 5 ký tự cộng <code>'\\0'</code> là 6 byte, mà khối có 10. Thoải mái. Một từ 10 ký tự thì không vừa, và <code>strcpy</code> sẽ không nói cho bạn biết.</li>
<li><strong>Hai cửa sổ console</strong> — <code>String: Hello</code> và <code>String: World</code>. Hành vi giống hệt, xác nhận rằng với một khối bạn ghi đè ngay lập tức thì việc <code>calloc</code> điền 0 chẳng mua được gì.</li>
<li><strong>Khi nào lựa chọn ấy mới quan trọng</strong> — nếu bạn định <code>strcat</code> nối thêm trước khi ghi gì cả, <code>calloc</code> cho bạn một chuỗi rỗng hợp lệ để nối vào, còn khối <code>malloc</code> là rác nên <code>strcat</code> sẽ nối vào sau một byte ngẫu nhiên nào đó ở tít đâu. Lúc ấy <code>calloc</code> (hoặc <code>str[0] = '\\0';</code>) là bắt buộc.</li>
<li><strong><code>free</code> không phải tuỳ chọn</strong> — mỗi <code>malloc</code>/<code>calloc</code> cần đúng một <code>free</code>. Trong chương trình 10 dòng thì hệ điều hành dọn hộ; trong một vòng lặp cấp phát cho từng bản ghi, quên <code>free</code> chính là cách một máy chủ chết sau sáu tiếng.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;string.h&gt;

int main() {
    int length = 10;
    char *str = (char *)malloc(length * sizeof(char));
    if (str == NULL) return 1;

    strcpy(str, "Hello");
    printf("String: %s\\n", str);

    free(str);
    return 0;
}</code></pre>
<p class="dap-an">✅ Cả hai bản đã biên dịch bằng <code>cc -Wall</code> và chạy: bản <code>malloc</code> in <code>String: Hello</code>, bản <code>calloc</code> in <code>String: World</code> — đúng hai cửa sổ console trên slide. Tôi cũng đo địa chỉ: hai khối trả về ở <code>0x104952120</code> và <code>0x104951e30</code> (heap), còn bản thân biến con trỏ nằm ở <code>0x16bd623c0</code> (stack). <em>Con trỏ</em> ở trên stack; <em>chuỗi</em> ở trên heap.</p>
<p class="pitfall">⚠️ Sau đó tôi chạy <code>strcpy(p, "Hoa Lac Hi-tech Park")</code> — 21 byte — vào một khối <code>malloc(10)</code>. Trong <code>strcpy</code> không có bất kỳ phép kiểm biên nào, và tiến trình chết với <strong>mã thoát 138 (SIGBUS)</strong>. Luật của heap giống hệt luật của mảng: bạn phải tự đếm số byte, kể cả byte <code>'\\0'</code>.</p>`],

      [9, '3. Data Stored in a strings',
        `<p class="y-chinh">🎯 <em>"Each character in a string is stored as it's ASCII code."</em> The slide proves it by printing the same array twice — once as characters would look, and here as raw numbers with <code>%d</code>. This is the X-ray view of slide 4's table.</p>
<ul>
<li><strong>Two strings, two spellings, same result</strong> — <code>char s1[15] = "ABC";</code> and <code>char s2[15] = {'a', 'b', 'c', '\\0'};</code>. The loops run <code>i</code> from 0 to 14, i.e. over the <em>whole array</em>, not just the meaningful part — that is how you get to see what lies past the terminator.</li>
<li><strong>The console, decoded</strong> — <code>65 66 67 0 0 0 …</code> for <code>s1</code>: 'A' is 65, 'B' is 66, 'C' is 67, then the terminator 0, then twelve more zeros. And <code>97 98 99 0 0 …</code> for <code>s2</code>: lowercase 'a' is 97, 'b' 98, 'c' 99.</li>
<li><strong>Uppercase and lowercase differ by exactly 32</strong> — 65 vs 97, 66 vs 98, 67 vs 99. That constant is why <code>c - 'A' + 'a'</code> converts to lowercase, and it is a favourite exam question.</li>
<li><strong>Why the tail is all zeros here</strong> — because these are initialised arrays: C fills every element you did not list with 0. An <em>uninitialised</em> local array <code>char s[15];</code> would show 15 arbitrary numbers instead, and you must not print it with <code>%s</code>.</li>
<li><strong>The consequence for <code>strlen</code></strong> — it counts characters before the first 0, so both strings have length 3 even though the arrays are 15. There is no stored length anywhere; it is recomputed by walking, every single call.</li>
<li><strong>Link back to Slot 02–04</strong> — <code>char</code> has always been an integer type in C. <code>printf("%c", 65)</code> prints <code>A</code> and <code>printf("%d", 'A')</code> prints <code>65</code>; same byte, two ways of looking at it.</li>
</ul>
<p class="nhan">Đo thật — the 15 bytes of each array:</p>
<table>
<tr><th>Chỉ số</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>…</th><th>14</th></tr>
<tr><th><code>s1</code> — ký tự</th><td>A</td><td>B</td><td>C</td><td><strong>\\0</strong></td><td>\\0</td><td>…</td><td>\\0</td></tr>
<tr><th><code>s1</code> — mã ASCII</th><td>65</td><td>66</td><td>67</td><td><strong>0</strong></td><td>0</td><td>…</td><td>0</td></tr>
<tr><th><code>s2</code> — ký tự</th><td>a</td><td>b</td><td>c</td><td><strong>\\0</strong></td><td>\\0</td><td>…</td><td>\\0</td></tr>
<tr><th><code>s2</code> — mã ASCII</th><td>97</td><td>98</td><td>99</td><td><strong>0</strong></td><td>0</td><td>…</td><td>0</td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

int main() {
    char s1[15] = "ABC";
    char s2[15] = {'a', 'b', 'c', '\\0'};

    int i;
    for (i = 0; i &lt; 15; i++) { printf("%d ", s1[i]); }
    printf("\\n");
    for (i = 0; i &lt; 15; i++) { printf("%d ", s2[i]); }
    printf("\\n");
    return 0;
}</code></pre>
<p class="dap-an">✅ Compiled with <code>cc -Wall</code> and run. Line 1: <code>65 66 67 0 0 0 0 0 0 0 0 0 0 0 0</code>. Line 2: <code>97 98 99 0 0 0 0 0 0 0 0 0 0 0 0</code>. Character for character, this is the console printed on the slide — including the fact that index 3 is where the terminator lands for a 3-letter string, exactly as the n+1 rule says.</p>
<p class="meo">💡 A quick memory anchor for ASCII: <code>'0'</code> = 48, <code>'A'</code> = 65, <code>'a'</code> = 97. From those three you can derive any letter or digit by adding an offset, and you can check any answer in a second: <code>'C'</code> = 65 + 2 = 67 ✓.</p>`,
        `<p class="y-chinh">🎯 <em>"Mỗi ký tự trong chuỗi được lưu bằng mã ASCII của nó."</em> Slide chứng minh bằng cách in cùng một mảng ra dưới dạng số thô với <code>%d</code>. Đây là ảnh chụp X-quang của cái bảng ở slide 4.</p>
<ul>
<li><strong>Hai chuỗi, hai cách viết, cùng một kết quả</strong> — <code>char s1[15] = "ABC";</code> và <code>char s2[15] = {'a', 'b', 'c', '\\0'};</code>. Hai vòng lặp cho <code>i</code> chạy từ 0 tới 14, tức là quét <em>cả mảng</em> chứ không chỉ phần có nghĩa — đó là cách để nhìn thấy cái gì nằm sau byte kết thúc.</li>
<li><strong>Giải mã cửa sổ console</strong> — <code>65 66 67 0 0 0 …</code> cho <code>s1</code>: 'A' là 65, 'B' là 66, 'C' là 67, rồi byte kết thúc 0, rồi mười hai số 0 nữa. Và <code>97 98 99 0 0 …</code> cho <code>s2</code>: chữ thường 'a' là 97, 'b' 98, 'c' 99.</li>
<li><strong>Chữ hoa và chữ thường cách nhau đúng 32</strong> — 65 với 97, 66 với 98, 67 với 99. Hằng số ấy là lý do <code>c - 'A' + 'a'</code> đổi được sang chữ thường, và nó là câu hỏi thi rất được ưa chuộng.</li>
<li><strong>Vì sao phần đuôi ở đây toàn số 0</strong> — vì đây là mảng CÓ khởi tạo: C điền 0 vào mọi phần tử bạn không liệt kê. Một mảng cục bộ <em>chưa khởi tạo</em> <code>char s[15];</code> sẽ hiện ra 15 con số tuỳ tiện, và bạn không được in nó bằng <code>%s</code>.</li>
<li><strong>Hệ quả cho <code>strlen</code></strong> — nó đếm số ký tự trước số 0 đầu tiên, nên cả hai chuỗi đều dài 3 dù mảng dài 15. Không có chỗ nào lưu sẵn độ dài; nó được tính lại bằng cách đi bộ, mỗi lần gọi.</li>
<li><strong>Nối lại với Slot 02–04</strong> — <code>char</code> xưa nay vẫn là một kiểu số nguyên trong C. <code>printf("%c", 65)</code> in ra <code>A</code> còn <code>printf("%d", 'A')</code> in ra <code>65</code>; cùng một byte, hai cách nhìn.</li>
</ul>
<p class="nhan">Đo thật — 15 byte của mỗi mảng:</p>
<table>
<tr><th>Chỉ số</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>…</th><th>14</th></tr>
<tr><th><code>s1</code> — ký tự</th><td>A</td><td>B</td><td>C</td><td><strong>\\0</strong></td><td>\\0</td><td>…</td><td>\\0</td></tr>
<tr><th><code>s1</code> — mã ASCII</th><td>65</td><td>66</td><td>67</td><td><strong>0</strong></td><td>0</td><td>…</td><td>0</td></tr>
<tr><th><code>s2</code> — ký tự</th><td>a</td><td>b</td><td>c</td><td><strong>\\0</strong></td><td>\\0</td><td>…</td><td>\\0</td></tr>
<tr><th><code>s2</code> — mã ASCII</th><td>97</td><td>98</td><td>99</td><td><strong>0</strong></td><td>0</td><td>…</td><td>0</td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

int main() {
    char s1[15] = "ABC";
    char s2[15] = {'a', 'b', 'c', '\\0'};

    int i;
    for (i = 0; i &lt; 15; i++) { printf("%d ", s1[i]); }
    printf("\\n");
    for (i = 0; i &lt; 15; i++) { printf("%d ", s2[i]); }
    printf("\\n");
    return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch bằng <code>cc -Wall</code> và chạy. Dòng 1: <code>65 66 67 0 0 0 0 0 0 0 0 0 0 0 0</code>. Dòng 2: <code>97 98 99 0 0 0 0 0 0 0 0 0 0 0 0</code>. Từng ký tự một, đây đúng là cửa sổ console in trên slide — kể cả chi tiết chỉ số 3 là nơi byte kết thúc rơi vào với chuỗi 3 chữ, đúng như quy tắc n+1.</p>
<p class="meo">💡 Một mốc nhớ nhanh cho ASCII: <code>'0'</code> = 48, <code>'A'</code> = 65, <code>'a'</code> = 97. Từ ba số đó bạn suy ra được mọi chữ cái và chữ số bằng phép cộng, và kiểm lại đáp án trong một giây: <code>'C'</code> = 65 + 2 = 67 ✓.</p>`],

      [10, '4. Output Strings — Formatted Output',
        `<p class="y-chinh">🎯 <em>"printf() displays all of the characters from the address provided up to but excluding the null terminator byte."</em> Read that sentence twice — it says <code>%s</code> takes an <strong>address</strong>, and it says the terminator is <strong>not printed</strong>.</p>
<ul>
<li><strong><code>%s</code> receives an address, not a string</strong> — there is no "string value" in C to pass. <code>printf("%s\\n", name)</code> works because an array name decays to the address of its first element. That is the Slot 10 rule, arriving here.</li>
<li><strong>So <code>printf("%s", name)</code> is the loop from slide 6</strong>, written once inside the library: start at the given address, print bytes, stop at the first 0. Nothing else. It has no idea how big your array is.</li>
<li><strong>"up to but excluding"</strong> — the terminator is a marker, not content. <code>printf</code> reads it, obeys it, and does not print it. That is why the console shows <code>My name is Arnold</code> with nothing after it.</li>
<li><strong>Do not write <code>&amp;name</code></strong> — for <code>%d</code> you write <code>&amp;n</code> in <code>scanf</code>, so students copy the habit. For an array you do not: <code>name</code> already <em>is</em> the address. (For <code>char</code> arrays <code>&amp;name</code> happens to be the same number with a different type, so it often works by accident — do not rely on it.)</li>
<li><strong>A consequence worth having in your pocket</strong> — since <code>%s</code> takes any address inside the array, <code>printf("%s", name + 11)</code> prints from character 11 onward. I measured it on this exact string: it prints <code>Arnold</code>. No copying, no substring function — just a different starting address.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main(void)
{
    char name[31] = "My name is Arnold";

    printf("%s\\n", name);          /* tu dau chuoi          */
    printf("%s\\n", name + 11);     /* tu ky tu thu 11       */

    return 0;
}</code></pre>
<p class="dap-an">✅ Compiled and run: line 1 is <code>My name is Arnold</code> — exactly the console on the slide — and line 2 is <code>Arnold</code>. Both came from the same 31-byte array and the same terminator; only the starting address differed.</p>
<p class="pitfall">⚠️ <code>%s</code> with something that is not a valid C string is one of the classic crashes. Passing a single <code>char</code> (<code>printf("%s", name[0])</code>) hands <code>printf</code> the number 77 as an address; passing an uninitialised array makes it walk until it randomly meets a 0. <code>cc -Wall</code> catches the first one (<em>format specifies type 'char *' but the argument has type 'char'</em>) but cannot catch the second.</p>`,
        `<p class="y-chinh">🎯 <em>"printf() hiển thị tất cả ký tự bắt đầu từ địa chỉ được cung cấp, cho tới nhưng KHÔNG kể byte kết thúc null."</em> Hãy đọc câu ấy hai lần — nó nói <code>%s</code> nhận một <strong>địa chỉ</strong>, và nó nói byte kết thúc <strong>không được in ra</strong>.</p>
<ul>
<li><strong><code>%s</code> nhận địa chỉ chứ không nhận chuỗi</strong> — trong C không có "giá trị chuỗi" nào để truyền cả. <code>printf("%s\\n", name)</code> chạy được vì tên mảng tự suy biến thành địa chỉ phần tử đầu. Đó là luật của Slot 10, bây giờ mới tới lượt dùng.</li>
<li><strong>Nên <code>printf("%s", name)</code> chính là vòng lặp ở slide 6</strong>, chỉ là nó được viết sẵn một lần trong thư viện: bắt đầu ở địa chỉ được cho, in từng byte, dừng ở số 0 đầu tiên. Không gì khác. Nó hoàn toàn không biết mảng của bạn to bao nhiêu.</li>
<li><strong>"cho tới nhưng không kể"</strong> — byte kết thúc là dấu mốc, không phải nội dung. <code>printf</code> đọc nó, tuân theo nó, và không in nó ra. Vì vậy console hiện <code>My name is Arnold</code> và không có gì phía sau.</li>
<li><strong>Đừng viết <code>&amp;name</code></strong> — với <code>%d</code> thì trong <code>scanf</code> bạn viết <code>&amp;n</code>, nên sinh viên bê nguyên thói quen sang. Với mảng thì không: <code>name</code> ĐÃ là địa chỉ rồi. (Với mảng <code>char</code> thì <code>&amp;name</code> tình cờ cũng là con số ấy nhưng kiểu khác, nên nó hay chạy được do may mắn — đừng dựa vào đó.)</li>
<li><strong>Một hệ quả đáng bỏ túi</strong> — vì <code>%s</code> nhận bất kỳ địa chỉ nào bên trong mảng, nên <code>printf("%s", name + 11)</code> in từ ký tự thứ 11 trở đi. Tôi đã đo trên đúng chuỗi này: nó in ra <code>Arnold</code>. Không sao chép, không cần hàm cắt chuỗi — chỉ là một địa chỉ bắt đầu khác.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main(void)
{
    char name[31] = "My name is Arnold";

    printf("%s\\n", name);          /* tu dau chuoi          */
    printf("%s\\n", name + 11);     /* tu ky tu thu 11       */

    return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch và chạy: dòng 1 là <code>My name is Arnold</code> — đúng cửa sổ console trên slide — và dòng 2 là <code>Arnold</code>. Cả hai đến từ cùng một mảng 31 byte và cùng một byte kết thúc; chỉ khác địa chỉ bắt đầu.</p>
<p class="pitfall">⚠️ Đưa cho <code>%s</code> một thứ không phải chuỗi C hợp lệ là một trong những kiểu sập kinh điển. Truyền một <code>char</code> lẻ (<code>printf("%s", name[0])</code>) là đưa cho <code>printf</code> con số 77 làm địa chỉ; truyền một mảng chưa khởi tạo thì nó đi bộ cho tới khi ngẫu nhiên gặp một số 0. <code>cc -Wall</code> bắt được cái thứ nhất (<em>format specifies type 'char *' but the argument has type 'char'</em>) nhưng không bắt được cái thứ hai.</p>`],

      [11, 'Formatted Output (cont.) — Qualifiers',
        `<p class="y-chinh">🎯 Four qualifiers on <code>%s</code>, and they split into two independent ideas: the number <strong>before</strong> the dot is the field width (padding), the number <strong>after</strong> the dot is the precision (truncation). The minus sign flips the alignment.</p>
<ul>
<li><strong><code>%20s</code></strong> — pad with spaces on the left so the total width is 20: right-justified. If the string is longer than 20, nothing is cut — the width is a <em>minimum</em>, not a maximum.</li>
<li><strong><code>%-20s</code></strong> — same 20 columns, padding on the right: left-justified. This is what you want for a column of names in a table.</li>
<li><strong><code>%20.10s</code></strong> — take only the first 10 characters, then right-justify that in 20 columns. Here the <code>.10</code> <em>is</em> a maximum, so this is the only form that can cut text off.</li>
<li><strong><code>%-20.10s</code></strong> — first 10 characters, left-justified in 20. Combining the two numbers gives a column that is both aligned and never overflows: exactly what a report needs.</li>
<li><strong>Read the console carefully</strong> — lines 1 and 3 start with leading blanks, lines 2 and 4 do not; lines 3 and 4 show <code>My name is</code>, the first 10 characters of <code>My name is Arnold</code> (the 10th character is the space before "Arnold", so the visible text ends at "is").</li>
<li><strong>Same syntax as every other specifier</strong> — you already used <code>%5d</code> and <code>%8.2f</code> in Slot 02–04. Width and precision work the same way for <code>%s</code>; only the <em>meaning</em> of precision changes (decimal places for <code>%f</code>, maximum characters for <code>%s</code>).</li>
</ul>
<p class="nhan">Đo thật — pipes <code>|</code> added so you can count the columns:</p>
<table>
<tr><th>Lệnh</th><th>Kết quả (giữa hai dấu <code>|</code>)</th><th>Số cột</th></tr>
<tr><td><code>printf("|%s|", name)</code></td><td><code>|My name is Arnold|</code></td><td>17</td></tr>
<tr><td><code>printf("|%20s|", name)</code></td><td><code>|&nbsp;&nbsp;&nbsp;My name is Arnold|</code></td><td>20 (3 dấu cách trái)</td></tr>
<tr><td><code>printf("|%-20s|", name)</code></td><td><code>|My name is Arnold&nbsp;&nbsp;&nbsp;|</code></td><td>20 (3 dấu cách phải)</td></tr>
<tr><td><code>printf("|%20.10s|", name)</code></td><td><code>|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;My name is|</code></td><td>20 (10 dấu cách + 10 ký tự)</td></tr>
<tr><td><code>printf("|%-20.10s|", name)</code></td><td><code>|My name is&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|</code></td><td>20</td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    char name[31] = "My name is Arnold";
    printf("|%20s|\\n",     name);
    printf("|%-20s|\\n",    name);
    printf("|%20.10s|\\n",  name);
    printf("|%-20.10s|\\n", name);
    return 0;
}</code></pre>
<p class="dap-an">✅ Compiled with <code>cc -Wall</code> and run, then counted with <code>sed -n 'l'</code> so no space could hide. Every line is exactly 20 columns wide between the pipes, the padding sits on the side the minus sign says, and <code>.10</code> really did cut <em>My name is Arnold</em> down to <em>My name is</em> — the same four lines as the slide's console.</p>
<p class="meo">💡 The width may also be supplied at run time with a star: <code>printf("%-*s", w, name)</code> takes <code>w</code> from an <code>int</code> argument. That is how you build a table whose column width depends on the longest name you actually read.</p>`,
        `<p class="y-chinh">🎯 Bốn bộ chỉnh cho <code>%s</code>, và chúng tách thành hai ý độc lập: số <strong>trước</strong> dấu chấm là độ rộng cột (đệm thêm), số <strong>sau</strong> dấu chấm là độ chính xác (cắt bớt). Dấu trừ thì lật căn lề.</p>
<ul>
<li><strong><code>%20s</code></strong> — đệm dấu cách vào bên trái cho tổng bề rộng bằng 20: căn phải. Nếu chuỗi dài hơn 20 thì không bị cắt gì cả — độ rộng là mức <em>tối thiểu</em>, không phải tối đa.</li>
<li><strong><code>%-20s</code></strong> — vẫn 20 cột, nhưng đệm vào bên phải: căn trái. Đây là thứ bạn cần khi xếp một cột tên trong bảng.</li>
<li><strong><code>%20.10s</code></strong> — lấy đúng 10 ký tự đầu, rồi căn phải phần ấy trong 20 cột. Ở đây <code>.10</code> MỚI là mức tối đa, nên đây là dạng duy nhất có thể cắt cụt chữ.</li>
<li><strong><code>%-20.10s</code></strong> — 10 ký tự đầu, căn trái trong 20 cột. Ghép hai con số lại cho ta một cột vừa thẳng hàng vừa không bao giờ tràn: đúng thứ một bản báo cáo cần.</li>
<li><strong>Đọc kỹ cửa sổ console</strong> — dòng 1 và dòng 3 bắt đầu bằng khoảng trắng, dòng 2 và 4 thì không; dòng 3 và 4 hiện <code>My name is</code>, tức 10 ký tự đầu của <code>My name is Arnold</code> (ký tự thứ 10 là dấu cách trước "Arnold", nên phần chữ nhìn thấy dừng ở "is").</li>
<li><strong>Cú pháp giống hệt mọi specifier khác</strong> — bạn đã dùng <code>%5d</code> và <code>%8.2f</code> ở Slot 02–04 rồi. Độ rộng và độ chính xác làm việc y như thế với <code>%s</code>; chỉ có <em>ý nghĩa</em> của độ chính xác là đổi (số chữ số thập phân với <code>%f</code>, số ký tự tối đa với <code>%s</code>).</li>
</ul>
<p class="nhan">Đo thật — có thêm dấu <code>|</code> để bạn đếm được cột:</p>
<table>
<tr><th>Lệnh</th><th>Kết quả (giữa hai dấu <code>|</code>)</th><th>Số cột</th></tr>
<tr><td><code>printf("|%s|", name)</code></td><td><code>|My name is Arnold|</code></td><td>17</td></tr>
<tr><td><code>printf("|%20s|", name)</code></td><td><code>|&nbsp;&nbsp;&nbsp;My name is Arnold|</code></td><td>20 (3 dấu cách bên trái)</td></tr>
<tr><td><code>printf("|%-20s|", name)</code></td><td><code>|My name is Arnold&nbsp;&nbsp;&nbsp;|</code></td><td>20 (3 dấu cách bên phải)</td></tr>
<tr><td><code>printf("|%20.10s|", name)</code></td><td><code>|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;My name is|</code></td><td>20 (10 dấu cách + 10 ký tự)</td></tr>
<tr><td><code>printf("|%-20.10s|", name)</code></td><td><code>|My name is&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|</code></td><td>20</td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    char name[31] = "My name is Arnold";
    printf("|%20s|\\n",     name);
    printf("|%-20s|\\n",    name);
    printf("|%20.10s|\\n",  name);
    printf("|%-20.10s|\\n", name);
    return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch bằng <code>cc -Wall</code>, chạy, rồi đếm bằng <code>sed -n 'l'</code> để không dấu cách nào trốn được. Mỗi dòng rộng đúng 20 cột giữa hai dấu gạch, phần đệm nằm đúng phía mà dấu trừ chỉ định, và <code>.10</code> thật sự cắt <em>My name is Arnold</em> xuống còn <em>My name is</em> — đúng bốn dòng trên console của slide.</p>
<p class="meo">💡 Độ rộng cũng có thể đưa vào lúc chạy bằng dấu sao: <code>printf("%-*s", w, name)</code> lấy <code>w</code> từ một tham số <code>int</code>. Đó là cách dựng một bảng có bề rộng cột phụ thuộc vào cái tên dài nhất bạn thật sự đọc được.</p>`],

      [12, '4. Output Strings (cont.) — Unformatted Output: puts()',
        `<p class="y-chinh">🎯 The no-frills alternative: <code>int puts(const char *);</code> — one argument, no format string, and it adds a newline for you. Use it when you have nothing to format.</p>
<ul>
<li><strong>The prototype tells you three things</strong> — it takes a <code>const char *</code> (an address, and <code>const</code> promises <code>puts</code> will not modify your string); it returns an <code>int</code>; and there is no <code>...</code>, so it cannot take extra arguments.</li>
<li><strong>The invisible newline</strong> — this is the difference students trip on. <code>puts(name)</code> equals <code>printf("%s\\n", name)</code>, <em>not</em> <code>printf("%s", name)</code>. The slide's console shows <code>My name is Arnold</code> on its own line without any <code>\\n</code> in the source.</li>
<li><strong>Why "unformatted" is a feature</strong> — <code>printf(name)</code> with a user-supplied string is a real security hole: if the text contains <code>%s</code> or <code>%n</code>, <code>printf</code> obeys it and reads memory that was never passed. <code>puts(name)</code> cannot do that, because it has no format language at all.</li>
<li><strong>The return value</strong> — the standard only promises "a non-negative number on success, <code>EOF</code> on failure". It is not specified to be the character count, and implementations differ, so do not build logic on it.</li>
<li><strong>The input twin comes later</strong> — <code>puts</code> pairs with <code>gets</code> on slide 21. One of them is still perfectly fine; the other was removed from the C standard. Guess which.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main(void)
{
    char name[31] = "My name is Arnold";

    int r = puts(name);                  /* tu them '\\n' */
    printf("puts tra ve: %d\\n", r);

    return 0;
}</code></pre>
<p class="dap-an">✅ Compiled and run: <code>My name is Arnold</code> appeared on its own line with no <code>\\n</code> anywhere in the call, and <code>puts</code> returned <strong>10</strong> on this machine (Apple libc). Note that 10 is neither the string length (17) nor 0 — which is exactly why the standard tells you to test only for "negative or not".</p>
<p class="meo">💡 Choosing between them: <code>puts(s)</code> when you print one whole string and want a line break; <code>printf("%s", s)</code> when you must stay on the same line; <code>printf</code> with qualifiers when you need columns. Reaching for <code>printf</code> out of habit for a bare string costs you nothing but a needless format parse.</p>`,
        `<p class="y-chinh">🎯 Lựa chọn không màu mè: <code>int puts(const char *);</code> — một tham số, không chuỗi định dạng, và nó tự thêm ký tự xuống dòng cho bạn. Hãy dùng nó khi chẳng có gì cần định dạng.</p>
<ul>
<li><strong>Nguyên mẫu nói ba điều</strong> — nó nhận <code>const char *</code> (một địa chỉ, và <code>const</code> cam kết <code>puts</code> sẽ không sửa chuỗi của bạn); nó trả về <code>int</code>; và không có <code>...</code>, nên nó không thể nhận thêm tham số nào.</li>
<li><strong>Ký tự xuống dòng vô hình</strong> — đây là chỗ sinh viên hay vấp. <code>puts(name)</code> tương đương <code>printf("%s\\n", name)</code>, CHỨ KHÔNG PHẢI <code>printf("%s", name)</code>. Console trên slide hiện <code>My name is Arnold</code> nằm riêng một dòng mà trong mã nguồn không có <code>\\n</code> nào.</li>
<li><strong>Vì sao "không định dạng" lại là một ưu điểm</strong> — <code>printf(name)</code> với chuỗi do người dùng nhập là một lỗ hổng bảo mật thật: nếu trong chữ có <code>%s</code> hay <code>%n</code>, <code>printf</code> sẽ tuân theo và đọc vùng nhớ chưa bao giờ được truyền vào. <code>puts(name)</code> không làm thế được, vì nó không có ngôn ngữ định dạng nào cả.</li>
<li><strong>Giá trị trả về</strong> — chuẩn chỉ hứa "một số không âm nếu thành công, <code>EOF</code> nếu hỏng". Nó không được quy định là số ký tự, và các bản cài đặt trả về khác nhau, nên đừng xây logic dựa trên nó.</li>
<li><strong>Người anh em bên nhập sẽ tới sau</strong> — <code>puts</code> đi cặp với <code>gets</code> ở slide 21. Một trong hai vẫn hoàn toàn ổn; cái kia thì đã bị xoá khỏi chuẩn C. Đoán xem cái nào.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main(void)
{
    char name[31] = "My name is Arnold";

    int r = puts(name);                  /* tu them '\\n' */
    printf("puts tra ve: %d\\n", r);

    return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch và chạy: <code>My name is Arnold</code> hiện riêng một dòng dù trong lời gọi không có <code>\\n</code> nào, và <code>puts</code> trả về <strong>10</strong> trên máy này (libc của Apple). Để ý 10 không phải độ dài chuỗi (17) cũng không phải 0 — đúng là lý do chuẩn dặn bạn chỉ kiểm tra "âm hay không âm".</p>
<p class="meo">💡 Chọn giữa hai cái: <code>puts(s)</code> khi in trọn một chuỗi và muốn xuống dòng; <code>printf("%s", s)</code> khi cần ở lại trên cùng dòng; <code>printf</code> kèm bộ chỉnh khi cần chia cột. Quen tay gọi <code>printf</code> cho một chuỗi trần thì không sai, chỉ tốn công phân tích chuỗi định dạng một cách vô ích.</p>`],

      [13, '5. Input Strings: Using scanf(…) function',
        `<p class="y-chinh">🎯 The section opens by naming the two specifiers you get for reading strings: <strong><code>%s</code> — whitespace delimited set</strong>, and <strong><code>%[ ]</code> — rule delimited set</strong>. Everything in slides 14 to 20 is one of those two.</p>
<ul>
<li><strong>"delimited set" is the right mental model</strong> — <code>scanf</code> does not read "a string". It reads <em>as many characters as match a rule</em>, and stops at the first one that does not. For <code>%s</code> the rule is "anything that is not whitespace"; for <code>%[…]</code> you write the rule yourself.</li>
<li><strong>"The corresponding argument is the address of the string"</strong> — and this is why the code says <code>scanf("%s", str)</code> with <strong>no <code>&amp;</code></strong>. An array name is already an address. You have been writing <code>&amp;n</code> for <code>int</code> since Slot 02–04 precisely because an <code>int</code> is <em>not</em>.</li>
<li><strong>The comment on the slide spells out the equivalence</strong> — <code>// or &amp;str[0]</code>. Both <code>str</code> and <code>&amp;str[0]</code> are the address of element 0; they are the same value with the same type, so either works.</li>
<li><strong>What the example does</strong> — <code>char str[21];</code> then <code>scanf("%s", str);</code>, then prints the address and the text. Typing <code>Hello</code> makes it print <code>Address of str: 6684160</code> and <code>str = Hello</code>.</li>
<li><strong>The declaration is <code>char str[21]</code>, and the format is bare <code>%s</code></strong> — those two facts together are the bug this whole section will spend slides 16 and 19 fixing. The array can hold 20 characters; the format promises nothing.</li>
</ul>
<p class="nhan">Đo thật — typing <code>Hello</code> then Enter:</p>
<table>
<tr><th>Gõ vào</th><th>Biến <code>str</code> nhận</th><th>Còn lại trong bộ đệm</th></tr>
<tr><td><code>Hello⏎</code></td><td><code>Hello</code> (5 ký tự + <code>\\0</code> ở ô 5)</td><td><code>\\n</code></td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;

int main(void)
{
    char str[21];
    scanf("%20s", str);                       /* 20 ky tu + '\\0' = 21 */
    printf("Address of str: %p (= &amp;str[0] = %p)\\n",
           (void *)str, (void *)&amp;str[0]);
    printf("str = %s\\n", str);
    return 0;
}</code></pre>
<p class="dap-an">✅ Run with the input <code>Hello</code>: <code>Address of str: 0x16f1c63b3 (= &amp;str[0] = 0x16f1c63b3)</code> — the two are byte-for-byte the same number, proving the slide's <code>// or &amp;str[0]</code> comment — and then <code>str = Hello</code>. The newline you pressed is still sitting in the buffer; slide 17 is where that matters.</p>
<p class="pitfall">⚠️ The slide prints the address with <code>printf("Address of str: %u\\n", str)</code>. On a 64-bit compiler that is a genuine bug: <code>cc -Wall</code> answers <em>"format specifies type 'unsigned int' but the argument has type 'char *'"</em> and the number printed is the address chopped down to 32 bits — I measured <code>1868243891</code> for a real address of <code>0x16f1c63b3</code>. Print addresses with <code>%p</code> and a <code>(void *)</code> cast.</p>`,
        `<p class="y-chinh">🎯 Mục này mở đầu bằng cách gọi tên hai specifier bạn có để đọc chuỗi: <strong><code>%s</code> — tập ngắt bởi khoảng trắng</strong>, và <strong><code>%[ ]</code> — tập ngắt theo luật</strong>. Toàn bộ slide 14 đến 20 chỉ là một trong hai thứ đó.</p>
<ul>
<li><strong>"tập ngắt" là mô hình tư duy đúng</strong> — <code>scanf</code> không đọc "một chuỗi". Nó đọc <em>bao nhiêu ký tự còn khớp luật thì đọc</em>, và dừng ở ký tự đầu tiên không khớp. Với <code>%s</code> luật là "mọi thứ không phải khoảng trắng"; với <code>%[…]</code> thì bạn tự viết luật.</li>
<li><strong>"Tham số tương ứng là ĐỊA CHỈ của chuỗi"</strong> — và đó là lý do mã viết <code>scanf("%s", str)</code> mà <strong>KHÔNG có <code>&amp;</code></strong>. Tên mảng vốn đã là một địa chỉ. Bạn viết <code>&amp;n</code> cho <code>int</code> từ Slot 02–04 chính vì một <code>int</code> thì <em>không</em> phải địa chỉ.</li>
<li><strong>Dòng chú thích trên slide nói rõ sự tương đương</strong> — <code>// or &amp;str[0]</code>. Cả <code>str</code> lẫn <code>&amp;str[0]</code> đều là địa chỉ của phần tử 0; chúng cùng giá trị, cùng kiểu, nên viết cách nào cũng chạy.</li>
<li><strong>Ví dụ làm gì</strong> — <code>char str[21];</code> rồi <code>scanf("%s", str);</code>, sau đó in địa chỉ và phần chữ. Gõ <code>Hello</code> thì nó in <code>Address of str: 6684160</code> và <code>str = Hello</code>.</li>
<li><strong>Khai báo là <code>char str[21]</code>, còn định dạng là <code>%s</code> trần</strong> — hai chi tiết ấy đặt cạnh nhau chính là con bọ mà cả mục này sẽ dành slide 16 và 19 để chữa. Mảng chứa được 20 ký tự; còn chuỗi định dạng thì không hứa gì cả.</li>
</ul>
<p class="nhan">Đo thật — gõ <code>Hello</code> rồi Enter:</p>
<table>
<tr><th>Gõ gì</th><th>Biến <code>str</code> nhận gì</th><th>Còn gì trong bộ đệm</th></tr>
<tr><td><code>Hello⏎</code></td><td><code>Hello</code> (5 ký tự + <code>\\0</code> ở ô 5)</td><td><code>\\n</code></td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;

int main(void)
{
    char str[21];
    scanf("%20s", str);                       /* 20 ky tu + '\\0' = 21 */
    printf("Address of str: %p (= &amp;str[0] = %p)\\n",
           (void *)str, (void *)&amp;str[0]);
    printf("str = %s\\n", str);
    return 0;
}</code></pre>
<p class="dap-an">✅ Chạy với dữ liệu vào <code>Hello</code>: <code>Address of str: 0x16f1c63b3 (= &amp;str[0] = 0x16f1c63b3)</code> — hai con số giống nhau từng byte, chứng minh đúng dòng chú thích <code>// or &amp;str[0]</code> của slide — rồi <code>str = Hello</code>. Ký tự xuống dòng bạn vừa bấm vẫn còn nằm trong bộ đệm; tới slide 17 chuyện đó mới thành vấn đề.</p>
<p class="pitfall">⚠️ Slide in địa chỉ bằng <code>printf("Address of str: %u\\n", str)</code>. Trên trình biên dịch 64-bit đó là lỗi thật: <code>cc -Wall</code> trả lời <em>"format specifies type 'unsigned int' but the argument has type 'char *'"</em> và con số in ra là địa chỉ đã bị chặt còn 32 bit — tôi đo được <code>1868243891</code> cho địa chỉ thật là <code>0x16f1c63b3</code>. Hãy in địa chỉ bằng <code>%p</code> kèm ép kiểu <code>(void *)</code>.</p>`],

      [14, 'scanf(…): %s conversion specifier',
        `<p class="y-chinh">🎯 Four bullets that are the complete specification of <code>%s</code>. Learn them as four steps in order, because every <code>%s</code> surprise in this course is one of these four being forgotten.</p>
<ul>
<li><strong>Step 1 — "reads all characters until the first whitespace character"</strong>. Whitespace means space, tab <em>and newline</em>. So <code>%s</code> can never read a sentence: it stops at the first blank.</li>
<li><strong>Step 2 — "stores the characters read in the char array"</strong> at the address you passed. No length check happens at this step, which is where slide 19's crash comes from.</li>
<li><strong>Step 3 — "stores the null terminator after the last character accepted"</strong>. This is why the array must be one longer than the word: <code>%s</code> writes <code>n+1</code> bytes for an <code>n</code>-character word.</li>
<li><strong>Step 4 — "leaves the delimiting whitespace character and any subsequent characters in the input buffer"</strong>. The blank that stopped it is <em>not</em> consumed. Neither is anything after it. They wait for the next read.</li>
<li><strong>Step 4 is the one that causes "my program skipped the input"</strong> — a later <code>scanf("%c")</code> or <code>%[^\\n]</code> immediately finds that leftover whitespace and returns with nothing. The input did not disappear; it was never cleared.</li>
<li><strong>A useful extra <code>%s</code> does silently</strong> — it skips leading whitespace before it starts. So pressing Enter a few times before typing does not break it; the leftovers only hurt the <em>next</em> specifier.</li>
</ul>
<p class="nhan">Đo thật — one <code>scanf("%s", name)</code>, three different inputs:</p>
<table>
<tr><th>Gõ gì</th><th>Biến nhận gì</th><th>Còn gì trong bộ đệm</th></tr>
<tr><td><code>Hello⏎</code></td><td><code>Hello</code></td><td><code>\\n</code></td></tr>
<tr><td><code>My name is Arnold⏎</code></td><td><code>My</code></td><td><code>&nbsp;name is Arnold\\n</code></td></tr>
<tr><td><code>&nbsp;&nbsp;&nbsp;FPT⏎</code></td><td><code>FPT</code></td><td><code>\\n</code> (3 dấu cách đầu bị bỏ qua)</td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;string.h&gt;

int main(void) {
    char name[32];
    int r = scanf("%31s", name);
    printf("scanf tra ve %d | name=[%s] len=%zu\\n", r, name, strlen(name));

    printf("con lai trong bo dem: [");
    int c;
    while ((c = getchar()) != EOF) putchar(c == '\\n' ? '^' : c);
    printf("]\\n");
    return 0;
}</code></pre>
<p class="dap-an">✅ Run with <code>My name is Arnold</code>: <code>scanf tra ve 1 | name=[My] len=2</code> and the leftover buffer printed as <code>[ name is Arnold^]</code> (the <code>^</code> is the newline made visible). Every one of the four bullets is visible in that single line of output: it stopped at the blank, it stored 2 characters plus a terminator, and it left the blank and everything after it behind.</p>
<p class="meo">💡 The return value is worth reading: <code>scanf</code> returns <em>how many items it successfully filled</em>. <code>if (scanf("%31s", name) != 1) { /* khong doc duoc */ }</code> is the difference between a program that notices bad input and one that carries on with an uninitialised array.</p>`,
        `<p class="y-chinh">🎯 Bốn gạch đầu dòng, và chúng là bản đặc tả đầy đủ của <code>%s</code>. Hãy học chúng như bốn bước theo thứ tự, vì mọi bất ngờ với <code>%s</code> trong môn này đều là một trong bốn bước ấy bị quên.</p>
<ul>
<li><strong>Bước 1 — "đọc mọi ký tự cho tới ký tự khoảng trắng đầu tiên"</strong>. Khoảng trắng gồm dấu cách, tab <em>và ký tự xuống dòng</em>. Nên <code>%s</code> không bao giờ đọc được một câu: nó dừng ở khoảng trắng đầu tiên.</li>
<li><strong>Bước 2 — "lưu các ký tự đọc được vào mảng char"</strong> tại địa chỉ bạn truyền. Ở bước này KHÔNG có phép kiểm độ dài nào, và đó là nơi sinh ra cú sập của slide 19.</li>
<li><strong>Bước 3 — "lưu byte kết thúc null ngay sau ký tự cuối cùng nhận được"</strong>. Đây là lý do mảng phải dài hơn từ một ô: <code>%s</code> ghi <code>n+1</code> byte cho một từ <code>n</code> ký tự.</li>
<li><strong>Bước 4 — "để lại ký tự khoảng trắng ngắt và mọi ký tự phía sau trong bộ đệm nhập"</strong>. Cái khoảng trắng làm nó dừng lại thì KHÔNG bị tiêu thụ. Mọi thứ sau nó cũng vậy. Chúng nằm chờ lượt đọc kế tiếp.</li>
<li><strong>Bước 4 chính là thủ phạm của "chương trình bỏ qua chỗ nhập"</strong> — một <code>scanf("%c")</code> hay <code>%[^\\n]</code> sau đó gặp ngay cái khoảng trắng còn sót và trả về tay không. Dữ liệu không biến mất; nó chưa bao giờ được dọn.</li>
<li><strong>Một việc có ích mà <code>%s</code> lặng lẽ làm</strong> — nó bỏ qua khoảng trắng ở ĐẦU trước khi bắt đầu đọc. Nên bấm Enter vài cái trước khi gõ cũng không làm nó hỏng; phần sót chỉ hại cái specifier <em>tiếp theo</em>.</li>
</ul>
<p class="nhan">Đo thật — một lệnh <code>scanf("%s", name)</code>, ba dữ liệu vào khác nhau:</p>
<table>
<tr><th>Gõ gì</th><th>Biến nhận gì</th><th>Còn gì trong bộ đệm</th></tr>
<tr><td><code>Hello⏎</code></td><td><code>Hello</code></td><td><code>\\n</code></td></tr>
<tr><td><code>My name is Arnold⏎</code></td><td><code>My</code></td><td><code>&nbsp;name is Arnold\\n</code></td></tr>
<tr><td><code>&nbsp;&nbsp;&nbsp;FPT⏎</code></td><td><code>FPT</code></td><td><code>\\n</code> (3 dấu cách đầu bị bỏ qua)</td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;string.h&gt;

int main(void) {
    char name[32];
    int r = scanf("%31s", name);
    printf("scanf tra ve %d | name=[%s] len=%zu\\n", r, name, strlen(name));

    printf("con lai trong bo dem: [");
    int c;
    while ((c = getchar()) != EOF) putchar(c == '\\n' ? '^' : c);
    printf("]\\n");
    return 0;
}</code></pre>
<p class="dap-an">✅ Chạy với dữ liệu vào <code>My name is Arnold</code>: <code>scanf tra ve 1 | name=[My] len=2</code> và phần bộ đệm còn lại in ra là <code>[ name is Arnold^]</code> (dấu <code>^</code> là ký tự xuống dòng được hiện ra cho thấy). Cả bốn gạch đầu dòng đều hiện ra trong đúng một dòng kết quả ấy: nó dừng ở dấu cách, nó lưu 2 ký tự kèm byte kết thúc, và nó để lại dấu cách cùng mọi thứ phía sau.</p>
<p class="meo">💡 Giá trị trả về rất đáng đọc: <code>scanf</code> trả về <em>số mục nó điền được thành công</em>. <code>if (scanf("%31s", name) != 1) { /* khong doc duoc */ }</code> là khác biệt giữa một chương trình biết dữ liệu vào hỏng và một chương trình cứ thế chạy tiếp với mảng chưa khởi tạo.</p>`],

      [15, 'scanf(…): %s conversion specifier (cont.) — Example 1',
        `<p class="y-chinh">🎯 The four bullets of slide 14 turned into one measurement. The user types <strong>My name is Arnold</strong>; the program prints back <strong>My</strong>. Two characters out of seventeen.</p>
<ul>
<li><strong>Follow the two arrows on the slide</strong> — the blue one goes from <code>scanf("%s", name)</code> to the line the user typed; the red one goes from <code>printf("%s", name)</code> to the second line of the console, <code>My</code>. Same array, different amount of it.</li>
<li><strong>Why it stopped</strong> — the space after <code>My</code> is whitespace, and whitespace is the delimiter of <code>%s</code>. Slide 14 bullet 1, in action. The slide phrases it as "will stop accepting input after the character 'y'".</li>
<li><strong>Read the memory table</strong> — <code>name[0]='M'</code>, <code>name[1]='y'</code>, <code>name[2]='\\0'</code>, and indices 3 to 31 hold whatever was there before. The array is 32 bytes; 3 of them are now defined.</li>
<li><strong>"The characters ' name is Arnold' remain in the input buffer"</strong> — including the leading space. That is 15 characters plus the newline still queued up, and the program never looks at them.</li>
<li><strong>This is the single most common beginner bug in the chapter</strong> — "I asked for a full name and only got the first word". <code>%s</code> is not broken; it is doing exactly what it is defined to do. The fix is slide 17's <code>%[^\\n]</code>, or <code>fgets</code>.</li>
</ul>
<p class="nhan">Đo thật — the exact bytes of <code>name</code> after <code>scanf("%s", name)</code> on input <code>My name is Arnold</code>:</p>
<table>
<tr><th>Chỉ số</th><th>0</th><th>1</th><th>2</th><th>3 … 31</th></tr>
<tr><th>Ký tự</th><td>M</td><td>y</td><td><strong>\\0</strong></td><td>(rác, không được đọc)</td></tr>
<tr><th>Mã ASCII</th><td>77</td><td>121</td><td><strong>0</strong></td><td>?</td></tr>
</table>
<table>
<tr><th>Gõ gì</th><th>Biến nhận gì</th><th>Còn gì trong bộ đệm</th></tr>
<tr><td><code>My name is Arnold⏎</code></td><td><code>My</code> — <code>strlen</code> = 2</td><td><code>&nbsp;name is Arnold\\n</code> (16 ký tự)</td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;

int main(void)
{
    char name[32];
    scanf("%31s", name);          /* %31s: chan tran cho mang 32 */
    printf("%s", name);
    return 0;
}</code></pre>
<p class="dap-an">✅ Run with <code>My name is Arnold</code>: the program printed <code>My</code> and nothing else — the same two lines as the slide's console. Draining the buffer afterwards gave back <code>[ name is Arnold^]</code>, so the slide's claim about what is left over is exactly right, character for character.</p>
<p class="pitfall">⚠️ The slide writes <code>scanf("%s", name)</code> with no width. With <code>char name[32]</code> that is an unguarded write: type 40 characters and <code>scanf</code> writes 41 bytes into a 32-byte array without a word of complaint. Always give the width, and always make it <strong>one less</strong> than the array size — <code>char name[32]</code> goes with <code>%31s</code>.</p>`,
        `<p class="y-chinh">🎯 Bốn gạch đầu dòng của slide 14 được biến thành một phép đo. Người dùng gõ <strong>My name is Arnold</strong>; chương trình in lại <strong>My</strong>. Hai ký tự trên mười bảy.</p>
<ul>
<li><strong>Đi theo hai mũi tên trên slide</strong> — mũi xanh nối <code>scanf("%s", name)</code> với dòng người dùng gõ; mũi đỏ nối <code>printf("%s", name)</code> với dòng thứ hai của console, <code>My</code>. Cùng một mảng, khác nhau ở phần được dùng.</li>
<li><strong>Vì sao nó dừng</strong> — dấu cách sau <code>My</code> là khoảng trắng, mà khoảng trắng là dấu ngắt của <code>%s</code>. Gạch đầu dòng 1 của slide 14, đang diễn. Slide diễn đạt là "sẽ ngừng nhận dữ liệu sau ký tự 'y'".</li>
<li><strong>Đọc bảng bộ nhớ</strong> — <code>name[0]='M'</code>, <code>name[1]='y'</code>, <code>name[2]='\\0'</code>, còn chỉ số 3 tới 31 giữ nguyên thứ có sẵn từ trước. Mảng 32 byte; hiện chỉ 3 byte là xác định.</li>
<li><strong>"Các ký tự ' name is Arnold' còn lại trong bộ đệm nhập"</strong> — kể cả dấu cách đứng đầu. Tức là 15 ký tự cộng ký tự xuống dòng vẫn đang xếp hàng, và chương trình không hề ngó tới.</li>
<li><strong>Đây là con bọ phổ biến nhất của người mới trong cả chương</strong> — "em bảo nhập họ tên đầy đủ mà chỉ nhận được chữ đầu". <code>%s</code> không hỏng; nó đang làm đúng thứ nó được định nghĩa để làm. Cách chữa là <code>%[^\\n]</code> ở slide 17, hoặc <code>fgets</code>.</li>
</ul>
<p class="nhan">Đo thật — từng byte của <code>name</code> sau <code>scanf("%s", name)</code> với dữ liệu vào <code>My name is Arnold</code>:</p>
<table>
<tr><th>Chỉ số</th><th>0</th><th>1</th><th>2</th><th>3 … 31</th></tr>
<tr><th>Ký tự</th><td>M</td><td>y</td><td><strong>\\0</strong></td><td>(rác, không được đọc)</td></tr>
<tr><th>Mã ASCII</th><td>77</td><td>121</td><td><strong>0</strong></td><td>?</td></tr>
</table>
<table>
<tr><th>Gõ gì</th><th>Biến nhận gì</th><th>Còn gì trong bộ đệm</th></tr>
<tr><td><code>My name is Arnold⏎</code></td><td><code>My</code> — <code>strlen</code> = 2</td><td><code>&nbsp;name is Arnold\\n</code> (16 ký tự)</td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;

int main(void)
{
    char name[32];
    scanf("%31s", name);          /* %31s: chan tran cho mang 32 */
    printf("%s", name);
    return 0;
}</code></pre>
<p class="dap-an">✅ Chạy với <code>My name is Arnold</code>: chương trình in ra <code>My</code> và không gì khác — đúng hai dòng trên console của slide. Vét bộ đệm ngay sau đó thu được <code>[ name is Arnold^]</code>, nên điều slide khẳng định về phần còn sót là hoàn toàn đúng, từng ký tự một.</p>
<p class="pitfall">⚠️ Slide viết <code>scanf("%s", name)</code> không có độ rộng. Với <code>char name[32]</code> thì đó là một lệnh ghi không có rào chắn: gõ 40 ký tự thì <code>scanf</code> ghi 41 byte vào mảng 32 byte mà không nói nửa lời. Hãy luôn ghi độ rộng, và luôn đặt nó <strong>nhỏ hơn một</strong> so với kích thước mảng — <code>char name[32]</code> thì đi với <code>%31s</code>.</p>`],

      [16, 'scanf(…): %s conversion specifier (cont.) — Example 2',
        `<p class="y-chinh">🎯 Same program, one change: <code>scanf("%10s", name)</code>. The width <strong>10</strong> is a hard cap on how many characters <code>%s</code> will accept — the first real defence against buffer overflow in this deck.</p>
<ul>
<li><strong>What the user typed</strong> — <code>Schwartzenegger</code>, 15 characters, one single word with no blank in it. <code>%s</code> would happily take all 15; <code>%10s</code> takes 10 and stops.</li>
<li><strong>What got stored</strong> — the console prints <code>Schwartzen</code> and the memory table shows <code>S c h w a r t z e n</code> in indices 0…9 with the terminator at index <strong>10</strong>. Ten characters plus a terminator is eleven bytes, in an array of 31: safe.</li>
<li><strong>So the arithmetic you must remember</strong> — <code>%Ns</code> writes at most <code>N+1</code> bytes. For <code>char name[31]</code> the largest safe width is <strong>30</strong>. Writing <code>%31s</code> there would be one byte too many.</li>
<li><strong>The width is a maximum, not a minimum</strong> — typing <code>FPT</code> under <code>%10s</code> still stores just <code>FPT</code>. It never pads. This is the mirror image of <code>printf</code>, where the width <em>is</em> a minimum and pads — a symmetry worth noticing so you do not mix them up.</li>
<li><strong>Whitespace still wins over the width</strong> — <code>%10s</code> stops at a blank even if it has only taken 3 characters. Both rules apply; whichever fires first wins.</li>
</ul>
<p class="nhan">Đo thật — <code>char name[31]; scanf("%10s", name);</code>:</p>
<table>
<tr><th>Gõ gì</th><th>Biến nhận gì</th><th>Còn gì trong bộ đệm</th></tr>
<tr><td><code>Schwartzenegger⏎</code></td><td><code>Schwartzen</code> (10 ký tự)</td><td><code>egger\\n</code></td></tr>
<tr><td><code>FPT⏎</code></td><td><code>FPT</code> (3 ký tự, không đệm)</td><td><code>\\n</code></td></tr>
<tr><td><code>My name is Arnold⏎</code></td><td><code>My</code> (dấu cách thắng độ rộng)</td><td><code>&nbsp;name is Arnold\\n</code></td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;string.h&gt;

int main(void)
{
    char name[31];
    scanf("%10s", name);
    printf("name=[%s] len=%zu\\n", name, strlen(name));

    printf("con lai trong bo dem: [");
    int c;
    while ((c = getchar()) != EOF) putchar(c == '\\n' ? '^' : c);
    printf("]\\n");
    return 0;
}</code></pre>
<p class="dap-an">✅ Đáp án — run with <code>Schwartzenegger</code>: <code>name=[Schwartzen] len=10</code>, matching the slide's console and its memory table exactly. <strong>But the leftover buffer measured <code>[egger^]</code>, not what the slide says.</strong> The slide's last line — <em>"The characters ' name is Arnold' remain in the input buffer"</em> — is copied verbatim from slide 15 and does not belong to this example: nobody typed "My name is Arnold" here. What actually remains is <code>egger</code> plus the newline. The slide is wrong on that one line; everything else on it is correct.</p>
<p class="pitfall">⚠️ Note also that the slide's memory table writes the terminator as <code>/0</code> (forward slash) instead of <code>\\0</code> (backslash). That is a typo in the drawing, not a second kind of terminator — in C source the null character is always <code>'\\0'</code> with a backslash.</p>`,
        `<p class="y-chinh">🎯 Vẫn chương trình ấy, đổi một chỗ: <code>scanf("%10s", name)</code>. Con số <strong>10</strong> là trần cứng cho số ký tự mà <code>%s</code> chịu nhận — đây là hàng phòng thủ thật đầu tiên chống tràn bộ đệm trong cả bộ slide.</p>
<ul>
<li><strong>Người dùng gõ gì</strong> — <code>Schwartzenegger</code>, 15 ký tự, một từ duy nhất không có dấu cách nào bên trong. <code>%s</code> sẽ vui vẻ lấy cả 15; <code>%10s</code> lấy 10 rồi dừng.</li>
<li><strong>Cái gì được lưu</strong> — console in <code>Schwartzen</code> và bảng bộ nhớ hiện <code>S c h w a r t z e n</code> ở chỉ số 0…9 với byte kết thúc ở chỉ số <strong>10</strong>. Mười ký tự cộng byte kết thúc là mười một byte, trong mảng 31: an toàn.</li>
<li><strong>Vậy phép tính phải nhớ là</strong> — <code>%Ns</code> ghi nhiều nhất <code>N+1</code> byte. Với <code>char name[31]</code> thì độ rộng an toàn lớn nhất là <strong>30</strong>. Viết <code>%31s</code> ở đó là thừa đúng một byte.</li>
<li><strong>Độ rộng là mức tối đa, không phải tối thiểu</strong> — gõ <code>FPT</code> dưới <code>%10s</code> thì vẫn chỉ lưu <code>FPT</code>. Nó không bao giờ đệm thêm. Đây là ảnh phản chiếu của <code>printf</code>, nơi độ rộng LẠI là mức tối thiểu và có đệm — một sự đối xứng đáng để ý để khỏi lẫn.</li>
<li><strong>Khoảng trắng vẫn thắng độ rộng</strong> — <code>%10s</code> dừng ở dấu cách ngay cả khi mới lấy được 3 ký tự. Cả hai luật cùng hiệu lực; luật nào kích hoạt trước thì luật ấy thắng.</li>
</ul>
<p class="nhan">Đo thật — <code>char name[31]; scanf("%10s", name);</code>:</p>
<table>
<tr><th>Gõ gì</th><th>Biến nhận gì</th><th>Còn gì trong bộ đệm</th></tr>
<tr><td><code>Schwartzenegger⏎</code></td><td><code>Schwartzen</code> (10 ký tự)</td><td><code>egger\\n</code></td></tr>
<tr><td><code>FPT⏎</code></td><td><code>FPT</code> (3 ký tự, không đệm)</td><td><code>\\n</code></td></tr>
<tr><td><code>My name is Arnold⏎</code></td><td><code>My</code> (dấu cách thắng độ rộng)</td><td><code>&nbsp;name is Arnold\\n</code></td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;string.h&gt;

int main(void)
{
    char name[31];
    scanf("%10s", name);
    printf("name=[%s] len=%zu\\n", name, strlen(name));

    printf("con lai trong bo dem: [");
    int c;
    while ((c = getchar()) != EOF) putchar(c == '\\n' ? '^' : c);
    printf("]\\n");
    return 0;
}</code></pre>
<p class="dap-an">✅ Đáp án — chạy với <code>Schwartzenegger</code>: <code>name=[Schwartzen] len=10</code>, khớp đúng console và bảng bộ nhớ của slide. <strong>Nhưng phần bộ đệm còn lại đo được là <code>[egger^]</code>, KHÔNG phải thứ slide ghi.</strong> Dòng cuối của slide — <em>"The characters ' name is Arnold' remain in the input buffer"</em> — là câu chép nguyên từ slide 15 và không thuộc về ví dụ này: ở đây có ai gõ "My name is Arnold" đâu. Thứ thật sự còn lại là <code>egger</code> cộng ký tự xuống dòng. Slide sai ở đúng dòng đó; mọi phần còn lại của nó đều đúng.</p>
<p class="pitfall">⚠️ Cũng để ý bảng bộ nhớ trên slide viết byte kết thúc là <code>/0</code> (gạch xuôi) thay vì <code>\\0</code> (gạch ngược). Đó là lỗi gõ trong hình vẽ, không phải một loại byte kết thúc thứ hai — trong mã nguồn C, ký tự null luôn là <code>'\\0'</code> với gạch ngược.</p>`],

      [17, 'scanf(…): %[^\\n] conversion specifier',
        `<p class="y-chinh">🎯 The answer to the question at the top of the slide: <em>"How to accept blanks in an input string?"</em> — change the delimiter. <code>%[^\\n]</code> means "accept every character <strong>except</strong> newline", so spaces are no longer a stopping point.</p>
<ul>
<li><strong>How to read the notation</strong> — <code>%[…]</code> is a <em>scanset</em>: the characters listed inside the brackets are the ones accepted. A leading <code>^</code> inverts it into "everything except these". So <code>%[^\\n]</code> = "everything except the newline".</li>
<li><strong>The four bullets mirror slide 14 exactly</strong> — reads until the delimiter, stores what it read, appends the null byte, and <em>leaves the delimiter in the buffer</em>. Only the delimiter changed; the machinery is identical.</li>
<li><strong>Bullet 4 is now much more dangerous than it was for <code>%s</code></strong> — the leftover character is the <code>'\\n'</code>, and <code>%[^\\n]</code> refuses to read a newline. So a second <code>%[^\\n]</code> in a row finds the newline immediately, matches nothing, and returns <strong>0</strong> without touching your variable.</li>
<li><strong>That is the "my second input was skipped" bug</strong>, and it is not rare — it happens every time you read two lines in a row. The fix is to consume the newline yourself before the next read.</li>
<li><strong>Two ways to clean the buffer</strong> — <code>while (getchar() != '\\n');</code> (simple, but loops forever on end-of-file), or put a space and a <code>%*c</code> in the next format. A third and cleaner option is not to use <code>scanf</code> for lines at all: <code>fgets</code> consumes the newline as part of the read.</li>
<li><strong><code>%[^\\n]</code> does <em>not</em> skip leading whitespace</strong>, unlike <code>%s</code>. This is the reason the leftover newline hits it so hard: <code>%s</code> would have jumped over it silently.</li>
</ul>
<p class="nhan">Đo thật — two reads in a row, with and without cleaning the buffer:</p>
<table>
<tr><th>Chương trình</th><th>Gõ gì</th><th>Biến nhận gì</th><th>Còn gì trong bộ đệm</th></tr>
<tr><td>một lần <code>%[^\\n]</code></td><td><code>My name is Arnold⏎</code></td><td><code>My name is Arnold</code> (17)</td><td><code>\\n</code></td></tr>
<tr><td>hai lần <code>%[^\\n]</code>, KHÔNG dọn</td><td><code>dong mot⏎dong hai⏎</code></td><td>a = <code>dong mot</code>; b = <strong>không đổi</strong>, scanf trả về <strong>0</strong></td><td><code>\\ndong hai\\n</code></td></tr>
<tr><td>hai lần, CÓ <code>while (getchar() != '\\n');</code></td><td><code>dong mot⏎dong hai⏎</code></td><td>a = <code>dong mot</code>; b = <code>dong hai</code></td><td><code>\\n</code></td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    char a[31], b[31];

    scanf("%30[^\\n]", a);
    while (getchar() != '\\n') { }      /* DON bo dem: an ky tu '\\n' */
    scanf("%30[^\\n]", b);

    printf("a=[%s]\\nb=[%s]\\n", a, b);
    return 0;
}</code></pre>
<p class="dap-an">✅ Measured for real with the input <code>dong mot</code> / <code>dong hai</code>. Without the cleaning line: <code>r1=1 a=[dong mot]</code> then <code>r2=0 b=[(chua ghi)]</code> — the second variable kept the value it had before the call, and <code>scanf</code> honestly reported 0 items filled. With the cleaning line: <code>a=[dong mot]</code> and <code>b=[dong hai]</code>. One line of code, the whole difference.</p>
<p class="pitfall">⚠️ Always give a width here too: <code>%[^\\n]</code> with no number will read a line of any length into your array. <code>char a[31]</code> goes with <code>%30[^\\n]</code>. The slide's examples omit it, which is fine for a lecture and fatal in a program.</p>`,
        `<p class="y-chinh">🎯 Câu trả lời cho câu hỏi ở đầu slide: <em>"Làm sao nhận được dấu cách trong chuỗi nhập?"</em> — đổi dấu ngắt. <code>%[^\\n]</code> nghĩa là "nhận mọi ký tự <strong>trừ</strong> ký tự xuống dòng", nên dấu cách không còn là chỗ dừng nữa.</p>
<ul>
<li><strong>Đọc ký hiệu này thế nào</strong> — <code>%[…]</code> là một <em>tập ký tự</em> (scanset): những ký tự liệt kê trong ngoặc vuông là những ký tự được chấp nhận. Dấu <code>^</code> đứng đầu thì lật ngược thành "mọi thứ trừ những cái này". Vậy <code>%[^\\n]</code> = "mọi thứ trừ ký tự xuống dòng".</li>
<li><strong>Bốn gạch đầu dòng lặp lại y hệt slide 14</strong> — đọc tới dấu ngắt, lưu thứ đọc được, thêm byte null, và <em>để lại dấu ngắt trong bộ đệm</em>. Chỉ dấu ngắt là đổi; bộ máy thì y nguyên.</li>
<li><strong>Gạch thứ 4 bây giờ nguy hiểm hơn hẳn so với <code>%s</code></strong> — ký tự còn sót chính là <code>'\\n'</code>, mà <code>%[^\\n]</code> thì từ chối đọc ký tự xuống dòng. Nên một lệnh <code>%[^\\n]</code> thứ hai liền sau sẽ gặp ngay ký tự xuống dòng, khớp được đúng 0 ký tự, và trả về <strong>0</strong> mà không chạm vào biến của bạn.</li>
<li><strong>Đó chính là con bọ "lần nhập thứ hai bị bỏ qua"</strong>, và nó không hiếm — nó xảy ra mỗi lần bạn đọc hai dòng liên tiếp. Cách chữa là tự tiêu thụ ký tự xuống dòng trước lượt đọc kế.</li>
<li><strong>Hai cách dọn bộ đệm</strong> — <code>while (getchar() != '\\n');</code> (đơn giản, nhưng lặp vô tận khi hết dữ liệu), hoặc đặt một dấu cách và <code>%*c</code> vào chuỗi định dạng kế tiếp. Cách thứ ba và sạch hơn là đừng dùng <code>scanf</code> để đọc dòng: <code>fgets</code> tiêu thụ luôn ký tự xuống dòng như một phần của lượt đọc.</li>
<li><strong><code>%[^\\n]</code> KHÔNG bỏ qua khoảng trắng ở đầu</strong>, khác với <code>%s</code>. Đó là lý do ký tự xuống dòng còn sót đánh nó đau đến thế: <code>%s</code> hẳn đã lặng lẽ nhảy qua.</li>
</ul>
<p class="nhan">Đo thật — hai lượt đọc liên tiếp, có và không dọn bộ đệm:</p>
<table>
<tr><th>Chương trình</th><th>Gõ gì</th><th>Biến nhận gì</th><th>Còn gì trong bộ đệm</th></tr>
<tr><td>một lần <code>%[^\\n]</code></td><td><code>My name is Arnold⏎</code></td><td><code>My name is Arnold</code> (17)</td><td><code>\\n</code></td></tr>
<tr><td>hai lần <code>%[^\\n]</code>, KHÔNG dọn</td><td><code>dong mot⏎dong hai⏎</code></td><td>a = <code>dong mot</code>; b = <strong>không đổi</strong>, scanf trả về <strong>0</strong></td><td><code>\\ndong hai\\n</code></td></tr>
<tr><td>hai lần, CÓ <code>while (getchar() != '\\n');</code></td><td><code>dong mot⏎dong hai⏎</code></td><td>a = <code>dong mot</code>; b = <code>dong hai</code></td><td><code>\\n</code></td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    char a[31], b[31];

    scanf("%30[^\\n]", a);
    while (getchar() != '\\n') { }      /* DON bo dem: an ky tu '\\n' */
    scanf("%30[^\\n]", b);

    printf("a=[%s]\\nb=[%s]\\n", a, b);
    return 0;
}</code></pre>
<p class="dap-an">✅ Đã đo thật với dữ liệu vào <code>dong mot</code> / <code>dong hai</code>. Không có dòng dọn bộ đệm: <code>r1=1 a=[dong mot]</code> rồi <code>r2=0 b=[(chua ghi)]</code> — biến thứ hai giữ nguyên giá trị nó có từ trước lời gọi, và <code>scanf</code> báo thật thà rằng nó điền được 0 mục. Có dòng dọn: <code>a=[dong mot]</code> và <code>b=[dong hai]</code>. Một dòng mã, khác biệt cả bài.</p>
<p class="pitfall">⚠️ Ở đây cũng phải ghi độ rộng: <code>%[^\\n]</code> không kèm số sẽ đọc một dòng dài bao nhiêu cũng vào mảng của bạn. <code>char a[31]</code> thì đi với <code>%30[^\\n]</code>. Các ví dụ trên slide bỏ qua chi tiết này — chấp nhận được trong bài giảng, nhưng chí mạng trong một chương trình.</p>`],

      [18, '%[^\\n] conversion specifier: Example',
        `<p class="y-chinh">🎯 Two memory tables side by side that make the width rule visible: the same input <strong>My name is Arnold</strong> read once with <code>%[^\\n]</code> and once with <code>%10[^\\n]</code>. The first keeps everything; the second keeps ten characters.</p>
<ul>
<li><strong>Example 1 — <code>scanf("%[^\\n]", name)</code></strong> — the table fills indices 0 to 16 with <code>M y (space) n a m e (space) i s (space) A r n o l d</code> and puts the red <code>\\0</code> at index <strong>17</strong>. Compare with slide 15, where the same input under <code>%s</code> gave only <code>My</code>: the three spaces are now inside the string instead of stopping it.</li>
<li><strong>Example 2 — <code>scanf("%10[^\\n]", name)</code></strong> — indices 0 to 9 hold <code>My name is</code> and the terminator lands at index <strong>10</strong>. Character 10 of the input is the space before "Arnold", which is why the text you see ends at "is".</li>
<li><strong>The two rules stack</strong> — the scanset says <em>which</em> characters are acceptable, the width says <em>how many</em>. Reading stops at whichever limit is reached first: here the newline never arrives, so the width decides.</li>
<li><strong>Both tables show 31 columns</strong> — 0 to 30, i.e. <code>char name[31]</code>. Example 1 uses 18 of them and Example 2 uses 11. The rest is untouched, which is exactly what a correctly sized array should look like.</li>
<li><strong>What is <em>not</em> drawn on this slide</strong> — the input buffer. After Example 1 it still holds the newline; after Example 2 it holds <code>" Arnold"</code> and the newline. That invisible remainder is what bites the next read.</li>
</ul>
<p class="nhan">Đo thật — the same input line, two formats:</p>
<table>
<tr><th>Định dạng</th><th>Gõ gì</th><th>Biến nhận gì</th><th><code>\\0</code> ở ô</th><th>Còn gì trong bộ đệm</th></tr>
<tr><td><code>%[^\\n]</code></td><td><code>My name is Arnold⏎</code></td><td><code>My name is Arnold</code> (17 ký tự)</td><td>17</td><td><code>\\n</code></td></tr>
<tr><td><code>%10[^\\n]</code></td><td><code>My name is Arnold⏎</code></td><td><code>My name is</code> (10 ký tự)</td><td>10</td><td><code>&nbsp;Arnold\\n</code></td></tr>
<tr><td><code>%s</code> (so sánh, slide 15)</td><td><code>My name is Arnold⏎</code></td><td><code>My</code> (2 ký tự)</td><td>2</td><td><code>&nbsp;name is Arnold\\n</code></td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;string.h&gt;

int main(void)
{
    char name[31];

    scanf("%30[^\\n]", name);          /* Example 1, co chan tran */
    printf("name=[%s] len=%zu, name[%zu]=%d\\n",
           name, strlen(name), strlen(name), name[strlen(name)]);

    printf("con lai: [");
    int c;
    while ((c = getchar()) != EOF) putchar(c == '\\n' ? '^' : c);
    printf("]\\n");
    return 0;
}</code></pre>
<p class="dap-an">✅ Measured with the input <code>My name is Arnold</code>. Example 1: <code>name=[My name is Arnold] len=17</code> and <code>name[17]=0</code> — the terminator is at index 17, exactly where the slide's red <code>\\0</code> is drawn, and the buffer afterwards held only <code>[^]</code> (the newline). Example 2 with <code>%10[^\\n]</code>: <code>name=[My name is] len=10</code>, <code>name[10]=0</code>, and the buffer held <code>[ Arnold^]</code>. Both tables on the slide are correct, byte for byte.</p>
<p class="meo">💡 One sentence that separates the three specifiers you now know: <em><code>%s</code> stops at any whitespace, <code>%[^\\n]</code> stops only at the newline, and a width stops both early.</em> Pick by what should end the input, not by habit.</p>`,
        `<p class="y-chinh">🎯 Hai bảng bộ nhớ đặt cạnh nhau làm cho quy tắc độ rộng hiện ra: cùng một dữ liệu vào <strong>My name is Arnold</strong>, đọc một lần bằng <code>%[^\\n]</code> và một lần bằng <code>%10[^\\n]</code>. Cái đầu giữ tất cả; cái sau giữ mười ký tự.</p>
<ul>
<li><strong>Example 1 — <code>scanf("%[^\\n]", name)</code></strong> — bảng điền chỉ số 0 tới 16 bằng <code>M y (cách) n a m e (cách) i s (cách) A r n o l d</code> và đặt dấu <code>\\0</code> đỏ ở ô <strong>17</strong>. So với slide 15, nơi cùng dữ liệu vào ấy dưới <code>%s</code> chỉ cho ra <code>My</code>: ba dấu cách bây giờ nằm TRONG chuỗi thay vì làm nó dừng lại.</li>
<li><strong>Example 2 — <code>scanf("%10[^\\n]", name)</code></strong> — chỉ số 0 tới 9 giữ <code>My name is</code> và byte kết thúc rơi vào ô <strong>10</strong>. Ký tự thứ 10 của dữ liệu vào là dấu cách trước "Arnold", nên phần chữ bạn nhìn thấy dừng ở "is".</li>
<li><strong>Hai luật chồng lên nhau</strong> — tập ký tự nói <em>những ký tự nào</em> được nhận, độ rộng nói <em>bao nhiêu ký tự</em>. Việc đọc dừng ở giới hạn nào tới trước: ở đây ký tự xuống dòng chẳng bao giờ tới, nên độ rộng quyết định.</li>
<li><strong>Cả hai bảng đều có 31 cột</strong> — 0 tới 30, tức <code>char name[31]</code>. Example 1 dùng 18 ô, Example 2 dùng 11 ô. Phần còn lại không bị đụng tới, và đó đúng là dáng vẻ của một mảng có kích thước đúng.</li>
<li><strong>Thứ slide này KHÔNG vẽ</strong> — bộ đệm nhập. Sau Example 1 nó vẫn còn ký tự xuống dòng; sau Example 2 nó còn <code>" Arnold"</code> và ký tự xuống dòng. Chính phần dư vô hình ấy là thứ cắn vào lượt đọc kế tiếp.</li>
</ul>
<p class="nhan">Đo thật — cùng một dòng nhập, hai định dạng:</p>
<table>
<tr><th>Định dạng</th><th>Gõ gì</th><th>Biến nhận gì</th><th><code>\\0</code> ở ô</th><th>Còn gì trong bộ đệm</th></tr>
<tr><td><code>%[^\\n]</code></td><td><code>My name is Arnold⏎</code></td><td><code>My name is Arnold</code> (17 ký tự)</td><td>17</td><td><code>\\n</code></td></tr>
<tr><td><code>%10[^\\n]</code></td><td><code>My name is Arnold⏎</code></td><td><code>My name is</code> (10 ký tự)</td><td>10</td><td><code>&nbsp;Arnold\\n</code></td></tr>
<tr><td><code>%s</code> (so sánh, slide 15)</td><td><code>My name is Arnold⏎</code></td><td><code>My</code> (2 ký tự)</td><td>2</td><td><code>&nbsp;name is Arnold\\n</code></td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;string.h&gt;

int main(void)
{
    char name[31];

    scanf("%30[^\\n]", name);          /* Example 1, co chan tran */
    printf("name=[%s] len=%zu, name[%zu]=%d\\n",
           name, strlen(name), strlen(name), name[strlen(name)]);

    printf("con lai: [");
    int c;
    while ((c = getchar()) != EOF) putchar(c == '\\n' ? '^' : c);
    printf("]\\n");
    return 0;
}</code></pre>
<p class="dap-an">✅ Đo với dữ liệu vào <code>My name is Arnold</code>. Example 1: <code>name=[My name is Arnold] len=17</code> và <code>name[17]=0</code> — byte kết thúc ở chỉ số 17, đúng chỗ slide vẽ dấu <code>\\0</code> đỏ, và bộ đệm sau đó chỉ còn <code>[^]</code> (ký tự xuống dòng). Example 2 với <code>%10[^\\n]</code>: <code>name=[My name is] len=10</code>, <code>name[10]=0</code>, và bộ đệm còn <code>[ Arnold^]</code>. Cả hai bảng trên slide đều đúng, từng byte một.</p>
<p class="meo">💡 Một câu để phân biệt ba specifier bạn vừa biết: <em><code>%s</code> dừng ở mọi khoảng trắng, <code>%[^\\n]</code> chỉ dừng ở ký tự xuống dòng, còn độ rộng thì làm cả hai dừng sớm.</em> Hãy chọn theo thứ cần kết thúc dữ liệu vào, đừng chọn theo thói quen.</p>`],

      [19, 'Exercise 1: Input Strings',
        `<p class="y-chinh">🎯 <em>"Compile &amp; Run program. Explain the results of two test cases."</em> The program declares <code>int m = 10, n = 20;</code> and <code>char s[11] = "Hello";</code>, prints all three, reads with <code>scanf("%s", s)</code>, and prints all three again. Test case 1 looks fine; test case 2 destroys <code>m</code> and <code>n</code>. The red bubble asks <strong>Why?</strong></p>
<ul>
<li><strong>Test case 1 — the user types <code>FPT Uni</code></strong>. Output: <code>m=10, n=20, str=FPT</code>. Two things happened: <code>%s</code> stopped at the blank so only <code>FPT</code> was stored (slide 14 bullet 1), and <code>m</code> and <code>n</code> are untouched because 3 characters plus a terminator fit easily in <code>s[11]</code>.</li>
<li><strong>Test case 2 — the user types <code>abcdefghijklmnopq#123456</code></strong>, 24 characters and no blank anywhere. Output on the slide: <code>m=824406384, n=1869507948, str=abcdefghijklmnopq#123456</code>. Two integers the program never assigned have changed.</li>
<li><strong>The answer to "Why?"</strong> — <code>scanf("%s", s)</code> has no width, so it wrote all 25 bytes (24 + terminator) starting at <code>s</code>. The array is only 11 bytes. Bytes 12 onward landed on whatever the compiler had put next to <code>s</code> on the stack — which, in the Dev-C++ build on the slide, was <code>n</code> and then <code>m</code>.</li>
<li><strong>The two numbers are not random — I decoded them</strong>. 1869507948 in hexadecimal is <code>0x6F6E6D6C</code>, which little-endian is the bytes <code>'l' 'm' 'n' 'o'</code>. And 824406384 is <code>0x31237170</code> = <code>'p' 'q' '#' '1'</code>. Those are letters 12–15 and 16–19 of what was typed. The "garbage" in <code>m</code> and <code>n</code> is literally the overflow of the string, reinterpreted as integers.</li>
<li><strong>"Replace and Re-run: <code>scanf("%s", S)</code> → <code>scanf("%10[^\\n]", S)</code>"</strong> — the exercise's own fix, and it repairs both faults at once: <code>10</code> caps the write at 11 bytes so nothing overflows, and <code>[^\\n]</code> lets blanks through so <code>FPT Uni</code> arrives whole.</li>
<li><strong>Why the width must be 10 and not 11</strong> — <code>char s[11]</code> holds 10 characters plus the terminator. <code>%11[^\\n]</code> would write 12 bytes. The exercise chose the number carefully.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main(void)
{
    int m = 10, n = 20;
    char s[11] = "Hello";

    printf("m=%d, n=%d, str=%s\\n", m, n, s);
    scanf("%10[^\\n]", s);                  /* ban DA SUA theo de bai */
    printf("m=%d, n=%d, str=%s\\n", m, n, s);

    return 0;
}</code></pre>
<p class="dap-an">✅ Đáp án — all four runs compiled with <code>cc -Wall</code> and executed. <strong>Original code, test case 1</strong> (<code>FPT Uni</code>): <code>m=10, n=20, str=FPT</code> — matches the slide. <strong>Original code, test case 2</strong> (<code>abcdefghijklmnopq#123456</code>): on my 64-bit machine it did not print corrupted numbers, it <strong>aborted with exit code 134</strong> — the compiler's stack-protector caught the overflow before <code>main</code> could return (I measured the layout: here <code>m</code> and <code>n</code> sit 8 and 12 bytes <em>below</em> <code>s</code>, so the overflow ran into the guard instead of into them). <strong>After the replacement</strong>: test case 1 gives <code>m=10, n=20, str=FPT Uni</code> (the whole line, blank included) and test case 2 gives <code>m=10, n=20, str=abcdefghij</code> — truncated to 10 characters, nothing corrupted, no crash. The exercise's fix works on both.</p>
<p class="pitfall">⚠️ Do not conclude "it is fine on my machine" from that abort. Undefined behaviour is allowed to look like anything: a wrong number on the slide's compiler, a crash on mine, and — worst of all — a program that appears to work for months. The corruption is real either way; only the symptom changed. The fix is the width, not the compiler.</p>`,
        `<p class="y-chinh">🎯 <em>"Biên dịch &amp; chạy chương trình. Giải thích kết quả của hai trường hợp thử."</em> Chương trình khai <code>int m = 10, n = 20;</code> và <code>char s[11] = "Hello";</code>, in cả ba, đọc bằng <code>scanf("%s", s)</code>, rồi in lại cả ba. Trường hợp 1 nhìn ổn; trường hợp 2 phá huỷ <code>m</code> và <code>n</code>. Bong bóng đỏ hỏi <strong>Why?</strong></p>
<ul>
<li><strong>Trường hợp 1 — người dùng gõ <code>FPT Uni</code></strong>. Kết quả: <code>m=10, n=20, str=FPT</code>. Hai chuyện đã xảy ra: <code>%s</code> dừng ở dấu cách nên chỉ lưu <code>FPT</code> (gạch 1 của slide 14), và <code>m</code> với <code>n</code> nguyên vẹn vì 3 ký tự cộng byte kết thúc thừa chỗ trong <code>s[11]</code>.</li>
<li><strong>Trường hợp 2 — người dùng gõ <code>abcdefghijklmnopq#123456</code></strong>, 24 ký tự và không có dấu cách nào. Kết quả trên slide: <code>m=824406384, n=1869507948, str=abcdefghijklmnopq#123456</code>. Hai số nguyên mà chương trình chưa hề gán lại đã đổi giá trị.</li>
<li><strong>Trả lời cho câu "Why?"</strong> — <code>scanf("%s", s)</code> không có độ rộng, nên nó ghi trọn 25 byte (24 + byte kết thúc) bắt đầu từ <code>s</code>. Mảng chỉ có 11 byte. Byte thứ 12 trở đi rơi vào bất cứ thứ gì trình biên dịch đã xếp cạnh <code>s</code> trên stack — mà ở bản dựng Dev-C++ của slide thì đó là <code>n</code> rồi tới <code>m</code>.</li>
<li><strong>Hai con số ấy không hề ngẫu nhiên — tôi đã giải mã</strong>. 1869507948 trong hệ 16 là <code>0x6F6E6D6C</code>, đọc theo little-endian là các byte <code>'l' 'm' 'n' 'o'</code>. Còn 824406384 là <code>0x31237170</code> = <code>'p' 'q' '#' '1'</code>. Đó đúng là ký tự thứ 12–15 và 16–19 của thứ vừa gõ. Cái "rác" trong <code>m</code> và <code>n</code> chính là phần tràn của chuỗi, được đọc lại dưới dạng số nguyên.</li>
<li><strong>"Thay và chạy lại: <code>scanf("%s", S)</code> → <code>scanf("%10[^\\n]", S)</code>"</strong> — cách sửa do chính đề bài đưa ra, và nó chữa cả hai lỗi cùng lúc: số <code>10</code> chặn lệnh ghi ở 11 byte nên không tràn được, còn <code>[^\\n]</code> cho dấu cách đi qua nên <code>FPT Uni</code> vào trọn vẹn.</li>
<li><strong>Vì sao độ rộng phải là 10 chứ không phải 11</strong> — <code>char s[11]</code> chứa 10 ký tự cộng byte kết thúc. <code>%11[^\\n]</code> sẽ ghi 12 byte. Đề bài đã chọn con số ấy rất cẩn thận.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main(void)
{
    int m = 10, n = 20;
    char s[11] = "Hello";

    printf("m=%d, n=%d, str=%s\\n", m, n, s);
    scanf("%10[^\\n]", s);                  /* ban DA SUA theo de bai */
    printf("m=%d, n=%d, str=%s\\n", m, n, s);

    return 0;
}</code></pre>
<p class="dap-an">✅ Đáp án — cả bốn lượt đều đã biên dịch bằng <code>cc -Wall</code> và chạy thật. <strong>Mã gốc, trường hợp 1</strong> (<code>FPT Uni</code>): <code>m=10, n=20, str=FPT</code> — khớp slide. <strong>Mã gốc, trường hợp 2</strong> (<code>abcdefghijklmnopq#123456</code>): trên máy 64-bit của tôi nó KHÔNG in ra số hỏng, mà <strong>dừng đột ngột với mã thoát 134</strong> — chốt bảo vệ stack của trình biên dịch bắt được vụ tràn trước khi <code>main</code> kịp trả về (tôi đã đo cách xếp chỗ: ở đây <code>m</code> và <code>n</code> nằm <em>dưới</em> <code>s</code> 8 và 12 byte, nên phần tràn đâm vào chốt bảo vệ chứ không đâm vào chúng). <strong>Sau khi thay theo đề</strong>: trường hợp 1 cho <code>m=10, n=20, str=FPT Uni</code> (cả dòng, kể cả dấu cách) và trường hợp 2 cho <code>m=10, n=20, str=abcdefghij</code> — cắt còn 10 ký tự, không gì bị hỏng, không sập. Cách sửa của đề bài đúng cho cả hai.</p>
<p class="pitfall">⚠️ Đừng từ cú abort ấy mà kết luận "máy em chạy vẫn ổn". Hành vi không xác định được phép trông như bất cứ thứ gì: ra số sai trên trình biên dịch của slide, sập trên máy tôi, và — tệ nhất — là một chương trình trông như chạy tốt suốt mấy tháng. Sự hỏng hóc có thật trong cả ba trường hợp; chỉ triệu chứng là đổi. Thứ chữa được nó là độ rộng, không phải trình biên dịch.</p>`],

      [20, 'scanf(…) - cont. — character set specifiers',
        `<p class="y-chinh">🎯 The general form behind <code>%[^\\n]</code>. A scanset is a small pattern language: list the characters you accept, put <code>^</code> in front to invert, use <code>-</code> for a range. Six worked examples on the slide.</p>
<ul>
<li><strong><code>%[abcd]</code></strong> — accept only a, b, c or d; stop at the first character that is not one of them.</li>
<li><strong><code>%[^abcd]</code></strong> — the inverted form: accept everything <em>except</em> those four. <code>%[^\\n]</code> from slide 17 is exactly this shape with a one-character set.</li>
<li><strong><code>%[0-9]</code></strong> — the dash makes a range: all decimal digits. This is how you read a number as text without <code>atoi</code>.</li>
<li><strong><code>%[A-Z]</code></strong> — all uppercase letters. Note it does not accept lowercase; ranges follow ASCII order, and 'A'…'Z' is 65…90 while 'a'…'z' is 97…122.</li>
<li><strong><code>%[0-9A-Za-z]</code></strong> — three ranges in one set: digits and both cases of letters. This is the practical "read one identifier" pattern.</li>
<li><strong><code>%[A-FT-Z]</code></strong> — two non-adjacent ranges, A to F and T to Z. Ranges simply concatenate; there is no comma and no "or".</li>
<li><strong>Every scanset shares the same four-step behaviour</strong> as <code>%s</code> and <code>%[^\\n]</code>: read while matching, store, append <code>'\\0'</code>, leave the first non-matching character in the buffer. And like them, it accepts a width.</li>
</ul>
<p class="nhan">Đo thật — one program, four scansets in a row, input <code>2026FPTuni,abcdxyz</code>:</p>
<table>
<tr><th>Bước</th><th>Định dạng</th><th>Biến nhận gì</th><th>Còn lại trong bộ đệm</th></tr>
<tr><td>1</td><td><code>%[0-9]</code></td><td><code>2026</code></td><td><code>FPTuni,abcdxyz\\n</code></td></tr>
<tr><td>2</td><td><code>%[A-Z]</code></td><td><code>FPT</code></td><td><code>uni,abcdxyz\\n</code></td></tr>
<tr><td>3</td><td><code>%[^,]</code></td><td><code>uni</code></td><td><code>,abcdxyz\\n</code></td></tr>
<tr><td>4</td><td><code>%[abcd]</code> (sau khi ăn dấu phẩy)</td><td><code>abcd</code></td><td><code>xyz\\n</code></td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    char a[40], b[40], c[40], d[40];

    scanf("%39[0-9]", a);      /* chi chu so        */
    scanf("%39[A-Z]", b);      /* chi chu HOA       */
    scanf("%39[^,]",  c);      /* moi thu tru dau , */
    getchar();                 /* an dau phay       */
    scanf("%39[abcd]", d);     /* chi a, b, c, d    */

    printf("[%s] [%s] [%s] [%s]\\n", a, b, c, d);
    return 0;
}</code></pre>
<p class="dap-an">✅ Compiled and run with the single input line <code>2026FPTuni,abcdxyz</code>: the four variables came back as <code>[2026] [FPT] [uni] [abcd]</code>, and the drain afterwards showed <code>xyz</code> plus the newline still queued. Every scanset stopped at precisely the first character outside its set, and each one left that character for the next specifier — the same rule as <code>%s</code>, applied four times in a row.</p>
<p class="pitfall">⚠️ Step 4 above needed an explicit <code>getchar()</code>. Without it, <code>%[abcd]</code> would have met the comma left behind by <code>%[^,]</code>, matched nothing, and returned 0 — the identical trap to slide 17's double <code>%[^\\n]</code>. A scanset never consumes the character that stopped it, so chaining scansets always means planning who eats the delimiter.</p>`,
        `<p class="y-chinh">🎯 Dạng tổng quát đứng sau <code>%[^\\n]</code>. Scanset là một ngôn ngữ mẫu tí hon: liệt kê các ký tự bạn chấp nhận, thêm <code>^</code> ở đầu để lật ngược, dùng <code>-</code> để chỉ một khoảng. Slide cho sáu ví dụ.</p>
<ul>
<li><strong><code>%[abcd]</code></strong> — chỉ nhận a, b, c hoặc d; dừng ở ký tự đầu tiên không nằm trong bốn cái đó.</li>
<li><strong><code>%[^abcd]</code></strong> — dạng lật ngược: nhận mọi thứ <em>trừ</em> bốn ký tự ấy. <code>%[^\\n]</code> ở slide 17 chính là dáng này với tập chỉ có một ký tự.</li>
<li><strong><code>%[0-9]</code></strong> — dấu gạch nối tạo thành một khoảng: mọi chữ số thập phân. Đây là cách đọc một con số dưới dạng chữ mà không cần <code>atoi</code>.</li>
<li><strong><code>%[A-Z]</code></strong> — mọi chữ cái hoa. Để ý nó KHÔNG nhận chữ thường; khoảng được hiểu theo thứ tự ASCII, mà 'A'…'Z' là 65…90 còn 'a'…'z' là 97…122.</li>
<li><strong><code>%[0-9A-Za-z]</code></strong> — ba khoảng trong một tập: chữ số và cả hai kiểu chữ cái. Đây là mẫu thực dụng để "đọc một định danh".</li>
<li><strong><code>%[A-FT-Z]</code></strong> — hai khoảng không liền nhau, A tới F và T tới Z. Các khoảng chỉ đơn giản nối đuôi nhau; không có dấu phẩy và không có chữ "hoặc".</li>
<li><strong>Mọi scanset đều dùng chung bộ bốn bước</strong> như <code>%s</code> và <code>%[^\\n]</code>: đọc chừng nào còn khớp, lưu, thêm <code>'\\0'</code>, để lại ký tự không khớp đầu tiên trong bộ đệm. Và cũng như chúng, nó nhận độ rộng.</li>
</ul>
<p class="nhan">Đo thật — một chương trình, bốn scanset liên tiếp, dữ liệu vào <code>2026FPTuni,abcdxyz</code>:</p>
<table>
<tr><th>Bước</th><th>Định dạng</th><th>Biến nhận gì</th><th>Còn lại trong bộ đệm</th></tr>
<tr><td>1</td><td><code>%[0-9]</code></td><td><code>2026</code></td><td><code>FPTuni,abcdxyz\\n</code></td></tr>
<tr><td>2</td><td><code>%[A-Z]</code></td><td><code>FPT</code></td><td><code>uni,abcdxyz\\n</code></td></tr>
<tr><td>3</td><td><code>%[^,]</code></td><td><code>uni</code></td><td><code>,abcdxyz\\n</code></td></tr>
<tr><td>4</td><td><code>%[abcd]</code> (sau khi ăn dấu phẩy)</td><td><code>abcd</code></td><td><code>xyz\\n</code></td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    char a[40], b[40], c[40], d[40];

    scanf("%39[0-9]", a);      /* chi chu so        */
    scanf("%39[A-Z]", b);      /* chi chu HOA       */
    scanf("%39[^,]",  c);      /* moi thu tru dau , */
    getchar();                 /* an dau phay       */
    scanf("%39[abcd]", d);     /* chi a, b, c, d    */

    printf("[%s] [%s] [%s] [%s]\\n", a, b, c, d);
    return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch và chạy với đúng một dòng nhập <code>2026FPTuni,abcdxyz</code>: bốn biến trả về <code>[2026] [FPT] [uni] [abcd]</code>, và lượt vét bộ đệm sau đó cho thấy <code>xyz</code> cùng ký tự xuống dòng vẫn đang xếp hàng. Mỗi scanset dừng đúng ở ký tự đầu tiên nằm ngoài tập của nó, và mỗi cái đều để lại ký tự ấy cho specifier kế — vẫn là luật của <code>%s</code>, áp dụng bốn lần liên tiếp.</p>
<p class="pitfall">⚠️ Bước 4 ở trên cần một lệnh <code>getchar()</code> tường minh. Không có nó thì <code>%[abcd]</code> đã gặp dấu phẩy mà <code>%[^,]</code> để lại, khớp được 0 ký tự, và trả về 0 — đúng cái bẫy của hai lệnh <code>%[^\\n]</code> liên tiếp ở slide 17. Một scanset không bao giờ tiêu thụ ký tự đã làm nó dừng, nên xâu chuỗi nhiều scanset luôn có nghĩa là phải tính xem ai sẽ ăn dấu ngắt.</p>`],

      [21, '5. Input Strings: Using gets(…) function',
        `<p class="y-chinh">🎯 The third way to read a string — and the slide itself ends with the warning: <em>"gets is unsafe. Because it does not check the size of the buffer and can lead to buffer overflows."</em> Read the four bullets, then read the warning, because the two halves of this slide disagree about whether you should use it.</p>
<ul>
<li><strong>"Accepts an empty string"</strong> — pressing Enter straight away gives you a valid zero-length string, whereas <code>scanf("%[^\\n]")</code> would match nothing and return 0. That is <code>gets</code>'s one genuine advantage over the scanset.</li>
<li><strong>"Uses the <code>'\\n'</code> as the delimiter"</strong> — so it reads a whole line, blanks included, exactly like <code>%[^\\n]</code>.</li>
<li><strong>"Throws away the delimiter after accepting the string"</strong> — this is the real difference from <code>%[^\\n]</code>: <code>gets</code> <em>consumes</em> the newline, so slide 17's "second read is skipped" trap does not happen. That is why it was popular.</li>
<li><strong>"Automatically appends the null byte"</strong> — the usual contract.</li>
<li><strong>The prototype <code>char* gets(char [ ]);</code> is the whole problem</strong> — one argument. There is nowhere to say how big the array is, so <code>gets</code> <em>cannot</em> check, no matter how carefully you call it. This is not a bug you can avoid by being careful; it is designed in.</li>
<li><strong>What the slide does not say: <code>gets</code> was removed from the C standard in C11</strong> (it was already deprecated in C99's 2007 amendment). It is not "bad practice" — it is no longer part of the language. Every compiler that still provides it does so only for old code.</li>
<li><strong>The replacement is <code>fgets(s, sizeof s, stdin)</code></strong> — same job, plus the size. One difference to remember: <code>fgets</code> <em>keeps</em> the newline in the string, so you usually cut it with <code>s[strcspn(s, "\\n")] = '\\0';</code>.</li>
</ul>
<p class="nhan">Đo thật — <code>char str[10]</code>, two functions, the same 40-character input:</p>
<table>
<tr><th>Hàm</th><th>Gõ gì</th><th>Biến nhận gì</th><th>Kết cục</th></tr>
<tr><td><code>gets(str)</code></td><td>40 ký tự <code>A</code></td><td>— (ghi tràn ra ngoài)</td><td><strong>sập, mã thoát 134</strong></td></tr>
<tr><td><code>fgets(str, sizeof str, stdin)</code></td><td>40 ký tự <code>A</code></td><td><code>AAAAAAAAA</code> (9 ký tự + <code>\\0</code>)</td><td>chạy tiếp, 31 ký tự còn trong bộ đệm</td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;string.h&gt;

int main(void) {
    char str[100];

    printf("Enter a string: ");
    if (fgets(str, sizeof str, stdin) != NULL) {
        str[strcspn(str, "\\n")] = '\\0';      /* CAT bo ky tu xuong dong */
        printf("You entered: [%s] len=%zu\\n", str, strlen(str));
    }
    return 0;
}</code></pre>
<p class="dap-an">✅ Measured. <code>gets</code> into a 10-byte array with 40 characters of input: the process <strong>aborted, exit code 134</strong>, and before that the runtime itself printed <em>"warning: this program uses gets(), which is unsafe."</em> — the C library of this machine warns at run time, not just at compile time. <code>cc -Wall</code> also refused to stay quiet: <em>"'gets' is deprecated: … it is highly recommended that you use fgets(3) instead"</em>. The <code>fgets</code> version on the same input stored 9 characters plus a terminator and carried on normally.</p>
<p class="pitfall">⚠️ The one thing <code>fgets</code> does that <code>gets</code> did not: it keeps the <code>'\\n'</code>. I measured it on the input <code>Hello World</code> — before trimming, <code>strlen</code> was <strong>12</strong> and the last byte was <strong>10</strong> (the newline); after <code>strcspn</code> trimming, <code>strlen</code> was 11. Forget that line and every comparison with <code>strcmp</code> will fail for a reason you cannot see on screen.</p>`,
        `<p class="y-chinh">🎯 Cách thứ ba để đọc chuỗi — và chính slide kết thúc bằng lời cảnh báo: <em>"gets không an toàn. Vì nó không kiểm tra kích thước bộ đệm và có thể dẫn tới tràn bộ đệm."</em> Hãy đọc bốn gạch đầu dòng, rồi đọc lời cảnh báo, vì hai nửa của slide này bất đồng với nhau về chuyện bạn có nên dùng nó hay không.</p>
<ul>
<li><strong>"Chấp nhận chuỗi rỗng"</strong> — bấm Enter ngay lập tức thì bạn được một chuỗi hợp lệ dài 0, trong khi <code>scanf("%[^\\n]")</code> sẽ khớp được 0 ký tự và trả về 0. Đó là ưu điểm thật duy nhất của <code>gets</code> so với scanset.</li>
<li><strong>"Dùng <code>'\\n'</code> làm dấu ngắt"</strong> — nên nó đọc trọn một dòng, kể cả dấu cách, y như <code>%[^\\n]</code>.</li>
<li><strong>"Vứt bỏ dấu ngắt sau khi nhận chuỗi"</strong> — đây mới là khác biệt thật so với <code>%[^\\n]</code>: <code>gets</code> <em>tiêu thụ</em> ký tự xuống dòng, nên cái bẫy "lượt đọc thứ hai bị bỏ qua" ở slide 17 không xảy ra. Đó là lý do nó từng được ưa dùng.</li>
<li><strong>"Tự động thêm byte null vào cuối"</strong> — vẫn là bản hợp đồng quen thuộc.</li>
<li><strong>Nguyên mẫu <code>char* gets(char [ ]);</code> chính là toàn bộ vấn đề</strong> — chỉ một tham số. Không có chỗ nào để nói mảng to bao nhiêu, nên <code>gets</code> <em>không thể</em> kiểm tra, dù bạn gọi nó cẩn thận tới đâu. Đây không phải con bọ tránh được bằng sự cẩn thận; nó nằm ngay trong thiết kế.</li>
<li><strong>Điều slide không nói: <code>gets</code> đã bị LOẠI KHỎI chuẩn C từ C11</strong> (nó đã bị đánh dấu lỗi thời từ bản bổ sung năm 2007 của C99). Đây không phải "thói quen xấu" — nó không còn là một phần của ngôn ngữ. Mọi trình biên dịch còn cung cấp nó là chỉ để đỡ cho mã cũ.</li>
<li><strong>Thứ thay thế là <code>fgets(s, sizeof s, stdin)</code></strong> — cùng công việc, có thêm kích thước. Một khác biệt phải nhớ: <code>fgets</code> <em>GIỮ LẠI</em> ký tự xuống dòng trong chuỗi, nên thường phải cắt nó bằng <code>s[strcspn(s, "\\n")] = '\\0';</code>.</li>
</ul>
<p class="nhan">Đo thật — <code>char str[10]</code>, hai hàm, cùng một dữ liệu vào 40 ký tự:</p>
<table>
<tr><th>Hàm</th><th>Gõ gì</th><th>Biến nhận gì</th><th>Kết cục</th></tr>
<tr><td><code>gets(str)</code></td><td>40 ký tự <code>A</code></td><td>— (ghi tràn ra ngoài)</td><td><strong>sập, mã thoát 134</strong></td></tr>
<tr><td><code>fgets(str, sizeof str, stdin)</code></td><td>40 ký tự <code>A</code></td><td><code>AAAAAAAAA</code> (9 ký tự + <code>\\0</code>)</td><td>chạy tiếp, 31 ký tự còn trong bộ đệm</td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;string.h&gt;

int main(void) {
    char str[100];

    printf("Enter a string: ");
    if (fgets(str, sizeof str, stdin) != NULL) {
        str[strcspn(str, "\\n")] = '\\0';      /* CAT bo ky tu xuong dong */
        printf("You entered: [%s] len=%zu\\n", str, strlen(str));
    }
    return 0;
}</code></pre>
<p class="dap-an">✅ Đã đo. <code>gets</code> vào mảng 10 byte với 40 ký tự nhập: tiến trình <strong>dừng đột ngột, mã thoát 134</strong>, và trước đó chính bản thư viện C khi chạy đã in ra <em>"warning: this program uses gets(), which is unsafe."</em> — thư viện của máy này cảnh báo lúc CHẠY chứ không chỉ lúc biên dịch. <code>cc -Wall</code> cũng không chịu im: <em>"'gets' is deprecated: … it is highly recommended that you use fgets(3) instead"</em>. Bản <code>fgets</code> với cùng dữ liệu vào lưu được 9 ký tự cộng byte kết thúc và chạy tiếp bình thường.</p>
<p class="pitfall">⚠️ Một việc <code>fgets</code> làm mà <code>gets</code> không làm: nó giữ lại ký tự <code>'\\n'</code>. Tôi đã đo với dữ liệu vào <code>Hello World</code> — trước khi cắt, <code>strlen</code> bằng <strong>12</strong> và byte cuối bằng <strong>10</strong> (ký tự xuống dòng); sau khi cắt bằng <code>strcspn</code>, <code>strlen</code> bằng 11. Quên dòng cắt ấy thì mọi phép so sánh bằng <code>strcmp</code> đều sai vì một lý do bạn không nhìn thấy trên màn hình.</p>`],

      [22, 'gets(…) function: Example',
        `<p class="y-chinh">🎯 Twelve numbered lines showing <code>gets</code> at its most convincing: <code>char str[100];</code>, a prompt, <code>gets(str);</code>, and <code>printf("You entered: %s\\n", str);</code>. The console reads <code>Enter a string: Hello World</code> / <code>You entered: Hello World</code>. It works — which is precisely why the function survived so long.</p>
<ul>
<li><strong>Why this example looks safe</strong> — 100 bytes for the phrase "Hello World". The buffer is 9 times larger than the input. Nothing can go wrong <em>with this input</em>.</li>
<li><strong>Why it is not safe</strong> — the program has no control over what the user types. There is no relation whatsoever between <code>char str[100]</code> on line 4 and <code>gets(str)</code> on line 7; the number 100 never reaches the function. Type 200 characters and 201 bytes are written.</li>
<li><strong>Compare with the fix, line for line</strong> — <code>fgets(str, sizeof str, stdin)</code> passes the same three things <code>gets</code> should always have had: where to write, how much room there is, and where to read from.</li>
<li><strong>The blank inside "Hello World" is the point of the demo</strong> — it shows <code>gets</code> reading past a space, which <code>scanf("%s")</code> could not do (slide 15). Reading a whole line is the job; <code>gets</code> is simply the wrong tool for it now.</li>
<li><strong>Look at the window title on the slide</strong> — <code>input_use_fget.exe</code>. Even the file name of the teacher's own demo says <em>fget</em>. Whoever built this example had already written the <code>fgets</code> version.</li>
<li><strong>Note there is no newline problem here</strong> — <code>gets</code> ate the delimiter, so the string is <code>Hello World</code> with nothing trailing. With <code>fgets</code> you would need the trimming line from slide 21.</li>
</ul>
<p class="nhan">Đo thật — the slide's program, and the same program with <code>fgets</code>:</p>
<table>
<tr><th>Chương trình</th><th>Gõ gì</th><th>Biến nhận gì</th><th>Còn gì trong bộ đệm</th></tr>
<tr><td><code>gets(str)</code>, <code>str[100]</code></td><td><code>Hello World⏎</code></td><td><code>Hello World</code> (11 ký tự)</td><td>rỗng (đã ăn <code>\\n</code>)</td></tr>
<tr><td><code>fgets</code> không cắt</td><td><code>Hello World⏎</code></td><td><code>Hello World\\n</code> (12 ký tự)</td><td>rỗng</td></tr>
<tr><td><code>fgets</code> + <code>strcspn</code></td><td><code>Hello World⏎</code></td><td><code>Hello World</code> (11 ký tự)</td><td>rỗng</td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;string.h&gt;

int main() {
    char str[100];                        /* Allocate space for the string */

    printf("Enter a string: ");
    /* gets(str);  &lt;-- DA BI LOAI KHOI CHUAN C11, KHONG DUNG */
    fgets(str, sizeof str, stdin);        /* thay the an toan */
    str[strcspn(str, "\\n")] = '\\0';

    printf("You entered: %s\\n", str);

    return 0;
}</code></pre>
<p class="dap-an">✅ Đáp án — I ran the slide's version as written: with the input <code>Hello World</code> it printed <code>Enter a string: You entered: Hello World</code>, matching the slide's console exactly. <strong>But the runtime printed one extra line the slide does not show: <em>"warning: this program uses gets(), which is unsafe."</em></strong> That warning is not something I added — the C library of this machine emits it for every program containing <code>gets</code>. The slide teaches a function that the language removed in C11 and that the system actively complains about; the example is correct as history, and must not be copied into your own code. Use the <code>fgets</code> version above, which I ran on the same input and which printed the identical <code>You entered: Hello World</code>.</p>
<p class="meo">💡 If an exam question asks you to "write a program that reads a line", writing <code>gets</code> may still be accepted because the slide teaches it — but adding one comment such as <em>"gets đã bị loại khỏi C11; bản an toàn là fgets(str, sizeof str, stdin)"</em> costs you one line and shows you understood the warning at the bottom of slide 21.</p>`,
        `<p class="y-chinh">🎯 Mười hai dòng có đánh số cho thấy <code>gets</code> ở dáng vẻ thuyết phục nhất: <code>char str[100];</code>, một lời nhắc, <code>gets(str);</code>, rồi <code>printf("You entered: %s\\n", str);</code>. Console hiện <code>Enter a string: Hello World</code> / <code>You entered: Hello World</code>. Nó chạy được — và đó đúng là lý do hàm này sống dai đến vậy.</p>
<ul>
<li><strong>Vì sao ví dụ này trông an toàn</strong> — 100 byte cho cụm "Hello World". Bộ đệm to gấp 9 lần dữ liệu vào. Chẳng có gì sai được <em>với dữ liệu vào này</em>.</li>
<li><strong>Vì sao nó không an toàn</strong> — chương trình không kiểm soát được người dùng gõ gì. Giữa <code>char str[100]</code> ở dòng 4 và <code>gets(str)</code> ở dòng 7 không hề có một mối liên hệ nào; con số 100 không bao giờ tới được hàm. Gõ 200 ký tự thì 201 byte được ghi ra.</li>
<li><strong>So với bản sửa, từng dòng một</strong> — <code>fgets(str, sizeof str, stdin)</code> truyền đúng ba thứ mà lẽ ra <code>gets</code> phải luôn có: ghi vào đâu, có bao nhiêu chỗ, và đọc từ đâu.</li>
<li><strong>Dấu cách trong "Hello World" mới là ý của bản demo</strong> — nó cho thấy <code>gets</code> đọc xuyên qua dấu cách, việc mà <code>scanf("%s")</code> không làm được (slide 15). Đọc trọn một dòng là nhiệm vụ; chỉ là <code>gets</code> giờ đã là công cụ sai cho nhiệm vụ ấy.</li>
<li><strong>Hãy nhìn tên cửa sổ trên slide</strong> — <code>input_use_fget.exe</code>. Ngay cả tên tệp của bản demo do chính thầy dựng cũng ghi <em>fget</em>. Người soạn ví dụ này đã viết sẵn bản <code>fgets</code> rồi.</li>
<li><strong>Để ý ở đây không có vấn đề ký tự xuống dòng</strong> — <code>gets</code> đã ăn dấu ngắt, nên chuỗi là <code>Hello World</code> không thừa gì. Với <code>fgets</code> thì bạn cần thêm dòng cắt của slide 21.</li>
</ul>
<p class="nhan">Đo thật — chương trình của slide, và cùng chương trình ấy với <code>fgets</code>:</p>
<table>
<tr><th>Chương trình</th><th>Gõ gì</th><th>Biến nhận gì</th><th>Còn gì trong bộ đệm</th></tr>
<tr><td><code>gets(str)</code>, <code>str[100]</code></td><td><code>Hello World⏎</code></td><td><code>Hello World</code> (11 ký tự)</td><td>rỗng (đã ăn <code>\\n</code>)</td></tr>
<tr><td><code>fgets</code> không cắt</td><td><code>Hello World⏎</code></td><td><code>Hello World\\n</code> (12 ký tự)</td><td>rỗng</td></tr>
<tr><td><code>fgets</code> + <code>strcspn</code></td><td><code>Hello World⏎</code></td><td><code>Hello World</code> (11 ký tự)</td><td>rỗng</td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;string.h&gt;

int main() {
    char str[100];                        /* Allocate space for the string */

    printf("Enter a string: ");
    /* gets(str);  &lt;-- DA BI LOAI KHOI CHUAN C11, KHONG DUNG */
    fgets(str, sizeof str, stdin);        /* thay the an toan */
    str[strcspn(str, "\\n")] = '\\0';

    printf("You entered: %s\\n", str);

    return 0;
}</code></pre>
<p class="dap-an">✅ Đáp án — tôi đã chạy đúng bản của slide: với dữ liệu vào <code>Hello World</code> nó in ra <code>Enter a string: You entered: Hello World</code>, khớp y hệt console trên slide. <strong>Nhưng lúc chạy có thêm một dòng mà slide không hiện: <em>"warning: this program uses gets(), which is unsafe."</em></strong> Dòng cảnh báo ấy không phải do tôi thêm — thư viện C của máy này tự in ra cho mọi chương trình có chứa <code>gets</code>. Slide đang dạy một hàm mà ngôn ngữ đã loại bỏ từ C11 và hệ thống thì phàn nàn ra mặt; ví dụ này đúng với tư cách lịch sử, và không được chép vào mã của bạn. Hãy dùng bản <code>fgets</code> ở trên — tôi đã chạy nó với cùng dữ liệu vào và nó in ra đúng <code>You entered: Hello World</code>.</p>
<p class="meo">💡 Nếu đề thi bảo "viết chương trình đọc một dòng", viết <code>gets</code> có thể vẫn được chấm vì slide dạy nó — nhưng thêm một dòng chú thích kiểu <em>"gets đã bị loại khỏi C11; bản an toàn là fgets(str, sizeof str, stdin)"</em> chỉ tốn một dòng mà cho thấy bạn đã hiểu lời cảnh báo ở cuối slide 21.</p>`],

      [23, 'Exercise 2: Input Strings',
        `<p class="y-chinh">🎯 <em>"Using the hints below, write a program that takes in a string of characters and prints it out."</em> The hint is a complete function, <code>getstr(char s[], int max)</code>, which is <code>gets</code> written by hand — with the one thing <code>gets</code> lacks: a size.</p>
<ul>
<li><strong>Read the header comment first</strong> — <em>"getstr accepts a newline terminated string s of up to max characters, appends a null byte and throws away the terminating character"</em>. Three promises, and the code keeps all three.</li>
<li><strong>The loop</strong> — <code>while ((c = getchar()) != '\\n' &amp;&amp; c != EOF)</code>. It reads one character at a time until the newline. Testing <code>EOF</code> too is what stops it looping forever when input runs out; forget it and a piped input hangs.</li>
<li><strong>Why <code>int c</code> and not <code>char c</code></strong> — <code>getchar</code> returns an <code>int</code> so it can return every possible character <em>and</em> the separate value <code>EOF</code> (which is −1). Storing it in a <code>char</code> first can make <code>EOF</code> indistinguishable from a real byte. This is a classic C interview question.</li>
<li><strong><code>if (i &lt; max) s[i++] = (char) c;</code> — this is the whole point of the exercise</strong>. Characters beyond <code>max</code> are read and discarded, not written. The loop still drains the line (so the buffer is left clean), but the array is never overflowed. That single <code>if</code> is what <code>gets</code> is missing.</li>
<li><strong><code>s[i] = '\\0';</code> after the loop</strong> — and note it is outside the <code>if</code>, so it always runs. That is why the caller must pass <code>max</code> as <strong>one less</strong> than the array size: with <code>char s[31]</code> you call <code>getstr(s, 30)</code>, leaving index 30 for the terminator.</li>
<li><strong>"Accepts an empty string"</strong> — press Enter immediately and the loop body never runs, <code>i</code> stays 0, and <code>s[0] = '\\0'</code> makes a valid empty string. Same behaviour as <code>gets</code>, bullet 1 of slide 21.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

/* getstr accepts a newline terminated string s of up to max characters,
 * appends a null byte and throws away the terminating character
 */
void getstr(char s[], int max) {
    int i, c;

    i = 0;
    while ((c = getchar()) != '\\n' &amp;&amp; c != EOF)
        if (i &lt; max)
            s[i++] = (char) c;
    s[i] = '\\0';
}

int main(void) {
    char s[31];
    printf("Enter a string: ");
    getstr(s, 30);                 /* 30, KHONG phai 31 */
    printf("You entered: [%s]\\n", s);
    return 0;
}</code></pre>
<p class="dap-an">✅ Đáp án — compiled with <code>cc -Wall</code> and run with three deliberate inputs. (1) <code>My name is Arnold</code> → <code>You entered: [My name is Arnold]</code>: all 17 characters including the three blanks, which is what <code>scanf("%s")</code> could not do. (2) Enter pressed immediately → <code>You entered: []</code>: a valid empty string, no crash. (3) <code>abcdefghijklmnopqrstuvwxyz0123456789ABCDEFG</code>, 43 characters → <code>You entered: [abcdefghijklmnopqrstuvwxyz0123]</code>, exactly 30 characters, the other 13 read and thrown away. No overflow, no corruption, buffer left clean in every case.</p>
<p class="pitfall">⚠️ I then made the one mistake this function invites: calling <code>getstr(s, 31)</code> on <code>char s[31]</code>. With 31 characters typed, the loop fills indices 0…30 and then <code>s[i] = '\\0'</code> writes at index <strong>31</strong> — one byte past the array. Measured result: <strong>abort, exit code 134</strong>. The rule is the same n+1 rule as slide 4, and this is where it bites: <em>max must be the array size minus one</em>.</p>`,
        `<p class="y-chinh">🎯 <em>"Dùng gợi ý dưới đây, viết một chương trình nhận vào một chuỗi ký tự và in nó ra."</em> Gợi ý là một hàm hoàn chỉnh, <code>getstr(char s[], int max)</code>, tức là <code>gets</code> viết bằng tay — kèm đúng cái thứ mà <code>gets</code> thiếu: một kích thước.</p>
<ul>
<li><strong>Hãy đọc khối chú thích đầu hàm trước</strong> — <em>"getstr nhận một chuỗi s kết thúc bằng ký tự xuống dòng, dài tối đa max ký tự, thêm byte null vào cuối và vứt bỏ ký tự kết thúc"</em>. Ba lời hứa, và mã giữ đủ cả ba.</li>
<li><strong>Vòng lặp</strong> — <code>while ((c = getchar()) != '\\n' &amp;&amp; c != EOF)</code>. Nó đọc từng ký tự một cho tới ký tự xuống dòng. Việc kiểm thêm <code>EOF</code> là thứ ngăn nó lặp vô tận khi hết dữ liệu; bỏ nó đi thì chạy với dữ liệu vào qua ống dẫn là treo.</li>
<li><strong>Vì sao là <code>int c</code> chứ không phải <code>char c</code></strong> — <code>getchar</code> trả về <code>int</code> để nó có thể trả về mọi ký tự có thể có <em>và</em> thêm giá trị riêng <code>EOF</code> (bằng −1). Cất vào <code>char</code> trước thì <code>EOF</code> có thể lẫn với một byte thật. Đây là câu hỏi phỏng vấn C kinh điển.</li>
<li><strong><code>if (i &lt; max) s[i++] = (char) c;</code> — đây mới là toàn bộ ý của bài tập</strong>. Các ký tự vượt quá <code>max</code> vẫn được đọc rồi vứt đi, chứ không được ghi. Vòng lặp vẫn vét sạch cả dòng (nên bộ đệm để lại sạch sẽ), mà mảng thì không bao giờ bị tràn. Đúng một chữ <code>if</code> ấy là thứ <code>gets</code> không có.</li>
<li><strong><code>s[i] = '\\0';</code> sau vòng lặp</strong> — và để ý nó nằm NGOÀI chữ <code>if</code>, nên nó luôn chạy. Đó là lý do người gọi phải truyền <code>max</code> <strong>nhỏ hơn một</strong> so với kích thước mảng: với <code>char s[31]</code> bạn gọi <code>getstr(s, 30)</code>, chừa ô 30 cho byte kết thúc.</li>
<li><strong>"Chấp nhận chuỗi rỗng"</strong> — bấm Enter ngay thì thân vòng lặp không chạy lần nào, <code>i</code> vẫn bằng 0, và <code>s[0] = '\\0'</code> tạo ra một chuỗi rỗng hợp lệ. Cùng hành vi với <code>gets</code>, gạch đầu dòng 1 của slide 21.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

/* getstr accepts a newline terminated string s of up to max characters,
 * appends a null byte and throws away the terminating character
 */
void getstr(char s[], int max) {
    int i, c;

    i = 0;
    while ((c = getchar()) != '\\n' &amp;&amp; c != EOF)
        if (i &lt; max)
            s[i++] = (char) c;
    s[i] = '\\0';
}

int main(void) {
    char s[31];
    printf("Enter a string: ");
    getstr(s, 30);                 /* 30, KHONG phai 31 */
    printf("You entered: [%s]\\n", s);
    return 0;
}</code></pre>
<p class="dap-an">✅ Đáp án — đã biên dịch bằng <code>cc -Wall</code> và chạy với ba dữ liệu vào cố ý chọn. (1) <code>My name is Arnold</code> → <code>You entered: [My name is Arnold]</code>: đủ 17 ký tự kể cả ba dấu cách, thứ mà <code>scanf("%s")</code> không làm được. (2) Bấm Enter ngay → <code>You entered: []</code>: một chuỗi rỗng hợp lệ, không sập. (3) <code>abcdefghijklmnopqrstuvwxyz0123456789ABCDEFG</code>, 43 ký tự → <code>You entered: [abcdefghijklmnopqrstuvwxyz0123]</code>, đúng 30 ký tự, 13 ký tự còn lại được đọc rồi vứt bỏ. Không tràn, không hỏng dữ liệu, bộ đệm sạch trong cả ba trường hợp.</p>
<p class="pitfall">⚠️ Sau đó tôi phạm đúng cái lỗi mà hàm này mời gọi: gọi <code>getstr(s, 31)</code> với <code>char s[31]</code>. Gõ 31 ký tự thì vòng lặp điền đầy ô 0…30 rồi <code>s[i] = '\\0'</code> ghi vào ô <strong>31</strong> — vượt mảng đúng một byte. Kết quả đo được: <strong>dừng đột ngột, mã thoát 134</strong>. Vẫn là quy tắc n+1 của slide 4, và đây là chỗ nó cắn: <em>max phải bằng kích thước mảng trừ một</em>.</p>`],

      [24, '6. May Operators Applied to String?',
        `<p class="y-chinh">🎯 The answer is <strong>no</strong>, and the slide says it with four crossed-out circles: <span class="nhan">=</span> <span class="nhan">+</span> <span class="nhan">&gt;</span> <span class="nhan">&lt;</span>. <em>"C operators act on primitive data type only (char, int, float, …). Can not be applied to static arrays and static strings."</em> The blue box draws the conclusion: <em>"We need functions for processing arrays and string."</em></p>
<ul>
<li><strong>The example is a compile error, on purpose</strong> — <code>char a1[] = {1,2,3,4,5}; char a2[5]; a2 = a1;</code> and the Compiler pane shows line 7, <em>"[Error] assignment to expression with array type"</em>. This is not a runtime surprise; the language refuses outright.</li>
<li><strong>Why <code>=</code> cannot work</strong> — an array name is not a modifiable value; it stands for an address that is fixed for the array's whole lifetime. There is nothing for <code>=</code> to assign <em>to</em>.</li>
<li><strong>Why <code>==</code> is far more dangerous than <code>=</code></strong> — <code>s1 == s2</code> <em>does</em> compile. It compares the two <strong>addresses</strong>, which are always different for two different arrays, so it is always false. Your program runs, silently gives the wrong answer, and nothing points at the line.</li>
<li><strong>The replacements, one for one</strong> — <code>a = b</code> becomes <code>strcpy(a, b)</code>; <code>a == b</code> becomes <code>strcmp(a, b) == 0</code>; <code>a + b</code> becomes <code>strcat(a, b)</code>; <code>a &lt; b</code> becomes <code>strcmp(a, b) &lt; 0</code>. That list is slide 25, and this slide is the reason it exists.</li>
<li><strong>Beware of <code>strcmp</code>'s return value</strong> — it is <strong>0 when the strings are EQUAL</strong>. So <code>if (strcmp(a, b))</code> means "if they differ", which reads backwards to everyone. Write the comparison out: <code>if (strcmp(a, b) == 0)</code>.</li>
<li><strong>One exception worth knowing</strong> — pointers are primitive, so <code>char *p; p = "abc";</code> <em>is</em> legal. It does not copy any characters; it just points <code>p</code> somewhere else. Students who "fix" the slide's error by changing <code>char a2[5]</code> into <code>char *a2</code> get code that compiles and copies nothing.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;string.h&gt;

int main(void) {
    char s1[20] = "Hello";
    char s2[20] = "Hello";

    printf("s1 == s2      -&gt; %d\\n", s1 == s2);        /* SAI: so DIA CHI */
    printf("strcmp(s1,s2) -&gt; %d\\n", strcmp(s1, s2));  /* DUNG: so NOI DUNG */

    char d[20];
    strcpy(d, s1);          /* thay cho  d = s1   */
    strcat(d, " World");    /* thay cho  d = d + " World" */
    printf("d = [%s] len = %zu\\n", d, strlen(d));
    return 0;
}</code></pre>
<p class="dap-an">✅ Đáp án — measured. <code>a2 = a1;</code> was rejected by the compiler with <em>"array type 'char[5]' is not assignable"</em> (clang's wording for the slide's <em>"assignment to expression with array type"</em>) — the slide is right. Then, with two arrays holding the identical text <code>Hello</code>: <code>s1 == s2</code> evaluated to <strong>0</strong> (their addresses were <code>0x16efca3b0</code> and <code>0x16efca390</code>, 32 bytes apart) while <code>strcmp(s1, s2)</code> returned <strong>0</strong> meaning equal. Two zeros meaning opposite things, on the same pair of strings — that is the whole trap of this slide. <code>strcpy</code> + <code>strcat</code> then produced <code>d = [Hello World] len = 11</code>.</p>
<p class="pitfall">⚠️ <code>cc -Wall</code> does warn on <code>s1 == s2</code> (<em>"array comparison always evaluates to false"</em>), but only because both sides are arrays. Compare two <code>char *</code> variables and the warning disappears — the code is then perfectly legal, compares addresses, and is still wrong. Never let "it compiled without warnings" stand in for "it compares strings".</p>`,
        `<p class="y-chinh">🎯 Câu trả lời là <strong>không</strong>, và slide nói điều đó bằng bốn vòng tròn gạch chéo: <span class="nhan">=</span> <span class="nhan">+</span> <span class="nhan">&gt;</span> <span class="nhan">&lt;</span>. <em>"Toán tử của C chỉ tác dụng lên kiểu dữ liệu nguyên thuỷ (char, int, float, …). Không áp dụng được cho mảng tĩnh và chuỗi tĩnh."</em> Khung xanh rút ra kết luận: <em>"Chúng ta cần các HÀM để xử lý mảng và chuỗi."</em></p>
<ul>
<li><strong>Ví dụ là một lỗi biên dịch, và nó cố ý thế</strong> — <code>char a1[] = {1,2,3,4,5}; char a2[5]; a2 = a1;</code> và khung Compiler hiện dòng 7, <em>"[Error] assignment to expression with array type"</em>. Đây không phải bất ngờ lúc chạy; ngôn ngữ từ chối thẳng thừng.</li>
<li><strong>Vì sao <code>=</code> không thể chạy</strong> — tên mảng không phải một giá trị sửa được; nó đại diện cho một địa chỉ cố định suốt đời của mảng. Không có chỗ nào cho <code>=</code> gán VÀO cả.</li>
<li><strong>Vì sao <code>==</code> nguy hiểm hơn <code>=</code> rất nhiều</strong> — <code>s1 == s2</code> thì LẠI biên dịch được. Nó so hai <strong>địa chỉ</strong>, mà hai mảng khác nhau thì địa chỉ luôn khác nhau, nên nó luôn sai. Chương trình vẫn chạy, âm thầm cho đáp án sai, và không có gì chỉ vào dòng đó.</li>
<li><strong>Các thứ thay thế, một đổi một</strong> — <code>a = b</code> thành <code>strcpy(a, b)</code>; <code>a == b</code> thành <code>strcmp(a, b) == 0</code>; <code>a + b</code> thành <code>strcat(a, b)</code>; <code>a &lt; b</code> thành <code>strcmp(a, b) &lt; 0</code>. Danh sách ấy chính là slide 25, và slide này là lý do nó tồn tại.</li>
<li><strong>Coi chừng giá trị trả về của <code>strcmp</code></strong> — nó bằng <strong>0 khi hai chuỗi BẰNG NHAU</strong>. Nên <code>if (strcmp(a, b))</code> có nghĩa là "nếu chúng khác nhau", đọc lên thì ai cũng hiểu ngược. Hãy viết đầy đủ: <code>if (strcmp(a, b) == 0)</code>.</li>
<li><strong>Một ngoại lệ đáng biết</strong> — con trỏ là kiểu nguyên thuỷ, nên <code>char *p; p = "abc";</code> thì LẠI hợp lệ. Nó không sao chép ký tự nào; nó chỉ cho <code>p</code> trỏ sang chỗ khác. Sinh viên nào "sửa" lỗi của slide bằng cách đổi <code>char a2[5]</code> thành <code>char *a2</code> sẽ được một đoạn mã biên dịch trơn tru mà không sao chép gì cả.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;string.h&gt;

int main(void) {
    char s1[20] = "Hello";
    char s2[20] = "Hello";

    printf("s1 == s2      -&gt; %d\\n", s1 == s2);        /* SAI: so DIA CHI */
    printf("strcmp(s1,s2) -&gt; %d\\n", strcmp(s1, s2));  /* DUNG: so NOI DUNG */

    char d[20];
    strcpy(d, s1);          /* thay cho  d = s1   */
    strcat(d, " World");    /* thay cho  d = d + " World" */
    printf("d = [%s] len = %zu\\n", d, strlen(d));
    return 0;
}</code></pre>
<p class="dap-an">✅ Đáp án — đã đo. <code>a2 = a1;</code> bị trình biên dịch từ chối với <em>"array type 'char[5]' is not assignable"</em> (cách nói của clang cho câu <em>"assignment to expression with array type"</em> trên slide) — slide đúng. Rồi với hai mảng chứa cùng một nội dung <code>Hello</code>: <code>s1 == s2</code> cho ra <strong>0</strong> (địa chỉ của chúng là <code>0x16efca3b0</code> và <code>0x16efca390</code>, cách nhau 32 byte) trong khi <code>strcmp(s1, s2)</code> trả về <strong>0</strong> với nghĩa là BẰNG NHAU. Hai con số 0 mang hai nghĩa ngược nhau, trên cùng một cặp chuỗi — đó là toàn bộ cái bẫy của slide này. Sau đó <code>strcpy</code> + <code>strcat</code> cho ra <code>d = [Hello World] len = 11</code>.</p>
<p class="pitfall">⚠️ <code>cc -Wall</code> có cảnh báo ở <code>s1 == s2</code> (<em>"array comparison always evaluates to false"</em>), nhưng chỉ vì cả hai vế đều là mảng. So hai biến <code>char *</code> thì cảnh báo biến mất — đoạn mã khi ấy hoàn toàn hợp lệ, so địa chỉ, và vẫn sai. Đừng bao giờ để "biên dịch không cảnh báo gì" thay cho "đã so sánh đúng chuỗi".</p>`],

    ]),
  ].join('\n'),
};
