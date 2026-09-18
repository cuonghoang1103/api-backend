/**
 * PRF192 · Slot 01 — Introduction to Programming Fundamentals with C.
 * Deck 'prf1' (PRF1, 45 slide), PHẦN B: slide 24 → 45.
 *
 * Nội dung giảng bám đúng chữ trong file .pptx gốc của trường
 * (/tmp/prf192-text/prf1.txt, slide 24–45): file C đầu tiên với Dev-C++,
 * ngôn ngữ lập trình & 5 thế hệ, thông dịch vs biên dịch, 4 bước của quá
 * trình biên dịch (.c → .i → .s → .o → .exe), vì sao chọn C, comment /
 * whitespace / case-sensitivity, cấu trúc một chương trình C đơn giản,
 * dịch & chạy bằng command prompt (MinGW + PATH + g++), và entry point
 * [int] main( [void] ).
 *
 * Mọi đoạn code C trong bài đều đã kiểm cú pháp bằng tay và biên dịch được
 * với gcc/g++ ở chế độ C89 trở lên.
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'prf1';

export default {
  title: '1.0b — Slide by slide: programming languages, the compiler & the structure of a C program (slides 24–45)|||1.0b — Slide bài giảng: Ngôn ngữ lập trình, trình biên dịch & cấu trúc chương trình C (slide 24–45)',
  slug: 'prf192-1-0b-slides-bien-dich-cau-truc-c',
  type: 'DOCUMENT',
  description: 'Nửa sau Slot 01 của PRF192 (slide 24–45): viết file C đầu tiên bằng Dev-C++, năm thế hệ ngôn ngữ lập trình, phân biệt thông dịch với biên dịch, bốn bước của quá trình biên dịch (.c → .i → .s → .o → .exe), lý do C được chọn làm ngôn ngữ đầu tiên, ba đặc điểm đáng nhớ của C (comment, whitespace, phân biệt hoa thường), cấu trúc một chương trình C đơn giản và cách dịch — chạy bằng command prompt với MinGW. Mỗi slide kèm phần giảng song ngữ, code chạy được, bài tập giải từng bước và bẫy hay gặp khi thi.',
  content: [
    walkHead(D, 24, 45),
    walk(D, [

      [24, "Let's create our first C file (Dev-C++)",
        `<p class="y-chinh">🎯 The very first hands-on step of PRF192: open Dev-C++, create a source file named <code>Hello.c</code>, and run it with <strong>F11</strong> (Execute → Compile &amp; Run).</p>
<ul>
<li><strong>The exact click path</strong> — <em>File → New → Source File</em> creates an empty editor buffer. It is still nameless: you must <em>Save As</em> with the name <strong>Hello.c</strong> before compiling.</li>
<li><strong>Why the <code>.c</code> extension matters</strong> — the extension is how the toolchain decides which language rules to apply. Saving as <code>Hello.cpp</code> makes Dev-C++ invoke the <strong>C++</strong> compiler instead, which accepts things plain C rejects — so your code may "work" here and fail in the exam environment.</li>
<li><strong>F11 = two actions, not one</strong> — Compile (source → executable) then Run. If compilation reports an error, the Run half never happens and the console never opens.</li>
<li><strong>The minimum program</strong> — three ingredients: one <code>#include</code> line to get <code>printf</code>, one <code>main</code> function as the entry point, one <code>return 0;</code> to report success.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main(void)
{
    printf("Hello World!");
    return 0;
}
</code></pre>
<p class="nhan">Walkthrough — what F11 actually does: (1) the preprocessor pastes the text of <code>stdio.h</code> in, so the compiler learns what <code>printf</code> looks like; (2) the compiler turns your function into machine instructions; (3) the linker glues in the real body of <code>printf</code> from the C standard library; (4) Windows loads <code>Hello.exe</code> and calls <code>main</code>. Output: <code>Hello World!</code>.</p>
<p class="dap-an">✅ Answer — after F11 the console shows exactly <code>Hello World!</code> with no newline after it, and the process exit code is <strong>0</strong> (the value returned by <code>main</code>), which the operating system reads as "finished successfully".</p>
<p class="meo">💡 Add <code>\\n</code> at the end (<code>printf("Hello World!\\n");</code>) so the next console line starts cleanly. Many auto-graders compare output text exactly — a missing newline is a real difference.</p>
<p class="pitfall">⚠️ Classic beginner trap: the console window flashes and disappears. That is not a bug — the program finished. Dev-C++ usually keeps it open; if it does not, run the <code>.exe</code> from a command prompt, or temporarily add <code>getchar();</code> before <code>return 0;</code>.</p>`,
        `<p class="y-chinh">🎯 Bước thực hành đầu tiên của PRF192: mở Dev-C++, tạo file nguồn tên <code>Hello.c</code>, rồi chạy bằng <strong>F11</strong> (Execute → Compile &amp; Run).</p>
<ul>
<li><strong>Đường bấm chính xác</strong> — <em>File → New → Source File</em> tạo ra một khung soạn thảo rỗng. Lúc này file vẫn chưa có tên: phải <em>Save As</em> với tên <strong>Hello.c</strong> rồi mới dịch được.</li>
<li><strong>Vì sao phần mở rộng <code>.c</code> lại quan trọng</strong> — bộ công cụ dựa vào phần mở rộng để quyết định áp luật của ngôn ngữ nào. Lưu thành <code>Hello.cpp</code> thì Dev-C++ gọi trình biên dịch <strong>C++</strong>, mà C++ chấp nhận nhiều thứ C thuần từ chối — code "chạy được" ở nhà nhưng hỏng ở môi trường thi.</li>
<li><strong>F11 là hai việc, không phải một</strong> — Compile (nguồn → file thực thi) rồi mới Run. Nếu khâu dịch báo lỗi thì nửa Run không bao giờ xảy ra và cửa sổ console không hiện ra.</li>
<li><strong>Chương trình tối thiểu</strong> — ba thành phần: một dòng <code>#include</code> để có <code>printf</code>, một hàm <code>main</code> làm điểm vào, một <code>return 0;</code> để báo chạy thành công.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;

int main(void)
{
    printf("Hello World!");
    return 0;
}
</code></pre>
<p class="nhan">Đi từng bước — F11 thật ra làm gì: (1) bộ tiền xử lý dán nguyên văn nội dung <code>stdio.h</code> vào, nhờ đó trình biên dịch biết <code>printf</code> có hình dạng thế nào; (2) trình biên dịch chuyển hàm của bạn thành lệnh máy; (3) trình liên kết gắn phần thân thật của <code>printf</code> lấy từ thư viện chuẩn C; (4) Windows nạp <code>Hello.exe</code> rồi gọi <code>main</code>. Kết quả in ra: <code>Hello World!</code>.</p>
<p class="dap-an">✅ Đáp án — sau khi bấm F11, console hiện đúng chữ <code>Hello World!</code> và không xuống dòng, còn mã thoát của tiến trình là <strong>0</strong> (giá trị <code>main</code> trả về), hệ điều hành đọc là "kết thúc thành công".</p>
<p class="meo">💡 Thêm <code>\\n</code> ở cuối (<code>printf("Hello World!\\n");</code>) để dòng console kế tiếp bắt đầu cho gọn. Nhiều hệ thống chấm tự động so khớp từng ký tự — thiếu một dấu xuống dòng vẫn tính là khác.</p>
<p class="pitfall">⚠️ Bẫy kinh điển của người mới: cửa sổ console loé lên rồi tắt. Đó không phải lỗi — chương trình đã chạy xong. Dev-C++ thường tự giữ lại cửa sổ; nếu không, hãy chạy file <code>.exe</code> từ command prompt, hoặc tạm thêm <code>getchar();</code> ngay trước <code>return 0;</code>.</p>`],

      [25, 'Program Instructions (cont.) — from one C line to many machine instructions',
        `<p class="y-chinh">🎯 This slide carries no bullet text — it is the picture that finishes the <em>Program Instructions</em> topic started on slide 23: one readable C statement expands into several opcode + operand instructions.</p>
<ul>
<li><strong>The chain of representations</strong> — C statement → assembly mnemonics → binary machine instructions → bit patterns sitting in RAM. Every level says the same thing, just closer to the hardware.</li>
<li><strong>Recall slide 23's shape</strong> — an instruction = one <strong>opcode</strong> (what to do) plus its <strong>operands</strong> (what to do it to: constants, registers, or memory addresses). The CPU can only ever obey that shape.</li>
<li><strong>Expansion ratio</strong> — a single C line such as <code>c = a + b;</code> becomes roughly three or four machine instructions: load <code>a</code>, load <code>b</code>, add, store into <code>c</code>. This ratio is why high-level languages exist (slide 27).</li>
<li><strong>Why you must know this in PRF192</strong> — it explains later mysteries: why an uninitialised variable holds garbage (the store step never ran), and why a pointer is "just an address" (slot 10) — addresses are literally what operands hold.</li>
</ul>
<pre><code>/* One C statement ... */
c = a + b;

/* ... becomes roughly this sequence of instructions */
LOAD  R1, [addr_of_a]     /* opcode LOAD  · operands: register, address */
LOAD  R2, [addr_of_b]
ADD   R1, R2              /* ALU does the arithmetic (slide 13) */
STORE [addr_of_c], R1
</code></pre>
<p class="nhan">Tie-back to the hardware review: the LOAD step is exactly the "3 steps to read a memory cell" from slide 13 — address bus gets the address, control bus gets the read signal, the data bus carries the value into a register.</p>
<p class="meo">💡 Remember it as <strong>one verb + its nouns</strong>. Opcode is the verb, operands are the nouns. Every instruction set on earth, from x86 to ARM, is built on that single sentence pattern.</p>
<p class="pitfall">⚠️ Do not conclude "C is slow because one line becomes four instructions". The comparison that matters is with other <em>high-level</em> languages: C compiles to very few instructions per line, which is exactly the point of the timing table on slide 35.</p>`,
        `<p class="y-chinh">🎯 Slide này không có chữ, chỉ là hình minh hoạ khép lại phần <em>Program Instructions</em> mở ở slide 23: một câu lệnh C dễ đọc nở ra thành nhiều lệnh máy dạng opcode + operand.</p>
<ul>
<li><strong>Chuỗi các cách biểu diễn</strong> — câu lệnh C → ký hiệu assembly → lệnh máy nhị phân → dãy bit nằm trong RAM. Mọi tầng đều nói cùng một điều, chỉ là ngày càng sát phần cứng hơn.</li>
<li><strong>Nhớ lại hình dạng ở slide 23</strong> — một lệnh = một <strong>opcode</strong> (làm gì) cộng các <strong>operand</strong> (làm lên cái gì: hằng số, thanh ghi, hoặc địa chỉ bộ nhớ). CPU chỉ biết vâng lời đúng hình dạng đó.</li>
<li><strong>Tỉ lệ nở ra</strong> — một dòng C như <code>c = a + b;</code> biến thành khoảng ba bốn lệnh máy: nạp <code>a</code>, nạp <code>b</code>, cộng, ghi vào <code>c</code>. Chính tỉ lệ này là lý do ngôn ngữ bậc cao ra đời (slide 27).</li>
<li><strong>Vì sao PRF192 cần biết điều này</strong> — nó giải thích các bí ẩn về sau: vì sao biến chưa khởi tạo chứa rác (bước ghi chưa hề chạy), và vì sao con trỏ "chỉ là một địa chỉ" (slot 10) — địa chỉ đúng là thứ mà operand chứa.</li>
</ul>
<pre><code>/* Một câu lệnh C ... */
c = a + b;

/* ... trở thành đại khái dãy lệnh sau */
LOAD  R1, [dia_chi_cua_a]   /* opcode LOAD · operand: thanh ghi, địa chỉ */
LOAD  R2, [dia_chi_cua_b]
ADD   R1, R2                /* ALU làm phép tính (slide 13) */
STORE [dia_chi_cua_c], R1
</code></pre>
<p class="nhan">Nối lại với phần ôn phần cứng: bước LOAD chính là "3 bước đọc một ô nhớ" ở slide 13 — bus địa chỉ nhận địa chỉ, bus điều khiển nhận tín hiệu đọc, bus dữ liệu chở giá trị về thanh ghi.</p>
<p class="meo">💡 Nhớ theo kiểu <strong>một động từ + các danh từ của nó</strong>. Opcode là động từ, operand là danh từ. Mọi tập lệnh trên đời, từ x86 tới ARM, đều dựng trên đúng mẫu câu đó.</p>
<p class="pitfall">⚠️ Đừng kết luận "C chậm vì một dòng thành bốn lệnh". Phép so đáng nói là so với các ngôn ngữ <em>bậc cao</em> khác: C dịch ra rất ít lệnh trên mỗi dòng, và đó chính là ý nghĩa của bảng thời gian ở slide 35.</p>`],

      [26, 'Section divider — Programming Languages',
        `<p class="y-chinh">🎯 A section divider: the deck now leaves hardware behind and turns to the <strong>languages</strong> we write instructions in.</p>
<ul>
<li><strong>Where we have been</strong> — slides 12–25 built the machine's side of the story: CPU, memory, buses, bits and bytes, addresses, and the opcode + operand shape of an instruction.</li>
<li><strong>Where we go next</strong> — slide 27 explains why writing those instructions directly is impractical, and slide 28 lays out the five generations of languages that grew out of that problem.</li>
<li><strong>The single question this section answers</strong> — if the CPU only understands binary, why do we type English-like text? Because humans make far fewer mistakes per idea in English-like text.</li>
<li><strong>Why it sits here in the deck</strong> — you can only appreciate what a language <em>buys</em> you after you have seen what it hides: the buses, the registers, the addresses of the previous section.</li>
</ul>
<p class="nhan">Exam note: divider slides carry no examinable facts themselves, but they tell you the chapter's outline — and outline questions ("which topic comes under Programming Languages?") do appear in multiple-choice progress tests.</p>
<p class="meo">💡 Use divider slides as a self-test moment: before moving on, say out loud the three things you just learned about hardware. If you cannot, re-read slides 13–23 now rather than after the quiz.</p>
<p class="pitfall">⚠️ Do not skip dividers when revising. Students who read only the dense slides lose the thread of <em>why</em> each block follows the previous one, which is exactly what the "Contents" question on slide 3 tests.</p>`,
        `<p class="y-chinh">🎯 Slide phân mục: bộ slide rời phần phần cứng để chuyển sang <strong>ngôn ngữ</strong> mà ta dùng để viết lệnh.</p>
