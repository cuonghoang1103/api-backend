/**
 * PRF192 · Slot 02-04 "Basic Computation" — phần A, học theo từng slide (slide 1–22).
 * Deck 'prf2' (PRF2), 62 slide, ảnh đã render lên CDN images/academy/PRF192/v1/prf2/NNN.webp.
 * Nội dung bám ĐÚNG chữ trích từ file .pptx gốc của trường (/tmp/prf192-text/prf2.txt).
 *
 * Mọi phép tính trong phần giảng đều đã kiểm tay + kiểm máy:
 *   63 = 0011 1111 · 219 = 1101 1011 · 0111 0101 = 117 · 0011 1011 = 59
 *   -63 (bù 2, 1 byte) = 1100 0001 · -219 (bù 2 máy móc) = 0010 0101 (= +37 ⇒ TRÀN)
 *   1111 0101 = -11 · 1011 1011 = -69 · -92 = 1010 0100 · 1100 0011 = 195 (unsigned) / -61 (signed)
 *   2.345.678.901 > INT_MAX (2.147.483.647) ⇒ phải dùng long long / unsigned int.
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'prf2';

export default {
  title: '2.0a — Slide by slide: Variables, data types & how memory represents values (slides 1–22)|||2.0a — Slide bài giảng: Biến, kiểu dữ liệu & cách bộ nhớ biểu diễn giá trị (slide 1–22)',
  slug: 'prf192-2-0a-slides-bien-kieu-du-lieu',
  type: 'DOCUMENT',
  description: 'Hai mươi hai slide đầu của Slot 02-04 PRF192: biến là gì, kiểu dữ liệu quyết định điều gì, bốn kiểu số học char/int/float/double, các size specifier short/long/long long, từ khoá const, và cách phần cứng thật sự biểu diễn giá trị — nhị phân, bù 2 (two\u2019s complement), số nguyên không dấu, bảng mã ASCII và miền giá trị của từng kiểu. Ba bài Exercise 1, 2, 3 của trường được giải đầy đủ từng bước, kèm bẫy tràn số và bẫy chọn sai kiểu khi thi.',
  content: [
    walkHead(D, 1, 22),
    walk(D, [

      [1, 'Basic Computation — cover',
        `<p class="y-chinh">🎯 This deck (Slots 02–04) is where C stops being "print a greeting" and starts <strong>computing</strong>: putting data into memory, naming it, typing it, and operating on it.</p>
<ul>
<li><strong>What "basic computation" means here</strong> — the complete round trip a program makes with a number: read it in, store it in a typed box in RAM, combine it with operators into an expression, print the result out.</li>
<li><strong>Why it spans three slots</strong> — 62 slides, the biggest deck of PRF192. Slot 02 is variables and data types, Slot 03 is literals, constants and I/O, Slot 04 is expressions and operators. This lesson covers slides 1–22, the "what the machine actually stores" half.</li>
<li><strong>The chain you are about to learn</strong> — data → <em>type</em> → memory layout → operator → expression → result. Every later topic in the course (arrays, strings, pointers, files) is this chain repeated with bigger boxes.</li>
<li><strong>Why it carries so many exam marks</strong> — nearly every PE/FE question that "looks like a trick" is really a type question: integer division, overflow, a char compared to an int, a float printed with <code>%d</code>.</li>
</ul>
<p class="meo">💡 Keep one question in your head for the whole deck: <em>"where is this value, and how many bytes does it take?"</em> Slide 6 shows that those two questions are exactly what a variable declaration answers.</p>`,
        `<p class="y-chinh">🎯 Bộ slide này (Slot 02–04) là chỗ C thôi "in một câu chào" và bắt đầu <strong>tính toán</strong>: đưa dữ liệu vào bộ nhớ, đặt tên cho nó, gắn kiểu cho nó, rồi thao tác trên nó.</p>
<ul>
<li><strong>"Tính toán cơ bản" ở đây nghĩa là gì</strong> — trọn vòng đời của một con số trong chương trình: nhập vào, cất vào một ô có kiểu trong RAM, ghép với toán tử thành biểu thức, in kết quả ra.</li>
<li><strong>Vì sao trải ba slot</strong> — 62 slide, deck lớn nhất của PRF192. Slot 02 là biến và kiểu dữ liệu, Slot 03 là literal, hằng và nhập/xuất, Slot 04 là biểu thức và toán tử. Bài này đi slide 1–22, tức nửa "máy thật sự lưu cái gì".</li>
<li><strong>Chuỗi mắt xích sắp học</strong> — dữ liệu → <em>kiểu</em> → cách nằm trong bộ nhớ → toán tử → biểu thức → kết quả. Mọi chủ đề sau này (mảng, chuỗi, con trỏ, tệp) chỉ là đúng chuỗi này lặp lại với những cái hộp to hơn.</li>
<li><strong>Vì sao nó chiếm nhiều điểm thi</strong> — gần như mọi câu PE/FE "trông có vẻ đánh đố" thực chất là câu hỏi về kiểu: chia nguyên, tràn số, so char với int, in float bằng <code>%d</code>.</li>
</ul>
<p class="meo">💡 Giữ một câu hỏi trong đầu suốt cả deck: <em>"giá trị này nằm ở đâu, và nó chiếm mấy byte?"</em> Slide 6 sẽ cho thấy một dòng khai báo biến chính là câu trả lời cho đúng hai câu hỏi đó.</p>`],

      [2, 'Objectives',
        `<p class="y-chinh">🎯 Three learning outcomes: understand what a data type <em>is</em>, declare constants and variables, and express operations on data.</p>
<ul>
<li><strong>"Understand what is a data type"</strong> — not memorising "int = 4 bytes", but knowing that a type is a <em>contract</em>: it fixes how many bytes are reserved, how the bit pattern is interpreted, and which operations are legal.</li>
<li><strong>"Declare constants and variables"</strong> — writing <code>int n;</code>, <code>const double PI = 3.14159;</code>, <code>#define MAX 100</code> and knowing the difference between the three (slides 12, 36–38 of the deck).</li>
<li><strong>"Express operations on data"</strong> — arithmetic, relational, logical and bitwise operators, plus what happens when you mix types in one expression (the second half of this deck).</li>
<li><strong>How it is assessed</strong> — PE questions give you a short program and ask for the exact printed output; you cannot guess it without the type rules. Objectives 1 and 3 are inseparable in practice.</li>
</ul>
<p class="meo">💡 Turn each objective into a self-test sentence: "I can explain what a type is to someone who has never programmed." If you cannot, that objective is not done yet.</p>`,
        `<p class="y-chinh">🎯 Ba mục tiêu đầu ra: hiểu kiểu dữ liệu <em>là gì</em>, khai báo được hằng và biến, và diễn đạt được các phép toán trên dữ liệu.</p>
<ul>
<li><strong>"Hiểu kiểu dữ liệu là gì"</strong> — không phải thuộc lòng "int = 4 byte", mà là hiểu kiểu là một <em>bản giao kèo</em>: nó chốt cấp phát bao nhiêu byte, chuỗi bit đó được hiểu thế nào, và phép toán nào hợp lệ.</li>
<li><strong>"Khai báo hằng và biến"</strong> — viết được <code>int n;</code>, <code>const double PI = 3.14159;</code>, <code>#define MAX 100</code> và phân biệt được ba thứ đó (slide 12, 36–38 của deck).</li>
<li><strong>"Diễn đạt phép toán trên dữ liệu"</strong> — toán tử số học, quan hệ, logic, thao tác bit, cộng thêm chuyện gì xảy ra khi trộn nhiều kiểu trong một biểu thức (nửa sau của deck).</li>
<li><strong>Thi kiểu gì</strong> — đề PE cho một chương trình ngắn rồi hỏi output in ra chính xác là gì; không nắm luật kiểu thì không đoán nổi. Trên thực tế mục tiêu 1 và 3 dính liền nhau.</li>
</ul>
<p class="meo">💡 Biến mỗi mục tiêu thành một câu tự kiểm: "Tôi giải thích được kiểu dữ liệu là gì cho một người chưa từng lập trình." Nếu chưa nói được thì mục tiêu đó chưa xong.</p>`],

      [3, 'Contents — the map of Slots 02–04',
        `<p class="y-chinh">🎯 The deck has two big halves: <strong>how data is stored</strong> (variables, types, memory) and <strong>how data is combined</strong> (expressions, operators).</p>
<ul>
<li><strong>Half 1 — Variables and Data types</strong> — data types, integral types, floating-point types, declarations. This is slides 4–29; slides 4–22 are what this lesson covers.</li>
<li><strong>Half 1b — Basic Memory Operations</strong> — literals, constants, the assignment operator, output (<code>printf</code>) and input (<code>scanf</code>). Slides 30–44.</li>
<li><strong>Half 2 — Expressions</strong> — arithmetic, relational and logical operators, bit operators, shorthand assignment operators, mixing data types, casting and precedence. Slides 45–62.</li>
<li><strong>The order is not accidental</strong> — you cannot explain why <code>10/3</code> gives 3 but <code>10.0/3</code> gives 3.3333 until you know that <code>/</code> behaves differently for integral and floating-point types. Storage must come before operations.</li>
<li><strong>Where this lesson stops</strong> — slide 22, the table of value ranges. That is the natural seam: everything up to it is "what a bit pattern means", everything after it is "what you type into the editor".</li>
</ul>
<p class="meo">💡 Use this contents slide as a revision checklist before the PE — tick each line only when you can write a 5-line program demonstrating it.</p>`,
        `<p class="y-chinh">🎯 Deck chia làm hai nửa lớn: <strong>dữ liệu được lưu thế nào</strong> (biến, kiểu, bộ nhớ) và <strong>dữ liệu được ghép thế nào</strong> (biểu thức, toán tử).</p>
<ul>
<li><strong>Nửa 1 — Variables and Data types</strong> — kiểu dữ liệu, kiểu nguyên, kiểu dấu chấm động, khai báo. Đó là slide 4–29; bài này đi slide 4–22.</li>
<li><strong>Nửa 1b — Basic Memory Operations</strong> — literal, hằng, toán tử gán, xuất (<code>printf</code>) và nhập (<code>scanf</code>). Slide 30–44.</li>
<li><strong>Nửa 2 — Expressions</strong> — toán tử số học, quan hệ, logic, toán tử bit, toán tử gán rút gọn, trộn kiểu, ép kiểu và độ ưu tiên. Slide 45–62.</li>
<li><strong>Thứ tự này không ngẫu nhiên</strong> — bạn không thể giải thích vì sao <code>10/3</code> ra 3 còn <code>10.0/3</code> ra 3,3333 nếu chưa biết <code>/</code> hành xử khác nhau với kiểu nguyên và kiểu thực. Phải học lưu trữ trước phép toán.</li>
<li><strong>Bài này dừng ở đâu</strong> — slide 22, bảng miền giá trị. Đó là đường nối tự nhiên: trước nó là "một dãy bit nghĩa là gì", sau nó là "bạn gõ gì vào trình soạn thảo".</li>
</ul>
<p class="meo">💡 Dùng slide mục lục này làm danh sách ôn trước PE — chỉ tick một dòng khi bạn viết được một chương trình 5 dòng minh hoạ nó.</p>`],

      [4, 'Section: Variables and Data types',
        `<p class="y-chinh">🎯 Section divider — the next 25 slides answer one question: <strong>what exactly happens in the machine when you write <code>int n;</code></strong>?</p>
<ul>
<li><strong>Three things a declaration does</strong> — it reserves bytes in memory, it binds a name to the address of those bytes, and it records a type so the compiler knows how to read and write them.</li>
<li><strong>Why C forces you to declare</strong> — C is a <em>statically typed</em> language: types are fixed at compile time, not discovered at run time. This is what makes C fast and what makes type errors compile errors.</li>
<li><strong>The two words to keep apart</strong> — a <em>variable</em> is a named box (it can change), a <em>data type</em> is the shape of the box (it never changes once declared).</li>
<li><strong>Preview of the flow</strong> — slides 5–6 build the memory picture, 7–11 list the types, 12 adds <code>const</code>, 13–20 show how bits actually encode numbers and characters, 21–22 test it.</li>
</ul>
<p class="meo">💡 Every time you meet a new type in C later (<code>struct</code>, arrays, pointers), ask the same two questions from slide 6: <em>where</em>, and <em>how many bytes</em>. The answers always exist.</p>`,
        `<p class="y-chinh">🎯 Slide phân đoạn — 25 slide tiếp theo trả lời đúng một câu hỏi: <strong>khi bạn viết <code>int n;</code> thì trong máy thật sự xảy ra chuyện gì</strong>?</p>
<ul>
<li><strong>Một dòng khai báo làm ba việc</strong> — nó giữ chỗ một số byte trong bộ nhớ, gắn một cái tên vào địa chỉ của chỗ đó, và ghi lại một kiểu để trình biên dịch biết đọc/ghi chỗ đó ra sao.</li>
<li><strong>Vì sao C bắt khai báo</strong> — C là ngôn ngữ <em>định kiểu tĩnh</em>: kiểu được chốt lúc biên dịch, không phải phát hiện lúc chạy. Chính điều này làm C nhanh, và làm lỗi kiểu trở thành lỗi biên dịch.</li>
<li><strong>Hai từ phải tách bạch</strong> — <em>biến</em> là cái hộp có tên (nội dung đổi được), <em>kiểu dữ liệu</em> là hình dạng cái hộp (khai báo xong là không đổi).</li>
<li><strong>Xem trước mạch bài</strong> — slide 5–6 dựng bức tranh bộ nhớ, 7–11 liệt kê các kiểu, 12 thêm <code>const</code>, 13–20 chỉ ra bit mã hoá số và ký tự thế nào, 21–22 kiểm tra lại.</li>
</ul>
<p class="meo">💡 Mỗi lần gặp một kiểu mới trong C về sau (<code>struct</code>, mảng, con trỏ), hãy hỏi đúng hai câu của slide 6: <em>ở đâu</em>, và <em>mấy byte</em>. Bao giờ cũng có câu trả lời.</p>`],

      [5, 'Introduction — instructions, data, constants and variables',
        `<p class="y-chinh">🎯 An <strong>instruction</strong> is a task hardware performs <em>on data</em>; data lives in RAM and comes in exactly two flavours — constants and variables.</p>
<ul>
<li><strong>Instruction = verb, data = noun</strong> — "add", "compare", "copy" are instructions; the numbers they act on are the data. A program is a sequence of instructions plus the data they touch.</li>
<li><strong>Constants</strong> — fixed values that <em>cannot</em> be changed while the program runs. <code>3.14159</code> written in your source, or a <code>const</code> variable. The compiler can bake them straight into the executable.</li>
<li><strong>Variables</strong> — values that <em>can</em> change while the program runs. They must occupy a real, writable memory cell because the program will overwrite them.</li>
<li><strong>Data must be stored in main memory (RAM)</strong> — the CPU cannot compute on something that is not addressable. This is why "declare it first" is not bureaucracy: nothing can be read or written before the space exists.</li>
<li><strong>Two basic operations: READ and WRITE</strong> — read = get the value, write = set the value. Everything else in this deck is one of these two wrapped in syntax: <code>x = 5;</code> is a write, <code>printf("%d", x);</code> is a read.</li>
<li><strong>Numerical data can participate in expressions</strong> — only numbers (and characters, which are small numbers — slide 19) can be fed to the ALU. That is why C has no built-in "add two strings".</li>
</ul>
<p class="meo">💡 If you can classify any value in a program as "constant or variable" and "read or write", you already have the mental model the whole slot is built on.</p>`,
        `<p class="y-chinh">🎯 <strong>Lệnh (instruction)</strong> là một việc phần cứng thực hiện <em>trên dữ liệu</em>; dữ liệu nằm trong RAM và chỉ có đúng hai loại — hằng và biến.</p>
<ul>
<li><strong>Lệnh = động từ, dữ liệu = danh từ</strong> — "cộng", "so sánh", "sao chép" là lệnh; các con số mà chúng tác động lên là dữ liệu. Chương trình là một dãy lệnh cộng với dữ liệu mà chúng đụng tới.</li>
<li><strong>Hằng (constants)</strong> — giá trị cố định, <em>không</em> đổi được trong lúc chương trình chạy. Ví dụ <code>3.14159</code> viết thẳng trong mã nguồn, hoặc một biến <code>const</code>. Trình biên dịch có thể nhúng thẳng chúng vào file thực thi.</li>
<li><strong>Biến (variables)</strong> — giá trị <em>đổi được</em> trong lúc chạy. Chúng buộc phải chiếm một ô nhớ thật, ghi được, vì chương trình sẽ ghi đè lên.</li>
<li><strong>Dữ liệu phải nằm trong bộ nhớ chính (RAM)</strong> — CPU không tính được trên thứ không có địa chỉ. Đây là lý do "phải khai báo trước" không phải thủ tục hành chính: chưa có chỗ thì không đọc/ghi được gì.</li>
<li><strong>Hai thao tác cơ bản: ĐỌC và GHI</strong> — đọc = lấy giá trị ra, ghi = đặt giá trị vào. Mọi thứ còn lại trong deck chỉ là hai việc này khoác cú pháp: <code>x = 5;</code> là ghi, <code>printf("%d", x);</code> là đọc.</li>
<li><strong>Dữ liệu số tham gia được vào biểu thức</strong> — chỉ số (và ký tự, vốn cũng là số nhỏ — slide 19) mới đưa vào ALU được. Đó là lý do C không có sẵn phép "cộng hai chuỗi".</li>
</ul>
<p class="meo">💡 Nếu bạn phân loại được mọi giá trị trong chương trình thành "hằng hay biến" và "đọc hay ghi", bạn đã có đúng mô hình tư duy mà cả slot này dựng lên.</p>`],

      [6, 'Variables — a name referencing a memory location',
        `<p class="y-chinh">🎯 A variable is a <strong>name that refers to a memory address</strong>; the cell holds raw binary, and the two questions a declaration answers are <em>where?</em> (address) and <em>how many bytes?</em> (data type).</p>
<ul>
<li><strong>The memory picture on the slide</strong> — three named cells <code>a</code>, <code>b</code>, <code>c</code> stacked in RAM, one holding <code>0000 1001</code> and another <code>1100 0011</code>. The names are for you; the machine only knows addresses.</li>
<li><strong>The bits mean nothing by themselves</strong> — <code>0000 1001</code> is 9 as an unsigned byte and also 9 as a signed byte. But <code>1100 0011</code> is <strong>195</strong> read as <code>unsigned char</code> and <strong>−61</strong> read as signed <code>char</code>. Same bits, two answers: the <em>type</em> picks the answer.</li>
<li><strong>Two basic operations: set value, get value</strong> — exactly the WRITE and READ of slide 5, now with a name attached so you never have to type an address.</li>
<li><strong>"When the program is compiled, the compiler will determine the position"</strong> — you never choose the address; the compiler allocates it. That is why printing <code>&amp;n</code> gives a different number on each run on a modern OS.</li>
<li><strong>Question 1 — "Where is it?" → its address</strong> — obtained with the <code>&amp;</code> operator, e.g. <code>printf("%p", (void*)&amp;a);</code>. Slide 28 of the deck uses this.</li>
<li><strong>Question 2 — "How many bytes?" → the data type</strong> — obtained with <code>sizeof</code>, e.g. <code>sizeof(int)</code> → 4 in a 32/64-bit environment.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    char a = 9;          /* 0000 1001 */
    char b = (char)195;  /* 1100 0011 -&gt; prints -61 as signed char */
    printf("a = %d, size = %zu byte\\n", a, sizeof(a));
    printf("b = %d, size = %zu byte\\n", b, sizeof(b));
    return 0;
}</code></pre>
<p class="pitfall">⚠️ Exam trap: "a variable <em>is</em> a memory cell". Not quite — the variable is the <em>name</em>; the cell is what the name refers to. That distinction is what makes pointers (Slot 10) understandable later.</p>`,
        `<p class="y-chinh">🎯 Biến là một <strong>cái tên trỏ tới một địa chỉ bộ nhớ</strong>; ô nhớ chứa nhị phân thô, và một dòng khai báo trả lời đúng hai câu: <em>ở đâu?</em> (địa chỉ) và <em>mấy byte?</em> (kiểu dữ liệu).</p>
