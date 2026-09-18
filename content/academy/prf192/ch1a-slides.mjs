/**
 * PRF192 · Slot 01 (deck 'prf1', 45 slide) — phần slide 1→23, học theo từng slide.
 * Nội dung bám ĐÚNG chữ trích từ file .pptx gốc của trường (/tmp/prf192-text/prf1.txt).
 * Mọi con số trong phần giảng đã kiểm tay:
 *   1 byte = 8 bit = 2 nibble · 2^8 = 256 giá trị (0..255) · 00111000b = 56 (KHÔNG phải 104;
 *   104 = 01101000b — slide gốc ghi nhầm, đã nêu ở phần "bẫy" của slide 18)
 *   2^10 = 1.024 · 2^16 = 65.536 = 64 KB · 2^32 = 4.294.967.296 = 4 GB · 2^64 = 16 EB
 *   Mọi đoạn code C trong bài đều là C hợp lệ (C89/C99), biên dịch được bằng gcc.
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'prf1';

export default {
  title: '1.0a — Slide by slide: What programming is · how a computer runs it (slides 1–23)|||1.0a — Slide bài giảng: Lập trình là gì · máy tính chạy chương trình ra sao (slide 1–23)',
  slug: 'prf192-1-0a-slides-nhap-mon-lap-trinh',
  type: 'DOCUMENT',
  description: 'Nửa đầu bộ slide Slot 01 của PRF192 (slide 1–23): các định nghĩa nền tảng (thông tin, dữ liệu, bài toán, giải thuật, chương trình), sáu tiêu chí của một phần mềm tốt, tổng quan phần cứng máy tính (bus, CPU, ROM/RAM, thiết bị), đơn vị dữ liệu (bit, nibble, byte, word), cách đánh địa chỉ bộ nhớ và cấu trúc một lệnh máy. Mỗi slide kèm giảng song ngữ, ví dụ giải từng bước và bẫy hay gặp khi thi.',
  content: [
    walkHead(D, 1, 23),
    walk(D, [

      [1, 'Introduction to Programming Fundamentals using C',
        `<p class="y-chinh">🎯 Slot 01 of PRF192: the vocabulary and the machine model you need <em>before</em> writing a single line of C.</p>
<ul>
<li><strong>What this course is</strong> — PRF192 (Programming Fundamentals using C) teaches problem solving first and C syntax second. C is the vehicle, not the destination.</li>
<li><strong>Why an "introduction" slot at all</strong> — every later topic (variables, loops, pointers, files) is really a statement about <em>memory</em> and <em>instructions</em>. Slot 01 builds that mental model so later slots have something to attach to.</li>
<li><strong>The chain this deck walks</strong> — a problem in the real world → a solution → an algorithm → a program written in C → machine code → electrical states in memory. Each arrow is one block of slides.</li>
<li><strong>Scope of this lesson</strong> — slides 1–23 of 45: definitions, software quality, hardware, data units, addressing, and the anatomy of one machine instruction. Slides 24–45 (compilers, languages, the structure of a C program) are the second half.</li>
<li><strong>How to study a deck like this</strong> — do not memorise the bullets. For each slide ask "what would break if this were not true?" That question is what the exam actually tests.</li>
</ul>
<p class="meo">💡 Keep one sentence in your pocket for the whole course: <em>a computer only ever moves bytes between numbered boxes and does arithmetic on them</em>. Everything else — strings, arrays, files, pointers — is a convention layered on top of that.</p>`,
        `<p class="y-chinh">🎯 Slot 01 của PRF192: bộ từ vựng và mô hình máy tính bạn cần có <em>trước khi</em> viết dòng C đầu tiên.</p>
<ul>
<li><strong>Môn này là gì</strong> — PRF192 (Programming Fundamentals using C) dạy cách giải quyết vấn đề trước, cú pháp C sau. C chỉ là phương tiện, không phải đích đến.</li>
<li><strong>Vì sao phải có một slot "nhập môn"</strong> — mọi chủ đề về sau (biến, vòng lặp, con trỏ, tệp tin) thực chất đều là phát biểu về <em>bộ nhớ</em> và <em>lệnh</em>. Slot 01 dựng sẵn mô hình đó để các slot sau có chỗ mà bám vào.</li>
<li><strong>Chuỗi mắt xích mà bộ slide này đi qua</strong> — một vấn đề ngoài đời → một giải pháp → một giải thuật → một chương trình viết bằng C → mã máy → trạng thái điện trong bộ nhớ. Mỗi mũi tên là một khối slide.</li>
<li><strong>Phạm vi bài học này</strong> — slide 1–23 trên tổng 45: các định nghĩa, chất lượng phần mềm, phần cứng, đơn vị dữ liệu, cách đánh địa chỉ, và giải phẫu một lệnh máy. Slide 24–45 (trình biên dịch, ngôn ngữ lập trình, cấu trúc chương trình C) thuộc nửa sau.</li>
<li><strong>Cách học một bộ slide như thế này</strong> — đừng học thuộc gạch đầu dòng. Với mỗi slide hãy tự hỏi "nếu điều này không đúng thì cái gì sẽ hỏng?". Chính câu hỏi đó mới là thứ đề thi kiểm tra.</li>
</ul>
<p class="meo">💡 Hãy giắt lưng một câu cho cả môn: <em>máy tính chỉ làm đúng hai việc — chuyển byte giữa các ô có đánh số, và làm toán trên chúng</em>. Mọi thứ khác — chuỗi, mảng, tệp, con trỏ — đều là quy ước dựng thêm bên trên.</p>`],

      [2, 'Objectives',
        `<p class="y-chinh">🎯 Six learning outcomes: define the concepts, judge software quality, know the development steps, justify C, follow translation-and-execution, and read a C program structure.</p>
<ul>
<li><strong>"Define some concepts related to programming"</strong> — information, data, problem, solution, algorithm, program, computer program, software. These are slides 5–8, and they are the ones most often asked as short-answer questions.</li>
<li><strong>"Explain how to make a good software"</strong> — the quality attributes on slides 10–11: usability, correctness, maintainability, portability, modularity, scalability, robustness.</li>
<li><strong>"Understand steps to develop a software"</strong> — analyse the problem → design the algorithm → code it → compile → test → maintain. Coding is only one of six steps, and not the longest one.</li>
<li><strong>"Answer why C is the first language selected"</strong> — slide 35 gives the list; the honest summary is that C is small, close to the hardware, and every mainstream language after it borrowed its syntax.</li>
<li><strong>"Understand how a C program can be translated and executed"</strong> — the four compilation steps (preprocess, compile, assemble, link) on slides 31–33.</li>
<li><strong>"Understand a C program structure"</strong> — the skeleton with #include, main, statements, return, on slides 39 and 44.</li>
</ul>
<p class="meo">💡 Objectives slides are the exam blueprint in disguise. Rewrite each bullet as a question ("Why is C the first language?") and you have your own revision sheet for free.</p>
<p class="pitfall">⚠️ Note the verbs: <em>define</em>, <em>explain</em>, <em>understand</em>. None of them is "memorise". An answer that repeats the slide word for word without an example usually scores half marks.</p>`,
        `<p class="y-chinh">🎯 Sáu mục tiêu đầu ra: định nghĩa các khái niệm, đánh giá chất lượng phần mềm, nắm các bước phát triển, lý giải vì sao chọn C, hiểu quá trình dịch và thực thi, và đọc được cấu trúc một chương trình C.</p>
<ul>
<li><strong>"Định nghĩa các khái niệm liên quan đến lập trình"</strong> — thông tin, dữ liệu, bài toán, giải pháp, giải thuật, chương trình, chương trình máy tính, phần mềm. Đây là slide 5–8, và cũng là phần hay bị hỏi ở dạng câu trả lời ngắn nhất.</li>
<li><strong>"Giải thích cách làm ra một phần mềm tốt"</strong> — các thuộc tính chất lượng ở slide 10–11: dễ dùng, đúng đắn, dễ bảo trì, khả chuyển, chia module, khả năng mở rộng, bền vững.</li>
<li><strong>"Hiểu các bước phát triển phần mềm"</strong> — phân tích bài toán → thiết kế giải thuật → viết mã → biên dịch → kiểm thử → bảo trì. Viết mã chỉ là một trong sáu bước, và không phải bước dài nhất.</li>
<li><strong>"Trả lời vì sao C được chọn làm ngôn ngữ đầu tiên"</strong> — slide 35 liệt kê đầy đủ; nói gọn cho thật thì vì C nhỏ, sát phần cứng, và mọi ngôn ngữ phổ biến sau nó đều mượn lại cú pháp của nó.</li>
<li><strong>"Hiểu một chương trình C được dịch và chạy ra sao"</strong> — bốn bước biên dịch (tiền xử lý, biên dịch, hợp dịch, liên kết) ở slide 31–33.</li>
<li><strong>"Hiểu cấu trúc một chương trình C"</strong> — bộ khung gồm #include, main, các câu lệnh, return, ở slide 39 và 44.</li>
</ul>
<p class="meo">💡 Slide mục tiêu chính là bản thiết kế đề thi được nguỵ trang. Viết lại mỗi gạch đầu dòng thành một câu hỏi ("Vì sao C là ngôn ngữ đầu tiên?") là bạn đã có sẵn tờ đề cương ôn tập mà không tốn công.</p>
<p class="pitfall">⚠️ Để ý các động từ: <em>định nghĩa</em>, <em>giải thích</em>, <em>hiểu</em>. Không có động từ nào là "học thuộc". Câu trả lời chép lại nguyên văn slide mà không kèm ví dụ thường chỉ được nửa điểm.</p>`],

      [3, 'Contents — the eleven blocks of Slot 01',
        `<p class="y-chinh">🎯 The deck runs eleven blocks, and they are deliberately ordered from "human world" down to "silicon" and back up to "C source code".</p>
<ul>
<li><strong>Blocks 1–2 — Definitions, and how to make good software</strong> (slides 4–11). Pure vocabulary and engineering judgement; no code yet.</li>
<li><strong>Blocks 3–5 — Computer hardware, Data units, Addressing information</strong> (slides 12–21). This is the descent into the machine: buses and CPU, then bits and bytes, then numbered memory cells.</li>
<li><strong>Block 6 — Program instructions</strong> (slides 22–25). The bridge: an instruction is an opcode plus operands, stored in the very memory you just learned to address.</li>
<li><strong>Blocks 7–8 — Programming languages, Compiler</strong> (slides 26–33). The climb back up: machine language → assembly → high level, and the four steps that translate one into the other.</li>
<li><strong>Blocks 9–11 — Why C, notable C features, structure of a simple C program</strong> (slides 34–45). Landing on the actual language.</li>
<li><strong>Where this lesson stops</strong> — this half covers blocks 1 through 6, i.e. slides 1–23. Everything from "Program instructions (cont.)" onward is in the second half.</li>
</ul>
<p class="meo">💡 The shape of the deck is a V: from abstract problem, down to transistors, back up to C. If you ever feel lost in the middle slides, ask "which side of the V am I on?"</p>`,
        `<p class="y-chinh">🎯 Bộ slide chạy qua mười một khối, và thứ tự được sắp có chủ ý: từ "thế giới con người" đi xuống "silic" rồi quay ngược lên "mã nguồn C".</p>
<ul>
<li><strong>Khối 1–2 — Định nghĩa, và làm sao để có phần mềm tốt</strong> (slide 4–11). Thuần từ vựng và tư duy kỹ thuật; chưa có dòng code nào.</li>
<li><strong>Khối 3–5 — Phần cứng máy tính, Đơn vị dữ liệu, Đánh địa chỉ thông tin</strong> (slide 12–21). Đây là đoạn đi xuống sâu vào máy: bus và CPU, rồi bit và byte, rồi các ô nhớ có đánh số.</li>
<li><strong>Khối 6 — Lệnh chương trình</strong> (slide 22–25). Cây cầu nối: một lệnh gồm mã thao tác cộng với các toán hạng, và nó nằm ngay trong vùng nhớ mà bạn vừa học cách đánh địa chỉ.</li>
<li><strong>Khối 7–8 — Ngôn ngữ lập trình, Trình biên dịch</strong> (slide 26–33). Đoạn leo ngược lên: ngôn ngữ máy → hợp ngữ → ngôn ngữ bậc cao, và bốn bước dịch từ cái này sang cái kia.</li>
<li><strong>Khối 9–11 — Vì sao chọn C, vài đặc điểm đáng chú ý của C, cấu trúc một chương trình C đơn giản</strong> (slide 34–45). Hạ cánh xuống chính ngôn ngữ.</li>
<li><strong>Bài học này dừng ở đâu</strong> — nửa này phủ khối 1 đến khối 6, tức slide 1–23. Từ "Program instructions (cont.)" trở đi thuộc nửa sau.</li>
</ul>
<p class="meo">💡 Hình dáng của bộ slide là chữ V: từ bài toán trừu tượng đi xuống transistor, rồi quay ngược lên C. Nếu có lúc thấy lạc ở đoạn giữa, hãy tự hỏi "mình đang ở nhánh nào của chữ V?".</p>`],

      [4, 'Definitions (section divider)',
        `<p class="y-chinh">🎯 A section marker: the next four slides fix the meaning of eight words that the rest of the course will use without re-explaining.</p>
<ul>
<li><strong>Why definitions come first</strong> — in everyday speech "program", "software" and "algorithm" are used interchangeably. In this course they are three different things, and questions are written assuming you know the difference.</li>
<li><strong>Slide 5 — information &amp; data</strong> — information is the meaning; data are the values that carry it.</li>
<li><strong>Slide 6 — problem, solving, solution</strong> — the situation, the process, and the proposed option.</li>
<li><strong>Slide 7 — algorithm, program, computer program</strong> — a procedure, a sequence of steps, and that sequence written in a programming language for a machine to execute.</li>
<li><strong>Slide 8 — computer program (cont.)</strong> — the formula "program = data + instructions", and the definition of software as a set of related programs.</li>
<li><strong>The relationship in one line</strong> — problem ⟶ solution ⟶ algorithm ⟶ computer program ⟶ software. Each arrow makes the previous thing more concrete and more machine-readable.</li>
</ul>
<p class="meo">💡 Section dividers carry no content, but they tell you how the lecturer has chunked the material — and chunking is exactly how the exam paper is chunked too.</p>`,
        `<p class="y-chinh">🎯 Slide phân mục: bốn slide kế tiếp chốt nghĩa của tám từ mà phần còn lại của môn sẽ dùng mà không giải thích lại.</p>
<ul>
<li><strong>Vì sao định nghĩa phải đi trước</strong> — trong lời nói hằng ngày, "chương trình", "phần mềm" và "giải thuật" bị dùng lẫn lộn. Trong môn này chúng là ba thứ khác nhau, và đề thi được soạn với giả định bạn phân biệt được.</li>
<li><strong>Slide 5 — thông tin &amp; dữ liệu</strong> — thông tin là phần ý nghĩa; dữ liệu là các giá trị mang ý nghĩa đó.</li>
<li><strong>Slide 6 — bài toán, giải quyết, giải pháp</strong> — tình huống, quá trình, và phương án được đề xuất.</li>
<li><strong>Slide 7 — giải thuật, chương trình, chương trình máy tính</strong> — một thủ tục, một dãy các bước, và dãy bước đó viết bằng ngôn ngữ lập trình cho máy thực thi.</li>
<li><strong>Slide 8 — chương trình máy tính (tiếp)</strong> — công thức "chương trình = dữ liệu + lệnh", và định nghĩa phần mềm là một tập các chương trình liên quan.</li>
<li><strong>Quan hệ gói trong một dòng</strong> — bài toán ⟶ giải pháp ⟶ giải thuật ⟶ chương trình máy tính ⟶ phần mềm. Mỗi mũi tên làm cho thứ đứng trước cụ thể hơn và máy đọc được nhiều hơn.</li>
</ul>
<p class="meo">💡 Slide phân mục không mang nội dung, nhưng nó cho biết giảng viên chia nhỏ tài liệu thế nào — và đề thi cũng được chia đúng theo cách đó.</p>`],

      [5, 'Information &amp; Data',
        `<p class="y-chinh">🎯 In computer science, <strong>information</strong> is anything that can be stored, processed, analysed and transmitted digitally; <strong>data</strong> are the values used to describe that information.</p>
<ul>
<li><strong>The slide definition, verbatim</strong> — "Information is any data that can be stored, processed, analyzed, and transmitted through digital means (such as files, databases, or the Internet)." So text, images, video, sound all count.</li>
<li><strong>Data is the carrier</strong> — "Data: Values are used to describe information. So, information can be called as the mean of data." Data are raw values; information is what those values mean once you know how to read them.</li>
<li><strong>Worked example</strong> — the byte 0100 0001 is <em>data</em>. Read as an integer it is 65; read as an ASCII character it is the letter A; read as part of a bitmap it may be a shade of grey. Same data, three different pieces of information — the difference is the <em>interpretation</em>, which in C is called the <strong>type</strong>.</li>
<li><strong>Why this matters in C</strong> — this is the whole reason C makes you declare types. The compiler cannot guess whether your 8 bits mean a number or a letter:
<pre><code>char  c = 65;   /* prints as A */
int   n = 65;   /* prints as 65 */
printf("%c %d\\n", c, n);   /* output:  A 65 */</code></pre></li>
<li><strong>Encoding is the bridge</strong> — turning information into data requires an agreed code: ASCII for characters, two's complement for signed integers, IEEE-754 for real numbers, RGB for pixels. Lose the code and the data become meaningless noise.</li>
</ul>
<p class="meo">💡 One-line test: if you can ask "what does it mean?" you are holding information; if you can ask "how many bytes?" you are holding data.</p>
<p class="pitfall">⚠️ A very common exam slip: saying "data and information are the same thing". They are the same <em>bits</em> — but information is data <strong>plus an interpretation</strong>. The %c versus %d example above is the shortest proof you can write in an answer.</p>`,
        `<p class="y-chinh">🎯 Trong khoa học máy tính, <strong>thông tin</strong> là mọi thứ có thể lưu trữ, xử lý, phân tích và truyền đi bằng phương tiện số; <strong>dữ liệu</strong> là các giá trị dùng để mô tả thông tin đó.</p>