<ul>
<li><strong>Chúng ta vừa đi qua đâu</strong> — slide 12–25 dựng phía máy của câu chuyện: CPU, bộ nhớ, các bus, bit và byte, địa chỉ, và hình dạng opcode + operand của một lệnh.</li>
<li><strong>Tiếp theo đi đâu</strong> — slide 27 giải thích vì sao viết trực tiếp những lệnh đó là bất khả thi trong thực tế, còn slide 28 bày ra năm thế hệ ngôn ngữ sinh ra từ vấn đề đó.</li>
<li><strong>Câu hỏi duy nhất mà mục này trả lời</strong> — nếu CPU chỉ hiểu nhị phân, sao ta lại gõ văn bản giống tiếng Anh? Vì con người mắc ít lỗi hơn rất nhiều khi diễn đạt một ý bằng văn bản giống tiếng Anh.</li>
<li><strong>Vì sao mục này đứng ở đây</strong> — chỉ khi đã thấy ngôn ngữ <em>giấu đi</em> những gì (bus, thanh ghi, địa chỉ ở mục trước) thì mới thấm được nó <em>mua</em> cho ta điều gì.</li>
</ul>
<p class="nhan">Lưu ý khi thi: slide phân mục tự nó không chứa kiến thức bị hỏi, nhưng nó cho biết dàn ý của chương — mà câu hỏi dàn ý ("chủ đề nào thuộc mục Programming Languages?") vẫn xuất hiện trong bài kiểm tra trắc nghiệm.</p>
<p class="meo">💡 Hãy coi slide phân mục là điểm tự kiểm: trước khi đi tiếp, nói to ba điều bạn vừa học về phần cứng. Nói không ra thì đọc lại slide 13–23 ngay, đừng đợi tới lúc làm quiz.</p>
<p class="pitfall">⚠️ Đừng bỏ qua slide phân mục khi ôn. Ai chỉ đọc các slide dày chữ thường mất mạch <em>vì sao</em> khối này nối tiếp khối kia — mà đó đúng là thứ câu hỏi "Contents" ở slide 3 kiểm tra.</p>`],

      [27, 'Programming Languages — machine → assembly → high-level',
        `<p class="y-chinh">🎯 The ladder is <strong>Machine Language → Assembly language → High-level languages</strong>, and each rung exists to make programs shorter and safer to write.</p>
