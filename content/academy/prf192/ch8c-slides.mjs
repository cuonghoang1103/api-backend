/**
 * PRF192 · Slot 13-15 — Contiguous Storage, học theo từng slide: PHẦN C (slide 51–70) — STRUCT.
 * Deck 'prf7' (PRF7), 70 slide, ảnh đã render sẵn lên CDN images/academy/PRF192/v1/prf7/NNN.webp.
 *
 * Nội dung bám ĐÚNG chữ trích từ Slot_13_14_15_ContiguousStorage.pptx của trường
 * (/tmp/prf192-text/prf7.txt, slide 51→70). Các slide đặt MÃ NGUỒN / KHUNG CONSOLE
 * TRONG ẢNH (58, 59, 60, 62, 63, 64, 66, 67, 68, 69) đã được đọc thẳng từ ảnh để
 * lấy đúng từng dòng code và từng dòng kết quả.
 *
 * MỌI chương trình và con số dưới đây đã được biên dịch thật bằng `cc -Wall` và chạy:
 *   · offsetof/sizeof (bảng padding)  → eventDate 12 · person 24 · telephone 36 (đệm 2 byte)
 *                                       student 28 (đệm đuôi 3 byte) · accountCustomer 72 (không đệm)
 *                                       struct{char c; int i;} = 8 chứ KHÔNG phải 5 ✓
 *   · slide 59 Example 1              → "Day of the first event: 6-1-2025" / "…second event: 13-5-2025" ✓ khớp ảnh console
 *   · slide 60 Example 2              → "First person -> Name: Mary, Age: 20" / "Second person -> Name: Paul, Age: 22" ✓
 *   · slide 62 Array of structures    → "Father John 30 / Mother Sara 28 / Son David 3" ✓ khớp console
 *     ⚠ BẢNG MINH HOẠ bên phải slide 62 ghi family[2] tuổi 2, trong khi MÃ ghi 3 và CONSOLE in 3.
 *       Đã nêu rõ trong bài, KHÔNG im lặng chép lại và KHÔNG tự sửa slide.
 *   · slide 64 Example 2 (hàm)        → "Student Information:" / "Id: 1001, Name: Tom, Grade: A" ✓
 *     ⚠ Đề bài slide 63 nói in "id, name, AGE" nhưng mã slide 64 khai "grade" (char). Đã nêu rõ.
 *   · slide 66-69 Case Study trọn bộ  → nhập đúng 3 tài khoản của slide, kết quả in ra TRÙNG KHÍT
 *       ảnh console slide 69 (10050.12 · 500.00 · 6666.89 ; Search result chỉ 1001 và 1003) ✓
 *     ⚠ `scanf("%[^\n]", &accounts[i].accountType)` của slide cho -Wformat:
 *       "format specifies type 'char *' but the argument has type 'char (*)[20]'". Đã nêu rõ.
 *   · các lỗi biên dịch được trích nguyên văn thông báo của clang:
 *       thiếu `;` sau `}`   → "expected ';' after struct"
 *       `a == b` hai struct → "invalid operands to binary expression ('eventDate' and 'eventDate')"
 *       `*p.age`            → "member reference type 'person *' is a pointer; did you mean to use '->'?"
 *       `s.name = "Tom"`    → "array type 'char[20]' is not assignable"
 *       `{13, 08, 2025}`    → "invalid digit '8' in octal constant"
 *   · memcmp trên struct có byte đệm → hai struct BẰNG NHAU từng trường vẫn cho memcmp = 170 ≠ 0 ✓
 *   · truyền theo giá trị vs con trỏ  → grow(s) không đổi được gì; growP(&s) đổi thật ✓
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'prf7';

export default {
  title: '8.0c — Slide by slide: Structures, arrays of structs and structs as parameters (slides 51–70)|||8.0c — Slide bài giảng: Struct, mảng struct & struct làm tham số (slide 51–70)',
  slug: 'prf192-8-0c-slides-struct',
  type: 'DOCUMENT',
  description: 'Phần cuối của Slot 13-15 (slide 51–70): kiểu dữ liệu do người dùng tự định nghĩa — struct. Bài đi từ định nghĩa, hai cú pháp khai báo (struct thuần và typedef), cách truy cập trường bằng dấu chấm, hai Example của trường, mảng struct, hàm nhận tham số struct, cho tới Case Study quản lý 100 tài khoản khách hàng giải trọn vẹn. Mọi chương trình đều đã biên dịch bằng cc -Wall và chạy thật; bảng bộ nhớ struct dùng số đo bằng offsetof để thấy padding thật, và hai chỗ slide gốc tự mâu thuẫn đã được chỉ ra thay vì chép lại.',
  content: [
    walkHead(D, 51, 70),
    walk(D, [

      [51, 'Structures',
        `<p class="y-chinh">🎯 A single-word title slide that opens the last third of Slot 13–15. Everything before it was about <strong>many things of the SAME type</strong> (arrays). From here on it is about <strong>one thing made of DIFFERENT types</strong> — the structure.</p>
<ul>
<li><strong>Where this sits in the slot</strong> — slide 3 listed the contents of the whole deck and the last line was <em>"User-defined Data Type: Structure"</em>. Slides 4–50 delivered arrays, 1-D and 2-D. Slide 51 starts the promised last item.</li>
<li><strong>The gap arrays leave</strong> — an array can hold 100 marks, or 100 names, but it cannot hold <em>one student</em>, because a student is an id (int) plus a name (char array) plus a grade (char). Different types cannot share one array.</li>
<li><strong>The workaround students try first, and why it hurts</strong> — three parallel arrays <code>int id[100]; char name[100][20]; char grade[100];</code> where "student i" is spread across three places. Sort by id and you must remember to move the other two arrays in step; forget one and the data silently scrambles.</li>
<li><strong>What a struct changes</strong> — it makes the three pieces <em>one value</em> with one name. One assignment copies all of it, one array element holds all of it, one function parameter carries all of it.</li>
<li><strong>Still contiguous storage</strong> — the deck is called <em>Contiguous Storage</em> and the struct belongs to it: slide 54 will say the fields are stored in contiguous memory, exactly like array elements. The difference is that the parts have different sizes.</li>
<li><strong>Vocabulary you will meet</strong> — <em>structure</em> = <em>record</em>; the pieces inside are <em>fields</em> or <em>members</em> or <em>components</em>. All four words appear in the next slides and all four mean the same thing.</li>
</ul>
<p class="meo">💡 One sentence to hold onto for the next 19 slides: <em>an array groups values that are the same and asks "which one?"; a struct groups values that are different and asks "which part?"</em>. The first uses <code>[i]</code>, the second uses <code>.field</code>.</p>`,
        `<p class="y-chinh">🎯 Một slide tiêu đề chỉ có một chữ, mở ra một phần ba cuối của Slot 13–15. Mọi thứ trước nó nói về <strong>nhiều thứ CÙNG kiểu</strong> (mảng). Từ đây trở đi là <strong>một thứ gồm NHIỀU kiểu khác nhau</strong> — cấu trúc (structure).</p>
<ul>
<li><strong>Chỗ đứng trong slot</strong> — slide 3 liệt kê nội dung cả deck và dòng cuối cùng là <em>"User-defined Data Type: Structure"</em>. Slide 4–50 đã trả xong phần mảng 1 chiều và 2 chiều. Slide 51 bắt đầu món cuối đã hứa.</li>
<li><strong>Khoảng trống mà mảng để lại</strong> — một mảng chứa được 100 điểm, hoặc 100 cái tên, nhưng KHÔNG chứa nổi <em>một sinh viên</em>, vì một sinh viên là một mã (int) cộng một cái tên (mảng char) cộng một điểm chữ (char). Các kiểu khác nhau không ở chung một mảng được.</li>
<li><strong>Cách chữa cháy sinh viên hay nghĩ ra đầu tiên, và vì sao nó đau</strong> — ba mảng song song <code>int id[100]; char name[100][20]; char grade[100];</code>, trong đó "sinh viên thứ i" bị xé ra ba nơi. Sắp xếp theo mã một cái là phải nhớ dời đồng bộ cả ba mảng; quên một cái thì dữ liệu lệch nhau âm thầm, không báo lỗi.</li>
<li><strong>Struct đổi điều gì</strong> — nó biến ba mẩu ấy thành <em>một giá trị</em> có một cái tên. Một phép gán chép hết, một phần tử mảng chứa hết, một tham số hàm mang hết.</li>
<li><strong>Vẫn là bộ nhớ liên tục</strong> — deck này tên là <em>Contiguous Storage</em>, và struct thuộc về nó: slide 54 sẽ nói các trường được đặt trong vùng nhớ liên tục, y như phần tử mảng. Khác biệt chỉ là các mẩu có kích thước không bằng nhau.</li>
<li><strong>Từ vựng sẽ gặp</strong> — <em>structure</em> = <em>record</em> (bản ghi); các mẩu bên trong gọi là <em>field</em>, <em>member</em> hay <em>component</em> (trường / thành viên / thành phần). Cả bốn chữ đều xuất hiện trong các slide sau và đều chỉ cùng một thứ.</li>
</ul>
<p class="meo">💡 Một câu giữ trong đầu suốt 19 slide tới: <em>mảng gom những giá trị GIỐNG nhau và hỏi "cái thứ mấy?"; struct gom những giá trị KHÁC nhau và hỏi "phần nào?"</em>. Cái trước dùng <code>[i]</code>, cái sau dùng <code>.tên_trường</code>.</p>`],

      [52, 'Objectives',
        `<p class="y-chinh">🎯 Six objectives, and they are also the six exam questions of this section: <em>what</em> a C structure is, <em>when</em> to use one, its <em>syntax</em>, how to <em>declare a variable</em> of that type, what its <em>fields</em> are and how to initialise them, and how to <em>manipulate</em> the type.</p>
<ul>
<li><strong>"What is C structure?"</strong> — answered on slide 54 in one sentence: a user-defined data type that groups items of <em>possibly different</em> types into a single type. Memorise "possibly different" — that is the whole contrast with arrays.</li>
<li><strong>"When to use structures"</strong> — slide 54 again: <em>"You use structures to group data that belong together."</em> The test is a sentence: if you find yourself saying "the id, the name and the grade <em>of the same student</em>", the words "of the same" mean you want a struct.</li>
<li><strong>"Syntax of a structure"</strong> — slide 56 gives two forms (plain <code>struct</code> and <code>typedef struct</code>). Both appear in exams and both appear in the Case Study, so you must be able to read either.</li>
<li><strong>"How to declare variable of type structure?"</strong> — slide 57: <code>structName variableName;</code>. Trap: with the plain form the type name is two words, <code>struct telephone tel;</code>, not <code>telephone tel;</code>.</li>
<li><strong>"Fields of a structure and how to initialize them"</strong> — three ways will be shown: field by field (<code>ev1.day = 6;</code>), a brace list at declaration (<code>= {13, 05, 2025}</code>), and <code>strcpy</code> for the char-array fields. The third one is where most marks are lost.</li>
<li><strong>"How to manipulate structure type"</strong> — slide 58: the dot operator, and whole-structure assignment with <code>=</code>. Note what is <em>not</em> on the list: comparison. You will see on slide 58's notes that <code>==</code> between two structs does not compile at all.</li>
</ul>
<p class="meo">💡 Turn the six bullets into a self-test before the exam: write, from memory, a <code>typedef struct</code> for a book (id, title, price), declare one variable, fill all three fields, copy it into a second variable, and print both. If you can do that without looking, this section is done.</p>`,
        `<p class="y-chinh">🎯 Sáu mục tiêu, và cũng chính là sáu câu hỏi thi của phần này: struct trong C <em>là gì</em>, <em>khi nào</em> dùng, <em>cú pháp</em> ra sao, <em>khai báo biến</em> kiểu đó thế nào, <em>trường</em> của nó là gì và khởi tạo cách nào, và <em>thao tác</em> với kiểu struct ra sao.</p>
<ul>
<li><strong>"C structure là gì?"</strong> — slide 54 trả lời trong một câu: một kiểu dữ liệu do người dùng định nghĩa, gom các mục <em>có thể khác kiểu nhau</em> thành một kiểu duy nhất. Hãy thuộc cụm "có thể khác kiểu" — đó là toàn bộ chỗ tương phản với mảng.</li>
<li><strong>"Khi nào dùng struct"</strong> — cũng slide 54: <em>"Dùng struct để gom những dữ liệu thuộc về nhau."</em> Phép thử là một câu nói: nếu bạn buột miệng "mã, tên và điểm <em>của cùng một sinh viên</em>" thì chữ "của cùng một" nghĩa là bạn đang cần struct.</li>
<li><strong>"Cú pháp của struct"</strong> — slide 56 cho hai dạng (dạng <code>struct</code> thuần và dạng <code>typedef struct</code>). Cả hai đều ra thi và cả hai đều có mặt trong Case Study, nên phải đọc được cả hai.</li>
<li><strong>"Khai báo biến kiểu struct thế nào?"</strong> — slide 57: <code>structName variableName;</code>. Bẫy: với dạng thuần, tên kiểu gồm HAI chữ — <code>struct telephone tel;</code>, không phải <code>telephone tel;</code>.</li>
<li><strong>"Các trường và cách khởi tạo"</strong> — sẽ có ba cách: gán từng trường (<code>ev1.day = 6;</code>), liệt kê trong ngoặc nhọn lúc khai báo (<code>= {13, 05, 2025}</code>), và dùng <code>strcpy</code> cho các trường là mảng ký tự. Cách thứ ba là chỗ mất điểm nhiều nhất.</li>
<li><strong>"Thao tác với kiểu struct"</strong> — slide 58: toán tử dấu chấm, và phép gán nguyên cả struct bằng <code>=</code>. Hãy để ý thứ KHÔNG có trong danh sách: phép so sánh. Ở phần ghi chú slide 58 bạn sẽ thấy <code>==</code> giữa hai struct thậm chí không biên dịch nổi.</li>
</ul>
<p class="meo">💡 Biến sáu gạch đầu dòng này thành bài tự kiểm trước khi thi: viết từ trí nhớ một <code>typedef struct</code> cho cuốn sách (mã, tựa, giá), khai một biến, điền cả ba trường, chép nó sang biến thứ hai, rồi in cả hai. Làm được mà không nhìn tài liệu nghĩa là phần này xong.</p>`],

      [53, 'Contents',
        `<p class="y-chinh">🎯 The map of slides 54–70, in five numbered parts. Every following slide carries one of these numbers in its title, so this slide tells you where you are at any moment.</p>
<ul>
<li><strong>1. Structure Definition</strong> (slides 54–55) — what a struct is, and two worked descriptions of real records: student information, and a bank account with a <em>nested</em> holder name.</li>
<li><strong>2. Struct Syntax</strong> (slides 56–57) — the two declaration forms, then three concrete examples (<code>eventDate</code>, <code>person</code>, <code>telephone</code>) and how to declare variables from them.</li>
<li><strong>3. Manipulating Structure Types</strong> (slides 58–60) — the dot operator, whole-struct assignment, and two runnable Examples with their console output.</li>
<li><strong>4. Arrays of Structures</strong> (slides 61–62) — the combination that makes the section useful: <code>person family[3];</code> and <code>family[1].age</code>.</li>
<li><strong>5. Function with a Structure Input Parameter</strong> (slides 63–64) — passing a whole record into a function, and the copy that happens when you do.</li>
<li><strong>Then the Case Study</strong> (65–69) — 100 customer accounts, input / print / search, which uses all five parts at once; and <strong>Summary</strong> (70).</li>
</ul>
<p class="meo">💡 Notice the shape of the section: <em>define the type → make one variable → make an array of them → pass one into a function → build a small program from all three</em>. That is the same ladder you climbed for arrays in slides 6–24, which is why this part feels fast: only the "type" step is new.</p>`,
        `<p class="y-chinh">🎯 Bản đồ của slide 54–70, chia làm năm phần được đánh số. Mọi slide phía sau đều mang một trong các số này trên tiêu đề, nên slide này cho bạn biết mình đang đứng ở đâu bất cứ lúc nào.</p>
<ul>
<li><strong>1. Structure Definition</strong> (slide 54–55) — struct là gì, kèm hai mô tả bản ghi thật: thông tin sinh viên, và tài khoản ngân hàng có phần tên chủ tài khoản <em>lồng nhau</em>.</li>
<li><strong>2. Struct Syntax</strong> (slide 56–57) — hai dạng khai báo, rồi ba ví dụ cụ thể (<code>eventDate</code>, <code>person</code>, <code>telephone</code>) và cách khai biến từ chúng.</li>
<li><strong>3. Manipulating Structure Types</strong> (slide 58–60) — toán tử dấu chấm, phép gán nguyên khối, và hai Example chạy được kèm ảnh console.</li>
<li><strong>4. Arrays of Structures</strong> (slide 61–62) — sự kết hợp làm cả phần này trở nên hữu dụng: <code>person family[3];</code> và <code>family[1].age</code>.</li>
<li><strong>5. Function with a Structure Input Parameter</strong> (slide 63–64) — đưa nguyên một bản ghi vào hàm, và cú sao chép xảy ra khi làm thế.</li>
<li><strong>Rồi tới Case Study</strong> (65–69) — 100 tài khoản khách hàng, nhập / in / tìm kiếm, dùng cả năm phần cùng lúc; và <strong>Summary</strong> (70).</li>
</ul>
<p class="meo">💡 Để ý hình dạng của phần này: <em>định nghĩa kiểu → tạo một biến → tạo một mảng các biến ấy → đưa một cái vào hàm → ghép cả ba thành chương trình nhỏ</em>. Đúng cái thang bạn đã leo với mảng ở slide 6–24, nên phần này đi rất nhanh: chỉ có bậc "kiểu dữ liệu" là mới.</p>`],

      [54, '1. Structure Definition',
        `<p class="y-chinh">🎯 Six statements that together are the definition you will be asked to recite: a struct is a <strong>user-defined data type</strong> that groups items of <strong>possibly different types</strong> into a <strong>single type</strong>, its values live in <strong>contiguous memory</strong>, and it is also called a <strong>record</strong>.</p>
<ul>
<li><strong>"User-defined"</strong> — <code>int</code>, <code>double</code>, <code>char</code> came with the language; <code>eventDate</code> did not exist until you wrote it. After you define it, the compiler treats it like any other type: you can declare variables, arrays, pointers and function parameters of that type.</li>
<li><strong>"Possibly different types"</strong> — the slide states the contrast itself: <em>"Unlike arrays, a struct is composed of data of different types."</em> Different is allowed, not required; a struct of three <code>int</code>s (like <code>eventDate</code>) is perfectly legal and still a struct.</li>
<li><strong>"The <code>struct</code> keyword is used to define the structure"</strong> — there is exactly one keyword, and <code>typedef</code> on slide 56 does not replace it, it only gives the result a shorter name.</li>
<li><strong>"To group data that belong together"</strong> — this is the design rule, and it is the part a marker looks for in a written answer. Cohesion, not convenience: an id, a name and a grade belong to a student; a screen width and a student's age do not belong together just because both are <code>int</code>.</li>
<li><strong>"Values are stored in contiguous memory locations"</strong> — I measured this: for <code>person {char name[20]; int age;}</code> the struct starts at <code>0x16d1a63b0</code>, <code>name</code> is at that same address, and <code>age</code> is at <code>0x16d1a63c4</code> — 20 bytes later, inside the same block. That is why a struct can be written to a file or copied with one assignment.</li>
<li><strong>"Also called records"</strong> — worth knowing because databases, Pascal and many textbooks say "record" for the same idea, and exam questions sometimes use that word.</li>
</ul>
<table>
<tr><th>Feature</th><th>Array</th><th>Structure</th></tr>
<tr><td>Element types</td><td>all identical</td><td>may all differ</td></tr>
<tr><td>Select a part with</td><td><code>a[i]</code> — an index, computable at run time</td><td><code>s.field</code> — a name, fixed at compile time</td></tr>
<tr><td>Copy the whole thing with <code>=</code></td><td>❌ not allowed</td><td>✅ allowed</td></tr>
<tr><td>Passed to a function as</td><td>a pointer to element 0</td><td>a full copy of every byte</td></tr>
<tr><td>Stored contiguously</td><td>✅</td><td>✅</td></tr>
</table>
<p class="pitfall">⚠️ "Contiguous" does not mean "with no gaps". The compiler is allowed to insert padding bytes between fields so each field lands on an address its type likes. Slide 55's notes and the table on slide 57 show the measurements: <code>struct {char c; int i;}</code> occupies <strong>8</strong> bytes, not 5.</p>`,
        `<p class="y-chinh">🎯 Sáu câu, gộp lại chính là định nghĩa bạn sẽ bị hỏi đọc lại: struct là một <strong>kiểu dữ liệu do người dùng định nghĩa</strong>, gom các mục <strong>có thể khác kiểu</strong> thành <strong>một kiểu duy nhất</strong>, giá trị của nó nằm trong <strong>vùng nhớ liên tục</strong>, và nó còn được gọi là <strong>bản ghi (record)</strong>.</p>
<ul>
<li><strong>"Do người dùng định nghĩa"</strong> — <code>int</code>, <code>double</code>, <code>char</code> có sẵn theo ngôn ngữ; <code>eventDate</code> thì không tồn tại cho tới khi bạn viết ra. Sau khi định nghĩa, trình biên dịch đối xử với nó như mọi kiểu khác: khai được biến, mảng, con trỏ và tham số hàm kiểu đó.</li>
<li><strong>"Có thể khác kiểu"</strong> — chính slide nêu chỗ tương phản: <em>"Khác với mảng, struct gồm những dữ liệu khác kiểu nhau."</em> Khác kiểu là được PHÉP chứ không BẮT BUỘC; một struct gồm ba <code>int</code> (như <code>eventDate</code>) vẫn hoàn toàn hợp lệ và vẫn là struct.</li>
<li><strong>"Từ khoá <code>struct</code> dùng để định nghĩa cấu trúc"</strong> — chỉ có đúng một từ khoá, và <code>typedef</code> ở slide 56 KHÔNG thay thế nó, chỉ đặt cho kết quả một cái tên ngắn hơn.</li>
<li><strong>"Để gom dữ liệu thuộc về nhau"</strong> — đây là luật thiết kế, và là phần người chấm tìm trong bài tự luận. Tiêu chí là sự gắn bó chứ không phải sự tiện tay: mã, tên và điểm thuộc về một sinh viên; chiều rộng màn hình và tuổi sinh viên KHÔNG thuộc về nhau chỉ vì cả hai đều là <code>int</code>.</li>
<li><strong>"Các giá trị nằm ở những ô nhớ liên tục"</strong> — tôi đã đo: với <code>person {char name[20]; int age;}</code>, struct bắt đầu ở <code>0x16d1a63b0</code>, <code>name</code> nằm đúng tại địa chỉ đó, còn <code>age</code> ở <code>0x16d1a63c4</code> — cách 20 byte, vẫn trong cùng một khối. Chính vì vậy một struct mới ghi được xuống tệp hay chép được bằng một phép gán.</li>
<li><strong>"Còn gọi là record"</strong> — nên biết, vì cơ sở dữ liệu, ngôn ngữ Pascal và nhiều giáo trình gọi cùng một ý này là "bản ghi", và đề thi đôi khi dùng đúng chữ ấy.</li>
</ul>
<table>
<tr><th>Đặc điểm</th><th>Mảng</th><th>Struct</th></tr>
<tr><td>Kiểu các phần tử</td><td>giống hệt nhau</td><td>có thể khác nhau hết</td></tr>
<tr><td>Chọn một phần bằng</td><td><code>a[i]</code> — chỉ số, tính được lúc chạy</td><td><code>s.trường</code> — cái tên, cố định lúc biên dịch</td></tr>
<tr><td>Chép trọn bằng <code>=</code></td><td>❌ không được</td><td>✅ được</td></tr>
<tr><td>Truyền vào hàm dưới dạng</td><td>con trỏ tới phần tử 0</td><td>bản sao đầy đủ từng byte</td></tr>
<tr><td>Nằm liên tục trong bộ nhớ</td><td>✅</td><td>✅</td></tr>
</table>
<p class="pitfall">⚠️ "Liên tục" không có nghĩa là "không có khoảng hở". Trình biên dịch được phép chèn byte đệm (padding) giữa các trường để mỗi trường rơi vào địa chỉ mà kiểu của nó ưa. Phần ghi chú slide 55 và bảng ở slide 57 cho số đo thật: <code>struct {char c; int i;}</code> chiếm <strong>8</strong> byte chứ không phải 5.</p>`],

      [55, 'Structure Definition (cont.)',
        `<p class="y-chinh">🎯 Two real-world records drawn on the slide, and two new vocabulary items: the pieces are called <strong>fields</strong> or <strong>members</strong>, and <em>"complex data structures can be formed by defining arrays of structs"</em> — the sentence that sets up part 4.</p>
<ul>
<li><strong>Record 1 — student information</strong>: student id, last name, first name, major, gender, "…". Notice the types are already mixed in the reader's head: the id is a number, the names are text, the gender is a single character. No array could hold that row.</li>
<li><strong>Record 2 — bank account</strong>: account number, account type, account holder (<em>first name</em> + <em>last name</em>), balance. The indentation under "account holder" is deliberate: it is a struct <em>inside</em> a struct, and it is the reason the slide adds the sentence about complex data structures.</li>
<li><strong>Nested structs are just types</strong> — once <code>fullName</code> is a type, a field can have that type, and you reach the inner field with two dots: <code>acc.holder.firstName</code>. Nothing new to learn; the dot simply applies twice.</li>
<li><strong>Why the Case Study flattens it</strong> — on slide 66 the same bank account appears as <code>char accountHolderName[40];</code>, one flat field. For a first program that is the right simplification; know that both designs are valid and that the slide showed you the richer one first.</li>
<li><strong>"Field" vs "member" vs "component"</strong> — the deck uses all three (slide 55 "fields or members", slide 58 "component selection operator", slide 63 "all its component values"). They are synonyms. In exam answers, use "field" or "member" and be consistent.</li>
<li><strong>"…" in the student record is a hint</strong> — real records grow. That is an argument <em>for</em> structs: adding a field changes the type in one place, whereas adding a parallel array changes every function signature that walks the data.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;string.h&gt;

/* Ban ghi 2 cua slide, giu nguyen phan long nhau */
typedef struct {
    char firstName[20];
    char lastName[20];
} fullName;

