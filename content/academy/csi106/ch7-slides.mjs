/**
 * CSI106 · Chương 7 — Programming, học theo từng slide: TOÀN BỘ 25 slide.
 * Deck 'csi7' (CSI7), 25 slide, ảnh đã render lên CDN images/academy/CSI106/v1/csi7/NNN.webp.
 *
 * Nội dung bám ĐÚNG chữ trích từ CSI_07.pptx của trường (/tmp/csi106-text/csi7.txt).
 * Các slide mà phần quan trọng nằm trong HÌNH/BẢNG (5, 6, 7, 8, 11, 13, 14, 15, 16, 17,
 * 20, 21, 22, 23, 24, 25) đã được đọc thẳng từ ảnh đã render để lấy đúng từng nhãn.
 *
 * MỌI đoạn mã trong bài đều đã CHẠY THẬT trước khi viết vào (Apple clang 17.0.0 arm64,
 * Python 3.14.6, OpenJDK 21.0.9, sqlite3 của macOS):
 *   · bốn bước dịch cc -E / -S / -c / (link) trên add.c → kích thước thật 122 / 31.589 /
 *     1.312 / 864 / 33.456 byte, assembly thật chép từ add.s
 *   · lỗi cú pháp dòng cuối: C không sinh ra file chạy nào, Python in hết 2 dòng đầu rồi mới chết
 *   · bốn paradigm cùng giải bài "tổng số chẵn của [7,11,8,9,10,6]" → cả bốn đều ra 24
 *   · clang -Xclang -dump-tokens (bộ phân tích từ vựng thật), javap -c (bytecode thật),
 *     objdump -d (mã máy thật), python3 -m dis
 *   · đo thời gian C vs Python cùng vòng lặp 50 triệu: 0,05 s vs ~3,2 s
 *
 * Những chỗ SLIDE GỐC SAI hoặc tự mâu thuẫn — đã nêu rõ trong bài, KHÔNG im lặng chép lại
 * và KHÔNG tự ý sửa slide:
 *   · slide 6 thân bài ghi "Table 8.1" trong khi chú thích hình ghi "Table 7.1".
 *   · slide 7 thân bài ghi "Table 8.2" và "Table 9.2"; chú thích ghi "Table 7.2 Code in
 *     machine language" — nhưng bảng đó là HỢP NGỮ, không phải mã máy.
 *   · slide 8 thân bài ghi "Figure 8-3"; chú thích ghi "Figure 7.2 Code in machine language"
 *     — nhưng hình đó là mã C++.
 *   · slide 11 chú thích hình ghi "Figure 7.3 Evolution of programing" — chép lại nhầm chú
 *     thích của Figure 7.1; hình thật vẽ quy trình dịch.
 *   · slide 16 chú thích ghi "Figure 7.7 The concept of an object-oriented paradigm" —
 *     sai, hình đó là hộp đen của paradigm HÀM.
 *   · slide 6 và slide 7 cùng đánh số mục "2."; slide 23 và 24 cùng đánh số "5."; slide 25
 *     nhảy lên "7." nên mục "6." không tồn tại trong deck.
 *   · slide 5 hình trộn lẫn THẾ HỆ ngôn ngữ (máy, hợp ngữ) với MÔ HÌNH lập trình (thủ tục,
 *     có cấu trúc, hướng đối tượng) trên cùng một mũi tên.
 *   · slide 21 sơ đồ kiểu dữ liệu Java có hai nút cùng tên "Integer" lồng nhau, và xếp
 *     char nằm dưới nhánh Integer.
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'csi7';

export default {
  title: '7.0 — Slide by slide: Translation and programming paradigms (25 slides)|||7.0 — Slide bài giảng: Dịch chương trình & các mô hình lập trình (25 slide)',
  slug: 'csi106-7-0-slides-dich-chuong-trinh-paradigm',
  type: 'DOCUMENT',
  description: 'Toàn bộ 25 slide Chương 7 của CSI106 (buổi 31–32, CLO7, câu hỏi định hướng CQ11.1–CQ11.4): ba thế hệ ngôn ngữ, bốn bước dịch một chương trình C, biên dịch so với thông dịch, bốn mô hình lập trình, và các khái niệm chung. Mọi ví dụ trong bài đều được chạy thật — bốn bước cc -E / -S / -c / liên kết trên một chương trình C nhỏ kèm kích thước thật của từng file trung gian, cùng một bài toán giải bằng cả bốn paradigm và cả bốn cùng ra 24, lỗi cú pháp dòng cuối chứng minh C không chạy được dòng nào còn Python chạy tới đó mới chết.',
  content: [
    walkHead(D, 1, 25),
    walk(D, [

      [1, '7. Programming',
        `<p class="y-chinh">🎯 The title slide of Chapter 7. After six chapters about what a machine <em>is</em>, this chapter is about the only thing that makes it useful: the <strong>program</strong> — where programming languages came from, how a language a human can read becomes something a CPU can run, and the four fundamentally different ways of thinking about "solving a problem with code".</p>
<ul>
<li><strong>Where it sits in the textbook</strong> — this deck is Forouzan, <em>Foundations of Computer Science</em>, <strong>Chapter 9 "Programming Languages"</strong>, renumbered to 7 for this course. That renumbering is not cosmetic: several slides still carry the old numbers in their body text ("Table 8.1", "Table 8.2", "Table 9.2", "Figure 8-3"), which is a trap explained on the slides where it appears.</li>
<li><strong>Where it sits in the syllabus</strong> — sessions 31–32, learning outcome <strong>CLO7</strong>, and the guiding questions CQ11.1 (evolution of languages), CQ11.2 (compiler vs interpreter), CQ11.3 (the four paradigms), CQ11.4 (common concepts). Those four questions are literally the four sections of slide 2.</li>
<li><strong>Two halves, very different in difficulty</strong> — sections 7.1 and 7.4 (evolution, common concepts) are pure recall. Sections 7.2 and 7.3 (translation, paradigms) are where the marks are lost, because they require you to <em>distinguish</em> things that sound alike: compiler vs interpreter, procedural vs object-oriented, functional vs declarative.</li>
<li><strong>The connection to PRF192</strong> — every time you typed <code>cc prog.c</code> you ran the whole of section 7.2 without seeing it. This chapter opens that command up into four separate steps, and once you have seen them, two classes of error you used to find mysterious become obvious: "undeclared function" and "undefined symbol".</li>
<li><strong>What the exam actually asks from this chapter</strong> — historically: one question on the three generations, one on compiler vs interpreter, one or two on naming/matching the four paradigms, and one on identifiers/literals/constants. All short-answer or multiple choice; no code writing.</li>
</ul>
<p class="meo">💡 Read the whole chapter with one question in your hand: <em>"at which moment does this happen — when I write, when I translate, or when I run?"</em> Almost every trap in Chapter 7 is a confusion between those three moments.</p>`,
        `<p class="y-chinh">🎯 Slide tiêu đề Chương 7. Sau sáu chương nói máy tính <em>là cái gì</em>, chương này nói về thứ duy nhất làm nó có ích: <strong>chương trình</strong> — ngôn ngữ lập trình từ đâu ra, làm sao thứ con người đọc được biến thành thứ CPU chạy được, và bốn lối nghĩ khác nhau tận gốc về chuyện "giải bài toán bằng mã".</p>
<ul>
<li><strong>Nó nằm ở đâu trong giáo trình</strong> — bộ slide này là Forouzan, <em>Foundations of Computer Science</em>, <strong>Chương 9 "Programming Languages"</strong>, được đánh lại số thành 7 cho môn học. Việc đánh lại số không vô hại: nhiều slide vẫn còn số cũ nằm trong thân bài ("Table 8.1", "Table 8.2", "Table 9.2", "Figure 8-3"), và đó là một cái bẫy sẽ được chỉ ra ngay tại slide có nó.</li>
<li><strong>Nó nằm ở đâu trong đề cương</strong> — buổi 31–32, chuẩn đầu ra <strong>CLO7</strong>, và các câu hỏi định hướng CQ11.1 (tiến hoá ngôn ngữ), CQ11.2 (trình biên dịch và trình thông dịch), CQ11.3 (bốn paradigm), CQ11.4 (các khái niệm chung). Bốn câu hỏi ấy đúng là bốn mục trên slide 2.</li>
<li><strong>Hai nửa, độ khó khác hẳn nhau</strong> — mục 7.1 và 7.4 (tiến hoá, khái niệm chung) là thuần học thuộc. Mục 7.2 và 7.3 (dịch, paradigm) mới là chỗ mất điểm, vì chúng đòi bạn <em>phân biệt</em> những thứ nghe na ná nhau: biên dịch với thông dịch, thủ tục với hướng đối tượng, hàm với khai báo.</li>
<li><strong>Nối với PRF192</strong> — mỗi lần bạn gõ <code>cc prog.c</code> là bạn đã chạy trọn mục 7.2 mà không nhìn thấy nó. Chương này mở lệnh ấy ra thành bốn bước riêng, và khi đã thấy bốn bước thì hai loại lỗi bạn từng thấy khó hiểu bỗng thành hiển nhiên: "undeclared function" và "undefined symbol".</li>
<li><strong>Đề thi thật sự hỏi gì ở chương này</strong> — theo lệ: một câu về ba thế hệ ngôn ngữ, một câu biên dịch/thông dịch, một hai câu gọi tên hoặc ghép cặp bốn paradigm, và một câu về định danh/literal/hằng. Toàn trả lời ngắn hoặc trắc nghiệm; không có câu viết mã.</li>
</ul>
<p class="meo">💡 Hãy đọc cả chương với một câu hỏi cầm sẵn trong tay: <em>"việc này xảy ra ở THỜI ĐIỂM nào — lúc viết, lúc dịch, hay lúc chạy?"</em> Gần như mọi cái bẫy của Chương 7 đều là sự lẫn lộn giữa ba thời điểm đó.</p>`],

      [2, 'Content',
        `<p class="y-chinh">🎯 Four sections, and they map one-to-one onto the four guiding questions of the syllabus. Treat this slide as the exam blueprint: four sections, four question types.</p>
<ul>
<li><strong>7.1 Evolution</strong> (slides 4–8) — three generations of language: machine, assembly, high-level. The whole section is one argument: each generation was invented to remove a specific pain of the previous one. Slides 6, 7 and 8 solve the <em>same</em> task ("read two integers, add them, print the result") three times, once per generation. That repetition is deliberate and it is the best thing in the chapter.</li>
<li><strong>7.2 Translation</strong> (9–11) — source program → object program, by <em>compilation</em> or by <em>interpretation</em>, and the four phases inside a compiler (lexical, syntax, semantic, code generation). CQ11.2 lives here.</li>
<li><strong>7.3 Programming paradigms</strong> (12–17) — procedural, object-oriented, functional, declarative. Four slides of concept plus one figure each.</li>
<li><strong>7.4 Common concepts</strong> (18–25) — identifiers, data types, variables, literals, constants, input/output. This is a rapid tour of things you already do in C; the value is in the vocabulary, because the exam uses these words precisely.</li>
<li><strong>What is NOT in this deck, though Forouzan has it</strong> — the original chapter also covers statements, subprograms (parameter passing by value and by reference), and a long section on Java as an object-oriented example. The deck stops at input/output. Do not be surprised by the abrupt ending of slide 25; nothing was lost, it was cut.</li>
</ul>
<p class="pitfall">⚠️ Notice that section 7.1 says "Evolution" and section 7.3 says "paradigms", and the figure on slide 5 mixes them on one arrow. <em>Generation</em> (machine / assembly / high-level) and <em>paradigm</em> (procedural / OO / functional / declarative) are two completely different classifications of the same set of languages. C and Java are both high-level (same generation) but different paradigms; C and Prolog are both high-level but sit at opposite ends of the paradigm list.</p>`,
        `<p class="y-chinh">🎯 Bốn mục, và chúng ứng một-một với bốn câu hỏi định hướng của đề cương. Hãy coi slide này là bản thiết kế đề thi: bốn mục, bốn dạng câu hỏi.</p>
<ul>
<li><strong>7.1 Evolution</strong> (slide 4–8) — ba thế hệ ngôn ngữ: mã máy, hợp ngữ, bậc cao. Cả mục chỉ có một lập luận: mỗi thế hệ sinh ra để gỡ một nỗi khổ cụ thể của thế hệ trước. Slide 6, 7 và 8 giải <em>cùng một</em> bài toán ("đọc hai số nguyên, cộng lại, in kết quả") ba lần, mỗi thế hệ một lần. Sự lặp lại ấy là cố ý, và là thứ hay nhất của chương.</li>
<li><strong>7.2 Translation</strong> (9–11) — chương trình nguồn → chương trình đích, bằng <em>biên dịch</em> hoặc <em>thông dịch</em>, cùng bốn pha bên trong một trình biên dịch (từ vựng, cú pháp, ngữ nghĩa, sinh mã). CQ11.2 nằm ở đây.</li>
<li><strong>7.3 Programming paradigms</strong> (12–17) — thủ tục, hướng đối tượng, hàm, khai báo. Bốn slide khái niệm, mỗi cái kèm một hình.</li>
<li><strong>7.4 Common concepts</strong> (18–25) — định danh, kiểu dữ liệu, biến, literal, hằng, vào/ra. Đây là chuyến đi nhanh qua những thứ bạn đã làm hằng ngày trong C; giá trị nằm ở TỪ VỰNG, vì đề thi dùng những chữ này rất chính xác.</li>
<li><strong>Thứ KHÔNG có trong deck dù Forouzan có</strong> — chương gốc còn có câu lệnh, chương trình con (truyền tham số theo trị và theo tham chiếu), và một mục dài về Java như ví dụ hướng đối tượng. Deck dừng ở vào/ra. Đừng ngạc nhiên vì slide 25 kết thúc cụt lủn; không mất gì cả, nó bị cắt.</li>
</ul>
<p class="pitfall">⚠️ Để ý mục 7.1 tên là "Evolution" còn mục 7.3 tên là "paradigms", và hình ở slide 5 trộn cả hai lên cùng một mũi tên. <em>Thế hệ</em> (mã máy / hợp ngữ / bậc cao) và <em>mô hình</em> (thủ tục / hướng đối tượng / hàm / khai báo) là HAI cách phân loại hoàn toàn khác nhau cho cùng một tập ngôn ngữ. C và Java cùng là bậc cao (cùng thế hệ) nhưng khác paradigm; C và Prolog cùng bậc cao nhưng nằm ở hai đầu đối lập của danh sách paradigm.</p>`],

      [3, 'Objectives',
        `<p class="y-chinh">🎯 Eight objectives. Read the verbs: <em>describe, understand, distinguish, understand, understand, define, define, define</em>. Six of the eight are "understand/define" — that is, this chapter is examined by asking you to produce a correct short definition, not to solve anything.</p>
<ul>
<li><strong>"Describe the evolution … from machine language to high-Level languages"</strong> — three generations, three motivations. Answer shape: machine language is binary and machine-specific; assembly replaces binary with mnemonics but still one instruction per machine instruction; high-level languages let you think about the <em>problem</em> instead of the hardware.</li>
<li><strong>"Understand how a program … is translated … using an interpreter or a compiler"</strong> — this is CQ11.2 and it is the single most likely essay-style question in the chapter. Slide 10 gives the definitions and slide 11 gives the four phases.</li>
<li><strong>"Distinguish between four computer language paradigms"</strong> — note the verb is <em>distinguish</em>, not "list". Being able to recite "procedural, object-oriented, functional, declarative" is not enough; you must be able to say what makes each one different from the one next to it.</li>
<li><strong>Two objectives about procedural and object-oriented "interaction"</strong> — both use the word <em>interaction</em> on purpose. Procedural: an <em>active</em> program acting on <em>passive</em> data. Object-oriented: a program sending a <em>stimulus</em> to <em>active</em> objects that already contain their own actions. That passive/active contrast is the exam's favourite way of testing slides 14 and 15.</li>
<li><strong>"Define functional / declarative paradigm and understand its applications"</strong> — note "applications": for functional, list processing and LISP/Scheme; for declarative, logic programming, Prolog, and by extension database query languages like SQL.</li>
<li><strong>"Define common concepts in procedural and object-oriented languages"</strong> — the six words from slide 19. Short definitions, one line each.</li>
</ul>
<p class="meo">💡 Turn these eight lines into eight flashcards <em>verbatim</em>. If you can answer all eight out loud in six minutes, you own the chapter — there is nothing in Chapter 7 that these eight sentences do not cover.</p>`,
        `<p class="y-chinh">🎯 Tám mục tiêu. Hãy đọc động từ: <em>describe, understand, distinguish, understand, understand, define, define, define</em>. Sáu trong tám là "hiểu/định nghĩa" — nghĩa là chương này ra đề bằng cách bắt bạn viết ra một định nghĩa ngắn cho đúng, chứ không bắt giải cái gì.</p>
<ul>
<li><strong>"Mô tả sự tiến hoá … từ mã máy tới ngôn ngữ bậc cao"</strong> — ba thế hệ, ba động cơ. Dáng câu trả lời: mã máy là nhị phân và gắn chết với một máy; hợp ngữ thay nhị phân bằng từ gợi nhớ nhưng vẫn một lệnh đổi một lệnh máy; ngôn ngữ bậc cao cho bạn nghĩ về <em>bài toán</em> thay vì về phần cứng.</li>
<li><strong>"Hiểu chương trình được dịch thế nào bằng trình thông dịch hoặc trình biên dịch"</strong> — đây là CQ11.2 và là câu hỏi tự luận khả năng ra cao nhất của chương. Slide 10 cho định nghĩa, slide 11 cho bốn pha.</li>
<li><strong>"Phân biệt bốn paradigm"</strong> — để ý động từ là <em>phân biệt</em>, không phải "liệt kê". Đọc thuộc "thủ tục, hướng đối tượng, hàm, khai báo" là CHƯA đủ; bạn phải nói được cái này khác cái kề nó ở chỗ nào.</li>
<li><strong>Hai mục tiêu nói về "tương tác" của thủ tục và hướng đối tượng</strong> — cả hai đều cố ý dùng chữ <em>interaction</em>. Thủ tục: chương trình <em>chủ động</em> tác động lên dữ liệu <em>thụ động</em>. Hướng đối tượng: chương trình gửi một <em>kích thích</em> tới các đối tượng <em>chủ động</em>, vốn đã mang sẵn hành động của mình. Cặp đối lập thụ động/chủ động ấy là cách ưa thích của đề thi để kiểm tra slide 14 và 15.</li>
<li><strong>"Định nghĩa paradigm hàm / khai báo và hiểu ứng dụng của nó"</strong> — để ý chữ "ứng dụng": với paradigm hàm là xử lý danh sách và LISP/Scheme; với khai báo là lập trình logic, Prolog, và rộng ra là các ngôn ngữ truy vấn cơ sở dữ liệu như SQL.</li>
<li><strong>"Định nghĩa các khái niệm chung"</strong> — sáu chữ ở slide 19. Định nghĩa ngắn, mỗi cái một dòng.</li>
</ul>
<p class="meo">💡 Biến tám dòng này thành tám thẻ ghi nhớ <em>nguyên văn</em>. Trả lời được cả tám thành tiếng trong sáu phút thì bạn đã sở hữu cả chương — không có gì trong Chương 7 mà tám câu này không phủ.</p>`],

      [4, '1 - EVOLUTION',
        `<p class="y-chinh">🎯 A section divider opening section 7.1. The story of the next four slides is a single escalation, and it is driven entirely by one force: <strong>moving the burden of translation from the human to the machine</strong>.</p>
<ul>
<li><strong>The three stops on the road</strong> — machine language (slide 6): you write the bit patterns yourself. Assembly (slide 7): you write mnemonics and a program called the <em>assembler</em> turns them into bit patterns. High-level (slide 8): you write the problem and a program called the <em>compiler</em> turns it into machine instructions.</li>
<li><strong>The invariant that makes the section teachable</strong> — the same tiny task is written three times: read two integers, add them, print the result. Eleven lines of hex, then eleven lines of mnemonics, then about eight lines of C++. Watch the line count barely move while the <em>readability</em> explodes — that is the real message.</li>
<li><strong>What "evolution" does NOT mean</strong> — it does not mean the old generations died. Every C program on earth still becomes assembly and then machine code; you will see both, produced by a real compiler, on slides 7 and 8. The generations are layers, stacked, all still running.</li>
<li><strong>The fourth generation, mentioned nowhere on this deck</strong> — textbooks often add 4GLs (SQL, report generators: you say <em>what</em>, not <em>how</em>) and 5GLs (logic/AI languages, Prolog). Forouzan's Chapter 9 does not use that numbering, and neither does this course. If an exam question offers "fourth generation language", it is drawing on a different book — answer from the three the deck teaches.</li>
<li><strong>The hidden connection to Chapter 5</strong> — the machine language table on slide 6 is written for the <em>hypothetical computer</em> ("Simple Language") that Forouzan builds in his Chapter 5, the same one behind CSI106's CPU material. That is why its instructions are exactly 16 bits and its registers are named R0 … RF.</li>
</ul>
<p class="meo">💡 One sentence for the whole section: <strong>each generation of language is a program that writes the previous generation for you.</strong> The assembler writes machine code; the compiler writes assembly. Nothing was thrown away, it was automated.</p>`,
        `<p class="y-chinh">🎯 Slide phân mục, mở mục 7.1. Câu chuyện của bốn slide tới là một cú leo thang duy nhất, và nó bị đẩy đi bởi đúng một lực: <strong>chuyển gánh nặng dịch thuật từ con người sang máy</strong>.</p>
<ul>
<li><strong>Ba trạm trên đường</strong> — mã máy (slide 6): bạn tự viết ra các mẫu bit. Hợp ngữ (slide 7): bạn viết từ gợi nhớ, rồi một chương trình tên là <em>assembler</em> biến chúng thành mẫu bit. Bậc cao (slide 8): bạn viết bài toán, rồi một chương trình tên là <em>compiler</em> biến nó thành lệnh máy.</li>
<li><strong>Cái bất biến làm mục này dạy được</strong> — cùng một việc bé tí được viết ba lần: đọc hai số nguyên, cộng, in ra. Mười một dòng hex, rồi mười một dòng từ gợi nhớ, rồi khoảng tám dòng C++. Hãy để ý số DÒNG gần như không đổi trong khi độ DỄ ĐỌC thì nổ tung — đó mới là thông điệp thật.</li>
<li><strong>"Tiến hoá" KHÔNG có nghĩa là gì</strong> — nó không có nghĩa các thế hệ cũ đã chết. Mọi chương trình C trên đời tới nay vẫn biến thành hợp ngữ rồi thành mã máy; bạn sẽ thấy cả hai, do một trình biên dịch thật sinh ra, ở slide 7 và 8. Các thế hệ là những lớp xếp chồng, và tất cả vẫn đang chạy.</li>
<li><strong>Thế hệ thứ tư, deck này không nhắc</strong> — nhiều sách còn thêm 4GL (SQL, bộ sinh báo cáo: bạn nói <em>cái gì</em>, không nói <em>làm thế nào</em>) và 5GL (ngôn ngữ logic/AI, Prolog). Chương 9 của Forouzan không dùng cách đánh số ấy, môn này cũng không. Nếu đề thi đưa ra "ngôn ngữ thế hệ thứ tư" thì nó lấy từ sách khác — cứ trả lời theo ba thế hệ deck dạy.</li>
<li><strong>Mối nối ngầm với Chương 5</strong> — bảng mã máy ở slide 6 được viết cho <em>máy tính giả định</em> ("Simple Language") mà Forouzan dựng ở Chương 5 của ông, cũng chính là cỗ máy đứng sau phần CPU của CSI106. Vì thế lệnh của nó đúng 16 bit và thanh ghi tên là R0 … RF.</li>
</ul>
<p class="meo">💡 Một câu cho cả mục: <strong>mỗi thế hệ ngôn ngữ là một chương trình viết hộ bạn thế hệ trước đó.</strong> Assembler viết mã máy; compiler viết hợp ngữ. Không có gì bị vứt đi, chỉ là đã được tự động hoá.</p>`],

      [5, '1. EVOLUTION',
        `<p class="y-chinh">🎯 The definition to memorise, word for word: <em>"A computer language is a set of predefined words that are combined into a program according to predefined rules (syntax)."</em> Two halves — a <strong>vocabulary</strong> and a <strong>syntax</strong> — and that is exactly what a human language is too.</p>
<ul>
<li><strong>Unpack "predefined words"</strong> — in C these are the 32 reserved keywords (<code>int</code>, <code>if</code>, <code>while</code>, <code>return</code>, …) plus the operators. The set is tiny and closed: you cannot invent a new keyword, only new identifiers. That is why slide 20 makes such a point of identifiers.</li>
<li><strong>Unpack "predefined rules (syntax)"</strong> — syntax says which <em>arrangements</em> of those words are legal. <code>int x = 5;</code> is legal; <code>= x int 5;</code> uses the same four symbols and is not. A compiler's second phase (slide 11) does nothing but check this.</li>
<li><strong>The word the slide does NOT say, and should</strong> — <em>semantics</em>: what a legal sentence <em>means</em>. <code>int x = "hello";</code> is syntactically fine — declaration, name, equals, value, semicolon — and still refused. Run it and clang says <code>incompatible pointer to integer conversion initializing 'int' with an expression of type 'char[9]'</code>. Syntax = grammar; semantics = sense. Slide 11 names both.</li>
<li><strong>Reading Figure 7.1</strong> — the green arrow rises through: Machine language → Assembly language → Monolithic-based → Procedural → Structured → Object-oriented, and beside the last it lists <em>Simula, SmallTalk, Java, C#, C++</em>. Simula (1967) is correctly placed as the first object-oriented language; Smalltalk (1972) made the idea famous.</li>
<li><strong>"Have evolved from machine language to high-level languages"</strong> — the two phrases in red on the slide are the two ends of section 7.1, and the three middle slides are the journey.</li>
</ul>
<p class="pitfall">⚠️ Figure 7.1 is doing two incompatible jobs at once. "Machine language" and "Assembly language" are <em>generations</em> (how close to the hardware); "Procedural", "Structured" and "Object-oriented" are <em>paradigms</em> (how you think about the problem) — the very four-way split that section 7.3 introduces on slide 13. Putting them on a single arrow suggests object-oriented came <em>after</em> and <em>replaced</em> procedural, which is false: C (procedural, 1972) and Smalltalk (object-oriented, 1972) are the same age, and both are high-level. Learn the two classifications separately.</p>`,
        `<p class="y-chinh">🎯 Định nghĩa phải thuộc, từng chữ một: <em>"Ngôn ngữ máy tính là một tập các từ đã định nghĩa sẵn, được ghép thành chương trình theo những quy tắc đã định sẵn (cú pháp)."</em> Hai nửa — một <strong>bộ từ vựng</strong> và một <strong>cú pháp</strong> — và tiếng người cũng đúng như vậy.</p>
<ul>
<li><strong>Mổ chữ "từ đã định nghĩa sẵn"</strong> — trong C đó là 32 từ khoá dành riêng (<code>int</code>, <code>if</code>, <code>while</code>, <code>return</code>, …) cộng với các toán tử. Tập ấy bé và ĐÓNG: bạn không chế thêm được từ khoá mới, chỉ chế được định danh mới. Vì thế slide 20 mới nhấn mạnh định danh đến thế.</li>
<li><strong>Mổ chữ "quy tắc định sẵn (cú pháp)"</strong> — cú pháp nói cách <em>sắp xếp</em> nào của những từ ấy là hợp lệ. <code>int x = 5;</code> hợp lệ; <code>= x int 5;</code> dùng đúng bốn ký hiệu đó mà không hợp lệ. Pha thứ hai của trình biên dịch (slide 11) không làm gì khác ngoài kiểm tra điều này.</li>
<li><strong>Chữ mà slide KHÔNG nói, đáng ra phải nói</strong> — <em>ngữ nghĩa</em>: câu hợp lệ ấy CÓ NGHĨA gì. <code>int x = "hello";</code> đúng cú pháp — khai báo, tên, dấu bằng, giá trị, chấm phẩy — mà vẫn bị từ chối. Chạy thật, clang báo <code>incompatible pointer to integer conversion initializing 'int' with an expression of type 'char[9]'</code>. Cú pháp = ngữ pháp; ngữ nghĩa = ý nghĩa. Slide 11 gọi tên cả hai.</li>
<li><strong>Đọc Hình 7.1</strong> — mũi tên xanh đi lên qua: Machine language → Assembly language → Monolithic-based → Procedural → Structured → Object-oriented, và cạnh cái cuối liệt kê <em>Simula, SmallTalk, Java, C#, C++</em>. Simula (1967) được xếp đúng là ngôn ngữ hướng đối tượng đầu tiên; Smalltalk (1972) là thứ làm ý tưởng ấy nổi tiếng.</li>
<li><strong>"Đã tiến hoá từ mã máy tới ngôn ngữ bậc cao"</strong> — hai cụm in đỏ trên slide chính là hai đầu của mục 7.1, còn ba slide ở giữa là chặng đường.</li>
</ul>
<p class="pitfall">⚠️ Hình 7.1 đang làm hai việc không thể ghép chung. "Machine language" và "Assembly language" là <em>thế hệ</em> (gần phần cứng tới đâu); "Procedural", "Structured", "Object-oriented" là <em>mô hình</em> (bạn nghĩ về bài toán thế nào) — đúng phép chia bốn mà mục 7.3 giới thiệu ở slide 13. Đặt chúng lên một mũi tên khiến người ta tưởng hướng đối tượng ra đời SAU và THAY THẾ thủ tục, điều đó sai: C (thủ tục, 1972) và Smalltalk (hướng đối tượng, 1972) cùng tuổi, và cả hai đều là bậc cao. Hãy học hai cách phân loại này tách riêng ra.</p>`],

      [6, '2. Machine languages',
        `<p class="y-chinh">🎯 Generation one. <strong>Each computer had its own machine language, made of streams of 0s and 1s</strong> — and Table 7.1 shows the price: eleven lines of 16 bits to read two integers, add them, and print the result.</p>
<ul>
<li><strong>Read the table properly — it is decodable</strong>. The eleven instructions in hex are <code>1FEF · 240F · 1FEF · 241F · 1040 · 1141 · 3201 · 2422 · 1F42 · 2FFF · 0000</code>. The first hex digit is the opcode: <strong>1 = LOAD</strong> (memory → register), <strong>2 = STORE</strong> (register → memory), <strong>3 = ADD</strong>, <strong>0 = HALT</strong>. Compare it line by line with Table 7.2 on the next slide and the whole encoding falls out.</li>
<li><strong>The operand layout, which most students miss</strong> — LOAD is <code>1 R AA</code> (opcode, <em>register</em>, then a two-digit address), but STORE is <code>2 AA R</code> (opcode, <em>address</em>, then register). So <code>1FEF</code> = load into register F from address EF, while <code>240F</code> = store into address 40 from register F. The operands swap sides depending on the instruction — that asymmetry is exactly the kind of detail a human gets wrong and a machine does not care about.</li>
<li><strong>The memory map hidden in the numbers</strong> — address <strong>EF</strong> is the keyboard controller, <strong>FF</strong> is the monitor controller, and <strong>40, 41, 42</strong> hold Number1, Number2 and Result. In this machine, input/output devices are simply memory addresses (memory-mapped I/O, the technique named in Chapter 1).</li>
<li><strong>"Each computer had its own"</strong> — this is the fatal property, not the binary. A program written for one machine is meaningless on another, because the opcode <code>3</code> that means ADD here means something else there. Zero portability: change the computer, rewrite everything.</li>
<li><strong>Machine code is still real, and you can see it</strong>. Compiling <code>a = b + c;</code> on this Apple arm64 machine and disassembling the object file gives the actual 32-bit word <code>0b090108</code> for the instruction <code>add w8, w8, w9</code>. Same idea as the table, sixty years later and 32 bits wide instead of 16.</li>
</ul>
<p class="pitfall">⚠️ The body text of this slide says <em>"as shown in Table 8.1"</em> while the caption underneath says <em>"Table 7.1"</em>. Both refer to the same table. The deck was renumbered from Forouzan's Chapter 9 and the in-text references were not updated. Quote whichever number the exam paper uses; do not hunt for a missing Table 8.1.</p>`,
        `<p class="y-chinh">🎯 Thế hệ một. <strong>Mỗi máy tính có mã máy riêng của nó, làm bằng những dòng 0 và 1</strong> — và Bảng 7.1 cho thấy cái giá: mười một dòng 16 bit chỉ để đọc hai số nguyên, cộng lại, in ra.</p>
<ul>
<li><strong>Đọc bảng cho đến nơi — nó giải mã được</strong>. Mười một lệnh dạng hex là <code>1FEF · 240F · 1FEF · 241F · 1040 · 1141 · 3201 · 2422 · 1F42 · 2FFF · 0000</code>. Chữ số hex đầu là mã lệnh: <strong>1 = LOAD</strong> (bộ nhớ → thanh ghi), <strong>2 = STORE</strong> (thanh ghi → bộ nhớ), <strong>3 = ADD</strong>, <strong>0 = HALT</strong>. Đặt nó cạnh Bảng 7.2 ở slide sau, so từng dòng, là cả cách mã hoá lòi ra hết.</li>
<li><strong>Thứ tự toán hạng, chỗ đa số sinh viên bỏ sót</strong> — LOAD viết là <code>1 R AA</code> (mã lệnh, <em>thanh ghi</em>, rồi địa chỉ hai chữ số), nhưng STORE lại là <code>2 AA R</code> (mã lệnh, <em>địa chỉ</em>, rồi thanh ghi). Nên <code>1FEF</code> = nạp vào thanh ghi F từ địa chỉ EF, còn <code>240F</code> = cất vào địa chỉ 40 từ thanh ghi F. Toán hạng đảo chỗ tuỳ theo lệnh — đúng loại chi tiết mà con người làm sai còn máy thì chẳng bận tâm.</li>
<li><strong>Bản đồ bộ nhớ giấu trong mấy con số</strong> — địa chỉ <strong>EF</strong> là bộ điều khiển bàn phím, <strong>FF</strong> là bộ điều khiển màn hình, còn <strong>40, 41, 42</strong> giữ Number1, Number2 và Result. Trong cỗ máy này, thiết bị vào/ra chỉ đơn giản là những địa chỉ bộ nhớ (I/O ánh xạ bộ nhớ, kỹ thuật đã được gọi tên ở Chương 1).</li>
<li><strong>"Mỗi máy có riêng của nó"</strong> — đây mới là tính chất chí mạng, chứ không phải chuyện nhị phân. Chương trình viết cho máy này là vô nghĩa trên máy kia, vì mã lệnh <code>3</code> nghĩa là ADD ở đây thì sang đó nghĩa khác. Không khả chuyển chút nào: đổi máy là viết lại tất.</li>
<li><strong>Mã máy đến nay vẫn có thật, và bạn nhìn được nó</strong>. Biên dịch <code>a = b + c;</code> trên chính chiếc máy Apple arm64 rồi dịch ngược file đối tượng, ta thấy từ 32 bit thật <code>0b090108</code> ứng với lệnh <code>add w8, w8, w9</code>. Cùng một ý với cái bảng, chỉ là sáu mươi năm sau và rộng 32 bit thay vì 16.</li>
</ul>
<p class="pitfall">⚠️ Thân slide ghi <em>"as shown in Table 8.1"</em> trong khi chú thích ngay dưới ghi <em>"Table 7.1"</em>. Cả hai chỉ cùng một bảng. Deck được đánh lại số từ Chương 9 của Forouzan mà các chỗ trích dẫn trong thân bài không được sửa theo. Đề thi dùng số nào thì trích số ấy; đừng đi tìm một "Table 8.1" không tồn tại.</p>`],

      [7, '2. Assembly languages',
        `<p class="y-chinh">🎯 Generation two, and the invention is exactly one idea: <strong>replace binary code for instructions and addresses with symbols (mnemonics)</strong>. The machine does not change at all — only the notation the human uses does. First called <em>symbolic languages</em>, later <em>assembly languages</em>.</p>
<ul>
<li><strong>Table 7.2 line by line</strong> — <code>LOAD RF Keyboard</code> / <code>STORE Number1 RF</code> / <code>LOAD RF Keyboard</code> / <code>STORE Number2 RF</code> / <code>LOAD R0 Number1</code> / <code>LOAD R1 Number2</code> / <code>ADDI R2 R0 R1</code> / <code>STORE Result R2</code> / <code>LOAD RF Result</code> / <code>STORE Monitor RF</code> / <code>HALT</code>. Eleven lines, matching Table 7.1 one for one.</li>
<li><strong>What actually improved</strong> — two things, and they are different. (1) <em>Opcodes</em> became words: <code>1</code> → <code>LOAD</code>. (2) <em>Addresses</em> became names: <code>40</code> → <code>Number1</code>, <code>EF</code> → <code>Keyboard</code>. The second is the bigger win, because now inserting an instruction does not force you to renumber every address by hand.</li>
<li><strong>What did NOT improve</strong> — the line count. Still eleven. Assembly is a <em>one-to-one</em> notation: one assembly line becomes exactly one machine instruction. As the slide on the next page puts it, "each machine instruction had to be individually coded". You still think in registers and addresses, not in the problem.</li>
<li><strong>The new program in the toolchain</strong> — something must turn <code>LOAD RF Keyboard</code> back into <code>1FEF</code>. That program is the <strong>assembler</strong>, and it is step 3 of the four translation steps you will meet on slide 11 (<code>cc -c</code>).</li>
<li><strong>Real assembly, from a real compiler</strong>. Asking clang for the assembly of <code>a = b + c;</code> on arm64 gives, verbatim:
<pre><code>adrp  x8, _b@PAGE
ldr   w8, [x8, _b@PAGEOFF]
adrp  x9, _c@PAGE
ldr   w9, [x9, _c@PAGEOFF]
add   w8, w8, w9
str   w8, [x9]</code></pre>
Load, load, add, store — exactly the shape of Table 7.2, on hardware built fifty years later.</li>
</ul>
<p class="pitfall">⚠️ Three defects on this one slide. (1) The section number repeats: slide 6 is "2. Machine languages" and this is "2. Assembly languages" — it should be 3. (2) The body text cites "Table 8.2" and "Table 9.2" while the caption says "Table 7.2" — leftovers from Forouzan's Chapter 9. (3) The caption reads <em>"Table 7.2 Code in machine language to add two integers"</em>, but the table is in <strong>assembly</strong> language; the caption was copy-pasted from Table 7.1 and never edited. If an exam asks you to identify what Table 7.2 shows, the answer is assembly, whatever its caption says.</p>`,
        `<p class="y-chinh">🎯 Thế hệ hai, và phát minh chỉ gồm đúng một ý: <strong>thay mã nhị phân của lệnh và địa chỉ bằng ký hiệu (từ gợi nhớ)</strong>. Cỗ máy không đổi tí nào — chỉ cách ghi mà con người dùng là đổi. Ban đầu gọi là <em>ngôn ngữ ký hiệu</em>, sau gọi là <em>hợp ngữ</em>.</p>
<ul>
<li><strong>Bảng 7.2 đọc từng dòng</strong> — <code>LOAD RF Keyboard</code> / <code>STORE Number1 RF</code> / <code>LOAD RF Keyboard</code> / <code>STORE Number2 RF</code> / <code>LOAD R0 Number1</code> / <code>LOAD R1 Number2</code> / <code>ADDI R2 R0 R1</code> / <code>STORE Result R2</code> / <code>LOAD RF Result</code> / <code>STORE Monitor RF</code> / <code>HALT</code>. Mười một dòng, khớp một-một với Bảng 7.1.</li>
<li><strong>Cái gì thật sự tốt lên</strong> — hai thứ, và chúng khác nhau. (1) <em>Mã lệnh</em> thành chữ: <code>1</code> → <code>LOAD</code>. (2) <em>Địa chỉ</em> thành tên: <code>40</code> → <code>Number1</code>, <code>EF</code> → <code>Keyboard</code>. Cái thứ hai mới là thắng lợi lớn, vì từ nay chèn thêm một lệnh không buộc bạn đánh số lại mọi địa chỉ bằng tay nữa.</li>
<li><strong>Cái gì KHÔNG tốt lên</strong> — số dòng. Vẫn mười một. Hợp ngữ là cách ghi <em>một-đổi-một</em>: một dòng hợp ngữ thành đúng một lệnh máy. Như slide sau nói, "mỗi lệnh máy vẫn phải được mã hoá riêng từng cái". Bạn vẫn đang nghĩ bằng thanh ghi và địa chỉ, chứ không nghĩ bằng bài toán.</li>
<li><strong>Chương trình mới trong bộ công cụ</strong> — phải có thứ gì đó biến <code>LOAD RF Keyboard</code> trở lại thành <code>1FEF</code>. Thứ đó là <strong>trình hợp dịch (assembler)</strong>, và nó chính là bước 3 trong bốn bước dịch bạn sẽ gặp ở slide 11 (<code>cc -c</code>).</li>
<li><strong>Hợp ngữ thật, do trình biên dịch thật sinh ra</strong>. Bảo clang xuất hợp ngữ của <code>a = b + c;</code> trên arm64, nó trả về nguyên văn:
<pre><code>adrp  x8, _b@PAGE
ldr   w8, [x8, _b@PAGEOFF]
adrp  x9, _c@PAGE
ldr   w9, [x9, _c@PAGEOFF]
add   w8, w8, w9
str   w8, [x9]</code></pre>
Nạp, nạp, cộng, cất — đúng dáng của Bảng 7.2, trên phần cứng ra đời sau đó năm mươi năm.</li>
</ul>
<p class="pitfall">⚠️ Ba lỗi trên cùng một slide. (1) Số mục lặp: slide 6 là "2. Machine languages" và slide này cũng "2. Assembly languages" — đáng ra phải là 3. (2) Thân bài trích "Table 8.2" và "Table 9.2" còn chú thích ghi "Table 7.2" — tàn dư của Chương 9 Forouzan. (3) Chú thích ghi <em>"Table 7.2 Code in machine language to add two integers"</em>, nhưng bảng ấy là <strong>hợp ngữ</strong>; chú thích bị chép từ Bảng 7.1 sang mà không sửa. Nếu đề thi hỏi Bảng 7.2 trình bày cái gì, đáp án là hợp ngữ, bất kể chú thích viết gì.</p>`],

      [8, '3. High-level languages',
        `<p class="y-chinh">🎯 Generation three, and the sentence that defines it is on the slide: the goal was <strong>"to change the focus from the computer to the problem being solved"</strong>. That single phrase is the whole difference between assembly and C.</p>
<ul>
<li><strong>What assembly still cost you</strong> — the slide is precise: programmers "still required to concentrate on the hardware they were using", and it was "very tedious, because each machine instruction had to be individually coded". Two separate complaints: the wrong <em>subject matter</em>, and too much <em>volume</em>.</li>
<li><strong>The C++ program shown on the slide</strong> — <code>#include &lt;iostream&gt;</code>, <code>using namespace std;</code>, <code>int main()</code>, three <code>int</code> declarations, <code>cin &gt;&gt; number1; cin &gt;&gt; number2; result = number1 + number2; cout &lt;&lt; result; return 0;</code>. Note that <code>result = number1 + number2;</code> is <strong>one</strong> line where the machine needs four (two loads, an add, a store).</li>
<li><strong>The languages listed</strong> — BASIC (1964), COBOL (1959), Pascal (1970), Ada (1980), C (1972), C++ (1985), Java (1995). Every one of them is still in production somewhere; COBOL in particular still runs a large share of the world's banking batch jobs.</li>
<li><strong>Portability, the prize nobody mentions on the slide</strong> — the same C++ source compiles on x86, on arm64, on a phone. Machine code was locked to one machine; high-level source is locked to nothing, and you re-run the compiler instead of rewriting the program.</li>
<li><strong>The same statement across all three generations</strong>, measured on a real arm64 machine:
<table>
<tr><th>Generation</th><th>How <code>a = b + c</code> is written</th><th>Who translates it</th></tr>
<tr><td>Machine</td><td><code>90000008 b9400108 90000009 b9400129 0b090108 b9000128</code></td><td>nobody — this <em>is</em> the CPU's input</td></tr>
<tr><td>Assembly</td><td><code>adrp/ldr · adrp/ldr · add w8, w8, w9 · str</code></td><td>the assembler</td></tr>
<tr><td>High-level (C)</td><td><code>a = b + c;</code></td><td>the compiler</td></tr>
</table></li>
</ul>
<p class="pitfall">⚠️ Two more renumbering scars. The body says "Figure 8-3" while the caption says "Figure 7.2"; and that caption reads <em>"Code in machine language to add two integers"</em> when the figure obviously shows <strong>C++</strong>. Three consecutive slides (6, 7, 8) share one wrong caption — the deck's author copied the first one down twice.</p>`,
        `<p class="y-chinh">🎯 Thế hệ ba, và câu định nghĩa nó nằm ngay trên slide: mục tiêu là <strong>"chuyển tiêu điểm từ CÁI MÁY sang BÀI TOÁN đang phải giải"</strong>. Đúng một cụm ấy là toàn bộ khác biệt giữa hợp ngữ và C.</p>
<ul>
<li><strong>Hợp ngữ vẫn bắt bạn trả giá gì</strong> — slide nói rất chuẩn: người lập trình "vẫn phải tập trung vào phần cứng đang dùng", và việc đó "rất mệt, vì mỗi lệnh máy phải được mã hoá riêng từng cái". Đó là hai lời than tách biệt: sai <em>đối tượng suy nghĩ</em>, và quá nhiều <em>khối lượng</em>.</li>
<li><strong>Chương trình C++ in trên slide</strong> — <code>#include &lt;iostream&gt;</code>, <code>using namespace std;</code>, <code>int main()</code>, ba khai báo <code>int</code>, rồi <code>cin &gt;&gt; number1; cin &gt;&gt; number2; result = number1 + number2; cout &lt;&lt; result; return 0;</code>. Để ý <code>result = number1 + number2;</code> là <strong>một</strong> dòng, trong khi máy cần bốn lệnh (hai lần nạp, một lần cộng, một lần cất).</li>
<li><strong>Danh sách ngôn ngữ trên slide</strong> — BASIC (1964), COBOL (1959), Pascal (1970), Ada (1980), C (1972), C++ (1985), Java (1995). Cái nào tới nay cũng còn chạy ở đâu đó; riêng COBOL vẫn gánh một phần lớn các mẻ xử lý ban đêm của ngành ngân hàng thế giới.</li>
<li><strong>Tính khả chuyển, phần thưởng mà slide không nhắc</strong> — cùng một mã nguồn C++ biên dịch được trên x86, trên arm64, trên điện thoại. Mã máy bị khoá chết vào một cỗ máy; mã nguồn bậc cao không bị khoá vào đâu cả, và bạn chạy lại trình biên dịch thay vì viết lại chương trình.</li>
<li><strong>Cùng một câu lệnh qua cả ba thế hệ</strong>, đo thật trên một máy arm64:
<table>
<tr><th>Thế hệ</th><th><code>a = b + c</code> được viết thế nào</th><th>Ai dịch nó</th></tr>
<tr><td>Mã máy</td><td><code>90000008 b9400108 90000009 b9400129 0b090108 b9000128</code></td><td>không ai — đây CHÍNH LÀ đầu vào của CPU</td></tr>
<tr><td>Hợp ngữ</td><td><code>adrp/ldr · adrp/ldr · add w8, w8, w9 · str</code></td><td>trình hợp dịch</td></tr>
<tr><td>Bậc cao (C)</td><td><code>a = b + c;</code></td><td>trình biên dịch</td></tr>
</table></li>
</ul>
<p class="pitfall">⚠️ Thêm hai vết sẹo của việc đánh lại số. Thân bài ghi "Figure 8-3" còn chú thích ghi "Figure 7.2"; mà chú thích ấy viết <em>"Code in machine language to add two integers"</em> trong khi hình rõ ràng là <strong>C++</strong>. Ba slide liên tiếp (6, 7, 8) dùng chung một chú thích sai — người làm deck đã chép cái đầu tiên xuống hai lần.</p>`],

      [9, '2- Translation',
        `<p class="y-chinh">🎯 Section divider for 7.2, and for the question the exam asks most often in this chapter: <strong>how does text a human wrote become something a CPU executes?</strong> Two answers exist — compilation and interpretation — and CQ11.2 wants you to contrast them.</p>
<ul>
<li><strong>Two words you must not swap</strong> — the program you wrote is the <strong>source program</strong>; the machine-language result is the <strong>object program</strong>. Slide 10 states both. The word "object" here has <em>nothing</em> to do with object-oriented programming on slide 15 — a genuine and very common confusion, and the reason C's compiled files are called <code>.o</code> / <code>.obj</code>.</li>
<li><strong>Why translation is needed at all</strong> — the CPU of Chapter 1 fetches, decodes and executes bit patterns. It has no idea what <code>while</code> means. Somebody has to bridge the gap; the only question is <em>when</em>.</li>
<li><strong>Compilation: translate everything first, run later</strong> — you get a file that runs by itself, at full hardware speed, and errors are found before a single line executes.</li>
<li><strong>Interpretation: translate one line, run it, take the next</strong> — nothing is produced, the program only exists while it runs, and an error anywhere is only discovered when execution reaches it.</li>
<li><strong>Measured, on the same loop summing 1 to 50,000,000</strong> — C compiled with <code>cc</code> runs it in <strong>0.05 s</strong>; Python 3.14 interprets the same loop in <strong>≈3.2 s</strong>. About <strong>64×</strong>. That number is the price of translating at run time, and it is why the next slide matters.</li>
</ul>
<p class="meo">💡 The mental image that never fails: a <strong>compiler</strong> is a translator who takes your whole book away and hands back a finished translation; an <strong>interpreter</strong> is the person standing beside you at a meeting translating sentence by sentence. The book is faster to read; the interpreter starts working immediately.</p>`,
        `<p class="y-chinh">🎯 Slide phân mục cho 7.2, và cho câu hỏi mà đề thi hay hỏi nhất chương này: <strong>làm sao chữ do con người viết ra biến thành thứ CPU thi hành được?</strong> Có hai câu trả lời — biên dịch và thông dịch — và CQ11.2 muốn bạn đặt chúng cạnh nhau.</p>
<ul>
<li><strong>Hai chữ không được đảo</strong> — thứ bạn viết là <strong>chương trình nguồn</strong> (source program); kết quả bằng mã máy là <strong>chương trình đích</strong> (object program). Slide 10 nêu cả hai. Chữ "object" ở đây <em>chẳng dính dáng gì</em> tới lập trình hướng đối tượng ở slide 15 — một nhầm lẫn có thật và rất phổ biến, và cũng là lý do file đã biên dịch của C mang đuôi <code>.o</code> / <code>.obj</code>.</li>
<li><strong>Vì sao phải dịch</strong> — CPU của Chương 1 lấy lệnh, giải mã, thi hành các mẫu bit. Nó không biết <code>while</code> nghĩa là gì. Phải có ai đó bắc cầu; vấn đề chỉ là bắc vào <em>lúc nào</em>.</li>
<li><strong>Biên dịch: dịch hết trước, chạy sau</strong> — bạn nhận được một file tự chạy được, chạy ở tốc độ phần cứng, và lỗi được tìm ra trước khi một dòng nào kịp thi hành.</li>
<li><strong>Thông dịch: dịch một dòng, chạy dòng đó, rồi sang dòng tiếp</strong> — không sinh ra file nào, chương trình chỉ tồn tại trong lúc chạy, và lỗi nằm ở đâu thì chỉ bị phát hiện khi dòng chạy tới đó.</li>
<li><strong>Đo thật, cùng một vòng lặp cộng từ 1 tới 50.000.000</strong> — C biên dịch bằng <code>cc</code> chạy hết <strong>0,05 giây</strong>; Python 3.14 thông dịch đúng vòng lặp ấy hết <strong>≈3,2 giây</strong>. Khoảng <strong>64 lần</strong>. Con số đó là cái giá của việc dịch lúc chạy, và là lý do slide sau quan trọng.</li>
</ul>
<p class="meo">💡 Hình dung không bao giờ sai: <strong>trình biên dịch</strong> là người phiên dịch nhận cả quyển sách của bạn mang đi rồi trả lại một bản dịch hoàn chỉnh; <strong>trình thông dịch</strong> là người đứng cạnh bạn trong cuộc họp, dịch từng câu một. Quyển sách đọc nhanh hơn; người phiên dịch thì bắt tay vào việc ngay lập tức.</p>`],

      [10, '1. Introduction (Translation)',
        `<p class="y-chinh">🎯 The four definitions the exam wants back verbatim: <strong>source program</strong>, <strong>object program</strong>, <strong>compilation</strong> ("a compiler normally translates the whole source program into the object program"), <strong>interpretation</strong> ("translating each line … and executing the line").</p>
<ul>
<li><strong>The word "whole" versus the words "each line"</strong> — that is the entire distinction, and every consequence follows from it. Everything else you can say about compilers and interpreters is downstream of those two words.</li>
<li><strong>The consequences, laid out</strong>:
<table>
<tr><th></th><th>Compilation (C)</th><th>Interpretation (Python)</th><th>Hybrid (Java)</th></tr>
<tr><td>Unit translated</td><td>whole program</td><td>one line at a time</td><td>whole file → bytecode</td></tr>
<tr><td>Produces a file?</td><td>yes, executable</td><td>no</td><td>yes, <code>.class</code></td></tr>
<tr><td>Errors found</td><td>before any execution</td><td>when execution arrives</td><td>syntax early, some later</td></tr>
<tr><td>Speed at run time</td><td>fastest</td><td>slowest</td><td>in between (JIT)</td></tr>
<tr><td>Portable?</td><td>recompile per machine</td><td>source runs anywhere</td><td>one bytecode, any JVM</td></tr>
</table></li>
<li><strong>The decisive experiment — a syntax error on the LAST line.</strong> Take a C program that prints three lines, and delete the semicolon on the third <code>printf</code>. Compile it: <code>bad.c:6:32: error: expected ';' after expression</code>, the compiler exits with status 1, and <strong>no executable file is created at all</strong> — <code>ls bad</code> says "No such file or directory". Not one of the three lines ever ran.</li>
<li><strong>Now the same fault in Python — but make it a run-time fault, not a syntax one.</strong> A three-line script whose last line is <code>print(tenSai)</code> with <code>tenSai</code> undefined. Running it prints <code>dong 1 OK</code>, then <code>dong 2 OK</code>, and only then dies with <code>NameError: name 'tenSai' is not defined</code>. Two lines of output happened before the error was even noticed.</li>
</ul>
<p class="dap-an">✅ Answer to CQ11.2, in the sharpest form available: <strong>a compiled program with an error anywhere produces no output at all; an interpreted program with an error on line 3 produces the output of lines 1 and 2 first.</strong> Careful, though: a pure <em>syntax</em> error in Python is caught by its parser before execution starts (the same script with an unclosed bracket prints nothing), because CPython compiles each file to bytecode first. The clean line is not "syntax vs anything" but "<strong>errors discovered before running vs errors discovered on arrival</strong>".</p>
<p class="pitfall">⚠️ "Interpreted languages are slow" is a half-truth worth stating carefully. Python is slow <em>because</em> each operation is dispatched at run time, not because nothing is ever pre-translated — CPython does compile to bytecode, which you can inspect with <code>python3 -m dis</code>. The exam wants the textbook contrast; just do not go on to claim an interpreter never translates anything in advance.</p>`,
        `<p class="y-chinh">🎯 Bốn định nghĩa mà đề thi muốn nhận lại nguyên văn: <strong>chương trình nguồn</strong>, <strong>chương trình đích</strong>, <strong>biên dịch</strong> ("trình biên dịch thường dịch TOÀN BỘ chương trình nguồn thành chương trình đích"), <strong>thông dịch</strong> ("dịch TỪNG DÒNG … rồi thi hành dòng đó").</p>
<ul>
<li><strong>Chữ "toàn bộ" đối với chữ "từng dòng"</strong> — đó là toàn bộ chỗ khác nhau, và mọi hệ quả đều chảy ra từ đấy. Tất cả những gì bạn có thể nói thêm về trình biên dịch và trình thông dịch đều là hạ nguồn của hai chữ này.</li>
<li><strong>Các hệ quả, bày ra bảng</strong>:
<table>
<tr><th></th><th>Biên dịch (C)</th><th>Thông dịch (Python)</th><th>Lai (Java)</th></tr>
<tr><td>Đơn vị được dịch</td><td>cả chương trình</td><td>từng dòng một</td><td>cả file → bytecode</td></tr>
<tr><td>Có sinh ra file không?</td><td>có, file chạy được</td><td>không</td><td>có, <code>.class</code></td></tr>
<tr><td>Lỗi bị phát hiện</td><td>trước khi chạy dòng nào</td><td>khi chạy tới nơi</td><td>cú pháp sớm, một số muộn</td></tr>
<tr><td>Tốc độ lúc chạy</td><td>nhanh nhất</td><td>chậm nhất</td><td>ở giữa (JIT)</td></tr>
<tr><td>Khả chuyển?</td><td>mỗi máy dịch lại</td><td>mã nguồn chạy đâu cũng được</td><td>một bytecode, JVM nào cũng chạy</td></tr>
</table></li>
<li><strong>Thí nghiệm quyết định — lỗi cú pháp ở dòng CUỐI.</strong> Lấy một chương trình C in ba dòng, xoá dấu chấm phẩy ở <code>printf</code> thứ ba. Biên dịch: <code>bad.c:6:32: error: expected ';' after expression</code>, trình biên dịch thoát với mã 1, và <strong>không có file chạy nào được tạo ra cả</strong> — <code>ls bad</code> trả lời "No such file or directory". Không một dòng nào trong ba dòng từng chạy.</li>
<li><strong>Giờ cùng khuyết điểm ấy trong Python — nhưng để nó thành lỗi lúc CHẠY, không phải lỗi cú pháp.</strong> Một script ba dòng mà dòng cuối là <code>print(tenSai)</code> với <code>tenSai</code> chưa hề tồn tại. Chạy lên, nó in <code>dong 1 OK</code>, rồi <code>dong 2 OK</code>, rồi mới chết với <code>NameError: name 'tenSai' is not defined</code>. Hai dòng kết quả đã xảy ra trước khi lỗi kịp bị nhận ra.</li>
</ul>
<p class="dap-an">✅ Trả lời CQ11.2, ở dạng sắc nhất có được: <strong>chương trình biên dịch mà có lỗi ở bất kỳ đâu thì KHÔNG cho ra kết quả nào cả; chương trình thông dịch có lỗi ở dòng 3 thì vẫn cho ra kết quả của dòng 1 và 2 trước đã.</strong> Nhưng phải cẩn thận: lỗi <em>cú pháp</em> thuần tuý trong Python bị bộ phân tích bắt TRƯỚC khi chạy (chính script ấy nếu thiếu dấu đóng ngoặc thì không in gì cả), vì CPython dịch mỗi file sang bytecode trước. Ranh giới sạch không phải "cú pháp với thứ khác" mà là "<strong>lỗi bị phát hiện TRƯỚC KHI chạy với lỗi bị phát hiện KHI CHẠY TỚI</strong>".</p>
<p class="pitfall">⚠️ "Ngôn ngữ thông dịch thì chậm" là nửa sự thật, đáng phát biểu cho cẩn thận. Python chậm <em>vì</em> mỗi phép toán được định tuyến lúc chạy, chứ không phải vì chẳng có gì được dịch trước — CPython CÓ dịch sang bytecode, bạn xem được bằng <code>python3 -m dis</code>. Đề thi muốn thế đối lập của sách giáo khoa; chỉ đừng đi xa tới mức khẳng định trình thông dịch không bao giờ dịch trước thứ gì.</p>`],

      [11, '2. Translation process',
        `<p class="y-chinh">🎯 The inside of a compiler: <code>Source file → Lexical analyzer → Syntax analyzer → Semantic analyzer → Code generator → Object file</code>, with the intermediate products labelled on the arrows: <strong>Symbols → Tokens → Instructions → Codable instructions → Code</strong>.</p>
<ul>
<li><strong>Lexical analyzer</strong> — "reads the source code, symbol by symbol, and creates a list of <strong>tokens</strong>". A token is the smallest meaningful unit. This is real and visible: asking clang to dump tokens for the line <code>int x = 1 + 2;</code> produces exactly seven of them — <code>int 'int'</code>, <code>identifier 'x'</code>, <code>equal '='</code>, <code>numeric_constant '1'</code>, <code>plus '+'</code>, <code>numeric_constant '2'</code>, <code>semi ';'</code>. Spaces vanish; each token keeps its position for the error messages you read later.</li>
<li><strong>Syntax analyzer</strong> — "parses a set of tokens to find instructions". It checks the <em>arrangement</em>. This is the phase that produced <code>error: expected ';' after expression</code> on slide 10.</li>
<li><strong>Semantic analyzer</strong> — "checks the sentences … to be sure they contain no ambiguity". In practice: type checking. <code>int x = "xin chao";</code> passes the syntax analyzer and dies here, with <code>incompatible pointer to integer conversion</code>. Grammatically perfect, meaningless.</li>
<li><strong>Code generator</strong> — "each instruction is converted to a set of machine language instructions". Note the words <em>a set</em>: one source statement becomes several machine instructions — <code>a = b + c;</code> became six on slide 8.</li>
<li><strong>The four steps you can run yourself</strong>, on a 122-byte C file that reads two integers and prints their sum. Real command, real file size after each:
<table>
<tr><th>Step</th><th>Command</th><th>Output</th><th>Real size</th></tr>
<tr><td>1. Preprocess</td><td><code>cc -E add.c -o add.i</code></td><td><code>.i</code> — C with <code>#include</code> pasted in</td><td><strong>31 589 B</strong> (574 lines)</td></tr>
<tr><td>2. Compile</td><td><code>cc -S add.c -o add.s</code></td><td><code>.s</code> — assembly</td><td><strong>1 312 B</strong> (48 lines)</td></tr>
<tr><td>3. Assemble</td><td><code>cc -c add.c -o add.o</code></td><td><code>.o</code> — machine code, not runnable</td><td><strong>864 B</strong></td></tr>
<tr><td>4. Link</td><td><code>cc add.c -o add</code></td><td>executable</td><td><strong>33 456 B</strong></td></tr>
</table>
Then <code>echo "7 35" | ./add</code> prints <code>42</code>. Look at step 1: your 122 bytes became 31 589 — a 259× explosion, all of it the contents of <code>stdio.h</code>.</li>
</ul>
<p class="dap-an">✅ Why <code>.o</code> is not runnable, and why that matters for PRF192: <code>nm add.o</code> shows <code>T _main</code> (defined here) but <code>U _printf</code> and <code>U _scanf</code> — <strong>U = undefined</strong>. Step 4 is what fills those in. Declare a function, call it, and never write its body, and compilation succeeds while linking fails: <code>Undefined symbols: "_dientich", referenced from: _main</code>. That is the answer to "why is a missing library a <em>link</em> error and not a compile error" — the compiler only needed the prototype to believe you; the linker needs the actual code.</p>
<p class="pitfall">⚠️ The caption under the figure reads <em>"Figure 7.3 Evolution of programing"</em> — copied from Figure 7.1 and never corrected. The figure has nothing to do with evolution; it is the translation pipeline. Also note the deck shows only the four <em>compiler</em> phases, not the four <em>toolchain</em> steps in the table above; both are correct and they are different decompositions. The exam asks for the four phases on the slide.</p>`,
        `<p class="y-chinh">🎯 Bên trong một trình biên dịch: <code>File nguồn → Bộ phân tích từ vựng → Bộ phân tích cú pháp → Bộ phân tích ngữ nghĩa → Bộ sinh mã → File đích</code>, với sản phẩm trung gian ghi ngay trên mũi tên: <strong>Symbols → Tokens → Instructions → Codable instructions → Code</strong>.</p>
<ul>
<li><strong>Bộ phân tích từ vựng (lexical analyzer)</strong> — "đọc mã nguồn, từng ký hiệu một, và tạo ra danh sách <strong>token</strong>". Token là đơn vị có nghĩa nhỏ nhất. Điều này có thật và nhìn được: bảo clang xuất token cho dòng <code>int x = 1 + 2;</code> thì ra đúng bảy cái — <code>int 'int'</code>, <code>identifier 'x'</code>, <code>equal '='</code>, <code>numeric_constant '1'</code>, <code>plus '+'</code>, <code>numeric_constant '2'</code>, <code>semi ';'</code>. Dấu cách biến mất; mỗi token giữ lại vị trí của nó để phục vụ những dòng báo lỗi bạn đọc sau này.</li>
<li><strong>Bộ phân tích cú pháp</strong> — "ghép các token lại để tìm ra câu lệnh". Nó kiểm tra <em>cách sắp xếp</em>. Đây là pha đã sinh ra <code>error: expected ';' after expression</code> ở slide 10.</li>
<li><strong>Bộ phân tích ngữ nghĩa</strong> — "kiểm tra các câu … để chắc chắn không có nhập nhằng". Thực tế là: kiểm tra kiểu. <code>int x = "xin chao";</code> qua được bộ cú pháp rồi chết ở đây, với <code>incompatible pointer to integer conversion</code>. Ngữ pháp hoàn hảo, vô nghĩa.</li>
<li><strong>Bộ sinh mã</strong> — "mỗi chỉ thị được chuyển thành MỘT TẬP lệnh mã máy". Để ý chữ <em>một tập</em>: một câu lệnh nguồn thành vài lệnh máy — <code>a = b + c;</code> đã thành sáu lệnh ở slide 8.</li>
<li><strong>Bốn bước bạn tự chạy được</strong>, trên một file C 122 byte đọc hai số nguyên rồi in tổng. Lệnh thật, kích thước file thật sau mỗi bước:
<table>
<tr><th>Bước</th><th>Lệnh</th><th>Kết quả</th><th>Kích thước thật</th></tr>
<tr><td>1. Tiền xử lý</td><td><code>cc -E add.c -o add.i</code></td><td><code>.i</code> — C đã dán <code>#include</code> vào</td><td><strong>31.589 B</strong> (574 dòng)</td></tr>
<tr><td>2. Biên dịch</td><td><code>cc -S add.c -o add.s</code></td><td><code>.s</code> — hợp ngữ</td><td><strong>1.312 B</strong> (48 dòng)</td></tr>
<tr><td>3. Hợp dịch</td><td><code>cc -c add.c -o add.o</code></td><td><code>.o</code> — mã máy, CHƯA chạy được</td><td><strong>864 B</strong></td></tr>
<tr><td>4. Liên kết</td><td><code>cc add.c -o add</code></td><td>file chạy được</td><td><strong>33.456 B</strong></td></tr>
</table>
Rồi <code>echo "7 35" | ./add</code> in ra <code>42</code>. Hãy nhìn bước 1: 122 byte của bạn thành 31.589 — nở ra 259 lần, và toàn bộ phần nở thêm là ruột của <code>stdio.h</code>.</li>
</ul>
<p class="dap-an">✅ Vì sao <code>.o</code> chưa chạy được, và vì sao điều đó quan trọng với PRF192: <code>nm add.o</code> cho thấy <code>T _main</code> (định nghĩa ở đây) nhưng <code>U _printf</code> và <code>U _scanf</code> — <strong>U = undefined, chưa có</strong>. Bước 4 mới là bước điền chúng vào. Hãy khai báo một hàm, gọi nó, rồi không bao giờ viết thân hàm: biên dịch qua ngon, liên kết chết ngay: <code>Undefined symbols: "_dientich", referenced from: _main</code>. Đó chính là câu trả lời cho "vì sao thiếu thư viện lại là lỗi <em>liên kết</em> chứ không phải lỗi biên dịch" — trình biên dịch chỉ cần cái prototype để TIN bạn; trình liên kết mới cần mã thật.</p>
<p class="pitfall">⚠️ Chú thích dưới hình ghi <em>"Figure 7.3 Evolution of programing"</em> — chép từ Hình 7.1 sang mà không sửa. Hình này chẳng dính gì tới tiến hoá; nó là dây chuyền dịch. Cũng lưu ý deck chỉ trình bày bốn <em>pha của trình biên dịch</em>, không phải bốn <em>bước của bộ công cụ</em> ở bảng trên; cả hai đều đúng, chỉ là hai cách chia khác nhau. Đề thi hỏi bốn pha trên slide.</p>`],

      [12, '3 - Programming paradigms',
        `<p class="y-chinh">🎯 Section divider for 7.3 and for CQ11.3. The claim of this section is strong: languages differ not only in syntax but in <strong>what they think a program IS</strong> — a sequence of commands, a society of objects, a mathematical function, or a set of facts and rules.</p>
<ul>
<li><strong>Four slides, four paradigms</strong> — procedural (14), object-oriented (15), functional (16), declarative (17). Each gets one figure and one core metaphor. Learn the metaphor and the figure follows.</li>
<li><strong>The one-line summary of each, worth memorising now</strong> — procedural: <em>"do this, then this"</em>. Object-oriented: <em>"ask this object to do it"</em>. Functional: <em>"the answer is f(g(x))"</em>. Declarative: <em>"here are the facts, you work it out"</em>.</li>
<li><strong>Why the split is about <em>who holds the behaviour</em></strong> — in procedural code, behaviour lives in procedures and data is inert. In OO, behaviour lives inside the data. In functional, behaviour is a value you can pass around. In declarative, you do not write behaviour at all — the language's engine supplies it.</li>
<li><strong>A warning about real languages</strong> — no serious language is purely one paradigm. Python has classes (OO), <code>filter</code>/<code>map</code> (functional) and plain loops (procedural). C++ and Java are called object-oriented but their method bodies are procedural — slide 19 says exactly this. The paradigm classifies the <em>style you are using</em> more than the language on the box.</li>
<li><strong>How this section will be tested</strong> — "which paradigm does LISP belong to?", "give an example of a declarative language", "what is the difference between a procedure and a method?". Matching questions. The figure on slide 13 answers most of them by itself.</li>
</ul>
<p class="meo">💡 One problem, four solutions, as the next slides will show in code: <strong>sum the even numbers in [7, 11, 8, 9, 10, 6]</strong>. The correct answer is 24 in every paradigm — 8 + 10 + 6. What changes is not the answer but <em>how much you had to say to get it</em>.</p>`,
        `<p class="y-chinh">🎯 Slide phân mục cho 7.3 và cho CQ11.3. Luận điểm của mục này khá mạnh: các ngôn ngữ khác nhau không chỉ ở cú pháp mà ở chỗ <strong>chúng cho rằng chương trình LÀ CÁI GÌ</strong> — một dãy mệnh lệnh, một xã hội các đối tượng, một hàm toán học, hay một tập sự kiện và luật.</p>
<ul>
<li><strong>Bốn slide, bốn paradigm</strong> — thủ tục (14), hướng đối tượng (15), hàm (16), khai báo (17). Mỗi cái một hình và một phép ẩn dụ cốt lõi. Nhớ phép ẩn dụ thì cái hình tự theo sau.</li>
<li><strong>Tóm tắt một dòng cho từng cái, nên thuộc ngay bây giờ</strong> — thủ tục: <em>"làm cái này, rồi làm cái này"</em>. Hướng đối tượng: <em>"bảo đối tượng này làm đi"</em>. Hàm: <em>"đáp án là f(g(x))"</em>. Khai báo: <em>"đây là các sự kiện, anh tự suy ra"</em>.</li>
<li><strong>Vì sao phép chia này thực chất là về <em>hành vi nằm ở đâu</em></strong> — trong mã thủ tục, hành vi nằm trong các thủ tục còn dữ liệu thì trơ. Trong hướng đối tượng, hành vi nằm BÊN TRONG dữ liệu. Trong paradigm hàm, hành vi là một giá trị bạn truyền đi được. Trong khai báo, bạn không viết hành vi gì cả — bộ máy của ngôn ngữ cấp nó cho bạn.</li>
<li><strong>Một lời cảnh báo về ngôn ngữ thật</strong> — không ngôn ngữ nghiêm túc nào thuần một paradigm. Python có lớp (hướng đối tượng), có <code>filter</code>/<code>map</code> (hàm) và có vòng lặp trần (thủ tục). C++ và Java được gọi là hướng đối tượng nhưng thân phương thức của chúng là thủ tục — slide 19 nói đúng điều này. Paradigm phân loại <em>lối viết bạn đang dùng</em> nhiều hơn là phân loại cái tên ngôn ngữ ghi trên hộp.</li>
<li><strong>Mục này sẽ được kiểm tra thế nào</strong> — "LISP thuộc paradigm nào?", "cho một ví dụ ngôn ngữ khai báo", "thủ tục khác phương thức chỗ nào?". Toàn câu ghép cặp. Riêng cái hình ở slide 13 đã trả lời gần hết.</li>
</ul>
<p class="meo">💡 Một bài toán, bốn lời giải, như các slide sau sẽ trình bày bằng mã thật: <strong>tính tổng các số chẵn trong [7, 11, 8, 9, 10, 6]</strong>. Đáp số đúng là 24 ở cả bốn paradigm — 8 + 10 + 6. Thứ thay đổi không phải đáp số, mà là <em>bạn phải NÓI BAO NHIÊU mới lấy được nó</em>.</p>`],

      [13, '1. Introduction (Paradigms)',
        `<p class="y-chinh">🎯 The definition: <em>"A paradigm is a way in which a computer language looks at the problem to be solved."</em> And the four-way split that the rest of the section unfolds: <strong>procedural, object-oriented, functional, declarative</strong>.</p>
<ul>
<li><strong>Figure 7.4 is a memorisation goldmine</strong> — it lists the example languages under each box, and exam questions are drawn straight from it. Procedural: <em>FORTRAN, COBOL, BASIC, C, Pascal, Ada</em>. Object-oriented: <em>Smalltalk, C++, Visual Basic, C#, Java</em>. Functional: <em>LISP, Scheme</em>. Declarative: <em>Prolog</em>.</li>
<li><strong>Learn the odd ones, not the obvious ones</strong> — nobody forgets that Java is OO. The marks are lost on <em>Scheme</em> (functional, a LISP dialect from 1975) and on the fact that the functional and declarative columns have only three languages between them. Prolog standing alone under "Declarative" is the single most quotable item on the slide.</li>
<li><strong>Same problem, four paradigms — all four run, all four print 24</strong>:
<table>
<tr><th>Paradigm</th><th>Code that sums the even numbers of [7, 11, 8, 9, 10, 6]</th></tr>
<tr><td>Procedural (C)</td><td><code>for (i = 0; i &lt; n; i++) if (a[i] % 2 == 0) tong += a[i];</code></td></tr>
<tr><td>Object-oriented (Java)</td><td><code>new DanhSach(List.of(7,11,8,9,10,6)).tongChan()</code> — the list object owns the method</td></tr>
<tr><td>Functional (Python)</td><td><code>sum(filter(lambda x: x % 2 == 0, [7,11,8,9,10,6]))</code></td></tr>
<tr><td>Declarative (SQL)</td><td><code>SELECT SUM(v) FROM so WHERE v % 2 = 0;</code></td></tr>
</table></li>
<li><strong>Read the four rows again and notice what disappears</strong> — the loop counter <code>i</code> exists only in the C row. By the SQL row there is no loop, no variable, no order of operations: you stated the property of the answer and the engine found it. That shrinking is the paradigm difference, made visible.</li>
<li><strong>Where C fits, precisely</strong> — the figure puts C under <em>Procedural</em>, and that is the answer the exam wants. C is high-level (generation three, slide 8) <em>and</em> procedural (paradigm one, slide 14). Two labels, two classifications, no contradiction.</li>
</ul>
<p class="dap-an">✅ Verified by running all four: the C program prints <code>24</code>, the Java program prints <code>24</code>, the Python one-liner prints <code>24</code>, and <code>sqlite3</code> prints <code>24</code>. Four ways of thinking, one number.</p>
<p class="pitfall">⚠️ Do not read Figure 7.4 as "a language belongs to exactly one box". Visual Basic sits under object-oriented here but its early versions were procedural; Python appears nowhere on this 2007-era figure yet does all four. The figure is a teaching simplification and the exam treats it as fact — answer with the figure, but know it is a simplification.</p>`,
        `<p class="y-chinh">🎯 Định nghĩa: <em>"Paradigm là cách mà một ngôn ngữ máy tính NHÌN vào bài toán cần giải."</em> Và phép chia bốn mà cả phần còn lại của mục sẽ mở ra: <strong>thủ tục, hướng đối tượng, hàm, khai báo</strong>.</p>
<ul>
<li><strong>Hình 7.4 là mỏ vàng để học thuộc</strong> — nó liệt kê ngôn ngữ ví dụ dưới mỗi hộp, và đề thi lấy thẳng từ đó ra. Thủ tục: <em>FORTRAN, COBOL, BASIC, C, Pascal, Ada</em>. Hướng đối tượng: <em>Smalltalk, C++, Visual Basic, C#, Java</em>. Hàm: <em>LISP, Scheme</em>. Khai báo: <em>Prolog</em>.</li>
<li><strong>Hãy học mấy cái LẠ, đừng học mấy cái hiển nhiên</strong> — chẳng ai quên Java là hướng đối tượng. Điểm mất ở <em>Scheme</em> (paradigm hàm, một nhánh của LISP, ra đời 1975) và ở chuyện hai cột hàm với khai báo cộng lại chỉ có ba ngôn ngữ. Việc Prolog đứng một mình dưới "Declarative" là mục đáng trích dẫn nhất của cả slide.</li>
<li><strong>Cùng một bài toán, bốn paradigm — cả bốn đều chạy, cả bốn đều in 24</strong>:
<table>
<tr><th>Paradigm</th><th>Mã tính tổng số chẵn của [7, 11, 8, 9, 10, 6]</th></tr>
<tr><td>Thủ tục (C)</td><td><code>for (i = 0; i &lt; n; i++) if (a[i] % 2 == 0) tong += a[i];</code></td></tr>
<tr><td>Hướng đối tượng (Java)</td><td><code>new DanhSach(List.of(7,11,8,9,10,6)).tongChan()</code> — đối tượng danh sách SỞ HỮU phương thức</td></tr>
<tr><td>Hàm (Python)</td><td><code>sum(filter(lambda x: x % 2 == 0, [7,11,8,9,10,6]))</code></td></tr>
<tr><td>Khai báo (SQL)</td><td><code>SELECT SUM(v) FROM so WHERE v % 2 = 0;</code></td></tr>
</table></li>
<li><strong>Đọc lại bốn dòng và để ý thứ gì BIẾN MẤT</strong> — biến đếm <code>i</code> chỉ tồn tại ở dòng C. Tới dòng SQL thì không còn vòng lặp, không còn biến, không còn thứ tự thao tác: bạn phát biểu tính chất của đáp án và bộ máy đi tìm nó. Sự co lại ấy chính là khác biệt giữa các paradigm, được bày ra cho nhìn thấy.</li>
<li><strong>C nằm ở đâu, cho chính xác</strong> — hình xếp C dưới <em>Procedural</em>, và đó là đáp án đề thi muốn. C là ngôn ngữ bậc cao (thế hệ ba, slide 8) <em>và</em> thuộc paradigm thủ tục (paradigm một, slide 14). Hai nhãn, hai cách phân loại, không mâu thuẫn gì.</li>
</ul>
<p class="dap-an">✅ Đã kiểm bằng cách chạy cả bốn: chương trình C in <code>24</code>, chương trình Java in <code>24</code>, dòng Python in <code>24</code>, và <code>sqlite3</code> in <code>24</code>. Bốn lối nghĩ, một con số.</p>
<p class="pitfall">⚠️ Đừng đọc Hình 7.4 thành "mỗi ngôn ngữ thuộc đúng một hộp". Visual Basic ở đây nằm dưới hướng đối tượng nhưng các phiên bản đầu của nó là thủ tục; Python không xuất hiện ở đâu trên cái hình thời 2007 này mà lại làm được cả bốn. Hình là một sự đơn giản hoá để dạy, còn đề thi coi nó là sự thật — cứ trả lời theo hình, nhưng biết rằng nó đã được đơn giản hoá.</p>`],

      [14, '2. The procedural paradigm',
        `<p class="y-chinh">🎯 The metaphor to memorise: a program is an <strong>active agent</strong> that manipulates <strong>passive objects</strong> — "a stone, a book, a lamp". A passive object cannot start anything by itself; it only receives actions.</p>
<ul>
<li><strong>Read Figure 7.5 from left to right</strong> — a red box labelled <em>Program</em> contains the calls <code>printFile(File1)</code> … <code>deleteFile(File2)</code>. Arrows go to a middle column of <em>Predefined procedures</em> (<code>printFile procedure</code>, <code>copyFile procedure</code>, <code>deleteFile procedure</code>), and from there to a right column of <em>Passive objects</em> (File1, File2 … FileN). Three columns: caller, procedure, data.</li>
<li><strong>The crucial structural fact</strong> — the procedures sit <em>between</em> the program and the data, in their own column. Data has no behaviour of its own. Compare that layout with Figure 7.6 on the next slide, where the middle column has moved <em>inside</em> the right column. That single move is the whole difference between slides 14 and 15.</li>
<li><strong>"Or imperative paradigm"</strong> — the slide gives both names, and the exam may use either. <em>Imperative</em> because the code is a sequence of commands in the imperative mood: load this, add that, store there. It is the paradigm closest to how the von Neumann machine of Chapter 1 actually works, which is why it came first historically.</li>
<li><strong>In C, the whole paradigm in one snippet</strong> — a <code>struct</code> holds data with no behaviour, and a separate function acts on it:
<pre><code>typedef struct { char ten[20]; int diem; } SinhVien;   /* passive */
void inSV(SinhVien s) { printf("%s: %d\\n", s.ten, s.diem); }   /* the action, outside */
...
inSV(s);   /* the program is the active agent */</code></pre>
Compiled and run, it prints <code>Cuong: 9</code>. Notice the call reads <code>inSV(s)</code> — <em>verb(noun)</em>. Remember that shape.</li>
<li><strong>Why it survived</strong> — it maps directly onto the hardware, so it is fast and predictable, and every operating-system kernel and embedded controller in the world is written this way. Its weakness appears only at scale: with data and behaviour separated, nothing stops any function anywhere from modifying any struct, and a large program becomes hard to reason about.</li>
</ul>
<p class="meo">💡 Keep the grammar test in your head for the exam: procedural code says <strong><code>verb(noun)</code></strong> — <code>printFile(File1)</code>. Object-oriented code says <strong><code>noun.verb()</code></strong> — <code>File1.print()</code>. That one-character difference — the dot — is what slide 15 is about.</p>`,
        `<p class="y-chinh">🎯 Phép ẩn dụ phải thuộc: chương trình là một <strong>tác nhân chủ động</strong> thao tác lên các <strong>đối tượng thụ động</strong> — "hòn đá, quyển sách, cái đèn". Đối tượng thụ động không tự khởi xướng được việc gì; nó chỉ NHẬN hành động.</p>
