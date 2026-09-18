/**
 * PRF192 · Slot 10 — Pointers, học theo từng slide: PHẦN 1 (slide 1–18).
 * Deck 'prf5' (PRF5), 35 slide, ảnh đã render sẵn lên CDN images/academy/PRF192/v1/prf5/NNN.webp.
 *
 * Nội dung bám ĐÚNG chữ trích từ Slot_10_Pointers.pptx của trường
 * (/tmp/prf192-text/prf5.txt, slide 1→18) + các ảnh mã nguồn nhúng trong pptx
 * (slide 4, 10, 11, 12, 13, 15, 16, 17, 18 đặt code/bảng trong ẢNH, đã đọc trực tiếp).
 *
 * MỌI chương trình và bảng vết dưới đây đã được biên dịch thật bằng `cc -Wall` và chạy:
 *   · slide 11 (n / pn / ppn, *pn = 10 rồi **ppn = 20) → n lần lượt 7 → 10 → 20 ✓
 *   · slide 12 walkthrough → in "m = -30, n = 54" ✓ (khớp ảnh console trên slide)
 *   · slide 13 Exercise 1 → n = 19, m = -11, printf("%d", m+n) in 8 ✓
 *              Exercise 2 → n = 29, m = 171 (slide KHÔNG có printf, đã nêu rõ)
 *   · slide 14 ghi qua char* chỉ đổi 1 byte thấp: 0x41424344 → 0x41424300 ✓
 *   · slide 15 explicit casting → in "n=260" rồi "n=256" ✓ (khớp console trên slide)
 *   · slide 17 so sánh con trỏ trong cùng mảng → < > <= >= == != và hiệu 2 phần tử ✓
 *   · slide 18 số học con trỏ → char +1 byte, int +4 byte, double +8 byte ✓
 *     (khớp đúng ba dòng số 6487559/6487552/6487544 trên ảnh console của slide)
 *   · `printf("%d", p)` → cc -Wall cho -Wformat ✓
 *   · con trỏ chưa khởi tạo rồi `*p = 7` → -Wuninitialized và chương trình CHẾT (exit 138) ✓
 *
 * ⚠ Hai chỗ slide gốc ghi sai, đã nêu trong bài, KHÔNG tự sửa slide:
 *   · slide 10, ô bên phải ghi "pn = 10000" sau khi `*pn = 100` — pn KHÔNG đổi, nó vẫn là
 *     6684188 (địa chỉ của n). Giá trị 100 được ghi vào n, không ghi vào pn.
 *   · slide 13 Exercise 2 thiếu câu printf mà vẫn hỏi "What is the output?".
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'prf5';

export default {
  title: '6.0a — Slide by slide: What a pointer is, the & and * operators, pointer arithmetic (slides 1–18)|||6.0a — Slide bài giảng: Con trỏ là gì, toán tử & và *, số học con trỏ (slide 1–18)',
  slug: 'prf192-6-0a-slides-con-tro-co-ban',
  type: 'DOCUMENT',
  description: 'Nửa đầu Slot 10 (slide 1–18): ôn lại bốn vùng nhớ của một chương trình C, câu hỏi mở đầu "địa chỉ cũng là một con số, vậy có cất được nó vào biến khác không?", rồi định nghĩa con trỏ, cú pháp khai báo, lý do dùng con trỏ, hai toán tử & và * kèm ví dụ con trỏ hai cấp và một bài walkthrough đầy đủ bảng vết. Khép lại bằng phần lưu ý khi truy cập qua con trỏ, ép kiểu tường minh, số học con trỏ và so sánh con trỏ. Mọi chương trình trong bài đã được biên dịch bằng cc -Wall và chạy thật để đối chiếu từng con số.',
  content: [
    walkHead(D, 1, 18),
    walk(D, [
      [1, 'Pointers (title slide)',
        `<p class="y-chinh">🎯 The title slide of Slot 10. One word — <strong>Pointers</strong> — and it is the word that splits PRF192 into "before" and "after". Everything up to Slot 09 treated a variable as a box with a name. From here on, a variable also has an <em>address</em>, and that address is itself a value you can store, pass and follow.</p>
<ul>
<li><strong>Why this slot exists at all</strong> — C passes every argument <em>by value</em>. A function therefore cannot change a caller's variable. Slide 22 states the problem in exactly those words. Pointers are the only mechanism C gives you to get around it, which is why they cannot be skipped.</li>
<li><strong>What you already own</strong> — you have used pointers without knowing it. Every <code>scanf("%d", &amp;n)</code> you have typed since Slot 02 passed an <em>address</em>. This slot finally explains what that <code>&amp;</code> was doing.</li>
<li><strong>The shape of the deck</strong> — slides 1–18 (this lesson) build the concept and the two operators; slides 19–35 apply it to functions and to dynamic memory (<code>malloc</code>, <code>calloc</code>, <code>realloc</code>, <code>free</code>).</li>
<li><strong>The honest warning</strong> — pointers are where C stops protecting you. A wrong <code>int</code> gives a wrong number; a wrong pointer gives a crash, or worse, silently corrupts a different variable. The care you invest in slides 14–15 pays for itself all semester.</li>
<li><strong>How to study this slot</strong> — with paper. Draw the memory: a column of addresses on the left, a column of values on the right. Slides 10, 12, 15 and 19 all do exactly that, and the exam questions are drawn the same way.</li>
</ul>
<p class="meo">💡 Keep one sentence in your head for the whole slot: <em>a pointer is a variable whose value is an address</em>. Every confusing line in this deck becomes readable once you ask "is this the address, or the thing at the address?"</p>`,
        `<p class="y-chinh">🎯 Slide tựa của Slot 10. Đúng một chữ — <strong>Pointers</strong> (con trỏ) — và đó là chữ chia đôi môn PRF192 thành "trước" và "sau". Từ đầu tới Slot 09, biến chỉ là một cái hộp có tên. Từ đây, biến còn có một <em>địa chỉ</em>, và địa chỉ ấy bản thân nó là một giá trị mà bạn cất được, truyền được, đi theo được.</p>
<ul>
<li><strong>Vì sao phải có slot này</strong> — C truyền mọi đối số <em>theo giá trị</em>. Vì thế hàm không sửa được biến của nơi gọi. Slide 22 nói đúng y như vậy. Con trỏ là cơ chế DUY NHẤT C cho bạn để lách qua chuyện đó, nên không bỏ qua được.</li>
<li><strong>Thứ bạn đã có sẵn</strong> — bạn đã dùng con trỏ mà không biết. Mỗi câu <code>scanf("%d", &amp;n)</code> gõ từ Slot 02 tới giờ đều đang truyền một <em>địa chỉ</em>. Slot này mới giải thích cái dấu <code>&amp;</code> đó làm gì.</li>
<li><strong>Hình dáng của cả deck</strong> — slide 1–18 (bài này) dựng khái niệm và hai toán tử; slide 19–35 đem áp vào hàm và vào bộ nhớ động (<code>malloc</code>, <code>calloc</code>, <code>realloc</code>, <code>free</code>).</li>
<li><strong>Lời cảnh báo thật lòng</strong> — con trỏ là chỗ C thôi che chở cho bạn. Một số <code>int</code> sai thì ra kết quả sai; một con trỏ sai thì sập chương trình, hoặc tệ hơn, âm thầm phá hỏng một biến khác. Công sức bạn bỏ ra ở slide 14–15 sẽ trả lãi suốt kỳ.</li>
<li><strong>Cách học slot này</strong> — bằng giấy. Vẽ bộ nhớ ra: cột địa chỉ bên trái, cột giá trị bên phải. Slide 10, 12, 15 và 19 đều vẽ đúng kiểu đó, và đề thi cũng vẽ đúng kiểu đó.</li>
</ul>
<p class="meo">💡 Giữ một câu duy nhất trong đầu suốt cả slot: <em>con trỏ là một biến mà giá trị của nó là một địa chỉ</em>. Mọi dòng khó hiểu trong deck này sẽ sáng ra khi bạn tự hỏi "chỗ này đang nói tới ĐỊA CHỈ, hay nói tới THỨ NẰM Ở địa chỉ?"</p>`],

      [2, 'Objectives',
        `<p class="y-chinh">🎯 Seven learning outcomes. Read them as a checklist you tick off, not as decoration — the final exam draws directly from lines 2, 3, 5 and 6 of this list.</p>
<ul>
<li><strong>"Understand where a program's data can be put"</strong> — that is slides 4–6: the four segments (code, data, stack, heap). You must be able to say which segment a given variable lives in, because it explains lifetime: a local dies when its function returns, a heap block does not.</li>
<li><strong>"Explain what are pointers" + "Declare pointers in a program"</strong> — slides 7 and 8. Declaring is one line of syntax (<code>dataType *name;</code>) but it hides the classic trap that <code>int *p, q;</code> makes only <code>p</code> a pointer.</li>
<li><strong>"Discuss about where pointers can be used"</strong> — slide 9's five situations. This is the "why bother" outcome; without it, pointers look like pointless indirection.</li>
<li><strong>"Understand operators on pointers"</strong> — the biggest one. It covers <code>&amp;</code> and <code>*</code> (slides 10–13), the size rules (14–15), arithmetic (16, 18–19) and comparison (17). Roughly half the slot.</li>
<li><strong>"Implement functions in which pointers are parameters"</strong> — slides 22–23, the payoff: a <code>swap</code> that actually swaps. Not in this lesson, but everything here is built for it.</li>
<li><strong>"Use built-in functions to allocate data dynamically"</strong> — slides 24–33, <code>malloc</code> / <code>calloc</code> / <code>realloc</code> / <code>free</code>.</li>
</ul>
<p class="meo">💡 Turn the list into questions and answer them out loud after you finish the slot: <em>Where does a local variable live? What is a pointer? How do I declare one? Why would I use one? What do &amp; and * do? How do I make a function change my variable? How do I ask for memory at run time?</em> Seven questions, seven objectives.</p>`,
        `<p class="y-chinh">🎯 Bảy mục tiêu học tập. Hãy đọc chúng như một danh sách để tích dần, đừng đọc như đồ trang trí — đề thi rút thẳng từ dòng 2, 3, 5 và 6 của danh sách này.</p>
<ul>
<li><strong>"Hiểu dữ liệu của chương trình đặt ở đâu"</strong> — đó là slide 4–6: bốn vùng (code, data, stack, heap). Bạn phải nói được một biến cho trước sống ở vùng nào, vì nó giải thích vòng đời: biến cục bộ chết khi hàm kết thúc, còn khối nhớ trên heap thì không.</li>
<li><strong>"Giải thích con trỏ là gì" + "Khai báo con trỏ"</strong> — slide 7 và 8. Khai báo chỉ là một dòng cú pháp (<code>dataType *tên;</code>) nhưng nó giấu cái bẫy kinh điển: <code>int *p, q;</code> thì chỉ <code>p</code> mới là con trỏ.</li>
<li><strong>"Bàn xem con trỏ dùng vào đâu"</strong> — năm tình huống ở slide 9. Đây là mục tiêu "để làm gì"; thiếu nó thì con trỏ trông như một lớp gián tiếp vô nghĩa.</li>
<li><strong>"Hiểu các toán tử trên con trỏ"</strong> — mục lớn nhất. Nó gồm <code>&amp;</code> và <code>*</code> (slide 10–13), quy tắc kích thước (14–15), số học (16, 18–19) và so sánh (17). Chiếm chừng nửa slot.</li>
<li><strong>"Cài đặt hàm có tham số là con trỏ"</strong> — slide 22–23, phần thu hoạch: một hàm <code>swap</code> hoán đổi được thật. Không nằm trong bài này, nhưng mọi thứ ở đây đều dựng để phục vụ nó.</li>
<li><strong>"Dùng hàm thư viện để cấp phát động"</strong> — slide 24–33, <code>malloc</code> / <code>calloc</code> / <code>realloc</code> / <code>free</code>.</li>
</ul>
<p class="meo">💡 Biến danh sách này thành câu hỏi rồi tự trả lời thành tiếng sau khi học xong slot: <em>Biến cục bộ sống ở đâu? Con trỏ là gì? Khai báo thế nào? Dùng để làm gì? &amp; và * làm gì? Làm sao để hàm sửa được biến của tôi? Làm sao xin bộ nhớ lúc đang chạy?</em> Bảy câu hỏi, bảy mục tiêu.</p>`],

      [3, 'Contents',
        `<p class="y-chinh">🎯 The table of contents, twelve entries. It is worth reading carefully because it is <em>also the summary slide</em> — slide 35 repeats this exact list. If you can explain all twelve lines, the slot is done.</p>
<ul>
<li><strong>Entries 1–2 (memory structure, where data goes)</strong> — slides 4–6. Groundwork: you cannot talk about addresses until you know what is at which address.</li>
<li><strong>Entries 3–5 (what pointers are, declarations, why used)</strong> — slides 7–9. The concept.</li>
<li><strong>Entries 6–8 (pointer operators, assign values to pointers, access data through pointer)</strong> — slides 10–13. Notice the deck splits "assign" from "access": <code>pn = &amp;n</code> writes into <em>pn itself</em>, while <code>*pn = 100</code> writes into <em>what pn points at</em>. Two different targets, one letter of difference.</li>
<li><strong>Entries 9–10 (arithmetic, comparisons)</strong> — slides 16–19. Arithmetic is the surprising one: <code>p + 1</code> does not add 1.</li>
<li><strong>Entry 11 (pointers as parameters)</strong> — slides 22–23, the reason the whole topic is in a first-semester course.</li>
<li><strong>Entry 12 (dynamic allocated data)</strong> — slides 24–34, and the bridge to arrays and strings in Slot 13–18.</li>
<li><strong>The two entries that are pure exam material</strong> — 9 and 10. Pointer arithmetic and pointer comparison are easy to test on paper (no computer needed), so they appear far more often than their share of the slides would suggest.</li>
</ul>
<p class="meo">💡 Copy these twelve lines onto the first page of your notes and leave three blank lines under each. You will fill them as the slot goes; at the end you own a one-page revision sheet for the whole topic.</p>`,
        `<p class="y-chinh">🎯 Mục lục, mười hai mục. Đáng đọc kỹ vì nó <em>đồng thời là slide tổng kết</em> — slide 35 lặp lại đúng danh sách này. Giải thích trôi cả mười hai dòng là xong slot.</p>
<ul>
<li><strong>Mục 1–2 (cấu trúc bộ nhớ, dữ liệu để ở đâu)</strong> — slide 4–6. Nền móng: chưa biết cái gì nằm ở địa chỉ nào thì chưa bàn được về địa chỉ.</li>
<li><strong>Mục 3–5 (con trỏ là gì, khai báo, vì sao dùng)</strong> — slide 7–9. Phần khái niệm.</li>
<li><strong>Mục 6–8 (toán tử con trỏ, gán giá trị cho con trỏ, truy cập dữ liệu qua con trỏ)</strong> — slide 10–13. Để ý deck tách "gán" khỏi "truy cập": <code>pn = &amp;n</code> ghi vào <em>chính pn</em>, còn <code>*pn = 100</code> ghi vào <em>thứ mà pn trỏ tới</em>. Hai đích khác hẳn nhau, khác nhau đúng một ký tự.</li>
<li><strong>Mục 9–10 (số học, so sánh)</strong> — slide 16–19. Số học là phần gây bất ngờ: <code>p + 1</code> không cộng thêm 1.</li>
<li><strong>Mục 11 (con trỏ làm tham số)</strong> — slide 22–23, chính là lý do cả chủ đề này nằm trong môn học kỳ đầu.</li>
<li><strong>Mục 12 (dữ liệu cấp phát động)</strong> — slide 24–34, và là cây cầu bắc sang mảng và chuỗi ở Slot 13–18.</li>
<li><strong>Hai mục thuần chất liệu thi</strong> — mục 9 và 10. Số học con trỏ và so sánh con trỏ dễ ra đề trên giấy (không cần máy), nên chúng xuất hiện nhiều hơn hẳn tỉ lệ số slide dành cho chúng.</li>
</ul>
<p class="meo">💡 Chép mười hai dòng này vào trang đầu vở rồi chừa ba dòng trống dưới mỗi mục. Học tới đâu điền tới đó; hết slot là bạn có sẵn một tờ ôn tập một trang cho cả chủ đề.</p>`],

      [4, '1 - Review the memory structure of a program',
        `<p class="y-chinh">🎯 A full program, its real console output, and a memory map drawn beside it — all on one slide. The point: <strong>every variable in that program has an address, and the addresses are not random</strong>; they cluster into four segments.</p>
<ul>
<li><strong>The program</strong> — a global <code>int myVar = 10;</code>, a function <code>double average(int a, int b)</code> that computes <code>(a+b)/2.0</code>, and a <code>main</code> with <code>int a = 5, b = 8;</code>. Each one prints its own address with <code>%u</code> and <code>&amp;</code>.</li>
<li><strong>Data segment — address 42026608 holds <code>myVar = 10</code></strong>. Globals live here. They exist from program start to program end, and every function can see them (slide 6 repeats this).</li>
<li><strong>Code segment — 4200002 is <code>main()</code>, 4199776 is <code>average()</code></strong>. Functions have addresses too; the slide prints them with <code>&amp;main</code> and <code>&amp;average</code>. Slide 5 will ask whether you can store those addresses as well.</li>
<li><strong>Stack segment — <code>a = 5</code> at 6684188, <code>b = 8</code> at 6684184 (in main); then <code>b = 8</code> at 6684152, <code>a = 5</code> at 6684144, <code>result = 6.500000</code> at 66841120 (in average)</strong>. Two <em>different</em> pairs a/b: the parameters of <code>average</code> are copies, at their own addresses. That is by-value passing, seen as numbers.</li>
<li><strong>Heap</strong> — drawn but empty, because this program never calls <code>malloc</code>. Slide 30 will fill it.</li>
<li><strong>The direction that matters</strong> — the stack addresses fall as you go deeper (main's a at 6684188, average's a at 6684144). The stack grows <em>downwards</em>; the heap grows upwards to meet it.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int myVar = 10;                  /* data segment */