<ul>
<li><strong>Định nghĩa nguyên văn trên slide</strong> — "Information is any data that can be stored, processed, analyzed, and transmitted through digital means (such as files, databases, or the Internet)." Vậy văn bản, hình ảnh, video, âm thanh đều được tính.</li>
<li><strong>Dữ liệu là cái chở</strong> — "Data: Values are used to describe information. So, information can be called as the mean of data." Dữ liệu là giá trị thô; thông tin là ý nghĩa của các giá trị đó khi bạn biết cách đọc.</li>
<li><strong>Ví dụ đã giải</strong> — byte 0100 0001 là <em>dữ liệu</em>. Đọc như số nguyên thì nó là 65; đọc như ký tự ASCII thì nó là chữ A; đọc như một phần của ảnh bitmap thì nó có thể là một mức xám. Cùng một dữ liệu, ba thông tin khác nhau — khác nhau ở chỗ <em>cách diễn giải</em>, mà trong C người ta gọi là <strong>kiểu dữ liệu (type)</strong>.</li>
<li><strong>Vì sao điều này quan trọng trong C</strong> — đây chính là lý do C bắt bạn khai báo kiểu. Trình biên dịch không thể đoán 8 bit của bạn mang nghĩa một con số hay một chữ cái:
<pre><code>char  c = 65;   /* in ra chữ A */
int   n = 65;   /* in ra số 65 */
printf("%c %d\\n", c, n);   /* kết quả:  A 65 */</code></pre></li>
<li><strong>Mã hoá là cây cầu</strong> — biến thông tin thành dữ liệu cần một bộ mã đã thống nhất: ASCII cho ký tự, bù hai cho số nguyên có dấu, IEEE-754 cho số thực, RGB cho điểm ảnh. Mất bộ mã thì dữ liệu chỉ còn là nhiễu vô nghĩa.</li>
</ul>
<p class="meo">💡 Phép thử một dòng: hỏi được "nó có nghĩa là gì?" thì bạn đang cầm thông tin; hỏi được "nó chiếm mấy byte?" thì bạn đang cầm dữ liệu.</p>
<p class="pitfall">⚠️ Lỗi rất hay gặp khi thi: trả lời "dữ liệu và thông tin là một". Chúng cùng là <em>các bit</em> đó — nhưng thông tin là dữ liệu <strong>cộng thêm một cách diễn giải</strong>. Ví dụ %c với %d ở trên là chứng cứ ngắn nhất bạn có thể viết vào bài.</p>`],

      [6, 'Problem, Solve a problem, and Solution',
        `<p class="y-chinh">🎯 Three separate words: a <strong>problem</strong> is a challenging situation you face; <strong>solving</strong> is the process of finding and applying a fix; a <strong>solution</strong> is one option proposed to fix it or reach the goal.</p>
<ul>
<li><strong>Problem</strong> — "a challenging situation that you face". Note it is a <em>situation</em>, not a question in a textbook. "Students queue too long at the canteen" is a problem.</li>
<li><strong>Solve a problem</strong> — "the process of finding and applying a solution to fix or handle that problem". It is a <em>process</em>, so it takes time, it can fail, and it can be repeated.</li>
<li><strong>Solution</strong> — "an option proposed to solve a problem or achieve a goal". The word <em>option</em> is deliberate: there is usually more than one, and part of engineering is choosing between them.</li>
<li><strong>Worked example</strong> — problem: "compute the average of three test marks for 500 students by hand, and mistakes keep happening". Candidate solutions: (a) hire more staff, (b) use a spreadsheet, (c) write a small C program. All three are solutions; only (c) is a <em>programming</em> solution.</li>
<li><strong>Why the distinction earns marks</strong> — an exam answer that jumps straight from problem to code has skipped the step where you justify the choice. The solution is <em>chosen</em>, the algorithm is <em>designed</em>, the code is <em>written</em>. Three verbs, three steps.</li>
<li><strong>Multiple solutions, different quality</strong> — to sort 1,000,000 numbers, bubble sort and quicksort are both correct solutions, but one finishes in seconds and the other in hours. Correctness is necessary, not sufficient — which is exactly the point of slides 10–11.</li>
</ul>
<p class="meo">💡 Memorise the grammar: problem = a <em>noun</em> (a situation) · solve = a <em>verb</em> (a process) · solution = a <em>noun</em> (an option). Three parts of speech, three definitions, impossible to mix up.</p>
<p class="pitfall">⚠️ Trap: treating "the program" as the solution. The program is only the <em>implementation</em> of the chosen solution. If the solution is wrong, perfect C code produces perfectly wrong answers.</p>`,
        `<p class="y-chinh">🎯 Ba từ riêng biệt: <strong>bài toán (problem)</strong> là một tình huống khó mà bạn gặp phải; <strong>giải quyết (solve)</strong> là quá trình tìm ra và áp dụng cách khắc phục; <strong>giải pháp (solution)</strong> là một phương án được đề xuất để khắc phục hoặc đạt mục tiêu.</p>
<ul>
<li><strong>Bài toán</strong> — "a challenging situation that you face". Chú ý đó là một <em>tình huống</em>, không phải câu hỏi trong sách. "Sinh viên xếp hàng quá lâu ở căng tin" là một bài toán.</li>
<li><strong>Giải quyết bài toán</strong> — "the process of finding and applying a solution". Đó là một <em>quá trình</em>, nên nó tốn thời gian, có thể thất bại, và có thể làm lại.</li>
<li><strong>Giải pháp</strong> — "an option proposed to solve a problem or achieve a goal". Chữ <em>option</em> (phương án) là có chủ ý: thường có nhiều hơn một, và một phần của nghề kỹ sư là chọn giữa chúng.</li>
<li><strong>Ví dụ đã giải</strong> — bài toán: "tính điểm trung bình ba cột cho 500 sinh viên bằng tay, và cứ sai hoài". Các giải pháp ứng viên: (a) thuê thêm người, (b) dùng bảng tính, (c) viết một chương trình C nhỏ. Cả ba đều là giải pháp; chỉ (c) là giải pháp bằng <em>lập trình</em>.</li>
<li><strong>Vì sao phân biệt được thì có điểm</strong> — bài làm nhảy thẳng từ bài toán sang code là đã bỏ qua bước lý giải vì sao chọn phương án đó. Giải pháp thì được <em>chọn</em>, giải thuật thì được <em>thiết kế</em>, mã nguồn thì được <em>viết</em>. Ba động từ, ba bước.</li>
<li><strong>Nhiều giải pháp, chất lượng khác nhau</strong> — để sắp xếp 1.000.000 số, bubble sort và quicksort đều là giải pháp đúng, nhưng một cái xong trong vài giây còn cái kia mất hàng giờ. Đúng là điều kiện cần, không phải điều kiện đủ — và đó đúng là ý của slide 10–11.</li>
</ul>
<p class="meo">💡 Nhớ theo từ loại: bài toán = <em>danh từ</em> (một tình huống) · giải quyết = <em>động từ</em> (một quá trình) · giải pháp = <em>danh từ</em> (một phương án). Ba từ loại, ba định nghĩa, không thể lẫn.</p>
<p class="pitfall">⚠️ Bẫy: coi "chương trình" chính là giải pháp. Chương trình chỉ là phần <em>hiện thực hoá</em> giải pháp đã chọn. Giải pháp sai thì code C hoàn hảo vẫn cho ra đáp số sai một cách hoàn hảo.</p>`],

      [7, 'Algorithm, Program, Computer program',
        `<p class="y-chinh">🎯 An <strong>algorithm</strong> is a procedure for solving a problem or performing a computation; a <strong>program</strong> is a sequence of steps that finds the solution; a <strong>computer program</strong> is that sequence written in a programming language for a computer to execute.</p>
<ul>
<li><strong>Algorithm — language-free</strong> — it can be written in Vietnamese, in English, as pseudocode or as a flowchart. It says <em>what</em> to do, in what order, without committing to C or Java.</li>
<li><strong>Program — a sequence of steps</strong> — the slide is careful here: a plain "program" is still a plan. It becomes a <em>computer</em> program only once it is expressed in a programming language a machine can execute.</li>
<li><strong>The five classic properties of an algorithm</strong> — finiteness (it must stop), definiteness (each step unambiguous), input, output, effectiveness (each step must be doable). An "algorithm" that never terminates is not an algorithm.</li>
<li><strong>Worked example — same idea, three forms.</strong> Problem: read three marks, print their average.<br />
Algorithm (plain words): 1) read a, b, c · 2) compute s = a + b + c · 3) compute avg = s / 3 · 4) print avg.<br />
Computer program in C:
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    float a, b, c, avg;
    printf("Enter 3 marks: ");
    scanf("%f %f %f", &amp;a, &amp;b, &amp;c);
    avg = (a + b + c) / 3;
    printf("Average = %.2f\\n", avg);
    return 0;
}</code></pre></li>
<li><strong>Read the mapping</strong> — step 1 became scanf, steps 2–3 became one arithmetic line, step 4 became printf. The algorithm survives unchanged if you rewrite this in Java; only the C-specific parts change.</li>
</ul>
<p class="dap-an">✅ Đáp án: algorithm = the idea (language-independent) · program = the ordered steps · computer program = those steps in C, ready for the compiler. The C code above prints, for input 8 7 9, exactly <strong>Average = 8.00</strong>.</p>
<p class="pitfall">⚠️ In the C code, forgetting the <code>&amp;</code> in <code>scanf("%f", &amp;a)</code> compiles with only a warning and then crashes or reads garbage at run time. scanf needs the <em>address</em> of the variable — which is exactly why slides 20–21 teach addressing.</p>`,
        `<p class="y-chinh">🎯 <strong>Giải thuật (algorithm)</strong> là một thủ tục để giải bài toán hoặc thực hiện một phép tính; <strong>chương trình (program)</strong> là dãy các bước dẫn tới lời giải; <strong>chương trình máy tính</strong> là dãy bước đó viết bằng ngôn ngữ lập trình cho máy thực thi.</p>