<ul>
<li><strong>Bức tranh bộ nhớ trên slide</strong> — ba ô có tên <code>a</code>, <code>b</code>, <code>c</code> xếp chồng trong RAM, một ô chứa <code>0000 1001</code>, ô kia chứa <code>1100 0011</code>. Tên là để cho bạn; máy chỉ biết địa chỉ.</li>
<li><strong>Bản thân các bit không có nghĩa</strong> — <code>0000 1001</code> là 9 nếu đọc kiểu không dấu, cũng là 9 nếu đọc kiểu có dấu. Nhưng <code>1100 0011</code> là <strong>195</strong> khi đọc bằng <code>unsigned char</code> và là <strong>−61</strong> khi đọc bằng <code>char</code> có dấu. Cùng một dãy bit, hai đáp số: <em>kiểu</em> mới chọn đáp số.</li>
<li><strong>Hai thao tác cơ bản: đặt giá trị, lấy giá trị</strong> — đúng là GHI và ĐỌC ở slide 5, nay đã có cái tên kèm theo nên bạn không bao giờ phải gõ địa chỉ.</li>
<li><strong>"Khi biên dịch, trình biên dịch sẽ quyết định vị trí"</strong> — bạn không bao giờ chọn địa chỉ; trình biên dịch cấp phát. Đó là lý do in <code>&amp;n</code> ra số khác nhau ở mỗi lần chạy trên hệ điều hành hiện đại.</li>
<li><strong>Câu hỏi 1 — "Nó ở đâu?" → địa chỉ</strong> — lấy bằng toán tử <code>&amp;</code>, ví dụ <code>printf("%p", (void*)&amp;a);</code>. Slide 28 của deck dùng đúng cái này.</li>
<li><strong>Câu hỏi 2 — "Mấy byte?" → kiểu dữ liệu</strong> — lấy bằng <code>sizeof</code>, ví dụ <code>sizeof(int)</code> → 4 trên môi trường 32/64-bit.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    char a = 9;          /* 0000 1001 */
    char b = (char)195;  /* 1100 0011 -&gt; in ra -61 vi char co dau */
    printf("a = %d, size = %zu byte\\n", a, sizeof(a));
    printf("b = %d, size = %zu byte\\n", b, sizeof(b));
    return 0;
}</code></pre>
<p class="pitfall">⚠️ Bẫy thi: "biến <em>chính là</em> ô nhớ". Không hẳn — biến là cái <em>tên</em>; ô nhớ là thứ mà tên đó trỏ tới. Chính chỗ phân biệt này làm con trỏ (Slot 10) về sau trở nên dễ hiểu.</p>`],

      [7, 'Data Types',
        `<p class="y-chinh">🎯 C associates a data type with <em>every</em> variable; each type occupies a compiler-defined number of bytes and defines both <strong>how values are stored</strong> and <strong>how operations on them are performed</strong>.</p>
<ul>
<li><strong>Two halves of the definition</strong> — storage (the bit layout and the byte count) and behaviour (which machine instruction runs for <code>+</code>, <code>/</code>, <code>&lt;</code>). A type is not just a size.</li>
<li><strong>Why "how operations are performed" matters</strong> — <code>10/3</code> is 3 while <code>10.0/3</code> is 3.3333 because integer division and floating-point division are two <em>different hardware operations</em> selected by the operand types (slide 47 of the deck).</li>
<li><strong>"Compiler-defined number of bytes"</strong> — the C standard fixes <em>minimums</em>, not exact sizes. <code>int</code> is 4 bytes on nearly every modern desktop compiler but was 2 bytes on 16-bit DOS. Never hard-code the number; ask <code>sizeof</code>.</li>
<li><strong>"Typed languages defined some primitive data types"</strong> — the built-in types are the atoms. Everything you build later (arrays, structs) is a composition of these atoms, so their rules propagate upward.</li>
<li><strong>The practical consequence</strong> — choosing a type is a design decision with three costs: memory used, range available, and precision kept. Exercise 3 on slide 21 is exactly this decision, six times over.</li>
</ul>
<p class="meo">💡 Read a declaration out loud as a sentence: <code>double x;</code> = "reserve 8 bytes, interpret them as an IEEE-754 double, and use floating-point instructions on x". The declaration is the contract.</p>`,
        `<p class="y-chinh">🎯 C gắn một kiểu dữ liệu cho <em>mọi</em> biến; mỗi kiểu chiếm một số byte do trình biên dịch quy định và xác định cả <strong>cách giá trị được lưu</strong> lẫn <strong>cách phép toán trên nó được thực hiện</strong>.</p>
<ul>
<li><strong>Hai nửa của định nghĩa</strong> — lưu trữ (cách xếp bit và số byte) và hành vi (lệnh máy nào chạy cho <code>+</code>, <code>/</code>, <code>&lt;</code>). Kiểu không phải chỉ là kích thước.</li>
<li><strong>Vì sao vế "cách thực hiện phép toán" quan trọng</strong> — <code>10/3</code> ra 3 còn <code>10.0/3</code> ra 3,3333 vì chia nguyên và chia thực là <em>hai lệnh phần cứng khác nhau</em>, được chọn theo kiểu của toán hạng (slide 47 của deck).</li>
<li><strong>"Số byte do trình biên dịch quy định"</strong> — chuẩn C chỉ chốt <em>mức tối thiểu</em>, không chốt kích thước chính xác. <code>int</code> là 4 byte trên gần như mọi trình biên dịch desktop hiện đại, nhưng từng là 2 byte trên DOS 16-bit. Đừng gõ cứng con số; hãy hỏi <code>sizeof</code>.</li>
<li><strong>"Ngôn ngữ có kiểu định nghĩa sẵn vài kiểu nguyên thuỷ"</strong> — các kiểu dựng sẵn là nguyên tử. Mọi thứ bạn dựng sau này (mảng, struct) đều là tổ hợp của các nguyên tử đó, nên luật của chúng lan lên trên.</li>
<li><strong>Hệ quả thực tế</strong> — chọn kiểu là một quyết định thiết kế với ba cái giá: bộ nhớ tốn, miền giá trị có được, độ chính xác giữ được. Exercise 3 ở slide 21 chính là quyết định này, lặp sáu lần.</li>
</ul>
<p class="meo">💡 Hãy đọc một dòng khai báo thành câu: <code>double x;</code> = "giữ 8 byte, hiểu chúng theo IEEE-754 double, và dùng lệnh dấu chấm động cho x". Dòng khai báo chính là bản giao kèo.</p>`],

      [8, 'Arithmetic Types — char and int',
        `<p class="y-chinh">🎯 The four arithmetic types of C are <code>char</code>, <code>int</code>, <code>float</code>, <code>double</code>. This slide covers the two <em>integral</em> ones: <code>char</code> (one byte) and <code>int</code> (one word, 4 bytes in a 32-bit environment).</p>