double average(int a, int b) {   /* a, b are COPIES on the stack */
    double result;
    result = (a + b) / 2.0;
    printf("\\nIn average function\\n");
    printf("%-15s %-15s %-15s\\n", "Name", "Address", "Value");
    printf("%-15s %-15p %-15d\\n", "a", (void*)&amp;a, a);
    printf("%-15s %-15p %-15d\\n", "b", (void*)&amp;b, b);
    printf("%-15s %-15p %-15lf\\n", "result", (void*)&amp;result, result);
    return result;
}

int main(void) {
    int a = 5, b = 8;
    printf("In main function\\n");
    printf("%-15s %-15p %-15d\\n", "myVar", (void*)&amp;myVar, myVar);
    printf("%-15s %-15p %-15d\\n", "a", (void*)&amp;a, a);
    printf("%-15s %-15p %-15d\\n", "b", (void*)&amp;b, b);
    printf("Address of main(): %p\\n", (void*)&amp;main);
    printf("Result returned to main: %lf\\n", average(a, b));
    return 0;
}</code></pre>
<p class="dap-an">✅ Compiled and run: the numbers differ from the slide's (addresses depend on the machine and on each run), but the <strong>pattern always holds</strong> — <code>myVar</code> sits far from <code>a</code> and <code>b</code>; <code>a</code> and <code>b</code> inside <code>average</code> sit at lower addresses than <code>a</code> and <code>b</code> inside <code>main</code>; and <code>average(5,8)</code> returns 6.500000. Note the slide uses <code>%u</code> for addresses — that was fine on the 32-bit Dev-C++ of the original course; on a 64-bit compiler it truncates, so use <code>%p</code> with <code>(void*)</code>.</p>
<p class="pitfall">⚠️ Do not memorise the numbers 6684188 / 42026608. They are one run on one machine. What is examinable is the <em>relationship</em>: which segment, and which address is higher than which.</p>`,
        `<p class="y-chinh">🎯 Một chương trình đầy đủ, kết quả chạy thật của nó, và bản đồ bộ nhớ vẽ ngay bên cạnh — tất cả trên một slide. Ý chính: <strong>mọi biến trong chương trình đó đều có địa chỉ, và các địa chỉ không hề ngẫu nhiên</strong>; chúng tụ lại thành bốn vùng.</p>
<ul>
<li><strong>Chương trình</strong> — một biến toàn cục <code>int myVar = 10;</code>, một hàm <code>double average(int a, int b)</code> tính <code>(a+b)/2.0</code>, và <code>main</code> có <code>int a = 5, b = 8;</code>. Mỗi thứ đều tự in địa chỉ của mình bằng <code>%u</code> và <code>&amp;</code>.</li>
<li><strong>Data segment — địa chỉ 42026608 chứa <code>myVar = 10</code></strong>. Biến toàn cục sống ở đây. Chúng tồn tại từ lúc chương trình bắt đầu tới lúc kết thúc, và mọi hàm đều nhìn thấy (slide 6 nhắc lại điều này).</li>
<li><strong>Code segment — 4200002 là <code>main()</code>, 4199776 là <code>average()</code></strong>. Hàm cũng có địa chỉ; slide in chúng bằng <code>&amp;main</code> và <code>&amp;average</code>. Slide 5 sẽ hỏi liệu có cất được những địa chỉ đó không.</li>
<li><strong>Stack segment — <code>a = 5</code> ở 6684188, <code>b = 8</code> ở 6684184 (trong main); rồi <code>b = 8</code> ở 6684152, <code>a = 5</code> ở 6684144, <code>result = 6.500000</code> ở 66841120 (trong average)</strong>. Hai cặp a/b <em>khác nhau</em>: tham số của <code>average</code> là BẢN SAO, nằm ở địa chỉ riêng. Đó chính là truyền theo giá trị, nhìn thấy được bằng con số.</li>
<li><strong>Heap</strong> — có vẽ nhưng trống rỗng, vì chương trình này không gọi <code>malloc</code> lần nào. Slide 30 sẽ lấp đầy nó.</li>
<li><strong>Chiều đáng nhớ</strong> — địa chỉ trên stack GIẢM dần khi đi sâu vào (a của main ở 6684188, a của average ở 6684144). Stack mọc <em>xuống</em>; heap mọc lên phía đón nó.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int myVar = 10;                  /* data segment */

double average(int a, int b) {   /* a, b la BAN SAO tren stack */
    double result;
    result = (a + b) / 2.0;
    printf("\\nIn average function\\n");
    printf("%-15s %-15s %-15s\\n", "Name", "Address", "Value");
    printf("%-15s %-15p %-15d\\n", "a", (void*)&amp;a, a);
    printf("%-15s %-15p %-15d\\n", "b", (void*)&amp;b, b);
    printf("%-15s %-15p %-15lf\\n", "result", (void*)&amp;result, result);
    return result;
}

int main(void) {
    int a = 5, b = 8;
    printf("In main function\\n");
    printf("%-15s %-15p %-15d\\n", "myVar", (void*)&amp;myVar, myVar);
    printf("%-15s %-15p %-15d\\n", "a", (void*)&amp;a, a);
    printf("%-15s %-15p %-15d\\n", "b", (void*)&amp;b, b);
    printf("Address of main(): %p\\n", (void*)&amp;main);
    printf("Result returned to main: %lf\\n", average(a, b));
    return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch và chạy: các con số khác với trên slide (địa chỉ phụ thuộc máy và phụ thuộc từng lần chạy), nhưng <strong>khuôn mẫu thì luôn đúng</strong> — <code>myVar</code> nằm xa hẳn <code>a</code> và <code>b</code>; <code>a</code>, <code>b</code> bên trong <code>average</code> nằm ở địa chỉ thấp hơn <code>a</code>, <code>b</code> của <code>main</code>; và <code>average(5,8)</code> trả về 6.500000. Lưu ý slide dùng <code>%u</code> cho địa chỉ — chuyện đó ổn trên Dev-C++ 32-bit thời soạn giáo trình; với trình biên dịch 64-bit nó bị cắt cụt, nên hãy dùng <code>%p</code> kèm <code>(void*)</code>.</p>
<p class="pitfall">⚠️ Đừng học thuộc các con số 6684188 / 42026608. Đó là một lần chạy trên một cái máy. Thứ ra đề được là <em>quan hệ</em>: nằm vùng nào, và địa chỉ nào cao hơn địa chỉ nào.</p>`],

      [5, 'Question',
        `<p class="y-chinh">🎯 The same memory map as slide 4, now with the question that gives birth to the whole topic: <em>"Address of a variable is a number. Can we assign this number to another variable then access data through the new variable?"</em> — and the same question about the address of a function.</p>
<ul>
<li><strong>The reasoning is deliberately simple</strong> — slide 4 printed addresses with <code>%u</code>, i.e. as plain unsigned integers. If an address is just a number, then of course a variable can hold it. The slide is inviting you to derive pointers yourself rather than be handed them.</li>
<li><strong>The answer, in the slide's own words</strong> — <em>"Yes. We can access data through its address and call a function through its address also. POINTER is a way to satisfy these requirements."</em></li>
<li><strong>The scope note matters</strong> — <em>"In this chapter, pointers of variables are concerned only."</em> Function pointers (<code>double (*f)(int,int) = average;</code>) are real C and real exam material in later courses, but Slot 10 deliberately leaves them out. Do not go hunting for them here.</li>
<li><strong>Two questions, two answers, one mechanism</strong> — the same <code>&amp;</code> that gives <code>&amp;a = 6684188</code> also gives <code>&amp;main = 4200002</code>. C does not have a separate "address of function" operator.</li>
<li><strong>Why "access through the NEW variable" is the interesting half</strong> — storing a number is trivial. The magic is the second step: taking a number back and treating it as a place. That step is what <code>*</code> does, and it is the subject of slide 10.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    int a = 5;
    unsigned long addressAsNumber = (unsigned long)&amp;a;   /* an address IS a number */
    int *pa = &amp;a;                                        /* ... and a pointer stores it */

    printf("a        = %d\\n", a);
    printf("&amp;a       = %p\\n", (void*)&amp;a);
    printf("as number= %lu\\n", addressAsNumber);
    printf("pa       = %p\\n", (void*)pa);   /* same number */
    printf("*pa      = %d\\n", *pa);         /* back to the value: 5 */
    return 0;
}</code></pre>
<p class="dap-an">✅ Compiled and run: <code>&amp;a</code>, <code>addressAsNumber</code> and <code>pa</code> all print the same location, and <code>*pa</code> prints <code>5</code>. So the slide's answer is literally demonstrable in five lines. The difference between <code>addressAsNumber</code> and <code>pa</code> is that only <code>pa</code> remembers <em>what type</em> lives there — which is exactly why C has pointer types instead of just using <code>unsigned long</code> everywhere (slides 14–16 depend on that type information).</p>
<p class="meo">💡 Remember the pair of sentences the slide ends on. In an exam, "what is a pointer and why does C need one?" is answered perfectly by: <em>an address is a number; a pointer is the variable type that stores such a number and remembers what kind of data sits there.</em></p>`,
        `<p class="y-chinh">🎯 Vẫn bản đồ bộ nhớ của slide 4, nhưng lần này kèm câu hỏi khai sinh ra cả chủ đề: <em>"Địa chỉ của một biến là một con số. Vậy có gán được con số đó vào một biến khác rồi truy cập dữ liệu qua biến mới không?"</em> — và câu hỏi y hệt cho địa chỉ của hàm.</p>
<ul>
<li><strong>Lập luận cố ý đơn giản</strong> — slide 4 đã in địa chỉ bằng <code>%u</code>, tức là in ra như số nguyên không dấu thuần tuý. Nếu địa chỉ chỉ là một con số thì tất nhiên một biến cất được nó. Slide đang mời bạn tự suy ra con trỏ chứ không bê sẵn ra cho.</li>
<li><strong>Câu trả lời, đúng lời của slide</strong> — <em>"Có. Ta truy cập được dữ liệu qua địa chỉ của nó và cũng gọi được hàm qua địa chỉ của hàm. CON TRỎ là cách đáp ứng những yêu cầu đó."</em></li>
<li><strong>Dòng giới hạn phạm vi rất đáng lưu ý</strong> — <em>"Trong chương này chỉ xét con trỏ của biến."</em> Con trỏ hàm (<code>double (*f)(int,int) = average;</code>) là C thật và là chất liệu thi thật ở các môn sau, nhưng Slot 10 cố ý bỏ ra ngoài. Đừng đi tìm chúng ở đây.</li>
<li><strong>Hai câu hỏi, hai câu trả lời, một cơ chế</strong> — vẫn dấu <code>&amp;</code> cho ra <code>&amp;a = 6684188</code> ấy cũng cho ra <code>&amp;main = 4200002</code>. C không có toán tử "lấy địa chỉ hàm" riêng.</li>
<li><strong>Vì sao nửa "truy cập qua biến MỚI" mới là phần thú vị</strong> — cất một con số thì quá tầm thường. Phép màu nằm ở bước hai: cầm con số ấy về rồi coi nó như một CHỖ. Bước đó chính là việc của <code>*</code>, và là nội dung slide 10.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    int a = 5;
    unsigned long addressAsNumber = (unsigned long)&amp;a;   /* dia chi LA mot con so */
    int *pa = &amp;a;                                        /* ... va con tro cat no */

    printf("a        = %d\\n", a);
    printf("&amp;a       = %p\\n", (void*)&amp;a);
    printf("as number= %lu\\n", addressAsNumber);
    printf("pa       = %p\\n", (void*)pa);   /* cung mot con so */
    printf("*pa      = %d\\n", *pa);         /* quay ve gia tri: 5 */
    return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch và chạy: <code>&amp;a</code>, <code>addressAsNumber</code> và <code>pa</code> đều in ra cùng một vị trí, còn <code>*pa</code> in ra <code>5</code>. Vậy câu trả lời của slide chứng minh được đúng nghĩa đen bằng năm dòng. Khác biệt giữa <code>addressAsNumber</code> và <code>pa</code> là chỉ <code>pa</code> mới nhớ <em>KIỂU DỮ LIỆU</em> nào nằm ở đó — và đó chính xác là lý do C có kiểu con trỏ chứ không dùng bừa <code>unsigned long</code> cho mọi thứ (slide 14–16 sống nhờ đúng thông tin kiểu ấy).</p>
<p class="meo">💡 Nhớ lấy cặp câu mà slide kết lại. Trong phòng thi, câu "con trỏ là gì và vì sao C cần nó?" được trả lời hoàn hảo bằng: <em>địa chỉ là một con số; con trỏ là kiểu biến dùng để cất con số đó và nhớ luôn loại dữ liệu nằm ở đấy.</em></p>`],

      [6, "2 - Where can we put program's data?",
        `<p class="y-chinh">🎯 Three kinds of data — <strong>Global</strong>, <strong>Local</strong>, <strong>Dynamic</strong> — mapped onto three of the four segments. This single picture answers every "where does this variable live and how long does it survive?" question in the course.</p>
<ul>
<li><strong>Global → Data Segment</strong>. The slide's words: <em>"Common Variables. All functions can access them."</em> Declared outside every function, they are created before <code>main</code> starts and destroyed after it ends. That is why <code>myVar</code> on slide 4 had an address far away from the stack.</li>
<li><strong>Local → Stack Segment</strong>. <em>"Variables are defined in functions. They will exist only when the function is executed and they will be removed when the function completed execution."</em> This sentence is the single most important one on the slide — it is the reason a function cannot return a pointer to its own local variable.</li>
<li><strong>Dynamic → Heap</strong>. <em>"Dynamic allocated data through explicit statements for memory allocation."</em> Nothing appears on the heap by accident: you must call <code>malloc</code>/<code>calloc</code>, and it stays until you call <code>free</code> — even after the function that allocated it has returned. That independence from function lifetime is the whole point.</li>
<li><strong>Code Segment gets no arrow</strong> — because it holds instructions, not data. Slide 4 showed it does have addresses (<code>&amp;main</code>), but you never store <em>data</em> there.</li>
<li><strong>How this connects to pointers</strong> — a pointer can point into any of the three data areas. The pointer variable itself is usually a local (so it lives on the stack) while the thing it points at may be global, local or heap. Keeping those two lifetimes apart in your head prevents most pointer bugs.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

int globalVar = 100;                 /* DATA segment: lives the whole program */

int *makeOnHeap(void) {
    int *p = (int*)malloc(sizeof(int));   /* the block is on the HEAP */
    *p = 42;
    return p;                             /* OK: the block outlives this function */
}

int *makeOnStack(void) {
    int local = 7;                        /* STACK: dies at the closing brace */
    return &amp;local;                        /* BUG - dangling pointer */
}

int main(void) {
    int  localVar = 5;                    /* STACK */
    int *heapVar  = makeOnHeap();         /* HEAP  */
    printf("global %d, local %d, heap %d\\n", globalVar, localVar, *heapVar);
    free(heapVar);
    return 0;
}</code></pre>
<p class="dap-an">✅ Compiled and run: it prints <code>global 100, local 5, heap 42</code>. <code>makeOnHeap</code> is correct — the block survives the return because the heap is not tied to any function. <code>makeOnStack</code> is the classic error the slide's "removed when the function completed execution" sentence warns about; <code>cc -Wall</code> even names it: <em>"address of stack memory associated with local variable 'local' returned"</em>.</p>
<p class="pitfall">⚠️ The trap is that a dangling stack pointer often <em>seems</em> to work — the dead stack slot still contains 7 until something else reuses it. A bug that works today and fails after you add an unrelated <code>printf</code> is almost always this one.</p>`,
        `<p class="y-chinh">🎯 Ba loại dữ liệu — <strong>Toàn cục (Global)</strong>, <strong>Cục bộ (Local)</strong>, <strong>Động (Dynamic)</strong> — ánh xạ vào ba trong bốn vùng nhớ. Một bức hình này trả lời mọi câu "biến này sống ở đâu và sống được bao lâu?" của cả môn.</p>