typedef struct {
    int      accountNumber;
    char     accountType[20];
    fullName accountHolder;   /* struct long trong struct */
    double   balance;
} bankAccount;

int main(void) {
    bankAccount acc;
    acc.accountNumber = 1001;
    strcpy(acc.accountType, "Checking");
    strcpy(acc.accountHolder.firstName, "Ngoc Tho");
    strcpy(acc.accountHolder.lastName,  "Pham");
    acc.balance = 10050.123;

    printf("%d %s %s %s %.2lf\\n", acc.accountNumber, acc.accountType,
           acc.accountHolder.lastName, acc.accountHolder.firstName, acc.balance);
    return 0;
}</code></pre>
<p class="dap-an">✅ Compiled with <code>cc -Wall</code> and run: it prints <code>1001 Checking Pham Ngoc Tho 10050.12</code> — the same holder name the Case Study console shows on slide 69, reached here through two dots instead of one field. Measured sizes: <code>fullName</code> is 40 bytes, and <code>bankAccount</code> is 72 bytes, exactly the same total as the Case Study's flat <code>accountCustomer</code>, because nesting changes the <em>path</em> to a field, not the storage.</p>
<p class="meo">💡 Reading order for a nested access: read <code>acc.accountHolder.firstName</code> left to right as "in <em>acc</em>, take <em>accountHolder</em>; in that, take <em>firstName</em>". The dot always means "go one level in", never "go one element along" — that is what <code>[ ]</code> means.</p>`,
        `<p class="y-chinh">🎯 Hai bản ghi đời thật được vẽ trên slide, kèm hai từ vựng mới: các mẩu bên trong gọi là <strong>field</strong> hoặc <strong>member</strong> (trường / thành viên), và <em>"có thể tạo ra cấu trúc dữ liệu phức tạp bằng cách khai mảng các struct"</em> — câu này dọn đường cho phần 4.</p>
<ul>
<li><strong>Bản ghi 1 — thông tin sinh viên</strong>: mã sinh viên, họ, tên, ngành, giới tính, "…". Để ý là ngay trong đầu người đọc các kiểu đã lẫn lộn: mã là số, họ tên là chữ, giới tính là một ký tự. Không mảng nào chứa nổi một dòng như vậy.</li>
<li><strong>Bản ghi 2 — tài khoản ngân hàng</strong>: số tài khoản, loại tài khoản, chủ tài khoản (<em>tên</em> + <em>họ</em>), số dư. Phần thụt vào dưới "account holder" là cố ý: đó là một struct <em>bên trong</em> một struct, và cũng là lý do slide thêm câu về cấu trúc dữ liệu phức tạp.</li>
<li><strong>Struct lồng nhau chẳng qua cũng là kiểu</strong> — một khi <code>fullName</code> là một kiểu thì một trường có thể mang kiểu đó, và bạn với tới trường bên trong bằng hai dấu chấm: <code>acc.holder.firstName</code>. Không có gì mới phải học; dấu chấm chỉ đơn giản được dùng hai lần.</li>
<li><strong>Vì sao Case Study làm phẳng nó đi</strong> — ở slide 66 chính tài khoản ngân hàng ấy xuất hiện dưới dạng <code>char accountHolderName[40];</code>, một trường phẳng. Với chương trình đầu tay thì đơn giản hoá như vậy là đúng; chỉ cần biết cả hai thiết kế đều hợp lệ và slide đã cho bạn xem bản giàu hơn trước.</li>
<li><strong>"Field" – "member" – "component"</strong> — deck dùng cả ba (slide 55 "fields or members", slide 58 "component selection operator", slide 63 "all its component values"). Chúng đồng nghĩa. Khi làm bài, chọn một chữ ("trường" chẳng hạn) và dùng nhất quán.</li>
<li><strong>Dấu "…" trong bản ghi sinh viên là một gợi ý</strong> — bản ghi thật sẽ phình ra. Đó chính là lý lẽ ỦNG HỘ struct: thêm một trường thì kiểu chỉ đổi ở một chỗ, trong khi thêm một mảng song song thì mọi chữ ký hàm đi qua dữ liệu đều phải sửa.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;string.h&gt;

/* Ban ghi 2 cua slide, giu nguyen phan long nhau */
typedef struct {
    char firstName[20];
    char lastName[20];
} fullName;

typedef struct {
    int      accountNumber;
    char     accountType[20];
    fullName accountHolder;   /* struct long trong struct */
    double   balance;
} bankAccount;

int main(void) {
    bankAccount acc;
    acc.accountNumber = 1001;
    strcpy(acc.accountType, "Checking");
    strcpy(acc.accountHolder.firstName, "Ngoc Tho");
    strcpy(acc.accountHolder.lastName,  "Pham");
    acc.balance = 10050.123;

    printf("%d %s %s %s %.2lf\\n", acc.accountNumber, acc.accountType,
           acc.accountHolder.lastName, acc.accountHolder.firstName, acc.balance);
    return 0;
}</code></pre>
<p class="dap-an">✅ Đã biên dịch bằng <code>cc -Wall</code> và chạy: in ra <code>1001 Checking Pham Ngoc Tho 10050.12</code> — đúng cái tên chủ tài khoản mà console Case Study ở slide 69 hiện ra, chỉ khác là ở đây với tới qua hai dấu chấm thay vì một trường. Kích thước đo được: <code>fullName</code> 40 byte, và <code>bankAccount</code> 72 byte, bằng đúng tổng của <code>accountCustomer</code> phẳng trong Case Study — vì lồng nhau chỉ đổi <em>đường đi</em> tới một trường chứ không đổi chỗ chứa.</p>
<p class="meo">💡 Cách đọc một truy cập lồng: đọc <code>acc.accountHolder.firstName</code> từ trái sang phải là "trong <em>acc</em>, lấy <em>accountHolder</em>; trong cái đó, lấy <em>firstName</em>". Dấu chấm luôn nghĩa là "đi vào một tầng", không bao giờ nghĩa là "đi tới một phần tử" — chuyện đó là việc của <code>[ ]</code>.</p>`],

      [56, '2. Struct Syntax',
        `<p class="y-chinh">🎯 Two boxes, two ways to write the same thing: the plain <code>struct structName { … };</code> and the <code>typedef struct { … } structName;</code>. The slide joins them with the word <em>"Or"</em>, and the single most important character on the slide is the <strong>semicolon after the closing brace</strong>, which both boxes have.</p>
<ul>
<li><strong>Form 1 — plain struct</strong> — <code>struct structName { dataType1 field1; dataType2 field2; … };</code>. The name of the new type is the <em>two words</em> <code>struct structName</code>. Declaring a variable therefore reads <code>struct telephone tel;</code>.</li>
<li><strong>Form 2 — typedef struct</strong> — <code>typedef struct { … } structName;</code>. Here <code>structName</code> is not the struct's tag, it is an <em>alias for the whole type</em>. Declaring a variable reads <code>eventDate ev;</code>, with no <code>struct</code> keyword. This is why almost every example in the deck uses form 2: it reads like <code>int</code> and <code>double</code>.</li>
<li><strong>What <code>typedef</code> actually does</strong> — nothing at run time. It creates no storage and no code; it is a naming instruction to the compiler. The generated program is byte-for-byte the same either way.</li>
<li><strong>The fields end with <code>;</code>, not <code>,</code></strong> — inside the braces each field is a declaration line, exactly like a declaration inside a function. Writing <code>int day, month;</code> on one line is legal and means two <code>int</code> fields.</li>
<li><strong>Where to put the definition</strong> — above <code>main</code>, at file scope, so every function in the file can use the type. The Case Study on slide 66 does exactly that: lines 5–10, before <code>clear()</code> and before <code>main</code>.</li>
<li><strong>The rule for the exam</strong> — a struct definition is a <em>statement</em>, and every statement in C ends with a semicolon. The closing brace of a function is followed by nothing; the closing brace of a struct is followed by <code>;</code>. That asymmetry is exactly what the trap on this slide is about.</li>
</ul>
<pre><code>/* CACH 1 — struct thuan */
struct telephone {
    char name[30];
    int  number;
};                      /* &lt;-- dau ; BAT BUOC */

/* CACH 2 — typedef struct */
typedef struct {
    int day;
    int month;
    int year;
} eventDate;            /* &lt;-- dau ; BAT BUOC */

/* Khai bao bien */
struct telephone tel;   /* cach 1: ten kieu la HAI chu */
eventDate        ev;    /* cach 2: ten kieu la MOT chu */</code></pre>
<p class="pitfall">⚠️ Forget the semicolon after <code>}</code> and the error message points at the <em>next</em> line, not at the struct. I compiled a struct missing its semicolon with <code>cc -Wall</code>; clang answered <code>error: expected ';' after struct</code> and pointed at line 5 — the line holding the lone <code>}</code> — but older compilers famously blame <code>int main</code> instead, producing messages like "two or more data types in declaration specifiers". If an error names a line that looks perfectly fine, look at the closing brace above it.</p>
<p class="meo">💡 A third form exists and appears in older code: <code>typedef struct telephone { … } phone;</code> — a tag <em>and</em> an alias, so both <code>struct telephone t;</code> and <code>phone t;</code> work. You need it only when the struct refers to itself (a linked list node pointing at <code>struct node *next;</code>), which is a Data Structures topic, not this one.</p>`,
        `<p class="y-chinh">🎯 Hai khung, hai cách viết cùng một thứ: dạng thuần <code>struct structName { … };</code> và dạng <code>typedef struct { … } structName;</code>. Slide nối chúng bằng chữ <em>"Or"</em>, và ký tự quan trọng nhất trên cả slide là <strong>dấu chấm phẩy sau dấu ngoặc nhọn đóng</strong> — cả hai khung đều có nó.</p>
<ul>
<li><strong>Dạng 1 — struct thuần</strong> — <code>struct structName { dataType1 field1; dataType2 field2; … };</code>. Tên của kiểu mới là <em>hai chữ</em> <code>struct structName</code>. Cho nên khai biến phải đọc là <code>struct telephone tel;</code>.</li>
<li><strong>Dạng 2 — typedef struct</strong> — <code>typedef struct { … } structName;</code>. Ở đây <code>structName</code> không phải là nhãn của struct, nó là <em>bí danh của cả cái kiểu</em>. Khai biến đọc là <code>eventDate ev;</code>, không cần từ khoá <code>struct</code>. Đó là lý do gần như mọi ví dụ trong deck đều dùng dạng 2: nó đọc y như <code>int</code> hay <code>double</code>.</li>
<li><strong><code>typedef</code> thật ra làm gì</strong> — không làm gì lúc chạy cả. Nó không sinh ô nhớ, không sinh mã; nó chỉ là một lời dặn đặt tên cho trình biên dịch. Chương trình sinh ra giống hệt nhau từng byte dù bạn dùng dạng nào.</li>
<li><strong>Các trường kết thúc bằng <code>;</code>, không phải <code>,</code></strong> — bên trong ngoặc nhọn, mỗi trường là một dòng khai báo, y như khai báo trong hàm. Viết <code>int day, month;</code> trên một dòng là hợp lệ và nghĩa là hai trường <code>int</code>.</li>
<li><strong>Đặt định nghĩa ở đâu</strong> — phía trên <code>main</code>, ở mức tệp, để mọi hàm trong tệp dùng được kiểu đó. Case Study ở slide 66 làm đúng như vậy: dòng 5–10, trước <code>clear()</code> và trước <code>main</code>.</li>
<li><strong>Luật để nhớ đi thi</strong> — định nghĩa struct là một <em>câu lệnh</em>, mà mọi câu lệnh trong C đều kết thúc bằng dấu chấm phẩy. Ngoặc nhọn đóng của một HÀM thì không có gì theo sau; ngoặc nhọn đóng của một STRUCT thì có <code>;</code> theo sau. Chính sự bất đối xứng ấy là cái bẫy của slide này.</li>
</ul>
<pre><code>/* CACH 1 — struct thuan */
struct telephone {
    char name[30];
    int  number;
};                      /* &lt;-- dau ; BAT BUOC */

/* CACH 2 — typedef struct */
typedef struct {
    int day;
    int month;
    int year;
} eventDate;            /* &lt;-- dau ; BAT BUOC */