<ul>
<li><strong>Giải thuật — không phụ thuộc ngôn ngữ</strong> — có thể viết bằng tiếng Việt, tiếng Anh, bằng mã giả hay bằng lưu đồ. Nó nói <em>làm gì</em>, theo thứ tự nào, mà chưa cam kết dùng C hay Java.</li>
<li><strong>Chương trình — một dãy các bước</strong> — slide dùng chữ rất cẩn thận: "chương trình" trơn vẫn còn là một bản kế hoạch. Nó chỉ thành chương trình <em>máy tính</em> khi được diễn đạt bằng ngôn ngữ lập trình mà máy chạy được.</li>
<li><strong>Năm tính chất kinh điển của giải thuật</strong> — tính dừng (phải kết thúc), tính xác định (mỗi bước không mơ hồ), có đầu vào, có đầu ra, tính khả thi (mỗi bước phải làm được). Một "giải thuật" không bao giờ dừng thì không phải giải thuật.</li>
<li><strong>Ví dụ đã giải — cùng một ý, ba dạng.</strong> Bài toán: đọc ba điểm, in ra điểm trung bình.<br />
Giải thuật (lời thường): 1) đọc a, b, c · 2) tính s = a + b + c · 3) tính avg = s / 3 · 4) in avg.<br />
Chương trình máy tính bằng C:
<pre><code>#include &lt;stdio.h&gt;

int main(void) {
    float a, b, c, avg;
    printf("Nhap 3 diem: ");
    scanf("%f %f %f", &amp;a, &amp;b, &amp;c);
    avg = (a + b + c) / 3;
    printf("Trung binh = %.2f\\n", avg);
    return 0;
}</code></pre></li>
<li><strong>Đọc bảng ánh xạ</strong> — bước 1 thành scanf, bước 2–3 gộp thành một dòng tính toán, bước 4 thành printf. Giải thuật giữ nguyên nếu bạn viết lại bằng Java; chỉ những phần đặc thù của C mới đổi.</li>
</ul>
<p class="dap-an">✅ Đáp án: giải thuật = ý tưởng (độc lập ngôn ngữ) · chương trình = dãy bước có thứ tự · chương trình máy tính = dãy bước đó viết bằng C, sẵn sàng đưa cho trình biên dịch. Đoạn C ở trên, với đầu vào 8 7 9, in ra đúng <strong>Trung binh = 8.00</strong>.</p>
<p class="pitfall">⚠️ Trong đoạn C, quên dấu <code>&amp;</code> ở <code>scanf("%f", &amp;a)</code> thì vẫn biên dịch được (chỉ có cảnh báo) rồi sập hoặc đọc ra rác lúc chạy. scanf cần <em>địa chỉ</em> của biến — và đó chính là lý do slide 20–21 dạy về đánh địa chỉ.</p>`],

      [8, 'Computer program (cont.) — program = data + instructions',
        `<p class="y-chinh">🎯 The core formula of the whole course: a <strong>computer program = data + instructions</strong>. It simulates a solution, it is executed by hardware, and a set of related programs is called <strong>software</strong>.</p>
<ul>
<li><strong>"Computer program = data + instructions"</strong> — these are the two things that live in RAM while your program runs. Instructions say what to do; data is what it is done to. Slides 18–21 are about the data half, slides 22–25 about the instruction half.</li>
<li><strong>"A simulation of solution"</strong> — the program is a <em>model</em> of the human solution, not the solution itself. A payroll program simulates what an accountant would do by hand.</li>
<li><strong>"Is a set of instructions that computer hardware will execute"</strong> — note <em>hardware</em>, not "the compiler". The compiler only translates; execution happens in the CPU of slide 14.</li>
<li><strong>"Increase the performance of standard workflow"</strong> — the business justification. A program is worth writing when the task is repetitive, high-volume, or error-prone by hand — exactly the three marks of a "standard workflow".</li>
<li><strong>"Computer software: A set of related programs"</strong> — one program is not software. Microsoft Word ships as many executables, libraries, resource files and configuration data that cooperate.</li>
<li><strong>See the formula in real C</strong> — in this snippet, <code>total</code> and <code>n</code> are the <em>data</em>; the loop and the assignment are the <em>instructions</em>:
<pre><code>int total = 0, n;              /* data      */
for (n = 1; n &lt;= 100; n++)     /* instruction */
    total += n;                /* instruction acting on data */
printf("%d\\n", total);         /* prints 5050 */</code></pre></li>
</ul>
<p class="dap-an">✅ Đáp án: the loop runs n = 1..100 and accumulates; the sum is 100 × 101 / 2 = <strong>5050</strong>, which is what the program prints.</p>
<p class="meo">💡 Whenever you read any program for the first time, physically split it in two: which lines <em>hold</em> values (declarations) and which lines <em>change</em> them (statements). That split is the formula on this slide, applied.</p>`,
        `<p class="y-chinh">🎯 Công thức cốt lõi của cả môn học: <strong>chương trình máy tính = dữ liệu + lệnh</strong>. Nó mô phỏng một giải pháp, được phần cứng thực thi, và một tập các chương trình liên quan nhau thì gọi là <strong>phần mềm</strong>.</p>
<ul>
<li><strong>"Computer program = data + instructions"</strong> — đây là hai thứ nằm trong RAM khi chương trình chạy. Lệnh nói phải làm gì; dữ liệu là thứ bị làm. Slide 18–21 bàn nửa dữ liệu, slide 22–25 bàn nửa lệnh.</li>
<li><strong>"A simulation of solution"</strong> — chương trình là một <em>mô hình</em> của lời giải do con người nghĩ ra, chứ bản thân nó không phải lời giải. Phần mềm tính lương mô phỏng lại việc mà kế toán sẽ làm bằng tay.</li>
<li><strong>"Is a set of instructions that computer hardware will execute"</strong> — để ý chữ <em>phần cứng</em>, không phải "trình biên dịch". Trình biên dịch chỉ dịch; việc thực thi diễn ra trong CPU của slide 14.</li>
<li><strong>"Increase the performance of standard workflow"</strong> — đây là lý do kinh tế. Viết một chương trình là đáng khi công việc lặp đi lặp lại, khối lượng lớn, hoặc làm tay thì hay sai — đúng ba dấu hiệu của một "quy trình chuẩn".</li>
<li><strong>"Computer software: A set of related programs"</strong> — một chương trình chưa phải phần mềm. Microsoft Word được giao đi kèm rất nhiều tệp thực thi, thư viện, tệp tài nguyên và dữ liệu cấu hình phối hợp với nhau.</li>
<li><strong>Nhìn thấy công thức trong C thật</strong> — trong đoạn dưới, <code>total</code> và <code>n</code> là <em>dữ liệu</em>; vòng lặp và phép gán là <em>lệnh</em>:
<pre><code>int total = 0, n;              /* dữ liệu  */
for (n = 1; n &lt;= 100; n++)     /* lệnh */
    total += n;                /* lệnh tác động lên dữ liệu */
printf("%d\\n", total);         /* in ra 5050 */</code></pre></li>
</ul>
<p class="dap-an">✅ Đáp án: vòng lặp chạy n = 1..100 và cộng dồn; tổng bằng 100 × 101 / 2 = <strong>5050</strong>, đúng con số chương trình in ra.</p>
<p class="meo">💡 Mỗi khi đọc một chương trình lần đầu, hãy tách đôi nó ra bằng mắt: dòng nào <em>chứa</em> giá trị (khai báo) và dòng nào <em>thay đổi</em> giá trị (câu lệnh). Phép tách đó chính là công thức của slide này khi đem áp dụng.</p>`],

      [9, 'How to make a good software? (section divider)',
        `<p class="y-chinh">🎯 A section marker: "it compiles and gives the right answer" is only the entry ticket. The next two slides list the seven attributes that separate a homework exercise from real software.</p>
<ul>
<li><strong>The question behind the section</strong> — two programs can both produce correct output and still be worlds apart in value. Why? Because software is <em>read</em>, <em>changed</em> and <em>reused</em> far more often than it is written.</li>
<li><strong>Slide 10 covers four attributes</strong> — usability, correctness, maintainability (split into understandability and modifiability), and portability.</li>
<li><strong>Slide 11 covers three more</strong> — modularity, scalability and robustness.</li>
<li><strong>Why a first-year course cares</strong> — the habits are cheap to build now and expensive to retrofit later. Naming a variable <code>averageMark</code> instead of <code>x</code> costs nothing today and saves an hour in six months.</li>
<li><strong>How it shows up in PRF192 marking</strong> — lab and PE submissions are graded on correct output <em>and</em> on structure: functions instead of one giant main, meaningful names, comments, consistent indentation. That grading rubric is this section, applied.</li>
</ul>
<p class="meo">💡 The test for "good software" is not "does it work today?" but "can someone else change it safely in six months?" Keep that second question in mind for every lab you submit.</p>`,
        `<p class="y-chinh">🎯 Slide phân mục: "biên dịch được và ra đúng kết quả" mới chỉ là vé vào cửa. Hai slide kế tiếp liệt kê bảy thuộc tính phân biệt một bài tập về nhà với phần mềm thật.</p>
<ul>
<li><strong>Câu hỏi nằm sau mục này</strong> — hai chương trình cùng cho ra kết quả đúng vẫn có thể khác nhau một trời một vực về giá trị. Vì sao? Vì phần mềm bị <em>đọc</em>, bị <em>sửa</em> và được <em>dùng lại</em> nhiều hơn hẳn số lần nó được viết ra.</li>
<li><strong>Slide 10 nói bốn thuộc tính</strong> — dễ dùng (usability), đúng đắn (correctness), dễ bảo trì (maintainability — tách thành dễ hiểu và dễ sửa), và khả chuyển (portability).</li>
<li><strong>Slide 11 nói ba thuộc tính nữa</strong> — chia module (modularity), khả năng mở rộng (scalability) và bền vững (robustness).</li>
<li><strong>Vì sao môn năm nhất lại quan tâm</strong> — những thói quen này rèn bây giờ thì rẻ, vá về sau thì rất đắt. Đặt tên biến là <code>averageMark</code> thay vì <code>x</code> hôm nay không tốn gì và sáu tháng sau tiết kiệm cho bạn một tiếng đồng hồ.</li>
<li><strong>Nó hiện ra trong barem chấm PRF192 thế nào</strong> — bài lab và bài PE được chấm cả trên kết quả đúng <em>lẫn</em> cấu trúc: có tách hàm thay vì nhồi hết vào main, tên có nghĩa, có chú thích, thụt lề nhất quán. Cái barem đó chính là mục này khi đem áp dụng.</li>
</ul>
<p class="meo">💡 Phép thử "phần mềm tốt" không phải "hôm nay nó chạy được chứ?" mà là "sáu tháng nữa người khác có sửa nó an toàn được không?". Hãy giữ câu hỏi thứ hai trong đầu cho mọi bài lab bạn nộp.</p>`],

      [10, 'Issues for a program / software — usability, correctness, maintainability, portability',
        `<p class="y-chinh">🎯 Four quality attributes, each with a concrete engineering practice attached: usability ⟶ robust friendly interfaces · correctness ⟶ comprehensive testing · maintainability ⟶ structure and documentation · portability ⟶ standards compliance.</p>
<ul>
<li><strong>Usability</strong> — "Users can use the program to solve the problem", supported by "robust and user-friendly interfaces". A correct program nobody can operate solves nothing. In PRF192 terms: prompt before you read, label what you print.</li>
<li><strong>Correctness</strong> — "The solution must be correct", supported by "comprehensive testing". Note the pairing: correctness is not claimed, it is <em>demonstrated</em> by testing normal cases, boundary cases (n = 0, n = 1, the largest allowed value) and invalid input.</li>
<li><strong>Maintainability = understandability + modifiability</strong> — the slide splits it explicitly. <em>Understandability</em> comes from structured programming plus documenting the code and the overall design "to help others (and yourself)". <em>Modifiability</em> comes from standards compliance.</li>
<li><strong>Portability</strong> — "The program can run on different platforms with minimal modification", where the slide defines <strong>platform = CPU + operating system running on it</strong>. Standards compliance means the needed modifications are minimum.</li>
<li><strong>Portability in real C</strong> — the portable way to print the size of an int is to ask, never to assume:
<pre><code>#include &lt;stdio.h&gt;
int main(void) {
    printf("int = %d bytes\\n", (int) sizeof(int));
    return 0;     /* 4 on most desktops, 2 on some embedded targets */
}</code></pre>
Hard-coding "an int is 4 bytes" is exactly the kind of assumption that destroys portability.</li>
<li><strong>The attributes trade off</strong> — the fastest code is rarely the most readable; the most portable code cannot use platform-specific tricks. Engineering is choosing which attribute wins for <em>this</em> program.</li>
</ul>
<p class="dap-an">✅ Đáp án — mapping each attribute to its practice: usability → friendly interface · correctness → comprehensive testing · understandability → structured programming + documentation · modifiability &amp; portability → standards compliance (platform = CPU + OS).</p>
<p class="pitfall">⚠️ Exam trap: writing "maintainability" as one word without its two halves. The slide deliberately breaks it into <em>understandability</em> and <em>modifiability</em>, and a question asking for "the two aspects of maintainability" expects exactly those two.</p>`,
        `<p class="y-chinh">🎯 Bốn thuộc tính chất lượng, mỗi cái gắn với một biện pháp kỹ thuật cụ thể: dễ dùng ⟶ giao diện thân thiện và bền · đúng đắn ⟶ kiểm thử toàn diện · dễ bảo trì ⟶ cấu trúc và tài liệu · khả chuyển ⟶ tuân thủ chuẩn.</p>
