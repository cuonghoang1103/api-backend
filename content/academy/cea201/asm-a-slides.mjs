/**
 * CEA201 · ASM.a — "Practical Assembly Language with MARIE" (buổi 39–44),
 * học theo từng slide: deck 'cea15' (CH15-COA11e.pptx), slide 1–19/37.
 *
 * ⚠️ LỆCH GIỮA SLIDE VÀ PHÒNG LAB — đọc trước khi sửa bài này.
 *   Deck Ch.15 của Stallings dạy hợp ngữ bằng **x86 + NASM**. Lịch học của
 *   trường lại xếp deck này vào cụm 6 buổi 39–44 "Practical Assembly Language",
 *   mà công cụ trường phát là **MARIE Simulator** (00_Tài liệu gốc FLM/
 *   CEA201_tool/MARIESimulator.zip + GuideMARIE.zip). Nên bài này dạy SONG
 *   SONG: mỗi khái niệm của slide (nhãn · mã lệnh · toán hạng · chú thích ·
 *   chỉ thị · macro · hợp dịch hai lượt) được nêu theo đúng chữ slide (x86/
 *   NASM) rồi chuyển ngay sang MARIE để sinh viên bấm máy làm được.
 *
 * ⚠️ SLIDE 1–19 KHÔNG CÓ "trình hợp dịch hai lượt" — nó nằm ở slide 25–28 của
 *   chính deck này (Types of assemblers, Figure 15.8 Flowchart of Two-Pass
 *   Assembler, One-Pass Assembler), tức phần ASM.b. Vì đề bài của cụm 39–44
 *   bắt buộc phải làm được bài hai lượt, bài này DẠY TRƯỚC ở slide 9 (Label) —
 *   đúng chỗ khái niệm "tham chiếu tới nhãn nằm phía sau" (forward reference)
 *   sinh ra — và ghi rõ đó là nội dung MƯỢN TỪ slide 26, không phải slide 9.
 *
 * ⚠️ MỌI bảng ký hiệu, mọi mã máy hex và mọi bảng vết trong bài đều KIỂM BẰNG
 *   MÁY, không gõ tay:
 *   · Bảng ký hiệu + mã máy: chạy CHÍNH trình hợp dịch của trường ở chế độ
 *     dòng lệnh — `java -cp MARIESimulator MarieSimulator.Assembler x.mas` —
 *     rồi chép nguyên cột địa chỉ/hex từ file .lst nó sinh ra.
 *   · Bảng vết thực thi: viết một máy MARIE bằng python3 bám ĐÚNG MarieSim.java
 *     (fetchNext → MAR←PC, IR←M[MAR], nếu lệnh cần toán hạng thì MAR←IR[11:0]
 *     và MBR←M[MAR], rồi PC←PC+1; jnS ghi PC vào M[MAR] rồi PC←MAR+1; skipCond
 *     so 2 bit 11-10; jump lấy thẳng IR&0x0FFF), nạp bộ nhớ TỪ file .lst thật.
 *     Kết quả: p1 → n = 9 · p2 → OUTPUT 6 · p3 → OUTPUT 45 · p4 → OUTPUT 20 ·
 *     p5 → X 20→40, Y 48→96. Khớp phép tính tay.
 *
 * Hai lỗi CÓ THẬT trong tài liệu gốc, nêu thẳng trong bài chứ không im lặng:
 *   · slide 19 liệt kê 6 thanh ghi tham số syscall là "EBX ECX EDX ESI EDI
 *     EDP" — x86 KHÔNG có thanh ghi EDP. Đúng phải là **EBP**, và chính
 *     Figure 15.3 ở slide 12 của cùng deck này in "EBP (101)".
 *   · `Ex4_1.mas` đi kèm MARIESimulator.zip **KHÔNG hợp dịch được**: dòng
 *     `Halt` thiếu toán hạng ⇒ "Missing operand. 1 error found." Phải viết
 *     `Halt 000`. Đã dựng lại và chạy: Sum = 100, đúng 10+15+20+25+30. Chú
 *     thích trong chính file đó cũng sai ("start at location 118" trong khi
 *     dữ liệu bắt đầu ở 117).
 *
 * Slide chỉ có tiêu đề + hình (3, 8, 12, 17) đã ĐỌC THẲNG ẢNH render
 * /tmp/cea201-slides/cea15/{003,008,012,017}.webp để lấy đúng từng nhãn.
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'cea15';

export default {
  title: 'ASM.a — Slide by slide: Assembly language — statement parts, directives and macros (slides 1–19)|||ASM.a — Slide bài giảng: Hợp ngữ — thành phần câu lệnh, chỉ thị & macro (slide 1–19)',
  slug: 'cea201-asm-a-slides-hop-ngu-chi-thi-macro',
  type: 'DOCUMENT',
  description: 'Nửa đầu Chương 15 (slide 1–19) — nền lý thuyết cho cụm 6 buổi thực hành 39–44 "Practical Assembly Language with MARIE" (CLO7, CLO10). Đi từ tám thuật ngữ gốc (assembler · compiler · linker · loader · object code · executable), qua bốn thành phần của một câu lệnh hợp ngữ (nhãn · mã lệnh · toán hạng · chú thích), tới chỉ thị/pseudo-instruction, macro và lời gọi hệ thống. Mỗi khái niệm được kéo thẳng sang MARIE Simulator mà trường phát: trọn bộ tập lệnh 13 mã, ba giá trị SKIPCOND, hai vòng lặp có bảng vết từng bước, một chương trình cộng dãy số bằng AddI, một chương trình con bằng JnS/JumpI, và bài hợp dịch HAI LƯỢT với bảng ký hiệu + bảng sinh mã hex. Toàn bộ số liệu chạy bằng chính trình hợp dịch của trường và một máy MARIE mô phỏng, không gõ tay.',
  content: [
    walkHead(D, 1, 19),
    walk(D, [

      [1, 'Chapter 15 — Assembly Language and Related Topics (title slide)',
        `<p class="y-chinh">🎯 The chapter where the course stops describing hardware and starts <strong>driving</strong> it. Everything before this was "what the processor is"; from here it is "what you type so the processor does something".</p>
<ul>
<li><strong>Where this sits in your timetable.</strong> This deck backs the six consecutive sessions <strong>39–44, "Practical Assembly Language"</strong> — the heaviest hands-on block of CEA201, assessed against <strong>CLO7</strong> and <strong>CLO10</strong>. It is not a reading chapter. You are expected to come out of it able to write, assemble, single-step and debug a program.</li>
<li><strong>Read this warning before anything else.</strong> Stallings teaches assembly through <strong>Intel x86 with the NASM assembler</strong> — that is what every slide from here to 24 shows. Your lab tool is different: the faculty ships the <strong>MARIE Simulator</strong> (<code>CEA201_tool/MARIESimulator.zip</code> plus <code>GuideMARIE.zip</code>). So this walkthrough runs two tracks in parallel: the slide's own words first, then the same idea rebuilt in MARIE so you can actually run it.</li>
<li><strong>Why that pairing is a gift, not a nuisance.</strong> x86 is realistic but enormous (hundreds of opcodes, eight registers, segments, prefixes). MARIE has <strong>13 instructions and one accumulator</strong>. The concepts are identical — label, mnemonic, operand, comment, directive, symbol table, two passes — so you learn the concept on the small machine and recognise it on the big one.</li>
<li><strong>What slides 1–19 cover (this lesson).</strong> The vocabulary (2), how a statement is built (3, 8–14), what directives are (14, 15, 18), what a macro is (16, 17), and how a program talks to the OS (19). Slides 20–37 (lesson ASM.b) then do worked x86 programs, string instructions, the <em>types of assemblers</em>, the <strong>two-pass assembler flowchart</strong> (Figure 15.8), and loading/linking/relocation.</li>
<li><strong>The one piece deliberately pulled forward.</strong> The <strong>two-pass assembler</strong> officially lives on slides 25–28. Exam questions and your lab both need it from day one, so this lesson teaches it at <strong>slide 9</strong>, the moment labels appear — because the reason two passes exist <em>is</em> the label you use before you define it.</li>
</ul>
<p class="meo">💡 One sentence to carry through the whole chapter: <strong>an assembler is a one-to-one translator with a dictionary</strong>. The one-to-one part is the mnemonic → opcode mapping. The dictionary is the symbol table. Every complication in this chapter is one of those two growing up.</p>`,
        `<p class="y-chinh">🎯 Chương mà môn học thôi MÔ TẢ phần cứng và bắt đầu <strong>ĐIỀU KHIỂN</strong> nó. Mọi thứ trước đây là "bộ xử lý LÀ cái gì"; từ đây là "gõ cái gì để bộ xử lý LÀM việc".</p>
<ul>
<li><strong>Nó nằm ở đâu trong lịch học của bạn.</strong> Deck này đỡ cho cụm sáu buổi liên tiếp <strong>39–44, "Practical Assembly Language"</strong> — khối thực hành nặng nhất của CEA201, chấm theo <strong>CLO7</strong> và <strong>CLO10</strong>. Đây KHÔNG phải chương để đọc. Ra khỏi cụm này bạn phải viết được, hợp dịch được, chạy từng bước được và gỡ lỗi được một chương trình.</li>
<li><strong>Đọc cảnh báo này trước mọi thứ khác.</strong> Stallings dạy hợp ngữ bằng <strong>Intel x86 với trình hợp dịch NASM</strong> — đó là thứ mọi slide từ đây tới 24 trưng ra. Công cụ lab của bạn thì khác: trường phát <strong>MARIE Simulator</strong> (<code>CEA201_tool/MARIESimulator.zip</code> và <code>GuideMARIE.zip</code>). Nên bài này chạy SONG SONG hai làn: chữ của slide trước, rồi dựng lại đúng ý đó bằng MARIE để bạn chạy được thật.</li>
<li><strong>Vì sao cặp đôi đó là MAY chứ không phải phiền.</strong> x86 thì thật nhưng khổng lồ (hàng trăm mã lệnh, tám thanh ghi, phân đoạn, tiền tố). MARIE có <strong>13 lệnh và một thanh ghi tích luỹ</strong>. Khái niệm thì y hệt nhau — nhãn, mã lệnh, toán hạng, chú thích, chỉ thị, bảng ký hiệu, hai lượt — nên bạn học khái niệm trên máy nhỏ rồi nhận ra nó trên máy lớn.</li>
<li><strong>Slide 1–19 (bài này) gồm gì.</strong> Bộ từ vựng (2), câu lệnh được dựng ra sao (3, 8–14), chỉ thị là gì (14, 15, 18), macro là gì (16, 17), và chương trình nói chuyện với hệ điều hành thế nào (19). Slide 20–37 (bài ASM.b) mới làm chương trình x86 đầy đủ, lệnh chuỗi, <em>các loại trình hợp dịch</em>, <strong>lưu đồ trình hợp dịch hai lượt</strong> (Figure 15.8), rồi nạp/liên kết/tái định vị.</li>
<li><strong>Một mảnh được kéo lên sớm có chủ ý.</strong> <strong>Trình hợp dịch HAI LƯỢT</strong> chính thức nằm ở slide 25–28. Nhưng đề thi và bài lab cần nó ngay từ buổi đầu, nên bài này dạy tại <strong>slide 9</strong>, đúng lúc nhãn xuất hiện — bởi vì lý do tồn tại của hai lượt CHÍNH LÀ cái nhãn bạn dùng trước khi định nghĩa.</li>
</ul>
<p class="meo">💡 Một câu mang theo suốt chương: <strong>trình hợp dịch là một cái máy dịch một-đối-một có kèm cuốn từ điển</strong>. Phần một-đối-một là ánh xạ mã gợi nhớ → mã lệnh. Cuốn từ điển là bảng ký hiệu. Mọi rắc rối trong chương này chỉ là một trong hai thứ đó lớn lên.</p>`],

      [2, 'Table 15.1 — Key Terms For This Chapter (assembler, assembly language, compiler, executable code, instruction set, linker, loader, machine language, object code)',
        `<p class="y-chinh">🎯 Eight definitions that the rest of the chapter assumes you already own. Learn them as a <strong>pipeline</strong>, not as eight isolated cards: source text → assembler → object code → linker → executable → loader → running program.</p>
<table>
<tr><th>Term</th><th>The slide's definition (condensed)</th><th>Where it is in your MARIE lab</th></tr>
<tr><td><strong>Assembly language</strong></td><td>A <em>symbolic</em> representation of the machine language of a specific processor, augmented by statements that ease writing and that instruct the assembler</td><td>The <code>.mas</code> file you type</td></tr>
<tr><td><strong>Assembler</strong></td><td>A program that translates assembly language into machine code</td><td><code>Assembler.java</code> in MARIESimulator — the editor's assemble option</td></tr>
<tr><td><strong>Machine language / machine code</strong></td><td>The <em>binary</em> representation actually read and interpreted by the computer; instructions may all be one size (e.g. 32-bit RISC words) or different sizes</td><td>The 16-bit words such as <code>110D</code>, shown in the <code>.lst</code> listing</td></tr>
<tr><td><strong>Object code</strong></td><td>The machine-language representation of source code, produced by a compiler or assembler, then turned into executable code by the linker</td><td>The <code>.mex</code> file</td></tr>
<tr><td><strong>Executable code</strong></td><td>Machine code in a form that can be run in the computer</td><td>Same <code>.mex</code> — MARIE is small enough not to need a separate link step</td></tr>
<tr><td><strong>Linker</strong></td><td>Combines one or more files of object code from separately compiled modules into a single loadable/executable file</td><td>Not present in MARIE; slides 30 and 34 cover it</td></tr>
<tr><td><strong>Loader</strong></td><td>A routine that copies an executable program into memory for execution</td><td><code>File | Load</code> in the simulator</td></tr>
<tr><td><strong>Instruction set</strong></td><td>The collection of all possible instructions a particular processor understands</td><td>MARIE's 13 opcodes — see slide 10</td></tr>
<tr><td><strong>Compiler</strong></td><td>Converts a source language to machine code; <em>distinguished from an assembler</em> by the fact that each input statement does <em>not</em> generally correspond to a single machine instruction</td><td>Your C compiler in PRF192</td></tr>
</table>
<ul>
<li><strong>The exam-critical line is the last one.</strong> The slide spells out precisely how a compiler differs from an assembler: <em>one input statement does not correspond to one machine instruction</em>. A compiler may also support automatic variable allocation, arbitrary arithmetic expressions, FOR/WHILE control structures, variable scope, I/O, higher-order functions and <strong>portability of source code</strong>. An assembler gives you none of those — and that list <em>is</em> the answer to "why is HLL better", which slide 5 then re-asks.</li>
<li><strong>Note what the slide says about compilers and assemblers together.</strong> "Some compilers output assembly language which is then converted to machine language by a separate assembler." That is exactly what <code>gcc -S</code> does. It also means assembly is not dead even when nobody writes it: it is the compiler's own output format.</li>
<li><strong>Object code versus executable code is a linking question.</strong> Object code still has holes in it — references to symbols defined in other modules. The linker fills the holes; only then is it executable. MARIE skips this because a MARIE program is always one file.</li>
<li><strong>Connect to CSI106 chapter 7.</strong> That course's three generations — machine language, assembly (symbolic) language, high-level language — are exactly the top three rows of this table. CEA201 adds the toolchain that moves between them.</li>
</ul>
<p class="pitfall">⚠️ Do not say "the assembler runs the program". The assembler only <em>translates</em> it. Translating, loading and executing are three different programs doing three different jobs, and an exam question that swaps two of them is the commonest trick in this chapter.</p>`,
        `<p class="y-chinh">🎯 Tám định nghĩa mà phần còn lại của chương mặc định bạn đã thuộc. Hãy học chúng thành một <strong>DÂY CHUYỀN</strong>, đừng học thành tám tấm thẻ rời: văn bản nguồn → trình hợp dịch → mã đối tượng → trình liên kết → tệp thực thi → trình nạp → chương trình đang chạy.</p>
<table>
<tr><th>Thuật ngữ</th><th>Định nghĩa của slide (rút gọn)</th><th>Nó ở đâu trong lab MARIE của bạn</th></tr>
<tr><td><strong>Assembly language</strong> (hợp ngữ)</td><td>Biểu diễn <em>KÝ HIỆU</em> của ngôn ngữ máy của MỘT bộ xử lý cụ thể, cộng thêm các câu lệnh giúp viết dễ hơn và ra lệnh cho chính trình hợp dịch</td><td>File <code>.mas</code> bạn gõ</td></tr>
<tr><td><strong>Assembler</strong> (trình hợp dịch)</td><td>Chương trình dịch hợp ngữ thành mã máy</td><td><code>Assembler.java</code> trong MARIESimulator — nút hợp dịch của trình soạn thảo</td></tr>
<tr><td><strong>Machine language</strong> (ngôn ngữ máy)</td><td>Biểu diễn <em>NHỊ PHÂN</em> mà máy tính thật sự đọc và diễn giải; lệnh có thể cùng cỡ (ví dụ một từ 32 bit của RISC) hoặc khác cỡ</td><td>Các từ 16 bit như <code>110D</code>, in trong file <code>.lst</code></td></tr>
<tr><td><strong>Object code</strong> (mã đối tượng)</td><td>Dạng ngôn ngữ máy của mã nguồn, do trình biên dịch hoặc hợp dịch tạo ra, rồi được trình liên kết biến thành mã thực thi</td><td>File <code>.mex</code></td></tr>
<tr><td><strong>Executable code</strong> (mã thực thi)</td><td>Mã máy ở dạng CHẠY ĐƯỢC trong máy tính</td><td>Cũng chính <code>.mex</code> — MARIE nhỏ tới mức không cần bước liên kết riêng</td></tr>
<tr><td><strong>Linker</strong> (trình liên kết)</td><td>Gộp một hay nhiều tệp mã đối tượng từ các mô-đun dịch riêng thành MỘT tệp nạp/chạy được</td><td>MARIE không có; slide 30 và 34 nói về nó</td></tr>
<tr><td><strong>Loader</strong> (trình nạp)</td><td>Thủ tục chép chương trình thực thi vào bộ nhớ để chạy</td><td><code>File | Load</code> trong trình mô phỏng</td></tr>
<tr><td><strong>Instruction set</strong> (tập lệnh)</td><td>Toàn bộ các lệnh mà một bộ xử lý cụ thể hiểu được</td><td>13 mã lệnh của MARIE — xem slide 10</td></tr>
<tr><td><strong>Compiler</strong> (trình biên dịch)</td><td>Chuyển ngôn ngữ nguồn thành mã máy; <em>PHÂN BIỆT với trình hợp dịch</em> ở chỗ mỗi câu lệnh vào KHÔNG tương ứng một lệnh máy duy nhất</td><td>Trình biên dịch C bạn dùng ở PRF192</td></tr>
</table>
<ul>
<li><strong>Dòng ăn điểm thi là dòng cuối.</strong> Slide nói rõ trình biên dịch khác trình hợp dịch ở đâu: <em>một câu lệnh vào KHÔNG tương ứng một lệnh máy</em>. Trình biên dịch còn có thể tự cấp phát biến, nhận biểu thức số học tuỳ ý, có FOR/WHILE, có phạm vi biến, có vào/ra, có hàm bậc cao và <strong>mã nguồn khả chuyển</strong>. Trình hợp dịch không cho bạn thứ nào trong đó — và chính danh sách ấy LÀ câu trả lời cho "vì sao ngôn ngữ bậc cao tốt hơn", thứ mà slide 5 hỏi lại.</li>
<li><strong>Để ý câu slide nói về hai thứ đi cùng nhau.</strong> "Một số trình biên dịch xuất ra HỢP NGỮ rồi mới có một trình hợp dịch riêng chuyển thành mã máy." Đó đúng là việc <code>gcc -S</code> làm. Nó cũng có nghĩa là hợp ngữ không chết dù không ai viết nó: nó là định dạng ĐẦU RA của chính trình biên dịch.</li>
<li><strong>Mã đối tượng khác mã thực thi ở chuyện LIÊN KẾT.</strong> Mã đối tượng còn LỖ — những tham chiếu tới ký hiệu định nghĩa ở mô-đun khác. Trình liên kết lấp lỗ; lấp xong mới chạy được. MARIE bỏ qua bước này vì một chương trình MARIE luôn nằm trong một tệp.</li>
<li><strong>Nối sang CSI106 chương 7.</strong> Ba thế hệ ngôn ngữ ở môn đó — ngôn ngữ máy, hợp ngữ (ký hiệu), ngôn ngữ bậc cao — chính là ba dòng đầu của bảng này. CEA201 bổ sung bộ công cụ để đi qua lại giữa chúng.</li>
</ul>
<p class="pitfall">⚠️ Đừng nói "trình hợp dịch CHẠY chương trình". Nó chỉ <em>DỊCH</em> thôi. Dịch, nạp và thi hành là ba chương trình khác nhau làm ba việc khác nhau, và câu hỏi thi tráo hai trong ba thứ đó là mẹo phổ biến nhất của chương này.</p>`],

      [3, 'Figure 15.1 — Programming the Statement n = i + j + k (four representations: binary, hexadecimal, symbolic, assembly)',
        `<p class="y-chinh">🎯 One tiny statement, <strong>four ways of writing it</strong>, side by side. This single figure is the whole argument for assembly language: the leftmost box and the rightmost box describe <em>the same bits</em>, but only one of them can be read by a human.</p>
<table>
<tr><th>(a) Binary program</th><th>(b) Hex</th><th>(c) Symbolic</th><th>(d) Assembly</th></tr>
<tr><td>101 · 0010 0010 1100 1001</td><td>101 · 22C9</td><td>101 · LDA 201</td><td>FORMUL · LDA · I</td></tr>
<tr><td>102 · 0001 0010 1100 1010</td><td>102 · 12CA</td><td>102 · ADD 202</td><td>· ADD · J</td></tr>
<tr><td>103 · 0001 0010 1100 1011</td><td>103 · 12CB</td><td>103 · ADD 203</td><td>· ADD · K</td></tr>
<tr><td>104 · 0011 0010 1100 1100</td><td>104 · 32CC</td><td>104 · STA 204</td><td>· STA · N</td></tr>
<tr><td>201 · 0000 0000 0000 0010</td><td>201 · 0002</td><td>201 · DAT 0002</td><td>I · DATA · 2</td></tr>
<tr><td>202 · 0000 0000 0000 0011</td><td>202 · 0003</td><td>202 · DAT 0003</td><td>J · DATA · 3</td></tr>
<tr><td>203 · 0000 0000 0000 0100</td><td>203 · 0004</td><td>203 · DAT 0004</td><td>K · DATA · 4</td></tr>
<tr><td>204 · 0000 0000 0000 0000</td><td>204 · 0000</td><td>204 · DAT 0000</td><td>N · DATA · 0</td></tr>
</table>
<ul>
<li><strong>Read the four columns as four things you stop having to do.</strong> (a)→(b): you stop writing bits. (b)→(c): you stop remembering that opcode 2 means "load" — the <em>mnemonic</em> does it. (c)→(d): you stop counting <em>addresses</em> — the <em>label</em> does it. Column (d) is the only one you could still edit next month.</li>
<li><strong>The deepest win is (c)→(d), and it is easy to undersell.</strong> In (c), inserting one instruction between 101 and 102 changes every address after it, so you must hand-patch every operand. In (d), you insert a line and re-assemble; the labels re-resolve themselves. <em>That</em> is why labels exist, and why an assembler needs a symbol table.</li>
<li><strong>Notice the data at the bottom.</strong> <code>DAT</code>/<code>DATA</code> is not an instruction the processor executes — it is a <strong>directive</strong> telling the assembler to place a value in memory. Slide 14 gives this its proper name: <em>pseudo-instruction</em>. Also notice the program sits at 101–104 and the data at 201–204: code and data are deliberately kept apart.</li>
<li><strong>Left column, decoded.</strong> <code>0010 0010 1100 1001</code> splits as opcode <code>0010</code> (= 2, "load") and operand <code>0010 1100 1001</code> = 2C9<sub>16</sub>. Wait — the address column says 201. The figure is writing addresses in <em>decimal</em> and contents in <em>binary/hex</em>: 2C9<sub>16</sub> = 713 and... it does not match 201 either. The clean reading is that the figure's address labels are illustrative; treat the four columns as showing <em>form</em>, not a consistent address map. Your MARIE lab gives you a version where every number does check out — below.</li>
</ul>
<p class="nhan">📐 <strong>The same program in MARIE, assembled by the faculty's own tool.</strong> Type this into the MARIE editor as <code>p1.mas</code>:</p>
<pre><code>        ORG 100
Formul, Load  I          / AC &lt;- i
        Add   J          / AC &lt;- AC + j
        Add   K          / AC &lt;- AC + k
        Store N          / n  &lt;- AC
        Halt  000
I,      Dec   2
J,      Dec   3
K,      Dec   4
N,      Dec   0</code></pre>
<p class="nhan">📐 What the assembler prints (columns copied verbatim from the generated <code>p1.lst</code>):</p>
<table>
<tr><th>Address</th><th>Machine code</th><th>Label</th><th>Instruction</th><th>How the hex is built</th></tr>
<tr><td>100</td><td><strong>1105</strong></td><td>Formul</td><td>LOAD I</td><td>opcode 1 (Load) · address 105 (= I)</td></tr>
<tr><td>101</td><td><strong>3106</strong></td><td></td><td>ADD J</td><td>opcode 3 (Add) · 106</td></tr>
<tr><td>102</td><td><strong>3107</strong></td><td></td><td>ADD K</td><td>opcode 3 · 107</td></tr>
<tr><td>103</td><td><strong>2108</strong></td><td></td><td>STORE N</td><td>opcode 2 (Store) · 108</td></tr>
<tr><td>104</td><td><strong>7000</strong></td><td></td><td>HALT 000</td><td>opcode 7, no operand</td></tr>
<tr><td>105–108</td><td>0002 0003 0004 0000</td><td>I J K N</td><td>DEC 2 / 3 / 4 / 0</td><td>data placed by a directive</td></tr>
</table>
<p class="dap-an">✅ Executed on a MARIE simulator written to match <code>MarieSim.java</code> exactly, the program takes <strong>5 steps</strong> and ends with <code>M[108] = 0009</code>, i.e. <strong>n = 2 + 3 + 4 = 9</strong>. Compare column by column with Figure 15.1: <code>1105</code> is the <em>same kind of object</em> as <code>22C9</code> — opcode nibble plus 12-bit address — and <code>Load I</code> is the same kind of object as <code>LDA I</code>. The textbook's abstract figure and your lab tool are the same machine.</p>`,
        `<p class="y-chinh">🎯 Một câu lệnh bé tí, <strong>bốn cách viết</strong>, đặt cạnh nhau. Riêng cái hình này đã là toàn bộ lý lẽ của hợp ngữ: ô ngoài cùng bên trái và ô ngoài cùng bên phải mô tả <em>CÙNG MỘT MỚ BIT</em>, nhưng chỉ một trong hai đọc được bằng mắt người.</p>
<table>
<tr><th>(a) Chương trình nhị phân</th><th>(b) Hex</th><th>(c) Ký hiệu</th><th>(d) Hợp ngữ</th></tr>
<tr><td>101 · 0010 0010 1100 1001</td><td>101 · 22C9</td><td>101 · LDA 201</td><td>FORMUL · LDA · I</td></tr>
<tr><td>102 · 0001 0010 1100 1010</td><td>102 · 12CA</td><td>102 · ADD 202</td><td>· ADD · J</td></tr>
<tr><td>103 · 0001 0010 1100 1011</td><td>103 · 12CB</td><td>103 · ADD 203</td><td>· ADD · K</td></tr>
<tr><td>104 · 0011 0010 1100 1100</td><td>104 · 32CC</td><td>104 · STA 204</td><td>· STA · N</td></tr>
<tr><td>201 · 0000 0000 0000 0010</td><td>201 · 0002</td><td>201 · DAT 0002</td><td>I · DATA · 2</td></tr>
<tr><td>202 · 0000 0000 0000 0011</td><td>202 · 0003</td><td>202 · DAT 0003</td><td>J · DATA · 3</td></tr>
<tr><td>203 · 0000 0000 0000 0100</td><td>203 · 0004</td><td>203 · DAT 0004</td><td>K · DATA · 4</td></tr>
<tr><td>204 · 0000 0000 0000 0000</td><td>204 · 0000</td><td>204 · DAT 0000</td><td>N · DATA · 0</td></tr>
</table>
<ul>
<li><strong>Đọc bốn cột như bốn việc bạn được THÔI không phải làm nữa.</strong> (a)→(b): thôi viết bit. (b)→(c): thôi phải nhớ mã lệnh 2 nghĩa là "nạp" — <em>mã gợi nhớ</em> lo. (c)→(d): thôi phải đếm <em>ĐỊA CHỈ</em> — <em>nhãn</em> lo. Cột (d) là cột duy nhất tháng sau bạn còn sửa được.</li>
<li><strong>Cái lợi sâu nhất là (c)→(d), và rất dễ bị coi nhẹ.</strong> Ở (c), chèn một lệnh vào giữa 101 và 102 là mọi địa chỉ phía sau đổi hết, nên phải vá tay từng toán hạng. Ở (d), bạn chèn một dòng rồi hợp dịch lại; nhãn tự giải quyết lại. <em>ĐÓ</em> là lý do nhãn tồn tại, và là lý do trình hợp dịch cần bảng ký hiệu.</li>
<li><strong>Để ý phần dữ liệu phía dưới.</strong> <code>DAT</code>/<code>DATA</code> không phải lệnh mà bộ xử lý thi hành — nó là <strong>CHỈ THỊ</strong> bảo trình hợp dịch đặt một giá trị vào bộ nhớ. Slide 14 gọi đúng tên nó: <em>pseudo-instruction</em>. Cũng để ý chương trình nằm ở 101–104 còn dữ liệu ở 201–204: mã và dữ liệu được cố ý để tách nhau.</li>
<li><strong>Giải mã cột trái.</strong> <code>0010 0010 1100 1001</code> tách thành mã lệnh <code>0010</code> (= 2, "load") và toán hạng <code>0010 1100 1001</code> = 2C9<sub>16</sub>. Khoan — cột địa chỉ ghi 201. Hình đang viết ĐỊA CHỈ theo hệ khác với NỘI DUNG, và 2C9<sub>16</sub> = 713 cũng không khớp 201. Cách đọc lành mạnh: nhãn địa chỉ trong hình chỉ mang tính minh hoạ; hãy coi bốn cột là trưng ra <em>HÌNH THỨC</em>, không phải một bản đồ địa chỉ nhất quán. Bài lab MARIE cho bạn một phiên bản mà MỌI con số đều kiểm được — ngay dưới đây.</li>
</ul>
<p class="nhan">📐 <strong>Cùng chương trình đó viết bằng MARIE, hợp dịch bằng chính công cụ của trường.</strong> Gõ vào trình soạn thảo MARIE, lưu thành <code>p1.mas</code>:</p>
<pre><code>        ORG 100
Formul, Load  I          / AC &lt;- i
        Add   J          / AC &lt;- AC + j
        Add   K          / AC &lt;- AC + k
        Store N          / n  &lt;- AC
        Halt  000
I,      Dec   2
J,      Dec   3
K,      Dec   4
N,      Dec   0</code></pre>
<p class="nhan">📐 Trình hợp dịch in ra (cột chép nguyên từ file <code>p1.lst</code> nó sinh ra):</p>
<table>
<tr><th>Địa chỉ</th><th>Mã máy</th><th>Nhãn</th><th>Lệnh</th><th>Hex ghép từ đâu</th></tr>
<tr><td>100</td><td><strong>1105</strong></td><td>Formul</td><td>LOAD I</td><td>mã lệnh 1 (Load) · địa chỉ 105 (= I)</td></tr>
<tr><td>101</td><td><strong>3106</strong></td><td></td><td>ADD J</td><td>mã lệnh 3 (Add) · 106</td></tr>
<tr><td>102</td><td><strong>3107</strong></td><td></td><td>ADD K</td><td>mã lệnh 3 · 107</td></tr>
<tr><td>103</td><td><strong>2108</strong></td><td></td><td>STORE N</td><td>mã lệnh 2 (Store) · 108</td></tr>
<tr><td>104</td><td><strong>7000</strong></td><td></td><td>HALT 000</td><td>mã lệnh 7, không toán hạng</td></tr>
<tr><td>105–108</td><td>0002 0003 0004 0000</td><td>I J K N</td><td>DEC 2 / 3 / 4 / 0</td><td>dữ liệu do chỉ thị đặt vào</td></tr>
</table>
<p class="dap-an">✅ Chạy trên một máy MARIE mô phỏng viết bám đúng <code>MarieSim.java</code>, chương trình đi hết <strong>5 bước</strong> và kết thúc với <code>M[108] = 0009</code>, tức <strong>n = 2 + 3 + 4 = 9</strong>. So từng cột với Figure 15.1: <code>1105</code> là <em>CÙNG MỘT LOẠI VẬT</em> với <code>22C9</code> — bốn bit mã lệnh cộng 12 bit địa chỉ — và <code>Load I</code> cùng loại với <code>LDA I</code>. Hình trừu tượng của sách và công cụ lab của bạn là cùng một cỗ máy.</p>`],

      [4, 'Motivation for Assembly Language Programming',
        `<p class="y-chinh">🎯 Five sentences that define what assembly language <em>is</em> by describing how close it sits to the metal. The last one is the reason this chapter is in a <em>computer architecture</em> course at all.</p>
<ul>
<li><strong>"One step away from machine language."</strong> Not two, not several. The only layer between your text and the bits is a lookup table plus some address arithmetic — which is why the whole chapter can explain the translator in two passes.</li>
<li><strong>"Typically each assembly language instruction is translated into <em>one</em> machine instruction."</strong> This is the formal difference from a compiler (slide 2). The word <em>typically</em> is doing careful work: macros (slide 16) and some pseudo-instructions break the one-to-one rule, which is exactly why they need separate slides.</li>
<li><strong>"Assembly language is hardware dependent, with a different assembly language for each type of processor."</strong> There is no such thing as "assembly language" in general — there is x86 assembly, ARM assembly, MARIE assembly. Your <code>.mas</code> file will never run on an x86, and an x86 <code>.asm</code> will never run in the simulator. Portability, the thing a compiler gives you for free, is the thing you surrender here.</li>
<li><strong>"Instructions can reference specific registers, include all the opcodes of the processor, and reflect the bit length of the registers and operands."</strong> Three separate leaks of hardware detail into the language. In MARIE they are: the single <strong>AC</strong>, the <strong>13 opcodes</strong>, and the <strong>16-bit word with a 12-bit address field</strong> — which is why MARIE memory stops at 4096 words (2<sup>12</sup>).</li>
<li><strong>"Therefore, an assembly language programmer must understand the computer's architecture."</strong> This is the sentence that justifies sessions 39–44 sitting at the <em>end</em> of the course rather than the start. You could not have written a MARIE program in week 1: you needed the instruction cycle (Ch.3), the instruction set (Ch.10/13), and the addressing modes (Ch.11/14) first.</li>
</ul>
<p class="meo">💡 A useful way to feel "one step away": the <em>number of machine instructions per line of source</em>. In MARIE it is 1. In C, one line such as <code>n = i + j + k;</code> becomes the four MARIE instructions of slide 3 — a ratio of 4. In a language with a garbage collector, one line can be thousands. The smaller the ratio, the more control you have and the more work you do.</p>
<p class="pitfall">⚠️ Trap: "assembly language is faster than C". Not automatically. Slide 5 says compilers have improved a lot; a modern compiler usually beats hand-written assembly except on the narrow cases slide 6 lists. What assembly guarantees is <strong>predictability and access</strong>, not speed.</p>`,
        `<p class="y-chinh">🎯 Năm câu định nghĩa hợp ngữ <em>LÀ GÌ</em> bằng cách mô tả nó nằm sát kim loại đến mức nào. Câu cuối là lý do chương này có mặt trong một môn <em>kiến trúc máy tính</em>.</p>
<ul>
<li><strong>"Cách ngôn ngữ máy MỘT bước."</strong> Không phải hai, không phải vài. Lớp duy nhất giữa chữ bạn gõ và mớ bit là một bảng tra cộng chút số học địa chỉ — chính vì thế cả chương này giải thích được cái máy dịch chỉ bằng hai lượt.</li>
<li><strong>"Thường thì mỗi lệnh hợp ngữ dịch ra MỘT lệnh máy."</strong> Đây là khác biệt hình thức so với trình biên dịch (slide 2). Chữ <em>THƯỜNG</em> đang làm việc rất cẩn thận: macro (slide 16) và một vài pseudo-instruction phá vỡ luật một-đối-một, và đó đúng là lý do chúng cần slide riêng.</li>
<li><strong>"Hợp ngữ PHỤ THUỘC PHẦN CỨNG, mỗi loại bộ xử lý một hợp ngữ khác nhau."</strong> Không có cái gọi là "hợp ngữ" nói chung — chỉ có hợp ngữ x86, hợp ngữ ARM, hợp ngữ MARIE. File <code>.mas</code> của bạn sẽ không bao giờ chạy trên x86, và một file <code>.asm</code> của x86 sẽ không bao giờ chạy trong trình mô phỏng. Tính khả chuyển, thứ trình biên dịch cho bạn miễn phí, là thứ bạn nộp lại ở đây.</li>
<li><strong>"Lệnh có thể tham chiếu thanh ghi cụ thể, gồm mọi mã lệnh của bộ xử lý, và phản ánh độ dài bit của thanh ghi lẫn toán hạng."</strong> Ba chỗ rò chi tiết phần cứng vào ngôn ngữ. Ở MARIE chúng là: một thanh ghi <strong>AC</strong> duy nhất, <strong>13 mã lệnh</strong>, và <strong>từ 16 bit với trường địa chỉ 12 bit</strong> — vì thế bộ nhớ MARIE dừng ở 4096 từ (2<sup>12</sup>).</li>
<li><strong>"Do đó, người lập trình hợp ngữ PHẢI hiểu kiến trúc máy tính."</strong> Đây là câu biện minh cho việc buổi 39–44 nằm ở CUỐI môn chứ không phải đầu. Tuần 1 bạn không thể viết nổi một chương trình MARIE: bạn cần chu trình lệnh (Ch.3), tập lệnh (Ch.10/13) và chế độ địa chỉ (Ch.11/14) trước đã.</li>
</ul>
<p class="meo">💡 Một cách cảm nhận "cách một bước": đếm <em>số lệnh máy trên mỗi dòng nguồn</em>. MARIE là 1. Trong C, một dòng như <code>n = i + j + k;</code> thành bốn lệnh MARIE của slide 3 — tỉ lệ 4. Trong ngôn ngữ có bộ dọn rác, một dòng có thể thành hàng nghìn. Tỉ lệ càng nhỏ, bạn càng nhiều quyền kiểm soát và càng nhiều việc phải làm.</p>
<p class="pitfall">⚠️ Bẫy: "hợp ngữ nhanh hơn C". KHÔNG tự động đúng. Slide 5 nói trình biên dịch đã tiến bộ rất nhiều; trình biên dịch hiện đại thường thắng hợp ngữ viết tay, trừ đúng mấy ca hẹp mà slide 6 kể. Thứ hợp ngữ bảo đảm là <strong>SỰ ĐOÁN ĐƯỢC và QUYỀN TRUY CẬP</strong>, không phải tốc độ.</p>`],

      [5, 'Assembly Language Programming (1 of 2) — Disadvantages',
        `<p class="y-chinh">🎯 The honest list. The slide's framing matters: these are the disadvantages of using assembly <strong>rather than an HLL</strong> — it is a comparison, not a verdict that assembly is bad.</p>
<table>
<tr><th>Disadvantage on the slide</th><th>What it costs you concretely</th></tr>
<tr><td><strong>Development time</strong></td><td>Slide 3 needed 4 instructions for one C statement. Scale that: a 500-line C program is thousands of assembly lines, each one a chance to be wrong</td></tr>
<tr><td><strong>Reliability and security</strong></td><td>No type checking, no bounds checking, no compiler warnings. Nothing stops <code>Store</code> writing over your own code</td></tr>
<tr><td><strong>Debugging and verifying</strong></td><td>Appears on <em>both</em> lists — see the note below</td></tr>
<tr><td><strong>Maintainability</strong></td><td>Six months later the intent is gone; only the mechanism is left. This is what comments (slide 13) exist to fight</td></tr>
<tr><td><strong>Portability</strong></td><td>The direct consequence of "hardware dependent" from slide 4 — a new processor means a rewrite, not a recompile</td></tr>
</table>
<ul>
<li><strong>The slide then lists three reasons the old excuses no longer hold.</strong> "System code can use <em>intrinsic functions</em> instead of assembly" · "Application code can use intrinsic functions or <em>vector classes</em> instead of assembly" · "<em>Compilers have been improved a lot</em> in recent years". An intrinsic is a function the compiler recognises and replaces with one specific machine instruction — so you get the instruction without leaving C.</li>
<li><strong>Read "Debugging and verifying" as the deliberate hinge of the pair of slides.</strong> It is the last item here and the <em>first</em> item on the advantages list. Both are true and they are about different activities: debugging <em>an assembly program you wrote</em> is painful (no symbols, no types, everything is a number), while <em>reading</em> the assembly a compiler produced is often the only way to find out what really happens.</li>
<li><strong>Reliability, made concrete in MARIE.</strong> MARIE will happily let you <code>Store</code> into address 103 — the middle of your own program — and then execute the number you just wrote as if it were an instruction. No warning, no crash message, just wrong behaviour. Every safety net you are used to lives in the language, and you just left the language.</li>
<li><strong>Portability, made concrete.</strong> Even between two <em>versions of the same simulator</em>: the fork shipped by your faculty changed <code>SKIPCOND</code> so the low 10 bits are a comparison operand (see slide 11). Code written for the original v1.2 still works, but code using the new form will not run elsewhere. Hardware dependence is not an abstract worry.</li>
</ul>
<p class="pitfall">⚠️ Exam wording trap: the question is usually "list the disadvantages of assembly language <strong>compared with a high-level language</strong>". Answer with the slide's five nouns — development time, reliability and security, debugging and verifying, maintainability, portability — not with a general rant about difficulty.</p>`,
        `<p class="y-chinh">🎯 Danh sách thành thật. Cách slide đóng khung là quan trọng: đây là nhược điểm của việc dùng hợp ngữ <strong>THAY CHO một ngôn ngữ bậc cao</strong> — là một phép so sánh, không phải phán quyết rằng hợp ngữ dở.</p>
<table>
<tr><th>Nhược điểm trên slide</th><th>Nó lấy đi của bạn cái gì, cụ thể</th></tr>
<tr><td><strong>Thời gian phát triển</strong></td><td>Slide 3 cần 4 lệnh cho MỘT câu lệnh C. Nhân lên: chương trình C 500 dòng là hàng nghìn dòng hợp ngữ, mỗi dòng là một cơ hội sai</td></tr>
<tr><td><strong>Độ tin cậy và bảo mật</strong></td><td>Không kiểm kiểu, không kiểm biên, không cảnh báo của trình biên dịch. Không gì ngăn <code>Store</code> ghi đè lên chính mã của bạn</td></tr>
<tr><td><strong>Gỡ lỗi và kiểm chứng</strong></td><td>Xuất hiện ở <em>CẢ HAI</em> danh sách — xem ghi chú bên dưới</td></tr>
<tr><td><strong>Khả năng bảo trì</strong></td><td>Sáu tháng sau, Ý ĐỊNH biến mất; chỉ còn lại CƠ CHẾ. Đây chính là thứ mà chú thích (slide 13) sinh ra để chống lại</td></tr>
<tr><td><strong>Tính khả chuyển</strong></td><td>Hệ quả trực tiếp của "phụ thuộc phần cứng" ở slide 4 — đổi bộ xử lý là viết lại, không phải biên dịch lại</td></tr>
</table>
<ul>
<li><strong>Rồi slide kể ba lý do khiến những cái cớ cũ không còn đứng được.</strong> "Mã hệ thống có thể dùng <em>hàm nội tại</em> (intrinsic) thay cho hợp ngữ" · "Mã ứng dụng có thể dùng hàm nội tại hoặc <em>lớp vector</em> thay cho hợp ngữ" · "<em>Trình biên dịch đã tiến bộ rất nhiều</em> những năm gần đây". Hàm nội tại là hàm mà trình biên dịch nhận ra và thay bằng đúng MỘT lệnh máy cụ thể — bạn có được lệnh đó mà không phải rời khỏi C.</li>
<li><strong>Đọc "Gỡ lỗi và kiểm chứng" như bản lề cố ý giữa hai slide.</strong> Nó là mục CUỐI ở đây và là mục <em>ĐẦU</em> trong danh sách ưu điểm. Cả hai đều đúng và nói về hai việc khác nhau: gỡ lỗi <em>một chương trình hợp ngữ bạn viết</em> thì cực (không ký hiệu, không kiểu, mọi thứ là số), còn <em>ĐỌC</em> hợp ngữ do trình biên dịch sinh ra lại thường là cách duy nhất biết được chuyện gì thật sự xảy ra.</li>
<li><strong>Độ tin cậy, cụ thể hoá bằng MARIE.</strong> MARIE sẵn lòng cho bạn <code>Store</code> vào địa chỉ 103 — giữa chính chương trình của bạn — rồi thi hành con số vừa ghi như thể nó là một lệnh. Không cảnh báo, không thông báo lỗi, chỉ chạy sai. Mọi tấm lưới an toàn bạn quen sống trong NGÔN NGỮ, mà bạn vừa bước ra khỏi ngôn ngữ.</li>
<li><strong>Tính khả chuyển, cụ thể hoá.</strong> Ngay cả giữa hai <em>phiên bản của cùng một trình mô phỏng</em>: bản fork trường phát đã đổi <code>SKIPCOND</code> để 10 bit thấp thành một toán hạng so sánh (xem slide 11). Mã viết cho bản v1.2 gốc vẫn chạy, nhưng mã dùng dạng mới sẽ không chạy ở nơi khác. Phụ thuộc phần cứng không phải nỗi lo trừu tượng.</li>
</ul>
<p class="pitfall">⚠️ Bẫy câu chữ đề thi: câu hỏi thường là "liệt kê nhược điểm của hợp ngữ <strong>SO VỚI ngôn ngữ bậc cao</strong>". Trả lời bằng đúng năm danh từ của slide — thời gian phát triển, độ tin cậy và bảo mật, gỡ lỗi và kiểm chứng, bảo trì, khả chuyển — chứ đừng than chung chung là khó.</p>`],

      [6, 'Assembly Language Programming (2 of 2) — Advantages',
        `<p class="y-chinh">🎯 The slide is careful with its own wording: these are advantages of the <strong>occasional use</strong> of assembly language. Nobody is proposing you write an application in it; the argument is that there are jobs no other tool can do.</p>
<table>
<tr><th>Advantage</th><th>Why only assembly can do it</th></tr>
<tr><td><strong>Debugging and verifying</strong></td><td>Reading the compiler's output is the only way to see what the machine will really execute</td></tr>
<tr><td><strong>Making compilers</strong></td><td>A compiler's back end <em>emits</em> assembly — you cannot write one without knowing the target language</td></tr>
<tr><td><strong>Embedded systems</strong></td><td>Tiny ROM, no OS, sometimes no C runtime at all</td></tr>
<tr><td><strong>Hardware drivers and system code</strong></td><td>Talking to a device means specific instructions on specific ports — C has no syntax for that</td></tr>
<tr><td><strong>Accessing instructions not accessible from a high-level language</strong></td><td>Atomic exchange, cache control, vector instructions, privileged instructions</td></tr>
<tr><td><strong>Self-modifying code</strong></td><td>A program writing its own instructions — impossible to express in C, trivial in assembly</td></tr>
<tr><td><strong>Optimizing code for size</strong></td><td>When the whole firmware must fit in 2 kB, every byte is hand-placed</td></tr>
<tr><td><strong>Optimizing code for speed</strong></td><td>The classic reason — now the <em>rarest</em> valid one, per slide 5</td></tr>
<tr><td><strong>Function libraries</strong></td><td>A hot routine (memcpy, a crypto core) written once, used by everything</td></tr>
<tr><td><strong>Making function libraries compatible with multiple compilers and operating systems</strong></td><td>Assembly is below the calling-convention differences, so one hand-written stub can serve them all</td></tr>
</table>
<ul>
<li><strong>Self-modifying code is the entry worth pausing on.</strong> It is possible only because of the stored-program idea from Chapter 1: instructions and data live in the same memory and are made of the same bits. In MARIE you can literally <code>Store</code> a computed value into an address the program will later execute. Modern systems mostly forbid it (pages are marked no-write or no-execute), which is why it appears here as a curiosity rather than a technique.</li>
<li><strong>"Accessing instructions not accessible from an HLL" is the most common real reason today.</strong> There is no C keyword for "flush this cache line" or "disable interrupts". Note the tension with slide 5, which says intrinsics now cover much of this — the honest position is that the list keeps shrinking, but never to zero.</li>
<li><strong>"Making compilers" closes the loop on slide 2.</strong> A compiler that outputs assembly needs a person who knows assembly to build it. This is why an architecture course teaches assembly even to students who will never ship it.</li>
<li><strong>MARIE's place on this list.</strong> None of the ten — it is a teaching machine, not a product. What it buys you is the <em>sixth</em> reason in disguise: you can watch the accumulator change, one instruction at a time, which is exactly the "debugging and verifying" skill that transfers to real work.</li>
</ul>
<p class="meo">💡 Compress the ten into three heads for recall: <strong>you must</strong> (embedded, drivers, unreachable instructions, self-modifying), <strong>you build tools</strong> (compilers, libraries, cross-compiler compatibility), <strong>you look</strong> (debugging, verifying, size, speed).</p>`,
        `<p class="y-chinh">🎯 Slide rất cẩn thận với chữ của nó: đây là ưu điểm của việc <strong>THỈNH THOẢNG dùng</strong> hợp ngữ. Không ai đề nghị bạn viết cả ứng dụng bằng nó; lập luận là CÓ những việc mà không công cụ nào khác làm được.</p>
<table>
<tr><th>Ưu điểm</th><th>Vì sao chỉ hợp ngữ làm được</th></tr>
<tr><td><strong>Gỡ lỗi và kiểm chứng</strong></td><td>Đọc đầu ra của trình biên dịch là cách DUY NHẤT thấy máy sẽ thi hành cái gì thật sự</td></tr>
<tr><td><strong>Làm trình biên dịch</strong></td><td>Phần sau của trình biên dịch <em>SINH RA</em> hợp ngữ — không biết ngôn ngữ đích thì không viết được</td></tr>
<tr><td><strong>Hệ thống nhúng</strong></td><td>ROM tí hon, không hệ điều hành, đôi khi không có cả thư viện chạy của C</td></tr>
<tr><td><strong>Trình điều khiển thiết bị và mã hệ thống</strong></td><td>Nói chuyện với thiết bị là lệnh cụ thể trên cổng cụ thể — C không có cú pháp cho việc đó</td></tr>
<tr><td><strong>Truy cập những lệnh ngôn ngữ bậc cao không với tới</strong></td><td>Trao đổi nguyên tử, điều khiển cache, lệnh vector, lệnh đặc quyền</td></tr>
<tr><td><strong>Mã tự sửa chính mình</strong></td><td>Chương trình tự ghi ra lệnh của mình — không diễn đạt nổi trong C, dễ như bỡn trong hợp ngữ</td></tr>
<tr><td><strong>Tối ưu theo KÍCH THƯỚC</strong></td><td>Khi cả phần sụn phải nhét vừa 2 kB thì từng byte được đặt bằng tay</td></tr>
<tr><td><strong>Tối ưu theo TỐC ĐỘ</strong></td><td>Lý do kinh điển — và nay là lý do chính đáng <em>HIẾM NHẤT</em>, theo slide 5</td></tr>
<tr><td><strong>Thư viện hàm</strong></td><td>Một thủ tục nóng (memcpy, lõi mã hoá) viết một lần, mọi thứ dùng chung</td></tr>
<tr><td><strong>Làm thư viện tương thích nhiều trình biên dịch và hệ điều hành</strong></td><td>Hợp ngữ nằm DƯỚI mọi khác biệt về quy ước gọi hàm, nên một đoạn viết tay phục vụ được tất cả</td></tr>
</table>
<ul>
<li><strong>Mã tự sửa chính mình là mục đáng dừng lại.</strong> Nó khả thi chỉ nhờ ý tưởng chương trình lưu trữ từ Chương 1: lệnh và dữ liệu sống chung một bộ nhớ và làm bằng cùng loại bit. Trong MARIE bạn có thể <code>Store</code> một giá trị tính được vào đúng ô mà chương trình sẽ thi hành sau đó. Hệ thống hiện đại phần lớn CẤM (trang được đánh dấu không-ghi hoặc không-thi-hành), nên ở đây nó xuất hiện như một điều lạ chứ không phải một kỹ thuật.</li>
<li><strong>"Truy cập lệnh mà ngôn ngữ bậc cao không với tới" là lý do thật phổ biến nhất hôm nay.</strong> Không có từ khoá C nào nghĩa là "xả dòng cache này" hay "cấm ngắt". Để ý mâu thuẫn với slide 5, nơi nói hàm nội tại nay phủ được phần lớn — lập trường thành thật là: danh sách này cứ teo dần, nhưng không bao giờ về không.</li>
<li><strong>"Làm trình biên dịch" khép vòng với slide 2.</strong> Một trình biên dịch xuất ra hợp ngữ thì cần người BIẾT hợp ngữ để dựng nó. Đó là lý do môn kiến trúc dạy hợp ngữ cho cả những sinh viên sẽ không bao giờ xuất xưởng một dòng nào.</li>
<li><strong>MARIE đứng ở đâu trong danh sách này.</strong> Không ở mục nào cả — nó là máy để dạy, không phải sản phẩm. Thứ nó mua cho bạn là lý do <em>THỨ SÁU</em> đội lốt: bạn nhìn được thanh ghi tích luỹ đổi giá trị, từng lệnh một, và đó đúng là kỹ năng "gỡ lỗi và kiểm chứng" sẽ theo bạn vào việc thật.</li>
</ul>
<p class="meo">💡 Nén mười mục thành ba đầu mục để nhớ: <strong>BẮT BUỘC phải dùng</strong> (nhúng, driver, lệnh không với tới, tự sửa mã), <strong>ĐANG LÀM CÔNG CỤ</strong> (trình biên dịch, thư viện, tương thích đa trình dịch), <strong>ĐỂ NHÌN</strong> (gỡ lỗi, kiểm chứng, kích thước, tốc độ).</p>`],

      [7, 'Assembly Language vs. Machine Language',
        `<p class="y-chinh">🎯 The slide opens by calling out a mistake: the two terms are "sometimes, <strong>erroneously</strong>, used synonymously". They are not synonyms, and the slide gives you two clean tests to tell them apart.</p>
<table>
<tr><th></th><th>Machine language</th><th>Assembly language</th></tr>
<tr><td><strong>What it is</strong></td><td>Instructions <em>directly executable by the processor</em></td><td>A symbolic notation that a program must translate first</td></tr>
<tr><td><strong>Form of one instruction</strong></td><td>A <em>binary string</em>: opcode, operand references, possibly other bits such as flags</td><td>Text: label, mnemonic, operands, comment</td></tr>
<tr><td><strong>Symbolic names</strong></td><td>Only as a convenience for <em>humans writing it down</em> — names for opcodes and registers</td><td>"Much greater use", including names for specific <strong>main memory locations</strong> and specific <strong>instruction locations</strong></td></tr>
<tr><td><strong>Non-executable statements</strong></td><td>None — every word is an instruction or data</td><td>Yes: statements that "serve as instructions to the assembler"</td></tr>
</table>
<ul>
<li><strong>Test 1 — can the processor eat it?</strong> Machine language: yes, directly. Assembly: no, something must translate it. This is the definitional line.</li>
<li><strong>Test 2 — does it contain things that are not instructions?</strong> This is the subtler and more examinable difference. Assembly contains <strong>directives</strong>, which produce no machine instruction at all (slide 14). Machine language cannot contain such a thing, because there is nobody left to read it.</li>
<li><strong>The middle row is where the confusion comes from, and the slide anticipates it.</strong> "For convenience, instead of writing an instruction as a bit string, it can be written <em>symbolically</em>, with names for opcodes and registers." So you can write machine language symbolically — <code>1105</code> as <code>LOAD 105</code> — and that still is <em>not</em> assembly language. Assembly is what you get when the symbols extend to <em>addresses you name yourself</em>: <code>LOAD I</code>.</li>
<li><strong>Figure 15.1 is this table drawn.</strong> Columns (a) and (b) are machine language (binary and hex are the same thing). Column (c) is machine language written symbolically — mnemonics, but still numeric addresses. Column (d) alone is assembly language, because <code>I</code>, <code>J</code>, <code>K</code>, <code>N</code>, <code>FORMUL</code> are names the programmer invented.</li>
<li><strong>In your lab this distinction is a file extension.</strong> <code>.mas</code> is assembly. <code>.mex</code> is machine code. <code>.lst</code> shows both side by side, which is why it is the single most useful file the assembler produces.</li>
</ul>
<p class="pitfall">⚠️ Common exam sentence to reject: "assembly language is executed by the CPU". Never. The CPU executes machine language only. What people mean by that sentence is "the machine code produced from the assembly is executed" — say it that way.</p>
<p class="meo">💡 Line to remember: <strong>mnemonics alone are still machine language; it becomes assembly language when you get to name the addresses.</strong></p>`,
        `<p class="y-chinh">🎯 Slide mở đầu bằng cách chỉ ra một lỗi: hai thuật ngữ này "đôi khi bị dùng lẫn lộn như đồng nghĩa, một cách <strong>SAI LẦM</strong>". Chúng không đồng nghĩa, và slide cho bạn hai phép thử sạch để phân biệt.</p>
<table>
<tr><th></th><th>Ngôn ngữ máy</th><th>Hợp ngữ</th></tr>
<tr><td><strong>Nó là gì</strong></td><td>Những lệnh <em>THI HÀNH TRỰC TIẾP ĐƯỢC bởi bộ xử lý</em></td><td>Một lối ghi ký hiệu mà phải có chương trình dịch trước đã</td></tr>
<tr><td><strong>Hình thức một lệnh</strong></td><td>Một <em>chuỗi nhị phân</em>: mã lệnh, tham chiếu toán hạng, có thể thêm bit khác như cờ</td><td>Chữ: nhãn, mã gợi nhớ, toán hạng, chú thích</td></tr>
<tr><td><strong>Tên ký hiệu</strong></td><td>Chỉ như tiện nghi cho <em>người ghi chép</em> — tên cho mã lệnh và thanh ghi</td><td>"Dùng nhiều hơn HẲN", gồm cả tên cho <strong>ô nhớ chính cụ thể</strong> và <strong>vị trí lệnh cụ thể</strong></td></tr>
<tr><td><strong>Câu lệnh KHÔNG thi hành được</strong></td><td>Không có — mỗi từ là lệnh hoặc dữ liệu</td><td>Có: những câu "đóng vai trò chỉ thị cho chính trình hợp dịch"</td></tr>
</table>
<ul>
<li><strong>Phép thử 1 — bộ xử lý ăn được không?</strong> Ngôn ngữ máy: có, trực tiếp. Hợp ngữ: không, phải có thứ gì đó dịch. Đây là ranh giới định nghĩa.</li>
<li><strong>Phép thử 2 — trong đó có thứ KHÔNG PHẢI lệnh không?</strong> Đây là khác biệt tinh tế hơn và hay ra thi hơn. Hợp ngữ chứa <strong>CHỈ THỊ</strong>, thứ không sinh ra lệnh máy nào cả (slide 14). Ngôn ngữ máy không thể chứa thứ như vậy, vì chẳng còn ai ở đó mà đọc.</li>
<li><strong>Dòng giữa là nguồn gốc của sự nhầm lẫn, và slide đã chặn trước.</strong> "Cho tiện, thay vì viết một lệnh thành chuỗi bit, có thể viết nó <em>bằng KÝ HIỆU</em>, với tên cho mã lệnh và thanh ghi." Nghĩa là bạn có thể viết NGÔN NGỮ MÁY bằng ký hiệu — <code>1105</code> thành <code>LOAD 105</code> — và nó vẫn <em>KHÔNG</em> phải hợp ngữ. Hợp ngữ là khi ký hiệu vươn tới cả <em>ĐỊA CHỈ DO BẠN TỰ ĐẶT TÊN</em>: <code>LOAD I</code>.</li>
<li><strong>Figure 15.1 chính là cái bảng này vẽ ra.</strong> Cột (a) và (b) là ngôn ngữ máy (nhị phân và hex là một thứ). Cột (c) là ngôn ngữ máy viết bằng ký hiệu — có mã gợi nhớ nhưng địa chỉ vẫn là số. Chỉ riêng cột (d) là hợp ngữ, vì <code>I</code>, <code>J</code>, <code>K</code>, <code>N</code>, <code>FORMUL</code> là tên người lập trình tự nghĩ ra.</li>
<li><strong>Trong lab của bạn, khác biệt này là phần mở rộng tệp.</strong> <code>.mas</code> là hợp ngữ. <code>.mex</code> là mã máy. <code>.lst</code> bày cả hai cạnh nhau, và vì thế nó là tệp hữu ích nhất mà trình hợp dịch sinh ra.</li>
</ul>
<p class="pitfall">⚠️ Câu thi hay gặp cần BÁC BỎ: "hợp ngữ được CPU thi hành". Không bao giờ. CPU chỉ thi hành ngôn ngữ máy. Ý người ta muốn nói là "mã máy sinh ra TỪ hợp ngữ được thi hành" — hãy nói đúng như vậy.</p>
<p class="meo">💡 Câu đáng nhớ: <strong>chỉ có mã gợi nhớ thôi thì vẫn là ngôn ngữ máy; nó thành hợp ngữ khi bạn được quyền ĐẶT TÊN cho địa chỉ.</strong></p>`],

      [8, 'Figure 15.2 — Assembly-Language Statement Structure (label: · mnemonic · operand(s) · ;comment)',
        `<p class="y-chinh">🎯 The four-field template every assembly statement in every assembly language obeys. Memorise this picture; slides 9 to 14 are simply one field each, expanded.</p>
<table>
<tr><th>Field</th><th>What the figure says under it</th><th>Detailed on</th></tr>
<tr><td><strong>label:</strong></td><td><em>optional</em></td><td>slide 9</td></tr>
<tr><td><strong>mnemonic</strong></td><td><em>opcode name</em> or <em>directive name</em> or <em>macro name</em></td><td>slides 10, 14, 16</td></tr>
<tr><td><strong>operand(s)</strong></td><td><em>zero or more</em></td><td>slide 11</td></tr>
<tr><td><strong>;comment</strong></td><td><em>optional</em></td><td>slide 13</td></tr>
</table>
<ul>
<li><strong>The mnemonic field is the one carrying the surprise.</strong> The figure says it can hold <em>three different species</em>: a real opcode name, a directive name, or a macro name. So you cannot tell from the shape of a line whether it produces one machine instruction, none, or many. That single fact is why the assembler needs a table of its own before it can even count addresses.</li>
<li><strong>Only the mnemonic is mandatory.</strong> Label optional, operands "zero or more", comment optional. A line may be nothing but a comment — and a line with a label must still carry an operator.</li>
<li><strong>The punctuation is a per-assembler convention, not a law.</strong> NASM/x86 uses a trailing colon for labels and a semicolon for comments. Your MARIE assembler uses a <strong>comma</strong> after the label and a <strong>slash</strong> for comments. Same four fields, different marks.</li>
</ul>
<table>
<tr><th>Field</th><th>NASM / x86 (the slide)</th><th>MARIE (your lab)</th></tr>
<tr><td>Label</td><td><code>start:</code> — trailing colon</td><td><code>Loop,</code> — trailing <strong>comma</strong></td></tr>
<tr><td>Mnemonic</td><td><code>mov</code>, <code>add</code>, <code>int</code></td><td><code>Load</code>, <code>Add</code>, <code>Skipcond</code> — case-insensitive</td></tr>
<tr><td>Operands</td><td>zero, one or two (<code>mov eax, 5</code>)</td><td>zero or <strong>exactly one</strong> — MARIE is a single-address machine</td></tr>
<tr><td>Comment</td><td><code>; like this</code></td><td><code>/ like this</code></td></tr>
</table>
<p class="nhan">📐 Straight from the MARIE editor's own help text: the source statement format is <code>[label,] operator [operand] [/comment]</code>, the label is comma-delimited and optional, comments are slash-delimited, blank lines are allowed, lines containing only a comment are allowed, and a labelled statement <strong>must</strong> contain an operator (plus an operand if that operator requires one).</p>
<p class="dap-an">✅ So the line <code>Loop,   Load  Ctr      / dem nguoc</code> decomposes as label = <code>Loop</code>, mnemonic = <code>Load</code>, operand = <code>Ctr</code>, comment = <code>dem nguoc</code>. Four fields, exactly as Figure 15.2 draws them.</p>
<p class="pitfall">⚠️ Two mistakes that cost lab marks. (1) Writing <code>Loop:</code> with a colon in a <code>.mas</code> file — MARIE wants a comma and will report an error. (2) Forgetting that a label must be attached to a real statement: a label on a line of its own is not accepted.</p>`,
        `<p class="y-chinh">🎯 Khuôn bốn trường mà mọi câu lệnh hợp ngữ, trong mọi hợp ngữ, đều tuân theo. Học thuộc bức hình này; slide 9 tới 14 chỉ đơn giản là mỗi slide mở rộng một trường.</p>
<table>
<tr><th>Trường</th><th>Hình ghi gì bên dưới</th><th>Nói kỹ ở</th></tr>
<tr><td><strong>label:</strong> (nhãn)</td><td><em>tuỳ chọn</em></td><td>slide 9</td></tr>
<tr><td><strong>mnemonic</strong> (mã gợi nhớ)</td><td><em>tên mã lệnh</em> hoặc <em>tên chỉ thị</em> hoặc <em>tên macro</em></td><td>slide 10, 14, 16</td></tr>
<tr><td><strong>operand(s)</strong> (toán hạng)</td><td><em>không hoặc nhiều</em></td><td>slide 11</td></tr>
<tr><td><strong>;comment</strong> (chú thích)</td><td><em>tuỳ chọn</em></td><td>slide 13</td></tr>
</table>
<ul>
<li><strong>Trường mã gợi nhớ mới là chỗ chứa bất ngờ.</strong> Hình nói nó có thể chứa <em>BA LOÀI khác nhau</em>: tên mã lệnh thật, tên chỉ thị, hoặc tên macro. Nghĩa là nhìn hình dạng một dòng thì KHÔNG biết được nó sinh ra một lệnh máy, không lệnh nào, hay nhiều lệnh. Riêng sự thật đó là lý do trình hợp dịch cần một cái bảng của riêng nó trước khi đếm nổi địa chỉ.</li>
<li><strong>Chỉ mã gợi nhớ là BẮT BUỘC.</strong> Nhãn tuỳ chọn, toán hạng "không hoặc nhiều", chú thích tuỳ chọn. Một dòng có thể chỉ gồm chú thích — còn dòng CÓ nhãn thì vẫn phải mang một toán tử.</li>
<li><strong>Dấu câu là quy ước của TỪNG trình hợp dịch, không phải luật.</strong> NASM/x86 dùng dấu hai chấm sau nhãn và dấu chấm phẩy cho chú thích. Trình hợp dịch MARIE của bạn dùng <strong>DẤU PHẨY</strong> sau nhãn và <strong>DẤU GẠCH CHÉO</strong> cho chú thích. Cùng bốn trường, khác dấu.</li>
</ul>
<table>
<tr><th>Trường</th><th>NASM / x86 (theo slide)</th><th>MARIE (lab của bạn)</th></tr>
<tr><td>Nhãn</td><td><code>start:</code> — dấu hai chấm cuối</td><td><code>Loop,</code> — <strong>DẤU PHẨY</strong> cuối</td></tr>
<tr><td>Mã gợi nhớ</td><td><code>mov</code>, <code>add</code>, <code>int</code></td><td><code>Load</code>, <code>Add</code>, <code>Skipcond</code> — không phân biệt hoa thường</td></tr>
<tr><td>Toán hạng</td><td>không, một hoặc hai (<code>mov eax, 5</code>)</td><td>không hoặc <strong>ĐÚNG MỘT</strong> — MARIE là máy một địa chỉ</td></tr>
<tr><td>Chú thích</td><td><code>; như thế này</code></td><td><code>/ như thế này</code></td></tr>
</table>
<p class="nhan">📐 Lấy thẳng từ trang trợ giúp của chính trình soạn thảo MARIE: khuôn câu lệnh nguồn là <code>[nhãn,] toán_tử [toán_hạng] [/chú thích]</code>, nhãn kết thúc bằng dấu phẩy và là tuỳ chọn, chú thích mở bằng dấu gạch chéo, cho phép dòng trống, cho phép dòng chỉ có chú thích, và một câu lệnh CÓ nhãn thì <strong>BẮT BUỘC</strong> phải có toán tử (kèm toán hạng nếu toán tử đó cần).</p>
<p class="dap-an">✅ Vậy dòng <code>Loop,   Load  Ctr      / dem nguoc</code> tách thành nhãn = <code>Loop</code>, mã gợi nhớ = <code>Load</code>, toán hạng = <code>Ctr</code>, chú thích = <code>dem nguoc</code>. Bốn trường, đúng như Figure 15.2 vẽ.</p>
<p class="pitfall">⚠️ Hai lỗi làm mất điểm lab. (1) Viết <code>Loop:</code> có dấu hai chấm trong file <code>.mas</code> — MARIE cần dấu phẩy và sẽ báo lỗi. (2) Quên rằng nhãn phải gắn vào một câu lệnh thật: nhãn đứng một mình trên một dòng là không được chấp nhận.</p>`],

      [9, 'Statements (1 of 3) — Label',
        `<p class="y-chinh">🎯 What a label <em>is</em>, in the slide's own words: <strong>"the assembler defines the label as equivalent to the address into which the first byte of the object code generated for that instruction will be loaded."</strong> A label is a name for an address. Nothing more, and nothing less.</p>
<ul>
<li><strong>The four claims the slide makes about labels.</strong> (1) If a label is present, the assembler binds it to the address of the first byte of that instruction's object code. (2) The programmer may then use the label <em>as an address or as data</em> in another instruction's address field. (3) The assembler <em>replaces the label with the assigned value</em> when creating the object program. (4) Labels are most frequently used in <strong>branch instructions</strong>.</li>
<li><strong>And three reasons to use them.</strong> A program location is easier to find and remember · code "can easily be moved to correct a program" · the programmer does not have to calculate relative or absolute memory addresses, but just uses labels as needed.</li>
<li><strong>Claim (3) is the entire job of the assembler's dictionary.</strong> "Replaces the label with the assigned value" is only possible if the assembler already <em>knows</em> the value. And that is where the trouble starts.</li>
</ul>
<p class="nhan">📐 <strong>THE FORWARD-REFERENCE PROBLEM — and why assemblers make two passes.</strong> (This topic belongs to slides 25–28 of this deck; it is taught here because it is born here, at the label.) Consider reading a source file top to bottom, one line at a time, assigning addresses as you go:</p>
<pre><code>        ORG 100
Loop,   Load     N          / line 1 -- N is not defined yet!
        Skipcond 800
        Jump     Done       / Done is not defined yet either!
        ...
Done,   Load     Sum        / ... it is defined HERE, much later
</code></pre>
<ul>
<li><strong>At the moment you translate <code>Jump Done</code> you do not know what <code>Done</code> is.</strong> A reference to a symbol that is defined <em>later</em> in the file is called a <strong>forward reference</strong>. A branch to the end of a loop is a forward reference, and every loop has one — so this is not a rare case, it is the normal case.</li>
<li><strong>Pass 1 solves it by refusing to generate code at all.</strong> It only walks the source with a <em>location counter</em> (LC), works out how much space each statement occupies, and records every label it meets in the <strong>symbol table</strong> with the LC value at that moment. It generates no machine code.</li>
<li><strong>Pass 2 then generates code with the complete dictionary in hand.</strong> Every symbol is now known, whether it was defined before or after its use, so every operand can be filled in.</li>
<li><strong>The one-pass alternative exists and is messier</strong> (slide 28): leave the operand field empty, record the symbol as undefined in the table, and keep a <em>list of forward references</em> per symbol to patch later. Two passes is simpler; that is why it is the standard.</li>
</ul>
<p class="nhan">📐 <strong>Worked example, end to end.</strong> Program <code>p2.mas</code> — read N from memory, add N + (N−1) + … + 1, print the sum. Written so that <em>four of its five symbols are forward references</em>:</p>
<pre><code>        ORG 100
Loop,   Load     N          / AC &lt;- N
        Skipcond 800        / AC &gt; 0 ?  then skip the next line
        Jump     Done       / AC &lt;= 0 : finished
        Load     Sum
        Add      N
        Store    Sum        / Sum &lt;- Sum + N
        Load     N
        Subt     One
        Store    N          / N &lt;- N - 1
        Jump     Loop
Done,   Load     Sum
        Output
        Halt     000
N,      Dec      3
Sum,    Dec      0
One,    Dec      1</code></pre>
<p class="nhan">📐 <strong>PASS 1 — the location counter walks, the symbol table fills.</strong> LC starts at 100 because of <code>ORG 100</code>; every MARIE statement occupies exactly one word, so LC increments by 1 each time:</p>
<table>
<tr><th>LC</th><th>Statement</th><th>Symbol defined here</th><th>Symbol table after this line</th></tr>
<tr><td>100</td><td>Loop, Load N</td><td><strong>Loop = 100</strong></td><td>Loop 100</td></tr>
<tr><td>101</td><td>Skipcond 800</td><td>—</td><td>Loop 100</td></tr>
<tr><td>102</td><td>Jump Done</td><td>—</td><td><em>Done still unknown — forward reference</em></td></tr>
<tr><td>103–109</td><td>Load Sum … Jump Loop</td><td>—</td><td>unchanged</td></tr>
<tr><td>10A</td><td>Done, Load Sum</td><td><strong>Done = 10A</strong></td><td>Loop 100 · Done 10A</td></tr>
<tr><td>10B–10C</td><td>Output · Halt 000</td><td>—</td><td>unchanged</td></tr>
<tr><td>10D</td><td>N, Dec 3</td><td><strong>N = 10D</strong></td><td>… N 10D</td></tr>
<tr><td>10E</td><td>Sum, Dec 0</td><td><strong>Sum = 10E</strong></td><td>… Sum 10E</td></tr>
<tr><td>10F</td><td>One, Dec 1</td><td><strong>One = 10F</strong></td><td>… One 10F</td></tr>
</table>
<p class="nhan">📐 <strong>The finished symbol table</strong> — this block is copied verbatim from the SYMBOL TABLE section the faculty's assembler printed into <code>p2.lst</code>, including its "References" column, which is just the list of addresses whose operand field had to be patched with this symbol:</p>
<table>
<tr><th>Symbol</th><th>Defined at</th><th>Referenced from</th><th>Forward reference?</th></tr>
<tr><td>Done</td><td>10A</td><td>102</td><td><strong>YES</strong> — used at 102, defined at 10A</td></tr>
<tr><td>Loop</td><td>100</td><td>109</td><td>no — backward reference</td></tr>
<tr><td>N</td><td>10D</td><td>100, 104, 106, 108</td><td><strong>YES</strong> ×4</td></tr>
<tr><td>One</td><td>10F</td><td>107</td><td><strong>YES</strong></td></tr>
<tr><td>Sum</td><td>10E</td><td>103, 105, 10A</td><td><strong>YES</strong> ×3</td></tr>
</table>
<p class="nhan">📐 <strong>PASS 2 — generate the code.</strong> Each word = one hex digit of opcode + three hex digits of address, the address looked up in the table above:</p>
<table>
<tr><th>Address</th><th>Label</th><th>Instruction</th><th>Machine code</th><th>Opcode · operand</th></tr>
<tr><td>100</td><td>Loop</td><td>LOAD N</td><td><strong>110D</strong></td><td>1 · 10D</td></tr>
<tr><td>101</td><td></td><td>SKIPCOND 800</td><td><strong>8800</strong></td><td>8 · 800 (a condition, not an address)</td></tr>
<tr><td>102</td><td></td><td>JUMP Done</td><td><strong>910A</strong></td><td>9 · 10A ← the forward reference, resolved</td></tr>
<tr><td>103</td><td></td><td>LOAD Sum</td><td><strong>110E</strong></td><td>1 · 10E</td></tr>
<tr><td>104</td><td></td><td>ADD N</td><td><strong>310D</strong></td><td>3 · 10D</td></tr>
<tr><td>105</td><td></td><td>STORE Sum</td><td><strong>210E</strong></td><td>2 · 10E</td></tr>
<tr><td>106</td><td></td><td>LOAD N</td><td><strong>110D</strong></td><td>1 · 10D</td></tr>
<tr><td>107</td><td></td><td>SUBT One</td><td><strong>410F</strong></td><td>4 · 10F</td></tr>
<tr><td>108</td><td></td><td>STORE N</td><td><strong>210D</strong></td><td>2 · 10D</td></tr>
<tr><td>109</td><td></td><td>JUMP Loop</td><td><strong>9100</strong></td><td>9 · 100 ← backward reference</td></tr>
<tr><td>10A</td><td>Done</td><td>LOAD Sum</td><td><strong>110E</strong></td><td>1 · 10E</td></tr>
<tr><td>10B</td><td></td><td>OUTPUT</td><td><strong>6000</strong></td><td>6 · no operand</td></tr>
<tr><td>10C</td><td></td><td>HALT 000</td><td><strong>7000</strong></td><td>7 · no operand</td></tr>
<tr><td>10D</td><td>N</td><td>DEC 3</td><td><strong>0003</strong></td><td>data, not an instruction</td></tr>
<tr><td>10E</td><td>Sum</td><td>DEC 0</td><td><strong>0000</strong></td><td>data</td></tr>
<tr><td>10F</td><td>One</td><td>DEC 1</td><td><strong>0001</strong></td><td>data</td></tr>
</table>
<p class="dap-an">✅ Both tables were produced by running the faculty's own assembler from the command line (<code>java -cp MARIESimulator MarieSimulator.Assembler p2.mas</code>) and copying the columns out of <code>p2.lst</code> — not written by hand. And the assembler really is two-pass: its source comments say so ("this assembler works in two passes over the source code… the first pass… creates an intermediate workfile… the second pass… supplies addresses"), and the methods are literally named <code>performFirstPass()</code> and <code>performSecondPass()</code>.</p>
<p class="nhan">📐 <strong>Execution trace, produced by a MARIE simulator matching <code>MarieSim.java</code> instruction by instruction.</strong> 33 steps, N = 3. AC is shown <em>after</em> the instruction completes:</p>
<table>
<tr><th>#</th><th>PC</th><th>Instruction</th><th>AC</th><th>MAR</th><th>MBR</th><th>next PC</th><th>Memory changed</th></tr>
<tr><td>1</td><td>100</td><td>LOAD N</td><td>3</td><td>10D</td><td>0003</td><td>101</td><td></td></tr>
<tr><td>2</td><td>101</td><td>SKIPCOND 800</td><td>3</td><td>101</td><td>0003</td><td><strong>103</strong></td><td>AC &gt; 0 → skipped 102</td></tr>
<tr><td>3</td><td>103</td><td>LOAD Sum</td><td>0</td><td>10E</td><td>0000</td><td>104</td><td></td></tr>
<tr><td>4</td><td>104</td><td>ADD N</td><td>3</td><td>10D</td><td>0003</td><td>105</td><td></td></tr>
<tr><td>5</td><td>105</td><td>STORE Sum</td><td>3</td><td>10E</td><td>0003</td><td>106</td><td>M[10E] = 0003</td></tr>
<tr><td>6</td><td>106</td><td>LOAD N</td><td>3</td><td>10D</td><td>0003</td><td>107</td><td></td></tr>
<tr><td>7</td><td>107</td><td>SUBT One</td><td>2</td><td>10F</td><td>0001</td><td>108</td><td></td></tr>
<tr><td>8</td><td>108</td><td>STORE N</td><td>2</td><td>10D</td><td>0002</td><td>109</td><td>M[10D] = 0002</td></tr>
<tr><td>9</td><td>109</td><td>JUMP Loop</td><td>2</td><td>109</td><td>0002</td><td><strong>100</strong></td><td></td></tr>
<tr><td>10</td><td>100</td><td>LOAD N</td><td>2</td><td>10D</td><td>0002</td><td>101</td><td></td></tr>
<tr><td>11</td><td>101</td><td>SKIPCOND 800</td><td>2</td><td>101</td><td>0002</td><td>103</td><td>skipped</td></tr>
<tr><td>12–18</td><td>103…109</td><td>second pass of the body</td><td>→ 1</td><td></td><td></td><td>100</td><td>M[10E] = 0005 · M[10D] = 0001</td></tr>
<tr><td>19</td><td>100</td><td>LOAD N</td><td>1</td><td>10D</td><td>0001</td><td>101</td><td></td></tr>
<tr><td>20</td><td>101</td><td>SKIPCOND 800</td><td>1</td><td>101</td><td>0001</td><td>103</td><td>skipped</td></tr>
<tr><td>21–27</td><td>103…109</td><td>third pass of the body</td><td>→ 0</td><td></td><td></td><td>100</td><td>M[10E] = 0006 · M[10D] = 0000</td></tr>
<tr><td>28</td><td>100</td><td>LOAD N</td><td><strong>0</strong></td><td>10D</td><td>0000</td><td>101</td><td></td></tr>
<tr><td>29</td><td>101</td><td>SKIPCOND 800</td><td>0</td><td>101</td><td>0000</td><td><strong>102</strong></td><td>AC not &gt; 0 → <em>no</em> skip</td></tr>
<tr><td>30</td><td>102</td><td>JUMP Done</td><td>0</td><td>102</td><td>0000</td><td><strong>10A</strong></td><td></td></tr>
<tr><td>31</td><td>10A</td><td>LOAD Sum</td><td>6</td><td>10E</td><td>0006</td><td>10B</td><td></td></tr>
<tr><td>32</td><td>10B</td><td>OUTPUT</td><td>6</td><td>10B</td><td>0006</td><td>10C</td><td>prints <strong>6</strong></td></tr>
<tr><td>33</td><td>10C</td><td>HALT 000</td><td>6</td><td>10C</td><td>0006</td><td>—</td><td>stops</td></tr>
</table>
<p class="dap-an">✅ Output = <strong>6</strong> = 3 + 2 + 1. Note rows 29–30: the <em>only</em> time <code>Jump Done</code> at 102 ever executes is the single pass where AC = 0. Every other time, <code>SKIPCOND 800</code> jumps over it. That is how a loop terminates on this machine.</p>
<p class="pitfall">⚠️ Three label mistakes that break the lab. (1) <strong>Two statements with the same label</strong> — the assembler reports a duplicate symbol and the whole assembly fails. (2) <strong>Referencing a label you never defined</strong> — pass 2 finds an undefined symbol; the error appears at the <em>use</em> site, which is not where the mistake is. (3) <strong>A label on a data line versus a code line looks identical</strong> — <code>N, Dec 3</code> and <code>Loop, Load N</code> both just name an address, so nothing stops you writing <code>Jump N</code> and executing your data. MARIE will try, and the result is nonsense with no error message.</p>`,
        `<p class="y-chinh">🎯 Nhãn <em>LÀ GÌ</em>, theo đúng chữ của slide: <strong>"trình hợp dịch định nghĩa nhãn tương đương với ĐỊA CHỈ mà byte đầu tiên của mã đối tượng sinh ra cho lệnh đó sẽ được nạp vào."</strong> Nhãn là một cái TÊN cho một ĐỊA CHỈ. Không hơn, không kém.</p>
<ul>
<li><strong>Bốn điều slide khẳng định về nhãn.</strong> (1) Có nhãn thì trình hợp dịch gắn nó với địa chỉ byte đầu của mã đối tượng của lệnh đó. (2) Người lập trình sau đó có thể dùng nhãn <em>NHƯ MỘT ĐỊA CHỈ hoặc NHƯ DỮ LIỆU</em> trong trường địa chỉ của lệnh khác. (3) Trình hợp dịch <em>THAY nhãn bằng giá trị đã gán</em> khi tạo chương trình đối tượng. (4) Nhãn được dùng nhiều nhất trong <strong>lệnh rẽ nhánh</strong>.</li>
<li><strong>Và ba lý do nên dùng chúng.</strong> Một vị trí trong chương trình dễ tìm và dễ nhớ hơn · mã "dễ dàng dịch chuyển để sửa chương trình" · người lập trình không phải tự tính địa chỉ tương đối hay tuyệt đối, chỉ cần dùng nhãn khi cần.</li>
<li><strong>Khẳng định (3) chính là toàn bộ công việc của cuốn từ điển trong trình hợp dịch.</strong> "Thay nhãn bằng giá trị đã gán" chỉ làm được nếu trình hợp dịch ĐÃ BIẾT giá trị đó. Và rắc rối bắt đầu từ đây.</li>
</ul>
<p class="nhan">📐 <strong>BÀI TOÁN THAM CHIẾU VỀ PHÍA TRƯỚC — và vì sao trình hợp dịch phải chạy HAI LƯỢT.</strong> (Chủ đề này thuộc slide 25–28 của chính deck này; dạy ở đây vì nó SINH RA ở đây, tại cái nhãn.) Hãy thử đọc file nguồn từ trên xuống, mỗi lần một dòng, vừa đọc vừa gán địa chỉ:</p>
<pre><code>        ORG 100
Loop,   Load     N          / dong 1 -- N CHUA duoc dinh nghia!
        Skipcond 800
        Jump     Done       / Done cung CHUA duoc dinh nghia!
        ...
Done,   Load     Sum        / ... no duoc dinh nghia O DAY, tan duoi
</code></pre>
<ul>
<li><strong>Đúng lúc bạn dịch <code>Jump Done</code>, bạn không biết <code>Done</code> là gì.</strong> Tham chiếu tới một ký hiệu được định nghĩa <em>SAU ĐÓ</em> trong tệp gọi là <strong>forward reference</strong> (tham chiếu về phía trước). Nhảy tới cuối vòng lặp là một forward reference, và MỌI vòng lặp đều có một cái — nên đây không phải ca hiếm, đây là ca thường.</li>
<li><strong>Lượt 1 giải quyết bằng cách TỪ CHỐI sinh mã.</strong> Nó chỉ đi dọc mã nguồn với một <em>bộ đếm vị trí</em> (location counter, LC), tính xem mỗi câu lệnh chiếm bao nhiêu chỗ, và ghi MỌI nhãn gặp được vào <strong>BẢNG KÝ HIỆU</strong> kèm giá trị LC ngay lúc đó. Nó không sinh mã máy nào.</li>
<li><strong>Lượt 2 mới sinh mã, với cuốn từ điển đã đầy đủ trong tay.</strong> Mọi ký hiệu giờ đều đã biết, dù được định nghĩa trước hay sau chỗ dùng, nên mọi toán hạng đều điền được.</li>
<li><strong>Cách một lượt cũng tồn tại và lôi thôi hơn</strong> (slide 28): để trống trường toán hạng, ghi ký hiệu vào bảng và đánh dấu chưa định nghĩa, rồi giữ một <em>danh sách các forward reference</em> của từng ký hiệu để vá sau. Hai lượt đơn giản hơn; vì thế nó là chuẩn.</li>
</ul>
<p class="nhan">📐 <strong>Ví dụ giải trọn, từ đầu tới cuối.</strong> Chương trình <code>p2.mas</code> — đọc N trong bộ nhớ, cộng N + (N−1) + … + 1, in tổng. Viết sao cho <em>bốn trong năm ký hiệu là forward reference</em>:</p>
<pre><code>        ORG 100
Loop,   Load     N          / AC &lt;- N
        Skipcond 800        / AC &gt; 0 ?  thi BO QUA dong ke tiep
        Jump     Done       / AC &lt;= 0 : xong
        Load     Sum
        Add      N
        Store    Sum        / Sum &lt;- Sum + N
        Load     N
        Subt     One
        Store    N          / N &lt;- N - 1
        Jump     Loop
Done,   Load     Sum
        Output
        Halt     000
N,      Dec      3
Sum,    Dec      0
One,    Dec      1</code></pre>
<p class="nhan">📐 <strong>LƯỢT 1 — bộ đếm vị trí đi tới, bảng ký hiệu đầy dần.</strong> LC khởi đầu ở 100 vì có <code>ORG 100</code>; mỗi câu lệnh MARIE chiếm đúng một từ nên LC tăng 1 mỗi lần:</p>
<table>
<tr><th>LC</th><th>Câu lệnh</th><th>Ký hiệu định nghĩa ở đây</th><th>Bảng ký hiệu sau dòng này</th></tr>
<tr><td>100</td><td>Loop, Load N</td><td><strong>Loop = 100</strong></td><td>Loop 100</td></tr>
<tr><td>101</td><td>Skipcond 800</td><td>—</td><td>Loop 100</td></tr>
<tr><td>102</td><td>Jump Done</td><td>—</td><td><em>Done còn chưa biết — forward reference</em></td></tr>
<tr><td>103–109</td><td>Load Sum … Jump Loop</td><td>—</td><td>không đổi</td></tr>
<tr><td>10A</td><td>Done, Load Sum</td><td><strong>Done = 10A</strong></td><td>Loop 100 · Done 10A</td></tr>
<tr><td>10B–10C</td><td>Output · Halt 000</td><td>—</td><td>không đổi</td></tr>
<tr><td>10D</td><td>N, Dec 3</td><td><strong>N = 10D</strong></td><td>… N 10D</td></tr>
<tr><td>10E</td><td>Sum, Dec 0</td><td><strong>Sum = 10E</strong></td><td>… Sum 10E</td></tr>
<tr><td>10F</td><td>One, Dec 1</td><td><strong>One = 10F</strong></td><td>… One 10F</td></tr>
</table>
<p class="nhan">📐 <strong>Bảng ký hiệu hoàn chỉnh</strong> — khối này chép NGUYÊN từ mục SYMBOL TABLE mà trình hợp dịch của trường in vào <code>p2.lst</code>, kể cả cột "References", vốn chính là danh sách các địa chỉ có trường toán hạng phải được vá bằng ký hiệu này:</p>
<table>
<tr><th>Ký hiệu</th><th>Định nghĩa tại</th><th>Được tham chiếu từ</th><th>Forward reference?</th></tr>
<tr><td>Done</td><td>10A</td><td>102</td><td><strong>CÓ</strong> — dùng ở 102, định nghĩa ở 10A</td></tr>
<tr><td>Loop</td><td>100</td><td>109</td><td>không — tham chiếu lùi</td></tr>
<tr><td>N</td><td>10D</td><td>100, 104, 106, 108</td><td><strong>CÓ</strong> ×4</td></tr>
<tr><td>One</td><td>10F</td><td>107</td><td><strong>CÓ</strong></td></tr>
<tr><td>Sum</td><td>10E</td><td>103, 105, 10A</td><td><strong>CÓ</strong> ×3</td></tr>
</table>
<p class="nhan">📐 <strong>LƯỢT 2 — sinh mã.</strong> Mỗi từ = một chữ số hex mã lệnh + ba chữ số hex địa chỉ, địa chỉ tra từ bảng bên trên:</p>
<table>
<tr><th>Địa chỉ</th><th>Nhãn</th><th>Lệnh</th><th>Mã máy</th><th>Mã lệnh · toán hạng</th></tr>
<tr><td>100</td><td>Loop</td><td>LOAD N</td><td><strong>110D</strong></td><td>1 · 10D</td></tr>
<tr><td>101</td><td></td><td>SKIPCOND 800</td><td><strong>8800</strong></td><td>8 · 800 (một ĐIỀU KIỆN, không phải địa chỉ)</td></tr>
<tr><td>102</td><td></td><td>JUMP Done</td><td><strong>910A</strong></td><td>9 · 10A ← forward reference, đã giải</td></tr>
<tr><td>103</td><td></td><td>LOAD Sum</td><td><strong>110E</strong></td><td>1 · 10E</td></tr>
<tr><td>104</td><td></td><td>ADD N</td><td><strong>310D</strong></td><td>3 · 10D</td></tr>
<tr><td>105</td><td></td><td>STORE Sum</td><td><strong>210E</strong></td><td>2 · 10E</td></tr>
<tr><td>106</td><td></td><td>LOAD N</td><td><strong>110D</strong></td><td>1 · 10D</td></tr>
<tr><td>107</td><td></td><td>SUBT One</td><td><strong>410F</strong></td><td>4 · 10F</td></tr>
<tr><td>108</td><td></td><td>STORE N</td><td><strong>210D</strong></td><td>2 · 10D</td></tr>
<tr><td>109</td><td></td><td>JUMP Loop</td><td><strong>9100</strong></td><td>9 · 100 ← tham chiếu lùi</td></tr>
<tr><td>10A</td><td>Done</td><td>LOAD Sum</td><td><strong>110E</strong></td><td>1 · 10E</td></tr>
<tr><td>10B</td><td></td><td>OUTPUT</td><td><strong>6000</strong></td><td>6 · không toán hạng</td></tr>
<tr><td>10C</td><td></td><td>HALT 000</td><td><strong>7000</strong></td><td>7 · không toán hạng</td></tr>
<tr><td>10D</td><td>N</td><td>DEC 3</td><td><strong>0003</strong></td><td>dữ liệu, không phải lệnh</td></tr>
<tr><td>10E</td><td>Sum</td><td>DEC 0</td><td><strong>0000</strong></td><td>dữ liệu</td></tr>
<tr><td>10F</td><td>One</td><td>DEC 1</td><td><strong>0001</strong></td><td>dữ liệu</td></tr>
</table>
<p class="dap-an">✅ Cả hai bảng được tạo ra bằng cách chạy CHÍNH trình hợp dịch của trường ở chế độ dòng lệnh (<code>java -cp MARIESimulator MarieSimulator.Assembler p2.mas</code>) rồi chép cột ra từ <code>p2.lst</code> — không gõ tay. Và nó đúng là trình hợp dịch hai lượt thật: chú thích trong mã nguồn nói thẳng ("trình hợp dịch này làm việc theo hai lượt trên mã nguồn… lượt một… tạo một tệp làm việc trung gian… lượt hai… cung cấp địa chỉ"), và hai phương thức được đặt tên đúng là <code>performFirstPass()</code> với <code>performSecondPass()</code>.</p>
<p class="nhan">📐 <strong>Bảng vết thực thi, sinh bằng một máy MARIE mô phỏng khớp <code>MarieSim.java</code> từng lệnh một.</strong> 33 bước, N = 3. AC ghi giá trị <em>SAU KHI</em> lệnh chạy xong:</p>
<table>
<tr><th>#</th><th>PC</th><th>Lệnh</th><th>AC</th><th>MAR</th><th>MBR</th><th>PC mới</th><th>Ô nhớ đổi</th></tr>
<tr><td>1</td><td>100</td><td>LOAD N</td><td>3</td><td>10D</td><td>0003</td><td>101</td><td></td></tr>
<tr><td>2</td><td>101</td><td>SKIPCOND 800</td><td>3</td><td>101</td><td>0003</td><td><strong>103</strong></td><td>AC &gt; 0 → bỏ qua 102</td></tr>
<tr><td>3</td><td>103</td><td>LOAD Sum</td><td>0</td><td>10E</td><td>0000</td><td>104</td><td></td></tr>
<tr><td>4</td><td>104</td><td>ADD N</td><td>3</td><td>10D</td><td>0003</td><td>105</td><td></td></tr>
<tr><td>5</td><td>105</td><td>STORE Sum</td><td>3</td><td>10E</td><td>0003</td><td>106</td><td>M[10E] = 0003</td></tr>
<tr><td>6</td><td>106</td><td>LOAD N</td><td>3</td><td>10D</td><td>0003</td><td>107</td><td></td></tr>
<tr><td>7</td><td>107</td><td>SUBT One</td><td>2</td><td>10F</td><td>0001</td><td>108</td><td></td></tr>
<tr><td>8</td><td>108</td><td>STORE N</td><td>2</td><td>10D</td><td>0002</td><td>109</td><td>M[10D] = 0002</td></tr>
<tr><td>9</td><td>109</td><td>JUMP Loop</td><td>2</td><td>109</td><td>0002</td><td><strong>100</strong></td><td></td></tr>
<tr><td>10</td><td>100</td><td>LOAD N</td><td>2</td><td>10D</td><td>0002</td><td>101</td><td></td></tr>
<tr><td>11</td><td>101</td><td>SKIPCOND 800</td><td>2</td><td>101</td><td>0002</td><td>103</td><td>bỏ qua</td></tr>
<tr><td>12–18</td><td>103…109</td><td>vòng thân thứ hai</td><td>→ 1</td><td></td><td></td><td>100</td><td>M[10E] = 0005 · M[10D] = 0001</td></tr>
<tr><td>19</td><td>100</td><td>LOAD N</td><td>1</td><td>10D</td><td>0001</td><td>101</td><td></td></tr>
<tr><td>20</td><td>101</td><td>SKIPCOND 800</td><td>1</td><td>101</td><td>0001</td><td>103</td><td>bỏ qua</td></tr>
<tr><td>21–27</td><td>103…109</td><td>vòng thân thứ ba</td><td>→ 0</td><td></td><td></td><td>100</td><td>M[10E] = 0006 · M[10D] = 0000</td></tr>
<tr><td>28</td><td>100</td><td>LOAD N</td><td><strong>0</strong></td><td>10D</td><td>0000</td><td>101</td><td></td></tr>
<tr><td>29</td><td>101</td><td>SKIPCOND 800</td><td>0</td><td>101</td><td>0000</td><td><strong>102</strong></td><td>AC KHÔNG &gt; 0 → <em>KHÔNG</em> bỏ qua</td></tr>
<tr><td>30</td><td>102</td><td>JUMP Done</td><td>0</td><td>102</td><td>0000</td><td><strong>10A</strong></td><td></td></tr>
<tr><td>31</td><td>10A</td><td>LOAD Sum</td><td>6</td><td>10E</td><td>0006</td><td>10B</td><td></td></tr>
<tr><td>32</td><td>10B</td><td>OUTPUT</td><td>6</td><td>10B</td><td>0006</td><td>10C</td><td>in ra <strong>6</strong></td></tr>
<tr><td>33</td><td>10C</td><td>HALT 000</td><td>6</td><td>10C</td><td>0006</td><td>—</td><td>dừng</td></tr>
</table>
<p class="dap-an">✅ Kết quả = <strong>6</strong> = 3 + 2 + 1. Để ý dòng 29–30: lần <em>DUY NHẤT</em> mà <code>Jump Done</code> ở 102 được thi hành là đúng lượt AC = 0. Mọi lượt khác, <code>SKIPCOND 800</code> nhảy qua nó. Vòng lặp trên cỗ máy này kết thúc theo đúng kiểu đó.</p>
<p class="pitfall">⚠️ Ba lỗi về nhãn làm hỏng bài lab. (1) <strong>Hai câu lệnh cùng một nhãn</strong> — trình hợp dịch báo trùng ký hiệu và cả lượt hợp dịch hỏng. (2) <strong>Tham chiếu một nhãn chưa bao giờ định nghĩa</strong> — lượt 2 phát hiện ký hiệu chưa định nghĩa; lỗi hiện ra ở chỗ <em>DÙNG</em>, mà đó không phải chỗ bạn làm sai. (3) <strong>Nhãn trên dòng dữ liệu và nhãn trên dòng mã trông y hệt nhau</strong> — <code>N, Dec 3</code> và <code>Loop, Load N</code> đều chỉ đặt tên cho một địa chỉ, nên không gì ngăn bạn viết <code>Jump N</code> rồi thi hành chính dữ liệu của mình. MARIE sẽ thử làm, và kết quả là vô nghĩa mà không có lấy một thông báo lỗi.</p>`],

      [10, 'Statements (2 of 3) — Mnemonic',
        `<p class="y-chinh">🎯 The shortest slide in the chapter and the one you will use most. <strong>"The mnemonic is the name of the operation or function of the assembly language statement. In the case of a machine instruction, a mnemonic is the symbolic name associated with a particular opcode."</strong></p>
<ul>
<li><strong>Read the second sentence carefully — it contains a caveat.</strong> "<em>In the case of a machine instruction</em>" implies the other cases: a mnemonic may also name a <strong>directive</strong> or a <strong>macro</strong>, exactly as Figure 15.2 said. Only when it names a machine instruction is there a one-to-one link to an opcode.</li>
<li><strong>The mnemonic is the only mandatory field.</strong> Every other field on Figure 15.2 is optional or "zero or more". Delete the mnemonic and there is no statement left.</li>
<li><strong>Mnemonics are chosen to be pronounceable abbreviations, and that is the whole trick of readability.</strong> <code>SUBT</code> for subtract, <code>STA</code>/<code>Store</code> for store, <code>JnS</code> for jump-and-store. The processor does not care; the human does.</li>
<li><strong>One mnemonic can map to several opcodes in a real ISA.</strong> On x86, <code>mov</code> becomes a different opcode depending on whether the operands are register-to-register, immediate-to-register, or memory. The assembler picks. MARIE has no such ambiguity — one mnemonic, one opcode, always — which is precisely why it is a good place to learn.</li>
</ul>
<p class="nhan">📐 <strong>The complete MARIE instruction set</strong> — the 13 mnemonics, taken from the simulator's own built-in reference (<code>m1isa1.txt</code>, the "cheat sheet" its Help menu shows). This is your entire vocabulary for sessions 39–44:</p>
<table>
<tr><th>Mnemonic</th><th>Hex opcode</th><th>What it does</th><th>Needs an operand?</th></tr>
<tr><td><strong>JnS X</strong></td><td>0</td><td>Store the PC at address X and jump to X+1</td><td>yes</td></tr>
<tr><td><strong>Load X</strong></td><td>1</td><td>Load contents of address X into AC</td><td>yes</td></tr>
<tr><td><strong>Store X</strong></td><td>2</td><td>Store the contents of AC at address X</td><td>yes</td></tr>
<tr><td><strong>Add X</strong></td><td>3</td><td>Add the contents of address X to AC</td><td>yes</td></tr>
<tr><td><strong>Subt X</strong></td><td>4</td><td>Subtract the contents of address X from AC</td><td>yes</td></tr>
<tr><td><strong>Input</strong></td><td>5</td><td>Input a value from the keyboard into AC</td><td>no</td></tr>
<tr><td><strong>Output</strong></td><td>6</td><td>Output the value in AC to the display</td><td>no</td></tr>
<tr><td><strong>Halt</strong></td><td>7</td><td>Terminate program</td><td>no*</td></tr>
<tr><td><strong>Skipcond X</strong></td><td>8</td><td>Skip the next instruction on a condition (slide 11)</td><td>yes — a condition code</td></tr>
<tr><td><strong>Jump X</strong></td><td>9</td><td>Load the value of X into PC</td><td>yes</td></tr>
<tr><td><strong>Clear</strong></td><td>A</td><td>Put all zeros in AC</td><td>no</td></tr>
<tr><td><strong>AddI X</strong></td><td>B</td><td>Add <em>indirect</em>: use the value at X as the actual address of the operand to add to AC</td><td>yes</td></tr>
<tr><td><strong>JumpI X</strong></td><td>C</td><td>Use the value at X as the address to jump to</td><td>yes</td></tr>
</table>
<p class="dap-an">✅ How to read any MARIE machine word in one second: <strong>first hex digit = the opcode from this table, last three hex digits = the address</strong>. So <code>B114</code> is <code>AddI</code> (B) on address 114, and <code>7000</code> is <code>Halt</code>. Verified against the listings this lesson generated: <code>110D</code> = Load 10D, <code>410F</code> = Subt 10F, <code>910A</code> = Jump 10A, <code>C10C</code> = JumpI 10C.</p>
<p class="pitfall">⚠️ *<strong>The asterisk on Halt is a real, measured trap.</strong> The MARIE ISA says Halt takes no operand — but the assembler shipped in <code>MARIESimulator.zip</code> <em>demands</em> one. Assembling the example file <code>Ex4_1.mas</code> exactly as shipped produces <code>110 7??? **** Missing operand.</code> and "1 error found. Assembly unsuccessful." Write <strong><code>Halt 000</code></strong> (or <code>Halt 0</code>) and it assembles cleanly. Same for a bare <code>Output</code> if your build complains. Verify the checker before you trust it — and before you spend an hour hunting a bug in your own logic.</p>
<p class="meo">💡 Memory aid for the opcode order: 0–4 are the <em>memory</em> instructions in a natural sequence (jump-and-store, load, store, add, subtract), 5–7 are the <em>no-operand</em> ones (input, output, halt), 8–9 are <em>control flow</em> (skipcond, jump), and A–C are the <em>extras</em> (clear, and the two indirect forms).</p>`,
        `<p class="y-chinh">🎯 Slide ngắn nhất chương và là slide bạn dùng nhiều nhất. <strong>"Mã gợi nhớ là TÊN của phép toán hoặc chức năng của câu lệnh hợp ngữ. Trong trường hợp một lệnh máy, mã gợi nhớ là tên ký hiệu gắn với một mã lệnh cụ thể."</strong></p>
<ul>
<li><strong>Đọc kỹ câu thứ hai — nó có một điều kiện.</strong> "<em>Trong trường hợp một LỆNH MÁY</em>" ngụ ý còn các trường hợp khác: mã gợi nhớ cũng có thể là tên một <strong>CHỈ THỊ</strong> hoặc một <strong>MACRO</strong>, đúng như Figure 15.2 đã nói. Chỉ khi nó gọi tên một lệnh máy thì mới có liên kết một-đối-một với mã lệnh.</li>
<li><strong>Mã gợi nhớ là trường BẮT BUỘC duy nhất.</strong> Mọi trường khác trên Figure 15.2 đều tuỳ chọn hoặc "không hoặc nhiều". Xoá mã gợi nhớ đi thì không còn câu lệnh nào.</li>
<li><strong>Mã gợi nhớ được chọn sao cho là chữ viết tắt ĐỌC ĐƯỢC, và đó là toàn bộ mẹo của tính dễ đọc.</strong> <code>SUBT</code> cho subtract, <code>STA</code>/<code>Store</code> cho store, <code>JnS</code> cho jump-and-store. Bộ xử lý không quan tâm; con người thì có.</li>
<li><strong>Một mã gợi nhớ có thể ánh xạ tới NHIỀU mã lệnh trong một ISA thật.</strong> Trên x86, <code>mov</code> thành một mã lệnh khác nhau tuỳ toán hạng là thanh-ghi-sang-thanh-ghi, hằng-sang-thanh-ghi hay bộ nhớ. Trình hợp dịch tự chọn. MARIE không có sự nhập nhằng đó — một mã gợi nhớ, một mã lệnh, luôn luôn — và chính vì thế nó là chỗ tốt để học.</li>
</ul>
<p class="nhan">📐 <strong>Trọn bộ tập lệnh MARIE</strong> — 13 mã gợi nhớ, lấy từ chính tài liệu tham khảo cài sẵn trong trình mô phỏng (<code>m1isa1.txt</code>, tờ "cheat sheet" mà menu Help của nó hiện ra). Đây là toàn bộ vốn từ của bạn cho buổi 39–44:</p>
<table>
<tr><th>Mã gợi nhớ</th><th>Mã lệnh hex</th><th>Nó làm gì</th><th>Cần toán hạng?</th></tr>
<tr><td><strong>JnS X</strong></td><td>0</td><td>Lưu PC vào địa chỉ X rồi nhảy tới X+1</td><td>có</td></tr>
<tr><td><strong>Load X</strong></td><td>1</td><td>Nạp nội dung ô nhớ X vào AC</td><td>có</td></tr>
<tr><td><strong>Store X</strong></td><td>2</td><td>Ghi nội dung AC vào ô nhớ X</td><td>có</td></tr>
<tr><td><strong>Add X</strong></td><td>3</td><td>Cộng nội dung ô nhớ X vào AC</td><td>có</td></tr>
<tr><td><strong>Subt X</strong></td><td>4</td><td>Trừ nội dung ô nhớ X khỏi AC</td><td>có</td></tr>
<tr><td><strong>Input</strong></td><td>5</td><td>Nhập một giá trị từ bàn phím vào AC</td><td>không</td></tr>
<tr><td><strong>Output</strong></td><td>6</td><td>Xuất giá trị trong AC ra màn hình</td><td>không</td></tr>
<tr><td><strong>Halt</strong></td><td>7</td><td>Kết thúc chương trình</td><td>không*</td></tr>
<tr><td><strong>Skipcond X</strong></td><td>8</td><td>Bỏ qua lệnh kế tiếp theo một điều kiện (slide 11)</td><td>có — một mã điều kiện</td></tr>
<tr><td><strong>Jump X</strong></td><td>9</td><td>Nạp giá trị X vào PC</td><td>có</td></tr>
<tr><td><strong>Clear</strong></td><td>A</td><td>Đặt AC về toàn số 0</td><td>không</td></tr>
<tr><td><strong>AddI X</strong></td><td>B</td><td>Cộng <em>GIÁN TIẾP</em>: dùng giá trị tại X làm ĐỊA CHỈ THẬT của toán hạng cần cộng vào AC</td><td>có</td></tr>
<tr><td><strong>JumpI X</strong></td><td>C</td><td>Dùng giá trị tại X làm địa chỉ để nhảy tới</td><td>có</td></tr>
</table>
<p class="dap-an">✅ Cách đọc bất kỳ từ máy MARIE nào trong một giây: <strong>chữ số hex ĐẦU = mã lệnh trong bảng này, ba chữ số hex CUỐI = địa chỉ</strong>. Vậy <code>B114</code> là <code>AddI</code> (B) trên địa chỉ 114, và <code>7000</code> là <code>Halt</code>. Đã đối chiếu với các file listing sinh ra trong bài này: <code>110D</code> = Load 10D, <code>410F</code> = Subt 10F, <code>910A</code> = Jump 10A, <code>C10C</code> = JumpI 10C.</p>
<p class="pitfall">⚠️ *<strong>Dấu sao ở Halt là một cái bẫy CÓ THẬT, đã đo.</strong> Tập lệnh MARIE nói Halt không có toán hạng — nhưng trình hợp dịch đi kèm <code>MARIESimulator.zip</code> lại <em>ĐÒI</em> một cái. Hợp dịch đúng file ví dụ <code>Ex4_1.mas</code> y như lúc nhận được thì ra <code>110 7??? **** Missing operand.</code> và "1 error found. Assembly unsuccessful." Viết <strong><code>Halt 000</code></strong> (hoặc <code>Halt 0</code>) thì hợp dịch sạch. Tương tự với <code>Output</code> trần nếu bản của bạn kêu ca. Hãy KIỂM BỘ KIỂM trước khi tin nó — và trước khi bạn mất một giờ đi soi lỗi trong logic của chính mình.</p>
<p class="meo">💡 Mẹo nhớ thứ tự mã lệnh: 0–4 là nhóm <em>làm việc với BỘ NHỚ</em> theo trình tự tự nhiên (nhảy-và-lưu, nạp, ghi, cộng, trừ), 5–7 là nhóm <em>KHÔNG toán hạng</em> (vào, ra, dừng), 8–9 là <em>ĐIỀU KHIỂN LUỒNG</em> (skipcond, jump), A–C là nhóm <em>THÊM</em> (xoá, và hai dạng gián tiếp).</p>`],

      [11, 'Statements (3 of 3) — Operands',
        `<p class="y-chinh">🎯 <strong>"An assembly language statement includes zero or more operands. Each operand identifies an <em>immediate value</em>, a <em>register value</em>, or a <em>memory location</em>."</strong> Three species — and the slide adds that the language provides conventions both for telling them apart and for <strong>indicating addressing mode</strong>.</p>
<table>
<tr><th>Operand type</th><th>Meaning</th><th>x86 example</th><th>MARIE equivalent</th></tr>
<tr><td><strong>Immediate value</strong></td><td>The number is <em>inside</em> the instruction</td><td><code>mov eax, 5</code></td><td>Not available as an instruction operand — you place the constant with <code>Dec</code>/<code>Hex</code> and <code>Load</code> it (see <code>One, Dec 1</code>)</td></tr>
<tr><td><strong>Register value</strong></td><td>Name a register</td><td><code>add eax, ebx</code></td><td>Never written — MARIE has one accumulator and it is implicit in every instruction</td></tr>
<tr><td><strong>Memory location</strong></td><td>Name an address</td><td><code>mov eax, [total]</code></td><td>The only kind: <code>Load Sum</code>, <code>Add N</code></td></tr>
</table>
<ul>
<li><strong>"Zero or more" is why the count varies.</strong> Zero: <code>Input</code>, <code>Output</code>, <code>Clear</code>. One: everything else in MARIE, because MARIE is a <strong>single-address machine</strong> — a term straight out of Chapter 13. Two or three: x86, ARM, MIPS.</li>
<li><strong>The single-accumulator design explains the shape of every MARIE program.</strong> Because the second operand is always AC, you constantly write the pattern <em>Load, do something, Store</em>. Slide 9's loop body does <code>Load Sum · Add N · Store Sum</code> just to compute one addition. On x86 that is one instruction. This is Chapter 13's "number of addresses" trade-off made painfully visible.</li>
<li><strong>"Conventions for indicating addressing mode" is the second half of the slide, and MARIE has exactly two modes.</strong> <em>Direct</em>: the operand field holds the address of the data (<code>Add X</code> → AC = AC + M[X]). <em>Indirect</em>: the operand field holds the address of the address (<code>AddI X</code> → AC = AC + M[M[X]]; <code>JumpI X</code> → PC = M[X]). The <code>I</code> suffix <em>is</em> the convention. Chapter 11/14 calls these direct and indirect addressing; here they are two real instructions you will use.</li>
</ul>
<p class="nhan">📐 <strong>SKIPCOND — the operand that is not an address.</strong> This is where more lab marks are lost than anywhere else in the course, because <code>Skipcond 800</code> looks like it refers to memory address 800. It does not. The two address bits closest to the opcode (bits 11 and 10) are a <strong>condition code</strong>:</p>
<table>
<tr><th>Written as</th><th>Bits 11–10</th><th>Machine word</th><th>Skips the next instruction if…</th><th>Use it for</th></tr>
<tr><td><code>Skipcond 000</code></td><td>00</td><td>8000</td><td><strong>AC &lt; 0</strong> (accumulator negative)</td><td>counting down past zero; "is a − b negative?" i.e. a &lt; b</td></tr>
<tr><td><code>Skipcond 400</code></td><td>01</td><td>8400</td><td><strong>AC = 0</strong></td><td>"have we finished?" · "are these two equal?"</td></tr>
<tr><td><code>Skipcond 800</code></td><td>10</td><td>8800</td><td><strong>AC &gt; 0</strong> (accumulator positive)</td><td>"is there anything left to do?" · a &gt; b</td></tr>
</table>
<ul>
<li><strong>Where 000 / 400 / 800 come from.</strong> They are the 12-bit address field with bits 11–10 set to 00, 01 and 10 and everything else zero: 0100 0000 0000<sub>2</sub> = 400<sub>16</sub>, 1000 0000 0000<sub>2</sub> = 800<sub>16</sub>. Bits 11–10 = 11 is illegal and stops the machine with an error.</li>
<li><strong>SKIPCOND skips ONE instruction — it does not branch.</strong> It only adds 1 to PC. That is why the universal MARIE idiom is <code>Skipcond</code> immediately followed by a <code>Jump</code>: the skip decides <em>which of two jumps</em> you land on. Every conditional in MARIE is built from that pair.</li>
<li><strong>There is no "skip if less than 5".</strong> MARIE compares against zero and nothing else, so <em>every</em> comparison is done by subtraction first: to test a &lt; b, compute <code>Load a · Subt b · Skipcond 000</code>.</li>
<li><strong>Version warning, verified in the source.</strong> The build shipped by your faculty extends SKIPCOND: the low <strong>10</strong> bits are compared against AC instead of being ignored, so <code>Skipcond 805</code> means "skip if AC &gt; 5". The original v1.2 simulator ignores them. Do not use the extension in submitted work unless your instructor says the lab machine runs this fork — it will not run anywhere else.</li>
</ul>
<p class="nhan">📐 <strong>Loop example 1 — multiply 5 × 4 by repeated addition, using <code>Skipcond 400</code> (AC = 0).</strong> File <code>p4.mas</code>:</p>
<pre><code>        ORG 100
Loop,   Load     Ctr
        Skipcond 400        / Ctr = 0 ? then skip the next line
        Jump     Body       / not finished: do one more addition
        Jump     Done       / finished
Body,   Load     Sum
        Add      X
        Store    Sum
        Load     Ctr
        Subt     One
        Store    Ctr
        Jump     Loop
Done,   Load     Sum
        Output
        Halt     000
X,      Dec      5
Ctr,    Dec      4
Sum,    Dec      0
One,    Dec      1</code></pre>
<p class="nhan">📐 Trace of the <strong>first pass through the loop</strong> (steps 1–10 of 46), from the simulator:</p>
<table>
<tr><th>#</th><th>PC</th><th>Instruction</th><th>AC</th><th>MAR</th><th>MBR</th><th>next PC</th><th>Memory changed</th></tr>
<tr><td>1</td><td>100</td><td>LOAD Ctr</td><td>4</td><td>10F</td><td>0004</td><td>101</td><td></td></tr>
<tr><td>2</td><td>101</td><td>SKIPCOND 400</td><td>4</td><td>101</td><td>0004</td><td>102</td><td>AC ≠ 0 → <em>no</em> skip</td></tr>
<tr><td>3</td><td>102</td><td>JUMP Body</td><td>4</td><td>102</td><td>0004</td><td>104</td><td></td></tr>
<tr><td>4</td><td>104</td><td>LOAD Sum</td><td>0</td><td>110</td><td>0000</td><td>105</td><td></td></tr>
<tr><td>5</td><td>105</td><td>ADD X</td><td>5</td><td>10E</td><td>0005</td><td>106</td><td></td></tr>
<tr><td>6</td><td>106</td><td>STORE Sum</td><td>5</td><td>110</td><td>0005</td><td>107</td><td>M[110] = 0005</td></tr>
<tr><td>7</td><td>107</td><td>LOAD Ctr</td><td>4</td><td>10F</td><td>0004</td><td>108</td><td></td></tr>
<tr><td>8</td><td>108</td><td>SUBT One</td><td>3</td><td>111</td><td>0001</td><td>109</td><td></td></tr>
<tr><td>9</td><td>109</td><td>STORE Ctr</td><td>3</td><td>10F</td><td>0003</td><td>10A</td><td>M[10F] = 0003</td></tr>
<tr><td>10</td><td>10A</td><td>JUMP Loop</td><td>3</td><td>10A</td><td>0003</td><td>100</td><td></td></tr>
</table>
<p class="nhan">📐 What the <code>Skipcond</code> decides on each visit to the top of the loop:</p>
<table>
<tr><th>Step</th><th>AC (= Ctr)</th><th>Skipcond 400 result</th><th>Lands on</th><th>Sum after the pass</th></tr>
<tr><td>1–2</td><td>4</td><td>no skip</td><td>102 JUMP Body</td><td>5</td></tr>
<tr><td>11–12</td><td>3</td><td>no skip</td><td>102 JUMP Body</td><td>10</td></tr>
<tr><td>21–22</td><td>2</td><td>no skip</td><td>102 JUMP Body</td><td>15</td></tr>
<tr><td>31–32</td><td>1</td><td>no skip</td><td>102 JUMP Body</td><td>20</td></tr>
<tr><td>41–42</td><td><strong>0</strong></td><td><strong>SKIP</strong> — 102 is jumped over</td><td>103 JUMP Done</td><td>20 (final)</td></tr>
</table>
<p class="dap-an">✅ 46 steps, OUTPUT = <strong>20</strong> = 5 × 4. Read the mechanism once and you own every MARIE loop: <em>the condition does not choose whether to loop; it chooses which of the two following jumps gets executed.</em> Loop example 2 (<code>Skipcond 800</code>) is the summation program traced in full on slide 9; a third, <code>Skipcond 000</code>, appears on slide 13.</p>
<p class="pitfall">⚠️ Four SKIPCOND traps, in order of how often they cost marks. (1) <strong>Writing <code>Skipcond 1</code> or <code>Skipcond 2</code></strong> — the operand is the <em>hex address field</em> 000/400/800, not the condition number 0/1/2. (2) <strong>Forgetting that the test is on AC</strong>, not on the variable you have in mind: you must <code>Load</code> it first, and any instruction in between that changes AC destroys the test. (3) <strong>Putting the "true" branch right after the Skipcond</strong> — it is the branch that gets <em>skipped</em>. (4) <strong>Using <code>Skipcond 400</code> for a countdown that can overshoot</strong>: if the counter can step past zero (by 2, say), the test never fires and the loop runs forever. Use <code>Skipcond 000</code> whenever "less than" is the real intent.</p>`,
        `<p class="y-chinh">🎯 <strong>"Một câu lệnh hợp ngữ gồm KHÔNG hoặc NHIỀU toán hạng. Mỗi toán hạng chỉ ra một <em>giá trị tức thời</em>, một <em>giá trị thanh ghi</em>, hoặc một <em>ô nhớ</em>."</strong> Ba loài — và slide nói thêm rằng ngôn ngữ cung cấp quy ước để vừa phân biệt chúng vừa <strong>chỉ ra CHẾ ĐỘ ĐỊA CHỈ</strong>.</p>
<table>
<tr><th>Loại toán hạng</th><th>Ý nghĩa</th><th>Ví dụ x86</th><th>Tương đương trong MARIE</th></tr>
<tr><td><strong>Giá trị tức thời</strong></td><td>Con số nằm <em>BÊN TRONG</em> lệnh</td><td><code>mov eax, 5</code></td><td>Không có ở dạng toán hạng lệnh — bạn đặt hằng bằng <code>Dec</code>/<code>Hex</code> rồi <code>Load</code> (xem <code>One, Dec 1</code>)</td></tr>
<tr><td><strong>Giá trị thanh ghi</strong></td><td>Gọi tên một thanh ghi</td><td><code>add eax, ebx</code></td><td>Không bao giờ viết — MARIE chỉ có một thanh ghi tích luỹ và nó ngầm định trong mọi lệnh</td></tr>
<tr><td><strong>Ô nhớ</strong></td><td>Gọi tên một địa chỉ</td><td><code>mov eax, [total]</code></td><td>Loại DUY NHẤT: <code>Load Sum</code>, <code>Add N</code></td></tr>
</table>
<ul>
<li><strong>"Không hoặc nhiều" là lý do số lượng thay đổi.</strong> Không: <code>Input</code>, <code>Output</code>, <code>Clear</code>. Một: mọi lệnh còn lại của MARIE, vì MARIE là <strong>máy MỘT ĐỊA CHỈ</strong> — thuật ngữ lấy thẳng từ Chương 13. Hai hoặc ba: x86, ARM, MIPS.</li>
<li><strong>Thiết kế một-thanh-ghi-tích-luỹ giải thích hình dáng của MỌI chương trình MARIE.</strong> Vì toán hạng thứ hai luôn là AC, bạn liên tục viết khuôn <em>Load, làm gì đó, Store</em>. Thân vòng lặp ở slide 9 phải viết <code>Load Sum · Add N · Store Sum</code> chỉ để làm MỘT phép cộng. Trên x86 đó là một lệnh. Đây là đánh đổi "số lượng địa chỉ" của Chương 13 hiện ra đau đớn trước mắt.</li>
<li><strong>"Quy ước chỉ ra chế độ địa chỉ" là nửa sau của slide, và MARIE có đúng HAI chế độ.</strong> <em>Trực tiếp</em>: trường toán hạng chứa địa chỉ của DỮ LIỆU (<code>Add X</code> → AC = AC + M[X]). <em>Gián tiếp</em>: trường toán hạng chứa địa chỉ của ĐỊA CHỈ (<code>AddI X</code> → AC = AC + M[M[X]]; <code>JumpI X</code> → PC = M[X]). Hậu tố <code>I</code> CHÍNH LÀ cái quy ước đó. Chương 11/14 gọi chúng là địa chỉ trực tiếp và gián tiếp; ở đây chúng là hai lệnh thật bạn sẽ dùng.</li>
</ul>
<p class="nhan">📐 <strong>SKIPCOND — toán hạng KHÔNG PHẢI địa chỉ.</strong> Đây là chỗ mất điểm lab nhiều hơn bất cứ chỗ nào khác trong môn, vì <code>Skipcond 800</code> trông y như đang trỏ tới ô nhớ 800. Không phải. Hai bit địa chỉ sát mã lệnh nhất (bit 11 và 10) là một <strong>MÃ ĐIỀU KIỆN</strong>:</p>
<table>
<tr><th>Viết là</th><th>Bit 11–10</th><th>Từ máy</th><th>Bỏ qua lệnh kế tiếp nếu…</th><th>Dùng cho</th></tr>
<tr><td><code>Skipcond 000</code></td><td>00</td><td>8000</td><td><strong>AC &lt; 0</strong> (AC âm)</td><td>đếm lùi vượt qua 0; "a − b có âm không?" tức a &lt; b</td></tr>
<tr><td><code>Skipcond 400</code></td><td>01</td><td>8400</td><td><strong>AC = 0</strong></td><td>"xong chưa?" · "hai cái này có bằng nhau không?"</td></tr>
<tr><td><code>Skipcond 800</code></td><td>10</td><td>8800</td><td><strong>AC &gt; 0</strong> (AC dương)</td><td>"còn việc để làm không?" · a &gt; b</td></tr>
</table>
<ul>
<li><strong>000 / 400 / 800 ở đâu ra.</strong> Chúng là trường địa chỉ 12 bit với bit 11–10 đặt thành 00, 01, 10 còn lại toàn 0: 0100 0000 0000<sub>2</sub> = 400<sub>16</sub>, 1000 0000 0000<sub>2</sub> = 800<sub>16</sub>. Bit 11–10 = 11 là bất hợp lệ và làm máy dừng kèm lỗi.</li>
<li><strong>SKIPCOND BỎ QUA MỘT lệnh — nó KHÔNG rẽ nhánh.</strong> Nó chỉ cộng 1 vào PC. Vì thế khuôn mẫu phổ quát của MARIE là <code>Skipcond</code> đi liền ngay sau đó một <code>Jump</code>: cú bỏ qua quyết định <em>bạn rơi vào cái nhảy NÀO trong hai cái</em>. Mọi cấu trúc điều kiện của MARIE đều dựng từ cặp đó.</li>
<li><strong>Không có "bỏ qua nếu nhỏ hơn 5".</strong> MARIE chỉ so với số 0 và không gì khác, nên <em>MỌI</em> phép so sánh đều làm bằng phép trừ trước: muốn kiểm a &lt; b thì <code>Load a · Subt b · Skipcond 000</code>.</li>
<li><strong>Cảnh báo phiên bản, đã kiểm trong mã nguồn.</strong> Bản trường phát có MỞ RỘNG SKIPCOND: <strong>10</strong> bit thấp được đem SO SÁNH với AC thay vì bị bỏ qua, nên <code>Skipcond 805</code> nghĩa là "bỏ qua nếu AC &gt; 5". Trình mô phỏng v1.2 gốc thì lờ chúng đi. Đừng dùng phần mở rộng này trong bài nộp trừ khi giảng viên xác nhận máy lab chạy đúng bản fork đó — nó sẽ không chạy ở bất kỳ nơi nào khác.</li>
</ul>
<p class="nhan">📐 <strong>Ví dụ vòng lặp 1 — nhân 5 × 4 bằng cộng lặp, dùng <code>Skipcond 400</code> (AC = 0).</strong> File <code>p4.mas</code>:</p>
<pre><code>        ORG 100
Loop,   Load     Ctr
        Skipcond 400        / Ctr = 0 ? thi BO QUA dong ke tiep
        Jump     Body       / chua xong: cong them mot lan nua
        Jump     Done       / xong
Body,   Load     Sum
        Add      X
        Store    Sum
        Load     Ctr
        Subt     One
        Store    Ctr
        Jump     Loop
Done,   Load     Sum
        Output
        Halt     000
X,      Dec      5
Ctr,    Dec      4
Sum,    Dec      0
One,    Dec      1</code></pre>
<p class="nhan">📐 Bảng vết của <strong>lượt đi đầu tiên qua vòng lặp</strong> (bước 1–10 trong tổng 46), lấy từ máy mô phỏng:</p>
<table>
<tr><th>#</th><th>PC</th><th>Lệnh</th><th>AC</th><th>MAR</th><th>MBR</th><th>PC mới</th><th>Ô nhớ đổi</th></tr>
<tr><td>1</td><td>100</td><td>LOAD Ctr</td><td>4</td><td>10F</td><td>0004</td><td>101</td><td></td></tr>
<tr><td>2</td><td>101</td><td>SKIPCOND 400</td><td>4</td><td>101</td><td>0004</td><td>102</td><td>AC ≠ 0 → <em>KHÔNG</em> bỏ qua</td></tr>
<tr><td>3</td><td>102</td><td>JUMP Body</td><td>4</td><td>102</td><td>0004</td><td>104</td><td></td></tr>
<tr><td>4</td><td>104</td><td>LOAD Sum</td><td>0</td><td>110</td><td>0000</td><td>105</td><td></td></tr>
<tr><td>5</td><td>105</td><td>ADD X</td><td>5</td><td>10E</td><td>0005</td><td>106</td><td></td></tr>
<tr><td>6</td><td>106</td><td>STORE Sum</td><td>5</td><td>110</td><td>0005</td><td>107</td><td>M[110] = 0005</td></tr>
<tr><td>7</td><td>107</td><td>LOAD Ctr</td><td>4</td><td>10F</td><td>0004</td><td>108</td><td></td></tr>
<tr><td>8</td><td>108</td><td>SUBT One</td><td>3</td><td>111</td><td>0001</td><td>109</td><td></td></tr>
<tr><td>9</td><td>109</td><td>STORE Ctr</td><td>3</td><td>10F</td><td>0003</td><td>10A</td><td>M[10F] = 0003</td></tr>
<tr><td>10</td><td>10A</td><td>JUMP Loop</td><td>3</td><td>10A</td><td>0003</td><td>100</td><td></td></tr>
</table>
<p class="nhan">📐 Mỗi lần ghé đỉnh vòng lặp, <code>Skipcond</code> quyết định gì:</p>
<table>
<tr><th>Bước</th><th>AC (= Ctr)</th><th>Kết quả Skipcond 400</th><th>Rơi vào</th><th>Sum sau lượt đó</th></tr>
<tr><td>1–2</td><td>4</td><td>không bỏ qua</td><td>102 JUMP Body</td><td>5</td></tr>
<tr><td>11–12</td><td>3</td><td>không bỏ qua</td><td>102 JUMP Body</td><td>10</td></tr>
<tr><td>21–22</td><td>2</td><td>không bỏ qua</td><td>102 JUMP Body</td><td>15</td></tr>
<tr><td>31–32</td><td>1</td><td>không bỏ qua</td><td>102 JUMP Body</td><td>20</td></tr>
<tr><td>41–42</td><td><strong>0</strong></td><td><strong>BỎ QUA</strong> — nhảy vượt qua 102</td><td>103 JUMP Done</td><td>20 (cuối)</td></tr>
</table>
<p class="dap-an">✅ 46 bước, OUTPUT = <strong>20</strong> = 5 × 4. Hiểu cơ chế này một lần là bạn nắm mọi vòng lặp MARIE: <em>điều kiện KHÔNG chọn có lặp hay không; nó chọn CÁI NÀO trong hai lệnh nhảy phía sau được thi hành.</em> Ví dụ vòng lặp 2 (<code>Skipcond 800</code>) là chương trình tính tổng có bảng vết đầy đủ ở slide 9; ví dụ thứ ba, <code>Skipcond 000</code>, nằm ở slide 13.</p>
<p class="pitfall">⚠️ Bốn bẫy SKIPCOND, xếp theo mức độ hay mất điểm. (1) <strong>Viết <code>Skipcond 1</code> hay <code>Skipcond 2</code></strong> — toán hạng là <em>TRƯỜNG ĐỊA CHỈ HEX</em> 000/400/800, không phải số hiệu điều kiện 0/1/2. (2) <strong>Quên rằng phép thử là trên AC</strong>, không phải trên cái biến bạn đang nghĩ trong đầu: phải <code>Load</code> nó lên trước, và bất kỳ lệnh nào xen vào làm đổi AC là phá hỏng phép thử. (3) <strong>Đặt nhánh "đúng" ngay sau Skipcond</strong> — đó chính là nhánh bị <em>BỎ QUA</em>. (4) <strong>Dùng <code>Skipcond 400</code> cho vòng đếm lùi có thể vượt qua 0</strong>: nếu bộ đếm bước qua 0 (chẳng hạn giảm 2), phép thử không bao giờ đúng và vòng lặp chạy mãi. Muốn diễn đạt "nhỏ hơn" thì dùng <code>Skipcond 000</code>.</p>`],

      [12, 'Figure 15.3 — Intel x86 Program Execution Registers (eight 32-bit general-purpose + six segment registers)',
        `<p class="y-chinh">🎯 The register file you must name in assembly, because in assembly the registers are <em>part of the language</em>. Compare this picture with MARIE's and the difference between a teaching machine and a real one becomes a single image.</p>
<table>
<tr><th>32-bit (with its 3-bit encoding)</th><th>16-bit name</th><th>8-bit halves</th><th>Conventional job</th></tr>
<tr><td><strong>EAX</strong> (000)</td><td>AX</td><td>AH · AL</td><td>Accumulator — return values, arithmetic</td></tr>
<tr><td><strong>ECX</strong> (001)</td><td>CX</td><td>CH · CL</td><td>Counter — loop and string repeat count</td></tr>
<tr><td><strong>EDX</strong> (010)</td><td>DX</td><td>DH · DL</td><td>Data — high half of multiply/divide, I/O port</td></tr>
<tr><td><strong>EBX</strong> (011)</td><td>BX</td><td>BH · BL</td><td>Base — a base address</td></tr>
<tr><td><strong>ESP</strong> (100)</td><td>—</td><td>—</td><td>Stack pointer</td></tr>
<tr><td><strong>EBP</strong> (101)</td><td>—</td><td>—</td><td>Base pointer — the current stack frame</td></tr>
<tr><td><strong>ESI</strong> (110)</td><td>—</td><td>—</td><td>Source index — source of a string operation</td></tr>
<tr><td><strong>EDI</strong> (111)</td><td>—</td><td>—</td><td>Destination index — destination of a string operation</td></tr>
</table>
<ul>
<li><strong>The nested-name structure (EAX / AX / AH / AL) is the figure's real lesson.</strong> One 32-bit register can be addressed as its low 16 bits, and that 16-bit half as two 8-bit quarters. This is backwards compatibility made physical: the same silicon serves an 8086, an 80386 and a modern chip, and it is exactly what slide 4 meant by "assembly reflects the bit length of the registers".</li>
<li><strong>The 3-bit codes in brackets are the register numbers inside the machine instruction.</strong> That is how a register operand is encoded — three bits, eight registers, 2<sup>3</sup> = 8. Register names are not decoration; they are a field in the opcode.</li>
<li><strong>The lower box: six 16-bit segment registers</strong> — <strong>CS</strong> (code), <strong>DS</strong> (data), <strong>SS</strong> (stack), <strong>ES</strong>, <strong>FS</strong>, <strong>GS</strong> (extra). They name which <em>region</em> of memory an address is measured from. Slide 18's <code>SECTION</code>/<code>SEGMENT</code> directive exists to feed these.</li>
<li><strong>Only some registers are truly general.</strong> ECX is the counter for <code>REP</code>, ESI/EDI are fixed for string instructions (Table 15.3, slide 23), ESP is the stack pointer and you corrupt it at your peril. "General-purpose" means "you may use it for anything" — it does not mean the instruction set treats them identically.</li>
</ul>
<p class="nhan">📐 <strong>The same picture for MARIE — seven registers, and you can see every one of them on screen while the program runs.</strong> This is what the trace tables in this lesson are showing:</p>
<table>
<tr><th>Register</th><th>Width</th><th>What it holds</th><th>Where it appears in a trace row</th></tr>
<tr><td><strong>AC</strong> — accumulator</td><td>16 bits</td><td>Every arithmetic result; the implicit second operand of every instruction</td><td>column AC</td></tr>
<tr><td><strong>PC</strong> — program counter</td><td>12 bits</td><td>Address of the <em>next</em> instruction</td><td>columns PC and "next PC"</td></tr>
<tr><td><strong>IR</strong> — instruction register</td><td>16 bits</td><td>The instruction currently being executed</td><td>the "Instruction" column, decoded</td></tr>
<tr><td><strong>MAR</strong> — memory address register</td><td>12 bits</td><td>The address memory is being asked about right now</td><td>column MAR</td></tr>
<tr><td><strong>MBR</strong> — memory buffer register</td><td>16 bits</td><td>The word travelling to or from memory</td><td>column MBR</td></tr>
<tr><td><strong>InREG / OutREG</strong></td><td>16 bits</td><td>Keyboard input · display output</td><td>the Input / Output panes</td></tr>
</table>
<p class="dap-an">✅ Trace one row of slide 9's table against Chapter 3's instruction cycle and the two courses fuse. Step 1, <code>LOAD N</code> at PC = 100: <em>fetch</em> — MAR ← PC = 100, IR ← M[100] = 110D, PC ← 101; <em>decode</em> — opcode 1 is Load, so it needs an operand: MAR ← IR[11:0] = 10D, MBR ← M[10D] = 0003; <em>execute</em> — AC ← MBR = 3. Every MAR and MBR value printed in this lesson's trace tables was produced by a simulator implementing exactly those steps. <strong>MARIE is the instruction cycle of Chapter 3 with a window cut into it.</strong></p>
<p class="pitfall">⚠️ Trap when you read a trace by hand: MAR and MBR are <em>not cleared</em> between instructions. On a no-operand instruction (<code>Output</code>, <code>Halt</code>, <code>Skipcond</code>) the fetch stage never touches them, so they still show the leftovers from the previous instruction. Do not read meaning into a stale MBR — check the opcode's "needs an operand?" column on slide 10 first.</p>`,
        `<p class="y-chinh">🎯 Tập thanh ghi mà bạn buộc phải gọi tên trong hợp ngữ, vì trong hợp ngữ thanh ghi là <em>MỘT PHẦN CỦA NGÔN NGỮ</em>. Đặt hình này cạnh hình của MARIE là khác biệt giữa máy để dạy và máy thật hiện ra chỉ trong một bức ảnh.</p>
<table>
<tr><th>32 bit (kèm mã 3 bit của nó)</th><th>Tên 16 bit</th><th>Hai nửa 8 bit</th><th>Việc theo quy ước</th></tr>
<tr><td><strong>EAX</strong> (000)</td><td>AX</td><td>AH · AL</td><td>Accumulator — giá trị trả về, số học</td></tr>
<tr><td><strong>ECX</strong> (001)</td><td>CX</td><td>CH · CL</td><td>Counter — bộ đếm vòng lặp và số lần lặp lệnh chuỗi</td></tr>
<tr><td><strong>EDX</strong> (010)</td><td>DX</td><td>DH · DL</td><td>Data — nửa cao của nhân/chia, cổng vào ra</td></tr>
<tr><td><strong>EBX</strong> (011)</td><td>BX</td><td>BH · BL</td><td>Base — một địa chỉ nền</td></tr>
<tr><td><strong>ESP</strong> (100)</td><td>—</td><td>—</td><td>Con trỏ ngăn xếp</td></tr>
<tr><td><strong>EBP</strong> (101)</td><td>—</td><td>—</td><td>Con trỏ nền — khung ngăn xếp hiện tại</td></tr>
<tr><td><strong>ESI</strong> (110)</td><td>—</td><td>—</td><td>Chỉ số nguồn — nguồn của phép toán trên chuỗi</td></tr>
<tr><td><strong>EDI</strong> (111)</td><td>—</td><td>—</td><td>Chỉ số đích — đích của phép toán trên chuỗi</td></tr>
</table>
<ul>
<li><strong>Cấu trúc tên lồng nhau (EAX / AX / AH / AL) mới là bài học thật của hình.</strong> Một thanh ghi 32 bit có thể được gọi theo 16 bit thấp của nó, và cái nửa 16 bit ấy lại gọi theo hai phần tư 8 bit. Đây là tính tương thích ngược được vật chất hoá: cùng một mảnh silicon phục vụ 8086, 80386 và cả chip hiện đại, và đó chính xác là điều slide 4 muốn nói khi bảo "hợp ngữ phản ánh độ dài bit của thanh ghi".</li>
<li><strong>Mã 3 bit trong ngoặc là SỐ HIỆU thanh ghi nằm bên trong lệnh máy.</strong> Đó là cách một toán hạng thanh ghi được mã hoá — ba bit, tám thanh ghi, 2<sup>3</sup> = 8. Tên thanh ghi không phải đồ trang trí; nó là một trường trong mã lệnh.</li>
<li><strong>Ô dưới: sáu thanh ghi đoạn 16 bit</strong> — <strong>CS</strong> (mã), <strong>DS</strong> (dữ liệu), <strong>SS</strong> (ngăn xếp), <strong>ES</strong>, <strong>FS</strong>, <strong>GS</strong> (phụ). Chúng chỉ ra địa chỉ được đo từ <em>VÙNG</em> nào của bộ nhớ. Chỉ thị <code>SECTION</code>/<code>SEGMENT</code> ở slide 18 tồn tại để nuôi chính mấy thanh ghi này.</li>
<li><strong>Chỉ một số thanh ghi là thật sự đa dụng.</strong> ECX là bộ đếm của <code>REP</code>, ESI/EDI bị cố định cho lệnh chuỗi (Table 15.3, slide 23), ESP là con trỏ ngăn xếp và bạn phá nó là gánh hậu quả. "Đa dụng" nghĩa là "bạn được dùng nó cho việc gì cũng được" — chứ không có nghĩa tập lệnh đối xử với chúng như nhau.</li>
</ul>
<p class="nhan">📐 <strong>Bức hình tương ứng cho MARIE — bảy thanh ghi, và bạn NHÌN THẤY từng cái trên màn hình trong lúc chương trình chạy.</strong> Đây chính là thứ các bảng vết trong bài này đang trưng ra:</p>
<table>
<tr><th>Thanh ghi</th><th>Độ rộng</th><th>Chứa gì</th><th>Xuất hiện ở đâu trong một dòng vết</th></tr>
<tr><td><strong>AC</strong> — thanh ghi tích luỹ</td><td>16 bit</td><td>Mọi kết quả số học; toán hạng thứ hai ngầm định của mọi lệnh</td><td>cột AC</td></tr>
<tr><td><strong>PC</strong> — bộ đếm chương trình</td><td>12 bit</td><td>Địa chỉ lệnh <em>KẾ TIẾP</em></td><td>cột PC và "PC mới"</td></tr>
<tr><td><strong>IR</strong> — thanh ghi lệnh</td><td>16 bit</td><td>Lệnh đang được thi hành</td><td>cột "Lệnh", đã giải mã</td></tr>
<tr><td><strong>MAR</strong> — thanh ghi địa chỉ bộ nhớ</td><td>12 bit</td><td>Địa chỉ mà bộ nhớ đang bị hỏi tới ngay lúc này</td><td>cột MAR</td></tr>
<tr><td><strong>MBR</strong> — thanh ghi đệm bộ nhớ</td><td>16 bit</td><td>Từ dữ liệu đang đi tới hoặc đi khỏi bộ nhớ</td><td>cột MBR</td></tr>
<tr><td><strong>InREG / OutREG</strong></td><td>16 bit</td><td>Nhập từ bàn phím · xuất ra màn hình</td><td>khung Input / Output</td></tr>
</table>
<p class="dap-an">✅ Lần theo một dòng của bảng ở slide 9 rồi đối chiếu với chu trình lệnh của Chương 3 là hai môn hoà làm một. Bước 1, <code>LOAD N</code> tại PC = 100: <em>nạp lệnh</em> — MAR ← PC = 100, IR ← M[100] = 110D, PC ← 101; <em>giải mã</em> — mã lệnh 1 là Load nên cần toán hạng: MAR ← IR[11:0] = 10D, MBR ← M[10D] = 0003; <em>thi hành</em> — AC ← MBR = 3. Mọi giá trị MAR và MBR in trong các bảng vết của bài này đều do một máy mô phỏng hiện thực đúng những bước đó sinh ra. <strong>MARIE là chu trình lệnh của Chương 3 với một ô cửa sổ khoét vào.</strong></p>
<p class="pitfall">⚠️ Bẫy khi bạn đọc bảng vết bằng tay: MAR và MBR <em>KHÔNG bị xoá</em> giữa các lệnh. Với lệnh không có toán hạng (<code>Output</code>, <code>Halt</code>, <code>Skipcond</code>), giai đoạn nạp lệnh không hề đụng vào chúng, nên chúng vẫn hiện đồ thừa của lệnh TRƯỚC. Đừng gán ý nghĩa cho một MBR cũ — hãy xem cột "cần toán hạng?" của slide 10 trước đã.</p>`],

      [13, 'Statements (1 of 2) — Comment',
        `<p class="y-chinh">🎯 <strong>"All assembly languages allow the placement of comments in the program."</strong> The slide then states four mechanical facts, and the reason behind all of them is one word from slide 5: <em>maintainability</em>.</p>
<ul>
<li><strong>Fact 1 — a comment can sit at the right-hand end of a statement, or occupy an entire line.</strong> Both forms; you will use both.</li>
<li><strong>Fact 2 — it begins with a <em>special character</em> that signals to the assembler that the rest of the line is a comment.</strong> The character is a per-assembler choice, not part of any standard.</li>
<li><strong>Fact 3 — the rest of the line "is to be <em>ignored</em> by the assembler".</strong> A comment produces no bits at all. It costs nothing in the object code.</li>
<li><strong>Fact 4 — "typically, assembly languages for the x86 architecture use a <em>semicolon</em> (;)".</strong> MARIE uses a <strong>slash</strong> (<code>/</code>). Note the shipped example <code>simulateRegister.mas</code> uses <code>//</code>, which works because everything after the first slash is ignored anyway.</li>
</ul>
<ul>
<li><strong>Why comments matter more here than in any other language you know.</strong> An assembly line tells you <em>what</em> happens, never <em>why</em>. <code>Load Sum</code> says "put location 10E in the accumulator"; it cannot say "start accumulating this iteration's total". In C the variable name and the expression carry the intent; in assembly you must write it yourself or it is gone forever.</li>
<li><strong>The rule that survives the exam and your job: comment the <em>intent</em>, not the mnemonic.</strong> <code>Add One / add one</code> is worthless. <code>Add One / move the pointer to the next element</code> is the comment that lets you find a bug six weeks later.</li>
<li><strong>A commenting discipline that works for MARIE.</strong> One line at the top saying what the program computes; one line per <em>block</em> (setup / loop head / loop body / exit); and a comment on every <code>Skipcond</code> stating the condition in words, because that is where readers get lost.</li>
</ul>
<p class="nhan">📐 <strong>A complete, fully commented MARIE program — summing an array through a pointer.</strong> This is the shape of the classic lab exercise (the textbook's Example 4.1, shipped as <code>Ex4_1.mas</code> with the simulator), shortened to three values so the whole run fits on a page. Save it as <code>p3.mas</code>:</p>
<pre><code>        ORG 100
        Load   Addr      / AC &lt;- address of the first element
        Store  Next      / Next is our moving pointer
        Load   Num       / how many values to add
        Subt   One
        Store  Ctr       / Ctr &lt;- Num - 1  (a countdown to -1)
Loop,   Load   Sum       / -- loop body: Sum &lt;- Sum + *Next --
        AddI   Next      / INDIRECT: AC &lt;- AC + M[M[Next]]
        Store  Sum
        Load   Next      / -- advance the pointer --
        Add    One
        Store  Next
        Load   Ctr       / -- decrement the counter --
        Subt   One
        Store  Ctr
        Skipcond 000     / Ctr &lt; 0 ?  then we are done
        Jump   Loop      / otherwise go round again
        Load   Sum       / -- exit --
        Output
        Halt   000
Addr,   Hex    119       / address of the first value
Next,   Hex    0         / pointer, filled in at run time
Num,    Dec    3         / number of values
Sum,    Dec    0         / running total
Ctr,    Hex    0         / loop counter
One,    Dec    1         / the constant 1
        Dec    10        / -- the data --
        Dec    15
        Dec    20</code></pre>
<p class="nhan">📐 Trace of the setup plus the <strong>first loop iteration</strong> (steps 1–16 of 40). Watch <code>AddI</code> at step 7 — it touches memory <em>twice</em>:</p>
<table>
<tr><th>#</th><th>PC</th><th>Instruction</th><th>AC</th><th>MAR</th><th>MBR</th><th>Memory changed</th></tr>
<tr><td>1</td><td>100</td><td>LOAD Addr</td><td>281</td><td>113</td><td>0119</td><td>AC now holds the <em>address</em> 119 (= 281 decimal)</td></tr>
<tr><td>2</td><td>101</td><td>STORE Next</td><td>281</td><td>114</td><td>0119</td><td>M[114] = 0119</td></tr>
<tr><td>3</td><td>102</td><td>LOAD Num</td><td>3</td><td>115</td><td>0003</td><td></td></tr>
<tr><td>4</td><td>103</td><td>SUBT One</td><td>2</td><td>118</td><td>0001</td><td></td></tr>
<tr><td>5</td><td>104</td><td>STORE Ctr</td><td>2</td><td>117</td><td>0002</td><td>M[117] = 0002</td></tr>
<tr><td>6</td><td>105</td><td>LOAD Sum</td><td>0</td><td>116</td><td>0000</td><td></td></tr>
<tr><td>7</td><td>106</td><td><strong>ADDI Next</strong></td><td><strong>10</strong></td><td><strong>119</strong></td><td>000A</td><td>MAR became 114 → read 0119 → MAR became <strong>119</strong> → read 000A = 10</td></tr>
<tr><td>8</td><td>107</td><td>STORE Sum</td><td>10</td><td>116</td><td>000A</td><td>M[116] = 000A</td></tr>
<tr><td>9</td><td>108</td><td>LOAD Next</td><td>281</td><td>114</td><td>0119</td><td></td></tr>
<tr><td>10</td><td>109</td><td>ADD One</td><td>282</td><td>118</td><td>0001</td><td></td></tr>
<tr><td>11</td><td>10A</td><td>STORE Next</td><td>282</td><td>114</td><td>011A</td><td>M[114] = 011A — pointer moved</td></tr>
<tr><td>12</td><td>10B</td><td>LOAD Ctr</td><td>2</td><td>117</td><td>0002</td><td></td></tr>
<tr><td>13</td><td>10C</td><td>SUBT One</td><td>1</td><td>118</td><td>0001</td><td></td></tr>
<tr><td>14</td><td>10D</td><td>STORE Ctr</td><td>1</td><td>117</td><td>0001</td><td>M[117] = 0001</td></tr>
<tr><td>15</td><td>10E</td><td>SKIPCOND 000</td><td>1</td><td>10E</td><td>0001</td><td>AC not &lt; 0 → no skip</td></tr>
<tr><td>16</td><td>10F</td><td>JUMP Loop</td><td>1</td><td>10F</td><td>0001</td><td>back to 105</td></tr>
</table>
<p class="nhan">📐 State at the end of each iteration:</p>
<table>
<tr><th>Iteration</th><th>Value added</th><th>Sum</th><th>Next (pointer)</th><th>Ctr</th><th>Skipcond 000 fires?</th></tr>
<tr><td>1 (steps 6–16)</td><td>M[119] = 10</td><td>10</td><td>11A</td><td>1</td><td>no</td></tr>
<tr><td>2 (steps 17–27)</td><td>M[11A] = 15</td><td>25</td><td>11B</td><td>0</td><td>no</td></tr>
<tr><td>3 (steps 28–36)</td><td>M[11B] = 20</td><td><strong>45</strong></td><td>11C</td><td><strong>−1</strong></td><td><strong>YES</strong> — skips the Jump, exits</td></tr>
</table>
<p class="dap-an">✅ 40 steps, OUTPUT = <strong>45</strong> = 10 + 15 + 20. Three things to take away. (1) <code>AddI</code> is <strong>indirect addressing</strong> from Chapter 11/14, as a single instruction: the operand field names <code>Next</code>, <code>Next</code> holds an address, and the data lives there. (2) A pointer in MARIE is <em>just an integer you can add 1 to</em> — step 10 does <code>Add One</code> to a value that is an address. (3) The loop exits on <code>Skipcond 000</code> with Ctr = −1, not 0: counting down from Num−1 to −1 executes the body exactly Num times.</p>
<p class="pitfall">⚠️ The bug this program was written with, and it is worth repeating because you will hit it. The first draft had <code>Addr, Hex 116</code> — the address of <code>Sum</code>, not of the data — and it ran to completion, printed <strong>2</strong>, and reported no error whatsoever. An off-by-one in a pointer is invisible in assembly: there is no type to violate. <em>And</em> the file shipped with the simulator has the same class of defect in its comment — <code>Ex4_1.mas</code> says "numbers to be summed start at location 118" while the assembler's own listing puts the first value at <strong>117</strong>. Trust the <code>.lst</code>, not the comment.</p>`,
        `<p class="y-chinh">🎯 <strong>"Mọi hợp ngữ đều cho phép đặt chú thích trong chương trình."</strong> Rồi slide nêu bốn sự kiện máy móc, và lý do đằng sau cả bốn là một chữ ở slide 5: <em>khả năng bảo trì</em>.</p>
<ul>
<li><strong>Sự kiện 1 — chú thích có thể nằm ở cuối bên phải một câu lệnh, hoặc chiếm trọn một dòng.</strong> Cả hai dạng; bạn sẽ dùng cả hai.</li>
<li><strong>Sự kiện 2 — nó bắt đầu bằng một <em>KÝ TỰ ĐẶC BIỆT</em> báo cho trình hợp dịch biết phần còn lại của dòng là chú thích.</strong> Ký tự đó do từng trình hợp dịch chọn, không phải một chuẩn nào cả.</li>
<li><strong>Sự kiện 3 — phần còn lại của dòng "bị trình hợp dịch <em>BỎ QUA</em>".</strong> Chú thích không sinh ra bit nào. Nó không tốn gì trong mã đối tượng.</li>
<li><strong>Sự kiện 4 — "thường thì hợp ngữ cho kiến trúc x86 dùng <em>DẤU CHẤM PHẨY</em> (;)".</strong> MARIE dùng <strong>DẤU GẠCH CHÉO</strong> (<code>/</code>). Để ý file ví dụ <code>simulateRegister.mas</code> đi kèm dùng <code>//</code>, và nó vẫn chạy vì mọi thứ sau dấu gạch chéo ĐẦU TIÊN đằng nào cũng bị bỏ qua.</li>
</ul>
<ul>
<li><strong>Vì sao chú thích ở đây quan trọng hơn mọi ngôn ngữ bạn từng biết.</strong> Một dòng hợp ngữ cho bạn biết <em>CÁI GÌ</em> xảy ra, không bao giờ cho biết <em>VÌ SAO</em>. <code>Load Sum</code> nói "đưa ô 10E vào thanh ghi tích luỹ"; nó không nói được "bắt đầu cộng dồn tổng của lượt này". Trong C thì tên biến và biểu thức mang theo ý định; trong hợp ngữ bạn phải tự viết ra, không thì nó mất vĩnh viễn.</li>
<li><strong>Quy tắc sống sót qua cả kỳ thi lẫn công việc: chú thích <em>Ý ĐỊNH</em>, đừng chú thích lại mã gợi nhớ.</strong> <code>Add One / cong mot</code> là vô giá trị. <code>Add One / doi con tro sang phan tu ke tiep</code> mới là chú thích giúp bạn tìm ra lỗi sáu tuần sau.</li>
<li><strong>Một kỷ luật chú thích hợp với MARIE.</strong> Một dòng trên đầu nói chương trình tính cái gì; một dòng cho mỗi <em>KHỐI</em> (chuẩn bị / đỉnh vòng lặp / thân vòng lặp / lối ra); và một chú thích trên MỌI <code>Skipcond</code> phát biểu điều kiện bằng lời, vì đó là chỗ người đọc lạc đường.</li>
</ul>
<p class="nhan">📐 <strong>Một chương trình MARIE hoàn chỉnh, chú thích đầy đủ — cộng dồn một dãy số qua con trỏ.</strong> Đây là dáng của bài lab kinh điển (Example 4.1 của giáo trình, đi kèm trình mô phỏng dưới tên <code>Ex4_1.mas</code>), rút còn ba giá trị để cả lượt chạy vừa một trang. Lưu thành <code>p3.mas</code>:</p>
<pre><code>        ORG 100
        Load   Addr      / AC &lt;- dia chi phan tu dau tien
        Store  Next      / Next la con tro chay
        Load   Num       / co bao nhieu gia tri
        Subt   One
        Store  Ctr       / Ctr &lt;- Num - 1  (dem lui toi -1)
Loop,   Load   Sum       / -- than vong lap: Sum &lt;- Sum + *Next --
        AddI   Next      / GIAN TIEP: AC &lt;- AC + M[M[Next]]
        Store  Sum
        Load   Next      / -- day con tro toi --
        Add    One
        Store  Next
        Load   Ctr       / -- giam bo dem --
        Subt   One
        Store  Ctr
        Skipcond 000     / Ctr &lt; 0 ?  thi xong
        Jump   Loop      / khong thi quay lai
        Load   Sum       / -- loi ra --
        Output
        Halt   000
Addr,   Hex    119       / dia chi gia tri dau tien
Next,   Hex    0         / con tro, dien luc chay
Num,    Dec    3         / so luong gia tri
Sum,    Dec    0         / tong dang cong don
Ctr,    Hex    0         / bo dem vong lap
One,    Dec    1         / hang so 1
        Dec    10        / -- du lieu --
        Dec    15
        Dec    20</code></pre>
<p class="nhan">📐 Bảng vết phần chuẩn bị cộng <strong>vòng lặp thứ nhất</strong> (bước 1–16 trong tổng 40). Nhìn kỹ <code>AddI</code> ở bước 7 — nó chạm bộ nhớ <em>HAI LẦN</em>:</p>
<table>
<tr><th>#</th><th>PC</th><th>Lệnh</th><th>AC</th><th>MAR</th><th>MBR</th><th>Ô nhớ đổi</th></tr>
<tr><td>1</td><td>100</td><td>LOAD Addr</td><td>281</td><td>113</td><td>0119</td><td>AC đang giữ một <em>ĐỊA CHỈ</em> 119 (= 281 hệ mười)</td></tr>
<tr><td>2</td><td>101</td><td>STORE Next</td><td>281</td><td>114</td><td>0119</td><td>M[114] = 0119</td></tr>
<tr><td>3</td><td>102</td><td>LOAD Num</td><td>3</td><td>115</td><td>0003</td><td></td></tr>
<tr><td>4</td><td>103</td><td>SUBT One</td><td>2</td><td>118</td><td>0001</td><td></td></tr>
<tr><td>5</td><td>104</td><td>STORE Ctr</td><td>2</td><td>117</td><td>0002</td><td>M[117] = 0002</td></tr>
<tr><td>6</td><td>105</td><td>LOAD Sum</td><td>0</td><td>116</td><td>0000</td><td></td></tr>
<tr><td>7</td><td>106</td><td><strong>ADDI Next</strong></td><td><strong>10</strong></td><td><strong>119</strong></td><td>000A</td><td>MAR thành 114 → đọc 0119 → MAR thành <strong>119</strong> → đọc 000A = 10</td></tr>
<tr><td>8</td><td>107</td><td>STORE Sum</td><td>10</td><td>116</td><td>000A</td><td>M[116] = 000A</td></tr>
<tr><td>9</td><td>108</td><td>LOAD Next</td><td>281</td><td>114</td><td>0119</td><td></td></tr>
<tr><td>10</td><td>109</td><td>ADD One</td><td>282</td><td>118</td><td>0001</td><td></td></tr>
<tr><td>11</td><td>10A</td><td>STORE Next</td><td>282</td><td>114</td><td>011A</td><td>M[114] = 011A — con trỏ đã dịch</td></tr>
<tr><td>12</td><td>10B</td><td>LOAD Ctr</td><td>2</td><td>117</td><td>0002</td><td></td></tr>
<tr><td>13</td><td>10C</td><td>SUBT One</td><td>1</td><td>118</td><td>0001</td><td></td></tr>
<tr><td>14</td><td>10D</td><td>STORE Ctr</td><td>1</td><td>117</td><td>0001</td><td>M[117] = 0001</td></tr>
<tr><td>15</td><td>10E</td><td>SKIPCOND 000</td><td>1</td><td>10E</td><td>0001</td><td>AC không &lt; 0 → không bỏ qua</td></tr>
<tr><td>16</td><td>10F</td><td>JUMP Loop</td><td>1</td><td>10F</td><td>0001</td><td>quay về 105</td></tr>
</table>
<p class="nhan">📐 Trạng thái cuối mỗi vòng:</p>
<table>
<tr><th>Vòng</th><th>Giá trị được cộng</th><th>Sum</th><th>Next (con trỏ)</th><th>Ctr</th><th>Skipcond 000 có nổ?</th></tr>
<tr><td>1 (bước 6–16)</td><td>M[119] = 10</td><td>10</td><td>11A</td><td>1</td><td>không</td></tr>
<tr><td>2 (bước 17–27)</td><td>M[11A] = 15</td><td>25</td><td>11B</td><td>0</td><td>không</td></tr>
<tr><td>3 (bước 28–36)</td><td>M[11B] = 20</td><td><strong>45</strong></td><td>11C</td><td><strong>−1</strong></td><td><strong>CÓ</strong> — bỏ qua lệnh Jump, thoát</td></tr>
</table>
<p class="dap-an">✅ 40 bước, OUTPUT = <strong>45</strong> = 10 + 15 + 20. Ba điều mang về. (1) <code>AddI</code> chính là <strong>ĐỊA CHỈ GIÁN TIẾP</strong> của Chương 11/14, gói trong một lệnh: trường toán hạng gọi tên <code>Next</code>, <code>Next</code> chứa một địa chỉ, và dữ liệu nằm ở đó. (2) Con trỏ trong MARIE <em>chỉ là một số nguyên mà bạn cộng thêm 1 vào</em> — bước 10 làm <code>Add One</code> lên một giá trị vốn là địa chỉ. (3) Vòng lặp thoát khi <code>Skipcond 000</code> thấy Ctr = −1, không phải 0: đếm lùi từ Num−1 xuống −1 làm thân vòng chạy đúng Num lần.</p>
<p class="pitfall">⚠️ Cái lỗi mà chính chương trình này đã mắc lúc viết, và đáng kể lại vì bạn sẽ gặp. Bản nháp đầu ghi <code>Addr, Hex 116</code> — địa chỉ của <code>Sum</code> chứ không phải của dữ liệu — và nó chạy tới hết, in ra <strong>2</strong>, không báo một lỗi nào. Lệch một ô trong con trỏ là vô hình trong hợp ngữ: không có kiểu nào để mà vi phạm. <em>Và</em> chính file đi kèm trình mô phỏng cũng dính đúng loại khuyết tật đó ở chú thích — <code>Ex4_1.mas</code> viết "các số cần cộng bắt đầu ở ô 118" trong khi listing của chính trình hợp dịch đặt giá trị đầu tiên ở <strong>117</strong>. Hãy tin file <code>.lst</code>, đừng tin chú thích.</p>`],

      [14, 'Statements (2 of 2) — Pseudo-instructions',
        `<p class="y-chinh">🎯 The statements that are <strong>not instructions</strong>. In the slide's words: pseudo-instructions "though not real x86 machine instructions, are used in the instruction field anyway because that's the most convenient place to put them" — and they "are <em>not directly translated</em> into machine language instructions".</p>
<ul>
<li><strong>The slide's own definition of what they are instead.</strong> "Directives are <em>instructions to the assembler</em> to perform specified actions during the assembly process." The audience is the translator, not the processor. That single sentence separates them from everything on slide 10.</li>
<li><strong>The five uses the slide lists.</strong> Define constants · designate areas of memory for data storage · initialize areas of memory · place tables or other fixed data in memory · allow references to other programs.</li>
<li><strong>Notice the asymmetry in that list.</strong> The first four <em>do</em> put bytes in the output file — they just do not put <em>instructions</em> there. The fifth (references to other programs) puts nothing at all in memory; it only leaves a note for the <strong>linker</strong> (slide 18's <code>EXTERN</code>/<code>GLOBAL</code>). So "produces no output" is the wrong test; "is addressed to the assembler" is the right one.</li>
<li><strong>Why they sit in the mnemonic field.</strong> Figure 15.2 already told you: the mnemonic slot may hold an opcode name, a directive name, or a macro name. Reusing one column keeps the source in neat rows — the "most convenient place" the slide mentions.</li>
</ul>
<p class="nhan">📐 <strong>MARIE's complete set of directives — five of them, and your lab needs all but one.</strong> Read from the assembler's own instruction table:</p>
<table>
<tr><th>Directive</th><th>What it tells the assembler</th><th>What lands in memory</th><th>Example</th></tr>
<tr><td><strong>ORG</strong> addr</td><td>Set the <em>location counter</em> — start placing everything from this address</td><td>Nothing itself; it moves where the next word goes</td><td><code>ORG 100</code> → the first instruction is at 100</td></tr>
<tr><td><strong>DEC</strong> n</td><td>Place this <em>decimal</em> value here</td><td>One word</td><td><code>One, Dec 1</code> → <code>0001</code></td></tr>
<tr><td><strong>HEX</strong> n</td><td>Place this <em>hexadecimal</em> value here</td><td>One word</td><td><code>Addr, Hex 119</code> → <code>0119</code></td></tr>
<tr><td><strong>OCT</strong> n</td><td>Place this <em>octal</em> value here</td><td>One word</td><td><code>Mask, Oct 777</code></td></tr>
<tr><td><strong>END</strong></td><td>End of source — stop reading</td><td>Nothing</td><td>the last line of <code>Ex4_3.mas</code></td></tr>
</table>
<ul>
<li><strong><code>ORG</code> is the purest directive in the whole course.</strong> It emits not one bit, yet it changes the address of every single instruction after it. It <em>is</em> the location counter of pass 1, exposed to the programmer. Remove <code>ORG 100</code> from the programs in this lesson and every address in every listing shifts to start at 000 — the code is identical, the machine words are not.</li>
<li><strong><code>DEC</code>, <code>HEX</code> and <code>OCT</code> differ only in how <em>you</em> write the number.</strong> <code>Dec 20</code> and <code>Hex 14</code> produce the identical word <code>0014</code>. Choose the base that makes your intent readable: <code>Hex</code> for addresses and bit patterns, <code>Dec</code> for quantities.</li>
<li><strong>They are also the only way to get a constant into a MARIE program</strong> (slide 11: there is no immediate operand). Every <code>One, Dec 1</code> you have seen in this lesson exists because <code>Subt 1</code> is not legal — <code>Subt One</code> is, and <code>One</code> is a memory location a directive created.</li>
<li><strong>The x86 equivalents are on the next slide.</strong> <code>DB/DW/DD/DQ/DT</code> initialise, <code>RESB/RESW/…</code> reserve without initialising, <code>EQU</code> defines a constant name. MARIE has no "reserve without initialising" — you write <code>Dec 0</code> and mean "scratch space", which is exactly what <code>Sum, Dec 0</code> and <code>Ctr, Hex 0</code> do.</li>
</ul>
<p class="pitfall">⚠️ The classic beginner catastrophe, and directives are where it starts. <strong>Directives that place data must come <em>after</em> your <code>Halt</code>, never in the middle of the code.</strong> The processor does not know a word is "data" — it executes whatever the PC points at. Put <code>N, Dec 3</code> between two instructions and MARIE will happily fetch <code>0003</code>, decode opcode 0 as <code>JnS</code>, and jump somewhere insane. Every working program in this lesson has the same shape: <code>ORG</code>, code, <code>Halt</code>, then data.</p>
<p class="meo">💡 Test for telling an instruction from a directive in any assembly language: <strong>ask who is listening.</strong> If the sentence is addressed to the CPU at run time it is an instruction; if it is addressed to the assembler at translate time it is a directive. <code>Add One</code> speaks to the CPU. <code>One, Dec 1</code> speaks to the assembler.</p>`,
        `<p class="y-chinh">🎯 Những câu lệnh <strong>KHÔNG PHẢI lệnh</strong>. Theo chữ của slide: pseudo-instruction "tuy không phải lệnh máy x86 thật, vẫn được đặt vào trường lệnh vì đó là chỗ tiện nhất để đặt chúng" — và chúng "<em>KHÔNG được dịch trực tiếp</em> thành lệnh ngôn ngữ máy".</p>
<ul>
<li><strong>Chính slide định nghĩa chúng LÀ GÌ thay vào đó.</strong> "Chỉ thị là <em>MỆNH LỆNH GỬI CHO TRÌNH HỢP DỊCH</em> để nó thực hiện những hành động xác định trong quá trình hợp dịch." Người nghe là cái máy dịch, không phải bộ xử lý. Riêng câu đó tách chúng khỏi mọi thứ ở slide 10.</li>
<li><strong>Năm công dụng slide kể.</strong> Định nghĩa hằng · chỉ định vùng nhớ để chứa dữ liệu · khởi tạo vùng nhớ · đặt bảng hoặc dữ liệu cố định khác vào bộ nhớ · cho phép tham chiếu tới chương trình khác.</li>
<li><strong>Để ý sự bất đối xứng trong danh sách đó.</strong> Bốn cái đầu <em>CÓ</em> đặt byte vào tệp ra — chỉ là chúng không đặt <em>LỆNH</em> vào đó. Cái thứ năm (tham chiếu tới chương trình khác) chẳng đặt gì vào bộ nhớ cả; nó chỉ để lại một mẩu ghi chú cho <strong>TRÌNH LIÊN KẾT</strong> (<code>EXTERN</code>/<code>GLOBAL</code> ở slide 18). Vậy "không sinh ra đầu ra" là phép thử SAI; "gửi cho trình hợp dịch" mới là phép thử ĐÚNG.</li>
<li><strong>Vì sao chúng ngồi trong trường mã gợi nhớ.</strong> Figure 15.2 đã nói rồi: ô mã gợi nhớ có thể chứa tên mã lệnh, tên chỉ thị, hoặc tên macro. Dùng chung một cột giữ cho mã nguồn thành hàng lối gọn gàng — đúng cái "chỗ tiện nhất" mà slide nhắc.</li>
</ul>
<p class="nhan">📐 <strong>Trọn bộ chỉ thị của MARIE — năm cái, và bài lab của bạn cần bốn.</strong> Đọc từ chính bảng lệnh trong trình hợp dịch:</p>
<table>
<tr><th>Chỉ thị</th><th>Nó bảo trình hợp dịch điều gì</th><th>Cái gì rơi vào bộ nhớ</th><th>Ví dụ</th></tr>
<tr><td><strong>ORG</strong> addr</td><td>Đặt <em>BỘ ĐẾM VỊ TRÍ</em> — bắt đầu xếp mọi thứ từ địa chỉ này</td><td>Bản thân nó không gì cả; nó dời chỗ của từ kế tiếp</td><td><code>ORG 100</code> → lệnh đầu tiên nằm ở 100</td></tr>
<tr><td><strong>DEC</strong> n</td><td>Đặt giá trị hệ <em>MƯỜI</em> này vào đây</td><td>Một từ</td><td><code>One, Dec 1</code> → <code>0001</code></td></tr>
<tr><td><strong>HEX</strong> n</td><td>Đặt giá trị hệ <em>MƯỜI SÁU</em> này vào đây</td><td>Một từ</td><td><code>Addr, Hex 119</code> → <code>0119</code></td></tr>
<tr><td><strong>OCT</strong> n</td><td>Đặt giá trị hệ <em>TÁM</em> này vào đây</td><td>Một từ</td><td><code>Mask, Oct 777</code></td></tr>
<tr><td><strong>END</strong></td><td>Hết mã nguồn — ngừng đọc</td><td>Không gì</td><td>dòng cuối của <code>Ex4_3.mas</code></td></tr>
</table>
<ul>
<li><strong><code>ORG</code> là chỉ thị thuần khiết nhất trong cả môn.</strong> Nó không phát ra một bit nào, vậy mà nó đổi địa chỉ của từng lệnh phía sau. Nó CHÍNH LÀ bộ đếm vị trí của lượt 1, phơi ra cho người lập trình dùng. Bỏ <code>ORG 100</code> khỏi các chương trình trong bài này thì mọi địa chỉ trong mọi listing dịch xuống bắt đầu từ 000 — mã y nguyên, từ máy thì khác.</li>
<li><strong><code>DEC</code>, <code>HEX</code> và <code>OCT</code> chỉ khác nhau ở cách <em>BẠN</em> viết con số.</strong> <code>Dec 20</code> và <code>Hex 14</code> sinh ra cùng một từ <code>0014</code>. Hãy chọn hệ cơ số làm ý định của bạn dễ đọc: <code>Hex</code> cho địa chỉ và mẫu bit, <code>Dec</code> cho số lượng.</li>
<li><strong>Chúng cũng là cách DUY NHẤT đưa một hằng số vào chương trình MARIE</strong> (slide 11: không có toán hạng tức thời). Mọi dòng <code>One, Dec 1</code> bạn thấy trong bài này tồn tại vì <code>Subt 1</code> là bất hợp lệ — <code>Subt One</code> thì hợp lệ, và <code>One</code> là một ô nhớ do chỉ thị tạo ra.</li>
<li><strong>Bản tương đương bên x86 nằm ở slide kế.</strong> <code>DB/DW/DD/DQ/DT</code> khởi tạo, <code>RESB/RESW/…</code> dành chỗ mà không khởi tạo, <code>EQU</code> định nghĩa tên hằng. MARIE không có "dành chỗ không khởi tạo" — bạn viết <code>Dec 0</code> và ngầm hiểu là "chỗ nháp", đúng như <code>Sum, Dec 0</code> và <code>Ctr, Hex 0</code> đang làm.</li>
</ul>
<p class="pitfall">⚠️ Thảm hoạ kinh điển của người mới, và chỉ thị là chỗ nó bắt đầu. <strong>Chỉ thị đặt DỮ LIỆU phải nằm <em>SAU</em> lệnh <code>Halt</code>, tuyệt đối không nằm giữa mã.</strong> Bộ xử lý không biết một từ là "dữ liệu" — nó thi hành bất cứ thứ gì PC trỏ vào. Đặt <code>N, Dec 3</code> vào giữa hai lệnh thì MARIE sẽ vui vẻ nạp <code>0003</code>, giải mã mã lệnh 0 thành <code>JnS</code>, rồi nhảy tới một chỗ điên rồ. Mọi chương trình chạy được trong bài này đều cùng một dáng: <code>ORG</code>, mã, <code>Halt</code>, rồi mới tới dữ liệu.</p>
<p class="meo">💡 Phép thử phân biệt lệnh với chỉ thị trong bất kỳ hợp ngữ nào: <strong>hỏi xem AI đang nghe.</strong> Câu đó gửi cho CPU lúc CHẠY thì là lệnh; gửi cho trình hợp dịch lúc DỊCH thì là chỉ thị. <code>Add One</code> nói với CPU. <code>One, Dec 1</code> nói với trình hợp dịch.</p>`],

      [15, 'Table 15.2 — Some NASM Assembly-Language Directives: (a) letters for RESx and Dx, (b) the directives themselves',
        `<p class="y-chinh">🎯 The concrete NASM directives that do the four "put something in memory" jobs slide 14 listed. Part (a) is the naming scheme; part (b) is the table you will actually look things up in.</p>
<p class="nhan">📐 <strong>(a) Letters for RESx and Dx directives</strong> — one letter per size, and the letter is simply glued onto the directive name:</p>
<table>
<tr><th>Unit</th><th>Letter</th><th>Size</th><th>Gives you</th></tr>
<tr><td>byte</td><td><strong>B</strong></td><td>1 byte</td><td><code>DB</code> · <code>RESB</code></td></tr>
<tr><td>word</td><td><strong>W</strong></td><td>2 bytes</td><td><code>DW</code> · <code>RESW</code></td></tr>
<tr><td>double word</td><td><strong>D</strong></td><td>4 bytes</td><td><code>DD</code> · <code>RESD</code></td></tr>
<tr><td>quad word</td><td><strong>Q</strong></td><td>8 bytes</td><td><code>DQ</code> · <code>RESQ</code></td></tr>
<tr><td>ten bytes</td><td><strong>T</strong></td><td>10 bytes</td><td><code>DT</code> · <code>REST</code></td></tr>
</table>
<p class="nhan">📐 <strong>(b) The directives</strong>, with the slide's own examples:</p>
<table>
<tr><th>Name</th><th>Description</th><th>Example (from the slide)</th></tr>
<tr><td><strong>DB, DW, DD, DQ, DT</strong></td><td>Initialize locations</td><td><code>L6 DD 1A92H</code> — doubleword at L6 initialized to 1A92H</td></tr>
<tr><td><strong>RESB, RESW, RESD, RESQ, REST</strong></td><td>Reserve <em>uninitialized</em> locations</td><td><code>BUFFER RESB 64</code> — reserve 64 bytes starting at BUFFER</td></tr>
<tr><td><strong>INCBIN</strong></td><td>Include a binary file in the output</td><td><code>INCBIN "file.dat"</code></td></tr>
<tr><td><strong>EQU</strong></td><td>Define a symbol to a given constant value</td><td><code>MSGLEN EQU 25</code> — the constant MSGLEN equals decimal 25</td></tr>
<tr><td><strong>TIMES</strong></td><td>Repeat an instruction multiple times</td><td><code>ZEROBUF TIMES 64 DB 0</code> — initialize a 64-byte buffer to all zeros</td></tr>
</table>
<ul>
<li><strong>The D-versus-RES split is the point of part (a), and it is a real distinction in the object file.</strong> <code>DB</code> writes bytes <em>into</em> the file; <code>RESB</code> only records "leave me 64 bytes here", so the file stays small and the space is created at load time. A 1 MB zero-filled buffer costs 1 MB with <code>DB</code> and a few bytes with <code>RESB</code>.</li>
<li><strong><code>EQU</code> is the one directive that puts nothing anywhere.</strong> It adds a name to the symbol table and that is all — the name is substituted wherever it appears. This is exactly the symbol table of slide 9, being written to by the programmer instead of by a label.</li>
<li><strong><code>TIMES</code> breaks the one-to-one rule of slide 4.</strong> One source line, 64 bytes of output. So does <code>INCBIN</code>, which can drop a megabyte in from a file. Keep this in mind for slide 16: macros are the same kind of one-to-many statement.</li>
<li><strong>The sizes tell you the machine.</strong> A "word" is 2 bytes here because x86's word was 16 bits in 1978 and the name stuck. MARIE's word is 16 bits too — but on a 64-bit ARM a "word" means something else again. <em>Word size is a per-architecture fact, never a universal one.</em></li>
</ul>
<p class="nhan">📐 Side by side with the MARIE directives of slide 14:</p>
<table>
<tr><th>Job</th><th>NASM / x86</th><th>MARIE</th></tr>
<tr><td>Put a value in memory</td><td><code>DB 5</code> / <code>DD 1A92H</code></td><td><code>Dec 5</code> / <code>Hex 1A92</code></td></tr>
<tr><td>Reserve space without a value</td><td><code>RESB 64</code></td><td>no equivalent — write <code>Dec 0</code></td></tr>
<tr><td>Name a constant</td><td><code>MSGLEN EQU 25</code></td><td>no equivalent — use a labelled <code>Dec</code> and <code>Load</code> it</td></tr>
<tr><td>Set the placement address</td><td><code>SECTION</code> / <code>ORG</code></td><td><code>ORG 100</code></td></tr>
<tr><td>Repeat</td><td><code>TIMES 64 DB 0</code></td><td>no equivalent — write 64 lines, or a loop</td></tr>
</table>
<p class="dap-an">✅ Worked reading of the slide's own example: <code>L6 DD 1A92H</code>. <code>L6</code> is a <strong>label</strong> (slide 9) — it names this address. <code>DD</code> is a <strong>directive</strong> (slide 14) in the mnemonic field — allocate a double word. <code>1A92H</code> is the <strong>operand</strong> (slide 11) — an immediate constant, the <code>H</code> suffix saying hexadecimal. Four fields, one line, exactly Figure 15.2. If you can take that line apart, you can take apart any assembly statement in this course.</p>
<p class="pitfall">⚠️ Reading trap: <code>BUFFER RESB 64</code> reserves <strong>64 bytes</strong>, while <code>TIMES 64 DB 0</code> writes <strong>64 zero bytes</strong>. Both produce a 64-byte area; only the second one guarantees its contents. Reading uninitialised reserved space gives whatever was in memory — the assembly-level version of the uninitialised-variable bug from PRF192.</p>`,
        `<p class="y-chinh">🎯 Những chỉ thị NASM cụ thể làm bốn việc "đặt cái gì đó vào bộ nhớ" mà slide 14 liệt kê. Phần (a) là quy tắc đặt tên; phần (b) mới là cái bảng bạn sẽ thật sự tra.</p>
<p class="nhan">📐 <strong>(a) Chữ cái cho các chỉ thị RESx và Dx</strong> — mỗi cỡ một chữ, và chữ đó được dán thẳng vào tên chỉ thị:</p>
<table>
<tr><th>Đơn vị</th><th>Chữ</th><th>Kích thước</th><th>Cho ra</th></tr>
<tr><td>byte</td><td><strong>B</strong></td><td>1 byte</td><td><code>DB</code> · <code>RESB</code></td></tr>
<tr><td>word (từ)</td><td><strong>W</strong></td><td>2 byte</td><td><code>DW</code> · <code>RESW</code></td></tr>
<tr><td>double word (từ kép)</td><td><strong>D</strong></td><td>4 byte</td><td><code>DD</code> · <code>RESD</code></td></tr>
<tr><td>quad word (từ bốn)</td><td><strong>Q</strong></td><td>8 byte</td><td><code>DQ</code> · <code>RESQ</code></td></tr>
<tr><td>mười byte</td><td><strong>T</strong></td><td>10 byte</td><td><code>DT</code> · <code>REST</code></td></tr>
</table>
<p class="nhan">📐 <strong>(b) Các chỉ thị</strong>, kèm ví dụ của chính slide:</p>
<table>
<tr><th>Tên</th><th>Mô tả</th><th>Ví dụ (trên slide)</th></tr>
<tr><td><strong>DB, DW, DD, DQ, DT</strong></td><td>Khởi tạo ô nhớ</td><td><code>L6 DD 1A92H</code> — từ kép tại L6 được khởi tạo bằng 1A92H</td></tr>
<tr><td><strong>RESB, RESW, RESD, RESQ, REST</strong></td><td>Dành trước ô nhớ <em>KHÔNG khởi tạo</em></td><td><code>BUFFER RESB 64</code> — dành 64 byte bắt đầu từ BUFFER</td></tr>
<tr><td><strong>INCBIN</strong></td><td>Nhét một tệp nhị phân vào đầu ra</td><td><code>INCBIN "file.dat"</code></td></tr>
<tr><td><strong>EQU</strong></td><td>Định nghĩa một ký hiệu bằng một giá trị hằng</td><td><code>MSGLEN EQU 25</code> — hằng MSGLEN bằng 25 hệ mười</td></tr>
<tr><td><strong>TIMES</strong></td><td>Lặp một lệnh nhiều lần</td><td><code>ZEROBUF TIMES 64 DB 0</code> — khởi tạo bộ đệm 64 byte toàn số 0</td></tr>
</table>
<ul>
<li><strong>Cặp D-với-RES là điểm mấu chốt của phần (a), và nó là khác biệt THẬT trong tệp đối tượng.</strong> <code>DB</code> ghi byte <em>VÀO</em> tệp; <code>RESB</code> chỉ ghi lại "chừa cho tôi 64 byte ở đây", nên tệp vẫn nhỏ và chỗ trống được tạo ra lúc NẠP. Một bộ đệm 1 MB toàn số 0 tốn 1 MB nếu dùng <code>DB</code> và vài byte nếu dùng <code>RESB</code>.</li>
<li><strong><code>EQU</code> là chỉ thị duy nhất không đặt gì vào đâu cả.</strong> Nó thêm một cái tên vào bảng ký hiệu, hết. Tên đó được thế vào mọi chỗ nó xuất hiện. Đây đúng là bảng ký hiệu của slide 9, nhưng do người lập trình ghi vào thay vì do một cái nhãn.</li>
<li><strong><code>TIMES</code> phá luật một-đối-một của slide 4.</strong> Một dòng nguồn, 64 byte đầu ra. <code>INCBIN</code> cũng vậy, nó có thể thả cả megabyte vào từ một tệp. Nhớ điều này cho slide 16: macro cũng là loại câu lệnh một-thành-nhiều như thế.</li>
<li><strong>Các kích thước cho biết bạn đang ở máy nào.</strong> "Word" ở đây là 2 byte vì word của x86 là 16 bit từ năm 1978 và cái tên dính lại. Word của MARIE cũng 16 bit — nhưng trên ARM 64 bit, "word" lại nghĩa khác nữa. <em>Kích thước từ là sự kiện của TỪNG kiến trúc, không bao giờ là hằng số phổ quát.</em></li>
</ul>
<p class="nhan">📐 Đặt cạnh các chỉ thị MARIE của slide 14:</p>
<table>
<tr><th>Việc cần làm</th><th>NASM / x86</th><th>MARIE</th></tr>
<tr><td>Đặt một giá trị vào bộ nhớ</td><td><code>DB 5</code> / <code>DD 1A92H</code></td><td><code>Dec 5</code> / <code>Hex 1A92</code></td></tr>
<tr><td>Dành chỗ mà không có giá trị</td><td><code>RESB 64</code></td><td>không có — viết <code>Dec 0</code></td></tr>
<tr><td>Đặt tên cho một hằng</td><td><code>MSGLEN EQU 25</code></td><td>không có — dùng một dòng <code>Dec</code> có nhãn rồi <code>Load</code></td></tr>
<tr><td>Đặt địa chỉ xếp mã</td><td><code>SECTION</code> / <code>ORG</code></td><td><code>ORG 100</code></td></tr>
<tr><td>Lặp lại</td><td><code>TIMES 64 DB 0</code></td><td>không có — viết 64 dòng, hoặc một vòng lặp</td></tr>
</table>
<p class="dap-an">✅ Đọc trọn ví dụ của chính slide: <code>L6 DD 1A92H</code>. <code>L6</code> là <strong>NHÃN</strong> (slide 9) — nó đặt tên cho địa chỉ này. <code>DD</code> là <strong>CHỈ THỊ</strong> (slide 14) nằm ở trường mã gợi nhớ — cấp phát một từ kép. <code>1A92H</code> là <strong>TOÁN HẠNG</strong> (slide 11) — một hằng tức thời, hậu tố <code>H</code> nói rằng đó là hệ mười sáu. Bốn trường, một dòng, đúng y Figure 15.2. Tháo được dòng đó ra là bạn tháo được mọi câu lệnh hợp ngữ trong môn này.</p>
<p class="pitfall">⚠️ Bẫy khi đọc: <code>BUFFER RESB 64</code> DÀNH TRƯỚC <strong>64 byte</strong>, còn <code>TIMES 64 DB 0</code> GHI <strong>64 byte số 0</strong>. Cả hai đều cho một vùng 64 byte; chỉ cái thứ hai bảo đảm nội dung. Đọc vùng dành trước chưa khởi tạo thì nhận được bất cứ thứ gì còn sót trong bộ nhớ — đúng là phiên bản mức hợp ngữ của lỗi biến chưa khởi tạo ở PRF192.</p>`],

      [16, 'Macro Definitions (1 of 2) — a macro compared with a subroutine',
        `<p class="y-chinh">🎯 The slide teaches macros by comparison: <strong>"A macro definition is similar to a subroutine in several ways"</strong> — then isolates the one difference that changes everything.</p>
<table>
<tr><th></th><th>Subroutine</th><th>Macro</th></tr>
<tr><td><strong>Written</strong></td><td>Once</td><td>Once</td></tr>
<tr><td><strong>Used</strong></td><td>Many times, by calling it from any point</td><td>Many times</td></tr>
<tr><td><strong>Loaded into memory</strong></td><td><strong>Only once</strong></td><td>Once <em>per use</em> — the text is copied in</td></tr>
<tr><td><strong>How control moves</strong></td><td>A call transfers control there; a <em>return</em> instruction brings control back to the point of call</td><td>No transfer at all — the code is simply <em>there</em></td></tr>
<tr><td><strong>When it happens</strong></td><td><strong>Run time</strong></td><td><strong>Assembly time</strong> — "macros are handled by the assembler"</td></tr>
<tr><td><strong>Cost</strong></td><td>Runtime overhead of the call and the return</td><td>"Uses more space in the object code"</td></tr>
</table>
<ul>
<li><strong>The sentence to memorise, in the slide's words:</strong> "when the assembler encounters a macro call, it <em>replaces the macro call with the macro itself</em>. This process is called <strong>macro expansion</strong>."</li>
<li><strong>And the trade-off, also in the slide's words:</strong> macros "provide the same advantage as subroutines in terms of modular programming, but <em>without the runtime overhead</em> of a subroutine call and return. The tradeoff is that the macro approach <em>uses more space</em> in the object code."</li>
<li><strong>So it is time versus space, and the exam asks it exactly that way.</strong> Subroutine = small program, slower. Macro = bigger program, faster. Call a 3-instruction macro from 50 places and you get 150 instructions; call a 3-instruction subroutine from 50 places and you get 3 instructions plus 50 calls and returns.</li>
<li><strong>The deeper difference is <em>who</em> does the work.</strong> A macro is finished before the program ever runs — the processor never knows a macro existed. A subroutine is a run-time structure: there is a real jump, a real return address stored somewhere, and it is visible in a trace. This is the same "who is listening" test from slide 14, applied again.</li>
<li><strong>If this feels familiar from C, it should.</strong> <code>#define SQUARE(x) ((x)*(x))</code> is a macro handled by the preprocessor <em>before</em> compilation; <code>int square(int x)</code> is a function called at run time. Identical distinction, one layer up.</li>
</ul>
<p class="nhan">📐 <strong>MARIE has no macro facility — but it does have subroutines, and they are on the exam.</strong> The mechanism is the pair <code>JnS</code> / <code>JumpI</code> from slide 10. <code>JnS X</code> stores the current PC (the return address) at address X, then jumps to X+1. <code>JumpI X</code> reads the address stored at X and jumps there — the return. Program <code>p5.mas</code>, doubling two numbers through one subroutine:</p>
<pre><code>        ORG 100
        Load   X
        Store  Temp      / pass the argument in Temp
        JnS    Subr      / call: save return address, jump to Subr+1
        Store  X         / X is now doubled
        Load   Y
        Store  Temp
        JnS    Subr      / call the SAME code a second time
        Store  Y
        Halt   000
X,      Dec    20
Y,      Dec    48
Temp,   Dec    0
Subr,   Hex    0         / the return address is stored HERE
        Load   Temp      / -- body of the subroutine --
        Add    Temp      / AC = 2 x Temp
        JumpI  Subr      / return: PC &lt;- M[Subr]</code></pre>
<p class="nhan">📐 Full trace — 15 steps. Watch address 10C (<code>Subr</code>): it is a <em>data</em> word that the program writes to at run time:</p>
<table>
<tr><th>#</th><th>PC</th><th>Instruction</th><th>AC</th><th>MAR</th><th>MBR</th><th>next PC</th><th>Memory changed</th></tr>
<tr><td>1</td><td>100</td><td>LOAD X</td><td>20</td><td>109</td><td>0014</td><td>101</td><td></td></tr>
<tr><td>2</td><td>101</td><td>STORE Temp</td><td>20</td><td>10B</td><td>0014</td><td>102</td><td>M[10B] = 0014</td></tr>
<tr><td>3</td><td>102</td><td><strong>JNS Subr</strong></td><td>20</td><td>10C</td><td>0000</td><td><strong>10D</strong></td><td><strong>M[10C] = 0103</strong> — the return address</td></tr>
<tr><td>4</td><td>10D</td><td>LOAD Temp</td><td>20</td><td>10B</td><td>0014</td><td>10E</td><td></td></tr>
<tr><td>5</td><td>10E</td><td>ADD Temp</td><td><strong>40</strong></td><td>10B</td><td>0014</td><td>10F</td><td></td></tr>
<tr><td>6</td><td>10F</td><td><strong>JUMPI Subr</strong></td><td>40</td><td>10C</td><td>0103</td><td><strong>103</strong></td><td>returns to where it was called from</td></tr>
<tr><td>7</td><td>103</td><td>STORE X</td><td>40</td><td>109</td><td>0028</td><td>104</td><td>M[109] = 0028 (40)</td></tr>
<tr><td>8</td><td>104</td><td>LOAD Y</td><td>48</td><td>10A</td><td>0030</td><td>105</td><td></td></tr>
<tr><td>9</td><td>105</td><td>STORE Temp</td><td>48</td><td>10B</td><td>0030</td><td>106</td><td>M[10B] = 0030</td></tr>
<tr><td>10</td><td>106</td><td><strong>JNS Subr</strong></td><td>48</td><td>10C</td><td>0103</td><td>10D</td><td><strong>M[10C] = 0107</strong> — a <em>different</em> return address</td></tr>
<tr><td>11</td><td>10D</td><td>LOAD Temp</td><td>48</td><td>10B</td><td>0030</td><td>10E</td><td>the same three instructions, reused</td></tr>
<tr><td>12</td><td>10E</td><td>ADD Temp</td><td><strong>96</strong></td><td>10B</td><td>0030</td><td>10F</td><td></td></tr>
<tr><td>13</td><td>10F</td><td>JUMPI Subr</td><td>96</td><td>10C</td><td>0107</td><td><strong>107</strong></td><td>returns to the <em>second</em> call site</td></tr>
<tr><td>14</td><td>107</td><td>STORE Y</td><td>96</td><td>10A</td><td>0060</td><td>108</td><td>M[10A] = 0060 (96)</td></tr>
<tr><td>15</td><td>108</td><td>HALT 000</td><td>96</td><td>108</td><td>0060</td><td>—</td><td>stops</td></tr>
</table>
<p class="dap-an">✅ X: 20 → <strong>40</strong>, Y: 48 → <strong>96</strong>, and the subroutine body at 10D–10F appears in memory <strong>exactly once</strong> but executes twice. That is the slide's "loaded only once". Compare rows 3 and 10: the same <code>JnS</code> instruction stored <em>different</em> return addresses (0103, then 0107), and the same <code>JumpI</code> at step 6 and step 13 therefore went to different places. Had this been a macro, the three instructions would have been <em>copied</em> to both call sites and there would be no <code>JnS</code>, no <code>JumpI</code> and no return address at all — and the trace would be two instructions shorter per call.</p>
<p class="pitfall">⚠️ Two things about MARIE subroutines that catch everyone. (1) <strong>The label <code>Subr</code> is not the first instruction</strong> — it is the word that <em>holds the return address</em>, and the code starts at <code>Subr+1</code>. That is why it is declared as <code>Subr, Hex 0</code>: a data word, not an instruction. (2) <strong>They do not nest and they are not recursive.</strong> There is one return-address slot per subroutine, so if the subroutine calls itself the second <code>JnS</code> overwrites the first return address and the program can never get home. No stack, no recursion — which is precisely what Chapter 9's stack discussion is for.</p>`,
        `<p class="y-chinh">🎯 Slide dạy macro bằng phép so sánh: <strong>"Định nghĩa macro giống chương trình con ở vài điểm"</strong> — rồi tách ra đúng một khác biệt làm đảo lộn mọi thứ.</p>
<table>
<tr><th></th><th>Chương trình con (subroutine)</th><th>Macro</th></tr>
<tr><td><strong>Viết</strong></td><td>Một lần</td><td>Một lần</td></tr>
<tr><td><strong>Dùng</strong></td><td>Nhiều lần, bằng cách GỌI từ bất kỳ điểm nào</td><td>Nhiều lần</td></tr>
<tr><td><strong>Nạp vào bộ nhớ</strong></td><td><strong>CHỈ MỘT LẦN</strong></td><td>Một lần cho <em>MỖI LẦN DÙNG</em> — đoạn chữ bị chép vào</td></tr>
<tr><td><strong>Điều khiển di chuyển ra sao</strong></td><td>Một lời gọi chuyển điều khiển tới đó; lệnh <em>TRẢ VỀ</em> đưa điều khiển quay lại điểm gọi</td><td>Không chuyển gì cả — mã ĐƠN GIẢN LÀ nằm ngay đó</td></tr>
<tr><td><strong>Xảy ra lúc nào</strong></td><td><strong>LÚC CHẠY</strong></td><td><strong>LÚC HỢP DỊCH</strong> — "macro do trình hợp dịch xử lý"</td></tr>
<tr><td><strong>Cái giá</strong></td><td>Chi phí lúc chạy của việc gọi và trả về</td><td>"Tốn nhiều chỗ hơn trong mã đối tượng"</td></tr>
</table>
<ul>
<li><strong>Câu phải thuộc, theo đúng chữ của slide:</strong> "khi trình hợp dịch gặp một lời gọi macro, nó <em>THAY lời gọi macro bằng CHÍNH cái macro</em>. Quá trình này gọi là <strong>macro expansion</strong> (bung macro)."</li>
<li><strong>Và sự đánh đổi, cũng theo chữ của slide:</strong> macro "cho cùng cái lợi như chương trình con về mặt lập trình mô-đun, nhưng <em>KHÔNG có chi phí lúc chạy</em> của việc gọi và trả về. Đổi lại, cách dùng macro <em>TỐN NHIỀU CHỖ HƠN</em> trong mã đối tượng."</li>
<li><strong>Vậy đây là THỜI GIAN đổi lấy KHÔNG GIAN, và đề thi hỏi đúng như thế.</strong> Chương trình con = chương trình nhỏ, chạy chậm hơn. Macro = chương trình to hơn, chạy nhanh hơn. Gọi một macro 3 lệnh từ 50 chỗ thì ra 150 lệnh; gọi một chương trình con 3 lệnh từ 50 chỗ thì ra 3 lệnh cộng 50 lần gọi và trả về.</li>
<li><strong>Khác biệt sâu hơn là ở chỗ AI làm việc.</strong> Macro xong xuôi TRƯỚC KHI chương trình chạy — bộ xử lý không bao giờ biết là có macro tồn tại. Chương trình con là cấu trúc lúc CHẠY: có một cú nhảy thật, một địa chỉ trả về thật lưu ở đâu đó, và nó HIỆN RA trong bảng vết. Vẫn là phép thử "ai đang nghe" của slide 14, áp dụng lại.</li>
<li><strong>Nếu bạn thấy quen từ C thì đúng là quen.</strong> <code>#define SQUARE(x) ((x)*(x))</code> là macro do bộ tiền xử lý làm <em>TRƯỚC</em> khi biên dịch; <code>int square(int x)</code> là hàm được gọi lúc chạy. Y hệt sự phân biệt này, chỉ cao hơn một tầng.</li>
</ul>
<p class="nhan">📐 <strong>MARIE không có macro — nhưng nó CÓ chương trình con, và phần đó có trong đề thi.</strong> Cơ chế là cặp <code>JnS</code> / <code>JumpI</code> ở slide 10. <code>JnS X</code> lưu PC hiện tại (địa chỉ trả về) vào ô X rồi nhảy tới X+1. <code>JumpI X</code> đọc địa chỉ đang nằm ở X rồi nhảy tới đó — chính là lệnh trả về. Chương trình <code>p5.mas</code>, nhân đôi hai số bằng MỘT chương trình con:</p>
<pre><code>        ORG 100
        Load   X
        Store  Temp      / truyen tham so qua Temp
        JnS    Subr      / GOI: luu dia chi tra ve, nhay toi Subr+1
        Store  X         / X da duoc nhan doi
        Load   Y
        Store  Temp
        JnS    Subr      / goi CHINH doan ma do lan thu hai
        Store  Y
        Halt   000
X,      Dec    20
Y,      Dec    48
Temp,   Dec    0
Subr,   Hex    0         / dia chi tra ve duoc luu O DAY
        Load   Temp      / -- than chuong trinh con --
        Add    Temp      / AC = 2 x Temp
        JumpI  Subr      / TRA VE: PC &lt;- M[Subr]</code></pre>
<p class="nhan">📐 Bảng vết đầy đủ — 15 bước. Để ý ô 10C (<code>Subr</code>): nó là một từ <em>DỮ LIỆU</em> mà chương trình tự ghi vào lúc chạy:</p>
<table>
<tr><th>#</th><th>PC</th><th>Lệnh</th><th>AC</th><th>MAR</th><th>MBR</th><th>PC mới</th><th>Ô nhớ đổi</th></tr>
<tr><td>1</td><td>100</td><td>LOAD X</td><td>20</td><td>109</td><td>0014</td><td>101</td><td></td></tr>
<tr><td>2</td><td>101</td><td>STORE Temp</td><td>20</td><td>10B</td><td>0014</td><td>102</td><td>M[10B] = 0014</td></tr>
<tr><td>3</td><td>102</td><td><strong>JNS Subr</strong></td><td>20</td><td>10C</td><td>0000</td><td><strong>10D</strong></td><td><strong>M[10C] = 0103</strong> — địa chỉ trả về</td></tr>
<tr><td>4</td><td>10D</td><td>LOAD Temp</td><td>20</td><td>10B</td><td>0014</td><td>10E</td><td></td></tr>
<tr><td>5</td><td>10E</td><td>ADD Temp</td><td><strong>40</strong></td><td>10B</td><td>0014</td><td>10F</td><td></td></tr>
<tr><td>6</td><td>10F</td><td><strong>JUMPI Subr</strong></td><td>40</td><td>10C</td><td>0103</td><td><strong>103</strong></td><td>quay về đúng chỗ đã gọi</td></tr>
<tr><td>7</td><td>103</td><td>STORE X</td><td>40</td><td>109</td><td>0028</td><td>104</td><td>M[109] = 0028 (40)</td></tr>
<tr><td>8</td><td>104</td><td>LOAD Y</td><td>48</td><td>10A</td><td>0030</td><td>105</td><td></td></tr>
<tr><td>9</td><td>105</td><td>STORE Temp</td><td>48</td><td>10B</td><td>0030</td><td>106</td><td>M[10B] = 0030</td></tr>
<tr><td>10</td><td>106</td><td><strong>JNS Subr</strong></td><td>48</td><td>10C</td><td>0103</td><td>10D</td><td><strong>M[10C] = 0107</strong> — một địa chỉ trả về <em>KHÁC</em></td></tr>
<tr><td>11</td><td>10D</td><td>LOAD Temp</td><td>48</td><td>10B</td><td>0030</td><td>10E</td><td>vẫn ba lệnh đó, dùng lại</td></tr>
<tr><td>12</td><td>10E</td><td>ADD Temp</td><td><strong>96</strong></td><td>10B</td><td>0030</td><td>10F</td><td></td></tr>
<tr><td>13</td><td>10F</td><td>JUMPI Subr</td><td>96</td><td>10C</td><td>0107</td><td><strong>107</strong></td><td>quay về chỗ gọi <em>THỨ HAI</em></td></tr>
<tr><td>14</td><td>107</td><td>STORE Y</td><td>96</td><td>10A</td><td>0060</td><td>108</td><td>M[10A] = 0060 (96)</td></tr>
<tr><td>15</td><td>108</td><td>HALT 000</td><td>96</td><td>108</td><td>0060</td><td>—</td><td>dừng</td></tr>
</table>
<p class="dap-an">✅ X: 20 → <strong>40</strong>, Y: 48 → <strong>96</strong>, và thân chương trình con ở 10D–10F nằm trong bộ nhớ <strong>ĐÚNG MỘT LẦN</strong> nhưng được thi hành HAI lần. Đó chính là câu "chỉ nạp một lần" của slide. So dòng 3 với dòng 10: cùng một lệnh <code>JnS</code> đã lưu HAI địa chỉ trả về <em>KHÁC NHAU</em> (0103 rồi 0107), nên cùng một lệnh <code>JumpI</code> ở bước 6 và bước 13 đi tới hai nơi khác nhau. Nếu đây là MACRO thì ba lệnh kia đã bị <em>CHÉP</em> vào cả hai chỗ gọi, và sẽ không có <code>JnS</code>, không có <code>JumpI</code>, không có địa chỉ trả về nào cả — bảng vết ngắn đi hai lệnh cho mỗi lần gọi.</p>
<p class="pitfall">⚠️ Hai điều về chương trình con MARIE làm ai cũng vấp. (1) <strong>Nhãn <code>Subr</code> KHÔNG phải lệnh đầu tiên</strong> — nó là cái ô <em>CHỨA ĐỊA CHỈ TRẢ VỀ</em>, và mã bắt đầu từ <code>Subr+1</code>. Vì thế nó mới được khai là <code>Subr, Hex 0</code>: một từ dữ liệu, không phải một lệnh. (2) <strong>Chúng KHÔNG lồng nhau và KHÔNG đệ quy được.</strong> Mỗi chương trình con chỉ có một ô chứa địa chỉ trả về, nên nếu nó tự gọi chính mình thì lệnh <code>JnS</code> thứ hai ghi đè lên địa chỉ trả về thứ nhất và chương trình không bao giờ về được nhà. Không ngăn xếp, không đệ quy — và đó chính xác là lý do Chương 9 bàn về ngăn xếp.</p>`],

      [17, 'Macro Definitions (2 of 2) — single-line vs multi-line macros in NASM',
        `<p class="y-chinh">🎯 Three overlapping circles, three sentences. NASM splits macros into <strong>two kinds</strong>, and gives each its own keyword.</p>
<table>
<tr><th>The slide's three statements</th></tr>
<tr><td>"In NASM and many other assemblers, a distinction is made between a <strong>single-line macro</strong> and a <strong>multi-line macro</strong>"</td></tr>
<tr><td>"In NASM, <strong>single-line</strong> macros are defined using the <strong>%DEFINE</strong> directive"</td></tr>
<tr><td>"<strong>Multiline</strong> macros are defined using the mnemonic <strong>%MACRO</strong>"</td></tr>
</table>
<ul>
<li><strong>Why the distinction exists at all.</strong> A single-line macro is a pure textual substitution — one name in, one expression out; it needs no end marker. A multi-line macro is a block, so the assembler must be told where the block stops (<code>%endmacro</code>) and how many parameters to expect.</li>
<li><strong>The <code>%</code> prefix is doing a job.</strong> It marks these as <em>preprocessor</em> constructs — handled in a pass that runs before the assembler proper even starts counting addresses. That is why a macro name in the mnemonic field (Figure 15.2) is gone by the time pass 1 of slide 9 begins: by then the expansion has already happened.</li>
<li><strong>Shape of the two forms:</strong> <code>%define BUFSIZE 64</code> — every later <code>BUFSIZE</code> becomes <code>64</code>. Versus a block form that opens with <code>%macro name 2</code> (the 2 being the parameter count), contains the body with <code>%1</code> and <code>%2</code> standing for the arguments, and closes with <code>%endmacro</code>.</li>
<li><strong>Compare <code>%define</code> with <code>EQU</code> from slide 15 — they are not the same thing.</strong> <code>EQU</code> is an <em>assembler</em> directive that puts a value in the symbol table. <code>%define</code> is a <em>preprocessor</em> substitution that replaces text before the assembler sees it. <code>EQU</code> takes a value; <code>%define</code> can take parameters and can expand to anything at all.</li>
<li><strong>The C parallel is exact.</strong> <code>%define</code> ≈ <code>#define</code> object-like macro; <code>%macro</code>/<code>%endmacro</code> ≈ a function-like <code>#define</code> spread over lines. And the same classic bug transfers: a macro parameter used twice is <em>evaluated</em> twice, which is why C programmers parenthesise everything.</li>
</ul>
<p class="nhan">📐 Expansion, concretely. Suppose a macro <code>ADDTWO</code> whose body is three instructions and which is used four times in a program:</p>
<table>
<tr><th></th><th>Source lines you write</th><th>Machine instructions produced</th><th>Extra control transfers at run time</th></tr>
<tr><td><strong>As a macro</strong></td><td>3 (definition) + 4 (uses)</td><td>3 × 4 = <strong>12</strong></td><td><strong>0</strong></td></tr>
<tr><td><strong>As a subroutine</strong></td><td>3 + 1 (return) + 4 (calls)</td><td>4 + 4 = <strong>8</strong></td><td>4 calls + 4 returns = <strong>8</strong></td></tr>
</table>
<p class="dap-an">✅ This is slide 16's trade-off as arithmetic: the macro version is <strong>50% larger</strong> and has <strong>zero</strong> call overhead; the subroutine version is smaller and pays 8 extra control transfers. Neither is "better" — the right answer depends on whether you are short of memory or short of time, which is the same question Chapter 2 asked about performance.</p>
<p class="pitfall">⚠️ The trap that makes macros dangerous, and it is the reason the slide separates them from subroutines so carefully: <strong>a macro containing a label cannot be used twice</strong> unless the assembler renames the label on each expansion (NASM does this with the <code>%%</code> prefix). Expand a macro with a plain label at two sites and you have defined the same symbol twice — the duplicate-symbol error of slide 9, arriving from code you never wrote by hand.</p>`,
        `<p class="y-chinh">🎯 Ba vòng tròn chồng nhau, ba câu. NASM chia macro thành <strong>HAI LOẠI</strong>, và cho mỗi loại một từ khoá riêng.</p>
<table>
<tr><th>Ba câu trên slide</th></tr>
<tr><td>"Trong NASM và nhiều trình hợp dịch khác, người ta phân biệt <strong>macro MỘT DÒNG</strong> với <strong>macro NHIỀU DÒNG</strong>"</td></tr>
<tr><td>"Trong NASM, macro <strong>MỘT DÒNG</strong> được định nghĩa bằng chỉ thị <strong>%DEFINE</strong>"</td></tr>
<tr><td>"Macro <strong>NHIỀU DÒNG</strong> được định nghĩa bằng mã gợi nhớ <strong>%MACRO</strong>"</td></tr>
</table>
<ul>
<li><strong>Vì sao phải phân biệt.</strong> Macro một dòng là phép thế chữ thuần tuý — vào một cái tên, ra một biểu thức; nó không cần dấu kết thúc. Macro nhiều dòng là một KHỐI, nên phải báo cho trình hợp dịch biết khối dừng ở đâu (<code>%endmacro</code>) và nó chờ bao nhiêu tham số.</li>
<li><strong>Tiền tố <code>%</code> đang làm một việc thật.</strong> Nó đánh dấu đây là cấu trúc của <em>BỘ TIỀN XỬ LÝ</em> — được xử lý ở một lượt chạy TRƯỚC cả khi trình hợp dịch thật sự bắt đầu đếm địa chỉ. Vì thế một tên macro nằm trong trường mã gợi nhớ (Figure 15.2) đã BIẾN MẤT vào lúc lượt 1 của slide 9 bắt đầu: khi đó phép bung đã xảy ra xong rồi.</li>
<li><strong>Hình dáng hai dạng:</strong> <code>%define BUFSIZE 64</code> — mọi chữ <code>BUFSIZE</code> phía sau thành <code>64</code>. Còn dạng khối thì mở bằng <code>%macro ten 2</code> (số 2 là số tham số), chứa phần thân dùng <code>%1</code> và <code>%2</code> thay cho các đối số, rồi đóng bằng <code>%endmacro</code>.</li>
<li><strong>So <code>%define</code> với <code>EQU</code> của slide 15 — chúng KHÔNG cùng một thứ.</strong> <code>EQU</code> là chỉ thị của <em>TRÌNH HỢP DỊCH</em>, đặt một giá trị vào bảng ký hiệu. <code>%define</code> là phép thế của <em>BỘ TIỀN XỬ LÝ</em>, thay chữ trước khi trình hợp dịch nhìn thấy. <code>EQU</code> nhận một GIÁ TRỊ; <code>%define</code> nhận được cả tham số và bung ra thành bất cứ thứ gì.</li>
<li><strong>Đối chiếu với C thì khớp chính xác.</strong> <code>%define</code> ≈ <code>#define</code> dạng đối tượng; <code>%macro</code>/<code>%endmacro</code> ≈ một <code>#define</code> dạng hàm trải trên nhiều dòng. Và đúng cái lỗi kinh điển kia cũng chuyển sang: tham số macro dùng hai lần thì bị <em>TÍNH</em> hai lần, đó là lý do dân C đóng ngoặc mọi thứ.</li>
</ul>
<p class="nhan">📐 Phép bung, cụ thể bằng số. Giả sử một macro <code>ADDTWO</code> có thân ba lệnh và được dùng bốn lần trong chương trình:</p>
<table>
<tr><th></th><th>Số dòng nguồn bạn viết</th><th>Số lệnh máy sinh ra</th><th>Số lần chuyển điều khiển thêm lúc chạy</th></tr>
<tr><td><strong>Làm MACRO</strong></td><td>3 (định nghĩa) + 4 (lần dùng)</td><td>3 × 4 = <strong>12</strong></td><td><strong>0</strong></td></tr>
<tr><td><strong>Làm CHƯƠNG TRÌNH CON</strong></td><td>3 + 1 (trả về) + 4 (lời gọi)</td><td>4 + 4 = <strong>8</strong></td><td>4 lần gọi + 4 lần trả về = <strong>8</strong></td></tr>
</table>
<p class="dap-an">✅ Đây chính là sự đánh đổi của slide 16 viết thành phép tính: bản macro <strong>to hơn 50%</strong> và có <strong>KHÔNG</strong> chi phí gọi; bản chương trình con nhỏ hơn và phải trả 8 lần chuyển điều khiển thêm. Không bản nào "tốt hơn" — đáp án đúng tuỳ vào bạn đang thiếu bộ nhớ hay thiếu thời gian, cũng đúng câu hỏi mà Chương 2 đặt ra về hiệu năng.</p>
<p class="pitfall">⚠️ Cái bẫy khiến macro trở nên nguy hiểm, và là lý do slide tách chúng khỏi chương trình con kỹ đến thế: <strong>một macro có chứa NHÃN thì không dùng được hai lần</strong> trừ khi trình hợp dịch tự đổi tên nhãn ở mỗi lần bung (NASM làm việc đó bằng tiền tố <code>%%</code>). Bung một macro có nhãn thường ở hai chỗ là bạn vừa định nghĩa cùng một ký hiệu hai lần — đúng lỗi trùng ký hiệu ở slide 9, đến từ đoạn mã mà bạn chưa bao giờ gõ bằng tay.</p>`],

      [18, 'Directives — the NASM directive list (BITS, DEFAULT, SECTION/SEGMENT, EXTERN, GLOBAL, COMMON, CPU, FLOAT, [WARNING])',
        `<p class="y-chinh">🎯 The formal definition, then the catalogue. <strong>"A directive is a command embedded in the assembly source code that is <em>recognized and acted upon by the assembler</em>."</strong> Nine of them, and they sort into three clear families.</p>
<table>
<tr><th>Directive</th><th>What the slide says it does</th><th>Family</th></tr>
<tr><td><strong>BITS</strong></td><td>Specifies whether NASM should generate code designed to run on a processor operating in 16-bit, 32-bit or 64-bit mode</td><td>Target</td></tr>
<tr><td><strong>DEFAULT</strong></td><td>Can change some assembler defaults, such as whether to use relative or absolute addressing</td><td>Target</td></tr>
<tr><td><strong>CPU</strong></td><td>Restricts assembly to those instructions available on the specified CPU</td><td>Target</td></tr>
<tr><td><strong>FLOAT</strong></td><td>Allows the programmer to change some of the default settings to options other than those used in IEEE 754</td><td>Target</td></tr>
<tr><td><strong>SECTION</strong> or <strong>SEGMENT</strong></td><td>Changes which section of the output file the source code will be assembled into</td><td>Layout</td></tr>
<tr><td><strong>EXTERN</strong></td><td>Declares a symbol <em>not defined anywhere in this module</em>, but assumed to be defined in some other module and needed here</td><td>Linkage</td></tr>
<tr><td><strong>GLOBAL</strong></td><td>"The other end of EXTERN": if one module declares a symbol EXTERN and refers to it, some other module must actually define it and declare it GLOBAL — otherwise, linker errors</td><td>Linkage</td></tr>
<tr><td><strong>COMMON</strong></td><td>Used to declare common variables</td><td>Linkage</td></tr>
<tr><td><strong>[WARNING]</strong></td><td>Used to enable or disable classes of warnings</td><td>Diagnostics</td></tr>
</table>
<ul>
<li><strong>EXTERN and GLOBAL are the pair to actually understand, and the slide practically tells you why.</strong> They are the two halves of one handshake between separately assembled files. <code>EXTERN</code> says "I use this name, someone else defines it"; <code>GLOBAL</code> says "I define this name, others may use it". Forget the <code>GLOBAL</code> half and you get an <em>unresolved symbol</em> at link time — the classic error described on slide 30.</li>
<li><strong>This is where the symbol table of slide 9 stops being private.</strong> Inside one file, every symbol is resolved by pass 2. <code>EXTERN</code> is a symbol pass 2 is <em>allowed</em> to leave unresolved: it becomes a hole in the object file for the <strong>linker</strong> to fill. That is exactly the difference between object code and executable code from slide 2 — and, in one line, the reason linkers exist.</li>
<li><strong>The "Target" family is the assembler being told what machine it is aiming at.</strong> <code>BITS 64</code> versus <code>BITS 32</code> changes the encoding of the very same mnemonics. <code>CPU</code> makes the assembler reject instructions your target chip does not have — a compile-time guard against shipping code that crashes on older hardware.</li>
<li><strong><code>SECTION</code> feeds the segment registers of slide 12.</strong> <code>section .text</code> for code, <code>section .data</code> for initialised data, <code>section .bss</code> for reserved-but-uninitialised space (the natural home of the <code>RESB</code> family from slide 15). MARIE's single, flat, 4096-word memory has no sections — which is precisely why slide 14 warned you to keep data after <code>Halt</code> by hand.</li>
<li><strong>Directive versus pseudo-instruction, since both words are in this chapter.</strong> The slide uses them nearly interchangeably (slide 14: "directives are instructions to the assembler…"). Practical reading: <em>pseudo-instruction</em> emphasises that it sits in the instruction field looking like an instruction; <em>directive</em> emphasises that it commands the assembler. Same objects, two viewpoints.</li>
</ul>
<p class="meo">💡 Memorise them as three questions the assembler needs answered. <strong>"Which machine?"</strong> → BITS, CPU, DEFAULT, FLOAT. <strong>"Which part of the file?"</strong> → SECTION/SEGMENT. <strong>"Who else is involved?"</strong> → EXTERN, GLOBAL, COMMON. <code>[WARNING]</code> is the odd one out: it tunes the assembler's complaints, nothing more.</p>
<p class="pitfall">⚠️ Exam trap: "which of these produces machine code?" The answer for this whole slide is <strong>none of them</strong>. Not one of the nine emits an instruction. They change how <em>other</em> lines are translated, or where the result is placed, or what is left for the linker — which is the entire meaning of the word <em>directive</em>.</p>`,
        `<p class="y-chinh">🎯 Định nghĩa hình thức, rồi tới danh mục. <strong>"Chỉ thị là một lệnh nhúng trong mã nguồn hợp ngữ, được <em>TRÌNH HỢP DỊCH nhận ra và hành động theo</em>."</strong> Chín cái, và chúng chia thành ba họ rõ ràng.</p>
<table>
<tr><th>Chỉ thị</th><th>Slide nói nó làm gì</th><th>Họ</th></tr>
<tr><td><strong>BITS</strong></td><td>Chỉ định NASM sinh mã cho bộ xử lý chạy ở chế độ 16 bit, 32 bit hay 64 bit</td><td>Máy đích</td></tr>
<tr><td><strong>DEFAULT</strong></td><td>Đổi vài mặc định của trình hợp dịch, ví dụ dùng địa chỉ tương đối hay tuyệt đối</td><td>Máy đích</td></tr>
<tr><td><strong>CPU</strong></td><td>Giới hạn việc hợp dịch trong những lệnh có sẵn trên CPU được chỉ định</td><td>Máy đích</td></tr>
<tr><td><strong>FLOAT</strong></td><td>Cho phép người lập trình đổi vài thiết lập mặc định sang lựa chọn khác với IEEE 754</td><td>Máy đích</td></tr>
<tr><td><strong>SECTION</strong> hoặc <strong>SEGMENT</strong></td><td>Đổi xem mã nguồn sẽ được hợp dịch vào PHẦN nào của tệp ra</td><td>Bố cục</td></tr>
<tr><td><strong>EXTERN</strong></td><td>Khai báo một ký hiệu <em>KHÔNG được định nghĩa ở đâu trong mô-đun này</em>, mà giả định là định nghĩa ở mô-đun khác và mô-đun này cần dùng</td><td>Liên kết</td></tr>
<tr><td><strong>GLOBAL</strong></td><td>"Đầu kia của EXTERN": nếu một mô-đun khai EXTERN và tham chiếu một ký hiệu thì phải có mô-đun khác thật sự định nghĩa nó và khai GLOBAL — nếu không sẽ lỗi trình liên kết</td><td>Liên kết</td></tr>
<tr><td><strong>COMMON</strong></td><td>Dùng để khai báo biến dùng chung</td><td>Liên kết</td></tr>
<tr><td><strong>[WARNING]</strong></td><td>Dùng để bật hoặc tắt từng lớp cảnh báo</td><td>Chẩn đoán</td></tr>
</table>
<ul>
<li><strong>EXTERN và GLOBAL là cặp thật sự cần hiểu, và slide gần như nói thẳng lý do.</strong> Chúng là hai nửa của MỘT cái bắt tay giữa các tệp hợp dịch riêng rẽ. <code>EXTERN</code> nói "tôi DÙNG cái tên này, ai đó định nghĩa nó"; <code>GLOBAL</code> nói "tôi ĐỊNH NGHĨA cái tên này, người khác được dùng". Quên nửa <code>GLOBAL</code> là bạn nhận lỗi <em>unresolved symbol</em> lúc liên kết — lỗi kinh điển mà slide 30 mô tả.</li>
<li><strong>Đây là chỗ bảng ký hiệu của slide 9 thôi còn là chuyện riêng tư.</strong> Trong một tệp, mọi ký hiệu được lượt 2 giải xong. <code>EXTERN</code> là ký hiệu mà lượt 2 được <em>PHÉP</em> để lại chưa giải: nó thành một cái LỖ trong tệp đối tượng cho <strong>TRÌNH LIÊN KẾT</strong> lấp. Đó chính là khác biệt giữa mã đối tượng và mã thực thi ở slide 2 — và, gói trong một dòng, là lý do trình liên kết tồn tại.</li>
<li><strong>Họ "Máy đích" là trình hợp dịch đang được cho biết nó nhắm vào cỗ máy nào.</strong> <code>BITS 64</code> so với <code>BITS 32</code> làm đổi cách mã hoá của CHÍNH những mã gợi nhớ đó. <code>CPU</code> khiến trình hợp dịch từ chối những lệnh mà chip đích của bạn không có — một chốt chặn lúc dịch để không xuất xưởng mã sập trên phần cứng đời cũ.</li>
<li><strong><code>SECTION</code> nuôi mấy thanh ghi đoạn của slide 12.</strong> <code>section .text</code> cho mã, <code>section .data</code> cho dữ liệu đã khởi tạo, <code>section .bss</code> cho vùng dành trước chưa khởi tạo (nhà tự nhiên của họ <code>RESB</code> ở slide 15). Bộ nhớ MARIE phẳng lì, 4096 từ, không có section nào — và chính vì thế slide 14 mới phải dặn bạn TỰ TAY để dữ liệu sau <code>Halt</code>.</li>
<li><strong>Chỉ thị khác pseudo-instruction ra sao, vì cả hai chữ đều có trong chương này.</strong> Slide dùng chúng gần như thay thế được cho nhau (slide 14: "directives là mệnh lệnh gửi cho trình hợp dịch…"). Cách đọc thực dụng: <em>pseudo-instruction</em> nhấn vào chuyện nó NGỒI trong trường lệnh và TRÔNG như một lệnh; <em>directive</em> nhấn vào chuyện nó RA LỆNH cho trình hợp dịch. Cùng một vật, hai góc nhìn.</li>
</ul>
<p class="meo">💡 Nhớ chúng thành ba câu hỏi mà trình hợp dịch cần được trả lời. <strong>"Máy nào?"</strong> → BITS, CPU, DEFAULT, FLOAT. <strong>"Phần nào của tệp?"</strong> → SECTION/SEGMENT. <strong>"Còn ai dính vào nữa?"</strong> → EXTERN, GLOBAL, COMMON. <code>[WARNING]</code> là kẻ lạc loài: nó chỉ chỉnh mức càu nhàu của trình hợp dịch, không hơn.</p>
<p class="pitfall">⚠️ Bẫy đề thi: "cái nào trong số này sinh ra mã máy?" Đáp án cho cả slide này là <strong>KHÔNG CÁI NÀO</strong>. Không một trong chín cái nào phát ra lệnh. Chúng đổi cách những dòng <em>KHÁC</em> được dịch, hoặc đổi chỗ đặt kết quả, hoặc để lại phần việc cho trình liên kết — và đó là toàn bộ ý nghĩa của chữ <em>chỉ thị</em>.</p>`],

      [19, 'System Calls — the x86 INT instruction and the six argument registers',
        `<p class="y-chinh">🎯 How an assembly program asks the <strong>operating system</strong> to do something it cannot do itself. <strong>"The assembler makes use of the x86 <code>INT</code> instruction to make system calls."</strong> There are six registers that store the arguments.</p>
<table>
<tr><th>Argument position</th><th>Register (as the slide lists them)</th><th>Note</th></tr>
<tr><td>1st</td><td><strong>EBX</strong></td><td>"These registers take the consecutive arguments, <em>starting with the EBX register</em>"</td></tr>
<tr><td>2nd</td><td><strong>ECX</strong></td><td></td></tr>
<tr><td>3rd</td><td><strong>EDX</strong></td><td></td></tr>
<tr><td>4th</td><td><strong>ESI</strong></td><td></td></tr>
<tr><td>5th</td><td><strong>EDI</strong></td><td></td></tr>
<tr><td>6th</td><td><strong>EDP</strong> ← see the warning below</td><td>"If there are more than six arguments, then the <em>memory location of the first argument</em> is stored in the EBX register"</td></tr>
</table>
<ul>
<li><strong>Why a special instruction at all.</strong> Reading a file or printing a character requires privileged operations an ordinary program is not allowed to perform. <code>INT</code> raises a software interrupt: the processor switches to kernel mode and jumps to a handler the OS installed. It is a call you are <em>permitted</em> to make across a protection boundary — Chapter 8 (OS support) is where that boundary is explained.</li>
<li><strong>Registers, not the stack, and the reason is the boundary.</strong> The kernel cannot simply trust a pointer into your stack. Passing arguments in registers is fast and requires no memory access that must be validated — which is why the convention is fixed in hardware terms.</li>
<li><strong>The "more than six arguments" rule is an elegant fallback.</strong> Run out of registers and you pass a pointer instead: EBX now holds the <em>address</em> of the argument block. That is indirect addressing again — <code>AddI</code>/<code>JumpI</code> from slide 11, at the level of an operating-system interface.</li>
<li><strong>Which register holds the call <em>number</em>?</strong> The slide does not say — it lists only the six argument registers. On Linux x86 the number goes in EAX, and this is the kind of detail that is architecture- and OS-specific rather than part of the chapter's general point.</li>
</ul>
<p class="pitfall">⚠️ <strong>The slide contains a typo, and you should know it before an exam.</strong> There is no x86 register named <strong>EDP</strong>. The intended register is <strong>EBP</strong> (base pointer) — and this deck proves it against itself: Figure 15.3 on slide 12 lists the eight general-purpose registers as EAX, EBX, ECX, EDX, ESI, EDI, <strong>EBP (101)</strong>, ESP (100). Six argument registers EBX, ECX, EDX, ESI, EDI, EBP is precisely "all eight general-purpose registers except EAX (the call number) and ESP (the stack pointer)" — which makes sense; "EDP" does not. Write EBP, and say why if you are asked.</p>
<p class="nhan">📐 <strong>MARIE's version of a system call: <code>Input</code> and <code>Output</code>.</strong> They are the only two instructions in the whole ISA that reach outside the processor, and they do exactly what <code>INT</code> does in miniature — hand control to the environment and get a value back. No arguments, no call number, one implicit operand (AC), because there is only one thing each can do.</p>
<p class="nhan">📐 <strong>HOW TO ACTUALLY RUN THE LAB — MARIE Simulator, step by step.</strong> Items marked <em>[guide]</em> come from the simulator's own built-in help, which is what <code>GuideMARIE</code> walks you through; items marked <em>[practice]</em> are working habits, not documented rules:</p>
<table>
<tr><th>#</th><th>Step</th><th>Detail</th></tr>
<tr><td>1</td><td><strong>Launch</strong></td><td><code>java MarieSim1</code> in the unzipped folder (<code>runapp.bat</code> on Windows). <em>[guide]</em></td></tr>
<tr><td>2</td><td><strong>Write the source</strong></td><td><code>File | Edit</code> opens the built-in editor, or use any plain-text editor. The file <strong>must</strong> end in <code>.mas</code>, and the extension is <strong>case-sensitive</strong>. <em>[guide]</em></td></tr>
<tr><td>3</td><td><strong>Assemble</strong></td><td>Use the editor's own assemble option. Errors open in a separate window; fix and reassemble. On success you get <code>.mex</code> (machine code), <code>.lst</code> (listing + symbol table) and <code>.map</code> (symbol addresses). <em>[guide]</em></td></tr>
<tr><td>4</td><td><strong>Read the .lst before running</strong></td><td>It shows address, machine word, label and source side by side, plus the symbol table with a "References" column. Every table in this lesson came from there. <em>[practice]</em></td></tr>
<tr><td>5</td><td><strong>Load</strong></td><td><code>File | Load</code>. <strong>Assembling is not loading</strong> — if you changed and reassembled a file you must <code>File | Reload</code> or <code>File | Load</code> again, or the simulator keeps running the old code. <em>[guide]</em></td></tr>
<tr><td>6</td><td><strong>Step</strong></td><td><code>Run | Set Step Mode | On</code> executes one instruction at a time. This is how you read AC, PC, MAR, MBR after every instruction — exactly the trace tables in this lesson. <em>[guide]</em></td></tr>
<tr><td>7</td><td><strong>Run</strong></td><td><code>Run | Run</code>. Default delay is 10 ms per instruction (the minimum); <code>Run | Set Delay</code> goes up to 3000 ms to watch it crawl. The <strong>[Stop]</strong> button is enabled while running. <em>[guide]</em></td></tr>
<tr><td>8</td><td><strong>Breakpoints</strong></td><td>Tick the checkbox next to any instruction in the monitor window, then <code>Breakpoints | Run to Breakpoint</code>. <code>Breakpoints | Reset Breakpoints</code> clears them all. Caution: a breakpoint <em>on a Halt</em> causes a Restart first, then a full run. <em>[guide]</em></td></tr>
<tr><td>9</td><td><strong>Fix the output display</strong></td><td>Output defaults to linefeed-terminated <strong>ASCII</strong> — so 65 + 1 prints as <code>B</code>, not <code>66</code>. Switch the output mode combo box to <strong>decimal</strong> before you believe any number. <em>[guide]</em></td></tr>
<tr><td>10</td><td><strong>Restart vs Reset</strong></td><td><code>Run | Restart</code> just puts the PC back to the start of the program. <code>Run | Reset Simulator</code> wipes everything, like the reset button on a PC, and asks for confirmation. <em>[guide]</em></td></tr>
</table>
<p class="dap-an">✅ A ten-minute self-test that proves your whole toolchain works: type program <code>p1.mas</code> from slide 3, assemble it, open the <code>.lst</code> and check that address 100 holds <strong>1105</strong>, load it, step through five instructions, and confirm AC goes 2 → 5 → 9 and that memory location 108 becomes 0009. If all four of those match, every table in this lesson is reproducible on your own machine.</p>
<p class="meo">💡 Three habits that save the most time in sessions 39–44. (1) <strong>Step, never run, the first time</strong> — a MARIE bug usually shows up as one wrong register value, and running past it tells you nothing. (2) <strong>Keep the <code>.lst</code> open beside the simulator</strong>; when the PC lands somewhere unexpected you can see instantly whether it landed in your data. (3) <strong>Check the output mode is decimal before reporting a result</strong> — more "wrong answers" in this lab are ASCII display than actual logic errors.</p>
<p class="nhan">📐 <strong>Where this chapter joins the rest of the course.</strong> Chapter 3 — the fetch-decode-execute cycle; every trace row in this lesson <em>is</em> one turn of it, which makes MARIE the most direct illustration of Chapter 3 you will meet. Chapters 10 and 13 — instruction set design; MARIE's 13 opcodes and single address field are that chapter's trade-offs at their simplest. Chapters 11 and 14 — addressing modes; <code>Add</code> is direct, <code>AddI</code> and <code>JumpI</code> are indirect, and you have now traced both. Chapter 8 — OS support; that is where <code>INT</code>, the protection boundary and the kernel handler actually live. CSI106 chapter 7 — the three generations of language, of which this chapter is the second. PRF192 — one C statement, four machine instructions, measured on slide 3.</p>
<p class="nhan">📐 <strong>What comes next in ASM.b (slides 20–37).</strong> Worked x86 programs (greatest common divisor, prime generation), the x86 string instructions and REP prefixes, the <em>types of assemblers</em>, the <strong>two-pass assembler flowchart</strong> (Figure 15.8) that this lesson taught early at slide 9, the one-pass assembler with its forward-reference lists, and then loading, linking, relocation and dynamic linking — including DLL hell.</p>`,
        `<p class="y-chinh">🎯 Cách một chương trình hợp ngữ nhờ <strong>HỆ ĐIỀU HÀNH</strong> làm hộ việc mà tự nó không làm được. <strong>"Trình hợp dịch dùng lệnh <code>INT</code> của x86 để thực hiện lời gọi hệ thống."</strong> Có sáu thanh ghi giữ các đối số.</p>
<table>
<tr><th>Vị trí đối số</th><th>Thanh ghi (theo cách slide liệt kê)</th><th>Ghi chú</th></tr>
<tr><td>thứ 1</td><td><strong>EBX</strong></td><td>"Các thanh ghi này nhận các đối số liên tiếp, <em>bắt đầu từ thanh ghi EBX</em>"</td></tr>
<tr><td>thứ 2</td><td><strong>ECX</strong></td><td></td></tr>
<tr><td>thứ 3</td><td><strong>EDX</strong></td><td></td></tr>
<tr><td>thứ 4</td><td><strong>ESI</strong></td><td></td></tr>
<tr><td>thứ 5</td><td><strong>EDI</strong></td><td></td></tr>
<tr><td>thứ 6</td><td><strong>EDP</strong> ← xem cảnh báo bên dưới</td><td>"Nếu có hơn sáu đối số thì <em>ĐỊA CHỈ Ô NHỚ của đối số đầu tiên</em> được để trong thanh ghi EBX"</td></tr>
</table>
<ul>
<li><strong>Vì sao phải có một lệnh riêng.</strong> Đọc tệp hay in một ký tự đòi những thao tác đặc quyền mà chương trình thường không được phép làm. <code>INT</code> dựng lên một ngắt phần mềm: bộ xử lý chuyển sang chế độ nhân và nhảy tới bộ xử lý mà hệ điều hành đã cài. Đó là một lời gọi bạn ĐƯỢC PHÉP thực hiện xuyên qua một ranh giới bảo vệ — Chương 8 (hỗ trợ của hệ điều hành) là nơi giải thích cái ranh giới đó.</li>
<li><strong>Dùng THANH GHI chứ không dùng ngăn xếp, và lý do nằm ở cái ranh giới.</strong> Nhân không thể cứ thế tin một con trỏ trỏ vào ngăn xếp của bạn. Truyền đối số qua thanh ghi thì nhanh và không cần một lần truy cập bộ nhớ nào phải đi kiểm tra — vì thế quy ước mới được chốt bằng tên thanh ghi cụ thể.</li>
<li><strong>Luật "nhiều hơn sáu đối số" là một lối lùi thanh lịch.</strong> Hết thanh ghi thì truyền một con trỏ: EBX giờ giữ <em>ĐỊA CHỈ</em> của khối đối số. Đó lại là địa chỉ gián tiếp — <code>AddI</code>/<code>JumpI</code> của slide 11, ở tầng giao diện hệ điều hành.</li>
<li><strong>Thanh ghi nào giữ SỐ HIỆU lời gọi?</strong> Slide không nói — nó chỉ liệt kê sáu thanh ghi đối số. Trên Linux x86 số hiệu nằm ở EAX, và đây là loại chi tiết phụ thuộc kiến trúc lẫn hệ điều hành, không phải ý chung của chương.</li>
</ul>
<p class="pitfall">⚠️ <strong>Slide có một lỗi đánh máy, và bạn nên biết trước khi đi thi.</strong> x86 KHÔNG có thanh ghi nào tên <strong>EDP</strong>. Thanh ghi được nhắc tới là <strong>EBP</strong> (base pointer) — và chính deck này tự chứng minh điều đó: Figure 15.3 ở slide 12 liệt kê tám thanh ghi đa dụng là EAX, EBX, ECX, EDX, ESI, EDI, <strong>EBP (101)</strong>, ESP (100). Sáu thanh ghi đối số EBX, ECX, EDX, ESI, EDI, EBP đúng bằng "cả tám thanh ghi đa dụng trừ EAX (số hiệu lời gọi) và ESP (con trỏ ngăn xếp)" — hợp lý; còn "EDP" thì không. Hãy viết EBP, và nói rõ lý do nếu bị hỏi.</p>
<p class="nhan">📐 <strong>Bản MARIE của lời gọi hệ thống: <code>Input</code> và <code>Output</code>.</strong> Chúng là hai lệnh DUY NHẤT trong cả tập lệnh vươn ra ngoài bộ xử lý, và chúng làm đúng việc <code>INT</code> làm, thu nhỏ lại — trao điều khiển cho môi trường rồi nhận giá trị về. Không đối số, không số hiệu lời gọi, một toán hạng ngầm định (AC), vì mỗi lệnh chỉ làm được đúng một việc.</p>
<p class="nhan">📐 <strong>CÁCH LÀM LAB THẬT — MARIE Simulator, từng bước.</strong> Mục ghi <em>[tài liệu]</em> lấy từ chính trang trợ giúp cài sẵn trong trình mô phỏng, cũng là thứ <code>GuideMARIE</code> dẫn bạn đi; mục ghi <em>[kinh nghiệm]</em> là thói quen làm việc, không phải quy định có ghi trong tài liệu:</p>
<table>
<tr><th>#</th><th>Bước</th><th>Chi tiết</th></tr>
<tr><td>1</td><td><strong>Khởi chạy</strong></td><td><code>java MarieSim1</code> trong thư mục vừa giải nén (<code>runapp.bat</code> trên Windows). <em>[tài liệu]</em></td></tr>
<tr><td>2</td><td><strong>Viết mã nguồn</strong></td><td><code>File | Edit</code> mở trình soạn thảo cài sẵn, hoặc dùng trình soạn thảo văn bản thuần nào cũng được. Tệp <strong>BẮT BUỘC</strong> kết thúc bằng <code>.mas</code>, và phần mở rộng <strong>PHÂN BIỆT HOA THƯỜNG</strong>. <em>[tài liệu]</em></td></tr>
<tr><td>3</td><td><strong>Hợp dịch</strong></td><td>Dùng mục hợp dịch của chính trình soạn thảo. Lỗi hiện ra ở một cửa sổ riêng; sửa rồi hợp dịch lại. Thành công thì bạn có <code>.mex</code> (mã máy), <code>.lst</code> (listing + bảng ký hiệu) và <code>.map</code> (địa chỉ các ký hiệu). <em>[tài liệu]</em></td></tr>
<tr><td>4</td><td><strong>Đọc .lst TRƯỚC khi chạy</strong></td><td>Nó bày địa chỉ, từ máy, nhãn và mã nguồn cạnh nhau, cộng bảng ký hiệu có cột "References". Mọi bảng trong bài này đều lấy từ đó ra. <em>[kinh nghiệm]</em></td></tr>
<tr><td>5</td><td><strong>Nạp</strong></td><td><code>File | Load</code>. <strong>HỢP DỊCH KHÔNG PHẢI LÀ NẠP</strong> — sửa rồi hợp dịch lại thì phải <code>File | Reload</code> hoặc <code>File | Load</code> lần nữa, không thì trình mô phỏng vẫn chạy mã CŨ. <em>[tài liệu]</em></td></tr>
<tr><td>6</td><td><strong>Chạy từng bước</strong></td><td><code>Run | Set Step Mode | On</code> cho thi hành từng lệnh một. Đây là cách bạn đọc AC, PC, MAR, MBR sau mỗi lệnh — đúng những bảng vết trong bài này. <em>[tài liệu]</em></td></tr>
<tr><td>7</td><td><strong>Chạy liền</strong></td><td><code>Run | Run</code>. Độ trễ mặc định 10 ms mỗi lệnh (mức tối thiểu); <code>Run | Set Delay</code> kéo lên tới 3000 ms để xem nó bò. Nút <strong>[Stop]</strong> bật lên trong lúc chạy. <em>[tài liệu]</em></td></tr>
<tr><td>8</td><td><strong>Điểm dừng</strong></td><td>Tích vào ô vuông cạnh lệnh bất kỳ trong cửa sổ theo dõi, rồi <code>Breakpoints | Run to Breakpoint</code>. <code>Breakpoints | Reset Breakpoints</code> xoá hết. Lưu ý: đặt điểm dừng <em>NGAY TẠI Halt</em> sẽ khiến nó Restart trước rồi chạy lại từ đầu. <em>[tài liệu]</em></td></tr>
<tr><td>9</td><td><strong>Sửa chế độ hiển thị kết quả</strong></td><td>Mặc định xuất ra là <strong>ASCII</strong> kèm xuống dòng — nên 65 + 1 in ra <code>B</code> chứ không phải <code>66</code>. Đổi ô chọn chế độ xuất sang <strong>decimal</strong> trước khi tin bất kỳ con số nào. <em>[tài liệu]</em></td></tr>
<tr><td>10</td><td><strong>Restart khác Reset</strong></td><td><code>Run | Restart</code> chỉ đưa PC về đầu chương trình. <code>Run | Reset Simulator</code> xoá sạch mọi thứ, như bấm nút reset trên máy tính, và có hỏi xác nhận. <em>[tài liệu]</em></td></tr>
</table>
<p class="dap-an">✅ Một bài tự kiểm mười phút chứng minh cả bộ công cụ của bạn chạy đúng: gõ chương trình <code>p1.mas</code> ở slide 3, hợp dịch, mở <code>.lst</code> và kiểm xem địa chỉ 100 có chứa <strong>1105</strong> không, nạp nó, chạy từng bước năm lệnh, rồi xác nhận AC đi 2 → 5 → 9 và ô nhớ 108 thành 0009. Bốn thứ đó khớp là mọi bảng trong bài này đều tái lập được trên máy bạn.</p>
<p class="meo">💡 Ba thói quen tiết kiệm thời gian nhất cho buổi 39–44. (1) <strong>Lần đầu hãy CHẠY TỪNG BƯỚC, đừng chạy liền</strong> — lỗi MARIE thường hiện ra là một giá trị thanh ghi sai, mà chạy vượt qua nó thì bạn chẳng biết gì. (2) <strong>Mở <code>.lst</code> bên cạnh trình mô phỏng</strong>; khi PC rơi vào chỗ lạ bạn thấy ngay nó có rơi vào vùng dữ liệu không. (3) <strong>Kiểm chế độ xuất là decimal trước khi báo kết quả</strong> — số "đáp án sai" ở bài lab này do hiển thị ASCII còn nhiều hơn do sai logic.</p>
<p class="nhan">📐 <strong>Chương này nối vào phần còn lại của môn ở đâu.</strong> Chương 3 — chu trình nạp-giải mã-thi hành; mỗi dòng bảng vết trong bài này CHÍNH LÀ một vòng của nó, khiến MARIE là minh hoạ trực tiếp nhất cho Chương 3 mà bạn sẽ gặp. Chương 10 và 13 — thiết kế tập lệnh; 13 mã lệnh và một trường địa chỉ duy nhất của MARIE là những đánh đổi của chương đó ở dạng đơn giản nhất. Chương 11 và 14 — chế độ địa chỉ; <code>Add</code> là trực tiếp, <code>AddI</code> và <code>JumpI</code> là gián tiếp, và bạn vừa lần theo vết cả hai. Chương 8 — hỗ trợ của hệ điều hành; đó mới là nơi <code>INT</code>, ranh giới bảo vệ và bộ xử lý ngắt của nhân thật sự sống. CSI106 chương 7 — ba thế hệ ngôn ngữ, mà chương này là thế hệ thứ hai. PRF192 — một câu lệnh C thành bốn lệnh máy, đã đo ở slide 3.</p>
<p class="nhan">📐 <strong>Bài ASM.b (slide 20–37) có gì tiếp theo.</strong> Các chương trình x86 giải trọn (ước chung lớn nhất, sinh số nguyên tố), lệnh chuỗi x86 và các tiền tố REP, <em>các loại trình hợp dịch</em>, <strong>lưu đồ trình hợp dịch hai lượt</strong> (Figure 15.8) mà bài này đã dạy sớm ở slide 9, trình hợp dịch một lượt với danh sách forward reference của nó, rồi nạp, liên kết, tái định vị và liên kết động — kể cả chuyện DLL hell.</p>`],

    ]),
  ].join('\n'),
};
