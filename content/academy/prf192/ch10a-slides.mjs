/**
 * PRF192 · Slot 19-20 — Files, học theo từng slide: PHẦN A (slide 1–21).
 * Deck 'prf9' (PRF9), 42 slide, ảnh đã render sẵn lên CDN images/academy/PRF192/v1/prf9/NNN.webp.
 *
 * Nội dung bám ĐÚNG chữ trích từ Slot_19_20_Files.pptx của trường
 * (/tmp/prf192-text/prf9.txt, slide 1→21). Các slide đặt SƠ ĐỒ / MÃ NGUỒN / KHUNG
 * CONSOLE TRONG ẢNH (13, 17, 18, 19, 20, 21) đã được đọc thẳng từ ảnh.
 *
 * MỌI chương trình và con số dưới đây đã biên dịch thật bằng `cc -Wall` và chạy:
 *   · fprintf("%d",12345) → 5 byte 31 32 33 34 35 ; fwrite(int 12345) → 4 byte 39 30 00 00 ✓
 *   · short 260 bằng fwrite → 04 01 (little-endian). SLIDE 13 vẽ 00000001 00000100
 *     (big-endian) — đã nêu rõ trong bài, KHÔNG im lặng chép lại và KHÔNG tự sửa slide.
 *   · bảng 12 chế độ mở tệp: đo thật từng chế độ (tệp chưa có / đã có "HELLO" 5 byte),
 *     ftell lúc mở, đọc được không, ghi được không, kích thước sau khi đóng.
 *       r/rb/r+/rb+ → NULL khi tệp chưa có (errno=2) · w/w+/wb/wb+ → cắt về 0 byte NGAY
 *       LÚC MỞ, chưa ghi gì · a/a+/ab/ab+ → ftell=5, fseek(0) rồi ghi VẪN nối đuôi ✓
 *   · r+ ghi 'J' tại vị trí 0 trên "HELLO" → "JELLO" (5 byte, không cắt) ✓
 *   · a+ sau rewind đọc lại được "HELLOWX" ; w+ chỉ thấy "WX" ; r+ thấy "WXLLO" ✓
 *   · fopen thất bại: "khong_he_co.txt","r" → NULL errno=2 "No such file or directory";
 *     chế độ bậy "q" → NULL errno=22 "Invalid argument" ✓
 *   · không fclose + _Exit → tệp 0 byte (mất trắng) ; có fclose → 30 byte ✓
 *   · sizeof(FILE)=152, sizeof(FILE*)=8, FOPEN_MAX=20, EOF=-1, tệp "AB" = đúng 2 byte
 *     (KHÔNG có byte đánh dấu EOF nằm trong tệp) ✓
 *   · đường dẫn tương đối: cùng một chương trình, chạy trong sub/ thì fopen OK, chạy từ
 *     ngoài thì NULL — đúng cái bẫy "Dev-C++ chạy được, nháy đúp thì không" ✓
 *   · "C:\data\a.txt" (thiếu escape) → 11 byte 43 3A 64 61 74 61 07 2E 74 78 74 (có BEL 0x07);
 *     "C:\\data\\a.txt" → 13 byte đúng ✓
 *   ⚠ SLIDE 19+20 chỉ liệt kê 11 chế độ — THIẾU HẲN "ab". Đã nêu rõ.
 *   ⚠ SLIDE 17 viết `FILE *fp = NULL` THIẾU DẤU CHẤM PHẨY. Đã nêu rõ.
 *   ⚠ SLIDE 21 dùng exit(0) khi mở tệp THẤT BẠI → hệ điều hành nhận mã "thành công".
 *     Đo thật: echo $? = 0 ở cả hai trường hợp. Đã nêu rõ.
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'prf9';

export default {
  title: '10.0a — Slide by slide: What a file is, text vs binary, and opening files in C (slides 1–21)|||10.0a — Slide bài giảng: Tệp là gì, text vs binary & mở tệp trong C (slide 1–21)',
  slug: 'prf192-10-0a-slides-tep-tin-mo-tep',
  type: 'DOCUMENT',
  description: 'Nửa đầu Slot 19-20 (slide 1–21): tệp là gì, vì sao chương trình C cần ghi ra tệp, hai loại tệp (văn bản và nhị phân) khác nhau ở đâu, các thao tác trên tệp, con trỏ FILE *, hàm fopen và toàn bộ các chế độ mở tệp. Mọi con số trong bài đều đo thật bằng chương trình C biên dịch với cc -Wall: bảng so text/binary có kèm xxd từng byte, bảng 12 chế độ mở tệp được dò bằng chương trình chứ không chép từ trí nhớ, và bốn chỗ slide gốc sai hoặc thiếu đã được chỉ ra thay vì chép lại.',
  content: [
    walkHead(D, 1, 21),
    walk(D, [

      [1, 'Files',
        `<p class="y-chinh">🎯 One word on the title slide, and it is the first time in PRF192 that your program is allowed to leave a mark on the machine. Everything before this slot lived and died inside RAM; from here on, data <strong>survives the program</strong>.</p>
<ul>
<li><strong>Where this sits in the course</strong> — Slot 02-04 taught <code>scanf</code>/<code>printf</code> (the keyboard and the screen), Slot 10 taught pointers, Slot 13-15 taught arrays and structs, Slot 16-18 taught strings. Files use <em>all four</em>: a <code>FILE *</code> is a pointer, a filename is a string, and what you save is usually an array of structs.</li>
<li><strong>The one-sentence problem</strong> — run your student-management program, type 100 records, close it, and everything is gone. Not because of a bug: RAM is <em>volatile</em> storage, and the operating system reclaims every byte a process owned the moment it exits.</li>
<li><strong>The one-sentence solution</strong> — secondary storage (disk, SSD, USB stick) is <em>non-volatile</em>. A file is the name the operating system gives to a region of it, and C reaches that region through nine or ten library functions in <code>&lt;stdio.h&gt;</code>.</li>
<li><strong>Why it is the last slot</strong> — file I/O is not conceptually hard, but every other topic has to be in place first. You cannot write "save the array of accounts to disk" until you can write an array of accounts.</li>
<li><strong>What the 42 slides cover</strong> — slides 1–21 (this lesson): what a file is, why we need it, text vs binary, and <code>fopen</code>. Slides 22–42: creating, reading, writing, closing, and a full demo program.</li>
</ul>
<p class="meo">💡 Keep one image in your head for the whole slot: a file is a <strong>very long array of bytes on disk</strong>, and <code>FILE *fptr</code> is a bookmark that remembers <em>which</em> file and <em>where in it</em> you currently are. Every function in this slot either moves the bookmark or copies bytes across it.</p>`,
        `<p class="y-chinh">🎯 Một chữ trên slide tiêu đề, và đây là lần đầu tiên trong PRF192 chương trình của bạn được phép để lại dấu vết trên máy. Mọi thứ trước slot này sống và chết trong RAM; từ đây trở đi, dữ liệu <strong>sống lâu hơn chương trình</strong>.</p>
<ul>
<li><strong>Chỗ đứng trong môn học</strong> — Slot 02-04 dạy <code>scanf</code>/<code>printf</code> (bàn phím và màn hình), Slot 10 dạy con trỏ, Slot 13-15 dạy mảng và struct, Slot 16-18 dạy chuỗi. Tệp dùng <em>cả bốn</em>: <code>FILE *</code> là con trỏ, tên tệp là chuỗi, và thứ bạn lưu thường là một mảng struct.</li>
<li><strong>Vấn đề gói trong một câu</strong> — chạy chương trình quản lý sinh viên, gõ vào 100 bản ghi, tắt chương trình, thế là mất sạch. Không phải vì có lỗi: RAM là bộ nhớ <em>bay hơi</em>, và hệ điều hành thu hồi mọi byte của tiến trình ngay khi nó thoát.</li>
<li><strong>Lời giải gói trong một câu</strong> — bộ nhớ ngoài (đĩa cứng, SSD, USB) là <em>không bay hơi</em>. Tệp là cái tên hệ điều hành đặt cho một vùng trên đó, và C với tới vùng ấy qua chín mười hàm thư viện trong <code>&lt;stdio.h&gt;</code>.</li>
<li><strong>Vì sao nó là slot cuối</strong> — nhập xuất tệp không khó về mặt khái niệm, nhưng phải có đủ mọi thứ khác trước đã. Bạn không thể viết "lưu mảng tài khoản xuống đĩa" khi chưa viết nổi một mảng tài khoản.</li>
<li><strong>42 slide này nói gì</strong> — slide 1–21 (bài này): tệp là gì, vì sao cần, text so với binary, và hàm <code>fopen</code>. Slide 22–42: tạo, đọc, ghi, đóng tệp, và một chương trình demo trọn vẹn.</li>
</ul>
<p class="meo">💡 Giữ một hình ảnh duy nhất trong đầu suốt slot này: tệp là một <strong>mảng byte rất dài nằm trên đĩa</strong>, còn <code>FILE *fptr</code> là cái kẹp sách nhớ giùm bạn <em>tệp nào</em> và <em>đang ở chỗ nào</em> trong tệp đó. Mọi hàm của slot này hoặc dời cái kẹp sách, hoặc chép byte qua lại chỗ nó đang đứng.</p>`],

      [2, 'Objectives',
        `<p class="y-chinh">🎯 Three questions make up the whole slot: <strong>What is a file? · How are data stored in files? · How to access data in files?</strong> Slides 1–21 answer the first two completely and start the third.</p>
<ul>
<li><strong>"What is a file?"</strong> — answered on slide 5 in four sentences you should be able to recite: a named area of secondary storage, possibly fragmented, not necessarily contiguous, whose fundamental unit is the <em>byte</em> and whose distinguishing feature is the <em>end-of-file mark</em>.</li>
<li><strong>"How are data stored in files?"</strong> — answered by slides 10–13: two storage formats, <em>text</em> (everything converted to ASCII characters) and <em>binary</em> (the same bytes that were in RAM, copied out untouched). Slide 13 draws the difference with the number 260.</li>
<li><strong>"How to access data in files?"</strong> — slides 15–21 start it: the six operations, the <code>FILE *</code> handle, <code>fopen</code> and its access modes. The actual reading and writing functions come in slides 24–27.</li>
<li><strong>What is NOT in the objectives</strong> — nothing about databases, nothing about directories, nothing about file permissions. The exam stays inside <code>&lt;stdio.h&gt;</code>.</li>
<li><strong>How this is examined</strong> — usually as a short program: open a file, loop over records, close it. The marks are lost on three things, all of which are in this half of the deck: opening with the wrong mode, forgetting the <code>NULL</code> check, forgetting <code>fclose</code>.</li>
</ul>
<p class="meo">💡 Use the three questions as a revision checklist. If you can write, from memory, one paragraph for each — plus one runnable program for the third — you are ready for the file part of the PE.</p>`,
        `<p class="y-chinh">🎯 Ba câu hỏi làm nên cả slot: <strong>Tệp là gì? · Dữ liệu được lưu trong tệp như thế nào? · Truy cập dữ liệu trong tệp ra sao?</strong> Slide 1–21 trả lời trọn vẹn hai câu đầu và bắt đầu câu thứ ba.</p>
<ul>
<li><strong>"Tệp là gì?"</strong> — slide 5 trả lời bằng bốn câu bạn phải đọc thuộc được: một vùng có tên trên bộ nhớ ngoài, có thể bị phân mảnh, không nhất thiết nằm liền nhau, đơn vị cơ bản là <em>byte</em>, và dấu hiệu phân biệt là <em>dấu kết thúc tệp</em> (EOF).</li>
<li><strong>"Dữ liệu lưu thế nào?"</strong> — slide 10–13 trả lời: hai định dạng lưu trữ, <em>văn bản</em> (mọi thứ đổi thành ký tự ASCII) và <em>nhị phân</em> (đúng những byte đang nằm trong RAM, chép thẳng ra). Slide 13 vẽ sự khác biệt bằng con số 260.</li>
<li><strong>"Truy cập ra sao?"</strong> — slide 15–21 mở màn: sáu thao tác, con trỏ <code>FILE *</code>, hàm <code>fopen</code> và các chế độ mở. Các hàm đọc/ghi thật sự nằm ở slide 24–27.</li>
<li><strong>Thứ KHÔNG có trong mục tiêu</strong> — không nói gì về cơ sở dữ liệu, không nói về thư mục, không nói về quyền truy cập tệp. Đề thi nằm gọn trong <code>&lt;stdio.h&gt;</code>.</li>
<li><strong>Thi kiểu gì</strong> — thường là một chương trình ngắn: mở tệp, lặp qua các bản ghi, đóng tệp. Điểm mất ở ba chỗ, cả ba đều nằm trong nửa deck này: mở sai chế độ, quên kiểm <code>NULL</code>, quên <code>fclose</code>.</li>
</ul>
<p class="meo">💡 Dùng ba câu hỏi này làm bảng kiểm khi ôn. Viết được từ trí nhớ mỗi câu một đoạn — cộng thêm một chương trình chạy được cho câu thứ ba — là phần tệp của bài PE coi như xong.</p>`],

      [3, 'Contents',
        `<p class="y-chinh">🎯 The map of the whole 42-slide deck, in four numbered parts. Parts 1, 2 and 3 fit entirely inside this lesson; part 4 is where slides 1–21 stop (at "Open") and slides 22–42 continue.</p>
<ul>
<li><strong>1. What is a file?</strong> — slides 4–5. Two slides, one definition, and the vocabulary (secondary storage, fragmented, byte, EOF) you will be quoted back at.</li>
<li><strong>2. Why do we need File Handling in C?</strong> — slides 6–8. The motivation, then four named benefits: <em>Reusability · Portability · Efficient · Storage Capacity</em>. These four words are a classic multiple-choice question.</li>
<li><strong>3. Types of Files in C</strong> — slides 9–13. Text files, binary files, and the diagram that shows the same data going down both roads.</li>
<li><strong>4. C File Operations: Open, Close, Create, Read, Write, …</strong> — slides 14 onward. The title itself lists them in the order the deck teaches them. This lesson reaches <em>Open</em> (slides 18–21); <em>Create</em> is slide 22, <em>Read</em> slide 24, <em>Write</em> slide 26, and closing comes with the demo.</li>
<li><strong>The shape to notice</strong> — <em>definition → motivation → data format → operations</em>. That is the same order every I/O topic in any language is taught, which is why the second time you meet files (in Java, Python, C#) the only new thing is the function names.</li>
</ul>
<p class="meo">💡 Part 4 is the only part that produces code in an exam. Parts 1–3 produce short-answer and multiple-choice questions — which are the cheapest marks in the paper, so do not skim slides 5, 8 and 13.</p>`,
        `<p class="y-chinh">🎯 Bản đồ của cả deck 42 slide, chia bốn phần đánh số. Phần 1, 2, 3 nằm gọn trong bài này; phần 4 là chỗ slide 1–21 dừng lại (ở "Open") và slide 22–42 đi tiếp.</p>
<ul>
<li><strong>1. Tệp là gì?</strong> — slide 4–5. Hai slide, một định nghĩa, và bộ từ vựng (bộ nhớ ngoài, phân mảnh, byte, EOF) mà người ta sẽ hỏi lại bạn nguyên văn.</li>
<li><strong>2. Vì sao C cần xử lý tệp?</strong> — slide 6–8. Động cơ, rồi bốn lợi ích có tên hẳn hoi: <em>Reusability · Portability · Efficient · Storage Capacity</em>. Bốn chữ này là một câu trắc nghiệm kinh điển.</li>
<li><strong>3. Các loại tệp trong C</strong> — slide 9–13. Tệp văn bản, tệp nhị phân, và sơ đồ cho thấy cùng một dữ liệu đi theo hai con đường.</li>
<li><strong>4. Các thao tác trên tệp: Open, Close, Create, Read, Write, …</strong> — từ slide 14 trở đi. Chính cái tiêu đề đã liệt kê theo đúng thứ tự deck dạy. Bài này đi tới <em>Open</em> (slide 18–21); <em>Create</em> là slide 22, <em>Read</em> slide 24, <em>Write</em> slide 26, còn đóng tệp đi kèm phần demo.</li>
<li><strong>Hình dạng cần để ý</strong> — <em>định nghĩa → động cơ → định dạng dữ liệu → thao tác</em>. Đúng cái thứ tự mà mọi chủ đề nhập xuất ở mọi ngôn ngữ đều dạy, nên lần thứ hai bạn gặp tệp (trong Java, Python, C#) thì thứ duy nhất mới là tên hàm.</li>
</ul>
<p class="meo">💡 Phần 4 là phần duy nhất đẻ ra code trong đề thi. Phần 1–3 đẻ ra câu hỏi ngắn và trắc nghiệm — mà đó là loại điểm rẻ nhất trong đề, nên đừng lướt qua slide 5, 8 và 13.</p>`],

      [4, '1. What is a file?',
        `<p class="y-chinh">🎯 A section divider. It is worth one minute because the question is genuinely harder than it looks: you use files every day and still cannot define one, and this slot defines it precisely.</p>
<ul>
<li><strong>What most students answer</strong> — "a file is a document on the computer". That is a <em>use</em> of files, not a definition, and it scores zero. The slide's answer is about <em>storage</em>, not about content.</li>
<li><strong>The three words the definition turns on</strong> — <em>named</em>, <em>area</em>, <em>secondary storage</em>. Drop any one and the definition breaks: an unnamed area cannot be found again, an area of RAM is not a file, and a name with no area behind it is just a string.</li>
<li><strong>Primary vs secondary storage</strong> — primary is RAM: fast, byte-addressable by the CPU, erased at power-off. Secondary is disk/SSD/USB: slower, addressed in blocks, kept at power-off. Files live only in the second kind; that is exactly why they solve the problem slide 7 describes.</li>
<li><strong>What the OS adds</strong> — the operating system keeps a directory that maps a <em>name</em> to a list of blocks. C never sees that list; it asks the OS by name and gets a handle back. That is the whole reason <code>fopen</code> takes a string and returns a pointer.</li>
<li><strong>Coming next</strong> — slide 5 gives four sentences. Learn them as four separate facts, because exams ask them one at a time.</li>
</ul>
<p class="meo">💡 Quick self-test for the definition: is the clipboard a file? (No — RAM.) Is a folder a file? (In Unix, technically yes; in this course, no.) Is <code>stdout</code> a file? (In C, yes — it is a <code>FILE *</code>, which is why <code>fprintf(stdout, …)</code> is the same as <code>printf(…)</code>.)</p>`,
        `<p class="y-chinh">🎯 Một slide phân mục. Nó đáng một phút vì câu hỏi này khó thật chứ không dễ như trông: bạn dùng tệp mỗi ngày mà vẫn không định nghĩa nổi, và slot này định nghĩa nó chính xác.</p>
<ul>
<li><strong>Đa số sinh viên trả lời gì</strong> — "tệp là một tài liệu trên máy tính". Đó là <em>công dụng</em> của tệp chứ không phải định nghĩa, và nó được 0 điểm. Câu trả lời của slide nói về <em>chỗ lưu</em>, không nói về nội dung.</li>
<li><strong>Ba chữ mà định nghĩa xoay quanh</strong> — <em>có tên</em>, <em>một vùng</em>, <em>bộ nhớ ngoài</em>. Bỏ chữ nào cũng gãy: vùng không tên thì không tìm lại được, một vùng RAM thì không phải tệp, còn cái tên mà chẳng có vùng nào phía sau thì chỉ là một chuỗi.</li>
<li><strong>Bộ nhớ trong và bộ nhớ ngoài</strong> — bộ nhớ trong là RAM: nhanh, CPU đánh địa chỉ tới từng byte, mất điện là sạch. Bộ nhớ ngoài là đĩa/SSD/USB: chậm hơn, đánh địa chỉ theo khối, mất điện vẫn còn. Tệp chỉ sống ở loại thứ hai; đúng vì thế nó mới giải được bài toán slide 7 nêu ra.</li>
<li><strong>Hệ điều hành thêm vào cái gì</strong> — hệ điều hành giữ một danh mục ánh xạ <em>tên</em> sang danh sách các khối trên đĩa. C không bao giờ nhìn thấy danh sách ấy; nó hỏi hệ điều hành bằng tên rồi nhận về một cái tay nắm. Đó chính là lý do <code>fopen</code> nhận một chuỗi và trả về một con trỏ.</li>
<li><strong>Tiếp theo là gì</strong> — slide 5 cho bốn câu. Học thành bốn sự kiện tách rời, vì đề thi hỏi từng cái một.</li>
</ul>
<p class="meo">💡 Tự kiểm nhanh phần định nghĩa: clipboard có phải tệp không? (Không — RAM.) Thư mục có phải tệp không? (Trong Unix thì về kỹ thuật là có; trong môn này thì không.) <code>stdout</code> có phải tệp không? (Trong C thì có — nó là một <code>FILE *</code>, nên <code>fprintf(stdout, …)</code> chính là <code>printf(…)</code>.)</p>`],

      [5, 'What is a file?',
        `<p class="y-chinh">🎯 The definition, in four sentences: a file is a <strong>named area of secondary storage</strong>; it <strong>may be fragmented</strong>; it does <strong>not necessarily occupy contiguous space</strong>; and its fundamental unit is the <strong>byte</strong>, with the <strong>end-of-file mark (EOF, typically −1)</strong> as its distinguishing feature.</p>
<ul>
<li><strong>"Named area of secondary storage"</strong> — the whole definition in six words. Everything else on the slide qualifies it.</li>
<li><strong>"May be fragmented"</strong> — the file <em>you</em> see is one continuous run of bytes numbered 0, 1, 2, …; the file <em>the disk</em> holds may be scattered over blocks in five different places. The OS hides the scattering, which is precisely why you never call for a disk block in C — only for a byte offset.</li>
<li><strong>Why fragmentation matters to a C programmer</strong> — it does not affect correctness at all, only speed. It is the reason reading a file sequentially is much faster than jumping around it with <code>fseek</code> (slide 15's "moving to a specific location").</li>
<li><strong>"The byte is the fundamental storage unit"</strong> — not the line, not the record, not the <code>int</code>. This is the single most useful sentence on the slide: it tells you that a file has no idea what your data <em>means</em>. Interpretation is entirely up to your program, which is what makes text vs binary (slide 13) a real choice.</li>
<li><strong>"EOF typically has the value −1"</strong> — I checked the actual constant: <code>printf("%d", EOF)</code> prints <code>-1</code>. Note carefully that it is <code>int</code>, not <code>char</code>: that is why <code>fgetc</code> returns <code>int</code> and why <code>char c = fgetc(f);</code> is a classic bug — a <code>char</code> cannot hold −1 distinctly from the byte <code>0xFF</code>.</li>
<li><strong>Measured: is EOF a byte inside the file?</strong> — I wrote exactly two characters "AB" to a file: <code>ls -l</code> reports <strong>2</strong> bytes and <code>xxd</code> shows <code>41 42</code> and nothing else. So on Linux/macOS the end-of-file is <em>a condition</em> the OS reports when you read past the last byte, not a marker stored on disk. (Old MS-DOS really did store <code>0x1A</code>, which is where the "mark" wording comes from.)</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
int main(void) {
    printf("EOF = %d\\n", EOF);           /* EOF = -1 */
    printf("FOPEN_MAX = %d\\n", FOPEN_MAX);   /* 20 on this machine */
    return 0;
}</code></pre>
<p class="dap-an">✅ Answer (measured, cc -Wall): <code>EOF = -1</code> and <code>FOPEN_MAX = 20</code>. The file "AB" measures exactly 2 bytes — no stored EOF byte. The slide's "typically has the value −1" is right, and "typically" is doing real work: the standard only promises EOF is a negative <code>int</code> constant.</p>
<p class="pitfall">⚠️ Never write <code>char c; while ((c = fgetc(f)) != EOF)</code>. On a machine where <code>char</code> is signed, a legitimate byte <code>0xFF</code> becomes −1 and the loop stops early; where <code>char</code> is unsigned, the comparison is never true and the loop never stops. Always <code>int c;</code>.</p>`,
        `<p class="y-chinh">🎯 Định nghĩa, gói trong bốn câu: tệp là <strong>một vùng có tên trên bộ nhớ ngoài</strong>; nó <strong>có thể bị phân mảnh</strong>; nó <strong>không nhất thiết chiếm vùng liền nhau</strong>; và đơn vị lưu trữ cơ bản của nó là <strong>byte</strong>, với <strong>dấu kết thúc tệp (EOF, thường có giá trị −1)</strong> làm dấu hiệu phân biệt.</p>
