/**
 * PRF192 · Slot 19-20 — Files, học theo từng slide: PHẦN B (slide 22–42).
 * Deck 'prf9' (PRF9), 42 slide, ảnh đã render sẵn lên CDN images/academy/PRF192/v1/prf9/NNN.webp.
 *
 * Nội dung bám ĐÚNG chữ trích từ Slot_19_20_Files.pptx của trường
 * (/tmp/prf192-text/prf9.txt, slide 22→42). Các slide đặt MÃ NGUỒN / KHUNG CONSOLE
 * TRONG ẢNH (21, 23, 25, 27, 28, 29, 30, 33, 34, 35, 36, 40, 41) đã được đọc thẳng
 * từ ảnh để lấy đúng từng dòng code và từng dòng kết quả.
 *
 * MỌI chương trình và con số dưới đây đã được biên dịch thật bằng `cc -Wall` và chạy:
 *   · slide 23  → "The file is created Successfully." + myFile.txt 0 byte ✓ (mã slide THIẾU fclose)
 *   · slide 25  → tệp 25 byte, chương trình in ra 26 byte: dư 1 byte \377 (EOF in ra dạng ký tự)
 *                 char vs int: tệp có byte 0xFF → bản `char` đọc 2/5 ký tự, bản `int` đọc 5/5 ✓
 *   · slide 27  → numbers.txt = 40 byte trên macOS (slide chụp Windows: 42 byte vì CRLF)
 *                 bỏ fclose + _exit → tệp 0 byte (mất sạch bộ đệm) ✓
 *   · slide 28-30 Demo văn bản → chạy đúng 4 dòng của slide, console TRÙNG KHÍT ảnh
 *                 (25.89 · 13.06 · 999.12 · 12.45), client.txt 73 byte (slide: 77 byte CRLF)
 *     ⚠ `while(!feof(f))` KHÔNG có lệnh đọc mồi → in 5 dòng cho tệp 4 bản ghi (đo thật)
 *     ⚠ scanf hỏng (không phải EOF) → vòng lặp vô tận: 4.018.142 dấu "#" trong 2 giây (đo thật)
 *   · slide 33-36 Demo nhị phân → products.bin = 36 byte, ĐÚNG con số trên ảnh slide 36;
 *                 console TRÙNG KHÍT; sizeof(struct Product)=12, offset 0/4/8, không byte đệm
 *                 cùng dữ liệu bằng fprintf = 39 byte; vòng text làm 1234.5678f → 1234.5699463
 *   · slide 38/41 fseek → bảng ftell trước/sau đo thật; fseek quá cuối tệp trả 0, ftell=41;
 *                 fseek(-1,SEEK_SET) trả -1
 *     ⚠ slide 41 chạy trên tệp 36 byte (CRLF): "funct". Trên macOS tệp 34 byte ra "k fun" ✓
 *   · slide 39-40 rewind → fseek XOÁ cờ EOF nhưng KHÔNG xoá cờ lỗi; rewind xoá CẢ HAI (đo thật)
 *   · các chỗ slide gốc SAI, đã nêu rõ chứ không chép lại:
 *       slide 24 ghi `fgetw()` → clang: "call to undeclared function 'fgetw'" (hàm không tồn tại)
 *       slide 26 ghi fputs "along with a newline character at the end" → od -c: KHÔNG có '\n'
 *       slide 29/30 dùng `while(!feof(...))`, slide 25/40 khai `char c` cho fgetc
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'prf9';

export default {
  title: '10.0b — Slide by slide: Reading and writing text and binary files, fseek and rewind (slides 22–42)|||10.0b — Slide bài giảng: Đọc/ghi tệp văn bản và nhị phân, fseek & rewind (slide 22–42)',
  slug: 'prf192-10-0b-slides-doc-ghi-tep-fseek',
  type: 'DOCUMENT',
  description: 'Nửa sau của Slot 19-20 (slide 22–42): tạo tệp bằng fopen, bốn cặp hàm đọc/ghi tệp văn bản (fprintf/fscanf · fputs/fgets · fputc/fgetc · fwrite/fread), Demo chương trình ghi-đọc tệp văn bản, ghi và đọc tệp NHỊ PHÂN với struct, rồi fseek và rewind để nhảy tới vị trí bất kỳ. Mọi chương trình đều đã biên dịch bằng cc -Wall và chạy thật: nội dung tệp, số byte, dump od -c, bảng ftell trước/sau đều là số đo, không phải số phỏng đoán — kể cả ba chỗ slide gốc ghi sai (hàm fgetw không tồn tại, fputs không tự thêm xuống dòng, mẫu while(!feof) lặp thừa một lần).',
  content: [
    walkHead(D, 22, 42),
    walk(D, [

      [22, '4.3. Create a File in C',
        `<p class="y-chinh">🎯 There is no <code>fcreate()</code> in C. <strong><code>fopen()</code> is both the opener and the creator</strong>: if the file is missing, the right access mode makes it appear. The whole slide is one idea plus the list of modes that can do it.</p>
<ul>
<li><strong>The sentence to memorise</strong> — <em>"The fopen() function can not only open a file but also can create a file if it does not exist already."</em> So "create" is not a separate operation in the list on slide 15; it is a side effect of opening with a writing mode.</li>
<li><strong>The eight creating modes</strong> — <code>w</code>, <code>w+</code>, <code>wb</code>, <code>wb+</code>, <code>a</code>, <code>a+</code>, <code>ab</code>, <code>ab+</code>. Read the pattern instead of memorising eight strings: every mode that starts with <strong><code>w</code></strong> or <strong><code>a</code></strong> creates; every mode that starts with <strong><code>r</code></strong> does not.</li>
<li><strong>Why <code>r</code> is the odd one out</strong> — reading a file that does not exist is meaningless, so <code>fopen("x.txt","r")</code> returns <code>NULL</code> instead of inventing an empty file. That is exactly the failure slide 21 printed on its console: <em>"The file is not opened. The program will now exit."</em></li>
<li><strong><code>w</code> vs <code>a</code> — the difference that destroys data</strong> — both create when the file is absent, but when the file is <em>present</em> <code>w</code> truncates it to zero length and <code>a</code> keeps everything and appends. Choosing <code>w</code> where you meant <code>a</code> is how a student loses a whole data file in one run.</li>
<li><strong>The syntax box is two lines, not one</strong> — <code>FILE *fptr;</code> declares the handle (slide 17), <code>fptr = fopen("filename.txt", "w");</code> fills it. A handle you never assigned is a wild pointer; <code>-Wall</code> will warn <em>"variable is uninitialized when used here"</em>, and the Demo on slide 28 actually triggers that warning.</li>
<li><strong>Where the file lands</strong> — with a bare name like <code>"filename.txt"</code> the file is created in the program's <em>current working directory</em>, which is not always the folder holding the <code>.c</code> file. If you "cannot find" the file you just wrote, look there before blaming the code.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    FILE *fptr;                          /* tay cam (handle) */
    fptr = fopen("filename.txt", "w");   /* mo — va TAO neu chua co */
    if (fptr == NULL) {                  /* LUON kiem tra */
        perror("fopen");
        return 1;
    }
    fclose(fptr);                        /* khong duoc quen */
    return 0;
}</code></pre>
<p class="pitfall">⚠️ Measured: I ran <code>fopen("myFile.txt","w")</code> on a file that already held text. After the run <code>wc -c</code> reported <strong>0 bytes</strong> — the content was gone the instant <code>fopen</code> returned, before a single <code>fprintf</code>. Truncation happens at open time, not at write time, so a mode typo cannot be undone by "not writing anything".</p>`,
        `<p class="y-chinh">🎯 Trong C KHÔNG có hàm <code>fcreate()</code>. <strong><code>fopen()</code> vừa là hàm mở vừa là hàm tạo</strong>: nếu tệp chưa có, chọn đúng chế độ truy cập là nó hiện ra. Cả slide chỉ gói một ý đó cộng danh sách các chế độ làm được việc này.</p>
<ul>
<li><strong>Câu cần thuộc</strong> — <em>"Hàm fopen() không chỉ mở được tệp mà còn tạo được tệp nếu nó chưa tồn tại."</em> Vậy "tạo tệp" không phải một thao tác riêng trong danh sách ở slide 15; nó là hệ quả của việc mở bằng một chế độ ghi.</li>
<li><strong>Tám chế độ tạo được tệp</strong> — <code>w</code>, <code>w+</code>, <code>wb</code>, <code>wb+</code>, <code>a</code>, <code>a+</code>, <code>ab</code>, <code>ab+</code>. Đừng học thuộc tám chuỗi, hãy đọc quy luật: mọi chế độ bắt đầu bằng <strong><code>w</code></strong> hoặc <strong><code>a</code></strong> đều tạo được; mọi chế độ bắt đầu bằng <strong><code>r</code></strong> thì không.</li>
<li><strong>Vì sao <code>r</code> là ngoại lệ</strong> — đọc một tệp không tồn tại là chuyện vô nghĩa, nên <code>fopen("x.txt","r")</code> trả về <code>NULL</code> chứ không tự bịa ra một tệp rỗng. Đó đúng là tình huống console slide 21 in ra: <em>"The file is not opened. The program will now exit."</em></li>
<li><strong><code>w</code> khác <code>a</code> — chỗ khác biệt làm mất dữ liệu</strong> — cả hai đều tạo khi tệp chưa có, nhưng khi tệp ĐÃ có thì <code>w</code> xoá trắng về 0 byte còn <code>a</code> giữ nguyên và ghi thêm vào cuối. Chọn nhầm <code>w</code> trong khi định dùng <code>a</code> là cách sinh viên mất cả tệp dữ liệu chỉ trong một lần chạy.</li>
<li><strong>Khung cú pháp có HAI dòng chứ không phải một</strong> — <code>FILE *fptr;</code> khai tay cầm (slide 17), <code>fptr = fopen("filename.txt", "w");</code> mới điền giá trị vào. Tay cầm chưa gán là con trỏ hoang; <code>-Wall</code> sẽ cảnh báo <em>"variable is uninitialized when used here"</em>, và Demo ở slide 28 dính đúng cảnh báo này.</li>
<li><strong>Tệp rơi vào đâu</strong> — với cái tên trần như <code>"filename.txt"</code>, tệp được tạo trong <em>thư mục làm việc hiện tại</em> của chương trình, không phải lúc nào cũng là thư mục chứa tệp <code>.c</code>. Nếu "không tìm thấy" tệp vừa ghi, hãy nhìn vào đó trước khi đổ lỗi cho mã.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    FILE *fptr;                          /* tay cam (handle) */
    fptr = fopen("filename.txt", "w");   /* mo — va TAO neu chua co */
    if (fptr == NULL) {                  /* LUON kiem tra */
        perror("fopen");
        return 1;
    }
    fclose(fptr);                        /* khong duoc quen */
    return 0;
}</code></pre>
<p class="pitfall">⚠️ Đo thật: tôi chạy <code>fopen("myFile.txt","w")</code> trên một tệp đang có chữ. Sau khi chạy, <code>wc -c</code> báo <strong>0 byte</strong> — nội dung biến mất ngay lúc <code>fopen</code> trả về, trước cả một lệnh <code>fprintf</code> nào. Việc xoá trắng xảy ra lúc MỞ chứ không phải lúc GHI, nên gõ nhầm chế độ thì không cứu được bằng cách "thôi không ghi gì cả".</p>`],

      [23, 'Example of Create a File',
        `<p class="y-chinh">🎯 The 18-line program that turns slide 22 into something you can run: declare <code>FILE* fptr</code>, call <code>fopen("myFile.txt", "w")</code>, test the result against <code>NULL</code>, print one of two messages. The screenshots on the right are the proof: the console says <em>"The file is created Successfully."</em> and Explorer shows a brand-new <code>myFile.txt</code>.</p>
<ul>
<li><strong>Line 5 — <code>FILE* fptr;</code></strong> — the star may sit next to <code>FILE</code> or next to <code>fptr</code>; the compiler does not care. What matters is that <code>fptr</code> is a <em>pointer</em>, so it must be assigned before use.</li>
<li><strong>Line 7 — the creation itself</strong> — <code>fopen("myFile.txt", "w")</code>. Mode <code>"w"</code>, so the file appears if absent and is emptied if present.</li>
<li><strong>Line 9 — the test every file program must have</strong> — <code>if (fptr == NULL)</code>. Note that a failed <code>fopen</code> returns <code>NULL</code>, not a negative number and not <code>0</code> printed as text; comparing with <code>NULL</code> is the only correct test.</li>
<li><strong><code>exit(0)</code> on line 12 is a wrong exit code</strong> — 0 means "success" to the operating system and to any script that checks. A program that is dying because it could not open its file should exit with a nonzero status, e.g. <code>exit(1)</code> — which is what slide 25 does correctly.</li>
<li><strong><code>&lt;stdlib.h&gt;</code> on line 2 is needed for <code>exit()</code></strong>, not for <code>fopen</code>. <code>fopen</code>, <code>fclose</code>, <code>FILE</code> and <code>NULL</code> all come from <code>&lt;stdio.h&gt;</code>.</li>
<li><strong>What the slide forgot: <code>fclose</code></strong> — this program never closes the file. It happens to work because <code>return 0</code> from <code>main</code> flushes and closes every stream; but the habit is dangerous, as the measurement below shows.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
int main()
{
    FILE* fptr;
    // creating file using fopen() access mode "w"
    fptr = fopen("myFile.txt", "w");
    // checking if the file is created
    if (fptr == NULL) {
        printf("The file is not opened. The program will "
               "exit now");
        exit(0);
    }
    else {
        printf("The file is created Successfully.");
    }
    return 0;
}</code></pre>
<p class="dap-an">✅ Đáp án — compiled with <code>cc -Wall</code> and run. Console: <code>The file is created Successfully.</code>, exactly as on the slide. <code>ls -l</code> then shows <code>myFile.txt</code> with size <strong>0</strong>: creating a file and putting something in it are two different acts, and this program only does the first. A second measurement shows what the missing <code>fclose</code> really costs: a variant that writes 18 bytes and then leaves through <code>_exit(1)</code> (which skips the flush) produced a file of <strong>0 bytes</strong> — the text existed only in the library's buffer and died with the process.</p>
<p class="meo">💡 Two lines that make the string on lines 10–11 readable: C glues adjacent string literals together at compile time, so <code>"abc" "def"</code> is one string <code>"abcdef"</code>. That is how a long message is split across two source lines without a single <code>+</code>.</p>`,
        `<p class="y-chinh">🎯 Chương trình 18 dòng biến slide 22 thành thứ chạy được: khai <code>FILE* fptr</code>, gọi <code>fopen("myFile.txt", "w")</code>, so kết quả với <code>NULL</code>, in một trong hai câu. Hai ảnh chụp bên phải là bằng chứng: console hiện <em>"The file is created Successfully."</em> và Explorer hiện một <code>myFile.txt</code> vừa ra đời.</p>
<ul>
<li><strong>Dòng 5 — <code>FILE* fptr;</code></strong> — dấu sao đứng cạnh <code>FILE</code> hay cạnh <code>fptr</code> đều được, trình biên dịch không phân biệt. Điều quan trọng là <code>fptr</code> là một <em>con trỏ</em>, nên phải được gán trước khi dùng.</li>
<li><strong>Dòng 7 — chính là chỗ tạo tệp</strong> — <code>fopen("myFile.txt", "w")</code>. Chế độ <code>"w"</code>, nên tệp hiện ra nếu chưa có và bị xoá trắng nếu đã có.</li>
<li><strong>Dòng 9 — phép kiểm mọi chương trình tệp đều phải có</strong> — <code>if (fptr == NULL)</code>. Nhớ rằng <code>fopen</code> hỏng thì trả <code>NULL</code>, không phải số âm, không phải số <code>0</code> in ra màn hình; so với <code>NULL</code> là phép kiểm duy nhất đúng.</li>
<li><strong><code>exit(0)</code> ở dòng 12 là mã thoát SAI</strong> — số 0 nghĩa là "thành công" đối với hệ điều hành và với mọi script kiểm tra. Một chương trình đang chết vì không mở nổi tệp thì phải thoát với mã khác 0, ví dụ <code>exit(1)</code> — đúng như slide 25 làm.</li>
<li><strong><code>&lt;stdlib.h&gt;</code> ở dòng 2 là để có <code>exit()</code></strong>, không phải để có <code>fopen</code>. <code>fopen</code>, <code>fclose</code>, <code>FILE</code> và <code>NULL</code> đều nằm trong <code>&lt;stdio.h&gt;</code>.</li>
<li><strong>Thứ slide quên: <code>fclose</code></strong> — chương trình này không hề đóng tệp. Nó chạy được vì <code>return 0</code> từ <code>main</code> sẽ xả bộ đệm và đóng mọi luồng; nhưng thói quen ấy nguy hiểm, như phép đo bên dưới cho thấy.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
int main()
{
    FILE* fptr;
    // creating file using fopen() access mode "w"
    fptr = fopen("myFile.txt", "w");
    // checking if the file is created
    if (fptr == NULL) {
        printf("The file is not opened. The program will "
               "exit now");
        exit(0);
    }
    else {
        printf("The file is created Successfully.");
    }
    return 0;
}</code></pre>
<p class="dap-an">✅ Đáp án — đã biên dịch bằng <code>cc -Wall</code> và chạy. Console: <code>The file is created Successfully.</code>, đúng y như trên slide. <code>ls -l</code> sau đó cho thấy <code>myFile.txt</code> kích thước <strong>0</strong>: tạo ra một tệp và bỏ cái gì đó vào trong tệp là hai việc khác nhau, và chương trình này mới làm việc thứ nhất. Phép đo thứ hai cho thấy cái giá thật của việc thiếu <code>fclose</code>: một biến thể ghi 18 byte rồi thoát bằng <code>_exit(1)</code> (lệnh bỏ qua bước xả bộ đệm) để lại tệp <strong>0 byte</strong> — chữ chỉ nằm trong bộ đệm của thư viện và chết theo tiến trình.</p>
<p class="meo">💡 Hai dòng 10–11 đọc được là nhờ một luật của C: hai chuỗi hằng đứng cạnh nhau được dán lại lúc biên dịch, nên <code>"abc" "def"</code> chính là một chuỗi <code>"abcdef"</code>. Đó là cách chẻ một câu dài ra hai dòng mã mà không cần một dấu <code>+</code> nào.</p>`],

      [24, '4.4. Reading From a File',
        `<p class="y-chinh">🎯 A five-row table of reading functions. The real lesson is not the five names but the <strong>pairing</strong>: each reader has a matching writer on slide 26, and the pair must be used together — formatted with formatted, line with line, character with character, block with block.</p>
<ul>
<li><strong><code>fscanf()</code> — "input from a file using a formatted string"</strong> — the file twin of <code>scanf</code>. Same format string, same <code>&amp;</code> on the arguments, one extra first parameter: the <code>FILE *</code>. Returns the <em>number of items successfully converted</em>, and that return value is the correct loop condition (see slide 30).</li>
<li><strong><code>fgets()</code> — "a complete line of text"</strong> — the safe one, because you tell it the buffer size. It is the only reader here that cannot overflow your array if you pass the size honestly.</li>
<li><strong><code>fgetc()</code> — "a single character"</strong> — the finest grain. Its return type is <code>int</code>, not <code>char</code>, and slide 25 is about to fall into exactly that trap.</li>
<li><strong><code>fgetw()</code> — this function does not exist</strong>. There is no <code>fgetw</code> in the C standard library and none on this machine: compiling a call to it gives <em>"call to undeclared function 'fgetw'"</em> and the build fails. The legacy BSD function is <code>getw()</code> (paired with <code>putw()</code> on slide 26), it is not ISO C, and it is not portable. Do not use either in an exam answer unless the question names them.</li>
<li><strong><code>fread()</code> — "a specified number of bytes from a binary file"</strong> — the one slide 32 is dedicated to. Note the phrase "binary file": this is the reader you must NOT mix with the text readers above.</li>
<li><strong>The reading rule of thumb</strong> — if the data was written with <code>fprintf</code>, read it with <code>fscanf</code>/<code>fgets</code>; if it was written with <code>fwrite</code>, read it with <code>fread</code>. Crossing the two does not raise an error, it silently produces nonsense — measured on slide 36.</li>
</ul>
<table>
<tr><th>Reader</th><th>Writer twin</th><th>Returns</th><th>Correct loop test</th></tr>
<tr><td><code>fscanf(f, "%d%s", …)</code></td><td><code>fprintf</code></td><td>items converted</td><td><code>== n</code> (n = number of <code>%</code> items)</td></tr>
<tr><td><code>fgets(buf, size, f)</code></td><td><code>fputs</code></td><td><code>char *</code> or <code>NULL</code></td><td><code>!= NULL</code></td></tr>
<tr><td><code>fgetc(f)</code> / <code>getc(f)</code></td><td><code>fputc</code></td><td><code>int</code>: 0–255 or <code>EOF</code></td><td><code>!= EOF</code>, stored in an <code>int</code></td></tr>
<tr><td><code>fread(&amp;rec, size, n, f)</code></td><td><code>fwrite</code></td><td>elements read</td><td><code>== n</code></td></tr>
<tr><td><code>fgetw(f)</code> ✗</td><td><code>putw</code></td><td>—</td><td>not a standard function</td></tr>
</table>
<p class="pitfall">⚠️ Every one of these four real functions reports failure through its <em>return value</em>. That is why the loop test belongs in the last column of this table and not in <code>feof()</code>. Slides 29 and 30 will use <code>feof()</code> instead, and slide 30 will show — measured — what that costs.</p>`,
        `<p class="y-chinh">🎯 Một bảng năm dòng các hàm đọc. Bài học thật không nằm ở năm cái tên mà ở chuyện <strong>đi theo CẶP</strong>: mỗi hàm đọc đều có một hàm ghi tương ứng ở slide 26, và phải dùng đúng cặp — có định dạng đi với có định dạng, dòng đi với dòng, ký tự đi với ký tự, khối đi với khối.</p>