<ul>
<li><strong>Usability (dễ dùng)</strong> — "Users can use the program to solve the problem", kèm "robust and user-friendly interfaces". Một chương trình đúng mà không ai vận hành nổi thì không giải quyết được gì. Quy về PRF192: phải nhắc trước khi đọc dữ liệu, phải ghi nhãn cho thứ mình in ra.</li>
<li><strong>Correctness (đúng đắn)</strong> — "The solution must be correct", kèm "comprehensive testing". Để ý cách ghép cặp: tính đúng đắn không phải thứ để tuyên bố, mà phải <em>chứng minh</em> bằng cách kiểm thử trường hợp thường, trường hợp biên (n = 0, n = 1, giá trị lớn nhất cho phép) và dữ liệu vào không hợp lệ.</li>
<li><strong>Maintainability = understandability + modifiability</strong> — slide tách rõ ra hai nửa. <em>Dễ hiểu</em> đến từ lập trình có cấu trúc cộng với việc viết tài liệu cho mã và cho thiết kế tổng thể "để giúp người khác (và chính bạn)". <em>Dễ sửa</em> đến từ việc tuân thủ chuẩn.</li>
<li><strong>Portability (khả chuyển)</strong> — "The program can run on different platforms with minimal modification", trong đó slide định nghĩa <strong>nền tảng = CPU + hệ điều hành chạy trên CPU đó</strong>. Tuân thủ chuẩn nghĩa là phần phải sửa đổi là tối thiểu.</li>
<li><strong>Khả chuyển trong C thật</strong> — cách viết khả chuyển để biết kích thước một int là đi hỏi, tuyệt đối không giả định:
<pre><code>#include &lt;stdio.h&gt;
int main(void) {
    printf("int = %d byte\\n", (int) sizeof(int));
    return 0;     /* 4 trên hầu hết máy bàn, 2 trên một số hệ nhúng */
}</code></pre>
Viết cứng "int luôn là 4 byte" đúng là kiểu giả định giết chết tính khả chuyển.</li>
<li><strong>Các thuộc tính đánh đổi lẫn nhau</strong> — mã nhanh nhất hiếm khi dễ đọc nhất; mã khả chuyển nhất thì không được dùng mẹo riêng của nền tảng. Làm kỹ sư là chọn xem thuộc tính nào thắng đối với <em>chương trình này</em>.</li>
</ul>
<p class="dap-an">✅ Đáp án — ánh xạ từng thuộc tính sang biện pháp: dễ dùng → giao diện thân thiện · đúng đắn → kiểm thử toàn diện · dễ hiểu → lập trình có cấu trúc + tài liệu · dễ sửa &amp; khả chuyển → tuân thủ chuẩn (nền tảng = CPU + HĐH).</p>
<p class="pitfall">⚠️ Bẫy thi: viết "maintainability" trơ trọi một từ, không kèm hai nửa của nó. Slide cố ý bẻ nó thành <em>understandability</em> và <em>modifiability</em>, và câu hỏi "hai khía cạnh của tính dễ bảo trì" chờ đúng hai chữ đó.</p>`],

      [11, 'Issues (cont.) — modularity, scalability, robustness',
        `<p class="y-chinh">🎯 Three more attributes: split the program into self-contained modules, make sure it survives growth, and make sure it survives bad input.</p>
<ul>
<li><strong>Modularity</strong> — "Break the program into smaller, self-contained modules or functions" and "each module should perform a specific task or represent a logical grouping of related functionality". In C this is the function, and later the separate .c/.h file pair (Slot 08–09).</li>
<li><strong>Why modules pay</strong> — a bug in a 30-line function is found in minutes; the same bug in a 600-line main is found in hours. Modules also make reuse possible: write <code>isPrime</code> once, call it from three programs.</li>
<li><strong>Scalability</strong> — "Ensure the software can handle increased loads (e.g., more users, larger datasets) without significant performance degradation" and "opt for efficient algorithms and data structures". Scalability is an <em>algorithm</em> property far more than a coding-style one.</li>
<li><strong>Scalability made concrete</strong> — searching a sorted array of n items: linear search does about n comparisons, binary search does about log2(n). For n = 1,000,000 that is 1,000,000 versus 20. No amount of clever C makes linear search catch up.</li>
<li><strong>Robustness</strong> — "Write software that handles errors and unexpected inputs gracefully" with "error handling, logging, and validation mechanisms". The user <em>will</em> type a letter where you asked for a number.</li>
<li><strong>Modularity + robustness in one snippet</strong> — one small function with a specific task, and a caller that validates instead of trusting:
<pre><code>#include &lt;stdio.h&gt;

/* one module, one specific task */
float average3(float a, float b, float c) {
    return (a + b + c) / 3;
}

int main(void) {
    float a, b, c;
    printf("Enter 3 marks: ");
    if (scanf("%f %f %f", &amp;a, &amp;b, &amp;c) != 3) {   /* validation */
        printf("Invalid input\\n");
        return 1;
    }
    printf("Average = %.2f\\n", average3(a, b, c));
    return 0;
}</code></pre></li>
</ul>
<p class="dap-an">✅ Đáp án: <code>scanf</code> returns <em>how many items it successfully read</em>. Comparing that count with 3 is the cheapest robustness check in C — with input "8 x 9" the program prints <strong>Invalid input</strong> and exits with code 1 instead of computing with garbage.</p>
<p class="meo">💡 Remember the three by the question each answers: modularity — "can I find the bug?" · scalability — "does it still work at 100× the data?" · robustness — "what happens when the user is wrong?"</p>`,
        `<p class="y-chinh">🎯 Ba thuộc tính nữa: chia chương trình thành các module độc lập, bảo đảm nó sống sót khi quy mô tăng, và bảo đảm nó sống sót khi dữ liệu vào sai.</p>
<ul>
<li><strong>Modularity (chia module)</strong> — "Break the program into smaller, self-contained modules or functions" và "each module should perform a specific task or represent a logical grouping of related functionality". Trong C thì đó là hàm, và về sau là cặp tệp .c/.h riêng (Slot 08–09).</li>
<li><strong>Vì sao chia module thì lời</strong> — một lỗi trong hàm 30 dòng thì vài phút là tìm ra; đúng lỗi đó trong một main dài 600 dòng thì mất hàng giờ. Module còn giúp dùng lại được: viết <code>isPrime</code> một lần, gọi từ ba chương trình.</li>
<li><strong>Scalability (khả năng mở rộng)</strong> — "Ensure the software can handle increased loads (e.g., more users, larger datasets) without significant performance degradation" và "opt for efficient algorithms and data structures". Khả năng mở rộng là tính chất của <em>giải thuật</em> nhiều hơn hẳn là của phong cách viết mã.</li>
<li><strong>Cụ thể hoá khả năng mở rộng</strong> — tìm kiếm trong mảng đã sắp xếp có n phần tử: tìm tuần tự mất khoảng n phép so sánh, tìm nhị phân mất khoảng log2(n). Với n = 1.000.000 thì là 1.000.000 so với 20. Không có mẹo C tài giỏi nào giúp tìm tuần tự đuổi kịp.</li>
<li><strong>Robustness (bền vững)</strong> — "Write software that handles errors and unexpected inputs gracefully" với "error handling, logging, and validation mechanisms". Người dùng <em>chắc chắn</em> sẽ gõ chữ vào chỗ bạn hỏi số.</li>
<li><strong>Module + bền vững trong một đoạn</strong> — một hàm nhỏ làm đúng một việc, và nơi gọi thì kiểm tra chứ không tin tưởng:
<pre><code>#include &lt;stdio.h&gt;

/* một module, một việc cụ thể */
float average3(float a, float b, float c) {
    return (a + b + c) / 3;
}

int main(void) {
    float a, b, c;
    printf("Nhap 3 diem: ");
    if (scanf("%f %f %f", &amp;a, &amp;b, &amp;c) != 3) {   /* kiểm tra dữ liệu vào */
        printf("Du lieu khong hop le\\n");
        return 1;
    }
    printf("Trung binh = %.2f\\n", average3(a, b, c));
    return 0;
}</code></pre></li>
</ul>
<p class="dap-an">✅ Đáp án: <code>scanf</code> trả về <em>số mục nó đọc thành công</em>. So số đó với 3 là phép kiểm bền vững rẻ nhất trong C — với dữ liệu vào "8 x 9", chương trình in <strong>Du lieu khong hop le</strong> rồi thoát với mã 1 thay vì đi tính toán trên rác.</p>
<p class="meo">💡 Nhớ ba thuộc tính bằng câu hỏi mà mỗi cái trả lời: chia module — "mình có tìm ra lỗi không?" · khả năng mở rộng — "gấp 100 lần dữ liệu nó còn chạy nổi không?" · bền vững — "người dùng làm sai thì sao?"</p>`],

      [12, 'Overview Computer Hardware (section divider)',
        `<p class="y-chinh">🎯 A section marker: the deck now descends into the machine. Slides 13–16 cover the buses, the CPU, primary memory, and the devices.</p>
<ul>
<li><strong>Why a programming course teaches hardware</strong> — because C exposes it. Pointers are memory addresses, <code>sizeof</code> is a hardware fact, integer overflow is a register-width fact, and "undefined behaviour" usually means "whatever the hardware happened to do".</li>
<li><strong>Slide 13 — the buses</strong> — address bus, data bus, control bus, and the exact three steps the CPU takes to read one memory cell.</li>
<li><strong>Slide 14 — the CPU</strong> — registers, decode unit, control unit, ALU, floating-point accelerator, and the fact that instructions are executed serially.</li>
<li><strong>Slide 15 — primary memory</strong> — ROM versus RAM, and the volatility difference that explains why you must save your work.</li>
<li><strong>Slide 16 — devices</strong> — I/O devices, secondary storage, and the central controller that connects them to the system buses.</li>
<li><strong>The von Neumann picture to hold</strong> — CPU and memory, connected by buses, with devices hanging off the same buses. Instructions and data both live in the same memory; the CPU fetches, decodes, executes, repeat.</li>
</ul>
<p class="meo">💡 Draw the picture once by hand: a box "CPU", a box "Memory", three arrows labelled address / data / control between them, and a box "Devices" on the same lines. Every slide in this section is a zoom into one part of that drawing.</p>`,
        `<p class="y-chinh">🎯 Slide phân mục: từ đây bộ slide đi xuống bên trong máy. Slide 13–16 nói về các bus, CPU, bộ nhớ chính, và các thiết bị.</p>
<ul>
<li><strong>Vì sao môn lập trình lại dạy phần cứng</strong> — vì C phơi bày nó ra. Con trỏ chính là địa chỉ bộ nhớ, <code>sizeof</code> là một sự thật phần cứng, tràn số nguyên là hệ quả của độ rộng thanh ghi, và "hành vi không xác định" thường có nghĩa là "phần cứng làm gì thì ra thế".</li>
<li><strong>Slide 13 — các bus</strong> — bus địa chỉ, bus dữ liệu, bus điều khiển, và đúng ba bước CPU thực hiện để đọc một ô nhớ.</li>
<li><strong>Slide 14 — CPU</strong> — thanh ghi, khối giải mã, khối điều khiển, ALU, bộ tăng tốc dấu phẩy động, và sự thật rằng lệnh được thực thi tuần tự.</li>
<li><strong>Slide 15 — bộ nhớ chính</strong> — ROM so với RAM, và khác biệt về tính khả biến giải thích vì sao bạn phải bấm lưu.</li>
<li><strong>Slide 16 — thiết bị</strong> — thiết bị vào/ra, bộ nhớ thứ cấp, và bộ điều khiển trung tâm nối chúng vào hệ bus.</li>
<li><strong>Bức tranh von Neumann cần ghi nhớ</strong> — CPU và bộ nhớ, nối với nhau bằng các bus, các thiết bị treo trên cùng hệ bus đó. Lệnh và dữ liệu cùng nằm trong một bộ nhớ; CPU nạp lệnh, giải mã, thực thi, rồi lặp lại.</li>
</ul>
<p class="meo">💡 Hãy vẽ bức tranh đó bằng tay một lần: một ô "CPU", một ô "Bộ nhớ", ba mũi tên ghi nhãn địa chỉ / dữ liệu / điều khiển giữa chúng, và một ô "Thiết bị" treo trên cùng đường đó. Mọi slide của mục này chỉ là phóng to một phần của hình vẽ ấy.</p>`],

      [13, 'Computer Hardware — Review: the three buses',
        `<p class="y-chinh">🎯 A bus is the set of wires connecting CPU, memory and peripherals. There are three of them, each with a different job, and a memory read takes exactly three steps across them.</p>