<ul>
<li><strong>"Vùng có tên trên bộ nhớ ngoài"</strong> — cả định nghĩa nằm trong sáu chữ. Mọi câu còn lại chỉ là chú thích cho nó.</li>
<li><strong>"Có thể bị phân mảnh"</strong> — tệp mà <em>bạn</em> thấy là một dải byte liên tục đánh số 0, 1, 2, …; tệp mà <em>cái đĩa</em> đang giữ có thể nằm rải ở năm chỗ khác nhau. Hệ điều hành che chuyện rải rác đó đi, và đúng vì thế trong C bạn không bao giờ gọi tới khối đĩa — chỉ gọi tới vị trí byte.</li>
<li><strong>Phân mảnh ảnh hưởng gì tới người viết C</strong> — không ảnh hưởng tính đúng đắn chút nào, chỉ ảnh hưởng tốc độ. Nó là lý do đọc tệp tuần tự nhanh hơn hẳn nhảy cóc bằng <code>fseek</code> (thao tác "moving to a specific location" ở slide 15).</li>
<li><strong>"Byte là đơn vị lưu trữ cơ bản"</strong> — không phải dòng, không phải bản ghi, không phải <code>int</code>. Đây là câu hữu ích nhất slide: nó cho bạn biết tệp KHÔNG hề biết dữ liệu của bạn <em>nghĩa là gì</em>. Diễn giải hoàn toàn do chương trình của bạn làm, và chính vì thế lựa chọn text hay binary (slide 13) mới là một lựa chọn thật.</li>
<li><strong>"EOF thường có giá trị −1"</strong> — tôi đã kiểm hằng số thật: <code>printf("%d", EOF)</code> in ra <code>-1</code>. Để ý kỹ nó là <code>int</code> chứ không phải <code>char</code>: đó là lý do <code>fgetc</code> trả về <code>int</code>, và là lý do <code>char c = fgetc(f);</code> là lỗi kinh điển — một <code>char</code> không thể phân biệt −1 với byte <code>0xFF</code>.</li>
<li><strong>Đo thật: EOF có phải một byte nằm trong tệp không?</strong> — tôi ghi đúng hai ký tự "AB" vào tệp: <code>ls -l</code> báo <strong>2</strong> byte và <code>xxd</code> hiện <code>41 42</code>, hết. Vậy trên Linux/macOS, kết thúc tệp là <em>một tình trạng</em> mà hệ điều hành báo khi bạn đọc vượt quá byte cuối, chứ không phải một dấu ghi trên đĩa. (MS-DOS ngày xưa thì có ghi thật byte <code>0x1A</code>, chữ "mark" sinh ra từ đó.)</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
int main(void) {
    printf("EOF = %d\\n", EOF);           /* EOF = -1 */
    printf("FOPEN_MAX = %d\\n", FOPEN_MAX);   /* 20 tren may nay */
    return 0;
}</code></pre>
<p class="dap-an">✅ Đáp án (đo thật, cc -Wall): <code>EOF = -1</code> và <code>FOPEN_MAX = 20</code>. Tệp "AB" đo được đúng 2 byte — không có byte EOF nào được lưu. Câu "thường có giá trị −1" của slide là đúng, và chữ "thường" có ý nghĩa thật: chuẩn chỉ hứa EOF là một hằng <code>int</code> âm.</p>
<p class="pitfall">⚠️ Đừng bao giờ viết <code>char c; while ((c = fgetc(f)) != EOF)</code>. Trên máy mà <code>char</code> có dấu, một byte hợp lệ <code>0xFF</code> biến thành −1 và vòng lặp dừng sớm; trên máy mà <code>char</code> không dấu thì phép so sánh không bao giờ đúng và vòng lặp không bao giờ dừng. Luôn dùng <code>int c;</code>.</p>`],

      [6, '2. Why do we need File Handling in C?',
        `<p class="y-chinh">🎯 A section divider asking the "so what". The honest answer is that without files, every program you have written in PRF192 is a <strong>calculator with amnesia</strong>: it computes correctly and then forgets everything.</p>
<ul>
<li><strong>Look back at your own labs</strong> — the student-management exercise from Slot 13-15 asks you to enter accounts, print them and search them. Close it and you re-type everything. Nobody would use that program twice.</li>
<li><strong>The three things files give you, in one line each</strong> — data that <em>outlives</em> the run (persistence), data that can be <em>moved</em> to another machine (portability), and data too big to hold in RAM at once (capacity). Slides 7 and 8 expand exactly these.</li>
<li><strong>Files are also the standard <em>input</em></strong> — not just output. Every real program reads configuration, test data or a dataset from a file rather than from a human typing it. Your PE will almost certainly ask you to read a file of records.</li>
<li><strong>The connection back to <code>scanf</code></strong> — you already know one pair of streams: <code>stdin</code> and <code>stdout</code>. Files are the same machinery with a different source, which is why the names rhyme: <code>scanf</code>/<code>fscanf</code>, <code>printf</code>/<code>fprintf</code>, <code>gets</code>/<code>fgets</code>, <code>getchar</code>/<code>fgetc</code>. Learn one column and you get the other free.</li>
<li><strong>What comes next</strong> — slide 7 states the problem (terminal output is not stored anywhere), slide 8 lists four named benefits that exam papers quote word for word.</li>
</ul>
<p class="meo">💡 Mnemonic for the whole section: <em>the screen is a conversation, a file is a memory</em>. A conversation ends when you walk away; a memory is still there tomorrow.</p>`,
        `<p class="y-chinh">🎯 Slide phân mục, hỏi câu "rồi sao?". Câu trả lời thành thật là: không có tệp thì mọi chương trình bạn viết trong PRF192 đều là một <strong>cái máy tính bỏ túi bị mất trí nhớ</strong> — tính đúng rồi quên sạch.</p>
<ul>
<li><strong>Nhìn lại chính bài lab của bạn</strong> — bài quản lý sinh viên ở Slot 13-15 bắt bạn nhập tài khoản, in ra, tìm kiếm. Tắt đi là gõ lại từ đầu. Không ai dùng chương trình đó tới lần thứ hai.</li>
<li><strong>Tệp cho bạn ba thứ, mỗi thứ một dòng</strong> — dữ liệu <em>sống lâu hơn</em> lần chạy (tính bền), dữ liệu <em>mang đi được</em> sang máy khác (tính di động), và dữ liệu lớn quá không nhét hết vào RAM được (sức chứa). Slide 7 và 8 khai triển đúng ba thứ này.</li>
<li><strong>Tệp còn là <em>đầu vào</em> chuẩn nữa</strong> — không chỉ đầu ra. Mọi chương trình thật đều đọc cấu hình, dữ liệu thử hay tập dữ liệu từ tệp chứ không chờ người gõ tay. Bài PE gần như chắc chắn sẽ bắt bạn đọc một tệp bản ghi.</li>
<li><strong>Mối nối ngược về <code>scanf</code></strong> — bạn đã biết một cặp luồng rồi: <code>stdin</code> và <code>stdout</code>. Tệp dùng đúng bộ máy ấy với nguồn khác, nên tên hàm mới vần với nhau: <code>scanf</code>/<code>fscanf</code>, <code>printf</code>/<code>fprintf</code>, <code>gets</code>/<code>fgets</code>, <code>getchar</code>/<code>fgetc</code>. Thuộc một cột là được tặng cột kia.</li>
<li><strong>Kế tiếp là gì</strong> — slide 7 nêu vấn đề (thứ in ra terminal không được lưu ở đâu cả), slide 8 liệt kê bốn lợi ích có tên mà đề thi trích nguyên văn.</li>
</ul>
<p class="meo">💡 Câu thần chú cho cả phần này: <em>màn hình là một cuộc trò chuyện, tệp là một ký ức</em>. Cuộc trò chuyện kết thúc khi bạn bước đi; ký ức ngày mai vẫn còn.</p>`],

      [7, 'Why do we need File Handling in C?',
        `<p class="y-chinh">🎯 Three sentences that name the problem: operations done on the <strong>prompt/terminal are not stored anywhere</strong>, the <strong>output is deleted when the program is closed</strong>, and in industry <strong>most programs are written to store the information</strong> they fetch. File handling is "exactly what the situation calls for".</p>
<ul>
<li><strong>"Not stored anywhere" is literal</strong> — <code>printf</code> writes to <code>stdout</code>, which is normally connected to a terminal window. The terminal keeps a scrollback buffer for <em>you</em>, but no program can read it back, and it disappears when the window closes.</li>
<li><strong>Two programs, one difference</strong> — the pair below differ by three lines and that is the whole slot in miniature: one prints, one saves.</li>
<li><strong>Why industry cares</strong> — an ATM that forgets balances at power-off is not a product. Persistence is not a feature you add at the end; it is why the program exists.</li>
<li><strong>Files are not the only answer, just the first one</strong> — later courses replace them with databases (DBI202) and network services. But a database is, underneath, files plus an index, so this slot is a genuine prerequisite rather than a detour.</li>
<li><strong>Redirection is a half-answer</strong> — from a terminal you can type <code>./prog &gt; out.txt</code> to capture output without changing the code. Useful, but the program still cannot <em>read back</em> what it wrote, cannot choose different files for different data, and cannot append to yesterday's results. That is why <code>fopen</code> exists.</li>
</ul>
<pre><code>/* A: mat het khi tat chuong trinh */
#include &lt;stdio.h&gt;
int main(void) {
    int total = 0;
    for (int i = 1; i &lt;= 5; i++) total += i;
    printf("Total = %d\\n", total);
    return 0;
}

/* B: con lai sau khi tat chuong trinh */
#include &lt;stdio.h&gt;
int main(void) {
    int total = 0;
    for (int i = 1; i &lt;= 5; i++) total += i;
    FILE *f = fopen("total.txt", "w");
    if (f == NULL) return 1;
    fprintf(f, "Total = %d\\n", total);
    fclose(f);
    return 0;
}</code></pre>
<p class="dap-an">✅ Answer (both compiled with cc -Wall and run): A prints <code>Total = 15</code> and leaves nothing behind. B prints nothing, and afterwards <code>total.txt</code> exists and contains <code>Total = 15</code> — 12 bytes on disk, still there after the process is gone. That single difference is the point of the entire slot.</p>
<p class="meo">💡 Notice how little changed: <code>printf(…)</code> became <code>fprintf(f, …)</code>, plus an open and a close around it. That is deliberate — the C library was designed so that "print to screen" and "print to file" are the same function with one extra argument.</p>`,
        `<p class="y-chinh">🎯 Ba câu nêu đúng vấn đề: những thao tác làm trên <strong>màn hình dòng lệnh không được lưu ở đâu cả</strong>, <strong>kết quả in ra bị xoá khi chương trình đóng</strong>, trong khi ở ngành phần mềm <strong>phần lớn chương trình được viết ra để lưu lại thông tin</strong> mà nó lấy được. Xử lý tệp chính là thứ tình huống đang cần.</p>