<ul>
<li><strong><code>fscanf()</code> — "nhập từ tệp bằng chuỗi định dạng"</strong> — bản song sinh của <code>scanf</code> dành cho tệp. Cùng chuỗi định dạng, cùng dấu <code>&amp;</code> ở các đối số, chỉ thêm một tham số đầu tiên: con trỏ <code>FILE *</code>. Nó trả về <em>số mục chuyển đổi thành công</em>, và giá trị trả về ấy mới là điều kiện lặp đúng (xem slide 30).</li>
<li><strong><code>fgets()</code> — "một dòng văn bản trọn vẹn"</strong> — hàm an toàn nhất, vì bạn nói cho nó biết kích thước bộ đệm. Đây là hàm đọc duy nhất trong bảng không thể tràn mảng của bạn, miễn là bạn truyền kích thước trung thực.</li>
<li><strong><code>fgetc()</code> — "một ký tự"</strong> — mức chi tiết nhất. Kiểu trả về của nó là <code>int</code> chứ KHÔNG phải <code>char</code>, và slide 25 sắp rơi đúng vào cái bẫy đó.</li>
<li><strong><code>fgetw()</code> — hàm này KHÔNG tồn tại</strong>. Thư viện chuẩn C không có <code>fgetw</code> và máy này cũng không có: biên dịch một lời gọi tới nó cho lỗi <em>"call to undeclared function 'fgetw'"</em> và build thất bại. Hàm cũ của BSD tên là <code>getw()</code> (đi cặp với <code>putw()</code> ở slide 26), nó không thuộc chuẩn ISO C và không khả chuyển. Đừng dùng cả hai trong bài thi trừ khi đề nêu đích danh.</li>
<li><strong><code>fread()</code> — "trích một số byte xác định từ tệp nhị phân"</strong> — chính là hàm slide 32 dành riêng để nói. Chú ý cụm "tệp nhị phân": đây là hàm đọc KHÔNG được trộn với các hàm đọc văn bản phía trên.</li>
<li><strong>Luật bỏ túi khi đọc</strong> — dữ liệu ghi bằng <code>fprintf</code> thì đọc bằng <code>fscanf</code>/<code>fgets</code>; ghi bằng <code>fwrite</code> thì đọc bằng <code>fread</code>. Bắt chéo hai bên không báo lỗi gì cả, nó âm thầm cho ra rác — đã đo ở slide 36.</li>
</ul>
<table>
<tr><th>Hàm đọc</th><th>Hàm ghi đi cặp</th><th>Trả về</th><th>Điều kiện lặp đúng</th></tr>
<tr><td><code>fscanf(f, "%d%s", …)</code></td><td><code>fprintf</code></td><td>số mục đọc được</td><td><code>== n</code> (n = số mục <code>%</code>)</td></tr>
<tr><td><code>fgets(buf, size, f)</code></td><td><code>fputs</code></td><td><code>char *</code> hoặc <code>NULL</code></td><td><code>!= NULL</code></td></tr>
<tr><td><code>fgetc(f)</code> / <code>getc(f)</code></td><td><code>fputc</code></td><td><code>int</code>: 0–255 hoặc <code>EOF</code></td><td><code>!= EOF</code>, lưu trong biến <code>int</code></td></tr>
<tr><td><code>fread(&amp;rec, size, n, f)</code></td><td><code>fwrite</code></td><td>số phần tử đọc được</td><td><code>== n</code></td></tr>
<tr><td><code>fgetw(f)</code> ✗</td><td><code>putw</code></td><td>—</td><td>không phải hàm chuẩn</td></tr>
</table>
<p class="pitfall">⚠️ Cả bốn hàm thật trong bảng đều báo thất bại qua <em>giá trị trả về</em>. Vì vậy điều kiện lặp nằm ở cột cuối bảng này chứ không nằm trong <code>feof()</code>. Slide 29 và 30 sẽ dùng <code>feof()</code> thay thế, và slide 30 sẽ cho thấy — bằng số đo — cái giá của việc đó.</p>`],

      [25, '4.4. Reading From a File: Example',
        `<p class="y-chinh">🎯 A 20-line program that reads <code>myFile.txt</code> <strong>character by character</strong> with <code>getc</code> and echoes it. The Notepad screenshot shows the file holds <em>"Welcome to FPT University"</em> (25 bytes) and the console prints the same words. It works — and it contains two bugs that the exam loves.</p>
<ul>
<li><strong>Line 6 — <code>char s;</code> is the first bug</strong> — <code>getc</code> returns an <code>int</code> so it can express 256 different bytes <em>plus</em> a 257th value <code>EOF</code>. Squeezing that into a <code>char</code> throws the distinction away. It happens to work here only because plain ASCII text never contains the byte 0xFF.</li>
<li><strong>The measurement</strong> — I built the same reader twice over a 5-byte file <code>AB\\xffCD</code>. The <code>char</code> version stopped after <strong>2 characters</strong> (it read 0xFF, stored it as <code>(char)-1</code>, and mistook it for <code>EOF</code>); the <code>int</code> version read all <strong>5</strong>. Same file, same logic, one keyword different.</li>
<li><strong>Lines 12–16 — <code>do … while</code> is the second bug</strong> — a <code>do</code> loop prints <em>before</em> it tests, so the value returned by the last <code>getc</code> — the <code>EOF</code> itself — is handed to <code>printf("%c")</code> and printed as a character.</li>
<li><strong>The measurement for that one</strong> — the file is 25 bytes; the program's output redirected to a file is <strong>26 bytes</strong>, and <code>od -c</code> shows the extra byte is <code>377</code> (0xFF). On a terminal it looks like nothing or a small box, which is why nobody notices.</li>
<li><strong>The correct shape</strong> — <code>int c; while ((c = fgetc(fp)) != EOF) putchar(c);</code>. Read, test, then use: a <code>while</code> loop, never a <code>do…while</code>. Note the inner parentheses around the assignment — without them <code>c = fgetc(fp) != EOF</code> stores 0 or 1 into <code>c</code>.</li>
<li><strong><code>getc</code> vs <code>fgetc</code></strong> — identical behaviour; <code>getc</code> is allowed to be a macro that may evaluate its argument more than once, so <code>getc(f[i++])</code> is unsafe. Prefer <code>fgetc</code> and the question disappears.</li>
</ul>
<pre><code>/* Ban SLIDE — chay duoc voi van ban thuan, nhung co 2 loi */
char s;
do { s = getc(fp); printf("%c", s); } while (s != EOF);

/* Ban DUNG */
int c;
while ((c = fgetc(fp)) != EOF) putchar(c);</code></pre>
<p class="dap-an">✅ Đáp án — compiled with <code>cc -Wall</code> and run on <code>myFile.txt</code> = <code>Welcome to FPT University</code> (25 bytes). Console shows <code>Welcome to FPT University</code> exactly as on the slide, but the byte-accurate check tells the fuller story: output redirected to a file is <strong>26 bytes</strong>, and <code>od -c</code> ends with <code>… t   y 377</code>. The slide's program is therefore correct <em>on screen</em> and wrong <em>on bytes</em> — and if you ever pipe its output into another file, that stray 0xFF goes with it.</p>
<p class="meo">💡 One sentence covers both bugs: <strong>read into an <code>int</code>, and test before you use</strong>. Every character-reading loop in C that obeys those two rules is correct; every loop that breaks either one is the exam question.</p>`,
        `<p class="y-chinh">🎯 Chương trình 20 dòng đọc <code>myFile.txt</code> <strong>từng ký tự một</strong> bằng <code>getc</code> rồi in ra. Ảnh Notepad cho thấy tệp chứa <em>"Welcome to FPT University"</em> (25 byte) và console in đúng chừng ấy chữ. Nó chạy được — và nó chứa hai lỗi mà đề thi rất thích.</p>
<ul>
<li><strong>Dòng 6 — <code>char s;</code> là lỗi thứ nhất</strong> — <code>getc</code> trả về <code>int</code> để diễn tả được 256 giá trị byte <em>cộng thêm</em> một giá trị thứ 257 là <code>EOF</code>. Nhét chừng đó vào một <code>char</code> là vứt bỏ sự phân biệt ấy. Ở đây nó chạy được chỉ vì văn bản ASCII thuần không bao giờ chứa byte 0xFF.</li>
<li><strong>Số đo</strong> — tôi dựng cùng một bộ đọc hai lần trên tệp 5 byte <code>AB\\xffCD</code>. Bản dùng <code>char</code> dừng sau <strong>2 ký tự</strong> (nó đọc 0xFF, cất thành <code>(char)-1</code>, rồi tưởng đó là <code>EOF</code>); bản dùng <code>int</code> đọc đủ <strong>5</strong>. Cùng tệp, cùng logic, khác đúng một từ khoá.</li>
<li><strong>Dòng 12–16 — <code>do … while</code> là lỗi thứ hai</strong> — vòng <code>do</code> in TRƯỚC rồi mới kiểm tra, nên giá trị mà lần <code>getc</code> cuối cùng trả về — tức chính <code>EOF</code> — bị đưa vào <code>printf("%c")</code> và in ra dưới dạng một ký tự.</li>
<li><strong>Số đo cho lỗi đó</strong> — tệp 25 byte; đầu ra của chương trình khi hứng vào một tệp là <strong>26 byte</strong>, và <code>od -c</code> cho thấy byte thừa là <code>377</code> (0xFF). Trên màn hình nó trông như không có gì hoặc một ô vuông nhỏ, nên chẳng ai để ý.</li>
<li><strong>Dáng viết đúng</strong> — <code>int c; while ((c = fgetc(fp)) != EOF) putchar(c);</code>. Đọc, kiểm, rồi mới dùng: vòng <code>while</code>, không bao giờ <code>do…while</code>. Chú ý cặp ngoặc bao quanh phép gán — thiếu nó thì <code>c = fgetc(fp) != EOF</code> cất số 0 hoặc 1 vào <code>c</code>.</li>
<li><strong><code>getc</code> so với <code>fgetc</code></strong> — hành vi y hệt; <code>getc</code> được phép là một macro có thể tính đối số nhiều lần, nên <code>getc(f[i++])</code> là không an toàn. Cứ dùng <code>fgetc</code> là hết chuyện.</li>
</ul>
<pre><code>/* Ban SLIDE — chay duoc voi van ban thuan, nhung co 2 loi */
char s;
do { s = getc(fp); printf("%c", s); } while (s != EOF);

/* Ban DUNG */
int c;
while ((c = fgetc(fp)) != EOF) putchar(c);</code></pre>
<p class="dap-an">✅ Đáp án — đã biên dịch bằng <code>cc -Wall</code> và chạy trên <code>myFile.txt</code> = <code>Welcome to FPT University</code> (25 byte). Console hiện <code>Welcome to FPT University</code> đúng như slide, nhưng phép kiểm tới từng byte kể câu chuyện đầy đủ hơn: đầu ra hứng vào tệp là <strong>26 byte</strong>, và <code>od -c</code> kết thúc bằng <code>… t   y 377</code>. Vậy chương trình của slide đúng <em>trên màn hình</em> và sai <em>trên byte</em> — và nếu có lúc nào bạn dẫn đầu ra của nó vào một tệp khác thì cái 0xFF lạc ấy đi theo.</p>
<p class="meo">💡 Một câu gói cả hai lỗi: <strong>đọc vào biến <code>int</code>, và kiểm tra trước khi dùng</strong>. Mọi vòng lặp đọc ký tự trong C tuân hai luật đó đều đúng; mọi vòng lặp phá một trong hai luật đều là câu hỏi thi.</p>`],

      [26, '4.5. Write to a File',
        `<p class="y-chinh">🎯 The mirror of slide 24: five writing functions, each the twin of a reader. And the table contains one statement that is simply false — the line about <code>fputs</code> adding a newline. I measured it; it does not.</p>
<ul>
<li><strong><code>fprintf()</code> — "akin to printf(), formatted"</strong> — the workhorse. Everything you know about <code>%d</code>, <code>%s</code>, <code>%.2lf</code> and field widths applies unchanged; the only new thing is the leading <code>FILE *</code>. Human-readable output, and the only kind you can inspect in Notepad.</li>
<li><strong><code>fputs()</code> — the slide says "along with a newline character at the end". <em>It does not.</em></strong> Measured: I wrote <code>fputs("dong mot", f); fputs("dong hai", f);</code> and <code>od -c</code> shows <code>d o n g   m o t d o n g   h a i</code> — 16 bytes, no <code>\\n</code> anywhere. The function that appends a newline is <code>puts()</code>, which writes to <em>stdout</em>. Confusing the two is exactly why this slide's sentence is wrong.</li>
<li><strong>Why that matters for the exam</strong> — if you rely on the slide and write records with <code>fputs</code> only, every record ends up glued onto the next one and <code>fgets</code> can never split them again. Put the <code>\\n</code> in the string yourself: <code>fputs("dong mot\\n", f);</code>.</li>
<li><strong><code>fputc()</code> — "a single character"</strong> — the twin of <code>fgetc</code>. Signature <code>fputc(int c, FILE *f)</code>: the character comes <em>first</em>, the file second — the opposite order to <code>fputs(const char *s, FILE *f)</code>, where the string comes first. Mixing the order is a classic compile error.</li>
<li><strong><code>putw()</code> — "writes a number"</strong> — legacy BSD, not ISO C. Measured on this machine: <code>putw(260, f)</code> produced the four bytes <code>04 01 00 00</code>, i.e. the machine's raw little-endian <code>int</code>, and <code>getw</code> read 260 back. That is not text — it is a tiny <code>fwrite</code> in disguise, which is why slide 13 used the number 260 to illustrate the binary format.</li>
<li><strong><code>fwrite()</code> — "the specified number of bytes to the binary file"</strong> — the subject of slide 31, and the only one here that can store a whole <code>struct</code> in one call.</li>
</ul>
<table>
<tr><th>Writer</th><th>Argument order</th><th>Adds <code>\\n</code>?</th><th>Output readable in Notepad?</th></tr>
<tr><td><code>fprintf(f, "fmt", …)</code></td><td>file first</td><td>only if you write <code>\\n</code></td><td>✅ yes</td></tr>
<tr><td><code>fputs(s, f)</code></td><td>string first</td><td><strong>❌ no</strong> (slide says yes — measured wrong)</td><td>✅ yes</td></tr>
<tr><td><code>fputc(c, f)</code></td><td>char first</td><td>❌ no</td><td>✅ yes</td></tr>
<tr><td><code>putw(n, f)</code></td><td>number first</td><td>❌ no</td><td>❌ no — raw 4 bytes</td></tr>
<tr><td><code>fwrite(&amp;rec, size, n, f)</code></td><td>data first</td><td>❌ no</td><td>❌ no — raw bytes</td></tr>
</table>
<p class="pitfall">⚠️ Notice that only <code>fprintf</code>, <code>fputs</code> and <code>fputc</code> belong to the text world. <code>putw</code> and <code>fwrite</code> write machine representation. Putting both kinds into one file gives you a file that neither a text reader nor a binary reader can parse — a mistake that is invisible until someone opens the file.</p>`,
        `<p class="y-chinh">🎯 Tấm gương soi của slide 24: năm hàm ghi, mỗi hàm là bản song sinh của một hàm đọc. Và bảng này chứa một câu đơn giản là SAI — dòng nói <code>fputs</code> tự thêm ký tự xuống dòng. Tôi đã đo; nó không thêm.</p>
<ul>
<li><strong><code>fprintf()</code> — "giống printf(), có định dạng"</strong> — con ngựa thồ. Mọi thứ bạn biết về <code>%d</code>, <code>%s</code>, <code>%.2lf</code> và độ rộng trường đều giữ nguyên; thứ duy nhất mới là tham số <code>FILE *</code> đứng đầu. Đầu ra đọc được bằng mắt người, và là loại duy nhất soi được bằng Notepad.</li>
<li><strong><code>fputs()</code> — slide ghi "kèm theo một ký tự xuống dòng ở cuối". <em>Không hề.</em></strong> Đo thật: tôi ghi <code>fputs("dong mot", f); fputs("dong hai", f);</code> và <code>od -c</code> cho ra <code>d o n g   m o t d o n g   h a i</code> — 16 byte, không có <code>\\n</code> nào cả. Hàm tự thêm xuống dòng là <code>puts()</code>, mà <code>puts()</code> ghi ra <em>màn hình</em> chứ không ghi ra tệp. Lẫn hai hàm này chính là lý do câu trên slide sai.</li>
<li><strong>Vì sao chuyện đó quan trọng với bài thi</strong> — nếu tin slide mà ghi bản ghi chỉ bằng <code>fputs</code>, mọi bản ghi sẽ dính liền vào bản ghi sau và <code>fgets</code> vĩnh viễn không tách lại được. Hãy tự đặt <code>\\n</code> vào trong chuỗi: <code>fputs("dong mot\\n", f);</code>.</li>
<li><strong><code>fputc()</code> — "ghi một ký tự"</strong> — song sinh của <code>fgetc</code>. Chữ ký <code>fputc(int c, FILE *f)</code>: ký tự đứng TRƯỚC, tệp đứng sau — ngược thứ tự với <code>fputs(const char *s, FILE *f)</code> vốn để chuỗi đứng trước. Nhầm thứ tự là lỗi biên dịch kinh điển.</li>
<li><strong><code>putw()</code> — "ghi một số vào tệp"</strong> — hàm cũ của BSD, không thuộc ISO C. Đo trên máy này: <code>putw(260, f)</code> sinh ra đúng bốn byte <code>04 01 00 00</code>, tức là số <code>int</code> thô theo thứ tự little-endian của máy, và <code>getw</code> đọc lại được 260. Đó không phải văn bản — đó là một <code>fwrite</code> tí hon trá hình, và chính vì vậy slide 13 đã lấy số 260 ra minh hoạ định dạng nhị phân.</li>
<li><strong><code>fwrite()</code> — "ghi số byte xác định vào tệp nhị phân"</strong> — chủ đề của slide 31, và là hàm duy nhất ở đây cất trọn được một <code>struct</code> chỉ bằng một lời gọi.</li>
</ul>
<table>
<tr><th>Hàm ghi</th><th>Thứ tự đối số</th><th>Tự thêm <code>\\n</code>?</th><th>Mở Notepad đọc được?</th></tr>
<tr><td><code>fprintf(f, "fmt", …)</code></td><td>tệp trước</td><td>chỉ khi bạn tự viết <code>\\n</code></td><td>✅ được</td></tr>
<tr><td><code>fputs(s, f)</code></td><td>chuỗi trước</td><td><strong>❌ KHÔNG</strong> (slide ghi có — đo ra là sai)</td><td>✅ được</td></tr>
<tr><td><code>fputc(c, f)</code></td><td>ký tự trước</td><td>❌ không</td><td>✅ được</td></tr>
<tr><td><code>putw(n, f)</code></td><td>số trước</td><td>❌ không</td><td>❌ không — 4 byte thô</td></tr>
<tr><td><code>fwrite(&amp;rec, size, n, f)</code></td><td>dữ liệu trước</td><td>❌ không</td><td>❌ không — byte thô</td></tr>
</table>
<p class="pitfall">⚠️ Để ý rằng chỉ <code>fprintf</code>, <code>fputs</code> và <code>fputc</code> thuộc thế giới văn bản. <code>putw</code> và <code>fwrite</code> ghi biểu diễn máy. Bỏ cả hai loại vào một tệp thì được một tệp mà bộ đọc văn bản lẫn bộ đọc nhị phân đều không phân tích nổi — một lỗi vô hình cho tới khi có người mở tệp ra.</p>`],

      [27, '4.5. Write to a File: Example',
        `<p class="y-chinh">🎯 One program that exercises three writers on the same file: <code>fprintf</code> for a formatted line, <code>fputs</code> for a plain line, <code>fputc</code> for one character. The Notepad screenshot proves they all land in <code>numbers.txt</code>, in the order they were called.</p>
<ul>
<li><strong>Line 8 — <code>fopen("numbers.txt", "w")</code></strong>, and notice what is missing: the <code>if (fptr == NULL)</code> test slide 23 insisted on. If the disk is full or the folder is read-only, this program dereferences <code>NULL</code> and crashes.</li>
<li><strong>Line 11 — <code>fprintf(fptr, "The number is: %d\\n", num);</code></strong> — the formatted writer, and the only one of the three that converts a number into digits. <code>num</code> is the <code>int</code> 42; on disk it becomes the two characters <code>'4'</code> and <code>'2'</code>.</li>
<li><strong>Line 12 — <code>fputs("This is a test line.\\n", fptr);</code></strong> — and here is the practical consequence of the slide-26 error: the <code>\\n</code> is written by hand, inside the string. Delete it and the <code>'A'</code> of the next line would sit right after the full stop.</li>
<li><strong>Line 13 — <code>fputc('A', fptr);</code></strong> — one byte, no newline, so the file ends without a final line break. Notepad shows <code>A</code> alone on the third line with the cursor beside it.</li>
<li><strong>Line 16 — <code>fclose(fptr);</code></strong> — this program does close, and that is what makes the 42 bytes reach the disk before the process ends.</li>
<li><strong>The file-size detail worth a mark</strong> — Explorer reports <strong>42 bytes</strong>. Count the characters and you get 40. The two extra bytes are Windows line endings: each <code>\\n</code> written in text mode becomes <code>\\r\\n</code> on disk, and there are two of them.</li>
</ul>
<pre><code>int main() {
    FILE *fptr;
    int num = 42;

    // Opening the file in write mode
    fptr = fopen("numbers.txt", "w");

    // Writing data to the file using different functions
    fprintf(fptr, "The number is: %d\\n", num);
    fputs("This is a test line.\\n", fptr);
    fputc('A', fptr);

    // Closing the file
    fclose(fptr);

    return 0;
}</code></pre>
<p class="dap-an">✅ Đáp án — compiled with <code>cc -Wall</code> and run. <code>cat numbers.txt</code> gives exactly the three lines of the Notepad screenshot:<br><code>The number is: 42</code> / <code>This is a test line.</code> / <code>A</code>. <code>od -c</code> confirms the layout byte by byte, ending <code>l   i   n   e   .  \\n   A</code> — no trailing newline. <code>wc -c</code> reports <strong>40 bytes on macOS</strong> against the slide's <strong>42 on Windows</strong>; the 2-byte gap is the two <code>\\r</code> that Windows text mode inserts. Same program, same source, two different file sizes — which is the cleanest possible demonstration of why slide 13 called the text format "more portable" but never called it "identical everywhere".</p>
<p class="meo">💡 If an exam asks "how many bytes does this file occupy", always ask back "on which system". Count the visible characters, then add one byte per <code>\\n</code> if the answer is expected for Windows. The C program itself never sees the difference: it wrote <code>\\n</code> and it reads back <code>\\n</code>; the translation happens inside the library.</p>`,
        `<p class="y-chinh">🎯 Một chương trình dùng thử ba hàm ghi trên cùng một tệp: <code>fprintf</code> cho dòng có định dạng, <code>fputs</code> cho dòng chữ trơn, <code>fputc</code> cho một ký tự. Ảnh Notepad chứng minh cả ba đều rơi vào <code>numbers.txt</code>, đúng thứ tự được gọi.</p>
