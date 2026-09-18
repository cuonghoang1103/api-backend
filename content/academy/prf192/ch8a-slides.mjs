/**
 * PRF192 · Slot 13-15 — Contiguous Storage, học theo từng slide: PHẦN 1 (slide 1–24).
 * Deck 'prf7' (PRF7), 70 slide, ảnh đã render sẵn lên CDN images/academy/PRF192/v1/prf7/NNN.webp.
 *
 * Nội dung bám ĐÚNG chữ trích từ Slot_13_14_15_ContiguousStorage.pptx của trường
 * (/tmp/prf192-text/prf7.txt, slide 1→24). Nhiều slide đặt MÃ NGUỒN và KHUNG CONSOLE
 * TRONG ẢNH (6, 7, 8, 9, 10, 11, 15, 16, 18, 19, 20, 21, 23, 24) nên các ảnh đó đã
 * được đọc trực tiếp để lấy đúng từng dòng code và từng dòng kết quả.
 *
 * MỌI chương trình và con số dưới đây đã được biên dịch thật bằng `cc -Wall` và chạy:
 *   · slide 7/9  int a1[5]          → sizeof(a1) = 20 byte; 5 địa chỉ đo thật cách nhau ĐÚNG 4 byte
 *                                     (0x16f8523b0 · b4 · b8 · bc · c0) → bảng trong bài là số ĐO ĐƯỢC
 *   · slide 8/9  calloc(10,double)  → khối heap 80 byte, a2 = 0x1005e1e50, &a2 nằm ở stack 0x16f8523a0
 *   · slide 11   int a[]={2,4,6,-2} → sizeof = 16 ⇒ 4 phần tử; a+i ≡ &a[i] trùng khít từng địa chỉ
 *                int b[5]={2,4}     → 2 4 0 0 0 ✓ đúng như khung nâu trên slide
 *                malloc 5 int       → lần chạy này ra "0 0 0 0 0" nhưng KHÔNG bảo đảm (calloc mới bảo đảm)
 *   · slide 12   duyệt xuôi/ngược   → "3 5 8 1 2 0" / "0 2 1 8 5 3" · tổng 19
 *   · slide 13   suy biến con trỏ   → trong main sizeof(a)=20 (n=5), TRONG HÀM sizeof(a)=8 (n=2 — SAI)
 *                                     f(a,5) sửa được a[0] → 999, byValue(x) KHÔNG sửa được x
 *   · slide 15-16 Demo 1, nhập 6 / "3 5 8 1 2 0" → Max 8 · mảng 3 5 8 1 2 0 · chẵn 8 2 0 ✓ khớp ảnh console
 *   · slide 18-21 Solution, nhập 6 / "3 5 8 1 2 0" / 10 / "12 9 7 6"
 *                              → Updated array: 3 5 8 1 2 0 12 9 7 6 ✓ khớp ĐÚNG ảnh slide 21
 *   · slide 22-24 Exercise 1, nhập "2 3 1 8 9 5 0" → Max value:9 · mảng 2 3 1 8 9 5 · chẵn 2 8
 *                              ✓ khớp ĐÚNG khung console nhỏ trên slide 23
 *                Chạy thêm ca "nhập 0 ngay" → n=0 rồi max() đọc a[0] chưa khởi tạo: lỗi của mã trên slide,
 *                đã nêu rõ trong phần Đáp án, KHÔNG im lặng chép lại và KHÔNG tự sửa slide.
 *   · ra ngoài biên: p[5] = 777 trên `int a[5]` biên dịch không cảnh báo, chạy exit 0, guard không đổi
 *                    → C không kiểm biên, hỏng ở chỗ khác chứ không báo lỗi tại chỗ
 *   · VLA: `int n=5; int a[n];` với -std=c89 -pedantic → warning "variable length arrays are a C99 feature"
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'prf7';

export default {
  title: '8.0a — Slide by slide: One-dimensional arrays and arrays as function parameters (slides 1–24)|||8.0a — Slide bài giảng: Mảng một chiều & mảng làm tham số hàm (slide 1–24)',
  slug: 'prf192-8-0a-slides-mang-mot-chieu',
  type: 'DOCUMENT',
  description: 'Một phần ba đầu của Slot 13-15: vì sao dữ liệu cùng loại được xếp liền kề trong bộ nhớ, mảng một chiều khai báo tĩnh và động thế nào, khởi tạo — truy cập — duyệt ra sao, rồi câu hỏi lớn nhất của chương: chuyện gì xảy ra khi bạn truyền một mảng vào hàm. Toàn bộ Demo 1, Solution (mảng động + realloc) và Exercise 1 của trường đều được biên dịch bằng cc -Wall, chạy thật với đúng dữ liệu vào trên ảnh console của slide, và đối chiếu từng con số; bảng địa chỉ trong bài là địa chỉ ĐO ĐƯỢC chứ không phải bịa ra.',
  content: [
    walkHead(D, 1, 24),
    walk(D, [

      [1, 'Contiguous Storage',
        `<p class="y-chinh">🎯 The title slide of Slot 13-15. One English word carries the whole three-slot block: <strong>contiguous</strong> — "touching, sharing a border, with no gap". Everything in this chapter follows from that single property of memory.</p>
<ul>
<li><strong>What "contiguous storage" means</strong> — a set of values that belong together is placed in <em>one unbroken block</em> of memory, element after element, with nothing in between. Not scattered, not linked by addresses: physically side by side.</li>
<li><strong>Why C chose this</strong> — if element 0 sits at address <code>A</code> and every element is <code>s</code> bytes, then element <code>i</code> is at <code>A + i*s</code>. One multiplication and one addition, no searching. That is the entire reason array access is instant.</li>
<li><strong>What you already own</strong> — Slot 10 gave you pointers and pointer arithmetic, where <code>p + i</code> already moved by <code>i * sizeof(baseType)</code>. This chapter is that formula applied to a block you asked the compiler to reserve.</li>
<li><strong>Scope of the three slots</strong> — 1-D arrays (this lesson), searching and sorting on them, 2-D arrays, and finally <code>struct</code>: the case where the neighbouring cells are <em>not</em> the same size.</li>
<li><strong>Where it leads</strong> — strings in Slot 16-18 are nothing but <code>char</code> arrays, and file buffers in Slot 19-20 are nothing but byte arrays. Almost every remaining topic in PRF192 stands on this slide.</li>
</ul>
<p class="meo">💡 Keep one sentence in your head for the whole chapter: <em>an array is a promise from the compiler that the elements are neighbours.</em> Every technique below — indexing, traversal, passing to a function, <code>realloc</code> — is a consequence of that promise, and every bug in this chapter comes from stepping outside the block where the promise stops.</p>`,
        `<p class="y-chinh">🎯 Slide mở đầu của Slot 13-15. Một từ tiếng Anh gánh cả ba buổi: <strong>contiguous</strong> — "kề nhau, chạm nhau, không có khe hở". Mọi thứ trong chương này đều suy ra từ đúng một tính chất ấy của bộ nhớ.</p>
<ul>
<li><strong>"Lưu trữ liền kề" nghĩa là gì</strong> — một nhóm giá trị thuộc về nhau được đặt trong <em>một khối liền mạch</em>, phần tử này sát phần tử kia, ở giữa không có gì. Không rải rác, không nối nhau bằng địa chỉ: nằm sát nhau thật sự.</li>
<li><strong>Vì sao C chọn cách này</strong> — nếu phần tử 0 ở địa chỉ <code>A</code> và mỗi phần tử chiếm <code>s</code> byte, thì phần tử <code>i</code> nằm ở <code>A + i*s</code>. Một phép nhân, một phép cộng, không phải đi tìm. Đó là toàn bộ lý do truy cập mảng nhanh tức thì.</li>
<li><strong>Cái bạn đã có sẵn</strong> — Slot 10 đã cho bạn con trỏ và số học con trỏ, nơi <code>p + i</code> đã dịch đúng <code>i * sizeof(kiểu cơ sở)</code>. Chương này chính là công thức ấy áp lên một khối mà bạn yêu cầu trình biên dịch giữ chỗ.</li>
<li><strong>Phạm vi ba buổi</strong> — mảng 1 chiều (bài này), tìm kiếm và sắp xếp trên mảng, mảng 2 chiều, và cuối cùng là <code>struct</code>: trường hợp các ô kề nhau <em>không</em> cùng kích thước.</li>
<li><strong>Nó dẫn tới đâu</strong> — chuỗi ký tự ở Slot 16-18 chẳng qua là mảng <code>char</code>, còn vùng đệm tệp ở Slot 19-20 chẳng qua là mảng byte. Gần như mọi chủ đề còn lại của PRF192 đều đứng trên slide này.</li>
</ul>
<p class="meo">💡 Giữ một câu trong đầu suốt cả chương: <em>mảng là lời hứa của trình biên dịch rằng các phần tử nằm kề nhau.</em> Mọi kỹ thuật bên dưới — đánh chỉ số, duyệt, truyền vào hàm, <code>realloc</code> — đều là hệ quả của lời hứa ấy, và mọi lỗi trong chương này đều sinh ra khi bạn bước ra ngoài khối, chỗ lời hứa hết hiệu lực.</p>`],

      [2, 'Objectives',
        `<p class="y-chinh">🎯 The objective is written as a question, not a list: <em>"How do you manage group data efficiently?"</em> — and under it the five operations you will be able to perform on a group: <strong>Store · Input · Output · Search · Sort</strong>.</p>
<ul>
<li><strong>Why it is phrased as a question</strong> — up to Slot 12 every program used <em>separate named variables</em>. To hold 6 marks you wrote <code>m1, m2, m3, m4, m5, m6</code>. That works until the number is 100, or until the number is decided while the program runs. This chapter is the answer to "and then what?".</li>
<li><strong>Store</strong> — one name for the whole group, and the group lives in one contiguous block (slides 4-9).</li>
<li><strong>Input / Output</strong> — a single <code>for</code> loop reads or prints all <code>n</code> elements, no matter how big <code>n</code> is (slide 12, and the Demo on slides 14-16).</li>
<li><strong>Search</strong> — linear search and binary search, slides 25-29 (the second lesson of this deck).</li>
<li><strong>Sort</strong> — selection, insertion, bubble sort, later in the deck.</li>
<li><strong>The word "efficiently"</strong> — is doing real work here. Six separate variables cannot be looped over; a group of six in a block can. The efficiency is not about speed of one access, it is about being able to write <em>one</em> line of code that handles any <code>n</code>.</li>
</ul>
<p class="meo">💡 Read the five verbs as a checklist for your own practice: after this lesson you should be able to write <code>input</code>, <code>print</code> and <code>max</code> over an array from memory, without looking. Those three are precisely the functions the school's Demo asks for on slide 14, and they reappear in almost every PRF192 exam question.</p>`,
        `<p class="y-chinh">🎯 Mục tiêu được viết thành một câu hỏi chứ không phải danh sách: <em>"Quản lý dữ liệu theo nhóm sao cho hiệu quả?"</em> — và bên dưới là năm thao tác bạn sẽ làm được với một nhóm: <strong>Store · Input · Output · Search · Sort</strong> (lưu · nhập · xuất · tìm · sắp xếp).</p>
<ul>
<li><strong>Vì sao lại đặt thành câu hỏi</strong> — tới hết Slot 12, mọi chương trình đều dùng <em>các biến rời có tên riêng</em>. Muốn giữ 6 điểm thi thì bạn viết <code>m1, m2, m3, m4, m5, m6</code>. Cách đó ổn cho tới khi con số là 100, hoặc tới khi con số chỉ được quyết định lúc chương trình đang chạy. Chương này là câu trả lời cho "rồi sao nữa?".</li>
<li><strong>Store (lưu)</strong> — một cái tên duy nhất cho cả nhóm, và cả nhóm nằm trong một khối liền kề (slide 4-9).</li>
<li><strong>Input / Output (nhập / xuất)</strong> — một vòng <code>for</code> duy nhất đọc hoặc in hết <code>n</code> phần tử, bất kể <code>n</code> lớn tới đâu (slide 12, và phần Demo ở slide 14-16).</li>
<li><strong>Search (tìm kiếm)</strong> — tìm tuyến tính và tìm nhị phân, slide 25-29 (bài thứ hai của bộ slide này).</li>
<li><strong>Sort (sắp xếp)</strong> — chọn trực tiếp, chèn, nổi bọt, ở phần sau của bộ slide.</li>
<li><strong>Chữ "efficiently" (hiệu quả)</strong> — đang gánh việc thật. Sáu biến rời thì không lặp qua được; một nhóm sáu phần tử trong một khối thì lặp được. Cái hiệu quả ở đây không phải là tốc độ của một lần truy cập, mà là viết được <em>một</em> dòng mã xử lý được mọi <code>n</code>.</li>
</ul>
<p class="meo">💡 Hãy đọc năm động từ ấy như một danh sách tự kiểm: học xong bài này, bạn phải viết được <code>input</code>, <code>print</code> và <code>max</code> trên mảng theo trí nhớ, không cần nhìn tài liệu. Đó đúng là ba hàm mà bài Demo của trường yêu cầu ở slide 14, và chúng trở đi trở lại trong gần như mọi đề thi PRF192.</p>`],

      [3, 'Contents',
        `<p class="y-chinh">🎯 The map of the three slots. Read the indentation carefully: everything from <em>Declaration</em> down to <em>Sorting</em> is <strong>inside</strong> "One-dimensional Arrays" — that is how large this one topic is compared with 2-D arrays and structures.</p>
<ul>
<li><strong>Introduction to contiguous storage</strong> — slide 4, the idea of a block.</li>
<li><strong>Arrays</strong> — slide 5, the definition and the vocabulary (element, index, dimension).</li>
<li><strong>One-dimensional Arrays</strong> — slides 6-24, the subject of THIS lesson, broken into six sub-steps: <em>Declaration</em> (7-8) · <em>Memory Allocation</em> (9) · <em>Initialization</em> (10-11) · <em>Accessing elements</em> (10-11) · <em>Traversing</em> (12) · <em>1-D Arrays are parameters of functions</em> (13-24).</li>
<li><strong>Searching · Sorting</strong> — still under 1-D arrays, slides 25 onwards, the next lesson.</li>
<li><strong>2-D Arrays</strong> and <strong>User-defined Data Type: Structure</strong> — the last two blocks of the deck.</li>
<li><strong>Where the exam weight sits</strong> — the six sub-steps of 1-D arrays are the part every PE and PT question is built from. "Arrays as parameters of functions" alone occupies twelve slides (13-24) because it is the step where the most students lose marks.</li>
</ul>
<p class="meo">💡 Use this slide as a self-check after the lesson: cover the screen and try to say, for each of the six sub-steps, one line of C that performs it. If you can produce <code>int a[5];</code> · <code>5*sizeof(int)</code> · <code>int a[]={1,2,3};</code> · <code>a[i]</code> · <code>for(i=0;i&lt;n;i++)</code> · <code>void input(int *a, int n)</code>, you have the whole lesson.</p>`,
        `<p class="y-chinh">🎯 Bản đồ của ba buổi học. Hãy đọc kỹ mức thụt đầu dòng: mọi thứ từ <em>Declaration</em> xuống tới <em>Sorting</em> đều nằm <strong>bên trong</strong> mục "One-dimensional Arrays" — đó là cách để thấy chủ đề này lớn tới mức nào so với mảng 2 chiều và cấu trúc.</p>
<ul>
<li><strong>Introduction to contiguous storage</strong> — slide 4, ý tưởng về một khối nhớ.</li>
<li><strong>Arrays</strong> — slide 5, định nghĩa và bộ từ vựng (phần tử, chỉ số, chiều).</li>
<li><strong>One-dimensional Arrays</strong> — slide 6-24, chính là nội dung BÀI NÀY, chia thành sáu bước con: <em>Khai báo</em> (7-8) · <em>Cấp phát bộ nhớ</em> (9) · <em>Khởi tạo</em> (10-11) · <em>Truy cập phần tử</em> (10-11) · <em>Duyệt mảng</em> (12) · <em>Mảng 1 chiều làm tham số hàm</em> (13-24).</li>
<li><strong>Searching · Sorting</strong> — vẫn nằm trong mục mảng 1 chiều, từ slide 25 trở đi, là bài kế tiếp.</li>
<li><strong>2-D Arrays</strong> và <strong>User-defined Data Type: Structure</strong> — hai khối cuối của bộ slide.</li>
<li><strong>Trọng số đề thi nằm ở đâu</strong> — sáu bước con của mảng 1 chiều là phần mà mọi câu PE và PT đều dựng lên từ đó. Riêng "mảng làm tham số hàm" chiếm mười hai slide (13-24), vì đó là bước sinh viên mất điểm nhiều nhất.</li>
</ul>
<p class="meo">💡 Dùng slide này làm phiếu tự kiểm sau khi học: che màn hình lại và thử nói, với mỗi bước trong sáu bước con, MỘT dòng C thực hiện nó. Nếu bạn bật ra được <code>int a[5];</code> · <code>5*sizeof(int)</code> · <code>int a[]={1,2,3};</code> · <code>a[i]</code> · <code>for(i=0;i&lt;n;i++)</code> · <code>void input(int *a, int n)</code>, là bạn đã nắm trọn bài.</p>`],

      [4, '1 - Contiguous Storage',
        `<p class="y-chinh">🎯 The slide gives the concrete arithmetic that defines the whole chapter: <em>"Group of 10 int numbers → a <strong>40 bytes</strong> block is needed."</em> Ten elements, four bytes each, one unbroken block of forty.</p>
<ul>
<li><strong>"A set of the same meaning elements"</strong> — the criterion for grouping is not the type, it is the <em>meaning</em>: ten marks of one student, twelve monthly rainfalls, a hundred product prices. Values that you will always want to process the same way.</li>
<li><strong>"They are stored in a contiguous block of memory"</strong> — that is the physical commitment. Not "somewhere in memory"; in <em>one</em> block, in order, no gaps.</li>
<li><strong>Two shapes of group</strong> — the slide splits them. If every item is the <strong>same</strong> type, the block is cut into equal parts → that is an <strong>array</strong>. If the items are of <strong>different</strong> types (a name, an age, a mark), the block is cut into parts of different sizes, one per item → that is a <strong>structure</strong>, the last topic of this deck.</li>
<li><strong>"Data structure: A structure of data stored"</strong> — this is the slide where the term enters the course. A data structure is a decision about <em>how the bytes are laid out</em>, and the array is the simplest such decision there is.</li>
<li><strong>The five operations</strong> — <em>Add, Search, Remove, Update, Sort</em>. Notice what is easy and what is hard in a contiguous block: <em>Search</em> by index is instant, but <em>Add</em> and <em>Remove</em> in the middle require shifting everything after it, because the block may not have holes.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    int a[10];                          /* nhom 10 so nguyen */
    printf("sizeof(int)  = %zu byte\\n", sizeof(int));
    printf("sizeof(a)    = %zu byte\\n", sizeof(a));      /* 10 * 4 = 40 */
    printf("so phan tu   = %zu\\n", sizeof(a) / sizeof(a[0]));
    return 0;
}</code></pre>
<p class="dap-an">✅ Compiled with <code>cc -Wall</code> and run: <code>sizeof(int) = 4</code>, <code>sizeof(a) = 40</code>, number of elements <code>= 10</code>. The slide's "40 bytes block" is confirmed, and the formula <code>sizeof(a)/sizeof(a[0])</code> recovers the count 10 — remember this line, because slide 13 will show you exactly where it stops working.</p>`,
        `<p class="y-chinh">🎯 Slide đưa ra phép tính cụ thể định nghĩa cả chương: <em>"Nhóm 10 số int → cần một khối <strong>40 byte</strong>."</em> Mười phần tử, mỗi phần tử bốn byte, một khối liền mạch bốn mươi byte.</p>
<ul>
<li><strong>"Một tập các phần tử cùng ý nghĩa"</strong> — tiêu chí gom nhóm không phải là kiểu dữ liệu, mà là <em>ý nghĩa</em>: mười điểm của một sinh viên, mười hai lượng mưa theo tháng, một trăm giá sản phẩm. Những giá trị mà bạn luôn muốn xử lý theo cùng một cách.</li>
<li><strong>"Chúng được lưu trong một khối bộ nhớ liền kề"</strong> — đó là cam kết vật lý. Không phải "nằm đâu đó trong bộ nhớ"; mà trong <em>một</em> khối, đúng thứ tự, không có khe hở.</li>
<li><strong>Hai dạng nhóm</strong> — slide tách đôi. Nếu mọi mục <strong>cùng</strong> kiểu, khối được chia thành các phần bằng nhau → đó là <strong>mảng</strong>. Nếu các mục <strong>khác</strong> kiểu (một cái tên, một tuổi, một điểm số), khối được chia thành các phần có kích thước khác nhau, mỗi phần cho một mục → đó là <strong>cấu trúc (structure)</strong>, chủ đề cuối của bộ slide này.</li>
<li><strong>"Cấu trúc dữ liệu: cách dữ liệu được tổ chức khi lưu"</strong> — đây là slide mà thuật ngữ ấy bước vào môn học. Cấu trúc dữ liệu là một quyết định về <em>cách xếp các byte</em>, và mảng là quyết định đơn giản nhất có thể có.</li>
<li><strong>Năm thao tác</strong> — <em>Thêm, Tìm, Xoá, Sửa, Sắp xếp</em>. Hãy để ý cái gì dễ và cái gì khó trong một khối liền kề: <em>Tìm</em> theo chỉ số là tức thì, nhưng <em>Thêm</em> và <em>Xoá</em> ở giữa thì phải dồn toàn bộ phần phía sau, vì khối không được phép có lỗ hổng.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    int a[10];                          /* nhom 10 so nguyen */
    printf("sizeof(int)  = %zu byte\\n", sizeof(int));
    printf("sizeof(a)    = %zu byte\\n", sizeof(a));      /* 10 * 4 = 40 */
    printf("so phan tu   = %zu\\n", sizeof(a) / sizeof(a[0]));
    return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch bằng <code>cc -Wall</code> và chạy thật: <code>sizeof(int) = 4</code>, <code>sizeof(a) = 40</code>, số phần tử <code>= 10</code>. Con số "khối 40 byte" của slide được xác nhận, và công thức <code>sizeof(a)/sizeof(a[0])</code> lấy lại được số lượng 10 — hãy nhớ dòng này, vì slide 13 sẽ chỉ cho bạn đúng chỗ nó thôi không còn đúng nữa.</p>`],

      [5, '2 - Array',
        `<p class="y-chinh">🎯 The formal definition, and it is worth learning word for word: <em>"An array is a data structure consisting of an <strong>ordered set of elements of common type</strong> that are <strong>stored contiguously</strong> in memory. Each element is identified by its <strong>position (index)</strong>."</em></p>
<ul>
<li><strong>Four conditions, all required</strong> — ordered · same type · contiguous · addressed by index. Drop any one and it is no longer an array: a list of mixed types is a structure, a non-contiguous chain is a linked list (not in PRF192).</li>
<li><strong>The picture reads left to right</strong> — the row of values <code>5 4 8 15 90 27 34 21 152 80</code> is the array named <code>a</code>; the row of numbers <code>0 1 2 … 9</code> above it is the <strong>index</strong>, not data. The callout points at <code>a[3]</code>, which is the value <strong>15</strong> — the fourth box, because counting starts at zero.</li>
<li><strong>"a[i] is an integer"</strong> — the yellow note. <code>a</code> is the array, <code>a[i]</code> is one <code>int</code>. Keeping these two apart is the difference between a program that compiles and one that does not.</li>
<li><strong>Dimension</strong> — "the direction used to perform an action on the array". <strong>Number of dimensions</strong> = how many indexes it takes to name one element: one for <code>a[i]</code>, two for <code>m[1][3]</code> in the second picture. PRF192 uses only 1-D and 2-D.</li>
<li><strong>Name of an array</strong> — an array has its own name, and that name <em>is</em> the address of element 0. Slide 10 makes this explicit and it is the hinge of the whole "arrays as parameters" section.</li>
</ul>
<p class="pitfall">⚠️ The most expensive habit to break in this chapter: reading <code>a[3]</code> as "the third element". It is the element at <strong>index</strong> 3, which is the <strong>fourth</strong> box. On this very slide, the "third element" in ordinary speech is 8, while <code>a[3]</code> is 15. Say "a at index 3" out loud until the counting reflex is gone.</p>`,
        `<p class="y-chinh">🎯 Định nghĩa chính thức, và đáng học thuộc từng chữ: <em>"Mảng là một cấu trúc dữ liệu gồm một <strong>tập có thứ tự các phần tử cùng kiểu</strong> được <strong>lưu liền kề</strong> trong bộ nhớ. Mỗi phần tử được xác định bằng <strong>vị trí (chỉ số)</strong> của nó."</em></p>
<ul>
<li><strong>Bốn điều kiện, thiếu một là hỏng</strong> — có thứ tự · cùng kiểu · liền kề · định danh bằng chỉ số. Bỏ bất kỳ điều nào thì nó không còn là mảng: một danh sách trộn nhiều kiểu là structure, một chuỗi không liền kề là danh sách liên kết (không có trong PRF192).</li>
<li><strong>Hình vẽ đọc từ trái sang phải</strong> — hàng giá trị <code>5 4 8 15 90 27 34 21 152 80</code> là mảng tên <code>a</code>; hàng số <code>0 1 2 … 9</code> phía trên là <strong>chỉ số</strong>, không phải dữ liệu. Chú thích chỉ vào <code>a[3]</code>, tức giá trị <strong>15</strong> — ô thứ tư, vì đếm bắt đầu từ không.</li>
<li><strong>"a[i] là một số nguyên"</strong> — dòng ghi chú vàng. <code>a</code> là cả mảng, còn <code>a[i]</code> là MỘT số <code>int</code>. Giữ hai thứ này tách bạch chính là ranh giới giữa một chương trình biên dịch được và một chương trình không.</li>
<li><strong>Chiều (Dimension)</strong> — "hướng dùng để thực hiện thao tác trên mảng". <strong>Số chiều</strong> = cần bao nhiêu chỉ số để gọi tên một phần tử: một chỉ số cho <code>a[i]</code>, hai chỉ số cho <code>m[1][3]</code> trong hình thứ hai. PRF192 chỉ dùng 1 chiều và 2 chiều.</li>
<li><strong>Tên mảng</strong> — mảng có tên riêng, và cái tên ấy CHÍNH LÀ địa chỉ của phần tử 0. Slide 10 nói thẳng điều này, và đó là bản lề của cả phần "mảng làm tham số hàm".</li>
</ul>
<p class="pitfall">⚠️ Thói quen tốn kém nhất phải bỏ trong chương này: đọc <code>a[3]</code> thành "phần tử thứ ba". Nó là phần tử ở <strong>chỉ số</strong> 3, tức ô <strong>thứ tư</strong>. Ngay trên slide này, "phần tử thứ ba" theo cách nói thường là 8, còn <code>a[3]</code> là 15. Hãy đọc thành tiếng "a ở chỉ số 3" cho tới khi phản xạ đếm cũ biến mất.</p>`],

      [6, '3 - One-dimensional Arrays (1-D)',
        `<p class="y-chinh">🎯 The three underlined phrases on this slide are the three facts you will be tested on: <em>index numbering <strong>starts at 0</strong></em> · <em>and extends to <strong>one less than the number of elements</strong></em> · <em>each element has a <strong>unique index</strong> and holds a <strong>single value</strong></em>.</p>
<ul>
<li><strong>The range of legal indexes</strong> — for an array of <code>n</code> elements the indexes are <code>0, 1, …, n-1</code>. The last element is <code>a[n-1]</code>. There is no <code>a[n]</code>: writing it is a <em>different variable's</em> memory, or nobody's.</li>
<li><strong>Why C does not stop you</strong> — C performs <strong>no bounds checking</strong>. <code>a[i]</code> compiles to "address of a, plus i times 4, read 4 bytes". If <code>i</code> is 5 on a 5-element array, the arithmetic still works, it just lands outside the block. No error at compile time, usually no crash at run time, and the damage shows up somewhere else entirely.</li>
<li><strong>The notation</strong> — <code>identifier[index]</code>. The name picks the block, the bracket picks the box.</li>
<li><strong>The picture</strong> — same ten-box row as slide 5, with <code>a[3] = 15</code> marked. Copy this picture into your notes: whenever an exercise confuses you, redraw the boxes and write indexes underneath.</li>
<li><strong>Same type, single value</strong> — every box holds exactly one value of the declared type. An <code>int</code> array box cannot hold a <code>double</code>; C will silently convert and truncate rather than complain.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    int guard = 111;
    int a[5] = {1, 2, 3, 4, 5};
    int *p = a;
    printf("truoc:  guard = %d\\n", guard);
    printf("&amp;a[0]=%p  a+5 (NGOAI mang)=%p  &amp;guard=%p\\n",
           (void *)&amp;a[0], (void *)(a + 5), (void *)&amp;guard);
    p[5] = 777;                 /* ghi RA NGOAI mang */
    printf("sau:    guard = %d\\n", guard);
    return 0;
}</code></pre>
<p class="dap-an">✅ Measured with <code>cc -Wall</code>: the compiler produced <strong>no warning at all</strong> for <code>p[5] = 777</code> (it only warns when you index the array variable directly, e.g. <code>a[5]</code>), the program ran to completion and exited with status <strong>0</strong>. <code>&amp;a[0] = 0x16f44a3b0</code>, <code>a+5 = 0x16f44a3c4</code>, <code>&amp;guard = 0x16f44a3a8</code> — the stray write landed at an address that belonged to nothing in this run, so <code>guard</code> stayed 111. That is the worst possible outcome for a learner: <em>the bug produced no symptom.</em></p>
<p class="pitfall">⚠️ Do not conclude "so it is fine". Recompile with a different optimisation level, add one variable, or run the same code inside a bigger function, and that same <code>p[5] = 777</code> will land on something that matters. An out-of-bounds write is a bug whether or not today's run shows it.</p>`,
        `<p class="y-chinh">🎯 Ba cụm gạch chân trên slide này chính là ba điều bạn sẽ bị hỏi: <em>chỉ số <strong>bắt đầu từ 0</strong></em> · <em>và chạy tới <strong>nhỏ hơn số phần tử một đơn vị</strong></em> · <em>mỗi phần tử có <strong>chỉ số duy nhất</strong> và giữ <strong>một giá trị duy nhất</strong></em>.</p>
<ul>
<li><strong>Khoảng chỉ số hợp lệ</strong> — với mảng <code>n</code> phần tử, chỉ số là <code>0, 1, …, n-1</code>. Phần tử cuối là <code>a[n-1]</code>. Không có <code>a[n]</code>: viết nó là đang chạm vào bộ nhớ của <em>biến khác</em>, hoặc của không ai cả.</li>
<li><strong>Vì sao C không chặn bạn</strong> — C <strong>không kiểm tra biên</strong>. <code>a[i]</code> được dịch thành "địa chỉ của a, cộng i nhân 4, đọc 4 byte". Nếu <code>i</code> bằng 5 trên mảng 5 phần tử thì phép tính vẫn chạy ngon lành, chỉ có điều nó rơi ra ngoài khối. Không lỗi lúc biên dịch, thường cũng không sập lúc chạy, và thiệt hại hiện ra ở một chỗ hoàn toàn khác.</li>
<li><strong>Cách viết</strong> — <code>tên_mảng[chỉ_số]</code>. Cái tên chọn khối, cặp ngoặc vuông chọn ô.</li>
<li><strong>Hình vẽ</strong> — vẫn là hàng mười ô như slide 5, có đánh dấu <code>a[3] = 15</code>. Hãy chép hình này vào vở: mỗi khi một bài tập làm bạn rối, vẽ lại các ô và ghi chỉ số bên dưới.</li>
<li><strong>Cùng kiểu, một giá trị</strong> — mỗi ô giữ đúng một giá trị thuộc kiểu đã khai. Ô của mảng <code>int</code> không giữ được <code>double</code>; C sẽ âm thầm ép kiểu và cắt phần thập phân chứ không kêu ca.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    int guard = 111;
    int a[5] = {1, 2, 3, 4, 5};
    int *p = a;
    printf("truoc:  guard = %d\\n", guard);
    printf("&amp;a[0]=%p  a+5 (NGOAI mang)=%p  &amp;guard=%p\\n",
           (void *)&amp;a[0], (void *)(a + 5), (void *)&amp;guard);
    p[5] = 777;                 /* ghi RA NGOAI mang */
    printf("sau:    guard = %d\\n", guard);
    return 0;
}</code></pre>
<p class="dap-an">✅ Đo thật bằng <code>cc -Wall</code>: trình biên dịch <strong>không cảnh báo một câu nào</strong> cho <code>p[5] = 777</code> (nó chỉ cảnh báo khi bạn đánh chỉ số thẳng vào biến mảng, ví dụ <code>a[5]</code>), chương trình chạy tới hết và thoát với mã <strong>0</strong>. Đo được <code>&amp;a[0] = 0x16f44a3b0</code>, <code>a+5 = 0x16f44a3c4</code>, <code>&amp;guard = 0x16f44a3a8</code> — lệnh ghi lạc rơi vào một địa chỉ không thuộc về gì trong lần chạy này, nên <code>guard</code> vẫn là 111. Đó là kết cục tệ nhất với người học: <em>lỗi không để lại triệu chứng nào.</em></p>
<p class="pitfall">⚠️ Đừng vì thế mà kết luận "vậy là không sao". Biên dịch lại với mức tối ưu khác, thêm một biến, hoặc đặt đúng đoạn mã ấy vào một hàm lớn hơn, thì chính <code>p[5] = 777</code> sẽ rơi trúng một thứ có ý nghĩa. Ghi ra ngoài biên là lỗi, bất kể lần chạy hôm nay có lộ ra hay không.</p>`],

      [7, '1-D Array: Declaration',
        `<p class="y-chinh">🎯 The static declaration, in the box: <strong><code>DataType ArrayName[NumberOfElements];</code></strong> — and the accompanying rule, <em>"the array is stored in the <strong>stack segment</strong> → the compiler determines the array's storage at <strong>compile-time</strong>."</em></p>
<ul>
<li><strong>Read the three parts</strong> — <code>DataType</code> fixes the size of one box, <code>ArrayName</code> names the whole block, <code>[NumberOfElements]</code> says how many boxes. Examples on the slide: <code>int a1[5];</code> · <code>char s[12];</code> · <code>double a2[100];</code>.</li>
<li><strong>The size formula</strong> — <em>"How can compilers determine the memory size of an array?"</em> → <code>NumberOfElements * sizeof(dataType)</code>. For <code>int a1[5]</code>: <code>5 * 4 = <strong>20 bytes</strong></code>. Exam questions state this as "how many bytes does <code>double a2[100]</code> occupy?" — answer <code>100 * 8 = 800</code>.</li>
<li><strong>"At compile-time" is the whole point</strong> — the number in the brackets must be a <strong>constant</strong> the compiler can read while translating, because it must reserve that much stack space before the program ever runs. <code>int a[5];</code> and <code>#define MAXN 100 … int a[MAXN];</code> are fine; <code>int a[n];</code> with a variable <code>n</code> is not, in C89.</li>
<li><strong>The stack segment</strong> — from Slot 10: local variables live there and vanish when the function returns. So a static array is automatically cleaned up, and equally automatically <em>gone</em> the moment you leave the function. Never <code>return</code> a pointer to a local array.</li>
<li><strong>Declaration does not mean initialisation</strong> — <code>int a1[5];</code> reserves 20 bytes and puts <em>nothing</em> in them. Slide 11 comes back to this in a bright pink box.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#define MAXN 100

int main(void) {
    int    a1[5];
    char   s[12];
    double a2[MAXN];
    printf("int a1[5]     -&gt; %zu byte\\n", sizeof(a1));     /* 5  * 4 = 20  */
    printf("char s[12]    -&gt; %zu byte\\n", sizeof(s));      /* 12 * 1 = 12  */
    printf("double a2[100]-&gt; %zu byte\\n", sizeof(a2));     /* 100* 8 = 800 */
    return 0;
}</code></pre>
<p class="dap-an">✅ Compiled and run: <strong>20</strong>, <strong>12</strong> and <strong>800</strong> bytes — the slide's formula holds for all three examples.</p>
<p class="pitfall">⚠️ <code>int n = 5; int a[n];</code> is a <em>variable-length array</em>, a C99 feature. I compiled exactly that line with <code>cc -std=c89 -pedantic -Wall</code> and got <em>"warning: variable length arrays are a C99 feature [-Wvla-extension]"</em>; under <code>-std=c99</code> it compiled clean and ran. Dev-C++ with an old MinGW may refuse it outright. In PRF192 always size a static array with a literal or a <code>#define</code>, and use the dynamic array of slide 8 when the size is only known at run time.</p>`,
        `<p class="y-chinh">🎯 Khai báo tĩnh, nằm trong khung: <strong><code>DataType ArrayName[NumberOfElements];</code></strong> — kèm quy tắc đi cùng, <em>"mảng được lưu ở <strong>vùng stack</strong> → trình biên dịch quyết định chỗ chứa mảng ngay <strong>lúc biên dịch</strong>."</em></p>
<ul>
<li><strong>Đọc ba phần</strong> — <code>DataType</code> ấn định kích thước MỘT ô, <code>ArrayName</code> đặt tên cho cả khối, <code>[NumberOfElements]</code> nói có bao nhiêu ô. Ví dụ trên slide: <code>int a1[5];</code> · <code>char s[12];</code> · <code>double a2[100];</code>.</li>
<li><strong>Công thức kích thước</strong> — <em>"Trình biên dịch làm sao biết mảng chiếm bao nhiêu bộ nhớ?"</em> → <code>Số phần tử * sizeof(kiểu)</code>. Với <code>int a1[5]</code>: <code>5 * 4 = <strong>20 byte</strong></code>. Đề thi hỏi dạng "mảng <code>double a2[100]</code> chiếm bao nhiêu byte?" — đáp <code>100 * 8 = 800</code>.</li>
<li><strong>"Lúc biên dịch" mới là mấu chốt</strong> — con số trong ngoặc vuông phải là một <strong>hằng</strong> mà trình biên dịch đọc được khi đang dịch, vì nó phải giữ sẵn chừng ấy chỗ trên stack trước khi chương trình chạy. <code>int a[5];</code> và <code>#define MAXN 100 … int a[MAXN];</code> thì được; <code>int a[n];</code> với <code>n</code> là biến thì không, theo chuẩn C89.</li>
<li><strong>Vùng stack</strong> — nhắc lại từ Slot 10: biến cục bộ sống ở đó và biến mất khi hàm kết thúc. Nên mảng tĩnh được dọn tự động, và cũng tự động <em>mất</em> ngay khi bạn rời khỏi hàm. Đừng bao giờ <code>return</code> một con trỏ tới mảng cục bộ.</li>
<li><strong>Khai báo không phải là khởi tạo</strong> — <code>int a1[5];</code> giữ 20 byte và đặt vào đó… <em>không gì cả</em>. Slide 11 sẽ quay lại chuyện này bằng một khung màu hồng chói.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#define MAXN 100

int main(void) {
    int    a1[5];
    char   s[12];
    double a2[MAXN];
    printf("int a1[5]     -&gt; %zu byte\\n", sizeof(a1));     /* 5  * 4 = 20  */
    printf("char s[12]    -&gt; %zu byte\\n", sizeof(s));      /* 12 * 1 = 12  */
    printf("double a2[100]-&gt; %zu byte\\n", sizeof(a2));     /* 100* 8 = 800 */
    return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch và chạy: <strong>20</strong>, <strong>12</strong> và <strong>800</strong> byte — công thức của slide đúng cho cả ba ví dụ.</p>
<p class="pitfall">⚠️ <code>int n = 5; int a[n];</code> là <em>mảng độ dài thay đổi</em> (VLA), một tính năng của C99. Tôi đã biên dịch đúng dòng đó bằng <code>cc -std=c89 -pedantic -Wall</code> và nhận được <em>"warning: variable length arrays are a C99 feature [-Wvla-extension]"</em>; còn với <code>-std=c99</code> thì dịch sạch và chạy bình thường. Dev-C++ với MinGW cũ có thể từ chối thẳng. Trong PRF192, hãy luôn định kích thước mảng tĩnh bằng số nguyên trực tiếp hoặc <code>#define</code>, và dùng mảng động ở slide 8 khi kích thước chỉ biết lúc chạy.</p>`],

      [8, '1-D Array: Declaration (cont.)',
        `<p class="y-chinh">🎯 The second way to own a block: <em>"If the array is stored in the <strong>heap</strong> → use a <strong>pointer</strong> (DYNAMIC array) → the array's storage will be allocated in the heap <strong>at run-time</strong> through memory allocating functions (malloc, calloc, realloc)."</em></p>
<ul>
<li><strong>What changes and what does not</strong> — the declaration is now <code>int *arr;</code>, a pointer, not <code>int arr[5];</code>. But once <code>arr</code> points at a block, <code>arr[i]</code> works exactly as before. The <em>usage</em> is identical; only the <em>ownership</em> differs.</li>
<li><strong>The example on the slide</strong> — <code>int *arr = (int *)calloc(5, sizeof(int));</code> followed immediately by <code>if (arr == NULL) { printf("Memory allocation failed\\n"); }</code>. Two habits in two lines: always write <code>sizeof(int)</code> rather than the number 4, and always test the returned pointer.</li>
<li><strong>Why <code>calloc</code> and not <code>malloc</code> here</strong> — the comment on the slide says it: <em>"Allocates <strong>and initializes</strong> memory for 5 integers"</em>. <code>calloc(n, size)</code> zero-fills; <code>malloc(n*size)</code> does not. For an array you are about to fill with <code>scanf</code>, either is fine; for one you will accumulate into, <code>calloc</code> saves you a loop.</li>
<li><strong>Heap vs stack — the real reason to bother</strong> — the size may come from the user (<code>scanf("%d", &amp;n)</code> then <code>calloc(n, sizeof(int))</code>), the block survives after the function that created it returns, and it can be <strong>resized</strong> with <code>realloc</code>. Slides 17-20 are built entirely on these three advantages.</li>
<li><strong>The price</strong> — you must <code>free()</code> it yourself. The stack cleans up; the heap does not.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

int main(void) {
    int *arr = (int *)calloc(5, sizeof(int));   /* cap phat VA dat 0 */
    if (arr == NULL) { printf("Memory allocation failed\\n"); return 1; }

    printf("khoi heap: %zu byte tai %p\\n", 5 * sizeof(int), (void *)arr);
    for (int i = 0; i &lt; 5; i++)
        printf("arr[%d] = %d   &amp;arr[%d] = %p\\n", i, arr[i], i, (void *)&amp;arr[i]);

    int *m = (int *)malloc(5 * sizeof(int));    /* cap phat, KHONG dat 0 */
    printf("malloc: ");
    for (int i = 0; i &lt; 5; i++) printf("%d ", m[i]);
    printf("\\n");

    free(arr);
    free(m);
    return 0;
}</code></pre>
<p class="dap-an">✅ Measured: <code>calloc(5, sizeof(int))</code> returned a 20-byte block at <code>0x1030ade50</code> and every element read back <strong>0</strong>, with the five addresses <code>…e50 · e54 · e58 · e5c · e60</code> — four bytes apart, contiguous, exactly like a static array. The <code>malloc</code> block also happened to print <code>0 0 0 0 0</code> in this run, but <strong>that is luck, not a rule</strong>: only <code>calloc</code> promises zeros.</p>
<p class="pitfall">⚠️ The slide's example calls <code>system("pause")</code> and never calls <code>free(arr)</code>. Both are worth noticing: <code>system("pause")</code> is Windows-only, and a missing <code>free</code> is a memory leak. In a five-line demo the leak is harmless because the process exits, but the habit is not — Demo/Solution on slides 18-20 does call <code>free(a)</code>, and the exam expects you to as well.</p>`,
        `<p class="y-chinh">🎯 Cách thứ hai để sở hữu một khối nhớ: <em>"Nếu mảng nằm ở <strong>heap</strong> → dùng <strong>con trỏ</strong> (mảng ĐỘNG) → chỗ chứa mảng sẽ được cấp phát trong heap <strong>lúc chạy</strong> thông qua các hàm cấp phát (malloc, calloc, realloc)."</em></p>
<ul>
<li><strong>Cái gì đổi và cái gì không</strong> — khai báo bây giờ là <code>int *arr;</code>, một con trỏ, chứ không phải <code>int arr[5];</code>. Nhưng một khi <code>arr</code> đã trỏ vào khối, <code>arr[i]</code> dùng y hệt như cũ. <em>Cách dùng</em> giống hệt; chỉ <em>quyền sở hữu</em> là khác.</li>
<li><strong>Ví dụ trên slide</strong> — <code>int *arr = (int *)calloc(5, sizeof(int));</code> rồi ngay sau đó <code>if (arr == NULL) { printf("Memory allocation failed\\n"); }</code>. Hai thói quen gói trong hai dòng: luôn viết <code>sizeof(int)</code> thay vì con số 4, và luôn kiểm tra con trỏ trả về.</li>
<li><strong>Vì sao ở đây dùng <code>calloc</code> chứ không <code>malloc</code></strong> — chú thích trên slide nói rõ: <em>"Cấp phát VÀ khởi tạo bộ nhớ cho 5 số nguyên"</em>. <code>calloc(n, size)</code> đổ đầy số 0; <code>malloc(n*size)</code> thì không. Với mảng sắp được <code>scanf</code> đổ đầy thì dùng cái nào cũng được; với mảng sắp cộng dồn vào thì <code>calloc</code> tiết kiệm cho bạn một vòng lặp.</li>
<li><strong>Heap so với stack — lý do thật sự để đổi</strong> — kích thước có thể đến từ người dùng (<code>scanf("%d", &amp;n)</code> rồi <code>calloc(n, sizeof(int))</code>), khối sống sót cả sau khi hàm tạo ra nó kết thúc, và nó <strong>đổi được kích thước</strong> bằng <code>realloc</code>. Slide 17-20 dựng hoàn toàn trên ba lợi thế này.</li>
<li><strong>Cái giá phải trả</strong> — bạn phải tự <code>free()</code>. Stack tự dọn; heap thì không.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

int main(void) {
    int *arr = (int *)calloc(5, sizeof(int));   /* cap phat VA dat 0 */
    if (arr == NULL) { printf("Memory allocation failed\\n"); return 1; }

    printf("khoi heap: %zu byte tai %p\\n", 5 * sizeof(int), (void *)arr);
    for (int i = 0; i &lt; 5; i++)
        printf("arr[%d] = %d   &amp;arr[%d] = %p\\n", i, arr[i], i, (void *)&amp;arr[i]);

    int *m = (int *)malloc(5 * sizeof(int));    /* cap phat, KHONG dat 0 */
    printf("malloc: ");
    for (int i = 0; i &lt; 5; i++) printf("%d ", m[i]);
    printf("\\n");

    free(arr);
    free(m);
    return 0;
}</code></pre>
<p class="dap-an">✅ Đo thật: <code>calloc(5, sizeof(int))</code> trả về khối 20 byte ở <code>0x1030ade50</code> và mọi phần tử đọc ra đều là <strong>0</strong>, với năm địa chỉ <code>…e50 · e54 · e58 · e5c · e60</code> — cách nhau bốn byte, liền kề, y hệt một mảng tĩnh. Khối <code>malloc</code> lần chạy này cũng tình cờ in ra <code>0 0 0 0 0</code>, nhưng <strong>đó là may, không phải luật</strong>: chỉ <code>calloc</code> mới hứa cho số 0.</p>
<p class="pitfall">⚠️ Ví dụ trên slide gọi <code>system("pause")</code> và không hề gọi <code>free(arr)</code>. Cả hai đều đáng để ý: <code>system("pause")</code> chỉ chạy trên Windows, còn thiếu <code>free</code> là rò rỉ bộ nhớ. Trong một demo năm dòng thì rò rỉ vô hại vì tiến trình thoát ngay, nhưng thói quen thì không vô hại — bài Solution ở slide 18-20 CÓ gọi <code>free(a)</code>, và đề thi cũng chờ bạn làm vậy.</p>`],

      [9, '1-D Array: Example Memory Allocation',
        `<p class="y-chinh">🎯 The map of the whole process memory, with one program placed on it: a global <code>MAX</code> in the <strong>Data segment</strong>, the code of <code>main()</code> in the <strong>Code segment</strong>, the static array <code>a1[5]</code> and the pointer variable <code>a2</code> in the <strong>Stack</strong>, and the 80-byte block that <code>a2</code> points at in the <strong>Heap</strong>.</p>
<ul>
<li><strong>Read the four addresses the slide prints</strong> — <code>MAX address = 4206608</code> (data) · <code>main() address = 4199776</code> (code) · <code>a1 address = 6684160</code> (stack) · <code>a2 address = 6684152</code> (stack) · <code>value of a2 = 1929056</code> (heap). Note the crucial distinction on the last line: <code>&amp;a2</code> is where the <em>pointer</em> lives; <code>a2</code> is where the <em>array</em> lives.</li>
<li><strong>Two sizes, two places</strong> — the green box marks <strong>20 bytes</strong> on the stack (that is <code>int a1[5]</code>) and <strong>80 bytes</strong> in the heap (that is <code>calloc(10, sizeof(double))</code> = 10 × 8). Both are blocks; they just live in different neighbourhoods.</li>
<li><strong>The whole point of the diagram</strong> — a static array <em>is</em> the block, a dynamic array <em>points to</em> the block. For <code>a1</code> the name and the data are at the same address; for <code>a2</code> the name is at 6684152 and the data is at 1929056, far away.</li>
<li><strong>Contiguity is what the table below proves</strong> — I declared <code>int a1[5] = {5,4,8,15,90};</code> and printed <code>&amp;a1[i]</code> for every <code>i</code>. Each address is exactly <code>sizeof(int) = 4</code> bytes above the previous one, and <code>a1 + i</code> gives the same number as <code>&amp;a1[i]</code> in every row.</li>
</ul>
<table>
<tr><th>Index i</th><th>Address measured (&amp;a1[i])</th><th>a1 + i</th><th>Gap</th><th>Value</th></tr>
<tr><td>0</td><td>0x16f8523b0</td><td>0x16f8523b0</td><td>—</td><td>5</td></tr>
<tr><td>1</td><td>0x16f8523b4</td><td>0x16f8523b4</td><td>+4</td><td>4</td></tr>
<tr><td>2</td><td>0x16f8523b8</td><td>0x16f8523b8</td><td>+4</td><td>8</td></tr>
<tr><td>3</td><td>0x16f8523bc</td><td>0x16f8523bc</td><td>+4</td><td>15</td></tr>
<tr><td>4</td><td>0x16f8523c0</td><td>0x16f8523c0</td><td>+4</td><td>90</td></tr>
</table>
<p class="dap-an">✅ These are <strong>addresses measured on my machine</strong> with <code>cc -Wall</code>, not invented ones. <code>sizeof(a1) = 20</code>, the five boxes sit at four-byte intervals with nothing in between, and <code>&amp;a1[1] - &amp;a1[0] = 4</code> bytes exactly. In the same run <code>&amp;a2 = 0x16f8523a0</code> (stack, right next to the array) while <code>a2 = 0x1005e1e50</code> (heap, a completely different region) and the heap block was 10 × 8 = <strong>80 bytes</strong> — the same two numbers the slide shows, on a different machine.</p>
<p class="pitfall">⚠️ The slide prints addresses with <code>printf("%u", &amp;a1)</code>. That was valid in the 32-bit Dev-C++ world; on any modern 64-bit compiler <code>cc -Wall</code> rejects it (<em>format specifies 'unsigned int' but the argument has type 'int (*)[5]'</em>) and the printed number is a truncated fragment of the real address. Use <code>%p</code> with a <code>(void *)</code> cast. Your own addresses will not match the slide's or mine — the <em>gaps</em> are what must match.</p>`,
        `<p class="y-chinh">🎯 Bản đồ toàn bộ bộ nhớ của tiến trình, với một chương trình đặt lên đó: biến toàn cục <code>MAX</code> ở <strong>Data segment</strong>, mã của <code>main()</code> ở <strong>Code segment</strong>, mảng tĩnh <code>a1[5]</code> và biến con trỏ <code>a2</code> ở <strong>Stack</strong>, còn khối 80 byte mà <code>a2</code> trỏ tới thì ở <strong>Heap</strong>.</p>
<ul>
<li><strong>Đọc bốn địa chỉ slide in ra</strong> — <code>MAX address = 4206608</code> (data) · <code>main() address = 4199776</code> (code) · <code>a1 address = 6684160</code> (stack) · <code>a2 address = 6684152</code> (stack) · <code>value of a2 = 1929056</code> (heap). Để ý chỗ phân biệt sống còn ở dòng cuối: <code>&amp;a2</code> là nơi <em>con trỏ</em> nằm; còn <code>a2</code> là nơi <em>mảng</em> nằm.</li>
<li><strong>Hai kích thước, hai nơi</strong> — khung xanh lá đánh dấu <strong>20 byte</strong> trên stack (đó là <code>int a1[5]</code>) và <strong>80 byte</strong> trong heap (đó là <code>calloc(10, sizeof(double))</code> = 10 × 8). Cả hai đều là khối; chỉ khác khu phố.</li>
<li><strong>Ý nghĩa cốt lõi của sơ đồ</strong> — mảng tĩnh <em>chính là</em> khối, mảng động <em>trỏ tới</em> khối. Với <code>a1</code>, cái tên và dữ liệu ở cùng một địa chỉ; với <code>a2</code>, cái tên ở 6684152 còn dữ liệu ở 1929056, cách xa nhau.</li>
<li><strong>Tính liền kề là điều mà bảng dưới đây chứng minh</strong> — tôi khai <code>int a1[5] = {5,4,8,15,90};</code> và in <code>&amp;a1[i]</code> với mọi <code>i</code>. Mỗi địa chỉ cao hơn địa chỉ trước đúng <code>sizeof(int) = 4</code> byte, và <code>a1 + i</code> cho cùng một con số với <code>&amp;a1[i]</code> ở mọi hàng.</li>
</ul>
<table>
<tr><th>Chỉ số i</th><th>Địa chỉ ĐO ĐƯỢC (&amp;a1[i])</th><th>a1 + i</th><th>Khoảng cách</th><th>Giá trị</th></tr>
<tr><td>0</td><td>0x16f8523b0</td><td>0x16f8523b0</td><td>—</td><td>5</td></tr>
<tr><td>1</td><td>0x16f8523b4</td><td>0x16f8523b4</td><td>+4</td><td>4</td></tr>
<tr><td>2</td><td>0x16f8523b8</td><td>0x16f8523b8</td><td>+4</td><td>8</td></tr>
<tr><td>3</td><td>0x16f8523bc</td><td>0x16f8523bc</td><td>+4</td><td>15</td></tr>
<tr><td>4</td><td>0x16f8523c0</td><td>0x16f8523c0</td><td>+4</td><td>90</td></tr>
</table>
<p class="dap-an">✅ Đây là <strong>địa chỉ ĐO ĐƯỢC trên máy tôi</strong> bằng <code>cc -Wall</code>, không phải số bịa. <code>sizeof(a1) = 20</code>, năm ô nằm cách nhau bốn byte và giữa chúng không có gì, và <code>&amp;a1[1] - &amp;a1[0] = 4</code> byte đúng bằng <code>sizeof(int)</code>. Cũng trong lần chạy đó, <code>&amp;a2 = 0x16f8523a0</code> (stack, ngay cạnh mảng) trong khi <code>a2 = 0x1005e1e50</code> (heap, một vùng hoàn toàn khác) và khối heap là 10 × 8 = <strong>80 byte</strong> — đúng hai con số slide nêu, chỉ khác máy.</p>
<p class="pitfall">⚠️ Slide in địa chỉ bằng <code>printf("%u", &amp;a1)</code>. Cách đó hợp lệ trong thế giới Dev-C++ 32-bit; trên mọi trình biên dịch 64-bit ngày nay, <code>cc -Wall</code> từ chối ngay (<em>format specifies 'unsigned int' but the argument has type 'int (*)[5]'</em>) và con số in ra chỉ là mẩu cụt của địa chỉ thật. Hãy dùng <code>%p</code> kèm ép kiểu <code>(void *)</code>. Địa chỉ của bạn sẽ không trùng với slide, cũng không trùng với tôi — thứ phải trùng là <em>khoảng cách</em>.</p>`],

      [10, '1-D Arrays: Initialization & Accessing Elements',
        `<p class="y-chinh">🎯 Two boxes, one sentence each. Initialisation: <strong><code>DataType a[] = {value1, value2, … };</code></strong>. Access: <em>"<strong>a is the address of the first element</strong>"</em>, and from that single fact the four notations below all follow.</p>
<ul>
<li><strong>The empty brackets</strong> — <code>int a[] = {2, 4, 6, -2};</code> has no number inside <code>[]</code> because the compiler counts the initialisers for you. Four values → four boxes → 16 bytes. This form only works when you initialise; <code>int a[];</code> alone is an error.</li>
<li><strong>The identity that runs the rest of the chapter</strong> — the array name <code>a</code> <em>is</em> the address of element 0. Not "contains", not "points to a copy": it is that address. So everything you learned about pointer arithmetic in Slot 10 applies to array names directly.</li>
<li><strong>Two ways to say "address of element i"</strong> — <code>a + i</code> and <code>&amp;a[i]</code>. Identical, always, by definition.</li>
<li><strong>Two ways to say "value of element i"</strong> — <code>*(a + i)</code> and <code>a[i]</code>. Also identical, always. In fact the C standard <em>defines</em> <code>a[i]</code> as <code>*(a + i)</code> — the bracket notation is pure convenience.</li>
<li><strong>Why the slide insists on the pointer form</strong> — because in three slides' time the array will arrive inside a function as a bare pointer, and there the pointer form is all you have. The school's own Solution on slide 20 writes every loop as <code>*(a + i)</code> for exactly this reason.</li>
<li><strong>A consequence that surprises everyone</strong> — since <code>a[i]</code> means <code>*(a+i)</code> and addition commutes, <code>i[a]</code> is legal C and means the same thing. Never write it; do recognise it in a trick question.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    int a[] = {2, 4, 6, -2};
    int n = sizeof(a) / sizeof(a[0]);
    for (int i = 0; i &lt; n; i++)
        printf("i=%d  a+i=%p  &amp;a[i]=%p  *(a+i)=%d  a[i]=%d\\n",
               i, (void *)(a + i), (void *)&amp;a[i], *(a + i), a[i]);
    return 0;
}</code></pre>
<p class="dap-an">✅ Compiled and run: <code>sizeof(a) = 16</code> so <code>n = 4</code>, and in all four rows <code>a+i</code> and <code>&amp;a[i]</code> printed the <em>same</em> address (<code>0x16b4163a0 · a4 · a8 · ac</code>) while <code>*(a+i)</code> and <code>a[i]</code> printed the same value (2, 4, 6, −2). The two notations are interchangeable — measured, not assumed.</p>`,
        `<p class="y-chinh">🎯 Hai khung, mỗi khung một câu. Khởi tạo: <strong><code>DataType a[] = {value1, value2, … };</code></strong>. Truy cập: <em>"<strong>a là địa chỉ của phần tử đầu tiên</strong>"</em>, và từ đúng một sự thật ấy mà bốn cách viết bên dưới đều suy ra.</p>
<ul>
<li><strong>Cặp ngoặc rỗng</strong> — <code>int a[] = {2, 4, 6, -2};</code> không có số trong <code>[]</code> vì trình biên dịch tự đếm các giá trị khởi tạo giúp bạn. Bốn giá trị → bốn ô → 16 byte. Dạng này CHỈ dùng được khi có khởi tạo; viết <code>int a[];</code> trống trơn là lỗi.</li>
<li><strong>Đẳng thức điều khiển cả phần còn lại của chương</strong> — tên mảng <code>a</code> CHÍNH LÀ địa chỉ của phần tử 0. Không phải "chứa", không phải "trỏ tới một bản sao": nó là địa chỉ ấy. Nên mọi thứ bạn học về số học con trỏ ở Slot 10 áp thẳng được vào tên mảng.</li>
<li><strong>Hai cách nói "địa chỉ của phần tử i"</strong> — <code>a + i</code> và <code>&amp;a[i]</code>. Giống hệt nhau, luôn luôn, theo định nghĩa.</li>
<li><strong>Hai cách nói "giá trị của phần tử i"</strong> — <code>*(a + i)</code> và <code>a[i]</code>. Cũng giống hệt, luôn luôn. Thực ra chuẩn C <em>định nghĩa</em> <code>a[i]</code> chính là <code>*(a + i)</code> — cặp ngoặc vuông chỉ là cách viết cho tiện.</li>
<li><strong>Vì sao slide nhấn mạnh dạng con trỏ</strong> — vì chỉ ba slide nữa thôi, mảng sẽ bước vào hàm dưới dạng một con trỏ trần, và ở đó dạng con trỏ là tất cả những gì bạn có. Bài Solution của chính trường ở slide 20 viết mọi vòng lặp bằng <code>*(a + i)</code> đúng vì lý do này.</li>
<li><strong>Một hệ quả làm ai cũng ngạc nhiên</strong> — vì <code>a[i]</code> nghĩa là <code>*(a+i)</code> mà phép cộng có tính giao hoán, nên <code>i[a]</code> là C hợp lệ và có cùng nghĩa. Đừng bao giờ viết như thế; nhưng hãy nhận ra nó khi gặp câu hỏi mẹo.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    int a[] = {2, 4, 6, -2};
    int n = sizeof(a) / sizeof(a[0]);
    for (int i = 0; i &lt; n; i++)
        printf("i=%d  a+i=%p  &amp;a[i]=%p  *(a+i)=%d  a[i]=%d\\n",
               i, (void *)(a + i), (void *)&amp;a[i], *(a + i), a[i]);
    return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch và chạy: <code>sizeof(a) = 16</code> nên <code>n = 4</code>, và ở cả bốn hàng, <code>a+i</code> với <code>&amp;a[i]</code> in ra <em>cùng</em> một địa chỉ (<code>0x16b4163a0 · a4 · a8 · ac</code>) còn <code>*(a+i)</code> với <code>a[i]</code> in ra cùng một giá trị (2, 4, 6, −2). Hai cách viết thay thế được cho nhau — đo thật, không phải đoán.</p>`],

      [11, '1-D Arrays: Initialization & Accessing Elements (cont.)',
        `<p class="y-chinh">🎯 Three coloured boxes = three rules about what is in the boxes you did not fill. Blue: <em>the compiler counts the initialisers to size the array</em>. Brown: <em>the size is pre-defined, and the compiler fills <strong>0</strong> into the elements you did not initialise</em>. Pink: <em><code>int a[5];</code> with no initialiser contains <strong>unpredictable</strong> values — <strong>TEST IT !!!!</strong></em></p>
<ul>
<li><strong>Top example</strong> — <code>int a[] = {2,4,6,-2};</code>. The console beside it shows four rows of addresses <code>2293600, 2293604, 2293608, 2293612</code> (four apart, as always) and four values <code>2, 4, 6, -2</code>. Size decided by the number of initialisers.</li>
<li><strong>Bottom example</strong> — <code>int a[5] = {2,4};</code>. The console shows values <code>2, 4, 0, 0</code> — the two you gave, then zeros. This is a real guarantee of the language, not a coincidence: <em>partial initialisation zero-fills the rest</em>.</li>
<li><strong>The pink box is the trap</strong> — <code>int a[5];</code> with <em>no</em> braces at all initialises nothing. As a local (stack) variable it contains whatever the previous function left behind. The slide's shout of "TEST IT !!!!" is fair: the values look plausible, change between runs, and often happen to be 0 — which is exactly how the bug hides.</li>
<li><strong>The one-element shortcut</strong> — because partial initialisation zero-fills, <code>int a[100] = {0};</code> zeroes all hundred elements. Memorise it; it is the cheapest way to start a counting array.</li>
<li><strong>What is NOT allowed</strong> — you cannot assign a whole array after declaration: <code>int a[3]; a = {1,2,3};</code> is a compile error. Initialisation with braces happens only at the declaration.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    int a[] = {2, 4, 6, -2};        /* trinh bien dich TU dem: 4 phan tu */
    int b[5] = {2, 4};              /* ba o con lai duoc dat 0           */
    printf("sizeof(a) = %zu -&gt; %zu phan tu\\n", sizeof(a), sizeof(a) / sizeof(a[0]));
    printf("b: ");
    for (int i = 0; i &lt; 5; i++) printf("%d ", b[i]);
    printf("\\nsizeof(b) = %zu\\n", sizeof(b));
    return 0;
}</code></pre>
<p class="dap-an">✅ Compiled and run: <code>sizeof(a) = 16</code> → <strong>4 elements</strong> (the blue box is right), and <code>b</code> printed <strong><code>2 4 0 0 0</code></strong> with <code>sizeof(b) = 20</code> (the brown box is right). I also ran the pink case: on <em>this</em> run an uninitialised local array happened to read back as zeros, which proves nothing — the language promises nothing there, and a different compiler, optimisation level or call history gives different rubbish.</p>
<p class="pitfall">⚠️ Never let a run that "looks fine" convince you an uninitialised array is zero. The honest test is not "does it print 0 today"; it is "does the standard promise it". For <code>int a[5] = {2,4};</code> the answer is yes. For <code>int a[5];</code> the answer is no. Write <code>= {0}</code> whenever you intend zeros.</p>`,
        `<p class="y-chinh">🎯 Ba khung màu = ba quy tắc về những ô bạn không điền. Xanh: <em>trình biên dịch đếm số giá trị khởi tạo để định kích thước mảng</em>. Nâu: <em>kích thước đã định sẵn, và trình biên dịch điền <strong>0</strong> vào những phần tử bạn không khởi tạo</em>. Hồng: <em><code>int a[5];</code> không có khởi tạo thì chứa giá trị <strong>không đoán trước được</strong> — <strong>TEST IT !!!!</strong></em></p>
<ul>
<li><strong>Ví dụ trên</strong> — <code>int a[] = {2,4,6,-2};</code>. Khung console bên cạnh cho bốn hàng địa chỉ <code>2293600, 2293604, 2293608, 2293612</code> (cách nhau bốn, như mọi khi) và bốn giá trị <code>2, 4, 6, -2</code>. Kích thước do số giá trị khởi tạo quyết định.</li>
<li><strong>Ví dụ dưới</strong> — <code>int a[5] = {2,4};</code>. Console cho giá trị <code>2, 4, 0, 0</code> — hai số bạn đưa, rồi toàn số 0. Đây là bảo đảm thật của ngôn ngữ, không phải trùng hợp: <em>khởi tạo thiếu thì phần còn lại được đổ 0</em>.</li>
<li><strong>Khung hồng mới là cái bẫy</strong> — <code>int a[5];</code> không có ngoặc nhọn nào thì không khởi tạo gì cả. Là biến cục bộ (trên stack), nó chứa đúng thứ mà hàm chạy trước đó để lại. Câu "TEST IT !!!!" của slide hét lên là có lý: các giá trị đó trông rất hợp lý, đổi theo từng lần chạy, và thường tình cờ bằng 0 — đó chính là cách con lỗi ẩn mình.</li>
<li><strong>Mẹo một phần tử</strong> — vì khởi tạo thiếu sẽ đổ 0 cho phần còn lại, nên <code>int a[100] = {0};</code> làm sạch cả trăm phần tử. Hãy thuộc lòng; đó là cách rẻ nhất để bắt đầu một mảng đếm.</li>
<li><strong>Điều KHÔNG được phép</strong> — bạn không gán được cả mảng sau khi khai báo: <code>int a[3]; a = {1,2,3};</code> là lỗi biên dịch. Khởi tạo bằng ngoặc nhọn chỉ xảy ra ngay tại chỗ khai báo.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    int a[] = {2, 4, 6, -2};        /* trinh bien dich TU dem: 4 phan tu */
    int b[5] = {2, 4};              /* ba o con lai duoc dat 0           */
    printf("sizeof(a) = %zu -&gt; %zu phan tu\\n", sizeof(a), sizeof(a) / sizeof(a[0]));
    printf("b: ");
    for (int i = 0; i &lt; 5; i++) printf("%d ", b[i]);
    printf("\\nsizeof(b) = %zu\\n", sizeof(b));
    return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch và chạy: <code>sizeof(a) = 16</code> → <strong>4 phần tử</strong> (khung xanh đúng), và <code>b</code> in ra <strong><code>2 4 0 0 0</code></strong> với <code>sizeof(b) = 20</code> (khung nâu đúng). Tôi cũng chạy thử trường hợp khung hồng: trong <em>lần chạy này</em>, một mảng cục bộ chưa khởi tạo tình cờ đọc ra toàn số 0 — điều đó chẳng chứng minh được gì, vì ngôn ngữ không hứa gì ở đó, và đổi trình biên dịch, đổi mức tối ưu hay đổi lịch sử lời gọi là ra rác khác.</p>
<p class="pitfall">⚠️ Đừng để một lần chạy "trông ổn" thuyết phục bạn rằng mảng chưa khởi tạo là 0. Phép kiểm trung thực không phải "hôm nay nó có in ra 0 không", mà là "chuẩn ngôn ngữ có hứa điều đó không". Với <code>int a[5] = {2,4};</code> thì có. Với <code>int a[5];</code> thì không. Hễ muốn số 0 thì hãy viết <code>= {0}</code>.</p>`],

      [12, '1-D Arrays: Traversing',
        `<p class="y-chinh">🎯 <em>"A way to visit <strong>each</strong> element of an array."</em> Two templates, and between them they cover almost every array exercise you will ever be set: <strong>forward</strong> <code>for (i=0; i&lt;n; i++)</code> and <strong>backward</strong> <code>for (i=n-1; i&gt;=0; i--)</code>.</p>
<ul>
<li><strong>Read the forward header as a sentence</strong> — start at <strong>0</strong> (first legal index), continue <em>while</em> <code>i &lt; n</code> (so the last visited index is <code>n-1</code>), step by one. Every part of it exists to respect the <code>0 … n-1</code> rule from slide 6.</li>
<li><strong>Why <code>i &lt; n</code> and never <code>i &lt;= n</code></strong> — this single character is the most common array bug in the course. <code>i &lt;= n</code> visits <code>a[n]</code>, which is outside the block. The compiler will not stop you (slide 6 measured exactly this).</li>
<li><strong>Read the backward header the same way</strong> — start at <code>n-1</code> (last legal index), continue while <code>i &gt;= 0</code>, step down. The mirror trap is <code>i &gt; 0</code>, which silently skips <code>a[0]</code>.</li>
<li><strong>The optional <code>[if (condition)]</code> line</strong> — the square brackets on the slide mean "optional". This is the hinge that turns one template into every exercise: no condition → print/sum everything; <code>if (a[i] % 2 == 0)</code> → even values only; <code>if (a[i] &gt; max)</code> → find the maximum; <code>if (a[i] == x)</code> → search.</li>
<li><strong>When direction matters</strong> — printing in reverse, finding the <em>last</em> occurrence rather than the first, or shifting elements right to insert (you must copy from the end or you overwrite what you have not copied yet).</li>
<li><strong>Declare <code>i</code> outside the loop</strong> — the slide writes <code>int i;</code> above the <code>for</code>. In C89 (the Dev-C++ default in labs) declaring inside the <code>for</code> header is rejected. Follow the slide's style in exams.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    int a[6] = {3, 5, 8, 1, 2, 0};
    int n = 6, i;
    long tong = 0;

    printf("xuoi:  ");  for (i = 0;   i &lt; n;  i++) printf("%d ", a[i]);  printf("\\n");
    printf("nguoc: ");  for (i = n-1; i &gt;= 0; i--) printf("%d ", a[i]);  printf("\\n");
    printf("chan:  ");  for (i = 0;   i &lt; n;  i++) if (a[i] % 2 == 0) printf("%d ", a[i]);
    printf("\\n");
    for (i = 0; i &lt; n; i++) tong += a[i];
    printf("tong = %ld\\n", tong);
    return 0;
}</code></pre>
<p class="dap-an">✅ Compiled and run on the array <code>3 5 8 1 2 0</code>: forward <strong><code>3 5 8 1 2 0</code></strong> · backward <strong><code>0 2 1 8 5 3</code></strong> · even values <strong><code>8 2 0</code></strong> · sum <strong>19</strong>. The same six-element array will come back on slides 15, 21 and 23, so keep these four answers.</p>
<p class="meo">💡 The traversal template is worth more than any single exercise: <em>loop header from slide 12 + one <code>if</code> + one statement = the answer to most array questions on the PE.</em> When a problem looks hard, write the empty <code>for</code> first and then ask only "what goes inside the <code>if</code>".</p>`,
        `<p class="y-chinh">🎯 <em>"Cách đi thăm <strong>từng</strong> phần tử của mảng."</em> Hai khuôn mẫu, và hai cái đó gộp lại đã phủ gần hết mọi bài tập mảng bạn sẽ gặp: <strong>duyệt xuôi</strong> <code>for (i=0; i&lt;n; i++)</code> và <strong>duyệt ngược</strong> <code>for (i=n-1; i&gt;=0; i--)</code>.</p>
<ul>
<li><strong>Đọc dòng đầu vòng lặp xuôi như một câu văn</strong> — bắt đầu từ <strong>0</strong> (chỉ số hợp lệ đầu tiên), tiếp tục <em>chừng nào</em> <code>i &lt; n</code> (nên chỉ số cuối cùng được thăm là <code>n-1</code>), mỗi bước tăng một. Mọi thành phần trong đó tồn tại để tôn trọng luật <code>0 … n-1</code> của slide 6.</li>
<li><strong>Vì sao là <code>i &lt; n</code> chứ tuyệt đối không phải <code>i &lt;= n</code></strong> — đúng một ký tự này là lỗi mảng phổ biến nhất của cả môn. <code>i &lt;= n</code> sẽ thăm <code>a[n]</code>, tức là ra ngoài khối. Trình biên dịch sẽ không cản bạn (slide 6 đã đo đúng chuyện này).</li>
<li><strong>Đọc dòng đầu vòng ngược theo đúng cách ấy</strong> — bắt đầu ở <code>n-1</code> (chỉ số hợp lệ cuối), tiếp tục chừng nào <code>i &gt;= 0</code>, mỗi bước giảm một. Cái bẫy đối xứng là <code>i &gt; 0</code>, nó âm thầm bỏ sót <code>a[0]</code>.</li>
<li><strong>Dòng <code>[if (điều kiện)]</code> tuỳ chọn</strong> — cặp ngoặc vuông trên slide nghĩa là "có thể có hoặc không". Đây chính là bản lề biến một khuôn mẫu thành mọi bài tập: không điều kiện → in/cộng tất cả; <code>if (a[i] % 2 == 0)</code> → chỉ số chẵn; <code>if (a[i] &gt; max)</code> → tìm lớn nhất; <code>if (a[i] == x)</code> → tìm kiếm.</li>
<li><strong>Khi nào chiều duyệt mới quan trọng</strong> — in ngược, tìm vị trí xuất hiện <em>cuối cùng</em> thay vì đầu tiên, hoặc dồn phần tử sang phải để chèn (phải chép từ cuối lên, không thì bạn đè lên chính thứ chưa kịp chép).</li>
<li><strong>Khai <code>i</code> ở ngoài vòng lặp</strong> — slide viết <code>int i;</code> phía trên chữ <code>for</code>. Theo C89 (mặc định của Dev-C++ trong phòng lab), khai báo ngay trong dấu ngoặc của <code>for</code> bị từ chối. Trong phòng thi hãy theo đúng lối viết của slide.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    int a[6] = {3, 5, 8, 1, 2, 0};
    int n = 6, i;
    long tong = 0;

    printf("xuoi:  ");  for (i = 0;   i &lt; n;  i++) printf("%d ", a[i]);  printf("\\n");
    printf("nguoc: ");  for (i = n-1; i &gt;= 0; i--) printf("%d ", a[i]);  printf("\\n");
    printf("chan:  ");  for (i = 0;   i &lt; n;  i++) if (a[i] % 2 == 0) printf("%d ", a[i]);
    printf("\\n");
    for (i = 0; i &lt; n; i++) tong += a[i];
    printf("tong = %ld\\n", tong);
    return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch và chạy trên mảng <code>3 5 8 1 2 0</code>: xuôi <strong><code>3 5 8 1 2 0</code></strong> · ngược <strong><code>0 2 1 8 5 3</code></strong> · giá trị chẵn <strong><code>8 2 0</code></strong> · tổng <strong>19</strong>. Chính mảng sáu phần tử này sẽ trở lại ở slide 15, 21 và 23, nên hãy giữ lấy bốn đáp số trên.</p>
<p class="meo">💡 Khuôn mẫu duyệt còn đáng giá hơn bất kỳ bài tập lẻ nào: <em>dòng đầu vòng lặp ở slide 12 + một câu <code>if</code> + một câu lệnh = lời giải cho phần lớn câu hỏi mảng trong bài PE.</em> Khi đề trông khó, hãy viết cái <code>for</code> rỗng ra trước, rồi chỉ còn phải hỏi "bên trong <code>if</code> viết gì".</p>`],
      [13, '1-D Array is a Function Parameter',
        `<p class="y-chinh">🎯 The single most important line in this lesson: <em>"The array parameter of a function <strong>is the pointer of the first element</strong> of the array."</em> The array does not go into the function. Its first address does.</p>
<ul>
<li><strong>What actually happens at the call</strong> — <code>input(a, n)</code> passes the <em>value</em> of <code>a</code>, and the value of an array name is the address of element 0. No elements are copied. This is called <strong>array decay</strong>: <code>int a[100]</code> becomes <code>int *</code> the instant it crosses into a function.</li>
<li><strong>Consequence 1 — the function can modify the caller's array.</strong> This is the opposite of Slot 08-09, where <code>void f(int x)</code> could never change the caller's <code>x</code>. Here the function holds the real address, so <code>a[0] = 999</code> inside the function changes the original. That is why <code>input()</code> can work at all.</li>
<li><strong>Consequence 2 — the function no longer knows how many elements there are.</strong> The size was part of the array's <em>type</em>, and the type is gone. This is why <strong>every one of the four examples on the slide passes <code>n</code> as a second parameter</strong>: <code>void input(int* a, int n)</code> · <code>void input(int a[], int* pn)</code> · <code>int sum(int *a, int n)</code> · <code>void output(double a[], int n)</code>.</li>
<li><strong><code>int a[]</code> and <code>int *a</code> are the same thing here</strong> — in a parameter list only. The slide deliberately mixes both spellings so you stop believing there is a difference. Elsewhere (a local declaration) they are completely different.</li>
<li><strong>Example 2 is the odd one</strong> — <code>void input(int a[], int *pn)</code> passes <em>a pointer to</em> the count, because that function must also <em>report back</em> how many values it read. That is exactly Exercise 1 on slides 22-24; hold the thought.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

void f(int a[], int n) {
    printf("  trong ham: sizeof(a) = %zu -&gt; n tinh duoc = %zu (SAI)\\n",
           sizeof(a), sizeof(a) / sizeof(a[0]));
    a[0] = 999;                       /* sua duoc mang GOC */
    (void)n;
}
void byValue(int x) { x = 999; }      /* KHONG sua duoc bien goc */

int main(void) {
    int a[5] = {1, 2, 3, 4, 5};
    int x = 1;
    printf("trong main: sizeof(a) = %zu -&gt; n = %zu\\n", sizeof(a), sizeof(a) / sizeof(a[0]));
    f(a, 5);
    byValue(x);
    printf("sau f(a,5):     a[0] = %d\\n", a[0]);
    printf("sau byValue(x): x    = %d\\n", x);
    printf("sizeof(int*) = %zu\\n", sizeof(int *));
    return 0;
}</code></pre>
<p class="dap-an">✅ Measured with <code>cc -Wall</code>. In <code>main</code>: <code>sizeof(a) = 20</code> → n = 5, correct. <strong>Inside the function: <code>sizeof(a) = 8</code> → n = 2, wrong.</strong> Eight is <code>sizeof(int *)</code> on this 64-bit machine — the size of a <em>pointer</em>, not of the array. And the two writes went opposite ways: <code>a[0]</code> became <strong>999</strong> (the function reached the caller's array) while <code>x</code> stayed <strong>1</strong> (the function only had a copy). The compiler even warned: <em>"sizeof on array function parameter will return size of 'int *' instead of 'int[]'"</em>.</p>
<p class="pitfall">⚠️ <code>sizeof(a)/sizeof(a[0])</code> is valid <strong>only in the function where the array was declared</strong>. Copying that line into a helper function silently gives 8/4 = 2 on a 64-bit build (and 4/4 = 1 on a 32-bit one) — a loop that processes two elements out of a hundred and reports no error at all. Pass <code>n</code>. Always.</p>`,
        `<p class="y-chinh">🎯 Dòng quan trọng nhất của cả bài: <em>"Tham số mảng của một hàm <strong>chính là con trỏ tới phần tử đầu tiên</strong> của mảng."</em> Mảng không đi vào hàm. Chỉ địa chỉ đầu của nó đi vào.</p>
<ul>
<li><strong>Chuyện gì thật sự xảy ra lúc gọi hàm</strong> — <code>input(a, n)</code> truyền <em>giá trị</em> của <code>a</code>, mà giá trị của tên mảng là địa chỉ phần tử 0. Không phần tử nào bị sao chép. Hiện tượng này gọi là <strong>suy biến mảng</strong> (array decay): <code>int a[100]</code> trở thành <code>int *</code> ngay khoảnh khắc nó bước qua cửa hàm.</li>
<li><strong>Hệ quả 1 — hàm SỬA ĐƯỢC mảng của nơi gọi.</strong> Điều này ngược hẳn với Slot 08-09, nơi <code>void f(int x)</code> không bao giờ đổi được <code>x</code> bên ngoài. Ở đây hàm cầm địa chỉ thật, nên <code>a[0] = 999</code> bên trong hàm làm đổi mảng gốc. Đó chính là lý do <code>input()</code> hoạt động được.</li>
<li><strong>Hệ quả 2 — hàm không còn biết mảng có bao nhiêu phần tử.</strong> Kích thước vốn là một phần <em>kiểu</em> của mảng, mà kiểu ấy đã mất. Đó là lý do <strong>cả bốn ví dụ trên slide đều truyền thêm <code>n</code> làm tham số thứ hai</strong>: <code>void input(int* a, int n)</code> · <code>void input(int a[], int* pn)</code> · <code>int sum(int *a, int n)</code> · <code>void output(double a[], int n)</code>.</li>
<li><strong><code>int a[]</code> và <code>int *a</code> là một</strong> — chỉ trong danh sách tham số. Slide cố tình trộn cả hai lối viết để bạn thôi tin rằng chúng khác nhau. Ở chỗ khác (khai báo biến cục bộ) thì chúng khác nhau hoàn toàn.</li>
<li><strong>Ví dụ 2 là ví dụ lạ</strong> — <code>void input(int a[], int *pn)</code> truyền <em>con trỏ tới</em> số lượng, vì hàm đó còn phải <em>báo ngược về</em> nó đã đọc được bao nhiêu giá trị. Đó đúng là bài Exercise 1 ở slide 22-24; hãy giữ ý này lại.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

void f(int a[], int n) {
    printf("  trong ham: sizeof(a) = %zu -&gt; n tinh duoc = %zu (SAI)\\n",
           sizeof(a), sizeof(a) / sizeof(a[0]));
    a[0] = 999;                       /* sua duoc mang GOC */
    (void)n;
}
void byValue(int x) { x = 999; }      /* KHONG sua duoc bien goc */

int main(void) {
    int a[5] = {1, 2, 3, 4, 5};
    int x = 1;
    printf("trong main: sizeof(a) = %zu -&gt; n = %zu\\n", sizeof(a), sizeof(a) / sizeof(a[0]));
    f(a, 5);
    byValue(x);
    printf("sau f(a,5):     a[0] = %d\\n", a[0]);
    printf("sau byValue(x): x    = %d\\n", x);
    printf("sizeof(int*) = %zu\\n", sizeof(int *));
    return 0;
}</code></pre>
<p class="dap-an">✅ Đo thật bằng <code>cc -Wall</code>. Trong <code>main</code>: <code>sizeof(a) = 20</code> → n = 5, đúng. <strong>Bên trong hàm: <code>sizeof(a) = 8</code> → n = 2, SAI.</strong> Số 8 chính là <code>sizeof(int *)</code> trên máy 64-bit này — kích thước của một <em>con trỏ</em>, không phải của mảng. Và hai lệnh ghi đi hai hướng ngược nhau: <code>a[0]</code> thành <strong>999</strong> (hàm với tới được mảng của nơi gọi) trong khi <code>x</code> vẫn là <strong>1</strong> (hàm chỉ cầm bản sao). Trình biên dịch còn cảnh báo thẳng: <em>"sizeof on array function parameter will return size of 'int *' instead of 'int[]'"</em>.</p>
<p class="pitfall">⚠️ <code>sizeof(a)/sizeof(a[0])</code> chỉ đúng <strong>trong đúng cái hàm đã khai báo mảng</strong>. Chép dòng đó sang một hàm phụ là âm thầm nhận 8/4 = 2 trên bản 64-bit (và 4/4 = 1 trên bản 32-bit) — một vòng lặp xử lý hai phần tử trên tổng số một trăm mà không báo lỗi nào cả. Hãy truyền <code>n</code>. Luôn luôn.</p>`],

      [14, '1-D Array is a Function Parameter: Demo',
        `<p class="y-chinh">🎯 Demo 1 states the problem and then does the step every PRF192 problem should start with: it separates the <strong>Nouns</strong> (what data do I need?) from the <strong>Verbs</strong> (what steps do I perform?). That two-column hint is the method, not decoration.</p>
<ul>
<li><strong>The requirement</strong> — accept values into an integer array that <em>may</em> contain 100 elements, then print the maximum, print all elements, and print the even values.</li>
<li><strong>Nouns → declarations</strong> — <code>MAXN = 100</code> becomes <code>#define MAXN 100</code> (a constant, so it can size a static array); <em>static array of integers</em> becomes <code>int a[MAXN];</code>; <em>real number of elements</em> becomes <code>int n;</code>; <em>maximum value</em> becomes <code>int maxVal;</code>.</li>
<li><strong>The word "real" in "real number of elements"</strong> — this is the key idea of the whole demo. The array has room for 100, but the user may only use 6. <code>MAXN</code> is the <em>capacity</em>; <code>n</code> is the <em>occupancy</em>. Every loop runs to <code>n</code>, never to <code>MAXN</code>.</li>
<li><strong>Verbs → functions</strong> — notice which verbs are marked "(function)" and which are "(one value)". Input <code>n</code> is one value (a plain <code>scanf</code>). Input <code>a, n</code> is a function. Get maximum is a function. Print <code>a, n</code> is a function. Print even values is a function. That is exactly the four prototypes you will see on slide 15.</li>
<li><strong>Read the argument lists in the Verbs column</strong> — every function verb carries "<code>a, n</code>", never just "<code>a</code>". Slide 13 explained why: inside the function the size is gone.</li>
<li><strong>Begin … End</strong> — the verbs are in execution order, which becomes the body of <code>main</code> line for line. Writing this column first is what stops you from coding in circles.</li>
</ul>
<p class="meo">💡 Use the Nouns/Verbs table on every exercise in this chapter and in the PE. Nouns give you the declarations at the top of <code>main</code>; verbs give you the prototypes and the call order. When an exam question says "develop a C program that will…", the bullet list <em>is</em> the verb column — you are being handed half the answer.</p>`,
        `<p class="y-chinh">🎯 Demo 1 nêu đề bài rồi làm đúng cái bước mà mọi bài PRF192 nên bắt đầu: tách <strong>Danh từ</strong> (mình cần dữ liệu gì?) khỏi <strong>Động từ</strong> (mình làm những bước nào?). Bảng gợi ý hai cột ấy là PHƯƠNG PHÁP, không phải trang trí.</p>
<ul>
<li><strong>Yêu cầu</strong> — nhận các giá trị vào một mảng số nguyên <em>có thể</em> chứa 100 phần tử, rồi in giá trị lớn nhất, in toàn bộ phần tử, và in các giá trị chẵn.</li>
<li><strong>Danh từ → khai báo</strong> — <code>MAXN = 100</code> thành <code>#define MAXN 100</code> (là hằng, nên định kích thước được cho mảng tĩnh); <em>mảng tĩnh số nguyên</em> thành <code>int a[MAXN];</code>; <em>số phần tử thực dùng</em> thành <code>int n;</code>; <em>giá trị lớn nhất</em> thành <code>int maxVal;</code>.</li>
<li><strong>Chữ "thực" trong "số phần tử thực dùng"</strong> — đây là ý cốt lõi của cả bài demo. Mảng có chỗ cho 100, nhưng người dùng có thể chỉ xài 6. <code>MAXN</code> là <em>sức chứa</em>; <code>n</code> là <em>số đang dùng</em>. Mọi vòng lặp chạy tới <code>n</code>, không bao giờ tới <code>MAXN</code>.</li>
<li><strong>Động từ → hàm</strong> — để ý động từ nào được đánh dấu "(function)" và động từ nào là "(one value)". Nhập <code>n</code> là một giá trị (một lệnh <code>scanf</code> thường). Nhập <code>a, n</code> là một hàm. Lấy giá trị lớn nhất là một hàm. In <code>a, n</code> là một hàm. In các giá trị chẵn là một hàm. Đó đúng là bốn nguyên mẫu bạn sẽ thấy ở slide 15.</li>
<li><strong>Đọc danh sách đối số trong cột Động từ</strong> — mọi động từ dạng hàm đều kèm "<code>a, n</code>", không bao giờ chỉ có "<code>a</code>". Slide 13 đã giải thích vì sao: vào trong hàm rồi thì kích thước đã mất.</li>
<li><strong>Begin … End</strong> — các động từ được ghi theo đúng thứ tự thực hiện, và nó trở thành thân hàm <code>main</code> gần như từng dòng một. Viết cột này trước chính là thứ ngăn bạn code loanh quanh.</li>
</ul>
<p class="meo">💡 Hãy dùng bảng Danh từ/Động từ cho mọi bài tập trong chương này và trong bài PE. Danh từ cho bạn phần khai báo ở đầu <code>main</code>; động từ cho bạn các nguyên mẫu hàm và thứ tự gọi. Khi đề thi viết "viết chương trình C thực hiện…", thì danh sách gạch đầu dòng ấy CHÍNH LÀ cột động từ — người ta đang đưa sẵn cho bạn một nửa lời giải.</p>`],

      [15, 'Array Funtion Parameter: Demo 1 (cont.) — main()',
        `<p class="y-chinh">🎯 The <code>main()</code> of Demo 1, lines 1-33, with the real console beside it. Read it as the Verbs column of slide 14 turned into code, one line per verb.</p>
<ul>
<li><strong>Lines 5-9, the four prototypes</strong> — <code>void input(int *a, int n);</code> · <code>int max(int a[], int n);</code> · <code>void print(int *a, int n);</code> · <code>void printEven(int *a, int n);</code>. Every one takes <code>(array, n)</code>, and the slide deliberately spells the parameter both ways to prove they are the same.</li>
<li><strong>Lines 13-15, the nouns</strong> — <code>int a[MAXN];</code> with the comment "static array of 100 integers", <code>int n;</code> "real used number of elements", <code>int maxVal;</code>.</li>
<li><strong>Lines 16-19, the input validation</strong> — <code>do { printf(…); scanf("%d", &amp;n); } while (n &lt; 1 || n &gt; MAXN);</code>. A <code>do…while</code> because the question must be asked at least once, and the guard is on <em>both</em> ends: fewer than 1 is meaningless, more than <code>MAXN</code> would overflow the block.</li>
<li><strong>Lines 21-27, the work</strong> — <code>input(a, n)</code>, then <code>maxVal = max(a, n)</code>, then <code>print(a, n)</code>, then <code>printEven(a, n)</code>. Notice <code>a</code> is passed bare, with no <code>&amp;</code>: the array name is already an address (slide 10).</li>
<li><strong>Line 29, <code>while(getchar() != '\\n');</code></strong> — clearing the input buffer, exactly the technique from Slot 06's <code>scanf</code> traps. Without it the leftover newline would be swallowed by a later read.</li>
<li><strong>The console is the acceptance test</strong> — 6 elements, values <code>3 5 8 1 2 0</code> → <code>Max value: 8</code>, <code>Inputted array: 3 5 8 1 2 0</code>, <code>Even values in array: 8 2 0</code>.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#define MAXN 100

/* Prototypes */
void input(int *a, int n);
int  max(int a[], int n);
void print(int *a, int n);
void printEven(int *a, int n);

int main() {
    int a[MAXN];      /* static array of 100 integers */
    int n;            /* real used number of elements */
    int maxVal;
    do {
        printf("How many elements which be used 1 ... %d: ", MAXN);
        scanf("%d", &amp;n);
    } while (n &lt; 1 || n &gt; MAXN);
    printf("Enter %d values of the array:\\n", n);
    input(a, n);
    maxVal = max(a, n);
    printf("Max value: %d\\n", maxVal);
    printf("\\nInputted array: ");     print(a, n);
    printf("\\nEven values in array: "); printEven(a, n);
    printf("\\n");
    return 0;
}</code></pre>
<p class="dap-an">✅ Compiled with <code>cc -Wall</code> and run with the slide's own input (<code>6</code>, then <code>3 5 8 1 2 0</code>): <code>Max value: 8</code> · <code>Inputted array: 3 5 8 1 2 0</code> · <code>Even values in array: 8 2 0</code> — character for character the console on the slide. Note that <strong>0 counts as even</strong> (0 % 2 == 0), which is why the even list has three entries, not two.</p>`,
        `<p class="y-chinh">🎯 Hàm <code>main()</code> của Demo 1, dòng 1-33, kèm khung console thật bên cạnh. Hãy đọc nó như cột Động từ của slide 14 được viết thành mã, mỗi động từ một dòng.</p>
<ul>
<li><strong>Dòng 5-9, bốn nguyên mẫu</strong> — <code>void input(int *a, int n);</code> · <code>int max(int a[], int n);</code> · <code>void print(int *a, int n);</code> · <code>void printEven(int *a, int n);</code>. Cái nào cũng nhận <code>(mảng, n)</code>, và slide cố tình viết tham số theo cả hai kiểu để chứng minh chúng là một.</li>
<li><strong>Dòng 13-15, các danh từ</strong> — <code>int a[MAXN];</code> với chú thích "mảng tĩnh 100 số nguyên", <code>int n;</code> "số phần tử thực dùng", <code>int maxVal;</code>.</li>
<li><strong>Dòng 16-19, kiểm tra dữ liệu vào</strong> — <code>do { printf(…); scanf("%d", &amp;n); } while (n &lt; 1 || n &gt; MAXN);</code>. Dùng <code>do…while</code> vì câu hỏi phải được hỏi ít nhất một lần, và chốt chặn ở <em>cả hai</em> đầu: nhỏ hơn 1 thì vô nghĩa, lớn hơn <code>MAXN</code> thì tràn ra ngoài khối.</li>
<li><strong>Dòng 21-27, phần việc chính</strong> — <code>input(a, n)</code>, rồi <code>maxVal = max(a, n)</code>, rồi <code>print(a, n)</code>, rồi <code>printEven(a, n)</code>. Để ý <code>a</code> được truyền trần, không có dấu <code>&amp;</code>: tên mảng vốn đã là một địa chỉ rồi (slide 10).</li>
<li><strong>Dòng 29, <code>while(getchar() != '\\n');</code></strong> — dọn vùng đệm bàn phím, đúng kỹ thuật đã học ở các bẫy <code>scanf</code> của Slot 06. Không có nó thì ký tự xuống dòng còn sót sẽ bị một lệnh đọc sau nuốt mất.</li>
<li><strong>Khung console chính là bài kiểm nghiệm thu</strong> — 6 phần tử, giá trị <code>3 5 8 1 2 0</code> → <code>Max value: 8</code>, <code>Inputted array: 3 5 8 1 2 0</code>, <code>Even values in array: 8 2 0</code>.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#define MAXN 100

/* Prototypes */
void input(int *a, int n);
int  max(int a[], int n);
void print(int *a, int n);
void printEven(int *a, int n);

int main() {
    int a[MAXN];      /* mang tinh 100 so nguyen   */
    int n;            /* so phan tu thuc dung      */
    int maxVal;
    do {
        printf("How many elements which be used 1 ... %d: ", MAXN);
        scanf("%d", &amp;n);
    } while (n &lt; 1 || n &gt; MAXN);
    printf("Enter %d values of the array:\\n", n);
    input(a, n);
    maxVal = max(a, n);
    printf("Max value: %d\\n", maxVal);
    printf("\\nInputted array: ");        print(a, n);
    printf("\\nEven values in array: ");  printEven(a, n);
    printf("\\n");
    return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch bằng <code>cc -Wall</code> và chạy với đúng dữ liệu vào của slide (<code>6</code>, rồi <code>3 5 8 1 2 0</code>): <code>Max value: 8</code> · <code>Inputted array: 3 5 8 1 2 0</code> · <code>Even values in array: 8 2 0</code> — trùng từng ký tự với khung console trên slide. Lưu ý <strong>số 0 được tính là chẵn</strong> (0 % 2 == 0), nên danh sách số chẵn có ba phần tử chứ không phải hai.</p>`],

      [16, 'Array Funtion Parameter: Demo 1 (cont.) — the four functions',
        `<p class="y-chinh">🎯 Lines 36-72: the four function bodies. Every one of them is the traversal template of slide 12 with a different line inside — that is the whole lesson of this slide.</p>
<ul>
<li><strong><code>input(int *a, int n)</code>, lines 36-42</strong> — forward traversal, body <code>scanf("%d", &amp;a[i]);</code>. The <code>&amp;</code> is required because <code>a[i]</code> is a value and <code>scanf</code> needs the address to write into. This function <em>writes into the caller's array</em> — possible only because of array decay (slide 13).</li>
<li><strong><code>max(int a[], int n)</code>, lines 44-54</strong> — <code>int result = a[0];</code> then forward traversal with <code>if (result &lt; a[i]) result = a[i];</code>, then <code>return result;</code>.</li>
<li><strong>Why it starts from <code>a[0]</code> and not from 0</strong> — this is the classic exam trap. If you write <code>int result = 0;</code> and every value is negative, the function returns 0, a value that is not in the array. Seeding with the first element is the only safe start.</li>
<li><strong><code>print(int *a, int n)</code>, lines 56-62</strong> — forward traversal, <code>printf("%d ", a[i]);</code>. Note the trailing space in the format string: it is what separates the numbers.</li>
<li><strong><code>printEven(int *a, int n)</code>, lines 64-72</strong> — the same loop plus the optional <code>if</code> from slide 12: <code>if (a[i] % 2 == 0) printf("%d ", a[i]);</code>.</li>
<li><strong>Four functions, one skeleton</strong> — <code>for (i = 0; i &lt; n; i++) { … }</code>. Learn the skeleton and you have all four; learn the four separately and you will forget them.</li>
</ul>
<pre><code>void input(int *a, int n) {
    int i;
    for (i = 0; i &lt; n; i++) { scanf("%d", &amp;a[i]); }
}
int max(int a[], int n) {
    int result = a[0];           /* mo dau bang phan tu DAU TIEN */
    int i;
    for (i = 0; i &lt; n; i++) { if (result &lt; a[i]) { result = a[i]; } }
    return result;
}
void print(int *a, int n) {
    int i;
    for (i = 0; i &lt; n; i++) { printf("%d ", a[i]); }
}
void printEven(int *a, int n) {
    int i;
    for (i = 0; i &lt; n; i++) { if (a[i] % 2 == 0) { printf("%d ", a[i]); } }
}</code></pre>
<p class="dap-an">✅ These four bodies plus the <code>main</code> of slide 15 were compiled together with <code>cc -Wall</code> (no warnings) and run on <code>3 5 8 1 2 0</code>: max <strong>8</strong>, printed array <strong>3 5 8 1 2 0</strong>, even values <strong>8 2 0</strong>. I also re-ran <code>max</code> on the all-negative array <code>-4 -9 -2</code>: the slide's version correctly returns <strong>−2</strong>, whereas the <code>result = 0</code> variant returns 0, a number that never appeared in the data.</p>
<p class="meo">💡 <code>max</code> can start its loop at <code>i = 1</code> instead of <code>i = 0</code>, since comparing <code>a[0]</code> with itself is wasted work — that is exactly what the school's own Solution does on slide 20 (<code>for (int i = 1; i &lt; n; i++)</code>). Both are correct; the <code>i = 1</code> form is the one to quote if an examiner asks for the efficient version.</p>`,
        `<p class="y-chinh">🎯 Dòng 36-72: thân của bốn hàm. Hàm nào cũng là khuôn mẫu duyệt mảng ở slide 12 với một dòng khác nhau đặt vào bên trong — đó là toàn bộ bài học của slide này.</p>
<ul>
<li><strong><code>input(int *a, int n)</code>, dòng 36-42</strong> — duyệt xuôi, thân là <code>scanf("%d", &amp;a[i]);</code>. Dấu <code>&amp;</code> là bắt buộc vì <code>a[i]</code> là một giá trị, mà <code>scanf</code> cần ĐỊA CHỈ để ghi vào. Hàm này <em>ghi thẳng vào mảng của nơi gọi</em> — làm được chỉ nhờ hiện tượng suy biến mảng (slide 13).</li>
<li><strong><code>max(int a[], int n)</code>, dòng 44-54</strong> — <code>int result = a[0];</code> rồi duyệt xuôi với <code>if (result &lt; a[i]) result = a[i];</code>, cuối cùng <code>return result;</code>.</li>
<li><strong>Vì sao khởi đầu bằng <code>a[0]</code> chứ không phải bằng 0</strong> — đây là cái bẫy kinh điển của đề thi. Nếu bạn viết <code>int result = 0;</code> mà mọi giá trị đều âm, hàm trả về 0 — một con số không hề có trong mảng. Gieo mầm bằng phần tử đầu tiên là cách khởi đầu an toàn duy nhất.</li>
<li><strong><code>print(int *a, int n)</code>, dòng 56-62</strong> — duyệt xuôi, <code>printf("%d ", a[i]);</code>. Để ý dấu cách ở cuối chuỗi định dạng: chính nó tách các con số ra.</li>
<li><strong><code>printEven(int *a, int n)</code>, dòng 64-72</strong> — vẫn vòng lặp ấy cộng thêm câu <code>if</code> tuỳ chọn của slide 12: <code>if (a[i] % 2 == 0) printf("%d ", a[i]);</code>.</li>
<li><strong>Bốn hàm, một bộ xương</strong> — <code>for (i = 0; i &lt; n; i++) { … }</code>. Thuộc bộ xương thì có cả bốn; học thuộc riêng lẻ bốn cái thì sẽ quên.</li>
</ul>
<pre><code>void input(int *a, int n) {
    int i;
    for (i = 0; i &lt; n; i++) { scanf("%d", &amp;a[i]); }
}
int max(int a[], int n) {
    int result = a[0];           /* mo dau bang phan tu DAU TIEN */
    int i;
    for (i = 0; i &lt; n; i++) { if (result &lt; a[i]) { result = a[i]; } }
    return result;
}
void print(int *a, int n) {
    int i;
    for (i = 0; i &lt; n; i++) { printf("%d ", a[i]); }
}
void printEven(int *a, int n) {
    int i;
    for (i = 0; i &lt; n; i++) { if (a[i] % 2 == 0) { printf("%d ", a[i]); } }
}</code></pre>
<p class="dap-an">✅ Bốn thân hàm này ghép với <code>main</code> của slide 15 đã được biên dịch bằng <code>cc -Wall</code> (không cảnh báo nào) và chạy trên <code>3 5 8 1 2 0</code>: lớn nhất <strong>8</strong>, mảng in ra <strong>3 5 8 1 2 0</strong>, số chẵn <strong>8 2 0</strong>. Tôi chạy thêm <code>max</code> trên mảng toàn số âm <code>-4 -9 -2</code>: bản của slide trả về đúng <strong>−2</strong>, còn bản viết <code>result = 0</code> trả về 0 — một con số chưa từng xuất hiện trong dữ liệu.</p>
<p class="meo">💡 <code>max</code> có thể bắt đầu vòng lặp từ <code>i = 1</code> thay vì <code>i = 0</code>, vì so <code>a[0]</code> với chính nó là việc thừa — và đó đúng là cách bài Solution của chính trường viết ở slide 20 (<code>for (int i = 1; i &lt; n; i++)</code>). Cả hai đều đúng; dạng <code>i = 1</code> là dạng nên nêu nếu giám khảo hỏi bản hiệu quả.</p>`],

      [17, 'Array Function Parameter: Demo 1 — Problems & Solution',
        `<p class="y-chinh">🎯 The slide turns around and criticises the program it just wrote. Two problems, and they are two halves of the same mistake: <code>int a[MAXN]</code> forces you to guess the size before you know it.</p>
<ul>
<li><strong>Problem 1 — waste.</strong> "If you allocate an array having 100 elements but 6 elements are used then memory is wasted." 100 × 4 = 400 bytes reserved, 24 used, 376 idle for the whole life of the function. On one array it is nothing; in a program with thousands of such arrays it is the difference between running and not.</li>
<li><strong>Problem 2 — shortage.</strong> "If you allocate 100 but 101 are used then there is a lack of memory." And there is no polite failure: writing <code>a[100]</code> on <code>int a[100]</code> is the out-of-bounds write from slide 6, which silently corrupts a neighbour. Demo 1 papers over it with the <code>do…while (n &gt; MAXN)</code> guard, i.e. by refusing the user.</li>
<li><strong>The trade-off has no good answer</strong> — a bigger <code>MAXN</code> wastes more; a smaller one refuses more users. Any fixed number is wrong for somebody, because the right number is only known at run time.</li>
<li><strong>Solution: use a dynamic array</strong> — allocate on the heap <em>after</em> reading <code>n</code>, so the block is exactly <code>n</code> elements. Slide 8 already gave the tool: <code>calloc(n, sizeof(int))</code>.</li>
<li><strong>"Can expand the size of the original array"</strong> — the second half of the solution, and the more interesting one: <code>realloc</code> can grow the block <em>after</em> it already holds data, preserving what is in it. Slides 18-20 build exactly this.</li>
<li><strong>What you give up</strong> — you must check the returned pointer for <code>NULL</code>, and you must <code>free()</code> at the end. The compiler will not remind you of either.</li>
</ul>
<p class="meo">💡 The exam-ready way to state this slide: <em>a static array fixes the size at compile time, so it is either too big or too small; a dynamic array fixes the size at run time, so it is exactly right — at the cost of NULL-checking and freeing.</em> Those two sentences answer almost every "compare static and dynamic arrays" question.</p>`,
        `<p class="y-chinh">🎯 Slide quay lại phê bình chính chương trình vừa viết. Hai vấn đề, và chúng là hai nửa của cùng một sai lầm: <code>int a[MAXN]</code> bắt bạn phải đoán kích thước trước khi biết nó.</p>
<ul>
<li><strong>Vấn đề 1 — lãng phí.</strong> "Cấp phát mảng 100 phần tử mà chỉ dùng 6 thì thừa bộ nhớ." 100 × 4 = 400 byte bị giữ, dùng 24 byte, 376 byte nằm không suốt vòng đời của hàm. Với một mảng thì chẳng sao; với chương trình có hàng nghìn mảng như thế thì đó là ranh giới giữa chạy được và không.</li>
<li><strong>Vấn đề 2 — thiếu chỗ.</strong> "Cấp phát 100 mà dùng tới 101 thì thiếu bộ nhớ." Và nó không hỏng một cách lịch sự: ghi vào <code>a[100]</code> trên <code>int a[100]</code> chính là lệnh ghi ra ngoài biên ở slide 6, âm thầm phá hỏng ô hàng xóm. Demo 1 che chuyện này bằng chốt <code>do…while (n &gt; MAXN)</code>, tức là bằng cách từ chối người dùng.</li>
<li><strong>Bài toán đánh đổi này không có đáp án đẹp</strong> — <code>MAXN</code> lớn thì phí nhiều; nhỏ thì từ chối nhiều người hơn. Mọi con số cố định đều sai với một ai đó, vì con số đúng chỉ biết được lúc chạy.</li>
<li><strong>Giải pháp: dùng mảng động</strong> — cấp phát trên heap <em>sau khi</em> đã đọc <code>n</code>, để khối có đúng <code>n</code> phần tử. Slide 8 đã đưa sẵn công cụ: <code>calloc(n, sizeof(int))</code>.</li>
<li><strong>"Có thể mở rộng kích thước mảng ban đầu"</strong> — nửa sau của giải pháp, và là nửa thú vị hơn: <code>realloc</code> nới được khối <em>sau khi</em> nó đã chứa dữ liệu, mà vẫn giữ nguyên dữ liệu đang có. Slide 18-20 dựng đúng chuyện này.</li>
<li><strong>Cái bạn phải đánh đổi</strong> — phải kiểm con trỏ trả về có <code>NULL</code> không, và phải <code>free()</code> khi xong. Trình biên dịch sẽ không nhắc bạn cả hai việc đó.</li>
</ul>
<p class="meo">💡 Cách phát biểu slide này để đi thi: <em>mảng tĩnh chốt kích thước lúc biên dịch nên nó hoặc quá to hoặc quá nhỏ; mảng động chốt kích thước lúc chạy nên nó vừa khít — đổi lại phải kiểm NULL và phải giải phóng.</em> Hai câu đó trả lời được gần như mọi đề "so sánh mảng tĩnh và mảng động".</p>`],

      [18, 'Array Funtion Parameter: Solution — Use Dynamic Array',
        `<p class="y-chinh">🎯 The rewrite, lines 1-28. Compare it with slide 15 line by line: the <em>only</em> structural change is <code>int a[MAXN];</code> → <code>int *a;</code> plus one <code>calloc</code> call placed <strong>after</strong> <code>n</code> is read. Everything downstream is untouched.</p>
<ul>
<li><strong>Line 12 — <code>int *a;</code> "// dynamic array"</strong>. A pointer, currently pointing nowhere. No memory has been reserved yet, and that is the point.</li>
<li><strong>Lines 16-19 — read <code>n</code> first</strong>, with the same <code>do…while (n &lt; 1 || n &gt; MAXN)</code> guard. <code>MAXN</code> survives as an upper sanity limit, not as the allocation size.</li>
<li><strong>Line 21 — <code>a = (int *)calloc(n, sizeof(int));</code></strong>. The block is exactly <code>n</code> elements, decided at run time. Both problems of slide 17 disappear at once: nothing is wasted, and nothing is refused up to <code>MAXN</code>.</li>
<li><strong>Lines 22-25 — the NULL check</strong>, with <code>return 1;</code> (not just a <code>printf</code>, as on slide 8). A non-zero exit status is how a C program reports failure to whatever launched it.</li>
<li><strong>Lines 6-9 — the prototypes gained <code>const</code></strong>: <code>int max(const int *a, int n)</code>, <code>void print(const int *a, int n)</code>, <code>void printEven(const int *a, int n)</code>, while <code>input</code> stays plain <code>int *a</code>. That is a precise statement of intent: <em>input writes to the array, the other three only read it</em>. The compiler now rejects an accidental write inside those three.</li>
<li><strong>Line 28 — <code>input(a, n);</code> is unchanged</strong>. A dynamic array is passed to a function exactly like a static one, because slide 13 showed the function receives a pointer either way.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#define MAXN 100

/* Prototypes */
void input(int *a, int n);
int  max(const int *a, int n);
void print(const int *a, int n);
void printEven(const int *a, int n);

int main() {
    int *a;        /* dynamic array                */
    int n;         /* real used number of elements */
    int maxVal;

    do {
        printf("How many elements will be used (1 ... %d): ", MAXN);
        scanf("%d", &amp;n);
    } while (n &lt; 1 || n &gt; MAXN);

    a = (int *)calloc(n, sizeof(int));
    if (a == NULL) { printf("Memory allocation failed!\\n"); return 1; }

    printf("Enter %d values of the array:\\n", n);
    input(a, n);
    /* … tiep tuc o slide 19 … */</code></pre>
<p class="dap-an">✅ This half compiles clean under <code>cc -Wall</code> and, joined with slides 19-20, runs to the console of slide 21. Measured difference against Demo 1 with <code>n = 6</code>: the static version reserves <strong>400 bytes</strong> on the stack (<code>100 * 4</code>) of which 24 are used; this version reserves exactly <strong>24 bytes</strong> on the heap. Same output, one sixteenth of the memory.</p>
<p class="meo">💡 <code>const</code> on a pointer parameter is free documentation that the compiler enforces. When you write an array function, ask "does this function change the array?" — if no, write <code>const</code>. It costs nothing at run time and turns a whole class of typos (<code>=</code> instead of <code>==</code> inside the loop) into compile errors.</p>`,
        `<p class="y-chinh">🎯 Bản viết lại, dòng 1-28. Hãy so với slide 15 từng dòng: thay đổi cấu trúc <em>duy nhất</em> là <code>int a[MAXN];</code> → <code>int *a;</code> cộng một lời gọi <code>calloc</code> đặt <strong>sau khi</strong> đọc xong <code>n</code>. Mọi thứ phía sau giữ nguyên.</p>
<ul>
<li><strong>Dòng 12 — <code>int *a;</code> "// mảng động"</strong>. Một con trỏ, hiện chưa trỏ đi đâu cả. Chưa có byte bộ nhớ nào bị giữ chỗ, và đó chính là chủ ý.</li>
<li><strong>Dòng 16-19 — đọc <code>n</code> trước</strong>, vẫn với chốt <code>do…while (n &lt; 1 || n &gt; MAXN)</code>. <code>MAXN</code> sống sót với vai trò giới hạn hợp lý phía trên, chứ không còn là kích thước cấp phát.</li>
<li><strong>Dòng 21 — <code>a = (int *)calloc(n, sizeof(int));</code></strong>. Khối có đúng <code>n</code> phần tử, quyết định lúc chạy. Cả hai vấn đề của slide 17 biến mất cùng lúc: không phí gì, và không từ chối ai cho tới <code>MAXN</code>.</li>
<li><strong>Dòng 22-25 — kiểm NULL</strong>, kèm <code>return 1;</code> (chứ không chỉ <code>printf</code> như ở slide 8). Mã thoát khác 0 là cách một chương trình C báo thất bại cho thứ đã khởi chạy nó.</li>
<li><strong>Dòng 6-9 — các nguyên mẫu được thêm <code>const</code></strong>: <code>int max(const int *a, int n)</code>, <code>void print(const int *a, int n)</code>, <code>void printEven(const int *a, int n)</code>, riêng <code>input</code> vẫn là <code>int *a</code> trần. Đó là một lời tuyên bố ý định rất chính xác: <em>input GHI vào mảng, ba hàm kia chỉ ĐỌC</em>. Từ nay trình biên dịch sẽ bác bỏ mọi lệnh ghi lỡ tay trong ba hàm đó.</li>
<li><strong>Dòng 28 — <code>input(a, n);</code> không đổi một chữ</strong>. Mảng động truyền vào hàm y hệt mảng tĩnh, vì slide 13 đã chỉ ra rằng đằng nào hàm cũng chỉ nhận một con trỏ.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#define MAXN 100

/* Prototypes */
void input(int *a, int n);
int  max(const int *a, int n);
void print(const int *a, int n);
void printEven(const int *a, int n);

int main() {
    int *a;        /* mang dong                */
    int n;         /* so phan tu thuc dung     */
    int maxVal;

    do {
        printf("How many elements will be used (1 ... %d): ", MAXN);
        scanf("%d", &amp;n);
    } while (n &lt; 1 || n &gt; MAXN);

    a = (int *)calloc(n, sizeof(int));
    if (a == NULL) { printf("Memory allocation failed!\\n"); return 1; }

    printf("Enter %d values of the array:\\n", n);
    input(a, n);
    /* … tiep tuc o slide 19 … */</code></pre>
<p class="dap-an">✅ Nửa này dịch sạch dưới <code>cc -Wall</code> và khi ghép với slide 19-20 thì chạy ra đúng khung console của slide 21. Chênh lệch đo được so với Demo 1 khi <code>n = 6</code>: bản tĩnh giữ <strong>400 byte</strong> trên stack (<code>100 * 4</code>) mà chỉ dùng 24; bản này giữ đúng <strong>24 byte</strong> trên heap. Cùng một kết quả, một phần mười sáu bộ nhớ.</p>
<p class="meo">💡 <code>const</code> đặt trên tham số con trỏ là lời chú thích miễn phí mà trình biên dịch ÉP thực thi. Khi viết một hàm xử lý mảng, hãy tự hỏi "hàm này có đổi mảng không?" — nếu không thì viết <code>const</code>. Nó không tốn gì lúc chạy và biến cả một lớp lỗi gõ nhầm (<code>=</code> thay vì <code>==</code> trong vòng lặp) thành lỗi biên dịch.</p>`],

      [19, 'Solution (cont.) — Expand the size of the original array',
        `<p class="y-chinh">🎯 Lines 30-63: after printing the results, the program offers to <strong>grow the array</strong>, and this is where <code>realloc</code> earns its place. A static array could never do this.</p>
<ul>
<li><strong>Lines 30-37 — the same four verbs as Demo 1</strong>: <code>max(a, n)</code>, <code>print(a, n)</code>, <code>printEven(a, n)</code>. Nothing about them changed when the array moved to the heap.</li>
<li><strong>Lines 40-42 — ask for the new size</strong> into <code>int newSize</code>, with the prompt "Enter new size for the array (greater than <code>%d</code>)".</li>
<li><strong>Line 44 — <code>if (newSize &gt; n)</code></strong>: growth only. The <code>else</code> on line 57-58 prints "New size must be greater than the current size" — so the program has a defined answer for the bad case instead of doing something surprising.</li>
<li><strong>Line 45 — <code>a = (int *)realloc(a, newSize * sizeof(int));</code></strong>. <code>realloc</code> keeps the existing contents and returns a block of the new size — possibly at a <em>different address</em>, which is why the result must be assigned back to <code>a</code>.</li>
<li><strong>Lines 46-50 — the failure path frees first</strong>: <code>if (a == NULL) { printf("Reallocation failed!\\n"); free(a); return 1; }</code>. Note a subtlety the slide glides over: if <code>realloc</code> fails it returns <code>NULL</code> but the <em>old</em> block is still allocated — and since <code>a</code> was overwritten with <code>NULL</code>, its address is lost. <code>free(NULL)</code> is legal and does nothing, so this code leaks. The robust idiom is <code>int *tmp = realloc(a, …); if (tmp == NULL) { free(a); return 1; } a = tmp;</code>.</li>
<li><strong>Lines 51-56 — fill only the new tail</strong>: <code>input(a + n, newSize - n);</code>. This is the cleverest line on the slide. <code>a + n</code> is the address of the first <em>new</em> box, and <code>newSize - n</code> is how many there are. The same <code>input</code> function, aimed at a sub-range.</li>
<li><strong>Line 61 — <code>free(a);</code></strong>, the obligation that came with the heap.</li>
</ul>
<pre><code>    maxVal = max(a, n);
    printf("\\nMax value: %d\\n", maxVal);
    printf("\\nInputted array: ");       print(a, n);
    printf("\\nEven values in array: "); printEven(a, n);

    /* Allow user to resize array */
    int newSize;
    printf("\\n\\nEnter new size for the array (greater than %d): ", n);
    scanf("%d", &amp;newSize);

    if (newSize &gt; n) {
        a = (int *)realloc(a, newSize * sizeof(int));
        if (a == NULL) { printf("Reallocation failed!\\n"); return 1; }
        printf("Enter %d additional values:\\n", newSize - n);
        input(a + n, newSize - n);      /* chi nhap phan MOI them */
        n = newSize;
        printf("\\nUpdated array: ");    print(a, n);
    } else {
        printf("New size must be greater than the current size (%d).\\n", n);
    }
    free(a);                            /* Free allocated memory */
    return 0;
}</code></pre>
<p class="dap-an">✅ Compiled and run with the slide's own data (6 · <code>3 5 8 1 2 0</code> · new size 10 · <code>12 9 7 6</code>): <strong><code>Updated array: 3 5 8 1 2 0 12 9 7 6</code></strong>. The first six values survived the <code>realloc</code> untouched and the four new ones landed exactly at indexes 6-9, which is what <code>input(a + n, newSize - n)</code> was for.</p>
<p class="pitfall">⚠️ Two <code>realloc</code> facts that are examined and misremembered. (1) The returned block <em>may be at a new address</em> — any other pointer you kept into the old block is now dangling. Always use the returned value. (2) <code>realloc</code> preserves only <code>min(old, new)</code> elements; shrinking throws the tail away. And <code>realloc</code> does <strong>not</strong> zero the new tail — unlike <code>calloc</code> — which is why the program immediately asks the user to fill it.</p>`,
        `<p class="y-chinh">🎯 Dòng 30-63: sau khi in kết quả, chương trình mời người dùng <strong>nới rộng mảng</strong>, và đây là chỗ <code>realloc</code> chứng minh giá trị của nó. Mảng tĩnh không bao giờ làm được việc này.</p>
<ul>
<li><strong>Dòng 30-37 — vẫn bốn động từ như Demo 1</strong>: <code>max(a, n)</code>, <code>print(a, n)</code>, <code>printEven(a, n)</code>. Không có gì trong chúng đổi khi mảng dời sang heap.</li>
<li><strong>Dòng 40-42 — hỏi kích thước mới</strong> vào <code>int newSize</code>, với lời nhắc "Enter new size for the array (greater than <code>%d</code>)".</li>
<li><strong>Dòng 44 — <code>if (newSize &gt; n)</code></strong>: chỉ cho phép nới rộng. Nhánh <code>else</code> ở dòng 57-58 in "New size must be greater than the current size" — nghĩa là chương trình có câu trả lời xác định cho trường hợp xấu, thay vì làm một chuyện bất ngờ.</li>
<li><strong>Dòng 45 — <code>a = (int *)realloc(a, newSize * sizeof(int));</code></strong>. <code>realloc</code> giữ nguyên nội dung đang có và trả về một khối kích thước mới — có thể ở một <em>địa chỉ khác</em>, đó là lý do kết quả bắt buộc phải gán ngược lại vào <code>a</code>.</li>
<li><strong>Dòng 46-50 — nhánh hỏng có gọi free trước</strong>: <code>if (a == NULL) { printf("Reallocation failed!\\n"); free(a); return 1; }</code>. Có một chỗ tinh vi mà slide lướt qua: nếu <code>realloc</code> thất bại, nó trả <code>NULL</code> nhưng khối <em>cũ</em> VẪN còn được cấp phát — mà <code>a</code> vừa bị ghi đè bằng <code>NULL</code> nên địa chỉ khối cũ mất dấu. <code>free(NULL)</code> là hợp lệ và không làm gì cả, nên đoạn này rò rỉ bộ nhớ. Lối viết chắc chắn là <code>int *tmp = realloc(a, …); if (tmp == NULL) { free(a); return 1; } a = tmp;</code>.</li>
<li><strong>Dòng 51-56 — chỉ nhập phần đuôi mới</strong>: <code>input(a + n, newSize - n);</code>. Đây là dòng khéo nhất trên slide. <code>a + n</code> là địa chỉ ô <em>mới</em> đầu tiên, còn <code>newSize - n</code> là số ô mới. Vẫn hàm <code>input</code> ấy, chỉ nhắm vào một đoạn con.</li>
<li><strong>Dòng 61 — <code>free(a);</code></strong>, nghĩa vụ đi kèm với heap.</li>
</ul>
<pre><code>    maxVal = max(a, n);
    printf("\\nMax value: %d\\n", maxVal);
    printf("\\nInputted array: ");       print(a, n);
    printf("\\nEven values in array: "); printEven(a, n);

    /* Cho phep nguoi dung doi kich thuoc mang */
    int newSize;
    printf("\\n\\nEnter new size for the array (greater than %d): ", n);
    scanf("%d", &amp;newSize);

    if (newSize &gt; n) {
        a = (int *)realloc(a, newSize * sizeof(int));
        if (a == NULL) { printf("Reallocation failed!\\n"); return 1; }
        printf("Enter %d additional values:\\n", newSize - n);
        input(a + n, newSize - n);      /* chi nhap phan MOI them */
        n = newSize;
        printf("\\nUpdated array: ");    print(a, n);
    } else {
        printf("New size must be greater than the current size (%d).\\n", n);
    }
    free(a);                            /* giai phong bo nho */
    return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch và chạy với đúng dữ liệu của slide (6 · <code>3 5 8 1 2 0</code> · kích thước mới 10 · <code>12 9 7 6</code>): <strong><code>Updated array: 3 5 8 1 2 0 12 9 7 6</code></strong>. Sáu giá trị đầu sống sót nguyên vẹn qua <code>realloc</code> và bốn giá trị mới rơi đúng vào chỉ số 6-9, đúng như mục đích của <code>input(a + n, newSize - n)</code>.</p>
<p class="pitfall">⚠️ Hai sự thật về <code>realloc</code> hay bị hỏi và hay nhớ sai. (1) Khối trả về <em>có thể nằm ở địa chỉ mới</em> — mọi con trỏ khác mà bạn còn giữ vào khối cũ nay đều treo lơ lửng. Luôn dùng giá trị trả về. (2) <code>realloc</code> chỉ giữ lại <code>min(cũ, mới)</code> phần tử; thu nhỏ là vứt phần đuôi. Và <code>realloc</code> <strong>không</strong> đặt 0 cho phần đuôi mới — khác <code>calloc</code> — đó là lý do chương trình lập tức bảo người dùng nhập đầy nó.</p>`],

      [20, 'Solution (cont.) — the four functions rewritten with pointer arithmetic',
        `<p class="y-chinh">🎯 Lines 65-97: the same four functions as slide 16, but every element access is written as <strong><code>*(a + i)</code></strong> instead of <code>a[i]</code>. The slide labels each one "<em>// Use pointer arithmetic</em>" — this is deliberate practice, not a different algorithm.</p>
<ul>
<li><strong><code>input</code>, lines 67-71</strong> — <code>scanf("%d", a + i);</code>. Look closely: there is <strong>no <code>&amp;</code></strong>, because <code>a + i</code> is already an address. Writing <code>scanf("%d", &amp;(a+i))</code> would be an error, and <code>scanf("%d", &amp;a[i])</code> is the equivalent bracket form.</li>
<li><strong><code>max</code>, lines 73-81</strong> — <code>int result = *a;</code> ("dereference pointer to get the first value" — the same as <code>a[0]</code>), then <code>for (int i = 1; i &lt; n; i++) if (result &lt; *(a + i)) result = *(a + i);</code>. Note it starts at <strong>i = 1</strong>, the efficient form mentioned on slide 16.</li>
<li><strong><code>print</code>, lines 83-88</strong> — <code>printf("%d ", *(a + i));</code> then a <code>printf("\\n")</code> after the loop.</li>
<li><strong><code>printEven</code>, lines 90-97</strong> — <code>if (*(a + i) % 2 == 0) printf("%d ", *(a + i));</code>. Precedence matters here: <code>*(a + i) % 2</code> dereferences first, then takes the remainder, because unary <code>*</code> binds tighter than <code>%</code>.</li>
<li><strong>Why learn both notations</strong> — they compile to identical machine code, so this is not about speed. It is about reading other people's C, and about the moment in Slot 16-18 when you walk a string with <code>*(s + i)</code> or <code>*s++</code> and the bracket form stops being natural.</li>
<li><strong>The parameters are <code>const int *a</code></strong> in three of the four — the compiler now guarantees that <code>max</code>, <code>print</code> and <code>printEven</code> cannot modify the caller's array, which is the one risk that came with array decay.</li>
</ul>
<pre><code>/* Function definitions */
void input(int *a, int n) {
    for (int i = 0; i &lt; n; i++) { scanf("%d", a + i); }         /* KHONG co &amp; */
}
int max(const int *a, int n) {
    int result = *a;                                            /* = a[0] */
    for (int i = 1; i &lt; n; i++) {
        if (result &lt; *(a + i)) { result = *(a + i); }
    }
    return result;
}
void print(const int *a, int n) {
    for (int i = 0; i &lt; n; i++) { printf("%d ", *(a + i)); }
    printf("\\n");
}
void printEven(const int *a, int n) {
    for (int i = 0; i &lt; n; i++) {
        if (*(a + i) % 2 == 0) { printf("%d ", *(a + i)); }
    }
    printf("\\n");
}</code></pre>
<p class="dap-an">✅ The whole Solution (slides 18 + 19 + 20) compiles under <code>cc -Wall</code> with no warnings and produces, for input <code>6</code> / <code>3 5 8 1 2 0</code> / <code>10</code> / <code>12 9 7 6</code>: <code>Max value: 8</code> · <code>Inputted array: 3 5 8 1 2 0</code> · <code>Even values in array: 8 2 0</code> · <code>Updated array: 3 5 8 1 2 0 12 9 7 6</code> — identical results to the bracket version of slide 16, as expected.</p>
<p class="meo">💡 A translation rule you can apply mechanically in both directions: <code>a[i] ⇔ *(a + i)</code> and <code>&amp;a[i] ⇔ a + i</code>. If an exam gives you pointer-style code and asks what it prints, rewrite every <code>*(a + i)</code> as <code>a[i]</code> in the margin first — the logic usually becomes obvious in one pass.</p>`,
        `<p class="y-chinh">🎯 Dòng 65-97: vẫn bốn hàm như slide 16, nhưng mọi lần truy cập phần tử đều viết bằng <strong><code>*(a + i)</code></strong> thay cho <code>a[i]</code>. Slide ghi chú từng chỗ "<em>// Use pointer arithmetic</em>" — đây là bài luyện tập có chủ ý, không phải thuật toán khác.</p>
<ul>
<li><strong><code>input</code>, dòng 67-71</strong> — <code>scanf("%d", a + i);</code>. Nhìn kỹ: <strong>không có dấu <code>&amp;</code></strong>, vì <code>a + i</code> vốn đã là một địa chỉ. Viết <code>scanf("%d", &amp;(a+i))</code> là sai, còn <code>scanf("%d", &amp;a[i])</code> mới là dạng ngoặc vuông tương đương.</li>
<li><strong><code>max</code>, dòng 73-81</strong> — <code>int result = *a;</code> ("lấy giá trị con trỏ để có phần tử đầu" — chính là <code>a[0]</code>), rồi <code>for (int i = 1; i &lt; n; i++) if (result &lt; *(a + i)) result = *(a + i);</code>. Để ý nó bắt đầu từ <strong>i = 1</strong>, đúng dạng hiệu quả đã nhắc ở slide 16.</li>
<li><strong><code>print</code>, dòng 83-88</strong> — <code>printf("%d ", *(a + i));</code> rồi một lệnh <code>printf("\\n")</code> sau vòng lặp.</li>
<li><strong><code>printEven</code>, dòng 90-97</strong> — <code>if (*(a + i) % 2 == 0) printf("%d ", *(a + i));</code>. Thứ tự ưu tiên toán tử quan trọng ở đây: <code>*(a + i) % 2</code> lấy giá trị trước rồi mới chia lấy dư, vì toán tử một ngôi <code>*</code> gắn chặt hơn <code>%</code>.</li>
<li><strong>Vì sao phải học cả hai lối viết</strong> — chúng dịch ra mã máy y hệt nhau, nên chuyện này không liên quan tới tốc độ. Nó liên quan tới việc đọc mã C của người khác, và tới khoảnh khắc ở Slot 16-18 khi bạn đi trên một chuỗi bằng <code>*(s + i)</code> hay <code>*s++</code>, lúc đó dạng ngoặc vuông không còn tự nhiên nữa.</li>
<li><strong>Tham số là <code>const int *a</code></strong> ở ba trong bốn hàm — trình biên dịch nay bảo đảm <code>max</code>, <code>print</code> và <code>printEven</code> không thể sửa mảng của nơi gọi, tức là chặn đúng cái rủi ro đi kèm với hiện tượng suy biến mảng.</li>
</ul>
<pre><code>/* Dinh nghia cac ham */
void input(int *a, int n) {
    for (int i = 0; i &lt; n; i++) { scanf("%d", a + i); }         /* KHONG co &amp; */
}
int max(const int *a, int n) {
    int result = *a;                                            /* = a[0] */
    for (int i = 1; i &lt; n; i++) {
        if (result &lt; *(a + i)) { result = *(a + i); }
    }
    return result;
}
void print(const int *a, int n) {
    for (int i = 0; i &lt; n; i++) { printf("%d ", *(a + i)); }
    printf("\\n");
}
void printEven(const int *a, int n) {
    for (int i = 0; i &lt; n; i++) {
        if (*(a + i) % 2 == 0) { printf("%d ", *(a + i)); }
    }
    printf("\\n");
}</code></pre>
<p class="dap-an">✅ Toàn bộ bài Solution (slide 18 + 19 + 20) dịch được dưới <code>cc -Wall</code> không một cảnh báo và cho ra, với dữ liệu vào <code>6</code> / <code>3 5 8 1 2 0</code> / <code>10</code> / <code>12 9 7 6</code>: <code>Max value: 8</code> · <code>Inputted array: 3 5 8 1 2 0</code> · <code>Even values in array: 8 2 0</code> · <code>Updated array: 3 5 8 1 2 0 12 9 7 6</code> — kết quả giống hệt bản dùng ngoặc vuông ở slide 16, đúng như dự đoán.</p>
<p class="meo">💡 Một quy tắc dịch bạn áp dụng máy móc được theo cả hai chiều: <code>a[i] ⇔ *(a + i)</code> và <code>&amp;a[i] ⇔ a + i</code>. Nếu đề thi đưa mã viết theo lối con trỏ và hỏi nó in ra gì, hãy chép lại mọi <code>*(a + i)</code> thành <code>a[i]</code> ra lề giấy trước — phần lớn trường hợp logic sẽ hiện ra ngay trong một lượt đọc.</p>`],

      [21, 'Output Solution',
        `<p class="y-chinh">🎯 One full-screen console: the acceptance test of the Solution. Every line on it is a claim about the program, and each one can be checked against a specific line of code from slides 18-20.</p>
<ul>
<li><strong><code>How many elements will be used (1 ... 100): 6</code></strong> — the <code>do…while</code> prompt from slide 18 line 17. The user answered 6, inside the range, so it asked once.</li>
<li><strong><code>Enter 6 values of the array:</code> then <code>3 5 8 1 2 0</code></strong> — <code>input(a, n)</code> reading six integers with <code>scanf("%d", a + i)</code>. The six values are typed on one line; <code>scanf("%d")</code> skips whitespace, so line breaks and spaces are equivalent.</li>
<li><strong><code>Max value: 8</code></strong> — <code>max(a, 6)</code>. Check it by hand: 3, 5, 8, 1, 2, 0 → the largest is 8.</li>
<li><strong><code>Inputted array: 3 5 8 1 2 0</code></strong> — <code>print(a, 6)</code>, the values in entry order. An array preserves order; that is the "ordered set" in the definition on slide 5.</li>
<li><strong><code>Even values in array: 8 2 0</code></strong> — <code>printEven(a, 6)</code>. Three values, because <strong>0 is even</strong>. This is the most common misreading of this console.</li>
<li><strong><code>Enter new size for the array (greater than 6): 10</code> → <code>Enter 4 additional values:</code> → <code>12 9 7 6</code></strong> — <code>realloc</code> to 10, then <code>input(a + 6, 4)</code>. The program asks for <em>four</em>, not ten, which is the visible proof that <code>a + n</code> aimed the same function at the new tail only.</li>
<li><strong><code>Updated array: 3 5 8 1 2 0 12 9 7 6</code></strong> — the payoff. The first six values are still there, in place, after the block was reallocated; the four new ones follow. If <code>realloc</code> had not preserved the contents, this line would start with garbage.</li>
</ul>
<p class="dap-an">✅ I compiled slides 18+19+20 into one file with <code>cc -Wall</code> and fed it exactly this input (<code>6</code> ⏎ <code>3 5 8 1 2 0</code> ⏎ <code>10</code> ⏎ <code>12 9 7 6</code>). The program printed <code>Max value: 8</code>, <code>Inputted array: 3 5 8 1 2 0</code>, <code>Even values in array: 8 2 0</code>, <code>Enter 4 additional values:</code> and <code>Updated array: 3 5 8 1 2 0 12 9 7 6</code> — <strong>every line matches the slide</strong>. The school's console is genuine output, not a mock-up.</p>
<p class="meo">💡 Get into the habit of reading a console screenshot as a <em>test case</em>: write the input on the left, the expected output on the right, and run your own code against it before you look at the answer. In the PE you will be given exactly this — a sample run — and matching it character for character (including spaces and blank lines) is often part of the grading.</p>`,
        `<p class="y-chinh">🎯 Một khung console chiếm cả màn hình: bài kiểm nghiệm thu của lời giải. Mỗi dòng trên đó là một khẳng định về chương trình, và dòng nào cũng đối chiếu được với một dòng mã cụ thể ở slide 18-20.</p>
<ul>
<li><strong><code>How many elements will be used (1 ... 100): 6</code></strong> — lời nhắc của <code>do…while</code> ở slide 18 dòng 17. Người dùng đáp 6, nằm trong khoảng, nên nó chỉ hỏi một lần.</li>
<li><strong><code>Enter 6 values of the array:</code> rồi <code>3 5 8 1 2 0</code></strong> — <code>input(a, n)</code> đọc sáu số nguyên bằng <code>scanf("%d", a + i)</code>. Sáu giá trị gõ trên cùng một dòng; <code>scanf("%d")</code> bỏ qua khoảng trắng nên xuống dòng hay dấu cách đều như nhau.</li>
<li><strong><code>Max value: 8</code></strong> — <code>max(a, 6)</code>. Kiểm bằng tay: 3, 5, 8, 1, 2, 0 → lớn nhất là 8.</li>
<li><strong><code>Inputted array: 3 5 8 1 2 0</code></strong> — <code>print(a, 6)</code>, các giá trị theo đúng thứ tự nhập. Mảng giữ nguyên thứ tự; đó chính là cụm "tập có thứ tự" trong định nghĩa ở slide 5.</li>
<li><strong><code>Even values in array: 8 2 0</code></strong> — <code>printEven(a, 6)</code>. Ba giá trị, vì <strong>0 là số chẵn</strong>. Đây là chỗ khung console này hay bị đọc sai nhất.</li>
<li><strong><code>Enter new size for the array (greater than 6): 10</code> → <code>Enter 4 additional values:</code> → <code>12 9 7 6</code></strong> — <code>realloc</code> lên 10, rồi <code>input(a + 6, 4)</code>. Chương trình hỏi <em>bốn</em> giá trị chứ không phải mười, đó là bằng chứng nhìn thấy được rằng <code>a + n</code> đã nhắm đúng hàm ấy vào riêng phần đuôi mới.</li>
<li><strong><code>Updated array: 3 5 8 1 2 0 12 9 7 6</code></strong> — thành quả. Sáu giá trị đầu vẫn còn nguyên, đúng chỗ, sau khi khối nhớ đã được cấp phát lại; bốn giá trị mới nối tiếp theo sau. Nếu <code>realloc</code> không giữ nội dung thì dòng này đã mở đầu bằng rác.</li>
</ul>
<p class="dap-an">✅ Tôi đã ghép slide 18+19+20 thành một tệp, biên dịch bằng <code>cc -Wall</code> và đưa vào đúng dữ liệu này (<code>6</code> ⏎ <code>3 5 8 1 2 0</code> ⏎ <code>10</code> ⏎ <code>12 9 7 6</code>). Chương trình in ra <code>Max value: 8</code>, <code>Inputted array: 3 5 8 1 2 0</code>, <code>Even values in array: 8 2 0</code>, <code>Enter 4 additional values:</code> và <code>Updated array: 3 5 8 1 2 0 12 9 7 6</code> — <strong>khớp từng dòng với slide</strong>. Khung console của trường là kết quả chạy thật, không phải hình dựng.</p>
<p class="meo">💡 Hãy tập thói quen đọc một ảnh chụp console như một <em>ca kiểm thử</em>: ghi dữ liệu vào ở bên trái, kết quả mong đợi ở bên phải, rồi chạy mã của mình đối chiếu trước khi nhìn đáp án. Trong bài PE bạn sẽ được cho đúng thứ này — một lần chạy mẫu — và khớp nó từng ký tự (kể cả dấu cách và dòng trống) thường là một phần của thang điểm.</p>`],

      [22, 'Exercise 1',
        `<p class="y-chinh">🎯 The exercise, and the slide states precisely what is new: <em>"the input operation can <strong>terminate abruptly</strong> when 0 is accepted"</em>. The user no longer says how many values there will be — the program finds out.</p>
<ul>
<li><strong>The task</strong> — accept values into an integer array of up to 100 elements, stopping when the user enters 0; then print the maximum, all elements, and the even values. The last three are identical to Demo 1.</li>
<li><strong>Requirement 1 — "the memory block needs to be allocated <em>in excess</em>"</strong>. Since nobody knows how many values are coming, you must reserve the worst case <code>MAXN = 100</code> up front. This is the exact weakness slide 17 complained about, accepted here on purpose because the count cannot be asked for in advance.</li>
<li><strong>Requirement 2 — "the input function must be modified, and the number of elements is <strong>updated after each valid value</strong>"</strong>. The counter can no longer be a parameter passed <em>in</em>; it has to be a result passed <em>out</em>.</li>
<li><strong>Which brings back Example 2 of slide 13</strong> — <code>void input(int a[], int *pn)</code>. The array is a pointer because it always was; the <em>count</em> is now a pointer too, because the function must write the final value back into <code>main</code>'s <code>n</code>. This is Slot 10's "pointer as parameter so the function can modify outside data", applied for real.</li>
<li><strong>Why 0 as the terminator</strong> — it is a <em>sentinel</em>: a value that means "stop" rather than "data". The sentinel itself is <strong>not</strong> stored, which is why <code>if (x != 0)</code> guards the assignment.</li>
<li><strong>Two exit conditions, not one</strong> — the loop must stop on the sentinel <em>or</em> when the array is full, otherwise entering 101 values overruns the block. The slide's code uses <code>while (x != 0 &amp;&amp; *pn &lt; MAXN)</code>.</li>
</ul>
<p class="meo">💡 The "sentinel-terminated input" pattern appears again in every later slot — reading a string until <code>'\\0'</code>, reading a file until <code>EOF</code>. The shape is always the same: <em>read · test for the sentinel · if not the sentinel, store and count · repeat.</em> Learn it here where it is only six lines long.</p>`,
        `<p class="y-chinh">🎯 Bài tập, và slide nêu chính xác cái mới: <em>"thao tác nhập có thể <strong>dừng đột ngột</strong> khi nhận được số 0"</em>. Người dùng không còn báo trước sẽ có bao nhiêu giá trị nữa — chương trình phải tự tìm ra.</p>
<ul>
<li><strong>Yêu cầu</strong> — nhận các giá trị vào một mảng số nguyên tối đa 100 phần tử, dừng khi người dùng nhập 0; rồi in giá trị lớn nhất, in toàn bộ phần tử, và in các giá trị chẵn. Ba việc sau giống hệt Demo 1.</li>
<li><strong>Điều kiện 1 — "khối nhớ của mảng cần được cấp phát <em>dư ra</em>"</strong>. Vì không ai biết sẽ có bao nhiêu giá trị, bạn buộc phải giữ trước trường hợp xấu nhất <code>MAXN = 100</code>. Đây đúng là điểm yếu mà slide 17 đã phàn nàn, ở đây được chấp nhận có chủ ý vì không thể hỏi trước số lượng.</li>
<li><strong>Điều kiện 2 — "hàm nhập phải được sửa lại, và số phần tử được <strong>cập nhật sau mỗi giá trị hợp lệ</strong>"</strong>. Bộ đếm không còn là tham số truyền <em>vào</em> được nữa; nó phải là kết quả truyền <em>ra</em>.</li>
<li><strong>Và thế là Ví dụ 2 của slide 13 quay lại</strong> — <code>void input(int a[], int *pn)</code>. Mảng là con trỏ vì vốn nó vẫn thế; còn <em>bộ đếm</em> nay cũng là con trỏ, vì hàm phải ghi giá trị cuối cùng ngược về biến <code>n</code> của <code>main</code>. Đây chính là bài "con trỏ làm tham số để hàm sửa được dữ liệu bên ngoài" của Slot 10, dùng vào việc thật.</li>
<li><strong>Vì sao lấy 0 làm dấu kết thúc</strong> — đó là một <em>sentinel</em> (giá trị canh): một giá trị mang nghĩa "dừng" chứ không phải "dữ liệu". Bản thân giá trị canh <strong>không</strong> được lưu, đó là lý do có chốt <code>if (x != 0)</code> trước lệnh gán.</li>
<li><strong>Hai điều kiện thoát, không phải một</strong> — vòng lặp phải dừng khi gặp giá trị canh <em>hoặc</em> khi mảng đã đầy, nếu không thì nhập 101 giá trị là tràn ra ngoài khối. Mã của slide dùng <code>while (x != 0 &amp;&amp; *pn &lt; MAXN)</code>.</li>
</ul>
<p class="meo">💡 Khuôn mẫu "nhập tới khi gặp giá trị canh" sẽ trở lại ở mọi slot sau — đọc chuỗi tới khi gặp <code>'\\0'</code>, đọc tệp tới khi gặp <code>EOF</code>. Hình dạng luôn giống nhau: <em>đọc · kiểm giá trị canh · nếu không phải thì lưu và đếm · lặp lại.</em> Hãy học nó ở đây, nơi nó chỉ dài sáu dòng.</p>`],

      [23, 'Exercise 1 (cont.) — main() and the console',
        `<p class="y-chinh">🎯 The <code>main()</code> of Exercise 1, lines 2-23, with a small console beside it: input <code>2 3 1 8 9 5 0</code> → <code>Max value:9</code>, <code>Inputted array:2 3 1 8 9 5</code>, <code>Even values in array:2 8</code>.</p>
<ul>
<li><strong>Line 6 — the changed prototype</strong>: <code>void input(int *a, int *pn);</code> with the comment "<em>Input an array, number of elements is stored at pn. User will terminate inputting when 0 is entered.</em>" Compare with lines 7-9: <code>max</code>, <code>print</code> and <code>printEven</code> still take a plain <code>int n</code>, because by then the count is known.</li>
<li><strong>Line 11 — <code>int a[MAXN];</code></strong>, "static array of 100 integers", allocated in excess exactly as requirement 1 demanded.</li>
<li><strong>Line 14 — <code>input(a, &amp;n);</code></strong>. This is the line to remember: the array goes in bare (it is already an address), but <code>n</code> goes in with an <strong><code>&amp;</code></strong>, because the function must write back into it. Getting these two the same way round is the classic error.</li>
<li><strong>Line 13 — <code>int n;</code> is never assigned in <code>main</code></strong>. Its value arrives entirely from inside <code>input</code>. That is only possible through the pointer.</li>
<li><strong>Lines 15-20 — unchanged from Demo 1</strong>: <code>max(a, n)</code>, <code>print(a, n)</code>, <code>printEven(a, n)</code>. Once <code>n</code> is known, everything downstream is the code you already have.</li>
<li><strong>Check the console by hand</strong> — values 2, 3, 1, 8, 9, 5 (the 0 is the terminator and is <em>not</em> stored, so <code>n</code> is 6, not 7). Max = 9. Even values = 2 and 8. This time 0 does <strong>not</strong> appear among the even values, precisely because it was consumed as the sentinel — the contrast with slide 21 is worth a moment.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#define MAXN 100
/* Input an array, number of elements is stored at pn.
   User will terminate inputting when 0 is entered. */
void input(int *a, int *pn);
int  max(int a[], int n);
void print(int *a, int n);
void printEven(int *a, int n);

int main()
{   int a[MAXN];      /* static array of 100 integers */
    int n;            /* real used number of elements */
    int maxVal;
    input(a, &amp;n);                 /* a tran, n co dau &amp; */
    maxVal = max(a, n);
    printf("Max value:%d\\n", maxVal);
    printf("\\nInputted array:");      print(a, n);
    printf("\\nEven values in array:"); printEven(a, n);
    printf("\\n");
    return 0;
}</code></pre>
<p class="dap-an">✅ Compiled with <code>cc -Wall</code> and run with the slide's own input <code>2 3 1 8 9 5 0</code>: <code>Max value:9</code> · <code>Inputted array:2 3 1 8 9 5</code> · <code>Even values in array:2 8</code> — exactly the small console on the slide. <code>n</code> came back as <strong>6</strong>: six values stored, the seventh consumed as the terminator.</p>
<p class="pitfall">⚠️ <code>input(a, &amp;n)</code> versus <code>input(a, n)</code> is a one-character difference that the compiler <em>will</em> catch here (<code>int</code> passed where <code>int *</code> is expected), but the mirrored mistake <code>input(&amp;a, &amp;n)</code> is nastier: <code>&amp;a</code> has type <code>int (*)[100]</code>, and some compilers only warn. Rule: an array name needs no <code>&amp;</code>, a scalar you want written back always does.</p>`,
        `<p class="y-chinh">🎯 Hàm <code>main()</code> của Exercise 1, dòng 2-23, kèm một khung console nhỏ bên cạnh: nhập <code>2 3 1 8 9 5 0</code> → <code>Max value:9</code>, <code>Inputted array:2 3 1 8 9 5</code>, <code>Even values in array:2 8</code>.</p>
<ul>
<li><strong>Dòng 6 — nguyên mẫu đã đổi</strong>: <code>void input(int *a, int *pn);</code> với chú thích "<em>Nhập một mảng, số phần tử được lưu tại pn. Người dùng kết thúc việc nhập khi gõ số 0.</em>" So với dòng 7-9: <code>max</code>, <code>print</code> và <code>printEven</code> vẫn nhận <code>int n</code> thường, vì tới lúc đó số lượng đã biết rồi.</li>
<li><strong>Dòng 11 — <code>int a[MAXN];</code></strong>, "mảng tĩnh 100 số nguyên", cấp phát dư ra đúng như điều kiện 1 đòi hỏi.</li>
<li><strong>Dòng 14 — <code>input(a, &amp;n);</code></strong>. Đây là dòng phải nhớ: mảng đi vào trần (vì nó vốn đã là địa chỉ), còn <code>n</code> đi vào kèm dấu <strong><code>&amp;</code></strong>, vì hàm phải ghi ngược vào nó. Viết hai thứ ấy giống nhau chính là lỗi kinh điển.</li>
<li><strong>Dòng 13 — <code>int n;</code> không hề được gán trong <code>main</code></strong>. Giá trị của nó đến hoàn toàn từ bên trong <code>input</code>. Điều đó chỉ làm được qua con trỏ.</li>
<li><strong>Dòng 15-20 — giữ nguyên như Demo 1</strong>: <code>max(a, n)</code>, <code>print(a, n)</code>, <code>printEven(a, n)</code>. Một khi đã biết <code>n</code>, mọi thứ phía sau chính là đoạn mã bạn đã có sẵn.</li>
<li><strong>Kiểm khung console bằng tay</strong> — các giá trị 2, 3, 1, 8, 9, 5 (số 0 là dấu kết thúc và <em>không</em> được lưu, nên <code>n</code> bằng 6 chứ không phải 7). Lớn nhất = 9. Số chẵn = 2 và 8. Lần này số 0 <strong>không</strong> xuất hiện trong danh sách số chẵn, đúng vì nó đã bị dùng làm giá trị canh — chỗ tương phản với slide 21 đáng dừng lại một nhịp.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#define MAXN 100
/* Nhap mang, so phan tu duoc luu tai pn.
   Nguoi dung ket thuc nhap khi go so 0.   */
void input(int *a, int *pn);
int  max(int a[], int n);
void print(int *a, int n);
void printEven(int *a, int n);

int main()
{   int a[MAXN];      /* mang tinh 100 so nguyen  */
    int n;            /* so phan tu thuc dung     */
    int maxVal;
    input(a, &amp;n);                 /* a tran, n co dau &amp; */
    maxVal = max(a, n);
    printf("Max value:%d\\n", maxVal);
    printf("\\nInputted array:");       print(a, n);
    printf("\\nEven values in array:"); printEven(a, n);
    printf("\\n");
    return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch bằng <code>cc -Wall</code> và chạy với đúng dữ liệu của slide <code>2 3 1 8 9 5 0</code>: <code>Max value:9</code> · <code>Inputted array:2 3 1 8 9 5</code> · <code>Even values in array:2 8</code> — trùng khít khung console nhỏ trên slide. <code>n</code> trả về đúng <strong>6</strong>: sáu giá trị được lưu, giá trị thứ bảy bị tiêu thụ làm dấu kết thúc.</p>
<p class="pitfall">⚠️ <code>input(a, &amp;n)</code> so với <code>input(a, n)</code> chỉ khác một ký tự, và ở đây trình biên dịch <em>sẽ</em> bắt được (truyền <code>int</code> vào chỗ cần <code>int *</code>), nhưng lỗi đối xứng <code>input(&amp;a, &amp;n)</code> thì nham hiểm hơn: <code>&amp;a</code> có kiểu <code>int (*)[100]</code>, và một số trình biên dịch chỉ cảnh báo chứ không chặn. Quy tắc: tên mảng KHÔNG cần dấu <code>&amp;</code>, biến đơn mà bạn muốn hàm ghi ngược vào thì LUÔN cần.</p>`],

      [24, 'Exercise 1 (cont.) — input() and the full solution',
        `<p class="y-chinh">🎯 The heart of the exercise: <code>input(int *a, int *pn)</code>, lines 24-33, with two diagrams showing the array filling up one box at a time. <code>max</code>, <code>print</code> and <code>printEven</code> are marked "<em>Do yourself</em>" — so this slide is solved in full below.</p>
<ul>
<li><strong>Line 25 — <code>*pn = 0;</code></strong> "reset the number of elements". The count starts at zero and lives in <code>main</code>'s <code>n</code>; the star writes through the pointer. Forgetting this line means counting on top of whatever rubbish <code>n</code> held.</li>
<li><strong>Lines 28-32 — a <code>do…while</code></strong>, because at least one value must be read before you can know whether it is the terminator.</li>
<li><strong>Line 30 is the whole exercise</strong>: <code>if (x != 0) a[(*pn)++] = x;</code>. Read it slowly. <code>(*pn)</code> is the current count, which is also the next free index. <code>(*pn)++</code> uses it as the index and <em>then</em> increments it. So the value is stored at the end and the count grows by one — in one statement.</li>
<li><strong>The parentheses are mandatory</strong> — <code>*pn++</code> would mean <code>*(pn++)</code>, incrementing the <em>pointer</em> instead of the counted value, because postfix <code>++</code> binds tighter than unary <code>*</code>. This is a favourite exam trap.</li>
<li><strong>Read the two diagrams</strong> — first: <code>x = 3</code> arrives, the box at index 0 gets 3, and the label says <code>n = 0 → 1</code>. Second: the array already holds <code>3 5 2</code> with <code>n = 3</code>, <code>x = 7</code> arrives, it goes into index 3, and <code>n = 3 → 4</code>. The pictures are the semantics of <code>a[(*pn)++] = x</code>.</li>
<li><strong>Line 32 — <code>while (x != 0 &amp;&amp; *pn &lt; MAXN);</code></strong>, the two exit conditions of slide 22: sentinel reached, or array full.</li>
</ul>
<pre><code>void input(int *a, int *pn)
{   *pn = 0;                        /* reset the number of elements */
    printf("Enter maximum %d elements, 0 for termination\\n", MAXN);
    int x;                          /* inputted value */
    do
    {   scanf("%d", &amp;x);
        if (x != 0) a[(*pn)++] = x; /* luu VA tang dem, mot lenh */
    }
    while (x != 0 &amp;&amp; *pn &lt; MAXN);
}
/* --- ba ham "Do yourself", giai day du --- */
int max(int a[], int n)
{   int result = a[0], i;
    for (i = 1; i &lt; n; i++) if (result &lt; a[i]) result = a[i];
    return result;
}
void print(int *a, int n)
{   int i;
    for (i = 0; i &lt; n; i++) printf("%d ", a[i]);
}
void printEven(int *a, int n)
{   int i;
    for (i = 0; i &lt; n; i++) if (a[i] % 2 == 0) printf("%d ", a[i]);
}</code></pre>
<p class="dap-an">✅ Đáp án — the complete program (slide 23's <code>main</code> + the four functions above) compiled with <code>cc -Wall</code>, no warnings, and run twice. <strong>Run 1</strong>, input <code>2 3 1 8 9 5 0</code>: <code>Max value:9</code> · <code>Inputted array:2 3 1 8 9 5</code> · <code>Even values in array:2 8</code> — identical to the slide's console, with <code>n = 6</code>. <strong>Run 2</strong>, input <code>0</code> alone: the program printed <code>Max value:0</code> and two empty lists. That second result exposes a real defect in the school's code, described below.</p>
<p class="pitfall">⚠️ <strong>The slide's program has an unguarded edge case, and I am reporting it rather than quietly fixing the slide.</strong> If the user types 0 first, <code>input</code> leaves <code>n = 0</code>, and <code>max(a, 0)</code> then executes <code>int result = a[0];</code> on an array where nothing was ever stored — reading an uninitialised value. My run happened to print <code>Max value:0</code>, but that number is whatever the stack held; it is undefined behaviour, not a zero. The fix is one line in <code>main</code>: <code>if (n == 0) { printf("No data.\\n"); return 0; }</code> before calling <code>max</code>. Add it in your own submission and say why — an empty array has no maximum, and that is a fact about mathematics, not about C.</p>`,
        `<p class="y-chinh">🎯 Trái tim của bài tập: <code>input(int *a, int *pn)</code>, dòng 24-33, kèm hai sơ đồ cho thấy mảng được lấp đầy từng ô một. Ba hàm <code>max</code>, <code>print</code> và <code>printEven</code> bị đánh dấu "<em>Do yourself</em>" — nên slide này được giải trọn vẹn ở dưới.</p>
<ul>
<li><strong>Dòng 25 — <code>*pn = 0;</code></strong> "đặt lại số phần tử". Bộ đếm bắt đầu từ không và nó SỐNG trong biến <code>n</code> của <code>main</code>; dấu sao ghi xuyên qua con trỏ. Quên dòng này là đếm chồng lên bất cứ rác gì <code>n</code> đang chứa.</li>
<li><strong>Dòng 28-32 — một <code>do…while</code></strong>, vì phải đọc ít nhất một giá trị rồi mới biết được nó có phải dấu kết thúc hay không.</li>
<li><strong>Dòng 30 chính là toàn bộ bài tập</strong>: <code>if (x != 0) a[(*pn)++] = x;</code>. Hãy đọc thật chậm. <code>(*pn)</code> là số đếm hiện tại, đồng thời cũng là chỉ số trống kế tiếp. <code>(*pn)++</code> dùng nó làm chỉ số rồi <em>sau đó</em> mới tăng lên. Vậy là giá trị được lưu vào cuối mảng và số đếm tăng một — gói trong một câu lệnh.</li>
<li><strong>Cặp ngoặc tròn là bắt buộc</strong> — <code>*pn++</code> sẽ được hiểu là <code>*(pn++)</code>, tức tăng <em>con trỏ</em> thay vì tăng giá trị được đếm, vì <code>++</code> hậu tố gắn chặt hơn toán tử một ngôi <code>*</code>. Đây là cái bẫy ưa thích của đề thi.</li>
<li><strong>Đọc hai sơ đồ</strong> — hình thứ nhất: <code>x = 3</code> đi vào, ô ở chỉ số 0 nhận số 3, và nhãn ghi <code>n = 0 → 1</code>. Hình thứ hai: mảng đã có <code>3 5 2</code> với <code>n = 3</code>, <code>x = 7</code> đi vào, rơi vào chỉ số 3, và <code>n = 3 → 4</code>. Hai hình ấy chính là ngữ nghĩa của <code>a[(*pn)++] = x</code>.</li>
<li><strong>Dòng 32 — <code>while (x != 0 &amp;&amp; *pn &lt; MAXN);</code></strong>, đúng hai điều kiện thoát của slide 22: gặp giá trị canh, hoặc mảng đã đầy.</li>
</ul>
<pre><code>void input(int *a, int *pn)
{   *pn = 0;                        /* dat lai so phan tu */
    printf("Enter maximum %d elements, 0 for termination\\n", MAXN);
    int x;                          /* gia tri vua nhap   */
    do
    {   scanf("%d", &amp;x);
        if (x != 0) a[(*pn)++] = x; /* luu VA tang dem, mot lenh */
    }
    while (x != 0 &amp;&amp; *pn &lt; MAXN);
}
/* --- ba ham "Do yourself", giai day du --- */
int max(int a[], int n)
{   int result = a[0], i;
    for (i = 1; i &lt; n; i++) if (result &lt; a[i]) result = a[i];
    return result;
}
void print(int *a, int n)
{   int i;
    for (i = 0; i &lt; n; i++) printf("%d ", a[i]);
}
void printEven(int *a, int n)
{   int i;
    for (i = 0; i &lt; n; i++) if (a[i] % 2 == 0) printf("%d ", a[i]);
}</code></pre>
<p class="dap-an">✅ Đáp án — chương trình đầy đủ (hàm <code>main</code> của slide 23 cộng bốn hàm trên) đã biên dịch bằng <code>cc -Wall</code>, không cảnh báo nào, và chạy hai lần. <strong>Lần 1</strong>, nhập <code>2 3 1 8 9 5 0</code>: <code>Max value:9</code> · <code>Inputted array:2 3 1 8 9 5</code> · <code>Even values in array:2 8</code> — trùng khít khung console của slide, với <code>n = 6</code>. <strong>Lần 2</strong>, nhập mỗi số <code>0</code>: chương trình in <code>Max value:0</code> và hai danh sách rỗng. Kết quả thứ hai này phơi ra một khiếm khuyết thật trong mã của trường, nói rõ ngay dưới.</p>
<p class="pitfall">⚠️ <strong>Chương trình trên slide có một ca biên chưa được canh, và tôi nêu ra chứ không lặng lẽ sửa slide.</strong> Nếu người dùng gõ 0 ngay từ đầu, <code>input</code> để lại <code>n = 0</code>, rồi <code>max(a, 0)</code> thực thi <code>int result = a[0];</code> trên một mảng chưa hề được lưu gì — tức là đọc một giá trị chưa khởi tạo. Lần chạy của tôi tình cờ in ra <code>Max value:0</code>, nhưng con số ấy là bất cứ thứ gì stack đang giữ; đó là hành vi không xác định, không phải số không. Cách vá là một dòng trong <code>main</code>: <code>if (n == 0) { printf("No data.\\n"); return 0; }</code> đặt trước lời gọi <code>max</code>. Hãy thêm nó vào bài nộp của bạn và nói rõ lý do — mảng rỗng thì không có giá trị lớn nhất, và đó là sự thật của toán học chứ không phải của C.</p>`],
    ]),
  ].join('\n'),
};
