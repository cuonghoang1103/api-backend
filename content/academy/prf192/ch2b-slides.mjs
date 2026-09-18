/**
 * PRF192 · Slot 02-04 — Basic Computation, học theo từng slide: PHẦN 2 (slide 23–44).
 * Deck 'prf2' (PRF2), 62 slide, ảnh đã render sẵn lên CDN images/academy/PRF192/v1/prf2/NNN.webp.
 *
 * Nội dung bám ĐÚNG chữ trích từ Slot_02_03_04_Basic_Computation.pptx của trường
 * (/tmp/prf192-text/prf2.txt, slide 23→44). Không thêm chủ đề ngoài slide.
 *
 * Các phép tính trong bài đã kiểm tay:
 *   'A' = 65(10) = 0101(8) = 0x41(16)   → 6*8 + 5 = 53? KHÔNG: 0101(8) = 1*64 + 0*8 + 1 = 65 ✓
 *   0x41 = 4*16 + 1 = 65 ✓
 *   sizeof: char 1, int 4, float 4, double 8, short 2, long 4/8 (LP64) — môi trường 32-bit của Dev-C++
 *   Exercise 4: a=5, b=3 → area = 15, perimeter = 2*(5+3) = 16
 *   Exercise 5: 2 int + 2 float + 2 double = 4+4+4+4+8+8 = 32 byte trên stack của main
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'prf2';

export default {
  title: '2.0b — Slide by slide: Declaring variables, literals, named constants & formatted I/O (slides 23–44)|||2.0b — Slide bài giảng: Khai báo biến, literal, hằng có tên & nhập/xuất định dạng (slide 23–44)',
  slug: 'prf192-2-0b-slides-literal-hang-nhap-xuat',
  type: 'DOCUMENT',
  description: 'Phần 2 của Slot 02-04 (slide 23–44): cú pháp khai báo biến và quy tắc đặt tên, 32 từ khoá dành riêng của C, bốn thao tác cơ bản trên biến, toán tử &amp; và sizeof, ba loại literal (ký tự, chuỗi, số) cùng bảng escape sequence, hai cách tạo hằng có tên (const và #define, kèm cơ chế thay thế macro), rồi cơ chế nhập/xuất qua thiết bị ký tự với bảng conversion specifier của printf/scanf. Có lời giải từng bước cho Exercise 4, Exercise 5 và các slide Question.',
  content: [
    walkHead(D, 23, 44),
    walk(D, [
      [23, 'Declaring (Creating) Variables',
        `<p class="y-chinh">🎯 One line of syntax runs the whole slide: <code>data_type identifier [= initial value];</code> — a type, a name, and an <em>optional</em> starting value. The square brackets mean "you may omit this part", they are not typed into the code.</p>
<ul>
<li><strong>What the compiler actually does</strong> — a declaration is an order to reserve memory. <code>int numberOfClasses;</code> tells the compiler: set aside 4 bytes somewhere, remember that the name <code>numberOfClasses</code> refers to that address, and treat those bytes as a two's-complement integer. Everything from slides 6–7 (address + data type) is created right here.</li>
<li><strong>The three examples on the slide</strong> — <code>char section</code>, <code>int numberOfClasses;</code>, <code>double cashFare = 2.25;</code>. Only the third one is <em>initialised</em>; the first two merely exist. Note that the slide's first line has lost its semicolon — in real C every declaration ends with <code>;</code>.</li>
<li><strong>Declared ≠ initialised</strong> — an uninitialised local variable does <em>not</em> contain 0. It contains whatever bit pattern was left in that memory by the previous function. Reading it gives a random number that changes from run to run.</li>
<li><strong>The five naming rules</strong> — names may contain letters, digits and underscores; must begin with a letter or an underscore; are case-sensitive (<code>myVar</code> and <code>myvar</code> are two different variables); may not contain whitespace or special characters such as <code>!</code>, <code>#</code>, <code>%</code>; and must not be a C reserved word (the table on slide 24).</li>
<li><strong>Several variables, one type, one line</strong> — <code>int i, j, k = 0;</code> declares three ints but initialises only <code>k</code>. This is a classic exam trap: the <code>= 0</code> binds to <code>k</code> alone.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main() {
    char   section;                 /* declared, not initialised */
    int    numberOfClasses;         /* declared, not initialised */
    double cashFare = 2.25;         /* declared AND initialised  */

    section         = 'A';          /* give it a value later     */
    numberOfClasses = 12;

    printf("section = %c\\n", section);
    printf("classes = %d\\n", numberOfClasses);
    printf("fare    = %.2f\\n", cashFare);
    return 0;
}</code></pre>
<p class="dap-an">✅ Output: <code>section = A</code> / <code>classes = 12</code> / <code>fare = 2.25</code>. Had we printed <code>numberOfClasses</code> before assigning 12, the value would have been garbage — legal C, but meaningless.</p>
<p class="pitfall">⚠️ <code>2total</code>, <code>my var</code>, <code>rate%</code> and <code>double</code> are all invalid names — they break rule 2, rule 4, rule 4 and rule 5 respectively. <code>_total</code> and <code>total_2</code> are valid.</p>`,
        `<p class="y-chinh">🎯 Cả slide xoay quanh đúng một dòng cú pháp: <code>data_type identifier [= initial value];</code> — một kiểu, một tên, và một giá trị khởi tạo <em>không bắt buộc</em>. Cặp ngoặc vuông nghĩa là "phần này có thể bỏ", chứ không phải ký tự bạn gõ vào mã.</p>
<ul>
<li><strong>Trình biên dịch thật sự làm gì</strong> — khai báo là lệnh đặt chỗ trong bộ nhớ. <code>int numberOfClasses;</code> bảo trình biên dịch: dành sẵn 4 byte ở đâu đó, nhớ rằng tên <code>numberOfClasses</code> trỏ tới địa chỉ ấy, và diễn giải mấy byte đó theo mã bù hai. Mọi thứ nói ở slide 6–7 (địa chỉ + kiểu dữ liệu) được tạo ra chính tại dòng này.</li>
<li><strong>Ba ví dụ trên slide</strong> — <code>char section</code>, <code>int numberOfClasses;</code>, <code>double cashFare = 2.25;</code>. Chỉ ví dụ thứ ba là có <em>khởi tạo</em>; hai cái đầu mới chỉ tồn tại. Để ý dòng đầu trên slide bị rơi mất dấu chấm phẩy — trong C thật, mọi khai báo đều kết thúc bằng <code>;</code>.</li>
<li><strong>Khai báo ≠ khởi tạo</strong> — một biến cục bộ chưa khởi tạo <em>không</em> mang giá trị 0. Nó mang đúng chuỗi bit mà hàm chạy trước đó để lại ở vùng nhớ ấy. Đọc nó ra được một con số ngẫu nhiên, chạy lại lần nữa lại ra số khác.</li>
<li><strong>Năm quy tắc đặt tên</strong> — tên gồm chữ cái, chữ số và dấu gạch dưới; phải bắt đầu bằng chữ cái hoặc gạch dưới; phân biệt HOA–thường (<code>myVar</code> và <code>myvar</code> là hai biến khác nhau); không chứa khoảng trắng hay ký tự đặc biệt như <code>!</code>, <code>#</code>, <code>%</code>; và không được trùng từ khoá dành riêng của C (bảng ở slide 24).</li>
<li><strong>Nhiều biến, một kiểu, một dòng</strong> — <code>int i, j, k = 0;</code> khai báo ba biến int nhưng chỉ khởi tạo <code>k</code>. Đây là bẫy thi kinh điển: phần <code>= 0</code> chỉ dính vào <code>k</code>.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main() {
    char   section;                 /* khai bao, chua khoi tao  */
    int    numberOfClasses;         /* khai bao, chua khoi tao  */
    double cashFare = 2.25;         /* khai bao VA khoi tao     */

    section         = 'A';          /* gan gia tri sau cung duoc */
    numberOfClasses = 12;

    printf("section = %c\\n", section);
    printf("classes = %d\\n", numberOfClasses);
    printf("fare    = %.2f\\n", cashFare);
    return 0;
}</code></pre>
<p class="dap-an">✅ Kết quả: <code>section = A</code> / <code>classes = 12</code> / <code>fare = 2.25</code>. Nếu in <code>numberOfClasses</code> trước khi gán 12 thì giá trị là rác — vẫn hợp lệ với C, nhưng vô nghĩa.</p>
<p class="pitfall">⚠️ <code>2total</code>, <code>my var</code>, <code>rate%</code> và <code>double</code> đều là tên sai — lần lượt phạm quy tắc 2, quy tắc 4, quy tắc 4 và quy tắc 5. Còn <code>_total</code> và <code>total_2</code> thì hợp lệ.</p>`],

      [24, 'Reserved words (keywords of C)',
        `<p class="y-chinh">🎯 C reserves a small, fixed list of words for itself. They are the only words the compiler understands as <em>commands</em>, and none of them may be reused as a variable name.</p>
<ul>
<li><strong>How many</strong> — the C89/C90 standard that this course follows defines <strong>32</strong> keywords: <code>auto break case char const continue default do double else enum extern float for goto if int long register return short signed sizeof static struct switch typedef union unsigned void volatile while</code>.</li>
<li><strong>Why the list is so short</strong> — this is exactly the "C is small enough to hold in your head" argument. Compare with several hundred built-in names in a modern scripting language. Everything else you will ever type — <code>printf</code>, <code>scanf</code>, <code>main</code>, <code>strlen</code> — is <em>not</em> a keyword, it is just a function name from a library.</li>
<li><strong>Which ones you already met</strong> — the type words <code>char int float double short long signed unsigned</code> (slides 8–11), the qualifier <code>const</code> (slide 12), and the operator <code>sizeof</code> (slide 28). The control words <code>if else switch case for while do break continue return</code> come in Slot 05–07.</li>
<li><strong>Case matters</strong> — keywords are lowercase only. <code>Int</code>, <code>FLOAT</code> and <code>Return</code> are <em>not</em> keywords; the compiler treats them as ordinary identifiers, which is precisely why <code>Float f1;</code> on slide 29 fails.</li>
<li><strong>The error message you get</strong> — reusing a keyword produces a confusing diagnostic, because the parser sees a command where it expected a name:</li>
</ul>
<pre><code>int main() {
    int double = 5;      /* error: expected identifier before 'double' */
    int for    = 3;      /* error: expected identifier before 'for'    */
    int printf = 7;      /* legal! printf is a library name, not a keyword
                            - but now you can never call printf again  */
    return 0;
}</code></pre>
<p class="meo">💡 Do not memorise all 32. Memorise the rule instead: <em>if a word is coloured by the editor, it belongs to C</em>. Dev-C++ paints keywords in bold blue, so a name that suddenly turns blue is a name you must change.</p>
<p class="pitfall">⚠️ <code>sizeof</code> surprises everyone — it looks like a function but it is a <strong>keyword/operator</strong>, evaluated by the compiler, not at run time. That is why <code>sizeof(int)</code> works even though <code>int</code> is not a value.</p>`,
        `<p class="y-chinh">🎯 C giữ riêng cho mình một danh sách từ ngắn và cố định. Đó là những từ duy nhất trình biên dịch hiểu là <em>lệnh</em>, và không từ nào trong đó được dùng lại làm tên biến.</p>
<ul>
<li><strong>Có bao nhiêu từ</strong> — chuẩn C89/C90 mà môn này đi theo định nghĩa <strong>32</strong> từ khoá: <code>auto break case char const continue default do double else enum extern float for goto if int long register return short signed sizeof static struct switch typedef union unsigned void volatile while</code>.</li>
<li><strong>Vì sao danh sách lại ngắn thế</strong> — đây đúng là luận điểm "C nhỏ tới mức ôm trọn được trong đầu". So với vài trăm tên dựng sẵn của một ngôn ngữ kịch bản hiện đại thì chênh lệch rất rõ. Mọi thứ còn lại bạn sẽ gõ — <code>printf</code>, <code>scanf</code>, <code>main</code>, <code>strlen</code> — đều <em>không</em> phải từ khoá, chúng chỉ là tên hàm trong thư viện.</li>
<li><strong>Những từ bạn đã gặp</strong> — nhóm kiểu <code>char int float double short long signed unsigned</code> (slide 8–11), từ bổ nghĩa <code>const</code> (slide 12), và toán tử <code>sizeof</code> (slide 28). Nhóm điều khiển <code>if else switch case for while do break continue return</code> để dành cho Slot 05–07.</li>
<li><strong>Phân biệt HOA–thường</strong> — từ khoá chỉ viết thường. <code>Int</code>, <code>FLOAT</code>, <code>Return</code> <em>không</em> phải từ khoá; trình biên dịch coi chúng là định danh thường, và đó chính là lý do <code>Float f1;</code> ở slide 29 bị lỗi.</li>
<li><strong>Thông báo lỗi bạn sẽ nhận</strong> — dùng lại từ khoá cho ra lỗi khó hiểu, vì bộ phân tích cú pháp gặp một lệnh ở chỗ nó đang chờ một cái tên:</li>
</ul>
<pre><code>int main() {
    int double = 5;      /* error: expected identifier before 'double' */
    int for    = 3;      /* error: expected identifier before 'for'    */
    int printf = 7;      /* HOP LE! printf la ten thu vien, khong phai
                            tu khoa - nhung tu day het goi duoc printf */
    return 0;
}</code></pre>
<p class="meo">💡 Đừng học thuộc cả 32 từ. Học quy tắc thay thế: <em>từ nào bị trình soạn thảo tô màu thì từ đó thuộc về C</em>. Dev-C++ tô từ khoá màu xanh đậm, nên một cái tên bỗng chuyển xanh là cái tên bạn phải đổi.</p>
<p class="pitfall">⚠️ <code>sizeof</code> làm mọi người nhầm — nó trông như hàm nhưng là <strong>từ khoá / toán tử</strong>, do trình biên dịch tính, không phải lúc chạy. Vì thế <code>sizeof(int)</code> vẫn chạy được dù <code>int</code> không phải một giá trị.</p>`],

      [25, 'Exercise 4 — meaningful variable names for a rectangle program',
        `<p class="y-chinh">🎯 Write a C program that computes the <strong>area and perimeter of a rectangle</strong>, where every variable name is (1) legal, (2) descriptive, (3) written in a consistent convention such as camelCase or snake_case.</p>
<ul>
<li><strong>Step 1 — the rules, restated from slide 23</strong> — letters/digits/underscore only · first character a letter or <code>_</code> · case-sensitive · no spaces or symbols · not a reserved word. A name that passes all five is <em>legal</em>; that is the minimum, not the goal.</li>
<li><strong>Step 2 — choose the names</strong> — the problem has exactly four quantities, so four variables: the two sides and the two results. <code>a</code>, <code>b</code>, <code>s</code>, <code>p</code> are legal but tell the reader nothing. <code>rectangleWidth</code>, <code>rectangleHeight</code>, <code>rectangleArea</code>, <code>rectanglePerimeter</code> read like English.</li>
<li><strong>Step 3 — pick ONE convention and keep it</strong> — camelCase (<code>rectangleWidth</code>) or snake_case (<code>rectangle_width</code>). Mixing them inside one program is the single most common style mark lost in the assignment.</li>
<li><strong>Step 4 — the formulas</strong> — area = width × height, perimeter = 2 × (width + height). Both sides are lengths, so <code>float</code> or <code>double</code> is the right type; <code>int</code> would silently destroy a 5.5 cm side.</li>
<li><strong>Step 5 — the program</strong>, using <code>scanf</code> for input (slide 42) and <code>%.2f</code> for two decimals (slide 40):</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main() {
    double rectangleWidth, rectangleHeight;
    double rectangleArea, rectanglePerimeter;

    printf("Enter width and height: ");
    scanf("%lf%lf", &amp;rectangleWidth, &amp;rectangleHeight);

    rectangleArea      = rectangleWidth * rectangleHeight;
    rectanglePerimeter = 2 * (rectangleWidth + rectangleHeight);

    printf("Area      = %.2f\\n", rectangleArea);
    printf("Perimeter = %.2f\\n", rectanglePerimeter);
    return 0;
}</code></pre>
<p class="dap-an">✅ Trace with width = 5, height = 3: area = 5 × 3 = <strong>15.00</strong>; perimeter = 2 × (5 + 3) = 2 × 8 = <strong>16.00</strong>. With width = 5.5, height = 2: area = 11.00, perimeter = 15.00 — and if the variables had been <code>int</code>, 5.5 would have been truncated to 5 and the area would have printed 10.</p>
<p class="pitfall">⚠️ Reading a <code>double</code> needs <code>%lf</code>, not <code>%f</code>. <code>%f</code> in <code>scanf</code> means "read a <code>float</code>", and passing the address of a <code>double</code> to it writes 4 bytes into an 8-byte box — the number comes out wrong with no warning.</p>`,
        `<p class="y-chinh">🎯 Viết chương trình C tính <strong>diện tích và chu vi hình chữ nhật</strong>, trong đó mọi tên biến phải (1) hợp lệ, (2) gợi nghĩa, (3) theo một quy ước nhất quán như camelCase hoặc snake_case.</p>