<ul>
<li><strong>Dòng 8 — <code>fopen("numbers.txt", "w")</code></strong>, và hãy để ý thứ THIẾU: phép kiểm <code>if (fptr == NULL)</code> mà slide 23 vừa nhấn mạnh. Nếu đĩa đầy hoặc thư mục chỉ-đọc, chương trình này truy cập qua <code>NULL</code> và sập.</li>
<li><strong>Dòng 11 — <code>fprintf(fptr, "The number is: %d\\n", num);</code></strong> — hàm ghi có định dạng, và là hàm duy nhất trong ba hàm biến một con số thành chữ số. <code>num</code> là số <code>int</code> 42; xuống đĩa nó thành hai ký tự <code>'4'</code> và <code>'2'</code>.</li>
<li><strong>Dòng 12 — <code>fputs("This is a test line.\\n", fptr);</code></strong> — và đây là hệ quả thực tế của chỗ sai ở slide 26: dấu <code>\\n</code> do người viết tự đặt, nằm bên trong chuỗi. Bỏ nó đi thì chữ <code>'A'</code> của dòng sau sẽ dính ngay sau dấu chấm.</li>
<li><strong>Dòng 13 — <code>fputc('A', fptr);</code></strong> — một byte, không có xuống dòng, nên tệp kết thúc mà không có dấu ngắt dòng cuối. Notepad hiện chữ <code>A</code> đứng một mình ở dòng ba với con trỏ ngay bên cạnh.</li>
<li><strong>Dòng 16 — <code>fclose(fptr);</code></strong> — chương trình này CÓ đóng tệp, và chính nhờ vậy 42 byte mới xuống được đĩa trước khi tiến trình kết thúc.</li>
<li><strong>Chi tiết kích thước tệp đáng một điểm</strong> — Explorer báo <strong>42 byte</strong>. Đếm ký tự thì chỉ ra 40. Hai byte dôi ra là ký tự xuống dòng kiểu Windows: mỗi <code>\\n</code> ghi ở chế độ văn bản trở thành <code>\\r\\n</code> trên đĩa, mà ở đây có hai cái.</li>
</ul>
<pre><code>int main() {
    FILE *fptr;
    int num = 42;

    // Opening the file in write mode
    fptr = fopen("numbers.txt", "w");

    // Writing data to the file using different functions
    fprintf(fptr, "The number is: %d\\n", num);
    fputs("This is a test line.\\n", fptr);
    fputc('A', fptr);

    // Closing the file
    fclose(fptr);

    return 0;
}</code></pre>
<p class="dap-an">✅ Đáp án — đã biên dịch bằng <code>cc -Wall</code> và chạy. <code>cat numbers.txt</code> cho đúng ba dòng trong ảnh Notepad:<br><code>The number is: 42</code> / <code>This is a test line.</code> / <code>A</code>. <code>od -c</code> xác nhận bố cục tới từng byte, kết thúc bằng <code>l   i   n   e   .  \\n   A</code> — không có dấu xuống dòng cuối. <code>wc -c</code> báo <strong>40 byte trên macOS</strong> so với <strong>42 byte trên Windows</strong> của slide; chênh 2 byte đúng bằng hai dấu <code>\\r</code> mà chế độ văn bản của Windows chèn vào. Cùng chương trình, cùng mã nguồn, hai kích thước tệp khác nhau — đó là minh hoạ sạch nhất cho việc slide 13 gọi định dạng văn bản là "khả chuyển hơn" chứ chưa bao giờ gọi nó là "giống hệt nhau ở mọi nơi".</p>
<p class="meo">💡 Khi đề thi hỏi "tệp này chiếm bao nhiêu byte", luôn hỏi ngược lại "trên hệ nào". Đếm ký tự nhìn thấy, rồi cộng thêm một byte cho mỗi <code>\\n</code> nếu đáp án được chờ đợi theo Windows. Bản thân chương trình C không hề thấy khác biệt: nó ghi <code>\\n</code> và đọc lại <code>\\n</code>; việc dịch xảy ra bên trong thư viện.</p>`],

      [28, 'Demo: Program Write and Read text file',
        `<p class="y-chinh">🎯 The first complete file program of the slot: <code>main</code> calls <code>inputClients</code> to type accounts into <code>client.txt</code>, then <code>printClients</code> to read the same file back as a table. The two red circles marked <strong>1</strong> trace the writing path, the two blue <strong>2</strong> trace the reading path.</p>
<ul>
<li><strong>Lines 4–5 — prototypes before use</strong> — <code>void inputClients(FILE *p, char *fileName);</code> and <code>printClients</code>. Both take a <code>FILE *</code> that they immediately overwrite with their own <code>fopen</code>; the parameter is therefore useless, and <code>-Wall</code> says so: <em>"variable 'ptr' is uninitialized when used here"</em>.</li>
<li><strong>Why that warning is harmless here but matters</strong> — the functions never read <code>p</code> before assigning it, so nothing bad happens. A cleaner design has each function declare its own local <code>FILE *</code> and take only the filename.</li>
<li><strong>The console on the slide</strong> — the user types four records after the <code>#</code> prompt: <code>6668 MinhTT 25.8889</code>, <code>8888 ThoPN3 13.057</code>, <code>1124 DungPT 999.123</code>, <code>2222 ThuyNT 12.45</code>, then <code>^Z</code> (Ctrl+Z) to signal end of input on Windows.</li>
<li><strong>Ctrl+Z vs Ctrl+D</strong> — <code>^Z</code> at the start of a line is the Windows end-of-file key. On Linux and macOS it is <strong>Ctrl+D</strong>. Same idea, different key, and the message on the slide hard-codes the Windows one.</li>
<li><strong>Where the rounding happens</strong> — you type <code>25.8889</code> and Notepad shows <code>25.89</code>. The value was not truncated on input; <code>fprintf</code> wrote it with <code>%.2lf</code>, so the file only ever held two decimals. The precision is lost at <em>write</em> time and can never be recovered by reading.</li>
<li><strong>The final table</strong> — <code>Account / Name / Balance</code> with the columns aligned by <code>%-10d%-13s%7.2lf</code>. The numbers are right-aligned in a 7-wide field, which is why <code>999.12</code> and <code>12.45</code> line up on the decimal point.</li>
</ul>
<pre><code>int main() {
    FILE *ptr;
    // Write data to file
    inputClients(ptr, "client.txt");
    // Read data to file
    printClients(ptr, "client.txt");
    system("pause");
    return 0;
}</code></pre>
<p class="dap-an">✅ Đáp án — I typed the slide's four records into the compiled program and the console came back <strong>identical to the screenshot</strong>:<br><code>Account   Name         Balance</code><br><code>6668      MinhTT         25.89</code><br><code>8888      ThoPN3         13.06</code><br><code>1124      DungPT        999.12</code><br><code>2222      ThuyNT         12.45</code><br>The real <code>client.txt</code> holds exactly those four lines and measures <strong>73 bytes</strong> on macOS against the <strong>77 bytes</strong> Explorer reports on the slide — four lines, four <code>\\r</code>, the same CRLF arithmetic as slide 27. Note <code>13.057</code> became <code>13.06</code>: <code>%.2lf</code> rounds, it does not truncate.</p>
<p class="pitfall">⚠️ <code>system("pause")</code> on line 13 is a Windows-only command and a habit worth dropping: it shells out to the operating system, it does nothing on Linux or macOS, and it makes the program untestable from a script. Use <code>getchar()</code> if you really want the window to stay open.</p>`,
        `<p class="y-chinh">🎯 Chương trình tệp hoàn chỉnh đầu tiên của slot: <code>main</code> gọi <code>inputClients</code> để gõ các tài khoản vào <code>client.txt</code>, rồi gọi <code>printClients</code> để đọc chính tệp đó ra thành bảng. Hai vòng tròn đỏ số <strong>1</strong> vẽ đường GHI, hai vòng xanh số <strong>2</strong> vẽ đường ĐỌC.</p>
<ul>
<li><strong>Dòng 4–5 — khai báo nguyên mẫu trước khi dùng</strong> — <code>void inputClients(FILE *p, char *fileName);</code> và <code>printClients</code>. Cả hai nhận một <code>FILE *</code> rồi ghi đè ngay bằng <code>fopen</code> của chính nó; vậy tham số ấy vô dụng, và <code>-Wall</code> nói thẳng: <em>"variable 'ptr' is uninitialized when used here"</em>.</li>
<li><strong>Vì sao cảnh báo đó vô hại ở đây nhưng vẫn đáng quan tâm</strong> — hai hàm không hề ĐỌC <code>p</code> trước khi gán, nên không có chuyện gì xảy ra. Thiết kế sạch hơn là mỗi hàm tự khai một <code>FILE *</code> cục bộ và chỉ nhận tên tệp.</li>
<li><strong>Console trên slide</strong> — người dùng gõ bốn bản ghi sau dấu nhắc <code>#</code>: <code>6668 MinhTT 25.8889</code>, <code>8888 ThoPN3 13.057</code>, <code>1124 DungPT 999.123</code>, <code>2222 ThuyNT 12.45</code>, rồi <code>^Z</code> (Ctrl+Z) để báo hết nhập trên Windows.</li>
<li><strong>Ctrl+Z hay Ctrl+D</strong> — <code>^Z</code> ở đầu dòng là phím báo hết tệp của Windows. Trên Linux và macOS là <strong>Ctrl+D</strong>. Cùng một ý, khác phím, và dòng thông báo trên slide gắn cứng phím của Windows.</li>
<li><strong>Chỗ làm tròn xảy ra</strong> — bạn gõ <code>25.8889</code> mà Notepad hiện <code>25.89</code>. Giá trị không bị cắt lúc nhập; <code>fprintf</code> ghi nó bằng <code>%.2lf</code>, nên trong tệp chưa bao giờ có quá hai chữ số thập phân. Độ chính xác mất ở khâu GHI và không bao giờ đọc lại được nữa.</li>
<li><strong>Bảng cuối</strong> — <code>Account / Name / Balance</code>, các cột thẳng hàng nhờ <code>%-10d%-13s%7.2lf</code>. Số căn phải trong ô rộng 7, nên <code>999.12</code> và <code>12.45</code> thẳng nhau ở dấu chấm thập phân.</li>
</ul>
<pre><code>int main() {
    FILE *ptr;
    // Write data to file
    inputClients(ptr, "client.txt");
    // Read data to file
    printClients(ptr, "client.txt");
    system("pause");
    return 0;
}</code></pre>
<p class="dap-an">✅ Đáp án — tôi gõ đúng bốn bản ghi của slide vào chương trình đã biên dịch và console trả về <strong>giống hệt ảnh chụp</strong>:<br><code>Account   Name         Balance</code><br><code>6668      MinhTT         25.89</code><br><code>8888      ThoPN3         13.06</code><br><code>1124      DungPT        999.12</code><br><code>2222      ThuyNT         12.45</code><br>Tệp <code>client.txt</code> thật chứa đúng bốn dòng đó và nặng <strong>73 byte</strong> trên macOS so với <strong>77 byte</strong> Explorer báo trên slide — bốn dòng, bốn dấu <code>\\r</code>, cùng phép tính CRLF như slide 27. Chú ý <code>13.057</code> thành <code>13.06</code>: <code>%.2lf</code> LÀM TRÒN chứ không cắt bỏ.</p>
<p class="pitfall">⚠️ <code>system("pause")</code> ở dòng 13 là lệnh chỉ có trên Windows và là thói quen nên bỏ: nó gọi ra hệ điều hành, nó không làm gì trên Linux hay macOS, và nó khiến chương trình không kiểm thử tự động được. Muốn giữ cửa sổ mở thì dùng <code>getchar()</code>.</p>`],

      [29, 'Demo (cont.) — inputClients',
        `<p class="y-chinh">🎯 The writing half, lines 16–40. The structure is worth copying: open with a test, prompt, <strong>read one record before the loop</strong>, then loop {write, prompt, read next}. The structure is right; the loop <em>condition</em> — <code>while(!feof(stdin))</code> — is the classic mistake of C file handling.</p>
<ul>
<li><strong>Line 18 — assignment inside the test</strong> — <code>if((p = fopen(fileName, "w")) == NULL)</code> does two things in one line: open, and compare the result with <code>NULL</code>. The inner parentheses are compulsory; <code>=</code> binds looser than <code>==</code>.</li>
<li><strong>Line 30 — the priming read</strong> — <code>scanf("%d%29s%lf", &amp;account, name, &amp;balance);</code> before the loop starts. This is what saves the program: without it, <code>feof</code> could not possibly be set yet and the very first iteration would write uninitialised garbage.</li>
<li><strong><code>%29s</code>, not <code>%s</code></strong> — the width limit is the one genuinely good safety habit on this slide. <code>name</code> is <code>char[30]</code>, so at most 29 characters plus the terminating <code>'\\0'</code>. Drop the 29 and a long name overruns the array.</li>
<li><strong><code>name</code> has no <code>&amp;</code>, the other two do</strong> — because an array name already <em>is</em> the address of its first element, while <code>account</code> and <code>balance</code> are plain variables. This asymmetry costs marks in every exam.</li>
<li><strong>Line 33 — <code>while(!feof(stdin))</code> is wrong even though it works here</strong> — <code>feof</code> answers "did a previous read already hit the end?", not "is there more?". With the priming read the program happens to produce the right number of records, but the condition is blind to a <em>different</em> failure: a value that does not parse.</li>
<li><strong>The measurement that proves it</strong> — I fed the compiled program one malformed line, <code>6668 MinhTT abc</code>. <code>scanf</code> returned 2 instead of 3, left <code>abc</code> sitting in the input, and never set the EOF flag. The loop then span forever: in <strong>2 seconds it printed 4,018,142 <code>#</code> prompts</strong> and 8 MB of output before I killed it.</li>
</ul>
<pre><code>/* Ban SLIDE: dieu kien mu voi loi phan tich */
scanf("%d%29s%lf", &amp;account, name, &amp;balance);
while (!feof(stdin)) {
    fprintf(p, "%d %s %.2lf\\n", account, name, balance);
    printf("%s", "# ");
    scanf("%d%29s%lf", &amp;account, name, &amp;balance);
}

/* Ban DUNG: lay gia tri tra ve lam dieu kien */
while (scanf("%d%29s%lf", &amp;account, name, &amp;balance) == 3) {
    fprintf(p, "%d %s %.2lf\\n", account, name, balance);
    printf("%s", "# ");
}</code></pre>
<p class="dap-an">✅ Đáp án — with well-formed input the slide's version is correct: four records typed, four lines in <code>client.txt</code>, measured. With <em>one</em> bad token it hangs forever, measured at 4,018,142 iterations in 2 seconds. The corrected form on the right stops cleanly on both end-of-input and bad input, because <code>scanf</code>'s return value distinguishes "3 items read" from "2 items read" from "<code>EOF</code>" — three outcomes that <code>feof</code> collapses into two.</p>
<p class="meo">💡 Remember the shape rather than the rule: <strong>the thing you test must be the thing that reads.</strong> <code>while (scanf(...) == 3)</code>, <code>while (fgets(...) != NULL)</code>, <code>while ((c = fgetc(f)) != EOF)</code>, <code>while (fread(...) == 1)</code>. In all four the reading call sits inside the condition; <code>feof</code> never does.</p>`,
        `<p class="y-chinh">🎯 Nửa GHI, dòng 16–40. Bộ khung đáng chép lại: mở kèm phép kiểm, nhắc nhập, <strong>đọc một bản ghi TRƯỚC vòng lặp</strong>, rồi lặp {ghi, nhắc, đọc tiếp}. Khung thì đúng; nhưng ĐIỀU KIỆN lặp — <code>while(!feof(stdin))</code> — là lỗi kinh điển của việc xử lý tệp trong C.</p>
<ul>
<li><strong>Dòng 18 — phép gán nằm trong phép kiểm</strong> — <code>if((p = fopen(fileName, "w")) == NULL)</code> làm hai việc trong một dòng: mở, và so kết quả với <code>NULL</code>. Cặp ngoặc bên trong là BẮT BUỘC; <code>=</code> có độ ưu tiên thấp hơn <code>==</code>.</li>
<li><strong>Dòng 30 — lệnh đọc mồi</strong> — <code>scanf("%d%29s%lf", &amp;account, name, &amp;balance);</code> đặt trước vòng lặp. Chính nó cứu chương trình: không có nó thì <code>feof</code> chưa thể được bật và vòng đầu tiên sẽ ghi ra rác chưa khởi tạo.</li>
<li><strong><code>%29s</code> chứ không phải <code>%s</code></strong> — giới hạn độ rộng là thói quen an toàn thật sự tốt duy nhất trên slide này. <code>name</code> là <code>char[30]</code>, nên nhiều nhất 29 ký tự cộng dấu kết <code>'\\0'</code>. Bỏ số 29 đi thì một cái tên dài sẽ tràn mảng.</li>
<li><strong><code>name</code> không có <code>&amp;</code>, hai biến kia thì có</strong> — vì tên mảng BẢN THÂN nó đã là địa chỉ phần tử đầu, còn <code>account</code> và <code>balance</code> là biến thường. Chỗ bất đối xứng này làm mất điểm ở mọi kỳ thi.</li>
<li><strong>Dòng 33 — <code>while(!feof(stdin))</code> SAI dù ở đây nó chạy được</strong> — <code>feof</code> trả lời câu "lần đọc TRƯỚC đã chạm hết tệp chưa?", không phải câu "còn dữ liệu không?". Nhờ lệnh đọc mồi mà chương trình tình cờ cho đúng số bản ghi, nhưng điều kiện ấy mù trước một loại hỏng KHÁC: một giá trị không phân tích được.</li>
<li><strong>Phép đo chứng minh</strong> — tôi đưa vào chương trình đã biên dịch đúng một dòng sai: <code>6668 MinhTT abc</code>. <code>scanf</code> trả về 2 thay vì 3, để nguyên chữ <code>abc</code> trong luồng nhập, và không hề bật cờ EOF. Vòng lặp quay mãi: trong <strong>2 giây nó in ra 4.018.142 dấu nhắc <code>#</code></strong> và 8 MB đầu ra trước khi tôi giết tiến trình.</li>
</ul>
<pre><code>/* Ban SLIDE: dieu kien mu voi loi phan tich */
scanf("%d%29s%lf", &amp;account, name, &amp;balance);
while (!feof(stdin)) {
    fprintf(p, "%d %s %.2lf\\n", account, name, balance);
    printf("%s", "# ");
    scanf("%d%29s%lf", &amp;account, name, &amp;balance);
}

/* Ban DUNG: lay gia tri tra ve lam dieu kien */
while (scanf("%d%29s%lf", &amp;account, name, &amp;balance) == 3) {
    fprintf(p, "%d %s %.2lf\\n", account, name, balance);
    printf("%s", "# ");
}</code></pre>
<p class="dap-an">✅ Đáp án — với dữ liệu nhập chuẩn thì bản của slide đúng: gõ bốn bản ghi, tệp <code>client.txt</code> có bốn dòng, đã đo. Nhưng chỉ cần MỘT mẩu nhập sai là nó treo vĩnh viễn, đo được 4.018.142 vòng trong 2 giây. Bản sửa bên phải dừng gọn gàng cả khi hết dữ liệu lẫn khi dữ liệu hỏng, vì giá trị trả về của <code>scanf</code> phân biệt được "đọc 3 mục" với "đọc 2 mục" với "<code>EOF</code>" — ba kết cục mà <code>feof</code> gộp lại chỉ còn hai.</p>
<p class="meo">💡 Hãy nhớ cái DÁNG chứ đừng nhớ luật: <strong>thứ bạn kiểm tra phải chính là thứ đi đọc.</strong> <code>while (scanf(...) == 3)</code>, <code>while (fgets(...) != NULL)</code>, <code>while ((c = fgetc(f)) != EOF)</code>, <code>while (fread(...) == 1)</code>. Cả bốn đều đặt lời gọi đọc bên trong điều kiện; <code>feof</code> thì không bao giờ.</p>`],

      [30, 'Demo (cont.) — printClients',
        `<p class="y-chinh">🎯 The reading half, lines 42–60, and the perfect mirror of slide 29: open <code>"r"</code>, print the header, <strong>read one record before the loop</strong>, then loop {print, read next}. Same priming read, same <code>while(!feof(p))</code>, and this slide is where the cost can be measured exactly.</p>