<ul>
<li><strong>Toàn cục → Data Segment</strong>. Lời của slide: <em>"Biến dùng chung. Mọi hàm đều truy cập được."</em> Khai báo ngoài mọi hàm, chúng sinh ra trước khi <code>main</code> chạy và mất đi sau khi <code>main</code> kết thúc. Đó là lý do <code>myVar</code> ở slide 4 có địa chỉ nằm cách xa hẳn stack.</li>
<li><strong>Cục bộ → Stack Segment</strong>. <em>"Biến định nghĩa bên trong hàm. Chúng chỉ tồn tại khi hàm đang chạy và bị xoá khi hàm chạy xong."</em> Câu này là câu quan trọng nhất trên slide — nó là lý do một hàm KHÔNG được trả về con trỏ tới biến cục bộ của chính nó.</li>
<li><strong>Động → Heap</strong>. <em>"Dữ liệu cấp phát động qua các câu lệnh cấp phát bộ nhớ tường minh."</em> Không có gì tự nhiên xuất hiện trên heap: bạn phải gọi <code>malloc</code>/<code>calloc</code>, và nó nằm đó cho tới khi bạn gọi <code>free</code> — kể cả sau khi hàm cấp phát đã kết thúc. Chính sự độc lập với vòng đời hàm ấy mới là điểm mấu chốt.</li>
<li><strong>Code Segment không có mũi tên nào trỏ vào</strong> — vì nó chứa lệnh, không chứa dữ liệu. Slide 4 cho thấy nó vẫn có địa chỉ (<code>&amp;main</code>), nhưng bạn không bao giờ cất <em>dữ liệu</em> ở đó.</li>
<li><strong>Nối với con trỏ thế nào</strong> — một con trỏ có thể trỏ vào bất kỳ vùng nào trong ba vùng dữ liệu. Bản thân biến con trỏ thường là biến cục bộ (nên nó nằm trên stack) còn thứ nó trỏ tới có thể là toàn cục, cục bộ hoặc heap. Tách rạch ròi hai vòng đời đó trong đầu là ngăn được phần lớn lỗi con trỏ.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

int globalVar = 100;                 /* DATA: song suot ca chuong trinh */

int *makeOnHeap(void) {
    int *p = (int*)malloc(sizeof(int));   /* khoi nho nam tren HEAP */
    *p = 42;
    return p;                             /* OK: khoi nho song lau hon ham nay */
}

int *makeOnStack(void) {
    int local = 7;                        /* STACK: chet o dau ngoac dong */
    return &amp;local;                        /* LOI - con tro treo */
}

int main(void) {
    int  localVar = 5;                    /* STACK */
    int *heapVar  = makeOnHeap();         /* HEAP  */
    printf("global %d, local %d, heap %d\\n", globalVar, localVar, *heapVar);
    free(heapVar);
    return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch và chạy: in ra <code>global 100, local 5, heap 42</code>. Hàm <code>makeOnHeap</code> đúng — khối nhớ sống sót qua lệnh return vì heap không gắn với hàm nào cả. Hàm <code>makeOnStack</code> là lỗi kinh điển mà câu "bị xoá khi hàm chạy xong" của slide cảnh báo; <code>cc -Wall</code> còn gọi thẳng tên nó: <em>"address of stack memory associated with local variable 'local' returned"</em>.</p>
<p class="pitfall">⚠️ Cái bẫy là con trỏ treo vào stack thường <em>trông như</em> chạy được — ô nhớ đã chết vẫn còn giữ số 7 cho tới khi có thứ khác dùng lại chỗ đó. Một lỗi hôm nay chạy ngon mà thêm một câu <code>printf</code> chẳng liên quan vào là hỏng thì gần như chắc chắn là lỗi này.</p>`],

      [7, '3 - What is a Pointer?',
        `<p class="y-chinh">🎯 The definition, in four sentences. Sentence one is the one to memorise word for word: <em>"A pointer is a variable, which contains the address of a memory location of another variable."</em></p>
<ul>
<li><strong>"A pointer is a VARIABLE"</strong> — not an operator, not a marker, not a special syntax. It obeys every rule you already know: it is declared, it occupies memory, it has its own address, you can assign to it and copy it. Slide 11 will prove this by taking the address of a pointer.</li>
<li><strong>"which CONTAINS THE ADDRESS"</strong> — its value is an address, not data. Confusing the value of <code>pn</code> (an address) with the value of <code>*pn</code> (the data) is the single most common beginner error in this topic.</li>
<li><strong>"the first variable is said to POINT TO the second"</strong> — this is why the arrow is drawn in every diagram. The arrow is not in memory; it is the picture of one number that happens to be another variable's address.</li>
<li><strong>"A pointer provides an INDIRECT method of accessing the value of a data item"</strong> — direct: <code>n = 100</code>. Indirect: <code>*pn = 100</code>. Both write 100 into the same box; the second one goes via a number. The whole value of pointers comes from that number being changeable at run time.</li>
<li><strong>"Pointers can point to variables of other fundamental data types like int, char, or double or data aggregates like arrays or structures"</strong> — a pointer type is built <em>from</em> a type. There is no generic "pointer"; there is <code>int*</code>, <code>char*</code>, <code>double*</code>, and each behaves differently under <code>*</code> and under arithmetic (slides 14 and 16).</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    int    n = 7;
    char   c = 'A';
    double d = 2.5;

    int    *pn = &amp;n;    /* points to an int    */
    char   *pc = &amp;c;    /* points to a char    */
    double *pd = &amp;d;    /* points to a double  */

    printf("direct   : n = %d\\n", n);
    printf("indirect : *pn = %d\\n", *pn);
    *pn = 100;                       /* indirect write */
    printf("after *pn = 100, n = %d\\n", n);
    printf("*pc = %c, *pd = %.1f\\n", *pc, *pd);
    return 0;
}</code></pre>
<p class="dap-an">✅ Compiled and run: <code>direct : n = 7</code> · <code>indirect : *pn = 7</code> · <code>after *pn = 100, n = 100</code> · <code>*pc = A, *pd = 2.5</code>. The third line is the definition made visible: <code>n</code> changed although the letter <code>n</code> never appeared on the left of an <code>=</code>.</p>
<p class="meo">💡 A phrase that makes the rest of the slot easy: read <code>*</code> aloud as <strong>"the thing at"</strong>. Then <code>*pn = 100</code> reads "the thing at pn becomes 100", and <code>pn = &amp;n</code> reads "pn becomes the address of n". Two clearly different sentences.</p>`,
        `<p class="y-chinh">🎯 Định nghĩa, gói trong bốn câu. Câu đầu tiên là câu cần thuộc từng chữ: <em>"Con trỏ là một BIẾN, biến ấy chứa địa chỉ của một ô nhớ thuộc về một biến khác."</em></p>
<ul>
<li><strong>"Con trỏ là một BIẾN"</strong> — không phải toán tử, không phải dấu hiệu, không phải cú pháp đặc biệt. Nó tuân theo mọi quy tắc bạn đã biết: được khai báo, chiếm chỗ trong bộ nhớ, có địa chỉ của riêng nó, gán được, sao chép được. Slide 11 sẽ chứng minh bằng cách lấy địa chỉ của chính một con trỏ.</li>
<li><strong>"chứa ĐỊA CHỈ"</strong> — giá trị của nó là một địa chỉ, không phải dữ liệu. Nhầm giá trị của <code>pn</code> (một địa chỉ) với giá trị của <code>*pn</code> (dữ liệu) là lỗi phổ biến số một của người mới ở chủ đề này.</li>
<li><strong>"biến thứ nhất được nói là TRỎ TỚI biến thứ hai"</strong> — đó là lý do mũi tên xuất hiện trong mọi sơ đồ. Mũi tên không nằm trong bộ nhớ; nó chỉ là hình vẽ của một con số tình cờ chính là địa chỉ của biến khác.</li>
<li><strong>"Con trỏ cho một cách truy cập GIÁN TIẾP tới giá trị của một mục dữ liệu"</strong> — trực tiếp: <code>n = 100</code>. Gián tiếp: <code>*pn = 100</code>. Cả hai đều ghi 100 vào cùng cái hộp; cách thứ hai đi vòng qua một con số. Toàn bộ giá trị của con trỏ nằm ở chỗ con số ấy đổi được lúc đang chạy.</li>
<li><strong>"Con trỏ trỏ được tới biến của các kiểu cơ bản như int, char, double, hoặc tới dữ liệu gộp như mảng, cấu trúc"</strong> — kiểu con trỏ được dựng <em>TỪ</em> một kiểu. Không có "con trỏ" chung chung; chỉ có <code>int*</code>, <code>char*</code>, <code>double*</code>, và mỗi loại cư xử khác nhau dưới <code>*</code> và dưới phép số học (slide 14 và 16).</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    int    n = 7;
    char   c = 'A';
    double d = 2.5;

    int    *pn = &amp;n;    /* tro toi mot int    */
    char   *pc = &amp;c;    /* tro toi mot char   */
    double *pd = &amp;d;    /* tro toi mot double */

    printf("truc tiep : n = %d\\n", n);
    printf("gian tiep : *pn = %d\\n", *pn);
    *pn = 100;                       /* ghi gian tiep */
    printf("sau *pn = 100, n = %d\\n", n);
    printf("*pc = %c, *pd = %.1f\\n", *pc, *pd);
    return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch và chạy: <code>truc tiep : n = 7</code> · <code>gian tiep : *pn = 7</code> · <code>sau *pn = 100, n = 100</code> · <code>*pc = A, *pd = 2.5</code>. Dòng thứ ba là định nghĩa được nhìn thấy tận mắt: <code>n</code> đã đổi dù chữ <code>n</code> chưa từng xuất hiện bên trái dấu <code>=</code>.</p>
<p class="meo">💡 Một mẹo đọc làm cả slot nhẹ hẳn: đọc dấu <code>*</code> thành <strong>"thứ nằm ở"</strong>. Thế thì <code>*pn = 100</code> đọc là "thứ nằm ở pn trở thành 100", còn <code>pn = &amp;n</code> đọc là "pn trở thành địa chỉ của n". Hai câu rõ ràng khác nhau.</p>`],

      [8, '4 - Pointer variables',
        `<p class="y-chinh">🎯 The declaration syntax, boxed on the slide: <code>dataType *pointerName;</code> — <em>"A pointer declaration consists of a base type and a variable name preceded by an *"</em>. Three examples: <code>int *pI;</code>, <code>double *pD;</code>, <code>char *pC;</code>.</p>
<ul>
<li><strong>Read the declaration backwards</strong> — <code>int *pI;</code> says "<code>*pI</code> is an <code>int</code>", i.e. "the thing at pI is an int", i.e. "pI points to an int". That reading never misleads you, and it explains why the <code>*</code> is written where it is.</li>
<li><strong>The slide's Note</strong> — <em>"The created pointer will contain the address of the variable it points to, with the data type is dataType."</em> The base type is not decoration: it tells the compiler how many bytes <code>*pI</code> touches (slide 14) and how far <code>pI + 1</code> jumps (slide 16).</li>
<li><strong>⚠ The exam trap — the <code>*</code> binds to the VARIABLE, not to the type.</strong> <code>int *p, q;</code> declares <code>p</code> as <code>int*</code> and <code>q</code> as a plain <code>int</code>. To get two pointers you must write <code>int *p, *q;</code>. This is asked almost every semester.</li>
<li><strong>Three spacings, one meaning</strong> — <code>int* p;</code>, <code>int *p;</code> and <code>int * p;</code> compile identically. The middle form is preferred precisely because it does not lie about <code>int *p, q;</code>.</li>
<li><strong>Every pointer is the same size</strong> — <code>sizeof(int*) == sizeof(double*) == sizeof(char*)</code>, because they all hold an address. Do not confuse that with <code>sizeof(*p)</code>, which is the size of the pointed-to type and differs.</li>
<li><strong>Declared is not initialised</strong> — <code>int *pI;</code> creates a pointer containing garbage. Dereferencing it is undefined behaviour; give it <code>NULL</code> or a real address immediately.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    int x = 5;
    int *p, q;              /* TRAP: p is int*, q is a plain int */
    p = &amp;x;
    q = 9;
    printf("sizeof p = %zu, sizeof q = %zu, *p = %d, q = %d\\n",
           sizeof(p), sizeof(q), *p, q);

    int *pI; double *pD; char *pC;   /* every pointer holds an address */
    printf("sizeof(int*) = %zu, (double*) = %zu, (char*) = %zu\\n",
           sizeof(pI), sizeof(pD), sizeof(pC));
    printf("sizeof int = %zu, double = %zu, char = %zu\\n",
           sizeof(int), sizeof(double), sizeof(char));
    return 0;
}</code></pre>
<p class="dap-an">✅ Compiled and run on a 64-bit machine: <code>sizeof p = 8, sizeof q = 4, *p = 5, q = 9</code> — proof that <code>q</code> is <strong>not</strong> a pointer. Then <code>sizeof(int*) = 8, (double*) = 8, (char*) = 8</code> while <code>sizeof int = 4, double = 8, char = 1</code>. All pointers are the same width; the things they point at are not. (On the 32-bit Dev-C++ of the original slides every pointer would be 4 instead of 8.)</p>
<p class="pitfall">⚠️ Because of <code>int *p, q;</code>, many style guides simply forbid declaring more than one variable per line when pointers are involved. Write <code>int *p;</code> and <code>int q;</code> on separate lines and the trap cannot bite you.</p>`,
        `<p class="y-chinh">🎯 Cú pháp khai báo, đóng khung trên slide: <code>dataType *pointerName;</code> — <em>"Một khai báo con trỏ gồm một kiểu cơ sở và một tên biến có dấu * đứng trước"</em>. Ba ví dụ: <code>int *pI;</code>, <code>double *pD;</code>, <code>char *pC;</code>.</p>
<ul>
<li><strong>Đọc khai báo theo chiều ngược</strong> — <code>int *pI;</code> nói rằng "<code>*pI</code> là một <code>int</code>", tức "thứ nằm ở pI là một int", tức "pI trỏ tới một int". Cách đọc này không bao giờ dẫn bạn đi sai, và nó giải thích vì sao dấu <code>*</code> lại đặt ở chỗ đó.</li>
<li><strong>Dòng Note của slide</strong> — <em>"Con trỏ tạo ra sẽ chứa địa chỉ của biến mà nó trỏ tới, với kiểu dữ liệu là dataType."</em> Kiểu cơ sở không phải đồ trang trí: nó báo cho trình biên dịch biết <code>*pI</code> chạm vào bao nhiêu byte (slide 14) và <code>pI + 1</code> nhảy xa bao nhiêu (slide 16).</li>
<li><strong>⚠ Bẫy đề thi — dấu <code>*</code> gắn với BIẾN, không gắn với KIỂU.</strong> <code>int *p, q;</code> khai báo <code>p</code> kiểu <code>int*</code> còn <code>q</code> là <code>int</code> thường. Muốn hai con trỏ thì phải viết <code>int *p, *q;</code>. Chỗ này gần như kỳ nào cũng hỏi.</li>
<li><strong>Ba cách đặt dấu cách, một nghĩa</strong> — <code>int* p;</code>, <code>int *p;</code> và <code>int * p;</code> biên dịch y hệt nhau. Kiểu ở giữa được ưa dùng chính vì nó không nói dối về <code>int *p, q;</code>.</li>
<li><strong>Mọi con trỏ đều cùng kích thước</strong> — <code>sizeof(int*) == sizeof(double*) == sizeof(char*)</code>, vì tất cả đều chỉ đựng một địa chỉ. Đừng nhầm với <code>sizeof(*p)</code> — đó là kích thước của kiểu được trỏ tới, và nó khác nhau.</li>
<li><strong>Khai báo không phải là khởi tạo</strong> — <code>int *pI;</code> tạo ra một con trỏ chứa rác. Giải tham chiếu nó là hành vi không xác định; hãy gán ngay <code>NULL</code> hoặc một địa chỉ thật.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    int x = 5;
    int *p, q;              /* BAY: p la int*, con q la int thuong */
    p = &amp;x;
    q = 9;
    printf("sizeof p = %zu, sizeof q = %zu, *p = %d, q = %d\\n",
           sizeof(p), sizeof(q), *p, q);

    int *pI; double *pD; char *pC;   /* con tro nao cung chi dung mot dia chi */
    printf("sizeof(int*) = %zu, (double*) = %zu, (char*) = %zu\\n",
           sizeof(pI), sizeof(pD), sizeof(pC));
    printf("sizeof int = %zu, double = %zu, char = %zu\\n",
           sizeof(int), sizeof(double), sizeof(char));
    return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch và chạy trên máy 64-bit: <code>sizeof p = 8, sizeof q = 4, *p = 5, q = 9</code> — bằng chứng rằng <code>q</code> <strong>không</strong> phải con trỏ. Rồi <code>sizeof(int*) = 8, (double*) = 8, (char*) = 8</code> trong khi <code>sizeof int = 4, double = 8, char = 1</code>. Con trỏ nào cũng rộng như nhau; thứ chúng trỏ tới thì không. (Trên Dev-C++ 32-bit thời soạn slide, mọi con trỏ sẽ là 4 chứ không phải 8.)</p>
<p class="pitfall">⚠️ Chính vì <code>int *p, q;</code> mà nhiều bộ quy tắc phong cách cấm hẳn việc khai báo nhiều biến trên một dòng khi có con trỏ. Viết <code>int *p;</code> và <code>int q;</code> ở hai dòng riêng thì cái bẫy không cắn được bạn.</p>`],

      [9, '5 - Why are Pointers used?',
        `<p class="y-chinh">🎯 Five reasons. They are not five separate features — they are five consequences of one fact: <strong>C passes everything by value</strong>, so the only way to reach outside data is to pass its address.</p>
<ul>
<li><strong>"To modify outside arguments of a function"</strong> — the headline reason, developed fully on slides 22–23. Without pointers, a <code>swap(x, y)</code> swaps two copies and the caller sees nothing change.</li>
<li><strong>"To return more than one value from a function"</strong> — <code>return</code> carries exactly one value. Pass two pointers and the function can fill both. This is how <code>scanf</code> returns your numbers to you, and why you write <code>&amp;n</code>.</li>
<li><strong>"To pass array and strings more conveniently from one function to another"</strong> — arrays are never copied into a function; the array name decays into a pointer to its first element. Slot 13–18 relies on this completely, which is why Slot 10 comes first.</li>
<li><strong>"To manipulate arrays easily by moving pointers to them instead of moving the arrays itself"</strong> — moving a pointer is changing one number; moving an array is copying every byte. This is where pointer arithmetic (slides 16–19) earns its keep.</li>
<li><strong>"To allocate memory and access it (direct memory allocation)"</strong> — a heap block has no name, only an address, so a pointer is the <em>only</em> way to reach it. Slides 24–33.</li>
<li><strong>The reason not listed but implied</strong> — efficiency. Passing a 400-byte structure copies 400 bytes; passing its address copies 8. In a loop that runs a million times, that is the difference between fast and slow.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