<ul>
<li><strong><code>char</code> — one byte</strong> — "can store a small integer value, a single character or a single symbol". All three descriptions are the same thing: a byte holding a number from −128 to 127 (signed) which you may <em>choose</em> to read as an ASCII symbol.</li>
<li><strong><code>int</code> — one word</strong> — a "word" is the CPU's natural operand size. In a 32-bit environment that is 4 bytes, giving −2 147 483 648 … 2 147 483 647. It is the default, fastest integer type.</li>
<li><strong>Why <code>int</code> is the default for everything countable</strong> — loop counters, array indices, quantities. If you have no reason to pick something else, pick <code>int</code>; the hardware is built around it.</li>
<li><strong>The word "arithmetic" is the point</strong> — these four types can go into the ALU. <code>char</code> qualifying as arithmetic is exactly why <code>'A' + 1</code> is legal C and equals 66 (slide 19).</li>
<li><strong>Bytes vs range, quickly</strong> — 1 byte = 8 bits = 2⁸ = 256 distinct patterns; split around zero that is −128…127. 4 bytes = 32 bits = 2³² ≈ 4.29 billion patterns, i.e. roughly ±2.1 billion.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    char  grade = 'A';   /* 1 byte, ASCII 65   */
    int   count = 10000; /* 4 bytes            */
    printf("%c has code %d\\n", grade, grade);
    printf("char = %zu byte, int = %zu byte\\n", sizeof(char), sizeof(int));
    return 0;
}</code></pre>
<p class="pitfall">⚠️ <code>sizeof(char)</code> is <strong>1 by definition</strong> in C — always, on every machine. But whether plain <code>char</code> is signed or unsigned is implementation-defined; write <code>signed char</code> / <code>unsigned char</code> when the sign actually matters.</p>`,
        `<p class="y-chinh">🎯 Bốn kiểu số học của C là <code>char</code>, <code>int</code>, <code>float</code>, <code>double</code>. Slide này nói hai kiểu <em>nguyên</em>: <code>char</code> (một byte) và <code>int</code> (một từ máy, 4 byte trên môi trường 32-bit).</p>
<ul>
<li><strong><code>char</code> — một byte</strong> — "chứa được một số nguyên nhỏ, một ký tự đơn hoặc một ký hiệu đơn". Cả ba mô tả đó là cùng một thứ: một byte giữ một con số từ −128 đến 127 (có dấu) mà bạn có thể <em>chọn</em> đọc như một ký hiệu ASCII.</li>
<li><strong><code>int</code> — một từ máy</strong> — "từ" (word) là cỡ toán hạng tự nhiên của CPU. Trên môi trường 32-bit đó là 4 byte, cho miền −2.147.483.648 … 2.147.483.647. Đây là kiểu nguyên mặc định và nhanh nhất.</li>
<li><strong>Vì sao <code>int</code> là mặc định cho mọi thứ đếm được</strong> — biến đếm vòng lặp, chỉ số mảng, số lượng. Không có lý do gì đặc biệt thì cứ chọn <code>int</code>; phần cứng được dựng quanh nó.</li>
<li><strong>Chữ "số học" (arithmetic) mới là điểm mấu chốt</strong> — bốn kiểu này đưa vào ALU được. Việc <code>char</code> được xếp vào kiểu số học chính là lý do <code>'A' + 1</code> là C hợp lệ và bằng 66 (slide 19).</li>
<li><strong>Byte và miền giá trị, tính nhanh</strong> — 1 byte = 8 bit = 2⁸ = 256 mẫu bit khác nhau; chia quanh số 0 thì ra −128…127. 4 byte = 32 bit = 2³² ≈ 4,29 tỉ mẫu, tức khoảng ±2,1 tỉ.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    char  grade = 'A';   /* 1 byte, ma ASCII 65 */
    int   count = 10000; /* 4 byte              */
    printf("%c co ma %d\\n", grade, grade);
    printf("char = %zu byte, int = %zu byte\\n", sizeof(char), sizeof(int));
    return 0;
}</code></pre>
<p class="pitfall">⚠️ <code>sizeof(char)</code> <strong>luôn bằng 1 theo định nghĩa</strong> của C — trên mọi máy. Nhưng <code>char</code> trần là có dấu hay không dấu thì tuỳ trình biên dịch; khi dấu thật sự quan trọng thì hãy viết rõ <code>signed char</code> / <code>unsigned char</code>.</p>`],

      [9, 'Arithmetic Types (cont.) — float and double',
        `<p class="y-chinh">🎯 The two <em>floating-point</em> types: <code>float</code> typically 4 bytes (single precision) and <code>double</code> typically 8 bytes (double precision).</p>
<ul>
<li><strong>"Precision", not "range", is the difference you feel</strong> — <code>float</code> keeps about <strong>7</strong> significant decimal digits, <code>double</code> about <strong>15–16</strong>. Both reach huge magnitudes (≈3.4×10³⁸ and ≈1.8×10³⁰⁸), but only <code>double</code> keeps a long number faithful.</li>
<li><strong>How the 4 bytes are split (IEEE-754)</strong> — <code>float</code> = 1 sign bit + 8 exponent bits + 23 fraction bits. <code>double</code> = 1 + 11 + 52. The exponent buys range; the fraction buys precision.</li>
<li><strong>Why floating-point is stored so differently from integers</strong> — scientific notation in binary: value = ±1.fraction × 2^exponent. That is what "floating" means — the binary point moves according to the exponent.</li>
<li><strong>Which one to use</strong> — <code>double</code> by default. It is the type of every un-suffixed real literal in C (slide 35), the return type of <code>&lt;math.h&gt;</code> functions, and the type <code>scanf("%lf")</code> expects. Use <code>float</code> only when memory really matters.</li>
<li><strong>The consequence students meet first</strong> — <code>0.1 + 0.2 == 0.3</code> is <strong>false</strong> in C, because 0.1 has no exact binary representation, exactly as 1/3 has no exact decimal one. Compare reals with <code>fabs(a-b) &lt; 1e-9</code>, never with <code>==</code>.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    float  f = 123456789.0f;   /* only ~7 digits survive */
    double d = 123456789.0;
    printf("float  : %.1f\\n", f);   /* 123456792.0 - already wrong */
    printf("double : %.1f\\n", d);   /* 123456789.0 - exact         */
    return 0;
}</code></pre>
<p class="pitfall">⚠️ Format specifiers are not interchangeable: <code>printf</code> uses <code>%f</code> for both float and double, but <code>scanf</code> needs <code>%f</code> for <code>float</code> and <strong><code>%lf</code> for <code>double</code></strong>. Getting this wrong silently reads garbage.</p>`,
        `<p class="y-chinh">🎯 Hai kiểu <em>dấu chấm động</em>: <code>float</code> thường 4 byte (độ chính xác đơn) và <code>double</code> thường 8 byte (độ chính xác kép).</p>
<ul>
<li><strong>Khác biệt bạn cảm nhận được là "độ chính xác", không phải "miền giá trị"</strong> — <code>float</code> giữ khoảng <strong>7</strong> chữ số thập phân có nghĩa, <code>double</code> khoảng <strong>15–16</strong>. Cả hai đều với tới độ lớn khổng lồ (≈3,4×10³⁸ và ≈1,8×10³⁰⁸), nhưng chỉ <code>double</code> giữ được một con số dài một cách trung thực.</li>
<li><strong>4 byte được chia thế nào (IEEE-754)</strong> — <code>float</code> = 1 bit dấu + 8 bit mũ + 23 bit phần định trị. <code>double</code> = 1 + 11 + 52. Bit mũ mua miền giá trị; bit định trị mua độ chính xác.</li>
<li><strong>Vì sao số thực được lưu khác hẳn số nguyên</strong> — là ký hiệu khoa học trong hệ nhị phân: giá trị = ±1,phần_định_trị × 2^mũ. "Floating" (chấm động) chính là nghĩa đó — dấu chấm nhị phân dịch chuyển theo số mũ.</li>
<li><strong>Nên dùng cái nào</strong> — mặc định là <code>double</code>. Nó là kiểu của mọi literal số thực không có hậu tố trong C (slide 35), là kiểu trả về của các hàm <code>&lt;math.h&gt;</code>, và là kiểu mà <code>scanf("%lf")</code> chờ đợi. Chỉ dùng <code>float</code> khi bộ nhớ thật sự đáng lo.</li>
<li><strong>Hệ quả sinh viên gặp sớm nhất</strong> — <code>0.1 + 0.2 == 0.3</code> cho kết quả <strong>sai</strong> trong C, vì 0,1 không biểu diễn chính xác được trong nhị phân, y như 1/3 không viết chính xác được trong hệ thập phân. So sánh số thực bằng <code>fabs(a-b) &lt; 1e-9</code>, đừng bao giờ dùng <code>==</code>.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    float  f = 123456789.0f;   /* chi ~7 chu so song sot */
    double d = 123456789.0;
    printf("float  : %.1f\\n", f);   /* 123456792.0 - da sai */
    printf("double : %.1f\\n", d);   /* 123456789.0 - dung   */
    return 0;
}</code></pre>
<p class="pitfall">⚠️ Đặc tả định dạng không dùng lẫn được: <code>printf</code> dùng <code>%f</code> cho cả float lẫn double, nhưng <code>scanf</code> cần <code>%f</code> cho <code>float</code> và <strong><code>%lf</code> cho <code>double</code></strong>. Nhầm chỗ này là đọc vào rác mà không báo lỗi gì.</p>`],

      [10, 'int Type Size Specifiers — short, long, long long',
        `<p class="y-chinh">🎯 Size specifiers guarantee an <code>int</code> contains a <strong>minimum</strong> number of bits: <code>short</code> ≥ 16, <code>long</code> ≥ 32, <code>long long</code> ≥ 64.</p>
<ul>
<li><strong>Read "at least", not "exactly"</strong> — the standard sets a floor, never a ceiling. On 64-bit Linux <code>long</code> is 8 bytes; on 64-bit Windows it is still 4. Portable code asks <code>sizeof</code> or uses <code>&lt;stdint.h&gt;</code> types like <code>int32_t</code>.</li>
<li><strong><code>short</code> — at least 16 bits</strong> — range at 16 bits is −32 768 … 32 767. Useful only when you store millions of small values; for a single counter the memory saved is meaningless.</li>
<li><strong><code>long</code> — at least 32 bits</strong> — historically the "bigger int". On most modern compilers it is the same size as <code>int</code>, which is why it buys you nothing on Windows.</li>
<li><strong><code>long long</code> — at least 64 bits</strong> — range roughly ±9.22×10¹⁸. This is the type you reach for when a value exceeds ±2.1 billion, e.g. the 10-digit book ID in Exercise 3 (slide 21).</li>
<li><strong>The slide's note on <code>long double</code></strong> — Standard C specifies no minimum bit count for it, only that it is <em>no fewer bits than a <code>double</code></em>. That is a deliberately weak guarantee, expanded on slide 11.</li>
<li><strong>They are qualifiers, not new types</strong> — <code>short</code> alone means <code>short int</code>, <code>long long</code> alone means <code>long long int</code>. The word <code>int</code> is optional.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    short     s = 32767;
    long      l = 2147483647L;
    long long b = 9223372036854775807LL;
    printf("short=%zu long=%zu longlong=%zu byte\\n",
           sizeof(s), sizeof(l), sizeof(b));
    printf("%hd %ld %lld\\n", s, l, b);
    return 0;
}</code></pre>
<p class="pitfall">⚠️ The specifier changes the <code>printf</code> conversion too: <code>%hd</code> for short, <code>%ld</code> for long, <code>%lld</code> for long long. Printing a <code>long long</code> with plain <code>%d</code> is undefined behaviour and usually prints garbage.</p>`,
        `<p class="y-chinh">🎯 Size specifier bảo đảm một <code>int</code> chứa <strong>tối thiểu</strong> bấy nhiêu bit: <code>short</code> ≥ 16, <code>long</code> ≥ 32, <code>long long</code> ≥ 64.</p>