<ul>
<li><strong>Đọc Hình 7.5 từ trái sang</strong> — hộp đỏ tên <em>Program</em> chứa các lời gọi <code>printFile(File1)</code> … <code>deleteFile(File2)</code>. Mũi tên chạy sang cột giữa là <em>Predefined procedures</em> (<code>printFile procedure</code>, <code>copyFile procedure</code>, <code>deleteFile procedure</code>), rồi từ đó sang cột phải là <em>Passive objects</em> (File1, File2 … FileN). Ba cột: người gọi, thủ tục, dữ liệu.</li>
<li><strong>Sự kiện cấu trúc then chốt</strong> — các thủ tục nằm <em>GIỮA</em> chương trình và dữ liệu, ở một cột riêng của chúng. Dữ liệu không có hành vi của riêng nó. Hãy so bố cục ấy với Hình 7.6 ở slide sau, nơi cột giữa đã dời <em>VÀO BÊN TRONG</em> cột phải. Đúng một cú dời ấy là toàn bộ khác biệt giữa slide 14 và 15.</li>
<li><strong>"Hay paradigm mệnh lệnh"</strong> — slide cho cả hai tên, và đề thi có thể dùng tên nào cũng được. Gọi là <em>mệnh lệnh</em> vì mã là một dãy câu ra lệnh ở thể mệnh lệnh: nạp cái này, cộng cái kia, cất chỗ nọ. Đây là paradigm gần nhất với cách cỗ máy von Neumann ở Chương 1 thật sự vận hành, và vì thế nó ra đời trước về mặt lịch sử.</li>
<li><strong>Trong C, cả paradigm gói trong một đoạn</strong> — một <code>struct</code> giữ dữ liệu mà không có hành vi, và một hàm riêng tác động lên nó:
<pre><code>typedef struct { char ten[20]; int diem; } SinhVien;   /* thụ động */
void inSV(SinhVien s) { printf("%s: %d\\n", s.ten, s.diem); }   /* hành động, nằm NGOÀI */
...
inSV(s);   /* chương trình là tác nhân chủ động */</code></pre>
Biên dịch và chạy, nó in <code>Cuong: 9</code>. Để ý lời gọi đọc lên là <code>inSV(s)</code> — <em>động từ(danh từ)</em>. Nhớ cái dáng ấy.</li>
<li><strong>Vì sao nó sống dai</strong> — nó ánh xạ thẳng xuống phần cứng nên nhanh và dễ đoán, và mọi nhân hệ điều hành cùng mọi bộ điều khiển nhúng trên đời đều viết theo lối này. Điểm yếu chỉ lộ ra khi quy mô lớn: dữ liệu tách rời hành vi nghĩa là chẳng có gì ngăn một hàm bất kỳ ở đâu đó sửa một struct bất kỳ, và chương trình lớn thành ra khó lần.</li>
</ul>
<p class="meo">💡 Giữ sẵn phép thử ngữ pháp này trong đầu để đi thi: mã thủ tục nói <strong><code>động từ(danh từ)</code></strong> — <code>printFile(File1)</code>. Mã hướng đối tượng nói <strong><code>danh từ.động từ()</code></strong> — <code>File1.print()</code>. Khác biệt một ký tự ấy — dấu chấm — chính là nội dung của slide 15.</p>`],

      [15, '3. The object-oriented paradigm',
        `<p class="y-chinh">🎯 The counter-metaphor: <strong>active objects</strong> instead of passive ones — "a vehicle, an automatic door, a dishwasher". And the sentence that carries the whole paradigm: <em>"the actions to be performed on these objects are INCLUDED IN the object"</em>; the object needs only a <strong>stimulus</strong> from outside.</p>