/* reason 2: returning TWO values through pointers */
void divide(int a, int b, int *quotient, int *remainder) {
    *quotient  = a / b;
    *remainder = a % b;
}

/* reason 1 + 4: modify caller data, walk an array with a pointer */
void doubleAll(int *arr, int size) {
    int i;
    for (i = 0; i &lt; size; i++)
        *(arr + i) = *(arr + i) * 2;
}

int main(void) {
    int q, r;
    int data[5] = {1, 2, 3, 4, 5};
    int i;

    divide(17, 5, &amp;q, &amp;r);
    printf("17 / 5 = %d remainder %d\\n", q, r);

    doubleAll(data, 5);
    for (i = 0; i &lt; 5; i++) printf("%d ", data[i]);
    printf("\\n");
    return 0;
}</code></pre>
<p class="dap-an">✅ Compiled and run: <code>17 / 5 = 3 remainder 2</code> then <code>2 4 6 8 10</code>. Both results are impossible without pointers — <code>divide</code> delivers two values through one call, and <code>doubleAll</code> changes <code>main</code>'s own array even though C copies its arguments. That is reasons 1, 2, 3 and 4 in fourteen lines.</p>
<p class="meo">💡 Exam-ready one-liner: <em>"C has only pass-by-value; a pointer parameter is how C simulates pass-by-reference."</em> Every one of the five bullets is a restatement of that sentence.</p>`,
        `<p class="y-chinh">🎯 Năm lý do. Chúng không phải năm tính năng rời rạc — chúng là năm hệ quả của một sự thật: <strong>C truyền mọi thứ theo giá trị</strong>, nên cách duy nhất để với tới dữ liệu bên ngoài là truyền địa chỉ của nó.</p>
<ul>
<li><strong>"Để sửa đối số bên ngoài của một hàm"</strong> — lý do đứng đầu, triển khai đầy đủ ở slide 22–23. Không có con trỏ thì <code>swap(x, y)</code> chỉ hoán đổi hai bản sao và nơi gọi chẳng thấy gì đổi.</li>
<li><strong>"Để trả về nhiều hơn một giá trị từ một hàm"</strong> — <code>return</code> chỉ mang đúng một giá trị. Truyền vào hai con trỏ thì hàm điền được cả hai. Đó chính là cách <code>scanf</code> trả số về cho bạn, và là lý do bạn phải viết <code>&amp;n</code>.</li>
<li><strong>"Để truyền mảng và chuỗi giữa các hàm cho tiện"</strong> — mảng không bao giờ được sao chép vào hàm; tên mảng suy biến thành con trỏ tới phần tử đầu. Slot 13–18 dựa hoàn toàn vào điều này, và vì thế Slot 10 phải học trước.</li>
<li><strong>"Để thao tác mảng dễ dàng bằng cách dịch chuyển con trỏ thay vì dịch chuyển chính mảng"</strong> — dịch một con trỏ là đổi một con số; dịch một mảng là chép từng byte. Đây là chỗ số học con trỏ (slide 16–19) kiếm cơm.</li>
<li><strong>"Để cấp phát bộ nhớ và truy cập nó"</strong> — một khối trên heap không có tên, chỉ có địa chỉ, nên con trỏ là cách <em>duy nhất</em> chạm tới nó. Slide 24–33.</li>
<li><strong>Lý do không ghi nhưng ngầm hiểu</strong> — hiệu năng. Truyền một struct 400 byte là chép 400 byte; truyền địa chỉ của nó là chép 8 byte. Trong vòng lặp chạy một triệu lần, đó là khác biệt giữa nhanh và chậm.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

/* ly do 2: tra ve HAI gia tri qua con tro */
void divide(int a, int b, int *quotient, int *remainder) {
    *quotient  = a / b;
    *remainder = a % b;
}

/* ly do 1 + 4: sua du lieu cua noi goi, duyet mang bang con tro */
void doubleAll(int *arr, int size) {
    int i;
    for (i = 0; i &lt; size; i++)
        *(arr + i) = *(arr + i) * 2;
}

int main(void) {
    int q, r;
    int data[5] = {1, 2, 3, 4, 5};
    int i;

    divide(17, 5, &amp;q, &amp;r);
    printf("17 / 5 = %d du %d\\n", q, r);

    doubleAll(data, 5);
    for (i = 0; i &lt; 5; i++) printf("%d ", data[i]);
    printf("\\n");
    return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch và chạy: in <code>17 / 5 = 3 du 2</code> rồi <code>2 4 6 8 10</code>. Cả hai kết quả đều bất khả thi nếu không có con trỏ — <code>divide</code> giao về hai giá trị qua một lời gọi, còn <code>doubleAll</code> sửa được chính mảng của <code>main</code> dù C có sao chép đối số. Đó là lý do 1, 2, 3 và 4 gói trong mười bốn dòng.</p>
<p class="meo">💡 Câu chốt dùng được trong phòng thi: <em>"C chỉ có truyền theo giá trị; tham số kiểu con trỏ là cách C mô phỏng truyền theo tham chiếu."</em> Cả năm gạch đầu dòng đều là cách nói lại câu đó.</p>`],

      [10, '6 - Pointer Operators',
        `<p class="y-chinh">🎯 The two operators of the whole slot, in one table. <strong><code>&amp;</code></strong> — "get address of a variable and assign it to a pointer". <strong><code>*</code></strong> — "access indirectly the value of a data through its pointer". Below the table, the same three lines are traced in memory.</p>
<ul>
<li><strong><code>&amp;</code> — the address-of operator.</strong> <code>int n = 7; int *pn = &amp;n;</code>. The slide annotates it: <em>"pn = &amp;n → pn = 6684188"</em>. The <em>value stored in pn</em> becomes 6684188, the address of n. The diagram draws the arrow from the box labelled <code>pn</code> at address 6684176 up to the box labelled <code>n = 7</code> at 6684188.</li>
<li><strong><code>*</code> — the dereference (indirection) operator.</strong> <code>*pn = 100;</code>, annotated <em>"Value at [6684188] = 100"</em>. Read it exactly that way: go to the address inside pn, and write 100 <em>there</em>. The right-hand diagram shows <code>n = 7 → 100</code>.</li>
<li><strong>Two <code>*</code> with two different jobs</strong> — in <code>int *pn = &amp;n;</code> the <code>*</code> is part of the <em>declaration</em> (it says "pn is a pointer"). In <code>*pn = 100;</code> the <code>*</code> is the <em>operator</em> (it says "go there"). Same symbol, different grammar. Mixing them up is why <code>int *pn = 100;</code> looks reasonable and is wrong.</li>
<li><strong><code>&amp;</code> and <code>*</code> are inverses</strong> — <code>*(&amp;n)</code> is <code>n</code>, always. That identity is the fastest way to check any pointer expression on paper.</li>
<li><strong>What <code>*pn = 100</code> does NOT do</strong> — it does not change <code>pn</code>. After the assignment pn still holds 6684188; only the contents of that address changed.</li>
</ul>
<table>
<tr><th>Step</th><th>Address (assumed, from the slide)</th><th>Variable</th><th>Value after the step</th></tr>
<tr><td>after <code>int n = 7;</code></td><td>6684188</td><td><code>n</code></td><td><code>7</code></td></tr>
<tr><td>after <code>int *pn = &amp;n;</code></td><td>6684176</td><td><code>pn</code></td><td><code>6684188</code> (the address of n)</td></tr>
<tr><td>after <code>*pn = 100;</code></td><td>6684188</td><td><code>n</code></td><td><code>100</code> ← written indirectly</td></tr>
<tr><td>after <code>*pn = 100;</code></td><td>6684176</td><td><code>pn</code></td><td><code>6684188</code> — <strong>unchanged</strong></td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    int n = 7;
    int *pn = &amp;n;                     /* &amp; : pn now holds the address of n */

    printf("n   = %d\\n", n);
    printf("&amp;n  = %p\\n", (void*)&amp;n);
    printf("pn  = %p\\n", (void*)pn);   /* same as &amp;n */
    printf("*pn = %d\\n", *pn);         /* 7 : the thing at pn */

    *pn = 100;                        /* * : write 100 at that address */
    printf("after *pn = 100 -&gt; n = %d, pn still = %p\\n", n, (void*)pn);
    printf("*(&amp;n) = %d  (always equals n)\\n", *(&amp;n));
    return 0;
}</code></pre>
<p class="dap-an">✅ Compiled and run: <code>n = 7</code>, <code>&amp;n</code> and <code>pn</code> print the same address, <code>*pn = 7</code>, then <code>after *pn = 100 -&gt; n = 100, pn still = &lt;same address&gt;</code>, and <code>*(&amp;n) = 100</code>. Exactly the slide's annotations.<br>⚠️ <strong>The slide has a slip.</strong> The right-hand diagram labels the pn box <em>"pn = 10000"</em> after <code>*pn = 100</code>. That is wrong: <code>*pn = 100</code> writes into <em>n</em>, not into <em>pn</em>; pn still holds 6684188, exactly as the left-hand diagram had it. Reproduced here as printed, corrected here rather than silently copied.</p>
<p class="pitfall">⚠️ Never print a pointer with <code>%d</code> — <code>cc -Wall</code> answers with <em>"format specifies type 'int' but the argument has type 'int *'"</em>, and on a 64-bit machine the address is truncated to nonsense. Use <code>printf("%p", (void*)pn);</code>.</p>`,
        `<p class="y-chinh">🎯 Hai toán tử của cả slot, gói trong một bảng. <strong><code>&amp;</code></strong> — "lấy địa chỉ của một biến rồi gán cho một con trỏ". <strong><code>*</code></strong> — "truy cập gián tiếp giá trị của dữ liệu thông qua con trỏ của nó". Phía dưới bảng, ba dòng lệnh ấy được vẽ lại trong bộ nhớ.</p>
<ul>
<li><strong><code>&amp;</code> — toán tử lấy địa chỉ.</strong> <code>int n = 7; int *pn = &amp;n;</code>. Slide chú thích: <em>"pn = &amp;n → pn = 6684188"</em>. <em>Giá trị cất trong pn</em> trở thành 6684188, tức địa chỉ của n. Sơ đồ vẽ mũi tên từ ô nhãn <code>pn</code> ở địa chỉ 6684176 lên ô nhãn <code>n = 7</code> ở 6684188.</li>
<li><strong><code>*</code> — toán tử giải tham chiếu (truy cập gián tiếp).</strong> <code>*pn = 100;</code>, chú thích <em>"Value at [6684188] = 100"</em> tức "giá trị tại [6684188] = 100". Hãy đọc đúng như thế: đi tới địa chỉ nằm trong pn, rồi ghi 100 vào <em>đó</em>. Sơ đồ bên phải cho thấy <code>n = 7 → 100</code>.</li>
<li><strong>Hai dấu <code>*</code> làm hai việc khác nhau</strong> — trong <code>int *pn = &amp;n;</code>, dấu <code>*</code> thuộc về <em>khai báo</em> (nó nói "pn là con trỏ"). Trong <code>*pn = 100;</code>, dấu <code>*</code> là <em>toán tử</em> (nó nói "đi tới đó"). Cùng một ký hiệu, khác ngữ pháp. Nhầm hai vai đó là lý do <code>int *pn = 100;</code> nhìn thì có vẻ hợp lý mà lại sai.</li>
<li><strong><code>&amp;</code> và <code>*</code> là hai phép ngược nhau</strong> — <code>*(&amp;n)</code> luôn luôn bằng <code>n</code>. Đồng nhất thức đó là cách nhanh nhất để kiểm tra mọi biểu thức con trỏ trên giấy.</li>
<li><strong>Thứ mà <code>*pn = 100</code> KHÔNG làm</strong> — nó không đổi <code>pn</code>. Sau lệnh gán, pn vẫn giữ 6684188; chỉ nội dung tại địa chỉ đó thay đổi.</li>
</ul>
<table>
<tr><th>Bước</th><th>Địa chỉ (GIẢ ĐỊNH, lấy theo slide)</th><th>Biến</th><th>Giá trị sau bước đó</th></tr>
<tr><td>sau <code>int n = 7;</code></td><td>6684188</td><td><code>n</code></td><td><code>7</code></td></tr>
<tr><td>sau <code>int *pn = &amp;n;</code></td><td>6684176</td><td><code>pn</code></td><td><code>6684188</code> (địa chỉ của n)</td></tr>
<tr><td>sau <code>*pn = 100;</code></td><td>6684188</td><td><code>n</code></td><td><code>100</code> ← ghi gián tiếp</td></tr>
<tr><td>sau <code>*pn = 100;</code></td><td>6684176</td><td><code>pn</code></td><td><code>6684188</code> — <strong>KHÔNG đổi</strong></td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    int n = 7;
    int *pn = &amp;n;                     /* &amp; : pn gio giu dia chi cua n */

    printf("n   = %d\\n", n);
    printf("&amp;n  = %p\\n", (void*)&amp;n);
    printf("pn  = %p\\n", (void*)pn);   /* giong het &amp;n */
    printf("*pn = %d\\n", *pn);         /* 7 : thu nam o pn */

    *pn = 100;                        /* * : ghi 100 vao dia chi do */
    printf("sau *pn = 100 -&gt; n = %d, pn van = %p\\n", n, (void*)pn);
    printf("*(&amp;n) = %d  (luon bang n)\\n", *(&amp;n));
    return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch và chạy: <code>n = 7</code>, <code>&amp;n</code> và <code>pn</code> in ra cùng một địa chỉ, <code>*pn = 7</code>, rồi <code>sau *pn = 100 -&gt; n = 100, pn van = &lt;đúng địa chỉ cũ&gt;</code>, và <code>*(&amp;n) = 100</code>. Đúng y các chú thích trên slide.<br>⚠️ <strong>Slide có một chỗ ghi nhầm.</strong> Sơ đồ bên phải ghi nhãn ô pn là <em>"pn = 10000"</em> sau lệnh <code>*pn = 100</code>. Điều đó sai: <code>*pn = 100</code> ghi vào <em>n</em>, không ghi vào <em>pn</em>; pn vẫn giữ 6684188 y như sơ đồ bên trái. Ở đây chép lại đúng nguyên văn slide rồi nói rõ chỗ sai, không im lặng chép theo.</p>
<p class="pitfall">⚠️ Đừng bao giờ in con trỏ bằng <code>%d</code> — <code>cc -Wall</code> đáp lại ngay bằng <em>"format specifies type 'int' but the argument has type 'int *'"</em>, và trên máy 64-bit địa chỉ bị cắt cụt thành số vô nghĩa. Hãy dùng <code>printf("%p", (void*)pn);</code>.</p>`],

      [11, 'Pointer Operators: Example',
        `<p class="y-chinh">🎯 A complete program with its real console output, and the red box explains the new idea: <em>n → int → pn stores address of n → pn: int*</em>, then <em>pn → int* → ppn stores address of pn → ppn: (int*)* → ppn: int**</em>. A pointer is a variable, so it has an address, so a pointer can point at it.</p>
<ul>
<li><strong>How to build a double pointer type</strong> — take the type of the thing you point at and add one <code>*</code>. <code>n</code> is <code>int</code>, so <code>&amp;n</code> is <code>int*</code>. <code>pn</code> is <code>int*</code>, so <code>&amp;pn</code> is <code>int**</code>. The red box shows the intermediate step <code>(int*)*</code> deliberately.</li>
<li><strong>The three variables in the output table</strong> — <code>n</code> at 6684188 holds <code>7</code>; <code>pn</code> at 6684176 holds <code>6684188</code>; <code>ppn</code> at 6684168 holds <code>6684176</code>. Each value is the previous line's address — that is the chain, drawn as the two white arrows on the slide.</li>
<li><strong><code>*pn = 10;</code></strong> — one step down the chain. The second table prints <code>n … 6684188 … 10</code>. Address unchanged, value changed.</li>
<li><strong><code>**ppn = 20;</code></strong> — two steps: <code>*ppn</code> is <code>pn</code> (an address), and <code>*</code> again lands on <code>n</code>. The third table prints <code>n … 6684188 … 20</code>.</li>
<li><strong>Counting rule for exams</strong> — the number of <code>*</code> you must apply equals the number of <code>*</code> in the declared type. <code>int **ppn</code> needs two to reach an <code>int</code>. One <code>*</code> gives you an <code>int*</code>; zero gives you an address of an address.</li>
<li><strong>Where you will actually meet <code>int**</code></strong> — later, whenever a function must change a <em>caller's pointer</em>, e.g. a <code>malloc</code> wrapper <code>void alloc(int **out)</code>. Same reason as slide 22, one level higher.</li>
</ul>
<table>
<tr><th>Variable</th><th>Address (assumed, as printed on the slide)</th><th>Value</th><th>Points at</th></tr>
<tr><td><code>n</code> (<code>int</code>)</td><td>6684188</td><td>7 → 10 → 20</td><td>— (plain data)</td></tr>
<tr><td><code>pn</code> (<code>int*</code>)</td><td>6684176</td><td>6684188</td><td><code>n</code></td></tr>
<tr><td><code>ppn</code> (<code>int**</code>)</td><td>6684168</td><td>6684176</td><td><code>pn</code></td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;