<ul>
<li><strong>Đọc là "ít nhất", không phải "đúng bằng"</strong> — chuẩn đặt sàn, không đặt trần. Trên Linux 64-bit <code>long</code> là 8 byte; trên Windows 64-bit vẫn là 4. Mã khả chuyển thì hỏi <code>sizeof</code> hoặc dùng kiểu của <code>&lt;stdint.h&gt;</code> như <code>int32_t</code>.</li>
<li><strong><code>short</code> — ít nhất 16 bit</strong> — miền ở 16 bit là −32.768 … 32.767. Chỉ hữu ích khi lưu hàng triệu giá trị nhỏ; với một biến đếm đơn lẻ thì lượng bộ nhớ tiết kiệm được là vô nghĩa.</li>
<li><strong><code>long</code> — ít nhất 32 bit</strong> — trong lịch sử là "int to hơn". Trên hầu hết trình biên dịch hiện đại nó bằng đúng <code>int</code>, nên trên Windows nó chẳng mua thêm gì cả.</li>
<li><strong><code>long long</code> — ít nhất 64 bit</strong> — miền khoảng ±9,22×10¹⁸. Đây là kiểu phải với tới khi giá trị vượt ±2,1 tỉ, ví dụ mã sách 10 chữ số ở Exercise 3 (slide 21).</li>
<li><strong>Ghi chú của slide về <code>long double</code></strong> — chuẩn C không quy định số bit tối thiểu cho nó, chỉ nói nó <em>không ít bit hơn một <code>double</code></em>. Đó là một bảo đảm cố tình để yếu, slide 11 nói kỹ hơn.</li>
<li><strong>Chúng là bổ ngữ, không phải kiểu mới</strong> — <code>short</code> đứng một mình nghĩa là <code>short int</code>, <code>long long</code> đứng một mình nghĩa là <code>long long int</code>. Chữ <code>int</code> có thể lược.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    short     s = 32767;
    long      l = 2147483647L;
    long long b = 9223372036854775807LL;
    printf("short=%zu long=%zu longlong=%zu byte\\n",
           sizeof(s), sizeof(l), sizeof(b));
    printf("%hd %ld %lld\\n", s, l, b);
    return 0;
}</code></pre>
<p class="pitfall">⚠️ Đổi specifier là đổi luôn ký tự định dạng của <code>printf</code>: <code>%hd</code> cho short, <code>%ld</code> cho long, <code>%lld</code> cho long long. In một <code>long long</code> bằng <code>%d</code> trần là hành vi không xác định và thường in ra rác.</p>`],

      [11, 'double Type Size Specifier — long double',
        `<p class="y-chinh">🎯 <code>long double</code> only guarantees <strong>at least as many bits as a <code>double</code></strong>; its real size depends entirely on the environment and is typically at least 64 bits.</p>
<ul>
<li><strong>The weakest guarantee in the type system</strong> — unlike <code>short</code>/<code>long</code>/<code>long long</code>, which have explicit bit floors, <code>long double</code> is only defined <em>relative</em> to <code>double</code>. It is legal for a compiler to make it identical to <code>double</code>.</li>
<li><strong>What you actually get in practice</strong> — 8 bytes on MSVC (same as double, zero extra precision); 16 bytes on x86-64 gcc/clang, of which 80 bits are used (the old x87 extended format) for about 18–19 significant digits.</li>
<li><strong>When it is worth using</strong> — long numerical chains where rounding error accumulates: iterative solvers, financial aggregation over millions of rows. For coursework and PE exercises, <code>double</code> is always enough.</li>
<li><strong>Its own format specifiers</strong> — <code>%Lf</code> in <code>printf</code> and <code>%Lf</code> in <code>scanf</code>, and literals need the <code>L</code> suffix: <code>3.14159265358979L</code>. Forget the <code>L</code> and the literal is computed as a plain <code>double</code> first, throwing away the precision you were trying to gain.</li>
<li><strong>The generalisable lesson</strong> — C's type sizes are a <em>contract with minimums</em>, not fixed numbers. Any program that assumes exact sizes breaks when moved to another compiler; that is what portability means in this course.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    long double x = 1.0L / 3.0L;      /* note both L suffixes */
    printf("long double = %zu byte\\n", sizeof(long double));
    printf("1/3 = %.20Lf\\n", x);
    return 0;
}</code></pre>
<p class="meo">💡 Remember the ladder of guaranteed precision: <code>float</code> ≤ <code>double</code> ≤ <code>long double</code>. The relation is "no worse than", never "strictly better".</p>`,
        `<p class="y-chinh">🎯 <code>long double</code> chỉ bảo đảm <strong>có ít nhất bằng số bit của một <code>double</code></strong>; kích thước thật hoàn toàn phụ thuộc môi trường, thường ít nhất 64 bit.</p>
<ul>
<li><strong>Bảo đảm yếu nhất trong hệ thống kiểu</strong> — khác <code>short</code>/<code>long</code>/<code>long long</code> vốn có sàn bit rõ ràng, <code>long double</code> chỉ được định nghĩa <em>tương đối</em> so với <code>double</code>. Một trình biên dịch làm nó y hệt <code>double</code> vẫn hợp chuẩn.</li>
<li><strong>Thực tế bạn nhận được gì</strong> — 8 byte trên MSVC (bằng double, không thêm độ chính xác nào); 16 byte trên gcc/clang x86-64, trong đó 80 bit được dùng (định dạng mở rộng x87 cũ) cho khoảng 18–19 chữ số có nghĩa.</li>
<li><strong>Khi nào đáng dùng</strong> — chuỗi tính toán dài mà sai số làm tròn tích luỹ: giải lặp, cộng dồn tài chính qua hàng triệu dòng. Với bài tập môn học và đề PE thì <code>double</code> luôn đủ.</li>
<li><strong>Nó có ký tự định dạng riêng</strong> — <code>%Lf</code> trong <code>printf</code> và <code>%Lf</code> trong <code>scanf</code>, còn literal phải có hậu tố <code>L</code>: <code>3.14159265358979L</code>. Quên chữ <code>L</code> thì literal được tính như <code>double</code> thường trước đã, vứt đi đúng cái độ chính xác bạn định giành lấy.</li>
<li><strong>Bài học tổng quát hơn</strong> — kích thước kiểu trong C là một <em>giao kèo có mức tối thiểu</em>, không phải con số cố định. Chương trình nào giả định kích thước chính xác thì chuyển sang trình biên dịch khác là vỡ; đó chính là nghĩa của "tính khả chuyển" trong môn này.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    long double x = 1.0L / 3.0L;      /* chu y ca hai hau to L */
    printf("long double = %zu byte\\n", sizeof(long double));
    printf("1/3 = %.20Lf\\n", x);
    return 0;
}</code></pre>
<p class="meo">💡 Nhớ cái thang độ chính xác được bảo đảm: <code>float</code> ≤ <code>double</code> ≤ <code>long double</code>. Quan hệ là "không tệ hơn", không bao giờ là "chắc chắn tốt hơn".</p>`],

      [12, 'const Qualifier',
        `<p class="y-chinh">🎯 Any type can be qualified with the keyword <code>const</code>; a <code>const</code>-qualified type is <strong>unmodifiable</strong>, and any instruction that tries to modify it is a <em>compiler error</em>.</p>
<ul>
<li><strong>Syntax</strong> — <code>const data_type name = value;</code> The initialiser is mandatory: since you can never assign to it later, a <code>const</code> without an initial value is useless (and an error if you then try to write to it).</li>
<li><strong>"The compiler will report an error"</strong> — this is the whole value of <code>const</code>. The mistake is caught at <em>compile time</em>, before the program ever runs, instead of producing a wrong number at run time.</li>
<li><strong>It is a promise, not a storage class</strong> — <code>const double PI = 3.14159;</code> still occupies 8 bytes in memory and still has an address. That is what distinguishes it from <code>#define</code> (slide 38), where no memory is allocated at all.</li>
<li><strong>Why it beats a magic number</strong> — <code>area = 3.14159 * r * r;</code> repeated ten times is ten chances to mistype a digit. <code>const double PI = 3.14159;</code> gives the value one name, one definition, one place to fix.</li>
<li><strong>It qualifies <em>any</em> type</strong> — <code>const int</code>, <code>const char</code>, <code>const double</code>, and later <code>const char *</code> for read-only strings. The rule never changes: whatever is <code>const</code> cannot appear on the left of <code>=</code>.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    const double PI   = 3.14159;
    const int    DAYS = 7;
    double r = 2.0;

    printf("area = %.4f\\n", PI * r * r);   /* 12.5664 - reading is fine */
    /* PI = 3.15;  &lt;-- compile error: assignment of read-only variable */
    printf("%d days\\n", DAYS);
    return 0;
}</code></pre>
<p class="pitfall">⚠️ <code>const</code> protects against <em>your own</em> accidental writes, not against every possible corruption — a wild pointer can still overwrite the bytes. It is a compile-time guard rail, not a hardware lock.</p>`,
        `<p class="y-chinh">🎯 Kiểu nào cũng gắn được từ khoá <code>const</code>; kiểu đã gắn <code>const</code> là <strong>không sửa được</strong>, và mọi lệnh cố sửa nó đều là <em>lỗi biên dịch</em>.</p>
<ul>
<li><strong>Cú pháp</strong> — <code>const kiểu tên = giá_trị;</code> Phần khởi tạo là bắt buộc: vì sau này không gán được nữa, một <code>const</code> không có giá trị ban đầu là vô dụng (và thành lỗi nếu bạn định ghi vào).</li>
<li><strong>"Trình biên dịch sẽ báo lỗi"</strong> — đây chính là toàn bộ giá trị của <code>const</code>. Cái sai bị bắt lúc <em>biên dịch</em>, trước khi chương trình kịp chạy, thay vì lặng lẽ cho ra một con số sai lúc chạy.</li>
<li><strong>Nó là một lời hứa, không phải lớp lưu trữ</strong> — <code>const double PI = 3.14159;</code> vẫn chiếm 8 byte trong bộ nhớ và vẫn có địa chỉ. Đó là chỗ khác với <code>#define</code> (slide 38), nơi không hề cấp phát bộ nhớ nào.</li>
<li><strong>Vì sao nó hơn số ma (magic number)</strong> — viết <code>area = 3.14159 * r * r;</code> mười lần là mười cơ hội gõ nhầm một chữ số. <code>const double PI = 3.14159;</code> cho giá trị đó một cái tên, một định nghĩa, một chỗ để sửa.</li>
<li><strong>Nó gắn được cho <em>mọi</em> kiểu</strong> — <code>const int</code>, <code>const char</code>, <code>const double</code>, và sau này <code>const char *</code> cho chuỗi chỉ đọc. Luật không đổi: cái gì đã <code>const</code> thì không được đứng bên trái dấu <code>=</code>.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    const double PI   = 3.14159;
    const int    DAYS = 7;
    double r = 2.0;

    printf("area = %.4f\\n", PI * r * r);   /* 12.5664 - doc thi duoc */
    /* PI = 3.15;  &lt;-- loi bien dich: gan vao bien chi doc */
    printf("%d ngay\\n", DAYS);
    return 0;
}</code></pre>
<p class="pitfall">⚠️ <code>const</code> chống lại việc <em>chính bạn</em> vô ý ghi đè, chứ không chống được mọi kiểu phá hoại — một con trỏ chạy loạn vẫn ghi đè lên số byte đó được. Nó là rào chắn lúc biên dịch, không phải khoá phần cứng.</p>`],

      [13, 'Representing Values — integral vs floating-point',
        `<p class="y-chinh">🎯 Hardware manufacturers <strong>distinguish integral types from floating-point types</strong> and represent them differently: <code>char</code> and <code>int</code> are integral; <code>float</code> and <code>double</code> are floating-point.</p>