<ul>
<li><strong>Bước 1 — nhắc lại quy tắc từ slide 23</strong> — chỉ chữ cái/chữ số/gạch dưới · ký tự đầu là chữ cái hoặc <code>_</code> · phân biệt HOA–thường · không khoảng trắng, không ký hiệu · không trùng từ khoá. Tên qua đủ năm điều là <em>hợp lệ</em>; đó mới là mức tối thiểu, chưa phải mục tiêu.</li>
<li><strong>Bước 2 — chọn tên</strong> — bài toán có đúng bốn đại lượng, nên bốn biến: hai cạnh và hai kết quả. <code>a</code>, <code>b</code>, <code>s</code>, <code>p</code> hợp lệ nhưng chẳng nói gì với người đọc. <code>rectangleWidth</code>, <code>rectangleHeight</code>, <code>rectangleArea</code>, <code>rectanglePerimeter</code> thì đọc lên như tiếng Anh.</li>
<li><strong>Bước 3 — chọn MỘT quy ước rồi giữ nguyên</strong> — camelCase (<code>rectangleWidth</code>) hoặc snake_case (<code>rectangle_width</code>). Trộn lẫn hai kiểu trong cùng một chương trình là lỗi trình bày bị trừ điểm nhiều nhất trong bài assignment.</li>
<li><strong>Bước 4 — công thức</strong> — diện tích = rộng × cao, chu vi = 2 × (rộng + cao). Hai cạnh là độ dài nên kiểu đúng là <code>float</code> hoặc <code>double</code>; dùng <code>int</code> sẽ âm thầm phá hỏng một cạnh 5,5 cm.</li>
<li><strong>Bước 5 — chương trình</strong>, nhập bằng <code>scanf</code> (slide 42) và in hai chữ số thập phân bằng <code>%.2f</code> (slide 40):</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main() {
    double rectangleWidth, rectangleHeight;
    double rectangleArea, rectanglePerimeter;

    printf("Nhap chieu rong va chieu cao: ");
    scanf("%lf%lf", &amp;rectangleWidth, &amp;rectangleHeight);

    rectangleArea      = rectangleWidth * rectangleHeight;
    rectanglePerimeter = 2 * (rectangleWidth + rectangleHeight);

    printf("Dien tich = %.2f\\n", rectangleArea);
    printf("Chu vi    = %.2f\\n", rectanglePerimeter);
    return 0;
}</code></pre>
<p class="dap-an">✅ Chạy tay với rộng = 5, cao = 3: diện tích = 5 × 3 = <strong>15.00</strong>; chu vi = 2 × (5 + 3) = 2 × 8 = <strong>16.00</strong>. Với rộng = 5,5 và cao = 2: diện tích = 11.00, chu vi = 15.00 — còn nếu khai báo <code>int</code> thì 5,5 bị cắt thành 5 và diện tích in ra 10.</p>
<p class="pitfall">⚠️ Đọc một <code>double</code> phải dùng <code>%lf</code>, không phải <code>%f</code>. Trong <code>scanf</code>, <code>%f</code> nghĩa là "đọc một <code>float</code>", và đưa địa chỉ của <code>double</code> cho nó thì chỉ 4 byte được ghi vào ô 8 byte — số ra sai mà không có một cảnh báo nào.</p>`],

      [26, 'Some operations on variables',
        `<p class="y-chinh">🎯 Whatever a program does with a variable, it is one of only <strong>four</strong> elementary operations — and the rest of this deck is simply the C syntax for each of them.</p>
<ul>
<li><strong>1. Assign a constant value to a variable</strong> — <code>x = 10;</code>. The literal 10 is baked into the executable by the compiler (slide 35) and copied into x's memory at run time.</li>
<li><strong>2. Assign the value of another variable</strong> — <code>y = x;</code>. This is a <em>copy</em>, not a link: afterwards changing x does not touch y. Slide 43 makes you say it out loud — the value flows from the <strong>right</strong> side to the <strong>left</strong> side.</li>
<li><strong>3. Output the value of a variable</strong> — <code>printf("%d", x);</code>. The binary content is converted to characters and pushed to the monitor (slide 39).</li>
<li><strong>4. Input a fresh value into the variable's memory location</strong> — <code>scanf("%d", &amp;x);</code>. Note the wording on the slide: <em>into the memory location</em>. That is why <code>scanf</code> needs the address operator <code>&amp;</code> and <code>printf</code> does not.</li>
<li><strong>Mapping back to slide 6</strong> — slide 6 said a variable has two basic operations, <em>set value</em> and <em>get value</em>. Operations 1, 2 and 4 are all "set"; operations 2 and 3 are "get". Everything else in programming is built from these two verbs.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main() {
    int x, y;

    x = 10;                    /* 1. constant  -&gt; variable */
    y = x;                     /* 2. variable  -&gt; variable */
    printf("x=%d y=%d\\n", x, y);   /* 3. variable -&gt; screen */

    printf("new x: ");
    scanf("%d", &amp;x);           /* 4. keyboard -&gt; variable  */
    printf("x=%d y=%d\\n", x, y);
    return 0;
}</code></pre>
<p class="dap-an">✅ If the user types 77: first line prints <code>x=10 y=10</code>; after the <code>scanf</code> the second line prints <code>x=77 y=10</code>. y did <em>not</em> follow x, because step 2 copied the value once and then the two variables went their separate ways.</p>
<p class="meo">💡 Whenever a program confuses you, label every statement with one of these four numbers. A twenty-line program usually collapses into "set, set, get, set, get" and stops being mysterious.</p>`,
        `<p class="y-chinh">🎯 Chương trình làm gì với một biến thì rốt cuộc cũng chỉ là một trong <strong>bốn</strong> thao tác sơ cấp — và phần còn lại của deck này chỉ là cú pháp C cho từng thao tác ấy.</p>
<ul>
<li><strong>1. Gán một hằng vào biến</strong> — <code>x = 10;</code>. Literal 10 được trình biên dịch nhúng thẳng vào tệp thực thi (slide 35) rồi chép vào vùng nhớ của x lúc chạy.</li>
<li><strong>2. Gán giá trị của một biến khác</strong> — <code>y = x;</code>. Đây là phép <em>sao chép</em>, không phải liên kết: sau đó đổi x không hề động tới y. Slide 43 bắt bạn nói thành lời — giá trị chảy từ vế <strong>phải</strong> sang vế <strong>trái</strong>.</li>
<li><strong>3. Xuất giá trị của biến</strong> — <code>printf("%d", x);</code>. Nội dung nhị phân được đổi thành ký tự rồi đẩy ra màn hình (slide 39).</li>
<li><strong>4. Nhập giá trị mới vào ô nhớ của biến</strong> — <code>scanf("%d", &amp;x);</code>. Chú ý cách slide diễn đạt: <em>vào ô nhớ</em>. Đó là lý do <code>scanf</code> cần toán tử địa chỉ <code>&amp;</code> còn <code>printf</code> thì không.</li>
<li><strong>Nối ngược về slide 6</strong> — slide 6 nói biến có hai thao tác cơ bản là <em>đặt giá trị</em> và <em>lấy giá trị</em>. Thao tác 1, 2, 4 đều là "đặt"; thao tác 2 và 3 là "lấy". Mọi thứ khác trong lập trình đều dựng từ hai động từ này.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main() {
    int x, y;

    x = 10;                    /* 1. hang    -&gt; bien   */
    y = x;                     /* 2. bien    -&gt; bien   */
    printf("x=%d y=%d\\n", x, y);   /* 3. bien -&gt; man hinh */

    printf("x moi: ");
    scanf("%d", &amp;x);           /* 4. ban phim -&gt; bien  */
    printf("x=%d y=%d\\n", x, y);
    return 0;
}</code></pre>
<p class="dap-an">✅ Nếu người dùng gõ 77: dòng đầu in <code>x=10 y=10</code>; sau lệnh <code>scanf</code>, dòng sau in <code>x=77 y=10</code>. y <em>không</em> chạy theo x, vì bước 2 chỉ chép giá trị đúng một lần rồi hai biến đi đường riêng.</p>
<p class="meo">💡 Gặp chương trình rối, hãy đánh số từng câu lệnh theo bốn loại này. Một chương trình hai chục dòng thường rút lại thành "đặt, đặt, lấy, đặt, lấy" và hết bí hiểm ngay.</p>`],

      [27, 'Example 1: Variable & Data Types',
        `<p class="y-chinh">🎯 The first complete program of the chapter: declare one variable of each arithmetic type, give each a value, and print them all with the matching conversion specifier.</p>
<ul>
<li><strong>Each type needs its own specifier</strong> — <code>%c</code> for <code>char</code>, <code>%d</code> for <code>int</code>, <code>%f</code> for <code>float</code>, <code>%lf</code> (or <code>%f</code>) for <code>double</code> in <code>printf</code>. The specifier tells <code>printf</code> how to <em>decode</em> the bytes; it is not decoration.</li>
<li><strong>Why the default float output has six decimals</strong> — <code>%f</code> prints six digits after the point unless you say otherwise. <code>3.5</code> comes out as <code>3.500000</code>. Use <code>%.2f</code> to get <code>3.50</code>.</li>
<li><strong>char prints two ways</strong> — the <em>same byte</em> shows as a symbol with <code>%c</code> and as a number with <code>%d</code>. This is slide 19 in action: a character is stored as its ASCII integer.</li>
<li><strong>Escape sequences already appear</strong> — the <code>\\n</code> at the end of each format string is what puts the next output on a new line (the full table is slide 33).</li>
<li><strong>Read the Output box on the slide</strong> — it is the marking scheme in miniature. In the practical exam you are judged on the exact characters your program prints, spaces included.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main() {
    char   grade = 'A';
    int    count = 100;
    float  price = 3.5f;
    double pi    = 3.14159265358979;

    printf("grade = %c  (ASCII %d)\\n", grade, grade);
    printf("count = %d\\n", count);
    printf("price = %f  -&gt; %.2f\\n", price, price);
    printf("pi    = %.6lf\\n", pi);
    return 0;
}</code></pre>
<p class="dap-an">✅ Output, line by line: <code>grade = A  (ASCII 65)</code> · <code>count = 100</code> · <code>price = 3.500000 -&gt; 3.50</code> · <code>pi    = 3.141593</code>. Note that <code>%.6lf</code> <em>rounds</em> 3.14159265… to 3.141593, it does not cut it.</p>
<p class="pitfall">⚠️ Mismatching the specifier does not cause a compile error in old compilers — it causes nonsense. <code>printf("%d", price)</code> reinterprets the bit pattern of a float as an integer and prints a huge random-looking number.</p>`,
        `<p class="y-chinh">🎯 Chương trình hoàn chỉnh đầu tiên của chương: khai báo mỗi kiểu số học một biến, gán giá trị, rồi in tất cả bằng đúng conversion specifier tương ứng.</p>
<ul>
<li><strong>Mỗi kiểu có specifier riêng</strong> — <code>%c</code> cho <code>char</code>, <code>%d</code> cho <code>int</code>, <code>%f</code> cho <code>float</code>, <code>%lf</code> (hoặc <code>%f</code>) cho <code>double</code> trong <code>printf</code>. Specifier bảo <code>printf</code> cách <em>giải mã</em> mấy byte đó; nó không phải đồ trang trí.</li>
<li><strong>Vì sao số thực mặc định in ra sáu chữ số thập phân</strong> — <code>%f</code> in sáu chữ số sau dấu chấm nếu bạn không nói khác. <code>3.5</code> hiện thành <code>3.500000</code>. Muốn ra <code>3.50</code> thì dùng <code>%.2f</code>.</li>
<li><strong>char in ra được hai kiểu</strong> — <em>cùng một byte</em> hiện ra ký hiệu với <code>%c</code> và hiện ra con số với <code>%d</code>. Đây chính là slide 19 đang chạy: ký tự được lưu bằng số nguyên ASCII của nó.</li>
<li><strong>Escape sequence đã xuất hiện</strong> — dấu <code>\\n</code> cuối mỗi chuỗi định dạng là thứ đẩy phần in tiếp theo xuống dòng mới (bảng đầy đủ ở slide 33).</li>
<li><strong>Đọc kỹ khung Output trên slide</strong> — đó là thang chấm điểm thu nhỏ. Trong bài thi thực hành, bạn bị chấm theo đúng từng ký tự chương trình in ra, kể cả dấu cách.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main() {
    char   grade = 'A';
    int    count = 100;
    float  price = 3.5f;
    double pi    = 3.14159265358979;

    printf("grade = %c  (ASCII %d)\\n", grade, grade);
    printf("count = %d\\n", count);
    printf("price = %f  -&gt; %.2f\\n", price, price);
    printf("pi    = %.6lf\\n", pi);
    return 0;
}</code></pre>
<p class="dap-an">✅ Kết quả từng dòng: <code>grade = A  (ASCII 65)</code> · <code>count = 100</code> · <code>price = 3.500000 -&gt; 3.50</code> · <code>pi    = 3.141593</code>. Để ý <code>%.6lf</code> <em>làm tròn</em> 3,14159265… thành 3,141593 chứ không cắt cụt.</p>
<p class="pitfall">⚠️ Đặt sai specifier thường không gây lỗi biên dịch ở trình biên dịch cũ — nó gây ra kết quả vô nghĩa. <code>printf("%d", price)</code> đọc lại chuỗi bit của một số thực như số nguyên và in ra một con số to đùng trông như ngẫu nhiên.</p>`],

      [28, 'Example 2: &amp; (address) and sizeof',
        `<p class="y-chinh">🎯 The two questions from slide 6 finally get their C answers: <strong>where is the variable?</strong> → the operator <code>&amp;</code>. <strong>How many bytes does it occupy?</strong> → the operator <code>sizeof</code>.</p>