<ul>
<li><strong>Line 43 — mode <code>"r"</code> this time</strong>, and the same <code>== NULL</code> test. Opening for reading a file that <code>inputClients</code> just wrote cannot fail, but the check stays — it is the habit, not the paranoia, that matters.</li>
<li><strong>Line 50 — the header</strong> — <code>printf("%-10s%-13s%s\\n", "Account", "Name", "Balance")</code>. The widths 10 and 13 are repeated on line 55 for the data, which is why the columns line up. Change one and you must change both.</li>
<li><strong>Line 51 — the priming <code>fscanf</code></strong>, identical to the one in <code>inputClients</code> except that the stream is <code>p</code> instead of <code>stdin</code>. The symmetry is deliberate and worth noticing: reading from a file and reading from the keyboard are the same operation on different streams.</li>
<li><strong>Line 54 — <code>while(!feof(p))</code> — correct here ONLY because of line 51</strong>. Trace it: after the fourth record is read, the EOF flag is still clear (the read succeeded), so the loop body runs once more, prints record 4, and the fifth <code>fscanf</code> fails and sets the flag. Exit. Four records in, four records out.</li>
<li><strong>Remove the priming read and it breaks — measured</strong> — I ran the textbook-wrong shape <code>while(!feof(f)) { fscanf(...); printf(...); }</code> on the real <code>client.txt</code>. It printed <strong>5 lines for 4 records</strong>, and line 5 was <code>2222 ThuyNT 12.45</code> again: the failed <code>fscanf</code> left the variables untouched, so the loop printed stale data before noticing the end.</li>
<li><strong>Line 55 — <code>%7.2lf</code></strong> — width 7, two decimals, right-aligned. That is what makes <code>999.12</code> and <code>12.45</code> share a decimal column in the screenshot on slide 28.</li>
</ul>
<table>
<tr><th>Loop shape</th><th>Lines printed for a 4-record file</th><th>Verdict</th></tr>
<tr><td>priming read + <code>while(!feof)</code> (the slide)</td><td>4</td><td>works — but blind to parse errors</td></tr>
<tr><td><code>while(!feof){ read; print; }</code> (no priming)</td><td><strong>5</strong> — last record duplicated</td><td>❌ the classic bug</td></tr>
<tr><td><code>while(fscanf(...) == 3){ print; }</code></td><td>4</td><td>✅ correct and shortest</td></tr>
</table>
<p class="dap-an">✅ Đáp án — all three rows above are measured on the same 73-byte <code>client.txt</code> produced by slide 29's program. The middle row's fifth line is byte-identical to its fourth, which is the signature of this bug: <em>not</em> a crash, <em>not</em> garbage, but one plausible-looking duplicate record. In a 10,000-row payroll file you would never spot it by eye.</p>
<p class="pitfall">⚠️ <code>feof()</code> only becomes true <strong>after</strong> a read has already failed. That single sentence explains both the duplicate line here and the infinite loop on slide 29. Say it out loud before writing any file loop: <em>"feof looks backwards, not forwards."</em></p>`,
        `<p class="y-chinh">🎯 Nửa ĐỌC, dòng 42–60, và là tấm gương soi hoàn hảo của slide 29: mở bằng <code>"r"</code>, in tiêu đề cột, <strong>đọc một bản ghi TRƯỚC vòng lặp</strong>, rồi lặp {in, đọc tiếp}. Vẫn lệnh đọc mồi ấy, vẫn <code>while(!feof(p))</code> ấy, và chính ở slide này cái giá đo được chính xác.</p>
<ul>
<li><strong>Dòng 43 — lần này là chế độ <code>"r"</code></strong>, và vẫn phép kiểm <code>== NULL</code>. Mở đọc một tệp mà <code>inputClients</code> vừa ghi thì khó mà hỏng, nhưng phép kiểm vẫn giữ — cái đáng giá là THÓI QUEN chứ không phải sự đa nghi.</li>
<li><strong>Dòng 50 — dòng tiêu đề</strong> — <code>printf("%-10s%-13s%s\\n", "Account", "Name", "Balance")</code>. Độ rộng 10 và 13 được lặp lại ở dòng 55 cho phần dữ liệu, nhờ đó các cột mới thẳng hàng. Đổi một chỗ thì phải đổi cả hai.</li>
<li><strong>Dòng 51 — lệnh <code>fscanf</code> mồi</strong>, y hệt lệnh trong <code>inputClients</code> chỉ khác luồng là <code>p</code> thay vì <code>stdin</code>. Sự đối xứng này là cố ý và đáng để ý: đọc từ tệp và đọc từ bàn phím là CÙNG một thao tác trên hai luồng khác nhau.</li>
<li><strong>Dòng 54 — <code>while(!feof(p))</code> — đúng ở đây CHỈ nhờ dòng 51</strong>. Hãy lần dấu: sau khi bản ghi thứ tư được đọc, cờ EOF vẫn tắt (lần đọc đó thành công), nên thân vòng chạy thêm một lượt, in bản ghi 4, rồi lần <code>fscanf</code> thứ năm thất bại và bật cờ. Thoát. Vào bốn bản ghi, ra bốn bản ghi.</li>
<li><strong>Bỏ lệnh đọc mồi đi là vỡ — đã đo</strong> — tôi chạy đúng cái dáng sai kinh điển <code>while(!feof(f)) { fscanf(...); printf(...); }</code> trên <code>client.txt</code> thật. Nó in <strong>5 dòng cho 4 bản ghi</strong>, và dòng thứ 5 lại là <code>2222 ThuyNT 12.45</code>: lần <code>fscanf</code> thất bại không đụng tới các biến, nên vòng lặp in lại dữ liệu cũ trước khi kịp nhận ra đã hết tệp.</li>
<li><strong>Dòng 55 — <code>%7.2lf</code></strong> — rộng 7, hai chữ số thập phân, căn phải. Chính nó làm <code>999.12</code> và <code>12.45</code> chung một cột thập phân trong ảnh chụp ở slide 28.</li>
</ul>
<table>
<tr><th>Dáng vòng lặp</th><th>Số dòng in ra với tệp 4 bản ghi</th><th>Kết luận</th></tr>
<tr><td>đọc mồi + <code>while(!feof)</code> (như slide)</td><td>4</td><td>chạy được — nhưng mù trước lỗi phân tích</td></tr>
<tr><td><code>while(!feof){ đọc; in; }</code> (không đọc mồi)</td><td><strong>5</strong> — lặp lại bản ghi cuối</td><td>❌ lỗi kinh điển</td></tr>
<tr><td><code>while(fscanf(...) == 3){ in; }</code></td><td>4</td><td>✅ đúng và ngắn nhất</td></tr>
</table>
<p class="dap-an">✅ Đáp án — cả ba dòng trong bảng đều đo trên cùng tệp <code>client.txt</code> 73 byte do chương trình slide 29 sinh ra. Dòng thứ năm của hàng giữa giống hệt từng byte với dòng thứ tư, và đó là dấu vân tay của lỗi này: KHÔNG sập, KHÔNG ra rác, mà ra đúng một bản ghi trùng trông rất hợp lý. Trong một tệp bảng lương 10.000 dòng thì mắt thường không đời nào thấy.</p>
<p class="pitfall">⚠️ <code>feof()</code> chỉ trở thành đúng <strong>SAU KHI</strong> một lần đọc đã thất bại. Một câu đó giải thích cả dòng trùng ở đây lẫn vòng lặp vô tận ở slide 29. Hãy đọc to nó lên trước khi viết bất kỳ vòng lặp tệp nào: <em>"feof nhìn về phía sau, không nhìn về phía trước."</em></p>`],

      [31, '4.6. Write to a Binary File',
        `<p class="y-chinh">🎯 The signature that lets you store a whole <code>struct</code> in one call: <code>size_t fwrite(const void *ptr, size_t size, size_t nmemb, FILE *file_pointer);</code>. Four parameters, and the slide names each one. This is where the deck leaves the human-readable world behind.</p>
<ul>
<li><strong><code>ptr</code> — "a reference to the memory block holding the data"</strong> — the <em>address</em> of what you want saved, so in practice <code>&amp;product</code> for one record or the bare array name for many. Its declared type is <code>const void *</code>, meaning "address of anything": that is how one function can write ints, doubles, arrays and structs alike.</li>
<li><strong><code>size</code> — "the byte size of each element"</strong> — never a number you type by hand. Write <code>sizeof(struct Product)</code> and the compiler computes 12 for you; write <code>12</code> and the program breaks the day someone adds a field.</li>
<li><strong><code>nmemb</code> — "the count of elements"</strong> — 1 for a single record, <code>n</code> for a whole array in one call. <code>size * nmemb</code> is the total byte count, which is why <code>fwrite(a, sizeof a[0], 3, f)</code> and <code>fwrite(a, sizeof a, 1, f)</code> write the same bytes.</li>
<li><strong><code>file_pointer</code> — the stream</strong>, and it must have been opened in a mode containing <strong><code>b</code></strong>: <code>"wb"</code>, <code>"ab"</code>, <code>"wb+"</code>, <code>"rb+"</code>. On Windows, forgetting the <code>b</code> means any byte that happens to equal 0x0A is silently expanded to 0x0D 0x0A and the file is corrupted.</li>
<li><strong>Return value — "the number of objects successfully written"</strong>, i.e. elements, <strong>not bytes</strong>. So the correct error check for one record is <code>if (fwrite(&amp;p, sizeof p, 1, f) != 1) { … }</code>, never <code>!= sizeof p</code>.</li>
<li><strong>What "binary form" really means</strong> — <code>fwrite</code> copies the bytes of memory as they are. No conversion, no formatting, no <code>%d</code>. The value 101 travels to disk as the four bytes <code>65 00 00 00</code>, which is what slide 13 drew and what slide 36 will measure.</li>
</ul>
<pre><code>struct Product { int product_id; float price; int quantity; };

struct Product p = {101, 10.99f, 50};
FILE *f = fopen("products.bin", "wb");      /* chu 'b' BAT BUOC */
if (f == NULL) { perror("fopen"); return 1; }

if (fwrite(&amp;p, sizeof(struct Product), 1, f) != 1)   /* so PHAN TU, khong phai byte */
    fprintf(stderr, "ghi hong\\n");

fclose(f);</code></pre>
<p class="dap-an">✅ Đáp án — measured: <code>sizeof(int)</code> = 4, <code>sizeof(float)</code> = 4, <code>sizeof(struct Product)</code> = <strong>12</strong>, with <code>offsetof</code> giving 0 / 4 / 8 — no padding bytes at all, because every field is 4 bytes wide and already aligned. Writing that one record produced a file of exactly 12 bytes; writing three produced 36, which is the number Explorer shows on slide 36.</p>
<p class="meo">💡 Three habits that make <code>fwrite</code> safe: <em>(1)</em> always <code>sizeof(type)</code>, never a literal; <em>(2)</em> always the mode with <code>b</code>; <em>(3)</em> always compare the return value against <code>nmemb</code>. Break any one and the failure is silent — the file looks fine and the data is wrong.</p>`,
        `<p class="y-chinh">🎯 Chữ ký cho phép cất trọn một <code>struct</code> chỉ bằng một lời gọi: <code>size_t fwrite(const void *ptr, size_t size, size_t nmemb, FILE *file_pointer);</code>. Bốn tham số, và slide gọi tên từng cái. Đây là chỗ deck rời bỏ thế giới đọc-được-bằng-mắt.</p>
<ul>
<li><strong><code>ptr</code> — "tham chiếu tới khối nhớ chứa dữ liệu"</strong> — là ĐỊA CHỈ của thứ muốn lưu, nên trong thực tế là <code>&amp;product</code> cho một bản ghi hoặc tên mảng trần cho nhiều bản ghi. Kiểu khai của nó là <code>const void *</code>, nghĩa là "địa chỉ của bất cứ thứ gì": nhờ vậy một hàm duy nhất ghi được cả int, double, mảng lẫn struct.</li>
<li><strong><code>size</code> — "kích thước tính bằng byte của mỗi phần tử"</strong> — đừng bao giờ là con số gõ tay. Viết <code>sizeof(struct Product)</code> để trình biên dịch tự tính ra 12; viết <code>12</code> thì chương trình vỡ vào ngày có người thêm một trường.</li>
<li><strong><code>nmemb</code> — "số phần tử"</strong> — bằng 1 cho một bản ghi, bằng <code>n</code> cho cả mảng trong một lời gọi. <code>size * nmemb</code> là tổng số byte, vì vậy <code>fwrite(a, sizeof a[0], 3, f)</code> và <code>fwrite(a, sizeof a, 1, f)</code> ghi ra cùng một dãy byte.</li>
<li><strong><code>file_pointer</code> — luồng tệp</strong>, và nó phải được mở bằng chế độ có chữ <strong><code>b</code></strong>: <code>"wb"</code>, <code>"ab"</code>, <code>"wb+"</code>, <code>"rb+"</code>. Trên Windows, quên chữ <code>b</code> nghĩa là mọi byte tình cờ bằng 0x0A đều bị âm thầm nở thành 0x0D 0x0A và tệp hỏng.</li>
<li><strong>Giá trị trả về — "số đối tượng ghi thành công"</strong>, tức là số PHẦN TỬ, <strong>không phải số byte</strong>. Vậy phép kiểm lỗi đúng cho một bản ghi là <code>if (fwrite(&amp;p, sizeof p, 1, f) != 1) { … }</code>, không bao giờ là <code>!= sizeof p</code>.</li>
<li><strong>"Dạng nhị phân" thật sự nghĩa là gì</strong> — <code>fwrite</code> chép nguyên xi các byte trong bộ nhớ. Không chuyển đổi, không định dạng, không <code>%d</code>. Giá trị 101 xuống đĩa thành bốn byte <code>65 00 00 00</code>, đúng thứ slide 13 đã vẽ và slide 36 sắp đo.</li>
</ul>
<pre><code>struct Product { int product_id; float price; int quantity; };

struct Product p = {101, 10.99f, 50};
FILE *f = fopen("products.bin", "wb");      /* chu 'b' BAT BUOC */
if (f == NULL) { perror("fopen"); return 1; }

if (fwrite(&amp;p, sizeof(struct Product), 1, f) != 1)   /* so PHAN TU, khong phai byte */
    fprintf(stderr, "ghi hong\\n");

fclose(f);</code></pre>
<p class="dap-an">✅ Đáp án — đo thật: <code>sizeof(int)</code> = 4, <code>sizeof(float)</code> = 4, <code>sizeof(struct Product)</code> = <strong>12</strong>, với <code>offsetof</code> cho 0 / 4 / 8 — không có một byte đệm nào, vì mọi trường đều rộng 4 byte và đã thẳng hàng sẵn. Ghi một bản ghi đó ra cho tệp đúng 12 byte; ghi ba bản ghi cho 36 byte, đúng con số Explorer hiện ở slide 36.</p>
<p class="meo">💡 Ba thói quen làm <code>fwrite</code> an toàn: <em>(1)</em> luôn dùng <code>sizeof(kiểu)</code>, không bao giờ số trần; <em>(2)</em> luôn dùng chế độ có chữ <code>b</code>; <em>(3)</em> luôn so giá trị trả về với <code>nmemb</code>. Phá một trong ba thì thất bại diễn ra âm thầm — tệp trông vẫn ổn mà dữ liệu thì sai.</p>`],

      [32, '4.7. Reading from Binary File',
        `<p class="y-chinh">🎯 The exact mirror of slide 31: <code>size_t fread(void *memory_ptr, size_t size, size_t nmemb, FILE *file_pointer);</code>. Same four parameters in the same order, same <code>size_t</code> return, and one important difference — the first parameter is <code>void *</code> without <code>const</code>, because this one <em>fills</em> the memory instead of reading it.</p>
<ul>
<li><strong><code>memory_ptr</code> — "where the data will be stored"</strong> — and it is your job to make sure that memory exists and is big enough. <code>fread</code> will happily write 12 bytes into a 4-byte variable; nothing warns you, the stack is simply overwritten.</li>
<li><strong><code>size</code> and <code>nmemb</code> must match the write exactly</strong> — the file has no header saying "records of 12 bytes". If you wrote <code>sizeof(struct Product)</code> and read <code>sizeof(struct Item)</code>, every field lands at the wrong offset and the program prints plausible nonsense.</li>
<li><strong>Return value — "the number of objects successfully read"</strong> — elements, not bytes, and it is the <em>only</em> honest way to detect the end of a binary file. Measured: on the 3-record <code>products.bin</code> I called <code>fread(tmp, sizeof(struct Product), 10, f)</code> asking for ten; it returned <strong>3</strong>, with <code>feof</code> = 1 and <code>ferror</code> = 0.</li>
<li><strong>That measurement contains the whole error-handling rule</strong> — a short read means either end-of-file or a real I/O error, and the two are told apart by <code>feof(f)</code> versus <code>ferror(f)</code> <em>after</em> the fact. That is the one legitimate use of <code>feof</code>: diagnosing why a read stopped, never deciding whether to read.</li>
<li><strong>The loop shape slide 35 will use</strong> — <code>while (fread(&amp;product, sizeof(struct Product), 1, filePtr) == 1)</code>. One record per call, and the condition is the call itself. Compare it with slide 30's <code>while(!feof(p))</code>: the binary half of this deck gets it right and the text half does not.</li>
<li><strong>Mode <code>"rb"</code></strong> — the reading twin of <code>"wb"</code>. The <code>b</code> matters for the same reason as before, and it also documents intent to whoever reads the code next.</li>
</ul>
<pre><code>struct Product p;
FILE *f = fopen("products.bin", "rb");
if (f == NULL) { perror("fopen"); return 1; }

while (fread(&amp;p, sizeof(struct Product), 1, f) == 1)
    printf("ID=%d Price=%.2f Qty=%d\\n", p.product_id, p.price, p.quantity);

if (ferror(f)) fprintf(stderr, "loi doc that su\\n");
else if (feof(f)) ;            /* het tep — binh thuong */
fclose(f);</code></pre>
<p class="dap-an">✅ Đáp án — measured on the real 36-byte <code>products.bin</code>: the loop above printed exactly three lines and stopped; the single-call experiment asking for 10 elements returned <strong>3</strong>, <code>feof=1</code>, <code>ferror=0</code>. Also measured, the danger of mismatching the pair: reading a file that was written with <code>fprintf("101 10.99 50\\n")</code> using <code>fread</code> returned <strong>1</strong> — success! — and filled the struct with <code>id=540094513</code>, <code>price=0.000166</code>, <code>qty=808788025</code>. Those numbers are the ASCII codes of <code>"101 "</code>, <code>"10.9"</code>, <code>"9 50"</code> reinterpreted as binary. No error, no warning, pure garbage.</p>
<p class="pitfall">⚠️ The reverse mismatch is just as quiet in a different way: writing with <code>fwrite</code> and reading with <code>fscanf("%d %f %d")</code> returned <strong>0</strong> — zero items converted — leaving the variables at whatever they held before. A beginner reads "0" as "the file was empty" and spends an hour looking in the wrong place.</p>`,
        `<p class="y-chinh">🎯 Tấm gương soi chính xác của slide 31: <code>size_t fread(void *memory_ptr, size_t size, size_t nmemb, FILE *file_pointer);</code>. Cùng bốn tham số theo cùng thứ tự, cùng kiểu trả về <code>size_t</code>, và một khác biệt quan trọng — tham số đầu là <code>void *</code> không có <code>const</code>, vì hàm này ĐỔ dữ liệu vào bộ nhớ chứ không đọc ra từ đó.</p>
<ul>
<li><strong><code>memory_ptr</code> — "nơi dữ liệu sẽ được cất vào"</strong> — và việc bảo đảm vùng nhớ ấy tồn tại và đủ rộng là việc của BẠN. <code>fread</code> sẵn sàng ghi 12 byte vào một biến 4 byte; không có gì cảnh báo, ngăn xếp cứ thế bị đè.</li>
<li><strong><code>size</code> và <code>nmemb</code> phải khớp CHÍNH XÁC với lúc ghi</strong> — trong tệp không có phần đầu nào nói "bản ghi 12 byte" cả. Ghi bằng <code>sizeof(struct Product)</code> mà đọc bằng <code>sizeof(struct Item)</code> thì mọi trường rơi sai vị trí và chương trình in ra thứ rác trông rất hợp lý.</li>
<li><strong>Giá trị trả về — "số đối tượng đọc thành công"</strong> — là số phần tử, không phải byte, và là cách TRUNG THỰC DUY NHẤT để nhận biết hết tệp nhị phân. Đo thật: trên <code>products.bin</code> có 3 bản ghi, tôi gọi <code>fread(tmp, sizeof(struct Product), 10, f)</code> xin mười; nó trả về <strong>3</strong>, với <code>feof</code> = 1 và <code>ferror</code> = 0.</li>
<li><strong>Phép đo ấy chứa trọn luật xử lý lỗi</strong> — đọc thiếu nghĩa là hoặc hết tệp hoặc lỗi vào/ra thật, và hai thứ đó phân biệt bằng <code>feof(f)</code> so với <code>ferror(f)</code> SAU KHI đã đọc. Đó là công dụng chính đáng duy nhất của <code>feof</code>: chẩn đoán vì sao lần đọc dừng, chứ không bao giờ để quyết định có đọc hay không.</li>
<li><strong>Dáng vòng lặp mà slide 35 sẽ dùng</strong> — <code>while (fread(&amp;product, sizeof(struct Product), 1, filePtr) == 1)</code>. Mỗi lời gọi một bản ghi, và điều kiện chính là lời gọi ấy. Hãy so với <code>while(!feof(p))</code> ở slide 30: nửa nhị phân của deck này làm đúng, còn nửa văn bản thì không.</li>
<li><strong>Chế độ <code>"rb"</code></strong> — bản song sinh đọc của <code>"wb"</code>. Chữ <code>b</code> quan trọng vì cùng lý do như trước, và nó còn nói rõ ý định cho người đọc mã sau này.</li>
</ul>
<pre><code>struct Product p;
FILE *f = fopen("products.bin", "rb");
if (f == NULL) { perror("fopen"); return 1; }

while (fread(&amp;p, sizeof(struct Product), 1, f) == 1)
    printf("ID=%d Price=%.2f Qty=%d\\n", p.product_id, p.price, p.quantity);

if (ferror(f)) fprintf(stderr, "loi doc that su\\n");
else if (feof(f)) ;            /* het tep — binh thuong */
fclose(f);</code></pre>
<p class="dap-an">✅ Đáp án — đo trên <code>products.bin</code> thật 36 byte: vòng lặp trên in đúng ba dòng rồi dừng; phép thử một lời gọi xin 10 phần tử trả về <strong>3</strong>, <code>feof=1</code>, <code>ferror=0</code>. Cũng đã đo mối nguy của việc dùng lệch cặp: đọc bằng <code>fread</code> một tệp vốn ghi bằng <code>fprintf("101 10.99 50\\n")</code> thì nó trả về <strong>1</strong> — thành công! — và đổ vào struct <code>id=540094513</code>, <code>price=0.000166</code>, <code>qty=808788025</code>. Đó chính là mã ASCII của <code>"101 "</code>, <code>"10.9"</code>, <code>"9 50"</code> bị diễn giải lại thành số nhị phân. Không lỗi, không cảnh báo, thuần rác.</p>
<p class="pitfall">⚠️ Trộn lệch theo chiều ngược lại cũng im lặng nhưng theo kiểu khác: ghi bằng <code>fwrite</code> rồi đọc bằng <code>fscanf("%d %f %d")</code> trả về <strong>0</strong> — không chuyển đổi được mục nào — để nguyên các biến với giá trị cũ. Người mới đọc số "0" thành "tệp rỗng" rồi ngồi tìm nhầm chỗ cả tiếng đồng hồ.</p>`],

      [33, 'Write and Read Binary File: Demo — problem and main()',
        `<p class="y-chinh">🎯 The binary case study, stated and started: <em>"Development of a program to manage 'n' product. Each product includes Product code, Price and quantity."</em> Two requirements — type products in and save to a binary file, then read the binary file back and print the list. Lines 1–29 on the right are the type and <code>main</code>.</p>