<ul>
<li><strong>Address bus</strong> — "Determine the IO peripherals, position of accessed memory". It carries <em>which</em> cell or device we mean. Its width sets the maximum addressable memory (slide 21): 32 wires ⟹ 2^32 = 4 GB.</li>
<li><strong>Data bus</strong> — "Transmit data". It carries the value itself, in both directions (read and write). Its width is usually the word length of slide 19.</li>
<li><strong>Control bus</strong> — "Determine operation on peripherals, read peripheral's states". It carries <em>what</em> to do (read? write?) and the status signals coming back.</li>
<li><strong>The three steps to read a memory cell, verbatim from the slide</strong> — (1) CPU puts the memory address on the address bus · (2) CPU puts the read-signal on the control bus · (3) data in the memory cell is transferred to a register in the CPU.</li>
<li><strong>Read the steps as a sentence</strong> — <em>where</em> (address), then <em>what to do</em> (control), then <em>the value</em> comes back (data). The order is not arbitrary: memory cannot know which cell to output until the address is on the wires and the read line is asserted.</li>
<li><strong>ALU</strong> — "Arithmetic and Logic Unit", the part of the CPU that actually adds, subtracts, compares, and does AND/OR/NOT. Detailed on slide 14.</li>
</ul>
<p class="dap-an">✅ Đáp án — a write is the mirror image: (1) address on the address bus · (2) the value on the data bus · (3) write-signal on the control bus, and memory stores it. Only the direction of the data bus and one control line change.</p>
<p class="pitfall">⚠️ Exam trap: swapping the roles of address bus and data bus. Mnemonic — the address bus says <em>WHERE</em>, the data bus says <em>WHAT</em>, the control bus says <em>HOW</em>. Three W/H words, three buses.</p>`,
        `<p class="y-chinh">🎯 Bus là tập các đường dây nối CPU, bộ nhớ và thiết bị ngoại vi. Có ba loại, mỗi loại một nhiệm vụ, và một phép đọc bộ nhớ đi qua chúng đúng ba bước.</p>
<ul>
<li><strong>Bus địa chỉ (address bus)</strong> — "Determine the IO peripherals, position of accessed memory". Nó chở thông tin <em>ô nào</em> hoặc <em>thiết bị nào</em>. Độ rộng của nó quy định dung lượng bộ nhớ tối đa đánh địa chỉ được (slide 21): 32 đường dây ⟹ 2^32 = 4 GB.</li>
<li><strong>Bus dữ liệu (data bus)</strong> — "Transmit data". Nó chở chính giá trị, theo cả hai chiều (đọc và ghi). Độ rộng của nó thường bằng độ dài từ máy ở slide 19.</li>
<li><strong>Bus điều khiển (control bus)</strong> — "Determine operation on peripherals, read peripheral's states". Nó chở thông tin <em>làm gì</em> (đọc? ghi?) và các tín hiệu trạng thái báo ngược về.</li>
<li><strong>Ba bước đọc một ô nhớ, nguyên văn trên slide</strong> — (1) CPU đặt địa chỉ bộ nhớ lên bus địa chỉ · (2) CPU đặt tín hiệu đọc lên bus điều khiển · (3) dữ liệu trong ô nhớ được chuyển vào một thanh ghi của CPU.</li>
<li><strong>Đọc ba bước thành một câu</strong> — <em>ở đâu</em> (địa chỉ), rồi <em>làm gì</em> (điều khiển), rồi <em>giá trị</em> trả về (dữ liệu). Thứ tự này không tuỳ tiện: bộ nhớ không thể biết phải xuất ô nào cho tới khi địa chỉ đã nằm trên dây và đường đọc đã được kích.</li>
<li><strong>ALU</strong> — "Arithmetic and Logic Unit", phần của CPU thực sự cộng, trừ, so sánh và làm AND/OR/NOT. Chi tiết ở slide 14.</li>
</ul>
<p class="dap-an">✅ Đáp án — phép ghi là ảnh gương của phép đọc: (1) địa chỉ lên bus địa chỉ · (2) giá trị lên bus dữ liệu · (3) tín hiệu ghi lên bus điều khiển, và bộ nhớ lưu lại. Chỉ chiều của bus dữ liệu và một đường điều khiển là đổi.</p>
<p class="pitfall">⚠️ Bẫy thi: đảo vai trò của bus địa chỉ và bus dữ liệu. Mẹo nhớ — bus địa chỉ nói <em>Ở ĐÂU</em>, bus dữ liệu nói <em>CÁI GÌ</em>, bus điều khiển nói <em>LÀM SAO</em>. Ba câu hỏi, ba bus.</p>`],

      [14, 'Central Processing Unit (CPU)',
        `<p class="y-chinh">🎯 "The CPU executes program instructions serially (one at a time)." A modern CPU is made of registers, a decode unit, a control unit, an ALU and a floating-point accelerator.</p>
<ul>
<li><strong>Serially — one at a time</strong> — this is the mental model that makes C readable: statements run in the order you wrote them, one finishing before the next begins. (Real CPUs pipeline and reorder, but they must preserve this illusion.)</li>
<li><strong>Registers</strong> — the CPU's own tiny, extremely fast memory cells. Their width <em>is</em> the word length of slide 19: a "64-bit CPU" means 64-bit general registers. Every value the ALU touches must be in a register first — that is step 3 of the memory read on slide 13.</li>
<li><strong>Decode unit</strong> — takes the binary instruction fetched from memory and works out what it means: which opcode, which operands. This is exactly the anatomy on slide 23.</li>
<li><strong>Control unit (CU)</strong> — the conductor. It drives the buses, sequences fetch ⟶ decode ⟶ execute, and tells every other part when to act.</li>
<li><strong>Arithmetic and Logic Unit (ALU)</strong> — performs integer arithmetic (+ − × ÷), comparisons, and bitwise logic (AND, OR, NOT, XOR). In C this is where <code>a + b</code>, <code>a &amp;&amp; b</code> and <code>a &amp; b</code> end up.</li>
<li><strong>Floating-point accelerator (FPA)</strong> — separate hardware for real numbers, because the IEEE-754 format needs its own circuitry. This is why <code>float</code>/<code>double</code> arithmetic behaves differently from <code>int</code> arithmetic, including rounding surprises like 0.1 + 0.2 not being exactly 0.3.</li>
</ul>
<p class="dap-an">✅ Đáp án — the cycle in five words: <strong>fetch, decode, execute, store, repeat</strong>. The CU drives it, the decode unit does the decoding, the ALU or FPA does the executing, and the registers hold the operands and the result.</p>
<p class="meo">💡 Map the parts to a kitchen: CU = the head chef giving orders · registers = the counter space in reach · ALU = the hands doing the chopping · FPA = the specialist pastry station · decode unit = the person reading the order ticket.</p>`,
        `<p class="y-chinh">🎯 "The CPU executes program instructions serially (one at a time)." Một CPU hiện đại gồm các thanh ghi, khối giải mã, khối điều khiển, ALU và bộ tăng tốc dấu phẩy động.</p>
<ul>
<li><strong>Tuần tự — mỗi lần một lệnh</strong> — đây là mô hình tư duy khiến C đọc được: các câu lệnh chạy theo đúng thứ tự bạn viết, cái trước xong thì cái sau mới bắt đầu. (CPU thật có đường ống và sắp xếp lại thứ tự, nhưng buộc phải giữ nguyên ảo giác này.)</li>
<li><strong>Thanh ghi (registers)</strong> — những ô nhớ tí hon cực nhanh của chính CPU. Độ rộng của chúng <em>chính là</em> độ dài từ máy ở slide 19: "CPU 64 bit" nghĩa là thanh ghi đa dụng rộng 64 bit. Mọi giá trị mà ALU đụng tới đều phải vào thanh ghi trước — đó chính là bước 3 của phép đọc bộ nhớ ở slide 13.</li>
<li><strong>Khối giải mã (decode unit)</strong> — nhận lệnh nhị phân vừa nạp từ bộ nhớ và tìm ra nó có nghĩa gì: mã thao tác nào, toán hạng nào. Đây đúng là phần giải phẫu ở slide 23.</li>
<li><strong>Khối điều khiển (CU)</strong> — người nhạc trưởng. Nó điều khiển các bus, xếp nhịp nạp ⟶ giải mã ⟶ thực thi, và bảo mọi bộ phận khác khi nào thì hành động.</li>
<li><strong>Khối số học và logic (ALU)</strong> — thực hiện phép toán số nguyên (+ − × ÷), phép so sánh, và logic trên bit (AND, OR, NOT, XOR). Trong C thì <code>a + b</code>, <code>a &amp;&amp; b</code> và <code>a &amp; b</code> cuối cùng đều rơi vào đây.</li>
<li><strong>Bộ tăng tốc dấu phẩy động (FPA)</strong> — phần cứng riêng cho số thực, vì định dạng IEEE-754 cần mạch riêng. Đây là lý do phép tính <code>float</code>/<code>double</code> hành xử khác phép tính <code>int</code>, kể cả những bất ngờ về làm tròn như 0.1 + 0.2 không đúng bằng 0.3.</li>
</ul>
<p class="dap-an">✅ Đáp án — chu trình gói trong năm chữ: <strong>nạp, giải mã, thực thi, lưu, lặp lại</strong>. CU điều nhịp, khối giải mã lo giải mã, ALU hoặc FPA lo thực thi, còn thanh ghi giữ toán hạng và kết quả.</p>
<p class="meo">💡 Ánh xạ các bộ phận sang một gian bếp: CU = bếp trưởng ra lệnh · thanh ghi = mặt bàn trong tầm tay · ALU = đôi tay thái chặt · FPA = trạm bánh ngọt chuyên biệt · khối giải mã = người đọc phiếu gọi món.</p>`],

      [15, 'Primary Memory — ROM and RAM',
        `<p class="y-chinh">🎯 Primary memory is "memory directly accessible by the CPU" and it comes in two kinds: <strong>ROM</strong>, which holds the start-up instructions and is not volatile, and <strong>RAM</strong>, which holds the running program and its data and <em>is</em> volatile.</p>
<ul>
<li><strong>"Directly accessible by the CPU"</strong> — this is the defining phrase. The CPU can put an address on the address bus and get the byte back. It cannot do that with a hard disk; a disk must be read through a controller into RAM first. That is the primary / secondary split.</li>
<li><strong>ROM (Read Only Memory)</strong> — "holds the instructions for starting the system. ROM is not volatile." Non-volatile means the contents survive power-off. This is where the BIOS/UEFI firmware lives — the code that runs before any operating system exists.</li>
<li><strong>RAM (Random Access Memory)</strong> — "holds the program instructions and the program data. RAM is volatile." Volatile means the contents vanish when power is removed. Note it holds <em>both</em> halves of "program = data + instructions" from slide 8.</li>
<li><strong>Why "Random Access"</strong> — any cell can be reached in the same time, regardless of its address. Contrast with magnetic tape, where reaching the end means winding through everything before it.</li>
<li><strong>The consequence you already feel</strong> — power loss loses unsaved work, because your document is in volatile RAM until you write it to non-volatile storage. Every "save" is a copy from RAM to disk.</li>
<li><strong>Where your C variables live</strong> — in RAM, not in ROM, and not in the CPU. They are copied into registers when the ALU needs them and copied back afterwards:
<pre><code>int a = 5, b = 7, s;   /* a, b, s occupy RAM cells */
s = a + b;             /* load a, load b, ALU adds, store s */
printf("%d\\n", s);     /* prints 12 */</code></pre></li>
</ul>
<p class="dap-an">✅ Đáp án: ROM = start-up instructions, non-volatile, read-only in normal operation · RAM = the running program and its data, volatile, read-and-write. Both are primary memory because both sit directly on the CPU buses.</p>
<p class="pitfall">⚠️ Trap: calling a hard disk or an SSD "memory" in an exam answer. In this course they are <em>secondary storage</em> (slide 16). Primary memory is only ROM and RAM.</p>`,
        `<p class="y-chinh">🎯 Bộ nhớ chính là "memory directly accessible by the CPU" và có hai loại: <strong>ROM</strong>, chứa lệnh khởi động hệ thống và không khả biến, và <strong>RAM</strong>, chứa chương trình đang chạy cùng dữ liệu của nó và <em>có</em> khả biến.</p>
<ul>
<li><strong>"CPU truy cập trực tiếp được"</strong> — đây là cụm từ định nghĩa. CPU đặt được địa chỉ lên bus địa chỉ và nhận byte về. Nó không làm thế với ổ cứng được; ổ cứng phải được đọc qua bộ điều khiển vào RAM trước đã. Đó chính là ranh giới bộ nhớ chính / thứ cấp.</li>
<li><strong>ROM (Read Only Memory)</strong> — "holds the instructions for starting the system. ROM is not volatile." Không khả biến nghĩa là nội dung còn nguyên sau khi mất điện. Đây là chỗ firmware BIOS/UEFI trú ngụ — đoạn mã chạy trước khi có bất kỳ hệ điều hành nào.</li>
<li><strong>RAM (Random Access Memory)</strong> — "holds the program instructions and the program data. RAM is volatile." Khả biến nghĩa là nội dung bay sạch khi mất điện. Để ý nó giữ <em>cả hai</em> nửa của "chương trình = dữ liệu + lệnh" ở slide 8.</li>
<li><strong>Vì sao gọi là "truy cập ngẫu nhiên"</strong> — ô nào cũng tới được trong cùng một khoảng thời gian, bất kể địa chỉ. Ngược lại với băng từ, muốn tới cuối băng thì phải quay qua toàn bộ phần trước.</li>
<li><strong>Hệ quả bạn đã từng nếm</strong> — mất điện là mất phần chưa lưu, vì tài liệu của bạn nằm trong RAM khả biến cho tới khi được ghi xuống bộ nhớ không khả biến. Mỗi lần "lưu" là một lần chép từ RAM xuống đĩa.</li>
<li><strong>Biến C của bạn sống ở đâu</strong> — trong RAM, không phải trong ROM, cũng không phải trong CPU. Chúng được chép vào thanh ghi khi ALU cần rồi chép trả về:
<pre><code>int a = 5, b = 7, s;   /* a, b, s chiếm các ô RAM */
s = a + b;             /* nạp a, nạp b, ALU cộng, lưu s */
printf("%d\\n", s);     /* in ra 12 */</code></pre></li>
</ul>
<p class="dap-an">✅ Đáp án: ROM = lệnh khởi động, không khả biến, chỉ đọc trong vận hành bình thường · RAM = chương trình đang chạy và dữ liệu của nó, khả biến, đọc-ghi được. Cả hai đều là bộ nhớ chính vì cùng nằm trực tiếp trên hệ bus của CPU.</p>
<p class="pitfall">⚠️ Bẫy: gọi ổ cứng hay SSD là "bộ nhớ" trong bài thi. Trong môn này chúng là <em>bộ nhớ thứ cấp</em> (slide 16). Bộ nhớ chính chỉ gồm ROM và RAM.</p>`],

      [16, 'Devices — I/O and secondary storage',
        `<p class="y-chinh">🎯 Devices are everything that is neither CPU nor primary memory: basic I/O such as keyboard, monitor and mouse, plus storage devices such as drives — and "all device interfaces connect to the system buses through a central controller".</p>