void printHeader(void) {
    printf("%-10s %-20s %-15s\\n", "Variable", "Address", "Value");
    printf("--------------------------------------------------\\n");
}

int main(void) {
    int n = 7;
    /* Declaration of 2 pointers */
    int  *pn;
    int **ppn;
    pn  = &amp;n;      /* point the pointer pn to n   */
    ppn = &amp;pn;     /* point the pointer ppn to pn */

    printHeader();
    printf("%-10s %-20p %-15d\\n", "n",   (void*)&amp;n,   n);
    printf("%-10s %-20p %-15p\\n", "pn",  (void*)&amp;pn,  (void*)pn);
    printf("%-10s %-20p %-15p\\n", "ppn", (void*)&amp;ppn, (void*)ppn);

    printf("\\n-----Using pointer pn to update the n value-----\\n");
    *pn = 10;                        /* access indirectly, one level  */
    printHeader();
    printf("%-10s %-20p %-15d\\n", "n", (void*)&amp;n, n);

    printf("\\n----Using pointer ppn to update the n value----\\n");
    **ppn = 20;                      /* access indirectly, two levels */
    printHeader();
    printf("%-10s %-20p %-15d\\n", "n", (void*)&amp;n, n);
    return 0;
}</code></pre>
<p class="dap-an">✅ Compiled and run: the value of <code>n</code> goes <strong>7 → 10 → 20</strong> while its address never changes, and <code>pn</code>'s value equals <code>&amp;n</code> while <code>ppn</code>'s value equals <code>&amp;pn</code> — exactly the green console panel on the slide. Only the address digits differ, and they change from run to run (this run: n at …3b8, pn at …3b0, ppn at …3a8 — the three sit 8 bytes apart and go downwards, because a pointer is 8 bytes on a 64-bit machine, while the slide's 32-bit run showed 12- and 8-byte gaps).<br>Note: the slide prints addresses with <code>%u</code>; on a 64-bit compiler that truncates, so this version uses <code>%p</code> with <code>(void*)</code>.</p>
<p class="meo">💡 Say the chain out loud while pointing at the table: <em>"ppn holds where pn is; pn holds where n is; n holds 7."</em> Then <code>**ppn</code> is just "where pn is → where n is → 7". Nobody gets lost who says it in words.</p>`,
        `<p class="y-chinh">🎯 Một chương trình hoàn chỉnh kèm kết quả chạy thật, và cái ô đỏ giải thích ý mới: <em>n → int → pn cất địa chỉ của n → pn: int*</em>, rồi <em>pn → int* → ppn cất địa chỉ của pn → ppn: (int*)* → ppn: int**</em>. Con trỏ là một biến, nên nó có địa chỉ, nên lại có con trỏ trỏ vào nó được.</p>
<ul>
<li><strong>Cách dựng kiểu con trỏ hai cấp</strong> — lấy kiểu của thứ được trỏ tới rồi thêm một dấu <code>*</code>. <code>n</code> là <code>int</code> nên <code>&amp;n</code> là <code>int*</code>. <code>pn</code> là <code>int*</code> nên <code>&amp;pn</code> là <code>int**</code>. Ô đỏ cố ý ghi cả bước trung gian <code>(int*)*</code>.</li>
<li><strong>Ba biến trong bảng kết quả</strong> — <code>n</code> ở 6684188 giữ <code>7</code>; <code>pn</code> ở 6684176 giữ <code>6684188</code>; <code>ppn</code> ở 6684168 giữ <code>6684176</code>. Mỗi giá trị chính là địa chỉ ở dòng trên — đó là chuỗi dây chuyền, vẽ bằng hai mũi tên trắng trên slide.</li>
<li><strong><code>*pn = 10;</code></strong> — đi xuống một nấc. Bảng thứ hai in <code>n … 6684188 … 10</code>. Địa chỉ không đổi, giá trị đổi.</li>
<li><strong><code>**ppn = 20;</code></strong> — hai nấc: <code>*ppn</code> chính là <code>pn</code> (một địa chỉ), thêm một <code>*</code> nữa thì đáp xuống <code>n</code>. Bảng thứ ba in <code>n … 6684188 … 20</code>.</li>
<li><strong>Quy tắc đếm để đi thi</strong> — số dấu <code>*</code> phải áp vào bằng đúng số dấu <code>*</code> trong kiểu đã khai báo. <code>int **ppn</code> cần hai dấu mới tới được một <code>int</code>. Một dấu thì bạn nhận về một <code>int*</code>; không dấu nào thì bạn cầm địa chỉ của một địa chỉ.</li>
<li><strong>Bạn sẽ gặp <code>int**</code> ở đâu trong đời thật</strong> — về sau, mỗi khi một hàm phải sửa <em>con trỏ của nơi gọi</em>, ví dụ một hàm bọc <code>malloc</code> dạng <code>void alloc(int **out)</code>. Cùng lý do với slide 22, chỉ cao hơn một tầng.</li>
</ul>
<table>
<tr><th>Biến</th><th>Địa chỉ (GIẢ ĐỊNH, đúng như in trên slide)</th><th>Giá trị</th><th>Trỏ vào</th></tr>
<tr><td><code>n</code> (<code>int</code>)</td><td>6684188</td><td>7 → 10 → 20</td><td>— (dữ liệu thường)</td></tr>
<tr><td><code>pn</code> (<code>int*</code>)</td><td>6684176</td><td>6684188</td><td><code>n</code></td></tr>
<tr><td><code>ppn</code> (<code>int**</code>)</td><td>6684168</td><td>6684176</td><td><code>pn</code></td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;

void printHeader(void) {
    printf("%-10s %-20s %-15s\\n", "Variable", "Address", "Value");
    printf("--------------------------------------------------\\n");
}

int main(void) {
    int n = 7;
    /* Khai bao 2 con tro */
    int  *pn;
    int **ppn;
    pn  = &amp;n;      /* cho con tro pn tro vao n   */
    ppn = &amp;pn;     /* cho con tro ppn tro vao pn */

    printHeader();
    printf("%-10s %-20p %-15d\\n", "n",   (void*)&amp;n,   n);
    printf("%-10s %-20p %-15p\\n", "pn",  (void*)&amp;pn,  (void*)pn);
    printf("%-10s %-20p %-15p\\n", "ppn", (void*)&amp;ppn, (void*)ppn);

    printf("\\n-----Dung con tro pn de sua gia tri n-----\\n");
    *pn = 10;                        /* truy cap gian tiep, mot cap  */
    printHeader();
    printf("%-10s %-20p %-15d\\n", "n", (void*)&amp;n, n);

    printf("\\n----Dung con tro ppn de sua gia tri n----\\n");
    **ppn = 20;                      /* truy cap gian tiep, hai cap  */
    printHeader();
    printf("%-10s %-20p %-15d\\n", "n", (void*)&amp;n, n);
    return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch và chạy: giá trị của <code>n</code> đi <strong>7 → 10 → 20</strong> trong khi địa chỉ của nó không hề đổi, còn giá trị của <code>pn</code> bằng <code>&amp;n</code> và giá trị của <code>ppn</code> bằng <code>&amp;pn</code> — đúng y bảng console màu xanh trên slide. Chỉ các chữ số địa chỉ là khác, và chúng đổi theo từng lần chạy (lần chạy này: n ở …3b8, pn ở …3b0, ppn ở …3a8 — ba cái cách nhau 8 byte và đi xuống, vì con trỏ rộng 8 byte trên máy 64-bit, còn lần chạy 32-bit của slide cho khoảng cách 12 và 8 byte).<br>Lưu ý: slide in địa chỉ bằng <code>%u</code>; trên trình biên dịch 64-bit thì bị cắt cụt, nên bản này dùng <code>%p</code> kèm <code>(void*)</code>.</p>
<p class="meo">💡 Đọc chuỗi dây chuyền thành lời trong khi chỉ tay vào bảng: <em>"ppn giữ chỗ của pn; pn giữ chỗ của n; n giữ số 7."</em> Thế thì <code>**ppn</code> chỉ là "chỗ của pn → chỗ của n → 7". Ai đọc thành lời thì không lạc.</p>`],

      [12, 'Pointer Operators: Walkthrough',
        `<p class="y-chinh">🎯 The template exam question of this slot: a short program, a memory drawing with the addresses <strong>100, 96, 92, 88</strong>, and two boxes doing the arithmetic one substitution at a time. The answer on the console is <code>m = -30, n = 54</code>.</p>
<ul>
<li><strong>Setup</strong> — <code>int n = 7, m = 6;</code> then <code>int *pn = &amp;n; int *pm = &amp;m;</code>. The slide's memory picture (addresses assumed, not real) puts <code>n</code> at 100, <code>m</code> at 96, <code>pn</code> at 92 holding 100, and <code>pm</code> at 88 holding 96.</li>
<li><strong>Statement ①: <code>*pn = 2*(*pm) + m*n;</code></strong> — the slide expands it literally: <em>Value at 100 = 2*(value at 96) + m*n → 2*6 + 6*7 → 12 + 42 = 54</em>. So <code>n</code> becomes 54. Note the right-hand side uses the values <em>before</em> the write: m is still 6 and n is still 7.</li>
<li><strong>Statement ②: <code>*pm += 3*m - (*pn);</code></strong> — <em>Value at 96 += 3*6 – value at 100</em>. And "value at 100" is now <strong>54</strong>, not 7, because statement ① already ran. <em>18 – 54 = –36</em>, so <code>m = 6 + (–36) = –30</code>.</li>
<li><strong>The whole trap of the exercise</strong> is that second substitution. Students plug in the original n = 7 and get <code>m = 6 + (18 − 7) = 17</code>. Walkthrough means you re-read the memory table <em>after every statement</em>, never from the declaration.</li>
<li><strong>Why <code>+=</code> is written as two operations</strong> — <code>*pm += X</code> is <code>*pm = *pm + X</code>: read the value at 96, add, write back to 96. The slide's chain of "Value at 96 += …" lines shows exactly that.</li>
<li><strong>The addresses are fictional and that is fine</strong> — 100/96/92/88 are chosen so the arithmetic is readable. Only the <em>relationships</em> matter: pn holds n's address, pm holds m's address.</li>
</ul>
<table>
<tr><th>Step</th><th>Address (assumed by the slide)</th><th>n @100</th><th>m @96</th><th>pn @92</th><th>pm @88</th></tr>
<tr><td>after the declarations</td><td>—</td><td>7</td><td>6</td><td>100 (→ n)</td><td>96 (→ m)</td></tr>
<tr><td>① <code>*pn = 2*(*pm) + m*n</code> → 2·6 + 6·7 = 54</td><td>writes @100</td><td><strong>54</strong></td><td>6</td><td>100</td><td>96</td></tr>
<tr><td>② <code>*pm += 3*m - (*pn)</code> → 18 − 54 = −36</td><td>writes @96</td><td>54</td><td><strong>−30</strong></td><td>100</td><td>96</td></tr>
<tr><td><code>printf("m = %d, n = %d", m, n)</code></td><td>—</td><td>54</td><td>−30</td><td>100</td><td>96</td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    int n = 7, m = 6;

    int *pn = &amp;n;
    int *pm = &amp;m;

    *pn = 2*(*pm) + m*n;      /* (1) */
    *pm += 3*m - (*pn);       /* (2) */

    printf("m = %d, n = %d", m, n);
    return 0;
}</code></pre>
<p class="dap-an">✅ Compiled with <code>cc -Wall</code> and run: the program prints <code>m = -30, n = 54</code> — identical to the console window pictured on the slide, and identical to the hand trace above. Neither <code>pn</code> nor <code>pm</code> is ever reassigned, so both keep pointing at the same two boxes throughout; only the contents change.</p>
<p class="pitfall">⚠️ Two habits that make walkthrough questions safe: (1) write the table <em>before</em> you compute anything, one column per variable; (2) after each statement, cross out the old value and write the new one to its right — never erase, so you can see which value each later line should use.</p>`,
        `<p class="y-chinh">🎯 Dạng bài thi mẫu của cả slot: một chương trình ngắn, một hình bộ nhớ với các địa chỉ <strong>100, 96, 92, 88</strong>, và hai ô tính toán thay thế từng bước một. Kết quả trên console là <code>m = -30, n = 54</code>.</p>
<ul>
<li><strong>Thiết lập</strong> — <code>int n = 7, m = 6;</code> rồi <code>int *pn = &amp;n; int *pm = &amp;m;</code>. Hình bộ nhớ của slide (địa chỉ là GIẢ ĐỊNH, không phải số thật) đặt <code>n</code> ở 100, <code>m</code> ở 96, <code>pn</code> ở 92 giữ số 100, và <code>pm</code> ở 88 giữ số 96.</li>
<li><strong>Câu lệnh ①: <code>*pn = 2*(*pm) + m*n;</code></strong> — slide khai triển đúng nghĩa đen: <em>Giá trị tại 100 = 2*(giá trị tại 96) + m*n → 2*6 + 6*7 → 12 + 42 = 54</em>. Vậy <code>n</code> thành 54. Để ý vế phải dùng các giá trị <em>trước</em> khi ghi: m vẫn là 6 và n vẫn là 7.</li>
<li><strong>Câu lệnh ②: <code>*pm += 3*m - (*pn);</code></strong> — <em>Giá trị tại 96 += 3*6 – giá trị tại 100</em>. Mà "giá trị tại 100" bây giờ là <strong>54</strong> chứ không còn là 7, vì câu ① đã chạy rồi. <em>18 – 54 = –36</em>, nên <code>m = 6 + (–36) = –30</code>.</li>
<li><strong>Toàn bộ cái bẫy của bài tập</strong> nằm ở lần thay thế thứ hai đó. Sinh viên hay thay n = 7 ban đầu vào và ra <code>m = 6 + (18 − 7) = 17</code>. Walkthrough nghĩa là đọc lại bảng bộ nhớ <em>sau MỖI câu lệnh</em>, không bao giờ đọc lại từ dòng khai báo.</li>
<li><strong>Vì sao <code>+=</code> phải viết thành hai thao tác</strong> — <code>*pm += X</code> chính là <code>*pm = *pm + X</code>: đọc giá trị tại 96, cộng, rồi ghi trả về 96. Chuỗi dòng "Value at 96 += …" của slide vẽ đúng điều đó.</li>
<li><strong>Địa chỉ là bịa và điều đó hoàn toàn ổn</strong> — 100/96/92/88 được chọn cho dễ đọc. Chỉ <em>quan hệ</em> mới quan trọng: pn giữ địa chỉ của n, pm giữ địa chỉ của m.</li>
</ul>
<table>
<tr><th>Bước</th><th>Địa chỉ (GIẢ ĐỊNH theo slide)</th><th>n @100</th><th>m @96</th><th>pn @92</th><th>pm @88</th></tr>
<tr><td>sau các dòng khai báo</td><td>—</td><td>7</td><td>6</td><td>100 (→ n)</td><td>96 (→ m)</td></tr>
<tr><td>① <code>*pn = 2*(*pm) + m*n</code> → 2·6 + 6·7 = 54</td><td>ghi vào @100</td><td><strong>54</strong></td><td>6</td><td>100</td><td>96</td></tr>
<tr><td>② <code>*pm += 3*m - (*pn)</code> → 18 − 54 = −36</td><td>ghi vào @96</td><td>54</td><td><strong>−30</strong></td><td>100</td><td>96</td></tr>
<tr><td><code>printf("m = %d, n = %d", m, n)</code></td><td>—</td><td>54</td><td>−30</td><td>100</td><td>96</td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    int n = 7, m = 6;

    int *pn = &amp;n;
    int *pm = &amp;m;

    *pn = 2*(*pm) + m*n;      /* (1) */
    *pm += 3*m - (*pn);       /* (2) */

    printf("m = %d, n = %d", m, n);
    return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch bằng <code>cc -Wall</code> và chạy: chương trình in ra <code>m = -30, n = 54</code> — giống hệt cửa sổ console chụp trên slide, và giống hệt bảng vết ở trên. Cả <code>pn</code> lẫn <code>pm</code> không hề bị gán lại, nên suốt chương trình chúng vẫn trỏ vào đúng hai cái hộp cũ; chỉ nội dung thay đổi.</p>
<p class="pitfall">⚠️ Hai thói quen làm dạng bài walkthrough trở nên an toàn: (1) kẻ bảng <em>trước khi</em> tính bất cứ thứ gì, mỗi biến một cột; (2) sau mỗi câu lệnh thì gạch giá trị cũ rồi viết giá trị mới sang bên phải — đừng tẩy đi, để còn nhìn ra dòng sau phải dùng giá trị nào.</p>`],

      [13, 'Exercises - Write code and Walkthrough',
        `<p class="y-chinh">🎯 Two exercises in the same shape as slide 12, to be solved on paper. Both start from <code>int n = 7, m = 8;</code> and <code>int* p1 = &amp;n, *p2 = &amp;m;</code> — note that declaration: <strong>both</strong> p1 and p2 are pointers because each name has its own <code>*</code>.</p>
<ul>
<li><strong>Exercise 1</strong> — <code>*p1 += 12 - m + (*p2);</code> then <code>*p2 = m + n - 2 * (*p1);</code> then <code>printf("%d", m+n);</code>.</li>
<li><strong>Step 1</strong>: <code>*p1</code> is <code>n</code>, <code>*p2</code> is <code>m</code> = 8. So <code>n += 12 − 8 + 8 = 12</code> → <strong>n = 7 + 12 = 19</strong>.</li>
<li><strong>Step 2</strong>: <code>*p2 = m + n − 2*(*p1)</code>. Use the <em>updated</em> n = 19: <code>8 + 19 − 2·19 = 27 − 38 = −11</code> → <strong>m = −11</strong>.</li>
<li><strong>Step 3</strong>: <code>m + n = −11 + 19 = 8</code>.</li>
<li><strong>Exercise 2</strong> — <code>*p1 += 5 + 3 * (*p2) - n;</code> then <code>*p2 = 5 * (*p1) - 4*m + 2*n;</code>. Step 1: <code>n += 5 + 3·8 − 7 = 22</code> → <strong>n = 29</strong>. Step 2 with the updated n: <code>m = 5·29 − 4·8 + 2·29 = 145 − 32 + 58 = 171</code>.</li>
<li><strong>⚠ Exercise 2 as printed has no <code>printf</code></strong> although it asks "What is the output?". Taking the same final line as Exercise 1, <code>m + n = 171 + 29 = 200</code>. State your assumption in the exam rather than inventing a line silently.</li>
</ul>
<table>
<tr><th>Exercise</th><th>Statement</th><th>Substituted with the CURRENT values</th><th>n</th><th>m</th></tr>
<tr><td rowspan="3">1</td><td>start</td><td><code>p1 → n</code>, <code>p2 → m</code></td><td>7</td><td>8</td></tr>
<tr><td><code>*p1 += 12 - m + (*p2)</code></td><td>n += 12 − 8 + 8 = 12</td><td><strong>19</strong></td><td>8</td></tr>
<tr><td><code>*p2 = m + n - 2*(*p1)</code></td><td>m = 8 + 19 − 38 = −11</td><td>19</td><td><strong>−11</strong></td></tr>
<tr><td rowspan="3">2</td><td>start</td><td><code>p1 → n</code>, <code>p2 → m</code></td><td>7</td><td>8</td></tr>
<tr><td><code>*p1 += 5 + 3*(*p2) - n</code></td><td>n += 5 + 24 − 7 = 22</td><td><strong>29</strong></td><td>8</td></tr>
<tr><td><code>*p2 = 5*(*p1) - 4*m + 2*n</code></td><td>m = 145 − 32 + 58 = 171</td><td>29</td><td><strong>171</strong></td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    {   /* Exercise 1 */
        int n = 7, m = 8;
        int *p1 = &amp;n, *p2 = &amp;m;
        *p1 += 12 - m + (*p2);
        *p2 = m + n - 2 * (*p1);
        printf("Ex1: n = %d, m = %d, output m+n = %d\\n", n, m, m + n);
    }
    {   /* Exercise 2 - the slide gives no printf; same one assumed */
        int n = 7, m = 8;
        int *p1 = &amp;n, *p2 = &amp;m;
        *p1 += 5 + 3 * (*p2) - n;
        *p2 = 5 * (*p1) - 4*m + 2*n;
        printf("Ex2: n = %d, m = %d, (m+n) = %d\\n", n, m, m + n);
    }
    return 0;
}</code></pre>
<p class="dap-an">✅ Compiled with <code>cc -Wall</code> and run — the machine agrees with the hand trace:<br><code>Ex1: n = 19, m = -11, output m+n = 8</code> → <strong>Exercise 1 prints 8</strong>.<br><code>Ex2: n = 29, m = 171, (m+n) = 200</code> → <strong>Exercise 2 ends with n = 29 and m = 171</strong>; with the assumed <code>printf("%d", m+n)</code> it would print 200.<br>⚠️ Reported as it is on the slide: <em>Exercise 2 omits the <code>printf</code> line and still asks for the output.</em> The safe answer gives the final n and m and states the assumption; it is not corrected in the slide here.</p>
<p class="pitfall">⚠️ Both exercises are engineered so that using the ORIGINAL n in the second statement gives a plausible-looking wrong answer (Ex1 would give −19 + 19 = 0 instead of 8). Re-read your table after every single line — that discipline is the exercise.</p>`,
        `<p class="y-chinh">🎯 Hai bài tập cùng khuôn với slide 12, làm trên giấy. Cả hai đều bắt đầu từ <code>int n = 7, m = 8;</code> và <code>int* p1 = &amp;n, *p2 = &amp;m;</code> — chú ý dòng khai báo đó: <strong>cả hai</strong> p1 và p2 đều là con trỏ vì mỗi tên đều có dấu <code>*</code> của riêng nó.</p>