<ul>
<li><strong>Lines 5–9 — the record type</strong> — <code>struct Product { int product_id; float price; int quantity; };</code>. Note the plain <code>struct</code> form (no <code>typedef</code>), which is why every later use says the two words <code>struct Product</code>.</li>
<li><strong>Why this struct is the perfect binary example</strong> — three fields, all 4 bytes wide, so it has no padding at all and its 12 bytes are exactly the sum of its parts. Measured: <code>offsetof</code> = 0, 4, 8 and <code>sizeof</code> = 12. Add a <code>char code[5]</code> and that clean arithmetic disappears.</li>
<li><strong><code>float price</code>, not <code>double</code></strong> — 4 bytes instead of 8, and the reason <code>scanf</code> on line 48 must use <code>%f</code> while <code>printf</code> on line 76 also uses <code>%f</code>. Mixing <code>%lf</code> into the <code>scanf</code> of a <code>float</code> corrupts the value silently.</li>
<li><strong>Lines 12–13 — prototypes</strong> — <code>void writeProducts(const char *filename, int numProducts);</code> and <code>void readProducts(const char *filename);</code>. Much cleaner than slide 28's design: each function takes only the filename and owns its own <code>FILE *</code> internally. Compare the two and you can see the lesson the deck teaches without saying it.</li>
<li><strong>Line 16 — <code>const char *filename = "products.bin";</code></strong> — the <code>.bin</code> extension is a human convention only; nothing in C checks it. What actually makes the file binary is the <code>"wb"</code> on line 37.</li>
<li><strong>Lines 19–20 then 23 and 26</strong> — ask how many, write them all, then read them all back. The whole program is <em>write everything, close, reopen, read everything</em> — the file is the only thing that survives between the two halves, which is exactly the point slide 7 made about why files exist.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

// Define the structure for product information
struct Product {
    int product_id;
    float price;
    int quantity;
};

// Function Prototypes
void writeProducts(const char *filename, int numProducts);
void readProducts(const char *filename);

int main() {
    const char *filename = "products.bin";
    int numProducts;

    printf("Enter the number of products: ");
    scanf("%d", &amp;numProducts);

    writeProducts(filename, numProducts);   // Write product data to the file
    readProducts(filename);                 // Read and display product data

    return 0;
}</code></pre>
<p class="dap-an">✅ Đáp án — compiled with <code>cc -Wall</code>, no warnings. Measured on this machine: <code>sizeof(struct Product)</code> = <strong>12 bytes</strong>, field offsets <strong>0 / 4 / 8</strong>, zero padding. That single number predicts everything on slide 36: three products must produce a file of exactly 3 × 12 = <strong>36 bytes</strong>, and Explorer on that slide indeed reports "1 item selected 36 bytes".</p>
<p class="meo">💡 Before you write a byte of a binary program, print <code>sizeof</code> of your record type once. It tells you the file size in advance, it tells you the seek stride for slide 38, and it is the first thing to check when a binary file "reads wrong" — a changed struct is a changed file format.</p>`,
        `<p class="y-chinh">🎯 Bài toán nhị phân, được nêu và được khởi động: <em>"Viết chương trình quản lý 'n' sản phẩm. Mỗi sản phẩm gồm Mã sản phẩm, Giá và Số lượng."</em> Hai yêu cầu — nhập sản phẩm từ bàn phím rồi lưu vào tệp nhị phân, sau đó đọc tệp nhị phân ra và in danh sách. Dòng 1–29 bên phải là kiểu dữ liệu và hàm <code>main</code>.</p>
<ul>
<li><strong>Dòng 5–9 — kiểu bản ghi</strong> — <code>struct Product { int product_id; float price; int quantity; };</code>. Để ý đây là dạng <code>struct</code> thuần (không <code>typedef</code>), nên mọi chỗ dùng sau này đều phải viết đủ hai chữ <code>struct Product</code>.</li>
<li><strong>Vì sao struct này là ví dụ nhị phân hoàn hảo</strong> — ba trường, đều rộng 4 byte, nên nó không có byte đệm nào và 12 byte của nó đúng bằng tổng các phần. Đo thật: <code>offsetof</code> = 0, 4, 8 và <code>sizeof</code> = 12. Thêm một <code>char code[5]</code> vào là phép cộng gọn gàng ấy biến mất.</li>
<li><strong><code>float price</code>, không phải <code>double</code></strong> — 4 byte thay vì 8, và đó là lý do <code>scanf</code> ở dòng 48 phải dùng <code>%f</code> còn <code>printf</code> ở dòng 76 cũng dùng <code>%f</code>. Lỡ dùng <code>%lf</code> trong <code>scanf</code> của một biến <code>float</code> là giá trị hỏng âm thầm.</li>
<li><strong>Dòng 12–13 — nguyên mẫu hàm</strong> — <code>void writeProducts(const char *filename, int numProducts);</code> và <code>void readProducts(const char *filename);</code>. Thiết kế sạch hơn hẳn slide 28: mỗi hàm chỉ nhận tên tệp và tự quản <code>FILE *</code> của mình bên trong. So hai bên là thấy ngay bài học mà deck dạy nhưng không nói ra.</li>
<li><strong>Dòng 16 — <code>const char *filename = "products.bin";</code></strong> — đuôi <code>.bin</code> chỉ là quy ước của con người; trong C không có gì kiểm tra nó. Thứ thật sự làm tệp thành nhị phân là chữ <code>"wb"</code> ở dòng 37.</li>
<li><strong>Dòng 19–20 rồi 23 và 26</strong> — hỏi bao nhiêu sản phẩm, ghi hết, rồi đọc lại hết. Cả chương trình là <em>ghi hết, đóng, mở lại, đọc hết</em> — tệp là thứ DUY NHẤT sống sót giữa hai nửa, đúng ý slide 7 đã nói về lý do tồn tại của tệp.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

// Define the structure for product information
struct Product {
    int product_id;
    float price;
    int quantity;
};

// Function Prototypes
void writeProducts(const char *filename, int numProducts);
void readProducts(const char *filename);

int main() {
    const char *filename = "products.bin";
    int numProducts;

    printf("Enter the number of products: ");
    scanf("%d", &amp;numProducts);

    writeProducts(filename, numProducts);   // Write product data to the file
    readProducts(filename);                 // Read and display product data

    return 0;
}</code></pre>
<p class="dap-an">✅ Đáp án — đã biên dịch bằng <code>cc -Wall</code>, không cảnh báo. Đo trên máy này: <code>sizeof(struct Product)</code> = <strong>12 byte</strong>, vị trí các trường <strong>0 / 4 / 8</strong>, không byte đệm. Một con số đó tiên đoán trọn slide 36: ba sản phẩm phải cho tệp đúng 3 × 12 = <strong>36 byte</strong>, và Explorer trên slide ấy quả thật báo "1 item selected 36 bytes".</p>
<p class="meo">💡 Trước khi viết một byte nào của chương trình nhị phân, hãy in <code>sizeof</code> của kiểu bản ghi ra một lần. Nó cho biết trước kích thước tệp, nó cho biết bước nhảy dùng ở slide 38, và nó là thứ đầu tiên cần kiểm khi một tệp nhị phân "đọc ra sai" — struct đổi là định dạng tệp đổi.</p>`],

      [34, 'Write and Read Binary File: Demo — writeProducts()',
        `<p class="y-chinh">🎯 Lines 31–59: open <code>"wb"</code>, loop <code>numProducts</code> times asking for the three fields, and <strong><code>fwrite</code> one whole record per iteration</strong>. The green callout points at line 52 — one line that replaces three separate <code>fprintf</code> calls.</p>
<ul>
<li><strong>Line 37 — <code>if ((filePtr = fopen(filename, "wb")) == NULL)</code></strong> — the <code>b</code> is the entire difference from slide 29's <code>"w"</code>. On Linux and macOS it changes nothing; on Windows it is the difference between a correct file and a corrupted one.</li>
<li><strong>Lines 38–39 — failure handling done right</strong> — print a message and <code>exit(1)</code>, a nonzero status. Compare with slide 23's <code>exit(0)</code>: this slide is the better model.</li>
<li><strong>Line 43 — <code>for (int i = 0; i &lt; numProducts; i++)</code></strong> — declaring <code>i</code> inside the <code>for</code> needs C99 or later. Old compilers and some exam settings reject it; the safe form is to declare <code>int i;</code> above the loop.</li>
<li><strong>Lines 46, 48, 50 — three <code>scanf</code>s, three format letters</strong> — <code>%d</code>, <code>%f</code>, <code>%d</code>, matching <code>int</code>, <code>float</code>, <code>int</code>. All three take <code>&amp;</code> because all three are plain variables inside a struct: <code>&amp;product.price</code> is "the address of the price field of product".</li>
<li><strong>Line 52 — the heart of the slide</strong> — <code>fwrite(&amp;product, sizeof(struct Product), 1, filePtr);</code>. One call, one record, 12 bytes. No format string, no field separators, no newline: the three values go to disk exactly as they sit in memory.</li>
<li><strong>What is missing from line 52</strong> — the return value is ignored. The safe version is <code>if (fwrite(...) != 1) { … }</code>; a full disk is the realistic case where this matters, and it is exactly the case where silence is worst.</li>
</ul>
<pre><code>void writeProducts(const char *filename, int numProducts) {
    FILE *filePtr;
    struct Product product;

    if ((filePtr = fopen(filename, "wb")) == NULL) {
        printf("Error! Failed to open the file for writing.\\n");
        exit(1);
    }

    for (int i = 0; i &lt; numProducts; i++) {
        printf("\\nEnter details for product %d:\\n", i + 1);
        printf("Product ID: ");  scanf("%d", &amp;product.product_id);
        printf("Price: ");       scanf("%f", &amp;product.price);
        printf("Quantity: ");    scanf("%d", &amp;product.quantity);

        fwrite(&amp;product, sizeof(struct Product), 1, filePtr);
    }

    printf("\\nProducts have been written to the file successfully.\\n");
    fclose(filePtr);
}</code></pre>
<p class="dap-an">✅ Đáp án — run with the slide's own data (3 products: 101/10.99/50, 102/15.49/30, 103/7.25/100). The console printed <code>Products have been written to the file successfully.</code> and <code>wc -c products.bin</code> returned <strong>36</strong>. The first twelve bytes, from <code>od -t x1</code>, are <code>65 00 00 00 | 0a d7 2f 41 | 32 00 00 00</code>: <code>0x65</code> = 101 stored low-byte-first, then the IEEE-754 pattern of 10.99, then <code>0x32</code> = 50. Every byte accounted for, no separators anywhere.</p>
<p class="meo">💡 Notice that one <code>struct</code> variable is reused for all <code>n</code> products. That is fine and idiomatic: <code>fwrite</code> copies the bytes out on every call, so the next <code>scanf</code> is free to overwrite them. You only need an <em>array</em> of records if you must keep them all in memory at once.</p>`,
        `<p class="y-chinh">🎯 Dòng 31–59: mở bằng <code>"wb"</code>, lặp <code>numProducts</code> lần hỏi ba trường, và <strong><code>fwrite</code> nguyên một bản ghi mỗi vòng</strong>. Khung chú thích xanh chỉ vào dòng 52 — một dòng thay cho ba lời gọi <code>fprintf</code> riêng lẻ.</p>
<ul>
<li><strong>Dòng 37 — <code>if ((filePtr = fopen(filename, "wb")) == NULL)</code></strong> — chữ <code>b</code> là toàn bộ khác biệt so với <code>"w"</code> ở slide 29. Trên Linux và macOS nó không đổi gì; trên Windows nó là ranh giới giữa một tệp đúng và một tệp hỏng.</li>
<li><strong>Dòng 38–39 — xử lý thất bại đúng cách</strong> — in thông báo rồi <code>exit(1)</code>, mã khác 0. So với <code>exit(0)</code> ở slide 23: slide này mới là mẫu nên theo.</li>
<li><strong>Dòng 43 — <code>for (int i = 0; i &lt; numProducts; i++)</code></strong> — khai <code>i</code> ngay trong <code>for</code> cần C99 trở lên. Trình biên dịch cũ và một số môi trường thi sẽ từ chối; dạng an toàn là khai <code>int i;</code> phía trên vòng lặp.</li>
<li><strong>Dòng 46, 48, 50 — ba lệnh <code>scanf</code>, ba chữ định dạng</strong> — <code>%d</code>, <code>%f</code>, <code>%d</code>, khớp với <code>int</code>, <code>float</code>, <code>int</code>. Cả ba đều có <code>&amp;</code> vì cả ba là biến thường nằm trong struct: <code>&amp;product.price</code> nghĩa là "địa chỉ của trường price trong product".</li>
<li><strong>Dòng 52 — trái tim của slide</strong> — <code>fwrite(&amp;product, sizeof(struct Product), 1, filePtr);</code>. Một lời gọi, một bản ghi, 12 byte. Không chuỗi định dạng, không dấu ngăn cách trường, không xuống dòng: ba giá trị xuống đĩa đúng như chúng nằm trong bộ nhớ.</li>
<li><strong>Thứ THIẾU ở dòng 52</strong> — giá trị trả về bị bỏ qua. Bản an toàn là <code>if (fwrite(...) != 1) { … }</code>; đĩa đầy là tình huống thực tế mà chuyện này quan trọng, và cũng đúng là tình huống mà sự im lặng tệ nhất.</li>
</ul>
<pre><code>void writeProducts(const char *filename, int numProducts) {
    FILE *filePtr;
    struct Product product;

    if ((filePtr = fopen(filename, "wb")) == NULL) {
        printf("Error! Failed to open the file for writing.\\n");
        exit(1);
    }

    for (int i = 0; i &lt; numProducts; i++) {
        printf("\\nEnter details for product %d:\\n", i + 1);
        printf("Product ID: ");  scanf("%d", &amp;product.product_id);
        printf("Price: ");       scanf("%f", &amp;product.price);
        printf("Quantity: ");    scanf("%d", &amp;product.quantity);

        fwrite(&amp;product, sizeof(struct Product), 1, filePtr);
    }

    printf("\\nProducts have been written to the file successfully.\\n");
    fclose(filePtr);
}</code></pre>
<p class="dap-an">✅ Đáp án — chạy đúng dữ liệu của slide (3 sản phẩm: 101/10.99/50, 102/15.49/30, 103/7.25/100). Console in ra <code>Products have been written to the file successfully.</code> và <code>wc -c products.bin</code> trả về <strong>36</strong>. Mười hai byte đầu, lấy từ <code>od -t x1</code>, là <code>65 00 00 00 | 0a d7 2f 41 | 32 00 00 00</code>: <code>0x65</code> = 101 lưu byte thấp trước, rồi mẫu bit IEEE-754 của số 10.99, rồi <code>0x32</code> = 50. Không byte nào dư, và không có dấu ngăn cách nào cả.</p>
<p class="meo">💡 Để ý rằng chỉ MỘT biến <code>struct</code> được dùng lại cho cả <code>n</code> sản phẩm. Như vậy là đúng và đúng kiểu C: <code>fwrite</code> đã chép byte ra ngoài ở mỗi lời gọi, nên lệnh <code>scanf</code> tiếp theo cứ việc ghi đè. Chỉ khi cần giữ tất cả bản ghi trong bộ nhớ cùng lúc thì mới cần một MẢNG.</p>`],

      [35, 'Write and Read Binary File: Demo — readProducts()',
        `<p class="y-chinh">🎯 Lines 61–84: open <code>"rb"</code> and loop <strong><code>while (fread(&amp;product, sizeof(struct Product), 1, filePtr) == 1)</code></strong>. After two slides of <code>while(!feof())</code> in the text demo, here the deck finally writes the loop the right way — and it is worth stopping to notice the difference.</p>
<ul>
<li><strong>Line 74 — the correct loop, at last</strong> — the read is <em>inside</em> the condition and the test is against the number of elements requested. No priming read is needed, no duplicate last record is possible, and a short read ends the loop immediately.</li>
<li><strong>Why binary makes this easier</strong> — a binary file has no whitespace, no line breaks and no ambiguity: either 12 more bytes are there or they are not. <code>fread</code> returning 0 instead of 1 is the whole end-of-file test.</li>
<li><strong><code>== 1</code>, not <code>&gt; 0</code> and not <code>!= EOF</code></strong> — <code>fread</code> returns a <code>size_t</code> count; it never returns <code>EOF</code>. Writing <code>fread(...) != EOF</code> compiles (because <code>-1</code> converts to a huge <code>size_t</code>) and loops forever.</li>
<li><strong>Line 76 — printing with tabs</strong> — <code>"Product ID: %d\\tPrice: %.2f\\tQuantity: %d\\n"</code>. The <code>\\t</code> is what produces the three aligned columns on slide 36. <code>%.2f</code> for a <code>float</code>: <code>printf</code> promotes <code>float</code> to <code>double</code> automatically, so <code>%f</code> is correct and <code>%lf</code> is unnecessary here.</li>
<li><strong>The reopen is the point of the whole demo</strong> — <code>writeProducts</code> closed the file, <code>readProducts</code> opens it again from scratch. Nothing is passed between them in memory; the only channel is the 36 bytes on disk. That is the difference between a program's output and <em>stored data</em>, which is the thesis of slide 7.</li>
<li><strong>What a text editor makes of those 36 bytes</strong> — the slide shows Notepad displaying <code>e x/A2 f xwA g è@d</code>, which is the file interpreted as characters. My own <code>cat -v</code> gave the same kind of soup. That is slide 12's claim — <em>"their contents can only be read by a program"</em> — demonstrated rather than asserted.</li>
</ul>
<pre><code>void readProducts(const char *filename) {
    FILE *filePtr;
    struct Product product;

    if ((filePtr = fopen(filename, "rb")) == NULL) {
        printf("Error! Failed to open the file for reading.\\n");
        exit(1);
    }

    printf("\\nReading products from the file:\\n");
    while (fread(&amp;product, sizeof(struct Product), 1, filePtr) == 1) {
        printf("Product ID: %d\\tPrice: %.2f\\tQuantity: %d\\n",
               product.product_id,
               product.price,
               product.quantity);
    }

    fclose(filePtr);
}</code></pre>
<p class="dap-an">✅ Đáp án — run on the 36-byte file written by slide 34, the loop printed exactly three lines and stopped:<br><code>Product ID: 101	Price: 10.99	Quantity: 50</code><br><code>Product ID: 102	Price: 15.49	Quantity: 30</code><br><code>Product ID: 103	Price: 7.25	Quantity: 100</code><br>identical to the console on slide 36. The same file opened with <code>cat -v</code> shows <code>e^@^@^@ /A2^@^@^@f^@^@^@ wA^^^@^@^@g…</code> — unreadable, exactly as slide 12 promised.</p>
<p class="meo">💡 A binary file is a stack of fixed-size records with no delimiters, which has a useful consequence you will exploit on slide 38: <strong>record number k starts at byte k × sizeof(record)</strong>. That formula is why <code>fseek</code> and binary files belong in the same lecture.</p>`,
        `<p class="y-chinh">🎯 Dòng 61–84: mở bằng <code>"rb"</code> và lặp <strong><code>while (fread(&amp;product, sizeof(struct Product), 1, filePtr) == 1)</code></strong>. Sau hai slide dùng <code>while(!feof())</code> ở phần demo văn bản, ở đây deck cuối cùng cũng viết vòng lặp đúng cách — và đáng dừng lại để nhận ra sự khác biệt.</p>