<ul>
<li><strong>Basic I/O devices</strong> — "a keyboard, a monitor and a mouse, …". These are the program's link to a human. In C they are reached through <code>stdin</code> and <code>stdout</code>, which is what <code>scanf</code> and <code>printf</code> actually talk to.</li>
<li><strong>Storage devices = secondary storage</strong> — "a floppy drive, a hard drive and a CD-ROM drive". Slower than RAM by orders of magnitude, but non-volatile and much larger. Files (Slot 19–20) live here.</li>
<li><strong>The central controller</strong> — devices do not hang directly off the CPU; their interfaces join the system buses through a controller. That is why adding a new device does not require a new CPU: the controller speaks the bus protocol on the device's behalf.</li>
<li><strong>Why this matters to a C programmer</strong> — device access is slow, so the standard library <em>buffers</em> it. Your <code>printf</code> writes into a memory buffer, and the buffer is flushed to the screen later, in one go. That is a device-speed decision leaking into language behaviour.</li>
<li><strong>The buffering you can observe</strong> — text sitting in a buffer has not reached the device yet:
<pre><code>#include &lt;stdio.h&gt;
int main(void) {
    printf("Working");
    fflush(stdout);   /* force the buffer out to the device NOW */
    /* long computation here */
    printf(" done\\n");
    return 0;
}</code></pre></li>
<li><strong>The memory hierarchy in one line</strong> — registers (fastest, bytes) ⟶ RAM (fast, gigabytes) ⟶ secondary storage (slow, terabytes). Capacity and speed trade off at every step.</li>
</ul>
<p class="dap-an">✅ Đáp án: without <code>fflush(stdout)</code> the word "Working" may not appear until the program ends, because output to a device is buffered in RAM first. Adding a newline usually flushes too, when the stream is line-buffered.</p>
<p class="meo">💡 Classify any component with one question: "can the CPU address it directly on the bus?" Yes ⟹ primary memory. No, it needs a controller ⟹ device.</p>`,
        `<p class="y-chinh">🎯 Thiết bị là mọi thứ không phải CPU và cũng không phải bộ nhớ chính: các thiết bị vào/ra cơ bản như bàn phím, màn hình, chuột, cộng với các thiết bị lưu trữ như ổ đĩa — và "all device interfaces connect to the system buses through a central controller".</p>
<ul>
<li><strong>Thiết bị vào/ra cơ bản</strong> — "a keyboard, a monitor and a mouse, …". Đây là mối liên hệ của chương trình với con người. Trong C, chúng được với tới qua <code>stdin</code> và <code>stdout</code>, tức là thứ mà <code>scanf</code> và <code>printf</code> thực sự nói chuyện cùng.</li>
<li><strong>Thiết bị lưu trữ = bộ nhớ thứ cấp</strong> — "a floppy drive, a hard drive and a CD-ROM drive". Chậm hơn RAM nhiều bậc, nhưng không khả biến và lớn hơn rất nhiều. Tệp tin (Slot 19–20) sống ở đây.</li>
<li><strong>Bộ điều khiển trung tâm</strong> — thiết bị không treo thẳng vào CPU; giao diện của chúng nối vào hệ bus thông qua một bộ điều khiển. Nhờ vậy thêm một thiết bị mới không đòi phải thay CPU mới: bộ điều khiển nói giao thức bus thay cho thiết bị.</li>
<li><strong>Vì sao người viết C cần biết</strong> — truy cập thiết bị thì chậm, nên thư viện chuẩn <em>đệm</em> nó lại. Lệnh <code>printf</code> của bạn ghi vào một vùng đệm trong bộ nhớ, rồi vùng đệm mới được xả ra màn hình sau, một lượt. Đó là một quyết định vì tốc độ thiết bị rò rỉ vào hành vi của ngôn ngữ.</li>
<li><strong>Cái đệm mà bạn quan sát được</strong> — chữ còn nằm trong đệm thì chưa tới thiết bị:
<pre><code>#include &lt;stdio.h&gt;
int main(void) {
    printf("Dang chay");
    fflush(stdout);   /* ép xả đệm ra thiết bị NGAY */
    /* đoạn tính toán dài ở đây */
    printf(" xong\\n");
    return 0;
}</code></pre></li>
<li><strong>Phân cấp bộ nhớ gói trong một dòng</strong> — thanh ghi (nhanh nhất, cỡ byte) ⟶ RAM (nhanh, cỡ gigabyte) ⟶ bộ nhớ thứ cấp (chậm, cỡ terabyte). Dung lượng và tốc độ đánh đổi nhau ở từng bậc.</li>
</ul>
<p class="dap-an">✅ Đáp án: không có <code>fflush(stdout)</code> thì chữ "Dang chay" có thể mãi tới lúc chương trình kết thúc mới hiện, vì dữ liệu ra thiết bị được đệm trong RAM trước. Thêm một ký tự xuống dòng thường cũng xả đệm, khi luồng đang ở chế độ đệm theo dòng.</p>
<p class="meo">💡 Phân loại một linh kiện bất kỳ bằng đúng một câu hỏi: "CPU có đánh địa chỉ thẳng nó trên bus được không?". Được ⟹ bộ nhớ chính. Không, phải qua bộ điều khiển ⟹ thiết bị.</p>`],

      [17, 'Data Units (section divider)',
        `<p class="y-chinh">🎯 A section marker: the next two slides answer "what is the smallest thing a computer can hold, and what sizes do we group them into?"</p>
<ul>
<li><strong>Why the question matters</strong> — every C type is a promise about a number of bytes. <code>char</code> is 1 byte, <code>int</code> is typically 4, <code>double</code> is typically 8. You cannot reason about types without the unit they are counted in.</li>
<li><strong>Slide 18 — the small units</strong> — transistor ⟶ bit ⟶ nibble (4 bits) ⟶ byte (8 bits, and the unit of memory), together with why binary was chosen in the first place.</li>
<li><strong>Slide 19 — the CPU's natural unit</strong> — the word, whose length is the width of a general register: 8, 16 on old CPUs, 32 or 64 on current ones.</li>
<li><strong>The chain to keep</strong> — physical (transistor) ⟶ logical (bit) ⟶ addressable (byte) ⟶ natural (word). Four levels, each defined in terms of the one before.</li>
<li><strong>What comes next</strong> — once we can count bytes, slide 21 gives each of them a number, which is the whole idea of addressing, which is the whole idea of pointers.</li>
</ul>
<p class="meo">💡 The three numbers to have instantly available: <strong>1 nibble = 4 bits · 1 byte = 8 bits = 2 nibbles · 1 byte holds 2^8 = 256 different values (0 to 255)</strong>.</p>`,
        `<p class="y-chinh">🎯 Slide phân mục: hai slide kế tiếp trả lời "thứ nhỏ nhất máy tính giữ được là gì, và ta gộp chúng thành những cỡ nào?"</p>
<ul>
<li><strong>Vì sao câu hỏi này quan trọng</strong> — mọi kiểu dữ liệu trong C đều là một lời hứa về số byte. <code>char</code> là 1 byte, <code>int</code> thường là 4, <code>double</code> thường là 8. Không thể lập luận về kiểu nếu không có đơn vị để đếm.</li>
<li><strong>Slide 18 — các đơn vị nhỏ</strong> — transistor ⟶ bit ⟶ nibble (4 bit) ⟶ byte (8 bit, và là đơn vị của bộ nhớ), kèm lý do vì sao ngay từ đầu người ta chọn hệ nhị phân.</li>
<li><strong>Slide 19 — đơn vị tự nhiên của CPU</strong> — từ máy (word), có độ dài bằng độ rộng của thanh ghi đa dụng: 8, 16 với CPU cũ, 32 hoặc 64 với CPU hiện nay.</li>
<li><strong>Chuỗi cần nhớ</strong> — vật lý (transistor) ⟶ logic (bit) ⟶ đánh địa chỉ được (byte) ⟶ tự nhiên với CPU (word). Bốn bậc, bậc sau định nghĩa dựa trên bậc trước.</li>
<li><strong>Tiếp theo là gì</strong> — một khi đếm được byte thì slide 21 gán cho mỗi byte một con số, đó chính là ý tưởng đánh địa chỉ, và cũng chính là ý tưởng của con trỏ.</li>
</ul>
<p class="meo">💡 Ba con số phải bật ra ngay lập tức: <strong>1 nibble = 4 bit · 1 byte = 8 bit = 2 nibble · 1 byte chứa 2^8 = 256 giá trị khác nhau (0 đến 255)</strong>.</p>`],

      [18, 'Data Units — transistor, bit, nibble, byte',
        `<p class="y-chinh">🎯 The transistor is the basic physical unit for storing data, and it is two-state — so data is stored in binary. One binary digit is a <strong>bit</strong>; 4 bits make a <strong>nibble</strong>; 8 bits make a <strong>byte</strong>, and the byte is the unit of memory.</p>
<ul>
<li><strong>Why binary, historically and physically</strong> — "John von Neumann selected binary (base 2) digits as the EDVAC's fundamental unit", and "the vast majority of modern computers process and store information in binary digits". A transistor is reliably on or off; distinguishing ten voltage levels would be far more error-prone.</li>
<li><strong>Bit</strong> — "We call a binary digit as a bit." One bit has 2 possible states, 0 or 1.</li>
<li><strong>Nibble</strong> — "4 consecutive bits". A nibble maps exactly onto one hexadecimal digit (0–F), which is why hex is the convenient way to write binary: 1111 0000 is F0.</li>
<li><strong>Byte</strong> — "8 consecutive bits = 2 nibbles", and "Unit of memory is BYTE". Memory is addressed per byte, not per bit — that is the fact slide 21 builds on.</li>
<li><strong>The table on the slide, worked</strong> — with 8 bits you can write 2^8 = <strong>256</strong> different patterns, numbered 0 to 255: 00000000 = 0 · 00000001 = 1 · 00000010 = 2 · 00000011 = 3 · 00000100 = 4 · … · 11111111 = 255.</li>
<li><strong>How to convert by hand</strong> — write the place values 128 64 32 16 8 4 2 1 above the bits and add the ones that are on. For 0011 1100: 32 + 16 + 8 + 4 = <strong>60</strong>. For 1111 1111: 128+64+32+16+8+4+2+1 = <strong>255</strong>.</li>
</ul>
<p class="dap-an">✅ Đáp án — the slide's own examples, checked: 00000011 = 2 + 1 = 3 ✓ · 00000100 = 4 ✓ · 11111111 = 255 ✓. But <strong>00111000 = 32 + 16 + 8 = 56, not 104</strong> — the value 104 is 01101000 (64 + 32 + 8). The slide line has a typo; convert it yourself rather than trusting the printed number.</p>
<p class="pitfall">⚠️ Two classic errors. (1) Saying a byte holds "255 values" — it holds <strong>256</strong>, from 0 to 255 inclusive; the off-by-one comes from forgetting that 0 is a value. (2) Confusing bit (b) with byte (B): a 100 Mb/s link moves about 12.5 MB per second, not 100.</p>`,
        `<p class="y-chinh">🎯 Transistor là đơn vị vật lý cơ bản để lưu dữ liệu, và nó chỉ có hai trạng thái — nên dữ liệu được lưu ở dạng nhị phân. Một chữ số nhị phân gọi là <strong>bit</strong>; 4 bit thành một <strong>nibble</strong>; 8 bit thành một <strong>byte</strong>, và byte là đơn vị của bộ nhớ.</p>