/* Khai bao bien */
struct telephone tel;   /* cach 1: ten kieu la HAI chu */
eventDate        ev;    /* cach 2: ten kieu la MOT chu */</code></pre>
<p class="pitfall">⚠️ Quên dấu chấm phẩy sau <code>}</code> thì thông báo lỗi lại chỉ vào dòng KẾ TIẾP chứ không chỉ vào struct. Tôi đã biên dịch thật một struct thiếu dấu chấm phẩy bằng <code>cc -Wall</code>; clang trả lời <code>error: expected ';' after struct</code> và trỏ vào dòng 5 — dòng chỉ có mỗi dấu <code>}</code> — nhưng các trình biên dịch cũ thì nổi tiếng là đổ lỗi cho <code>int main</code>, sinh ra những câu như "two or more data types in declaration specifiers". Hễ thấy lỗi chỉ vào một dòng trông hoàn toàn bình thường, hãy nhìn lên dấu ngoặc nhọn đóng ngay phía trên.</p>
<p class="meo">💡 Còn một dạng thứ ba hay gặp trong mã cũ: <code>typedef struct telephone { … } phone;</code> — vừa có nhãn vừa có bí danh, nên cả <code>struct telephone t;</code> lẫn <code>phone t;</code> đều chạy. Bạn chỉ cần tới nó khi struct tự tham chiếu chính mình (nút danh sách liên kết có <code>struct node *next;</code>), mà đó là chuyện của môn Cấu trúc dữ liệu, không phải phần này.</p>`],

      [57, 'Syntax Structure (cont.)',
        `<p class="y-chinh">🎯 Three worked examples of the syntax, side by side, and then the one line that turns a <em>type</em> into a <em>variable</em>: <code>structName variableName;</code> — <code>eventDate ev; person p; telephone tel;</code>.</p>