<ul>
<li><strong>Two different encodings, on purpose</strong> — an integral value is a plain binary number (with two's complement for the sign, slide 15). A floating-point value is three fields glued together: sign, exponent, fraction. They are not compatible bit patterns.</li>
<li><strong>Proof that they are different</strong> — the bit pattern of the <code>int</code> 1 (<code>0000…0001</code>) read as a <code>float</code> is about 1.4×10⁻⁴⁵, not 1.0. This is why conversion between the two is a real instruction, not a relabelling (slide 59's explicit casting).</li>
<li><strong>Two different sets of circuits</strong> — integer ALU vs floating-point unit (FPU). That is the hardware reason <code>/</code> and <code>%</code> behave differently by type, and why <code>15.0 % 3</code> is an <strong>error</strong> in C: the FPU has no remainder instruction (slide 47).</li>
<li><strong>Which to choose</strong> — integral for anything countable and exact (quantities, indices, IDs, money in cents); floating-point for measurements and ratios that are inherently approximate.</li>
<li><strong>Where the deck goes next</strong> — slides 14–18 dig into the integral encoding (binary, two's complement, unsigned), slides 19–20 into characters. Floating-point internals are not examined in detail at this level; you need the <em>consequences</em> (precision, no <code>==</code>).</li>
</ul>
<p class="meo">💡 One sentence to carry forward: <em>integral types count, floating-point types measure</em>. Counting is exact; measuring always carries error.</p>`,
        `<p class="y-chinh">🎯 Nhà sản xuất phần cứng <strong>phân biệt kiểu nguyên với kiểu dấu chấm động</strong> và biểu diễn chúng khác nhau: <code>char</code> và <code>int</code> là kiểu nguyên; <code>float</code> và <code>double</code> là kiểu dấu chấm động.</p>
<ul>
<li><strong>Hai cách mã hoá khác nhau, có chủ đích</strong> — giá trị nguyên là một số nhị phân thuần (kèm bù 2 cho dấu, slide 15). Giá trị thực là ba trường dán lại: dấu, số mũ, phần định trị. Hai dãy bit đó không tương thích nhau.</li>
<li><strong>Bằng chứng chúng khác nhau</strong> — dãy bit của số <code>int</code> 1 (<code>0000…0001</code>) nếu đọc như <code>float</code> thì ra khoảng 1,4×10⁻⁴⁵, không phải 1,0. Đó là lý do chuyển đổi giữa hai loại là một lệnh máy thật, không phải việc dán nhãn lại (ép kiểu tường minh ở slide 59).</li>
<li><strong>Hai bộ mạch khác nhau</strong> — ALU số nguyên và khối dấu chấm động (FPU). Đó là lý do phần cứng khiến <code>/</code> và <code>%</code> hành xử khác nhau theo kiểu, và khiến <code>15.0 % 3</code> là <strong>LỖI</strong> trong C: FPU không có lệnh lấy dư (slide 47).</li>
<li><strong>Chọn cái nào</strong> — kiểu nguyên cho mọi thứ đếm được và chính xác (số lượng, chỉ số, mã định danh, tiền quy ra xu); kiểu thực cho các phép đo và tỉ lệ vốn dĩ đã là xấp xỉ.</li>
<li><strong>Deck đi tiếp tới đâu</strong> — slide 14–18 đào sâu cách mã hoá số nguyên (nhị phân, bù 2, không dấu), slide 19–20 nói về ký tự. Ruột của số thực không bị hỏi chi tiết ở mức này; bạn cần các <em>hệ quả</em> (độ chính xác, không dùng <code>==</code>).</li>
</ul>
<p class="meo">💡 Một câu mang theo: <em>kiểu nguyên để đếm, kiểu thực để đo</em>. Đếm thì chính xác; đo thì luôn kèm sai số.</p>`],

      [14, 'Exercise 1 — decimal ⇄ binary conversion',
        `<p class="y-chinh">🎯 Exercise 1: convert 63 and 219 to binary, and <code>0111 0101</code> and <code>0011 1011</code> back to decimal. Full worked solution below.</p>
<p class="nhan">Method — decimal → binary: divide by 2 repeatedly, keep every remainder, then read the remainders <strong>bottom to top</strong>.</p>
<ul>
<li><strong>63 → binary</strong> — 63÷2 = 31 r<strong>1</strong> · 31÷2 = 15 r<strong>1</strong> · 15÷2 = 7 r<strong>1</strong> · 7÷2 = 3 r<strong>1</strong> · 3÷2 = 1 r<strong>1</strong> · 1÷2 = 0 r<strong>1</strong>. Reading bottom-up: 111111, padded to a byte = <code>0011 1111</code>. Check: 32+16+8+4+2+1 = 63 ✓ (also 63 = 2⁶ − 1, so six 1-bits).</li>
<li><strong>219 → binary</strong> — 219÷2 = 109 r<strong>1</strong> · 109÷2 = 54 r<strong>1</strong> · 54÷2 = 27 r<strong>0</strong> · 27÷2 = 13 r<strong>1</strong> · 13÷2 = 6 r<strong>1</strong> · 6÷2 = 3 r<strong>0</strong> · 3÷2 = 1 r<strong>1</strong> · 1÷2 = 0 r<strong>1</strong>. Bottom-up: <code>1101 1011</code>. Check: 128+64+16+8+2+1 = 219 ✓.</li>
<li><strong><code>0111 0101</code> → decimal</strong> — place values 128·0 + 64·1 + 32·1 + 16·1 + 8·0 + 4·1 + 2·0 + 1·1 = 64+32+16+4+1 = <strong>117</strong>.</li>
<li><strong><code>0011 1011</code> → decimal</strong> — 128·0 + 64·0 + 32·1 + 16·1 + 8·1 + 4·0 + 2·1 + 1·1 = 32+16+8+2+1 = <strong>59</strong>.</li>
</ul>
<p class="dap-an">✅ Answers: 63 = <code>0011 1111</code> · 219 = <code>1101 1011</code> · <code>0111 0101</code> = 117 · <code>0011 1011</code> = 59.</p>
<p class="meo">💡 Memorise the eight place values left to right — 128 64 32 16 8 4 2 1 — and binary→decimal becomes pure addition. For the reverse direction, subtracting greedily (219−128=91, 91−64=27, 27−16=11, 11−8=3, 3−2=1, 1−1=0) is faster than dividing and gives the same bits.</p>
<p class="pitfall">⚠️ Two classic slips: reading the remainders <em>top to bottom</em> (gives the number reversed), and forgetting to pad to 8 bits. Always write the full byte — the padding zeros matter the moment you take a two's complement in Exercise 2.</p>`,
        `<p class="y-chinh">🎯 Exercise 1: đổi 63 và 219 sang nhị phân, và đổi <code>0111 0101</code>, <code>0011 1011</code> ngược về thập phân. Lời giải đầy đủ ở dưới.</p>
<p class="nhan">Phương pháp — thập phân → nhị phân: chia 2 liên tiếp, giữ lại mọi số dư, rồi đọc các số dư <strong>từ dưới lên</strong>.</p>
<ul>
<li><strong>63 → nhị phân</strong> — 63÷2 = 31 dư <strong>1</strong> · 31÷2 = 15 dư <strong>1</strong> · 15÷2 = 7 dư <strong>1</strong> · 7÷2 = 3 dư <strong>1</strong> · 3÷2 = 1 dư <strong>1</strong> · 1÷2 = 0 dư <strong>1</strong>. Đọc từ dưới lên: 111111, bù cho đủ một byte = <code>0011 1111</code>. Kiểm: 32+16+8+4+2+1 = 63 ✓ (63 = 2⁶ − 1 nên đúng sáu bit 1).</li>
<li><strong>219 → nhị phân</strong> — 219÷2 = 109 dư <strong>1</strong> · 109÷2 = 54 dư <strong>1</strong> · 54÷2 = 27 dư <strong>0</strong> · 27÷2 = 13 dư <strong>1</strong> · 13÷2 = 6 dư <strong>1</strong> · 6÷2 = 3 dư <strong>0</strong> · 3÷2 = 1 dư <strong>1</strong> · 1÷2 = 0 dư <strong>1</strong>. Đọc từ dưới lên: <code>1101 1011</code>. Kiểm: 128+64+16+8+2+1 = 219 ✓.</li>
<li><strong><code>0111 0101</code> → thập phân</strong> — theo trọng số 128·0 + 64·1 + 32·1 + 16·1 + 8·0 + 4·1 + 2·0 + 1·1 = 64+32+16+4+1 = <strong>117</strong>.</li>
<li><strong><code>0011 1011</code> → thập phân</strong> — 128·0 + 64·0 + 32·1 + 16·1 + 8·1 + 4·0 + 2·1 + 1·1 = 32+16+8+2+1 = <strong>59</strong>.</li>
</ul>
<p class="dap-an">✅ Đáp án: 63 = <code>0011 1111</code> · 219 = <code>1101 1011</code> · <code>0111 0101</code> = 117 · <code>0011 1011</code> = 59.</p>
<p class="meo">💡 Thuộc tám trọng số từ trái sang phải — 128 64 32 16 8 4 2 1 — thì đổi nhị phân sang thập phân chỉ còn là phép cộng. Chiều ngược lại, trừ tham lam (219−128=91, 91−64=27, 27−16=11, 11−8=3, 3−2=1, 1−1=0) nhanh hơn chia và cho đúng các bit đó.</p>
<p class="pitfall">⚠️ Hai lỗi kinh điển: đọc số dư <em>từ trên xuống</em> (ra số bị đảo ngược), và quên bù cho đủ 8 bit. Hãy luôn viết trọn một byte — mấy số 0 bù thêm sẽ có vai trò ngay khi bạn lấy bù 2 ở Exercise 2.</p>`],

      [15, 'Negative and Positive Values — encoding schemes',
        `<p class="y-chinh">🎯 Computers store negative integers with an <strong>encoding scheme</strong>; the three classical ones are two's complement, one's complement and sign magnitude, and all three represent <em>non-negative</em> integers identically.</p>
<ul>
<li><strong>Why a scheme is needed at all</strong> — memory holds only 0s and 1s. There is no physical minus sign, so "negative" must be encoded inside the bit pattern itself.</li>
<li><strong>Sign magnitude</strong> — the leftmost bit is the sign (0 = +, 1 = −) and the rest is the plain magnitude. Simple to read, but it has <em>two zeros</em> (<code>0000 0000</code> and <code>1000 0000</code>) and subtraction needs special-case logic.</li>
<li><strong>One's complement</strong> — negate by flipping every bit. Also has two zeros (<code>0000 0000</code> and <code>1111 1111</code>), and addition needs an "end-around carry" correction.</li>
<li><strong>Two's complement — the popular one</strong> — flip the bits (1-complement), <em>then add one</em>. One single zero, and the ordinary binary adder computes subtraction with no extra circuitry: a − b is literally a + (two's complement of b).</li>
<li><strong>"All of these schemes represent non-negative integers identically"</strong> — so everything you did in Exercise 1 stays valid. The schemes only disagree about the negative half.</li>
<li><strong>The recipe to memorise</strong> — <em>flip the bits, add one</em>. Two steps, applied to the byte of the positive magnitude. It is also its own inverse: applying it to a negative pattern gives back the positive magnitude.</li>
</ul>
<p class="meo">💡 Sanity check for any two's complement byte: the leading bit is the sign. <code>0xxx xxxx</code> is non-negative, <code>1xxx xxxx</code> is negative — before you compute anything, you already know the sign of the answer.</p>`,
        `<p class="y-chinh">🎯 Máy tính lưu số nguyên âm bằng một <strong>sơ đồ mã hoá</strong>; ba sơ đồ cổ điển là bù 2 (two's complement), bù 1 (one's complement) và dấu–độ lớn (sign magnitude), và cả ba biểu diễn số <em>không âm</em> y hệt nhau.</p>
<ul>
<li><strong>Vì sao phải có sơ đồ</strong> — bộ nhớ chỉ chứa 0 và 1. Không có dấu trừ vật lý nào cả, nên "âm" bắt buộc phải được mã hoá ngay trong chính dãy bit.</li>
<li><strong>Dấu–độ lớn</strong> — bit ngoài cùng bên trái là dấu (0 = +, 1 = −), phần còn lại là độ lớn thuần. Dễ đọc, nhưng có <em>hai số không</em> (<code>0000 0000</code> và <code>1000 0000</code>) và phép trừ cần xử lý riêng.</li>
<li><strong>Bù 1</strong> — lấy số âm bằng cách lật mọi bit. Cũng có hai số không (<code>0000 0000</code> và <code>1111 1111</code>), và phép cộng cần bước sửa "nhớ vòng" (end-around carry).</li>
<li><strong>Bù 2 — sơ đồ phổ biến nhất</strong> — lật các bit (bù 1), <em>rồi cộng một</em>. Chỉ có đúng một số không, và bộ cộng nhị phân thông thường làm luôn được phép trừ mà không cần thêm mạch: a − b đúng nghĩa là a + (bù 2 của b).</li>
<li><strong>"Cả ba sơ đồ biểu diễn số không âm y hệt nhau"</strong> — nên mọi thứ bạn làm ở Exercise 1 vẫn đúng nguyên. Các sơ đồ chỉ bất đồng ở nửa âm.</li>
<li><strong>Công thức phải thuộc</strong> — <em>lật bit, cộng một</em>. Hai bước, áp lên byte của độ lớn dương. Nó cũng là phép nghịch đảo của chính nó: áp lên một dãy bit âm thì ra lại độ lớn dương.</li>
</ul>
<p class="meo">💡 Cách kiểm nhanh mọi byte bù 2: bit đầu là dấu. <code>0xxx xxxx</code> là không âm, <code>1xxx xxxx</code> là âm — chưa cần tính gì bạn đã biết dấu của đáp số.</p>`],

      [16, "Two's complement notation — worked example −92",
        `<p class="y-chinh">🎯 Two's complement in two steps — <strong>flip the bits, add one</strong> — demonstrated by the slide's example: −92 is represented as <code>1010 0100</code>₂.</p>
<p class="nhan">Verifying the slide's example step by step:</p>
<ul>
<li><strong>Step 0 — write the magnitude in binary</strong> — 92 = 64+16+8+4, so 92 = <code>0101 1100</code>. (Division check: 92÷2=46 r0, 46÷2=23 r0, 23÷2=11 r1, 11÷2=5 r1, 5÷2=2 r1, 2÷2=1 r0, 1÷2=0 r1 → bottom-up 1011100 → padded <code>0101 1100</code> ✓.)</li>
<li><strong>Step 1 — flip every bit (1-complement)</strong> — <code>0101 1100</code> → <code>1010 0011</code>.</li>
<li><strong>Step 2 — add one (2-complement)</strong> — <code>1010 0011</code> + <code>1</code> = <code>1010 0100</code>. This matches the slide exactly.</li>
<li><strong>Cross-check by adding back</strong> — 92 + (−92) must give zero in one byte: <code>0101 1100</code> + <code>1010 0100</code> = <code>1 0000 0000</code>. The 9th bit overflows out of the byte and is discarded, leaving <code>0000 0000</code> = 0 ✓. That discarded carry is exactly why two's complement works.</li>
<li><strong>Reading a negative byte back</strong> — apply the same recipe. <code>1010 0100</code> → flip → <code>0101 1011</code> → +1 → <code>0101 1100</code> = 92, and since the original leading bit was 1, the value is <strong>−92</strong>.</li>
</ul>
<p class="dap-an">✅ −92 (signed, 1 byte) = <code>1010 0100</code>₂ = 0xA4.</p>
<p class="meo">💡 Shortcut you can do in your head: copy the bits from the right up to and including the <em>first 1</em>, then flip everything to the left of it. 92 = 0101 1<u>100</u> → keep "100", flip "0101" → 1010, giving 1010 0100. Same answer, no addition.</p>
<p class="pitfall">⚠️ The bit pattern alone never tells you the value — <code>1010 0100</code> is −92 as a signed <code>char</code> but <strong>164</strong> as an <code>unsigned char</code> (128+32+4). The declared type is what picks the interpretation.</p>`,
        `<p class="y-chinh">🎯 Bù 2 gồm hai bước — <strong>lật bit, cộng một</strong> — minh hoạ bằng chính ví dụ của slide: −92 được biểu diễn là <code>1010 0100</code>₂.</p>
<p class="nhan">Kiểm lại ví dụ của slide từng bước:</p>
<ul>
<li><strong>Bước 0 — viết độ lớn ra nhị phân</strong> — 92 = 64+16+8+4, nên 92 = <code>0101 1100</code>. (Kiểm bằng chia: 92÷2=46 dư 0, 46÷2=23 dư 0, 23÷2=11 dư 1, 11÷2=5 dư 1, 5÷2=2 dư 1, 2÷2=1 dư 0, 1÷2=0 dư 1 → đọc ngược 1011100 → bù thành <code>0101 1100</code> ✓.)</li>
<li><strong>Bước 1 — lật mọi bit (bù 1)</strong> — <code>0101 1100</code> → <code>1010 0011</code>.</li>
<li><strong>Bước 2 — cộng một (bù 2)</strong> — <code>1010 0011</code> + <code>1</code> = <code>1010 0100</code>. Khớp đúng slide.</li>
<li><strong>Đối chiếu bằng cách cộng lại</strong> — 92 + (−92) phải bằng 0 trong một byte: <code>0101 1100</code> + <code>1010 0100</code> = <code>1 0000 0000</code>. Bit thứ 9 tràn ra khỏi byte và bị bỏ, còn lại <code>0000 0000</code> = 0 ✓. Chính cái nhớ bị bỏ đó là lý do bù 2 hoạt động.</li>
<li><strong>Đọc ngược một byte âm</strong> — áp đúng công thức đó. <code>1010 0100</code> → lật → <code>0101 1011</code> → +1 → <code>0101 1100</code> = 92, và vì bit đầu ban đầu là 1 nên giá trị là <strong>−92</strong>.</li>
</ul>
<p class="dap-an">✅ −92 (có dấu, 1 byte) = <code>1010 0100</code>₂ = 0xA4.</p>
<p class="meo">💡 Mẹo nhẩm trong đầu: chép nguyên các bit từ phải sang cho tới <em>bit 1 đầu tiên</em> (kể cả nó), rồi lật hết phần bên trái. 92 = 0101 1<u>100</u> → giữ "100", lật "0101" → 1010, ra 1010 0100. Cùng đáp số, không cần cộng.</p>
<p class="pitfall">⚠️ Riêng dãy bit không bao giờ cho biết giá trị — <code>1010 0100</code> là −92 nếu là <code>char</code> có dấu nhưng là <strong>164</strong> nếu là <code>unsigned char</code> (128+32+4). Kiểu được khai báo mới là thứ chọn cách hiểu.</p>`],

      [17, "Exercise 2 — two's complement with a signed 1-byte integer",
        `<p class="y-chinh">🎯 Exercise 2, using a <strong>signed 1-byte</strong> integer: find the two's complement of −63 and −219, and convert <code>1111 0101</code> and <code>1011 1011</code> to decimal.</p>
<p class="nhan">(a) −63 → two's complement</p>
<ul>
<li><strong>Step 1</strong> — 63 = <code>0011 1111</code> (from Exercise 1).</li>
<li><strong>Step 2 — flip</strong> — <code>1100 0000</code>.</li>
<li><strong>Step 3 — add one</strong> — <code>1100 0000</code> + 1 = <code>1100 0001</code>. Leading bit 1 ⇒ negative ✓. Check by adding: <code>0011 1111</code> + <code>1100 0001</code> = <code>1 0000 0000</code> → drops to 0 ✓.</li>
</ul>
<p class="nhan">(b) −219 → two's complement (and the trap it hides)</p>
<ul>
<li><strong>Mechanically</strong> — 219 = <code>1101 1011</code> → flip → <code>0010 0100</code> → +1 → <code>0010 0101</code>, which is the slide's answer.</li>
<li><strong>But read that result back</strong> — <code>0010 0101</code> starts with 0, so as a signed byte it is <em>positive</em>: 32+4+1 = <strong>+37</strong>, not −219. The mechanics are right; the storage is too small.</li>
<li><strong>Why</strong> — a signed byte only spans −128 … 127. Neither 219 nor −219 fits, so the result <strong>overflows</strong>. This is the deliberate lesson of the question: the recipe always produces 8 bits, but only values in range come back correctly. To hold −219 you need at least a <code>short</code>.</li>
</ul>
<p class="nhan">(c) and (d) — binary → decimal, signed</p>
<ul>
<li><strong><code>1111 0101</code></strong> — leading bit 1 ⇒ negative. Flip → <code>0000 1010</code>, +1 → <code>0000 1011</code> = 8+2+1 = 11. Therefore the value is <strong>−11</strong>.</li>
<li><strong><code>1011 1011</code></strong> — leading bit 1 ⇒ negative. Flip → <code>0100 0100</code>, +1 → <code>0100 0101</code> = 64+4+1 = 69. Therefore the value is <strong>−69</strong>.</li>
</ul>
<p class="dap-an">✅ Answers: −63 = <code>1100 0001</code> · −219 = <code>0010 0101</code> (mechanically — but it overflows a signed byte and reads back as +37) · <code>1111 0101</code> = −11 · <code>1011 1011</code> = −69.</p>
<p class="pitfall">⚠️ The number one exam mistake here is reading <code>1111 0101</code> as 245. That is the <em>unsigned</em> answer. The question says "signed 1-byte", so the leading 1 means you must take the complement back before reporting a magnitude.</p>`,
        `<p class="y-chinh">🎯 Exercise 2, với số nguyên <strong>có dấu 1 byte</strong>: tìm bù 2 của −63 và −219, rồi đổi <code>1111 0101</code> và <code>1011 1011</code> sang thập phân.</p>
<p class="nhan">(a) −63 → bù 2</p>
<ul>
<li><strong>Bước 1</strong> — 63 = <code>0011 1111</code> (lấy từ Exercise 1).</li>
<li><strong>Bước 2 — lật bit</strong> — <code>1100 0000</code>.</li>
<li><strong>Bước 3 — cộng một</strong> — <code>1100 0000</code> + 1 = <code>1100 0001</code>. Bit đầu bằng 1 ⇒ âm ✓. Kiểm bằng phép cộng: <code>0011 1111</code> + <code>1100 0001</code> = <code>1 0000 0000</code> → còn lại 0 ✓.</li>
</ul>
<p class="nhan">(b) −219 → bù 2 (và cái bẫy nó giấu)</p>
<ul>
<li><strong>Làm máy móc</strong> — 219 = <code>1101 1011</code> → lật → <code>0010 0100</code> → +1 → <code>0010 0101</code>, đúng đáp án trên slide.</li>
<li><strong>Nhưng đọc ngược kết quả đó</strong> — <code>0010 0101</code> bắt đầu bằng 0, nên nếu là byte có dấu thì nó <em>dương</em>: 32+4+1 = <strong>+37</strong>, không phải −219. Phép làm thì đúng; chỗ chứa mới là quá nhỏ.</li>
<li><strong>Vì sao</strong> — một byte có dấu chỉ trải từ −128 đến 127. Cả 219 lẫn −219 đều không lọt, nên kết quả bị <strong>tràn số (overflow)</strong>. Đây chính là bài học cố ý của câu hỏi: công thức lúc nào cũng cho ra 8 bit, nhưng chỉ giá trị nằm trong miền mới quay về đúng. Muốn chứa −219 thì tối thiểu phải dùng <code>short</code>.</li>
</ul>
<p class="nhan">(c) và (d) — nhị phân → thập phân, kiểu có dấu</p>
<ul>
<li><strong><code>1111 0101</code></strong> — bit đầu bằng 1 ⇒ âm. Lật → <code>0000 1010</code>, +1 → <code>0000 1011</code> = 8+2+1 = 11. Vậy giá trị là <strong>−11</strong>.</li>
<li><strong><code>1011 1011</code></strong> — bit đầu bằng 1 ⇒ âm. Lật → <code>0100 0100</code>, +1 → <code>0100 0101</code> = 64+4+1 = 69. Vậy giá trị là <strong>−69</strong>.</li>
</ul>
<p class="dap-an">✅ Đáp án: −63 = <code>1100 0001</code> · −219 = <code>0010 0101</code> (làm máy móc thì ra vậy — nhưng nó tràn khỏi byte có dấu và đọc ngược lại thành +37) · <code>1111 0101</code> = −11 · <code>1011 1011</code> = −69.</p>
<p class="pitfall">⚠️ Lỗi thi số một ở đây là đọc <code>1111 0101</code> thành 245. Đó là đáp án của kiểu <em>không dấu</em>. Đề ghi rõ "signed 1-byte", nên bit đầu bằng 1 nghĩa là bạn phải lấy bù ngược lại trước khi báo độ lớn.</p>`],

      [18, 'Unsigned Integers',
        `<p class="y-chinh">🎯 With <code>unsigned</code> variables there is no need for a negative-value encoding scheme, so <strong>all of the bits store the value</strong> — doubling the positive range.</p>
<ul>
<li><strong>What changes</strong> — nothing about the bits, only their interpretation. The sign bit stops being a sign and becomes just another place value (128 in a byte, 2³¹ in a 4-byte int).</li>
<li><strong>The ranges, side by side</strong> — <code>char</code> −128…127 vs <code>unsigned char</code> 0…255. <code>int</code> −2 147 483 648…2 147 483 647 vs <code>unsigned int</code> 0…4 294 967 295. Same byte count, same 256 or 2³² patterns, shifted entirely into the positives.</li>
<li><strong>Where it is the right choice</strong> — quantities that genuinely cannot be negative and that need the extra headroom: sizes, counts, raw bytes, bitmasks, IDs. <code>sizeof</code> itself returns an unsigned type (<code>size_t</code>).</li>
<li><strong>Connection to Exercise 2</strong> — this is exactly why <code>1111 0101</code> has two correct answers, −11 and 245, and the question must state which type it means.</li>
<li><strong>The famous danger — wrap-around</strong> — unsigned arithmetic never goes negative; it wraps. <code>0u - 1</code> is 4 294 967 295, not −1. Any loop written as <code>for (unsigned i = n; i &gt;= 0; i--)</code> is <strong>infinite</strong>, because an unsigned value is always ≥ 0.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    unsigned char u = 245;   /* 1111 0101 */
    signed   char s = -11;   /* same bits */
    printf("unsigned: %u\\n", u);   /* 245 */
    printf("signed  : %d\\n", s);   /* -11 */
    printf("wrap    : %u\\n", 0u - 1u);   /* 4294967295 */
    return 0;
}</code></pre>
<p class="pitfall">⚠️ Mixing signed and unsigned in one comparison converts the signed operand to unsigned first. <code>-1 &lt; 1u</code> evaluates to <strong>false</strong> in C, because −1 becomes 4 294 967 295. Never compare a signed loop index against an unsigned size without a cast.</p>`,
        `<p class="y-chinh">🎯 Với biến <code>unsigned</code> thì không cần sơ đồ mã hoá số âm nữa, nên <strong>toàn bộ số bit đều dùng để chứa giá trị</strong> — miền dương tăng gấp đôi.</p>
<ul>
<li><strong>Cái gì thay đổi</strong> — không có gì đổi ở các bit, chỉ đổi cách hiểu chúng. Bit dấu thôi làm dấu và trở thành một trọng số bình thường (128 trong một byte, 2³¹ trong int 4 byte).</li>
<li><strong>So miền giá trị cạnh nhau</strong> — <code>char</code> −128…127 so với <code>unsigned char</code> 0…255. <code>int</code> −2.147.483.648…2.147.483.647 so với <code>unsigned int</code> 0…4.294.967.295. Cùng số byte, cùng 256 hay 2³² mẫu bit, chỉ dời trọn sang phía dương.</li>
<li><strong>Khi nào chọn đúng</strong> — những đại lượng thật sự không thể âm và cần thêm khoảng trần: kích thước, số đếm, byte thô, mặt nạ bit, mã định danh. Bản thân <code>sizeof</code> trả về một kiểu không dấu (<code>size_t</code>).</li>
<li><strong>Liên hệ với Exercise 2</strong> — đây đúng là lý do <code>1111 0101</code> có hai đáp án đều đúng, −11 và 245, và đề bắt buộc phải nói rõ nó hỏi kiểu nào.</li>
<li><strong>Mối nguy nổi tiếng — quay vòng (wrap-around)</strong> — số học không dấu không bao giờ xuống âm; nó quay vòng. <code>0u - 1</code> ra 4.294.967.295, không phải −1. Mọi vòng lặp viết kiểu <code>for (unsigned i = n; i &gt;= 0; i--)</code> đều <strong>lặp vô tận</strong>, vì giá trị không dấu luôn ≥ 0.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    unsigned char u = 245;   /* 1111 0101 */
    signed   char s = -11;   /* cung day bit do */
    printf("unsigned: %u\\n", u);   /* 245 */
    printf("signed  : %d\\n", s);   /* -11 */
    printf("wrap    : %u\\n", 0u - 1u);   /* 4294967295 */
    return 0;
}</code></pre>
<p class="pitfall">⚠️ Trộn có dấu với không dấu trong một phép so sánh thì toán hạng có dấu bị đổi sang không dấu trước. <code>-1 &lt; 1u</code> cho kết quả <strong>sai</strong> trong C, vì −1 biến thành 4.294.967.295. Đừng bao giờ so một chỉ số có dấu với một kích thước không dấu mà không ép kiểu.</p>`],

      [19, 'Cultural Symbols (characters)',
        `<p class="y-chinh">🎯 Symbols are stored using an <strong>integral data type</strong>: we store a symbol by storing <em>the integer associated with it</em>. Over 60 encoding sequences exist; this course uses <strong>ASCII</strong> throughout.</p>
<ul>
<li><strong>The key sentence</strong> — "we store a symbol by storing the integer associated with the symbol". There is no character circuitry in a CPU; a character is a number plus an agreed table.</li>
<li><strong>Which is why <code>char</code> is an arithmetic type</strong> — <code>'A' + 1</code> is 66 and <code>(char)66</code> is <code>'B'</code>. Characters can be compared, sorted and counted precisely because they are integers.</li>
<li><strong>"Encoding sequence" = the agreed table</strong> — ASCII, ISO-8859-1, Windows-1252, UTF-8, and the 60-odd others. The same byte 0xC3 means different glyphs in different tables, which is why a Vietnamese text file opened with the wrong encoding shows "Ã¡" mojibake.</li>
<li><strong>Why ASCII for this course</strong> — it is 7 bits, 0…127, fits in one <code>char</code>, and is the common ancestor every other encoding agrees with for its first 128 codes. Learn it once and the rest follows.</li>
<li><strong>The consequence for Vietnamese</strong> — "ă", "ơ", "đ" are <em>not</em> in ASCII and do not fit in one <code>char</code>. In UTF-8 they take 2–3 bytes each, which is why <code>strlen</code> on a Vietnamese string returns more than the number of letters you see (Slot 16-18).</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    char c = 'A';
    printf("%c = %d\\n", c, c);          /* A = 65 */
    printf("%c\\n", c + 1);              /* B      */
    printf("lower = %c\\n", c + 32);     /* a      */
    printf("digit '7' as number = %d\\n", '7' - '0');  /* 7 */
    return 0;
}</code></pre>
<p class="meo">💡 The trick <code>'7' - '0'</code> = 7 works because the ten digit codes are consecutive (48…57). Same idea gives <code>c - 'a'</code> = the letter's position in the alphabet. You will use both constantly in Slot 16-18.</p>`,
        `<p class="y-chinh">🎯 Ký hiệu được lưu bằng một <strong>kiểu dữ liệu nguyên</strong>: ta lưu một ký hiệu bằng cách lưu <em>con số gắn với nó</em>. Có hơn 60 bảng mã đã được định nghĩa; môn này dùng <strong>ASCII</strong> xuyên suốt.</p>
<ul>
<li><strong>Câu then chốt</strong> — "ta lưu một ký hiệu bằng cách lưu con số gắn với ký hiệu đó". Trong CPU không có mạch nào dành cho ký tự cả; ký tự là một con số cộng với một bảng quy ước.</li>
<li><strong>Chính vì thế <code>char</code> là kiểu số học</strong> — <code>'A' + 1</code> bằng 66 và <code>(char)66</code> là <code>'B'</code>. Ký tự so sánh được, sắp xếp được, đếm được đúng là vì chúng là số nguyên.</li>
<li><strong>"Bảng mã" = bảng quy ước</strong> — ASCII, ISO-8859-1, Windows-1252, UTF-8, và hơn 60 bảng khác. Cùng byte 0xC3 lại là ký tự khác nhau ở các bảng khác nhau, đó là lý do file tiếng Việt mở sai bảng mã hiện ra "Ã¡" (lỗi font).</li>
<li><strong>Vì sao môn này dùng ASCII</strong> — nó 7 bit, 0…127, lọt gọn trong một <code>char</code>, và là tổ tiên chung mà mọi bảng mã khác đều đồng ý ở 128 mã đầu. Học một lần là dùng được về sau.</li>
<li><strong>Hệ quả với tiếng Việt</strong> — "ă", "ơ", "đ" <em>không</em> có trong ASCII và không lọt vào một <code>char</code>. Trong UTF-8 mỗi chữ chiếm 2–3 byte, đó là lý do <code>strlen</code> trên chuỗi tiếng Việt trả về số lớn hơn số chữ bạn nhìn thấy (Slot 16-18).</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    char c = 'A';
    printf("%c = %d\\n", c, c);          /* A = 65 */
    printf("%c\\n", c + 1);              /* B      */
    printf("chu thuong = %c\\n", c + 32);/* a      */
    printf("chu so '7' thanh so = %d\\n", '7' - '0');  /* 7 */
    return 0;
}</code></pre>
<p class="meo">💡 Mẹo <code>'7' - '0'</code> = 7 chạy được vì mười mã chữ số nằm liên tiếp (48…57). Cùng ý tưởng đó, <code>c - 'a'</code> cho vị trí của chữ cái trong bảng chữ. Bạn sẽ dùng cả hai liên tục ở Slot 16-18.</p>`],

      [20, 'ASCII table for characters',
        `<p class="y-chinh">🎯 The ASCII table maps codes 0–127 to characters. You do not memorise all 128 — you memorise <strong>four anchors</strong> and derive the rest.</p>
<ul>
<li><strong>The four anchors</strong> — <code>'0'</code> = <strong>48</strong> · <code>'A'</code> = <strong>65</strong> · <code>'a'</code> = <strong>97</strong> · space = <strong>32</strong>. Everything else follows because each group is consecutive.</li>
<li><strong>Derived instantly</strong> — <code>'9'</code> = 48+9 = 57 · <code>'Z'</code> = 65+25 = 90 · <code>'z'</code> = 97+25 = 122. And the gap between a capital and its lowercase is always exactly <strong>32</strong> ('a' − 'A' = 97 − 65 = 32).</li>
<li><strong>Codes 0–31 are control characters</strong> — not printable: <code>'\\0'</code> = 0 (the string terminator, central to Slot 16-18), <code>'\\n'</code> = 10 (line feed), <code>'\\r'</code> = 13 (carriage return), <code>'\\t'</code> = 9 (tab). Code 127 is DEL.</li>
<li><strong>Codes 32–126 are printable</strong> — space, punctuation, digits, uppercase, more punctuation, lowercase. Note punctuation sits <em>between</em> the digit and letter blocks, which is why <code>'9' &lt; 'A'</code> is true but there is no clean arithmetic from one block to the next.</li>
<li><strong>Why 7 bits</strong> — 2⁷ = 128 codes, so ASCII fits in a byte with one bit to spare. That spare bit is what "extended ASCII" tables (128–255) claimed, and where the encodings started disagreeing with each other.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    char c;
    for (c = 'A'; c &lt;= 'E'; c++)
        printf("%c = %d   %c = %d\\n", c, c, c + 32, c + 32);
    /* A = 65   a = 97 ... E = 69   e = 101 */
    return 0;
}</code></pre>
<p class="meo">💡 Case conversion without a library: lowercase = <code>c + 32</code>, uppercase = <code>c - 32</code>. In bits, 32 is <code>0010 0000</code>, so the real operation is flipping bit 5: <code>c | 32</code> lowercases and <code>c &amp; ~32</code> uppercases.</p>
<p class="pitfall">⚠️ <code>'5'</code> and <code>5</code> are different values — 53 and 5. Reading a digit with <code>scanf("%c", &amp;c)</code> and then using <code>c</code> as a number gives 53; you must subtract <code>'0'</code> first.</p>`,
        `<p class="y-chinh">🎯 Bảng ASCII ánh xạ mã 0–127 sang ký tự. Bạn không học thuộc cả 128 — bạn thuộc <strong>bốn mốc neo</strong> rồi suy ra phần còn lại.</p>
<ul>
<li><strong>Bốn mốc neo</strong> — <code>'0'</code> = <strong>48</strong> · <code>'A'</code> = <strong>65</strong> · <code>'a'</code> = <strong>97</strong> · dấu cách = <strong>32</strong>. Mọi thứ khác suy ra được vì mỗi nhóm nằm liên tiếp nhau.</li>
<li><strong>Suy ra tức thì</strong> — <code>'9'</code> = 48+9 = 57 · <code>'Z'</code> = 65+25 = 90 · <code>'z'</code> = 97+25 = 122. Và khoảng cách giữa chữ hoa với chữ thường tương ứng luôn đúng bằng <strong>32</strong> ('a' − 'A' = 97 − 65 = 32).</li>
<li><strong>Mã 0–31 là ký tự điều khiển</strong> — không in ra được: <code>'\\0'</code> = 0 (ký tự kết thúc chuỗi, cực kỳ quan trọng ở Slot 16-18), <code>'\\n'</code> = 10 (xuống dòng), <code>'\\r'</code> = 13 (về đầu dòng), <code>'\\t'</code> = 9 (tab). Mã 127 là DEL.</li>
<li><strong>Mã 32–126 là ký tự in được</strong> — dấu cách, dấu câu, chữ số, chữ hoa, thêm dấu câu, chữ thường. Để ý dấu câu nằm <em>xen giữa</em> khối chữ số và khối chữ cái, nên <code>'9' &lt; 'A'</code> là đúng nhưng không có phép tính gọn gàng nào nhảy từ khối này sang khối kia.</li>
<li><strong>Vì sao 7 bit</strong> — 2⁷ = 128 mã, nên ASCII lọt vào một byte và còn thừa một bit. Chính cái bit thừa đó bị các bảng "ASCII mở rộng" (128–255) trưng dụng, và đó là chỗ các bảng mã bắt đầu mâu thuẫn nhau.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    char c;
    for (c = 'A'; c &lt;= 'E'; c++)
        printf("%c = %d   %c = %d\\n", c, c, c + 32, c + 32);
    /* A = 65   a = 97 ... E = 69   e = 101 */
    return 0;
}</code></pre>
<p class="meo">💡 Đổi hoa–thường không cần thư viện: chữ thường = <code>c + 32</code>, chữ hoa = <code>c - 32</code>. Xét theo bit thì 32 là <code>0010 0000</code>, nên thực chất là lật bit thứ 5: <code>c | 32</code> cho ra chữ thường, <code>c &amp; ~32</code> cho ra chữ hoa.</p>
<p class="pitfall">⚠️ <code>'5'</code> và <code>5</code> là hai giá trị khác nhau — 53 và 5. Đọc một chữ số bằng <code>scanf("%c", &amp;c)</code> rồi dùng <code>c</code> như con số thì ra 53; phải trừ <code>'0'</code> trước đã.</p>`],

      [21, 'Exercise 3 — choosing data types for a library system',
        `<p class="y-chinh">🎯 Exercise 3: pick the most suitable type for six library variables, declare and initialise them, then print each value with its type. This is the design decision of slide 7, applied six times.</p>
<p class="nhan">Task 1 — the six choices, with the reasoning</p>
<ul>
<li><strong>Total number of books (10 000)</strong> → <code>int</code>. A whole count, comfortably inside ±2.1 billion. <code>short</code> would also hold it (max 32 767) but leaves no headroom if the library grows.</li>
<li><strong>Average price in dollars (15.75)</strong> → <code>double</code> (or <code>float</code>). It has a fractional part, so it must be a floating-point type; <code>double</code> is the C default for real literals and avoids <code>float</code>'s 7-digit limit.</li>
<li><strong>Genre, a single character ('F', 'N')</strong> → <code>char</code>. Exactly one symbol, one byte. Note the single quotes: <code>'F'</code> is a character, <code>"F"</code> is a 2-byte string.</li>
<li><strong>Unique book ID (2 345 678 901)</strong> → <code>long long</code> (or <code>unsigned int</code>). <strong>This is the trap.</strong> 2 345 678 901 &gt; <code>INT_MAX</code> = 2 147 483 647, so a plain <code>int</code> <em>overflows</em>. <code>unsigned int</code> reaches 4 294 967 295 and fits, but <code>long long</code> is the safe, portable answer.</li>
<li><strong>Availability (1 or 0)</strong> → <code>int</code>, or more economically <code>char</code> / <code>_Bool</code>. C has no native boolean before C99's <code>&lt;stdbool.h&gt;</code>; the convention is 0 = false, non-zero = true.</li>
<li><strong>Number of pages (500)</strong> → <code>int</code> (or <code>short</code>, since no book reaches 32 767 pages). Use <code>int</code> unless you are storing millions of records.</li>
</ul>
<p class="nhan">Tasks 2 and 3 — declare, initialise, print</p>
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    int       totalBooks   = 10000;
    double    averagePrice = 15.75;
    char      genre        = 'F';
    long long bookId       = 2345678901LL;
    int       isAvailable  = 1;
    int       pages        = 500;

    printf("Total books  (int)       : %d\\n",   totalBooks);
    printf("Average price(double)    : %.2f\\n", averagePrice);
    printf("Genre        (char)      : %c\\n",   genre);
    printf("Book ID      (long long) : %lld\\n", bookId);
    printf("Available    (int)       : %d\\n",   isAvailable);
    printf("Pages        (int)       : %d\\n",   pages);
    return 0;
}</code></pre>
<p class="dap-an">✅ Answer: <code>int</code> totalBooks · <code>double</code> averagePrice · <code>char</code> genre · <code>long long</code> bookId · <code>int</code> isAvailable · <code>int</code> pages. Output: 10000 / 15.75 / F / 2345678901 / 1 / 500.</p>
<p class="pitfall">⚠️ Declaring <code>int bookId = 2345678901;</code> compiles with only a warning on many compilers and then prints <strong>−1949288395</strong> — the wrapped two's complement value. Always compare the largest possible value against the type's maximum <em>before</em> choosing.</p>`,
        `<p class="y-chinh">🎯 Exercise 3: chọn kiểu phù hợp nhất cho sáu biến của hệ thống thư viện, khai báo và khởi tạo chúng, rồi in từng giá trị kèm kiểu. Đây chính là quyết định thiết kế ở slide 7, làm sáu lần.</p>
<p class="nhan">Nhiệm vụ 1 — sáu lựa chọn, kèm lý do</p>
<ul>
<li><strong>Tổng số sách (10.000)</strong> → <code>int</code>. Là số đếm nguyên, nằm thoải mái trong ±2,1 tỉ. <code>short</code> cũng chứa được (tối đa 32.767) nhưng không còn khoảng trần nếu thư viện lớn lên.</li>
<li><strong>Giá trung bình theo đô la (15,75)</strong> → <code>double</code> (hoặc <code>float</code>). Có phần thập phân nên bắt buộc là kiểu dấu chấm động; <code>double</code> là mặc định của C cho literal số thực và tránh được giới hạn 7 chữ số của <code>float</code>.</li>
<li><strong>Thể loại, một ký tự đơn ('F', 'N')</strong> → <code>char</code>. Đúng một ký hiệu, một byte. Chú ý dấu nháy đơn: <code>'F'</code> là ký tự, còn <code>"F"</code> là chuỗi 2 byte.</li>
<li><strong>Mã sách duy nhất (2.345.678.901)</strong> → <code>long long</code> (hoặc <code>unsigned int</code>). <strong>Đây là cái bẫy.</strong> 2.345.678.901 &gt; <code>INT_MAX</code> = 2.147.483.647, nên <code>int</code> thường sẽ <em>tràn số</em>. <code>unsigned int</code> lên tới 4.294.967.295 nên vừa, nhưng <code>long long</code> mới là đáp án an toàn và khả chuyển.</li>
<li><strong>Còn sách hay không (1 hoặc 0)</strong> → <code>int</code>, hoặc tiết kiệm hơn là <code>char</code> / <code>_Bool</code>. C không có kiểu luận lý dựng sẵn trước khi C99 có <code>&lt;stdbool.h&gt;</code>; quy ước là 0 = sai, khác 0 = đúng.</li>
<li><strong>Số trang (500)</strong> → <code>int</code> (hoặc <code>short</code>, vì không cuốn nào tới 32.767 trang). Cứ dùng <code>int</code> trừ khi bạn lưu hàng triệu bản ghi.</li>
</ul>
<p class="nhan">Nhiệm vụ 2 và 3 — khai báo, khởi tạo, in ra</p>
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    int       totalBooks   = 10000;
    double    averagePrice = 15.75;
    char      genre        = 'F';
    long long bookId       = 2345678901LL;
    int       isAvailable  = 1;
    int       pages        = 500;

    printf("Tong so sach (int)       : %d\\n",   totalBooks);
    printf("Gia trung binh(double)   : %.2f\\n", averagePrice);
    printf("The loai     (char)      : %c\\n",   genre);
    printf("Ma sach      (long long) : %lld\\n", bookId);
    printf("Con sach     (int)       : %d\\n",   isAvailable);
    printf("So trang     (int)       : %d\\n",   pages);
    return 0;
}</code></pre>
<p class="dap-an">✅ Đáp án: <code>int</code> totalBooks · <code>double</code> averagePrice · <code>char</code> genre · <code>long long</code> bookId · <code>int</code> isAvailable · <code>int</code> pages. Kết quả in: 10000 / 15.75 / F / 2345678901 / 1 / 500.</p>
<p class="pitfall">⚠️ Khai báo <code>int bookId = 2345678901;</code> vẫn biên dịch được, nhiều trình chỉ cảnh báo, rồi in ra <strong>−1949288395</strong> — chính là giá trị bù 2 sau khi quay vòng. Luôn so giá trị lớn nhất có thể với giá trị tối đa của kiểu <em>trước khi</em> chọn.</p>`],

      [22, 'The range of values of data types',
        `<p class="y-chinh">🎯 The summary table: every type's range is fixed by its bit count. For n bits, signed spans <strong>−2ⁿ⁻¹ … 2ⁿ⁻¹ − 1</strong> and unsigned spans <strong>0 … 2ⁿ − 1</strong>.</p>
<table>
<tr><th>Type</th><th>Bytes</th><th>Range (typical 32/64-bit)</th></tr>
<tr><td><code>char</code></td><td>1</td><td>−128 … 127</td></tr>
<tr><td><code>unsigned char</code></td><td>1</td><td>0 … 255</td></tr>
<tr><td><code>short</code></td><td>2</td><td>−32 768 … 32 767</td></tr>
<tr><td><code>unsigned short</code></td><td>2</td><td>0 … 65 535</td></tr>
<tr><td><code>int</code> / <code>long</code></td><td>4</td><td>−2 147 483 648 … 2 147 483 647</td></tr>
<tr><td><code>unsigned int</code></td><td>4</td><td>0 … 4 294 967 295</td></tr>
<tr><td><code>long long</code></td><td>8</td><td>≈ −9.22×10¹⁸ … 9.22×10¹⁸</td></tr>
<tr><td><code>float</code></td><td>4</td><td>≈ ±3.4×10³⁸, ~7 significant digits</td></tr>
<tr><td><code>double</code></td><td>8</td><td>≈ ±1.8×10³⁰⁸, ~15–16 significant digits</td></tr>
</table>
<ul>
<li><strong>Why the signed range is lopsided</strong> — one extra negative value. With 8 bits there are 256 patterns: 128 negatives (−128…−1), zero, and 127 positives. Zero eats one slot from the positive side, so the maximum is 127 while the minimum is −128.</li>
<li><strong>Read the table as "counting" vs "measuring"</strong> — the integral rows give an <em>exact</em> range; the floating-point rows give a <em>magnitude</em> plus a digit count, because precision, not range, is what runs out first.</li>
<li><strong>Do not hard-code these numbers</strong> — <code>&lt;limits.h&gt;</code> defines <code>CHAR_MIN</code>, <code>INT_MAX</code>, <code>LLONG_MAX</code> and <code>&lt;float.h&gt;</code> defines <code>DBL_MAX</code>, <code>FLT_DIG</code>. Those adapt to the compiler; your memory does not.</li>
<li><strong>Connecting the deck</strong> — Exercise 2 overflowed because −219 is outside row 1; Exercise 3's book ID overflowed because it is outside row 5. Both errors are one glance at this table away from being avoided.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;limits.h&gt;

int main(void) {
    printf("char : %d .. %d\\n", CHAR_MIN, CHAR_MAX);
    printf("int  : %d .. %d\\n", INT_MIN,  INT_MAX);
    printf("uint : 0 .. %u\\n",  UINT_MAX);
    printf("llong: %lld .. %lld\\n", LLONG_MIN, LLONG_MAX);
    return 0;
}</code></pre>
<p class="meo">💡 Three numbers worth knowing cold: 127 (signed byte max), 32 767 (short max) and 2 147 483 647 (int max ≈ 2.1 billion). Any value in a question that is bigger than 2.1 billion is telling you to use <code>long long</code>.</p>`,
        `<p class="y-chinh">🎯 Bảng tổng kết: miền giá trị của mọi kiểu đều do số bit của nó quyết định. Với n bit, kiểu có dấu trải <strong>−2ⁿ⁻¹ … 2ⁿ⁻¹ − 1</strong> còn kiểu không dấu trải <strong>0 … 2ⁿ − 1</strong>.</p>
<table>
<tr><th>Kiểu</th><th>Byte</th><th>Miền giá trị (điển hình 32/64-bit)</th></tr>
<tr><td><code>char</code></td><td>1</td><td>−128 … 127</td></tr>
<tr><td><code>unsigned char</code></td><td>1</td><td>0 … 255</td></tr>
<tr><td><code>short</code></td><td>2</td><td>−32.768 … 32.767</td></tr>
<tr><td><code>unsigned short</code></td><td>2</td><td>0 … 65.535</td></tr>
<tr><td><code>int</code> / <code>long</code></td><td>4</td><td>−2.147.483.648 … 2.147.483.647</td></tr>
<tr><td><code>unsigned int</code></td><td>4</td><td>0 … 4.294.967.295</td></tr>
<tr><td><code>long long</code></td><td>8</td><td>≈ −9,22×10¹⁸ … 9,22×10¹⁸</td></tr>
<tr><td><code>float</code></td><td>4</td><td>≈ ±3,4×10³⁸, ~7 chữ số có nghĩa</td></tr>
<tr><td><code>double</code></td><td>8</td><td>≈ ±1,8×10³⁰⁸, ~15–16 chữ số có nghĩa</td></tr>
</table>
<ul>
<li><strong>Vì sao miền có dấu lệch một bên</strong> — dư ra một giá trị âm. Với 8 bit có 256 mẫu: 128 số âm (−128…−1), số 0, và 127 số dương. Số 0 ăn mất một suất của phía dương, nên tối đa là 127 còn tối thiểu là −128.</li>
<li><strong>Đọc bảng theo lối "đếm" và "đo"</strong> — các dòng kiểu nguyên cho miền <em>chính xác</em>; các dòng kiểu thực cho một <em>độ lớn</em> kèm số chữ số, vì thứ cạn trước là độ chính xác chứ không phải miền giá trị.</li>
<li><strong>Đừng gõ cứng những con số này</strong> — <code>&lt;limits.h&gt;</code> định nghĩa <code>CHAR_MIN</code>, <code>INT_MAX</code>, <code>LLONG_MAX</code> và <code>&lt;float.h&gt;</code> định nghĩa <code>DBL_MAX</code>, <code>FLT_DIG</code>. Chúng tự thích nghi với trình biên dịch; trí nhớ của bạn thì không.</li>
<li><strong>Nối lại cả deck</strong> — Exercise 2 tràn số vì −219 nằm ngoài dòng 1; mã sách của Exercise 3 tràn vì nó nằm ngoài dòng 5. Cả hai lỗi chỉ cách một cái liếc mắt vào bảng này.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;limits.h&gt;

int main(void) {
    printf("char : %d .. %d\\n", CHAR_MIN, CHAR_MAX);
    printf("int  : %d .. %d\\n", INT_MIN,  INT_MAX);
    printf("uint : 0 .. %u\\n",  UINT_MAX);
    printf("llong: %lld .. %lld\\n", LLONG_MIN, LLONG_MAX);
    return 0;
}</code></pre>
<p class="meo">💡 Ba con số nên thuộc nằm lòng: 127 (tối đa byte có dấu), 32.767 (tối đa short) và 2.147.483.647 (tối đa int ≈ 2,1 tỉ). Đề mà cho giá trị lớn hơn 2,1 tỉ là đang bảo bạn dùng <code>long long</code>.</p>`],

    ]),
  ].join('\n'),
};