<ul>
<li><strong>Vì sao chọn nhị phân, xét về lịch sử lẫn vật lý</strong> — "John von Neumann selected binary (base 2) digits as the EDVAC's fundamental unit", và "the vast majority of modern computers process and store information in binary digits". Transistor thì bật hay tắt đều đáng tin; phân biệt mười mức điện áp sẽ dễ sai hơn rất nhiều.</li>
<li><strong>Bit</strong> — "We call a binary digit as a bit." Một bit có 2 trạng thái khả dĩ, 0 hoặc 1.</li>
<li><strong>Nibble</strong> — "4 consecutive bits". Một nibble ứng đúng một chữ số thập lục phân (0–F), vì vậy hệ 16 là cách viết nhị phân gọn gàng: 1111 0000 chính là F0.</li>
<li><strong>Byte</strong> — "8 consecutive bits = 2 nibbles", và "Unit of memory is BYTE". Bộ nhớ được đánh địa chỉ theo byte, không theo bit — đó là sự thật mà slide 21 dựng lên từ đó.</li>
<li><strong>Bảng trên slide, tính ra</strong> — với 8 bit bạn viết được 2^8 = <strong>256</strong> mẫu khác nhau, đánh số 0 đến 255: 00000000 = 0 · 00000001 = 1 · 00000010 = 2 · 00000011 = 3 · 00000100 = 4 · … · 11111111 = 255.</li>
<li><strong>Cách đổi bằng tay</strong> — viết các trọng số 128 64 32 16 8 4 2 1 lên trên dãy bit rồi cộng những chỗ đang bật. Với 0011 1100: 32 + 16 + 8 + 4 = <strong>60</strong>. Với 1111 1111: 128+64+32+16+8+4+2+1 = <strong>255</strong>.</li>
</ul>
<p class="dap-an">✅ Đáp án — kiểm lại chính các ví dụ của slide: 00000011 = 2 + 1 = 3 ✓ · 00000100 = 4 ✓ · 11111111 = 255 ✓. Nhưng <strong>00111000 = 32 + 16 + 8 = 56, không phải 104</strong> — giá trị 104 ứng với 01101000 (64 + 32 + 8). Dòng đó trên slide bị gõ nhầm; hãy tự đổi ra thay vì tin con số in sẵn.</p>
<p class="pitfall">⚠️ Hai lỗi kinh điển. (1) Nói một byte chứa "255 giá trị" — nó chứa <strong>256</strong> giá trị, từ 0 đến 255 kể cả hai đầu; lệch một là do quên rằng 0 cũng là một giá trị. (2) Lẫn bit (b) với byte (B): đường truyền 100 Mb/s chuyển được khoảng 12,5 MB mỗi giây, không phải 100.</p>`],

      [19, 'Data Units (cont.) — the word',
        `<p class="y-chinh">🎯 "The natural unit of the CPU is a word." The word length is the number of bits in a general register inside the CPU, and it is 8 or 16 on old CPUs, 32 or 64 on current ones.</p>
<ul>
<li><strong>Read the definition precisely</strong> — the word length is defined by the <em>register width</em> ("CPU memory"), not by the memory chip. That is why a "64-bit computer" is a statement about the CPU.</li>
<li><strong>Why it is called "natural"</strong> — the ALU operates on a whole word in one step. Adding two 64-bit numbers on a 64-bit CPU is one instruction; adding two 64-bit numbers on a 32-bit CPU takes several, because the value does not fit in a register.</li>
<li><strong>The historical ladder</strong> — 8 bits (Intel 8080 era) ⟶ 16 bits (8086, the original PC) ⟶ 32 bits (80386 through the Pentium era) ⟶ 64 bits (today). Each step doubled both the arithmetic width and the addressing reach.</li>
<li><strong>Word length versus byte</strong> — the byte is the unit you <em>address</em>; the word is the unit the CPU <em>computes</em> with. Memory is byte-addressed even on a 64-bit machine; the CPU just fetches 8 bytes at a time.</li>
<li><strong>How C exposes it</strong> — this is why C does not promise a fixed size for <code>int</code>. The standard says only "at least 16 bits" and "the natural size suggested by the architecture":
<pre><code>#include &lt;stdio.h&gt;
int main(void) {
    printf("char=%d int=%d long=%d ptr=%d\\n",
           (int) sizeof(char), (int) sizeof(int),
           (int) sizeof(long), (int) sizeof(void *));
    return 0;   /* typical 64-bit Linux: 1 4 8 8 */
}</code></pre></li>
<li><strong>The pointer is the giveaway</strong> — <code>sizeof(void *)</code> tells you the address width: 4 bytes on a 32-bit build, 8 bytes on a 64-bit build. That is the link to slide 21.</li>
</ul>
<p class="dap-an">✅ Đáp án: word length = width of a general register. 8/16 bits historically, 32/64 today. Byte = unit of addressing (always 8 bits); word = unit of computation (machine-dependent).</p>
<p class="pitfall">⚠️ Trap: assuming <code>int</code> is always 4 bytes and writing code that depends on it. On a 16-bit embedded target <code>int</code> is 2 bytes, so <code>int</code> overflows at 32,767 and a loop counting to 50,000 never terminates. Use <code>sizeof</code>, or the fixed-width types of <code>&lt;stdint.h&gt;</code>.</p>`,
        `<p class="y-chinh">🎯 "The natural unit of the CPU is a word." Độ dài từ máy là số bit của một thanh ghi đa dụng bên trong CPU, và nó là 8 hoặc 16 với CPU cũ, 32 hoặc 64 với CPU hiện nay.</p>
<ul>
<li><strong>Đọc định nghĩa cho chính xác</strong> — độ dài từ máy được định nghĩa bởi <em>độ rộng thanh ghi</em> ("CPU memory"), không phải bởi chip nhớ. Vì thế "máy tính 64 bit" là một phát biểu về CPU.</li>
<li><strong>Vì sao gọi là "tự nhiên"</strong> — ALU xử lý trọn một từ máy trong một bước. Cộng hai số 64 bit trên CPU 64 bit là một lệnh; cộng hai số 64 bit trên CPU 32 bit phải mất mấy lệnh, vì giá trị không lọt vào một thanh ghi.</li>
<li><strong>Bậc thang lịch sử</strong> — 8 bit (thời Intel 8080) ⟶ 16 bit (8086, chiếc PC đầu tiên) ⟶ 32 bit (80386 tới thời Pentium) ⟶ 64 bit (ngày nay). Mỗi bậc nhân đôi cả độ rộng tính toán lẫn tầm đánh địa chỉ.</li>
<li><strong>Từ máy so với byte</strong> — byte là đơn vị để <em>đánh địa chỉ</em>; từ máy là đơn vị để CPU <em>tính toán</em>. Bộ nhớ vẫn đánh địa chỉ theo byte kể cả trên máy 64 bit; CPU chỉ đơn giản là nạp 8 byte một lượt.</li>
<li><strong>C phơi bày điều đó ra sao</strong> — đây là lý do C không hứa hẹn kích thước cố định cho <code>int</code>. Chuẩn chỉ nói "ít nhất 16 bit" và "kích thước tự nhiên mà kiến trúc gợi ý":
<pre><code>#include &lt;stdio.h&gt;
int main(void) {
    printf("char=%d int=%d long=%d ptr=%d\\n",
           (int) sizeof(char), (int) sizeof(int),
           (int) sizeof(long), (int) sizeof(void *));
    return 0;   /* Linux 64 bit điển hình: 1 4 8 8 */
}</code></pre></li>
<li><strong>Con trỏ là chỗ lộ ra rõ nhất</strong> — <code>sizeof(void *)</code> cho biết độ rộng địa chỉ: 4 byte khi dựng ở chế độ 32 bit, 8 byte khi dựng ở chế độ 64 bit. Đó là đường nối sang slide 21.</li>
</ul>
<p class="dap-an">✅ Đáp án: độ dài từ máy = độ rộng của một thanh ghi đa dụng. Lịch sử là 8/16 bit, ngày nay là 32/64 bit. Byte = đơn vị đánh địa chỉ (luôn 8 bit); word = đơn vị tính toán (phụ thuộc máy).</p>
<p class="pitfall">⚠️ Bẫy: mặc định <code>int</code> luôn là 4 byte rồi viết mã dựa vào đó. Trên hệ nhúng 16 bit thì <code>int</code> chỉ 2 byte, nên <code>int</code> tràn ở 32.767 và vòng lặp đếm tới 50.000 sẽ không bao giờ dừng. Hãy dùng <code>sizeof</code>, hoặc các kiểu cố định độ rộng trong <code>&lt;stdint.h&gt;</code>.</p>`],

      [20, 'Addressing Information (section divider)',
        `<p class="y-chinh">🎯 A section marker: having established the byte, the deck now gives every byte a number. That number is an <em>address</em>, and addresses are the single most important idea in C.</p>
<ul>
<li><strong>The one-sentence preview</strong> — memory is a very long row of numbered boxes, each holding exactly one byte; the number on the box is its address, and addresses start at zero.</li>
<li><strong>Why C students must own this</strong> — <code>&amp;x</code> means "the address of x"; a pointer variable stores an address; an array name decays to the address of its first element; <code>scanf</code> needs addresses so it can write into your variables. All four are the same idea.</li>
<li><strong>What slide 21 adds</strong> — the size table (KB, MB, GB, TB, PB, EB) and the rule that the maximum addressable memory depends on the size of the address registers.</li>
<li><strong>Where it comes back later</strong> — Slot 10 (pointers), Slot 13–15 (arrays and structs, which are contiguous blocks of addresses), Slot 16–18 (strings, which are arrays of char ending in the zero byte).</li>
<li><strong>Two words to keep apart from now on</strong> — the <em>address</em> of a cell and the <em>value</em> stored in it. Mixing them up is the number-one source of pointer bugs, and slide 21 draws them as two separate columns for exactly that reason.</li>
</ul>
<p class="meo">💡 Picture a street of houses: the house number is the address, the family living there is the value. Two families can be identical; two houses can never share a number.</p>`,
        `<p class="y-chinh">🎯 Slide phân mục: sau khi đã chốt được byte, bộ slide bây giờ gán cho mỗi byte một con số. Con số đó là <em>địa chỉ</em>, và địa chỉ là ý tưởng quan trọng bậc nhất trong C.</p>
<ul>
<li><strong>Xem trước trong một câu</strong> — bộ nhớ là một dãy rất dài các ô có đánh số, mỗi ô chứa đúng một byte; con số ghi trên ô là địa chỉ của nó, và địa chỉ bắt đầu từ không.</li>
<li><strong>Vì sao sinh viên C phải làm chủ chỗ này</strong> — <code>&amp;x</code> nghĩa là "địa chỉ của x"; biến con trỏ lưu một địa chỉ; tên mảng suy biến thành địa chỉ phần tử đầu; <code>scanf</code> cần địa chỉ để ghi được vào biến của bạn. Cả bốn đều là cùng một ý tưởng.</li>
<li><strong>Slide 21 bổ sung thêm gì</strong> — bảng đơn vị (KB, MB, GB, TB, PB, EB) và quy tắc rằng dung lượng bộ nhớ tối đa đánh địa chỉ được phụ thuộc vào kích thước của thanh ghi địa chỉ.</li>
<li><strong>Nó quay lại ở đâu về sau</strong> — Slot 10 (con trỏ), Slot 13–15 (mảng và struct, vốn là các khối địa chỉ liền nhau), Slot 16–18 (chuỗi, vốn là mảng char kết thúc bằng byte 0).</li>
<li><strong>Hai từ phải tách bạch từ đây trở đi</strong> — <em>địa chỉ</em> của một ô và <em>giá trị</em> chứa trong ô đó. Nhầm lẫn hai thứ này là nguồn gốc số một của lỗi con trỏ, và slide 21 vẽ chúng thành hai cột riêng cũng đúng vì lý do đó.</li>
</ul>
<p class="meo">💡 Hình dung một dãy nhà mặt phố: số nhà là địa chỉ, gia đình đang ở trong là giá trị. Hai gia đình có thể giống hệt nhau; hai căn nhà thì không bao giờ trùng số.</p>`],

      [21, 'Addressing Information — addresses and memory sizes',
        `<p class="y-chinh">🎯 "Each byte of primary memory has a unique address (order number), starting from zero", and "the maximum size of addressable primary memory depends upon the size of the address registers".</p>
<ul>
<li><strong>Read the memory diagram on the slide</strong> — two columns, Address and Value: address 0 holds 0100 0001 · 1 holds 1100 1011 · 2 holds 1001 0000 · 3 holds 0101 0100 · 4 holds 0011 1100 · 5 holds 1010 1010. One byte per address, addresses counted 0, 1, 2, … with no gaps.</li>
<li><strong>Decoding those values</strong> — 0100 0001 = 65, which in ASCII is the letter 'A' · 0011 1100 = 60 · 1010 1010 = 170 · 1100 1011 = 203 · 1001 0000 = 144 · 0101 0100 = 84 = 'T'. Same bits, different meanings — slide 5 again.</li>
<li><strong>The size table</strong> — KiloByte (KB) = 1,024 Byte · MegaByte (MB) = 1,024 KB · GigaByte (GB) = 1,024 MB · TeraByte (TB) = 1,024 GB · PetaByte (PB) = 1,024 TB · ExaByte (EB) = 1,024 PB. The step is 1,024 = 2^10, not 1,000, because addresses are binary.</li>
<li><strong>Addressable memory, worked</strong> — with an address register of n bits there are 2^n distinct addresses, one byte each. n = 16 ⟹ 2^16 = 65,536 bytes = <strong>64 KB</strong>. n = 20 ⟹ 2^20 = <strong>1 MB</strong> (the original PC). n = 32 ⟹ 2^32 = 4,294,967,296 bytes = <strong>4 GB</strong>. n = 64 ⟹ 2^64 = <strong>16 EB</strong>.</li>
<li><strong>Why old 32-bit Windows could not use 8 GB of RAM</strong> — not a licensing limit but arithmetic: 32-bit addresses simply cannot name a byte beyond the 4 GB mark, and part of that range is reserved for devices.</li>
<li><strong>Seeing addresses from C</strong> — <code>&amp;</code> yields the address, <code>%p</code> prints it:
<pre><code>#include &lt;stdio.h&gt;
int main(void) {
    int a = 65;
    printf("value = %d, address = %p\\n", a, (void *) &amp;a);
    return 0;
}</code></pre></li>
</ul>
<p class="dap-an">✅ Đáp án — the key exercise: how much memory can a CPU with 32-bit address registers address? 2^32 bytes = 4,294,967,296 bytes = 4,194,304 KB = 4,096 MB = <strong>4 GB</strong>. Divide by 1,024 three times, never by 1,000.</p>
<p class="pitfall">⚠️ Two traps. (1) Using 1,000 instead of 1,024 — that is the disk-manufacturer convention (SI), not the addressing convention. (2) Expecting the printed address to be the same on every run: modern systems randomise layout, so the number changes each time while the <em>relationship</em> between addresses does not.</p>`,
        `<p class="y-chinh">🎯 "Each byte of primary memory has a unique address (order number), starting from zero", và "the maximum size of addressable primary memory depends upon the size of the address registers".</p>