<ul>
<li><strong>Read Figure 7.6 against Figure 7.5</strong> — the red <em>Program</em> box now contains <code>File1.print</code> … <code>File2.delete</code>; arrows labelled <strong>Stimulus</strong> go to a single outer box titled <em>Active objects</em>, and the <code>print method</code>, <code>copy method</code>, <code>delete method</code> are drawn <em>inside</em> that box next to File1, File2 … FileN. The procedures did not disappear; they moved in with the data.</li>
<li><strong>Two words changed, and they are exam keywords</strong> — <em>procedure</em> became <strong>method</strong>, and the arrow label became <strong>stimulus</strong> (elsewhere: "message"). If a question asks what an object-oriented program sends to an object, the slide's word is <em>stimulus</em>.</li>
<li><strong>The name for what the figure draws</strong> — the deck never says it, but the concept is <strong>encapsulation</strong>: data and the operations on it bundled into one unit. Its companions are inheritance and polymorphism. Forouzan covers all three; this deck shows only the first, so do not expect the other two to be examined from these slides.</li>
<li><strong>The same C example, made object-oriented</strong> — the behaviour moves inside:
<pre><code>class SinhVien:
    def __init__(self, ten, diem): self.ten, self.diem = ten, diem
    def inRa(self): print(f"{self.ten}: {self.diem}")   # the method lives IN the object