<ul>
<li><strong>"Không lưu ở đâu cả" là nghĩa đen</strong> — <code>printf</code> ghi vào <code>stdout</code>, thường được nối tới cửa sổ terminal. Terminal có giữ một vùng cuộn lại cho <em>bạn</em> xem, nhưng không chương trình nào đọc ngược lại được, và nó biến mất khi đóng cửa sổ.</li>
<li><strong>Hai chương trình, một khác biệt</strong> — cặp bên dưới chỉ khác nhau ba dòng, và đó là cả slot này thu nhỏ: một cái in ra, một cái lưu lại.</li>
<li><strong>Vì sao ngành phần mềm quan tâm</strong> — một cây ATM quên số dư mỗi lần mất điện thì không phải sản phẩm. Tính bền không phải tính năng thêm vào lúc cuối; nó là lý do chương trình tồn tại.</li>
<li><strong>Tệp không phải câu trả lời duy nhất, chỉ là câu đầu tiên</strong> — các môn sau thay nó bằng cơ sở dữ liệu (DBI202) và dịch vụ mạng. Nhưng cơ sở dữ liệu, bóc ra bên dưới, chính là tệp cộng chỉ mục — nên slot này là môn tiên quyết thật chứ không phải đường vòng.</li>
<li><strong>Chuyển hướng đầu ra chỉ là nửa câu trả lời</strong> — ở terminal bạn gõ được <code>./prog &gt; out.txt</code> để hứng kết quả mà không sửa mã. Tiện, nhưng chương trình vẫn không <em>đọc lại</em> được thứ nó vừa ghi, không chọn được tệp khác nhau cho dữ liệu khác nhau, và không nối thêm vào kết quả hôm qua được. Vì thế mới có <code>fopen</code>.</li>
</ul>
<pre><code>/* A: mat het khi tat chuong trinh */
#include &lt;stdio.h&gt;
int main(void) {
    int total = 0;
    for (int i = 1; i &lt;= 5; i++) total += i;
    printf("Total = %d\\n", total);
    return 0;
}

/* B: con lai sau khi tat chuong trinh */
#include &lt;stdio.h&gt;
int main(void) {
    int total = 0;
    for (int i = 1; i &lt;= 5; i++) total += i;
    FILE *f = fopen("total.txt", "w");
    if (f == NULL) return 1;
    fprintf(f, "Total = %d\\n", total);
    fclose(f);
    return 0;
}</code></pre>
<p class="dap-an">✅ Đáp án (cả hai đã biên dịch bằng cc -Wall và chạy): A in ra <code>Total = 15</code> rồi không để lại gì. B không in gì, và sau đó tệp <code>total.txt</code> tồn tại, chứa <code>Total = 15</code> — 12 byte trên đĩa, vẫn còn đó khi tiến trình đã tắt. Đúng một khác biệt ấy là toàn bộ ý nghĩa của slot này.</p>
<p class="meo">💡 Để ý xem thay đổi ít tới mức nào: <code>printf(…)</code> thành <code>fprintf(f, …)</code>, cộng một lệnh mở và một lệnh đóng bao quanh. Đó là cố ý — thư viện C được thiết kế sao cho "in ra màn hình" và "in vào tệp" là cùng một hàm, chỉ thêm một tham số.</p>`],

      [8, 'Why do we need File Handling in C?',
        `<p class="y-chinh">🎯 The four named benefits, and they are a favourite multiple-choice question: <strong>Reusability · Portability · Efficient · Storage Capacity</strong>. Learn the four words first, then one sentence each.</p>
<ul>
<li><strong>Reusability</strong> — "data stored in the file can be accessed, updated, and deleted anywhere and anytime". The key word is <em>anytime</em>: the data is no longer tied to one run of one program. A file written by your C program can be read by a different program, next week, written by someone else.</li>
<li><strong>Portability</strong> — "without losing any data, files can be transferred to another [machine] in the computer system. The risk of flawed coding is minimized". Copy the file to a USB stick and the data travels; you do not have to re-enter it, so you do not get the typing mistakes re-entry causes.</li>
<li><strong>Efficient</strong> — "a large amount of input may be required for some programs. File handling allows you to easily access a part of a file using few instructions". Two savings: the human does not re-type 1000 numbers, and the program can jump straight to record 500 with <code>fseek</code> instead of reading the first 499.</li>
<li><strong>Storage Capacity</strong> — "files allow you to store a large amount of data without having to worry about storing everything simultaneously in a program". This is the RAM-limit point: a 4 GB dataset does not fit in a program's memory, but you can stream it a record at a time.</li>
<li><strong>How to tell "Efficient" from "Storage Capacity" in an exam</strong> — they sound alike and that is the trap. <em>Efficient</em> = fewer instructions / less re-typing to get at <em>part</em> of the data. <em>Storage Capacity</em> = you can handle <em>more</em> data than RAM holds.</li>
<li><strong>A benefit the slide omits</strong> — <em>separation of data from code</em>. Change the test data by editing a text file, and you do not recompile. That is why configuration lives in files in every real system.</li>
</ul>
<table>
<tr><th>Benefit</th><th>The problem it fixes</th><th>One-line example</th></tr>
<tr><td>Reusability</td><td>data dies with the process</td><td>enter 100 students today, print the report tomorrow</td></tr>
<tr><td>Portability</td><td>data is stuck on one machine</td><td>copy <code>students.txt</code> to USB and open it at home</td></tr>
<tr><td>Efficient</td><td>huge input re-typed by hand, whole file scanned</td><td><code>fseek</code> to record 500 without reading 1–499</td></tr>
<tr><td>Storage Capacity</td><td>RAM is smaller than the dataset</td><td>process a 4 GB log one line at a time</td></tr>
</table>
<p class="meo">💡 Memory hook: <strong>R-P-E-S</strong> — <em>Reuse, Pass around, Efficiently, Storage</em>. Four words is cheap to memorise and this slide is nearly always worth a mark.</p>`,
        `<p class="y-chinh">🎯 Bốn lợi ích có tên, và đây là câu trắc nghiệm được ưa chuộng: <strong>Reusability (dùng lại) · Portability (mang đi) · Efficient (hiệu quả) · Storage Capacity (sức chứa)</strong>. Thuộc bốn chữ trước, rồi mỗi chữ một câu.</p>
<ul>
<li><strong>Reusability — dùng lại</strong> — "dữ liệu lưu trong tệp có thể được truy cập, cập nhật và xoá ở bất cứ đâu, bất cứ lúc nào". Chữ then chốt là <em>bất cứ lúc nào</em>: dữ liệu không còn bị trói vào một lần chạy của một chương trình. Tệp do chương trình C của bạn ghi ra có thể được một chương trình khác, tuần sau, do người khác viết, đọc lại.</li>
<li><strong>Portability — mang đi</strong> — "không mất dữ liệu nào, tệp có thể chuyển sang máy khác trong hệ thống. Rủi ro sai sót khi lập trình được giảm thiểu". Chép tệp vào USB là dữ liệu đi theo; bạn không phải nhập lại, nên cũng không dính những lỗi gõ nhầm mà việc nhập lại sinh ra.</li>
<li><strong>Efficient — hiệu quả</strong> — "một số chương trình cần lượng dữ liệu vào rất lớn. Xử lý tệp cho phép truy cập dễ dàng một PHẦN của tệp bằng vài câu lệnh". Tiết kiệm hai chỗ: người không phải gõ lại 1000 con số, và chương trình nhảy thẳng tới bản ghi 500 bằng <code>fseek</code> thay vì đọc qua 499 bản ghi đầu.</li>
<li><strong>Storage Capacity — sức chứa</strong> — "tệp cho phép lưu lượng dữ liệu lớn mà không phải lo giữ hết mọi thứ cùng lúc trong chương trình". Đây là chuyện giới hạn RAM: tập dữ liệu 4 GB không nhét vừa bộ nhớ chương trình, nhưng bạn đọc nó theo dòng chảy từng bản ghi một thì được.</li>
<li><strong>Phân biệt "Efficient" với "Storage Capacity" trong phòng thi</strong> — hai chữ nghe giống nhau và đó chính là bẫy. <em>Efficient</em> = ít câu lệnh hơn / không phải gõ lại, để lấy được MỘT PHẦN dữ liệu. <em>Storage Capacity</em> = xử lý được LƯỢNG dữ liệu lớn hơn cả RAM.</li>
<li><strong>Một lợi ích slide bỏ sót</strong> — <em>tách dữ liệu khỏi mã nguồn</em>. Đổi dữ liệu thử bằng cách sửa một tệp văn bản là xong, không phải biên dịch lại. Vì thế mọi hệ thống thật đều để cấu hình trong tệp.</li>
</ul>
<table>
<tr><th>Lợi ích</th><th>Chữa cái gì</th><th>Ví dụ một dòng</th></tr>
<tr><td>Reusability</td><td>dữ liệu chết theo tiến trình</td><td>nhập 100 sinh viên hôm nay, in báo cáo ngày mai</td></tr>
<tr><td>Portability</td><td>dữ liệu kẹt trên một máy</td><td>chép <code>students.txt</code> vào USB rồi mở ở nhà</td></tr>
<tr><td>Efficient</td><td>dữ liệu vào khổng lồ phải gõ tay, quét cả tệp</td><td><code>fseek</code> tới bản ghi 500 mà không đọc 1–499</td></tr>
<tr><td>Storage Capacity</td><td>RAM nhỏ hơn tập dữ liệu</td><td>xử lý tệp log 4 GB theo từng dòng một</td></tr>
</table>
<p class="meo">💡 Cách nhớ: <strong>R-P-E-S</strong> — <em>Re-dùng, Pass đi, Efficient, Storage</em>. Bốn chữ học rất rẻ mà slide này gần như luôn đáng một điểm.</p>`],

      [9, '3. Types of Files in C',
        `<p class="y-chinh">🎯 A section divider introducing the only classification this course needs: <strong>two</strong> types of file, and the thing they are classified by is <strong>the way the file stores the data</strong> — not the extension, not the content, not the program that made it.</p>