<ul>
<li><strong>Bài 1</strong> — <code>*p1 += 12 - m + (*p2);</code> rồi <code>*p2 = m + n - 2 * (*p1);</code> rồi <code>printf("%d", m+n);</code>.</li>
<li><strong>Bước 1</strong>: <code>*p1</code> chính là <code>n</code>, <code>*p2</code> chính là <code>m</code> = 8. Vậy <code>n += 12 − 8 + 8 = 12</code> → <strong>n = 7 + 12 = 19</strong>.</li>
<li><strong>Bước 2</strong>: <code>*p2 = m + n − 2*(*p1)</code>. Dùng n <em>đã cập nhật</em> là 19: <code>8 + 19 − 2·19 = 27 − 38 = −11</code> → <strong>m = −11</strong>.</li>
<li><strong>Bước 3</strong>: <code>m + n = −11 + 19 = 8</code>.</li>
<li><strong>Bài 2</strong> — <code>*p1 += 5 + 3 * (*p2) - n;</code> rồi <code>*p2 = 5 * (*p1) - 4*m + 2*n;</code>. Bước 1: <code>n += 5 + 3·8 − 7 = 22</code> → <strong>n = 29</strong>. Bước 2 với n đã cập nhật: <code>m = 5·29 − 4·8 + 2·29 = 145 − 32 + 58 = 171</code>.</li>
<li><strong>⚠ Bài 2 in trên slide KHÔNG có câu <code>printf</code></strong> mà vẫn hỏi "What is the output?". Nếu lấy đúng dòng cuối của Bài 1 thì <code>m + n = 171 + 29 = 200</code>. Trong bài thi hãy ghi rõ giả định của mình chứ đừng lặng lẽ bịa thêm một dòng lệnh.</li>
</ul>
<table>
<tr><th>Bài</th><th>Câu lệnh</th><th>Thay bằng giá trị HIỆN TẠI</th><th>n</th><th>m</th></tr>
<tr><td rowspan="3">1</td><td>khởi đầu</td><td><code>p1 → n</code>, <code>p2 → m</code></td><td>7</td><td>8</td></tr>
<tr><td><code>*p1 += 12 - m + (*p2)</code></td><td>n += 12 − 8 + 8 = 12</td><td><strong>19</strong></td><td>8</td></tr>
<tr><td><code>*p2 = m + n - 2*(*p1)</code></td><td>m = 8 + 19 − 38 = −11</td><td>19</td><td><strong>−11</strong></td></tr>
<tr><td rowspan="3">2</td><td>khởi đầu</td><td><code>p1 → n</code>, <code>p2 → m</code></td><td>7</td><td>8</td></tr>
<tr><td><code>*p1 += 5 + 3*(*p2) - n</code></td><td>n += 5 + 24 − 7 = 22</td><td><strong>29</strong></td><td>8</td></tr>
<tr><td><code>*p2 = 5*(*p1) - 4*m + 2*n</code></td><td>m = 145 − 32 + 58 = 171</td><td>29</td><td><strong>171</strong></td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    {   /* Bai 1 */
        int n = 7, m = 8;
        int *p1 = &amp;n, *p2 = &amp;m;
        *p1 += 12 - m + (*p2);
        *p2 = m + n - 2 * (*p1);
        printf("Bai1: n = %d, m = %d, ket qua m+n = %d\\n", n, m, m + n);
    }
    {   /* Bai 2 - slide khong cho printf; gia dinh dung cung mot dong */
        int n = 7, m = 8;
        int *p1 = &amp;n, *p2 = &amp;m;
        *p1 += 5 + 3 * (*p2) - n;
        *p2 = 5 * (*p1) - 4*m + 2*n;
        printf("Bai2: n = %d, m = %d, (m+n) = %d\\n", n, m, m + n);
    }
    return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch bằng <code>cc -Wall</code> và chạy — máy khớp với bảng vết làm tay:<br><code>Bai1: n = 19, m = -11, ket qua m+n = 8</code> → <strong>Bài 1 in ra 8</strong>.<br><code>Bai2: n = 29, m = 171, (m+n) = 200</code> → <strong>Bài 2 kết thúc với n = 29 và m = 171</strong>; nếu lấy giả định <code>printf("%d", m+n)</code> thì in ra 200.<br>⚠️ Nêu đúng như slide có: <em>Bài 2 thiếu dòng <code>printf</code> mà vẫn hỏi kết quả in ra.</em> Câu trả lời an toàn là đưa ra n và m cuối cùng kèm lời nêu giả định; ở đây không tự sửa slide.</p>
<p class="pitfall">⚠️ Cả hai bài đều được thiết kế sao cho nếu bạn dùng n BAN ĐẦU ở câu lệnh thứ hai thì ra một đáp số sai nhưng trông rất hợp lý (Bài 1 sẽ ra −19 + 19 = 0 thay vì 8). Đọc lại bảng sau từng dòng một — chính kỷ luật đó mới là nội dung bài tập.</p>`],

      [14, 'Attention about Accessing Pointers',
        `<p class="y-chinh">🎯 Two warnings that both come from one idea: <strong>the base type decides how many bytes the <code>*</code> operator touches</strong>. Access through <code>int*</code> → 4 bytes. Through <code>char*</code> → 1 byte. Through <code>double*</code> → 8 bytes.</p>
<ul>
<li><strong>Why "how many bytes" is a real question</strong> — a pointer only stores the address of the <em>first</em> byte. Nothing in that number says where the item ends. The type supplies the missing half of the information.</li>
<li><strong>The consequence for reading</strong> — <code>*pd</code> on a <code>double*</code> gathers 8 bytes and reassembles them as a floating-point number. Point an <code>int*</code> at the same 8 bytes and <code>*</code> takes only the first 4 and reads them as an integer: a completely different value, with no error.</li>
<li><strong>The consequence for writing</strong> — <code>*pc = 0</code> through a <code>char*</code> zeroes exactly one byte and leaves the other three of an <code>int</code> untouched. Slide 15 turns that into a whole worked example.</li>
<li><strong>Second warning: "Assign pointers which belong to different types is not allowed"</strong> — <code>int *p; double *q; p = q;</code> is an error in C. The compiler refuses because it would lose the size information.</li>
<li><strong>"If needed, you must explicitly cast"</strong> — <code>p = (int*)q;</code> compiles. The cast does not convert anything; it only silences the compiler. You are now responsible for the consequences, which is why casts between unrelated pointer types are rare in correct code.</li>
<li><strong>The one exception you will use constantly</strong> — <code>void*</code>. <code>malloc</code> returns <code>void*</code> and slide 24 notes it explicitly: <em>"user must give an explicit casting when it is used"</em>, hence <code>(int*)malloc(sizeof(int))</code>.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    int   n  = 0x41424344;      /* 4 bytes: 41 42 43 44 */
    char *pc = (char*)&amp;n;       /* explicit cast: int* -&gt; char* */

    printf("before        : n = %d (0x%X)\\n", n, n);
    *pc = 0;                    /* char* : ONE byte only */
    printf("after *pc = 0 : n = %d (0x%X)\\n", n, n);

    double  d    = 1.5;
    int    *wrong = (int*)&amp;d;   /* reading a double through int* */
    printf("a double read through int* : %d  (not 1, not 1.5)\\n", *wrong);
    return 0;
}</code></pre>
<p class="dap-an">✅ Compiled with <code>cc -Wall</code> and run: <code>before : n = 1094861636 (0x41424344)</code> then <code>after *pc = 0 : n = 1094861568 (0x41424300)</code>. Exactly <strong>one byte</strong> — the lowest one — went to zero; the other three are untouched, proving the slide's "only 1 byte is affected". The third line prints <code>0</code>: the first 4 bytes of the double 1.5 are all zero on this machine, so <code>*wrong</code> is 0 rather than anything resembling 1.5. No crash, no warning at run time — just a silently wrong number, which is the danger the slide is pointing at.</p>
<p class="pitfall">⚠️ Note which byte changed: the value dropped from 0x414243<strong>44</strong> to 0x414243<strong>00</strong>, i.e. the byte at the <em>lowest address</em> is the <em>least significant</em> one. That is little-endian, and it is the entire mechanism of slide 15. On a big-endian machine the same program would print a different number.</p>`,
        `<p class="y-chinh">🎯 Hai lời cảnh báo cùng bắt nguồn từ một ý: <strong>kiểu cơ sở quyết định toán tử <code>*</code> chạm vào bao nhiêu byte</strong>. Truy cập qua <code>int*</code> → 4 byte. Qua <code>char*</code> → 1 byte. Qua <code>double*</code> → 8 byte.</p>
<ul>
<li><strong>Vì sao "bao nhiêu byte" lại là câu hỏi thật</strong> — con trỏ chỉ cất địa chỉ của byte <em>đầu tiên</em>. Trong con số đó chẳng có gì nói mục dữ liệu kết thúc ở đâu. Kiểu dữ liệu cấp nốt nửa thông tin còn thiếu.</li>
<li><strong>Hệ quả khi ĐỌC</strong> — <code>*pd</code> trên một <code>double*</code> gom 8 byte rồi ráp lại thành một số thực. Trỏ một <code>int*</code> vào đúng 8 byte đó thì <code>*</code> chỉ lấy 4 byte đầu và đọc chúng như số nguyên: ra một giá trị khác hẳn, mà không báo lỗi gì.</li>
<li><strong>Hệ quả khi GHI</strong> — <code>*pc = 0</code> qua một <code>char*</code> làm rỗng đúng một byte và để nguyên ba byte còn lại của một <code>int</code>. Slide 15 biến chuyện đó thành cả một ví dụ đầy đủ.</li>
<li><strong>Cảnh báo thứ hai: "Không được gán con trỏ khác kiểu cho nhau"</strong> — <code>int *p; double *q; p = q;</code> là lỗi trong C. Trình biên dịch từ chối vì làm thế là đánh mất thông tin kích thước.</li>
<li><strong>"Nếu cần thì phải ép kiểu tường minh"</strong> — <code>p = (int*)q;</code> thì biên dịch được. Phép ép kiểu không chuyển đổi gì cả; nó chỉ làm trình biên dịch im lặng. Từ đó bạn tự chịu trách nhiệm về hậu quả, và vì thế ép kiểu giữa hai loại con trỏ không liên quan là chuyện hiếm trong mã đúng.</li>
<li><strong>Ngoại lệ duy nhất bạn sẽ dùng liên tục</strong> — <code>void*</code>. Hàm <code>malloc</code> trả về <code>void*</code> và slide 24 ghi rõ: <em>"người dùng phải ép kiểu tường minh khi dùng nó"</em>, nên mới có <code>(int*)malloc(sizeof(int))</code>.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    int   n  = 0x41424344;      /* 4 byte: 41 42 43 44 */
    char *pc = (char*)&amp;n;       /* ep kieu tuong minh: int* -&gt; char* */

    printf("truoc         : n = %d (0x%X)\\n", n, n);
    *pc = 0;                    /* char* : CHI mot byte */
    printf("sau *pc = 0   : n = %d (0x%X)\\n", n, n);

    double  d     = 1.5;
    int    *wrong = (int*)&amp;d;   /* doc mot double qua int* */
    printf("doc double qua int* : %d  (khong phai 1, cung khong phai 1.5)\\n", *wrong);
    return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch bằng <code>cc -Wall</code> và chạy: <code>truoc : n = 1094861636 (0x41424344)</code> rồi <code>sau *pc = 0 : n = 1094861568 (0x41424300)</code>. Đúng <strong>một byte</strong> — byte thấp nhất — bị đưa về 0; ba byte kia nguyên vẹn, chứng minh câu "chỉ 1 byte bị ảnh hưởng" của slide. Dòng thứ ba in ra <code>0</code>: bốn byte đầu của số thực 1.5 trên máy này đều bằng 0, nên <code>*wrong</code> là 0 chứ chẳng giống 1.5 chút nào. Không sập, không có cảnh báo lúc chạy — chỉ là một con số sai trong im lặng, đúng cái nguy hiểm mà slide đang chỉ ra.</p>
<p class="pitfall">⚠️ Để ý byte nào đã đổi: giá trị tụt từ 0x414243<strong>44</strong> xuống 0x414243<strong>00</strong>, tức byte ở <em>địa chỉ thấp nhất</em> chính là byte <em>ít quan trọng nhất</em>. Đó là little-endian, và đó là toàn bộ cơ chế của slide 15. Trên máy big-endian, cùng chương trình ấy sẽ in ra một con số khác.</p>`],

      [15, 'Attention…Pointers: Explicit Casting',
        `<p class="y-chinh">🎯 A complete worked example of the previous slide. The program starts with <code>n = 260</code>, writes a single zero byte through a <code>char*</code>, and the console shows <code>n=260</code> then <code>n=256</code>. The review line explains why: <em>"When a casting is performed, lowest byte is copied first then the higher bytes."</em></p>