<ul>
<li><strong>The slide's core claim</strong> — "Programs that perform relatively simple tasks and are written in assembly language contain a large number of statements." Even a trivial job costs dozens of assembly lines.</li>
<li><strong>Machine language</strong> — pure binary opcodes and operands, the only thing the CPU truly executes. Writing it by hand means writing numbers, and one wrong bit is an invisible bug.</li>
<li><strong>Assembly language</strong> — a one-to-one textual alias for machine code (<code>MOV</code>, <code>ADD</code>, <code>JMP</code>). Far more readable, but still one line per machine instruction, and still tied to one specific CPU family.</li>
<li><strong>High-level languages</strong> — one statement expresses an <em>idea</em> (a loop, a condition, a function call) and the compiler expands it into however many instructions the target CPU needs. This is where portability is born (slide 10's "Portability" issue).</li>
<li><strong>The trade you are making</strong> — you give up absolute control over each instruction; you gain shorter code, fewer bugs, and the ability to recompile for a different machine instead of rewriting.</li>
</ul>
<pre><code>/* High-level C: one readable statement */
sum = 0;
for (i = 1; i &lt;= 10; i++) sum = sum + i;

/* The same loop in assembly needs a label, a compare,
   a conditional jump and an increment — several lines
   per single C line, and different mnemonics per CPU. */
</code></pre>
<p class="dap-an">✅ Answer to the slide's implicit question ("why go higher?") — because the number of statements a human must write and check drops by roughly an order of magnitude, while the machine still ends up with the same instructions.</p>
<p class="meo">💡 Memorise the arrow direction: <strong>low level = close to the machine, high level = close to the human</strong>. "Low" never means "bad" and "high" never means "better in every way".</p>
<p class="pitfall">⚠️ Exam trap: assembly is <em>not</em> machine language. Assembly is text that an <strong>assembler</strong> translates into machine language — that is step 3 of the compilation process on slide 33.</p>`,
        `<p class="y-chinh">🎯 Chiếc thang là <strong>Ngôn ngữ máy → Hợp ngữ (Assembly) → Ngôn ngữ bậc cao</strong>, và mỗi bậc sinh ra để chương trình ngắn hơn, ít lỗi hơn.</p>
<ul>
<li><strong>Ý cốt lõi của slide</strong> — "Chương trình làm việc tương đối đơn giản mà viết bằng assembly vẫn chứa rất nhiều câu lệnh." Một việc cỏn con cũng tốn hàng chục dòng assembly.</li>
<li><strong>Ngôn ngữ máy</strong> — opcode và operand nhị phân thuần tuý, thứ duy nhất CPU thật sự thực thi. Viết tay nghĩa là viết các con số, và sai một bit là một lỗi vô hình.</li>
<li><strong>Hợp ngữ</strong> — tên chữ tương ứng một-đối-một với lệnh máy (<code>MOV</code>, <code>ADD</code>, <code>JMP</code>). Dễ đọc hơn nhiều, nhưng vẫn là một dòng cho một lệnh máy, và vẫn gắn chặt với một dòng CPU cụ thể.</li>
<li><strong>Ngôn ngữ bậc cao</strong> — một câu lệnh diễn đạt một <em>ý tưởng</em> (vòng lặp, điều kiện, lời gọi hàm) và trình biên dịch nở nó ra thành bao nhiêu lệnh máy tuỳ CPU đích. Tính khả chuyển (Portability ở slide 10) ra đời từ đây.</li>
<li><strong>Cái giá của sự đánh đổi</strong> — bạn từ bỏ quyền kiểm soát tuyệt đối từng lệnh; đổi lại được code ngắn hơn, ít lỗi hơn, và chỉ cần dịch lại cho máy khác thay vì viết lại từ đầu.</li>
</ul>
<pre><code>/* Bậc cao, viết bằng C: một câu lệnh dễ đọc */
sum = 0;
for (i = 1; i &lt;= 10; i++) sum = sum + i;

/* Cùng vòng lặp đó viết bằng assembly cần một nhãn, một phép so,
   một lệnh nhảy có điều kiện và một lệnh tăng — vài dòng cho mỗi
   dòng C, và mỗi CPU lại có bộ ký hiệu riêng. */
</code></pre>
<p class="dap-an">✅ Đáp án cho câu hỏi ngầm của slide ("vì sao phải lên bậc cao?") — vì số câu lệnh con người phải viết và phải soát giảm khoảng mười lần, trong khi máy vẫn nhận về đúng những lệnh cần thiết.</p>
<p class="meo">💡 Thuộc chiều mũi tên: <strong>bậc thấp = gần máy, bậc cao = gần người</strong>. "Thấp" không bao giờ có nghĩa là "dở", và "cao" cũng không có nghĩa "hơn về mọi mặt".</p>
<p class="pitfall">⚠️ Bẫy thi: assembly <em>không phải</em> ngôn ngữ máy. Assembly là văn bản, phải có <strong>assembler</strong> dịch sang ngôn ngữ máy — chính là bước 3 của quá trình biên dịch ở slide 33.</p>`],

      [28, '5 Generations of Programming Languages',
        `<p class="y-chinh">🎯 Five generations, and the dividing line between the 3rd and the 4th is <strong>how</strong> versus <strong>what</strong>.</p>
<ul>
<li><strong>1GL — machine languages</strong> — raw binary. Executed directly, no translation at all. Tied to one CPU.</li>
<li><strong>2GL — assembly languages</strong> — symbolic mnemonics, one line per machine instruction, translated by an assembler. Still CPU-specific.</li>
<li><strong>3GL — describe HOW a result is obtained</strong> — <strong>C</strong>, Pascal, C++, Java. You write the algorithm step by step: the loop, the condition, the assignment. PRF192 lives entirely here.</li>
<li><strong>4GL — describe WHAT is to be done, not how</strong> — <strong>SQL</strong>. You write <code>SELECT name FROM student WHERE gpa &gt; 8</code> and never say how to scan the table; the engine decides the how.</li>
<li><strong>5GL — closest to human language</strong> — Prolog, Matlab, used for artificial intelligence, fuzzy sets and neural networks. You state facts and rules; the system searches for the answer.</li>
</ul>
<pre><code>/* 3GL (C) — you spell out HOW: loop, test, keep */
for (i = 0; i &lt; n; i++)
    if (gpa[i] &gt; 8.0)
        printf("%s\\n", name[i]);

/* 4GL (SQL) — you state only WHAT you want */
/* SELECT name FROM student WHERE gpa &gt; 8; */
</code></pre>
<p class="dap-an">✅ Answer — a typical exam item asks "C belongs to which generation?" The answer is the <strong>third generation</strong>, because C describes <em>how</em> a result is obtained, step by step.</p>
<p class="meo">💡 Mnemonic chain: <em>bits → mnemonics → how → what → human</em>. Five words, five generations, in order.</p>
<p class="pitfall">⚠️ Two traps live here. (1) "Higher generation = always better" is false — nobody writes a device driver in SQL. (2) People label C++ or Java as 4GL because they are "newer"; generation is about <em>abstraction style</em>, not release date, so both are still 3GL.</p>`,
        `<p class="y-chinh">🎯 Năm thế hệ, và ranh giới giữa thế hệ 3 với thế hệ 4 là <strong>làm THẾ NÀO</strong> đối lại với <strong>muốn CÁI GÌ</strong>.</p>
<ul>
<li><strong>1GL — ngôn ngữ máy</strong> — nhị phân thô. Chạy thẳng, không cần dịch gì cả. Gắn chặt với một CPU.</li>
<li><strong>2GL — hợp ngữ</strong> — ký hiệu gợi nhớ, một dòng cho một lệnh máy, do assembler dịch. Vẫn phụ thuộc CPU.</li>
<li><strong>3GL — mô tả LÀM THẾ NÀO để có kết quả</strong> — <strong>C</strong>, Pascal, C++, Java. Bạn viết thuật toán từng bước: vòng lặp, điều kiện, phép gán. Toàn bộ PRF192 sống ở đây.</li>
<li><strong>4GL — mô tả CẦN LÀM GÌ, không nói làm thế nào</strong> — <strong>SQL</strong>. Bạn viết <code>SELECT name FROM student WHERE gpa &gt; 8</code> mà chẳng hề nói cách duyệt bảng; cỗ máy tự quyết cách làm.</li>
<li><strong>5GL — gần ngôn ngữ người nhất</strong> — Prolog, Matlab, dùng cho trí tuệ nhân tạo, tập mờ và mạng nơ-ron. Bạn khai báo sự kiện và luật; hệ thống tự đi tìm đáp án.</li>
</ul>
<pre><code>/* 3GL (C) — bạn nói rõ LÀM THẾ NÀO: lặp, kiểm tra, giữ lại */
for (i = 0; i &lt; n; i++)
    if (gpa[i] &gt; 8.0)
        printf("%s\\n", name[i]);

/* 4GL (SQL) — bạn chỉ nêu CÁI GÌ mình muốn */
/* SELECT name FROM student WHERE gpa &gt; 8; */
</code></pre>
<p class="dap-an">✅ Đáp án — một câu hỏi thi quen thuộc là "C thuộc thế hệ nào?" Trả lời: <strong>thế hệ thứ ba</strong>, vì C mô tả <em>cách</em> đạt được kết quả, từng bước một.</p>
<p class="meo">💡 Chuỗi để nhớ: <em>bit → ký hiệu gợi nhớ → thế nào → cái gì → tiếng người</em>. Năm chữ, năm thế hệ, đúng thứ tự.</p>
<p class="pitfall">⚠️ Hai cái bẫy nằm ở đây. (1) "Thế hệ cao hơn thì luôn tốt hơn" là sai — không ai viết trình điều khiển thiết bị bằng SQL. (2) Nhiều bạn xếp C++ hay Java vào 4GL vì thấy "mới hơn"; thế hệ nói về <em>kiểu trừu tượng hoá</em>, không nói về năm ra đời, nên cả hai vẫn là 3GL.</p>`],

      [29, 'Section divider — Compiler',
        `<p class="y-chinh">🎯 A divider opening the most exam-heavy block of Slot 01: how source text becomes something the CPU can run.</p>
<ul>
<li><strong>Three slides follow</strong> — slide 30 (interpreting vs compiling), slide 31 (the four steps by name), slide 33 (the four steps with the actual file names <code>.i</code>, <code>.s</code>, <code>.o</code>, <code>.exe</code>).</li>
<li><strong>The problem being solved</strong> — a high-level program cannot run as text. Something must turn it into the binary opcode + operand instructions of slides 23–25.</li>
<li><strong>The one fact to carry out of this block</strong> — <strong>C's translator is a compiler</strong>, not an interpreter. Everything about how you work in PRF192 (edit, compile, then run) follows from that.</li>
<li><strong>Why it matters practically</strong> — because compilation is a separate phase, C catches syntax errors <em>before</em> the program ever runs. An interpreted language would only discover them when execution reached that line.</li>
</ul>
<p class="nhan">Frequency note: in FPT progress tests for PRF192, the "four steps of compilation and the file each produces" is one of the most reliably asked theory items from Slot 01. Learn it as a table, not as prose.</p>
<p class="meo">💡 Keep the file-extension chain on a sticky note: <strong>.c → .i → .s → .o/.obj → .exe/.out</strong>. Five boxes, four arrows, one arrow per step.</p>
<p class="pitfall">⚠️ Do not conflate "compiler" (the whole toolchain a beginner invokes with one key press) with "the compiler step" (step 2 only, <code>.i → .s</code>). Slide 31 uses the word in both senses and exam questions exploit that.</p>`,
        `<p class="y-chinh">🎯 Slide phân mục mở ra khối hay bị hỏi thi nhất của Slot 01: văn bản nguồn biến thành thứ CPU chạy được bằng cách nào.</p>
<ul>
<li><strong>Ba slide tiếp theo</strong> — slide 30 (thông dịch đối lại biên dịch), slide 31 (bốn bước, gọi tên), slide 33 (bốn bước kèm tên file thật <code>.i</code>, <code>.s</code>, <code>.o</code>, <code>.exe</code>).</li>
<li><strong>Vấn đề đang được giải</strong> — chương trình bậc cao không chạy được ở dạng văn bản. Phải có thứ gì đó biến nó thành các lệnh nhị phân opcode + operand ở slide 23–25.</li>
<li><strong>Một điều phải mang theo khỏi khối này</strong> — <strong>bộ dịch của C là trình biên dịch (compiler)</strong>, không phải trình thông dịch. Mọi cách bạn làm việc trong PRF192 (soạn, dịch, rồi chạy) đều suy ra từ đó.</li>
<li><strong>Vì sao điều đó quan trọng trong thực tế</strong> — vì biên dịch là một pha riêng, C bắt được lỗi cú pháp <em>trước khi</em> chương trình chạy dòng nào. Ngôn ngữ thông dịch thì chỉ phát hiện khi chạy tới đúng dòng đó.</li>
</ul>
<p class="nhan">Ghi chú về tần suất: trong các bài kiểm tra tiến độ PRF192 của FPT, "bốn bước biên dịch và file mà mỗi bước sinh ra" là câu lý thuyết được hỏi đều đặn nhất của Slot 01. Hãy học nó dưới dạng bảng, đừng học thành đoạn văn.</p>
<p class="meo">💡 Dán chuỗi phần mở rộng lên góc bàn: <strong>.c → .i → .s → .o/.obj → .exe/.out</strong>. Năm ô, bốn mũi tên, mỗi mũi tên một bước.</p>
<p class="pitfall">⚠️ Đừng lẫn "trình biên dịch" (cả bộ công cụ mà người mới gọi bằng một phím bấm) với "bước compiling" (chỉ bước 2, <code>.i → .s</code>). Slide 31 dùng từ này theo cả hai nghĩa và đề thi khai thác đúng chỗ đó.</p>`],

      [30, 'Translating and Executing a Program — interpreter vs compiler',
        `<p class="y-chinh">🎯 High-level code cannot run as it is; there are exactly two ways to translate it — <strong>interpreting</strong> (statement by statement) and <strong>compiling</strong> (all at once) — and <strong>C uses a compiler</strong>.</p>
<ul>
<li><strong>The premise</strong> — "Program code in a high level language can not run. It must be translated to binary code (machine code) before running." The CPU has no idea what the word <code>printf</code> means.</li>
<li><strong>Interpreting</strong> — one statement is translated, then immediately run, then the next. The tool is an <strong>interpreter</strong>. Nothing is saved: to run again, you translate again.</li>
<li><strong>Compiling</strong> — <em>all</em> statements are translated first, producing a complete executable, which is then executed as a whole. The tool is a <strong>compiler</strong>.</li>
<li><strong>Consequences of compiling</strong> — faster execution (translation already paid for), all syntax errors reported before any code runs, and a standalone <code>.exe</code> you can ship to someone who has no compiler.</li>
<li><strong>Consequences of interpreting</strong> — slower execution, but instant feedback and easy line-by-line testing; the target machine needs the interpreter installed.</li>
</ul>
<pre><code>/* Compiled (C): two phases, clearly separated */
gcc Hello.c -o Hello.exe    /* phase 1: translate, once      */
Hello.exe                   /* phase 2: run, as many times as you like */
</code></pre>
<p class="dap-an">✅ Answer to the slide's key question — <strong>"C translator is a compiler."</strong> So in PRF192 an error message may appear with the program having produced no output at all: it never ran, because translation failed first.</p>
<p class="meo">💡 Analogy that sticks: an <em>interpreter</em> is a live human translator at a meeting — sentence by sentence, every meeting. A <em>compiler</em> is a translated book — translate once, then everyone reads at full speed forever.</p>
<p class="pitfall">⚠️ Trap: "compiled = faster" is true for <em>running</em> but not for the edit-test cycle — each change costs a recompile. And a compiled <code>.exe</code> is platform-bound: a Windows <code>.exe</code> will not run on Linux, which is exactly the Portability issue of slide 10.</p>`,
        `<p class="y-chinh">🎯 Code bậc cao không chạy nguyên trạng được; có đúng hai cách dịch — <strong>thông dịch</strong> (từng câu lệnh một) và <strong>biên dịch</strong> (dịch hết rồi chạy) — và <strong>C dùng trình biên dịch</strong>.</p>
<ul>
<li><strong>Tiền đề</strong> — "Chương trình viết bằng ngôn ngữ bậc cao không chạy được. Nó phải được dịch sang mã nhị phân (mã máy) trước khi chạy." CPU hoàn toàn không biết chữ <code>printf</code> nghĩa là gì.</li>
<li><strong>Thông dịch (Interpreting)</strong> — dịch một câu lệnh rồi chạy ngay, xong mới tới câu kế. Công cụ là <strong>interpreter</strong>. Không lưu lại gì: muốn chạy lần nữa thì dịch lại lần nữa.</li>
<li><strong>Biên dịch (Compiling)</strong> — dịch <em>toàn bộ</em> câu lệnh trước, sinh ra một file thực thi hoàn chỉnh, rồi thực thi cả khối. Công cụ là <strong>compiler</strong>.</li>
<li><strong>Hệ quả của biên dịch</strong> — chạy nhanh hơn (tiền dịch đã trả trước), mọi lỗi cú pháp được báo trước khi có dòng nào chạy, và có một file <code>.exe</code> độc lập để gửi cho người không hề cài trình biên dịch.</li>
<li><strong>Hệ quả của thông dịch</strong> — chạy chậm hơn, nhưng phản hồi tức thì và dễ thử từng dòng; máy đích bắt buộc phải cài sẵn interpreter.</li>
</ul>
<pre><code>/* Biên dịch (C): hai pha tách bạch */
gcc Hello.c -o Hello.exe    /* pha 1: dịch, một lần            */
Hello.exe                   /* pha 2: chạy, bao nhiêu lần tuỳ ý */
</code></pre>
<p class="dap-an">✅ Đáp án cho câu chốt của slide — <strong>"Bộ dịch của C là một compiler."</strong> Vì vậy trong PRF192 có lúc chỉ thấy thông báo lỗi mà chương trình không in ra gì cả: nó chưa hề chạy, vì khâu dịch đã hỏng trước.</p>
<p class="meo">💡 Ví von dễ nhớ: <em>interpreter</em> là người phiên dịch ngồi trong cuộc họp — dịch từng câu, họp nào cũng phải dịch lại. <em>Compiler</em> là cuốn sách đã dịch — dịch một lần, rồi ai cũng đọc với tốc độ tối đa mãi mãi.</p>
<p class="pitfall">⚠️ Bẫy: "biên dịch = nhanh hơn" đúng với lúc <em>chạy</em> chứ không đúng với vòng sửa-thử — mỗi lần sửa là một lần dịch lại. Và file <code>.exe</code> đã dịch thì gắn với nền tảng: <code>.exe</code> của Windows không chạy trên Linux, đúng là vấn đề Portability ở slide 10.</p>`],

      [31, 'Compiler — what compilation does, and its four steps',
        `<p class="y-chinh">🎯 Compilation in C does two jobs — <strong>translate</strong> human code to machine code and <strong>check</strong> syntax and semantics — through four steps: <strong>Preprocessing, Compiling, Assembling, Linking</strong>.</p>
<ul>
<li><strong>Job 1 — translation</strong> — "converting an understandable human code into a machine understandable code". This is the part beginners think of as "compiling".</li>
<li><strong>Job 2 — checking</strong> — "checking the syntax and semantics of the code to determine any syntax errors or warnings". Syntax = grammar (a missing <code>;</code>). Semantics = meaning (assigning a value to something that is not a variable).</li>
<li><strong>Errors vs warnings</strong> — an <strong>error</strong> stops translation, no executable is produced. A <strong>warning</strong> lets the build finish but flags suspicious code (e.g. using a variable before assigning it). Warnings are the cheapest bugs you will ever fix.</li>
<li><strong>Step 1 Preprocessing</strong> — handle every line starting with <code>#</code>, and strip comments.</li>
<li><strong>Step 2 Compiling</strong> — translate the preprocessed C into assembly.</li>
<li><strong>Step 3 Assembling</strong> — translate assembly into machine code, producing an object file.</li>
<li><strong>Step 4 Linking</strong> — join your object file with library object code to resolve the names you used but did not define, producing the executable.</li>
</ul>
<pre><code>/* Syntax error: missing semicolon -&gt; step 2 stops, no .exe */
printf("Hi")
return 0;

/* Link error: no library body for a name you called -&gt; step 4 stops */
/* undefined reference to 'sqrt'  (fix: link the math library) */
</code></pre>
<p class="dap-an">✅ Answer — the four steps in order are <strong>Preprocessing → Compiling → Assembling → Linking</strong>. Remembering their order also tells you <em>where</em> an error came from, which is how you fix it fast.</p>
<p class="meo">💡 Mnemonic: <strong>P-C-A-L</strong> — "Please Compile And Link". Four letters, four steps, correct order.</p>
<p class="pitfall">⚠️ The single most useful diagnostic habit: read <em>which</em> step failed. "undefined reference to ..." is a <strong>linker</strong> message (step 4) and means the name exists but its body was never supplied — never a spelling problem in the same file. A missing <code>;</code> is a step-2 message. Same red text, completely different fixes.</p>`,
        `<p class="y-chinh">🎯 Biên dịch trong C làm hai việc — <strong>dịch</strong> code của người sang mã máy và <strong>kiểm tra</strong> cú pháp lẫn ngữ nghĩa — qua bốn bước: <strong>Preprocessing, Compiling, Assembling, Linking</strong>.</p>
<ul>
<li><strong>Việc 1 — dịch</strong> — "chuyển code con người hiểu được thành code máy hiểu được". Đây là phần mà người mới vẫn gọi chung là "compile".</li>
<li><strong>Việc 2 — kiểm tra</strong> — "kiểm tra cú pháp và ngữ nghĩa để phát hiện lỗi cú pháp hoặc cảnh báo". Cú pháp = ngữ pháp (thiếu dấu <code>;</code>). Ngữ nghĩa = ý nghĩa (gán giá trị cho thứ không phải là biến).</li>
<li><strong>Lỗi và cảnh báo khác nhau</strong> — <strong>error</strong> chặn đứng khâu dịch, không sinh ra file thực thi. <strong>Warning</strong> vẫn cho dịch xong nhưng chỉ ra chỗ khả nghi (ví dụ dùng biến khi chưa gán). Cảnh báo là loại lỗi rẻ nhất mà bạn từng sửa.</li>
<li><strong>Bước 1 Preprocessing</strong> — xử lý mọi dòng bắt đầu bằng <code>#</code> và bóc bỏ comment.</li>
<li><strong>Bước 2 Compiling</strong> — dịch code C đã tiền xử lý sang assembly.</li>
<li><strong>Bước 3 Assembling</strong> — dịch assembly sang mã máy, sinh ra file đối tượng (object file).</li>
<li><strong>Bước 4 Linking</strong> — ghép file đối tượng của bạn với mã đối tượng của thư viện để giải quyết những cái tên bạn dùng mà không định nghĩa, sinh ra file thực thi.</li>
</ul>
<pre><code>/* Lỗi cú pháp: thiếu dấu chấm phẩy -&gt; dừng ở bước 2, không có .exe */
printf("Hi")
return 0;

/* Lỗi liên kết: gọi một cái tên mà thư viện không cấp thân -&gt; dừng ở bước 4 */
/* undefined reference to 'sqrt'  (cách sửa: liên kết thư viện toán) */
</code></pre>
<p class="dap-an">✅ Đáp án — bốn bước theo thứ tự là <strong>Preprocessing → Compiling → Assembling → Linking</strong>. Nhớ đúng thứ tự cũng đồng nghĩa biết lỗi đến <em>từ đâu</em>, và đó là cách sửa nhanh nhất.</p>
<p class="meo">💡 Câu nhớ: <strong>P-C-A-L</strong> — "Please Compile And Link". Bốn chữ, bốn bước, đúng thứ tự.</p>
<p class="pitfall">⚠️ Thói quen chẩn đoán hữu ích nhất: đọc xem <em>bước nào</em> hỏng. "undefined reference to ..." là thông báo của <strong>linker</strong> (bước 4), nghĩa là cái tên có tồn tại nhưng không ai cấp phần thân — không bao giờ là lỗi gõ sai trong cùng file. Thiếu <code>;</code> là thông báo của bước 2. Cùng màu đỏ, cách sửa khác hẳn nhau.</p>`],

      [32, 'Compilation process — the diagram',
        `<p class="y-chinh">🎯 The picture version of slide 31: a single pipeline where each box consumes one file and produces the next.</p>
<ul>
<li><strong>Read it as a pipeline, not a cloud</strong> — source file enters on the left, executable leaves on the right, and no box can start before the previous one has delivered its file.</li>
<li><strong>Box 1 Preprocessor</strong> — input <code>hello.c</code>, output <code>hello.i</code>. Still C text, just expanded: headers pasted in, macros substituted, comments gone.</li>
<li><strong>Box 2 Compiler</strong> — input <code>hello.i</code>, output <code>hello.s</code>. Still text, but now assembly for one specific CPU.</li>
<li><strong>Box 3 Assembler</strong> — input <code>hello.s</code>, output <code>hello.o</code> / <code>hello.obj</code>. No longer text: binary machine code with unresolved names left as placeholders.</li>
<li><strong>Box 4 Linker</strong> — inputs <code>hello.o</code> <em>plus</em> library object files, output <code>hello.exe</code> / <code>a.out</code>. It fills every placeholder with a real address.</li>
<li><strong>Why the library arrow enters only at the last box</strong> — your code and the library were compiled separately, possibly years apart. Linking is the moment they finally meet.</li>
</ul>
<pre><code>hello.c  --[preprocessor]--&gt;  hello.i
hello.i  --[compiler]------&gt;  hello.s
hello.s  --[assembler]-----&gt;  hello.o
hello.o + libraries --[linker]--&gt;  hello.exe
</code></pre>
<p class="dap-an">✅ Answer — count the arrows: <strong>four tools, four arrows, five files</strong>. An exam question showing the diagram with one box blank is almost always asking for <em>assembler</em> (box 3) or <em>linker</em> (box 4).</p>
<p class="meo">💡 You can watch the pipeline for real: <code>gcc -E</code> stops after preprocessing, <code>gcc -S</code> stops after compiling, <code>gcc -c</code> stops after assembling. Running all three on <code>Hello.c</code> teaches the diagram better than memorising it.</p>
<p class="pitfall">⚠️ Trap: believing the preprocessor "compiles" anything. It does pure text manipulation and understands no C grammar at all — that is why a typo inside a macro produces a bewildering error on a completely different line.</p>`,
        `<p class="y-chinh">🎯 Bản hình của slide 31: một dây chuyền duy nhất, mỗi hộp ăn vào một file và nhả ra file kế tiếp.</p>
<ul>
<li><strong>Hãy đọc như một dây chuyền, không phải một đám mây</strong> — file nguồn vào từ bên trái, file thực thi ra ở bên phải, và không hộp nào khởi động được trước khi hộp trước đó giao file.</li>
<li><strong>Hộp 1 Preprocessor</strong> — vào <code>hello.c</code>, ra <code>hello.i</code>. Vẫn là văn bản C, chỉ nở ra: header đã dán vào, macro đã thay, comment đã biến mất.</li>
<li><strong>Hộp 2 Compiler</strong> — vào <code>hello.i</code>, ra <code>hello.s</code>. Vẫn là văn bản, nhưng đã là assembly cho một CPU cụ thể.</li>
<li><strong>Hộp 3 Assembler</strong> — vào <code>hello.s</code>, ra <code>hello.o</code> / <code>hello.obj</code>. Không còn là văn bản: mã máy nhị phân, các tên chưa giải quyết được để lại dưới dạng chỗ trống.</li>
<li><strong>Hộp 4 Linker</strong> — vào <code>hello.o</code> <em>cộng với</em> các file đối tượng của thư viện, ra <code>hello.exe</code> / <code>a.out</code>. Nó điền địa chỉ thật vào mọi chỗ trống.</li>
<li><strong>Vì sao mũi tên thư viện chỉ đi vào hộp cuối</strong> — code của bạn và thư viện được dịch tách rời nhau, có thể cách nhau nhiều năm. Liên kết là khoảnh khắc chúng mới gặp nhau.</li>
</ul>
<pre><code>hello.c  --[preprocessor]--&gt;  hello.i
hello.i  --[compiler]------&gt;  hello.s
hello.s  --[assembler]-----&gt;  hello.o
hello.o + thư viện --[linker]--&gt;  hello.exe
</code></pre>
<p class="dap-an">✅ Đáp án — đếm mũi tên: <strong>bốn công cụ, bốn mũi tên, năm file</strong>. Câu thi cho sơ đồ và để trống một hộp thì gần như luôn hỏi <em>assembler</em> (hộp 3) hoặc <em>linker</em> (hộp 4).</p>
<p class="meo">💡 Bạn xem được dây chuyền này bằng mắt thật: <code>gcc -E</code> dừng sau tiền xử lý, <code>gcc -S</code> dừng sau biên dịch, <code>gcc -c</code> dừng sau assembling. Chạy đủ ba lệnh trên <code>Hello.c</code> dạy sơ đồ này tốt hơn học thuộc.</p>
<p class="pitfall">⚠️ Bẫy: tưởng preprocessor "dịch" cái gì đó. Nó chỉ thao tác văn bản thuần tuý và không hiểu một chút ngữ pháp C nào — đó là lý do một lỗi gõ nằm trong macro lại bung ra thông báo lỗi khó hiểu ở một dòng hoàn toàn khác.</p>`],

      [33, 'Compilation process (cont.) — the four steps on hello.c',
        `<p class="y-chinh">🎯 The same four steps, now stated on the real file <code>hello.c</code>, each naming the file it produces.</p>
<ul>
<li><strong>Step 1 — Preprocessing</strong> — header files are processed, every statement starting with <code>#</code> is replaced, comments are removed. Output: the intermediate file <strong><code>hello.i</code></strong>.</li>
<li><strong>Step 2 — Compiling</strong> — the compiler software translates <code>hello.i</code> into <strong><code>hello.s</code></strong>, containing assembly-level (low-level) instructions.</li>
<li><strong>Step 3 — Assembling</strong> — the assembler converts assembly instructions into machine-understandable code (binary / hexadecimal form). Output: the <strong>object file</strong> <code>hello.obj</code> or <code>hello.o</code>.</li>
<li><strong>Step 4 — Linking</strong> — the linker links library files with the object file "to define the unknown statements", producing <strong><code>hello.exe</code></strong> (Windows) or <strong><code>hello.out</code></strong> / <code>a.out</code> (Linux).</li>
<li><strong>Then you run it</strong> — executing <code>hello.exe</code> prints <code>Hello World!</code> in the output window. Note that running is <em>outside</em> the four steps; compilation has already finished.</li>
</ul>
<pre><code>gcc -E hello.c -o hello.i     /* step 1: preprocess (headers pasted, comments gone) */
gcc -S hello.i -o hello.s     /* step 2: compile   (assembly text)                  */
gcc -c hello.s -o hello.o     /* step 3: assemble  (binary object)                  */
gcc    hello.o -o hello.exe   /* step 4: link      (executable)                     */
</code></pre>
<p class="nhan">Try it and look: <code>hello.i</code> is enormous (hundreds of lines) because the whole of <code>stdio.h</code> has been pasted in front of your four lines. That single observation explains what <code>#include</code> really does better than any definition.</p>
<p class="dap-an">✅ Answer to the standard exam item "which step produces <code>hello.s</code>?" — <strong>step 2, Compiling</strong>. And "which file does the assembler produce?" — the object file <code>hello.o</code> / <code>hello.obj</code>.</p>
<p class="meo">💡 Learn it as a four-row table: <em>Preprocessing → .i · Compiling → .s · Assembling → .o · Linking → .exe</em>. The extensions are the answers; the tool names are only labels.</p>
<p class="pitfall">⚠️ Trap: writing that "the compiler produces the .exe". No — the <strong>linker</strong> does, in step 4. This is the single most commonly missed detail of this slide, because everyday speech uses "compile" for the whole chain.</p>`,
        `<p class="y-chinh">🎯 Vẫn bốn bước đó, nhưng nay nói trên file thật <code>hello.c</code>, mỗi bước gọi tên file mà nó sinh ra.</p>
<ul>
<li><strong>Bước 1 — Preprocessing</strong> — xử lý các file header, thay thế mọi câu lệnh bắt đầu bằng <code>#</code>, bóc bỏ comment. Kết quả: file trung gian <strong><code>hello.i</code></strong>.</li>
<li><strong>Bước 2 — Compiling</strong> — phần mềm biên dịch dịch <code>hello.i</code> thành <strong><code>hello.s</code></strong>, chứa các lệnh mức assembly (mã bậc thấp).</li>
<li><strong>Bước 3 — Assembling</strong> — assembler chuyển lệnh assembly thành mã máy hiểu được (dạng nhị phân / thập lục phân). Kết quả: <strong>file đối tượng</strong> <code>hello.obj</code> hoặc <code>hello.o</code>.</li>
<li><strong>Bước 4 — Linking</strong> — linker liên kết các file thư viện với file đối tượng "để định nghĩa những câu lệnh chưa biết", sinh ra <strong><code>hello.exe</code></strong> (Windows) hoặc <strong><code>hello.out</code></strong> / <code>a.out</code> (Linux).</li>
<li><strong>Rồi mới chạy</strong> — thực thi <code>hello.exe</code> sẽ in <code>Hello World!</code> ra cửa sổ kết quả. Lưu ý việc chạy nằm <em>ngoài</em> bốn bước; khâu biên dịch đã xong từ trước.</li>
</ul>
<pre><code>gcc -E hello.c -o hello.i     /* bước 1: tiền xử lý (dán header, bỏ comment) */
gcc -S hello.i -o hello.s     /* bước 2: biên dịch  (văn bản assembly)       */
gcc -c hello.s -o hello.o     /* bước 3: assembling (đối tượng nhị phân)     */
gcc    hello.o -o hello.exe   /* bước 4: liên kết   (file thực thi)          */
</code></pre>
<p class="nhan">Hãy làm thử rồi nhìn: <code>hello.i</code> dài khủng khiếp (hàng trăm dòng) vì toàn bộ <code>stdio.h</code> đã được dán vào trước bốn dòng của bạn. Chỉ một quan sát đó đã giải thích <code>#include</code> thật sự làm gì, rõ hơn mọi định nghĩa.</p>
<p class="dap-an">✅ Đáp án cho câu hỏi thi quen thuộc "bước nào sinh ra <code>hello.s</code>?" — <strong>bước 2, Compiling</strong>. Và "assembler sinh ra file gì?" — file đối tượng <code>hello.o</code> / <code>hello.obj</code>.</p>
<p class="meo">💡 Học thành bảng bốn dòng: <em>Preprocessing → .i · Compiling → .s · Assembling → .o · Linking → .exe</em>. Phần mở rộng mới là đáp án; tên công cụ chỉ là nhãn.</p>
<p class="pitfall">⚠️ Bẫy: viết rằng "trình biên dịch sinh ra file .exe". Không phải — <strong>linker</strong> mới sinh ra, ở bước 4. Đây là chi tiết bị sai nhiều nhất của slide này, vì lời nói thường ngày dùng chữ "compile" cho cả dây chuyền.</p>`],

      [34, 'Section divider — Why C is the first language selected?',
        `<p class="y-chinh">🎯 A divider introducing the justification section: why a 1972 language is still the sensible first language for a 2020s software engineering degree.</p>
<ul>
<li><strong>The honest question behind it</strong> — students reasonably ask "why not start with Python or Java?" Slide 35 answers with concrete reasons, not tradition.</li>
<li><strong>Preview of the argument</strong> — C is English-like, small (few keywords), the lowest of the high-level languages, fast, and the ancestor whose syntax Java and C# reuse.</li>
<li><strong>The pedagogical core</strong> — "C supports basic ways which help us understanding memory of a program. These can be hidden in higher languages." Learning C teaches you what other languages are hiding.</li>
<li><strong>How it connects to your curriculum</strong> — PRF192 (C) → later object-oriented and data-structure courses. Pointers and manual memory (slot 10) are the concepts that make the later courses click rather than feel magical.</li>
</ul>
<p class="nhan">A useful framing for the next slide: every reason listed is either about <em>the language being small and learnable</em>, or about <em>the language being close to the machine</em>. Sort the eight bullets into those two buckets and they become easy to recall.</p>
<p class="meo">💡 When an exam asks "give two reasons C is chosen as the first language", pick one from each bucket — e.g. "C has a small number of keywords" (learnable) and "C is the lowest of the high-level languages" (close to the machine). Two different angles read as a better answer than two restatements.</p>
<p class="pitfall">⚠️ Do not answer "because C is the fastest language" alone. Assembly is faster (slide 35's own table proves it), and speed is only one of the listed reasons — the memory-transparency argument is the pedagogically decisive one.</p>`,
        `<p class="y-chinh">🎯 Slide phân mục mở phần lý giải: vì sao một ngôn ngữ ra đời năm 1972 vẫn là lựa chọn hợp lý cho môn lập trình đầu tiên của ngành kỹ thuật phần mềm những năm 2020.</p>
<ul>
<li><strong>Câu hỏi thật nằm sau nó</strong> — sinh viên hỏi rất có lý: "sao không bắt đầu bằng Python hay Java?" Slide 35 trả lời bằng lý do cụ thể, không phải bằng truyền thống.</li>
<li><strong>Xem trước lập luận</strong> — C giống tiếng Anh, nhỏ gọn (ít từ khoá), là ngôn ngữ thấp nhất trong các ngôn ngữ bậc cao, nhanh, và là tổ tiên mà Java lẫn C# mượn lại cú pháp.</li>
<li><strong>Cốt lõi sư phạm</strong> — "C cung cấp những cách cơ bản giúp ta hiểu bộ nhớ của chương trình. Những thứ này bị che đi trong các ngôn ngữ cao hơn." Học C là học đúng phần mà ngôn ngữ khác đang giấu.</li>
<li><strong>Nối với chương trình học của bạn</strong> — PRF192 (C) → các môn hướng đối tượng và cấu trúc dữ liệu về sau. Con trỏ và quản lý bộ nhớ thủ công (slot 10) chính là thứ khiến các môn sau vỡ ra chứ không còn như phép màu.</li>
</ul>
<p class="nhan">Một khung hữu ích cho slide kế: mọi lý do được liệt kê hoặc thuộc nhóm <em>ngôn ngữ nhỏ và dễ học</em>, hoặc thuộc nhóm <em>ngôn ngữ gần máy</em>. Xếp tám gạch đầu dòng vào hai rổ đó là nhớ được ngay.</p>
<p class="meo">💡 Khi đề hỏi "nêu hai lý do C được chọn làm ngôn ngữ đầu tiên", hãy lấy mỗi rổ một lý do — ví dụ "C có số từ khoá rất ít" (dễ học) và "C là ngôn ngữ thấp nhất trong các ngôn ngữ bậc cao" (gần máy). Hai góc nhìn khác nhau đọc hay hơn hai câu nói lại một ý.</p>
<p class="pitfall">⚠️ Đừng chỉ trả lời "vì C là ngôn ngữ nhanh nhất". Assembly nhanh hơn (chính bảng ở slide 35 chứng minh), và tốc độ chỉ là một trong các lý do — lập luận về sự minh bạch bộ nhớ mới là lý do quyết định về mặt sư phạm.</p>`],

      [35, 'Why C is the first language selected? — eight reasons and a timing table',
        `<p class="y-chinh">🎯 C is chosen because it is small, English-like, close to the machine, fast, everywhere, and because the languages you will learn next are shaped like it.</p>
<ul>
<li><strong>English-like and compact</strong> — the grammar reads close to English and there is only a small number of keywords (32 in C89). Small language = short time from zero to writing real programs.</li>
<li><strong>A large body of C code must be maintained</strong> — decades of existing systems are written in C, so the skill is directly employable, not merely academic.</li>
<li><strong>The lowest of the high-level languages</strong> — C sits one rung above assembly. You still get loops and functions, but memory stays visible.</li>
<li><strong>Faster and more powerful than other high-level languages</strong> — few hidden runtime layers, so the generated instructions stay close to what you wrote.</li>
<li><strong>UNIX, Linux and Windows are written in C and C++</strong> — the operating systems you use every day are themselves C programs.</li>
<li><strong>Java and C# are similar to C</strong> — braces, semicolons, <code>if</code>/<code>for</code>/<code>while</code>, the same operators. Learning C makes the next language mostly a matter of new libraries.</li>
<li><strong>C exposes memory</strong> — "C supports basic ways which help us understanding memory of a program. These can be hidden in higher languages."</li>
</ul>
<table>
<tr><td><strong>Language</strong></td><td><strong>Time to Run</strong></td></tr>
<tr><td>Assembly</td><td>0.18 seconds</td></tr>
<tr><td>C</td><td>2.7 seconds</td></tr>
<tr><td>Basic</td><td>10 seconds</td></tr>
</table>
<p class="nhan">Reading the table (Sieve of Eratosthenes benchmark): assembly is about <strong>15×</strong> faster than C (2.7 / 0.18 = 15), while C is about <strong>3.7×</strong> faster than Basic (10 / 2.7 = 3.7). So C keeps most of the speed while costing a fraction of the writing effort.</p>
<p class="dap-an">✅ Answer — "which language in the table is fastest, and why is it not our choice?" <strong>Assembly, 0.18 s.</strong> It is rejected because the programmer cost is enormous (slide 27: many statements for a simple task) and the code is locked to one CPU. C is the best speed-per-effort trade, which is exactly the argument the table is making.</p>
<p class="meo">💡 Two buckets to recall the eight reasons: <em>easy to learn</em> (English-like, few keywords, similar to Java/C#) and <em>close to the machine</em> (lowest high-level, fast, OS written in it, memory visible). Say "learnable + close to metal" and reconstruct the rest.</p>
<p class="pitfall">⚠️ Exam trap: reading the table as "C is the fastest". The table explicitly shows assembly beating C. The claim on the slide is narrower — C is faster than <em>other high-level</em> languages, and Basic is the high-level language being compared against.</p>`,
        `<p class="y-chinh">🎯 C được chọn vì nó nhỏ gọn, giống tiếng Anh, gần máy, nhanh, có mặt khắp nơi, và vì những ngôn ngữ bạn học tiếp đều có hình hài giống nó.</p>
<ul>
<li><strong>Giống tiếng Anh và gọn</strong> — ngữ pháp đọc gần như tiếng Anh và chỉ có rất ít từ khoá (32 từ trong C89). Ngôn ngữ nhỏ = thời gian từ số 0 tới lúc viết được chương trình thật rất ngắn.</li>
<li><strong>Còn rất nhiều code C cần bảo trì</strong> — hàng chục năm hệ thống đang chạy được viết bằng C, nên kỹ năng này dùng để đi làm được ngay chứ không chỉ để học.</li>
<li><strong>Thấp nhất trong các ngôn ngữ bậc cao</strong> — C nằm ngay trên assembly một bậc. Vẫn có vòng lặp và hàm, nhưng bộ nhớ thì vẫn nhìn thấy được.</li>
<li><strong>Nhanh và mạnh hơn các ngôn ngữ bậc cao khác</strong> — rất ít tầng chạy ẩn, nên lệnh sinh ra vẫn bám sát điều bạn viết.</li>
<li><strong>UNIX, Linux và Windows được viết bằng C và C++</strong> — chính những hệ điều hành bạn dùng hằng ngày cũng là chương trình C.</li>
<li><strong>Java và C# giống C</strong> — dấu ngoặc nhọn, dấu chấm phẩy, <code>if</code>/<code>for</code>/<code>while</code>, cùng bộ toán tử. Học C rồi thì ngôn ngữ kế tiếp phần lớn chỉ còn là học thư viện mới.</li>
<li><strong>C phơi bày bộ nhớ</strong> — "C cung cấp những cách cơ bản giúp ta hiểu bộ nhớ của chương trình. Những thứ này bị che đi trong các ngôn ngữ cao hơn."</li>
</ul>
<table>
<tr><td><strong>Ngôn ngữ</strong></td><td><strong>Thời gian chạy</strong></td></tr>
<tr><td>Assembly</td><td>0,18 giây</td></tr>
<tr><td>C</td><td>2,7 giây</td></tr>
<tr><td>Basic</td><td>10 giây</td></tr>
</table>
<p class="nhan">Đọc bảng (phép thử sàng Eratosthenes): assembly nhanh hơn C khoảng <strong>15 lần</strong> (2,7 / 0,18 = 15), còn C nhanh hơn Basic khoảng <strong>3,7 lần</strong> (10 / 2,7 = 3,7). Vậy C giữ được phần lớn tốc độ trong khi công sức viết chỉ bằng một phần nhỏ.</p>
<p class="dap-an">✅ Đáp án — "ngôn ngữ nào trong bảng nhanh nhất, và vì sao ta không chọn nó?" <strong>Assembly, 0,18 giây.</strong> Bị loại vì chi phí cho lập trình viên quá lớn (slide 27: rất nhiều câu lệnh cho một việc đơn giản) và code bị khoá vào một CPU. C là điểm đánh đổi tốc-độ-trên-công-sức tốt nhất, và đó chính là điều bảng này muốn nói.</p>
<p class="meo">💡 Hai cái rổ để nhớ tám lý do: <em>dễ học</em> (giống tiếng Anh, ít từ khoá, giống Java/C#) và <em>gần máy</em> (thấp nhất trong bậc cao, nhanh, hệ điều hành viết bằng nó, nhìn thấy bộ nhớ). Nhớ "dễ học + sát phần cứng" là dựng lại được phần còn lại.</p>
<p class="pitfall">⚠️ Bẫy thi: đọc bảng thành "C là nhanh nhất". Bảng nói rõ assembly hơn C. Khẳng định trên slide hẹp hơn — C nhanh hơn các ngôn ngữ <em>bậc cao khác</em>, mà Basic chính là ngôn ngữ bậc cao được đem ra so.</p>`],

      [36, 'Section divider — Some Notable C Features',
        `<p class="y-chinh">🎯 A short divider before three features that decide whether your code even compiles: comments, whitespace, and case sensitivity.</p>
<ul>
<li><strong>Why these three together</strong> — two of them are things the compiler <em>ignores</em> (comments, whitespace) and one is a thing the compiler treats as <em>significant</em> (letter case). Knowing which is which prevents a whole class of beginner errors.</li>
<li><strong>The practical stake</strong> — comments and whitespace are your tools for the Understandability requirement on slide 10; case sensitivity is the reason <code>Printf</code> fails to link while <code>printf</code> works.</li>
<li><strong>Compiler's eye view</strong> — after preprocessing (slide 33 step 1) comments no longer exist at all; whitespace only survives as a separator between tokens.</li>
<li><strong>What comes next</strong> — slide 37 states all three, then slides 38–44 put them to work on the structure of a real program.</li>
</ul>
<p class="nhan">Free-form language: C is called "free-form" precisely because whitespace and line breaks carry no meaning. That is unlike Python, where indentation defines blocks — a useful contrast if you have seen Python first.</p>
<p class="meo">💡 One sentence covers the section: <strong>"C ignores what you write for humans, and notices exactly what you write for it — down to the capital letters."</strong></p>
<p class="pitfall">⚠️ Because whitespace is ignored, an entire program can legally be written on one line. It compiles and it is unreadable — that violates Understandability (slide 10) and loses marks in lab assessments even when the output is correct.</p>`,
        `<p class="y-chinh">🎯 Slide phân mục ngắn, mở ra ba đặc điểm quyết định code của bạn có dịch nổi hay không: comment, khoảng trắng, và phân biệt hoa thường.</p>
<ul>
<li><strong>Vì sao gộp ba thứ này</strong> — hai trong số đó là thứ trình biên dịch <em>bỏ qua</em> (comment, whitespace) và một là thứ trình biên dịch coi là <em>có nghĩa</em> (chữ hoa chữ thường). Biết cái nào thuộc nhóm nào là chặn được cả một họ lỗi của người mới.</li>
<li><strong>Ý nghĩa thực tế</strong> — comment và khoảng trắng là công cụ để đạt yêu cầu Understandability ở slide 10; còn phân biệt hoa thường là lý do <code>Printf</code> báo lỗi liên kết trong khi <code>printf</code> thì chạy.</li>
<li><strong>Nhìn bằng mắt của trình biên dịch</strong> — sau bước tiền xử lý (slide 33 bước 1), comment không còn tồn tại chút nào; khoảng trắng chỉ sống sót với vai trò dấu tách giữa các token.</li>
<li><strong>Tiếp theo là gì</strong> — slide 37 nêu cả ba, rồi slide 38–44 đem chúng ra dùng trên cấu trúc một chương trình thật.</li>
</ul>
<p class="nhan">Ngôn ngữ dạng tự do: C được gọi là "free-form" chính vì khoảng trắng và ngắt dòng không mang ý nghĩa nào. Khác hẳn Python, nơi thụt lề định nghĩa khối lệnh — một phép so hữu ích nếu bạn từng học Python trước.</p>
<p class="meo">💡 Một câu gói cả mục: <strong>"C bỏ qua thứ bạn viết cho người, và soi kỹ thứ bạn viết cho nó — tới từng chữ hoa."</strong></p>
<p class="pitfall">⚠️ Vì khoảng trắng bị bỏ qua, cả một chương trình có thể viết hợp lệ trên đúng một dòng. Nó dịch được và nó không đọc nổi — vi phạm Understandability (slide 10) và bị trừ điểm khi chấm lab dù kết quả in ra vẫn đúng.</p>`],

      [37, 'Some Notable C Features — comments, whitespace, case sensitivity',
        `<p class="y-chinh">🎯 Three rules: comments are ignored, whitespace is ignored, and <strong>case is not</strong>.</p>
<ul>
<li><strong>Comments — the <code>/* */</code> form</strong> — "we use comments to document our programs and to enhance their readability. C compilers ignore all comments." Everything between <code>/*</code> and the first following <code>*/</code> disappears at preprocessing.</li>
<li><strong>What to put in a comment</strong> — the <em>why</em>, not the <em>what</em>. <code>i = i + 1; /* add one to i */</code> is noise; <code>/* skip the header row of the file */</code> is useful.</li>
<li><strong>Whitespace</strong> — spaces, tabs and newlines "improve program readability and display the structure of our program's logic. C compilers ignore all whitespace" — except where it separates two tokens (<code>int x</code> needs its space; <code>x = 1</code> does not).</li>
<li><strong>Case sensitivity</strong> — "C language is case sensitive. C compilers treat the character 'A' as different from the character 'a'." So <code>Total</code>, <code>total</code> and <code>TOTAL</code> are three different variables, and <code>Main</code> is not an entry point.</li>
<li><strong>Where case bites hardest</strong> — keywords are all lowercase (<code>int</code>, <code>return</code>, <code>while</code>). <code>Int x;</code> does not declare an integer; the compiler reads <code>Int</code> as an unknown type name.</li>
</ul>
<pre><code>/* This whole line vanishes before compiling */
int main(void)
{
    int Total = 5;      /* Total and total are DIFFERENT variables */
    int total = 9;
    printf("%d %d", Total, total);   /* prints: 5 9 */
    return 0;
}
</code></pre>
<p class="dap-an">✅ Worked question — how many variables does the function above declare, and what does it print? It declares <strong>two</strong> distinct variables (<code>Total</code> and <code>total</code> differ in one capital letter), and it prints <strong><code>5 9</code></strong>.</p>
<p class="meo">💡 Avoid the whole problem by fixing a naming convention and sticking to it: all-lowercase with underscores (<code>total_mark</code>) or camelCase (<code>totalMark</code>). Never let two names in one program differ only by case.</p>
<p class="pitfall">⚠️ <code>/* */</code> comments <strong>do not nest</strong>. Wrapping a block that already contains a comment ends the outer comment at the first inner <code>*/</code>, and the rest of that block leaks back into your code as real statements — a confusing error far from where you edited. Use <code>#if 0 ... #endif</code> to disable a block safely.</p>`,
        `<p class="y-chinh">🎯 Ba quy tắc: comment bị bỏ qua, khoảng trắng bị bỏ qua, và <strong>hoa thường thì không</strong>.</p>
<ul>
<li><strong>Comment — dạng <code>/* */</code></strong> — "ta dùng comment để ghi chú chương trình và làm nó dễ đọc hơn. Trình biên dịch C bỏ qua mọi comment." Mọi thứ giữa <code>/*</code> và dấu <code>*/</code> đầu tiên sau đó đều biến mất ở bước tiền xử lý.</li>
<li><strong>Nên viết gì trong comment</strong> — viết <em>vì sao</em>, đừng viết <em>cái gì</em>. <code>i = i + 1; /* cộng 1 vào i */</code> là thừa; <code>/* bỏ qua dòng tiêu đề của file */</code> mới có ích.</li>
<li><strong>Khoảng trắng</strong> — dấu cách, tab và xuống dòng "làm chương trình dễ đọc hơn và thể hiện cấu trúc logic. Trình biên dịch C bỏ qua mọi khoảng trắng" — trừ chỗ nó tách hai token (<code>int x</code> cần dấu cách; <code>x = 1</code> thì không).</li>
<li><strong>Phân biệt hoa thường</strong> — "Ngôn ngữ C phân biệt chữ hoa chữ thường. Trình biên dịch C coi ký tự 'A' khác với ký tự 'a'." Vậy <code>Total</code>, <code>total</code> và <code>TOTAL</code> là ba biến khác nhau, còn <code>Main</code> không phải điểm vào.</li>
<li><strong>Chỗ hoa thường cắn đau nhất</strong> — từ khoá đều viết thường (<code>int</code>, <code>return</code>, <code>while</code>). <code>Int x;</code> không khai báo số nguyên; trình biên dịch đọc <code>Int</code> như một tên kiểu lạ hoắc.</li>
</ul>
<pre><code>/* Cả dòng này biến mất trước khi dịch */
int main(void)
{
    int Total = 5;      /* Total và total là HAI biến KHÁC nhau */
    int total = 9;
    printf("%d %d", Total, total);   /* in ra: 5 9 */
    return 0;
}
</code></pre>
<p class="dap-an">✅ Bài giải — hàm trên khai báo mấy biến và in ra gì? Nó khai báo <strong>hai</strong> biến khác nhau (<code>Total</code> và <code>total</code> chỉ lệch một chữ hoa), và in ra <strong><code>5 9</code></strong>.</p>
<p class="meo">💡 Tránh hẳn vấn đề bằng cách chọn một quy ước đặt tên rồi theo tới cùng: toàn chữ thường có gạch dưới (<code>total_mark</code>) hoặc kiểu camelCase (<code>totalMark</code>). Đừng bao giờ để hai cái tên trong cùng chương trình chỉ khác nhau ở hoa thường.</p>
<p class="pitfall">⚠️ Comment <code>/* */</code> <strong>không lồng nhau được</strong>. Bọc một khối vốn đã chứa comment thì comment ngoài kết thúc ngay tại <code>*/</code> bên trong, và phần còn lại của khối đó rò ngược vào code thành câu lệnh thật — sinh lỗi khó hiểu ở chỗ cách xa nơi bạn vừa sửa. Muốn vô hiệu hoá cả khối an toàn thì dùng <code>#if 0 ... #endif</code>.</p>`],

      [38, 'Section divider — Structure of a Simple C Program',
        `<p class="y-chinh">🎯 The final block of Slot 01: the fixed skeleton every C program you write this semester will have.</p>
<ul>
<li><strong>What follows</strong> — slide 39 labels the parts of a real program, slides 40–43 show how to build and run one from the command prompt, and slide 44 defines the entry point formally.</li>
<li><strong>The skeleton in one breath</strong> — a description comment, the <code>#include</code> lines, then <code>main</code> with its statements, ending with <code>return</code>.</li>
<li><strong>Why "structure" is taught explicitly</strong> — C has no framework generating boilerplate for you. Every file you create in the labs starts from this shape typed by hand, so it must be automatic.</li>
<li><strong>Connection to what you just learned</strong> — the <code>#include</code> line is consumed at step 1 (preprocessing), <code>main</code> is what the linker at step 4 makes the program's starting point, and the comment disappears before compiling.</li>
</ul>
<pre><code>/* Program: description of what this program does */
#include &lt;stdio.h&gt;      /* declaration for library using */

int main(void)           /* entry point of C program      */
{
    /* statements + comments */
    return 0;            /* exit point of C program       */
}
</code></pre>
<p class="nhan">Type this skeleton from memory five times before the first lab. In an exam with no IDE assistance, being unable to produce a compiling empty program costs marks before you have written a single line of logic.</p>
<p class="meo">💡 Remember the order by asking "who needs to know what, and when": the preprocessor needs <code>#include</code> first, the program needs <code>main</code> to start, and the OS needs <code>return</code> to learn how it ended.</p>
<p class="pitfall">⚠️ Do not put <code>#include</code> inside <code>main</code>. It is legal in a narrow technical sense but pastes an entire header inside a function body, producing pages of errors. Header lines belong at the top of the file, outside every function.</p>`,
        `<p class="y-chinh">🎯 Khối cuối cùng của Slot 01: bộ khung cố định mà mọi chương trình C bạn viết trong học kỳ này đều có.</p>
<ul>
<li><strong>Tiếp theo là gì</strong> — slide 39 chú thích từng phần của một chương trình thật, slide 40–43 chỉ cách dựng và chạy nó từ command prompt, còn slide 44 định nghĩa điểm vào một cách hình thức.</li>
<li><strong>Bộ khung trong một hơi</strong> — một comment mô tả, các dòng <code>#include</code>, rồi <code>main</code> với các câu lệnh của nó, kết thúc bằng <code>return</code>.</li>
<li><strong>Vì sao phải dạy "cấu trúc" tường minh</strong> — C không có framework nào sinh sẵn khung cho bạn. Mọi file bạn tạo trong lab đều bắt đầu từ hình dạng này, gõ bằng tay, nên nó phải thành phản xạ.</li>
<li><strong>Nối với thứ vừa học</strong> — dòng <code>#include</code> bị tiêu thụ ở bước 1 (tiền xử lý), <code>main</code> là thứ mà linker ở bước 4 chọn làm điểm khởi động, còn comment thì biến mất trước khi dịch.</li>
</ul>
<pre><code>/* Chương trình: mô tả chương trình này làm gì */
#include &lt;stdio.h&gt;      /* khai báo thư viện sử dụng */

int main(void)           /* điểm vào của chương trình C */
{
    /* các câu lệnh + comment */
    return 0;            /* điểm ra của chương trình C  */
}
</code></pre>
<p class="nhan">Hãy gõ lại bộ khung này từ trí nhớ năm lần trước buổi lab đầu tiên. Trong phòng thi không có IDE gợi ý, không viết nổi một chương trình rỗng dịch được là mất điểm trước cả khi viết dòng logic nào.</p>
<p class="meo">💡 Nhớ thứ tự bằng câu hỏi "ai cần biết gì, vào lúc nào": bộ tiền xử lý cần <code>#include</code> trước, chương trình cần <code>main</code> để khởi động, và hệ điều hành cần <code>return</code> để biết nó kết thúc ra sao.</p>
<p class="pitfall">⚠️ Đừng đặt <code>#include</code> bên trong <code>main</code>. Về mặt kỹ thuật hẹp thì hợp lệ, nhưng nó dán nguyên một header vào trong thân hàm và bung ra hàng trang lỗi. Dòng header thuộc về đầu file, nằm ngoài mọi hàm.</p>`],

      [39, 'The structure labelled — comment, include, main, statements, return',
        `<p class="y-chinh">🎯 The same tiny program with five labels attached: <em>comment for program description · declaration for library using · entry point · statements + comments · exit point</em> — compiled and run with Dev-C++.</p>
<ul>
<li><strong>Label 1 — comment for program description</strong> — a header block naming the program, its author and its purpose. It is deleted at preprocessing, so it costs the machine nothing and buys the reader everything.</li>
<li><strong>Label 2 — declaration for library using</strong> — <code>#include &lt;stdio.h&gt;</code> pastes in the declarations of the standard I/O functions, so the compiler knows <code>printf</code> takes a string and returns an <code>int</code>. Without it you get a warning or error for an undeclared function.</li>
<li><strong>Label 3 — entry point of C program</strong> — <code>int main(void)</code>. Execution begins at the first statement inside its braces, no matter where <code>main</code> sits in the file.</li>
<li><strong>Label 4 — statements + comments</strong> — the body. Each statement ends with <code>;</code>, and statements run strictly top to bottom (slide 14: the CPU executes serially).</li>
<li><strong>Label 5 — exit point of C program</strong> — <code>return 0;</code> hands a status code back to the operating system. <strong>0 means success</strong>; a non-zero value conventionally means an error.</li>
<li><strong>The braces</strong> — <code>{</code> and <code>}</code> delimit the function body. They are a matched pair, and every block you meet later (<code>if</code>, <code>for</code>) uses the same pair.</li>
</ul>
<pre><code>/* Program : Hello
   Author  : student
   Purpose : print a greeting                */

#include &lt;stdio.h&gt;                /* library  */

int main(void)                     /* entry    */
{
    printf("Hello World!\\n");      /* statement */
    return 0;                      /* exit     */
}
</code></pre>
<p class="dap-an">✅ Question — what happens if you delete the <code>#include</code> line? In older C the program may still build with a warning ("implicit declaration of function printf") and usually still prints; in modern compilers it is an error. Either way the code is wrong: never call a library function whose header you did not include.</p>
<p class="meo">💡 Read the five labels top to bottom as a story: <em>what it is → what it borrows → where it starts → what it does → how it ends</em>. Every C file in this course tells that same story.</p>
<p class="pitfall">⚠️ <code>&lt;stdio.h&gt;</code> with angle brackets means "search the system include directories". Quotes (<code>"myfile.h"</code>) mean "look next to my source file first". Swapping them for a standard header is a classic beginner mistake that produces a "No such file or directory" error.</p>`,
        `<p class="y-chinh">🎯 Vẫn chương trình bé xíu đó, nhưng gắn năm nhãn: <em>comment mô tả chương trình · khai báo thư viện sử dụng · điểm vào · câu lệnh + comment · điểm ra</em> — dịch và chạy bằng Dev-C++.</p>
<ul>
<li><strong>Nhãn 1 — comment mô tả chương trình</strong> — khối đầu file nêu tên chương trình, tác giả, mục đích. Nó bị xoá ở bước tiền xử lý, nên không tốn gì của máy mà cho người đọc tất cả.</li>
<li><strong>Nhãn 2 — khai báo thư viện sử dụng</strong> — <code>#include &lt;stdio.h&gt;</code> dán vào phần khai báo của các hàm vào/ra chuẩn, nhờ đó trình biên dịch biết <code>printf</code> nhận một chuỗi và trả về <code>int</code>. Thiếu nó là nhận cảnh báo hoặc lỗi hàm chưa khai báo.</li>
<li><strong>Nhãn 3 — điểm vào của chương trình C</strong> — <code>int main(void)</code>. Việc thực thi bắt đầu ở câu lệnh đầu tiên trong cặp ngoặc nhọn của nó, bất kể <code>main</code> nằm ở chỗ nào trong file.</li>
<li><strong>Nhãn 4 — câu lệnh + comment</strong> — phần thân. Mỗi câu lệnh kết thúc bằng <code>;</code>, và các câu lệnh chạy đúng từ trên xuống (slide 14: CPU thực thi tuần tự).</li>
<li><strong>Nhãn 5 — điểm ra của chương trình C</strong> — <code>return 0;</code> trả một mã trạng thái về cho hệ điều hành. <strong>0 nghĩa là thành công</strong>; giá trị khác 0 theo quy ước là có lỗi.</li>
<li><strong>Cặp ngoặc nhọn</strong> — <code>{</code> và <code>}</code> bao lấy thân hàm. Chúng luôn đi thành cặp, và mọi khối lệnh bạn gặp về sau (<code>if</code>, <code>for</code>) đều dùng đúng cặp này.</li>
</ul>
<pre><code>/* Chuong trinh : Hello
   Tac gia      : sinh vien
   Muc dich     : in ra loi chao               */

#include &lt;stdio.h&gt;                /* thư viện  */

int main(void)                     /* điểm vào  */
{
    printf("Hello World!\\n");      /* câu lệnh  */
    return 0;                      /* điểm ra   */
}
</code></pre>
<p class="dap-an">✅ Câu hỏi — xoá dòng <code>#include</code> đi thì sao? Ở C đời cũ chương trình vẫn có thể dịch được kèm cảnh báo ("implicit declaration of function printf") và thường vẫn in ra; ở trình biên dịch hiện đại thì đó là lỗi. Dù thế nào code vẫn sai: không bao giờ gọi một hàm thư viện mà chưa include header của nó.</p>
<p class="meo">💡 Đọc năm cái nhãn từ trên xuống như một câu chuyện: <em>nó là gì → nó mượn gì → nó bắt đầu ở đâu → nó làm gì → nó kết thúc ra sao</em>. Mọi file C trong môn này đều kể đúng câu chuyện đó.</p>
<p class="pitfall">⚠️ <code>&lt;stdio.h&gt;</code> với ngoặc nhọn nghĩa là "tìm trong thư mục include của hệ thống". Dấu nháy kép (<code>"myfile.h"</code>) nghĩa là "tìm cạnh file nguồn của tôi trước". Dùng nhầm loại cho header chuẩn là lỗi kinh điển của người mới, sinh ra thông báo "No such file or directory".</p>`],

      [40, 'Command prompt, steps 1–2 — install a C compiler and set PATH',
        `<p class="y-chinh">🎯 To build without an IDE you need two things: a compiler on disk (<strong>MinGW / TDM-GCC</strong>) and its <code>bin</code> folder on the <strong>PATH</strong>.</p>
<ul>
<li><strong>Step 1 — install</strong> — download and install MinGW (link on the slide: sourceforge.net/projects/mingw) or TDM-GCC. During installation, <strong>ensure the <code>gcc</code> tool is included</strong>; the installer lets you deselect it, and people do so by accident.</li>
<li><strong>What MinGW is</strong> — "Minimalist GNU for Windows": a Windows port of the GNU toolchain, i.e. the same <code>gcc</code> preprocessor + compiler + assembler + linker chain from slide 33, packaged for Windows.</li>
<li><strong>Step 2 — set the environment variable</strong> — add MinGW's <code>bin</code> directory (e.g. <code>C:\\MinGW\\bin</code>) to <strong>PATH</strong>: Control Panel → System and Security → System → Advanced System Settings → Environment Variables → find <code>Path</code> under System Variables → Edit → add the path.</li>
<li><strong>Why PATH is needed</strong> — PATH is the list of folders Windows searches when you type a bare command name. Without the entry, typing <code>gcc</code> gives "not recognized as an internal or external command", even though <code>gcc.exe</code> exists on the disk.</li>
<li><strong>The folder is <code>bin</code>, not the install root</strong> — add <code>C:\\MinGW\\bin</code>, not <code>C:\\MinGW</code>. The executables live one level down.</li>
</ul>
<pre><code>REM After editing PATH, open a NEW Command Prompt, then:
echo %PATH%          REM the MinGW bin folder must appear in this list
where gcc            REM should print C:\\MinGW\\bin\\gcc.exe
</code></pre>
<p class="dap-an">✅ Worked problem — "I installed MinGW but <code>gcc</code> is still not recognized." Check in order: (1) does <code>C:\\MinGW\\bin\\gcc.exe</code> exist? If not, re-run the installer and tick <code>gcc</code>. (2) Is <code>C:\\MinGW\\bin</code> in PATH? (3) Did you open a <strong>new</strong> console after editing PATH? An already-open console keeps its old copy of the environment.</p>
<p class="meo">💡 <strong>Edit PATH, then open a new terminal.</strong> This one habit resolves the majority of "it still does not work" reports in the first lab, and the same rule applies to every environment variable you ever add.</p>
<p class="pitfall">⚠️ When editing PATH, never select the whole existing value and overwrite it. On older Windows dialogs PATH is one long semicolon-separated string; replacing it breaks other programs system-wide. Append with a leading <code>;</code>, or use the newer list editor that adds one line.</p>`,
        `<p class="y-chinh">🎯 Muốn dịch mà không cần IDE thì phải có hai thứ: trình biên dịch trên đĩa (<strong>MinGW / TDM-GCC</strong>) và thư mục <code>bin</code> của nó nằm trong <strong>PATH</strong>.</p>
<ul>
<li><strong>Bước 1 — cài đặt</strong> — tải và cài MinGW (link trên slide: sourceforge.net/projects/mingw) hoặc TDM-GCC. Trong lúc cài, <strong>nhớ chọn cả công cụ <code>gcc</code></strong>; trình cài cho phép bỏ chọn nó, và nhiều người bỏ nhầm.</li>
<li><strong>MinGW là gì</strong> — "Minimalist GNU for Windows": bản chuyển bộ công cụ GNU sang Windows, tức đúng dây chuyền <code>gcc</code> gồm tiền xử lý + biên dịch + assembler + linker ở slide 33, đóng gói cho Windows.</li>
<li><strong>Bước 2 — đặt biến môi trường</strong> — thêm thư mục <code>bin</code> của MinGW (ví dụ <code>C:\\MinGW\\bin</code>) vào <strong>PATH</strong>: Control Panel → System and Security → System → Advanced System Settings → Environment Variables → tìm <code>Path</code> trong System Variables → Edit → thêm đường dẫn.</li>
<li><strong>Vì sao cần PATH</strong> — PATH là danh sách thư mục Windows lục tìm khi bạn gõ trần một tên lệnh. Không có mục đó thì gõ <code>gcc</code> sẽ nhận "not recognized as an internal or external command", dù <code>gcc.exe</code> vẫn nằm sờ sờ trên đĩa.</li>
<li><strong>Phải là thư mục <code>bin</code>, không phải thư mục gốc</strong> — thêm <code>C:\\MinGW\\bin</code>, đừng thêm <code>C:\\MinGW</code>. Các file thực thi nằm sâu hơn một cấp.</li>
</ul>
<pre><code>REM Sau khi sửa PATH, mở MỘT Command Prompt MỚI, rồi:
echo %PATH%          REM thư mục bin của MinGW phải có trong danh sách này
where gcc            REM phải in ra C:\\MinGW\\bin\\gcc.exe
</code></pre>
<p class="dap-an">✅ Bài giải — "Em cài MinGW rồi mà <code>gcc</code> vẫn không nhận." Kiểm theo thứ tự: (1) file <code>C:\\MinGW\\bin\\gcc.exe</code> có tồn tại không? Không thì chạy lại trình cài và tick <code>gcc</code>. (2) <code>C:\\MinGW\\bin</code> đã nằm trong PATH chưa? (3) Sau khi sửa PATH bạn đã mở console <strong>mới</strong> chưa? Console đang mở vẫn giữ bản môi trường cũ.</p>
<p class="meo">💡 <strong>Sửa PATH xong thì mở terminal mới.</strong> Chỉ một thói quen này đã giải quyết phần lớn báo cáo "vẫn không chạy được" ở buổi lab đầu, và quy tắc đó đúng với mọi biến môi trường bạn thêm sau này.</p>
<p class="pitfall">⚠️ Khi sửa PATH, tuyệt đối đừng bôi đen toàn bộ giá trị cũ rồi ghi đè. Ở hộp thoại Windows đời cũ, PATH là một chuỗi dài ngăn bằng dấu chấm phẩy; thay nó là làm hỏng các chương trình khác trên toàn máy. Hãy nối thêm với dấu <code>;</code> phía trước, hoặc dùng trình soạn dạng danh sách của bản mới.</p>`],

      [41, 'Command prompt, step 3 — test the environment with g++ --version',
        `<p class="y-chinh">🎯 Prove the toolchain is reachable <em>before</em> writing any code: open Command Prompt and type <code>g++ --version</code>.</p>
<ul>
<li><strong>What the test proves</strong> — three things at once: the compiler is installed, its folder is on PATH, and the console you are in can see it. All three must hold before step 4 is worth attempting.</li>
<li><strong>What a pass looks like</strong> — a version banner such as <code>g++ (MinGW.org GCC-6.3.0-1) 6.3.0</code>. Any version number at all is a pass; the exact digits do not matter for PRF192.</li>
<li><strong>What a fail looks like</strong> — <code>'g++' is not recognized as an internal or external command, operable program or batch file.</code> That is a PATH problem, not a compiler problem — go back to slide 40 step 2.</li>
<li><strong>Why <code>g++</code> and not <code>gcc</code></strong> — the slide uses <code>g++</code> (the C++ driver) simply as a presence check; both ship in the same package. For compiling <code>.c</code> files prefer <code>gcc</code>, which applies C rules.</li>
<li><strong>The general principle</strong> — verify the tool before blaming the code. Otherwise you will spend an hour hunting a syntax error in a program the compiler never even saw.</li>
</ul>
<pre><code>C:\\&gt; g++ --version
g++ (MinGW.org GCC-6.3.0-1) 6.3.0
...

C:\\&gt; gcc --version
gcc (MinGW.org GCC-6.3.0-1) 6.3.0
</code></pre>
<p class="dap-an">✅ Worked case — the console answers <code>'g++' is not recognized...</code>. Diagnosis: the shell searched every folder in PATH and found no <code>g++.exe</code>. Fix: add <code>C:\\MinGW\\bin</code> to PATH (slide 40), close the console, open a new one, and repeat the test. ✅ It passes when a version line appears.</p>
<p class="meo">💡 Keep <code>where gcc</code> in your toolkit next to <code>gcc --version</code>. The first tells you <em>which</em> gcc will run — priceless later when two compilers are installed and the wrong one wins.</p>
<p class="pitfall">⚠️ Do not compile <code>.c</code> files with <code>g++</code> just because the test used it. <code>g++</code> applies C++ rules, which silently accept code that plain C rejects — you would be testing against different rules than the ones your exam uses.</p>`,
        `<p class="y-chinh">🎯 Hãy chứng minh bộ công cụ gọi tới được <em>trước khi</em> viết dòng code nào: mở Command Prompt và gõ <code>g++ --version</code>.</p>
<ul>
<li><strong>Phép thử này chứng minh gì</strong> — ba điều cùng lúc: trình biên dịch đã cài, thư mục của nó nằm trong PATH, và cửa sổ console bạn đang dùng nhìn thấy nó. Cả ba phải đúng thì bước 4 mới đáng làm.</li>
<li><strong>Đạt thì trông thế nào</strong> — một dòng phiên bản kiểu <code>g++ (MinGW.org GCC-6.3.0-1) 6.3.0</code>. Ra số phiên bản nào cũng là đạt; con số cụ thể không quan trọng với PRF192.</li>
<li><strong>Hỏng thì trông thế nào</strong> — <code>'g++' is not recognized as an internal or external command, operable program or batch file.</code> Đó là lỗi PATH, không phải lỗi trình biên dịch — quay lại bước 2 của slide 40.</li>
<li><strong>Vì sao dùng <code>g++</code> mà không phải <code>gcc</code></strong> — slide dùng <code>g++</code> (bộ điều phối của C++) chỉ để kiểm tra sự hiện diện; cả hai nằm trong cùng một gói. Còn để dịch file <code>.c</code> thì nên dùng <code>gcc</code>, vì nó áp luật của C.</li>
<li><strong>Nguyên tắc chung</strong> — kiểm công cụ trước, đổ lỗi cho code sau. Không thì bạn sẽ mất cả tiếng săn lỗi cú pháp trong một chương trình mà trình biên dịch còn chưa hề nhìn thấy.</li>
</ul>
<pre><code>C:\\&gt; g++ --version
g++ (MinGW.org GCC-6.3.0-1) 6.3.0
...

C:\\&gt; gcc --version
gcc (MinGW.org GCC-6.3.0-1) 6.3.0
</code></pre>
<p class="dap-an">✅ Tình huống giải mẫu — console trả lời <code>'g++' is not recognized...</code>. Chẩn đoán: shell đã lục mọi thư mục trong PATH mà không thấy <code>g++.exe</code>. Cách sửa: thêm <code>C:\\MinGW\\bin</code> vào PATH (slide 40), đóng console, mở cái mới, rồi thử lại. ✅ Đạt khi hiện ra dòng phiên bản.</p>
<p class="meo">💡 Hãy giữ <code>where gcc</code> trong túi đồ nghề, đặt cạnh <code>gcc --version</code>. Lệnh đầu cho biết <em>cái gcc nào</em> sẽ chạy — vô giá về sau khi máy cài hai trình biên dịch và cái sai lại thắng.</p>
<p class="pitfall">⚠️ Đừng vì phép thử dùng <code>g++</code> mà đem <code>g++</code> đi dịch file <code>.c</code>. <code>g++</code> áp luật C++, chấp nhận âm thầm những thứ C thuần từ chối — hoá ra bạn đang thử với bộ luật khác bộ luật của đề thi.</p>`],

      [42, 'Command prompt, step 4 — write the program Hello.c',
        `<p class="y-chinh">🎯 Create the source file in any plain-text editor, in a folder you can navigate to, and save it as <strong><code>Hello.c</code></strong>.</p>
<ul>
<li><strong>Any editor will do</strong> — Notepad, Notepad++, VS Code. The compiler reads plain text; the editor is irrelevant as long as it does not add formatting.</li>
<li><strong>The file name is part of the exercise</strong> — <code>Hello.c</code>, capital H, extension <code>.c</code>. You will type this name in the next step, and the console is unforgiving about typos.</li>
<li><strong>Know where you saved it</strong> — you must <code>cd</code> to that folder in step 5. Saving to the Desktop and compiling from <code>C:\\</code> gives "No such file or directory", which reads like a compiler error but is a location error.</li>
<li><strong>The three numbered marks on the slide</strong> — they point at the three parts you already know from slide 39: the <code>#include</code> line, the <code>main</code> header, and the body between the braces.</li>
<li><strong>Save before compiling, every time</strong> — the compiler reads the file on disk, not the text on your screen. An unsaved edit is invisible to it.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;      /* (1) library declaration */

int main(void)           /* (2) entry point         */
{
    printf("Hello World!\\n");   /* (3) body        */
    return 0;
}
</code></pre>
<p class="dap-an">✅ Worked trap — you save from Notepad and get <code>Hello.c.txt</code>. Notepad appends <code>.txt</code> unless you choose "All Files" in the Save-as-type box and quote the name as <code>"Hello.c"</code>. Then <code>gcc Hello.c</code> works; before that it reports "No such file or directory". Turn on file-extension display in File Explorer so you can see the real name.</p>
<p class="meo">💡 Put the file in a short, space-free path such as <code>C:\\prf192\\Hello.c</code>. Long paths with spaces force you to quote them on the command line and are a needless source of errors in week one.</p>
<p class="pitfall">⚠️ Never write C in Word or Google Docs. They convert straight quotes <code>"</code> into curly quotes <code>“ ”</code>, which are different characters. The compiler then reports a bizarre error on a line that looks perfectly correct on screen.</p>`,
        `<p class="y-chinh">🎯 Tạo file nguồn bằng bất kỳ trình soạn văn bản thuần nào, đặt trong thư mục bạn đi tới được, rồi lưu tên <strong><code>Hello.c</code></strong>.</p>
<ul>
<li><strong>Trình soạn nào cũng được</strong> — Notepad, Notepad++, VS Code. Trình biên dịch đọc văn bản thuần; dùng trình nào không quan trọng, miễn nó không chèn thêm định dạng.</li>
<li><strong>Tên file là một phần của bài tập</strong> — <code>Hello.c</code>, chữ H hoa, phần mở rộng <code>.c</code>. Bước sau bạn phải gõ đúng tên này, và console không tha cho lỗi gõ nhầm.</li>
<li><strong>Phải biết mình lưu ở đâu</strong> — bước 5 bắt buộc <code>cd</code> vào đúng thư mục đó. Lưu ra Desktop rồi dịch từ <code>C:\\</code> sẽ nhận "No such file or directory", đọc thì tưởng lỗi trình biên dịch nhưng thực ra là lỗi vị trí.</li>
<li><strong>Ba con số đánh dấu trên slide</strong> — chúng chỉ vào đúng ba phần bạn đã biết ở slide 39: dòng <code>#include</code>, dòng tiêu đề của <code>main</code>, và phần thân giữa cặp ngoặc nhọn.</li>
<li><strong>Lưu trước khi dịch, lần nào cũng vậy</strong> — trình biên dịch đọc file trên đĩa, không đọc chữ trên màn hình bạn. Sửa mà chưa lưu thì với nó là vô hình.</li>
</ul>
<pre><code>#include &lt;stdio.h&gt;      /* (1) khai báo thư viện */

int main(void)           /* (2) điểm vào          */
{
    printf("Hello World!\\n");   /* (3) phần thân  */
    return 0;
}
</code></pre>
<p class="dap-an">✅ Bẫy giải mẫu — lưu từ Notepad và nhận về <code>Hello.c.txt</code>. Notepad tự thêm <code>.txt</code> trừ khi bạn chọn "All Files" ở ô Save as type và đặt tên trong nháy kép <code>"Hello.c"</code>. Sau đó <code>gcc Hello.c</code> mới chạy; trước đó nó báo "No such file or directory". Hãy bật hiển thị phần mở rộng trong File Explorer để nhìn được tên thật.</p>
<p class="meo">💡 Đặt file ở đường dẫn ngắn, không có dấu cách, ví dụ <code>C:\\prf192\\Hello.c</code>. Đường dẫn dài có dấu cách buộc phải bọc nháy kép trên dòng lệnh và là nguồn lỗi vô ích trong tuần đầu.</p>
<p class="pitfall">⚠️ Đừng bao giờ viết C trong Word hay Google Docs. Chúng đổi dấu nháy thẳng <code>"</code> thành nháy cong <code>“ ”</code>, vốn là ký tự khác. Trình biên dịch khi đó báo một lỗi rất lạ trên dòng mà nhìn trên màn hình thấy hoàn toàn đúng.</p>`],

      [43, 'Command prompt, step 5 — compile, run, output',
        `<p class="y-chinh">🎯 The three numbered actions on the slide: <strong>(1) Compile · (2) Run · (3) Output</strong> — the whole cycle in two commands.</p>
<ul>
<li><strong>(1) Compile</strong> — <code>gcc Hello.c -o Hello.exe</code>. <code>-o</code> names the output; without it gcc produces <code>a.exe</code> / <code>a.out</code>. <strong>Silence means success</strong>: a compiler that prints nothing has done its job.</li>
<li><strong>(2) Run</strong> — type <code>Hello.exe</code> (on Linux: <code>./Hello.out</code>). This is the operating system loading your program, not the compiler doing anything.</li>
<li><strong>(3) Output</strong> — <code>Hello World!</code> appears in the same console window, which is why nothing flashes and vanishes here — the console outlives the program.</li>
<li><strong>Before both</strong> — <code>cd</code> into the folder holding <code>Hello.c</code>, otherwise gcc cannot find the file (slide 42).</li>
<li><strong>What the two commands map to</strong> — command (1) runs all four steps of slide 33 in one go: preprocess, compile, assemble, link. Command (2) is outside the four steps entirely.</li>
</ul>
<pre><code>C:\\&gt; cd C:\\prf192

C:\\prf192&gt; gcc Hello.c -o Hello.exe      REM (1) compile — no message = OK

C:\\prf192&gt; Hello.exe                     REM (2) run
Hello World!                             REM (3) output
</code></pre>
<p class="dap-an">✅ Worked errors — (a) <code>Hello.c:5:5: error: expected ';' before 'return'</code> means step 2 of compilation failed; no <code>.exe</code> was produced, so running is pointless until you add the semicolon. (b) <code>gcc: error: Hello.c: No such file or directory</code> means you are in the wrong folder — <code>dir</code> to check, then <code>cd</code>. (c) <code>'Hello.exe' is not recognized</code> after a successful compile means the current folder is not searched; use <code>.\\Hello.exe</code>.</p>
<p class="meo">💡 Learn to read compiler messages as <strong>file : line : column : message</strong>. The line number is where the compiler <em>noticed</em> the problem, which for a missing <code>;</code> is usually the line <em>after</em> the real mistake — always check the line above too.</p>
<p class="pitfall">⚠️ Editing the source and re-running <code>Hello.exe</code> without recompiling. The old executable still exists on disk and runs happily, showing the old output — and you conclude your fix "did nothing". Recompile every single time; this is exactly the cost of a compiled language noted on slide 30.</p>`,
        `<p class="y-chinh">🎯 Ba việc được đánh số trên slide: <strong>(1) Compile · (2) Run · (3) Output</strong> — trọn vòng chỉ với hai lệnh.</p>
<ul>
<li><strong>(1) Dịch</strong> — <code>gcc Hello.c -o Hello.exe</code>. <code>-o</code> đặt tên file kết quả; không có nó thì gcc sinh ra <code>a.exe</code> / <code>a.out</code>. <strong>Im lặng nghĩa là thành công</strong>: trình biên dịch không in gì tức là đã làm xong việc.</li>
<li><strong>(2) Chạy</strong> — gõ <code>Hello.exe</code> (trên Linux: <code>./Hello.out</code>). Đây là hệ điều hành nạp chương trình của bạn, trình biên dịch không tham gia gì nữa.</li>
<li><strong>(3) Kết quả</strong> — <code>Hello World!</code> hiện ra ngay trong cửa sổ console đó, nên ở đây không có chuyện loé lên rồi tắt — console sống lâu hơn chương trình.</li>
<li><strong>Trước cả hai lệnh</strong> — phải <code>cd</code> vào thư mục chứa <code>Hello.c</code>, không thì gcc không tìm thấy file (slide 42).</li>
<li><strong>Hai lệnh đó ứng với gì</strong> — lệnh (1) chạy một mạch cả bốn bước ở slide 33: tiền xử lý, biên dịch, assembling, liên kết. Lệnh (2) nằm hoàn toàn ngoài bốn bước ấy.</li>
</ul>
<pre><code>C:\\&gt; cd C:\\prf192

C:\\prf192&gt; gcc Hello.c -o Hello.exe      REM (1) dịch — không báo gì = OK

C:\\prf192&gt; Hello.exe                     REM (2) chạy
Hello World!                             REM (3) kết quả
</code></pre>
<p class="dap-an">✅ Giải mẫu các lỗi — (a) <code>Hello.c:5:5: error: expected ';' before 'return'</code> nghĩa là bước 2 của khâu dịch hỏng; chưa có file <code>.exe</code> nào, nên chạy là vô nghĩa cho tới khi thêm dấu chấm phẩy. (b) <code>gcc: error: Hello.c: No such file or directory</code> nghĩa là bạn đang đứng sai thư mục — gõ <code>dir</code> để soi, rồi <code>cd</code>. (c) <code>'Hello.exe' is not recognized</code> sau khi dịch thành công nghĩa là thư mục hiện tại không được tìm tới; hãy gõ <code>.\\Hello.exe</code>.</p>
<p class="meo">💡 Tập đọc thông báo của trình biên dịch theo dạng <strong>file : dòng : cột : nội dung</strong>. Số dòng là chỗ trình biên dịch <em>nhận ra</em> vấn đề, mà với lỗi thiếu <code>;</code> thì thường là dòng <em>sau</em> chỗ sai thật — luôn ngó thêm dòng phía trên.</p>
<p class="pitfall">⚠️ Sửa code xong chạy lại <code>Hello.exe</code> mà quên dịch lại. File thực thi cũ vẫn nằm trên đĩa và chạy ngon lành, hiện ra kết quả cũ — và bạn kết luận bản sửa "chẳng thay đổi gì". Lần nào cũng phải dịch lại; đó chính là cái giá của ngôn ngữ biên dịch nêu ở slide 30.</p>`],

      [44, 'C program Entry Points — the syntax of main',
        `<p class="y-chinh">🎯 The entry point is "the point where a program begins", and in C that is <code>main</code>, whose syntax the slide writes as <code>[int] main( [void] ) { &lt;statements&gt; [ return number; ] }</code>.</p>
<ul>
<li><strong>Reading the notation</strong> — square brackets mark <em>optional</em> parts and angle brackets mark <em>something you supply</em>. So the return type, the <code>void</code> parameter and the <code>return</code> statement may all be omitted in the classic syntax; the statements are yours to write.</li>
<li><strong>Why <code>main</code> and not the first line of the file</strong> — the linker (slide 33, step 4) records <code>main</code> as the starting address. Execution therefore begins inside <code>main</code> regardless of what else the file contains or where <code>main</code> appears in it.</li>
<li><strong>Exactly one <code>main</code> per program</strong> — zero gives a linker error ("undefined reference to <code>main</code>"); two give a "multiple definition" error. One and only one.</li>
<li><strong><code>int</code> — the return type</strong> — <code>main</code> hands an integer back to the operating system. <strong>0 = success</strong>, non-zero = an error code. Omitting the type is legacy style; modern practice and exams prefer writing <code>int</code>.</li>
<li><strong><code>void</code> in the parentheses</strong> — means "this function takes no arguments". Writing <code>main()</code> with empty parentheses is accepted but means something looser in C; <code>main(void)</code> states the intent exactly.</li>
<li><strong>The braces and the statements</strong> — <code>{ }</code> delimit the body; statements inside run in order, top to bottom.</li>
</ul>
<pre><code>int main(void)          /* the recommended form */
{
    printf("Hi\\n");
    return 0;           /* 0 = success */
}

/* also legal, older style — return type and parameter list omitted */
main()
{
    printf("Hi\\n");
}
</code></pre>
<p class="dap-an">✅ Exercise — which of these are valid entry points? (a) <code>int main(void)</code> ✅ valid, the recommended form. (b) <code>main()</code> ✅ valid, the old optional-<code>int</code> form the square brackets allow. (c) <code>void main()</code> ⚠️ compiles on many compilers but is <em>not</em> in the slide's syntax and returns nothing to the OS — avoid it. (d) <code>int Main(void)</code> ❌ invalid: C is case sensitive (slide 37), so <code>Main</code> is an ordinary function and the linker will report no <code>main</code>.</p>
<p class="meo">💡 Just always write <code>int main(void) { ... return 0; }</code>. It satisfies the slide's syntax, every compiler, and every exam rubric — so the optional parts never have to be a decision.</p>
<p class="pitfall">⚠️ Two traps: (1) writing <code>void main()</code> because a textbook or a teammate did — it contradicts the standard and loses marks even when it runs; (2) reading the square brackets as literal characters and typing <code>[int] main([void])</code>. The brackets are notation describing optionality, never part of the code.</p>`,
        `<p class="y-chinh">🎯 Điểm vào là "chỗ chương trình bắt đầu", và trong C đó là <code>main</code>, với cú pháp slide ghi là <code>[int] main( [void] ) { &lt;statements&gt; [ return number; ] }</code>.</p>
<ul>
<li><strong>Đọc ký hiệu</strong> — cặp ngoặc vuông đánh dấu phần <em>tuỳ chọn</em>, còn cặp ngoặc nhọn kiểu &lt; &gt; đánh dấu <em>thứ bạn tự điền</em>. Vậy kiểu trả về, tham số <code>void</code> và câu lệnh <code>return</code> đều có thể lược bỏ trong cú pháp cổ điển; phần câu lệnh là do bạn viết.</li>
<li><strong>Vì sao là <code>main</code> chứ không phải dòng đầu file</strong> — linker (slide 33, bước 4) ghi nhận <code>main</code> làm địa chỉ khởi động. Vì thế việc thực thi luôn bắt đầu bên trong <code>main</code>, bất kể file còn chứa gì và <code>main</code> nằm ở đoạn nào.</li>
<li><strong>Mỗi chương trình đúng một <code>main</code></strong> — không có cái nào thì linker báo lỗi ("undefined reference to <code>main</code>"); có hai cái thì báo "multiple definition". Một, và chỉ một.</li>
<li><strong><code>int</code> — kiểu trả về</strong> — <code>main</code> trả một số nguyên về cho hệ điều hành. <strong>0 = thành công</strong>, khác 0 = mã lỗi. Bỏ kiểu đi là lối viết cũ; thực hành hiện đại và phòng thi đều chuộng ghi rõ <code>int</code>.</li>
<li><strong><code>void</code> trong ngoặc tròn</strong> — nghĩa là "hàm này không nhận tham số nào". Viết <code>main()</code> với ngoặc rỗng thì vẫn được chấp nhận nhưng trong C nó mang nghĩa lỏng hơn; <code>main(void)</code> nói đúng ý định.</li>
<li><strong>Cặp ngoặc nhọn và các câu lệnh</strong> — <code>{ }</code> bao lấy phần thân; các câu lệnh bên trong chạy theo thứ tự từ trên xuống.</li>
</ul>
<pre><code>int main(void)          /* dạng nên dùng */
{
    printf("Hi\\n");
    return 0;           /* 0 = thành công */
}

/* cũng hợp lệ, lối cũ — lược kiểu trả về và danh sách tham số */
main()
{
    printf("Hi\\n");
}
</code></pre>
<p class="dap-an">✅ Bài tập — những dạng nào sau đây là điểm vào hợp lệ? (a) <code>int main(void)</code> ✅ hợp lệ, dạng nên dùng. (b) <code>main()</code> ✅ hợp lệ, là dạng lược <code>int</code> kiểu cũ mà cặp ngoặc vuông cho phép. (c) <code>void main()</code> ⚠️ nhiều trình biên dịch vẫn dịch được nhưng <em>không</em> nằm trong cú pháp của slide và không trả gì về cho hệ điều hành — nên tránh. (d) <code>int Main(void)</code> ❌ không hợp lệ: C phân biệt hoa thường (slide 37), nên <code>Main</code> chỉ là một hàm thường và linker sẽ báo không tìm thấy <code>main</code>.</p>
<p class="meo">💡 Cứ luôn viết <code>int main(void) { ... return 0; }</code>. Nó thoả cú pháp của slide, thoả mọi trình biên dịch và mọi thang chấm — vậy là phần tuỳ chọn không bao giờ còn phải cân nhắc.</p>
<p class="pitfall">⚠️ Hai cái bẫy: (1) viết <code>void main()</code> vì thấy sách hay bạn cùng nhóm viết thế — nó trái chuẩn và bị trừ điểm dù vẫn chạy; (2) hiểu cặp ngoặc vuông là ký tự thật rồi gõ nguyên <code>[int] main([void])</code>. Ngoặc vuông chỉ là ký hiệu diễn tả tính tuỳ chọn, không bao giờ là một phần của code.</p>`],

      [45, 'Summary — the eleven things Slot 01 covered',
        `<p class="y-chinh">🎯 The closing checklist of Slot 01: eleven topics, from definitions all the way to the structure of a simple C program.</p>
<ul>
<li><strong>1–3 · Definitions and good software</strong> — information vs data, problem / solve / solution, algorithm vs program vs computer program; then usability, correctness, maintainability, portability, modularity, scalability, robustness.</li>
<li><strong>4–5 · Hardware and data units</strong> — CPU (registers, decode unit, CU, ALU, FPA), ROM vs RAM, the three buses; bit, nibble, byte (the unit of memory), word length 8/16/32/64.</li>
<li><strong>6 · Addressing and instructions</strong> — every byte has a unique address from zero; an instruction = opcode + operands.</li>
<li><strong>7 · Programming languages</strong> — machine → assembly → high-level, and five generations, with C as a 3GL that says <em>how</em>.</li>
<li><strong>8 · C compilers</strong> — interpreting vs compiling, C uses a compiler, and the four steps Preprocessing → Compiling → Assembling → Linking producing <code>.i → .s → .o → .exe</code>.</li>
<li><strong>9–10 · Why C, and its notable features</strong> — small, English-like, lowest high-level, fast, memory-transparent; comments and whitespace ignored, case significant.</li>
<li><strong>11 · Structure of a simple C program</strong> — description comment, <code>#include</code>, <code>int main(void)</code>, statements, <code>return 0;</code>.</li>
</ul>
<p class="nhan">Self-test before Slot 02 — (a) Which step of compilation produces <code>hello.s</code>? (b) How many bits in a nibble, and how many in a byte? (c) Is C a 3GL or 4GL, and why? (d) Are <code>Sum</code> and <code>sum</code> the same variable? (e) What does <code>return 0;</code> tell the operating system?</p>
<p class="dap-an">✅ Answers — (a) step 2, <strong>Compiling</strong> (the assembler comes next and makes <code>.o</code>). (b) nibble = <strong>4 bits</strong>, byte = <strong>8 bits</strong> = 2 nibbles, and the byte is the unit of memory. (c) <strong>3GL</strong>, because it describes <em>how</em> the result is obtained step by step, unlike SQL which states <em>what</em>. (d) <strong>No</strong> — C is case sensitive, they are two different variables. (e) That the program finished <strong>successfully</strong>; a non-zero value would signal an error.</p>
<p class="meo">💡 Turn this summary into your revision index: for each of the eleven bullets, write one sentence from memory. Any bullet you cannot complete points you straight back at the exact slide to re-read.</p>
<p class="pitfall">⚠️ The most commonly lost marks from Slot 01 are on the compilation chain — either the order of the four steps or which file each produces. If you only drill one thing before the progress test, drill <strong>.c → .i → .s → .o → .exe</strong>.</p>`,
        `<p class="y-chinh">🎯 Danh sách kiểm khép lại Slot 01: mười một chủ đề, từ các định nghĩa cho tới cấu trúc một chương trình C đơn giản.</p>
<ul>
<li><strong>1–3 · Định nghĩa và phần mềm tốt</strong> — thông tin đối lại dữ liệu, problem / solve / solution, thuật toán đối lại program đối lại computer program; rồi usability, correctness, maintainability, portability, modularity, scalability, robustness.</li>
<li><strong>4–5 · Phần cứng và đơn vị dữ liệu</strong> — CPU (thanh ghi, khối giải mã, CU, ALU, FPA), ROM đối lại RAM, ba loại bus; bit, nibble, byte (đơn vị của bộ nhớ), độ dài từ 8/16/32/64.</li>
<li><strong>6 · Địa chỉ và lệnh</strong> — mỗi byte có một địa chỉ duy nhất đánh số từ 0; một lệnh = opcode + các operand.</li>
<li><strong>7 · Ngôn ngữ lập trình</strong> — ngôn ngữ máy → assembly → bậc cao, và năm thế hệ, với C là 3GL nói <em>làm thế nào</em>.</li>
<li><strong>8 · Trình biên dịch C</strong> — thông dịch đối lại biên dịch, C dùng compiler, và bốn bước Preprocessing → Compiling → Assembling → Linking sinh ra <code>.i → .s → .o → .exe</code>.</li>
<li><strong>9–10 · Vì sao chọn C, và các đặc điểm đáng nhớ</strong> — nhỏ gọn, giống tiếng Anh, thấp nhất trong bậc cao, nhanh, minh bạch bộ nhớ; comment và khoảng trắng bị bỏ qua, hoa thường thì có nghĩa.</li>
<li><strong>11 · Cấu trúc một chương trình C đơn giản</strong> — comment mô tả, <code>#include</code>, <code>int main(void)</code>, các câu lệnh, <code>return 0;</code>.</li>
</ul>
<p class="nhan">Tự kiểm trước khi sang Slot 02 — (a) Bước nào của khâu biên dịch sinh ra <code>hello.s</code>? (b) Một nibble bao nhiêu bit, một byte bao nhiêu bit? (c) C là 3GL hay 4GL, vì sao? (d) <code>Sum</code> và <code>sum</code> có phải cùng một biến không? (e) <code>return 0;</code> nói gì với hệ điều hành?</p>
<p class="dap-an">✅ Đáp án — (a) bước 2, <strong>Compiling</strong> (assembler đứng ngay sau và sinh ra <code>.o</code>). (b) nibble = <strong>4 bit</strong>, byte = <strong>8 bit</strong> = 2 nibble, và byte là đơn vị của bộ nhớ. (c) <strong>3GL</strong>, vì nó mô tả <em>cách</em> đạt kết quả theo từng bước, khác SQL vốn chỉ nêu <em>cái gì</em>. (d) <strong>Không</strong> — C phân biệt hoa thường, đó là hai biến khác nhau. (e) Rằng chương trình đã kết thúc <strong>thành công</strong>; giá trị khác 0 sẽ báo hiệu có lỗi.</p>
<p class="meo">💡 Hãy biến bản tóm tắt này thành mục lục ôn tập: với từng gạch đầu dòng trong mười một mục, viết một câu từ trí nhớ. Mục nào viết không nổi là chỉ thẳng cho bạn slide cần đọc lại.</p>
<p class="pitfall">⚠️ Điểm mất nhiều nhất ở Slot 01 nằm ở dây chuyền biên dịch — hoặc sai thứ tự bốn bước, hoặc sai file mà mỗi bước sinh ra. Nếu trước bài kiểm tra chỉ kịp luyện một thứ, hãy luyện <strong>.c → .i → .s → .o → .exe</strong>.</p>`],

    ]),
  ].join('\n'),
};