<ul>
<li><strong>"Based on the way the file stores the data"</strong> — read that phrase carefully, because the exam builds a trap on it. A <code>.txt</code> file and a <code>.c</code> file and a <code>.html</code> file are all <em>text</em> files; a <code>.jpg</code>, a <code>.exe</code> and your <code>.bin</code> are all <em>binary</em>. The extension is a hint to humans, never a rule.</li>
<li><strong>The deeper truth</strong> — at the OS level there is <em>no</em> difference at all: both are just a run of bytes. The difference is entirely about <em>how your program agrees to interpret them</em>, plus one small thing C does for you (newline translation on Windows, slide 12's notes).</li>
<li><strong>Why C makes you choose</strong> — the mode string of <code>fopen</code> has a <code>b</code> variant precisely for this. <code>"r"</code> and <code>"rb"</code> open the same file; they differ in whether the library is allowed to translate line endings.</li>
<li><strong>What is coming</strong> — slide 10 names the two, slide 11 describes text files, slide 12 describes binary files, slide 13 draws both from the same source data and ends with the trade-off sentence you should memorise.</li>
<li><strong>The exam question you will get</strong> — "give two differences between a text file and a binary file". Have four ready: readability by a text editor, size for numeric data, portability across machines, and whether a human can create it by hand.</li>
</ul>
<p class="meo">💡 One test that settles it in practice: open the file in Notepad / <code>cat</code>. If you can read it, it is a text file. If you see garbage and hear the terminal beep, it is binary — the beep is a <code>0x07</code> byte being interpreted as the BEL character, which is itself a nice proof that "bytes mean whatever the reader decides".</p>`,
        `<p class="y-chinh">🎯 Slide phân mục, giới thiệu cách phân loại duy nhất môn này cần: <strong>hai</strong> loại tệp, và thứ dùng để phân loại là <strong>cách tệp lưu dữ liệu</strong> — không phải phần mở rộng, không phải nội dung, không phải chương trình nào tạo ra nó.</p>
<ul>
<li><strong>"Dựa trên cách tệp lưu dữ liệu"</strong> — đọc kỹ cụm này, vì đề thi dựng bẫy trên nó. Tệp <code>.txt</code>, tệp <code>.c</code> và tệp <code>.html</code> đều là tệp <em>văn bản</em>; tệp <code>.jpg</code>, <code>.exe</code> và cái <code>.bin</code> của bạn đều là tệp <em>nhị phân</em>. Phần mở rộng là gợi ý cho con người, không bao giờ là luật.</li>
<li><strong>Sự thật sâu hơn</strong> — ở mức hệ điều hành thì <em>không</em> có khác biệt nào cả: cả hai chỉ là một dãy byte. Khác biệt nằm hoàn toàn ở chỗ <em>chương trình của bạn thoả thuận diễn giải chúng thế nào</em>, cộng thêm một việc nhỏ C làm giúp bạn (đổi ký tự xuống dòng trên Windows, xem ghi chú slide 12).</li>
<li><strong>Vì sao C bắt bạn chọn</strong> — chuỗi chế độ của <code>fopen</code> có biến thể <code>b</code> đúng vì việc này. <code>"r"</code> và <code>"rb"</code> mở cùng một tệp; chúng khác nhau ở chỗ thư viện có được phép chuyển đổi ký tự xuống dòng hay không.</li>
<li><strong>Sắp tới là gì</strong> — slide 10 gọi tên hai loại, slide 11 tả tệp văn bản, slide 12 tả tệp nhị phân, slide 13 vẽ cả hai từ cùng một dữ liệu nguồn và kết bằng câu đánh đổi mà bạn nên thuộc lòng.</li>
<li><strong>Câu hỏi thi bạn sẽ gặp</strong> — "nêu hai điểm khác nhau giữa tệp văn bản và tệp nhị phân". Hãy thủ sẵn bốn: đọc được bằng trình soạn thảo hay không, kích thước khi lưu số, tính di động giữa các máy, và con người có tự tay tạo ra được không.</li>
</ul>
<p class="meo">💡 Một phép thử giải quyết chuyện này ngoài đời: mở tệp bằng Notepad / <code>cat</code>. Đọc được thì là tệp văn bản. Thấy ký tự loạn xạ và nghe terminal kêu bíp thì là nhị phân — tiếng bíp chính là byte <code>0x07</code> bị diễn giải thành ký tự BEL, và đó lại là một minh chứng đẹp cho câu "byte mang nghĩa gì là do người đọc quyết định".</p>`],

      [10, 'Type of Files in C',
        `<p class="y-chinh">🎯 The classification itself, in one line: a file is either a <strong>Text File</strong> or a <strong>Binary File</strong>, classified "based on the way the file stores the data". Nothing else appears in this course.</p>
<ul>
<li><strong>Text file, in advance</strong> — data stored as <em>ASCII characters</em>. The number 12345 becomes the five characters <code>'1' '2' '3' '4' '5'</code>. Any text editor can open it; a human can create one by hand.</li>
<li><strong>Binary file, in advance</strong> — data stored "in a similar manner to how it is stored in the main memory" (slide 12's words). The number 12345 becomes the four bytes that an <code>int</code> occupies in RAM. Only a program can create or read it usefully.</li>
<li><strong>The conversion is the whole story</strong> — text writing <em>converts</em> (number → characters) and text reading <em>converts back</em> (characters → number). Binary writing copies bytes with no conversion at all. Every difference on slide 13 follows from that one fact.</li>
<li><strong>Which one do your labs use?</strong> — text, almost always: <code>fprintf</code> / <code>fscanf</code> / <code>fgets</code>. Binary appears when you save whole structs at once with <code>fwrite</code> (slide 26's last row), which the Case Study in slides 31–42 uses.</li>
<li><strong>Measured side by side</strong> — I wrote the value 12345 both ways to two files and looked at every byte. See the table and the proof below; that measurement is the answer to the exam question "which is smaller and why".</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
int main(void) {
    FILE *ft = fopen("num_text.txt", "w");
    fprintf(ft, "%d", 12345);        /* chuyen so -&gt; ky tu */
    fclose(ft);

    FILE *fb = fopen("num_bin.bin", "wb");
    int n = 12345;
    fwrite(&amp;n, sizeof(int), 1, fb);  /* chep nguyen 4 byte cua RAM */
    fclose(fb);
    return 0;
}</code></pre>
<p class="dap-an">✅ Answer (compiled with cc -Wall, then <code>ls -l</code> and <code>xxd</code>): <code>num_text.txt</code> is <strong>5 bytes</strong> — <code>31 32 33 34 35</code>, i.e. the characters <code>'1' '2' '3' '4' '5'</code>. <code>num_bin.bin</code> is <strong>4 bytes</strong> — <code>39 30 00 00</code>, i.e. 12345 = 0x3039 written low byte first. Same value, different storage, different size, and only the first one is readable in a text editor.</p>
<p class="meo">💡 Watch what happens to the size as the number grows: in text, 7 becomes 1 byte but 1234567890 becomes 10 bytes; in binary an <code>int</code> is always exactly 4. So text is smaller for tiny numbers and much bigger for real data — which is exactly slide 13's "binary is more efficient".</p>`,
        `<p class="y-chinh">🎯 Chính phần phân loại, gói trong một dòng: tệp hoặc là <strong>Text File</strong> (tệp văn bản), hoặc là <strong>Binary File</strong> (tệp nhị phân), phân loại "dựa trên cách tệp lưu dữ liệu". Môn này không có loại nào khác.</p>
<ul>
<li><strong>Tệp văn bản, nói trước</strong> — dữ liệu lưu dưới dạng <em>ký tự ASCII</em>. Số 12345 thành năm ký tự <code>'1' '2' '3' '4' '5'</code>. Trình soạn thảo nào cũng mở được; con người gõ tay tạo ra được.</li>
<li><strong>Tệp nhị phân, nói trước</strong> — dữ liệu lưu "theo cách giống như nó nằm trong bộ nhớ chính" (nguyên văn slide 12). Số 12345 thành đúng bốn byte mà một <code>int</code> chiếm trong RAM. Chỉ chương trình mới tạo hay đọc nó cho ra hồn được.</li>
<li><strong>Phép chuyển đổi chính là toàn bộ câu chuyện</strong> — ghi kiểu văn bản thì <em>chuyển đổi</em> (số → ký tự), đọc kiểu văn bản thì <em>chuyển ngược</em> (ký tự → số). Ghi kiểu nhị phân chép byte, không chuyển đổi gì cả. Mọi khác biệt ở slide 13 đều suy ra từ đúng sự thật đó.</li>
<li><strong>Bài lab của bạn dùng loại nào?</strong> — văn bản, gần như luôn luôn: <code>fprintf</code> / <code>fscanf</code> / <code>fgets</code>. Nhị phân xuất hiện khi bạn lưu nguyên cả struct một phát bằng <code>fwrite</code> (dòng cuối bảng slide 26), đúng thứ Case Study ở slide 31–42 dùng.</li>
<li><strong>Đo thật, đặt cạnh nhau</strong> — tôi ghi giá trị 12345 theo cả hai cách ra hai tệp rồi soi từng byte. Xem bảng và bằng chứng bên dưới; số đo ấy chính là đáp án cho câu hỏi thi "cái nào nhỏ hơn và vì sao".</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
int main(void) {
    FILE *ft = fopen("num_text.txt", "w");
    fprintf(ft, "%d", 12345);        /* chuyen so -&gt; ky tu */
    fclose(ft);

    FILE *fb = fopen("num_bin.bin", "wb");
    int n = 12345;
    fwrite(&amp;n, sizeof(int), 1, fb);  /* chep nguyen 4 byte cua RAM */
    fclose(fb);
    return 0;
}</code></pre>
<p class="dap-an">✅ Đáp án (biên dịch cc -Wall, rồi <code>ls -l</code> và <code>xxd</code>): <code>num_text.txt</code> nặng <strong>5 byte</strong> — <code>31 32 33 34 35</code>, tức các ký tự <code>'1' '2' '3' '4' '5'</code>. <code>num_bin.bin</code> nặng <strong>4 byte</strong> — <code>39 30 00 00</code>, tức 12345 = 0x3039 ghi byte thấp trước. Cùng một giá trị, khác cách lưu, khác kích thước, và chỉ cái đầu mở bằng trình soạn thảo mới đọc được.</p>
<p class="meo">💡 Để ý kích thước biến thiên ra sao khi số lớn dần: kiểu văn bản, số 7 chiếm 1 byte nhưng 1234567890 chiếm 10 byte; kiểu nhị phân thì một <code>int</code> luôn đúng 4 byte. Vậy văn bản nhỏ hơn với số tí hon và lớn hơn nhiều với dữ liệu thật — đúng câu "nhị phân hiệu quả hơn" ở slide 13.</p>`],

      [11, 'Text Files',
        `<p class="y-chinh">🎯 Five facts about text files: data is stored as <strong>ASCII characters</strong>, it is a <strong>stream of characters</strong>, <strong>each line ends with <code>'\\n'</code></strong>, it can be <strong>read or written by any text editor</strong>, it usually carries the <strong><code>.txt</code></strong> extension — and <strong>source code is a text file too</strong>.</p>
<ul>
<li><strong>"A stream of characters"</strong> — a text file has no records, no fields, no structure that the file itself knows about. It is one long sequence of characters and <em>you</em> impose structure on it, usually with spaces and newlines, which is exactly what <code>fscanf</code>'s format string is for.</li>
<li><strong>"Each line ends with <code>'\\n'</code>"</strong> — one byte, value 10 (<code>0x0A</code>). It is a real character stored in the file, not an invisible property. That means the last line of a file may or may not have one; a text editor shows no difference, but <code>fgets</code> does.</li>
<li><strong>"Can be read or written by any text editor"</strong> — this is the practical definition, and the one to use in an exam answer. It is also why text files are the right choice for configuration, CSV data, log files and anything a human may need to fix by hand.</li>
<li><strong>"Text files can also be used to store the source code"</strong> — your <code>.c</code> file is a text file. So is a <code>.html</code>, a <code>.json</code>, a <code>.csv</code>. It is worth saying out loud, because it kills the idea that "text file" means "<code>.txt</code>".</li>
<li><strong>What C does extra in text mode</strong> — on Windows the library translates <code>'\\n'</code> into the two bytes <code>\\r\\n</code> when writing and back when reading. On Linux/macOS it does nothing. I measured it below: on this Mac, <code>"w"</code> and <code>"wb"</code> produce byte-identical files.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
int main(void) {
    FILE *a = fopen("nl_text.txt", "w");   /* che do van ban */
    fprintf(a, "A\\nB\\n");
    fclose(a);
    FILE *b = fopen("nl_bin.bin", "wb");   /* che do nhi phan */
    fprintf(b, "A\\nB\\n");
    fclose(b);
    return 0;
}</code></pre>
<p class="dap-an">✅ Answer (measured on macOS): both files are <strong>4 bytes</strong> — <code>"w"</code> and <code>"wb"</code> behave identically here. On Windows the same program gives <strong>6 bytes</strong> for the text-mode file (each <code>\\n</code> becomes <code>\\r\\n</code>) and 4 for the binary one. Same source, different file size, different platform — and this is exactly why <code>"rb"</code>/<code>"wb"</code> exist at all.</p>
<p class="pitfall">⚠️ That newline translation is why you must <strong>never</strong> read a binary file in text mode on Windows: a byte <code>0x0D</code> that belonged to your data gets silently eaten, and the struct you read back is corrupted with no error reported anywhere.</p>`,
        `<p class="y-chinh">🎯 Năm sự thật về tệp văn bản: dữ liệu lưu dưới dạng <strong>ký tự ASCII</strong>, nó là một <strong>dòng chảy ký tự</strong>, <strong>mỗi dòng kết thúc bằng <code>'\\n'</code></strong>, <strong>trình soạn thảo nào cũng đọc/ghi được</strong>, thường mang đuôi <strong><code>.txt</code></strong> — và <strong>mã nguồn cũng là tệp văn bản</strong>.</p>
<ul>
<li><strong>"Một dòng chảy ký tự"</strong> — tệp văn bản không có bản ghi, không có trường, không có cấu trúc nào mà bản thân tệp biết được. Nó là một dãy ký tự rất dài và <em>bạn</em> mới là người áp cấu trúc lên nó, thường bằng dấu cách và ký tự xuống dòng — đúng công dụng của chuỗi định dạng trong <code>fscanf</code>.</li>
<li><strong>"Mỗi dòng kết thúc bằng <code>'\\n'</code>"</strong> — một byte, giá trị 10 (<code>0x0A</code>). Nó là ký tự có thật nằm trong tệp chứ không phải thuộc tính vô hình. Nghĩa là dòng cuối cùng của tệp có thể có hoặc không có nó; trình soạn thảo không cho thấy khác biệt, nhưng <code>fgets</code> thì có.</li>
<li><strong>"Đọc/ghi được bằng mọi trình soạn thảo"</strong> — đây là định nghĩa thực dụng, và là câu nên dùng khi làm bài thi. Nó cũng là lý do tệp văn bản là lựa chọn đúng cho tệp cấu hình, dữ liệu CSV, tệp log và mọi thứ mà người ta có thể phải sửa tay.</li>
<li><strong>"Tệp văn bản còn dùng để lưu mã nguồn"</strong> — tệp <code>.c</code> của bạn là tệp văn bản. <code>.html</code>, <code>.json</code>, <code>.csv</code> cũng vậy. Đáng nói to lên, vì nó giết chết ý nghĩ "tệp văn bản nghĩa là <code>.txt</code>".</li>
<li><strong>C làm thêm gì ở chế độ văn bản</strong> — trên Windows, thư viện đổi <code>'\\n'</code> thành hai byte <code>\\r\\n</code> khi ghi và đổi ngược lại khi đọc. Trên Linux/macOS nó không làm gì. Tôi đã đo bên dưới: trên chiếc Mac này, <code>"w"</code> và <code>"wb"</code> cho hai tệp giống nhau từng byte.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
int main(void) {
    FILE *a = fopen("nl_text.txt", "w");   /* che do van ban */
    fprintf(a, "A\\nB\\n");
    fclose(a);
    FILE *b = fopen("nl_bin.bin", "wb");   /* che do nhi phan */
    fprintf(b, "A\\nB\\n");
    fclose(b);
    return 0;
}</code></pre>
<p class="dap-an">✅ Đáp án (đo trên macOS): cả hai tệp đều <strong>4 byte</strong> — ở đây <code>"w"</code> và <code>"wb"</code> hành xử y hệt nhau. Trên Windows, đúng chương trình này cho tệp chế độ văn bản <strong>6 byte</strong> (mỗi <code>\\n</code> thành <code>\\r\\n</code>) và tệp nhị phân 4 byte. Cùng mã nguồn, khác kích thước tệp, khác nền tảng — và đó chính là lý do tồn tại của <code>"rb"</code>/<code>"wb"</code>.</p>
<p class="pitfall">⚠️ Chính phép đổi ký tự xuống dòng ấy là lý do <strong>tuyệt đối không</strong> được đọc tệp nhị phân ở chế độ văn bản trên Windows: một byte <code>0x0D</code> vốn là dữ liệu của bạn sẽ bị nuốt âm thầm, và cái struct đọc về bị hỏng mà chẳng có lỗi nào báo ở đâu cả.</p>`],

      [12, 'Binary Files',
        `<p class="y-chinh">🎯 Four facts about binary files: they contain data <strong>in binary form (0s and 1s) instead of ASCII characters</strong>, stored <strong>the same way it is stored in main memory</strong>; they <strong>can only be created from within a program</strong> and read by a program; they are <strong>more secure as they are not easily readable</strong>; and they usually carry the <strong><code>.bin</code></strong> extension.</p>
<ul>
<li><strong>"Stored in a similar manner to how it is stored in the main memory"</strong> — this is the sentence that matters. <code>fwrite(&amp;n, sizeof(int), 1, f)</code> takes the 4 bytes at the address of <code>n</code> and copies them to disk unchanged. No conversion means no conversion cost and no rounding: a <code>double</code> written this way comes back bit for bit.</li>
<li><strong>"Can be created only from within a program"</strong> — you cannot type an <code>int</code> into Notepad. The characters "12345" typed by hand are a <em>text</em> representation; the 4-byte pattern <code>39 30 00 00</code> has no keyboard.</li>
<li><strong>"More secure as they are not easily readable"</strong> — ⚠️ read this one critically. It is <em>obscurity</em>, not security: <code>xxd file.bin</code> takes one second and shows everything, and any string inside is plainly visible with <code>strings</code>. Write it in the exam because it is on the slide, but do not believe it in real life — real security is encryption, not a <code>.bin</code> extension.</li>
<li><strong>Where binary genuinely wins</strong> — size and speed for numeric data, and the ability to save a whole <code>struct</code> in one call with no field-by-field formatting. A 1000-account array is one <code>fwrite</code>, and reading it back is one <code>fread</code>.</li>
<li><strong>Where binary genuinely loses</strong> — portability. The bytes depend on the machine's <code>int</code> size, its byte order, and the struct's padding. The same <code>.bin</code> written on one machine may be misread on another; a text file never has this problem. That is slide 13's "text is more portable".</li>
</ul>
<table>
<tr><th>Question</th><th>Text file</th><th>Binary file</th></tr>
<tr><td>How is 12345 stored?</td><td>5 characters <code>31 32 33 34 35</code></td><td>4 bytes <code>39 30 00 00</code></td></tr>
<tr><td>Size on disk (measured)</td><td>5 bytes</td><td>4 bytes</td></tr>
<tr><td>Open in Notepad / <code>cat</code></td><td>readable</td><td>garbage</td></tr>
<tr><td>Created by hand?</td><td>yes</td><td>no — only by a program</td></tr>
<tr><td>Functions used</td><td><code>fprintf</code> / <code>fscanf</code> / <code>fgets</code> / <code>fputs</code></td><td><code>fwrite</code> / <code>fread</code></td></tr>
<tr><td>fopen mode</td><td><code>"r" "w" "a"</code>…</td><td><code>"rb" "wb" "ab"</code>…</td></tr>
<tr><td>Newline translated on Windows?</td><td>yes (<code>\\n</code> ⇄ <code>\\r\\n</code>)</td><td>no — bytes untouched</td></tr>
<tr><td>Same file on another machine?</td><td>portable</td><td>depends on int size / byte order / padding</td></tr>
<tr><td>Cost per value</td><td>conversion number ⇄ characters</td><td>none — raw copy</td></tr>
</table>
<p class="dap-an">✅ Measured proof of the "no conversion" claim: writing <code>int n = 12345</code> with <code>fwrite</code> produced exactly <code>39 30 00 00</code> — and 12345 in hexadecimal is <code>0x3039</code>. The bytes on disk are literally the bytes that were in RAM, low byte first, padded to <code>sizeof(int) = 4</code>.</p>
<p class="pitfall">⚠️ "More secure" is the one claim on this slide you should push back on. A binary file is <em>inconvenient</em> to read, not protected. Anyone with <code>xxd</code>, <code>od -c</code> or a hex editor reads it in seconds, and passwords stored in a <code>.bin</code> have been leaked exactly this way many times.</p>`,
        `<p class="y-chinh">🎯 Bốn sự thật về tệp nhị phân: chứa dữ liệu <strong>ở dạng nhị phân (0 và 1) thay vì ký tự ASCII</strong>, lưu <strong>theo cách giống như nó nằm trong bộ nhớ chính</strong>; <strong>chỉ tạo ra được từ bên trong một chương trình</strong> và cũng chỉ chương trình đọc được; <strong>an toàn hơn vì không dễ đọc</strong>; và thường mang đuôi <strong><code>.bin</code></strong>.</p>
<ul>
<li><strong>"Lưu theo cách giống như trong bộ nhớ chính"</strong> — đây là câu quan trọng. <code>fwrite(&amp;n, sizeof(int), 1, f)</code> lấy 4 byte tại địa chỉ của <code>n</code> rồi chép nguyên xuống đĩa. Không chuyển đổi nghĩa là không tốn chi phí chuyển đổi và không có làm tròn: một <code>double</code> ghi kiểu này quay về đúng từng bit.</li>
<li><strong>"Chỉ tạo được từ trong chương trình"</strong> — bạn không gõ được một <code>int</code> vào Notepad. Các ký tự "12345" gõ tay là một cách biểu diễn <em>văn bản</em>; mẫu 4 byte <code>39 30 00 00</code> thì không có phím nào để gõ.</li>
<li><strong>"An toàn hơn vì không dễ đọc"</strong> — ⚠️ hãy đọc câu này với con mắt phê phán. Đó là <em>sự khó nhìn</em> chứ không phải bảo mật: <code>xxd file.bin</code> mất một giây và hiện ra hết, còn chuỗi nằm bên trong thì lệnh <code>strings</code> lôi ra rõ mồn một. Cứ viết vào bài thi vì slide ghi thế, nhưng ngoài đời đừng tin — bảo mật thật là mã hoá, không phải cái đuôi <code>.bin</code>.</li>
<li><strong>Nhị phân thắng thật ở đâu</strong> — kích thước và tốc độ với dữ liệu số, cộng khả năng lưu nguyên một <code>struct</code> bằng một lời gọi mà không phải định dạng từng trường. Mảng 1000 tài khoản là một lệnh <code>fwrite</code>, đọc về là một lệnh <code>fread</code>.</li>
<li><strong>Nhị phân thua thật ở đâu</strong> — tính di động. Các byte phụ thuộc vào kích thước <code>int</code> của máy, thứ tự byte, và phần đệm của struct. Cùng một tệp <code>.bin</code> ghi ở máy này có thể đọc sai ở máy khác; tệp văn bản không bao giờ dính chuyện đó. Đúng câu "text di động hơn" ở slide 13.</li>
</ul>
<table>
<tr><th>Câu hỏi</th><th>Tệp văn bản</th><th>Tệp nhị phân</th></tr>
<tr><td>Số 12345 lưu thế nào?</td><td>5 ký tự <code>31 32 33 34 35</code></td><td>4 byte <code>39 30 00 00</code></td></tr>
<tr><td>Kích thước trên đĩa (đo thật)</td><td>5 byte</td><td>4 byte</td></tr>
<tr><td>Mở bằng Notepad / <code>cat</code></td><td>đọc được</td><td>ký tự loạn xạ</td></tr>
<tr><td>Gõ tay tạo ra được?</td><td>được</td><td>không — chỉ chương trình tạo</td></tr>
<tr><td>Hàm dùng</td><td><code>fprintf</code> / <code>fscanf</code> / <code>fgets</code> / <code>fputs</code></td><td><code>fwrite</code> / <code>fread</code></td></tr>
<tr><td>Chế độ fopen</td><td><code>"r" "w" "a"</code>…</td><td><code>"rb" "wb" "ab"</code>…</td></tr>
<tr><td>Windows có đổi ký tự xuống dòng?</td><td>có (<code>\\n</code> ⇄ <code>\\r\\n</code>)</td><td>không — byte giữ nguyên</td></tr>
<tr><td>Đem tệp sang máy khác?</td><td>di động</td><td>tuỳ kích thước int / thứ tự byte / padding</td></tr>
<tr><td>Chi phí mỗi giá trị</td><td>chuyển đổi số ⇄ ký tự</td><td>không — chép thô</td></tr>
</table>
<p class="dap-an">✅ Bằng chứng đo thật cho câu "không chuyển đổi": ghi <code>int n = 12345</code> bằng <code>fwrite</code> cho ra đúng <code>39 30 00 00</code> — mà 12345 trong hệ mười sáu là <code>0x3039</code>. Các byte trên đĩa đúng là các byte đang nằm trong RAM, byte thấp trước, đủ <code>sizeof(int) = 4</code>.</p>
<p class="pitfall">⚠️ "An toàn hơn" là điều duy nhất trên slide này bạn nên phản biện. Tệp nhị phân <em>bất tiện</em> khi đọc chứ không được bảo vệ. Ai có <code>xxd</code>, <code>od -c</code> hay một trình soạn thảo hệ mười sáu cũng đọc trong vài giây, và mật khẩu cất trong <code>.bin</code> đã bị lộ đúng kiểu ấy nhiều lần rồi.</p>`],

      [13, 'Type of Files in C (cont.)',
        `<p class="y-chinh">🎯 One diagram that settles the whole comparison. The same <strong>Data</strong> goes down two roads: characters "ABC" and the number <strong>260 (2 bytes)</strong>. On the text road everything becomes ASCII codes; on the binary road the number's bytes are copied straight out. The blue box gives the trade-off: <strong>text is more portable, binary is more efficient.</strong></p>
<ul>
<li><strong>Follow "ABC" first</strong> — in memory it is <code>01000001 01000010 01000011 00000000</code> — 'A', 'B', 'C' and the terminating NUL. On the way to the text file, the three letters go straight through (they were already characters) and the NUL is dropped. Nothing was converted; a character <em>is</em> its ASCII code.</li>
<li><strong>Now follow 260</strong> — in memory it is two bytes, drawn as <code>00000001 00000100</code>. On the <em>binary</em> road those two bytes are copied out unchanged. On the <em>text</em> road there is a red "convert" bubble: 260 must be turned into the three digit characters <code>'2' '6' '0'</code> = <code>00110010 00110110 00110000</code>. That bubble is the cost of text.</li>
<li><strong>Count the bytes and the trade-off is obvious</strong> — 260 costs 2 bytes as binary and 3 bytes as text, and a larger number like 1234567890 costs 4 bytes as binary and 10 as text. That is "binary is more efficient".</li>
<li><strong>Why text is more portable</strong> — the character <code>'2'</code> is 50 on every machine ever built. The two bytes of a binary 260 depend on how wide the machine's integers are and in which order it stores them, so a binary file can be misread on a different computer.</li>
<li><strong>⚠️ The slide's byte order does not match a real PC</strong> — the diagram writes 260 as <code>00000001 00000100</code>, i.e. high byte first (big-endian, 0x01 0x04). I measured the real thing.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
int main(void) {
    short s = 260;                      /* 260 = 0x0104 */
    FILE *f = fopen("num260.bin", "wb");
    fwrite(&amp;s, sizeof(short), 1, f);
    fclose(f);
    return 0;                            /* roi: xxd num260.bin */
}</code></pre>
<p class="dap-an">✅ Answer (measured, cc -Wall + <code>xxd</code>): the file is 2 bytes and contains <code>04 01</code> — that is <code>00000100 00000001</code>, the <strong>reverse</strong> of what the slide draws. Both are "correct" descriptions of 260; the slide shows big-endian order (as used in network protocols and on older machines), while every x86 PC and Apple Silicon Mac is little-endian and stores the low byte first. The slide is not wrong about the <em>concept</em> — 260 does occupy 2 bytes and does get copied without conversion — but do not memorise the byte order from this picture, and do not expect the exam's picture to match what your own <code>xxd</code> shows. This is precisely why the same slide says text is more portable.</p>
<p class="meo">💡 The blue box is the single most quotable line in this section: <em>"Text format is more portable than binary format, but binary format is more efficient than text format."</em> Every exam question about choosing a format is answered by picking one half of that sentence and saying which one matters more for the given scenario.</p>`,
        `<p class="y-chinh">🎯 Một sơ đồ chốt hạ cả phần so sánh. Cùng một <strong>Data</strong> đi theo hai con đường: chuỗi ký tự "ABC" và con số <strong>260 (2 byte)</strong>. Đường văn bản thì mọi thứ thành mã ASCII; đường nhị phân thì các byte của con số được chép thẳng ra. Ô màu xanh nêu chỗ đánh đổi: <strong>văn bản di động hơn, nhị phân hiệu quả hơn.</strong></p>
<ul>
<li><strong>Đi theo "ABC" trước</strong> — trong bộ nhớ nó là <code>01000001 01000010 01000011 00000000</code> — 'A', 'B', 'C' và byte NUL kết chuỗi. Trên đường sang tệp văn bản, ba chữ cái đi thẳng (chúng vốn đã là ký tự) còn NUL bị bỏ. Không có gì được chuyển đổi cả; một ký tự <em>chính là</em> mã ASCII của nó.</li>
<li><strong>Giờ đi theo số 260</strong> — trong bộ nhớ nó là hai byte, vẽ là <code>00000001 00000100</code>. Trên đường <em>nhị phân</em>, hai byte ấy được chép ra nguyên xi. Trên đường <em>văn bản</em> có một bong bóng đỏ "convert": 260 phải biến thành ba ký tự chữ số <code>'2' '6' '0'</code> = <code>00110010 00110110 00110000</code>. Bong bóng đó chính là cái giá của kiểu văn bản.</li>
<li><strong>Đếm byte là thấy ngay chỗ đánh đổi</strong> — 260 tốn 2 byte kiểu nhị phân và 3 byte kiểu văn bản; số lớn hơn như 1234567890 tốn 4 byte nhị phân và 10 byte văn bản. Đó là "nhị phân hiệu quả hơn".</li>
<li><strong>Vì sao văn bản di động hơn</strong> — ký tự <code>'2'</code> là 50 trên mọi cỗ máy từng được chế tạo. Còn hai byte của số 260 kiểu nhị phân phụ thuộc vào máy dùng số nguyên rộng bao nhiêu và xếp byte theo thứ tự nào, nên tệp nhị phân có thể bị đọc sai ở máy khác.</li>
<li><strong>⚠️ Thứ tự byte trên slide KHÔNG khớp máy PC thật</strong> — sơ đồ viết 260 là <code>00000001 00000100</code>, tức byte cao trước (big-endian, 0x01 0x04). Tôi đã đo thứ thật.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
int main(void) {
    short s = 260;                      /* 260 = 0x0104 */
    FILE *f = fopen("num260.bin", "wb");
    fwrite(&amp;s, sizeof(short), 1, f);
    fclose(f);
    return 0;                            /* roi: xxd num260.bin */
}</code></pre>
<p class="dap-an">✅ Đáp án (đo thật, cc -Wall + <code>xxd</code>): tệp nặng 2 byte và chứa <code>04 01</code> — tức <code>00000100 00000001</code>, <strong>ngược</strong> với hình slide vẽ. Cả hai đều là cách mô tả "đúng" của 260; slide vẽ theo thứ tự big-endian (thứ tự dùng trong giao thức mạng và trên các máy đời cũ), còn mọi PC x86 lẫn Mac Apple Silicon đều là little-endian, lưu byte thấp trước. Slide KHÔNG sai về <em>khái niệm</em> — 260 đúng là chiếm 2 byte và đúng là được chép mà không chuyển đổi — nhưng đừng học thuộc thứ tự byte từ bức hình này, và đừng trông chờ hình trong đề thi khớp với thứ <code>xxd</code> của bạn hiện ra. Chính chỗ này là lý do cũng trên slide ấy người ta nói văn bản di động hơn.</p>
<p class="meo">💡 Ô xanh là câu đáng trích dẫn nhất cả phần: <em>"Định dạng văn bản di động hơn định dạng nhị phân, nhưng định dạng nhị phân hiệu quả hơn định dạng văn bản."</em> Mọi câu hỏi thi về chọn định dạng đều được trả lời bằng cách chọn một nửa câu đó rồi nói rõ vì sao nửa ấy quan trọng hơn trong tình huống đề cho.</p>`],

      [14, '4. C File Operations',
        `<p class="y-chinh">🎯 A section divider opening the largest part of the deck — everything from here to slide 42 is <em>doing</em> rather than <em>defining</em>. Slides 1–21 cover the first two operations; the rest follow in the second half.</p>
<ul>
<li><strong>Why operations come last</strong> — you now know what a file is (slides 4–5), why you want one (6–8) and which format to store it in (9–13). Only with those settled does <code>fopen("data.txt", "wb")</code> read as a sentence rather than as magic.</li>
<li><strong>The shape of every file program in this course</strong> — <em>open → check for NULL → loop reading or writing → close</em>. Four steps, always in that order, and three of the four are one line each. If your exam answer has that skeleton, the marker can follow it.</li>
<li><strong>The handle is the thread through all of them</strong> — <code>fopen</code> produces a <code>FILE *</code>, every other function takes it as an argument, and <code>fclose</code> destroys it. That is why slide 16 puts "Connection to File" before "Open a File": you need somewhere to put the result.</li>
<li><strong>Which functions map to which operation</strong> — create and open are both <code>fopen</code> (slide 22 explains why); reading is <code>fscanf</code>/<code>fgets</code>/<code>fgetc</code>/<code>fread</code> (slide 24); writing is <code>fprintf</code>/<code>fputs</code>/<code>fputc</code>/<code>fwrite</code> (slide 26); moving is <code>fseek</code>/<code>rewind</code>/<code>ftell</code>; closing is <code>fclose</code>.</li>
<li><strong>What to practise</strong> — write the four-step skeleton from memory ten times. In the PE, the skeleton is free marks and the interesting logic goes in the middle of it.</li>
</ul>
<p class="meo">💡 The operations are also the answer to the third objective on slide 2 ("How to access data in files?"). If an exam asks that as a short-answer question, list the six operations from slide 15 — that is exactly the expected answer.</p>`,
        `<p class="y-chinh">🎯 Slide phân mục, mở ra phần lớn nhất của deck — từ đây tới slide 42 là <em>làm</em> chứ không còn <em>định nghĩa</em>. Slide 1–21 lo hai thao tác đầu; phần còn lại nằm ở nửa sau.</p>
<ul>
<li><strong>Vì sao thao tác để cuối</strong> — giờ bạn đã biết tệp là gì (slide 4–5), vì sao cần nó (6–8) và lưu theo định dạng nào (9–13). Chỉ khi ba chuyện ấy xong thì <code>fopen("data.txt", "wb")</code> mới đọc ra thành một câu có nghĩa chứ không phải phép thuật.</li>
<li><strong>Hình dạng của MỌI chương trình dùng tệp trong môn này</strong> — <em>mở → kiểm NULL → lặp đọc hoặc ghi → đóng</em>. Bốn bước, luôn theo thứ tự đó, và ba trong bốn bước chỉ một dòng. Bài thi của bạn có đúng bộ xương ấy thì người chấm theo dõi được.</li>
<li><strong>Cái tay nắm là sợi chỉ xuyên suốt</strong> — <code>fopen</code> đẻ ra một <code>FILE *</code>, mọi hàm khác nhận nó làm tham số, và <code>fclose</code> huỷ nó. Vì thế slide 16 đặt "Connection to File" trước "Open a File": phải có chỗ để hứng kết quả đã.</li>
<li><strong>Hàm nào ứng với thao tác nào</strong> — tạo và mở đều là <code>fopen</code> (slide 22 giải thích vì sao); đọc là <code>fscanf</code>/<code>fgets</code>/<code>fgetc</code>/<code>fread</code> (slide 24); ghi là <code>fprintf</code>/<code>fputs</code>/<code>fputc</code>/<code>fwrite</code> (slide 26); di chuyển là <code>fseek</code>/<code>rewind</code>/<code>ftell</code>; đóng là <code>fclose</code>.</li>
<li><strong>Nên luyện gì</strong> — viết bộ xương bốn bước từ trí nhớ mười lần. Trong bài PE, bộ xương là điểm cho không, còn phần logic thú vị nằm ở giữa nó.</li>
</ul>
<p class="meo">💡 Các thao tác cũng chính là đáp án cho mục tiêu thứ ba ở slide 2 ("Truy cập dữ liệu trong tệp ra sao?"). Nếu đề hỏi câu ấy dạng tự luận ngắn, hãy liệt kê sáu thao tác của slide 15 — đó đúng là đáp án người ta chờ.</p>`],

      [15, 'Operations on Files',
        `<p class="y-chinh">🎯 Six operations, and they are the table of contents for slides 16–42: <strong>creating a new file · opening an existing file · reading from a file · writing to a file · moving to a specific location · closing a file</strong>.</p>
<ul>
<li><strong>Creating and opening are the same function</strong> — this surprises people, and slide 22 says it explicitly: <code>fopen</code> creates the file if the mode allows it (<code>w</code>, <code>w+</code>, <code>a</code>, <code>a+</code> and their <code>b</code> variants). There is no <code>fcreate</code> in C.</li>
<li><strong>Reading and writing are four functions each</strong> — because C gives you a choice of granularity: one character (<code>fgetc</code>), one line (<code>fgets</code>), one formatted field (<code>fscanf</code>), or one block of raw bytes (<code>fread</code>). Slides 24 and 26 are the two tables.</li>
<li><strong>"Moving to a specific location"</strong> — <code>fseek(f, offset, whence)</code>, <code>rewind(f)</code>, <code>ftell(f)</code>. This is the operation that makes a file different from the terminal: <code>stdin</code> cannot be rewound, a file can. It is also the operation that makes binary files with fixed-size records so convenient — record <em>i</em> starts at byte <code>i * sizeof(record)</code>.</li>
<li><strong>Closing is not optional</strong> — and it is the operation students forget most. The data you "wrote" is still in a buffer in RAM until <code>fclose</code> (or <code>fflush</code>) pushes it out. I measured exactly how much you lose below.</li>
<li><strong>Why there is a limit on open files</strong> — every open file costs the OS a table entry. On this machine <code>FOPEN_MAX</code> is 20, which is the minimum the library guarantees; leak handles in a loop and <code>fopen</code> eventually returns <code>NULL</code> for a file that exists perfectly well.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
int main(void) {
    FILE *f = fopen("buffer_demo.txt", "w");
    fprintf(f, "1000 ky tu quan trong cua toi\\n");   /* 30 byte */
    /* CHUA fclose: kiem tra kich thuoc tren dia ngay luc nay */
    _Exit(0);   /* thoat khong don dep -&gt; bo dem khong duoc xa */
}</code></pre>
<p class="dap-an">✅ Answer (measured, cc -Wall): with <code>_Exit(0)</code> and no <code>fclose</code>, the file exists but is <strong>0 bytes</strong> — all 30 bytes were lost inside the buffer. The same program with <code>fclose(f)</code> before exiting gives <strong>30 bytes</strong>. Even <em>while the program is still running</em>, immediately after <code>fprintf</code> and before <code>fclose</code>, the file on disk measures 0 bytes: the write had not reached the disk yet. That is the whole reason <code>fclose</code> is on this list of six.</p>
<p class="pitfall">⚠️ A normal <code>return 0;</code> from <code>main</code> <em>does</em> flush and close everything, which is why forgetting <code>fclose</code> often seems harmless in a lab. It stops being harmless the moment the program crashes, calls <code>exit</code> from a deep error path, or opens files in a loop — which is exactly what real programs do.</p>`,
        `<p class="y-chinh">🎯 Sáu thao tác, và chúng là mục lục cho slide 16–42: <strong>tạo tệp mới · mở tệp đã có · đọc từ tệp · ghi vào tệp · di chuyển tới một vị trí cụ thể · đóng tệp</strong>.</p>
<ul>
<li><strong>Tạo và mở là cùng một hàm</strong> — chuyện này làm nhiều người bất ngờ, và slide 22 nói thẳng ra: <code>fopen</code> tạo tệp nếu chế độ cho phép (<code>w</code>, <code>w+</code>, <code>a</code>, <code>a+</code> và các biến thể <code>b</code>). Trong C không có hàm nào tên <code>fcreate</code> cả.</li>
<li><strong>Đọc và ghi mỗi bên bốn hàm</strong> — vì C cho bạn chọn độ mịn: một ký tự (<code>fgetc</code>), một dòng (<code>fgets</code>), một trường có định dạng (<code>fscanf</code>), hay một khối byte thô (<code>fread</code>). Slide 24 và 26 chính là hai cái bảng ấy.</li>
<li><strong>"Di chuyển tới một vị trí cụ thể"</strong> — <code>fseek(f, offset, whence)</code>, <code>rewind(f)</code>, <code>ftell(f)</code>. Đây là thao tác làm tệp khác với terminal: <code>stdin</code> không tua lại được, tệp thì được. Nó cũng là thao tác khiến tệp nhị phân với bản ghi cố định trở nên tiện đến thế — bản ghi thứ <em>i</em> bắt đầu tại byte <code>i * sizeof(bản ghi)</code>.</li>
<li><strong>Đóng tệp không phải tuỳ chọn</strong> — và đây là thao tác sinh viên quên nhiều nhất. Dữ liệu bạn "đã ghi" vẫn còn nằm trong bộ đệm ở RAM cho tới khi <code>fclose</code> (hoặc <code>fflush</code>) đẩy nó ra. Tôi đã đo chính xác mất bao nhiêu, ngay bên dưới.</li>
<li><strong>Vì sao có giới hạn số tệp mở</strong> — mỗi tệp đang mở tốn của hệ điều hành một ô trong bảng. Trên máy này <code>FOPEN_MAX</code> là 20, đó là mức tối thiểu thư viện bảo đảm; rò rỉ tay nắm trong vòng lặp thì rồi <code>fopen</code> sẽ trả <code>NULL</code> cho một tệp hoàn toàn tồn tại.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
int main(void) {
    FILE *f = fopen("buffer_demo.txt", "w");
    fprintf(f, "1000 ky tu quan trong cua toi\\n");   /* 30 byte */
    /* CHUA fclose: kiem tra kich thuoc tren dia ngay luc nay */
    _Exit(0);   /* thoat khong don dep -&gt; bo dem khong duoc xa */
}</code></pre>
<p class="dap-an">✅ Đáp án (đo thật, cc -Wall): với <code>_Exit(0)</code> và không <code>fclose</code>, tệp tồn tại nhưng nặng <strong>0 byte</strong> — cả 30 byte mất trắng trong bộ đệm. Cũng chương trình đó mà có <code>fclose(f)</code> trước khi thoát thì cho <strong>30 byte</strong>. Thậm chí <em>trong lúc chương trình còn đang chạy</em>, ngay sau <code>fprintf</code> và trước <code>fclose</code>, tệp trên đĩa đo được 0 byte: lệnh ghi chưa chạm tới đĩa. Đó là toàn bộ lý do <code>fclose</code> có mặt trong danh sách sáu thao tác này.</p>
<p class="pitfall">⚠️ Lệnh <code>return 0;</code> bình thường từ <code>main</code> thì <em>có</em> xả và đóng hết mọi thứ, nên quên <code>fclose</code> trong bài lab thường trông vô hại. Nó thôi vô hại ngay khi chương trình sập, khi gọi <code>exit</code> từ một nhánh lỗi sâu, hoặc khi mở tệp trong vòng lặp — mà đó đúng là những gì chương trình thật hay làm.</p>`],

      [16, '4.1. Connection to File',
        `<p class="y-chinh">🎯 Two sentences that explain the design: a C program connects to a file through an <strong>object of <code>FILE</code> type</strong>; a library function <strong>retrieves the address</strong> of that object, you <strong>store the address in a pointer</strong>, and you access the file through that pointer — called the <strong>File Pointer</strong>.</p>
<ul>
<li><strong>Read "object" as "structure the library owns"</strong> — <code>FILE</code> is a <code>struct</code> declared in <code>&lt;stdio.h&gt;</code> holding the OS file descriptor, the buffer, the current position and the error/EOF flags. You never look inside it, and the standard does not tell you what is in it.</li>
<li><strong>Why C gives you a pointer and not the object itself</strong> — because the library must keep the one true copy. If you had a <code>FILE</code> by value you could copy it, and then two copies would each think they own the buffer. A pointer means there is exactly one object and everyone refers to the same one.</li>
<li><strong>"A handle to the object"</strong> (slide 17's word) — the general computing term. You hold the handle, the library holds the thing. It is the same idea as a cloakroom ticket: the ticket is small and copyable, the coat is not.</li>
<li><strong>Measured — what is actually behind the pointer</strong> — on this machine <code>sizeof(FILE)</code> is <strong>152 bytes</strong> and <code>sizeof(FILE *)</code> is <strong>8 bytes</strong>. Passing the pointer to a function copies 8 bytes; passing the structure would copy 152 and break everything.</li>
<li><strong>You already have three file pointers</strong> — <code>stdin</code>, <code>stdout</code>, <code>stderr</code> are all <code>FILE *</code>, opened for you before <code>main</code> starts. That is why <code>fprintf(stdout, "hi")</code> compiles and does the same as <code>printf("hi")</code>.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
int main(void) {
    printf("sizeof(FILE)  = %zu\\n", sizeof(FILE));
    printf("sizeof(FILE*) = %zu\\n", sizeof(FILE *));
    FILE *f = fopen("handle.txt", "w");
    printf("fptr  = %p\\n", (void *)f);
    printf("stdout= %p\\n", (void *)stdout);
    fclose(f);
    return 0;
}</code></pre>
<p class="dap-an">✅ Answer (measured, cc -Wall): <code>sizeof(FILE) = 152</code>, <code>sizeof(FILE*) = 8</code>, <code>fptr = 0x1fbc179c0</code>, <code>stdout = 0x1fbc15870</code>. Two things to take away: the addresses are close together because they live in the same library-owned area, and <code>stdout</code> really is the same kind of value your <code>fopen</code> returns.</p>
<p class="pitfall">⚠️ <code>FILE *fptr</code> is <strong>not the file</strong>. It is a pointer to a bookkeeping structure about the file. So <code>fptr = fopen(...)</code> does not "put the file in fptr", copying <code>fptr</code> into another variable does not give you a second independent file, and printing <code>fptr</code> tells you nothing about the file's contents.</p>`,
        `<p class="y-chinh">🎯 Hai câu giải thích cả thiết kế: chương trình C nối tới tệp thông qua một <strong>đối tượng kiểu <code>FILE</code></strong>; một hàm thư viện <strong>lấy về địa chỉ</strong> của đối tượng ấy, bạn <strong>cất địa chỉ vào một con trỏ</strong>, rồi truy cập tệp qua con trỏ đó — gọi là <strong>con trỏ tệp (File Pointer)</strong>.</p>
<ul>
<li><strong>Hiểu chữ "đối tượng" là "cấu trúc do thư viện sở hữu"</strong> — <code>FILE</code> là một <code>struct</code> khai trong <code>&lt;stdio.h&gt;</code>, giữ bộ mô tả tệp của hệ điều hành, bộ đệm, vị trí hiện tại và các cờ lỗi/EOF. Bạn không bao giờ ngó vào trong, và chuẩn cũng không cho biết bên trong có gì.</li>
<li><strong>Vì sao C đưa bạn con trỏ chứ không đưa đối tượng</strong> — vì thư viện phải giữ bản duy nhất. Nếu bạn cầm một <code>FILE</code> theo giá trị thì bạn chép được nó, và khi ấy hai bản sao đều tưởng mình sở hữu bộ đệm. Con trỏ nghĩa là chỉ có đúng một đối tượng và mọi người cùng trỏ vào nó.</li>
<li><strong>"Tay nắm tới đối tượng"</strong> (chữ của slide 17) — thuật ngữ chung của ngành. Bạn giữ tay nắm, thư viện giữ cái vật. Cùng một ý với cái vé gửi áo khoác: cái vé thì nhỏ và chép được, cái áo thì không.</li>
<li><strong>Đo thật — phía sau con trỏ là cái gì</strong> — trên máy này <code>sizeof(FILE)</code> là <strong>152 byte</strong> còn <code>sizeof(FILE *)</code> là <strong>8 byte</strong>. Truyền con trỏ vào hàm là chép 8 byte; truyền cả cấu trúc sẽ chép 152 byte và hỏng hết mọi thứ.</li>
<li><strong>Bạn đã có sẵn ba con trỏ tệp</strong> — <code>stdin</code>, <code>stdout</code>, <code>stderr</code> đều là <code>FILE *</code>, được mở giúp bạn trước cả khi <code>main</code> chạy. Vì thế <code>fprintf(stdout, "hi")</code> biên dịch được và làm đúng việc của <code>printf("hi")</code>.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
int main(void) {
    printf("sizeof(FILE)  = %zu\\n", sizeof(FILE));
    printf("sizeof(FILE*) = %zu\\n", sizeof(FILE *));
    FILE *f = fopen("handle.txt", "w");
    printf("fptr  = %p\\n", (void *)f);
    printf("stdout= %p\\n", (void *)stdout);
    fclose(f);
    return 0;
}</code></pre>
<p class="dap-an">✅ Đáp án (đo thật, cc -Wall): <code>sizeof(FILE) = 152</code>, <code>sizeof(FILE*) = 8</code>, <code>fptr = 0x1fbc179c0</code>, <code>stdout = 0x1fbc15870</code>. Hai điều rút ra: hai địa chỉ nằm gần nhau vì chúng ở cùng vùng do thư viện quản lý, và <code>stdout</code> đúng là cùng loại giá trị mà <code>fopen</code> của bạn trả về.</p>
<p class="pitfall">⚠️ <code>FILE *fptr</code> <strong>không phải là cái tệp</strong>. Nó là con trỏ tới một cấu trúc ghi sổ về tệp. Nên <code>fptr = fopen(...)</code> không hề "nhét cái tệp vào fptr", chép <code>fptr</code> sang biến khác không cho bạn tệp thứ hai độc lập, và in <code>fptr</code> ra chẳng nói lên điều gì về nội dung tệp.</p>`],

      [17, '4.1. Connection to File (cont.)',
        `<p class="y-chinh">🎯 The syntax, in one boxed line: <strong><code>FILE *identifier;</code></strong>. <code>FILE</code> is the type of the FILE object, <code>identifier</code> is the name of the pointer, and we call that pointer a <strong>handle</strong> to the object. The type is declared in <strong><code>&lt;stdio.h&gt;</code></strong>.</p>
<ul>
<li><strong><code>FILE</code> is uppercase, always</strong> — it is a <code>typedef</code> name, not a keyword, and C is case-sensitive: <code>file *fp;</code> or <code>File *fp;</code> both fail to compile with "unknown type name". This is a genuine exam typo trap.</li>
<li><strong>No <code>&lt;stdio.h&gt;</code>, no <code>FILE</code></strong> — the type only exists because that header declares it. Forget the <code>#include</code> and the error is <em>"unknown type name 'FILE'"</em>, which sends students hunting for a missing library when one line fixes it.</li>
<li><strong>Three spellings, one meaning</strong> — <code>FILE* fptr;</code>, <code>FILE *fptr;</code> and <code>FILE * fptr;</code> are identical to the compiler. The slide's own code image uses <code>FILE *fp</code> while slide 21's uses <code>FILE* fptr</code>; both appear in FPT material, so read either without hesitating.</li>
<li><strong>Declaring is not opening</strong> — <code>FILE *fptr;</code> allocates 8 bytes of pointer on the stack, nothing more. No file is touched, no disk access happens. Using <code>fptr</code> before <code>fopen</code> assigns to it is undefined behaviour — typically a crash.</li>
<li><strong>Why the slide initialises to <code>NULL</code></strong> — <code>FILE *fp = NULL;</code> makes the uninitialised state <em>detectable</em>: a wild pointer crashes unpredictably, a <code>NULL</code> one fails the <code>if (fp == NULL)</code> test you were going to write anyway. Good habit, and free.</li>
<li><strong>⚠️ The code image on this slide is missing its semicolon</strong> — it reads <code>FILE *fp = NULL</code> with no <code>;</code>. Copy it verbatim into a source file and it will not compile.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
int main(void) {
    FILE *fp = NULL;      /* DUNG: co dau cham phay */
    if (fp == NULL) printf("chua mo tep nao ca\\n");
    return 0;
}</code></pre>
<p class="dap-an">✅ Answer (compiled with cc -Wall): with the semicolon it compiles cleanly and prints <code>chua mo tep nao ca</code>. Without it — exactly as drawn on the slide — clang reports <em>"expected ';' at end of declaration"</em>. The slide is teaching the right idea (initialise the handle to <code>NULL</code>) with a typo in the picture; say so rather than copying it, and do not "fix" the slide in your answer — just write correct C.</p>
<p class="meo">💡 Read the declaration right-to-left and it says itself: <em>fp is a pointer to a FILE</em>. That habit scales — <code>FILE **list;</code> is "list is a pointer to a pointer to a FILE", which is how you would keep an array of open files.</p>`,
        `<p class="y-chinh">🎯 Cú pháp, trong một dòng đóng khung: <strong><code>FILE *identifier;</code></strong>. <code>FILE</code> là kiểu của đối tượng FILE, <code>identifier</code> là tên con trỏ, và ta gọi con trỏ ấy là <strong>tay nắm (handle)</strong> tới đối tượng. Kiểu này khai trong <strong><code>&lt;stdio.h&gt;</code></strong>.</p>
<ul>
<li><strong><code>FILE</code> viết HOA, luôn luôn</strong> — nó là một tên <code>typedef</code> chứ không phải từ khoá, và C phân biệt chữ hoa chữ thường: <code>file *fp;</code> hay <code>File *fp;</code> đều không biên dịch được, báo "unknown type name". Đây là bẫy gõ nhầm có thật trong đề thi.</li>
<li><strong>Không có <code>&lt;stdio.h&gt;</code> thì không có <code>FILE</code></strong> — kiểu này tồn tại chỉ vì header ấy khai nó ra. Quên dòng <code>#include</code> là gặp lỗi <em>"unknown type name 'FILE'"</em>, khiến sinh viên đi tìm thư viện nào thiếu trong khi một dòng là xong.</li>
<li><strong>Ba cách viết, một nghĩa</strong> — <code>FILE* fptr;</code>, <code>FILE *fptr;</code> và <code>FILE * fptr;</code> với trình biên dịch là như nhau. Ảnh mã trên chính slide này viết <code>FILE *fp</code> còn slide 21 viết <code>FILE* fptr</code>; cả hai đều có trong tài liệu FPT, nên hãy đọc kiểu nào cũng được, đừng khựng lại.</li>
<li><strong>Khai báo không phải là mở</strong> — <code>FILE *fptr;</code> cấp 8 byte con trỏ trên ngăn xếp, hết. Không tệp nào bị đụng tới, không có truy cập đĩa nào xảy ra. Dùng <code>fptr</code> trước khi <code>fopen</code> gán cho nó là hành vi không xác định — thường là sập chương trình.</li>
<li><strong>Vì sao slide khởi tạo bằng <code>NULL</code></strong> — <code>FILE *fp = NULL;</code> làm cho trạng thái "chưa khởi tạo" trở nên <em>phát hiện được</em>: con trỏ hoang thì sập một cách khó đoán, còn con trỏ <code>NULL</code> thì rớt đúng vào phép kiểm <code>if (fp == NULL)</code> mà đằng nào bạn cũng phải viết. Thói quen tốt, lại miễn phí.</li>
<li><strong>⚠️ Ảnh mã trên slide này THIẾU dấu chấm phẩy</strong> — nó ghi <code>FILE *fp = NULL</code> không có <code>;</code>. Chép y nguyên vào tệp mã nguồn là không biên dịch được.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
int main(void) {
    FILE *fp = NULL;      /* DUNG: co dau cham phay */
    if (fp == NULL) printf("chua mo tep nao ca\\n");
    return 0;
}</code></pre>
<p class="dap-an">✅ Đáp án (biên dịch bằng cc -Wall): có dấu chấm phẩy thì biên dịch sạch và in ra <code>chua mo tep nao ca</code>. Không có nó — đúng như hình vẽ trên slide — clang báo <em>"expected ';' at end of declaration"</em>. Slide đang dạy đúng ý (khởi tạo tay nắm bằng <code>NULL</code>) nhưng hình bị lỗi gõ; hãy nói rõ ra thay vì chép lại, và đừng "sửa slide" trong bài làm — cứ viết C cho đúng là được.</p>
<p class="meo">💡 Đọc câu khai báo từ phải sang trái là nó tự nói ra: <em>fp là con trỏ tới một FILE</em>. Thói quen này mở rộng được — <code>FILE **list;</code> là "list là con trỏ tới con trỏ tới FILE", đúng cách bạn giữ một mảng các tệp đang mở.</p>`],

      [18, '4.2. Open a File in C',
        `<p class="y-chinh">🎯 The most important slide in this half of the deck: <strong><code>FILE* fopen(const char *file_name, const char *access_mode);</code></strong> — two string parameters, and a return value that is <strong>a file pointer on success</strong> or <strong><code>NULL</code> on failure</strong>.</p>
<ul>
<li><strong><code>file_name</code></strong> — "name of the file when present in the same directory as the source file. Otherwise, full path." ⚠️ The slide says <em>source file</em>, and that is the single most misleading sentence in the deck: the relative path is resolved against the <strong>current working directory</strong> of the running process, which is not necessarily where the <code>.c</code> lives.</li>
<li><strong><code>access_mode</code></strong> — "specifies for what operation the file is being opened", a short string like <code>"r"</code>, <code>"w"</code>, <code>"ab+"</code>. Slides 19–20 list them; the full table with real measurements is on the next two slides.</li>
<li><strong>Both parameters are <code>const char *</code></strong> — i.e. strings, so both must be in double quotes. <code>fopen(demo.txt, r)</code> is a compile error and <code>fopen("demo.txt", 'r')</code> passes a <code>char</code>, not a string — a classic exam trap. Modes are <strong>double quotes</strong>, always.</li>
<li><strong>The return value is the whole point</strong> — <code>fopen</code> is the only function in this slot that can fail for reasons outside your program (the file is missing, the directory is read-only, you are out of handles). That is why the next slide's example is entirely a <code>NULL</code> check.</li>
<li><strong>Measured — why it failed</strong> — the return value only says "it failed". <code>errno</code> plus <code>perror</code>/<code>strerror</code> say why, and that turns 20 minutes of guessing into one line of output.</li>
<li><strong>Measured — the working-directory trap</strong> — I compiled one program that does <code>fopen("data.txt", "r")</code> and put it in a folder next to <code>data.txt</code>. Run from <em>inside</em> that folder it prints OK; run from <em>outside</em> the folder it prints NULL, although neither the program nor the data moved.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
#include &lt;errno.h&gt;
int main(void) {
    errno = 0;
    FILE *f = fopen("khong_he_co.txt", "r");
    printf("%s, errno=%d, %s\\n", f ? "khac NULL" : "NULL", errno, strerror(errno));
    errno = 0;
    f = fopen("p.txt", "q");           /* che do bay */
    printf("%s, errno=%d, %s\\n", f ? "khac NULL" : "NULL", errno, strerror(errno));
    return 0;
}</code></pre>
<p class="dap-an">✅ Answer (measured, cc -Wall): a missing file gives <code>NULL, errno=2, No such file or directory</code>; an invalid mode string gives <code>NULL, errno=22, Invalid argument</code>; a path whose directory does not exist also gives errno 2. And the working-directory experiment: the <em>same binary</em> reading the <em>same</em> <code>data.txt</code> printed <strong>OK</strong> when run from inside its folder and <strong>NULL</strong> when run from the folder above. That is the real explanation of "it works in Dev-C++ but not when I double-click the .exe" — the IDE sets the working directory to your project folder, Explorer sets it to somewhere else.</p>
<p class="pitfall">⚠️ Windows paths need doubled backslashes. I measured what happens if you forget: <code>"C:\\data\\a.txt"</code> is 11 bytes <code>43 3A 64 61 74 61 <strong>07</strong> 2E 74 78 74</code> — <code>\\d</code> collapsed to <code>d</code> (with a warning) and <code>\\a</code> became the BEL character <code>0x07</code>. The correct <code>"C:\\\\data\\\\a.txt"</code> is 13 bytes with real backslashes. Forward slashes also work on Windows: <code>"C:/data/a.txt"</code>.</p>`,
        `<p class="y-chinh">🎯 Slide quan trọng nhất của nửa deck này: <strong><code>FILE* fopen(const char *file_name, const char *access_mode);</code></strong> — hai tham số kiểu chuỗi, và giá trị trả về là <strong>con trỏ tệp nếu thành công</strong> hoặc <strong><code>NULL</code> nếu thất bại</strong>.</p>
<ul>
<li><strong><code>file_name</code></strong> — "tên tệp khi nó nằm cùng thư mục với tệp mã nguồn. Ngược lại thì phải ghi đường dẫn đầy đủ." ⚠️ Slide nói <em>tệp mã nguồn</em>, và đó là câu dễ gây hiểu lầm nhất cả deck: đường dẫn tương đối được tính từ <strong>thư mục làm việc hiện tại</strong> của tiến trình đang chạy, chứ không nhất thiết là chỗ tệp <code>.c</code> nằm.</li>
<li><strong><code>access_mode</code></strong> — "cho biết tệp được mở để làm thao tác gì", một chuỗi ngắn như <code>"r"</code>, <code>"w"</code>, <code>"ab+"</code>. Slide 19–20 liệt kê; bảng đầy đủ kèm số đo thật nằm ở hai slide kế tiếp.</li>
<li><strong>Cả hai tham số đều là <code>const char *</code></strong> — tức là chuỗi, nên cả hai phải nằm trong dấu nháy kép. <code>fopen(demo.txt, r)</code> là lỗi biên dịch, còn <code>fopen("demo.txt", 'r')</code> thì truyền một <code>char</code> chứ không phải chuỗi — bẫy kinh điển trong đề thi. Chế độ dùng <strong>nháy kép</strong>, luôn luôn.</li>
<li><strong>Giá trị trả về mới là điều cốt yếu</strong> — <code>fopen</code> là hàm duy nhất trong slot này có thể thất bại vì lý do nằm ngoài chương trình của bạn (tệp không có, thư mục chỉ đọc, hết tay nắm). Vì thế ví dụ ở slide sau chỉ toàn là phép kiểm <code>NULL</code>.</li>
<li><strong>Đo thật — thất bại vì cái gì</strong> — giá trị trả về chỉ nói "thất bại". Biến <code>errno</code> cộng <code>perror</code>/<code>strerror</code> mới nói vì sao, và nó biến 20 phút đoán mò thành một dòng kết quả.</li>
<li><strong>Đo thật — cái bẫy thư mục làm việc</strong> — tôi biên dịch một chương trình chỉ làm <code>fopen("data.txt", "r")</code> rồi đặt nó vào một thư mục cạnh <code>data.txt</code>. Chạy <em>từ trong</em> thư mục ấy thì in OK; chạy <em>từ ngoài</em> thì in NULL, dù cả chương trình lẫn dữ liệu đều không hề di chuyển.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
#include &lt;errno.h&gt;
int main(void) {
    errno = 0;
    FILE *f = fopen("khong_he_co.txt", "r");
    printf("%s, errno=%d, %s\\n", f ? "khac NULL" : "NULL", errno, strerror(errno));
    errno = 0;
    f = fopen("p.txt", "q");           /* che do bay */
    printf("%s, errno=%d, %s\\n", f ? "khac NULL" : "NULL", errno, strerror(errno));
    return 0;
}</code></pre>
<p class="dap-an">✅ Đáp án (đo thật, cc -Wall): tệp không tồn tại cho <code>NULL, errno=2, No such file or directory</code>; chuỗi chế độ bậy cho <code>NULL, errno=22, Invalid argument</code>; đường dẫn mà thư mục không tồn tại cũng cho errno 2. Và thí nghiệm thư mục làm việc: <em>cùng một tệp chạy</em> đọc <em>cùng một</em> <code>data.txt</code> in ra <strong>OK</strong> khi chạy từ trong thư mục của nó và <strong>NULL</strong> khi chạy từ thư mục cha. Đó chính là lời giải thích thật cho câu "chạy trong Dev-C++ thì được mà nháy đúp cái .exe thì không" — IDE đặt thư mục làm việc là thư mục dự án của bạn, còn Explorer đặt nó ở chỗ khác.</p>
<p class="pitfall">⚠️ Đường dẫn Windows phải nhân đôi dấu gạch chéo ngược. Tôi đã đo xem quên thì ra sao: <code>"C:\\data\\a.txt"</code> chỉ là 11 byte <code>43 3A 64 61 74 61 <strong>07</strong> 2E 74 78 74</code> — <code>\\d</code> co lại thành <code>d</code> (kèm cảnh báo) còn <code>\\a</code> thành ký tự BEL <code>0x07</code>. Bản đúng <code>"C:\\\\data\\\\a.txt"</code> dài 13 byte với dấu gạch chéo thật. Trên Windows dùng gạch chéo xuôi cũng chạy: <code>"C:/data/a.txt"</code>.</p>`],

      [19, 'File opening modes in C',
        `<p class="y-chinh">🎯 The first half of the mode table — the five text modes <strong><code>r · w · a · r+ · w+</code></strong>, each with a description and a <code>fopen("demo.txt", …)</code> example. The three letters and the <code>+</code> are the whole system; everything else is a combination.</p>
<ul>
<li><strong>The three base letters</strong> — <code>r</code> = read an <em>existing</em> file; <code>w</code> = write, <em>destroying</em> whatever was there; <code>a</code> = append, <em>preserving</em> what was there. Everything else is these three plus <code>+</code> (add the other direction) or <code>b</code> (binary).</li>
<li><strong>⚠️ <code>"w"</code> deletes the file's contents the instant you open it</strong> — the slide says "if the file already exists, it clears its contents". Note <em>when</em>: at <code>fopen</code> time, before you have written a single byte, and even if your program then crashes. I measured it: a 5-byte file measured 0 bytes immediately after the <code>fopen</code>, with no write performed at all.</li>
<li><strong>The consequence students meet the hard way</strong> — a program that saves records by opening with <code>"w"</code> each time will wipe yesterday's data on startup. To add to a file you want <code>"a"</code>; to change part of it in place you want <code>"r+"</code>.</li>
<li><strong><code>"r"</code> is the only mode here that refuses to create</strong> — <code>fopen("new.txt", "r")</code> on a non-existent file returns <code>NULL</code> (errno 2). <code>"w"</code>, <code>"a"</code>, <code>"w+"</code> all create it happily. So "the file was not found" is reported only in the <code>r</code> family.</li>
<li><strong><code>r+</code> vs <code>w+</code> — both read <em>and</em> write, and that is where the exam question lives</strong> — <code>r+</code> requires the file to exist and keeps everything; <code>w+</code> creates or truncates. Measured on a file containing "HELLO": <code>r+</code> writing one byte at position 0 leaves <strong>"JELLO" (5 bytes)</strong>; <code>w+</code> leaves only what you wrote.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
int main(void) {
    /* tep p.txt dang chua "HELLO" (5 byte) */
    FILE *f = fopen("p.txt", "r+");
    fwrite("J", 1, 1, f);     /* ghi de tai vi tri 0 */
    fclose(f);
    /* doc lai -&gt; ? */
    return 0;
}</code></pre>
<p class="dap-an">✅ Answer (measured, cc -Wall): the file now contains <strong>"JELLO", 5 bytes</strong> — <code>r+</code> overwrote one character in place and did not shorten the file. Run the same program with <code>"w"</code> or <code>"w+"</code> and the file contains just <strong>"J", 1 byte</strong>: the other four characters were destroyed at <code>fopen</code> time. With <code>"a"</code> the result is <strong>"HELLOJ", 6 bytes</strong>. Same one-byte write, three different files.</p>
<p class="pitfall">⚠️ Reading the description "initializes a text file for writing exclusively" as "it prepares an empty area" is what gets data deleted. Read it as: <strong><code>"w"</code> is <code>rm</code> followed by <code>create</code></strong>. If the data matters, open with <code>"a"</code> or <code>"r+"</code>, or check with <code>"r"</code> first.</p>`,
        `<p class="y-chinh">🎯 Nửa đầu bảng chế độ — năm chế độ văn bản <strong><code>r · w · a · r+ · w+</code></strong>, mỗi cái kèm mô tả và một ví dụ <code>fopen("demo.txt", …)</code>. Ba chữ cái và dấu <code>+</code> là toàn bộ hệ thống; mọi thứ còn lại chỉ là tổ hợp.</p>
<ul>
<li><strong>Ba chữ cái gốc</strong> — <code>r</code> = đọc một tệp <em>đã có</em>; <code>w</code> = ghi, <em>huỷ</em> sạch thứ đang có; <code>a</code> = nối đuôi, <em>giữ nguyên</em> thứ đang có. Mọi chế độ khác là ba cái này cộng <code>+</code> (thêm chiều còn lại) hoặc <code>b</code> (nhị phân).</li>
<li><strong>⚠️ <code>"w"</code> xoá sạch nội dung tệp NGAY GIÂY PHÚT bạn mở nó</strong> — slide ghi "nếu tệp đã tồn tại, nó xoá nội dung đi". Để ý chữ <em>khi nào</em>: ngay lúc <code>fopen</code>, trước khi bạn ghi được một byte nào, và kể cả khi sau đó chương trình sập. Tôi đã đo: tệp 5 byte đo được 0 byte ngay sau lệnh <code>fopen</code>, chưa hề ghi gì cả.</li>
<li><strong>Hậu quả sinh viên gặp theo cách đau đớn</strong> — chương trình lưu bản ghi mà mỗi lần đều mở bằng <code>"w"</code> sẽ xoá sạch dữ liệu hôm qua ngay lúc khởi động. Muốn thêm vào tệp thì dùng <code>"a"</code>; muốn sửa một phần tại chỗ thì dùng <code>"r+"</code>.</li>
<li><strong><code>"r"</code> là chế độ duy nhất ở đây từ chối tạo tệp</strong> — <code>fopen("new.txt", "r")</code> trên tệp không tồn tại trả <code>NULL</code> (errno 2). Còn <code>"w"</code>, <code>"a"</code>, <code>"w+"</code> đều vui vẻ tạo mới. Nên lỗi "không tìm thấy tệp" chỉ được báo ở họ <code>r</code>.</li>
<li><strong><code>r+</code> so với <code>w+</code> — cả hai vừa đọc vừa ghi, và đó chính là chỗ đề thi nằm</strong> — <code>r+</code> đòi tệp phải tồn tại và giữ nguyên mọi thứ; <code>w+</code> tạo mới hoặc cắt sạch. Đo trên tệp chứa "HELLO": <code>r+</code> ghi một byte tại vị trí 0 để lại <strong>"JELLO" (5 byte)</strong>; <code>w+</code> chỉ để lại đúng thứ bạn vừa ghi.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
int main(void) {
    /* tep p.txt dang chua "HELLO" (5 byte) */
    FILE *f = fopen("p.txt", "r+");
    fwrite("J", 1, 1, f);     /* ghi de tai vi tri 0 */
    fclose(f);
    /* doc lai -&gt; ? */
    return 0;
}</code></pre>
<p class="dap-an">✅ Đáp án (đo thật, cc -Wall): tệp bây giờ chứa <strong>"JELLO", 5 byte</strong> — <code>r+</code> ghi đè một ký tự tại chỗ và KHÔNG làm tệp ngắn đi. Chạy đúng chương trình ấy với <code>"w"</code> hay <code>"w+"</code> thì tệp chỉ còn <strong>"J", 1 byte</strong>: bốn ký tự kia đã bị huỷ ngay lúc <code>fopen</code>. Với <code>"a"</code> thì kết quả là <strong>"HELLOJ", 6 byte</strong>. Cùng một lệnh ghi một byte, ba tệp khác nhau.</p>
<p class="pitfall">⚠️ Hiểu câu "khởi tạo tệp văn bản để ghi độc quyền" thành "nó dọn sẵn một vùng trống" chính là cách người ta làm mất dữ liệu. Hãy hiểu là: <strong><code>"w"</code> = xoá tệp rồi tạo lại</strong>. Nếu dữ liệu có giá trị, hãy mở bằng <code>"a"</code> hoặc <code>"r+"</code>, hoặc kiểm trước bằng <code>"r"</code>.</p>`],

      [20, 'File opening modes in C (cont.)',
        `<p class="y-chinh">🎯 The second half of the table — <strong><code>a+ · rb · wb · ab+ · rb+ · wb+</code></strong>. Together with slide 19 the deck lists <strong>11</strong> modes. ⚠️ The standard set is <strong>12</strong>: plain <strong><code>ab</code> is missing from both slides</strong>, even though slide 22 later lists <code>ab</code> among the modes that create a file. Here is the complete table, every row measured with a program rather than copied from memory.</p>
<ul>
<li><strong>How to read any mode in two seconds</strong> — <em>base letter</em> decides what happens to an existing file (<code>r</code> keep + must exist · <code>w</code> destroy · <code>a</code> keep + write at end); <em><code>+</code></em> adds the missing direction so the mode can both read and write; <em><code>b</code></em> turns off newline translation. That is all 12 rows generated from three rules.</li>
<li><strong>Where the file position starts</strong> — measured with <code>ftell</code> right after <code>fopen</code> on a 5-byte file: <code>0</code> for every <code>r</code> and <code>w</code> mode, and <strong>5</strong> (the end) for every <code>a</code> mode.</li>
<li><strong>The append rule is stronger than the position</strong> — in <code>a</code> modes, writes always go to the end <em>no matter where you seek</em>. Measured: on "HELLO", <code>fseek(f, 0, SEEK_SET)</code> then writing 'X' gives <strong>"HELLOX"</strong>, not "XELLO". This catches people who assume append is just "start at the end".</li>
<li><strong><code>b</code> changes nothing on Linux/macOS and matters on Windows</strong> — measured earlier: <code>"w"</code> and <code>"wb"</code> produced byte-identical 4-byte files here; on Windows the text one would be 6 bytes. Always use the <code>b</code> modes with <code>fread</code>/<code>fwrite</code>.</li>
<li><strong>The <code>+</code> modes need a nudge between reading and writing</strong> — after writing, call <code>fflush</code>, <code>fseek</code> or <code>rewind</code> before reading (and the other way round), otherwise the behaviour is undefined. Every measurement below did exactly that.</li>
</ul>
<table>
<tr><th>Mode</th><th>File does not exist</th><th>File exists ("HELLO")</th><th>Read?</th><th>Write?</th><th>Start position</th></tr>
<tr><td><code>r</code></td><td>NULL (errno 2)</td><td>kept, 5 bytes</td><td>✅ read "HELLO"</td><td>❌</td><td>0</td></tr>
<tr><td><code>w</code></td><td>created</td><td><strong>truncated to 0 at open</strong></td><td>❌</td><td>✅</td><td>0</td></tr>
<tr><td><code>a</code></td><td>created</td><td>kept, 5 bytes</td><td>❌</td><td>✅ always at end</td><td>5 (end)</td></tr>
<tr><td><code>r+</code></td><td>NULL (errno 2)</td><td>kept, 5 bytes</td><td>✅</td><td>✅ in place → "JELLO"</td><td>0</td></tr>
<tr><td><code>w+</code></td><td>created</td><td><strong>truncated to 0 at open</strong></td><td>✅ (only new data)</td><td>✅</td><td>0</td></tr>
<tr><td><code>a+</code></td><td>created</td><td>kept, 5 bytes</td><td>✅ after rewind → "HELLOWX"</td><td>✅ always at end</td><td>5 (end)</td></tr>
<tr><td><code>rb</code></td><td>NULL (errno 2)</td><td>kept, 5 bytes</td><td>✅</td><td>❌</td><td>0</td></tr>
<tr><td><code>wb</code></td><td>created</td><td><strong>truncated to 0 at open</strong></td><td>❌</td><td>✅</td><td>0</td></tr>
<tr><td><code>ab</code> ⚠️ not on the slides</td><td>created</td><td>kept, 5 bytes</td><td>❌</td><td>✅ always at end</td><td>5 (end)</td></tr>
<tr><td><code>rb+</code></td><td>NULL (errno 2)</td><td>kept, 5 bytes</td><td>✅ → "WXLLO"</td><td>✅ in place</td><td>0</td></tr>
<tr><td><code>wb+</code></td><td>created</td><td><strong>truncated to 0 at open</strong></td><td>✅ (only new data)</td><td>✅</td><td>0</td></tr>
<tr><td><code>ab+</code></td><td>created</td><td>kept, 5 bytes</td><td>✅ after rewind → "HELLOWX"</td><td>✅ always at end</td><td>5 (end)</td></tr>
</table>
<p class="dap-an">✅ Answer (every cell measured, cc -Wall): the probe created the file fresh, opened it in each mode, called <code>ftell</code>, tried a read and a write, then re-measured the size on disk. Three findings worth memorising: (1) the four <code>w</code> modes report the file size as <strong>0 immediately after <code>fopen</code></strong> — truncation happens at open, not at first write; (2) all four <code>r</code> modes return <code>NULL</code> with errno 2 when the file is absent, and no other mode does; (3) in the <code>a</code> modes <code>ftell</code> returns 5 and <code>fseek</code> back to 0 does not stop the write from landing at the end. Also: <code>w+</code> reading back after writing "WX" saw only <strong>"WX"</strong>, while <code>a+</code> saw <strong>"HELLOWX"</strong> and <code>r+</code> saw <strong>"WXLLO"</strong> — three modes, one write, three different views of the same file.</p>
<p class="meo">💡 Exam shortcut: the answer to "which modes create the file if it does not exist?" is <em>every mode except the four beginning with <code>r</code></em>. The answer to "which modes destroy existing content?" is <em>the four beginning with <code>w</code></em>. Two sentences replace the whole table.</p>`,
        `<p class="y-chinh">🎯 Nửa sau của bảng — <strong><code>a+ · rb · wb · ab+ · rb+ · wb+</code></strong>. Gộp với slide 19 thì deck liệt kê <strong>11</strong> chế độ. ⚠️ Bộ chuẩn có <strong>12</strong>: chế độ <strong><code>ab</code> bị thiếu hẳn ở cả hai slide</strong>, dù slide 22 sau này lại kể <code>ab</code> vào nhóm chế độ tạo được tệp. Dưới đây là bảng đầy đủ, mỗi dòng đều đo bằng chương trình chứ không chép từ trí nhớ.</p>
<ul>
<li><strong>Cách đọc bất kỳ chế độ nào trong hai giây</strong> — <em>chữ cái gốc</em> quyết định số phận tệp đang có (<code>r</code> giữ + bắt buộc phải có · <code>w</code> huỷ · <code>a</code> giữ + ghi ở cuối); <em>dấu <code>+</code></em> thêm chiều còn thiếu để chế độ vừa đọc vừa ghi được; <em>chữ <code>b</code></em> tắt phép đổi ký tự xuống dòng. Ba luật ấy sinh ra đủ 12 dòng.</li>
<li><strong>Con trỏ tệp bắt đầu ở đâu</strong> — đo bằng <code>ftell</code> ngay sau <code>fopen</code> trên tệp 5 byte: <code>0</code> với mọi chế độ <code>r</code> và <code>w</code>, và <strong>5</strong> (cuối tệp) với mọi chế độ <code>a</code>.</li>
<li><strong>Luật nối đuôi mạnh hơn cả vị trí con trỏ</strong> — ở các chế độ <code>a</code>, lệnh ghi LUÔN rơi vào cuối tệp <em>dù bạn có nhảy đi đâu</em>. Đo thật: trên "HELLO", gọi <code>fseek(f, 0, SEEK_SET)</code> rồi ghi 'X' cho ra <strong>"HELLOX"</strong>, chứ không phải "XELLO". Chỗ này bẫy đúng những ai tưởng append chỉ là "bắt đầu ở cuối".</li>
<li><strong>Chữ <code>b</code> không đổi gì trên Linux/macOS nhưng có ý nghĩa trên Windows</strong> — đã đo ở trên: <code>"w"</code> và <code>"wb"</code> ở đây cho hai tệp 4 byte giống nhau từng byte; trên Windows cái chế độ văn bản sẽ là 6 byte. Luôn dùng chế độ có <code>b</code> khi đi cùng <code>fread</code>/<code>fwrite</code>.</li>
<li><strong>Các chế độ <code>+</code> cần một cú "hích" khi đổi chiều</strong> — sau khi ghi, phải gọi <code>fflush</code>, <code>fseek</code> hay <code>rewind</code> rồi mới đọc (và ngược lại), nếu không thì hành vi không xác định. Mọi phép đo dưới đây đều làm đúng như vậy.</li>
</ul>
<table>
<tr><th>Chế độ</th><th>Tệp chưa tồn tại</th><th>Tệp đã có ("HELLO")</th><th>Đọc?</th><th>Ghi?</th><th>Con trỏ bắt đầu</th></tr>
<tr><td><code>r</code></td><td>NULL (errno 2)</td><td>giữ nguyên, 5 byte</td><td>✅ đọc ra "HELLO"</td><td>❌</td><td>0</td></tr>
<tr><td><code>w</code></td><td>tạo mới</td><td><strong>cắt về 0 ngay lúc mở</strong></td><td>❌</td><td>✅</td><td>0</td></tr>
<tr><td><code>a</code></td><td>tạo mới</td><td>giữ nguyên, 5 byte</td><td>❌</td><td>✅ luôn ở cuối</td><td>5 (cuối)</td></tr>
<tr><td><code>r+</code></td><td>NULL (errno 2)</td><td>giữ nguyên, 5 byte</td><td>✅</td><td>✅ đè tại chỗ → "JELLO"</td><td>0</td></tr>
<tr><td><code>w+</code></td><td>tạo mới</td><td><strong>cắt về 0 ngay lúc mở</strong></td><td>✅ (chỉ thấy dữ liệu mới)</td><td>✅</td><td>0</td></tr>
<tr><td><code>a+</code></td><td>tạo mới</td><td>giữ nguyên, 5 byte</td><td>✅ sau rewind → "HELLOWX"</td><td>✅ luôn ở cuối</td><td>5 (cuối)</td></tr>
<tr><td><code>rb</code></td><td>NULL (errno 2)</td><td>giữ nguyên, 5 byte</td><td>✅</td><td>❌</td><td>0</td></tr>
<tr><td><code>wb</code></td><td>tạo mới</td><td><strong>cắt về 0 ngay lúc mở</strong></td><td>❌</td><td>✅</td><td>0</td></tr>
<tr><td><code>ab</code> ⚠️ slide không có</td><td>tạo mới</td><td>giữ nguyên, 5 byte</td><td>❌</td><td>✅ luôn ở cuối</td><td>5 (cuối)</td></tr>
<tr><td><code>rb+</code></td><td>NULL (errno 2)</td><td>giữ nguyên, 5 byte</td><td>✅ → "WXLLO"</td><td>✅ đè tại chỗ</td><td>0</td></tr>
<tr><td><code>wb+</code></td><td>tạo mới</td><td><strong>cắt về 0 ngay lúc mở</strong></td><td>✅ (chỉ thấy dữ liệu mới)</td><td>✅</td><td>0</td></tr>
<tr><td><code>ab+</code></td><td>tạo mới</td><td>giữ nguyên, 5 byte</td><td>✅ sau rewind → "HELLOWX"</td><td>✅ luôn ở cuối</td><td>5 (cuối)</td></tr>
</table>
<p class="dap-an">✅ Đáp án (mọi ô đều đo thật, cc -Wall): chương trình dò tạo tệp mới tinh, mở theo từng chế độ, gọi <code>ftell</code>, thử đọc và thử ghi, rồi đo lại kích thước trên đĩa. Ba phát hiện đáng thuộc: (1) bốn chế độ <code>w</code> cho kích thước tệp <strong>0 ngay sau <code>fopen</code></strong> — việc cắt xảy ra lúc mở, không phải lúc ghi lần đầu; (2) cả bốn chế độ <code>r</code> trả <code>NULL</code> với errno 2 khi tệp vắng mặt, và không chế độ nào khác làm thế; (3) ở các chế độ <code>a</code>, <code>ftell</code> trả 5 và <code>fseek</code> về 0 cũng không ngăn được lệnh ghi rơi vào cuối tệp. Thêm nữa: <code>w+</code> đọc lại sau khi ghi "WX" chỉ thấy <strong>"WX"</strong>, trong khi <code>a+</code> thấy <strong>"HELLOWX"</strong> còn <code>r+</code> thấy <strong>"WXLLO"</strong> — ba chế độ, một lệnh ghi, ba cái nhìn khác nhau về cùng một tệp.</p>
<p class="meo">💡 Mẹo thi: đáp án cho "chế độ nào tạo tệp nếu nó chưa tồn tại?" là <em>mọi chế độ trừ bốn cái bắt đầu bằng <code>r</code></em>. Đáp án cho "chế độ nào huỷ nội dung đang có?" là <em>bốn cái bắt đầu bằng <code>w</code></em>. Hai câu thay được cả cái bảng.</p>`],

      [21, 'Example of Opening a File',
        `<p class="y-chinh">🎯 Seventeen lines of code whose only job is the <code>NULL</code> check, plus a console window showing the failure message. This is the skeleton every file program in the PE starts with: <strong>declare the handle → <code>fopen</code> → test for <code>NULL</code> → stop or continue</strong>.</p>
<ul>
<li><strong>Line by line</strong> — <code>#include &lt;stdio.h&gt;</code> for <code>FILE</code>/<code>fopen</code>/<code>printf</code>; <code>#include &lt;stdlib.h&gt;</code> for <code>exit</code> (this is why the second header is there, and exam answers lose marks for omitting it); <code>FILE* fptr;</code> declares the handle; <code>fptr = fopen("filename.txt", "r");</code> asks for the file in read mode; <code>if (fptr == NULL) { … exit(0); }</code> stops if it failed.</li>
<li><strong>Why <code>"r"</code> is the mode that demonstrates this best</strong> — it is the only family that refuses to create the file, so running the program in a folder without <code>filename.txt</code> reliably produces the failure path. With <code>"w"</code> the check would almost never fire.</li>
<li><strong>The console in the picture</strong> — <code>D:\\MonHoc\\PRF192\\ThucHanh\\connect_file.exe</code> prints <em>"The file is not opened. The program will now exit."</em> then <em>"Process exited after 0.07281 seconds with return value 0"</em>. I compiled the exact source and reproduced it.</li>
<li><strong>⚠️ <code>exit(0)</code> is the wrong exit code here</strong> — 0 means <em>success</em> to the operating system, so a script that checks the result thinks everything went fine although the file was never opened. The console line "return value 0" in the slide's own screenshot is the evidence. Use <code>exit(1)</code> or <code>return 1</code> for a failure.</li>
<li><strong>What the program is missing</strong> — a <code>fclose(fptr)</code> on the success path. It happens not to matter here because nothing is read and <code>return 0</code> from <code>main</code> cleans up, but copying this skeleton into a program that reads a file and then forgetting the close is exactly the bug from slide 15.</li>
<li><strong>Two lines that would double its usefulness</strong> — <code>perror("fopen")</code> instead of the plain <code>printf</code> prints the reason (<em>No such file or directory</em>), and <code>%s</code> with the filename tells you <em>which</em> path it tried. Debugging turns from guessing into reading.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
int main()
{
    // file pointer variable to store the value returned by fopen
    FILE* fptr;
    // opening the file in read mode
    fptr = fopen("filename.txt", "r");
    // checking if the file is opened successfully
    if (fptr == NULL) {
        printf("The file is not opened. The program will "
               "now exit.");
        exit(0);
    }
    return 0;
}</code></pre>
<p class="dap-an">✅ Answer (compiled with cc -Wall, no warnings, and run twice): with no <code>filename.txt</code> in the working directory it prints <code>The file is not opened. The program will now exit.</code> — character for character what the slide's console shows — and the shell reports exit status <strong>0</strong>, confirming the flaw noted above. After creating <code>filename.txt</code> and re-running, it prints <strong>nothing</strong> and exits 0: the <code>NULL</code> branch was skipped, which is the proof that the check works in both directions. Note also that the two string literals on consecutive lines are <em>concatenated</em> by the compiler into one string — that is standard C, not a typo in the slide.</p>
<p class="pitfall">⚠️ Never skip the <code>NULL</code> check "because the file is definitely there". If <code>fopen</code> fails and you call <code>fscanf(fptr, …)</code> anyway, you dereference a null pointer and the program crashes with no useful message — and on the exam machine, in the folder the grader runs it from, the file very often is <em>not</em> there.</p>`,
        `<p class="y-chinh">🎯 Mười bảy dòng mã mà việc duy nhất là kiểm <code>NULL</code>, cộng một cửa sổ console hiện thông báo thất bại. Đây là bộ xương mà mọi chương trình dùng tệp trong bài PE đều bắt đầu bằng: <strong>khai tay nắm → <code>fopen</code> → kiểm <code>NULL</code> → dừng hoặc đi tiếp</strong>.</p>
<ul>
<li><strong>Đọc từng dòng</strong> — <code>#include &lt;stdio.h&gt;</code> cho <code>FILE</code>/<code>fopen</code>/<code>printf</code>; <code>#include &lt;stdlib.h&gt;</code> cho <code>exit</code> (đó là lý do có header thứ hai, và bài thi quên nó là bị trừ điểm); <code>FILE* fptr;</code> khai tay nắm; <code>fptr = fopen("filename.txt", "r");</code> xin mở tệp ở chế độ đọc; <code>if (fptr == NULL) { … exit(0); }</code> dừng lại nếu hỏng.</li>
<li><strong>Vì sao <code>"r"</code> là chế độ minh hoạ chuyện này hay nhất</strong> — nó là họ duy nhất từ chối tạo tệp, nên chạy chương trình trong thư mục không có <code>filename.txt</code> là chắc chắn đi vào nhánh thất bại. Với <code>"w"</code> thì phép kiểm gần như không bao giờ nổ.</li>
<li><strong>Cửa sổ console trong hình</strong> — <code>D:\\MonHoc\\PRF192\\ThucHanh\\connect_file.exe</code> in ra <em>"The file is not opened. The program will now exit."</em> rồi <em>"Process exited after 0.07281 seconds with return value 0"</em>. Tôi đã biên dịch đúng mã nguồn ấy và tái hiện lại được.</li>
<li><strong>⚠️ <code>exit(0)</code> là mã thoát SAI ở đây</strong> — số 0 với hệ điều hành nghĩa là <em>thành công</em>, nên một script kiểm kết quả sẽ tưởng mọi thứ êm đẹp dù tệp chưa hề mở được. Chính dòng "return value 0" trong ảnh chụp màn hình của slide là bằng chứng. Thất bại thì dùng <code>exit(1)</code> hoặc <code>return 1</code>.</li>
<li><strong>Chương trình thiếu gì</strong> — thiếu <code>fclose(fptr)</code> ở nhánh thành công. Ở đây tình cờ không sao vì chẳng đọc gì và <code>return 0</code> từ <code>main</code> dọn dẹp giúp, nhưng chép bộ xương này vào một chương trình có đọc tệp rồi quên đóng thì đúng là con lỗi ở slide 15.</li>
<li><strong>Hai dòng làm nó hữu ích gấp đôi</strong> — dùng <code>perror("fopen")</code> thay cho <code>printf</code> trơn sẽ in ra lý do (<em>No such file or directory</em>), và in kèm <code>%s</code> tên tệp cho biết nó đã thử <em>đường dẫn nào</em>. Gỡ lỗi từ chỗ đoán mò thành chỗ đọc là ra.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
int main()
{
    // file pointer variable to store the value returned by fopen
    FILE* fptr;
    // opening the file in read mode
    fptr = fopen("filename.txt", "r");
    // checking if the file is opened successfully
    if (fptr == NULL) {
        printf("The file is not opened. The program will "
               "now exit.");
        exit(0);
    }
    return 0;
}</code></pre>
<p class="dap-an">✅ Đáp án (biên dịch bằng cc -Wall, không cảnh báo, và chạy hai lần): khi thư mục làm việc không có <code>filename.txt</code>, nó in ra <code>The file is not opened. The program will now exit.</code> — đúng từng ký tự như console trên slide — và shell báo mã thoát <strong>0</strong>, xác nhận đúng chỗ dở đã nêu ở trên. Sau khi tạo <code>filename.txt</code> rồi chạy lại, nó <strong>không in gì</strong> và thoát 0: nhánh <code>NULL</code> bị bỏ qua, đó là bằng chứng phép kiểm chạy đúng cả hai chiều. Cũng để ý hai chuỗi nằm trên hai dòng liên tiếp được trình biên dịch <em>nối lại</em> thành một chuỗi — đó là C chuẩn, không phải slide gõ nhầm.</p>
<p class="pitfall">⚠️ Đừng bao giờ bỏ qua phép kiểm <code>NULL</code> "vì tệp chắc chắn có ở đó". Nếu <code>fopen</code> hỏng mà bạn vẫn gọi <code>fscanf(fptr, …)</code> thì bạn truy cập qua một con trỏ null và chương trình sập mà không có thông báo nào hữu ích — còn trên máy chấm thi, ở cái thư mục mà người chấm chạy nó, tệp rất hay <em>không</em> có ở đó.</p>`],

    ]),
  ].join('\n'),
};