SinhVien("Cuong", 9).inRa()</code></pre>
Run, it prints <code>Cuong: 9</code> — byte for byte the same output as the procedural C version on slide 14. <strong>Same result, different owner of the behaviour.</strong> That is the only honest way to describe the difference.</li>
<li><strong>The list of OO languages from Figure 7.4</strong> — Smalltalk, C++, Visual Basic, C#, Java. Smalltalk (1972) is the pure case; C++ (1985) is C with objects added, which is why it appears in neither column cleanly; Java (1995) made the paradigm the industry default.</li>
</ul>
<p class="dap-an">✅ How to answer "distinguish procedural from object-oriented" in one exam-ready pair of sentences: <strong>In the procedural paradigm the program is active and the data is passive — procedures live outside the data and are applied to it. In the object-oriented paradigm the objects are active — the methods are included in the object, and the program only sends a stimulus.</strong> Illustrate with <code>printFile(File1)</code> versus <code>File1.print()</code> and the mark is yours.</p>
<p class="pitfall">⚠️ Never confuse the "object" of <em>object program</em> (slide 10 — the machine-language output of a compiler) with the "object" of <em>object-oriented</em>. They are unrelated words that happen to collide, and an exam question mixing both terms in one sentence is testing exactly this.</p>`,
        `<p class="y-chinh">🎯 Phép ẩn dụ đối lập: <strong>đối tượng chủ động</strong> thay cho thụ động — "chiếc xe, cánh cửa tự động, cái máy rửa bát". Và câu chở cả paradigm: <em>"các hành động cần thực hiện trên những đối tượng này được ĐƯA VÀO BÊN TRONG đối tượng"</em>; đối tượng chỉ cần nhận một <strong>kích thích</strong> từ ngoài.</p>