<ul>
<li><strong>Dòng 74 — vòng lặp đúng, rốt cuộc cũng có</strong> — lệnh đọc nằm BÊN TRONG điều kiện và so với số phần tử đã xin. Không cần lệnh đọc mồi, không thể có bản ghi cuối bị lặp, và đọc thiếu là vòng lặp kết thúc ngay.</li>
<li><strong>Vì sao tệp nhị phân làm chuyện này dễ hơn</strong> — tệp nhị phân không có khoảng trắng, không có ngắt dòng, không có chỗ nào mơ hồ: hoặc còn đủ 12 byte hoặc không. <code>fread</code> trả về 0 thay vì 1 chính là toàn bộ phép kiểm hết tệp.</li>
<li><strong><code>== 1</code>, không phải <code>&gt; 0</code> và càng không phải <code>!= EOF</code></strong> — <code>fread</code> trả về một số đếm kiểu <code>size_t</code>; nó không bao giờ trả <code>EOF</code>. Viết <code>fread(...) != EOF</code> vẫn biên dịch được (vì <code>-1</code> đổi thành một <code>size_t</code> khổng lồ) và lặp vô tận.</li>
<li><strong>Dòng 76 — in bằng ký tự tab</strong> — <code>"Product ID: %d\\tPrice: %.2f\\tQuantity: %d\\n"</code>. Chính <code>\\t</code> tạo ra ba cột thẳng hàng ở slide 36. Dùng <code>%.2f</code> cho một <code>float</code>: <code>printf</code> tự nâng <code>float</code> lên <code>double</code>, nên <code>%f</code> là đúng và <code>%lf</code> là thừa ở đây.</li>
<li><strong>Việc mở lại tệp mới là điểm mấu chốt của cả demo</strong> — <code>writeProducts</code> đã đóng tệp, <code>readProducts</code> mở lại từ đầu. Không có gì được truyền giữa hai hàm trong bộ nhớ; kênh duy nhất là 36 byte nằm trên đĩa. Đó chính là khác biệt giữa "đầu ra của chương trình" và <em>dữ liệu được lưu</em>, tức luận điểm của slide 7.</li>
<li><strong>Trình soạn thảo văn bản làm gì với 36 byte ấy</strong> — slide chụp Notepad hiện <code>e x/A2 f xwA g è@d</code>, tức là tệp bị diễn giải thành ký tự. Lệnh <code>cat -v</code> của tôi cho ra đúng thứ cháo tương tự. Đó là khẳng định của slide 12 — <em>"nội dung chỉ đọc được bằng chương trình"</em> — được CHỨNG MINH chứ không chỉ nói suông.</li>
</ul>
<pre><code>void readProducts(const char *filename) {
    FILE *filePtr;
    struct Product product;

    if ((filePtr = fopen(filename, "rb")) == NULL) {
        printf("Error! Failed to open the file for reading.\\n");
        exit(1);
    }

    printf("\\nReading products from the file:\\n");
    while (fread(&amp;product, sizeof(struct Product), 1, filePtr) == 1) {
        printf("Product ID: %d\\tPrice: %.2f\\tQuantity: %d\\n",
               product.product_id,
               product.price,
               product.quantity);
    }

    fclose(filePtr);
}</code></pre>
<p class="dap-an">✅ Đáp án — chạy trên tệp 36 byte do slide 34 ghi ra, vòng lặp in đúng ba dòng rồi dừng:<br><code>Product ID: 101	Price: 10.99	Quantity: 50</code><br><code>Product ID: 102	Price: 15.49	Quantity: 30</code><br><code>Product ID: 103	Price: 7.25	Quantity: 100</code><br>trùng khít console ở slide 36. Cũng tệp đó mở bằng <code>cat -v</code> cho ra <code>e^@^@^@ /A2^@^@^@f^@^@^@ wA^^^@^@^@g…</code> — không đọc được, đúng như slide 12 đã hứa.</p>
<p class="meo">💡 Tệp nhị phân là một chồng bản ghi cùng kích thước, không có dấu ngăn cách, và điều đó có một hệ quả hữu dụng mà bạn sẽ khai thác ở slide 38: <strong>bản ghi thứ k bắt đầu ở byte k × sizeof(bản ghi)</strong>. Công thức ấy là lý do <code>fseek</code> và tệp nhị phân nằm chung một buổi giảng.</p>`],

      [36, 'Write and Read Binary File: Demo — console and the file on disk',
        `<p class="y-chinh">🎯 The result of slides 33–35 in one screen: the console on the left (three products typed, three printed back) and Explorer on the right showing <code>products.bin</code> selected — <strong>36 bytes</strong> — with Notepad making nonsense of it. This slide is where text and binary can finally be compared byte for byte.</p>
<ul>
<li><strong>The yellow bracket = requirement 1</strong> — "Input from keyboard and Write to file". Nine <code>scanf</code>s, three <code>fwrite</code>s, one confirmation line.</li>
<li><strong>The blue bracket = requirement 2</strong> — "Read from file and Print out". The three lines come back with their values intact: 10.99 is still 10.99, not 10.98 or 11.00.</li>
<li><strong>36 bytes is not a coincidence</strong> — it is 3 × <code>sizeof(struct Product)</code> = 3 × 12. A binary file of fixed records has <em>no</em> per-record overhead: no separators, no newlines, no field names.</li>
<li><strong>The same three products written as text cost more</strong> — measured: <code>fprintf(f, "%d %.2f %d\\n", …)</code> three times gives a 39-byte file. Text is bigger here, and the gap widens with every field: a 10-digit number costs 10 bytes as text and 4 as a binary <code>int</code>.</li>
<li><strong>Text also loses precision, measured</strong> — a <code>float</code> holding 1234.5678 round-tripped through <code>%.2f</code> + <code>fscanf</code> came back as <strong>1234.5699463</strong>; the same value round-tripped through <code>fwrite</code>/<code>fread</code> came back bit-identical. <code>fprintf</code> stores what you asked it to <em>print</em>, not what the variable holds.</li>
<li><strong>And binary is the one you cannot move between machines</strong> — measured: the four bytes of <code>101</code> written on this little-endian machine, read by a big-endian machine, become <strong>1694498816</strong>. Add different <code>int</code> sizes and different struct padding and you have three independent ways for a binary file to be unreadable elsewhere. Slide 13 summed it up: <em>"Text format is more portable than binary format, but binary format is more efficient"</em>.</li>
</ul>
<table>
<tr><th>Same 3 products</th><th><code>fprintf</code> — text</th><th><code>fwrite</code> — binary</th></tr>
<tr><td>File size (measured)</td><td><strong>39 bytes</strong></td><td><strong>36 bytes</strong></td></tr>
<tr><td>First 4 bytes on disk</td><td><code>31 30 31 20</code> = <code>'1' '0' '1' ' '</code></td><td><code>65 00 00 00</code> = the <code>int</code> 101</td></tr>
<tr><td>Bytes for the price 10.99</td><td><code>31 30 2e 39 39</code> (5, as digits)</td><td><code>0a d7 2f 41</code> (4, IEEE-754)</td></tr>
<tr><td>Open in Notepad</td><td><code>101 10.99 50</code> ✅</td><td><code>e x/A2 f…</code> ❌</td></tr>
<tr><td>1234.5678f after a round trip</td><td>1234.5699463 ❌ changed</td><td>1234.5677490 ✅ identical</td></tr>
<tr><td>Read on a big-endian machine</td><td>101 ✅</td><td>1694498816 ❌</td></tr>
<tr><td>Jump straight to record 3</td><td>must scan from the start</td><td><code>fseek(f, 2*12, SEEK_SET)</code> ✅</td></tr>
</table>
<p class="dap-an">✅ Đáp án — every cell above is a measurement, not an estimate. The console produced by the compiled program matches the slide word for word, including <code>Products have been written to the file successfully.</code> and the three <code>Product ID:</code> lines. The full 36-byte dump is <code>65 00 00 00 0a d7 2f 41 32 00 00 00 | 66 00 00 00 0a d7 77 41 1e 00 00 00 | 67 00 00 00 00 00 e8 40 64 00 00 00</code> — three groups of twelve, and you can read the IDs 0x65=101, 0x66=102, 0x67=103 at the start of each group.</p>
<p class="pitfall">⚠️ The last row of the table is the reason binary files earn their place in this slot. Finding record 3 in a text file means reading records 1 and 2 first, because you cannot know where line 3 starts until you have counted the newlines. In a fixed-record binary file the address is arithmetic — and that is exactly what slide 37 is about to give you.</p>`,
        `<p class="y-chinh">🎯 Kết quả của slide 33–35 gói trong một màn hình: console bên trái (gõ vào ba sản phẩm, in ra lại ba sản phẩm) và Explorer bên phải hiện <code>products.bin</code> đang được chọn — <strong>36 byte</strong> — với Notepad biến nó thành thứ vô nghĩa. Slide này là chỗ cuối cùng cũng so được văn bản với nhị phân tới từng byte.</p>
<ul>
<li><strong>Ngoặc vàng = yêu cầu 1</strong> — "Nhập từ bàn phím và Ghi vào tệp". Chín lệnh <code>scanf</code>, ba lệnh <code>fwrite</code>, một dòng xác nhận.</li>
<li><strong>Ngoặc xanh = yêu cầu 2</strong> — "Đọc từ tệp và In ra". Ba dòng trở về nguyên vẹn giá trị: 10.99 vẫn là 10.99, không phải 10.98 hay 11.00.</li>
<li><strong>36 byte không phải chuyện tình cờ</strong> — nó là 3 × <code>sizeof(struct Product)</code> = 3 × 12. Tệp nhị phân gồm các bản ghi cùng kích thước KHÔNG có chi phí phụ nào cho mỗi bản ghi: không dấu ngăn, không xuống dòng, không tên trường.</li>
<li><strong>Cùng ba sản phẩm ấy ghi dạng văn bản thì tốn hơn</strong> — đo thật: gọi <code>fprintf(f, "%d %.2f %d\\n", …)</code> ba lần cho tệp 39 byte. Ở đây văn bản to hơn, và khoảng cách nới ra theo từng trường: một số 10 chữ số tốn 10 byte dạng văn bản và 4 byte dạng <code>int</code> nhị phân.</li>
<li><strong>Văn bản còn làm mất độ chính xác, đã đo</strong> — một biến <code>float</code> giữ 1234.5678 đi một vòng qua <code>%.2f</code> + <code>fscanf</code> trở về là <strong>1234,5699463</strong>; đúng giá trị ấy đi một vòng qua <code>fwrite</code>/<code>fread</code> trở về giống hệt từng bit. <code>fprintf</code> lưu thứ bạn bảo nó IN RA, không phải thứ biến đang giữ.</li>
<li><strong>Còn nhị phân là thứ không mang được sang máy khác</strong> — đo thật: bốn byte của số <code>101</code> ghi trên máy little-endian này, đọc bằng một máy big-endian, thành <strong>1694498816</strong>. Cộng thêm kích thước <code>int</code> khác nhau và byte đệm struct khác nhau là có ba con đường độc lập khiến tệp nhị phân không đọc được ở nơi khác. Slide 13 đã tóm gọn: <em>"Định dạng văn bản khả chuyển hơn định dạng nhị phân, nhưng định dạng nhị phân hiệu quả hơn"</em>.</li>
</ul>
<table>
<tr><th>Cùng 3 sản phẩm</th><th><code>fprintf</code> — văn bản</th><th><code>fwrite</code> — nhị phân</th></tr>
<tr><td>Kích thước tệp (đo thật)</td><td><strong>39 byte</strong></td><td><strong>36 byte</strong></td></tr>
<tr><td>4 byte đầu trên đĩa</td><td><code>31 30 31 20</code> = <code>'1' '0' '1' ' '</code></td><td><code>65 00 00 00</code> = số <code>int</code> 101</td></tr>
<tr><td>Số byte cho giá 10.99</td><td><code>31 30 2e 39 39</code> (5 byte chữ số)</td><td><code>0a d7 2f 41</code> (4 byte IEEE-754)</td></tr>
<tr><td>Mở bằng Notepad</td><td><code>101 10.99 50</code> ✅</td><td><code>e x/A2 f…</code> ❌</td></tr>
<tr><td>1234.5678f sau một vòng ghi-đọc</td><td>1234,5699463 ❌ đã đổi</td><td>1234,5677490 ✅ giống hệt</td></tr>
<tr><td>Đọc trên máy big-endian</td><td>101 ✅</td><td>1694498816 ❌</td></tr>
<tr><td>Nhảy thẳng tới bản ghi 3</td><td>phải quét từ đầu tệp</td><td><code>fseek(f, 2*12, SEEK_SET)</code> ✅</td></tr>
</table>
<p class="dap-an">✅ Đáp án — mọi ô trong bảng đều là số ĐO, không phải ước lượng. Console do chương trình đã biên dịch sinh ra trùng từng chữ với slide, kể cả câu <code>Products have been written to the file successfully.</code> và ba dòng <code>Product ID:</code>. Toàn bộ 36 byte dump ra là <code>65 00 00 00 0a d7 2f 41 32 00 00 00 | 66 00 00 00 0a d7 77 41 1e 00 00 00 | 67 00 00 00 00 00 e8 40 64 00 00 00</code> — ba nhóm mười hai, và bạn đọc được mã 0x65=101, 0x66=102, 0x67=103 ở đầu mỗi nhóm.</p>
<p class="pitfall">⚠️ Hàng cuối của bảng là lý do tệp nhị phân xứng đáng có mặt trong slot này. Tìm bản ghi thứ 3 trong một tệp văn bản nghĩa là phải đọc bản ghi 1 và 2 trước, vì không thể biết dòng 3 bắt đầu ở đâu cho tới khi đã đếm hết các dấu xuống dòng. Trong tệp nhị phân bản ghi cố định thì địa chỉ là một phép tính — và đó đúng là thứ slide 37 sắp trao cho bạn.</p>`],

      [37, '4.8. Moving to a specific location in a file: fseek()',
        `<p class="y-chinh">🎯 The last of the six operations promised on slide 15 — <em>"Moving to a specific location in a file"</em>. <code>int fseek(FILE *file_ptr, long int offset, int pos);</code> turns a file from a tape you can only play forwards into an array you can index. The slide calls that <strong>random-access file operations</strong>.</p>
<ul>
<li><strong>What the file position indicator is</strong> — every open stream carries a cursor saying "the next byte will be read or written here". <code>fopen("r")</code> sets it to 0, every <code>fgetc</code> advances it by 1, every <code>fread</code> of 12 bytes advances it by 12. <code>fseek</code> is the only way to move it backwards.</li>
<li><strong>The offset is <code>long int</code>, and it can be negative</strong> — that is how you move backwards, and it is the reason the parameter is signed. <code>fseek(f, -5, SEEK_CUR)</code> steps five bytes back; slide 41 does exactly that.</li>
<li><strong>Return value — 0 on success, nonzero on failure</strong>. Note the asymmetry with almost every other C library function: here <strong>0 means it worked</strong>. Writing <code>if (fseek(f, 0, SEEK_SET))</code> reads as "if the seek failed", which is correct but looks backwards to a beginner.</li>
<li><strong>Measured, both outcomes</strong> — seeking past the end of a 36-byte file, <code>fseek(f, 5, SEEK_END)</code>, returned <strong>0</strong> and put <code>ftell</code> at <strong>41</strong>; the next <code>fgetc</code> returned <code>EOF</code>. Seeking before the start, <code>fseek(f, -1, SEEK_SET)</code>, returned <strong>-1</strong>. So "past the end" is legal and "before the beginning" is not.</li>
<li><strong>Its partner <code>ftell()</code></strong> — not on the slide but inseparable from it: <code>long ftell(FILE *)</code> returns the current position. The two together give you the idiom for a file's size: <code>fseek(f, 0, SEEK_END); long n = ftell(f);</code> — measured on <code>products.bin</code>, <code>n</code> = 36 = 3 records × 12 bytes.</li>
<li><strong>Where this pays off</strong> — updating one record of a 10,000-record file. Without <code>fseek</code> you read all 10,000, change one, write all 10,000 back. With it you seek, read 12 bytes, seek back, write 12 bytes, and touch nothing else.</li>
</ul>
<pre><code>/* kich thuoc tep bang fseek + ftell */
FILE *f = fopen("products.bin", "rb");
fseek(f, 0, SEEK_END);
long n = ftell(f);
printf("%ld byte = %ld ban ghi\\n", n, n / (long)sizeof(struct Product));
fclose(f);

/* sua TAI CHO ban ghi thu 2 (dem tu 0) — can che do "r+b" */
f = fopen("products.bin", "r+b");
fseek(f, 1L * sizeof(struct Product), SEEK_SET);
struct Product p;
fread(&amp;p, sizeof p, 1, f);
p.quantity = 999;
fseek(f, 1L * sizeof(struct Product), SEEK_SET);   /* PHAI dinh vi lai truoc khi ghi */
fwrite(&amp;p, sizeof p, 1, f);
fclose(f);</code></pre>
<p class="dap-an">✅ Đáp án — both programs above were compiled and run. The size idiom printed <code>36 byte = 3 ban ghi</code>. The in-place update read back <code>ID=101 Qty=50 / ID=102 Qty=999 / ID=103 Qty=100</code> and the file stayed exactly 36 bytes — one record changed, the other two never touched. The <code>od</code> dump confirms it: the only bytes that moved are <code>1e 00 00 00</code> (30) becoming <code>e7 03 00 00</code> (999), at offset 20.</p>
<p class="pitfall">⚠️ The second <code>fseek</code> in that snippet is not optional. After a <code>fread</code> the cursor has already advanced past the record, so writing immediately would overwrite the <em>next</em> record. And in C a stream opened for update ("<code>+</code>") requires a positioning call between a read and a write in either direction — omit it and the behaviour is undefined, which in practice means "works on your machine, corrupts on the examiner's".</p>`,
        `<p class="y-chinh">🎯 Thao tác cuối trong sáu thao tác đã hứa ở slide 15 — <em>"Di chuyển tới một vị trí xác định trong tệp"</em>. <code>int fseek(FILE *file_ptr, long int offset, int pos);</code> biến tệp từ một cuộn băng chỉ chạy được xuôi thành một mảng có thể đánh chỉ số. Slide gọi đó là <strong>thao tác tệp truy cập ngẫu nhiên</strong>.</p>
<ul>
<li><strong>Con trỏ vị trí tệp là gì</strong> — mỗi luồng đang mở đều mang một con trỏ nói "byte kế tiếp sẽ được đọc hoặc ghi ở đây". <code>fopen("r")</code> đặt nó về 0, mỗi <code>fgetc</code> đẩy nó thêm 1, mỗi <code>fread</code> 12 byte đẩy nó thêm 12. <code>fseek</code> là cách DUY NHẤT đẩy nó lùi lại.</li>
<li><strong>Độ dời kiểu <code>long int</code>, và nó ÂM được</strong> — đó là cách đi lùi, và cũng là lý do tham số này có dấu. <code>fseek(f, -5, SEEK_CUR)</code> lùi năm byte; slide 41 làm đúng chuyện đó.</li>
<li><strong>Giá trị trả về — 0 là thành công, khác 0 là thất bại</strong>. Chú ý sự trái ngược với hầu hết hàm thư viện C khác: ở đây <strong>số 0 nghĩa là chạy được</strong>. Viết <code>if (fseek(f, 0, SEEK_SET))</code> đọc là "nếu lệnh dời vị trí thất bại", đúng nhưng nhìn ngược mắt người mới học.</li>
<li><strong>Đã đo cả hai kết cục</strong> — dời quá cuối một tệp 36 byte, <code>fseek(f, 5, SEEK_END)</code>, trả về <strong>0</strong> và đặt <code>ftell</code> ở <strong>41</strong>; lệnh <code>fgetc</code> ngay sau đó trả <code>EOF</code>. Dời lùi trước đầu tệp, <code>fseek(f, -1, SEEK_SET)</code>, trả về <strong>-1</strong>. Vậy "vượt quá cuối" là hợp lệ còn "trước đầu tệp" thì không.</li>
<li><strong>Người bạn đồng hành <code>ftell()</code></strong> — không có trên slide nhưng không tách rời được: <code>long ftell(FILE *)</code> trả về vị trí hiện tại. Hai hàm gộp lại cho mẹo tính kích thước tệp: <code>fseek(f, 0, SEEK_END); long n = ftell(f);</code> — đo trên <code>products.bin</code>, <code>n</code> = 36 = 3 bản ghi × 12 byte.</li>
<li><strong>Chỗ nó đáng tiền</strong> — cập nhật một bản ghi trong tệp 10.000 bản ghi. Không có <code>fseek</code> thì phải đọc cả 10.000, sửa một, ghi lại cả 10.000. Có nó thì dời vị trí, đọc 12 byte, dời lại, ghi 12 byte, và không đụng tới gì khác.</li>
</ul>
<pre><code>/* kich thuoc tep bang fseek + ftell */
FILE *f = fopen("products.bin", "rb");
fseek(f, 0, SEEK_END);
long n = ftell(f);
printf("%ld byte = %ld ban ghi\\n", n, n / (long)sizeof(struct Product));
fclose(f);

/* sua TAI CHO ban ghi thu 2 (dem tu 0) — can che do "r+b" */
f = fopen("products.bin", "r+b");
fseek(f, 1L * sizeof(struct Product), SEEK_SET);
struct Product p;
fread(&amp;p, sizeof p, 1, f);
p.quantity = 999;
fseek(f, 1L * sizeof(struct Product), SEEK_SET);   /* PHAI dinh vi lai truoc khi ghi */
fwrite(&amp;p, sizeof p, 1, f);
fclose(f);</code></pre>
<p class="dap-an">✅ Đáp án — cả hai chương trình trên đã được biên dịch và chạy. Mẹo tính kích thước in ra <code>36 byte = 3 ban ghi</code>. Lệnh sửa tại chỗ đọc lại cho <code>ID=101 Qty=50 / ID=102 Qty=999 / ID=103 Qty=100</code> và tệp vẫn đúng 36 byte — một bản ghi đổi, hai bản ghi kia không hề bị đụng tới. Dump <code>od</code> xác nhận: những byte duy nhất thay đổi là <code>1e 00 00 00</code> (30) thành <code>e7 03 00 00</code> (999), ở vị trí 20.</p>
<p class="pitfall">⚠️ Lệnh <code>fseek</code> thứ hai trong đoạn mã trên KHÔNG phải tuỳ chọn. Sau một lệnh <code>fread</code>, con trỏ đã nhảy qua khỏi bản ghi vừa đọc, nên ghi ngay sẽ đè lên bản ghi KẾ TIẾP. Và trong C, một luồng mở ở chế độ cập nhật ("<code>+</code>") bắt buộc phải có một lệnh định vị chen giữa mỗi lần chuyển từ đọc sang ghi hoặc ngược lại — bỏ nó đi thì hành vi là không xác định, mà trên thực tế nghĩa là "chạy được trên máy bạn, hỏng dữ liệu trên máy người chấm".</p>`],

      [38, 'fseek() — parameters and SEEK_SET / SEEK_CUR / SEEK_END',
        `<p class="y-chinh">🎯 The three parameters named, and the three anchors that make <code>offset</code> mean something: <strong><code>SEEK_SET</code></strong> = beginning of the file, <strong><code>SEEK_CUR</code></strong> = current position, <strong><code>SEEK_END</code></strong> = end of the file. The slide then lists three uses: jump, skip, and read/write from a specific position.</p>