<ul>
<li><strong>The code</strong> — <code>int n = 260, *p = &amp;n;</code> · <code>printf("n=%d\\n", n);</code> · <code>char *pp = (char*)p;</code> · <code>*pp = 0;</code> · <code>printf("n=%d\\n", n);</code>.</li>
<li><strong>260 in binary, four bytes</strong> — the slide draws the stack of bytes: <code>0000 0000 · 0000 0000 · 0000 0001 · 0000 0100</code>. That is 0x00000104: the byte 0000 0100 is 4, the byte 0000 0001 is the 256.</li>
<li><strong>The cast copies the number, not the data</strong> — <code>pp</code> gets exactly the same address as <code>p</code> (the slide labels both boxes 500). Nothing in memory moves. The only thing that changed is the compiler's opinion about how wide the item there is: <em>"Manipulate on 4 bytes"</em> for p, <em>"Manipulate on 1 byte only"</em> for pp.</li>
<li><strong><code>*pp = 0</code></strong> — writes zero into the lowest byte only, i.e. 0000 0100 → 0000 0000. The remaining bytes still spell 0x00000100.</li>
<li><strong>Result: 260 − 4 = 256</strong>, printed by the second <code>printf</code>. And it is the <em>same variable</em> <code>n</code>: <code>n</code> was never on the left of an <code>=</code>.</li>
<li><strong>Why this is on the exam</strong> — it tests three things at once: that you know a cast changes only the view, that you know int is 4 bytes, and that you know the lowest address holds the least significant byte on a PC.</li>
</ul>
<table>
<tr><th>Step</th><th>Address (assumed 500, as on the slide)</th><th>The 4 bytes of n</th><th>n as a number</th></tr>
<tr><td><code>int n = 260;</code></td><td>500..503</td><td><code>0000 0100 · 0000 0001 · 0000 0000 · 0000 0000</code></td><td>260</td></tr>
<tr><td><code>int *p = &amp;n;</code></td><td>p = 500</td><td>unchanged — p views 4 bytes</td><td>260</td></tr>
<tr><td><code>char *pp = (char*)p;</code></td><td>pp = 500 (the same number)</td><td>unchanged — pp views 1 byte</td><td>260</td></tr>
<tr><td><code>*pp = 0;</code></td><td>writes @500 only</td><td><code><strong>0000 0000</strong> · 0000 0001 · 0000 0000 · 0000 0000</code></td><td><strong>256</strong></td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    int n = 260, *p = &amp;n;
    char *pp;

    printf("n=%d\\n", n);

    pp = (char*)p;      /* explicit cast: same address, narrower view */
    *pp = 0;            /* clears the LOWEST byte (the 4) */

    printf("n=%d\\n", n);
    return 0;
}</code></pre>
<p class="dap-an">✅ Compiled with <code>cc -Wall</code> and run: it prints <code>n=260</code> then <code>n=256</code> — identical to the little black console on the slide. The arithmetic checks out: 260 = 256 + 4, and the byte holding the 4 is the one <code>*pp = 0</code> erased. (The original slide includes <code>#include &lt;conio.h&gt;</code> and <code>getch()</code> — Dev-C++/Windows only; drop both on Linux/macOS, they are not part of standard C.)</p>
<p class="pitfall">⚠️ Do not read the slide's review line as "a cast reorders bytes". It does not: <code>(char*)p</code> moves nothing at all. The sentence is about <em>which byte sits at the lowest address</em> — and that is what makes the cast land on the 4 rather than on the 256. Change the machine's endianness and the same program prints <code>n=4</code>.</p>`,
        `<p class="y-chinh">🎯 Một ví dụ làm mẫu đầy đủ cho slide trước. Chương trình bắt đầu với <code>n = 260</code>, ghi đúng một byte 0 thông qua <code>char*</code>, và console hiện <code>n=260</code> rồi <code>n=256</code>. Dòng Review giải thích vì sao: <em>"Khi ép kiểu, byte thấp nhất được chép trước rồi mới tới các byte cao hơn."</em></p>
<ul>
<li><strong>Đoạn mã</strong> — <code>int n = 260, *p = &amp;n;</code> · <code>printf("n=%d\\n", n);</code> · <code>char *pp = (char*)p;</code> · <code>*pp = 0;</code> · <code>printf("n=%d\\n", n);</code>.</li>
<li><strong>260 ở dạng nhị phân, bốn byte</strong> — slide vẽ chồng byte: <code>0000 0000 · 0000 0000 · 0000 0001 · 0000 0100</code>. Đó là 0x00000104: byte 0000 0100 là số 4, byte 0000 0001 chính là 256.</li>
<li><strong>Ép kiểu chỉ chép CON SỐ, không chép dữ liệu</strong> — <code>pp</code> nhận đúng cùng địa chỉ với <code>p</code> (slide ghi cả hai ô là 500). Không có gì trong bộ nhớ dịch chuyển. Thứ duy nhất thay đổi là quan điểm của trình biên dịch về độ rộng của mục nằm ở đó: <em>"Manipulate on 4 bytes"</em> với p, <em>"Manipulate on 1 byte only"</em> với pp.</li>
<li><strong><code>*pp = 0</code></strong> — ghi số 0 vào đúng byte thấp nhất, tức 0000 0100 → 0000 0000. Các byte còn lại vẫn viết nên 0x00000100.</li>
<li><strong>Kết quả: 260 − 4 = 256</strong>, do câu <code>printf</code> thứ hai in ra. Và vẫn là <em>đúng biến</em> <code>n</code> ấy: <code>n</code> chưa từng đứng bên trái dấu <code>=</code>.</li>
<li><strong>Vì sao chỗ này hay ra đề</strong> — nó kiểm ba thứ cùng lúc: bạn có biết ép kiểu chỉ đổi cách NHÌN không, có biết int rộng 4 byte không, và có biết trên máy PC thì địa chỉ thấp nhất giữ byte ít quan trọng nhất không.</li>
</ul>
<table>
<tr><th>Bước</th><th>Địa chỉ (GIẢ ĐỊNH là 500, theo slide)</th><th>Bốn byte của n</th><th>n đọc thành số</th></tr>
<tr><td><code>int n = 260;</code></td><td>500..503</td><td><code>0000 0100 · 0000 0001 · 0000 0000 · 0000 0000</code></td><td>260</td></tr>
<tr><td><code>int *p = &amp;n;</code></td><td>p = 500</td><td>không đổi — p nhìn 4 byte</td><td>260</td></tr>
<tr><td><code>char *pp = (char*)p;</code></td><td>pp = 500 (cùng một con số)</td><td>không đổi — pp nhìn 1 byte</td><td>260</td></tr>
<tr><td><code>*pp = 0;</code></td><td>chỉ ghi vào @500</td><td><code><strong>0000 0000</strong> · 0000 0001 · 0000 0000 · 0000 0000</code></td><td><strong>256</strong></td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    int n = 260, *p = &amp;n;
    char *pp;

    printf("n=%d\\n", n);

    pp = (char*)p;      /* ep kieu tuong minh: cung dia chi, tam nhin hep hon */
    *pp = 0;            /* xoa byte THAP NHAT (so 4) */

    printf("n=%d\\n", n);
    return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch bằng <code>cc -Wall</code> và chạy: in ra <code>n=260</code> rồi <code>n=256</code> — giống hệt cửa sổ console nhỏ màu đen trên slide. Phép tính khớp: 260 = 256 + 4, và byte giữ số 4 chính là byte bị <code>*pp = 0</code> xoá. (Slide gốc có thêm <code>#include &lt;conio.h&gt;</code> và <code>getch()</code> — chỉ có trên Dev-C++/Windows; trên Linux/macOS bỏ cả hai đi, chúng không thuộc chuẩn C.)</p>
<p class="pitfall">⚠️ Đừng đọc dòng Review của slide thành "ép kiểu sắp xếp lại byte". Không hề: <code>(char*)p</code> không dịch chuyển gì cả. Câu ấy nói về chuyện <em>byte nào nằm ở địa chỉ thấp nhất</em> — và chính điều đó khiến phép ép kiểu rơi trúng số 4 chứ không rơi trúng số 256. Đổi sang máy big-endian thì cùng chương trình đó in ra <code>n=4</code>.</p>`],

      [16, 'Pointer Arithmetic Operators',
        `<p class="y-chinh">🎯 The table of every arithmetic form, plus the rule that makes pointer arithmetic different from integer arithmetic: <em>"Each time a pointer is incremented, it points to the memory location of the NEXT ELEMENT of its base type"</em> — not the next byte.</p>
<ul>
<li><strong>The six rows of the table</strong> — <code>++ptr_var</code> / <code>ptr_var++</code>: points to the next integer after var. <code>--ptr_var</code> / <code>ptr_var--</code>: points to the previous integer. <code>ptr_var + i</code>: the i-th integer after var. <code>ptr_var - i</code>: the i-th integer before. <code>++*ptr_var</code> or <code>(*ptr_var)++</code>: <strong>increments var by 1</strong>. <code>*ptr_var++</code>: <strong>fetches the value of the next integer after var</strong>.</li>
<li><strong>The last two rows are the exam questions</strong> — they look almost identical and do completely different things. <code>(*p)++</code> changes the <em>data</em>; <code>*p++</code> changes the <em>pointer</em> (and yields the old <code>*p</code>). The brackets are the whole difference, because <code>++</code> binds tighter than <code>*</code>.</li>
<li><strong>"All other pointers will increase or decrease depending on the length of the data type they are pointing to"</strong> — the scaling rule. <code>p + 1</code> really means <code>p + 1 * sizeof(base type)</code> bytes. Slide 19 states it as a formula: <em>Pointer + i → Pointer + (i * sizeof(baseType))</em>.</li>
<li><strong>Why C scales for you</strong> — so that <code>p + i</code> and <code>a[i]</code> mean the same thing. Indeed <code>a[i]</code> is <em>defined</em> as <code>*(a + i)</code>. Without scaling, every array access would need a multiplication written by hand.</li>
<li><strong>What is NOT allowed</strong> — you cannot multiply or divide pointers, and you cannot add two pointers. Only: pointer ± integer, and pointer − pointer (which gives a count of elements, not of bytes).</li>
<li><strong>Where it becomes indispensable</strong> — Slot 13–18. Walking a string with <code>while (*p) p++;</code> is pointer arithmetic doing the work of an index variable.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    int  a[5] = {10, 20, 30, 40, 50};
    int *p = a;                 /* p points at a[0] */
    int  v;

    printf("*p       = %d\\n", *p);         /* 10 */
    printf("*(p + 2) = %d\\n", *(p + 2));   /* 30, same as a[2] */
    printf("a[2]     = %d\\n", a[2]);

    v = (*p)++;    /* take *p (10), then add 1 to the DATA  */
    printf("(*p)++  -&gt; v = %d, a[0] = %d, *p = %d\\n", v, a[0], *p);

    p = a;
    v = *p++;      /* take *p (11), then move the POINTER   */
    printf("*p++    -&gt; v = %d, now *p = %d\\n", v, *p);

    printf("p - a   = %ld elements\\n", (long)(p - a));
    return 0;
}</code></pre>
<p class="dap-an">✅ Compiled with <code>cc -Wall</code> and run: <code>*p = 10</code> · <code>*(p+2) = 30</code> · <code>a[2] = 30</code> · <code>(*p)++ -&gt; v = 10, a[0] = 11, *p = 11</code> (the <em>array element</em> grew) · <code>*p++ -&gt; v = 11, now *p = 20</code> (the <em>pointer</em> moved, the array is untouched) · <code>p - a = 1 elements</code>. Two lines apart, two totally different effects — exactly what the last two rows of the slide's table say.</p>
<p class="pitfall">⚠️ <code>p + 1</code> adds <code>sizeof(*p)</code> bytes, so on an <code>int*</code> the raw address goes up by <strong>4</strong>, not by 1. Printing <code>p</code> and <code>p+1</code> as numbers is the fastest way to convince yourself — slide 18 does exactly that.</p>`,
        `<p class="y-chinh">🎯 Bảng liệt kê mọi dạng phép số học, kèm quy tắc làm số học con trỏ khác hẳn số học số nguyên: <em>"Mỗi lần con trỏ tăng lên, nó trỏ tới ô nhớ của PHẦN TỬ KẾ TIẾP theo kiểu cơ sở của nó"</em> — chứ không phải byte kế tiếp.</p>
<ul>
<li><strong>Sáu dòng của bảng</strong> — <code>++ptr_var</code> / <code>ptr_var++</code>: trỏ tới số nguyên ngay sau var. <code>--ptr_var</code> / <code>ptr_var--</code>: trỏ tới số nguyên ngay trước. <code>ptr_var + i</code>: số nguyên thứ i sau var. <code>ptr_var - i</code>: số nguyên thứ i trước đó. <code>++*ptr_var</code> hoặc <code>(*ptr_var)++</code>: <strong>tăng chính var lên 1</strong>. <code>*ptr_var++</code>: <strong>lấy giá trị của số nguyên kế tiếp sau var</strong>.</li>
<li><strong>Hai dòng cuối chính là câu hỏi thi</strong> — chúng nhìn gần như giống hệt nhau mà làm hai việc hoàn toàn khác. <code>(*p)++</code> đổi <em>dữ liệu</em>; <code>*p++</code> đổi <em>con trỏ</em> (và trả về giá trị <code>*p</code> cũ). Cặp ngoặc là toàn bộ khác biệt, vì <code>++</code> bám chặt hơn <code>*</code>.</li>
<li><strong>"Mọi con trỏ khác sẽ tăng hoặc giảm tuỳ theo độ dài của kiểu dữ liệu mà nó trỏ tới"</strong> — quy tắc nhân theo kích thước. <code>p + 1</code> thật ra nghĩa là <code>p + 1 * sizeof(kiểu cơ sở)</code> byte. Slide 19 viết hẳn thành công thức: <em>Pointer + i → Pointer + (i * sizeof(baseType))</em>.</li>
<li><strong>Vì sao C tự nhân giùm bạn</strong> — để <code>p + i</code> và <code>a[i]</code> nghĩa y hệt nhau. Thật vậy, <code>a[i]</code> được <em>định nghĩa</em> là <code>*(a + i)</code>. Không có phép nhân tự động thì mọi lần truy cập mảng đều phải tự viết một phép nhân.</li>
<li><strong>Thứ KHÔNG được phép</strong> — không nhân, không chia con trỏ, và không cộng hai con trỏ với nhau. Chỉ có: con trỏ ± số nguyên, và con trỏ − con trỏ (cho ra số PHẦN TỬ, không phải số byte).</li>
<li><strong>Nơi nó trở nên không thể thiếu</strong> — Slot 13–18. Duyệt một chuỗi bằng <code>while (*p) p++;</code> chính là số học con trỏ làm thay việc của biến chỉ số.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    int  a[5] = {10, 20, 30, 40, 50};
    int *p = a;                 /* p tro vao a[0] */
    int  v;

    printf("*p       = %d\\n", *p);         /* 10 */
    printf("*(p + 2) = %d\\n", *(p + 2));   /* 30, giong a[2] */
    printf("a[2]     = %d\\n", a[2]);

    v = (*p)++;    /* lay *p (10) roi cong 1 vao DU LIEU  */
    printf("(*p)++  -&gt; v = %d, a[0] = %d, *p = %d\\n", v, a[0], *p);

    p = a;
    v = *p++;      /* lay *p (11) roi dich CON TRO        */
    printf("*p++    -&gt; v = %d, gio *p = %d\\n", v, *p);

    printf("p - a   = %ld phan tu\\n", (long)(p - a));
    return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch bằng <code>cc -Wall</code> và chạy: <code>*p = 10</code> · <code>*(p+2) = 30</code> · <code>a[2] = 30</code> · <code>(*p)++ -&gt; v = 10, a[0] = 11, *p = 11</code> (chính <em>phần tử mảng</em> tăng lên) · <code>*p++ -&gt; v = 11, gio *p = 20</code> (<em>con trỏ</em> dịch đi, mảng không đổi) · <code>p - a = 1 phan tu</code>. Hai dòng cách nhau, hai tác dụng khác hẳn — đúng y những gì hai dòng cuối bảng của slide nói.</p>
<p class="pitfall">⚠️ <code>p + 1</code> cộng thêm <code>sizeof(*p)</code> byte, nên với <code>int*</code> thì địa chỉ thô tăng <strong>4</strong> chứ không tăng 1. In <code>p</code> và <code>p+1</code> ra dạng số là cách nhanh nhất để tự thuyết phục mình — slide 18 làm đúng như vậy.</p>`],

      [17, 'Pointer Comparisons',
        `<p class="y-chinh">🎯 Seven comparisons in a table, and one condition printed in bold above it: <em>"Two pointers can be compared in a relational expression PROVIDED both the pointers are pointing to variables of the SAME TYPE."</em></p>
<ul>
<li><strong>The table, row by row</strong> — <code>ptr_a &lt; ptr_b</code>: true provided <strong>a</strong> is stored before <strong>b</strong>. <code>&gt;</code>: a is stored after b. <code>&lt;=</code> / <code>&gt;=</code>: the same, or both pointing at the same location. <code>==</code>: both point at the <em>same</em> data element. <code>!=</code>: they point at <em>different</em> elements of the same type. <code>ptr_a == NULL</code>: true if ptr_a was assigned NULL (zero).</li>
<li><strong>Notice what is being compared</strong> — the addresses, not the data. <code>ptr_a == ptr_b</code> asks "same box?", not "same value?". For "same value?" you write <code>*ptr_a == *ptr_b</code>. Two pointers into two different variables both holding 7 are equal in <code>*</code> and unequal in <code>==</code>.</li>
<li><strong>Why "same type" is required</strong> — comparing an <code>int*</code> with a <code>double*</code> is meaningless (and the compiler warns), because "before" and "after" only have a meaning within one array of one element size.</li>
<li><strong>The honest limitation the slide does not spell out</strong> — <code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code>, <code>&gt;=</code> are only <em>defined</em> when both pointers are inside the <strong>same array or memory block</strong>. Comparing the addresses of two unrelated local variables may compile and even print something, but the answer is not guaranteed by the C standard — the compiler is free to place them in any order.</li>
<li><strong><code>== NULL</code> is the row you will use most</strong> — it is the standard check after <code>malloc</code> (slide 33: <em>"Always check if the pointer returned by malloc, calloc or realloc is NULL"</em>) and the standard way to mark "this pointer points at nothing yet".</li>
<li><strong>Typical use</strong> — the classic array loop <code>for (p = a; p &lt; a + n; p++)</code> compares two pointers into the same array, which is exactly the legal case.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    int  arr[5] = {10, 20, 30, 40, 50};
    int *ptr_a = &amp;arr[1];      /* same array: comparison is well defined */
    int *ptr_b = &amp;arr[3];
    int *pnull = NULL;
    int *p;

    printf("a&lt;b:%d a&gt;b:%d a&lt;=b:%d a&gt;=b:%d a==b:%d a!=b:%d\\n",
           ptr_a &lt; ptr_b, ptr_a &gt; ptr_b, ptr_a &lt;= ptr_b,
           ptr_a &gt;= ptr_b, ptr_a == ptr_b, ptr_a != ptr_b);
    printf("ptr_b - ptr_a = %ld elements\\n", (long)(ptr_b - ptr_a));

    ptr_b = ptr_a;
    printf("after ptr_b = ptr_a  -&gt;  a==b: %d\\n", ptr_a == ptr_b);
    printf("pnull == NULL: %d\\n", pnull == NULL);

    /* the legal, everyday use of &lt; on pointers */
    for (p = arr; p &lt; arr + 5; p++) printf("%d ", *p);
    printf("\\n");
    return 0;
}</code></pre>
<p class="dap-an">✅ Compiled with <code>cc -Wall</code> and run: <code>a&lt;b:1 a&gt;b:0 a&lt;=b:1 a&gt;=b:0 a==b:0 a!=b:1</code> — arr[1] really is stored before arr[3], matching rows 1–6 of the slide. Then <code>ptr_b - ptr_a = 2 elements</code> (2, not 8 — the difference counts <em>elements</em>), <code>after ptr_b = ptr_a -&gt; a==b: 1</code>, <code>pnull == NULL: 1</code>, and the loop prints <code>10 20 30 40 50</code>.</p>
<p class="pitfall">⚠️ <code>ptr_a == ptr_b</code> and <code>*ptr_a == *ptr_b</code> are different questions and an exam will ask both. Say them in words: "the same box" versus "the same content". Two different boxes can hold the same content.</p>`,
        `<p class="y-chinh">🎯 Bảy phép so sánh gói trong một bảng, và một điều kiện in đậm ngay phía trên: <em>"Hai con trỏ so sánh được trong một biểu thức quan hệ VỚI ĐIỀU KIỆN cả hai đều trỏ tới biến CÙNG KIỂU."</em></p>