<ul>
<li><strong>Đọc sơ đồ bộ nhớ trên slide</strong> — hai cột, Address và Value: địa chỉ 0 chứa 0100 0001 · 1 chứa 1100 1011 · 2 chứa 1001 0000 · 3 chứa 0101 0100 · 4 chứa 0011 1100 · 5 chứa 1010 1010. Mỗi địa chỉ đúng một byte, địa chỉ đếm 0, 1, 2, … liền mạch không đứt quãng.</li>
<li><strong>Giải mã các giá trị đó</strong> — 0100 0001 = 65, trong ASCII là chữ 'A' · 0011 1100 = 60 · 1010 1010 = 170 · 1100 1011 = 203 · 1001 0000 = 144 · 0101 0100 = 84 = 'T'. Cùng các bit, khác ý nghĩa — lại đúng slide 5.</li>
<li><strong>Bảng đơn vị</strong> — KiloByte (KB) = 1.024 Byte · MegaByte (MB) = 1.024 KB · GigaByte (GB) = 1.024 MB · TeraByte (TB) = 1.024 GB · PetaByte (PB) = 1.024 TB · ExaByte (EB) = 1.024 PB. Bước nhảy là 1.024 = 2^10, không phải 1.000, vì địa chỉ là nhị phân.</li>
<li><strong>Bộ nhớ đánh địa chỉ được, tính ra</strong> — với thanh ghi địa chỉ n bit thì có 2^n địa chỉ khác nhau, mỗi địa chỉ một byte. n = 16 ⟹ 2^16 = 65.536 byte = <strong>64 KB</strong>. n = 20 ⟹ 2^20 = <strong>1 MB</strong> (chiếc PC đầu tiên). n = 32 ⟹ 2^32 = 4.294.967.296 byte = <strong>4 GB</strong>. n = 64 ⟹ 2^64 = <strong>16 EB</strong>.</li>
<li><strong>Vì sao Windows 32 bit ngày xưa không dùng nổi 8 GB RAM</strong> — không phải giới hạn bản quyền mà là số học: địa chỉ 32 bit đơn giản là không gọi tên nổi một byte nằm quá mốc 4 GB, mà một phần dải đó còn bị dành cho thiết bị.</li>
<li><strong>Nhìn thấy địa chỉ từ C</strong> — <code>&amp;</code> cho ra địa chỉ, <code>%p</code> in nó ra:
<pre><code>#include &lt;stdio.h&gt;
int main(void) {
    int a = 65;
    printf("gia tri = %d, dia chi = %p\\n", a, (void *) &amp;a);
    return 0;
}</code></pre></li>
</ul>
<p class="dap-an">✅ Đáp án — bài tập then chốt: CPU có thanh ghi địa chỉ 32 bit thì đánh địa chỉ được bao nhiêu bộ nhớ? 2^32 byte = 4.294.967.296 byte = 4.194.304 KB = 4.096 MB = <strong>4 GB</strong>. Chia cho 1.024 ba lần, tuyệt đối không chia cho 1.000.</p>
<p class="pitfall">⚠️ Hai bẫy. (1) Dùng 1.000 thay cho 1.024 — đó là quy ước của nhà sản xuất ổ đĩa (hệ SI), không phải quy ước đánh địa chỉ. (2) Trông chờ địa chỉ in ra giống nhau ở mọi lần chạy: hệ điều hành hiện đại xáo trộn bố cục bộ nhớ, nên con số đổi mỗi lần trong khi <em>quan hệ</em> giữa các địa chỉ thì không đổi.</p>`],

      [22, 'Program Instructions (section divider)',
        `<p class="y-chinh">🎯 A section marker, and the hinge of the whole deck: we have numbered the bytes, and now we look at the bytes that are <em>instructions</em> rather than data.</p>
<ul>
<li><strong>Why this is the hinge</strong> — slide 8 said "program = data + instructions". Slides 18–21 handled the data half. From here on, the deck handles the instruction half, all the way up to C source code on slide 44.</li>
<li><strong>The key realisation</strong> — instructions are stored in the same memory, with the same kind of addresses, as data. That is the von Neumann idea: a machine that can be reprogrammed by loading different bytes, rather than rewired.</li>
<li><strong>Slide 23 — the anatomy</strong> — every instruction is an operation plus operands, and operands may be constants, registers, or primary memory addresses.</li>
<li><strong>Slides 24–25 (second half of the deck)</strong> — creating and running your first C file in Dev-C++, and a further look at instructions.</li>
<li><strong>What it explains later</strong> — once you accept that instructions are just numbered bytes, the compiler on slides 30–33 becomes easy to understand: its job is to produce the right bytes, in the right order, at the right addresses.</li>
</ul>
<p class="meo">💡 The sentence to carry forward: <em>to the hardware there is no difference between an instruction and a number — the difference is only which register is pointing at it.</em></p>`,
        `<p class="y-chinh">🎯 Slide phân mục, và cũng là bản lề của cả bộ slide: ta đã đánh số các byte, giờ nhìn sang những byte là <em>lệnh</em> chứ không phải dữ liệu.</p>
<ul>
<li><strong>Vì sao đây là bản lề</strong> — slide 8 nói "chương trình = dữ liệu + lệnh". Slide 18–21 lo nửa dữ liệu. Từ đây trở đi bộ slide lo nửa lệnh, chạy một mạch lên tới mã nguồn C ở slide 44.</li>
<li><strong>Nhận thức mấu chốt</strong> — lệnh được lưu trong cùng bộ nhớ, với cùng kiểu địa chỉ, như dữ liệu. Đó chính là ý tưởng von Neumann: một cỗ máy lập trình lại được bằng cách nạp bộ byte khác, thay vì phải đi đấu lại dây.</li>
<li><strong>Slide 23 — phần giải phẫu</strong> — mọi lệnh đều gồm một thao tác cộng các toán hạng, và toán hạng có thể là hằng số, thanh ghi, hoặc địa chỉ bộ nhớ chính.</li>
<li><strong>Slide 24–25 (thuộc nửa sau bộ slide)</strong> — tạo và chạy tệp C đầu tiên bằng Dev-C++, và nhìn kỹ thêm về lệnh.</li>
<li><strong>Nó giải thích được gì về sau</strong> — một khi chấp nhận rằng lệnh cũng chỉ là những byte có đánh số, thì trình biên dịch ở slide 30–33 trở nên dễ hiểu: việc của nó là sinh ra đúng bộ byte, đúng thứ tự, đặt vào đúng địa chỉ.</li>
</ul>
<p class="meo">💡 Câu cần mang theo: <em>với phần cứng thì lệnh và con số không khác gì nhau — khác nhau chỉ ở chỗ thanh ghi nào đang trỏ vào nó.</em></p>`],

      [23, 'Program Instructions — opcode and operands',
        `<p class="y-chinh">🎯 "Each program instruction consists of an operation and operands." The CPU performs the operation on the values stored <em>as</em> operands, or on the values stored <em>at</em> the operand addresses.</p>
<ul>
<li><strong>The layout drawn on the slide</strong> — three fields side by side: <strong>Opcode</strong> 01001011, then <strong>Operand 1</strong> 100110110110, then <strong>Operand 2</strong> 011011010111. That whole bit string is one instruction sitting in memory.</li>
<li><strong>Opcode = "operation code"</strong> — the number that says <em>which</em> operation: add, subtract, compare, jump, load, store. Here the 8-bit opcode 01001011 = 75 in decimal; an 8-bit opcode field allows up to 2^8 = 256 distinct operations.</li>
<li><strong>Operands = what it operates on</strong> — the slide lists exactly three kinds: <em>constants</em> (the value is right there in the instruction), <em>registers</em> (the value is in the CPU), and <em>primary memory addresses</em> (the value must be fetched over the buses, using the three steps of slide 13).</li>
<li><strong>The crucial distinction</strong> — "on the values stored as operands or on the values stored in the operand addresses". A constant operand <em>is</em> the value; an address operand <em>points at</em> the value. This is the address/value split of slide 20, appearing at hardware level — and it is precisely what a C pointer is.</li>
<li><strong>Width arithmetic, worked</strong> — the drawn instruction is 8 + 12 + 12 = <strong>32 bits = 4 bytes</strong>. A 12-bit operand field can name 2^12 = 4,096 different addresses or registers. Widen the operand field and you can reach more memory but each instruction costs more bytes — a real design trade-off.</li>
<li><strong>How one C line becomes instructions</strong> — <code>s = a + b;</code> typically compiles to roughly four machine instructions:
<pre><code>/* C:                 s = a + b;                       */
/* conceptual machine code:                            */
/*   LOAD  R1, [addr_of_a]    opcode + register + address */
/*   LOAD  R2, [addr_of_b]                              */
/*   ADD   R1, R2             opcode + register + register */
/*   STORE [addr_of_s], R1                              */</code></pre>
Each line is one opcode plus its operands; the ALU of slide 14 performs only the ADD.</li>
</ul>
<p class="dap-an">✅ Đáp án: an instruction = opcode (which operation) + operands (constants, registers, or memory addresses). The slide's example is 8 + 12 + 12 = 32 bits; its opcode 01001011 is decimal 75; and "values stored in the operand addresses" is the hardware ancestor of the C pointer.</p>
<p class="pitfall">⚠️ Exam trap: answering "an instruction contains data". Be precise — it contains an <em>operation code</em> and <em>operands</em>, and an operand may be a value itself or the <em>address</em> of a value. Those two cases behave completely differently, and mixing them up at the C level is exactly how you write <code>scanf("%d", n)</code> instead of <code>scanf("%d", &amp;n)</code>.</p>`,
        `<p class="y-chinh">🎯 "Each program instruction consists of an operation and operands." CPU thực hiện thao tác trên các giá trị được lưu <em>làm</em> toán hạng, hoặc trên các giá trị được lưu <em>tại</em> địa chỉ toán hạng.</p>
<ul>
<li><strong>Bố cục vẽ trên slide</strong> — ba trường nằm cạnh nhau: <strong>Opcode</strong> 01001011, rồi <strong>Operand 1</strong> 100110110110, rồi <strong>Operand 2</strong> 011011010111. Toàn bộ chuỗi bit đó là một lệnh đang nằm trong bộ nhớ.</li>
<li><strong>Opcode = "mã thao tác"</strong> — con số cho biết <em>thao tác nào</em>: cộng, trừ, so sánh, nhảy, nạp, lưu. Ở đây opcode 8 bit 01001011 = 75 ở hệ thập phân; một trường opcode 8 bit cho phép tối đa 2^8 = 256 thao tác khác nhau.</li>
<li><strong>Toán hạng = thứ bị thao tác lên</strong> — slide liệt kê đúng ba loại: <em>hằng số</em> (giá trị nằm ngay trong lệnh), <em>thanh ghi</em> (giá trị nằm trong CPU), và <em>địa chỉ bộ nhớ chính</em> (giá trị phải được nạp về qua các bus, theo đúng ba bước của slide 13).</li>
<li><strong>Phân biệt cốt tử</strong> — "on the values stored as operands or on the values stored in the operand addresses". Toán hạng hằng số <em>chính là</em> giá trị; toán hạng địa chỉ thì <em>trỏ tới</em> giá trị. Đây đúng là phép tách địa chỉ/giá trị của slide 20 hiện ra ở mức phần cứng — và cũng chính xác là bản chất của con trỏ trong C.</li>
<li><strong>Tính độ rộng, làm ra số</strong> — lệnh được vẽ có 8 + 12 + 12 = <strong>32 bit = 4 byte</strong>. Trường toán hạng 12 bit gọi tên được 2^12 = 4.096 địa chỉ hoặc thanh ghi khác nhau. Nới trường toán hạng ra thì với tới được nhiều bộ nhớ hơn nhưng mỗi lệnh lại tốn thêm byte — một đánh đổi thiết kế có thật.</li>
<li><strong>Một dòng C biến thành lệnh máy ra sao</strong> — <code>s = a + b;</code> thường được biên dịch thành khoảng bốn lệnh máy:
<pre><code>/* C:                 s = a + b;                          */
/* mã máy dạng khái niệm:                                 */
/*   LOAD  R1, [dia_chi_cua_a]   opcode + thanh ghi + địa chỉ */
/*   LOAD  R2, [dia_chi_cua_b]                             */
/*   ADD   R1, R2                opcode + thanh ghi + thanh ghi */
/*   STORE [dia_chi_cua_s], R1                             */</code></pre>
Mỗi dòng là một opcode cộng các toán hạng của nó; ALU ở slide 14 chỉ thực hiện đúng phép ADD.</li>
</ul>
<p class="dap-an">✅ Đáp án: một lệnh = opcode (thao tác nào) + toán hạng (hằng số, thanh ghi, hoặc địa chỉ bộ nhớ). Ví dụ trên slide là 8 + 12 + 12 = 32 bit; opcode 01001011 của nó là 75 ở hệ thập phân; và "giá trị lưu tại địa chỉ toán hạng" chính là tổ tiên phần cứng của con trỏ trong C.</p>
<p class="pitfall">⚠️ Bẫy thi: trả lời "một lệnh chứa dữ liệu". Phải nói cho chính xác — nó chứa một <em>mã thao tác</em> và các <em>toán hạng</em>, mà toán hạng có thể là chính giá trị hoặc là <em>địa chỉ</em> của giá trị. Hai trường hợp đó hành xử khác hẳn nhau, và lẫn lộn chúng ở mức C chính là cách người ta viết <code>scanf("%d", n)</code> thay vì <code>scanf("%d", &amp;n)</code>.</p>`],

    ]),
  ].join('\n'),
};