<ul>
<li><strong><code>SEEK_SET</code> — absolute</strong>. <code>fseek(f, 10, SEEK_SET)</code> means "byte 10 from the start", no matter where you were. Offsets should be ≥ 0; negative ones fail, measured (<code>fseek(f,-1,SEEK_SET)</code> returned -1).</li>
<li><strong><code>SEEK_CUR</code> — relative</strong>. Positive skips forward, negative rewinds. This is the only anchor whose result depends on what you did before, which makes it both the most useful and the easiest to get wrong.</li>
<li><strong><code>SEEK_END</code> — from the end, so the offset is normally negative</strong>. <code>fseek(f, -2, SEEK_END)</code> = the last two bytes; <code>fseek(f, 0, SEEK_END)</code> = one past the last byte, which is the size of the file.</li>
<li><strong>They are macros, not numbers you invent</strong> — defined in <code>&lt;stdio.h&gt;</code>. Passing a literal 0/1/2 happens to work on most systems and is bad practice; an exam answer should use the names.</li>
<li><strong>The three "common use cases" spelled out</strong> — <em>jump to a specific location</em> (SEEK_SET with a computed offset: <code>k * sizeof(record)</code>), <em>skip over sections</em> (SEEK_CUR with a positive offset — skip a header, skip a record you do not want), and <em>read or write from a specific position</em> (the in-place update from slide 37).</li>
<li><strong>The text-file restriction the slide does not mention</strong> — on a stream opened in text mode the C standard only guarantees <code>fseek</code> with <code>SEEK_SET</code> and an offset that came from a previous <code>ftell</code> on that same stream; <code>SEEK_END</code> on a text file is explicitly not required to be meaningful. On binary streams all three are exact byte counts. Slide 41's demo uses <code>SEEK_END</code> on a text file — and slide 41 is where you will see what that costs.</li>
</ul>
<p class="nhan">Measured on a 36-byte file whose content is <code>content for testing fseek function</code> + CRLF, starting from position 15 (after reading 15 characters):</p>
<table>
<tr><th>Call</th><th>Anchor</th><th><code>ftell</code> before</th><th><code>ftell</code> after</th><th>returns</th><th>next char read</th></tr>
<tr><td><code>fseek(f, -5, SEEK_CUR)</code></td><td>SEEK_CUR</td><td>15</td><td>10</td><td>0</td><td><code>'r'</code></td></tr>
<tr><td><code>fseek(f, 0, SEEK_SET)</code></td><td>SEEK_SET</td><td>10</td><td>0</td><td>0</td><td><code>'c'</code></td></tr>
<tr><td><code>fseek(f, 8, SEEK_SET)</code></td><td>SEEK_SET</td><td>0</td><td>8</td><td>0</td><td><code>'f'</code></td></tr>
<tr><td><code>fseek(f, 12, SEEK_CUR)</code></td><td>SEEK_CUR</td><td>8</td><td>20</td><td>0</td><td><code>'f'</code></td></tr>
<tr><td><code>fseek(f, -10, SEEK_END)</code></td><td>SEEK_END</td><td>20</td><td>26</td><td>0</td><td><code>'f'</code></td></tr>
<tr><td><code>fseek(f, -2, SEEK_END)</code></td><td>SEEK_END</td><td>26</td><td>34</td><td>0</td><td><code>'\\r'</code></td></tr>
<tr><td><code>fseek(f, 5, SEEK_END)</code></td><td>SEEK_END</td><td>34</td><td><strong>41</strong></td><td>0</td><td><code>EOF</code>, <code>feof</code>=1</td></tr>
<tr><td><code>fseek(f, -1, SEEK_SET)</code></td><td>SEEK_SET</td><td>41</td><td>41</td><td><strong>-1</strong></td><td>— nothing moved</td></tr>
</table>
<p class="dap-an">✅ Đáp án — read the "ftell before" column against the "after" column and the three anchors explain themselves: <code>SEEK_SET</code> ignores the before value entirely, <code>SEEK_CUR</code> adds to it, <code>SEEK_END</code> ignores it too but counts from 36. Row 4 is the one to study: from 8, an offset of +12 gives 20, not 12 — <code>SEEK_CUR</code> adds, it does not assign. Rows 7 and 8 show the two edges: past the end is allowed (and reading there gives <code>EOF</code>), before the start is refused with -1 and the position does not change.</p>
<p class="meo">💡 Mnemonic for the three names: <strong>SET</strong> sets the position, <strong>CUR</strong> is a step from where the <em>cursor</em> is, <strong>END</strong> counts backwards from the end. And for binary records, the only formula you need is <code>fseek(f, (long)k * sizeof(Rec), SEEK_SET)</code> to land on record <code>k</code> counting from 0.</p>`,
        `<p class="y-chinh">🎯 Ba tham số được gọi tên, và ba cái mốc làm cho <code>offset</code> có nghĩa: <strong><code>SEEK_SET</code></strong> = đầu tệp, <strong><code>SEEK_CUR</code></strong> = vị trí hiện tại, <strong><code>SEEK_END</code></strong> = cuối tệp. Slide rồi liệt kê ba công dụng: nhảy tới, bỏ qua một đoạn, và đọc/ghi từ một vị trí xác định.</p>
<ul>
<li><strong><code>SEEK_SET</code> — tuyệt đối</strong>. <code>fseek(f, 10, SEEK_SET)</code> nghĩa là "byte thứ 10 tính từ đầu", bất kể trước đó bạn đang ở đâu. Độ dời nên ≥ 0; số âm thì thất bại, đã đo (<code>fseek(f,-1,SEEK_SET)</code> trả về -1).</li>
<li><strong><code>SEEK_CUR</code> — tương đối</strong>. Số dương nhảy tới, số âm lùi lại. Đây là cái mốc duy nhất mà kết quả phụ thuộc vào việc bạn đã làm gì trước đó, nên nó vừa hữu dụng nhất vừa dễ sai nhất.</li>
<li><strong><code>SEEK_END</code> — tính từ cuối, nên độ dời thường là số ÂM</strong>. <code>fseek(f, -2, SEEK_END)</code> = hai byte cuối; <code>fseek(f, 0, SEEK_END)</code> = ngay sau byte cuối, tức là bằng kích thước tệp.</li>
<li><strong>Chúng là macro, không phải con số bạn tự bịa</strong> — được định nghĩa trong <code>&lt;stdio.h&gt;</code>. Truyền số 0/1/2 trần tình cờ chạy được trên phần lớn hệ thống và là thói quen xấu; bài thi phải dùng tên.</li>
<li><strong>Ba "công dụng thường gặp" nói rõ ra</strong> — <em>nhảy tới một vị trí xác định</em> (SEEK_SET với độ dời tính được: <code>k * sizeof(bản ghi)</code>), <em>bỏ qua một đoạn</em> (SEEK_CUR với độ dời dương — bỏ qua phần đầu tệp, bỏ qua bản ghi không cần), và <em>đọc hoặc ghi từ một vị trí xác định</em> (chính là phép sửa tại chỗ ở slide 37).</li>
<li><strong>Hạn chế với tệp VĂN BẢN mà slide không nhắc</strong> — trên luồng mở ở chế độ văn bản, chuẩn C chỉ bảo đảm <code>fseek</code> với <code>SEEK_SET</code> và một độ dời lấy từ lần <code>ftell</code> trước đó trên chính luồng ấy; <code>SEEK_END</code> trên tệp văn bản được nêu rõ là không bắt buộc có ý nghĩa. Trên luồng nhị phân thì cả ba đều là số byte chính xác. Demo slide 41 dùng <code>SEEK_END</code> trên tệp văn bản — và slide 41 chính là chỗ bạn sẽ thấy cái giá của việc đó.</li>
</ul>
<p class="nhan">Đo thật trên tệp 36 byte có nội dung <code>content for testing fseek function</code> + CRLF, xuất phát từ vị trí 15 (sau khi đã đọc 15 ký tự):</p>
<table>
<tr><th>Lời gọi</th><th>Mốc</th><th><code>ftell</code> trước</th><th><code>ftell</code> sau</th><th>trả về</th><th>ký tự đọc được tiếp theo</th></tr>
<tr><td><code>fseek(f, -5, SEEK_CUR)</code></td><td>SEEK_CUR</td><td>15</td><td>10</td><td>0</td><td><code>'r'</code></td></tr>
<tr><td><code>fseek(f, 0, SEEK_SET)</code></td><td>SEEK_SET</td><td>10</td><td>0</td><td>0</td><td><code>'c'</code></td></tr>
<tr><td><code>fseek(f, 8, SEEK_SET)</code></td><td>SEEK_SET</td><td>0</td><td>8</td><td>0</td><td><code>'f'</code></td></tr>
<tr><td><code>fseek(f, 12, SEEK_CUR)</code></td><td>SEEK_CUR</td><td>8</td><td>20</td><td>0</td><td><code>'f'</code></td></tr>
<tr><td><code>fseek(f, -10, SEEK_END)</code></td><td>SEEK_END</td><td>20</td><td>26</td><td>0</td><td><code>'f'</code></td></tr>
<tr><td><code>fseek(f, -2, SEEK_END)</code></td><td>SEEK_END</td><td>26</td><td>34</td><td>0</td><td><code>'\\r'</code></td></tr>
<tr><td><code>fseek(f, 5, SEEK_END)</code></td><td>SEEK_END</td><td>34</td><td><strong>41</strong></td><td>0</td><td><code>EOF</code>, <code>feof</code>=1</td></tr>
<tr><td><code>fseek(f, -1, SEEK_SET)</code></td><td>SEEK_SET</td><td>41</td><td>41</td><td><strong>-1</strong></td><td>— không dời đi đâu</td></tr>
</table>
<p class="dap-an">✅ Đáp án — đọc cột "ftell trước" đối chiếu cột "ftell sau" là ba cái mốc tự giải thích lấy: <code>SEEK_SET</code> bỏ qua hoàn toàn giá trị trước đó, <code>SEEK_CUR</code> CỘNG vào nó, <code>SEEK_END</code> cũng bỏ qua nó nhưng đếm từ số 36. Hàng 4 là hàng đáng học nhất: từ vị trí 8, độ dời +12 cho ra 20 chứ không phải 12 — <code>SEEK_CUR</code> cộng chứ không gán. Hàng 7 và 8 cho thấy hai mép: vượt quá cuối tệp thì được phép (và đọc ở đó cho <code>EOF</code>), lùi trước đầu tệp thì bị từ chối với -1 và vị trí không đổi.</p>
<p class="meo">💡 Mẹo nhớ ba cái tên: <strong>SET</strong> là ĐẶT vị trí, <strong>CUR</strong> là bước đi từ chỗ con trỏ (<em>cursor</em>) đang đứng, <strong>END</strong> là đếm ngược từ cuối. Còn với bản ghi nhị phân thì công thức duy nhất cần nhớ là <code>fseek(f, (long)k * sizeof(Rec), SEEK_SET)</code> để đáp xuống bản ghi thứ <code>k</code> đếm từ 0.</p>`],

      [39, 'rewind() function',
        `<p class="y-chinh">🎯 <code>void rewind(FILE *file_pointer);</code> — "move the file pointer back to the beginning of a file". The slide describes it as <em>"a simple way to reset the file pointer"</em> compared with <code>fseek</code>, "which requires parameters". That is true but it is not the whole difference, and the rest is measurable.</p>
<ul>
<li><strong>The obvious equivalence</strong> — <code>rewind(f)</code> does what <code>fseek(f, 0, SEEK_SET)</code> does: position back to byte 0. One parameter instead of three, and the intent is unmistakable when you read the code.</li>
<li><strong>Return value: <code>void</code></strong> — the slide says "does not return a value", and that is a real limitation, not a convenience. <code>fseek</code> can tell you it failed; <code>rewind</code> cannot. On a stream you cannot seek (a pipe, <code>stdin</code> from a keyboard) <code>rewind</code> fails silently.</li>
<li><strong>The difference that is NOT on the slide, and that exams ask about</strong> — <code>rewind</code> also <strong>clears the error indicator</strong>. <code>fseek</code> clears the end-of-file indicator but leaves <code>ferror</code> set.</li>
<li><strong>Measured, both flags, on the same file</strong> — after reading to the end, <code>feof</code>=1; <code>fseek(f,0,SEEK_SET)</code> brought it back to 0, and so did <code>rewind</code>. Then I forced a real error by calling <code>fputc('X', f)</code> on a stream opened <code>"r"</code>: it returned -1 and set <code>ferror</code>=1. <code>fseek(f,0,SEEK_SET)</code> left <code>ferror</code> at <strong>1</strong>; <code>rewind(f)</code> brought it to <strong>0</strong>. That is the whole answer to "what is the real difference".</li>
<li><strong>The classic use</strong> — read a file twice: once to count or measure, once to process. <code>rewind</code> between the two passes is clearer than <code>fseek</code> and is exactly what slide 40 demonstrates.</li>
<li><strong>Do not confuse "rewind" with "reopen"</strong> — <code>rewind</code> moves the cursor; it does not reload the file, it does not see changes another program made, and on a stream opened <code>"w"</code> it does not undo what you already wrote. It only changes where the next byte goes.</li>
</ul>
<table>
<tr><th></th><th><code>fseek(f, 0, SEEK_SET)</code></th><th><code>rewind(f)</code></th></tr>
<tr><td>Position after the call</td><td>0</td><td>0</td></tr>
<tr><td>Clears the EOF flag (<code>feof</code>)</td><td>✅ measured 1 → 0</td><td>✅ measured 1 → 0</td></tr>
<tr><td>Clears the error flag (<code>ferror</code>)</td><td><strong>❌ measured, stays 1</strong></td><td><strong>✅ measured 1 → 0</strong></td></tr>
<tr><td>Reports failure</td><td>✅ returns <code>-1</code></td><td>❌ <code>void</code> — silent</td></tr>
<tr><td>Can go anywhere else</td><td>✅ any offset, any anchor</td><td>❌ only byte 0</td></tr>
</table>
<p class="dap-an">✅ Đáp án — the third row is the one worth memorising and it came out of a real run, not a book: <code>ferror</code> was 1 after the failed write; it was still 1 after <code>fseek</code>; it was 0 after <code>rewind</code>. So the honest one-line summary is <em>"<code>rewind(f)</code> equals <code>fseek(f,0,SEEK_SET)</code> plus <code>clearerr(f)</code>, minus the return value"</em>.</p>
<p class="meo">💡 Practical rule: use <code>rewind</code> when you mean "start this file over", use <code>fseek</code> when you mean "go to position X" or when you need to know whether the move succeeded. And if you ever need the error flag cleared without moving, the function for that is <code>clearerr(f)</code>.</p>`,
        `<p class="y-chinh">🎯 <code>void rewind(FILE *file_pointer);</code> — "đưa con trỏ tệp về đầu tệp". Slide mô tả nó là <em>"cách đơn giản để đặt lại con trỏ tệp"</em> so với <code>fseek</code> vốn "đòi tham số". Điều đó đúng nhưng chưa phải toàn bộ khác biệt, và phần còn lại thì ĐO được.</p>
<ul>
<li><strong>Chỗ tương đương hiển nhiên</strong> — <code>rewind(f)</code> làm đúng việc <code>fseek(f, 0, SEEK_SET)</code> làm: đưa vị trí về byte 0. Một tham số thay vì ba, và đọc mã lên là hiểu ngay ý định.</li>
<li><strong>Giá trị trả về: <code>void</code></strong> — slide ghi "không trả về giá trị", và đó là một HẠN CHẾ thật chứ không phải sự tiện lợi. <code>fseek</code> báo được cho bạn biết nó thất bại; <code>rewind</code> thì không. Trên luồng không dời vị trí được (một ống dẫn, hay <code>stdin</code> từ bàn phím) thì <code>rewind</code> thất bại trong im lặng.</li>
<li><strong>Khác biệt KHÔNG có trên slide, và là thứ đề thi hay hỏi</strong> — <code>rewind</code> còn <strong>xoá cả cờ LỖI</strong>. <code>fseek</code> xoá cờ hết-tệp nhưng để nguyên <code>ferror</code>.</li>
<li><strong>Đã đo cả hai cờ, trên cùng một tệp</strong> — sau khi đọc hết, <code>feof</code>=1; <code>fseek(f,0,SEEK_SET)</code> đưa nó về 0, và <code>rewind</code> cũng vậy. Rồi tôi gây một lỗi thật bằng cách gọi <code>fputc('X', f)</code> trên luồng mở bằng <code>"r"</code>: nó trả về -1 và bật <code>ferror</code>=1. <code>fseek(f,0,SEEK_SET)</code> để <code>ferror</code> nguyên ở <strong>1</strong>; <code>rewind(f)</code> đưa nó về <strong>0</strong>. Đó là toàn bộ câu trả lời cho câu hỏi "khác nhau thật ở chỗ nào".</li>
<li><strong>Công dụng kinh điển</strong> — đọc một tệp hai lượt: lượt đầu để đếm hoặc đo, lượt sau để xử lý. Đặt <code>rewind</code> giữa hai lượt thì rõ nghĩa hơn <code>fseek</code>, và đó đúng là thứ slide 40 minh hoạ.</li>
<li><strong>Đừng lẫn "rewind" với "mở lại tệp"</strong> — <code>rewind</code> dời con trỏ; nó không nạp lại tệp, nó không thấy thay đổi do chương trình khác gây ra, và trên luồng mở bằng <code>"w"</code> nó không huỷ được thứ bạn đã ghi. Nó chỉ đổi chỗ byte kế tiếp sẽ đi tới.</li>
</ul>
<table>
<tr><th></th><th><code>fseek(f, 0, SEEK_SET)</code></th><th><code>rewind(f)</code></th></tr>
<tr><td>Vị trí sau lời gọi</td><td>0</td><td>0</td></tr>
<tr><td>Xoá cờ hết tệp (<code>feof</code>)</td><td>✅ đo được 1 → 0</td><td>✅ đo được 1 → 0</td></tr>
<tr><td>Xoá cờ lỗi (<code>ferror</code>)</td><td><strong>❌ đo được, vẫn là 1</strong></td><td><strong>✅ đo được 1 → 0</strong></td></tr>
<tr><td>Báo được thất bại</td><td>✅ trả về <code>-1</code></td><td>❌ <code>void</code> — im lặng</td></tr>
<tr><td>Đi được chỗ khác</td><td>✅ mọi độ dời, mọi mốc</td><td>❌ chỉ về byte 0</td></tr>
</table>
<p class="dap-an">✅ Đáp án — hàng thứ ba là hàng đáng thuộc và nó ra từ một lần chạy thật chứ không phải từ sách: <code>ferror</code> bằng 1 sau lệnh ghi hỏng; vẫn bằng 1 sau <code>fseek</code>; bằng 0 sau <code>rewind</code>. Vậy câu tóm tắt trung thực một dòng là <em>"<code>rewind(f)</code> bằng <code>fseek(f,0,SEEK_SET)</code> cộng <code>clearerr(f)</code>, trừ đi giá trị trả về"</em>.</p>
<p class="meo">💡 Luật dùng thực tế: dùng <code>rewind</code> khi ý bạn là "làm lại tệp này từ đầu", dùng <code>fseek</code> khi ý bạn là "đi tới vị trí X" hoặc khi cần biết phép dời có thành công không. Và nếu có lúc cần xoá cờ lỗi mà không dời vị trí thì hàm dành cho việc đó là <code>clearerr(f)</code>.</p>`],

      [40, 'Demo: rewind(FILE*)',
        `<p class="y-chinh">🎯 Sixteen lines that prove <code>rewind</code> in the simplest possible way: read 10 characters, rewind, read the <em>whole</em> file. The console shows <code>content fo</code> on the first pass and <code>content for testing rewind function</code> on the second — the same stream, read twice, because the cursor went home.</p>
<ul>
<li><strong>Line 4 — <code>char fname[] = "test_rewind.txt";</code></strong> — an array initialised from a string literal, so <code>fname</code> is 16 bytes (15 characters + <code>'\\0'</code>) and is modifiable. <code>char *fname = "…"</code> would point at read-only memory instead.</li>
<li><strong>Line 7 — <code>FILE * f = fopen(fname, "r");</code></strong> — no <code>NULL</code> check again. In a demo it is forgivable; in an assignment it costs marks.</li>
<li><strong>Line 9 — <code>for (i=0;i&lt;10;i++) putchar(fgetc(f));</code></strong> — ten characters, one per iteration, no loop body braces needed. After it the file position is exactly 10; the console proves it by showing <code>content fo</code> and stopping mid-word.</li>
<li><strong>Line 10 — <code>rewind(f);</code></strong> — the whole point. Without it, line 12's loop would print only <code>r testing rewind function</code>, the remainder from position 10.</li>
<li><strong>Line 12 — <code>while ((c=fgetc(f))!=EOF) putchar(c);</code></strong> — the correct loop shape from slide 25, with one flaw carried over: <code>c</code> was declared <code>char</code> on line 5, not <code>int</code>. On this pure-ASCII file it works; on a file containing byte 0xFF it would stop early, measured at 2 of 5 characters on slide 25's test file.</li>
<li><strong>Line 14 — <code>getchar();</code></strong> — the portable version of slide 28's <code>system("pause")</code>: wait for one keypress so the console window does not vanish. Costs nothing and works everywhere.</li>
</ul>
<pre><code>/*test_rewind.c */
#include &lt;stdio.h&gt;
int main()
{   char fname[] = "test_rewind.txt";
    char c; /* a chacracter from file */
    int i;
    FILE * f= fopen(fname, "r");
    printf("10 first characters:\\n");
    for (i=0;i&lt;10;i++) putchar(fgetc(f));
    rewind(f);
    printf("\\n\\nAfter rewind:\\n");
    while ((c=fgetc(f))!=EOF) putchar(c);
    fclose(f);
    getchar();
    return 0;
}</code></pre>
<p class="dap-an">✅ Đáp án — I created <code>test_rewind.txt</code> with exactly the slide's content, <code>content for testing rewind function</code> (<strong>35 bytes</strong>), compiled with <code>cc -Wall</code> and ran. Output, identical to the slide's console:<br><code>10 first characters:</code><br><code>content fo</code><br><code></code><br><code>After rewind:</code><br><code>content for testing rewind function</code><br>Count it: <code>c-o-n-t-e-n-t</code> is 7, the space is 8, <code>f</code> 9, <code>o</code> 10 — the first pass stops in the middle of "for", exactly as the screenshot shows.</p>
<p class="meo">💡 Delete line 10 and re-run: the second block prints <code>r testing rewind function</code>. That one-line experiment is the fastest way to understand what a file position indicator <em>is</em> — it is the only state that changed between the two runs.</p>`,
        `<p class="y-chinh">🎯 Mười sáu dòng chứng minh <code>rewind</code> theo cách đơn giản nhất có thể: đọc 10 ký tự, tua về đầu, rồi đọc TOÀN BỘ tệp. Console hiện <code>content fo</code> ở lượt một và <code>content for testing rewind function</code> ở lượt hai — cùng một luồng, đọc hai lần, vì con trỏ đã về nhà.</p>