<ul>
<li><strong>Bảng, đọc từng dòng</strong> — <code>ptr_a &lt; ptr_b</code>: đúng nếu <strong>a</strong> được lưu TRƯỚC <strong>b</strong>. <code>&gt;</code>: a lưu sau b. <code>&lt;=</code> / <code>&gt;=</code>: như trên, hoặc cả hai cùng trỏ một chỗ. <code>==</code>: cả hai trỏ vào <em>cùng một</em> phần tử dữ liệu. <code>!=</code>: chúng trỏ vào hai phần tử <em>khác nhau</em> nhưng cùng kiểu. <code>ptr_a == NULL</code>: đúng nếu ptr_a đã được gán NULL (bằng 0).</li>
<li><strong>Để ý cái gì đang được đem so</strong> — địa chỉ, không phải dữ liệu. <code>ptr_a == ptr_b</code> hỏi "có cùng một cái hộp không?", không hỏi "có cùng giá trị không?". Muốn hỏi giá trị thì viết <code>*ptr_a == *ptr_b</code>. Hai con trỏ vào hai biến khác nhau cùng chứa số 7 thì bằng nhau qua <code>*</code> và khác nhau qua <code>==</code>.</li>
<li><strong>Vì sao bắt buộc "cùng kiểu"</strong> — đem <code>int*</code> so với <code>double*</code> là vô nghĩa (và trình biên dịch sẽ cảnh báo), vì "trước" và "sau" chỉ có nghĩa bên trong một mảng có cùng một cỡ phần tử.</li>
<li><strong>Giới hạn thật mà slide không nói rõ</strong> — <code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code>, <code>&gt;=</code> chỉ <em>có định nghĩa</em> khi cả hai con trỏ nằm trong <strong>cùng một mảng hoặc cùng một khối nhớ</strong>. So địa chỉ của hai biến cục bộ chẳng liên quan thì vẫn biên dịch được và vẫn in ra thứ gì đó, nhưng chuẩn C không bảo đảm kết quả — trình biên dịch được quyền xếp chúng theo thứ tự nào tuỳ ý.</li>
<li><strong><code>== NULL</code> là dòng bạn dùng nhiều nhất</strong> — nó là phép kiểm chuẩn sau <code>malloc</code> (slide 33: <em>"Luôn kiểm tra xem con trỏ do malloc, calloc hay realloc trả về có NULL không"</em>) và là cách chuẩn để đánh dấu "con trỏ này chưa trỏ vào đâu cả".</li>
<li><strong>Cách dùng điển hình</strong> — vòng lặp mảng kinh điển <code>for (p = a; p &lt; a + n; p++)</code> so hai con trỏ trong cùng một mảng, tức đúng trường hợp hợp lệ.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    int  arr[5] = {10, 20, 30, 40, 50};
    int *ptr_a = &amp;arr[1];      /* cung mot mang: so sanh co dinh nghia */
    int *ptr_b = &amp;arr[3];
    int *pnull = NULL;
    int *p;

    printf("a&lt;b:%d a&gt;b:%d a&lt;=b:%d a&gt;=b:%d a==b:%d a!=b:%d\\n",
           ptr_a &lt; ptr_b, ptr_a &gt; ptr_b, ptr_a &lt;= ptr_b,
           ptr_a &gt;= ptr_b, ptr_a == ptr_b, ptr_a != ptr_b);
    printf("ptr_b - ptr_a = %ld phan tu\\n", (long)(ptr_b - ptr_a));

    ptr_b = ptr_a;
    printf("sau ptr_b = ptr_a  -&gt;  a==b: %d\\n", ptr_a == ptr_b);
    printf("pnull == NULL: %d\\n", pnull == NULL);

    /* cach dung hop le va thuong ngay cua phep &lt; tren con tro */
    for (p = arr; p &lt; arr + 5; p++) printf("%d ", *p);
    printf("\\n");
    return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch bằng <code>cc -Wall</code> và chạy: <code>a&lt;b:1 a&gt;b:0 a&lt;=b:1 a&gt;=b:0 a==b:0 a!=b:1</code> — arr[1] đúng là được lưu trước arr[3], khớp với dòng 1–6 của bảng trên slide. Rồi <code>ptr_b - ptr_a = 2 phan tu</code> (là 2, không phải 8 — hiệu đếm theo <em>phần tử</em>), <code>sau ptr_b = ptr_a -&gt; a==b: 1</code>, <code>pnull == NULL: 1</code>, và vòng lặp in ra <code>10 20 30 40 50</code>.</p>
<p class="pitfall">⚠️ <code>ptr_a == ptr_b</code> và <code>*ptr_a == *ptr_b</code> là hai câu hỏi khác nhau và đề thi sẽ hỏi cả hai. Hãy đọc thành lời: "cùng một cái hộp" so với "cùng một nội dung". Hai cái hộp khác nhau vẫn có thể đựng cùng một nội dung.</p>`],

      [18, 'Pointer Arithmetic Operators: Example',
        `<p class="y-chinh">🎯 The proof, in numbers, that <code>p + 1</code> does not add 1. Three pointers to three different types, printed with +0, +1 and +2 — and the three columns advance by <strong>1, 4 and 8</strong> respectively.</p>
<ul>
<li><strong>The program</strong> — <code>char c = 'a'; int n = 1; double d = 0.5;</code> then <code>char *pc = &amp;c; int *pn = &amp;n; double *pd = &amp;d;</code>, then three <code>printf</code> lines showing <code>pc, pn, pd</code> with +0, +1, +2.</li>
<li><strong>The slide's own output, read as a table</strong> — <code>pc</code>: 6487559 → 6487560 → 6487561 (steps of <strong>1</strong>). <code>pn</code>: 6487552 → 6487556 → 6487560 (steps of <strong>4</strong>). <code>pd</code>: 6487544 → 6487552 → 6487560 (steps of <strong>8</strong>).</li>
<li><strong>The steps are exactly <code>sizeof</code> the base type</strong> — 1 for char, 4 for int, 8 for double. Slide 19 states the formula: <em>Pointer + i → Pointer + (i * sizeof(baseType))</em>.</li>
<li><strong>The detail worth noticing in the numbers</strong> — <code>pn + 2</code> lands on 6487560, and so does <code>pd + 2</code>… no, <code>pd + 2</code> is 6487560 as well. Two different pointers can compute the same address; that address belongs to neither variable, and reading through it would be meaningless. Slide 19 spells the danger out: <em>"If access data using pI (bytes) can cause harm to the variable"</em>.</li>
<li><strong>Nothing is dereferenced here on purpose</strong> — the program only <em>prints</em> pc+1, pn+1 and so on. Computing an address one past the end is harmless; <em>reading</em> through it is not. That distinction is the whole safety rule of pointer arithmetic.</li>
<li><strong>⚠ The slide prints pointers with <code>%d</code></strong>. That worked in the 32-bit Dev-C++ of the course but is wrong in standard C and truncates on a 64-bit machine. Use <code>%p</code> and cast to <code>(void*)</code>.</li>
</ul>
<table>
<tr><th>Pointer</th><th>Base type</th><th><code>sizeof</code></th><th>+0 (slide)</th><th>+1 (slide)</th><th>+2 (slide)</th><th>Step</th></tr>
<tr><td><code>pc</code></td><td><code>char</code></td><td>1</td><td>6487559</td><td>6487560</td><td>6487561</td><td><strong>+1 byte</strong></td></tr>
<tr><td><code>pn</code></td><td><code>int</code></td><td>4</td><td>6487552</td><td>6487556</td><td>6487560</td><td><strong>+4 bytes</strong></td></tr>
<tr><td><code>pd</code></td><td><code>double</code></td><td>8</td><td>6487544</td><td>6487552</td><td>6487560</td><td><strong>+8 bytes</strong></td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    char    c = 'a';
    int     n = 1;
    double  d = 0.5;
    char   *pc = &amp;c;
    int    *pn = &amp;n;
    double *pd = &amp;d;

    printf("\\npc, pn, pd with +0: %p, %p, %p",
           (void*)pc, (void*)pn, (void*)pd);
    printf("\\npc, pn, pd with +1: %p, %p, %p",
           (void*)(pc+1), (void*)(pn+1), (void*)(pd+1));
    printf("\\npc, pn, pd with +2: %p, %p, %p\\n",
           (void*)(pc+2), (void*)(pn+2), (void*)(pd+2));

    printf("steps: char %ld, int %ld, double %ld\\n",
           (long)((char*)(pc+1) - (char*)pc),
           (long)((char*)(pn+1) - (char*)pn),
           (long)((char*)(pd+1) - (char*)pd));
    return 0;
}</code></pre>
<p class="dap-an">✅ Compiled with <code>cc -Wall</code> and run: the addresses are different from the slide's (another machine, another run) but the <strong>steps are identical</strong> — the last line prints <code>steps: char 1, int 4, double 8</code>, and the three printed rows advance by exactly those amounts. So the slide's 6487559/6487552/6487544 table is reproducible in <em>behaviour</em>, which is the examinable part.</p>
<p class="meo">💡 Exam shortcut for "what is <code>p + 5</code> if <code>p = 1000</code>?" — multiply 5 by <code>sizeof(base type)</code> and add. <code>long *p</code> (4 bytes in this course's convention, see slide 21): 1000 + 5·4 = 1020. <code>char *p</code>: 1000 + 5·1 = 1005. That one multiplication is the whole answer.</p>`,
        `<p class="y-chinh">🎯 Bằng chứng, bằng con số, rằng <code>p + 1</code> không hề cộng thêm 1. Ba con trỏ vào ba kiểu khác nhau, in ra với +0, +1 và +2 — và ba cột nhích lên lần lượt <strong>1, 4 và 8</strong>.</p>
<ul>
<li><strong>Chương trình</strong> — <code>char c = 'a'; int n = 1; double d = 0.5;</code> rồi <code>char *pc = &amp;c; int *pn = &amp;n; double *pd = &amp;d;</code>, rồi ba câu <code>printf</code> in <code>pc, pn, pd</code> với +0, +1, +2.</li>
<li><strong>Kết quả của chính slide, đọc thành bảng</strong> — <code>pc</code>: 6487559 → 6487560 → 6487561 (bước nhảy <strong>1</strong>). <code>pn</code>: 6487552 → 6487556 → 6487560 (bước nhảy <strong>4</strong>). <code>pd</code>: 6487544 → 6487552 → 6487560 (bước nhảy <strong>8</strong>).</li>
<li><strong>Bước nhảy đúng bằng <code>sizeof</code> của kiểu cơ sở</strong> — 1 với char, 4 với int, 8 với double. Slide 19 viết hẳn công thức: <em>Pointer + i → Pointer + (i * sizeof(baseType))</em>.</li>
<li><strong>Chi tiết đáng để ý trong dãy số</strong> — <code>pn + 2</code> rơi vào 6487560, và <code>pd + 2</code> cũng rơi đúng 6487560. Hai con trỏ khác nhau tính ra cùng một địa chỉ; địa chỉ đó không thuộc về biến nào cả, đọc qua nó là vô nghĩa. Slide 19 nói thẳng mối nguy: <em>"Nếu truy cập dữ liệu bằng pI (theo byte) thì có thể phá hỏng biến"</em>.</li>
<li><strong>Ở đây cố ý không giải tham chiếu cái nào</strong> — chương trình chỉ <em>in ra</em> pc+1, pn+1 v.v. Tính ra một địa chỉ vượt quá phần tử cuối là vô hại; <em>đọc</em> qua nó thì không. Phân biệt đó chính là toàn bộ luật an toàn của số học con trỏ.</li>
<li><strong>⚠ Slide in con trỏ bằng <code>%d</code></strong>. Chuyện đó chạy được trên Dev-C++ 32-bit của giáo trình nhưng sai theo chuẩn C và bị cắt cụt trên máy 64-bit. Hãy dùng <code>%p</code> và ép sang <code>(void*)</code>.</li>
</ul>
<table>
<tr><th>Con trỏ</th><th>Kiểu cơ sở</th><th><code>sizeof</code></th><th>+0 (theo slide)</th><th>+1 (theo slide)</th><th>+2 (theo slide)</th><th>Bước nhảy</th></tr>
<tr><td><code>pc</code></td><td><code>char</code></td><td>1</td><td>6487559</td><td>6487560</td><td>6487561</td><td><strong>+1 byte</strong></td></tr>
<tr><td><code>pn</code></td><td><code>int</code></td><td>4</td><td>6487552</td><td>6487556</td><td>6487560</td><td><strong>+4 byte</strong></td></tr>
<tr><td><code>pd</code></td><td><code>double</code></td><td>8</td><td>6487544</td><td>6487552</td><td>6487560</td><td><strong>+8 byte</strong></td></tr>
</table>
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    char    c = 'a';
    int     n = 1;
    double  d = 0.5;
    char   *pc = &amp;c;
    int    *pn = &amp;n;
    double *pd = &amp;d;

    printf("\\npc, pn, pd with +0: %p, %p, %p",
           (void*)pc, (void*)pn, (void*)pd);
    printf("\\npc, pn, pd with +1: %p, %p, %p",
           (void*)(pc+1), (void*)(pn+1), (void*)(pd+1));
    printf("\\npc, pn, pd with +2: %p, %p, %p\\n",
           (void*)(pc+2), (void*)(pn+2), (void*)(pd+2));

    printf("buoc nhay: char %ld, int %ld, double %ld\\n",
           (long)((char*)(pc+1) - (char*)pc),
           (long)((char*)(pn+1) - (char*)pn),
           (long)((char*)(pd+1) - (char*)pd));
    return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch bằng <code>cc -Wall</code> và chạy: các địa chỉ khác với trên slide (máy khác, lần chạy khác) nhưng <strong>bước nhảy thì y hệt</strong> — dòng cuối in ra <code>buoc nhay: char 1, int 4, double 8</code>, và ba dòng địa chỉ nhích lên đúng bằng từng ấy. Vậy bảng 6487559/6487552/6487544 của slide tái lập được về mặt <em>hành vi</em>, và hành vi mới là phần đem ra thi.</p>
<p class="meo">💡 Mẹo làm nhanh dạng "cho <code>p = 1000</code>, hỏi <code>p + 5</code> bằng bao nhiêu?" — nhân 5 với <code>sizeof</code> kiểu cơ sở rồi cộng vào. Với <code>long *p</code> (4 byte theo quy ước của giáo trình này, xem slide 21): 1000 + 5·4 = 1020. Với <code>char *p</code>: 1000 + 5·1 = 1005. Đúng một phép nhân là xong cả câu.</p>`],
    ]),
  ].join('\n'),
};