<ul>
<li><strong>The <code>&amp;</code> operator</strong> — "address of". <code>&amp;x</code> is the number of the first byte of x in RAM. It is printed with <code>%p</code> (hexadecimal address) or, as the slide does, with <code>%d</code> to show it is just an integer.</li>
<li><strong>The <code>sizeof</code> operator</strong> — returns the number of bytes occupied by a variable or by a type: <code>sizeof(x)</code> and <code>sizeof(int)</code> are both legal. It is computed at compile time, so it costs nothing at run time.</li>
<li><strong>Typical results in Dev-C++ (32-bit)</strong> — <code>char</code> 1, <code>short</code> 2, <code>int</code> 4, <code>long</code> 4, <code>float</code> 4, <code>double</code> 8, <code>long double</code> 12. These are the numbers slides 8–11 promised, now measured instead of memorised.</li>
<li><strong>"&amp; String format" on the slide</strong> — the slide also reminds you that the first argument of <code>printf</code>/<code>scanf</code> is a <em>format string</em>, and that <code>&amp;</code> appears inside <code>scanf</code>'s argument list for exactly this reason: <code>scanf</code> must be told <em>where</em> to put the value.</li>
<li><strong>Why addresses change every run</strong> — the operating system loads the program at a different base each time (address-space randomisation), so do not be alarmed that your numbers differ from the slide's.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main() {
    char   c = 'A';
    int    n = 10;
    double d = 2.5;

    printf("c: value=%c addr=%p size=%d\\n", c, &amp;c, (int)sizeof(c));
    printf("n: value=%d addr=%p size=%d\\n", n, &amp;n, (int)sizeof(n));
    printf("d: value=%.1f addr=%p size=%d\\n", d, &amp;d, (int)sizeof(d));
    printf("sizeof(int)=%d sizeof(double)=%d\\n",
           (int)sizeof(int), (int)sizeof(double));
    return 0;
}</code></pre>
<p class="dap-an">✅ Sizes printed: 1, 4, 8, then <code>sizeof(int)=4 sizeof(double)=8</code>. The addresses differ on every machine and every run — only their <em>sizes</em> and their <em>relative order</em> are meaningful.</p>
<p class="meo">💡 Remember the pair as a question-and-answer: <code>&amp;</code> answers "where", <code>sizeof</code> answers "how big". Slot 10 (Pointers) is nothing but the systematic use of the first one.</p>`,
        `<p class="y-chinh">🎯 Hai câu hỏi từ slide 6 cuối cùng cũng có lời đáp bằng C: <strong>biến nằm ở đâu?</strong> → toán tử <code>&amp;</code>. <strong>Biến chiếm bao nhiêu byte?</strong> → toán tử <code>sizeof</code>.</p>
<ul>
<li><strong>Toán tử <code>&amp;</code></strong> — "địa chỉ của". <code>&amp;x</code> là số hiệu của byte đầu tiên của x trong RAM. In nó bằng <code>%p</code> (địa chỉ dạng thập lục phân) hoặc, như slide làm, bằng <code>%d</code> để cho thấy nó cũng chỉ là một số nguyên.</li>
<li><strong>Toán tử <code>sizeof</code></strong> — trả về số byte mà một biến hoặc một kiểu chiếm: <code>sizeof(x)</code> và <code>sizeof(int)</code> đều hợp lệ. Nó được tính lúc biên dịch nên không tốn gì lúc chạy.</li>
<li><strong>Kết quả điển hình trên Dev-C++ (32-bit)</strong> — <code>char</code> 1, <code>short</code> 2, <code>int</code> 4, <code>long</code> 4, <code>float</code> 4, <code>double</code> 8, <code>long double</code> 12. Đúng những con số slide 8–11 đã hứa, giờ được <em>đo</em> chứ không phải học thuộc.</li>
<li><strong>Dòng "&amp; String format" trên slide</strong> — slide nhắc thêm rằng tham số đầu của <code>printf</code>/<code>scanf</code> là một <em>chuỗi định dạng</em>, và <code>&amp;</code> xuất hiện trong danh sách tham số của <code>scanf</code> chính vì lẽ đó: phải chỉ cho <code>scanf</code> biết <em>đặt giá trị vào đâu</em>.</li>
<li><strong>Vì sao địa chỉ đổi sau mỗi lần chạy</strong> — hệ điều hành nạp chương trình ở một gốc khác nhau mỗi lần (ngẫu nhiên hoá không gian địa chỉ), nên đừng hoảng khi số của bạn khác số trên slide.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main() {
    char   c = 'A';
    int    n = 10;
    double d = 2.5;

    printf("c: gtri=%c dchi=%p co=%d\\n", c, &amp;c, (int)sizeof(c));
    printf("n: gtri=%d dchi=%p co=%d\\n", n, &amp;n, (int)sizeof(n));
    printf("d: gtri=%.1f dchi=%p co=%d\\n", d, &amp;d, (int)sizeof(d));
    printf("sizeof(int)=%d sizeof(double)=%d\\n",
           (int)sizeof(int), (int)sizeof(double));
    return 0;
}</code></pre>
<p class="dap-an">✅ Kích thước in ra: 1, 4, 8, rồi <code>sizeof(int)=4 sizeof(double)=8</code>. Địa chỉ thì khác nhau ở mỗi máy và mỗi lần chạy — chỉ <em>kích thước</em> và <em>thứ tự tương đối</em> mới có ý nghĩa.</p>
<p class="meo">💡 Nhớ cặp này như một cặp hỏi–đáp: <code>&amp;</code> trả lời "ở đâu", <code>sizeof</code> trả lời "to bằng nào". Slot 10 (Con trỏ) thực chất chỉ là việc dùng cái thứ nhất một cách có hệ thống.</p>`],

      [29, 'Questions as Summary — find the wrong declarations',
        `<p class="y-chinh">🎯 A six-question checkpoint closing the "Variables and Data types" block, with one item that is pure exam material: <strong>choose the wrong declarations</strong>.</p>
<ul>
<li><strong>Q1 — What is a variable?</strong> A name that refers to a memory location holding binary data, whose value can change while the program runs (slide 6).</li>
<li><strong>Q2 — What is a data type?</strong> A property attached to each variable that fixes how many bytes it occupies, how the value is encoded in those bytes, and how operations on it are performed (slide 7).</li>
<li><strong>Q3 — Characteristics of a data type are …… and ……</strong> → <em>how the values are stored</em> and <em>how the operations on those values are performed</em> (the exact wording of slide 7), plus the compiler-defined size in bytes.</li>
<li><strong>Q4 — The size of the int data type is …… bytes</strong> → <strong>4</strong> in a 32-bit environment (slide 8: "an int occupies one word; in a 32-bit environment, 4 bytes").</li>
<li><strong>Q5 — Choose the wrong declarations</strong>, one by one:
<code>int n = 10;</code> ✔ correct ·
<code>char c1, c2 = 'A';</code> ✔ correct (c1 simply stays uninitialised) ·
<code>int m = 19; k = 2;</code> ✘ <strong>wrong</strong> — <code>k</code> has no type ·
<code>char c3; int t;</code> ✔ correct (two separate statements) ·
<code>Float f1; f2 = 5.1;</code> ✘ <strong>wrong</strong> — <code>Float</code> with a capital F is not a C type, and <code>f2</code> is never declared.</li>
<li><strong>Q6 — Little-endian vs big-endian</strong> — the order in which the bytes of a multi-byte value are laid out. Little-endian stores the <em>least</em> significant byte at the lowest address (Intel x86); big-endian stores the <em>most</em> significant byte first (network byte order, older Motorola).</li>
</ul>
<pre><code>/* the two broken lines, repaired */
int m = 19, k = 2;        /* one type word covers both names */
float f1, f2 = 5.1f;      /* lowercase 'float', and f2 declared */

/* endianness of the 4-byte int 0x12345678 at address 1000 */
/* little-endian: 1000:78  1001:56  1002:34  1003:12          */
/* big-endian   : 1000:12  1001:34  1002:56  1003:78          */</code></pre>
<p class="dap-an">✅ Answer to Q5: the wrong declarations are <strong>#3 (<code>int m = 19; k = 2;</code>)</strong> and <strong>#5 (<code>Float f1; f2 = 5.1;</code>)</strong>. All three others compile.</p>
<p class="pitfall">⚠️ Line 3 is the nastiest because it <em>looks</em> like the legal <code>int m = 19, k = 2;</code>. The difference is one character: a semicolon ends the declaration, so <code>k</code> starts a brand-new statement with no type in front of it.</p>`,
        `<p class="y-chinh">🎯 Sáu câu hỏi chốt lại khối "Biến và kiểu dữ liệu", trong đó một câu là tài liệu ôn thi thuần tuý: <strong>chọn các khai báo sai</strong>.</p>
<ul>
<li><strong>Câu 1 — Biến là gì?</strong> Là một cái tên trỏ tới một ô nhớ chứa dữ liệu nhị phân, và giá trị của nó có thể thay đổi khi chương trình chạy (slide 6).</li>
<li><strong>Câu 2 — Kiểu dữ liệu là gì?</strong> Là thuộc tính gắn với mỗi biến, quy định biến chiếm bao nhiêu byte, giá trị được mã hoá thế nào trong mấy byte đó, và các phép toán trên nó được thực hiện ra sao (slide 7).</li>
<li><strong>Câu 3 — Đặc trưng của một kiểu dữ liệu là …… và ……</strong> → <em>cách lưu trữ giá trị</em> và <em>cách thực hiện các phép toán trên giá trị đó</em> (đúng câu chữ của slide 7), cộng thêm kích thước tính bằng byte do trình biên dịch quy định.</li>
<li><strong>Câu 4 — Kiểu int có kích thước …… byte</strong> → <strong>4</strong> trong môi trường 32-bit (slide 8: "int chiếm một word; môi trường 32-bit là 4 byte").</li>
<li><strong>Câu 5 — Chọn khai báo sai</strong>, xét từng dòng:
<code>int n = 10;</code> ✔ đúng ·
<code>char c1, c2 = 'A';</code> ✔ đúng (c1 chỉ là chưa được khởi tạo) ·
<code>int m = 19; k = 2;</code> ✘ <strong>SAI</strong> — <code>k</code> không có kiểu ·
<code>char c3; int t;</code> ✔ đúng (hai câu lệnh riêng biệt) ·
<code>Float f1; f2 = 5.1;</code> ✘ <strong>SAI</strong> — <code>Float</code> viết hoa chữ F không phải kiểu của C, và <code>f2</code> chưa hề được khai báo.</li>
<li><strong>Câu 6 — Little-endian và big-endian</strong> — là thứ tự sắp các byte của một giá trị nhiều byte. Little-endian đặt byte <em>thấp</em> nhất ở địa chỉ nhỏ nhất (Intel x86); big-endian đặt byte <em>cao</em> nhất trước (thứ tự byte của mạng, dòng Motorola cũ).</li>
</ul>
<pre><code>/* hai dong hong, da sua lai */
int m = 19, k = 2;        /* mot tu kieu phu cho ca hai ten   */
float f1, f2 = 5.1f;      /* 'float' viet thuong, va khai f2  */

/* thu tu byte cua so int 4 byte 0x12345678 tai dia chi 1000 */
/* little-endian: 1000:78  1001:56  1002:34  1003:12          */
/* big-endian   : 1000:12  1001:34  1002:56  1003:78          */</code></pre>
<p class="dap-an">✅ Đáp án câu 5: các khai báo sai là <strong>số 3 (<code>int m = 19; k = 2;</code>)</strong> và <strong>số 5 (<code>Float f1; f2 = 5.1;</code>)</strong>. Ba dòng còn lại biên dịch bình thường.</p>
<p class="pitfall">⚠️ Dòng 3 hiểm nhất vì nó <em>trông giống</em> dòng hợp lệ <code>int m = 19, k = 2;</code>. Khác nhau đúng một ký tự: dấu chấm phẩy kết thúc khai báo, nên <code>k</code> mở ra một câu lệnh hoàn toàn mới mà phía trước chẳng có kiểu nào.</p>`],

      [30, 'Section divider — Basic Memory Operations',
        `<p class="y-chinh">🎯 A divider slide opening the second block of the chapter. Everything from here to slide 44 is about <strong>getting values into memory and back out again</strong>.</p>