<ul>
<li><strong>Đọc Hình 7.6 đặt cạnh Hình 7.5</strong> — hộp đỏ <em>Program</em> nay chứa <code>File1.print</code> … <code>File2.delete</code>; các mũi tên mang nhãn <strong>Stimulus</strong> chạy tới MỘT hộp ngoài tên <em>Active objects</em>, và <code>print method</code>, <code>copy method</code>, <code>delete method</code> được vẽ <em>bên trong</em> hộp ấy, ngay cạnh File1, File2 … FileN. Các thủ tục không biến mất; chúng dọn vào ở chung với dữ liệu.</li>
<li><strong>Hai chữ đã đổi, và đó là từ khoá thi</strong> — <em>procedure</em> (thủ tục) thành <strong>method</strong> (phương thức), còn nhãn mũi tên thành <strong>stimulus</strong> (kích thích; sách khác gọi là "thông điệp"). Nếu đề hỏi chương trình hướng đối tượng GỬI cái gì tới đối tượng, chữ của slide là <em>stimulus</em>.</li>
<li><strong>Tên gọi của thứ mà hình vẽ</strong> — deck không hề nói ra, nhưng khái niệm đó là <strong>đóng gói (encapsulation)</strong>: dữ liệu và các thao tác trên nó gói vào một khối. Hai người bạn đồng hành của nó là kế thừa và đa hình. Forouzan có đủ ba; deck này chỉ trình bày cái đầu, nên đừng chờ hai cái kia bị hỏi từ bộ slide này.</li>
<li><strong>Chính ví dụ C ở trên, viết lại theo hướng đối tượng</strong> — hành vi dọn vào trong:
<pre><code>class SinhVien:
    def __init__(self, ten, diem): self.ten, self.diem = ten, diem
    def inRa(self): print(f"{self.ten}: {self.diem}")   # phương thức NẰM TRONG đối tượng

SinhVien("Cuong", 9).inRa()</code></pre>
Chạy lên nó in <code>Cuong: 9</code> — giống từng byte với bản C thủ tục ở slide 14. <strong>Cùng kết quả, khác ở chỗ AI SỞ HỮU hành vi.</strong> Đó là cách trung thực duy nhất để mô tả sự khác nhau.</li>
<li><strong>Danh sách ngôn ngữ hướng đối tượng theo Hình 7.4</strong> — Smalltalk, C++, Visual Basic, C#, Java. Smalltalk (1972) là ca thuần khiết; C++ (1985) là C thêm đối tượng vào, nên nó không xếp gọn được vào cột nào; Java (1995) biến paradigm này thành mặc định của cả ngành.</li>
</ul>
<p class="dap-an">✅ Cách trả lời "phân biệt thủ tục với hướng đối tượng" bằng đúng một cặp câu sẵn sàng cho bài thi: <strong>Ở paradigm thủ tục, chương trình là chủ động còn dữ liệu là thụ động — các thủ tục nằm NGOÀI dữ liệu và được áp lên nó. Ở paradigm hướng đối tượng, chính các đối tượng mới chủ động — phương thức nằm TRONG đối tượng, và chương trình chỉ gửi một kích thích.</strong> Minh hoạ bằng <code>printFile(File1)</code> đối với <code>File1.print()</code> là điểm về tay bạn.</p>
<p class="pitfall">⚠️ Đừng bao giờ lẫn chữ "object" của <em>object program</em> (slide 10 — kết quả mã máy của trình biên dịch) với chữ "object" của <em>object-oriented</em>. Đó là hai từ chẳng liên quan gì, chỉ tình cờ trùng nhau, và câu hỏi thi nào trộn cả hai thuật ngữ vào một câu là đang kiểm tra đúng chỗ này.</p>`],

      [16, '4. The functional paradigm',
        `<p class="y-chinh">🎯 Third paradigm: <strong>a program is a mathematical function</strong> — "a black box that maps a list of inputs to a list of outputs". Figure 7.7 draws exactly that: <code>Inputs → [Function (black box)] → Outputs</code>.</p>
