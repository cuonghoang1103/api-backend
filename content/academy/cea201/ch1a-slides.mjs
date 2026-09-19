/**
 * CEA201 · Chương 1 — Basic Concepts and Computer Evolution, học theo từng slide: PHẦN A (slide 1–22).
 * Deck 'cea1' (CEA1), 43 slide, ảnh đã render lên CDN images/academy/CEA201/v1/cea1/NNN.webp.
 *
 * Nội dung bám ĐÚNG chữ trích từ CH01-COA11e.pptx của trường (/tmp/cea201-text/cea1.txt, slide 1→22).
 * Đây là bộ slide CHÍNH HÃNG đi kèm Stallings, "Computer Organization and Architecture:
 * Designing for Performance", 11th Edition Global Edition (Pearson, 2022), tỉ lệ 4:3.
 * Các slide chỉ có tiêu đề + hình/bảng (2, 6, 11, 12, 13, 15, 16, 17, 18, 19, 20) đã được đọc
 * thẳng từ ảnh đã render để lấy đúng từng nhãn trong sơ đồ.
 *
 * Những chỗ SLIDE GỐC SAI hoặc dễ gây hiểu nhầm — đã nêu rõ trong bài, KHÔNG im lặng chép lại
 * và KHÔNG tự ý sửa slide:
 *   · slide 19 (Table 1.1), dòng đầu của nhóm Conditional Branch: opcode 00001111
 *     "JUMP + M(X,0:19)" được mô tả là "Take next instruction from right half of M(X)".
 *     SAI hai chỗ: (a) mất hẳn điều kiện "If number in the accumulator is nonnegative",
 *     (b) 0:19 là NỬA TRÁI của từ nhớ, không phải nửa phải. Dòng ngay dưới (00010000,
 *     JUMP + M(X,20:39)) mới ghi đủ điều kiện. Lỗi này có sẵn trong bảng của sách.
 *   · slide 28 (ngoài phạm vi bài này) ghi "Feature size (m)" — thiếu ký tự µ, phải là µm.
 *     Nêu trước ở slide 22 để người học không hiểu nhầm 10 mét.
 *   · slide 15 (Figure 1.5) vẽ bộ nhớ tới M(4095) = 4096 từ, đó là GIỚI HẠN ĐÁNH ĐỊA CHỈ của
 *     trường địa chỉ 12 bit; máy IAS thật chỉ lắp 1.000 từ. Hai con số khác nhau, không mâu thuẫn.
 *   · slide 21 nói về mạch tích hợp TRƯỚC rồi slide 22 mới quay lại transistor rời — thứ tự
 *     ngược với dòng thời gian (transistor 1947 → IC 1958). Đã nói rõ để khỏi rối.
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'cea1';

export default {
  title: '1.0a — Slide by slide: Organization vs architecture, structure, function and the IAS computer (slides 1–22)|||1.0a — Slide bài giảng: Organization vs architecture, cấu trúc & chức năng, máy IAS (slide 1–22)',
  slug: 'cea201-1-0a-slides-organization-architecture',
  type: 'DOCUMENT',
  description: 'Nửa đầu Chương 1 của CEA201 (slide 1–22) đi theo đúng bộ slide chính hãng của Stallings 11th Edition: phân biệt kiến trúc (architecture — thứ lập trình viên nhìn thấy) với tổ chức (organization — cách hiện thực), lấy IBM System/370 làm ví dụ sống; bốn chức năng và bốn thành phần cấu trúc của máy tính, phân rã nhiều tầng từ COMPUTER xuống CPU rồi xuống Control Unit; cấu trúc máy đa lõi và cache nhiều cấp; rồi vào sâu máy IAS của von Neumann — sơ đồ khối, khuôn dạng từ nhớ 40 bit, bảy thanh ghi, lưu đồ fetch–execute và toàn bộ 21 lệnh của Table 1.1; kết phần ở cổng logic, ô nhớ và transistor. Mọi mốc năm và con số đều được kiểm lại, và chỗ bảng lệnh của sách ghi sai đã được chỉ ra thay vì chép lại.',
  content: [
    walkHead(D, 1, 22),
    walk(D, [

      [1, 'Computer Organization and Architecture — Designing for Performance, 11th Edition, Chapter 1: Basic Concepts and Computer Evolution',
        `<p class="y-chinh">🎯 The title slide. Two things on it decide how you should read the whole course: the book is <strong>Stallings, Computer Organization and Architecture — Designing for Performance, 11th Edition Global Edition</strong>, and the chapter is called <em>Basic Concepts <strong>and</strong> Computer Evolution</em> — half definitions, half history.</p>
<ul>
<li><strong>Read the subtitle, it is the thesis</strong> — <em>Designing for Performance</em>. Every chapter after this one exists to answer one question: given that transistors are cheap and the speed of light is not, how do you arrange them so a program finishes sooner? Cache (Ch.5), pipelining (Ch.16), superscalar (Ch.18), multicore (Ch.21) are all answers to that one question.</li>
<li><strong>Two words in the title are not synonyms</strong> — <em>organization</em> and <em>architecture</em> mean different things, and slide 2 is entirely devoted to separating them. Almost every CEA201 exam opens with that separation.</li>
<li><strong>The chapter has two halves</strong> — slides 1–13 are the <em>concepts</em> (structure, function, the four components, multicore, cache); slides 14–43 are the <em>evolution</em> (IAS, transistors, integrated circuits, Moore's law, the Intel x86 line, embedded systems, ARM). This walkthrough covers slides 1–22.</li>
<li><strong>These are publisher slides, not lecturer slides</strong> — they follow the book page for page, which is why so many of them carry only a figure number ("Figure 1.2") with no bullet text. For those, the picture <em>is</em> the content; you are expected to read the caption and the book paragraph beside it.</li>
<li><strong>Where you have met this before</strong> — CSI106 already taught you the von Neumann model and the five generations at the level of "name the parts". CEA201 re-opens the same boxes and asks how they are built and how fast they run. Expect familiar names (ALU, control unit, registers) with much more detail behind them.</li>
<li><strong>Where it is going next</strong> — PRF192 taught you to write C. This course explains what your C turns into: a sequence of machine instructions from a specific instruction set, fetched and executed by the machine drawn on slide 6.</li>
</ul>
<p class="meo">💡 Chapter 1 is the cheapest chapter in the course to score on: the answers are short lists (four functions, four components, four CPU parts) and dated facts. Start a one-page sheet now; every list and every year from slide 4 to slide 22 goes on it.</p>`,
        `<p class="y-chinh">🎯 Slide tiêu đề. Hai thứ trên đó quyết định cách bạn nên đọc cả môn: sách là <strong>Stallings, Computer Organization and Architecture — Designing for Performance, 11th Edition Global Edition</strong>, và tên chương là <em>Basic Concepts <strong>and</strong> Computer Evolution</em> — nửa khái niệm, nửa lịch sử.</p>
<ul>
<li><strong>Đọc kỹ phụ đề, đó là luận điểm của cả sách</strong> — <em>Designing for Performance</em> (thiết kế vì hiệu năng). Mọi chương sau chương này tồn tại để trả lời một câu hỏi duy nhất: transistor thì rẻ mà tốc độ ánh sáng thì không đổi, vậy xếp chúng thế nào để chương trình chạy xong sớm hơn? Cache (Ch.5), pipeline (Ch.16), superscalar (Ch.18), đa lõi (Ch.21) đều là câu trả lời cho đúng câu hỏi ấy.</li>
<li><strong>Hai chữ trong tên sách KHÔNG đồng nghĩa</strong> — <em>organization</em> (tổ chức) và <em>architecture</em> (kiến trúc) là hai thứ khác nhau, và slide 2 dành trọn để tách chúng ra. Gần như mọi đề CEA201 đều mở màn bằng phép tách đó.</li>
<li><strong>Chương có hai nửa</strong> — slide 1–13 là phần <em>khái niệm</em> (cấu trúc, chức năng, bốn thành phần, đa lõi, cache); slide 14–43 là phần <em>tiến hoá</em> (máy IAS, transistor, mạch tích hợp, định luật Moore, dòng x86 của Intel, hệ nhúng, ARM). Bài này đi hết slide 1–22.</li>
<li><strong>Đây là slide của NHÀ XUẤT BẢN, không phải slide thầy cô soạn</strong> — nó bám sách từng trang, nên rất nhiều slide chỉ mang đúng một dòng "Figure 1.2" mà không có gạch đầu dòng nào. Với những slide ấy, BỨC HÌNH chính là nội dung; bạn phải đọc chú thích hình và đoạn văn bên cạnh trong sách.</li>
<li><strong>Chỗ bạn đã gặp trước đây</strong> — CSI106 đã dạy mô hình von Neumann và năm thế hệ máy tính ở mức "gọi tên được các bộ phận". CEA201 mở lại đúng những cái hộp đó và hỏi chúng được dựng ra sao, chạy nhanh chừng nào. Sẽ gặp lại tên quen (ALU, khối điều khiển, thanh ghi) nhưng phía sau là chi tiết dày hơn nhiều.</li>
<li><strong>Chỗ nó đi tới</strong> — PRF192 dạy bạn viết C. Môn này giải thích đoạn C ấy biến thành cái gì: một dãy lệnh máy thuộc một tập lệnh cụ thể, được nạp và thi hành bởi đúng cỗ máy vẽ ở slide 6.</li>
</ul>
<p class="meo">💡 Chương 1 là chương dễ lấy điểm nhất cả môn: đáp án là những danh sách ngắn (bốn chức năng, bốn thành phần, bốn phần của CPU) và các dữ kiện có năm tháng. Hãy mở ngay một tờ A4; mọi danh sách và mọi mốc năm từ slide 4 tới slide 22 chép hết vào đó.</p>`],

      [2, 'Computer Architecture | Computer Organization',
        `<p class="y-chinh">🎯 The single most examined slide of the chapter. Two half-circles: <strong>architecture = what the programmer can see</strong>, <strong>organization = how it is actually built</strong>. Everything else in CEA201 hangs off this split.</p>
<table>
<tr><th></th><th>Computer Architecture</th><th>Computer Organization</th></tr>
<tr><td>Definition on the slide</td><td>Attributes of a system <strong>visible to the programmer</strong>; have a <strong>direct impact on the logical execution</strong> of a program</td><td>The <strong>operational units and their interconnections</strong> that <strong>realize</strong> the architectural specifications</td></tr>
<tr><td>Attributes include</td><td>Instruction set · number of bits used to represent various data types · I/O mechanisms · techniques for addressing memory</td><td>Hardware details <strong>transparent to the programmer</strong> · control signals · interfaces between the computer and peripherals · memory technology used</td></tr>
<tr><td>Question it answers</td><td><em>What</em> can I ask the machine to do?</td><td><em>How</em> does the machine manage to do it?</td></tr>
</table>
<ul>
<li><strong>The textbook example — the multiply instruction.</strong> "Is there a MUL instruction?" is an <em>architectural</em> question: it changes what a programmer may write. "Is MUL done by a dedicated multiplier circuit, or by a loop of repeated additions in microcode?" is an <em>organizational</em> question: the program cannot tell the difference except in how long it takes.</li>
<li><strong>Why the word "transparent" trips people up.</strong> In this book <em>transparent to the programmer</em> means <strong>invisible</strong> — you cannot see it, not "you can see through to it". Cache is the classic case: adding an L3 cache changes no instruction and no result, only the timing. Cache is therefore organization, not architecture.</li>
<li><strong>Why the distinction is worth money.</strong> Because architecture and organization are separable, a manufacturer can keep the architecture fixed and rebuild the organization every year. Intel has shipped x86 processors since the 8086 in 1978 (slide 28); a program compiled for the instruction set still runs, while the organization underneath went from 29,000 transistors to billions.</li>
<li><strong>The same logic upside down.</strong> Two vendors can implement the same architecture with completely different organizations — an Intel and an AMD chip both run the same Windows binary. And one vendor can sell a whole family of organizations for one architecture, which is exactly what slide 3 describes.</li>
</ul>
<p class="pitfall">⚠️ The exam trap is a list where you must tag each item A (architecture) or O (organization). Safe classifications: instruction set → A; number of bits in an integer → A; addressing modes → A; I/O mechanism (as seen by the program) → A; cache size → O; control signals → O; clock frequency → O; whether memory is DRAM or SRAM → O; the number of ALUs → O; pipeline depth → O.</p>`,
        `<p class="y-chinh">🎯 Slide bị hỏi nhiều nhất cả chương. Hai nửa hình tròn: <strong>architecture = thứ lập trình viên NHÌN THẤY</strong>, <strong>organization = cách nó được DỰNG THẬT</strong>. Mọi thứ còn lại của CEA201 treo trên phép chia này.</p>
<table>
<tr><th></th><th>Kiến trúc (Architecture)</th><th>Tổ chức (Organization)</th></tr>
<tr><td>Định nghĩa trên slide</td><td>Các thuộc tính của hệ thống <strong>mà lập trình viên nhìn thấy</strong>; có <strong>tác động trực tiếp tới việc thi hành logic</strong> của chương trình</td><td>Các <strong>khối chức năng và cách chúng nối với nhau</strong> để <strong>hiện thực hoá</strong> đặc tả kiến trúc</td></tr>
<tr><td>Gồm những gì</td><td>Tập lệnh · số bit dùng biểu diễn từng kiểu dữ liệu · cơ chế vào/ra · kỹ thuật đánh địa chỉ bộ nhớ</td><td>Chi tiết phần cứng <strong>trong suốt với lập trình viên</strong> · tín hiệu điều khiển · giao diện giữa máy tính và thiết bị ngoại vi · công nghệ bộ nhớ được dùng</td></tr>
<tr><td>Trả lời câu hỏi</td><td><em>CÁI GÌ</em> tôi có quyền bảo máy làm?</td><td><em>LÀM SAO</em> máy làm được việc đó?</td></tr>
</table>
<ul>
<li><strong>Ví dụ kinh điển của sách — lệnh nhân.</strong> "Máy có lệnh MUL hay không?" là câu hỏi <em>kiến trúc</em>: nó đổi những gì lập trình viên được phép viết. "MUL được làm bằng một mạch nhân riêng, hay bằng một vòng cộng lặp trong vi chương trình?" là câu hỏi <em>tổ chức</em>: chương trình không phân biệt được, ngoài chuyện chạy lâu hay mau.</li>
<li><strong>Vì sao chữ "transparent" hay làm người học ngã.</strong> Trong sách này <em>transparent to the programmer</em> nghĩa là <strong>VÔ HÌNH</strong> — bạn không thấy nó, chứ không phải "nhìn xuyên thấy được". Cache là ca điển hình: thêm một tầng L3 không đổi lệnh nào, không đổi kết quả nào, chỉ đổi thời gian. Vậy cache thuộc tổ chức, không thuộc kiến trúc.</li>
<li><strong>Vì sao phép phân biệt này đáng tiền.</strong> Vì kiến trúc và tổ chức tách rời được, nhà sản xuất có thể giữ nguyên kiến trúc và dựng lại tổ chức mỗi năm. Intel bán vi xử lý x86 từ con 8086 năm 1978 (slide 28); chương trình biên dịch cho tập lệnh ấy tới nay vẫn chạy, trong khi tổ chức bên dưới đã đi từ 29.000 transistor lên hàng tỉ.</li>
<li><strong>Cùng một logic lật ngược.</strong> Hai hãng có thể hiện thực cùng một kiến trúc bằng hai tổ chức khác hẳn nhau — con Intel và con AMD cùng chạy đúng một file Windows. Và một hãng có thể bán cả một họ tổ chức cho cùng một kiến trúc, đó chính là chuyện slide 3 kể.</li>
</ul>
<p class="pitfall">⚠️ Bẫy trong đề là một danh sách bắt bạn gắn nhãn A (kiến trúc) hay O (tổ chức) cho từng mục. Phân loại an toàn: tập lệnh → A; số bit của một số nguyên → A; các chế độ địa chỉ → A; cơ chế I/O mà chương trình thấy → A; dung lượng cache → O; tín hiệu điều khiển → O; xung nhịp → O; bộ nhớ là DRAM hay SRAM → O; có mấy ALU → O; ống lệnh sâu mấy tầng → O.</p>`],

      [3, 'IBM System/370 Architecture',
        `<p class="y-chinh">🎯 The slide turns the abstract split of slide 2 into a business story: IBM sold <strong>one architecture in many organizations</strong>, and that is why customers could buy a faster machine without rewriting a line of software.</p>
<ul>
<li><strong>What the slide states</strong> — System/370 was introduced in <strong>1970</strong>; it included a number of models; a customer could upgrade to a more expensive, faster model <em>without abandoning original software</em>; new models arrive with improved technology but keep the same architecture, so the customer's software investment is protected; and the architecture has survived to this day as the architecture of IBM's mainframe product line.</li>
<li><strong>The mechanism, in the vocabulary of slide 2</strong> — the cheap model and the expensive model share the instruction set, the data formats, the addressing and the I/O interface (architecture identical), but differ in bus width, in how much is done in one clock, in cache and in memory technology (organization different). Same program, different speed and price.</li>
<li><strong>The ancestor worth knowing</strong> — this family idea did not start in 1970. IBM announced <strong>System/360 in 1964</strong> as the first deliberately architecture-compatible <em>family</em>, and System/370 is its successor. If an exam asks "the first computer family", the expected answer is System/360; the slide names /370 only because that is where the story of the surviving line is easiest to tell.</li>
<li><strong>"Survived to this day" is literally true</strong> — the line runs System/360 → System/370 → System/390 → today's IBM Z (z/Architecture, the 64-bit extension). Code written decades ago still runs, which is the strongest evidence anywhere that an architecture can outlive every organization that ever implemented it.</li>
<li><strong>The same argument, in your pocket</strong> — Intel x86 (slides 28–33) and ARM (slides 40–42) are the two other long-lived architectures this chapter will show you. Backward compatibility is not nostalgia; it is what makes an instruction set valuable at all.</li>
</ul>
<p class="meo">💡 One sentence to remember the whole idea: <strong>a family = one architecture, many organizations, one price list.</strong> If you can say that, you can answer any "why is backward compatibility important?" question.</p>`,
        `<p class="y-chinh">🎯 Slide này biến phép chia trừu tượng ở slide 2 thành một câu chuyện kinh doanh: IBM bán <strong>MỘT kiến trúc trong NHIỀU tổ chức</strong>, và nhờ vậy khách hàng mua máy mạnh hơn mà không phải viết lại một dòng phần mềm nào.</p>
<ul>
<li><strong>Slide nói gì</strong> — System/370 ra mắt năm <strong>1970</strong>; gồm nhiều model; khách có thể nâng lên model đắt hơn, nhanh hơn mà <em>không phải bỏ phần mềm cũ</em>; model mới dùng công nghệ mới nhưng giữ nguyên kiến trúc, nên khoản đầu tư phần mềm của khách được bảo toàn; và kiến trúc ấy tồn tại tới tận hôm nay dưới dạng kiến trúc dòng máy lớn (mainframe) của IBM.</li>
<li><strong>Cơ chế, diễn lại bằng từ vựng slide 2</strong> — model rẻ và model đắt dùng chung tập lệnh, chung khuôn dạng dữ liệu, chung cách đánh địa chỉ và chung giao diện I/O (kiến trúc giống hệt), nhưng khác nhau ở độ rộng bus, ở việc làm được bao nhiêu trong một nhịp, ở cache và ở công nghệ bộ nhớ (tổ chức khác nhau). Cùng một chương trình, khác tốc độ và khác giá.</li>
<li><strong>Cái gốc đáng biết</strong> — ý tưởng "họ máy" không bắt đầu năm 1970. IBM công bố <strong>System/360 năm 1964</strong>, họ máy đầu tiên được thiết kế có chủ đích để tương thích kiến trúc, còn System/370 là thế hệ kế thừa. Nếu đề hỏi "họ máy tính đầu tiên" thì đáp án chờ đợi là System/360; slide chỉ nêu /370 vì từ đó kể tiếp mạch sống sót cho tới nay là gọn nhất.</li>
<li><strong>"Sống tới hôm nay" là đúng theo nghĩa đen</strong> — mạch đó chạy System/360 → System/370 → System/390 → IBM Z ngày nay (z/Architecture, bản mở rộng 64 bit). Mã viết cách đây hàng chục năm vẫn chạy được, đây là bằng chứng mạnh nhất cho thấy một kiến trúc có thể sống lâu hơn mọi tổ chức từng hiện thực nó.</li>
<li><strong>Cũng lập luận ấy, ngay trong túi bạn</strong> — Intel x86 (slide 28–33) và ARM (slide 40–42) là hai kiến trúc trường thọ khác mà chương này sẽ đưa ra. Tương thích ngược không phải hoài cổ; nó chính là thứ làm cho một tập lệnh có giá trị.</li>
</ul>
<p class="meo">💡 Một câu nhớ cả ý: <strong>một họ máy = một kiến trúc, nhiều tổ chức, một bảng giá.</strong> Nói được câu đó là trả lời được mọi câu "vì sao tương thích ngược lại quan trọng?".</p>`],

      [4, 'Structure and Function',
        `<p class="y-chinh">🎯 The method of the whole book, in one slide: a computer is a <strong>hierarchical system</strong> — a set of interrelated subsystems — and at every level you describe exactly two things, its <strong>structure</strong> and its <strong>function</strong>.</p>
<ul>
<li><strong>Hierarchical system</strong> — a set of interrelated subsystems, each of which is itself hierarchical down to some lowest level of elementary subsystems. The slide insists this nature "is essential to both their design and their description".</li>
<li><strong>Why hierarchy is not just tidiness</strong> — because of it, "the designer need only deal with a particular level of the system at a time". Nobody can hold a billion transistors in their head; but anyone can hold "CPU, memory, I/O, interconnection" in their head, then open the CPU box and hold four things again. That is how a chip with billions of parts gets designed at all — and it is the same reason you write functions instead of one giant <code>main()</code>.</li>
<li><strong>Structure</strong> — <em>the way in which components relate to each other</em>. Boxes and the lines between them. Slide 6 is a picture of structure.</li>
<li><strong>Function</strong> — <em>the operation of individual components as part of the structure</em>. What each box does. Slide 5 is the list of functions.</li>
<li><strong>The order the book chooses</strong> — it describes function first (slide 5), then structure (slides 6–8), and then drills down: COMPUTER → CPU → CONTROL UNIT. Each descent re-asks the same two questions at the next level.</li>
<li><strong>Carry it forward</strong> — every later chapter is one level of this hierarchy: Ch.3 the system bus, Ch.5 cache, Ch.16 the processor, Ch.12 the gates at the bottom. When you get lost mid-course, ask "which level am I on?" and the chapter map reappears.</li>
</ul>
<p class="pitfall">⚠️ In exam answers, do not swap the two words. <strong>Structure = relationships between components</strong>; <strong>function = what a component does</strong>. A one-word slip here costs the whole mark, and it is one of the easiest definitions in the course to quote verbatim.</p>`,
        `<p class="y-chinh">🎯 Phương pháp của cả cuốn sách, gói trong một slide: máy tính là một <strong>hệ thống phân cấp</strong> — một tập các hệ con liên quan nhau — và ở mỗi tầng bạn chỉ mô tả đúng hai thứ, <strong>cấu trúc (structure)</strong> và <strong>chức năng (function)</strong>.</p>
<ul>
<li><strong>Hệ thống phân cấp</strong> — một tập hệ con liên quan nhau, mà mỗi hệ con lại tự phân cấp tiếp xuống tới một tầng phần tử cơ sở nào đó. Slide nhấn mạnh tính phân cấp ấy "thiết yếu cho cả việc THIẾT KẾ lẫn việc MÔ TẢ" chúng.</li>
<li><strong>Vì sao phân cấp không chỉ là cho gọn gàng</strong> — nhờ nó, "người thiết kế mỗi lúc chỉ cần làm việc với một tầng". Không ai giữ nổi một tỉ transistor trong đầu; nhưng ai cũng giữ nổi "CPU, bộ nhớ, I/O, liên kết", rồi mở cái hộp CPU ra và lại chỉ giữ bốn thứ. Đó là cách một con chip hàng tỉ chi tiết được thiết kế ra — và cũng đúng lý do bạn viết hàm thay vì nhét hết vào một <code>main()</code> khổng lồ.</li>
<li><strong>Cấu trúc</strong> — <em>cách các thành phần quan hệ với nhau</em>. Các cái hộp và những đường nối giữa chúng. Slide 6 chính là một bức ảnh của cấu trúc.</li>
<li><strong>Chức năng</strong> — <em>hoạt động của từng thành phần với tư cách một phần của cấu trúc</em>. Mỗi hộp làm gì. Slide 5 chính là danh sách chức năng.</li>
<li><strong>Thứ tự mà sách chọn</strong> — mô tả chức năng trước (slide 5), rồi cấu trúc (slide 6–8), rồi khoan xuống: COMPUTER → CPU → CONTROL UNIT. Mỗi lần khoan xuống lại hỏi đúng hai câu hỏi ấy ở tầng kế tiếp.</li>
<li><strong>Mang ý này đi tiếp</strong> — mọi chương sau chỉ là một tầng của cái phân cấp này: Ch.3 bus hệ thống, Ch.5 cache, Ch.16 bộ xử lý, Ch.12 các cổng logic ở đáy. Giữa môn mà thấy lạc, hãy tự hỏi "mình đang ở tầng nào?" là bản đồ hiện lại ngay.</li>
</ul>
<p class="pitfall">⚠️ Khi viết bài thi, đừng đảo hai chữ. <strong>Cấu trúc = quan hệ giữa các thành phần</strong>; <strong>chức năng = thành phần đó làm gì</strong>. Nhầm một chữ ở đây là mất trọn điểm, mà đây lại là một trong những định nghĩa dễ chép nguyên văn nhất cả môn.</p>`],

      [5, 'Function',
        `<p class="y-chinh">🎯 There are exactly <strong>four basic functions</strong> a computer can perform, and the list is short enough to be an exam answer verbatim: <strong>data processing · data storage · data movement · control</strong>.</p>
<table>
<tr><th>Function</th><th>What the slide says</th><th>Where it lives in the machine</th></tr>
<tr><td><strong>Data processing</strong></td><td>Data may take a wide variety of forms and the range of processing requirements is broad</td><td>ALU (slide 8), gates (slide 20)</td></tr>
<tr><td><strong>Data storage</strong></td><td>Short-term and long-term</td><td>Registers and cache (short-term) · main memory and disk (long-term); memory cells (slide 20)</td></tr>
<tr><td><strong>Data movement</strong></td><td><strong>I/O</strong> when data are received from or delivered to a directly connected device (peripheral); <strong>data communications</strong> when data move over longer distances, to or from a remote device</td><td>I/O module, system bus (slide 6)</td></tr>
<tr><td><strong>Control</strong></td><td>A control unit manages the computer's resources and orchestrates the performance of its functional parts in response to instructions</td><td>Control unit (slide 6 and 8)</td></tr>
</table>
<ul>
<li><strong>The distinction inside "data movement" is examinable.</strong> Same function, two names, split by distance: a keyboard or a disk attached to the machine is <strong>I/O</strong>; a file sent to a machine across a network is <strong>data communications</strong>. Do not answer "network" for a printer question.</li>
<li><strong>Four functions, four components — and they line up.</strong> Slide 7 lists CPU, main memory, I/O and system interconnection. Processing → CPU, storage → memory, movement → I/O, control → the control unit inside the CPU. Learning the two lists together halves the work.</li>
<li><strong>The list is complete, not illustrative.</strong> Stallings claims these four cover everything a computer does; anything you can name — playing a video, training a model, compiling a program — decomposes into processing, storing, moving and controlling. That claim is worth testing on your own examples; it holds.</li>
<li><strong>Where the four come back.</strong> Slide 21 repeats them at the level of silicon: gates do processing, memory cells do storage, paths between components do movement, and those same paths carry control signals. One list, two levels of the hierarchy — exactly the method slide 4 promised.</li>
</ul>
<p class="meo">💡 Vietnamese mnemonic that survives exam stress: <strong>XỬ – LƯU – CHUYỂN – ĐIỀU</strong> (xử lý, lưu trữ, di chuyển, điều khiển). Four words, in the slide's own order.</p>`,
        `<p class="y-chinh">🎯 Máy tính làm được đúng <strong>bốn chức năng cơ bản</strong>, và danh sách này ngắn tới mức chép nguyên văn vào bài thi được: <strong>xử lý dữ liệu · lưu trữ dữ liệu · di chuyển dữ liệu · điều khiển</strong>.</p>
<table>
<tr><th>Chức năng</th><th>Slide nói gì</th><th>Nằm ở đâu trong máy</th></tr>
<tr><td><strong>Xử lý dữ liệu</strong></td><td>Dữ liệu có rất nhiều dạng và yêu cầu xử lý cũng rất rộng</td><td>ALU (slide 8), các cổng logic (slide 20)</td></tr>
<tr><td><strong>Lưu trữ dữ liệu</strong></td><td>Ngắn hạn và dài hạn</td><td>Thanh ghi và cache (ngắn hạn) · bộ nhớ chính và đĩa (dài hạn); các ô nhớ (slide 20)</td></tr>
<tr><td><strong>Di chuyển dữ liệu</strong></td><td><strong>Vào/ra (I/O)</strong> khi dữ liệu được nhận từ hoặc gửi tới một thiết bị nối trực tiếp (ngoại vi); <strong>truyền thông dữ liệu</strong> khi dữ liệu đi xa hơn, tới hoặc từ một thiết bị ở xa</td><td>Mô-đun I/O, bus hệ thống (slide 6)</td></tr>
<tr><td><strong>Điều khiển</strong></td><td>Khối điều khiển quản lý tài nguyên của máy và điều phối hoạt động của các bộ phận chức năng theo lệnh</td><td>Khối điều khiển (slide 6 và 8)</td></tr>
</table>
<ul>
<li><strong>Phép chia bên trong "di chuyển dữ liệu" có ra thi.</strong> Cùng một chức năng, hai tên gọi, phân biệt bằng KHOẢNG CÁCH: bàn phím hay ổ đĩa gắn ngay vào máy là <strong>I/O</strong>; một file gửi qua mạng tới máy khác là <strong>truyền thông dữ liệu</strong>. Đừng trả lời "mạng" cho câu hỏi về máy in.</li>
<li><strong>Bốn chức năng, bốn thành phần — và chúng khớp nhau.</strong> Slide 7 liệt kê CPU, bộ nhớ chính, I/O và liên kết hệ thống. Xử lý → CPU, lưu trữ → bộ nhớ, di chuyển → I/O, điều khiển → khối điều khiển trong CPU. Học hai danh sách cùng lúc thì công sức giảm một nửa.</li>
<li><strong>Danh sách này là ĐẦY ĐỦ, không phải ví dụ minh hoạ.</strong> Stallings khẳng định bốn mục ấy phủ hết mọi việc máy tính làm; thứ gì bạn kể ra — phát video, huấn luyện mô hình, biên dịch chương trình — đều phân rã được thành xử lý, lưu, chuyển và điều khiển. Cứ thử với ví dụ của riêng bạn; nó đứng vững.</li>
<li><strong>Bốn chức năng ấy quay lại ở đâu.</strong> Slide 21 lặp lại chúng ở tầng silicon: cổng logic lo xử lý, ô nhớ lo lưu trữ, các đường nối giữa các thành phần lo di chuyển, và chính những đường đó mang tín hiệu điều khiển. Một danh sách, hai tầng phân cấp — đúng phương pháp mà slide 4 đã hứa.</li>
</ul>
<p class="meo">💡 Câu thần chú tiếng Việt sống sót được qua áp lực phòng thi: <strong>XỬ – LƯU – CHUYỂN – ĐIỀU</strong> (xử lý, lưu trữ, di chuyển, điều khiển). Bốn chữ, đúng thứ tự của slide.</p>`],

      [6, 'Structure — Figure 1.1 The Computer: Top-Level Structure',
        `<p class="y-chinh">🎯 One picture, three levels of zoom. The figure descends <strong>COMPUTER → CPU → CONTROL UNIT</strong>, and the box that is shaded at one level becomes the whole circle at the next. This is slide 4's hierarchy drawn instead of described.</p>
<table>
<tr><th>Level</th><th>Circle</th><th>What is inside it</th></tr>
<tr><td>1</td><td><strong>COMPUTER</strong></td><td>I/O · Main memory · <strong>System Bus</strong> · CPU <em>(shaded, opened next)</em></td></tr>
<tr><td>2</td><td><strong>CPU</strong></td><td>Registers · ALU · <strong>Internal Bus</strong> · Control Unit <em>(shaded, opened next)</em></td></tr>
<tr><td>3</td><td><strong>CONTROL UNIT</strong></td><td>Sequencing Logic · Control Unit Registers and Decoders · Control Memory</td></tr>
</table>
<ul>
<li><strong>Read the dashed lines as "zoom in here".</strong> The shaded CPU inside COMPUTER is the same object as the big CPU circle on the right; the shaded Control Unit inside CPU is the same object as the big CONTROL UNIT circle at the bottom. Nothing is duplicated — you are looking at one machine at three magnifications.</li>
<li><strong>Every level has a bus.</strong> Level 1 has the <em>System Bus</em>, level 2 has the <em>Internal Bus</em>. The recurring lesson: at every level, components need a shared road between them, and that road is usually the bottleneck. Chapter 3 is about the system bus; Chapter 16 about the internal one.</li>
<li><strong>The third level is the one you have not seen before.</strong> CSI106 stopped at "the control unit tells the other parts what to do". Here the control unit is itself opened: <em>sequencing logic</em> generates the step-by-step timing, <em>control unit registers and decoders</em> hold and decode the current instruction, and <em>control memory</em> stores microinstructions. That last box is the entire subject of Chapter 19 (microprogrammed control).</li>
<li><strong>Control memory is what makes the multiply example real.</strong> If MUL is implemented as a microprogram living in control memory rather than as a dedicated circuit, the architecture is unchanged and the organization is radically different — exactly the point of slide 2.</li>
<li><strong>Note what is missing.</strong> There is no cache in this figure, although slide 10 says cache sits between processor and main memory. Figure 1.1 is the classical top-level view; Figure 1.2 (slide 11) is the modern one and does show caches. Two pictures of the same machine, drawn decades apart.</li>
</ul>
<p class="meo">💡 Draw this figure from memory before the exam: three circles, four labels in the first two, three in the last. If you can reproduce it on blank paper you have answered every "describe the structure of a computer" question in the course.</p>`,
        `<p class="y-chinh">🎯 Một bức hình, ba mức phóng to. Hình đi xuống theo <strong>COMPUTER → CPU → CONTROL UNIT</strong>, và cái hộp được tô màu ở tầng trên chính là cả vòng tròn ở tầng dưới. Đây là cái phân cấp của slide 4, được VẼ thay vì được tả.</p>
<table>
<tr><th>Tầng</th><th>Vòng tròn</th><th>Bên trong có gì</th></tr>
<tr><td>1</td><td><strong>COMPUTER</strong></td><td>I/O · Bộ nhớ chính (Main memory) · <strong>System Bus</strong> · CPU <em>(tô màu, mở ra ở tầng sau)</em></td></tr>
<tr><td>2</td><td><strong>CPU</strong></td><td>Registers · ALU · <strong>Internal Bus</strong> · Control Unit <em>(tô màu, mở ra ở tầng sau)</em></td></tr>
<tr><td>3</td><td><strong>CONTROL UNIT</strong></td><td>Sequencing Logic · Control Unit Registers and Decoders · Control Memory</td></tr>
</table>
<ul>
<li><strong>Đọc các đường đứt nét là "phóng to chỗ này".</strong> Cái CPU tô màu bên trong COMPUTER với vòng tròn CPU lớn bên phải là CÙNG MỘT VẬT; cái Control Unit tô màu trong CPU với vòng CONTROL UNIT lớn phía dưới cũng vậy. Không có gì bị vẽ trùng — bạn đang nhìn một cỗ máy ở ba độ phóng đại.</li>
<li><strong>Tầng nào cũng có bus.</strong> Tầng 1 có <em>System Bus</em>, tầng 2 có <em>Internal Bus</em>. Bài học lặp lại: ở mọi tầng, các thành phần đều cần một con đường chung, và con đường ấy thường chính là chỗ nghẽn. Chương 3 nói về bus hệ thống; Chương 16 nói về bus trong.</li>
<li><strong>Tầng thứ ba là tầng bạn chưa từng thấy.</strong> CSI106 dừng ở "khối điều khiển bảo các phần khác phải làm gì". Ở đây khối điều khiển được mở ra: <em>sequencing logic</em> sinh nhịp điều khiển từng bước, <em>control unit registers and decoders</em> giữ và giải mã lệnh hiện hành, còn <em>control memory</em> chứa các vi lệnh. Cái hộp cuối ấy là toàn bộ nội dung Chương 19 (điều khiển vi chương trình).</li>
<li><strong>Control memory làm cho ví dụ lệnh nhân thành thật.</strong> Nếu MUL được hiện thực bằng một vi chương trình nằm trong control memory thay vì bằng một mạch nhân riêng, thì kiến trúc không đổi mà tổ chức đổi hoàn toàn — đúng ý của slide 2.</li>
<li><strong>Để ý thứ VẮNG MẶT.</strong> Trong hình này không có cache, dù slide 10 nói cache nằm giữa bộ xử lý và bộ nhớ chính. Figure 1.1 là bức nhìn tổng thể cổ điển; Figure 1.2 (slide 11) mới là bức hiện đại và có vẽ cache. Hai bức hình của cùng một cỗ máy, cách nhau hàng chục năm.</li>
</ul>
<p class="meo">💡 Hãy vẽ lại hình này từ trí nhớ trước khi thi: ba vòng tròn, bốn nhãn ở hai vòng đầu, ba nhãn ở vòng cuối. Vẽ được trên giấy trắng là bạn đã trả lời xong mọi câu "mô tả cấu trúc của máy tính" trong cả môn.</p>`],

      [7, 'There are four main structural components of the computer',
        `<p class="y-chinh">🎯 The written version of Figure 1.1's outermost circle: <strong>CPU · Main Memory · I/O · System Interconnection</strong>. Four boxes, and the slide gives each a one-line job description.</p>
<table>
<tr><th>Component</th><th>The slide's own words</th><th>Function it serves (slide 5)</th></tr>
<tr><td><strong>CPU</strong></td><td>Controls the operation of the computer and performs its data processing functions</td><td>Control + data processing</td></tr>
<tr><td><strong>Main Memory</strong></td><td>Stores data</td><td>Data storage</td></tr>
<tr><td><strong>I/O</strong></td><td>Moves data between the computer and its external environment</td><td>Data movement</td></tr>
<tr><td><strong>System Interconnection</strong></td><td>Some mechanism that provides for communication among CPU, main memory, and I/O</td><td>Data movement (internal)</td></tr>
</table>
<ul>
<li><strong>The CPU carries two of the four functions.</strong> Notice the first row: the CPU both <em>controls</em> and <em>processes</em>. That is why when slide 8 opens the CPU you find both a control unit and an ALU — one box per function.</li>
<li><strong>"Main memory" is deliberately narrow.</strong> It means the memory the CPU can address directly, and the slide says only "stores data" — in the von Neumann machine that includes the program, because instructions are data too. Disks and SSDs are <em>not</em> main memory; they reach the CPU through the I/O component, which is why Chapter 7 (external memory) is a different chapter from Chapter 6 (internal memory).</li>
<li><strong>"System interconnection" is the honest name for a bus.</strong> The slide says "some mechanism", not "a bus", on purpose: in a modern machine it may be a bus, a crossbar switch, a ring, or a packet network on the chip. The architecture requires that the three other parts can talk; how they talk is organization.</li>
<li><strong>Why the fourth component surprises people.</strong> Students happily list CPU, memory and I/O, then lose a mark by forgetting the interconnection. Remember it as the thing without which the other three are three separate objects on a table, not a computer.</li>
</ul>
<p class="pitfall">⚠️ Common exam answer that loses marks: listing "CPU, memory, input, output" as four components. Input and output are <em>one</em> component here (I/O), and the fourth is the interconnection. Follow the slide's list, not intuition.</p>`,
        `<p class="y-chinh">🎯 Bản viết bằng chữ của vòng tròn ngoài cùng trong Figure 1.1: <strong>CPU · Bộ nhớ chính · I/O · Liên kết hệ thống</strong>. Bốn cái hộp, mỗi hộp được slide mô tả bằng đúng một dòng.</p>
<table>
<tr><th>Thành phần</th><th>Nguyên văn của slide</th><th>Phục vụ chức năng nào (slide 5)</th></tr>
<tr><td><strong>CPU</strong></td><td>Điều khiển hoạt động của máy tính và thực hiện các chức năng xử lý dữ liệu</td><td>Điều khiển + xử lý dữ liệu</td></tr>
<tr><td><strong>Bộ nhớ chính</strong></td><td>Lưu trữ dữ liệu</td><td>Lưu trữ dữ liệu</td></tr>
<tr><td><strong>I/O</strong></td><td>Di chuyển dữ liệu giữa máy tính và môi trường bên ngoài</td><td>Di chuyển dữ liệu</td></tr>
<tr><td><strong>Liên kết hệ thống</strong></td><td>Một cơ chế nào đó cho phép CPU, bộ nhớ chính và I/O trao đổi với nhau</td><td>Di chuyển dữ liệu (bên trong máy)</td></tr>
</table>
<ul>
<li><strong>CPU gánh HAI trong bốn chức năng.</strong> Để ý dòng đầu: CPU vừa <em>điều khiển</em> vừa <em>xử lý</em>. Chính vì vậy khi slide 8 mở CPU ra, bạn thấy cả khối điều khiển lẫn ALU — mỗi hộp một chức năng.</li>
<li><strong>"Bộ nhớ chính" được định nghĩa hẹp có chủ đích.</strong> Nó là phần bộ nhớ mà CPU đánh địa chỉ trực tiếp được, và slide chỉ nói "lưu trữ dữ liệu" — trong máy von Neumann thì "dữ liệu" đó bao gồm cả chương trình, vì lệnh cũng là dữ liệu. Đĩa cứng và SSD <em>không</em> phải bộ nhớ chính; chúng tới được CPU qua thành phần I/O, và đó là lý do Chương 7 (bộ nhớ ngoài) tách khỏi Chương 6 (bộ nhớ trong).</li>
<li><strong>"Liên kết hệ thống" là cái tên trung thực cho bus.</strong> Slide viết "một cơ chế nào đó" chứ không viết "một cái bus", và đó là cố ý: trong máy hiện đại nó có thể là bus, là công tắc chéo (crossbar), là vòng (ring), hoặc là một mạng gói ngay trên chip. Kiến trúc chỉ đòi ba phần kia nói chuyện được với nhau; nói chuyện BẰNG CÁCH NÀO là chuyện tổ chức.</li>
<li><strong>Vì sao thành phần thứ tư hay làm người ta bất ngờ.</strong> Sinh viên kể CPU, bộ nhớ, I/O rất trơn rồi mất điểm vì quên phần liên kết. Hãy nhớ nó là thứ mà thiếu nó thì ba cái kia chỉ là ba món đồ rời nằm trên bàn, không phải một máy tính.</li>
</ul>
<p class="pitfall">⚠️ Câu trả lời hay mất điểm: kể "CPU, bộ nhớ, input, output" là bốn thành phần. Input và output ở đây là MỘT thành phần (I/O), còn thành phần thứ tư là liên kết hệ thống. Hãy bám danh sách của slide, đừng bám trực giác.</p>`],

      [8, 'CPU',
        `<p class="y-chinh">🎯 Zoom level 2. The CPU has <strong>four major structural components</strong>, and they mirror the four at machine level: <strong>Control Unit · ALU · Registers · CPU Interconnection</strong>.</p>
<table>
<tr><th>Inside the CPU</th><th>The slide's words</th><th>Mirrors which component of slide 7</th></tr>
<tr><td><strong>Control Unit</strong></td><td>Controls the operation of the CPU and hence the computer</td><td>The CPU's own "control" role</td></tr>
<tr><td><strong>ALU</strong> (Arithmetic and Logic Unit)</td><td>Performs the computer's data processing function</td><td>The processing role</td></tr>
<tr><td><strong>Registers</strong></td><td>Provide storage internal to the CPU</td><td>Main memory, one level down</td></tr>
<tr><td><strong>CPU Interconnection</strong></td><td>Some mechanism that provides for communication among the control unit, ALU, and registers</td><td>System interconnection, one level down</td></tr>
</table>
<ul>
<li><strong>The parallel is the point.</strong> Level 1: CPU, memory, I/O, interconnection. Level 2: control unit, ALU, registers, interconnection. The hierarchy does not just nest, it <em>rhymes</em> — each level has something that computes, something that stores, and something that connects. Spotting the rhyme is the fastest way to memorise both lists.</li>
<li><strong>Registers are storage, and they are the fastest storage there is.</strong> A register access is part of the instruction's own execution; a main-memory access costs on the order of a hundred times more. This gap is the reason cache exists (slide 10), the reason compilers work hard at register allocation, and the reason Chapter 4 opens with the memory hierarchy.</li>
<li><strong>Which registers, exactly?</strong> This slide does not say. Slide 17 answers it for one real machine — the IAS — with MBR, MAR, IR, IBR, PC, AC and MQ. Chapter 16 generalises: user-visible registers versus control and status registers. Note that <em>user-visible registers are architecture</em> (a program names them) while <em>how many extra hidden ones the chip has is organization</em>.</li>
<li><strong>No cache on this list either.</strong> On a modern chip L1 sits inside the core (see slide 11), yet Figure 1.1's CPU has no cache box — another reminder that Figure 1.1 is the classical view and slide 11 is the current one.</li>
</ul>
<p class="meo">💡 Learn the two four-item lists as one pair of columns, not as two separate lists. Ask yourself for each level: <em>who computes, who stores, who controls, who connects?</em> The answer always exists, at every level of the hierarchy.</p>`,
        `<p class="y-chinh">🎯 Mức phóng to thứ 2. CPU có <strong>bốn thành phần cấu trúc chính</strong>, và chúng soi gương đúng bốn thành phần ở tầng máy: <strong>Khối điều khiển · ALU · Thanh ghi · Liên kết trong CPU</strong>.</p>
<table>
<tr><th>Bên trong CPU</th><th>Nguyên văn của slide</th><th>Soi gương thành phần nào ở slide 7</th></tr>
<tr><td><strong>Control Unit</strong></td><td>Điều khiển hoạt động của CPU, và qua đó điều khiển cả máy tính</td><td>Vai trò "điều khiển" của chính CPU</td></tr>
<tr><td><strong>ALU</strong> (khối số học và logic)</td><td>Thực hiện chức năng xử lý dữ liệu của máy tính</td><td>Vai trò xử lý</td></tr>
<tr><td><strong>Registers</strong> (thanh ghi)</td><td>Cung cấp chỗ lưu trữ ngay bên trong CPU</td><td>Bộ nhớ chính, hạ xuống một tầng</td></tr>
<tr><td><strong>CPU Interconnection</strong></td><td>Một cơ chế cho phép khối điều khiển, ALU và các thanh ghi trao đổi với nhau</td><td>Liên kết hệ thống, hạ xuống một tầng</td></tr>
</table>
<ul>
<li><strong>Chỗ đáng giá nằm ở sự song song.</strong> Tầng 1: CPU, bộ nhớ, I/O, liên kết. Tầng 2: khối điều khiển, ALU, thanh ghi, liên kết. Phân cấp không chỉ lồng nhau, nó còn <em>gieo vần</em> — tầng nào cũng có một thứ để tính, một thứ để chứa, một thứ để nối. Nhận ra vần điệu ấy là cách thuộc cả hai danh sách nhanh nhất.</li>
<li><strong>Thanh ghi là chỗ lưu trữ, và là chỗ lưu trữ nhanh nhất từng có.</strong> Truy cập một thanh ghi là một phần của chính việc thi hành lệnh; truy cập bộ nhớ chính đắt hơn cỡ hàng trăm lần. Khoảng cách này là lý do cache tồn tại (slide 10), là lý do trình biên dịch vắt óc cấp phát thanh ghi, và là lý do Chương 4 mở đầu bằng phân cấp bộ nhớ.</li>
<li><strong>Chính xác là những thanh ghi nào?</strong> Slide này không nói. Slide 17 trả lời cho một cỗ máy thật — máy IAS — với MBR, MAR, IR, IBR, PC, AC và MQ. Chương 16 tổng quát hoá: thanh ghi người dùng thấy được, và thanh ghi điều khiển/trạng thái. Để ý: <em>thanh ghi người dùng thấy được là KIẾN TRÚC</em> (chương trình gọi tên chúng) còn <em>chip có thêm bao nhiêu thanh ghi ẩn là TỔ CHỨC</em>.</li>
<li><strong>Danh sách này cũng không có cache.</strong> Trên chip hiện đại, L1 nằm ngay trong lõi (xem slide 11), vậy mà CPU trong Figure 1.1 không có ô cache nào — thêm một lần nhắc rằng Figure 1.1 là bức nhìn cổ điển, còn slide 11 mới là bức đương thời.</li>
</ul>
<p class="meo">💡 Hãy học hai danh sách bốn mục như MỘT cặp cột, đừng học thành hai danh sách rời. Ở mỗi tầng tự hỏi: <em>ai tính, ai chứa, ai điều khiển, ai nối?</em> Câu trả lời luôn có, ở mọi tầng của phân cấp.</p>`],

      [9, 'Multicore Computer Structure',
        `<p class="y-chinh">🎯 Three words that students use as synonyms and the book refuses to: <strong>CPU</strong>, <strong>core</strong>, <strong>processor</strong>. Since roughly 2006 they stopped meaning the same thing, and the exam knows it.</p>
<table>
<tr><th>Term</th><th>Definition on the slide</th><th>Physical reality</th></tr>
<tr><td><strong>CPU</strong></td><td>The portion of the computer that fetches and executes instructions; consists of an ALU, a control unit, and registers; called a <em>processor</em> in a system with a single processing unit</td><td>A logical role, not necessarily a chip</td></tr>
<tr><td><strong>Core</strong></td><td>An individual processing unit on a processor chip; may be equivalent in functionality to a CPU on a single-CPU system; specialized processing units are also referred to as cores</td><td>One complete "CPU" engraved on part of a die</td></tr>
<tr><td><strong>Processor</strong></td><td>A physical piece of silicon containing one or more cores; the component that interprets and executes instructions; called a <em>multicore processor</em> if it contains multiple cores</td><td>The chip you buy and socket onto a board</td></tr>
</table>
<ul>
<li><strong>The historical accident behind the mess.</strong> Until the mid-2000s one chip held one CPU, so "processor" and "CPU" really were the same thing, and older textbooks (including the CSI106 material) use them interchangeably. When several CPUs moved onto one die, the vocabulary had to split: the die is the <em>processor</em>, each CPU on it is a <em>core</em>.</li>
<li><strong>Why the split happened at all — it is the performance story.</strong> Raising clock frequency ran into a power and heat wall in the early 2000s; the transistors Moore's law kept providing had to be spent on something else, and the answer was more cores rather than a faster single core. Chapter 21 is the full argument; here you only need the vocabulary.</li>
<li><strong>"Specialized processing units are also referred to as cores."</strong> This one line is why marketing can say a phone chip has a CPU core, GPU cores and a neural engine — a core need not be general-purpose.</li>
<li><strong>What it costs the programmer.</strong> Four cores do not make your single-threaded C program four times faster; they make four programs (or four threads) run at once. That is a change the programmer <em>can</em> see, so multicore is not purely an organizational change — it shows up in architecture as memory-ordering and synchronisation rules.</li>
</ul>
<p class="pitfall">⚠️ In a question about "how many CPUs does this machine have", read carefully whether the text says <em>processors</em> or <em>cores</em>. A machine with two 8-core chips has 2 processors and 16 cores; the operating system may report 32 logical processors if each core is 2-way multithreaded. All three numbers are correct answers to three different questions.</p>`,
        `<p class="y-chinh">🎯 Ba từ mà sinh viên hay dùng lẫn lộn còn sách thì nhất định không: <strong>CPU</strong>, <strong>core (lõi)</strong>, <strong>processor (bộ xử lý)</strong>. Từ khoảng 2006 chúng thôi đồng nghĩa, và đề thi biết điều đó.</p>
<table>
<tr><th>Thuật ngữ</th><th>Định nghĩa trên slide</th><th>Thực thể vật lý</th></tr>
<tr><td><strong>CPU</strong></td><td>Phần của máy tính lo NẠP và THI HÀNH lệnh; gồm một ALU, một khối điều khiển và các thanh ghi; trong hệ chỉ có một đơn vị xử lý thì gọi luôn là <em>processor</em></td><td>Một vai trò logic, không nhất thiết là một con chip</td></tr>
<tr><td><strong>Core</strong></td><td>Một đơn vị xử lý riêng lẻ trên một chip xử lý; về chức năng có thể tương đương một CPU của hệ một-CPU; các đơn vị xử lý CHUYÊN DỤNG cũng được gọi là core</td><td>Một "CPU" hoàn chỉnh khắc trên một phần của miếng silicon</td></tr>
<tr><td><strong>Processor</strong></td><td>Một miếng silicon vật lý chứa một hoặc nhiều core; là thành phần diễn dịch và thi hành lệnh; gọi là <em>multicore processor</em> nếu chứa nhiều core</td><td>Con chip bạn mua và cắm lên bo mạch</td></tr>
</table>
<ul>
<li><strong>Tai nạn lịch sử đứng sau mớ bòng bong này.</strong> Tới giữa những năm 2000, một chip chứa đúng một CPU, nên "processor" và "CPU" thật sự là một, và sách cũ (kể cả tài liệu CSI106) dùng lẫn cả hai. Khi nhiều CPU dọn về cùng một miếng silicon, từ vựng buộc phải tách: miếng silicon là <em>processor</em>, mỗi CPU trên đó là một <em>core</em>.</li>
<li><strong>Vì sao lại phải tách — đây chính là mạch truyện hiệu năng.</strong> Đầu những năm 2000, việc đẩy xung nhịp lên đụng bức tường điện năng và nhiệt; số transistor mà định luật Moore vẫn đều đặn cấp thêm phải tiêu vào việc khác, và câu trả lời là THÊM LÕI chứ không phải một lõi nhanh hơn. Chương 21 kể đủ lập luận; ở đây bạn chỉ cần từ vựng.</li>
<li><strong>"Các đơn vị xử lý chuyên dụng cũng được gọi là core."</strong> Đúng một dòng này là lý do quảng cáo được phép nói một chip điện thoại có lõi CPU, các lõi GPU và một neural engine — core không bắt buộc phải đa dụng.</li>
<li><strong>Cái giá với người lập trình.</strong> Bốn lõi KHÔNG làm chương trình C đơn luồng của bạn nhanh gấp bốn; chúng làm bốn chương trình (hoặc bốn luồng) chạy cùng lúc. Đây là thay đổi mà lập trình viên <em>có</em> thấy, nên đa lõi không thuần là thay đổi tổ chức — nó lộ ra ở kiến trúc dưới dạng các quy tắc thứ tự bộ nhớ và đồng bộ.</li>
</ul>
<p class="pitfall">⚠️ Gặp câu hỏi "máy này có bao nhiêu CPU", hãy đọc kỹ đề dùng chữ <em>processor</em> hay <em>core</em>. Máy có hai chip 8 lõi thì có 2 processor và 16 core; hệ điều hành có thể báo 32 bộ xử lý logic nếu mỗi lõi chạy 2 luồng. Cả ba con số đều đúng, cho ba câu hỏi khác nhau.</p>`],

      [10, 'Cache Memory',
        `<p class="y-chinh">🎯 Cache is <strong>multiple layers of memory between the processor and main memory</strong>: smaller and faster than main memory, holding data that is likely to be used in the near future. It is the single most important organizational trick in the whole book.</p>
<ul>
<li><strong>What the slide claims, line by line</strong> — cache is smaller and faster than main memory; it speeds up memory access by holding data from main memory likely to be used soon; and a greater performance improvement may be obtained by using <em>multiple levels</em>, with L1 closest to the core and L2, L3 and so on progressively farther away.</li>
<li><strong>Why it works at all — locality.</strong> Programs do not touch memory at random: they re-read the same variable (temporal locality) and walk through neighbouring addresses (spatial locality). A loop over an array hits both. Cache is a bet on that behaviour, and the bet pays because real programs almost always behave that way. Chapter 4 makes locality the formal foundation.</li>
<li><strong>Why "multiple levels" rather than one big fast memory.</strong> Fast memory is expensive per bit and, worse, gets slower as it gets bigger — a larger array takes longer to address and to reach physically. So you build a ladder: a tiny very fast L1, a bigger slower L2, a bigger slower still L3, then main memory. Each level is a compromise between size and speed, and the hierarchy as a whole behaves almost like the fastest level at almost the price of the cheapest.</li>
<li><strong>Cache is organization, not architecture — and that is the exam's favourite consequence.</strong> No instruction mentions cache; a program produces identical results with or without one. Only the running time changes. Which is precisely the definition of an organizational attribute from slide 2.</li>
<li><strong>Where the real numbers live.</strong> Slide 31 gives the cache figures of real Intel parts: the Pentium III of 1999 had 512 kB of L2, while the Core i9-7900X of 2017 had 14 MB of L3. Note that L3 grew as core count grew — it is the level the cores share.</li>
</ul>
<p class="meo">💡 The mental image that never fails: L1 is the sheet of paper on your desk, L2 is the drawer, L3 is the cabinet in the room, main memory is the library downstairs, disk is the warehouse across town. You do not want a bigger desk; you want the right page to already be on it.</p>`,
        `<p class="y-chinh">🎯 Cache là <strong>nhiều tầng bộ nhớ nằm giữa bộ xử lý và bộ nhớ chính</strong>: nhỏ hơn và nhanh hơn bộ nhớ chính, giữ sẵn dữ liệu nhiều khả năng sắp được dùng. Đây là mẹo TỔ CHỨC quan trọng nhất của cả cuốn sách.</p>
<ul>
<li><strong>Slide khẳng định gì, từng dòng</strong> — cache nhỏ hơn và nhanh hơn bộ nhớ chính; nó tăng tốc truy cập bộ nhớ bằng cách đặt sẵn vào cache dữ liệu từ bộ nhớ chính có khả năng sắp dùng tới; và có thể đạt mức cải thiện lớn hơn nữa bằng <em>nhiều tầng</em> cache, với L1 gần lõi nhất rồi L2, L3… xa dần.</li>
<li><strong>Vì sao nó chạy được — tính CỤC BỘ.</strong> Chương trình không đụng bộ nhớ một cách ngẫu nhiên: nó đọc đi đọc lại cùng một biến (cục bộ theo thời gian) và đi qua các địa chỉ kề nhau (cục bộ theo không gian). Một vòng lặp duyệt mảng trúng cả hai. Cache là một canh bạc đặt cược vào hành vi ấy, và canh bạc ăn vì chương trình thật gần như luôn hành xử như vậy. Chương 4 dựng tính cục bộ thành nền móng hình thức.</li>
<li><strong>Vì sao phải "nhiều tầng" thay vì một bộ nhớ to và nhanh.</strong> Bộ nhớ nhanh thì đắt tính trên mỗi bit, và tệ hơn: càng to thì càng chậm — mảng lớn hơn thì giải mã địa chỉ lâu hơn và đường vật lý dài hơn. Thế nên người ta dựng một cái thang: L1 tí hon cực nhanh, L2 lớn hơn chậm hơn, L3 lớn hơn nữa chậm hơn nữa, rồi tới bộ nhớ chính. Mỗi tầng là một thoả hiệp giữa dung lượng và tốc độ, còn cả phân cấp cộng lại thì hành xử gần như tầng nhanh nhất với giá gần như tầng rẻ nhất.</li>
<li><strong>Cache là TỔ CHỨC, không phải kiến trúc — và đây là hệ quả đề thi thích nhất.</strong> Không lệnh nào nhắc tới cache; chương trình cho kết quả y hệt dù có cache hay không. Chỉ thời gian chạy thay đổi. Đó đúng là định nghĩa thuộc tính tổ chức ở slide 2.</li>
<li><strong>Con số thật nằm ở đâu.</strong> Slide 31 cho số liệu cache của những con Intel thật: Pentium III năm 1999 có 512 kB L2, còn Core i9-7900X năm 2017 có 14 MB L3. Để ý L3 phình ra khi số lõi tăng — nó là tầng mà các lõi DÙNG CHUNG.</li>
</ul>
<p class="meo">💡 Hình dung không bao giờ hỏng: L1 là tờ giấy đang nằm trên mặt bàn, L2 là ngăn kéo, L3 là cái tủ trong phòng, bộ nhớ chính là thư viện dưới nhà, đĩa là kho hàng bên kia thành phố. Bạn không cần cái bàn to hơn; bạn cần đúng tờ giấy ấy đã nằm sẵn trên bàn.</p>`],

      [11, 'Figure 1.2 — Simplified View of Major Elements of a Multicore Computer',
        `<p class="y-chinh">🎯 The modern replacement for Figure 1.1. Same three-level zoom, but now the levels are <strong>MOTHERBOARD → PROCESSOR CHIP → CORE</strong>, and cache is everywhere.</p>
<table>
<tr><th>Level</th><th>Box</th><th>Contents drawn in the figure</th></tr>
<tr><td>1</td><td><strong>MOTHERBOARD</strong></td><td>Main memory chips (a row of them) · I/O chips (a row of them) · one <strong>processor chip</strong></td></tr>
<tr><td>2</td><td><strong>PROCESSOR CHIP</strong></td><td>Eight <strong>Core</strong> blocks (two rows of four) with two <strong>L3 cache</strong> blocks between them</td></tr>
<tr><td>3</td><td><strong>CORE</strong></td><td>Instruction logic · Arithmetic and logic unit (ALU) · Load/store logic · <strong>L1 I-cache</strong> and <strong>L1 data cache</strong> · <strong>L2 instruction cache</strong> and <strong>L2 data cache</strong></td></tr>
</table>
<ul>
<li><strong>Read it against Figure 1.1 and you can see forty years of change.</strong> Figure 1.1: one CPU, no cache, a system bus. Figure 1.2: eight cores on one chip, three levels of cache, and the memory chips pushed out to the board. The <em>function</em> list of slide 5 did not change at all; only the organization did. That contrast is the cleanest illustration of slide 2 in the whole chapter.</li>
<li><strong>L1 and L2 are per-core; L3 is shared.</strong> Look where the boxes sit: L1 and L2 are drawn <em>inside</em> the CORE, while the two L3 blocks sit outside the cores on the chip. That is the standard modern arrangement — private small caches for speed, one big shared cache so that cores can exchange data without going to main memory.</li>
<li><strong>Instructions and data are split at L1 and L2, joined at L3.</strong> The figure shows <em>L1 I-cache</em> versus <em>L1 data cache</em>, and likewise at L2. Splitting them lets the core fetch an instruction and a datum in the same cycle without one port fighting the other — a Harvard-style split at the cache level even though the architecture stays von Neumann (one address space for both).</li>
<li><strong>Three boxes make up the core's datapath.</strong> <em>Instruction logic</em> fetches and decodes, the <em>ALU</em> computes, <em>load/store logic</em> talks to memory. Compare with slide 8's list: instruction logic plays the control-unit role, and the registers are inside these blocks rather than drawn separately.</li>
<li><strong>Everything on this figure is a later chapter.</strong> L1/L2/L3 policy is Chapter 5; the memory chips are Chapter 6; the I/O chips are Chapter 8; the eight cores are Chapter 21.</li>
</ul>
<p class="pitfall">⚠️ Do not read the figure as "a computer has exactly 8 cores and 2 L3 blocks". It is a sketch of a typical chip, not a specification. The next two slides show a real one so you can see how much messier reality is.</p>`,
        `<p class="y-chinh">🎯 Bản thay thế hiện đại cho Figure 1.1. Vẫn là ba mức phóng to, nhưng bây giờ các mức là <strong>MOTHERBOARD → PROCESSOR CHIP → CORE</strong>, và cache thì ở khắp nơi.</p>
<table>
<tr><th>Mức</th><th>Khối</th><th>Hình vẽ những gì bên trong</th></tr>
<tr><td>1</td><td><strong>MOTHERBOARD</strong> (bo mạch chủ)</td><td>Các chip bộ nhớ chính (một hàng) · các chip I/O (một hàng) · một <strong>chip xử lý</strong></td></tr>
<tr><td>2</td><td><strong>PROCESSOR CHIP</strong></td><td>Tám khối <strong>Core</strong> (hai hàng bốn) với hai khối <strong>L3 cache</strong> nằm giữa</td></tr>
<tr><td>3</td><td><strong>CORE</strong></td><td>Instruction logic · Khối số học-logic (ALU) · Load/store logic · <strong>L1 I-cache</strong> và <strong>L1 data cache</strong> · <strong>L2 instruction cache</strong> và <strong>L2 data cache</strong></td></tr>
</table>
<ul>
<li><strong>Đặt cạnh Figure 1.1 là thấy bốn mươi năm thay đổi.</strong> Figure 1.1: một CPU, không cache, một bus hệ thống. Figure 1.2: tám lõi trên một chip, ba tầng cache, và các chip nhớ bị đẩy ra ngoài bo mạch. Danh sách <em>chức năng</em> ở slide 5 KHÔNG đổi chút nào; chỉ tổ chức đổi. Sự tương phản đó là minh hoạ sạch nhất cho slide 2 trong cả chương.</li>
<li><strong>L1 và L2 là RIÊNG từng lõi; L3 là DÙNG CHUNG.</strong> Hãy nhìn vị trí các ô: L1 và L2 được vẽ <em>bên trong</em> CORE, còn hai khối L3 nằm ngoài các lõi, trên chip. Đó là cách bố trí hiện đại chuẩn — cache nhỏ riêng để lấy tốc độ, một cache lớn dùng chung để các lõi trao đổi dữ liệu mà không phải xuống bộ nhớ chính.</li>
<li><strong>Lệnh và dữ liệu TÁCH ở L1 và L2, NHẬP lại ở L3.</strong> Hình ghi rõ <em>L1 I-cache</em> và <em>L1 data cache</em>, ở L2 cũng vậy. Tách ra thì lõi nạp được một lệnh và một toán hạng trong cùng một nhịp mà hai cổng không giành nhau — một kiểu tách Harvard ở tầng cache, dù kiến trúc vẫn là von Neumann (chung một không gian địa chỉ cho cả hai).</li>
<li><strong>Ba ô tạo nên đường dữ liệu của lõi.</strong> <em>Instruction logic</em> nạp và giải mã lệnh, <em>ALU</em> tính, <em>load/store logic</em> nói chuyện với bộ nhớ. So với danh sách ở slide 8: instruction logic đóng vai khối điều khiển, còn các thanh ghi nằm bên trong những khối này chứ không được vẽ riêng.</li>
<li><strong>Mọi thứ trên hình này đều là một chương sau.</strong> Chính sách L1/L2/L3 là Chương 5; chip nhớ là Chương 6; chip I/O là Chương 8; tám cái lõi là Chương 21.</li>
</ul>
<p class="pitfall">⚠️ Đừng đọc hình này thành "máy tính có đúng 8 lõi và 2 khối L3". Đây là phác thảo một chip điển hình, không phải đặc tả. Hai slide kế tiếp cho bạn xem một con chip THẬT để thấy thực tế lộn xộn tới đâu.</p>`],
      [12, 'Figure 1.3 — IBM z13 Processor Unit (PU) Chip Diagram',
        `<p class="y-chinh">🎯 A photograph-like floorplan of a <strong>real</strong> processor chip: the IBM z13 processor unit, the mainframe successor of the System/370 story from slide 3. After the tidy sketch of Figure 1.2, this is what the same idea looks like when it is actually built.</p>
<table>
<tr><th>Label on the die</th><th>What it is</th></tr>
<tr><td><strong>Core0 … Core7</strong></td><td>Eight processor cores, laid out around the edges of the die</td></tr>
<tr><td><strong>L3C 0 / L3C 1</strong></td><td>Two L3 cache controllers — the shared cache level of slide 11, split in two halves</td></tr>
<tr><td><strong>L3D nn / L3B nn</strong></td><td>The L3 cache data and directory arrays, the thin strips packed between the cores</td></tr>
<tr><td><strong>MCU · MC Drvs · MC Rcvrs</strong></td><td>Memory control unit plus its drivers and receivers — the road out to the main memory chips</td></tr>
<tr><td><strong>GX · GX Drvs/Rcvrs · PBU0/1 · PCI0/1</strong></td><td>The I/O side: bus and PCI interfaces to the outside world</td></tr>
<tr><td><strong>CP0/CP1/CP3 Drvs·Rcvrs · SC Drvs/Rcvrs</strong></td><td>Links to the other processor chips and to the system controller of a multi-chip drawer</td></tr>
</table>
<ul>
<li><strong>Count what the area is spent on.</strong> Eight cores occupy the corners; a very large fraction of the middle is <em>cache</em> (L3 data, L3 directory, L3 controllers), and a whole border of the die is nothing but drivers and receivers for talking to memory, to I/O and to other chips. Logic that actually computes is a minority of the silicon — the majority moves and stores data. Slide 5's four functions, visible as floor area.</li>
<li><strong>The three-in-one lesson about pins and wires.</strong> "Drvs" and "Rcvrs" (drivers and receivers) exist because signals leaving a chip need far more power than signals inside it. Getting data <em>off</em> a chip is slow and expensive — which is exactly why cache exists and why the memory hierarchy has the shape it has.</li>
<li><strong>Continuity with slide 3.</strong> The z13 (announced by IBM in 2015) runs z/Architecture, the direct descendant of the System/370 architecture of 1970. Everything you see on this die is organization; the architecture it implements is decades older, and old software still runs on it.</li>
<li><strong>Why the book shows a mainframe rather than a PC chip.</strong> Mainframe designers publish their floorplans; and a machine sold for continuous availability makes the non-computing parts (recovery, coherency, I/O) large enough to see. The proportions on a desktop chip are different but the categories are the same.</li>
</ul>
<p class="pitfall">⚠️ This slide is not asking you to memorise acronyms. No CEA201 exam asks what PBU or GX stand for. What is examinable is the <em>reading</em> of the picture: cores, shared cache, memory interface, I/O interface — the four components of slide 7, laid out on silicon.</p>`,
        `<p class="y-chinh">🎯 Sơ đồ mặt bằng của một con chip xử lý <strong>THẬT</strong>: bộ xử lý IBM z13, hậu duệ máy lớn của câu chuyện System/370 ở slide 3. Sau bức phác thảo gọn gàng của Figure 1.2, đây là hình hài của cùng ý tưởng ấy khi được dựng ra thật.</p>
<table>
<tr><th>Nhãn trên miếng silicon</th><th>Nó là gì</th></tr>
<tr><td><strong>Core0 … Core7</strong></td><td>Tám lõi xử lý, xếp quanh rìa miếng silicon</td></tr>
<tr><td><strong>L3C 0 / L3C 1</strong></td><td>Hai bộ điều khiển cache L3 — tầng cache dùng chung ở slide 11, chia làm hai nửa</td></tr>
<tr><td><strong>L3D nn / L3B nn</strong></td><td>Mảng dữ liệu và thư mục của cache L3, là những dải hẹp nhồi giữa các lõi</td></tr>
<tr><td><strong>MCU · MC Drvs · MC Rcvrs</strong></td><td>Khối điều khiển bộ nhớ cùng mạch đẩy/mạch thu — con đường ra tới các chip nhớ chính</td></tr>
<tr><td><strong>GX · GX Drvs/Rcvrs · PBU0/1 · PCI0/1</strong></td><td>Phía I/O: các giao diện bus và PCI ra thế giới bên ngoài</td></tr>
<tr><td><strong>CP0/CP1/CP3 Drvs·Rcvrs · SC Drvs/Rcvrs</strong></td><td>Đường nối sang các chip xử lý khác và sang bộ điều khiển hệ thống trong cùng ngăn máy</td></tr>
</table>
<ul>
<li><strong>Hãy đếm xem DIỆN TÍCH bị tiêu vào đâu.</strong> Tám lõi chiếm các góc; một phần rất lớn ở giữa là <em>cache</em> (dữ liệu L3, thư mục L3, bộ điều khiển L3), còn cả một viền quanh miếng silicon chỉ toàn mạch đẩy và mạch thu để nói chuyện với bộ nhớ, với I/O và với các chip khác. Phần logic thật sự TÍNH TOÁN chỉ là thiểu số; đa số silicon dùng để DI CHUYỂN và LƯU TRỮ dữ liệu. Bốn chức năng của slide 5, hiện ra thành diện tích mặt bằng.</li>
<li><strong>Bài học ba trong một về chân chip và dây dẫn.</strong> "Drvs" và "Rcvrs" (driver/receiver) tồn tại vì tín hiệu RA KHỎI chip cần năng lượng lớn hơn hẳn tín hiệu đi trong chip. Đưa dữ liệu <em>ra ngoài</em> chip thì chậm và đắt — đó đúng là lý do cache tồn tại và lý do phân cấp bộ nhớ có hình dáng như vậy.</li>
<li><strong>Mạch nối với slide 3.</strong> Con z13 (IBM công bố năm 2015) chạy z/Architecture, hậu duệ trực hệ của kiến trúc System/370 năm 1970. Mọi thứ bạn thấy trên miếng silicon này là TỔ CHỨC; cái kiến trúc mà nó hiện thực thì già hơn hàng chục năm, và phần mềm cũ vẫn chạy được trên nó.</li>
<li><strong>Vì sao sách chọn chip máy lớn chứ không phải chip PC.</strong> Nhà thiết kế máy lớn công bố sơ đồ mặt bằng; và một cỗ máy bán với cam kết chạy liên tục thì các phần KHÔNG tính toán (phục hồi lỗi, nhất quán cache, I/O) đủ lớn để nhìn thấy được. Tỉ lệ trên chip máy bàn thì khác, nhưng các hạng mục thì vẫn thế.</li>
</ul>
<p class="pitfall">⚠️ Slide này không bắt bạn thuộc các chữ viết tắt. Không đề CEA201 nào hỏi PBU hay GX là gì. Thứ ra thi là khả năng ĐỌC bức hình: lõi, cache dùng chung, giao diện bộ nhớ, giao diện I/O — đúng bốn thành phần của slide 7, bày ra trên silicon.</p>`],

      [13, 'Figure 1.4 — IBM z13 Core Layout',
        `<p class="y-chinh">🎯 One more zoom: inside a single z13 core. Slide 8 said a CPU contains a control unit, an ALU, registers and an interconnection. Here is what those four turn into when a real core is drawn — a dozen named units, most of them variations on "fetch", "decode", "compute" and "talk to memory".</p>
<table>
<tr><th>Label</th><th>Unit</th><th>Which slide-8 role it plays</th></tr>
<tr><td><strong>IFB</strong></td><td>Instruction fetch and branch</td><td>Control unit (fetch stage)</td></tr>
<tr><td><strong>IDU</strong></td><td>Instruction decode unit</td><td>Control unit (decode stage)</td></tr>
<tr><td><strong>ISU</strong></td><td>Instruction sequence unit</td><td>Control unit (issue and ordering)</td></tr>
<tr><td><strong>FXU</strong></td><td>Fixed-point (integer) execution unit</td><td>ALU</td></tr>
<tr><td><strong>VFD</strong></td><td>Vector and floating-point unit</td><td>ALU (a second, specialised one)</td></tr>
<tr><td><strong>LSU</strong></td><td>Load/store unit</td><td>The path to memory</td></tr>
<tr><td><strong>XU</strong></td><td>Translation unit (virtual → physical addresses)</td><td>Memory management — Chapter 9</td></tr>
<tr><td><strong>ICM</strong> (three blocks)</td><td>Instruction cache and merge — the core's cache arrays</td><td>Storage inside the core</td></tr>
<tr><td><strong>COP</strong></td><td>Dedicated co-processor (compression, cryptography)</td><td>A specialised "core" in the sense of slide 9</td></tr>
<tr><td><strong>RU</strong></td><td>Recovery unit</td><td>Reliability — no equivalent on slide 8</td></tr>
<tr><td><strong>PC</strong></td><td>Pervasive core (test, initialisation, monitoring)</td><td>Housekeeping — no equivalent on slide 8</td></tr>
</table>
<ul>
<li><strong>The clearest fact on the slide is an area fact.</strong> The three ICM blocks plus the LSU take up something like half the core. Again: storing and moving beats computing, in silicon area, by a wide margin.</li>
<li><strong>Two execution units, not one.</strong> FXU handles integers, VFD handles vectors and floating point. A core with several execution units can start more than one instruction per cycle — that is the definition of <em>superscalar</em>, and it is Chapter 18. Figure 1.4 is where you first see the evidence for it.</li>
<li><strong>Two units exist for reasons Chapter 1 has not mentioned yet.</strong> The XU does virtual-to-physical address translation, which only makes sense once you know about virtual memory (Chapter 9). The RU exists so the machine can detect and recover from a hardware error mid-instruction — a mainframe requirement that a laptop chip does not pay for.</li>
<li><strong>Read this as the ceiling of the hierarchy game.</strong> COMPUTER → chip → core → functional unit. Slide 20 will drop two more levels, to gates and memory cells, and Chapter 12 goes to the transistor. It is the same method all the way down.</li>
</ul>
<p class="meo">💡 Do not memorise this table. Memorise the <em>pattern</em>: every modern core has a front end (fetch, decode, issue), several execution units, a load/store path, address translation, and caches. Any core diagram you meet — ARM, x86, RISC-V — can be read with those five words.</p>`,
        `<p class="y-chinh">🎯 Phóng to thêm một nấc: bên trong MỘT lõi z13. Slide 8 nói CPU gồm khối điều khiển, ALU, thanh ghi và liên kết. Đây là hình hài bốn thứ đó khi một lõi thật được vẽ ra — cả chục khối có tên, mà phần lớn là biến thể của "nạp lệnh", "giải mã", "tính" và "nói chuyện với bộ nhớ".</p>
<table>
<tr><th>Nhãn</th><th>Khối</th><th>Đóng vai nào ở slide 8</th></tr>
<tr><td><strong>IFB</strong></td><td>Nạp lệnh và xử lý rẽ nhánh</td><td>Khối điều khiển (giai đoạn nạp)</td></tr>
<tr><td><strong>IDU</strong></td><td>Khối giải mã lệnh</td><td>Khối điều khiển (giai đoạn giải mã)</td></tr>
<tr><td><strong>ISU</strong></td><td>Khối định trình tự lệnh</td><td>Khối điều khiển (phát lệnh và sắp thứ tự)</td></tr>
<tr><td><strong>FXU</strong></td><td>Khối thi hành số nguyên (dấu phẩy tĩnh)</td><td>ALU</td></tr>
<tr><td><strong>VFD</strong></td><td>Khối vector và dấu phẩy động</td><td>ALU (một cái thứ hai, chuyên dụng)</td></tr>
<tr><td><strong>LSU</strong></td><td>Khối nạp/lưu (load/store)</td><td>Con đường tới bộ nhớ</td></tr>
<tr><td><strong>XU</strong></td><td>Khối dịch địa chỉ (ảo → vật lý)</td><td>Quản lý bộ nhớ — Chương 9</td></tr>
<tr><td><strong>ICM</strong> (ba khối)</td><td>Cache lệnh và trộn — các mảng cache của lõi</td><td>Lưu trữ ngay trong lõi</td></tr>
<tr><td><strong>COP</strong></td><td>Đồng xử lý chuyên dụng (nén, mật mã)</td><td>Một "core" chuyên dụng theo nghĩa slide 9</td></tr>
<tr><td><strong>RU</strong></td><td>Khối phục hồi lỗi</td><td>Độ tin cậy — slide 8 không có thứ tương đương</td></tr>
<tr><td><strong>PC</strong></td><td>Pervasive core (kiểm tra, khởi tạo, giám sát)</td><td>Vận hành nội bộ — slide 8 không có thứ tương đương</td></tr>
</table>
<ul>
<li><strong>Dữ kiện rõ nhất trên slide là một dữ kiện về DIỆN TÍCH.</strong> Ba khối ICM cộng với LSU chiếm cỡ phân nửa cái lõi. Lại một lần nữa: lưu trữ và di chuyển thắng tính toán, xét theo diện tích silicon, và thắng đậm.</li>
<li><strong>HAI khối thi hành, không phải một.</strong> FXU lo số nguyên, VFD lo vector và số thực. Một lõi có nhiều khối thi hành thì khởi động được hơn một lệnh trong mỗi nhịp — đó chính là định nghĩa <em>superscalar</em>, nội dung Chương 18. Figure 1.4 là chỗ bạn thấy bằng chứng đầu tiên cho nó.</li>
<li><strong>Hai khối tồn tại vì lý do mà Chương 1 chưa nhắc.</strong> XU dịch địa chỉ ảo sang địa chỉ vật lý, chỉ có nghĩa khi bạn đã biết bộ nhớ ảo (Chương 9). RU có mặt để máy phát hiện và phục hồi lỗi phần cứng ngay giữa một lệnh — yêu cầu của máy lớn, mà chip laptop không phải trả tiền cho nó.</li>
<li><strong>Hãy đọc slide này như trần của trò chơi phân cấp.</strong> COMPUTER → chip → lõi → khối chức năng. Slide 20 sẽ tụt thêm hai nấc nữa, xuống cổng logic và ô nhớ, còn Chương 12 xuống tới transistor. Cùng một phương pháp, suốt từ trên xuống dưới.</li>
</ul>
<p class="meo">💡 Đừng học thuộc bảng này. Hãy thuộc cái <em>khuôn</em>: lõi hiện đại nào cũng có một đầu vào (nạp, giải mã, phát lệnh), vài khối thi hành, một đường load/store, một khối dịch địa chỉ, và các cache. Gặp sơ đồ lõi nào — ARM, x86, RISC-V — cũng đọc được bằng năm chữ đó.</p>`],

      [14, 'History of Computers — First Generation: Vacuum Tubes',
        `<p class="y-chinh">🎯 The history half of the chapter begins. Generation one is defined by its switching technology — <strong>vacuum tubes</strong> — and its representative machine is the <strong>IAS computer</strong>, the machine that made the <strong>stored-program concept</strong> real.</p>
<ul>
<li><strong>What the slide states, in order</strong> — vacuum tubes were used for digital logic elements and memory; the IAS computer's fundamental design approach was the stored program concept; the concept is attributed to the mathematician <strong>John von Neumann</strong>; the first publication of the idea was in <strong>1945 for the EDVAC</strong>; design began at the <strong>Princeton Institute for Advanced Studies</strong>; the machine was <strong>completed in 1952</strong>; and it is the <strong>prototype of all subsequent general-purpose computers</strong>.</li>
<li><strong>What the stored-program concept actually says</strong> — the program is held in the same memory as the data, in the same binary form, so the machine can fetch an instruction the way it fetches a number. Before this, machines were rewired or re-plugged for each new job. Everything that follows — compilers, operating systems, viruses, self-modifying code — rests on this one decision.</li>
<li><strong>Numbers worth quoting about generation one (background, not on this slide).</strong> ENIAC, unveiled at the University of Pennsylvania in <strong>February 1946</strong>, used <strong>17,468 vacuum tubes</strong>, weighed about <strong>30 tons</strong>, drew roughly <strong>140 kW</strong>, and performed about <strong>5,000 additions per second</strong>. It was <em>not</em> a stored-program machine: it was programmed by setting switches and plugging cables, which could take days. The IAS machine is the answer to that pain.</li>
<li><strong>The 1945 publication is a specific document.</strong> "First Draft of a Report on the EDVAC", circulated in June 1945 with von Neumann's name on it, is why the architecture carries his name. The design work was collective (Eckert and Mauchly among others), which is why the phrase "attributed to" on the slide is carefully chosen rather than "invented by".</li>
<li><strong>Seven years from idea to machine.</strong> Published 1945, completed 1952. Slide 15 to slide 19 dissect the finished machine: its structure, its word format, its registers, its execution cycle and its instruction set — all in fewer than 30 instructions, which is exactly why it is a good teaching machine.</li>
</ul>
<p class="pitfall">⚠️ Two traps. (1) The IAS is <em>not</em> the first stored-program computer to run — the Manchester Baby (SSEM) ran a stored program in June 1948 and EDSAC in May 1949, while IAS was completed in 1952. The slide's claim is "prototype of all subsequent general-purpose computers", which is about influence, not about being first. (2) EDVAC is the machine the 1945 report described; IAS is a different, later machine built at Princeton. Do not merge the two names.</p>`,
        `<p class="y-chinh">🎯 Nửa lịch sử của chương bắt đầu. Thế hệ một được định nghĩa bằng công nghệ đóng/ngắt của nó — <strong>đèn điện tử (vacuum tube)</strong> — và cỗ máy đại diện là <strong>máy IAS</strong>, cỗ máy biến <strong>ý tưởng chương trình lưu trong bộ nhớ</strong> thành hiện thực.</p>
<ul>
<li><strong>Slide nói gì, theo thứ tự</strong> — đèn điện tử được dùng làm phần tử logic số và làm bộ nhớ; hướng thiết kế nền tảng của máy IAS là ý tưởng chương trình lưu trong bộ nhớ; ý tưởng ấy được quy cho nhà toán học <strong>John von Neumann</strong>; lần công bố đầu tiên là năm <strong>1945, cho máy EDVAC</strong>; việc thiết kế khởi động tại <strong>Viện Nghiên cứu Cao cấp Princeton</strong>; máy <strong>hoàn thành năm 1952</strong>; và nó là <strong>nguyên mẫu của mọi máy tính đa dụng về sau</strong>.</li>
<li><strong>Ý tưởng "chương trình lưu trong bộ nhớ" thật ra nói gì</strong> — chương trình nằm CÙNG bộ nhớ với dữ liệu, cùng dạng nhị phân, nên máy nạp một lệnh y như nạp một con số. Trước đó, muốn giao việc mới thì phải đi đấu lại dây. Mọi thứ đến sau — trình biên dịch, hệ điều hành, virus, mã tự sửa mình — đều đứng trên đúng một quyết định này.</li>
<li><strong>Những con số đáng trích về thế hệ một (bối cảnh, KHÔNG có trên slide).</strong> Máy ENIAC, ra mắt ở Đại học Pennsylvania <strong>tháng 2/1946</strong>, dùng <strong>17.468 đèn điện tử</strong>, nặng khoảng <strong>30 tấn</strong>, ngốn cỡ <strong>140 kW</strong>, và làm được khoảng <strong>5.000 phép cộng mỗi giây</strong>. Nó <em>không</em> phải máy lưu chương trình: lập trình nó là gạt công tắc và cắm dây, có khi mất mấy ngày. Máy IAS chính là câu trả lời cho nỗi khổ ấy.</li>
<li><strong>Bản công bố 1945 là một tài liệu cụ thể.</strong> "First Draft of a Report on the EDVAC", lưu hành tháng 6/1945 với tên von Neumann trên đó, là lý do kiến trúc mang tên ông. Công việc thiết kế vốn là của cả tập thể (có Eckert và Mauchly), nên chữ "attributed to" (được quy cho) trên slide là chọn lựa thận trọng, chứ không viết "invented by".</li>
<li><strong>Bảy năm từ ý tưởng tới cỗ máy.</strong> Công bố 1945, hoàn thành 1952. Slide 15 tới slide 19 mổ xẻ cỗ máy đã xong: cấu trúc, khuôn dạng từ nhớ, các thanh ghi, chu trình thi hành và tập lệnh — tất cả gói trong chưa tới 30 lệnh, và chính vì thế nó là một cỗ máy rất tốt để dạy học.</li>
</ul>
<p class="pitfall">⚠️ Hai bẫy. (1) IAS <em>không</em> phải máy lưu chương trình đầu tiên CHẠY được — máy Manchester Baby (SSEM) chạy một chương trình lưu trong bộ nhớ tháng 6/1948 và EDSAC tháng 5/1949, trong khi IAS hoàn thành năm 1952. Slide chỉ nói "nguyên mẫu của mọi máy đa dụng về sau", tức nói về ẢNH HƯỞNG chứ không nói về việc đầu tiên. (2) EDVAC là cỗ máy mà báo cáo 1945 mô tả; IAS là một cỗ máy KHÁC, dựng sau, ở Princeton. Đừng nhập hai cái tên làm một.</p>`],

      [15, 'Figure 1.5 — IAS Structure',
        `<p class="y-chinh">🎯 The block diagram of the IAS machine. Everything slide 6 drew as abstract circles appears here with real names, and the whole machine fits on one slide — which is why it is worth learning properly.</p>
<table>
<tr><th>Block in the figure</th><th>Contents</th><th>Job</th></tr>
<tr><td><strong>Arithmetic-logic unit (CA)</strong></td><td>AC · MQ · arithmetic-logic circuits · MBR</td><td>Computes; holds operands and results</td></tr>
<tr><td><strong>Program control unit (CC)</strong></td><td>PC · IBR · MAR · IR · control circuits</td><td>Decides which instruction runs next and emits control signals</td></tr>
<tr><td><strong>Main memory (M)</strong></td><td>M(0), M(1), M(2) … M(4093), M(4094), M(4095)</td><td>Holds both instructions and data</td></tr>
<tr><td><strong>Input-output equipment (I, O)</strong></td><td>—</td><td>Moves data in and out</td></tr>
</table>
<ul>
<li><strong>The register legend, printed on the slide itself</strong> — AC: accumulator register · MQ: multiply-quotient register · MBR: memory buffer register · IBR: instruction buffer register · PC: program counter · MAR: memory address register · IR: instruction register. Slide 17 explains each in a sentence.</li>
<li><strong>Follow the two arrows leaving memory and you have understood von Neumann.</strong> The label on the line into the CPU says "Instructions <em>and</em> data" — one memory, one path, two kinds of content. And addresses travel the other way, from MAR down to memory. That single labelled arrow is the stored-program concept drawn as a wire.</li>
<li><strong>MAR out, MBR in and out.</strong> MAR says <em>where</em>, MBR carries <em>what</em>. Every memory access in the machine is "put an address in MAR, then read or write MBR". Keeping that pair straight makes slide 18's flowchart readable line by line.</li>
<li><strong>Why the diagram shows M(4095) as the last word.</strong> The address field of an IAS instruction is 12 bits (slide 16), and 2<sup>12</sup> = 4096, so addresses 0…4095 are the most the format can name. The physical IAS machine was actually built with <strong>1,000 words</strong> of 40 bits. Two different numbers, both correct: 4,096 is the addressing limit, 1,000 is what was installed.</li>
<li><strong>Everything here is architecture except the "arithmetic-logic circuits" box.</strong> A programmer names AC, MQ, PC and memory addresses; nobody names the circuits inside the grey box. Slide 2, applied to a real machine.</li>
</ul>
<p class="dap-an">✅ Worked check — how wide is the address bus of the IAS? The address must reach 4,096 distinct words, and 2<sup>12</sup> = 4,096, so 12 bits are needed and 12 lines suffice. And how large is the whole addressable memory in bits? 4,096 words × 40 bits = 163,840 bits ≈ 20 kB. The machine as built (1,000 words × 40 bits = 40,000 bits = 5 kB) is a quarter of that. For scale: one photo on your phone is a thousand times bigger than the entire memory of the prototype of all general-purpose computers.</p>`,
        `<p class="y-chinh">🎯 Sơ đồ khối của máy IAS. Mọi thứ slide 6 vẽ thành vòng tròn trừu tượng thì ở đây hiện ra với tên thật, và cả cỗ máy gói gọn trong một slide — chính vì thế nó đáng học cho tới nơi.</p>
<table>
<tr><th>Khối trong hình</th><th>Bên trong</th><th>Nhiệm vụ</th></tr>
<tr><td><strong>Arithmetic-logic unit (CA)</strong></td><td>AC · MQ · mạch số học-logic · MBR</td><td>Tính toán; giữ toán hạng và kết quả</td></tr>
<tr><td><strong>Program control unit (CC)</strong></td><td>PC · IBR · MAR · IR · mạch điều khiển</td><td>Quyết định lệnh nào chạy tiếp và phát tín hiệu điều khiển</td></tr>
<tr><td><strong>Main memory (M)</strong></td><td>M(0), M(1), M(2) … M(4093), M(4094), M(4095)</td><td>Chứa CẢ lệnh lẫn dữ liệu</td></tr>
<tr><td><strong>Input-output equipment (I, O)</strong></td><td>—</td><td>Đưa dữ liệu vào và ra</td></tr>
</table>
<ul>
<li><strong>Bảng chú giải thanh ghi, in ngay trên slide</strong> — AC: thanh ghi tích luỹ · MQ: thanh ghi nhân-thương · MBR: thanh ghi đệm bộ nhớ · IBR: thanh ghi đệm lệnh · PC: bộ đếm chương trình · MAR: thanh ghi địa chỉ bộ nhớ · IR: thanh ghi lệnh. Slide 17 giải thích từng cái bằng một câu.</li>
<li><strong>Đi theo hai mũi tên rời khỏi bộ nhớ là hiểu von Neumann.</strong> Nhãn trên đường vào CPU ghi "Instructions <em>and</em> data" — một bộ nhớ, một con đường, hai loại nội dung. Còn địa chỉ đi chiều ngược lại, từ MAR xuống bộ nhớ. Đúng một mũi tên có nhãn ấy chính là ý tưởng chương trình-lưu-trong-bộ-nhớ, vẽ thành sợi dây.</li>
<li><strong>MAR đi ra, MBR đi cả hai chiều.</strong> MAR nói <em>ở đâu</em>, MBR mang <em>cái gì</em>. Mọi lần truy cập bộ nhớ của máy đều là "đặt địa chỉ vào MAR, rồi đọc hoặc ghi MBR". Giữ cặp này cho rành thì lưu đồ ở slide 18 đọc được từng dòng.</li>
<li><strong>Vì sao hình vẽ từ nhớ cuối cùng là M(4095).</strong> Trường địa chỉ của một lệnh IAS dài 12 bit (slide 16), mà 2<sup>12</sup> = 4096, nên địa chỉ 0…4095 là tất cả những gì khuôn dạng gọi tên được. Máy IAS vật lý thì thật ra chỉ lắp <strong>1.000 từ nhớ</strong> 40 bit. Hai con số khác nhau, cả hai đều đúng: 4.096 là giới hạn đánh địa chỉ, 1.000 là lượng đã lắp.</li>
<li><strong>Ở đây mọi thứ đều là KIẾN TRÚC, trừ cái hộp "mạch số học-logic".</strong> Lập trình viên gọi tên AC, MQ, PC và các địa chỉ bộ nhớ; không ai gọi tên những mạch nằm trong cái hộp xám ấy. Slide 2, áp vào một cỗ máy thật.</li>
</ul>
<p class="dap-an">✅ Kiểm lại bằng phép tính — bus địa chỉ của IAS rộng bao nhiêu? Địa chỉ phải với tới 4.096 từ khác nhau, mà 2<sup>12</sup> = 4.096, nên cần 12 bit và 12 đường là đủ. Còn toàn bộ bộ nhớ đánh địa chỉ được là bao nhiêu bit? 4.096 từ × 40 bit = 163.840 bit ≈ 20 kB. Máy dựng thật (1.000 từ × 40 bit = 40.000 bit = 5 kB) chỉ bằng một phần tư con số đó. Để dễ hình dung: một tấm ảnh trong điện thoại bạn lớn gấp cả nghìn lần toàn bộ bộ nhớ của cỗ máy được gọi là nguyên mẫu của mọi máy tính đa dụng.</p>`],

      [16, 'Figure 1.6 — IAS Memory Formats',
        `<p class="y-chinh">🎯 One word of IAS memory is <strong>40 bits</strong>, and it can be read two ways: as <strong>one number</strong>, or as <strong>two 20-bit instructions</strong>. This single picture is the stored-program concept made concrete — the bits do not say which they are; the machine decides by how it fetches them.</p>
<table>
<tr><th>Format</th><th>Bit layout</th><th>Meaning</th></tr>
<tr><td>(a) <strong>Number word</strong></td><td>bit 0 = sign bit; bits 1–39 = magnitude</td><td>A 40-bit signed number (sign + 39 bits)</td></tr>
<tr><td>(b) <strong>Instruction word</strong></td><td>bits 0–7 opcode, bits 8–19 address · bits 20–27 opcode, bits 28–39 address</td><td>Two instructions packed in one word: the <em>left instruction</em> (bits 0–19) and the <em>right instruction</em> (bits 20–39)</td></tr>
</table>
<ul>
<li><strong>Read the numbers off the figure.</strong> Each instruction is 8 bits of opcode + 12 bits of address = 20 bits; two of them fill the 40-bit word exactly. 8 bits of opcode allow up to 2<sup>8</sup> = 256 different instructions, of which the IAS actually defined 21 (slide 19). 12 bits of address allow 2<sup>12</sup> = 4,096 memory words — exactly the M(4095) of the previous slide.</li>
<li><strong>Why two instructions per word is not a quirk but an economy.</strong> Memory was the expensive part, and the machine already paid to fetch 40 bits at a time. Packing two instructions into one fetch halves the number of memory reads for straight-line code. That is why the IAS has an IBR — a buffer to hold the right-hand instruction while the left one executes (slides 17 and 18).</li>
<li><strong>The consequence for jumps, which is where it gets interesting.</strong> A branch target is not just an address, it is an address <em>and a half</em>: you have to say <em>left half</em> or <em>right half</em>. That is exactly why Table 1.1 on slide 19 lists two unconditional jumps — JUMP M(X,0:19) and JUMP M(X,20:39) — instead of one.</li>
<li><strong>Sign-magnitude, not two's complement.</strong> Bit 0 is a dedicated sign bit and the remaining 39 bits are the magnitude. Modern machines use two's complement instead (Chapter 11), largely because sign-magnitude gives you two zeroes (+0 and −0) and needs separate circuits for add and subtract.</li>
<li><strong>The deepest point on the slide.</strong> There is no tag, no type field, nothing in the 40 bits that says "I am a number" or "I am two instructions". The same word is an instruction because the PC pointed at it, and data because an operand address pointed at it. That is the power and the danger of the von Neumann design, and it is why Table 1.1 can contain instructions that <em>modify addresses inside other instructions</em>.</li>
</ul>
<p class="dap-an">✅ Worked example — how many bits of a 40-bit instruction word are opcode, and how many are address? Opcode: 8 + 8 = 16 bits. Address: 12 + 12 = 24 bits. Check: 16 + 24 = 40. ✔ And what fraction of the word is "useful" address space? 24/40 = 60%. Compare with modern x86-64, where a single instruction may be 1 to 15 bytes long — variable length, a different trade-off between density and decoding cost (Chapters 13–14).</p>`,
        `<p class="y-chinh">🎯 Một từ nhớ của IAS dài <strong>40 bit</strong>, và nó đọc được theo hai kiểu: là <strong>một con số</strong>, hoặc là <strong>hai lệnh 20 bit</strong>. Đúng một bức hình này làm cho ý tưởng chương trình-lưu-trong-bộ-nhớ trở nên cụ thể — bản thân các bit không nói chúng là gì; máy quyết định bằng CÁCH nó nạp chúng.</p>
<table>
<tr><th>Khuôn dạng</th><th>Bố trí bit</th><th>Ý nghĩa</th></tr>
<tr><td>(a) <strong>Từ SỐ</strong></td><td>bit 0 = bit dấu; bit 1–39 = phần trị</td><td>Một số có dấu 40 bit (dấu + 39 bit)</td></tr>
<tr><td>(b) <strong>Từ LỆNH</strong></td><td>bit 0–7 mã lệnh, bit 8–19 địa chỉ · bit 20–27 mã lệnh, bit 28–39 địa chỉ</td><td>Hai lệnh nhồi trong một từ: <em>lệnh trái</em> (bit 0–19) và <em>lệnh phải</em> (bit 20–39)</td></tr>
</table>
<ul>
<li><strong>Đọc thẳng các con số từ hình.</strong> Mỗi lệnh gồm 8 bit mã lệnh + 12 bit địa chỉ = 20 bit; hai lệnh lấp đúng khít từ 40 bit. 8 bit mã lệnh cho phép tối đa 2<sup>8</sup> = 256 lệnh khác nhau, mà IAS chỉ định nghĩa thật 21 lệnh (slide 19). 12 bit địa chỉ cho phép 2<sup>12</sup> = 4.096 từ nhớ — đúng bằng con số M(4095) ở slide trước.</li>
<li><strong>Vì sao hai lệnh một từ không phải chuyện lạ mà là chuyện TIẾT KIỆM.</strong> Bộ nhớ mới là thứ đắt, mà máy dù sao cũng đã trả giá để nạp trọn 40 bit mỗi lần. Nhồi hai lệnh vào một lần nạp thì số lần đọc bộ nhớ cho đoạn mã tuần tự giảm một nửa. Đó chính là lý do IAS có thanh ghi IBR — một cái đệm giữ lệnh bên phải trong khi lệnh bên trái đang chạy (slide 17 và 18).</li>
<li><strong>Hệ quả cho lệnh nhảy, và đây mới là chỗ thú vị.</strong> Đích của một lệnh nhảy không chỉ là một địa chỉ, nó là một địa chỉ <em>rưỡi</em>: phải nói rõ <em>nửa trái</em> hay <em>nửa phải</em>. Chính vì thế Table 1.1 ở slide 19 có tới HAI lệnh nhảy vô điều kiện — JUMP M(X,0:19) và JUMP M(X,20:39) — chứ không phải một.</li>
<li><strong>Dấu-và-trị, không phải bù hai.</strong> Bit 0 là một bit dấu riêng còn 39 bit còn lại là phần trị. Máy hiện đại dùng bù hai (Chương 11), chủ yếu vì dấu-và-trị sinh ra hai số không (+0 và −0) và cần mạch riêng cho phép cộng với phép trừ.</li>
<li><strong>Ý sâu nhất của slide.</strong> Không có nhãn, không có trường kiểu, không có gì trong 40 bit nói rằng "tôi là một con số" hay "tôi là hai cái lệnh". Cùng một từ ấy là LỆNH vì PC trỏ vào nó, và là DỮ LIỆU vì một địa chỉ toán hạng trỏ vào nó. Đó vừa là sức mạnh vừa là mối nguy của thiết kế von Neumann, và đó là lý do Table 1.1 chứa được cả những lệnh <em>sửa địa chỉ nằm bên trong lệnh khác</em>.</li>
</ul>
<p class="dap-an">✅ Ví dụ tính tay — trong một từ lệnh 40 bit, bao nhiêu bit là mã lệnh, bao nhiêu bit là địa chỉ? Mã lệnh: 8 + 8 = 16 bit. Địa chỉ: 12 + 12 = 24 bit. Kiểm lại: 16 + 24 = 40. ✔ Và địa chỉ chiếm bao nhiêu phần của từ? 24/40 = 60%. So với x86-64 hiện đại, một lệnh dài từ 1 tới 15 byte — độ dài thay đổi, một thoả hiệp khác giữa mật độ mã và chi phí giải mã (Chương 13–14).</p>`],

      [17, 'Registers (of the IAS computer)',
        `<p class="y-chinh">🎯 The seven registers of the IAS, each with the one-line job the slide gives it. Learn this table and slide 18's flowchart becomes readable; skip it and the flowchart is noise.</p>
<table>
<tr><th>Register</th><th>The slide's description</th><th>Why it has to exist</th></tr>
<tr><td><strong>MBR</strong> — memory buffer register</td><td>Contains a word to be stored in memory or sent to the I/O unit; or is used to receive a word from memory or from the I/O unit</td><td>The only door between memory and the CPU: nothing crosses without passing through it</td></tr>
<tr><td><strong>MAR</strong> — memory address register</td><td>Specifies the address in memory of the word to be written from or read into the MBR</td><td>Memory needs to be told <em>where</em>; MAR holds that 12-bit address</td></tr>
<tr><td><strong>IR</strong> — instruction register</td><td>Contains the 8-bit opcode instruction being executed</td><td>The control circuits decode what is in IR to emit control signals</td></tr>
<tr><td><strong>IBR</strong> — instruction buffer register</td><td>Employed to temporarily hold the right-hand instruction from a word in memory</td><td>Because one fetch brings two instructions (slide 16) — the right one waits here</td></tr>
<tr><td><strong>PC</strong> — program counter</td><td>Contains the address of the next instruction <em>pair</em> to be fetched from memory</td><td>The machine's sense of "where am I in the program"</td></tr>
<tr><td><strong>AC</strong> — accumulator<br/><strong>MQ</strong> — multiplier quotient</td><td>Employed to temporarily hold operands and results of ALU operations</td><td>The ALU needs somewhere to take operands from and put results into</td></tr>
</table>
<ul>
<li><strong>Read the PC entry very carefully.</strong> It holds the address of the next instruction <em>pair</em>, not the next instruction — one address names one 40-bit word, which is two instructions. That is why PC is incremented only once per <em>two</em> instructions in the flowchart on slide 18.</li>
<li><strong>AC and MQ work as a pair for wide results.</strong> A 40-bit × 40-bit multiply produces up to 80 bits. Table 1.1 resolves this: MUL puts the most significant bits in AC and the least significant in MQ. DIV does the mirror image — quotient into MQ, remainder into AC. Neither operation would be expressible with a single accumulator.</li>
<li><strong>Three categories, one machine.</strong> MAR/MBR are the <em>memory interface</em>; IR/IBR/PC are the <em>control</em> registers; AC/MQ are the <em>data</em> registers. Chapter 16 will give the general version of this classification for any processor: user-visible registers versus control and status registers.</li>
<li><strong>What belongs to architecture here.</strong> A programmer writes <code>LOAD MQ</code> and <code>STOR M(X)</code>, so AC, MQ and memory addresses are architecture. MAR, MBR and IBR are never named by a program — they are pure organization, invented by the designers to make the fetch mechanism work.</li>
</ul>
<p class="meo">💡 Remember them by their questions: MAR asks "where?", MBR carries "what?", IR says "which operation?", PC says "where next?", IBR says "and the one after that, already in hand", AC and MQ say "the numbers I am working on right now."</p>`,
        `<p class="y-chinh">🎯 Bảy thanh ghi của máy IAS, mỗi cái kèm đúng một dòng nhiệm vụ mà slide gán cho. Thuộc bảng này thì lưu đồ ở slide 18 đọc được; bỏ qua nó thì lưu đồ chỉ là một mớ rối.</p>
<table>
<tr><th>Thanh ghi</th><th>Mô tả của slide</th><th>Vì sao nó buộc phải có</th></tr>
<tr><td><strong>MBR</strong> — thanh ghi đệm bộ nhớ</td><td>Chứa từ sắp được ghi vào bộ nhớ hoặc gửi ra khối I/O; hoặc dùng để nhận một từ từ bộ nhớ hay từ khối I/O</td><td>Là cánh cửa DUY NHẤT giữa bộ nhớ và CPU: không gì đi qua mà không lọt vào nó</td></tr>
<tr><td><strong>MAR</strong> — thanh ghi địa chỉ bộ nhớ</td><td>Chỉ ra địa chỉ trong bộ nhớ của từ sẽ được ghi ra từ MBR hoặc đọc vào MBR</td><td>Bộ nhớ cần được cho biết <em>ở đâu</em>; MAR giữ địa chỉ 12 bit đó</td></tr>
<tr><td><strong>IR</strong> — thanh ghi lệnh</td><td>Chứa mã lệnh 8 bit của lệnh đang được thi hành</td><td>Mạch điều khiển giải mã thứ nằm trong IR để phát ra tín hiệu điều khiển</td></tr>
<tr><td><strong>IBR</strong> — thanh ghi đệm lệnh</td><td>Dùng để tạm giữ lệnh BÊN PHẢI của một từ nhớ</td><td>Vì một lần nạp mang về hai lệnh (slide 16) — lệnh bên phải ngồi chờ ở đây</td></tr>
<tr><td><strong>PC</strong> — bộ đếm chương trình</td><td>Chứa địa chỉ của <em>CẶP</em> lệnh kế tiếp sẽ được nạp từ bộ nhớ</td><td>Là cảm giác "mình đang ở đâu trong chương trình" của cỗ máy</td></tr>
<tr><td><strong>AC</strong> — thanh ghi tích luỹ<br/><strong>MQ</strong> — thanh ghi nhân-thương</td><td>Dùng để tạm giữ toán hạng và kết quả của các phép toán ALU</td><td>ALU cần chỗ để lấy toán hạng ra và cất kết quả vào</td></tr>
</table>
<ul>
<li><strong>Đọc thật kỹ dòng PC.</strong> Nó giữ địa chỉ của <em>CẶP</em> lệnh kế tiếp, không phải của lệnh kế tiếp — một địa chỉ gọi tên một từ 40 bit, mà một từ là hai lệnh. Đó là lý do trong lưu đồ ở slide 18, PC chỉ tăng một lần cho <em>hai</em> lệnh.</li>
<li><strong>AC và MQ làm việc thành cặp khi kết quả quá rộng.</strong> Nhân hai số 40 bit thì kết quả có thể tới 80 bit. Table 1.1 giải quyết: MUL đặt phần bit có trọng số cao vào AC và phần thấp vào MQ. DIV làm ngược lại — thương vào MQ, số dư vào AC. Cả hai phép đều không diễn đạt nổi nếu chỉ có một thanh ghi tích luỹ.</li>
<li><strong>Ba nhóm, một cỗ máy.</strong> MAR/MBR là <em>giao diện bộ nhớ</em>; IR/IBR/PC là nhóm <em>điều khiển</em>; AC/MQ là nhóm <em>dữ liệu</em>. Chương 16 sẽ đưa ra bản tổng quát của cách phân loại này cho mọi bộ xử lý: thanh ghi người dùng thấy được, và thanh ghi điều khiển/trạng thái.</li>
<li><strong>Ở đây cái gì thuộc kiến trúc.</strong> Lập trình viên viết <code>LOAD MQ</code> và <code>STOR M(X)</code>, nên AC, MQ và các địa chỉ bộ nhớ là kiến trúc. MAR, MBR và IBR thì không chương trình nào gọi tên — chúng là tổ chức thuần tuý, do người thiết kế nghĩ ra để cơ chế nạp lệnh chạy được.</li>
</ul>
<p class="meo">💡 Nhớ chúng bằng CÂU HỎI của từng cái: MAR hỏi "ở đâu?", MBR mang "cái gì?", IR nói "phép gì?", PC nói "tiếp theo ở đâu?", IBR nói "và cái sau nữa, đã cầm sẵn trong tay", AC với MQ nói "mấy con số tôi đang làm việc ngay lúc này".</p>`],

      [18, 'Figure 1.7 — Partial Flowchart of IAS Operation',
        `<p class="y-chinh">🎯 The <strong>fetch–execute cycle</strong> of a real machine, drawn as a flowchart. The vertical arrows on the left split it into two halves: the <strong>fetch cycle</strong> above the dashed line, the <strong>execution cycle</strong> below it. This is the single most important diagram of the chapter.</p>
<p class="nhan">Notation printed on the slide: <code>M(X)</code> = contents of memory location whose address is X; <code>(i:j)</code> = bits i through j.</p>
<ul>
<li><strong>Fetch, path by path.</strong> The cycle starts by asking <em>"Is next instruction in IBR?"</em>
<br/>· <strong>Yes</strong> — no memory access required: <code>IR ← IBR(0:7)</code>, <code>MAR ← IBR(8:19)</code>. The right-hand instruction was already in hand, so the machine skips a memory read entirely. This is the payoff for slide 16's two-instructions-per-word format.
<br/>· <strong>No</strong> — <code>MAR ← PC</code>, then <code>MBR ← M(MAR)</code>: one word (two instructions) is read. Then <em>"Left instruction required?"</em> decides which half is used: if yes, <code>IBR ← MBR(20:39)</code> (save the right half for later), <code>IR ← MBR(0:7)</code>, <code>MAR ← MBR(8:19)</code>; if no, <code>IR ← MBR(20:27)</code>, <code>MAR ← MBR(28:39)</code>.
<br/>· All paths then meet at <code>PC ← PC + 1</code> and "Decode instruction in IR".</li>
<li><strong>Execute — the figure shows four representative instructions, one per column.</strong>
<br/>· <code>AC ← M(X)</code> (a LOAD): <code>MBR ← M(MAR)</code> then <code>AC ← MBR</code>.
<br/>· <code>Go to M(X,0:19)</code> (unconditional jump): <code>PC ← MAR</code>.
<br/>· <code>If AC &gt; 0 then go to M(X,0:19)</code> (conditional jump): the diamond <em>"Is AC &gt; 0?"</em> — Yes goes to <code>PC ← MAR</code>, No falls through and the next instruction runs normally.
<br/>· <code>AC ← AC + M(X)</code> (an ADD): <code>MBR ← M(MAR)</code> then <code>AC ← AC + MBR</code>.</li>
<li><strong>The word "Partial" in the caption is doing real work.</strong> Only four of the 21 instructions are drawn. The other 17 follow the same shape: fetch is identical for all of them, and only the execute column differs. That is the general truth the diagram teaches — <em>fetch is universal, execute is instruction-specific</em>.</li>
<li><strong>Why <code>PC ← PC + 1</code> appears before decoding.</strong> By the time an instruction executes, PC already points past it. That is exactly why a jump can simply overwrite PC and why, in every machine since, a "relative jump" is measured from the <em>already-incremented</em> PC. A detail that causes real bugs in assembly (Chapter 15).</li>
<li><strong>Everything on this chart is a register transfer.</strong> Each box is of the form <em>destination ← source</em>. That notation is not decoration: Chapter 19 formalises it as Register Transfer Language, and the control unit's whole job is to emit, in the right order, the signals that make each of these transfers happen.</li>
</ul>
<p class="dap-an">✅ Worked trace — how many memory reads does it take to execute two consecutive ADD instructions stored in the same word? Fetch: 1 read (<code>MBR ← M(MAR)</code>) brings both. Execute left ADD: 1 read for its operand. Execute right ADD: fetch needs 0 reads (it is in IBR), operand needs 1 read. Total = <strong>3 memory reads for 2 instructions</strong>. Without IBR it would be 4. A 25% saving on memory traffic, from one extra register — the first performance optimisation in this book, and it is on a machine from 1952.</p>`,
        `<p class="y-chinh">🎯 <strong>Chu trình nạp–thi hành</strong> của một cỗ máy thật, vẽ thành lưu đồ. Hai mũi tên dọc bên trái chia nó làm hai nửa: <strong>fetch cycle</strong> (chu kỳ nạp) phía trên đường đứt nét, <strong>execution cycle</strong> (chu kỳ thi hành) phía dưới. Đây là sơ đồ quan trọng nhất của cả chương.</p>
<p class="nhan">Ký hiệu in ngay trên slide: <code>M(X)</code> = nội dung ô nhớ có địa chỉ X; <code>(i:j)</code> = các bit từ i tới j.</p>
<ul>
<li><strong>Nạp lệnh, theo từng nhánh.</strong> Chu trình mở đầu bằng câu hỏi <em>"Lệnh kế tiếp có sẵn trong IBR không?"</em>
<br/>· <strong>Có</strong> — không cần truy cập bộ nhớ: <code>IR ← IBR(0:7)</code>, <code>MAR ← IBR(8:19)</code>. Lệnh bên phải đã cầm sẵn trong tay, nên máy bỏ hẳn một lần đọc bộ nhớ. Đây là phần thưởng cho khuôn dạng hai-lệnh-một-từ ở slide 16.
<br/>· <strong>Không</strong> — <code>MAR ← PC</code>, rồi <code>MBR ← M(MAR)</code>: đọc về một từ (hai lệnh). Rồi câu hỏi <em>"Có cần lệnh bên trái không?"</em> quyết định dùng nửa nào: nếu có thì <code>IBR ← MBR(20:39)</code> (cất nửa phải để dùng sau), <code>IR ← MBR(0:7)</code>, <code>MAR ← MBR(8:19)</code>; nếu không thì <code>IR ← MBR(20:27)</code>, <code>MAR ← MBR(28:39)</code>.
<br/>· Mọi nhánh sau đó gặp nhau ở <code>PC ← PC + 1</code> rồi "giải mã lệnh trong IR".</li>
<li><strong>Thi hành — hình vẽ bốn lệnh tiêu biểu, mỗi cột một lệnh.</strong>
<br/>· <code>AC ← M(X)</code> (một lệnh LOAD): <code>MBR ← M(MAR)</code> rồi <code>AC ← MBR</code>.
<br/>· <code>Go to M(X,0:19)</code> (nhảy vô điều kiện): <code>PC ← MAR</code>.
<br/>· <code>If AC &gt; 0 then go to M(X,0:19)</code> (nhảy có điều kiện): hình thoi <em>"Is AC &gt; 0?"</em> — nhánh Yes đi tới <code>PC ← MAR</code>, nhánh No rơi thẳng xuống và lệnh kế tiếp chạy bình thường.
<br/>· <code>AC ← AC + M(X)</code> (một lệnh ADD): <code>MBR ← M(MAR)</code> rồi <code>AC ← AC + MBR</code>.</li>
<li><strong>Chữ "Partial" trong chú thích hình có nghĩa thật.</strong> Chỉ bốn trong số 21 lệnh được vẽ. Mười bảy lệnh còn lại theo đúng khuôn ấy: phần nạp giống hệt nhau cho tất cả, chỉ cột thi hành là khác. Đó là chân lý tổng quát mà sơ đồ dạy — <em>nạp lệnh thì chung cho mọi lệnh, thi hành thì riêng cho từng lệnh</em>.</li>
<li><strong>Vì sao <code>PC ← PC + 1</code> xuất hiện TRƯỚC khi giải mã.</strong> Tới lúc một lệnh thi hành thì PC đã trỏ qua khỏi nó rồi. Chính vì thế lệnh nhảy chỉ việc ghi đè lên PC, và cũng vì thế mà trong mọi máy về sau, "nhảy tương đối" được tính từ giá trị PC <em>đã tăng</em>. Chi tiết này gây lỗi thật khi lập trình hợp ngữ (Chương 15).</li>
<li><strong>Mọi thứ trên lưu đồ đều là một phép chuyển thanh ghi.</strong> Mỗi cái hộp đều có dạng <em>đích ← nguồn</em>. Ký pháp đó không phải trang trí: Chương 19 hình thức hoá nó thành Ngôn ngữ Chuyển Thanh ghi (RTL), và toàn bộ việc của khối điều khiển là phát ra, đúng thứ tự, những tín hiệu làm cho từng phép chuyển ấy xảy ra.</li>
</ul>
<p class="dap-an">✅ Lần theo vết — thi hành HAI lệnh ADD liên tiếp nằm trong cùng một từ nhớ thì tốn mấy lần đọc bộ nhớ? Nạp lệnh: 1 lần đọc (<code>MBR ← M(MAR)</code>) mang về cả hai. Thi hành ADD trái: 1 lần đọc lấy toán hạng. Thi hành ADD phải: phần nạp tốn 0 lần đọc (lệnh đã nằm trong IBR), toán hạng tốn 1 lần. Tổng = <strong>3 lần đọc bộ nhớ cho 2 lệnh</strong>. Không có IBR thì phải 4 lần. Tiết kiệm 25% lưu lượng bộ nhớ, chỉ nhờ thêm một thanh ghi — đó là tối ưu hiệu năng đầu tiên trong cuốn sách này, và nó nằm trên một cỗ máy năm 1952.</p>`],

      [19, 'Table 1.1 — The IAS Instruction Set',
        `<p class="y-chinh">🎯 The whole instruction set of the IAS: <strong>21 instructions in five groups</strong>. This is what "architecture" means, printed in full — everything a programmer of that machine was allowed to ask for.</p>
<table>
<tr><th>Type</th><th>Opcode</th><th>Symbolic</th><th>Description</th></tr>
<tr><td rowspan="7">Data transfer</td><td>00001010</td><td>LOAD MQ</td><td>Transfer contents of register MQ to the accumulator AC</td></tr>
<tr><td>00001001</td><td>LOAD MQ,M(X)</td><td>Transfer contents of memory location X to MQ</td></tr>
<tr><td>00100001</td><td>STOR M(X)</td><td>Transfer contents of accumulator to memory location X</td></tr>
<tr><td>00000001</td><td>LOAD M(X)</td><td>Transfer M(X) to the accumulator</td></tr>
<tr><td>00000010</td><td>LOAD −M(X)</td><td>Transfer −M(X) to the accumulator</td></tr>
<tr><td>00000011</td><td>LOAD |M(X)|</td><td>Transfer absolute value of M(X) to the accumulator</td></tr>
<tr><td>00000100</td><td>LOAD −|M(X)|</td><td>Transfer −|M(X)| to the accumulator</td></tr>
<tr><td rowspan="2">Unconditional branch</td><td>00001101</td><td>JUMP M(X,0:19)</td><td>Take next instruction from left half of M(X)</td></tr>
<tr><td>00001110</td><td>JUMP M(X,20:39)</td><td>Take next instruction from right half of M(X)</td></tr>
<tr><td rowspan="2">Conditional branch</td><td>00001111</td><td>JUMP + M(X,0:19)</td><td>Take next instruction from right half of M(X) <em>(printed exactly like this — see the answer box below)</em></td></tr>
<tr><td>00010000</td><td>JUMP + M(X,20:39)</td><td>If number in the accumulator is nonnegative, take next instruction from right half of M(X)</td></tr>
<tr><td rowspan="8">Arithmetic</td><td>00000101</td><td>ADD M(X)</td><td>Add M(X) to AC; put the result in AC</td></tr>
<tr><td>00000111</td><td>ADD |M(X)|</td><td>Add |M(X)| to AC; put the result in AC</td></tr>
<tr><td>00000110</td><td>SUB M(X)</td><td>Subtract M(X) from AC; put the result in AC</td></tr>
<tr><td>00001000</td><td>SUB |M(X)|</td><td>Subtract |M(X)| from AC; put the remainder in AC</td></tr>
<tr><td>00001011</td><td>MUL M(X)</td><td>Multiply M(X) by MQ; put most significant bits of result in AC, put least significant bits in MQ</td></tr>
<tr><td>00001100</td><td>DIV M(X)</td><td>Divide AC by M(X); put the quotient in MQ and the remainder in AC</td></tr>
<tr><td>00010100</td><td>LSH</td><td>Multiply accumulator by 2; that is, shift left one bit position</td></tr>
<tr><td>00010101</td><td>RSH</td><td>Divide accumulator by 2; that is, shift right one position</td></tr>
<tr><td rowspan="2">Address modify</td><td>00010010</td><td>STOR M(X,8:19)</td><td>Replace left address field at M(X) by 12 rightmost bits of AC</td></tr>
<tr><td>00010011</td><td>STOR M(X,28:39)</td><td>Replace right address field at M(X) by 12 rightmost bits of AC</td></tr>
</table>
<ul>
<li><strong>Every instruction is one opcode plus at most one address.</strong> There is no second operand: the accumulator is always the implied source and destination. That is an <em>accumulator architecture</em>, and it is why the set stays so small.</li>
<li><strong>LSH and RSH are the cheapest lesson in the table.</strong> Shift left one bit = multiply by 2; shift right one bit = divide by 2. The same identity your C compiler still uses when it turns <code>x * 2</code> into a shift. A shifter is trivial hardware; a multiplier is not.</li>
<li><strong>The "Address modify" group is the stored-program concept biting.</strong> <code>STOR M(X,8:19)</code> writes into the <em>address field of another instruction</em>. With no index registers, this was the only way to walk through an array: recompute the address in AC, then patch it into the instruction that will use it. Self-modifying code was not a hack here; it was the required technique. Chapter 14 shows the modern replacement — indexed addressing modes.</li>
<li><strong>Note the two multiplication-related registers again.</strong> MUL and DIV are the only instructions that use AC and MQ together, exactly as slide 17 promised.</li>
</ul>
<p class="dap-an">✅ The table on this slide contains a real error, and it is worth naming rather than copying. The row <code>00001111 · JUMP + M(X,0:19)</code> is described as "Take next instruction from <em>right</em> half of M(X)" — which is wrong twice over. (a) The condition is missing: the "+" in the mnemonic and the group heading "Conditional Branch" both say the jump only happens <em>if the number in the accumulator is nonnegative</em>. (b) <code>0:19</code> is the <strong>left</strong> half of the word, not the right — compare the unconditional pair right above, where <code>0:19</code> is correctly called the left half. The correct description is: <em>"If the number in the accumulator is nonnegative, take the next instruction from the left half of M(X)."</em> The error is in the textbook's own table, so expect to see it again; do not reproduce it in an exam answer.</p>
<p class="pitfall">⚠️ Twenty-one instructions and none of them is a subroutine call, a stack operation, an interrupt or an I/O instruction. The IAS is complete enough to compute anything, and painful enough to make you appreciate every chapter after this one.</p>`,
        `<p class="y-chinh">🎯 Toàn bộ tập lệnh của máy IAS: <strong>21 lệnh chia năm nhóm</strong>. Đây là "kiến trúc" được in ra đầy đủ — tất cả những gì một lập trình viên của cỗ máy ấy được phép yêu cầu.</p>
<table>
<tr><th>Nhóm</th><th>Mã lệnh</th><th>Ký hiệu</th><th>Mô tả</th></tr>
<tr><td rowspan="7">Chuyển dữ liệu</td><td>00001010</td><td>LOAD MQ</td><td>Chuyển nội dung thanh ghi MQ vào thanh ghi tích luỹ AC</td></tr>
<tr><td>00001001</td><td>LOAD MQ,M(X)</td><td>Chuyển nội dung ô nhớ X vào MQ</td></tr>
<tr><td>00100001</td><td>STOR M(X)</td><td>Chuyển nội dung AC vào ô nhớ X</td></tr>
<tr><td>00000001</td><td>LOAD M(X)</td><td>Chuyển M(X) vào AC</td></tr>
<tr><td>00000010</td><td>LOAD −M(X)</td><td>Chuyển −M(X) vào AC</td></tr>
<tr><td>00000011</td><td>LOAD |M(X)|</td><td>Chuyển trị tuyệt đối của M(X) vào AC</td></tr>
<tr><td>00000100</td><td>LOAD −|M(X)|</td><td>Chuyển −|M(X)| vào AC</td></tr>
<tr><td rowspan="2">Nhảy vô điều kiện</td><td>00001101</td><td>JUMP M(X,0:19)</td><td>Lấy lệnh kế tiếp từ NỬA TRÁI của M(X)</td></tr>
<tr><td>00001110</td><td>JUMP M(X,20:39)</td><td>Lấy lệnh kế tiếp từ NỬA PHẢI của M(X)</td></tr>
<tr><td rowspan="2">Nhảy có điều kiện</td><td>00001111</td><td>JUMP + M(X,0:19)</td><td>"Lấy lệnh kế tiếp từ nửa phải của M(X)" <em>(in nguyên như vậy trên slide — xem ô Đáp án bên dưới)</em></td></tr>
<tr><td>00010000</td><td>JUMP + M(X,20:39)</td><td>Nếu số trong AC không âm thì lấy lệnh kế tiếp từ nửa phải của M(X)</td></tr>
<tr><td rowspan="8">Số học</td><td>00000101</td><td>ADD M(X)</td><td>Cộng M(X) vào AC; kết quả để trong AC</td></tr>
<tr><td>00000111</td><td>ADD |M(X)|</td><td>Cộng |M(X)| vào AC; kết quả để trong AC</td></tr>
<tr><td>00000110</td><td>SUB M(X)</td><td>Trừ M(X) khỏi AC; kết quả để trong AC</td></tr>
<tr><td>00001000</td><td>SUB |M(X)|</td><td>Trừ |M(X)| khỏi AC; phần còn lại để trong AC</td></tr>
<tr><td>00001011</td><td>MUL M(X)</td><td>Nhân M(X) với MQ; các bit trọng số CAO để trong AC, các bit trọng số THẤP để trong MQ</td></tr>
<tr><td>00001100</td><td>DIV M(X)</td><td>Chia AC cho M(X); thương để trong MQ, số dư để trong AC</td></tr>
<tr><td>00010100</td><td>LSH</td><td>Nhân AC với 2; tức dịch trái một vị trí bit</td></tr>
<tr><td>00010101</td><td>RSH</td><td>Chia AC cho 2; tức dịch phải một vị trí</td></tr>
<tr><td rowspan="2">Sửa địa chỉ</td><td>00010010</td><td>STOR M(X,8:19)</td><td>Thay trường địa chỉ TRÁI của M(X) bằng 12 bit phải nhất của AC</td></tr>
<tr><td>00010011</td><td>STOR M(X,28:39)</td><td>Thay trường địa chỉ PHẢI của M(X) bằng 12 bit phải nhất của AC</td></tr>
</table>
<ul>
<li><strong>Lệnh nào cũng là một mã lệnh cộng nhiều nhất MỘT địa chỉ.</strong> Không có toán hạng thứ hai: thanh ghi tích luỹ luôn là nguồn và đích ngầm định. Đó là <em>kiến trúc tích luỹ</em> (accumulator architecture), và đó là lý do tập lệnh nhỏ được đến thế.</li>
<li><strong>LSH và RSH là bài học rẻ nhất trong bảng.</strong> Dịch trái một bit = nhân 2; dịch phải một bit = chia 2. Đúng cái đẳng thức mà trình biên dịch C của bạn ngày nay vẫn dùng khi biến <code>x * 2</code> thành một lệnh dịch. Mạch dịch bit thì rẻ như cho; mạch nhân thì không.</li>
<li><strong>Nhóm "sửa địa chỉ" là chỗ ý tưởng chương trình-lưu-trong-bộ-nhớ cắn thật.</strong> <code>STOR M(X,8:19)</code> ghi vào <em>trường địa chỉ của một lệnh khác</em>. Không có thanh ghi chỉ số, đây là cách DUY NHẤT để duyệt một mảng: tính lại địa chỉ trong AC rồi vá nó vào chính cái lệnh sắp dùng. Mã tự sửa mình ở đây không phải trò lách; nó là kỹ thuật bắt buộc. Chương 14 đưa ra bản thay thế hiện đại — các chế độ địa chỉ có chỉ số.</li>
<li><strong>Lại thấy cặp thanh ghi nhân-chia.</strong> MUL và DIV là hai lệnh duy nhất dùng AC và MQ cùng lúc, đúng như slide 17 đã hẹn.</li>
</ul>
<p class="dap-an">✅ Bảng trên slide này có một LỖI THẬT, và cần gọi tên nó ra thay vì chép lại. Dòng <code>00001111 · JUMP + M(X,0:19)</code> được mô tả là "Lấy lệnh kế tiếp từ nửa <em>PHẢI</em> của M(X)" — sai hai chỗ cùng lúc. (a) Mất hẳn điều kiện: dấu "+" trong ký hiệu và chính tiêu đề nhóm "Conditional Branch" đều nói phép nhảy chỉ xảy ra <em>nếu số trong AC không âm</em>. (b) <code>0:19</code> là <strong>NỬA TRÁI</strong> của từ nhớ, không phải nửa phải — cứ so với cặp lệnh vô điều kiện ngay bên trên, ở đó <code>0:19</code> được gọi đúng là nửa trái. Mô tả đúng phải là: <em>"Nếu số trong thanh ghi tích luỹ không âm thì lấy lệnh kế tiếp từ NỬA TRÁI của M(X)."</em> Lỗi này nằm trong chính bảng của giáo trình nên bạn sẽ còn gặp lại; đừng chép nó vào bài thi.</p>
<p class="pitfall">⚠️ Hai mươi mốt lệnh, và không có lệnh nào là gọi chương trình con, thao tác ngăn xếp, ngắt hay vào/ra. Máy IAS đủ đầy để tính được mọi thứ, và đủ cực khổ để bạn biết quý từng chương đứng sau chương này.</p>`],

      [20, 'Figure 1.8 — Fundamental Computer Elements',
        `<p class="y-chinh">🎯 The bottom of the hierarchy. Two boxes, and every computer ever built is made of them: a <strong>gate</strong> and a <strong>memory cell</strong>.</p>
<table>
<tr><th>Element</th><th>What the figure draws</th><th>Function it provides (slide 5)</th></tr>
<tr><td>(a) <strong>Gate</strong></td><td>Several <em>Inputs</em> → a box labelled "Boolean logic function" → one <em>Output</em>; plus an <em>Activate signal</em> arriving from below</td><td>Data processing</td></tr>
<tr><td>(b) <strong>Memory cell</strong></td><td>One <em>Input</em> → a box labelled "Binary storage cell" → one <em>Output</em>; plus <em>Read</em> and <em>Write</em> lines arriving from below</td><td>Data storage</td></tr>
</table>
<ul>
<li><strong>Read the vertical arrows separately from the horizontal ones.</strong> Horizontal = data flowing through. Vertical = <em>control</em> arriving: "activate now" for the gate, "read" or "write" for the cell. Those vertical lines are the control signals the control unit emits — the same control signals slide 2 listed as an organizational attribute.</li>
<li><strong>The gate's output is a function of its inputs only.</strong> A gate has no memory: give it the same inputs and it gives the same output, always. That is why gates alone cannot build a computer — you also need something that remembers, which is the second box.</li>
<li><strong>The memory cell stores exactly one bit.</strong> One bit, two operations (read, write). Everything else — a 40-bit IAS word, a 64-bit register, a 16 GB DIMM — is this cell replicated and addressed. A 16 GB memory is about 1.4 × 10<sup>11</sup> of these.</li>
<li><strong>Two elements, four functions.</strong> Slide 21 completes the argument: gates give <em>processing</em>, memory cells give <em>storage</em>, the paths among components give <em>movement</em>, and those same paths carry <em>control</em>. The four functions of slide 5 reappear at the very bottom of the hierarchy — which is Stallings' way of proving that the function list really is complete.</li>
<li><strong>Where this is taught properly.</strong> Chapter 12 (Digital Logic) builds AND, OR, NOT, NAND from truth tables, then combinational circuits (adders, decoders, multiplexers), then sequential circuits (flip-flops — which is what a memory cell actually is). CSI106 showed you a picture of an ALU; CEA201 will make you build one.</li>
</ul>
<p class="meo">💡 If someone asks "what is a computer made of?", the answer that scores full marks in this course is two words plus a connector: <strong>gates, memory cells, and the interconnections among them</strong> — the phrase slide 21 uses verbatim.</p>`,
        `<p class="y-chinh">🎯 Đáy của phân cấp. Hai cái hộp, và mọi máy tính từng được dựng đều làm từ chúng: một <strong>cổng logic (gate)</strong> và một <strong>ô nhớ (memory cell)</strong>.</p>
<table>
<tr><th>Phần tử</th><th>Hình vẽ gì</th><th>Cấp chức năng nào (slide 5)</th></tr>
<tr><td>(a) <strong>Cổng logic</strong></td><td>Nhiều <em>Input</em> → một hộp ghi "Boolean logic function" → một <em>Output</em>; kèm một tín hiệu <em>Activate</em> đi vào từ bên dưới</td><td>Xử lý dữ liệu</td></tr>
<tr><td>(b) <strong>Ô nhớ</strong></td><td>Một <em>Input</em> → một hộp ghi "Binary storage cell" → một <em>Output</em>; kèm hai đường <em>Read</em> và <em>Write</em> đi vào từ bên dưới</td><td>Lưu trữ dữ liệu</td></tr>
</table>
<ul>
<li><strong>Hãy đọc các mũi tên DỌC tách khỏi các mũi tên NGANG.</strong> Ngang = dữ liệu chảy qua. Dọc = <em>điều khiển</em> đi tới: "kích hoạt ngay" với cổng logic, "đọc" hoặc "ghi" với ô nhớ. Những đường dọc ấy chính là tín hiệu điều khiển mà khối điều khiển phát ra — đúng thứ tín hiệu điều khiển mà slide 2 liệt kê như một thuộc tính tổ chức.</li>
<li><strong>Đầu ra của cổng logic chỉ là hàm của các đầu vào.</strong> Cổng logic không có trí nhớ: đưa cùng đầu vào thì luôn cho cùng đầu ra. Chính vì thế chỉ có cổng logic thì không dựng nổi máy tính — còn cần một thứ biết NHỚ, và đó là cái hộp thứ hai.</li>
<li><strong>Ô nhớ lưu đúng MỘT bit.</strong> Một bit, hai thao tác (đọc, ghi). Mọi thứ còn lại — một từ IAS 40 bit, một thanh ghi 64 bit, một thanh RAM 16 GB — đều là cái ô ấy nhân bản ra rồi đánh địa chỉ. Bộ nhớ 16 GB là khoảng 1,4 × 10<sup>11</sup> ô như vậy.</li>
<li><strong>Hai phần tử, bốn chức năng.</strong> Slide 21 khép lại lập luận: cổng logic cho <em>xử lý</em>, ô nhớ cho <em>lưu trữ</em>, các đường nối giữa các thành phần cho <em>di chuyển</em>, và chính những đường đó mang <em>điều khiển</em>. Bốn chức năng của slide 5 hiện lại ở tận đáy phân cấp — đó là cách Stallings chứng minh rằng danh sách chức năng ấy thật sự đầy đủ.</li>
<li><strong>Chỗ dạy tử tế về nó.</strong> Chương 12 (Logic số) dựng AND, OR, NOT, NAND từ bảng chân trị, rồi tới mạch tổ hợp (mạch cộng, mạch giải mã, mạch dồn kênh), rồi mạch tuần tự (flip-flop — chính là cái mà một ô nhớ thật sự là). CSI106 cho bạn xem một bức hình về ALU; CEA201 sẽ bắt bạn dựng ra một cái.</li>
</ul>
<p class="meo">💡 Ai hỏi "máy tính làm bằng gì?" thì câu trả lời ăn trọn điểm trong môn này là hai danh từ cộng một liên từ: <strong>cổng logic, ô nhớ, và các đường nối giữa chúng</strong> — đúng cụm từ slide 21 dùng nguyên văn.</p>`],

      [21, 'Integrated Circuits',
        `<p class="y-chinh">🎯 The slide answers two questions at once: <em>what does a computer consist of</em> (gates, memory cells, interconnections), and <em>how do you make millions of them at once</em> (fabricate them together on one wafer of silicon).</p>
<ul>
<li><strong>The four functions, restated at silicon level</strong> — data storage is provided by <em>memory cells</em>; data processing by <em>gates</em>; data movement by <em>the paths among components</em>, moving data memory-to-memory and memory-through-gates-to-memory; and control, because <em>those same paths can carry control signals</em>. One list, now for the third time in the chapter (slides 5, 7 and here) — that repetition is deliberate.</li>
<li><strong>The definition to quote</strong> — "A computer consists of gates, memory cells, and interconnections among these elements. The gates and memory cells are constructed of simple digital electronic components."</li>
<li><strong>Why integration was the breakthrough, in the slide's own logic</strong> — it exploits the fact that components such as <em>transistors, resistors and conductors</em> can all be fabricated from a semiconductor such as silicon; <em>many transistors can be produced at the same time on a single wafer</em>; and they can be connected with a <em>processor metallization</em> to form circuits. Three sentences that replace soldering by printing.</li>
<li><strong>The consequence nobody states on the slide but everyone lives with.</strong> Once circuits are printed rather than assembled, the cost of a chip stops depending much on how many transistors are on it — it depends on wafer area and yield. Transistors became nearly free, and every design decision from that point on is about what to <em>spend</em> them on: bigger caches, more cores, deeper pipelines.</li>
<li><strong>Dates worth having on your sheet.</strong> The transistor was invented at Bell Labs in <strong>1947</strong>; the first working integrated circuit was demonstrated by Jack Kilby at Texas Instruments in <strong>1958</strong>, with Robert Noyce at Fairchild producing the planar silicon version shortly after. Slide 26 then gives <strong>Moore's law</strong>: Gordon Moore observed in <strong>1965</strong> that the number of transistors on a chip was doubling every year, revised in 1975 to roughly every two years — the "18 to 24 months" figure usually quoted. It has slowed noticeably since around 2015, which is exactly why the industry turned to multicore (slide 9) instead of raw frequency.</li>
</ul>
<p class="pitfall">⚠️ Notice the deck's ordering: this slide (integrated circuits) comes <em>before</em> slide 22 (transistors and discrete components), which is backwards in time — transistors 1947, then ICs 1958. Read slide 22 first if the history feels jumbled; the book's section is called "Gates, Memory Cells, Chips and Multichip Modules" and moves from the logical element down to the physical part, not chronologically.</p>`,
        `<p class="y-chinh">🎯 Slide trả lời hai câu hỏi cùng lúc: <em>máy tính gồm những gì</em> (cổng logic, ô nhớ, các đường nối), và <em>làm sao chế ra hàng triệu cái cùng lúc</em> (chế tạo chúng chung trên một tấm silicon).</p>
<ul>
<li><strong>Bốn chức năng, phát biểu lại ở tầng silicon</strong> — lưu trữ dữ liệu do <em>các ô nhớ</em> đảm nhận; xử lý dữ liệu do <em>các cổng logic</em>; di chuyển dữ liệu do <em>các đường nối giữa các thành phần</em>, đưa dữ liệu từ bộ nhớ sang bộ nhớ và từ bộ nhớ qua cổng logic rồi về bộ nhớ; và điều khiển, vì <em>chính những đường ấy mang được tín hiệu điều khiển</em>. Cùng một danh sách, nay là lần thứ ba trong chương (slide 5, slide 7 và ở đây) — sự lặp lại đó là có chủ ý.</li>
<li><strong>Định nghĩa đáng chép nguyên văn</strong> — "Một máy tính gồm các cổng logic, các ô nhớ, và các đường nối giữa những phần tử ấy. Cổng logic và ô nhớ được dựng từ các linh kiện điện tử số đơn giản."</li>
<li><strong>Vì sao tích hợp là bước ngoặt, theo đúng mạch lập luận của slide</strong> — nó khai thác việc các linh kiện như <em>transistor, điện trở và dây dẫn</em> đều chế được từ một chất bán dẫn như silic; <em>nhiều transistor có thể được tạo ra CÙNG LÚC trên một tấm wafer</em>; và chúng nối được với nhau bằng một <em>lớp kim loại hoá</em> để thành mạch. Ba câu ấy thay thế việc hàn tay bằng việc IN.</li>
<li><strong>Hệ quả mà slide không nói nhưng ai cũng đang sống cùng.</strong> Một khi mạch được IN thay vì được LẮP, giá một con chip thôi phụ thuộc mấy vào số transistor trên đó — nó phụ thuộc diện tích wafer và tỉ lệ đạt. Transistor gần như thành đồ miễn phí, và từ đó mọi quyết định thiết kế đều xoay quanh câu hỏi TIÊU chúng vào đâu: cache lớn hơn, nhiều lõi hơn, ống lệnh sâu hơn.</li>
<li><strong>Những mốc năm nên có trên tờ giấy ôn của bạn.</strong> Transistor được phát minh tại Bell Labs năm <strong>1947</strong>; mạch tích hợp đầu tiên chạy được do Jack Kilby trình diễn ở Texas Instruments năm <strong>1958</strong>, ngay sau đó Robert Noyce ở Fairchild làm ra bản silic phẳng (planar). Rồi slide 26 đưa ra <strong>định luật Moore</strong>: năm <strong>1965</strong> Gordon Moore nhận xét số transistor trên một chip đang gấp đôi mỗi năm, tới 1975 ông chỉnh lại thành khoảng hai năm một lần — tức con số "18 đến 24 tháng" hay được trích. Từ khoảng 2015 nó đã chậm lại thấy rõ, và đó đúng là lý do ngành công nghiệp quay sang đa lõi (slide 9) thay vì đẩy xung nhịp.</li>
</ul>
<p class="pitfall">⚠️ Để ý thứ tự của bộ slide: slide này (mạch tích hợp) đứng <em>TRƯỚC</em> slide 22 (transistor và linh kiện rời), tức ngược dòng thời gian — transistor 1947 rồi mới tới IC 1958. Nếu thấy phần lịch sử rối thì cứ đọc slide 22 trước; mục này của sách tên là "Gates, Memory Cells, Chips and Multichip Modules" và nó đi từ phần tử LOGIC xuống linh kiện VẬT LÝ, chứ không đi theo niên đại.</p>`],

      [22, 'Transistors',
        `<p class="y-chinh">🎯 One level below the gate. The <strong>transistor</strong> is "the fundamental building block of digital circuits used to construct processors, memories, and other digital logic devices" — and before integration, each one was a <strong>discrete component</strong> you soldered by hand.</p>
<ul>
<li><strong>How it works, in the slide's own words</strong> — the active part is made of silicon or another semiconductor <em>that can change its electrical state when pulsed</em>; in its normal state the material may be nonconductive or conductive; and <em>the transistor changes its state when voltage is applied to the gate</em>. A voltage-controlled switch: that is the whole of digital electronics in one sentence.</li>
<li><strong>Switch → gate → everything.</strong> Wire a few switches in series and parallel and you get AND and OR; add inversion and you get NAND, from which every Boolean function can be built. That chain — transistor → gate → adder → ALU → CPU — is the ladder this chapter has been climbing down, and Chapter 12 climbs it back up.</li>
<li><strong>"Discrete component" is the term to understand.</strong> A single self-contained transistor: "manufactured separately, packaged in their own containers, and soldered or wired together onto Masonite-like circuit boards". Every connection was a human action. That is why second-generation machines were built in the thousands and modern chips in the billions of transistors — the limit was never the idea, it was the labour.</li>
<li><strong>Numbers that make the jump visible.</strong> ENIAC (generation one) used 17,468 vacuum tubes and filled a room. The <strong>Intel 4004</strong>, the first microprocessor, arrived in <strong>1971</strong> with <strong>2,300 transistors</strong> on a single chip clocked at 108 kHz (slide 28). By 2017 the Core i9-7900X held <strong>7.2 billion</strong> transistors (slide 31). From 2,300 to 7,200,000,000 is a factor of about 3.1 million in 46 years — which is what "doubling every two years" actually feels like.</li>
<li><strong>Why the transistor deserves its own slide.</strong> It is the point where physics meets computing. Everything above it — instruction sets, caches, operating systems — is a convenience built on the fact that a small voltage can switch a current on and off, fast, reliably, and billions of times per second.</li>
</ul>
<p class="dap-an">✅ A correction to carry forward. Slide 28 labels a row "<em>Feature size (m)</em>" with values 10, 8, 6, 3 for the 1970s processors. The unit is not metres — the µ has been lost in the conversion; it should read <strong>µm (micrometres)</strong>. The 4004's feature size was 10 µm = 10,000 nm. Slide 31 gets it right for modern parts, writing "Feature size (nm)" with values 250, 180, 65, 22 and 14. Checking the two slides against each other is what reveals the typo — a habit worth keeping in every exam.</p>
<p class="pitfall">⚠️ Do not say "the transistor replaced the vacuum tube <em>in 1947</em>". 1947 is the invention; the second generation of computers — machines actually built from transistors — arrives in the late 1950s. Inventions and generations are different dates, and exam questions exploit the gap.</p>`,
        `<p class="y-chinh">🎯 Hạ thêm một tầng dưới cổng logic. <strong>Transistor</strong> là "viên gạch nền tảng của mạch số dùng để dựng bộ xử lý, bộ nhớ và các thiết bị logic số khác" — và trước thời tích hợp, mỗi con là một <strong>linh kiện rời</strong> phải hàn tay.</p>
<ul>
<li><strong>Nó hoạt động ra sao, theo nguyên văn slide</strong> — phần hoạt động làm bằng silic hoặc chất bán dẫn khác <em>có thể đổi trạng thái điện khi bị kích xung</em>; ở trạng thái bình thường vật liệu có thể dẫn hoặc không dẫn; và <em>transistor đổi trạng thái khi có điện áp đặt vào cực cổng (gate)</em>. Một cái công tắc điều khiển bằng điện áp: toàn bộ điện tử số gói trong một câu.</li>
<li><strong>Công tắc → cổng logic → mọi thứ.</strong> Đấu vài cái công tắc nối tiếp và song song là ra AND với OR; thêm phép đảo là ra NAND, mà từ NAND dựng được mọi hàm Boole. Cái chuỗi ấy — transistor → cổng logic → mạch cộng → ALU → CPU — chính là cái thang mà chương này đã leo XUỐNG, còn Chương 12 sẽ leo NGƯỢC lên.</li>
<li><strong>"Linh kiện rời" là thuật ngữ cần hiểu.</strong> Một transistor đơn lẻ tự chứa: "được sản xuất riêng, đóng gói trong vỏ riêng, rồi hàn hoặc đấu dây lại với nhau trên những tấm mạch kiểu ván ép". Mỗi mối nối là một thao tác của con người. Đó là lý do máy thế hệ hai đếm transistor bằng đơn vị nghìn còn chip hiện đại đếm bằng tỉ — giới hạn chưa bao giờ nằm ở ý tưởng, nó nằm ở SỨC NGƯỜI.</li>
<li><strong>Vài con số làm cú nhảy hiện rõ.</strong> ENIAC (thế hệ một) dùng 17.468 đèn điện tử và chiếm trọn một căn phòng. Con <strong>Intel 4004</strong>, vi xử lý đầu tiên, ra đời năm <strong>1971</strong> với <strong>2.300 transistor</strong> trên một con chip chạy 108 kHz (slide 28). Tới 2017, Core i9-7900X chứa <strong>7,2 tỉ</strong> transistor (slide 31). Từ 2.300 lên 7.200.000.000 là hệ số khoảng 3,1 triệu lần trong 46 năm — và đó là cảm giác thật của cụm từ "gấp đôi mỗi hai năm".</li>
<li><strong>Vì sao transistor xứng đáng có một slide riêng.</strong> Nó là chỗ vật lý gặp tin học. Mọi thứ nằm phía trên nó — tập lệnh, cache, hệ điều hành — đều là tiện nghi dựng trên đúng một sự thật: một điện áp nhỏ có thể đóng và ngắt một dòng điện, nhanh, tin cậy, hàng tỉ lần mỗi giây.</li>
</ul>
<p class="dap-an">✅ Một chỗ cần đính chính để mang đi tiếp. Slide 28 ghi nhãn một dòng là "<em>Feature size (m)</em>" với các giá trị 10, 8, 6, 3 cho những con vi xử lý thập niên 1970. Đơn vị KHÔNG phải mét — ký tự µ đã rụng mất trong lúc chuyển đổi file; phải đọc là <strong>µm (micromét)</strong>. Kích thước công nghệ của con 4004 là 10 µm = 10.000 nm. Slide 31 thì ghi đúng cho các con chip hiện đại: "Feature size (nm)" với các giá trị 250, 180, 65, 22 và 14. Chính việc đối chiếu hai slide với nhau mới lòi ra lỗi gõ — một thói quen đáng giữ trong mọi kỳ thi.</p>
<p class="pitfall">⚠️ Đừng nói "transistor thay thế đèn điện tử <em>vào năm 1947</em>". 1947 là năm phát minh; thế hệ máy tính thứ hai — những cỗ máy thật sự dựng bằng transistor — xuất hiện vào cuối thập niên 1950. Năm phát minh và năm của một thế hệ máy là hai mốc khác nhau, và đề thi khai thác đúng khe hở đó.</p>`],
    ]),
  ].join('\n'),
};