<ul>
<li><strong>Dòng 4 — <code>char fname[] = "test_rewind.txt";</code></strong> — một mảng khởi tạo từ chuỗi hằng, nên <code>fname</code> dài 16 byte (15 ký tự + <code>'\\0'</code>) và sửa được. Nếu viết <code>char *fname = "…"</code> thì nó trỏ vào vùng nhớ chỉ-đọc.</li>
<li><strong>Dòng 7 — <code>FILE * f = fopen(fname, "r");</code></strong> — lại không kiểm <code>NULL</code>. Trong một demo thì tha thứ được; trong bài nộp thì mất điểm.</li>
<li><strong>Dòng 9 — <code>for (i=0;i&lt;10;i++) putchar(fgetc(f));</code></strong> — mười ký tự, mỗi vòng một ký tự, không cần ngoặc nhọn cho thân vòng. Sau nó vị trí tệp đúng bằng 10; console chứng minh bằng cách hiện <code>content fo</code> rồi dừng giữa chừng một từ.</li>
<li><strong>Dòng 10 — <code>rewind(f);</code></strong> — toàn bộ mấu chốt. Không có nó thì vòng lặp ở dòng 12 chỉ in ra <code>r testing rewind function</code>, tức phần còn lại kể từ vị trí 10.</li>
<li><strong>Dòng 12 — <code>while ((c=fgetc(f))!=EOF) putchar(c);</code></strong> — đúng dáng vòng lặp chuẩn ở slide 25, nhưng mang theo một lỗi cũ: <code>c</code> được khai là <code>char</code> ở dòng 5 chứ không phải <code>int</code>. Trên tệp ASCII thuần thì chạy được; trên tệp có byte 0xFF thì nó dừng sớm, đo được 2 trên 5 ký tự với tệp thử ở slide 25.</li>
<li><strong>Dòng 14 — <code>getchar();</code></strong> — bản khả chuyển của <code>system("pause")</code> ở slide 28: chờ một phím để cửa sổ console không biến mất. Không tốn gì và chạy được ở mọi nơi.</li>
</ul>
<pre><code>/*test_rewind.c */
#include &lt;stdio.h&gt;
int main()
{   char fname[] = "test_rewind.txt";
    char c; /* a chacracter from file */
    int i;
    FILE * f= fopen(fname, "r");
    printf("10 first characters:\\n");
    for (i=0;i&lt;10;i++) putchar(fgetc(f));
    rewind(f);
    printf("\\n\\nAfter rewind:\\n");
    while ((c=fgetc(f))!=EOF) putchar(c);
    fclose(f);
    getchar();
    return 0;
}</code></pre>
<p class="dap-an">✅ Đáp án — tôi tạo <code>test_rewind.txt</code> với đúng nội dung của slide, <code>content for testing rewind function</code> (<strong>35 byte</strong>), biên dịch bằng <code>cc -Wall</code> rồi chạy. Kết quả, giống hệt console trên slide:<br><code>10 first characters:</code><br><code>content fo</code><br><code></code><br><code>After rewind:</code><br><code>content for testing rewind function</code><br>Hãy đếm thử: <code>c-o-n-t-e-n-t</code> là 7, dấu cách là 8, <code>f</code> là 9, <code>o</code> là 10 — lượt đầu dừng đúng giữa chữ "for", y như ảnh chụp.</p>
<p class="meo">💡 Xoá dòng 10 rồi chạy lại: khối thứ hai sẽ in <code>r testing rewind function</code>. Thí nghiệm một dòng đó là cách nhanh nhất để hiểu con trỏ vị trí tệp thật sự LÀ gì — nó là thứ trạng thái DUY NHẤT thay đổi giữa hai lần chạy.</p>`],

      [41, 'Demo: fseek(…)',
        `<p class="y-chinh">🎯 The richest slide of the deck: one text file, <code>content for testing fseek function</code>, and four reads separated by three <code>fseek</code> calls — one with each anchor. The five green strips on the right mark where the cursor is at each step, and the blue box marks the <strong>EOF (2 bytes)</strong> at the end of the file. That little box is the key to the whole slide.</p>
<ul>
<li><strong>Step 1 — read 15 characters</strong>: <code>for (i=0;i&lt;15;i++) putchar(fgetc(f));</code> gives <code>content for tes</code>, positions 0–14, cursor now at 15.</li>
<li><strong>Step 2 — <code>fseek(f,-5,SEEK_CUR)</code></strong>: 15 − 5 = 10, and reading 5 characters gives <code>r tes</code> — positions 10–14, the last five of what was just printed. Measured: <code>ftell</code> 15 → 10, return 0.</li>
<li><strong>Step 3 — <code>fseek(f,-10,SEEK_END)</code></strong>: the console shows <code>funct</code>, which is positions 26–30. That only works if the file length is 36, not 34 — and the text is 34 characters. The two missing bytes are the <code>\\r\\n</code> at the end of the file, which is exactly what the slide's blue "EOF (2bytes)" box is telling you.</li>
<li><strong>Step 4 — <code>fseek(f,10,SEEK_SET)</code></strong>: absolute position 10, reading 5 gives <code>r tes</code> again — the same text as step 2, reached a completely different way. That repetition is deliberate: it shows <code>SEEK_CUR</code> and <code>SEEK_SET</code> landing on the same byte.</li>
<li><strong>The reproduction, measured twice</strong> — on a file of exactly 36 bytes (text + CRLF) my run printed <code>content for tes</code> / <code>r tes</code> / <code>funct</code> / <code>r tes</code>, <strong>identical to the slide</strong>. On a 34-byte file (no trailing newline, as macOS creates it) the third block came out <code>k fun</code> instead, because 34 − 10 = 24 and position 24 is the <code>k</code> of "fseek".</li>
<li><strong>So the slide is right, but only on its own machine</strong> — and that is the real lesson, not a defect. <code>SEEK_END</code> depends on the file's byte length, and the byte length of a text file depends on the operating system. The C standard says so explicitly: on a text stream, <code>SEEK_END</code> support is not required to be meaningful.</li>
</ul>
<table>
<tr><th>Step</th><th>Call</th><th>Position after</th><th>36-byte file (slide, CRLF)</th><th>34-byte file (macOS, no NL)</th></tr>
<tr><td>1</td><td>read 15 chars from 0</td><td>15</td><td><code>content for tes</code></td><td><code>content for tes</code></td></tr>
<tr><td>2</td><td><code>fseek(f,-5,SEEK_CUR)</code></td><td>10</td><td><code>r tes</code></td><td><code>r tes</code></td></tr>
<tr><td>3</td><td><code>fseek(f,-10,SEEK_END)</code></td><td>26 vs 24</td><td><strong><code>funct</code></strong></td><td><strong><code>k fun</code></strong></td></tr>
<tr><td>4</td><td><code>fseek(f,10,SEEK_SET)</code></td><td>10</td><td><code>r tes</code></td><td><code>r tes</code></td></tr>
</table>
<p class="dap-an">✅ Đáp án — both columns of that table are real runs of the slide's own source, compiled with <code>cc -Wall</code>, differing only in the file. Steps 1, 2 and 4 agree everywhere because <code>SEEK_SET</code> and <code>SEEK_CUR</code> count from fixed points inside the data; step 3 disagrees because <code>SEEK_END</code> counts from a point that the operating system decides. If your answer to this exercise differs from the slide by two characters, you are not wrong — your file is two bytes shorter.</p>
<p class="pitfall">⚠️ The safe habit that makes the difference disappear: <strong>open the file in binary mode (<code>"rb"</code>) whenever you intend to <code>fseek</code>, and use <code>SEEK_END</code> only on binary streams</strong>. Then the byte count is the byte count, on every machine. For text files, the standard-guaranteed move is <code>SEEK_SET</code> with an offset you got earlier from <code>ftell</code> on that same stream.</p>`,
        `<p class="y-chinh">🎯 Slide giàu nội dung nhất của cả deck: một tệp văn bản <code>content for testing fseek function</code>, và bốn lượt đọc ngăn cách bởi ba lời gọi <code>fseek</code> — mỗi lời gọi một cái mốc. Năm dải xanh lá bên phải đánh dấu chỗ con trỏ đang đứng ở từng bước, còn ô xanh dương đánh dấu <strong>EOF (2 byte)</strong> ở cuối tệp. Chính cái ô nhỏ ấy là chìa khoá của cả slide.</p>
<ul>
<li><strong>Bước 1 — đọc 15 ký tự</strong>: <code>for (i=0;i&lt;15;i++) putchar(fgetc(f));</code> cho <code>content for tes</code>, tức vị trí 0–14, con trỏ giờ ở 15.</li>
<li><strong>Bước 2 — <code>fseek(f,-5,SEEK_CUR)</code></strong>: 15 − 5 = 10, và đọc 5 ký tự cho <code>r tes</code> — vị trí 10–14, đúng năm ký tự cuối của thứ vừa in. Đo được: <code>ftell</code> 15 → 10, trả về 0.</li>
<li><strong>Bước 3 — <code>fseek(f,-10,SEEK_END)</code></strong>: console hiện <code>funct</code>, tức vị trí 26–30. Điều đó chỉ đúng nếu độ dài tệp là 36 chứ không phải 34 — mà phần chữ thì có 34 ký tự. Hai byte thiếu kia chính là <code>\\r\\n</code> ở cuối tệp, và đó đúng là thứ ô xanh "EOF (2bytes)" trên slide đang muốn nói.</li>
<li><strong>Bước 4 — <code>fseek(f,10,SEEK_SET)</code></strong>: vị trí tuyệt đối 10, đọc 5 lại cho <code>r tes</code> — cùng đoạn chữ với bước 2, nhưng tới nơi bằng một con đường hoàn toàn khác. Sự lặp lại này là cố ý: nó cho thấy <code>SEEK_CUR</code> và <code>SEEK_SET</code> đáp xuống cùng một byte.</li>
<li><strong>Dựng lại, đã đo hai lần</strong> — trên tệp đúng 36 byte (chữ + CRLF), lần chạy của tôi in ra <code>content for tes</code> / <code>r tes</code> / <code>funct</code> / <code>r tes</code>, <strong>giống hệt slide</strong>. Trên tệp 34 byte (không có xuống dòng cuối, kiểu macOS hay tạo), khối thứ ba lại ra <code>k fun</code>, vì 34 − 10 = 24 và vị trí 24 là chữ <code>k</code> của "fseek".</li>
<li><strong>Vậy slide đúng, nhưng chỉ đúng trên máy của nó</strong> — và đó mới là bài học thật chứ không phải một khuyết điểm. <code>SEEK_END</code> phụ thuộc độ dài tính bằng byte của tệp, mà độ dài byte của một tệp văn bản lại phụ thuộc hệ điều hành. Chuẩn C nói thẳng: trên luồng văn bản, việc hỗ trợ <code>SEEK_END</code> không bắt buộc phải có ý nghĩa.</li>
</ul>
<table>
<tr><th>Bước</th><th>Lời gọi</th><th>Vị trí sau đó</th><th>Tệp 36 byte (slide, CRLF)</th><th>Tệp 34 byte (macOS, không NL)</th></tr>
<tr><td>1</td><td>đọc 15 ký tự từ 0</td><td>15</td><td><code>content for tes</code></td><td><code>content for tes</code></td></tr>
<tr><td>2</td><td><code>fseek(f,-5,SEEK_CUR)</code></td><td>10</td><td><code>r tes</code></td><td><code>r tes</code></td></tr>
<tr><td>3</td><td><code>fseek(f,-10,SEEK_END)</code></td><td>26 so với 24</td><td><strong><code>funct</code></strong></td><td><strong><code>k fun</code></strong></td></tr>
<tr><td>4</td><td><code>fseek(f,10,SEEK_SET)</code></td><td>10</td><td><code>r tes</code></td><td><code>r tes</code></td></tr>
</table>
<p class="dap-an">✅ Đáp án — cả hai cột trong bảng đều là lần chạy thật chính mã nguồn của slide, biên dịch bằng <code>cc -Wall</code>, chỉ khác nhau ở cái tệp. Bước 1, 2 và 4 giống nhau ở mọi nơi vì <code>SEEK_SET</code> và <code>SEEK_CUR</code> đếm từ những điểm cố định NẰM TRONG dữ liệu; bước 3 lệch nhau vì <code>SEEK_END</code> đếm từ một điểm do hệ điều hành quyết định. Nếu kết quả bài tập này của bạn lệch slide hai ký tự thì bạn không sai — tệp của bạn ngắn hơn hai byte.</p>
<p class="pitfall">⚠️ Thói quen an toàn làm khác biệt ấy biến mất: <strong>mở tệp ở chế độ nhị phân (<code>"rb"</code>) mỗi khi định dùng <code>fseek</code>, và chỉ dùng <code>SEEK_END</code> trên luồng nhị phân</strong>. Khi đó số byte là số byte, trên mọi máy. Với tệp văn bản, phép dời được chuẩn bảo đảm là <code>SEEK_SET</code> với một độ dời lấy trước đó từ <code>ftell</code> trên chính luồng ấy.</p>`],

      [42, 'Summary',
        `<p class="y-chinh">🎯 Six lines closing Slot 19-20, and they map one-to-one onto the six operations promised on slide 15. Read them as a checklist: if you cannot write the code for a line without looking, that is the part to revise.</p>
<ul>
<li><strong>"What a file is? The role of files in storing data on secondary memory"</strong> — slides 5 and 7: a named area of secondary storage, whose distinguishing feature is the EOF mark. The reason it exists is that console output dies with the process; a file does not. You saw that concretely on slide 35, where <code>readProducts</code> recovered data that <code>writeProducts</code> had already forgotten.</li>
<li><strong>"Types of Files in C"</strong> — slides 10–13: text stores ASCII codes of digits, binary stores the machine representation. Measured on slide 36: same three products, 39 bytes as text against 36 as binary, text readable in Notepad and binary not, text losing 1234.5678 to 1234.5699 and binary keeping it exactly.</li>
<li><strong>"Open/Close files"</strong> — <code>fopen</code> with a mode, always tested against <code>NULL</code>; <code>fclose</code> always, because an unflushed buffer measured 0 bytes on disk on slide 23. Modes starting with <code>w</code>/<code>a</code> create, <code>w</code> truncates, <code>b</code> means binary.</li>
<li><strong>"Read and write data to/from text files and binary files"</strong> — the four pairs: <code>fprintf</code>/<code>fscanf</code>, <code>fputs</code>/<code>fgets</code>, <code>fputc</code>/<code>fgetc</code>, <code>fwrite</code>/<code>fread</code>. Use a pair, never a mixture; crossing them returned 0 items one way and pure garbage the other, measured on slide 32.</li>
<li><strong>"Move the pointer to work with data in files"</strong> — <code>fseek</code> with <code>SEEK_SET</code>/<code>SEEK_CUR</code>/<code>SEEK_END</code>, <code>ftell</code> to read the position, <code>rewind</code> to go home <em>and</em> clear the error flag. Record <code>k</code> of a binary file lives at <code>k * sizeof(Rec)</code>.</li>
<li><strong>The three things the deck itself got wrong, so you do not carry them into the exam</strong> — <code>fgetw()</code> does not exist (slide 24; clang refuses to compile a call to it); <code>fputs</code> does <em>not</em> append a newline (slide 26; measured with <code>od -c</code>); and <code>while(!feof(f))</code> is the classic wrong loop (slides 29–30; measured at one duplicated record and at an infinite loop on bad input).</li>
</ul>
<table>
<tr><th>If the exam asks…</th><th>The answer that earns the mark</th></tr>
<tr><td>How do I loop over a text file?</td><td><code>while (fgets(buf, sizeof buf, f) != NULL)</code> — and strip the <code>\\n</code>, measured at <code>strlen</code> 18 vs 17</td></tr>
<tr><td>How do I loop over a binary file?</td><td><code>while (fread(&amp;r, sizeof r, 1, f) == 1)</code></td></tr>
<tr><td>Why is <code>while(!feof(f))</code> wrong?</td><td>EOF is set only <em>after</em> a read fails ⇒ one extra iteration on stale data</td></tr>
<tr><td>Why <code>int c</code>, not <code>char c</code>, for <code>fgetc</code>?</td><td>256 byte values + <code>EOF</code> need 257 distinct results; a <code>char</code> has 256</td></tr>
<tr><td>What does <code>fread</code> return?</td><td>the number of <strong>elements</strong> read, not bytes</td></tr>
<tr><td>Difference between <code>rewind</code> and <code>fseek(f,0,SEEK_SET)</code>?</td><td><code>rewind</code> also clears <code>ferror</code> and returns nothing</td></tr>
</table>
<p class="meo">💡 One exercise that touches all six summary lines at once: take the 3-record <code>products.bin</code> from slide 36, open it <code>"r+b"</code>, use <code>fseek</code>+<code>ftell</code> to count the records, jump straight to the last one, raise its price by 10%, write it back in place, then <code>rewind</code> and print the whole list. Fewer than 40 lines, and every idea from slides 22–41 appears in it exactly once.</p>`,
        `<p class="y-chinh">🎯 Sáu dòng khép lại Slot 19-20, và chúng ứng một-một với sáu thao tác đã hứa ở slide 15. Hãy đọc chúng như một danh sách kiểm: dòng nào mà bạn không viết nổi mã ra giấy khi không nhìn tài liệu thì đó là phần cần ôn.</p>
<ul>
<li><strong>"Tệp là gì? Vai trò của tệp trong việc lưu dữ liệu trên bộ nhớ ngoài"</strong> — slide 5 và 7: một vùng có tên trên bộ nhớ phụ, mà đặc điểm nhận dạng là dấu EOF. Lý do nó tồn tại là vì đầu ra trên màn hình chết theo tiến trình, còn tệp thì không. Bạn đã thấy cụ thể ở slide 35, nơi <code>readProducts</code> lấy lại được dữ liệu mà <code>writeProducts</code> đã quên sạch.</li>
<li><strong>"Các loại tệp trong C"</strong> — slide 10–13: tệp văn bản lưu mã ASCII của các chữ số, tệp nhị phân lưu biểu diễn của máy. Đo ở slide 36: cùng ba sản phẩm, 39 byte dạng văn bản so với 36 byte dạng nhị phân, văn bản đọc được bằng Notepad còn nhị phân thì không, văn bản làm 1234,5678 thành 1234,5699 còn nhị phân giữ nguyên chính xác.</li>
<li><strong>"Mở/Đóng tệp"</strong> — <code>fopen</code> kèm chế độ, luôn kiểm với <code>NULL</code>; <code>fclose</code> luôn luôn, vì bộ đệm chưa xả đo được 0 byte trên đĩa ở slide 23. Chế độ bắt đầu bằng <code>w</code>/<code>a</code> thì tạo tệp, <code>w</code> xoá trắng, chữ <code>b</code> nghĩa là nhị phân.</li>
<li><strong>"Đọc và ghi dữ liệu vào/từ tệp văn bản và tệp nhị phân"</strong> — bốn cặp: <code>fprintf</code>/<code>fscanf</code>, <code>fputs</code>/<code>fgets</code>, <code>fputc</code>/<code>fgetc</code>, <code>fwrite</code>/<code>fread</code>. Dùng trọn một cặp, đừng bao giờ trộn; bắt chéo thì một chiều trả về 0 mục còn chiều kia cho rác thuần, đã đo ở slide 32.</li>
<li><strong>"Di chuyển con trỏ để làm việc với dữ liệu trong tệp"</strong> — <code>fseek</code> với <code>SEEK_SET</code>/<code>SEEK_CUR</code>/<code>SEEK_END</code>, <code>ftell</code> để đọc vị trí, <code>rewind</code> để về đầu VÀ xoá cờ lỗi. Bản ghi thứ <code>k</code> của tệp nhị phân nằm ở <code>k * sizeof(Rec)</code>.</li>
<li><strong>Ba chỗ chính deck này ghi sai, để bạn không mang vào phòng thi</strong> — <code>fgetw()</code> KHÔNG tồn tại (slide 24; clang từ chối biên dịch lời gọi tới nó); <code>fputs</code> KHÔNG tự thêm ký tự xuống dòng (slide 26; đo bằng <code>od -c</code>); và <code>while(!feof(f))</code> là vòng lặp sai kinh điển (slide 29–30; đo được một bản ghi bị lặp và một vòng lặp vô tận khi dữ liệu hỏng).</li>
</ul>
<table>
<tr><th>Nếu đề thi hỏi…</th><th>Câu trả lời ăn điểm</th></tr>
<tr><td>Lặp qua một tệp văn bản thế nào?</td><td><code>while (fgets(buf, sizeof buf, f) != NULL)</code> — và nhớ cắt dấu <code>\\n</code>, đo được <code>strlen</code> 18 so với 17</td></tr>
<tr><td>Lặp qua một tệp nhị phân thế nào?</td><td><code>while (fread(&amp;r, sizeof r, 1, f) == 1)</code></td></tr>
<tr><td>Vì sao <code>while(!feof(f))</code> sai?</td><td>cờ EOF chỉ bật SAU KHI một lần đọc thất bại ⇒ thừa một vòng chạy trên dữ liệu cũ</td></tr>
<tr><td>Vì sao dùng <code>int c</code> chứ không <code>char c</code> cho <code>fgetc</code>?</td><td>256 giá trị byte cộng <code>EOF</code> cần 257 kết quả phân biệt; một <code>char</code> chỉ có 256</td></tr>
<tr><td><code>fread</code> trả về cái gì?</td><td>số <strong>phần tử</strong> đọc được, không phải số byte</td></tr>
<tr><td><code>rewind</code> khác <code>fseek(f,0,SEEK_SET)</code> ở đâu?</td><td><code>rewind</code> còn xoá cả cờ <code>ferror</code> và không trả về gì</td></tr>
</table>
<p class="meo">💡 Một bài tập chạm vào cả sáu dòng tóm tắt cùng lúc: lấy tệp <code>products.bin</code> 3 bản ghi ở slide 36, mở bằng <code>"r+b"</code>, dùng <code>fseek</code>+<code>ftell</code> để đếm số bản ghi, nhảy thẳng tới bản ghi cuối, tăng giá nó thêm 10%, ghi đè lại tại chỗ, rồi <code>rewind</code> và in toàn bộ danh sách. Chưa tới 40 dòng, và mọi ý từ slide 22 đến 41 đều xuất hiện trong đó đúng một lần.</p>`],
    ]),
  ].join('\n'),
};