<ul>
<li><strong>The word "mathematical" is doing all the work</strong> — a mathematical function has no memory and no side effects. Give it the same input and it must return the same output, always, and it must not change anything on the way. That is why there are no variables and no assignment in the pure form: in maths, <code>x</code> does not become something else halfway through.</li>
<li><strong>Figure 7.8, decoded</strong> — it extracts the third element of a list by composing primitive functions. The list <code>(7, 11, 8, 9, 10, 6)</code> enters; a <strong>Rest</strong> box outputs <code>(11, 8, 9, 10, 6)</code>; a second <strong>Rest</strong> outputs <code>(8, 9, 10, 6)</code>; a <strong>First</strong> box outputs <strong>8</strong>. The whole chain is boxed and labelled <em>Third</em>: you built a new function by plugging three old ones together.</li>
<li><strong>Verified by running it</strong> — defining <code>first</code> and <code>rest</code> in Python and applying <code>first(rest(rest(L)))</code> to <code>[7, 11, 8, 9, 10, 6]</code> gives <strong>8</strong>, and printing <code>L</code> afterwards shows it unchanged: <code>[7, 11, 8, 9, 10, 6]</code>. That second half is the point — the original list was never touched. No side effect.</li>
<li><strong>The exam-relevant names</strong> — LISP (John McCarthy, 1958, the second-oldest high-level language still in use after FORTRAN) and Scheme. The name LISP is short for LISt Processing, which explains why both figures on this slide are about lists.</li>
<li><strong>The same problem as slides 13–15, functionally</strong> — <code>sum(filter(lambda x: x % 2 == 0, [7, 11, 8, 9, 10, 6]))</code> prints <strong>24</strong>. No loop, no counter, no accumulator: two functions composed, exactly like <code>First(Rest(Rest(L)))</code>. Compare it with the C <code>for</code> loop on slide 14 and you can see the paradigm rather than just be told about it.</li>
</ul>
<p class="pitfall">⚠️ The caption reads <em>"Figure 7.7 The concept of an object-oriented paradigm"</em> — wrong. Figure 7.7 is the functional black box; the caption was copied from Figure 7.6 on the previous slide and not corrected. (Figure 7.8's caption, "Extracting the third element of a list", is right.) If an exam question quotes "Figure 7.7" expecting object-orientation, it inherited the deck's error; answer with what the figure actually shows.</p>
<p class="meo">💡 Remember the functional paradigm by its two absences: <strong>no assignment and no side effects</strong>. If a piece of code changes a variable or prints something in the middle, it is not functional in the strict sense — it is procedural code wearing functional syntax.</p>`,
        `<p class="y-chinh">🎯 Paradigm thứ ba: <strong>chương trình là một hàm toán học</strong> — "một hộp đen ánh xạ một danh sách đầu vào thành một danh sách đầu ra". Hình 7.7 vẽ đúng thế: <code>Inputs → [Function (black box)] → Outputs</code>.</p>
<ul>
<li><strong>Chữ "toán học" gánh toàn bộ ý nghĩa</strong> — hàm toán học không có trí nhớ và không có tác dụng phụ. Đưa nó cùng một đầu vào thì nó phải trả cùng một đầu ra, luôn luôn, và trên đường đi nó không được làm thay đổi cái gì. Vì thế trong dạng thuần khiết không có biến và không có phép gán: trong toán, <code>x</code> không tự dưng hoá thành thứ khác giữa chừng.</li>
<li><strong>Giải mã Hình 7.8</strong> — nó lấy phần tử THỨ BA của danh sách bằng cách ghép các hàm nguyên thuỷ lại. Danh sách <code>(7, 11, 8, 9, 10, 6)</code> đi vào; hộp <strong>Rest</strong> cho ra <code>(11, 8, 9, 10, 6)</code>; hộp <strong>Rest</strong> thứ hai cho ra <code>(8, 9, 10, 6)</code>; hộp <strong>First</strong> cho ra <strong>8</strong>. Cả dây chuyền được đóng khung và dán nhãn <em>Third</em>: bạn vừa dựng được một hàm MỚI bằng cách cắm ba hàm cũ vào nhau.</li>
<li><strong>Đã chạy để kiểm</strong> — định nghĩa <code>first</code> và <code>rest</code> trong Python rồi áp <code>first(rest(rest(L)))</code> lên <code>[7, 11, 8, 9, 10, 6]</code> cho ra <strong>8</strong>, và in <code>L</code> sau đó thấy nó y nguyên: <code>[7, 11, 8, 9, 10, 6]</code>. Nửa sau mới là điểm cốt yếu — danh sách gốc chưa hề bị đụng tới. Không tác dụng phụ.</li>
<li><strong>Những cái tên có liên quan tới thi cử</strong> — LISP (John McCarthy, 1958, ngôn ngữ bậc cao già thứ hai còn dùng tới nay, sau FORTRAN) và Scheme. Chữ LISP viết tắt của LISt Processing (xử lý danh sách), điều đó giải thích vì sao cả hai hình trên slide này đều nói về danh sách.</li>
<li><strong>Vẫn bài toán của slide 13–15, viết theo lối hàm</strong> — <code>sum(filter(lambda x: x % 2 == 0, [7, 11, 8, 9, 10, 6]))</code> in ra <strong>24</strong>. Không vòng lặp, không biến đếm, không biến tích luỹ: hai hàm ghép lại, y hệt <code>First(Rest(Rest(L)))</code>. Đặt nó cạnh vòng <code>for</code> của C ở slide 14 là bạn NHÌN THẤY paradigm chứ không chỉ được nghe kể về nó.</li>
</ul>
<p class="pitfall">⚠️ Chú thích ghi <em>"Figure 7.7 The concept of an object-oriented paradigm"</em> — SAI. Hình 7.7 là hộp đen của paradigm HÀM; chú thích bị chép từ Hình 7.6 ở slide trước sang mà không sửa. (Chú thích của Hình 7.8, "Extracting the third element of a list", thì đúng.) Nếu đề thi trích "Figure 7.7" và chờ câu trả lời hướng đối tượng thì nó đã thừa hưởng lỗi của deck; hãy trả lời theo đúng cái hình vẽ ra.</p>
<p class="meo">💡 Nhớ paradigm hàm bằng hai thứ nó KHÔNG có: <strong>không phép gán và không tác dụng phụ</strong>. Đoạn mã nào thay đổi một biến hay in ra cái gì giữa chừng thì nó không phải là hàm theo nghĩa chặt — nó là mã thủ tục khoác cú pháp hàm.</p>`],

      [17, '5. The declarative paradigm',
        `<p class="y-chinh">🎯 Fourth paradigm, and the most alien: you write <strong>facts and rules</strong>, not steps. "A declarative paradigm uses the principle of logical reasoning to answer queries", based on first-order predicate calculus.</p>
<ul>
<li><strong>The worked example on the slide, exactly as printed</strong> — the rule of deduction <code>If (A is B) and (B is C), then (A is C)</code>; Fact 1: <em>Socrates is a human</em> → A is B; Fact 2: <em>A human is mortal</em> → B is C; deduced Fact 3: <em>Socrates is mortal</em> → A is C. This is the classic syllogism, about 2,350 years old (Aristotle), which is why the slide credits "Greek mathematicians".</li>
<li><strong>What you did NOT write</strong> — nowhere did you say "look at fact 1, then look at fact 2, then combine them". You stated two facts and one rule; the <em>inference engine</em> found the chain. That absence of control flow is the definition of declarative.</li>
<li><strong>The same deduction in Prolog</strong>, the language Figure 7.4 lists under Declarative:
<pre><code>la(socrates, human).
la(human, mortal).
la(X, Z) :- la(X, Y), la(Y, Z).
?- la(socrates, mortal).      % Prolog answers: true</code></pre>
Three lines of knowledge, one question, no algorithm.</li>
<li><strong>Actually run, in SQL — because SQL is declarative too</strong>. With a table <code>la(x, y)</code> holding the rows <code>('socrates','human')</code> and <code>('human','mortal')</code>, the query <code>SELECT f1.x || ' is ' || f2.y FROM la f1 JOIN la f2 ON f1.y = f2.x;</code> prints <strong><code>socrates is mortal</code></strong>. Same deduction, same absence of a loop — the database engine decided how to find it.</li>
<li><strong>Where this paradigm lives today</strong> — the deck only names Prolog (AI, expert systems, natural-language parsing), but the declarative idea is the most commercially successful of the four: every SQL query, every spreadsheet formula, every HTML page states <em>what</em> and lets an engine decide <em>how</em>. The slide's "answer queries" is literally the word <em>query</em> in SQL.</li>
</ul>
<p class="dap-an">✅ The distinction the exam wants, in one line each: <strong>procedural/OO tell the machine HOW; declarative tells the machine WHAT and lets it work out how.</strong> Functional sits in between — it says what, but you still build the answer by composing functions yourself.</p>
<p class="pitfall">⚠️ The slide's formalisation is sloppy and it can confuse you. "Socrates is a human" and "A human is mortal" are <em>not</em> the same kind of statement — the first says an individual belongs to a class, the second says one class is contained in another. Writing both as "A is B" hides that, and the pattern breaks on classic counter-examples ("Socrates is a man", "Man is numerous" does not give "Socrates is numerous"). Reproduce the slide's chain for the marks, but do not carry "is" as a single universal relation into any real logic course.</p>`,
        `<p class="y-chinh">🎯 Paradigm thứ tư, và cũng xa lạ nhất: bạn viết ra <strong>sự kiện và luật</strong>, chứ không viết các bước. "Paradigm khai báo dùng nguyên lý suy luận logic để trả lời truy vấn", dựa trên phép tính vị từ bậc nhất.</p>
<ul>
<li><strong>Ví dụ đã giải sẵn trên slide, đúng như in ra</strong> — luật suy diễn <code>If (A is B) and (B is C), then (A is C)</code>; Sự kiện 1: <em>Socrates là người</em> → A is B; Sự kiện 2: <em>Người thì phải chết</em> → B is C; suy ra Sự kiện 3: <em>Socrates phải chết</em> → A is C. Đây là tam đoạn luận kinh điển, khoảng 2.350 tuổi (Aristotle), nên slide mới ghi công cho "các nhà toán học Hy Lạp".</li>
<li><strong>Thứ bạn KHÔNG viết</strong> — chẳng chỗ nào bạn bảo "nhìn sự kiện 1, rồi nhìn sự kiện 2, rồi ghép chúng lại". Bạn phát biểu hai sự kiện và một luật; <em>bộ máy suy diễn</em> tự tìm ra dây chuyền. Sự VẮNG MẶT của luồng điều khiển ấy chính là định nghĩa của khai báo.</li>
<li><strong>Cùng phép suy diễn ấy bằng Prolog</strong>, ngôn ngữ mà Hình 7.4 xếp dưới Declarative:
<pre><code>la(socrates, human).
la(human, mortal).
la(X, Z) :- la(X, Y), la(Y, Z).
?- la(socrates, mortal).      % Prolog trả lời: true</code></pre>
Ba dòng tri thức, một câu hỏi, không một thuật toán nào.</li>
<li><strong>Đã chạy thật, bằng SQL — vì SQL cũng là ngôn ngữ khai báo</strong>. Với bảng <code>la(x, y)</code> chứa hai dòng <code>('socrates','human')</code> và <code>('human','mortal')</code>, câu truy vấn <code>SELECT f1.x || ' is ' || f2.y FROM la f1 JOIN la f2 ON f1.y = f2.x;</code> in ra <strong><code>socrates is mortal</code></strong>. Cùng một suy diễn, cùng sự vắng mặt của vòng lặp — bộ máy cơ sở dữ liệu tự quyết định cách đi tìm.</li>
<li><strong>Paradigm này sống ở đâu ngày nay</strong> — deck chỉ gọi tên Prolog (AI, hệ chuyên gia, phân tích ngôn ngữ tự nhiên), nhưng ý tưởng khai báo lại là thứ thành công thương mại nhất trong bốn: mỗi câu SQL, mỗi công thức bảng tính, mỗi trang HTML đều phát biểu <em>cái gì</em> rồi để một bộ máy quyết định <em>làm thế nào</em>. Chữ "answer queries" của slide chính là chữ <em>query</em> (truy vấn) trong SQL.</li>
</ul>
<p class="dap-an">✅ Chỗ phân biệt mà đề thi muốn, mỗi ý một dòng: <strong>thủ tục và hướng đối tượng nói cho máy biết LÀM THẾ NÀO; khai báo nói cho máy biết CÁI GÌ rồi để nó tự tìm cách.</strong> Paradigm hàm nằm ở giữa — nó nói cái gì, nhưng bạn vẫn phải tự dựng ra đáp án bằng cách ghép các hàm.</p>
<p class="pitfall">⚠️ Cách hình thức hoá trên slide khá cẩu thả và có thể làm bạn rối. "Socrates là người" và "Người thì phải chết" <em>không</em> cùng một loại phát biểu — câu đầu nói một cá thể thuộc về một lớp, câu sau nói một lớp nằm trong một lớp khác. Viết cả hai thành "A is B" là giấu mất chỗ đó, và khuôn mẫu ấy vỡ trước các phản ví dụ kinh điển ("Socrates là người", "Người thì đông đảo" không suy ra "Socrates thì đông đảo"). Cứ chép lại dây chuyền của slide để lấy điểm, nhưng đừng mang cái "is" như một quan hệ vạn năng duy nhất sang bất kỳ môn logic thật nào.</p>`],

      [18, '4- Common concepts',
        `<p class="y-chinh">🎯 Section divider for 7.4, the last and easiest section. It is a vocabulary tour: six words you already use in C every day, given their precise textbook names so the exam can ask about them.</p>
<ul>
<li><strong>The six, in the order the deck takes them</strong> — identifiers (20), data types (21), variables (22), literals (23), constants (24), inputs and outputs (25). That is one slide each, and there is no difficult idea in the whole run.</li>
<li><strong>Why the section exists at all</strong> — because the six concepts are shared. FORTRAN from 1957 and Java from 1995 both have identifiers, types, variables, literals and I/O. Once you learn them once, every new language becomes a matter of learning its <em>spelling</em> for concepts you already know.</li>
<li><strong>The sentence on slide 19 that justifies the section's title</strong> — these concepts appear in object-oriented languages too "because an object-oriented paradigm uses the procedural paradigm when creating methods". In other words: the body of a Java method is procedural code. The paradigms are layered, not exclusive.</li>
<li><strong>The exam's favourite pairs</strong> — <em>variable vs constant</em> (can it change?) and <em>literal vs constant</em> (does it have a name?). Slides 23 and 24 exist almost entirely to set up that second pair, and students who skim them lose the mark.</li>
<li><strong>What the deck skips from Forouzan's Chapter 9</strong> — statements (assignment, selection, loops), subprograms, parameter passing by value and by reference, and the long Java case study. If a question about "pass by reference" appears, it is not from this deck.</li>
</ul>
<p class="meo">💡 Do this section with a C file open. Every one of the six concepts has a one-line C demonstration, and writing those six lines yourself takes ten minutes and replaces an hour of re-reading.</p>`,
        `<p class="y-chinh">🎯 Slide phân mục cho 7.4, mục cuối và dễ nhất. Đây là một chuyến đi qua từ vựng: sáu chữ mà bạn đã dùng trong C mỗi ngày, nay được trả lại đúng tên gọi trong sách để đề thi có cái mà hỏi.</p>
<ul>
<li><strong>Sáu chữ, theo thứ tự deck đi</strong> — định danh (20), kiểu dữ liệu (21), biến (22), literal (23), hằng (24), vào và ra (25). Mỗi cái một slide, và trong cả chặng không có ý tưởng nào khó.</li>
<li><strong>Vì sao mục này tồn tại</strong> — vì sáu khái niệm ấy là DÙNG CHUNG. FORTRAN năm 1957 và Java năm 1995 đều có định danh, kiểu, biến, literal và vào/ra. Học một lần rồi thì mỗi ngôn ngữ mới chỉ còn là chuyện học <em>cách viết</em> của nó cho những khái niệm bạn đã biết.</li>
<li><strong>Câu ở slide 19 biện minh cho tên mục</strong> — các khái niệm này cũng có mặt trong ngôn ngữ hướng đối tượng "bởi vì paradigm hướng đối tượng DÙNG paradigm thủ tục khi viết phương thức". Nói cách khác: thân một phương thức Java là mã thủ tục. Các paradigm xếp lớp lên nhau chứ không loại trừ nhau.</li>
<li><strong>Cặp đôi ưa thích của đề thi</strong> — <em>biến và hằng</em> (nó đổi được không?) và <em>literal và hằng</em> (nó có tên không?). Slide 23 và 24 tồn tại gần như chỉ để dựng cặp thứ hai, và ai đọc lướt hai slide ấy là mất điểm.</li>
<li><strong>Thứ deck bỏ qua so với Chương 9 của Forouzan</strong> — câu lệnh (gán, rẽ nhánh, lặp), chương trình con, truyền tham số theo trị và theo tham chiếu, và bài học tình huống dài về Java. Nếu gặp câu hỏi về "truyền theo tham chiếu" thì nó không đến từ bộ slide này.</li>
</ul>
<p class="meo">💡 Hãy học mục này với một file C đang mở. Cả sáu khái niệm đều có một dòng C minh hoạ, và tự tay viết sáu dòng ấy mất mười phút, thay được cho một giờ đọc lại slide.</p>`],

      [19, '1. Introduction (Common concepts)',
        `<p class="y-chinh">🎯 The list of six, plus one sentence that quietly settles an argument from section 7.3: these procedural concepts are also in object-oriented languages, <em>"because an object-oriented paradigm uses the procedural paradigm when creating methods"</em>.</p>
<ul>
<li><strong>The six concepts</strong> — Identifiers · Data types · Variables · Literals · Constants · Inputs and Outputs. Memorise the list as a list; "name six common concepts of procedural languages" is a plausible exam question and the order does not matter.</li>
<li><strong>Why that one sentence matters more than it looks</strong> — it tells you the paradigms are not rivals but layers. Inside <code>public int tongChan() { for (int x : so) … }</code> the <code>for</code>, the <code>int</code>, the variable and the literal are all procedural. Object-orientation organises the code <em>between</em> methods; inside a method it is business as usual.</li>
<li><strong>What binds all six together</strong> — every one of them is about <strong>naming and storing values</strong>. An identifier is a name; a data type is what may be stored; a variable is a named box; a literal is a value with no name; a constant is a named value that cannot change; input and output move values in and out. Six angles on one theme.</li>
<li><strong>Spot the gap</strong> — the section omits the two things you actually spend most of your programming time on: <em>statements</em> (if, while, for) and <em>functions</em>. They are in Forouzan's Chapter 9 but not in this deck. Do not assume "not on the slides" means "not worth knowing"; assume it means "not on this exam".</li>
<li><strong>The double dot</strong> — the slide ends with "…when creating methods..", two full stops, a typing slip. Harmless, but a useful reminder that this deck was assembled by hand and carries several such scars (see slides 6, 7, 8, 11, 16 and the numbering on 23–25).</li>
</ul>
<p class="meo">💡 A memory hook for the six: <strong>a NAME (identifier) of a TYPE holds a VALUE — sometimes in a box that changes (variable), sometimes written raw (literal), sometimes named but frozen (constant) — and values arrive and leave through I/O.</strong> One sentence, all six words, in order.</p>`,
        `<p class="y-chinh">🎯 Danh sách sáu khái niệm, cộng một câu lặng lẽ khép lại một tranh cãi từ mục 7.3: những khái niệm thủ tục này cũng có trong ngôn ngữ hướng đối tượng, <em>"bởi vì paradigm hướng đối tượng dùng paradigm thủ tục khi viết phương thức"</em>.</p>
<ul>
<li><strong>Sáu khái niệm</strong> — Định danh · Kiểu dữ liệu · Biến · Literal · Hằng · Vào và Ra. Hãy học danh sách này như một danh sách; "kể tên sáu khái niệm chung của các ngôn ngữ thủ tục" là câu hỏi thi có lý, và thứ tự không quan trọng.</li>
<li><strong>Vì sao đúng câu ấy quan trọng hơn vẻ ngoài của nó</strong> — nó cho biết các paradigm không phải đối thủ mà là các LỚP. Bên trong <code>public int tongChan() { for (int x : so) … }</code> thì cái <code>for</code>, cái <code>int</code>, cái biến và cái literal đều là thủ tục cả. Hướng đối tượng tổ chức mã ở <em>giữa</em> các phương thức; còn bên trong một phương thức thì mọi thứ vẫn như cũ.</li>
<li><strong>Thứ buộc cả sáu lại với nhau</strong> — cả sáu đều nói về chuyện <strong>ĐẶT TÊN và LƯU GIÁ TRỊ</strong>. Định danh là cái tên; kiểu dữ liệu là thứ được phép lưu; biến là cái hộp có tên; literal là giá trị không tên; hằng là giá trị có tên mà không đổi được; vào/ra là đường giá trị đi vào và đi ra. Sáu góc nhìn của một chủ đề.</li>
<li><strong>Nhìn ra chỗ hụt</strong> — mục này bỏ qua đúng hai thứ bạn tốn nhiều thời gian lập trình nhất: <em>câu lệnh</em> (if, while, for) và <em>hàm</em>. Chúng nằm trong Chương 9 của Forouzan nhưng không có trong deck. Đừng cho rằng "không có trên slide" nghĩa là "không đáng biết"; hãy hiểu là "không có trong đề thi này".</li>
<li><strong>Dấu chấm kép</strong> — slide kết thúc bằng "…when creating methods..", hai dấu chấm, một lỗi gõ. Vô hại, nhưng là lời nhắc hữu ích rằng deck này được ghép bằng tay và mang khá nhiều vết sẹo loại đó (xem slide 6, 7, 8, 11, 16 và cách đánh số ở 23–25).</li>
</ul>
<p class="meo">💡 Móc nhớ cho sáu chữ: <strong>một CÁI TÊN (định danh) thuộc một KIỂU giữ một GIÁ TRỊ — khi thì trong cái hộp đổi được (biến), khi thì viết trần ra (literal), khi thì có tên mà đông cứng (hằng) — và giá trị đi vào đi ra qua VÀO/RA.</strong> Một câu, đủ sáu chữ, đúng thứ tự.</p>`],

      [20, '2. Identifiers',
        `<p class="y-chinh">🎯 <strong>An identifier is the name of an object</strong> — "one feature present in all procedural languages, as well as in other languages". Figure 7.10 labels a small Java program to show that one mechanism names four different kinds of thing.</p>
<ul>
<li><strong>Read Figure 7.10's four labels</strong> — <code>public class <strong>Demo</strong></code> is a <em>class name</em>; <code><strong>main</strong>(String[] args)</code> is a <em>method name</em>; <code>String[] <strong>args</strong></code> is a <em>variable name</em>; <code>int <strong>x</strong>=100;</code> is a <em>variable name</em>. Same rules, four roles.</li>
<li><strong>The rules in C, which the slide does not state</strong> — letters, digits and underscore only; must not start with a digit; case-sensitive (<code>Count</code> and <code>count</code> are two different identifiers); and <strong>keywords are forbidden</strong>. Try <code>int int = 5;</code> and clang refuses: <code>error: cannot combine with previous 'int' declaration specifier</code>, then <code>expected identifier</code>.</li>
<li><strong>Why the compiler needs this so badly</strong> — the lexical analyzer of slide 11 has to decide, for every word it meets, "keyword or identifier?". That decision is made <em>by table lookup against a fixed list</em>, which is exactly why the keyword list must be closed and why you cannot extend it.</li>
<li><strong>Identifiers vanish during translation</strong> — a name is for humans. Compile and look at the assembly: your variable <code>b</code> becomes the label <code>_b</code>, and a local variable becomes a raw offset such as <code>[x29, #-8]</code>, with no name at all. By the machine-code stage of slide 6, every identifier has been replaced by an address. That is why debugging optimised code is painful, and why <code>-g</code> exists to put the names back in a side table.</li>
<li><strong>The style rule that earns marks in every later subject</strong> — an identifier should say what the thing <em>is</em>. <code>int d;</code> versus <code>int diemTrungBinh;</code> costs fifteen keystrokes once and saves you re-reading the program every time. The C++ example on slide 8 already models this: <code>number1</code>, <code>number2</code>, <code>result</code>.</li>
</ul>
<p class="pitfall">⚠️ Slide numbering breaks here in a way that persists to the end of the deck: section 7.4 starts at "1. Introduction" (19), then "2. Identifiers" (20), "3. Data types" (21), "4. Variables" (22), then <strong>"5. Literals" (23) and "5. Constants" (24) — two number fives</strong> — and finally "7. Inputs and Outputs" (25), so there is no item 6 in the deck at all. Nothing is missing from the content; only the numbers are wrong. Do not go looking for a lost slide.</p>`,
        `<p class="y-chinh">🎯 <strong>Định danh là TÊN của một đối tượng</strong> — "một đặc điểm có mặt trong mọi ngôn ngữ thủ tục, cũng như trong các ngôn ngữ khác". Hình 7.10 dán nhãn lên một chương trình Java nhỏ để cho thấy cùng một cơ chế đặt tên cho bốn loại thứ khác nhau.</p>
<ul>
<li><strong>Đọc bốn cái nhãn của Hình 7.10</strong> — <code>public class <strong>Demo</strong></code> là <em>tên lớp</em>; <code><strong>main</strong>(String[] args)</code> là <em>tên phương thức</em>; <code>String[] <strong>args</strong></code> là <em>tên biến</em>; <code>int <strong>x</strong>=100;</code> là <em>tên biến</em>. Cùng luật, bốn vai.</li>
<li><strong>Luật đặt tên trong C, thứ slide không nêu</strong> — chỉ gồm chữ cái, chữ số và dấu gạch dưới; không được bắt đầu bằng chữ số; phân biệt hoa thường (<code>Count</code> và <code>count</code> là hai định danh khác nhau); và <strong>cấm dùng từ khoá</strong>. Thử <code>int int = 5;</code> thì clang từ chối: <code>error: cannot combine with previous 'int' declaration specifier</code>, rồi <code>expected identifier</code>.</li>
<li><strong>Vì sao trình biên dịch cần điều này đến thế</strong> — bộ phân tích từ vựng ở slide 11 phải quyết định, với mỗi chữ nó gặp, "từ khoá hay định danh?". Quyết định ấy được làm <em>bằng cách tra bảng một danh sách cố định</em>, và đó đúng là lý do danh sách từ khoá phải ĐÓNG và bạn không nới rộng nó được.</li>
<li><strong>Định danh biến mất trong lúc dịch</strong> — cái tên là dành cho con người. Biên dịch rồi nhìn hợp ngữ: biến <code>b</code> của bạn thành nhãn <code>_b</code>, còn biến cục bộ thành một độ dời trần trụi kiểu <code>[x29, #-8]</code>, chẳng còn tên nào. Đến giai đoạn mã máy của slide 6 thì mọi định danh đã bị thay bằng địa chỉ. Vì thế gỡ lỗi mã đã tối ưu mới khổ sở, và vì thế mới có cờ <code>-g</code> để nhét tên trở lại vào một bảng bên cạnh.</li>
<li><strong>Quy tắc đặt tên kiếm điểm cho bạn ở mọi môn sau</strong> — định danh phải nói lên thứ đó <em>là gì</em>. <code>int d;</code> so với <code>int diemTrungBinh;</code> tốn thêm mười lăm phím đúng một lần, mà tiết kiệm cho bạn khỏi phải đọc lại chương trình mỗi lần quay về. Ví dụ C++ ở slide 8 đã làm mẫu sẵn: <code>number1</code>, <code>number2</code>, <code>result</code>.</li>
</ul>
<p class="pitfall">⚠️ Cách đánh số mục vỡ từ đây và vỡ tới hết deck: mục 7.4 bắt đầu bằng "1. Introduction" (19), rồi "2. Identifiers" (20), "3. Data types" (21), "4. Variables" (22), rồi <strong>"5. Literals" (23) và "5. Constants" (24) — hai cái số năm</strong> — và cuối cùng là "7. Inputs and Outputs" (25), nên trong deck không hề có mục số 6. Không thiếu nội dung nào cả; chỉ có số là sai. Đừng đi tìm một slide thất lạc.</p>`],

      [21, '3. Data types',
        `<p class="y-chinh">🎯 The definition, and it has <strong>two</strong> halves that students routinely reduce to one: a data type defines <em>a set of values</em> <strong>AND</strong> <em>a set of operations that can be applied to those values</em>. The set of values is called the <strong>domain</strong> of the type.</p>
<ul>
<li><strong>Why the second half is the important one</strong> — "int" is not just "whole numbers". It is whole numbers <em>together with</em> +, −, ×, /, %, comparison. Strings have concatenation but not division. That is why <code>"abc" / 2</code> is an error in every language: the value is fine, the <em>operation</em> is not in the type's set.</li>
<li><strong>Two categories</strong> — <strong>simple</strong> types (called <em>primitive</em> in Java) and <strong>composite</strong> types (<em>non-primitive</em> in Java). Simple = one indivisible value. Composite = built from other types: arrays, structs, classes, strings.</li>
<li><strong>Figure 7.11 decoded</strong> — the tree splits Data Type into Primitive and Non-Primitive. Under Primitive: <em>boolean</em> and <em>Numeric</em>; Numeric splits into <em>Integer</em> (byte, short, int, long) and <em>Floating</em> (float, double). Under Non-Primitive: <em>Class, Array, Interface, String</em>.</li>
<li><strong>The domain, measured for real</strong> — in C on this arm64 machine, <code>sizeof</code> gives char 1, short 2, int 4, long 8, float 4, double 8 bytes; an <code>int</code>'s domain therefore runs from −2 147 483 648 to <strong>2 147 483 647</strong>. In Java, <code>Integer.MAX_VALUE</code> prints the identical <strong>2147483647</strong> — but for a different reason: Java <em>fixes</em> its sizes by specification, while C only guarantees minimums and lets the machine decide. Same number here, different guarantee.</li>
<li><strong>Where you have already been bitten</strong> — this is the domain that overflows in Chapter 3 of CSI106, and the reason <code>int</code> cannot hold a 13-digit bank balance. Type = values + operations, and the values run out.</li>
</ul>
<p class="pitfall">⚠️ Figure 7.11 has a real defect: the node <strong>"Integer" appears twice, nested inside itself</strong> — Numeric → Integer → {Integer, char}. In Java's actual hierarchy the numeric integral types are byte, short, int, long, char, and <code>char</code> is an unsigned 16-bit integral type, not a sub-kind of "Integer". Also note the figure is Java-specific: it says <code>String</code> is non-primitive, which is true in Java but meaningless in C, where a string is an array of <code>char</code>. Answer Java questions from the figure, C questions from C.</p>`,
        `<p class="y-chinh">🎯 Định nghĩa, và nó có <strong>HAI</strong> nửa mà sinh viên hay rút gọn còn một: một kiểu dữ liệu xác định <em>một tập giá trị</em> <strong>VÀ</strong> <em>một tập phép toán áp được lên những giá trị đó</em>. Tập giá trị ấy gọi là <strong>miền (domain)</strong> của kiểu.</p>
<ul>
<li><strong>Vì sao nửa thứ hai mới là nửa quan trọng</strong> — "int" không chỉ là "các số nguyên". Nó là các số nguyên <em>cùng với</em> +, −, ×, /, %, và phép so sánh. Chuỗi có phép nối nhưng không có phép chia. Vì thế <code>"abc" / 2</code> là lỗi trong mọi ngôn ngữ: giá trị thì ổn, nhưng <em>phép toán</em> không nằm trong tập của kiểu.</li>
<li><strong>Hai nhóm</strong> — kiểu <strong>đơn giản</strong> (Java gọi là <em>primitive</em>) và kiểu <strong>phức hợp</strong> (Java gọi là <em>non-primitive</em>). Đơn giản = một giá trị không chia nhỏ được. Phức hợp = dựng từ những kiểu khác: mảng, struct, lớp, chuỗi.</li>
<li><strong>Giải mã Hình 7.11</strong> — cây chia Data Type thành Primitive và Non-Primitive. Dưới Primitive: <em>boolean</em> và <em>Numeric</em>; Numeric chia tiếp thành <em>Integer</em> (byte, short, int, long) và <em>Floating</em> (float, double). Dưới Non-Primitive: <em>Class, Array, Interface, String</em>.</li>
<li><strong>Miền giá trị, đo thật</strong> — trong C trên chính cái máy arm64 này, <code>sizeof</code> cho char 1, short 2, int 4, long 8, float 4, double 8 byte; nên miền của <code>int</code> chạy từ −2.147.483.648 tới <strong>2.147.483.647</strong>. Trong Java, <code>Integer.MAX_VALUE</code> in ra đúng <strong>2147483647</strong> — nhưng vì lý do khác: Java <em>cố định</em> kích thước bằng đặc tả, còn C chỉ bảo đảm mức tối thiểu rồi để máy tự quyết. Ở đây cùng một con số, nhưng lời bảo đảm thì khác nhau.</li>
<li><strong>Chỗ bạn đã từng bị cắn</strong> — đây chính là cái miền bị tràn ở Chương 3 của CSI106, và là lý do <code>int</code> không chứa nổi số dư tài khoản 13 chữ số. Kiểu = giá trị + phép toán, và giá trị thì có lúc hết.</li>
</ul>
<p class="pitfall">⚠️ Hình 7.11 có một lỗi thật: nút <strong>"Integer" xuất hiện HAI lần, lồng vào chính nó</strong> — Numeric → Integer → {Integer, char}. Trong cây kiểu thật của Java thì các kiểu nguyên gồm byte, short, int, long, char, và <code>char</code> là kiểu nguyên 16 bit không dấu chứ không phải một nhánh con của "Integer". Cũng lưu ý hình này riêng cho Java: nó xếp <code>String</code> vào non-primitive, đúng với Java nhưng vô nghĩa với C, nơi chuỗi là một mảng <code>char</code>. Câu hỏi Java thì trả lời theo hình, câu hỏi C thì trả lời theo C.</p>`],

      [22, '4. Variables',
        `<p class="y-chinh">🎯 One sentence, and it is the best definition in the whole chapter: <strong>"Variables are names for memory locations."</strong> Not "a box", not "a container" — a <em>name for an address</em>. Everything else about variables follows from that.</p>
<ul>
<li><strong>The justification given</strong> — "although the addresses are used by the computer internally, it is very inconvenient for the programmer to use addresses". This is precisely the assembly-language improvement of slide 7 (address <code>40</code> became the name <code>Number1</code>), now offered to you in a high-level language.</li>
<li><strong>Figure 7.12 dissects one declaration</strong> — <code>int count = 100;</code> with three arrows: <em>Data type</em> → <code>int</code>, <em>Variable name</em> → <code>count</code>, <em>Value</em> → <code>100</code>. Three of the six concepts of section 7.4 appear in one line of code: a type (slide 21), an identifier (slide 20), and a literal (slide 23).</li>
<li><strong>Proof that a variable really is an address</strong> — in C you can print it. <code>&amp;count</code> is the address of the memory location, and that is why <code>scanf("%d", &amp;num)</code> on slide 25 needs the ampersand: <code>scanf</code> must be told <em>where</em> to put what it reads, not what the variable currently holds.</li>
<li><strong>The name is gone by run time</strong> — look again at the real assembly from slide 7: the global <code>b</code> becomes the label <code>_b</code> and is then reached through a computed address <code>[x8, _b@PAGEOFF]</code>. The CPU never sees "count". The name exists only in the source file and in the compiler's symbol table.</li>
<li><strong>Variable vs constant, set up here and settled on slide 24</strong> — a variable's value may change while the program runs; that is the whole point of the word <em>variable</em>. Write a value there once and never change it and you have made a constant by convention only — the language will not enforce it unless you say <code>const</code>.</li>
</ul>
<p class="meo">💡 Three questions answer almost any exam item about a declaration, and <code>int count = 100;</code> answers all three: <em>what type?</em> (int — the set of values and operations) · <em>what name?</em> (count — the identifier standing for an address) · <em>what initial value?</em> (100 — a literal). Learn to say all three of a declaration and slides 20–24 collapse into one skill.</p>`,
        `<p class="y-chinh">🎯 Một câu, và là định nghĩa hay nhất cả chương: <strong>"Biến là TÊN GỌI của các ô nhớ."</strong> Không phải "cái hộp", không phải "cái thùng chứa" — mà là <em>một cái tên cho một địa chỉ</em>. Mọi thứ khác về biến đều suy ra từ đó.</p>
<ul>
<li><strong>Lý do slide đưa ra</strong> — "tuy máy tính dùng địa chỉ ở bên trong, nhưng người lập trình dùng địa chỉ thì rất bất tiện". Đây đúng là bước cải tiến của hợp ngữ ở slide 7 (địa chỉ <code>40</code> thành cái tên <code>Number1</code>), nay được trao cho bạn trong một ngôn ngữ bậc cao.</li>
<li><strong>Hình 7.12 mổ xẻ một câu khai báo</strong> — <code>int count = 100;</code> với ba mũi tên: <em>Data type</em> → <code>int</code>, <em>Variable name</em> → <code>count</code>, <em>Value</em> → <code>100</code>. Ba trong sáu khái niệm của mục 7.4 cùng hiện ra trong một dòng mã: một kiểu (slide 21), một định danh (slide 20), và một literal (slide 23).</li>
<li><strong>Bằng chứng biến thật sự là một địa chỉ</strong> — trong C bạn in nó ra được. <code>&amp;count</code> chính là địa chỉ của ô nhớ, và đó là lý do <code>scanf("%d", &amp;num)</code> ở slide 25 cần dấu và: phải nói cho <code>scanf</code> biết CHỖ để đặt thứ nó đọc được, chứ không phải nói cho nó biến đang giữ giá trị gì.</li>
<li><strong>Cái tên biến mất khi chạy</strong> — nhìn lại hợp ngữ thật ở slide 7: biến toàn cục <code>b</code> thành nhãn <code>_b</code> rồi được với tới qua một địa chỉ tính ra <code>[x8, _b@PAGEOFF]</code>. CPU không bao giờ thấy chữ "count". Cái tên chỉ sống trong file nguồn và trong bảng ký hiệu của trình biên dịch.</li>
<li><strong>Biến và hằng, dựng ở đây và chốt ở slide 24</strong> — giá trị của biến CÓ THỂ đổi trong lúc chương trình chạy; đó chính là toàn bộ ý nghĩa của chữ <em>biến</em>. Ghi vào đó một lần rồi không bao giờ đổi nữa thì bạn mới chỉ tạo ra một hằng theo quy ước — ngôn ngữ sẽ không cưỡng chế điều đó trừ khi bạn nói <code>const</code>.</li>
</ul>
<p class="meo">💡 Ba câu hỏi trả lời được gần như mọi câu thi về một dòng khai báo, và <code>int count = 100;</code> trả lời đủ cả ba: <em>kiểu gì?</em> (int — tập giá trị và tập phép toán) · <em>tên gì?</em> (count — định danh đứng thay cho một địa chỉ) · <em>giá trị ban đầu gì?</em> (100 — một literal). Tập nói đủ ba điều ấy về một câu khai báo thì slide 20–24 gộp lại thành đúng một kỹ năng.</p>`],

      [23, '5. Literals',
        `<p class="y-chinh">🎯 <strong>A literal is a predetermined value used in a program</strong> — a value written straight into the code, with no name of its own. The slide's example: computing the area of a circle as <code>3.14 × r2</code>, where <code>3.14</code> is a literal standing in for π.</p>
<ul>
<li><strong>Figure 7.13 makes the pairing explicit</strong> — <code>int number = 20;</code> with two arrows: <code>number</code> is the <em>Variable</em>, <code>20</code> is the <em>Literal</em>. One has a name and a memory location; the other has neither. That is the whole distinction, and it is the likely exam question.</li>
<li><strong>Every kind of literal you already use in C</strong> — integer <code>42</code>, floating <code>3.14</code>, character <code>'A'</code>, string <code>"xin chao"</code>. Look back at slide 25: in <code>printf("The value of the number is: %d", num)</code>, the format string is a <em>string literal</em> and <code>num</code> is a variable. You have been writing literals since your first program.</li>
<li><strong>Literals are baked into the object file</strong> — compile the little <code>add.c</code> from slide 11 and the assembly ends with <code>l_.str: .asciz "%d %d"</code> and <code>l_.str.1: .asciz "%d\\n"</code>. Your two string literals became read-only data inside the executable. They are decided at <em>compile time</em>, which is exactly what "predetermined" means.</li>
<li><strong>Why <code>3.14</code> specifically is a bad idea — measured.</strong> For <code>r = 100</code>: using the literal <code>3.14</code> gives an area of <strong>31 400.000000</strong>; using the proper constant <code>M_PI</code> gives <strong>31 415.926536</strong>. The error is <strong>15.93</strong> square units, about 0.05 %. On a circle of radius 100 metres that is nearly 16 square metres of land — invented by a typing convenience.</li>
<li><strong>Read the slide's own maths carefully</strong> — it prints "3.14 × r2", which is <code>3.14 × r²</code> with the superscript lost when the text was flattened. The area of a circle is πr², not π × r × 2. The formula is right; the typography failed.</li>
</ul>
<p class="dap-an">✅ How to define a literal in one exam line: <strong>a literal is a fixed value written directly in the source code, which has no identifier and occupies no named memory location — unlike a variable, whose name refers to an address whose content can change.</strong></p>
<p class="pitfall">⚠️ The real trap of literals is not accuracy, it is the <em>magic number</em>: a bare <code>0.08</code> scattered through a program is unsearchable and unexplainable, and when the tax rate changes you must find every copy of it. Slide 24 is the cure, and the two slides must be read as one argument.</p>`,
        `<p class="y-chinh">🎯 <strong>Literal là một giá trị định sẵn dùng trong chương trình</strong> — một giá trị viết thẳng vào mã, không có tên riêng. Ví dụ của slide: tính diện tích hình tròn bằng <code>3.14 × r2</code>, trong đó <code>3.14</code> là literal đứng thay cho π.</p>
<ul>
<li><strong>Hình 7.13 chỉ rõ cặp đôi ấy</strong> — <code>int number = 20;</code> với hai mũi tên: <code>number</code> là <em>Variable</em>, <code>20</code> là <em>Literal</em>. Cái này có tên và có ô nhớ; cái kia không có cả hai. Đó là toàn bộ chỗ phân biệt, và cũng là câu hỏi thi khả dĩ nhất.</li>
<li><strong>Mọi loại literal bạn đã dùng trong C</strong> — nguyên <code>42</code>, thực <code>3.14</code>, ký tự <code>'A'</code>, chuỗi <code>"xin chao"</code>. Nhìn lại slide 25: trong <code>printf("The value of the number is: %d", num)</code>, chuỗi định dạng là một <em>literal chuỗi</em> còn <code>num</code> là biến. Bạn đã viết literal từ chương trình đầu tiên của mình.</li>
<li><strong>Literal được nướng thẳng vào file đối tượng</strong> — biên dịch cái <code>add.c</code> bé tí ở slide 11 thì phần cuối hợp ngữ có <code>l_.str: .asciz "%d %d"</code> và <code>l_.str.1: .asciz "%d\\n"</code>. Hai literal chuỗi của bạn đã thành dữ liệu chỉ-đọc nằm trong file chạy. Chúng được chốt ở <em>thời điểm biên dịch</em>, đúng nghĩa chữ "định sẵn".</li>
<li><strong>Vì sao riêng <code>3.14</code> là ý tồi — đã đo.</strong> Với <code>r = 100</code>: dùng literal <code>3.14</code> cho diện tích <strong>31.400,000000</strong>; dùng hằng tử tế <code>M_PI</code> cho <strong>31.415,926536</strong>. Sai lệch là <strong>15,93</strong> đơn vị diện tích, khoảng 0,05 %. Trên hình tròn bán kính 100 mét thì đó là gần 16 mét vuông đất — sinh ra chỉ vì một cái tiện tay khi gõ.</li>
<li><strong>Đọc kỹ chính công thức của slide</strong> — nó in ra "3.14 × r2", tức <code>3,14 × r²</code> mà số mũ bị rụng khi chữ bị làm phẳng. Diện tích hình tròn là πr², không phải π × r × 2. Công thức thì đúng; lỗi nằm ở cách trình bày.</li>
</ul>
<p class="dap-an">✅ Định nghĩa literal gói trong một dòng để đi thi: <strong>literal là một giá trị cố định viết trực tiếp trong mã nguồn, không có định danh và không chiếm một ô nhớ có tên — khác với biến, vốn có tên trỏ tới một địa chỉ mà nội dung thay đổi được.</strong></p>
<p class="pitfall">⚠️ Cái bẫy thật của literal không phải là độ chính xác, mà là <em>con số ma</em>: một số <code>0.08</code> trần trụi rải rác khắp chương trình thì không tìm ra được và không giải thích được, và khi thuế suất đổi bạn phải lần cho hết mọi bản sao của nó. Slide 24 là thuốc chữa, và hai slide phải được đọc như một lập luận duy nhất.</p>`],

      [24, '5. Constants',
        `<p class="y-chinh">🎯 The argument that finishes slide 23: <strong>using literals is not good practice unless the value can never change</strong> (π is fine). Most values do change — "if a sales tax is 8 per cent this year, it may not be the same next year". The fix is a <strong>constant</strong>: a value that has a <em>name</em> but cannot be reassigned.</p>
<ul>
<li><strong>Figure 7.14 is the pattern to copy</strong> — <code>const float taxMultiplier = 1.08;</code> … <code>cost = price * taxMultiplier;</code>. Declared once at the top, used wherever needed. Next year, one edit in one place and every calculation in the program follows.</li>
<li><strong>The three-way distinction the exam wants</strong>:
<table>
<tr><th></th><th>Has a name?</th><th>Can change while running?</th><th>Example</th></tr>
<tr><td><strong>Literal</strong></td><td>no</td><td>— (it is a value, not storage)</td><td><code>1.08</code></td></tr>
<tr><td><strong>Variable</strong></td><td>yes</td><td>yes</td><td><code>float price;</code></td></tr>
<tr><td><strong>Constant</strong></td><td>yes</td><td>no</td><td><code>const float taxMultiplier = 1.08f;</code></td></tr>
</table></li>
<li><strong>The compiler enforces it — demonstrated.</strong> Take the slide's own declaration, then try to assign to it: <code>taxMultiplier = 1.10f;</code>. clang refuses with <code>error: cannot assign to variable 'taxMultiplier' with const-qualified type 'const float'</code>, and helpfully points back at the declaration. Note <em>where</em> this is caught: at compile time, by the semantic analyzer of slide 11. Nothing is checked while the program runs, so the protection costs zero speed.</li>
<li><strong>Two ways to write a constant in C</strong> — <code>const float TAX = 1.08f;</code> (a real typed, read-only variable) and <code>#define TAX 1.08f</code> (a preprocessor substitution done in step 1 of slide 11, before the compiler even sees the file — which is why <code>#define</code> mistakes produce such confusing error messages). Java has only the first, spelled <code>final</code>.</li>
<li><strong>Naming convention, and why it is not decoration</strong> — constants are conventionally written <code>UPPER_CASE</code> (<code>MAX_SIZE</code>, <code>PI</code>) precisely so a reader can tell at a glance that a name will not change under them. Forouzan's own example uses camelCase; the convention differs by language, and the exam will not test it.</li>
</ul>
<p class="dap-an">✅ Exam answer in one sentence: <strong>a literal is an unnamed fixed value written in the code; a constant is the same value given an identifier and protected from reassignment, so that changing it later means editing exactly one line.</strong></p>
<p class="pitfall">⚠️ This slide is numbered "5." and so is slide 23 — the deck has two item fives and no item six. Also note the slide writes <code>const float taxMultiplier = 1.08;</code> without the <code>f</code> suffix: in C and C++ the literal <code>1.08</code> is a <code>double</code> and is silently narrowed to <code>float</code>, which is harmless here but is exactly the kind of implicit conversion the semantic analyzer would flag under stricter settings. Do not copy the slide's style into an assignment without thinking.</p>`,
        `<p class="y-chinh">🎯 Lập luận khép lại slide 23: <strong>dùng literal không phải là thói quen tốt, trừ khi giá trị ấy không bao giờ đổi</strong> (π thì được). Đa số giá trị thì có đổi — "nếu năm nay thuế bán hàng là 8 phần trăm, sang năm có thể không còn thế". Thuốc chữa là <strong>hằng</strong>: một giá trị có <em>tên</em> nhưng không gán lại được.</p>
<ul>
<li><strong>Hình 7.14 là khuôn mẫu để chép</strong> — <code>const float taxMultiplier = 1.08;</code> … <code>cost = price * taxMultiplier;</code>. Khai một lần ở đầu file, dùng ở mọi chỗ cần. Sang năm, sửa một chỗ là mọi phép tính trong chương trình đi theo.</li>
<li><strong>Phép phân biệt ba đường mà đề thi muốn</strong>:
<table>
<tr><th></th><th>Có tên không?</th><th>Đổi được lúc chạy không?</th><th>Ví dụ</th></tr>
<tr><td><strong>Literal</strong></td><td>không</td><td>— (nó là giá trị, không phải ô nhớ)</td><td><code>1.08</code></td></tr>
<tr><td><strong>Biến</strong></td><td>có</td><td>có</td><td><code>float price;</code></td></tr>
<tr><td><strong>Hằng</strong></td><td>có</td><td>không</td><td><code>const float taxMultiplier = 1.08f;</code></td></tr>
</table></li>
<li><strong>Trình biên dịch cưỡng chế điều đó — đã chứng minh.</strong> Lấy đúng câu khai báo của slide rồi thử gán vào nó: <code>taxMultiplier = 1.10f;</code>. clang từ chối với <code>error: cannot assign to variable 'taxMultiplier' with const-qualified type 'const float'</code>, và tử tế chỉ ngược về dòng khai báo. Để ý nó bị bắt Ở ĐÂU: lúc biên dịch, bởi bộ phân tích ngữ nghĩa của slide 11. Lúc chạy không có phép kiểm nào cả, nên sự bảo vệ này tốn 0 tốc độ.</li>
<li><strong>Hai cách viết hằng trong C</strong> — <code>const float TAX = 1.08f;</code> (một biến thật, có kiểu, chỉ-đọc) và <code>#define TAX 1.08f</code> (một phép thay thế của bộ tiền xử lý, làm ở bước 1 của slide 11, trước cả khi trình biên dịch nhìn thấy file — vì thế lỗi <code>#define</code> mới cho ra những dòng báo lỗi khó hiểu đến vậy). Java chỉ có cách đầu, viết là <code>final</code>.</li>
<li><strong>Quy ước đặt tên, và vì sao nó không phải trang trí</strong> — hằng theo lệ được viết <code>CHỮ_HOA</code> (<code>MAX_SIZE</code>, <code>PI</code>) chính là để người đọc liếc một cái là biết cái tên đó sẽ không đổi dưới chân mình. Ví dụ của Forouzan lại dùng camelCase; quy ước khác nhau tuỳ ngôn ngữ, và đề thi sẽ không kiểm chỗ này.</li>
</ul>
<p class="dap-an">✅ Câu trả lời thi gói trong một câu: <strong>literal là giá trị cố định không tên viết thẳng trong mã; hằng là chính giá trị ấy được đặt cho một định danh và được bảo vệ khỏi việc gán lại, nhờ vậy muốn đổi nó về sau chỉ phải sửa đúng một dòng.</strong></p>
<p class="pitfall">⚠️ Slide này đánh số "5." và slide 23 cũng vậy — deck có hai mục số năm và không có mục số sáu. Cũng lưu ý slide viết <code>const float taxMultiplier = 1.08;</code> mà không có hậu tố <code>f</code>: trong C và C++ thì literal <code>1.08</code> là <code>double</code> và bị thu hẹp âm thầm về <code>float</code>, ở đây thì vô hại nhưng đúng là loại chuyển kiểu ngầm mà bộ phân tích ngữ nghĩa sẽ cảnh báo nếu bật chế độ chặt hơn. Đừng chép nguyên lối viết của slide vào bài tập mà không suy nghĩ.</p>`],

      [25, '7. Inputs and Outputs',
        `<p class="y-chinh">🎯 The last concept, and the last slide. <strong>Almost every program needs to read and/or write data</strong>, and "most programming languages use a <em>predefined function</em> for input and output" — the two shown are C's <code>scanf</code> and <code>printf</code>.</p>
<ul>
<li><strong>The two examples exactly as printed</strong> — input: <code>scanf ("%d", &amp;num);</code> · output: <code>printf ("The value of the number is: %d", num);</code>. Between them they contain a format string literal, a conversion specifier, a variable, and an address-of operator: four ideas from this chapter in two lines.</li>
<li><strong>The <code>&amp;</code> that everyone forgets, explained by slide 22</strong> — <code>printf</code> receives the <em>value</em> of <code>num</code>, so it is written plainly. <code>scanf</code> must <em>modify</em> <code>num</code>, so it needs the memory location, which is what <code>&amp;num</code> means. "A variable is a name for a memory location" (slide 22) is the whole explanation for a punctuation mark that costs first-year students hours.</li>
<li><strong>"A statement or a predefined function"</strong> — the slide draws the distinction carefully, and it is a real one across languages. In Pascal and old BASIC, input/output is a <em>statement</em> built into the grammar (<code>READ</code>, <code>PRINT</code>). In C it is an ordinary library <strong>function</strong> that the compiler knows nothing special about — which is why you must <code>#include &lt;stdio.h&gt;</code>, and why forgetting the library is a <em>link</em> error, as slide 11 showed.</li>
<li><strong>Verified end to end</strong> — the 122-byte program of slide 11 is precisely these two calls: <code>scanf("%d %d", &amp;a, &amp;b); printf("%d\\n", a + b);</code>. Compiled through all four steps and fed <code>7 35</code>, it prints <strong>42</strong>. That one program is the whole chapter in miniature: high-level source (7.1), translated in four steps (7.2), written procedurally (7.3), using identifiers, a type, variables, literals and I/O (7.4).</li>
<li><strong>Why I/O is the hard part in real systems</strong> — the slide admits it ("these operations can be quite complex, especially when we read and write large files"). Input is where a program meets the outside world, so it is where the errors live: wrong format, end of file, and the unchecked return value of <code>scanf</code> that silently leaves your variable uninitialised.</li>
</ul>
<p class="dap-an">✅ The one thing to carry out of Chapter 7, if you carry only one: <strong>writing (high-level source) · translating (compiler or interpreter) · running (machine code) are three separate moments</strong>, and every concept in this chapter belongs to exactly one of them. Identifiers and literals belong to writing. Syntax and type errors belong to translating. Wrong answers and crashes belong to running.</p>
<p class="pitfall">⚠️ The deck ends abruptly — no summary slide, and the last bullet stops at "…by either a statement or a predefined function" with no closing example beyond the two boxes. Nothing was lost; Forouzan's chapter continues with statements and subprograms, which this course does not cover. Also note this slide is numbered "7." while the previous two are both "5.", so the deck has no item 6 at all.</p>`,
        `<p class="y-chinh">🎯 Khái niệm cuối, và cũng là slide cuối. <strong>Gần như mọi chương trình đều cần đọc và/hoặc ghi dữ liệu</strong>, và "phần lớn ngôn ngữ lập trình dùng một <em>hàm định nghĩa sẵn</em> cho việc vào và ra" — hai cái được trưng ra là <code>scanf</code> và <code>printf</code> của C.</p>
<ul>
<li><strong>Hai ví dụ, đúng như in trên slide</strong> — vào: <code>scanf ("%d", &amp;num);</code> · ra: <code>printf ("The value of the number is: %d", num);</code>. Gộp lại chúng chứa một literal chuỗi định dạng, một đặc tả chuyển đổi, một biến, và một toán tử lấy địa chỉ: bốn ý của cả chương trong hai dòng.</li>
<li><strong>Dấu <code>&amp;</code> mà ai cũng quên, được slide 22 giải thích</strong> — <code>printf</code> nhận <em>giá trị</em> của <code>num</code>, nên viết trần. <code>scanf</code> phải <em>sửa</em> <code>num</code>, nên nó cần ô nhớ, và đó chính là nghĩa của <code>&amp;num</code>. Câu "biến là tên gọi của một ô nhớ" (slide 22) là toàn bộ lời giải thích cho một dấu chấm câu đã lấy đi hàng giờ của sinh viên năm nhất.</li>
<li><strong>"Một câu lệnh hoặc một hàm định nghĩa sẵn"</strong> — slide phân biệt rất cẩn thận, và đó là sự phân biệt có thật giữa các ngôn ngữ. Trong Pascal và BASIC cũ, vào/ra là <em>câu lệnh</em> nằm trong chính ngữ pháp (<code>READ</code>, <code>PRINT</code>). Trong C nó là một <strong>hàm</strong> thư viện bình thường mà trình biên dịch chẳng biết gì đặc biệt về nó — vì thế bạn mới phải <code>#include &lt;stdio.h&gt;</code>, và vì thế quên thư viện mới là lỗi <em>liên kết</em>, như slide 11 đã cho thấy.</li>
<li><strong>Đã kiểm từ đầu tới cuối</strong> — chương trình 122 byte ở slide 11 chính là hai lời gọi này: <code>scanf("%d %d", &amp;a, &amp;b); printf("%d\\n", a + b);</code>. Dịch qua đủ bốn bước rồi nạp vào <code>7 35</code>, nó in ra <strong>42</strong>. Đúng một chương trình ấy là cả chương này thu nhỏ: mã nguồn bậc cao (7.1), dịch qua bốn bước (7.2), viết theo lối thủ tục (7.3), dùng định danh, kiểu, biến, literal và vào/ra (7.4).</li>
<li><strong>Vì sao vào/ra mới là phần khó trong hệ thống thật</strong> — slide có thừa nhận ("các thao tác này có thể khá phức tạp, nhất là khi đọc ghi file lớn"). Đầu vào là chỗ chương trình chạm vào thế giới bên ngoài, nên cũng là chỗ lỗi trú ngụ: sai định dạng, hết file, và cái giá trị trả về của <code>scanf</code> mà không ai kiểm, âm thầm để lại cho bạn một biến chưa được khởi tạo.</li>
</ul>
<p class="dap-an">✅ Nếu chỉ mang được một thứ ra khỏi Chương 7, hãy mang thứ này: <strong>viết (mã nguồn bậc cao) · dịch (biên dịch hoặc thông dịch) · chạy (mã máy) là BA thời điểm tách biệt</strong>, và mọi khái niệm trong chương này thuộc về đúng một trong ba. Định danh và literal thuộc về lúc viết. Lỗi cú pháp và lỗi kiểu thuộc về lúc dịch. Kết quả sai và chương trình sập thuộc về lúc chạy.</p>
<p class="pitfall">⚠️ Deck kết thúc đột ngột — không có slide tổng kết, và gạch đầu dòng cuối dừng ở "…bằng một câu lệnh hoặc một hàm định nghĩa sẵn" mà không có ví dụ khép lại nào ngoài hai cái hộp. Không mất gì cả; chương của Forouzan còn đi tiếp với câu lệnh và chương trình con, phần mà môn này không dạy. Cũng lưu ý slide này đánh số "7." trong khi hai slide trước đều là "5.", nên deck hoàn toàn không có mục số 6.</p>`],

    ]),
  ].join('\n'),
};