<ul>
<li><strong>Three sub-topics follow</strong> — <strong>1. Literals</strong> (slides 31–35), <strong>2. Named Constants</strong> (slides 36–38), <strong>3. Input/Output variables</strong> (slides 39–43), then Exercise 5 on slide 44.</li>
<li><strong>The connecting idea</strong> — slide 5 said the two basic operations on data are READ and WRITE. Block 1 (variables and types) built the <em>boxes</em>; this block fills them and reads them back.</li>
<li><strong>Why literals come first</strong> — the simplest way to put a value in memory is to write it directly in the source code. The compiler converts it to binary once, at compile time, and stores it in the executable.</li>
<li><strong>Why named constants come second</strong> — a literal repeated in twenty places is twenty places to edit. <code>const</code> and <code>#define</code> give that value a name, and the two mechanisms are fundamentally different (memory vs. text replacement).</li>
<li><strong>Why I/O comes last</strong> — it needs both: a format string (a string literal) and variables to hold what is typed. It also introduces the character-device conversion of slide 39, which is the real reason <code>%d</code> exists.</li>
</ul>
<p class="meo">💡 Use this divider as a self-check gate. If you cannot yet explain what <code>int x;</code> does to memory, go back to slides 23–29 before continuing — the rest of the chapter assumes it.</p>
<p class="pitfall">⚠️ Students often skim divider slides. This one carries the chapter's plan: three named sub-topics, in this exact order. Exam questions are frequently worded with these headings ("Explain the MACRO REPLACEMENT", "List the escape sequences").</p>`,
        `<p class="y-chinh">🎯 Slide phân cách mở ra khối thứ hai của chương. Từ đây tới slide 44 tất cả đều xoay quanh việc <strong>đưa giá trị vào bộ nhớ và lấy nó ra</strong>.</p>
<ul>
<li><strong>Ba tiểu mục tiếp theo</strong> — <strong>1. Literal</strong> (slide 31–35), <strong>2. Hằng có tên</strong> (slide 36–38), <strong>3. Nhập/xuất biến</strong> (slide 39–43), rồi Exercise 5 ở slide 44.</li>
<li><strong>Sợi dây nối</strong> — slide 5 đã nói hai thao tác cơ bản trên dữ liệu là ĐỌC và GHI. Khối 1 (biến và kiểu) dựng ra những cái <em>hộp</em>; khối này đổ đầy chúng rồi đọc lại.</li>
<li><strong>Vì sao literal đứng trước</strong> — cách đơn giản nhất để đặt một giá trị vào bộ nhớ là viết thẳng nó trong mã nguồn. Trình biên dịch đổi nó sang nhị phân đúng một lần, lúc biên dịch, rồi cất vào tệp thực thi.</li>
<li><strong>Vì sao hằng có tên đứng thứ hai</strong> — một literal lặp ở hai chục chỗ là hai chục chỗ phải sửa. <code>const</code> và <code>#define</code> đặt tên cho giá trị ấy, và hai cơ chế này khác nhau tận gốc (cấp phát bộ nhớ và thay thế văn bản).</li>
<li><strong>Vì sao nhập/xuất đứng cuối</strong> — nó cần cả hai thứ trên: một chuỗi định dạng (là string literal) và các biến để chứa thứ người dùng gõ vào. Nó cũng mở ra chuyện chuyển đổi ở thiết bị ký tự của slide 39 — lý do thật sự khiến <code>%d</code> tồn tại.</li>
</ul>
<p class="meo">💡 Hãy coi slide phân cách này là một cửa tự kiểm. Nếu bạn còn chưa giải thích được <code>int x;</code> làm gì với bộ nhớ thì quay lại slide 23–29 trước đã — phần sau mặc định bạn đã nắm.</p>
<p class="pitfall">⚠️ Sinh viên hay lướt qua slide phân cách. Riêng slide này mang kế hoạch của cả chương: ba tiểu mục, đúng thứ tự đó. Câu hỏi thi rất hay dùng lại chính mấy cái tiêu đề này ("Giải thích MACRO REPLACEMENT", "Liệt kê các escape sequence").</p>`],

      [31, '1. Literals — constant values written in the source code',
        `<p class="y-chinh">🎯 A <strong>literal</strong> is a constant value written directly in the source code. The compiler converts it to binary once and embeds it in the executable — it is never "computed" at run time.</p>
<ul>
<li><strong>Three families, as listed on the slide</strong> — <em>character literals</em> (constant characters), <em>string literals</em> (constant strings) and <em>number literals</em> (constant numbers). Slides 32–35 take them one at a time.</li>
<li><strong>Literal vs variable</strong> — a variable has a name, an address and a value you may change. A literal has only a value, no name and (for numbers) no address you can take. <code>&amp;10</code> is a compile error; <code>&amp;x</code> is not.</li>
<li><strong>Where you have already used them</strong> — every program so far is full of literals: <code>10</code> in <code>x = 10;</code>, <code>'A'</code> in <code>grade = 'A';</code>, and the whole format string <code>"count = %d\\n"</code> inside <code>printf</code>.</li>
<li><strong>Spot them in one line</strong> — <code>printf("n = %d\\n", 25);</code> contains <em>two</em> literals: the string <code>"n = %d\\n"</code> and the number <code>25</code>.</li>
<li><strong>Why this matters for size</strong> — the type of a literal decides how many bytes go into the executable, and slide 35 shows how to control that with suffixes.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main() {
    char   ch  = 'K';          /* character literal */
    char   msg[] = "Hello";    /* string literal    */
    int    n   = 25;           /* integer literal   */
    double r   = 1.75;         /* real literal      */

    printf("%c %s %d %.2f\\n", ch, msg, n, r);
    return 0;
}</code></pre>
<p class="dap-an">✅ Output: <code>K Hello 25 1.75</code>. Four literals, four different families, all fixed at compile time — nothing in this program can change 'K', "Hello", 25 or 1.75.</p>
<p class="meo">💡 Simple test for "is this a literal?": could you point at it in the printed source listing? <code>25</code> yes, <code>n</code> no. Literals are the things the compiler can read the value of without running anything.</p>`,
        `<p class="y-chinh">🎯 <strong>Literal</strong> là một giá trị hằng viết thẳng trong mã nguồn. Trình biên dịch đổi nó sang nhị phân đúng một lần rồi nhúng vào tệp thực thi — nó không bao giờ được "tính" lúc chạy.</p>
<ul>
<li><strong>Ba họ, đúng như slide liệt kê</strong> — <em>literal ký tự</em> (hằng ký tự), <em>literal chuỗi</em> (hằng chuỗi) và <em>literal số</em> (hằng số). Slide 32–35 sẽ đi từng họ một.</li>
<li><strong>Literal khác biến</strong> — biến có tên, có địa chỉ và có giá trị bạn đổi được. Literal chỉ có giá trị, không có tên, và (với số) không có địa chỉ để bạn lấy. <code>&amp;10</code> là lỗi biên dịch; <code>&amp;x</code> thì không.</li>
<li><strong>Bạn đã dùng chúng ở đâu</strong> — mọi chương trình tới giờ đều đầy literal: số <code>10</code> trong <code>x = 10;</code>, ký tự <code>'A'</code> trong <code>grade = 'A';</code>, và cả chuỗi định dạng <code>"count = %d\\n"</code> bên trong <code>printf</code>.</li>
<li><strong>Nhận diện trong một dòng</strong> — <code>printf("n = %d\\n", 25);</code> chứa <em>hai</em> literal: chuỗi <code>"n = %d\\n"</code> và số <code>25</code>.</li>
<li><strong>Vì sao chuyện này liên quan tới kích thước</strong> — kiểu của literal quyết định bao nhiêu byte đi vào tệp thực thi, và slide 35 chỉ cách điều khiển điều đó bằng hậu tố.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main() {
    char   ch  = 'K';          /* literal ky tu */
    char   msg[] = "Hello";    /* literal chuoi */
    int    n   = 25;           /* literal so nguyen */
    double r   = 1.75;         /* literal so thuc   */

    printf("%c %s %d %.2f\\n", ch, msg, n, r);
    return 0;
}</code></pre>
<p class="dap-an">✅ Kết quả: <code>K Hello 25 1.75</code>. Bốn literal, bốn họ khác nhau, tất cả đều cố định từ lúc biên dịch — không gì trong chương trình này đổi được 'K', "Hello", 25 hay 1.75.</p>
<p class="meo">💡 Phép thử đơn giản cho câu "cái này có phải literal không?": bạn có chỉ tay vào nó trên bản in mã nguồn được không? <code>25</code> thì được, <code>n</code> thì không. Literal là thứ trình biên dịch đọc ra giá trị mà chẳng cần chạy gì cả.</p>`],

      [32, 'Literals: Characters and Strings — four ways to write one character',
        `<p class="y-chinh">🎯 Because a character <em>is</em> its ASCII integer (slide 19), the same character can be written four different ways — and all four produce the identical byte.</p>
<ul>
<li><strong>Way 1 — single quotes</strong>: <code>'A'</code>. The natural form, and the one to use in real code.</li>
<li><strong>Way 2 — decimal ASCII code</strong>: <code>65</code> for 'A'. Plain decimal number, no prefix.</li>
<li><strong>Way 3 — octal ASCII code</strong>: <code>0101</code> for 'A'. A leading <strong>zero</strong> means base 8. Check: 0101₈ = 1×64 + 0×8 + 1×1 = <strong>65</strong> ✔</li>
<li><strong>Way 4 — hexadecimal ASCII code</strong>: <code>0x41</code> for 'A'. The prefix <code>0x</code> means base 16. Check: 0x41 = 4×16 + 1 = <strong>65</strong> ✔</li>
<li><strong>The assignment operator</strong> — the slide also names the tool that puts any of these into a variable: the operator <code>=</code>. It copies the value on the right into the variable on the left (see slide 43).</li>
<li><strong>Character vs string — the difference that costs marks</strong> — <code>'A'</code> is <strong>one byte</strong>; <code>"A"</code> is <strong>two bytes</strong>: 'A' followed by the terminating <code>'\\0'</code>. Single quotes and double quotes are not interchangeable in C.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main() {
    char c1 = 'A';      /* 1. quoted      */
    char c2 = 65;       /* 2. decimal     */
    char c3 = 0101;     /* 3. octal       */
    char c4 = 0x41;     /* 4. hexadecimal */

    printf("%c %c %c %c\\n", c1, c2, c3, c4);
    printf("%d %d %d %d\\n", c1, c2, c3, c4);
    printf("equal? %d\\n", (c1 == c2 &amp;&amp; c2 == c3 &amp;&amp; c3 == c4));
    return 0;
}</code></pre>
<p class="dap-an">✅ Output: <code>A A A A</code> then <code>65 65 65 65</code> then <code>equal? 1</code>. The four notations are four spellings of one number, 65 — the compiler resolves them all before the program even starts.</p>
<p class="pitfall">⚠️ A leading zero silently changes the base. <code>int x = 010;</code> is <strong>8</strong>, not 10. Writing <code>012</code> for "the twelfth item" is a real bug that compiles without a single warning.</p>`,
        `<p class="y-chinh">🎯 Vì một ký tự <em>chính là</em> số nguyên ASCII của nó (slide 19), cùng một ký tự viết được bằng bốn cách — và cả bốn cho ra đúng một byte giống hệt nhau.</p>
<ul>
<li><strong>Cách 1 — nháy đơn</strong>: <code>'A'</code>. Dạng tự nhiên, và là dạng nên dùng trong mã thật.</li>
<li><strong>Cách 2 — mã ASCII thập phân</strong>: <code>65</code> cho 'A'. Số thập phân thường, không tiền tố.</li>
<li><strong>Cách 3 — mã ASCII bát phân</strong>: <code>0101</code> cho 'A'. Số <strong>0</strong> đứng đầu nghĩa là cơ số 8. Kiểm lại: 0101₈ = 1×64 + 0×8 + 1×1 = <strong>65</strong> ✔</li>
<li><strong>Cách 4 — mã ASCII thập lục phân</strong>: <code>0x41</code> cho 'A'. Tiền tố <code>0x</code> nghĩa là cơ số 16. Kiểm lại: 0x41 = 4×16 + 1 = <strong>65</strong> ✔</li>
<li><strong>Toán tử gán</strong> — slide cũng gọi tên công cụ đưa bất kỳ dạng nào ở trên vào biến: toán tử <code>=</code>. Nó chép giá trị ở vế phải vào biến ở vế trái (xem slide 43).</li>
<li><strong>Ký tự khác chuỗi — chỗ khác nhau làm mất điểm</strong> — <code>'A'</code> là <strong>một byte</strong>; <code>"A"</code> là <strong>hai byte</strong>: 'A' rồi tới ký tự kết thúc <code>'\\0'</code>. Nháy đơn và nháy kép trong C không thay thế cho nhau được.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main() {
    char c1 = 'A';      /* 1. nhay don      */
    char c2 = 65;       /* 2. thap phan     */
    char c3 = 0101;     /* 3. bat phan      */
    char c4 = 0x41;     /* 4. thap luc phan */

    printf("%c %c %c %c\\n", c1, c2, c3, c4);
    printf("%d %d %d %d\\n", c1, c2, c3, c4);
    printf("bang nhau? %d\\n", (c1 == c2 &amp;&amp; c2 == c3 &amp;&amp; c3 == c4));
    return 0;
}</code></pre>
<p class="dap-an">✅ Kết quả: <code>A A A A</code>, rồi <code>65 65 65 65</code>, rồi <code>bang nhau? 1</code>. Bốn ký pháp chỉ là bốn cách viết của cùng con số 65 — trình biên dịch giải quyết hết trước khi chương trình kịp chạy.</p>
<p class="pitfall">⚠️ Số 0 đứng đầu âm thầm đổi cơ số. <code>int x = 010;</code> là <strong>8</strong>, không phải 10. Viết <code>012</code> cho "mục thứ mười hai" là một lỗi thật, và nó biên dịch không một lời cảnh báo.</p>`],

      [33, 'Literals: Escape Sequences',
        `<p class="y-chinh">🎯 Some characters cannot be typed inside quotes — a newline, a tab, a quote mark itself. C provides <strong>escape sequences</strong>: a backslash plus a letter, counted as <em>one</em> character.</p>
<ul>
<li><strong>The layout characters</strong> — <code>\\n</code> newline (move to the start of the next line), <code>\\t</code> horizontal tab, <code>\\r</code> carriage return (back to column 1 of the <em>same</em> line), <code>\\b</code> backspace, <code>\\f</code> form feed, <code>\\v</code> vertical tab.</li>
<li><strong>The "I need the symbol itself" group</strong> — <code>\\\\</code> a single backslash, <code>\\'</code> a single quote, <code>\\"</code> a double quote, <code>\\?</code> a question mark.</li>
<li><strong>The special ones</strong> — <code>\\a</code> alert/bell (the computer beeps), and <code>\\0</code> the null character, value 0, which is what terminates every C string.</li>
<li><strong>They are ONE character each</strong> — this is the fact exams test. <code>'\\n'</code> is a valid <code>char</code> literal; <code>sizeof("A\\nB")</code> is 4, not 5, because the array holds 'A', '\\n', 'B' and '\\0'.</li>
<li><strong>Why a backslash and not something else</strong> — the backslash is rare in ordinary text, so it can be reserved as the "the next character means something different" marker without getting in the way.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main() {
    printf("Name\\tMark\\n");
    printf("Anh\\t9.5\\n");
    printf("She said \\"hello\\"\\n");
    printf("Path: C:\\\\Temp\\\\data.txt\\n");
    printf("sizeof(\\"A\\\\nB\\") = %d\\n", (int)sizeof("A\\nB"));
    return 0;
}</code></pre>
<p class="dap-an">✅ Output, line by line: <code>Name····Mark</code> · <code>Anh·····9.5</code> · <code>She said "hello"</code> · <code>Path: C:\\Temp\\data.txt</code> · <code>sizeof("A\\nB") = 4</code> — three visible characters plus the invisible '\\0'. (The dots stand for the tab jump.)</p>
<p class="meo">💡 Group them by purpose when memorising: <em>move the cursor</em> (\\n \\t \\r \\b), <em>print the symbol</em> (\\\\ \\' \\" \\?), <em>special</em> (\\a \\0). Three small groups beat one long table.</p>`,
        `<p class="y-chinh">🎯 Có những ký tự không gõ được vào giữa hai dấu nháy — xuống dòng, dấu tab, hay chính dấu nháy. C cho ta <strong>escape sequence</strong>: một dấu gạch chéo ngược cộng một chữ cái, tính là <em>một</em> ký tự.</p>
<ul>
<li><strong>Nhóm ký tự trình bày</strong> — <code>\\n</code> xuống dòng (về đầu dòng kế tiếp), <code>\\t</code> tab ngang, <code>\\r</code> về đầu dòng (cột 1 của <em>chính</em> dòng đang đứng), <code>\\b</code> xoá lùi, <code>\\f</code> sang trang, <code>\\v</code> tab dọc.</li>
<li><strong>Nhóm "tôi cần chính ký hiệu đó"</strong> — <code>\\\\</code> một dấu gạch chéo ngược, <code>\\'</code> một dấu nháy đơn, <code>\\"</code> một dấu nháy kép, <code>\\?</code> một dấu hỏi.</li>
<li><strong>Nhóm đặc biệt</strong> — <code>\\a</code> chuông báo (máy kêu bíp), và <code>\\0</code> ký tự null, giá trị 0, chính là thứ kết thúc mọi chuỗi trong C.</li>
<li><strong>Mỗi cái là MỘT ký tự</strong> — đây là điều đề thi hay kiểm. <code>'\\n'</code> là literal <code>char</code> hợp lệ; <code>sizeof("A\\nB")</code> bằng 4 chứ không phải 5, vì mảng chứa 'A', '\\n', 'B' và '\\0'.</li>
<li><strong>Vì sao lại là dấu gạch chéo ngược</strong> — ký tự này hiếm gặp trong văn bản thường, nên có thể dành riêng làm dấu hiệu "ký tự tiếp theo mang nghĩa khác" mà không vướng víu gì.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main() {
    printf("Ten\\tDiem\\n");
    printf("Anh\\t9.5\\n");
    printf("Co ay noi \\"hello\\"\\n");
    printf("Duong dan: C:\\\\Temp\\\\data.txt\\n");
    printf("sizeof(\\"A\\\\nB\\") = %d\\n", (int)sizeof("A\\nB"));
    return 0;
}</code></pre>
<p class="dap-an">✅ Kết quả từng dòng: <code>Ten·····Diem</code> · <code>Anh·····9.5</code> · <code>Co ay noi "hello"</code> · <code>Duong dan: C:\\Temp\\data.txt</code> · <code>sizeof("A\\nB") = 4</code> — ba ký tự nhìn thấy cộng ký tự '\\0' vô hình. (Dấu chấm biểu thị bước nhảy của tab.)</p>
<p class="meo">💡 Học thuộc theo nhóm công dụng: <em>di chuyển con trỏ</em> (\\n \\t \\r \\b), <em>in ra chính ký hiệu</em> (\\\\ \\' \\" \\?), <em>đặc biệt</em> (\\a \\0). Ba nhóm nhỏ dễ nhớ hơn một bảng dài.</p>`],

      [34, 'Literals: Escape Sequences (cont.) — "Error! Why?"',
        `<p class="y-chinh">🎯 The slide shows a program that fails to print a Windows path, asks <strong>"Error! Why?"</strong>, and answers it with one instruction: <em>change <code>\\</code> to <code>\\\\</code> then run it.</em></p>
<ul>
<li><strong>The failing line</strong> — <code>printf("C:\\Temp\\new\\table.txt");</code>. It looks like plain text, but the compiler reads every backslash as the start of an escape sequence.</li>
<li><strong>What the compiler actually sees</strong> — <code>\\T</code> is not a defined escape (undefined behaviour / warning, usually printed as plain <code>T</code>), <code>\\n</code> becomes a <strong>newline</strong>, and <code>\\t</code> becomes a <strong>tab</strong>. So the output breaks into several lines with a tab in it instead of showing a path.</li>
<li><strong>The fix</strong> — double every backslash: <code>"C:\\\\Temp\\\\new\\\\table.txt"</code>. Now each <code>\\\\</code> is the escape sequence meaning "one literal backslash", and the text prints exactly as written.</li>
<li><strong>Why this is not a compiler bug</strong> — inside a string literal the backslash <em>always</em> has this meaning. The rule has no exceptions, which is what makes it predictable; you simply have to escape the escape character.</li>
<li><strong>Where it bites you later</strong> — file paths in Slot 19–20 (Files). <code>fopen("D:\\data\\numbers.txt", "r")</code> silently opens the wrong name and returns <code>NULL</code>, and beginners blame the file rather than the string.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main() {
    /* WRONG - \\T is undefined, \\n is newline, \\t is tab */
    printf("C:\\Temp\\new\\table.txt\\n");

    /* RIGHT - each \\\\ prints one backslash */
    printf("C:\\\\Temp\\\\new\\\\table.txt\\n");
    return 0;
}</code></pre>
<p class="dap-an">✅ First <code>printf</code> prints something like <code>C:Temp</code>, then a line break, then <code>ew</code>, then a tab, then <code>able.txt</code> — completely mangled. Second <code>printf</code> prints <code>C:\\Temp\\new\\table.txt</code>, exactly right. Answer to "Why?": <strong>the backslash is the escape character, so a literal backslash must itself be escaped.</strong></p>
<p class="pitfall">⚠️ The same trap hits <code>printf("100%")</code>: <code>%</code> starts a conversion specifier, so a literal percent sign must be written <code>%%</code> → <code>printf("100%%\\n")</code>. Two different characters, one identical lesson.</p>`,
        `<p class="y-chinh">🎯 Slide đưa ra một chương trình in đường dẫn Windows mà hỏng, hỏi <strong>"Error! Why?"</strong>, rồi tự trả lời bằng đúng một chỉ dẫn: <em>đổi <code>\\</code> thành <code>\\\\</code> rồi chạy lại.</em></p>
<ul>
<li><strong>Dòng bị hỏng</strong> — <code>printf("C:\\Temp\\new\\table.txt");</code>. Nhìn thì như văn bản thường, nhưng trình biên dịch đọc mỗi dấu gạch chéo ngược là điểm bắt đầu của một escape sequence.</li>
<li><strong>Trình biên dịch thật ra thấy gì</strong> — <code>\\T</code> không phải escape hợp lệ (hành vi không xác định / cảnh báo, thường in ra chữ <code>T</code> trơ), <code>\\n</code> thành <strong>xuống dòng</strong>, còn <code>\\t</code> thành <strong>tab</strong>. Thế là kết quả vỡ thành mấy dòng có chèn tab thay vì hiện ra một đường dẫn.</li>
<li><strong>Cách sửa</strong> — nhân đôi mọi dấu gạch chéo ngược: <code>"C:\\\\Temp\\\\new\\\\table.txt"</code>. Giờ mỗi cụm <code>\\\\</code> là escape sequence nghĩa là "một dấu gạch chéo ngược thật", và chữ in ra đúng y như viết.</li>
<li><strong>Vì sao đây không phải lỗi của trình biên dịch</strong> — bên trong string literal, dấu gạch chéo ngược <em>luôn luôn</em> mang nghĩa đó. Quy tắc không có ngoại lệ, và chính vì thế nó đoán trước được; bạn chỉ cần escape luôn cái ký tự escape.</li>
<li><strong>Nó cắn bạn ở đâu về sau</strong> — đường dẫn tệp trong Slot 19–20 (Tệp tin). <code>fopen("D:\\data\\numbers.txt", "r")</code> âm thầm mở sai tên và trả về <code>NULL</code>, rồi người mới đổ lỗi cho cái tệp thay vì cho chuỗi.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main() {
    /* SAI - \\T khong xac dinh, \\n la xuong dong, \\t la tab */
    printf("C:\\Temp\\new\\table.txt\\n");

    /* DUNG - moi cum \\\\ in ra mot dau gach cheo nguoc */
    printf("C:\\\\Temp\\\\new\\\\table.txt\\n");
    return 0;
}</code></pre>
<p class="dap-an">✅ Lệnh <code>printf</code> thứ nhất in ra đại khái <code>C:Temp</code>, rồi xuống dòng, rồi <code>ew</code>, rồi một dấu tab, rồi <code>able.txt</code> — nát hoàn toàn. Lệnh thứ hai in <code>C:\\Temp\\new\\table.txt</code>, đúng chính xác. Trả lời câu "Why?": <strong>dấu gạch chéo ngược chính là ký tự escape, nên muốn in ra nó thì phải escape chính nó.</strong></p>
<p class="pitfall">⚠️ Cùng cái bẫy đó dính vào <code>printf("100%")</code>: dấu <code>%</code> mở đầu một conversion specifier, nên muốn in dấu phần trăm thật phải viết <code>%%</code> → <code>printf("100%%\\n")</code>. Hai ký tự khác nhau, một bài học giống hệt.</p>`],

      [35, 'Literals: Numbers — default types and suffixes',
        `<p class="y-chinh">🎯 The compiler turns every numeric literal into binary and stores it in the executable. <strong>How many bits?</strong> That depends on the literal's type — and you control it with a <strong>suffix</strong>.</p>
<ul>
<li><strong>The two defaults</strong> — an integral literal such as <code>25</code> is an <strong><code>int</code></strong>; a real literal such as <code>3.14</code> is a <strong><code>double</code></strong>, not a float. This second default surprises everyone.</li>
<li><strong>Integer suffixes</strong> — <code>U</code>/<code>u</code> unsigned (<code>65535U</code>), <code>L</code>/<code>l</code> long (<code>100000L</code>), <code>LL</code> long long (<code>9000000000LL</code>), and they combine: <code>UL</code>, <code>ULL</code>.</li>
<li><strong>Real suffixes</strong> — <code>F</code>/<code>f</code> makes it a <code>float</code> (<code>3.14f</code>, 4 bytes), <code>L</code>/<code>l</code> makes it a <code>long double</code> (<code>3.14L</code>). No suffix = <code>double</code>, 8 bytes.</li>
<li><strong>Base prefixes still apply</strong> — from slide 32: no prefix = decimal, leading <code>0</code> = octal, leading <code>0x</code> = hexadecimal. So <code>0x1FUL</code> is an unsigned long with value 31.</li>
<li><strong>Why you should care</strong> — <code>float x = 3.14;</code> makes the compiler build a <em>double</em> literal and then truncate it to float on every assignment. Worse, <code>long total = 100000 * 50000;</code> multiplies two <em>ints</em>, overflows 32 bits, and stores the wrong answer into a long. Writing <code>100000L * 50000</code> fixes it.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main() {
    printf("%d %d %d %d\\n",
           (int)sizeof(25),      /* int     -&gt; 4 */
           (int)sizeof(25L),     /* long    -&gt; 4 (32-bit) */
           (int)sizeof(3.14),    /* double  -&gt; 8 */
           (int)sizeof(3.14f));  /* float   -&gt; 4 */

    long bad  = 100000 * 50000;       /* int * int overflows! */
    long good = 100000L * 50000;      /* long * int -&gt; long   */
    printf("bad=%ld good=%ld\\n", bad, good);
    return 0;
}</code></pre>
<p class="dap-an">✅ Sizes: <code>4 4 8 4</code>. Then 100000 × 50000 = 5 000 000 000, which does not fit in a 32-bit signed int (max 2 147 483 647), so <code>bad</code> prints a wrong, usually negative number, while <code>good</code> prints <strong>5000000000</strong>. The suffix changed the arithmetic, not just the storage.</p>
<p class="meo">💡 Rule of thumb: <em>suffix the literal, not the variable</em>. The type of a variable cannot rescue an expression that was already computed in the wrong type.</p>`,
        `<p class="y-chinh">🎯 Trình biên dịch đổi mọi literal số sang nhị phân rồi cất vào tệp thực thi. <strong>Bao nhiêu bit?</strong> Tuỳ kiểu của literal — và bạn điều khiển điều đó bằng <strong>hậu tố</strong>.</p>
<ul>
<li><strong>Hai mặc định</strong> — literal nguyên như <code>25</code> có kiểu <strong><code>int</code></strong>; literal thực như <code>3.14</code> có kiểu <strong><code>double</code></strong>, chứ không phải float. Cái mặc định thứ hai làm ai cũng bất ngờ.</li>
<li><strong>Hậu tố cho số nguyên</strong> — <code>U</code>/<code>u</code> không dấu (<code>65535U</code>), <code>L</code>/<code>l</code> long (<code>100000L</code>), <code>LL</code> long long (<code>9000000000LL</code>), và ghép được với nhau: <code>UL</code>, <code>ULL</code>.</li>
<li><strong>Hậu tố cho số thực</strong> — <code>F</code>/<code>f</code> biến nó thành <code>float</code> (<code>3.14f</code>, 4 byte), <code>L</code>/<code>l</code> biến nó thành <code>long double</code> (<code>3.14L</code>). Không hậu tố = <code>double</code>, 8 byte.</li>
<li><strong>Tiền tố cơ số vẫn còn hiệu lực</strong> — theo slide 32: không tiền tố = thập phân, bắt đầu bằng <code>0</code> = bát phân, bắt đầu bằng <code>0x</code> = thập lục phân. Nên <code>0x1FUL</code> là một unsigned long có giá trị 31.</li>
<li><strong>Vì sao phải quan tâm</strong> — <code>float x = 3.14;</code> khiến trình biên dịch dựng một literal <em>double</em> rồi cắt xuống float ở mỗi lần gán. Tệ hơn, <code>long total = 100000 * 50000;</code> nhân hai số <em>int</em>, tràn 32 bit, rồi cất kết quả sai vào một biến long. Viết <code>100000L * 50000</code> là xong.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main() {
    printf("%d %d %d %d\\n",
           (int)sizeof(25),      /* int     -&gt; 4 */
           (int)sizeof(25L),     /* long    -&gt; 4 (32-bit) */
           (int)sizeof(3.14),    /* double  -&gt; 8 */
           (int)sizeof(3.14f));  /* float   -&gt; 4 */

    long bad  = 100000 * 50000;       /* int * int bi tran! */
    long good = 100000L * 50000;      /* long * int -&gt; long */
    printf("bad=%ld good=%ld\\n", bad, good);
    return 0;
}</code></pre>
<p class="dap-an">✅ Kích thước: <code>4 4 8 4</code>. Rồi 100000 × 50000 = 5 000 000 000, không lọt vào int 32-bit có dấu (tối đa 2 147 483 647), nên <code>bad</code> in ra một số sai, thường là số âm, còn <code>good</code> in ra <strong>5000000000</strong>. Hậu tố đã đổi cả phép tính chứ không chỉ đổi chỗ chứa.</p>
<p class="meo">💡 Mẹo bỏ túi: <em>gắn hậu tố cho literal, đừng trông vào kiểu của biến</em>. Kiểu của biến không cứu nổi một biểu thức đã được tính sai kiểu từ trước.</p>`],

      [36, '2. Named Constants — the const keyword',
        `<p class="y-chinh">🎯 First way to give a constant a name: <code>const data_type constant_name = value;</code>. It is a real variable that the compiler <strong>refuses to let you modify</strong>.</p>
<ul>
<li><strong>The syntax, exactly as on the slide</strong> — <code>const</code> then the type, the name and a value: <code>const double PI = 3.14159;</code>. The initialisation is compulsory — you can never assign to it afterwards, so this is your only chance.</li>
<li><strong>It really occupies memory</strong> — unlike <code>#define</code> (slide 37), a <code>const</code> object has a type, a size and an address. <code>sizeof(PI)</code> is 8 and <code>&amp;PI</code> is legal.</li>
<li><strong>Type checking is the payoff</strong> — because it has a type, the compiler checks every use. Passing <code>PI</code> where an <code>int</code> is wanted triggers a proper diagnostic; with a macro you would only find out from a wrong result.</li>
<li><strong>Back to slide 12</strong> — "a type qualified as <code>const</code> is unmodifiable; if a program instruction attempts to modify it, the compiler will report an error." That error appears at compile time, which is the cheapest place to find a bug.</li>
<li><strong>Naming convention</strong> — constants are conventionally written in UPPERCASE (<code>PI</code>, <code>MAX_SIZE</code>, <code>VAT_RATE</code>) so a reader can tell at a glance that the value never moves.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main() {
    const double PI = 3.14159;
    double radius = 2.0;

    printf("area = %.4f\\n", PI * radius * radius);
    printf("size of PI = %d bytes\\n", (int)sizeof(PI));

    /* PI = 3.14;   &lt;-- error: assignment of read-only variable 'PI' */
    return 0;
}</code></pre>
<p class="dap-an">✅ area = 3.14159 × 2.0 × 2.0 = 3.14159 × 4 = <strong>12.5664</strong> (printed as <code>12.5664</code> with <code>%.4f</code>), and <code>size of PI = 8 bytes</code>. Uncommenting the assignment stops the build with <em>assignment of read-only variable</em>.</p>
<p class="meo">💡 Use <code>const</code> by default for named values inside a function. Reach for <code>#define</code> only where a macro is genuinely needed — for example an array size in older C, where a <code>const int</code> is not accepted as a constant expression.</p>`,
        `<p class="y-chinh">🎯 Cách thứ nhất để đặt tên cho một hằng: <code>const data_type constant_name = value;</code>. Nó là một biến thật, nhưng trình biên dịch <strong>không cho phép bạn sửa</strong>.</p>
<ul>
<li><strong>Cú pháp, đúng như trên slide</strong> — <code>const</code> rồi tới kiểu, tên và giá trị: <code>const double PI = 3.14159;</code>. Bắt buộc phải khởi tạo — sau đó bạn không gán được nữa, nên đây là cơ hội duy nhất.</li>
<li><strong>Nó thật sự chiếm bộ nhớ</strong> — khác với <code>#define</code> (slide 37), một đối tượng <code>const</code> có kiểu, có kích thước và có địa chỉ. <code>sizeof(PI)</code> bằng 8 và <code>&amp;PI</code> hợp lệ.</li>
<li><strong>Cái lợi lớn nhất là kiểm tra kiểu</strong> — vì nó có kiểu nên trình biên dịch kiểm mọi chỗ dùng. Đưa <code>PI</code> vào chỗ đang cần <code>int</code> sẽ có báo lỗi đàng hoàng; với macro thì bạn chỉ phát hiện qua một kết quả sai.</li>
<li><strong>Nối về slide 12</strong> — "kiểu được bổ nghĩa <code>const</code> là không sửa được; nếu một câu lệnh cố sửa nó, trình biên dịch sẽ báo lỗi". Lỗi ấy hiện ra lúc biên dịch, là chỗ rẻ nhất để bắt được bug.</li>
<li><strong>Quy ước đặt tên</strong> — hằng theo thông lệ viết IN HOA (<code>PI</code>, <code>MAX_SIZE</code>, <code>VAT_RATE</code>) để người đọc liếc qua là biết ngay giá trị này không bao giờ nhúc nhích.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main() {
    const double PI = 3.14159;
    double radius = 2.0;

    printf("dien tich = %.4f\\n", PI * radius * radius);
    printf("PI chiem %d byte\\n", (int)sizeof(PI));

    /* PI = 3.14;   &lt;-- error: assignment of read-only variable 'PI' */
    return 0;
}</code></pre>
<p class="dap-an">✅ Diện tích = 3,14159 × 2,0 × 2,0 = 3,14159 × 4 = <strong>12,5664</strong> (in ra <code>12.5664</code> với <code>%.4f</code>), và <code>PI chiem 8 byte</code>. Bỏ chú thích dòng gán thì bản dựng dừng lại với lỗi <em>assignment of read-only variable</em>.</p>
<p class="meo">💡 Mặc định hãy dùng <code>const</code> cho các giá trị có tên bên trong hàm. Chỉ với tay sang <code>#define</code> khi thật sự cần macro — ví dụ kích thước mảng trong C cũ, nơi một <code>const int</code> không được chấp nhận là biểu thức hằng.</p>`],

      [37, '2. Named Constants (cont.) — the #define directive',
        `<p class="y-chinh">🎯 Second way: the <strong>pre-processor directive</strong> <code>#define constant_name value</code>. Note what is missing — no type, no <code>=</code>, and <strong>no semicolon</strong>.</p>
<ul>
<li><strong>It is not a C statement</strong> — lines starting with <code>#</code> are handled by the <em>pre-processor</em>, a text-processing pass that runs <strong>before</strong> the compiler ever sees the file. That is the whole difference from <code>const</code>.</li>
<li><strong>The syntax, exactly as on the slide</strong> — <code>#define PI 3.14159</code>. Writing <code>#define PI = 3.14159;</code> is a classic error: the pre-processor would substitute the literal text "<code>= 3.14159;</code>" everywhere the name appears.</li>
<li><strong>Where it goes</strong> — conventionally at the top of the file, right after the <code>#include</code> lines, so the name is defined for the whole file including every function.</li>
<li><strong>No memory, no type</strong> — the name never exists at run time; by then it has already been replaced by its text. So <code>&amp;PI</code> is impossible, and <code>sizeof(PI)</code> means <code>sizeof(3.14159)</code> = <code>sizeof(double)</code> = 8.</li>
<li><strong>Its real strength</strong> — it works anywhere text works, including places where a variable is not allowed. In C89, <code>int a[MAX];</code> with <code>#define MAX 100</code> compiles, while <code>const int MAX = 100;</code> does not.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#define PI       3.14159
#define MAX      100
#define GREETING "Hello PRF192"

int main() {
    double r = 2.0;
    int a[MAX];                      /* legal: MAX is literally 100 */

    printf("%s\\n", GREETING);
    printf("area  = %.4f\\n", PI * r * r);
    printf("array = %d ints = %d bytes\\n", MAX, (int)sizeof(a));
    return 0;
}</code></pre>
<p class="dap-an">✅ Output: <code>Hello PRF192</code> · <code>area  = 12.5664</code> (3.14159 × 4) · <code>array = 100 ints = 400 bytes</code> (100 × 4). The array line is the point: <code>MAX</code> was a plain text "100" long before the compiler counted bytes.</p>
<p class="pitfall">⚠️ Never end a <code>#define</code> with a semicolon. <code>#define MAX 100;</code> turns <code>int a[MAX];</code> into <code>int a[100;];</code> — and the error message points at the array line, not at the <code>#define</code>, which is why it takes beginners so long to find.</p>`,
        `<p class="y-chinh">🎯 Cách thứ hai: <strong>chỉ thị tiền xử lý</strong> <code>#define constant_name value</code>. Để ý những thứ vắng mặt — không kiểu, không dấu <code>=</code>, và <strong>không dấu chấm phẩy</strong>.</p>
<ul>
<li><strong>Nó không phải câu lệnh C</strong> — các dòng bắt đầu bằng <code>#</code> do <em>bộ tiền xử lý</em> xử lý, một lượt xử lý văn bản chạy <strong>trước</strong> khi trình biên dịch nhìn thấy tệp. Đó chính là toàn bộ khác biệt so với <code>const</code>.</li>
<li><strong>Cú pháp, đúng như trên slide</strong> — <code>#define PI 3.14159</code>. Viết <code>#define PI = 3.14159;</code> là lỗi kinh điển: bộ tiền xử lý sẽ dán nguyên đoạn chữ "<code>= 3.14159;</code>" vào mọi chỗ có cái tên ấy.</li>
<li><strong>Đặt ở đâu</strong> — theo thông lệ là đầu tệp, ngay sau các dòng <code>#include</code>, để cái tên có hiệu lực cho cả tệp, gồm mọi hàm.</li>
<li><strong>Không bộ nhớ, không kiểu</strong> — cái tên không hề tồn tại lúc chạy; tới lúc đó nó đã bị thay bằng đoạn chữ của nó rồi. Vì vậy <code>&amp;PI</code> là bất khả, còn <code>sizeof(PI)</code> nghĩa là <code>sizeof(3.14159)</code> = <code>sizeof(double)</code> = 8.</li>
<li><strong>Sức mạnh thật của nó</strong> — nó chạy được ở mọi nơi chữ chạy được, kể cả những chỗ không cho dùng biến. Trong C89, <code>int a[MAX];</code> với <code>#define MAX 100</code> biên dịch được, còn <code>const int MAX = 100;</code> thì không.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#define PI       3.14159
#define MAX      100
#define GREETING "Hello PRF192"

int main() {
    double r = 2.0;
    int a[MAX];                      /* hop le: MAX la chu "100" */

    printf("%s\\n", GREETING);
    printf("dien tich = %.4f\\n", PI * r * r);
    printf("mang %d int = %d byte\\n", MAX, (int)sizeof(a));
    return 0;
}</code></pre>
<p class="dap-an">✅ Kết quả: <code>Hello PRF192</code> · <code>dien tich = 12.5664</code> (3,14159 × 4) · <code>mang 100 int = 400 byte</code> (100 × 4). Dòng mảng mới là điểm mấu chốt: <code>MAX</code> đã là đoạn chữ "100" từ rất lâu trước khi trình biên dịch đếm byte.</p>
<p class="pitfall">⚠️ Đừng bao giờ kết thúc <code>#define</code> bằng dấu chấm phẩy. <code>#define MAX 100;</code> biến <code>int a[MAX];</code> thành <code>int a[100;];</code> — và thông báo lỗi chỉ vào dòng khai báo mảng chứ không chỉ vào dòng <code>#define</code>, nên người mới tìm mãi không ra.</p>`],

      [38, '2. Named Constants (cont.) — MACRO REPLACEMENT',
        `<p class="y-chinh">🎯 The mechanism spelled out: with <code>#define</code>, <strong>no memory block is allocated</strong>. Every occurrence of the name in the source is <strong>replaced by its value before translation begins</strong> — this is the MACRO REPLACEMENT, and the name is called a MACRO.</p>
<ul>
<li><strong>The build pipeline</strong> — source → <em>pre-processor</em> (handles <code>#include</code>, <code>#define</code>, produces expanded text) → <em>compiler</em> (parses that text) → assembler → linker → executable. A macro dies at step 1.</li>
<li><strong>Consequence 1 — the debugger cannot see it</strong> — you cannot watch <code>PI</code> in a debugger, because by run time there is no such entity. With <code>const double PI</code> you can.</li>
<li><strong>Consequence 2 — no type checking</strong> — the pre-processor pastes text without understanding it, so a typo inside the value surfaces as a strange syntax error at every use site.</li>
<li><strong>Consequence 3 — the famous parenthesis trap</strong> — <code>#define SUM a + b</code> style macros expand textually and inherit the surrounding operators' precedence. Always wrap the value in parentheses.</li>
<li><strong>const vs #define, side by side</strong> — <code>const</code>: has type, has size, has address, respects scope, checked by the compiler. <code>#define</code>: no type, no size, no address, file-wide, pure text. Both give the value one name and one place to edit, which was the point.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#define HALF   1/2          /* DANGEROUS: no parentheses   */
#define HALF_OK (1.0/2.0)   /* safe: parenthesised, double */

int main() {
    printf("%d\\n",   10 * HALF);      /* becomes 10 * 1/2 */
    printf("%.1f\\n", 10 * HALF_OK);   /* becomes 10 * (1.0/2.0) */
    return 0;
}</code></pre>
<p class="dap-an">✅ First line: the text expands to <code>10 * 1/2</code>. <code>*</code> and <code>/</code> have equal precedence and associate left to right, so it is <code>(10 * 1) / 2</code> = 10 / 2 = <strong>5</strong> — which happens to look right. But <code>printf("%d", HALF * 10)</code> expands to <code>1/2 * 10</code> = <code>(1/2) * 10</code> = 0 × 10 = <strong>0</strong>. Second line: <code>10 * (1.0/2.0)</code> = <strong>5.0</strong> always, whatever surrounds it.</p>
<p class="pitfall">⚠️ The lesson of the pair: a macro is not a value, it is <em>text</em>, and text takes its meaning from its neighbours. Parenthesise every macro value — and if you do not need text substitution, use <code>const</code> instead.</p>`,
        `<p class="y-chinh">🎯 Cơ chế được nói thẳng: với <code>#define</code>, <strong>không có khối bộ nhớ nào được cấp phát</strong>. Mọi chỗ xuất hiện cái tên trong mã nguồn đều bị <strong>thay bằng giá trị của nó trước khi việc dịch bắt đầu</strong> — đó là MACRO REPLACEMENT, và cái tên ấy gọi là MACRO.</p>
<ul>
<li><strong>Dây chuyền dựng chương trình</strong> — mã nguồn → <em>bộ tiền xử lý</em> (xử lý <code>#include</code>, <code>#define</code>, sinh ra văn bản đã bung) → <em>trình biên dịch</em> (phân tích văn bản đó) → hợp dịch → liên kết → tệp thực thi. Một macro chết ngay ở bước 1.</li>
<li><strong>Hệ quả 1 — trình gỡ lỗi không thấy nó</strong> — bạn không theo dõi được <code>PI</code> trong debugger, vì tới lúc chạy chẳng còn thực thể nào tên như vậy. Với <code>const double PI</code> thì được.</li>
<li><strong>Hệ quả 2 — không kiểm tra kiểu</strong> — bộ tiền xử lý dán chữ mà không hiểu chữ, nên một lỗi gõ trong phần giá trị sẽ hiện ra thành lỗi cú pháp kỳ quặc ở từng chỗ sử dụng.</li>
<li><strong>Hệ quả 3 — cái bẫy dấu ngoặc nổi tiếng</strong> — macro kiểu <code>#define SUM a + b</code> bung ra theo văn bản và thừa hưởng độ ưu tiên của các toán tử xung quanh. Luôn bọc phần giá trị trong ngoặc tròn.</li>
<li><strong>const và #define, đặt cạnh nhau</strong> — <code>const</code>: có kiểu, có kích thước, có địa chỉ, tôn trọng phạm vi, được trình biên dịch kiểm. <code>#define</code>: không kiểu, không kích thước, không địa chỉ, có hiệu lực cả tệp, thuần văn bản. Cả hai đều cho giá trị một cái tên và một chỗ duy nhất để sửa, vốn là mục đích ban đầu.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#define HALF   1/2          /* NGUY HIEM: khong co ngoac   */
#define HALF_OK (1.0/2.0)   /* an toan: co ngoac, kieu double */

int main() {
    printf("%d\\n",   10 * HALF);      /* thanh 10 * 1/2 */
    printf("%.1f\\n", 10 * HALF_OK);   /* thanh 10 * (1.0/2.0) */
    return 0;
}</code></pre>
<p class="dap-an">✅ Dòng đầu: văn bản bung thành <code>10 * 1/2</code>. Toán tử <code>*</code> và <code>/</code> cùng độ ưu tiên và kết hợp từ trái sang, nên nó là <code>(10 * 1) / 2</code> = 10 / 2 = <strong>5</strong> — tình cờ đúng. Nhưng <code>printf("%d", HALF * 10)</code> bung thành <code>1/2 * 10</code> = <code>(1/2) * 10</code> = 0 × 10 = <strong>0</strong>. Dòng sau: <code>10 * (1.0/2.0)</code> = <strong>5.0</strong> trong mọi hoàn cảnh.</p>
<p class="pitfall">⚠️ Bài học của cặp ví dụ này: macro không phải một giá trị, nó là <em>văn bản</em>, mà văn bản thì lấy nghĩa từ hàng xóm xung quanh. Hãy bọc ngoặc mọi giá trị macro — và nếu không cần thay thế văn bản thì dùng <code>const</code>.</p>`],

      [39, '3. Input/Output variables — why conversion is needed',
        `<p class="y-chinh">🎯 The picture that explains everything about <code>printf</code> and <code>scanf</code>: the keyboard and the monitor are <strong>character devices</strong>, while the CPU calculates on <strong>binary numbers</strong>. Something must convert between the two, and that something is the conversion rules built into C.</p>
<ul>
<li><strong>Input path</strong> — you press the key "3". The keyboard sends the <em>ASCII code of the digit</em>, <code>00110011</code> (51). That is the character '3', not the number three. <code>scanf("%d", …)</code> converts it into the binary value <code>00000011</code> (3) and stores that in memory, ready for arithmetic.</li>
<li><strong>Output path</strong> — the variable holds <code>00000011</code>. The monitor cannot display a number, only characters, so <code>printf("%d", …)</code> converts 3 back into the character '3', code <code>00110011</code>, and sends that.</li>
<li><strong>Why the distinction is not pedantic</strong> — '3' + '3' is 51 + 51 = 102, which is the character 'f'. 3 + 3 is 6. Confusing the two is the root of most beginner I/O bugs.</li>
<li><strong>Multi-digit numbers</strong> — typing "25" sends <em>two</em> characters, '2' (50) and '5' (53). <code>%d</code> reads digit by digit and builds 2×10 + 5 = 25. That is why input conversion is a loop, not a single lookup.</li>
<li><strong>"Conversion rules are pre-defined in C"</strong> — you never write this code; you only choose which rule to apply, by picking a conversion specifier (slide 40).</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main() {
    char ch = '3';      /* the CHARACTER 3: ASCII 51 */
    int  n  = 3;        /* the NUMBER 3:    binary 11 */

    printf("ch as char=%c  as int=%d\\n", ch, ch);
    printf("n  as int =%d  as char=%c\\n", n, n);
    printf("ch+ch=%d   n+n=%d\\n", ch + ch, n + n);
    printf("digit value of ch = %d\\n", ch - '0');
    return 0;
}</code></pre>
<p class="dap-an">✅ Output: <code>ch as char=3  as int=51</code> · <code>n  as int =3  as char=</code>(an unprintable control character, ASCII 3) · <code>ch+ch=102   n+n=6</code> · <code>digit value of ch = 3</code>, because 51 − 48 = 3. That last trick, <code>ch - '0'</code>, converts a digit character into its numeric value and appears constantly in later slots.</p>
<p class="meo">💡 Say it as a sentence: <em>the keyboard speaks characters, the ALU speaks binary, and the conversion specifier is the interpreter between them.</em> Everything about <code>%d</code>, <code>%c</code>, <code>%f</code> follows from that one sentence.</p>`,
        `<p class="y-chinh">🎯 Bức hình giải thích mọi thứ về <code>printf</code> và <code>scanf</code>: bàn phím và màn hình là <strong>thiết bị ký tự</strong>, còn CPU tính toán trên <strong>số nhị phân</strong>. Phải có gì đó chuyển đổi giữa hai thế giới, và cái đó là các quy tắc chuyển đổi dựng sẵn trong C.</p>
<ul>
<li><strong>Đường vào</strong> — bạn bấm phím "3". Bàn phím gửi đi <em>mã ASCII của chữ số</em>, <code>00110011</code> (51). Đó là ký tự '3', không phải số ba. <code>scanf("%d", …)</code> đổi nó thành giá trị nhị phân <code>00000011</code> (3) rồi cất vào bộ nhớ, sẵn sàng để tính toán.</li>
<li><strong>Đường ra</strong> — biến đang giữ <code>00000011</code>. Màn hình không hiển thị được số, chỉ hiển thị được ký tự, nên <code>printf("%d", …)</code> đổi số 3 ngược lại thành ký tự '3', mã <code>00110011</code>, rồi gửi đi.</li>
<li><strong>Vì sao phân biệt này không phải chẻ sợi tóc</strong> — '3' + '3' bằng 51 + 51 = 102, tức ký tự 'f'. Còn 3 + 3 bằng 6. Lẫn lộn hai thứ này là gốc rễ của phần lớn lỗi nhập/xuất của người mới.</li>
<li><strong>Số nhiều chữ số</strong> — gõ "25" là gửi đi <em>hai</em> ký tự, '2' (50) và '5' (53). <code>%d</code> đọc từng chữ số rồi dựng ra 2×10 + 5 = 25. Vì thế việc chuyển đổi lúc nhập là một vòng lặp chứ không phải một phép tra bảng.</li>
<li><strong>"Quy tắc chuyển đổi đã định nghĩa sẵn trong C"</strong> — bạn không bao giờ phải viết đoạn mã đó; bạn chỉ chọn áp dụng quy tắc nào, bằng cách chọn conversion specifier (slide 40).</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main() {
    char ch = '3';      /* KY TU 3: ASCII 51    */
    int  n  = 3;        /* SO 3:    nhi phan 11 */

    printf("ch kieu char=%c  kieu int=%d\\n", ch, ch);
    printf("n  kieu int =%d  kieu char=%c\\n", n, n);
    printf("ch+ch=%d   n+n=%d\\n", ch + ch, n + n);
    printf("gia tri so cua ch = %d\\n", ch - '0');
    return 0;
}</code></pre>
<p class="dap-an">✅ Kết quả: <code>ch kieu char=3  kieu int=51</code> · <code>n  kieu int =3  kieu char=</code>(một ký tự điều khiển không in được, ASCII 3) · <code>ch+ch=102   n+n=6</code> · <code>gia tri so cua ch = 3</code>, vì 51 − 48 = 3. Mẹo cuối cùng ấy, <code>ch - '0'</code>, đổi một ký tự chữ số thành giá trị số của nó và sẽ xuất hiện liên tục ở các slot sau.</p>
<p class="meo">💡 Hãy nói thành một câu: <em>bàn phím nói tiếng ký tự, ALU nói tiếng nhị phân, và conversion specifier là người phiên dịch giữa hai bên.</em> Mọi chuyện về <code>%d</code>, <code>%c</code>, <code>%f</code> đều suy ra từ đúng câu đó.</p>`],

      [40, 'Conversion Specifiers',
        `<p class="y-chinh">🎯 The table of codes that tell <code>printf</code> and <code>scanf</code> <strong>which conversion rule to apply</strong>. Each one starts with <code>%</code> and names a type.</p>
<ul>
<li><strong>Integers</strong> — <code>%d</code> or <code>%i</code> signed decimal · <code>%u</code> unsigned decimal · <code>%o</code> octal · <code>%x</code> / <code>%X</code> hexadecimal · <code>%ld</code> long · <code>%lld</code> long long.</li>
<li><strong>Real numbers</strong> — <code>%f</code> fixed point · <code>%e</code> / <code>%E</code> scientific notation · <code>%g</code> whichever is shorter. In <code>printf</code>, <code>%f</code> serves both <code>float</code> and <code>double</code>; in <code>scanf</code> they differ (<code>%f</code> float, <code>%lf</code> double).</li>
<li><strong>Characters and strings</strong> — <code>%c</code> one character · <code>%s</code> a string (a char array ending in '\\0'). <code>%%</code> prints a literal percent sign, and <code>%p</code> prints an address.</li>
<li><strong>Width and precision</strong> — between <code>%</code> and the letter you may write a field width and a precision: <code>%5d</code> right-aligns in 5 columns, <code>%-5d</code> left-aligns, <code>%8.2f</code> uses 8 columns with 2 decimals, <code>%.3s</code> prints only the first 3 characters.</li>
<li><strong>Count them, always</strong> — the number of specifiers must equal the number of arguments after the format string, in the same order. A mismatch is not a compile error in C89; it is garbage output or a crash.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main() {
    int    n = 255;
    double x = 3.14159;
    char   c = 'A', s[] = "PRF192";

    printf("[%d] [%5d] [%-5d]\\n", n, n, n);
    printf("[%o] [%x] [%X] [%u]\\n", n, n, n, n);
    printf("[%f] [%.2f] [%8.2f] [%e]\\n", x, x, x, x);
    printf("[%c] [%s] [%.3s] [%%]\\n", c, s, s);
    return 0;
}</code></pre>
<p class="dap-an">✅ Line 1: <code>[255] [  255] [255  ]</code>. Line 2: 255 in octal is 377 and in hex is FF → <code>[377] [ff] [FF] [255]</code>. Line 3: <code>[3.141590] [3.14] [    3.14] [3.141590e+00]</code>. Line 4: <code>[A] [PRF192] [PRF] [%]</code>.</p>
<p class="pitfall">⚠️ <code>%d</code> with a <code>double</code> argument, or <code>%f</code> with an <code>int</code>, prints nonsense — <code>printf</code> is a variadic function and believes the format string absolutely. The compiler may warn, but it will still build.</p>`,
        `<p class="y-chinh">🎯 Bảng các mã báo cho <code>printf</code> và <code>scanf</code> biết <strong>áp dụng quy tắc chuyển đổi nào</strong>. Mỗi mã bắt đầu bằng <code>%</code> và gọi tên một kiểu.</p>
<ul>
<li><strong>Số nguyên</strong> — <code>%d</code> hoặc <code>%i</code> thập phân có dấu · <code>%u</code> thập phân không dấu · <code>%o</code> bát phân · <code>%x</code> / <code>%X</code> thập lục phân · <code>%ld</code> long · <code>%lld</code> long long.</li>
<li><strong>Số thực</strong> — <code>%f</code> dấu chấm tĩnh · <code>%e</code> / <code>%E</code> ký pháp khoa học · <code>%g</code> chọn dạng nào ngắn hơn. Trong <code>printf</code>, <code>%f</code> dùng cho cả <code>float</code> lẫn <code>double</code>; trong <code>scanf</code> thì khác nhau (<code>%f</code> cho float, <code>%lf</code> cho double).</li>
<li><strong>Ký tự và chuỗi</strong> — <code>%c</code> một ký tự · <code>%s</code> một chuỗi (mảng char kết thúc bằng '\\0'). <code>%%</code> in ra dấu phần trăm thật, còn <code>%p</code> in ra một địa chỉ.</li>
<li><strong>Độ rộng và độ chính xác</strong> — giữa <code>%</code> và chữ cái, bạn viết được độ rộng trường và độ chính xác: <code>%5d</code> canh phải trong 5 cột, <code>%-5d</code> canh trái, <code>%8.2f</code> dùng 8 cột với 2 chữ số thập phân, <code>%.3s</code> chỉ in 3 ký tự đầu.</li>
<li><strong>Luôn luôn đếm lại</strong> — số specifier phải bằng số tham số đứng sau chuỗi định dạng, và đúng thứ tự. Lệch nhau không phải lỗi biên dịch trong C89; nó là kết quả rác hoặc một cú sập.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main() {
    int    n = 255;
    double x = 3.14159;
    char   c = 'A', s[] = "PRF192";

    printf("[%d] [%5d] [%-5d]\\n", n, n, n);
    printf("[%o] [%x] [%X] [%u]\\n", n, n, n, n);
    printf("[%f] [%.2f] [%8.2f] [%e]\\n", x, x, x, x);
    printf("[%c] [%s] [%.3s] [%%]\\n", c, s, s);
    return 0;
}</code></pre>
<p class="dap-an">✅ Dòng 1: <code>[255] [  255] [255  ]</code>. Dòng 2: 255 ở bát phân là 377, ở thập lục phân là FF → <code>[377] [ff] [FF] [255]</code>. Dòng 3: <code>[3.141590] [3.14] [    3.14] [3.141590e+00]</code>. Dòng 4: <code>[A] [PRF192] [PRF] [%]</code>.</p>
<p class="pitfall">⚠️ Dùng <code>%d</code> cho tham số <code>double</code>, hay <code>%f</code> cho <code>int</code>, đều in ra thứ vô nghĩa — <code>printf</code> là hàm nhận số tham số thay đổi và nó tin tuyệt đối vào chuỗi định dạng. Trình biên dịch có thể cảnh báo, nhưng vẫn dựng ra chương trình.</p>`],

      [41, 'Example 1 — scanf and the address of a variable',
        `<p class="y-chinh">🎯 The slide draws the memory map and then rewrites the call: <code>scanf("%d%d", &amp;n, &amp;m)</code> really means <code>scanf("%d%d", 4210784, 2293620)</code> — "read keys, convert to decimal integers, and store them <strong>at these memory locations</strong>".</p>
<ul>
<li><strong>The three boxes on the slide</strong> — <code>n</code> at address 4210784, <code>m</code> at 2293620, and <code>main</code> itself at 4199056. Code and data both live in memory and both have addresses; only the code's address is never written to.</li>
<li><strong>Why <code>&amp;</code> is compulsory here</strong> — C passes arguments <em>by value</em>. If you wrote <code>scanf("%d", n)</code>, the function would receive a <em>copy</em> of n's current (garbage) value and would have no way to reach n itself. Passing <code>&amp;n</code> hands over the address, so <code>scanf</code> can write into the original box.</li>
<li><strong>The first argument is the format string</strong> — <code>"%d%d"</code> means "read two decimal integers". The number of specifiers must match the number of addresses that follow.</li>
<li><strong>Contrast with printf</strong> — <code>printf("%d", n)</code> only needs to <em>read</em> n, so the value is enough and no <code>&amp;</code> appears. Remembering <em>why</em> beats memorising "scanf has &amp;, printf does not".</li>
<li><strong>The one exception</strong> — when you read a string into a char array, you write <code>scanf("%s", name)</code> without <code>&amp;</code>, because an array name is already the address of its first element (Slot 13–15).</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main() {
    int n, m;

    printf("Enter two integers: ");
    scanf("%d%d", &amp;n, &amp;m);        /* addresses, not values */

    printf("n = %d at %p\\n", n, &amp;n);
    printf("m = %d at %p\\n", m, &amp;m);
    printf("sum = %d\\n", n + m);
    return 0;
}</code></pre>
<p class="dap-an">✅ With the input <code>7 5</code>: <code>n = 7 at 0x…</code>, <code>m = 5 at 0x…</code>, <code>sum = 12</code>. If you removed the two <code>&amp;</code>, the program would compile with a warning and then crash at run time — <code>scanf</code> would treat the garbage values of n and m as addresses and try to write there.</p>
<p class="pitfall">⚠️ The missing <code>&amp;</code> is the single most common run-time crash in PRF192. The symptom is characteristic: the program prints the prompt, you type a number, and it dies immediately.</p>`,
        `<p class="y-chinh">🎯 Slide vẽ sơ đồ bộ nhớ rồi viết lại lời gọi: <code>scanf("%d%d", &amp;n, &amp;m)</code> thực chất nghĩa là <code>scanf("%d%d", 4210784, 2293620)</code> — "đọc các phím gõ, đổi sang số nguyên thập phân, rồi cất vào <strong>mấy ô nhớ này</strong>".</p>
<ul>
<li><strong>Ba ô trên slide</strong> — <code>n</code> ở địa chỉ 4210784, <code>m</code> ở 2293620, và chính <code>main</code> ở 4199056. Mã lệnh và dữ liệu đều nằm trong bộ nhớ và đều có địa chỉ; chỉ có điều địa chỉ của mã thì không bao giờ bị ghi vào.</li>
<li><strong>Vì sao <code>&amp;</code> là bắt buộc ở đây</strong> — C truyền tham số <em>theo giá trị</em>. Nếu bạn viết <code>scanf("%d", n)</code>, hàm sẽ nhận một <em>bản sao</em> giá trị hiện tại (rác) của n và chẳng có cách nào chạm tới chính biến n. Truyền <code>&amp;n</code> là đưa cho nó địa chỉ, nhờ đó <code>scanf</code> ghi được vào đúng cái hộp gốc.</li>
<li><strong>Tham số đầu là chuỗi định dạng</strong> — <code>"%d%d"</code> nghĩa là "đọc hai số nguyên thập phân". Số specifier phải khớp với số địa chỉ đứng sau.</li>
<li><strong>Đối chiếu với printf</strong> — <code>printf("%d", n)</code> chỉ cần <em>đọc</em> n, nên chỉ cần giá trị và không có <code>&amp;</code> nào. Nhớ <em>vì sao</em> tốt hơn nhiều so với học vẹt "scanf có &amp;, printf không có".</li>
<li><strong>Một ngoại lệ duy nhất</strong> — khi đọc chuỗi vào mảng char, bạn viết <code>scanf("%s", name)</code> không có <code>&amp;</code>, vì tên mảng vốn đã là địa chỉ phần tử đầu tiên (Slot 13–15).</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main() {
    int n, m;

    printf("Nhap hai so nguyen: ");
    scanf("%d%d", &amp;n, &amp;m);        /* dia chi, khong phai gia tri */

    printf("n = %d tai %p\\n", n, &amp;n);
    printf("m = %d tai %p\\n", m, &amp;m);
    printf("tong = %d\\n", n + m);
    return 0;
}</code></pre>
<p class="dap-an">✅ Với dữ liệu nhập <code>7 5</code>: <code>n = 7 tai 0x…</code>, <code>m = 5 tai 0x…</code>, <code>tong = 12</code>. Nếu bỏ hai dấu <code>&amp;</code>, chương trình vẫn biên dịch kèm cảnh báo rồi sập lúc chạy — <code>scanf</code> sẽ coi giá trị rác của n và m là địa chỉ và cố ghi vào đó.</p>
<p class="pitfall">⚠️ Thiếu dấu <code>&amp;</code> là nguyên nhân sập lúc chạy phổ biến nhất của PRF192. Triệu chứng rất đặc trưng: chương trình in ra câu nhắc, bạn gõ một số, rồi nó chết ngay lập tức.</p>`],

      [42, 'Example 2 — format string, data holders, and separators',
        `<p class="y-chinh">🎯 The two I/O patterns you will use all semester, written out on the slide: <code>scanf("input format", &amp;var1, &amp;var2, …)</code> and <code>printf("output format", var1, var2, …)</code>. And one fact about typing: <strong>scanf treats BLANK and ENTER as separators.</strong></p>
<ul>
<li><strong>Two parts to every call</strong> — the <em>format string</em> (what to convert, and for <code>printf</code> the surrounding text), then the <em>data holders</em>: addresses for <code>scanf</code>, values for <code>printf</code>.</li>
<li><strong>Separators</strong> — with <code>scanf("%d%d", &amp;n, &amp;m)</code> the user may type <code>7 5</code>⏎ or <code>7</code>⏎<code>5</code>⏎ or even several blank lines between them. Numeric specifiers skip any amount of leading whitespace, so both styles work identically.</li>
<li><strong>The exception that catches everyone</strong> — <code>%c</code> does <strong>not</strong> skip whitespace. After reading a number, the ENTER key is still sitting in the input buffer, so the next <code>scanf("%c", &amp;ch)</code> silently reads that newline instead of waiting. The fix is a space in the format: <code>scanf(" %c", &amp;ch)</code>.</li>
<li><strong>Never put <code>\\n</code> in a scanf format</strong> — it does not mean "wait for Enter"; it means "skip whitespace", and it makes the program appear to hang until you type something else.</li>
<li><strong>printf is the mirror image</strong> — everything in the format string that is not a specifier is printed verbatim, which is how you build labelled output.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main() {
    int  age;
    char grade;

    printf("Age and grade: ");
    scanf("%d", &amp;age);
    scanf(" %c", &amp;grade);      /* the space skips the leftover ENTER */

    printf("age = %d, grade = %c\\n", age, grade);
    return 0;
}</code></pre>
<p class="dap-an">✅ Typing <code>20 A</code>⏎ gives <code>age = 20, grade = A</code>. Remove the space from <code>" %c"</code> and the output becomes <code>age = 20, grade = </code> followed by a blank — because <code>grade</code> received the newline character left over from typing 20.</p>
<p class="meo">💡 Habit worth forming today: write <code>" %c"</code> with a leading space <em>every single time</em> you read a character. It costs one keystroke and removes an entire category of bug.</p>`,
        `<p class="y-chinh">🎯 Hai khuôn mẫu nhập/xuất bạn sẽ dùng suốt kỳ, được viết sẵn trên slide: <code>scanf("input format", &amp;var1, &amp;var2, …)</code> và <code>printf("output format", var1, var2, …)</code>. Cùng một sự thật về cách gõ: <strong>scanf coi phím CÁCH và phím ENTER là dấu phân tách.</strong></p>
<ul>
<li><strong>Mỗi lời gọi có hai phần</strong> — <em>chuỗi định dạng</em> (chuyển đổi cái gì, và với <code>printf</code> là cả phần chữ bao quanh), rồi tới <em>chỗ chứa dữ liệu</em>: địa chỉ với <code>scanf</code>, giá trị với <code>printf</code>.</li>
<li><strong>Dấu phân tách</strong> — với <code>scanf("%d%d", &amp;n, &amp;m)</code>, người dùng gõ <code>7 5</code>⏎ hay <code>7</code>⏎<code>5</code>⏎ hay thậm chí chen mấy dòng trống cũng được. Các specifier số bỏ qua mọi khoảng trắng đứng trước, nên hai cách gõ cho kết quả y hệt.</li>
<li><strong>Ngoại lệ bẫy tất cả mọi người</strong> — <code>%c</code> <strong>không</strong> bỏ qua khoảng trắng. Sau khi đọc một con số, phím ENTER vẫn còn nằm trong bộ đệm nhập, nên lệnh <code>scanf("%c", &amp;ch)</code> tiếp theo âm thầm đọc đúng cái ký tự xuống dòng đó thay vì chờ. Cách sửa là thêm một dấu cách vào chuỗi định dạng: <code>scanf(" %c", &amp;ch)</code>.</li>
<li><strong>Đừng bao giờ đặt <code>\\n</code> trong chuỗi định dạng của scanf</strong> — nó không có nghĩa "chờ bấm Enter"; nó có nghĩa "bỏ qua khoảng trắng", và nó làm chương trình trông như treo cho tới khi bạn gõ thêm thứ khác.</li>
<li><strong>printf là hình ảnh phản chiếu</strong> — mọi thứ trong chuỗi định dạng mà không phải specifier đều được in nguyên văn, và đó là cách bạn dựng ra kết quả có nhãn.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main() {
    int  age;
    char grade;

    printf("Tuoi va hang: ");
    scanf("%d", &amp;age);
    scanf(" %c", &amp;grade);      /* dau cach bo qua ENTER con sot lai */

    printf("tuoi = %d, hang = %c\\n", age, grade);
    return 0;
}</code></pre>
<p class="dap-an">✅ Gõ <code>20 A</code>⏎ cho ra <code>tuoi = 20, hang = A</code>. Bỏ dấu cách trong <code>" %c"</code> đi thì kết quả thành <code>tuoi = 20, hang = </code> rồi trống trơn — vì <code>grade</code> đã nhận đúng ký tự xuống dòng còn sót lại từ lúc gõ số 20.</p>
<p class="meo">💡 Một thói quen nên tập ngay hôm nay: cứ đọc ký tự là viết <code>" %c"</code> có dấu cách đứng trước, <em>không bỏ lần nào</em>. Tốn đúng một lần gõ phím mà loại bỏ được cả một họ lỗi.</p>`],

      [43, 'Question — the parameters of scanf/printf, and the direction of =',
        `<p class="y-chinh">🎯 Two questions that ask you to <strong>say the mechanism out loud</strong>: explain the parameters of <code>scanf(…)</code> and <code>printf(…)</code>, and describe assignment using the words "left" and "right".</p>
<ul>
<li><strong>Question 1, <code>printf</code></strong> — parameter 1 is the <em>output format string</em>: ordinary text printed verbatim, plus conversion specifiers marking where values go and how to convert them. Parameters 2, 3, … are the <em>values</em> to print, matched to the specifiers left to right. No <code>&amp;</code>, because printing only reads.</li>
<li><strong>Question 1, <code>scanf</code></strong> — parameter 1 is the <em>input format string</em>: which conversions to perform, in order. Parameters 2, 3, … are <em>addresses</em> of the variables that will receive the values, hence the <code>&amp;</code>. <code>scanf</code> must write into your variables, and only an address lets it do that.</li>
<li><strong>Question 2 — the answer, in the required words</strong> — the assignment <code>x = y;</code> copies the value on the <strong>RIGHT</strong> side into the variable on the <strong>LEFT</strong> side.</li>
<li><strong>Consequences of that direction</strong> — the left side must be something that can be written to (a variable), so <code>5 = x;</code> and <code>x + 1 = 7;</code> are errors. The right side may be any expression that produces a value.</li>
<li><strong>= is not ==</strong> — <code>=</code> assigns, <code>==</code> compares (slide 50). <code>if (x = 5)</code> compiles, assigns 5 to x and is always true; <code>if (x == 5)</code> is the test you meant.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main() {
    int x = 1, y = 9;

    x = y;          /* RIGHT (9) copied into LEFT (x) */
    printf("x=%d y=%d\\n", x, y);

    y = 100;        /* changing y now does NOT change x */
    printf("x=%d y=%d\\n", x, y);
    return 0;
}</code></pre>
<p class="dap-an">✅ Output: <code>x=9 y=9</code> then <code>x=9 y=100</code>. The assignment was a one-time copy, right to left; afterwards the two variables are independent. And the summary answer: <em>printf takes a format string plus values; scanf takes a format string plus addresses; <code>=</code> copies right into left.</em></p>
<p class="pitfall">⚠️ In mathematics <code>x = y</code> states an equality that holds both ways. In C it is an instruction with a direction. Reading <code>=</code> as the word "becomes" instead of "equals" prevents most beginner confusion.</p>`,
        `<p class="y-chinh">🎯 Hai câu hỏi bắt bạn <strong>nói thành lời cơ chế</strong>: giải thích các tham số của <code>scanf(…)</code> và <code>printf(…)</code>, rồi mô tả phép gán bằng đúng hai chữ "trái" và "phải".</p>
<ul>
<li><strong>Câu 1, phần <code>printf</code></strong> — tham số 1 là <em>chuỗi định dạng đầu ra</em>: phần chữ thường được in nguyên văn, cộng các conversion specifier đánh dấu chỗ đặt giá trị và cách chuyển đổi. Tham số 2, 3, … là các <em>giá trị</em> cần in, ghép với specifier theo thứ tự từ trái sang phải. Không có <code>&amp;</code>, vì in ra chỉ là đọc.</li>
<li><strong>Câu 1, phần <code>scanf</code></strong> — tham số 1 là <em>chuỗi định dạng đầu vào</em>: thực hiện những phép chuyển đổi nào, theo thứ tự nào. Tham số 2, 3, … là <em>địa chỉ</em> của các biến sẽ nhận giá trị, nên mới có dấu <code>&amp;</code>. <code>scanf</code> buộc phải ghi vào biến của bạn, mà chỉ địa chỉ mới cho nó làm được điều đó.</li>
<li><strong>Câu 2 — trả lời bằng đúng hai chữ được yêu cầu</strong> — phép gán <code>x = y;</code> chép giá trị ở vế <strong>PHẢI</strong> vào biến ở vế <strong>TRÁI</strong>.</li>
<li><strong>Hệ quả của chiều đó</strong> — vế trái phải là thứ ghi vào được (một biến), nên <code>5 = x;</code> và <code>x + 1 = 7;</code> đều là lỗi. Vế phải thì là biểu thức bất kỳ miễn sinh ra được một giá trị.</li>
<li><strong>= không phải ==</strong> — <code>=</code> là gán, <code>==</code> là so sánh (slide 50). <code>if (x = 5)</code> vẫn biên dịch, nó gán 5 cho x và luôn luôn đúng; <code>if (x == 5)</code> mới là phép kiểm bạn định viết.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main() {
    int x = 1, y = 9;

    x = y;          /* PHAI (9) duoc chep vao TRAI (x) */
    printf("x=%d y=%d\\n", x, y);

    y = 100;        /* doi y luc nay KHONG lam doi x   */
    printf("x=%d y=%d\\n", x, y);
    return 0;
}</code></pre>
<p class="dap-an">✅ Kết quả: <code>x=9 y=9</code> rồi <code>x=9 y=100</code>. Phép gán là một lần chép duy nhất, từ phải sang trái; sau đó hai biến độc lập với nhau. Và câu trả lời gói gọn: <em>printf nhận chuỗi định dạng cộng các giá trị; scanf nhận chuỗi định dạng cộng các địa chỉ; dấu <code>=</code> chép phải sang trái.</em></p>
<p class="pitfall">⚠️ Trong toán học, <code>x = y</code> là một đẳng thức đúng theo cả hai chiều. Trong C nó là một mệnh lệnh có chiều. Đọc dấu <code>=</code> thành chữ "trở thành" thay vì "bằng" sẽ dẹp được phần lớn sự bối rối của người mới.</p>`],

      [44, 'Exercise 5 — values, addresses, memory map, and the vanishing ENTER',
        `<p class="y-chinh">🎯 The closing exercise of the block: declare <strong>2 ints, 2 floats and 2 doubles</strong>, read values for all six, print each value <em>and</em> its address, and draw the program's memory map. Then answer the trap question about <code>getchar()</code>.</p>
<ul>
<li><strong>Step 1 — the declarations</strong> — six variables, three types. Total memory on <code>main</code>'s stack frame: 2×4 (int) + 2×4 (float) + 2×8 (double) = 8 + 8 + 16 = <strong>32 bytes</strong>.</li>
<li><strong>Step 2 — reading them</strong> — <code>%d</code> for the ints, <code>%f</code> for the floats, <code>%lf</code> for the doubles. Getting these wrong in <code>scanf</code> is the most common way this exercise fails.</li>
<li><strong>Step 3 — printing value and address</strong> — <code>printf("i1 = %d at %p\\n", i1, &amp;i1);</code>. The addresses are typically 4 or 8 apart, in declaration or reverse-declaration order depending on the compiler — that <em>is</em> the memory map the exercise asks you to write down.</li>
<li><strong>Step 4 — the question: "Why does the user not have a chance to press ENTER before the program terminates?"</strong> The last <code>scanf</code> consumed the digits you typed but left the <strong>newline</strong> character in the input buffer. The following <code>getchar()</code> finds that newline already waiting, returns immediately, and the window closes.</li>
<li><strong>Step 5 — the fix</strong> — flush the leftover newline first, then pause: <code>while (getchar() != '\\n');</code> followed by <code>getchar();</code>. Two calls, because the first one eats the leftover and the second one really waits.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main() {
    int    i1, i2;
    float  f1, f2;
    double d1, d2;

    printf("2 ints, 2 floats, 2 doubles: ");
    scanf("%d%d%f%f%lf%lf", &amp;i1, &amp;i2, &amp;f1, &amp;f2, &amp;d1, &amp;d2);

    printf("i1=%d   at %p  (%d bytes)\\n", i1, &amp;i1, (int)sizeof(i1));
    printf("i2=%d   at %p  (%d bytes)\\n", i2, &amp;i2, (int)sizeof(i2));
    printf("f1=%.2f at %p  (%d bytes)\\n", f1, &amp;f1, (int)sizeof(f1));
    printf("f2=%.2f at %p  (%d bytes)\\n", f2, &amp;f2, (int)sizeof(f2));
    printf("d1=%.2lf at %p (%d bytes)\\n", d1, &amp;d1, (int)sizeof(d1));
    printf("d2=%.2lf at %p (%d bytes)\\n", d2, &amp;d2, (int)sizeof(d2));

    while (getchar() != '\\n');   /* eat the leftover ENTER */
    getchar();                   /* now really wait        */
    return 0;
}</code></pre>
<p class="dap-an">✅ With the input <code>1 2 1.5 2.5 3.5 4.5</code>, the program prints the six values with sizes 4, 4, 4, 4, 8, 8 — total 32 bytes — and six addresses spaced by those sizes. Answer to the exercise question: <strong>the ENTER key you already pressed was still in the input buffer, so <code>getchar()</code> read it instead of waiting for a new one.</strong></p>
<p class="meo">💡 This exercise is the whole chapter in one program: declarations (23), naming (23), the <code>&amp;</code> and <code>sizeof</code> operators (28), format specifiers (40), addresses passed to <code>scanf</code> (41), and the input-buffer behaviour of slide 42. If you can write it from memory, the block is finished.</p>`,
        `<p class="y-chinh">🎯 Bài tập khép lại cả khối: khai báo <strong>2 int, 2 float và 2 double</strong>, nhập giá trị cho cả sáu, in ra từng giá trị <em>kèm</em> địa chỉ, rồi vẽ sơ đồ bộ nhớ của chương trình. Sau đó trả lời câu hỏi bẫy về <code>getchar()</code>.</p>
<ul>
<li><strong>Bước 1 — khai báo</strong> — sáu biến, ba kiểu. Tổng bộ nhớ trên khung ngăn xếp của <code>main</code>: 2×4 (int) + 2×4 (float) + 2×8 (double) = 8 + 8 + 16 = <strong>32 byte</strong>.</li>
<li><strong>Bước 2 — nhập</strong> — <code>%d</code> cho int, <code>%f</code> cho float, <code>%lf</code> cho double. Đặt sai mấy specifier này trong <code>scanf</code> là cách hỏng bài phổ biến nhất.</li>
<li><strong>Bước 3 — in giá trị kèm địa chỉ</strong> — <code>printf("i1 = %d tai %p\\n", i1, &amp;i1);</code>. Các địa chỉ thường cách nhau 4 hoặc 8, theo thứ tự khai báo hoặc ngược lại tuỳ trình biên dịch — và đó <em>chính là</em> sơ đồ bộ nhớ mà đề bài yêu cầu ghi lại.</li>
<li><strong>Bước 4 — câu hỏi: "Vì sao người dùng không kịp bấm ENTER trước khi chương trình kết thúc?"</strong> Lệnh <code>scanf</code> cuối cùng đã ăn hết các chữ số bạn gõ nhưng để lại ký tự <strong>xuống dòng</strong> trong bộ đệm nhập. Lệnh <code>getchar()</code> ngay sau đó thấy sẵn ký tự ấy đang chờ, trả về ngay lập tức, và cửa sổ đóng lại.</li>
<li><strong>Bước 5 — cách sửa</strong> — dọn sạch ký tự xuống dòng còn sót trước, rồi mới dừng: <code>while (getchar() != '\\n');</code> tiếp theo là <code>getchar();</code>. Hai lời gọi, vì cái thứ nhất ăn phần thừa còn cái thứ hai mới thật sự chờ.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main() {
    int    i1, i2;
    float  f1, f2;
    double d1, d2;

    printf("2 int, 2 float, 2 double: ");
    scanf("%d%d%f%f%lf%lf", &amp;i1, &amp;i2, &amp;f1, &amp;f2, &amp;d1, &amp;d2);

    printf("i1=%d   tai %p  (%d byte)\\n", i1, &amp;i1, (int)sizeof(i1));
    printf("i2=%d   tai %p  (%d byte)\\n", i2, &amp;i2, (int)sizeof(i2));
    printf("f1=%.2f tai %p  (%d byte)\\n", f1, &amp;f1, (int)sizeof(f1));
    printf("f2=%.2f tai %p  (%d byte)\\n", f2, &amp;f2, (int)sizeof(f2));
    printf("d1=%.2lf tai %p (%d byte)\\n", d1, &amp;d1, (int)sizeof(d1));
    printf("d2=%.2lf tai %p (%d byte)\\n", d2, &amp;d2, (int)sizeof(d2));

    while (getchar() != '\\n');   /* an not ENTER con sot */
    getchar();                   /* gio moi that su cho  */
    return 0;
}</code></pre>
<p class="dap-an">✅ Với dữ liệu nhập <code>1 2 1.5 2.5 3.5 4.5</code>, chương trình in ra sáu giá trị kèm kích thước 4, 4, 4, 4, 8, 8 — tổng 32 byte — và sáu địa chỉ cách nhau đúng bằng những kích thước đó. Trả lời câu hỏi của đề: <strong>phím ENTER bạn đã bấm trước đó vẫn còn nằm trong bộ đệm nhập, nên <code>getchar()</code> đọc luôn nó thay vì chờ một phím mới.</strong></p>
<p class="meo">💡 Bài tập này gói cả chương vào một chương trình: khai báo (23), đặt tên (23), toán tử <code>&amp;</code> và <code>sizeof</code> (28), conversion specifier (40), truyền địa chỉ cho <code>scanf</code> (41), và hành vi bộ đệm nhập của slide 42. Viết lại được nó từ trí nhớ là khối này đã xong.</p>`],
    ]),
  ].join('\n'),
};
