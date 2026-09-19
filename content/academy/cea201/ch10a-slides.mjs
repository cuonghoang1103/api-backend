/**
 * CEA201 · Chương 10 trên web (deck 'cea13' = Chapter 13 bản 11e) —
 * Instruction Sets: Characteristics and Functions, học theo từng slide, PHẦN A:
 * slide 1–24 (nửa sau 25–48 nằm ở bài ch10b).
 *
 * ⚠️ ĐÁNH SỐ: syllabus của trường theo bản 9th ed gọi đây là "Chapter 12:
 * Instruction Sets: Characteristics and Functions". Slide là bản 11th ed nên
 * đánh "Chapter 13". Trên web môn này là "Chương 10". Ba con số, MỘT nội dung.
 *
 * Nội dung bám ĐÚNG chữ trích từ CH13-COA11e.pptx (/tmp/cea201-text/cea13.txt).
 * Slide chỉ có tiêu đề + hình/bảng (3, 5, 7, 8, 9, 10, 11, 15, 16, 18, 19, 22,
 * 24) đã ĐỌC THẲNG TỪ ẢNH render để lấy đúng từng nhãn.
 *
 * ⚠️ MỌI chương trình hợp ngữ trong bài đã MÔ PHỎNG THẬT bằng python3 trước khi
 * viết (máy ảo riêng cho từng kiểu 3/2/1/0 địa chỉ, số hữu tỉ Fraction để không
 * có sai số chia):
 *   · Y = (A − B) / (C + D × E) với A=20 B=8 C=2 D=3 E=4 → Y = 12/14 = 6/7.
 *     Cả BỐN kiểu máy ra đúng 6/7; ngăn xếp RỖNG sau khi POP Y.
 *   · Chạy lại với 2000 bộ giá trị ngẫu nhiên (bỏ ca mẫu số 0): bốn kiểu máy
 *     luôn ra CÙNG một giá trị. Không có lệnh nào sai.
 *   · Hậu tố sinh bằng thuật toán shunting-yard, không chép tay:
 *     (A−B)/(C+D×E) → A B − C D E × + /
 *   · Đếm (opcode 1 byte, mỗi địa chỉ 2 byte): 3 địa chỉ 4 lệnh/28 B ·
 *     2 địa chỉ 6 lệnh/30 B · 1 địa chỉ 8 lệnh/24 B · 0 địa chỉ 10 lệnh/22 B.
 *     ⚠️ 2 địa chỉ TỐN BYTE HƠN 3 địa chỉ — kết quả phản trực giác nhưng đúng,
 *     vì hai lệnh MOVE thêm vào. Bài nói thẳng chuyện này.
 *   · Truy cập dữ liệu (đọc+ghi toán hạng): 12 · 16 · 8 · 6.
 *
 * Chỗ slide gốc SAI/THIẾU — nêu rõ, không im lặng chép, không tự sửa slide:
 *   · slide 9 (Table 13.1): dòng cuối là máy NGĂN XẾP (lệnh "OP" không có địa
 *     chỉ, diễn giải T ← (T−1) OP T) nhưng cột "Number of Addresses" in "3".
 *     Phải là 0. Đã đối chiếu ẢNH gốc — lỗi nằm trên chính slide, không phải
 *     lỗi trích chữ.
 *   · slide 22 (Table 13.3 phần (f) Input/Output): dòng cuối in "XOR Dest,
 *     Source" nhưng mô tả là "ghi chuỗi ra cổng I/O, toán hạng nguồn là ô nhớ"
 *     — đó là lệnh OUTS, không phải XOR (XOR đã nằm ở phần (d) Logical).
 *   · slide 15 (Table 13.2): bản trích chữ mất chỉ số trên, in "223 – 1" —
 *     ảnh gốc là 2^23 − 1.
 *   · slide 16 (Figure 13.4): dòng thứ tám ghi "Quadward usigned integer (twos
 *     complement)t" — ba lỗi chính tả trong một nhãn; đúng phải là "Quadword
 *     SIGNED integer (twos complement)" (nó được vẽ CÓ bit dấu, nằm trong nhóm
 *     có dấu; bù hai theo định nghĩa đã là có dấu).
 *   · Danh sách kinh điển "bốn thành phần của một lệnh máy" (opcode · toán hạng
 *     nguồn · toán hạng kết quả · tham chiếu lệnh kế tiếp) KHÔNG in thành chữ
 *     trên slide nào của deck; nó chỉ được VẼ trong Figure 13.1 (slide 3). Bài
 *     nói rõ chỗ nào là slide, chỗ nào là sách.
 *   · Figure 13.3 (slide 8) chỉ có BA chương trình (3/2/1 địa chỉ). Máy 0 địa
 *     chỉ chỉ xuất hiện ở dòng cuối Table 13.1 — chương trình ngăn xếp trong
 *     bài là do bài này viết và mô phỏng, đã ghi rõ.
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'cea13';

export default {
  title: '10.0a — Slide by slide: What a machine instruction contains, operand counts and operation types (slides 1–24)|||10.0a — Slide bài giảng: Một lệnh máy gồm những gì, số toán hạng & các loại thao tác (slide 1–24)',
  slug: 'cea201-10-0a-slides-lenh-may-toan-hang-thao-tac',
  type: 'DOCUMENT',
  description: 'Nửa đầu chương Tập lệnh của CEA201 (slide 1–24 của deck Chapter 13 bản 11e). Đi từ "một lệnh máy gồm những gì" và chu trình lệnh (Figure 13.1), qua khuôn dạng lệnh và mnemonic, bốn nhóm lệnh, tới dạng bài thi kinh điển: viết cùng một biểu thức Y = (A − B) / (C + D × E) bằng máy 3, 2, 1 và 0 địa chỉ — có hậu tố, có chạy tay ngăn xếp, có đếm số lệnh và số byte, và MỌI chương trình đều đã được mô phỏng thật bằng python3 cho ra cùng một kết quả. Nửa sau là các kiểu toán hạng (số, ký tự, dữ liệu logic), kiểu dữ liệu x86/ARM, và bảng các loại thao tác của x86.',
  content: [
    walkHead(D, 1, 24),
    walk(D, [

      [1, 'Chapter 13 — Instruction Sets: Characteristics and Functions (title slide)',
        `<p class="y-chinh">🎯 The opening slide of the chapter that sits exactly on the <strong>boundary between hardware and software</strong>. Everything before this chapter was about how the machine is built; the instruction set is the one surface a programmer — or a compiler — is allowed to touch.</p>
<ul>
<li><strong>Numbering warning, read this first.</strong> Your syllabus follows the 9th edition and calls this block "Chapter 12: Instruction Sets: Characteristics and Functions". The slide deck is the 11th edition and prints "Chapter 13". On this website the subject numbers it "Chương 10". Three different numbers, <em>one</em> body of content. Do not panic when the exam paper says 12.</li>
<li><strong>The chapter answers four questions in order.</strong> (1) What must a single instruction contain? (slides 2–6) (2) What kinds of instruction exist, and how many addresses should each carry? (slides 7–10) (3) What kinds of <em>data</em> can an operand be? (slides 11–19) (4) What kinds of <em>operation</em> are provided? (slides 20–48)</li>
<li><strong>This lesson covers slides 1–24</strong>, i.e. questions (1), (2), (3) and the opening of (4). Slides 25–48 — data transfer examples, arithmetic, logical, shift/rotate, transfer of control, procedure calls, stack frames, x86 and ARM operation types — are in part B.</li>
<li><strong>Why the instruction set is the most conservative thing in a computer.</strong> Change the microarchitecture and nothing breaks; change the instruction set and every binary ever compiled stops running. That is why x86 instructions written in 1978 still execute on a 2026 laptop, and why this chapter's material dates so slowly.</li>
<li><strong>What it connects to.</strong> Ch.3 gave you the fetch–execute cycle that <em>runs</em> these instructions. Ch.14 (deck cea14) gives the other half of the same story — <strong>addressing modes</strong>, i.e. how an operand field actually names a location. Ch.16/Ch.17 show what happens when you design the set for speed (RISC). In CSI106 you met the three generations of language; machine language is generation one, and this chapter is its grammar.</li>
</ul>
<p class="meo">💡 Keep one sentence for the whole chapter: <strong>an instruction set is a contract</strong>. The hardware promises to perform these operations on these data types; the compiler promises to express every program using only them.</p>`,
        `<p class="y-chinh">🎯 Slide mở đầu của chương nằm đúng trên <strong>ranh giới giữa phần cứng và phần mềm</strong>. Mọi chương trước nói về máy được xây thế nào; tập lệnh là bề mặt DUY NHẤT mà lập trình viên — hoặc trình biên dịch — được phép chạm vào.</p>
<ul>
<li><strong>Cảnh báo đánh số, đọc trước đã.</strong> Syllabus của trường theo bản 9th ed nên gọi khối này là "Chapter 12: Instruction Sets: Characteristics and Functions". Bộ slide là bản 11th ed và in "Chapter 13". Trên web này môn đánh là "Chương 10". BA con số khác nhau, MỘT nội dung. Đừng hoảng khi đề thi ghi 12.</li>
<li><strong>Chương trả lời bốn câu hỏi, theo thứ tự.</strong> (1) Một lệnh phải chứa những gì? (slide 2–6) (2) Có những loại lệnh nào, và mỗi lệnh nên mang bao nhiêu địa chỉ? (slide 7–10) (3) Một toán hạng có thể là loại DỮ LIỆU nào? (slide 11–19) (4) Có những loại THAO TÁC nào? (slide 20–48)</li>
<li><strong>Bài này đi slide 1–24</strong>, tức câu (1), (2), (3) và phần mở của (4). Slide 25–48 — ví dụ chuyển dữ liệu, số học, logic, dịch/quay, chuyển điều khiển, gọi thủ tục, khung ngăn xếp, kiểu thao tác của x86 và ARM — nằm ở phần B.</li>
<li><strong>Vì sao tập lệnh là thứ BẢO THỦ nhất trong máy tính.</strong> Đổi vi kiến trúc thì chẳng vỡ gì; đổi tập lệnh thì MỌI tệp nhị phân từng biên dịch đều ngừng chạy. Đó là lý do lệnh x86 viết năm 1978 vẫn chạy trên laptop 2026, và cũng là lý do nội dung chương này cũ đi rất chậm.</li>
<li><strong>Nó nối vào đâu.</strong> Ch.3 cho bạn chu trình nạp–thi hành, thứ THỰC SỰ chạy những lệnh này. Ch.14 (deck cea14) là nửa còn lại của cùng câu chuyện — <strong>CHẾ ĐỘ ĐỊA CHỈ</strong>, tức trường toán hạng đặt tên cho một vị trí bằng cách nào. Ch.16/Ch.17 cho thấy chuyện gì xảy ra khi thiết kế tập lệnh vì tốc độ (RISC). Ở CSI106 bạn đã gặp ba thế hệ ngôn ngữ; ngôn ngữ máy là thế hệ một, và chương này là ngữ pháp của nó.</li>
</ul>
<p class="meo">💡 Giữ một câu cho cả chương: <strong>tập lệnh là một BẢN HỢP ĐỒNG</strong>. Phần cứng hứa thực hiện đúng những thao tác này trên đúng những kiểu dữ liệu này; trình biên dịch hứa diễn đạt mọi chương trình chỉ bằng chừng ấy thứ.</p>`],

      [2, 'Machine Instruction Characteristics',
        `<p class="y-chinh">🎯 Three sentences that define the vocabulary for the whole chapter: an <strong>instruction</strong> is what determines the processor's operation, the <strong>instruction set</strong> is the collection of them, and <strong>each instruction must contain everything the processor needs</strong> to execute it.</p>
<table>
<tr><th>Term on the slide</th><th>Definition</th><th>Who chooses it</th></tr>
<tr><td>Machine instruction / computer instruction</td><td>The thing that determines the operation of the processor</td><td>Fixed by the CPU designer, forever</td></tr>
<tr><td>Instruction set</td><td>The collection of different instructions the processor can execute</td><td>Fixed by the CPU designer; this is the ISA</td></tr>
<tr><td>(implied) Instruction cycle</td><td>The fetch–decode–execute loop that consumes one instruction</td><td>Ch.3; drawn in detail on the next slide</td></tr>
</table>
<ul>
<li><strong>"Each instruction must contain the information required by the processor for execution" is the design constraint of the chapter.</strong> That single sentence generates everything else: it forces an opcode field, operand fields, and a way to know where the next instruction is. Slides 3–6 unpack each of those.</li>
<li><strong>The four elements of a machine instruction — from the book, NOT printed on this deck.</strong> Be aware, because exams ask for the list: (i) <em>operation code</em> (opcode) — what to do; (ii) <em>source operand reference</em> — what to do it to; (iii) <em>result operand reference</em> — where to put the answer; (iv) <em>next instruction reference</em> — where to go next. This deck only <em>draws</em> them, in Figure 13.1 on the next slide.</li>
<li><strong>Why (iv) is usually invisible.</strong> The next instruction reference is normally <em>implicit</em>: the PC just advances. It only becomes an explicit field in branch and jump instructions. That is the whole reason "transfer of control" gets its own category later.</li>
<li><strong>Instruction set = ISA = the programmer's model of the machine.</strong> Two chips with completely different internals (an Intel and an AMD processor, say) are interchangeable precisely because they implement the same instruction set. Ch.17 will call this the "architecture versus organization" distinction you first met in Ch.1.</li>
</ul>
<p class="pitfall">⚠️ Exam trap: "instruction set" is a <em>set of instruction TYPES</em>, not the list of instructions in your program. A program containing a thousand ADDs still uses one member of the instruction set.</p>`,
        `<p class="y-chinh">🎯 Ba câu định nghĩa từ vựng cho cả chương: <strong>lệnh máy</strong> là thứ quyết định hoạt động của bộ xử lý, <strong>tập lệnh</strong> là bộ sưu tập các lệnh đó, và <strong>mỗi lệnh phải chứa đủ mọi thứ bộ xử lý cần</strong> để thi hành nó.</p>
<table>
<tr><th>Thuật ngữ trên slide</th><th>Định nghĩa</th><th>Ai quyết định</th></tr>
<tr><td>Machine instruction / computer instruction (lệnh máy)</td><td>Thứ quyết định hoạt động của bộ xử lý</td><td>Người thiết kế CPU chốt, và chốt vĩnh viễn</td></tr>
<tr><td>Instruction set (tập lệnh)</td><td>Bộ sưu tập các lệnh KHÁC NHAU mà bộ xử lý thi hành được</td><td>Người thiết kế CPU chốt; đây chính là ISA</td></tr>
<tr><td>(ngầm hiểu) Instruction cycle</td><td>Vòng lặp nạp–giải mã–thi hành, tiêu thụ MỘT lệnh</td><td>Ch.3; slide sau vẽ chi tiết</td></tr>
</table>
<ul>
<li><strong>Câu "mỗi lệnh phải chứa thông tin mà bộ xử lý cần để thi hành" chính là RÀNG BUỘC THIẾT KẾ của cả chương.</strong> Một câu đó sinh ra mọi thứ còn lại: nó bắt buộc phải có trường mã thao tác, các trường toán hạng, và một cách biết lệnh kế tiếp ở đâu. Slide 3–6 mở từng cái ra.</li>
<li><strong>Bốn thành phần của một lệnh máy — lấy từ SÁCH, KHÔNG in trên deck này.</strong> Phải biết vì đề thi hay hỏi đúng danh sách này: (i) <em>mã thao tác</em> (opcode) — làm GÌ; (ii) <em>tham chiếu toán hạng nguồn</em> — làm trên CÁI GÌ; (iii) <em>tham chiếu toán hạng kết quả</em> — đặt kết quả VÀO ĐÂU; (iv) <em>tham chiếu lệnh kế tiếp</em> — đi TIẾP đâu. Deck này chỉ VẼ chúng ra, trong Figure 13.1 ở slide kế.</li>
<li><strong>Vì sao (iv) thường vô hình.</strong> Tham chiếu lệnh kế tiếp bình thường là <em>NGẦM ĐỊNH</em>: PC cứ thế tăng. Nó chỉ trở thành một trường tường minh trong lệnh rẽ nhánh và lệnh nhảy. Đó đúng là lý do "chuyển điều khiển" sau này được xếp thành một nhóm riêng.</li>
<li><strong>Tập lệnh = ISA = mô hình máy mà lập trình viên nhìn thấy.</strong> Hai con chip ruột gan khác hẳn nhau (ví dụ một của Intel và một của AMD) thay thế được cho nhau CHÍNH VÌ chúng hiện thực cùng một tập lệnh. Ch.17 sẽ gọi đây là phân biệt "kiến trúc với tổ chức" mà bạn đã gặp lần đầu ở Ch.1.</li>
</ul>
<p class="pitfall">⚠️ Bẫy đề thi: "tập lệnh" là <em>tập các LOẠI lệnh</em>, không phải danh sách các lệnh trong chương trình của bạn. Một chương trình có một nghìn lệnh ADD vẫn chỉ dùng MỘT phần tử của tập lệnh.</p>`],

      [3, 'Figure 13.1 — Instruction Cycle State Diagram',
        `<p class="y-chinh">🎯 The fetch–execute cycle from Ch.3, redrawn with the states that matter <em>for this chapter</em>. Read it as a sentence: <strong>work out where the instruction is → fetch it → decode it → work out where each operand is → fetch each operand → do the operation → work out where the result goes → store it → go round again.</strong></p>
<table>
<tr><th>State on the diagram</th><th>What happens</th><th>Which element of the instruction it uses</th></tr>
<tr><td>Instruction address calculation</td><td>Decide the address of the next instruction (normally PC + length)</td><td>Next instruction reference (usually implicit)</td></tr>
<tr><td>Instruction fetch</td><td>Read that instruction from memory into the IR</td><td>—</td></tr>
<tr><td>Instruction operation decoding</td><td>Work out what operation is wanted and which operands are needed</td><td>Opcode</td></tr>
<tr><td>Operand address calculation</td><td>Work out where a source operand is</td><td>Source operand reference + addressing mode (Ch.14)</td></tr>
<tr><td>Operand fetch</td><td>Read that operand from memory or I/O</td><td>Source operand reference</td></tr>
<tr><td>Data operation</td><td>Perform the actual operation in the ALU</td><td>Opcode</td></tr>
<tr><td>Operand address calculation → Operand store</td><td>Work out where the result goes and write it</td><td>Result operand reference</td></tr>
</table>
<ul>
<li><strong>The two self-loops are the point of the figure.</strong> "Multiple operands" loops back into operand fetch, and "Multiple results" loops back into operand store. A single instruction may need several operands and may produce several results — that is why the boxes are states in a loop, not a straight line.</li>
<li><strong>"Return for string or vector data" is the outer loop.</strong> One string or vector instruction (think x86 <code>MOVS</code>, or an SIMD instruction from slide 17) repeats the whole operand–operate–store section many times without refetching the instruction. One instruction, hundreds of data items.</li>
<li><strong>"Instruction complete, fetch next instruction"</strong> returns to instruction address calculation — this is where a branch instruction changes the answer instead of just adding the instruction length.</li>
<li><strong>Read the diagram as a cost model.</strong> Every arrow that crosses into memory costs a memory access. An instruction with three memory operands walks the operand-fetch loop three times. That is exactly the cost you will count on slide 8 when comparing 3-, 2-, 1- and 0-address machines.</li>
<li><strong>Connect to Ch.3 and Ch.16.</strong> Ch.3 drew the same cycle with only fetch and execute; this version adds the internal states. Ch.16 will overlap them across instructions — that is pipelining, and it only works because the states are cleanly separated here.</li>
</ul>
<p class="meo">💡 Memory hook: the diagram has exactly <strong>three "calculation" bubbles</strong> — one for the instruction address, one for a source operand address, one for a result operand address. Three address calculations = the three places an address can be needed.</p>`,
        `<p class="y-chinh">🎯 Chu trình nạp–thi hành của Ch.3, vẽ lại với đúng những trạng thái quan trọng <em>ĐỐI VỚI CHƯƠNG NÀY</em>. Đọc nó như một câu: <strong>tính xem lệnh nằm đâu → nạp lệnh → giải mã → tính xem từng toán hạng nằm đâu → nạp từng toán hạng → thực hiện thao tác → tính xem kết quả đi đâu → ghi kết quả → quay vòng.</strong></p>
<table>
<tr><th>Trạng thái trên sơ đồ</th><th>Xảy ra chuyện gì</th><th>Dùng thành phần nào của lệnh</th></tr>
<tr><td>Instruction address calculation<br />(tính địa chỉ lệnh)</td><td>Quyết định địa chỉ lệnh kế tiếp (bình thường là PC + độ dài lệnh)</td><td>Tham chiếu lệnh kế tiếp (thường ngầm định)</td></tr>
<tr><td>Instruction fetch (nạp lệnh)</td><td>Đọc lệnh đó từ bộ nhớ vào thanh ghi lệnh IR</td><td>—</td></tr>
<tr><td>Instruction operation decoding (giải mã)</td><td>Tìm ra thao tác nào được yêu cầu và cần những toán hạng nào</td><td>Opcode</td></tr>
<tr><td>Operand address calculation</td><td>Tính xem một toán hạng nguồn nằm ở đâu</td><td>Tham chiếu toán hạng nguồn + chế độ địa chỉ (Ch.14)</td></tr>
<tr><td>Operand fetch (nạp toán hạng)</td><td>Đọc toán hạng đó từ bộ nhớ hoặc từ I/O</td><td>Tham chiếu toán hạng nguồn</td></tr>
<tr><td>Data operation (thao tác dữ liệu)</td><td>Thực hiện thao tác thật trong ALU</td><td>Opcode</td></tr>
<tr><td>Operand address calculation → Operand store</td><td>Tính chỗ kết quả đi tới rồi ghi vào</td><td>Tham chiếu toán hạng kết quả</td></tr>
</table>
<ul>
<li><strong>Hai vòng tự lặp mới là ý của hình.</strong> "Multiple operands" quay ngược về nạp toán hạng, và "Multiple results" quay ngược về ghi toán hạng. Một lệnh DUY NHẤT có thể cần vài toán hạng và có thể sinh vài kết quả — vì thế các ô là TRẠNG THÁI trong một vòng lặp, không phải một đường thẳng.</li>
<li><strong>"Return for string or vector data" là vòng lặp ngoài.</strong> Một lệnh chuỗi hoặc lệnh vector (nghĩ tới <code>MOVS</code> của x86, hay một lệnh SIMD ở slide 17) lặp lại cả đoạn nạp–tính–ghi hàng trăm lần mà KHÔNG nạp lại lệnh. Một lệnh, hàng trăm mục dữ liệu.</li>
<li><strong>"Instruction complete, fetch next instruction"</strong> quay về ô tính địa chỉ lệnh — đây chính là nơi một lệnh rẽ nhánh thay đổi đáp án thay vì chỉ cộng thêm độ dài lệnh.</li>
<li><strong>Đọc sơ đồ như một MÔ HÌNH CHI PHÍ.</strong> Mỗi mũi tên chạm vào bộ nhớ là tốn một lần truy cập bộ nhớ. Lệnh có ba toán hạng bộ nhớ thì đi vòng nạp toán hạng ba lượt. Đó đúng là cái giá bạn sẽ ĐẾM ở slide 8 khi so máy 3, 2, 1 và 0 địa chỉ.</li>
<li><strong>Nối sang Ch.3 và Ch.16.</strong> Ch.3 vẽ cùng chu trình này nhưng chỉ có nạp và thi hành; bản này thêm các trạng thái bên trong. Ch.16 sẽ chồng chúng lên nhau giữa các lệnh — đó là đường ống (pipeline), và nó chạy được CHỈ VÌ các trạng thái ở đây đã tách bạch.</li>
</ul>
<p class="meo">💡 Mẹo nhớ: sơ đồ có đúng <strong>BA bong bóng chữ "calculation"</strong> — một cho địa chỉ lệnh, một cho địa chỉ toán hạng nguồn, một cho địa chỉ toán hạng kết quả. Ba phép tính địa chỉ = ba chỗ có thể cần tới một địa chỉ.</p>`],

      [4, 'Source and result operands can be in one of four areas',
        `<p class="y-chinh">🎯 An operand reference has to point <em>somewhere</em>, and there are exactly <strong>four places</strong> it can point. Memorise this list — it is the shortest, most exam-friendly slide in the chapter.</p>
<table>
<tr><th>#</th><th>Area</th><th>What the instruction must supply</th><th>Cost of one access</th></tr>
<tr><td>1</td><td><strong>Main or virtual memory</strong></td><td>The main or virtual memory address</td><td>Slowest — a full memory cycle (Ch.4/Ch.5: hopefully a cache hit)</td></tr>
<tr><td>2</td><td><strong>I/O device</strong></td><td>The I/O module and device. With memory-mapped I/O this is just another memory address</td><td>Slowest of all — device speed (Ch.8)</td></tr>
<tr><td>3</td><td><strong>Processor register</strong></td><td>The <em>number</em> of the desired register (each register has a unique name/number)</td><td>Fastest — no memory access at all</td></tr>
<tr><td>4</td><td><strong>Immediate</strong></td><td>Nothing extra: the value itself sits in a field of the instruction</td><td>Free — it arrived with the instruction fetch</td></tr>
</table>
<ul>
<li><strong>The list is ordered by how much the instruction has to say.</strong> Memory needs a full address (many bits). A register needs only a small number — with 16 registers, 4 bits is enough. Immediate needs no address at all, just the value. That is why register-based instructions are <em>short</em>, and it is half the argument for RISC in Ch.17.</li>
<li><strong>Memory-mapped I/O collapses area 2 into area 1.</strong> The slide says this explicitly: "if memory-mapped I/O is used, this is just another main or virtual memory address". So a memory-mapped machine really has three areas, and no special I/O instructions at all — compare with the isolated I/O of slide 31, which keeps them separate.</li>
<li><strong>"Virtual memory" is in the list on purpose.</strong> The address in the instruction is a <em>logical</em> address; the MMU turns it into a physical one (Ch.9). The instruction set does not know or care — which is exactly why the same binary runs under any OS memory layout.</li>
<li><strong>Immediate has one limitation worth remembering.</strong> The value must fit in an instruction field, so immediates are small and <em>read-only</em> — you can add 5 to something, you cannot store into the number 5. Ch.14 makes immediate the first of its addressing modes for exactly this reason.</li>
<li><strong>Connect to PRF192.</strong> <code>x = x + 1;</code> where <code>x</code> is a local variable in a register becomes an area-3 instruction; where <code>x</code> is a global becomes area 1; and the literal <code>1</code> is area 4. One line of C, three of the four areas.</li>
</ul>
<p class="meo">💡 Four areas, four speeds, one mnemonic: <strong>M-I-R-I</strong> — Memory, I/O, Register, Immediate. Going down the list, the operand gets <em>closer to the processor</em> and the instruction gets <em>shorter</em>.</p>`,
        `<p class="y-chinh">🎯 Một tham chiếu toán hạng phải trỏ vào ĐÂU ĐÓ, và có đúng <strong>BỐN chỗ</strong> nó trỏ vào được. Học thuộc danh sách này — đây là slide ngắn nhất và dễ ăn điểm nhất của chương.</p>
<table>
<tr><th>#</th><th>Vùng</th><th>Lệnh phải cung cấp gì</th><th>Giá một lần truy cập</th></tr>
<tr><td>1</td><td><strong>Bộ nhớ chính hoặc bộ nhớ ảo</strong></td><td>Địa chỉ bộ nhớ chính hoặc bộ nhớ ảo</td><td>Chậm — trọn một chu kỳ bộ nhớ (Ch.4/Ch.5: mong là trúng cache)</td></tr>
<tr><td>2</td><td><strong>Thiết bị vào/ra</strong></td><td>Mô-đun I/O và thiết bị. Nếu dùng I/O ánh xạ bộ nhớ thì đây chỉ là một địa chỉ bộ nhớ nữa</td><td>Chậm nhất — theo tốc độ thiết bị (Ch.8)</td></tr>
<tr><td>3</td><td><strong>Thanh ghi bộ xử lý</strong></td><td><em>SỐ HIỆU</em> của thanh ghi cần dùng (mỗi thanh ghi có tên/số riêng)</td><td>Nhanh nhất — không truy cập bộ nhớ lần nào</td></tr>
<tr><td>4</td><td><strong>Tức thời (immediate)</strong></td><td>Không cần gì thêm: chính GIÁ TRỊ nằm trong một trường của lệnh</td><td>Miễn phí — nó đã theo lệnh về từ lúc nạp lệnh</td></tr>
</table>
<ul>
<li><strong>Danh sách xếp theo "lệnh phải nói bao nhiêu".</strong> Bộ nhớ cần trọn một địa chỉ (nhiều bit). Thanh ghi chỉ cần một số nhỏ — có 16 thanh ghi thì 4 bit là đủ. Tức thời không cần địa chỉ nào, chỉ cần giá trị. Đó là lý do lệnh làm việc trên thanh ghi thì NGẮN, và đó là một nửa lập luận của RISC ở Ch.17.</li>
<li><strong>I/O ánh xạ bộ nhớ gộp vùng 2 vào vùng 1.</strong> Slide nói thẳng: "nếu dùng memory-mapped I/O thì đây chỉ là một địa chỉ bộ nhớ chính/ảo nữa". Vậy một máy ánh xạ bộ nhớ thật ra chỉ có BA vùng, và không cần lệnh I/O riêng nào — đối chiếu với isolated I/O ở slide 31, kiểu vẫn tách riêng.</li>
<li><strong>Chữ "virtual memory" nằm trong danh sách là CÓ CHỦ Ý.</strong> Địa chỉ trong lệnh là địa chỉ <em>LOGIC</em>; MMU biến nó thành địa chỉ vật lý (Ch.9). Tập lệnh không biết và không cần biết — đó chính xác là lý do cùng một tệp nhị phân chạy được dưới mọi cách bố trí bộ nhớ của hệ điều hành.</li>
<li><strong>Tức thời có một giới hạn đáng nhớ.</strong> Giá trị phải VỪA một trường của lệnh, nên toán hạng tức thời vừa nhỏ vừa <em>CHỈ ĐỌC</em> — bạn cộng 5 vào một thứ được, chứ không ghi vào con số 5 được. Ch.14 xếp immediate làm chế độ địa chỉ đầu tiên đúng vì lẽ đó.</li>
<li><strong>Nối sang PRF192.</strong> <code>x = x + 1;</code> với <code>x</code> là biến cục bộ nằm trong thanh ghi thì thành lệnh vùng 3; với <code>x</code> là biến toàn cục thì thành vùng 1; còn hằng <code>1</code> là vùng 4. Một dòng C, ba trong bốn vùng.</li>
</ul>
<p class="meo">💡 Bốn vùng, bốn tốc độ, một câu nhớ: <strong>Bộ nhớ – Vào/ra – Thanh ghi – Tức thời</strong>. Đi xuống theo danh sách, toán hạng càng <em>GẦN bộ xử lý</em> hơn và lệnh càng <em>NGẮN</em> hơn.</p>`],

      [5, 'Figure 13.2 — A Simple Instruction Format',
        `<p class="y-chinh">🎯 The chapter's first concrete instruction: <strong>16 bits, divided into a 4-bit opcode and two 6-bit operand references</strong>. Two sentences of text plus one picture, and almost every instruction-format exam question comes out of this picture.</p>
<ul>
<li><strong>The two sentences on the slide.</strong> "Within the computer each instruction is represented by a sequence of bits" and "the instruction is divided into <em>fields</em>, corresponding to the constituent elements of the instruction". A field is just a named group of bit positions — the hardware knows which bits mean what purely by position.</li>
<li><strong>Read the arithmetic straight off the picture.</strong> 4 + 6 + 6 = 16 bits total. A 4-bit opcode encodes 2<sup>4</sup> = <strong>16 different operations</strong>. A 6-bit operand reference names one of 2<sup>6</sup> = <strong>64 locations</strong>. So this toy machine can do 16 things to 64 places. Both numbers are painfully small — and that is the lesson.</li>
<li><strong>Every bit is contested.</strong> The instruction is a fixed budget: more opcodes means fewer bits for addresses, more addresses means fewer opcodes. Steal one bit from the opcode and you get 8 operations but 128 locations. This tug-of-war is the entire subject of Ch.14's instruction format section.</li>
<li><strong>Why there are TWO operand references and not three.</strong> With 16 bits, three 6-bit fields would need 4 + 18 = 22 bits. The format on this slide is therefore a <em>two-address</em> machine (slide 9's second row), where the result overwrites one of the sources — the classic compromise.</li>
</ul>
<p class="nhan">📐 Worked example, the format on this slide. Suppose opcode 0011 = ADD, and the instruction is <code>0011 000101 001110</code>.</p>
<table>
<tr><th>Field</th><th>Bits</th><th>Value</th><th>Meaning</th></tr>
<tr><td>Opcode</td><td>0011</td><td>3</td><td>ADD</td></tr>
<tr><td>Operand ref 1</td><td>000101</td><td>5</td><td>location 5 — destination and first source</td></tr>
<tr><td>Operand ref 2</td><td>001110</td><td>14</td><td>location 14 — second source</td></tr>
</table>
<p class="dap-an">✅ The instruction means <strong>location 5 ← location 5 + location 14</strong>, and it occupies exactly 2 bytes of memory. Written by a programmer it would be <code>ADD 5, 14</code>; written by the machine it is the 16-bit number 0011000101001110 = 0x314E.</p>
<p class="pitfall">⚠️ Trap: the bit pattern 0011000101001110 is <em>also</em> a perfectly good integer (12622) and a perfectly good pair of characters. Nothing in memory says "I am an instruction". The <strong>only</strong> thing that makes those bits an instruction is that the PC pointed at them during an instruction fetch — the same bit pattern reached through operand fetch is data. This is the von Neumann stored-program idea from Ch.1, and it is why a buffer overflow can execute data.</p>`,
        `<p class="y-chinh">🎯 Lệnh cụ thể đầu tiên của chương: <strong>16 bit, chia thành opcode 4 bit và hai tham chiếu toán hạng 6 bit</strong>. Hai câu chữ cộng một bức hình, và gần như mọi câu hỏi thi về khuôn dạng lệnh đều chui ra từ bức hình này.</p>
<ul>
<li><strong>Hai câu trên slide.</strong> "Trong máy tính mỗi lệnh được biểu diễn bằng một dãy bit" và "lệnh được chia thành các <em>TRƯỜNG</em>, tương ứng với các thành phần cấu thành của lệnh". Trường chỉ là một nhóm vị trí bit có tên — phần cứng biết bit nào mang nghĩa gì thuần tuý nhờ VỊ TRÍ.</li>
<li><strong>Đọc luôn phép tính từ hình.</strong> 4 + 6 + 6 = 16 bit. Opcode 4 bit mã hoá được 2<sup>4</sup> = <strong>16 thao tác khác nhau</strong>. Tham chiếu toán hạng 6 bit gọi tên được 2<sup>6</sup> = <strong>64 vị trí</strong>. Vậy cái máy đồ chơi này làm được 16 việc trên 64 chỗ. Cả hai con số đều bé đến đau lòng — và đó mới là bài học.</li>
<li><strong>Từng bit đều bị giành.</strong> Lệnh là một ngân sách cố định: nhiều opcode hơn thì ít bit cho địa chỉ hơn, nhiều địa chỉ hơn thì ít opcode hơn. Cướp một bit từ opcode thì được 8 thao tác nhưng 128 vị trí. Cuộc giằng co này chính là toàn bộ nội dung phần khuôn dạng lệnh của Ch.14.</li>
<li><strong>Vì sao có HAI tham chiếu toán hạng chứ không phải ba.</strong> Với 16 bit, ba trường 6 bit sẽ cần 4 + 18 = 22 bit. Vậy khuôn dạng trên slide này là máy <em>HAI ĐỊA CHỈ</em> (dòng thứ hai của slide 9), trong đó kết quả ĐÈ LÊN một trong hai nguồn — đúng kiểu thoả hiệp kinh điển.</li>
</ul>
<p class="nhan">📐 Ví dụ giải mẫu, đúng khuôn dạng trên slide. Giả sử opcode 0011 = ADD, và lệnh là <code>0011 000101 001110</code>.</p>
<table>
<tr><th>Trường</th><th>Bit</th><th>Giá trị</th><th>Ý nghĩa</th></tr>
<tr><td>Opcode</td><td>0011</td><td>3</td><td>ADD</td></tr>
<tr><td>Tham chiếu toán hạng 1</td><td>000101</td><td>5</td><td>ô 5 — vừa là đích, vừa là nguồn thứ nhất</td></tr>
<tr><td>Tham chiếu toán hạng 2</td><td>001110</td><td>14</td><td>ô 14 — nguồn thứ hai</td></tr>
</table>
<p class="dap-an">✅ Lệnh này nghĩa là <strong>ô 5 ← ô 5 + ô 14</strong>, và nó chiếm đúng 2 byte bộ nhớ. Lập trình viên viết ra thì là <code>ADD 5, 14</code>; máy nhìn thấy thì là số 16 bit 0011000101001110 = 0x314E.</p>
<p class="pitfall">⚠️ Bẫy: dãy bit 0011000101001110 <em>ĐỒNG THỜI</em> là một số nguyên hoàn toàn hợp lệ (12622) và một cặp ký tự hoàn toàn hợp lệ. Không có gì trong bộ nhớ ghi "tôi là một lệnh". Thứ <strong>DUY NHẤT</strong> biến dãy bit đó thành lệnh là việc PC trỏ vào nó trong một lần NẠP LỆNH — cũng dãy bit ấy nếu đi qua đường nạp toán hạng thì là DỮ LIỆU. Đây là ý tưởng chương trình lưu trữ của von Neumann ở Ch.1, và là lý do một lỗi tràn bộ đệm có thể khiến dữ liệu được thi hành.</p>`],

      [6, 'Instruction Representation — mnemonics',
        `<p class="y-chinh">🎯 Nobody writes 0011000101001110. The slide introduces the human layer: <strong>opcodes are represented by abbreviations called mnemonics</strong>, operands are represented symbolically, and each symbolic opcode has one fixed binary representation.</p>
<table>
<tr><th>Mnemonic on the slide</th><th>Meaning</th><th>Which of the four operation categories</th></tr>
<tr><td><strong>ADD</strong></td><td>Add</td><td>Arithmetic (data processing)</td></tr>
<tr><td><strong>SUB</strong></td><td>Subtract</td><td>Arithmetic</td></tr>
<tr><td><strong>MUL</strong></td><td>Multiply</td><td>Arithmetic</td></tr>
<tr><td><strong>DIV</strong></td><td>Divide</td><td>Arithmetic</td></tr>
<tr><td><strong>LOAD</strong></td><td>Load data from memory</td><td>Data transfer (data storage/movement)</td></tr>
<tr><td><strong>STOR</strong></td><td>Store data to memory</td><td>Data transfer</td></tr>
</table>
<ul>
<li><strong>Three statements on the slide, in order of importance.</strong> (i) Opcodes get mnemonics — <code>ADD</code> instead of 0011. (ii) Operands get symbols too — <code>Y</code> instead of location 5. (iii) "Each symbolic opcode has a <em>fixed</em> binary representation" — the mapping is one-to-one and decided by the ISA, not by the programmer.</li>
<li><strong>"The programmer specifies the location of each symbolic operand."</strong> This is the one part that is <em>not</em> fixed: <code>Y</code> can live anywhere, and the assembler records the choice. That job — turning symbols into addresses — is precisely what an assembler does, and it is the whole of Ch.15.</li>
<li><strong>Note the deliberate spelling <code>STOR</code>, not <code>STORE</code>.</strong> Stallings uses four-character mnemonics throughout so the examples line up; real ISAs vary (x86 uses <code>MOV</code>, ARM uses <code>STR</code>, MIPS uses <code>sw</code>). The exam uses the book's spelling, so write <code>STOR</code> and <code>MPY</code> when you reproduce Figure 13.3.</li>
<li><strong>Mnemonics are not a language — they are a transliteration.</strong> One mnemonic line becomes exactly one machine instruction. That is the difference between assembly (generation 2) and C (generation 3), where one line becomes many instructions. CSI106's three generations of language is the same idea from the other side.</li>
<li><strong>Why LOAD and STOR are on a list of arithmetic mnemonics.</strong> Because on a one-address (accumulator) machine you cannot do arithmetic without them: every value must be brought into the accumulator first. Slide 8's right-hand program is 8 instructions, and 4 of them are LOAD/STOR.</li>
</ul>
<p class="meo">💡 Learn the six mnemonics on this slide by heart — <code>ADD SUB MPY DIV LOAD STOR</code> — because Figure 13.3 on slide 8 is written entirely in them, and that figure is the most heavily examined picture in the chapter. (Note the slide lists <code>MUL</code>, but Figure 13.3 writes <code>MPY</code> for the same operation.)</p>`,
        `<p class="y-chinh">🎯 Chẳng ai viết 0011000101001110. Slide giới thiệu tầng dành cho con người: <strong>opcode được biểu diễn bằng chữ viết tắt gọi là MNEMONIC</strong>, toán hạng cũng được biểu diễn bằng ký hiệu, và mỗi opcode ký hiệu có MỘT biểu diễn nhị phân cố định.</p>
<table>
<tr><th>Mnemonic trên slide</th><th>Nghĩa</th><th>Thuộc nhóm thao tác nào</th></tr>
<tr><td><strong>ADD</strong></td><td>Cộng</td><td>Số học (xử lý dữ liệu)</td></tr>
<tr><td><strong>SUB</strong></td><td>Trừ</td><td>Số học</td></tr>
<tr><td><strong>MUL</strong></td><td>Nhân</td><td>Số học</td></tr>
<tr><td><strong>DIV</strong></td><td>Chia</td><td>Số học</td></tr>
<tr><td><strong>LOAD</strong></td><td>Nạp dữ liệu từ bộ nhớ</td><td>Chuyển dữ liệu (lưu trữ/di chuyển dữ liệu)</td></tr>
<tr><td><strong>STOR</strong></td><td>Ghi dữ liệu ra bộ nhớ</td><td>Chuyển dữ liệu</td></tr>
</table>
<ul>
<li><strong>Ba khẳng định trên slide, xếp theo độ quan trọng.</strong> (i) Opcode có mnemonic — <code>ADD</code> thay cho 0011. (ii) Toán hạng cũng có ký hiệu — <code>Y</code> thay cho ô số 5. (iii) "Mỗi opcode ký hiệu có một biểu diễn nhị phân <em>CỐ ĐỊNH</em>" — ánh xạ là một-một và do ISA quyết, không phải do lập trình viên.</li>
<li><strong>"Lập trình viên chỉ định vị trí của từng toán hạng ký hiệu."</strong> Đây là phần duy nhất KHÔNG cố định: <code>Y</code> nằm ở đâu cũng được, và trình hợp dịch ghi lại lựa chọn đó. Đúng công việc ấy — biến ký hiệu thành địa chỉ — là việc của assembler, và là toàn bộ nội dung Ch.15.</li>
<li><strong>Để ý cách viết CÓ CHỦ Ý <code>STOR</code>, không phải <code>STORE</code>.</strong> Stallings dùng mnemonic bốn ký tự xuyên suốt để các ví dụ thẳng cột; ISA thật thì mỗi hãng một kiểu (x86 dùng <code>MOV</code>, ARM dùng <code>STR</code>, MIPS dùng <code>sw</code>). Đề thi dùng cách viết của sách, nên khi chép lại Figure 13.3 thì hãy viết <code>STOR</code> và <code>MPY</code>.</li>
<li><strong>Mnemonic không phải một ngôn ngữ — nó là một phép PHIÊN TỰ.</strong> Một dòng mnemonic thành ĐÚNG một lệnh máy. Đó là khác biệt giữa hợp ngữ (thế hệ 2) và C (thế hệ 3), nơi một dòng thành RẤT NHIỀU lệnh. Ba thế hệ ngôn ngữ của CSI106 là cùng ý đó nhìn từ phía bên kia.</li>
<li><strong>Vì sao LOAD và STOR lại đứng chung danh sách với mnemonic số học.</strong> Vì trên máy MỘT địa chỉ (máy tích luỹ) bạn không làm được phép tính nào nếu thiếu chúng: mọi giá trị phải được đưa vào thanh ghi tích luỹ trước. Chương trình bên phải ở slide 8 dài 8 lệnh, mà 4 lệnh trong đó là LOAD/STOR.</li>
</ul>
<p class="meo">💡 Học thuộc sáu mnemonic trên slide này — <code>ADD SUB MPY DIV LOAD STOR</code> — vì Figure 13.3 ở slide 8 viết hoàn toàn bằng chúng, mà hình đó là bức hình bị hỏi thi nhiều nhất cả chương. (Lưu ý slide liệt kê <code>MUL</code>, nhưng Figure 13.3 lại viết <code>MPY</code> cho cùng một phép.)</p>`],

      [7, 'Instruction Types — the four categories',
        `<p class="y-chinh">🎯 A four-quadrant circle that partitions <em>every</em> machine instruction ever designed into four categories: <strong>data processing, data storage, data movement, and control</strong>. If you can put an instruction in the right quadrant you understand what it is for.</p>
<table>
<tr><th>Quadrant</th><th>What the slide says it covers</th><th>Typical x86 instructions</th></tr>
<tr><td><strong>Data processing</strong></td><td>"Arithmetic instructions provide computational capabilities for processing numeric data"; "Logic (Boolean) instructions operate on the bits of a word as bits rather than as numbers, thus they provide capabilities for processing any other type of data the user may wish to employ"</td><td><code>ADD SUB MUL DIV</code>, <code>AND OR XOR NOT</code>, <code>SAL SHR ROL</code></td></tr>
<tr><td><strong>Data storage</strong></td><td>"Movement of data into or out of register and or memory locations"</td><td><code>MOV</code>, <code>PUSH</code>, <code>POP</code>, <code>XCHG</code></td></tr>
<tr><td><strong>Data movement</strong></td><td>"I/O instructions are needed to transfer programs and data into memory and the results of computations back out to the user"</td><td><code>IN</code>, <code>INS</code>, <code>OUT</code>, <code>OUTS</code></td></tr>
<tr><td><strong>Control</strong></td><td>"Test instructions are used to test the value of a data word or the status of a computation"; "Branch instructions are used to branch to a different set of instructions depending on the decision made"</td><td><code>CMP</code>, <code>TEST</code>, <code>JMP</code>, <code>Jcc</code>, <code>CALL</code>, <code>RET</code></td></tr>
</table>
<ul>
<li><strong>The two circular arrows in the middle are not decoration.</strong> They say the four categories <em>feed each other</em>: I/O brings data in (movement) → it lands in memory (storage) → the ALU works on it (processing) → the result decides where to go next (control) → and back out through I/O. That loop is a whole program, in four boxes.</li>
<li><strong>The line about logic instructions is the subtle one.</strong> "Operate on the bits of a word <em>as bits rather than as numbers</em>" — that is what makes AND/OR/XOR universal: they do not care whether the word is an integer, a character, a pixel or a set of flags. Slide 14 (Logical Data) develops exactly this.</li>
<li><strong>Test and branch are a PAIR, not one thing.</strong> On x86 <code>CMP</code> sets the flags and <code>Jcc</code> reads them — two instructions, two slides apart in Table 13.3 (slides 20 and 22). Separating them is what lets one comparison drive several different jumps.</li>
<li><strong>Beware the naming.</strong> "Data storage" and "data movement" sound identical in English, and in later slides the book merges them under one heading, <em>data transfer</em> (slide 24). Treat storage = register/memory traffic, movement = I/O traffic.</li>
<li><strong>Compare with the operation list on slide 48 (the chapter summary).</strong> There the categories are named data transfer, arithmetic, logical, conversion, I/O, system control, transfer of control — seven, not four. The four-quadrant picture is the coarse view; the seven-item list is the fine one, and Table 13.4 (slide 23) is what connects them.</li>
</ul>
<p class="meo">💡 Sorting test: for any instruction ask "does it change a <em>value</em> (processing), change <em>where a value lives</em> (storage/movement), or change <em>which instruction runs next</em> (control)?" Exactly one answer fits.</p>`,
        `<p class="y-chinh">🎯 Một vòng tròn chia bốn phần, phân loại <em>MỌI</em> lệnh máy từng được thiết kế vào bốn nhóm: <strong>xử lý dữ liệu, lưu trữ dữ liệu, di chuyển dữ liệu, và điều khiển</strong>. Xếp được một lệnh vào đúng góc phần tư là bạn đã hiểu nó dùng để làm gì.</p>
<table>
<tr><th>Góc phần tư</th><th>Slide ghi nó bao gồm gì</th><th>Lệnh x86 tiêu biểu</th></tr>
<tr><td><strong>Data processing<br />(xử lý dữ liệu)</strong></td><td>"Lệnh số học cung cấp khả năng tính toán để xử lý dữ liệu số"; "Lệnh logic (Boolean) thao tác trên các bit của một từ NHƯ LÀ BIT chứ không như số, nhờ đó cho khả năng xử lý bất kỳ kiểu dữ liệu nào khác mà người dùng muốn"</td><td><code>ADD SUB MUL DIV</code>, <code>AND OR XOR NOT</code>, <code>SAL SHR ROL</code></td></tr>
<tr><td><strong>Data storage<br />(lưu trữ dữ liệu)</strong></td><td>"Di chuyển dữ liệu vào hoặc ra khỏi thanh ghi và/hoặc các ô nhớ"</td><td><code>MOV</code>, <code>PUSH</code>, <code>POP</code>, <code>XCHG</code></td></tr>
<tr><td><strong>Data movement<br />(di chuyển dữ liệu)</strong></td><td>"Lệnh I/O cần để đưa chương trình và dữ liệu VÀO bộ nhớ và đưa kết quả tính toán RA cho người dùng"</td><td><code>IN</code>, <code>INS</code>, <code>OUT</code>, <code>OUTS</code></td></tr>
<tr><td><strong>Control<br />(điều khiển)</strong></td><td>"Lệnh kiểm tra dùng để kiểm giá trị một từ dữ liệu hoặc trạng thái một phép tính"; "Lệnh rẽ nhánh dùng để nhảy sang một tập lệnh khác tuỳ theo quyết định đã đưa ra"</td><td><code>CMP</code>, <code>TEST</code>, <code>JMP</code>, <code>Jcc</code>, <code>CALL</code>, <code>RET</code></td></tr>
</table>
<ul>
<li><strong>Hai mũi tên tròn ở giữa KHÔNG phải trang trí.</strong> Chúng nói bốn nhóm <em>NUÔI NHAU</em>: I/O đưa dữ liệu vào (movement) → nó nằm xuống bộ nhớ (storage) → ALU làm việc trên nó (processing) → kết quả quyết định đi đâu tiếp (control) → rồi lại ra ngoài qua I/O. Vòng đó là NGUYÊN một chương trình, gói trong bốn ô.</li>
<li><strong>Câu về lệnh logic mới là câu tinh tế.</strong> "Thao tác trên các bit của một từ <em>NHƯ LÀ BIT chứ không như số</em>" — đó là thứ làm AND/OR/XOR trở nên phổ dụng: chúng không quan tâm từ đó là số nguyên, ký tự, điểm ảnh hay một bộ cờ. Slide 14 (Logical Data) khai triển đúng ý này.</li>
<li><strong>Kiểm tra và rẽ nhánh là một CẶP, không phải một thứ.</strong> Trên x86 <code>CMP</code> đặt cờ còn <code>Jcc</code> đọc cờ — hai lệnh, nằm cách nhau hai slide trong Table 13.3 (slide 20 và 22). Tách chúng ra chính là thứ cho phép một phép so sánh điều khiển nhiều lệnh nhảy khác nhau.</li>
<li><strong>Coi chừng cách đặt tên.</strong> "Data storage" và "data movement" nghe y hệt nhau, và ở các slide sau sách gộp cả hai dưới một tiêu đề là <em>data transfer</em> (slide 24). Cứ hiểu: storage = lưu thông giữa thanh ghi/bộ nhớ, movement = lưu thông với I/O.</li>
<li><strong>So với danh sách thao tác ở slide 48 (tổng kết chương).</strong> Ở đó các nhóm tên là data transfer, arithmetic, logical, conversion, I/O, system control, transfer of control — BẢY chứ không phải bốn. Hình bốn phần là cách nhìn THÔ; danh sách bảy mục là cách nhìn MỊN, và Table 13.4 (slide 23) là cái nối hai cách nhìn ấy.</li>
</ul>
<p class="meo">💡 Phép phân loại nhanh: với bất kỳ lệnh nào hãy hỏi "nó đổi một <em>GIÁ TRỊ</em> (processing), đổi <em>CHỖ GIÁ TRỊ NẰM</em> (storage/movement), hay đổi <em>LỆNH NÀO CHẠY TIẾP</em> (control)?" Chỉ đúng một đáp án vừa.</p>`],

      [8, 'Figure 13.3 — Programs to Execute Y = (A − B) / (C + (D × E))',
        `<p class="y-chinh">🎯 <strong>The single most examined slide of the chapter.</strong> One expression, <em>Y = (A − B) ÷ (C + (D × E))</em>, written three times for three machines: (a) three-address, (b) two-address, (c) one-address. The exam asks you to reproduce these — and usually to add the fourth, the zero-address (stack) version, which this slide does <em>not</em> show.</p>
<p class="nhan">📐 <strong>(a) Three-address machine.</strong> Every instruction names destination, source 1, source 2 — so nothing needs moving first.</p>
<table>
<tr><th>#</th><th>Instruction</th><th>Meaning</th></tr>
<tr><td>1</td><td><code>SUB Y, A, B</code></td><td>Y ← A − B</td></tr>
<tr><td>2</td><td><code>MPY T, D, E</code></td><td>T ← D × E</td></tr>
<tr><td>3</td><td><code>ADD T, T, C</code></td><td>T ← T + C</td></tr>
<tr><td>4</td><td><code>DIV Y, Y, T</code></td><td>Y ← Y ÷ T</td></tr>
</table>
<p class="nhan">📐 <strong>(b) Two-address machine.</strong> The destination is also a source, so one operand is destroyed — you must <code>MOVE</code> a copy first whenever you still need the original.</p>
<table>
<tr><th>#</th><th>Instruction</th><th>Meaning</th><th>Why it is needed</th></tr>
<tr><td>1</td><td><code>MOVE Y, A</code></td><td>Y ← A</td><td>A must survive, so work on a copy</td></tr>
<tr><td>2</td><td><code>SUB Y, B</code></td><td>Y ← Y − B</td><td>now Y = A − B</td></tr>
<tr><td>3</td><td><code>MOVE T, D</code></td><td>T ← D</td><td>D must survive too</td></tr>
<tr><td>4</td><td><code>MPY T, E</code></td><td>T ← T × E</td><td>now T = D × E</td></tr>
<tr><td>5</td><td><code>ADD T, C</code></td><td>T ← T + C</td><td>now T = C + D × E</td></tr>
<tr><td>6</td><td><code>DIV Y, T</code></td><td>Y ← Y ÷ T</td><td>the answer</td></tr>
</table>
<p class="nhan">📐 <strong>(c) One-address (accumulator) machine.</strong> One operand is always the implicit accumulator AC, so every value must be loaded in and every result stored out.</p>
<table>
<tr><th>#</th><th>Instruction</th><th>Meaning</th></tr>
<tr><td>1</td><td><code>LOAD D</code></td><td>AC ← D</td></tr>
<tr><td>2</td><td><code>MPY E</code></td><td>AC ← AC × E</td></tr>
<tr><td>3</td><td><code>ADD C</code></td><td>AC ← AC + C</td></tr>
<tr><td>4</td><td><code>STOR Y</code></td><td>Y ← AC &nbsp;&nbsp;<em>(Y is used as scratch here!)</em></td></tr>
<tr><td>5</td><td><code>LOAD A</code></td><td>AC ← A</td></tr>
<tr><td>6</td><td><code>SUB B</code></td><td>AC ← AC − B</td></tr>
<tr><td>7</td><td><code>DIV Y</code></td><td>AC ← AC ÷ Y</td></tr>
<tr><td>8</td><td><code>STOR Y</code></td><td>Y ← AC</td></tr>
</table>
<p class="nhan">📐 <strong>(d) Zero-address (stack) machine — NOT on this slide</strong>, only implied by the last row of Table 13.1 on slide 9. Written here because every exam asks for it; the step-by-step stack trace is on the next slide.</p>
<table>
<tr><th>#</th><th>Instruction</th><th>Meaning</th></tr>
<tr><td>1</td><td><code>PUSH A</code></td><td>push A onto the stack</td></tr>
<tr><td>2</td><td><code>PUSH B</code></td><td>push B</td></tr>
<tr><td>3</td><td><code>SUB</code></td><td>pop two, push (A − B)</td></tr>
<tr><td>4</td><td><code>PUSH C</code></td><td>push C</td></tr>
<tr><td>5</td><td><code>PUSH D</code></td><td>push D</td></tr>
<tr><td>6</td><td><code>PUSH E</code></td><td>push E</td></tr>
<tr><td>7</td><td><code>MPY</code></td><td>pop two, push (D × E)</td></tr>
<tr><td>8</td><td><code>ADD</code></td><td>pop two, push (C + D × E)</td></tr>
<tr><td>9</td><td><code>DIV</code></td><td>pop two, push the quotient</td></tr>
<tr><td>10</td><td><code>POP Y</code></td><td>pop into Y</td></tr>
</table>
<p class="nhan">📐 <strong>All four programs were SIMULATED, not eyeballed.</strong> Four little virtual machines were written in <code>python3</code> (exact rational arithmetic, so division cannot hide an error) and run with <strong>A = 20, B = 8, C = 2, D = 3, E = 4</strong>. Expected: (20 − 8) ÷ (2 + 3 × 4) = 12 ÷ 14 = 6/7 ≈ 0,857142857.</p>
<table>
<tr><th>Machine</th><th>Y produced</th><th>Matches?</th></tr>
<tr><td>Three-address</td><td>6/7</td><td>✔</td></tr>
<tr><td>Two-address</td><td>6/7</td><td>✔</td></tr>
<tr><td>One-address</td><td>6/7</td><td>✔</td></tr>
<tr><td>Zero-address (stack)</td><td>6/7, and the stack was left <strong>empty</strong></td><td>✔</td></tr>
</table>
<p class="dap-an">✅ All four agree, and the test was then repeated with <strong>2000 random value sets</strong> (skipping the cases where the denominator is 0): the four machines always produced the same number. No instruction in the tables above is wrong.</p>
<p class="nhan">📐 <strong>Now the trade-off in numbers.</strong> Assume, explicitly: <em>opcode = 1 byte, each address field = 2 bytes</em> (a 16-bit address space, as in Figure 13.2's spirit). Then a 3-address instruction is 7 bytes, a 2-address 5 bytes, a 1-address 3 bytes, a stack arithmetic instruction 1 byte and a PUSH/POP 3 bytes.</p>
<table>
<tr><th>Machine</th><th>Instructions</th><th>Bytes per instruction</th><th>Total program bytes</th><th>Operand accesses (read + write)</th></tr>
<tr><td>Three-address</td><td>4</td><td>7</td><td><strong>28</strong></td><td>8 + 4 = 12</td></tr>
<tr><td>Two-address</td><td>6</td><td>5</td><td><strong>30</strong></td><td>10 + 6 = 16</td></tr>
<tr><td>One-address</td><td>8</td><td>3</td><td><strong>24</strong></td><td>6 + 2 = 8</td></tr>
<tr><td>Zero-address</td><td>10</td><td>1 or 3</td><td><strong>22</strong></td><td>5 + 1 = 6</td></tr>
</table>
<p class="dap-an">✅ Answer: <strong>fewer addresses per instruction ⇒ shorter instructions but MORE of them.</strong> Going 3 → 0 address, the program grows from 4 to 10 instructions (2,5×) while total size shrinks from 28 to 22 bytes. The direction is exactly what the textbook claims — but notice the honest wrinkle: the <strong>two-address program is the BIGGEST of all (30 bytes)</strong>, bigger than the three-address one, because the two <code>MOVE</code> instructions it needs cost 5 bytes each and buy nothing. Fewer address fields does not monotonically mean a smaller program.</p>
<p class="pitfall">⚠️ Two traps in program (c). First, the accumulator machine computes the <em>denominator first</em> — not because it is neater, but because the AC can hold only one value, so the sub-expression that has to be parked in memory should be the one computed first. Second, it parks it in <strong>Y itself</strong>: at step 4, Y temporarily holds C + D × E, which is <em>not</em> the final answer. If an exam asks "what is in Y after instruction 5?", the answer is 14, not 6/7.</p>
<p class="meo">💡 Remember the shape, not the listing: <strong>3-address = pure formula; 2-address = formula + MOVEs; 1-address = LOAD…operate…STOR sandwiches; 0-address = postfix</strong>. Reconstruct the code from the shape and you never have to memorise 28 lines.</p>`,
        `<p class="y-chinh">🎯 <strong>Slide bị hỏi thi nhiều nhất cả chương.</strong> MỘT biểu thức, <em>Y = (A − B) ÷ (C + (D × E))</em>, viết BA lần cho ba loại máy: (a) ba địa chỉ, (b) hai địa chỉ, (c) một địa chỉ. Đề thi bắt chép lại đúng ba cái này — và thường bắt thêm cái thứ tư, máy KHÔNG địa chỉ (ngăn xếp), thứ mà slide này <em>KHÔNG</em> có.</p>
<p class="nhan">📐 <strong>(a) Máy BA địa chỉ.</strong> Mỗi lệnh gọi tên đích, nguồn 1, nguồn 2 — nên không phải chép gì trước cả.</p>
<table>
<tr><th>#</th><th>Lệnh</th><th>Ý nghĩa</th></tr>
<tr><td>1</td><td><code>SUB Y, A, B</code></td><td>Y ← A − B</td></tr>
<tr><td>2</td><td><code>MPY T, D, E</code></td><td>T ← D × E</td></tr>
<tr><td>3</td><td><code>ADD T, T, C</code></td><td>T ← T + C</td></tr>
<tr><td>4</td><td><code>DIV Y, Y, T</code></td><td>Y ← Y ÷ T</td></tr>
</table>
<p class="nhan">📐 <strong>(b) Máy HAI địa chỉ.</strong> Đích ĐỒNG THỜI là nguồn, nên một toán hạng bị phá huỷ — hễ còn cần bản gốc thì phải <code>MOVE</code> một bản sao ra trước.</p>
<table>
<tr><th>#</th><th>Lệnh</th><th>Ý nghĩa</th><th>Vì sao cần</th></tr>
<tr><td>1</td><td><code>MOVE Y, A</code></td><td>Y ← A</td><td>A phải còn nguyên, nên làm việc trên bản sao</td></tr>
<tr><td>2</td><td><code>SUB Y, B</code></td><td>Y ← Y − B</td><td>giờ Y = A − B</td></tr>
<tr><td>3</td><td><code>MOVE T, D</code></td><td>T ← D</td><td>D cũng phải còn nguyên</td></tr>
<tr><td>4</td><td><code>MPY T, E</code></td><td>T ← T × E</td><td>giờ T = D × E</td></tr>
<tr><td>5</td><td><code>ADD T, C</code></td><td>T ← T + C</td><td>giờ T = C + D × E</td></tr>
<tr><td>6</td><td><code>DIV Y, T</code></td><td>Y ← Y ÷ T</td><td>ra đáp số</td></tr>
</table>
<p class="nhan">📐 <strong>(c) Máy MỘT địa chỉ (máy tích luỹ).</strong> Một toán hạng LUÔN là thanh ghi tích luỹ AC ngầm định, nên mọi giá trị phải nạp vào và mọi kết quả phải ghi ra.</p>
<table>
<tr><th>#</th><th>Lệnh</th><th>Ý nghĩa</th></tr>
<tr><td>1</td><td><code>LOAD D</code></td><td>AC ← D</td></tr>
<tr><td>2</td><td><code>MPY E</code></td><td>AC ← AC × E</td></tr>
<tr><td>3</td><td><code>ADD C</code></td><td>AC ← AC + C</td></tr>
<tr><td>4</td><td><code>STOR Y</code></td><td>Y ← AC &nbsp;&nbsp;<em>(Y bị mượn làm chỗ nháp!)</em></td></tr>
<tr><td>5</td><td><code>LOAD A</code></td><td>AC ← A</td></tr>
<tr><td>6</td><td><code>SUB B</code></td><td>AC ← AC − B</td></tr>
<tr><td>7</td><td><code>DIV Y</code></td><td>AC ← AC ÷ Y</td></tr>
<tr><td>8</td><td><code>STOR Y</code></td><td>Y ← AC</td></tr>
</table>
<p class="nhan">📐 <strong>(d) Máy KHÔNG địa chỉ (ngăn xếp) — KHÔNG có trên slide này</strong>, chỉ được ngụ ý ở dòng cuối Table 13.1 slide 9. Viết ra đây vì đề thi nào cũng hỏi; phần chạy tay ngăn xếp từng bước nằm ở slide kế.</p>
<table>
<tr><th>#</th><th>Lệnh</th><th>Ý nghĩa</th></tr>
<tr><td>1</td><td><code>PUSH A</code></td><td>đẩy A vào ngăn xếp</td></tr>
<tr><td>2</td><td><code>PUSH B</code></td><td>đẩy B</td></tr>
<tr><td>3</td><td><code>SUB</code></td><td>lấy hai đỉnh ra, đẩy (A − B) vào</td></tr>
<tr><td>4</td><td><code>PUSH C</code></td><td>đẩy C</td></tr>
<tr><td>5</td><td><code>PUSH D</code></td><td>đẩy D</td></tr>
<tr><td>6</td><td><code>PUSH E</code></td><td>đẩy E</td></tr>
<tr><td>7</td><td><code>MPY</code></td><td>lấy hai đỉnh, đẩy (D × E)</td></tr>
<tr><td>8</td><td><code>ADD</code></td><td>lấy hai đỉnh, đẩy (C + D × E)</td></tr>
<tr><td>9</td><td><code>DIV</code></td><td>lấy hai đỉnh, đẩy thương</td></tr>
<tr><td>10</td><td><code>POP Y</code></td><td>lấy đỉnh ra ghi vào Y</td></tr>
</table>
<p class="nhan">📐 <strong>Cả bốn chương trình đã được MÔ PHỎNG THẬT, không phải nhìn bằng mắt.</strong> Bốn cái máy ảo nhỏ viết bằng <code>python3</code> (số hữu tỉ chính xác, nên phép chia không giấu được lỗi nào) và chạy với <strong>A = 20, B = 8, C = 2, D = 3, E = 4</strong>. Kỳ vọng: (20 − 8) ÷ (2 + 3 × 4) = 12 ÷ 14 = 6/7 ≈ 0,857142857.</p>
<table>
<tr><th>Kiểu máy</th><th>Y thu được</th><th>Khớp?</th></tr>
<tr><td>Ba địa chỉ</td><td>6/7</td><td>✔</td></tr>
<tr><td>Hai địa chỉ</td><td>6/7</td><td>✔</td></tr>
<tr><td>Một địa chỉ</td><td>6/7</td><td>✔</td></tr>
<tr><td>Không địa chỉ (ngăn xếp)</td><td>6/7, và ngăn xếp còn lại <strong>RỖNG</strong></td><td>✔</td></tr>
</table>
<p class="dap-an">✅ Cả bốn khớp nhau, rồi phép thử được lặp lại với <strong>2000 bộ giá trị ngẫu nhiên</strong> (bỏ qua ca mẫu số bằng 0): bốn kiểu máy LUÔN ra cùng một số. Không có lệnh nào trong các bảng trên bị sai.</p>
<p class="nhan">📐 <strong>Giờ đến phần đánh đổi, bằng số.</strong> Giả định, nói rõ: <em>opcode = 1 byte, mỗi trường địa chỉ = 2 byte</em> (không gian địa chỉ 16 bit, đúng tinh thần Figure 13.2). Khi đó lệnh 3 địa chỉ dài 7 byte, 2 địa chỉ 5 byte, 1 địa chỉ 3 byte, lệnh số học của máy ngăn xếp 1 byte và PUSH/POP 3 byte.</p>
<table>
<tr><th>Kiểu máy</th><th>Số lệnh</th><th>Byte mỗi lệnh</th><th>Tổng byte chương trình</th><th>Truy cập toán hạng (đọc + ghi)</th></tr>
<tr><td>Ba địa chỉ</td><td>4</td><td>7</td><td><strong>28</strong></td><td>8 + 4 = 12</td></tr>
<tr><td>Hai địa chỉ</td><td>6</td><td>5</td><td><strong>30</strong></td><td>10 + 6 = 16</td></tr>
<tr><td>Một địa chỉ</td><td>8</td><td>3</td><td><strong>24</strong></td><td>6 + 2 = 8</td></tr>
<tr><td>Không địa chỉ</td><td>10</td><td>1 hoặc 3</td><td><strong>22</strong></td><td>5 + 1 = 6</td></tr>
</table>
<p class="dap-an">✅ Đáp án: <strong>càng ÍT địa chỉ mỗi lệnh ⇒ lệnh càng NGẮN nhưng cần càng NHIỀU lệnh.</strong> Đi từ 3 → 0 địa chỉ, chương trình phình từ 4 lên 10 lệnh (2,5 lần) trong khi tổng kích thước co từ 28 xuống 22 byte. Chiều hướng đúng như sách nói — nhưng để ý cái gợn THÀNH THẬT: chương trình <strong>HAI địa chỉ lại TO NHẤT (30 byte)</strong>, to hơn cả bản ba địa chỉ, vì hai lệnh <code>MOVE</code> nó buộc phải thêm tốn 5 byte mỗi lệnh mà chẳng mua được gì. Ít trường địa chỉ KHÔNG đồng nghĩa chương trình nhỏ đi một cách đơn điệu.</p>
<p class="pitfall">⚠️ Hai cái bẫy trong chương trình (c). MỘT, máy tích luỹ tính <em>MẪU SỐ TRƯỚC</em> — không phải cho đẹp, mà vì AC chỉ giữ được MỘT giá trị, nên biểu thức con buộc phải gửi tạm ra bộ nhớ thì nên là cái tính trước. HAI, nó gửi tạm vào <strong>chính Y</strong>: ở bước 4, Y đang tạm giữ C + D × E, <em>KHÔNG PHẢI</em> đáp số cuối. Đề hỏi "sau lệnh 5 thì Y bằng bao nhiêu?" thì đáp án là 14, không phải 6/7.</p>
<p class="meo">💡 Nhớ HÌNH DẠNG, đừng nhớ danh sách: <strong>3 địa chỉ = công thức thuần; 2 địa chỉ = công thức + các lệnh MOVE; 1 địa chỉ = các lát bánh LOAD…tính…STOR; 0 địa chỉ = hậu tố</strong>. Dựng lại mã từ hình dạng thì không bao giờ phải học thuộc 28 dòng.</p>`],

      [9, 'Table 13.1 — Utilization of Instruction Addresses (Nonbranching Instructions)',
        `<p class="y-chinh">🎯 The four machine types on one row each. This table is the <em>definition</em> that Figure 13.3 illustrated — learn the "Interpretation" column and you can write any of the four programs from scratch.</p>
<table>
<tr><th>Number of addresses</th><th>Symbolic representation</th><th>Interpretation</th><th>What is implicit</th></tr>
<tr><td>3</td><td><code>OP A, B, C</code></td><td>A ← B OP C</td><td>nothing</td></tr>
<tr><td>2</td><td><code>OP A, B</code></td><td>A ← A OP B</td><td>the destination doubles as a source</td></tr>
<tr><td>1</td><td><code>OP A</code></td><td>AC ← AC OP A</td><td>the accumulator AC</td></tr>
<tr><td><strong>0</strong> (see warning)</td><td><code>OP</code></td><td>T ← (T − 1) OP T</td><td>the top two elements of the stack</td></tr>
</table>
<p class="nhan">📐 The slide's own key: <strong>AC</strong> = accumulator · <strong>T</strong> = top of stack · <strong>(T − 1)</strong> = second element of stack · <strong>A, B, C</strong> = memory or register locations.</p>
<p class="pitfall">⚠️⚠️ <strong>The slide has a misprint, and it is worth a mark.</strong> The last row — the stack machine, whose symbolic form is just <code>OP</code> with <em>no</em> address at all — prints <strong>"3"</strong> in the "Number of Addresses" column. It must be <strong>0</strong>. This was checked against the rendered original slide image, so it is an error on the slide itself, not a text-extraction glitch. Write <strong>0</strong> in the exam; the interpretation column proves it (an instruction that names no operand cannot carry three addresses).</p>
<ul>
<li><strong>Read "Interpretation" as the loss of information going down the table.</strong> Row 3 destroys nothing. Row 2 destroys A. Row 1 destroys the accumulator. Row 0 destroys <em>both</em> top elements and replaces them with one. Each step down, the instruction says less and the machine assumes more.</li>
<li><strong>"Nonbranching" in the title is a real restriction.</strong> Branch instructions are counted differently — they always carry at least one address (the target), even on a zero-address machine. The table describes data-processing instructions only.</li>
<li><strong>Nobody builds a pure machine of any row.</strong> Real ISAs mix: x86 is mostly two-address (<code>ADD EAX, EBX</code>) but has one-address forms (<code>MUL Op</code> — implicit AL/AX/EAX, see slide 20) and zero-address forms (<code>PUSH</code>/<code>POP</code>). ARM is mostly three-address (<code>ADD R0, R1, R2</code>). The rows are <em>styles</em>, not product categories.</li>
</ul>
<p class="nhan">📐 <strong>The zero-address machine, properly.</strong> A stack machine cannot read an infix expression; it needs <strong>postfix (reverse Polish) notation</strong>, in which every operator comes <em>after</em> its two operands. Converting <em>(A − B) / (C + D × E)</em> step by step, by operator precedence:</p>
<table>
<tr><th>Step</th><th>What is resolved</th><th>Expression so far</th></tr>
<tr><td>1</td><td>innermost bracket (A − B)</td><td><code>(A B −) / (C + D × E)</code></td></tr>
<tr><td>2</td><td>× binds tighter than +, so D × E first</td><td><code>(A B −) / (C + (D E ×))</code></td></tr>
<tr><td>3</td><td>now the + inside the second bracket</td><td><code>(A B −) / (C D E × +)</code></td></tr>
<tr><td>4</td><td>finally the ÷, after both its operands</td><td><code><strong>A B − C D E × + /</strong></code></td></tr>
</table>
<p class="dap-an">✅ Postfix form: <strong><code>A B − C D E × + /</code></strong>. This was <em>not</em> converted by hand — it was produced by running the shunting-yard algorithm in <code>python3</code> on the token list, which returned exactly this string. Now read the postfix left to right: every <em>operand</em> becomes a <code>PUSH</code>, every <em>operator</em> becomes the bare operation. That is precisely the ten-instruction program on slide 8 — the stack program is nothing but the postfix expression with the word PUSH added.</p>
<p class="nhan">📐 <strong>Hand-run of the stack</strong>, with A = 20, B = 8, C = 2, D = 3, E = 4 (this is the actual trace printed by the simulator, not a reconstruction):</p>
<table>
<tr><th>Token read</th><th>Action</th><th>Stack afterwards (bottom → top)</th></tr>
<tr><td>A</td><td><code>PUSH A</code> — push 20</td><td>20</td></tr>
<tr><td>B</td><td><code>PUSH B</code> — push 8</td><td>20, 8</td></tr>
<tr><td>−</td><td><code>SUB</code> — pop 8 and 20, push 20 − 8</td><td>12</td></tr>
<tr><td>C</td><td><code>PUSH C</code> — push 2</td><td>12, 2</td></tr>
<tr><td>D</td><td><code>PUSH D</code> — push 3</td><td>12, 2, 3</td></tr>
<tr><td>E</td><td><code>PUSH E</code> — push 4</td><td>12, 2, 3, 4</td></tr>
<tr><td>×</td><td><code>MPY</code> — pop 4 and 3, push 12</td><td>12, 2, 12</td></tr>
<tr><td>+</td><td><code>ADD</code> — pop 12 and 2, push 14</td><td>12, 14</td></tr>
<tr><td>÷</td><td><code>DIV</code> — pop 14 and 12, push 12 ÷ 14</td><td>6/7</td></tr>
<tr><td>—</td><td><code>POP Y</code> — pop into Y</td><td><em>(empty)</em></td></tr>
</table>
<p class="dap-an">✅ Y = 6/7 ≈ 0,857142857, and <strong>the stack ends empty</strong> — that emptiness is the proof the expression was well formed. Maximum stack depth reached: <strong>4</strong>. Note the operand ORDER carefully: <code>SUB</code> computes <em>(second element) − (top)</em>, i.e. 20 − 8, not 8 − 20. Table 13.1 states this exactly: T ← (T − 1) OP T.</p>
<p class="meo">💡 If you have already done CSI106 chapter 9 (stack, queue, tree), this is the same push/pop discipline, and postfix evaluation was one of its worked examples. The difference here is only that the stack lives in the CPU instead of in your program — which is why a machine can execute postfix directly and needs no parentheses at all. <strong>Postfix has no brackets and needs no precedence rules</strong>; that is exactly what makes a zero-address instruction possible.</p>
<p class="pitfall">⚠️ Trap when converting by hand: subtraction and division are <em>not</em> commutative, so an operand swap is an error the arithmetic will not forgive. Check the depth too — an expression needing depth <em>d</em> on a machine whose hardware stack is shallower spills to memory, and that cost is invisible in the instruction count.</p>`,
        `<p class="y-chinh">🎯 Bốn kiểu máy, mỗi kiểu một dòng. Bảng này là ĐỊNH NGHĨA mà Figure 13.3 minh hoạ — thuộc cột "Interpretation" là bạn tự viết được cả bốn chương trình từ con số không.</p>
<table>
<tr><th>Số địa chỉ</th><th>Biểu diễn ký hiệu</th><th>Diễn giải</th><th>Cái gì ngầm định</th></tr>
<tr><td>3</td><td><code>OP A, B, C</code></td><td>A ← B OP C</td><td>không có gì</td></tr>
<tr><td>2</td><td><code>OP A, B</code></td><td>A ← A OP B</td><td>đích kiêm luôn một nguồn</td></tr>
<tr><td>1</td><td><code>OP A</code></td><td>AC ← AC OP A</td><td>thanh ghi tích luỹ AC</td></tr>
<tr><td><strong>0</strong> (xem cảnh báo)</td><td><code>OP</code></td><td>T ← (T − 1) OP T</td><td>hai phần tử trên đỉnh ngăn xếp</td></tr>
</table>
<p class="nhan">📐 Chú giải của chính slide: <strong>AC</strong> = accumulator (thanh ghi tích luỹ) · <strong>T</strong> = đỉnh ngăn xếp · <strong>(T − 1)</strong> = phần tử thứ hai của ngăn xếp · <strong>A, B, C</strong> = ô nhớ hoặc thanh ghi.</p>
<p class="pitfall">⚠️⚠️ <strong>Slide in SAI, và chỗ sai này đáng một điểm.</strong> Dòng cuối — máy NGĂN XẾP, dạng ký hiệu chỉ là <code>OP</code> KHÔNG có địa chỉ nào — lại in <strong>"3"</strong> ở cột "Number of Addresses". Phải là <strong>0</strong>. Đã đối chiếu với ẢNH slide gốc đã render, nên đây là lỗi trên CHÍNH SLIDE, không phải lỗi trích chữ. Đi thi cứ ghi <strong>0</strong>; chính cột diễn giải là bằng chứng (một lệnh không gọi tên toán hạng nào thì không thể mang ba địa chỉ).</p>
<ul>
<li><strong>Đọc cột "Diễn giải" như sự MẤT DẦN THÔNG TIN khi đi xuống bảng.</strong> Dòng 3 không phá gì. Dòng 2 phá A. Dòng 1 phá thanh ghi tích luỹ. Dòng 0 phá <em>CẢ HAI</em> phần tử đỉnh và thay bằng một. Mỗi bậc đi xuống, lệnh nói ÍT hơn và máy tự giả định NHIỀU hơn.</li>
<li><strong>Chữ "Nonbranching" trong tiêu đề là một giới hạn THẬT.</strong> Lệnh rẽ nhánh đếm khác — chúng luôn mang ít nhất một địa chỉ (địa chỉ đích), kể cả trên máy không địa chỉ. Bảng này chỉ mô tả lệnh xử lý dữ liệu.</li>
<li><strong>Chẳng ai làm máy thuần một dòng nào cả.</strong> ISA thật thì trộn: x86 chủ yếu hai địa chỉ (<code>ADD EAX, EBX</code>) nhưng có dạng một địa chỉ (<code>MUL Op</code> — ngầm định AL/AX/EAX, xem slide 20) và dạng không địa chỉ (<code>PUSH</code>/<code>POP</code>). ARM chủ yếu ba địa chỉ (<code>ADD R0, R1, R2</code>). Các dòng là PHONG CÁCH, không phải chủng loại sản phẩm.</li>
</ul>
<p class="nhan">📐 <strong>Máy không địa chỉ, nói cho tử tế.</strong> Máy ngăn xếp KHÔNG đọc được biểu thức trung tố; nó cần <strong>KÝ PHÁP HẬU TỐ (postfix, Ba Lan ngược)</strong>, trong đó mọi toán tử đứng SAU hai toán hạng của nó. Chuyển <em>(A − B) / (C + D × E)</em> từng bước, theo độ ưu tiên toán tử:</p>
<table>
<tr><th>Bước</th><th>Giải quyết cái gì</th><th>Biểu thức hiện có</th></tr>
<tr><td>1</td><td>ngoặc trong cùng (A − B)</td><td><code>(A B −) / (C + D × E)</code></td></tr>
<tr><td>2</td><td>× ưu tiên cao hơn +, nên D × E trước</td><td><code>(A B −) / (C + (D E ×))</code></td></tr>
<tr><td>3</td><td>giờ tới dấu + trong ngoặc thứ hai</td><td><code>(A B −) / (C D E × +)</code></td></tr>
<tr><td>4</td><td>cuối cùng là dấu ÷, đứng sau cả hai toán hạng của nó</td><td><code><strong>A B − C D E × + /</strong></code></td></tr>
</table>
<p class="dap-an">✅ Dạng hậu tố: <strong><code>A B − C D E × + /</code></strong>. Chuỗi này KHÔNG chuyển bằng tay — nó do thuật toán shunting-yard chạy trong <code>python3</code> trên danh sách token sinh ra, và trả về đúng chuỗi này. Giờ đọc hậu tố từ trái sang phải: mỗi <em>TOÁN HẠNG</em> thành một lệnh <code>PUSH</code>, mỗi <em>TOÁN TỬ</em> thành lệnh trơ không toán hạng. Đó chính xác là chương trình mười lệnh ở slide 8 — chương trình ngăn xếp chẳng qua là biểu thức hậu tố có thêm chữ PUSH.</p>
<p class="nhan">📐 <strong>Chạy tay ngăn xếp</strong>, với A = 20, B = 8, C = 2, D = 3, E = 4 (đây là vết THẬT do bộ mô phỏng in ra, không phải dựng lại):</p>
<table>
<tr><th>Token đang đọc</th><th>Thao tác</th><th>Ngăn xếp sau đó (đáy → đỉnh)</th></tr>
<tr><td>A</td><td><code>PUSH A</code> — đẩy 20 vào</td><td>20</td></tr>
<tr><td>B</td><td><code>PUSH B</code> — đẩy 8 vào</td><td>20, 8</td></tr>
<tr><td>−</td><td><code>SUB</code> — lấy 8 và 20 ra, đẩy 20 − 8 vào</td><td>12</td></tr>
<tr><td>C</td><td><code>PUSH C</code> — đẩy 2 vào</td><td>12, 2</td></tr>
<tr><td>D</td><td><code>PUSH D</code> — đẩy 3 vào</td><td>12, 2, 3</td></tr>
<tr><td>E</td><td><code>PUSH E</code> — đẩy 4 vào</td><td>12, 2, 3, 4</td></tr>
<tr><td>×</td><td><code>MPY</code> — lấy 4 và 3, đẩy 12</td><td>12, 2, 12</td></tr>
<tr><td>+</td><td><code>ADD</code> — lấy 12 và 2, đẩy 14</td><td>12, 14</td></tr>
<tr><td>÷</td><td><code>DIV</code> — lấy 14 và 12, đẩy 12 ÷ 14</td><td>6/7</td></tr>
<tr><td>—</td><td><code>POP Y</code> — lấy đỉnh ra ghi vào Y</td><td><em>(rỗng)</em></td></tr>
</table>
<p class="dap-an">✅ Y = 6/7 ≈ 0,857142857, và <strong>ngăn xếp kết thúc RỖNG</strong> — chính cái rỗng đó là bằng chứng biểu thức đã đúng dạng. Độ sâu ngăn xếp lớn nhất chạm tới: <strong>4</strong>. Để ý kỹ THỨ TỰ toán hạng: <code>SUB</code> tính <em>(phần tử thứ hai) − (đỉnh)</em>, tức 20 − 8, KHÔNG phải 8 − 20. Table 13.1 ghi đúng điều này: T ← (T − 1) OP T.</p>
<p class="meo">💡 Nếu bạn đã học CSI106 chương 9 (ngăn xếp, hàng đợi, cây) thì đây đúng là kỷ luật push/pop đó, và tính biểu thức hậu tố từng là một ví dụ mẫu ở chương ấy. Khác biệt duy nhất: ở đây ngăn xếp nằm TRONG CPU chứ không nằm trong chương trình của bạn — vì thế máy thi hành hậu tố trực tiếp được và chẳng cần dấu ngoặc nào. <strong>Hậu tố không có ngoặc và không cần luật ưu tiên</strong>; đúng thứ đó làm cho lệnh không địa chỉ trở nên khả thi.</p>
<p class="pitfall">⚠️ Bẫy khi chuyển bằng tay: phép trừ và phép chia KHÔNG giao hoán, nên đảo toán hạng là một lỗi mà số học không tha thứ. Nhớ kiểm cả ĐỘ SÂU — biểu thức cần độ sâu <em>d</em> mà ngăn xếp phần cứng nông hơn thì phải tràn ra bộ nhớ, và cái giá đó KHÔNG hiện ra trong số đếm lệnh.</p>`],

      [10, 'Instruction Set Design',
        `<p class="y-chinh">🎯 A three-step funnel ending in a bar of five boxes. The three statements: instruction set design is <strong>very complex because it affects so many aspects of the computer system</strong>; it <strong>defines many of the functions performed by the processor</strong>; and it is <strong>the programmer's means of controlling the processor</strong>. Then the five fundamental design issues.</p>
<table>
<tr><th>Fundamental design issue</th><th>The slide's question</th><th>Where the course answers it</th></tr>
<tr><td><strong>Operation repertoire</strong></td><td>How many and which operations to provide, and how complex operations should be</td><td>Slides 20–23 (x86 list); Ch.17 RISC argues for FEW and SIMPLE</td></tr>
<tr><td><strong>Data types</strong></td><td>The various types of data upon which operations are performed</td><td>Slides 11–19 of this deck</td></tr>
<tr><td><strong>Instruction format</strong></td><td>Instruction length in bits, number of addresses, size of various fields</td><td>Slide 5 here; Ch.14 in full</td></tr>
<tr><td><strong>Registers</strong></td><td>Number of processor registers that can be referenced by instructions, and their use</td><td>Ch.16 (register organisation); Ch.17 (register windows)</td></tr>
<tr><td><strong>Addressing</strong></td><td>The mode or modes by which the address of an operand is specified</td><td>Ch.14 entirely</td></tr>
</table>
<ul>
<li><strong>The five issues are not independent — they trade against each other inside one fixed instruction length.</strong> More operations needs more opcode bits; more registers needs more register-field bits; more addressing modes needs mode bits; more addresses per instruction needs more address fields. They all eat the same budget you saw on slide 5.</li>
<li><strong>"Very complex because it affects so many aspects" is not filler.</strong> The instruction set constrains the compiler (what it can emit), the OS (what privileged operations exist), the hardware (what the control unit must decode) and even the binary compatibility of the machine for thirty years. It is the decision with the longest shadow in the whole subject.</li>
<li><strong>"The programmer's means of controlling the processor" sets the perspective.</strong> Everything in this chapter is described <em>from outside</em> — what an instruction promises, not how the hardware keeps the promise. Ch.19 (control unit, microprogramming) is the inside view of exactly the same instructions.</li>
<li><strong>This slide is the chapter's table of contents in disguise.</strong> Issues 1 and 2 are the rest of this deck; issues 3 and 5 are Ch.14; issue 4 is Ch.16. If you can name the five, you can place any question in the right chapter.</li>
</ul>
<p class="meo">💡 Mnemonic for the five boxes: <strong>O-D-I-R-A</strong> — Operations, Data types, Instruction format, Registers, Addressing. Or read them as one sentence: "which <em>operations</em>, on which <em>data types</em>, encoded in which <em>format</em>, using which <em>registers</em>, reached by which <em>addressing</em>".</p>`,
        `<p class="y-chinh">🎯 Một cái phễu ba bậc kết thúc bằng một thanh năm ô. Ba khẳng định: thiết kế tập lệnh <strong>RẤT PHỨC TẠP vì nó ảnh hưởng tới quá nhiều mặt của hệ thống máy tính</strong>; nó <strong>ĐỊNH NGHĨA phần lớn các chức năng mà bộ xử lý thực hiện</strong>; và nó là <strong>PHƯƠNG TIỆN để lập trình viên điều khiển bộ xử lý</strong>. Rồi tới năm vấn đề thiết kế nền tảng.</p>
<table>
<tr><th>Vấn đề thiết kế nền tảng</th><th>Câu hỏi slide đặt ra</th><th>Môn học trả lời ở đâu</th></tr>
<tr><td><strong>Operation repertoire<br />(bộ thao tác)</strong></td><td>Cung cấp bao nhiêu và những thao tác nào, và thao tác nên phức tạp tới đâu</td><td>Slide 20–23 (danh sách x86); Ch.17 RISC lập luận phải ÍT và ĐƠN GIẢN</td></tr>
<tr><td><strong>Data types<br />(kiểu dữ liệu)</strong></td><td>Các kiểu dữ liệu mà thao tác được thực hiện lên</td><td>Slide 11–19 của chính deck này</td></tr>
<tr><td><strong>Instruction format<br />(khuôn dạng lệnh)</strong></td><td>Độ dài lệnh tính bằng bit, số địa chỉ, kích thước các trường</td><td>Slide 5 ở đây; Ch.14 nói đủ</td></tr>
<tr><td><strong>Registers<br />(thanh ghi)</strong></td><td>Số thanh ghi bộ xử lý mà lệnh tham chiếu được, và cách dùng chúng</td><td>Ch.16 (tổ chức thanh ghi); Ch.17 (cửa sổ thanh ghi)</td></tr>
<tr><td><strong>Addressing<br />(định địa chỉ)</strong></td><td>Chế độ hay các chế độ dùng để chỉ định địa chỉ của một toán hạng</td><td>Trọn Ch.14</td></tr>
</table>
<ul>
<li><strong>Năm vấn đề KHÔNG độc lập — chúng giành nhau bên trong một độ dài lệnh cố định.</strong> Nhiều thao tác hơn thì cần nhiều bit opcode hơn; nhiều thanh ghi hơn thì cần trường thanh ghi rộng hơn; nhiều chế độ địa chỉ hơn thì cần bit chế độ; nhiều địa chỉ mỗi lệnh hơn thì cần nhiều trường địa chỉ. Tất cả cùng ăn vào một ngân sách mà bạn đã thấy ở slide 5.</li>
<li><strong>"Rất phức tạp vì ảnh hưởng quá nhiều mặt" không phải câu độn.</strong> Tập lệnh ràng buộc trình biên dịch (được phép sinh ra gì), hệ điều hành (có những thao tác đặc quyền nào), phần cứng (khối điều khiển phải giải mã cái gì) và cả tính tương thích nhị phân của máy trong ba chục năm. Đó là quyết định có cái bóng dài nhất cả môn.</li>
<li><strong>"Phương tiện để lập trình viên điều khiển bộ xử lý" quy định GÓC NHÌN.</strong> Mọi thứ trong chương này được mô tả <em>TỪ BÊN NGOÀI</em> — lệnh HỨA điều gì, chứ không phải phần cứng giữ lời hứa bằng cách nào. Ch.19 (khối điều khiển, vi chương trình) là cái nhìn từ BÊN TRONG cho đúng những lệnh ấy.</li>
<li><strong>Slide này là MỤC LỤC của chương, nguỵ trang lại.</strong> Vấn đề 1 và 2 là phần còn lại của deck này; vấn đề 3 và 5 là Ch.14; vấn đề 4 là Ch.16. Kể được đủ năm cái là bạn đặt được câu hỏi bất kỳ vào đúng chương.</li>
</ul>
<p class="meo">💡 Mẹo nhớ năm ô: đọc thành một câu — "những <em>THAO TÁC</em> nào, trên những <em>KIỂU DỮ LIỆU</em> nào, mã hoá theo <em>KHUÔN DẠNG</em> nào, dùng những <em>THANH GHI</em> nào, chạm tới bằng <em>CHẾ ĐỘ ĐỊA CHỈ</em> nào".</p>`],

      [11, 'Types of Operands',
        `<p class="y-chinh">🎯 A single triangle with four labels: the only four kinds of thing a machine instruction ever operates on — <strong>Addresses, Numbers, Characters, Logical Data</strong>. Slides 12–14 then take three of them one at a time.</p>
<table>
<tr><th>Operand type</th><th>What it really is</th><th>Which instructions consume it</th><th>Covered on</th></tr>
<tr><td><strong>Addresses</strong></td><td>An unsigned integer that happens to name a location</td><td>Every memory reference; also address arithmetic (pointer + index)</td><td>No slide of its own — the whole of Ch.14</td></tr>
<tr><td><strong>Numbers</strong></td><td>Binary fixed point, binary floating point, decimal (packed)</td><td>ADD, SUB, MPY, DIV and their floating-point forms</td><td>Slide 12</td></tr>
<tr><td><strong>Characters</strong></td><td>Text, encoded as IRA/ASCII or EBCDIC</td><td>String moves, compares, I/O</td><td>Slide 13</td></tr>
<tr><td><strong>Logical data</strong></td><td>n independent 1-bit items, each 0 or 1</td><td>AND, OR, XOR, NOT, shifts and rotates</td><td>Slide 14</td></tr>
</table>
<ul>
<li><strong>Addresses get a corner but no slide, and that is deliberate.</strong> An address <em>is</em> a number — the book's point is that the machine treats it as one (you can add to it, compare it, index with it), which is why pointer arithmetic works at all. What makes it special is only how it is used, so its treatment is deferred to addressing modes in Ch.14.</li>
<li><strong>The list is short because hardware is expensive.</strong> Every operand type in this list needs ALU support or instructions of its own. There is no "string" type, no "record" type, no "object" type in hardware — those are built by software out of these four. That is a direct answer to the question "why does my language have types the CPU has never heard of?"</li>
<li><strong>The same bits belong to several types at once.</strong> 0100 0001 is the number 65, the character 'A' in IRA/ASCII, a set of 8 boolean flags, and possibly an address. Nothing in memory records which — the <em>instruction you apply</em> decides. Use <code>ADD</code> and it is a number; use <code>AND</code> and it is logical data.</li>
<li><strong>Compare this with Table 13.2 on slide 15.</strong> There, x86 lists eleven data types. The extra ones (ordinal, BCD, near/far pointer, bit field, bit string, byte string, packed SIMD) are all refinements of these four — the triangle is the concept, the x86 table is one vendor's realisation of it.</li>
</ul>
<p class="meo">💡 Sorting test for the exam: ask what you would do to it. <em>Do arithmetic</em> → number. <em>Print it</em> → character. <em>Mask or test individual bits</em> → logical data. <em>Dereference it</em> → address.</p>`,
        `<p class="y-chinh">🎯 Một hình tam giác với bốn nhãn: đúng bốn loại thứ mà một lệnh máy có thể thao tác lên — <strong>Địa chỉ, Số, Ký tự, Dữ liệu logic</strong>. Rồi slide 12–14 lấy ba trong bốn loại ra nói kỹ từng cái.</p>
<table>
<tr><th>Kiểu toán hạng</th><th>Thực chất nó là gì</th><th>Lệnh nào tiêu thụ nó</th><th>Nói ở slide</th></tr>
<tr><td><strong>Addresses (địa chỉ)</strong></td><td>Một số nguyên không dấu mà tình cờ gọi tên một vị trí</td><td>Mọi tham chiếu bộ nhớ; cả số học địa chỉ (con trỏ + chỉ số)</td><td>Không có slide riêng — trọn Ch.14</td></tr>
<tr><td><strong>Numbers (số)</strong></td><td>Dấu phẩy tĩnh nhị phân, dấu phẩy động nhị phân, thập phân (nén)</td><td>ADD, SUB, MPY, DIV và các dạng dấu phẩy động</td><td>Slide 12</td></tr>
<tr><td><strong>Characters (ký tự)</strong></td><td>Văn bản, mã hoá bằng IRA/ASCII hoặc EBCDIC</td><td>Chuyển chuỗi, so sánh chuỗi, vào/ra</td><td>Slide 13</td></tr>
<tr><td><strong>Logical data (dữ liệu logic)</strong></td><td>n mục 1 bit độc lập, mỗi mục là 0 hoặc 1</td><td>AND, OR, XOR, NOT, dịch và quay</td><td>Slide 14</td></tr>
</table>
<ul>
<li><strong>Địa chỉ được một góc mà không có slide riêng, và đó là CÓ CHỦ Ý.</strong> Địa chỉ <em>CHÍNH LÀ</em> một con số — ý của sách là máy đối xử với nó như một con số (cộng vào được, so sánh được, lấy làm chỉ số được), và đó là lý do số học con trỏ chạy được. Nó chỉ đặc biệt ở CÁCH DÙNG, nên phần nói về nó được dời sang chế độ địa chỉ ở Ch.14.</li>
<li><strong>Danh sách NGẮN vì phần cứng ĐẮT.</strong> Mỗi kiểu toán hạng trong danh sách này đều cần ALU hỗ trợ hoặc cần lệnh riêng. Trong phần cứng KHÔNG có kiểu "chuỗi", không có kiểu "bản ghi", không có kiểu "đối tượng" — những thứ đó do phần mềm dựng lên từ bốn thứ này. Đó là câu trả lời thẳng cho thắc mắc "vì sao ngôn ngữ của tôi có những kiểu mà CPU chưa từng nghe tới?"</li>
<li><strong>Cùng một dãy bit thuộc về NHIỀU kiểu cùng lúc.</strong> 0100 0001 vừa là số 65, vừa là ký tự 'A' trong IRA/ASCII, vừa là một bộ 8 cờ boolean, và có thể là một địa chỉ. Không có gì trong bộ nhớ ghi lại nó là kiểu nào — <em>LỆNH BẠN ÁP VÀO</em> mới quyết định. Dùng <code>ADD</code> thì nó là số; dùng <code>AND</code> thì nó là dữ liệu logic.</li>
<li><strong>So cái này với Table 13.2 ở slide 15.</strong> Ở đó x86 liệt kê MƯỜI MỘT kiểu dữ liệu. Những kiểu dôi ra (ordinal, BCD, con trỏ gần/xa, bit field, bit string, byte string, packed SIMD) đều là tinh chỉnh của bốn kiểu này — tam giác là KHÁI NIỆM, bảng x86 là hiện thực của MỘT hãng.</li>
</ul>
<p class="meo">💡 Phép phân loại để đi thi: hỏi xem bạn sẽ LÀM GÌ với nó. <em>Làm phép tính</em> → số. <em>In ra màn hình</em> → ký tự. <em>Che hoặc kiểm từng bit</em> → dữ liệu logic. <em>Đi theo nó tới chỗ khác</em> → địa chỉ.</p>`],

      [12, 'Numbers — the three numeric data types',
        `<p class="y-chinh">🎯 <strong>All machine languages include numeric data types</strong> — but numbers stored in a computer are <em>limited</em> in two different ways, and there are <strong>three</strong> common numeric types, not two.</p>
<table>
<tr><th>Numeric type on the slide</th><th>What it is</th><th>Where the course covers it</th></tr>
<tr><td><strong>Binary integer / binary fixed point</strong></td><td>Twos-complement or unsigned integers</td><td>Ch.11 (Computer Arithmetic), Ch.10 (Number Systems)</td></tr>
<tr><td><strong>Binary floating point</strong></td><td>Sign, exponent, significand — IEEE 754</td><td>Ch.11; drawn for x86 on slide 16</td></tr>
<tr><td><strong>Decimal</strong> (packed decimal)</td><td>"Each decimal digit is represented by a 4-bit code with two digits stored per byte"; "to form numbers 4-bit codes are strung together, usually in multiples of 8 bits"</td><td>Slide 15 lists both packed and unpacked BCD for x86</td></tr>
</table>
<ul>
<li><strong>The two limitations are different things — do not merge them.</strong> (i) A limit on the <em>magnitude</em> of numbers representable, which applies to <em>all</em> types (8 bits cannot hold 300). (ii) For floating point <em>only</em>, a limit on the <em>precision</em> — you can represent 0,1 approximately but never exactly in binary. Integers overflow; floats round. An exam answer that says "floats overflow" misses half the point.</li>
<li><strong>Why decimal exists at all, when binary is cheaper.</strong> Money. Human decimal fractions like 0,10 have no exact binary representation, so repeated binary arithmetic on currency drifts. Packed decimal keeps the digits as digits, so 0,10 + 0,20 is exactly 0,30. Banking and COBOL-era commercial systems demanded it, and x86 still carries the instructions.</li>
<li><strong>Do the packing arithmetic once and it sticks.</strong> One decimal digit needs 4 bits (BCD), so <strong>2 digits per byte</strong>. The number 1 9 9 5 becomes the two bytes <code>0001 1001</code> <code>1001 0101</code>. A pure binary encoding would fit 1995 in <em>11 bits</em> — so packed decimal wastes roughly 20% of the space in exchange for exactness and for cheap conversion to printable characters.</li>
<li><strong>Packed versus unpacked (slide 15 names both).</strong> Unpacked BCD puts one digit per byte — wasteful, but it lines up with IRA/ASCII characters so conversion is nearly free. Packed BCD puts two per byte — denser, but needs an unpack step before printing. Same trade-off you meet everywhere: space versus conversion cost.</li>
<li><strong>Connect to Ch.10 and Ch.11 (decks cea10, cea11).</strong> Those chapters are not in the syllabus schedule, but they are where the bit-level detail of all three types lives. If your exam asks you to <em>perform</em> twos-complement subtraction or IEEE 754 encoding, that is their material, not this slide's.</li>
</ul>
<p class="pitfall">⚠️ Classic trap: "how many decimal digits fit in <em>n</em> bytes of packed decimal?" Answer 2<em>n</em> — but real formats spend the last 4-bit nibble on a <strong>sign code</strong>, leaving 2<em>n</em> − 1 digits. Read the question carefully to see whether a sign is required.</p>`,
        `<p class="y-chinh">🎯 <strong>Mọi ngôn ngữ máy đều có kiểu dữ liệu SỐ</strong> — nhưng số lưu trong máy bị <em>GIỚI HẠN</em> theo HAI cách khác nhau, và có <strong>BA</strong> kiểu số thông dụng, không phải hai.</p>
<table>
<tr><th>Kiểu số trên slide</th><th>Nó là gì</th><th>Môn học nói ở đâu</th></tr>
<tr><td><strong>Số nguyên nhị phân / dấu phẩy TĨNH nhị phân</strong></td><td>Số nguyên bù hai hoặc không dấu</td><td>Ch.11 (Số học máy tính), Ch.10 (Hệ đếm)</td></tr>
<tr><td><strong>Dấu phẩy ĐỘNG nhị phân</strong></td><td>Dấu, số mũ, phần định trị — IEEE 754</td><td>Ch.11; vẽ cho x86 ở slide 16</td></tr>
<tr><td><strong>Thập phân</strong> (thập phân NÉN)</td><td>"Mỗi chữ số thập phân được biểu diễn bằng một mã 4 bit, hai chữ số lưu trong một byte"; "để tạo thành số, các mã 4 bit được nối lại, thường theo bội số của 8 bit"</td><td>Slide 15 liệt kê cả BCD nén và không nén cho x86</td></tr>
</table>
<ul>
<li><strong>Hai giới hạn là HAI thứ khác nhau — đừng trộn.</strong> (i) Giới hạn về <em>ĐỘ LỚN</em> của số biểu diễn được, áp cho <em>MỌI</em> kiểu (8 bit không chứa nổi 300). (ii) <em>CHỈ RIÊNG</em> dấu phẩy động mới thêm giới hạn về <em>ĐỘ CHÍNH XÁC</em> — bạn biểu diễn 0,1 một cách gần đúng chứ không bao giờ chính xác trong nhị phân. Số nguyên thì TRÀN; số thực thì LÀM TRÒN. Bài thi trả lời "số thực bị tràn" là mất một nửa ý.</li>
<li><strong>Vì sao còn cần thập phân, khi nhị phân rẻ hơn.</strong> TIỀN. Phân số thập phân của con người như 0,10 không có biểu diễn nhị phân chính xác, nên tính đi tính lại trên tiền tệ sẽ trôi. Thập phân nén giữ chữ số VẪN LÀ chữ số, nên 0,10 + 0,20 đúng bằng 0,30. Ngành ngân hàng và hệ thống thương mại thời COBOL đòi bằng được, và x86 tới nay vẫn mang những lệnh đó.</li>
<li><strong>Làm phép tính đóng gói một lần là nhớ mãi.</strong> Một chữ số thập phân cần 4 bit (BCD), vậy <strong>2 chữ số mỗi byte</strong>. Số 1 9 9 5 thành hai byte <code>0001 1001</code> <code>1001 0101</code>. Mã hoá nhị phân thuần thì 1995 chỉ cần <em>11 bit</em> — nên thập phân nén phí khoảng 20% chỗ để đổi lấy tính chính xác và việc đổi sang ký tự in được rất rẻ.</li>
<li><strong>Nén so với KHÔNG nén (slide 15 kể cả hai).</strong> BCD không nén để một chữ số mỗi byte — phí chỗ, nhưng thẳng hàng với ký tự IRA/ASCII nên chuyển đổi gần như miễn phí. BCD nén để hai chữ số mỗi byte — đặc hơn, nhưng phải giải nén trước khi in. Vẫn đúng cái đánh đổi bạn gặp ở khắp nơi: chỗ chứa đổi lấy chi phí chuyển đổi.</li>
<li><strong>Nối sang Ch.10 và Ch.11 (deck cea10, cea11).</strong> Hai chương đó không nằm trong lịch học, nhưng chi tiết mức bit của cả ba kiểu nằm ở đó. Nếu đề bắt bạn <em>THỰC HIỆN</em> phép trừ bù hai hay mã hoá IEEE 754 thì đó là phần của chúng, không phải của slide này.</li>
</ul>
<p class="pitfall">⚠️ Bẫy kinh điển: "n byte thập phân nén chứa được bao nhiêu chữ số?" Đáp 2<em>n</em> — nhưng khuôn dạng thật dành nửa byte 4 bit cuối cho <strong>MÃ DẤU</strong>, còn lại 2<em>n</em> − 1 chữ số. Đọc kỹ đề xem có yêu cầu dấu hay không.</p>`],

      [13, 'Characters — IRA/ASCII and EBCDIC',
        `<p class="y-chinh">🎯 Text is one of the commonest forms of data, but <strong>"textual data in character form cannot be easily stored or transmitted by data processing and communications systems because they are designed for binary data"</strong>. The fix is a <em>code</em>: a fixed table mapping each character to a bit pattern.</p>
<table>
<tr><th>Code</th><th>Full name</th><th>Where it is used</th><th>Width</th></tr>
<tr><td><strong>IRA</strong></td><td>International Reference Alphabet</td><td>The international standard name; the most commonly used character code</td><td>7 bits of code, usually stored in 8</td></tr>
<tr><td><strong>ASCII</strong></td><td>American Standard Code for Information Interchange</td><td>What IRA is called in the United States — <em>the same code, a different name</em></td><td>7 bits + 1</td></tr>
<tr><td><strong>EBCDIC</strong></td><td>Extended Binary Coded Decimal Interchange Code</td><td>IBM mainframes</td><td>8 bits</td></tr>
</table>
<ul>
<li><strong>IRA and ASCII are the SAME code with two names.</strong> This is the single most likely exam question on this slide, and the slide says it explicitly ("referred to in the United States as ASCII"). Do not describe them as two competing standards. EBCDIC is the genuinely different one.</li>
<li><strong>Why the 8th bit matters.</strong> IRA/ASCII defines 2<sup>7</sup> = <strong>128</strong> characters but is stored one per byte, leaving one spare bit. Historically it carried parity for transmission; later, "extended ASCII" pages used it to reach 256 symbols — which is why accented text used to turn to mojibake when you opened a file with the wrong code page. Unicode/UTF-8 replaced that mess, and is the modern successor the slide does not mention.</li>
<li><strong>The overlap with packed decimal is the point of the last bullet on slide 14.</strong> In IRA/ASCII the digits '0'–'9' are 0011 0000 to 0011 1001: the low 4 bits are exactly the BCD value. So converting IRA text to packed decimal is "take the rightmost 4 bits of each byte" — a masking operation, which is why the machine needs logical instructions.</li>
<li><strong>EBCDIC is not a historical curiosity you can ignore.</strong> IBM mainframes still run a very large share of the world's banking, and in EBCDIC the letters are <em>not</em> contiguous (there are gaps between I and J, and between R and S). Code that sorts by comparing character codes therefore behaves differently — a real-world bug class, not a trivia fact.</li>
<li><strong>Connect to PRF192.</strong> <code>char c = 'A';</code> stores 65 = 0100 0001. <code>c + 1</code> gives 'B' only because the code table is contiguous there. And <code>c - '0'</code> converting a digit character to its value is precisely the masking trick above, written in C.</li>
</ul>
<p class="meo">💡 Three landmarks worth memorising in IRA/ASCII: <strong>'0' = 48</strong>, <strong>'A' = 65</strong>, <strong>'a' = 97</strong>. Note 'a' − 'A' = 32 = 2<sup>5</sup>, so upper/lower case differ in exactly one bit — which is why case conversion is an OR or an AND with 0x20, not a table lookup.</p>`,
        `<p class="y-chinh">🎯 Văn bản là một trong những dạng dữ liệu phổ biến nhất, nhưng <strong>"dữ liệu văn bản ở dạng ký tự không dễ lưu trữ hay truyền đi bởi các hệ thống xử lý dữ liệu và truyền thông, vì chúng được thiết kế cho dữ liệu NHỊ PHÂN"</strong>. Cách chữa là một <em>BỘ MÃ</em>: một bảng cố định ánh xạ mỗi ký tự sang một dãy bit.</p>
<table>
<tr><th>Bộ mã</th><th>Tên đầy đủ</th><th>Dùng ở đâu</th><th>Độ rộng</th></tr>
<tr><td><strong>IRA</strong></td><td>International Reference Alphabet</td><td>Tên theo chuẩn quốc tế; bộ mã ký tự được dùng phổ biến nhất</td><td>Mã 7 bit, thường lưu trong 8 bit</td></tr>
<tr><td><strong>ASCII</strong></td><td>American Standard Code for Information Interchange</td><td>Tên gọi của IRA ở Hoa Kỳ — <em>CÙNG một bộ mã, khác cái tên</em></td><td>7 bit + 1</td></tr>
<tr><td><strong>EBCDIC</strong></td><td>Extended Binary Coded Decimal Interchange Code</td><td>Máy lớn (mainframe) của IBM</td><td>8 bit</td></tr>
</table>
<ul>
<li><strong>IRA và ASCII là CÙNG MỘT bộ mã với hai cái tên.</strong> Đây là câu hỏi thi khả dĩ nhất của slide này, và slide nói thẳng ("ở Hoa Kỳ gọi là ASCII"). Đừng mô tả chúng như hai chuẩn cạnh tranh nhau. EBCDIC mới là cái thật sự khác.</li>
<li><strong>Vì sao bit thứ 8 quan trọng.</strong> IRA/ASCII định nghĩa 2<sup>7</sup> = <strong>128</strong> ký tự nhưng lưu mỗi ký tự một byte, thừa ra một bit. Ngày xưa bit đó mang mã chẵn lẻ để truyền tin; sau này các bảng mã "extended ASCII" dùng nó để với tới 256 ký hiệu — và đó là lý do chữ có dấu từng biến thành mớ ký tự loạn khi mở file sai bảng mã. Unicode/UTF-8 đã dọn mớ đó, và là hậu duệ hiện đại mà slide không nhắc tới.</li>
<li><strong>Chỗ chồng lấn với thập phân nén chính là ý gạch đầu dòng cuối của slide 14.</strong> Trong IRA/ASCII, các chữ số '0'–'9' là 0011 0000 tới 0011 1001: bốn bit thấp ĐÚNG BẰNG giá trị BCD. Nên chuyển văn bản IRA sang thập phân nén chỉ là "lấy 4 bit bên phải của mỗi byte" — một thao tác che bit, và đó là lý do máy cần có lệnh logic.</li>
<li><strong>EBCDIC không phải chuyện cổ tích bỏ qua được.</strong> Máy lớn IBM tới nay vẫn chạy một phần rất lớn hệ thống ngân hàng thế giới, mà trong EBCDIC các chữ cái KHÔNG liền nhau (có khoảng trống giữa I và J, giữa R và S). Mã nào sắp xếp bằng cách so mã ký tự sẽ chạy khác đi — một lớp lỗi có thật, không phải mẩu kiến thức vui.</li>
<li><strong>Nối sang PRF192.</strong> <code>char c = 'A';</code> lưu số 65 = 0100 0001. <code>c + 1</code> ra 'B' CHỈ VÌ bảng mã ở đoạn đó liền nhau. Còn <code>c - '0'</code> để đổi ký tự chữ số sang giá trị chính là mẹo che bit ở trên, viết bằng C.</li>
</ul>
<p class="meo">💡 Ba cột mốc đáng thuộc trong IRA/ASCII: <strong>'0' = 48</strong>, <strong>'A' = 65</strong>, <strong>'a' = 97</strong>. Để ý 'a' − 'A' = 32 = 2<sup>5</sup>, tức chữ hoa và chữ thường chỉ khác nhau ĐÚNG MỘT BIT — vì thế đổi hoa/thường là một phép OR hoặc AND với 0x20, không phải tra bảng.</p>`],

      [14, 'Logical Data',
        `<p class="y-chinh">🎯 The fourth operand type, and the one students skip: sometimes a word is not one number but <strong>"an n-bit unit consisting of n 1-bit items of data, each item having the value 0 or 1"</strong>. Same bits, different reading — and a whole family of instructions exists just for this reading.</p>
<table>
<tr><th>The slide's two advantages of the bit-oriented view</th><th>Why it matters</th></tr>
<tr><td><strong>1. Memory efficiency.</strong> "Memory can be used most efficiently for storing an array of Boolean or binary data items in which each item can take on only the values 1 (true) and 0 (false)"</td><td>A 64-bit word holds 64 flags instead of 1. That is a 64× saving — the reason bitmaps, permission bits and free-space maps all exist</td></tr>
<tr><td><strong>2. Manipulating the bits of a data item.</strong> Two examples given: (a) "if floating-point operations are implemented in software, we need to be able to shift significant bits in some operations"; (b) "to convert from IRA to packed decimal, we need to extract the rightmost 4 bits of each byte"</td><td>Both are surgery <em>inside</em> a value — you cannot express either with ADD or SUB. Shifts and masks are the tools</td></tr>
</table>
<ul>
<li><strong>Both examples are the same operation wearing different clothes.</strong> Example (a) is a <em>shift</em>, example (b) is a <em>mask</em> (AND with 0000 1111). Between them they justify the two families on the next deck: logical operations (AND/OR/XOR/NOT) and shift/rotate operations.</li>
<li><strong>Work example (b) through once.</strong> The IRA character '7' is 0011 0111. AND it with the mask 0000 1111 and you get 0000 0111 = the BCD digit 7. Do that for two characters, shift one left by 4 and OR them together, and you have one packed-decimal byte. That is a complete IRA-to-packed-decimal converter in three logical instructions per byte pair — no arithmetic at all.</li>
<li><strong>Why example (a) says "if floating-point operations are implemented in software".</strong> A cheap CPU with no FPU must align exponents by shifting significands by hand. That is Ch.11 material; the point here is that the instruction set must supply the shift, or software floating point is impossible.</li>
<li><strong>The classic three-instruction vocabulary of bit fiddling.</strong> <code>AND</code> with a mask to <em>clear</em> bits (extract a field); <code>OR</code> with a mask to <em>set</em> bits; <code>XOR</code> with a mask to <em>flip</em> bits. Add a shift to move the field into position and you can read or write any bit field in any word.</li>
<li><strong>Connect to Ch.12 (Digital Logic) and to PRF192.</strong> The AND/OR/NOT you drew as gates in Ch.12 are exactly these instructions, applied 32 or 64 times in parallel — one gate per bit position. In C they are <code>&amp;</code>, <code>|</code>, <code>^</code>, <code>~</code>, <code>&lt;&lt;</code>, <code>&gt;&gt;</code>, and now you know they are single machine instructions, not library calls.</li>
</ul>
<p class="pitfall">⚠️ Exam trap: <code>AND</code> (bitwise, logical data) versus <code>&amp;&amp;</code>-style conditional AND is <em>not</em> the same thing, and neither is <code>TEST</code> versus <code>AND</code> on x86. Slide 21 makes the distinction precise: <code>AND</code> stores the result, <code>TEST</code> performs the same bitwise AND but <strong>leaves the operands unchanged</strong> and only sets the flags.</p>`,
        `<p class="y-chinh">🎯 Kiểu toán hạng thứ tư, và là kiểu sinh viên hay bỏ qua: có lúc một từ KHÔNG phải một con số, mà là <strong>"một đơn vị n bit gồm n mục dữ liệu 1 bit, mỗi mục nhận giá trị 0 hoặc 1"</strong>. Cùng dãy bit, cách đọc khác — và có hẳn một họ lệnh sinh ra chỉ để phục vụ cách đọc này.</p>
<table>
<tr><th>Hai lợi thế của cách nhìn theo BIT mà slide nêu</th><th>Vì sao nó quan trọng</th></tr>
<tr><td><strong>1. Dùng bộ nhớ hiệu quả nhất.</strong> "Bộ nhớ được dùng hiệu quả nhất khi lưu một mảng các mục Boolean hay nhị phân mà mỗi mục chỉ nhận giá trị 1 (đúng) hoặc 0 (sai)"</td><td>Một từ 64 bit chứa 64 cờ thay vì 1. Tiết kiệm 64 lần — lý do tồn tại của bitmap, bit quyền truy cập và bản đồ vùng trống</td></tr>
<tr><td><strong>2. Thao tác trên các bit BÊN TRONG một mục dữ liệu.</strong> Hai ví dụ: (a) "nếu phép dấu phẩy động được hiện thực bằng phần mềm, ta cần dịch được các bit có nghĩa trong một số thao tác"; (b) "để chuyển từ IRA sang thập phân nén, ta cần rút 4 bit bên phải của mỗi byte"</td><td>Cả hai đều là phẫu thuật <em>BÊN TRONG</em> một giá trị — không diễn đạt được bằng ADD hay SUB. Dụng cụ là phép dịch và phép che bit</td></tr>
</table>
<ul>
<li><strong>Hai ví dụ thật ra là CÙNG một thao tác mặc hai bộ áo.</strong> Ví dụ (a) là phép <em>DỊCH</em>, ví dụ (b) là phép <em>CHE</em> (AND với 0000 1111). Cộng lại, chúng biện minh cho hai họ lệnh ở deck kế: lệnh logic (AND/OR/XOR/NOT) và lệnh dịch/quay.</li>
<li><strong>Làm thử ví dụ (b) một lần cho thấm.</strong> Ký tự IRA '7' là 0011 0111. Đem AND với mặt nạ 0000 1111 thì ra 0000 0111 = chữ số BCD 7. Làm vậy với hai ký tự, dịch trái một cái 4 bit rồi OR lại, là có một byte thập phân nén. Đó là trọn một bộ chuyển IRA → thập phân nén, ba lệnh logic cho mỗi cặp byte — không có phép số học nào.</li>
<li><strong>Vì sao ví dụ (a) nói "nếu phép dấu phẩy động được hiện thực bằng PHẦN MỀM".</strong> CPU rẻ không có FPU thì phải tự căn số mũ bằng cách dịch phần định trị bằng tay. Đó là nội dung Ch.11; ý ở đây là tập lệnh BẮT BUỘC phải có phép dịch, nếu không thì dấu phẩy động bằng phần mềm là bất khả thi.</li>
<li><strong>Bộ từ vựng ba lệnh kinh điển của nghề nghịch bit.</strong> <code>AND</code> với mặt nạ để <em>XOÁ</em> bit (rút ra một trường); <code>OR</code> với mặt nạ để <em>BẬT</em> bit; <code>XOR</code> với mặt nạ để <em>LẬT</em> bit. Thêm một phép dịch để đưa trường về đúng vị trí là bạn đọc/ghi được bất kỳ trường bit nào trong bất kỳ từ nào.</li>
<li><strong>Nối sang Ch.12 (Logic số) và sang PRF192.</strong> Những cổng AND/OR/NOT bạn vẽ ở Ch.12 chính là những lệnh này, áp song song 32 hay 64 lần — mỗi vị trí bit một cổng. Trong C chúng là <code>&amp;</code>, <code>|</code>, <code>^</code>, <code>~</code>, <code>&lt;&lt;</code>, <code>&gt;&gt;</code>, và giờ bạn biết chúng là lệnh máy ĐƠN LẺ, không phải lời gọi thư viện.</li>
</ul>
<p class="pitfall">⚠️ Bẫy đề thi: <code>AND</code> (theo bit, trên dữ liệu logic) KHÁC với phép AND điều kiện kiểu <code>&amp;&amp;</code>, và <code>TEST</code> cũng khác <code>AND</code> trên x86. Slide 21 nói chính xác chỗ khác: <code>AND</code> GHI kết quả lại, còn <code>TEST</code> làm đúng phép AND theo bit ấy nhưng <strong>để nguyên hai toán hạng</strong> và chỉ đặt cờ.</p>`],

      [15, 'Table 13.2 — x86 Data Types',
        `<p class="y-chinh">🎯 The four abstract operand types of slide 11, turned into one vendor's real list. x86 offers <strong>eleven</strong> data types — and the length of the list is itself the lesson about CISC design.</p>
<table>
<tr><th>Data type</th><th>Description (from the slide)</th><th>Maps to which of the four</th></tr>
<tr><td><strong>General</strong></td><td>Byte, word (16 bits), doubleword (32 bits), quadword (64 bits), and double quadword (128 bits) locations with arbitrary binary contents</td><td>none in particular — untyped bits</td></tr>
<tr><td><strong>Integer</strong></td><td>A signed binary value contained in a byte, word, or doubleword, using twos complement representation</td><td>Numbers</td></tr>
<tr><td><strong>Ordinal</strong></td><td>An unsigned integer contained in a byte, word, or doubleword</td><td>Numbers</td></tr>
<tr><td><strong>Unpacked BCD</strong></td><td>A representation of a BCD digit in the range 0 through 9, with one digit in each byte</td><td>Numbers (decimal)</td></tr>
<tr><td><strong>Packed BCD</strong></td><td>Packed byte representation of two BCD digits; value in the range 0 to 99</td><td>Numbers (decimal)</td></tr>
<tr><td><strong>Near pointer</strong></td><td>A 16-, 32- or 64-bit effective address representing the offset within a segment; used for all pointers in a nonsegmented memory and for references within a segment</td><td>Addresses</td></tr>
<tr><td><strong>Far pointer</strong></td><td>A logical address consisting of a 16-bit segment selector and an offset of 16, 32 or 64 bits; used where the segment must be specified explicitly</td><td>Addresses</td></tr>
<tr><td><strong>Bit field</strong></td><td>A contiguous sequence of bits in which the position of each bit is an independent unit; can begin at any bit position of any byte and can contain up to 32 bits</td><td>Logical data</td></tr>
<tr><td><strong>Bit string</strong></td><td>A contiguous sequence of bits, containing from zero to 2<sup>23</sup> − 1 bits</td><td>Logical data</td></tr>
<tr><td><strong>Byte string</strong></td><td>A contiguous sequence of bytes, words or doublewords, containing from zero to 2<sup>23</sup> − 1 bytes</td><td>Characters / general</td></tr>
<tr><td><strong>Floating point</strong></td><td>See Figure 13.4 (the next slide)</td><td>Numbers</td></tr>
<tr><td><strong>Packed SIMD</strong></td><td>Packed 64-bit and 128-bit data types</td><td>a vector of any of the above</td></tr>
</table>
<ul>
<li><strong>Integer versus Ordinal is the pair to memorise.</strong> Both are the same bits; <em>Integer</em> reads them as signed twos complement, <em>Ordinal</em> as unsigned. That is why x86 has both <code>MUL</code>/<code>DIV</code> (unsigned) and <code>IMUL</code>/<code>IDIV</code> (signed) on slide 20 — one data type each. The bits do not know; the opcode decides.</li>
<li><strong>Near versus far pointer is the segmented-memory legacy.</strong> A near pointer is just an offset; a far pointer carries a 16-bit segment selector as well. Modern 64-bit code is effectively flat, so far pointers survive mostly for the OS. Ch.9 (OS support) and Ch.14 (addressing) both touch this.</li>
<li><strong>Bit field versus bit string.</strong> A bit <em>field</em> is short (≤ 32 bits) and can start at any bit of any byte — it is how you pack several small values into one word. A bit <em>string</em> is arbitrarily long. Both are the "logical data" of slide 14, sized differently.</li>
<li><strong>The list's length is an argument.</strong> Eleven hardware data types means eleven sets of instructions, more opcodes, a bigger decoder and more silicon. Ch.17 (RISC) will argue that most programs use three of these and that the rest should be built in software. Compare with ARM on slide 18 — <strong>three</strong> sizes, and that is the whole list.</li>
</ul>
<p class="pitfall">⚠️ Extraction note, so you are not confused: the text extracted from the .pptx prints the bit-string and byte-string limits as "223 – 1" because it dropped the superscript. The rendered slide shows <strong>2<sup>23</sup> − 1</strong>. Read the original image, not the raw text, whenever a number looks implausible.</p>
<p class="meo">💡 Do not memorise all eleven rows. Memorise the <em>pairs</em>: Integer/Ordinal (signed vs unsigned), Packed/Unpacked BCD (two digits vs one per byte), Near/Far pointer (offset only vs segment + offset), Bit field/Bit string (short vs long). Four pairs plus General, Floating point and Packed SIMD — and the whole table is back.</p>`,
        `<p class="y-chinh">🎯 Bốn kiểu toán hạng trừu tượng ở slide 11, biến thành danh sách thật của một hãng. x86 cung cấp <strong>MƯỜI MỘT</strong> kiểu dữ liệu — và chính độ dài của danh sách này là bài học về thiết kế CISC.</p>
<table>
<tr><th>Kiểu dữ liệu</th><th>Mô tả (theo slide)</th><th>Ứng với kiểu nào trong bốn kiểu</th></tr>
<tr><td><strong>General</strong></td><td>Ô byte, word (16 bit), doubleword (32 bit), quadword (64 bit) và double quadword (128 bit) với nội dung nhị phân tuỳ ý</td><td>không thuộc riêng kiểu nào — bit không kiểu</td></tr>
<tr><td><strong>Integer</strong></td><td>Giá trị nhị phân CÓ DẤU chứa trong byte, word hoặc doubleword, dùng biểu diễn bù hai</td><td>Số</td></tr>
<tr><td><strong>Ordinal</strong></td><td>Số nguyên KHÔNG DẤU chứa trong byte, word hoặc doubleword</td><td>Số</td></tr>
<tr><td><strong>BCD không nén</strong></td><td>Biểu diễn một chữ số BCD trong khoảng 0 tới 9, mỗi byte một chữ số</td><td>Số (thập phân)</td></tr>
<tr><td><strong>BCD nén</strong></td><td>Biểu diễn nén hai chữ số BCD trong một byte; giá trị trong khoảng 0 tới 99</td><td>Số (thập phân)</td></tr>
<tr><td><strong>Near pointer (con trỏ gần)</strong></td><td>Địa chỉ hiệu dụng 16, 32 hoặc 64 bit biểu diễn độ dời bên trong một phân đoạn; dùng cho mọi con trỏ trong bộ nhớ không phân đoạn và cho tham chiếu bên trong một phân đoạn</td><td>Địa chỉ</td></tr>
<tr><td><strong>Far pointer (con trỏ xa)</strong></td><td>Địa chỉ logic gồm bộ chọn phân đoạn 16 bit cộng độ dời 16, 32 hoặc 64 bit; dùng khi phải nêu rõ phân đoạn</td><td>Địa chỉ</td></tr>
<tr><td><strong>Bit field (trường bit)</strong></td><td>Dãy bit liên tiếp trong đó vị trí mỗi bit là một đơn vị độc lập; bắt đầu ở bit bất kỳ của byte bất kỳ và chứa tối đa 32 bit</td><td>Dữ liệu logic</td></tr>
<tr><td><strong>Bit string (chuỗi bit)</strong></td><td>Dãy bit liên tiếp, chứa từ không tới 2<sup>23</sup> − 1 bit</td><td>Dữ liệu logic</td></tr>
<tr><td><strong>Byte string (chuỗi byte)</strong></td><td>Dãy byte, word hoặc doubleword liên tiếp, chứa từ không tới 2<sup>23</sup> − 1 byte</td><td>Ký tự / dữ liệu chung</td></tr>
<tr><td><strong>Floating point</strong></td><td>Xem Figure 13.4 (slide kế)</td><td>Số</td></tr>
<tr><td><strong>Packed SIMD</strong></td><td>Kiểu dữ liệu nén 64 bit và 128 bit</td><td>một vector của bất kỳ kiểu nào ở trên</td></tr>
</table>
<ul>
<li><strong>Integer với Ordinal là cặp phải thuộc.</strong> Cùng một dãy bit; <em>Integer</em> đọc chúng là số bù hai CÓ DẤU, <em>Ordinal</em> đọc là KHÔNG DẤU. Đó là lý do x86 có cả <code>MUL</code>/<code>DIV</code> (không dấu) lẫn <code>IMUL</code>/<code>IDIV</code> (có dấu) ở slide 20 — mỗi kiểu dữ liệu một bộ. Bit thì không biết gì; OPCODE mới quyết.</li>
<li><strong>Near với far pointer là di sản của bộ nhớ phân đoạn.</strong> Con trỏ gần chỉ là độ dời; con trỏ xa mang thêm bộ chọn phân đoạn 16 bit. Mã 64 bit hiện đại về cơ bản là phẳng, nên con trỏ xa còn sống chủ yếu cho hệ điều hành. Ch.9 (hỗ trợ của HĐH) và Ch.14 (định địa chỉ) đều chạm tới.</li>
<li><strong>Bit field khác bit string.</strong> <em>TRƯỜNG</em> bit thì ngắn (≤ 32 bit) và bắt đầu ở bit bất kỳ của byte bất kỳ — đó là cách bạn nhét vài giá trị nhỏ vào chung một từ. <em>CHUỖI</em> bit thì dài tuỳ ý. Cả hai đều là "dữ liệu logic" của slide 14, chỉ khác cỡ.</li>
<li><strong>Độ dài của danh sách này chính là một LẬP LUẬN.</strong> Mười một kiểu dữ liệu phần cứng nghĩa là mười một bộ lệnh, nhiều opcode hơn, bộ giải mã to hơn, nhiều silicon hơn. Ch.17 (RISC) sẽ lập luận rằng phần lớn chương trình chỉ dùng ba kiểu, số còn lại nên dựng bằng phần mềm. So với ARM ở slide 18 — <strong>BA</strong> cỡ, và hết danh sách.</li>
</ul>
<p class="pitfall">⚠️ Ghi chú về bản trích, để bạn khỏi rối: chữ trích từ .pptx in giới hạn của bit string và byte string thành "223 – 1" vì nó đánh rơi chỉ số trên. Slide render ra là <strong>2<sup>23</sup> − 1</strong>. Hễ một con số trông vô lý thì hãy đọc ẢNH GỐC, đừng đọc bản trích chữ.</p>
<p class="meo">💡 Đừng học thuộc cả mười một dòng. Học thuộc các <em>CẶP</em>: Integer/Ordinal (có dấu với không dấu), BCD nén/không nén (hai chữ số với một chữ số mỗi byte), Near/Far pointer (chỉ độ dời với phân đoạn + độ dời), Bit field/Bit string (ngắn với dài). Bốn cặp cộng General, Floating point và Packed SIMD — là cả bảng trở lại.</p>`],

      [16, 'Figure 13.4 — x86 Numeric Data Formats',
        `<p class="y-chinh">🎯 The "Numbers" corner of slide 11, drawn to scale as thirteen labelled bit rectangles. Read it as three families stacked on top of each other: <strong>unsigned integers, signed (twos complement) integers, and floating point</strong> — each in several widths.</p>
<table>
<tr><th>Family</th><th>Formats shown</th><th>Bit ranges on the figure</th></tr>
<tr><td><strong>Unsigned integer</strong></td><td>Byte, Word, Doubleword, Quadword</td><td>7..0 · 15..0 · 31..0 · 63..0 — <em>no sign bit marked</em></td></tr>
<tr><td><strong>Signed integer (twos complement)</strong></td><td>Byte, Word, Doubleword, Quadword</td><td>same widths, but the top bit is labelled <strong>sign bit</strong></td></tr>
<tr><td><strong>Floating point</strong></td><td>Half precision (16 bits: sign · exp · signif., boundary at 15, 9, 0)<br />Single precision (32 bits: boundary at 31, 22, 0)<br />Double precision (64 bits: boundary at 63, 51, 0)<br />Double extended precision (80 bits: sign · exponent · <strong>integer bit</strong> · significand, boundary at 79, 63, 0)</td><td>every one has an explicit <em>sign bit</em> at the far left</td></tr>
</table>
<ul>
<li><strong>The whole figure makes exactly one point: width and interpretation are independent.</strong> The same 32 bits are a doubleword unsigned integer, a doubleword signed integer, or a single-precision float — three completely different values. Only the instruction that touches them decides which.</li>
<li><strong>Read the floating-point boundaries as field sizes.</strong> Single precision: bit 31 is the sign, bits 30–23 are the exponent (8 bits), bits 22–0 are the significand (23 bits). 1 + 8 + 23 = 32 ✔. Double precision: 1 + 11 + 52 = 64 ✔. Half precision: 1 + 5 + 10 = 16 ✔. Do that addition on any exam figure — if it does not total the stated width, you have misread a boundary.</li>
<li><strong>Double extended precision is the x87 oddity.</strong> 80 bits, and it is the only format on the figure with an explicit <strong>integer bit</strong> drawn separately from the significand. Every other IEEE format keeps that leading 1 <em>implicit</em>. It is the reason intermediate results on old x87 hardware were sometimes more accurate than the C standard promised — and why results could change when a value was spilled to memory.</li>
<li><strong>Connect to Ch.11 (deck cea11).</strong> That chapter is where you learn to actually encode and decode these fields (bias, normalisation, special values). This slide only shows the <em>layout</em>. If an exam question asks "encode −6,5 in single precision", it is Ch.11's method applied to this picture.</li>
</ul>
<p class="pitfall">⚠️ Two misprints on the original slide, stated plainly rather than silently copied. The eighth row is labelled "<strong>Quadward</strong> <strong>usigned</strong> integer (twos complement)t" — three errors in one caption: it should read <em>Quadword <strong>signed</strong> integer (twos complement)</em>, since it is drawn with a sign bit and sits in the signed group. Do not repeat "quadword unsigned twos complement" in an exam; twos complement is by definition signed.</p>
<p class="meo">💡 Memory hook for the three IEEE widths: <strong>16 / 32 / 64 bits → exponent 5 / 8 / 11 bits → significand 10 / 23 / 52 bits</strong>. The sign is always exactly one bit, always leftmost, in every single format on this figure.</p>`,
        `<p class="y-chinh">🎯 Góc "Numbers" của slide 11, vẽ đúng tỉ lệ thành mười ba hình chữ nhật bit có nhãn. Đọc nó thành ba HỌ xếp chồng lên nhau: <strong>số nguyên KHÔNG DẤU, số nguyên CÓ DẤU (bù hai), và dấu phẩy động</strong> — mỗi họ vài độ rộng.</p>
<table>
<tr><th>Họ</th><th>Các khuôn dạng trong hình</th><th>Dải bit trên hình</th></tr>
<tr><td><strong>Số nguyên không dấu</strong></td><td>Byte, Word, Doubleword, Quadword</td><td>7..0 · 15..0 · 31..0 · 63..0 — <em>KHÔNG đánh dấu bit dấu</em></td></tr>
<tr><td><strong>Số nguyên có dấu (bù hai)</strong></td><td>Byte, Word, Doubleword, Quadword</td><td>cùng độ rộng, nhưng bit cao nhất ghi nhãn <strong>sign bit</strong></td></tr>
<tr><td><strong>Dấu phẩy động</strong></td><td>Half precision (16 bit: dấu · exp · signif., mốc ở 15, 9, 0)<br />Single precision (32 bit: mốc ở 31, 22, 0)<br />Double precision (64 bit: mốc ở 63, 51, 0)<br />Double extended precision (80 bit: dấu · exponent · <strong>integer bit</strong> · significand, mốc ở 79, 63, 0)</td><td>cái nào cũng có một <em>bit dấu</em> tường minh ở cực trái</td></tr>
</table>
<ul>
<li><strong>Cả hình chỉ nói đúng MỘT điều: độ rộng và cách diễn giải là hai thứ ĐỘC LẬP.</strong> Cùng 32 bit ấy vừa là doubleword không dấu, vừa là doubleword có dấu, vừa là số thực single precision — ba giá trị khác hẳn nhau. Chỉ LỆNH chạm vào chúng mới quyết định là cái nào.</li>
<li><strong>Đọc các mốc của dấu phẩy động như KÍCH THƯỚC TRƯỜNG.</strong> Single precision: bit 31 là dấu, bit 30–23 là số mũ (8 bit), bit 22–0 là phần định trị (23 bit). 1 + 8 + 23 = 32 ✔. Double precision: 1 + 11 + 52 = 64 ✔. Half precision: 1 + 5 + 10 = 16 ✔. Cứ làm phép cộng đó với hình bất kỳ trong đề — không ra đúng độ rộng đã ghi thì bạn đã đọc sai một cái mốc.</li>
<li><strong>Double extended precision là của lạ của x87.</strong> 80 bit, và là khuôn dạng DUY NHẤT trên hình có <strong>integer bit</strong> vẽ tách riêng khỏi phần định trị. Mọi khuôn dạng IEEE khác giữ bit 1 dẫn đầu ở dạng <em>NGẦM ĐỊNH</em>. Đó là lý do kết quả trung gian trên phần cứng x87 đời cũ đôi khi chính xác hơn mức chuẩn C hứa hẹn — và cũng là lý do kết quả có thể ĐỔI khi một giá trị bị đẩy tạm ra bộ nhớ.</li>
<li><strong>Nối sang Ch.11 (deck cea11).</strong> Chương đó mới là nơi bạn học mã hoá và giải mã thật các trường này (độ lệch bias, chuẩn hoá, các giá trị đặc biệt). Slide này chỉ trưng ra BỐ CỤC. Đề hỏi "mã hoá −6,5 theo single precision" thì đó là phương pháp của Ch.11 áp lên bức hình này.</li>
</ul>
<p class="pitfall">⚠️ Hai chỗ IN SAI trên slide gốc, nói thẳng chứ không im lặng chép lại. Dòng thứ tám ghi "<strong>Quadward</strong> <strong>usigned</strong> integer (twos complement)t" — ba lỗi trong một dòng nhãn: đúng ra phải là <em>Quadword <strong>SIGNED</strong> integer (twos complement)</em>, vì nó được vẽ CÓ bit dấu và nằm trong nhóm có dấu. Đi thi đừng viết "quadword unsigned twos complement"; bù hai theo định nghĩa đã là CÓ DẤU.</p>
<p class="meo">💡 Mẹo nhớ ba độ rộng IEEE: <strong>16 / 32 / 64 bit → số mũ 5 / 8 / 11 bit → phần định trị 10 / 23 / 52 bit</strong>. Bit dấu thì luôn đúng MỘT bit, luôn ở cực trái, trong mọi khuôn dạng của hình này.</p>`],

      [17, 'Single-Instruction-Multiple-Data (SIMD) Data Types',
        `<p class="y-chinh">🎯 The last entry of Table 13.2, opened up. SIMD types were <strong>"introduced to the x86 architecture as part of the extensions of the instruction set to optimize performance of multimedia applications"</strong> — the extensions being <strong>MMX</strong> (multimedia extensions) and <strong>SSE</strong> (streaming SIMD extensions).</p>
<table>
<tr><th>SIMD data type on the slide</th><th>What one register holds</th><th>Typical use</th></tr>
<tr><td>Packed byte / packed byte integer</td><td>8 bytes in 64 bits (16 in 128)</td><td>Pixels, audio samples, character data</td></tr>
<tr><td>Packed word / packed word integer</td><td>4 × 16-bit words in 64 bits</td><td>16-bit audio, intermediate pixel maths</td></tr>
<tr><td>Packed doubleword / packed doubleword integer</td><td>2 × 32-bit values in 64 bits</td><td>Coordinates, accumulators</td></tr>
<tr><td>Packed quadword / packed quadword integer</td><td>2 × 64-bit values in 128 bits</td><td>Wide integers</td></tr>
<tr><td>Packed single-precision floating point</td><td>4 floats in 128 bits</td><td>3D geometry, graphics transforms</td></tr>
<tr><td>Packed double-precision floating point</td><td>2 doubles in 128 bits</td><td>Scientific computing</td></tr>
</table>
<ul>
<li><strong>The name IS the definition.</strong> <em>Single instruction, multiple data</em>: one <code>PADDB</code> adds eight pairs of bytes in the time one <code>ADD</code> adds one pair. The speed-up is not from a faster clock — it is from doing the same thing to many items at once, which is exactly what the "Return for string or vector data" loop of Figure 13.1 (slide 3) was drawing.</li>
<li><strong>Why multimedia was the trigger.</strong> "Video and audio data are typically composed of large arrays of small data types" (the slide says this on slide 43). A pixel channel is 8 bits; a 64-bit register therefore wastes 87,5% of its width on one pixel. Packing eight of them recovers all of it.</li>
<li><strong>"Packed" always means the same thing.</strong> Several independent small values side by side in one wide register, with <em>no carry crossing the boundaries between them</em>. That last clause is the hardware trick: an ordinary 64-bit adder is cut into eight 8-bit adders by suppressing the carries at the lane boundaries.</li>
<li><strong>Saturation is the other half of the idea.</strong> Slide 44's MMX table lists <code>PADDS</code> "add with saturation" beside plain <code>PADD</code> "with wraparound". For pixels, wraparound is a disaster — brightening a nearly white pixel must give white, not black. Saturating arithmetic clamps at the maximum instead of wrapping. That is a data-type-specific operation that plain integer hardware does not provide.</li>
<li><strong>This is where the chapter stops being about one value at a time.</strong> Ch.20 (parallel processing) will classify SIMD as one of Flynn's four categories. Here it is just a data type; there it becomes an architecture.</li>
</ul>
<p class="meo">💡 Picture a 64-bit register as a <strong>tray with dividers</strong>. Packed byte = eight small compartments; packed word = four; packed doubleword = two. One instruction operates on every compartment simultaneously, and the dividers stop any spill between them.</p>`,
        `<p class="y-chinh">🎯 Mục cuối của Table 13.2, mở ra. Các kiểu SIMD được <strong>"đưa vào kiến trúc x86 như một phần của các mở rộng tập lệnh nhằm tối ưu hiệu năng cho ứng dụng đa phương tiện"</strong> — các mở rộng đó là <strong>MMX</strong> (multimedia extensions) và <strong>SSE</strong> (streaming SIMD extensions).</p>
<table>
<tr><th>Kiểu dữ liệu SIMD trên slide</th><th>Một thanh ghi chứa gì</th><th>Dùng vào việc gì</th></tr>
<tr><td>Packed byte / packed byte integer</td><td>8 byte trong 64 bit (16 byte trong 128 bit)</td><td>Điểm ảnh, mẫu âm thanh, dữ liệu ký tự</td></tr>
<tr><td>Packed word / packed word integer</td><td>4 word 16 bit trong 64 bit</td><td>Âm thanh 16 bit, phép tính ảnh trung gian</td></tr>
<tr><td>Packed doubleword / packed doubleword integer</td><td>2 giá trị 32 bit trong 64 bit</td><td>Toạ độ, biến tích luỹ</td></tr>
<tr><td>Packed quadword / packed quadword integer</td><td>2 giá trị 64 bit trong 128 bit</td><td>Số nguyên rộng</td></tr>
<tr><td>Packed single-precision floating point</td><td>4 số thực 32 bit trong 128 bit</td><td>Hình học 3D, biến đổi đồ hoạ</td></tr>
<tr><td>Packed double-precision floating point</td><td>2 số thực 64 bit trong 128 bit</td><td>Tính toán khoa học</td></tr>
</table>
<ul>
<li><strong>Cái TÊN chính là định nghĩa.</strong> <em>Một lệnh, nhiều dữ liệu</em>: một lệnh <code>PADDB</code> cộng TÁM cặp byte trong đúng khoảng thời gian một lệnh <code>ADD</code> cộng một cặp. Cái nhanh không đến từ xung nhịp cao hơn — nó đến từ việc làm CÙNG MỘT VIỆC lên nhiều mục cùng lúc, đúng thứ mà vòng "Return for string or vector data" của Figure 13.1 (slide 3) đang vẽ.</li>
<li><strong>Vì sao đa phương tiện là ngòi nổ.</strong> "Dữ liệu video và âm thanh thường gồm những mảng LỚN các kiểu dữ liệu NHỎ" (slide 43 nói câu này). Một kênh màu của điểm ảnh là 8 bit; vậy một thanh ghi 64 bit phí 87,5% độ rộng cho một điểm ảnh. Nhét tám cái vào là thu lại toàn bộ.</li>
<li><strong>Chữ "packed" luôn có một nghĩa duy nhất.</strong> Vài giá trị nhỏ ĐỘC LẬP nằm cạnh nhau trong một thanh ghi rộng, và <em>KHÔNG có số nhớ đi qua ranh giới giữa chúng</em>. Mệnh đề cuối chính là mẹo phần cứng: một bộ cộng 64 bit thông thường bị cắt thành tám bộ cộng 8 bit bằng cách CHẶN số nhớ tại các ranh giới làn.</li>
<li><strong>Phép BÃO HOÀ là nửa còn lại của ý tưởng.</strong> Bảng MMX ở slide 44 liệt kê <code>PADDS</code> "cộng có bão hoà" bên cạnh <code>PADD</code> thường "có cuộn vòng". Với điểm ảnh, cuộn vòng là thảm hoạ — làm sáng một điểm gần trắng thì phải ra TRẮNG chứ không ra ĐEN. Số học bão hoà kẹp lại ở giá trị lớn nhất thay vì cuộn. Đó là một thao tác ĐẶC THÙ CHO KIỂU DỮ LIỆU mà phần cứng số nguyên thường không có.</li>
<li><strong>Đây là chỗ chương thôi nói về từng giá trị một.</strong> Ch.20 (xử lý song song) sẽ xếp SIMD vào một trong bốn nhóm phân loại của Flynn. Ở đây nó chỉ là một kiểu dữ liệu; ở đó nó thành một kiến trúc.</li>
</ul>
<p class="meo">💡 Hình dung thanh ghi 64 bit như một <strong>cái khay có vách ngăn</strong>. Packed byte = tám ô nhỏ; packed word = bốn ô; packed doubleword = hai ô. Một lệnh tác động lên MỌI ô cùng lúc, và vách ngăn chặn mọi thứ tràn từ ô này sang ô kia.</p>`],

      [18, 'ARM Data Types',
        `<p class="y-chinh">🎯 The RISC answer to Table 13.2, and the contrast is the lesson. <strong>ARM processors support data types of 8 (byte), 16 (halfword) and 32 (word) bits in length.</strong> Three widths. That is the entire list.</p>
<table>
<tr><th>What the slide says</th><th>What it means</th></tr>
<tr><td>Data types of <strong>8 (byte), 16 (halfword), 32 (word)</strong> bits</td><td>Three sizes only — no packed BCD, no far pointers, no bit strings</td></tr>
<tr><td>"All three data types can also be used for <strong>twos complement signed integers</strong>"</td><td>Signedness is a property of the <em>instruction</em>, not of a separate data type</td></tr>
<tr><td>"For all three data types an <strong>unsigned interpretation</strong> is supported in which the value represents an unsigned, nonnegative integer"</td><td>Same bits, two readings — exactly the Integer/Ordinal pair of x86, but without inventing two type names</td></tr>
<tr><td><strong>Alignment checking</strong>: "when the appropriate control bit is set, a data abort signal indicates an alignment fault for attempting unaligned access"</td><td>An unaligned access <em>traps</em> — the hardware refuses and raises an exception</td></tr>
<tr><td><strong>Unaligned access</strong>: "when this option is enabled, the processor uses one or more memory accesses to generate the required transfer of adjacent bytes transparently to the programmer"</td><td>An unaligned access is <em>emulated</em> — it works, but silently costs extra memory cycles</td></tr>
</table>
<ul>
<li><strong>Alignment checking and unaligned access are the two opposite settings of the same problem.</strong> A 32-bit word "wants" to sit at an address divisible by 4. Ask for one at address 0x1002 and the machine must either refuse (alignment fault) or fetch twice and stitch (transparent, but slower). ARM lets the system choose which; x86 just always stitches. Neither is free.</li>
<li><strong>Why alignment exists at all.</strong> Memory is wired in words. An aligned 32-bit read is one bus transaction; an unaligned one crosses a word boundary and needs two, plus shifting and merging. Ch.4/Ch.5 explain the same effect at cache-line granularity — an unaligned access can even touch two cache lines and cause two misses.</li>
<li><strong>Three widths versus x86's eleven types is the CISC/RISC argument in one slide pair.</strong> ARM's view: give the compiler a few clean primitives and let it build the rest. x86's view: give the programmer everything the application might want. Ch.17 argues the case formally; here you can just count the rows.</li>
<li><strong>Note what ARM does NOT define as a data type.</strong> No decimal/BCD (so financial code does it in software), no string type, no dedicated pointer type — an address is simply a 32-bit word. Fewer types means a smaller, faster decoder, which is the whole RISC bet.</li>
<li><strong>Connect to PRF192.</strong> A <code>struct</code> in C is laid out with padding precisely to keep every field aligned; that is why <code>sizeof</code> a struct is often larger than the sum of its fields. This slide is the hardware reason for that padding.</li>
</ul>
<p class="pitfall">⚠️ Exam trap: "halfword" on ARM means <strong>16 bits</strong>, because an ARM word is 32 bits. On an x86/IBM mainframe a "word" is 16 bits and a "doubleword" is 32. The same English word means different sizes on different machines — always check what the architecture in the question calls a word before doing any arithmetic.</p>`,
        `<p class="y-chinh">🎯 Câu trả lời kiểu RISC cho Table 13.2, và chính sự TƯƠNG PHẢN mới là bài học. <strong>Bộ xử lý ARM hỗ trợ kiểu dữ liệu dài 8 bit (byte), 16 bit (halfword) và 32 bit (word).</strong> Ba độ rộng. Hết danh sách.</p>
<table>
<tr><th>Slide ghi gì</th><th>Nghĩa là gì</th></tr>
<tr><td>Kiểu dữ liệu <strong>8 (byte), 16 (halfword), 32 (word)</strong> bit</td><td>Chỉ ba cỡ — không BCD nén, không con trỏ xa, không chuỗi bit</td></tr>
<tr><td>"Cả ba kiểu dữ liệu đều dùng được cho <strong>số nguyên CÓ DẤU bù hai</strong>"</td><td>Có dấu hay không là tính chất của <em>LỆNH</em>, không phải của một kiểu dữ liệu riêng</td></tr>
<tr><td>"Với cả ba kiểu, <strong>cách diễn giải KHÔNG DẤU</strong> đều được hỗ trợ, trong đó giá trị biểu diễn một số nguyên không dấu, không âm"</td><td>Cùng dãy bit, hai cách đọc — đúng là cặp Integer/Ordinal của x86, nhưng không phải đặt ra hai cái tên kiểu</td></tr>
<tr><td><strong>Alignment checking (kiểm căn lề)</strong>: "khi bit điều khiển tương ứng được bật, tín hiệu data abort báo lỗi căn lề khi cố truy cập không căn lề"</td><td>Truy cập lệch lề thì <em>BẪY</em> — phần cứng từ chối và ném ngoại lệ</td></tr>
<tr><td><strong>Unaligned access (truy cập không căn lề)</strong>: "khi tuỳ chọn này bật, bộ xử lý dùng một hoặc nhiều lần truy cập bộ nhớ để tạo ra phép truyền các byte kề nhau cần thiết, trong suốt với lập trình viên"</td><td>Truy cập lệch lề được <em>MÔ PHỎNG</em> — vẫn chạy, nhưng âm thầm tốn thêm chu kỳ bộ nhớ</td></tr>
</table>
<ul>
<li><strong>Kiểm căn lề và truy cập không căn lề là hai cách đặt NGƯỢC NHAU cho cùng một bài toán.</strong> Một từ 32 bit "muốn" nằm ở địa chỉ chia hết cho 4. Đòi một từ ở địa chỉ 0x1002 thì máy phải hoặc TỪ CHỐI (lỗi căn lề) hoặc nạp HAI lần rồi ghép (trong suốt, nhưng chậm hơn). ARM cho hệ thống chọn kiểu nào; x86 thì luôn tự ghép. Không cách nào miễn phí.</li>
<li><strong>Vì sao có chuyện căn lề.</strong> Bộ nhớ được đi dây theo TỪ. Một phép đọc 32 bit căn lề là MỘT giao dịch bus; một phép đọc lệch lề cắt ngang ranh giới từ nên cần HAI, cộng thêm dịch và ghép. Ch.4/Ch.5 giải thích đúng hiệu ứng ấy ở mức dòng cache — một truy cập lệch lề thậm chí có thể chạm hai dòng cache và gây hai lần trượt.</li>
<li><strong>Ba độ rộng so với mười một kiểu của x86 chính là tranh luận CISC/RISC gói trong một cặp slide.</strong> Quan điểm ARM: đưa cho trình biên dịch vài nguyên thuỷ sạch sẽ rồi để nó dựng phần còn lại. Quan điểm x86: đưa cho lập trình viên mọi thứ ứng dụng có thể cần. Ch.17 lập luận đầy đủ; ở đây bạn chỉ cần ĐẾM số dòng.</li>
<li><strong>Để ý ARM KHÔNG định nghĩa cái gì thành kiểu dữ liệu.</strong> Không thập phân/BCD (nên mã tài chính phải làm bằng phần mềm), không kiểu chuỗi, không kiểu con trỏ riêng — địa chỉ đơn giản là một từ 32 bit. Ít kiểu hơn nghĩa là bộ giải mã nhỏ hơn và nhanh hơn, và đó là toàn bộ canh bạc của RISC.</li>
<li><strong>Nối sang PRF192.</strong> Một <code>struct</code> trong C được bố trí CÓ ĐỆM chính là để giữ mọi trường căn lề; đó là lý do <code>sizeof</code> một struct thường LỚN HƠN tổng kích thước các trường. Slide này là lý do phần cứng của mấy byte đệm ấy.</li>
</ul>
<p class="pitfall">⚠️ Bẫy đề thi: "halfword" trên ARM là <strong>16 bit</strong>, vì một word của ARM là 32 bit. Trên x86/máy lớn IBM thì "word" là 16 bit còn "doubleword" là 32 bit. Cùng một từ tiếng Anh mang cỡ khác nhau trên máy khác nhau — trước khi tính toán gì, luôn kiểm xem kiến trúc trong đề gọi "word" là bao nhiêu bit.</p>`],

      [19, 'Figure 13.5 — ARM Endian Support: Word Load/Store with E-Bit',
        `<p class="y-chinh">🎯 Endianness, drawn as a wiring diagram. Four bytes sit in memory at ascending addresses (Byte 0 lowest, Byte 3 highest); the picture shows the <em>two different ways</em> they can be wired into a 32-bit ARM register, selected by one bit — the <strong>E-bit of the program status register</strong>.</p>
<table>
<tr><th>Setting</th><th>Register layout (bit 31 → bit 0)</th><th>Which memory byte lands in the most significant position</th><th>Name</th></tr>
<tr><td><strong>E-bit = 0</strong></td><td>Byte 3 · Byte 2 · Byte 1 · Byte 0</td><td>Byte 3 — the byte at the <em>highest</em> address</td><td>little-endian (the low address holds the least significant byte)</td></tr>
<tr><td><strong>E-bit = 1</strong></td><td>Byte 0 · Byte 1 · Byte 2 · Byte 3</td><td>Byte 0 — the byte at the <em>lowest</em> address</td><td>big-endian (the low address holds the most significant byte)</td></tr>
</table>
<ul>
<li><strong>Read the arrows, not the words.</strong> The memory column is identical on both sides of the figure; only the crossing pattern of the arrows changes. That is the whole concept: <em>the bytes in memory do not move — the interpretation of their order does.</em></li>
<li><strong>ARM is "bi-endian", and that is the point of the slide.</strong> A single control bit flips the convention at runtime, with no change to the memory contents and no change to the instructions. x86 is little-endian only; the old IBM/Motorola line was big-endian only; network protocols are defined big-endian ("network byte order"). ARM can be either, which is why it appears in devices that must speak both.</li>
<li><strong>Worked example.</strong> Store the 32-bit value 0x12345678 into memory at address 100, then read back the single byte at address 100. Little-endian (E = 0): you get <strong>0x78</strong>, the least significant byte. Big-endian (E = 1): you get <strong>0x12</strong>, the most significant byte. Same store instruction, same address, different answer.</li>
<li><strong>Why anybody cares.</strong> Endianness is invisible while data stays inside one machine, and becomes catastrophic the moment bytes cross a boundary — a file, a network packet, a memory-mapped device register, a struct written by one CPU and read by another. Every "the numbers are garbage after transfer" bug in your career will start here.</li>
<li><strong>The E-bit lives in the program status register</strong>, i.e. it is processor state, like the condition flags of slide 41. It can therefore be changed by the OS per process — the same hardware serving big-endian and little-endian code.</li>
</ul>
<p class="meo">💡 The reliable memory hook: <strong>little-endian = the LITTLE end (least significant byte) comes FIRST</strong>, at the lowest address. Big-endian = the BIG end first. The name always describes <em>which end is stored at the lowest address</em>, never anything about the register.</p>
<p class="pitfall">⚠️ Trap: endianness applies to <em>bytes within a multi-byte value</em>, not to bits within a byte. Bit 0 is bit 0 everywhere. If an exam question talks about "reversing the bit order", it is not asking about endianness.</p>`,
        `<p class="y-chinh">🎯 Thứ tự byte (endianness), vẽ thành một sơ đồ đi dây. Bốn byte nằm trong bộ nhớ theo địa chỉ tăng dần (Byte 0 thấp nhất, Byte 3 cao nhất); bức hình cho thấy <em>HAI cách khác nhau</em> để đấu chúng vào một thanh ghi ARM 32 bit, chọn bằng MỘT bit — <strong>bit E của thanh ghi trạng thái chương trình</strong>.</p>
<table>
<tr><th>Thiết đặt</th><th>Bố trí trong thanh ghi (bit 31 → bit 0)</th><th>Byte nào của bộ nhớ rơi vào vị trí CÓ NGHĨA NHẤT</th><th>Tên gọi</th></tr>
<tr><td><strong>E-bit = 0</strong></td><td>Byte 3 · Byte 2 · Byte 1 · Byte 0</td><td>Byte 3 — byte ở địa chỉ <em>CAO NHẤT</em></td><td>little-endian (địa chỉ thấp giữ byte ít nghĩa nhất)</td></tr>
<tr><td><strong>E-bit = 1</strong></td><td>Byte 0 · Byte 1 · Byte 2 · Byte 3</td><td>Byte 0 — byte ở địa chỉ <em>THẤP NHẤT</em></td><td>big-endian (địa chỉ thấp giữ byte có nghĩa nhất)</td></tr>
</table>
<ul>
<li><strong>Đọc các MŨI TÊN, đừng đọc chữ.</strong> Cột bộ nhớ giống hệt nhau ở cả hai nửa hình; chỉ có kiểu bắt chéo của mũi tên là đổi. Đó là trọn khái niệm: <em>byte trong bộ nhớ KHÔNG di chuyển — chỉ CÁCH DIỄN GIẢI thứ tự của chúng đổi.</em></li>
<li><strong>ARM là "lưỡng endian", và đó là ý của slide.</strong> Một bit điều khiển lật quy ước ngay lúc chạy, không đổi nội dung bộ nhớ và không đổi lệnh nào. x86 chỉ little-endian; dòng IBM/Motorola đời cũ chỉ big-endian; giao thức mạng định nghĩa theo big-endian ("network byte order"). ARM làm được cả hai, nên nó có mặt trong những thiết bị phải nói cả hai thứ tiếng.</li>
<li><strong>Ví dụ giải mẫu.</strong> Ghi giá trị 32 bit 0x12345678 vào bộ nhớ tại địa chỉ 100, rồi đọc lại MỘT byte tại địa chỉ 100. Little-endian (E = 0): bạn nhận <strong>0x78</strong>, byte ít nghĩa nhất. Big-endian (E = 1): bạn nhận <strong>0x12</strong>, byte có nghĩa nhất. Cùng lệnh ghi, cùng địa chỉ, khác đáp án.</li>
<li><strong>Vì sao ai cũng phải quan tâm.</strong> Endianness VÔ HÌNH khi dữ liệu còn nằm trong một máy, và trở thành thảm hoạ ngay khi byte vượt qua một ranh giới — một tệp, một gói tin mạng, một thanh ghi thiết bị ánh xạ bộ nhớ, một struct do CPU này ghi và CPU kia đọc. Mọi lỗi kiểu "truyền xong thì số ra rác" trong đời bạn đều bắt đầu từ đây.</li>
<li><strong>Bit E nằm trong thanh ghi trạng thái chương trình</strong>, tức nó là TRẠNG THÁI bộ xử lý, giống các cờ điều kiện ở slide 41. Nhờ vậy hệ điều hành đổi được nó theo từng tiến trình — cùng một phần cứng phục vụ cả mã big-endian lẫn little-endian.</li>
</ul>
<p class="meo">💡 Mẹo nhớ chắc chắn: <strong>little-endian = đầu NHỎ (byte ít nghĩa nhất) đi TRƯỚC</strong>, ở địa chỉ thấp nhất. Big-endian = đầu TO đi trước. Cái tên LUÔN mô tả <em>đầu nào được lưu ở địa chỉ thấp nhất</em>, chứ không bao giờ nói gì về thanh ghi.</p>
<p class="pitfall">⚠️ Bẫy: endianness áp cho <em>các BYTE bên trong một giá trị nhiều byte</em>, không áp cho các BIT bên trong một byte. Bit 0 ở đâu cũng là bit 0. Đề nào nói về "đảo thứ tự bit" thì không phải đang hỏi về endianness.</p>`],

      [20, 'Table 13.3 — Common x86 Instruction Set Operations (1 of 3): Data Transfer and Arithmetic',
        `<p class="y-chinh">🎯 The operation repertoire of slide 10, made concrete. Part (a) <strong>data transfer</strong> — four instructions — and part (b) <strong>arithmetic</strong> — eleven. Together they are the two biggest quadrants of the Instruction Types circle on slide 7.</p>
<p class="nhan">📐 <strong>(a) Data Transfer.</strong></p>
<table>
<tr><th>Instruction</th><th>What the slide says</th></tr>
<tr><td><code>MOV Dest, Source</code></td><td>Move data between registers or between register and memory, or immediate to register</td></tr>
<tr><td><code>XCHG Op1, Op2</code></td><td>Swap contents between two registers, or register and memory</td></tr>
<tr><td><code>PUSH Source</code></td><td>Decrements the stack pointer (ESP register), <em>then</em> copies the source operand to the top of stack</td></tr>
<tr><td><code>POP Dest</code></td><td>Copies top of stack to destination and increments ESP</td></tr>
</table>
<p class="nhan">📐 <strong>(b) Arithmetic.</strong></p>
<table>
<tr><th>Instruction</th><th>What the slide says</th><th>Note</th></tr>
<tr><td><code>ADD Dest, Source</code></td><td>Adds destination and source, stores in destination. Destination can be register or memory; source can be register, memory or immediate</td><td>two-address form (slide 9, row 2)</td></tr>
<tr><td><code>SUB Dest, Source</code></td><td>Subtracts source from destination, stores in destination</td><td>order matters: Dest ← Dest − Source</td></tr>
<tr><td><code>MUL Op</code></td><td>UNSIGNED multiplication of the operand by AL, AX or EAX, result stored in the register. The opcode indicates the size of register</td><td><strong>one-address</strong> form — the accumulator is implicit</td></tr>
<tr><td><code>IMUL Op</code></td><td>Signed integer multiplication</td><td>the Integer/Ordinal pair of slide 15, in instruction form</td></tr>
<tr><td><code>DIV Op</code></td><td>Divides UNSIGNED the value in AX, DX:AX, EDX:EAX or RDX:RAX (dividend) by the source operand (divisor), storing the result back in those registers</td><td>implicit double-width dividend</td></tr>
<tr><td><code>IDIV Op</code></td><td>Signed integer division</td><td></td></tr>
<tr><td><code>INC Op</code></td><td>Adds 1 to the destination operand, <em>while preserving the state of the CF flag</em></td><td>the CF detail is the exam-worthy part</td></tr>
<tr><td><code>DEC Op</code></td><td>Subtracts 1 from the destination, preserving CF</td><td></td></tr>
<tr><td><code>NEG Op</code></td><td>Replaces the operand with (0 − operand), using twos complement representation</td><td>this is the "Negate" of slide 26</td></tr>
<tr><td><code>CMP Op1, Op2</code></td><td>Compares the two operands by <em>subtracting the second from the first</em> and sets the status flags in EFLAGS according to the result</td><td>the result is <strong>discarded</strong>; only the flags survive</td></tr>
</table>
<ul>
<li><strong><code>MUL</code>/<code>DIV</code> are the clearest one-address instructions you will ever see.</strong> They name only one operand; the other operand <em>and</em> the destination are the implicit accumulator (AL/AX/EAX/RAX). That is Table 13.1 row 3 living inside a machine everyone calls "two-address" — proof that real ISAs mix the rows.</li>
<li><strong><code>CMP</code> is <code>SUB</code> that throws the answer away.</strong> Same subtraction, same flag effects, but the operands are unchanged. Pair it with a <code>Jcc</code> from slide 22 and you have every <code>if</code> statement ever compiled. The reason it exists separately is that you usually want to test a value without destroying it.</li>
<li><strong>Why INC and DEC preserve the carry flag.</strong> They are meant for loop counters, and a loop counter must not disturb a multi-word addition in progress that is using CF to carry between words. It is a small design decision with a clear purpose — and exactly the kind of detail an exam likes.</li>
<li><strong><code>PUSH</code> decrements <em>before</em> writing.</strong> The order matters and the slide states it: decrement ESP, then store. So the x86 stack grows <em>downwards</em>, towards lower addresses, and ESP always points at the item currently on top. Get the order wrong and you overwrite the previous entry.</li>
<li><strong>Connect back to slide 8.</strong> <code>MOV</code> is exactly the <code>MOVE</code> that made the two-address program six instructions long; <code>PUSH</code>/<code>POP</code> are exactly the zero-address instructions of the stack program. x86 offers you all four styles from Table 13.1 and lets the compiler pick.</li>
</ul>
<p class="pitfall">⚠️ Trap on <code>DIV</code>: the dividend is <em>double width</em> and implicit (DX:AX for a 16-bit divisor, EDX:EAX for 32-bit). Forgetting to clear or sign-extend the high half is the classic cause of a divide-overflow exception — the division is perfectly legal, the leftover garbage in DX is not.</p>`,
        `<p class="y-chinh">🎯 Bộ thao tác của slide 10, làm cho cụ thể. Phần (a) <strong>chuyển dữ liệu</strong> — bốn lệnh — và phần (b) <strong>số học</strong> — mười một lệnh. Cộng lại, đó là hai góc phần tư lớn nhất của vòng tròn Instruction Types ở slide 7.</p>
<p class="nhan">📐 <strong>(a) Data Transfer — chuyển dữ liệu.</strong></p>
<table>
<tr><th>Lệnh</th><th>Slide ghi gì</th></tr>
<tr><td><code>MOV Dest, Source</code></td><td>Chuyển dữ liệu giữa các thanh ghi, hoặc giữa thanh ghi và bộ nhớ, hoặc giá trị tức thời vào thanh ghi</td></tr>
<tr><td><code>XCHG Op1, Op2</code></td><td>Hoán đổi nội dung giữa hai thanh ghi, hoặc giữa thanh ghi và bộ nhớ</td></tr>
<tr><td><code>PUSH Source</code></td><td>GIẢM con trỏ ngăn xếp (thanh ghi ESP), <em>RỒI MỚI</em> chép toán hạng nguồn lên đỉnh ngăn xếp</td></tr>
<tr><td><code>POP Dest</code></td><td>Chép đỉnh ngăn xếp vào đích rồi TĂNG ESP</td></tr>
</table>
<p class="nhan">📐 <strong>(b) Arithmetic — số học.</strong></p>
<table>
<tr><th>Lệnh</th><th>Slide ghi gì</th><th>Ghi chú</th></tr>
<tr><td><code>ADD Dest, Source</code></td><td>Cộng đích với nguồn, lưu vào đích. Đích là thanh ghi hoặc bộ nhớ; nguồn là thanh ghi, bộ nhớ hoặc tức thời</td><td>dạng HAI địa chỉ (slide 9, dòng 2)</td></tr>
<tr><td><code>SUB Dest, Source</code></td><td>Lấy đích TRỪ nguồn, lưu vào đích</td><td>thứ tự quan trọng: Dest ← Dest − Source</td></tr>
<tr><td><code>MUL Op</code></td><td>Nhân KHÔNG DẤU toán hạng với AL, AX hoặc EAX, kết quả lưu vào thanh ghi. Opcode cho biết cỡ thanh ghi</td><td>dạng <strong>MỘT địa chỉ</strong> — thanh ghi tích luỹ ngầm định</td></tr>
<tr><td><code>IMUL Op</code></td><td>Nhân số nguyên CÓ DẤU</td><td>cặp Integer/Ordinal của slide 15, ở dạng lệnh</td></tr>
<tr><td><code>DIV Op</code></td><td>Chia KHÔNG DẤU giá trị trong AX, DX:AX, EDX:EAX hoặc RDX:RAX (số bị chia) cho toán hạng nguồn (số chia), lưu kết quả lại vào các thanh ghi đó</td><td>số bị chia ngầm định và RỘNG GẤP ĐÔI</td></tr>
<tr><td><code>IDIV Op</code></td><td>Chia số nguyên CÓ DẤU</td><td></td></tr>
<tr><td><code>INC Op</code></td><td>Cộng 1 vào toán hạng đích, <em>ĐỒNG THỜI GIỮ NGUYÊN trạng thái cờ CF</em></td><td>chi tiết về CF mới là chỗ đáng thi</td></tr>
<tr><td><code>DEC Op</code></td><td>Trừ 1 khỏi toán hạng đích, giữ nguyên CF</td><td></td></tr>
<tr><td><code>NEG Op</code></td><td>Thay giá trị toán hạng bằng (0 − toán hạng), dùng biểu diễn bù hai</td><td>đây là phép "Negate" của slide 26</td></tr>
<tr><td><code>CMP Op1, Op2</code></td><td>So sánh hai toán hạng bằng cách <em>LẤY TOÁN HẠNG THỨ NHẤT TRỪ TOÁN HẠNG THỨ HAI</em> rồi đặt các cờ trạng thái trong EFLAGS theo kết quả</td><td>kết quả bị <strong>VỨT ĐI</strong>; chỉ còn lại các cờ</td></tr>
</table>
<ul>
<li><strong><code>MUL</code>/<code>DIV</code> là những lệnh MỘT địa chỉ rõ ràng nhất bạn từng thấy.</strong> Chúng gọi tên đúng MỘT toán hạng; toán hạng kia <em>VÀ</em> chỗ chứa kết quả đều là thanh ghi tích luỹ ngầm định (AL/AX/EAX/RAX). Đó là dòng 3 của Table 13.1 sống bên trong một cỗ máy mà ai cũng gọi là "hai địa chỉ" — bằng chứng rằng ISA thật TRỘN các dòng lại.</li>
<li><strong><code>CMP</code> chính là <code>SUB</code> nhưng vứt đáp số đi.</strong> Cùng phép trừ, cùng tác động lên cờ, nhưng hai toán hạng KHÔNG đổi. Ghép nó với một lệnh <code>Jcc</code> ở slide 22 là bạn có mọi câu <code>if</code> từng được biên dịch. Lý do nó tồn tại riêng: thường bạn muốn KIỂM TRA một giá trị mà không phá huỷ nó.</li>
<li><strong>Vì sao INC và DEC giữ nguyên cờ nhớ.</strong> Chúng sinh ra cho biến đếm vòng lặp, mà biến đếm thì KHÔNG được phá một phép cộng nhiều từ đang dở dang vốn đang dùng CF để mang số nhớ giữa các từ. Một quyết định thiết kế nhỏ với mục đích rõ ràng — và đúng kiểu chi tiết mà đề thi ưa hỏi.</li>
<li><strong><code>PUSH</code> GIẢM ESP <em>TRƯỚC</em> rồi mới ghi.</strong> Thứ tự này quan trọng và slide nói rõ: giảm ESP, rồi lưu. Vậy ngăn xếp x86 mọc <em>XUỐNG</em>, về phía địa chỉ thấp, và ESP luôn trỏ vào mục đang nằm trên đỉnh. Làm ngược thứ tự là ghi đè mất mục trước đó.</li>
<li><strong>Nối ngược về slide 8.</strong> <code>MOV</code> chính là lệnh <code>MOVE</code> làm chương trình hai địa chỉ dài tới sáu lệnh; <code>PUSH</code>/<code>POP</code> chính là những lệnh KHÔNG địa chỉ của chương trình ngăn xếp. x86 cho bạn đủ cả bốn phong cách của Table 13.1 rồi để trình biên dịch chọn.</li>
</ul>
<p class="pitfall">⚠️ Bẫy ở <code>DIV</code>: số bị chia RỘNG GẤP ĐÔI và NGẦM ĐỊNH (DX:AX với số chia 16 bit, EDX:EAX với 32 bit). Quên xoá hoặc quên mở rộng dấu cho nửa cao là nguyên nhân kinh điển của ngoại lệ tràn phép chia — phép chia thì hoàn toàn hợp lệ, đống rác còn sót trong DX mới là thủ phạm.</p>`],

      [21, 'Table 13.3 — Common x86 Instruction Set Operations (2 of 3): Shift/Rotate and Logical',
        `<p class="y-chinh">🎯 The instructions that treat a word as <strong>logical data</strong> (slide 14) rather than as a number. Part (c) <strong>shift and rotate</strong> — seven instructions — and part (d) <strong>logical</strong> — five.</p>
<p class="nhan">📐 <strong>(c) Shift and Rotate.</strong> Every one of them "loads the CF flag with the last bit shifted out of the operand".</p>
<table>
<tr><th>Instruction</th><th>What the slide says</th><th>Vacated positions become</th></tr>
<tr><td><code>SAL Op, Quantity</code></td><td>Shifts the source operand LEFT by 1 to 31 bit positions</td><td>cleared (0)</td></tr>
<tr><td><code>SAR Op, Quantity</code></td><td>Shifts RIGHT by 1 to 31 positions — <em>arithmetic</em></td><td><strong>cleared if the operand is positive, SET if negative</strong></td></tr>
<tr><td><code>SHR Op, Quantity</code></td><td>Shifts RIGHT by 1 to 31 positions — <em>logical</em></td><td>always cleared (0)</td></tr>
<tr><td><code>ROL Op, Quantity</code></td><td>Rotate bits LEFT, with wraparound</td><td>filled by the bits that came off the other end</td></tr>
<tr><td><code>ROR Op, Quantity</code></td><td>Rotate bits RIGHT, with wraparound</td><td>same</td></tr>
<tr><td><code>RCL Op, Quantity</code></td><td>Rotate LEFT <em>including the CF flag</em>, with wraparound — treats CF as a one-bit extension on the <strong>upper</strong> end</td><td>a 9-bit (or 33-bit) rotation</td></tr>
<tr><td><code>RCR Op, Quantity</code></td><td>Rotate RIGHT including CF — CF is a one-bit extension on the <strong>lower</strong> end</td><td>same</td></tr>
</table>
<p class="nhan">📐 <strong>(d) Logical.</strong></p>
<table>
<tr><th>Instruction</th><th>What the slide says</th><th>Use it to</th></tr>
<tr><td><code>NOT Op</code></td><td>Inverts each bit of the operand</td><td>flip everything (ones complement)</td></tr>
<tr><td><code>AND Dest, Source</code></td><td>Bitwise AND, result stored in destination</td><td><strong>clear</strong> selected bits / extract a field</td></tr>
<tr><td><code>OR Dest, Source</code></td><td>Bitwise OR, result stored in destination</td><td><strong>set</strong> selected bits</td></tr>
<tr><td><code>XOR Dest, Source</code></td><td>Bitwise XOR, result stored in destination</td><td><strong>flip</strong> selected bits</td></tr>
<tr><td><code>TEST Op1, Op2</code></td><td>Performs a bitwise AND and sets the S, Z and P status flags — <strong>the operands are unchanged</strong></td><td>check bits without destroying them</td></tr>
</table>
<p class="nhan">📐 <strong>Worked example, all five shift/rotate forms on the same byte.</strong> Input <code>10100110</code>, count = 3. (Every line below was computed in <code>python3</code>, not by hand.)</p>
<table>
<tr><th>Operation</th><th>Result</th><th>Why</th></tr>
<tr><td>Logical left shift (<code>SAL</code>), 3</td><td><code>00110000</code></td><td>the top three bits 101 fall off; three 0s enter at the right</td></tr>
<tr><td>Logical right shift (<code>SHR</code>), 3</td><td><code>00010100</code></td><td>three 0s enter at the left, regardless of sign</td></tr>
<tr><td>Arithmetic right shift (<code>SAR</code>), 3</td><td><code>11110100</code></td><td>the operand is negative (top bit 1), so <strong>1s</strong> enter at the left — the sign is preserved</td></tr>
<tr><td>Rotate left (<code>ROL</code>), 3</td><td><code>00110101</code></td><td>the 101 that fell off the left reappears at the right</td></tr>
<tr><td>Rotate right (<code>ROR</code>), 3</td><td><code>11010100</code></td><td>the 110 that fell off the right reappears at the left</td></tr>
</table>
<p class="dap-an">✅ In every case CF ends up holding the <strong>last bit shifted out</strong> — for <code>SAL</code> by 3 that is bit 5 of the original (value 1); for <code>SHR</code> by 3 that is bit 2 of the original (value 1). And note the arithmetic: <code>SHR</code> by 3 turns 10100110 (166 unsigned) into 00010100 (20) — that is 166 ÷ 8 = 20,75 truncated to 20. <strong>A logical right shift by n is an unsigned division by 2<sup>n</sup>; a left shift by n is a multiplication by 2<sup>n</sup></strong> — which is why compilers replace <code>x * 8</code> with a shift.</p>
<ul>
<li><strong>SAR versus SHR is the single most examined distinction here.</strong> Both move bits right; only SAR replicates the sign bit. Use SHR on a negative twos-complement number and you get a large positive one — the arithmetic silently breaks. In C this is exactly the difference between shifting a <code>signed</code> and an <code>unsigned</code> variable.</li>
<li><strong>SAL and SHL are the same instruction.</strong> Shifting left, the vacated positions are 0 whether you are thinking arithmetically or logically, so x86 gives them one opcode and two names. There is no such shortcut on the right.</li>
<li><strong><code>AND</code> versus <code>TEST</code> — the distinction the slide is careful about.</strong> Both compute the same bitwise AND; <code>AND</code> writes it back, <code>TEST</code> throws it away and keeps only the flags. It is precisely the <code>SUB</code>/<code>CMP</code> relationship of slide 20, one family over.</li>
<li><strong>The masking example from slide 14, in real instructions.</strong> <code>AND AL, 0Fh</code> applied to the IRA character '7' (0011 0111) gives 0000 0111 — the BCD digit 7, verified by computation. Three such instructions per byte pair implement the whole IRA-to-packed-decimal conversion the book cited as the reason logical data exists.</li>
<li><strong>Why RCL/RCR carry the flag around.</strong> They make a 9-bit (or 33-bit) rotation, which is how you shift a value wider than one register: shift the low word, then <code>RCR</code> the high word so the bit that fell out of one arrives in the other. Multi-precision arithmetic is built out of exactly this.</li>
</ul>
<p class="pitfall">⚠️ Trap: "arithmetic left shift" is <em>not</em> a safe multiplication. Shift 10110000 left and the sign bit changes — the slide's own Table 13.7 (slide 29) shows 10100110 arithmetic-left-shifted by 3 giving 10110000, which is <strong>not</strong> 166 × 8. Left shifts overflow silently; only the right shifts have the clean division interpretation.</p>`,
        `<p class="y-chinh">🎯 Những lệnh coi một từ là <strong>DỮ LIỆU LOGIC</strong> (slide 14) chứ không phải một con số. Phần (c) <strong>dịch và quay</strong> — bảy lệnh — và phần (d) <strong>logic</strong> — năm lệnh.</p>
<p class="nhan">📐 <strong>(c) Shift and Rotate — dịch và quay.</strong> Lệnh nào cũng "nạp vào cờ CF bit cuối cùng bị đẩy ra khỏi toán hạng".</p>
<table>
<tr><th>Lệnh</th><th>Slide ghi gì</th><th>Các vị trí bỏ trống được điền</th></tr>
<tr><td><code>SAL Op, Quantity</code></td><td>Dịch toán hạng nguồn sang TRÁI từ 1 tới 31 vị trí bit</td><td>xoá về 0</td></tr>
<tr><td><code>SAR Op, Quantity</code></td><td>Dịch sang PHẢI từ 1 tới 31 vị trí — kiểu <em>SỐ HỌC</em></td><td><strong>xoá về 0 nếu toán hạng DƯƠNG, ĐẶT thành 1 nếu ÂM</strong></td></tr>
<tr><td><code>SHR Op, Quantity</code></td><td>Dịch sang PHẢI từ 1 tới 31 vị trí — kiểu <em>LOGIC</em></td><td>luôn xoá về 0</td></tr>
<tr><td><code>ROL Op, Quantity</code></td><td>Quay bit sang TRÁI, có cuộn vòng</td><td>điền bằng chính những bit rơi ra ở đầu kia</td></tr>
<tr><td><code>ROR Op, Quantity</code></td><td>Quay bit sang PHẢI, có cuộn vòng</td><td>như trên</td></tr>
<tr><td><code>RCL Op, Quantity</code></td><td>Quay TRÁI <em>KỂ CẢ cờ CF</em>, có cuộn vòng — coi CF như phần mở rộng một bit ở đầu <strong>TRÊN</strong></td><td>thành phép quay 9 bit (hoặc 33 bit)</td></tr>
<tr><td><code>RCR Op, Quantity</code></td><td>Quay PHẢI kể cả CF — CF là phần mở rộng một bit ở đầu <strong>DƯỚI</strong></td><td>như trên</td></tr>
</table>
<p class="nhan">📐 <strong>(d) Logical — logic.</strong></p>
<table>
<tr><th>Lệnh</th><th>Slide ghi gì</th><th>Dùng để</th></tr>
<tr><td><code>NOT Op</code></td><td>Đảo từng bit của toán hạng</td><td>lật tất cả (bù một)</td></tr>
<tr><td><code>AND Dest, Source</code></td><td>AND theo bit, kết quả lưu vào đích</td><td><strong>XOÁ</strong> những bit được chọn / rút một trường ra</td></tr>
<tr><td><code>OR Dest, Source</code></td><td>OR theo bit, kết quả lưu vào đích</td><td><strong>BẬT</strong> những bit được chọn</td></tr>
<tr><td><code>XOR Dest, Source</code></td><td>XOR theo bit, kết quả lưu vào đích</td><td><strong>LẬT</strong> những bit được chọn</td></tr>
<tr><td><code>TEST Op1, Op2</code></td><td>Thực hiện AND theo bit và đặt các cờ S, Z, P — <strong>hai toán hạng KHÔNG đổi</strong></td><td>kiểm bit mà không phá chúng</td></tr>
</table>
<p class="nhan">📐 <strong>Ví dụ giải mẫu, cả năm dạng dịch/quay trên CÙNG một byte.</strong> Đầu vào <code>10100110</code>, số bước = 3. (Mọi dòng dưới đây được tính bằng <code>python3</code>, không phải nhẩm tay.)</p>
<table>
<tr><th>Phép</th><th>Kết quả</th><th>Vì sao</th></tr>
<tr><td>Dịch trái logic (<code>SAL</code>), 3</td><td><code>00110000</code></td><td>ba bit cao 101 rơi ra; ba số 0 vào từ bên phải</td></tr>
<tr><td>Dịch phải logic (<code>SHR</code>), 3</td><td><code>00010100</code></td><td>ba số 0 vào từ bên trái, bất kể dấu</td></tr>
<tr><td>Dịch phải số học (<code>SAR</code>), 3</td><td><code>11110100</code></td><td>toán hạng ÂM (bit cao bằng 1), nên <strong>ba số 1</strong> vào từ bên trái — DẤU được giữ nguyên</td></tr>
<tr><td>Quay trái (<code>ROL</code>), 3</td><td><code>00110101</code></td><td>cụm 101 rơi ra ở trái hiện lại ở phải</td></tr>
<tr><td>Quay phải (<code>ROR</code>), 3</td><td><code>11010100</code></td><td>cụm 110 rơi ra ở phải hiện lại ở trái</td></tr>
</table>
<p class="dap-an">✅ Ở mọi trường hợp, CF kết thúc với <strong>bit cuối cùng bị đẩy ra</strong> — <code>SAL</code> 3 bước thì đó là bit 5 của số gốc (bằng 1); <code>SHR</code> 3 bước thì đó là bit 2 của số gốc (bằng 1). Và để ý phép số học: <code>SHR</code> 3 bước biến 10100110 (166 không dấu) thành 00010100 (20) — đúng bằng 166 ÷ 8 = 20,75 cắt phần lẻ còn 20. <strong>Dịch phải logic n bước là phép CHIA không dấu cho 2<sup>n</sup>; dịch trái n bước là phép NHÂN với 2<sup>n</sup></strong> — đó là lý do trình biên dịch thay <code>x * 8</code> bằng một phép dịch.</p>
<ul>
<li><strong>SAR khác SHR là phân biệt bị hỏi thi nhiều nhất ở đây.</strong> Cả hai đều đẩy bit sang phải; chỉ SAR nhân bản bit dấu. Dùng SHR trên một số bù hai ÂM là bạn nhận về một số DƯƠNG rất lớn — phép toán hỏng trong im lặng. Trong C, đó chính xác là khác biệt giữa dịch một biến <code>signed</code> và một biến <code>unsigned</code>.</li>
<li><strong>SAL và SHL là CÙNG MỘT lệnh.</strong> Dịch sang trái thì các vị trí bỏ trống đều là 0, dù bạn nghĩ theo kiểu số học hay kiểu logic, nên x86 cho chúng một opcode với hai cái tên. Bên phải thì KHÔNG có lối tắt như vậy.</li>
<li><strong><code>AND</code> khác <code>TEST</code> — chỗ mà slide cẩn thận phân biệt.</strong> Cả hai tính cùng một phép AND theo bit; <code>AND</code> GHI kết quả lại, <code>TEST</code> vứt đi và chỉ giữ các cờ. Đúng là quan hệ <code>SUB</code>/<code>CMP</code> của slide 20, dịch sang một họ khác.</li>
<li><strong>Ví dụ che bit ở slide 14, viết bằng lệnh thật.</strong> <code>AND AL, 0Fh</code> áp lên ký tự IRA '7' (0011 0111) cho ra 0000 0111 — chữ số BCD 7, đã kiểm bằng tính toán. Ba lệnh như vậy cho mỗi cặp byte là hiện thực trọn phép chuyển IRA → thập phân nén mà sách viện dẫn làm lý do tồn tại của dữ liệu logic.</li>
<li><strong>Vì sao RCL/RCR lôi cả cờ nhớ đi vòng.</strong> Chúng tạo ra phép quay 9 bit (hoặc 33 bit), và đó là cách bạn dịch một giá trị RỘNG HƠN một thanh ghi: dịch từ thấp trước, rồi <code>RCR</code> từ cao để bit rơi ra khỏi cái này đi vào cái kia. Số học đa độ chính xác được dựng đúng từ chỗ này.</li>
</ul>
<p class="pitfall">⚠️ Bẫy: "dịch trái số học" KHÔNG phải một phép nhân an toàn. Dịch 10110000 sang trái thì bit dấu đổi — chính Table 13.7 của sách (slide 29) cho thấy 10100110 dịch trái số học 3 bước ra 10110000, mà đó <strong>KHÔNG</strong> phải 166 × 8. Dịch trái tràn số trong im lặng; chỉ các phép dịch PHẢI mới có cách hiểu "chia" sạch sẽ.</p>`],

      [22, 'Table 13.3 — Common x86 Instruction Set Operations (3 of 3): Transfer of Control and Input/Output',
        `<p class="y-chinh">🎯 The last two quadrants of slide 7. Part (e) <strong>transfer of control</strong> — eight instructions, the ones that decide <em>which instruction runs next</em> — and part (f) <strong>input/output</strong> — four.</p>
<p class="nhan">📐 <strong>(e) Transfer of Control.</strong></p>
<table>
<tr><th>Instruction</th><th>What the slide says</th></tr>
<tr><td><code>CALL proc</code></td><td>Saves procedure linking information on the stack and branches to the called procedure specified by the operand. The operand specifies the address of the first instruction in the called procedure</td></tr>
<tr><td><code>RET</code></td><td>Transfers program control to a return address located on the top of the stack. The return is made to the instruction that <em>follows</em> the CALL</td></tr>
<tr><td><code>JMP Dest</code></td><td>Transfers control to a different point in the instruction stream <strong>without recording return information</strong></td></tr>
<tr><td><code>Jcc Dest</code></td><td>Checks the state of one or more status flags in EFLAGS (CF, OF, PF, SF, ZF) and, if the flags are in the specified state, jumps to the target. See Tables 13.8 and 13.9</td></tr>
<tr><td><code>NOP</code></td><td>Performs no operation. A one-byte or multi-byte NOP that takes up space in the instruction stream but does not affect machine context, except for the EIP register</td></tr>
<tr><td><code>HLT</code></td><td>Stops instruction execution and places the processor in a HALT state. An enabled interrupt, a debug exception, BINIT#, INIT# or RESET# will resume execution</td></tr>
<tr><td><code>WAIT</code></td><td>Causes the processor to repeatedly check for and handle pending, unmasked floating-point exceptions before proceeding</td></tr>
<tr><td><code>INT Nr</code></td><td>Interrupts the current program and runs the specified interrupt program</td></tr>
</table>
<p class="nhan">📐 <strong>(f) Input/Output.</strong></p>
<table>
<tr><th>Instruction</th><th>What the slide says</th><th>Direction / destination</th></tr>
<tr><td><code>IN Dest, Source</code></td><td>Copies data from the I/O port given by the source to the destination, which is a <em>register</em></td><td>port → register</td></tr>
<tr><td><code>INS Dest, Source</code></td><td>Copies data from the I/O port to a destination that is a <em>memory location</em></td><td>port → memory (string form)</td></tr>
<tr><td><code>OUT Dest, Source</code></td><td>Copies byte/word/doubleword from the source <em>register</em> to the I/O port given by the destination</td><td>register → port</td></tr>
<tr><td><code>XOR Dest, Source</code> <strong>(misprint — see warning)</strong></td><td>Copies byte/word/doubleword from the source operand to the I/O port given by the destination. The source operand is a <em>memory location</em></td><td>memory → port (string form)</td></tr>
</table>
<p class="pitfall">⚠️⚠️ <strong>The slide misprints the fourth I/O instruction.</strong> It is labelled <code>XOR Dest, Source</code>, but the description is unmistakably the string-output instruction <strong><code>OUTS</code></strong> (memory → I/O port). <code>XOR</code> is a logical instruction and already appears, correctly, in part (d) on slide 21. Read the row as <code>OUTS</code>; the four I/O instructions form two clean pairs: <code>IN</code>/<code>OUT</code> for registers and <code>INS</code>/<code>OUTS</code> for memory strings. Checked against the rendered original slide — the error is on the slide itself.</p>
<ul>
<li><strong><code>CALL</code> versus <code>JMP</code> is the whole slide in one comparison.</strong> Both change the PC. Only <code>CALL</code> <em>saves the return address on the stack first</em>, which is what makes <code>RET</code> possible and what makes procedures nest. A jump is one-way; a call is a round trip.</li>
<li><strong><code>CMP</code> + <code>Jcc</code> is the compiled form of every <code>if</code>.</strong> <code>CMP</code> (slide 20) sets the flags; <code>Jcc</code> reads them. One comparison can feed several different conditional jumps, which is exactly why x86 splits the work into two instructions instead of one "compare-and-branch".</li>
<li><strong><code>INT Nr</code> is the doorway to the operating system.</strong> A software interrupt switches to kernel mode and runs a handler — the classic mechanism for a system call (Ch.9). It is transfer of control across a privilege boundary, which is why it lives here and not with <code>CALL</code>.</li>
<li><strong><code>NOP</code> does nothing, usefully.</strong> It pads code so that a branch target lands on an aligned address, or it holds a place for a later patch. The slide's phrase "does not impact machine context, <em>except for the EIP register</em>" is precise: even doing nothing advances the program counter.</li>
<li><strong>Isolated I/O is what part (f) shows.</strong> These instructions exist because x86 has a <em>separate I/O address space</em> — port numbers, not memory addresses. On a memory-mapped machine (slide 4, area 2) you would need none of them; an ordinary <code>MOV</code> would do. Ch.8 covers both schemes properly.</li>
</ul>
<p class="meo">💡 Sort the eight control instructions into three buckets: <strong>go and come back</strong> (<code>CALL</code>, <code>RET</code>, <code>INT</code>), <strong>go and stay</strong> (<code>JMP</code>, <code>Jcc</code>), <strong>do not go anywhere</strong> (<code>NOP</code>, <code>HLT</code>, <code>WAIT</code>). Three buckets are far easier to recall than eight names.</p>`,
        `<p class="y-chinh">🎯 Hai góc phần tư cuối của slide 7. Phần (e) <strong>chuyển điều khiển</strong> — tám lệnh, những lệnh quyết định <em>LỆNH NÀO CHẠY TIẾP</em> — và phần (f) <strong>vào/ra</strong> — bốn lệnh.</p>
<p class="nhan">📐 <strong>(e) Transfer of Control — chuyển điều khiển.</strong></p>
<table>
<tr><th>Lệnh</th><th>Slide ghi gì</th></tr>
<tr><td><code>CALL proc</code></td><td>Lưu thông tin liên kết thủ tục lên NGĂN XẾP rồi rẽ nhánh tới thủ tục được toán hạng chỉ định. Toán hạng là địa chỉ lệnh đầu tiên của thủ tục được gọi</td></tr>
<tr><td><code>RET</code></td><td>Chuyển điều khiển tới địa chỉ trở về nằm trên ĐỈNH ngăn xếp. Trở về đúng lệnh <em>ĐỨNG SAU</em> lệnh CALL</td></tr>
<tr><td><code>JMP Dest</code></td><td>Chuyển điều khiển sang một điểm khác trong luồng lệnh, <strong>KHÔNG ghi lại thông tin trở về</strong></td></tr>
<tr><td><code>Jcc Dest</code></td><td>Kiểm trạng thái một hoặc nhiều cờ trạng thái trong EFLAGS (CF, OF, PF, SF, ZF) và nếu cờ đúng trạng thái đã nêu thì nhảy tới đích. Xem Table 13.8 và 13.9</td></tr>
<tr><td><code>NOP</code></td><td>Không làm gì cả. Là lệnh NOP một byte hoặc nhiều byte, chiếm chỗ trong luồng lệnh nhưng không ảnh hưởng ngữ cảnh máy, ngoại trừ thanh ghi EIP</td></tr>
<tr><td><code>HLT</code></td><td>Dừng thi hành lệnh và đưa bộ xử lý vào trạng thái HALT. Một ngắt đang bật, một ngoại lệ gỡ rối, tín hiệu BINIT#, INIT# hay RESET# sẽ làm nó chạy tiếp</td></tr>
<tr><td><code>WAIT</code></td><td>Khiến bộ xử lý kiểm tra và xử lý lặp đi lặp lại các ngoại lệ dấu phẩy động đang chờ, chưa bị che, trước khi đi tiếp</td></tr>
<tr><td><code>INT Nr</code></td><td>Ngắt chương trình hiện thời, chạy chương trình ngắt được chỉ định</td></tr>
</table>
<p class="nhan">📐 <strong>(f) Input/Output — vào/ra.</strong></p>
<table>
<tr><th>Lệnh</th><th>Slide ghi gì</th><th>Chiều / đích</th></tr>
<tr><td><code>IN Dest, Source</code></td><td>Chép dữ liệu từ cổng I/O do nguồn chỉ định vào đích, mà đích là một <em>THANH GHI</em></td><td>cổng → thanh ghi</td></tr>
<tr><td><code>INS Dest, Source</code></td><td>Chép dữ liệu từ cổng I/O vào đích, mà đích là một <em>Ô NHỚ</em></td><td>cổng → bộ nhớ (dạng chuỗi)</td></tr>
<tr><td><code>OUT Dest, Source</code></td><td>Chép byte/word/doubleword từ <em>THANH GHI</em> nguồn ra cổng I/O do đích chỉ định</td><td>thanh ghi → cổng</td></tr>
<tr><td><code>XOR Dest, Source</code> <strong>(IN SAI — xem cảnh báo)</strong></td><td>Chép byte/word/doubleword từ toán hạng nguồn ra cổng I/O do đích chỉ định. Toán hạng nguồn là một <em>Ô NHỚ</em></td><td>bộ nhớ → cổng (dạng chuỗi)</td></tr>
</table>
<p class="pitfall">⚠️⚠️ <strong>Slide IN SAI tên lệnh I/O thứ tư.</strong> Nó ghi <code>XOR Dest, Source</code>, nhưng phần mô tả rõ ràng là lệnh xuất chuỗi <strong><code>OUTS</code></strong> (bộ nhớ → cổng I/O). <code>XOR</code> là lệnh LOGIC và đã xuất hiện ĐÚNG CHỖ ở phần (d) slide 21. Hãy đọc dòng đó là <code>OUTS</code>; khi ấy bốn lệnh I/O thành hai cặp sạch sẽ: <code>IN</code>/<code>OUT</code> cho thanh ghi và <code>INS</code>/<code>OUTS</code> cho chuỗi trong bộ nhớ. Đã đối chiếu với ảnh slide gốc — lỗi nằm trên CHÍNH SLIDE.</p>
<ul>
<li><strong><code>CALL</code> khác <code>JMP</code> là cả slide gói trong một phép so.</strong> Cả hai đều đổi PC. Chỉ <code>CALL</code> mới <em>LƯU ĐỊA CHỈ TRỞ VỀ LÊN NGĂN XẾP TRƯỚC</em>, và chính điều đó làm <code>RET</code> khả thi và làm thủ tục LỒNG NHAU được. Nhảy là đường một chiều; gọi là đi và về.</li>
<li><strong><code>CMP</code> + <code>Jcc</code> là dạng biên dịch của MỌI câu <code>if</code>.</strong> <code>CMP</code> (slide 20) đặt cờ; <code>Jcc</code> đọc cờ. Một phép so sánh nuôi được nhiều lệnh nhảy có điều kiện khác nhau, và đó chính xác là lý do x86 tách việc ra hai lệnh thay vì một lệnh "so-và-nhảy".</li>
<li><strong><code>INT Nr</code> là cánh cửa dẫn vào hệ điều hành.</strong> Một ngắt mềm chuyển sang chế độ nhân và chạy một trình phục vụ — cơ chế kinh điển của một lời gọi hệ thống (Ch.9). Đó là chuyển điều khiển VƯỢT RANH GIỚI ĐẶC QUYỀN, nên nó nằm ở đây chứ không đứng chung với <code>CALL</code>.</li>
<li><strong><code>NOP</code> không làm gì, một cách hữu ích.</strong> Nó độn mã để một đích rẽ nhánh rơi vào địa chỉ đã căn lề, hoặc giữ chỗ cho một bản vá sau này. Cụm từ của slide "không ảnh hưởng ngữ cảnh máy, <em>ngoại trừ thanh ghi EIP</em>" là rất chính xác: ngay cả không làm gì thì bộ đếm chương trình vẫn tiến.</li>
<li><strong>Phần (f) cho thấy kiểu I/O TÁCH BIỆT (isolated I/O).</strong> Những lệnh này tồn tại vì x86 có một <em>KHÔNG GIAN ĐỊA CHỈ I/O RIÊNG</em> — số hiệu cổng, không phải địa chỉ bộ nhớ. Trên máy dùng I/O ánh xạ bộ nhớ (slide 4, vùng 2) thì bạn chẳng cần lệnh nào trong số đó; một lệnh <code>MOV</code> bình thường là xong. Ch.8 nói đủ cả hai lược đồ.</li>
</ul>
<p class="meo">💡 Xếp tám lệnh điều khiển vào ba rổ: <strong>đi RỒI VỀ</strong> (<code>CALL</code>, <code>RET</code>, <code>INT</code>), <strong>đi RỒI Ở LẠI</strong> (<code>JMP</code>, <code>Jcc</code>), <strong>KHÔNG đi đâu cả</strong> (<code>NOP</code>, <code>HLT</code>, <code>WAIT</code>). Ba cái rổ dễ nhớ hơn tám cái tên nhiều.</p>`],

      [23, 'Table 13.4 — Processor Actions for Various Types of Operations',
        `<p class="y-chinh">🎯 The bridge between "what the instruction promises" and "what the hardware must actually do". For each category of operation, the table lists the <strong>steps the processor performs</strong> — and reading it is the fastest way to understand why some instructions cost far more than others.</p>
<table>
<tr><th>Operation type</th><th>Processor actions (from the slide)</th></tr>
<tr><td><strong>Data transfer</strong></td><td>Transfer data from one location to another. <em>If memory is involved:</em> determine memory address · perform virtual-to-actual-memory address transformation · check cache · initiate memory read/write</td></tr>
<tr><td><strong>Arithmetic</strong></td><td>May involve data transfer, before and/or after · perform function in ALU · set condition codes and flags</td></tr>
<tr><td><strong>Logical</strong></td><td>Same as arithmetic</td></tr>
<tr><td><strong>Conversion</strong></td><td>Similar to arithmetic and logical. May involve special logic to perform conversion</td></tr>
<tr><td><strong>Transfer of control</strong></td><td>Update program counter. For subroutine call/return, manage parameter passing and linkage</td></tr>
<tr><td><strong>I/O</strong></td><td>Issue command to I/O module · if memory-mapped I/O, determine memory-mapped address</td></tr>
</table>
<ul>
<li><strong>The four sub-steps under "data transfer" are the whole memory half of this course, compressed.</strong> Determine the address → that is addressing modes (Ch.14). Virtual-to-actual transformation → that is the MMU and paging (Ch.9). Check cache → Ch.4/Ch.5. Initiate memory read/write → Ch.3's bus and Ch.6's DRAM timing. One "simple" MOV touches four chapters.</li>
<li><strong>"May involve data transfer, before and/or after" is why arithmetic is never just arithmetic.</strong> On a one-address machine, every ADD is really LOAD + add + (eventually) STOR — which is exactly the eight-instruction program of slide 8. The ALU work is the cheap part; moving the operands is the expensive part.</li>
<li><strong>"Set condition codes and flags" is listed as a processor <em>action</em>, not an optional extra.</strong> Every arithmetic and logical instruction updates the flags of slide 41 whether you look at them or not. That is what makes <code>CMP</code> + <code>Jcc</code> work, and also why an instruction inserted between them can silently break a comparison.</li>
<li><strong>Logical = "same as arithmetic" is a statement about hardware economy.</strong> AND, OR, XOR and ADD all run through the same ALU and set the same flags; only the function-select lines differ. Ch.12 (digital logic) built exactly such an ALU, and Ch.16 will show where it sits in the datapath.</li>
<li><strong>Transfer of control is the only row that mentions the PC.</strong> "Update program counter" — that is the whole mechanism. And the second clause, "manage parameter passing and linkage", is the stack-frame machinery of slides 37–39: the hardware does the jump, the calling convention does the rest.</li>
<li><strong>Conversion is the row students forget exists.</strong> It is a category in its own right in the chapter summary (slide 48) — instructions that change the <em>representation</em> of data (binary ↔ decimal, IRA ↔ packed decimal, one width to another) without changing its value. The slide says it needs "special logic", i.e. dedicated hardware.</li>
</ul>
<p class="meo">💡 Use this table as a cost ranking when an exam asks "which is faster?". Register-only arithmetic touches the ALU and nothing else. Memory arithmetic adds four steps. I/O adds a device. Transfer of control adds a possible pipeline flush (Ch.16). The ordering falls straight out of the rows.</p>`,
        `<p class="y-chinh">🎯 Cây cầu nối giữa "lệnh HỨA gì" và "phần cứng THỰC SỰ phải làm gì". Với mỗi loại thao tác, bảng liệt kê <strong>những bước bộ xử lý phải thực hiện</strong> — và đọc nó là cách nhanh nhất để hiểu vì sao có lệnh đắt hơn lệnh khác rất nhiều.</p>
<table>
<tr><th>Loại thao tác</th><th>Hành động của bộ xử lý (theo slide)</th></tr>
<tr><td><strong>Data transfer<br />(chuyển dữ liệu)</strong></td><td>Chuyển dữ liệu từ vị trí này sang vị trí khác. <em>Nếu có dính bộ nhớ:</em> xác định địa chỉ bộ nhớ · thực hiện phép biến đổi địa chỉ ảo sang địa chỉ thật · kiểm cache · khởi động phép đọc/ghi bộ nhớ</td></tr>
<tr><td><strong>Arithmetic<br />(số học)</strong></td><td>Có thể kèm chuyển dữ liệu, trước và/hoặc sau · thực hiện hàm trong ALU · đặt mã điều kiện và các cờ</td></tr>
<tr><td><strong>Logical (logic)</strong></td><td>Giống hệt số học</td></tr>
<tr><td><strong>Conversion<br />(chuyển đổi)</strong></td><td>Tương tự số học và logic. Có thể cần mạch logic ĐẶC BIỆT để thực hiện phép chuyển đổi</td></tr>
<tr><td><strong>Transfer of control<br />(chuyển điều khiển)</strong></td><td>Cập nhật bộ đếm chương trình. Với gọi/trở về chương trình con, quản lý việc truyền tham số và liên kết</td></tr>
<tr><td><strong>I/O (vào/ra)</strong></td><td>Phát lệnh tới mô-đun I/O · nếu là I/O ánh xạ bộ nhớ thì xác định địa chỉ ánh xạ</td></tr>
</table>
<ul>
<li><strong>Bốn bước con dưới "chuyển dữ liệu" chính là NỬA BỘ NHỚ của cả môn học, nén lại.</strong> Xác định địa chỉ → đó là chế độ địa chỉ (Ch.14). Biến đổi ảo sang thật → đó là MMU và phân trang (Ch.9). Kiểm cache → Ch.4/Ch.5. Khởi động đọc/ghi bộ nhớ → bus của Ch.3 và định thời DRAM của Ch.6. MỘT lệnh MOV "đơn giản" chạm vào bốn chương.</li>
<li><strong>"Có thể kèm chuyển dữ liệu, trước và/hoặc sau" là lý do số học không bao giờ chỉ là số học.</strong> Trên máy một địa chỉ, mỗi phép ADD thực chất là LOAD + cộng + (rốt cuộc) STOR — đúng là chương trình tám lệnh ở slide 8. Việc của ALU mới là phần RẺ; việc chuyển toán hạng mới là phần ĐẮT.</li>
<li><strong>"Đặt mã điều kiện và các cờ" được liệt kê như một HÀNH ĐỘNG của bộ xử lý, không phải phần thêm tuỳ chọn.</strong> Mọi lệnh số học và logic đều cập nhật các cờ ở slide 41, dù bạn có nhìn tới chúng hay không. Đó là thứ làm <code>CMP</code> + <code>Jcc</code> chạy được, và cũng là lý do một lệnh chèn vào giữa hai cái đó có thể phá hỏng phép so sánh trong im lặng.</li>
<li><strong>"Logic giống hệt số học" là một phát biểu về TÍNH KINH TẾ của phần cứng.</strong> AND, OR, XOR và ADD đều chạy qua CÙNG một ALU và đặt CÙNG các cờ; chỉ khác đường chọn hàm. Ch.12 (logic số) đã dựng đúng một ALU như vậy, và Ch.16 sẽ cho thấy nó nằm ở đâu trong đường dữ liệu.</li>
<li><strong>Chuyển điều khiển là dòng DUY NHẤT nhắc tới PC.</strong> "Cập nhật bộ đếm chương trình" — đó là toàn bộ cơ chế. Còn vế thứ hai, "quản lý truyền tham số và liên kết", chính là bộ máy khung ngăn xếp của slide 37–39: phần cứng lo cú nhảy, quy ước gọi hàm lo phần còn lại.</li>
<li><strong>Conversion là dòng sinh viên hay quên là có tồn tại.</strong> Nó là một nhóm riêng hẳn hoi trong phần tổng kết chương (slide 48) — những lệnh đổi <em>CÁCH BIỂU DIỄN</em> của dữ liệu (nhị phân ↔ thập phân, IRA ↔ thập phân nén, từ độ rộng này sang độ rộng khác) mà không đổi GIÁ TRỊ. Slide ghi nó cần "mạch logic đặc biệt", tức phần cứng chuyên dụng.</li>
</ul>
<p class="meo">💡 Dùng bảng này làm THANG CHI PHÍ khi đề hỏi "cái nào nhanh hơn?". Số học chỉ trên thanh ghi thì chạm ALU và không gì khác. Số học có bộ nhớ thì thêm bốn bước. I/O thì thêm cả một thiết bị. Chuyển điều khiển thì thêm nguy cơ xả sạch đường ống (Ch.16). Thứ tự rơi thẳng ra từ các dòng của bảng.</p>`],

      [24, 'Data Transfer — the most fundamental type of machine instruction',
        `<p class="y-chinh">🎯 The chapter turns from "what kinds of operation exist" to going through them one at a time, and it starts with the most fundamental: <strong>data transfer</strong>. Two arrows meeting: on the left, "most fundamental type of machine instruction"; on the right, the <strong>three things such an instruction must specify</strong>.</p>
<table>
<tr><th>#</th><th>A data transfer instruction must specify…</th><th>Why, and where it comes from</th></tr>
<tr><td>1</td><td><strong>The location of the source and destination operands</strong></td><td>Each is one of the four areas of slide 4 — memory, I/O, register, immediate (immediate can only be a source)</td></tr>
<tr><td>2</td><td><strong>The length of data to be transferred</strong></td><td>Byte, word, doubleword, quadword — the data types of slides 15 and 18</td></tr>
<tr><td>3</td><td><strong>The mode of addressing for each operand</strong></td><td>How the operand field names its location — the whole of Ch.14</td></tr>
</table>
<ul>
<li><strong>Why "most fundamental" is literally true.</strong> Data transfer is the only category that every other category depends on. Arithmetic needs its operands moved in (Table 13.4: "may involve data transfer, before and/or after"); control needs the return address pushed; I/O is transfer by definition. Remove data transfer and nothing else can run.</li>
<li><strong>Look at the three requirements as three separate opcode decisions.</strong> Real ISAs often encode them <em>into the opcode itself</em> rather than into extra fields — which is why IBM EAS/390 (slide 25) has <code>L</code>, <code>LH</code>, <code>LR</code>, <code>LE</code>, <code>LD</code>… a different mnemonic for every combination of length and location. x86 instead keeps one <code>MOV</code> and varies the operands. Two philosophies, same three requirements.</li>
<li><strong>Requirement 2 is where "how many bits does this instruction move?" comes from.</strong> An exam question that gives you a mnemonic like <code>LH</code> (load halfword) is testing exactly this: the opcode encodes the length, so 16 bits move, not 32.</li>
<li><strong>Requirement 3 is the hand-off to the next chapter.</strong> Everything about <em>how</em> an operand field names a location — direct, indirect, register, displacement, indexed, stack — has been deliberately postponed. This slide is where the chapter admits it, and Ch.14 (deck cea14) is where it is paid off.</li>
<li><strong>Connect to Table 13.4 (previous slide).</strong> Those three specifications are precisely what generates the four sub-steps "determine memory address · virtual-to-actual transformation · check cache · initiate read/write". The instruction says <em>what</em>; the processor actions say <em>how much work that costs</em>.</li>
</ul>
<p class="nhan">📐 <strong>Where this lesson stops.</strong> Slides 1–24 have covered: what an instruction contains · how it is represented · the four instruction types · the number of addresses (3/2/1/0, with the full worked comparison) · instruction set design issues · the operand types (numbers, characters, logical data, addresses) · x86 and ARM data types · endianness · and the x86 operation repertoire in three tables. Part B (slides 25–48) takes each operation category in turn — data transfer examples on the IBM EAS/390, arithmetic, the logical truth table, shift and rotate worked examples, conversion, I/O, system control, transfer of control (branch, skip, procedure call), nested procedures and stack frames, x86 status flags and condition codes, MMX, and ARM operation types.</p>
<p class="meo">💡 One sentence to carry out of part A: <strong>an instruction is an opcode plus a way of naming operands, and almost every design decision in the chapter is about how many operands to name and how loudly to name them.</strong> Three addresses is loud and short-programmed; zero addresses is silent and long-programmed; everything real sits in between.</p>`,
        `<p class="y-chinh">🎯 Chương chuyển từ "có những loại thao tác nào" sang đi qua từng loại một, và nó bắt đầu bằng loại nền tảng nhất: <strong>CHUYỂN DỮ LIỆU</strong>. Hai mũi tên đâm vào nhau: bên trái là "loại lệnh máy NỀN TẢNG NHẤT"; bên phải là <strong>ba thứ mà một lệnh như vậy BẮT BUỘC phải nêu rõ</strong>.</p>
<table>
<tr><th>#</th><th>Một lệnh chuyển dữ liệu phải nêu rõ…</th><th>Vì sao, và nó đến từ đâu</th></tr>
<tr><td>1</td><td><strong>VỊ TRÍ của toán hạng nguồn và toán hạng đích</strong></td><td>Mỗi cái là một trong bốn vùng ở slide 4 — bộ nhớ, I/O, thanh ghi, tức thời (tức thời chỉ làm NGUỒN được)</td></tr>
<tr><td>2</td><td><strong>ĐỘ DÀI dữ liệu cần chuyển</strong></td><td>Byte, word, doubleword, quadword — các kiểu dữ liệu ở slide 15 và 18</td></tr>
<tr><td>3</td><td><strong>CHẾ ĐỘ ĐỊA CHỈ cho từng toán hạng</strong></td><td>Trường toán hạng gọi tên vị trí bằng cách nào — trọn Ch.14</td></tr>
</table>
<ul>
<li><strong>Vì sao "nền tảng nhất" là đúng theo nghĩa đen.</strong> Chuyển dữ liệu là nhóm DUY NHẤT mà mọi nhóm khác đều phụ thuộc vào. Số học cần toán hạng được chuyển vào (Table 13.4: "có thể kèm chuyển dữ liệu, trước và/hoặc sau"); điều khiển cần địa chỉ trở về được đẩy lên ngăn xếp; I/O thì bản chất đã là chuyển. Bỏ chuyển dữ liệu đi là không gì khác chạy được nữa.</li>
<li><strong>Nhìn ba yêu cầu như BA quyết định mã hoá opcode.</strong> ISA thật thường nhét chúng <em>VÀO CHÍNH OPCODE</em> chứ không thêm trường riêng — vì thế IBM EAS/390 (slide 25) có <code>L</code>, <code>LH</code>, <code>LR</code>, <code>LE</code>, <code>LD</code>… mỗi tổ hợp độ dài và vị trí một mnemonic riêng. x86 thì ngược lại, giữ một lệnh <code>MOV</code> và thay đổi toán hạng. Hai triết lý, cùng ba yêu cầu.</li>
<li><strong>Yêu cầu 2 là nơi sinh ra câu hỏi "lệnh này chuyển bao nhiêu bit?".</strong> Đề đưa cho bạn một mnemonic như <code>LH</code> (load halfword) là đang kiểm đúng chỗ này: opcode đã mã hoá độ dài, nên 16 bit được chuyển, không phải 32.</li>
<li><strong>Yêu cầu 3 là cú chuyền bóng sang chương sau.</strong> Mọi chuyện về <em>CÁCH</em> một trường toán hạng gọi tên một vị trí — trực tiếp, gián tiếp, thanh ghi, độ dời, chỉ số, ngăn xếp — đều đã được CỐ TÌNH hoãn lại. Slide này là chỗ chương thừa nhận điều đó, và Ch.14 (deck cea14) là chỗ trả nợ.</li>
<li><strong>Nối với Table 13.4 (slide trước).</strong> Đúng ba thứ phải nêu rõ ấy là cái sinh ra bốn bước con "xác định địa chỉ bộ nhớ · biến đổi ảo sang thật · kiểm cache · khởi động đọc/ghi". Lệnh nói <em>CÁI GÌ</em>; danh sách hành động của bộ xử lý nói <em>VIỆC ĐÓ TỐN BAO NHIÊU</em>.</li>
</ul>
<p class="nhan">📐 <strong>Bài này dừng ở đâu.</strong> Slide 1–24 đã đi qua: một lệnh chứa những gì · lệnh được biểu diễn ra sao · bốn loại lệnh · số địa chỉ (3/2/1/0, có bảng so sánh giải trọn) · các vấn đề thiết kế tập lệnh · các kiểu toán hạng (số, ký tự, dữ liệu logic, địa chỉ) · kiểu dữ liệu của x86 và ARM · thứ tự byte · và bộ thao tác của x86 trong ba bảng. Phần B (slide 25–48) lấy từng nhóm thao tác ra nói kỹ — ví dụ chuyển dữ liệu trên IBM EAS/390, số học, bảng chân trị logic, ví dụ dịch và quay, chuyển đổi, vào/ra, điều khiển hệ thống, chuyển điều khiển (rẽ nhánh, bỏ qua, gọi thủ tục), thủ tục lồng nhau và khung ngăn xếp, cờ trạng thái và mã điều kiện x86, MMX, và các kiểu thao tác của ARM.</p>
<p class="meo">💡 Một câu mang ra khỏi phần A: <strong>một lệnh là một opcode cộng với một cách gọi tên toán hạng, và gần như mọi quyết định thiết kế trong chương này đều xoay quanh việc gọi tên BAO NHIÊU toán hạng và gọi TO đến mức nào.</strong> Ba địa chỉ thì gọi to, chương trình ngắn; không địa chỉ thì im lặng, chương trình dài; mọi máy có thật đều nằm ở khoảng giữa.</p>`],

    ]),
  ].join('\n'),
};