<ul>
<li><strong>Example 1 — <code>eventDate</code></strong>: <code>typedef struct { int day; int month; int year; } eventDate;</code>. Three fields, all the same type; still a struct, because what matters is that the three parts have <em>names</em>, not indices.</li>
<li><strong>Example 2 — <code>person</code></strong>: <code>typedef struct { char name[20]; int age; } person;</code>. Mixed types at last. Note <code>name</code> is an <em>array inside a struct</em>, which is allowed and very common — and which is why you will need <code>strcpy</code> on slide 60.</li>
<li><strong>Example 3 — <code>telephone</code></strong>: <code>struct telephone { char name[30]; int number; };</code> — deliberately written in the plain form so you meet both. Its variable declaration must say <code>struct telephone tel;</code>.</li>
<li><strong>The slide's variable line hides an inconsistency worth spotting</strong> — it writes <code>telephone tel;</code> without <code>struct</code>. With Example 3 as written, that does not compile: the type is <code>struct telephone</code>. The slide is showing the <em>pattern</em> <code>structName variableName;</code>, which is exact for the two <code>typedef</code> cases and shorthand for the third.</li>
<li><strong>Storing a phone number as <code>int</code> is a design bug worth naming</strong> — leading zeros vanish (0912… becomes 912…), and 10-digit numbers overflow a 32-bit <code>int</code> (max 2147483647). Real code stores phone numbers as <code>char[]</code>. The slide is teaching syntax, not data modelling, but an exam answer that notices this earns credit.</li>
<li><strong>The declaration creates storage immediately</strong> — <code>eventDate ev;</code> reserves 12 bytes on the stack, uninitialised. Just like <code>int a[5];</code> on slide 11, the fields contain unpredictable rubbish until you write to them.</li>
</ul>
<table>
<tr><th>Type</th><th>Fields</th><th>Sum of field sizes</th><th><code>sizeof</code> measured</th><th>Padding</th></tr>
<tr><td><code>eventDate</code></td><td><code>int day, month, year</code></td><td>4+4+4 = 12</td><td><strong>12</strong></td><td>0 — three 4-byte fields already align</td></tr>
<tr><td><code>person</code></td><td><code>char name[20]; int age</code></td><td>20+4 = 24</td><td><strong>24</strong></td><td>0 — 20 is already a multiple of 4</td></tr>
<tr><td><code>struct telephone</code></td><td><code>char name[30]; int number</code></td><td>30+4 = 34</td><td><strong>36</strong></td><td><strong>2</strong> — <code>number</code> is pushed from offset 30 to 32</td></tr>
</table>
<p class="dap-an">✅ Measured with <code>offsetof</code> under <code>cc -Wall</code>: <code>eventDate</code> → day@0, month@4, year@8, size 12. <code>person</code> → name@0, age@20, size 24. <code>struct telephone</code> → name@0, <strong>number@32</strong>, size 36. The telephone row is the proof that "contiguous" allows gaps: bytes 30 and 31 belong to the struct, are copied when you assign it, and hold whatever was in memory before.</p>
<p class="meo">💡 The alignment rule in one line: each field starts at an offset that is a multiple of its own size (4 for <code>int</code>, 8 for <code>double</code>, 1 for <code>char</code>), and the struct's total size is rounded up so that an array of them keeps every element aligned. Order your fields large-to-small and the padding usually disappears.</p>`,
        `<p class="y-chinh">🎯 Ba ví dụ cú pháp đặt cạnh nhau, rồi một dòng biến một <em>kiểu</em> thành một <em>biến</em>: <code>structName variableName;</code> — <code>eventDate ev; person p; telephone tel;</code>.</p>
<ul>
<li><strong>Ví dụ 1 — <code>eventDate</code></strong>: <code>typedef struct { int day; int month; int year; } eventDate;</code>. Ba trường, cùng một kiểu; vẫn là struct, vì điều cốt yếu là ba phần ấy có <em>tên</em> chứ không phải có chỉ số.</li>
<li><strong>Ví dụ 2 — <code>person</code></strong>: <code>typedef struct { char name[20]; int age; } person;</code>. Cuối cùng cũng có kiểu lẫn lộn. Để ý <code>name</code> là một <em>mảng nằm trong struct</em>, chuyện đó hợp lệ và rất phổ biến — và cũng chính vì nó mà slide 60 sẽ phải dùng <code>strcpy</code>.</li>
<li><strong>Ví dụ 3 — <code>telephone</code></strong>: <code>struct telephone { char name[30]; int number; };</code> — cố ý viết theo dạng thuần để bạn gặp cả hai. Khai biến của nó bắt buộc phải là <code>struct telephone tel;</code>.</li>
<li><strong>Dòng khai biến của slide giấu một chỗ chưa khớp, đáng để nhìn ra</strong> — nó viết <code>telephone tel;</code> không có <code>struct</code>. Với Ví dụ 3 viết như trên thì dòng ấy không biên dịch được: tên kiểu là <code>struct telephone</code>. Slide đang trình bày <em>khuôn</em> <code>structName variableName;</code> — chính xác với hai trường hợp <code>typedef</code> và viết tắt với trường hợp thứ ba.</li>
<li><strong>Lưu số điện thoại bằng <code>int</code> là một lỗi thiết kế nên gọi tên</strong> — số 0 đứng đầu biến mất (0912… thành 912…), và số 10 chữ số thì tràn <code>int</code> 32 bit (tối đa 2147483647). Mã thật lưu số điện thoại bằng <code>char[]</code>. Slide đang dạy cú pháp chứ không dạy mô hình dữ liệu, nhưng bài thi nào nhận ra chỗ này thì được điểm.</li>
<li><strong>Khai báo là cấp chỗ ngay lập tức</strong> — <code>eventDate ev;</code> giữ 12 byte trên stack, chưa khởi tạo. Y như <code>int a[5];</code> ở slide 11, các trường chứa rác không đoán trước được cho tới khi bạn ghi vào.</li>
</ul>
<table>
<tr><th>Kiểu</th><th>Các trường</th><th>Tổng cỡ các trường</th><th><code>sizeof</code> đo thật</th><th>Byte đệm</th></tr>
<tr><td><code>eventDate</code></td><td><code>int day, month, year</code></td><td>4+4+4 = 12</td><td><strong>12</strong></td><td>0 — ba trường 4 byte vốn đã thẳng hàng</td></tr>
<tr><td><code>person</code></td><td><code>char name[20]; int age</code></td><td>20+4 = 24</td><td><strong>24</strong></td><td>0 — 20 vốn đã chia hết cho 4</td></tr>
<tr><td><code>struct telephone</code></td><td><code>char name[30]; int number</code></td><td>30+4 = 34</td><td><strong>36</strong></td><td><strong>2</strong> — <code>number</code> bị đẩy từ offset 30 lên 32</td></tr>
</table>
<p class="dap-an">✅ Đo bằng <code>offsetof</code> dưới <code>cc -Wall</code>: <code>eventDate</code> → day@0, month@4, year@8, cỡ 12. <code>person</code> → name@0, age@20, cỡ 24. <code>struct telephone</code> → name@0, <strong>number@32</strong>, cỡ 36. Hàng telephone chính là bằng chứng rằng "liên tục" vẫn cho phép có khoảng hở: byte 30 và 31 thuộc về struct, bị chép theo khi bạn gán, và chứa bất cứ thứ gì có sẵn trong bộ nhớ trước đó.</p>
<p class="meo">💡 Luật canh hàng gói trong một câu: mỗi trường bắt đầu ở độ dời là bội số của chính kích thước nó (4 với <code>int</code>, 8 với <code>double</code>, 1 với <code>char</code>), và tổng cỡ struct được làm tròn lên để một MẢNG các struct ấy vẫn giữ mọi phần tử thẳng hàng. Cứ xếp trường từ lớn tới nhỏ thì phần đệm thường biến mất.</p>`],

      [58, '3. Manipulating Structure Types',
        `<p class="y-chinh">🎯 Two operations, and only two: reach a field with the <strong>direct component selection operator</strong> — the period <code>.</code> — and copy an entire structure with <strong><code>=</code></strong>, which copies each component into the corresponding component of the other structure.</p>
<ul>
<li><strong>The dot needs a struct on its left and a field NAME on its right</strong> — <code>p1.name</code>, <code>p1.age</code>. The right-hand side is never a variable, never an expression, never something you can compute; it is typed literally in the source. That is the deep difference from <code>a[i]</code>, where <code>i</code> is computed at run time.</li>
<li><strong>"The '.' operator has the highest priority"</strong> — true, and it has a practical consequence the slide does not spell out. Because <code>.</code> binds tighter than <code>*</code>, the expression <code>*p.age</code> parses as <code>*(p.age)</code>. With <code>person *p</code> that is a compile error, and the fix is <code>(*p).age</code> or the shorthand <code>p-&gt;age</code>.</li>
<li><strong>Structure assignment is the headline feature</strong> — <code>b = a;</code> copies <em>every byte</em>, including the 20-character <code>name</code> array. Compare with plain arrays, which cannot be assigned at all: <code>arr2 = arr1;</code> does not compile. A struct wrapper is the standard trick for making an array copyable.</li>
<li><strong>The copy is independent</strong> — after <code>b = a; b.age = 21;</code>, <code>a.age</code> is still 20. Measured: <code>a=Mary/20  b=Mary/21</code>. Nothing is shared; this is a value copy, not a reference.</li>
<li><strong>What is NOT on the slide, and is examined anyway</strong> — comparison. There is no <code>==</code> for structs. <code>if (a == b)</code> gives <code>error: invalid operands to binary expression ('eventDate' and 'eventDate')</code>. You must compare field by field.</li>
<li><strong>Why C refuses</strong> — because of the padding bytes from slide 57. The compiler could not say what "equal" means for bytes nobody wrote. It supports <code>=</code> (copying rubbish is harmless) and refuses <code>==</code> (comparing rubbish is not).</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;string.h&gt;

typedef struct { char name[20]; int age; } person;

int soSanh(person x, person y) {                 /* CACH DUNG: so tung truong */
    return strcmp(x.name, y.name) == 0 &amp;&amp; x.age == y.age;
}

int main(void) {
    person a = {"Mary", 20};
    person b;
    b = a;          /* gan nguyen khoi: chep ca 24 byte */
    b.age = 21;     /* doi ban sao, ban goc khong he hay biet */
    printf("a=%s/%d  b=%s/%d\\n", a.name, a.age, b.name, b.age);
    printf("soSanh(a,b) = %d\\n", soSanh(a, b));

    person *p = &amp;a;
    printf("p-&gt;age=%d  (*p).age=%d\\n", p-&gt;age, (*p).age);
    /* printf("%d", *p.age);   &lt;-- LOI: '.' uu tien cao hon '*' */
    return 0;
}</code></pre>
<p class="dap-an">✅ Đáp án (compiled and run): <code>a=Mary/20  b=Mary/21</code> and <code>soSanh(a,b) = 0</code>, then <code>p-&gt;age=20  (*p).age=20</code>. Three facts proved at once: <code>=</code> copied the char array too (b's name really is "Mary"), the copy is independent, and <code>p-&gt;age</code> and <code>(*p).age</code> are the same expression written two ways. The commented-out line was compiled separately and clang said: <em>"member reference type 'person *' is a pointer; did you mean to use '-&gt;'?"</em>.</p>
<p class="pitfall">⚠️ Do not "fix" the missing <code>==</code> with <code>memcmp(&amp;a, &amp;b, sizeof(person))</code>. I measured it on <code>struct {char c; int i;}</code>: two structs whose fields were <em>identical</em> (<code>c='Z'</code>, <code>i=7</code>) gave <code>memcmp</code> = <strong>170</strong>, i.e. "different", purely because the 3 padding bytes held different rubbish. Compare fields, and compare char-array fields with <code>strcmp</code>, never <code>==</code>.</p>`,
        `<p class="y-chinh">🎯 Hai thao tác, và chỉ hai: với tới một trường bằng <strong>toán tử chọn thành phần trực tiếp</strong> — dấu chấm <code>.</code> — và chép nguyên cả cấu trúc bằng <strong><code>=</code></strong>, phép gán này chép từng thành phần sang đúng thành phần tương ứng của struct kia.</p>
<ul>
<li><strong>Dấu chấm cần một struct bên trái và một TÊN trường bên phải</strong> — <code>p1.name</code>, <code>p1.age</code>. Vế phải không bao giờ là biến, không bao giờ là biểu thức, không bao giờ là thứ tính ra được; nó được gõ nguyên văn trong mã nguồn. Đó là khác biệt sâu xa so với <code>a[i]</code>, nơi <code>i</code> được tính lúc chạy.</li>
<li><strong>"Toán tử '.' có độ ưu tiên cao nhất"</strong> — đúng, và nó kéo theo một hệ quả thực tế mà slide không nói ra. Vì <code>.</code> bám chặt hơn <code>*</code>, biểu thức <code>*p.age</code> được hiểu thành <code>*(p.age)</code>. Với <code>person *p</code> thì đó là lỗi biên dịch, và cách chữa là <code>(*p).age</code> hoặc viết tắt <code>p-&gt;age</code>.</li>
<li><strong>Phép gán nguyên khối mới là tính năng đáng nói</strong> — <code>b = a;</code> chép <em>từng byte</em>, kể cả mảng <code>name</code> 20 ký tự. So với mảng trần thì mảng KHÔNG gán được: <code>arr2 = arr1;</code> không biên dịch nổi. Bọc mảng vào một struct chính là mẹo chuẩn để làm cho mảng chép được.</li>
<li><strong>Bản sao là độc lập</strong> — sau <code>b = a; b.age = 21;</code> thì <code>a.age</code> vẫn là 20. Đo thật: <code>a=Mary/20  b=Mary/21</code>. Không có gì dùng chung; đây là chép GIÁ TRỊ chứ không phải tham chiếu.</li>
<li><strong>Thứ KHÔNG có trên slide mà vẫn ra thi</strong> — phép so sánh. Struct không có <code>==</code>. <code>if (a == b)</code> cho <code>error: invalid operands to binary expression ('eventDate' and 'eventDate')</code>. Phải so từng trường.</li>
<li><strong>Vì sao C từ chối</strong> — vì những byte đệm ở slide 57. Trình biên dịch không thể định nghĩa "bằng nhau" cho những byte chẳng ai ghi vào. Nó cho phép <code>=</code> (chép rác thì vô hại) và cấm <code>==</code> (so rác thì không vô hại).</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;string.h&gt;

typedef struct { char name[20]; int age; } person;

int soSanh(person x, person y) {                 /* CACH DUNG: so tung truong */
    return strcmp(x.name, y.name) == 0 &amp;&amp; x.age == y.age;
}

int main(void) {
    person a = {"Mary", 20};
    person b;
    b = a;          /* gan nguyen khoi: chep ca 24 byte */
    b.age = 21;     /* doi ban sao, ban goc khong he hay biet */
    printf("a=%s/%d  b=%s/%d\\n", a.name, a.age, b.name, b.age);
    printf("soSanh(a,b) = %d\\n", soSanh(a, b));

    person *p = &amp;a;
    printf("p-&gt;age=%d  (*p).age=%d\\n", p-&gt;age, (*p).age);
    /* printf("%d", *p.age);   &lt;-- LOI: '.' uu tien cao hon '*' */
    return 0;
}</code></pre>
<p class="dap-an">✅ Đáp án (đã biên dịch và chạy): <code>a=Mary/20  b=Mary/21</code> rồi <code>soSanh(a,b) = 0</code>, sau đó <code>p-&gt;age=20  (*p).age=20</code>. Ba điều được chứng minh cùng lúc: <code>=</code> chép cả mảng ký tự (tên của b đúng là "Mary" thật), bản sao độc lập với bản gốc, và <code>p-&gt;age</code> với <code>(*p).age</code> là cùng một biểu thức viết hai kiểu. Dòng bị chú thích đã được biên dịch riêng và clang nói: <em>"member reference type 'person *' is a pointer; did you mean to use '-&gt;'?"</em>.</p>
<p class="pitfall">⚠️ Đừng "chữa" chỗ thiếu <code>==</code> bằng <code>memcmp(&amp;a, &amp;b, sizeof(person))</code>. Tôi đã đo trên <code>struct {char c; int i;}</code>: hai struct có các trường GIỐNG HỆT nhau (<code>c='Z'</code>, <code>i=7</code>) vẫn cho <code>memcmp</code> = <strong>170</strong>, tức là "khác nhau", chỉ vì 3 byte đệm chứa rác khác nhau. Hãy so từng trường, và các trường mảng ký tự thì so bằng <code>strcmp</code> chứ không bao giờ bằng <code>==</code>.</p>`],

      [59, 'Example 1: Structure Type',
        `<p class="y-chinh">🎯 The first runnable program of the section, 25 lines, and it demonstrates the <strong>two ways to fill a struct</strong>: field by field after declaring it (<code>ev1</code>), and an initialiser list at the moment of declaration (<code>ev2</code>).</p>
<ul>
<li><strong>Lines 3–7 define the type</strong> — <code>typedef struct{ int day; int month; int year; } eventDate;</code>, with the semicolon on line 7 right after <code>} eventDate</code>. This is the form-2 syntax of slide 56.</li>
<li><strong>Line 11 — <code>eventDate ev1;</code></strong> — 12 bytes of stack, all three fields currently holding rubbish. The comment on line 10 says "Declare a variable with struct type".</li>
<li><strong>Lines 14–16 — field by field</strong> — <code>ev1.day = 6; ev1.month = 1; ev1.year = 2025;</code>. Three separate assignments, each using the dot operator from slide 58. Verbose, but it works anywhere in the program, not only at declaration.</li>
<li><strong>Line 19 — initialiser list</strong> — <code>eventDate ev2 = {13, 05, 2025};</code>. The values fill the fields <em>in declaration order</em>: 13→day, 05→month, 2025→year. There are no names here, so swapping two values silently produces a wrong date. This form is only legal <em>at the declaration</em>; writing <code>ev2 = {1,2,3};</code> later is a syntax error.</li>
<li><strong>Lines 21–22 print with <code>%d-%d-%d</code></strong> — three format specifiers, three arguments, each an <code>int</code> field. Notice you cannot print a struct with one specifier; <code>printf</code> has no idea what an <code>eventDate</code> is.</li>
<li><strong>The console on the slide</strong> shows exactly two lines: <code>Day of the first event: 6-1-2025</code> and <code>Day of the second event: 13-5-2025</code>.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

typedef struct{
    int day;
    int month;
    int year;
} eventDate;

int main(){
    // Declare a variable with struct type
    eventDate ev1;

    // Assignment value into the members of 'ev1'
    ev1.day = 6;
    ev1.month = 1;
    ev1.year = 2025;

    // Or: Declare and Initialization
    eventDate ev2 = {13, 05, 2025};

    printf("Day of the first event: %d-%d-%d\\n", ev1.day, ev1.month, ev1.year);
    printf("Day of the second event: %d-%d-%d\\n", ev2.day, ev2.month, ev2.year);

    return 0;
}</code></pre>
<p class="dap-an">✅ Đáp án — typed in exactly as the slide shows it, compiled with <code>cc -Wall</code> (no warnings) and run. Output: <code>Day of the first event: 6-1-2025</code> then <code>Day of the second event: 13-5-2025</code> — identical to the console picture on the slide, including the fact that the second event prints <strong>5</strong> and not <strong>05</strong>, because <code>%d</code> prints the number, not the source text.</p>
<p class="pitfall">⚠️ <code>05</code> in the initialiser is an <strong>octal</strong> constant. Here it is harmless — octal 05 equals decimal 5 — but the habit is dangerous: I compiled the same line with <code>{13, 08, 2025}</code> and clang refused it outright with <code>error: invalid digit '8' in octal constant</code>, and <code>{13, 010, 2025}</code> compiles silently and stores <strong>8</strong>, not 10. Never write a leading zero on a decimal literal.</p>`,
        `<p class="y-chinh">🎯 Chương trình chạy được đầu tiên của phần này, 25 dòng, và nó trình bày <strong>hai cách điền một struct</strong>: gán từng trường sau khi khai (<code>ev1</code>), và liệt kê giá trị ngay lúc khai báo (<code>ev2</code>).</p>
<ul>
<li><strong>Dòng 3–7 định nghĩa kiểu</strong> — <code>typedef struct{ int day; int month; int year; } eventDate;</code>, với dấu chấm phẩy ở dòng 7 ngay sau <code>} eventDate</code>. Đây là cú pháp dạng 2 của slide 56.</li>
<li><strong>Dòng 11 — <code>eventDate ev1;</code></strong> — 12 byte trên stack, cả ba trường hiện đang chứa rác. Chú thích dòng 10 ghi "Declare a variable with struct type".</li>
<li><strong>Dòng 14–16 — gán từng trường</strong> — <code>ev1.day = 6; ev1.month = 1; ev1.year = 2025;</code>. Ba câu lệnh gán riêng, mỗi câu dùng toán tử dấu chấm của slide 58. Dài dòng, nhưng dùng được ở BẤT KỲ đâu trong chương trình chứ không chỉ lúc khai báo.</li>
<li><strong>Dòng 19 — liệt kê khởi tạo</strong> — <code>eventDate ev2 = {13, 05, 2025};</code>. Các giá trị điền vào trường <em>theo đúng thứ tự khai báo</em>: 13→day, 05→month, 2025→year. Ở đây không có tên trường nào, nên đảo hai giá trị là ra một ngày sai mà không ai báo. Dạng này chỉ hợp lệ <em>ngay tại chỗ khai báo</em>; viết <code>ev2 = {1,2,3};</code> ở dòng sau là lỗi cú pháp.</li>
<li><strong>Dòng 21–22 in bằng <code>%d-%d-%d</code></strong> — ba định dạng, ba đối số, mỗi cái là một trường <code>int</code>. Để ý là bạn KHÔNG in được cả struct bằng một định dạng; <code>printf</code> chẳng biết <code>eventDate</code> là cái gì.</li>
<li><strong>Khung console trên slide</strong> hiện đúng hai dòng: <code>Day of the first event: 6-1-2025</code> và <code>Day of the second event: 13-5-2025</code>.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

typedef struct{
    int day;
    int month;
    int year;
} eventDate;

int main(){
    // Khai bao mot bien kieu struct
    eventDate ev1;

    // Gan gia tri vao cac truong cua 'ev1'
    ev1.day = 6;
    ev1.month = 1;
    ev1.year = 2025;

    // Hoac: vua khai bao vua khoi tao
    eventDate ev2 = {13, 05, 2025};

    printf("Day of the first event: %d-%d-%d\\n", ev1.day, ev1.month, ev1.year);
    printf("Day of the second event: %d-%d-%d\\n", ev2.day, ev2.month, ev2.year);

    return 0;
}</code></pre>
<p class="dap-an">✅ Đáp án — gõ lại y hệt slide, biên dịch bằng <code>cc -Wall</code> (không một cảnh báo) rồi chạy. Kết quả: <code>Day of the first event: 6-1-2025</code> rồi <code>Day of the second event: 13-5-2025</code> — trùng khít ảnh console trên slide, kể cả chi tiết sự kiện thứ hai in ra <strong>5</strong> chứ không phải <strong>05</strong>, vì <code>%d</code> in con số chứ không in chữ trong mã nguồn.</p>
<p class="pitfall">⚠️ Số <code>05</code> trong phần khởi tạo là hằng hệ <strong>bát phân</strong> (octal). Ở đây vô hại — 05 hệ 8 bằng 5 hệ 10 — nhưng thói quen ấy nguy hiểm: tôi đã biên dịch đúng dòng ấy với <code>{13, 08, 2025}</code> và clang từ chối thẳng bằng <code>error: invalid digit '8' in octal constant</code>, còn <code>{13, 010, 2025}</code> thì biên dịch êm ru và lưu giá trị <strong>8</strong> chứ không phải 10. Đừng bao giờ viết số 0 đứng đầu một hằng hệ 10.</p>`],

      [60, 'Example 2: Structure Type',
        `<p class="y-chinh">🎯 The same idea as Example 1, but with a <strong>string field</strong> — and that one change forces two new things into the program: <code>#include &lt;string.h&gt;</code> on line 2, and <code>strcpy</code> on line 13. This is the single most examined point of the whole section.</p>
<ul>
<li><strong>Lines 4–7 use the plain form</strong> — <code>struct person{ char name[20]; int age; };</code>, no <code>typedef</code>. So lines 11 and 12 must spell the type in full: <code>struct person p1</code>, <code>struct person p2</code>. Compare with slide 62, which will use <code>typedef</code> for the same shape.</li>
<li><strong>Line 11 — initialiser list including a string</strong> — <code>struct person p1 = {"Mary", 20};</code>. This works, and it is the <em>only</em> place a bare string literal may be written into a char-array field. The compiler copies the characters plus the terminating <code>'\\0'</code> into the 20 bytes at declaration time.</li>
<li><strong>Lines 12–14 — the same job after declaration</strong> — <code>struct person p2;</code> then <code>strcpy(p2.name, "Paul");</code> then <code>p2.age = 22;</code>. Note the asymmetry: <code>age</code> is filled with <code>=</code>, <code>name</code> cannot be.</li>
<li><strong>Why <code>p2.name = "Paul";</code> is impossible</strong> — <code>p2.name</code> is an <em>array</em>, and arrays are not assignable in C. I compiled that exact line: <code>error: array type 'char[20]' is not assignable</code>. The rule from slide 58 ("a struct can be assigned") does not extend to an array field on its own.</li>
<li><strong><code>strcpy</code> copies characters until it copies the <code>'\\0'</code></strong> — that is why the destination must be big enough. <code>"Paul"</code> is 4 characters + terminator = 5 bytes into a 20-byte field: fine. A 25-character name would run past the field and corrupt <code>age</code>, silently. Slot 16–18 covers <code>strncpy</code> and the safe version.</li>
<li><strong>Printing uses <code>%s</code> for the array and <code>%d</code> for the int</strong> — <code>printf("First person -&gt; Name: %s, Age: %d\\n", p1.name, p1.age);</code>. <code>p1.name</code> decays to a pointer to its first character, which is exactly what <code>%s</code> wants.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;string.h&gt;

struct person{
    char name[20];
    int age;
};

int main(){
    // Declare and Initialization
    struct person p1 = {"Mary", 20};
    struct person p2;
    strcpy(p2.name, "Paul");   // Copy 'Paul' to name of p2
    p2.age = 22;

    printf("First person -&gt; Name: %s, Age: %d\\n", p1.name, p1.age);
    printf("Second person -&gt; Name: %s, Age: %d\\n", p2.name, p2.age);

    return 0;
}</code></pre>
<p class="dap-an">✅ Đáp án — compiled with <code>cc -Wall</code> and run: <code>First person -&gt; Name: Mary, Age: 20</code> then <code>Second person -&gt; Name: Paul, Age: 22</code>, matching the slide's console window line for line. I also compiled the forbidden variant <code>p2.name = "Paul";</code> on its own: clang stops with <code>error: array type 'char[20]' is not assignable</code>, pointing at the <code>=</code>.</p>
<p class="meo">💡 The rule to carry into the exam, in four words: <strong>numbers use <code>=</code>, strings use <code>strcpy</code></strong>. And the matching rule for comparison: numbers use <code>==</code>, strings use <code>strcmp</code>. Every struct exercise in PRF192 that involves a name is testing exactly these two lines.</p>`,
        `<p class="y-chinh">🎯 Cùng ý với Example 1, nhưng có thêm một <strong>trường chuỗi</strong> — và chỉ một thay đổi ấy kéo theo hai thứ mới vào chương trình: <code>#include &lt;string.h&gt;</code> ở dòng 2, và <code>strcpy</code> ở dòng 13. Đây là điểm bị hỏi nhiều nhất trong cả phần này.</p>
<ul>
<li><strong>Dòng 4–7 dùng dạng thuần</strong> — <code>struct person{ char name[20]; int age; };</code>, không có <code>typedef</code>. Nên dòng 11 và 12 phải viết đủ tên kiểu: <code>struct person p1</code>, <code>struct person p2</code>. So với slide 62 sẽ dùng <code>typedef</code> cho đúng cấu trúc ấy.</li>
<li><strong>Dòng 11 — liệt kê khởi tạo có cả chuỗi</strong> — <code>struct person p1 = {"Mary", 20};</code>. Cách này chạy được, và đây là chỗ DUY NHẤT được viết thẳng một hằng chuỗi vào trường mảng ký tự. Trình biên dịch chép các ký tự cộng dấu kết thúc <code>'\\0'</code> vào 20 byte ấy ngay lúc khai báo.</li>
<li><strong>Dòng 12–14 — cũng việc ấy nhưng sau khi đã khai báo</strong> — <code>struct person p2;</code> rồi <code>strcpy(p2.name, "Paul");</code> rồi <code>p2.age = 22;</code>. Để ý sự bất đối xứng: <code>age</code> điền bằng <code>=</code>, còn <code>name</code> thì không được.</li>
<li><strong>Vì sao <code>p2.name = "Paul";</code> là bất khả</strong> — <code>p2.name</code> là một <em>mảng</em>, mà mảng trong C không gán được. Tôi đã biên dịch đúng dòng đó: <code>error: array type 'char[20]' is not assignable</code>. Luật ở slide 58 ("struct gán được") KHÔNG lan sang một trường mảng đứng riêng.</li>
<li><strong><code>strcpy</code> chép ký tự cho tới khi chép xong dấu <code>'\\0'</code></strong> — vì thế đích phải đủ lớn. <code>"Paul"</code> là 4 ký tự + dấu kết = 5 byte đổ vào trường 20 byte: thoải mái. Một cái tên 25 ký tự sẽ tràn qua khỏi trường và đè chết <code>age</code>, âm thầm. Slot 16–18 sẽ dạy <code>strncpy</code> và bản an toàn.</li>
<li><strong>In ra dùng <code>%s</code> cho mảng và <code>%d</code> cho số nguyên</strong> — <code>printf("First person -&gt; Name: %s, Age: %d\\n", p1.name, p1.age);</code>. <code>p1.name</code> tự suy biến thành con trỏ tới ký tự đầu, đúng thứ mà <code>%s</code> cần.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;string.h&gt;

struct person{
    char name[20];
    int age;
};

int main(){
    // Vua khai bao vua khoi tao
    struct person p1 = {"Mary", 20};
    struct person p2;
    strcpy(p2.name, "Paul");   // Chep 'Paul' vao name cua p2
    p2.age = 22;

    printf("First person -&gt; Name: %s, Age: %d\\n", p1.name, p1.age);
    printf("Second person -&gt; Name: %s, Age: %d\\n", p2.name, p2.age);

    return 0;
}</code></pre>
<p class="dap-an">✅ Đáp án — biên dịch bằng <code>cc -Wall</code> và chạy: <code>First person -&gt; Name: Mary, Age: 20</code> rồi <code>Second person -&gt; Name: Paul, Age: 22</code>, khớp từng dòng với cửa sổ console trên slide. Tôi cũng biên dịch riêng biến thể bị cấm <code>p2.name = "Paul";</code>: clang dừng lại với <code>error: array type 'char[20]' is not assignable</code>, trỏ đúng vào dấu <code>=</code>.</p>
<p class="meo">💡 Luật mang vào phòng thi, gói trong bốn chữ: <strong>số thì <code>=</code>, chuỗi thì <code>strcpy</code></strong>. Và luật sóng đôi cho phép so sánh: số thì <code>==</code>, chuỗi thì <code>strcmp</code>. Mọi bài tập struct trong PRF192 có dính cái tên đều đang kiểm tra đúng hai dòng luật này.</p>`],

      [61, '4. Arrays of Structures',
        `<p class="y-chinh">🎯 The combination that makes the whole section practical: the array syntax <code>dataType array_name[size];</code> is unchanged, and the slide's point is that <strong><code>dataType</code> can be any C type <em>including a struct type</em></strong>. Everything you learned in slides 6–24 applies unchanged.</p>
<ul>
<li><strong>"Recall the syntax of an array"</strong> — the slide deliberately quotes slide 7 verbatim. Nothing new is being introduced; a struct is a type, and arrays are made of types.</li>
<li><strong>"Can be simply manipulated as arrays of simple data types"</strong> — the same <code>for (i=0; i&lt;n; i++)</code> traversal from slide 12, the same linear search from slide 26, the same "pass the pointer and the count" function signature from slide 13. Only the thing inside each box changed.</li>
<li><strong>Two selectors now stack</strong> — <code>family[2].name</code> reads "element 2 of the array, then the <code>name</code> field of it". Left to right, index first, dot second. <code>family.name[2]</code> is meaningless and will not compile.</li>
<li><strong>Element spacing is <code>sizeof(struct)</code>, not the sum of the fields</strong> — I measured <code>person arr[3]</code>: <code>&amp;arr[0] = 0x16d1a6368</code> and <code>&amp;arr[1] = 0x16d1a6380</code>, exactly <strong>24</strong> bytes apart, which is <code>sizeof(person)</code>. The pointer arithmetic of slide 19 still holds, with the struct as the base type.</li>
<li><strong>The exercise on the slide</strong> — <em>"organize information, includes: name and age of three family members. Print out the information for all members on each line."</em> Three records, so <code>person family[3];</code> and three output lines. Slide 62 is the answer.</li>
<li><strong>Why this replaces parallel arrays for good</strong> — sorting the family by age moves whole <code>person</code> values with one temporary <code>person tmp;</code> and three assignments. With parallel arrays you would need to swap two arrays in lockstep and the first forgotten swap corrupts the data set silently.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;string.h&gt;

typedef struct { char name[20]; int age; } person;

int main(void) {
    person family[3] = { {"John", 30}, {"Sara", 28}, {"David", 3} };
    int i, j;
    person tmp;

    /* sap xep tang dan theo tuoi — DOI CA BAN GHI, khong the lech du lieu */
    for (i = 0; i &lt; 2; i++)
        for (j = i + 1; j &lt; 3; j++)
            if (family[j].age &lt; family[i].age) {
                tmp = family[i];        /* gan nguyen khoi, slide 58 */
                family[i] = family[j];
                family[j] = tmp;
            }

    for (i = 0; i &lt; 3; i++)
        printf("%-8s %d\\n", family[i].name, family[i].age);

    printf("sizeof(person)=%zu, buoc giua hai phan tu = %ld byte\\n",
           sizeof(person), (long)((char *)&amp;family[1] - (char *)&amp;family[0]));
    return 0;
}</code></pre>
<p class="dap-an">✅ Đáp án — compiled with <code>cc -Wall</code> and run: the sorted output is <code>David 3</code>, <code>Sara 28</code>, <code>John 30</code>, and the last line reports <code>sizeof(person)=24, buoc giua hai phan tu = 24 byte</code>. The three-line swap moved the 20-byte name and the age together; no <code>strcpy</code> was needed anywhere in the sort, because struct assignment already copies the string field.</p>
<p class="meo">💡 Read a mixed expression right-to-left to find its type, left-to-right to find its value. <code>family[1].age</code>: left-to-right it is "take element 1, take its age"; right-to-left the outermost thing is <code>.age</code>, so the whole expression is an <code>int</code> and can go anywhere an <code>int</code> can — including <code>scanf("%d", &amp;family[1].age)</code>.</p>`,
        `<p class="y-chinh">🎯 Sự kết hợp làm cả phần này trở nên dùng được: cú pháp mảng <code>dataType array_name[size];</code> không đổi, và ý của slide là <strong><code>dataType</code> có thể là BẤT KỲ kiểu C nào, <em>kể cả kiểu struct</em></strong>. Mọi thứ bạn học ở slide 6–24 áp dụng nguyên xi.</p>
<ul>
<li><strong>"Nhắc lại cú pháp mảng"</strong> — slide cố ý trích nguyên văn slide 7. Không có gì mới được đưa vào; struct là một kiểu, mà mảng thì làm từ các kiểu.</li>
<li><strong>"Thao tác đơn giản y như mảng các kiểu cơ bản"</strong> — vẫn vòng duyệt <code>for (i=0; i&lt;n; i++)</code> của slide 12, vẫn tìm tuyến tính của slide 26, vẫn chữ ký hàm "truyền con trỏ kèm số phần tử" của slide 13. Chỉ có thứ nằm trong mỗi ô là đổi.</li>
<li><strong>Giờ có hai bộ chọn xếp chồng</strong> — <code>family[2].name</code> đọc là "phần tử 2 của mảng, rồi trường <code>name</code> của nó". Trái sang phải, chỉ số trước, dấu chấm sau. <code>family.name[2]</code> vô nghĩa và không biên dịch được.</li>
<li><strong>Khoảng cách giữa hai phần tử là <code>sizeof(struct)</code> chứ không phải tổng cỡ các trường</strong> — tôi đo trên <code>person arr[3]</code>: <code>&amp;arr[0] = 0x16d1a6368</code> và <code>&amp;arr[1] = 0x16d1a6380</code>, cách đúng <strong>24</strong> byte, bằng <code>sizeof(person)</code>. Số học con trỏ ở slide 19 vẫn đúng, chỉ là kiểu cơ sở bây giờ là struct.</li>
<li><strong>Bài tập trên slide</strong> — <em>"tổ chức thông tin gồm tên và tuổi của ba thành viên gia đình. In thông tin của tất cả thành viên, mỗi người một dòng."</em> Ba bản ghi, nên <code>person family[3];</code> và ba dòng kết quả. Slide 62 chính là lời giải.</li>
<li><strong>Vì sao nó thay thế hẳn các mảng song song</strong> — sắp xếp gia đình theo tuổi chỉ cần một biến tạm <code>person tmp;</code> và ba phép gán để dời nguyên cả bản ghi. Với mảng song song thì phải hoán vị hai mảng đồng bộ, và chỉ một lần quên là cả tập dữ liệu hỏng âm thầm.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;string.h&gt;

typedef struct { char name[20]; int age; } person;

int main(void) {
    person family[3] = { {"John", 30}, {"Sara", 28}, {"David", 3} };
    int i, j;
    person tmp;

    /* sap xep tang dan theo tuoi — DOI CA BAN GHI, khong the lech du lieu */
    for (i = 0; i &lt; 2; i++)
        for (j = i + 1; j &lt; 3; j++)
            if (family[j].age &lt; family[i].age) {
                tmp = family[i];        /* gan nguyen khoi, slide 58 */
                family[i] = family[j];
                family[j] = tmp;
            }

    for (i = 0; i &lt; 3; i++)
        printf("%-8s %d\\n", family[i].name, family[i].age);

    printf("sizeof(person)=%zu, buoc giua hai phan tu = %ld byte\\n",
           sizeof(person), (long)((char *)&amp;family[1] - (char *)&amp;family[0]));
    return 0;
}</code></pre>
<p class="dap-an">✅ Đáp án — biên dịch bằng <code>cc -Wall</code> và chạy: kết quả sau khi sắp xếp là <code>David 3</code>, <code>Sara 28</code>, <code>John 30</code>, và dòng cuối báo <code>sizeof(person)=24, buoc giua hai phan tu = 24 byte</code>. Ba dòng hoán vị đã dời cả cái tên 20 byte lẫn tuổi đi cùng nhau; không cần một lệnh <code>strcpy</code> nào trong toàn bộ phép sắp xếp, vì phép gán struct đã chép sẵn trường chuỗi.</p>
<p class="meo">💡 Đọc một biểu thức lai từ phải sang trái để biết KIỂU của nó, từ trái sang phải để biết GIÁ TRỊ. <code>family[1].age</code>: trái sang phải là "lấy phần tử 1, lấy tuổi của nó"; phải sang trái thì thứ ngoài cùng là <code>.age</code>, nên cả biểu thức là một <code>int</code> và đặt được ở mọi chỗ mà <code>int</code> đặt được — kể cả <code>scanf("%d", &amp;family[1].age)</code>.</p>`],

      [62, 'Example 1: Array of Structures',
        `<p class="y-chinh">🎯 The answer to slide 61's exercise, 21 lines, plus a picture that is the real lesson: a table of three rows, with <code>family[2].name</code> pointing at a <em>cell in the name column</em> and <code>family[1].age</code> pointing at a <em>cell in the age column</em>. Index picks the row; the dot picks the column.</p>
<ul>
<li><strong>Lines 3–6 — <code>typedef struct{ char name[20]; int age; } person;</code></strong> — the same shape as Example 2 but with <code>typedef</code>, so line 10 can read <code>person family[3];</code> instead of <code>struct person family[3];</code>.</li>
<li><strong>Line 10 declares the array</strong> — three <code>person</code> values back to back. Measured: 24 bytes each, 72 bytes in total, one contiguous block exactly as slide 4 promised for any contiguous storage.</li>
<li><strong>Lines 12–14 fill it, two statements per line</strong> — <code>strcpy(family[0].name, "John"); family[0].age = 30;</code>. Again the string needs <code>strcpy</code> and the number needs <code>=</code>; that is why <code>&lt;string.h&gt;</code> is included on line 2.</li>
<li><strong>Lines 16–18 print three fixed lines</strong> — the program hard-codes "Father", "Mother", "Son" and indices 0, 1, 2. With only three members that is acceptable; for the 100 accounts of the Case Study it becomes a <code>for</code> loop, which is exactly the step slide 67 takes.</li>
<li><strong>The console on the slide</strong> reads <code>Father -&gt; Name: John, Age: 30</code>, <code>Mother -&gt; Name: Sara, Age: 28</code>, <code>Son -&gt; Name: David, Age: 3</code>.</li>
<li><strong>The arrows in the table are worth copying into your notes</strong> — they name the two selectors separately. Many exam questions give you a table exactly like this one and ask "write the expression that reads the highlighted cell".</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
typedef struct{
    char name[20];
    int age;
} person;

int main(){
    // Declare an array of structure
    person family[3];

    strcpy(family[0].name, "John");  family[0].age = 30;
    strcpy(family[1].name, "Sara");  family[1].age = 28;
    strcpy(family[2].name, "David"); family[2].age = 3;

    printf("Father -&gt; Name: %s, Age: %d\\n", family[0].name, family[0].age);
    printf("Mother -&gt; Name: %s, Age: %d\\n", family[1].name, family[1].age);
    printf("Son -&gt; Name: %s, Age: %d\\n", family[2].name, family[2].age);

    return 0;
}</code></pre>
<p class="dap-an">✅ Đáp án — typed from the slide, compiled with <code>cc -Wall</code>, run: <code>Father -&gt; Name: John, Age: 30</code> / <code>Mother -&gt; Name: Sara, Age: 28</code> / <code>Son -&gt; Name: David, Age: 3</code> — identical to the console picture. Reading the highlighted cells: <code>family[2].name</code> is <code>"David"</code> and <code>family[1].age</code> is <code>28</code>.</p>
<p class="pitfall">⚠️ <strong>The slide contradicts itself, and it is worth knowing which half to trust.</strong> The code on line 14 says <code>family[2].age = 3;</code> and the console window prints <code>Age: 3</code>, but the illustration table on the right of the slide shows David's age as <strong>2</strong>. Two of the three agree, and the code is the one that actually ran, so the correct answer is <strong>3</strong>; the table cell is a leftover from an earlier version. I am reporting the mismatch rather than quietly copying either number — and in an exam, if a diagram disagrees with the code, the code wins.</p>`,
        `<p class="y-chinh">🎯 Lời giải cho bài tập slide 61, 21 dòng, kèm một hình vẽ mới là bài học thật: một bảng ba dòng, với <code>family[2].name</code> chỉ vào một <em>ô ở cột name</em> và <code>family[1].age</code> chỉ vào một <em>ô ở cột age</em>. Chỉ số chọn DÒNG; dấu chấm chọn CỘT.</p>
<ul>
<li><strong>Dòng 3–6 — <code>typedef struct{ char name[20]; int age; } person;</code></strong> — vẫn cấu trúc như Example 2 nhưng có <code>typedef</code>, nhờ đó dòng 10 viết được <code>person family[3];</code> thay vì <code>struct person family[3];</code>.</li>
<li><strong>Dòng 10 khai mảng</strong> — ba giá trị <code>person</code> nằm sát nhau. Đo thật: mỗi cái 24 byte, tổng 72 byte, một khối liên tục đúng như slide 4 đã hứa cho mọi kiểu bộ nhớ liên tục.</li>
<li><strong>Dòng 12–14 điền dữ liệu, mỗi dòng hai câu lệnh</strong> — <code>strcpy(family[0].name, "John"); family[0].age = 30;</code>. Lại là chuỗi cần <code>strcpy</code> còn số cần <code>=</code>; đó là lý do dòng 2 phải include <code>&lt;string.h&gt;</code>.</li>
<li><strong>Dòng 16–18 in ba dòng cố định</strong> — chương trình viết cứng "Father", "Mother", "Son" và chỉ số 0, 1, 2. Với ba thành viên thì chấp nhận được; với 100 tài khoản của Case Study thì phải thành vòng <code>for</code>, và đó đúng là bước mà slide 67 làm.</li>
<li><strong>Khung console trên slide</strong> ghi <code>Father -&gt; Name: John, Age: 30</code>, <code>Mother -&gt; Name: Sara, Age: 28</code>, <code>Son -&gt; Name: David, Age: 3</code>.</li>
<li><strong>Hai mũi tên trong bảng đáng chép vào vở</strong> — chúng gọi tên riêng hai bộ chọn. Rất nhiều câu hỏi thi đưa ra đúng một bảng như vậy rồi hỏi "viết biểu thức đọc ô được tô màu".</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
typedef struct{
    char name[20];
    int age;
} person;

int main(){
    // Khai bao mot mang cac struct
    person family[3];

    strcpy(family[0].name, "John");  family[0].age = 30;
    strcpy(family[1].name, "Sara");  family[1].age = 28;
    strcpy(family[2].name, "David"); family[2].age = 3;

    printf("Father -&gt; Name: %s, Age: %d\\n", family[0].name, family[0].age);
    printf("Mother -&gt; Name: %s, Age: %d\\n", family[1].name, family[1].age);
    printf("Son -&gt; Name: %s, Age: %d\\n", family[2].name, family[2].age);

    return 0;
}</code></pre>
<p class="dap-an">✅ Đáp án — gõ từ slide, biên dịch bằng <code>cc -Wall</code>, chạy: <code>Father -&gt; Name: John, Age: 30</code> / <code>Mother -&gt; Name: Sara, Age: 28</code> / <code>Son -&gt; Name: David, Age: 3</code> — giống hệt ảnh console. Đọc hai ô được tô: <code>family[2].name</code> là <code>"David"</code> và <code>family[1].age</code> là <code>28</code>.</p>
<p class="pitfall">⚠️ <strong>Slide này TỰ MÂU THUẪN, và cần biết nửa nào đáng tin.</strong> Mã ở dòng 14 ghi <code>family[2].age = 3;</code> và cửa sổ console in <code>Age: 3</code>, nhưng bảng minh hoạ bên phải slide lại ghi tuổi của David là <strong>2</strong>. Hai trên ba chỗ khớp nhau, và mã mới là thứ đã thật sự chạy, nên đáp án đúng là <strong>3</strong>; ô trong bảng là tàn dư của một bản slide cũ. Tôi nêu chỗ lệch ra chứ không im lặng chép lại con số nào — và trong phòng thi, hễ hình vẽ cãi nhau với mã nguồn thì mã nguồn thắng.</p>`],

      [63, '5. Function with a Structure Input Parameter',
        `<p class="y-chinh">🎯 One sentence with a large consequence: <em>"When a structure variable is passed as an input argument to a function, <strong>all its component values are copied</strong> into the local structure variable."</em> The syntax box is plain — <code>dataType functionName(structName parameter){ … }</code> — but the copy is the examinable part.</p>
<ul>
<li><strong>This is the pass-by-value rule of slide 22, applied to a bigger value</strong> — Slot 10 proved that <code>swap1(a, b)</code> cannot change the caller's variables. A struct parameter behaves identically: the function gets its own copy, edits it, and the copy dies at <code>return</code>.</li>
<li><strong>The contrast with arrays is the trap</strong> — an array parameter is <em>not</em> copied; <code>void input(int a[], int n)</code> receives a pointer, so it can and does modify the caller's array (slide 13). Put that same array inside a struct and the behaviour flips: now the whole thing is copied and the caller is protected. Same data, opposite semantics, purely because of the wrapper.</li>
<li><strong>How much is copied</strong> — <code>sizeof(struct)</code> bytes per call, measured earlier: 24 for <code>person</code>, 28 for the Case Study's <code>student</code>, 72 for <code>accountCustomer</code>. Slide 68 will call <code>printAccount(accounts[i])</code> inside a loop, so a 100-account list copies 7 200 bytes just to print.</li>
<li><strong>The cheap alternative</strong> — <code>void printAccount(const accountCustomer *acc)</code> passes 8 bytes instead of 72, and the <code>const</code> says "I will not modify the original". Inside, every <code>acc.field</code> becomes <code>acc-&gt;field</code>. This is the professional habit; the slide shows the by-value form because it is simpler to read first.</li>
<li><strong>The word "input" in the title is doing work</strong> — a by-value struct parameter is an <em>input only</em>. If the function must give a record back, either <code>return</code> a struct (legal in C — unlike returning an array) or take a pointer.</li>
<li><strong>The exercise stated on this slide</strong> — <em>"print a student's information including: id, name, age. Use a structure … and use a function with a parameter of type structure"</em>. Slide 64 is the answer.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;string.h&gt;

typedef struct { char name[20]; int age; } person;

void grow(person p)      { p.age = 99; strcpy(p.name, "Changed"); }   /* ban SAO */
void growP(person *p)    { p-&gt;age = 99; strcpy(p-&gt;name, "Changed"); } /* ban GOC */

int main(void) {
    person s = {"Tom", 20};
    grow(s);
    printf("sau grow(s):   %s/%d\\n", s.name, s.age);
    growP(&amp;s);
    printf("sau growP(&amp;s): %s/%d\\n", s.name, s.age);
    printf("moi loi goi theo gia tri chep %zu byte\\n", sizeof(person));
    return 0;
}</code></pre>
<p class="dap-an">✅ Đáp án — compiled with <code>cc -Wall</code> and run: <code>sau grow(s):   Tom/20</code> then <code>sau growP(&amp;s): Changed/99</code>, and <code>moi loi goi theo gia tri chep 24 byte</code>. The by-value function did everything right internally and still changed nothing outside — exactly the <code>swap1</code> result from Slot 10, now with 24 bytes being thrown away instead of 4.</p>
<p class="meo">💡 Decide with one question: <em>does the function need to change the record?</em> No → pass by value (simple, safe) or better <code>const T *</code> (cheap and safe). Yes → you have no choice, pass <code>T *</code>. And a struct, unlike an array, may also be <code>return</code>ed by value — <code>person makePerson(...)</code> is perfectly legal C.</p>`,
        `<p class="y-chinh">🎯 Một câu với hệ quả rất lớn: <em>"Khi một biến struct được truyền vào hàm làm đối số đầu vào, <strong>toàn bộ giá trị các thành phần của nó được CHÉP</strong> vào biến struct cục bộ."</em> Khung cú pháp thì đơn giản — <code>dataType functionName(structName parameter){ … }</code> — nhưng cú sao chép mới là chỗ ra thi.</p>
<ul>
<li><strong>Đây chính là luật truyền theo giá trị của slide 22, áp cho một giá trị to hơn</strong> — Slot 10 đã chứng minh <code>swap1(a, b)</code> không đổi được biến của hàm gọi. Tham số struct hành xử y hệt: hàm nhận bản sao của riêng nó, sửa bản sao, rồi bản sao chết lúc <code>return</code>.</li>
<li><strong>Chỗ tương phản với mảng mới là cái bẫy</strong> — tham số mảng thì KHÔNG được chép; <code>void input(int a[], int n)</code> nhận một con trỏ, nên nó sửa được (và có sửa) mảng của hàm gọi (slide 13). Đem đúng cái mảng ấy bỏ vào trong một struct thì hành vi lật ngược: giờ cả khối bị chép và hàm gọi được bảo vệ. Cùng dữ liệu, ngữ nghĩa ngược nhau, chỉ vì cái vỏ bọc.</li>
<li><strong>Chép bao nhiêu</strong> — <code>sizeof(struct)</code> byte mỗi lời gọi, đã đo ở trên: 24 với <code>person</code>, 28 với <code>student</code> của Case Study, 72 với <code>accountCustomer</code>. Slide 68 sẽ gọi <code>printAccount(accounts[i])</code> trong vòng lặp, nên một danh sách 100 tài khoản chép mất 7 200 byte chỉ để in.</li>
<li><strong>Cách rẻ hơn</strong> — <code>void printAccount(const accountCustomer *acc)</code> truyền 8 byte thay vì 72, và chữ <code>const</code> nói rõ "tôi sẽ không sửa bản gốc". Bên trong, mọi <code>acc.trường</code> thành <code>acc-&gt;trường</code>. Đây là thói quen của dân chuyên nghiệp; slide trình bày dạng theo giá trị vì nó dễ đọc hơn khi mới học.</li>
<li><strong>Chữ "input" trong tiêu đề đang gánh việc</strong> — tham số struct theo giá trị chỉ là ĐẦU VÀO. Nếu hàm phải trả một bản ghi ra, thì hoặc <code>return</code> một struct (hợp lệ trong C — khác với trả về mảng), hoặc nhận một con trỏ.</li>
<li><strong>Đề bài ghi trên slide này</strong> — <em>"in thông tin sinh viên gồm: id, name, age. Dùng một struct … và dùng một hàm có tham số kiểu struct"</em>. Slide 64 là lời giải.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;string.h&gt;

typedef struct { char name[20]; int age; } person;

void grow(person p)      { p.age = 99; strcpy(p.name, "Changed"); }   /* ban SAO */
void growP(person *p)    { p-&gt;age = 99; strcpy(p-&gt;name, "Changed"); } /* ban GOC */

int main(void) {
    person s = {"Tom", 20};
    grow(s);
    printf("sau grow(s):   %s/%d\\n", s.name, s.age);
    growP(&amp;s);
    printf("sau growP(&amp;s): %s/%d\\n", s.name, s.age);
    printf("moi loi goi theo gia tri chep %zu byte\\n", sizeof(person));
    return 0;
}</code></pre>
<p class="dap-an">✅ Đáp án — biên dịch bằng <code>cc -Wall</code> và chạy: <code>sau grow(s):   Tom/20</code> rồi <code>sau growP(&amp;s): Changed/99</code>, và <code>moi loi goi theo gia tri chep 24 byte</code>. Hàm theo giá trị làm mọi thứ đúng ở bên trong mà rốt cuộc không đổi được gì bên ngoài — đúng kết quả <code>swap1</code> của Slot 10, chỉ khác là bây giờ 24 byte bị vứt đi thay vì 4.</p>
<p class="meo">💡 Quyết định bằng một câu hỏi: <em>hàm có cần SỬA bản ghi không?</em> Không → truyền theo giá trị (đơn giản, an toàn) hoặc tốt hơn là <code>const T *</code> (rẻ và an toàn). Có → không có lựa chọn nào khác, truyền <code>T *</code>. Và struct, khác với mảng, còn <code>return</code> được theo giá trị — <code>person makePerson(...)</code> là C hoàn toàn hợp lệ.</p>`],

      [64, 'Function with a Structure Input Parameter: Example 2',
        `<p class="y-chinh">🎯 26 lines that answer slide 63: a <code>student</code> struct with three fields of three different types, one function <code>void printStudent(student s)</code> that takes the whole record, and a <code>main</code> that fills one student and prints it.</p>
<ul>
<li><strong>Lines 5–9 — the type</strong> — <code>typedef struct{ int id; char name[20]; char grade; } student;</code>. Three types in one record: an <code>int</code>, a 20-byte array and a single <code>char</code>. This is the "possibly different types" of slide 54 in its clearest form.</li>
<li><strong>Lines 11–13 — the function</strong> — one <code>printf</code> reading <code>s.id</code>, <code>s.name</code> and <code>s.grade</code> with <code>%d</code>, <code>%s</code> and <code>%c</code>. Three fields, three different specifiers; getting <code>%c</code> and <code>%s</code> the wrong way round is a classic crash, because <code>%s</code> on a single char makes <code>printf</code> chase a pointer made from the letter's code.</li>
<li><strong>Line 19 — three assignments on one line</strong> — <code>s1.id = 1001; strcpy(s1.name, "Tom"); s1.grade = 'A';</code>. Look at the three forms side by side: <code>=</code> for the number, <code>strcpy</code> for the string, and <code>=</code> with <strong>single quotes</strong> for the char. <code>'A'</code> is a character; <code>"A"</code> is a 2-byte string and would not compile here.</li>
<li><strong>Line 22 — <code>printStudent(s1);</code></strong> — 28 bytes copied onto the function's stack frame (measured). The function then reads its own copy; <code>s1</code> could not be modified even if <code>printStudent</code> tried.</li>
<li><strong>Line 24 — <code>system("pause")</code></strong> — Windows-only, and it is why <code>&lt;stdlib.h&gt;</code> is included on line 3. It is also why the slide's console ends with "Press any key to continue . . .". On Linux/macOS delete the line and the include.</li>
<li><strong>The console on the slide</strong> — <code>Student Information:</code> then <code>Id: 1001, Name: Tom, Grade: A</code>.</li>
</ul>
<table>
<tr><th>Field</th><th>Type</th><th>Offset (<code>offsetof</code>)</th><th>Size</th><th>Note</th></tr>
<tr><td><code>id</code></td><td><code>int</code></td><td>0</td><td>4</td><td>starts the struct</td></tr>
<tr><td><code>name</code></td><td><code>char[20]</code></td><td>4</td><td>20</td><td>ends at byte 24</td></tr>
<tr><td><code>grade</code></td><td><code>char</code></td><td>24</td><td>1</td><td>fields end at byte 25</td></tr>
<tr><td colspan="2"><strong><code>sizeof(student)</code></strong></td><td colspan="3"><strong>28</strong> — 3 tail padding bytes (25 rounded up to a multiple of 4)</td></tr>
</table>
<p class="dap-an">✅ Đáp án — compiled with <code>cc -Wall</code> (after removing <code>system("pause")</code>) and run: <code>Student Information:</code> then <code>Id: 1001, Name: Tom, Grade: A</code>, matching the slide exactly. Measured with <code>offsetof</code>: id@0, name@4, grade@24, and <code>sizeof(student)</code> = <strong>28</strong>, not 25 — three bytes of tail padding exist so that in a <code>student[100]</code> array every <code>id</code> still lands on a 4-byte boundary.</p>
<p class="pitfall">⚠️ The slide is inconsistent with its own exercise. Slide 63 asks to print "id, name, <strong>age</strong>", but the code here declares <strong><code>char grade</code></strong> and prints a grade. Both are valid programs; just answer the version the question in front of you actually asks for. If your exam says "age", make it <code>int age</code> and print with <code>%d</code>.</p>`,
        `<p class="y-chinh">🎯 26 dòng trả lời cho slide 63: một struct <code>student</code> với ba trường thuộc ba kiểu khác nhau, một hàm <code>void printStudent(student s)</code> nhận nguyên cả bản ghi, và một <code>main</code> điền một sinh viên rồi in ra.</p>
<ul>
<li><strong>Dòng 5–9 — cái kiểu</strong> — <code>typedef struct{ int id; char name[20]; char grade; } student;</code>. Ba kiểu trong một bản ghi: một <code>int</code>, một mảng 20 byte và một <code>char</code> đơn lẻ. Đây là cụm "có thể khác kiểu" của slide 54 ở dạng rõ ràng nhất.</li>
<li><strong>Dòng 11–13 — cái hàm</strong> — một lệnh <code>printf</code> đọc <code>s.id</code>, <code>s.name</code> và <code>s.grade</code> bằng <code>%d</code>, <code>%s</code> và <code>%c</code>. Ba trường, ba định dạng khác nhau; đảo nhầm <code>%c</code> với <code>%s</code> là một kiểu sập chương trình kinh điển, vì <code>%s</code> đặt lên một ký tự đơn sẽ khiến <code>printf</code> đuổi theo một con trỏ dựng từ mã của chữ cái đó.</li>
<li><strong>Dòng 19 — ba phép gán trên một dòng</strong> — <code>s1.id = 1001; strcpy(s1.name, "Tom"); s1.grade = 'A';</code>. Hãy nhìn ba dạng đặt cạnh nhau: <code>=</code> cho số, <code>strcpy</code> cho chuỗi, và <code>=</code> với <strong>nháy đơn</strong> cho ký tự. <code>'A'</code> là một ký tự; <code>"A"</code> là một chuỗi 2 byte và đặt vào đây thì không biên dịch được.</li>
<li><strong>Dòng 22 — <code>printStudent(s1);</code></strong> — 28 byte được chép vào khung ngăn xếp của hàm (đã đo). Sau đó hàm đọc bản sao của chính nó; <code>s1</code> không thể bị sửa kể cả khi <code>printStudent</code> có ý định đó.</li>
<li><strong>Dòng 24 — <code>system("pause")</code></strong> — chỉ có trên Windows, và đó là lý do dòng 3 phải include <code>&lt;stdlib.h&gt;</code>. Cũng là lý do console trên slide kết thúc bằng "Press any key to continue . . .". Trên Linux/macOS thì xoá dòng đó và xoá luôn include.</li>
<li><strong>Khung console trên slide</strong> — <code>Student Information:</code> rồi <code>Id: 1001, Name: Tom, Grade: A</code>.</li>
</ul>
<table>
<tr><th>Trường</th><th>Kiểu</th><th>Offset (<code>offsetof</code>)</th><th>Cỡ</th><th>Ghi chú</th></tr>
<tr><td><code>id</code></td><td><code>int</code></td><td>0</td><td>4</td><td>mở đầu struct</td></tr>
<tr><td><code>name</code></td><td><code>char[20]</code></td><td>4</td><td>20</td><td>kết thúc ở byte 24</td></tr>
<tr><td><code>grade</code></td><td><code>char</code></td><td>24</td><td>1</td><td>các trường hết ở byte 25</td></tr>
<tr><td colspan="2"><strong><code>sizeof(student)</code></strong></td><td colspan="3"><strong>28</strong> — thừa 3 byte đệm đuôi (25 làm tròn lên bội số của 4)</td></tr>
</table>
<p class="dap-an">✅ Đáp án — biên dịch bằng <code>cc -Wall</code> (sau khi bỏ <code>system("pause")</code>) và chạy: <code>Student Information:</code> rồi <code>Id: 1001, Name: Tom, Grade: A</code>, khớp đúng slide. Đo bằng <code>offsetof</code>: id@0, name@4, grade@24, và <code>sizeof(student)</code> = <strong>28</strong> chứ không phải 25 — ba byte đệm đuôi tồn tại để trong một mảng <code>student[100]</code> thì mọi trường <code>id</code> vẫn rơi đúng mốc 4 byte.</p>
<p class="pitfall">⚠️ Slide tự lệch với chính đề bài của nó. Slide 63 yêu cầu in "id, name, <strong>age</strong>", còn mã ở đây khai <strong><code>char grade</code></strong> và in điểm chữ. Cả hai đều là chương trình hợp lệ; chỉ cần trả lời đúng phiên bản mà đề trước mặt bạn hỏi. Nếu đề thi ghi "age" thì hãy khai <code>int age</code> và in bằng <code>%d</code>.</p>`],

      [65, 'Case Study',
        `<p class="y-chinh">🎯 The problem statement that slides 66–69 solve: manage account information for <strong>up to 100 customers</strong>, where one account is <code>accountNumber</code> (int), <code>accountType</code> (char[20]), <code>accountHolderName</code> (char[40]) and <code>balance</code> (double) — with three requirements: enter from the keyboard, print the list, and find and print customers whose balance is greater than $1000.</p>
<ul>
<li><strong>Read the nouns first, exactly as slide 14 taught for arrays</strong> — the four data items with their four types are literally the struct definition, written in prose. Copy them into a <code>typedef struct</code> without changing a single type and half the work is done.</li>
<li><strong>"up to 100 customers" is the array size</strong> — <code>accountCustomer accountCustomers[100];</code>, a static array as on slide 7, plus a separate <code>int n</code> for how many are really used. This is the "MAXN vs real n" pattern from slide 14, unchanged.</li>
<li><strong>Read the verbs second</strong> — "enter", "print out a list", "find and print" → three functions, one per requirement. That is exactly the four prototypes slide 66 declares (plus <code>printAccount</code>, a helper shared by the last two).</li>
<li><strong>Why four types and not four arrays</strong> — an account number is an <code>int</code>, a type is text, a holder name is longer text, a balance needs decimals. Four different types means a struct is the only clean container, which is precisely why this Case Study sits at the end of the section.</li>
<li><strong><code>double balance</code> deserves a warning</strong> — money in binary floating point cannot represent 0.1 exactly. The slide's data hides it well: the input <code>10050.123</code> is printed as <code>10050.12</code> because of <code>%.2lf</code>, not because it was stored exactly. Real banking systems store cents in an integer. For PRF192, <code>double</code> is what is asked for.</li>
<li><strong>"greater than $1000" is a strict comparison</strong> — <code>&gt; 1000</code>, so an account holding exactly 1000.00 is <em>not</em> reported. Slide 68 will use <code>&gt;</code>; read such requirements carefully because <code>&gt;=</code> versus <code>&gt;</code> is a one-character difference that changes the output.</li>
</ul>
<table>
<tr><th>Field</th><th>Type</th><th>Offset</th><th>Size</th><th>Alignment note</th></tr>
<tr><td><code>accountNumber</code></td><td><code>int</code></td><td>0</td><td>4</td><td>—</td></tr>
<tr><td><code>accountType</code></td><td><code>char[20]</code></td><td>4</td><td>20</td><td>ends at 24</td></tr>
<tr><td><code>accountHolderName</code></td><td><code>char[40]</code></td><td>24</td><td>40</td><td>ends at 64</td></tr>
<tr><td><code>balance</code></td><td><code>double</code></td><td>64</td><td>8</td><td>64 is a multiple of 8 — <strong>lucky, no padding</strong></td></tr>
<tr><td colspan="2"><strong><code>sizeof(accountCustomer)</code></strong></td><td colspan="3"><strong>72</strong> = 4+20+40+8, and the 100-element array is <strong>7 200 bytes</strong></td></tr>
</table>
<p class="dap-an">✅ Measured with <code>offsetof</code> under <code>cc -Wall</code>: 0 / 4 / 24 / 64, total <strong>72</strong> bytes, array of 100 = <strong>7 200</strong> bytes on the stack. This struct happens to need <em>zero</em> padding — but only by luck: change <code>accountType</code> to <code>char[21]</code> and <code>balance</code> would be pushed from 65 to 72, making the struct 80 bytes with 7 wasted per account.</p>
<p class="meo">💡 Before writing any code for a problem like this, write the struct and the two numbers: <code>sizeof</code> one record, and <code>sizeof</code> the whole array. 7 200 bytes on the stack is comfortable; if the problem had said "up to 100 000 customers" the same array would be 7.2 MB and would overflow the stack, and the answer would be <code>calloc</code> from slide 27 instead.</p>`,
        `<p class="y-chinh">🎯 Đề bài mà slide 66–69 sẽ giải: quản lý thông tin tài khoản cho <strong>tối đa 100 khách hàng</strong>, trong đó một tài khoản gồm <code>accountNumber</code> (int), <code>accountType</code> (char[20]), <code>accountHolderName</code> (char[40]) và <code>balance</code> (double) — kèm ba yêu cầu: nhập từ bàn phím, in danh sách, và tìm rồi in những khách có số dư lớn hơn 1000 đô.</p>
<ul>
<li><strong>Đọc DANH TỪ trước, đúng như slide 14 đã dạy với mảng</strong> — bốn mục dữ liệu kèm bốn kiểu của chúng chính là định nghĩa struct viết bằng văn xuôi. Chép thẳng vào một <code>typedef struct</code> mà không đổi một kiểu nào là xong nửa việc.</li>
<li><strong>"tối đa 100 khách" chính là cỡ mảng</strong> — <code>accountCustomer accountCustomers[100];</code>, một mảng tĩnh như slide 7, cộng thêm một biến <code>int n</code> riêng cho số phần tử thật sự dùng. Đây đúng là khuôn "MAXN và n thật" của slide 14, không đổi gì.</li>
<li><strong>Đọc ĐỘNG TỪ sau</strong> — "nhập", "in danh sách", "tìm và in" → ba hàm, mỗi yêu cầu một hàm. Đúng là bốn nguyên mẫu mà slide 66 khai báo (cộng thêm <code>printAccount</code>, hàm phụ dùng chung cho hai yêu cầu cuối).</li>
<li><strong>Vì sao bốn kiểu chứ không phải bốn mảng</strong> — số tài khoản là <code>int</code>, loại tài khoản là chữ, tên chủ tài khoản là chữ dài hơn, số dư cần phần thập phân. Bốn kiểu khác nhau nghĩa là struct là vật chứa sạch sẽ duy nhất, và đó chính là lý do Case Study này nằm ở cuối phần.</li>
<li><strong><code>double balance</code> đáng được cảnh báo</strong> — tiền bạc trong dấu phẩy động nhị phân không biểu diễn chính xác được 0,1. Dữ liệu của slide che chuyện này rất khéo: đầu vào <code>10050.123</code> in ra thành <code>10050.12</code> là do <code>%.2lf</code>, chứ không phải vì nó được lưu chính xác. Hệ thống ngân hàng thật lưu số xu bằng số nguyên. Với PRF192 thì <code>double</code> là thứ đề yêu cầu.</li>
<li><strong>"lớn hơn 1000 đô" là so sánh NGẶT</strong> — <code>&gt; 1000</code>, nên một tài khoản có đúng 1000,00 thì KHÔNG bị liệt kê. Slide 68 sẽ dùng <code>&gt;</code>; hãy đọc kỹ những yêu cầu kiểu này vì <code>&gt;=</code> so với <code>&gt;</code> chỉ lệch một ký tự mà đổi hẳn kết quả.</li>
</ul>
<table>
<tr><th>Trường</th><th>Kiểu</th><th>Offset</th><th>Cỡ</th><th>Ghi chú canh hàng</th></tr>
<tr><td><code>accountNumber</code></td><td><code>int</code></td><td>0</td><td>4</td><td>—</td></tr>
<tr><td><code>accountType</code></td><td><code>char[20]</code></td><td>4</td><td>20</td><td>hết ở byte 24</td></tr>
<tr><td><code>accountHolderName</code></td><td><code>char[40]</code></td><td>24</td><td>40</td><td>hết ở byte 64</td></tr>
<tr><td><code>balance</code></td><td><code>double</code></td><td>64</td><td>8</td><td>64 chia hết cho 8 — <strong>may mắn, không cần đệm</strong></td></tr>
<tr><td colspan="2"><strong><code>sizeof(accountCustomer)</code></strong></td><td colspan="3"><strong>72</strong> = 4+20+40+8, và mảng 100 phần tử là <strong>7 200 byte</strong></td></tr>
</table>
<p class="dap-an">✅ Đo bằng <code>offsetof</code> dưới <code>cc -Wall</code>: 0 / 4 / 24 / 64, tổng <strong>72</strong> byte, mảng 100 phần tử = <strong>7 200</strong> byte trên ngăn xếp. Struct này tình cờ KHÔNG cần một byte đệm nào — nhưng chỉ là may: đổi <code>accountType</code> thành <code>char[21]</code> là <code>balance</code> bị đẩy từ 65 lên 72, struct thành 80 byte và phí 7 byte mỗi tài khoản.</p>
<p class="meo">💡 Trước khi viết bất kỳ dòng mã nào cho bài kiểu này, hãy viết ra cái struct và hai con số: <code>sizeof</code> một bản ghi, và <code>sizeof</code> cả mảng. 7 200 byte trên ngăn xếp thì thoải mái; nếu đề ghi "tối đa 100 000 khách" thì cũng mảng ấy thành 7,2 MB và sẽ tràn ngăn xếp, lúc đó lời giải phải là <code>calloc</code> của slide 27.</p>`],

      [66, 'Case Study: Code design (1/3) — type, helper, prototypes and main',
        `<p class="y-chinh">🎯 The skeleton of the program, in the order a C file must be written: includes → the struct type → a small helper → the function <strong>prototypes</strong> → <code>main</code>. Nothing here does any work; it declares who will do it.</p>
<ul>
<li><strong>Lines 5–10 — the struct, copied straight from the problem statement</strong> — <code>typedef struct{ int accountNumber; char accountType[20]; char accountHolderName[40]; double balance; } accountCustomer;</code>. Compare it word for word with slide 65: four items, four types, same order.</li>
<li><strong>Lines 12–14 — <code>void clear(void){ while(getchar()!='\\n'); }</code></strong> — the input-buffer cleaner. After <code>scanf("%d", …)</code> reads a number, the Enter key is still sitting in the buffer; the next <code>scanf("%[^\\n]", …)</code> would read an empty line and return immediately. <code>clear()</code> eats characters until it has eaten that newline.</li>
<li><strong>Lines 16–20 — the prototypes</strong> — four declarations ending in <code>;</code> with no body. They let <code>main</code> call functions whose definitions appear later in the file (slides 67–68). Without them the compiler meets <code>inputInfo</code> on line 29 and does not know its parameters.</li>
<li><strong>Line 23 — <code>accountCustomer accountCustomers[100];</code></strong> — 7 200 bytes of stack, the "up to 100" of the problem. <code>int n</code> on line 24 is the count actually used.</li>
<li><strong>Lines 27–31 — main is only five calls</strong> — print a prompt, <code>scanf</code> the count, then <code>inputInfo</code> / <code>printInfo</code> / <code>searchAccountCustomers</code>, each receiving <code>(accountCustomers, n)</code>. That is the slide-13 signature "array + count" with a struct element type; the array is passed as a pointer, so the three functions all see the same 100 records.</li>
<li><strong>Note the asymmetry with slide 63</strong> — the <em>array</em> parameter <code>accountCustomer accounts[]</code> is a pointer, so <code>inputInfo</code> really can fill the caller's data. Only <code>printAccount(accountCustomer acc)</code> on slide 67 takes a struct <em>by value</em> and gets a copy.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
#include &lt;stdlib.h&gt;

typedef struct{
    int accountNumber;
    char accountType[20];
    char accountHolderName[40];
    double balance;
} accountCustomer;

void clear(void){
    while(getchar()!='\\n');
}

// Prototypes:
void inputInfo(accountCustomer accounts[], int n);
void printAccount(accountCustomer acc);
void printInfo(accountCustomer accounts[], int n);
void searchAccountCustomers(accountCustomer accounts[], int n);

int main(){
    accountCustomer accountCustomers[100];
    int n;

    // Input n
    printf("Input number of the Customer account: ");
    scanf("%d", &amp;n);
    inputInfo(accountCustomers, n);
    printInfo(accountCustomers, n);
    searchAccountCustomers(accountCustomers, n);
    return 0;
}</code></pre>
<p class="dap-an">✅ This skeleton plus slides 67–68 was assembled into one file, compiled with <code>cc -Wall</code> (zero warnings once the two <code>&amp;</code> issues of slide 67 are fixed) and run with the slide's own data — the output is reproduced on slide 69 and matches the picture exactly.</p>
<p class="pitfall">⚠️ Two holes in this skeleton, both worth a mark in an exam. First, <code>n</code> is never validated: entering 250 writes past the 100-element array and corrupts the stack, even though the problem says "up to 100". Add <code>if (n &gt; 100) n = 100;</code>. Second, <code>clear()</code> loops forever if end-of-input arrives before a newline (<code>getchar()</code> then returns <code>EOF</code>, never <code>'\\n'</code>); the safe version is <code>int c; while((c = getchar()) != '\\n' &amp;&amp; c != EOF);</code>.</p>`,
        `<p class="y-chinh">🎯 Bộ khung của chương trình, theo đúng thứ tự một tệp C phải được viết: include → kiểu struct → một hàm phụ nhỏ → các <strong>nguyên mẫu hàm</strong> → <code>main</code>. Ở đây chưa có gì làm việc cả; nó chỉ khai ra AI sẽ làm việc.</p>
<ul>
<li><strong>Dòng 5–10 — struct, chép thẳng từ đề bài</strong> — <code>typedef struct{ int accountNumber; char accountType[20]; char accountHolderName[40]; double balance; } accountCustomer;</code>. Hãy so từng chữ với slide 65: bốn mục, bốn kiểu, cùng thứ tự.</li>
<li><strong>Dòng 12–14 — <code>void clear(void){ while(getchar()!='\\n'); }</code></strong> — hàm dọn bộ đệm bàn phím. Sau khi <code>scanf("%d", …)</code> đọc xong một số, phím Enter vẫn còn nằm lại trong bộ đệm; lệnh <code>scanf("%[^\\n]", …)</code> kế tiếp sẽ đọc phải một dòng rỗng và trả về ngay. <code>clear()</code> ăn hết ký tự cho tới khi nuốt trôi cái dấu xuống dòng ấy.</li>
<li><strong>Dòng 16–20 — các nguyên mẫu</strong> — bốn dòng khai báo kết thúc bằng <code>;</code> và không có thân hàm. Chúng cho phép <code>main</code> gọi những hàm mà định nghĩa nằm mãi phía dưới tệp (slide 67–68). Không có chúng thì tới dòng 29 trình biên dịch gặp <code>inputInfo</code> mà không biết tham số của nó là gì.</li>
<li><strong>Dòng 23 — <code>accountCustomer accountCustomers[100];</code></strong> — 7 200 byte ngăn xếp, chính là "tối đa 100" của đề. Còn <code>int n</code> ở dòng 24 là số phần tử thật sự dùng.</li>
<li><strong>Dòng 27–31 — main chỉ gồm năm lời gọi</strong> — in lời nhắc, <code>scanf</code> lấy số lượng, rồi <code>inputInfo</code> / <code>printInfo</code> / <code>searchAccountCustomers</code>, mỗi hàm nhận <code>(accountCustomers, n)</code>. Đó chính là chữ ký "mảng + số phần tử" của slide 13 với kiểu phần tử là struct; mảng được truyền dưới dạng con trỏ nên cả ba hàm cùng nhìn vào một bộ 100 bản ghi.</li>
<li><strong>Để ý chỗ bất đối xứng với slide 63</strong> — tham số <em>mảng</em> <code>accountCustomer accounts[]</code> là con trỏ, nên <code>inputInfo</code> thật sự điền được dữ liệu cho hàm gọi. Chỉ có <code>printAccount(accountCustomer acc)</code> ở slide 67 là nhận struct <em>theo giá trị</em> và nhận một bản sao.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
#include &lt;stdlib.h&gt;

typedef struct{
    int accountNumber;
    char accountType[20];
    char accountHolderName[40];
    double balance;
} accountCustomer;

void clear(void){
    while(getchar()!='\\n');
}

// Nguyen mau ham:
void inputInfo(accountCustomer accounts[], int n);
void printAccount(accountCustomer acc);
void printInfo(accountCustomer accounts[], int n);
void searchAccountCustomers(accountCustomer accounts[], int n);

int main(){
    accountCustomer accountCustomers[100];
    int n;

    // Nhap n
    printf("Input number of the Customer account: ");
    scanf("%d", &amp;n);
    inputInfo(accountCustomers, n);
    printInfo(accountCustomers, n);
    searchAccountCustomers(accountCustomers, n);
    return 0;
}</code></pre>
<p class="dap-an">✅ Bộ khung này cộng với slide 67–68 đã được ghép thành một tệp, biên dịch bằng <code>cc -Wall</code> (không một cảnh báo, sau khi sửa hai chỗ <code>&amp;</code> nêu ở slide 67) rồi chạy với đúng dữ liệu của slide — kết quả được in lại ở slide 69 và khớp khít với ảnh.</p>
<p class="pitfall">⚠️ Hai lỗ hổng trong bộ khung này, đều đáng một điểm trong bài thi. Một, <code>n</code> không hề được kiểm tra: nhập 250 là ghi tràn khỏi mảng 100 phần tử và phá ngăn xếp, dù đề đã ghi rõ "tối đa 100". Hãy thêm <code>if (n &gt; 100) n = 100;</code>. Hai, <code>clear()</code> lặp vô tận nếu luồng nhập hết trước khi gặp dấu xuống dòng (khi ấy <code>getchar()</code> trả <code>EOF</code> chứ không bao giờ trả <code>'\\n'</code>); bản an toàn là <code>int c; while((c = getchar()) != '\\n' &amp;&amp; c != EOF);</code>.</p>`],

      [67, 'Case Study: Code design (2/3) — inputInfo and printAccount',
        `<p class="y-chinh">🎯 The two functions that touch the data directly: <code>inputInfo</code> fills <code>n</code> records from the keyboard in a loop, and <code>printAccount</code> prints exactly one record as a tab-separated line.</p>
<ul>
<li><strong>Lines 36–48 — <code>inputInfo</code> is one <code>for</code> loop over <code>i</code></strong> — the array traversal of slide 12, unchanged. Inside, each of the four fields is read with the specifier its type needs.</li>
<li><strong>Line 39 — <code>printf("# %d\\n", i+1)</code></strong> — the record counter shown to the user is <code>i+1</code>, so it counts 1, 2, 3 while the array index counts 0, 1, 2. That "+1" is the classic off-by-one place; the array is still indexed with <code>i</code>.</li>
<li><strong>Line 40 — <code>scanf("%d", &amp;accounts[i].accountNumber)</code></strong> — read this address expression carefully: apply <code>[i]</code>, then <code>.accountNumber</code>, then take the address of the result. The <code>&amp;</code> is required because <code>scanf</code> must write into an <code>int</code>.</li>
<li><strong>Lines 42 and 44 — <code>scanf("%[^\\n]", …)</code></strong> — this is the "read everything up to the newline" specifier, needed because holder names contain spaces and plain <code>%s</code> stops at the first blank. Without it, "Pham Ngoc Tho" would store only "Pham" and leave "Ngoc Tho" in the buffer to poison the next read.</li>
<li><strong>The <code>clear()</code> calls are placed with care</strong> — after the number (line 41), after the type (line 43) and after the balance (line 46), but <em>not</em> between the type and the holder name, because <code>%[^\\n]</code> stops <em>before</em> the newline and leaves it for the following <code>clear()</code>. Move or delete one of these three calls and the input silently desynchronises.</li>
<li><strong>Lines 50–52 — <code>printAccount</code></strong> — <code>printf("%d\\t%s\\t%s\\t%.2lf\\n", …)</code>: four fields, four specifiers, tabs between. It takes <code>accountCustomer acc</code> <strong>by value</strong> (slide 63), so each call copies 72 bytes; that is why the columns in the slide-69 output line up raggedly — tabs, not fixed widths.</li>
</ul>
<pre><code>void inputInfo(accountCustomer accounts[], int n){
    int i;
    for(i=0; i&lt;n; i++){
        printf("# %d\\n", i+1);
        printf("Account number: ");      scanf("%d", &amp;accounts[i].accountNumber);
        clear();
        printf("Account type: ");        scanf("%[^\\n]", accounts[i].accountType);
        clear();
        printf("Account holder name: "); scanf("%[^\\n]", accounts[i].accountHolderName);
        printf("Balance: ");             scanf("%lf", &amp;accounts[i].balance);
        clear();
    }
}

void printAccount(accountCustomer acc){
    printf("%d\\t%s\\t%s\\t%.2lf\\n", acc.accountNumber, acc.accountType,
           acc.accountHolderName, acc.balance);
}</code></pre>
<p class="dap-an">✅ Đáp án — compiled as written above with <code>cc -Wall</code>: zero warnings, and fed the slide's three accounts it produced exactly the list on slide 69. Note the specifier pairing that makes it work: <code>%d</code> ↔ <code>int</code> with <code>&amp;</code>, <code>%[^\\n]</code> ↔ <code>char[]</code> with no <code>&amp;</code>, <code>%lf</code> ↔ <code>double</code> with <code>&amp;</code>, and on output <code>%.2lf</code> rounds 10050.123 to <code>10050.12</code> and 6666.888 to <code>6666.89</code>.</p>
<p class="pitfall">⚠️ The slide writes <code>scanf("%[^\\n]", &amp;accounts[i].accountType)</code> with an <code>&amp;</code> in front of an array. It runs — the address value is the same — but it is the wrong <em>type</em>, and I measured the compiler's objection: <code>warning: format specifies type 'char *' but the argument has type 'char (*)[20]'</code>, twice (once for the type, once for the holder name). An array name is already the address of its first element, so write <code>accounts[i].accountType</code> with no <code>&amp;</code>. Rule: <code>&amp;</code> for <code>%d</code> and <code>%lf</code>, never for <code>%s</code> or <code>%[^\\n]</code>.</p>`,
        `<p class="y-chinh">🎯 Hai hàm chạm thẳng vào dữ liệu: <code>inputInfo</code> điền <code>n</code> bản ghi từ bàn phím trong một vòng lặp, và <code>printAccount</code> in đúng một bản ghi thành một dòng ngăn bằng dấu tab.</p>
<ul>
<li><strong>Dòng 36–48 — <code>inputInfo</code> chỉ là một vòng <code>for</code> chạy theo <code>i</code></strong> — đúng phép duyệt mảng của slide 12, không đổi. Bên trong, mỗi trường trong bốn trường được đọc bằng định dạng mà kiểu của nó cần.</li>
<li><strong>Dòng 39 — <code>printf("# %d\\n", i+1)</code></strong> — số thứ tự hiện cho người dùng là <code>i+1</code>, nên nó đếm 1, 2, 3 trong khi chỉ số mảng đếm 0, 1, 2. Chữ "+1" ấy là chỗ lệch một đơn vị kinh điển; mảng vẫn được đánh chỉ số bằng <code>i</code>.</li>
<li><strong>Dòng 40 — <code>scanf("%d", &amp;accounts[i].accountNumber)</code></strong> — hãy đọc kỹ biểu thức địa chỉ này: áp <code>[i]</code> trước, rồi <code>.accountNumber</code>, rồi mới lấy địa chỉ của kết quả. Dấu <code>&amp;</code> là bắt buộc vì <code>scanf</code> phải ghi vào một <code>int</code>.</li>
<li><strong>Dòng 42 và 44 — <code>scanf("%[^\\n]", …)</code></strong> — đây là định dạng "đọc tất cả cho tới dấu xuống dòng", cần thiết vì tên chủ tài khoản có dấu cách còn <code>%s</code> trần thì dừng ngay ở khoảng trắng đầu tiên. Không có nó, "Pham Ngoc Tho" chỉ lưu được "Pham" và bỏ "Ngoc Tho" nằm lại trong bộ đệm để đầu độc lần đọc sau.</li>
<li><strong>Các lời gọi <code>clear()</code> được đặt rất có tính toán</strong> — sau số tài khoản (dòng 41), sau loại tài khoản (dòng 43) và sau số dư (dòng 46), nhưng KHÔNG đặt giữa loại tài khoản và tên chủ, vì <code>%[^\\n]</code> dừng lại TRƯỚC dấu xuống dòng và để nó lại cho lệnh <code>clear()</code> kế tiếp. Dời hoặc xoá một trong ba lời gọi ấy là phần nhập lệch pha âm thầm.</li>
<li><strong>Dòng 50–52 — <code>printAccount</code></strong> — <code>printf("%d\\t%s\\t%s\\t%.2lf\\n", …)</code>: bốn trường, bốn định dạng, ngăn nhau bằng tab. Nó nhận <code>accountCustomer acc</code> <strong>theo giá trị</strong> (slide 63) nên mỗi lời gọi chép 72 byte; và cũng vì dùng tab chứ không phải bề rộng cố định mà các cột trong kết quả ở slide 69 so le nhau.</li>
</ul>
<pre><code>void inputInfo(accountCustomer accounts[], int n){
    int i;
    for(i=0; i&lt;n; i++){
        printf("# %d\\n", i+1);
        printf("Account number: ");      scanf("%d", &amp;accounts[i].accountNumber);
        clear();
        printf("Account type: ");        scanf("%[^\\n]", accounts[i].accountType);
        clear();
        printf("Account holder name: "); scanf("%[^\\n]", accounts[i].accountHolderName);
        printf("Balance: ");             scanf("%lf", &amp;accounts[i].balance);
        clear();
    }
}

void printAccount(accountCustomer acc){
    printf("%d\\t%s\\t%s\\t%.2lf\\n", acc.accountNumber, acc.accountType,
           acc.accountHolderName, acc.balance);
}</code></pre>
<p class="dap-an">✅ Đáp án — biên dịch đúng như viết ở trên bằng <code>cc -Wall</code>: không một cảnh báo, và khi nạp ba tài khoản của slide thì nó cho ra đúng danh sách ở slide 69. Chú ý cặp đôi định dạng làm nên chuyện: <code>%d</code> ↔ <code>int</code> có <code>&amp;</code>, <code>%[^\\n]</code> ↔ <code>char[]</code> KHÔNG có <code>&amp;</code>, <code>%lf</code> ↔ <code>double</code> có <code>&amp;</code>, và lúc in thì <code>%.2lf</code> làm tròn 10050.123 thành <code>10050.12</code> và 6666.888 thành <code>6666.89</code>.</p>
<p class="pitfall">⚠️ Slide viết <code>scanf("%[^\\n]", &amp;accounts[i].accountType)</code> với dấu <code>&amp;</code> đặt trước một mảng. Nó vẫn chạy — giá trị địa chỉ y hệt — nhưng SAI KIỂU, và tôi đã đo lời phản đối của trình biên dịch: <code>warning: format specifies type 'char *' but the argument has type 'char (*)[20]'</code>, hai lần (một cho loại tài khoản, một cho tên chủ). Tên mảng vốn đã là địa chỉ phần tử đầu, nên hãy viết <code>accounts[i].accountType</code> không có <code>&amp;</code>. Luật: có <code>&amp;</code> với <code>%d</code> và <code>%lf</code>, không bao giờ có <code>&amp;</code> với <code>%s</code> hay <code>%[^\\n]</code>.</p>`],

      [68, 'Case Study: Code design (3/3) — printInfo and searchAccountCustomers',
        `<p class="y-chinh">🎯 The last two functions, and they are almost the same function: both walk the array with one <code>for</code> loop and hand each record to <code>printAccount</code>. The only difference is that the second one guards the call with <code>if (accounts[i].balance &gt; 1000)</code>.</p>
<ul>
<li><strong>Lines 54–60 — <code>printInfo</code></strong> — prints the header <code>"\\nList of the Customer account:\\n"</code>, then <code>for(i=0; i&lt;n; i++) printAccount(accounts[i]);</code>. Requirement 2 of slide 65, in four lines.</li>
<li><strong>Lines 62–70 — <code>searchAccountCustomers</code></strong> — header <code>"\\nSearch result:\\n"</code>, then the same loop with one <code>if</code> inside. Requirement 3, in six lines.</li>
<li><strong>This is the linear search of slide 26, with the answer printed instead of returned</strong> — slide 26's <code>firstLinearSearch</code> stopped at the first match and returned an index; here the loop never stops, because the requirement is "find <em>all</em> customers with a balance greater than $1000". Same skeleton, different exit rule: <code>return i</code> for "find one", no return at all for "list them all".</li>
<li><strong>Reusing <code>printAccount</code> is the design point</strong> — one function decides the output format, and both requirements call it. Change the columns once and both lists change together. If you inline the <code>printf</code> twice instead, the two lists drift apart the first time anyone edits one.</li>
<li><strong><code>&gt;</code> is strict, and it shows</strong> — I ran the finished program with two accounts, one holding exactly 1000.00 and one holding 1000.01. The list printed both; the search result printed <strong>only</strong> the 1000.01 one. An account with exactly $1000 is not "greater than $1000".</li>
<li><strong>Nothing is returned, and nothing is modified</strong> — both functions are <code>void</code> and both only read. They could take <code>const accountCustomer accounts[]</code>, which would make the compiler enforce that promise; the slide keeps it simple.</li>
</ul>
<pre><code>void printInfo(accountCustomer accounts[], int n){
    int i;
    printf("\\nList of the Customer account:\\n");
    for(i=0; i&lt;n; i++){
        printAccount(accounts[i]);
    }
}

void searchAccountCustomers(accountCustomer accounts[], int n){
    int i;
    printf("\\nSearch result:\\n");
    for(i=0; i&lt;n; i++){
        if(accounts[i].balance&gt;1000){
            printAccount(accounts[i]);
        }
    }
}</code></pre>
<p class="dap-an">✅ Đáp án — the full program (slides 66 + 67 + 68) compiled with <code>cc -Wall</code> and run twice. With the slide's own three accounts the search printed exactly two lines, <code>1001</code> and <code>1003</code>, skipping the 500.00 account — matching slide 69. With the boundary test (1000.00 and 1000.01) the search printed only <code>2002 Saving One Cent More 1000.01</code>, proving the <code>&gt;</code> excludes an exact $1000 balance.</p>
<p class="meo">💡 Wanting to count the matches too? Change <code>void</code> to <code>int</code>, add <code>int count = 0;</code>, do <code>count++</code> inside the <code>if</code>, and <code>return count;</code>. That single edit turns "print the matches" into "print and report how many", which is the most common follow-up question on this Case Study.</p>`,
        `<p class="y-chinh">🎯 Hai hàm cuối, và chúng gần như là cùng một hàm: cả hai đều duyệt mảng bằng một vòng <code>for</code> và đưa từng bản ghi cho <code>printAccount</code>. Khác biệt duy nhất là hàm thứ hai chặn lời gọi ấy bằng <code>if (accounts[i].balance &gt; 1000)</code>.</p>
<ul>
<li><strong>Dòng 54–60 — <code>printInfo</code></strong> — in tiêu đề <code>"\\nList of the Customer account:\\n"</code>, rồi <code>for(i=0; i&lt;n; i++) printAccount(accounts[i]);</code>. Yêu cầu 2 của slide 65, gói trong bốn dòng.</li>
<li><strong>Dòng 62–70 — <code>searchAccountCustomers</code></strong> — tiêu đề <code>"\\nSearch result:\\n"</code>, rồi cũng vòng lặp ấy với một lệnh <code>if</code> bên trong. Yêu cầu 3, gói trong sáu dòng.</li>
<li><strong>Đây chính là tìm tuyến tính của slide 26, chỉ khác là in ra chứ không trả về</strong> — hàm <code>firstLinearSearch</code> ở slide 26 dừng ngay ở kết quả đầu tiên và trả về chỉ số; ở đây vòng lặp không bao giờ dừng, vì yêu cầu là tìm <em>tất cả</em> khách có số dư lớn hơn 1000. Cùng bộ xương, khác luật thoát: <code>return i</code> cho "tìm một cái", không return gì cả cho "liệt kê hết".</li>
<li><strong>Dùng lại <code>printAccount</code> mới là ý đồ thiết kế</strong> — một hàm duy nhất quyết định định dạng đầu ra, và cả hai yêu cầu đều gọi nó. Sửa cột một lần là cả hai danh sách đổi theo. Nếu bạn chép lệnh <code>printf</code> vào hai chỗ thay vì gọi hàm, thì hai danh sách sẽ lệch nhau ngay lần đầu có người sửa một bên.</li>
<li><strong><code>&gt;</code> là ngặt, và điều đó lộ ra thật</strong> — tôi đã chạy chương trình hoàn chỉnh với hai tài khoản, một cái đúng 1000,00 và một cái 1000,01. Danh sách in cả hai; phần kết quả tìm kiếm chỉ in <strong>duy nhất</strong> cái 1000,01. Một tài khoản có đúng 1000 đô thì không phải là "lớn hơn 1000 đô".</li>
<li><strong>Không trả về gì và không sửa gì</strong> — cả hai hàm đều <code>void</code> và đều chỉ đọc. Chúng hoàn toàn có thể nhận <code>const accountCustomer accounts[]</code> để trình biên dịch giám sát lời hứa ấy; slide thì giữ cho đơn giản.</li>
</ul>
<pre><code>void printInfo(accountCustomer accounts[], int n){
    int i;
    printf("\\nList of the Customer account:\\n");
    for(i=0; i&lt;n; i++){
        printAccount(accounts[i]);
    }
}

void searchAccountCustomers(accountCustomer accounts[], int n){
    int i;
    printf("\\nSearch result:\\n");
    for(i=0; i&lt;n; i++){
        if(accounts[i].balance&gt;1000){
            printAccount(accounts[i]);
        }
    }
}</code></pre>
<p class="dap-an">✅ Đáp án — chương trình đầy đủ (slide 66 + 67 + 68) đã biên dịch bằng <code>cc -Wall</code> và chạy hai lượt. Với đúng ba tài khoản của slide, phần tìm kiếm in ra đúng hai dòng <code>1001</code> và <code>1003</code>, bỏ qua tài khoản 500,00 — khớp slide 69. Với phép thử biên (1000,00 và 1000,01), phần tìm kiếm chỉ in <code>2002 Saving One Cent More 1000.01</code>, chứng minh dấu <code>&gt;</code> loại đúng cái số dư bằng chẵn 1000 đô.</p>
<p class="meo">💡 Muốn đếm luôn số kết quả? Đổi <code>void</code> thành <code>int</code>, thêm <code>int count = 0;</code>, đặt <code>count++</code> bên trong <code>if</code>, rồi <code>return count;</code>. Chỉ một sửa đổi ấy là biến "in các kết quả" thành "in và báo có bao nhiêu cái", và đó là câu hỏi phụ hay gặp nhất của Case Study này.</p>`],

      [69, 'Case Study: Compile & Run',
        `<p class="y-chinh">🎯 One console screenshot that proves the three requirements work. Read it as three blocks: the <strong>input dialogue</strong> for 3 accounts, the <strong>full list</strong>, and the <strong>search result</strong> containing only 2 of the 3.</p>
<ul>
<li><strong>Block 1 — input</strong>: <code>Input number of the Customer account: 3</code>, then three groups headed <code># 1</code>, <code># 2</code>, <code># 3</code> (that is the <code>i+1</code> from slide 67). The data entered is 1001/Checking/Pham Ngoc Tho/10050.123, 1002/Saving/Hoang Duc Binh/500, 1003/Checking/Pham Minh Chau/6666.888.</li>
<li><strong>Two holder names contain spaces</strong> — "Pham Ngoc Tho" and "Hoang Duc Binh" arrived intact. That is the <code>%[^\\n]</code> of slide 67 doing its job; with plain <code>%s</code> this screenshot would show only "Pham", "Hoang" and "Pham".</li>
<li><strong>Block 2 — the list</strong> shows the rounding: <code>10050.123</code> entered, <code>10050.12</code> printed; <code>6666.888</code> entered, <code>6666.89</code> printed; <code>500</code> entered, <code>500.00</code> printed. That is <code>%.2lf</code>, which rounds for display and pads to two decimals. The stored values still carry their extra digits.</li>
<li><strong>The ragged columns are the tabs</strong> — <code>\\t</code> jumps to the next 8-column stop, so a short field like "Saving" (6 chars) leaves a very different gap from "Checking" (8 chars). That is why row 1002 looks misaligned. Use <code>%-10s</code> instead of <code>\\t</code> if you want a real table.</li>
<li><strong>Block 3 — the search</strong> lists 1001 and 1003 and omits 1002. 500.00 is not greater than 1000, exactly as the <code>if</code> on slide 68 demands. Two of three: the requirement is satisfied and the filter is demonstrably doing something.</li>
<li><strong>"Press any key to continue . . ."</strong> is the Windows <code>system("pause")</code> from <code>main</code>. It is not part of the answer, only of the environment the slide was captured in.</li>
</ul>
<pre><code>Input number of the Customer account: 3
# 1
Account number: 1001
Account type: Checking
Account holder name: Pham Ngoc Tho
Balance: 10050.123
# 2
Account number: 1002
Account type: Saving
Account holder name: Hoang Duc Binh
Balance: 500
# 3
Account number: 1003
Account type: Checking
Account holder name: Pham Minh Chau
Balance: 6666.888

List of the Customer account:
1001    Checking        Pham Ngoc Tho   10050.12
1002    Saving  Hoang Duc Binh  500.00
1003    Checking        Pham Minh Chau  6666.89

Search result:
1001    Checking        Pham Ngoc Tho   10050.12
1003    Checking        Pham Minh Chau  6666.89</code></pre>
<p class="dap-an">✅ Đáp án — I assembled slides 66–68 into one file, compiled it with <code>cc -Wall</code> and fed it exactly the slide's keystrokes. The output above is what the program really printed, and it is <strong>identical to the slide's screenshot line for line</strong>, including the ragged tab columns and the three rounded balances. The Case Study on the slide is correct as printed.</p>
<p class="meo">💡 When your own run does not match a screenshot like this, check the three usual suspects in order: (1) a missing or extra <code>clear()</code>, which makes one field swallow the next; (2) <code>%s</code> where <code>%[^\\n]</code> was needed, which truncates names at the first space; (3) <code>%f</code> instead of <code>%lf</code> in <code>scanf</code>, which reads a <code>double</code> as a <code>float</code> and leaves the balance as garbage.</p>`,
        `<p class="y-chinh">🎯 Một ảnh chụp console chứng minh cả ba yêu cầu chạy được. Hãy đọc nó thành ba khối: <strong>đối thoại nhập liệu</strong> cho 3 tài khoản, <strong>danh sách đầy đủ</strong>, và <strong>kết quả tìm kiếm</strong> chỉ còn 2 trên 3.</p>
<ul>
<li><strong>Khối 1 — nhập liệu</strong>: <code>Input number of the Customer account: 3</code>, rồi ba nhóm mang tiêu đề <code># 1</code>, <code># 2</code>, <code># 3</code> (chính là <code>i+1</code> của slide 67). Dữ liệu nhập là 1001/Checking/Pham Ngoc Tho/10050.123, 1002/Saving/Hoang Duc Binh/500, 1003/Checking/Pham Minh Chau/6666.888.</li>
<li><strong>Hai tên chủ tài khoản có dấu cách</strong> — "Pham Ngoc Tho" và "Hoang Duc Binh" vào được nguyên vẹn. Đó là công của <code>%[^\\n]</code> ở slide 67; nếu dùng <code>%s</code> trần thì ảnh này chỉ hiện "Pham", "Hoang" và "Pham".</li>
<li><strong>Khối 2 — danh sách</strong> để lộ phép làm tròn: nhập <code>10050.123</code>, in <code>10050.12</code>; nhập <code>6666.888</code>, in <code>6666.89</code>; nhập <code>500</code>, in <code>500.00</code>. Đó là <code>%.2lf</code>, nó làm tròn khi hiển thị và thêm đủ hai chữ số thập phân. Giá trị lưu trong bộ nhớ vẫn giữ nguyên các chữ số dư.</li>
<li><strong>Các cột so le là do dấu tab</strong> — <code>\\t</code> nhảy tới mốc 8 cột kế tiếp, nên một trường ngắn như "Saving" (6 ký tự) chừa ra khoảng cách khác hẳn "Checking" (8 ký tự). Vì thế dòng 1002 nhìn lệch hàng. Muốn có bảng thật thì dùng <code>%-10s</code> thay cho <code>\\t</code>.</li>
<li><strong>Khối 3 — tìm kiếm</strong> liệt kê 1001 và 1003, bỏ 1002. 500,00 không lớn hơn 1000, đúng như lệnh <code>if</code> ở slide 68 đòi hỏi. Hai trên ba: yêu cầu được thoả và bộ lọc rõ ràng có làm việc.</li>
<li><strong>"Press any key to continue . . ."</strong> là <code>system("pause")</code> của Windows nằm trong <code>main</code>. Nó không thuộc về lời giải, chỉ thuộc về môi trường nơi slide được chụp.</li>
</ul>
<pre><code>Input number of the Customer account: 3
# 1
Account number: 1001
Account type: Checking
Account holder name: Pham Ngoc Tho
Balance: 10050.123
# 2
Account number: 1002
Account type: Saving
Account holder name: Hoang Duc Binh
Balance: 500
# 3
Account number: 1003
Account type: Checking
Account holder name: Pham Minh Chau
Balance: 6666.888

List of the Customer account:
1001    Checking        Pham Ngoc Tho   10050.12
1002    Saving  Hoang Duc Binh  500.00
1003    Checking        Pham Minh Chau  6666.89

Search result:
1001    Checking        Pham Ngoc Tho   10050.12
1003    Checking        Pham Minh Chau  6666.89</code></pre>
<p class="dap-an">✅ Đáp án — tôi đã ghép slide 66–68 thành một tệp, biên dịch bằng <code>cc -Wall</code> rồi nạp đúng chuỗi phím của slide. Phần kết quả ở trên là thứ chương trình thật sự in ra, và nó <strong>trùng khít ảnh chụp trên slide từng dòng một</strong>, kể cả các cột tab so le lẫn ba số dư đã làm tròn. Case Study trên slide là đúng như in.</p>
<p class="meo">💡 Khi bản chạy của bạn không khớp một ảnh chụp như thế này, hãy soi ba nghi phạm quen thuộc theo thứ tự: (1) thiếu hoặc thừa một lời gọi <code>clear()</code>, khiến một trường nuốt mất trường kế; (2) dùng <code>%s</code> ở chỗ cần <code>%[^\\n]</code>, khiến tên bị cắt ở dấu cách đầu tiên; (3) dùng <code>%f</code> thay vì <code>%lf</code> trong <code>scanf</code>, khiến một <code>double</code> bị đọc như <code>float</code> và số dư thành rác.</p>`],

      [70, 'Summary',
        `<p class="y-chinh">🎯 Four closing objectives, which are the same four the section opened with on slide 52: know <strong>what</strong> a structure type is, <strong>when</strong> to use one, <strong>how</strong> to define and use it, and how to <strong>work with its components</strong>. Here is each one as a one-line answer you can take into the exam.</p>
<ul>
<li><strong>What is a structure type?</strong> — a user-defined type that groups items of possibly different types into a single type, stored in contiguous memory, also called a record (slide 54).</li>
<li><strong>When to use one?</strong> — when several values belong to the same thing. The give-away phrase is "of the same student / account / book". Parallel arrays are the alternative and they desynchronise the first time you sort.</li>
<li><strong>How to define it?</strong> — <code>struct name { fields };</code> or <code>typedef struct { fields } name;</code>, and both end with a <strong>semicolon after the closing brace</strong>. With the first form the type is two words: <code>struct telephone tel;</code>.</li>
<li><strong>How to work with components?</strong> — <code>s.field</code> for a variable, <code>p-&gt;field</code> for a pointer (which is just <code>(*p).field</code>), <code>=</code> to copy a whole struct, <code>strcpy</code> for char-array fields, and field-by-field comparison because <code>==</code> between structs does not compile.</li>
<li><strong>Arrays and functions</strong> — <code>person family[3];</code> then <code>family[i].field</code>; a struct parameter is copied by value (so the function cannot change the original), while an <em>array</em> parameter is a pointer (so it can).</li>
<li><strong>Where this goes next</strong> — Slot 16–18 will make the char-array fields safer (<code>strncpy</code>, <code>strcmp</code>), and Slot 19–20 writes whole structs to files with <code>fwrite</code>, which works precisely because a struct is one contiguous block.</li>
</ul>
<table>
<tr><th>Task</th><th>Right</th><th>Wrong</th><th>What happens</th></tr>
<tr><td>End the definition</td><td><code>} eventDate;</code></td><td><code>} eventDate</code></td><td><code>error: expected ';' after struct</code>, blamed on the next line</td></tr>
<tr><td>Set a string field</td><td><code>strcpy(p.name, "Tom");</code></td><td><code>p.name = "Tom";</code></td><td><code>error: array type 'char[20]' is not assignable</code></td></tr>
<tr><td>Copy a record</td><td><code>b = a;</code></td><td>field-by-field by hand</td><td>both work; <code>=</code> is shorter and cannot forget a field</td></tr>
<tr><td>Compare two records</td><td><code>strcmp</code> + <code>==</code> per field</td><td><code>a == b</code></td><td><code>error: invalid operands to binary expression</code></td></tr>
<tr><td>Compare via memory</td><td>—</td><td><code>memcmp(&amp;a,&amp;b,sizeof a)</code></td><td>measured <strong>170</strong> for two equal records — padding rubbish</td></tr>
<tr><td>Field through a pointer</td><td><code>p-&gt;age</code> or <code>(*p).age</code></td><td><code>*p.age</code></td><td><code>did you mean to use '-&gt;'?</code> — <code>.</code> binds tighter than <code>*</code></td></tr>
<tr><td>Read into a string field</td><td><code>scanf("%[^\\n]", a[i].type)</code></td><td><code>scanf("%[^\\n]", &amp;a[i].type)</code></td><td><code>warning: … has type 'char (*)[20]'</code></td></tr>
</table>
<p class="dap-an">✅ Every row of that table was produced by a real <code>cc -Wall</code> run, not quoted from memory. Two further measured numbers worth remembering: <code>struct {char c; int i;}</code> is <strong>8</strong> bytes and not 5, and the Case Study's <code>accountCustomer</code> is <strong>72</strong> bytes, so <code>printAccount(accounts[i])</code> copies 72 bytes on every single call.</p>
<p class="meo">💡 A five-minute self-test that covers the whole section: define <code>typedef struct { int id; char title[50]; double price; } book;</code>, make <code>book shelf[5]</code>, fill it, write <code>void printBook(book b)</code>, print all five with a loop, then list only the books costing more than 100. If you can do that without looking anything up, slides 51–70 are finished.</p>`,
        `<p class="y-chinh">🎯 Bốn mục tiêu khép lại, cũng chính là bốn mục tiêu mở đầu phần này ở slide 52: hiểu kiểu struct <strong>là gì</strong>, <strong>khi nào</strong> dùng, <strong>định nghĩa và dùng</strong> ra sao, và <strong>làm việc với các thành phần</strong> của nó thế nào. Dưới đây mỗi câu là một dòng trả lời có thể mang thẳng vào phòng thi.</p>
<ul>
<li><strong>Kiểu struct là gì?</strong> — một kiểu do người dùng định nghĩa, gom các mục có thể khác kiểu thành một kiểu duy nhất, lưu trong bộ nhớ liên tục, còn gọi là bản ghi (slide 54).</li>
<li><strong>Khi nào dùng?</strong> — khi nhiều giá trị cùng thuộc về MỘT thứ. Câu nói lộ ra điều đó là "của cùng một sinh viên / tài khoản / cuốn sách". Lựa chọn thay thế là các mảng song song, và chúng lệch pha ngay lần sắp xếp đầu tiên.</li>
<li><strong>Định nghĩa thế nào?</strong> — <code>struct tên { các trường };</code> hoặc <code>typedef struct { các trường } tên;</code>, và cả hai đều kết thúc bằng <strong>dấu chấm phẩy sau ngoặc nhọn đóng</strong>. Với dạng thứ nhất thì tên kiểu gồm hai chữ: <code>struct telephone tel;</code>.</li>
<li><strong>Làm việc với thành phần thế nào?</strong> — <code>s.trường</code> với biến, <code>p-&gt;trường</code> với con trỏ (chẳng qua là <code>(*p).trường</code>), <code>=</code> để chép nguyên cả struct, <code>strcpy</code> cho trường mảng ký tự, và so sánh từng trường vì <code>==</code> giữa hai struct không biên dịch được.</li>
<li><strong>Mảng và hàm</strong> — <code>person family[3];</code> rồi <code>family[i].trường</code>; tham số struct được chép theo giá trị (nên hàm không đổi được bản gốc), còn tham số <em>mảng</em> là con trỏ (nên hàm đổi được).</li>
<li><strong>Đi tiếp về đâu</strong> — Slot 16–18 sẽ làm cho các trường mảng ký tự an toàn hơn (<code>strncpy</code>, <code>strcmp</code>), còn Slot 19–20 ghi nguyên cả struct xuống tệp bằng <code>fwrite</code>, làm được chính là nhờ struct là một khối liên tục.</li>
</ul>
<table>
<tr><th>Việc</th><th>Đúng</th><th>Sai</th><th>Hậu quả</th></tr>
<tr><td>Kết thúc định nghĩa</td><td><code>} eventDate;</code></td><td><code>} eventDate</code></td><td><code>error: expected ';' after struct</code>, đổ lỗi cho dòng kế tiếp</td></tr>
<tr><td>Gán trường chuỗi</td><td><code>strcpy(p.name, "Tom");</code></td><td><code>p.name = "Tom";</code></td><td><code>error: array type 'char[20]' is not assignable</code></td></tr>
<tr><td>Chép một bản ghi</td><td><code>b = a;</code></td><td>gán tay từng trường</td><td>cả hai đều chạy; <code>=</code> ngắn hơn và không thể quên sót trường nào</td></tr>
<tr><td>So sánh hai bản ghi</td><td><code>strcmp</code> + <code>==</code> theo từng trường</td><td><code>a == b</code></td><td><code>error: invalid operands to binary expression</code></td></tr>
<tr><td>So sánh bằng bộ nhớ</td><td>—</td><td><code>memcmp(&amp;a,&amp;b,sizeof a)</code></td><td>đo được <strong>170</strong> với hai bản ghi BẰNG nhau — rác trong byte đệm</td></tr>
<tr><td>Lấy trường qua con trỏ</td><td><code>p-&gt;age</code> hoặc <code>(*p).age</code></td><td><code>*p.age</code></td><td><code>did you mean to use '-&gt;'?</code> — <code>.</code> bám chặt hơn <code>*</code></td></tr>
<tr><td>Đọc vào trường chuỗi</td><td><code>scanf("%[^\\n]", a[i].type)</code></td><td><code>scanf("%[^\\n]", &amp;a[i].type)</code></td><td><code>warning: … has type 'char (*)[20]'</code></td></tr>
</table>
<p class="dap-an">✅ Mọi dòng trong bảng trên đều sinh ra từ một lượt chạy <code>cc -Wall</code> thật, không phải chép từ trí nhớ. Hai con số đo được nữa đáng nhớ: <code>struct {char c; int i;}</code> chiếm <strong>8</strong> byte chứ không phải 5, và <code>accountCustomer</code> của Case Study chiếm <strong>72</strong> byte, nên <code>printAccount(accounts[i])</code> chép 72 byte trong từng lời gọi một.</p>
<p class="meo">💡 Bài tự kiểm năm phút bao trùm cả phần: định nghĩa <code>typedef struct { int id; char title[50]; double price; } book;</code>, tạo <code>book shelf[5]</code>, điền dữ liệu, viết <code>void printBook(book b)</code>, in cả năm bằng vòng lặp, rồi liệt kê riêng những cuốn giá trên 100. Làm được mà không phải tra cứu gì nghĩa là slide 51–70 đã xong.</p>`],

    ]),
  ].join('\n'),
};
